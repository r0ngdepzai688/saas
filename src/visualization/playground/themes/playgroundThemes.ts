import * as echarts from 'echarts';
import type { PlaygroundTheme, ThemeId } from '../types';

export const PLAYGROUND_THEMES: Record<ThemeId, PlaygroundTheme> = {
  'light-enterprise': {
    id: 'light-enterprise',
    name: 'Light Enterprise',
    description: 'Clean, professional corporate theme optimized for daytime executive reporting.',
    isDark: false,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    gridLine: '#F1F5F9',
    axisLine: '#CBD5E1',
    palette: [
      '#2563EB', // Blue 600
      '#059669', // Emerald 600
      '#D97706', // Amber 600
      '#7C3AED', // Violet 600
      '#DC2626', // Red 600
      '#0891B2', // Cyan 600
      '#4F46E5', // Indigo 600
      '#EA580C', // Orange 600
    ],
  },
  'dark-analytics': {
    id: 'dark-analytics',
    name: 'Dark Analytics',
    description: 'High-contrast dark theme designed for SCADA and plant floor NOC terminals.',
    isDark: true,
    background: '#0B0F17',
    surface: '#121826',
    cardBorder: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    gridLine: 'rgba(255, 255, 255, 0.07)',
    axisLine: 'rgba(255, 255, 255, 0.15)',
    palette: [
      '#3B82F6', // Blue 500
      '#10B981', // Emerald 500
      '#F59E0B', // Amber 500
      '#8B5CF6', // Violet 500
      '#EF4444', // Red 500
      '#06B6D4', // Cyan 500
      '#6366F1', // Indigo 500
      '#F97316', // Orange 500
    ],
  },
  'warm-glass': {
    id: 'warm-glass',
    name: 'Warm Glass',
    description: 'Warm neutral palette (ivory, cream, terracotta, beige) with subtle specular highlights.',
    isDark: false,
    background: '#FAF6EE',
    surface: '#F5EFE1',
    cardBorder: '#E8DEC9',
    textPrimary: '#2D221E',
    textSecondary: '#685950',
    textMuted: '#9B8B80',
    gridLine: 'rgba(216, 203, 185, 0.45)',
    axisLine: '#D8CBB9',
    palette: [
      '#D95A32', // Terracotta
      '#C47A46', // Warm Bronze
      '#8B5E3C', // Deep Ochre
      '#B2644D', // Muted Coral
      '#5C7C6D', // Sage Olive
      '#93688C', // Dusty Plum
      '#C88E58', // Warm Apricot
      '#4A6B82', // Slate Navy
    ],
  },
  'minimal-monochrome': {
    id: 'minimal-monochrome',
    name: 'Minimal Monochrome',
    description: 'Editorial-grade grayscale styling with selective functional red/amber alerts.',
    isDark: false,
    background: '#FAFAFA',
    surface: '#F4F4F5',
    cardBorder: '#E4E4E7',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    textMuted: '#A1A1AA',
    gridLine: '#E4E4E7',
    axisLine: '#D4D4D8',
    palette: [
      '#27272A', // Zinc 800
      '#52525B', // Zinc 600
      '#71717A', // Zinc 500
      '#A1A1AA', // Zinc 400
      '#DC2626', // Semantic Red Accent
      '#18181B', // Zinc 900
      '#D4D4D8', // Zinc 300
      '#059669', // Semantic Green Accent
    ],
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast (WCAG AAA)',
    description: 'Ultra-distinct saturated colors and bold boundaries for outdoor or low-vision operators.',
    isDark: true,
    background: '#000000',
    surface: '#111111',
    cardBorder: '#333333',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#AAAAAA',
    gridLine: 'rgba(255, 255, 255, 0.2)',
    axisLine: '#FFFFFF',
    palette: [
      '#00E5FF', // High-viz Cyan
      '#FFEA00', // High-viz Yellow
      '#00E676', // High-viz Green
      '#FF1744', // High-viz Red
      '#D500F9', // High-viz Magenta
      '#FF9100', // High-viz Orange
      '#2979FF', // High-viz Blue
      '#FFFFFF', // High-viz White
    ],
  },
};

// Register all 5 themes with ECharts
Object.values(PLAYGROUND_THEMES).forEach((theme) => {
  const echartsThemeConfig = {
    color: theme.palette,
    backgroundColor: 'transparent',
    textStyle: {
      color: theme.textSecondary,
      fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
    },
    title: {
      textStyle: {
        color: theme.textPrimary,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: theme.textMuted,
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
          color: theme.axisLine,
        },
      },
      axisLabel: {
        color: theme.textSecondary,
        fontSize: 10,
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
        color: theme.textSecondary,
        fontSize: 10,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: theme.gridLine,
          type: 'dashed',
        },
      },
    },
    tooltip: {
      backgroundColor: theme.isDark ? '#1E293B' : '#0F172A',
      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#F8FAFC',
        fontSize: 11,
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); backdrop-filter: blur(8px);',
    },
    legend: {
      textStyle: {
        color: theme.textSecondary,
        fontSize: 11,
      },
    },
  };

  echarts.registerTheme(theme.id, echartsThemeConfig);
});
