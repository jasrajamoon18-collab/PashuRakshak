import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Stethoscope, 
  Microscope, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const CaseDetailModal: React.FC = () => {
  const { selectedCase, setSelectedCase, language, t } = useApp();

  if (!selectedCase) return null;

  const isCrit = selectedCase.triage.severity === 'Critical';
  const isHigh = selectedCase.triage.severity === 'High';

  const diseaseName = language === 'mr' ? selectedCase.triage.diseaseMarathi : language === 'hi' ? selectedCase.triage.diseaseHindi : selectedCase.triage.probableDisease;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-bold">
                {selectedCase.caseNumber}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                isCrit ? 'bg-red-100 text-red-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedCase.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              {diseaseName} (Suspected {selectedCase.triage.confidence}%)
            </h2>
            <div className="text-xs text-slate-500 font-mono">
              Bharat Pashudhan Ear Tag: <strong>{selectedCase.earTagId}</strong> · {selectedCase.animalType.toUpperCase()} ({selectedCase.breed})
            </div>
          </div>

          <button
            onClick={() => setSelectedCase(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Farmer & Location Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Farmer & Contact</div>
            <div className="font-bold text-slate-900">{selectedCase.farmerName}</div>
            <div className="text-slate-600 font-mono">{selectedCase.farmerPhone}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Location (Geotagged)</div>
            <div className="font-bold text-slate-900">{selectedCase.village}, {selectedCase.block}</div>
            <div className="text-slate-600 font-mono text-[11px]">{selectedCase.lat}, {selectedCase.lng}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Reported At</div>
            <div className="font-bold text-slate-900">{new Date(selectedCase.reportedDate).toLocaleDateString()}</div>
            <div className="text-slate-600 text-[11px]">{new Date(selectedCase.reportedDate).toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Clinical Presentation & Vitals */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Clinical Symptoms & Herd Impact
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedCase.symptoms.map((s, idx) => (
              <span key={idx} className="bg-emerald-50 text-emerald-900 text-xs px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                • {s}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Rectal Temp</span>
              <span className="font-bold font-mono text-slate-900">{selectedCase.temperatureF}°F</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Herd Infection</span>
              <span className="font-bold text-slate-900">{selectedCase.affectedCount} / {selectedCase.totalHerdSize} Animals</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Mortality</span>
              <span className="font-bold font-mono text-red-600">{selectedCase.mortalityCount} Deaths</span>
            </div>
          </div>
        </div>

        {/* Photos if any */}
        {selectedCase.photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Clinical Lesion Photography ({selectedCase.photos.length})
            </h4>
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {selectedCase.photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt="Clinical evidence"
                  className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Timeline View (Connected Audit Trail) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Chronological Case Audit Trail ({selectedCase.timeline.length} events)</span>
          </h4>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedCase.timeline.map((event, idx) => (
              <div key={event.id || idx} className="flex items-start gap-3 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{event.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{event.note}</p>
                  <div className="text-[10px] text-slate-400">
                    By: <strong>{event.actor}</strong> ({event.role})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Clinical Docket</span>
          </button>

          <button
            onClick={() => setSelectedCase(null)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
