export interface FactoryKpi {
  id: string;
  title: string;
  value: number;
  unit: string;
  changePercent: number;
  timeframe: string;
  isPositive: boolean;
  type: 'production' | 'good' | 'reject' | 'oee' | 'downtime';
  color: string;
}

export interface ProductionLine {
  id: string;
  line: string;
  goodOutput: number;
  oee: number;
  status: 'Running' | 'Stopped' | 'Maintenance';
}

export interface RejectReason {
  id: string;
  reason: string;
  count: number;
  percent: number;
}

export interface OutputCategory {
  name: string;
  percent: number;
  count: number;
  color: string;
}

export interface FactoryAlert {
  id: string;
  line: string;
  title: string;
  detail: string;
  time: string;
  level: 'critical' | 'warning' | 'info';
}

export interface BatchItem {
  id: string;
  batchNo: string;
  product: string;
  size: string;
  station: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  time: string;
}

export interface HardwareServiceStatus {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Success';
  icon: string;
}
