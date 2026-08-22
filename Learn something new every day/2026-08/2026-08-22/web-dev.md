# 🌐 Web Dev & Craft — 2026-08-22

> Next.js team ra hướng dẫn thực chiến biến app Server Components thành trải nghiệm "app-like"; Node.js chốt lộ trình 1 major/năm; Smashing đào lại SMIL cho SVG animation; và có 1 lỗ hổng critical Next.js cần lên lịch vá.

## ⭐ [Building App-like Experiences with Next.js 16.3](https://nextjs.org/blog/building-app-like-experiences-with-nextjs-16-3) — (nextjs.org, 18/08/2026)

**Đây là gì:** Bài hướng dẫn dài của Aurora Scharff, gom toàn bộ tính năng Next.js 16.3 (Cache Components + Partial Prefetching + View Transitions) thành một "công thức" xây app cảm giác như SPA nhưng vẫn render trên server. Đi kèm 4 demo app open-source: Next Beats (music player), Drop (social feed), Flow (calendar), Huddle (team chat).

**Chi tiết:**
- **Bật 2 cờ trong config**: `cacheComponents: true` + `partialPrefetching: true`. Cache Components đảm bảo mỗi route luôn có sẵn một "App Shell" (static + cached + fallback UI) để hiện ngay; Partial Prefetching kéo shell đó về browser trước khi user click. Với JS thuần thì file là `next.config.mjs`, export object y hệt — không cần `NextConfig` type của TS.
- **Cache có key và tag**: đánh dấu hàm đọc dữ liệu bằng directive `'use cache'`; **arguments của hàm tự trở thành cache key**. Thêm `cacheLife('minutes')` để chỉnh độ tươi và `cacheTag('drops', \`drop-${id}\`)` để gắn tag. Khi mutate, Server Action gọi `updateTag(\`drop-${dropId}\`)` là các view cached liên quan hết hạn ngay.
- **`prefetch={true}` là opt-in có giá**: mặc định một `<Link>` chỉ prefetch shell dùng chung cho cả route. Bật `prefetch={true}` thì link sẽ resolve luôn `params`/`searchParams`/full URL, kéo cả nội dung URL-specific về trước — nhưng bài nói rõ trade-off: **link visible với `prefetch={true}` sẽ gọi server ngay khi lọt viewport**, nên chỉ dùng ở chỗ đáng.
- **Suspense lồng nhau chống CLS**: nếu tách content thành các boundary song song, chúng resolve độc lập và đẩy nhau nhảy lung tung. Bài khuyên **lồng boundary con vào trong boundary cha** — vẫn chạy song song nhưng phần dưới đợi phần trên vào chỗ, trang "lắng xuống" từ trên xuống, tốt cho LCP lẫn CLS.
- **Optimistic update chuẩn**: `useTransition` + `useOptimistic` trong cùng một `startTransition` — set giá trị optimistic rồi mới `await` Server Action. Action fail thì React tự trả về giá trị confirmed cuối cùng, chỉ việc show toast lỗi. Ngoài ra có `useOffline` hook (còn **experimental**, bài ghi rõ không khuyến nghị production) để soft navigation/RSC fetch/Server Action tự retry khi mất mạng thay vì throw.
- **Test được instant navigation**: helper `instant()` từ `@next/playwright` bọc quanh click + `waitForURL` để assert rằng UI đã visible ngay từ phần prefetch, không phải sau khi server trả về.

**Vì sao đáng đọc:** Đây gần như là bản thiết kế cho embedded app Shopify. Admin của Joy Loyalty đầy các trang list → detail (campaigns, tiers, members) mà mỗi lần click là user nhìn spinner trong iframe. Cặp `'use cache'` + `cacheTag`/`updateTag` map thẳng vào flow "sửa reward rule → list phải fresh ngay", còn pattern Suspense lồng nhau trị đúng bệnh layout nhảy của Polaris card khi data về lệch nhịp.

## ⭐ [Node.js Interactive 2026: A Recap](https://nodejs.org/en/blog/events/nodejs-interactive-2026) — (nodejs.org, 14/08/2026)

**Đây là gì:** Bản tóm tắt chính thức hội nghị Node.js Interactive 2026, chốt lại các quyết định về release schedule, docs, networking và security cho runtime mà backend Joy Loyalty đang chạy.

**Chi tiết:**
- **Chuyển từ 2 major/năm xuống 1 major/năm**, bắt đầu từ v27.x: alpha tháng 10/2026, Current v27.0.0 tháng 4/2027, lên LTS tháng 10/2027. Số version sẽ khớp với năm ra bản Current đầu tiên, và **mọi release rồi cũng sẽ thành LTS** — bớt hẳn áp lực upgrade mỗi 6 tháng.
- **Docs platform mới**: CLI `doc-kit` thay pipeline tài liệu tồn tại từ v0.6, sinh ra web page, HTML, man page, JSON schema, search index và cả file `llms.txt`. Bản beta ở beta.docs.nodejs.org, chạy được cả khi không có JavaScript và khi offline.
- **QUIC/HTTP3 đang làm thật**: module `node:quic` đang phát triển, hiện phải build binary có experimental support và chạy cờ `--experimental-quic`. Có đề xuất một server API thống nhất trải cả HTTP/1.1, HTTP/2 và HTTP/3, để sau này `fetch` cũng đi được qua HTTP/3.
- **Supply chain là chủ đề nóng nhất**: recap nêu đích danh vụ **Shai-Hulud (9/2025) làm hỏng 500+ package** và **vụ Axios (3/2026) ảnh hưởng package có 100+ triệu lượt download/tuần**. Pattern tấn công chung: chiếm danh tính con người → dùng quyền publish → lan xuống downstream. Phòng thủ được nhấn mạnh: npm trusted publishing (OIDC), credential ngắn hạn, auth chống phishing, và **dependency cooldown** (không update package ngay ngày nó ra).
- **WinterCG chính thức thành Ecma TC55 (WinterTC)** — chuẩn hóa một tập API tối thiểu chung, verify được, cho JS server-side across Node.js, Deno, Cloudflare Workers.

**Vì sao đáng đọc:** Cloud Functions / Cloud Run của Joy Loyalty bám runtime Node, nên lịch 1 major/năm nghĩa là bớt được một đợt migration hằng năm. Quan trọng hơn là phần supply chain: "dependency cooldown" và trusted publishing là hai thứ có thể áp vào CI của app ngay tuần này, vì một app Shopify bị chèn mã độc qua npm là đi cả API token của merchant.

## [Timing Charts: A Blueprint For SMIL Animations](https://www.smashingmagazine.com/2026/08/timing-charts-blueprint-smil-animations/) — (Smashing Magazine, 20/08/2026)

**Đây là gì:** Johan Grobler giới thiệu "timing chart" — kỹ thuật vẽ sơ đồ thời gian trước khi code — để orchestrate animation SVG bằng SMIL. SMIL là cách animate SVG không cần JavaScript và **chạy được cả khi SVG nằm trong thẻ `<img>`**, thứ mà CSS animation không làm được. Điểm yếu: mỗi tag SMIL chỉ target được một element và một property, nên animation phức tạp rất dài dòng — đó là lý do cần timing chart.

Các attribute chính bài đào: `begin`/`end` (điểm bắt đầu/kết thúc), **syncbase value** kiểu `colorChange.end - 300ms` để neo animation này theo animation khác, `attributeName` (opacity, fill, toạ độ), `dur`, `href` để trỏ tới element đích, và `fill="freeze"` để giữ trạng thái cuối — bỏ đi thì giá trị tự reset.

**Vì sao đáng đọc:** Loyalty UI đầy micro-animation: progress bar tiến lên tier tiếp theo, confetti khi redeem, spinner loading widget. Với các icon/badge nhúng qua `<img>` trên storefront theme, SMIL là lựa chọn duy nhất animate được mà không phải ship thêm một byte JS nào vào trang khách hàng — đúng hướng giữ Core Web Vitals của merchant.

## [Upcoming Next.js August Security Release](https://nextjs.org/blog/upcoming-nextjs-security-release-august-2026) — (nextjs.org, 20/08/2026)

**Đây là gì:** Thông báo báo trước (không phải bản vá) rằng ngày **26/08/2026** Next.js sẽ phát hành bản security xử lý **một lỗ hổng mức critical**, kèm advisory đầy đủ. Hai bản patch dự kiến: **16.3.3** và **15.5.24**. Đây là lần chạy thực tế đầu tiên của quy trình security release định kỳ mà team công bố hồi tháng 7 — báo trước để các team kịp lên lịch upgrade thay vì bị động.

**Vì sao đáng đọc:** Nếu app admin đang trên nhánh 16.3 hoặc 15.5 thì đây là việc cần đặt lịch ngay: chuẩn bị branch upgrade trước 26/08 để hôm đó chỉ việc bump version và deploy, thay vì vừa đọc advisory vừa vá giữa giờ làm.
