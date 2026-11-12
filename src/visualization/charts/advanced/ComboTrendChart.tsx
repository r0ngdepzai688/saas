import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface ComboTrendPoint {
  period: string;
  volume: number;
  defectRate: number;
}

export interface ComboTrendChartProps {
  data: ComboTrendPoint[];
  height?: number | string;
  volumeName?: string;
  defectName?: string;
}

export const ComboTrendChart: React.FC<ComboTrendChartProps> = ({
  data,
  height = 320,
  volumeName = 'Production Volume',
  defectName = 'Defect Rate (%)',
}) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    grid: {
      left: 12,
      right: 28,
      top: 36,
      bottom: 24,
      containLabel: true,
    },
    legend: {
      data: [volumeName, defectName],
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.period),
      axisLabel: { fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Volume',
        splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
      },
      {
        type: 'value',
        name: '%',
        min: 0,
        axisLabel: { formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: volumeName,
        type: 'bar',
        data: data.map((d) => d.volume),
        itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 32,
      },
      {
        name: defectName,
        type: 'line',
        yAxisIndex: 1,
        data: data.map((d) => d.defectRate),
        lineStyle: { color: '#EF4444', width: 2.5 },
        itemStyle: { color: '#EF4444' },
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
