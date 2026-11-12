# Visualization Option Builders (`src/library/builders/`)

The **Visualization Option Builders** layer serves as the pure functional adapter that translates framework-independent **Visualization JSON Contracts** (`VisualizationSpec`) into strongly-typed Apache ECharts options (`EChartsOption`).

---

## 1. Architectural Pipeline

```
Framework-independent Knowledge Layer (Contracts, Math, Tokens, Themes)
                                |
                                v
                   Visualization JSON Contract (VisualizationSpec)
                                |
                                v
               ECharts Option Builders (src/library/builders/)
                                |
                                v
              ECharts Core / Wrapper (Canvas/SVG Rendering)
```

### Core Design Principles:
1. **Separation of Concerns:** Business logic and statistical calculations live exclusively in `src/library/math/`. Builders do not recalculate statistics or duplicate Shewhart / Pareto math.
2. **Immutability & Pure Functions:** Builders never mutate input contracts or specifications. All outputs are freshly computed objects.
3. **Theme Token Compliance:** Tooltips, axes, legends, and series inherit colors, typography, and line styles from `src/library/themes/` and `src/library/tokens/`.
4. **Type-Safe & Tree-Shakeable:** 100% strict TypeScript types without `any` casts. Compatible with Node 24 native execution.

---

## 2. Module Directory Structure

```
src/library/builders/
├── common/
│   ├── gridBuilder.ts           # buildBaseGrid: adaptive margins based on legend/datazoom/dual-axis
│   ├── tooltipBuilder.ts        # buildBaseTooltip: theme-aware, cross/axis/item triggers
│   ├── legendBuilder.ts         # buildBaseLegend: standard typography & spacing
│   ├── axisBuilder.ts           # buildCategoryAxis, buildValueAxis: tokenized splitLines & labels
│   └── markerBuilder.ts         # buildContractMarkLines, buildContractMarkAreas: converts contract markers
├── families/
│   ├── cartesianBuilder.ts      # Line, Bar, Combo Trend, Bullet, Waterfall
│   ├── spcBuilder.ts            # Shewhart Control Chart (I-MR, UCL, CL, LCL, Nelson violation styling)
│   ├── paretoBuilder.ts         # Pareto 80/20 Dual-Axis (defect counts + cumulative curve + 80% cutoff)
│   ├── capabilityBuilder.ts     # Process Capability (Histogram bins + Gaussian theoretical curve + USL/LSL)
│   ├── heatmapBuilder.ts        # Defect Density Matrix (VisualMap continuous/piecewise gradient)
│   ├── hierarchicalBuilder.ts   # Operational Treemap (hierarchical volume proportioning)
│   ├── relationalBuilder.ts     # Workflow Sankey (gradient flow nodes & links)
│   └── radarBuilder.ts          # Quality Radar (multi-dimensional polygon indicators)
├── specAdapter.ts               # buildEChartsOptionFromSpec: universal entry point & dispatcher
├── builder.types.ts             # TypeScript interfaces for builder parameters
├── index.ts                     # Public export barrel
└── __tests__/                   # 25 automated tests verifying primitives, families, and spec adapter
```

---

## 3. Usage Examples

### 3.1. Universal Dispatcher from Specification Contract
```typescript
import { buildEChartsOptionFromSpec, type VisualizationSpec } from '@/library';

const spec: VisualizationSpec = {
  version: '1.0',
  id: 'spc-realtime',
  archetype: 'spc-control',
  title: 'Critical Dimension Telemetry',
  subtitle: 'Line 3 - 50 consecutive samples',
  unit: 'mm',
  data: {
    categories: ['S1', 'S2', 'S3', 'S4', 'S5'],
    records: [{ value: 10.02 }, { value: 10.05 }, { value: 9.98 }, { value: 10.12 }, { value: 10.01 }],
  },
};

// Generates complete, theme-aware EChartsOption
const option = buildEChartsOptionFromSpec(spec);
```

### 3.2. Direct Specialized Family Builder
```typescript
import { buildParetoOption } from '@/library/builders';

const paretoOption = buildParetoOption({
  version: '1.0',
  id: 'defect-pareto',
  archetype: 'pareto-8020',
  title: 'Defect Analysis',
  data: {
    records: [
      { name: 'Scratch', count: 120 },
      { name: 'Dent', count: 85 },
      { name: 'Discoloration', count: 32 },
    ],
  },
});
```

### 3.3. Capability Histogram (Explicit Specification Limits Required)
Process Capability Analysis (`capability-histogram`) strictly requires explicit, finite engineering specification limits (`usl` and `lsl` where `usl > lsl`) passed via `BuilderContext.capabilityLimits`. In accordance with engineering safety standards, silent synthetic limits are rejected at runtime:

```typescript
import { buildEChartsOptionFromSpec, buildCapabilityOption } from '@/library/builders';

// Via Universal Dispatcher:
const capabilityOption = buildEChartsOptionFromSpec(spec, {
  capabilityLimits: {
    usl: 101.0,
    lsl: 99.0,
  },
});

// Or via Direct Family Builder:
const directOption = buildCapabilityOption(spec, {
  capabilityLimits: {
    usl: 10.15,
    lsl: 9.85,
  },
});
```
*Note: Invoking `buildCapabilityOption` or dispatching `capability-histogram` without valid `capabilityLimits` will throw an explicit descriptive error.*

---

## 4. Test Verification
All builders are covered by automated unit & integration tests:
- `commonBuilders.test.ts`: Tests margin adaptation, theme-aware tooltip colors, category/value axis formatting, and markLine/markArea transformation.
- `chartBuilders.test.ts`: Verifies SPC Nelson rule highlighting, Pareto dual-axis calculations, Gaussian curve generation, heatmap visualMap, and relational topologies.
- `specAdapter.test.ts`: Verifies universal dispatching, title formatting, and overrides merging.

Run tests:
```bash
pnpm test
```
