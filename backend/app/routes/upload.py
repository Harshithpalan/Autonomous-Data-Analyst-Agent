import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import UploadResponse
from app.services.data_handler import data_handler
from app.config import UPLOAD_DIR

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    allowed = [".csv", ".xlsx", ".xls"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed)}")

    session_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_DIR, f"{session_id}{ext}")

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    try:
        result = data_handler.load_file(filepath, session_id)
        return UploadResponse(**result)
    except Exception as e:
        os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
