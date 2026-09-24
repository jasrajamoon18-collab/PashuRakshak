import { AnimalType, SeverityLevel, TriageResult, ShapFactor, DifferentialDisease } from '../types';

interface TriageInput {
  animalType: AnimalType;
  symptoms: string[];
  temperatureF?: number;
  mortalityCount?: number;
  lastVaccinatedFMD?: string;
  lastVaccinatedHS?: string;
  lastVaccinatedLSD?: string;
  herdSize?: number;
}

export function runAITriage(input: TriageInput): TriageResult {
  const { animalType, symptoms, temperatureF = 102, mortalityCount = 0, lastVaccinatedFMD, lastVaccinatedHS, lastVaccinatedLSD } = input;

  // Disease disease scores
  let fmdScore = 0;
  let hsScore = 0;
  let lsdScore = 0;
  let pprScore = 0;
  let anthraxScore = 0;
  let brucellaScore = 0;

  const shapFactors: ShapFactor[] = [];

  // Symptom evaluation
  const hasSalivation = symptoms.some(s => s.toLowerCase().includes('salivation') || s.toLowerCase().includes('लाळ') || s.toLowerCase().includes('लार'));
  const hasFootLesions = symptoms.some(s => s.toLowerCase().includes('foot') || s.toLowerCase().includes('खुर') || s.toLowerCase().includes('hoof'));
  const hasOralBlisters = symptoms.some(s => s.toLowerCase().includes('oral') || s.toLowerCase().includes('mouth') || s.toLowerCase().includes('तोंड') || s.toLowerCase().includes('मुंह'));
  const hasSkinNodules = symptoms.some(s => s.toLowerCase().includes('nodule') || s.toLowerCase().includes('lump') || s.toLowerCase().includes('गाठी') || s.toLowerCase().includes('गांठ'));
  const hasThroatSwelling = symptoms.some(s => s.toLowerCase().includes('throat') || s.toLowerCase().includes('brisket') || s.toLowerCase().includes('घसा') || s.toLowerCase().includes('गले'));
  const hasRespiratory = symptoms.some(s => s.toLowerCase().includes('respiratory') || s.toLowerCase().includes('breathing') || s.toLowerCase().includes('धाप') || s.toLowerCase().includes('सांस'));
  const hasAbortion = symptoms.some(s => s.toLowerCase().includes('abortion') || s.toLowerCase().includes('गर्भपात'));
  const hasSuddenLameness = symptoms.some(s => s.toLowerCase().includes('lameness') || s.toLowerCase().includes('लंगड') || s.toLowerCase().includes('लंगड़ा'));
  const hasBloodyDischarge = symptoms.some(s => s.toLowerCase().includes('bloody') || s.toLowerCase().includes('रक्त') || s.toLowerCase().includes('खून'));
  const hasMilkDrop = symptoms.some(s => s.toLowerCase().includes('milk') || s.toLowerCase().includes('दूध'));

  // FMD Scoring
  if (hasSalivation) {
    fmdScore += 35;
    shapFactors.push({
      feature: 'Profuse ropy salivation',
      featureMarathi: 'फेसयुक्त भरपूर लाळ गळणे',
      featureHindi: 'मुंह से लगातार झागदार लार गिरना',
      weight: 0.35,
      description: 'Hallmark pathogen indicator for Aphthovirus'
    });
  }
  if (hasFootLesions) {
    fmdScore += 30;
    shapFactors.push({
      feature: 'Interdigital foot vesicles / lesions',
      featureMarathi: 'खुरांच्या बेचक्यात फोड व जखमा',
      featureHindi: 'खुरों के बीच गंभीर छाले व घाव',
      weight: 0.30,
      description: 'Epithelial erosion in coronary band'
    });
  }
  if (hasOralBlisters) {
    fmdScore += 30;
    shapFactors.push({
      feature: 'Ruptured oral blisters & tongue ulcers',
      featureMarathi: 'जिभेवर व हिरड्यांवर फुटलेले फोड',
      featureHindi: 'जीभ एवं मसूड़ों पर फटे हुए छाले',
      weight: 0.28,
      description: 'Typical vesicular aphthae pathogenesis'
    });
  }
  if (hasSuddenLameness) {
    fmdScore += 15;
  }
  if (hasMilkDrop) {
    fmdScore += 10;
  }

  // HS (Hemorrhagic Septicemia - Pasteurella multocida)
  if (hasThroatSwelling) {
    hsScore += 45;
    shapFactors.push({
      feature: 'Edematous brisket and submandibular throat swelling',
      featureMarathi: 'घशाखाली व गळ्याला तीव्र गरम सूज',
      featureHindi: 'गले और गलकंबल में दर्दनाक सूजन',
      weight: 0.45,
      description: 'Pasteurellosis endotoxemia signature'
    });
  }
  if (hasRespiratory) {
    hsScore += 30;
    shapFactors.push({
      feature: 'Severe dyspnea and stertorous breathing',
      featureMarathi: 'तीव्र धाप लागणे व घरघर आवाज',
      featureHindi: 'गंभीर सांस कष्ट व घुरघुराहट',
      weight: 0.30,
      description: 'Acute tracheal compression by exudate'
    });
  }
  if (mortalityCount > 0) {
    hsScore += 25;
    anthraxScore += 35;
  }

  // LSD (Lumpy Skin Disease - Capripoxvirus)
  if (hasSkinNodules) {
    lsdScore += 65;
    shapFactors.push({
      feature: 'Circumscribed cutaneous nodules (2-5cm)',
      featureMarathi: 'त्वचेवर ठळक गाठी (२-५ सेंमी)',
      featureHindi: 'त्वचा पर उभरी हुई गोल गांठें',
      weight: 0.55,
      description: 'Characteristic poxvirus dermal lesions'
    });
  }
  if (temperatureF > 103.5) {
    lsdScore += 15;
    fmdScore += 15;
    hsScore += 20;
    shapFactors.push({
      feature: `Systemic pyrexia recorded (${temperatureF}°F)`,
      featureMarathi: `तीव्र ताप नोंद (${temperatureF}° फॅ)`,
      featureHindi: `उच्च ज्वर दर्ज (${temperatureF}°F)`,
      weight: 0.18,
      description: 'Acute phase inflammatory response'
    });
  }

  // PPR (Peste des Petits Ruminants)
  if (animalType === 'goat' || animalType === 'sheep') {
    if (hasRespiratory && hasBloodyDischarge) {
      pprScore += 70;
      shapFactors.push({
        feature: 'Small ruminant pneumo-enteritis syndrome',
        featureMarathi: 'शेळ्यांमधील न्यूमोनिया व रक्ती हगवण',
        featureHindi: 'बकरियों में निमोनिया व दस्त सिंड्रोम',
        weight: 0.50,
        description: 'Morbillivirus tropism in small ruminants'
      });
    }
  }

  // Anthrax
  if (hasBloodyDischarge && mortalityCount > 0) {
    anthraxScore += 60;
    shapFactors.push({
      feature: 'Peracute sudden death with dark unclotted discharge',
      featureMarathi: 'अचानक मृत्यू व नैसर्गिक छिद्रांतून रक्तस्राव',
      featureHindi: 'अचानक मृत्यु व गहरे बिना जमे खून का स्राव',
      weight: 0.60,
      description: 'Bacillus anthracis septicemia indicator'
    });
  }

  // Brucellosis
  if (hasAbortion) {
    brucellaScore += 60;
    shapFactors.push({
      feature: 'Third-trimester bovine abortion storm',
      featureMarathi: 'शेवटच्या तिमाहीतील अचानक गर्भपात',
      featureHindi: 'अंतिम तिमाही में अचानक गर्भपात होना',
      weight: 0.45,
      description: 'Erythritol localization by Brucella abortus'
    });
  }

  // Vaccination attenuation (Protective / Negative SHAP weight)
  if (lastVaccinatedFMD && fmdScore > 0) {
    fmdScore = Math.max(10, fmdScore - 25);
    shapFactors.push({
      feature: `Recent FMD vaccination reported (${lastVaccinatedFMD})`,
      featureMarathi: `नुकतेच लाळ-खुरकूत लसीकरण झालेले (${lastVaccinatedFMD})`,
      featureHindi: `हाल ही में एफएमडी टीकाकरण दर्ज (${lastVaccinatedFMD})`,
      weight: -0.22,
      description: 'Humoral neutralizing antibody protection present'
    });
  }

  if (lastVaccinatedHS && hsScore > 0) {
    hsScore = Math.max(10, hsScore - 20);
    shapFactors.push({
      feature: `Prior HS vaccination logged (${lastVaccinatedHS})`,
      featureMarathi: `घटसर्प लस दिलेली (${lastVaccinatedHS})`,
      featureHindi: `गलघोंटू का टीका लगा हुआ (${lastVaccinatedHS})`,
      weight: -0.18,
      description: 'Alum precipitated bacterin protection'
    });
  }

  // Determine highest matching disease
  const diseaseScores = [
    { 
      name: 'Foot and Mouth Disease (FMD)', 
      marathi: 'लाळ-खुरकूत (एफएमडी)', 
      hindi: 'खुरपका-मुंहपका (FMD)',
      score: fmdScore, 
      pathogen: 'Viral' as const 
    },
    { 
      name: 'Hemorrhagic Septicemia (HS)', 
      marathi: 'घटसर्प (एचएस)', 
      hindi: 'गलघोंटू (HS)',
      score: hsScore, 
      pathogen: 'Bacterial' as const 
    },
    { 
      name: 'Lumpy Skin Disease (LSD)', 
      marathi: 'लम्पी त्वचा रोग (एलएसडी)', 
      hindi: 'लम्पी स्किन डिजीज (LSD)',
      score: lsdScore, 
      pathogen: 'Viral' as const 
    },
    { 
      name: 'Peste des Petits Ruminants (PPR)', 
      marathi: 'शेळ्या-मेंढ्यांचा पीपीआर (बकरी प्लेग)', 
      hindi: 'पीपीआर (बकरी प्लेग)',
      score: pprScore, 
      pathogen: 'Viral' as const 
    },
    { 
      name: 'Anthrax (Splenic Fever)', 
      marathi: 'काळपुळी (अँथ्रॅक्स)', 
      hindi: 'एंथ्रेक्स (कालपुली)',
      score: anthraxScore, 
      pathogen: 'Bacterial' as const 
    },
    { 
      name: 'Brucellosis', 
      marathi: 'ब्रुसेलोसिस (संसर्गजन्य गर्भपात)', 
      hindi: 'ब्रुसेलोसिस',
      score: brucellaScore, 
      pathogen: 'Bacterial' as const 
    },
  ];

  diseaseScores.sort((a, b) => b.score - a.score);
  const top = diseaseScores[0];
  const maxScore = top.score;

  let confidence = Math.min(96, Math.max(38, Math.round(maxScore * 0.95)));
  let ruleBasedFallbackUsed = false;

  // Fallback trigger if no specific symptoms selected or low confidence
  if (maxScore < 30) {
    confidence = 52;
    ruleBasedFallbackUsed = true;
  }

  // Build differentials
  const totalPositive = diseaseScores.reduce((acc, curr) => acc + Math.max(5, curr.score), 0);
  const differentials: DifferentialDisease[] = diseaseScores.slice(0, 4).map(d => ({
    disease: d.name,
    diseaseMarathi: d.marathi,
    diseaseHindi: d.hindi,
    probability: Math.round((Math.max(5, d.score) / totalPositive) * 100)
  }));

  // Determine severity
  let severity: SeverityLevel = 'Low';
  if (top.name.includes('Anthrax') || mortalityCount > 0 || (top.name.includes('HS') && hasRespiratory)) {
    severity = 'Critical';
  } else if (top.name.includes('FMD') || top.name.includes('HS') || top.name.includes('LSD') || hasSkinNodules) {
    severity = 'High';
  } else if (confidence > 60 || temperatureF > 103) {
    severity = 'Medium';
  }

  const isEscalated = severity === 'High' || severity === 'Critical';

  // Standard SOP Recommendations based on top prediction
  let recommendedAction = 'Immediate quarantine of affected animal in segregated shelter away from main herd.';
  let recommendedActionMarathi = 'बाधित जनावराला गोठ्यापासून वेगळे करून स्वतंत्र निवाऱ्यात ताबडतोब क्वॉरंटाइन करा.';
  let recommendedActionHindi = 'संक्रमित पशु को तुरंत अन्य स्वस्थ पशुओं से अलग बाड़े में क्वारंटाइन करें।';

  let firstAidAdvice: string[] = [];
  let firstAidAdviceMarathi: string[] = [];
  let firstAidAdviceHindi: string[] = [];

  if (top.name.includes('FMD')) {
    recommendedAction = 'Quarantine within 500m perimeter. Disinfect shed with 4% Sodium Carbonate (Washing Soda). Restrict herd movement.';
    recommendedActionMarathi = '५०० मीटर क्षेत्रात इतर जनावरांचा वावर थांबवा. गोठा ४% कपडे धुण्याचा सोडा (सोडियम कार्बोनेट) च्या पाण्याने धुवून निर्जंतुक करा.';
    recommendedActionHindi = '500 मीटर के दायरे में पशु आवाजाही रोकें। बाड़े को 4% कपड़े धोने के सोडे (सोडियम कार्बोनेट) से धोकर विसंक्रमित करें।';
    firstAidAdvice = [
      'Wash oral mouth lesions with 1% Potassium Permanganate (Lal Dawai) or Boroglycerine paste',
      'Apply coconut oil mixed with camphor on foot lesions to prevent maggot infestation',
      'Provide soft green fodder, gruel (kanji/daliya), and cold fresh drinking water',
      'Do not allow infected cattle to graze on common village pasture'
    ];
    firstAidAdviceMarathi = [
      'तोंडातील जखमा १% पोटॅशियम परमँगनेट (लाल औषध) किंवा बोरो-ग्लिसरीनने हळुवार स्वच्छ करा',
      'खुरांच्या जखमांवर किडे पडू नयेत म्हणून खोबरेल तेलात कापूर मिसळून लावा',
      'जनावराला कोवळा मऊ हिरवा चारा आणि दलिया/पेज खाऊ घाला',
      'गावातील सामायिक चराऊ कुरणात किंवा पाझर तलावावर बाधित जनावर नेऊ नका'
    ];
    firstAidAdviceHindi = [
      'मुंह के छालों को 1% पोटेशियम परमैंगनेट (लाल दवा) के हल्के घोल या बोरोग्लिसरीन से साफ करें',
      'खुरों के घावों पर कीड़े पड़ने से रोकने के लिए नारियल तेल में कपूर मिलाकर लगाएं',
      'पशु को मुलायम हरा चारा और दलिया/मांड जैसी तरल खुराक दें',
      'संक्रमित पशु को सामूहिक चारागाह या गांव के तालाब पर न ले जाएं'
    ];
  } else if (top.name.includes('HS')) {
    recommendedAction = 'EMERGENCY: Immediate intravenous antibiotic therapy required. High risk of mortality within 24-36 hours.';
    recommendedActionMarathi = 'तातडीची आणीबाणी: पशुवैद्यकांमार्फत तात्काळ शिरेतून प्रतिजैविक (Antibiotic) उपचार सुरू करणे आवश्यक.';
    recommendedActionHindi = 'आपातकालीन स्थिति: पशु चिकित्सक द्वारा तत्काल नसों के माध्यम से एंटीबायोटिक उपचार अति-आवश्यक।';
    firstAidAdvice = [
      'Keep animal in well-ventilated dry shed with head in elevated position to ease breathing',
      'Apply cold water compression on hot swollen neck area',
      'Do not forcefully drench fluids as it may cause aspiration pneumonia'
    ];
    firstAidAdviceMarathi = [
      'जनावराचे डोके उंच राहील अशा कोरड्या व हवेशीर जागेत ठेवा जेणेकरून श्वास घेणे सुलभ होईल',
      'गळ्यावरील गरम सुजेवर थंड पाण्याच्या पट्ट्या ठेवा',
      'जनावराच्या घशात बळजबरीने पातळ औषध किंवा पाणी ओतू नका'
    ];
    firstAidAdviceHindi = [
      'पशु का सिर ऊंचा रखते हुए हवादार सूखे स्थान पर रखें ताकि सांस लेने में आसानी हो',
      'गले की गर्म सूजन पर ठंडे पानी की पट्टियां रखें',
      'पशु को जबरन तरल दवा या पानी न पिलाएं, इससे सांस नली में पानी जा सकता है'
    ];
  } else if (top.name.includes('LSD')) {
    recommendedAction = 'Vector control alert: Spray anti-tick & fly repellents. Disinfect surrounding premises.';
    recommendedActionMarathi = 'कीटक नियंत्रण मोहीम: गोचीड व माश्या प्रतिबंधक औषध फवारा. गोठ्याचा परिसर कोरडा ठेवा.';
    recommendedActionHindi = 'मक्खी-मच्छर नियंत्रण: बाड़े में कीटनाशक व मक्खी रोधी स्प्रे करें। परिसर को स्वच्छ व सूखा रखें।';
    firstAidAdvice = [
      'Apply neem leaf paste with turmeric on skin nodules to prevent secondary bacterial infection',
      'Hang neem smoke / camphor smoke in shed during twilight hours to repel mosquitoes and flies',
      'Administer oral multivitamin and liver tonic supplements to support immunity'
    ];
    firstAidAdviceMarathi = [
      'अंगावरील गाठींवर कडुनिंबाचा पाला आणि हळद बारीक वाटून लावा',
      'संध्याकाळी गोठ्यात कडुनिंबाचा पाला व कापूरचा धूर करून डास व माश्या पळवून लावा',
      'रोगप्रतिकारक शक्ती वाढवण्यासाठी जनावराला गुळ, हळद व जीवनसत्त्वे द्या'
    ];
    firstAidAdviceHindi = [
      'त्वचा की गांठों पर नीम की पत्ती और हल्दी का लेप लगाएं ताकि संक्रमण न फैले',
      'शाम के समय बाड़े में नीम की पत्तियों का धुआं करें ताकि मक्खी-मच्छर दूर रहें',
      'प्रतिरोधक क्षमता बढ़ाने हेतु गुड़, हल्दी व विटामिन टॉनिक दें'
    ];
  } else {
    firstAidAdvice = [
      'Isolate the animal in clean, dry shelter immediately',
      'Maintain continuous access to clean drinking water',
      'Record rectal body temperature twice daily'
    ];
    firstAidAdviceMarathi = [
      'जनावराला ताबडतोब स्वच्छ व कोरड्या जागेत वेगळे ठेवा',
      'पिण्यासाठी सतत स्वच्छ पाणी उपलब्ध ठेवा',
      'दिवसातून दोनदा जनावराचे तापमान नोंदवून ठेवा'
    ];
    firstAidAdviceHindi = [
      'पशु को तत्काल साफ-सुथरे अलग बाड़े में रखें',
      'पीने के लिए स्वच्छ जल की निरंतर व्यवस्था रखें',
      'दिन में दो बार पशु का शारीरिक तापमान नोट करें'
    ];
  }

  return {
    probableDisease: top.name,
    diseaseMarathi: top.marathi,
    diseaseHindi: top.hindi,
    pathogenType: top.pathogen,
    confidence,
    severity,
    ruleBasedFallbackUsed,
    differentials,
    shapFactors: shapFactors.slice(0, 5),
    recommendedAction,
    recommendedActionMarathi,
    recommendedActionHindi,
    firstAidAdvice,
    firstAidAdviceMarathi,
    firstAidAdviceHindi,
    isEscalated,
    escalatedToVet: isEscalated ? 'Dr. Sunita Deshmukh (Taluka Veterinary Hospital)' : undefined,
    sampleRequisitionRecommended: isEscalated
  };
}
