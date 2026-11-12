import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

interface ExecutiveHeroProps {
  onExploreInsights?: () => void;
}

export const ExecutiveHero: React.FC<ExecutiveHeroProps> = ({ onExploreInsights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 md:p-8 bg-gradient-to-br from-white/80 via-warm-50/70 to-warm-100/60 border border-warm-200/80 shadow-glass-md relative overflow-hidden"
    >
      {/* Subtle warm glow background gradient element */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-bl from-terracotta-200/40 via-amberwarm-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: AI Brief & Status */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="glass-badge bg-terracotta-100/80 text-terracotta-800 border-terracotta-200 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-terracotta-600" />
              Autonomous Co-Pilot Brief
            </span>
            <span className="text-xs text-warm-500 font-medium flex items-center gap-1">
              • Refreshed 3 mins ago
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-warm-900 tracking-tight leading-snug">
            Platform velocity is tracking <span className="text-terracotta-600 underline decoration-terracotta-300 underline-offset-4">+14.8%</span> above Q4 projections.
          </h2>

          <p className="text-warm-700 text-sm md:text-base mt-2.5 leading-relaxed font-normal">
            Enterprise workload consumption in EMEA and US-East scaled to record throughput. 
            Zero churn detected across top 20 accounts. AI recommendation: increase serverless allocation before tomorrow’s batch indexing cycle.
          </p>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-4 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-warm-200/80 text-xs font-medium text-warm-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-sage-600" />
              <span>SOC2 Type II Attested</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-warm-200/80 text-xs font-medium text-warm-800 shadow-sm">
              <Zap className="w-4 h-4 text-amberwarm-500" />
              <span>99.98% Latency SLA</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-warm-200/80 text-xs font-medium text-warm-800 shadow-sm">
              <TrendingUp className="w-4 h-4 text-terracotta-500" />
              <span>$148.2k Trailing MRR</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Recommendation Card */}
        <div className="lg:w-80 shrink-0">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-lg border border-warm-200/90 shadow-glass-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-warm-500">Suggested Action</span>
                <p className="text-xs font-semibold text-warm-900 mt-0.5">Optimize Cluster Auto-Scale</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
                +8.2% Margin
              </span>
            </div>
            
            <p className="text-[11px] text-warm-600 mt-2 mb-3 leading-normal">
              Activate dynamic node consolidation across idle staging clusters to reduce monthly cloud expenditure by ~$3,400.
            </p>

            <button
              onClick={onExploreInsights}
              className="w-full glass-btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 font-semibold text-terracotta-700 hover:text-terracotta-800 group"
            >
              <span>Review Optimization</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
