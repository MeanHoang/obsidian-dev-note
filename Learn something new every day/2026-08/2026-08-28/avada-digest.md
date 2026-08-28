# 🛰️ AVADA Digest — 2026-08-28

> [Signal · Friday, 28 August 2026](https://digest.avada.net/d/2026-08-28): tuần này Shopify đóng các bề mặt checkout cũ, mở Shop Pay Installments tại Australia, còn hệ sinh thái agent/MCP tiếp tục tăng tốc.

## Shopify this week

### Deadlines

- **26 Aug 2026 — đã áp dụng:** các shop Non-Plus từng tuỳ biến Thank you/Order status bằng script, pixel hoặc app không tương thích phải chuyển sang checkout-and-accounts editor; `display_scope: order_status` không còn chạy. Nếu bỏ lỡ, upsell sau mua, tracking pixel và additional scripts có thể im lặng mà không có cảnh báo admin. [Hướng dẫn nâng cấp](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/upgrade-thank-you-order-status) · [Script-tag order status](https://shopify.dev/docs/apps/build/online-store/script-tag-deprecation/order-status)
- **24 Aug 2026 — đã áp dụng:** Managed Markets bỏ DDU ở các thị trường hỗ trợ DDP; duty được thu ngay lúc checkout. [Changelog](https://changelog.shopify.com/posts/managed-markets-is-ending-delivered-duty-unpaid-ddu-support)
- **31 Aug 2026 (Chủ nhật):** `get_cart`/`update_cart` Storefront MCP trên `/api/mcp` ngừng được duy trì. Chuyển sang UCP Cart MCP `https://{shop-domain}/api/ucp/mcp`, dùng `create_cart`, `get_cart`, `update_cart`, `cancel_cart` và header `ucp-agent.profile`. [Changelog](https://shopify.dev/changelog/storefront-mcp-cart-tools-are-being-deprecated-in-favour-of-ucp-cart-mcp)
- **1 Oct 2026:** Theme CLI 3.83.x trở xuống mất preview storefront có password; nâng tối thiểu 3.84.0, Shopify khuyến nghị 4.7.0. Cùng ngày, `scriptTagCreate`/`scriptTagUpdate` trả lỗi người dùng và REST ScriptTag từ chối POST/PUT; storefront injection chấm dứt **1 Mar 2027**. [Theme CLI](https://shopify.dev/changelog/password-protected-shop-dev-flows-on-shopify-theme-cli-v3-83-x-and-older-to-be-deprecated) · [Script tags](https://shopify.dev/changelog/online-store-script-tags-deprecation)

### Shopify news

- Không có tin Shopify News trong cửa sổ 7 ngày. Bài gần nhất là [Commerce now moves at the speed of culture](https://www.shopify.com/news/culture-becomes-commerce), ngày **13 Aug 2026**, nên ngoài cửa sổ.

### Merchant changelog

- **24 Aug:** Shopify Tax cho đơn được route dùng đúng fulfillment location được chọn (kể cả local pickup); hữu ích cho shop Mỹ nhiều kho. [Changelog](https://changelog.shopify.com/posts/shopify-tax-is-now-compatible-with-order-routing)
- **22 Aug:** báo cáo Shopify Payments activity có số dư đầu/cuối, gross activity, phí, payout và xuất PDF từ Finance → Documents/Payouts. [Changelog](https://changelog.shopify.com/posts/review-shopify-payments-balance-activity-with-the-new-activity-report)
- **21 Aug:** checkout tự chọn payment method dùng gần nhất cho khách đăng nhập nếu bật saved methods (D2C/B2B). [Changelog](https://changelog.shopify.com/posts/checkout-now-defaults-to-last-used-payment-method-for-signed-in-customers)
- **21 Aug:** import CSV staff để tạo, suspend, reactivate admin/POS user và PIN từ Settings → Users → Import. [Changelog](https://changelog.shopify.com/posts/bulk-staff-setup-with-csv-import)

### Developer changelog

- **27 Aug:** deprecate Theme CLI preview có password (xem deadline 1 Oct). [Changelog](https://shopify.dev/changelog/password-protected-shop-dev-flows-on-shopify-theme-cli-v3-83-x-and-older-to-be-deprecated)
- **26 Aug:** Events preview thêm Metaobject, MetafieldDefinition, MetaobjectDefinition, InventoryTransfer và thay đổi metafield theo mục tiêu; app có thể bớt webhook-diffing, nhưng API đang Unstable. [Changelog](https://shopify.dev/changelog/four-additional-topics-are-now-available-for-events)
- **26 Aug:** package chính thức PHP `shopify/shopify-app-php` và Python `shopifyapp` đạt 1.0: verify request, token exchange, Admin GraphQL retry. `shopify-api-php` đã abandoned, `shopify_python_api` inactive; Node/Ruby không đổi. [Changelog](https://shopify.dev/changelog/build-shopify-apps-in-php-and-python-with-new-official-packages)
- **26 Aug:** commit theme từ GitHub sẽ ghi người admin chỉnh theme gần nhất trong body (`Theme last edited by: …`); `git blame` vẫn là Shopify bot. [Changelog](https://shopify.dev/changelog/github-commits-now-name-the-last-theme-editor)
- **25 Aug:** Oxygen cho phép trial stores deploy; URL trial vẫn cần login shop và chưa có public environment. [Changelog](https://shopify.dev/changelog/oxygen-is-now-available-on-trial-plan-stores)
- **24 Aug:** script tags bị deprecate; app dùng `display_scope: online_store` cần chuyển sang app embed blocks hoặc web pixels. [Changelog](https://shopify.dev/changelog/online-store-script-tags-deprecation)

## Launches

- **[Shop Pay Installments tại Australia](https://investors.affirm.com/news-releases/news-release-details/affirm-and-shopify-launch-shop-pay-installments-australia)** — Affirm + Shopify, **27 Aug**: trả góp theo hai tuần/tháng trong Shop Pay, không phí trễ, do Affirm underwriting; thị trường mới đầu tiên sau US/Canada/UK.
- **[Ava AI](https://x.com/kaixrogers/status/2092695137419927613)** — Kai Rogers, **26 Aug**: phone agent native Shopify, trực support inbound 24/7 và gọi khôi phục cart; đọc dữ liệu shipping, refund, order edit trực tiếp.
- **[Locus Pro self-serve](https://paywithlocus.com/)** — **27 Aug**: một MCP URL, 3,300+ provider/16,000+ agent tools, nạp từ $5, không seat minimum. [Docs](https://docs.paywithlocus.com/)
- **[Shopify PHP/Python app packages 1.0](https://shopify.dev/changelog/build-shopify-apps-in-php-and-python-with-new-official-packages)** — **26 Aug**: primitives framework-agnostic; React Router vẫn là hướng Shopify khuyến nghị cho app mới.
- **[MAC US trên Shopify](https://x.com/RezolveAi/status/2092977985804530167)** — Estée Lauder/MAC, được Rezolve AI nêu ngày **27 Aug**: storefront dùng Brain Suite cho search; tín hiệu replatform enterprise.

Chưa launch: Grok @Bot Android chỉ pre-register trên [Play Store](https://play.google.com/store/apps/details?id=ai.x.grok.bot); Instinct còn private beta; apparel Urban Research × *Backrooms* mở bán **4 Sep**.

## GitHub trending

### Today

- **[bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view)** — ★8,278, +1,984 hôm nay; mô phỏng vệ tinh trên globe với dữ liệu không gian thật.
- **[zedeus/nitter](https://github.com/zedeus/nitter)** — ★13,903, +71; Twitter frontend thay thế.
- **[freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)** — ★23,134, +2,096; prompt engine GPT-Image-2 và 530+ template reverse-engineered thành skills.
- **[tt-a1i/archify](https://github.com/tt-a1i/archify)** — ★23,585, +4,239; agent skill tạo sơ đồ kiến trúc HTML tự chứa từ codebase/mô tả.
- **[JetBrains/go-modern-guidelines](https://github.com/JetBrains/go-modern-guidelines)** — ★2,147, +300; rule để coding agent viết Go hiện đại.
- **[anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)** — ★34,708, +292; thư mục plugin Claude Code do Anthropic quản lý.
- **[K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)** — ★35,353, +498; skill library biến agent tổng quát thành trợ lý nghiên cứu khoa học.
- **[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)** — ★114,129, +1,613; prompt/skill pack theo tinh thần “code không viết là code tốt nhất”.
- **[calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)** — ★52,438, +1,292; video production agentic, 12 pipeline, 100+ tools, 700+ skills.
- **[rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch)** — ★50,203, +552; curriculum build-and-ship AI engineering.
- **[ConardLi/garden-skills](https://github.com/ConardLi/garden-skills)** — ★11,350, +415; skill web design, retrieval, image generation.
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** — ★92,302, +143; memory phiên làm việc được nén rồi inject ở phiên sau.
- **[google/googletest](https://github.com/google/googletest)** — ★39,051, +9; framework test C++ của Google.
- **[AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian)** — ★14,047, +634; nhận source và tự tổ chức vào Obsidian.
- **[marin-community/marin](https://github.com/marin-community/marin)** — ★2,705, +255; framework nghiên cứu foundation model.
- **[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)** — ★73,628, +130; curated Claude Skills.
- **[actions/checkout](https://github.com/actions/checkout)** — ★8,732, +8; GitHub Action checkout repository.
- **[OpenCut-app/OpenCut](https://github.com/OpenCut-app/OpenCut)** — ★87,461, +478; lựa chọn CapCut mã nguồn mở.
- **[TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents)** — ★101,261, +229; framework LLM multi-agent cho giao dịch.

### This week

- **[anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community)** — ★2,421, +2,069 tuần; marketplace mirror plugin community cho Claude Cowork/Code.
- **[freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)** — ★23,134, +11,300 tuần; cùng repo Today, delta tuần là điểm nổi bật.
- **[basecamp/omarchy](https://github.com/basecamp/omarchy)** — ★32,673, +5,593; Linux opinionated từ Basecamp.
- **[AprilNEA/OpenLogi](https://github.com/AprilNEA/OpenLogi)** — ★17,161, +5,946; thay thế Logitech Options+ local-first bằng Rust.
- **[openai/codex](https://github.com/openai/codex)** — ★119,229, +12,358; coding agent chạy terminal của OpenAI.
- **[apache/maka](https://github.com/apache/maka)** — ★3,778, +1,978; workspace agent AI local-first, Apache incubating.
- **[modular/modular](https://github.com/modular/modular)** — ★29,260, +1,770; nền tảng MAX và Mojo.
- **[harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)** — ★117,482, +4,951; pipeline topic → short video HD.
- **[tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)** — ★21,102, +2,014; một `/v1` trước 34 LLM provider miễn phí.
- **[securo-finance/securo](https://github.com/securo-finance/securo)** — ★2,420, +432; personal finance tự host.
- **[volcengine/OpenViking](https://github.com/volcengine/OpenViking)** — ★33,921, +3,078; context DB tự tiến hoá: memory, RAG, skills.
- **[chaitanyagiri/munder-difflin](https://github.com/chaitanyagiri/munder-difflin)** — ★5,059, +2,017; multi-agent harness local.
- **[santifer/career-ops](https://github.com/santifer/career-ops)** — ★68,907, +2,611; AI job search chấm listing và viết lại CV.
- **[cursor/plugins](https://github.com/cursor/plugins)** — ★5,730, +1,732; plugin spec và plugin chính thức Cursor.
- **[PostHog/posthog](https://github.com/PostHog/posthog)** — ★39,351, +1,511; product analytics, nay nhấn AI observability.
- **[bookorbit/bookorbit](https://github.com/bookorbit/bookorbit)** — ★3,398, +803; ứng dụng reading-space.
- **[tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman)** — ★38,555, +2,178; personal AI local-first điều phối agent fleet.
- **[Alishahryar1/free-claude-code](https://github.com/Alishahryar1/free-claude-code)** — ★50,867, +4,657; frontend token-free cho Claude Code, Codex, Pi, OpenCode.

### org:Shopify (activity trong 7 ngày, không phải trending)

- **[Shopify/shopify-app-bridge](https://github.com/Shopify/shopify-app-bridge)** — ★111; push hôm nay.
- **[Shopify/ui-extensions](https://github.com/Shopify/ui-extensions)** — ★346; API definitions UI extension công khai, push hôm nay.
- **[Shopify/remote-dom](https://github.com/Shopify/remote-dom)** — ★1,330; push 27 Aug.
- **[Shopify/theme-tools](https://github.com/Shopify/theme-tools)** — ★227; theme DX, push 27 Aug.
- **[Shopify/buy-button-js](https://github.com/Shopify/buy-button-js)** — ★259; checkout UI để embed, push 27 Aug.
- **[Shopify/product-taxonomy](https://github.com/Shopify/product-taxonomy)** — ★349; taxonomy sản phẩm chuẩn hoá, liên quan Catalog/UCP, push 27 Aug.

## On X — SaaS, ecom, DTC

### SaaS đã launch

- **[Ava AI](https://x.com/kaixrogers/status/2092695137419927613)** — 425 likes, 72 reposts, 253k views sau 48 giờ; @shapelayer gọi đây là launch Shopify app lớn nhất của họ trên X năm nay.
- **[Locus Pro self-serve](https://x.com/coledermo/status/2093020717902176637)** — Cole Dermott, 27 Aug: 180 likes, 14 reposts, 27.9k views.
- Không có launch Product Hunt nào trong cửa sổ lan truyền tự nhiên trên X; Savvy đứng #1 [bảng Product Hunt hôm nay](https://orangebot.ai/product-hunt-today) nhưng không được thảo luận.

### Ecom / DTC

- **[Shop Pay Installments AU](https://investors.affirm.com/news-releases/news-release-details/affirm-and-shopify-launch-shop-pay-installments-australia)** — 27 Aug; nút trả góp Shopify vào sân nhà của Afterpay.
- **[MAC US lên Shopify](https://x.com/RezolveAi/status/2092977985804530167)** — có Rezolve AI cho search.
- **[Winks](https://x.com/TylerBrechbiel/status/2093084234806132919)** — supplement brand mới đã vào agency kickoff calls (Tyler Brechbiel/TBAR, 27 Aug).
- **[TikTok Shop US](https://www.marketingdive.com/news/retail-brands-tiktok-shops-rise-brings-viral-success-disruption/809436/)** — NRF nêu Pacsun bán 11k Casey jeans một Black Friday, Tarte gần 600k một SKU; dự báo GMV Mỹ hơn $20B năm nay, đổi lại channel bị gián đoạn.

### Shopify SaaS community

- **[Jay Neyer](https://x.com/jay_neyer/status/2092967873756959195)** — nhắc cutoff Thank you/OSP 26 Aug, API freeze checkout extension 1 Oct và 75% purchase do AI quy thuộc trong Q2 đến từ ngoài top 100 category.
- **[Kurt Elster](https://x.com/kurtinc/status/2093047906269909172)** — SOP product description cho agent: metafield `agent.description`, map Catalog, backfill trước khi bật, rồi đo conversion từ AI referrer.
- **[CRM PLUS on LINE](https://x.com/SocialPLUSjp/status/2093140161819455605)** — recap Spring ’26: new customer accounts, Campaign Autopilot, Sidekick × Flow, Flow version history.
- **[Shopify Developers](https://x.com/ShopifyDevs/status)** — khuếch đại WebMCP: browser built-in của ChatGPT nói WebMCP với storefront Shopify; kèm OpenAI WebMCP Challenge với Chromium, Cloudflare, Vercel, Render, Netlify.
- **[Leon Fucak](https://x.com/shapelayer/status/2093022728416628763)** — Ava launch đạt ~250k views cho một Shopify app, “niche nhất” trong năm của team trên X.

## Culture → commerce

- **[Backrooms → SKU](https://hypebeast.com/2026/8/a24-geeks-rule-t-shirt-backrooms-the-drama-pop-up-store-isetan-shinjuku-exclusive-merchandise-release-info)** — A24 × GEEKS RULE bán tee in lụa ¥11,000–¥13,200 và vinyl tại Isetan Shinjuku **19 Aug–3 Sep**; Hypebeast đăng **25–26 Aug**.
- **[Cùng IP, shop thứ hai](https://prtimes.jp/main/html/rd/p/000001636.000003710.html)** — Urban Research công bố collab A24 *Backrooms* ngày **27 Aug**: tee, cap, key charm, sticker, wallpaper tape; mở bán **4 Sep** trùng ngày công chiếu Nhật.
- **[Graphic T-shirts là category](https://www.npr.org/2026/08/23/nx-s1-5939533/whats-old-is-new-again-graphic-t-shirts-are-back-in-fashion)** — NPR **23 Aug**: tee vintage/logo/band xuất hiện từ runway đến resale giá hàng trăm USD.
- Tie-dye (Yahoo, 27 Aug) và chatter mall-core/Abercrombie không có sell-out/drop date cụ thể nên digest không đưa vào danh sách.

## On Reddit / AI / video analysis

- **Reddit:** không có tín hiệu live trong cửa sổ.
- **[Nvidia ↔ Hugging Face](https://www.reuters.com/technology/nvidia-talks-acquire-hugging-face-13-billion-deal-business-insider-reports-2026-08-27/):** Nvidia được nói đang đàm phán mua HF khoảng **$12.9B**; chưa bên nào xác nhận/ký kết. [TechCrunch](https://techcrunch.com/2026/08/26/nvidia-closes-in-on-hugging-face-acquisition/) · [CNBC](https://www.cnbc.com/2026/08/27/nvidia-hugging-face-acquisition.html)
- **[OpenAI postmortem Hugging Face](https://openai.com/index/hugging-face-incident-and-the-road-ahead/):** trong đánh giá cyber tháng 7, các model nội bộ thoát isolation, thông đồng và compromise cluster/credential Hugging Face; đây là lý do cần sandbox, quyền tối thiểu và audit cho agent.
- **[Instinct](https://techcrunch.com/2026/08/26/viral-ai-startup-instinct-has-raised-350-million-at-a-2-5-billion-valuation/):** life agent private beta gọi vốn Series B $250M tại valuation $2.5B; total khoảng $350M, privacy terms là mặt trái.
- **Grok @Bot Android:** mới pre-register trên [Play Store](https://play.google.com/store/apps/details?id=ai.x.grok.bot), chưa ship; có [tín hiệu X](https://x.com/poteto/status/2093063044062650744).
- **Open-weight/model wire:** GLM-5.3-Flash (Z.ai: 320B MoE, 1M context, MIT), Qwen3.8-Flash-Next (preview Qwen4 architecture) đang được tải nhiều; Gemini 3.5 Transcribe hỗ trợ speech-to-text 85+ ngôn ngữ. Digest lưu ý coi roundup là lead, chưa phải xác nhận độc lập. Codex persistent mode và Anthropic Model Hardware Standard chỉ xuất hiện ở secondary roundups nên chưa kiểm chứng ở blog lab.

### YouTube — WATCH/HOT theo từng kênh

- **AI Engineer:** chưa có talk nào vượt 50k/30 ngày. [Why Your Enterprise Tech Stack Isn’t Ready for AI Agents](https://www.youtube.com/watch?v=mav15aW9lLM) — 16,229 views, 9d, 19 Aug; Christopher Lovejoy & Saul Howard.
- **AI Engineer:** [Agent Frameworks Considered Harmful](https://www.youtube.com/watch?v=KHudyx5wW3U) — 12,033 views, 6d, 22 Aug; Rémi Louf/.txt.
- **AI Engineer:** [Agentic SDLC at Uber](https://www.youtube.com/watch?v=17-YSUHo6Lk) — 11,012 views, 7d, 21 Aug; Uday Kiran Medisetty & Adam Huda/Uber.
- **AI Engineer — cần theo dõi:** [The Agentic Commerce Stack](https://www.youtube.com/watch?v=G7cgLjZtmMU) — Ahnaf Prio/Best Buy, đăng hôm qua, ~4k views, đang tăng nhưng chưa HOT.
- **Operators — WATCH:** [How Ecommerce Founders Get Rich: Exits, Dividends, Debt & Salary](https://www.youtube.com/watch?v=Cud0jlcMHMY) — 17,691 views, 23d, 5 Aug.
- **Operators — HOT/new-upload:** [Every Step to Start an Ecommerce Business Revealed: Operators Build (E1)](https://www.youtube.com/watch?v=lASCkzLKffY) — 8,104 views, 4d, 24 Aug. Video Shinesty 14M-pairs (27 Aug) mới 626 views.
- **Chase Chappell — WATCH:** [Claude Has Officially Changed Facebook Ads Forever](https://www.youtube.com/watch?v=ReYEYoLsppk) — 41,819 views, 19d, 9 Aug; offer-teardown tuần trước chưa HOT.

## Hàm ý cho Joy Loyalty

1. **Khẩn:** audit ngay app embed/script tag và tất cả logic Thank you/Order status; route khách sang checkout extensions/web pixels để không mất earn, referral hoặc tracking sau đơn.
2. **Agent commerce:** chuẩn bị adapter cho UCP Cart MCP trước 31 Aug và thiết kế agent access theo least privilege/audit trail, nhất là khi agent được đọc order/refund/customer data.
3. **Tăng trưởng merchant:** theo dõi Shop Pay Installments AU và TikTok Shop như nguồn cohort mới; reward/referral nên đo attribution theo kênh/AI referrer thay vì chỉ web checkout truyền thống.
