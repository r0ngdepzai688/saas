import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface BulletItem {
  category: string;
  actual: number;
  target: number;
  ranges: [number, number, number]; // [Poor, Satisfactory, Good]
}

export interface KpiBulletChartProps {
  items: BulletItem[];
  height?: number | string;
  unit?: string;
}

export const KpiBulletChart: React.FC<KpiBulletChartProps> = ({
  items,
  height = 280,
  unit = '%',
}) => {
  const categories = items.map((i) => i.category);
  const actuals = items.map((i) => i.actual);
  const targets = items.map((i) => i.target);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: 12,
      right: 24,
      top: 30,
      bottom: 12,
      containLabel: true,
    },
    legend: {
      data: ['Actual Metric', 'Target Threshold'],
      top: 0,
    },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: `{value}${unit}` },
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontWeight: 'bold' },
    },
    series: [
      {
        name: 'Actual Metric',
        type: 'bar',
        data: actuals,
        barWidth: 16,
        z: 3,
        itemStyle: {
          color: '#2563EB',
          borderRadius: [0, 4, 4, 0],
        },
      },
      {
        name: 'Target Threshold',
        type: 'scatter',
        data: targets,
        symbol: 'rect',
        symbolSize: [4, 26],
        z: 4,
        itemStyle: {
          color: '#DC2626',
        },
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
