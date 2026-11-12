/**
 * Visual Design Intelligence Library - Visualization JSON Contract
 *
 * Framework-independent JSON specification contract.
 *
 * NOTE ON ARCHITECTURAL SEPARATION:
 * - TypeScript Option Builders (frontend) are executable functions that translate
 *   this contract or raw data into EChartsOption configs.
 * - Python / FastAPI backends (or any other language) independently serialize
 *   JSON conforming to this contract.
 * - Python does NOT execute TypeScript functions; both adhere to this shared schema.
 */

export type VisualizationArchetype =
  | 'spc-control'
  | 'pareto-8020'
  | 'capability-histogram'
  | 'defect-heatmap'
  | 'kpi-bullet'
  | 'waterfall'
  | 'workflow-sankey'
  | 'operational-treemap'
  | 'quality-radar'
  | 'combo-trend'
  | 'horizon-area'
  | 'continuous-trend';

export interface ContractMetricSummary {
  readonly primaryKpi?: {
    readonly label: string;
    readonly value: number | string;
    readonly unit?: string;
    readonly delta?: number;
    readonly deltaDirection?: 'up' | 'down' | 'neutral';
    readonly status?: 'optimal' | 'warning' | 'critical' | 'neutral';
  };
}

export interface ContractMarkLine {
  readonly label: string;
  readonly yAxis?: number;
  readonly xAxis?: number | string;
  readonly color?: string;
  readonly lineStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface ContractMarkArea {
  readonly label?: string;
  readonly y0?: number;
  readonly y1?: number;
  readonly color?: string;
  readonly opacity?: number;
}

export interface VisualizationEncoding {
  readonly xField?: string;
  readonly yField?: string;
  readonly seriesField?: string;
  readonly colorPalette?: readonly string[];
  readonly markLines?: readonly ContractMarkLine[];
  readonly markAreas?: readonly ContractMarkArea[];
  readonly showDataZoom?: boolean;
  readonly showLegend?: boolean;
  readonly smoothCurve?: boolean;
}

export interface VisualizationDataPayload {
  readonly seriesName?: string;
  readonly categories?: readonly string[];
  readonly records?: readonly Record<string, unknown>[];
  readonly matrix?: readonly (readonly [number, number, number])[]; // [x, y, value] for heatmaps
  readonly nodes?: readonly { readonly name: string; readonly category?: string }[]; // for Sankey/Graph
  readonly links?: readonly { readonly source: string; readonly target: string; readonly value: number }[];
}

export interface VisualizationSpec {
  readonly version: '1.0';
  readonly id: string;
  readonly archetype: VisualizationArchetype;
  readonly title: string;
  readonly subtitle?: string;
  readonly unit?: string;
  readonly themeId?: string;
  readonly summary?: ContractMetricSummary;
  readonly encoding?: VisualizationEncoding;
  readonly data: VisualizationDataPayload;
}
