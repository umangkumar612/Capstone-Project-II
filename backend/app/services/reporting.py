from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from app.storage import REPORT_DIR, new_id, now_iso, save_record


def generate_report(scan: dict, remarks: str = "", approved_by: str = "") -> dict:
    report_id = new_id("report")
    report_path = REPORT_DIR / f"{report_id}.pdf"
    prediction = scan.get("prediction") or {}
    lines = [
        "Medical Imaging Diagnosis Portal",
        "AI-Assisted Diagnostic Report",
        "",
        f"Report ID: {report_id}",
        f"Patient ID: {scan.get('patientId', 'unknown')}",
        f"Patient Name: {scan.get('patientName', 'unknown')}",
        f"Scan Type: {scan.get('scanType', 'unknown').upper()}",
        f"Created: {now_iso()}",
        "",
        f"Disease Prediction: {prediction.get('disease', 'Pending')}",
        f"Confidence: {prediction.get('confidence', 'Pending')}",
        f"Risk Level: {prediction.get('riskLevel', 'Pending')}",
        f"Severity: {prediction.get('severity', 'Pending')}",
        f"Recommendation: {prediction.get('recommendation', 'Pending')}",
        "",
        "AI Explanation:",
        prediction.get("explanation", "Prediction has not been generated."),
        "",
        "Doctor Remarks:",
        remarks or "No remarks provided.",
        "",
        f"Approved By: {approved_by or 'Pending doctor approval'}",
        "",
        "Disclaimer: This report is AI-assisted and must be reviewed by a licensed clinician.",
    ]
    _write_simple_pdf(report_path, lines)
    report = {
        "id": report_id,
        "scanId": scan["id"],
        "patientId": scan["patientId"],
        "file": f"/reports/{report_path.name}",
        "remarks": remarks,
        "approvedBy": approved_by,
        "createdAt": now_iso(),
    }
    return save_record("reports", report)


def _write_simple_pdf(path: Path, lines: list[str]) -> None:
    content_lines = []
    y = 780
    for line in lines:
        wrapped = wrap(line, width=88) or [""]
        for part in wrapped:
            escaped = part.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            content_lines.append(f"BT /F1 10 Tf 50 {y} Td ({escaped}) Tj ET")
            y -= 16
            if y < 50:
                y = 780
    stream = "\n".join(content_lines).encode("latin-1", errors="replace")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
    ]
    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode())
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")
    xref = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode())
    pdf.extend(f"trailer << /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode())
    path.write_bytes(pdf)
