import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface ParetoRawItem {
  name: string;
  count: number;
  code?: string;
}

export interface ParetoChart8020Props {
  data: ParetoRawItem[];
  height?: number | string;
  thresholdPercent?: number;
}

export const ParetoChart8020: React.FC<ParetoChart8020Props> = ({
  data,
  height = 320,
  thresholdPercent = 80,
}) => {
  // Sort descending
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const totalCount = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

  let currentSum = 0;
  const categories: string[] = [];
  const counts: number[] = [];
  const cumulativePercents: number[] = [];

  sorted.forEach((item) => {
    categories.push(item.name);
    counts.push(item.count);
    currentSum += item.count;
    cumulativePercents.push(Number(((currentSum / totalCount) * 100).toFixed(1)));
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        if (!params || !params.length) return '';
        const name = params[0].name;
        const count = params[0].value;
        const percent = ((count / totalCount) * 100).toFixed(1);
        const cumPercent = params[1] ? params[1].value : 0;

        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700; margin-bottom: 4px;">${name}</div>
            <div style="color: #2563EB;">Frequency: <strong>${count.toLocaleString()}</strong> (${percent}%)</div>
            <div style="color: #D97706; margin-top: 2px;">Cumulative: <strong>${cumPercent}%</strong></div>
          </div>
        `;
      },
    },
    grid: {
      left: 12,
      right: 36,
      top: 36,
      bottom: 28,
      containLabel: true,
    },
    legend: {
      data: ['Defect Frequency', 'Cumulative %'],
      top: 4,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: categories.length > 5 ? 20 : 0,
        fontSize: 10,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        axisLabel: { formatter: '{value}' },
        splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
      },
      {
        type: 'value',
        name: '%',
        min: 0,
        max: 100,
        axisLabel: { formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Defect Frequency',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#2563EB',
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 38,
      },
      {
        name: 'Cumulative %',
        type: 'line',
        yAxisIndex: 1,
        data: cumulativePercents,
        lineStyle: { color: '#D97706', width: 2.5 },
        itemStyle: { color: '#D97706' },
        symbol: 'circle',
        symbolSize: 6,
        markLine: {
          symbol: 'none',
          data: [
            {
              yAxis: thresholdPercent,
              lineStyle: { color: '#DC2626', type: 'dashed', width: 1.5 },
              label: {
                formatter: `80% Cutoff`,
                position: 'insideEndTop',
                color: '#DC2626',
                fontSize: 10,
              },
            },
          ],
        },
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
