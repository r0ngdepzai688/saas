# Design Tokens Foundation (`src/library/tokens/`)

The Design Tokens module provides **framework-independent, zero-dependency constants and types** that define the visual primitives across enterprise analytics applications.

---

## 1. Module Structure

```
src/library/tokens/
├── tokens.types.ts       # Type contracts for palettes, typography, spacing, elevation
├── colorTokens.ts        # Categorical series palettes, SPC limit colors, semantic status
├── typographyTokens.ts   # Font stacks, size scales, and tabular numeric feature flags
├── spacingTokens.ts      # Spacing scale, radii, dimensions, and specular highlights
├── index.ts              # Canonical export barrel
└── README.md             # Architecture and consumption documentation
```

---

## 2. Design Principles

1. **Strict Framework Agnosticism:** Zero imports of React, Vue, ECharts, or DOM elements. Can be used in Node.js, Vite, Next.js, or converted directly into CSS Custom Properties or Python dictionaries.
2. **WCAG 2.2 AA / AAA Accessibility:**
   - Text contrast on surfaces is strictly maintained $\ge 4.5:1$ (AA) and $\ge 7:1$ (AAA for high-contrast modes).
   - High-contrast SCADA palette (`CATEGORICAL_PALETTES.highContrast`) provides $\ge 7:1$ against pure black backgrounds.
3. **Dual Visual Personalities:**
   - **Executive Warm Glass:** Ivory, cream, bronze, terracotta, and soft roast brown with specular top-edge highlights.
   - **Operational High-Contrast:** 100% opaque slate/black surfaces with high-visibility cyan/yellow/green for factory kiosks.
4. **Statistical Rigor:** Standardized SPC colors align with ISO 7870-2:
   - Process Center Line ($\bar{X}$): Green (`#16A34A`)
   - Natural Control Limits ($UCL/LCL$): Amber (`#D97706`)
   - Customer Specification Limits ($USL/LSL$): Red (`#DC2626`)
   - Out-of-control anomalies: Red (`#EF4444`)

---

## 3. Usage Examples

### Consuming in TypeScript / React
```typescript
import {
  CATEGORICAL_PALETTES,
  SPC_COLOR_TOKENS,
  STATUS_COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
} from '@/library/tokens';

// Using in a custom component or canvas renderer
const primarySeriesColor = CATEGORICAL_PALETTES.enterprise[0]; // '#2563EB'
const uclLineColor = SPC_COLOR_TOKENS.ucl; // '#D97706'
```

### Consuming in Vanilla JS / CSS Custom Properties
```javascript
import { DEFAULT_DESIGN_TOKENS } from '@/library/tokens';

// Apply tokens as CSS variables dynamically
const root = document.documentElement;
root.style.setProperty('--token-spc-ucl', DEFAULT_DESIGN_TOKENS.colors.spc.ucl);
root.style.setProperty('--token-card-radius', DEFAULT_DESIGN_TOKENS.dimensions.cardRadius);
```

---

## 4. How to Extend or Add a New Palette
1. Open `colorTokens.ts`.
2. Add a new readonly array under `CATEGORICAL_PALETTES`:
   ```typescript
   export const CATEGORICAL_PALETTES = {
     // ...
     customBrand: [
       '#1E3A8A', '#0D9488', '#B45309', '#6D28D9',
       '#BE185D', '#C2410C', '#4338CA', '#047857',
     ] as const,
   };
   ```
3. Type-check using `pnpm run build`.
