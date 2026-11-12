import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartGallery } from './components/ChartGallery';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { ChartComparison } from './components/ChartComparison';
import { InteractivePreview } from './components/InteractivePreview';
import { ConfigInspector } from './components/ConfigInspector';
import { ResponsivePreview } from './components/ResponsivePreview';
import { PLAYGROUND_CHART_REGISTRY } from './registry/playgroundRegistry';
import type { ThemeId, ConfigOverrides } from './types';
import {
  FlaskConical,
  Columns,
  LayoutGrid,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export const VisualAnalyticsPlayground: React.FC = () => {
  // Navigation Modes
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<
    'studio' | 'comparison' | 'gallery'
  >('studio');

  // Shared Playground State
  const [selectedChartId, setSelectedChartId] = useState<string>('pareto');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('qa-defect-pareto');
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>('light-enterprise');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30D');

  // Interactive Overrides
  const [overrides, setOverrides] = useState<ConfigOverrides>({
    smoothCurve: false,
    showArea: false,
    showMarkLine: true,
    showLegend: true,
    showDataZoom: false,
    symbolSize: 6,
  });

  const handleResetPlayground = () => {
    setSelectedChartId('pareto');
    setSelectedDatasetId('qa-defect-pareto');
    setSelectedThemeId('light-enterprise');
    setSelectedTimeframe('30D');
    setOverrides({
      smoothCurve: false,
      showArea: false,
      showMarkLine: true,
      showLegend: true,
      showDataZoom: false,
      symbolSize: 6,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ============================================================ */}
      {/* 1. PLAYGROUND MASTER CONTROL HEADER                           */}
      {/* ============================================================ */}
      <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-warm-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-extrabold text-warm-900 dark:text-slate-100 tracking-tight">
              Visual Analytics Playground
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 2026 Engine Active
            </span>
          </div>
          <p className="text-xs text-warm-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Centralized experimentation laboratory to inspect, test, benchmark, and validate all 
            industrial chart archetypes before deployment to production dashboards.
          </p>
        </div>

        {/* View Mode Switcher & Reset */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-warm-100 dark:bg-slate-800 p-1 rounded-2xl border border-warm-200/80 dark:border-slate-700">
            <button
              onClick={() => setActiveWorkspaceMode('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWorkspaceMode === 'studio'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Experiment Studio</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceMode('comparison')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWorkspaceMode === 'comparison'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Chart Comparison</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceMode('gallery')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWorkspaceMode === 'gallery'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Archetypes ({Object.keys(PLAYGROUND_CHART_REGISTRY).length})</span>
            </button>
          </div>

          <button
            onClick={handleResetPlayground}
            className="p-2 rounded-xl text-xs font-bold bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1 shadow-xs"
            title="Reset All Parameters to Default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MODE 1: EXPERIMENT STUDIO                                 */}
      {/* ============================================================ */}
      {activeWorkspaceMode === 'studio' && (
        <div className="space-y-6">
          {/* Quick Chart Switcher Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.values(PLAYGROUND_CHART_REGISTRY).map((chart) => {
              const isSelected = selectedChartId === chart.id;
              return (
                <button
                  key={chart.id}
                  onClick={() => {
                    setSelectedChartId(chart.id);
                    if (chart.defaultDatasetId) {
                      setSelectedDatasetId(chart.defaultDatasetId);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                      : 'bg-white/85 dark:bg-slate-850 text-warm-700 dark:text-slate-300 border border-warm-200/70 dark:border-slate-800 hover:bg-warm-100'
                  }`}
                >
                  {chart.name}
                </button>
              );
            })}
          </div>

          {/* Module B: Data Scenario Selector */}
          <ScenarioSelector
            selectedDatasetId={selectedDatasetId}
            onSelectDataset={setSelectedDatasetId}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
          />

          {/* Module C: Theme Switcher */}
          <ThemeSelector
            selectedThemeId={selectedThemeId}
            onSelectTheme={setSelectedThemeId}
          />

          {/* Module E: Interactive Preview */}
          <InteractivePreview
            chartId={selectedChartId}
            datasetId={selectedDatasetId}
            themeId={selectedThemeId}
            overrides={overrides}
            onUpdateOverrides={setOverrides}
            onResetOverrides={() =>
              setOverrides({
                smoothCurve: false,
                showArea: false,
                showMarkLine: true,
                showLegend: true,
                showDataZoom: false,
                symbolSize: 6,
              })
            }
          />

          {/* Two-Column Bottom Strip: Module F (Inspector) & Module G (Responsive Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module F: Configuration Inspector */}
            <ConfigInspector
              chartId={selectedChartId}
              datasetId={selectedDatasetId}
              themeId={selectedThemeId}
              timeframe={selectedTimeframe}
              overrides={overrides}
              onUpdateOverrides={setOverrides}
              onResetOverrides={() =>
                setOverrides({
                  smoothCurve: false,
                  showArea: false,
                  showMarkLine: true,
                  showLegend: true,
                  showDataZoom: false,
                  symbolSize: 6,
                })
              }
            />

            {/* Module G: Responsive Preview */}
            <ResponsivePreview
              chartId={selectedChartId}
              datasetId={selectedDatasetId}
              themeId={selectedThemeId}
              overrides={overrides}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MODE 2: MULTI-CHART COMPARISON                            */}
      {/* ============================================================ */}
      {activeWorkspaceMode === 'comparison' && (
        <div className="space-y-6">
          {/* Scenario Selector for Comparison */}
          <ScenarioSelector
            selectedDatasetId={selectedDatasetId}
            onSelectDataset={setSelectedDatasetId}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
          />

          {/* Theme Selector for Comparison */}
          <ThemeSelector
            selectedThemeId={selectedThemeId}
            onSelectTheme={setSelectedThemeId}
          />

          {/* Module D: Chart Comparison Component */}
          <ChartComparison
            datasetId={selectedDatasetId}
            themeId={selectedThemeId}
            timeframe={selectedTimeframe}
            overrides={overrides}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODE 3: FULL ARCHETYPE GALLERY                            */}
      {/* ============================================================ */}
      {activeWorkspaceMode === 'gallery' && (
        <div className="space-y-6">
          <ChartGallery
            selectedChartId={selectedChartId}
            onSelectChart={(id) => {
              setSelectedChartId(id);
              const c = PLAYGROUND_CHART_REGISTRY[id];
              if (c && c.defaultDatasetId) {
                setSelectedDatasetId(c.defaultDatasetId);
              }
              setActiveWorkspaceMode('studio');
            }}
          />
        </div>
      )}
    </motion.div>
  );
};
