import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface WaterfallStep {
  name: string;
  value: number; // positive = start/gain, negative = loss
  isTotal?: boolean;
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  unit?: string;
  height?: number | string;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  steps,
  unit = 'Pairs',
  height = 320,
}) => {
  const categories: string[] = [];
  const baseData: number[] = [];
  const positiveData: number[] = [];
  const negativeData: number[] = [];

  let runningTotal = 0;

  steps.forEach((step) => {
    categories.push(step.name);

    if (step.isTotal) {
      baseData.push(0);
      positiveData.push(runningTotal);
      negativeData.push(0);
    } else if (step.value >= 0) {
      baseData.push(runningTotal);
      positiveData.push(step.value);
      negativeData.push(0);
      runningTotal += step.value;
    } else {
      const absLoss = Math.abs(step.value);
      runningTotal -= absLoss;
      baseData.push(runningTotal);
      positiveData.push(0);
      negativeData.push(absLoss);
    }
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const p = params[1] && params[1].value > 0 ? params[1] : params[2];
        if (!p) return '';
        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700;">${p.name}</div>
            <div>Delta: <strong>${p.seriesName === 'Loss' ? '-' : '+'}${p.value?.toLocaleString()} ${unit}</strong></div>
          </div>
        `;
      },
    },
    grid: {
      left: 12,
      right: 20,
      top: 36,
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { interval: 0, rotate: 15, fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
    },
    series: [
      {
        name: 'Placeholder Base',
        type: 'bar',
        stack: 'Total',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: baseData,
      },
      {
        name: 'Yield / Retained',
        type: 'bar',
        stack: 'Total',
        label: { show: true, position: 'top', fontSize: 10 },
        itemStyle: { color: '#16A34A', borderRadius: [4, 4, 0, 0] },
        data: positiveData,
      },
      {
        name: 'Loss',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'bottom',
          fontSize: 10,
          formatter: (p: any) => (p.value > 0 ? `-${p.value}` : ''),
        },
        itemStyle: { color: '#DC2626', borderRadius: [0, 0, 4, 4] },
        data: negativeData,
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
