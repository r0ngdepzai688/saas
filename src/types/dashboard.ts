export interface KpiMetric {
  id: string;
  title: string;
  value: number;
  formattedValue?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  changePercent: number;
  isPositive: boolean;
  timeframe: string;
  sparkline: number[];
  category: 'revenue' | 'users' | 'conversion' | 'retention';
}

export interface RevenueDataPoint {
  period: string;
  currentYear: number;
  previousYear: number;
  projected: number;
}

export interface Transaction {
  id: string;
  invoice: string;
  customerName: string;
  customerEmail: string;
  avatar: string;
  plan: 'Enterprise Scale' | 'Growth Pro' | 'Starter Cloud' | 'Custom AI';
  amount: number;
  status: 'completed' | 'processing' | 'refunded' | 'failed';
  date: string;
  paymentMethod: string;
}

export interface ActivityEvent {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'deploy' | 'security' | 'billing' | 'user' | 'ai';
  severity?: 'normal' | 'notice' | 'warning';
}

export interface SystemHealthMetric {
  title: string;
  percent: number;
  metricLabel: string;
  metricValue: string;
  color: string;
  subtext: string;
}
