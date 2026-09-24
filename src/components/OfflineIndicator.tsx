import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, toggleOnlineStatus, offlineQueue, syncOfflineQueue, t } = useApp();

  const handleSync = () => {
    syncOfflineQueue();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.9 }
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
      {!isOnline ? (
        <div className="flex items-center gap-2.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span>{t('offline')}</span>
          {offlineQueue.length > 0 && (
            <span className="bg-amber-800 px-2 py-0.5 rounded text-[11px] font-mono">
              {offlineQueue.length} {t('sync_pending')}
            </span>
          )}
          <button
            onClick={toggleOnlineStatus}
            className="ml-1 text-[11px] underline hover:text-amber-100 transition-colors cursor-pointer"
          >
            Go Online
          </button>
        </div>
      ) : offlineQueue.length > 0 ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-medium text-white shadow-lg">
          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-emerald-300" />
          <span>{offlineQueue.length} offline reports ready</span>
          <button
            onClick={handleSync}
            className="ml-2 bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {t('sync_now')}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-emerald-400 shadow backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-200">Surveillance Network Online</span>
          <button
            onClick={toggleOnlineStatus}
            className="ml-2 text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            title="Simulate offline village field condition"
          >
            Test Offline
          </button>
        </div>
      )}
    </div>
  );
};
