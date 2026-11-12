import React from 'react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { FACTORY_ALERTS } from '../../data/factoryMockData';

export const FactoryAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          ALERTS
        </h3>
      </div>

      <div className="space-y-3">
        {FACTORY_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              {alert.level === 'warning' && (
                <div className="p-1 rounded bg-amber-100 text-amber-700 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
              {alert.level === 'critical' && (
                <div className="p-1 rounded bg-rose-100 text-rose-700 mt-0.5 animate-pulse">
                  <XCircle className="w-3.5 h-3.5" />
                </div>
              )}
              {alert.level === 'info' && (
                <div className="p-1 rounded bg-blue-100 text-blue-700 mt-0.5">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {alert.line} <span className="font-semibold text-slate-600">- {alert.title}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{alert.detail}</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">{alert.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 text-center border-t border-slate-100">
        <button
          onClick={() => alert('Opening full industrial alarm log')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          View All Alerts
        </button>
      </div>
    </div>
  );
};
