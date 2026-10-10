# 03 – Đối thủ

Thuộc [[00 - Tổng quan]]. Note gồm: **phần Shopify** (đầu note) và **phần các nền tảng khác** (cuối note: WooCommerce, Wix, BigCommerce, Squarespace, Magento).

## Tóm tắt theo nền tảng

| Nền tảng | Mức đông của app "AI-ready dữ liệu" | Đã có công cụ kiểm tra độ đầy đủ dữ liệu, thử hỏi? |
|---|---|---|
| Shopify | **Rất đông**: ít nhất 15 app mới năm 2026, cộng Shopify tự làm | Có (Verity Score, AI Catalog Score, beFound, Datify…) |
| **WooCommerce** | Plugin SEO lớn gắn nhãn "AI"; khoảng 15 plugin llms.txt; plugin agent dưới 100 lượt cài | **Không thấy** |
| Wix | Khoảng 10 app "AI visibility" mới, hầu hết 0 đánh giá | Không thấy |
| BigCommerce | Vài app; **nền tảng tự bán** bổ sung dữ liệu | Nền tảng tự làm |
| Squarespace | Ít; nền tảng tự đo lượt nhắc | Không thấy |
| Magento | 24 extension "llms", 74 "ai seo" (chưa xem tên) | Chưa rõ |

# Phần Shopify

Quét Shopify App Store ngày 2026-10-10 với 25 từ khoá (ai seo, geo, llms.txt, chatgpt, agentic, ai ready, schema, json-ld, product description ai, metafields ai, category metafields, product taxonomy, catalog enrichment, product feed, knowledge base…), đọc khoảng 45 trang app và đánh giá 1–3 sao của 14 app.

> Số đánh giá, giá, ngày ra mắt lấy từ trang app. Lượt cài lấy từ Store Leads (nhiều app mới không có). 💭 = nhận định AI.

## Tóm tắt

- **Đông lên rất nhanh:** từ 02/2026 tới 09/2026 có **ít nhất 15 app** "kiểm tra và sửa cho AI" ra mắt, phần lớn 0–20 đánh giá.
- **Shopify tự làm nhiều thứ miễn phí** (nhóm F).
- Các bộ SEO lớn (Avada khoảng 50.000 lượt cài, Booster khoảng 40.000) đã gắn thêm nhãn "AEO", "AI readiness".

---

## A. App "AI SEO, AI-ready" (gần nhất với ý tưởng)

| App | Đánh giá | Ra mắt | Giá (USD/tháng) | Làm gì |
|---|---|---|---|---|
| [AgentIQ](https://apps.shopify.com/fourty-ai) | 5,0 (18) | 10/2025 | 49 / 149 / 499 / 799 | Bổ sung thuộc tính, danh mục, FAQ; "Adapt your FAQs & Policies for agents"; theo dõi xếp hạng trong Shopify Catalog |
| [**Verity Score**](https://apps.shopify.com/verity-score) | 5,0 (2) | 06/2026 | 0 / 39 / 149 / 449 | 📖 "Find the buyer questions your product pages cannot answer yet" (tìm câu hỏi khách mà trang sản phẩm chưa trả lời được); kiểm tra sản phẩm, trang, chính sách, schema; mô phỏng khách hỏi; xem trước, duyệt, hoàn tác 30 ngày; kiểm tra lại. **Gần nhất với ý tưởng** |
| [AgentReady](https://apps.shopify.com/agentreadyapp) | 5,0 (7) | 02/2026 | 0 / 9 / 29 / 79 | Kiểm tra sản phẩm, biến thể, giá, giao hàng, đổi trả, FAQ; duyệt trước khi áp dụng; schema, llms.txt; hoàn tác; quét lại để xác minh |
| [AI Catalog Score](https://apps.shopify.com/ai-catalog-score) | 0 | 05/2026 | 0 / 49 / 149 / 399 | Chấm tiêu đề, mô tả, alt, metafield; "AI Query Simulator"; sửa hàng loạt; hoàn tác 30 ngày; thử A/B; công khai cách chấm trên GitHub |
| [Agentic Fuel](https://apps.shopify.com/agent-fuel) | 5,0 (4) | 09/2026 | 0 / 29 / 99 / 149 | Điền danh mục, thuộc tính, cách dùng, FAQ, thông số; JSON-LD; đếm số lần AI nhắc thương hiệu |
| [Kedra](https://apps.shopify.com/kedra-ai-index) | 4,9 (48) | 04/2026 | 0 / 25 / 79 / 199 | Thử câu hỏi khách trên ChatGPT, Gemini; điểm sẵn sàng; sửa khi được duyệt; llms.txt |
| [ShopRank AI](https://apps.shopify.com/shoprank-ai) | 4,7 (38) | 12/2025 | 0 / 9,99 mỗi 100 sản phẩm | Điểm 17 yếu tố; AI sửa tiêu đề, mô tả; JSON-LD; doanh thu từ AI. 248 lượt cài |
| [AI Visibility (Yumnaz)](https://apps.shopify.com/ai-visibility-8) | 5,0 (2) | 08/2026 | 0 / 49 / 149 | Viết lại mô tả 📖 "using only real product data" (chỉ dùng dữ liệu thật); "We never invent specifications you have not recorded" (không bao giờ bịa thông số) |
| [StoreRank](https://apps.shopify.com/storerank-ai) | 5,0 (32) | 08/2025 | 29 / 79 / 149 / 289 | Schema, llms.txt, FAQ, đếm lượt nhắc. 133 lượt cài |
| [GPTLab](https://apps.shopify.com/gptlab) | 4,9 (321) | 06/2026 | Miễn phí | llms.txt, JSON-LD, traffic AI qua GA4. 1.597 lượt cài |

Thêm 8 app chỉ kiểm tra (0–4 đánh giá, 2026): StoreHQ AI Readiness, AI Catalog Readiness (Nxora), Agent Ready – Product Data Fix, Agentic Commerce Readiness, AIStoreAudit, MirrorAsk, AI Ready – Catalog IQ, Go Agent.

## B. Dữ liệu cấu trúc (schema, JSON-LD)

| App | Đánh giá | Ra mắt | Giá | Ghi chú | Lượt cài |
|---|---|---|---|---|---|
| [Webrex](https://apps.shopify.com/webrex-seo-schema) | 4,9 (849) | 04/2025 | 0 / 9,99 / 29,99 | Giao hàng, đổi trả theo từng nước; FAQ schema; 16 ngôn ngữ | 2.260 |
| [Schema Plus](https://apps.shopify.com/schema-plus) | 5,0 (590) | 2018 | 10,99–34,99 | Product, Review, Merchant Listing, FAQ | 2.983 |
| [Ilana's JSON-LD](https://apps.shopify.com/json-ld-for-seo) | 4,9 (441) | 2015 | 399/năm | Trường Merchant Center, theo dõi | 2.710 |
| [SearchPie](https://apps.shopify.com/seo-booster) | 4,9 (2.444) | 2019 | 0 / 39 / 99 | Schema giá, đánh giá, tồn kho, FAQ; llms.txt | 5.929 |

## C. Viết mô tả bằng AI

AI Product Description‑ChatGPT (Profitonium, 4,9, 528 đánh giá, 0–249 USD), Avada AI Product Description (4,9, 134), Shopify Magic (có sẵn).

## D. Bổ sung thuộc tính, metafield, danh mục

| App | Đánh giá | Ra mắt | Giá | Làm gì |
|---|---|---|---|---|
| [beFound](https://apps.shopify.com/agentic-attribute-ai) | 5,0 (3) | 07/2026 | 9 USD mỗi 100 sản phẩm tới 299 USD mỗi 10.000 | Quét sức khoẻ danh mục; gợi ý category metafield; duyệt hoặc tự áp dụng; hoàn tác |
| [Datify](https://apps.shopify.com/datify) | 4,8 (5) | 08/2025 | 0,3–1 cent mỗi sản phẩm | Điểm khả năng được AI tìm thấy; category metafield; chuyển tag cũ sang danh mục chuẩn |
| [Describely](https://apps.shopify.com/describely) | 5,0 (3) | 06/2024 | 0,75 USD mỗi sản phẩm hoặc 28–138 USD | Tìm thông số thiếu, điền thuộc tính, metafield hàng loạt |
| [Product Pelican](https://apps.shopify.com/product-pelican) | 5,0 (10) | 03/2026 | 0 / 99 / 199 | Kiểm tra dữ liệu, ảnh; tạo danh mục, metafield; FAQ |
| [Auto Category Metafield by AI](https://apps.shopify.com/chatgpt-ai-metafield-populator) | 5,0 (3) | 09/2025 | 0 / 19 / 49 | Duyệt tay trước khi đẩy; đọc ảnh |
| [CatMap AI](https://apps.shopify.com/catmap-ai) | 5,0 (2) | 01/2026 | 0,002 USD mỗi sản phẩm | Ánh xạ danh mục Shopify, Google; rút thuộc tính từ chữ và ảnh |
| Emfas, Plytix (PIM) | 5,0 (9), 4,8 (15) | 2024–2026 | 0–499 | Quản lý dữ liệu sản phẩm đầy đủ, dịch, feed |

## E. Quản lý feed có AI

Simprosys (4,9, 4.924 đánh giá, 41.232 lượt cài, từ 4,99 USD; AI tối ưu 1 USD mỗi 25 sản phẩm), AdNabu (4,7, 539), CedCommerce (4,6, 553). Quan trọng vì Google AI Mode lấy dữ liệu qua Merchant Center.

## F. Shopify tự làm (miễn phí)

| Công cụ | Làm gì | Điểm yếu |
|---|---|---|
| [Shopify Knowledge Base](https://apps.shopify.com/shopify-knowledge-base) (3,5 sao, 29 đánh giá) | Xem, sửa FAQ mà AI dùng để trả lời về shop; xem câu khách hỏi | Bị chê bịa, chỉ tiếng Anh (xem dưới) |
| Admin → Agentic | Điểm chất lượng từng sản phẩm, xem trước xếp hạng | Không chấm thuộc tính theo danh mục |
| llms.txt, agents.md | Tự tạo cho mọi shop | — |
| Gợi ý danh mục, thuộc tính | Khi tạo từng sản phẩm | Từng sản phẩm một |
| Sidekick | Sửa sản phẩm, đề xuất để duyệt, chạy nền | Chỉ "lượt đầu" theo agency |

---

## Bảng so tính năng

✓ = có. một phần = có một phần. ✗ = không. ? = trang app không nói.

| App | 1. Kiểm tra thuộc tính theo danh mục | 2. AI điền thuộc tính, có duyệt | 3. JSON-LD đầy đủ | 4. Viết lại chính sách | 5. Thử hỏi trên dữ liệu shop, trước/sau | Áp dụng hàng loạt / hoàn tác | Đa ngôn ngữ | Giá (USD/tháng) |
|---|---|---|---|---|---|---|---|---|
| Shopify (Agentic, Magic, Sidekick, KB) | một phần | một phần (từng sản phẩm) | một phần | một phần | một phần | một phần | một phần | 0 |
| AgentIQ | một phần | ✓ | ? | một phần | một phần | ✓ / ? | ? | 49–799 |
| **Verity Score** | một phần | một phần | một phần | một phần | **✓** | ✓ / ✓ | một phần (Anh, Pháp) | 0–449 |
| AgentReady | một phần | một phần | ✓ | một phần | một phần | ✓ / ✓ | ? | 0–79 |
| AI Catalog Score | một phần | ✓ | một phần | ✗ | một phần | ✓ / ✓ | ? | 0–399 |
| Agentic Fuel | một phần | ✓ | ✓ | ✗ | ✗ | ? | ✓ | 0–149 |
| beFound | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ / ✓ | ? | theo lượt |
| Datify | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ / ? | ? | khoảng 1 cent/sản phẩm |
| Describely | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ / ? | ? | 28–138 |
| Kedra | một phần | một phần | một phần | ✗ | một phần | ✓ / ? | một phần | 0–199 |
| ShopRank AI | một phần | một phần | ✓ | ✗ | ✗ | ✓ / ? | ✓ | 0–9,99/100 sp |
| Webrex | ✗ | ✗ | ✓ | ✗ | ✗ | — | ✓ | 0–29,99 |
| Schema Plus | ✗ | ✗ | ✓ | ✗ | ✗ | — | ✓ | 10,99–34,99 |

---

## Bị chê gì (đánh giá 1–3 sao)

**Shopify Knowledge Base**
- 📖 3 sao, 2026-05-13: "The pre-generated FAQ answers are wildly inaccurate! … One answer even claimed we offer worldwide shipping though we only have two countries active!" FAQ tạo sẵn sai be bét… Có câu nói chúng tôi giao toàn cầu trong khi chỉ bật hai nước.
- 📖 1 sao, 2026-07-30: "There's no control over AI hallucination, and the tool sometimes invents answers… No control over the data source." Không kiểm soát được việc AI bịa… Không kiểm soát được nguồn dữ liệu.
- 📖 2 sao, 2026-06-05: "they are always in English, ignoring the store's default language." Lúc nào cũng ra tiếng Anh, bỏ qua ngôn ngữ của shop.

**AI Product Description‑ChatGPT**
- 📖 1 sao, 2026-07-30: "producing bloated copy, unsupported claims, exaggerations, and apparent AI hallucinations. I made the mistake of allowing the app to bulk-publish…" Viết dài dòng, khẳng định không có căn cứ, phóng đại, AI bịa. Tôi sai lầm khi cho app đăng hàng loạt…
- 📖 1 sao, 2026-09-15: "It changes the titles to my products and replaces them with off the wall product I do not carry." Nó đổi tiêu đề sản phẩm thành những thứ tôi không bán.

**Schema Plus**: 📖 1 sao, 2025-07-11: không tạo điểm đánh giá trong JSON-LD dù nói có tích hợp Judge.me; thiếu thông tin người bán.

**SearchPie**: 📖 1 sao, 2025-08-22: "once you stop using the app all the work you put into the meta titles and descriptions disappear." Ngừng dùng app là mọi công sức sửa tiêu đề, mô tả biến mất.

**Webrex**: 📖 1 sao, 2026-04-04: "I cant use the app if I dont book a call with you?" Không đặt lịch gọi thì không dùng được app?

**IndexGPT**: 📖 1 sao, 2026-03-23: "We had only 4 traffics from AI agents since we installed this app." Từ khi cài chỉ có 4 lượt từ AI.

**FD/Fiidom**: 📖 2 sao, 2025-05-06: "It thought a Gemstone was a necklace." Nó tưởng viên đá quý là dây chuyền.

### Phàn nàn lặp lại

| # | Phàn nàn | 💭 Ý nghĩa cho app mình |
|---|---|---|
| 1 | **AI bịa**: thông số, chính sách, tiêu đề sai, nhất là khi đăng hàng loạt | Không bao giờ ghi gì chưa duyệt; mọi đề xuất phải có nguồn |
| 2 | Không kiểm soát, không thấy câu trả lời lấy từ đâu | Hiện nguồn cho từng câu trả lời, từng giá trị |
| 3 | Shop không nói tiếng Anh bị bỏ qua | Đa ngôn ngữ từ đầu |
| 4 | Schema thiếu hoặc trùng | Kiểm tra trùng với theme trước khi thêm |
| 5 | **Gỡ app là mất hết, khó hoàn tác** | Ghi thẳng vào trường gốc của Shopify; lưu bản cũ để hoàn tác |
| 6 | Bắt đặt lịch gọi, tính tiền sau khi huỷ | Tự cài tự dùng, tính tiền rõ |
| 7 | "Cài rồi không thấy traffic AI" | Không hứa traffic |

---

## 💭 Đánh giá: tính năng nào còn trống

| Tính năng dự kiến | Mức phủ | Ghi chú |
|---|---|---|
| 3. JSON-LD (đổi trả, giao hàng) | **Đã phủ kín** | Webrex miễn phí, Schema Plus, Ilana, SearchPie (2.000–6.000 lượt cài mỗi app) |
| 2. AI điền category metafield có duyệt | **Đã phủ** | Ít nhất 9 app, có app khoảng 1 cent mỗi sản phẩm; Shopify cũng gợi ý |
| llms.txt, agents.md | **Shopify làm sẵn** | Không làm |
| 1. Kiểm tra thuộc tính theo danh mục | Một phần | Có app kiểm tra thiếu thuộc tính, nhưng **chưa gắn với câu khách trong ngành đó hay hỏi** |
| 5. Thử hỏi trên dữ liệu shop, có trước/sau | Một phần | Verity Score, AI Catalog Score gần nhất. Hầu hết app khác đếm lượt nhắc thay vì trả lời chỉ từ dữ liệu shop |
| **4. Chính sách đúng sự thật, đa ngôn ngữ** | **Gần như trống** | Chỉ AgentIQ (một phần). Knowledge Base của Shopify bị chê bịa, chỉ tiếng Anh |
| **Tin cậy**: không bịa, có nguồn, gỡ app vẫn giữ dữ liệu | **Gần như trống** | Chỉ Yumnaz nói "không bịa" |

**Mối đe doạ lớn nhất: Shopify.** Bước tự nhiên tiếp theo của Shopify là thêm "độ đầy đủ thuộc tính theo danh mục" vào điểm chất lượng và cho Sidekick điền hàng loạt, tức là phủ luôn tính năng 1 và 2 miễn phí. Một người đánh giá Knowledge Base viết: 📖 "my sneaky feeling is Shopify is already building most of this" (tôi có cảm giác Shopify đang tự làm gần hết rồi, 2026-07-23).

Đe doạ thứ hai: AgentIQ (giá tới 799 USD, có vẻ có vốn), Verity Score, và các bộ SEO lớn gắn thêm module AI.

---

# Phần các nền tảng khác

## WooCommerce (WordPress)

Điều kiện chợ:
- **WordPress.org** (miễn phí): không thu phí. Quy định: 📖 "Trialware is not permitted." (không được làm bản dùng thử khoá tính năng); "Software as a Service is permitted" (được phép là dịch vụ trả phí bên ngoài) ([quy định plugin](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)). Cách phổ biến: **plugin miễn phí + dịch vụ trả phí**.
- **WooCommerce.com Marketplace**: nhà phát triển nhận **70%** doanh thu; giá theo năm, thường 29–179 USD/năm.

### Plugin SEO, schema, feed lớn (đều đang gắn nhãn "AI")

Nguồn: wordpress.org/plugins, 2026-10-10. Điểm là thang 0–100.

| Plugin | Lượt cài | Điểm (số đánh giá) | Ghi chú |
|---|---|---|---|
| Yoast SEO | 10.000.000 | 96 (27.819) | "Help search engines and AI systems understand…"; bản WooCommerce SEO 178,80 USD/năm |
| Rank Math | 4.000.000 | 96 (7.511) | "Grow your organic traffic and AI visibility" |
| AIOSEO | 2.000.000 | 94 (5.220) | Công cụ AI SEO, schema, llms.txt |
| SEOPress | 300.000 | 96 (1.265) | AI metadata, schema |
| Schema & Structured Data for WP | 100.000 | 90 (252) | |
| CTX Feed | 90.000 | 92 (836) | Feed cho 220+ kênh |
| Product Feed PRO (AdTribes) | 80.000 | 94 (1.069) | |
| Google for WooCommerce | 800.000 | **54** (267) | Plugin chính thức của Google |
| Squirrly SEO | 30.000 | 92 (681) | "SEO + AEO + GEO" |

### Plugin llms.txt, "AI visibility" (2025–2026)

| Plugin | Lượt cài | Ra mắt |
|---|---|---|
| website-llms-txt | 40.000 | 01/2025 |
| llms-full-txt-generator | 5.000 | 03/2025 |
| vigia (theo dõi bot AI) | 1.000 | 01/2026 |
| lovedbyai-seo-for-llms-and-ai-search | 1.000 | 01/2026 |
| 8 plugin khác (rankready, llmagnet, native-aeo-pack, aeo-god-mode…) | 100–500 | 2025–2026 |

Kết quả tìm "llms.txt": 585 plugin; "generative engine optimization": 187; "answer engine optimization": 484.

### Plugin "agentic commerce" (gần nhất, đều rất nhỏ)

| Plugin | Lượt cài | Ra mắt | Làm gì |
|---|---|---|---|
| agentic-commerce-for-woocommerce | 60 | 06/2026 | "get your products into ChatGPT answers"; bị đánh giá "terrible product for stores. do not use." (2026-07-15) |
| universal-commerce-protocol-ucp-for-woocommerce | 30 | 03/2026 | UCP |
| merchant-ai-feed | 10 | 01/2026 | Chuẩn bị danh mục cho AI |
| kalicart-bridge | 10 | 06/2026 | Feed kiểm theo chuẩn OpenAI, MCP |
| wt-ucp-enabler (WebToffee) | 10 | 07/2026 | UCP |
| Plugin ACP, ChatGPT checkout | 20 mỗi cái | 11/2025 | |

Plugin MCP tăng nhanh: vibe-ai 60.000 lượt cài (04/2026), ai-engine 90.000.

### WooCommerce.com Marketplace (trả phí)

| Tìm | Kết quả | Liên quan |
|---|---|---|
| "ai seo" | 20 | Yoast WooCommerce SEO 178,80; Nexa AI Product Content 79; Kestrel AI 89 (viết mô tả) |
| "schema" | 9 | Rich Snippets & Schema Markup 79; Slim SEO Pro 59 |
| "llms" | khoảng 2 | **Không có sản phẩm llms.txt** |
| "product feed" | 51 | Google Product Feed (Ademti) 79; WebToffee 89 |
| "product attributes" | 170 | Sửa hàng loạt thuộc tính 29–79 |
| "ai visibility", "agentic" | 26, 46 | Chỉ app viết nội dung, chatbot |

**Khoảng trống:** không plugin nào làm **kiểm tra độ đầy đủ thuộc tính theo danh mục**, **AI bổ sung có duyệt và hiện nguồn**, hay **thử "AI trả lời được từ dữ liệu shop không"**. Plugin agent tập trung vào feed, giao thức, không vào chất lượng dữ liệu. WooCommerce.com chưa có sản phẩm "dữ liệu sẵn sàng cho AI" nào.

### Bị chê gì

| Plugin | 📖 Phàn nàn |
|---|---|
| Google for WooCommerce | "not syncing my product attributes correctly… attributes (size, color) are missing even though they are not" (2025-12-14); "Constant issues with field data mismatches" (2026-03-11); "Update to 3.6.0 and it completely broke Admin… my products have disappeared from Google Merchant!" (2026-03-21); "Zero star – alot of lost money… I will change to shopify" (2026-01-11) |
| Product Feed PRO | "With every update feed breaks… I have spent hours and hours" (2025-11-19); "Tech support said I need to upgrade to the paid version!" (2025-11-04) |
| CTX Feed | "Buggy plugin, loosing settings… to create a custom xml, takes hours and hours" (2025-05-23) |
| Schema & Structured Data for WP | "Most of the data entered in the fields are not displaying on the frontend." (2026-01-05) |

Phàn nàn lặp lại: **lỗi ánh xạ thuộc tính, trường dữ liệu**; hỏng sau mỗi lần cập nhật; mất hàng giờ cài đặt. 💭 Khớp với một sản phẩm tập trung vào độ đầy đủ và kiểm tra thuộc tính.

## Wix

Năm đầu Wix không lấy phí của nhà phát triển (nhiều app 0%). Mức sau năm đầu ⚠️ chưa kiểm tra.

| App | Đánh giá | Làm gì |
|---|---|---|
| Rabbit SEO | 4,9 (2.258) | SEO |
| AI SEOly | 4,9 (439) | AI SEO |
| SEO & AI Traffic Booster | 4,1 (222) | |
| AI Visibility Booster | 5,0 (68) | |
| Automatic Google Schema Fixer | 5,0 (63) | Schema |
| Google Gemini Visibility Fixer | 5,0 (32) | "Automatically Fix Business Data for AI" |
| LLMs.txt | 4,7 (6) | llms.txt |
| AEO Ultimate Store, AEO Pulse, Patesco, CataSEO, Cited, Birdie AI | 0 | Các app "AI visibility" mới |

💭 Nhiều app mới 0 đánh giá, chưa ai thắng. Không có app về độ đầy đủ thuộc tính. Nhưng Wix tự làm llms.txt, schema có đổi trả, đo lượt nhắc.

## BigCommerce

Khoảng 1.200 app. Liên quan: SEOKart (179 đánh giá), MetaMaster, AI Copywriter, các app feed (DataFeedWatch, FeedOps). **BigCommerce tự bán Catalog Enrichment, Feedonomics Enrichment**, gần đúng lõi của app. 💭 Không nên vào.

## Squarespace

Squarespace tự có AI Visibility (miễn phí theo gói). Extension liên quan: SEOSpace, TinyIMG, GoDataFeed. 💭 Ít shop nhiều sản phẩm.

## Magento / Adobe Commerce

Tìm trên Adobe Commerce Marketplace: "llms" 24 extension, "ai seo" 74, "schema" 48, "chatgpt" 52, "product feed" 289. Chưa xem được tên. Bán qua agency, giá cao, chu kỳ dài.

## 💭 Đánh giá: còn trống ở đâu

| Nền tảng | Kiểm tra độ đầy đủ thuộc tính | AI bổ sung có duyệt, hiện nguồn | Thử hỏi trên dữ liệu shop | Schema đổi trả, giao hàng |
|---|---|---|---|---|
| Shopify | Có nhiều | Có nhiều | Có (Verity, AI Catalog Score) | Đã phủ kín |
| **WooCommerce** | **Trống** | **Trống** (chỉ app viết mô tả) | **Trống** | Có plugin schema, nhưng lõi WooCommerce thiếu |
| Wix | Trống | Trống | Trống | Wix tự làm |
| BigCommerce | Nền tảng tự làm | Nền tảng tự làm | Trống | Chưa rõ |

**Đe doạ lớn nhất trên WooCommerce:** Yoast, Rank Math, AIOSEO (hàng triệu lượt cài) thêm tính năng tương tự; Automattic, WooCommerce làm sẵn khi kết nối Stripe ACS, UCP ra mắt.
