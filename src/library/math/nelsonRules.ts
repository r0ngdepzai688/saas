/**
 * Nelson Rules 1–4 Evaluator for Statistical Process Control (SPC)
 * Detects special-cause variations and non-random patterns in telemetry series.
 */

import type { NelsonRuleId, NelsonRuleViolation, SpcLimits } from './math.types.ts';
import { sanitizeNumericArray } from './spc.ts';

export interface NelsonEvaluationOptions {
  readonly enabledRules?: readonly NelsonRuleId[];
}

/**
 * Evaluates Nelson Rules 1 through 4 across an ordered sequence of measurements:
 *
 * Rule 1: One point beyond Zone A (> UCL or < LCL, i.e., > 3*sigma from Center Line).
 * Rule 2: Nine (9) points in a row on the same side of the Center Line.
 *         (Points exactly equal to the Center Line break the sequence).
 * Rule 3: Six (6) points in a row continually increasing or continually decreasing.
 *         (Equal adjacent points break the strictly monotonic trend).
 * Rule 4: Fourteen (14) points in a row alternating up and down.
 *         (Equal adjacent points break the oscillation).
 */
export function evaluateNelsonRules(
  values: readonly number[],
  limits: SpcLimits,
  options?: NelsonEvaluationOptions
): NelsonRuleViolation[] {
  const clean = sanitizeNumericArray(values);
  if (clean.length === 0) return [];

  const enabled = new Set<NelsonRuleId>(options?.enabledRules ?? [1, 2, 3, 4]);
  const violations: NelsonRuleViolation[] = [];

  const { centerLine, ucl, lcl } = limits;

  // RULE 1: Point falls outside 3-sigma control limits
  if (enabled.has(1)) {
    for (let i = 0; i < clean.length; i++) {
      const v = clean[i];
      if (v > ucl) {
        violations.push({
          ruleId: 1,
          ruleName: 'Rule 1 (Beyond 3σ)',
          index: i,
          value: v,
          description: `Point exceeds Upper Control Limit (${v} > ${ucl})`,
          windowIndices: [i],
        });
      } else if (v < lcl) {
        violations.push({
          ruleId: 1,
          ruleName: 'Rule 1 (Beyond 3σ)',
          index: i,
          value: v,
          description: `Point falls below Lower Control Limit (${v} < ${lcl})`,
          windowIndices: [i],
        });
      }
    }
  }

  // RULE 2: Nine points in a row on the same side of the Center Line
  if (enabled.has(2) && clean.length >= 9) {
    let currentSide = 0; // +1 for above mean, -1 for below mean, 0 for exactly equal
    let runIndices: number[] = [];

    for (let i = 0; i < clean.length; i++) {
      const v = clean[i];
      const side = v > centerLine ? 1 : v < centerLine ? -1 : 0;

      if (side !== 0 && side === currentSide) {
        runIndices.push(i);
      } else {
        currentSide = side;
        runIndices = side !== 0 ? [i] : [];
      }

      if (runIndices.length >= 9) {
        violations.push({
          ruleId: 2,
          ruleName: 'Rule 2 (Run of 9 on Same Side)',
          index: i,
          value: v,
          description: `Run of ${runIndices.length} consecutive points on the ${
            currentSide === 1 ? 'upper' : 'lower'
          } side of the center line`,
          windowIndices: [...runIndices],
        });
      }
    }
  }

  // RULE 3: Six points in a row continually increasing or continually decreasing
  if (enabled.has(3) && clean.length >= 6) {
    let currentDirection = 0; // +1 for increasing, -1 for decreasing, 0 for flat
    let trendIndices: number[] = [0];

    for (let i = 1; i < clean.length; i++) {
      const diff = clean[i] - clean[i - 1];
      const direction = diff > 0 ? 1 : diff < 0 ? -1 : 0;

      if (direction !== 0 && direction === currentDirection) {
        trendIndices.push(i);
      } else {
        currentDirection = direction;
        trendIndices = direction !== 0 ? [i - 1, i] : [i];
      }

      if (trendIndices.length >= 6) {
        violations.push({
          ruleId: 3,
          ruleName: 'Rule 3 (Trend of 6 Consecutive Steps)',
          index: i,
          value: clean[i],
          description: `Monotonic ${
            currentDirection === 1 ? 'upward' : 'downward'
          } trend for ${trendIndices.length} consecutive points`,
          windowIndices: [...trendIndices],
        });
      }
    }
  }

  // RULE 4: Fourteen points in a row alternating up and down
  if (enabled.has(4) && clean.length >= 14) {
    let alternatingIndices: number[] = [0, 1];

    for (let i = 2; i < clean.length; i++) {
      const prevDiff = clean[i - 1] - clean[i - 2];
      const currDiff = clean[i] - clean[i - 1];

      // Alternating means signs differ and neither is flat
      const isAlternating =
        (prevDiff > 0 && currDiff < 0) || (prevDiff < 0 && currDiff > 0);

      if (isAlternating) {
        alternatingIndices.push(i);
      } else {
        alternatingIndices = [i - 1, i];
      }

      if (alternatingIndices.length >= 14) {
        violations.push({
          ruleId: 4,
          ruleName: 'Rule 4 (Oscillation of 14 Points)',
          index: i,
          value: clean[i],
          description: `Systematic alternating up-and-down oscillation spanning ${alternatingIndices.length} points`,
          windowIndices: [...alternatingIndices],
        });
      }
    }
  }

  return violations;
}
