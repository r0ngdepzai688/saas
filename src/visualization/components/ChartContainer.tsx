import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Download,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  chartTypeBadge?: string;
  freshnessText?: string;
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  timeframeOptions?: string[];
  onExportCsv?: () => void;
  onExportImage?: () => void;
  analyticalSummary?: {
    current: string;
    target?: string;
    variance?: string;
    trendPositive?: boolean;
    anomalyNote?: string;
  };
  isEmpty?: boolean;
  emptyText?: string;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  height?: number | string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  chartTypeBadge,
  freshnessText = 'Live Stream',
  timeframe,
  onTimeframeChange,
  timeframeOptions = ['7D', '30D', '90D', 'YTD'],
  onExportCsv,
  analyticalSummary,
  isEmpty = false,
  emptyText = 'No telemetry data matches your query filters.',
  isLoading = false,
  error = null,
  children,
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between ${
        isFullscreen ? 'fixed inset-6 z-50 overflow-y-auto p-8 bg-white/98 backdrop-blur-2xl' : 'p-5'
      } ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            {chartTypeBadge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {chartTypeBadge}
              </span>
            )}
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              {freshnessText}
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Timeframe Filter */}
          {timeframe && onTimeframeChange && (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              {timeframeOptions.map((tf) => (
                <button
                  key={tf}
                  onClick={() => onTimeframeChange(tf)}
                  className={`px-2 py-0.5 rounded font-semibold transition-all ${
                    timeframe === tf
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}

          {/* Export Action */}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
              title="Export Dataset CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen Expand Action */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Analytical Callout Bar (Data Storytelling Layer) */}
      {analyticalSummary && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 my-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Current Value</span>
              <p className="font-extrabold text-slate-900 text-sm font-sans tabular-nums">
                {analyticalSummary.current}
              </p>
            </div>

            {analyticalSummary.target && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Engineering Target</span>
                <p className="font-bold text-slate-700 text-sm font-sans tabular-nums">
                  {analyticalSummary.target}
                </p>
              </div>
            )}

            {analyticalSummary.variance && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Variance / Delta</span>
                <p
                  className={`font-bold text-sm font-sans tabular-nums ${
                    analyticalSummary.trendPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {analyticalSummary.variance}
                </p>
              </div>
            )}
          </div>

          {analyticalSummary.anomalyNote && (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{analyticalSummary.anomalyNote}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Visual Presentation Body */}
      <div className="relative w-full my-1 flex-1 min-h-[260px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-10 text-slate-400 text-xs">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
            <span>Computing statistical matrices...</span>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-rose-600">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="font-bold text-xs">{error}</p>
          </div>
        ) : isEmpty ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
            <Clock className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
            <p className="font-medium">{emptyText}</p>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Fullscreen Backdrop Close Handle */}
      {isFullscreen && (
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsFullscreen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Fullscreen View
          </button>
        </div>
      )}
    </div>
  );
};
