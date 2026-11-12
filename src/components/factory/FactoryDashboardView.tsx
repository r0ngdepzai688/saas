import React from 'react';
import { motion } from 'framer-motion';
import { FactoryKpiCard } from './FactoryKpiCard';
import { ProductionTrendChart } from './ProductionTrendChart';
import { ProductionLineTable } from './ProductionLineTable';
import { OutputDistributionChart } from './OutputDistributionChart';
import { TopRejectReasons } from './TopRejectReasons';
import { FactoryAlerts } from './FactoryAlerts';
import { RecentBatchesTable } from './RecentBatchesTable';
import { SystemHardwareStatus } from './SystemHardwareStatus';
import { FACTORY_KPIS } from '../../data/factoryMockData';

export const FactoryDashboardView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* 1. TOP 5 KPI CARDS (SOFT UI) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FACTORY_KPIS.map((kpi, idx) => (
          <FactoryKpiCard key={kpi.id} kpi={kpi} index={idx} />
        ))}
      </section>

      {/* 2. PRODUCTION TREND & PRODUCTION BY LINE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <ProductionTrendChart />
        </div>
        <div className="lg:col-span-5">
          <ProductionLineTable />
        </div>
      </section>

      {/* 3. DISTRIBUTION, REJECT REASONS, ALERTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <OutputDistributionChart />
        </div>
        <div className="lg:col-span-4">
          <TopRejectReasons />
        </div>
        <div className="lg:col-span-4 md:col-span-2">
          <FactoryAlerts />
        </div>
      </section>

      {/* 4. RECENT BATCHES & HARDWARE STATUS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <RecentBatchesTable />
        </div>
        <div className="lg:col-span-5">
          <SystemHardwareStatus />
        </div>
      </section>
    </motion.div>
  );
};
