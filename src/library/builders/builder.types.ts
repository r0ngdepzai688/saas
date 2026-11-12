/**
 * Visual Design Intelligence Library - Builder Types
 * Pure TypeScript types for common and specialized option builders.
 */

import type {
  EChartsOption,
  TooltipComponentOption,
} from 'echarts';
import type { ThemeDefinition } from '../themes/theme.types.ts';

export interface BaseGridOptions {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  containLabel?: boolean;
  hasLegend?: boolean;
  hasDataZoom?: boolean;
  hasSecondYAxis?: boolean;
}

export interface BaseTooltipOptions {
  trigger?: 'item' | 'axis' | 'none';
  axisPointerType?: 'line' | 'shadow' | 'cross' | 'none';
  unit?: string;
  theme?: ThemeDefinition;
  formatter?: TooltipComponentOption['formatter'];
}

export interface BaseLegendOptions {
  show?: boolean;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  orient?: 'horizontal' | 'vertical';
  data?: string[];
  theme?: ThemeDefinition;
}

export interface BaseAxisOptions {
  name?: string;
  nameLocation?: 'start' | 'middle' | 'center' | 'end';
  unit?: string;
  categories?: readonly string[];
  min?: number | 'dataMin';
  max?: number | 'dataMax';
  showSplitLine?: boolean;
  splitLineDashed?: boolean;
  theme?: ThemeDefinition;
}

export interface BuilderContext {
  theme?: ThemeDefinition;
  overrides?: Partial<EChartsOption>;
  /** Explicit specification limits for capability analysis (Cp/Cpk/Histogram) */
  capabilityLimits?: {
    usl: number;
    lsl: number;
  };
}
