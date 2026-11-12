/**
 * Unit Tests for Pure Statistical Math Engine
 * Uses Node.js native test runner (node --test)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateMean,
  calculateStandardDeviation,
  calculateMedian,
  calculateMovingRange,
  calculateAverageMovingRange,
  calculateSpcLimits,
  sanitizeNumericArray,
  SPC_CONSTANTS,
} from '../spc.ts';
import { evaluateNelsonRules } from '../nelsonRules.ts';
import { calculateProcessCapability } from '../capability.ts';
import { generateGaussianDistribution } from '../gaussian.ts';
import { calculateParetoDistribution } from '../pareto.ts';

describe('Sanitize Numeric Array', () => {
  it('filters out null, undefined, NaN, and infinity', () => {
    const input = [10, null, NaN, 20, undefined, Infinity, -Infinity, 30, '40'] as unknown as number[];
    const result = sanitizeNumericArray(input);
    assert.deepEqual(result, [10, 20, 30]);
  });

  it('returns empty array for non-array inputs', () => {
    assert.deepEqual(sanitizeNumericArray(null as unknown as number[]), []);
    assert.deepEqual(sanitizeNumericArray(undefined as unknown as number[]), []);
  });
});

describe('Descriptive Statistics (Mean, StdDev, Median)', () => {
  it('calculates mean correctly', () => {
    assert.equal(calculateMean([10, 20, 30, 40]), 25);
    assert.equal(calculateMean([5]), 5);
    assert.equal(calculateMean([]), 0);
    assert.equal(calculateMean([-10, 10]), 0);
  });

  it('calculates sample standard deviation (Bessel correction, n-1)', () => {
    // Dataset: [2, 4, 4, 4, 5, 5, 7, 9], n=8, mean=5
    // Sum of squared diffs: 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32
    // Variance = 32 / (8 - 1) = 32 / 7 ≈ 4.571428
    // StdDev = sqrt(32 / 7) ≈ 2.1380899
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const stdDev = calculateStandardDeviation(values);
    assert.ok(Math.abs(stdDev - 2.138) < 0.001);

    // Single item and empty array return 0
    assert.equal(calculateStandardDeviation([42]), 0);
    assert.equal(calculateStandardDeviation([]), 0);

    // Constant array has 0 dispersion
    assert.equal(calculateStandardDeviation([5, 5, 5, 5]), 0);
  });

  it('calculates median correctly for odd and even lengths', () => {
    assert.equal(calculateMedian([3, 1, 2]), 2);
    assert.equal(calculateMedian([4, 1, 3, 2]), 2.5);
    assert.equal(calculateMedian([100]), 100);
    assert.equal(calculateMedian([]), 0);
  });
});

describe('Moving Range & Shewhart I-MR Calculations', () => {
  it('calculates moving ranges correctly', () => {
    const data = [10, 12, 11, 15];
    // MR: |12 - 10| = 2, |11 - 12| = 1, |15 - 11| = 4
    const mr = calculateMovingRange(data);
    assert.deepEqual(mr, [2, 1, 4]);

    const avgMr = calculateAverageMovingRange(data);
    assert.equal(avgMr, (2 + 1 + 4) / 3); // 7 / 3 ≈ 2.33333
  });

  it('computes authentic Shewhart I-MR control limits using d2 = 1.128', () => {
    // Dataset with steady drift where sample std dev is inflated compared to moving range
    const data = [10.0, 10.2, 10.1, 10.3, 10.2, 10.4, 10.3, 10.5];
    const imr = calculateSpcLimits(data, { calculationMethod: 'moving-range' });

    assert.equal(imr.calculationMethod, 'moving-range');
    assert.ok(imr.averageMovingRange !== undefined);
    assert.ok(imr.mrLimits !== undefined);
    assert.equal(imr.mrLimits?.lcl, 0);
    assert.ok(imr.mrLimits?.ucl > imr.mrLimits?.cl);

    // Verify sigma_within = MR_bar / 1.128379
    const expectedSigma = imr.averageMovingRange! / SPC_CONSTANTS.d2;
    assert.ok(Math.abs(imr.stdDev - expectedSigma) < 0.01);
  });
});

describe('Shewhart Control Limits (calculateSpcLimits)', () => {
  it('computes standard ±3σ limits with sample-std-dev method', () => {
    const data = [10, 11, 10, 9, 10, 10, 11, 9];
    const limits = calculateSpcLimits(data);

    assert.equal(limits.mean, 10);
    assert.equal(limits.centerLine, 10);
    assert.equal(limits.calculationMethod, 'sample-std-dev');
    assert.ok(limits.stdDev > 0);
    assert.ok(limits.ucl > limits.mean);
    assert.ok(limits.lcl < limits.mean);
    assert.equal(limits.count, 8);
    assert.ok(limits.sigma1Upper > limits.mean);
    assert.ok(limits.sigma1Lower < limits.mean);
  });

  it('handles zero dispersion gracefully', () => {
    const data = [7, 7, 7, 7];
    const limits = calculateSpcLimits(data);
    assert.equal(limits.mean, 7);
    assert.equal(limits.stdDev, 0);
    assert.equal(limits.ucl, 7);
    assert.equal(limits.lcl, 7);
  });

  it('handles empty dataset safely', () => {
    const limits = calculateSpcLimits([]);
    assert.equal(limits.mean, 0);
    assert.equal(limits.ucl, 0);
    assert.equal(limits.count, 0);
  });

  it('honors clampNonNegativeLcl option', () => {
    // Mean = 2, StdDev ≈ 2 -> mean - 3*stdDev = -4
    const data = [0, 2, 4];
    const unclamped = calculateSpcLimits(data, { clampNonNegativeLcl: false });
    assert.ok(unclamped.lcl < 0);

    const clamped = calculateSpcLimits(data, { clampNonNegativeLcl: true });
    assert.equal(clamped.lcl, 0);
  });
});

describe('Nelson Rules Evaluator', () => {
  const baseLimits = {
    mean: 10,
    stdDev: 1,
    ucl: 13,
    lcl: 7,
    centerLine: 10,
    sigma1Upper: 11,
    sigma1Lower: 9,
    sigma2Upper: 12,
    sigma2Lower: 8,
    count: 20,
    calculationMethod: 'sample-std-dev' as const,
  };

  it('detects Rule 1: Points beyond ±3σ and returns windowIndices', () => {
    const values = [10, 10.5, 13.5, 9.8, 6.5, 10.1];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [1] });

    assert.equal(violations.length, 2);
    assert.equal(violations[0].ruleId, 1);
    assert.equal(violations[0].index, 2);
    assert.equal(violations[0].value, 13.5);
    assert.deepEqual(violations[0].windowIndices, [2]);

    assert.equal(violations[1].ruleId, 1);
    assert.equal(violations[1].index, 4);
    assert.equal(violations[1].value, 6.5);
    assert.deepEqual(violations[1].windowIndices, [4]);
  });

  it('detects Rule 2: Run of 9 points on same side of center line and returns full window', () => {
    // 9 points above mean (10)
    const values = [10.2, 10.4, 10.1, 10.8, 10.3, 10.6, 10.7, 10.5, 10.9, 9.5];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [2] });

    assert.equal(violations.length, 1);
    assert.equal(violations[0].ruleId, 2);
    assert.equal(violations[0].index, 8); // 9th point
    assert.equal(violations[0].windowIndices.length, 9);
    assert.deepEqual(violations[0].windowIndices, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('proves that a point exactly on the center line resets Rule 2 run', () => {
    // 5 points above, 1 point exactly at mean (10.0), then 5 points above -> No run of 9!
    const values = [10.2, 10.4, 10.1, 10.8, 10.3, 10.0, 10.6, 10.7, 10.5, 10.9, 10.8];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [2] });
    assert.equal(violations.length, 0);
  });

  it('detects Rule 3: 6 consecutive increasing or decreasing points and returns window', () => {
    // 6 consecutive increasing points: 10.0 -> 10.2 -> 10.4 -> 10.6 -> 10.8 -> 11.0
    const values = [10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 9.0];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [3] });

    assert.equal(violations.length, 1);
    assert.equal(violations[0].ruleId, 3);
    assert.equal(violations[0].index, 5);
    assert.equal(violations[0].windowIndices.length, 6);
    assert.deepEqual(violations[0].windowIndices, [0, 1, 2, 3, 4, 5]);
  });

  it('proves that equal consecutive points reset Rule 3 monotonic trend', () => {
    // 10.0 -> 10.2 -> 10.2 (flat!) -> 10.4 -> 10.6 -> 10.8 -> 11.0
    const values = [10.0, 10.2, 10.2, 10.4, 10.6, 10.8, 11.0];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [3] });
    assert.equal(violations.length, 0);
  });

  it('detects Rule 4: 14 alternating points and returns full window', () => {
    // 14 points alternating up and down
    const values = [10, 11, 9, 11, 9, 11, 9, 11, 9, 11, 9, 11, 9, 11];
    const violations = evaluateNelsonRules(values, baseLimits, { enabledRules: [4] });

    assert.equal(violations.length, 1);
    assert.equal(violations[0].ruleId, 4);
    assert.equal(violations[0].index, 13);
    assert.equal(violations[0].windowIndices.length, 14);
  });

  it('gracefully returns empty array for short datasets', () => {
    const shortValues = [10.1, 10.2, 10.3];
    const violations = evaluateNelsonRules(shortValues, baseLimits);
    assert.equal(violations.length, 0);
  });
});

describe('Process Capability (Cp, Cpk) vs Process Performance (Pp, Ppk)', () => {
  it('correctly calculates capable process (Cpk >= 1.33) and populates Pp/Ppk', () => {
    const values = [11.8, 12.0, 12.2, 11.9, 12.1, 12.0];
    const result = calculateProcessCapability(values, 13.0, 11.0);

    assert.ok(result.cp > 1.33);
    assert.ok(result.cpk > 1.33);
    assert.equal(result.isCapable, true);
    assert.equal(result.pp, result.cp); // In sample-std-dev mode, Pp equals Cp
    assert.equal(result.ppk, result.cpk);
    assert.equal(result.dispersionMethod, 'sample-std-dev');
  });

  it('distinguishes Cp/Cpk from Pp/Ppk when using moving-range dispersion', () => {
    // Telemetry with gradual shift where overall s > within-subgroup sigma
    const values = [10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 11.2, 11.4];
    const result = calculateProcessCapability(values, 13.0, 9.0, {
      dispersionMethod: 'moving-range',
    });

    assert.equal(result.dispersionMethod, 'moving-range');
    assert.ok(result.stdDevWithin !== undefined);
    assert.ok(result.stdDevOverall > 0);
    // Because values drift, overall s is larger than moving range sigma
    assert.ok(result.stdDevOverall > result.stdDevWithin!);
    // Therefore Cp (short-term) is higher than Pp (long-term)
    assert.ok(result.cp > result.pp);
  });

  it('detects off-center process with high Cp but low Cpk', () => {
    const values = [12.7, 12.8, 12.9, 12.8, 12.7, 12.8];
    const result = calculateProcessCapability(values, 13.0, 11.0);

    assert.ok(result.cpk < 1.0);
    assert.equal(result.isCapable, false);
  });

  it('handles invalid specification bounds (USL <= LSL)', () => {
    const values = [10, 11, 12];
    const result = calculateProcessCapability(values, 10.0, 12.0); // USL < LSL!
    assert.equal(result.isCapable, false);
    assert.equal(result.cp, 0);
    assert.equal(result.cpk, 0);
  });

  it('handles zero dispersion safely', () => {
    const result = calculateProcessCapability([10, 10, 10], 12.0, 8.0);
    assert.equal(result.isCapable, false);
    assert.equal(result.stdDev, 0);
  });
});

describe('Gaussian Normal Curve Generator', () => {
  it('generates smooth coordinates centered at mean', () => {
    const curve = generateGaussianDistribution(0, 1, -3, 3, 60);
    assert.equal(curve.length, 61);

    // Peak should be at x = 0 (step 30)
    const peak = curve[30];
    assert.ok(Math.abs(peak[0]) < 0.01);
    assert.ok(Math.abs(peak[1] - 0.3989) < 0.005);
  });

  it('returns empty array for invalid inputs', () => {
    assert.deepEqual(generateGaussianDistribution(0, 0, -3, 3), []);
    assert.deepEqual(generateGaussianDistribution(0, -1, -3, 3), []);
    assert.deepEqual(generateGaussianDistribution(0, 1, 5, 2), []);
  });
});

describe('Pareto 80/20 Distribution & Audit Cases', () => {
  it('correctly handles the audit case: 35%, 68%, 84%, 93%, 100% in inclusive vs exclusive mode', () => {
    // 5 defects contributing:
    // A: 35, B: 33 (cum 68), C: 16 (cum 84), D: 9 (cum 93), E: 7 (cum 100)
    const defects = [
      { category: 'A', value: 35 },
      { category: 'B', value: 33 },
      { category: 'C', value: 16 },
      { category: 'D', value: 9 },
      { category: 'E', value: 7 },
    ];

    // INCLUSIVE MODE (Default): Category C crosses the 80% boundary (68% -> 84%).
    // It must be INCLUDED in Vital Few so the set covers >= 80% of total defects.
    const inclusive = calculateParetoDistribution(defects, { thresholdMode: 'inclusive' });
    assert.equal(inclusive[0].isVitalFew, true); // A (35%)
    assert.equal(inclusive[1].isVitalFew, true); // B (68%)
    assert.equal(inclusive[2].isVitalFew, true); // C (84%) - Crossing item included!
    assert.equal(inclusive[3].isVitalFew, false); // D (93%)
    assert.equal(inclusive[4].isVitalFew, false); // E (100%)

    // EXCLUSIVE MODE: Only categories with cumulative <= 80% are Vital Few.
    const exclusive = calculateParetoDistribution(defects, { thresholdMode: 'exclusive' });
    assert.equal(exclusive[0].isVitalFew, true); // A (35%)
    assert.equal(exclusive[1].isVitalFew, true); // B (68%)
    assert.equal(exclusive[2].isVitalFew, false); // C (84%) - Excluded because > 80%
    assert.equal(exclusive[3].isVitalFew, false);
    assert.equal(exclusive[4].isVitalFew, false);
  });

  it('maintains stable sorting for equal defect counts based on original index', () => {
    const defects = [
      { category: 'Defect 1', value: 20 },
      { category: 'Defect 2', value: 50 },
      { category: 'Defect 3', value: 20 },
      { category: 'Defect 4', value: 10 },
    ];

    const result = calculateParetoDistribution(defects);
    assert.equal(result[0].category, 'Defect 2'); // 50
    assert.equal(result[1].category, 'Defect 1'); // 20 (original index 0 comes before index 2)
    assert.equal(result[1].originalIndex, 0);
    assert.equal(result[2].category, 'Defect 3'); // 20 (original index 2)
    assert.equal(result[2].originalIndex, 2);
    assert.equal(result[3].category, 'Defect 4'); // 10
  });

  it('handles empty input, zero total, and filters negative values', () => {
    assert.deepEqual(calculateParetoDistribution([]), []);

    // All zero values
    const zeroDefects = [{ category: 'A', value: 0 }, { category: 'B', value: 0 }];
    const zeroResult = calculateParetoDistribution(zeroDefects);
    assert.equal(zeroResult.length, 2);
    assert.equal(zeroResult[0].cumulativePercentage, 0);

    // Negative values should be normalized to 0
    const mixed = [{ category: 'Valid', value: 10 }, { category: 'Negative', value: -5 }];
    const mixedResult = calculateParetoDistribution(mixed);
    assert.equal(mixedResult.find((it) => it.category === 'Negative')?.value, 0);
  });
});
