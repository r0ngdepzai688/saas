import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ExecutiveHero } from './components/dashboard/ExecutiveHero';
import { KpiCard } from './components/dashboard/KpiCard';
import { RevenueAnalyticsChart } from './components/dashboard/RevenueAnalyticsChart';
import { EfficiencyRadial } from './components/dashboard/EfficiencyRadial';
import { TransactionTable } from './components/dashboard/TransactionTable';
import { ActivityTimeline } from './components/dashboard/ActivityTimeline';
import { FactoryDashboardView } from './components/factory/FactoryDashboardView';
import { VisualAnalyticsWorkbench } from './visualization/views/VisualAnalyticsWorkbench';
import { VisualAnalyticsPlayground } from './visualization/playground/VisualAnalyticsPlayground';
import { KPI_METRICS } from './data/mockData';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('visual-playground'); // Default to newly built 2026 Visual Analytics Playground
  const [timeframe, setTimeframe] = useState('30D');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleExport = () => {
    showToast(
      activeTab === 'visual-playground'
        ? 'Playground experimental configuration & chart graphics exported (PNG/JSON/CSV).'
        : activeTab === 'visual-analytics'
        ? 'Enterprise statistical quality audit exported successfully (CSV/PNG).'
        : activeTab === 'factory-mes'
        ? 'Shift production report compiled & synced with MES Server.'
        : 'Executive briefing dossier compiled & ready for review.'
    );
  };

  return (
    <div className="min-h-screen bg-warm-100/50 flex">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 glass-card px-4 py-3 bg-white/95 border border-indigo-300 shadow-glass-lg flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold text-warm-900">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-warm-400 hover:text-warm-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: isSidebarCollapsed ? 82 : 270,
        }}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={handleExport}
        />

        {/* Dashboard Body */}
        <main className="p-5 md:p-7 space-y-6 max-w-[1600px] w-full mx-auto">
          {activeTab === 'visual-playground' ? (
            /* ENTERPRISE VISUAL ANALYTICS PLAYGROUND 2026 */
            <VisualAnalyticsPlayground />
          ) : activeTab === 'visual-analytics' ? (
            /* ENTERPRISE VISUAL ANALYTICS & GRAPHIC SYSTEM 2026 */
            <VisualAnalyticsWorkbench />
          ) : activeTab === 'factory-mes' ? (
            /* FACTORYCORE MES PRO VIEW (HYBRID: GLASS NAV + SOFT UI KPI + FLAT TABLES) */
            <FactoryDashboardView />
          ) : (
            /* EXECUTIVE SAAS VIEW */
            <div className="space-y-8">
              {/* Hero Section */}
              <section>
                <ExecutiveHero
                  onExploreInsights={() =>
                    showToast('Cluster node auto-scale profile queued for synchronization.')
                  }
                />
              </section>

              {/* KPI Cards Grid */}
              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-warm-600">
                    Core Performance Benchmarks
                  </h3>
                  <span className="text-xs text-warm-500 font-medium">Real-time telemetry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {KPI_METRICS.map((metric, index) => (
                    <KpiCard key={metric.id} metric={metric} index={index} />
                  ))}
                </div>
              </section>

              {/* Analytics & System Health Row */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RevenueAnalyticsChart timeframe={timeframe} />
                </div>
                <div className="lg:col-span-1">
                  <EfficiencyRadial />
                </div>
              </section>

              {/* Operational Ledger & Activity Feed Row */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionTable searchFilter={searchQuery} />
                </div>
                <div className="lg:col-span-1">
                  <ActivityTimeline />
                </div>
              </section>
            </div>
          )}

          {/* Executive Footer */}
          <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {activeTab === 'visual-analytics'
                  ? 'Enterprise Visual Analytics & Graphic System 2026 • Apache ECharts 6.1 Engine'
                  : activeTab === 'factory-mes'
                  ? 'FactoryCore MES Pro • Big Step Technology v1.0.0'
                  : 'Nexus Intelligence Engine • Warm Glassmorphism v2026.4'}
              </span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <span>Renderer: Hardware Canvas</span>
              <span>•</span>
              <span>Quality Norm: ISO 9001 / Six Sigma</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
