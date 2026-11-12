/**
 * Visual Design Intelligence Library - Cartesian Chart Family Builder
 * Pure function: converts standard Cartesian specifications (Line, Bar, Combo) into EChartsOption.
 */

import type { EChartsOption, SeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';
import { buildContractMarkLines, buildContractMarkAreas } from '../common/markerBuilder.ts';

export function buildCartesianOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, encoding, unit } = spec;
  const categories = data.categories ?? [];
  const records = data.records ?? [];
  const theme = context?.theme;

  const showLegend = encoding?.showLegend ?? false;
  const showDataZoom = encoding?.showDataZoom ?? false;

  // Extract series
  const seriesList: SeriesOption[] = [];
  const legendNames: string[] = [];

  // Determine series definition from records or single series
  let hasVolumeSeries = false;
  let hasRateSeries = false;

  if (records.length > 0) {
    const firstRec = records[0];
    const numericKeys = Object.keys(firstRec).filter(
      (k) => k !== (encoding?.xField ?? 'period') && typeof firstRec[k] === 'number'
    );

    numericKeys.forEach((key) => {
      legendNames.push(key);
      const isBar = key.toLowerCase().includes('volume') || key.toLowerCase().includes('count');
      const isRateOrPct = key.toLowerCase().includes('rate') || key.toLowerCase().includes('pct') || key.toLowerCase().includes('percent');
      
      if (isBar) hasVolumeSeries = true;
      if (isRateOrPct) hasRateSeries = true;

      const seriesValues = records.map((r) => Number(r[key]) || 0);

      seriesList.push({
        name: key,
        type: isBar ? 'bar' : 'line',
        yAxisIndex: (spec.archetype === 'combo-trend' && isRateOrPct) ? 1 : 0,
        data: seriesValues,
        smooth: encoding?.smoothCurve ?? false,
        barMaxWidth: 36,
      });
    });
  }

  // Determine if dual y-axis is needed for combo-trend
  const needsDualYAxis = spec.archetype === 'combo-trend' && hasVolumeSeries && hasRateSeries;

  // Attach mark lines / areas to first series if present
  if (seriesList.length > 0) {
    const markLine = buildContractMarkLines(encoding?.markLines);
    const markArea = buildContractMarkAreas(encoding?.markAreas);
    if (markLine) seriesList[0].markLine = markLine;
    if (markArea) seriesList[0].markArea = markArea;
  }

  // Construct yAxis (single or dual)
  const isDark = theme?.isDark ?? false;
  const primaryYAxis = buildValueAxis({ unit, theme });
  const yAxisConfig = needsDualYAxis
    ? [
        primaryYAxis,
        {
          type: 'value' as const,
          name: '%',
          min: 0,
          axisLabel: {
            formatter: '{value}%',
            color: isDark ? '#94A3B8' : '#64748B',
            fontSize: 10,
          },
          splitLine: { show: false },
        },
      ]
    : primaryYAxis;

  // Determine continuous numerical X-axis vs category axis
  const isContinuous = spec.archetype === 'continuous-trend';
  const xAxisConfig = isContinuous
    ? {
        type: 'value' as const,
        axisLabel: {
          color: isDark ? '#94A3B8' : '#64748B',
          fontSize: 10,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed' as const,
            color: isDark ? '#334155' : '#F1F5F9',
          },
        },
      }
    : buildCategoryAxis({
        categories,
        theme,
      });

  const option: EChartsOption = {
    tooltip: buildBaseTooltip({ trigger: 'axis', axisPointerType: 'cross', theme }),
    grid: buildBaseGrid({
      hasLegend: showLegend && legendNames.length > 0,
      hasDataZoom: showDataZoom,
      hasSecondYAxis: needsDualYAxis,
    }),
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series: seriesList,
  };

  if (showLegend && legendNames.length > 0) {
    option.legend = buildBaseLegend({
      data: legendNames,
      theme,
    });
  }

  if (showDataZoom) {
    option.dataZoom = [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 20,
        bottom: 8,
      },
    ];
  }

  return option;
}
