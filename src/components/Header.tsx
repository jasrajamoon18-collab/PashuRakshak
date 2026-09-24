import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Globe, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { Language, UserRole } from '../types';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    language, 
    setLanguage, 
    role, 
    setRole, 
    setIsChatbotOpen,
    offlineQueue,
    alerts,
    t 
  } = useApp();

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'farmer', label: 'Report & Triage' },
    { id: 'pipeline', label: 'Case Pipeline' },
    { id: 'authority', label: 'GIS Command' },
    { id: 'vet', label: 'Vet Console' },
    { id: 'lab', label: 'Lab Portal' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element wordmark brand */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-black text-lg shadow-sm">
              PR
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
              PashuRakshak
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                  isActive 
                    ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' 
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Language switcher, Role selector, AI assistant, Install) */}
        <div className="flex items-center gap-2.5">
          {/* AI Chatbot quick trigger */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="Open Pashu-Mitra Multilingual AI Assistant"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Pashu-Mitra</span>
          </button>

          {/* Language Toggle: EN / MR / HI */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'en' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'mr' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'hi' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <select
              value={role}
              onChange={e => {
                const newRole = e.target.value as UserRole;
                setRole(newRole);
                if (newRole === 'farmer') setActiveView('farmer');
                if (newRole === 'vet') setActiveView('vet');
                if (newRole === 'lab') setActiveView('lab');
                if (newRole === 'authority') setActiveView('authority');
              }}
              className="bg-emerald-900 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer appearance-none hover:bg-emerald-800 transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              <option value="farmer">👨‍🌾 Farmer</option>
              <option value="pashusevak">🩺 Pashu-Sevak</option>
              <option value="vet">🥼 Veterinarian</option>
              <option value="lab">🔬 Lab Scientist</option>
              <option value="authority">🏛️ District Admin</option>
            </select>
          </div>

          {/* PWA Install */}
          <PWAInstallButton />
        </div>
      </div>

      {/* Mobile nav bar row for small viewports */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-100 overflow-x-auto bg-slate-50 text-xs">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md cursor-pointer ${
              activeView === item.id 
                ? 'bg-emerald-800 text-white font-medium' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
