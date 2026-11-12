import React, { useState, useMemo } from 'react';
import { PLAYGROUND_CHART_REGISTRY } from '../registry/playgroundRegistry';
import type { ChartCategory } from '../types';
import {
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ChartGalleryProps {
  selectedChartId: string;
  onSelectChart: (chartId: string) => void;
}

const CATEGORIES: { id: ChartCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'kpi', label: 'KPI & Performance' },
  { id: 'quality', label: 'Quality & Defect' },
  { id: 'spc', label: 'SPC & Process Control' },
  { id: 'monitoring', label: 'Monitoring & Ops' },
  { id: 'distribution', label: 'Distribution & Specs' },
  { id: 'advanced', label: 'Advanced Analytics' },
];

export const ChartGallery: React.FC<ChartGalleryProps> = ({
  selectedChartId,
  onSelectChart,
}) => {
  const [activeCategory, setActiveCategory] = useState<ChartCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const charts = useMemo(() => Object.values(PLAYGROUND_CHART_REGISTRY), []);

  const filteredCharts = useMemo(() => {
    return charts.filter((chart) => {
      const matchCategory = activeCategory === 'all' || chart.category === activeCategory;
      const matchQuery =
        !searchQuery ||
        chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chart.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chart.businessUseCase.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [charts, activeCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Control Header: Search, Category Filters, View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chart archetypes by name, use case, or math..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-warm-50/70 dark:bg-slate-800 border border-warm-200/60 dark:border-slate-700 text-warm-900 dark:text-slate-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* View Mode Toggle & Registry Count */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-warm-500 dark:text-slate-400">
            {filteredCharts.length} of {charts.length} Archetypes
          </span>

          <div className="flex items-center bg-warm-100 dark:bg-slate-800 p-0.5 rounded-lg border border-warm-200/60 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-warm-500 hover:text-warm-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-warm-500 hover:text-warm-800'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-slate-800/80 text-warm-600 dark:text-slate-300 border border-warm-200/60 dark:border-slate-700 hover:bg-warm-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Render: Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharts.map((chart) => {
            const isSelected = selectedChartId === chart.id;
            return (
              <div
                key={chart.id}
                onClick={() => onSelectChart(chart.id)}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-2 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/85 dark:bg-slate-900/80 border border-warm-200/80 dark:border-slate-800 hover:border-warm-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 border border-warm-200/60 dark:border-slate-700">
                      {chart.categoryLabel}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        chart.complexity === 'High'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          : chart.complexity === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {chart.complexity} Complexity
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-warm-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    {chart.name}
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </h4>
                  <p className="text-xs text-warm-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {chart.description}
                  </p>

                  {/* Use Case Box */}
                  <div className="mt-3 p-2.5 rounded-xl bg-warm-50 dark:bg-slate-800/60 border border-warm-200/50 dark:border-slate-700/60">
                    <div className="flex items-start gap-1.5 text-[11px] text-warm-700 dark:text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-warm-900 dark:text-slate-200">Use Case: </span>
                        <span>{chart.businessUseCase}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Data Requirements */}
                <div className="mt-3 pt-3 border-t border-warm-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-warm-500 dark:text-slate-400">
                  <span className="truncate max-w-[190px]">
                    {chart.dataRequirements[0]}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="divide-y divide-warm-200/70 dark:divide-slate-800 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-warm-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          {filteredCharts.map((chart) => {
            const isSelected = selectedChartId === chart.id;
            return (
              <div
                key={chart.id}
                onClick={() => onSelectChart(chart.id)}
                className={`p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-l-4 border-blue-600'
                    : 'hover:bg-warm-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-warm-900 dark:text-slate-100">
                      {chart.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-warm-100 dark:bg-slate-800 text-warm-600 dark:text-slate-400">
                      {chart.categoryLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-warm-400">
                      • {chart.complexity}
                    </span>
                  </div>
                  <p className="text-[11px] text-warm-500 dark:text-slate-400 truncate mt-0.5">
                    {chart.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-[11px] text-warm-600 dark:text-slate-400 italic hidden sm:inline">
                    {chart.businessUseCase.slice(0, 48)}...
                  </span>
                  <button
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-warm-100 dark:bg-slate-800 text-warm-700 dark:text-slate-300 hover:bg-warm-200'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
