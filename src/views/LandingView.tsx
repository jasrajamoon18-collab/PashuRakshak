import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  WifiOff, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  CloudRain, 
  Wind, 
  Thermometer, 
  HeartHandshake,
  Stethoscope,
  Building,
  Microscope,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

export const LandingView: React.FC = () => {
  const { setActiveView, setRole, language, weatherData, cases, riskAreas, t } = useApp();
  const [selectedWeatherDistrict, setSelectedWeatherDistrict] = useState('Pune');

  const currentWeather = weatherData.find(w => w.district === selectedWeatherDistrict) || weatherData[0];

  const handleRoleSelect = (roleKey: UserRole, targetView: string) => {
    setRole(roleKey);
    setActiveView(targetView);
  };

  const tickerItems = [
    { loc: 'Baramati, Pune', disease: 'Lumpy Skin (LSD)', status: 'Vet Dispatched 18m ago', type: 'lsd' },
    { loc: 'Junnar, Pune', disease: 'Hemorrhagic Septicemia (HS)', status: 'Quarantine Radius Active (1km)', type: 'critical' },
    { loc: 'Pabal, Shirur', disease: 'Foot and Mouth (FMD)', status: 'NADCP Ring Vaccination Enforced', type: 'fmd' },
    { loc: 'Karad, Satara', disease: 'Suspected Bovine Mastitis', status: 'Oral antibiotic course prescribed', type: 'stable' },
    { loc: 'Ashwi, Sangamner', disease: 'PPR Goat Plague', status: 'Flock isolated, swab collected', type: 'ppr' },
  ];

  return (
    <div className="space-y-12">
      {/* Real-time State Health Pulse Ticker */}
      <div className="bg-slate-900 text-white py-2.5 px-4 overflow-hidden border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold uppercase tracking-wider text-emerald-400 text-[11px]">
              Live State Health Pulse:
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs">
                <span className="font-semibold text-white">{item.loc}</span>
                <span className="text-slate-400">·</span>
                <span className={item.type === 'critical' ? 'text-red-400 font-semibold' : item.type === 'fmd' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {item.disease}
                </span>
                <span className="text-slate-500">[{item.status}]</span>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 shrink-0 text-slate-400 text-[11px] font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Updated: Just Now</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-800/40">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart India Hackathon 2026 · Problem Statement 26128</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {t('hero_headline')}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              {t('hero_sub')}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => { setRole('farmer'); setActiveView('farmer'); }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>Report Sick Livestock (Offline-Ready)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { setRole('authority'); setActiveView('authority'); }}
                className="bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/40 font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>GIS Hotspot Command Center</span>
              </button>
            </div>
          </div>

          {/* Key Crisis vs Solution Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-emerald-800/50">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">₹20,000 Cr</div>
              <div className="text-xs text-emerald-200/80 mt-1">Annual FMD Economic Toll</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1 : 10,000</div>
              <div className="text-xs text-emerald-200/80 mt-1">Maharashtra Vet-to-Animal Ratio</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">2.3 Crore</div>
              <div className="text-xs text-emerald-200/80 mt-1">Cattle & Buffalo in State</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">₹18.4 Cr</div>
              <div className="text-xs text-emerald-200/80 mt-1">Preserved via Early Triage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Instant Access Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl font-bold text-slate-900">Connected 5-Stakeholder Response Grid</h2>
          <p className="text-xs text-slate-500 mt-1">Select a role to preview dedicated interface, permissions, and active workflows</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Farmer */}
          <button
            onClick={() => handleRoleSelect('farmer', 'farmer')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
              👨‍🌾
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
              {t('role_farmer')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Offline symptom report, voice AI assistant, SMS fallback.
            </div>
          </button>

          {/* Pashu-Sevak */}
          <button
            onClick={() => handleRoleSelect('pashusevak', 'pipeline')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
              🩺
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-teal-800">
              {t('role_pashusevak')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Field visits, cold-chain sample logging, ring vaccination.
            </div>
          </button>

          {/* Veterinarian */}
          <button
            onClick={() => handleRoleSelect('vet', 'vet')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
              🥼
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-800">
              {t('role_vet')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              AI differential triage review, route planner, e-prescriptions.
            </div>
          </button>

          {/* Lab Scientist */}
          <button
            onClick={() => handleRoleSelect('lab', 'lab')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
              🔬
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-purple-800">
              {t('role_lab')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Sample manifest, RT-PCR verification, active learning feedback.
            </div>
          </button>

          {/* District Admin */}
          <button
            onClick={() => handleRoleSelect('authority', 'authority')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all text-left group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-800">
              {t('role_authority')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              DBSCAN hotspot radar, ring quarantine zones, bulk SMS broadcast.
            </div>
          </button>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-t border-slate-200 pt-10">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Engineered for Harsh Rural Realities</h3>
            <p className="text-sm text-slate-600 mt-2">
              Unlike generic hospital management software, PashuRakshak operates offline, incorporates epidemiological priors, and communicates natively in Marathi, Hindi, and English.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">1. Offline-First Reporting</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stores photos, symptoms, and GPS coordinates locally in IndexedDB/LocalStorage. Queued records automatically flush to state cloud when connectivity resumes.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700">
                + Zero-connectivity SMS / USSD Fallback
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">2. Explainable AI Triage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gradient-boosted decision tree triages FMD, HS, Anthrax, PPR, LSD, and Brucellosis with transparent SHAP feature contributions so field vets trust the recommendation.
              </p>
              <div className="text-[11px] font-semibold text-blue-700">
                + Rule-based NADCP Safety Net
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">3. GIS Outbreak Radar</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                DBSCAN spatial clustering identifies abnormal mortality spikes in real time. Authorities deploy 1km infected zones and 5km surveillance vaccination rings on interactive maps.
              </p>
              <div className="text-[11px] font-semibold text-amber-700">
                + 14-Day Outbreak Progression Replay
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">4. Multilingual Warnings</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates localized advisories in Marathi, Hindi, and English. Dispatches notifications across FCM mobile push, SMS gateways, and automated voice IVR calls.
              </p>
              <div className="text-[11px] font-semibold text-purple-700">
                + Voice AI Chatbot "Pashu-Mitra"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMD Weather Integration & Disease Correlation Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">IMD Agro-Meteorological Disease Risk Index</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Micro-climate humidity and wind vectors correlated with pathogen aerosol transmission
              </p>
            </div>

            {/* District Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Select Region:</span>
              <select
                value={selectedWeatherDistrict}
                onChange={e => setSelectedWeatherDistrict(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {weatherData.map(w => (
                  <option key={w.district} value={w.district}>{w.district} District</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5">
            <div className="flex items-center gap-3">
              <Thermometer className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Ambient Temp</div>
                <div className="text-lg font-bold font-mono text-white">{currentWeather.tempC}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CloudRain className="w-6 h-6 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Relative Humidity</div>
                <div className="text-lg font-bold font-mono text-sky-300">{currentWeather.humidityPct}%</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-teal-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Wind Velocity</div>
                <div className="text-lg font-bold font-mono text-white">{currentWeather.windSpeedKmh} km/h</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">FMD Spread Risk</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-sm font-bold ${currentWeather.fmdRiskIndex === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                  {currentWeather.fmdRiskIndex} Risk
                </span>
                <span className="text-[11px] text-slate-400">({currentWeather.humidityPct > 80 ? 'Viral Aerosol Active' : 'Stable'})</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/60 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Epidemiological Note: </strong>
              {language === 'mr' ? currentWeather.notesMarathi : language === 'hi' ? currentWeather.notesHindi : currentWeather.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
