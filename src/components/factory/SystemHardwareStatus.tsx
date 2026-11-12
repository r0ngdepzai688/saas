import React from 'react';
import { Database, Scale, Camera, Printer, Link2, HardDrive } from 'lucide-react';
import { SYSTEM_HARDWARE_STATUS } from '../../data/factoryMockData';

const HARDWARE_ICONS: Record<string, React.ElementType> = {
  database: Database,
  scale: Scale,
  camera: Camera,
  printer: Printer,
  link: Link2,
  'hard-drive': HardDrive,
};

export const SystemHardwareStatus: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          SYSTEM STATUS
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SYSTEM_HARDWARE_STATUS.map((item) => {
          const Icon = HARDWARE_ICONS[item.icon] || Database;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{item.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
