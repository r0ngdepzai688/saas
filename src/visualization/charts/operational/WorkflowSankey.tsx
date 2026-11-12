import React from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsWrapper } from '../../core/EChartsWrapper';

export interface SankeyNode {
  name: string;
  itemStyle?: { color?: string };
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface WorkflowSankeyProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number | string;
}

export const WorkflowSankey: React.FC<WorkflowSankeyProps> = ({
  nodes,
  links,
  height = 340,
}) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `<strong>${params.name}</strong>: ${params.value?.toLocaleString() || ''} units`;
        }
        return `${params.data.source} → ${params.data.target}: <strong>${params.data.value?.toLocaleString()}</strong> units`;
      },
    },
    series: [
      {
        type: 'sankey',
        emphasis: { focus: 'adjacency' },
        data: nodes,
        links: links,
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
        label: {
          fontSize: 10,
          fontWeight: 600,
          color: '#334155',
        },
      },
    ],
  };

  return <EChartsWrapper option={option} height={height} />;
};
