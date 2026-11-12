/**
 * Unit & Integration Tests for Specialized Chart Family Builders
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildSpcControlOption } from '../families/spcBuilder.ts';
import { buildParetoOption } from '../families/paretoBuilder.ts';
import { buildCapabilityOption } from '../families/capabilityBuilder.ts';
import { buildHeatmapOption } from '../families/heatmapBuilder.ts';
import { buildTreemapOption } from '../families/hierarchicalBuilder.ts';
import { buildSankeyOption } from '../families/relationalBuilder.ts';
import { buildRadarOption } from '../families/radarBuilder.ts';
import { buildCartesianOption } from '../families/cartesianBuilder.ts';
import type { VisualizationSpec } from '../../contracts/visualizationContract.ts';

describe('Chart Family Builders', () => {
  it('buildSpcControlOption computes control limits and marks out-of-control points', () => {
    const categories = Array.from({ length: 21 }, (_, i) => `S${i + 1}`);
    const records = Array.from({ length: 20 }, () => ({ value: 10.0 }));
    records.push({ value: 50.0 }); // Strong outlier at index 20

    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'spc-test',
      archetype: 'spc-control',
      title: 'SPC Test Chart',
      unit: 'mm',
      data: {
        categories,
        records,
      },
    };

    const option = buildSpcControlOption(spec);
    assert.ok(option.series);
    const series = (option.series as any[])[0];
    assert.equal(series.type, 'line');
    assert.ok(series.markLine);
    assert.ok(series.markArea);

    // Check that outlier point at index 20 has red styling
    const point20 = series.data[20];
    assert.equal(point20.value, 50.0);
    assert.equal(point20.itemStyle.color, '#DC2626');
  });

  it('buildParetoOption produces dual-axis bars and 80% cutoff line', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'pareto-test',
      archetype: 'pareto-8020',
      title: 'Pareto Defect Audit',
      data: {
        records: [
          { name: 'Scratch', count: 50 },
          { name: 'Dent', count: 30 },
          { name: 'Discolor', count: 15 },
          { name: 'Burr', count: 5 },
        ],
      },
    };

    const option = buildParetoOption(spec);
    assert.ok(option.series);
    const seriesList = option.series as any[];
    assert.equal(seriesList.length, 2);
    assert.equal(seriesList[0].type, 'bar');
    assert.equal(seriesList[1].type, 'line');
    assert.equal(seriesList[1].yAxisIndex, 1);
    assert.ok(seriesList[1].markLine);
  });

  it('buildCapabilityOption generates histogram and Gaussian normal curve with explicit limits', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'cap-test',
      archetype: 'capability-histogram',
      title: 'Capability Distribution',
      data: {
        records: [
          { value: 9.8 },
          { value: 10.0 },
          { value: 10.2 },
          { value: 10.1 },
          { value: 9.9 },
          { value: 10.0 },
        ],
      },
    };

    const option = buildCapabilityOption(spec, {
      capabilityLimits: { usl: 10.5, lsl: 9.5 },
    });
    assert.ok(option.series);
    const seriesList = option.series as any[];
    assert.equal(seriesList.length, 2);
    assert.equal(seriesList[0].type, 'bar');
    assert.equal(seriesList[1].type, 'line');
    assert.equal(seriesList[1].smooth, true);
  });

  it('buildHeatmapOption configures continuous visualMap and matrix coords', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'heat-test',
      archetype: 'defect-heatmap',
      title: 'Defect Heatmap',
      data: {
        categories: ['Station 1', 'Station 2'],
        matrix: [
          [0, 0, 5],
          [0, 1, 12],
          [1, 0, 3],
          [1, 1, 8],
        ],
      },
    };

    const option = buildHeatmapOption(spec);
    assert.ok(option.visualMap);
    const series = (option.series as any[])[0];
    assert.equal(series.type, 'heatmap');
    assert.equal(series.data.length, 4);
  });

  it('buildTreemapOption converts hierarchical data into treemap levels', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'tree-test',
      archetype: 'operational-treemap',
      title: 'Defect Tree',
      data: {
        records: [
          { name: 'Mechanical', value: 120 },
          { name: 'Electrical', value: 80 },
        ],
      },
    };

    const option = buildTreemapOption(spec);
    const series = (option.series as any[])[0];
    assert.equal(series.type, 'treemap');
    assert.equal(series.data.length, 2);
  });

  it('buildSankeyOption maps nodes and links into gradient flow', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'sankey-test',
      archetype: 'workflow-sankey',
      title: 'Workflow Yield Flow',
      data: {
        nodes: [{ name: 'Input' }, { name: 'Assembly' }, { name: 'Pass' }],
        links: [
          { source: 'Input', target: 'Assembly', value: 1000 },
          { source: 'Assembly', target: 'Pass', value: 950 },
        ],
      },
    };

    const option = buildSankeyOption(spec);
    const series = (option.series as any[])[0];
    assert.equal(series.type, 'sankey');
    assert.equal(series.data.length, 3);
    assert.equal(series.links.length, 2);
  });

  it('buildRadarOption sets up polygon indicators and dimension values', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'radar-test',
      archetype: 'quality-radar',
      title: 'Quality Dimension Radar',
      data: {
        categories: ['Yield', 'CPK', 'OEE'],
        records: [{ name: 'Current Plant', values: [95, 88, 82] }],
      },
    };

    const option = buildRadarOption(spec);
    assert.ok(option.radar);
    const radar = option.radar as any;
    assert.equal(radar.indicator.length, 3);
    const series = (option.series as any[])[0];
    assert.equal(series.type, 'radar');
  });

  it('buildCartesianOption handles general combo line and bar series', () => {
    const spec: VisualizationSpec = {
      version: '1.0',
      id: 'combo-test',
      archetype: 'combo-trend',
      title: 'Volume and Yield Trend',
      encoding: {
        showLegend: true,
        showDataZoom: true,
      },
      data: {
        categories: ['W1', 'W2', 'W3'],
        records: [
          { period: 'W1', volume: 1000, yield: 98 },
          { period: 'W2', volume: 1200, yield: 97 },
          { period: 'W3', volume: 1100, yield: 99 },
        ],
      },
    };

    const option = buildCartesianOption(spec);
    assert.ok(option.legend);
    assert.ok(option.dataZoom);
    const seriesList = option.series as any[];
    assert.equal(seriesList.length, 2);
  });
});
