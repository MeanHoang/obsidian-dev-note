# 📰 AVADA Digest — 2026-09-25

> Nguồn: [digest.avada.net/d/2026-09-25](https://digest.avada.net/d/2026-09-25) · Headline của bản digest: "Shop Pay is a Muse wallet now, and Shopify recut the admin, sessions, and Events bill in the same week". Shop Pay thành wallet trong agent Muse của Meta, admin Shopify đổi giao diện kèm Polaris 2.0 RC, còn 6 ngày nữa Admin API `2026-10` lên stable.

## ⏰ Deadlines
- **01/10/2026:** Admin GraphQL API `2026-10` chuyển từ RC sang stable. App xử lý orders, tính lại thuế, metafields phải migrate trước khi pin version production. [Release notes](https://shopify.dev/release-notes/2026-10)
- **01/05/2027:** App Built for Shopify phải theo visual style mới của admin. Polaris 2.0 RC là con đường bắt buộc, `polaris-1.js` sẽ không tự nâng cấp. [Changelog](https://shopify.dev/changelog/polaris-2-0-release-candidate)
- **API 2027-01 (removals):** Bỏ query `automaticDiscounts`, thay bằng `discountNodes` với `query: "method:automatic"` ([link](https://shopify.dev/changelog/automaticdiscounts-query-is-removed-in-api-version-2027-01)). Bỏ mutation `marketCurrencySettingsUpdate`, thay bằng `marketCreate`/`marketUpdate` ([link](https://shopify.dev/changelog/removing-marketcurrencysettingsupdate-mutation)). Ảnh hưởng app dùng discount/markets.

## 🛒 Shopify This Week
### Official news (shopify.com/news)
- **Newsroom:** trong 7 ngày gần đây không có bài mới. Bài POV gần nhất có ngày là 13/08/2026 ("Commerce now moves at the speed of culture"), Spring '26 Edition ra ngày 17/06/2026.
- **[Ecommerce Sales Strategy: A Phased Framework (2026)](https://www.shopify.com/enterprise/blog/ecommerce-sales-strategy)** (23/09): bài Enterprise blog về framework chiến lược bán hàng theo từng giai đoạn.
- **[The New Rules of Brand Discovery](https://www.shopify.com/enterprise/blog/ai-brand-discovery)** (22/09): số liệu Q2 2026 cho thấy visitor đến từ AI chuyển đổi tốt hơn organic search khoảng 80%, AI sessions tăng 197% YoY, hơn 50% land thẳng vào trang sản phẩm.
- **[Ecommerce SEO Audit: A 5-Pillar Framework for Enterprise Retailers](https://www.shopify.com/enterprise/blog/ecommerce-site-audit)** (19/09): framework audit SEO gồm 5 trụ cột cho retailer enterprise.

### Changelog (merchant, changelog.shopify.com)
- **[Improved shipping and duty data in analytics](https://changelog.shopify.com/posts/improved-shipping-and-duty-data-in-analytics)** (23/09): report lợi nhuận gộp duties và phí ship trên cùng một order, xử lý multi-currency tốt hơn. Nên đặt lại baseline trước khi so sánh các kỳ. Ảnh hưởng team tài chính và báo cáo theo market.
- **[Redesigned Rollouts setup](https://changelog.shopify.com/posts/plan-launches-events-and-tests-with-clearer-and-more-granular-controls-in-rollouts)** (22/09): gộp thay đổi theme, checkout và customer account vào một rollout, xem trước việc chia audience và các xung đột trước khi lên lịch, chọn được loại launch/event tạm thời/experiment. Ảnh hưởng merchant Plus chạy test.
- **[Shop Pay Installments multi-entity](https://changelog.shopify.com/posts/shop-pay-installments-can-now-be-enabled-on-multiple-business-entities)** (22/09): bật được trên nhiều business entity ở các nước hỗ trợ.
- **[Shopify Analytics session measurement improvements](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements)** (21/09): chỉ tập trung vào visitor là người, phân loại bot/system traffic nhất quán hơn. Sessions, CR, ATC, checkout reach, bounce, pageviews/session bị ảnh hưởng. Orders, sales, số customer giữ nguyên. Coi 21/09 là baseline mới.

### Developer updates (shopify.dev/changelog)
- **[Polaris 2.0 Release Candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate)** (24/09): load `polaris-2-0-rc.js` cho embedded App Home, component tự khớp design admin của từng shop, extension tự nhận giao diện mới. App còn dùng `polaris-1.js` giữ giao diện cũ cho tới khi migrate. Deadline là 01/05/2027.
- **[Events subscription query complexity → 100 points](https://shopify.dev/changelog/events-subscription-query-complexity-limit-is-changing-to-100-points)** (22/09): complexity giảm từ 250 xuống 100, classic webhooks không đổi. Khuyến nghị tách subscription theo trigger và chỉ query variant bị thay đổi.
- **[Polaris CDN 1.1 stable](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable)** (22/09): `polaris.js` và `polaris-1.js` giờ serve bản 1.1, có thêm EmptyState, Number, Progress và đã fix lỗi bubbling event của overlay. Tự rollout.
- **[Unlimited private plans and target stores](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing)** (21/09): bỏ giới hạn 15 plan và 20 store trong Shopify App Pricing.
- **[Metafield.translatable](https://shopify.dev/changelog/is-translatable-metafield-field)** (21/09): field mới trên Admin GraphQL `2026-10`, thay cho cách query `translatableResources` với type `METAFIELD`.

## 🚀 Launches
- **[Shop Pay là wallet trong Meta Muse](https://x.com/Shopify/status/2102916088400847300)** (Shopify): Tobi công bố ngày 21/09, live ngày 24/09. Checkout hoàn tất ngay trong chat ở các store Shopify đủ điều kiện. Merchant mặc định có trong Catalog, còn direct checkout bật/tắt ở Sales channels → Agentic. Bối cảnh: Amazon chặn Muse, Shopify thì cho phép.
- **[Shopify Admin visual redesign](https://x.com/katarinabatina/status/2103161312901816394)** (Shopify): VP Design Katarina Batina đăng walkthrough ngày 24/09, rollout dần từ 15/09. Có frame, màu, font, spacing mới, nav thu gọn được, Sidekick nằm dưới cùng. App chưa lên Polaris 2.0 sẽ trông như một sản phẩm khác.
- **[Claude Opus 5.5](https://www.anthropic.com/claude/opus)** (Anthropic, 22/09): model đầu tiên của dòng 5.5, ngang Fable 5.1 ở phần lớn tác vụ. Giá $4/$20 cho mỗi 1M token, cache read $0.20, rẻ hơn Opus 5 khoảng 40% với workload agent. Sonnet/Haiku 5.5 sắp ra.
- **[Gemini 3.8 Live with Live Avatar](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/)** (Google, 24/09): GA trong Gemini Enterprise, avatar nói có lip-sync, 97 ngôn ngữ, endpoint US/EU. Avatar tùy chỉnh chỉ dành cho allowlist.
- **[Polaris 2.0 RC + Polaris 1.1 stable](https://shopify.dev/changelog/polaris-2-0-release-candidate)** (Shopify, 24/09 và 22/09): digest gọi đây là release chính cho các team làm app trong tuần.
- **[Notch](https://www.usenotch.ai/)** (Vinay Jain, ex-Meta, 23/09): AI brand agent. Viết content static/UGC/VSL, đọc Meta ads library, đẩy campaign và tối ưu theo hiệu suất. Đã live, không phải waitlist.
- **[OpenMuse](https://x.com/RoundtableSpace/status/2102532761387192822)** (22/09): personal assistant mã nguồn mở, tự host được, có computer use, connectors, theo dõi mục tiêu, chạy với harness agent nào cũng được.
- **Chưa live:** [OUSD stablecoin](https://joinopenstandard.com/blog/company-structure-and-leadership), công bố 24/09 với Coinbase, Mastercard, Shopify, Stripe, Visa là founding partner, có "$1B+ in near-term launch liquidity", launch đầy đủ vào cuối 2026. Boots lên TikTok Shop ngày 28/09. Best Buy lên TikTok Shop cuối tháng 10 (~10.000 SKU). Sonnet 5.5/Haiku 5.5 ra "trong vài tuần tới".

## 📦 GitHub Trending
**Hôm nay:**
- [`rohitg00/ai-engineering-from-scratch`](https://github.com/rohitg00/ai-engineering-from-scratch): khóa học ship hệ thống AI thay vì chỉ đọc paper.
- [`vectorize-io/hindsight`](https://github.com/vectorize-io/hindsight): memory cho agent, học qua nhiều lần chạy, không dồn chat log vào vector DB.
- [`dream-num/univer`](https://github.com/dream-num/univer): harness văn phòng cho agent, gộp sheets/docs/slides/canvas/tables/PDF vào một runtime.
- [`google/ax`](https://github.com/google/ax): runtime điều phối agent mã nguồn mở của Google, viết bằng Go.
- [`NVIDIA/Model-Optimizer`](https://github.com/NVIDIA/Model-Optimizer): quantization, distillation, pruning, speculative decoding trong một thư viện.
- [`FxEmbed/FxEmbed`](https://github.com/FxEmbed/FxEmbed): sửa embed X/Bluesky (nhiều ảnh, video, poll) cho Discord/Telegram.
- [`anthropics/financial-services`](https://github.com/anthropics/financial-services): bộ plugin tài chính của Anthropic, vẫn tăng sau đợt bùng nổ tuần trước.
- [`HKUDS/CLI-Anything`](https://github.com/HKUDS/CLI-Anything): biến phần mềm có sẵn thành agent-native qua CLI.
- [`mvt-project/mvt`](https://github.com/mvt-project/mvt): Mobile Verification Toolkit, pháp y kiểm tra thiết bị bị xâm nhập.
- [`obra/superpowers`](https://github.com/obra/superpowers): framework skill cho agent kèm phương pháp phát triển phần mềm.
- [`strands-agents/harness-sdk`](https://github.com/strands-agents/harness-sdk): SDK mở để điều khiển harness agent production (Python/TypeScript).
- [`julyx10/lap`](https://github.com/julyx10/lap): quản lý ảnh offline-first cho thư viện local lớn.
- [`superdesigndev/treg`](https://github.com/superdesigndev/treg): được mô tả là "OpenRouter for agent tools".
- [`leejet/stable-diffusion.cpp`](https://github.com/leejet/stable-diffusion.cpp): inference diffusion (SD, Flux, Wan, Qwen Image) bằng C/C++ thuần.

**Tuần này:**
- [`alibaba/open-code-review`](https://github.com/alibaba/open-code-review): code review lai giữa pipeline deterministic và LLM agent.
- [`anthropics/claude-code`](https://github.com/anthropics/claude-code): coding agent chạy trên terminal.
- [`affaan-m/ECC`](https://github.com/affaan-m/ECC): tối ưu harness agent (skills, instincts, memory, security) cho Claude Code.
- [`Tencent/WeKnora`](https://github.com/Tencent/WeKnora): nền tảng tri thức LLM gồm RAG, agent suy luận và wiki tự bảo trì.
- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills): skill kỹ thuật production cho coding agent.
- [`anthropics/knowledge-work-plugins`](https://github.com/anthropics/knowledge-work-plugins): plugin cho knowledge worker trong Claude Cowork.
- [`stablyai/orca`](https://github.com/stablyai/orca): ADE điều phối nhiều coding agent chạy song song (desktop/mobile).
- [`TencentCloud/Octop`](https://github.com/TencentCloud/Octop): assistant tự host, nhiều user, nhiều agent.
- [`davila7/claude-code-templates`](https://github.com/davila7/claude-code-templates): CLI cấu hình và theo dõi Claude Code.
- [`JustVugg/colibri`](https://github.com/JustVugg/colibri): chạy model MoE frontier trên phần cứng có sẵn, stream expert từ disk, viết bằng C thuần.
- [`cloudflare/quiche`](https://github.com/cloudflare/quiche): implementation QUIC + HTTP/3.
- [`Fission-AI/OpenSpec`](https://github.com/Fission-AI/OpenSpec): spec-driven development cho coding assistant.
- [`akitaonrails/ai-memory`](https://github.com/akitaonrails/ai-memory): memory dài hạn và chuyển giao giữa các vendor cho CLI coding agent.
- [`cline/cline`](https://github.com/cline/cline): coding agent tự động, dùng dạng SDK, IDE extension hoặc CLI.
- [`LibreChat-AI/LibreChat`](https://github.com/LibreChat-AI/LibreChat): UI kiểu ChatGPT tự host, có agents, MCP, skills.

**Shopify org** (push trong 7 ngày gần đây, không trending):
- [`Shopify/react-native-skia`](https://github.com/Shopify/react-native-skia): đồ họa Skia cho React Native.
- [`Shopify/cli`](https://github.com/Shopify/cli): CLI cho apps, themes, Hydrogen.
- [`Shopify/ghostferry`](https://github.com/Shopify/ghostferry): migrate dữ liệu khi hệ thống đang chạy.
- [`Shopify/ui-extensions`](https://github.com/Shopify/ui-extensions): định nghĩa API UI extension public.
- [`Shopify/rubydex`](https://github.com/Shopify/rubydex): static analysis cho Ruby.
- [`Shopify/spoom`](https://github.com/Shopify/spoom): tooling cho Sorbet.

## 🐦 On X — SaaS, Ecom, DTC
**SaaS đã thực sự launch:**
- [Notch launch film](https://twitter.com/i/status/2102807537024135658): "AI can run a brand better than humans. Introducing Notch." (~692k view, sản phẩm đã live).

**Ecom / DTC:**
- [BuccoCapital: Amazon chặn Muse](https://twitter.com/i/status/2102012446600794222) (21/09, 5.9M view): cùng một agent nhưng Amazon và Shopify có chính sách ngược nhau. Shopify đáp lại ngày 24/09 bằng Shop Pay wallet.
- [Tech Brew: hai tuần đầu của Muse](https://twitter.com/i/status/2102488339412660495): #1 US App Store, 2,8M lượt tải, 642k DAU, 95% trùng user với Facebook, partner commerce là Shopify và PayPal.
- [Toby Waller: bài toán attribution nhiều dashboard](https://x.com/TobyWalleruk/status/2103122864199135525): chạy 40 ads, bốn dashboard khác nhau, sáng sớm nhận Slack báo ROAS 0.2. Việc Meta/Shopify/GA4 không khớp nhau vẫn gây tắc vận hành.
- [Common Thread Collective: chiến lược launch TikTok Shop](https://x.com/CommnThreadCo/status/2102858613794427260): cho 100 creator đăng cùng một buổi sáng hiệu quả hơn đăng rải rác.
- [Guillermo Rauch: phân bổ chi tiêu AI Gateway](https://twitter.com/i/status/2103216656747262419): thị phần spend của Anthropic giảm từ 69% xuống 40% trong 2 tháng, OpenAI tăng từ 10% lên 24%, Opus 5.5 chiếm 10% sau 2 ngày.

**Shopify SaaS community:**
- [Katarina Batina: film về admin redesign](https://twitter.com/i/status/2103161312901816394): 859 like, 106k view. Account Shopify đăng: "Spotted: the admin got a refresh."
- **Regy (Shopify Design)** (không có link): quote-tweet nói sẽ tiếp tục chỉnh sửa sau khi launch.
- [Stan P: SelfServe đạt Built for Shopify](https://x.com/stan_peev/status/2103151105991438712): đạt được nhờ "sitting in merchants' stores", không cần ngân sách marketing lớn.
- [Odera Joseph: Events complexity](https://twitter.com/i/status/2103254260771111051): subscription kéo cả product + mọi variant khi giá đổi sẽ vỡ ở giới hạn 100 điểm mới.
- [Wade Sonenberg: rebase analytics shipping + duty](https://x.com/SkinnyWaterApps/status/2103107136486015453): nhắc phải đặt lại baseline trước khi so sánh các kỳ.
- [John Speed: App Store Ads ROI đảo chiều](https://x.com/John_Speed/status/2103208304474210455): thuê chuyên gia, trả vài nghìn đô, lượt install lại giảm 83,3%.

**Culture → commerce:**
- **TikTok Shop ở quy mô retailer:** eMarketer dự báo doanh số TikTok Shop US năm nay đạt $23,41B (+48% YoY), lớn hơn ecommerce US của từng hãng Target/Costco/Best Buy/Kroger. [MarketMaze](https://www.marketmaze.me/p/tiktok-shop-us-online-share) (21/09): chiếm ~2% bán lẻ online US trong dữ liệu thẻ tháng 7.
- **[Sephora Drop Shop](https://newsroom.sephora.com/sephora-launches-on-tiktok-shop-bringing-a-new-beauty-shopping-experience-to-u-s-customers-with-its-sephora-drop-shop/)** (19/09): mỗi tháng drop độc quyền một brand trên TikTok Shop, có teaser và LIVE do người nổi tiếng dẫn. TikTok LIVE đã thành khung giờ launch cho mảng beauty cao cấp.
- **Boots (UK)** lên TikTok Shop ngày 28/09 với shopfront No7. **Best Buy** ~10.000 SKU, cuối tháng 10.
- **[Made On YouTube](https://blog.youtube/news-and-events/made-on-youtube-creator-monetization-shopping/)** (23/09): Ask YouTube thành trợ lý mua sắm, trả về bảng so sánh sản phẩm. 140M người dùng Ask YouTube trong tháng 6, GMV affiliate shopping tăng 13 lần trong 2 năm, 1,3M creator tham gia, mở rộng ra 35 nước. Xem thêm bài trên [TechCrunch](https://techcrunch.com/2026/09/23/youtube-doubles-down-on-video-shopping-with-ai-powered-ask-youtube-feature/).

## 👽 On Reddit
- **r/shopify, r/shopifyDev, r/ecommerce:** cả ba đều trả `NO_POSTS_IN_WINDOW` (hot + new). Lần kiểm tra lại old.reddit.com/r/shopify/hot/ trả HTTP 302 với body rỗng, tức là fetch lỗi chứ không phải subreddit im ắng. Hôm nay không có tín hiệu Reddit.

## 🧭 Analysis & Commentary
- **Cuộc chiến giá model frontier:** Opus 5.5 rẻ hơn Opus 5 khoảng 40% với workload agent. Dữ liệu Vercel cho thấy chi tiêu đang dịch chuyển giữa các model. Kimi K3 và DeepSeek chiếm khoảng 50% phần thị phần Anthropic bị mất.
- **"The model war is a capacity war with a talking head on top":** Google phản công bằng Gemini 3.8 Live Avatar (có watermark SynthID). Theo The Information, DeepSeek đã vượt $1B ARR và đang gọi vốn $7,5B tại Thượng Hải trước cuối tháng 10. Akamai cam kết cung cấp compute cho Anthropic trị giá $11,6B trong 7 năm.
- **AI Engineer (2 tuần gần đây):** các talk nổi bật xoay quanh memory, search, harness. WATCH: *Homa: The End of TCP for AI Clusters* (John Ousterhout, 169,2k view) và *The Unreasonable Effectiveness of BM25 for Agentic Search* (Jo Kristian Bergum, 57,8k view). HOT: Knowledge Agents (Benjamin Clavié), Stop Chunking Like It's 2022 (Yuval Belfer), Total Recall: Agent Memory & Harness Engineering (Ignacio Martinez), Document Context Layer for AI Agents (Jerry Liu), The Dark Arts of Skill Engineering (Paul Bakaus), Frontier AI Inference Cloud for Agents (Byung-Gon Chun), Weight Folding & CUDA Streams (Filip Makraduli), Connect AI to Billions of Legal Documents (Simon Eskildsen & Jacob Lauritzen), What's New in Inference Engineering (Philip Kiely), Where RL Will Take Search (Maximilian-David Rumpf). Digest không kèm link.
- **Operators & Chase:** Operators có một video HOT là "three CEOs on failure" (7.102 view), thêm tape Black Friday với bốn operator doanh thu 9 chữ số (4.459 view) và tập Alice Li / First Day (1.203 view). Chase có một video HOT là "Learn 97% of Claude for Meta in 10 Minutes" (9.928 view).
- **Kết luận của digest:** "The agents are already at the register". Tuần từ 21/09 có Muse + Shop Pay, admin refresh, rebase analytics, Events limit. Còn 6 ngày trước khi API 2026-10 lên stable.

## 💡 Liên quan Joy Loyalty
- **Polaris 2.0 RC (deadline BFS 01/05/2027):** admin Joy đang chạy Polaris sẽ trông lệch với admin mới cho tới khi load `polaris-2-0-rc.js`. Cần lên kế hoạch migrate và test UI embedded App Home, nhất là khi app đang giữ badge Built for Shopify.
- **API `2026-10` stable ngày 01/10 + `Metafield.translatable`:** kiểm tra các query orders/metafields trước khi pin version. Nếu Joy đang dùng `translatableResources` với type `METAFIELD` cho widget đa ngôn ngữ thì có thể chuyển sang field mới.
- **Shop Pay trong Meta Muse (checkout bằng agent):** đơn hoàn tất trong chat vẫn là order Shopify, nên luồng tính điểm qua webhook orders vẫn hoạt động. Tuy vậy khách sẽ không thấy widget loyalty hay đổi reward ở storefront, đáng theo dõi xem điểm được hiển thị và đổi thế nào qua kênh agentic.
