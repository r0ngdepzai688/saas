import type {
  FactoryKpi,
  ProductionLine,
  RejectReason,
  OutputCategory,
  FactoryAlert,
  BatchItem,
  HardwareServiceStatus,
} from '../types/factory';

export const FACTORY_KPIS: FactoryKpi[] = [
  {
    id: 'prod',
    title: "TODAY'S PRODUCTION",
    value: 58320,
    unit: 'Pairs',
    changePercent: 12.5,
    timeframe: 'vs yesterday',
    isPositive: true,
    type: 'production',
    color: '#2563EB', // Blue
  },
  {
    id: 'good',
    title: 'GOOD OUTPUT',
    value: 52845,
    unit: 'Pairs',
    changePercent: 8.4,
    timeframe: 'vs yesterday',
    isPositive: true,
    type: 'good',
    color: '#16A34A', // Green
  },
  {
    id: 'reject',
    title: 'REJECT OUTPUT',
    value: 5475,
    unit: 'Pairs',
    changePercent: 15.3,
    timeframe: 'vs yesterday',
    isPositive: false, // More reject is negative
    type: 'reject',
    color: '#7C3AED', // Purple
  },
  {
    id: 'oee',
    title: 'OEE',
    value: 78.6,
    unit: '%',
    changePercent: 6.7,
    timeframe: 'vs yesterday',
    isPositive: true,
    type: 'oee',
    color: '#D97706', // Amber/Orange
  },
  {
    id: 'downtime',
    title: 'DOWNTIME',
    value: 45,
    unit: 'min',
    changePercent: -5.2,
    timeframe: 'vs yesterday',
    isPositive: true, // Lower downtime is positive
    type: 'downtime',
    color: '#DC2626', // Red
  },
];

export const PRODUCTION_TREND_7D = [
  { date: '16/05', output: 45200, label: '45.2K' },
  { date: '17/05', output: 48700, label: '48.7K' },
  { date: '18/05', output: 51100, label: '51.1K' },
  { date: '19/05', output: 50300, label: '50.3K' },
  { date: '20/05', output: 53600, label: '53.6K' },
  { date: '21/05', output: 51800, label: '51.8K' },
  { date: '22/05', output: 58320, label: '58.3K' },
];

export const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'l1', line: 'LINE 1', goodOutput: 18245, oee: 82.1, status: 'Running' },
  { id: 'l2', line: 'LINE 2', goodOutput: 16580, oee: 76.3, status: 'Running' },
  { id: 'l3', line: 'LINE 3', goodOutput: 12360, oee: 68.4, status: 'Running' },
  { id: 'l4', line: 'LINE 4', goodOutput: 5660, oee: 45.2, status: 'Stopped' },
  { id: 'l5', line: 'LINE 5', goodOutput: 0, oee: 0, status: 'Stopped' },
];

export const OUTPUT_DISTRIBUTION: OutputCategory[] = [
  { name: 'Dipping', percent: 55.6, count: 32420, color: '#2563EB' },
  { name: 'Washing', percent: 18.7, count: 10910, color: '#16A34A' },
  { name: 'Inspection', percent: 15.3, count: 8920, color: '#D97706' },
  { name: 'Packing', percent: 10.4, count: 6070, color: '#EA580C' },
];

export const TOP_REJECT_REASONS: RejectReason[] = [
  { id: 'r1', reason: 'Pin Hole', count: 1245, percent: 22.8 },
  { id: 'r2', reason: 'Thin', count: 985, percent: 18.0 },
  { id: 'r3', reason: 'Dirty', count: 876, percent: 16.0 },
  { id: 'r4', reason: 'Cuff Defect', count: 754, percent: 13.8 },
  { id: 'r5', reason: 'Other', count: 1615, percent: 29.4 },
];

export const FACTORY_ALERTS: FactoryAlert[] = [
  {
    id: 'alt_1',
    line: 'LINE 3',
    title: 'High Reject Rate',
    detail: 'Reject rate is above 10%',
    time: '10:14',
    level: 'warning',
  },
  {
    id: 'alt_2',
    line: 'LINE 4',
    title: 'Machine Stopped',
    detail: 'Palletizer not responding',
    time: '10:10',
    level: 'critical',
  },
  {
    id: 'alt_3',
    line: 'Latex Tank 2',
    title: 'Low Level',
    detail: 'Current level 15%',
    time: '10:05',
    level: 'info',
  },
];

export const RECENT_BATCHES: BatchItem[] = [
  {
    id: 'b1',
    batchNo: 'B240522-001',
    product: 'LATEX GLOVE',
    size: 'M',
    station: 'DIPPING 1',
    status: 'Completed',
    time: '10:14',
  },
  {
    id: 'b2',
    batchNo: 'B240522-002',
    product: 'LATEX GLOVE',
    size: 'L',
    station: 'WASHING 1',
    status: 'Completed',
    time: '10:08',
  },
  {
    id: 'b3',
    batchNo: 'B240522-003',
    product: 'LATEX GLOVE',
    size: 'M',
    station: 'INSPECTION 2',
    status: 'In Progress',
    time: '10:03',
  },
  {
    id: 'b4',
    batchNo: 'B240522-004',
    product: 'LATEX GLOVE',
    size: 'S',
    station: 'PACKING 1',
    status: 'In Progress',
    time: '09:58',
  },
  {
    id: 'b5',
    batchNo: 'B240522-005',
    product: 'LATEX GLOVE',
    size: 'L',
    station: 'DIPPING 2',
    status: 'Pending',
    time: '09:53',
  },
];

export const SYSTEM_HARDWARE_STATUS: HardwareServiceStatus[] = [
  { id: 's1', name: 'Database', status: 'Online', icon: 'database' },
  { id: 's2', name: 'Weighing System', status: 'Online', icon: 'scale' },
  { id: 's3', name: 'Vision System', status: 'Online', icon: 'camera' },
  { id: 's4', name: 'Label Printer', status: 'Online', icon: 'printer' },
  { id: 's5', name: 'ERP Connection', status: 'Online', icon: 'link' },
  { id: 's6', name: 'Backup', status: 'Success', icon: 'hard-drive' },
];
