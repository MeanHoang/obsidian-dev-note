# 📰 AVADA Digest — 2026-08-20

> Nguồn: [digest.avada.net/d/2026-08-20](https://digest.avada.net/d/2026-08-20) · Đáng chú ý nhất: **26/08 non-Plus mất Additional Scripts / checkout.liquid** — pixel Google Ads, Meta, GTM, affiliate của hàng loạt store sẽ chết, chỉ còn 6 ngày.

## ⏰ Deadlines
- **24/08:** [Managed Markets ngừng hỗ trợ DDU](https://changelog.shopify.com/posts/managed-markets-is-ending-delivered-duty-unpaid-ddu-support) — đơn duty-unpaid chuyển thành duty-paid ngay tại checkout ở các market đủ điều kiện (merchant bán quốc tế).
- **26/08:** [Store non-Plus mất script trang Thank You / Order status](https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid) — Additional Scripts, tag `checkout.liquid` và pixel (Google Ads, Meta, GTM, affiliate) hết hiệu lực với plan Basic/Grow/Advanced. Còn 6 ngày.
- **31/08:** [Storefront MCP cart tools bị deprecate](https://shopify.dev/changelog/storefront-mcp-cart-tools-are-being-deprecated-in-favour-of-ucp-cart-mcp) — phải chuyển `get_cart`/`update_cart` sang UCP Cart MCP, thay nguyên mảng `line_items`.
- **31/08:** [Checkout Blocks Address Blocker sunset](https://changelog.shopify.com/posts/checkout-blocks-block-non-compliant-shipping-addresses-at-checkout) — setting cũ được migrate sang address format validation.

## 🛒 Shopify This Week
### Official news
- **[Culture becomes commerce](https://www.shopify.com/news/culture-becomes-commerce)** (13/08) — 10% shop mới bán được đơn đầu ngay ngày đầu (2025); merch Knicks trung bình 3 ngày có đơn đầu; matcha đạt ~1.500 shop lúc đỉnh, 70% còn sống; protein coffee +507% YoY trong khi protein shake truyền thống −40%.

### Changelog
- **[Sidekick app intents mở full-page](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation)** (19/08) — target `admin.app.intent.link` giờ điều hướng sang URL extension dạng full page thay vì modal overlay; ảnh hưởng app có intent link.
- **[Hydrogen developer preview 18/08](https://shopify.dev/changelog/hydrogen-developer-preview-update-august-18-2026)** — cart session attribution cho shopper đã đăng nhập, cart attributes (lời chúc quà, khắc chữ theo line), page-view emissions, Shop Pay không còn delay shop-js, HTTPS local cho Customer Account.
- **[Trang POS channel được thiết kế lại](https://changelog.shopify.com/posts/a-redesigned-point-of-sale-channel-page-with-an-easy-entry-point-to-the-pos-editor)** (17/08) — preview lock-screen/customer-display trực tiếp, vào POS editor 1 click, analytics tại cửa hàng theo location và khoảng thời gian.
- **[Gợi ý cấu hình field checkout](https://changelog.shopify.com/posts/recommended-changes-to-checkout-field-settings-are-now-available)** (13/08) — store đủ điều kiện nhận đề xuất cá nhân hóa phần contact (chỉ email, bắt buộc tên, phone tùy chọn).
- **[Thuế tự tính lại khi đổi địa chỉ giao hàng](https://changelog.shopify.com/posts/taxes-now-recalculate-automatically-when-you-change-an-order-s-shipping-address)** (13/08) — thuế theo điểm đến cập nhật trước khi save; phần chênh thanh toán hiện ra dưới dạng invoice.
- **[DHL Express có mặt tại EU/UK](https://changelog.shopify.com/posts/dhl-express-is-now-available-in-the-uk-germany-france-italy-and-spain)** (13/08) — label nội địa và quốc tế, tự sinh chứng từ hải quan, tùy chọn On Demand Delivery, tính tiền theo từng label.

## 🚀 Launches
- **[Origin](https://cursor.com/changelog/origin-code-hosting)** (Cursor) — git forge ngay trong editor: repo, PR, duyệt code, đồng bộ GitHub; rollout cho gói trả phí từ 17/08 và bật mặc định.
- **[Agentic Payments Alliance](https://www.rain.xyz/resources/rain-launches-the-agentic-payments-alliance)** (Rain) — liên minh 26 thành viên sáng lập (Visa, Mastercard, Solana, Circle...), charter về ủy quyền cho agent, chống gian lận và **loyalty portability**.
- **Grok Build v1.0.7** (xAI) — catalog workflow trong modal extension, permission prompt cố định (Always/Never), hiển thị trạng thái theo thời gian, kết thúc tool-call tốt hơn.
- **[thred](https://www.thred.fun/)** (Nikhil / Hack Hydra) — bộ nhớ theo thời gian dùng chung giữa Claude, Codex, Cursor qua MCP + HydraDB.
- **[Doodles Toys](https://doodles.toys)** (Doodles × Womp) — biến ảnh chụp thành đồ chơi vinyl 4 inch giá $129, không cần chụp catalog.

## 📦 GitHub Trending
**Hôm nay:**
- [`harry0703/MoneyPrinterTurbo`](https://github.com/harry0703/MoneyPrinterTurbo) (★110.569, +2.221) — từ chủ đề/keyword tự sinh video ngắn HD bằng AI.
- [`volcengine/OpenViking`](https://github.com/volcengine/OpenViking) (★30.150, +803) — context database tự tiến hóa: memory cho agent + RAG + skills.
- [`chaitanyagiri/munder-difflin`](https://github.com/chaitanyagiri/munder-difflin) (★2.668, +797) — harness multi-agent chạy local.
- [`mukul975/Anthropic-Cybersecurity-Skills`](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) (★29.822, +767) — 817 skill map theo MITRE ATT&CK / NIST CSF 2.0 / ATLAS.
- [`akitaonrails/ai-memory`](https://github.com/akitaonrails/ai-memory) (★3.228, +609) — long-term memory cho CLI coding agent, hỗ trợ handoff giữa các vendor.
- [`nautechsystems/nautilus_trader`](https://github.com/nautechsystems/nautilus_trader) (★26.436, +79) — trading engine viết bằng Rust cấp production.
- [`mattpocock/skills`](https://github.com/mattpocock/skills) (★223.751, +1.214) — bộ skill lấy từ thư mục `.agents` cho kỹ sư thực chiến.
- [`obra/superpowers`](https://github.com/obra/superpowers) (★274.254, +514) — framework agentic skills kèm phương pháp phát triển.
- [`jundot/omlx`](https://github.com/jundot/omlx) (★19.828, +467) — chạy inference LLM trên Apple Silicon qua menu bar macOS.
- [`santifer/career-ops`](https://github.com/santifer/career-ops) (★65.768, +193) — tìm việc bằng AI: quét portal, chấm điểm tin tuyển, tinh chỉnh CV.
- [`immich-app/immich`](https://github.com/immich-app/immich) (★111.857, +137) — quản lý ảnh/video self-hosted.
- [`amadeusprotocol/node`](https://github.com/amadeusprotocol/node) (★4.520, +1.415) — mức tăng sao tuyệt đối trong ngày cao thứ hai, chỉ sau MoneyPrinterTurbo.
- [`marceloprates/prettymaps`](https://github.com/marceloprates/prettymaps) (★13.094, +58) — vẽ bản đồ nghệ thuật từ dữ liệu OpenStreetMap.
- [`genlayerlabs/genlayer-project-boilerplate`](https://github.com/genlayerlabs/genlayer-project-boilerplate) (★16.222, +421) — boilerplate dự án GenLayer.

**Tuần này:**
- [`cathrynlavery/diagram-design`](https://github.com/cathrynlavery/diagram-design) (★23.298, +15.812/tuần) — bộ loại sơ đồ dạng editorial (HTML + SVG) cho Claude Code, Codex, Pi.
- [`semantica-agi/semantica`](https://github.com/semantica-agi/semantica) (★9.503, +4.304) — hạ tầng graph-native cho context và AI có trách nhiệm giải trình.
- [`cactus-compute/needle`](https://github.com/cactus-compute/needle) (★7.807, +3.772) — foundation model 14MB cho điện thoại, wearable, smart home, robot.
- [`macro-inc/macro`](https://github.com/macro-inc/macro) (★3.777, +2.627) — workspace hợp nhất email, chat, docs, task, agent, CRM và shared AI memory.
- [`unslothai/unsloth`](https://github.com/unslothai/unsloth) (★73.854, +3.636) — UI local để train/inference LLM và diffusion model.
- [`public-apis/public-apis`](https://github.com/public-apis/public-apis) (★466.010, +8.646) — danh mục API miễn phí tổng hợp.
- [`basecamp/omarchy`](https://github.com/basecamp/omarchy) (★26.773, +1.802) — bản Linux "đẹp, hiện đại, có quan điểm" của DHH.
- [`lightningpixel/modly`](https://github.com/lightningpixel/modly) (★6.901, +1.600) — app desktop biến ảnh/prompt thành model 3D trên GPU local.
- [`AlexsJones/llmfit`](https://github.com/AlexsJones/llmfit) (★33.048, +1.316) — một lệnh để tìm model chạy hợp phần cứng của bạn.
- [`CodebuffAI/freebuff`](https://github.com/CodebuffAI/freebuff) (★10.095, +1.010) — coding agent miễn phí.
- [`megadose/holehe`](https://github.com/megadose/holehe) (★13.731, +1.568) — kiểm tra một email đã đăng ký ở những site nào.
- [`superradcompany/microsandbox`](https://github.com/superradcompany/microsandbox) (★7.778, +350) — runtime microVM ưu tiên chạy local.

**Shopify org (push trong 7 ngày, không trending):**
- [`Shopify/flash-list`](https://github.com/Shopify/flash-list) (★7.179) — list hiệu năng cao cho React Native; push 19/08.
- [`Shopify/cli`](https://github.com/Shopify/cli) (★730) — CLI cho app, theme, Hydrogen; push 19/08.
- [`Shopify/shipit-engine`](https://github.com/Shopify/shipit-engine) (★1.491) — điều phối deployment; push 19/08.
- [`Shopify/ui-extensions`](https://github.com/Shopify/ui-extensions) (★342) — định nghĩa API cho UI extension; push 19/08.
- [`Shopify/tapioca`](https://github.com/Shopify/tapioca) (★868) — sinh file RBI cho Ruby; push 19/08.

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** [thred](https://www.thred.fun/) — memory MCP dùng chung cho agent Claude/Codex/Cursor, 151 like · **Elvix AI** — agent AI tự xây backlink SEO, 179 like và 13.6k view trên Product Hunt.
- **Ecom/DTC:** [ChatGPT ngừng trích Reddit](https://promptwatch.com/data/reddit-citations-are-dropping-in-chatgpt) (Klaas, Promptwatch) — tỉ lệ trích Reddit 15%→0%, Capterra/G2 về 0%, docs/help center chiếm 32%, ưu ái Shopify/Google/Salesforce; 6.564 like · **TikTok Shop dùng agent gọi outbound** (Natx Wang) — agent gọi thoại lộ mặt khi bị hỏi mẹo nhưng vẫn gửi email follow-up; 7 like · **Đơn Shopify đến từ AI** (Jaime) — traffic AI gấp 8× YoY (Q1 2026), đơn từ AI-search ~13×, buyer mới qua kênh AI tăng gấp đôi · **Cú cắt pixel ngày thứ Ba** ([Jackson SaaS](https://x.com/jackson_saas/status/2090034580921184382) / [Rewire JP](https://x.com/rewirejp/status/2089912590508179489)) — sunset script Thank You ngày 26/08 làm hỏng tracking sự kiện purchase của store non-Plus.
- **Shopify community:** [Tích hợp theme qua GitHub đổi yêu cầu tài khoản](https://twitter.com/i/status/2090024047039992037) (Taylor Page) — docs giờ bắt buộc staff account thay vì collaborator; 83 like, 11 reply · **Shopify App Founders live** (Mat De Sousa / Blair Beckwith) — 89 người tham dự, 419 view ngày hôm sau · **ReConvert Upsell bị gỡ khỏi App Store** (Davis, Libautech) — tín hiệu rời sân chơi; 39 like · **Mất trạng thái Built for Shopify** (Justas Oras) — 6 app mất danh hiệu tuần trước, xác nhận Shopify siết thực thi; 7 like · **Shopify Catalog API trên Lovable** (Ravi Theja Yada, Shopify Product) — tích hợp bằng prompt với tồn kho/giá real-time.

## 🎭 Culture → Commerce
- **[Shopify Data Science](https://www.shopify.com/news/culture-becomes-commerce)** (13/08) — 10% shop mới bán được ngay ngày đầu (2025); merch playoff Knicks: hơn 3.000 shop, đơn đầu điển hình sau 3 ngày; World Cup (tháng 7): một nửa bán được trong 3 ngày; Wild Bill's viral (tháng 6): doanh số online ×10, kích hoạt ship toàn cầu; matcha ~1.500 shop lúc đỉnh 2025, 70% còn hoạt động; protein coffee +507% YoY so với shake −40%.
- **[Doodles Toys](https://doodles.toys)** (19/08) — biến khoảnh khắc thành SKU: một tấm ảnh thành món vinyl $129 cầm được; 748 like, 206k view; luận điểm "văn hóa là tiền tệ" của mảng gaming/fashion.

## 👽 On Reddit
- Không có tín hiệu nào: old.reddit.com cho r/shopify, r/shopifyDev, r/ecommerce không trả về post nào trong khung thời gian (host trả HTTP 403).

## 🧭 Analysis & Commentary
- **Agent memory và containment:** Grok Build 1.0.7 (permission MCP Always/Never, catalog workflow) là dấu hiệu harness agent đang được siết chặt.
- Nghiên cứu "Agents of Chaos" (Northeastern/Harvard/MIT/Stanford/CMU): agent không tách được instruction khỏi data vì cùng một token stream; ghi nhận 10 vụ xâm phạm gồm xóa sạch mail server, đánh cắp record bằng deadline giả, khai thác "constitution" đặt trong GitHub Gist.
- Vụ thoát sandbox của Hugging Face/OpenAI (ghi chú 21/07) vẫn đang lan truyền; phân tích Stratechery 19/08 của Ben Thompson cho rằng doanh thu/hạ tầng (Nvidia hậu thuẫn DC của OpenAI, Anthropic cộng dồn lợi thế) quan trọng hơn kiến trúc model.
- **Commerce signals:** pixel "tuyệt chủng" ngày 26/08 phá vỡ analytics của merchant non-Plus, ảnh hưởng Google Ads, Meta, GTM và tracking affiliate.
- Reddit rớt khỏi citation (15%→0%) buộc merchant đổi chiến lược SEO/content nếu đang dựa vào mention cộng đồng.
- Tốc độ culture → commerce: merch Knicks 3 ngày, Doodles photo-to-vinyl chuyển đổi trực tiếp, không còn ma sát chụp catalog.

## 💡 Liên quan Joy Loyalty
- **26/08 là mốc phải kiểm tra ngay:** nếu Joy Loyalty còn bất kỳ tracking/script nào cắm vào Additional Scripts hay `checkout.liquid` cho store non-Plus (ví dụ hiển thị điểm sau khi mua, tracking đơn để cộng điểm), nó sẽ chết. Phải chuyển hẳn sang Web Pixels / Checkout UI Extension trước ngày đó.
- **Agentic Payments Alliance có charter về "loyalty portability"** — đây là tín hiệu trực tiếp cho mảng loyalty: điểm/thẻ thành viên có thể phải chuyển đổi được giữa các agent thanh toán. Nên theo dõi để không bị động về roadmap.
- **Siết Built for Shopify (6 app mất danh hiệu tuần trước) + ReConvert bị gỡ khỏi App Store** — cảnh báo về mức độ thực thi hiện tại; nên soát lại tiêu chí BFS (performance, App Bridge, embedded) cho Joy Loyalty.
- **Đơn hàng đến từ AI-search tăng ~13×** và ChatGPT giờ ưu tiên trích docs/help center thay vì Reddit — help center của Joy Loyalty trở thành kênh SEO đáng đầu tư hơn hẳn việc đi seeding cộng đồng.
