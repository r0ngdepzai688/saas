import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Factory,
  LineChart,
  BarChart3,
  Layers,
  Users2,
  ReceiptText,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'visual-playground', label: 'Analytics Playground', icon: FlaskConical, badge: 'Lab 2026' },
  { id: 'visual-analytics', label: 'Visual Analytics', icon: LineChart, badge: 'Workbench' },
  { id: 'factory-mes', label: 'FactoryCore MES', icon: Factory, badge: 'Plant Floor' },
  { id: 'overview', label: 'Executive Pulse', icon: LayoutDashboard },
  { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
  { id: 'workspaces', label: 'Active Clusters', icon: Layers, badge: 'Live' },
  { id: 'customers', label: 'Enterprises', icon: Users2 },
  { id: 'billing', label: 'Transactions & Audit', icon: ReceiptText },
  { id: 'ai-copilot', label: 'AI Intelligence', icon: Sparkles, badge: 'v3.2' },
  { id: 'settings', label: 'Platform Config', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
}) => {
  return (
    <motion.aside
      animate={{
        width: isCollapsed ? 82 : 270,
        transition: { type: 'spring', stiffness: 350, damping: 30 },
      }}
      className="glass-sidebar fixed top-0 left-0 bottom-0 z-40 flex flex-col justify-between py-6 px-3 border-r border-warm-200/60"
    >
      {/* Top Header / Branding */}
      <div>
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-terracotta-500 flex items-center justify-center text-white shadow-md shrink-0">
              <LineChart className="w-5 h-5 text-white/95" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  <span className="font-bold text-base text-warm-900 tracking-tight flex items-center gap-1.5">
                    NEXUS <span className="text-blue-600 font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">ANALYTICS</span>
                  </span>
                  <p className="text-[11px] text-warm-500 font-medium tracking-wide">Enterprise Graphic System</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-warm-600 hover:text-warm-900 hover:bg-warm-200/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-blue-900 font-bold'
                    : 'text-warm-700 hover:text-warm-950 hover:bg-warm-200/40'
                }`}
              >
                {/* Active Backdrop Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-white/95 border border-blue-200/80 rounded-xl shadow-glass-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 relative z-10 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-warm-500 group-hover:text-warm-800'
                  }`}
                />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="relative z-10 flex items-center justify-between w-full overflow-hidden whitespace-nowrap"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                            item.id === 'visual-analytics'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-warm-200 text-warm-800 border-warm-300/50'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Quota & User Profile */}
      <div className="space-y-4">
        {/* Storage / Capacity Card (Expanded only) */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="p-3.5 rounded-2xl bg-white/60 border border-warm-200/80 backdrop-blur-md shadow-glass-sm"
            >
              <div className="flex items-center justify-between text-xs text-warm-700 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  ECharts Telemetry Stream
                </span>
                <span className="font-semibold text-warm-900">100% 60 FPS</span>
              </div>
              <div className="w-full h-1.5 bg-warm-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-warm-500 mt-2">Canvas Hardware Acceleration</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/40 border border-warm-200/50 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            QA
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-warm-900">Dr. Alexis Vance</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] text-warm-500 truncate">Chief Analytics Architect</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
