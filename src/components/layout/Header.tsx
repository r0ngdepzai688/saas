import React from 'react';
import {
  Download,
  Wifi,
  User,
  LayoutDashboard,
  Factory,
  LineChart
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  timeframe?: string;
  setTimeframe?: (tf: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
}) => {
  const isPlaygroundMode = activeTab === 'visual-playground';
  const isAnalyticsMode = activeTab === 'visual-analytics';
  const isFactoryMode = activeTab === 'factory-mes';

  const getHeaderTitle = () => {
    if (isPlaygroundMode) return 'Visual Analytics Playground';
    if (isAnalyticsMode) return 'Visual Analytics & Graphic System';
    if (isFactoryMode) return 'FactoryCore MES Pro';
    return 'Executive Intelligence';
  };

  const getHeaderSubtitle = () => {
    if (isPlaygroundMode) return 'Interactive enterprise chart laboratory • Test, compare, & validate 2026 archetypes';
    if (isAnalyticsMode) return '2026 Enterprise chart engine • SPC, Pareto, Cp/Cpk, Sankey & Treemap';
    if (isFactoryMode) return 'Real-time production metrics, OEE tracking & line status';
    return 'Real-time enterprise metrics & autonomous intelligence';
  };

  return (
    <header className="glass-header px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-warm-900 tracking-tight">
              {getHeaderTitle()}
            </h1>
            <span
              className={`glass-badge ${
                isPlaygroundMode
                  ? 'bg-blue-100/90 text-blue-800 border-blue-300/50'
                  : isAnalyticsMode
                  ? 'bg-indigo-100/90 text-indigo-800 border-indigo-300/50'
                  : isFactoryMode
                  ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300/50'
                  : 'bg-sage-100/90 text-sage-800 border-sage-300/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                  isPlaygroundMode
                    ? 'bg-blue-500'
                    : isAnalyticsMode
                    ? 'bg-indigo-500'
                    : isFactoryMode
                    ? 'bg-emerald-500'
                    : 'bg-emerald-500'
                }`}
              />
              {isPlaygroundMode
                ? 'Playground Active'
                : isAnalyticsMode
                ? 'Engine Active'
                : isFactoryMode
                ? 'MES Online'
                : 'Systems Nominal'}
            </span>
          </div>
          <p className="text-xs text-warm-600 mt-0.5">{getHeaderSubtitle()}</p>
        </div>
      </div>

      {/* Right Controls: Mode Toggle, Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mode Switcher Pill */}
        <div className="flex items-center p-1 rounded-xl bg-warm-200/60 border border-warm-300/60">
          <button
            onClick={() => setActiveTab('visual-playground')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isPlaygroundMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-warm-700 hover:text-warm-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Playground</span>
          </button>
          <button
            onClick={() => setActiveTab('visual-analytics')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isAnalyticsMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-warm-700 hover:text-warm-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Workbench</span>
          </button>
          <button
            onClick={() => setActiveTab('factory-mes')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isFactoryMode
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-warm-700 hover:text-warm-900'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>MES</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              !isPlaygroundMode && !isAnalyticsMode && !isFactoryMode
                ? 'bg-terracotta-600 text-white shadow-sm'
                : 'text-warm-700 hover:text-warm-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive</span>
          </button>
        </div>

        {/* Live MES Timestamp & Wifi indicator */}
        {isFactoryMode && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-slate-200 text-xs font-mono font-semibold text-slate-700 shadow-sm">
            <span>22/05/2024 10:15:30</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-sans">
              <User className="w-3 h-3" /> Operator
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onExport}
          className="glass-btn-primary flex items-center gap-2 text-xs py-1.5 px-3.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isAnalyticsMode ? 'Export Statistical Audit' : isFactoryMode ? 'Shift Report' : 'Export Dossier'}</span>
        </button>
      </div>
    </header>
  );
};
