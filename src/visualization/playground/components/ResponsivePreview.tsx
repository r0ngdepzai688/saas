import React, { useState } from 'react';
import { EChartsWrapper } from '../../core/EChartsWrapper';
import { buildPlaygroundOption } from '../adapters/playgroundOptionBuilder';
import { PLAYGROUND_CHART_REGISTRY } from '../registry/playgroundRegistry';
import type { ViewportPreset, ViewportConfig, ThemeId, ConfigOverrides } from '../types';
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface ResponsivePreviewProps {
  chartId: string;
  datasetId: string;
  themeId: ThemeId;
  overrides: ConfigOverrides;
}

const VIEWPORT_PRESETS: ViewportConfig[] = [
  {
    id: 'desktop',
    label: 'Desktop (1440px)',
    width: 1440,
    height: 400,
    description: 'High-density multi-column plant dashboard on 27" monitors.',
  },
  {
    id: 'laptop',
    label: 'Laptop (1280px)',
    width: 1280,
    height: 380,
    description: 'Standard 14"–16" engineering workstation display.',
  },
  {
    id: 'tablet',
    label: 'Tablet (768px)',
    width: 768,
    height: 350,
    description: 'Supervisor iPad / Android shop-floor roving tablet.',
  },
  {
    id: 'mobile',
    label: 'Mobile (390px)',
    width: 390,
    height: 320,
    description: 'On-call emergency maintenance smartphone viewport.',
  },
];

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  chartId,
  datasetId,
  themeId,
  overrides,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ViewportPreset>('desktop');
  const [isFullWidth, setIsFullWidth] = useState(true);

  const activeConfig = VIEWPORT_PRESETS.find((v) => v.id === selectedPreset) || VIEWPORT_PRESETS[0];
  const chart = PLAYGROUND_CHART_REGISTRY[chartId] || PLAYGROUND_CHART_REGISTRY['pareto'];
  const option = buildPlaygroundOption(chartId, datasetId, themeId, overrides);

  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header & Preset Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200/60 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Responsive Ergonomics & Viewport Simulator
          </h3>
          <p className="text-[11px] text-warm-500 dark:text-slate-400">
            Verify canvas scaling, axis label rotation, and legend reflow across industrial hardware form factors.
          </p>
        </div>

        {/* Viewport Presets Buttons */}
        <div className="flex items-center gap-1.5 bg-warm-100 dark:bg-slate-800 p-1 rounded-xl">
          {VIEWPORT_PRESETS.map((vp) => {
            const isSelected = selectedPreset === vp.id && !isFullWidth;
            const Icon =
              vp.id === 'desktop'
                ? Monitor
                : vp.id === 'laptop'
                ? Laptop
                : vp.id === 'tablet'
                ? Tablet
                : Smartphone;

            return (
              <button
                key={vp.id}
                onClick={() => {
                  setSelectedPreset(vp.id);
                  setIsFullWidth(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
                }`}
                title={vp.description}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{vp.label.split(' ')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsFullWidth(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isFullWidth
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
            }`}
            title="Fit to Container Full Width"
          >
            100% Fit
          </button>
        </div>
      </div>

      {/* Viewport Device Frame Simulator */}
      <div className="p-4 rounded-xl bg-warm-100/60 dark:bg-slate-950/60 border border-warm-200/70 dark:border-slate-800 flex flex-col items-center overflow-x-auto">
        <div className="text-xs text-warm-500 dark:text-slate-400 mb-2 font-mono flex items-center gap-2">
          <span>Active Dimension: {isFullWidth ? 'Container 100%' : `${activeConfig.width}px × ${activeConfig.height}px`}</span>
          <span>•</span>
          <span>Target Device: {activeConfig.description}</span>
        </div>

        {/* Scaled Device Shell */}
        <div
          style={{
            width: isFullWidth ? '100%' : `${activeConfig.width}px`,
            maxWidth: '100%',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="rounded-2xl border-4 border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-3 overflow-hidden"
        >
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-warm-100 dark:border-slate-800 text-[10px] text-warm-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono ml-2 font-bold text-warm-700 dark:text-slate-300">
                {chart.name}
              </span>
            </div>
            <span className="font-mono">{isFullWidth ? 'Full Container' : `${activeConfig.width}px`}</span>
          </div>

          <EChartsWrapper
            option={option}
            height={activeConfig.height}
            theme={themeId}
          />
        </div>
      </div>

      {/* Ergonomic Inspection Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-warm-900 dark:text-slate-100">Axis Label Wrapping: </span>
            <span className="text-warm-600 dark:text-slate-400">Automatically rotates ticks at 25° when width drops below 768px.</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-warm-900 dark:text-slate-100">Zero Obscuration: </span>
            <span className="text-warm-600 dark:text-slate-400">Crosshair guidelines snap to coordinates without masking target glyphs.</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-warm-900 dark:text-slate-100">Dynamic ResizeObserver: </span>
            <span className="text-warm-600 dark:text-slate-400">Debounced 150ms canvas redrawing with zero horizontal scroll clipping.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
