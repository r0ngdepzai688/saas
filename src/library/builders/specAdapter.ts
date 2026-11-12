/**
 * Visual Design Intelligence Library - Universal Spec Adapter (Dispatcher)
 * Pure function: entry point that maps any valid VisualizationSpec into a rendered EChartsOption.
 */

import type { EChartsOption } from 'echarts';
import type { VisualizationSpec } from '../contracts/visualizationContract.ts';
import type { BuilderContext } from './builder.types.ts';
import { getTheme } from '../themes/themeRegistry.ts';
import { buildCartesianOption } from './families/cartesianBuilder.ts';
import { buildSpcControlOption } from './families/spcBuilder.ts';
import { buildParetoOption } from './families/paretoBuilder.ts';
import { buildCapabilityOption } from './families/capabilityBuilder.ts';
import { buildHeatmapOption } from './families/heatmapBuilder.ts';
import { buildTreemapOption } from './families/hierarchicalBuilder.ts';
import { buildSankeyOption } from './families/relationalBuilder.ts';
import { buildRadarOption } from './families/radarBuilder.ts';
import { buildWaterfallOption } from './families/waterfallBuilder.ts';
import { buildKpiBulletOption } from './families/bulletBuilder.ts';

export function buildEChartsOptionFromSpec(
  spec: VisualizationSpec,
  context?: BuilderContext
): EChartsOption {
  if (!spec || !spec.archetype) {
    throw new Error('Invalid VisualizationSpec: archetype is required.');
  }

  // Resolve theme from spec or context
  const themeId = spec.themeId ?? 'light-enterprise';
  const effectiveTheme = context?.theme ?? getTheme(themeId);
  const effectiveContext: BuilderContext = {
    ...context,
    theme: effectiveTheme,
  };

  let option: EChartsOption;

  switch (spec.archetype) {
    case 'spc-control':
      option = buildSpcControlOption(spec, effectiveContext);
      break;

    case 'pareto-8020':
      option = buildParetoOption(spec, effectiveContext);
      break;

    case 'capability-histogram':
      option = buildCapabilityOption(spec, effectiveContext);
      break;

    case 'defect-heatmap':
      option = buildHeatmapOption(spec, effectiveContext);
      break;

    case 'operational-treemap':
      option = buildTreemapOption(spec, effectiveContext);
      break;

    case 'workflow-sankey':
      option = buildSankeyOption(spec, effectiveContext);
      break;

    case 'quality-radar':
      option = buildRadarOption(spec, effectiveContext);
      break;

    case 'waterfall':
      option = buildWaterfallOption(spec, effectiveContext);
      break;

    case 'kpi-bullet':
      option = buildKpiBulletOption(spec, effectiveContext);
      break;

    case 'combo-trend':
    case 'continuous-trend':
      option = buildCartesianOption(spec, effectiveContext);
      break;

    case 'horizon-area':
      throw new Error(
        `Archetype '${spec.archetype}' is not supported in Phase 1B.2: Horizon chart requires multi-band density slicing not yet modeled in the contract. Silent fallback to generic cartesian is prohibited.`
      );

    default:
      throw new Error(
        `Unsupported visualization archetype: '${(spec as { archetype?: string }).archetype}'. Explicit specialized builder required.`
      );
  }

  // Apply title and subtitle if present
  if (spec.title) {
    option.title = {
      text: spec.title,
      subtext: spec.subtitle,
      left: 'left',
      top: 0,
      textStyle: {
        fontSize: 13,
        fontWeight: 600,
        color: effectiveTheme.isDark ? '#F8FAFC' : '#0F172A',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      subtextStyle: {
        fontSize: 11,
        color: effectiveTheme.isDark ? '#94A3B8' : '#64748B',
      },
    };
  }

  // Apply user-provided overrides if any
  if (context?.overrides) {
    return {
      ...option,
      ...context.overrides,
    };
  }

  return option;
}
