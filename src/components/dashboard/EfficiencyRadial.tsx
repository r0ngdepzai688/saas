import React from 'react';
import { motion } from 'framer-motion';
import { SYSTEM_HEALTH_METRICS } from '../../data/mockData';
import { Activity, Cpu } from 'lucide-react';

interface CircularRingProps {
  percent: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const CircularRing: React.FC<CircularRingProps> = ({
  percent,
  color,
  size = 76,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5DCCE"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.45}
        />
        {/* Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className="absolute font-bold text-xs text-warm-900 tabular-nums">
        {percent}%
      </span>
    </div>
  );
};

export const EfficiencyRadial: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-4 border-b border-warm-200/60">
        <div>
          <h3 className="text-base font-bold text-warm-900">Autonomous Health Matrix</h3>
          <p className="text-xs text-warm-600 mt-0.5">Real-time infrastructure reliability & SLA status</p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-sage-100 border border-sage-200/80 flex items-center justify-center text-sage-700 shadow-sm">
          <Activity className="w-4 h-4 text-sage-600" />
        </span>
      </div>

      <div className="space-y-4 py-4">
        {SYSTEM_HEALTH_METRICS.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-warm-200/60 hover:bg-white/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <CircularRing percent={item.percent} color={item.color} />
              <div>
                <p className="text-xs font-bold text-warm-900">{item.title}</p>
                <p className="text-[11px] text-warm-600 mt-0.5 font-medium">{item.subtext}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">
                    {item.metricLabel}:
                  </span>
                  <span className="text-xs font-semibold text-warm-800 tabular-nums">
                    {item.metricValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="p-3 rounded-xl bg-warm-100/80 border border-warm-200 flex items-center gap-2.5 text-xs text-warm-700">
          <Cpu className="w-4 h-4 text-terracotta-500 shrink-0" />
          <span>Next scheduled synthetic integrity probe in <strong>14 minutes</strong>.</span>
        </div>
      </div>
    </motion.div>
  );
};
