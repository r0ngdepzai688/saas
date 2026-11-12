# 02. ENTERPRISE CHART CATALOG 2026
**Document:** `docs/visual-analytics-research/02_CHART_CATALOG.md`  
**Standard:** Enterprise Visual Analytics Specification  
**Coverage:** 24 Meaningful Analytical Visualization Archetypes across 6 Categories  

---

## CATEGORY A: KPI & PERFORMANCE ANALYTICS

### 1. Metric Card with Contextual Sparkline
- **Analytical Purpose:** Instant situational assessment of current performance versus historical trend.
- **Required Data:** Metric value (number), target (number), timestamped historical array (number[]).
- **Recommended Scenario:** Executive summary rows, plant floor overview headers.
- **Visual Encoding:** Tabular primary number (saliency anchor), semantic delta badge (+/-%), 20-point inline vector sparkline.
- **Interaction:** Hover displays mini-tooltip with exact date/value of sparkline vertices.
- **ECharts Support:** Native / Lightweight SVG (Recharts or ECharts micro-instance).
- **Priority:** **MUST HAVE**

### 2. Bullet Chart (Target vs. Actual with Qualitative Bands)
- **Analytical Purpose:** Evaluates current operational achievement against target benchmarks within qualitative performance ranges (Poor, Satisfactory, Good).
- **Required Data:** Current value, target marker, qualitative band thresholds (e.g., [60, 80, 100]).
- **Recommended Scenario:** Line OEE tracking, department milestone evaluation, budget utilization.
- **Visual Encoding:** Horizontal bar (actual), vertical cross-rule (target), layered background shaded bands (qualitative zones).
- **Interaction:** Tooltip detailing variance from target and current qualitative tier.
- **ECharts Support:** Native (Composite Bar + Scatter mark).
- **Priority:** **MUST HAVE**

### 3. Production & Financial Waterfall Chart
- **Analytical Purpose:** Deconstructs cumulative gains and losses sequentially from a starting gross volume to the final net outcome.
- **Required Data:** Array of category names, signed numeric values (positive or negative), and total flags.
- **Recommended Scenario:** Reconciling planned capacity against downtime, changeover delay, and scrap loss.
- **Visual Encoding:** Floating stepped bars connected by subtle dotted baseline guides; green for accretive steps, crimson for deductive steps, dark slate for totals.
- **Interaction:** Tooltip detailing gross percentage deduction of each individual loss category.
- **ECharts Support:** Native (Stacked Bar with transparent placeholder base).
- **Priority:** **MUST HAVE**

### 4. Multi-Ring Radial Gauge
- **Analytical Purpose:** Displays percentage utilization or equipment health across multiple concurrent dimensions in a compact footprint.
- **Required Data:** Array of `{ name: string, value: number, max: number, color: string }`.
- **Recommended Scenario:** Monitoring line availability, performance, and quality indices simultaneously on equipment terminals.
- **Visual Encoding:** Concentric circular arcs with rounded cap terminations; center text displays composite score.
- **Interaction:** Hover on individual ring highlights corresponding metric and dims neighboring rings.
- **ECharts Support:** Native (`series: 'gauge'` or custom polar bar).
- **Priority:** **SHOULD HAVE**

---

## CATEGORY B: QUALITY & DEFECT ANALYTICS

### 5. Pareto 80/20 Distribution Chart (Frequency & COPQ Weighted)
- **Analytical Purpose:** Isolates the vital 20% root causes responsible for 80% of cumulative losses (Juran's Pareto Principle). Supports dual evaluation modes: by **Defect Incident Frequency** and by **Cost of Poor Quality (COPQ)** scrap dollar value.
- **Required Data:** Defect category names, incident counts, unit scrap cost ($), automatic cumulative percent calculation, and severity classification (Critical, Major, Minor).
- **Recommended Scenario:** Defect triage meetings, engineering quality audits, scrap mitigation reviews.
- **Visual Encoding:** Left Y-axis with descending bars (colored by severity class: Crimson = Critical, Amber = Major, Slate = Minor); Right Y-axis with 0–100% cumulative line; horizontal dashed red rule at 80% inflection threshold.
- **Interaction:** Hover highlights bar and corresponding cumulative point; toggle button to switch ranking between "Incident Count" and "Total Scrap Cost ($)"; click-to-filter defect category across linked lot tables.
- **ECharts Support:** Native (Dual-axis Bar + Line).
- **Priority:** **MUST HAVE**

### 6. Defect Concentration Spatial Heatmap
- **Analytical Purpose:** Pinpoints spatial clusters and machine station vulnerabilities where specific defect types accumulate.
- **Required Data:** Station IDs (X-axis), Defect classifications (Y-axis), incident counts (Z-value matrix).
- **Recommended Scenario:** Identifying whether Pin Hole defects are localized to Dipping Tank 1 or distributed factory-wide.
- **Visual Encoding:** 2D grid cells colored by continuous gradient (`#FEF2F2` to `#991B1B`); numeric labels in cell centers.
- **Interaction:** Tooltip detailing station name, defect name, and exact occurrence count; click triggers drill-down to lot batch history.
- **ECharts Support:** Native (`series: 'heatmap'` + `visualMap`).
- **Priority:** **MUST HAVE**

### 7. Defect Trend & Moving Average Overlay
- **Analytical Purpose:** Tracks defect emergence over time while smoothing high-frequency noise to detect underlying degradation trends.
- **Required Data:** Time-series defect counts, calculated 7-day or 30-day moving average (SMA).
- **Recommended Scenario:** Daily quality standups, shift-over-shift scrap rate tracking.
- **Visual Encoding:** Bar chart of daily counts with smoothed overlay curve; area fill below moving average curve.
- **Interaction:** Crosshair tracking with dual tooltip reporting raw daily count and smoothed trendline.
- **ECharts Support:** Native (Bar + Line with `dataset.transform` moving average).
- **Priority:** **MUST HAVE**

### 8. Hierarchical Defect Treemap
- **Analytical Purpose:** Displays nested proportions of total defect volume grouped hierarchically by Plant $\to$ Production Line $\to$ Machine Station $\to$ Defect Code.
- **Required Data:** Hierarchical tree object with `name`, `value`, and nested `children` arrays.
- **Recommended Scenario:** Executive quality reviews exploring which plant zones generate the greatest scrap dollar value.
- **Visual Encoding:** Nested rectangular tiles where area is proportional to defect count; color saturation mapped to severity.
- **Interaction:** Click to zoom/drill-down into lower hierarchical levels; breadcrumb bar for navigation.
- **ECharts Support:** Native (`series: 'treemap'`).
- **Priority:** **SHOULD HAVE**

---

## CATEGORY C: STATISTICAL PROCESS CONTROL (SPC)

### 9. Shewhart Individuals & Moving Range (I-MR) Control Chart
- **Analytical Purpose:** Evaluates whether continuous individual measurements exhibit statistical stability over time without rational subgrouping. Evaluates process dispersion first via the Moving Range (MR) chart, then process mean via the Individual ($X$) chart.
- **Required Data:** Ordered sequence of individual measurements ($X_i$), calculated Moving Range ($MR_i = |X_i - X_{i-1}|$ for span $k=2$).
- **Recommended Scenario:** Chemical bath concentration monitoring, glove thickness testing, destructive test samples, batch cycle times.
- **Mathematical Specification (ISO 7870-2 / AIAG SPC):**
  - **Moving Range Chart (MR):**
    - Center Line: $CL_{MR} = \overline{MR}$
    - Upper Control Limit: $UCL_{MR} = D_4 \cdot \overline{MR} = 3.267 \cdot \overline{MR}$ (for $k=2$)
    - Lower Control Limit: $LCL_{MR} = D_3 \cdot \overline{MR} = 0$ (for $k=2$)
  - **Individual Measurement Chart ($X$):**
    - Center Line: $CL_X = \bar{X}$
    - Upper Control Limit: $UCL_X = \bar{X} + 3\frac{\overline{MR}}{d_2} = \bar{X} + 2.660 \cdot \overline{MR}$ (where $d_2 = 1.128$ for $k=2$)
    - Lower Control Limit: $LCL_X = \bar{X} - 3\frac{\overline{MR}}{d_2} = \bar{X} - 2.660 \cdot \overline{MR}$
- **Visual Encoding:** Dual vertically stacked charts sharing synchronized X-axis: Upper pane for Individual ($X$), lower pane for Moving Range ($MR$). Color-coded out-of-control point markers (red dot) with automated Western Electric / Nelson Rules 1–4 evaluation:
  - *Rule 1:* 1 point beyond Zone A ($> 3\sigma$).
  - *Rule 2:* 9 consecutive points on one side of center line.
  - *Rule 3:* 6 consecutive points steadily increasing or decreasing (trend).
  - *Rule 4:* 14 consecutive points alternating up and down (systematic oscillation).
- **Interaction:** Synchronized crosshair tracking between $X$ and $MR$ charts; tooltip detailing exact values and specific violated Nelson rule badge.
- **ECharts Support:** Native (Dual-grid ECharts instance with `markLine` and `markArea`).
- **Priority:** **MUST HAVE**

### 10. X-bar & R (Mean & Range) Control Chart
- **Analytical Purpose:** Monitors process central tendency and dispersion when data is collected in rational subgroups ($n = 3 \text{ to } 5$).
- **Required Data:** Subgroup timestamp, subgroup individual values ($x_1, \dots, x_n$), subgroup mean ($\bar{x}$), subgroup range ($R = x_{max} - x_{min}$).
- **Recommended Scenario:** Multi-cavity mold inspection, dimensional tolerances measured at fixed hourly intervals.
- **Mathematical Specification (ISO 7870-2):**
  - Subgroup Mean Chart: $CL = \bar{\bar{X}}$, $UCL/LCL = \bar{\bar{X}} \pm A_2 \bar{R}$
  - Subgroup Range Chart: $CL = \bar{R}$, $UCL = D_4 \bar{R}$, $LCL = D_3 \bar{R}$
  - **Standard SPC Factors Table:**
    - Subgroup $n = 3$: $A_2 = 1.023,\ D_3 = 0,\ D_4 = 2.574$
    - Subgroup $n = 4$: $A_2 = 0.729,\ D_3 = 0,\ D_4 = 2.282$
    - Subgroup $n = 5$: $A_2 = 0.577,\ D_3 = 0,\ D_4 = 2.114$
- **Visual Encoding:** Dual stacked charts: Top chart ($\bar{X}$) with $A_2\bar{R}$ limits; Bottom chart ($R$) with $D_3\bar{R}$ and $D_4\bar{R}$ limits.
- **Interaction:** Hovering over a subgroup point in the $\bar{X}$ chart simultaneously highlights the corresponding range in the $R$ chart.
- **ECharts Support:** Native (Linked dual-grid ECharts instance).
- **Priority:** **MUST HAVE**

### 11. Attribute Control Charts (p-Chart & np-Chart)
- **Analytical Purpose:** Monitors the proportion ($p$) or number ($np$) of nonconforming units when inspection results are binary (Pass/Fail).
- **Required Data:** Subgroup lot size ($n_i$), defective item count ($d_i$).
- **Recommended Scenario:** End-of-line final visual inspection pass/fail tracking with varying or constant batch sizes.
- **Visual Encoding:** Stepped variable control limits based on lot size $n_i$: $UCL/LCL = \bar{p} \pm 3\sqrt{\frac{\bar{p}(1-\bar{p})}{n_i}}$.
- **Interaction:** Tooltip detailing lot size, defect rate, and specific lot control bounds.
- **ECharts Support:** Native (Line with step control limits).
- **Priority:** **SHOULD HAVE**

### 12. Defect Count Control Charts (c-Chart & u-Chart)
- **Analytical Purpose:** Tracks the number of defects ($c$) or defects per unit area/volume ($u$) when multiple defects can occur on a single item.
- **Required Data:** Inspection sample unit quantity ($n_i$), total defect incident count ($c_i$).
- **Recommended Scenario:** Surface defects per square meter of fabric, pinhole count per 100 gloves.
- **Visual Encoding:** Data line with Poisson-derived control limits: $UCL/LCL = \bar{u} \pm 3\sqrt{\frac{\bar{u}}{n_i}}$.
- **Interaction:** Highlighting points violating run rules (e.g., 9 consecutive points on one side of center line).
- **ECharts Support:** Native (Line with dynamic limits).
- **Priority:** **SHOULD HAVE**

---

## CATEGORY D: PRODUCTION & OPERATIONAL MONITORING

### 13. Material Flow & Yield Workflow Sankey
- **Analytical Purpose:** Visualizes the conservation of volume and routing splits of production material from raw input through stations, rework, and scrap.
- **Required Data:** Array of unique stage nodes and directed flow links `{ source, target, value }`.
- **Recommended Scenario:** Tracing production bottleneck losses and identifying excessive recirculation in rework loops.
- **Visual Encoding:** Left-to-right directed ribbons where width is proportional to volume; color encodes target station health.
- **Interaction:** Hover over a station node highlights all upstream suppliers and downstream consumers.
- **ECharts Support:** Native (`series: 'sankey'`).
- **Priority:** **MUST HAVE**

### 14. Department Multi-Status Stacked Bar Chart
- **Analytical Purpose:** Compares workload progress and operational backlog across multiple factory departments simultaneously.
- **Required Data:** Department names, volume counts partitioned by status (Completed, In Progress, Blocked, Overdue).
- **Recommended Scenario:** Shift handover meetings, cross-departmental coordination reviews.
- **Visual Encoding:** Horizontal stacked bars with standardized semantic colors (Emerald = Done, Blue = Active, Crimson = Blocked).
- **Interaction:** Clicking a status segment filters the operational task table below to display only matching work orders.
- **ECharts Support:** Native (`series: 'bar'`, `stack: 'total'`).
- **Priority:** **MUST HAVE**

### 15. Operational Calendar Activity Heatmap
- **Analytical Purpose:** Uncovers day-of-week and seasonal cyclical patterns in equipment failures, scrap rates, and output volume.
- **Required Data:** ISO date strings (`YYYY-MM-DD`), aggregated daily metric value.
- **Recommended Scenario:** Long-term plant reliability analysis, evaluating shift performance differences (e.g., Friday night shift).
- **Visual Encoding:** Calendar year grid partitioned into monthly and daily blocks, shaded by continuous visual map.
- **Interaction:** Tooltip displaying full date, shift details, and metric; click selects date range for the entire dashboard.
- **ECharts Support:** Native (`calendar` coordinate system + `series: 'heatmap'`).
- **Priority:** **SHOULD HAVE**

### 16. Real-Time Production Output vs. Target Horizon
- **Analytical Purpose:** Tracks cumulative shift production against hourly linear target pace in real time.
- **Required Data:** Hour of shift (01:00 to 08:00), cumulative actual output, cumulative scheduled target line.
- **Recommended Scenario:** Plant floor overhead TV monitors, supervisor shift pacing boards.
- **Visual Encoding:** High-contrast blue area curve representing actual output; green dashed reference line representing expected pace.
- **Interaction:** Tooltip showing exact deficit/surplus pairs at each hour marker.
- **ECharts Support:** Native (Area + Line).
- **Priority:** **MUST HAVE**

---

## CATEGORY E: DISTRIBUTION & STATISTICAL ANALYSIS

### 17. Process Capability & Performance Histogram (Cp/Cpk & Pp/Ppk)
- **Analytical Purpose:** Evaluates whether continuous process output conforms to customer engineering tolerances ($USL, LSL$) under an assumed Gaussian normal distribution. Distinguishes statistically between **Potential Short-Term Capability ($C_p, C_{pk}$)** and **Overall Long-Term Performance ($P_p, P_{pk}$)**.
- **Required Data:** Array of continuous dimensional samples ($n \ge 50$), specification limits ($USL, LSL$), and target value ($T$).
- **Mathematical Specification (ISO 21747 / AIAG SPC):**
  - **Short-Term Capability ($C_p, C_{pk}$):** Uses within-subgroup standard deviation estimate:
    $$\hat{\sigma}_{within} = \frac{\overline{MR}}{d_2} = \frac{\overline{MR}}{1.128} \quad (\text{or } \frac{\bar{R}}{d_2})$$
    $$C_p = \frac{USL - LSL}{6\hat{\sigma}_{within}}$$
    $$C_{pk} = \min\left(\frac{USL - \bar{X}}{3\hat{\sigma}_{within}}, \frac{\bar{X} - LSL}{3\hat{\sigma}_{within}}\right)$$
  - **Long-Term Performance ($P_p, P_{pk}$):** Uses total sample standard deviation:
    $$s = \sqrt{\frac{1}{N-1}\sum_{i=1}^N (X_i - \bar{X})^2}$$
    $$P_p = \frac{USL - LSL}{6s}, \quad P_{pk} = \min\left(\frac{USL - \bar{X}}{3s}, \frac{\bar{X} - LSL}{3s}\right)$$
  - *Engineering Interpretation:* If $C_{pk} \gg P_{pk}$, the process has significant shift, drift, or between-subgroup instability that must be corrected.
- **Recommended Scenario:** New product introduction (NPI) qualification, mold validation, ISIR/PPAP sign-offs, annual process capability audits.
- **Visual Encoding:** Binned vertical frequency bars (Freedman-Diaconis rule); continuous red Gaussian probability density curve; vertical solid lines for $USL$, $LSL$, and dashed line for $\bar{X}$.
- **Interaction:** Scoreboard header displaying computed $C_p$, $C_{pk}$, $P_p$, $P_{pk}$, Mean, and $\hat{\sigma}$ with auto-pass/fail badge ($C_{pk} \ge 1.33$ = Green / Capable; $1.00 \le C_{pk} < 1.33$ = Amber / Marginal; $C_{pk} < 1.00$ = Red / Incapable).
- **ECharts Support:** Native (Bar + Line with pure TS computed Gaussian curve).
- **Priority:** **MUST HAVE**

### 18. Multi-Station Box and Whisker Plot (Boxplot)
- **Analytical Purpose:** Exposes distribution skewness, median variance, interquartile range (IQR), and extreme outliers across parallel machines.
- **Required Data:** 2D array of raw values per station; ECharts automatically derives [min, Q1, median, Q3, max].
- **Recommended Scenario:** Comparing thickness variance across 8 parallel dipping lines to detect machine miscalibration.
- **Visual Encoding:** Vertical box representing Q1–Q3; horizontal line representing median; whiskers extending to $1.5 \times IQR$; individual red dots for outlier lots.
- **Interaction:** Tooltip detailing full five-number summary and outlier sample IDs.
- **ECharts Support:** Native (`series: 'boxplot'` + `dataset.transform`).
- **Priority:** **MUST HAVE**

### 19. Measurement Scatter Plot with Confidence Ellipse
- **Analytical Purpose:** Analyzes bivariate correlation between two continuous parameters (e.g., Oven Temperature vs. Glove Tensile Strength).
- **Required Data:** Paired observations `[temperature, tensileStrength]`.
- **Recommended Scenario:** Root cause investigation, parameter optimization, regression modeling.
- **Visual Encoding:** 2D Cartesian scatter coordinates; optional regression trendline or 95% confidence ellipse boundary.
- **Interaction:** Box/Lasso brush selection to highlight and isolate abnormal clusters across related charts.
- **ECharts Support:** Native (`series: 'scatter'` + `brush`).
- **Priority:** **SHOULD HAVE**

### 20. Faceted Small Multiples Grid
- **Analytical Purpose:** Facilitates rapid parallel visual comparison of time-series trends across 6+ production lines without visual overlapping.
- **Required Data:** Multi-series time telemetry tagged with `lineId`.
- **Recommended Scenario:** Comparing hourly reject rate patterns across Lines 1 through 6 simultaneously.
- **Visual Encoding:** 2x3 or 3x2 grid of synchronized mini line charts sharing identical Y-axis scales.
- **Interaction:** Hovering on any chart synchronizes crosshair alignment across all other 5 mini-charts simultaneously.
- **ECharts Support:** Native (Multiple `grid`, `xAxis`, `yAxis` in single ECharts instance or connected instances via `echarts.connect`).
- **Priority:** **SHOULD HAVE**

---

## CATEGORY F: ADVANCED COMPARISON & MULTI-DIMENSIONAL ANALYSIS

### 21. Multi-Axis Quality Capability Radar
- **Analytical Purpose:** Evaluates and compares complex multi-dimensional capability profiles across vendors, production lines, or shifts.
- **Required Data:** Normalized scores (0–100) across 5 to 7 orthogonal quality dimensions.
- **Recommended Scenario:** Annual supplier audits, cross-plant performance benchmarking.
- **Visual Encoding:** Polygonal star grid with radial axes; colored semi-transparent area overlays for each entity.
- **Interaction:** Hover over legend highlights individual entity profile; tooltip shows scores across all axes.
- **ECharts Support:** Native (`series: 'radar'`).
- **Priority:** **MUST HAVE**

### 22. Throughput Volume vs. Defect PPM Combo Chart
- **Analytical Purpose:** Determines whether pushing machine speed beyond standard rated capacity induces nonlinear spikes in quality defects.
- **Required Data:** Time-series records of hourly volume (bars) and measured defect PPM (line).
- **Recommended Scenario:** Equipment speed optimization trials, shift load balancing.
- **Visual Encoding:** Dual Y-axis: Left axis displays high-volume bars (blue); Right axis displays defect PPM line (red).
- **Interaction:** Crosshair tracking with dual tooltip reporting both volume and defect rate simultaneously.
- **ECharts Support:** Native (Bar + Line with dual Y-axes).
- **Priority:** **MUST HAVE**

### 23. Correlation Matrix Heatmap
- **Analytical Purpose:** Identifies pairwise correlation coefficients ($r \in [-1, 1]$) across 6+ environmental and process variables.
- **Required Data:** Square correlation matrix between variables (e.g., Ambient Humidity, Bath Temp, Line Speed, PH Level, Cure Time, Defect Rate).
- **Recommended Scenario:** Six Sigma Black Belt DMAIC root cause analysis.
- **Visual Encoding:** Symmetric matrix grid colored with diverging palette (Blue = +1.0, White = 0.0, Crimson = -1.0).
- **Interaction:** Tooltip detailing Pearson correlation coefficient $r$ and $p$-value statistical significance.
- **ECharts Support:** Native (`series: 'heatmap'` + diverging `visualMap`).
- **Priority:** **OPTIONAL**

### 24. Target Variance Dumbbell / Lollipop Chart
- **Analytical Purpose:** Emphasizes the exact magnitude and direction of deviation between planned targets and actual achievements.
- **Required Data:** Dimension label, Target value, Actual value, Delta.
- **Recommended Scenario:** Departmental KPI gap analysis, monthly variance reporting.
- **Visual Encoding:** Horizontal line segment connecting a hollow circle (Target) to a filled solid circle (Actual), colored green if ahead and red if lagging.
- **Interaction:** Tooltip showing absolute gap and percentage variance.
- **ECharts Support:** Native (Custom series or Scatter + Lines).
- **Priority:** **SHOULD HAVE**
