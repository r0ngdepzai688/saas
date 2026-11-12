/**
 * Visual Design Intelligence Library - SPC Control Chart Family Builder
 * Pure function: converts Shewhart SPC specifications into EChartsOption.
 * Strictly relies on Pure Math Engine for control limit calculations without duplicating formulas.
 */

import type { EChartsOption, LineSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { calculateSpcLimits } from '../../math/spc.ts';
import { evaluateNelsonRules } from '../../math/nelsonRules.ts';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';
import { buildContractMarkLines, buildContractMarkAreas } from '../common/markerBuilder.ts';

export function buildSpcControlOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data, encoding, unit } = spec;
  const categories = data.categories ?? [];
  const records = data.records ?? [];
  const theme = context?.theme;

  // Extract values
  const yField = encoding?.yField ?? 'value';
  const rawValues = records.map((r) => Number(r[yField]) || 0);

  // Calculate SPC limits via Pure Math Engine
  const spcLimits = calculateSpcLimits(rawValues, { calculationMethod: 'moving-range' });
  const { centerLine, ucl, lcl } = spcLimits;

  // Evaluate Nelson rules for out-of-control violation highlights
  const nelsonViolations = evaluateNelsonRules(rawValues, spcLimits);
  const outOfControlIndices = new Set<number>();
  nelsonViolations.forEach((v) => {
    v.windowIndices.forEach((idx) => outOfControlIndices.add(idx));
  });

  // Series data with conditional styling for out-of-control points
  const seriesData = rawValues.map((val, idx) => {
    const isOut = outOfControlIndices.has(idx);
    if (isOut) {
      return {
        value: val,
        itemStyle: {
          color: '#DC2626',
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
        symbolSize: 8,
      };
    }
    return {
      value: val,
      symbolSize: 5,
    };
  });

  // Synthesize mark lines for CL, UCL, LCL
  const defaultMarkLines = [
    { label: `UCL: ${ucl.toFixed(2)}`, yAxis: ucl, color: '#D97706', lineStyle: 'dashed' as const },
    { label: `CL: ${centerLine.toFixed(2)}`, yAxis: centerLine, color: '#16A34A', lineStyle: 'solid' as const },
    { label: `LCL: ${lcl.toFixed(2)}`, yAxis: lcl, color: '#D97706', lineStyle: 'dashed' as const },
  ];

  // Synthesize mark area for rational 3-sigma band
  const defaultMarkAreas = [
    { y0: lcl, y1: ucl, color: '#F59E0B', opacity: 0.05 },
  ];

  const markLines = buildContractMarkLines(encoding?.markLines ?? defaultMarkLines);
  const markAreas = buildContractMarkAreas(encoding?.markAreas ?? defaultMarkAreas);

  const mainSeries: LineSeriesOption = {
    name: spec.title,
    type: 'line',
    data: seriesData,
    lineStyle: {
      color: '#2563EB',
      width: 2,
    },
    itemStyle: {
      color: '#2563EB',
    },
    markLine: markLines,
    markArea: markAreas,
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'axis',
      axisPointerType: 'line',
      theme,
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const p = params[0] as { name: string; value: number; dataIndex: number };
        const isOut = outOfControlIndices.has(p.dataIndex);
        const alertHtml = isOut
          ? `<div style="color: #DC2626; font-weight: 700; margin-top: 4px;">⚠️ Rule Violation Detected</div>`
          : '';
        return `
          <div style="font-family: inherit;">
            <div style="font-size: 11px; opacity: 0.7;">Sample: ${p.name}</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">
              Measurement: ${p.value} ${unit ?? ''}
            </div>
            ${alertHtml}
          </div>
        `;
      },
    }),
    grid: buildBaseGrid({
      hasDataZoom: encoding?.showDataZoom ?? false,
    }),
    xAxis: buildCategoryAxis({
      categories,
      theme,
    }),
    yAxis: buildValueAxis({
      unit,
      min: Math.floor(lcl - (ucl - lcl) * 0.15),
      max: Math.ceil(ucl + (ucl - lcl) * 0.15),
      theme,
    }),
    series: [mainSeries],
  };
}
