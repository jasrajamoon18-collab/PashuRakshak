export type Language = 'en' | 'mr' | 'hi';

export type UserRole = 'farmer' | 'pashusevak' | 'vet' | 'lab' | 'authority';

export type AnimalType = 'cow' | 'buffalo' | 'goat' | 'sheep' | 'bull' | 'calf';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type CaseStatus = 
  | 'Reported' 
  | 'Triaged' 
  | 'Vet Assigned' 
  | 'Sample Sent' 
  | 'Lab Testing' 
  | 'Treatment' 
  | 'Resolved';

export interface ShapFactor {
  feature: string;
  featureMarathi: string;
  featureHindi: string;
  weight: number; // positive increases risk, negative decreases
  description: string;
}

export interface DifferentialDisease {
  disease: string;
  diseaseMarathi: string;
  diseaseHindi: string;
  probability: number;
}

export interface TriageResult {
  probableDisease: string;
  diseaseMarathi: string;
  diseaseHindi: string;
  pathogenType: 'Viral' | 'Bacterial' | 'Parasitic' | 'Toxic';
  confidence: number; // 0-100
  severity: SeverityLevel;
  ruleBasedFallbackUsed: boolean;
  differentials: DifferentialDisease[];
  shapFactors: ShapFactor[];
  recommendedAction: string;
  recommendedActionMarathi: string;
  recommendedActionHindi: string;
  firstAidAdvice: string[];
  firstAidAdviceMarathi: string[];
  firstAidAdviceHindi: string[];
  isEscalated: boolean;
  escalatedToVet?: string;
  sampleRequisitionRecommended: boolean;
}

export interface CaseTimelineItem {
  id: string;
  timestamp: string;
  status: CaseStatus;
  title: string;
  note: string;
  actor: string;
  role: string;
}

export interface LabSample {
  id: string;
  sampleBarcode: string;
  caseId: string;
  animalType: AnimalType;
  earTagId: string;
  sampleType: 'Nasal Swab' | 'Serum / Blood' | 'Vesicular Fluid' | 'Milk' | 'Skin Scrape' | 'Epithelial Flap' | 'Skin Biopsy Nodule' | string;
  collectedBy: string;
  collectedAt: string;
  receivedAtLab?: string;
  testedAt?: string;
  testMethod: 'RT-PCR' | 'ELISA' | 'Antigen Rapid Kit' | 'Gram Staining / Microscopy' | 'Microscopy' | string;
  resultStatus: 'Pending' | 'Positive' | 'Negative' | 'Inconclusive';
  confirmedPathogen?: string;
  ctValue?: number;
  aiTriageAgreement?: 'Confirmed' | 'Rejected' | 'Pending';
  remarks?: string;
  labTechnician: string;
}

export interface LivestockCase {
  id: string;
  caseNumber: string;
  animalType: AnimalType;
  breed?: string;
  ageYears?: number;
  earTagId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  block: string;
  district: string;
  lat: number;
  lng: number;
  reportedDate: string;
  symptoms: string[];
  temperatureF?: number;
  mortalityCount: number;
  affectedCount: number;
  totalHerdSize: number;
  lastVaccinatedFMD?: string;
  lastVaccinatedHS?: string;
  lastVaccinatedLSD?: string;
  photos: string[];
  triage: TriageResult;
  status: CaseStatus;
  assignedVet?: {
    id: string;
    name: string;
    phone: string;
    clinic: string;
    etaMinutes?: number;
  };
  labSample?: LabSample;
  treatmentNotes?: string;
  prescriptions?: string[];
  timeline: CaseTimelineItem[];
  isOfflineCreated?: boolean;
  synced?: boolean;
}

export interface OutbreakRiskArea {
  id: string;
  district: string;
  block: string;
  village: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  primaryDiseaseThreat: string;
  activeCasesCount: number;
  mortalityCount: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  forecast7DayTrend: 'Increasing' | 'Stable' | 'Declining';
  vaccinationCoveragePct: number;
  weatherRiskMultiplier: number;
  estimatedLossRiskInLakhs: number;
}

export interface AlertNotification {
  id: string;
  title: string;
  titleMarathi: string;
  titleHindi: string;
  message: string;
  messageMarathi: string;
  messageHindi: string;
  disease: string;
  severity: SeverityLevel;
  targetDistrict: string;
  targetBlock: string;
  channels: ('sms' | 'push' | 'ivr')[];
  createdAt: string;
  recipientsCount: number;
  deliverySuccessRate: number;
  authorRole: string;
  authorName: string;
}

export interface QuarantineZone {
  id: string;
  caseId: string;
  epicenterVillage: string;
  block: string;
  district: string;
  center: [number, number];
  radiusKm: number;
  zoneType: 'Infected (1km)' | 'Surveillance (5km)' | 'Buffer (10km)';
  disease: string;
  issuedDate: string;
  animalPopulationAtRisk: number;
  movementBanActive: boolean;
  checkpointsDeployed: number;
  orderNumber: string;
}

export interface WeatherCondition {
  district: string;
  tempC: number;
  humidityPct: number;
  rainfallMm: number;
  windSpeedKmh: number;
  fmdRiskIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
  hsRiskIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
  notes: string;
  notesMarathi: string;
  notesHindi: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  block: string;
  district: string;
  herdCount: number;
  cattleTags: string[];
}
