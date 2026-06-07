import React from "react";
export const stats = [
  { label: "Total Patients", value: 12840, suffix: "+" },
  { label: "Total Scans Processed", value: 48200, suffix: "+" },
  { label: "Accuracy Rate", value: 94.8, suffix: "%" },
  { label: "Active Doctors", value: 312, suffix: "+" }
];

export const features = [
  "Smart Scan Review",
  "MRI Insight",
  "CT Scan Screening",
  "X-Ray Support",
  "Ready-to-Share Reports",
  "Private Case Library"
];

export const testimonials = [
  {
    name: "Dr. Meera Rao",
    role: "Radiologist",
    quote: "The portal organizes scans, AI findings, heatmaps, and reporting into one clean workflow."
  },
  {
    name: "Dr. Arjun Sen",
    role: "Pulmonologist",
    quote: "Confidence-based predictions make triage faster while keeping doctors in full control."
  },
  {
    name: "Nisha Kapoor",
    role: "Hospital Admin",
    quote: "The dashboards make scan volume, activity, and reporting status easy to monitor."
  }
];

export const faq = [
  ["Is this a replacement for doctors?", "No. The AI output is decision support and must be reviewed by licensed clinicians."],
  ["Which scans are supported?", "The portal supports MRI, CT Scan, X-Ray, image formats, and optional DICOM upload workflows."],
  ["Can reports be downloaded?", "Yes. Reports can be prepared as polished PDFs for consultation, sharing, or record keeping."],
  ["Is my medical information private?", "Yes. Each person sees only the workspace and records intended for their care journey."]
];

export const analyticsData = [
  { month: "Jan", scans: 1200, accuracy: 91 },
  { month: "Feb", scans: 1660, accuracy: 92 },
  { month: "Mar", scans: 2100, accuracy: 93 },
  { month: "Apr", scans: 2480, accuracy: 94 },
  { month: "May", scans: 3120, accuracy: 95 },
  { month: "Jun", scans: 3600, accuracy: 95 }
];

export const activityLogs = [
  "New scan insight prepared for PAT-1001",
  "Dr. Meera approved scan report",
  "New CT scan uploaded to queue",
  "Care team reviewed analytics summary"
];
