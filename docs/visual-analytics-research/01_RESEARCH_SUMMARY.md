# 01. RESEARCH & KNOWLEDGE EXTRACTION SUMMARY
**Document:** `docs/visual-analytics-research/01_RESEARCH_SUMMARY.md`  
**Author:** Principal Data Visualization Architect, Senior Frontend Graphics Engineer & Enterprise Dashboard UX Researcher  
**Date:** November 2026  
**Status:** Canonical Technical Research Report & Foundation Knowledge Base  

---

## 1. EXECUTIVE SUMMARY

This research investigation establishes the architectural and design foundation for the **Enterprise Visual Analytics & Graphic System 2026**. Rather than treating dashboards as decorative widgets or applying generic aesthetic trends, this study synthesizes authoritative computer science, statistical process control, and human-computer interaction (HCI) research from five mandatory sources:

1. **Apache ECharts Official Examples:** Investigated advanced composite series, hardware Canvas/WebGL rendering, and rich graphic annotations (`markLine`, `markArea`, `visualMap`, `dataZoom`).
2. **Apache ECharts Engineering Handbook:** Analyzed instance lifecycles, memory disposal contracts, declarative `dataset` transformations (filtering, sorting, boxplot computation), and dynamic update protocols (`setOption`).
3. **Observable – "Beyond Bar Charts":** Evaluated the statistical failure modes of conventional bar charts (masking multimodality, spread, skewness, and outliers) and extracted principles for distribution modeling (small multiples, faceting, ridgelines, boxplots, histograms).
4. **Observable – "Chart Interactions":** Extracted precision interaction primitives (`pointerX`, coordinate-tracking `crosshairX` that avoids obscuring glyphs, pinned tooltips, linked brushing, and selection-driven cross-filtering).
5. **Tableau Research – "How People Read Dashboards":** Evaluated eye-tracking empirical data on visual saliency vs. layout hierarchy, F- and Z-shaped scanning patterns, the magnetic pull of Big Ass Numbers (BANs), and strategies for mitigating cognitive fatigue in high-stress operational environments.

### Core Strategic Conclusion
**Apache ECharts 6.x is verified as the primary enterprise visualization engine**, operating on Canvas/WebGL for high-frequency factory telemetry (10,000+ points without DOM bloat). Recharts is retained exclusively for inline micro-sparklines. D3.js and Plotly.js are classified as specialized tools to be avoided unless bespoke non-Euclidean topologies or advanced 3D spatial models are required.

---

## 2. DETAILED SOURCE REPORTS & FACTUAL CITATIONS

### Source 1: Apache ECharts Official Examples
- **Access Status:** Verified & Inspected (`https://echarts.apache.org/examples/en/index.html`).
- **Core Technical Capabilities Examined:**
  - *Composite & Dual-Axis Series:* Studied dual-axis Pareto models combining discrete bar aggregations with continuous cumulative curves, utilizing independent left and right coordinate scales.
  - *Statistical Annotations:* Analyzed `markLine` and `markArea` for drawing Shewhart control boundaries ($\pm 3\sigma$), customer tolerance limits ($USL/LSL$), and zone shading ($Zone\ A, B, C$) without altering series underlying data.
  - *Hierarchical Visualizations:* Inspected Treemap and Sankey layouts with adjacency highlighting, drill-down level depth, and customizable node curvatures.
  - *Continuous Visual Mapping:* Examined `visualMap` (continuous and piecewise) for encoding multi-dimensional defect density across factory spatial matrices and heatmaps.
- **Direct Reference:** [Apache ECharts Examples Directory](https://echarts.apache.org/examples/en/index.html).

### Source 2: Apache ECharts Engineering Handbook
- **Access Status:** Verified & Inspected (`https://echarts.apache.org/handbook/en/`).
- **Key Engineering Findings:**
  1. *Separation of Data and Style (`dataset`):* ECharts 4+ separates raw data matrices from visual encoding. A single tabular dataset can feed multiple independent series using `series.encode` (e.g., mapping column 0 to `x`, column 3 to `y`, and column 4 to `tooltip`).
  2. *Declarative Data Transforms (`dataset.transform`):* Core ECharts natively supports basic transform operators (`filter`, `sort`). Complex statistical transforms like boxplot and regression require the external `echarts-stat` library. **Engineering Decision:** To avoid bloated dependencies and ensure Six Sigma compliance, mathematical transformations (SPC limits, $C_p/C_{pk}$, Gaussian normal curve, and five-number summaries) are implemented as pure, strongly-typed TypeScript utilities (`src/utils/statisticalMath.ts`).
  3. *Instance Lifecycle & Memory Sanitation:*
     - Initialization via `echarts.init(dom, theme, { renderer: 'canvas' })`.
     - Incremental updates via `chart.setOption(newOption, { notMerge: false, lazyUpdate: true })` for real-time telemetry streaming; `notMerge: true` strictly for structural schema/dimension changes.
     - Explicit disposal via `chart.dispose()` on component unmount is mandatory in 24/7 industrial dashboards to prevent detached Canvas DOM leaks.
  4. *High-Frequency Telemetry Streaming (1–5 Hz):*
     - For streaming sensor data, maintain an in-memory fixed-size circular ring-buffer (e.g., 500–1,000 points) and update via `setOption` with `animationDurationUpdate: 250` or `animation: false`. Avoid `appendData` when series require `markLine` recomputation because `appendData` does not recalculate coordinate extremes.
  5. *Industrial Touch Terminals & Kiosk Constraints:*
     - Plant floor terminals often feature resistive/capacitive touchscreens with operators wearing gloves. `dataZoom.inside` must be configured with `zoomLock: true` or touch-gestures restricted to prevent trapping vertical viewport scrolls during operator navigation. Interactive markers must provide at least $44 \times 44\text{px}$ touch target bounds.
- **Direct Reference:** [Apache ECharts Handbook: Concepts & Data Transform](https://echarts.apache.org/handbook/en/concepts/data-transform/).

### Source 3: Observable – "Beyond Bar Charts"
- **Access Status:** Verified & Inspected (`https://observablehq.com/@observablehq/beyond-bar-charts-a-guide-to-advanced-visualizations`).
- **Key Technical Findings:**
  1. *The Danger of Aggregation Bias:* Bar charts only communicate single point summaries (mean, sum). They conceal whether a defect spike is caused by a uniform shift across all machines or extreme outliers on a single degraded nozzle.
  2. *Distribution-First Visuals:*
     - *Box Plots / Five-Number Summaries:* Expose IQR, median skewness, and points beyond $1.5 \times IQR$.
     - *Continuous Density Curves & Histograms:* Reveal multimodal distributions (e.g., two distinct peaks indicating temperature instability between day and night shifts).
  3. *Small Multiples (Faceting):* Instead of overcrowding 8 lines onto one chaotic chart, faceting along rows (`fy`) and columns (`fx`) creates parallel mini-multiples with synchronized scales, drastically improving pattern recognition across production lines.
- **Direct Reference:** [Observable: Beyond Bar Charts Guide](https://observablehq.com/@observablehq/beyond-bar-charts-a-guide-to-advanced-visualizations).

### Source 4: Observable – "Chart Interactions"
- **Access Status:** Verified & Inspected (`https://observablehq.github.io/plot/features/interactions`).
- **Key Technical Findings:**
  1. *Proximity vs. Direct Hover:* Observable Plot separates 2D distance proximity (`pointer`) from 1D axis-snapping (`pointerX`, `pointerY`). For time-series and continuous telemetry, `pointerX` snapping provides buttery-smooth tracking without requiring the user to hover over an exact 3px marker.
  2. *Crosshair Marks over Tooltip Bloat:* Standard floating tooltips often obscure the very data points adjacent to the cursor. Plot's `crosshairX` rule draws vertical guide markers with values rendered along the outer axis frame, preserving unobstructed visual access to adjacent anomalies.
  3. *Click-to-Stick / Pinning:* Interactive inspection requires the ability to freeze an active tooltip state on click, allowing quality engineers to inspect, highlight, or copy error diagnostic codes without cursor jitter.
- **Direct Reference:** [Observable Plot: Features and Interactions](https://observablehq.github.io/plot/features/interactions).

### Source 5: Tableau Research – "How People Read Dashboards"
- **Access Status:** Verified & Inspected (`https://www.tableau.com/blog/research-how-do-people-read-dashboards`).
- **Key Technical Findings:**
  1. *Top-Left Anchor & Scanning Paths:* Eye-tracking confirms that dashboard users start in the upper-left quadrant to orient themselves before executing F-shaped or Z-shaped scans.
  2. *The Magnetic Saliency of BANs:* Big Ass Numbers (large KPI metrics with high visual contrast) attract initial visual fixations faster than complex charts. Placing primary KPIs at the top provides instant cognitive grounding.
  3. *Visual Saliency Competition:* Saliency (bright colors, aggressive borders, heavy drop shadows) competes with semantic meaning. If secondary elements are over-decorated, users experience cognitive friction and fail to follow the intended analytical hierarchy.
  4. *Inverted Pyramid Narrative:* Dashboards must follow the newsroom principle: Summary KPIs at the top $\to$ Macro Trends & Comparisons in the middle $\to$ Granular Operational Ledgers & Root-Cause Details at the bottom.
- **Direct Reference:** [Tableau Research: How Do People "Read" Dashboards?](https://www.tableau.com/blog/research-how-do-people-read-dashboards).

---

## 3. APPLICABILITY & STRATEGIC RECOMMENDATIONS

| Recommendation | Classification | Rationale & Architectural Scope |
| :--- | :--- | :--- |
| **Apache ECharts 6.x as Core Engine** | **MUST HAVE** | Replaces SVG-limited rendering with hardware Canvas acceleration; unifies 30+ chart archetypes under a single dependency. |
| **Centralized Chart Registry & Container** | **MUST HAVE** | Eliminates AI Slop; standardizes headers, data freshness indicators, timeframes, fullscreen modals, and CSV export across all views. |
| **Statistical Process Control (SPC) Engine** | **MUST HAVE** | Essential for manufacturing QA; computes authentic Shewhart limits ($\bar{X} \pm 3\sigma$, $USL/LSL$) and Nelson Rule 1 violation markers. |
| **Separation of Data Pipeline (`dataset`)** | **MUST HAVE** | Decouples raw API telemetry adapters from rendering logic, allowing charts to re-render without rewriting business models. |
| **Interactive Axis Crosshair & Pinning** | **SHOULD HAVE** | Implements Observable Plot-inspired non-obscuring crosshairs and click-to-pin tooltips for detailed lot diagnostic analysis. |
| **Small Multiples / Faceting System** | **SHOULD HAVE** | Enables parallel line-by-line comparison across 5+ production lines without visual clutter. |
| **Custom D3.js Micro-Visualizations** | **OPTIONAL** | Strictly isolated to bespoke micro-gauges or non-standard SVG nodes where ECharts options are insufficient. |
| **Plotly.js Integration** | **NOT RECOMMENDED** | Redundant; introduces 3+ MB of duplicate bundle weight while ECharts natively satisfies all industrial charting needs. |
| **Full SVG DOM Charts for Dense Telemetry**| **NOT RECOMMENDED** | High-frequency IoT logging (1,000+ points) causes dropped frames and unresponsive browser threads when rendered in SVG DOM. |

---

## 4. AUDIT OF OUR EXISTING APPLICATION REPOSITORY

- **Framework Architecture:** Modern Next.js 16 (App Router) in `d:\Vibe_coding\IQC_nexus\frontend` and Vite 8 + React 19 in `d:\Vibe_coding\Saas`.
- **Existing Libraries:** Tailwind CSS, Framer Motion, Lucide React, and Recharts.
- **Identified Gap:** Recharts is excellent for simple marketing and SaaS sparklines but lacks native Canvas acceleration, hierarchical Treemap/Sankey depth, continuous visual mapping, and statistical calculation primitives required for Six Sigma quality monitoring.
- **Migration Strategy:** Zero breaking changes. Preserve Recharts for lightweight inline sparklines while establishing `src/visualization/` powered by Apache ECharts as the enterprise standard for all analytical views.
