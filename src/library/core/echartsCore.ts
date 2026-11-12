/**
 * Visual Design Intelligence Library - Modular ECharts Core
 *
 * Tier 2 Industrial Configuration:
 * Selective tree-shaking importing only the 10 industrial chart archetypes,
 * necessary components, and hardware-accelerated Canvas & SVG renderers.
 *
 * Eliminates monolithic bloat (unused 3D charts, geographic maps, globe, etc.)
 */

import * as echartsCoreModule from 'echarts/core';

// 1. Chart Archetypes
import {
  LineChart,
  BarChart,
  HeatmapChart,
  SankeyChart,
  TreemapChart,
  BoxplotChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
} from 'echarts/charts';

// 2. Analytical Components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  VisualMapComponent,
  ToolboxComponent,
} from 'echarts/components';

// 3. Renderers
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

// 4. Themes
import { CANONICAL_THEMES } from '../themes/themeDefinitions.ts';
import { createEChartsThemeConfig } from '../themes/themeRegistry.ts';

// Clone namespace into a mutable wrapper object for extensible runtime & testing mocking
const echarts = { ...echartsCoreModule };

// Register all selected modules
echarts.use([
  // Charts
  LineChart,
  BarChart,
  HeatmapChart,
  SankeyChart,
  TreemapChart,
  BoxplotChart,
  ScatterChart,
  RadarChart,
  GaugeChart,

  // Components
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  VisualMapComponent,
  ToolboxComponent,

  // Renderers
  CanvasRenderer,
  SVGRenderer,
]);

// Register the 5 canonical themes with the modular ECharts instance
Object.values(CANONICAL_THEMES).forEach((theme) => {
  const config = createEChartsThemeConfig(theme);
  echarts.registerTheme(theme.id, config);
});

// Also register legacy alias 'enterprise-light' for backward compatibility
const enterpriseLightConfig = createEChartsThemeConfig(CANONICAL_THEMES['light-enterprise']);
echarts.registerTheme('enterprise-light', enterpriseLightConfig);

export { echarts };

// Re-export common ECharts types
export type {
  EChartsOption,
  EChartsType,
  ECElementEvent,
  EChartsInitOpts,
} from 'echarts/types/dist/shared';
