import * as echarts from 'echarts';
import { CHART_COLOR_TOKENS, CHART_TYPOGRAPHY_TOKENS } from '../tokens/chartTokens';

const enterpriseLightTheme = {
  color: CHART_COLOR_TOKENS.series,
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: CHART_TYPOGRAPHY_TOKENS.fontFamily,
    color: '#334155',
  },
  title: {
    textStyle: {
      color: '#0F172A',
      fontSize: CHART_TYPOGRAPHY_TOKENS.titleSize,
      fontWeight: 'bold',
    },
    subtextStyle: {
      color: '#64748B',
      fontSize: CHART_TYPOGRAPHY_TOKENS.subtitleSize,
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2.5,
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: false,
  },
  bar: {
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
  grid: {
    containLabel: true,
    top: 36,
    left: 12,
    right: 20,
    bottom: 12,
    borderColor: '#E2E8F0',
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#CBD5E1',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#64748B',
      fontSize: CHART_TYPOGRAPHY_TOKENS.axisSize,
    },
    splitLine: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#64748B',
      fontSize: CHART_TYPOGRAPHY_TOKENS.axisSize,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#F1F5F9',
        type: 'dashed',
      },
    },
  },
  tooltip: {
    backgroundColor: CHART_COLOR_TOKENS.surfaces.tooltipBg,
    borderColor: CHART_COLOR_TOKENS.surfaces.tooltipBorder,
    borderWidth: 1,
    padding: [10, 14],
    textStyle: {
      color: CHART_COLOR_TOKENS.surfaces.tooltipText,
      fontSize: CHART_TYPOGRAPHY_TOKENS.tooltipSize,
      fontFamily: CHART_TYPOGRAPHY_TOKENS.fontFamily,
    },
    extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); border-radius: 10px; backdrop-filter: blur(8px);',
  },
  legend: {
    textStyle: {
      color: '#475569',
      fontSize: CHART_TYPOGRAPHY_TOKENS.legendSize,
    },
    icon: 'roundRect',
    itemWidth: 12,
    itemHeight: 8,
  },
};

// Register theme with ECharts
echarts.registerTheme('enterprise-light', enterpriseLightTheme);

export { enterpriseLightTheme };
