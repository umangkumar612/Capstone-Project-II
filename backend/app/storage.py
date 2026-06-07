from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
REPORT_DIR = DATA_DIR / "reports"
DB_FILE = DATA_DIR / "portal_db.json"

try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env")
except Exception:
    pass

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB = os.getenv("MONGODB_DB", "medical_imaging_portal")


def _mongo_db():
    if not MONGODB_URI:
        return None
    try:
        from pymongo import MongoClient

        return MongoClient(MONGODB_URI, serverSelectionTimeoutMS=1200)[MONGODB_DB]
    except Exception:
        return None


def _clean_mongo(record: Dict[str, Any]) -> Dict[str, Any]:
    record.pop("_id", None)
    return record


def initialize_storage() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    if not DB_FILE.exists():
        _write_db({"scans": [], "reports": [], "users": [], "doctorRemarks": []})


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_db() -> Dict[str, Any]:
    mongo = _mongo_db()
    if mongo is not None:
        try:
            mongo.command("ping")
            return {
                "scans": [_clean_mongo(item) for item in mongo.scans.find()],
                "reports": [_clean_mongo(item) for item in mongo.reports.find()],
                "users": [_clean_mongo(item) for item in mongo.users.find()],
                "doctorRemarks": [_clean_mongo(item) for item in mongo.doctorRemarks.find()],
            }
        except Exception:
            pass

    initialize_storage()
    return json.loads(DB_FILE.read_text(encoding="utf-8"))


def _write_db(data: Dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def save_record(collection: str, record: Dict[str, Any]) -> Dict[str, Any]:
    mongo = _mongo_db()
    if mongo is not None:
        try:
            mongo[collection].insert_one(dict(record))
            return record
        except Exception:
            pass

    db = read_db()
    db.setdefault(collection, []).append(record)
    _write_db(db)
    return record


def update_scan(scan_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    mongo = _mongo_db()
    if mongo is not None:
        try:
            mongo.scans.update_one({"id": scan_id}, {"$set": patch})
            scan = mongo.scans.find_one({"id": scan_id})
            return _clean_mongo(scan) if scan else None
        except Exception:
            pass

    db = read_db()
    for scan in db["scans"]:
        if scan["id"] == scan_id:
            scan.update(patch)
            _write_db(db)
            return scan
    return None


def find_scan(scan_id: str) -> Optional[Dict[str, Any]]:
    return next((scan for scan in read_db()["scans"] if scan["id"] == scan_id), None)


def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    normalized = email.strip().lower()
    return next((user for user in read_db()["users"] if user.get("email", "").lower() == normalized), None)


def patient_history(patient_id: str) -> List[Dict[str, Any]]:
    scans = [scan for scan in read_db()["scans"] if scan["patientId"] == patient_id]
    return sorted(scans, key=lambda scan: scan["createdAt"], reverse=True)
