/**
 * Visual Design Intelligence Library - Common Axis Builders
 * Pure functions: constructs category and value axes following design system tokens.
 */

import type { XAxisComponentOption, YAxisComponentOption } from 'echarts';
import type { BaseAxisOptions } from '../builder.types.ts';

export function buildCategoryAxis(options?: BaseAxisOptions): XAxisComponentOption {
  const {
    name,
    categories = [],
    theme,
  } = options ?? {};

  const isDark = theme?.isDark ?? false;
  const labelColor = theme?.colors.textSecondary ?? (isDark ? '#94A3B8' : '#64748B');
  const lineColor = theme?.colors.axisLine ?? (isDark ? '#334155' : '#E2E8F0');

  return {
    type: 'category',
    data: [...categories],
    name,
    nameTextStyle: {
      color: labelColor,
      fontSize: 11,
    },
    axisLine: {
      lineStyle: {
        color: lineColor,
      },
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: lineColor,
      },
    },
    axisLabel: {
      color: labelColor,
      fontSize: 10,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
  };
}

export function buildValueAxis(options?: BaseAxisOptions): YAxisComponentOption {
  const {
    name,
    unit = '',
    min,
    max,
    showSplitLine = true,
    splitLineDashed = true,
    theme,
  } = options ?? {};

  const isDark = theme?.isDark ?? false;
  const labelColor = theme?.colors.textSecondary ?? (isDark ? '#94A3B8' : '#64748B');
  const splitColor = theme?.colors.gridLine ?? (isDark ? '#1E293B' : '#F1F5F9');

  const axis: YAxisComponentOption = {
    type: 'value',
    name,
    nameTextStyle: {
      color: labelColor,
      fontSize: 11,
    },
    axisLabel: {
      color: labelColor,
      fontSize: 10,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      formatter: unit ? `{value}${unit}` : '{value}',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: showSplitLine,
      lineStyle: {
        color: splitColor,
        type: splitLineDashed ? 'dashed' : 'solid',
      },
    },
  };

  if (min !== undefined) axis.min = min;
  if (max !== undefined) axis.max = max;

  return axis;
}
