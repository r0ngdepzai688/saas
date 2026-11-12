/**
 * Visual Design Intelligence Library - Capability Histogram Family Builder
 * Pure function: constructs process capability histogram + normal distribution curve.
 * Integrates calculateProcessCapability and generateGaussianCurve math modules.
 */

import type { EChartsOption, BarSeriesOption, LineSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { calculateProcessCapability } from '../../math/capability.ts';
import { generateGaussianDistribution } from '../../math/gaussian.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';

/**
 * Validates and extracts explicit specification limits (USL/LSL).
 * Rejects missing, null, undefined, non-finite, identical, or inverted limits.
 */
function extractAndValidateSpecLimits(
  context?: BuilderContext
): { usl: number; lsl: number } {
  const limits = context?.capabilityLimits;

  if (!limits) {
    throw new Error(
      'CapabilityHistogram requires explicit specification limits (capabilityLimits with finite USL and LSL) in BuilderContext.'
    );
  }

  const { usl, lsl } = limits;

  if (usl === undefined || usl === null) {
    throw new Error('CapabilityHistogram requires explicit USL (Upper Specification Limit).');
  }

  if (lsl === undefined || lsl === null) {
    throw new Error('CapabilityHistogram requires explicit LSL (Lower Specification Limit).');
  }

  if (typeof usl !== 'number' || !Number.isFinite(usl)) {
    throw new Error(`CapabilityHistogram requires finite numeric USL, received: ${usl}`);
  }

  if (typeof lsl !== 'number' || !Number.isFinite(lsl)) {
    throw new Error(`CapabilityHistogram requires finite numeric LSL, received: ${lsl}`);
  }

  if (usl <= lsl) {
    throw new Error(
      `CapabilityHistogram requires USL > LSL. Received USL=${usl}, LSL=${lsl}.`
    );
  }

  return { usl, lsl };
}

export function buildCapabilityOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, unit } = spec;
  const records = data.records ?? [];
  const theme = context?.theme;

  const rawValues = records.map((r) => Number(r.value) || 0);

  // Strictly validated explicit limits. Zero silent fallback.
  const { usl, lsl } = extractAndValidateSpecLimits(context);
  const capability = calculateProcessCapability(rawValues, usl, lsl);

  // Group into 12 histogram bins
  const binCount = 12;
  const minVal = Math.min(...rawValues, lsl);
  const maxVal = Math.max(...rawValues, usl);
  const binWidth = (maxVal - minVal) / binCount || 1;

  const bins: number[] = new Array(binCount).fill(0);
  const binLabels: string[] = [];

  for (let i = 0; i < binCount; i++) {
    const start = minVal + i * binWidth;
    const end = start + binWidth;
    binLabels.push(`${start.toFixed(2)} - ${end.toFixed(2)}`);
  }

  rawValues.forEach((val) => {
    let index = Math.floor((val - minVal) / binWidth);
    if (index >= binCount) index = binCount - 1;
    if (index < 0) index = 0;
    bins[index]++;
  });

  // Generate Gaussian theoretical curve scaled to max bin count
  const maxBinHeight = Math.max(...bins, 1);
  const gaussianPoints = generateGaussianDistribution(
    capability.mean,
    capability.stdDev || 0.1,
    minVal,
    maxVal,
    binCount
  );
  const scaledCurve = gaussianPoints.map((p) => Number((p[1] * maxBinHeight * 2).toFixed(1)));

  // Calculate dynamic bin indices for USL and LSL based on exact specification values
  const lslBinIndex = Math.max(0, Math.min(binCount - 1, Math.floor((lsl - minVal) / binWidth)));
  const uslBinIndex = Math.max(0, Math.min(binCount - 1, Math.floor((usl - minVal) / binWidth)));

  const barSeries: BarSeriesOption = {
    name: 'Sample Frequency',
    type: 'bar',
    data: bins,
    itemStyle: {
      color: '#3B82F6',
      borderRadius: [4, 4, 0, 0],
    },
    barMaxWidth: 32,
    markLine: {
      symbol: ['none', 'none'],
      data: [
        {
          name: 'USL',
          xAxis: uslBinIndex,
          lineStyle: { color: '#DC2626', type: 'dashed', width: 2 },
          label: { formatter: `USL: ${usl}`, color: '#DC2626', position: 'end' },
        },
        {
          name: 'LSL',
          xAxis: lslBinIndex,
          lineStyle: { color: '#DC2626', type: 'dashed', width: 2 },
          label: { formatter: `LSL: ${lsl}`, color: '#DC2626', position: 'end' },
        },
      ],
    },
  };

  const lineSeries: LineSeriesOption = {
    name: 'Normal Distribution',
    type: 'line',
    data: scaledCurve,
    smooth: true,
    showSymbol: false,
    lineStyle: {
      color: '#10B981',
      width: 2.5,
    },
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'axis',
      axisPointerType: 'shadow',
      theme,
    }),
    grid: buildBaseGrid({
      hasLegend: true,
    }),
    legend: buildBaseLegend({
      data: ['Sample Frequency', 'Normal Distribution'],
      theme,
    }),
    xAxis: buildCategoryAxis({
      categories: binLabels,
      theme,
    }),
    yAxis: buildValueAxis({
      name: 'Parts Count',
      unit,
      theme,
    }),
    series: [barSeries, lineSeries],
  };
}
