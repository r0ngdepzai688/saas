/**
 * Statistical Process Control (SPC) Limits & Descriptive Statistics
 * Pure TypeScript mathematical implementations adhering to ISO 7870-2 & ASTM E2587.
 */

import type { MrLimits, SpcLimits, SpcLimitsOptions } from './math.types.ts';

/**
 * Standard statistical constants for Shewhart Individuals / Moving Range (I-MR) charts:
 * For subgroup size n = 2:
 *   d2 = 1.128379 (Unbiased estimation of sigma from average moving range: sigma_hat = MR_bar / d2)
 *   D4 = 3.267 (Upper limit for moving range chart: UCL_MR = D4 * MR_bar)
 */
export const SPC_CONSTANTS = {
  d2: 1.1283791670955126,
  D4: 3.266504,
  E2: 2.659615, // 3 / d2
} as const;

/**
 * Filters out null, undefined, NaN, and infinite values from an input array.
 */
export function sanitizeNumericArray(values: readonly unknown[]): number[] {
  if (!Array.isArray(values)) return [];
  const clean: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v === 'number' && Number.isFinite(v)) {
      clean.push(v);
    }
  }
  return clean;
}

/**
 * Calculates arithmetic mean (sample average):
 *   \bar{X} = \frac{1}{n} \sum_{i=1}^n x_i
 */
export function calculateMean(values: readonly number[]): number {
  const clean = sanitizeNumericArray(values);
  if (clean.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    sum += clean[i];
  }
  return sum / clean.length;
}

/**
 * Calculates sample standard deviation (Bessel's correction, n - 1):
 *   s = \sqrt{ \frac{1}{n - 1} \sum_{i=1}^n (x_i - \bar{X})^2 }
 *
 * If values has length <= 1, returns 0.
 */
export function calculateStandardDeviation(
  values: readonly number[],
  useSampleStdDev = true
): number {
  const clean = sanitizeNumericArray(values);
  if (clean.length <= 1) return 0;

  const mean = calculateMean(clean);
  let varianceSum = 0;
  for (let i = 0; i < clean.length; i++) {
    const diff = clean[i] - mean;
    varianceSum += diff * diff;
  }

  const denominator = useSampleStdDev ? clean.length - 1 : clean.length;
  return Math.sqrt(varianceSum / denominator);
}

/**
 * Calculates the sequence of moving ranges between consecutive observations:
 *   MR_i = |x_i - x_{i-1}| for i = 1, ..., n-1
 */
export function calculateMovingRange(values: readonly number[]): number[] {
  const clean = sanitizeNumericArray(values);
  if (clean.length <= 1) return [];

  const ranges: number[] = [];
  for (let i = 1; i < clean.length; i++) {
    ranges.push(Math.abs(clean[i] - clean[i - 1]));
  }
  return ranges;
}

/**
 * Calculates the average moving range (\bar{MR}):
 *   \bar{MR} = \frac{1}{n - 1} \sum_{i=2}^n |x_i - x_{i-1}|
 */
export function calculateAverageMovingRange(values: readonly number[]): number {
  const ranges = calculateMovingRange(values);
  if (ranges.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < ranges.length; i++) {
    sum += ranges[i];
  }
  return sum / ranges.length;
}

/**
 * Calculates the median of an array of numbers.
 */
export function calculateMedian(values: readonly number[]): number {
  const clean = sanitizeNumericArray(values);
  if (clean.length === 0) return 0;

  const sorted = [...clean].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculates Shewhart Control Limits:
 *
 * Method 1 ('moving-range' - Authentic Shewhart I-MR / ISO 7870-2):
 *   \hat{\sigma}_{within} = \bar{MR} / d_2 (d_2 = 1.128)
 *   UCL = \bar{X} + 3 * \hat{\sigma}_{within}
 *   LCL = \bar{X} - 3 * \hat{\sigma}_{within}
 *   MR Chart: CL_MR = \bar{MR}, UCL_MR = D_4 * \bar{MR} (D_4 = 3.267), LCL_MR = 0
 *
 * Method 2 ('sample-std-dev' - Generic Process Spread / Empirical ±3s):
 *   s = sampleStandardDeviation(n - 1)
 *   UCL = \bar{X} + 3 * s
 *   LCL = \bar{X} - 3 * s
 */
export function calculateSpcLimits(
  values: readonly number[],
  options?: SpcLimitsOptions
): SpcLimits {
  const clean = sanitizeNumericArray(values);
  const sigmaMultiplier = options?.sigmaMultiplier ?? 3;
  const calculationMethod = options?.calculationMethod ?? 'sample-std-dev';
  const clampNonNegative = options?.clampNonNegativeLcl ?? false;

  if (clean.length === 0) {
    return {
      mean: 0,
      stdDev: 0,
      ucl: 0,
      lcl: 0,
      centerLine: 0,
      sigma1Upper: 0,
      sigma1Lower: 0,
      sigma2Upper: 0,
      sigma2Lower: 0,
      count: 0,
      calculationMethod,
    };
  }

  const mean = calculateMean(clean);
  const sampleStdDev = calculateStandardDeviation(clean);
  const avgMr = clean.length > 1 ? calculateAverageMovingRange(clean) : 0;

  let effectiveStdDev = sampleStdDev;
  let mrLimits: MrLimits | undefined;

  if (calculationMethod === 'moving-range' && clean.length > 1) {
    // Shewhart I-MR within-subgroup dispersion
    effectiveStdDev = avgMr / SPC_CONSTANTS.d2;
    mrLimits = {
      cl: Number(avgMr.toFixed(3)),
      ucl: Number((SPC_CONSTANTS.D4 * avgMr).toFixed(3)),
      lcl: 0,
    };
  }

  const rawUcl = mean + sigmaMultiplier * effectiveStdDev;
  let rawLcl = mean - sigmaMultiplier * effectiveStdDev;

  if (clampNonNegative && rawLcl < 0) {
    rawLcl = 0;
  }

  const sigma1Upper = mean + effectiveStdDev;
  const sigma1Lower = clampNonNegative ? Math.max(0, mean - effectiveStdDev) : mean - effectiveStdDev;
  const sigma2Upper = mean + 2 * effectiveStdDev;
  const sigma2Lower = clampNonNegative ? Math.max(0, mean - 2 * effectiveStdDev) : mean - 2 * effectiveStdDev;

  return {
    mean: Number(mean.toFixed(3)),
    stdDev: Number(effectiveStdDev.toFixed(3)),
    centerLine: Number(mean.toFixed(3)),
    ucl: Number(rawUcl.toFixed(3)),
    lcl: Number(rawLcl.toFixed(3)),
    sigma1Upper: Number(sigma1Upper.toFixed(3)),
    sigma1Lower: Number(sigma1Lower.toFixed(3)),
    sigma2Upper: Number(sigma2Upper.toFixed(3)),
    sigma2Lower: Number(sigma2Lower.toFixed(3)),
    count: clean.length,
    calculationMethod,
    averageMovingRange: clean.length > 1 ? Number(avgMr.toFixed(3)) : undefined,
    mrLimits,
  };
}
