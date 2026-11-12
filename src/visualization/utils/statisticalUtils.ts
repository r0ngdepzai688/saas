/**
 * Statistical Process Control & Capability Utilities
 * Backward-Compatibility Facade
 *
 * Delegates to the pure math engine in `src/library/math` while preserving
 * exact function signatures and behaviors for legacy components.
 */

import {
  calculateMean as coreCalculateMean,
  calculateStandardDeviation as coreCalculateStandardDeviation,
  calculateMedian as coreCalculateMedian,
  calculateSpcLimits as coreCalculateSpcLimits,
  calculateProcessCapability as coreCalculateProcessCapability,
  generateGaussianDistribution as coreGenerateGaussianDistribution,
  evaluateNelsonRules as coreEvaluateNelsonRules,
  type SpcLimits as CoreSpcLimits,
} from '../../library/math/index.ts';

export function calculateMean(values: number[]): number {
  return coreCalculateMean(values);
}

export function calculateStandardDeviation(values: number[]): number {
  return coreCalculateStandardDeviation(values);
}

export function calculateMedian(values: number[]): number {
  return coreCalculateMedian(values);
}

export interface SpcLimits {
  mean: number;
  stdDev: number;
  ucl: number;
  lcl: number;
  sigma1Upper: number;
  sigma1Lower: number;
}

/**
 * Calculates authentic Shewhart Control Limits (X-bar / Individual)
 * Legacy behavior: clampNonNegativeLcl = true
 */
export function calculateSpcLimits(values: number[], sigmaMultiplier = 3): SpcLimits {
  const result = coreCalculateSpcLimits(values, {
    sigmaMultiplier,
    clampNonNegativeLcl: true,
  });

  return {
    mean: result.mean,
    stdDev: result.stdDev,
    ucl: result.ucl,
    lcl: result.lcl,
    sigma1Upper: result.sigma1Upper,
    sigma1Lower: result.sigma1Lower,
  };
}

export interface ProcessCapabilityResult {
  cp: number;
  cpk: number;
  mean: number;
  stdDev: number;
  isCapable: boolean;
}

export function calculateProcessCapability(
  values: number[],
  usl: number,
  lsl: number
): ProcessCapabilityResult {
  const result = coreCalculateProcessCapability(values, usl, lsl);
  return {
    cp: result.cp,
    cpk: result.cpk,
    mean: result.mean,
    stdDev: result.stdDev,
    isCapable: result.isCapable,
  };
}

/**
 * Generates continuous Gaussian normal distribution density curve
 */
export function generateGaussianNormalCurve(
  mean: number,
  stdDev: number,
  minX: number,
  maxX: number,
  steps = 80
): Array<[number, number]> {
  return coreGenerateGaussianDistribution(mean, stdDev, minX, maxX, steps);
}

/**
 * Evaluates Nelson Rule 1: Point falls beyond 3-sigma control limits
 */
export function detectOutOfControlPoints(
  values: number[],
  ucl: number,
  lcl: number
): Array<{ index: number; value: number; reason: string }> {
  const fakeLimits: CoreSpcLimits = {
    mean: (ucl + lcl) / 2,
    stdDev: (ucl - lcl) / 6,
    ucl,
    lcl,
    centerLine: (ucl + lcl) / 2,
    sigma1Upper: ucl,
    sigma1Lower: lcl,
    sigma2Upper: ucl,
    sigma2Lower: lcl,
    count: values.length,
    calculationMethod: 'sample-std-dev',
  };

  const violations = coreEvaluateNelsonRules(values, fakeLimits, { enabledRules: [1] });
  return violations.map((v) => ({
    index: v.index,
    value: v.value,
    reason: v.description,
  }));
}
