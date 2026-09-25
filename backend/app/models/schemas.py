from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    response: str
    code: Optional[str] = None
    plot_path: Optional[str] = None
    data_preview: Optional[dict] = None
    error: Optional[str] = None


class SQLQueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = "default"


class SQLQueryResponse(BaseModel):
    result: Optional[list] = None
    columns: Optional[list] = None
    error: Optional[str] = None
    row_count: int = 0


class UploadResponse(BaseModel):
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    preview: dict
    session_id: str


class DataInfo(BaseModel):
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    dtypes: dict
    null_counts: dict
    statistics: Optional[dict] = None
