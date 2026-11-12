import type { KpiMetric, RevenueDataPoint, Transaction, ActivityEvent, SystemHealthMetric } from '../types/dashboard';

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'mrr',
    title: 'Monthly Recurring Revenue',
    value: 148280,
    prefix: '$',
    decimals: 0,
    changePercent: 14.8,
    isPositive: true,
    timeframe: 'vs last month',
    sparkline: [32, 45, 42, 58, 62, 78, 88, 94, 98, 112, 128, 148],
    category: 'revenue'
  },
  {
    id: 'active_tenants',
    title: 'Active Workspaces',
    value: 2845,
    suffix: '',
    decimals: 0,
    changePercent: 8.6,
    isPositive: true,
    timeframe: 'vs last month',
    sparkline: [2100, 2180, 2240, 2350, 2420, 2500, 2610, 2740, 2845],
    category: 'users'
  },
  {
    id: 'nrr',
    title: 'Net Revenue Retention',
    value: 124.8,
    suffix: '%',
    decimals: 1,
    changePercent: 3.2,
    isPositive: true,
    timeframe: 'trailing 12 mo',
    sparkline: [112, 114, 115, 118, 119, 121, 122, 123, 124.8],
    category: 'retention'
  },
  {
    id: 'avg_ltv',
    title: 'Avg. Enterprise LTV',
    value: 18450,
    prefix: '$',
    decimals: 0,
    changePercent: -1.4,
    isPositive: false,
    timeframe: 'vs target index',
    sparkline: [19200, 19100, 18900, 18750, 18600, 18450],
    category: 'conversion'
  }
];

export const REVENUE_TIMEFRAME_DATA: Record<string, RevenueDataPoint[]> = {
  '12M': [
    { period: 'Jan', currentYear: 68000, previousYear: 42000, projected: 65000 },
    { period: 'Feb', currentYear: 74000, previousYear: 48000, projected: 72000 },
    { period: 'Mar', currentYear: 82000, previousYear: 51000, projected: 79000 },
    { period: 'Apr', currentYear: 89000, previousYear: 56000, projected: 86000 },
    { period: 'May', currentYear: 97000, previousYear: 61000, projected: 94000 },
    { period: 'Jun', currentYear: 108000, previousYear: 68000, projected: 104000 },
    { period: 'Jul', currentYear: 116000, previousYear: 73000, projected: 112000 },
    { period: 'Aug', currentYear: 124000, previousYear: 78000, projected: 120000 },
    { period: 'Sep', currentYear: 131000, previousYear: 84000, projected: 128000 },
    { period: 'Oct', currentYear: 138000, previousYear: 89000, projected: 135000 },
    { period: 'Nov', currentYear: 144000, previousYear: 95000, projected: 141000 },
    { period: 'Dec', currentYear: 148280, previousYear: 102000, projected: 146000 },
  ],
  '30D': [
    { period: 'W1', currentYear: 32000, previousYear: 24000, projected: 31000 },
    { period: 'W2', currentYear: 36500, previousYear: 26000, projected: 35000 },
    { period: 'W3', currentYear: 41200, previousYear: 28500, projected: 39000 },
    { period: 'W4', currentYear: 38580, previousYear: 29000, projected: 38000 },
  ],
  '7D': [
    { period: 'Mon', currentYear: 4800, previousYear: 3200, projected: 4500 },
    { period: 'Tue', currentYear: 5400, previousYear: 3600, projected: 5100 },
    { period: 'Wed', currentYear: 6100, previousYear: 4100, projected: 5800 },
    { period: 'Thu', currentYear: 5900, previousYear: 3900, projected: 5700 },
    { period: 'Fri', currentYear: 6700, previousYear: 4300, projected: 6300 },
    { period: 'Sat', currentYear: 4200, previousYear: 2900, projected: 4000 },
    { period: 'Sun', currentYear: 3800, previousYear: 2600, projected: 3600 },
  ]
};

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_9841',
    invoice: 'INV-2026-0041',
    customerName: 'Aether Robotics Corp',
    customerEmail: 'billing@aetherrobotics.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    plan: 'Enterprise Scale',
    amount: 14200,
    status: 'completed',
    date: 'Today, 14:28',
    paymentMethod: 'Wire Transfer •• 8912'
  },
  {
    id: 'tx_9840',
    invoice: 'INV-2026-0040',
    customerName: 'Kallisto BioSciences',
    customerEmail: 'procurement@kallistobio.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    plan: 'Enterprise Scale',
    amount: 12500,
    status: 'completed',
    date: 'Today, 11:15',
    paymentMethod: 'Corporate Card •• 4022'
  },
  {
    id: 'tx_9839',
    invoice: 'INV-2026-0039',
    customerName: 'Stratos Logistics Global',
    customerEmail: 'finance@stratoslogistics.de',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    plan: 'Growth Pro',
    amount: 4800,
    status: 'processing',
    date: 'Yesterday, 19:42',
    paymentMethod: 'SEPA Direct Debit'
  },
  {
    id: 'tx_9838',
    invoice: 'INV-2026-0038',
    customerName: 'Solana Labs Fintech',
    customerEmail: 'ops@solanalabs.tech',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    plan: 'Custom AI',
    amount: 8900,
    status: 'completed',
    date: 'Nov 09, 2026',
    paymentMethod: 'ACH Direct •• 3311'
  },
  {
    id: 'tx_9837',
    invoice: 'INV-2026-0037',
    customerName: 'Vanguard Medical Imaging',
    customerEmail: 'admin@vanguardmed.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    plan: 'Growth Pro',
    amount: 4200,
    status: 'refunded',
    date: 'Nov 08, 2026',
    paymentMethod: 'Mastercard •• 6710'
  }
];

export const ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: 'act_1',
    user: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    action: 'activated cluster deployment',
    target: 'us-east-ai-gateway v3.4',
    timestamp: '8 minutes ago',
    type: 'deploy',
    severity: 'normal'
  },
  {
    id: 'act_2',
    user: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    action: 'completed enterprise audit check',
    target: 'SOC2 Type II Annual Attestation',
    timestamp: '42 minutes ago',
    type: 'security',
    severity: 'notice'
  },
  {
    id: 'act_3',
    user: 'Nexus AI Co-Pilot',
    avatar: '',
    action: 'auto-rebalanced inference workloads',
    target: 'Tokyo Edge PoP (+18% throughput)',
    timestamp: '2 hours ago',
    type: 'ai',
    severity: 'normal'
  },
  {
    id: 'act_4',
    user: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    action: 'provisioned multi-tenant seat license',
    target: 'Aether Robotics (250 seats)',
    timestamp: '4 hours ago',
    type: 'billing',
    severity: 'normal'
  }
];

export const SYSTEM_HEALTH_METRICS: SystemHealthMetric[] = [
  {
    title: 'Platform Uptime',
    percent: 99.98,
    metricLabel: 'SLA Status',
    metricValue: '99.98%',
    color: '#5C8271',
    subtext: '0 downtime incidents in 90 days'
  },
  {
    title: 'Inference Latency',
    percent: 88,
    metricLabel: 'P95 Latency',
    metricValue: '42ms',
    color: '#C86D51',
    subtext: 'Optimal global response window'
  },
  {
    title: 'Annual Target',
    percent: 78.4,
    metricLabel: 'ARR Target',
    metricValue: '$1.78M',
    color: '#D9822B',
    subtext: '$220k remaining for Q4 milestone'
  }
];
