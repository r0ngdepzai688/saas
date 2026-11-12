import React, { useState } from 'react';
import { PLAYGROUND_CHART_REGISTRY } from '../registry/playgroundRegistry';
import {
  checkChartSuitability,
  buildPlaygroundOption,
} from '../adapters/playgroundOptionBuilder';
import { EChartsWrapper } from '../../core/EChartsWrapper';
import type { ThemeId, ConfigOverrides } from '../types';
import {
  Columns,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

interface ChartComparisonProps {
  datasetId: string;
  themeId: ThemeId;
  timeframe: string;
  overrides: ConfigOverrides;
}

export const ChartComparison: React.FC<ChartComparisonProps> = ({
  datasetId,
  themeId,
  timeframe: _timeframe,
  overrides,
}) => {
  // Allow user to select 2 to 4 chart types to compare
  const [comparedChartIds, setComparedChartIds] = useState<string[]>([
    'pareto',
    'bar',
    'treemap',
  ]);

  const allCharts = Object.values(PLAYGROUND_CHART_REGISTRY);

  const toggleChart = (chartId: string) => {
    if (comparedChartIds.includes(chartId)) {
      if (comparedChartIds.length <= 2) {
        alert('Comparison mode requires at least 2 active charts.');
        return;
      }
      setComparedChartIds(comparedChartIds.filter((id) => id !== chartId));
    } else {
      if (comparedChartIds.length >= 4) {
        alert('Maximum 4 charts can be compared simultaneously for visual ergonomics.');
        return;
      }
      setComparedChartIds([...comparedChartIds, chartId]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Selector Bar */}
      <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-2">
              <Columns className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Side-by-Side Multi-Archetype Comparison Laboratory
            </h3>
            <p className="text-[11px] text-warm-500 dark:text-slate-400">
              Evaluating {comparedChartIds.length} visual encodings against the exact same scenario dataset.
            </p>
          </div>

          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
            {comparedChartIds.length} of 4 Slots Active
          </span>
        </div>

        {/* Quick Toggle Chips for All Registered Charts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {allCharts.map((chart) => {
            const isCompared = comparedChartIds.includes(chart.id);
            const suitability = checkChartSuitability(chart.id, datasetId);

            return (
              <button
                key={chart.id}
                onClick={() => toggleChart(chart.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCompared
                    ? 'bg-blue-600 text-white shadow-xs'
                    : suitability.suitable
                    ? 'bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                }`}
              >
                {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{chart.name}</span>
                {!suitability.suitable && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-rose-200 text-rose-900 font-bold">
                    Mismatch
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div
        className={`grid gap-5 ${
          comparedChartIds.length === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : comparedChartIds.length === 3
            ? 'grid-cols-1 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {comparedChartIds.map((chartId) => {
          const chart = PLAYGROUND_CHART_REGISTRY[chartId];
          const suitability = checkChartSuitability(chartId, datasetId);
          const option = buildPlaygroundOption(chartId, datasetId, themeId, overrides);

          return (
            <div
              key={chartId}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-sm flex flex-col justify-between ${
                suitability.score === 'optimal'
                  ? 'border-blue-300 dark:border-blue-800'
                  : suitability.score === 'compatible'
                  ? 'border-warm-200/90 dark:border-slate-800'
                  : 'border-rose-300 dark:border-rose-800 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 dark:text-slate-400">
                      {chart.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                      {chart.name}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleChart(chartId)}
                    className="p-1 rounded-lg text-warm-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Analytical Suitability Badge */}
                <div
                  className={`p-2 rounded-xl text-xs flex items-start gap-2 mb-3 ${
                    suitability.score === 'optimal'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : suitability.score === 'compatible'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  {suitability.score === 'optimal' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : suitability.score === 'compatible' ? (
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {suitability.score === 'optimal'
                        ? 'Mathematically Optimal Fit'
                        : suitability.score === 'compatible'
                        ? 'Compatible Representation'
                        : 'Methodological Anti-Pattern'}
                    </div>
                    <div className="text-[11px] leading-tight mt-0.5">{suitability.reason}</div>
                    {suitability.recommendation && (
                      <div className="text-[10px] font-semibold mt-1 underline">
                        Fix: {suitability.recommendation}
                      </div>
                    )}
                  </div>
                </div>

                {/* ECharts Live Instance */}
                <div className="rounded-xl border border-warm-100 dark:border-slate-800/80 p-2 bg-warm-50/30 dark:bg-slate-950/40">
                  <EChartsWrapper
                    option={option}
                    height={260}
                    theme={themeId}
                  />
                </div>
              </div>

              {/* Analytical Trade-offs: Pros & Cons */}
              <div className="mt-4 pt-3 border-t border-warm-100 dark:border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Analytical Strength:
                  </span>
                  <p className="text-[11px] text-warm-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {chart.strengths[0]}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Known Limitation:
                  </span>
                  <p className="text-[11px] text-warm-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {chart.limitations[0]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
