/**
 * Visual Design Intelligence Library - Hierarchical Treemap Family Builder
 * Pure function: converts hierarchical records into an ECharts Treemap.
 */

import type { EChartsOption, TreemapSeriesOption } from 'echarts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';
import type { BuilderContext } from '../builder.types.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';

export function buildTreemapOption(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  const { data } = spec;
  const records = data.records ?? [];
  const theme = context?.theme;

  const treemapSeries: TreemapSeriesOption = {
    name: spec.title,
    type: 'treemap',
    data: records.map((r) => ({
      name: String(r.name ?? 'Item'),
      value: Number(r.value) || 0,
    })),
    leafDepth: 1,
    roam: false,
    levels: [
      {
        itemStyle: {
          borderColor: '#FFFFFF',
          borderWidth: 2,
          gapWidth: 2,
        },
      },
      {
        colorSaturation: [0.35, 0.65],
        itemStyle: {
          borderColorSaturation: 0.7,
          gapWidth: 2,
          borderWidth: 2,
        },
      },
    ],
  };

  return {
    tooltip: buildBaseTooltip({
      trigger: 'item',
      theme,
      formatter: (info: unknown) => {
        const item = info as { name: string; value: number };
        if (!item) return '';
        return `
          <div style="font-family: inherit;">
            <div style="font-weight: 700;">${item.name}</div>
            <div style="margin-top: 2px;">Volume: <strong>${item.value?.toLocaleString()}</strong></div>
          </div>
        `;
      },
    }),
    series: [treemapSeries],
  };
}
