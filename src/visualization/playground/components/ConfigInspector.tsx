import React, { useState } from 'react';
import { buildPlaygroundOption } from '../adapters/playgroundOptionBuilder';
import { PLAYGROUND_CHART_REGISTRY } from '../registry/playgroundRegistry';
import { SCENARIO_DATASETS } from '../scenarios/scenarioDatasets';
import type { ThemeId, ConfigOverrides } from '../types';
import {
  Code2,
  Copy,
  Check,
  Sliders,
  RotateCcw,
} from 'lucide-react';

interface ConfigInspectorProps {
  chartId: string;
  datasetId: string;
  themeId: ThemeId;
  timeframe: string;
  overrides: ConfigOverrides;
  onUpdateOverrides: (overrides: ConfigOverrides) => void;
  onResetOverrides: () => void;
}

export const ConfigInspector: React.FC<ConfigInspectorProps> = ({
  chartId,
  datasetId,
  themeId,
  timeframe,
  overrides,
  onUpdateOverrides,
  onResetOverrides,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'editor'>('json');

  const chart = PLAYGROUND_CHART_REGISTRY[chartId] || PLAYGROUND_CHART_REGISTRY['pareto'];
  const dataset = SCENARIO_DATASETS[datasetId] || SCENARIO_DATASETS['qa-defect-pareto'];
  const option = buildPlaygroundOption(chartId, datasetId, themeId, overrides);

  const jsonString = JSON.stringify(option, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200/60 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Configuration & ECharts Option Inspector
          </h3>
          <p className="text-[11px] text-warm-500 dark:text-slate-400">
            Inspect real-time compiled EChartsOption schema and adjust visual rendering properties safely.
          </p>
        </div>

        {/* Tab Switcher & Copy */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-warm-100 dark:bg-slate-800 p-0.5 rounded-xl border border-warm-200/60 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
              }`}
            >
              JSON Spec
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
              }`}
            >
              Live Editor
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* Metadata Pill Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700">
          <span className="text-[10px] text-warm-400 uppercase font-bold block">Archetype ID</span>
          <span className="font-bold text-warm-900 dark:text-slate-100 font-mono">{chart.id}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700">
          <span className="text-[10px] text-warm-400 uppercase font-bold block">Active Dataset</span>
          <span className="font-bold text-warm-900 dark:text-slate-100 font-mono truncate block">
            {dataset.id}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700">
          <span className="text-[10px] text-warm-400 uppercase font-bold block">Active Theme</span>
          <span className="font-bold text-warm-900 dark:text-slate-100 font-mono">{themeId}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700">
          <span className="text-[10px] text-warm-400 uppercase font-bold block">Timeframe Filter</span>
          <span className="font-bold text-warm-900 dark:text-slate-100 font-mono">{timeframe}</span>
        </div>
      </div>

      {/* Content: JSON Inspector vs Safe Live Editor */}
      {activeTab === 'json' ? (
        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono max-h-96 overflow-y-auto leading-relaxed border border-slate-800 scrollbar-thin">
            {jsonString}
          </pre>
        </div>
      ) : (
        /* Controlled Safe Configuration Adjuster */
        <div className="p-4 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/70 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-warm-200/60 dark:border-slate-700">
            <span className="text-xs font-bold text-warm-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Adjustable Visual Properties (Real-time Canvas Feedback)
            </span>
            <button
              onClick={onResetOverrides}
              className="text-[11px] font-bold text-warm-500 hover:text-warm-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Smooth Spline Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-warm-900 dark:text-slate-100 block">Smooth Curve</span>
                <span className="text-[10px] text-warm-400">Cubic spline smoothing</span>
              </div>
              <input
                type="checkbox"
                checked={overrides.smoothCurve ?? false}
                onChange={(e) => onUpdateOverrides({ ...overrides, smoothCurve: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            {/* Show Area Fill */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-warm-900 dark:text-slate-100 block">Area Fill</span>
                <span className="text-[10px] text-warm-400">Baseline gradient fill</span>
              </div>
              <input
                type="checkbox"
                checked={overrides.showArea ?? false}
                onChange={(e) => onUpdateOverrides({ ...overrides, showArea: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            {/* Show MarkLine */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-warm-900 dark:text-slate-100 block">MarkLines</span>
                <span className="text-[10px] text-warm-400">Reference & limit thresholds</span>
              </div>
              <input
                type="checkbox"
                checked={overrides.showMarkLine !== false}
                onChange={(e) => onUpdateOverrides({ ...overrides, showMarkLine: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            {/* Show Legend */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-warm-900 dark:text-slate-100 block">Legend Bar</span>
                <span className="text-[10px] text-warm-400">Series toggle legend</span>
              </div>
              <input
                type="checkbox"
                checked={overrides.showLegend !== false}
                onChange={(e) => onUpdateOverrides({ ...overrides, showLegend: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            {/* Show DataZoom Slider */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-bold text-warm-900 dark:text-slate-100 block">DataZoom Slider</span>
                <span className="text-[10px] text-warm-400">Interactive timeline slider</span>
              </div>
              <input
                type="checkbox"
                checked={overrides.showDataZoom ?? false}
                onChange={(e) => onUpdateOverrides({ ...overrides, showDataZoom: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            {/* Symbol Marker Size */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-warm-200/60 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-warm-900 dark:text-slate-100">Vertex Marker Size</span>
                <span className="font-mono text-[11px] font-bold text-blue-600">
                  {overrides.symbolSize ?? 6}px
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={overrides.symbolSize ?? 6}
                onChange={(e) => onUpdateOverrides({ ...overrides, symbolSize: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
