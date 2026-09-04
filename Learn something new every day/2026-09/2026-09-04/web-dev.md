# 🌐 Web Dev & Craft — 2026-09-04

> Chủ đề chính hôm nay: đo Core Web Vitals cho SPA đã có API thật (soft navigations), cộng thêm bức tranh Baseline 2026 và vài thứ đáng ngó về ES2026 + DX.

## ⭐ [How SPA architectures affect Core Web Vitals](https://web.dev/articles/vitals-spa-faq) — (web.dev, cập nhật 11/08/2026)

**Đây là gì:** Bài FAQ chính chủ Google giải thích vì sao SPA lâu nay "mất điểm oan" trong Core Web Vitals, và giới thiệu 2 API mới từ Chrome 151 cho phép đo LCP/CLS/INP **theo từng route transition** của SPA thay vì chỉ đo lần load đầu tiên.

**Chi tiết:**
- Hai API mới: `PerformanceSoftNavigation` — nhận diện một interaction vừa tạo paint vừa đổi URL (định nghĩa chuẩn hoá "soft navigation" xuyên framework); và `InteractionContentfulPaint` — đo contentful paint sau interaction, nhờ đó tính được FCP/LCP cho soft navigation.
- **LCP/FCP sau soft navigation chỉ tính content được vẽ mới.** Phần UI giữ nguyên giữa 2 route (header, sidebar, layout) không repaint thì không được coi là LCP candidate — kể cả khi nó từng là LCP lúc load đầu.
- **CLS thường khác** so với full page load vì lượng nội dung phải re-render ít hơn; **INP thường thấp hơn** vì JS đã nạp sẵn từ lần load đầu. Nghĩa là số liệu soft-nav không so trực tiếp được với số liệu full load.
- Cách tính mốc thời gian cũng khác: soft navigation đo từ *interaction start time*, còn full load đo từ *sau khi interaction điều hướng được xử lý xong*.
- Caveat lớn: API mới "vừa mới bắt đầu" được các thư viện đo lường và RUM tích hợp; CrUX chưa công bố mốc thời gian tổng hợp dữ liệu theo route SPA; và các engine không phải Chrome vẫn chưa có API này.
- Google khẳng định lại: **không có gì trong bản chất SPA khiến nó chậm hơn MPA.** Lợi thế historic của MPA phần lớn đến từ cache resource qua nhiều lượt truy cập, đẩy percentile 75 lên.

**Vì sao đáng đọc:** Bài này bác bỏ luôn cái cớ "app tôi là SPA nên CWV xấu là chuyện thường" — giờ đã có công cụ đo thật, và khuyến nghị là tự đo trước khi tooling chính thức đuổi kịp.

**Impact với Joy Loyalty:** Widget loyalty và Polaris admin app đều là SPA — từ giờ có thể đo riêng "mở modal Rewards" hay "chuyển tab Tiers" chậm bao nhiêu, thay vì chỉ nhìn con số load đầu trang rồi đoán mò.

## [Baseline 2026](https://web.dev/baseline/2026) — (web.dev, 2026)

**Đây là gì:** Trang tổng hợp toàn bộ feature web platform đã đạt trạng thái Baseline trong năm 2026 — tức là đã an toàn để dùng trên cả 4 engine chính mà không cần polyfill hay feature detection cầu kỳ.

Phía CSS/HTML nổi bật có: **container style queries**, selector `:open`, property `field-sizing`, hàm `contrast-color()`, rule `@scope`, Custom Highlights API, và bộ unit mới `rcap` / `rch` / `rex` / `ric`. Phía JS/Web API có: **Navigation API**, WebTransport, shared worker + service worker hỗ trợ ES module, Trusted Types, Reporting API cho CSP violation, `Math.sumPrecise()`, nén Zstandard, và `Map.prototype.getOrInsert()`.

```js
// getOrInsert: bớt hẳn pattern "check rồi set" khi cache theo customer
const pointsCache = new Map();

// Cũ
let entry = pointsCache.get(customerId);
if (!entry) {
  entry = { points: 0, tier: 'bronze' };
  pointsCache.set(customerId, entry);
}

// Baseline 2026
const entry2 = pointsCache.getOrInsert(customerId, { points: 0, tier: 'bronze' });
```

**Vì sao đáng đọc:** Đây là danh sách "được phép xoá polyfill / xoá helper tự viết" của năm — đọc một lượt rồi grep codebase là ra ngay chỗ giảm được bundle.

**Impact với Joy Loyalty:** `@scope` và container style queries giúp CSS của widget nhúng vào storefront khách hàng bớt rò rỉ và bớt phụ thuộc `!important`; `contrast-color()` xử lý gọn bài toán chữ trên nền màu brand do merchant tự chọn.

## [TC39 Advances Temporal to Stage 4 Alongside Several ECMAScript Proposals](https://socket.dev/blog/tc39-advances-temporal-to-stage-4) — (Socket, 16/03/2026)

**Đây là gì:** Tổng kết cuộc họp TC39 chốt danh sách vào ECMAScript 2026. **Temporal** — API date/time thay thế `Date` — đạt Stage 4, được tác giả bài gọi là "bổ sung lớn nhất vào ECMAScript kể từ ES2015" sau gần một thập kỷ phát triển. Cùng lên Stage 4 có **Intl era and monthCode**. Ngoài ra: *import text* lên Stage 3; *error stack accessor* và *iterator includes* lên Stage 2.7.

Temporal mang lại kiểu dữ liệu immutable, hỗ trợ timezone và calendar sẵn trong ngôn ngữ, và mục tiêu rõ ràng là gỡ bỏ sự phụ thuộc vào thư viện date bên thứ ba. Bài ghi nhận Temporal đã có mặt trong Firefox, Chrome, Edge và Safari Technology Preview.

**Vì sao đáng đọc:** Date/time là nguồn bug âm ỉ kinh điển, và đây là lần đầu JS có primitive đủ tốt để bỏ hẳn thư viện ngoài.

**Impact với Joy Loyalty:** Points expiry, tier anniversary, campaign start/end — toàn bài toán timezone của merchant khác múi giờ với server; Temporal xoá được cả lớp bug "lệch một ngày" và cho phép cân nhắc bỏ dayjs/moment khỏi bundle widget.

## [Next.js 16.3: AI Improvements](https://nextjs.org/blog/next-16-3-ai-improvements) — (Next.js Blog, 26/06/2026)

**Đây là gì:** Bài mô tả hướng đi "framework thiết kế cho agent-driven development" của Next.js 16.3. Ba thứ đáng chú ý: (1) `next dev` tự ghi và cập nhật một block quản lý vào `AGENTS.md` trỏ agent đọc docs bundled trong `node_modules/next/dist/docs/` thay vì dựa vào training data cũ; (2) **actionable errors** — mỗi lỗi Cache Components hiện menu fix có nhãn (`stream` / `cache` / `block`) kèm nút **Copy prompt** sinh sẵn prompt paste vào agent, và cùng format đó cũng in ra terminal khi `next build` fail; (3) mỗi rule có trang docs riêng ở `/docs/messages` viết theo cấu trúc **Patterns → Trade-offs → Gotchas**.

Ngoài ra `next-browser` đã merge vào CLI dùng chung `agent-browser` (v0.27 thêm React DevTools introspection: `react tree`, `react inspect`, `react renders start/stop`), và mọi trang docs giờ append `.md` vào URL là ra bản markdown thuần.

**Vì sao đáng đọc:** Đây là một pattern DX đáng sao chép hơn là một feature Next.js: **error message không chỉ nói sai ở đâu mà liệt kê các lựa chọn fix kèm trade-off** — áp dụng được cho bất kỳ tooling nội bộ nào.

**Impact với Joy Loyalty:** Kể cả không dùng Next.js, ý tưởng "docs viết cho agent đọc" và convention `AGENTS.md` trỏ về docs version-matched rất đáng bê vào repo app — tránh việc agent viết code theo API Polaris/Shopify đời cũ trong training data.

## [Timing Charts: A Blueprint For SMIL Animations](https://www.smashingmagazine.com/2026/08/timing-charts-blueprint-smil-animations/) — (Smashing Magazine, 20/08/2026)

**Đây là gì:** Johan Grobler hướng dẫn dùng **timing chart** — bản vẽ trục thời gian thể hiện mỗi thành phần animation bắt đầu và kết thúc lúc nào — làm bước thiết kế trước khi viết SMIL animation cho SVG. Lý do cần: mỗi tag SMIL chỉ target được **một element và một property tại một thời điểm**, nên animation nhiều bước phình độ phức tạp rất nhanh. Bài đi qua ví dụ thực tế dựng spinner ba chấm bằng opacity + clipping path, dùng syncbase (tham chiếu `.begin` / `.end` của animation khác) để đồng bộ, và có nhắc tôn trọng `prefers-reduced-motion`.

**Vì sao đáng đọc:** Điểm hay không nằm ở SMIL mà ở kỷ luật: vẽ timeline ra giấy trước rồi mới code — cùng một cách tiếp cận áp thẳng được cho CSS `@keyframes` hay Web Animations API. Bonus kỹ thuật: SMIL chạy được ngay cả khi SVG nhúng trong `<img>`, không cần JavaScript.

**Impact với Joy Loyalty:** Loading spinner và micro-animation trong widget loyalty có thể là SVG tự chạy, zero JS — nhẹ hơn và không tốn main thread, tốt trực tiếp cho INP của storefront khách hàng.
