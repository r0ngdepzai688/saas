/**
 * Visual Design Intelligence Library - Quality Radar Family Builder
 * Pure function: converts multi-dimensional indicators into an ECharts Radar chart.
 */

import type { EChartsOption, RadarSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';

export function buildRadarOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data } = spec;
  const categories = data.categories ?? ['Defect Rate', 'CPK Compliance', 'OEE', 'Yield', 'Scrap'];
  const records = data.records ?? [];
  const theme = context?.theme;

  const isDark = theme?.isDark ?? false;

  const indicators = categories.map((cat) => ({
    name: cat,
    max: 100,
  }));

  const seriesData = records.map((r, idx) => ({
    name: String(r.name ?? `Series ${idx + 1}`),
    value: Array.isArray(r.values) ? (r.values as number[]) : [80, 85, 90, 75, 88],
  }));

  const radarSeries: RadarSeriesOption = {
    name: spec.title,
    type: 'radar',
    data: seriesData,
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'item',
      theme,
    }),
    legend: buildBaseLegend({
      data: seriesData.map((s) => s.name),
      theme,
    }),
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitArea: {
        areaStyle: {
          color: isDark
            ? ['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.8)']
            : ['rgba(241, 245, 249, 0.4)', 'rgba(255, 255, 255, 0.8)'],
        },
      },
      axisLine: { lineStyle: { color: isDark ? '#475569' : '#CBD5E1' } },
      splitLine: { lineStyle: { color: isDark ? '#334155' : '#E2E8F0' } },
      axisName: {
        color: isDark ? '#94A3B8' : '#475569',
        fontSize: 10,
        fontWeight: 600,
      },
    },
    series: [radarSeries],
  };
}
