/**
 * Visual Design Intelligence Library - Design Tokens Type Contracts
 * Framework-independent: zero dependencies on React, ECharts, or DOM.
 */

export interface SeriesPalette {
  readonly id: string;
  readonly name: string;
  readonly colors: readonly string[];
}

export interface SpcColorTokens {
  readonly target: string;
  readonly usl: string;
  readonly lsl: string;
  readonly ucl: string;
  readonly lcl: string;
  readonly mean: string;
  readonly median: string;
  readonly outOfControl: string;
  readonly inControl: string;
  readonly warningZone: string;
}

export interface StatusColorTokens {
  readonly optimal: string;
  readonly warning: string;
  readonly critical: string;
  readonly neutral: string;
  readonly info: string;
}

export interface SurfaceColorTokens {
  readonly background: string;
  readonly surface: string;
  readonly cardBorder: string;
  readonly grid: string;
  readonly axis: string;
  readonly axisLabel: string;
  readonly tooltipBg: string;
  readonly tooltipText: string;
  readonly tooltipBorder: string;
}

export interface TypographyTokens {
  readonly fontFamily: string;
  readonly monospaceFamily: string;
  readonly titleSize: number;
  readonly titleWeight: number | string;
  readonly subtitleSize: number;
  readonly bodySize: number;
  readonly axisSize: number;
  readonly legendSize: number;
  readonly tooltipSize: number;
  readonly banValueSize: number;
  readonly banLabelSize: number;
}

export interface SpacingTokens {
  readonly pagePadding: string;
  readonly sectionSpacing: string;
  readonly cardSpacing: string;
  readonly gridGutter: string;
  readonly innerPadding: string;
  readonly compactPadding: string;
}

export interface DimensionTokens {
  readonly cardRadius: string;
  readonly inputRadius: string;
  readonly buttonRadius: string;
  readonly badgeRadius: string;
  readonly lineWidth: number;
  readonly barRadius: readonly [number, number, number, number];
  readonly maxContentWidth: string;
}

export interface ElevationTokens {
  readonly flat: string;
  readonly subtle: string;
  readonly card: string;
  readonly floating: string;
  readonly specularHighlight: string;
}

export interface DesignTokens {
  readonly colors: {
    readonly series: readonly string[];
    readonly spc: SpcColorTokens;
    readonly status: StatusColorTokens;
    readonly surfaces: SurfaceColorTokens;
  };
  readonly typography: TypographyTokens;
  readonly spacing: SpacingTokens;
  readonly dimensions: DimensionTokens;
  readonly elevation: ElevationTokens;
}
