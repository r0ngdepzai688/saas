/**
 * Unit Tests for Common Option Builders Primitives
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildBaseGrid } from '../common/gridBuilder.ts';
import { buildBaseTooltip } from '../common/tooltipBuilder.ts';
import { buildBaseLegend } from '../common/legendBuilder.ts';
import { buildCategoryAxis, buildValueAxis } from '../common/axisBuilder.ts';
import { buildContractMarkLines, buildContractMarkAreas } from '../common/markerBuilder.ts';
import { getTheme } from '../../themes/themeRegistry.ts';

describe('Common Option Builders', () => {
  describe('buildBaseGrid', () => {
    it('returns default grid dimensions when no options provided', () => {
      const grid = buildBaseGrid();
      assert.equal(grid.top, 24);
      assert.equal(grid.bottom, 24);
      assert.equal(grid.left, 16);
      assert.equal(grid.right, 16);
      assert.equal(grid.containLabel, true);
    });

    it('adapts top margin when legend is present', () => {
      const grid = buildBaseGrid({ hasLegend: true });
      assert.equal(grid.top, 40);
    });

    it('adapts bottom margin when dataZoom is present', () => {
      const grid = buildBaseGrid({ hasDataZoom: true });
      assert.equal(grid.bottom, 48);
    });

    it('adapts right margin when second y-axis is present', () => {
      const grid = buildBaseGrid({ hasSecondYAxis: true });
      assert.equal(grid.right, 44);
    });

    it('allows explicit overrides without mutating inputs', () => {
      const input = { top: 60, left: 30 };
      const grid = buildBaseGrid(input);
      assert.equal(grid.top, 60);
      assert.equal(grid.left, 30);
      assert.equal(input.top, 60);
    });
  });

  describe('buildBaseTooltip', () => {
    it('generates axis-triggered cross tooltip by default', () => {
      const tooltip = buildBaseTooltip();
      assert.equal(tooltip.trigger, 'axis');
      assert.equal((tooltip.axisPointer as { type: string }).type, 'cross');
      assert.equal(tooltip.backgroundColor, '#FFFFFF');
    });

    it('adapts background and border color for dark themes', () => {
      const darkTheme = getTheme('dark-analytics');
      const tooltip = buildBaseTooltip({ theme: darkTheme });
      assert.equal(tooltip.backgroundColor, darkTheme.colors.tooltipBg);
      assert.equal(tooltip.borderColor, darkTheme.colors.tooltipBorder);
    });
  });

  describe('buildBaseLegend', () => {
    it('configures horizontal legend at the top', () => {
      const legend = buildBaseLegend({ data: ['Series A', 'Series B'] });
      assert.equal(legend.show, true);
      assert.equal(legend.orient, 'horizontal');
      assert.deepEqual(legend.data, ['Series A', 'Series B']);
    });
  });

  describe('buildCategoryAxis & buildValueAxis', () => {
    it('creates category axis with immutable categories', () => {
      const cats = ['Jan', 'Feb', 'Mar'];
      const axis = buildCategoryAxis({ categories: cats });
      assert.equal(axis.type, 'category');
      assert.deepEqual(axis.data, cats);
    });

    it('creates value axis with formatted unit label', () => {
      const axis = buildValueAxis({ unit: 'mm' });
      assert.equal(axis.type, 'value');
      assert.equal((axis.axisLabel as { formatter: string }).formatter, '{value}mm');
      assert.equal(axis.splitLine?.show, true);
    });
  });

  describe('buildContractMarkLines & buildContractMarkAreas', () => {
    it('safely returns undefined for empty input', () => {
      assert.equal(buildContractMarkLines([]), undefined);
      assert.equal(buildContractMarkAreas(undefined), undefined);
    });

    it('converts contract markLines to ECharts markLine data', () => {
      const result = buildContractMarkLines([
        { label: 'UCL', yAxis: 10.5, color: '#DC2626', lineStyle: 'dashed' },
      ]);
      assert.ok(result);
      assert.equal(result.data.length, 1);
      assert.equal(result.data[0].yAxis, 10.5);
      assert.equal(result.data[0].name, 'UCL');
    });

    it('converts contract markAreas to ECharts markArea bounds', () => {
      const result = buildContractMarkAreas([
        { label: '3-sigma', y0: 8.5, y1: 11.5, color: '#F59E0B', opacity: 0.1 },
      ]);
      assert.ok(result);
      assert.equal(result.data.length, 1);
      assert.equal(result.data[0][0].yAxis, 8.5);
      assert.equal(result.data[0][1].yAxis, 11.5);
    });
  });
});
