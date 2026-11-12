import React from 'react';
import { PRODUCTION_LINES } from '../../data/factoryMockData';

export const ProductionLineTable: React.FC = () => {
  const getOeeBarColor = (oee: number) => {
    if (oee >= 75) return 'bg-emerald-500';
    if (oee >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          PRODUCTION BY LINE
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2.5 px-3">Line</th>
              <th className="py-2.5 px-3">Good Output</th>
              <th className="py-2.5 px-3 w-40">OEE</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PRODUCTION_LINES.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-800">{item.line}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-700 tabular-nums">
                  {item.goodOutput > 0 ? item.goodOutput.toLocaleString() : '-'}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getOeeBarColor(item.oee)}`}
                        style={{ width: `${item.oee}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 text-[11px] tabular-nums w-10 text-right">
                      {item.oee > 0 ? `${item.oee}%` : '0%'}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1.5 font-semibold text-[11px] ${
                      item.status === 'Running' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'Running'
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-rose-500'
                      }`}
                    />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
