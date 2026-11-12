import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartContainer } from '../components/ChartContainer';
import { SpcControlChart } from '../charts/quality/SpcControlChart';
import { ParetoChart8020 } from '../charts/quality/ParetoChart8020';
import { CapabilityHistogram } from '../charts/quality/CapabilityHistogram';
import { DefectHeatmap } from '../charts/quality/DefectHeatmap';
import { KpiBulletChart } from '../charts/performance/KpiBulletChart';
import { WaterfallChart } from '../charts/performance/WaterfallChart';
import { WorkflowSankey } from '../charts/operational/WorkflowSankey';
import { OperationalTreemap } from '../charts/operational/OperationalTreemap';
import { QualityRadarChart } from '../charts/advanced/QualityRadarChart';
import { ComboTrendChart } from '../charts/advanced/ComboTrendChart';

import {
  SPC_MEASUREMENT_DATA,
  PARETO_DEFECT_DATA,
  CAPABILITY_SAMPLE_DATA,
  HEATMAP_STATIONS,
  HEATMAP_DEFECTS,
  HEATMAP_MATRIX_DATA,
  BULLET_KPI_DATA,
  WATERFALL_STEPS,
  SANKEY_NODES,
  SANKEY_LINKS,
  TREEMAP_DATA,
  RADAR_INDICATORS,
  RADAR_SERIES,
  COMBO_TREND_DATA,
} from '../data/analyticsSeedData';

import {
  ShieldAlert,
  Gauge,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const VisualAnalyticsWorkbench: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'quality' | 'performance' | 'operational' | 'advanced'>('quality');
  const [timeframe, setTimeframe] = useState('30D');

  const downloadMockCsv = (filename: string) => {
    alert(`Exporting high-precision statistical dataset: ${filename}.csv`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Category Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'quality', label: 'Quality & Defect Analytics', icon: ShieldAlert, badge: 'SPC & Cp/Cpk' },
            { id: 'performance', label: 'Performance & KPI', icon: Gauge, badge: 'Waterfall & Bullet' },
            { id: 'operational', label: 'Operational Monitoring', icon: Activity, badge: 'Sankey & Treemap' },
            { id: 'advanced', label: 'Advanced Comparison', icon: Layers, badge: 'Radar & Combo' },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>ECharts 6.1 Graphic Engine Active</span>
        </div>
      </div>

      {/* CATEGORY 1: QUALITY & DEFECT ANALYTICS */}
      {activeCategory === 'quality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. SPC Control Chart */}
            <ChartContainer
              title="Statistical Process Control (SPC) - Critical Dimension"
              subtitle="Individual (I-MR) chart with computed 3-sigma control limits & Nelson Rule 1 detection"
              chartTypeBadge="SPC Control Chart"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onExportCsv={() => downloadMockCsv('SPC_Critical_Dimension_Lot_Data')}
              analyticalSummary={{
                current: '10.01 mm',
                target: '10.00 mm',
                variance: '+0.01 mm',
                trendPositive: true,
                anomalyNote: 'Lot 109 breached UCL limit (+3σ violation)',
              }}
            >
              <SpcControlChart
                data={SPC_MEASUREMENT_DATA}
                metricName="Glove Thickness"
                unit="mm"
                usl={10.50}
                lsl={9.50}
                target={10.00}
                height={300}
              />
            </ChartContainer>

            {/* 2. Pareto 80/20 Analysis */}
            <ChartContainer
              title="Pareto Defect Root Cause Distribution"
              subtitle="Dual-axis Pareto analysis isolating 20% root causes generating 80% total scrap"
              chartTypeBadge="Pareto 80/20"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onExportCsv={() => downloadMockCsv('Pareto_Defect_Distribution')}
              analyticalSummary={{
                current: '5,475 Defects',
                target: '< 3,000 Defects',
                variance: '+2,475 Over Limit',
                trendPositive: false,
                anomalyNote: 'Pin Hole + Thin Layer drive 68% of failures',
              }}
            >
              <ParetoChart8020 data={PARETO_DEFECT_DATA} height={300} thresholdPercent={80} />
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Capability Histogram with Cp/Cpk */}
            <ChartContainer
              title="Process Capability Histogram (Cp & Cpk Analysis)"
              subtitle="Gaussian normal distribution curve benchmarked against engineering tolerances"
              chartTypeBadge="Capability Cp/Cpk"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onExportCsv={() => downloadMockCsv('Process_Capability_Histogram')}
            >
              <CapabilityHistogram
                data={CAPABILITY_SAMPLE_DATA}
                usl={10.35}
                lsl={9.65}
                binCount={12}
                unit="mm"
                height={270}
              />
            </ChartContainer>

            {/* 4. Defect Heatmap Matrix */}
            <ChartContainer
              title="Plant Defect Concentration Heatmap"
              subtitle="Cross-station spatial clustering highlighting vulnerable manufacturing stages"
              chartTypeBadge="Spatial Heatmap"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onExportCsv={() => downloadMockCsv('Defect_Concentration_Heatmap')}
              analyticalSummary={{
                current: 'Hotspot: Dipping Line 2',
                anomalyNote: 'Pin Hole concentration at 520 incidents',
              }}
            >
              <DefectHeatmap
                stations={HEATMAP_STATIONS}
                defectTypes={HEATMAP_DEFECTS}
                matrixData={HEATMAP_MATRIX_DATA}
                height={270}
              />
            </ChartContainer>
          </div>
        </div>
      )}

      {/* CATEGORY 2: PERFORMANCE & KPI */}
      {activeCategory === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Bullet Chart */}
          <ChartContainer
            title="Line OEE & Quality Target vs Actual (Bullet Chart)"
            subtitle="Evaluating actual performance against target benchmarks across qualitative bands"
            chartTypeBadge="Bullet KPI"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('OEE_Bullet_Benchmarks')}
            analyticalSummary={{
              current: 'Line 1: 82.1%',
              target: '80.0%',
              variance: '+2.1% Ahead',
              trendPositive: true,
            }}
          >
            <KpiBulletChart items={BULLET_KPI_DATA} height={320} unit="%" />
          </ChartContainer>

          {/* Production Loss Waterfall Walk */}
          <ChartContainer
            title="Production Loss Walk (Gross to Net Yield Waterfall)"
            subtitle="Step-by-step accounting of scheduled output deductions from downtime to defect scrap"
            chartTypeBadge="Waterfall Walk"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('Production_Loss_Waterfall')}
            analyticalSummary={{
              current: '56,075 Pairs',
              target: '60,000 Pairs',
              variance: '-3,925 Loss',
              trendPositive: false,
              anomalyNote: 'Defects caused greatest single deduction (-5,475)',
            }}
          >
            <WaterfallChart steps={WATERFALL_STEPS} height={320} unit="Pairs" />
          </ChartContainer>
        </div>
      )}

      {/* CATEGORY 3: OPERATIONAL MONITORING */}
      {activeCategory === 'operational' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflow Sankey Flow */}
          <ChartContainer
            title="Batch Material Flow & Scrap Diversion (Sankey)"
            subtitle="End-to-end visualization of work-in-progress batch movement, rework loops, and scrap loss"
            chartTypeBadge="Workflow Sankey"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('Workflow_Sankey_Flow')}
            analyticalSummary={{
              current: '52,845 Passed Final QA',
              target: '65,000 Raw Input',
              variance: '81.3% First Pass Yield',
              trendPositive: true,
            }}
          >
            <WorkflowSankey nodes={SANKEY_NODES} links={SANKEY_LINKS} height={340} />
          </ChartContainer>

          {/* Operational Loss Treemap */}
          <ChartContainer
            title="Hierarchical Defect Tree (Treemap)"
            subtitle="Proportional loss distribution grouped by Plant, Production Line, and Root Cause"
            chartTypeBadge="Treemap"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('Defect_Treemap_Hierarchy')}
            analyticalSummary={{
              current: 'Line 3: 2,805 Defects (51.2%)',
              anomalyNote: 'Line 3 requires immediate die alignment',
            }}
          >
            <OperationalTreemap data={TREEMAP_DATA} height={340} />
          </ChartContainer>
        </div>
      )}

      {/* CATEGORY 4: ADVANCED COMPARISON */}
      {activeCategory === 'advanced' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quality Radar Benchmark */}
          <ChartContainer
            title="Multi-Dimensional Quality Capability Radar"
            subtitle="Benchmarking precision, yield, cycle time, compliance, and MTBF against target baseline"
            chartTypeBadge="Radar Benchmark"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('Quality_Radar_Benchmark')}
            analyticalSummary={{
              current: 'Line 1 Index: 86.0',
              target: '90.0 Target',
              variance: '-4.0 Pts',
              trendPositive: true,
            }}
          >
            <QualityRadarChart
              indicators={RADAR_INDICATORS}
              series={RADAR_SERIES}
              height={330}
            />
          </ChartContainer>

          {/* Volume vs Defect Rate Combo Chart */}
          <ChartContainer
            title="Volume Throughput vs Defect Rate Correlation (Combo)"
            subtitle="Dual-axis analysis investigating whether increased throughput compromises quality yield"
            chartTypeBadge="Combo Trend"
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExportCsv={() => downloadMockCsv('Volume_Defect_Correlation_Combo')}
            analyticalSummary={{
              current: 'Defect Rate: 1.9%',
              target: '1.5% Target',
              variance: '-1.5% Improvement over Q3',
              trendPositive: true,
              anomalyNote: 'Negative correlation achieved (Quality maintained)',
            }}
          >
            <ComboTrendChart data={COMBO_TREND_DATA} height={330} />
          </ChartContainer>
        </div>
      )}
    </motion.div>
  );
};
