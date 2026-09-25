import openai
from app.config import OPENAI_API_KEY, OPENAI_MODEL

client = openai.OpenAI(api_key=OPENAI_API_KEY)


def get_chat_completion(messages: list, temperature: float = 0.3) -> str:
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=4096,
    )
    return response.choices[0].message.content
