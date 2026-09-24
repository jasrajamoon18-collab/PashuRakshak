import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/MapComponent';
import { AlertNotification, QuarantineZone } from '../types';
import { 
  ShieldAlert, 
  MapPin, 
  Send, 
  Radio, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  BellRing,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthorityDashboardView: React.FC = () => {
  const { 
    riskAreas, 
    quarantineZones, 
    removeQuarantineZone, 
    alerts, 
    broadcastAlert, 
    cases, 
    language, 
    setSelectedCase,
    t 
  } = useApp();

  // Alert Composer Form State
  const [alertTitle, setAlertTitle] = useState('EMERGENCY: Animal Movement Ban in Junnar Block');
  const [alertTitleMr, setAlertTitleMr] = useState('तातडीचा आदेश: जुन्नर तालुक्यात जनावरे वाहतुकीवर पूर्ण बंदी');
  const [alertTitleHi, setAlertTitleHi] = useState('आपातकालीन आदेश: जुन्नर प्रखंड में पशु आवागमन पर पूर्ण प्रतिबंध');
  const [alertMessage, setAlertMessage] = useState('Due to acute HS and FMD cluster, all weekly livestock cattle bazaars are closed for 14 days. Ring vaccination teams deployed.');
  const [alertMessageMr, setAlertMessageMr] = useState('घटसर्प व लाळ-खुरकूत प्रादुर्भावामुळे पुढील १४ दिवस सर्व आठवडे जनावरांचे बाजार बंद राहतील. रिंग लसीकरण सुरू आहे.');
  const [alertMessageHi, setAlertMessageHi] = useState('गलघोंटू एवं खुरपका प्रकोप के चलते अगले 14 दिनों तक सभी पशु बाजार बंद रहेंगे। सघन रिंग टीकाकरण जारी है।');
  const [targetDistrict, setTargetDistrict] = useState('Pune');
  const [targetBlock, setTargetBlock] = useState('Junnar');
  const [selectedDisease, setSelectedDisease] = useState('Hemorrhagic Septicemia (HS)');
  const [channels, setChannels] = useState<('sms' | 'push' | 'ivr')[]>(['sms', 'push', 'ivr']);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [selectedNoticeToPrint, setSelectedNoticeToPrint] = useState<QuarantineZone | null>(null);

  const toggleChannel = (ch: 'sms' | 'push' | 'ivr') => {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    setTimeout(() => {
      const newAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        title: alertTitle,
        titleMarathi: alertTitleMr,
        titleHindi: alertTitleHi,
        message: alertMessage,
        messageMarathi: alertMessageMr,
        messageHindi: alertMessageHi,
        disease: selectedDisease,
        severity: 'Critical',
        targetDistrict,
        targetBlock,
        channels,
        createdAt: new Date().toISOString(),
        recipientsCount: Math.floor(4500 + Math.random() * 5000),
        deliverySuccessRate: 98.7,
        authorRole: 'Chief District Animal Husbandry Officer',
        authorName: 'Dr. Rajesh Kulkarni'
      };

      broadcastAlert(newAlert);
      setIsBroadcasting(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 }
      });
    }, 600);
  };

  // Pre-fill from template library
  const applyTemplate = (templateType: string) => {
    if (templateType === 'movement_ban') {
      setAlertTitle('GAZETTE ORDER: Section 144 Animal Movement Ban Enforced');
      setAlertTitleMr('शासकीय आदेश: कलम १४४ अंतर्गत जनावरे वाहतूक बंदी लागू');
      setAlertTitleHi('सरकारी आदेश: धारा 144 के तहत पशु परिवहन पर रोक लागू');
      setAlertMessage('No cloven-hoofed livestock may enter or leave the 5km buffer radius until negative PCR certificate issued.');
      setAlertMessageMr('५ किमी परिसरातून कोणतेही जनावर बाहेर नेण्यास अथवा आत आणण्यास सक्त मनाई आहे.');
      setAlertMessageHi('5 किमी दायरे में किसी भी पशु को बाहर ले जाने अथवा लाने पर पूर्ण प्रतिबंध रहेगा।');
    } else if (templateType === 'ring_vaccination') {
      setAlertTitle('CAMPAIGN: Emergency FMD Ring Vaccination Drive');
      setAlertTitleMr('मोहीम: तातडीचे लाळ-खुरकूत रिंग लसीकरण सत्र');
      setAlertTitleHi('अभियान: आपातकालीन एफएमडी रिंग टीकाकरण शिविर');
      setAlertMessage('Free veterinary teams will visit every cattle shed starting 7:00 AM tomorrow. Keep animals secured.');
      setAlertMessageMr('उद्या सकाळी ७ वाजेपासून पशुवैद्यकीय पथके घरोघरी मोफत लसीकरणासाठी येणार आहेत.');
      setAlertMessageHi('कल सुबह 7 बजे से पशु चिकित्सक दल घर-घर निःशुल्क टीकाकरण हेतु पहुंचेंगे।');
    }
  };

  const criticalDBSCAN = riskAreas.find(a => a.anomalyDetected);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 text-white border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold">
              District Epidemiological Command & Hotspot Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pune & Western Maharashtra Zonal Directorate · Real-time spatial anomaly radar, live quarantine rings & emergency multi-channel broadcast.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Cattle at Risk</div>
            <div className="text-base font-extrabold font-mono text-amber-400">6,270 in Active Rings</div>
          </div>
          <div className="h-8 w-px bg-slate-700 hidden sm:block" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Containment Rate</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">94.2%</div>
          </div>
        </div>
      </div>

      {/* DBSCAN Spatial Anomaly Banner */}
      {criticalDBSCAN && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-red-400">
                🚨 DBSCAN Spatial Density Anomaly Triggered
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Acute Mortality & Symptom Spike Detected in {criticalDBSCAN.block} Taluka ({criticalDBSCAN.village})
              </h3>
              <p className="text-xs text-red-200 mt-1">
                {criticalDBSCAN.anomalyReason} Risk Score: <strong>{criticalDBSCAN.riskScore}/100 (Critical)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => applyTemplate('movement_ban')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow transition cursor-pointer"
            >
              Draft Section 144 Ban
            </button>
          </div>
        </div>
      )}

      {/* Leaflet Interactive GIS Outbreak Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Interactive Outbreak Map & Quarantine Zone Drawing</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any epicenter to generate 1km infected or 5km ring vaccination radii with live population estimates.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {quarantineZones.length} Active Quarantine Enclosures
          </span>
        </div>

        <MapComponent showQuarantineControls={true} />
      </div>

      {/* Two Column Layout: Risk Intelligence Scores & Multilingual Alert Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Outbreak Risk Intelligence Table (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Taluka / Block Outbreak Risk Intelligence
              </h4>
              <p className="text-xs text-slate-500">
                Multivariate risk fused from symptom density, weather factors & vaccination coverage
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              DBSCAN v3.2
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Block / Village</th>
                  <th className="py-2.5 px-2">Risk Score</th>
                  <th className="py-2.5 px-2">Primary Threat</th>
                  <th className="py-2.5 px-2">Vaccine %</th>
                  <th className="py-2.5 px-2 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {riskAreas.map(area => {
                  const isCrit = area.riskLevel === 'Critical';
                  const isHigh = area.riskLevel === 'High';
                  return (
                    <tr key={area.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{area.block}</div>
                        <div className="text-[10px] text-slate-500">{area.village}</div>
                      </td>
                      <td className="py-2.5 px-2 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          isCrit ? 'bg-red-100 text-red-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {area.riskScore} ({area.riskLevel})
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 font-medium">
                        {area.primaryDiseaseThreat}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-600">
                        {area.vaccinationCoveragePct}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-semibold text-slate-700">
                        <span className={area.forecast7DayTrend === 'Increasing' ? 'text-red-600' : 'text-slate-600'}>
                          {area.forecast7DayTrend === 'Increasing' ? '↑ Rising' : '→ Stable'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Active Quarantine Orders List */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Quarantine Directives & Ring Orders
            </h5>
            <div className="space-y-2">
              {quarantineZones.map(zone => (
                <div key={zone.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{zone.epicenterVillage}</div>
                    <div className="text-[11px] text-slate-600">
                      {zone.zoneType} · Order: {zone.orderNumber}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      {zone.animalPopulationAtRisk.toLocaleString()} Animals Covered · {zone.checkpointsDeployed} Checkpoints
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedNoticeToPrint(zone)}
                      className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
                      title="Print Official Gazette Order"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeQuarantineZone(zone.id)}
                      className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer underline"
                    >
                      Lift Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multilingual Alert Composer & Dispatch Engine (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-700" />
                <span>Multilingual Emergency Broadcast Engine</span>
              </h4>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Templates:</span>
                <button
                  onClick={() => applyTemplate('movement_ban')}
                  className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-medium"
                >
                  Movement Ban
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => applyTemplate('ring_vaccination')}
                  className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-medium"
                >
                  Ring Vaccine
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dispatches parallel alerts across FCM Push Notifications, C-DAC SMS Gateway & Voice IVR.
            </p>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            
            {/* Target Block & Disease */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Block / Taluka
                </label>
                <select
                  value={targetBlock}
                  onChange={e => setTargetBlock(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Junnar">Junnar Taluka</option>
                  <option value="Shirur">Shirur Taluka</option>
                  <option value="Ambegaon">Ambegaon Taluka</option>
                  <option value="Baramati">Baramati Taluka</option>
                  <option value="Karad">Karad (Satara)</option>
                  <option value="Sangamner">Sangamner (Ahmednagar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Disease
                </label>
                <select
                  value={selectedDisease}
                  onChange={e => setSelectedDisease(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Foot and Mouth Disease (FMD)">Foot & Mouth (FMD)</option>
                  <option value="Hemorrhagic Septicemia (HS)">Hemorrhagic Septicemia (HS)</option>
                  <option value="Lumpy Skin Disease (LSD)">Lumpy Skin (LSD)</option>
                  <option value="PPR">PPR (Goat Plague)</option>
                  <option value="Anthrax">Anthrax</option>
                </select>
              </div>
            </div>

            {/* Broadcast Channels (SMS / Push / IVR) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Delivery Channels
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.includes('sms')}
                    onChange={() => toggleChannel('sms')}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>SMS Gateway (CDAC/NIC)</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.includes('push')}
                    onChange={() => toggleChannel('push')}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>FCM Mobile App Push</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.includes('ivr')}
                    onChange={() => toggleChannel('ivr')}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Automated Voice Call (IVR)</span>
                </label>
              </div>
            </div>

            {/* Title in 3 languages */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  English Title:
                </label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  मराठी शीर्षक (Marathi Title):
                </label>
                <input
                  type="text"
                  value={alertTitleMr}
                  onChange={e => setAlertTitleMr(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  हिंदी शीर्षक (Hindi Title):
                </label>
                <input
                  type="text"
                  value={alertTitleHi}
                  onChange={e => setAlertTitleHi(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Message Body in 3 Languages */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  English Advisory Body:
                </label>
                <textarea
                  rows={2}
                  value={alertMessage}
                  onChange={e => setAlertMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  मराठी संदेश (Marathi Message Body):
                </label>
                <textarea
                  rows={2}
                  value={alertMessageMr}
                  onChange={e => setAlertMessageMr(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBroadcasting ? 'Broadcasting via CDAC / SMS Gateways...' : 'Dispatch Multilingual Warning'}</span>
            </button>
          </form>

          {/* Alert Broadcast History */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Dispatches ({alerts.length})
            </h5>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {alerts.map(a => (
                <div key={a.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="line-clamp-1">{a.title}</span>
                    <span className="font-mono text-emerald-700 text-[10px] shrink-0 ml-2">
                      {a.deliverySuccessRate}% Delivered
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {a.targetBlock}, {a.targetDistrict} · {a.recipientsCount.toLocaleString()} farmers
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Quarantine Order Notice Modal */}
      {selectedNoticeToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-5 text-slate-900 border border-slate-200">
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Government of Maharashtra · Department of Animal Husbandry
              </div>
              <h3 className="text-lg font-black text-slate-900">
                OFFICIAL ORDER UNDER SECTION 144: LIVESTOCK BIOSECURITY
              </h3>
              <div className="text-xs font-mono text-emerald-800">
                Gazette Ref: {selectedNoticeToPrint.orderNumber}
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>Subject:</strong> Immediate imposition of animal movement quarantine in <strong>{selectedNoticeToPrint.epicenterVillage}</strong> ({selectedNoticeToPrint.block} Block) following laboratory confirmation of <strong>{selectedNoticeToPrint.disease}</strong>.
              </p>
              <p>
                <strong>Directives:</strong>
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                <li>All transportation of bovine, caprine, and ovine livestock across the designated <strong>{selectedNoticeToPrint.zoneType}</strong> is strictly prohibited.</li>
                <li>Weekly rural livestock haats and markets within a {selectedNoticeToPrint.radiusKm} km radius are temporarily suspended.</li>
                <li>Rapid response teams are authorized to execute mandatory 100% ring vaccination.</li>
                <li>Violation attracts penalty under Section 188 of the Indian Penal Code.</li>
              </ol>
              <div className="pt-2 text-[11px] text-slate-500">
                Issued by Order of: Chief District Animal Husbandry Officer, Pune Collectorate.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedNoticeToPrint(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
