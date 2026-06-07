# Medical Imaging Diagnosis Portal

Full-stack AI-assisted medical imaging diagnosis portal for MRI, CT Scan, and X-Ray workflows.

## Architecture

```text
frontend/ React + Tailwind
    -> backend/ FastAPI APIs
        -> TensorFlow/OpenCV AI module
            -> MongoDB or JSON fallback
```

## Folder Structure

```text
medical-imaging-portal/
├── frontend/     React, Tailwind, dashboard pages
├── backend/      FastAPI, TensorFlow CNN, OpenCV preprocessing
└── database/     MongoDB setup notes
```

## Run Backend

```powershell
cd C:\Users\H!Tech\IdeaProjects\untitled3\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Run Frontend

Open a second terminal:

```powershell
cd C:\Users\H!Tech\IdeaProjects\untitled3\frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## MongoDB

Create `backend/.env` from `backend/.env.example` if MongoDB is running locally:

```text
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=medical_imaging_portal
```

If MongoDB is unavailable, the backend automatically uses `backend/data/portal_db.json`.

## Research Title

Design and Implementation of an AI-Powered Medical Imaging Diagnosis Portal Using Deep Learning Techniques

## Disclaimer

This is an academic/portfolio project. AI output must be reviewed by licensed clinicians and should not be used as a standalone medical diagnosis.
