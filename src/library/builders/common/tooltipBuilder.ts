/**
 * Visual Design Intelligence Library - Common Tooltip Builder
 * Pure function: constructs theme-aware, high-contrast, accessible tooltips.
 */

import type { TooltipComponentOption } from 'echarts';
import type { BaseTooltipOptions } from '../builder.types.ts';

export function buildBaseTooltip(options?: BaseTooltipOptions): TooltipComponentOption {
  const {
    trigger = 'axis',
    axisPointerType = 'cross',
    theme,
    formatter,
  } = options ?? {};

  // Theme-aware styling using ThemeDefinition tokens
  const isDark = theme?.isDark ?? false;
  const bgColor = theme?.colors.tooltipBg ?? (isDark ? '#1E293B' : '#FFFFFF');
  const borderColor = theme?.colors.tooltipBorder ?? (isDark ? '#334155' : '#E2E8F0');
  const textColor = theme?.colors.tooltipText ?? (isDark ? '#F8FAFC' : '#0F172A');

  const baseConfig: TooltipComponentOption = {
    trigger,
    axisPointer: {
      type: axisPointerType,
      lineStyle: {
        color: isDark ? '#475569' : '#94A3B8',
        type: 'dashed',
        width: 1,
      },
      crossStyle: {
        color: isDark ? '#475569' : '#94A3B8',
        type: 'dashed',
        width: 1,
      },
    },
    backgroundColor: bgColor,
    borderColor: borderColor,
    borderWidth: 1,
    padding: [8, 12],
    textStyle: {
      color: textColor,
      fontSize: 12,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
  };

  if (formatter !== undefined) {
    baseConfig.formatter = formatter;
  }

  return baseConfig;
}
