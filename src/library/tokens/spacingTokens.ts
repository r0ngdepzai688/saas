/**
 * Visual Design Intelligence Library - Spacing, Dimensions & Elevation Tokens
 * Aligned with the 2026 Enterprise Design Standards (IQC Nexus & Modern SaaS).
 */

import type { DimensionTokens, ElevationTokens, SpacingTokens } from './tokens.types.ts';

export const SPACING_TOKENS: SpacingTokens = {
  pagePadding: '32px',
  sectionSpacing: '32px',
  cardSpacing: '24px',
  gridGutter: '24px',
  innerPadding: '20px',
  compactPadding: '12px',
} as const;

export const DIMENSION_TOKENS: DimensionTokens = {
  cardRadius: '16px',
  inputRadius: '12px',
  buttonRadius: '12px',
  badgeRadius: '9999px',
  lineWidth: 2,
  barRadius: [4, 4, 0, 0] as const,
  maxContentWidth: '1600px',
} as const;

export const ELEVATION_TOKENS: ElevationTokens = {
  flat: 'none',
  subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  floating: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  specularHighlight: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
} as const;
