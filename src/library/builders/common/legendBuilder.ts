/**
 * Visual Design Intelligence Library - Common Legend Builder
 * Pure function: constructs consistent, non-overlapping legend configurations.
 */

import type { LegendComponentOption } from 'echarts';
import type { BaseLegendOptions } from '../builder.types.ts';

export function buildBaseLegend(options?: BaseLegendOptions): LegendComponentOption {
  const {
    show = true,
    top = 0,
    bottom,
    left,
    right,
    orient = 'horizontal',
    data,
    theme,
  } = options ?? {};

  const isDark = theme?.isDark ?? false;
  const textColor = theme?.colors.textSecondary ?? (isDark ? '#94A3B8' : '#64748B');

  const legend: LegendComponentOption = {
    show,
    top,
    orient,
    itemWidth: 14,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: textColor,
      fontSize: 11,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
  };

  if (bottom !== undefined) legend.bottom = bottom;
  if (left !== undefined) legend.left = left;
  if (right !== undefined) legend.right = right;
  if (data !== undefined) legend.data = data;

  return legend;
}
