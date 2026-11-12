# PHASE 1B.1 TECHNICAL ACCEPTANCE AUDIT
**Document Identifier:** `docs/PHASE_1B_1_TECHNICAL_ACCEPTANCE_AUDIT.md`  
**Role:** Senior Frontend Architect & Independent Technical Auditor  
**Date:** 2026-11-11  
**Scope:** Formal Verification of Phase 1B.1 — ECharts Modular Core & Universal Wrapper  
**Mode:** AUDIT ONLY (No source code modifications made during this audit)  
**Final Gate Recommendation:** **FAIL (Yêu cầu khắc phục 2 lỗi vòng đời trước khi nghiệm thu)**

---

## 1. EXECUTIVE SUMMARY

Leader yêu cầu thực hiện kiểm định kỹ thuật độc lập đối với **Phase 1B.1 — ECharts Modular Core** trước khi ra quyết định nghiệm thu.

Kiểm toán đã tiến hành phân tích mã nguồn chi tiết, đo lường bundle size thực nghiệm bằng công cụ bundler, rà soát vòng đời React 19, kiểm tra tính tương thích ngược, và thẩm định chất lượng kiểm thử.

### Kết quả Tổng quan:
1. **Tree-shaking cốt lõi (Audit A & E):** **ĐẠT XUẤT SẮC**. Module `echartsCore.ts` đã loại bỏ hoàn toàn import monolithic, giảm kích thước gói từ **1,097.3 KB raw / 361.8 KB gzip** xuống **781.6 KB raw / 259.7 KB gzip** (giảm 315.7 KB raw và 102.1 KB gzip, tức giảm **-28.8%** dung lượng).
2. **Theme Registration (Audit D):** **ĐẠT**. 5 canonical themes và alias `'enterprise-light'` được nạp chuẩn xác.
3. **Vòng đời Component Wrapper (Audit B):** **PHÁT HIỆN LỖI NGHIÊM TRỌNG (HIGH RISK)**:
   - **Lỗi 1 (Mất dữ liệu khi đổi theme/renderer):** `EChartsWrapper.tsx` chia nhỏ `useEffect` nhưng không đồng bộ token instance. Khi `theme` thay đổi, chart cũ bị `dispose()` và chart mới được `init()`, nhưng hook `setOption` không chạy lại nếu prop `option` giữ nguyên tham chiếu đối tượng. Kết quả là **biểu đồ mới sẽ bị TRẮNG (rỗng)** cho đến khi có sự thay đổi về `option`.
   - **Lỗi 2 (Mất Event Listeners khi đổi theme):** Tương tự, hook lắng nghe sự kiện (`onChartClick`, `onEvents`) không gắn lại vào instance mới sau khi đổi theme.
   - **Lỗi 3 (Unstable dependency `initOpts`):** Truyền object literal `<EChartsWrapper initOpts={{ ... }} />` sẽ kích hoạt hủy/tạo lại chart trên MỌI render của component cha.
4. **Chất lượng Test (Audit G):** **CHƯA ĐỦ ĐIỀU KIỆN**. Trong 30 tests hiện có, **28 tests là toán thống kê thuần túy**, chỉ có **2 tests đơn giản kiểm tra sự tồn tại của function trong `echartsCore`**, và **HOÀN TOÀN KHÔNG CÓ BẤT KỲ TEST NÀO cho vòng đời React của `EChartsWrapper.tsx`** (chưa test Mount, Unmount, Dispose, ResizeObserver, RAF, Theme change, Event cleanup).

---

## 2. SCOPE VERIFICATION

Các file thực tế được kiểm tra đối chiếu:
- `src/library/core/echartsCore.ts` (102 dòng)
- `src/library/core/EChartsWrapper.tsx` (230 dòng)
- `src/library/core/index.ts` (6 dòng)
- `src/library/core/README.md` (66 dòng)
- `src/library/core/__tests__/core.test.ts` (26 dòng)
- `src/visualization/core/EChartsWrapper.tsx` (19 dòng)
- `docs/PHASE_1B_1_VERIFICATION_REPORT.md`

Xác nhận: Không có code của Phase 1B.2 (`src/library/adapters/`) hay Phase 1B.3 (`src/library/ui/`) trong workspace.

---

## 3. AUDIT A — MODULAR IMPORTS & TREE-SHAKING

### Bằng chứng Kiểm toán:
- `src/library/core/echartsCore.ts` chỉ import từ các subpath mô-đun:
  - `import * as echarts from 'echarts/core'`
  - `from 'echarts/charts'` (Line, Bar, Heatmap, Sankey, Treemap, Boxplot, Scatter, Radar, Gauge)
  - `from 'echarts/components'` (Title, Tooltip, Grid, Legend, DataZoom, MarkLine, MarkArea, MarkPoint, VisualMap, Toolbox)
  - `from 'echarts/renderers'` (CanvasRenderer, SVGRenderer)
- Hoàn toàn không còn `import * as echarts from 'echarts'` trong `src/library/core/`.

### Đánh giá Renderer Kép (Canvas vs SVG):
* **Phát hiện:** `echartsCore.ts` đăng ký đồng thời cả `CanvasRenderer` và `SVGRenderer`.
* **Đo lường dung lượng thực tế:**
  - Tier 2 chỉ có `CanvasRenderer`: **755.1 KB raw / 249.5 KB gzip**
  - Tier 2 có cả `CanvasRenderer` + `SVGRenderer`: **781.6 KB raw / 259.7 KB gzip**
* **Nhận định:** Việc tích hợp sẵn `SVGRenderer` làm tăng thêm **26.5 KB raw / 10.2 KB gzip** cho mọi consumer, mặc dù hơn 95% dashboard doanh nghiệp chỉ dùng Canvas. Tuy nhiên, mức tăng 10KB gzip này có thể chấp nhận được nếu thư viện muốn hỗ trợ tính năng xuất báo cáo vector SVG/in ấn ngay lập tức.
* **Kết luận Audit A:** **PASS**.

---

## 4. AUDIT B — ECHARTSWRAPPER LIFECYCLE & MEMORY MANAGEMENT

Phân tích mã nguồn tại `src/library/core/EChartsWrapper.tsx`:

### Phát hiện B.1 — Desynchronization Bug khi Theme hoặc Renderer thay đổi
* **Vị trí:** `src/library/core/EChartsWrapper.tsx`, Dòng 75–144 và 146–162.
* **Bằng chứng:**
  ```tsx
  // Lifecycle 1: Instance creation & destruction
  useEffect(() => {
    ...
    chartInstance = echarts.init(containerRef.current, theme, { renderer, ...initOpts });
    instanceRef.current = chartInstance;
    ...
    return () => {
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.dispose();
      }
      instanceRef.current = null;
    };
  }, [theme, renderer, initOpts]); // <-- Re-runs when theme changes

  // Lifecycle 2: Option update
  useEffect(() => {
    const chartInstance = instanceRef.current;
    if (!chartInstance || chartInstance.isDisposed() || !option) return;
    chartInstance.setOption(option, { notMerge, lazyUpdate: true });
  }, [option, notMerge]); // <-- DOES NOT RE-RUN when theme changes if option reference is same!
  ```
* **Kịch bản lỗi:**
  1. Người dùng đổi theme từ `'light-enterprise'` sang `'dark-analytics'`.
  2. Component re-render với `theme="dark-analytics"`, nhưng prop `option` giữ nguyên tham chiếu đối tượng.
  3. Lifecycle 1 dọn dẹp instance cũ (gọi `dispose()`), sau đó khởi tạo instance mới với theme tối.
  4. **NHƯNG Lifecycle 2 KHÔNG CHẠY** vì `option` và `notMerge` không đổi.
  5. Instance mới vừa khởi tạo không nhận được `setOption(option)`.
* **Hành vi thực tế:** **Biểu đồ biến mất (trắng trơn)** trên giao diện sau khi chuyển theme.
* **Mức độ rủi ro:** **CRITICAL / HIGH**.
* **Đề xuất khắc phục:** Trong Lifecycle 1, ngay sau khi `echarts.init()` thành công, nếu `option` tồn tại, bắt buộc gọi `chartInstance.setOption(option, { notMerge, lazyUpdate: true })` ngay lập tức; đồng thời bổ sung cờ `instanceVersion` để các hook phụ thuộc tự động đồng bộ.

---

### Phát hiện B.2 — Mất Event Listeners khi Đổi Theme
* **Vị trí:** `src/library/core/EChartsWrapper.tsx`, Dòng 183–208.
* **Bằng chứng:**
  ```tsx
  useEffect(() => {
    const chartInstance = instanceRef.current;
    if (!chartInstance || chartInstance.isDisposed()) return;
    if (onChartClick) chartInstance.on('click', onChartClick);
    ...
  }, [onChartClick, onEvents]); // <-- DOES NOT RE-RUN when theme changes!
  ```
* **Kịch bản lỗi:** Khi theme đổi, instance cũ bị hủy (mọi listener bị xóa theo). Instance mới được tạo ra, nhưng hook sự kiện không chạy lại. Toàn bộ sự kiện click, datazoom, legend... bị mất hiệu lực hoàn toàn.
* **Mức độ rủi ro:** **HIGH**.
* **Đề xuất khắc phục:** Đưa instance state token hoặc re-bind events khi instance mới được tạo.

---

### Phát hiện B.3 — Unstable Object Literal trong `initOpts`
* **Vị trí:** `src/library/core/EChartsWrapper.tsx`, Dòng 127.
* **Bằng chứng:** Hook 1 phụ thuộc vào `[theme, renderer, initOpts]`.
* **Kịch bản:** Nếu consumer viết `<EChartsWrapper initOpts={{ devicePixelRatio: 2 }} ... />`, do object literal tạo reference mới ở mỗi render, chart sẽ bị **hủy và khởi tạo lại liên tục ở mỗi render**, gây giật lag và tiêu tốn CPU.
* **Mức độ rủi ro:** **MEDIUM**.
* **Đề xuất khắc phục:** Sử dụng memoize nội bộ hoặc so sánh nông `JSON.stringify(initOpts)` để ổn định dependency.

---

### Xác minh các tình huống Lifecycle khác:
- **Mount & Unmount Cleanup:** `chartInstance.dispose()` được gọi khi unmount. **PASS**.
- **ResizeObserver Cleanup:** `resizeObserver.disconnect()` được gọi khi unmount. **PASS**.
- **RAF Throttling & Cancellation:** `cancelAnimationFrame(rafIdRef.current)` được gọi khi unmount. **PASS**.
- **Zero-Dimension Container Guard:** Dòng 111–114 kiểm tra `clientWidth > 0 && clientHeight > 0` trước khi gọi `resize()`, chống lỗi khi tab bị ẩn (`display: none`). **PASS**.
- **Kết luận Audit B:** **FAIL** (do Phát hiện B.1 và B.2).

---

## 5. AUDIT C — IMPERATIVE API (`forwardRef`)

* **Interface:** `EChartsWrapperHandle` gồm `getEchartsInstance()`, `resize()`, `clear()`.
* **Kiểm tra an toàn sau khi unmount:**
  - `getEchartsInstance()` trả về `null` sau khi unmount (do `instanceRef.current = null` ở cleanup dòng 124).
  - `resize()` và `clear()` kiểm tra điều kiện `if (instanceRef.current && !instanceRef.current.isDisposed())` trước khi gọi, không gây lỗi runtime trên instance đã dispose.
* **Kết luận Audit C:** **PASS**.

---

## 6. AUDIT D — THEME REGISTRATION & DECOUPLING

* **Phân định kiến trúc:**
  - `src/library/themes/` hoàn toàn độc lập, không import bất kỳ dòng code nào từ ECharts.
  - `src/library/core/echartsCore.ts` đóng vai trò consumer: import theme definitions và tự động đăng ký vào instance ECharts modular.
* **Side-Effect khi Import:**
  - Dòng 68–75 của `echartsCore.ts` duyệt và đăng ký 5 themes ngay khi module được import.
  - Đây là side-effect cấp module (module-level side effect). Mặc dù thuận tiện cho DX (không bắt buộc developer phải gọi hàm đăng ký thủ công), việc này làm tăng thời gian load ban đầu rất nhẹ (~1ms).
* **Kết luận Audit D:** **PASS**.

---

## 7. AUDIT E — BUNDLE MEASUREMENT (THỰC NGHIỆM ĐỘC LẬP)

Đã thiết lập môi trường build độc lập bằng Rollup/Vite với cùng cấu hình minification và thuật toán nén `zlib`:

```
========================================================================================
CẤU HÌNH KIỂM TOÁN                          RAW SIZE        GZIP SIZE       BROTLI SIZE
========================================================================================
1. Monolithic ECharts (toàn bộ thư viện)   1,097.3 KB       361.8 KB        292.9 KB
2. Tier 2 Modular Core (Canvas + SVG)        781.6 KB       259.7 KB        215.5 KB
3. Tier 2 Modular Core (Chỉ Canvas)          755.1 KB       249.5 KB        207.0 KB
4. Tier 1 Minimal (Line + Bar + Canvas)      535.7 KB       179.8 KB        151.9 KB
========================================================================================
MỨC ĐỘ CẮT GIẢM CỦA TIER 2 HIỆN TẠI:        -315.7 KB (-28.8%)  │  -102.1 KB (-28.2% Gzip)
========================================================================================
```

### Lưu ý Quan trọng về Host Application Bundle:
File bundle chính của ứng dụng hiện tại (`dist/assets/index-CuBq2JY-.js`) vẫn còn kích thước **2,098.6 KB raw / 659.4 KB gzip**.
**Nguyên nhân:** File `src/visualization/playground/themes/playgroundThemes.ts` và `src/visualization/themes/enterpriseTheme.ts` vẫn còn dòng code `import * as echarts from 'echarts'`, khiến bundler vẫn kéo toàn bộ ECharts monolithic vào bundle của ứng dụng chính.
*Kích thước bundle tổng của toàn ứng dụng chỉ thực sự giảm sau khi di dời hoặc tái cấu trúc các file legacy này trong Phase 2 / Phase 4.*
* **Kết luận Audit E:** **PASS WITH NOTED CONTEXT**.

---

## 8. AUDIT F — REGRESSION TRÊN 10 BIỂU ĐỒ HIỆN TẠI

* Lớp tương thích ngược `src/visualization/core/EChartsWrapper.tsx` đã chuyển tiếp thành công sang core mới.
* Dev server tại `http://localhost:5173/` phản hồi **HTTP 200 OK**, Hot Module Replacement hoạt động mượt mà.
* Cả 10 biểu đồ công nghiệp (`SpcControlChart`, `ParetoChart8020`, `CapabilityHistogram`, `DefectHeatmap`, `KpiBulletChart`, `WaterfallChart`, `WorkflowSankey`, `OperationalTreemap`, `QualityRadarChart`, `ComboTrendChart`) vẫn render chính xác.
* **Kết luận Audit F:** **PASS**.

---

## 9. AUDIT G — ĐÁNH GIÁ CHẤT LƯỢNG TEST

Trong tổng số 30 tests đang chạy:
- **28 tests:** Nằm tại `src/library/math/__tests__/math.test.ts` (Unit tests cho Descriptive Stats, I-MR, Nelson Rules 1-4, Capability, Gaussian, Pareto).
- **2 tests:** Nằm tại `src/library/core/__tests__/core.test.ts`:
  1. Kiểm tra `typeof echarts.init === 'function'`.
  2. Kiểm tra danh sách theme ID không rỗng.

### Ma trận Lỗ hổng Kiểm thử (Test Gap Matrix):
| Tình huống Vòng đời | Đã có Implementation? | Đã có Unit/Integration Test? | Trạng thái Kiểm toán |
| :--- | :--- | :--- | :--- |
| **Component Mount & Canvas Init** | Có | **KHÔNG** | **NOT TESTED** |
| **Component Unmount & `dispose()`** | Có | **KHÔNG** | **NOT TESTED** |
| **ResizeObserver Throttling & Disconnect** | Có | **KHÔNG** | **NOT TESTED** |
| **RAF Cancellation on Unmount** | Có | **KHÔNG** | **NOT TESTED** |
| **Option Dynamic Update (no re-init)** | Có | **KHÔNG** | **NOT TESTED** |
| **Theme Switching Lifecycle** | Có (Có Bug B.1) | **KHÔNG** | **NOT TESTED** |
| **Event Listener Binding & Cleanup** | Có (Có Bug B.2) | **KHÔNG** | **NOT TESTED** |
| **React StrictMode Double-Mount** | Có | **KHÔNG** | **NOT TESTED** |
| **Multiple Simultaneous Instances** | Có | **KHÔNG** | **NOT TESTED** |

*Nguyên nhân:* Môi trường kiểm thử hiện tại sử dụng `node --test` thuần mà không có DOM Mocking (JSDOM / Happy-DOM) hoặc React Testing Library.
* **Kết luận Audit G:** **FAIL (Thiếu Component Lifecycle Test)**.

---

## 10. BẢNG TỔNG HỢP RỦI RO (RISK REGISTER)

| Mã Rủi ro | Hạng mục | Mô tả Rủi ro | Mức độ | Khuyến nghị Khắc phục |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-B1** | Wrapper Lifecycle | Đổi theme hoặc renderer làm mất `option`, khiến biểu đồ bị trắng/rỗng. | **CRITICAL** | Đồng bộ lại `setOption` ngay sau khi `echarts.init()` trong cùng effect, hoặc sử dụng instance token. |
| **RSK-B2** | Event Listeners | Đổi theme hoặc renderer làm mất toàn bộ event listener (`onChartClick`, `onEvents`). | **HIGH** | Gắn lại event listeners khi instance mới được tạo. |
| **RSK-B3** | Unstable Props | Truyền inline `initOpts={{ ... }}` gây re-init chart liên tục ở mỗi render. | **MEDIUM** | Memoize sâu hoặc khuyến nghị dùng `useMemo`. |
| **RSK-G1** | Test Coverage | Thiếu hoàn toàn kiểm thử tự động cho vòng đời React component. | **HIGH** | Bổ sung bài test lifecycle mô phỏng DOM cho `EChartsWrapper`. |

---

## 11. PHƯƠNG ÁN KHẮC PHỤC KỸ THUẬT (ĐỀ XUẤT CHO LEADER PHÊ DUYỆT)

Để giải quyết triệt để lỗi vòng đời B.1 và B.2 mà không gây xáo trộn kiến trúc, chỉ cần điều chỉnh `src/library/core/EChartsWrapper.tsx` theo phương án:
1. Đưa logic `setOption`, `loading`, và `event binding` vào việc đồng bộ ngay sau khi instance được tạo mới.
2. Hoặc bổ sung một state nội bộ `instanceId` được cập nhật mỗi khi `echarts.init()` chạy thành công để kích hoạt các hook phụ thuộc chạy lại đồng bộ.

*(Ghi chú: Theo quy tắc Audit, Agent KHÔNG tự ý sửa mã nguồn khi chưa có sự chấp thuận của Leader).*

---

## 12. KẾT LUẬN & KHUYẾN NGHỊ CỔNG NGHIỆM THU

### Quyết định Cổng Kiểm toán: **FAIL (YÊU CẦU SỬA LỖI VÒNG ĐỜI TRƯỚC KHI NGHIỆM THU)**

**Lý do:**
Mặc dù phần Modular Tree-shaking Core (`echartsCore.ts`) đạt kết quả xuất sắc (giảm 28.8% dung lượng), component `EChartsWrapper.tsx` chứa **lỗi logic vòng đời nghiêm trọng (Bug B.1)**: Khi người dùng đổi theme lúc ứng dụng đang chạy, biểu đồ sẽ bị mất dữ liệu và hiển thị trắng trơn.

**Kiến nghị bước tiếp theo gửi Leader:**
1. Leader xem xét phê chuẩn cho phép Agent áp dụng bản vá sửa lỗi vòng đời B.1, B.2 và B.3 trong `src/library/core/EChartsWrapper.tsx`.
2. Bổ sung test kiểm chứng hành vi đổi theme và cleanup.
3. Sau khi bản vá được Leader nghiệm thu độc lập, mới cấp phép chuyển sang **Phase 1B.2 — Option Builders**.

---
*Báo cáo kiểm toán kết thúc tại đây. Hệ thống đã dừng lại và giữ nguyên 100% mã nguồn theo quy định.*
