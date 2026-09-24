import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Share2, 
  Printer, 
  Stethoscope, 
  Sparkles,
  Layers,
  PhoneCall
} from 'lucide-react';

export const TriageResultModal: React.FC = () => {
  const { activeTriageResult, setActiveTriageResult, setSelectedCase, language, t } = useApp();

  if (!activeTriageResult) return null;

  const { triage, caseData } = activeTriageResult;

  const diseaseTitle = language === 'mr' ? triage.diseaseMarathi : language === 'hi' ? triage.diseaseHindi : triage.probableDisease;
  const isCritical = triage.severity === 'Critical';
  const isHigh = triage.severity === 'High';

  const severityBadgeClass = isCritical 
    ? 'bg-red-600 text-white' 
    : isHigh 
    ? 'bg-amber-600 text-white' 
    : 'bg-emerald-700 text-white';

  const firstAidItems = language === 'mr' ? triage.firstAidAdviceMarathi : language === 'hi' ? triage.firstAidAdviceHindi : triage.firstAidAdvice;
  const recommendedSop = language === 'mr' ? triage.recommendedActionMarathi : language === 'hi' ? triage.recommendedActionHindi : triage.recommendedAction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>PashuRakshak AI Triage Engine v2.4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('triage_title')}
            </h2>
            <div className="text-xs text-slate-500 font-mono">
              Case Ref: {caseData.caseNumber} · Ear Tag: {caseData.earTagId}
            </div>
          </div>

          <button
            onClick={() => setActiveTriageResult(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Primary Diagnosis Banner */}
        <div className={`p-5 rounded-xl border ${
          isCritical ? 'bg-red-50/80 border-red-200' : isHigh ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'
        } space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                Primary Probable Etiology ({triage.pathogenType})
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5">
                {diseaseTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide shadow-xs ${severityBadgeClass}`}>
                {triage.severity} Priority
              </span>
              <div className="text-right">
                <div className="text-xl font-black font-mono text-slate-900">{triage.confidence}%</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Confidence</div>
              </div>
            </div>
          </div>

          {triage.ruleBasedFallbackUsed && (
            <div className="text-[11px] text-amber-800 bg-amber-100/60 p-2 rounded border border-amber-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{t('rule_fallback_badge')}</span>
            </div>
          )}
        </div>

        {/* Auto-Escalation Notification Banner */}
        {triage.isEscalated && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <div className="font-bold text-emerald-300">
                  {language === 'mr' ? 'अति-गंभीर प्रकरण: पशुवैद्यक आपत्कालीन पथक अलर्ट' : 'Auto-Escalation Protocol Triggered'}
                </div>
                <div className="text-[11px] text-slate-300">
                  Assigned to: <strong>{triage.escalatedToVet}</strong> · Cold-chain lab sampling requisition dispatched.
                </div>
              </div>
            </div>
            <div className="shrink-0 font-mono text-emerald-400 text-xs font-bold">
              ETA: ~20 mins
            </div>
          </div>
        )}

        {/* Explainable AI (SHAP-style Feature Importance) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>{t('explainable_ai')}</span>
            </h4>
            <span className="text-[10px] text-slate-400">TreeSHAP Log-Odds Contributions</span>
          </div>

          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {triage.shapFactors.map((factor, idx) => {
              const isPositive = factor.weight > 0;
              const absPct = Math.min(100, Math.round(Math.abs(factor.weight) * 100));
              const displayFeature = language === 'mr' ? factor.featureMarathi : language === 'hi' ? factor.featureHindi : factor.feature;

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{displayFeature}</span>
                    <span className={`font-mono text-[11px] font-bold ${isPositive ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isPositive ? `+${(factor.weight * 100).toFixed(0)}% Risk` : `${(factor.weight * 100).toFixed(0)}% Protective`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${absPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Differential Diagnoses */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Differential Diagnostic Probabilities
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {triage.differentials.map((diff, idx) => {
              const diffName = language === 'mr' ? diff.diseaseMarathi : language === 'hi' ? diff.diseaseHindi : diff.disease;
              return (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{diffName}</div>
                  <div className="text-base font-black font-mono text-emerald-800 mt-1">{diff.probability}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immediate First Aid & Biosecurity for Farmers */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t('first_aid')}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-800">
            {firstAidItems.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 text-xs shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Standard Protocol Action Plan */}
        <div className="text-xs text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Standard Operating Protocol (SOP): </strong>
          {recommendedSop}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setActiveTriageResult(null);
              setSelectedCase(caseData);
            }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View Complete Case & Audit Trail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
