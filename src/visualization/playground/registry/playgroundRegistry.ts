import type { RegisteredChart } from '../types';

export const PLAYGROUND_CHART_REGISTRY: Record<string, RegisteredChart> = {
  // ==========================================
  // CATEGORY 1: KPI & PERFORMANCE
  // ==========================================
  bullet: {
    id: 'bullet',
    name: 'KPI Bullet Performance Chart',
    category: 'kpi',
    categoryLabel: 'KPI & Performance',
    description: 'Horizontal performance bar displaying actual achievement vs target marker inside qualitative ranges (Poor, Satisfactory, Good).',
    businessUseCase: 'OEE tracking, plant availability, department milestone evaluation without misleading radial gauge dials.',
    dataRequirements: ['Actual Value (number)', 'Target Benchmark (number)', 'Qualitative Range Thresholds [Poor, Fair, Good]'],
    complexity: 'Low',
    supportedDatasetTypes: ['kpi-bullet-dimensions', 'kpi-monthly-achievement'],
    strengths: [
      'High data-ink ratio: occupies 1/3 of the screen space of a round gauge.',
      'Displays rich qualitative context (in-spec vs marginal vs critical).',
      'Directly conveys target deficits without mental angle calculation.',
    ],
    limitations: [
      'Not suitable for high-density multi-year continuous time series.',
      'Requires pre-defined subjective qualitative performance bands.',
    ],
    defaultDatasetId: 'kpi-bullet-dimensions',
  },

  waterfall: {
    id: 'waterfall',
    name: 'Capacity Loss Waterfall Chart',
    category: 'kpi',
    categoryLabel: 'KPI & Performance',
    description: 'Floating stepped bars reconciling the sequential transition from Gross Planned Capacity to Net Good Output.',
    businessUseCase: 'Auditing where scheduled production capacity is lost across downtime, changeovers, speed derating, and scrap.',
    dataRequirements: ['Step Category Name (string)', 'Signed Value (+/- number)', 'Total Summary Flags (boolean)'],
    complexity: 'Medium',
    supportedDatasetTypes: ['kpi-production-waterfall'],
    strengths: [
      'Exposes sequential accretive and deductive impacts on the bottom line.',
      'Bridges engineering downtime with executive capacity reconciliation.',
      'Transparently visualizes total vs component contributions.',
    ],
    limitations: [
      'Cannot be used for non-sequential, independent categorical data.',
      'Becomes cluttered if more than 10 intermediate loss steps are plotted.',
    ],
    defaultDatasetId: 'kpi-production-waterfall',
  },

  bar: {
    id: 'bar',
    name: 'Comparative Bar Chart',
    category: 'kpi',
    categoryLabel: 'KPI & Performance',
    description: 'Discrete vertical columns comparing actual output volumes or target achievements across categorical entities.',
    businessUseCase: 'Comparing monthly output, shift volumes, or department completion rates side by side.',
    dataRequirements: ['Category Labels (string[])', 'Numeric Values (number[])'],
    complexity: 'Low',
    supportedDatasetTypes: ['kpi-monthly-achievement', 'qa-defect-pareto'],
    strengths: [
      'Universal cognitive recognition; zero learning curve for business users.',
      'Most accurate chart type for decoding length and position on common scale.',
    ],
    limitations: [
      'Aggregation bias: masks distribution spread and individual outliers.',
      'Subject to truncation bias if Y-axis baseline does not begin at zero.',
    ],
    defaultDatasetId: 'kpi-monthly-achievement',
  },

  // ==========================================
  // CATEGORY 2: QUALITY & DEFECT ANALYSIS
  // ==========================================
  pareto: {
    id: 'pareto',
    name: 'Pareto 80/20 Distribution Chart',
    category: 'quality',
    categoryLabel: 'Quality & Defect Analysis',
    description: 'Dual-axis visual combining descending frequency bars with cumulative percentage curve to isolate the vital 20% root causes.',
    businessUseCase: 'Defect prioritization meetings, Six Sigma triage, and allocating engineering maintenance budgets by scrap dollar value.',
    dataRequirements: ['Defect Names (string[])', 'Incident Counts (number[])', 'Unit Scrap Cost ($)'],
    complexity: 'Low',
    supportedDatasetTypes: ['qa-defect-pareto', 'kpi-monthly-achievement'],
    strengths: [
      'Directly identifies Juran 80/20 inflection point with a reference markLine.',
      'Eliminates unreadable 10-slice pie charts on shop-floor quality boards.',
      'Supports dual weighting by defect frequency and Cost of Poor Quality (COPQ).',
    ],
    limitations: [
      'Does not show time trends or whether defect rates are improving day-over-day.',
      'Requires pre-sorted descending order to be mathematically valid.',
    ],
    defaultDatasetId: 'qa-defect-pareto',
  },

  defectHeatmap: {
    id: 'defectHeatmap',
    name: 'Line × Station Defect Matrix Heatmap',
    category: 'quality',
    categoryLabel: 'Quality & Defect Analysis',
    description: '2D matrix cross-tabulating production lines against machine stations, colored by continuous defect density gradient.',
    businessUseCase: 'Pinpointing whether defect clusters are isolated to specific equipment (e.g. Dipping Tank 1 on Line 3) or factory-wide.',
    dataRequirements: ['Station Names (X-axis)', 'Line Identifiers (Y-axis)', '2D Matrix Cell Values [x, y, count]'],
    complexity: 'Medium',
    supportedDatasetTypes: ['qa-station-matrix'],
    strengths: [
      'Instantly reveals spatial clustering anomalies across complex factory layouts.',
      'Handles dense multi-station comparisons without line-crossing spaghetti clutter.',
    ],
    limitations: [
      'Cannot accurately decode exact numerical differences without tooltips.',
      'Requires careful continuous colormap calibration to prevent perceptual distortion.',
    ],
    defaultDatasetId: 'qa-station-matrix',
  },

  // ==========================================
  // CATEGORY 3: SPC & PROCESS CONTROL
  // ==========================================
  spc: {
    id: 'spc',
    name: 'Shewhart I-MR Statistical Control Chart',
    category: 'spc',
    categoryLabel: 'SPC & Process Control',
    description: 'Time-ordered telemetry line evaluated against statistically derived Center Line (CL) and Upper/Lower Control Limits (UCL/LCL = Mean ± 3σ).',
    businessUseCase: 'Real-time sensor monitoring, detecting assignable cause drift, and preventing out-of-spec scrap before parts are rejected.',
    dataRequirements: ['Sequential Continuous Measurements (number[])', 'Timestamps (string[])', 'Customer Specs USL/LSL (optional)'],
    complexity: 'High',
    supportedDatasetTypes: ['qa-spc-measurement', 'qa-capability-distribution'],
    strengths: [
      'Statistically grounded (ISO 7870 / AIAG SPC); separates natural noise from true assignable causes.',
      'Automated Western Electric / Nelson rule violation detection.',
      'Strictly distinguishes control limits (process voice) from customer tolerance limits (customer voice).',
    ],
    limitations: [
      'Requires continuous numeric variable data; invalid for discrete pass/fail attributes.',
      'Requires at least 20–30 initial points to compute stable baseline limits.',
    ],
    defaultDatasetId: 'qa-spc-measurement',
  },

  // ==========================================
  // CATEGORY 4: MONITORING & OPERATIONS
  // ==========================================
  sankey: {
    id: 'sankey',
    name: 'Material & Yield Workflow Sankey',
    category: 'monitoring',
    categoryLabel: 'Monitoring & Operations',
    description: 'Directed network ribbons where ribbon width corresponds to material mass balance from raw input through stations, rework, and scrap.',
    businessUseCase: 'Tracking material yield loss, identifying recirculation bottlenecks in rework loops, and verifying mass conservation.',
    dataRequirements: ['Node Array [{name}]', 'Directed Link Array [{source, target, value}]'],
    complexity: 'High',
    supportedDatasetTypes: ['ops-material-sankey'],
    strengths: [
      'Enforces visual conservation of flow across multi-step manufacturing pipelines.',
      'Instantly exposes excessive scrap diverters and rework recirculation loops.',
    ],
    limitations: [
      'High cognitive load; requires user familiarity with flow conservation diagrams.',
      'Unsuitable for mobile viewports without horizontal scrolling.',
    ],
    defaultDatasetId: 'ops-material-sankey',
  },

  treemap: {
    id: 'treemap',
    name: 'Hierarchical Operational Defect Treemap',
    category: 'monitoring',
    categoryLabel: 'Monitoring & Operations',
    description: 'Nested rectangular tiles displaying proportional defect scrap loss grouped by Plant, Line, Machine, and Defect classification.',
    businessUseCase: 'Executive scrap audits examining which plant operational zones generate the greatest monetary waste.',
    dataRequirements: ['Nested Hierarchy Object { name, children: [{ name, value }] }'],
    complexity: 'Medium',
    supportedDatasetTypes: ['ops-defect-treemap', 'qa-defect-pareto'],
    strengths: [
      'Extremely high information density; visualizes 100+ entities in a compact square.',
      'Interactive drill-down allows progressive exploration from macro plant to micro lot.',
    ],
    limitations: [
      'Difficult to compare rectangles with differing aspect ratios accurately.',
      'Loses precision when tiny sub-categories occupy less than 2% of total area.',
    ],
    defaultDatasetId: 'ops-defect-treemap',
  },

  // ==========================================
  // CATEGORY 5: COMPARISON & DISTRIBUTION
  // ==========================================
  capability: {
    id: 'capability',
    name: 'Process Capability Histogram (Cp/Cpk)',
    category: 'distribution',
    categoryLabel: 'Comparison & Distribution',
    description: 'Binned measurement distribution fitted with theoretical normal Gaussian curve against customer specification bounds (USL, LSL).',
    businessUseCase: 'New Product Introduction (NPI) qualification, mold validation, ISIR/PPAP sign-offs, and verifying Six Sigma capability.',
    dataRequirements: ['Continuous Measurements Sample (N >= 50)', 'Upper Spec Limit (USL)', 'Lower Spec Limit (LSL)'],
    complexity: 'High',
    supportedDatasetTypes: ['qa-capability-distribution', 'qa-spc-measurement'],
    strengths: [
      'Directly computes and displays Cpk capability indices with auto-pass/fail status.',
      'Detects multimodal distributions, skewness, and process centering errors.',
      'Prevents shipping off-center product that barely scrapes within specification.',
    ],
    limitations: [
      'Assumes underlying Gaussian normal distribution; invalid for heavily skewed or Weibull tool wear data.',
      'Requires substantial sample size (N >= 50) for reliable parameter estimation.',
    ],
    defaultDatasetId: 'qa-capability-distribution',
  },

  line: {
    id: 'line',
    name: 'Continuous Trend Line Chart',
    category: 'distribution',
    categoryLabel: 'Comparison & Distribution',
    description: 'Sequential continuous line plotting metric trajectory over time with smooth crosshair tracking.',
    businessUseCase: 'Monitoring continuous throughput, temperature sensor logging, or daily completion rate trends.',
    dataRequirements: ['Timestamped Observations (X: Date/Time, Y: Numeric Metric)'],
    complexity: 'Low',
    supportedDatasetTypes: ['kpi-monthly-achievement', 'ops-throughput-ppm', 'qa-spc-measurement'],
    strengths: [
      'Best-in-class for communicating rate of change, momentum, and cyclical patterns.',
      'Supports smooth dataZoom slider navigation for high-frequency datasets.',
    ],
    limitations: [
      'Spaghetti chart risk if more than 4 lines overlap on the same coordinate field.',
      'Can imply continuity between discrete points where none physically exists.',
    ],
    defaultDatasetId: 'kpi-monthly-achievement',
  },

  area: {
    id: 'area',
    name: 'Horizon Area Production Chart',
    category: 'distribution',
    categoryLabel: 'Comparison & Distribution',
    description: 'Filled area curve emphasizing cumulative volume magnitude over time with subtle baseline gradient.',
    businessUseCase: 'Tracking cumulative shift production output against planned horizon pace.',
    dataRequirements: ['Time Horizon Steps (string[])', 'Cumulative Volume (number[])'],
    complexity: 'Low',
    supportedDatasetTypes: ['kpi-monthly-achievement', 'ops-throughput-ppm'],
    strengths: [
      'Visually reinforces volume mass and cumulative accumulation better than a thin line.',
      'Excellent for single-metric pacing on shop-floor overhead monitors.',
    ],
    limitations: [
      'Unsuitable for multiple overlapping series due to visual occlusion.',
    ],
    defaultDatasetId: 'kpi-monthly-achievement',
  },

  // ==========================================
  // CATEGORY 6: ADVANCED ANALYTICS
  // ==========================================
  radar: {
    id: 'radar',
    name: 'Multi-Axis Quality Capability Radar',
    category: 'advanced',
    categoryLabel: 'Advanced Analytics',
    description: 'Radial polygonal glyph plotting 5 to 7 orthogonal quality metrics simultaneously to compare capability profiles.',
    businessUseCase: 'Benchmarking supplier audit scores, comparing production line capabilities, or shift-over-shift evaluations.',
    dataRequirements: ['Radial Indicators [{name, max}]', 'Series Profiles [{name, values: number[]}]'],
    complexity: 'Medium',
    supportedDatasetTypes: ['ops-supplier-radar'],
    strengths: [
      'Allows holistic fingerprint comparison across multi-dimensional criteria.',
      'Highlights trade-offs (e.g. high speed purchased at the cost of lower precision).',
    ],
    limitations: [
      'Area of the polygon scales quadratically, which can visually distort perceived differences.',
      'Order of axes affects polygon shape; requires consistent clockwise arrangement.',
    ],
    defaultDatasetId: 'ops-supplier-radar',
  },

  combo: {
    id: 'combo',
    name: 'Volume & Defect PPM Combo Trend',
    category: 'advanced',
    categoryLabel: 'Advanced Analytics',
    description: 'Synchronized dual Y-axis visualization correlating high throughput volume (bars on left axis) with defect PPM (line on right axis).',
    businessUseCase: 'Testing the operational hypothesis: Does pushing line speed beyond nominal rating trigger nonlinear defect surges?',
    dataRequirements: ['Time Axis (string[])', 'Throughput Volume (number[])', 'Defect PPM (number[])'],
    complexity: 'Medium',
    supportedDatasetTypes: ['ops-throughput-ppm', 'kpi-monthly-achievement'],
    strengths: [
      'Directly tests cause-and-effect correlation between capacity push and quality failure.',
      'Integrates volume and yield onto a single synchronized timeline.',
    ],
    limitations: [
      'Dual Y-axes can confuse untrained operators if axis colors do not match series colors.',
      'Risk of false visual correlation if axis ranges are arbitrarily scaled.',
    ],
    defaultDatasetId: 'ops-throughput-ppm',
  },
};
