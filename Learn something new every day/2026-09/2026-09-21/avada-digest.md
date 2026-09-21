# 📰 AVADA Digest — 2026-09-21

> Nguồn: [digest.avada.net/d/2026-09-21](https://digest.avada.net/d/2026-09-21) · Còn 10 ngày tới mốc 01/10 (API 2026-10 stable + hàng loạt deadline Shopify), và Qwen open-weight model 7B chỉnh sửa ảnh sản phẩm là launch đáng chú ý nhất.

## ⏰ Deadlines
- **01/10/2026:** [2026-10 trở thành stable API version](https://shopify.dev/release-notes/2026-10) — mọi app cần rà release notes.
- **01/10/2026:** [UI extensions phải target API 2026-01 trở lên](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions) — extension cũ không update sẽ vướng.
- **01/10/2026:** [scriptTagCreate/scriptTagUpdate trả về user error](https://shopify.dev/changelog/online-store-script-tags-deprecation) — app còn dùng script tag phải chuyển sang theme app extension.
- **16/09/2026 (đã hiệu lực):** [Events payloads, triggers và headers đã thay đổi](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration) — app nghe webhook/events cần kiểm tra lại parser.
- **2027-01:** [query `automaticDiscounts` bị gỡ bỏ](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01) — app đọc automatic discount phải đổi query.

## 🛒 Shopify This Week

### Official news
- **[17/09 — Mainframe-to-Cloud Journey](https://www.shopify.com/enterprise/blog/mainframe-cloud-migration-journey)** — bài enterprise blog kể hành trình migrate từ mainframe lên cloud.

### Changelog (merchant-facing)
- **[16/09 — Payouts page redesign](https://changelog.shopify.com/posts/payouts-page-redesign-see-all-your-payouts-in-one-view)** — trang payouts thiết kế lại, xem toàn bộ payout trong một view.
- **[15/09 — Shopify admin có giao diện mới](https://changelog.shopify.com/posts/see-the-shopify-admin-s-new-look)** · [hướng dẫn cho dev](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) — admin đổi look, app embedded cần chuẩn bị.
- **[14/09 — Giỏ hàng POS mobile giữ nguyên trên màn hình](https://changelog.shopify.com/posts/keep-the-cart-in-view-on-mobile-pos)** — cart persistent khi bán tại quầy trên mobile POS.

### Developer updates
- **[18/09 — `automaticDiscounts` bị gỡ ở 2027-01](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01)** — chuẩn bị đổi query discount.
- **[17/09 — Xin miễn trừ bundle size cho UI extensions hiện có](https://shopify.dev/changelog/request-a-bundle-size-exception-for-existing-ui-extensions)** — extension quá giới hạn dung lượng có thể request exception.
- **[17/09 — Thêm action "canceled receive" cho Inventory Shipments API](https://shopify.dev/changelog/adding-a-canceled-receive-action-to-the-inventory-shipments-api)** — hủy thao tác nhận hàng trong shipment.
- **[17/09 — Bỏ `session.currentSession.staffMemberId` khỏi POS UI Extensions (2026-10)](https://shopify.dev/changelog/removed-session-currentsession-staffmemberid-from-pos-ui-extensions-2026-10)** — POS extension đang đọc staffMemberId sẽ hỏng.
- **[17/09 — Query market hierarchies (market relationships)](https://shopify.dev/changelog/market-relationships)** — truy vấn quan hệ phân cấp giữa các market.
- **[17/09 — Pricing audit trail cho contextual product variant prices](https://shopify.dev/changelog/pricing-audit-trail-for-contextual-product-variant-prices)** — theo dõi lịch sử thay đổi giá theo ngữ cảnh.
- **[16/09 — Cập nhật Events payloads & subscription configuration](https://shopify.dev/changelog/updates-to-events-payloads-and-subscription-configuration)** — payload, trigger, header của events đổi.
- **[15/09 — Lọc kết quả Catalog search theo media type](https://shopify.dev/changelog/filter-catalog-search-results-by-media-type)** — thêm filter theo loại media.
- **[15/09 — Chuẩn bị app cho giao diện admin mới](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look)** — hướng dẫn dev thích ứng look mới.
- **[15/09 — Dynamic complexity cost cho mutation `metafieldsSet`](https://shopify.dev/changelog/dynamic-complexity-cost-for-metafieldsset-mutation)** — chi phí rate limit tính động theo số metafield.
- **[15/09 — Delivery options trong Shopify Functions expose metafields](https://shopify.dev/changelog/delivery-options-in-shopify-functions-input-now-expose-their-metafields)** — function đọc được metafield của delivery option.
- **[15/09 — `family_name` thành optional cho đơn B2B trong Payments Apps API](https://shopify.dev/changelog/family_name-is-optional-for-b2b-orders-in-payments-apps-api-requests)** — bớt ràng buộc dữ liệu cho B2B.

## 🚀 Launches
- **[Qwen-Image-2.1](https://qwen.ai/research)** (Alibaba) · [Hugging Face](https://huggingface.co/Qwen/Qwen-Image-2.1) · [GitHub](https://github.com/QwenLM/Qwen-Image-2.1) — model open-weight hợp nhất text-to-image và image-editing: visual DiT 7B, native 2048×2048, hỗ trợ RGBA, tối đa 10 ảnh tham chiếu.
- **[Conviction](https://convictiontrade.ai)** (YC) — mô tả ý tưởng trading bằng ngôn ngữ tự nhiên, backtest, rồi deploy agent theo dõi thị trường.
- **[Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-the-sephora-drop-shop/)** (Sephora) — SKU độc quyền hàng tháng ra mắt trước trên TikTok Shop (creator teaser → LIVE có người nổi tiếng dẫn → checkout in-app).
- **[Claude Code 2.1.277 — AGENTS.md fallback](https://news.ycombinator.com/item?id=49758250)** (Anthropic) — không có `CLAUDE.md` thì Claude đọc `AGENTS.md` làm project instructions.

## 📦 GitHub Trending

**Hôm nay:**
- [`affaan-m/ECC`](https://github.com/affaan-m/ECC) — hệ agent-harness: skills, instincts, memory, security, research-first development cho Claude Code.
- [`BuilderIO/agent-native`](https://github.com/BuilderIO/agent-native) — framework xây app agentic.
- [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) — skill cho coding agent chạy security audit nhiều pha với finding đã xác minh.
- [`trycua/cua`](https://github.com/trycua/cua) — computer-use 2.0 open-source: driver đa OS, fleet, benchmark.
- [`anthropics/financial-services`](https://github.com/anthropics/financial-services) — bộ plugin financial-services của Anthropic.
- [`paperless-ngx/paperless-ngx`](https://github.com/paperless-ngx/paperless-ngx) — quản lý tài liệu cộng đồng: scan, index, archive.
- [`anthropics/claude-code`](https://github.com/anthropics/claude-code) — coding agent chạy trong terminal.
- [`mihail911/modern-software-dev-assignments`](https://github.com/mihail911/modern-software-dev-assignments) — bài tập Stanford CS146S Modern Software Dev.
- [`higgsfield-ai/higgsfield`](https://github.com/higgsfield-ai/higgsfield) — orchestration GPU fault-tolerant cho training quy mô tỷ–nghìn tỷ tham số.
- [`Open-Dev-Society/OpenStock`](https://github.com/Open-Dev-Society/OpenStock) — nền tảng thị trường open-source: giá live, alert, fundamentals.
- [`coder/coder`](https://github.com/coder/coder) — môi trường dev bảo mật cho developer và agent của họ.
- [`vercel-labs/json-render`](https://github.com/vercel-labs/json-render) — framework generative UI.
- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) — bộ skill engineering production-grade cho AI coding agent.

**Tuần này:**
- [`alibaba/open-code-review`](https://github.com/alibaba/open-code-review) — code review lai giữa rule deterministic và LLM agent, đã chạy ở quy mô lớn.
- [`Tencent/WeKnora`](https://github.com/Tencent/WeKnora) — nền tảng tri thức LLM: tài liệu → RAG → reasoning agent → wiki tự bảo trì.
- [`bilawalsidhu/gods-eye-view`](https://github.com/bilawalsidhu/gods-eye-view) — repo trending tuần (digest không kèm mô tả).
- [`stablyai/orca`](https://github.com/stablyai/orca) — ADE điều phối một fleet coding agent chạy song song.
- [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) — repo trending tuần (digest không kèm mô tả).
- [`Panniantong/Agent-Reach`](https://github.com/Panniantong/Agent-Reach) — CLI cho agent đọc X, Reddit, YouTube, GitHub, Bilibili, Xiaohongshu.
- [`blader/humanizer`](https://github.com/blader/humanizer) — repo trending tuần (digest không kèm mô tả).
- [`heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes) — repo trending tuần (digest không kèm mô tả).
- [`petergyang/no-ai-slop`](https://github.com/petergyang/no-ai-slop) — repo trending tuần (digest không kèm mô tả).
- [`anthropics/knowledge-work-plugins`](https://github.com/anthropics/knowledge-work-plugins) — repo trending tuần (digest không kèm mô tả).
- [`mksglu/context-mode`](https://github.com/mksglu/context-mode) — repo trending tuần (digest không kèm mô tả).
- [`max-sixty/worktrunk`](https://github.com/max-sixty/worktrunk) — repo trending tuần (digest không kèm mô tả).

**Shopify org (push trong 7 ngày):**
- [`Shopify/cli`](https://github.com/Shopify/cli) · [`Shopify/shopify-app-bridge`](https://github.com/Shopify/shopify-app-bridge) · [`Shopify/shopify-app-python`](https://github.com/Shopify/shopify-app-python) · [`Shopify/tapioca`](https://github.com/Shopify/tapioca) · [`Shopify/ci-queue`](https://github.com/Shopify/ci-queue) · [`Shopify/vscode-shopify-ruby`](https://github.com/Shopify/vscode-shopify-ruby)

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** [Conviction](https://convictiontrade.ai) — trading agent từ YC.
- **Ecom/DTC:**
  - [Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-the-sephora-drop-shop/) · [WWD](https://wwd.com/beauty-industry-news/beauty-features/sephora-monthly-drops-tiktok-shop-1239178093/) — Sephora lên TikTok Shop với drop hàng tháng.
  - [Google holiday agentic-commerce kit](https://blog.google/products-and-platforms/products/shopping/google-shopping-updates-holiday-shopping/) — Google cập nhật Shopping cho mùa lễ theo hướng agentic commerce.
  - [TikTok for Shopify listing mặc định vào Drafts](https://seller-us.tiktok.com/university/essay?knowledge_id=7874080072386317&lang=en) — sản phẩm đồng bộ sang TikTok giờ vào trạng thái nháp.
- **Shopify community:**
  - [Taylor Sicard](https://x.com/TaylorSicard/status/2101642902157787291) — nói về năng lực B2B native của Shopify.
  - [Kalen Jordan](https://x.com/kalenjordan/status/2101449108540014780) — thử nghiệm cold-call merchant.
  - [RuffRuff Apps](https://x.com/ruffruff_apps/status/2101824056941273381) · [help.shopify.com](https://help.shopify.com/en/manual/inbox/assigning-your-ai-staff-member) — yêu cầu của inbox-agent / AI staff member.
  - [George (@chrysostomidesg)](https://x.com/chrysostomidesg/status/2101393899319103919) — luận điểm về retention trong hệ sinh thái app.
  - [AppLovin AXON pixel](https://x.com/bily5260/status/2101742026371043579) — Store Leads tracking pixel AXON.

## 🎬 Culture → Commerce
- **[Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-the-sephora-drop-shop/)** — format TikTok LIVE + creator teaser + host người nổi tiếng.

## 👽 On Reddit
- Không có tín hiệu live hôm nay: r/shopify, r/shopifyDev, r/ecommerce đều trả HTTP 403 (digest ghi rõ bị chặn).

## 🧭 Analysis & Commentary
- Qwen-Image-2.1 là "model drop thực sự ship được" nhờ native transparency (RGBA) và reference image, nhưng license vẫn non-commercial trừ khi thương lượng riêng.
- Về mặt vận hành, Claude Code đang chuẩn hóa sang `AGENTS.md` xuyên nhiều platform.
- Ba mốc thời gian digest nhấn mạnh: 23/09 (OpenAI ChatGPT Ads cho Shopify), 01/10 (deadline Shopify 2026-10), và buổi LIVE Drop Shop đầu tiên của Sephora — "phép thử văn hóa" cho bán lẻ prestige.

## 💡 Liên quan Joy Loyalty
- **Mốc 01/10 ép hành động kép:** API 2026-10 stable + UI extensions phải target ≥2026-01. Widget/extension của Joy (POS, checkout, customer account) cần rà version ngay, đặc biệt **`session.currentSession.staffMemberId` bị bỏ khỏi POS UI Extensions từ 2026-10** — nếu Joy dùng staff ID để ghi nhận điểm tại quầy thì đây là breaking change thật.
- **`automaticDiscounts` bị gỡ ở 2027-01:** Joy tạo/đọc discount để redeem reward, nên phải lên kế hoạch migrate query discount sớm thay vì đợi sát hạn.
- **OpenAI ChatGPT Ads cho Shopify (23/09) + Google agentic-commerce kit:** kênh mua hàng dịch chuyển sang agentic, đáng cân nhắc cách loyalty widget/điểm thưởng hiển thị khi merchant bán ngoài storefront truyền thống (TikTok Shop, agent checkout).
