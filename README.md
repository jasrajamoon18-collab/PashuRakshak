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
