# 📰 AVADA Digest — 2026-08-25

> Nguồn: [digest.avada.net/d/2026-08-25](https://digest.avada.net/d/2026-08-25) · Đáng chú ý nhất: **26/08 Additional Scripts trên trang Thank You / Order Status ngừng chạy cho store non-Plus** — mọi pixel tracking phải chuyển sang Web Pixels ngay hôm nay.

## ⏰ Deadlines
- **26/08:** Additional Scripts ngừng thực thi trên trang thank-you và order status của store **non-Plus**. Pixel tracking (Google Ads, Meta, GTM) và affiliate tag phải migrate sang app pixels / web pixels. Checkout vẫn xử lý thanh toán bình thường. ([Help](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/upgrade-thank-you-order-status) · [Upgrade Guide](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/upgrade-thank-you-order-status/upgrade-guide))
- **31/08:** Storefront MCP cart tools `get_cart` và `update_cart` tại `https://{shop}.myshopify.com/api/mcp` bị khai tử. Chuyển sang UCP Cart MCP tại `https://{shop-domain}/api/ucp/mcp` với `create_cart`, `get_cart`, `update_cart`, `cancel_cart`; request phải kèm `meta` có `ucp-agent.profile`. ([Changelog](https://shopify.dev/changelog/storefront-mcp-cart-tools-are-being-deprecated-in-favour-of-ucp-cart-mcp))

## 🛒 Shopify This Week

### Official news
- **Không có bài newsroom mới trong 7 ngày.** Bài gần nhất: "Commerce Now Moves at the Speed of Culture" (13/08, Shopify Data Science). Các công bố Spring 2026 Edition (UCP, Catalog API, Agentic plan) vẫn là bản release sản phẩm mới nhất.

### Changelog
- **[24/08 — US Tax Calculation theo fulfillment location](https://changelog.shopify.com/posts/shopify-tax-is-now-compatible-with-order-routing)** — Thuế tính theo địa điểm routing thực tế của đơn thay vì origin mặc định; local pickup dùng địa điểm pickup. Ảnh hưởng merchant US nhiều kho.
- **[22/08 — Shopify Payments Activity Report](https://changelog.shopify.com/posts/review-shopify-payments-balance-activity-with-the-new-activity-report)** — Dashboard tài chính hiển thị starting balance, gross activity, fees, payouts, ending balance; xuất PDF; sắp xếp theo balance activity và ngày giao dịch thay vì chu kỳ payout.
- **[21/08 — Checkout mặc định payment method dùng lần cuối](https://changelog.shopify.com/posts/checkout-now-defaults-to-last-used-payment-method-for-signed-in-customers)** — Khách đã đăng nhập (D2C và B2B) được chọn sẵn phương thức gần nhất; giảm ma sát nhưng có thể tăng ticket "quẹt nhầm thẻ".
- **[21/08 — Bulk Staff Setup qua CSV Import](https://changelog.shopify.com/posts/bulk-staff-setup-with-csv-import)** — Tạo / đình chỉ / kích hoạt lại nhân viên Admin và POS hàng loạt kèm gán PIN; hướng tới tuyển thời vụ và mở rộng cửa hàng.
- **[19/08 — `admin.app.intent.link` mở full-page](https://shopify.dev/changelog/app-intents-on-admin-app-intent-link-now-open-as-a-full-page-navigation)** — Target giờ mở dạng điều hướng toàn trang thay vì overlay; layout thiết kế cho modal hẹp phải sửa. Không cần đổi config, áp dụng hồi tố mọi API version; `admin.app.intent.render` giữ nguyên.
- **[18/08 — Hydrogen Developer Preview](https://shopify.dev/changelog/hydrogen-developer-preview-update-august-18-2026)** — Preview có cart session attribution cho khách đăng nhập, cart attributes (lời chúc quà, khắc chữ theo dòng), page-view emission khi điều hướng client-side, render Shop Pay không cần shop-js, HTTPS local cho Customer Account login, và pluggable logging.
- **[Storefront Catalog MCP chuyển sang UCP](https://shopify.dev/changelog/storefront-catalog-mcp-now-implements-ucp)** — `search_catalog`, `lookup_catalog`, `get_product` tại `https://{storedomain}/api/ucp/mcp` là contract chính thức; các keep-alive cũ từ 15/06 đã hết hạn.

### Developer updates
- Xem mục changelog phía trên: App Intents full-page navigation, Hydrogen preview, và chuyển dịch MCP → UCP là ba thay đổi tác động trực tiếp tới app developer tuần này.

## 🚀 Launches
- **[NVIDIA Groq 3 LPX](https://developer.nvidia.com/blog/how-nvidia-groq-3-lpx-unlocks-ultrafast-interactivity-at-long-context-on-nvidia-vera-rubin/)** (24/08) — Rack inference độ trễ thấp từ thương vụ mua Groq $20B, nay vào sản xuất đầy đủ; đạt "3.431 output tokens/sec trên Gemma 4 31B ở 100K context". Nebius và Groq (công ty cloud) dùng rack giống nhau với Dell. ([CNBC](https://www.cnbc.com/2026/08/24/nvidia-says-groq-racks-will-be-online-this-year-after-20-billion-deal.html))
- **[PaymentKit](https://www.paymentkit.com)** (24/08) — Nền tảng billing đa cổng thanh toán hỗ trợ Stripe, Adyen, Airwallex, NMI; có vault network-token độc lập, failover routing, dunning cho subscription; giảm rủi ro processor bị đóng và tỉ lệ VAMP. ([Product Hunt](https://www.producthunt.com/products/paymentkit))
- **[Archal](https://archal.ai)** (23/08) — Startup YC S26 cung cấp API sandbox có state cho coding agent: Slack, Linear, Datadog, GitHub, Stripe và 20+ môi trường mô phỏng provider, có inspect test và reset. $20 credit miễn phí, không cần thẻ. ([YC](https://www.ycombinator.com/companies/archal))
- **[Omacom Foundation / Omarchy](https://omarchy.org/news/2026/08/omacom-foundation-launches-with-8-million/)** (21/08) — DHH và 37signals lập quỹ $8M phát triển Linux desktop; nhà tài trợ gồm CEO Shopify Tobi ($1M), Patrick Collison, Michael Dell, Jack Dorsey, Matthew Prince, Brendan Iribe, Jason Fried.

## 📦 GitHub Trending

**Hôm nay (25/08):**
- [`Alishahryar1/free-claude-code`](https://github.com/Alishahryar1/free-claude-code) (★48.937, +891) — Truy cập Claude Code, Codex, Pi, OpenCode qua relay token miễn phí trên terminal/app/IDE/điện thoại; vọt lên #1 sau một đêm.
- [`openai/codex`](https://github.com/openai/codex) (★117.017, +1.994) — Coding agent terminal chính thức của OpenAI; tăng tuyệt đối lớn nhất trong ngày.
- [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) (★34.040, +434) — Framework tìm việc bằng AI chạy local trên Claude Code: đánh giá tin tuyển, tùy biến CV, viết cover letter.
- [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) (★206.485, +588) — Một file CLAUDE.md đúc từ ghi chú của Karpathy về các cạm bẫy khi code với LLM.
- [`makeplane/plane`](https://github.com/makeplane/plane) (★57.912, +243) — Thay thế mã nguồn mở cho Jira, Linear, Monday, ClickUp.
- [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent) (★235.779, +896) — Framework agent thuộc dòng Hermes Bot Mode.
- [`anthropics/claude-plugins-community`](https://github.com/anthropics/claude-plugins-community) (★1.342, +489) — Chợ plugin cộng đồng cho Claude Cowork và Claude Code; base nhỏ nhưng tăng mạnh qua đêm.
- [`AprilNEA/OpenLogi`](https://github.com/AprilNEA/OpenLogi) (★15.846, +1.097) — Bản Logitech Options+ local-first viết bằng Rust, remap HID++, không cần tài khoản.
- [`apache/maka`](https://github.com/apache/maka) (★2.887, +411) — Apache Maka (Incubating): workspace AI agent local-first với tool call có phân quyền.
- [`PostHog/posthog`](https://github.com/PostHog/posthog) (★38.987, +83) — Product analytics, session replay, feature flag, AI observability.
- [`openclaw/openclaw`](https://github.com/openclaw/openclaw) (★387.433, +173) — Trợ lý AI cá nhân cho mọi hệ điều hành.
- [`AgriciDaniel/claude-obsidian`](https://github.com/AgriciDaniel/claude-obsidian) (★11.874, +310) — Second brain tự tổ chức cho Obsidian + Claude Code.
- [`rohitg00/ai-engineering-from-scratch`](https://github.com/rohitg00/ai-engineering-from-scratch) (★48.268, +349) — Repo dạng khóa học học–xây–ship AI engineering.
- [`basecamp/omarchy`](https://github.com/basecamp/omarchy) (★30.089, +1.056) — Linux desktop của DHH; tin lập foundation giữ đà tăng sao.
- [`tashfeenahmed/freellmapi`](https://github.com/tashfeenahmed/freellmapi) (★19.766, +174) — Một endpoint `/v1` gom 34 nhà cung cấp LLM miễn phí và 635 model endpoint.
- [`dani-garcia/vaultwarden`](https://github.com/dani-garcia/vaultwarden) (★66.125, +175) — Server tương thích Bitwarden (không chính thức) viết bằng Rust.
- [`freestylefly/awesome-gpt-image-2`](https://github.com/freestylefly/awesome-gpt-image-2) (★15.463, +2.449) — Thư viện prompt-as-code cho GPT-Image-2: 530+ prompt reverse-engineer, 20+ template ngành; tăng ngày lớn thứ hai sau Codex.
- [`VoltAgent/awesome-agent-skills`](https://github.com/VoltAgent/awesome-agent-skills) (★31.857, +602) — Hơn 1.000 agent skill cho Claude Code, Codex, Gemini CLI, Cursor.
- [`tinyhumansai/openhuman`](https://github.com/tinyhumansai/openhuman) (★37.250, +515) — AI cá nhân local-first có memory và điều phối đội agent.

**Tuần này:**
- [`harry0703/MoneyPrinterTurbo`](https://github.com/harry0703/MoneyPrinterTurbo) (★115.951, +10.647/tuần) — Từ chủ đề hoặc từ khóa ra video ngắn HD qua workflow AI tự động; tăng tuần lớn nhất.
- [`public-apis/public-apis`](https://github.com/public-apis/public-apis) (★469.875, +7.069/tuần) — Danh sách API miễn phí do cộng đồng tổng hợp.
- [`volcengine/OpenViking`](https://github.com/volcengine/OpenViking) (★32.972, +4.048/tuần) — Context database tự tiến hóa: agent memory + RAG + skills.
- [`modular/modular`](https://github.com/modular/modular) (★29.067, +2.285/tuần) — Modular Platform (MAX + Mojo); #1 bảng tuần.
- [`akitaonrails/ai-memory`](https://github.com/akitaonrails/ai-memory) (★4.405, +2.520/tuần) — Bộ nhớ dài hạn cho CLI coding agent, có handoff giữa các vendor.
- [`cordiverse/cordis`](https://github.com/cordiverse/cordis) (★7.405, +1.972/tuần) — Meta-framework về khả năng kết hợp theo không–thời gian.
- [`cursor/plugins`](https://github.com/cursor/plugins) (★4.974, +1.832/tuần) — Đặc tả plugin và các plugin chính thức của Cursor.
- [`jundot/omlx`](https://github.com/jundot/omlx) (★20.546, +1.689/tuần) — Server inference LLM có continuous batching và cache SSD cho Apple Silicon.
- [`Tencent/AI-Infra-Guard`](https://github.com/Tencent/AI-Infra-Guard) (★5.760, +1.212/tuần) — Red-teaming AI full-stack: quét agent, skills, MCP, đánh giá jailbreak.
- [`eneskirca/nodeterm`](https://github.com/eneskirca/nodeterm) (★1.186, +529/tuần) — Trình quản lý terminal dạng node cho nhiều phiên coding agent song song.

**Shopify org (push trong 7 ngày):**
- [`Shopify/identity_cache`](https://github.com/Shopify/identity_cache) (★1.968) — Cache mức blob cho Active Record; push 24/08.
- [`Shopify/tapioca`](https://github.com/Shopify/tapioca) (★872) — Sinh RBI cho Sorbet; push 24/08.
- [`Shopify/product-taxonomy`](https://github.com/Shopify/product-taxonomy) (★345) — Bộ phân loại sản phẩm chuẩn của Shopify; push 24/08.
- [`Shopify/rubydex`](https://github.com/Shopify/rubydex) (★322) — Phân tích tĩnh hiệu năng cao cho Ruby; push 24/08.
- [`Shopify/spoom`](https://github.com/Shopify/spoom) (★271) — Bộ công cụ cho người dùng Sorbet; push 24/08.
- [`Shopify/shopify-app-bridge`](https://github.com/Shopify/shopify-app-bridge) (★111) — App Bridge; push 24/08.

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** [Archal](https://x.com/AidanTiruvan/status/2091371352544674215) (YC S26, 23/08) — Post của founder đạt 192 like / 144k view: "API sandbox dựng cho agent, 20+ môi trường có state, reset kèm theo", định vị là công cụ đánh giá agent an toàn cho production; vượt mốc 100 like mà không cần Product Hunt.
- **Ecom/DTC — [Còn 1 ngày để migrate tracking Thank You / Order Status](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/upgrade-thank-you-order-status):** Store non-Plus tự động nâng cấp ngày 26/08, Additional Scripts dừng chạy; checkout vẫn hoạt động nhưng pixel tracking dựa trên script đó thì không.
- **Ecom/DTC — [AI-mediated search chuyển đổi ở quy mô lớn](https://x.com/jay_neyer/status/2092001502303052219):** Jay Neyer (24/08), SEO cho 50+ brand Shopify ($3M–$50M), dẫn phát biểu Q2 của Harley Finkelstein: "traffic và đơn hàng từ AI tăng gấp ba so với năm ngoái, 75% đơn attributed cho AI đến từ ngoài top 100 danh mục sản phẩm".
- **Ecom/DTC — [Ma sát khi migrate scope Checkout Admin](https://x.com/soulchildpls/status/2091052944536072291):** Axel Kee (22/08) — `checkoutProfiles` bị deprecate, thay bằng scope [`checkoutAndConfigurations`](https://shopify.dev/docs/api/admin-graphql/latest/queries/checkoutAndAccountsConfigurations); merchant phải mở lại app để cấp quyền.
- **Ecom/DTC — [Liên minh Agentic Payments của Rain](https://x.com/stabledash/status/2090891845416943965):** Ra mắt với Visa, Mastercard, Fiserv, Circle, Solana, Coinflow trong số 25 thành viên sáng lập; CEO Coinflow trên Stabledash (21/08) nói agent cần stablecoin để settle ở tốc độ internet.
- **Ecom/DTC — [Coinbase nêu tên Shopify là khách hàng](https://x.com/therollupco/status/2090982344283115804):** The Rollup (22/08) cùng Alec của Coinbase: Citibank, Shopify, Mass Pay đã lên rails.
- **Shopify community — [@Shopify đăng biểu đồ nhịp tim tăng vọt](https://x.com/Shopify/status/2091919009029435742):** (24/08, 25 like / 6k view) nội dung vui của tài khoản staff, không phải tin vận hành.
- **Shopify community — [Bức tường scope checkout-config vẫn là thread nóng](https://x.com/soulchildpls/status/2091052944536072291):** Axel Kee (22/08, 17 like) cùng tài liệu `checkoutAndAccountsConfigurations`; hàng đợi xin cấp lại quyền cho partner tuần này.
- **Shopify community — [Tobi ký séc $1M cho Omarchy](https://x.com/dhh/status/2090831582596591872):** Post foundation của DHH (21/08, 12.7k like) liệt kê CEO Shopify cạnh Patrick Collison, Michael Dell, Jack Dorsey, Matthew Prince — CEO tài trợ Linux desktop do chính director của mình phát triển.

## 🎭 Culture → Commerce
- **[Slang Gen Alpha thành SKU](https://www.accio.com/business/best-selling-cough-syrup-shirt)** — Accio (22/08): áo "Funny Six Seven 67 Meme Gen Alpha Slang T-Shirt" bán 573 chiếc/tháng ở $17,53; áo cough-syrup bán buôn đạt 9.636 và 7.592 chiếc.
- **[Xe diecast đứng cạnh K-beauty trên TikTok Shop US](https://www.echotik.live/blog/tiktok-shop-weekly-report/)** — EchoTik (20/08, số liệu 10–16/08): beauty vẫn dẫn đầu tại Mỹ (Medicube trong khoảng $5,9–7,2M), đồ sưu tầm giữ vị trí thứ hai — vòng lặp collector chuyển đổi song song chứ không thay thế skincare.
- **[Fourthwall roundup sản phẩm TikTok 20/08](https://fourthwall.com/blog/20-best-products-to-sell-on-tiktok)** — Liệt kê lip stain, miếng dán mụn, charm túi, phụ kiện MagSafe, walking pad, đồ Pilates, snack protein, gói điện giải là nhóm hàng đang chạy.

## 👽 On Reddit
- **Không có tín hiệu Reddit trong cửa sổ 7 ngày.** `old.reddit.com` cho r/shopify, r/shopifyDev, r/ecommerce trả về 403.

## 🧭 Analysis & Commentary
- **Phần cứng inference mới là điểm nóng, không phải tên model** — Groq 3 LPX của NVIDIA (256 LPU mỗi rack tản nhiệt lỏng) giải bài toán context phình to của phiên agent: "3.431 output tokens/sec ở 100K context trên Gemma 4 31B". Tensor parallel batch nhỏ chết vì độ trễ bit đầu nếu không có tối ưu compiler C2C pre-schedule; Nebius, Groq và Dell đều triển khai rack giống nhau. ([NVIDIA](https://developer.nvidia.com/blog/how-nvidia-groq-3-lpx-unlocks-ultrafast-interactivity-at-long-context-on-nvidia-vera-rubin/) · [CNBC](https://www.cnbc.com/2026/08/24/nvidia-says-groq-racks-will-be-online-this-year-after-20-billion-deal.html))
- **Stripe mua OpenRouter** — OpenRouter giữ nguyên sản phẩm, tên và API sau thương vụ; token trở thành đồng tiền thanh toán thay thế bên cạnh thẻ. ([Stripe](https://stripe.com/newsroom/news/stripe-agrees-to-acquire-openrouter) · [OpenRouter](https://openrouter.ai/blog/announcements/openrouter-is-joining-stripe/))
- **[Roadmap MCP được công bố](https://modelcontextprotocol.io/development/roadmap)** — David Soria Parra (22/08, 287 like / 72k view): giao tiếp agent-to-agent, trigger và event, progressive discovery, DPoP. Mang tính định hướng, chưa cam kết. ([X](https://x.com/dsp_/status/2091077636608950581))
- **[Z.ai GLM-5.3 API đã live](https://docs.z.ai/guides/llm/glm-5.3)** — Ra mắt 18/08 (3.753 like): mạnh về coding, an ninh mạng phòng thủ, agent chạy dài; giá giữ nguyên như GLM-5.2 trên API chính thức lẫn gateway đối tác.
- **Tin đồn Hugging Face bán với giá $13B+** — 23/08 (Business Insider, Reuters, Bloomberg): chưa có thương vụ, chưa có bên mua được nêu tên, không bình luận. Thứ được nhắm tới là cái hub, không phải năng lực model frontier.
- **[Ghi chú tuần của ChatGPT](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)** — Cải thiện khám phá plugin (21/08); ChatGPT Sites và Codex đổi được URL hosted mà không cần redeploy (20/08).
- **Highlight YouTube từ AI Engineer World's Fair** — Video HOT: Christopher Lovejoy / Saul Howard về việc stack doanh nghiệp chưa sẵn sàng cho agent (11.1k view, 6 ngày, 19/08); Uber Agentic SDLC (5.8k, 4 ngày, 21/08). Operators WATCH: "How Ecommerce Founders Get Rich" (17.6k, 20 ngày).
- **What to Watch** — Migrate pixel cho store non-Plus (hạn 26/08), độ chính xác tính thuế US trên đơn nhiều địa điểm (rollout 24/08), và khả năng tương tác cart agent với UCP sau khi Storefront MCP sunset ngày 31/08.

## 💡 Liên quan Joy Loyalty
- **Deadline 26/08 là việc gấp nhất:** nếu Joy Loyalty còn bất kỳ script nào chèn vào trang Thank You / Order Status (hiển thị điểm thưởng sau đơn hàng, tracking referral, widget "bạn vừa kiếm được X điểm"), phần đó sẽ chết trên store non-Plus từ ngày mai — phải chuyển sang Web Pixels / Checkout UI extension.
- **`admin.app.intent.link` mở full-page thay vì overlay (19/08, hồi tố mọi API version):** mọi màn hình Polaris trong app được thiết kế cho modal hẹp cần review lại layout — đây là thay đổi không cần đổi config nên dễ vỡ âm thầm.
- **Deprecate `checkoutProfiles` → `checkoutAndConfigurations` scope:** nếu app đọc checkout profile, cần cập nhật scope và chuẩn bị luồng yêu cầu merchant mở lại app để cấp quyền — Axel Kee đã ghi nhận ma sát thực tế này với partner.
- **Chuyển dịch MCP → UCP (Cart sunset 31/08, Catalog đã chuyển):** nếu Joy có tích hợp agentic/AI shopping surface, cart tool phải trỏ về `https://{shop-domain}/api/ucp/mcp` và gửi kèm `meta.ucp-agent.profile`. Thêm bối cảnh: số liệu Q2 của Harley Finkelstein cho thấy đơn từ AI tăng gấp ba — kênh này đáng để loyalty program bám theo.
