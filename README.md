# Autonomous Data Analyst Agent

An AI-powered web application that autonomously analyzes your data. Upload CSV/Excel files and let GPT-4 analyze, visualize, and answer questions about your data.

## Features

- **File Upload** — Drag-and-drop CSV/Excel files with instant data preview
- **Natural Language Chat** — Ask questions like "What's the average revenue by region?"
- **Auto Code Generation** — AI writes and executes Python/pandas code
- **Auto Visualization** — Generates charts based on analysis context
- **SQL Query Mode** — Query uploaded data using SQL syntax
- **Session Memory** — Maintains conversation context per upload

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | FastAPI, Python, Pandas |
| AI | OpenAI GPT-4 |
| Visualization | Matplotlib, Plotly |

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
python run.py
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload CSV/Excel file |
| POST | `/api/chat` | Send analysis question |
| DELETE | `/api/chat/{session_id}` | Clear chat session |
| GET | `/api/data/info/{session_id}` | Get dataset info |
| GET | `/api/data/preview/{session_id}` | Preview data |
| POST | `/api/data/sql` | Execute SQL query |

## Usage

1. Start the backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Upload a CSV or Excel file
4. Ask questions in the chat or write SQL queries
5. View generated visualizations and analysis results

## License

MIT
