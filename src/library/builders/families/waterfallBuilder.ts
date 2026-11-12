/**
 * Visual Design Intelligence Library - Waterfall Chart Family Builder
 * Pure function: converts cumulative variance walk steps into an authentic ECharts Waterfall option.
 * Implements floating delta bars with transparent offset base.
 */

import type { EChartsOption, BarSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';

export function buildWaterfallOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, unit } = spec;
  const records = data.records ?? [];
  const theme = context?.theme;

  const categories: string[] = [];
  const baseData: number[] = [];
  const positiveData: number[] = [];
  const negativeData: number[] = [];

  let runningTotal = 0;

  records.forEach((rec) => {
    const name = String(rec.name ?? rec.step ?? 'Step');
    const value = Number(rec.value ?? rec.delta) || 0;
    const isTotal = Boolean(rec.isTotal ?? rec.total);

    categories.push(name);

    if (isTotal) {
      baseData.push(0);
      positiveData.push(runningTotal);
      negativeData.push(0);
    } else if (value >= 0) {
      baseData.push(runningTotal);
      positiveData.push(value);
      negativeData.push(0);
      runningTotal += value;
    } else {
      const absLoss = Math.abs(value);
      runningTotal -= absLoss;
      baseData.push(runningTotal);
      positiveData.push(0);
      negativeData.push(absLoss);
    }
  });

  const series: BarSeriesOption[] = [
    {
      name: 'Base Offset',
      type: 'bar',
      stack: 'waterfall',
      silent: true,
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
      data: baseData,
    },
    {
      name: 'Gain / Positive Delta',
      type: 'bar',
      stack: 'waterfall',
      data: positiveData,
      itemStyle: {
        color: '#10B981',
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: 'Loss / Negative Delta',
      type: 'bar',
      stack: 'waterfall',
      data: negativeData,
      itemStyle: {
        color: '#EF4444',
        borderRadius: [0, 0, 4, 4],
      },
    },
  ];

  return {
    tooltip: buildBaseTooltip({
      trigger: 'axis',
      axisPointerType: 'shadow',
      theme,
      formatter: (params: unknown) => {
        const arr = params as Array<{ name: string; seriesName: string; value: number }>;
        if (!Array.isArray(arr)) return '';
        const active = arr.find((p) => p.seriesName !== 'Base Offset' && p.value > 0);
        if (!active) return '';
        const prefix = active.seriesName.includes('Loss') ? '-' : '+';
        const formattedVal = `${prefix}${active.value.toLocaleString()} ${unit ?? ''}`.trim();
        return `<strong>${active.name}</strong><br/>Delta: ${formattedVal}`;
      },
    }),
    grid: buildBaseGrid({ hasLegend: true }),
    legend: buildBaseLegend({
      data: ['Gain / Positive Delta', 'Loss / Negative Delta'],
      theme,
    }),
    xAxis: buildCategoryAxis({
      categories,
      theme,
    }),
    yAxis: buildValueAxis({
      unit,
      theme,
    }),
    series,
  };
}
