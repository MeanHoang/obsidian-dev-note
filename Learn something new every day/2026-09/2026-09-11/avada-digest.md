# 📰 AVADA Digest — 2026-09-11

> Nguồn: [digest.avada.net/d/2026-09-11](https://digest.avada.net/d/2026-09-11) · Đáng chú ý nhất: Shop app được Shopify viết lại native (Swift/Kotlin) trong 12 tuần nhờ coding agents, cùng loạt deadline API 2026-10 và script tag deprecation chốt ngày 01/10/2026.

## ⏰ Deadlines
- **Ngay bây giờ:** Discounts Allocator Function đã bị gỡ khỏi unstable Admin GraphQL — app dùng `purchase.discounts-allocator.run` sẽ fail deploy hoàn toàn; `discountsAllocatorFunctionRegister`/`Unregister` không còn. Thay bằng native product discount stacking.
- **01/10/2026:** API version 2026-10 lên stable — breaking changes ở order tax handling, sửa discount trên draft order, metafield filtering, tax payload identifiers, Customer Account checkout modifications. Ảnh hưởng app OMS, tax, subscription, customer-account.
- **01/10/2026:** Script tag deprecation bắt đầu — `scriptTagCreate`/`scriptTagUpdate` và REST endpoints bắt đầu từ chối request ở mọi API version; script tag đang tồn tại vẫn chạy tới 01/03/2027. Ảnh hưởng mọi app inject JavaScript vào storefront.
- **01/10/2026:** Theme CLI authentication đổi với shop có password — Shopify CLI 3.83.x trở về trước mất khả năng auth; phải lên 3.84.0+ (bản hiện tại 4.8).
- **Mới (CLI 4.8):** Giới hạn **250 dev stores / Dev Dashboard organization**. Client transfers và collaborator stores không tính vào hạn mức; org vượt 250 được cấp extended allowance. Ảnh hưởng agency hay tạo dev shop tạm.
- **Chưa có ngày gỡ:** `ProductVariant.barcode` deprecated, thay bằng `barcodes` connection (tối đa 20 mã/variant: GTIN/UPC/EAN/ISBN/ASIN). Đọc/ghi single barcode vẫn chạy nhưng bị truncate các mã dư.
- **Customer Account API 2026-10:** `territoryCode` deprecated, thay bằng `countryCode` (ISO 3166-1 alpha-2). Cả hai còn dùng được, `countryCode` được ưu tiên nếu gửi cả hai.

## 🛒 Shopify This Week
### Official news
- **Shopify.com/News (cửa sổ 7 ngày)** — Không có bài newsroom mới; bài gần nhất từ 13/08.

### Changelog
- **10/09 — WhatsApp marketing consent at checkout** — Thu opt-in trên trang thank-you, dùng cho Shopify Messaging campaigns; bật trong Checkout settings. [Merchant changelog](https://changelog.shopify.com/posts/collect-whatsapp-marketing-consent-at-checkout)
- **10/09 — Discounts Allocator Function API preview kết thúc** — Preview đóng, API bị gỡ khỏi unstable.
- **10/09 — Chi tiết release candidate 2026-10** — Công bố danh sách breaking changes cho bản stable 01/10.
- **10/09 — Shop Campaigns mở rộng quốc tế** — Chạy tới 35+ thị trường mới từ một campaign duy nhất.
- **09/09 — Dev store CLI commands** — `shopify store create dev`, `store delete`, `store list`, `store info`; dùng được từ terminal lẫn agent. [Changelog](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli)
- **08/09 — Multiple barcodes cho product variants** — Ghi qua `productSet`, `productVariantsBulkCreate`, `productVariantsBulkUpdate`; không được gửi đồng thời `barcode` và `barcodes`.
- **08/09 — Meta thành AI channel trong admin** — Meta vào Agentic Storefronts cùng ChatGPT, Copilot, Google AI Mode, Gemini; sản phẩm trong Catalog tự động share với merchant ship về US.
- **08/09 — Customer Address APIs hỗ trợ countryCode** — Thay dần `territoryCode`.
- **04/09 — Hỗ trợ UCP 2026-08-25** — Storefront protocol lên version mới, discovery profile công bố tại `/.well-known/ucp`; merchant không cần cấu hình gì.

### Developer updates
- **Shopify CLI 4.8** — Bộ lệnh quản lý store từ terminal/agent, kèm cap 250 dev stores mỗi org.
- **Barcodes connection** — Migration path khỏi `ProductVariant.barcode`, hỗ trợ nhiều loại mã.
- **API 2026-10 RC** — Nên test sớm các app đụng tax, draft order discount, metafield filter, customer account checkout.

## 🚀 Launches
- **[Shop app, native](https://shopify.engineering/back-to-native)** (Shopify, 10/09) — Viết lại Shop app bằng Swift/Kotlin native trong 12 tuần với sự hỗ trợ của agents. Thêm: [migration details](https://shopify.engineering/shop-app-migration) · [The New Stack](https://thenewstack.io/shopify-native-ai-agents/)
- **[Cursor Projects](https://cursor.com/blog/projects)** (Cursor, 10/09) — Coordinator agent quản lý context xuyên nhiều tháng; user mới merge nhiều hơn 30% PR, user dùng hằng ngày tăng 6×.
- **[ChatGPT for Financial Services](https://openai.com/index/introducing-chatgpt-financial-services/)** (OpenAI, 10/09) — Bản ChatGPT chuyên ngành tài chính, tích hợp dữ liệu PitchBook.
- **[WhatsApp consent at checkout](https://changelog.shopify.com/posts/collect-whatsapp-marketing-consent-at-checkout)** (Shopify, 10/09) — Thu consent marketing WhatsApp ngay tại checkout.
- **[Tailwind Labs](https://tailwindcss.com/blog/tailwind-is-joining-shopify)** (Adam Wathan / Shopify, 09/09) — Tailwind gia nhập Shopify.
- **[Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)** (Meta, 08/09) — Personal AI agent của Meta, đồng thời là bề mặt checkout mới.
- **[Shopify CLI 4.8 store commands](https://shopify.dev/changelog/create-and-delete-dev-stores-in-shopify-cli)** (09/09) — Tạo/xoá/liệt kê/xem thông tin dev store bằng CLI.
- **[Nvidia × Hugging Face](https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/)** (03/09) — Nvidia mua lại Hugging Face (12,93 tỷ USD).
- **[Mistral Series D](https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/)** (08/09) — Vòng gọi vốn 3 tỷ EUR cho sovereign open-weight AI.

## 📦 GitHub Trending
**Hôm nay:** `ayghri/i-have-adhd` — output coding agent thân thiện ADHD · `bilawalsidhu/gods-eye-view` — satellite simulator với 3D globe · `obra/superpowers` — framework agentic skills · `alsk1992/CloddsBot` — AI trading agent · `Tencent/teamai-cli` — công cụ điều phối team AI · `AlexsJones/llmfit` — kiểm tra tương thích model/provider · `liquidslr/system-design-notes` — ôn phỏng vấn system design · `cathrynlavery/diagram-design` — template diagram kiểu editorial · `freestylefly/awesome-gpt-image-2` — bộ prompt GPT Image · `diegosouzapw/OmniRoute` — AI gateway 1.200+ model · `THU-MAIC/OpenMAIC` — nền tảng lớp học multi-agent · `vastsa/PI-Desktop` — desktop coding agent chạy local · `vercel-labs/skills` — công cụ open agent skills · `JustVugg/colibri` — chạy frontier MoE model · `nashsu/llm_wiki` — chuyển document thành knowledge base · `armory3d/armorpaint` — 3D painting mã nguồn mở.

**Tuần này:** `mattpocock/skills` — thư mục skills cho engineer · `tt-a1i/archify` — skill vẽ architecture diagram · `DietrichGebert/ponytail` — chặn sinh code thừa · `affaan-m/ECC` — agent harness toàn diện · `blader/humanizer` — xoá dấu vết văn phong AI · `heygen-com/hyperframes` — render HTML thành video · `microsoft/markitdown` — chuyển file sang Markdown · `NousResearch/hermes-agent` — adaptive agent framework · `anomalyco/opencode` — coding agent mã nguồn mở · `coreyhaines31/marketingskills` — skills marketing ecommerce · `anthropics/skills` — catalog Claude Agent Skills · `every-app/open-seo` — bản thay thế Semrush · `ruvnet/ruflo` — meta-harness multi-agent swarm · `mksglu/context-mode` — tối ưu tool trong sandbox · `openai/skills` — catalog skills cho Codex · `openai/plugins` — repo OpenAI Plugins · `fmtlib/fmt` — thư viện formatting C++ · `ChromeDevTools/chrome-devtools-mcp` — DevTools cho agent.

**Shopify org (push gần đây):** `Shopify/tapioca` — sinh RBI cho Sorbet · `Shopify/theme-tools` — DX cho theme dev · `Shopify/vscode-shopify-ruby` — extension pack Ruby · `Shopify/theme-liquid-docs` — reference Liquid · `Shopify/cibuildgem` — phân phối binary precompiled · `Shopify/bluejay` — GraphQL tools cho Rust.

## 🐦 On X — SaaS, Ecom, DTC
- **SaaS:** **Cursor Projects** — coordinator agent; user mới merge nhiều hơn 30% PR, user dùng hằng ngày tăng 6×.
- **Ecom/DTC:**
  - **Shop is native** — rebuild Swift/Kotlin trong 12 tuần bằng agents; bản merchant app sẽ ra sau.
  - **Shop Campaigns international** — 35+ thị trường mới từ một campaign.
  - **Balmain lên Shopify** — nhà mốt Paris 80 năm tuổi replatform.
  - **Muse thành bề mặt checkout** — merchant US Catalog live ngay trong buổi chiều công bố.
  - **Sephora Drop Shop pilot** — ra mắt TikTok Shop US ngày 19/09, drop hằng tháng kèm celebrity LIVE.
  - **TikTok Shop Malaysia** — 100 triệu lượt search/ngày, sales tăng 140%.
  - **Bain holiday forecast** — 1 nghìn tỷ USD bán lẻ tháng 11-12; 24% người tiêu dùng bắt đầu hành trình mua từ ChatGPT/Gemini/Claude.
- **Shopify community:**
  - **Adam Wathan / Tailwind** — post 15,5k like; Tailwind vốn được tách ra từ sản phẩm checkout năm 2017.
  - **Harley nói về Muse** — "Nếu sản phẩm của bạn ở trong Shopify Catalog và ship về US? Bạn đã có mặt."
  - **Shopify × ChatGPT** — tích hợp vào bộ plugin cho doanh nghiệp nhỏ.
  - **Built for Shopify reviews** — founder Monk mô tả 2026 là "trải nghiệm tệ nhất".
  - **Mat De Sousa** — hướng dẫn dọn dẹp listing trên App Store.
  - **Nate Esparza** — tích hợp X Ads với Shopify kèm tính năng Grok/Mentions/Lead Gen.

## 🎭 Culture → Commerce
- **Merch Honey Deuce của US Open** — áo baby tee 52 USD gần cháy hàng; sweatshirt Polo 200 USD hết sạch trong vài giờ.
- **Hoodie Rotten Mango** — từ khoảnh khắc trên Netflix thành hàng chờ trên Shopify; hoodie 29 USD hết trong vài phút.
- **Sephora Drop Shop** — định dạng lịch drop merch beauty cao cấp, khởi động 19/09.

## 👽 On Reddit
- Không lấy được signal Reddit hôm nay — old.reddit.com trả về network policy block cho r/shopify, r/shopifyDev và r/ecommerce.

## 🧭 Analysis & Commentary
- Coding agents đang rút ngắn mạnh timeline phát triển — bằng chứng là bản rewrite Shop app của Shopify chỉ mất 12 tuần.
- Coordinator agent (Cursor Projects) quản lý context xuyên nhiều tháng mà không chặn luồng làm việc.
- Agent cho ngành tài chính đòi hỏi dữ liệu chất lượng "catalog-grade" — tích hợp PitchBook của OpenAI là tín hiệu về yêu cầu tương tự cho ecommerce.
- Dòng vốn sovereign AI tăng tốc: Mistral 3 tỷ EUR, Nvidia mua Hugging Face 12,93 tỷ USD.
- Repo agent skills trending trên mọi nền tảng; hai ràng buộc chung đang nổi lên: "đừng viết code bạn không cần" (ponytail) và output thân thiện ADHD.

## 💡 Liên quan Joy Loyalty
- **Script tag deprecation 01/10/2026** là rủi ro trực tiếp: nếu Joy còn inject JS storefront qua `scriptTagCreate`/REST, phải chuyển sang theme app extension trước hạn (tag cũ chỉ sống tới 01/03/2027).
- **API 2026-10 stable 01/10/2026** đụng order tax, draft-order discount và Customer Account checkout — phần discount/redeem điểm và store credit của Joy cần test trên release candidate ngay bây giờ; kèm `territoryCode` → `countryCode` trong Customer Account API nếu Joy đọc địa chỉ khách.
- **Discounts Allocator Function bị gỡ ngay lập tức** — nếu bất kỳ function nào của Joy dùng `purchase.discounts-allocator.run` thì deploy sẽ fail; phải chuyển sang native product discount stacking.
- **WhatsApp marketing consent at checkout + Shopify Messaging** mở kênh mới cho retention campaign, đáng cân nhắc như điểm chạm bổ sung bên cạnh email/SMS của loyalty program.
