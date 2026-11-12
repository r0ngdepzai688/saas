/**
 * Visual Design Intelligence Library - Pareto 80/20 Family Builder
 * Pure function: converts Pareto defect data into dual-axis Bar + Cumulative % curve.
 * Relies on calculateParetoDistribution pure math module.
 */

import type { EChartsOption, BarSeriesOption, LineSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { calculateParetoDistribution } from '../../math/pareto.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';

export function buildParetoOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, encoding, unit } = spec;
  const records = data.records ?? [];
  const theme = context?.theme;

  const nameKey = encoding?.xField ?? 'name';
  const countKey = encoding?.yField ?? 'count';

  const rawItems = records.map((r) => ({
    category: String(r[nameKey] ?? ''),
    value: Number(r[countKey]) || 0,
  }));

  const paretoResult = calculateParetoDistribution(rawItems, {
    thresholdPercent: 80,
    thresholdMode: 'inclusive',
  });

  const categories = paretoResult.map((i) => i.category);
  const counts = paretoResult.map((i) => i.value);
  const cumulativePercents = paretoResult.map((i) => i.cumulativePercentage);

  const barSeries: BarSeriesOption = {
    name: 'Defect Incidents',
    type: 'bar',
    data: counts,
    itemStyle: {
      color: '#2563EB',
      borderRadius: [4, 4, 0, 0],
    },
    barMaxWidth: 38,
  };

  const lineSeries: LineSeriesOption = {
    name: 'Cumulative %',
    type: 'line',
    yAxisIndex: 1,
    data: cumulativePercents,
    lineStyle: {
      color: '#D97706',
      width: 2.5,
    },
    itemStyle: {
      color: '#D97706',
    },
    symbol: 'circle',
    symbolSize: 6,
    markLine: {
      symbol: ['none', 'none'],
      data: [
        {
          yAxis: 80,
          lineStyle: {
            color: '#DC2626',
            type: 'dashed',
            width: 1.5,
          },
          label: {
            formatter: '80% Cutoff',
            position: 'insideEndTop',
            color: '#DC2626',
            fontSize: 10,
          },
        },
      ],
    },
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'axis',
      axisPointerType: 'cross',
      theme,
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const p0 = params[0] as { name: string; value: number };
        const p1 = params[1] as { value: number } | undefined;
        const cum = p1 ? p1.value.toFixed(1) : '0';
        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700; margin-bottom: 2px;">${p0.name}</div>
            <div>Defect Count: <strong>${p0.value}</strong> ${unit ?? 'incidents'}</div>
            <div style="color: #D97706; margin-top: 2px;">Cumulative: <strong>${cum}%</strong></div>
          </div>
        `;
      },
    }),
    grid: buildBaseGrid({
      hasLegend: true,
      hasSecondYAxis: true,
    }),
    legend: buildBaseLegend({
      data: ['Defect Incidents', 'Cumulative %'],
      theme,
    }),
    xAxis: buildCategoryAxis({
      categories,
      theme,
    }),
    yAxis: [
      buildValueAxis({
        name: 'Incidents',
        unit,
        theme,
      }),
      {
        type: 'value',
        name: 'Cumulative',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: theme?.isDark ? '#94A3B8' : '#64748B',
          fontSize: 10,
        },
        splitLine: { show: false },
      },
    ],
    series: [barSeries, lineSeries],
  };
}
