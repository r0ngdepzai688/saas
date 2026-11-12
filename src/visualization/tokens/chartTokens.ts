/**
 * Enterprise Visual Analytics & Graphic System 2026 - Design Tokens
 */

export const CHART_COLOR_TOKENS = {
  // Brand Series (Categorical Scale)
  series: [
    '#2563EB', // Primary Blue
    '#0D9488', // Teal
    '#D97706', // Warm Amber
    '#7C3AED', // Violet
    '#DB2777', // Magenta Pink
    '#EA580C', // Deep Orange
    '#4F46E5', // Indigo
    '#059669', // Emerald Green
  ],

  // Quality & Statistical Limits (SPC / Spec Limits)
  spc: {
    target: '#2563EB',        // Production / Target Yield Line
    usl: '#DC2626',           // Upper Specification Limit (Customer Bound)
    lsl: '#DC2626',           // Lower Specification Limit (Customer Bound)
    ucl: '#D97706',           // Upper Control Limit (+3 sigma)
    lcl: '#D97706',           // Lower Control Limit (-3 sigma)
    mean: '#16A34A',          // Process Mean (CL)
    median: '#7C3AED',        // Process Median
    outOfControl: '#EF4444',  // Anomaly point
    inControl: '#2563EB',     // Stable point
  },

  // Semantic Status Colors
  status: {
    optimal: '#16A34A',       // Green
    warning: '#D97706',       // Amber
    critical: '#DC2626',      // Red
    neutral: '#64748B',       // Slate Gray
    info: '#0284C7',          // Sky Blue
  },

  // Surface & Grid Palette
  surfaces: {
    grid: 'rgba(226, 232, 240, 0.8)',
    axis: '#94A3B8',
    axisLabel: '#64748B',
    tooltipBg: 'rgba(15, 23, 42, 0.92)',
    tooltipText: '#F8FAFC',
    tooltipBorder: 'rgba(255, 255, 255, 0.1)',
  }
};

export const CHART_TYPOGRAPHY_TOKENS = {
  fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
  titleSize: 14,
  titleWeight: 700,
  subtitleSize: 11,
  axisSize: 10,
  legendSize: 11,
  tooltipSize: 11,
};

export const CHART_DIMENSION_TOKENS = {
  cardRadius: '16px',
  innerPadding: '20px',
  lineWidth: 2,
  barRadius: [4, 4, 0, 0] as [number, number, number, number],
};
