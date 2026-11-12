import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { REVENUE_TIMEFRAME_DATA } from '../../data/mockData';

interface RevenueAnalyticsChartProps {
  timeframe: string;
}

// Custom Warm Glass Tooltip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomGlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 shadow-glass-lg border border-warm-200/90 bg-white/95 text-xs min-w-[170px]">
        <p className="font-bold text-warm-900 border-b border-warm-200/60 pb-1.5 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: { color?: string; name?: string; value?: number }, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-warm-600 capitalize">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-warm-900 tabular-nums">
                ${entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueAnalyticsChart: React.FC<RevenueAnalyticsChartProps> = ({ timeframe }) => {
  const [metricMode, setMetricMode] = useState<'all' | 'actual' | 'projection'>('all');
  const data = REVENUE_TIMEFRAME_DATA[timeframe] || REVENUE_TIMEFRAME_DATA['12M'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6"
    >
      {/* Header: Title, Metric Filter & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-warm-900">Revenue & Inflow Trajectory</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
              USD ($)
            </span>
          </div>
          <p className="text-xs text-warm-600 mt-0.5">
            Synchronized MRR performance benchmarked against historical baseline
          </p>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-0.5 rounded-lg bg-warm-200/60 border border-warm-300/50 text-xs">
            {(['all', 'actual', 'projection'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setMetricMode(mode)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                  metricMode === mode
                    ? 'bg-white text-warm-900 shadow-sm font-semibold'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Graph */}
      <div className="w-full h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              {/* Terracotta Gradient for Current Year */}
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C86D51" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C86D51" stopOpacity={0.0} />
              </linearGradient>

              {/* Warm Sand Gradient for Previous Year */}
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A39684" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#A39684" stopOpacity={0.0} />
              </linearGradient>

              {/* Amber Gradient for Projected */}
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D9822B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D9822B" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5DCCE" vertical={false} opacity={0.6} />

            <XAxis
              dataKey="period"
              stroke="#A39684"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E5DCCE' }}
            />
            <YAxis
              stroke="#A39684"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
            />

            <Tooltip content={<CustomGlassTooltip />} />

            {(metricMode === 'all' || metricMode === 'actual') && (
              <Area
                type="monotone"
                dataKey="previousYear"
                name="Prior Period"
                stroke="#A39684"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorPrevious)"
              />
            )}

            {(metricMode === 'all' || metricMode === 'projection') && (
              <Area
                type="monotone"
                dataKey="projected"
                name="Target Benchmark"
                stroke="#D9822B"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorProjected)"
              />
            )}

            {(metricMode === 'all' || metricMode === 'actual') && (
              <Area
                type="monotone"
                dataKey="currentYear"
                name="Actual Inflow"
                stroke="#C86D51"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCurrent)"
                activeDot={{ r: 6, fill: '#C86D51', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Aggregate Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-warm-200/60 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
            <span className="font-medium text-warm-700">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
            <span className="font-medium text-warm-700">Previous Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amberwarm-500 border border-amberwarm-600 border-dashed" />
            <span className="font-medium text-warm-700">Q4 Target Curve</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-warm-600 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-sage-600" />
          <span>Aggregate ARR: <strong className="text-warm-900">$1,779,360</strong></span>
        </div>
      </div>
    </motion.div>
  );
};
