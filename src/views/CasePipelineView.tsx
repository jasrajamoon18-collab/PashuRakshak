import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseStatus, LivestockCase } from '../types';
import { 
  Filter, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  Eye, 
  AlertTriangle 
} from 'lucide-react';

export const CasePipelineView: React.FC = () => {
  const { cases, updateCaseStatus, setSelectedCase, language, t } = useApp();

  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const statuses: CaseStatus[] = [
    'Reported',
    'Triaged',
    'Vet Assigned',
    'Sample Sent',
    'Lab Testing',
    'Treatment',
    'Resolved'
  ];

  // Filtering
  const filteredCases = cases.filter(c => {
    if (filterBlock !== 'all' && c.block !== filterBlock) return false;
    if (filterSeverity !== 'all' && c.triage.severity !== filterSeverity) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const match = 
        c.caseNumber.toLowerCase().includes(term) ||
        c.earTagId.toLowerCase().includes(term) ||
        c.farmerName.toLowerCase().includes(term) ||
        c.village.toLowerCase().includes(term) ||
        c.triage.probableDisease.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const getStatusCases = (status: CaseStatus) => {
    return filteredCases.filter(c => c.status === status);
  };

  const advanceCase = (c: LivestockCase, e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = statuses.indexOf(c.status);
    if (currIdx < statuses.length - 1) {
      const nextStatus = statuses[currIdx + 1];
      updateCaseStatus(c.id, nextStatus, `Advanced manually to ${nextStatus}`);
    }
  };

  const regressCase = (c: LivestockCase, e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = statuses.indexOf(c.status);
    if (currIdx > 0) {
      const prevStatus = statuses[currIdx - 1];
      updateCaseStatus(c.id, prevStatus, `Returned to ${prevStatus}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <span>Connected Epidemiological Case Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end audit tracking: from offline farmer symptom submission to laboratory molecular confirmation & clinical resolution.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tag, Farmer, Disease..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <select
            value={filterBlock}
            onChange={e => setFilterBlock(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="all">All Talukas</option>
            <option value="Shirur">Shirur</option>
            <option value="Junnar">Junnar</option>
            <option value="Ambegaon">Ambegaon</option>
            <option value="Karad">Karad</option>
            <option value="Sangamner">Sangamner</option>
          </select>

          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Container (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {statuses.map((status, colIdx) => {
          const colCases = getStatusCases(status);
          const colHeaderColor = 
            status === 'Reported' ? 'border-amber-400' :
            status === 'Triaged' ? 'border-blue-400' :
            status === 'Vet Assigned' ? 'border-purple-400' :
            status === 'Sample Sent' ? 'border-indigo-400' :
            status === 'Lab Testing' ? 'border-pink-400' :
            status === 'Treatment' ? 'border-teal-400' : 'border-emerald-500';

          return (
            <div
              key={status}
              className="w-72 shrink-0 bg-slate-100/80 rounded-xl p-3 border border-slate-200 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className={`border-t-4 ${colHeaderColor} bg-white p-3 rounded-lg shadow-xs mb-3 flex items-center justify-between`}>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{status}</h3>
                  <div className="text-[10px] text-slate-500">Stage {colIdx + 1} of 7</div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                  {colCases.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colCases.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    No active cases in this stage
                  </div>
                ) : (
                  colCases.map(c => {
                    const isCrit = c.triage.severity === 'Critical';
                    const isHigh = c.triage.severity === 'High';

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className="bg-white rounded-lg p-3.5 border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2 text-xs group"
                      >
                        {/* Top: Case ID & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 group-hover:text-emerald-800">
                            {c.caseNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCrit ? 'bg-red-100 text-red-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.triage.severity}
                          </span>
                        </div>

                        {/* Middle: Animal & Disease */}
                        <div>
                          <div className="font-semibold text-emerald-900 line-clamp-1">
                            {language === 'mr' ? c.triage.diseaseMarathi : language === 'hi' ? c.triage.diseaseHindi : c.triage.probableDisease}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {c.animalType.toUpperCase()} · Tag: <span className="font-mono">{c.earTagId}</span>
                          </div>
                        </div>

                        {/* Location & Farmer */}
                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                          <div className="flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.village} ({c.block})</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-700">{c.triage.confidence}%</span>
                        </div>

                        {/* Lab Sample Barcode if attached */}
                        {c.labSample && (
                          <div className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded flex items-center justify-between">
                            <span>Lab: {c.labSample.sampleBarcode}</span>
                            <span className="font-bold">{c.labSample.resultStatus}</span>
                          </div>
                        )}

                        {/* Action buttons to advance or regress status */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            onClick={e => regressCase(c, e)}
                            disabled={colIdx === 0}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Move Back"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.timeline.length} actions logged
                          </span>

                          <button
                            onClick={e => advanceCase(c, e)}
                            disabled={colIdx === statuses.length - 1}
                            className="p-1 rounded text-emerald-700 hover:text-emerald-900 disabled:opacity-20 cursor-pointer flex items-center"
                            title="Advance to next stage"
                          >
                            <span className="text-[10px] font-semibold mr-0.5">Advance</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
