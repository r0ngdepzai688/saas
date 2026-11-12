import type { SpcDataPoint } from '../charts/quality/SpcControlChart';
import type { ParetoRawItem } from '../charts/quality/ParetoChart8020';
import type { BulletItem } from '../charts/performance/KpiBulletChart';
import type { WaterfallStep } from '../charts/performance/WaterfallChart';
import type { SankeyNode, SankeyLink } from '../charts/operational/WorkflowSankey';
import type { TreemapNode } from '../charts/operational/OperationalTreemap';
import type { RadarDimension, RadarSeriesItem } from '../charts/advanced/QualityRadarChart';
import type { ComboTrendPoint } from '../charts/advanced/ComboTrendChart';

// 1. SPC Telemetry (25 consecutive lots with 1 out-of-control point)
export const SPC_MEASUREMENT_DATA: SpcDataPoint[] = [
  { sampleId: 'LOT-101', value: 10.02, timestamp: '08:00' },
  { sampleId: 'LOT-102', value: 10.08, timestamp: '08:15' },
  { sampleId: 'LOT-103', value: 9.98, timestamp: '08:30' },
  { sampleId: 'LOT-104', value: 10.12, timestamp: '08:45' },
  { sampleId: 'LOT-105', value: 10.05, timestamp: '09:00' },
  { sampleId: 'LOT-106', value: 9.94, timestamp: '09:15' },
  { sampleId: 'LOT-107', value: 10.03, timestamp: '09:30' },
  { sampleId: 'LOT-108', value: 10.15, timestamp: '09:45' },
  { sampleId: 'LOT-109', value: 10.48, timestamp: '10:00' }, // Out of control!
  { sampleId: 'LOT-110', value: 10.09, timestamp: '10:15' },
  { sampleId: 'LOT-111', value: 10.04, timestamp: '10:30' },
  { sampleId: 'LOT-112', value: 9.99, timestamp: '10:45' },
  { sampleId: 'LOT-113', value: 10.06, timestamp: '11:00' },
  { sampleId: 'LOT-114', value: 10.11, timestamp: '11:15' },
  { sampleId: 'LOT-115', value: 9.97, timestamp: '11:30' },
  { sampleId: 'LOT-116', value: 10.02, timestamp: '11:45' },
  { sampleId: 'LOT-117', value: 10.07, timestamp: '12:00' },
  { sampleId: 'LOT-118', value: 10.01, timestamp: '12:15' },
  { sampleId: 'LOT-119', value: 10.14, timestamp: '12:30' },
  { sampleId: 'LOT-120', value: 9.96, timestamp: '12:45' },
];

// 2. Pareto Quality Defect Items
export const PARETO_DEFECT_DATA: ParetoRawItem[] = [
  { name: 'Pin Hole', count: 1245, code: 'DEF-01' },
  { name: 'Thin Material', count: 985, code: 'DEF-02' },
  { name: 'Dirty Surface', count: 876, code: 'DEF-03' },
  { name: 'Cuff Defect', count: 754, code: 'DEF-04' },
  { name: 'Tear Microcrack', count: 420, code: 'DEF-05' },
  { name: 'Chemical Residue', count: 290, code: 'DEF-06' },
  { name: 'Air Blister', count: 150, code: 'DEF-07' },
];

// 3. Process Capability Raw Data (60 samples centered on 10.0mm)
export const CAPABILITY_SAMPLE_DATA: number[] = [
  9.85, 9.92, 10.04, 10.11, 9.98, 10.05, 10.14, 9.89, 10.02, 10.07,
  9.95, 10.18, 9.91, 10.03, 10.09, 9.84, 10.15, 10.06, 9.99, 10.01,
  10.08, 9.97, 10.12, 10.03, 9.88, 10.16, 9.94, 10.02, 10.05, 9.99,
  10.1, 9.87, 10.04, 10.13, 9.96, 10.01, 10.17, 9.93, 10.05, 10.08,
  9.95, 10.02, 10.14, 9.89, 10.06, 10.11, 9.98, 10.03, 10.07, 9.92,
];

// 4. Defect Heatmap Matrix
export const HEATMAP_STATIONS = ['Dipping 1', 'Dipping 2', 'Washing', 'Inspection', 'Packing'];
export const HEATMAP_DEFECTS = ['Pin Hole', 'Thin Layer', 'Dirty Stain', 'Cuff Tear'];
export const HEATMAP_MATRIX_DATA: Array<[number, number, number]> = [
  [0, 0, 412], [0, 1, 280], [0, 2, 85], [0, 3, 40],
  [1, 0, 520], [1, 1, 310], [1, 2, 92], [1, 3, 55],
  [2, 0, 95],  [2, 1, 140], [2, 2, 420], [2, 3, 60],
  [3, 0, 180], [3, 1, 210], [3, 2, 230], [3, 3, 380],
  [4, 0, 38],  [4, 1, 45],  [4, 2, 49],  [4, 3, 219],
];

// 5. KPI Bullet Items
export const BULLET_KPI_DATA: BulletItem[] = [
  { category: 'Line 1 OEE', actual: 82.1, target: 80.0, ranges: [50, 75, 100] },
  { category: 'Line 2 OEE', actual: 76.3, target: 80.0, ranges: [50, 75, 100] },
  { category: 'Line 3 OEE', actual: 68.4, target: 80.0, ranges: [50, 75, 100] },
  { category: 'FPY Quality', actual: 94.6, target: 95.0, ranges: [80, 92, 100] },
];

// 6. Waterfall Production Walk
export const WATERFALL_STEPS: WaterfallStep[] = [
  { name: 'Gross Scheduled', value: 65000 },
  { name: 'Machine Downtime', value: -3200 },
  { name: 'Setup / Changeover', value: -1100 },
  { name: 'Quality Defects', value: -5475 },
  { name: 'Material Reclaim', value: 850 },
  { name: 'Net Good Output', value: 0, isTotal: true },
];

// 7. Workflow Sankey Flow
export const SANKEY_NODES: SankeyNode[] = [
  { name: 'Raw Material Feed' },
  { name: 'Compounding Tank' },
  { name: 'Dipping Line' },
  { name: 'Vulcanizing Oven' },
  { name: 'Washing Station' },
  { name: 'Vision QA Inspection' },
  { name: 'Passed Quality' },
  { name: 'Rework Station' },
  { name: 'Scrap Bin' },
];

export const SANKEY_LINKS: SankeyLink[] = [
  { source: 'Raw Material Feed', target: 'Compounding Tank', value: 65000 },
  { source: 'Compounding Tank', target: 'Dipping Line', value: 64200 },
  { source: 'Dipping Line', target: 'Vulcanizing Oven', value: 62800 },
  { source: 'Vulcanizing Oven', target: 'Washing Station', value: 61500 },
  { source: 'Washing Station', target: 'Vision QA Inspection', value: 60200 },
  { source: 'Vision QA Inspection', target: 'Passed Quality', value: 52845 },
  { source: 'Vision QA Inspection', target: 'Rework Station', value: 4500 },
  { source: 'Vision QA Inspection', target: 'Scrap Bin', value: 2855 },
  { source: 'Rework Station', target: 'Passed Quality', value: 3800 },
  { source: 'Rework Station', target: 'Scrap Bin', value: 700 },
];

// 8. Operational Treemap Data
export const TREEMAP_DATA: TreemapNode[] = [
  {
    name: 'Plant Alpha',
    value: 5475,
    children: [
      {
        name: 'Line 1 (Auto)',
        value: 1450,
        children: [
          { name: 'Pin Hole', value: 820 },
          { name: 'Thin Material', value: 410 },
          { name: 'Dirty Stain', value: 220 },
        ],
      },
      {
        name: 'Line 2 (Semi)',
        value: 1220,
        children: [
          { name: 'Dirty Stain', value: 520 },
          { name: 'Pin Hole', value: 410 },
          { name: 'Cuff Defect', value: 290 },
        ],
      },
      {
        name: 'Line 3 (High Reject)',
        value: 2805,
        children: [
          { name: 'Pin Hole', value: 1245 },
          { name: 'Thin Layer', value: 810 },
          { name: 'Cuff Tear', value: 750 },
        ],
      },
    ],
  },
];

// 9. Multi-Axis Radar Quality Benchmark
export const RADAR_INDICATORS: RadarDimension[] = [
  { name: 'Dimensional Precision', max: 100 },
  { name: 'First Pass Yield (FPY)', max: 100 },
  { name: 'Cycle Speed Index', max: 100 },
  { name: 'ISO / Six Sigma Compliance', max: 100 },
  { name: 'Equipment MTBF', max: 100 },
];

export const RADAR_SERIES: RadarSeriesItem[] = [
  { name: 'Internal Benchmark (Target)', value: [90, 95, 88, 92, 85], color: '#2563EB' },
  { name: 'Line 1 Actual Performance', value: [84, 88, 92, 86, 80], color: '#16A34A' },
  { name: 'Line 3 Actual (At Risk)', value: [68, 72, 79, 74, 55], color: '#DC2626' },
];

// 10. Volume & Defect Rate Combo Trend
export const COMBO_TREND_DATA: ComboTrendPoint[] = [
  { period: 'Jul', volume: 45200, defectRate: 3.4 },
  { period: 'Aug', volume: 48900, defectRate: 3.1 },
  { period: 'Sep', volume: 52400, defectRate: 2.8 },
  { period: 'Oct', volume: 56100, defectRate: 2.3 },
  { period: 'Nov', volume: 58320, defectRate: 1.9 },
  { period: 'Dec (Target)', volume: 62000, defectRate: 1.5 },
];
