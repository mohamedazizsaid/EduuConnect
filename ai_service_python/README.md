# EduConnect AI Service (Python)

AI Recommendation and Grading engine built with FastAPI.

## Prerequisites
- Python 3.9+
- pip

## Installation

```bash
cd ai_service_python
pip install -r requirements.txt
```

## Running Locally

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Service will be available at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.
