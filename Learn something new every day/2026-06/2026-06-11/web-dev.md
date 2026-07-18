# 🌐 Web Dev & Craft — 2026-06-11

> Tuần này: Vercel ra integration tạo Shopify store trực tiếp từ workflow, Chrome 149 mang CSS gap decorations + bfcache cho WebSocket, DevTools 149 lên đời AI debugging, và Node.js báo trước security release HIGH ngày 17/6.

## ⭐ [Build and deploy Shopify storefronts on Vercel](https://vercel.com/changelog/build-and-deploy-shopify-storefronts-on-vercel) — (Vercel Changelog, 04/06/2026)
**Đây là gì:** Integration chính thức Shopify trên Vercel Marketplace — tạo store Shopify mới trực tiếp từ Vercel, tự động cấu hình credentials, và build storefront production-ready trong vài phút mà không rời workflow.
**Chi tiết:**
- Flow: cài integration từ Vercel Marketplace → Vercel tự động configure Shopify credentials → build storefront bằng v0 → deploy thẳng lên Vercel, tất cả trong 1 workflow.
- Cho phép tạo **free test store** để thử nghiệm; khi sẵn sàng launch thì "claim" store và nhận ownership chính thức.
- Hoạt động native với v0, Claude Code, Codex và các AI tool khác — đi từ prompt → storefront đã deploy.
- Giới hạn hiện tại: bản đầu chỉ hỗ trợ **tạo store mới**; connect store Shopify có sẵn vào Vercel đang ở trạng thái "coming soon".
- Cách bắt đầu: cài Shopify từ Vercel Marketplace, từ v0, hoặc qua Vercel CLI.
**Vì sao đáng đọc:** Làm Shopify app tại Joy Loyalty thì đây là tín hiệu lớn — Vercel + AI tooling đang kéo merchant mới vào hệ sinh thái headless/test-store, đáng thử flow này để hiểu merchant tương lai sẽ setup store kiểu gì (và app loyalty cần fit vào đâu).

## [New in Chrome 149](https://developer.chrome.com/blog/new-in-chrome-149) — (Chrome for Developers)
**Đây là gì:** Chrome 149 ra stable đầu tháng 6 với **CSS gap decorations** (style đường kẻ trong gap của grid/flex bằng `column-rule`/`row-rule` + các property mới như `column-rule-inset`, `row-rule-visibility-items`), hỗ trợ `path()`/`shape()` trong `shape-outside`, `Intl.Locale.prototype.variants`, và đặc biệt: trang có WebSocket đang mở giờ **vào được Back/Forward Cache** (Chrome tự đóng WebSocket trước khi cache trang).
```css
/* Trước đây phải hack pseudo-element, giờ chỉ cần: */
.grid {
  display: grid;
  gap: 16px;
  column-rule: 1px solid #e1e3e5; /* kẻ dọc giữa các cột */
}
```
**Vì sao đáng đọc:** Embedded app/dashboard nào giữ WebSocket (realtime updates) trước đây bị loại khỏi bfcache → back/forward chậm; giờ Chrome xử lý hộ, chỉ cần code reconnect khi trang restore — kiểm tra lại logic reconnect WebSocket của app là ăn ngay điểm Core Web Vitals điều hướng.

## [What's new in DevTools (Chrome 149)](https://developer.chrome.com/blog/new-in-devtools-149) — (Chrome for Developers)
**Đây là gì:** Bản update DevTools đi kèm Chrome 149: nâng cấp lớn cho AI assistance, thêm tool debug **WebMCP** (experimental) trong Application panel, mở rộng code completion sang CSS, và **MCP server + CLI của Chrome DevTools cho agents chính thức stable**.
**Vì sao đáng đọc:** MCP server của DevTools stable nghĩa là có thể nối Claude Code thẳng vào browser để debug app Shopify embedded (inspect network, console, performance) bằng agent thay vì copy-paste lỗi thủ công — đáng setup thử trong workflow debug hằng ngày.

## [Node.js Security Releases — Wednesday, June 17, 2026](https://nodejs.org/en/blog/vulnerability/june-2026-security-releases) — (nodejs.org, 09/06/2026)
**Đây là gì:** Node.js pre-announce security release cho cả 3 dòng **26.x, 24.x, 22.x**, mức độ cao nhất **HIGH**, phát hành ngày 17/06/2026 (hoặc ngay sau đó). Các version End-of-Life cũng bị ảnh hưởng.
**Vì sao đáng đọc:** App chạy Node trên Cloud Run/Firebase Functions cần lên lịch bump version base image ngay tuần sau khi patch ra — pin sẵn dòng 22.x/24.x LTS và theo dõi nodejs-sec để không chạy bản dính lỗ hổng HIGH ở production.
