/**
 * Visual Design Intelligence Library - Statistical Math Engine Type Contracts
 * Pure TypeScript: Zero dependencies on React, ECharts, or DOM.
 */

export type SpcCalculationMethod = 'sample-std-dev' | 'moving-range';

export interface MrLimits {
  readonly cl: number;
  readonly ucl: number;
  readonly lcl: number;
}

export interface SpcLimits {
  readonly mean: number;
  readonly stdDev: number;
  readonly ucl: number;
  readonly lcl: number;
  readonly centerLine: number;
  readonly sigma1Upper: number;
  readonly sigma1Lower: number;
  readonly sigma2Upper: number;
  readonly sigma2Lower: number;
  readonly count: number;
  readonly calculationMethod: SpcCalculationMethod;
  readonly averageMovingRange?: number;
  readonly mrLimits?: MrLimits;
}

export interface SpcLimitsOptions {
  /**
   * Sigma multiplier for control limits. Standard Shewhart is 3.0.
   * Default: 3.0
   */
  readonly sigmaMultiplier?: number;
  /**
   * Method for estimating process dispersion (sigma):
   * - 'sample-std-dev': Uses overall sample standard deviation (s with n-1). Generic process spread.
   * - 'moving-range': Uses average moving range (MR_bar / d2 with d2 = 1.128). Authentic Shewhart I-MR.
   * Default: 'sample-std-dev' (preserves legacy compatibility)
   */
  readonly calculationMethod?: SpcCalculationMethod;
  /**
   * Whether to clamp LCL to 0 for non-negative physical properties (e.g., defect count, particle size).
   * Default: false (preserves pure mathematical limits)
   */
  readonly clampNonNegativeLcl?: boolean;
}

export type CapabilityDispersionMethod = 'sample-std-dev' | 'moving-range';

export interface ProcessCapabilityResult {
  /**
   * Potential Capability Index (Short-term / Within-subgroup variation):
   *   Cp = (USL - LSL) / (6 * sigma_within)
   */
  readonly cp: number;
  /**
   * Minimum Capability Index (Short-term / Within-subgroup variation):
   *   Cpk = min(Cpu, Cpl)
   */
  readonly cpk: number;
  readonly cpu: number;
  readonly cpl: number;

  /**
   * Process Performance Indices (Long-term / Overall variation s):
   *   Pp = (USL - LSL) / (6 * s)
   *   Ppk = min(Ppu, Ppl)
   */
  readonly pp: number;
  readonly ppk: number;
  readonly ppu: number;
  readonly ppl: number;

  readonly mean: number;
  readonly stdDev: number;
  readonly stdDevWithin?: number;
  readonly stdDevOverall: number;
  readonly usl: number;
  readonly lsl: number;
  readonly isCapable: boolean;
  readonly targetThreshold: number;
  readonly dispersionMethod: CapabilityDispersionMethod;
}

export interface ProcessCapabilityOptions {
  /**
   * Benchmark threshold for process capability (Cpk / Ppk).
   * Default: 1.33 (4-sigma automotive/semiconductor industry standard).
   */
  readonly targetThreshold?: number;
  /**
   * Method used for dispersion estimation in Cp/Cpk:
   * - 'moving-range': Uses MR_bar / 1.128 (Within-subgroup short-term). Formally Cp/Cpk.
   * - 'sample-std-dev': Uses overall sample standard deviation s. Formally Pp/Ppk.
   * Default: 'sample-std-dev'
   */
  readonly dispersionMethod?: CapabilityDispersionMethod;
}

export type NelsonRuleId = 1 | 2 | 3 | 4;

export interface NelsonRuleViolation {
  readonly ruleId: NelsonRuleId;
  readonly ruleName: string;
  readonly index: number;
  readonly value: number;
  readonly description: string;
  /**
   * All indices involved in the violating pattern window.
   * Enables frontend charts to highlight the full sequence (e.g. 9 points in Rule 2, 6 in Rule 3).
   */
  readonly windowIndices: readonly number[];
}

export type GaussianPoint = [x: number, density: number];

export interface ParetoInputItem {
  readonly category: string;
  readonly value: number;
}

export type ParetoThresholdMode = 'inclusive' | 'exclusive';

export interface ParetoOptions {
  /**
   * Cumulative percentage cutoff for the Vital Few.
   * Default: 80 (%)
   */
  readonly thresholdPercent?: number;
  /**
   * Behavior when an item crosses the threshold:
   * - 'inclusive': The item that crosses the threshold is included in the Vital Few (covers >= threshold).
   * - 'exclusive': Only items with cumulative percentage <= threshold are included.
   * Default: 'inclusive' (Standard industrial triage)
   */
  readonly thresholdMode?: ParetoThresholdMode;
}

export interface ParetoDistributionItem {
  readonly category: string;
  readonly value: number;
  readonly cumulativeValue: number;
  readonly cumulativePercentage: number;
  readonly isVitalFew: boolean;
  readonly originalIndex: number;
}
