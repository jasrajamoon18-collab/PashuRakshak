import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Microscope, QrCode, CheckCircle2, XCircle, AlertTriangle, FileCheck, Search, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LabPortalView: React.FC = () => {
  const { cases, updateLabResult, setSelectedCase } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Test form state
  const [testResultStatus, setTestResultStatus] = useState<'Positive' | 'Negative' | 'Inconclusive'>('Positive');
  const [confirmedPathogen, setConfirmedPathogen] = useState('Foot and Mouth Disease Virus - Serotype O');
  const [ctValue, setCtValue] = useState<number>(21.4);
  const [aiTriageAgreement, setAiTriageAgreement] = useState<'Confirmed' | 'Rejected' | 'Pending'>('Confirmed');
  const [labRemarks, setLabRemarks] = useState(
    'Strong amplification in VIC channel with Ct 21.4 confirming FMDV Serotype O. AI triage prediction verified.'
  );
  const [isSaving, setIsSaving] = useState(false);

  const labSamples = cases
    .filter(c => c.labSample || c.status === 'Sample Sent' || c.status === 'Lab Testing')
    .map(c => ({
      case: c,
      sample: c.labSample || {
        id: `s-${c.id}`,
        sampleBarcode: `MH-LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        caseId: c.id,
        animalType: c.animalType,
        earTagId: c.earTagId,
        sampleType: 'Serum / Swab',
        collectedBy: 'Field Pashu-Sevak',
        collectedAt: c.reportedDate,
        testMethod: 'RT-PCR',
        resultStatus: 'Pending',
        labTechnician: 'CDIL Pune Scientist'
      }
    }));

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    setIsSaving(true);

    setTimeout(() => {
      updateLabResult(activeCase.id, {
        resultStatus: testResultStatus,
        confirmedPathogen,
        ctValue,
        aiTriageAgreement,
        remarks: labRemarks,
        receivedAtLab: new Date().toISOString()
      });
      setIsSaving(false);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 }
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-purple-950 text-white border border-purple-800">
        <div>
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-purple-300" />
            <h2 className="text-lg font-bold">
              Central Disease Investigation Laboratory (CDIL Pune)
            </h2>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            State Reference Laboratory · Molecular RT-PCR Bench & Active Learning Feedback Loop
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <div className="text-purple-300">Samples in Pipeline</div>
            <div className="text-base font-extrabold font-mono text-white">{labSamples.length} Active</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sample Register Manifest (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sample Register & Cold Chain
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Barcode Log</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {labSamples.map(({ case: c, sample }) => {
              const isSelected = c.id === activeCase?.id;
              const isVerified = sample.resultStatus === 'Positive' || sample.resultStatus === 'Negative';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-900">{sample.sampleBarcode}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      sample.resultStatus === 'Positive' ? 'bg-red-100 text-red-800' :
                      sample.resultStatus === 'Negative' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sample.resultStatus}
                    </span>
                  </div>

                  <div className="text-slate-800 font-semibold">
                    {c.caseNumber} · Tag: <span className="font-mono">{c.earTagId}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{sample.sampleType}</span>
                    <span className="font-medium text-slate-700">{sample.testMethod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Molecular Testing Bench & Model Feedback (8 cols) */}
        {activeCase && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Sample Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-mono text-purple-700 font-bold">
                    SAMPLE ID: {activeCase.labSample?.sampleBarcode || 'MH-LAB-2026-0981'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Case {activeCase.caseNumber} ({activeCase.village}, {activeCase.block})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono">
                    AI Suspect: {activeCase.triage.probableDisease} ({activeCase.triage.confidence}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Specimen</span>
                  <span className="font-bold text-slate-800">{activeCase.labSample?.sampleType || 'Vesicular Swab'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Collector</span>
                  <span className="font-bold text-slate-800">{activeCase.labSample?.collectedBy || 'Pashu-Sevak'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Cold Chain</span>
                  <span className="font-bold text-emerald-700">Maintained (4°C)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Target Assay</span>
                  <span className="font-bold font-mono text-slate-900">{activeCase.labSample?.testMethod || 'RT-PCR'}</span>
                </div>
              </div>
            </div>

            {/* Test Results Entry Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-700" />
                  <span>Molecular Assay Result Entry & Certificate Generator</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">ISO 17025 Compliant</span>
              </div>

              <form onSubmit={handleSaveResult} className="space-y-5">
                
                {/* Result Status & Cycle Threshold */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assay Result Status
                    </label>
                    <select
                      value={testResultStatus}
                      onChange={e => setTestResultStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white"
                    >
                      <option value="Positive">POSITIVE (Pathogen Detected)</option>
                      <option value="Negative">NEGATIVE (Not Detected)</option>
                      <option value="Inconclusive">INCONCLUSIVE (Repeat Swab)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmed Pathogen Strain
                    </label>
                    <select
                      value={confirmedPathogen}
                      onChange={e => setConfirmedPathogen(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white"
                    >
                      <option value="Foot and Mouth Disease Virus - Serotype O">FMDV - Serotype O</option>
                      <option value="Foot and Mouth Disease Virus - Serotype A">FMDV - Serotype A</option>
                      <option value="Foot and Mouth Disease Virus - Serotype Asia 1">FMDV - Serotype Asia 1</option>
                      <option value="Pasteurella multocida (HS)">Pasteurella multocida (HS)</option>
                      <option value="Capripoxvirus (Lumpy Skin)">Capripoxvirus (Lumpy Skin)</option>
                      <option value="Peste des Petits Ruminants Virus (PPR)">PPR Morbillivirus</option>
                      <option value="Bacillus anthracis">Bacillus anthracis</option>
                      <option value="None / Negative">None / Negative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      RT-PCR Ct Value
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ctValue}
                      onChange={e => setCtValue(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                {/* ACTIVE LEARNING FEEDBACK: Compare vs AI Triage */}
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                        Active Learning Feedback for AI Model
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-700 font-mono">Retrains Triage Weights</span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Did the laboratory molecular result corroborate the initial field AI Triage (
                    <strong className="text-slate-900">{activeCase.triage.probableDisease}</strong>)?
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="aiAgreement"
                        checked={aiTriageAgreement === 'Confirmed'}
                        onChange={() => setAiTriageAgreement('Confirmed')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AI Prediction Confirmed
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="aiAgreement"
                        checked={aiTriageAgreement === 'Rejected'}
                        onChange={() => setAiTriageAgreement('Rejected')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex items-center gap-1 text-red-700">
                        <XCircle className="w-3.5 h-3.5" /> Prediction Discrepancy / Misdiagnosis
                      </span>
                    </label>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Laboratory Scientist's Certification Remarks:
                  </label>
                  <textarea
                    rows={2}
                    value={labRemarks}
                    onChange={e => setLabRemarks(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-purple-900 hover:bg-purple-800 text-white font-bold py-2.5 px-5 rounded-lg text-xs shadow transition cursor-pointer"
                  >
                    {isSaving ? 'Submitting & Retraining Edge Weights...' : 'Certify Molecular Result & Notify Field'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
