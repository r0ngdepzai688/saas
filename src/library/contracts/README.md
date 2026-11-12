# Visualization JSON Contract (`src/library/contracts/`)

This directory defines the **framework-independent JSON schema** for serializing analytical chart specifications between backends and frontends.

---

## 1. Architectural Distinction: TypeScript vs Python/FastAPI

> [!IMPORTANT]
> - **Frontend Option Builders (`src/library/adapters/`):** Executable TypeScript functions that take this contract (or raw datasets) and compile them into native, hardware-accelerated `EChartsOption` objects.
> - **Backend Services (Python / FastAPI / Go / Java):** Can serialize responses conforming to this exact `VisualizationSpec` schema (e.g., using Pydantic in Python).
> - **Zero Shared Runtime Execution:** Python does **not** execute TypeScript functions directly; rather, both systems share the identical contract format. A FastAPI endpoint returns `VisualizationSpec` as JSON, and the frontend consumes it without custom glue code.

---

## 2. Realistic JSON Specification Examples

### Example A: Shewhart I-MR Quality Control Chart
```json
{
  "version": "1.0",
  "id": "line-4-spc-spec",
  "archetype": "spc-control",
  "title": "Line 4 Inner Diameter Telemetry",
  "subtitle": "Shewhart I-MR Control Chart (Last 24 Hours)",
  "unit": "mm",
  "themeId": "warm-glass",
  "summary": {
    "primaryKpi": {
      "label": "Process Mean",
      "value": 12.042,
      "unit": "mm",
      "delta": 0.015,
      "deltaDirection": "up",
      "status": "optimal"
    }
  },
  "encoding": {
    "xField": "timestamp",
    "yField": "value",
    "showDataZoom": true,
    "markLines": [
      { "label": "CL", "yAxis": 12.042, "color": "#16A34A", "lineStyle": "solid" },
      { "label": "UCL", "yAxis": 12.825, "color": "#D97706", "lineStyle": "dashed" },
      { "label": "LCL", "yAxis": 11.259, "color": "#D97706", "lineStyle": "dashed" }
    ],
    "markAreas": [
      { "label": "Zone A (Warning)", "y0": 12.564, "y1": 12.825, "color": "#D97706", "opacity": 0.08 }
    ]
  },
  "data": {
    "seriesName": "Dimensional Measure",
    "records": [
      { "timestamp": "08:00", "value": 12.01, "sampleId": "SMP-001" },
      { "timestamp": "08:15", "value": 12.05, "sampleId": "SMP-002" },
      { "timestamp": "08:30", "value": 12.12, "sampleId": "SMP-003" }
    ]
  }
}
```

### Example B: Defect Pareto 80/20 Triage
```json
{
  "version": "1.0",
  "id": "monthly-defect-pareto",
  "archetype": "pareto-8020",
  "title": "Monthly Defect Triage",
  "subtitle": "Juran 80/20 Prioritization",
  "unit": "defects",
  "themeId": "light-enterprise",
  "encoding": {
    "markLines": [
      { "label": "80% Cutoff", "yAxis": 80, "color": "#DC2626", "lineStyle": "dashed" }
    ]
  },
  "data": {
    "categories": ["Pinhole", "Discoloration", "Tear", "Bead Defect", "Other"],
    "records": [
      { "category": "Pinhole", "value": 1420 },
      { "category": "Discoloration", "value": 850 },
      { "category": "Tear", "value": 310 },
      { "category": "Bead Defect", "value": 140 },
      { "category": "Other", "value": 65 }
    ]
  }
}
```

---

## 3. How a Frontend Renderer Consumes the Contract

```typescript
import type { VisualizationSpec } from '@/library/contracts/visualizationContract';
import { getTheme, createEChartsThemeConfig } from '@/library/themes';
import { spcAdapter, paretoAdapter } from '@/library/adapters';

export function renderVisualizationSpec(spec: VisualizationSpec, chartInstance: any) {
  // 1. Resolve theme
  const theme = getTheme(spec.themeId ?? 'light-enterprise');
  
  // 2. Select appropriate option builder by archetype
  let echartsOption: any;
  switch (spec.archetype) {
    case 'spc-control':
      echartsOption = spcAdapter(spec.data.records, spec.encoding, theme);
      break;
    case 'pareto-8020':
      echartsOption = paretoAdapter(spec.data.records, spec.encoding, theme);
      break;
    default:
      throw new Error(`Unsupported archetype: ${spec.archetype}`);
  }

  // 3. Apply to canvas instance
  chartInstance.setOption(echartsOption, true);
}
```

---

## 4. Python / FastAPI Integration Example

In a FastAPI backend, declare a Pydantic model mirroring the contract:

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class VisualizationSpecModel(BaseModel):
    version: Literal["1.0"] = "1.0"
    id: str
    archetype: Literal["spc-control", "pareto-8020", "capability-histogram", "kpi-bullet"]
    title: str
    subtitle: Optional[str] = None
    unit: Optional[str] = None
    themeId: Optional[str] = "light-enterprise"
    data: Dict[str, Any]

@app.get("/api/v1/quality/spc", response_model=VisualizationSpecModel)
def get_spc_chart():
    return {
        "version": "1.0",
        "id": "line-4-spc-spec",
        "archetype": "spc-control",
        "title": "Line 4 Dimensional Variance",
        "subtitle": "Last 24 Hours Shewhart I-MR",
        "unit": "mm",
        "themeId": "warm-glass",
        "data": {
            "records": [{"timestamp": "10:00", "value": 12.3}, {"timestamp": "10:05", "value": 12.5}]
        }
    }
```
