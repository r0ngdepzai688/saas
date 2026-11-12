import React from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_FEED } from '../../data/mockData';
import { Rocket, ShieldCheck, Sparkles, CreditCard, User, History } from 'lucide-react';

const EVENT_ICONS = {
  deploy: Rocket,
  security: ShieldCheck,
  ai: Sparkles,
  billing: CreditCard,
  user: User,
};

export const ActivityTimeline: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-4 border-b border-warm-200/60 mb-4">
        <div>
          <h3 className="text-base font-bold text-warm-900">Autonomous Operations Log</h3>
          <p className="text-xs text-warm-600 mt-0.5">Immutable cluster audit & control stream</p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-warm-200/50 border border-warm-300/60 flex items-center justify-center text-warm-700 shadow-sm">
          <History className="w-4 h-4 text-terracotta-600" />
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-warm-200">
        {ACTIVITY_FEED.map((event) => {
          const Icon = EVENT_ICONS[event.type] || History;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-terracotta-500 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-terracotta-600" />
              </div>

              {/* Event Content Box */}
              <div className="p-3 rounded-xl bg-white/50 border border-warm-200/70 group-hover:bg-white/80 group-hover:border-terracotta-200 transition-all duration-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {event.avatar ? (
                      <img
                        src={event.avatar}
                        alt={event.user}
                        className="w-5 h-5 rounded-full object-cover border border-warm-200"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                        <Icon className="w-3 h-3" />
                      </div>
                    )}
                    <span className="font-semibold text-warm-900">{event.user}</span>
                  </div>
                  <span className="text-[10px] text-warm-500 font-medium">{event.timestamp}</span>
                </div>

                <p className="text-xs text-warm-700 mt-1.5">
                  <span className="text-warm-500">{event.action}</span>{' '}
                  <strong className="text-warm-900 font-semibold">{event.target}</strong>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 mt-2 border-t border-warm-200/60 text-center">
        <button
          onClick={() => alert('Full audit stream export generated.')}
          className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 hover:underline inline-flex items-center gap-1"
        >
          View complete SOC2 audit log →
        </button>
      </div>
    </motion.div>
  );
};
