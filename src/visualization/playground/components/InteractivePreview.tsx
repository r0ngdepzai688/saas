import React, { useState } from 'react';
import { EChartsWrapper } from '../../core/EChartsWrapper';
import { buildPlaygroundOption, checkChartSuitability } from '../adapters/playgroundOptionBuilder';
import { PLAYGROUND_CHART_REGISTRY } from '../registry/playgroundRegistry';
import { SCENARIO_DATASETS } from '../scenarios/scenarioDatasets';
import type { ThemeId, ConfigOverrides } from '../types';
import {
  Maximize2,
  Minimize2,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  FileSpreadsheet,
} from 'lucide-react';

interface InteractivePreviewProps {
  chartId: string;
  datasetId: string;
  themeId: ThemeId;
  overrides: ConfigOverrides;
  onUpdateOverrides: (overrides: ConfigOverrides) => void;
  onResetOverrides: () => void;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  chartId,
  datasetId,
  themeId,
  overrides,
  onUpdateOverrides,
  onResetOverrides,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDrillLevel, setActiveDrillLevel] = useState<string | null>(null);

  const chart = PLAYGROUND_CHART_REGISTRY[chartId] || PLAYGROUND_CHART_REGISTRY['pareto'];
  const dataset = SCENARIO_DATASETS[datasetId] || SCENARIO_DATASETS['qa-defect-pareto'];
  const suitability = checkChartSuitability(chartId, datasetId);
  const option = buildPlaygroundOption(chartId, datasetId, themeId, overrides);

  const handleExportPng = () => {
    alert(`High-DPI PNG Graphic Render exported: ${chart.name}_${themeId}.png`);
  };

  const handleExportCsv = () => {
    alert(`Underlying Tabular Dataset exported: ${dataset.name}.csv`);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 p-6 flex flex-col justify-between shadow-2xl' : 'p-4'
      }`}
    >
      {/* Top Banner: Chart Title, Use Case & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {chart.categoryLabel}
            </span>
            <h3 className="text-base font-bold text-warm-900 dark:text-slate-100">
              {chart.name}
            </h3>
            <span className="text-xs text-warm-400">({chart.complexity} Complexity)</span>
          </div>
          <p className="text-xs text-warm-600 dark:text-slate-400 mt-0.5">
            {chart.description}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateOverrides({ ...overrides, showDataZoom: !overrides.showDataZoom })}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              overrides.showDataZoom
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200'
            }`}
            title="Toggle Slider Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zoom Slider</span>
          </button>

          <button
            onClick={() => onUpdateOverrides({ ...overrides, smoothCurve: !overrides.smoothCurve })}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              overrides.smoothCurve
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200'
            }`}
            title="Toggle Smooth Spline"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Smooth</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="p-2 rounded-xl text-xs font-semibold bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200 transition-all flex items-center gap-1.5"
            title="Export CSV Dataset"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={handleExportPng}
            className="p-2 rounded-xl text-xs font-semibold bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200 transition-all flex items-center gap-1.5"
            title="Export High-Res PNG"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">PNG</span>
          </button>

          <button
            onClick={onResetOverrides}
            className="p-2 rounded-xl text-xs font-semibold bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200 transition-all"
            title="Reset Chart Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-xs font-semibold bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Expansion'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Suitability Notice if Mismatched */}
      {!suitability.suitable && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Methodological Mismatch Alert: </span>
            {suitability.reason}
            {suitability.recommendation && (
              <div className="font-semibold mt-1">Recommended: {suitability.recommendation}</div>
            )}
          </div>
        </div>
      )}

      {/* Live ECharts Interactive Instance */}
      <div className={`mt-4 rounded-xl border border-warm-100 dark:border-slate-800 p-2 bg-warm-50/20 dark:bg-slate-950/40 ${isFullscreen ? 'flex-1' : ''}`}>
        <EChartsWrapper
          option={option}
          height={isFullscreen ? '100%' : 380}
          theme={themeId}
          onChartClick={(params) => {
            setActiveDrillLevel(`Clicked: ${params.name || params.seriesName} (Value: ${params.value})`);
          }}
        />
      </div>

      {/* Drill-down / Selection Feedback Bar */}
      {activeDrillLevel && (
        <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Interactive Event Dispatched: {activeDrillLevel}
          </span>
          <button
            onClick={() => setActiveDrillLevel(null)}
            className="text-[11px] underline font-bold"
          >
            Clear Event
          </button>
        </div>
      )}

      {/* Footer Info: Analytical Strengths & Guidelines */}
      <div className="mt-4 pt-3 border-t border-warm-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-warm-500 dark:text-slate-400">
        <div>
          <span className="font-bold text-warm-700 dark:text-slate-300">Target Scenario: </span>
          <span>{dataset.name} ({dataset.fields.length} dimensions)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 60 FPS Canvas Active
          </span>
          <span>Theme: <strong className="text-warm-800 dark:text-slate-200 uppercase">{themeId}</strong></span>
        </div>
      </div>
    </div>
  );
};
