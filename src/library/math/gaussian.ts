/**
 * Gaussian Normal Distribution Curve Generator
 * Pure TypeScript implementation for continuous probability density fitting.
 */

import type { GaussianPoint } from './math.types.ts';

/**
 * Generates coordinate pairs [x, probability density] for a continuous
 * normal distribution curve:
 *   f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)
 */
export function generateGaussianDistribution(
  mean: number,
  stdDev: number,
  minX: number,
  maxX: number,
  steps = 80
): GaussianPoint[] {
  if (!Number.isFinite(mean) || !Number.isFinite(stdDev) || stdDev <= 0) {
    return [];
  }
  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || maxX <= minX) {
    return [];
  }
  const safeSteps = Math.max(10, Math.floor(steps));
  const points: GaussianPoint[] = [];
  const stepSize = (maxX - minX) / safeSteps;
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const twoSigmaSq = 2 * stdDev * stdDev;

  for (let i = 0; i <= safeSteps; i++) {
    const x = minX + i * stepSize;
    const diff = x - mean;
    const exponent = -(diff * diff) / twoSigmaSq;
    const y = factor * Math.exp(exponent);
    points.push([Number(x.toFixed(3)), Number(y.toFixed(5))]);
  }

  return points;
}
