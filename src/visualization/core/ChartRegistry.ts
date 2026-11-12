/**
 * Centralized Enterprise Visual Analytics Chart Registry
 * Maps analytical questions to recommended chart archetypes
 */

export interface ChartMeta {
  id: string;
  name: string;
  category: 'performance' | 'quality' | 'operational' | 'advanced';
  analyticalQuestion: string;
  bestFor: string;
  recommendedEngine: 'echarts' | 'd3' | 'recharts';
}

export const CHART_REGISTRY: Record<string, ChartMeta> = {
  spc: {
    id: 'spc',
    name: 'SPC Statistical Control Chart',
    category: 'quality',
    analyticalQuestion: 'Is the process statistically stable and in control?',
    bestFor: '3-sigma variation, out-of-control point detection, trend drift',
    recommendedEngine: 'echarts',
  },
  pareto: {
    id: 'pareto',
    name: 'Pareto 80/20 Distribution',
    category: 'quality',
    analyticalQuestion: 'Which defects contribute to 80% of total quality failure?',
    bestFor: 'Defect prioritization, root-cause triage, cumulative frequency',
    recommendedEngine: 'echarts',
  },
  capability: {
    id: 'capability',
    name: 'Process Capability Histogram (Cp/Cpk)',
    category: 'quality',
    analyticalQuestion: 'Does the production process meet customer engineering specs?',
    bestFor: 'Tolerance limits (USL/LSL), Gaussian fit, Six Sigma capability',
    recommendedEngine: 'echarts',
  },
  defectHeatmap: {
    id: 'defectHeatmap',
    name: 'Defect Concentration Heatmap',
    category: 'quality',
    analyticalQuestion: 'Which stations and production lines experience the highest defects?',
    bestFor: 'Spatial defect clustering, station matrix comparisons',
    recommendedEngine: 'echarts',
  },
  bullet: {
    id: 'bullet',
    name: 'KPI Bullet Performance Chart',
    category: 'performance',
    analyticalQuestion: 'Which departments or targets are meeting performance milestones?',
    bestFor: 'Target vs Actual against qualitative performance bands',
    recommendedEngine: 'echarts',
  },
  waterfall: {
    id: 'waterfall',
    name: 'Production Loss Waterfall',
    category: 'performance',
    analyticalQuestion: 'Where did production output loss occur from Gross to Net?',
    bestFor: 'Stoppage loss, defect loss walk, scrap deduction breakdown',
    recommendedEngine: 'echarts',
  },
  sankey: {
    id: 'sankey',
    name: 'Operational Workflow Sankey',
    category: 'operational',
    analyticalQuestion: 'How does work and material flow through process stations?',
    bestFor: 'Material batch routing, rework loops, and scrap diversion',
    recommendedEngine: 'echarts',
  },
  treemap: {
    id: 'treemap',
    name: 'Operational Defect Treemap',
    category: 'operational',
    analyticalQuestion: 'What is the hierarchical distribution of losses by Plant and Line?',
    bestFor: 'Nested category proportions and high-density hierarchical views',
    recommendedEngine: 'echarts',
  },
  radar: {
    id: 'radar',
    name: 'Multi-Axis Quality Radar',
    category: 'advanced',
    analyticalQuestion: 'How do multiple suppliers or lines compare across quality dimensions?',
    bestFor: 'Precision, Yield, Speed, Safety, and Compliance trade-off analysis',
    recommendedEngine: 'echarts',
  },
  combo: {
    id: 'combo',
    name: 'Volume & Defect Rate Combo Chart',
    category: 'advanced',
    analyticalQuestion: 'Does high throughput volume correlate with elevated defect rates?',
    bestFor: 'Dual-axis correlation of capacity vs quality failure',
    recommendedEngine: 'echarts',
  },
};
