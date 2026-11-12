import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface RadarDimension {
  name: string;
  max: number;
}

export interface RadarSeriesItem {
  name: string;
  value: number[];
  color?: string;
}

export interface QualityRadarChartProps {
  indicators: RadarDimension[];
  series: RadarSeriesItem[];
  height?: number | string;
}

export const QualityRadarChart: React.FC<QualityRadarChartProps> = ({
  indicators,
  series,
  height = 320,
}) => {
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: {
      data: series.map((s) => s.name),
      top: 0,
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitArea: {
        areaStyle: {
          color: ['rgba(241, 245, 249, 0.4)', 'rgba(255, 255, 255, 0.8)'],
        },
      },
      axisLine: { lineStyle: { color: '#CBD5E1' } },
      splitLine: { lineStyle: { color: '#E2E8F0' } },
      axisName: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 600,
      },
    },
    series: [
      {
        name: 'Quality Benchmark',
        type: 'radar',
        data: series.map((s) => ({
          name: s.name,
          value: s.value,
          itemStyle: s.color ? { color: s.color } : undefined,
          areaStyle: { opacity: 0.15 },
        })),
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
