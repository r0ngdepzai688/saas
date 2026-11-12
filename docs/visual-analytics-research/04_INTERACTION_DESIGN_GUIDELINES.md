# 04. INTERACTION DESIGN GUIDELINES FOR VISUAL ANALYTICS
**Document:** `docs/visual-analytics-research/04_INTERACTION_DESIGN_GUIDELINES.md`  
**Standard:** Interaction Physics & Behavioral Consistency for Enterprise Analytics  
**Theoretical Foundation:** Observable Plot Interaction Grammars & Apache ECharts Event Protocol  

---

## 1. CORE INTERACTION ARCHITECTURE

In enterprise visual analytics, interaction is not decorative animation; it is an analytical instrument enabling quality engineers and operations managers to interrogate data, isolate anomalies, and verify causal hypotheses.

Every chart interaction must satisfy three foundational tenets:
1. **Zero Obscuration:** Information tooltips and guides must never hide the underlying data glyphs being analyzed.
2. **Deterministic Feedback:** Interactive elements must respond within 50ms of user input with GPU-accelerated feedback.
3. **Cross-View Synchronization:** Filtering, brushing, or selecting an entity on one chart must propagate predictably across related visual panels.

---

## 2. STANDARD INTERACTION PATTERNS & BEHAVIORAL CONTRACTS

### 2.1 Non-Obscuring Crosshair & Coordinate Tracking (`crosshairX`)
- **Principle (from Observable Plot research):** Standard floating tooltips that hover directly over cursor coordinates obscure adjacent data points—critical when examining tight cluster anomalies or sudden SPC out-of-control runs.
- **Implementation in ECharts:**
  ```typescript
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#94A3B8',
        width: 1,
        type: 'dashed'
      },
      label: {
        backgroundColor: '#1E293B',
        fontSize: 10,
        fontFamily: 'monospace'
      }
    }
  }
  ```
- **Behavior:** The crosshair draws subtle horizontal and vertical guideline rules, with exact numerical coordinate markers displayed cleanly along the axis frames rather than inside the plot field.

### 2.2 Rich Contextual Tooltip (Details-on-Demand)
- **Visual Spec:** Dark obsidian slate surface (`rgba(15, 23, 42, 0.94)`), subtle 1px border (`rgba(255, 255, 255, 0.1)`), backdrop blur (`8px`), 10px rounded corners.
- **Content Hierarchy:**
  1. **Header:** Entity identifier (Sample ID, Lot Number, Date/Time, or Machine Station).
  2. **Primary Metric:** Bold tabular figure with exact engineering unit.
  3. **Analytical Context:** Delta from historical baseline or specification variance.
  4. **Diagnostic Warning:** If an SPC limit is breached, render a high-saliency red badge citing the specific rule violation (e.g., `⚠️ Nelson Rule 1: Point exceeds +3σ UCL`).
- **Click-to-Pin (Sticky Tooltip):** Clicking on a data point freezes the tooltip in place, allowing the engineer to highlight or copy lot batch IDs without mouse jitter.

### 2.3 Coordinated Cross-Filtering (Linked Brushing)
- **Use Case:** An engineer highlights a cluster of 5 high-reject lots in a scatter plot using a 2D box brush; all related charts (Pareto defect breakdown, Station Heatmap, Batch Table) immediately update their views to reflect only the selected 5 lots.
- **ECharts Event Contract:**
  ```typescript
  chartInstance.on('brushSelected', (params: any) => {
    const selectedIndices = params.batch[0]?.selected[0]?.dataIndex || [];
    eventBus.emit('CORRELATION_FILTER_APPLIED', { indices: selectedIndices });
  });
  ```

### 2.4 Time-Series Zoom & Panning (`dataZoom`)
- **Use Case:** High-frequency IoT sensors recording temperature every 10 seconds (8,640 points/day).
- **Engineering Standard:**
  - Dual control: A visible bottom slider mini-overview combined with mousewheel zoom inside the chart frame (`inside` + `slider`).
  - Sampling threshold: For datasets exceeding 5,000 points, configure `sampling: 'lttb'` (Largest-Triangle-Three-Buckets) to preserve visual peaks and troughs while keeping frame rates locked at 60 FPS.

### 2.5 Multi-Level Drill-Down Navigation
- **Contract:** Any composite or hierarchical chart (Treemap, Sankey, Stacked Bar) must support progressive drill-down on node click.
- **Visual UX Rule:** A breadcrumb navigation bar must appear dynamically at the top of the chart container (e.g., `Plant Alpha > Line 3 > Dipping Station > Lot B-204`), allowing the user to step back up the hierarchy in a single click.

### 2.7 Factory Floor Touch Terminals & Kiosk Ergonomics
- **Operating Context:** Operators interacting via 15"–24" touchscreens while wearing protective gloves.
- **Touch Target Threshold:** All interactive icons, legend items, and filter chips must provide a minimum clickable/tappable bounding area of **$44 \times 44\text{px}$** (WCAG 2.5.5).
- **Resolving Scroll-Trap Conflicts with `dataZoom`:**
  - On mobile/touch kiosks, ECharts `dataZoom: [{ type: 'inside' }]` intercepts all vertical and horizontal touch events, preventing operators from scrolling down the page.
  - **Standard Touch Contract:**
    ```typescript
    dataZoom: [
      {
        type: 'inside',
        disabled: isTouchDevice, // Disable inside gesture zoom on touch terminals
      },
      {
        type: 'slider', // Provide explicit physical slider bar for touch navigation
        height: 24,
        bottom: 8,
        handleSize: '120%'
      }
    ]
    ```

### 2.8 Real-Time Streaming Interaction (Pause on Hover)
- **Problem:** When high-frequency telemetry (1–5 Hz) arrives, updating the chart shifts data points leftward. If an engineer is hovering over an anomaly, the tooltip jitters or disappears.
- **Behavioral Contract:**
  1. **Hover Detection:** When the cursor enters the plot area, set an internal flag `isUserInspecting = true`.
  2. **Buffer Telemetry:** Incoming WebSocket/SSE points continue buffering into memory, but visual canvas auto-scrolling is temporarily paused.
  3. **Resume on Exit:** When mouse leaves or pinned tooltip is dismissed, the chart smoothly fast-forwards to the latest live edge.
