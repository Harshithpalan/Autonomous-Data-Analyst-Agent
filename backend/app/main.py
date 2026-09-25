from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.routes import upload, chat, data
from app.config import OUTPUT_DIR

app = FastAPI(title="Autonomous Data Analyst Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(data.router)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")


@app.get("/")
async def root():
    return {"message": "Autonomous Data Analyst Agent API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
