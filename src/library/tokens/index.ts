/**
 * Visual Design Intelligence Library - Design Tokens Entry Point
 * Framework-independent: export pure constants, scales, and type definitions.
 */

export * from './tokens.types.ts';
export * from './colorTokens.ts';
export * from './typographyTokens.ts';
export * from './spacingTokens.ts';

import {
  CATEGORICAL_PALETTES,
  SPC_COLOR_TOKENS,
  STATUS_COLOR_TOKENS,
  LIGHT_SURFACE_TOKENS,
} from './colorTokens.ts';
import { TYPOGRAPHY_TOKENS } from './typographyTokens.ts';
import { SPACING_TOKENS, DIMENSION_TOKENS, ELEVATION_TOKENS } from './spacingTokens.ts';
import type { DesignTokens } from './tokens.types.ts';

/**
 * Canonical Default Design Tokens Object
 */
export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    series: CATEGORICAL_PALETTES.enterprise,
    spc: SPC_COLOR_TOKENS,
    status: STATUS_COLOR_TOKENS,
    surfaces: LIGHT_SURFACE_TOKENS,
  },
  typography: TYPOGRAPHY_TOKENS,
  spacing: SPACING_TOKENS,
  dimensions: DIMENSION_TOKENS,
  elevation: ELEVATION_TOKENS,
};
