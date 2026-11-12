import React from 'react';
import { RECENT_BATCHES } from '../../data/factoryMockData';

export const RecentBatchesTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-blue-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          RECENT BATCHES
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2.5 px-3">Batch No</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3">Size</th>
              <th className="py-2.5 px-3">Station</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {RECENT_BATCHES.map((batch) => (
              <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{batch.batchNo}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-700">{batch.product}</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">{batch.size}</td>
                <td className="py-2.5 px-3 font-medium text-slate-600">{batch.station}</td>
                <td className="py-2.5 px-3">{getStatusBadge(batch.status)}</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">{batch.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
