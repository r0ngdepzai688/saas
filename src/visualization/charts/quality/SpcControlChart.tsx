import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';
import { calculateSpcLimits, detectOutOfControlPoints } from '../../utils/statisticalUtils';

export interface SpcDataPoint {
  sampleId: string;
  value: number;
  timestamp: string;
}

export interface SpcControlChartProps {
  data: SpcDataPoint[];
  metricName?: string;
  unit?: string;
  usl?: number; // Upper Specification Limit
  lsl?: number; // Lower Specification Limit
  target?: number;
  height?: number | string;
}

export const SpcControlChart: React.FC<SpcControlChartProps> = ({
  data,
  metricName = 'Key Dimension Measurement',
  unit = 'mm',
  usl,
  lsl,
  target,
  height = 320,
}) => {
  const values = data.map((d) => d.value);
  const { mean, ucl, lcl } = calculateSpcLimits(values);
  const outliers = detectOutOfControlPoints(values, ucl, lcl);

  const markLineData: any[] = [
    // UCL
    {
      yAxis: ucl,
      lineStyle: { color: '#D97706', type: 'dashed' as const, width: 1.5 },
      label: { formatter: `UCL: ${ucl}`, position: 'end', color: '#D97706', fontSize: 10 },
    },
    // Center Line (Mean)
    {
      yAxis: mean,
      lineStyle: { color: '#16A34A', type: 'solid' as const, width: 1.5 },
      label: { formatter: `CL: ${mean}`, position: 'end', color: '#16A34A', fontSize: 10 },
    },
    // LCL
    {
      yAxis: lcl,
      lineStyle: { color: '#D97706', type: 'dashed' as const, width: 1.5 },
      label: { formatter: `LCL: ${lcl}`, position: 'end', color: '#D97706', fontSize: 10 },
    },
  ];

  if (target !== undefined) {
    markLineData.push({
      yAxis: target,
      lineStyle: { color: '#2563EB', type: 'dotted' as const, width: 1.5 },
      label: { formatter: `Target: ${target}`, position: 'end', color: '#2563EB', fontSize: 10 },
    });
  }

  if (usl !== undefined) {
    markLineData.push({
      yAxis: usl,
      lineStyle: { color: '#DC2626', type: 'solid' as const, width: 1.5 },
      label: { formatter: `USL: ${usl}`, position: 'end', color: '#DC2626', fontSize: 10 },
    });
  }

  if (lsl !== undefined) {
    markLineData.push({
      yAxis: lsl,
      lineStyle: { color: '#DC2626', type: 'solid' as const, width: 1.5 },
      label: { formatter: `LSL: ${lsl}`, position: 'end', color: '#DC2626', fontSize: 10 },
    });
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!params || !params.length) return '';
        const p = params[0];
        const val = p.value;
        const isOutOfControl = val > ucl || val < lcl;
        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700; margin-bottom: 4px;">Sample: ${p.name}</div>
            <div>Value: <strong>${val} ${unit}</strong></div>
            <div style="color: #64748B; font-size: 10px; margin-top: 4px;">UCL: ${ucl} | Mean: ${mean} | LCL: ${lcl}</div>
            ${
              isOutOfControl
                ? `<div style="color: #EF4444; font-weight: 700; margin-top: 4px;">⚠️ SPC Rule Violation: Out of Control</div>`
                : ''
            }
          </div>
        `;
      },
    },
    grid: {
      left: 12,
      right: 48,
      top: 40,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.sampleId),
      boundaryGap: false,
      axisLabel: {
        fontSize: 10,
        interval: Math.ceil(data.length / 10),
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: `{value} ${unit}`,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#F1F5F9',
        },
      },
    },
    series: [
      {
        name: metricName,
        type: 'line',
        data: values,
        smooth: false,
        lineStyle: {
          color: '#2563EB',
          width: 2,
        },
        itemStyle: {
          color: (param: any) => {
            const v = param.value;
            return v > ucl || v < lcl ? '#DC2626' : '#2563EB';
          },
        },
        markLine: {
          symbol: 'none',
          data: markLineData,
        },
        markArea: {
          silent: true,
          data: [
            [
              {
                yAxis: lcl,
                itemStyle: { color: 'rgba(245, 158, 11, 0.05)' },
              },
              {
                yAxis: ucl,
              },
            ],
          ],
        },
      } as any,
    ],
  };

  return (
    <div>
      {outliers.length > 0 && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center justify-between">
          <span>⚠️ {outliers.length} point(s) exceed 3-sigma statistical control bounds!</span>
          <span className="font-mono text-[10px]">Nelson Rule 1</span>
        </div>
      )}
      <EChartsWrapper option={option} height={height} />
    </div>
  );
};
