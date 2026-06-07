from __future__ import annotations
from app.ai.heatmap import create_gradcam_style_heatmap
import shutil
from collections import Counter
from pathlib import Path
from typing import Any, Dict

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.ai.heatmap import create_gradcam_style_heatmap
from app.ai.model import MedicalImageAnalyzer
from app.auth import create_access_token, get_current_user, hash_password, public_user, require_roles, verify_password
from app.services.reporting import generate_report
from app.storage import REPORT_DIR, UPLOAD_DIR, find_scan, find_user_by_email, initialize_storage, new_id, now_iso, patient_history, read_db, save_record, update_scan

BASE_DIR = Path(__file__).resolve().parent.parent

initialize_storage()
analyzer = MedicalImageAnalyzer(BASE_DIR / "models" / "medical_cnn.keras")

app = FastAPI(
    title="Medical Imaging Diagnosis Portal",
    description="AI-assisted medical imaging analysis for MRI, CT Scan, and X-Ray workflows.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:49231", "http://127.0.0.1:49231"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_DIR), name="reports")


class PredictRequest(BaseModel):
    scanId: str


class ReportRequest(BaseModel):
    scanId: str
    remarks: str = ""
    approvedBy: str = ""


class RemarkRequest(BaseModel):
    scanId: str
    doctorName: str
    remarks: str
    approved: bool = False


class AuthRequest(BaseModel):
    name: str = ""
    email: str
    password: str
    role: str = "patient"
    patientId: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def index():
    return {"name": "Medical Imaging Diagnosis Portal API", "docs": "/docs"}


@app.get("/api/health")
def health():
    db_mode = "mongodb" if read_db() is not None and __import__("os").getenv("MONGODB_URI") else "json"
    return {"status": "ok", "database": db_mode, "modelWeightsLoaded": analyzer.model is not None}


@app.post("/api/auth/register")
def register(request: AuthRequest):
    email = request.email.strip().lower()
    role = request.role.strip().lower()
    if role not in {"patient", "doctor", "admin"}:
        raise HTTPException(status_code=400, detail="Role must be patient, doctor, or admin")
    if len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if find_user_by_email(email):
        raise HTTPException(status_code=409, detail="Email is already registered")

    user = {
        "id": new_id("user"),
        "name": request.name.strip() or email.split("@")[0],
        "email": email,
        "role": role,
        "patientId": request.patientId.strip() or (new_id("pat") if role == "patient" else ""),
        "passwordHash": hash_password(request.password),
        "createdAt": now_iso(),
    }
    save_record("users", user)
    return {"user": public_user(user), "token": create_access_token(user)}


@app.post("/api/auth/login")
def login(request: LoginRequest):
    user = find_user_by_email(request.email)
    if not user or not verify_password(request.password, user.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"user": public_user(user), "token": create_access_token(user)}


@app.get("/api/auth/me")
def me(user: Dict[str, Any] = Depends(get_current_user)):
    return public_user(user)


@app.post("/api/upload")
async def upload_scan(
    file: UploadFile = File(...),
    patientId: str = Form(...),
    patientName: str = Form(...),
    scanType: str = Form(...),
    role: str = Form("patient"),
    user: Dict[str, Any] = Depends(require_roles("patient", "doctor", "admin")),
):
    extension = Path(file.filename or "scan.png").suffix.lower() or ".png"
    if extension not in {".png", ".jpg", ".jpeg", ".bmp", ".webp", ".dcm"}:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    scan_id = new_id("scan")
    destination = UPLOAD_DIR / f"{scan_id}{extension}"
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    record = {
        "id": scan_id,
        "patientId": patientId,
        "patientName": patientName,
        "scanType": scanType.lower(),
        "uploadedBy": user["role"],
        "uploadedByUserId": user["id"],
        "fileName": file.filename,
        "file": f"/uploads/{destination.name}",
        "prediction": None,
        "heatmap": None,
        "status": "Uploaded",
        "createdAt": now_iso(),
    }
    return save_record("scans", record)


@app.post("/api/predict")
def predict_disease(request: PredictRequest, user: Dict[str, Any] = Depends(require_roles("patient", "doctor", "admin"))):
    scan = find_scan(request.scanId)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    image_path = UPLOAD_DIR / Path(scan["file"]).name
    prediction = analyzer.predict(image_path, scan["scanType"])
    heatmap_path = UPLOAD_DIR / f"{scan['id']}_heatmap.png"
    create_gradcam_style_heatmap(image_path, heatmap_path)

    return update_scan(
        scan["id"],
        {
            "prediction": prediction,
            "heatmap": f"/uploads/{heatmap_path.name}",
            "status": "AI Predicted",
            "predictedAt": now_iso(),
        },
    )


@app.post("/api/report")
def report(request: ReportRequest, user: Dict[str, Any] = Depends(require_roles("doctor", "admin", "patient"))):
    scan = find_scan(request.scanId)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if not scan.get("prediction"):
        raise HTTPException(status_code=400, detail="Generate prediction before report")
    report_record = generate_report(scan, request.remarks, request.approvedBy)
    update_scan(scan["id"], {"status": "Report Generated", "report": report_record["file"]})
    return report_record


@app.get("/api/history/{patient_id}")
def history(patient_id: str, user: Dict[str, Any] = Depends(require_roles("patient", "doctor", "admin"))):
    return {"patientId": patient_id, "scans": patient_history(patient_id)}


@app.get("/api/scans")
def scans(user: Dict[str, Any] = Depends(require_roles("doctor", "admin"))):
    return read_db()["scans"]


@app.post("/api/doctor/remarks")
def doctor_remarks(request: RemarkRequest, user: Dict[str, Any] = Depends(require_roles("doctor", "admin"))):
    scan = find_scan(request.scanId)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    remark = {
        "id": new_id("remark"),
        "scanId": request.scanId,
        "doctorName": request.doctorName,
        "remarks": request.remarks,
        "approved": request.approved,
        "createdAt": now_iso(),
    }
    save_record("doctorRemarks", remark)
    update_scan(request.scanId, {"status": "Approved" if request.approved else "Doctor Reviewed", "doctorRemark": remark})
    return remark


@app.get("/api/admin/analytics")
def analytics(user: Dict[str, Any] = Depends(require_roles("admin"))):
    scans_data = read_db()["scans"]
    predicted = [scan for scan in scans_data if scan.get("prediction")]
    return {
        "totalScans": len(scans_data),
        "predictedScans": len(predicted),
        "reportsGenerated": len([scan for scan in scans_data if scan.get("report")]),
        "diseaseCounts": Counter(scan["prediction"]["disease"] for scan in predicted),
        "scanTypeCounts": Counter(scan["scanType"] for scan in scans_data),
        "riskCounts": Counter(scan["prediction"]["riskLevel"] for scan in predicted),
    }
