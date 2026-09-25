from fastapi import APIRouter, HTTPException
from app.models.schemas import SQLQueryRequest, SQLQueryResponse, DataInfo
from app.agents.analyst import analyst
from app.services.data_handler import data_handler

router = APIRouter(prefix="/api/data", tags=["data"])


@router.get("/info/{session_id}", response_model=DataInfo)
async def get_data_info(session_id: str):
    try:
        info = data_handler.get_data_info(session_id)
        return DataInfo(**info)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/preview/{session_id}")
async def get_data_preview(session_id: str, rows: int = 10):
    try:
        df = data_handler.get_dataframe(session_id)
        preview = df.head(rows).to_dict(orient="records")
        return {"columns": list(df.columns), "rows": preview, "total_rows": len(df)}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/sql", response_model=SQLQueryResponse)
async def execute_sql(request: SQLQueryRequest):
    try:
        result = analyst.sql_query(request.query, request.session_id)
        return SQLQueryResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")
