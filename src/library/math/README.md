# Pure Statistical Math Engine (`src/library/math/`)

The Statistical Math Engine provides **pure, zero-dependency mathematical and Six Sigma quality engineering algorithms** for enterprise analytics.

---

## 1. Module Structure

```
src/library/math/
├── math.types.ts     # TypeScript interfaces (SpcLimits, ProcessCapabilityResult, etc.)
├── spc.ts            # Mean, Sample StdDev (n-1), Moving Range, Shewhart I-MR & ±3s limits
├── nelsonRules.ts    # Nelson Rules 1–4 automated violation evaluator with window tracking
├── capability.ts     # Process Capability (Cp, Cpk) vs Process Performance (Pp, Ppk)
├── gaussian.ts       # Continuous Gaussian normal probability density generator
├── pareto.ts         # Juran's Pareto 80/20 triage calculator with inclusive/exclusive modes
├── index.ts          # Public export barrel
└── README.md         # Mathematical specifications and documentation
```

---

## 2. Statistical Methods & Formulas

### A. Descriptive Statistics
- **Sample Mean ($\bar{X}$):**
  $$\bar{X} = \frac{1}{n} \sum_{i=1}^n x_i$$
- **Sample Standard Deviation ($s$ - Bessel's correction with $n-1$):**
  $$s = \sqrt{\frac{1}{n-1} \sum_{i=1}^n (x_i - \bar{X})^2}$$
  *Measures total / overall process variation.*
- **Median:** Middle value of sorted observations.

### B. Shewhart Control Limits (ISO 7870-2 / ASTM E2587)
The engine explicitly distinguishes between two methods of establishing control limits:

1. **Authentic Shewhart Individuals / Moving Range (`method: 'moving-range'`):**
   - Consecutive moving ranges: $MR_i = |x_i - x_{i-1}|$ for $i = 2, \dots, n$.
   - Average moving range: $\bar{MR} = \frac{1}{n-1}\sum_{i=2}^n MR_i$.
   - Unbiased estimate of short-term within-subgroup dispersion:
     $$\hat{\sigma}_{within} = \frac{\bar{MR}}{d_2} \quad (d_2 = 1.128379 \text{ for } n = 2)$$
   - Control limits for the Individuals ($X$) chart:
     $$UCL_X = \bar{X} + 3\hat{\sigma}_{within} = \bar{X} + 2.66\bar{MR}, \quad LCL_X = \bar{X} - 3\hat{\sigma}_{within} = \bar{X} - 2.66\bar{MR}$$
   - Companion Moving Range ($MR$) chart limits:
     $$CL_{MR} = \bar{MR}, \quad UCL_{MR} = D_4 \bar{MR} = 3.267 \bar{MR}, \quad LCL_{MR} = 0$$

2. **Generic Process Spread / Empirical 3s (`method: 'sample-std-dev'` - Default):**
   - Uses overall sample standard deviation $s$:
     $$UCL = \bar{X} + 3s, \quad LCL = \bar{X} - 3s$$
   - *Note on usage:* When a process exhibits systematic drift or shifts, $s$ is inflated by the shift. In formal SPC, the `moving-range` method is preferred because $\bar{MR}$ is immune to overall trends.

### C. Nelson Rules for Special Cause Detection
- **Rule 1 (Beyond $\pm 3\sigma$):** Point $> UCL$ or $< LCL$.
- **Rule 2 (Run of 9):** Nine (9) consecutive points on the same side of the center line ($\bar{X}$).
  *Boundary rule:* A point exactly equal to $\bar{X}$ breaks the run and resets the counter to 0.
- **Rule 3 (Trend of 6):** Six (6) consecutive points continually increasing or continually decreasing.
  *Boundary rule:* Equal adjacent points ($x_i = x_{i-1}$) break the strictly monotonic trend.
- **Rule 4 (Oscillation of 14):** Fourteen (14) points alternating up and down.
  *Boundary rule:* Flat steps break the alternating sequence.
- **Window Tracking:** Each violation returns `windowIndices: number[]`, allowing frontend charts to highlight the entire sequence (e.g. all 9 points of Rule 2 or all 6 points of Rule 3).

### D. Process Capability ($C_p, C_{pk}$) vs Process Performance ($P_p, P_{pk}$) (AIAG / ISO 22514)
The engine provides formal separation between short-term potential and long-term actual performance:

| Metric | Name | Formula | Dispersion Basis ($\sigma$) |
| :--- | :--- | :--- | :--- |
| **$P_p$** | Process Performance | $\frac{USL - LSL}{6s}$ | Overall sample standard deviation $s$ ($n-1$) |
| **$P_{pk}$** | Process Performance Index | $\min\left(\frac{USL - \bar{X}}{3s}, \frac{\bar{X} - LSL}{3s}\right)$ | Overall sample standard deviation $s$ ($n-1$) |
| **$C_p$** | Process Capability | $\frac{USL - LSL}{6\hat{\sigma}_{within}}$ | Within-subgroup short-term dispersion ($\bar{MR} / 1.128$) |
| **$C_{pk}$** | Process Capability Index | $\min\left(\frac{USL - \bar{X}}{3\hat{\sigma}_{within}}, \frac{\bar{X} - LSL}{3\hat{\sigma}_{within}}\right)$ | Within-subgroup short-term dispersion ($\bar{MR} / 1.128$) |

*Capability Benchmark:* A process with $C_{pk} \ge 1.33$ is considered capable (Six Sigma standard).

### E. Pareto 80/20 Vital Few Triage
- **Threshold Modes:**
  - `thresholdMode: 'inclusive'` (Default): Includes the category that causes the cumulative percentage to meet or cross 80%. For example, with percentages 35%, 68%, 84%, 93%, 100%, the third category (84%) is marked `isVitalFew: true` to ensure at least 80% of defect volume is targeted.
  - `thresholdMode: 'exclusive'`: Only categories with cumulative percentage $\le 80\%$ are marked `isVitalFew: true`.
- **Stable Sorting:** Preserves the original input index as a tie-breaker when defect counts are identical.
- **Validation:** Filters negative and non-numeric values; gracefully handles zero totals.

---

## 3. Comparison with Previous Implementation (`statisticalUtils.ts`)

| Feature | Legacy `statisticalUtils.ts` | Extracted `src/library/math/` | Improvement Rationale |
| :--- | :--- | :--- | :--- |
| **SPC Formula** | Only generic $\bar{X} \pm 3s$ | Supports both $\bar{X} \pm 3s$ and Shewhart I-MR ($\bar{MR}/d_2$) | Conforms strictly to ISO 7870-2 and prevents limit inflation during process drift. |
| **Moving Range Limits** | Not implemented | Computes $CL_{MR} = \bar{MR}$ and $UCL_{MR} = 3.267\bar{MR}$ | Enables full dual-axis I-MR control charting. |
| **Capability vs Performance** | Conflated $C_p/C_{pk}$ with $P_p/P_{pk}$ | Distinguishes $C_p/C_{pk}$ ($\hat{\sigma}_{within}$) from $P_p/P_{pk}$ ($s$) | Aligns with AIAG SPC 2nd Edition standards. |
| **Nelson Rules** | Only Rule 1 | Rules 1, 2, 3, and 4 with full `windowIndices` tracking | Pinpoints the entire run sequence for visual highlighting on charts. |
| **Center Line Boundary** | Not handled | Points on center line reset Rule 2 | Eliminates false-positive shift alarms. |
| **Pareto Crossing** | Ad-hoc $\le 80\%$ | Configurable `inclusive` / `exclusive` with stable sorting | Solves boundary ambiguity when crossing 80%. |
