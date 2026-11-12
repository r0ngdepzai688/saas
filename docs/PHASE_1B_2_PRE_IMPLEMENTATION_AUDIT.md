# PHASE 1B.2 PRE-IMPLEMENTATION AUDIT
**Document Identifier:** `docs/PHASE_1B_2_PRE_IMPLEMENTATION_AUDIT.md`  
**Role:** Senior Frontend Architect & Visualization Engineer  
**Date:** 2026-11-12  
**Audit Purpose:** Comprehensive technical audit and architectural plan prior to implementing the Visualization Option Builders layer.  
**Mode:** AUDIT & ARCHITECTURE DESIGN ONLY (No source code modifications in Stage A).

---

## 1. CẤU TRÚC HIỆN TẠI (EXISTING APPLICATION STATE)

Sau khi hoàn thành Phase 1A (Design Foundation & Pure Math) và Phase 1B.1 (ECharts Modular Core & Remediation), cấu trúc module hiện tại trong `src/library/` bao gồm:

```
src/library/
├── contracts/
│   ├── visualizationContract.ts   # JSON Schema định nghĩa trừu tượng độc lập framework
│   └── README.md
├── core/
│   ├── echartsCore.ts             # Modular tree-shaken ECharts instance + theme registration
│   ├── EChartsWrapper.ts          # Pure TS Canvas wrapper (React.createElement)
│   ├── EChartsWrapper.tsx         # Typed facade re-export
│   ├── index.ts
│   ├── README.md
│   └── __tests__/                 # 15 component lifecycle tests
├── math/
│   ├── capability.ts              # Cp, Cpk, Pp, Ppk
│   ├── gaussian.ts                # Đường cong phân phối chuẩn Gauss
│   ├── math.types.ts
│   ├── nelsonRules.ts             # 8 quy tắc phát hiện bất thường Nelson
│   ├── pareto.ts                  # Phân phối tích lũy 80/20
│   ├── spc.ts                     # Shewhart I-MR, X-bar/R, X-bar/S, ±3σ
│   ├── index.ts
│   ├── README.md
│   └── __tests__/                 # 30 math unit tests
├── themes/
│   ├── themeDefinitions.ts        # 5 canonical themes
│   ├── themeRegistry.ts           # Registry & createEChartsThemeConfig adapter
│   ├── theme.types.ts
│   ├── index.ts
│   └── README.md
└── tokens/
    ├── colorTokens.ts             # Bảng màu semantic, status, categorical
    ├── spacingTokens.ts
    ├── typographyTokens.ts
    ├── tokens.types.ts
    ├── index.ts
    └── README.md
```

### Hiện Trạng Sử Dụng ECharts Tại Các Biểu Đồ Hiện Có
Hiện tại, cả 10 biểu đồ tại `src/visualization/charts/` và Playground tại `src/visualization/playground/adapters/playgroundOptionBuilder.ts` đang **tự cấu hình thủ công ECharts Option**:
- Mỗi component tự khai báo `tooltip`, `grid`, `xAxis`, `yAxis`, `color`, `legend`, `splitLine`, `axisLabel` lặp đi lặp lại.
- Màu sắc bị hardcode rải rác: `#2563EB`, `#D97706`, `#DC2626`, `#F1F5F9`, `rgba(245, 158, 11, 0.05)`, v.v.
- Logic cấu hình ECharts bị phân tán, thiếu một tầng chuyển đổi chuẩn hóa từ `VisualizationSpec` (JSON Contract) sang `EChartsOption`.

---

## 2. PHÂN TÍCH VISUALIZATION CONTRACT THỰC TẾ

Visualization JSON Contract tại [`src/library/contracts/visualizationContract.ts`](file:///d:/Vibe_coding/Saas/src/library/contracts/visualizationContract.ts) định nghĩa cấu trúc:

```typescript
export interface VisualizationSpec {
  readonly version: '1.0';
  readonly id: string;
  readonly archetype: VisualizationArchetype;
  readonly title: string;
  readonly subtitle?: string;
  readonly unit?: string;
  readonly themeId?: string;
  readonly summary?: ContractMetricSummary;
  readonly encoding?: VisualizationEncoding;
  readonly data: VisualizationDataPayload;
}
```

### Các Archetype Được Định Nghĩa Trong Contract:
1. `spc-control`: Biểu đồ kiểm soát Shewhart (I-MR / X-bar) với UCL, LCL, CL và Nelson Rules.
2. `pareto-8020`: Phân tích Pareto khuyết tật với cột tần số và đường tỷ lệ phần trăm tích lũy.
3. `capability-histogram`: Biểu đồ phân bố năng lực (Cp/Cpk) với histogram và đường chuẩn Gauss.
4. `defect-heatmap`: Ma trận nhiệt độ khuyết tật đa trạm/công đoạn.
5. `kpi-bullet`: Biểu đồ thanh ngang so sánh thực tế vs mục tiêu trong các dải định tính.
6. `waterfall`: Cân đối phân rã tổn thất sản xuất lũy tiến.
7. `workflow-sankey`: Luồng sản lượng quy trình sản xuất qua các công đoạn.
8. `operational-treemap`: Cấu trúc cây phân cấp khuyết tật/tổn thất theo tỷ lệ diện tích.
9. `quality-radar`: Radar đa chiều đánh giá năng lực chất lượng.
10. `combo-trend`: Xu hướng kết hợp sản lượng và tỷ lệ lỗi trên hai trục tung độc lập.
11. `horizon-area` / `continuous-trend`: Chuỗi thời gian mật độ cao.

---

## 3. PHÂN TÍCH TRÙNG LẶP & CÁC VẤN ĐỀ TRONG IMPLEMENTATION CŨ

Qua kiểm tra 10 biểu đồ và file `playgroundOptionBuilder.ts` (793 dòng), các điểm trùng lặp nghiêm trọng gồm:

1. **Grid Layout Trùng Lặp:**
   - Hầu hết biểu đồ khai báo thủ công:
     ```typescript
     grid: { left: 12, right: 28, top: 36, bottom: 24, containLabel: true }
     ```
   - Không đồng bộ theo mật độ thông tin hoặc sự hiện diện của trục Y thứ hai / legend / datazoom.
2. **Tooltip Formatting Trùng Lặp & Khó Đọc:**
   - Mỗi biểu đồ tự viết formatter HTML dạng inline template string, tự chèn màu, border, font-family.
   - Khi chuyển sang theme tối (Dark Analytics), các tooltip này không thích ứng được màu chữ hoặc nền do hardcode HTML styles.
3. **Axis & SplitLine Configuration:**
   - Cấu hình trục lặp lại liên tục: `axisLabel: { fontSize: 10 }`, `splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } }`.
4. **Hardcoded Color Codes Thay Vì Token System:**
   - Mã màu xanh dương `#2563EB`, vàng `#D97706`, đỏ `#DC2626` xuất hiện thủ công ở hơn 20 vị trí thay vì tham chiếu qua `src/library/tokens/colorTokens.ts` hoặc theme hiện tại.
5. **MarkLine & MarkArea Cấu Hình Lại Thủ Công:**
   - Mỗi biểu đồ chất lượng (SPC, Pareto, Capability) lại tự xây dựng cấu trúc mảng cho `markLine` và `markArea`, gây nguy cơ sai sót về nhãn và đường gióng.
6. **Không Xử Lý An Toàn Khi Dữ Liệu Rỗng:**
   - Nếu `data` truyền vào rỗng (`[]`), nhiều biểu đồ sinh ra mảng rỗng hoặc chia cho 0 (`totalCount || 1`), làm ECharts hiển thị trục trống mà không có thông báo trạng thái rỗng rõ ràng.

---

## 4. BUILDER MATRIX ĐỀ XUẤT

Để tuân thủ nguyên tắc:
- Không tạo một builder generic khổng lồ với hàng chục nhánh `switch/case` khó kiểm soát.
- Không tạo abstraction vô ích cho từng biểu đồ đơn lẻ khi chúng có cùng bản chất hình học.
- Chia thành **Common Primitives** (dùng chung cho mọi biểu đồ) và **Chart-Family Builders** (chuyên biệt theo cấu trúc trực quan):

| Nhóm Builder | Tên Builder Function | Trách nhiệm | Input | Output | Biểu đồ sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Common** | `buildBaseGrid` | Tạo layout grid chuẩn, tính toán margin theo presence của dual-axis, datazoom, legend | `GridOptions` | `GridComponentOption` | Mọi biểu đồ Cartesian |
| **Common** | `buildBaseTooltip` | Tạo tooltip cấu hình chuẩn, thích ứng theme, font tokens, trigger axis/item | `TooltipOptions` | `TooltipComponentOption` | Tất cả 10 biểu đồ |
| **Common** | `buildBaseLegend` | Cấu hình legend nhất quán vị trí, typography và icon | `LegendOptions` | `LegendComponentOption` | Combo, Radar, Bullet, SPC |
| **Common** | `buildCategoryAxis` | Cấu hình trục danh mục chuẩn typography, lineStyle, grid alignment | `AxisOptions` | `XAXisOption / YAXisOption` | Line, Bar, Pareto, Heatmap |
| **Common** | `buildValueAxis` | Cấu hình trục giá trị chuẩn với unit formatting, min/max padding, split lines | `AxisOptions` | `XAXisOption / YAXisOption` | SPC, Pareto, Combo, Capability |
| **Common** | `buildContractMarkLines` | Chuyển đổi `ContractMarkLine[]` thành `SeriesMarkLineOption` | `ContractMarkLine[]` | `SeriesMarkLineOption` | SPC, Pareto, Capability |
| **Common** | `buildContractMarkAreas` | Chuyển đổi `ContractMarkArea[]` thành `SeriesMarkAreaOption` | `ContractMarkArea[]` | `SeriesMarkAreaOption` | SPC, Capability |
| **Cartesian** | `buildCartesianOption` | Dựng Option cho chuỗi thời gian, thanh, đường, xu hướng kết hợp | `CartesianSpec / Contract` | `EChartsOption` | Line, Bar, Combo Trend, Bullet |
| **Statistical** | `buildSpcControlOption` | Dựng Option cho SPC I-MR / X-bar với CL, UCL, LCL, Nelson out-of-control points | `VisualizationSpec` | `EChartsOption` | SPC Control Chart |
| **Statistical** | `buildParetoOption` | Dựng Option cho Pareto 80/20 với 2 trục Y (Số lượng + % tích lũy) và đường cutoff | `VisualizationSpec` | `EChartsOption` | Pareto 80/20 Chart |
| **Statistical** | `buildCapabilityOption` | Dựng Option cho phân bố năng lực: Histogram bins + Đường cong Gauss + USL/LSL | `VisualizationSpec` | `EChartsOption` | Capability Histogram |
| **Specialized** | `buildHeatmapOption` | Dựng Option ma trận nhiệt độ với VisualMap continuous/piecewise gradient | `VisualizationSpec` | `EChartsOption` | Defect Heatmap Matrix |
| **Hierarchical**| `buildTreemapOption` | Dựng Option phân cấp dạng Treemap với leafDepth, levels, breadcrumb | `VisualizationSpec` | `EChartsOption` | Operational Treemap |
| **Relational** | `buildSankeyOption` | Dựng Option luồng quy trình Sankey với nodes, links, gradient lineStyle | `VisualizationSpec` | `EChartsOption` | Workflow Sankey |
| **Radial** | `buildRadarOption` | Dựng Option radar đa chiều với indicators, polygon areaStyle, splitArea | `VisualizationSpec` | `EChartsOption` | Quality Radar Chart |
| **Universal Adapter** | `buildEChartsOptionFromSpec` | Dispatcher chuyển đổi từ `VisualizationSpec` tổng quát sang `EChartsOption` chuẩn | `VisualizationSpec` | `EChartsOption` | Universal Entry Point |

---

## 5. KIẾN TRÚC MỤC TIÊU & CẤU TRÚC THƯ MỤC

```
src/library/builders/
├── common/
│   ├── gridBuilder.ts           # buildBaseGrid
│   ├── tooltipBuilder.ts        # buildBaseTooltip
│   ├── legendBuilder.ts         # buildBaseLegend
│   ├── axisBuilder.ts           # buildCategoryAxis, buildValueAxis
│   └── markerBuilder.ts         # buildContractMarkLines, buildContractMarkAreas
├── families/
│   ├── cartesianBuilder.ts      # Line, Bar, Combo Trend, Bullet, Waterfall
│   ├── spcBuilder.ts            # Shewhart Control Chart
│   ├── paretoBuilder.ts         # Pareto 80/20
│   ├── capabilityBuilder.ts     # Capability Histogram + Gauss
│   ├── heatmapBuilder.ts        # Defect Heatmap Matrix
│   ├── hierarchicalBuilder.ts   # Treemap
│   ├── relationalBuilder.ts     # Sankey
│   └── radarBuilder.ts          # Radar
├── specAdapter.ts               # buildEChartsOptionFromSpec (Dispatcher)
├── builder.types.ts             # TypeScript definitions cho builder options
├── index.ts                     # Public export barrel
└── __tests__/                   # Unit & Integration test suite
    ├── commonBuilders.test.ts   # Test các primitives dùng chung
    ├── chartBuilders.test.ts    # Test các builder chuyên biệt theo family
    └── specAdapter.test.ts      # Test chuyển đổi Contract -> EChartsOption
```

---

## 6. DANH SÁCH FILE DỰ KIẾN TẠO MỚI / CHỈNH SỬA

### File Tạo Mới:
1. `src/library/builders/builder.types.ts`
2. `src/library/builders/common/gridBuilder.ts`
3. `src/library/builders/common/tooltipBuilder.ts`
4. `src/library/builders/common/legendBuilder.ts`
5. `src/library/builders/common/axisBuilder.ts`
6. `src/library/builders/common/markerBuilder.ts`
7. `src/library/builders/families/cartesianBuilder.ts`
8. `src/library/builders/families/spcBuilder.ts`
9. `src/library/builders/families/paretoBuilder.ts`
10. `src/library/builders/families/capabilityBuilder.ts`
11. `src/library/builders/families/heatmapBuilder.ts`
12. `src/library/builders/families/hierarchicalBuilder.ts`
13. `src/library/builders/families/relationalBuilder.ts`
14. `src/library/builders/families/radarBuilder.ts`
15. `src/library/builders/specAdapter.ts`
16. `src/library/builders/index.ts`
17. `src/library/builders/__tests__/commonBuilders.test.ts`
18. `src/library/builders/__tests__/chartBuilders.test.ts`
19. `src/library/builders/__tests__/specAdapter.test.ts`
20. `src/library/builders/README.md`
21. `docs/PHASE_1B_2_IMPLEMENTATION_REPORT.md`

### File Chỉnh Sửa Tối Thiểu (Chỉ Re-export):
- `src/library/index.ts` (export `* from './builders'`)

### File Giữ Nguyên Tuyệt Đối (Không Sửa Đổi):
- `src/library/contracts/*` (Visualization Contract không thay đổi)
- `src/library/math/*` (Pure Math giữ nguyên)
- `src/library/tokens/*` & `src/library/themes/*`
- `src/library/core/EChartsWrapper.ts` & `EChartsWrapper.tsx`
- `src/library/core/echartsCore.ts`
- 10 chart components hiện có (đảm bảo backward compatibility hoàn toàn)

---

## 7. ĐÁNH GIÁ RỦI RO TƯƠNG THÍCH (COMPATIBILITY RISKS)

1. **Rủi Ro Đột Biến Đối Tượng (Mutation Risk):**
   - *Nguy cơ:* Nếu builder nhận `VisualizationSpec` hoặc `EChartsOption` rồi sửa trực tiếp thuộc tính (mutate object), các renders tiếp theo trong React sẽ bị lỗi state.
   - *Biện pháp:* 100% builders được thiết kế là **Pure Functions**. Luôn clone và khởi tạo object mới (immutability), không bao giờ sửa `spec.data` hoặc input props.
2. **Rủi Ro Xung Đột Kiểu Dữ Liệu (Contract Type vs ECharts Option Type):**
   - *Nguy cơ:* Nhầm lẫn giữa kiểu trừu tượng trong Contract (`ContractMarkLine`) và kiểu cụ thể của ECharts (`SeriesMarkLineOption`).
   - *Biện pháp:* Khai báo rõ ràng: Builders nhận Contract types và trả về `EChartsOption` chuẩn. Không bao giờ để ECharts types rò rỉ ngược lại vào Contract.
3. **Rủi Ro Dữ Liệu Rỗng Hoặc Sai Lệch (Empty/Malformed Data):**
   - *Nguy cơ:* Dữ liệu `data.records = []` hoặc `data.matrix = []` khiến hàm tính toán bị chia cho 0 hoặc sinh ra mảng `NaN`.
   - *Biện pháp:* Tất cả builders thực hiện kiểm tra điều kiện tiên quyết (fail-safe preflight). Khi dữ liệu rỗng hoặc không hợp lệ, trả về Option hiển thị trạng thái an toàn (title thông báo rỗng hoặc empty series) mà không ném lỗi runtime làm crash ứng dụng.

---

## 8. CHIẾN LƯỢC KIỂM THỬ (TEST STRATEGY)

1. **Unit Tests (Pure TypeScript, Node 24 native runner):**
   - Kiểm tra từng builder primitives (`buildBaseGrid`, `buildBaseTooltip`, v.v.): kiểm tra giá trị mặc định, kiểm tra khả năng override, xác minh không làm thay đổi input object.
   - Kiểm tra xử lý dữ liệu rỗng và dữ liệu lỗi (NaN, null, empty array).
   - Kiểm tra tích hợp màu sắc từ theme registry.
2. **Integration Tests:**
   - Tạo mẫu `VisualizationSpec` cho từng archetype và chuyển đổi qua `buildEChartsOptionFromSpec`.
   - Xác minh `EChartsOption` đầu ra chứa đầy đủ các series, axes, tooltips tương ứng.
   - Kiểm tra tính tương thích với `echartsCore` (không chứa component chưa được register).
3. **Regression Tests:**
   - Chạy toàn bộ 45 unit tests hiện có trong `src/library/math/` và `src/library/core/` (phải đạt 45/45 PASS).
   - Chạy `tsc -b` (0 errors), `vite build` (sạch sẽ), và `oxlint` (0 warnings).

---

## 9. NỘI DUNG CHỦ ĐỘNG KHÔNG TRIỂN KHAI (OUT OF SCOPE)

1. **Không triển khai UI Shells hoặc Chart Cards (Phase 1B.3):**
   - Các component bao ngoài như Chart Container, Toolbar xuất ảnh, Modal phóng to, Drawer chỉnh cấu hình thuộc phạm vi Phase 1B.3.
2. **Không tự ý refactor 10 chart components hiện có:**
   - 10 biểu đồ hiện tại đang chạy ổn định. Việc chuyển đổi chúng sang sử dụng builders sẽ được thực hiện khi có yêu cầu nghiệm thu riêng, không làm trong Phase 1B.2 để bảo toàn 100% tính ổn định của ứng dụng.
3. **Không tạo Generic Megabuilder:**
   - Tránh việc gộp tất cả biểu đồ vào một hàm 1,500 dòng với hàng chục cờ `if/else`. Kiến trúc phân tán thành các family modules rõ ràng, mạch lạc.
