# 📰 AVADA Digest — 2026-09-17

> Nguồn: [digest.avada.net/d/2026-09-17](https://digest.avada.net/d/2026-09-17) · Đáng chú ý nhất hôm nay: ChatGPT Ads for Shopify chính thức lên App Store (Shopify là đối tác ecommerce đầu tiên) + loạt breaking change trong Events API và admin redesign mà app dev phải xử lý ngay.

## ⏰ Deadlines
- **16/09:** Events payloads, cú pháp trigger và delivery headers đã đổi — `fields_changed` không còn là mảng phẳng; mọi app đang subscribe webhook/events phải sửa parser (shopify.dev/changelog).
- **15/09:** Giao diện mới của Shopify admin đang rollout — app embedded phải kiểm tra lại UI để hoà hợp với frame/màu/typography mới (changelog.shopify.com & shopify.dev).
- **10/09:** Discounts Allocator Function API đã bị gỡ (hết preview) — app discount dùng API này phải migrate (shopify.dev/changelog).
- **23/09:** ChatGPT Ads app mở rộng quốc tế (openai.com & apps.shopify.com/chatgptads).

## 🛒 Shopify This Week

### Official news
- **15/09 — A new look for the Shopify admin** (changelog.shopify.com) — "New color, type, spacing, and icons inside a new frame", cải tiến navigation và interface trên dashboard merchant.
- **14/09 — Keep the cart in view on mobile POS** (changelog.shopify.com) — nút cart cố định trên điện thoại: item vừa thêm, số lượng, tổng tiền, xem được từ Home/Products/Orders/Search.
- **11/09 — Multi-currency payouts in Australia and France** (changelog.shopify.com) — merchant đủ điều kiện nhận tiền bằng 13 loại tiền tệ (AU) và 18 (FR).
- **11/09 — Shopify Retail Roundup for August POS** (shopify.com/blog) — tổng hợp thay đổi POS tháng 8.
- **10/09 — Collect WhatsApp marketing consent at checkout** (changelog.shopify.com) — lấy opt-in ngay lúc khách thanh toán, rồi gửi campaign trong Shopify Messaging.
- **10/09 — Shop Campaigns going international** (x.com/Shopify & shopify.com/shop-campaigns) — Shop Campaigns mở rộng ra ngoài thị trường ban đầu.

### Changelog / Developer updates
- **16/09 — Updates to Events payloads and subscription configuration** — `fields_changed` giờ là `{added, updated, removed}` thay vì mảng phẳng, kèm cú pháp trigger mới; breaking change lớn nhất tuần.
- **15/09 — Filter Catalog search results by media type** — `search_catalog`, `get_product`, `lookup_catalog` giờ trả cả video và 3D model (trước chỉ ảnh).
- **15/09 — Prepare your app for the Shopify admin's new look** — hướng dẫn app dev chỉnh giao diện embedded cho khớp admin mới.
- **15/09 — Dynamic complexity cost for metafieldsSet** — trước là 10 điểm cố định, giờ là `10 + Σ(distinct owners × type weight)`; app ghi metafield hàng loạt phải tính lại rate limit.
- **15/09 — Delivery options in Shopify Functions now expose metafields** — từ API `2026-10`, gọi được `metafield(namespace:, key:)` trên mọi option trong `cart.deliveryGroups.deliveryOptions`.
- **15/09 — family_name is optional for B2B orders** — bớt ràng buộc dữ liệu khách B2B.
- **10/09 — Discounts Allocator preview ended** — API preview kết thúc, phải chuyển hướng triển khai discount.

## 🚀 Launches
- **[ChatGPT Ads for Shopify + Sponsored Agents](https://apps.shopify.com/chatgptads)** (OpenAI, 16/09) — Shopify là "first ecommerce partner"; merchant sync catalog và chạy campaign ngay trong admin.
- **One Claude, Claude Docs, Claude Slides** (Anthropic, 16/09) — Chat và Cowork gộp làm một giao diện, Claude tự chọn độ sâu công việc từ bất kỳ hội thoại nào.
- **[Macaly Cloud](https://macaly.com/cloud)** (Petr Brzek, 16/09) — hạ tầng cho vibe-coding không cần agent thứ hai: database, auth, hosting, domain, payments, SEO, analytics.
- **[AI Autocomplete for Shopify](https://apps.shopify.com/ai-autocomplete)** (MagicX, 15/09) — biến ô search của store thành bộ lọc gõ tay dựa trên catalog, cài 1 click từ App Store.
- **Gemini 3.8 Live và 3.8 Live Extended Thinking** (Google DeepMind, 15/09) — speech-to-speech native: Live cho quy mô lớn, Extended Thinking vừa nói vừa suy luận nhiều bước.
- **Raptor 0.6** (Osaurus, 16/09) — model agent chạy local 3.7 GB cho Mac 8–16 GB, miễn phí.

## 📦 GitHub Trending
**Hôm nay:** `alibaba/open-code-review` — pipeline lai + LLM agent, comment theo dòng, quy mô Alibaba · `cloudflare/security-audit-skill` — skill cho coding agent chạy security audit nhiều pha, kết quả máy đọc được · `JustVugg/colibri` — chạy model MoE frontier trên phần cứng sẵn có, viết C thuần, stream expert từ disk · `abue-ammar/tinycast` — launcher macOS native nhỏ gọn, hotkey + lịch sử clipboard · `alphaXiv/OpenResearch` — biến coding agent thành research agent · `Tencent/WeKnora` — nền tảng knowledge LLM mã nguồn mở: RAG, reasoning agent, wiki tự bảo trì · `NationalSecurityAgency/ghidra` — framework reverse engineering của NSA · `affaan-m/ECC` — hệ thống tăng hiệu năng agent harness (skills, instincts, memory, security) cho Claude Code/Codex · `ever-co/ever-gauzy` — nền tảng quản trị doanh nghiệp mở (ERP/CRM/HRM/ATS/PM) · `addyosmani/agent-skills` — bộ skill engineering cấp production cho AI coding agent · `Lakr233/vphone-cli` — CLI cho workflow điện thoại ảo · `jamiepine/voicebox` — studio giọng nói AI mở: clone, dictate, sáng tạo · `SnailSploit/Claude-Red` — skill offensive security cho hệ skill của Claude · `anthropics/knowledge-work-plugins` — plugin mở cho knowledge worker khi Cowork gộp vào chat.

**Tuần này:** `ayghri/i-have-adhd` — skill ngăn agent vòng vo che mất câu trả lời · `bilawalsidhu/gods-eye-view` — giám sát vệ tinh trên quả cầu 3D photoreal trong trình duyệt · `DietrichGebert/ponytail` — skill khiến agent nghĩ như senior lười: code tốt nhất là code không viết · `obra/superpowers` — framework skill cho agent · `TauricResearch/TradingAgents` — framework trading tài chính multi-agent LLM · `blader/humanizer` — skill xoá dấu vết văn phong AI · `THU-MAIC/OpenMAIC` — lớp học multi-agent một click · `github/spec-kit` — bộ công cụ phát triển theo spec · `microsoft/markitdown` — chuyển file Office sang Markdown · `heygen-com/hyperframes` — render HTML thành video cho agent · `petergyang/no-ai-slop` — loại bỏ 20+ mẫu văn phong AI · `mksglu/context-mode` — sandbox output tool cho coding agent · `danny-avila/LibreChat` — bản clone ChatGPT có agents, MCP, skills · `max-sixty/worktrunk` — CLI git worktree cho workflow agent song song · `kunchenguid/firstmate` — nói chuyện với 1 agent, ship bằng cả team · `openai/plugins` — plugin OpenAI · `openai/skills` — catalog skill cho Codex.

**Shopify org (7 ngày):** `Shopify/liquid` — template language phía khách hàng · `Shopify/remote-dom` — primitive remote UI cho admin extension · `Shopify/cli` — tooling cho app, theme, Hydrogen · `Shopify/extensions-templates` — template khởi tạo extension admin/checkout/POS · `Shopify/type_toolkit` — khái niệm type runtime nhẹ.

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** [Macaly Cloud](https://x.com/PetrBrzek/status/2100231804032610657) — Petr Brzek tuyên bố "RIP other vibe coding platforms" (749 like) · [AI Autocomplete for Shopify](https://x.com/bradkowalk/status/2099897698006737261) — Brad Kowalk, cài 1 click biến search thành filter theo catalog (482 like) · [Raptor 0.6](https://x.com/OsaurusAI/status/2100300189668118706) — model agent local 3.7 GB cho Mac 8–16 GB, free.
- **Ecom/DTC:** Magnesium chiếm ngôi đầu TikTok Shop tháng 8 — Toplux Magnesium Complex đạt 2,36 triệu USD trên 155.090 đơn vị, kết thúc 4 tháng thống trị của medicube; Shark quay lại bảng, máy làm đồ uống đông lạnh của Ninja lên hạng (Net Influencer, 16/09) · [Has anyone actually had an order from an agent?](https://x.com/the_rl_beowulf/status/2099831144640369090) — WebMCP đã bật mặc định trên mọi storefront Liquid, Salesforce có checkout trong chat, nhưng một builder chăm chút PDP vẫn chưa thấy đơn từ agent; nút thắt là đưa agent tới store · [Digital products still ship like parcels](https://x.com/HeySukhwinder/status/2100220382825292208) — mua sản phẩm số 29 USD vẫn nhận mail "đơn đang trên đường, chờ 5–10 ngày"; merchant bán membership/khoá học trên fulfillment mặc định bị ảnh hưởng · Salesforce Commerce Cloud sẽ cho mua sắm ngay trong Google Search và Gemini từ tháng 10 (Agentforce Commerce LinkedIn) · Forever 21 tái dựng ecommerce quốc tế với Global-e — sau phá sản, localize 95+ tiền tệ và 21 ngôn ngữ checkout, đóng phần lớn cửa hàng vật lý ở Á, Âu, Canada (Marketing-Interactive) · Sephora Drop Shop lên TikTok Shop (pilot Mỹ 19/09) — drop độc quyền hàng tháng, LIVE cùng người nổi tiếng, SKU sau đó về sephora.com.
- **Shopify community:** [Built for Shopify, meet the new admin](https://x.com/stan_peev/status/2100213476551520266) — app đang giữa vòng review đòi hoà hợp với admin, mà admin vừa đổi giao diện · [Shopify CTO shout-out](https://x.com/MParakhin/status/2100359721987285484) — Mikhail Parakhin gọi Applied Compute là "best actual post-training/finetuning company" · [ChatGPT Ads app đã có review](https://apps.shopify.com/chatgptads) — listing lên từ 03/09, một reviewer báo app không chạy, OpenAI trả lời cần setup server pixel · [Specs × Shopify Catalog in AR](https://x.com/greengart/status/2100366652793557483) — Specs hợp tác Shopify đưa catalog toàn cầu (kèm 3D nếu có) vào tầm nhìn, đúng ngày Catalog hỗ trợ trả 3D model · [AppQuest](https://x.com/MMSUCK1/status/2100162080741453903) — khoá học app Shopify tiếng Nhật về Built for Shopify, công khai 25/09.

## 🎭 Culture → Commerce
- **Magnesium ngủ ngon giờ là một category, không phải bài viết wellness** — Toplux 8-in-1 đạt 2,36 triệu USD trên TikTok Shop tháng 8 (155.090 đơn vị, 15,23 USD, hoa hồng 25%): có tên, có ngày, có chuyển đổi — lặp lại mô hình protein coffee.
- **Ninja SLUSHi và Shark quay lại cùng bảng tháng 8** — các form-factor gadget (đồ uống đông lạnh, gia dụng) chuyển đổi tốt trên TTS với thứ hạng cụ thể, không phải theo "vibe".
- Túi xách in hình đồ ăn xuất hiện ở tín hiệu semantic nhưng chưa có mốc sold-out nào.
- Sephora Drop Shop mới là phần dựng bối cảnh, khởi động 19/09, chưa có số doanh thu.

## 👽 On Reddit
- Không lấy được tín hiệu Reddit hôm nay — r/shopify, r/shopifyDev, r/ecommerce đều trả HTTP 403.

## 🧭 Analysis & Commentary
- Thay đổi hình dạng payload trong developer changelog sẽ khiến dev bị gọi gấp; breaking change của Events API là thứ tác động mạnh nhất.
- Catalog trả về video và 3D model khớp với chiến lược ChatGPT Ads của OpenAI cho mua sắm do agent điều khiển.
- Việc Anthropic gộp Cowork vào chat thống nhất là nước đi cạnh tranh với bề mặt office của Gemini trong mảng knowledge work.
- Câu "RIP other vibe coding platforms" cho thấy thị trường đang hợp nhất quanh các nhà cung cấp hạ tầng.
- OpenAI công bố framework báo cáo misalignment cùng lúc với công cụ cho merchant, thể hiện định vị safety-first.

## 💡 Liên quan Joy Loyalty
- **Events API breaking change (16/09) là việc phải làm ngay:** Joy nghe webhook order/customer để cộng điểm; `fields_changed` đổi từ mảng phẳng sang `{added, updated, removed}` sẽ làm logic parse hiện tại sai lặng lẽ — cần rà toàn bộ handler trên Cloud Run/Firebase Functions.
- **Admin redesign (15/09) + tiêu chí Built for Shopify:** UI embedded của Joy (React + Polaris) cần kiểm tra lại với frame/màu/typography mới; bài "Prepare your app for the Shopify admin's new look" là checklist trực tiếp.
- **Dynamic complexity cost cho `metafieldsSet`:** Joy ghi metafield cho member/tier hàng loạt — chi phí giờ là `10 + Σ(distinct owners × type weight)`, nên batch job đồng bộ điểm có thể đụng rate limit nếu không chia nhỏ theo owner type.
- **WhatsApp consent tại checkout + Shop Campaigns quốc tế:** mở thêm kênh nhắc đổi điểm/nhắc tier ngoài email, đáng cân nhắc cho retention flow.
