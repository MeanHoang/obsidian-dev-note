# 📰 AVADA Digest — 2026-09-24

> Nguồn: [digest.avada.net/d/2026-09-24](https://digest.avada.net/d/2026-09-24) (tiêu đề trang: "Signal Morning Letter – 24 September 2026") · Đáng chú ý nhất: Shopify mở **Sidekick cho app bên thứ ba** (Orbe đã tích hợp), Events subscription query complexity hạ còn 100 điểm, Polaris CDN 1.1 stable; Amazon mở seller-side cho Claude trong khi chặn shopper agent.

## ⏰ Deadlines
- **01/10/2026:** UI extensions phải target API 2026-01+; giới hạn 64 KB JS nén (128 KB cho full-page customer-account extension). Có form xin exception. [shopify.dev/changelog](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — ảnh hưởng mọi app có checkout/customer-account/admin UI extension.
- **21/09 (đã có hiệu lực):** Cách đo session của Shopify Analytics thay đổi; sessions, conversion rate, bounce và các metric liên quan giờ sẽ khác. [changelog.shopify.com](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements) — merchant/app so sánh số liệu analytics.
- **22/09:** Giới hạn query complexity của Events subscription giảm từ 250 xuống 100 điểm. [shopify.dev/changelog](https://shopify.dev/changelog/events-subscription-query-complexity-limit-is-changing-to-100-points) — app dùng Events subscription.
- **2026-10:** Bỏ `session.currentSession.staffMemberId` khỏi POS UI Extensions; dùng signal reactive `session.staffMember`. [shopify.dev/changelog](https://shopify.dev/changelog/removed-session-currentsession-staffmemberid-from-pos-ui-extensions-2026-10) — app có POS extension.
- **2027-01:** Query `automaticDiscounts` bị xoá; chuyển sang `discountNodes` với `query: "method:automatic"`. [shopify.dev/changelog](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01) — app đọc discount tự động.
- **2027-01:** Mutation `marketCurrencySettingsUpdate` bị xoá; dùng `marketCreate`/`marketUpdate`. [shopify.dev/changelog](https://shopify.dev/changelog/removing-marketcurrencysettingsupdate-mutation) — app quản lý Markets/currency.

## 🛒 Shopify This Week
### Official news (Enterprise Blog)
- **[The New Rules of Brand Discovery](https://www.shopify.com/enterprise/blog/ai-brand-discovery)** (22/09) — session đến từ AI convert tốt hơn ~80% trên PDP; catalog data có cấu trúc convert gấp 2 lần so với feed bị scrape.
- **[Ecommerce SEO Audit: A 5-Pillar Framework for Enterprise Retailers](https://www.shopify.com/enterprise/blog/ecommerce-site-audit)** (19/09) — framework audit gồm technical SEO, tốc độ, UX, checkout, accessibility.
- **[Mainframe-to-Cloud Journey: Enterprise Commerce (2026)](https://www.shopify.com/enterprise/blog/mainframe-cloud-migration-journey)** (17/09) — playbook 5 giai đoạn migrate hệ thống legacy.

### Changelog (17–24/09) — Merchant-facing
- **[Rollouts: kiểm soát chi tiết hơn](https://changelog.shopify.com/posts/plan-launches-events-and-tests-with-clearer-and-more-granular-controls-in-rollouts)** (22/09) — intent controls, traffic split, gộp thay đổi theme + checkout + customer account trong một rollout, phát hiện conflict.
- **[Shop Pay Installments trên nhiều business entity](https://changelog.shopify.com/posts/shop-pay-installments-can-now-be-enabled-on-multiple-business-entities)** (22/09) — bật Shop Pay Installments cho nhiều pháp nhân.

### Developer updates
- **[Polaris CDN 1.1 stable](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable)** (22/09) — thêm component EmptyState, Number, Progress.
- **[Unlimited private plans and target stores in Shopify App Pricing](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing)** (21/09) — không giới hạn số private plan và target store.
- **[`translatable` boolean trên Metafield](https://shopify.dev/changelog/is-translatable-metafield-field)** (21/09) — field mới trên object Metafield GraphQL (API 2026-10).
- **[Market hierarchy queries (`marketRelationships`)](https://shopify.dev/changelog/market-relationships)** (17/09) — query quan hệ phân cấp market; kèm **[canceled receive action cho Inventory Shipments](https://shopify.dev/changelog/adding-a-canceled-receive-action-to-the-inventory-shipments-api)** (lý do huỷ shipment).
- **[Pricing audit trail cho contextual variant prices](https://shopify.dev/changelog/pricing-audit-trail-for-contextual-product-variant-prices)** (17/09) — lưu vết thay đổi giá theo ngữ cảnh.

### Consumer story
- **Muse post của Tobi (21/09)** — Shop Pay agentic checkout trong Muse (7,936 likes, 1.95M views); cổ phiếu $SHOP giảm ~7% thứ Tư sau khi ảnh chụp checkout có Meta Pay.

## 🚀 Launches
- **[Amazon Selling Partner Plugin](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude)** (Amazon, 23/09) — tích hợp Claude + Amazon Quick (beta US): seller kiểm tra tồn kho, đổi giá, cập nhật listing; workflow Seller Assistant chạy 24/7 có phê duyệt. Free 12 tháng Quick Plus tới 31/12/2026.
- **[Notch](https://www.usenotch.ai/)** (23/09) — agent tự động chạy Meta ads: quét Ads Library, viết creative, đẩy lên ad account, đọc kết quả theo phút.
- **[Alexandria by Firecrawl](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)** (Firecrawl, 22/09, Series B $75M) — interface dữ liệu hợp nhất (provider chính thức + index Firecrawl + live web) qua MCP, CLI, API.
- **[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)** (Anthropic, 22/09) — model đầu tiên họ Opus 5.5, hiệu năng ngang Fable 5.1, rẻ hơn ~40% so với Opus 5 ($4/$20), cache read $0.20; Sonnet/Haiku 5.5 sắp ra.
- **[GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)** (OpenAI, 22/09) — model giá rẻ: Sol $2/$10, Luna $0.10/$0.50 per million tokens; có trong ChatGPT Work, Codex, API.
- **[Polaris CDN 1.1](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable)** (Shopify, 22/09) — bản CDN stable kèm component mới.
- **[Shop Pay Installments Multi-Entity](https://changelog.shopify.com/posts/shop-pay-installments-can-now-be-enabled-on-multiple-business-entities)** (Shopify, 22/09) — tính năng Shopify Payments cho merchant.

## 📦 GitHub Trending
**Hôm nay:**
[anthropics/financial-services](https://github.com/anthropics/financial-services) — plugin pack tài chính của Anthropic · [google/ax](https://github.com/google/ax) — runtime orchestration agent mở của Google (+1,543) · [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) — CLI cấu hình/monitor Claude Code · [BuilderIO/agent-native](https://github.com/BuilderIO/agent-native) — framework build app agentic · [obra/superpowers](https://github.com/obra/superpowers) — framework skill agent + phương pháp phát triển phần mềm · [dream-num/univer](https://github.com/dream-num/univer) — "office harness" cho AI agent (sheet, doc, slide, PDF) · [Open-Dev-Society/OpenStock](https://github.com/Open-Dev-Society/OpenStock) — dữ liệu thị trường mã nguồn mở · [agent-substrate/substrate](https://github.com/agent-substrate/substrate) — core system Agent Substrate · [strands-agents/harness-sdk](https://github.com/strands-agents/harness-sdk) — SDK xây/điều khiển agent harness (Python, TS) · [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — biến mọi CLI thành agent-native · [superdesigndev/treg](https://github.com/superdesigndev/treg) — "OpenRouter cho agent tools" · [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — design language cho AI harness · [mvt-project/mvt](https://github.com/mvt-project/mvt) — forensic kiểm tra điện thoại bị xâm nhập · [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) — MCP index repo thành knowledge graph · [harry7557558/spirula-studio](https://github.com/harry7557558/spirula-studio) — trainer 3D Gaussian Splatting (video → splat → mesh) · [browser-use/video-use](https://github.com/browser-use/video-use) — sửa video bằng coding agent · [TNT-Likely/PanWatch](https://github.com/TNT-Likely/PanWatch) — trợ lý AI self-hosted theo dõi cổ phiếu.

**Tuần này:**
[alibaba/open-code-review](https://github.com/alibaba/open-code-review) — code review lai deterministic + LLM agent (+9,833) · [anthropics/claude-code](https://github.com/anthropics/claude-code) — coding agent terminal · [Tencent/WeKnora](https://github.com/Tencent/WeKnora) — nền tảng tri thức LLM (RAG, agent, wiki tự duy trì) · [affaan-m/ECC](https://github.com/affaan-m/ECC) — hệ thống hiệu năng agent harness · [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — skill kỹ thuật production cho coding agent · [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — plugin cho Claude Cowork · [JustVugg/colibri](https://github.com/JustVugg/colibri) — chạy MoE model trên phần cứng sẵn có (C thuần, stream expert từ disk) · [TencentCloud/Octop](https://github.com/TencentCloud/Octop) — trợ lý multi-user multi-agent self-hosted · [stablyai/orca](https://github.com/stablyai/orca) — ADE điều phối nhiều coding agent song song · [cloudflare/quiche](https://github.com/cloudflare/quiche) — QUIC + HTTP/3 · [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat) — app kiểu ChatGPT có agent, MCP, skill · [cline/cline](https://github.com/cline/cline) — coding agent tự động (SDK/IDE/CLI) · [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) — spec-driven development cho AI coding · [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) — skill audit bảo mật nhiều pha, output máy đọc được (+15,280).

**Shopify org (push trong 7 ngày, không trending):**
[Shopify/tapioca](https://github.com/Shopify/tapioca) — sinh RBI · [Shopify/hydrogen](https://github.com/Shopify/hydrogen) — headless storefront · [Shopify/theme-liquid-docs](https://github.com/Shopify/theme-liquid-docs) — tài liệu Liquid · [Shopify/worldwide](https://github.com/Shopify/worldwide) — gem i18n/l10n Ruby · [Shopify/shopify-app-js](https://github.com/Shopify/shopify-app-js) — package JS cho app (tất cả push 23/09).

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** [Notch](https://www.usenotch.ai/) (23/09) — Vinay Jain (ex-Meta) ra mắt agent Meta ads tự động; video founder 252,704 views.
- **Ecom/DTC:**
  - [Muse Checkout on Shopify; Amazon Blocks Agent Access](https://x.com/tobi/status/2102090718546198790) — Shop Pay có trong Muse cho mọi store Shopify; cùng tuần Amazon chặn Muse, ChatGPT, Gemini, Comet → Shopify là "đường ray" checkout cho agent, Amazon là marketplace đóng.
  - [$SHOP Sold Off Wednesday on Meta Pay Screenshot](https://www.thekeyword.co/news/shopify-meta-muse-agentic-checkout) — cổ phiếu giảm ~7%; thực tế merchant không đổi: catalog chia sẻ với Meta mặc định, direct checkout bật cho store đủ điều kiện US/CA/MX, toggle ở Sales channels → Agentic.
  - [Sephora Drop Shop Live on TikTok Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-its-sephora-drop-shop/) (19/09) · [eMarketer](https://www.emarketer.com/content/tiktok-shop-s--23-billion-surge-forcing-big-name-brands-rethink-commerce) — drop độc quyền hàng tháng; TikTok Shop US ước $23.41B năm nay (+48% YoY); Best Buy mở shop ~10,000 SKU.
  - [Amazon Opened Seller Side to Claude](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude) (23/09) — brand bán cả Shopify + Amazon giờ có shopper agent và seller agent tách biệt.
  - [Vaan Group Shipped Plus Rebuilds](https://x.com/x_armand/status/2102780996256948377) (23/09) — loạt rebuild Shopify Plus (Augustinus Bader Magento→Shopify; Dr. Diamond's +50% CVR).
- **Shopify community:**
  - [Orbe Shipped Sidekick Integration](https://x.com/robertosenabre/status/2102694224919498942) — Shopify mở Sidekick cho app bên thứ ba; Orbe trả lời câu hỏi merchant từ data riêng, deep-link vào settings.
  - [Sidekick Moved to Floating Chat](https://x.com/junaidkbr/status/2102778882617463095) — Sidekick chuyển vị trí trong admin; app team hỏi có bắt buộc tích hợp Sidekick không.
  - [Wade Sonenberg Flagged Rollouts Changelog](https://x.com/SkinnyWaterApps/status/2102739336953213347) · [changelog](https://changelog.shopify.com/posts/plan-launches-events-and-tests-with-clearer-and-more-granular-controls-in-rollouts) — nhắc lại cập nhật Rollouts.
  - [$125k ARR Duplicate-Order Merger App](https://x.com/agazdecki/status/2102832956301877688) — app gộp đơn trùng rao bán trên Acquire.com: margin 85%, $152k TTM revenue.
  - [Mustafa Ali Hiring Mobile AppSec Engineer at Shopify](https://x.com/mustafa01ali/status/2102796297652535589) — tuyển tại Canada/US.

## 🎭 Culture → Commerce
- **[Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-its-sephora-drop-shop/)** (19/09) · [eMarketer](https://www.emarketer.com/content/tiktok-shop-s--23-billion-surge-forcing-big-name-brands-rethink-commerce) · [WWD](https://wwd.com/beauty-industry-news/beauty-features/sephora-monthly-drops-tiktok-shop-1239178093/) — live shopping thành cửa sổ ra mắt SKU cao cấp: brand drop độc quyền trên TikTok Shop trước, rồi mới về sephora.com.
- **GTA VI Merch** (23/09) — Rockstar Store có nút "Add to Wishlist", chưa có SKU.
- **Cream Contour / "Carving Cream"** — đang lan truyền như thuật ngữ makeup; chưa thấy sự kiện sold-out có ngày cụ thể.

## 👽 On Reddit
- **r/shopify, r/shopifyDev, r/ecommerce:** hôm nay không có dữ liệu — old.reddit.com trả về network-policy block (WATCH/HOT: 0).

## 🧭 Analysis & Commentary
- **Model competition:** Opus 5.5 rẻ hơn ~20% token so với Opus 5, ~40% trên job agent nhờ ít token hơn và nhanh hơn >30%; cùng ngày OpenAI ra GPT-6 Sol/Luna rẻ hơn 50% so với GPT-5.6 promo.
- **Ecom agent split:** Amazon cho seller agent (Claude) nhưng chặn shopper agent; Shopify làm ngược lại với Muse → brand bán cả hai có 2 bề mặt agent với 2 mô hình permission.
- **Data layer:** Alexandria của Firecrawl — trả tiền cho provider khi agent đọc dữ liệu, thay vì scrape.
- **GitHub trends:** bảng xếp hạng bị agent harness thống trị (google/ax, Univer, cloudflare/security-audit-skill); repo Shopify (Hydrogen, tapioca, shopify-app-js) có push nhưng không trending.
- **Video:** AI Engineer Paris 2026 khai mạc tại Station F (23/09), livestream ngày 1 được 4.7k views; video Claude-for-Meta của Chase Chappell vẫn HOT (9,791 views).
- **Watch next week:** deploy UI extension trước 01/10; Muse checkout ghi nhận đơn Shop Pay hay Meta Pay; Drop Shop LIVE đầu tiên của Sephora có SKU sold-out không.

## 💡 Liên quan Joy Loyalty
- **Sidekick mở cho app bên thứ ba** (Orbe đã ship): cơ hội để Joy trả lời câu hỏi merchant về điểm/tier/referral ngay trong Sidekick và deep-link vào settings; cần theo dõi xem Shopify có yêu cầu mọi app tích hợp hay không.
- **Deadline 01/10 cho UI extensions** (API 2026-01+, giới hạn 64 KB/128 KB) — kiểm tra bundle các extension checkout/customer-account của Joy; nếu vượt thì nộp form exception.
- **Events subscription complexity giảm còn 100 điểm** và **Polaris CDN 1.1** (EmptyState/Number/Progress) — rà query Events nếu có dùng; Progress/Number hữu ích cho UI tiến độ tier/điểm trong admin. Ngoài ra `automaticDiscounts` bị xoá ở 2027-01 — kiểm tra nếu Joy đọc automatic discount.
