import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, ShieldCheck, HeartHandshake, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                PR
              </div>
              <span className="text-base font-bold text-white tracking-tight">PashuRakshak</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered livestock disease early warning and epidemiological surveillance platform built for Smart India Hackathon 2026.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              Smart India Hackathon 2026 · PS 26128
            </div>
          </div>

          {/* Quick Helpline */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Emergency Helplines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Toll-Free Kisan Call: 1800-233-0248</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>SMS Triage Fallback: Send PR to 56161</span>
              </li>
              <li className="text-slate-400 text-[11px]">
                CDIL Pune State Reference Lab: 020-2569-8120
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Govt & Protocol Standards</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>NADCP (National Animal Disease Control)</li>
              <li>e-GOPALA Interoperability Schema</li>
              <li>Bharat Pashudhan 12-Digit Tag Integration</li>
              <li>DBSCAN Spatial Anomaly Algorithm</li>
              <li>ICAR-NIVEDI Disease Forewarning Matrix</li>
            </ul>
          </div>

          {/* Team / SIH Info */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">System Specifications</h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-2">
              Designed for Maharashtra's 2.3 Crore bovine livestock, addressing the 1:10,000 veterinary ratio via offline-first edge reporting and explainable AI triage.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Version 2.6.0 · Production Ready</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 PashuRakshak Initiative. All rights reserved. Built for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Offline PWA Certified</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">FMD Bio-Security Protocol</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Multilingual Voice Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
