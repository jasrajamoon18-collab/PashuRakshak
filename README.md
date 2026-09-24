# 🐄 PashuRakshak — AI-Powered Livestock Health Surveillance Platform

&gt; **Report. Triage. Map. Alert. Respond.**
&gt; Detect livestock disease outbreaks early, respond faster, and protect every animal — even in zero-connectivity villages.

Built for **Smart India Hackathon 2026** | Problem Statement ID: **26128** | Team: **StarLogicX2**

---

## 🚨 The Problem
India's livestock sector loses **₹20,000+ crore annually** to Foot-and-Mouth Disease alone. With a veterinarian-to-animal ratio of **1:10,000** and paper-based, delayed reporting, outbreaks spread before authorities even know they exist.

## 💡 The Solution
PashuRakshak connects **Farmers → Pashu-Sevaks → Veterinarians → Laboratories → District Authorities** on one AI-powered platform with six modules:

| Module | What it does |
|---|---|
| **1. Offline-First Reporting** | Farmers log symptoms, photos, mortality & GPS via app/SMS/IVR — syncs when network returns |
| **2. AI Disease Triage** | Symptom + history engine proposes probable disease (FMD, HS, PPR, Anthrax, LSD) with severity & explainable reasoning |
| **3. Outbreak Risk Intelligence** | Live risk scores per village/block/district fusing symptoms, weather, mortality & vaccination coverage |
| **4. GIS Hotspot Mapping** | Interactive PostGIS/Leaflet heatmaps with clustering for targeted surveillance & ring-fencing |
| **5. Multilingual Alerts** | Marathi / Hindi / English advisories via push, SMS & IVR |
| **6. Connected Response Network** | End-to-end case tracking: Reported → Triaged → Vet → Lab → Treatment → Resolved |

## 🛠️ Tech Stack
- **Frontend:** React + Tailwind CSS, Leaflet (maps), Recharts (analytics)
- **Backend:** FastAPI (Python) REST APIs
- **Database:** PostgreSQL + PostGIS (spatial queries)
- **AI/ML:** XGBoost triage classifier, SHAP explainability, active learning from lab-confirmed cases
- **Integrations:** FCM push, SMS gateway, IVR, IMD/OpenWeather API, NADCP & e-GOPALA records

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/your-username/pashurakshak.git
cd pashurakshak

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
PashuRakshak (पशुरक्षक — "Protector of Animals") is a full-stack AI-powered livestock disease surveillance and early-warning platform, developed for Smart India Hackathon 2026 (Problem Statement 26128: Efficient systems for early detection, prevention, and management of livestock diseases and animal health issues).
🐄 The Problem
India is the world's largest livestock producer, yet disease outbreaks like FMD, HS, PPR, and LSD cause losses exceeding ₹20,000 crore annually. Detection is slow, reporting is paper-based, and with a veterinarian-to-animal ratio of 1:10,000, early intervention is nearly impossible in rural areas.
💡 Our Solution
PashuRakshak connects Farmers → Pashu-Sevaks → Veterinarians → Laboratories → District Authorities on a single platform with six integrated modules:
Offline-First Smart Reporting — symptom logs, photos, GPS, and mortality captured via app, SMS, or IVR; syncs when network returns
AI-Assisted Disease Triage — XGBoost-based engine proposes probable disease and severity with SHAP explainability; critical cases auto-escalate to vets
Outbreak Risk Intelligence — fuses symptom clusters, weather, mortality, and vaccination coverage into a live risk score per village/block/district
GIS Hotspot Mapping — PostGIS + Leaflet heatmaps with DBSCAN clustering for targeted surveillance and ring-fencing
Multilingual Early Warnings — Marathi/Hindi/English advisories delivered via push, SMS, and IVR
Connected Response Network — end-to-end case tracking from report to resolution
🌍 Impact
A 15% reduction in FMD losses alone saves ₹3,000+ crore annually, while AI triage multiplies each veterinarian's effective coverage by 10× — protecting 2.3 crore animals in Maharashtra and 30+ crore nationally.
Built with React, FastAPI, PostgreSQL/PostGIS, XGBoost, and Leaflet.
