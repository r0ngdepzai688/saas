/**
 * Visual Design Intelligence Library - Defect Heatmap Family Builder
 * Pure function: converts 2D matrix defect counts into an ECharts Heatmap with visualMap gradient.
 */

import type { EChartsOption, HeatmapSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';

export function buildHeatmapOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data } = spec;
  const categories = data.categories ?? [];
  const matrix = data.matrix ?? [];
  const theme = context?.theme;

  const maxVal = matrix.length > 0 ? Math.max(...matrix.map((d) => d[2]), 10) : 10;

  const isDark = theme?.isDark ?? false;
  const labelColor = isDark ? '#94A3B8' : '#64748B';

  const heatmapSeries: HeatmapSeriesOption = {
    name: 'Defect Density',
    type: 'heatmap',
    data: matrix.map((d) => [d[0], d[1], d[2]]),
    label: {
      show: true,
      fontSize: 10,
      color: isDark ? '#F8FAFC' : '#0F172A',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'item',
      theme,
      formatter: (params: unknown) => {
        const p = params as { value: [number, number, number] };
        if (!p || !p.value) return '';
        const [x, y, val] = p.value;
        return `
          <div style="font-family: inherit;">
            <div style="font-size: 11px; opacity: 0.7;">Coord: [${x}, ${y}]</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">
              Incident Count: ${val}
            </div>
          </div>
        `;
      },
    }),
    grid: buildBaseGrid({
      top: 24,
      bottom: 48,
      left: 32,
      right: 48,
    }),
    xAxis: {
      type: 'category',
      data: categories.length > 0 ? [...categories] : ['0', '1', '2', '3', '4'],
      splitArea: { show: true },
      axisLabel: { color: labelColor, fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: ['Line A', 'Line B', 'Line C', 'Line D', 'Line E'],
      splitArea: { show: true },
      axisLabel: { color: labelColor, fontSize: 10 },
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: isDark
          ? ['#0F172A', '#1E3A8A', '#2563EB', '#F59E0B', '#EF4444']
          : ['#F8FAFC', '#DBEAFE', '#60A5FA', '#F59E0B', '#EF4444'],
      },
      textStyle: {
        color: labelColor,
        fontSize: 10,
      },
    },
    series: [heatmapSeries],
  };
}
