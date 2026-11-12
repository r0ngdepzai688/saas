import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { OUTPUT_DISTRIBUTION } from '../../data/factoryMockData';

export const OutputDistributionChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          OUTPUT DISTRIBUTION
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={OUTPUT_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="count"
              >
                {OUTPUT_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-sm font-black text-slate-800 leading-tight">58,320</span>
            <span className="text-[10px] font-semibold text-slate-500">Pairs</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 text-xs flex-1 w-full sm:w-auto">
          {OUTPUT_DISTRIBUTION.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 mr-1.5">{item.percent}%</span>
                <span className="text-[11px] text-slate-500 font-medium">({item.count.toLocaleString()})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
