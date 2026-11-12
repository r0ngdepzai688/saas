import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PRODUCTION_TREND_7D } from '../../data/factoryMockData';

// Custom Flat Tooltip for Industrial Monitor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlatIndustrialTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-700">
        <p className="font-semibold text-slate-300">{label}</p>
        <p className="text-sm font-bold text-blue-400 mt-0.5">
          {payload[0].value?.toLocaleString()} Pairs
        </p>
      </div>
    );
  }
  return null;
};

export const ProductionTrendChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          PRODUCTION OUTPUT TREND (7 DAYS)
        </h3>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={PRODUCTION_TREND_7D}
            margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 80000]}
              ticks={[0, 20000, 40000, 60000, 80000]}
              tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
            />
            <Tooltip content={<FlatIndustrialTooltip />} />
            <Line
              type="linear"
              dataKey="output"
              name="Good Output"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 4, fill: '#2563EB', strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1D4ED8' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        <span>Good Output (Pairs)</span>
      </div>
    </div>
  );
};
