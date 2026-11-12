import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Check,
  X,
  Gauge,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { FactoryKpi } from '../../types/factory';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface FactoryKpiCardProps {
  kpi: FactoryKpi;
  index: number;
}

const ICONS = {
  production: BarChart2,
  good: Check,
  reject: X,
  oee: Gauge,
  downtime: Clock,
};

export const FactoryKpiCard: React.FC<FactoryKpiCardProps> = ({ kpi, index }) => {
  const Icon = ICONS[kpi.type] || BarChart2;
  const animatedValue = useAnimatedCounter(kpi.value, { decimals: kpi.type === 'oee' ? 1 : 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_3px_10px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between"
    >
      {/* Top Header: Title & Colored Soft UI Icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {kpi.title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
          style={{ backgroundColor: kpi.color }}
        >
          <Icon className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Main KPI Number */}
      <div className="my-2">
        <div className="text-2xl font-black text-slate-800 tracking-tight font-sans tabular-nums">
          {animatedValue}
        </div>
        <span className="text-xs font-semibold text-slate-500">{kpi.unit}</span>
      </div>

      {/* Footer Delta */}
      <div className="flex items-center gap-1.5 text-xs font-medium pt-1.5 border-t border-slate-100">
        <span
          className={`inline-flex items-center text-[11px] font-bold ${
            kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {kpi.changePercent >= 0 ? (
            <ArrowUp className="w-3 h-3 stroke-[2.5] mr-0.5" />
          ) : (
            <ArrowDown className="w-3 h-3 stroke-[2.5] mr-0.5" />
          )}
          {Math.abs(kpi.changePercent)}%
        </span>
        <span className="text-slate-400 text-[11px]">{kpi.timeframe}</span>
      </div>
    </motion.div>
  );
};
