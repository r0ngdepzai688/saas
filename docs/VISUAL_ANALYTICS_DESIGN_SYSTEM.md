# ENTERPRISE VISUAL ANALYTICS & GRAPHIC SYSTEM 2026
**Canonical Specification & Implementation Guide**  
**Version:** 2026.1.0  
**Engine:** Apache ECharts 6.1 (Hardware Canvas / WebGL) + React 19 + TypeScript + Tailwind CSS

---

## 1. ARCHITECTURE OVERVIEW

The Enterprise Visual Analytics & Graphic System is structured into 4 decoupled horizontal tiers, ensuring complete separation between presentation, mathematical transformation, and data delivery:

```
+-----------------------------------------------------------------------------------+
|                        VISUAL ANALYTICS DESIGN SYSTEM                             |
|                        Shared Visualization Foundation                            |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------+-------------------------------+---------------------------+
|     DESIGN TOKENS     |         CHART ENGINE          |        INTERACTION        |
| Color, Typography,    | Apache ECharts 6.1 Canvas,    | Tooltip, Cross-filter,    |
| Spacing, SPC Limits   | Adapters, Memory Disposal     | Drill-down, Export        |
+-----------------------+-------------------------------+---------------------------+
                                         │
                                         ▼
+-----------------------+-------------------------------+---------------------------+
|   QUALITY ANALYTICS   |     PERFORMANCE ANALYTICS     |   OPERATIONAL ANALYTICS   |
| SPC Control, Pareto,  | Bullet Chart, Loss Waterfall, | Workflow Sankey, Loss     |
| Cp/Cpk Histogram,     | OEE Equipment Gauges,         | Treemap, Department       |
| Defect Heatmaps       | Target vs Actual              | Progress Bar              |
+-----------------------+-------------------------------+---------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|               DASHBOARDS / MONITORING BOARDS / QUALITY WORKBENCHES                |
|               Shared Components ── Different Analytical Use Cases                 |
+-----------------------------------------------------------------------------------+
```

---

## 2. CENTRALIZED DESIGN TOKENS

### 2.1 Color Tokens & SPC Statistical Limits
```typescript
import { CHART_COLOR_TOKENS } from './tokens/chartTokens';

// Quality & Statistical Limits
CHART_COLOR_TOKENS.spc = {
  target: '#2563EB',        // Engineering Target
  usl: '#DC2626',           // Upper Specification Limit (Customer Bound)
  lsl: '#DC2626',           // Lower Specification Limit (Customer Bound)
  ucl: '#D97706',           // Upper Control Limit (+3 sigma)
  lcl: '#D97706',           // Lower Control Limit (-3 sigma)
  mean: '#16A34A',          // Process Arithmetic Mean (CL)
  outOfControl: '#EF4444',  // Nelson Rule Violation
  inControl: '#2563EB',     // Stable In-Control Point
};
```

---

## 3. ADVANCED CHART CATALOG & API

### Category A: Performance & KPI
1. **`KpiBulletChart`:** Evaluates actual output vs target thresholds against qualitative performance bands (Poor, Satisfactory, Good).
   - *Use Case:* Department milestone evaluation, line yield index.
2. **`WaterfallChart`:** Step-by-step production walk from scheduled gross capacity to net verified yield, isolating mechanical downtime, setup latency, and scrap loss.
   - *Use Case:* Production loss reconciliation, financial yield bridge.

### Category B: Quality & Defect Analytics
1. **`SpcControlChart`:** Statistical Process Control applying authentic Shewhart calculations:
   $$\bar{X} = \frac{1}{N}\sum X_i, \quad UCL = \bar{X} + 3\sigma, \quad LCL = \bar{X} - 3\sigma$$
   Includes automated Nelson Rule 1 detection (flagging points outside 3-sigma).
2. **`ParetoChart8020`:** Automatic descending frequency sort combined with cumulative percentage curve and an 80% cutoff line to identify the vital few root causes.
3. **`CapabilityHistogram`:** Empirical sample distribution with Gaussian normal distribution fit and real-time computation of process capability:
   $$C_p = \frac{USL - LSL}{6\sigma}, \quad C_{pk} = \min\left( \frac{USL - \bar{X}}{3\sigma}, \frac{\bar{X} - LSL}{3\sigma} \right)$$
   Categorizes processes as Capable ($C_{pk} \ge 1.33$) vs Not Capable ($C_{pk} < 1.33$).
4. **`DefectHeatmap`:** Two-dimensional matrix correlating factory stations against defect classifications with continuous density coloring.

### Category C: Operational Monitoring
1. **`WorkflowSankey`:** Visualizes material batch movements through compounding, dipping, washing, QA inspection, rework loops, and scrap bins.
2. **`OperationalTreemap`:** Proportional nested defect distribution by Plant $\to$ Production Line $\to$ Defect Category.

### Category D: Advanced Comparison
1. **`QualityRadarChart`:** Multi-axis capability radar comparing vendors and production lines across Dimensional Precision, First Pass Yield, Cycle Speed, Compliance, and MTBF.
2. **`ComboTrendChart`:** Dual-axis visualization investigating throughput volume vs defect rate correlation.

---

## 4. USAGE EXAMPLES

### Example 1: Integrating an SPC Control Chart with Container
```tsx
import { ChartContainer } from '@/visualization/components/ChartContainer';
import { SpcControlChart } from '@/visualization/charts/quality/SpcControlChart';

export function QualityControlSection({ telemetryData }) {
  return (
    <ChartContainer
      title="Dimension Stability (SPC)"
      subtitle="Sample thickness control with dynamic 3-sigma limits"
      chartTypeBadge="SPC Control Chart"
      analyticalSummary={{
        current: '10.02 mm',
        target: '10.00 mm',
        variance: '+0.02 mm',
        trendPositive: true,
      }}
      onExportCsv={() => exportCsv(telemetryData)}
    >
      <SpcControlChart
        data={telemetryData}
        metricName="Sample Thickness"
        unit="mm"
        usl={10.50}
        lsl={9.50}
        target={10.00}
        height={300}
      />
    </ChartContainer>
  );
}
```

---

## 5. PERFORMANCE & MEMORY LEAK PREVENTION

Every chart component delegates rendering to `EChartsWrapper.tsx`, which implements:
1. **`ResizeObserver` Lifecycle:** Automatically adapts to responsive grid changes and sidebar collapse without triggering full React re-renders.
2. **Explicit `.dispose()` Hook:** In long-running factory environments (24/7 wall displays), instances are cleanly destroyed on component unmount, preventing detached DOM node leaks.
3. **Canvas Hardware Acceleration:** High-density datasets (10,000+ telemetry points) execute on the GPU, avoiding the DOM tree bloat common with pure SVG chart libraries.
