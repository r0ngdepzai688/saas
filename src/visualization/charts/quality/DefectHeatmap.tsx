import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface HeatmapCell {
  station: string;
  defectType: string;
  count: number;
}

export interface DefectHeatmapProps {
  stations: string[];
  defectTypes: string[];
  matrixData: Array<[number, number, number]>; // [stationIdx, defectIdx, count]
  height?: number | string;
}

export const DefectHeatmap: React.FC<DefectHeatmapProps> = ({
  stations,
  defectTypes,
  matrixData,
  height = 320,
}) => {
  const maxCount = Math.max(...matrixData.map((d) => d[2]), 10);

  const option: EChartsOption = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const [stationIdx, defectIdx, val] = params.value;
        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700;">${stations[stationIdx]}</div>
            <div style="color: #64748B;">Defect: ${defectTypes[defectIdx]}</div>
            <div style="color: #DC2626; font-weight: 700; margin-top: 2px;">Count: ${val} incidents</div>
          </div>
        `;
      },
    },
    grid: {
      left: 12,
      right: 48,
      top: 20,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: stations,
      splitArea: { show: true },
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: defectTypes,
      splitArea: { show: true },
      axisLabel: { fontSize: 10 },
    },
    visualMap: {
      min: 0,
      max: maxCount,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#FEF2F2', '#FECACA', '#F87171', '#EF4444', '#991B1B'],
      },
      textStyle: { fontSize: 10, color: '#64748B' },
    },
    series: [
      {
        name: 'Defect Density',
        type: 'heatmap',
        data: matrixData,
        label: {
          show: true,
          fontSize: 10,
          color: '#1E293B',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
