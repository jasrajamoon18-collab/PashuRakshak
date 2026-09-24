import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalType, LivestockCase } from '../types';
import { runAITriage } from '../utils/triageEngine';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  MessageSquare, 
  Upload, 
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FarmerDashboardView: React.FC = () => {
  const { addCase, setActiveTriageResult, setSelectedCase, cases, isOnline, language, alerts, t } = useApp();

  // Form State
  const [animalType, setAnimalType] = useState<AnimalType>('cow');
  const [breed, setBreed] = useState('Crossbred HF (संकरित गाय)');
  const [earTagId, setEarTagId] = useState('100489' + Math.floor(100000 + Math.random() * 900000));
  const [farmerName, setFarmerName] = useState('Tukaram Shinde (तुकाराम शिंदे)');
  const [farmerPhone, setFarmerPhone] = useState('+91 98224 81920');
  const [village, setVillage] = useState('Pabal (पाबळ)');
  const [block, setBlock] = useState('Shirur');
  const [district, setDistrict] = useState('Pune');
  const [lat, setLat] = useState(18.8350);
  const [lng, setLng] = useState(74.0540);
  const [gpsCaptured, setGpsCaptured] = useState(true);

  // Clinical Symptoms Checkboxes
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Profuse ropy salivation',
    'Interdigital foot lesions',
    'High fever (>104°F)'
  ]);

  const [temperatureF, setTemperatureF] = useState<number>(104.8);
  const [mortalityCount, setMortalityCount] = useState<number>(0);
  const [affectedCount, setAffectedCount] = useState<number>(2);
  const [totalHerdSize, setTotalHerdSize] = useState<number>(8);
  const [lastVaccinatedFMD, setLastVaccinatedFMD] = useState<string>('2025-11-10');
  const [lastVaccinatedHS, setLastVaccinatedHS] = useState<string>('2026-04-12');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);

  // Available symptom options
  const symptomOptions = [
    { id: 'sym_salivation', key: 'Profuse ropy salivation', labelEn: 'Profuse ropy salivation / drooling', labelMr: 'तोंडावाटे सतत फेसयुक्त लाळ गळणे', labelHi: 'मुंह से लगातार झागदार लार गिरना' },
    { id: 'sym_foot_lesions', key: 'Interdigital foot lesions', labelEn: 'Foot blisters & ulcers between hooves', labelMr: 'खुरांच्या बेचक्यात फोड व जखमा', labelHi: 'खुरों के बीच छाले व घाव' },
    { id: 'sym_oral_blisters', key: 'Oral blisters on tongue', labelEn: 'Vesicular blisters on tongue & gums', labelMr: 'जिभेवर व हिरड्यांवर फुटलेले फोड', labelHi: 'जीभ एवं मसूड़ों पर फटे हुए छाले' },
    { id: 'sym_high_fever', key: 'High fever (>104°F)', labelEn: 'High fever (>104°F / body shivering)', labelMr: 'तीव्र ताप (१०४° फॅ पेक्षा जास्त)', labelHi: 'तेज बुखार (104°F से अधिक)' },
    { id: 'sym_skin_nodules', key: 'Hard skin lumps / nodules (Lumpy Skin)', labelEn: 'Cutaneous lumps / round nodules (LSD)', labelMr: 'अंगावर ठळक गाठी (लम्पी स्कीन)', labelHi: 'त्वचा पर उभरी हुई गोल गांठें (LSD)' },
    { id: 'sym_throat_swelling', key: 'Painful throat and brisket swelling', labelEn: 'Painful brisket / throat edema (HS)', labelMr: 'घशाखाली व गळ्याला मोठी सूज (घटसर्प)', labelHi: 'गले और गलकंबल में दर्दनाक सूजन (HS)' },
    { id: 'sym_respiratory_distress', key: 'Severe respiratory distress & grunting', labelEn: 'Labored breathing / nasal grunting', labelMr: 'धाप लागणे व घरघर आवाज येणे', labelHi: 'गंभीर सांस कष्ट व घुरघुराहट' },
    { id: 'sym_sudden_lameness', key: 'Sudden lameness / inability to walk', labelEn: 'Severe lameness / difficulty standing', labelMr: 'अचानक लंगडणे व चालण्यास त्रास', labelHi: 'अचानक लंगड़ाना व खड़े होने में कष्ट' },
    { id: 'sym_milk_drop', key: 'Sudden milk drop', labelEn: 'Sudden complete drop in milk yield', labelMr: 'दूध उत्पादनात अचानक प्रचंड घट', labelHi: 'दूध उत्पादन में अचानक भारी गिरावट' },
    { id: 'sym_abortion', key: 'Late-term abortion storm', labelEn: 'Abortion in 6th-8th month (Brucellosis)', labelMr: 'गाभण जनावराचा अचानक गर्भपात', labelHi: 'गर्भवती पशु में अचानक गर्भपात' },
    { id: 'sym_dark_diarrhea', key: 'Dark bloody diarrhea', labelEn: 'Dark bloody diarrhea (PPR/Anthrax)', labelMr: 'काळपट रक्ताची हगवण', labelHi: 'खूनी दस्त (PPR/एंथ्रेक्स)' },
  ];

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setGpsCaptured(true);
        },
        err => {
          // fallback to simulated Pune coords
          setLat(18.8350);
          setLng(74.0540);
          setGpsCaptured(true);
        }
      );
    } else {
      setGpsCaptured(true);
    }
  };

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotos(prev => [url, ...prev]);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Run AI Disease Triage
      const triageResult = runAITriage({
        animalType,
        symptoms: selectedSymptoms,
        temperatureF,
        mortalityCount,
        lastVaccinatedFMD,
        lastVaccinatedHS,
        herdSize: totalHerdSize
      });

      const newCase: LivestockCase = {
        id: `case-${Date.now()}`,
        caseNumber: `PR-2026-${district.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        animalType,
        breed,
        ageYears: 4,
        earTagId,
        farmerName,
        farmerPhone,
        village,
        block,
        district,
        lat,
        lng,
        reportedDate: new Date().toISOString(),
        symptoms: selectedSymptoms,
        temperatureF,
        mortalityCount,
        affectedCount,
        totalHerdSize,
        lastVaccinatedFMD,
        lastVaccinatedHS,
        photos,
        triage: triageResult,
        status: 'Reported',
        assignedVet: triageResult.isEscalated ? {
          id: 'vet-1',
          name: 'Dr. Sunita Deshmukh, B.V.Sc',
          phone: '+91 94220 18293',
          clinic: 'Taluka Veterinary Polyclinic',
          etaMinutes: 20
        } : undefined,
        timeline: [
          {
            id: `t-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Reported',
            title: isOnline ? 'Case Logged to Central Health Surveillance' : 'Case Stored Offline in Local Device Cache',
            note: `Submitted by ${farmerName} (${village}). AI Triage initiated.`,
            actor: farmerName,
            role: 'Farmer'
          },
          {
            id: `t-${Date.now() + 1}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Triaged',
            title: `AI Triage: ${triageResult.probableDisease} (${triageResult.confidence}%)`,
            note: triageResult.recommendedAction,
            actor: 'PashuRakshak AI Engine',
            role: 'System'
          }
        ]
      };

      addCase(newCase);
      setIsSubmitting(false);

      // Trigger Confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 }
      });

      // Show Triage Result Modal
      setActiveTriageResult({
        triage: triageResult,
        caseData: newCase
      });

    }, 800);
  };

  // Farmer's own reported cases
  const myCases = cases.filter(c => c.farmerPhone === farmerPhone || c.farmerName.includes('Tukaram'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner with Offline Capability Notice & SMS fallback */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950 text-white border border-emerald-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-base font-bold">
              {language === 'mr' ? 'शेतकरी / पशुपालक आरोग्य सेवा पोर्टल' : language === 'hi' ? 'किसान / पशुपालक स्वास्थ्य सेवा पोर्टल' : 'Farmer Livestock Surveillance Desk'}
            </h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            {t('report_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SMS / IVR Fallback (No Internet)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Smart Offline Reporting Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-700" />
                <span>{t('report_title')}</span>
              </h3>
              {!isOnline && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <WifiOff className="w-3 h-3" /> Offline Enabled
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr' 
                ? 'जनावराची लक्षणे निवडा आणि त्वरित रोग अंदाज व प्रथमोपचार सल्ला मिळवा.' 
                : language === 'hi' 
                ? 'पशु के लक्षण चुनें और तुरंत रोग अनुमान व प्राथमिक उपचार निर्देश प्राप्त करें।'
                : 'Select clinical signs for immediate ML triage score, SHAP explanation and SOP.'}
            </p>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-6">
            
            {/* Row 1: Animal Type & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('animal_type')} *
                </label>
                <select
                  value={animalType}
                  onChange={e => setAnimalType(e.target.value as AnimalType)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="cow">{t('cow')}</option>
                  <option value="buffalo">{t('buffalo')}</option>
                  <option value="goat">{t('goat')}</option>
                  <option value="sheep">{t('sheep')}</option>
                  <option value="bull">{t('bull')}</option>
                  <option value="calf">{t('calf')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('ear_tag')} *
                </label>
                <input
                  type="text"
                  value={earTagId}
                  onChange={e => setEarTagId(e.target.value)}
                  placeholder="12-digit RFID Tag"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Row 2: Farmer & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('farmer_name')}
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('village_name')}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('taluka_block')}
                </label>
                <select
                  value={block}
                  onChange={e => setBlock(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Shirur">Shirur (शिरूर)</option>
                  <option value="Junnar">Junnar (जुन्नर)</option>
                  <option value="Ambegaon">Ambegaon (आंबेगाव)</option>
                  <option value="Baramati">Baramati (बारामती)</option>
                  <option value="Khed">Khed (खेड)</option>
                  <option value="Karad">Karad, Satara (कराड)</option>
                  <option value="Sangamner">Sangamner (संगमनेर)</option>
                </select>
              </div>
            </div>

            {/* Row 3: GPS Auto-Capture */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Farm Geolocation: </span>
                  <span className="font-mono text-slate-600">{lat}, {lng}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCaptureGps}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Update GPS
              </button>
            </div>

            {/* Row 4: Symptoms Checklist (Interactive Grid) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t('symptoms_checklist')} ({selectedSymptoms.length} selected) *
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                {symptomOptions.map(sym => {
                  const isChecked = selectedSymptoms.includes(sym.key);
                  const displayLabel = language === 'mr' ? sym.labelMr : language === 'hi' ? sym.labelHi : sym.labelEn;
                  return (
                    <label
                      key={sym.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border text-xs ${
                        isChecked 
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium' 
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSymptom(sym.key)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>{displayLabel}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Temperature, Herd Mortality, Affected count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rectal Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="98"
                  max="108"
                  value={temperatureF}
                  onChange={e => setTemperatureF(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sick Animals (बाधित)
                </label>
                <input
                  type="number"
                  min="1"
                  value={affectedCount}
                  onChange={e => setAffectedCount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-red-700">
                  Deaths (मृत्यू)
                </label>
                <input
                  type="number"
                  min="0"
                  value={mortalityCount}
                  onChange={e => setMortalityCount(Number(e.target.value))}
                  className="w-full border border-red-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Row 6: Vaccination History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last FMD (लाळ-खुरकूत) Vaccine Date
                </label>
                <input
                  type="date"
                  value={lastVaccinatedFMD}
                  onChange={e => setLastVaccinatedFMD(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last HS (घटसर्प) Vaccine Date
                </label>
                <input
                  type="date"
                  value={lastVaccinatedHS}
                  onChange={e => setLastVaccinatedHS(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Row 7: Clinical Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('upload_photos')}
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 hover:border-emerald-600 rounded-lg cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Attach Lesion Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photos.length > 0 && (
                  <div className="flex items-center gap-2">
                    {photos.slice(0, 3).map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="clinical lesion"
                        className="w-10 h-10 rounded object-cover border border-slate-200 shadow-xs"
                      />
                    ))}
                    <span className="text-[11px] text-slate-500 font-mono">({photos.length} photos ready)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || selectedSymptoms.length === 0}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? t('submitting') : t('submit_report')}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Farmer's Monitored Animals & Regional Bulletins (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Local Bulletins */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">Advisories in Your Taluka ({block})</h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">Active</span>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 2).map(alert => (
                <div key={alert.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs space-y-1">
                  <div className="font-bold text-slate-900">
                    {language === 'mr' ? alert.titleMarathi : language === 'hi' ? alert.titleHindi : alert.title}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {language === 'mr' ? alert.messageMarathi : language === 'hi' ? alert.messageHindi : alert.message}
                  </p>
                  <div className="text-[10px] text-amber-800 font-medium pt-1">
                    Target: {alert.targetBlock}, {alert.targetDistrict}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer's Previously Logged Animals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900">My Cattle & Cases ({myCases.length})</h4>
              <span className="text-xs text-slate-500 font-mono">Tukaram Shinde's Herd</span>
            </div>

            <div className="space-y-2.5">
              {myCases.map(c => {
                const isCritical = c.triage.severity === 'Critical';
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-slate-50/80 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{c.caseNumber}</span>
                        <span className="font-mono text-[10px] text-slate-500">[{c.earTagId}]</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        {c.breed} · {c.village}
                      </div>
                      <div className="font-medium text-emerald-800 text-[11px] mt-1">
                        Suspected: {language === 'mr' ? c.triage.diseaseMarathi : language === 'hi' ? c.triage.diseaseHindi : c.triage.probableDisease}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {c.triage.confidence}% confidence
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Veterinary Helpline Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white text-xs space-y-2">
            <div className="font-bold text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Assigned Taluka Polyclinic</span>
            </div>
            <p className="text-emerald-100 text-[11px]">
              Dr. Sunita Deshmukh, B.V.Sc & A.H.<br />
              Taluka Veterinary Polyclinic, Shirur, Pune.<br />
              Direct Emergency Hotline: <strong>+91 94220 18293</strong>
            </p>
          </div>
        </div>
      </div>

      {/* SMS & IVR Fallback Helper Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold">{t('sms_fallback_title')}</h3>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When working in deep rural valleys or remote hills with zero internet coverage, PashuRakshak supports both automated SMS syntax and 24x7 voice IVR dispatch:
            </p>

            {/* SMS Format Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
              <div className="text-slate-400 text-[11px]">SMS Syntax:</div>
              <div className="text-emerald-400 font-bold text-sm select-all">
                PR {earTagId} SALIVATION FOOT_LESIONS FEVER
              </div>
              <div className="text-slate-400 text-[11px]">Send to NIC / CDAC Gateway: <strong>56161</strong></div>
            </div>

            {/* Toll Free IVR */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-950">24x7 Interactive Voice Response (IVR) Helpline:</div>
              <div className="text-emerald-800 text-sm font-bold font-mono">1800-233-0248 (Toll-Free)</div>
              <div className="text-emerald-700 text-[11px]">
                Available in Marathi (१ दाबा), Hindi (२ दबाएं), and English (Press 3). Guides symptoms via keypress and dispatches local Pashu-Sevak.
              </div>
            </div>

            <button
              onClick={() => setShowSmsModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-xs"
            >
              Close Helper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
