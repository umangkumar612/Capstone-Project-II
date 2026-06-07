const state = {
  currentPatientId: "PAT-1001",
  scans: [],
};

const $ = (selector) => document.querySelector(selector);

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".workspace").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
    if (button.dataset.tab === "doctor") loadScans();
    if (button.dataset.tab === "admin") loadAnalytics();
  });
});

$("#uploadForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  state.currentPatientId = data.get("patientId");
  try {
    setPredictionLoading("Preparing your image...");
    const uploaded = await api("/api/upload", { method: "POST", body: data });
    setPredictionLoading("Preparing scan insights...");
    const predicted = await api("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanId: uploaded.id }),
    });
    renderPrediction(predicted);
    await loadHistory();
    await loadScans();
  } catch (error) {
    setPredictionLoading(error.message);
  }
});

$("#loadHistory").addEventListener("click", loadHistory);
$("#refreshScans").addEventListener("click", loadScans);
$("#loadAnalytics").addEventListener("click", loadAnalytics);

$("#doctorForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  data.approved = event.currentTarget.approved.checked;
  await api("/api/doctor/remarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (data.approved) {
    await api("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanId: data.scanId, remarks: data.remarks, approvedBy: data.doctorName }),
    });
  }
  await loadScans();
  await loadAnalytics();
});

async function api(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  return response.json();
}

function setPredictionLoading(message) {
  $("#predictionState").classList.remove("hidden");
  $("#predictionState").textContent = message;
  $("#predictionResult").classList.add("hidden");
}

function renderPrediction(scan) {
  const prediction = scan.prediction;
  $("#predictionState").classList.add("hidden");
  const container = $("#predictionResult");
  container.classList.remove("hidden");
  container.innerHTML = `
    <div class="comparison">
      <img src="${scan.file}" alt="Original medical scan">
      <img src="${scan.heatmap}" alt="Grad-CAM heatmap">
    </div>
    <div class="diagnosis">
      <h3>${prediction.disease}</h3>
      <div class="badge-row">
        <span class="badge">${prediction.confidence} confidence</span>
        <span class="badge risk">${prediction.riskLevel} risk</span>
        <span class="badge">${prediction.severity} severity</span>
      </div>
      <p class="explanation">${prediction.explanation}</p>
      <p><strong>Recommendation:</strong> ${prediction.recommendation}</p>
      <div class="bar" aria-label="Confidence score"><span style="width:${prediction.confidenceValue}%"></span></div>
      <div class="actions">
        <button onclick="generateReport('${scan.id}')">Generate Report</button>
      </div>
    </div>`;
}

async function generateReport(scanId) {
  const report = await api("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scanId, remarks: "Generated from patient dashboard.", approvedBy: "" }),
  });
  window.open(report.file, "_blank");
  await loadHistory();
}

async function loadHistory() {
  const data = await api(`/api/history/${encodeURIComponent(state.currentPatientId)}`);
  $("#historyList").innerHTML = data.scans.map(renderSmallScan).join("") || `<div class="empty">No scans found.</div>`;
}

async function loadScans() {
  state.scans = await api("/api/scans");
  $("#doctorList").innerHTML = state.scans.map(renderDoctorScan).join("") || `<div class="empty">No uploaded scans.</div>`;
}

async function loadAnalytics() {
  const analytics = await api("/api/admin/analytics");
  $("#analytics").innerHTML = `
    <div class="metric">Total scans: ${analytics.totalScans}</div>
    <div class="metric">Prepared insights: ${analytics.predictedScans}</div>
    <div class="metric">Reports: ${analytics.reportsGenerated}</div>
    <div class="metric">High risk: ${analytics.riskCounts.High || 0}</div>`;
  await loadScans();
  drawConfidenceChart(state.scans.filter((scan) => scan.prediction));
}

function renderSmallScan(scan) {
  const disease = scan.prediction?.disease || "Insight pending";
  return `
    <article class="scan-card">
      <img class="scan-image" src="${scan.heatmap || scan.file}" alt="Medical scan">
      <div class="scan-body">
        <strong>${disease}</strong>
        <span>${scan.scanType.toUpperCase()} | ${scan.status}</span>
        <span>${scan.id}</span>
        <div class="actions">${scan.report ? `<a href="${scan.report}" target="_blank">Download PDF</a>` : ""}</div>
      </div>
    </article>`;
}

function renderDoctorScan(scan) {
  const prediction = scan.prediction;
  const confidence = prediction ? `${prediction.confidence} | ${prediction.riskLevel}` : "Awaiting scan insight";
  const report = scan.report ? `<a href="${scan.report}" target="_blank">Final PDF</a>` : "";
  return `
    <article class="scan-card">
      <img class="scan-image" src="${scan.heatmap || scan.file}" alt="Medical scan">
      <div class="scan-body">
        <strong>${scan.patientName}</strong>
        <span>${scan.id}</span>
        <span>${scan.scanType.toUpperCase()} | ${scan.status}</span>
        <span>${prediction?.disease || "No scan insight yet"} | ${confidence}</span>
        <div class="actions">
          <button onclick="prefillReview('${scan.id}')">Review</button>
          ${report}
        </div>
      </div>
    </article>`;
}

function prefillReview(scanId) {
  $("#doctorForm").scanId.value = scanId;
}

function drawConfidenceChart(scans) {
  const canvas = $("#confidenceChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#17212b";
  ctx.font = "14px Segoe UI";
  ctx.fillText("Recent review confidence scores", 24, 28);
  const maxBars = Math.min(scans.length, 8);
  const width = 70;
  scans.slice(-maxBars).forEach((scan, index) => {
    const value = scan.prediction.confidenceValue;
    const height = value * 1.8;
    const x = 34 + index * 102;
    const y = 230 - height;
    ctx.fillStyle = value >= 88 ? "#be123c" : value >= 68 ? "#b45309" : "#0f766e";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#17212b";
    ctx.fillText(`${value}%`, x + 10, y - 8);
    ctx.fillText(scan.scanType.toUpperCase(), x + 4, 248);
  });
  if (!scans.length) {
    ctx.fillStyle = "#657282";
    ctx.fillText("No insight data available.", 24, 80);
  }
}

loadHistory().catch(() => {});
