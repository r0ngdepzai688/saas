import React from 'react';
import { TOP_REJECT_REASONS } from '../../data/factoryMockData';

export const TopRejectReasons: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          TOP REJECT REASONS
        </h3>
      </div>

      <div className="space-y-3.5">
        {TOP_REJECT_REASONS.map((item) => (
          <div key={item.id} className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700 w-24 truncate">{item.reason}</span>
              <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(item.percent / 30) * 100}%` }}
                />
              </div>
              <span className="font-bold text-slate-800 tabular-nums text-right w-24">
                {item.count.toLocaleString()} <span className="text-slate-400 font-normal">({item.percent}%)</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
