# 🌐 Web Dev & Craft — 2026-06-23

> Trình duyệt đang "nuốt" bớt JavaScript (container query name-only, `:open`, lazy media), V8 tối ưu serialization, và React Compiler 1.0 chính thức stable — toàn tin có pattern/API rõ ràng, không listicle.

## ⭐ [New to the web platform in May](https://web.dev/blog/web-platform-05-2026) — (web.dev)
**Đây là gì:** Bài tổng hợp định kỳ của web.dev (tác giả Rachel Andrew, 29/05/2026) điểm các feature web platform vừa lên stable/beta trong tháng 5, kèm trạng thái Baseline. "Baseline Newly available" = feature vừa interoperable trên cả 3 engine (Chrome/Firefox/Safari) trong vòng ~30 tháng gần đây.

**Chi tiết:**
- **`:open` pseudo-class** (Baseline Newly available, Safari 26.5 bổ sung nốt): style element có trạng thái "open/closed" mà không cần attribute selector. Thay vì `details[open]` bạn viết:
  ```css
  details:open > summary { font-weight: bold; }
  dialog:open { animation: fade-in 0.2s; }
  ```
  Áp dụng cho `<details>`, `<dialog>`, `<select>`, và input pickers (color/date).
- **Name-only container queries** (Chrome 148): query container theo tên mà KHÔNG cần điều kiện size, và bỏ luôn yêu cầu `container-type`:
  ```css
  #container { container-name: --sidebar; }
  @container --sidebar { .content { padding: 2rem; } }
  ```
- **Container style queries cho custom properties** (Firefox 151): `@container style(--theme: dark) { ... }` — query biến CSS của container cha, mở đường cho theming khai báo thuần CSS.
- **Lazy loading cho `<video>`/`<audio>`** (Chrome 148): `loading="lazy"` native, hoãn tải media đến khi gần viewport — giảm bandwidth, tốt cho LCP.
- **Document Picture-in-Picture API** (Firefox 151, desktop): mở cửa sổ always-on-top chứa HTML tùy ý.

**Vì sao đáng đọc:** `:open` + name-only container query là thứ dùng được ngay trong UI Polaris/React của Joy Loyalty: animate dialog/details bằng CSS thuần, bớt JS state cho mấy logic open/close; `loading="lazy"` cho media giúp ăn điểm Core Web Vitals trên storefront/embed.

## [15 updates from Google I/O 2026: Declarative Partial Updates & Soft Navigations](https://developer.chrome.com/blog/chrome-at-io26) — (Chrome for Developers)
**Đây là gì:** Recap I/O 2026 (19/05/2026) về các API web platform mới của Chrome. Hai cái đáng chú ý cho dev app: **Declarative Partial Updates** (cập nhật HTML out-of-order qua streaming API, không cần DOM manipulation thủ công) và **Soft Navigations API** (đo Core Web Vitals cho SPA — vốn lâu nay CWV chỉ tính cho full page load).

**Chi tiết:**
- **Declarative Partial Updates**: primitive native để stream và chèn HTML vào trang theo thứ tự bất kỳ (out-of-order), giảm phụ thuộc vào diffing/innerHTML thủ công. Đang ở giai đoạn test.
- **Soft Navigations API**: mang đo lường CWV (LCP/INP/CLS) vào điều hướng kiểu SPA — trước đây navigation "mềm" (client-side route change) không sinh metric, giờ đo được performance từng route.
- **Element-scoped View Transitions** (Chrome 147): chạy view transition trong phạm vi 1 element, animate trạng thái trung gian mà không block tương tác toàn trang.
- **HTML-in-Canvas API** (origin trial): nhúng DOM element thật vào canvas WebGL/WebGPU, vẫn searchable/accessible/translatable.

**Vì sao đáng đọc:** Soft Navigations API trực tiếp ảnh hưởng cách đo performance app React SPA — nếu admin app Joy Loyalty là SPA, đây là cách cuối cùng có số CWV thật cho client-side route, thay vì chỉ đo lần load đầu.

## [How we made JSON.stringify more than twice as fast](https://v8.dev/blog/json-stringify) — (v8.dev)
**Đây là gì:** Bài kỹ thuật của V8 (04/08/2025) mổ xẻ các kỹ thuật tăng tốc `JSON.stringify` >2x (đo trên JetStream2 `json-stringify-inspector`), ship từ V8 13.8+ (Chrome 138). Quan trọng vì stringify chạy ở mọi tầng Node/server.

**Chi tiết:**
- **Side-effect-free fast path**: phát hiện khi serialize không gây side effect (không có getter/`toJSON` lạ) → đi đường tắt, bỏ qua check phòng thủ. Đường này lặp (iterative) thay vì đệ quy → nest sâu hơn không tràn stack.
- **Templatized string handling**: compile 2 phiên bản serializer riêng cho chuỗi one-byte và two-byte, bỏ check kiểu lặp đi lặp lại.
- **SIMD + SWAR**: escape ký tự đặc biệt bằng SIMD (chuỗi dài) / SWAR — "SIMD Within A Register" (chuỗi ngắn), xử lý hàng loạt thay vì từng ký tự.
- **Fast-JSON-iterable flag**: object được đánh dấu trên hidden class sau lần stringify đầu (nếu không có Symbol key, mọi prop enumerable, không ký tự cần escape) → lần sau skip validate.
- **Segmented buffer**: dùng nhiều segment nhỏ thay vì realloc + copy một buffer phình to → bớt re-allocation với object lớn.

**Vì sao đáng đọc:** Joy Loyalty chạy Node trên Cloud Run, mọi response API/log/Firestore payload đều đi qua `JSON.stringify`. Update Node lên bản V8 mới là "free win" cho throughput — đáng để biết cơ chế khi profile hot path serialization.

## [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) — (react.dev)
**Đây là gì:** Bản stable đầu tiên của React Compiler (07/10/2025) — công cụ build-time tự động memo hóa component & hook, bỏ phần lớn `useMemo`/`useCallback`/`React.memo` thủ công. Hiểu data-flow + mutability qua CFG-based HIR (intermediate representation).

**Chi tiết:**
- **Memo có điều kiện**: compiler memo được sau early return — thứ `useMemo` thủ công không làm được (hook không được gọi sau return).
- **Production**: Meta Quest Store cho thấy initial load + điều hướng nhanh hơn tới 12%, một số tương tác nhanh 2.5x, memory trung tính.
- **Bật bằng Babel**:
  ```bash
  npm install --save-dev --save-exact babel-plugin-react-compiler@latest
  ```
- **Lint đi kèm** (eslint flat config, JS thuần):
  ```js
  import reactHooks from 'eslint-plugin-react-hooks';
  import { defineConfig } from 'eslint/config';

  export default defineConfig([
    reactHooks.configs.flat.recommended,
  ]);
  ```
- **Tích hợp framework**: Expo SDK 54+ bật mặc định; Vite & Next.js có template sẵn; tương thích ngược React 17+ (cần thêm `react-compiler-runtime` cho React 17/18).

**Vì sao đáng đọc:** App embed/admin Polaris của Joy Loyalty là React — bật compiler có thể bỏ bớt memo thủ công, giảm re-render mà không refactor lớn. Lint preset mới cũng catch sai dependency sớm trong CI.

## [JavaScript's New Superpower: Explicit Resource Management](https://v8.dev/features/explicit-resource-management) — (v8.dev)
**Đây là gì:** Giải thích `using` và `await using` — cú pháp quản lý vòng đời tài nguyên (file handle, connection, stream) một cách deterministic, tự gọi cleanup khi ra khỏi scope. Ship từ Chromium 134 / V8 13.8.

**Chi tiết:**
- `using` (đồng bộ): tự gọi `[Symbol.dispose]()` khi thoát scope. `await using` (bất đồng bộ): gọi và `await` `[Symbol.asyncDispose]()`.
  ```js
  function readConfig(path) {
    using file = openSync(path); // file.[Symbol.dispose]() tự chạy cuối block
    return parse(file.read());
  }                              // không cần try/finally để đóng file
  ```
- Thêm 2 global: `DisposableStack` / `AsyncDisposableStack` để gom nhiều resource disposable lại dispose chung.
- Thêm error type `SuppressedError` cho trường hợp lỗi xảy ra trong lúc cleanup che lỗi gốc.

**Vì sao đáng đọc:** Trong Node trên Cloud Run, leak connection/stream là nguồn bug âm thầm. `using` thay thế pattern `try/finally` lặp lại cho mọi resource cần đóng — code sạch hơn và khó quên cleanup hơn, đặc biệt với DB/file/stream trong worker.
