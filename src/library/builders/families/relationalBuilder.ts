/**
 * Visual Design Intelligence Library - Relational Sankey Family Builder
 * Pure function: converts nodes and links into an ECharts Sankey flow.
 */

import type { EChartsOption, SankeySeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';

export function buildSankeyOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data } = spec;
  const nodes = data.nodes ?? [];
  const links = data.links ?? [];
  const theme = context?.theme;

  const sankeySeries: SankeySeriesOption = {
    name: spec.title,
    type: 'sankey',
    emphasis: { focus: 'adjacency' },
    data: nodes.map((n) => ({ name: n.name })),
    links: links.map((l) => ({ source: l.source, target: l.target, value: l.value })),
    lineStyle: {
      color: 'gradient',
      curveness: 0.5,
    },
    label: {
      fontSize: 10,
      fontWeight: 600,
      color: theme?.isDark ? '#F8FAFC' : '#1E293B',
    },
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'item',
      theme,
      formatter: (params: unknown) => {
        const p = params as {
          dataType: string;
          name: string;
          value?: number;
          data?: { source: string; target: string; value: number };
        };
        if (p.dataType === 'node') {
          return `<strong>${p.name}</strong>: ${p.value?.toLocaleString() || ''}`;
        }
        if (p.data) {
          return `${p.data.source} → ${p.data.target}: <strong>${p.data.value?.toLocaleString()}</strong>`;
        }
        return '';
      },
    }),
    series: [sankeySeries],
  };
}
