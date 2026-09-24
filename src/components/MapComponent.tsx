import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { LivestockCase, QuarantineZone } from '../types';
import { Shield, Eye, AlertTriangle, Layers, Play, Pause, RotateCcw } from 'lucide-react';

interface MapComponentProps {
  onCaseSelect?: (c: LivestockCase) => void;
  showQuarantineControls?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  onCaseSelect,
  showQuarantineControls = false 
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const quarantineLayerRef = useRef<L.LayerGroup | null>(null);

  const { cases, riskAreas, quarantineZones, addQuarantineZone, language, setSelectedCase } = useApp();

  // Layer filters
  const [showCasesLayer, setShowCasesLayer] = useState(true);
  const [showRiskClusters, setShowRiskClusters] = useState(true);
  const [showQuarantineRings, setShowQuarantineRings] = useState(true);

  // Time slider replay (Day 1 to 14)
  const [replayDay, setReplayDay] = useState<number>(14);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);

  // Ring drawing tool
  const [selectedEpicenter, setSelectedEpicenter] = useState<string>('Junnar');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(1.0);
  const [selectedDisease, setSelectedDisease] = useState<string>('Foot and Mouth Disease (FMD)');

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Western Maharashtra (Pune / Ahmednagar / Satara region)
    const map = L.map(mapContainerRef.current, {
      center: [18.8285, 74.1500],
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // High performance OpenStreetMap CartoDB Positron / standard tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    circlesLayerRef.current = L.layerGroup().addTo(map);
    quarantineLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Time slider auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingReplay) {
      interval = setInterval(() => {
        setReplayDay(prev => {
          if (prev >= 14) {
            setIsPlayingReplay(false);
            return 14;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingReplay]);

  // Update map markers when cases, riskAreas, quarantineZones, or layers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers
    markersLayerRef.current?.clearLayers();
    circlesLayerRef.current?.clearLayers();
    quarantineLayerRef.current?.clearLayers();

    // 1. Render Quarantine Rings
    if (showQuarantineRings && quarantineLayerRef.current) {
      quarantineZones.forEach(zone => {
        const radiusMeters = zone.radiusKm * 1000;
        const color = zone.zoneType.includes('1km') ? '#dc2626' : zone.zoneType.includes('5km') ? '#f59e0b' : '#3b82f6';
        
        const circle = L.circle(zone.center, {
          radius: radiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          dashArray: zone.zoneType.includes('5km') ? '6, 6' : undefined
        });

        circle.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; min-width: 200px;">
            <div style="font-weight: 700; color: ${color}; margin-bottom: 4px;">
              ${zone.zoneType} Quarantine Ring
            </div>
            <div><strong>Epicenter:</strong> ${zone.epicenterVillage}</div>
            <div><strong>Disease:</strong> ${zone.disease}</div>
            <div><strong>Animals at Risk:</strong> ${zone.animalPopulationAtRisk.toLocaleString()}</div>
            <div><strong>Order No:</strong> ${zone.orderNumber}</div>
            <div style="margin-top: 6px; font-size: 11px; color: #dc2626; font-weight: 600;">
              ${zone.movementBanActive ? '⚠️ Section 144 Movement Ban Active' : 'Advisory Ring'}
            </div>
          </div>
        `);

        quarantineLayerRef.current?.addLayer(circle);
      });
    }

    // 2. Render Risk Area heat clusters
    if (showRiskClusters && circlesLayerRef.current) {
      riskAreas.forEach(area => {
        // Adjust visibility by replayDay simulation
        if (area.riskScore > 70 && replayDay < 4) return; // appeared later in simulation

        const radiusMeters = (area.riskScore * 140);
        const color = area.riskLevel === 'Critical' ? '#dc2626' : area.riskLevel === 'High' ? '#ea580c' : '#d97706';

        const circle = L.circle([area.lat, area.lng], {
          radius: radiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: 0.22,
          weight: 1.5
        });

        circle.bindTooltip(`
          <strong>${area.block} Taluka (${area.village})</strong><br/>
          Risk Score: <strong>${area.riskScore}/100</strong> (${area.riskLevel})<br/>
          Primary Threat: ${area.primaryDiseaseThreat}<br/>
          Vaccination Gap: ${(100 - area.vaccinationCoveragePct).toFixed(1)}% Unvaccinated
        `, { sticky: true });

        circlesLayerRef.current?.addLayer(circle);
      });
    }

    // 3. Render Individual Livestock Cases
    if (showCasesLayer && markersLayerRef.current) {
      cases.forEach((c, index) => {
        // Simulation filter for replay
        if (index > 2 && replayDay < 7) return;

        const isCritical = c.triage.severity === 'Critical';
        const isHigh = c.triage.severity === 'High';
        const pinBg = isCritical ? '#dc2626' : isHigh ? '#f59e0b' : '#10b981';

        // Custom crisp HTML marker
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background-color: ${pinBg};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
            ">
              ${c.animalType === 'cow' ? '🐄' : c.animalType === 'buffalo' ? '🐃' : c.animalType === 'goat' ? '🐐' : '🐑'}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const marker = L.marker([c.lat, c.lng], { icon: customIcon });

        const diseaseName = language === 'mr' ? c.triage.diseaseMarathi : language === 'hi' ? c.triage.diseaseHindi : c.triage.probableDisease;

        const popupContent = document.createElement('div');
        popupContent.style.minWidth = '220px';
        popupContent.style.fontSize = '13px';
        popupContent.innerHTML = `
          <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 2px;">
            ${c.caseNumber}
          </div>
          <div style="color: #64748b; font-size: 12px; margin-bottom: 6px;">
            ${c.village}, ${c.block} (${c.district})
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Suspected:</strong> <span style="color: ${pinBg}; font-weight: 600;">${diseaseName}</span>
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Confidence:</strong> ${c.triage.confidence}% · <strong>Severity:</strong> ${c.triage.severity}
          </div>
          <div style="margin-bottom: 6px;">
            <strong>Status:</strong> ${c.status}
          </div>
          <button id="view-case-btn-${c.id}" style="
            width: 100%;
            background-color: #065f46;
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 4px;
          ">
            Open Full Clinical Case
          </button>
        `;

        // Wire popup click
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-case-btn-${c.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onCaseSelect) {
                onCaseSelect(c);
              } else {
                setSelectedCase(c);
              }
            };
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

  }, [cases, riskAreas, quarantineZones, showCasesLayer, showRiskClusters, showQuarantineRings, replayDay, language]);

  // Handle drawing a new quarantine zone
  const handleCreateQuarantineZone = () => {
    let lat = 19.2085;
    let lng = 73.8760;
    let village = 'Otur (Junnar)';

    if (selectedEpicenter === 'Shirur') {
      lat = 18.8285;
      lng = 74.3760;
      village = 'Pabal (Shirur)';
    } else if (selectedEpicenter === 'Ambegaon') {
      lat = 19.0345;
      lng = 73.8340;
      village = 'Ghodegaon (Ambegaon)';
    } else if (selectedEpicenter === 'Karad') {
      lat = 17.2890;
      lng = 74.1810;
      village = 'Ond (Karad, Satara)';
    }

    const newZone: QuarantineZone = {
      id: `qz-${Date.now()}`,
      caseId: `EPIDEMIC-PASHU-${Math.floor(100 + Math.random() * 900)}`,
      epicenterVillage: village,
      block: selectedEpicenter,
      district: selectedEpicenter === 'Karad' ? 'Satara' : 'Pune',
      center: [lat, lng],
      radiusKm: selectedRadiusKm,
      zoneType: selectedRadiusKm <= 1 ? 'Infected (1km)' : selectedRadiusKm <= 5 ? 'Surveillance (5km)' : 'Buffer (10km)',
      disease: selectedDisease,
      issuedDate: new Date().toISOString().split('T')[0],
      animalPopulationAtRisk: Math.round(selectedRadiusKm * selectedRadiusKm * 1850),
      movementBanActive: true,
      checkpointsDeployed: Math.max(2, Math.round(selectedRadiusKm * 2)),
      orderNumber: `DAHO/PUN/ORD/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
    };

    addQuarantineZone(newZone);

    // Pan map to epicenter
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[580px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
      {/* Map Control Overlay (Top Left) */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-lg shadow-md border border-slate-200 text-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 border-r border-slate-200 pr-3">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>GIS Layers</span>
        </div>
        
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
          <input 
            type="checkbox" 
            checked={showCasesLayer} 
            onChange={e => setShowCasesLayer(e.target.checked)} 
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>Active Cases</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
          <input 
            type="checkbox" 
            checked={showRiskClusters} 
            onChange={e => setShowRiskClusters(e.target.checked)} 
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>Risk Clusters</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
          <input 
            type="checkbox" 
            checked={showQuarantineRings} 
            onChange={e => setShowQuarantineRings(e.target.checked)} 
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
          />
          <span>Quarantine Rings</span>
        </label>
      </div>

      {/* Outbreak Spread Replay Time-Slider (Top Right) */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs flex items-center gap-2.5">
        <button
          onClick={() => setIsPlayingReplay(prev => !prev)}
          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title={isPlayingReplay ? 'Pause' : 'Play Timeline'}
        >
          {isPlayingReplay ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
        </button>

        <button
          onClick={() => { setReplayDay(1); setIsPlayingReplay(true); }}
          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Reset to Day 1"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Outbreak Progression</span>
            <span className="font-mono text-emerald-700 font-bold ml-2">Day {replayDay} / 14</span>
          </div>
          <input
            type="range"
            min={1}
            max={14}
            value={replayDay}
            onChange={e => setReplayDay(Number(e.target.value))}
            className="w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Ring Fencing & Quarantine Zone Controller Toolbar */}
      {showQuarantineControls && (
        <div className="bg-white border-t border-slate-200 p-3 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-900">Quarantine Zone Planner:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedEpicenter}
              onChange={e => setSelectedEpicenter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Junnar">Epicenter: Junnar (Otur Cluster)</option>
              <option value="Shirur">Epicenter: Shirur (Pabal Cluster)</option>
              <option value="Ambegaon">Epicenter: Ambegaon (Ghodegaon)</option>
              <option value="Karad">Epicenter: Karad (Satara)</option>
            </select>

            <select
              value={selectedDisease}
              onChange={e => setSelectedDisease(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Foot and Mouth Disease (FMD)">Foot & Mouth (FMD)</option>
              <option value="Hemorrhagic Septicemia (HS)">Hemorrhagic Septicemia (HS)</option>
              <option value="Lumpy Skin Disease (LSD)">Lumpy Skin (LSD)</option>
              <option value="PPR">PPR (Goat Plague)</option>
            </select>

            <div className="flex items-center border border-slate-300 rounded overflow-hidden">
              <button
                onClick={() => setSelectedRadiusKm(1.0)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedRadiusKm === 1.0 ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                1 km (Infected)
              </button>
              <button
                onClick={() => setSelectedRadiusKm(5.0)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedRadiusKm === 5.0 ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                5 km (Ring Vaccine)
              </button>
              <button
                onClick={() => setSelectedRadiusKm(10.0)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedRadiusKm === 10.0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                10 km (Buffer)
              </button>
            </div>

            <button
              onClick={handleCreateQuarantineZone}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1 rounded font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              + Deploy Zone & Issue Ban
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
