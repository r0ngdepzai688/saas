/**
 * Process Capability & Process Performance Indices (Cp, Cpk, Pp, Ppk)
 * Pure TypeScript implementation adhering to AIAG SPC 2nd Edition & ISO 22514-2.
 */

import type { ProcessCapabilityOptions, ProcessCapabilityResult } from './math.types.ts';
import {
  calculateAverageMovingRange,
  calculateMean,
  calculateStandardDeviation,
  sanitizeNumericArray,
  SPC_CONSTANTS,
} from './spc.ts';

/**
 * Calculates Process Capability (Cp, Cpk) and Process Performance (Pp, Ppk):
 *
 * 1. Process Performance (Pp, Ppk) - Measures total/overall variation:
 *    Uses sample standard deviation s (overall dispersion with n-1):
 *      Pp = (USL - LSL) / (6 * s)
 *      Ppu = (USL - Mean) / (3 * s)
 *      Ppl = (Mean - LSL) / (3 * s)
 *      Ppk = min(Ppu, Ppl)
 *
 * 2. Process Capability (Cp, Cpk) - Measures within-subgroup short-term potential:
 *    When dispersionMethod === 'moving-range' (Shewhart I-MR):
 *      sigma_within = MR_bar / d2 (d2 = 1.128)
 *      Cp = (USL - LSL) / (6 * sigma_within)
 *      Cpu = (USL - Mean) / (3 * sigma_within)
 *      Cpl = (Mean - LSL) / (3 * sigma_within)
 *      Cpk = min(Cpu, Cpl)
 *
 *    When dispersionMethod === 'sample-std-dev' (Default legacy compatibility):
 *      sigma_within is equated to s (overall dispersion).
 */
export function calculateProcessCapability(
  values: readonly number[],
  usl: number,
  lsl: number,
  options?: ProcessCapabilityOptions
): ProcessCapabilityResult {
  const targetThreshold = options?.targetThreshold ?? 1.33;
  const dispersionMethod = options?.dispersionMethod ?? 'sample-std-dev';
  const clean = sanitizeNumericArray(values);

  // Invalid specification bounds guard
  if (!Number.isFinite(usl) || !Number.isFinite(lsl) || usl <= lsl) {
    return {
      cp: 0,
      cpk: 0,
      cpu: 0,
      cpl: 0,
      pp: 0,
      ppk: 0,
      ppu: 0,
      ppl: 0,
      mean: 0,
      stdDev: 0,
      stdDevOverall: 0,
      usl: Number.isFinite(usl) ? usl : 0,
      lsl: Number.isFinite(lsl) ? lsl : 0,
      isCapable: false,
      targetThreshold,
      dispersionMethod,
    };
  }

  if (clean.length <= 1) {
    const mean = clean.length === 1 ? clean[0] : 0;
    return {
      cp: 0,
      cpk: 0,
      cpu: 0,
      cpl: 0,
      pp: 0,
      ppk: 0,
      ppu: 0,
      ppl: 0,
      mean: Number(mean.toFixed(3)),
      stdDev: 0,
      stdDevOverall: 0,
      usl,
      lsl,
      isCapable: false,
      targetThreshold,
      dispersionMethod,
    };
  }

  const mean = calculateMean(clean);
  const stdDevOverall = calculateStandardDeviation(clean);

  // Zero dispersion (all samples identical)
  if (stdDevOverall === 0) {
    return {
      cp: 0,
      cpk: 0,
      cpu: 0,
      cpl: 0,
      pp: 0,
      ppk: 0,
      ppu: 0,
      ppl: 0,
      mean: Number(mean.toFixed(3)),
      stdDev: 0,
      stdDevOverall: 0,
      usl,
      lsl,
      isCapable: false,
      targetThreshold,
      dispersionMethod,
    };
  }

  // Calculate Process Performance (Pp, Ppk) using overall s
  const pp = (usl - lsl) / (6 * stdDevOverall);
  const ppu = (usl - mean) / (3 * stdDevOverall);
  const ppl = (mean - lsl) / (3 * stdDevOverall);
  const ppk = Math.min(ppu, ppl);

  // Calculate Process Capability (Cp, Cpk)
  let stdDevWithin = stdDevOverall;
  if (dispersionMethod === 'moving-range' && clean.length > 1) {
    const avgMr = calculateAverageMovingRange(clean);
    stdDevWithin = avgMr / SPC_CONSTANTS.d2;
  }

  if (stdDevWithin === 0) {
    return {
      cp: 0,
      cpk: 0,
      cpu: 0,
      cpl: 0,
      pp: Number(pp.toFixed(2)),
      ppk: Number(ppk.toFixed(2)),
      ppu: Number(ppu.toFixed(2)),
      ppl: Number(ppl.toFixed(2)),
      mean: Number(mean.toFixed(3)),
      stdDev: 0,
      stdDevOverall: Number(stdDevOverall.toFixed(3)),
      usl,
      lsl,
      isCapable: false,
      targetThreshold,
      dispersionMethod,
    };
  }

  const cp = (usl - lsl) / (6 * stdDevWithin);
  const cpu = (usl - mean) / (3 * stdDevWithin);
  const cpl = (mean - lsl) / (3 * stdDevWithin);
  const cpk = Math.min(cpu, cpl);

  return {
    cp: Number(cp.toFixed(2)),
    cpk: Number(cpk.toFixed(2)),
    cpu: Number(cpu.toFixed(2)),
    cpl: Number(cpl.toFixed(2)),
    pp: Number(pp.toFixed(2)),
    ppk: Number(ppk.toFixed(2)),
    ppu: Number(ppu.toFixed(2)),
    ppl: Number(ppl.toFixed(2)),
    mean: Number(mean.toFixed(3)),
    stdDev: Number(stdDevWithin.toFixed(3)),
    stdDevWithin: Number(stdDevWithin.toFixed(3)),
    stdDevOverall: Number(stdDevOverall.toFixed(3)),
    usl,
    lsl,
    isCapable: cpk >= targetThreshold,
    targetThreshold,
    dispersionMethod,
  };
}
