# PHASE 1B.2.5 — FINAL SEMANTIC VERIFICATION

**Document Version:** 1.0.0  
**Audit Date:** 2026-11-12  
**Auditor Role:** Independent Visualization Architecture Auditor  
**Mode:** AUDIT ONLY — NO SOURCE CODE MODIFICATION  
**Objective:** Resolve remaining uncertainties from Task 02.4 regarding specification line coordinates, archetype semantic fidelity, test verification, and final acceptance of Phase 1B.2.

---

## EXECUTIVE SUMMARY

This audit delivers an exhaustive semantic inspection of the Visual Design Intelligence Library Option Builders (`src/library/builders/`). It resolves two core questions:
1. **Capability Histogram Positioning:** Whether USL/LSL markLines represent exact mathematical specification coordinates or merely category bin boundaries.
2. **Archetype Semantic Fidelity:** Whether the 12 declared archetypes produce genuine visual structures reflecting their domain semantics (particularly the 5 archetypes routed through `cartesianBuilder.ts`), or whether they silently substitute generic approximations.

### Key Findings:
- **Capability MarkLine Positioning:** On category-axis histograms, lines 118–130 of `capabilityBuilder.ts` pin USL to `xAxis: binCount - 1` (index 11) and LSL to `xAxis: 0`. When observations extend outside $[LSL, USL]$, the physical dashed lines **snap to the outer edges of the chart** rather than to the exact bin intervals where $USL$ or $LSL$ reside. This is visually misleading for out-of-spec data.
- **Archetype Semantic Disconnects:**
  - `spc-control`, `pareto-8020`, `capability-histogram`, `defect-heatmap`, `operational-treemap`, `workflow-sankey`, `quality-radar` possess specialized builders with authentic domain structures.
  - `waterfall`, `kpi-bullet`, and `horizon-area` are routed to `cartesianBuilder.ts`, which **silently emits ordinary line or bar series**. A waterfall without floating offset bars, a bullet without background threshold bands, and a horizon chart without layered slice transformations are **generic approximations that lack their defining semantic structures**.

### Final Assessment:
**Decision: C. BLOCKED — Capability limits are visually misrepresented when outliers exist, and multiple archetypes silently produce semantically incorrect charts.**

---

## 1. AUDIT A — CAPABILITY HISTOGRAM SPECIFICATION LINE POSITIONING

### Source Reference: `src/library/builders/families/capabilityBuilder.ts` (lines 73–132)
```typescript
const binCount = 12;
const minVal = Math.min(...rawValues, lsl);
const maxVal = Math.max(...rawValues, usl);
const binWidth = (maxVal - minVal) / binCount || 1;

// ...
markLine: {
  symbol: ['none', 'none'],
  data: [
    {
      name: 'USL',
      xAxis: binCount - 1, // <--- Hardcoded to index 11
      label: { formatter: `USL: ${usl}`, ... },
    },
    {
      name: 'LSL',
      xAxis: 0,            // <--- Hardcoded to index 0
      label: { formatter: `LSL: ${lsl}`, ... },
    },
  ],
}
```

### Deterministic Test Matrix: `USL = 101.0, LSL = 99.0`
We executed deterministic runtime traces against the 6 required scenarios:

| Scenario | Input Values | MinVal / MaxVal | First Bin (Index 0) | Last Bin (Index 11) | USL MarkLine Placement | LSL MarkLine Placement | Visual Truthfulness |
|:---|:---|:---|:---|:---|:---:|:---:|:---:|
| **1. All in-spec** | `[99.2, 99.5, 99.8, 100.0, 100.2, 100.5, 100.8]` | $99.0 / 101.0$ | `99.00 - 99.17` | `100.83 - 101.00` | Placed at Index 11 (Coincides with 101.00) | Placed at Index 0 (Coincides with 99.00) | **ACCURATE** |
| **2. One below LSL** | `[98.5, 99.2, 99.5, 99.8, 100.0, 100.2, 100.5]` | $98.5 / 101.0$ | `98.50 - 98.71` | `100.79 - 101.00` | Placed at Index 11 | Placed at Index 0 (`98.50`) **[LSL=99 is in Bin 2!]** | **MISLEADING** |
| **3. One above USL** | `[99.2, 99.5, 99.8, 100.0, 100.2, 100.5, 101.8]` | $99.0 / 101.8$ | `99.00 - 99.23` | `101.57 - 101.80` | Placed at Index 11 (`101.80`) **[USL=101 is in Bin 8!]** | Placed at Index 0 | **MISLEADING** |
| **4. Both out-of-spec** | `[98.2, 99.5, 99.8, 100.0, 100.2, 100.5, 101.2, 102.0]` | $98.2 / 102.0$ | `98.20 - 98.52` | `101.68 - 102.00` | Placed at Index 11 (`102.00`) **[USL=101 is in Bin 8]** | Placed at Index 0 (`98.20`) **[LSL=99 is in Bin 2]** | **CRITICALLY MISLEADING** |
| **5. Limits outside data** | `[99.8, 99.9, 100.0, 100.1, 100.2]` *(USL=105, LSL=95)* | $95.0 / 105.0$ | `95.00 - 95.83` | `104.17 - 105.00` | Placed at Index 11 (Coincides with 105.00) | Placed at Index 0 (Coincides with 95.00) | **ACCURATE** |
| **6. Limits inside data** | `[90, 95, 99, 100, 101, 105, 110]` *(USL=102, LSL=98)* | $90.0 / 110.0$ | `90.00 - 91.67` | `108.33 - 110.00` | Placed at Index 11 (`110.00`) **[USL=102 is in Bin 7]** | Placed at Index 0 (`90.00`) **[LSL=98 is in Bin 4]** | **CRITICALLY MISLEADING** |

### Root Cause of Visual Misrepresentation:
In `capabilityBuilder.ts`:
- The x-axis is configured as `type: 'category'` with 12 string labels (`'98.20 - 98.52'`).
- In Apache ECharts, a `markLine` on a category axis with `xAxis: 11` attaches the vertical line to **the center of the 12th category column**, NOT to the numerical value $101.0$.
- In Scenario 4, an operator looking at the chart sees the red dashed line labeled `USL: 101` at the rightmost boundary ($102.0$). The outlier sample ($102.0$) appears *inside* the specification boundaries instead of *outside* them.
- **Audit Conclusion on Audit A:** While the mathematical metrics ($Cp, Cpk$) calculated by Phase 1A are correct, **the visual rendering of USL and LSL on the category axis fails whenever observations fall outside the specification limits.** The legacy component `CapabilityHistogram.tsx:84` solved this by computing the dynamic bin index: `Math.floor((lsl - minVal) / binWidth)`. `capabilityBuilder.ts` failed to implement this dynamic calculation, pinning them statically to 0 and 11.

---

## 2. AUDIT B — SEMANTIC VERIFICATION OF 12 ARCHETYPES

### 2.1 The 12-Row Architectural Mapping Matrix

| # | Archetype Literal | Builder Module | Series Types Produced | Required Semantic Input | Semantic Fidelity Assessment | Implementation Status |
|:---:|:---|:---|:---|:---|:---|:---:|
| 1 | `spc-control` | `spcBuilder.ts` | `line` (scatter dots) | `data.records`, `encoding.yField` | Calculates moving range, UCL/CL/LCL markLines, highlights Nelson rule violation points in red. | **Fully Implemented** |
| 2 | `pareto-8020` | `paretoBuilder.ts` | `bar`, `line` | `data.records`, counts | Dual-axis layout: defect count bars on primary Y-axis, cumulative percentage curve on secondary Y-axis, 80% markLine. | **Fully Implemented** |
| 3 | `capability-histogram` | `capabilityBuilder.ts` | `bar`, `line` | `data.records`, `context.capabilityLimits` | Frequency histogram + scaled Gaussian theoretical curve. (Suffers from markLine category snapping in Audit A). | **Partially Implemented (Visual Bug)** |
| 4 | `defect-heatmap` | `heatmapBuilder.ts` | `heatmap` | `data.categories`, `data.matrix` | 2D matrix coordinate mapping $[x, y, value]$ with continuous `visualMap` color scale. | **Fully Implemented** |
| 5 | `operational-treemap` | `hierarchicalBuilder.ts` | `treemap` | `data.records` ($name, value$) | Nested rectangular area partitioning with border gaps and saturation depth. | **Fully Implemented** |
| 6 | `workflow-sankey` | `relationalBuilder.ts` | `sankey` | `data.nodes`, `data.links` | Directed graph with gradient flow links and node hovering tooltips. | **Fully Implemented** |
| 7 | `quality-radar` | `radarBuilder.ts` | `radar` | `data.categories`, `data.records` | Multi-dimensional spider/radar indicators with polygon series shapes. | **Fully Implemented** |
| 8 | `combo-trend` | `cartesianBuilder.ts` | `line`, `bar` | `data.records` | Maps numeric keys to series. If key contains `'volume'` or `'count'`, uses `bar`, else `line`. However, **it only provides a single Y-axis**; dual-axis is not configured. | **Generic Approximation** |
| 9 | `continuous-trend` | `cartesianBuilder.ts` | `line` | `data.records`, `data.categories` | Emits category axis rather than continuous time/value axis. Missing point interpolation is unhandled. | **Generic Approximation** |
| 10 | `kpi-bullet` | `cartesianBuilder.ts` | `line` (or `bar`) | `data.records` | **Lacks defining bullet structure.** Does not render qualitative background threshold ranges (`Poor, Satisfactory, Good`), target marker rects, or horizontal progress bars. Emits an ordinary line/bar chart. | **Unsupported / False Semantic** |
| 11 | `waterfall` | `cartesianBuilder.ts` | `line` (or `bar`) | `data.records` | **Lacks defining waterfall structure.** Does not compute cumulative base offsets, floating delta bars, or positive/negative color splits. Emits a standard continuous line or bar graph. | **Unsupported / False Semantic** |
| 12 | `horizon-area` | `cartesianBuilder.ts` | `line` (or `bar`) | `data.records` | **Lacks defining horizon structure.** Does not perform multi-band modulo slicing, baseline reflection, or density layering. Emits a standard Cartesian line series without even `areaStyle`. | **Unsupported / False Semantic** |

---

### 2.2 Deep-Dive into the Five Cartesian Archetypes

#### A. `combo-trend`
- **Expected Semantics:** Dual Y-axis (Volume on primary axis as bars, Defect Rate on secondary axis as line with percentage formatter).
- **Actual Implementation in `cartesianBuilder.ts`:**
  - Lines 40–49 heuristically check if the field name includes `'volume'` to set `type: 'bar'`.
  - Lines 71–74 instantiate **only a single Y-axis** (`buildValueAxis`).
  - *Result:* When volume is $10,000$ and defect rate is $2.5\%$, the defect rate line is squashed flat against the bottom axis (value 2.5 on a 10,000 scale).

#### B. `continuous-trend`
- **Expected Semantics:** Continuous time or numeric x-axis (`type: 'time'` or `type: 'value'`), allowing irregular intervals and gap detection.
- **Actual Implementation:** Uses `buildCategoryAxis({ categories })`. Points are evenly spaced regardless of timestamp delta.

#### C. `kpi-bullet`
- **Expected Semantics:** Stephen Few's Bullet Graph specification:
  1. Horizontal/vertical actual performance bar.
  2. Distinct comparative target marker (symbol: `'rect'`).
  3. Qualitative performance background ranges (e.g. 0–60% Poor, 60–85% Satisfactory, 85–100% Good).
  *(See `src/visualization/charts/performance/KpiBulletChart.tsx` for the working reference).*
- **Actual Implementation:** Emits `actual` and `target` as two separate line series or bar series on a category axis. Zero background bands.

#### D. `waterfall`
- **Expected Semantics:** Sequential variance walk:
  1. Invisible transparent base series: `runningTotal` offset.
  2. Positive delta series (green, floating).
  3. Negative delta series (red, floating downward).
  4. Total / Subtotal pillars anchored to zero.
  *(See `src/visualization/charts/performance/WaterfallChart.tsx` for the working reference).*
- **Actual Implementation:** Emits a single continuous line series or bar series through the raw values (`[100, -10, 90]`). Negative values drop below the zero axis instead of floating relative to the previous step.

#### E. `horizon-area`
- **Expected Semantics:** High-density time-series technique where signals exceeding a baseline are divided into discrete numerical bands, layered with increasing color saturation, and folded over a compact 2D strip.
- **Actual Implementation:** Generates an ordinary line series. `areaStyle` is not even enabled.

---

## 3. AUDIT C — TEST EVIDENCE EVALUATION

Review of all automated tests across `src/library/builders/__tests__/`:

| Archetype | Test Suite | Test Type | Evaluates Domain Semantics? |
|:---|:---|:---:|:---:|
| `spc-control` | `chartBuilders.test.ts:16` | **Runtime Tested** | YES (tests Nelson rule highlight color `#DC2626`, markLines for UCL/LCL). |
| `pareto-8020` | `chartBuilders.test.ts:51` | **Runtime Tested** | YES (tests dual y-axis indices 0 and 1, 80% cutoff line). |
| `capability-histogram` | `capabilityRemediation.test.ts:14` | **Runtime Tested** | YES for math & errors; **NO for outlier visual placement** (only tested with in-spec data). |
| `defect-heatmap` | `chartBuilders.test.ts:103` | **Runtime Tested** | YES (tests `visualMap` and 2D matrix series). |
| `operational-treemap` | `chartBuilders.test.ts:127` | **Runtime Tested** | YES (tests treemap series levels). |
| `workflow-sankey` | `chartBuilders.test.ts:147` | **Runtime Tested** | YES (tests nodes, links, and gradient lineStyle). |
| `quality-radar` | `chartBuilders.test.ts:172` | **Runtime Tested** | YES (tests indicator polygon configuration). |
| `combo-trend` | `chartBuilders.test.ts:192` | **Structurally Tested Only** | NO (only tests that `series` has length 2 and type is bar/line). |
| `continuous-trend` | None | **Source-Inspected Only** | NO (no test exists for `continuous-trend`). |
| `kpi-bullet` | None | **Source-Inspected Only** | NO (no test exists for `kpi-bullet`). |
| `waterfall` | None | **Source-Inspected Only** | NO (no test exists for `waterfall`). |
| `horizon-area` | None | **Source-Inspected Only** | NO (no test exists for `horizon-area`). |

---

## 4. AUDIT D — FINAL SCOPE STATUS

1. **Git Verification:** **NOT AVAILABLE.** The working tree is not a git repository. No git diff can be produced.
2. **Browser Visual Testing:** **NOT ESTABLISHED.** All tests execute in a Node.js CLI runtime (`node:test`). Pixel canvas rendering, SVG text bounding boxes, and tooltip DOM popups were not observed in a live browser.
3. **Core & Contract Isolation:** Confirmed that `visualizationContract.ts`, `src/library/core/`, and `src/library/math/` remain strictly unmodified.

---

## 5. FINAL ACCEPTANCE DECISION

```
[ ] A. READY FOR PHASE 1B.2 ACCEPTANCE
[ ] B. ACCEPTABLE WITH DOCUMENTED LIMITATIONS
[X] C. BLOCKED — Critical visual misrepresentation and false archetype semantics
[ ] D. NOT VERIFIED
```

### Detailed Justification for Decision C (BLOCKED):
1. **Capability Histogram Visual Misrepresentation:**
   In `capabilityBuilder.ts`, hardcoding USL/LSL markLines to category index `11` and `0` means that whenever real-world industrial data contains defective parts outside $[LSL, USL]$, the specification lines are rendered at the extreme ends of the chart rather than at their exact engineering positions. Defective parts appear inside the specification bounds.
2. **False Archetype Semantics (Silent Substitution):**
   The library claims to support 12 distinct visualization archetypes. However, `kpi-bullet`, `waterfall`, and `horizon-area` are routed to `cartesianBuilder.ts`, which emits standard line or bar charts. Calling for a `waterfall` or `kpi-bullet` produces a chart that lacks the mathematical offsets, threshold bands, and visual structures required by quality and performance engineers.
3. **Architectural Policy Violation:**
   In accordance with the project's engineering standards: *"A generic builder may only be used when its semantics are explicitly appropriate for that archetype. Unsupported archetypes must fail explicitly rather than silently producing a different chart type."*

---

## 6. MINIMUM RECOMMENDED ACTION FOR REMEDIATION

To unblock Phase 1B.2:

1. **Fix Capability MarkLine Indexing:**
   In `src/library/builders/families/capabilityBuilder.ts`:
   Calculate the exact category bin indices for USL and LSL dynamically:
   ```typescript
   const lslIndex = Math.max(0, Math.min(binCount - 1, Math.floor((lsl - minVal) / binWidth)));
   const uslIndex = Math.max(0, Math.min(binCount - 1, Math.floor((usl - minVal) / binWidth)));
   ```
   *(Or migrate the histogram x-axis to a continuous value axis).*

2. **Explicitly Reject or Implement Missing Archetypes:**
   In `src/library/builders/specAdapter.ts`:
   - Either:
     - Implement dedicated builders for `waterfall` (using the floating-offset algorithm from `WaterfallChart.tsx`) and `kpi-bullet` (using scatter targets and markAreas from `KpiBulletChart.tsx`).
     - **OR** explicitly throw an error for unbuilt archetypes:
       ```typescript
       case 'waterfall':
       case 'kpi-bullet':
       case 'horizon-area':
         throw new Error(`Archetype '${spec.archetype}' is not yet implemented in Phase 1B.2 and cannot be approximated as a generic cartesian chart.`);
       ```

---
*Report completed under strict AUDIT ONLY guidelines. No source files were modified.*
