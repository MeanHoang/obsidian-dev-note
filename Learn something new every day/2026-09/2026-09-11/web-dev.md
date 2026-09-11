# 🌐 Web Dev & Craft — 2026-09-11

> React 19.3 stable hóa View Transitions + Fragment Refs, Turbopack mổ xẻ thuật toán chunking, và Vercel kể chuyện dùng agent dọn 1.462 GitHub issues.

## ⭐ [React 19.3](https://react.dev/blog/2026/09/09/react-19-3) — (react.dev, 09/09/2026)
**Đây là gì:** Bản minor mới nhất của React (phát hành 09/09/2026), đưa hai API từng nằm experimental rất lâu — `<ViewTransition>` và Fragment Refs — lên stable, kèm một API mới `browser()` để opt-out SSR.

**Chi tiết:**
- **View Transitions stable**: component `<ViewTransition>` bọc UI và tự động chọn kiểu animation **enter / exit / update / share** cho các state update được đánh dấu là Transition. Nó tích hợp với `startTransition()`, `<Suspense>` và `useDeferredValue()`; tùy biến bằng CSS View Transition Classes hoặc Web Animations API.
- **`addTransitionType`**: cho phép cùng một state update nhưng animation khác nhau tùy ngữ cảnh — ví dụ carousel đi tới vs đi lui:
  ```js
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
  ```
- **Fragment Refs stable**: Fragment nay nhận được `ref`, trả về một `FragmentInstance` với `addEventListener` / `removeEventListener` / `dispatchEvent`, `focus()` / `focusLast()` / `blur()`, `observeUsing()` / `unobserveUsing()` (IntersectionObserver, ResizeObserver), `getClientRects()`, `scrollIntoView()`… → gắn behavior vào component con mà **không cần thêm wrapper `<div>`**, không đổi cấu trúc DOM.
- **`browser()` (react-dom)**: `use(browser())` khiến component suspend trên server (render fallback vào HTML) nhưng render bình thường sau hydration — dành cho code phụ thuộc `localStorage`, `window`, timezone:
  ```js
  import { use } from 'react';
  import { browser } from 'react-dom';

  function TimeZone() {
    use(browser());
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    return <p>{timeZone}</p>;
  }
  ```
- **Trusted Types + Context trong Server Components**: React tích hợp Trusted Types API của browser (giá trị đưa vào DOM sink không còn bị ép về string, để browser validate `TrustedHTML`/`TrustedScript`), và Server Component nay render Context từ module `'use client'` trực tiếp, không cần Provider wrapper riêng. Ngoài ra: Transition chậm không còn block Transition khác, thêm `onFullscreenChange`, `fetchPriority` cho module resources, form `onReset` fire sau Server Actions.

**Vì sao đáng đọc:** Fragment Refs là món đáng giá nhất cho app Shopify Polaris — muốn gắn ResizeObserver hay focus management vào một component Polaris mà không được sửa internals của nó, trước đây phải bọc thêm `<div>` và phá layout; giờ thì không.

## ⭐ [How Turbopack chunks your JavaScript](https://nextjs.org/blog/turbopack-chunking) — (nextjs.org, 03/09/2026)
**Đây là gì:** Bài giải thích chi tiết "chunking" là gì — quyết định code nào nằm trong file JS nào — và thuật toán merge chunk của Turbopack, kèm các cờ experimental mới trong Next.js 16.3.

**Chi tiết:**
- Bài đi qua 3 thái cực: **một chunk cho toàn app** (cache tốt, nhưng mọi page tải cả JS của page khác), **một chunk mỗi page** (không over-ship, nhưng `<Footer />` bị tải lại ở từng page), **một chunk mỗi module** (tối ưu code nhưng hàng trăm request; HTTP/2 rẻ hơn nhưng gzip nén tệ với nhiều file nhỏ).
- Giải pháp là khái niệm **chunk group** — tập chunk luôn được load cùng nhau (ví dụ toàn bộ chunk của `/home`). Turbopack chỉ merge trong cùng group, nên merge không bao giờ thêm code mà page vốn không cần.
- Thuật toán cân đo bằng xác suất: với hai chunk `A` (dùng mọi page) và `B` (chỉ home), merge chỉ *lời* khi cả hai page trong session đều cần `A + B` (−1 request); các kịch bản lệch khiến visitor tải lại `A` hoặc `B`. Turbopack mặc định giả định **2/3 session chỉ xem 1 page**, 1/3 xem từ 2 page trở lên.
- Số đo thật trên nextjs.org qua 8 lượt điều hướng: không merge = **561,6 KiB / 96 requests**; mặc định = **554,8 KiB / 38 requests**; merge tối đa mỗi group = **610,0 KiB / 15 requests**. Tức mặc định cắt hơn nửa số request mà vẫn ship ít code hơn; merge tối đa giảm request nữa nhưng ship dư ~10% code.
- Cờ mới trong `next.config.js` dưới `experimental.turbopackChunking`: `generateComponentChunks` (emit cả bản chưa merge, runtime tự chọn cái rẻ hơn dựa trên thứ browser đã có), `firstPageLoadPriority` (mặc định 0.67, bounce rate là giá trị khởi điểm hợp lý), `priorityRoutes`, `clusters` (nhóm route hay đi cùng nhau). Cộng thêm `experimental.turbopackCjsTreeShaking` (tree-shake CJS) và `experimental.turbopackSharedRuntime` (một runtime chunk dùng chung, tiết kiệm 1 blocking request và ~10 KB JS mỗi lần navigate sau lần đầu).

**Vì sao đáng đọc:** Embedded app Shopify sống chết bằng thời gian load trong iframe Admin — `turbopackSharedRuntime` và `priorityRoutes` là hai nút vặn trực tiếp nếu Joy Loyalty chạy Next.js, và quan trọng hơn là bài này cho bạn mental model để đọc network tab thay vì đoán.

## [How we closed 1,500 GitHub issues in one month](https://nextjs.org/blog/how-we-closed-1500-github-issues) — (nextjs.org, 04/09/2026)
**Đây là gì:** Vercel kể cách họ xây một research agent (`closability`) để phân loại backlog issue của Next.js — backlog đỉnh 3.109 issue (01/2025), còn 2.244 vào 10/08/2026, sau ~3 tuần đóng được **1.462 issue** và kéo backlog xuống dưới 1.000 dù có thêm 218 report mới.

**Điểm đáng chú ý:** Agent chạy trong sandbox sạch có repo Next.js + Node.js + Playwright + Chromium, đọc conversation, tìm PR/commit/release liên quan, thử reproduce trên version được báo + stable mới nhất + canary, rồi **cố tìm bằng chứng phản bác kết luận của chính nó**, và trả về JSON có `closeConfidence`, `primaryReason`, `evidence`. Agent bị đặt read-only ngoài sandbox (không comment, không close, không push) và được cấu hình bỏ qua mọi chỉ thị nằm trong nội dung issue để chống prompt injection. Lý do đóng: 37% đã fix, 19% trùng lặp, 16% là expected behavior. Họ thêm GitHub Action cho phép reopen nếu đóng nhầm.

**Vì sao đáng đọc:** Đây là blueprint thực tế cho việc dùng agent trên codebase của bạn — điểm mấu chốt là *agent nghiên cứu, người quyết định*, cộng hai lớp phòng thủ (read-only + ignore instruction trong input) mà bất cứ ai định nối LLM vào ticket/support queue của Joy đều nên copy.

## [Chrome 154 beta](https://developer.chrome.com/blog/chrome-154-beta) — (developer.chrome.com, 02/09/2026)
**Đây là gì:** Bản beta Chrome 154, chủ yếu là các bổ sung CSS và Web API — đáng chú ý nhất là `scroll-marker-group` có thêm chế độ **links** và **tabs**.

**Điểm đáng chú ý:** Ngoài scroll-marker-group, Chrome 154 thêm `text-decoration-inset` và `text-decoration-skip-spaces` (kiểm soát gạch chân), method `includes()` cho iterator trong JavaScript, WebSocket constructor nhận options dictionary, WebCrypto thêm thuật toán post-quantum, Background Fetch nay enforce CORS + Local Network Access, cải thiện light dismiss cho popover và iframe co giãn theo responsive. Nền tảng CSS carousel liên quan được MDN ghi lại trong [Creating CSS carousels](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_overflow/CSS_carousels).

**Vì sao đáng đọc:** Chế độ tabs của `scroll-marker-group` nghĩa là một tablist/carousel có đầy đủ semantics + keyboard navigation do browser lo, JS = 0 — hữu ích cho các widget loyalty nhúng vào storefront, nơi mỗi KB JS đều ăn vào Core Web Vitals của merchant.
