import pandas as pd
import os
import uuid
from typing import Optional
from sqlalchemy import create_engine, text
from app.config import UPLOAD_DIR


class DataHandler:
    def __init__(self):
        self.sessions: dict = {}
        self.engines: dict = {}

    def load_file(self, filepath: str, session_id: Optional[str] = None) -> dict:
        if session_id is None:
            session_id = str(uuid.uuid4())

        ext = os.path.splitext(filepath)[1].lower()
        if ext == ".csv":
            df = pd.read_csv(filepath)
        elif ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

        self.sessions[session_id] = {
            "dataframe": df,
            "filename": os.path.basename(filepath),
            "filepath": filepath,
        }

        engine = create_engine("sqlite:///:memory:")
        df.to_sql("dataset", engine, index=False, if_exists="replace")
        self.engines[session_id] = engine

        preview = df.head(10).to_dict(orient="records")
        return {
            "session_id": session_id,
            "filename": os.path.basename(filepath),
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "preview": preview,
        }

    def get_dataframe(self, session_id: str) -> pd.DataFrame:
        if session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")
        return self.sessions[session_id]["dataframe"]

    def execute_sql(self, session_id: str, query: str) -> dict:
        if session_id not in self.engines:
            raise ValueError(f"Session {session_id} not found")

        engine = self.engines[session_id]
        with engine.connect() as conn:
            result = conn.execute(text(query))
            rows = result.fetchall()
            columns = list(result.keys())

        data = [dict(zip(columns, row)) for row in rows]
        return {"columns": columns, "result": data, "row_count": len(data)}

    def get_data_info(self, session_id: str) -> dict:
        df = self.get_dataframe(session_id)
        info = {
            "filename": self.sessions[session_id]["filename"],
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "null_counts": df.isnull().sum().to_dict(),
            "statistics": df.describe().to_dict(),
        }
        return info

    def get_data_context(self, session_id: str) -> str:
        df = self.get_dataframe(session_id)
        info = self.get_data_info(session_id)
        context = f"Dataset: {info['filename']}\n"
        context += f"Shape: {info['rows']} rows x {info['columns']} columns\n"
        context += f"Columns: {', '.join(info['column_names'])}\n"
        context += f"Dtypes:\n"
        for col, dtype in info["dtypes"].items():
            context += f"  {col}: {dtype}\n"
        context += f"\nFirst 5 rows:\n{df.head().to_string()}\n"
        context += f"\nBasic Statistics:\n{df.describe().to_string()}"
        return context


data_handler = DataHandler()
