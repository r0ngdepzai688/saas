import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Repeat, Target } from 'lucide-react';
import type { KpiMetric } from '../../types/dashboard';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface KpiCardProps {
  metric: KpiMetric;
  index: number;
}

const CATEGORY_ICONS = {
  revenue: DollarSign,
  users: Users,
  retention: Repeat,
  conversion: Target,
};

export const KpiCard: React.FC<KpiCardProps> = ({ metric, index }) => {
  const Icon = CATEGORY_ICONS[metric.category] || DollarSign;
  const animatedValue = useAnimatedCounter(metric.value, { decimals: metric.decimals || 0 });

  // Generate SVG sparkline points
  const sparklineHeight = 32;
  const sparklineWidth = 80;
  const minVal = Math.min(...metric.sparkline);
  const maxVal = Math.max(...metric.sparkline);
  const range = maxVal - minVal || 1;

  const points = metric.sparkline
    .map((val, idx) => {
      const x = (idx / (metric.sparkline.length - 1)) * sparklineWidth;
      const y = sparklineHeight - ((val - minVal) / range) * (sparklineHeight - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
        scale: 1.015,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      className="glass-card glass-card-hover p-5 flex flex-col justify-between"
    >
      {/* Top Header: Title & Category Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-warm-600 tracking-wide">{metric.title}</span>
        <div className="w-8 h-8 rounded-xl bg-warm-200/50 border border-warm-300/60 flex items-center justify-center text-warm-700 shadow-sm">
          <Icon className="w-4 h-4 text-terracotta-600" />
        </div>
      </div>

      {/* Main KPI Number Display */}
      <div className="my-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight font-sans tabular-nums">
          {metric.prefix && <span className="text-warm-500 font-semibold mr-0.5">{metric.prefix}</span>}
          <span>{animatedValue}</span>
          {metric.suffix && <span className="text-warm-500 font-semibold ml-0.5">{metric.suffix}</span>}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="shrink-0 overflow-visible">
          <svg
            width={sparklineWidth}
            height={sparklineHeight}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.isPositive ? '#5C8271' : '#E27D60'} stopOpacity="0.4" />
                <stop offset="100%" stopColor={metric.isPositive ? '#5C8271' : '#E27D60'} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={metric.isPositive ? '#5C8271' : '#E27D60'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Footer: Delta Badge & Timeframe */}
      <div className="flex items-center gap-2 pt-2 border-t border-warm-200/50 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full text-[11px] ${
            metric.isPositive
              ? 'bg-sage-100 text-sage-800 border border-sage-200'
              : 'bg-coral-100 text-coral-800 border border-coral-200'
          }`}
        >
          {metric.isPositive ? (
            <TrendingUp className="w-3 h-3 text-sage-600" />
          ) : (
            <TrendingDown className="w-3 h-3 text-coral-600" />
          )}
          {metric.isPositive ? '+' : ''}{metric.changePercent}%
        </span>
        <span className="text-warm-500 text-[11px] font-medium">{metric.timeframe}</span>
      </div>
    </motion.div>
  );
};
