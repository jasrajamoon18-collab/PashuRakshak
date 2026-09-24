import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  User, 
  Bot, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionPayload?: {
    suggestedDisease?: string;
    suggestedSymptoms?: string[];
  };
}

export const ChatbotModal: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen, language, setActiveView, setRole } = useApp();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'bot',
      text: language === 'mr'
        ? 'नमस्कार! मी पशू-मित्र AI सहाय्यक आहे. तुमच्या जनावराची लक्षणे सांगा (उदा. तोंडातून लाळ गळणे, ताप, अंगावर गाठी) किंवा लसीकरण व प्रथमोपचाराबद्दल विचारा.'
        : language === 'hi'
        ? 'नमस्ते! मैं पशु-मित्र AI सहायक हूँ। अपने पशु के लक्षण बताएं (जैसे मुंह से लार, तेज बुखार, गले में सूजन) या प्राथमिक उपचार के बारे में पूछें।'
        : 'Hello! I am Pashu-Mitra, your AI Livestock Health Assistant. Describe your animal\'s symptoms or ask about vaccination, isolation, or first-aid protocols.',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatbotOpen) return null;

  const quickPrompts = [
    {
      mr: 'गाईच्या तोंडातून लाळ गळत आहे आणि पायात फोड आले आहेत',
      hi: 'गाय के मुंह से झागदार लार और पैरों में छाले हैं',
      en: 'Cow has ropy drooling and ulcers between hooves'
    },
    {
      mr: 'म्हैशीच्या गळ्याला मोठी सूज आली आहे आणि घरघर आवाज येतोय',
      hi: 'भैंस के गले में सूजन है और सांस लेने में घरघराहट है',
      en: 'Buffalo has brisket swelling and labored grunting breathing'
    },
    {
      mr: 'वासरूच्या अंगावर गोल गाठी (लम्पी स्कीन) आल्या आहेत',
      hi: 'बछड़े के शरीर पर उभरी हुई गांठें (लम्पी) दिख रही हैं',
      en: 'Calf has hard cutaneous nodules all over skin'
    },
    {
      mr: 'लाळ-खुरकूत रोगावर घरगुती प्रथमोपचार काय करावे?',
      hi: 'खुरपका-मुंहपका रोग में क्या प्राथमिक उपचार करें?',
      en: 'What immediate first-aid for Foot and Mouth Disease?'
    }
  ];

  // Speech Recognition (Web Speech API)
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate intelligent AI clinical response
    setTimeout(() => {
      let botResponse = '';
      let actionPayload: any = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('लाळ') || lower.includes('drool') || lower.includes('salivat') || lower.includes('लार') || lower.includes('फोड') || lower.includes('hoof') || lower.includes('fmd')) {
        botResponse = language === 'mr'
          ? '⚠️ हे लाळ-खुरकूत (Foot & Mouth Disease - FMD) चे संभाव्य लक्षण आहे!\n\n१. बाधित जनावराला इतर जनावरांपासून तात्काळ वेगळे (Isolate) करा.\n२. तोंड व खुरांतील जखमा १% पोटॅशियम परमँगनेट (लाल पाणी) किंवा तुरटीच्या पाण्याने स्वच्छ करा.\n३. तोंडावर बोरो ग्लिसरीन लावा.\n४. पाणी व मऊ चारा (कडबा नाही) द्या.\n\nमी तुमच्यासाठी रिपोर्ट फॉर्ममध्ये ही माहिती भरू का?'
          : language === 'hi'
          ? '⚠️ यह खुरपका-मुंहपका (FMD) का लक्षण प्रतीत होता है!\n\n1. बीमार पशु को तुरंत स्वस्थ पशुओं से अलग बांधें।\n2. घाव को 1% पोटाश (KMNO4) के पानी से धोएं।\n3. मुंह में बोरो-ग्लिसरीन लगाएं।\n4. दलिया या मुलायम हरा चारा दें।\n\nक्या आप इसे तुरंत रिपोर्ट करना चाहते हैं?'
          : '⚠️ These symptoms strongly indicate Foot and Mouth Disease (FMD)!\n\n1. Isolate the affected animal immediately to prevent herd transmission.\n2. Wash mouth and hoof lesions with 1% KMNO4 (Potassium Permanganate) solution.\n3. Apply Boroglycerine to oral ulcers.\n4. Feed soft gruel and clean water.\n\nWould you like to auto-fill the Smart Reporting Form now?';

        actionPayload = {
          suggestedDisease: 'Foot and Mouth Disease (FMD)',
          suggestedSymptoms: ['Profuse ropy salivation', 'Interdigital foot lesions', 'Oral blisters on tongue']
        };
      } else if (lower.includes('सूज') || lower.includes('घटसर्प') || lower.includes('swelling') || lower.includes('throat') || lower.includes('hs') || lower.includes('गलघोंटू')) {
        botResponse = language === 'mr'
          ? '🚨 अत्यंत तातडीचा इशारा: गळ्याखालील मोठी सूज आणि धाप लागणे हे घटसर्प (Hemorrhagic Septicemia - HS) चे लक्षण असू शकते. हा रोग अत्यंत जलद गतीने पसरतो. कृपया घरगुती उपचारात वेळ न घालवता जवळच्या पशुवैद्यकाला तात्काळ बोलवा किंवा आमच्या फॉर्मवरून रिपोर्ट करा!'
          : language === 'hi'
          ? '🚨 आपातकालीन चेतावनी: गले में भारी सूजन और सांस कष्ट गलघोंटू (HS) का संकेत हो सकता है। यह बीमारी जानलेवा हो सकती है। बिना देरी किए तुरंत पशु चिकित्सक को बुलाएं!'
          : '🚨 Critical Alert: Painful throat swelling with respiratory distress is the hallmark of Hemorrhagic Septicemia (HS). This requires urgent intravenous antibiotics (Ceftiofur / Flunixin) within hours. Dispatching notification to nearest vet is strongly advised.';

        actionPayload = {
          suggestedDisease: 'Hemorrhagic Septicemia (HS)',
          suggestedSymptoms: ['Painful throat and brisket swelling', 'Severe respiratory distress & grunting']
        };
      } else if (lower.includes('गाठी') || lower.includes('लम्पी') || lower.includes('nodule') || lower.includes('lsd') || lower.includes('गांठ')) {
        botResponse = language === 'mr'
          ? 'हे लम्पी स्कीन (Lumpy Skin Disease) चे लक्षण दिसते. कडूनिंबाची पाने पाण्यात उकळून त्या पाण्याने जनावराचे अंग पुसा. गोठ्यात डास व गोचीड प्रतिबंधक धूर करा. शेजारील जनावरांना गोटपॉक्स लस टोचून घ्या.'
          : language === 'hi'
          ? 'यह लम्पी त्वचा रोग (LSD) का लक्षण है। नीम की पत्तियों के काढ़े से घाव धोएं और मक्खी-मच्छर दूर रखने के लिए धुआं करें। स्वस्थ पशुओं को गोटपॉक्स टीका लगवाएं।'
          : 'This indicates Lumpy Skin Disease (LSD). Apply herbal neem oil or turmeric paste on cutaneous nodules. Ensure strict fly and tick control in cattle sheds to halt vector transmission.';
      } else {
        botResponse = language === 'mr'
          ? 'मी तुमची नोंद घेत आहे. अचूक निदानासाठी जनावराचा प्रकार (गाय/म्हैस/शेळी), तापमान आणि मुख्य लक्षणे सांगा. अधिक माहितीसाठी आमचा स्मार्ट रिपोर्टिंग फॉर्म वापरा.'
          : language === 'hi'
          ? 'पशु के स्पष्ट लक्षण, तापमान और प्रजाति बताएं ताकि मैं सटीक प्राथमिक सलाह दे सकूं। आप फॉर्म के जरिए भी सीधे रिपोर्ट कर सकते हैं।'
          : 'Thank you for reaching out. Please state the animal type, temperature, and specific visible signs (drooling, lameness, diarrhea, swellings) so I can calculate differential triage.';
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(botResponse);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[620px] shadow-2xl flex flex-col text-slate-900 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Pashu-Mitra (पशू-मित्र)</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-emerald-200">
                AI Multilingual Livestock Health Specialist
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsChatbotOpen(false)}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
          {messages.map(msg => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    PM
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                    isBot 
                      ? 'bg-white text-slate-900 border border-slate-200 shadow-xs rounded-tl-xs' 
                      : 'bg-emerald-800 text-white rounded-br-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{msg.text}</p>
                  
                  {isBot && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        title="Listen Voice Output"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}

                  {/* If action payload present, offer direct jump to Smart Reporting form */}
                  {msg.actionPayload && (
                    <button
                      onClick={() => {
                        setIsChatbotOpen(false);
                        setRole('farmer');
                        setActiveView('farmer');
                      }}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold p-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Open Form & File Official Case Now →</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none text-[11px]">
          {quickPrompts.map((q, idx) => {
            const promptText = language === 'mr' ? q.mr : language === 'hi' ? q.hi : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(promptText)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition text-[11px] cursor-pointer"
              >
                {promptText}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input (Marathi / Hindi / English)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={language === 'mr' ? 'येथे लक्षणे विचारा किंवा बोला...' : language === 'hi' ? 'यहाँ लक्षण पूछें या बोलें...' : 'Type symptoms or ask questions...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-30 text-white p-2 rounded-lg transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
