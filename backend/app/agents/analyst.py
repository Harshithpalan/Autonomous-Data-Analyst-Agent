import re
import uuid
import os
from typing import Optional
from app.services.openai_client import get_chat_completion
from app.services.data_handler import data_handler
from app.services.visualizer import visualizer
from app.agents.prompts import SYSTEM_PROMPT, CODE_EXTRACTION_PROMPT, SQL_CONTEXT_PROMPT
from app.config import OUTPUT_DIR


class AnalystAgent:
    def __init__(self):
        self.conversations: dict = {}

    def _extract_code(self, response: str) -> Optional[str]:
        pattern = r"```python\s*\n(.*?)```"
        matches = re.findall(pattern, response, re.DOTALL)
        if matches:
            return matches[-1].strip()
        return None

    def _get_conversation_history(self, session_id: str) -> list:
        if session_id not in self.conversations:
            self.conversations[session_id] = []
        return self.conversations[session_id]

    def chat(self, message: str, session_id: str = "default") -> dict:
        history = self._get_conversation_history(session_id)
        df = data_handler.get_dataframe(session_id)
        data_context = data_handler.get_data_context(session_id)

        system_msg = f"{SYSTEM_PROMPT}\n\nCurrent Dataset Context:\n{data_context}"
        messages = [{"role": "system", "content": system_msg}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})

        response = get_chat_completion(messages)

        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": response})

        code = self._extract_code(response)
        result = {"response": response, "code": code, "plot_path": None, "data_preview": None, "error": None}

        if code:
            exec_result = visualizer.execute_and_visualize(code, df, session_id)
            result["plot_path"] = exec_result.get("plot_path")
            if exec_result.get("error"):
                result["error"] = exec_result["error"]
            if exec_result.get("text"):
                result["response"] += f"\n\n**Execution Result:**\n```\n{exec_result['text']}\n```"

        preview = df.head(10).to_dict(orient="records")
        result["data_preview"] = {"columns": list(df.columns), "rows": preview}

        return result

    def sql_query(self, query: str, session_id: str = "default") -> dict:
        try:
            schema = data_handler.get_data_context(session_id)
            messages = [
                {"role": "system", "content": SQL_CONTEXT_PROMPT.format(schema=schema)},
                {"role": "user", "content": f"Execute this SQL query and explain the results:\n{query}"},
            ]

            result = data_handler.execute_sql(session_id, query)
            explanation = get_chat_completion(messages)

            return {
                "result": result["result"],
                "columns": result["columns"],
                "row_count": result["row_count"],
                "explanation": explanation,
                "error": None,
            }
        except Exception as e:
            return {"result": None, "columns": None, "row_count": 0, "explanation": None, "error": str(e)}

    def clear_session(self, session_id: str):
        if session_id in self.conversations:
            del self.conversations[session_id]


analyst = AnalystAgent()
