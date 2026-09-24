import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LivestockCase } from '../types';
import { 
  Stethoscope, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Trash2, 
  Send, 
  Printer, 
  AlertTriangle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VetDashboardView: React.FC = () => {
  const { cases, updateCaseStatus, updateLabResult, setSelectedCase, language, t } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Prescription Form State
  const [prescriptionItems, setPrescriptionItems] = useState<string[]>([
    'Inj. Meloxicam with Paracetamol 15ml IM OD x 3 days',
    'Inj. Enrofloxacin 10% 15ml IM OD x 3 days',
    'Boroglycerine oral paste TID on tongue lesions'
  ]);
  const [newPrescriptionLine, setNewPrescriptionLine] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Vesicular rupture on dorsal surface of tongue with interdigital ulceration. Isolated animal from milk herd. Temperature 104.8°F.'
  );

  // Sample Requisition State
  const [sampleType, setSampleType] = useState('Vesicular Fluid');
  const [testMethod, setTestMethod] = useState<'RT-PCR' | 'ELISA' | 'Microscopy'>('RT-PCR');
  const [sampleRequisitionSuccess, setSampleRequisitionSuccess] = useState(false);

  const addPrescriptionLine = () => {
    if (newPrescriptionLine.trim()) {
      setPrescriptionItems(prev => [...prev, newPrescriptionLine.trim()]);
      setNewPrescriptionLine('');
    }
  };

  const removePrescriptionLine = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveTreatment = () => {
    if (!activeCase) return;
    updateCaseStatus(activeCase.id, 'Treatment', `Veterinary prescription issued: ${prescriptionItems.length} lines`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleRequisitionSample = () => {
    if (!activeCase) return;
    const barcode = `MH-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    updateLabResult(activeCase.id, {
      sampleBarcode: barcode,
      sampleType,
      testMethod,
      resultStatus: 'Pending',
      collectedBy: 'Dr. Sunita Deshmukh',
      collectedAt: new Date().toISOString()
    });
    updateCaseStatus(activeCase.id, 'Sample Sent', `Laboratory sample dispatched: ${barcode} (${sampleType})`);
    setSampleRequisitionSuccess(true);
    setTimeout(() => setSampleRequisitionSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 text-white border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">
              Veterinary Clinical Decision Support System (CDSS)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dr. Sunita Deshmukh (Reg: MSVC-10482) · Shirur Taluka Veterinary Polyclinic
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Cases Under Care:</span>
          <span className="font-mono font-bold text-amber-400">{cases.length} assigned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Assigned Case Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Assigned Clinical Queue
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Sorted by Triage Priority</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {cases.map(c => {
              const isSelected = c.id === activeCase?.id;
              const isCrit = c.triage.severity === 'Critical';
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1 ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.caseNumber}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCrit ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.triage.severity}
                    </span>
                  </div>

                  <div className="text-slate-700 font-medium">
                    {c.triage.probableDisease} ({c.triage.confidence}%)
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{c.village} · {c.farmerName.split(' ')[0]}</span>
                    <span className="font-mono text-emerald-800 font-semibold">{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Diagnostics, E-Prescription & Lab Requisition (8 cols) */}
        {activeCase && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Case Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{activeCase.caseNumber}</span>
                    <span className="text-xs font-mono text-slate-500">[{activeCase.earTagId}]</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Farmer: <strong>{activeCase.farmerName}</strong> · Phone: {activeCase.farmerPhone} · Village: {activeCase.village}, {activeCase.block}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCase(activeCase)}
                    className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
                  >
                    View Full Audit History →
                  </button>
                </div>
              </div>

              {/* Clinical Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Animal / Breed</span>
                  <span className="font-bold text-slate-800 capitalize">{activeCase.animalType} ({activeCase.breed})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Rectal Temperature</span>
                  <span className="font-bold font-mono text-slate-900">{activeCase.temperatureF}°F</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Herd Affected</span>
                  <span className="font-bold text-slate-800">{activeCase.affectedCount} of {activeCase.totalHerdSize} ({activeCase.mortalityCount} dead)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">AI Suspect</span>
                  <span className="font-bold text-red-700">{activeCase.triage.probableDisease}</span>
                </div>
              </div>

              {/* Symptoms Reported */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Observed Clinical Manifestations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCase.symptoms.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium">
                      • {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* E-Prescription Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Official Veterinary E-Prescription & Treatment Protocol
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">MSVC Rx Standard</span>
              </div>

              {/* Prescriptions List */}
              <div className="space-y-2">
                {prescriptionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800 font-mono">Rx {idx + 1}: {item}</span>
                    <button
                      onClick={() => removePrescriptionLine(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Line */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g., Inj. Ceftiofur 1g IV BID x 3 days, Boroglycerine paint..."
                  value={newPrescriptionLine}
                  onChange={e => setNewPrescriptionLine(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPrescriptionLine()}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
                <button
                  type="button"
                  onClick={addPrescriptionLine}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Veterinarian's Examination Notes & Prognosis:
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Rx</span>
                </button>

                <button
                  onClick={handleSaveTreatment}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-lg text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize Treatment & Move to Care</span>
                </button>
              </div>
            </div>

            {/* Laboratory Sample Requisition Tool */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Laboratory Diagnostic Sample Requisition
                </h4>
                <span className="text-xs text-slate-500">CDIL Pune Reference Lab</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specimen Matrix
                  </label>
                  <select
                    value={sampleType}
                    onChange={e => setSampleType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Vesicular Fluid">Vesicular Fluid (FMD)</option>
                    <option value="Epithelial Flap">Epithelial Flap (Tongue/Hoof)</option>
                    <option value="Serum / Blood">Serum / Peripheral Blood (HS)</option>
                    <option value="Skin Biopsy Nodule">Skin Biopsy Nodule (LSD)</option>
                    <option value="Nasal Swab">Nasal Swab (PPR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diagnostic Assay
                  </label>
                  <select
                    value={testMethod}
                    onChange={e => setTestMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="RT-PCR">RT-PCR (Real-Time Polymerase Chain Reaction)</option>
                    <option value="ELISA">Sandwich ELISA (Antigen/Antibody)</option>
                    <option value="Microscopy">Gram Stain / Field Microscopy</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRequisitionSample}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate Cold-Chain Barcode & Dispatch to Lab</span>
              </button>

              {sampleRequisitionSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Requisition generated! Sample code dispatched to field Pashu-Sevak for ice box collection.</span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
