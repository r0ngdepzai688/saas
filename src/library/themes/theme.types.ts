/**
 * Visual Design Intelligence Library - Theme Contract Types
 * Pure TypeScript: Zero dependencies on React, ECharts, or DOM.
 */

import type { SpcColorTokens, StatusColorTokens } from '../tokens/tokens.types.ts';

export type ThemeId =
  | 'light-enterprise'
  | 'dark-analytics'
  | 'warm-glass'
  | 'minimal-monochrome'
  | 'high-contrast';

export interface ThemeColors {
  readonly background: string;
  readonly surface: string;
  readonly cardBorder: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly gridLine: string;
  readonly axisLine: string;
  readonly palette: readonly string[];
  readonly spc: SpcColorTokens;
  readonly status: StatusColorTokens;
  readonly tooltipBg: string;
  readonly tooltipText: string;
  readonly tooltipBorder: string;
}

export interface ThemeTypography {
  readonly fontFamily: string;
  readonly titleSize: number;
  readonly subtitleSize: number;
  readonly axisSize: number;
  readonly legendSize: number;
  readonly tooltipSize: number;
}

export interface ThemeElevation {
  readonly cardShadow: string;
  readonly specularHighlight: string;
}

export interface ThemeDefinition {
  readonly id: ThemeId | string;
  readonly name: string;
  readonly description: string;
  readonly isDark: boolean;
  readonly colors: ThemeColors;
  readonly typography: ThemeTypography;
  readonly elevation: ThemeElevation;
}
