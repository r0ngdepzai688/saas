import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';
import { calculateProcessCapability } from '../../utils/statisticalUtils';

export interface CapabilityHistogramProps {
  data: number[];
  usl: number; // Upper Spec Limit
  lsl: number; // Lower Spec Limit
  binCount?: number;
  unit?: string;
  height?: number | string;
}

export const CapabilityHistogram: React.FC<CapabilityHistogramProps> = ({
  data,
  usl,
  lsl,
  binCount = 12,
  unit = 'mm',
  height = 320,
}) => {
  const capability = calculateProcessCapability(data, usl, lsl);

  // Group data into histogram bins
  const minVal = Math.min(...data, lsl);
  const maxVal = Math.max(...data, usl);
  const binWidth = (maxVal - minVal) / binCount;

  const bins: number[] = new Array(binCount).fill(0);
  const binLabels: string[] = [];

  for (let i = 0; i < binCount; i++) {
    const start = minVal + i * binWidth;
    const end = start + binWidth;
    binLabels.push(`${start.toFixed(2)} - ${end.toFixed(2)}`);
  }

  data.forEach((val) => {
    let index = Math.floor((val - minVal) / binWidth);
    if (index >= binCount) index = binCount - 1;
    if (index < 0) index = 0;
    bins[index]++;
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: 12,
      right: 24,
      top: 36,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: binLabels,
      axisLabel: {
        fontSize: 9,
        interval: 1,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Sample Count',
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
    },
    series: [
      {
        name: 'Frequency',
        type: 'bar',
        data: bins,
        itemStyle: {
          color: '#3B82F6',
          borderRadius: [4, 4, 0, 0],
        },
        markLine: {
          symbol: 'none',
          data: [
            {
              name: 'LSL',
              xAxis: Math.max(0, Math.floor((lsl - minVal) / binWidth)),
              lineStyle: { color: '#DC2626', type: 'dashed' as const, width: 2 },
              label: { formatter: `LSL: ${lsl}`, color: '#DC2626' },
            },
            {
              name: 'USL',
              xAxis: Math.min(binCount - 1, Math.floor((usl - minVal) / binWidth)),
              lineStyle: { color: '#DC2626', type: 'dashed' as const, width: 2 },
              label: { formatter: `USL: ${usl}`, color: '#DC2626' },
            },
            {
              name: 'Mean',
              xAxis: Math.floor((capability.mean - minVal) / binWidth),
              lineStyle: { color: '#16A34A', type: 'solid' as const, width: 2 },
              label: { formatter: `Mean: ${capability.mean}`, color: '#16A34A' },
            },
          ],
        },
      },
    ],
  };

  return (
    <div>
      {/* Capability Scoreboard Banner */}
      <div className="flex items-center justify-between p-2.5 mb-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Cp (Potential)</span>
            <p className="text-sm font-bold text-slate-800 font-mono">{capability.cp}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Cpk (Actual)</span>
            <p
              className={`text-sm font-black font-mono ${
                capability.isCapable ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {capability.cpk}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mean / Std Dev</span>
            <p className="text-xs font-semibold text-slate-700 font-mono">
              {capability.mean} {unit} (±{capability.stdDev})
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            capability.isCapable
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {capability.isCapable ? '✓ Process Capable (Cpk ≥ 1.33)' : '✕ Not Capable (Cpk < 1.33)'}
        </span>
      </div>

      <EChartsWrapper option={option} height={height} />
    </div>
  );
};
