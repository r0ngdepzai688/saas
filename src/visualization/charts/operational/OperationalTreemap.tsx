import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
}

export interface OperationalTreemapProps {
  data: TreemapNode[];
  height?: number | string;
}

export const OperationalTreemap: React.FC<OperationalTreemapProps> = ({
  data,
  height = 320,
}) => {
  const option: EChartsOption = {
    tooltip: {
      formatter: (info: any) => {
        const val = info.value;
        const treePath = (info.treePathInfo || []).map((p: any) => p.name).join(' / ');
        return `
          <div style="font-family: inherit;">
            <div style="font-size: 10px; color: #94A3B8;">${treePath}</div>
            <div style="font-weight: 700; margin-top: 2px;">${info.name}</div>
            <div>Defect Volume: <strong>${val?.toLocaleString()}</strong> incidents</div>
          </div>
        `;
      },
    },
    series: [
      {
        name: 'Defects',
        type: 'treemap',
        visibleMin: 200,
        data: data,
        leafDepth: 2,
        levels: [
          {
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
              gapWidth: 2,
            },
          },
          {
            colorSaturation: [0.35, 0.65],
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
              gapWidth: 1,
            },
          },
        ],
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
