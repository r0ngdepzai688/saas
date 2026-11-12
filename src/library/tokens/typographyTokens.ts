/**
 * Visual Design Intelligence Library - Universal Typography Tokens
 * Framework-independent definitions for enterprise analytics readability.
 */

import type { TypographyTokens } from './tokens.types.ts';

export const TYPOGRAPHY_TOKENS: TypographyTokens = {
  fontFamily: 'Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  monospaceFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
  titleSize: 14,
  titleWeight: 600,
  subtitleSize: 11,
  bodySize: 13,
  axisSize: 10,
  legendSize: 11,
  tooltipSize: 11,
  banValueSize: 28,
  banLabelSize: 11,
} as const;

/**
 * Standard CSS font-feature-settings for numerical dashboards
 * Enforces tabular numbers to prevent jitter in live telemetry scrollers.
 */
export const NUMERIC_FONT_FEATURES = {
  tabularNums: 'tnum',
  proportionalNums: 'pnum',
  slashedZero: 'zero',
} as const;
