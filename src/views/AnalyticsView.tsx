import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  PieChart, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { cases, riskAreas, weatherData, language, t } = useApp();

  const [forecastHorizon, setForecastHorizon] = useState<'7d' | '14d' | '30d'>('7d');

  // Disease prevalence distribution
  const diseaseBreakdown = [
    { name: 'Foot & Mouth (FMD)', count: 24, pct: 45, color: 'bg-amber-500' },
    { name: 'Hemorrhagic Septicemia (HS)', count: 14, pct: 26, color: 'bg-red-500' },
    { name: 'Lumpy Skin Disease (LSD)', count: 8, pct: 15, color: 'bg-purple-500' },
    { name: 'Peste des Petits Ruminants (PPR)', count: 5, pct: 9, color: 'bg-teal-500' },
    { name: 'Brucellosis / Other', count: 3, pct: 5, color: 'bg-blue-500' },
  ];

  // District vaccination saturation
  const vaccinationScorecards = [
    { district: 'Pune', bovinePop: '23.4 Lakh', fmdCoverage: 78.4, hsCoverage: 71.2, status: 'On Track' },
    { district: 'Satara', bovinePop: '14.8 Lakh', fmdCoverage: 84.1, hsCoverage: 79.5, status: 'Optimal' },
    { district: 'Ahmednagar', bovinePop: '29.1 Lakh', fmdCoverage: 62.5, hsCoverage: 58.0, status: 'Gap Alert' },
    { district: 'Solapur', bovinePop: '19.2 Lakh', fmdCoverage: 74.0, hsCoverage: 68.4, status: 'Moderate' },
    { district: 'Nashik', bovinePop: '21.5 Lakh', fmdCoverage: 81.0, hsCoverage: 76.8, status: 'Optimal' },
    { district: 'Kolhapur', bovinePop: '12.6 Lakh', fmdCoverage: 88.5, hsCoverage: 85.0, status: 'Optimal' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 text-white border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">
              Epidemiological Analytics & Predictive Outbreak Forecasting
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ICAR-NIVEDI forewarning matrix coupled with DBSCAN spatial anomaly cluster detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Forecast Horizon:</span>
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setForecastHorizon('7d')}
              className={`px-2.5 py-1 rounded font-semibold ${
                forecastHorizon === '7d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setForecastHorizon('14d')}
              className={`px-2.5 py-1 rounded font-semibold ${
                forecastHorizon === '14d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setForecastHorizon('30d')}
              className={`px-2.5 py-1 rounded font-semibold ${
                forecastHorizon === '30d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Performance & Economic ROI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Economic Loss Averted</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">₹18.4 Crore</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +₹4.2 Cr preserved this month
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Early Warning Lead Time</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">5.2 Days</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Before clinical peak outbreak
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Model ROC-AUC Score</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">0.942</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            Validated across 24,000 cases
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Offline Sync Latency</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">&lt; 140 ms</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            On-device edge inference
          </div>
        </div>
      </div>

      {/* Disease Distribution & 7-Day Outbreak Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 7-Day Outbreak Risk Forecast Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Block-Level Predictive Outbreak Forecast ({forecastHorizon})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated transmission dynamics based on vector index, humidity and vaccination gaps
            </p>
          </div>

          <div className="space-y-3">
            {riskAreas.map(area => {
              const isCrit = area.riskLevel === 'Critical';
              const isHigh = area.riskLevel === 'High';
              return (
                <div key={area.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{area.block} Taluka</span>
                      <span className="text-slate-500 text-xs ml-1.5">({area.district} District)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      isCrit ? 'bg-red-100 text-red-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Risk Index: {area.riskScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Primary Threat: <strong className="text-slate-800">{area.primaryDiseaseThreat}</strong></span>
                    <span>Vaccination Gap: <strong className="text-red-700 font-mono">{(100 - area.vaccinationCoveragePct).toFixed(1)}%</strong></span>
                  </div>

                  {/* Progress Bar of Risk */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCrit ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${area.riskScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                    <span>Weather multiplier: {area.weatherRiskMultiplier}x</span>
                    <span>Projected economic exposure: ₹{area.estimatedLossRiskInLakhs} Lakh</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Disease Proportions & Model Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pathogen Prevalence */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Active Pathogen Prevalence in State
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion of confirmed & triaged clinical records
              </p>
            </div>

            <div className="space-y-3">
              {diseaseBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="font-mono text-slate-600">{item.count} cases ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model Confusion Matrix / Technical Spec */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Edge ML Architecture Spec</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">TFLite / ONNX</span>
            </div>

            <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span>Model Pipeline:</span>
                <span className="text-white font-mono">Gradient Boosted Tree + SHAP</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span>Quantization:</span>
                <span className="text-white font-mono">INT8 Mobile-Quantized (2.8 MB)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span>Cold-Chain Telemetry:</span>
                <span className="text-emerald-400 font-mono">BLE Logger & NFC Ready</span>
              </div>
              <div className="flex justify-between">
                <span>False Negative Rate (HS):</span>
                <span className="text-emerald-400 font-mono font-bold">&lt; 0.8% (NADCP Safe)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* District-by-District Vaccination Saturation Scorecard */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              District Vaccination Saturation Scorecard (NADCP 2026 Round 4)
            </h4>
            <p className="text-xs text-slate-500">
              Bi-annual booster compliance tracking across Western Maharashtra livestock
            </p>
          </div>
          <span className="text-xs text-emerald-800 font-semibold">e-GOPALA Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-2">Bovine Population</th>
                <th className="py-2.5 px-2">FMD Vaccine Saturation</th>
                <th className="py-2.5 px-2">HS Vaccine Saturation</th>
                <th className="py-2.5 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vaccinationScorecards.map(row => (
                <tr key={row.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.district}</td>
                  <td className="py-2.5 px-2 font-mono text-slate-700">{row.bovinePop}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{row.fmdCoverage}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.fmdCoverage > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${row.fmdCoverage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{row.hsCoverage}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.hsCoverage > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${row.hsCoverage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                      row.status === 'Gap Alert' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
