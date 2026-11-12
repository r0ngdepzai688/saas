/**
 * Visual Design Intelligence Library - Canonical Theme Definitions
 * The 5 approved themes for 2026 Enterprise Analytics:
 * 1. Light Enterprise (Clean daytime corporate dashboard)
 * 2. Dark Analytics (SCADA / NOC shop-floor terminal)
 * 3. Warm Glass (Executive editorial SaaS with ivory & terracotta)
 * 4. Minimal Monochrome (High-density print/audit layout with functional alerts)
 * 5. High Contrast (WCAG AAA extreme visual differentiation)
 */

import {
  CATEGORICAL_PALETTES,
  SPC_COLOR_TOKENS,
  STATUS_COLOR_TOKENS,
} from '../tokens/colorTokens.ts';
import { TYPOGRAPHY_TOKENS } from '../tokens/typographyTokens.ts';
import { ELEVATION_TOKENS } from '../tokens/spacingTokens.ts';
import type { ThemeDefinition, ThemeId } from './theme.types.ts';

const defaultTypography = {
  fontFamily: TYPOGRAPHY_TOKENS.fontFamily,
  titleSize: TYPOGRAPHY_TOKENS.titleSize,
  subtitleSize: TYPOGRAPHY_TOKENS.subtitleSize,
  axisSize: TYPOGRAPHY_TOKENS.axisSize,
  legendSize: TYPOGRAPHY_TOKENS.legendSize,
  tooltipSize: TYPOGRAPHY_TOKENS.tooltipSize,
};

export const THEME_LIGHT_ENTERPRISE: ThemeDefinition = {
  id: 'light-enterprise',
  name: 'Light Enterprise',
  description: 'Clean, professional corporate theme optimized for daytime executive reporting.',
  isDark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    gridLine: '#F1F5F9',
    axisLine: '#CBD5E1',
    palette: CATEGORICAL_PALETTES.enterprise,
    spc: SPC_COLOR_TOKENS,
    status: STATUS_COLOR_TOKENS,
    tooltipBg: 'rgba(15, 23, 42, 0.94)',
    tooltipText: '#F8FAFC',
    tooltipBorder: 'rgba(255, 255, 255, 0.12)',
  },
  typography: defaultTypography,
  elevation: {
    cardShadow: ELEVATION_TOKENS.card,
    specularHighlight: 'none',
  },
};

export const THEME_DARK_ANALYTICS: ThemeDefinition = {
  id: 'dark-analytics',
  name: 'Dark Analytics',
  description: 'High-contrast dark theme designed for SCADA and plant-floor NOC video walls.',
  isDark: true,
  colors: {
    background: '#0B0F17',
    surface: '#121826',
    cardBorder: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    gridLine: 'rgba(255, 255, 255, 0.07)',
    axisLine: 'rgba(255, 255, 255, 0.18)',
    palette: CATEGORICAL_PALETTES.darkAnalytics,
    spc: {
      ...SPC_COLOR_TOKENS,
      target: '#3B82F6',
      inControl: '#3B82F6',
      ucl: '#F59E0B',
      lcl: '#F59E0B',
    },
    status: STATUS_COLOR_TOKENS,
    tooltipBg: 'rgba(30, 41, 59, 0.95)',
    tooltipText: '#F8FAFC',
    tooltipBorder: 'rgba(255, 255, 255, 0.18)',
  },
  typography: defaultTypography,
  elevation: {
    cardShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
    specularHighlight: ELEVATION_TOKENS.specularHighlight,
  },
};

export const THEME_WARM_GLASS: ThemeDefinition = {
  id: 'warm-glass',
  name: 'Warm Glass',
  description: 'Warm neutral palette (ivory, cream, terracotta, beige) with subtle specular highlights.',
  isDark: false,
  colors: {
    background: '#FAF6EE',
    surface: '#F5EFE1',
    cardBorder: '#E8DEC9',
    textPrimary: '#2D221E',
    textSecondary: '#685950',
    textMuted: '#9B8B80',
    gridLine: 'rgba(216, 203, 185, 0.45)',
    axisLine: '#D8CBB9',
    palette: CATEGORICAL_PALETTES.warmGlass,
    spc: {
      ...SPC_COLOR_TOKENS,
      target: '#D95A32',
      inControl: '#D95A32',
      ucl: '#C47A46',
      lcl: '#C47A46',
      mean: '#5C7C6D',
    },
    status: STATUS_COLOR_TOKENS,
    tooltipBg: 'rgba(45, 34, 30, 0.95)',
    tooltipText: '#FAF6EE',
    tooltipBorder: 'rgba(232, 222, 201, 0.3)',
  },
  typography: defaultTypography,
  elevation: {
    cardShadow: '0 4px 24px -1px rgba(78, 59, 45, 0.08)',
    specularHighlight: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.45)',
  },
};

export const THEME_MINIMAL_MONOCHROME: ThemeDefinition = {
  id: 'minimal-monochrome',
  name: 'Minimal Monochrome',
  description: 'Editorial-grade grayscale styling with selective functional red/amber alerts.',
  isDark: false,
  colors: {
    background: '#FAFAFA',
    surface: '#F4F4F5',
    cardBorder: '#E4E4E7',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    textMuted: '#A1A1AA',
    gridLine: '#E4E4E7',
    axisLine: '#D4D4D8',
    palette: CATEGORICAL_PALETTES.monochrome,
    spc: {
      ...SPC_COLOR_TOKENS,
      target: '#18181B',
      inControl: '#27272A',
      ucl: '#DC2626',
      lcl: '#DC2626',
      mean: '#71717A',
    },
    status: STATUS_COLOR_TOKENS,
    tooltipBg: '#18181B',
    tooltipText: '#FAFAFA',
    tooltipBorder: '#27272A',
  },
  typography: defaultTypography,
  elevation: {
    cardShadow: ELEVATION_TOKENS.subtle,
    specularHighlight: 'none',
  },
};

export const THEME_HIGH_CONTRAST: ThemeDefinition = {
  id: 'high-contrast',
  name: 'High Contrast (WCAG AAA)',
  description: 'Ultra-distinct saturated colors and bold boundaries for outdoor or low-vision operators.',
  isDark: true,
  colors: {
    background: '#000000',
    surface: '#111111',
    cardBorder: '#333333',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#AAAAAA',
    gridLine: 'rgba(255, 255, 255, 0.22)',
    axisLine: '#FFFFFF',
    palette: CATEGORICAL_PALETTES.highContrast,
    spc: {
      ...SPC_COLOR_TOKENS,
      target: '#00E5FF',
      inControl: '#00E5FF',
      ucl: '#FFEA00',
      lcl: '#FFEA00',
      mean: '#00E676',
      outOfControl: '#FF1744',
    },
    status: {
      optimal: '#00E676',
      warning: '#FFEA00',
      critical: '#FF1744',
      neutral: '#AAAAAA',
      info: '#00E5FF',
    },
    tooltipBg: '#000000',
    tooltipText: '#FFFFFF',
    tooltipBorder: '#FFFFFF',
  },
  typography: {
    ...defaultTypography,
    titleSize: 15,
    axisSize: 11,
  },
  elevation: {
    cardShadow: 'none',
    specularHighlight: 'inset 0 0 0 1px #333333',
  },
};

export const CANONICAL_THEMES: Record<ThemeId, ThemeDefinition> = {
  'light-enterprise': THEME_LIGHT_ENTERPRISE,
  'dark-analytics': THEME_DARK_ANALYTICS,
  'warm-glass': THEME_WARM_GLASS,
  'minimal-monochrome': THEME_MINIMAL_MONOCHROME,
  'high-contrast': THEME_HIGH_CONTRAST,
};
