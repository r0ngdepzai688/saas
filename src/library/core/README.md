# ECharts Modular Core Engine (`src/library/core/`)

The Core Engine provides **selective tree-shaken Apache ECharts integration** and a high-performance, leak-free React canvas lifecycle wrapper.

---

## 1. Module Structure

```
src/library/core/
├── echartsCore.ts       # Modular ECharts instance (Tier 2 Industrial tree-shaking + theme registration)
├── EChartsWrapper.ts    # Universal React 19 Canvas wrapper (React.createElement pure TS for zero-transpile test speed)
├── EChartsWrapper.tsx   # Typed barrel re-exporting EChartsWrapper for seamless TSX consumers
├── index.ts             # Public export barrel
├── README.md            # Architecture, performance benchmarks, and remediation guide
└── __tests__/           # 15 headless component lifecycle tests verifying zero memory leaks & lifecycle stability
```

---

## 2. Tree-Shaking Configuration (Tier 2 Industrial)

Monolithic ECharts imports (`import * as echarts from 'echarts'`) pull in unneeded modules (3D WebGL renderers, geographic projections, globe, graph topologies) resulting in ~1,089 KB raw / ~359 KB gzip bundle weight.

`src/library/core/echartsCore.ts` selectively imports and registers **only the 10 industrial chart archetypes**:

### Registered Modules
- **Charts:** `LineChart`, `BarChart`, `HeatmapChart`, `SankeyChart`, `TreemapChart`, `BoxplotChart`, `ScatterChart`, `RadarChart`, `GaugeChart`.
- **Components:** `TitleComponent`, `TooltipComponent`, `GridComponent`, `LegendComponent`, `DataZoomComponent`, `MarkLineComponent`, `MarkAreaComponent`, `MarkPointComponent`, `VisualMapComponent`, `ToolboxComponent`.
- **Renderers:** `CanvasRenderer` (hardware-accelerated 2D) and `SVGRenderer` (vector fallback for printing/SVG export).
- **Themes Auto-Registration:** Pre-registers the 5 canonical themes (*Light Enterprise, Dark Analytics, Warm Glass, Minimal Monochrome, High Contrast*) and the legacy `'enterprise-light'` alias.

---

## 3. Remediated Lifecycle Architecture (Phase 1B.1-R)

Following independent audit `docs/PHASE_1B_1_TECHNICAL_ACCEPTANCE_AUDIT.md`, three critical lifecycle bugs were resolved:

### Bug 1 Fixed: Synchronous State Hydration on Re-init
When switching `theme` or `renderer`, the old instance is disposed and a fresh `echarts.init()` instance is created.
In `EChartsWrapper`, the new instance is **synchronously hydrated** with the current `option`, `loading`, and event listeners immediately inside Lifecycle 1. Subsequent renders in Lifecycle 2 use `isInitialMountRef` to prevent redundant `setOption` calls.

### Bug 2 Fixed: Stale-Closure-Free Event Dispatchers
Event listeners are bound once per instance via stable internal dispatchers that delegate to `latestCallbacksRef.current`.
- Changing `onChartClick` or `onEvents` handlers updates the ref in place, immediately routing future clicks to the freshest handler without requiring re-binding or recreating the chart.
- When an instance is recreated due to a theme or renderer change, `bindEventDispatchers` is invoked immediately on the fresh instance, maintaining listener continuity.

### Bug 3 Fixed: Stable Primitive `initOpts` Signature
Passing inline object literals like `initOpts={{ devicePixelRatio: 2 }}` previously caused infinite recreation loops because object identity changes on every parent render.
`EChartsWrapper` computes a composite string signature (`initSignature`):
```ts
const initSignature = [
  theme,
  renderer,
  initOpts?.devicePixelRatio ?? '',
  initOpts?.useDirtyRect ?? '',
  initOpts?.width ?? '',
  initOpts?.height ?? '',
  initOpts?.locale ?? '',
].join('|');
```
This isolates instance recreation strictly to genuine configuration changes.

---

## 4. High-Reliability Features

1. **Strict Zero-Leak Lifecycle:** Calls `chartInstance.dispose()` on unmount or theme switch, preventing detached canvas contexts and WebGL memory leaks.
2. **RAF-Throttled ResizeObserver:** Debounces window and bento grid layout resizes with `requestAnimationFrame`, preventing UI stuttering during sidebar and drawer animations.
3. **Decoupled Update Lifecycle:** Changing `option` triggers `chartInstance.setOption(...)` without tearing down or recreating the DOM canvas instance.
4. **React 19 ForwardRef Support:** Exposes `getEchartsInstance()`, `resize()`, and `clear()` methods via `EChartsWrapperHandle`.
5. **Inline Render Error Boundary:** Displays an isolated error badge if an option is malformed or WebGL context is lost, preventing app crashes.

---

## 5. Usage Example

```tsx
import React, { useRef } from 'react';
import { EChartsWrapper, type EChartsWrapperHandle, type EChartsOption } from '@/library/core';

export const MyAnalyticalChart: React.FC = () => {
  const chartRef = useRef<EChartsWrapperHandle>(null);

  const option: EChartsOption = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70], type: 'bar' }],
  };

  return (
    <EChartsWrapper
      ref={chartRef}
      option={option}
      height={320}
      theme="warm-glass"
      loading={false}
      onChartClick={(params) => console.log('Clicked point:', params.name, params.value)}
    />
  );
};
```
