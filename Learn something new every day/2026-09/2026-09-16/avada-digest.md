# 📰 AVADA Digest — 2026-09-16

> Nguồn: [digest.avada.net/d/2026-09-16](https://digest.avada.net/d/2026-09-16) · Đáng chú ý nhất: Shopify Admin đổi giao diện toàn diện (kèm Polaris 2.0 RC sắp ra) — mọi embedded app đều phải chuẩn bị lại UI.

## ⏰ Deadlines
- **10/09:** Developer preview của [Discounts Allocator Function API đã kết thúc](https://shopify.dev/changelog/discounts-allocator-function-api-developer-preview-has-ended) — app nào còn dùng target `purchase.discounts-allocator.run` phải gỡ trước khi deploy, nếu không sẽ fail.
- **09/09:** [Quản lý dev store bằng Shopify CLI](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli) — tạo/xoá dev store từ CLI, giới hạn 250 store mỗi organization.

## 🛒 Shopify This Week

### Official news
- **[Shopify Admin có giao diện mới](https://changelog.shopify.com/posts/see-the-shopify-admin-s-new-look)** (15/09) — redesign navigation dạng thu gọn được, đổi màu sắc/typography, Sidekick chuyển thành khung chat nổi.
- **[Nút cart luôn hiển thị trên POS mobile](https://changelog.shopify.com/posts/keep-the-cart-in-view-on-mobile-pos)** (14/09) — POS v11.15 giữ cart cố định trong tầm nhìn khi bán hàng trên điện thoại.
- **[Multi-currency payouts cho Úc và Pháp](https://changelog.shopify.com/posts/multi-currency-payouts-now-available-in-australia-and-france)** (11/09) — merchant Úc nhận payout 13 loại tiền, Pháp 18 loại.
- **[Retail roundup tháng 8 (v11.12–11.13)](https://www.shopify.com/blog/shopify-retail-roundup-august-2026-v11-12-11-13)** (11/09) — tổng hợp thay đổi vận hành bán lẻ/POS trong tháng 8.
- **[Thu thập consent marketing WhatsApp tại checkout](https://changelog.shopify.com/posts/collect-whatsapp-marketing-consent-at-checkout)** (10/09) — merchant xin phép gửi tin WhatsApp ngay ở bước checkout.
- **[Shop app là gì](https://www.shopify.com/blog/what-is-shop)** (10/09) — bài giải thích vai trò Shop app cho merchant/khách hàng.

### Developer updates (shopify.dev changelog)
- **[Chuẩn bị app cho giao diện Admin mới](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look)** (15/09) — Admin cập nhật styling, Polaris 2.0 RC sắp phát hành; embedded app cần rà lại UI.
- **[metafieldsSet dùng dynamic complexity cost](https://shopify.dev/changelog/dynamic-complexity-cost-for-metafieldsset-mutation)** (15/09) — chi phí = 10 + (số owner riêng biệt × trọng số theo type), ảnh hưởng app ghi metafield hàng loạt.
- **[Delivery option trong Shopify Functions lộ metafields](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields)** (15/09) — từ API v2026-10, function đọc được metafield của delivery option.
- **[family_name thành optional cho đơn B2B](https://shopify.dev/changelog/family_name-is-optional-for-b2b-orders-in-payments-apps-api-requests)** (15/09) — Payments Apps API bớt ràng buộc trường họ với đơn B2B.
- **[Discounts Allocator preview kết thúc](https://shopify.dev/changelog/discounts-allocator-function-api-developer-preview-has-ended)** (10/09) — thông báo phía developer, trùng deadline 10/09.
- **[Shopify CLI 4.8 thêm lệnh quản lý store](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli)** (09/09) — tạo/xoá dev store trực tiếp từ CLI.

### Vừa ngoài khung thời gian (vẫn còn liên quan)
- **[Product variant hỗ trợ tới 20 barcode](https://shopify.dev/changelog/product-variant-barcode-is-being-replaced-by-barcodes)** (08/09) — trường `barcode` bị thay bằng `barcodes`.
- **[Meta trở thành AI channel trong Agentic Storefronts](https://changelog.shopify.com/posts/meta-is-now-an-ai-channel-in-your-admin)** (08/09) — Meta xuất hiện như một kênh AI ngay trong admin.

## 🚀 Launches
- **[AI Autocomplete for Shopify](https://apps.shopify.com/ai-autocomplete)** (MagicX, 15/09) — search gợi ý theo từng ký tự, filter bám sát catalog thật của store.
- **[Gemini 3.8 Live & Extended Thinking](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/)** (Google DeepMind, 15/09) — mô hình speech-to-speech native; Extended Thinking đứng #1 với 82.6 điểm Artificial Analysis Speech Quality Index.
- **[Gemini API cho developer](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/)** — hướng dẫn dựng ứng dụng voice real-time bằng Gemini audio.
- **[WhatsApp Business Tools MCP](https://developers.facebook.com/documentation/mcp)** (Meta, 15/09) — MCP server lo phần setup tài khoản, verification, quản lý template.
- **[Cline Desktop](https://cline.bot/desktop)** (14/09) — coding agent chạy dạng app native trên Mac/Windows.

## 📦 GitHub Trending

**Hôm nay (top 14):**
- [`alibaba/open-code-review`](https://github.com/alibaba/open-code-review) (28,489 ★, +2,756) — pipeline lai, LLM agent comment theo từng dòng code.
- [`JustVugg/colibri`](https://github.com/JustVugg/colibri) (33,795 ★, +2,026) — chạy model MoE đầu bảng trên phần cứng phổ thông, viết thuần C.
- [`ever-co/ever-gauzy`](https://github.com/ever-co/ever-gauzy) (6,619 ★, +634) — nền tảng quản trị doanh nghiệp mở (ERP/CRM/HRM/ATS/PM).
- [`debpalash/VoiceStudio`](https://github.com/debpalash/VoiceStudio) (30,911 ★, +2,072) — bản local thay ElevenLabs: clone, design, dub, transcribe giọng.
- [`Homebrew/BrewUI`](https://github.com/Homebrew/BrewUI) (1,331 ★, +271) — GUI chính thức của Homebrew trên macOS.
- [`melgarafael/DeskcommCRM`](https://github.com/melgarafael/DeskcommCRM) (2,806 ★, +193) — CRM/sales OS self-hosted với agent native, tích hợp WhatsApp.
- [`alphaXiv/OpenResearch`](https://github.com/alphaXiv/OpenResearch) (3,322 ★, +531) — biến coding agent thành research agent.
- [`NationalSecurityAgency/ghidra`](https://github.com/NationalSecurityAgency/ghidra) (76,680 ★, +725) — framework reverse engineering của NSA.
- [`danny-avila/LibreChat`](https://github.com/danny-avila/LibreChat) (43,811 ★, +254) — bản clone ChatGPT có agent, MCP, skills.
- [`pacifio/atlas`](https://github.com/pacifio/atlas) (4,604 ★, +91) — source control cho agent, theo dõi diff của nhiều coding agent.
- [`MG1937/ASC`](https://github.com/MG1937/ASC) (1,152 ★, +129) — front-end decompiler Android nhanh, phục vụ agent.
- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) (94,765 ★, +307) — bộ skill kỹ thuật mức production cho AI coding agent.
- [`tonhowtf/omniget`](https://github.com/tonhowtf/omniget) (12,888 ★, +258) — app desktop tải nội dung từ hơn 1,800 site.
- [`earendil-works/pi`](https://github.com/earendil-works/pi) (105,682 ★, +458) — toolkit agent với API LLM hợp nhất và CLI.

**Tuần này (top movers):**
- [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) (46,238 ★, +17,880) — skill ép coding agent trả lời thẳng, không chôn câu trả lời.
- [`bilawalsidhu/gods-eye-view`](https://github.com/bilawalsidhu/gods-eye-view) (34,801 ★, +15,193) — vệ tinh do thám trong trình duyệt trên quả địa cầu 3D photoreal.
- [`tt-a1i/archify`](https://github.com/tt-a1i/archify) (63,530 ★, +9,077) — skill sinh sơ đồ kiến trúc kiểm chứng được dưới dạng HTML.
- [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) (139,357 ★, +7,499) — skill khiến agent tư duy như senior lười, tránh viết code thừa.
- [`affaan-m/ECC`](https://github.com/affaan-m/ECC) (259,304 ★, +5,398) — hệ thống tối ưu hiệu năng harness cho Claude Code/Codex.
- [`obra/superpowers`](https://github.com/obra/superpowers) (287,157 ★, +4,170) — framework skill cho agent.
- [`THU-MAIC/OpenMAIC`](https://github.com/THU-MAIC/OpenMAIC) (37,101 ★, +3,698) — lớp học multi-agent dựng một cú bấm.
- [`TauricResearch/TradingAgents`](https://github.com/TauricResearch/TradingAgents) (106,666 ★, +3,364) — framework giao dịch tài chính multi-agent LLM.
- [`blader/humanizer`](https://github.com/blader/humanizer) (48,548 ★, +3,248) — skill xoá dấu vết văn phong AI.
- [`microsoft/markitdown`](https://github.com/microsoft/markitdown) (184,389 ★, +3,046) — chuyển file Office và các định dạng khác sang Markdown.
- [`github/spec-kit`](https://github.com/github/spec-kit) (137,048 ★, +3,018) — bộ công cụ phát triển theo spec.
- [`heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes) (50,388 ★, +3,002) — viết HTML, render ra video, thiết kế cho agent.
- [`petergyang/no-ai-slop`](https://github.com/petergyang/no-ai-slop) (9,866 ★, +2,160) — loại bỏ hơn 20 mẫu văn phong AI.
- [`Tencent/WeKnora`](https://github.com/Tencent/WeKnora) (24,131 ★, +1,892) — RAG + agent + wiki tự bảo trì.
- [`mksglu/context-mode`](https://github.com/mksglu/context-mode) (23,073 ★, +1,832) — sandbox output của tool cho coding agent, giảm context khoảng 98%.
- [`openai/plugins`](https://github.com/openai/plugins) (6,784 ★, +1,206) — kho plugin của OpenAI.
- [`earthtojake/text-to-cad`](https://github.com/earthtojake/text-to-cad) (15,897 ★, +1,141) — agent skill cho CAD/CAE/CAM.
- [`openai/skills`](https://github.com/openai/skills) (27,277 ★, +985) — catalog skill cho Codex.
- [`decolua/9router`](https://github.com/decolua/9router) (28,903 ★, +986) — route Claude Code/Codex/Cursor/Cline sang hơn 40 provider miễn phí.
- [`max-sixty/worktrunk`](https://github.com/max-sixty/worktrunk) (7,795 ★, +871) — CLI quản lý git worktree cho workflow chạy nhiều agent song song.

**Shopify org (hoạt động gần đây, đều push 15/09):**
- [`Shopify/job-iteration`](https://github.com/Shopify/job-iteration) (1,316 ★) — cho phép background job ngắt và chạy tiếp được.
- [`Shopify/cli-ui`](https://github.com/Shopify/cli-ui) (1,131 ★) — bộ widget CLI đứng sau Shopify CLI.
- [`Shopify/tapioca`](https://github.com/Shopify/tapioca) (874 ★) — sinh file RBI cho Sorbet.
- [`Shopify/buy-button-js`](https://github.com/Shopify/buy-button-js) (259 ★) — thư viện UI gắn checkout vào website bất kỳ.
- [`Shopify/cli-kit`](https://github.com/Shopify/cli-kit) (161 ★) — framework dựng giao diện dòng lệnh.
- [`Shopify/mruby-engine`](https://github.com/Shopify/mruby-engine) (81 ★) — engine scripting chạy trong sandbox.

## 🐦 On X — SaaS, Ecom, DTC

**SaaS:**
- **[AI Autocomplete for Shopify](https://x.com/bradkowalk/status/2099897698006737261)** — Brad Kowalk công bố (418 like, 403k view, 162 quote, 15/09), chốt câu: "Shopify stores have more powerful search than Amazon".
- **[Cline Desktop](https://x.com/cline/status/2099536235350086029)** — post ra mắt chính thức (1,886 like, 572k view, 14/09), lan truyền hơn 48 giờ với câu "VS Code feels ancient".

**Ecom/DTC:**
- **[TikTok Shop chiến dịch 9.9](https://vietnamnews.vn/bizhub/1799731/tiktok-shop-reports-strong-revenue-growth-in-9-9-campaign.html)** — GMV tăng 70% so cùng kỳ, số người mua và lượt tìm kiếm đều tăng 50%, brand đạt Choice Award có GMV từ search cao hơn mặt bằng 38%.
- **[Copy trong cart gây sốc giá](https://x.com/oliverkenyon/status/2099615074243559435)** — Oliver Kenyon chỉ ra dòng mặc định "Taxes and shipping calculated at checkout" khiến giỏ £170 đội thêm £8.45 ở bước cuối.
- **[DTC trong ngành bị quản lý chặt](https://x.com/danieldwalton/status/2099569195721601525)** — Daniel Walton cảnh báo site bán peptide phải xong hạ tầng, tuân thủ LegitScript và tracking attribution ngay, nếu không sẽ bị cấm chạy ads trong tuần.
- **[Đơn từ agent vẫn bằng 0](https://x.com/the_rl_beowulf/status/2099831144640369090)** — Beowulf Urban tích hợp đủ WebMCP/Liquid nhưng chưa có đơn nào; nút thắt là làm sao đưa agent tới store.
- **[Salesforce Agentforce Commerce](https://uk.linkedin.com/company/commercecloud-demandware)** — thêm checkout ngay trong chat cho Google Search và Gemini, ra mắt tháng 10.
- **[Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-its-sephora-drop-shop/)** — pilot trên TikTok Shop ngày 19/09, chỉ ở Mỹ, chưa live tại thời điểm digest.

**Shopify community:**
- **[Admin mới rollout](https://x.com/GoRideInc/status/2100009803900924101)** — Go Ride (Shopify Plus, LA/Yokohama) đăng chi tiết bản redesign, lan trong cộng đồng partner Nhật (15/09).
- **[Checkout Extensibility làm hỏng conversion TAG](https://x.com/_jade_kk/status/2100005511097639194)** — JADE báo tracking conversion LINE Yahoo Ads chết sau migration, đưa ra 3 cách xử lý (15/09).
- **[Bài blog kỹ thuật của JADE](https://blog.ja.dev/entry/blog/2026/09/16/shopify-line-yahoo-ads-conversion-tracking)** — hướng dẫn chi tiết cách vá tracking.
- **[Admin không truy cập được](https://x.com/paalsoberg/status/2099794734398980496)** — status page vẫn xanh nhưng merchant ở Thổ Nhĩ Kỳ/EU báo lỗi (15/09), có lúc chỉ vào được bằng mobile; [báo cáo thứ hai](https://x.com/TomBrown/status/2099815613619192151).
- **[ZETA Hashtag lên App Store](https://x.com/netshoptan/status/2099646529674072501)** — app engine hashtag chính thức live trên Shopify App Store (15/09).
- **[UCP Complete Guide (tiếng Nhật)](https://x.com/aclab_jp/status/2099996730758680747)** — tài liệu từ partner lab kèm trình mô phỏng checkout cho tiệm bánh, phát hành 15/09.

## 🎭 Culture → Commerce
- **[COS See-Now-Buy-Now](https://www.theglobeandmail.com/life/style/fashion-and-beauty/article-see-now-buy-now-new-york-fashion-week-september-2026/)** — show Fall 2026 tại New York Fashion Week (13/09) đẩy mẫu maxi cổ lọ xếp ly xuống mức tồn kho thấp chỉ trong 24 giờ (nguồn Globe and Mail, 15/09).
- **Túi in hình thực phẩm** — túi kiểu túi tạp hoá và hoạ tiết trái cây xuất hiện trong tín hiệu trend Culture; chưa có ghi nhận sold-out kèm ngày cụ thể.
- **Sephora Drop Shop** — format LIVE shopping có người nổi tiếng, chu kỳ hàng tháng, tích hợp TikTok Shop; hiện là nước đi hạ tầng chứ chưa phải tín hiệu doanh số.

## 👽 On Reddit
- Digest ghi nhận **không có tín hiệu nào trong 7 ngày qua** ở r/shopify, r/shopifyDev và r/ecommerce — feed hot/new trả về HTTP 302 redirect nên không thu thập được.

## 🧭 Analysis & Commentary
- **Chủ đề chính:** Admin redesign không cần marketing để lan truyền; MagicX bán search như một dạng filtering; còn Google/Meta/Salesforce đang nhúng storefront vào bề mặt của agent.
- **Tín hiệu định giá:** [Profound gọi 180 triệu USD ở mức 1,8 tỷ](https://techcrunch.com/2026/09/15/aeo-startup-profound-hits-unicorn-valuation-raises-180m-series-d-7-months-after-last-round/) (mảng answer visibility); [Factory tăng gấp ba lên 5 tỷ](https://factory.com/news/5-billion-valuation) với định vị "enterprise software factory" thay vì coding agent.
- **Liên quan:** [Salesforce Koa](https://www.salesforce.com/news/press-releases/2026/09/15/koa-reasoning-model/) — reasoning model cho CRM dựa trên Nemotron 3, đang pilot trong Agentforce, chưa GA.
- **Bối cảnh AWS:** [GPT-6 Astra lên Amazon Bedrock](https://aws.amazon.com/about-aws/whats-new/2026/09/openai-gpt-6-astra-on-amazon-bedrock/) (08/09, vừa ngoài khung thời gian).

### Video đang trending (AI Engineer Board)
**WATCH:**
- Andrew Qu (Vercel) — "How We Solved Agent Building" (54,270 view · 2 ngày · 14/09).

**HOT:**
- Jeremiah Lowin (Prefect) — "Generative UI in Python?" (34,627 · 6 ngày).
- Paul Bakaus (Renaissance Geek) — "Design at the Speed of Adjectives" (29,485 · 6 ngày).
- Jonathan Kelley (Dioxus/Cognition) — "Building Ambitious Software" (27,820 · 5 ngày).
- Jean-Denis Greze (Town) — "Agents' Next Frontier: Agent-to-Agent & Network Effects" (26,845 · 13 ngày).
- Philipp Schmid (Google DeepMind) — "Agents Without Code: Skills, YAML, Filesystems Replaced Python" (19,782 · 2 ngày).
- Brandon Waselnuk (Unblocked) — "Your Agents Lack Context: Here's How to Fix It" (18,451 · 7 ngày).
- Thomas Wolf & Olive Song (MiniMax) — "Why AI Agents Need Million-Token Context" (16,155 · 12 ngày).
- Tanmai Gopal (PromptQL) — "Your Company Brain Will Leak Secrets" (15,729 · 13 ngày).
- Ajay Prakash (LinkedIn) — "500 Skills, Zero Fine-Tuning: LinkedIn's Playbook" (14,208 · 7 ngày).
- Vincent Wendy (AI Engineer) — "One Designer + AI, Hundreds of Deliverables" (14,123 · 6 ngày).
- Alex Hancock (Block) — "ACP: Universal Remote Control for AI Agents" (13,135 · 7 ngày).
- Mike Chambers (AWS) — "Harness Engineering: Production Cage for Domain Agents" (12,470 · 2 ngày).
- Benjamin Guo (Zo Computer) — "Everyone Gets a Software Company" (12,288 · 13 ngày).
- Thais Castello Branco (Taste Labs) — "Training Taste" (10,217 · 6 ngày).

### Nội dung cho ecommerce/operator
- "Every Step to Start an Ecommerce Business Revealed" (12,504 view · 23 ngày · 24/08).
- "12 Lessons These Ecommerce Founders Wish They'd Learned Sooner" (8,225 · 14 ngày).
- "Ecommerce Therapy: 3 Nine-Figure Operators on Focus & Passion" (7,005 · 7 ngày).

## 💡 Liên quan Joy Loyalty
- **Admin redesign + Polaris 2.0 RC là việc gấp nhất.** Joy Loyalty là embedded app dựng bằng React/Polaris, nên phải chạy thử toàn bộ màn hình admin (earning rules, tiers, widget editor) trên look mới và theo dõi Polaris 2.0 RC để không vỡ layout khi Shopify bật mặc định.
- **`metafieldsSet` đổi sang dynamic complexity cost** ảnh hưởng trực tiếp nếu Joy ghi metafield hàng loạt (điểm, tier, trạng thái member) — công thức 10 + (số owner × trọng số type) có thể khiến job sync đụng rate limit; cần rà lại batch size trong các Cloud Function sync.
- **Discounts Allocator Function API đã hết preview (10/09)** — nếu phần redemption của Joy còn dùng target `purchase.discounts-allocator.run` thì deploy sẽ fail, phải kiểm tra ngay. Kèm theo đó, ca của JADE về Checkout Extensibility làm chết conversion tracking là lời nhắc kiểm thử lại mọi pixel/tracking liên quan tới reward ở checkout.

---

*Digest bao phủ giai đoạn 09–16/09/2026. Shopify newsroom cập nhật lần cuối 13/08, enterprise blog 31/08.*
