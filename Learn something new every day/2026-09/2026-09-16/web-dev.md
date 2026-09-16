# 🌐 Web Dev & Craft — 2026-09-16

> Chủ đề hôm nay: biến "cảm giác nhanh" thành test tự động được, cắt bớt dependency nhờ Baseline, và mấy nâng cấp tooling (DevTools, Bun).

## ⭐ [Making Navigations Instant in v0](https://nextjs.org/blog/making-v0-navigations-instant) — (nextjs.org, 06/08/2026)
**Đây là gì:** Case study của Vercel về cách họ làm cho navigation trong v0 (app full-stack, dữ liệu cá nhân hoá) trở nên "instant" bằng bộ công cụ mới của Next.js 16.3 — điểm hay nhất là họ biến tiêu chí mơ hồ "app mượt" thành một cái test fail/pass được.

**Chi tiết:**
- Trước đây Next.js chỉ có 2 cách để navigation instant: prerender tĩnh lúc build (không dùng được với app có dữ liệu cá nhân), hoặc prefetch full link (tốn tài nguyên server). App dynamic như v0 nằm ở vùng chết giữa hai lựa chọn.
- Next.js 16.3 cho phép **prerender nội dung dynamic ngay lúc user đang duyệt app**, rồi cache phần UI đó hoàn toàn trong browser. Component render UI cá nhân hoá chỉ cần khai báo loading state bằng Suspense hoặc đánh dấu một phần UI bằng `'use cache'` — Next.js sẽ tách phần UI đó và nạp sẵn vào client trước khi navigate. Bài viết nhấn mạnh "instant != PPR" và dễ đạt hơn PPR tĩnh nhiều.
- Chìa khoá là helper test mới `instant()` cho Playwright (`@next/playwright`): nó tạm dừng navigation rồi assert phần UI nào hiển thị ngay lập tức mà không cần request mạng. Nếu nội dung bị chặn bởi network thì test fail.
- Cách sửa code thực tế phần lớn rất đơn giản — đẩy phần truy cập dữ liệu dynamic xuống dưới một Suspense boundary để phần còn lại của page được đưa vào shell. Ví dụ trong bài: tách `getServerSession()` + `fetchTeam()` ra một component async `WorkspaceContent` bọc trong `<Suspense fallback={<WorkspaceSkeleton />}>`, còn page cha thành component đồng bộ. Ca khó hơn là gỡ dependency blocking khỏi root layout.
- Họ chạy vòng lặp agent: viết test fail → sửa theo pattern trong Skill `next-cache-components-optimizer` → build lại → lặp đến khi pass → commit cả code lẫn test vào CI. Kết quả: 16 test mới, homepage (cả logged-in/logged-out), chat detail và toàn bộ trang settings chuyển từ blocking sang instant. Next.js 16.3 cũng có "Instant Insights" tự chỉ ra route nào chưa instant khi dev.

**Vì sao đáng đọc:** Ý tưởng cốt lõi mang đi được kể cả khi Joy Loyalty không chạy Next.js — Shopify Admin app bằng React + Polaris hoàn toàn có thể áp dụng: xác định vài critical journey (danh sách member, chi tiết member, settings widget), viết Playwright test assert phần khung UI phải hiện ngay không chờ API Firestore/Admin API, rồi refactor để phần dữ liệu chậm nằm sau Suspense/skeleton. Bài học lớn: đưa "cảm giác nhanh" vào CI để không bị regress khi team (hoặc agent) sửa code sau này.

## ⭐ [How Baseline Can Help You Ship Less JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/) — (Smashing Magazine, Jad Joubran, 07/08/2026)
**Đây là gì:** Bài phân tích cách dùng Baseline (thông tin feature nào đã được mọi browser engine hỗ trợ) để audit lại `package.json` và bỏ những dependency mà nền tảng web bây giờ đã làm được natively.

**Chi tiết:**
- Luận điểm: nhiều npm dependency đã lỗi thời vì browser API trưởng thành, nhưng dev hiếm khi audit lại `package.json` — kết quả là bundle còn 60–90 KB gzipped code mà platform tự lo được.
- Tác giả đưa framework 3 câu hỏi trước khi gỡ một thư viện: (1) thay thế native có an toàn với tập user thật của bạn không? (2) chi phí thật của việc swap là bao nhiêu? (3) feature native có phủ hết use case thật không?
- Các cụm thay thế cụ thể theo bài: i18n (~14 KB) — `timeago.js` → `Intl.RelativeTimeFormat`, `numeral` → `Intl.NumberFormat`, `humanize-duration` → `Intl.DurationFormat` (mới available, cần cẩn trọng); HTTP client (~17 KB) — `axios` → `fetch` + `AbortController`, nhưng còn khoảng trống ở interceptor và retry.
- UI primitives (~24 KB) — thư viện modal → element `<dialog>`, thư viện tooltip → Popover API + CSS anchor positioning. Lodash rời (~8 KB) — `lodash.clonedeep` → `structuredClone`, `lodash.groupby` → `Object.groupBy`.
- Ví dụ phản biện: Temporal — polyfill nặng 44 KB, lớn hơn cả thư viện nó thay, nên chưa nên dùng cho tới khi Safari ship native.

**Vì sao đáng đọc:** Đúng gu stack JS thuần của Joy Loyalty: bundle của embedded Shopify app càng nhẹ thì Admin iframe càng vào nhanh, và loyalty widget nhúng vào storefront khách hàng lại càng nhạy cảm với KB. Audit nhanh `axios`, các lodash lẻ và mấy helper format ngày/số là món dễ ăn nhất.

## [What's new in DevTools (Chrome 152)](https://developer.chrome.com/blog/new-in-devtools-152) — (Chrome for Developers, 25/08/2026)
**Đây là gì:** Bản ghi chú tính năng mới của Chrome DevTools phiên bản 152, tập trung vào network debugging và đo Core Web Vitals cho SPA.

**Vì sao đáng đọc:** Hai thứ dùng được ngay: **resend fetch/XHR request** ngay trong Network panel (debug call Shopify Admin API / Cloud Run endpoint mà không phải dựng lại thao tác UI), và **Live Metrics hỗ trợ soft navigation** — cuối cùng cũng đo được Core Web Vitals cho từng "trang" trong SPA React thay vì chỉ lần load đầu. Ngoài ra có export bảng Console ra Markdown/CSV, badge adorner cho custom element, và heap snapshot cho DevTools MCP nếu bạn để agent tự debug.

## [Bun v1.4.2](https://bun.com/blog/bun-v1.4.2) — (bun.com, 05/09/2026)
**Đây là gì:** Bản patch của Bun sau 1.4, chủ yếu vá regression chứ không thêm feature lớn.

**Vì sao đáng đọc:** Nếu có script/tooling nào chạy trên Bun thì nên nhảy thẳng lên 1.4.2: bản này vá regression `bun build` đổi tên biến lồng nhau sai gây syntax error (import Elysia), rò rỉ bộ nhớ `AsyncLocalStorage` khi tạo timer/promise trong `store.exit()`, và lỗi thứ tự event `'online'` của worker thread làm `@discordjs/ws` bị hang. Kèm upgrade JavaScriptCore khoảng 350 commit WebKit (Intl, TypedArray, Proxy, Date) — nhắc lại rằng Bun vẫn là công cụ chạy script/test nhanh, chưa cần là runtime production thay Node.
