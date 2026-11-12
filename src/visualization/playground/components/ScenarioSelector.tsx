import React, { useState } from 'react';
import { SCENARIO_DATASETS } from '../scenarios/scenarioDatasets';
import type { ScenarioGroup, ScenarioDataset } from '../types';
import {
  Database,
  Calendar,
  Table,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Gauge,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';

interface ScenarioSelectorProps {
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  selectedTimeframe: string;
  onSelectTimeframe: (timeframe: string) => void;
}

const GROUPS: { id: ScenarioGroup | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Scenarios', icon: Database },
  { id: 'qa', label: 'QA / Quality', icon: ShieldAlert },
  { id: 'kpi', label: 'KPI / Performance', icon: Gauge },
  { id: 'monitoring', label: 'Monitoring / Ops', icon: Activity },
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedDatasetId,
  onSelectDataset,
  selectedTimeframe,
  onSelectTimeframe,
}) => {
  const [activeGroup, setActiveGroup] = useState<ScenarioGroup | 'all'>('all');
  const [showTablePreview, setShowTablePreview] = useState(false);

  const activeDataset: ScenarioDataset =
    SCENARIO_DATASETS[selectedDatasetId] || SCENARIO_DATASETS['qa-defect-pareto'];

  const filteredDatasets = Object.values(SCENARIO_DATASETS).filter(
    (ds) => activeGroup === 'all' || ds.group === activeGroup
  );

  // Extract tabular rows for preview
  const previewRows = Array.isArray(activeDataset.data)
    ? activeDataset.data.slice(0, 6)
    : Array.isArray(activeDataset.data?.samples)
    ? activeDataset.data.samples.slice(0, 6)
    : Array.isArray(activeDataset.data?.values)
    ? activeDataset.data.values.slice(0, 10).map((v: number, i: number) => ({ index: i + 1, measurement: v }))
    : [];

  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header: Title & Scenario Groups */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200/60 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Data Scenario Selector
          </h3>
          <p className="text-[11px] text-warm-500 dark:text-slate-400">
            Select authentic industrial scenarios to stress-test chart calculations & visual states.
          </p>
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1 bg-warm-100 dark:bg-slate-800 p-1 rounded-xl">
          {GROUPS.map((grp) => {
            const Icon = grp.icon;
            const isActive = activeGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setActiveGroup(grp.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{grp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Picker Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {filteredDatasets.map((ds) => {
          const isSelected = selectedDatasetId === ds.id;
          return (
            <button
              key={ds.id}
              onClick={() => {
                onSelectDataset(ds.id);
                onSelectTimeframe(ds.defaultTimeframe);
              }}
              className={`p-3 rounded-xl text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border-2 border-blue-600 shadow-xs'
                  : 'bg-warm-50/70 dark:bg-slate-800/60 border border-warm-200/60 dark:border-slate-700 hover:bg-warm-100 dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-warm-500 dark:text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider">{ds.groupLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </div>
                <div className="text-xs font-bold text-warm-900 dark:text-slate-100 line-clamp-1">
                  {ds.name}
                </div>
              </div>
              <div className="text-[10px] text-warm-400 dark:text-slate-500 mt-2">
                {ds.fields.length} schema fields • {ds.timeframeOptions[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Dataset Inspection Bar */}
      <div className="p-3.5 rounded-xl bg-warm-50/80 dark:bg-slate-800/80 border border-warm-200/70 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-warm-900 dark:text-slate-100">
              Active Scenario: {activeDataset.name}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Synthetic Sample
            </span>
          </div>
          <p className="text-[11px] text-warm-600 dark:text-slate-400">
            {activeDataset.description}
          </p>
          <div className="text-[10px] text-warm-400 dark:text-slate-500 italic">
            Notice: {activeDataset.syntheticNotice}
          </div>
        </div>

        {/* Timeframe Filter & Table Preview Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-warm-200/80 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-warm-400 ml-1.5" />
            {activeDataset.timeframeOptions.map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-warm-600 dark:text-slate-400 hover:text-warm-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTablePreview(!showTablePreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-warm-200/80 dark:border-slate-700 text-warm-700 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-800 transition-all shadow-xs"
          >
            <Table className="w-3.5 h-3.5 text-blue-500" />
            <span>Data Table</span>
            {showTablePreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Data Preview Table */}
      {showTablePreview && (
        <div className="rounded-xl border border-warm-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
          <div className="p-2.5 bg-warm-100/70 dark:bg-slate-900 border-b border-warm-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-warm-800 dark:text-slate-200 flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              Underlying Tabular Dataset Records ({previewRows.length} sample rows shown)
            </span>
            <span className="text-[11px] text-warm-500 dark:text-slate-400">
              Schema: {activeDataset.fields.map((f) => f.name).join(', ')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 dark:bg-slate-900/60 text-warm-600 dark:text-slate-400 border-b border-warm-200/60 dark:border-slate-800">
                <tr>
                  {activeDataset.fields.map((field) => (
                    <th key={field.name} className="px-3.5 py-2 font-semibold">
                      {field.name}
                      <span className="ml-1 text-[9px] text-warm-400 font-mono">({field.type})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-slate-800/80 text-warm-800 dark:text-slate-200">
                {previewRows.map((row: any, rIdx: number) => (
                  <tr key={rIdx} className="hover:bg-warm-50/50 dark:hover:bg-slate-900/40">
                    {activeDataset.fields.map((field) => (
                      <td key={field.name} className="px-3.5 py-2 font-mono text-[11px]">
                        {typeof row[field.name] === 'number'
                          ? row[field.name].toLocaleString()
                          : String(row[field.name] ?? row[field.name.toLowerCase()] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
