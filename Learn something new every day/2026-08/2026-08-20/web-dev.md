# 🌐 Web Dev — 2026-08-20

> Hôm nay xoay quanh 2 trục: CSS/web UI đang "nuốt" rất nhiều thứ trước đây phải viết bằng JS, và Temporal API chính thức thành mặc định ở cả browser lẫn Node 26.

## ⭐ [What's new in web UI](https://developer.chrome.com/blog/new-in-web-ui-io26) — (Chrome for Developers, 01/07/2026, Bramus & Una Kravets)

**Đây là gì:** Bài tổng kết session Google I/O 2026, liệt kê 35 capability mới của web UI, nhưng không sắp theo kiểu changelog mà nhóm theo **5 nguyên tắc thiết kế** — mỗi nguyên tắc map sang một nhóm API CSS/HTML mới. Đây là bài "state of the platform" đáng đọc nhất quý này cho ai làm UI.

**Chi tiết:**
- **Respect user preferences** — `contrast-color()` và `light-dark()` để xử lý theme sáng/tối, **CSS custom functions (`@function`)** cho phép định nghĩa hàm CSS tái sử dụng, **container style queries**, hàm **CSS `if()`**, `@supports at-rule()` để feature-detect at-rule, và thẻ `<meta name="text-scale">`.
- **Natural interactions** — hàm easing `linear()` cho animation phức tạp, `@starting-style` cho entry transition, `transition-behavior: allow-discrete`, `sibling-index()`/`sibling-count()` để làm staggered animation không cần JS đếm index, dialog light-dismiss qua attribute `closedby`, và `corner-shape` (experimental).
- **Guided navigation** — view transitions cùng-document và cross-document, **element-scoped view transitions (Chrome 147)**, two-phase view transitions (experimental), scroll-driven + **scroll-triggered animations (Chrome 146+)**, `scroll-target-group: auto` cho scroll-spy native, option `container` cho `scrollIntoView()`, và programmatic scrolling có thể `await`.
- **Maximize content, reduce noise** — **scroll-state queries** (`scrolled`) để style theo trạng thái cuộn của container, **anchored container queries**, `border-shape` + hàm `shape()`, và sticky positioning theo từng trục riêng (Chrome 148).
- **Adapt to form factor** — overscroll gestures (proposed), HTML-in-Canvas API, `moveBefore()` (di chuyển DOM node mà **giữ nguyên state**, không teardown), `text-fit` (experimental), `text-box-trim`/`text-box-edge`, **CSS gap decorations (Chrome 149+)**, scrollbar-aware viewport units, và JS truy cập được pseudo-element (Chrome 149+).

**Vì sao đáng đọc:** Rất nhiều thứ trong list này là code JS mà app Shopify đang phải tự viết — sticky header ẩn/hiện khi scroll, scroll-spy trong settings page, animation stagger cho danh sách reward tier, dialog dismiss. `scroll-state()` + `sibling-index()` + `closedby` xoá được cả trăm dòng JS. Đặc biệt `moveBefore()` đáng chú ý với Joy Loyalty: khi reorder list widget/tier, DOM node giữ nguyên state (iframe, video, focus, input value) thay vì bị remount — thứ mà React `key` reorder vẫn không cứu được ở tầng DOM thật. Lưu ý: đây là Chrome-first, cần check baseline trước khi ship vào embed chạy trên storefront khách.

## [Node.js 26.0.0 (Current)](https://nodejs.org/en/blog/release/v26.0.0) — (nodejs.org, 05/05/2026)

**Đây là gì:** Major release của Node, dự kiến vào LTS tháng 10/2026. Ba highlight lớn: **Temporal API bật mặc định**, V8 lên **14.6.202.33**, Undici lên **8.0.2**.

**Chi tiết:**
- V8 14.6 mang theo **`Map.prototype.getOrInsert()` / `getOrInsertComputed()`** (và bản `WeakMap`) — pattern "upsert" mà lâu nay phải viết tay `if (!map.has(k)) map.set(k, ...)`.
- Cũng có **`Iterator.concat()`** để nối nhiều iterator.
- Dọn dẹp khá mạnh: xoá `http.Server.prototype.writeHeader()` (dùng `writeHead()`), xoá loạt legacy stream module `_stream_wrap`/`_stream_readable`/`_stream_writable`/`_stream_duplex`/`_stream_transform`/`_stream_passthrough`, xoá flag `--experimental-transform-types`.
- `module.register()` bị runtime-deprecate. `NODE_MODULE_VERSION` = 147, yêu cầu GCC 13.2+, bỏ hỗ trợ Python 3.9.

**Vì sao đáng đọc:** `NODE_MODULE_VERSION` đổi nghĩa mọi native addon phải rebuild — kiểm tra trước khi bump runtime Cloud Run / Cloud Functions. `getOrInsertComputed()` là món ngon cho code gom nhóm (`Map<shopId, orders[]>`) trong job tính điểm loyalty:

```js
// Thay vì:
if (!byShop.has(shopId)) byShop.set(shopId, []);
byShop.get(shopId).push(order);

// Node 26:
byShop.getOrInsertComputed(shopId, () => []).push(order);
```

## [Temporal API Ships in Chrome 144, Marking a Major Shift for JavaScript Date Handling](https://socket.dev/blog/temporal-api-ships-in-chrome-144-major-shift-for-javascript-date-handling) — (Socket, 16/01/2026)

**Đây là gì:** Bài ghi nhận thời điểm Temporal — bộ API date/time thay thế `Date` — ship stable trong Chrome 144, sau **gần 8 năm** thiết kế. Bài dẫn lời một TC39 delegate gọi đây là "the single biggest change to JS ever" xét theo nhiều thước đo.

**Chi tiết theo bài:** Firefox 139 đã có Temporal từ trước, Chrome 144 là engine lớn thứ hai; Safari mới có phần đầu trong Technical Preview. Chi tiết implement thú vị: **V8 tái sử dụng `temporal_rs`, một thư viện Rust từ engine Boa**, nên Boa, Kiesel và V8 dùng chung một core thay vì mỗi engine tự viết. Tại thời điểm bài viết (01/2026) proposal còn ở Stage 3, dự kiến trình Stage 4 tại plenary tháng 3/2026.

**Vì sao đáng đọc:** Loyalty program sống bằng ngày tháng — điểm hết hạn, tier reset theo chu kỳ, campaign chạy theo timezone của merchant. `Date` là nguồn bug DST kinh điển. Temporal tách rõ `Instant` (lưu UTC), `ZonedDateTime` (logic lịch theo timezone merchant), `PlainDate` (ngày không giờ, đúng cho "điểm hết hạn ngày X") và `Duration`. Với backend đã lên Node 26 thì dùng được ngay; phía embed script chạy trên storefront thì vẫn cần polyfill vì Safari chưa đủ.

## [The Architecture Of Local-First Web Development](https://www.smashingmagazine.com/2026/05/architecture-local-first-web-development/) — (Smashing Magazine, 06/05/2026, Durgesh Pawar)

**Đây là gì:** Bài kiến trúc giải thích local-first không phải là "thêm cache layer", mà là đảo ngược quyền sở hữu dữ liệu: bản chính nằm trên máy user, server chỉ là **sync peer** chứ không phải gatekeeper. Câu chốt của tác giả: "The client is not a thin view requesting permission to show data. The client is a node in a distributed system with its own database."

**Chi tiết theo bài:** Về storage — SQLite qua WebAssembly persist vào Origin Private File System cho SQL đầy đủ; IndexedDB vẫn dùng được nhưng DX tệ; Postgres-in-WASM là hướng đang nổi. Về sync — **CRDT (Yjs, Automerge)** mạnh ở collaborative text editing, còn **database replication (PowerSync, ElectricSQL)** hợp hơn với dữ liệu dạng row; last-write-wins ở cấp field xử lý được phần lớn conflict thực tế. Bài cũng thẳng thắn về chỗ **không** nên dùng: dữ liệu do server sinh (analytics), hệ thống cần strong transactional consistency (banking), và admin panel đơn giản.

**Vì sao đáng đọc:** Phần "khi nào KHÔNG dùng" là phần giá trị nhất và áp thẳng vào Joy Loyalty — điểm thưởng là dữ liệu server-authoritative cần consistency, không phải ứng viên local-first. Nhưng pattern này rất hợp cho phần admin UI nặng cấu hình (kéo thả tier, soạn campaign): edit local instant, sync ngầm, giảm hẳn spinner khi Admin API chậm.

## [Container queries in 2026: Powerful, but not a silver bullet](https://blog.logrocket.com/container-queries-2026/) — (LogRocket, 26/12/2025)

**Đây là gì:** Bài phản biện cân bằng về container queries: sau khi đã support đủ mọi trình duyệt lớn, tác giả lập luận nó là **bổ sung chứ không thay thế** media queries — container queries giỏi ở adaptation cấp component, còn media queries vẫn cần cho macro layout theo viewport và cho user preference (`prefers-reduced-motion`, `prefers-color-scheme`).

**Vì sao đáng đọc:** Đúng bài toán app embed: component loyalty widget của mình bị nhét vào đủ loại slot theme khách, kích thước container mới là biến quyết định chứ không phải viewport. Nhưng bài cảnh báo đừng chuyển hết sang `@container` — đọc phần limitation/gotcha trước khi refactor design system Polaris-adjacent.
