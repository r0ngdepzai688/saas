/**
 * Visual Design Intelligence Library - Theme Registry & Transformer
 * Pure TypeScript: Zero dependencies on React, ECharts, or DOM.
 */

import { CANONICAL_THEMES } from './themeDefinitions.ts';
import type { ThemeDefinition, ThemeId } from './theme.types.ts';

const customThemeRegistry = new Map<string, ThemeDefinition>();

/**
 * Retrieves a theme by its unique identifier.
 * Falls back to 'light-enterprise' if not found.
 */
export function getTheme(id: ThemeId | string): ThemeDefinition {
  if (customThemeRegistry.has(id)) {
    return customThemeRegistry.get(id)!;
  }
  if (id in CANONICAL_THEMES) {
    return CANONICAL_THEMES[id as ThemeId];
  }
  return CANONICAL_THEMES['light-enterprise'];
}

/**
 * Retrieves all registered themes (canonical + custom).
 */
export function getAllThemes(): ThemeDefinition[] {
  const canonical = Object.values(CANONICAL_THEMES);
  const custom = Array.from(customThemeRegistry.values());
  return [...canonical, ...custom];
}

/**
 * Registers a custom theme into the library registry.
 */
export function registerCustomTheme(theme: ThemeDefinition): void {
  if (!theme || !theme.id) {
    throw new Error('Invalid theme: theme object and unique theme.id are required.');
  }
  customThemeRegistry.set(theme.id, theme);
}

/**
 * Transforms a ThemeDefinition into a pure ECharts Theme Configuration object.
 * Pure function: Does NOT call echarts.registerTheme directly, allowing
 * consumers to use this in SSR, Node.js, or client contexts without bundling echarts.
 */
export function createEChartsThemeConfig(theme: ThemeDefinition): Record<string, unknown> {
  const { colors, typography } = theme;

  return {
    color: [...colors.palette],
    backgroundColor: 'transparent',
    textStyle: {
      color: colors.textSecondary,
      fontFamily: typography.fontFamily,
    },
    title: {
      textStyle: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: typography.titleSize,
      },
      subtextStyle: {
        color: colors.textMuted,
        fontSize: typography.subtitleSize,
      },
    },
    line: {
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2.5,
      },
    },
    bar: {
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: colors.axisLine,
        },
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: typography.axisSize,
      },
      splitLine: {
        show: false,
      },
    },
    valueAxis: {
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: typography.axisSize,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: colors.gridLine,
          type: 'dashed',
        },
      },
    },
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: colors.tooltipText,
        fontSize: typography.tooltipSize,
      },
      extraCssText:
        'border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.35); backdrop-filter: blur(8px);',
    },
    legend: {
      textStyle: {
        color: colors.textSecondary,
        fontSize: typography.legendSize,
      },
    },
  };
}

/**
 * Optional bridge helper to register a theme with an ECharts instance
 * when ECharts is available in the consumer application.
 */
export function registerThemeWithECharts(
  theme: ThemeDefinition,
  echartsInstance: { registerTheme: (name: string, config: unknown) => void }
): void {
  if (!echartsInstance || typeof echartsInstance.registerTheme !== 'function') {
    throw new Error('registerThemeWithECharts requires an ECharts instance with registerTheme method.');
  }
  const config = createEChartsThemeConfig(theme);
  echartsInstance.registerTheme(theme.id, config);
}
