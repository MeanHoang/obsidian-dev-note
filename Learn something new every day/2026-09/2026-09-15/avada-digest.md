# 📰 AVADA Digest — 2026-09-15

> Nguồn: [digest.avada.net/d/2026-09-15](https://digest.avada.net/d/2026-09-15) · Đáng chú ý nhất: Discounts Allocator Function API đã bị khai tử (10/09) — app declare `purchase.discounts-allocator.run` sẽ fail deploy; cùng với đó là làn sóng agentic commerce (Meta/Muse mua hàng qua Shopify Catalog).

## ⏰ Deadlines
- **10/09:** Discounts Allocator Function API kết thúc developer preview, không có kế hoạch release. App nào còn declare `purchase.discounts-allocator.run` phải gỡ, nếu không deployment fail; mutation register/unregister đã bị xóa khỏi unstable Admin GraphQL. Ảnh hưởng: app dùng discount function. (shopify.dev/changelog)
- **09/09:** Giới hạn 250 dev store mỗi organization. Shopify CLI 4.8 thêm `shopify store create dev`, `delete`, `list`, `info` để coding agent tự tạo/xóa shop test. Cap không áp dụng cho store client-transfer hay collaborator. Ảnh hưởng: team app/theme quản lý nhiều môi trường test. (shopify.dev/changelog)

## 🛒 Shopify This Week

### Official news
- **Keep Cart in View on Mobile POS (14/09)** — POS v11.15 thêm nút cart cố định trên điện thoại, hiện item vừa thêm + số lượng + tổng tiền từ Home/Products/Orders/Search; tab Cart ở bottom nav bị bỏ. Ảnh hưởng mọi retailer dùng POS mobile. (changelog.shopify.com)
- **Multi-Currency Payouts: Australia & France (11/09)** — Merchant AU có 13 tùy chọn tiền tệ, merchant FR có 18; giúp người bán quốc tế tránh phí quy đổi FX. (changelog.shopify.com)
- **WhatsApp Marketing Consent at Checkout (10/09)** — Thu opt-in WhatsApp ngay trong bước thanh toán, chạy campaign qua Shopify Messaging. (changelog.shopify.com)
- **Shop Campaigns Goes International (10/09)** — Một campaign duy nhất mở rộng ra 35+ thị trường mới, vẫn giữ mô hình pay-per-sale; dành cho merchant ngoài US/CA muốn acquisition. (Shopify X account)
- **Meta as AI Channel (08/09)** — Meta xuất hiện như một AI channel trong Agentic Storefronts; sản phẩm được chia sẻ qua Shopify Catalog mặc định, không cần cài thêm app. (changelog.shopify.com)
- **Muse Shopping Shopify Catalog (08-09/09)** — Muse của Meta tìm trong Shopify Catalog khi user hỏi mua sắm, checkout diễn ra ngay trong app Muse. (Shopify X account)

### Developer updates
- **Product Variants hỗ trợ nhiều barcode (08/09)** — Tối đa 20 barcode/variant, kiểu GTIN, UPC, EAN, ISBN, ASIN (validate khi nhập); `ProductVariant.barcode` bị deprecated, chỉ đọc/ghi entry đầu tiên. Rủi ro: app ERP/marketplace chỉ đọc barcode đầu sẽ bỏ sót định danh. (shopify.dev/changelog)
- **Customer Address API hỗ trợ `countryCode` (08/09)** — Có trong Customer Account API 2026-10; `territoryCode` deprecated nhưng vẫn chạy, chưa công bố ngày gỡ. Ảnh hưởng app checkout và customer-account lên 2026-10. (shopify.dev/changelog)
- **Hỗ trợ UCP 2026-08-25 (04/09)** — Storefront tự quảng bá qua `/.well-known/ucp` mà merchant không cần cấu hình gì. (shopify.dev/changelog)

## 🚀 Launches
- **Cline Desktop (14/09)** — App native Mac/Windows cho coding agent open-source, mở project và tương tác không cần VS Code; model free DeepSeek V4.1 Flash, Muse Spark 1.3, GLM 5.3 Flash qua ClinePass, có BYOK. (cline.bot/desktop, docs.cline.bot)
- **Vercel Labs (14/09)** — Labs được nâng từ biệt danh không chính thức thành team chính thức, gồm agent-browser, skills, json-render, deepsec, fx, just-bash, portless, vgpu. (github.com/vercel-labs)
- **Siri AI (14/09)** — Apple Intelligence thế hệ mới, beta tiếng Anh trên iOS/iPadOS/macOS 27; thêm Pháp, Nhật, Hàn, Bồ, Tây Ban Nha vào tháng 10; EU bị hoãn trên iOS/iPadOS/watchOS. (Apple Newsroom)
- **Keep the Cart in View (POS v11.15) (14/09)** — Trùng mục ở Shopify This Week: cart luôn hiển thị trên POS mobile. (changelog.shopify.com)

## 📦 GitHub Trending

**Hôm nay:**
- `JustVugg/colibri` (★32,026, +2,173) — chạy model MoE frontier trên máy cá nhân, viết C thuần, stream expert từ disk.
- `alibaba/open-code-review` (★25,638, +1,571) — pipeline lai + LLM agent, comment theo dòng ở quy mô Alibaba.
- `multimodal-art-projection/YuE` (★8,312, +559) — YuE2 sinh nhạc với symbolic planning và chỉnh sửa agentic.
- `debpalash/VoiceStudio` (★29,131, +2,776) — bản thay thế ElevenLabs chạy local: clone, design, lồng tiếng, transcribe.
- `666ghj/MiroFish` (★73,119, +560) — engine trí tuệ bầy đàn tuyên bố dự đoán đa lĩnh vực.
- `Panniantong/Agent-Reach` (★81,215, +651) — cho agent "mắt" trên X, Reddit, YouTube, GitHub qua một CLI, không tốn phí API.
- `asgeirtj/system_prompts_leaks` (★66,743, +764) — system prompt trích xuất từ Claude Fable 5.1/Opus 5/Claude Code và GPT-6 Astra/Codex.
- `rlaope/oh-my-hermes` (★2,019, +77) — bộ plugin cho agent Hermes: memory và workflow tối ưu theo model.
- `localsend/localsend` (★91,297, +251) — AirDrop open-source.
- `dani-garcia/vaultwarden` (★67,520, +115) — server tương thích Bitwarden viết bằng Rust.
- `TauricResearch/TradingAgents` (★106,098, +745) — framework trading tài chính đa agent LLM.
- `ruvnet/RuView` (★93,822, +383) — biến WiFi phổ thông thành spatial intelligence và giám sát sinh hiệu.
- `tech-leads-club/agent-skills` (★6,047, +512) — registry skill đã kiểm định cho Claude Code, Cursor, Copilot, Antigravity.
- `OpenBMB/VoxCPM` (★37,356, +216) — TTS không tokenizer cho đa ngôn ngữ và clone giọng.
- `huggingface/transformers` (★165,958, +536) — framework định nghĩa model.
- `ever-co/ever-gauzy` (★5,955, +1,130) — nền tảng quản trị doanh nghiệp mở (ERP/CRM/HRM/ATS/PM).
- `Crosstalk-Solutions/project-nomad` (★36,894, +40) — knowledge server offline-first: Wikipedia, sách, khóa học, AI local tùy chọn.
- `reconurge/flowsint` (★8,333, +280) — nền tảng điều tra dạng graph cho analyst.
- `peetzweg/opendisplay` (★3,551, +229) — Sidecar/Duet mở, dùng iPhone/iPad làm màn hình Mac.
- `SnailSploit/Claude-Red` (★4,708, +579) — bộ skill offensive-security cho Claude.

**Tuần này:**
- `ayghri/i-have-adhd` (★45,409, +17,658) — skill buộc coding agent không chôn câu trả lời.
- `bilawalsidhu/gods-eye-view` (★33,543, +14,403) — vệ tinh do thám trên trình duyệt với quả cầu 3D photoreal.
- `tt-a1i/archify` (★62,208, +9,868) — skill sinh sơ đồ kiến trúc kiểm chứng được dạng HTML self-contained.
- `DietrichGebert/ponytail` (★138,383, +7,722) — skill khiến agent nghĩ như senior: code tốt nhất là code không viết.
- `cathrynlavery/diagram-design` (★39,780, +6,604) — 38 kiểu sơ đồ editorial cho Claude Code, Codex, Pi.
- `affaan-m/ECC` (★258,384, +6,085) — hệ thống tối ưu hiệu năng agent-harness (skills, memory, security).
- `heygen-com/hyperframes` (★50,021, +5,052) — viết HTML, render ra video; thiết kế cho agent.
- `microsoft/markitdown` (★183,994, +4,604) — chuyển file Office → Markdown.
- `obra/superpowers` (★286,679, +4,124) — framework skill agentic.
- `THU-MAIC/OpenMAIC` (★36,813, +3,950) — lớp học đa agent một click.
- `blader/humanizer` (★48,130, +3,201) — skill xóa dấu vết văn phong AI.
- `github/spec-kit` (★136,794, +2,952) — toolkit phát triển theo spec.
- `coreyhaines31/marketingskills` (★50,242, +2,344) — skill CRO, copy, SEO, analytics cho agent.
- `mksglu/context-mode` (★22,847, +2,241) — sandbox output tool, giảm ~98% context.
- `petergyang/no-ai-slop` (★9,531, +1,946) — lọc 20+ mẫu văn AI.
- `Tencent/WeKnora` (★23,215, +1,460) — RAG + agent + wiki tự bảo trì.
- `openai/skills` (★27,190, +1,350) — catalog skill cho Codex.
- `openai/plugins` (★6,704, +1,233) — OpenAI Plugins.
- `earthtojake/text-to-cad` (★15,768, +1,194) — agent skill cho CAD/CAE/CAM.
- `kunchenguid/firstmate` (★5,946, +978) — nói chuyện với một agent, ship bằng cả đội.
- `max-sixty/worktrunk` (★7,659, +761) — CLI git worktree cho workflow agent song song.

**Shopify org (7 ngày, 41 repo):**
- `Shopify/cli-ui` (★1,131, push 14/09) — widget CLI làm nền cho Shopify CLI.
- `Shopify/tapioca` (★874, push 14/09) — sinh RBI cho Sorbet.
- `Shopify/spoom` (★272, push 14/09) — bộ tool cho người dùng Sorbet.
- `Shopify/cli-kit` (★161, push 14/09) — framework dựng giao diện dòng lệnh.
- `Shopify/shopify-function-rust` (★47, push 14/09) — binding Rust cho Shopify Functions.
- `Shopify/tecnix` (★6, push 14/09) — package manager Nix dưới org Shopify.

## 🐦 On X — SaaS, Ecom, DTC

- **SaaS:**
  - [Cline Desktop (14/09)](https://x.com/cline/status/2099536235350086029) — 1.275 like, 312k view; cộng đồng bình "VS Code feels ancient" (237 like), không waitlist, dùng ngay.
  - **Naomi AI Demo Agent V2** — đứng #1 Product Hunt ngày 14/09 với 430 upvote nhưng chưa có traction hữu cơ ≥100 like trên X.
- **Ecom/DTC:**
  - [Meta → Shopify Checkout Pixel Blackout (14/09, Jay Neyer)](https://x.com/jay_neyer/status/2099490855425892520) — khách đủ điều kiện bị đưa thẳng từ Meta sang Shopify checkout, custom pixel và GA không fire; "Somebody is going to spend all of October blaming their media buyer" — đo ROAS Meta vỡ ở tầng pixel.
  - [Cart Total Sticker Shock (14/09, Oliver Kenyon)](https://x.com/oliverkenyon/status/2099615074243559435) — giỏ £170 thành £178,45 ở checkout do thuế/ship tính sau; khuyến nghị hiện đầy đủ chi phí ngay ở cart.
  - [Regulated DTC Infrastructure Barrier (14/09, Daniel Walton)](https://x.com/danieldwalton/status/2099569195721601525) — site peptide dạng template từng scale $500K/tháng nay phải có hạ tầng, LegitScript, attribution nếu không sẽ bị cấm quảng cáo.
  - [r.mfg Shopify Integration (13/09, Kenneth Cassel, 97 like)](https://x.com/KennethCassel/status/2099140999041695877) — scale sản xuất từ dashboard, không cần ôm inventory trước nhiều tháng; hợp brand nghẽn ở linh kiện chứ không phải ads.
  - **TikTok Shop Malaysia** — 100 triệu lượt tìm sản phẩm/ngày (công bố tại TikTok Shop Summit, báo 14/09), tăng trưởng YoY 6,6 (+140%), dự kiến có incentive cuối năm. (Marketing-Interactive)
  - **Sephora Drop Shop trên TikTok Shop** — ra mắt 19/09/2026, hiện là pilot Mỹ, chưa live. (ppc.land)
- **Shopify community:**
  - **RuffRuff nhận badge Built for Shopify (13/09, dev Tsun)** — tự nhận là app author-info Nhật đầu tiên đạt chuẩn BfS, thành mốc chất lượng cho hệ partner Nhật. (x.com/tsun_ec, x.com/___kyoshi___)
  - [Sidekick gợi ý app thiếu chính xác (14/09, Taylor Page)](https://x.com/TRPage_dev/status/2099492186857275745) — 2/3 gợi ý hàng đầu cho bài toán migrate gift card không đáp ứng yêu cầu; dấu hiệu tầng skill/extension đã đủ trưởng thành để lộ lỗi công khai.
  - [Shopify Mobile Staff Reflection (14/09, Daniel Friyia)](https://x.com/wa2goose/status/2099547143203619135) — "the pace makes a year feel like three"; câu chuyện Shop app native vẫn là chủ đề nội bộ nóng.
  - [Rewire DotDev 2026 Staff Interview (14/09)](https://x.com/michika_416/status/2099375627031945384) — phỏng vấn về Hydrogen, Sidekick, agentic commerce, lan trong cộng đồng partner Nhật.
  - [Post chính chủ Shopify (14/09)](https://x.com/Shopify/status/2099536719099887764) — "Me: Should I add more to this PDP? The PDP: Please stop." — triết lý merchandising kể bằng hài.

## 🎭 Culture → Commerce
- [Maybelline Super Stay Vinyl Ink Milkshake (14/09)](https://x.com/BUS_SONRAY/status/2099334823118618968) — drop trên TikTok Shop Thái Lan buổi trưa, KOL PHUTATCHAI live 3 ngày, 5 shade (Rose, Peachy, Red Velvet, Strawberry, Cherry); tín hiệu: khoảnh khắc idol + aesthetic biến thành SKU trên live có ngày cụ thể, không phải trend evergreen. (2.200 like)
- **Food-Print Fashion** — xuất hiện trên culture semantic nhưng chưa có sự kiện sold-out có ngày; trend túi hình bao tạp hóa, décor trái cây.
- **Sephora Drop Shop trên TikTok Shop** — định dạng LIVE có người nổi tiếng, chu kỳ hàng tháng, ra mắt 19/09/2026; mới ở giai đoạn setup culture→commerce, chưa bán live.

## 👽 On Reddit
- **Không có tín hiệu (08–15/09):** chạy `fetch-reddit.sh 7` với old.reddit.com trên r/shopify, r/shopifyDev, r/ecommerce — không bài nào trong cửa sổ 7 ngày; trang hot/new bị redirect về login.

## 🧭 Analysis & Commentary
- **Merchant changelog:** bản POS qua đêm gói gọn ở "cart nằm lại trên điện thoại"; cả tuần câu chuyện agentic được viết dưới dạng copy trong admin (Meta channel, field consent WhatsApp ở checkout, multi-currency payout, Shop Campaigns mở rộng, khai tử Discounts Allocator). Đáng chú ý: Shopify Catalog không cần thông cáo báo chí nào để bật khả năng mua sắm qua Muse.
- **Agent-as-product:** Cline Desktop rời khỏi IDE giống cách Muse không bao giờ cần kệ hàng vật lý — agent giờ là sản phẩm độc lập chứ không phải plugin. Vercel Labs chính thức hóa các primitive (agent-browser, skills, json-render, deepsec, fx, just-bash, portless, vgpu) cho chúng một "nhà" để tích hợp.
- **Apple Intelligence:** Siri AI beta tiếng Anh trên iOS 27 (14/09), thêm ngôn ngữ vào tháng 10, EU hoãn; vẫn có giới hạn feature server-side theo ngày — mà máy Apple chính là nơi đang chạy Shopify ads và Shop Pay.
- **OpenAI Agents API:** public beta từ 10/09, kiến trúc là Codex harness dạng API với session, compaction, MCP, subagent; chỉ tính phí theo token/tool usage.
- **Hội tụ hệ sinh thái merchant:** một merchant Plus trong tuần này đồng thời chạm tới Muse mua hàng qua Catalog, Siri sắp nằm trên chính chiếc điện thoại đang mua ads, và coding agent không còn cần VS Code để deploy theme — hạ tầng agentic commerce đang từ beta thành mặc định.
- **Content performance (AI Engineer's Board):** cả cửa sổ đều HOT, không có WATCH (không video nào vượt 50k trong 30 ngày). Talk của Andrew Qu/Vercel đạt 9.952 view sau 1 ngày (chưa HOT). Top: "Generative UI in Python?" — Jeremiah Lowin, Prefect (31.899 · 5 ngày); "Agents' next frontier: agent-to-agent and network effects" — Jean-Denis Greze, Town (26.524 · 12 ngày); "Building ambitious software" — Jonathan Kelley, Dioxus Labs & Cognition (26.198 · 4 ngày); "Design at the Speed of Adjectives" — Paul Bakaus, Renaissance Geek (24.975 · 5 ngày).
- **Operators Board:** dẫn đầu WATCH là "Every Step to Start an Ecommerce Business" (12.411 · 22 ngày, 24/08); dẫn đầu HOT là "12 Lessons These Ecommerce Founders Wish They'd Learned Sooner" (8.105 · 13 ngày, 02/09); tập mới về packaging mới 1.655 view sau 1 ngày.
- **Chase Chappell channel:** không có mục WATCH hay HOT trong cửa sổ này; video dẫn đầu vẫn là "I Studied Every Ecommerce Offer So You Don't Have To" (8.484 · 25 ngày, 21/08); clip Claude-for-Meta đạt 6.414 view và đang tích lũy.

## 💡 Liên quan Joy Loyalty
- **Discounts Allocator Function API chết (deadline 10/09)** là rủi ro trực tiếp nhất: nếu Joy Loyalty có function phân bổ discount cho reward/tier, cần kiểm tra ngay app config còn declare `purchase.discounts-allocator.run` không — còn là fail deploy.
- **Customer Account API 2026-10 đổi `territoryCode` → `countryCode`** ảnh hưởng mọi chỗ Joy đọc/ghi địa chỉ khách (phân vùng tier theo quốc gia, logic ship/thuế cho reward); nên rà trước khi lên version 2026-10.
- **Agentic commerce (Meta/Muse checkout trong app, WhatsApp consent tại checkout, Shop Campaigns 35+ thị trường)** đặt câu hỏi cho loyalty: điểm và referral có được ghi nhận khi đơn phát sinh ngoài storefront không, và có nên thu consent WhatsApp làm kênh gửi thông báo điểm/reward.
- **Sidekick gợi ý app sai 2/3 lần** — cách app mô tả capability trong listing/skill ngày càng quyết định việc Sidekick có tiến cử Joy Loyalty cho merchant hay không.
