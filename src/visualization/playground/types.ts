export type ChartCategory = 
  | 'kpi' 
  | 'quality' 
  | 'spc' 
  | 'monitoring' 
  | 'distribution' 
  | 'advanced';

export type ComplexityLevel = 'Low' | 'Medium' | 'High';

export type ThemeId = 
  | 'light-enterprise' 
  | 'dark-analytics' 
  | 'warm-glass' 
  | 'minimal-monochrome' 
  | 'high-contrast';

export type ScenarioGroup = 'qa' | 'kpi' | 'monitoring';

export type ViewportPreset = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface ViewportConfig {
  id: ViewportPreset;
  label: string;
  width: number;
  height: number;
  description: string;
}

export interface RegisteredChart {
  id: string;
  name: string;
  category: ChartCategory;
  categoryLabel: string;
  description: string;
  businessUseCase: string;
  dataRequirements: string[];
  complexity: ComplexityLevel;
  supportedDatasetTypes: string[];
  strengths: string[];
  limitations: string[];
  defaultDatasetId: string;
}

export interface DatasetField {
  name: string;
  type: 'string' | 'number' | 'date' | 'category';
  description: string;
}

export interface ScenarioDataset {
  id: string;
  name: string;
  group: ScenarioGroup;
  groupLabel: string;
  description: string;
  isSynthetic: true;
  syntheticNotice: string;
  fields: DatasetField[];
  timeframeOptions: string[];
  defaultTimeframe: string;
  data: any; // Raw or structured rows
}

export interface PlaygroundTheme {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  background: string;
  surface: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  palette: string[];
  gridLine: string;
  axisLine: string;
}

export interface ConfigOverrides {
  smoothCurve?: boolean;
  showArea?: boolean;
  showMarkLine?: boolean;
  showLegend?: boolean;
  showToolbox?: boolean;
  showDataZoom?: boolean;
  barWidth?: number;
  symbolSize?: number;
}
