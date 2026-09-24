import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ChatbotModal } from './components/ChatbotModal';
import { TriageResultModal } from './views/TriageResultModal';
import { CaseDetailModal } from './views/CaseDetailModal';

// Views
import { LandingView } from './views/LandingView';
import { FarmerDashboardView } from './views/FarmerDashboardView';
import { CasePipelineView } from './views/CasePipelineView';
import { AuthorityDashboardView } from './views/AuthorityDashboardView';
import { VetDashboardView } from './views/VetDashboardView';
import { LabPortalView } from './views/LabPortalView';
import { AnalyticsView } from './views/AnalyticsView';

import { MessageSquare, Bot } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setIsChatbotOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 w-full pb-12">
        {activeView === 'landing' && <LandingView />}
        {activeView === 'farmer' && <FarmerDashboardView />}
        {activeView === 'pipeline' && <CasePipelineView />}
        {activeView === 'authority' && <AuthorityDashboardView />}
        {activeView === 'vet' && <VetDashboardView />}
        {activeView === 'lab' && <LabPortalView />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>

      {/* Floating Chatbot Assistant Trigger Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-emerald-800 hover:bg-emerald-900 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 group cursor-pointer border-2 border-emerald-600/40"
        title="Open Pashu-Mitra AI Health Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-emerald-200" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide pr-1">
          Pashu-Mitra AI
        </span>
      </button>

      {/* Offline Status & Sync Manager */}
      <OfflineIndicator />

      {/* Modals */}
      <ChatbotModal />
      <TriageResultModal />
      <CaseDetailModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
