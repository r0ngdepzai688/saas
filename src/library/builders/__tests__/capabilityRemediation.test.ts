/**
 * Tests for Capability Histogram Builder & Specification Limit Safety Remediation (AGY TASK 02.3)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCapabilityOption } from '../families/capabilityBuilder.ts';
import { buildEChartsOptionFromSpec } from '../specAdapter.ts';
import { calculateProcessCapability } from '../../math/capability.ts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';

describe('Capability Builder Safety Remediation (AGY TASK 02.3)', () => {
  // Case A — 100mm mechanical component
  it('Case A — accepts 100mm mechanical component with explicit limits (USL=101, LSL=99)', () => {
    const rawValues = [100.1, 100.2, 99.8, 100.0, 100.3, 99.9];
    const usl = 101;
    const lsl = 99;

    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-case-a',
      archetype: 'capability-histogram',
      title: 'Pin Diameter 100mm',
      unit: 'mm',
      data: {
        records: rawValues.map((v) => ({ value: v })),
      },
    };

    const option = buildCapabilityOption(spec, {
      capabilityLimits: { usl, lsl },
    });

    assert.ok(option.series);
    const seriesList = option.series as any[];
    assert.equal(seriesList.length, 2);

    // Direct math comparison
    const directMath = calculateProcessCapability(rawValues, usl, lsl);
    assert.equal(directMath.cp, 1.78);
    assert.equal(directMath.cpk, 1.69);
    assert.equal(directMath.isCapable, true);

    // Verify markLines reflect supplied values exactly
    const barSeries = seriesList[0];
    assert.ok(barSeries.markLine);
    const markData = barSeries.markLine.data;
    assert.equal(markData[0].name, 'USL');
    assert.equal(markData[0].label.formatter, `USL: ${usl}`);
    assert.equal(markData[1].name, 'LSL');
    assert.equal(markData[1].label.formatter, `LSL: ${lsl}`);

    // Verify bins span real domain including LSL (99) and USL (101)
    const xAxis = option.xAxis as any;
    assert.ok(xAxis && Array.isArray(xAxis.data));
    assert.equal(xAxis.data.length, 12);
    assert.ok(xAxis.data[0].startsWith('99.00'));
    assert.ok(xAxis.data[11].endsWith('101.00'));
  });

  // Case B — 10mm precision component
  it('Case B — accepts 10mm precision component with tight limits (USL=10.15, LSL=9.85)', () => {
    const rawValues = [10.1, 10.2, 9.9, 10.0, 10.3, 9.8];
    const usl = 10.15;
    const lsl = 9.85;

    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-case-b',
      archetype: 'capability-histogram',
      title: 'Precision Shaft 10mm',
      unit: 'mm',
      data: {
        records: rawValues.map((v) => ({ value: v })),
      },
    };

    const option = buildCapabilityOption(spec, {
      capabilityLimits: { usl, lsl },
    });

    assert.ok(option.series);
    const seriesList = option.series as any[];

    // Direct math comparison
    const directMath = calculateProcessCapability(rawValues, usl, lsl);
    assert.equal(directMath.cp, 0.27);
    assert.equal(directMath.cpk, 0.18);
    assert.equal(directMath.isCapable, false);

    // Verify markLines remain exactly 10.15 and 9.85 without hidden fallback
    const barSeries = seriesList[0];
    const markData = barSeries.markLine.data;
    assert.equal(markData[0].label.formatter, 'USL: 10.15');
    assert.equal(markData[1].label.formatter, 'LSL: 9.85');
  });

  // Case C — Missing specification limits (Call without limits)
  it('Case C — throws explicit runtime error when called without USL/LSL', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-missing-limits',
      archetype: 'capability-histogram',
      title: 'Missing Limits Test',
      data: {
        records: [{ value: 10.0 }, { value: 10.1 }],
      },
    };

    // 1. Without context
    assert.throws(
      () => buildCapabilityOption(spec),
      /CapabilityHistogram requires explicit specification limits/
    );

    // 2. With empty context
    assert.throws(
      () => buildCapabilityOption(spec, {}),
      /CapabilityHistogram requires explicit specification limits/
    );

    // 3. With context but missing capabilityLimits
    assert.throws(
      () => buildCapabilityOption(spec, { overrides: {} }),
      /CapabilityHistogram requires explicit specification limits/
    );
  });

  // Case D — Strict Validation of invalid specification limits
  describe('Case D — Rejects every invalid specification limit condition', () => {
    const baseSpec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-invalid-bounds',
      archetype: 'capability-histogram',
      title: 'Invalid Bounds Test',
      data: { records: [{ value: 10.0 }] },
    };

    it('rejects USL missing / undefined', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: undefined as any, lsl: 9.0 },
          }),
        /requires explicit USL/
      );
    });

    it('rejects LSL missing / undefined', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 11.0, lsl: undefined as any },
          }),
        /requires explicit LSL/
      );
    });

    it('rejects USL = null', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: null as any, lsl: 9.0 },
          }),
        /requires explicit USL/
      );
    });

    it('rejects LSL = null', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 11.0, lsl: null as any },
          }),
        /requires explicit LSL/
      );
    });

    it('rejects USL = NaN', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: NaN, lsl: 9.0 },
          }),
        /requires finite numeric USL/
      );
    });

    it('rejects LSL = NaN', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 11.0, lsl: NaN },
          }),
        /requires finite numeric LSL/
      );
    });

    it('rejects USL = Infinity', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: Infinity, lsl: 9.0 },
          }),
        /requires finite numeric USL/
      );
    });

    it('rejects LSL = -Infinity', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 11.0, lsl: -Infinity },
          }),
        /requires finite numeric LSL/
      );
    });

    it('rejects USL = LSL', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 10.0, lsl: 10.0 },
          }),
        /requires USL > LSL/
      );
    });

    it('rejects USL < LSL (inverted limits)', () => {
      assert.throws(
        () =>
          buildCapabilityOption(baseSpec, {
            capabilityLimits: { usl: 9.0, lsl: 11.0 },
          }),
        /requires USL > LSL/
      );
    });
  });

  // Case E — Adapter propagation
  it('Case E — buildEChartsOptionFromSpec correctly propagates capabilityLimits to capabilityBuilder', () => {
    const rawValues = [100.1, 100.2, 99.8, 100.0, 100.3, 99.9];
    const usl = 101;
    const lsl = 99;

    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-adapter-test',
      archetype: 'capability-histogram',
      title: 'Propagated Capability Spec',
      data: {
        records: rawValues.map((v) => ({ value: v })),
      },
    };

    // 1. Calling adapter without limits must throw
    assert.throws(
      () => buildEChartsOptionFromSpec(spec),
      /CapabilityHistogram requires explicit specification limits/
    );

    // 2. Calling adapter with explicit capabilityLimits must propagate successfully
    const option = buildEChartsOptionFromSpec(spec, {
      capabilityLimits: { usl, lsl },
    });

    assert.ok(option.title);
    assert.equal((option.title as { text: string }).text, 'Propagated Capability Spec');
    assert.ok(option.series);
    const seriesList = option.series as any[];
    const markData = seriesList[0].markLine.data;
    assert.equal(markData[0].label.formatter, `USL: ${usl}`);
    assert.equal(markData[1].label.formatter, `LSL: ${lsl}`);
  });
});
