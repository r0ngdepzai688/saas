# Enterprise Themes Engine (`src/library/themes/`)

The Themes module defines the **5 canonical theme systems** for 2026 Enterprise Analytics.

---

## 1. Module Structure

```
src/library/themes/
├── theme.types.ts         # Theme contract interfaces (ThemeDefinition, ThemeColors, etc.)
├── themeDefinitions.ts    # The 5 canonical theme specifications
├── themeRegistry.ts       # Registry, lookup, custom theme registration, and ECharts config generator
├── index.ts               # Public barrel
└── README.md              # Theme documentation and extension guide
```

---

## 2. The 5 Canonical Themes

| Theme ID | Name | Mode | Intended Environment | Key Visual Identity |
| :--- | :--- | :--- | :--- | :--- |
| `light-enterprise` | **Light Enterprise** | Light | Daytime executive desktop dashboards | Clean white canvas, slate text, crisp blue/emerald series. |
| `dark-analytics` | **Dark Analytics** | Dark | SCADA & 24/7 NOC video walls | Deep `#0B0F17` background, glowing luminous line series, high contrast. |
| `warm-glass` | **Warm Glass** | Warm | Executive SaaS & editorial reviews | Ivory `#FAF6EE`, terracotta `#D95A32`, bronze `#C47A46`, specular top highlights. |
| `minimal-monochrome` | **Minimal Monochrome**| Light | High-density audit reports & printing | Zinc grayscale series with strict functional red/green semantic accents. |
| `high-contrast` | **High Contrast** | Dark | Outdoor kiosks & low-vision operators | Pure black `#000000`, saturated high-viz cyan/yellow/magenta (WCAG AAA). |

---

## 3. Usage Examples

### 1. Pure Theme Metadata Lookup (Zero-Dependency)
```typescript
import { getTheme, getAllThemes } from '@/library/themes';

const warmTheme = getTheme('warm-glass');
console.log(warmTheme.name); // 'Warm Glass'
console.log(warmTheme.colors.background); // '#FAF6EE'
```

### 2. Generating ECharts Configuration Without Importing ECharts
```typescript
import { getTheme, createEChartsThemeConfig } from '@/library/themes';

const theme = getTheme('dark-analytics');
const echartsConfig = createEChartsThemeConfig(theme);
// Pure JSON-serializable config ready to be registered or saved
```

### 3. Registering with ECharts in a Host Application
```typescript
import * as echarts from 'echarts';
import { getTheme, registerThemeWithECharts } from '@/library/themes';

const theme = getTheme('warm-glass');
registerThemeWithECharts(theme, echarts);
```

---

## 4. How to Add a New Custom Theme

To add a brand-specific theme without modifying core library files:

```typescript
import { registerCustomTheme, type ThemeDefinition } from '@/library/themes';
import { CATEGORICAL_PALETTES, SPC_COLOR_TOKENS, STATUS_COLOR_TOKENS } from '@/library/tokens';

const brandTheme: ThemeDefinition = {
  id: 'acme-corp',
  name: 'Acme Corporate',
  description: 'Custom theme for Acme Corporation intranet',
  isDark: false,
  colors: {
    background: '#F0FDF4',
    surface: '#FFFFFF',
    cardBorder: '#DCFCE7',
    textPrimary: '#14532D',
    textSecondary: '#166534',
    textMuted: '#4ADE80',
    gridLine: '#F0FDF4',
    axisLine: '#BBF7D0',
    palette: ['#16A34A', '#0D9488', '#2563EB', '#D97706'],
    spc: SPC_COLOR_TOKENS,
    status: STATUS_COLOR_TOKENS,
    tooltipBg: 'rgba(20, 83, 45, 0.95)',
    tooltipText: '#F0FDF4',
    tooltipBorder: 'rgba(255, 255, 255, 0.2)',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    titleSize: 14,
    subtitleSize: 11,
    axisSize: 10,
    legendSize: 11,
    tooltipSize: 11,
  },
  elevation: {
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    specularHighlight: 'none',
  },
};

registerCustomTheme(brandTheme);
```
