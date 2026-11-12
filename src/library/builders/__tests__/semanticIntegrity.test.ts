/**
 * Comprehensive Semantic Integrity & Archetype Dispatch Tests (AGY TASK 02.6)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCapabilityOption } from '../families/capabilityBuilder.ts';
import { buildWaterfallOption } from '../families/waterfallBuilder.ts';
import { buildKpiBulletOption } from '../families/bulletBuilder.ts';
import { buildCartesianOption } from '../families/cartesianBuilder.ts';
import { buildEChartsOptionFromSpec } from '../specAdapter.ts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';

describe('AGY TASK 02.6 — Semantic Integrity Remediation Tests', () => {
  // 1. Capability Histogram: Six Out-of-Spec and Boundary Scenarios
  describe('1. Capability Histogram Dynamic Specification Line Coordinates', () => {
    const usl = 101;
    const lsl = 99;

    it('Scenario 1 — All observations inside specification limits', () => {
      const values = [99.2, 99.5, 99.8, 100.0, 100.2, 100.5, 100.8];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s1',
        archetype: 'capability-histogram',
        title: 'Scenario 1',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl, lsl } });
      const barSeries = (opt.series as any[])[0];
      const lslMark = barSeries.markLine.data.find((m: any) => m.name === 'LSL');
      const uslMark = barSeries.markLine.data.find((m: any) => m.name === 'USL');

      assert.equal(lslMark.xAxis, 0);
      assert.equal(uslMark.xAxis, 11);
      assert.equal(lslMark.label.formatter, 'LSL: 99');
      assert.equal(uslMark.label.formatter, 'USL: 101');
    });

    it('Scenario 2 — One observation below LSL (98.5 < 99.0)', () => {
      const values = [98.5, 99.2, 99.5, 99.8, 100.0, 100.2, 100.5];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s2',
        archetype: 'capability-histogram',
        title: 'Scenario 2',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl, lsl } });
      const barSeries = (opt.series as any[])[0];
      const lslMark = barSeries.markLine.data.find((m: any) => m.name === 'LSL');

      // Domain extends to minVal = 98.5. LSL = 99 is inside Bin 2, NOT clamped to 0!
      assert.ok(lslMark.xAxis > 0, `LSL must be inside histogram domain, received bin index: ${lslMark.xAxis}`);
      assert.equal(lslMark.xAxis, 2);
    });

    it('Scenario 3 — One observation above USL (101.8 > 101.0)', () => {
      const values = [99.2, 99.5, 99.8, 100.0, 100.2, 100.5, 101.8];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s3',
        archetype: 'capability-histogram',
        title: 'Scenario 3',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl, lsl } });
      const barSeries = (opt.series as any[])[0];
      const uslMark = barSeries.markLine.data.find((m: any) => m.name === 'USL');

      // Domain extends to maxVal = 101.8. USL = 101 is inside Bin 8, NOT clamped to 11!
      assert.ok(uslMark.xAxis < 11, `USL must be inside histogram domain, received bin index: ${uslMark.xAxis}`);
      assert.equal(uslMark.xAxis, 8);
    });

    it('Scenario 4 — Observations below LSL and above USL simultaneously', () => {
      const values = [98.2, 99.5, 99.8, 100.0, 100.2, 100.5, 101.2, 102.0];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s4',
        archetype: 'capability-histogram',
        title: 'Scenario 4',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl, lsl } });
      const barSeries = (opt.series as any[])[0];
      const lslMark = barSeries.markLine.data.find((m: any) => m.name === 'LSL');
      const uslMark = barSeries.markLine.data.find((m: any) => m.name === 'USL');

      // LSL is at bin index 2, USL is at bin index 8
      assert.equal(lslMark.xAxis, 2);
      assert.equal(uslMark.xAxis, 8);
      assert.ok(lslMark.xAxis < uslMark.xAxis);
    });

    it('Scenario 5 — Specification limits outside observed data range (USL=105, LSL=95)', () => {
      const values = [99.8, 99.9, 100.0, 100.1, 100.2];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s5',
        archetype: 'capability-histogram',
        title: 'Scenario 5',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl: 105, lsl: 95 } });
      const barSeries = (opt.series as any[])[0];
      const lslMark = barSeries.markLine.data.find((m: any) => m.name === 'LSL');
      const uslMark = barSeries.markLine.data.find((m: any) => m.name === 'USL');

      assert.equal(lslMark.xAxis, 0);
      assert.equal(uslMark.xAxis, 11);
    });

    it('Scenario 6 — Specification limits inside observed data range (USL=102, LSL=98)', () => {
      const values = [90, 95, 99, 100, 101, 105, 110];
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cap-s6',
        archetype: 'capability-histogram',
        title: 'Scenario 6',
        data: { records: values.map((v) => ({ value: v })) },
      };
      const opt = buildCapabilityOption(spec, { capabilityLimits: { usl: 102, lsl: 98 } });
      const barSeries = (opt.series as any[])[0];
      const lslMark = barSeries.markLine.data.find((m: any) => m.name === 'LSL');
      const uslMark = barSeries.markLine.data.find((m: any) => m.name === 'USL');

      assert.equal(lslMark.xAxis, 4);
      assert.equal(uslMark.xAxis, 7);
    });
  });

  // 2. Specialized Waterfall Builder
  describe('2. Dedicated Waterfall Builder Semantics', () => {
    it('buildWaterfallOption computes transparent base offsets, positive gain and negative loss bars', () => {
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'wf-1',
        archetype: 'waterfall',
        title: 'Production Loss Walk',
        unit: 'Units',
        data: {
          records: [
            { step: 'Gross Input', value: 1000 },
            { step: 'Scrap Defect', value: -120 },
            { step: 'Rework Recovery', value: 40 },
            { step: 'Net Output', isTotal: true },
          ],
        },
      };

      const opt = buildWaterfallOption(spec);
      assert.ok(opt.series && Array.isArray(opt.series));
      const seriesList = opt.series as any[];
      assert.equal(seriesList.length, 3);

      const [baseSeries, gainSeries, lossSeries] = seriesList;
      assert.equal(baseSeries.name, 'Base Offset');
      assert.equal(baseSeries.stack, 'waterfall');
      assert.equal(baseSeries.itemStyle.color, 'transparent');
      assert.deepEqual(baseSeries.data, [0, 880, 880, 0]);

      assert.equal(gainSeries.name, 'Gain / Positive Delta');
      assert.equal(gainSeries.stack, 'waterfall');
      assert.deepEqual(gainSeries.data, [1000, 0, 40, 920]);

      assert.equal(lossSeries.name, 'Loss / Negative Delta');
      assert.equal(lossSeries.stack, 'waterfall');
      assert.deepEqual(lossSeries.data, [0, 120, 0, 0]);
    });
  });

  // 3. Specialized KPI Bullet Builder
  describe('3. Dedicated KPI Bullet Builder Semantics', () => {
    it('buildKpiBulletOption constructs horizontal actual bars and comparative target markers', () => {
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'bullet-1',
        archetype: 'kpi-bullet',
        title: 'OEE Department Performance',
        unit: '%',
        data: {
          records: [
            { category: 'Line 1', actual: 82.5, target: 85.0 },
            { category: 'Line 2', actual: 91.2, target: 88.0 },
          ],
        },
      };

      const opt = buildKpiBulletOption(spec);
      assert.ok(opt.series && Array.isArray(opt.series));
      const seriesList = opt.series as any[];
      assert.equal(seriesList.length, 2);

      const [actualSeries, targetSeries] = seriesList;
      assert.equal(actualSeries.type, 'bar');
      assert.equal(actualSeries.name, 'Actual Performance');
      assert.deepEqual(actualSeries.data, [82.5, 91.2]);

      assert.equal(targetSeries.type, 'scatter');
      assert.equal(targetSeries.name, 'Target Threshold');
      assert.equal(targetSeries.symbol, 'rect');
      assert.deepEqual(targetSeries.data, [85.0, 88.0]);

      // Category on Y-axis, Value on X-axis
      assert.equal((opt.yAxis as any).type, 'category');
      assert.equal((opt.xAxis as any).type, 'value');
    });
  });

  // 4. Combo Trend Dual-Axis Verification
  describe('4. Combo Trend Dual Y-Axis Semantics', () => {
    it('buildCartesianOption creates dual Y-axes when volume bars and rate lines coexist', () => {
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'combo-1',
        archetype: 'combo-trend',
        title: 'Throughput vs Defect Rate',
        data: {
          categories: ['Jan', 'Feb', 'Mar'],
          records: [
            { period: 'Jan', volume: 10000, defectRate: 2.1 },
            { period: 'Feb', volume: 12500, defectRate: 1.8 },
            { period: 'Mar', volume: 11200, defectRate: 2.4 },
          ],
        },
      };

      const opt = buildCartesianOption(spec);
      assert.ok(Array.isArray(opt.yAxis));
      const yAxes = opt.yAxis as any[];
      assert.equal(yAxes.length, 2);
      assert.equal(yAxes[0].type, 'value');
      assert.equal(yAxes[1].name, '%');

      const seriesList = opt.series as any[];
      assert.equal(seriesList[0].type, 'bar');
      assert.equal(seriesList[0].yAxisIndex, 0);

      assert.equal(seriesList[1].type, 'line');
      assert.equal(seriesList[1].yAxisIndex, 1);
    });
  });

  // 5. Continuous Trend Numerical X-Axis
  describe('5. Continuous Trend Numerical X-Axis Semantics', () => {
    it('buildCartesianOption uses value type for xAxis when archetype is continuous-trend', () => {
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'cont-1',
        archetype: 'continuous-trend',
        title: 'Sensor Thermal Gradient',
        data: {
          records: [
            { temp: 25.4 },
            { temp: 28.1 },
            { temp: 31.0 },
          ],
        },
      };

      const opt = buildCartesianOption(spec);
      assert.equal((opt.xAxis as any).type, 'value');
    });
  });

  // 6. Explicit Error on Unsupported Archetype (Horizon-Area)
  describe('6. Explicit Rejection of Unsupported Archetypes', () => {
    it('throws explicit error when horizon-area is requested without silent cartesian fallback', () => {
      const spec: VisualizationSpec = {
        version: '1.0',
        id: 'horizon-1',
        archetype: 'horizon-area',
        title: 'Horizon Signal',
        data: { records: [{ value: 10 }] },
      };

      assert.throws(
        () => buildEChartsOptionFromSpec(spec),
        /Archetype 'horizon-area' is not supported in Phase 1B\.2/
      );
    });

    it('throws explicit error on completely unknown archetype', () => {
      const spec = {
        version: '1.0',
        id: 'unknown-1',
        archetype: 'crypto-bubble',
        title: 'Unknown',
        data: {},
      } as unknown as VisualizationSpec;

      assert.throws(
        () => buildEChartsOptionFromSpec(spec),
        /Unsupported visualization archetype: 'crypto-bubble'/
      );
    });
  });
});
