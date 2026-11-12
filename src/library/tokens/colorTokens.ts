/**
 * Visual Design Intelligence Library - Universal Color Tokens
 * Framework-independent definitions adhering to WCAG 2.2 AA/AAA guidelines.
 */

import type { SpcColorTokens, StatusColorTokens, SurfaceColorTokens } from './tokens.types.ts';

/**
 * Standard Categorical Series Palettes (8 balanced, distinguishable hues)
 */
export const CATEGORICAL_PALETTES = {
  /**
   * Enterprise Standard - Crisp modern corporate palette
   */
  enterprise: [
    '#2563EB', // Blue 600
    '#059669', // Emerald 600
    '#D97706', // Amber 600
    '#7C3AED', // Violet 600
    '#DC2626', // Red 600
    '#0891B2', // Cyan 600
    '#4F46E5', // Indigo 600
    '#EA580C', // Orange 600
  ] as const,

  /**
   * Warm Glass - Executive editorial palette (cream, terracotta, ochre, bronze, sage)
   */
  warmGlass: [
    '#D95A32', // Terracotta
    '#C47A46', // Warm Bronze
    '#8B5E3C', // Deep Ochre
    '#B2644D', // Muted Coral
    '#5C7C6D', // Sage Olive
    '#93688C', // Dusty Plum
    '#C88E58', // Warm Apricot
    '#4A6B82', // Slate Navy
  ] as const,

  /**
   * High-Contrast - SCADA / Plant-floor terminal palette (WCAG AAA saturated)
   */
  highContrast: [
    '#00E5FF', // High-viz Cyan
    '#FFEA00', // High-viz Yellow
    '#00E676', // High-viz Green
    '#FF1744', // High-viz Red
    '#D500F9', // High-viz Magenta
    '#FF9100', // High-viz Orange
    '#2979FF', // High-viz Blue
    '#FFFFFF', // High-viz White
  ] as const,

  /**
   * Minimal Monochrome - Editorial grayscale with functional accents
   */
  monochrome: [
    '#27272A', // Zinc 800
    '#52525B', // Zinc 600
    '#71717A', // Zinc 500
    '#A1A1AA', // Zinc 400
    '#DC2626', // Semantic Red Accent
    '#18181B', // Zinc 900
    '#D4D4D8', // Zinc 300
    '#059669', // Semantic Green Accent
  ] as const,

  /**
   * Dark Analytics - High-contrast luminous palette for dark themes
   */
  darkAnalytics: [
    '#3B82F6', // Blue 500
    '#10B981', // Emerald 500
    '#F59E0B', // Amber 500
    '#8B5CF6', // Violet 500
    '#EF4444', // Red 500
    '#06B6D4', // Cyan 500
    '#6366F1', // Indigo 500
    '#F97316', // Orange 500
  ] as const,
} as const;

/**
 * Statistical Process Control (SPC) Limit Colors
 * Follows ISO 7870-2 & Six Sigma industry conventions:
 * - Center Line (CL / Mean): Green or Neutral Blue
 * - Natural Control Limits (UCL / LCL): Amber / Gold (Voice of the Process)
 * - Specification Limits (USL / LSL): Red (Voice of the Customer)
 */
export const SPC_COLOR_TOKENS: SpcColorTokens = {
  target: '#2563EB',        // Production / Target Yield Line
  usl: '#DC2626',           // Upper Specification Limit (Customer Bound)
  lsl: '#DC2626',           // Lower Specification Limit (Customer Bound)
  ucl: '#D97706',           // Upper Control Limit (+3 sigma)
  lcl: '#D97706',           // Lower Control Limit (-3 sigma)
  mean: '#16A34A',          // Process Mean (Center Line)
  median: '#7C3AED',        // Process Median
  outOfControl: '#EF4444',  // Anomaly / Out-of-control point marker
  inControl: '#2563EB',     // Stable in-control point
  warningZone: 'rgba(217, 119, 6, 0.12)', // Zone A / B warning shading
} as const;

/**
 * Semantic Operational Status Colors
 * Pure status communication, not decorative.
 */
export const STATUS_COLOR_TOKENS: StatusColorTokens = {
  optimal: '#16A34A',       // Green (Nominal operation, Cpk >= 1.33)
  warning: '#D97706',       // Amber (Warning threshold, 1.0 <= Cpk < 1.33)
  critical: '#DC2626',      // Red (Out of spec / Out of control, Cpk < 1.0)
  neutral: '#64748B',       // Slate Gray (Idle / Inactive)
  info: '#0284C7',          // Sky Blue (Informational telemetry)
} as const;

/**
 * Default Light Surface Colors
 */
export const LIGHT_SURFACE_TOKENS: SurfaceColorTokens = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  cardBorder: '#E2E8F0',
  grid: 'rgba(226, 232, 240, 0.8)',
  axis: '#94A3B8',
  axisLabel: '#64748B',
  tooltipBg: 'rgba(15, 23, 42, 0.94)',
  tooltipText: '#F8FAFC',
  tooltipBorder: 'rgba(255, 255, 255, 0.12)',
} as const;

/**
 * Default Dark Surface Colors
 */
export const DARK_SURFACE_TOKENS: SurfaceColorTokens = {
  background: '#0B0F17',
  surface: '#121826',
  cardBorder: '#1E293B',
  grid: 'rgba(255, 255, 255, 0.07)',
  axis: 'rgba(255, 255, 255, 0.25)',
  axisLabel: '#94A3B8',
  tooltipBg: 'rgba(30, 41, 59, 0.95)',
  tooltipText: '#F8FAFC',
  tooltipBorder: 'rgba(255, 255, 255, 0.18)',
} as const;
