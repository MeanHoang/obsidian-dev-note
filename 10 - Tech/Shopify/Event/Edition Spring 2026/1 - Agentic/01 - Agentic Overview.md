# Agentic — Shopify Editions Spring '26

Section **Agentic** là trọng tâm lớn nhất của Shopify Editions Spring 2026, đánh dấu bước chuyển của Shopify sang **agentic commerce** — nơi AI agent thay mặt người mua tìm kiếm, so sánh, thêm giỏ hàng và thanh toán xuyên suốt nhiều merchant. Shopify cung cấp cả hạ tầng protocol mở (Universal Commerce Protocol), dữ liệu sản phẩm chuẩn hóa (Shopify Catalog), và trải nghiệm checkout tích hợp trực tiếp trên các nền tảng AI.

---

## Your products optimized for AI

Shopify tự động đưa sản phẩm của merchant lên các AI channel. Trong admin, merchant có dashboard **Agentic** (vào qua **Sales channels > Agentic**) để:

- **Theo dõi hiệu suất**: xem số liệu Sales, Orders, Online store sessions, Online store conversion theo từng AI channel hoặc tổng hợp, lọc theo khoảng thời gian.
- **Kiểm soát channel**: bật/tắt từng channel (Google, Microsoft Copilot, Meta...), cấu hình auto-enrollment, hoặc bật "Allow Shopify to manage for me" để Shopify tự quản lý.
- **Preview product ranking**: chạy search query thử để xem sản phẩm xếp hạng thế nào trên AI channel.
- **Listing quality indicators**: đánh giá chất lượng listing theo 6 chiều — description completeness, image coverage, product reviews, variant & option completeness, shop policy completeness.

> [!note] Availability
> Agentic storefronts performance analytics chưa hỗ trợ headless stores. Cần quyền **Products > View** và **App and sales channel > Agentic**.

- Help docs: https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/agentic-home

---

## Product data structured for agents — Shopify Catalog

**Shopify Catalog** là nguồn dữ liệu sản phẩm chuẩn hóa từ các Shopify merchant, cho phép AI agent truy cập thông tin sản phẩm một cách nhất quán thay vì phải crawl web.

**Cách hoạt động:**
- Map sản phẩm sang **Shopify Standard Product Taxonomy**.
- Tự động **infer** các attribute thiếu: color, material, size type, age group.
- **Cluster** sản phẩm trùng lặp giữa các store.
- Tổ chức data thành các trường chuẩn: features, specifications, value proposition.
- Duy trì **live connection** tới pricing, availability, inventory — agent luôn có data real-time.

**Merchant control:** Merchant quản lý dữ liệu gốc (title, description, image, category, variant, pricing, inventory) qua Shopify admin như bình thường. Các inferred attribute do Shopify xử lý — merchant không chỉnh trực tiếp. Chất lượng data phụ thuộc vào cách merchant quản lý thông tin sản phẩm.

> [!tip] Conversion impact
> Theo Shopify: *"Data syndicated by Shopify drives 2x more conversion in AI chats."*

- Blog: https://www.shopify.com/blog/what-is-shopify-catalog
- Help docs: https://help.shopify.com/en/manual/promoting-marketing/seo/shopify-catalog

---

## Checkout on more surfaces

Mua sắm qua AI không còn dừng ở recommend — khách hàng có thể **checkout trực tiếp** ngay trong giao diện chat, nhờ **Universal Commerce Protocol (UCP)**.

**Microsoft Copilot** là nền tảng đầu tiên hỗ trợ:
- Khách nhấn **Buy** ngay trong chat → điền shipping + payment trong Shopify-powered direct checkout → nhấn **Pay now** để thanh toán bằng credit/debit card.
- Merchant bật direct checkout qua dashboard Agentic cho từng channel.

**Meta ads** được Shopify đề cập là nền tảng tiếp theo ("soon").

> [!warning] Giới hạn
> Direct checkout trên Copilot hiện chỉ hiển thị với **khách hàng tại Mỹ**, và merchant phải bán hàng tới khách Mỹ.

- Help docs: https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/ai-channels-with-built-in-checkout

---

## Agentic plan

Plan mới dành cho **doanh nghiệp chưa dùng Shopify** muốn bán hàng qua AI channel mà không cần online store truyền thống.

**Đặc điểm:**
- **Không phí hàng tháng** — chỉ trả khi bán được hàng.
- Đăng ký miễn phí, không chi phí trước.
- Sync sản phẩm lên Shopify Catalog, bán trên AI channel và Shop app.

**AI channel được hỗ trợ:** ChatGPT, Google AI Mode & Gemini, Microsoft Copilot, Perplexity, Shop app — và thêm nữa sắp tới.

**Tính năng đi kèm:**
- **Knowledge Base app**: kiểm soát brand narrative, quản lý FAQ (sản phẩm, đổi trả, shipping).
- **Stack integration**: kết nối PIM, tax system, order management hiện có.
- Onboarding 3 bước: add products → set up on Shopify → start selling.

> [!note] Availability
> Hiện ở dạng **limited availability / early access**. Merchant đăng ký để nhận thông báo khi có ở region của mình.

- Trang plan: https://www.shopify.com/agentic-plan

---

## The open protocol for agentic commerce — Universal Commerce Protocol & MCPs

**Universal Commerce Protocol (UCP)** là framework mở cho phép AI agent thực hiện các thao tác commerce — authenticate, discover, build cart, checkout, track order — một cách chuẩn hóa, bảo mật, xuyên suốt nhiều merchant.

Shopify triển khai UCP qua các **MCP server** (Model Context Protocol) — agent tích hợp qua **Shopify AI Toolkit plugin**, hỗ trợ Claude Code, Codex, Antigravity CLI, Cursor, VS Code.

### Buyer journey 4 giai đoạn

| Giai đoạn | Mô tả |
|---|---|
| **1. Negotiate & Authenticate** | Agent trình profile để xác minh; trust tier quyết định rate limit và capability |
| **2. Discover products** | Query catalog toàn bộ Shopify hoặc storefront riêng lẻ |
| **3. Build carts & Checkout** | Xây giỏ hàng qua nhiều turn hội thoại, convert sang checkout |
| **4. Monitor orders** | Theo dõi order lifecycle, xử lý inquiry sau mua |

### Catalog MCP
- **Global Catalog**: query sản phẩm trên toàn bộ merchant Shopify — hàng trăm triệu listing.
- **Storefront Catalog**: giới hạn discovery trong 1 merchant, lấy variant detail cần thiết cho cart/checkout.

### Cart MCP
- Xây giỏ hàng với line item, localization, buyer context.
- Hỗ trợ thêm/sửa sản phẩm qua nhiều conversation turn.
- Ước tính total trước khi convert checkout.

### Checkout MCP
- Convert cart thành checkout experience.
- Agent thường → hand off buyer sang merchant storefront để thanh toán.
- Agent trust cao → có thể **complete checkout trực tiếp**.

> [!note] Universal Cart API
> Cho phép unified cart xuyên nhiều merchant — hiện ở **early access** qua waitlist.

- Dev docs: https://shopify.dev/docs/agents

---

## Sponsored products with Catalog API

Developer có thể **kiếm doanh thu** từ sales thông qua agentic experience xây bằng Catalog API nhờ **paid placements** (sponsored products).

> [!warning] Availability
> **Developer preview coming soon.**

- Dev docs: https://shopify.dev/docs/agents/catalog#earn-with-paid-placements

---

## Catalog API supports Shop sign-in

Developer thêm **Shop sign-in** vào experience xây bằng Catalog API, cho phép shopper kết nối Shop account. Khi đã sign-in, agent có thể cung cấp trải nghiệm cá nhân hóa hơn.

**Personalized search results** dựa trên Shop account đang ở trạng thái **coming soon**.

- Dev docs: https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting#token

---

## Experiences built with Catalog API & UCP

Shopify giới thiệu 5 demo agentic experience để minh họa khả năng của Catalog API + UCP:

| Demo | Mô tả |
|---|---|
| **All Set** | Lên kế hoạch cho chuyến đi — agent gợi ý sản phẩm phù hợp |
| **Sourced** | Hỏi agent gợi ý board game |
| **Starred** | Mua sắm theo cung hoàng đạo |
| **Showroom** | Lấy cảm hứng từ show/phim — tìm sản phẩm tương tự |
| **Pippin** | Duyệt sản phẩm bằng ảnh lookalike |

**Link demo:**
- All Set: https://www.shopify.com/editions/demos/all-set
- Sourced: https://www.shopify.com/editions/demos/sourced
- Starred: https://www.shopify.com/editions/demos/starred
- Showroom: https://www.shopify.com/editions/demos/showroom
- Pippin: https://www.shopify.com/editions/demos/pippin

- Dev docs: https://shopify.dev/docs/agents/catalog/global-catalog

---

## Catalog API image search

Agent có thể **truyền ảnh trực tiếp** vào Catalog API để tìm sản phẩm tương tự về mặt hình ảnh (visually similar products), mở rộng khả năng search vượt ra ngoài text.

- Dev docs: https://shopify.dev/docs/agents/catalog/global-catalog#search_catalog

---

## Catalog API product lookup

Dùng **product ID hoặc URL** để lấy real-time data (pricing, availability) cho tối đa **50 sản phẩm trong 1 request**.

- Dev docs: https://shopify.dev/docs/agents/catalog/global-catalog#lookup_catalog

---

## Richer product data in agentic experiences

Agent có thể hiển thị **product detail đầy đủ** từ Catalog API:
- Media (ảnh, video)
- Variants
- Availability
- Offers từ **nhiều seller** (multi-seller)

Giúp trải nghiệm agentic phong phú hơn — shopper không cần rời chat để xem chi tiết sản phẩm.

- Dev docs: https://shopify.dev/docs/agents/catalog/global-catalog-extension

---

## Chi tiết kỹ thuật

Các note kỹ thuật chi tiết từ Shopify dev docs (`shopify.dev/docs/agents`):

Đọc theo thứ tự đánh số:

- [[02 - Universal Commerce Protocol]] — UCP spec, capability model, agent profile, negotiation flow
- [[03 - Shopify Catalog]] — Global vs Storefront Catalog, product data structure, merchant participation
- [[04 - Catalog API]] — endpoints, tools (`search_catalog`, `lookup_catalog`, `get_product`), request/response format, filters
- [[05 - Auth & Rate Limiting]] — 3 tiers (Token/Signed/Anonymous), capability matrix, scopes
- [[06 - Buyer-Linked Tokens & Shop Sign-in]] — Shop OAuth flow, token exchange (RFC 8693 + 7523), personalization
- [[07 - Cart MCP]] — `create_cart`, `get_cart`, `update_cart`, `cancel_cart`, line items, localization
- [[08 - Checkout MCP]] — `create_checkout`, `update_checkout`, `complete_checkout`, status lifecycle, escalation flow
- [[09 - Shop Pay Handler]] — delegated payment, Shop Token, instrument schema
- [[10 - Order MCP & Webhooks]] — `get_order`, webhook topics, HMAC verification, payload format
- [[11 - Promoted Placements]] — sponsored products trong Catalog, commission model, attribution
- [[12 - Shopify AI Toolkit]] — plugin install, UCP CLI, MCP server setup

---

## Nguồn

- Shopify Editions Spring '26: https://www.shopify.com/editions/spring2026
