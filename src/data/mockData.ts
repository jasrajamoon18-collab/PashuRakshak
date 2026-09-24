import { LivestockCase, OutbreakRiskArea, AlertNotification, QuarantineZone, WeatherCondition } from '../types';
import { runAITriage } from '../utils/triageEngine';

export const INITIAL_WEATHER_DATA: WeatherCondition[] = [
  {
    district: 'Pune',
    tempC: 31.4,
    humidityPct: 82,
    rainfallMm: 14.2,
    windSpeedKmh: 16.5,
    fmdRiskIndex: 'High',
    hsRiskIndex: 'High',
    notes: 'High ambient humidity (>80%) along Ghod River basin heavily favors viral aerosol persistence for FMD and Pasteurella proliferation.',
    notesMarathi: 'घोड नदी खोऱ्यातील उच्च आर्द्रता (>८०%) मुळे लाळ-खुरकूत आणि घटसर्प जिवाणू प्रसारास अत्यंत अनुकूल वातावरण आहे.',
    notesHindi: 'घोड नदी घाटी में उच्च आर्द्रता (>80%) के कारण एफएमडी वायरस और गलघोंटू जीवाणु के फैलाव का उच्च जोखिम।'
  },
  {
    district: 'Satara',
    tempC: 29.8,
    humidityPct: 76,
    rainfallMm: 8.0,
    windSpeedKmh: 14.0,
    fmdRiskIndex: 'Moderate',
    hsRiskIndex: 'Moderate',
    notes: 'Moderate temperature range with intermittent dew deposition.',
    notesMarathi: 'मध्यम तापमान आणि अधूनमधून पडणारे दव.',
    notesHindi: 'मध्यम तापमान और नमी युक्त वातावरण।'
  },
  {
    district: 'Ahmednagar',
    tempC: 33.2,
    humidityPct: 68,
    rainfallMm: 2.1,
    windSpeedKmh: 18.2,
    fmdRiskIndex: 'Moderate',
    hsRiskIndex: 'Low',
    notes: 'Warm dry conditions with vector activity (Stomoxys calcitrans flies) noted near sugar cane belts.',
    notesMarathi: 'उष्ण व कोरडे हवामान, ऊस पट्ट्यात गोचीड व माश्यांची वाढ.',
    notesHindi: 'गर्म मौसम, गन्ना बेल्ट में मक्खी-मच्छरों की सक्रियता।'
  },
  {
    district: 'Nashik',
    tempC: 30.1,
    humidityPct: 74,
    rainfallMm: 6.4,
    windSpeedKmh: 12.0,
    fmdRiskIndex: 'Moderate',
    hsRiskIndex: 'Moderate',
    notes: 'Stable meteorological index for northern Sahyadri foothill livestock.',
    notesMarathi: 'उत्तर सह्याद्री पायथा परिसरासाठी स्थिर हवामान.',
    notesHindi: 'उत्तरी सह्याद्री तलहटी क्षेत्र के लिए सामान्य मौसमी परिस्थितियां।'
  }
];

export const INITIAL_RISK_AREAS: OutbreakRiskArea[] = [
  {
    id: 'risk-1',
    district: 'Pune',
    block: 'Junnar',
    village: 'Otur & Narayangaon',
    lat: 19.2085,
    lng: 73.8760,
    riskScore: 89,
    riskLevel: 'Critical',
    primaryDiseaseThreat: 'Hemorrhagic Septicemia (HS) & FMD',
    activeCasesCount: 19,
    mortalityCount: 6,
    anomalyDetected: true,
    anomalyReason: 'DBSCAN cluster trigger: 340% acute mortality spike in 48h; unseasonal river overflow.',
    forecast7DayTrend: 'Increasing',
    vaccinationCoveragePct: 61.4,
    weatherRiskMultiplier: 1.45,
    estimatedLossRiskInLakhs: 42.5
  },
  {
    id: 'risk-2',
    district: 'Pune',
    block: 'Shirur',
    village: 'Pabal & Shikrapur',
    lat: 18.8285,
    lng: 74.3760,
    riskScore: 78,
    riskLevel: 'High',
    primaryDiseaseThreat: 'Foot and Mouth Disease (FMD)',
    activeCasesCount: 14,
    mortalityCount: 1,
    anomalyDetected: true,
    anomalyReason: 'Cattle market influx from adjacent transit corridor without vaccination certificate.',
    forecast7DayTrend: 'Increasing',
    vaccinationCoveragePct: 68.2,
    weatherRiskMultiplier: 1.30,
    estimatedLossRiskInLakhs: 28.0
  },
  {
    id: 'risk-3',
    district: 'Pune',
    block: 'Ambegaon',
    village: 'Ghodegaon',
    lat: 19.0345,
    lng: 73.8340,
    riskScore: 66,
    riskLevel: 'High',
    primaryDiseaseThreat: 'Foot and Mouth Disease (FMD)',
    activeCasesCount: 8,
    mortalityCount: 0,
    anomalyDetected: false,
    forecast7DayTrend: 'Stable',
    vaccinationCoveragePct: 73.5,
    weatherRiskMultiplier: 1.20,
    estimatedLossRiskInLakhs: 14.0
  },
  {
    id: 'risk-4',
    district: 'Satara',
    block: 'Karad',
    village: 'Ond & Shenoli',
    lat: 17.2890,
    lng: 74.1810,
    riskScore: 54,
    riskLevel: 'Moderate',
    primaryDiseaseThreat: 'Lumpy Skin Disease (LSD)',
    activeCasesCount: 6,
    mortalityCount: 0,
    anomalyDetected: false,
    forecast7DayTrend: 'Stable',
    vaccinationCoveragePct: 82.0,
    weatherRiskMultiplier: 1.10,
    estimatedLossRiskInLakhs: 9.5
  },
  {
    id: 'risk-5',
    district: 'Ahmednagar',
    block: 'Sangamner',
    village: 'Ashwi & Sakur',
    lat: 19.5760,
    lng: 74.2120,
    riskScore: 61,
    riskLevel: 'High',
    primaryDiseaseThreat: 'Peste des Petits Ruminants (PPR)',
    activeCasesCount: 11,
    mortalityCount: 3,
    anomalyDetected: false,
    forecast7DayTrend: 'Stable',
    vaccinationCoveragePct: 58.0,
    weatherRiskMultiplier: 1.15,
    estimatedLossRiskInLakhs: 7.2
  },
  {
    id: 'risk-6',
    district: 'Pune',
    block: 'Baramati',
    village: 'Malegaon & Rui',
    lat: 18.1520,
    lng: 74.5780,
    riskScore: 32,
    riskLevel: 'Low',
    primaryDiseaseThreat: 'Seasonal Mastitis / Non-epidemic',
    activeCasesCount: 2,
    mortalityCount: 0,
    anomalyDetected: false,
    forecast7DayTrend: 'Declining',
    vaccinationCoveragePct: 91.2,
    weatherRiskMultiplier: 0.9,
    estimatedLossRiskInLakhs: 2.1
  }
];

export const INITIAL_QUARANTINE_ZONES: QuarantineZone[] = [
  {
    id: 'qz-101',
    caseId: 'PR-2026-PN-0143',
    epicenterVillage: 'Otur, Junnar Block',
    block: 'Junnar',
    district: 'Pune',
    center: [19.2600, 73.9100],
    radiusKm: 1.0,
    zoneType: 'Infected (1km)',
    disease: 'Hemorrhagic Septicemia (HS)',
    issuedDate: '2026-09-22',
    animalPopulationAtRisk: 1420,
    movementBanActive: true,
    checkpointsDeployed: 4,
    orderNumber: 'DAHO/PUN/EPI/2026/089'
  },
  {
    id: 'qz-102',
    caseId: 'PR-2026-PN-0142',
    epicenterVillage: 'Pabal, Shirur Block',
    block: 'Shirur',
    district: 'Pune',
    center: [18.8285, 74.3760],
    radiusKm: 5.0,
    zoneType: 'Surveillance (5km)',
    disease: 'Foot and Mouth Disease (FMD)',
    issuedDate: '2026-09-23',
    animalPopulationAtRisk: 4850,
    movementBanActive: true,
    checkpointsDeployed: 2,
    orderNumber: 'DAHO/PUN/EPI/2026/092'
  }
];

export const INITIAL_CASES: LivestockCase[] = [
  {
    id: 'case-1',
    caseNumber: 'PR-2026-PN-0142',
    animalType: 'cow',
    breed: 'HF Crossbred (होल्स्टीन संकरित)',
    ageYears: 4,
    earTagId: '100489201948',
    farmerName: 'Tukaram Vitthal Shinde (तुकाराम शिंदे)',
    farmerPhone: '+91 98224 81920',
    village: 'Pabal (पाबळ)',
    block: 'Shirur',
    district: 'Pune',
    lat: 18.8350,
    lng: 74.0540,
    reportedDate: '2026-09-24T03:15:00Z',
    symptoms: [
      'Profuse ropy salivation',
      'Interdigital foot lesions',
      'Oral blisters on tongue',
      'High fever (>104°F)',
      'Sudden milk drop'
    ],
    temperatureF: 105.2,
    mortalityCount: 0,
    affectedCount: 3,
    totalHerdSize: 8,
    lastVaccinatedFMD: '2025-10-15',
    lastVaccinatedHS: '2026-05-10',
    photos: [
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80'
    ],
    triage: runAITriage({
      animalType: 'cow',
      symptoms: [
        'Profuse ropy salivation',
        'Interdigital foot lesions',
        'Oral blisters on tongue',
        'Sudden milk drop'
      ],
      temperatureF: 105.2,
      mortalityCount: 0,
      lastVaccinatedFMD: '2025-10-15'
    }),
    status: 'Sample Sent',
    assignedVet: {
      id: 'vet-1',
      name: 'Dr. Sunita Deshmukh, B.V.Sc',
      phone: '+91 94220 18293',
      clinic: 'Taluka Veterinary Polyclinic, Shirur',
      etaMinutes: 25
    },
    labSample: {
      id: 'sample-01',
      sampleBarcode: 'MH-LAB-2026-0981',
      caseId: 'case-1',
      animalType: 'cow',
      earTagId: '100489201948',
      sampleType: 'Vesicular Fluid',
      collectedBy: 'Ramesh Patil (Pashu-Sevak)',
      collectedAt: '2026-09-24T04:20:00Z',
      receivedAtLab: '2026-09-24T05:10:00Z',
      testMethod: 'RT-PCR',
      resultStatus: 'Pending',
      labTechnician: 'Dr. Anand Joshi (CDIL Pune)'
    },
    treatmentNotes: 'Cleaned oral lesions with 1% KMNO4. Administered Meloxicam + Paracetamol 15ml IM. Applied herbal spray on hooves. Isolated from grazing herd.',
    prescriptions: [
      'Inj. Meloxicam with Paracetamol 15ml IM OD x 3 days',
      'Inj. Enrofloxacin 10% 15ml IM OD x 3 days',
      'Boroglycerine oral paste TID',
      'Topicure anti-fly spray BID on hooves'
    ],
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-09-24 08:45 AM',
        status: 'Reported',
        title: 'Offline Report Captured & Synced',
        note: 'Reported by Farmer Tukaram Shinde via PashuRakshak PWA with auto-GPS coordinates.',
        actor: 'Tukaram Shinde',
        role: 'Farmer'
      },
      {
        id: 't-2',
        timestamp: '2026-09-24 08:47 AM',
        status: 'Triaged',
        title: 'AI Triage Evaluated: 92% FMD (High Severity)',
        note: 'Engine triggered auto-escalation based on acute oral vesicle and salivation signatures.',
        actor: 'AI Triage Engine (XGBoost + Rule Guard)',
        role: 'System'
      },
      {
        id: 't-3',
        timestamp: '2026-09-24 09:15 AM',
        status: 'Vet Assigned',
        title: 'Field Visit Assigned to Dr. Sunita Deshmukh',
        note: 'Veterinary alert dispatched via SMS and app notification with shortest transit route.',
        actor: 'District Dispatch Router',
        role: 'System'
      },
      {
        id: 't-4',
        timestamp: '2026-09-24 10:30 AM',
        status: 'Sample Sent',
        title: 'Epithelial & Vesicular Swab Dispatched to CDIL Pune',
        note: 'Sample code MH-LAB-2026-0981 placed in cold chain ice box by Para-vet Ramesh Patil.',
        actor: 'Ramesh Patil',
        role: 'Pashu-Sevak'
      }
    ]
  },
  {
    id: 'case-2',
    caseNumber: 'PR-2026-PN-0143',
    animalType: 'buffalo',
    breed: 'Murrah (मुर्राह)',
    ageYears: 5,
    earTagId: '100489201949',
    farmerName: 'Balasaheb Gunjal (बाळासाहेब गुंजाळ)',
    farmerPhone: '+91 97631 29401',
    village: 'Otur (ओतूर)',
    block: 'Junnar',
    district: 'Pune',
    lat: 19.2600,
    lng: 73.9100,
    reportedDate: '2026-09-23T14:20:00Z',
    symptoms: [
      'Painful throat and brisket swelling',
      'Severe respiratory distress & grunting',
      'High fever (>104°F)'
    ],
    temperatureF: 106.1,
    mortalityCount: 2,
    affectedCount: 4,
    totalHerdSize: 12,
    lastVaccinatedHS: '2024-06-12',
    photos: [
      'https://images.unsplash.com/photo-1596733430284-f7437764b14d?auto=format&fit=crop&w=400&q=80'
    ],
    triage: runAITriage({
      animalType: 'buffalo',
      symptoms: [
        'Painful throat and brisket swelling',
        'Severe respiratory distress & grunting'
      ],
      temperatureF: 106.1,
      mortalityCount: 2,
      lastVaccinatedHS: '2024-06-12'
    }),
    status: 'Lab Testing',
    assignedVet: {
      id: 'vet-2',
      name: 'Dr. Milind Kadam, M.V.Sc',
      phone: '+91 98901 44520',
      clinic: 'Taluka Veterinary Polyclinic, Junnar',
      etaMinutes: 10
    },
    labSample: {
      id: 'sample-02',
      sampleBarcode: 'MH-LAB-2026-0975',
      caseId: 'case-2',
      animalType: 'buffalo',
      earTagId: '100489201949',
      sampleType: 'Serum / Blood',
      collectedBy: 'Dr. Milind Kadam',
      collectedAt: '2026-09-23T16:00:00Z',
      receivedAtLab: '2026-09-23T19:00:00Z',
      testMethod: 'Gram Staining / Microscopy',
      resultStatus: 'Positive',
      confirmedPathogen: 'Pasteurella multocida (Bipolar coccobacilli confirmed)',
      aiTriageAgreement: 'Confirmed',
      remarks: 'Acute HS confirmed microscopically. Emergency ring vaccination executed.',
      labTechnician: 'Dr. Vaishali Kale (CDIL Pune)'
    },
    treatmentNotes: 'EMERGENCY: Immediate IV Ceftiofur Sodium 1g administered with Flunixin Meglumine 15ml. Animal breathing normalized slightly.',
    prescriptions: [
      'Inj. Ceftiofur Sodium 1g IV BID x 3 days',
      'Inj. Flunixin Meglumine 15ml IV OD',
      'Inj. Dexamethasone 5ml IM (single dose under vet supervision)'
    ],
    timeline: [
      {
        id: 't-21',
        timestamp: '2026-09-23 02:20 PM',
        status: 'Reported',
        title: 'Emergency Case Alert Logged',
        note: 'Reported 2 mortalities with acute throat swelling in Otur village.',
        actor: 'Balasaheb Gunjal',
        role: 'Farmer'
      },
      {
        id: 't-22',
        timestamp: '2026-09-23 02:22 PM',
        status: 'Triaged',
        title: 'CRITICAL TRIAGE: Hemorrhagic Septicemia (HS) 94%',
        note: 'Automated DBSCAN anomaly trigger flagged Junnar cluster alert.',
        actor: 'AI Triage Engine',
        role: 'System'
      },
      {
        id: 't-23',
        timestamp: '2026-09-23 04:30 PM',
        status: 'Vet Assigned',
        title: 'Dr. Milind Kadam on-site clinical assessment',
        note: 'Administered IV antibiotics and drew heart blood smear.',
        actor: 'Dr. Milind Kadam',
        role: 'Veterinarian'
      },
      {
        id: 't-24',
        timestamp: '2026-09-23 08:30 PM',
        status: 'Lab Testing',
        title: 'Microscopy Confirmed: Pasteurella multocida',
        note: 'Gram negative bipolar organisms verified under oil immersion lens.',
        actor: 'CDIL Pune Lab',
        role: 'Lab Scientist'
      }
    ]
  },
  {
    id: 'case-3',
    caseNumber: 'PR-2026-ST-0089',
    animalType: 'cow',
    breed: 'Gir (गीर गाय)',
    ageYears: 3,
    earTagId: '100489201950',
    farmerName: 'Anandrao Patil (आनंदराव पाटील)',
    farmerPhone: '+91 94231 88720',
    village: 'Ond (ओंद)',
    block: 'Karad',
    district: 'Satara',
    lat: 17.2910,
    lng: 74.1750,
    reportedDate: '2026-09-22T08:00:00Z',
    symptoms: [
      'Hard skin lumps / nodules (Lumpy Skin)',
      'High fever (>104°F)',
      'Nasal & eye discharge'
    ],
    temperatureF: 104.4,
    mortalityCount: 0,
    affectedCount: 2,
    totalHerdSize: 6,
    lastVaccinatedLSD: '2024-02-10',
    photos: [
      'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=400&q=80'
    ],
    triage: runAITriage({
      animalType: 'cow',
      symptoms: [
        'Hard skin lumps / nodules (Lumpy Skin)',
        'Nasal & eye discharge'
      ],
      temperatureF: 104.4,
      mortalityCount: 0
    }),
    status: 'Treatment',
    assignedVet: {
      id: 'vet-3',
      name: 'Dr. Pravin Salunkhe',
      phone: '+91 98229 11200',
      clinic: 'Karad Polyclinic, Satara',
      etaMinutes: 0
    },
    treatmentNotes: 'Skin nodules scabbed over. Temperature reduced to 101.8°F. Prescribed neem oil herbal dressing and zinc supplements.',
    prescriptions: [
      'Herbal Neem + Turmeric topical paste BID',
      'Ivermectin 1% injection 7ml Sub-Cutaneous (vector control)',
      'Multivitamin + Minerals syrup 50ml daily x 10 days'
    ],
    timeline: [
      {
        id: 't-31',
        timestamp: '2026-09-22 08:00 AM',
        status: 'Reported',
        title: 'Nodule Outbreak Reported',
        note: 'Farmer noticed 25+ hard nodules covering neck and flank.',
        actor: 'Anandrao Patil',
        role: 'Farmer'
      },
      {
        id: 't-32',
        timestamp: '2026-09-22 09:30 AM',
        status: 'Triaged',
        title: 'AI Triage: Lumpy Skin Disease (88%)',
        note: 'Capripoxvirus dermal markers detected.',
        actor: 'AI Triage Engine',
        role: 'System'
      },
      {
        id: 't-33',
        timestamp: '2026-09-23 11:00 AM',
        status: 'Treatment',
        title: 'Therapy Course Administered',
        note: 'Animal stable, eating dry and green fodder.',
        actor: 'Dr. Pravin Salunkhe',
        role: 'Veterinarian'
      }
    ]
  },
  {
    id: 'case-4',
    caseNumber: 'PR-2026-AN-0210',
    animalType: 'goat',
    breed: 'Osmanabadi (उस्मानाबादी)',
    ageYears: 2,
    earTagId: '100489201951',
    farmerName: 'Khandu Thorat (खांडू थोरात)',
    farmerPhone: '+91 98602 33411',
    village: 'Ashwi (आश्वी)',
    block: 'Sangamner',
    district: 'Ahmednagar',
    lat: 19.5800,
    lng: 74.2200,
    reportedDate: '2026-09-24T01:10:00Z',
    symptoms: [
      'Severe respiratory distress & grunting',
      'Mucopurulent nasal & eye discharge',
      'Dark bloody diarrhea'
    ],
    temperatureF: 104.8,
    mortalityCount: 1,
    affectedCount: 5,
    totalHerdSize: 22,
    photos: [],
    triage: runAITriage({
      animalType: 'goat',
      symptoms: [
        'Severe respiratory distress & grunting',
        'Dark bloody diarrhea'
      ],
      temperatureF: 104.8,
      mortalityCount: 1
    }),
    status: 'Reported',
    timeline: [
      {
        id: 't-41',
        timestamp: '2026-09-24 06:40 AM',
        status: 'Reported',
        title: 'New Flock Disease Alert',
        note: '5 Osmanabadi goats ill with eye encrustations and enteritis.',
        actor: 'Khandu Thorat',
        role: 'Farmer'
      },
      {
        id: 't-42',
        timestamp: '2026-09-24 06:42 AM',
        status: 'Triaged',
        title: 'PPR Suspected (91% Confidence)',
        note: 'Small ruminant morbillivirus risk flagged for Sangamner taluka.',
        actor: 'AI Triage Engine',
        role: 'System'
      }
    ]
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    title: 'EMERGENCY: Suspected FMD Cluster in Shirur - 5km Ring Vaccination Initiated',
    titleMarathi: 'तातडीचा इशारा: शिरूर तालुक्यात लाळ-खुरकूत प्रादुर्भाव - ५ किमी रिंग लसीकरण सुरू',
    titleHindi: 'आपातकालीन चेतावनी: शिरूर प्रखंड में एफएमडी प्रकोप - 5 किमी रिंग टीकाकरण शुरू',
    message: 'Active FMD outbreak identified in Pabal village. Movement of cloven-hoofed animals banned within 5km radius. Emergency NADCP vaccination teams deployed.',
    messageMarathi: 'पाबळ गावात लाळ-खुरकूतची लागण निष्पन्न झाली आहे. ५ किमी परिसरात जनावरांची ने-आण पूर्णपणे बंद आहे. तात्काळ लसीकरण पथके रवाना झाली आहेत.',
    messageHindi: 'पाबल गांव में खुरपका-मुंहपका की पुष्टि हुई है। 5 किमी दायरे में पशुओं के आवागमन पर तत्काल रोक लगाई गई है। रिंग टीकाकरण टीम तैनात है।',
    disease: 'Foot and Mouth Disease (FMD)',
    severity: 'High',
    targetDistrict: 'Pune',
    targetBlock: 'Shirur',
    channels: ['push', 'sms', 'ivr'],
    createdAt: '2026-09-24T04:00:00Z',
    recipientsCount: 4280,
    deliverySuccessRate: 98.4,
    authorRole: 'Chief District Animal Husbandry Officer',
    authorName: 'Dr. Rajesh Kulkarni'
  },
  {
    id: 'alt-2',
    title: 'ALERT: Hemorrhagic Septicemia Spores Detected post-River Flooding in Junnar',
    titleMarathi: 'सतर्कता: जुन्नर तालुक्यात पूर ओसरल्यानंतर घटसर्प (एचएस) जिवाणूंचा धोका',
    titleHindi: 'सतर्कता: जुन्नर में बाढ़ के बाद गलघोंटू (एचएस) जीवाणु फैलने का गंभीर खतरा',
    message: 'DBSCAN anomaly flagged 6 acute mortalities in Otur. Farmers advised to immediately report throat swellings and avoid waterlogged pasture grazing.',
    messageMarathi: 'ओतूर परिसरात जनावरांचे अचानक मृत्यू नोंदवले गेले आहेत. गळ्याला सूज आल्यास तात्काळ १८००-२३३-०२४८ वर संपर्क साधा व पाणथळ जागेत चराई टाळा.',
    messageHindi: 'ओतूर क्षेत्र में मवेशियों की अचानक मृत्यु दर्ज की गई है। गले में सूजन दिखने पर तुरंत सूचना दें व दलदली भूमि में चराई न कराएं।',
    disease: 'Hemorrhagic Septicemia (HS)',
    severity: 'Critical',
    targetDistrict: 'Pune',
    targetBlock: 'Junnar',
    channels: ['push', 'sms'],
    createdAt: '2026-09-23T18:00:00Z',
    recipientsCount: 6150,
    deliverySuccessRate: 96.1,
    authorRole: 'Epidemiological Surveillance Unit',
    authorName: 'State Veterinary Surveillance Directorate'
  },
  {
    id: 'alt-3',
    title: 'ADVISORY: Lumpy Skin Disease Vector Spraying Schedule in Satara',
    titleMarathi: 'सूचना: सातारा जिल्ह्यात लम्पी स्कीन प्रतिबंधक गोचीड व कीटक फवारणी मोहीम',
    titleHindi: 'सलाह: सतारा जिले में लम्पी स्किन रोकथाम हेतु कीटनाशक छिड़काव अभियान',
    message: 'Free anti-vector malathion/deltamethrin spray drive by Pashu-Sevaks across 42 villages in Karad & Patan talukas starting Friday.',
    messageMarathi: 'कराड व पाटण तालुक्यातील ४२ गावांमध्ये पशुसेवकांमार्फत विनामूल्य गोचीड व माश्या प्रतिबंधक औषध फवारणी शुक्रवारपासून सुरू होत आहे.',
    messageHindi: 'कराड एवं पाटन के 42 गांवों में पशुसेवकों द्वारा शुक्रवार से निःशुल्क कीटनाशक छिड़काव अभियान शुरू किया जा रहा है।',
    disease: 'Lumpy Skin Disease (LSD)',
    severity: 'Medium',
    targetDistrict: 'Satara',
    targetBlock: 'Karad',
    channels: ['push', 'sms'],
    createdAt: '2026-09-22T10:00:00Z',
    recipientsCount: 3890,
    deliverySuccessRate: 99.1,
    authorRole: 'District Polyclinic',
    authorName: 'Dr. Pravin Salunkhe'
  }
];
