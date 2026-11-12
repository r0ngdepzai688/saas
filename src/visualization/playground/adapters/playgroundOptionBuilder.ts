import type { EChartsOption } from 'echarts';
import { SCENARIO_DATASETS } from '../scenarios/scenarioDatasets';
import { PLAYGROUND_THEMES } from '../themes/playgroundThemes';
import type { ConfigOverrides, ThemeId } from '../types';
import { calculateSpcLimits, calculateProcessCapability } from '../../utils/statisticalUtils';

export interface SuitabilityResult {
  suitable: boolean;
  score: 'optimal' | 'compatible' | 'unsuitable';
  reason: string;
  recommendation?: string;
}

/**
 * Checks whether a chart type is analytically valid for a given dataset scenario
 */
export function checkChartSuitability(chartId: string, datasetId: string): SuitabilityResult {
  const dataset = SCENARIO_DATASETS[datasetId];
  if (!dataset) {
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Dataset not found in registry.',
    };
  }

  // 1. SPC requires continuous sequential samples
  if (chartId === 'spc') {
    if (datasetId === 'qa-spc-measurement') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Continuous time-ordered measurement data with rational limits.',
      };
    }
    if (datasetId === 'qa-capability-distribution') {
      return {
        suitable: true,
        score: 'compatible',
        reason: 'Compatible: Continuous sample values can be analyzed as an I-MR run sequence.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: SPC requires sequential continuous variable telemetry. Categorical counts or aggregated milestones cannot be modeled with Shewhart limits.',
      recommendation: 'Use Pareto for defect categories or Bullet chart for KPI benchmarks.',
    };
  }

  // 2. Capability Histogram requires continuous measurement array with USL/LSL
  if (chartId === 'capability') {
    if (datasetId === 'qa-capability-distribution' || datasetId === 'qa-spc-measurement') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Continuous sample values conforming to normal distribution with USL/LSL specs.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Process capability (Cp/Cpk) requires continuous dimensional variables with specification limits. Discrete counts cannot fit a Gaussian curve.',
      recommendation: 'Use Pareto for discrete counts or Waterfall for capacity reconciliation.',
    };
  }

  // 3. Sankey requires directed source-target-value flow pairs
  if (chartId === 'sankey') {
    if (datasetId === 'ops-material-sankey') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Directed network graph representing mass balance across stations.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Sankey requires a directed multi-stage flow graph with source, target, and volume conservation. 1D or 2D tables lack topological routing.',
      recommendation: 'Use Treemap for hierarchical proportions or Waterfall for step transitions.',
    };
  }

  // 4. Treemap requires hierarchical nested nodes or multi-level categories
  if (chartId === 'treemap') {
    if (datasetId === 'ops-defect-treemap' || datasetId === 'qa-defect-pareto') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Hierarchical or categorical proportions displaying scrap loss distribution.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Treemap requires part-to-whole categorical proportions. Time series or continuous limits cannot be expressed as nested tiles.',
      recommendation: 'Use Bar chart for discrete series or Line chart for chronological trends.',
    };
  }

  // 5. Heatmap requires 2D matrix
  if (chartId === 'defectHeatmap') {
    if (datasetId === 'qa-station-matrix') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: 2D cross-tabulation matrix (Line vs Station).',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Heatmap requires a 2D Cartesian cross-tabulation matrix. Single-dimension lists lack the secondary coordinate axis.',
      recommendation: 'Use Bar chart or Small Multiples.',
    };
  }

  // 6. Radar requires multi-dimensional indicators
  if (chartId === 'radar') {
    if (datasetId === 'ops-supplier-radar' || datasetId === 'kpi-bullet-dimensions') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Orthogonal normalized evaluation dimensions.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Radar charts require 5–7 orthogonal normalized metrics. Chronological time series produce unreadable, distorted star webs.',
      recommendation: 'Use Line chart or Combo Trend.',
    };
  }

  // 7. Waterfall requires sequential steps with start/end total
  if (chartId === 'waterfall') {
    if (datasetId === 'kpi-production-waterfall') {
      return {
        suitable: true,
        score: 'optimal',
        reason: 'Optimal: Sequential accretive and deductive capacity steps.',
      };
    }
    return {
      suitable: false,
      score: 'unsuitable',
      reason: 'Unsuitable: Waterfall requires sequential loss/gain reconciliation from a starting gross total. Independent categorical groups lack step-wise continuity.',
      recommendation: 'Use Stacked Bar or Pareto chart.',
    };
  }

  // General comparative charts (Bar, Line, Area, Bullet, Pareto, Combo)
  return {
    suitable: true,
    score: 'compatible',
    reason: 'Compatible: Dataset can be mapped to categorical or time-series axes.',
  };
}

/**
 * Builds the effective EChartsOption object dynamically
 */
export function buildPlaygroundOption(
  chartId: string,
  datasetId: string,
  themeId: ThemeId,
  overrides: ConfigOverrides = {}
): EChartsOption {
  const theme = PLAYGROUND_THEMES[themeId] || PLAYGROUND_THEMES['light-enterprise'];
  const dataset = SCENARIO_DATASETS[datasetId] || SCENARIO_DATASETS['qa-defect-pareto'];
  const p = theme.palette;

  // Common Tooltip and Grid defaults
  const baseGrid = {
    top: overrides.showLegend !== false ? 45 : 30,
    right: 25,
    bottom: overrides.showDataZoom ? 45 : 25,
    left: 20,
    containLabel: true,
  };

  const baseTooltip = {
    trigger: 'axis' as const,
    axisPointer: { type: 'cross' as const },
  };

  // ==========================================
  // 1. SPC CONTROL CHART
  // ==========================================
  if (chartId === 'spc') {
    const rawData = dataset.id === 'qa-spc-measurement' 
      ? dataset.data.samples 
      : (dataset.data.values || [25.0, 25.1, 24.9]).map((v: number, i: number) => ({ sampleId: `S-${i+1}`, value: v, timestamp: `${i+1}` }));

    const values: number[] = rawData.map((d: any) => d.value);
    const { mean, ucl, lcl } = calculateSpcLimits(values);
    const usl = dataset.data.usl;
    const lsl = dataset.data.lsl;

    return {
      grid: baseGrid,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          if (!params || !params[0]) return '';
          const pt = rawData[params[0].dataIndex];
          const val = params[0].value;
          const isOut = val > ucl || val < lcl;
          return `
            <div style="font-family: inherit;">
              <div style="font-weight: 700; margin-bottom: 4px;">Lot ${pt?.sampleId || 'Sample'} (${pt?.timestamp || ''})</div>
              <div>Measurement: <strong>${val} mm</strong></div>
              <div style="color: #10B981;">Center Line: ${mean.toFixed(2)} mm</div>
              <div style="color: #EF4444;">Control Limits: [${lcl.toFixed(2)} - ${ucl.toFixed(2)}]</div>
              ${isOut ? '<div style="color: #EF4444; font-weight: 700; margin-top: 4px;">⚠️ Nelson Rule 1: Point exceeds ±3σ limit</div>' : ''}
            </div>
          `;
        },
      },
      legend: overrides.showLegend !== false ? { data: ['Measurement', 'Center Line (CL)', 'Control Limits (UCL/LCL)'], top: 5 } : undefined,
      dataZoom: overrides.showDataZoom ? [{ type: 'inside' }, { type: 'slider', height: 20, bottom: 5 }] : undefined,
      xAxis: {
        type: 'category',
        data: rawData.map((d: any) => d.timestamp || d.sampleId),
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
      },
      series: [
        {
          name: 'Measurement',
          type: 'line',
          data: values,
          smooth: overrides.smoothCurve ?? false,
          symbolSize: overrides.symbolSize ?? 6,
          itemStyle: {
            color: (params: any) => (params.value > ucl || params.value < lcl ? '#EF4444' : p[0]),
          },
          lineStyle: { color: p[0], width: 2 },
          markLine: overrides.showMarkLine !== false ? {
            symbol: 'none',
            data: [
              { yAxis: ucl, name: 'UCL', lineStyle: { color: '#EF4444', type: 'dashed' as const, width: 1.5 }, label: { formatter: `UCL: ${ucl.toFixed(2)}` } },
              { yAxis: mean, name: 'CL', lineStyle: { color: '#10B981', type: 'solid' as const, width: 1.5 }, label: { formatter: `CL: ${mean.toFixed(2)}` } },
              { yAxis: lcl, name: 'LCL', lineStyle: { color: '#EF4444', type: 'dashed' as const, width: 1.5 }, label: { formatter: `LCL: ${lcl.toFixed(2)}` } },
              ...(usl ? [{ yAxis: usl, name: 'USL', lineStyle: { color: '#8B5CF6', type: 'dotted' as const, width: 1.5 }, label: { formatter: `USL: ${usl}` } }] : []),
              ...(lsl ? [{ yAxis: lsl, name: 'LSL', lineStyle: { color: '#8B5CF6', type: 'dotted' as const, width: 1.5 }, label: { formatter: `LSL: ${lsl}` } }] : []),
            ],
          } : undefined,
        },
      ],
    };
  }

  // ==========================================
  // 2. PARETO 80/20 CHART
  // ==========================================
  if (chartId === 'pareto') {
    const rawItems = Array.isArray(dataset.data) 
      ? dataset.data 
      : (dataset.data.samples || [{ name: 'A', count: 10 }]);

    const sorted = [...rawItems].map((item: any) => ({
      name: item.name || item.month || item.title || 'Item',
      count: item.count || item.actual || item.value || 10,
      copq: item.copq || (item.count ? item.count * 3.5 : 0),
    })).sort((a, b) => b.count - a.count);

    const totalCount = sorted.reduce((sum, item) => sum + item.count, 0) || 1;
    let runningSum = 0;
    const categories: string[] = [];
    const counts: number[] = [];
    const cumulativePercents: number[] = [];

    sorted.forEach((item) => {
      categories.push(item.name);
      counts.push(item.count);
      runningSum += item.count;
      cumulativePercents.push(Number(((runningSum / totalCount) * 100).toFixed(1)));
    });

    return {
      grid: { ...baseGrid, right: 45 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          if (!params || !params[0]) return '';
          const name = params[0].name;
          const count = params[0].value;
          const cum = params[1] ? params[1].value : 0;
          return `
            <div style="font-family: inherit;">
              <div style="font-weight: 700; margin-bottom: 4px;">${name}</div>
              <div style="color: ${p[0]};">Defect Volume: <strong>${count.toLocaleString()}</strong></div>
              <div style="color: ${p[2] || '#D97706'};">Cumulative Share: <strong>${cum}%</strong></div>
            </div>
          `;
        },
      },
      legend: overrides.showLegend !== false ? { data: ['Defect Frequency', 'Cumulative %'], top: 5 } : undefined,
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: theme.axisLine } },
        axisLabel: { interval: 0, rotate: categories.length > 5 ? 25 : 0 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
        },
        {
          type: 'value',
          name: 'Cumulative %',
          min: 0,
          max: 100,
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Defect Frequency',
          type: 'bar',
          data: counts,
          barWidth: overrides.barWidth || '50%',
          itemStyle: { color: p[0], borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'Cumulative %',
          type: 'line',
          yAxisIndex: 1,
          data: cumulativePercents,
          smooth: overrides.smoothCurve ?? false,
          itemStyle: { color: p[2] || '#D97706' },
          lineStyle: { width: 2.5 },
          markLine: overrides.showMarkLine !== false ? {
            symbol: 'none',
            data: [
              {
                yAxis: 80,
                lineStyle: { color: '#EF4444', type: 'dashed' as const, width: 1.5 },
                label: { formatter: '80% Inflection Threshold', position: 'end' },
              },
            ],
          } : undefined,
        },
      ],
    };
  }

  // ==========================================
  // 3. CAPABILITY HISTOGRAM (Cp/Cpk)
  // ==========================================
  if (chartId === 'capability') {
    const rawValues: number[] = dataset.id === 'qa-capability-distribution'
      ? dataset.data.values
      : (dataset.data.samples || [{ value: 25.0 }]).map((s: any) => s.value || 25.0);

    const usl = dataset.data.usl ?? 25.40;
    const lsl = dataset.data.lsl ?? 24.60;
    const { mean, stdDev: stdev } = calculateProcessCapability(rawValues, usl, lsl);

    // Compute bins
    const minVal = Math.min(...rawValues);
    const maxVal = Math.max(...rawValues);
    const binCount = 10;
    const step = (maxVal - minVal) / binCount || 0.05;
    const bins: number[] = new Array(binCount).fill(0);
    const binLabels: string[] = [];

    for (let i = 0; i < binCount; i++) {
      binLabels.push((minVal + i * step).toFixed(2));
    }

    rawValues.forEach((val) => {
      const idx = Math.min(Math.floor((val - minVal) / step), binCount - 1);
      bins[idx]++;
    });

    // Gaussian normal curve overlay
    const gaussianCurve = binLabels.map((lbl) => {
      const x = parseFloat(lbl);
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdev, 2));
      const pdf = (1 / (stdev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      return Number((pdf * rawValues.length * step).toFixed(2));
    });

    return {
      grid: baseGrid,
      tooltip: baseTooltip,
      legend: overrides.showLegend !== false ? { data: ['Observed Frequency', 'Normal Gaussian Fit'], top: 5 } : undefined,
      xAxis: {
        type: 'category',
        data: binLabels,
        name: 'Dimension (mm)',
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      yAxis: {
        type: 'value',
        name: 'Parts Count',
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
      },
      series: [
        {
          name: 'Observed Frequency',
          type: 'bar',
          data: bins,
          itemStyle: { color: p[0], borderRadius: [4, 4, 0, 0] },
          barWidth: overrides.barWidth || '65%',
        },
        {
          name: 'Normal Gaussian Fit',
          type: 'line',
          smooth: true,
          data: gaussianCurve,
          lineStyle: { color: '#EF4444', width: 2 },
          showSymbol: false,
        },
      ],
    };
  }

  // ==========================================
  // 4. BULLET PERFORMANCE CHART
  // ==========================================
  if (chartId === 'bullet') {
    const rawItems = dataset.id === 'kpi-bullet-dimensions'
      ? dataset.data
      : (Array.isArray(dataset.data) ? dataset.data : [{ title: 'KPI', current: 80, target: 85, ranges: [60, 80, 100], unit: '%' }]);

    const categories = rawItems.map((d: any) => d.title || d.month || d.name);
    const actuals = rawItems.map((d: any) => d.current || d.actual || 75);
    const targets = rawItems.map((d: any) => d.target || 85);

    return {
      grid: { ...baseGrid, left: 120 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: overrides.showLegend !== false ? { data: ['Actual Achievement', 'Target Benchmark'], top: 5 } : undefined,
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      series: [
        {
          name: 'Actual Achievement',
          type: 'bar',
          data: actuals,
          barWidth: 16,
          itemStyle: { color: p[0], borderRadius: [0, 4, 4, 0] },
        },
        {
          name: 'Target Benchmark',
          type: 'scatter',
          symbol: 'rect',
          symbolSize: [3, 26],
          itemStyle: { color: '#EF4444' },
          data: targets,
        },
      ],
    };
  }

  // ==========================================
  // 5. LINE × STATION DEFECT HEATMAP
  // ==========================================
  if (chartId === 'defectHeatmap') {
    const d = dataset.id === 'qa-station-matrix'
      ? dataset.data
      : { stations: ['S1', 'S2', 'S3'], lines: ['L1', 'L2'], matrix: [[0, 0, 10], [1, 0, 20], [2, 0, 30], [0, 1, 15], [1, 1, 25], [2, 1, 35]] };

    return {
      grid: { ...baseGrid, bottom: 40 },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const item = params.value;
          return `
            <div style="font-family: inherit;">
              <div>Station: <strong>${d.stations[item[0]]}</strong></div>
              <div>Line: <strong>${d.lines[item[1]]}</strong></div>
              <div style="color: #EF4444; font-weight: 700;">Defects: ${item[2]} units</div>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: d.stations,
        splitArea: { show: true },
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      yAxis: {
        type: 'category',
        data: d.lines,
        splitArea: { show: true },
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      visualMap: {
        min: 0,
        max: 150,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: theme.isDark 
            ? ['#1E293B', '#3B82F6', '#F59E0B', '#EF4444'] 
            : ['#FEF2F2', '#FCA5A5', '#EF4444', '#991B1B'],
        },
      },
      series: [
        {
          type: 'heatmap',
          data: d.matrix,
          label: { show: true, color: theme.isDark ? '#F8FAFC' : '#18181B', fontSize: 10 },
        },
      ],
    };
  }

  // ==========================================
  // 6. SANKEY WORKFLOW
  // ==========================================
  if (chartId === 'sankey') {
    const d = dataset.id === 'ops-material-sankey' 
      ? dataset.data 
      : { nodes: [{ name: 'Input' }, { name: 'Output' }], links: [{ source: 'Input', target: 'Output', value: 100 }] };

    return {
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [
        {
          type: 'sankey',
          data: d.nodes,
          links: d.links,
          emphasis: { focus: 'adjacency' },
          lineStyle: { color: 'gradient', curveness: 0.5 },
          label: { color: theme.textPrimary, fontSize: 10 },
        },
      ],
    };
  }

  // ==========================================
  // 7. TREEMAP
  // ==========================================
  if (chartId === 'treemap') {
    const data = dataset.id === 'ops-defect-treemap'
      ? dataset.data
      : [{ name: 'Root', children: [{ name: 'A', value: 10 }, { name: 'B', value: 20 }] }];

    return {
      tooltip: { formatter: '{b}: ${c}' },
      series: [
        {
          type: 'treemap',
          data,
          leafDepth: 1,
          levels: [
            { itemStyle: { borderColor: theme.cardBorder, borderWidth: 2, gapWidth: 2 } },
            { color: p, colorMappingBy: 'id', itemStyle: { gapWidth: 1 } },
          ],
        },
      ],
    };
  }

  // ==========================================
  // 8. MULTI-AXIS RADAR
  // ==========================================
  if (chartId === 'radar') {
    const d = dataset.id === 'ops-supplier-radar'
      ? dataset.data
      : {
          indicators: [{ name: 'Yield', max: 100 }, { name: 'Speed', max: 100 }, { name: 'Safety', max: 100 }],
          series: [{ name: 'Line 1', values: [90, 80, 95] }],
        };

    return {
      tooltip: { trigger: 'item' },
      legend: overrides.showLegend !== false ? { data: d.series.map((s: any) => s.name), top: 5 } : undefined,
      radar: {
        indicator: d.indicators,
        splitArea: { show: false },
        splitLine: { lineStyle: { color: theme.gridLine } },
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      series: [
        {
          type: 'radar',
          data: d.series.map((s: any, idx: number) => ({
            value: s.values,
            name: s.name,
            itemStyle: { color: p[idx % p.length] },
            areaStyle: overrides.showArea !== false ? { opacity: 0.15 } : undefined,
          })),
        },
      ],
    };
  }

  // ==========================================
  // 9. COMBO TREND CHART (Volume & PPM)
  // ==========================================
  if (chartId === 'combo') {
    const d = dataset.id === 'ops-throughput-ppm'
      ? dataset.data
      : [
          { time: '08:00', volume: 2000, ppm: 1500 },
          { time: '10:00', volume: 3200, ppm: 2800 },
          { time: '12:00', volume: 2800, ppm: 2100 },
        ];

    return {
      grid: { ...baseGrid, right: 45 },
      tooltip: baseTooltip,
      legend: overrides.showLegend !== false ? { data: ['Output Volume', 'Defect PPM'], top: 5 } : undefined,
      dataZoom: overrides.showDataZoom ? [{ type: 'inside' }, { type: 'slider', height: 20, bottom: 5 }] : undefined,
      xAxis: {
        type: 'category',
        data: d.map((item: any) => item.time || item.month || 'T'),
        axisLine: { lineStyle: { color: theme.axisLine } },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Volume',
          splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
        },
        {
          type: 'value',
          name: 'PPM',
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Output Volume',
          type: 'bar',
          data: d.map((item: any) => item.volume || item.actual || 100),
          itemStyle: { color: p[0], borderRadius: [4, 4, 0, 0] },
          barWidth: overrides.barWidth || '45%',
        },
        {
          name: 'Defect PPM',
          type: 'line',
          yAxisIndex: 1,
          data: d.map((item: any) => item.ppm || (item.variance ? Math.abs(item.variance * 500) : 1000)),
          smooth: overrides.smoothCurve ?? true,
          itemStyle: { color: '#EF4444' },
          lineStyle: { width: 2.5 },
        },
      ],
    };
  }

  // ==========================================
  // 10. WATERFALL CHART
  // ==========================================
  if (chartId === 'waterfall') {
    const raw = dataset.id === 'kpi-production-waterfall'
      ? dataset.data
      : [
          { name: 'Gross', value: 100, isTotal: true },
          { name: 'Loss 1', value: -20 },
          { name: 'Loss 2', value: -10 },
          { name: 'Net', value: 70, isTotal: true },
        ];

    // Compute placeholder base and step heights
    const placeholders: number[] = [];
    const stepValues: number[] = [];
    let runningAccumulator = 0;

    raw.forEach((step: any) => {
      if (step.isTotal) {
        placeholders.push(0);
        stepValues.push(step.value);
        runningAccumulator = step.value;
      } else if (step.value >= 0) {
        placeholders.push(runningAccumulator);
        stepValues.push(step.value);
        runningAccumulator += step.value;
      } else {
        runningAccumulator += step.value;
        placeholders.push(runningAccumulator);
        stepValues.push(Math.abs(step.value));
      }
    });

    return {
      grid: baseGrid,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          if (!params || !params[1]) return '';
          const name = params[1].name;
          const val = raw[params[1].dataIndex].value;
          return `<div><strong>${name}</strong>: ${val >= 0 ? '+' : ''}${val.toLocaleString()} units</div>`;
        },
      },
      xAxis: {
        type: 'category',
        data: raw.map((s: any) => s.name),
        axisLine: { lineStyle: { color: theme.axisLine } },
        axisLabel: { interval: 0, rotate: 20 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'all',
          itemStyle: { borderColor: 'transparent', color: 'transparent' },
          data: placeholders,
        },
        {
          name: 'Step',
          type: 'bar',
          stack: 'all',
          data: stepValues.map((v, i) => {
            const isTot = raw[i].isTotal;
            const isLoss = raw[i].value < 0;
            return {
              value: v,
              itemStyle: {
                color: isTot ? p[0] : isLoss ? '#EF4444' : '#10B981',
                borderRadius: [4, 4, 0, 0],
              },
            };
          }),
        },
      ],
    };
  }

  // ==========================================
  // 11. STANDARD BAR & LINE & AREA FALLBACK
  // ==========================================
  const rawRows = Array.isArray(dataset.data) 
    ? dataset.data 
    : (dataset.data.samples || [{ name: 'A', value: 10 }]);

  const categories = rawRows.map((r: any) => r.month || r.name || r.title || r.time || 'Item');
  const values = rawRows.map((r: any) => r.actual ?? r.count ?? r.value ?? r.current ?? 50);

  return {
    grid: baseGrid,
    tooltip: baseTooltip,
    legend: overrides.showLegend !== false ? { data: ['Measured Metric'], top: 5 } : undefined,
    dataZoom: overrides.showDataZoom ? [{ type: 'inside' }, { type: 'slider', height: 20, bottom: 5 }] : undefined,
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: theme.axisLine } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
    },
    series: [
      {
        name: 'Measured Metric',
        type: chartId === 'line' || chartId === 'area' ? 'line' : 'bar',
        data: values,
        smooth: overrides.smoothCurve ?? true,
        barWidth: overrides.barWidth || '50%',
        itemStyle: { color: p[0], borderRadius: [4, 4, 0, 0] },
        areaStyle: chartId === 'area' || overrides.showArea ? { opacity: 0.25, color: p[0] } : undefined,
      },
    ],
  };
}
