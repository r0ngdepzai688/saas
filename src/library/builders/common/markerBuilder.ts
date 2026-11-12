/**
 * Visual Design Intelligence Library - Common Marker Builder
 * Pure function: converts framework-independent contract markLines and markAreas
 * into strongly-typed ECharts SeriesMarkLineOption and SeriesMarkAreaOption.
 */

import type {
  ContractMarkLine,
  ContractMarkArea,
} from '../../contracts/visualizationContract.ts';

export interface EChartsMarkLineItem {
  name?: string;
  yAxis?: number;
  xAxis?: number | string;
  lineStyle?: {
    color?: string;
    type?: 'solid' | 'dashed' | 'dotted';
    width?: number;
  };
  label?: {
    formatter?: string;
    position?: 'start' | 'middle' | 'end' | 'insideStart' | 'insideEnd';
    color?: string;
    fontSize?: number;
  };
}

export function buildContractMarkLines(
  markLines?: readonly ContractMarkLine[]
): { symbol: string[]; data: EChartsMarkLineItem[] } | undefined {
  if (!markLines || markLines.length === 0) return undefined;

  const data: EChartsMarkLineItem[] = markLines.map((ml) => {
    const item: EChartsMarkLineItem = {
      name: ml.label,
      lineStyle: {
        color: ml.color ?? '#D97706',
        type: ml.lineStyle ?? 'dashed',
        width: 1.5,
      },
      label: {
        formatter: ml.label,
        position: 'end',
        color: ml.color ?? '#D97706',
        fontSize: 10,
      },
    };

    if (ml.yAxis !== undefined) item.yAxis = ml.yAxis;
    if (ml.xAxis !== undefined) item.xAxis = ml.xAxis;

    return item;
  });

  return {
    symbol: ['none', 'none'],
    data,
  };
}

export function buildContractMarkAreas(
  markAreas?: readonly ContractMarkArea[]
): { silent: boolean; data: Array<[Record<string, unknown>, Record<string, unknown>]> } | undefined {
  if (!markAreas || markAreas.length === 0) return undefined;

  const data: Array<[Record<string, unknown>, Record<string, unknown>]> = markAreas.map((ma) => {
    const color = ma.color ?? '#D97706';
    const opacity = ma.opacity ?? 0.08;

    return [
      {
        yAxis: ma.y0,
        itemStyle: {
          color,
          opacity,
        },
        label: ma.label ? { show: true, position: 'insideTopLeft', color } : undefined,
      },
      {
        yAxis: ma.y1,
      },
    ];
  });

  return {
    silent: true,
    data,
  };
}
