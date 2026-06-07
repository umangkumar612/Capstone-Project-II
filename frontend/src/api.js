import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(payload) {
  const response = await api.post("/api/auth/login", payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function uploadAndPredict(formData) {
  const upload = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  const prediction = await api.post("/api/predict", { scanId: upload.data.id });
  return prediction.data;
}

export async function getHistory(patientId) {
  const response = await api.get(`/api/history/${encodeURIComponent(patientId)}`);
  return response.data.scans;
}

export async function getScans() {
  const response = await api.get("/api/scans");
  return response.data;
}

export async function saveDoctorReview(payload) {
  const response = await api.post("/api/doctor/remarks", payload);
  if (payload.approved) {
    await api.post("/api/report", {
      scanId: payload.scanId,
      remarks: payload.remarks,
      approvedBy: payload.doctorName
    });
  }
  return response.data;
}

export async function generateReport(payload) {
  const response = await api.post("/api/report", payload);
  return response.data;
}

export async function getAnalytics() {
  const response = await api.get("/api/admin/analytics");
  return response.data;
}
