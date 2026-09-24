import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  UserRole, 
  LivestockCase, 
  OutbreakRiskArea, 
  AlertNotification, 
  QuarantineZone, 
  WeatherCondition,
  TriageResult,
  CaseStatus,
  LabSample
} from '../types';
import { 
  INITIAL_CASES, 
  INITIAL_RISK_AREAS, 
  INITIAL_QUARANTINE_ZONES, 
  INITIAL_ALERTS, 
  INITIAL_WEATHER_DATA 
} from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  cases: LivestockCase[];
  offlineQueue: LivestockCase[];
  addCase: (newCase: LivestockCase) => void;
  syncOfflineQueue: () => void;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, note?: string) => void;
  updateLabResult: (caseId: string, labUpdate: Partial<LabSample>) => void;
  riskAreas: OutbreakRiskArea[];
  quarantineZones: QuarantineZone[];
  addQuarantineZone: (zone: QuarantineZone) => void;
  removeQuarantineZone: (id: string) => void;
  alerts: AlertNotification[];
  broadcastAlert: (alert: AlertNotification) => void;
  weatherData: WeatherCondition[];
  selectedCase: LivestockCase | null;
  setSelectedCase: (c: LivestockCase | null) => void;
  activeTriageResult: { triage: TriageResult; caseData: LivestockCase } | null;
  setActiveTriageResult: (item: { triage: TriageResult; caseData: LivestockCase } | null) => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_CASES = 'pashurakshak_cases_v1';
const STORAGE_KEY_OFFLINE = 'pashurakshak_offline_queue_v1';
const STORAGE_KEY_QUARANTINE = 'pashurakshak_quarantine_v1';
const STORAGE_KEY_ALERTS = 'pashurakshak_alerts_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('farmer');
  const [activeView, setActiveView] = useState<string>('landing');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  
  // Real browser online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cases with LocalStorage hydration
  const [cases, setCases] = useState<LivestockCase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CASES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached cases', e);
      }
    }
    return INITIAL_CASES;
  });

  const [offlineQueue, setOfflineQueue] = useState<LivestockCase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OFFLINE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached offline queue', e);
      }
    }
    return [];
  });

  const [quarantineZones, setQuarantineZones] = useState<QuarantineZone[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QUARANTINE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved quarantine zones', e);
      }
    }
    return INITIAL_QUARANTINE_ZONES;
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved alerts', e);
      }
    }
    return INITIAL_ALERTS;
  });

  const [riskAreas] = useState<OutbreakRiskArea[]>(INITIAL_RISK_AREAS);
  const [weatherData] = useState<WeatherCondition[]>(INITIAL_WEATHER_DATA);
  const [selectedCase, setSelectedCase] = useState<LivestockCase | null>(null);
  const [activeTriageResult, setActiveTriageResult] = useState<{ triage: TriageResult; caseData: LivestockCase } | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUARANTINE, JSON.stringify(quarantineZones));
  }, [quarantineZones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
  };

  const addCase = (newCase: LivestockCase) => {
    if (!isOnline) {
      // Store in offline sync queue
      const queuedCase = { ...newCase, isOfflineCreated: true, synced: false };
      setOfflineQueue(prev => [queuedCase, ...prev]);
      // Also add optimistically to local cases view
      setCases(prev => [queuedCase, ...prev]);
    } else {
      // Immediately synced
      const syncedCase = { ...newCase, isOfflineCreated: false, synced: true };
      setCases(prev => [syncedCase, ...prev]);

      // If critical or high, auto-escalate alert
      if (newCase.triage.severity === 'Critical') {
        const autoAlert: AlertNotification = {
          id: `alt-${Date.now()}`,
          title: `AUTO-ESCALATION: Severe ${newCase.triage.probableDisease} flagged in ${newCase.village}`,
          titleMarathi: `तातडीचा इशारा: ${newCase.village} मध्ये ${newCase.triage.diseaseMarathi} संशयित रुग्ण`,
          titleHindi: `त्वरित अलर्ट: ${newCase.village} में ${newCase.triage.diseaseHindi} का संदिग्ध मामला`,
          message: `Case ${newCase.caseNumber} reported with ${newCase.mortalityCount} mortalities. Nearest vet dispatched.`,
          messageMarathi: `रुग्ण क्र. ${newCase.caseNumber} नोंदवला गेला आहे. जवळचे पशुवैद्यकीय अधिकारी रवाना झाले आहेत.`,
          messageHindi: `केस क्र. ${newCase.caseNumber} दर्ज हुआ। निकटतम पशु चिकित्सक को निर्देशित किया गया है।`,
          disease: newCase.triage.probableDisease,
          severity: 'Critical',
          targetDistrict: newCase.district,
          targetBlock: newCase.block,
          channels: ['push', 'sms'],
          createdAt: new Date().toISOString(),
          recipientsCount: 1450,
          deliverySuccessRate: 98.0,
          authorRole: 'AI Surveillance System',
          authorName: 'Auto-Trigger Rule Guard'
        };
        setAlerts(prev => [autoAlert, ...prev]);
      }
    }
  };

  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setCases(prev =>
      prev.map(c => {
        if (c.isOfflineCreated && !c.synced) {
          return { ...c, synced: true };
        }
        return c;
      })
    );
    setOfflineQueue([]);
  };

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus, note?: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const newTimelineItem = {
            id: `t-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            status: newStatus,
            title: `Status progressed to ${newStatus}`,
            note: note || `Case transitioned from ${c.status} to ${newStatus}`,
            actor: role === 'vet' ? 'Dr. Sunita Deshmukh' : role === 'lab' ? 'CDIL Pune Lab' : 'District Command',
            role: role
          };
          return {
            ...c,
            status: newStatus,
            timeline: [newTimelineItem, ...c.timeline]
          };
        }
        return c;
      })
    );

    // Also update selectedCase if open
    setSelectedCase(curr => {
      if (curr && curr.id === caseId) {
        return {
          ...curr,
          status: newStatus,
          timeline: [
            {
              id: `t-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              status: newStatus,
              title: `Status progressed to ${newStatus}`,
              note: note || `Case transitioned to ${newStatus}`,
              actor: role,
              role: role
            },
            ...curr.timeline
          ]
        };
      }
      return curr;
    });
  };

  const updateLabResult = (caseId: string, labUpdate: Partial<LabSample>) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const currentLab = c.labSample || {
            id: `lab-${Date.now()}`,
            sampleBarcode: `MH-LAB-${Math.floor(1000 + Math.random() * 9000)}`,
            caseId: c.id,
            animalType: c.animalType,
            earTagId: c.earTagId,
            sampleType: 'Serum / Blood',
            collectedBy: 'Field Pashu-Sevak',
            collectedAt: new Date().toISOString(),
            testMethod: 'RT-PCR',
            resultStatus: 'Pending',
            labTechnician: 'CDIL Pune Scientist'
          };
          const updatedLab = { ...currentLab, ...labUpdate };
          return {
            ...c,
            labSample: updatedLab,
            status: labUpdate.resultStatus === 'Positive' || labUpdate.resultStatus === 'Negative' ? 'Treatment' : c.status
          };
        }
        return c;
      })
    );
  };

  const addQuarantineZone = (zone: QuarantineZone) => {
    setQuarantineZones(prev => [zone, ...prev]);
  };

  const removeQuarantineZone = (id: string) => {
    setQuarantineZones(prev => prev.filter(z => z.id !== id));
  };

  const broadcastAlert = (newAlert: AlertNotification) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        activeView,
        setActiveView,
        isOnline,
        toggleOnlineStatus,
        cases,
        offlineQueue,
        addCase,
        syncOfflineQueue,
        updateCaseStatus,
        updateLabResult,
        riskAreas,
        quarantineZones,
        addQuarantineZone,
        removeQuarantineZone,
        alerts,
        broadcastAlert,
        weatherData,
        selectedCase,
        setSelectedCase,
        activeTriageResult,
        setActiveTriageResult,
        isChatbotOpen,
        setIsChatbotOpen,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
