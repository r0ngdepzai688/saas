/**
 * Pareto 80/20 Analysis & Sorting Engine
 * Pure TypeScript implementation for Juran's Vital Few triage.
 */

import type { ParetoDistributionItem, ParetoInputItem, ParetoOptions } from './math.types.ts';

/**
 * Calculates cumulative Pareto distribution:
 * 1. Filters invalid and negative values.
 * 2. Stable-sorts items in descending order of value (preserving original index order for equal values).
 * 3. Computes running cumulative sums and cumulative percentages.
 * 4. Classifies the "Vital Few" items using either 'inclusive' or 'exclusive' thresholding:
 *    - 'inclusive' (default industrial standard): The item that causes cumulative percentage to meet
 *      or exceed the threshold is included, ensuring at least thresholdPercent of the problem is addressed.
 *    - 'exclusive': Only items whose cumulative percentage is <= thresholdPercent are marked vital few.
 */
export function calculateParetoDistribution(
  items: readonly ParetoInputItem[],
  options?: ParetoOptions | number
): ParetoDistributionItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  // Support numeric shorthand: calculateParetoDistribution(items, 80)
  const thresholdPercent =
    typeof options === 'number'
      ? options
      : options?.thresholdPercent ?? 80;

  const thresholdMode =
    typeof options === 'object' && options?.thresholdMode
      ? options.thresholdMode
      : 'inclusive';

  // Map with original index to ensure stable sorting
  const indexed = items
    .map((it, idx) => ({
      category: it && typeof it.category === 'string' ? it.category : '',
      value: it && typeof it.value === 'number' && Number.isFinite(it.value) && it.value >= 0 ? it.value : 0,
      originalIndex: idx,
    }))
    .filter((it) => it.category.length > 0);

  // Stable sort descending by value; tie-breaker is original index
  indexed.sort((a, b) => {
    if (b.value !== a.value) {
      return b.value - a.value;
    }
    return a.originalIndex - b.originalIndex;
  });

  const total = indexed.reduce((sum, it) => sum + it.value, 0);

  if (total === 0) {
    return indexed.map((it) => ({
      category: it.category,
      value: it.value,
      cumulativeValue: 0,
      cumulativePercentage: 0,
      isVitalFew: true,
      originalIndex: it.originalIndex,
    }));
  }

  let runningSum = 0;
  let crossedThreshold = false;

  return indexed.map((it) => {
    runningSum += it.value;
    const cumulativePercentage = Number(((runningSum / total) * 100).toFixed(2));

    let isVitalFew = false;
    if (thresholdMode === 'exclusive') {
      isVitalFew = cumulativePercentage <= thresholdPercent;
    } else {
      // 'inclusive': include items up to and including the one that crosses the threshold
      if (!crossedThreshold) {
        isVitalFew = true;
        if (cumulativePercentage >= thresholdPercent) {
          crossedThreshold = true;
        }
      } else {
        isVitalFew = false;
      }
    }

    return {
      category: it.category,
      value: it.value,
      cumulativeValue: runningSum,
      cumulativePercentage,
      isVitalFew,
      originalIndex: it.originalIndex,
    };
  });
}
