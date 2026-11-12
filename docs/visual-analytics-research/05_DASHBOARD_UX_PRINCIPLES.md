# 05. DASHBOARD UX & ERGONOMIC PRINCIPLES 2026
**Document:** `docs/visual-analytics-research/05_DASHBOARD_UX_PRINCIPLES.md`  
**Theoretical Foundation:** Tableau Eye-Tracking Research & Industrial Human Factors Engineering (ISO 9241-210)  

---

## 1. COGNITIVE FOUNDATIONS & EYE-TRACKING FINDINGS

Empirical research conducted by Tableau Research (*"How Do People Read Dashboards?"*) reveals four critical human factors that govern dashboard comprehension:

### 1.1 The Inverted Pyramid of Information
Readers consume dashboards following an inverted pyramid structure:
1. **The Lead (Top 15% of Screen):** Primary Situation / BANs (Big Ass Numbers). What is our status right now?
2. **The Body (Middle 55% of Screen):** Macro Trends, Correlations & Distributions. How did we get here, and what is the trajectory?
3. **The Tail (Bottom 30% of Screen):** Operational Ledgers, Actionable Anomaly Feeds & Detailed Audit Records. What exact batch or machine requires immediate intervention?

### 1.2 Visual Saliency Competition
- **Tableau Research Finding:** Visual saliency (what naturally pops out visually due to high contrast, bright neon accents, or aggressive borders) constantly competes with semantic hierarchy.
- **The AI Slop Hazard:** When AI tools apply glassmorphism, glowing borders, and gradient fills indiscriminately to every card, user gaze jumps randomly across the screen. Critical alerts (such as a stopped production line) fail to register because they are drowned out by decorative visual noise.
- **Ergonomic Rule:** Reserve high visual saliency strictly for **critical state changes** (unplanned stoppage, out-of-control statistical limits). Baseline structural containers must maintain calm, neutral visual discipline.

### 1.3 The Top-Left Fixation Habit
Regardless of whether users follow an F-shaped, Z-shaped, or exploratory scanning pattern, eye-tracking confirms that user gaze consistently anchors at the **top-left corner** within the first 300ms of loading a dashboard.
- **Rule:** The upper-left quadrant must be anchored by the primary status identifier (e.g., Plant Status, Overall Equipment Effectiveness, or Primary Corporate KPI). Never place secondary filter dropdowns or decorative icons in this prime real estate.

---

## 2. COMPARATIVE DESIGN PROFILES: EXECUTIVE VS. OPERATIONAL

Dashboards cannot be designed with a one-size-fits-all aesthetic. The system defines two distinct ergonomic operational profiles:

| Design Dimension | Profile A: Executive Strategic Dashboard | Profile B: Operational Monitoring Board (MES/SCADA) |
| :--- | :--- | :--- |
| **Primary User** | VP of Quality, Chief Operating Officer, Plant Director | Shift Supervisor, QC Inspector, Line Operator |
| **Viewing Context** | Desktop laptop, executive boardroom monitor | Plant floor terminal, overhead wall-mounted TV |
| **Reading Distance** | 50 cm – 70 cm (Personal screen) | 1.5 m – 4.0 m (At a distance while walking the line) |
| **Lighting Environment**| Controlled ambient office lighting | Harsh industrial fluorescent or natural factory sunlight |
| **Aesthetic Language**| **Warm Glassmorphism & Soft UI** | **Flat High-Contrast & Solid Panels (Zero Glass)** |
| **Container Surface** | Translucent ivory/cream, subtle specular rim | 100% Opaque pure white (`#FFFFFF`) or Slate (`#0F172A`) |
| **Font Size Baseline** | 13px – 14px body, 24px – 28px BANs | 14px – 16px body, 32px – 42px BANs |
| **Motion Physics** | Fluid spring transitions, staggered reveals | **Functional Only:** Subtle pulse on stoppage / alert |
| **Table Treatment** | Compact glass cards with hover elevation | Flat, high-contrast rows with bold zebra striping |

---

## 3. COLOR ERGONOMICS & ACCESSIBILITY (WCAG AAA)

### 3.1 The 60-30-10 Color Budget
To prevent cognitive overload, dashboard surfaces adhere to a strict chromatic budget:
- **60% Dominant Neutral:** Canvas base, container backings, subtle gridlines (`#FAF6EE`, `#F8FAFC`, `#0F172A`).
- **30% Structural Secondary:** Typography, axis labels, inactive icons, table headers (`#334155`, `#64748B`).
- **10% Semantic Accent:** Directed visual attention (Blue = Normal, Green = Optimal, Amber = Warning, Crimson = Critical Stoppage).

### 3.3 Factory Lighting, Glare & Industrial High-Contrast
- **Physical Environment:** Shop floors often suffer from overhead fluorescent reflections and sunlight washing out displays.
- **Surface Contrast:** In **Profile B (Operational Monitoring)**, never use subtle translucent glass or low-contrast gray-on-gray borders. Use minimum 7:1 contrast for all critical KPI metrics.
- **Critical Alert Signaling:**
  - When an out-of-control condition or machine stoppage occurs:
    - Display persistent high-contrast banner with bold severity icon.
    - Animate a subtle CSS pulse (duration: 1.5s, `prefers-reduced-motion` compliant).
    - Avoid continuous strobe or jarring flashing that causes operator seizure or alarm fatigue.

---

## 4. DENSITY & SCANNING EFFICIENCY STANDARDS

1. **The 5-Second Comprehension Rule:** An operator must be able to glance at the dashboard for 5 seconds and answer: *"Is production running nominally, and which line requires attention?"*
2. **Grid Consistency:** All dashboards adhere to a 12-column responsive layout with standardized `24px` gutter spacing. Cards must never use arbitrary inline margins.
3. **Tabular Numerics (`tabular-nums`):** All numerical figures across KPI cards, tables, and tooltips must utilize monospaced numeric glyphs (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during real-time data streaming.
4. **Contextual Storytelling over Raw Numbers:**
   - *Bad:* `Defect Rate: 2.8%`
   - *Good:* `Defect Rate: 2.8% (Target: 1.5% | +1.3% Gap | Top Contributor: Pin Hole)`
