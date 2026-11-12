/**
 * Visual Design Intelligence Library - Common Grid Builder
 * Pure function: constructs optimized Cartesian grid bounds based on chart layout features.
 */

import type { GridComponentOption } from 'echarts';
import type { BaseGridOptions } from '../builder.types.ts';

export function buildBaseGrid(options?: BaseGridOptions): GridComponentOption {
  const {
    top,
    bottom,
    left,
    right,
    containLabel = true,
    hasLegend = false,
    hasDataZoom = false,
    hasSecondYAxis = false,
  } = options ?? {};

  // Compute adaptive layout margins if not explicitly specified
  let computedTop: number | string = top ?? 24;
  let computedBottom: number | string = bottom ?? 24;
  let computedLeft: number | string = left ?? 16;
  let computedRight: number | string = right ?? 16;

  if (top === undefined && hasLegend) {
    computedTop = 40;
  }

  if (bottom === undefined && hasDataZoom) {
    computedBottom = 48;
  }

  if (right === undefined && hasSecondYAxis) {
    computedRight = 44;
  }

  return {
    top: computedTop,
    bottom: computedBottom,
    left: computedLeft,
    right: computedRight,
    containLabel,
  };
}
