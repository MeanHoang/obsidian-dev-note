# ⚡ Kỹ thuật load cho app block / theme app extension Shopify — điều tra performance

> Câu hỏi gốc: app Shopify (kiểu Joy Loyalty) nhúng widget vào storefront thì load thế nào để performance tốt nhất?
> Nguồn: shopify.dev docs, Shopify Engineering, Performance @ Shopify, Shopify Developer Community forum, DebugBear, help center của Judge.me.

---

## 0. Ví dụ đời sống trước khi vào kỹ thuật

Hình dung storefront là **một chuyến bay**, còn mỗi app là **một hành khách mang hành lý**.

- Theme là máy bay, có tải trọng cố định.
- Mỗi app cài thêm = một vali ném vào khoang.
- **Script chặn render (parser-blocking)** = hành khách đứng chắn ngay cửa máy bay, không ai lên được cho tới khi họ xếp xong đồ.
- **Script `defer`** = hành khách lên sau cùng, ngồi xuống rồi mới mở vali.
- **Lazy load theo viewport** = vali để dưới khoang hàng, chỉ lấy lên khi thật sự cần dùng.

Shopify cân vali của bạn theo nghĩa đen: họ đo Lighthouse **trước và sau khi cài app**. Vali quá nặng → app không được lên máy bay (mất Built for Shopify).

---

## 1. Luật chơi: Shopify đo app của bạn thế nào

Theo [Storefront performance — shopify.dev](https://shopify.dev/docs/apps/build/performance/storefront):

- Shopify so sánh **Lighthouse score trước vs sau khi cài + cấu hình app**, trên 3 loại trang, với **trọng số**:

| Trang | Trọng số |
|---|---|
| Home | **17%** |
| Product details | **40%** |
| Collection | **43%** |

> 👉 Product + Collection chiếm **83%** điểm số. Widget nào nặng trên 2 trang đó là chết. Home gần như không quan trọng — ngược hẳn với trực giác thông thường.

- Ngưỡng: app **không được làm giảm Lighthouse performance quá 10 điểm** → điều kiện của [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements).
- Yêu cầu dài hạn: *"Your app should consistently demonstrate low or no negative impact on the performance of real merchant stores over time."*

**Cách tự test đúng như Shopify làm** (quy trình docs mô tả):
1. Theme sạch (vd Horizon), **không cài app nào**.
2. Lấy preview URL của home / product / collection.
3. Đo baseline trên **PageSpeed Insights — tab Mobile**.
4. Tính weighted average theo trọng số 17/40/43.
5. Cài app, **cấu hình như merchant thật sẽ dùng**, đo lại.
6. So sánh. Docs cảnh báo *"Lighthouse scores can vary between runs"* → phải chạy nhiều lần.

### Góc nhìn từ forum: chuyện này gây tranh cãi thật

Thread [How does Shopify test storefront performance?](https://community.shopify.dev/t/how-does-shopify-test-storefront-performance/1216) (Shopify Developer Community, mở 28/10/2024) — một dev bị **trượt BFS review** và không tái hiện được mức giảm 10 điểm khi tự test:

- Shopify (qua nhân viên Benji_Yang) xác nhận cách đo là so *"Lighthouse scores of a product page/collection page with the app feature enabled vs. scores… without the app feature enabled"*, và **thừa nhận documentation đã lỗi thời**.
- Về khiếu nại "app tôi tạo hẳn một page type mới (bundle builder) thì so sánh sao cho công bằng", Shopify trả lời cứng: *"all apps that impact the storefront need to meet performance targets, and there are no exceptions."*
- Các phàn nàn lặp lại của dev: kết quả tự test lệch với kết quả review, thiếu minh bạch về điều kiện test, không rõ app proxy page có bị soi hay không (**câu hỏi này tới cuối thread vẫn chưa có câu trả lời**).

> Bài học: đừng tin con số tự đo của mình là đủ. Đo nhiều lần, trên theme sạch, tab Mobile, và bám đúng trọng số 17/40/43.

---

## 2. Ngân sách cứng — con số phải nhớ

Từ [General best practices for app performance — shopify.dev](https://shopify.dev/apps/best-practices/performance/general):

| Hạng mục | Ngưỡng |
|---|---|
| **JS ở entry point trên một page** | **< 10 KB** |
| **CSS trên một page** | **< 50 KB** |
| **Minified bundle** | **16 KB hoặc ít hơn** |
| Cách entry point hoạt động | *"load itself on interaction"* |

Và các quy tắc kèm theo, trích nguyên văn:

- **Framework là kẻ thù:** *"Frameworks such as React, Angular, and Vue, and large utility libraries such as jQuery have significant performance costs."* → ưu tiên native browser features.
- **Không polyfill cho browser cổ:** chỉ target browser có thị phần **> 1%**.
- **Script:** `defer` khi cần thứ tự thực thi, `async` cho script độc lập. Tránh parser-blocking script vì nó *"block the construction and rendering of the DOM until the script is loaded, parsed, and executed"*.
- **Lazy load tận cùng:** *"Defer loading your JavaScript bundle entirely until a user interacts with the parts of your app."*
- **CSS làm được thì đừng dùng JS.**
- **Dùng function scope (IIFE)** để tránh đụng namespace global.
- **Inline `<script>` đặt TRƯỚC remote stylesheet** — nếu không, stylesheet sẽ chặn script chạy.
- **Viewport meta** để tránh double rendering trong mobile WebView:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ```

> Có **theme-check linter** `AssetSizeJavascript` bật mặc định khi chạy `shopify app build` trên app có theme app extension — bắt bundle quá khổ, parser-blocking script, remote asset **trước khi deploy**.

---

## 3. Quyết định kiến trúc đầu tiên: App block hay App embed?

Đây là lựa chọn ảnh hưởng performance lớn nhất, trước cả mọi thủ thuật code.

| | **App block** | **App embed block** |
|---|---|---|
| Merchant đặt ở đâu | Kéo thả vào section cụ thể trong theme editor | Bật/tắt toàn store, inject vào `theme.liquid` |
| Asset load khi nào | **Chỉ trên page có block được đặt** | **Mọi page** (nhưng có thể defer/điều kiện hoá) |
| Hợp với | UI inline: widget điểm thưởng trên product page, review list, tier badge | Thứ không có UI hoặc chỉ là overlay: launcher popup, pixel, analytics |
| Theme hỗ trợ | Chỉ Online Store 2.0 | Cả 1.0 và 2.0 |

- shopify.dev: dùng *"app embed blocks to take advantage of their ability to only load scripts on specific pages. This minimizes your app's performance impact by only loading resources where they're needed."*
- Theo [Gadget.dev — Embedding your frontend](https://gadget.dev/blog/how-to-work-with-shopify-themes-as-an-app-developer-part-2-embedding-your-frontend) (Mircea Piturca, 03/03/2023, cập nhật 14/05/2024): app embed chỉ phù hợp khi *"the app's functionality has no user interface"* hoặc *"the user interface is limited to being presented as an overlay"*. Review hiển thị inline **không dùng được** app embed. Khuyến nghị: app embed cho tính năng không-UI / popup; app block cho UI phong phú trên theme 2.0, kèm code injection fallback cho theme 1.0.
- Hai loại block này **không render được trên checkout page** (Contact information, Shipping, Payment, Order status).

> **Với Joy Loyalty:** launcher widget (nút tròn góc màn hình) về bản chất là overlay → app embed hợp lý. Nhưng points-on-product-page, tier progress bar, redeem panel → phải là app block, để merchant nào không đặt thì không phải tải gì cả.

---

## 4. Bộ kỹ thuật load — xếp theo mức tác động

### 🔴 Mức cao

**4.1 — Không bao giờ để script chặn parser**
`defer` cho script cần thứ tự, `async` cho script độc lập. Theme docs xếp *"Remove render-blocking apps"* là impact **High** với LCP.

**4.2 — Load bundle theo tương tác, bằng `import()` động**
Theme performance docs: *"Use dynamic `import()` inside event listeners to load JavaScript modules only when a user actually interacts with a component."* (impact **High** với INP)

```js
// entry nhỏ xíu, chỉ gắn listener — không kéo theo logic widget
document.querySelector('[data-joy-launcher]')?.addEventListener('click', async () => {
  const { openLoyaltyPanel } = await import('./loyalty-panel.js');
  openLoyaltyPanel();
}, { once: true });
```

**4.3 — Lazy load theo viewport bằng IntersectionObserver**
Với block nằm dưới fold (review list, lịch sử điểm, tier ladder), chỉ fetch + render khi user cuộn tới gần.

```js
const target = document.querySelector('[data-joy-points-block]');
const io = new IntersectionObserver(async (entries, obs) => {
  if (!entries[0].isIntersecting) return;
  obs.disconnect();
  const { renderPoints } = await import('./points-block.js');
  renderPoints(target);
}, { rootMargin: '200px' }); // load sớm 200px trước khi lọt viewport
io.observe(target);
```

**4.4 — Render nội dung thiết yếu bằng Liquid, không bằng JS**
Theme docs: *"Moving product info, hero content, or nav into client-side JavaScript delays LCP and harms SEO. Liquid renders server-side before the browser does anything."*

Đây chính là mẹo hay nhất mà Judge.me dùng — xem mục 5.

**4.5 — Bỏ framework**
Case study có số thật: xem mục 5.3.

### 🟡 Mức trung bình

**4.6 — Asset đặt trong `assets/` của extension**
Được tự động serve qua **Shopify CDN**, không tốn thêm DNS/TLS handshake tới domain lạ. File tĩnh khác thì host qua GraphQL `file` resource *"to avoid unnecessary HTTP connections"*.

**4.7 — Chừa sẵn chỗ, chống CLS**
Theme docs liệt kê *"Reserve space for app-injected content"* là practice **CLS / Medium**. Widget xuất hiện muộn mà đẩy nội dung xuống = ăn phạt CLS. Đặt `min-height` cho container trước khi JS chạy.

**4.8 — Vị trí trong layout quyết định chiến lược load**
[Performance @ Shopify — How layout position impacts three big web performance levers](https://performance.shopify.com/blogs/blog/how-layout-position-impacts-three-big-web-performance-levers) (Sia Karamalegos, 15/08/2023, cập nhật 18/09/2023):
- **82% site Shopify lazy-load chính ảnh LCP của mình** — trong khi các platform khác chỉ 15–25%.
- Bỏ lazy load khỏi một ảnh header → LCP **cải thiện 0,5 giây**.
- Phân phối median LCP của nhóm lazy-load **chậm hơn 1,0 giây** so với nhóm eager-load.
- Liquid có `section.index`, `section.index0`, `section.location` để biết block đang ở trên hay dưới fold → chọn chiến lược load theo vị trí.

> Nghĩa là: nếu app block của bạn có ảnh và merchant đặt nó **trên fold**, lazy load chính là thứ giết LCP của họ — và Shopify sẽ tính vào điểm app của bạn.

**4.9 — Nếu widget có ảnh**
- `fetchpriority="high"` cho ảnh LCP; chỉ `loading="lazy"` cho ảnh ngoài viewport.
- Luôn có `width`/`height` (chống CLS).
- Dùng `<img>`, không dùng CSS `background-image` — *"the browser's preload scanner can discover them early"*.
- Bỏ animation fade-in trên ảnh LCP: *"Fade-in and reveal animations delay the LCP event even after the image finishes downloading."*

**4.10 — `preconnect` tới origin bên thứ ba, nhưng `preload` thì dè dặt**
Docs: dùng `<link rel="preload">` cho **chỉ 1–2 resource** mà browser phát hiện muộn — *"Overuse competes with browser prioritization."*

---

## 5. Các app top đầu thực sự làm gì — bằng chứng đo được

### 5.1 — Judge.me: kiến trúc "gần như không cần JS để hiện sao"

Từ chính help center của họ: [Understanding Judge.me loading speed and performance](https://judge.me/help/en/articles/8415544-explaining-judge-me-fast-loading-speed). Sáu kỹ thuật:

1. **Code splitting** — chia nhỏ theo page type. Page **không có** widget Judge.me chỉ nhận *"only a lightweight entry script"*.
2. **Async toàn bộ** — *"All scripts load asynchronously, meaning they don't block your page from rendering."*
3. **⭐ Lưu dữ liệu trong Shopify metafields** — *"Review ratings, counts, and badges are stored directly in Shopify metafields."* → Star Rating Badge **render server-side**, không cần request nào, không cần chờ JS.
4. **Shopify CDN** — *"benefiting from the same fast delivery network your theme uses."*
5. **Progressive loading** — trang review chuyên dụng tải review dần, không tải hết một lúc.
6. **Ảnh review** dùng native `loading="lazy"`.

> **Đây là insight đắt nhất của cả bài.** Thay vì "load JS → gọi API → render sao", họ đẩy dữ liệu tổng hợp (rating, count) vào **metafield** để Liquid render sẵn trong HTML. Phần JS chỉ lo tương tác.
>
> **Áp cho Joy Loyalty:** điểm hiện có của customer, tier hiện tại, ngưỡng tier tiếp theo — hoàn toàn có thể đẩy vào **customer metafield / shop metafield**, để app block render bằng Liquid ngay ở HTML đầu tiên. JS chỉ cần thiết khi user bấm "redeem". Đây là cách duy nhất để widget có **0 KB JS trên đường critical path**.

**Số đo bên ngoài, và một mâu thuẫn đáng lưu ý:** [ThunderPageSpeed — Judge.me Speed Impact (cập nhật 29/03/2026)](https://www.thunderpagespeed.com/apps/judge-me-speed-impact/) đo *"2 scripts totaling 85KB"*, thêm *"100-200ms"*, xếp loại "Low Impact". Nhưng trang này lại nói script *"often load synchronously and on every page"* — **mâu thuẫn trực tiếp** với tuyên bố async + code splitting của Judge.me. Mình chưa verify được bên nào đúng; ghi lại để tự đo nếu cần.

### 5.2 — Chi phí thật của app viết ẩu (đo bằng DebugBear)

[Shopify Speed Optimization: Fixing The Real Bottlenecks](https://www.debugbear.com/blog/shopify-speed-optimization) — Saurabh Shukla, DebugBear, 20/04/2026:

- **Cart drawer app: script 540 KB.** Cart viết tay native làm việc tương đương chỉ tốn **~6 KB**. → gấp **90 lần**.
- Một app third-party kéo theo **cả jQuery** dù site không dùng jQuery.
- Thư viện carousel (Swiper.js, Splide.js) **~30–40 KB** gây delay render ảnh hero.
- JS render phía client ngốn **hơn 700 ms CPU** trong lần load đầu.
- Video hero không có poster: **hơn 9 giây** để hiện khung hình đầu; thêm poster → LCP còn **2,7 giây**.

### 5.3 — Shopify tự chứng minh: bỏ React, bundle giảm tới 84%

[Upgrading Checkout Blocks app to Polaris web components](https://shopify.engineering/upgrading-checkout-blocks-app-to-polaris-web-components) — Shopify Engineering. Họ chuyển app nội bộ từ **React + Remote UI bridge** sang **Preact + Polaris web components (remote-dom)**:

| Extension | Bundle giảm |
|---|---|
| payment-icons | **−84,4%** |
| static-content | **−54,1%** |
| dynamic-content | **−45,2%** |
| custom-field | **−44,6%** |
| line-item-actions | **−40,5%** |

- Thời gian load extension: **−8% (P50)**, **−7% (P90)**.
- Lý do cốt lõi: web components là *"just framework-agnostic custom elements; no bespoke reconciler needed"* → **xoá sạch dependency `react-reconciler` ~89 KB**.
- Bài học họ tự rút: **hard bundle limit ép ra quyết định dependency tốt** ("hard bundle limits drive beneficial dependency decisions").

> Đây là case study mạnh nhất cho luận điểm "đừng bê React vào storefront widget". Chính Shopify bỏ React và bundle giảm gần một nửa tới hơn 4/5.

### 5.4 — Thống kê nền

App scripts bị quy là nguồn gốc của **60–80% các vụ chậm store Shopify**, là nguồn blocking time và layout shift lớn nhất, độc lập với theme. Một ví dụ được dẫn: Total Blocking Time từ **973 ms → 44 ms** chỉ nhờ defer script.
*(Số này lấy từ các bài tổng hợp của agency tối ưu tốc độ, không phải nguồn chính thức Shopify — coi là chỉ dấu về độ lớn vấn đề, không phải con số chuẩn.)*

---

## 6. Checklist áp dụng cho Joy Loyalty

**Kiến trúc**
- [ ] Tách rõ: launcher/popup → **app embed**; points UI inline trên product/cart → **app block** (để store không dùng thì không tải gì).
- [ ] Ưu tiên tối đa **product page + collection page** — chiếm 83% điểm số Shopify chấm.
- [ ] Đẩy dữ liệu tĩnh-theo-customer (điểm hiện có, tier, ngưỡng kế tiếp) vào **metafield** → render bằng Liquid server-side, học Judge.me.

**Bundle**
- [ ] Entry point **< 10 KB JS**, CSS **< 50 KB**, bundle minified **≤ 16 KB**.
- [ ] Kiểm tra widget storefront có đang kéo React/jQuery/date lib nào không — nếu có, cân nhắc **Web Components + vanilla JS** (số liệu mục 5.3).
- [ ] Bật và đọc output của theme-check `AssetSizeJavascript` trong `shopify app build`.

**Loading**
- [ ] Mọi script `defer`; `async` chỉ khi thứ tự không quan trọng.
- [ ] Entry chỉ gắn event listener, logic thật nạp bằng **dynamic `import()` on interaction**.
- [ ] Block dưới fold → **IntersectionObserver** với `rootMargin` ~200px.
- [ ] Asset nằm trong `assets/` của extension (Shopify CDN), không host domain riêng.

**Layout / CLS**
- [ ] `min-height` chừa sẵn chỗ cho mọi container widget.
- [ ] Ảnh trong widget: `width`/`height` bắt buộc; `loading="lazy"` **chỉ** khi chắc chắn dưới fold; cân nhắc `section.index` để biết vị trí.
- [ ] Bỏ animation fade-in nếu widget có thể nằm trên fold.

**Đo đạc**
- [ ] Dựng quy trình test đúng chuẩn Shopify: theme Horizon sạch → PSI tab Mobile → weighted 17/40/43 → cài app → đo lại, chạy nhiều lần.
- [ ] Đặt ngưỡng nội bộ chặt hơn Shopify (vd không quá **5 điểm**) để có biên an toàn khi review.

---

## 7. Khoảng trống chưa trả lời được

Ghi lại để không tự bịa:

1. **App proxy page có bị tính vào performance review không?** — câu hỏi này trên forum Shopify Developer Community tới cuối thread vẫn chưa được trả lời.
2. **Judge.me thật sự load sync hay async?** — help center của họ và bài đo của ThunderPageSpeed nói ngược nhau; cần tự mở DevTools trên một store thật để kết luận.
3. **Số liệu so sánh KB/LCP giữa Judge.me – Loox – Yotpo** xuất hiện nhiều trên các trang so sánh SEO nhưng mình không verify được nguồn đo → **cố tình không đưa vào note này**.

---

## 🔗 Nguồn

**Chính thức Shopify**
- [Storefront performance](https://shopify.dev/docs/apps/build/performance/storefront) — trọng số 17/40/43, quy trình test
- [General best practices for app performance](https://shopify.dev/apps/best-practices/performance/general) — ngưỡng 10KB/50KB/16KB
- [Performance best practices for Shopify themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance) — bảng impact theo từng metric
- [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) — ngưỡng 10 điểm Lighthouse
- [Upgrading Checkout Blocks app to Polaris web components](https://shopify.engineering/upgrading-checkout-blocks-app-to-polaris-web-components) — Shopify Engineering, số bundle giảm 40–84%
- [How layout position impacts three big web performance levers](https://performance.shopify.com/blogs/blog/how-layout-position-impacts-three-big-web-performance-levers) — Sia Karamalegos, 15/08/2023

**Forum / community**
- [How does Shopify test storefront performance?](https://community.shopify.dev/t/how-does-shopify-test-storefront-performance/1216) — Shopify Developer Community, 28/10/2024
- [How to work with Shopify Themes as an App Developer (Part 2)](https://gadget.dev/blog/how-to-work-with-shopify-themes-as-an-app-developer-part-2-embedding-your-frontend) — Gadget.dev, Mircea Piturca

**Đo đạc bên thứ ba**
- [Shopify Speed Optimization: Fixing The Real Bottlenecks](https://www.debugbear.com/blog/shopify-speed-optimization) — DebugBear, Saurabh Shukla, 20/04/2026
- [Understanding Judge.me loading speed and performance](https://judge.me/help/en/articles/8415544-explaining-judge-me-fast-loading-speed) — Judge.me Help Center
- [Judge.me Speed Impact on Shopify](https://www.thunderpagespeed.com/apps/judge-me-speed-impact/) — ThunderPageSpeed, cập nhật 29/03/2026
