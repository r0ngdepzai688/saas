/**
 * Unit & Integration Tests for Universal Spec Adapter (Dispatcher)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildEChartsOptionFromSpec } from '../specAdapter.ts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';

describe('Universal Spec Adapter (buildEChartsOptionFromSpec)', () => {
  it('throws descriptive error if spec or archetype is missing', () => {
    assert.throws(
      () => buildEChartsOptionFromSpec(null as unknown as VisualizationSpec),
      /Invalid VisualizationSpec/
    );
  });

  it('correctly dispatches spc-control archetype and sets title', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'spc-dispatch',
      archetype: 'spc-control',
      title: 'Realtime SPC Telemetry',
      subtitle: 'Line 3 Critical Dimension',
      data: {
        categories: ['1', '2', '3'],
        records: [{ value: 10 }, { value: 10.2 }, { value: 10.1 }],
      },
    };

    const option = buildEChartsOptionFromSpec(spec);
    assert.ok(option.title);
    assert.equal((option.title as { text: string }).text, 'Realtime SPC Telemetry');
    assert.equal((option.title as { subtext: string }).subtext, 'Line 3 Critical Dimension');
    assert.ok(option.series);
  });

  it('correctly dispatches pareto-8020 archetype', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'pareto-dispatch',
      archetype: 'pareto-8020',
      title: 'Pareto Dispatch Test',
      data: {
        records: [
          { name: 'A', count: 10 },
          { name: 'B', count: 5 },
        ],
      },
    };

    const option = buildEChartsOptionFromSpec(spec);
    assert.ok(option.series);
    const seriesList = option.series as any[];
    assert.equal(seriesList.length, 2);
    assert.equal(seriesList[0].type, 'bar');
    assert.equal(seriesList[1].type, 'line');
  });

  it('honors context.overrides by merging on top of generated option', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'override-dispatch',
      archetype: 'combo-trend',
      title: 'Original Title',
      data: {
        categories: ['Q1', 'Q2'],
        records: [{ period: 'Q1', volume: 500 }],
      },
    };

    const option = buildEChartsOptionFromSpec(spec, {
      overrides: {
        animation: false,
      },
    });

    assert.equal(option.animation, false);
  });
});
