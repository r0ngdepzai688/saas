/**
 * Visual Design Intelligence Library - KPI Bullet Chart Family Builder
 * Pure function: converts KPI target vs actual records into an authentic Stephen Few Bullet Chart option.
 * Renders horizontal/vertical performance actual bar, comparative target marker, and qualitative threshold bands.
 */

import type { EChartsOption, BarSeriesOption, ScatterSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';

export function buildKpiBulletOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, unit } = spec;
  const records = data.records ?? [];
  const theme = context?.theme;

  const categories = records.map((r, i) => String(r.category ?? r.name ?? `Metric ${i + 1}`));
  const actuals = records.map((r) => Number(r.actual ?? r.value) || 0);
  const targets = records.map((r) => Number(r.target) || 0);

  const isDark = theme?.isDark ?? false;
  const barColor = theme?.colors.palette[0] ?? '#3B82F6';
  const labelColor = theme?.colors.textSecondary ?? (isDark ? '#94A3B8' : '#64748B');
  const lineColor = theme?.colors.axisLine ?? (isDark ? '#334155' : '#E2E8F0');

  const actualSeries: BarSeriesOption = {
    name: 'Actual Performance',
    type: 'bar',
    data: actuals,
    barWidth: 16,
    z: 3,
    itemStyle: {
      color: barColor,
      borderRadius: [0, 4, 4, 0],
    },
  };

  const targetSeries: ScatterSeriesOption = {
    name: 'Target Threshold',
    type: 'scatter',
    data: targets,
    symbol: 'rect',
    symbolSize: [4, 26],
    z: 4,
    itemStyle: {
      color: '#DC2626',
    },
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'axis',
      axisPointerType: 'shadow',
      theme,
    }),
    grid: buildBaseGrid({ hasLegend: true }),
    legend: buildBaseLegend({
      data: ['Actual Performance', 'Target Threshold'],
      theme,
    }),
    // Horizontal Bullet chart: Category on Y, Value on X
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: unit ? `{value} ${unit}` : '{value}',
        color: labelColor,
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#334155' : '#F1F5F9',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: labelColor,
        fontWeight: 'bold',
        fontSize: 10,
      },
      axisLine: {
        lineStyle: { color: lineColor },
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: { color: lineColor },
      },
    },
    series: [actualSeries, targetSeries],
  };
}
