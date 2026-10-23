# 01 – UCP và Shopify Catalog

> 📖 = trích nguồn chính thức / tự gọi API. 💭 = nhận định AI. ⚠️ = nguồn phụ / chưa kiểm.
> Ngày viết: 2026-10-23. Bối cảnh business: [[Shopify - Hướng đi và mục tiêu 2026]]. Ý tưởng dùng kiến thức này: [[10 - Loyalty trong mua sắm qua AI/00 - Tổng quan|Loyalty trong mua sắm qua AI]].

**Một câu:** **UCP** là "ngôn ngữ chung" để AI mua hàng của bất kỳ shop nào; **Shopify Catalog** là cuốn danh mục sản phẩm của mọi shop Shopify, nói bằng ngôn ngữ đó. Shopify đã **tự bật sẵn** cả hai cho mọi store; dev không phải dựng server, chỉ cần biết gọi và biết app mình "cắm" vào chỗ nào.

---

## 1. Ví dụ đời thường

**Người đi chợ hộ.** Anh nhờ một người đi chợ hộ (AI agent) mua sữa chua.
- Ngày xưa: mỗi sạp nói một kiểu, ghi giá một kiểu. Người đi chợ hộ phải học cách nói chuyện với **từng sạp** → không ai làm nổi.
- Bây giờ: cả chợ thống nhất **một bộ quy tắc giao dịch** — hỏi hàng thế nào, đặt giỏ thế nào, trả tiền thế nào, hỏi đơn thế nào. Đó là **UCP**.
- Ban quản lý chợ (Shopify) còn in sẵn **một cuốn danh mục chung** của tất cả các sạp: tên hàng, giá, size, còn hàng không. Đó là **Global Catalog**. Mỗi sạp cũng có **tờ danh mục riêng** treo trước sạp: **Storefront Catalog**.
- Trước cửa mỗi sạp treo **tấm bảng "sạp này nhận những gì"** (giao hàng, giảm giá, nối thẻ thành viên…). Đó là file **`/.well-known/ucp`**.
- Người đi chợ hộ cũng phải đeo **thẻ tên** (agent profile) để sạp biết là ai, tin tới đâu.

## 2. Khái niệm

### 2.1. UCP – Universal Commerce Protocol

📖 [ucp.dev – Core concepts](http://ucp.dev/documentation/core-concepts/): UCP là "an open standard for interoperability between commerce entities" (chuẩn mở để các bên thương mại làm việc được với nhau). 📖 Shopify làm cùng Google, công bố 2026-01-11 ([Shopify News](https://www.shopify.com/news/ai-commerce-at-scale)).

**4 vai:**

| Vai | Là ai | Ví dụ |
|---|---|---|
| Platform | Bên gọi: app, AI agent | ChatGPT, Gemini, Copilot, agent anh tự viết |
| Business | Bên bán, mở các chức năng | Shop Shopify (Shopify chạy hộ) |
| Credential Provider | Giữ dữ liệu nhạy cảm (thẻ, địa chỉ) | Ví điện tử, nhà cung cấp danh tính |
| Payment Service Provider | Xử lý thanh toán | Shopify Payments, Stripe |

**3 tầng chức năng:**

| Tầng                   | Nghĩa                                              | Ví dụ tên                                                                      |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Service                | Nhóm theo ngành                                    | `dev.ucp.shopping`, `dev.ucp.common`                                           |
| Capability ("động từ") | Một việc làm được, có phiên bản                    | `dev.ucp.shopping.checkout`, `dev.ucp.shopping.catalog.search`                 |
| Extension              | Gắn thêm vào 1 capability, khai báo bằng `extends` | `dev.ucp.shopping.discount` (gắn vào cart, checkout), `dev.ucp.common.loyalty` |

📖 Extension bị **bỏ** khi capability cha không được bật.

**Khám phá + thương lượng:**
1. Mỗi shop công khai hồ sơ ở `/.well-known/ucp`.
2. Agent gửi kèm hồ sơ của mình trong mỗi request (header `UCP-Agent: profile="..."`, hoặc `meta.ucp-agent.profile` khi gọi qua MCP).
3. Shop lấy **giao** của 2 bên: capability nào cả hai cùng có, phiên bản cao nhất cả hai cùng hỗ trợ; bỏ extension mất cha.

**Đường truyền:** REST, **MCP** (Shopify dùng), A2A, embedded.

### 2.2. Shopify Catalog

📖 [shopify.dev/docs/agents/catalog](https://shopify.dev/docs/agents/catalog):

| | Global Catalog | Storefront Catalog |
|---|---|---|
| Tìm ở đâu | "across all Shopify merchants" | "scoped to a single merchant's store" |
| Endpoint | `https://catalog.shopify.com/api/ucp/mcp` | `https://{storeDomain}/api/ucp/mcp` |
| Xác thực | "Agent profile (no API key needed)" | như bên trái |
| Công cụ | `search_catalog`, `lookup_catalog`, `get_product` | như bên trái |

- 📖 "Some fields might be inferred by Shopify's AI and might not always be present." (Một số trường do AI của Shopify suy ra, có thể thiếu.)
- 📖 Kết quả Global được gom theo **Universal Product ID (UPID)** (cùng 1 sản phẩm bán ở nhiều shop gom thành 1).
- ⚠️ Tài liệu chưa nói rõ điều kiện để sản phẩm "eligible" vào Catalog.

### 2.3. Shopify làm sẵn gì cho mỗi store

📖 Tự gọi `https://www.allbirds.com/.well-known/ucp` (2026-10-23):
- Phiên bản UCP: `2026-08-25` (còn hỗ trợ `2026-04-08`, `2026-01-23`).
- Capability shop khai: `checkout`, `fulfillment`, `discount`, `cart`, `buyer_consent`, `order`, `catalog.search`, `catalog.lookup`, `dev.shopify.catalog`, `location.search`, `location.lookup`, `identity_linking`, `permalink`.
- **Không có** `dev.ucp.common.loyalty`.

📖 Tool MCP của 1 store (`tools/list`): `search_catalog`, `lookup_catalog`, `get_product`, `get_cart`, `create_cart`, `update_cart`, `cancel_cart`, `get_checkout`, `create_checkout`, `update_checkout`, `complete_checkout`, `cancel_checkout`, `get_order`, `search_locations`, `lookup_locations`.

💭 Merchant không cài gì: store Shopify **tự có** endpoint UCP. App / merchant chỉ ảnh hưởng tới **dữ liệu** mà endpoint trả ra.

### 2.4. Sản phẩm vào Catalog thế nào: Shopify tự lấy

📖 [Shopify Help – Catalog requirements](https://help.shopify.com/en/manual/shopify-catalog/requirements): "To be automatically included in Shopify Catalog, your store and products must meet the following eligibility requirements". → **Tự động**, merchant không đăng ký.

| Điều kiện | Trích |
|---|---|
| Gói | "Starter plan or higher, and your store can't be in private mode" (hoặc gói Agentic) |
| Sản phẩm | "a title and at least 1 product image"; "a price greater than 0" |
| Kênh | "published to your online store, Hydrogen, or Headless channels" |
| Không ẩn | "can't have Unlisted status or be hidden from search engines" |
| Nội dung | không "sensitive content", không thuộc danh mục bị cấm |
| Uy tín tài khoản | xác minh email, bật 2 lớp, "genuine sales to real customers", giao đơn đúng, "Keep your chargeback rate low", trả hoá đơn Shopify đúng hạn… |

- Xem trạng thái: admin → **Sales channels → Agentic** → **Sources → Shopify Catalog** (hiện lý do nếu không đủ điều kiện).
- Tắt: tài liệu chỉ nhắc thông báo "Your store is opted out of sharing products with AI channels" và bảo "Contact Shopify Support"; không có nút bỏ từng sản phẩm.
- 📖 [Shopify Help – Agentic storefronts](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts): "Agentic storefronts is active by default for eligible stores." Kênh: ChatGPT, Google AI Mode / Gemini, Microsoft Copilot, Meta. Google đi đường riêng: qua kênh **Google & YouTube** / Merchant Center.

**Store dev (đã gọi thử 2026-10-23):**
- `ag-mh-shop2.myshopify.com`, `ag-mh-shop-staging25.myshopify.com` (store dev của Joy): `/.well-known/ucp` HTTP 200; `/api/ucp/mcp` có **13 tool** (allbirds 15: thiếu `search_locations`, `lookup_locations`).
- `search_catalog` trên **Storefront Catalog** của `ag-mh-shop2` câu "shirt" → 10 sản phẩm thật của store (vd "White Cotton Shirt", "Floral White Top435435345").
- Tìm đúng "Floral White Top435435345" trên **Global Catalog** → 10 kết quả của shop khác, **không có store `ag-mh`**.
- 💭 Store dev **có** UCP riêng (test giỏ, thanh toán được) nhưng **không vào Global Catalog**, khớp điều kiện "Starter plan or higher" và "genuine sales to real customers".

### 2.5. Catalog đọc dữ liệu từ đâu

📖 [Shopify Help – Agentic storefronts: products](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/products): Catalog gửi mỗi sản phẩm với "title, description, options, images, price, availability, and other key attributes" và "continuously updates your product data".

📖 [Shopify Help – Catalog mapping](https://help.shopify.com/en/manual/shopify-catalog/mapping) (admin → **Sales channels → Agentic → Sources → Shopify Catalog → Review product data mapping**):
- Chọn nguồn cho **title, description, category**: "product attributes, product metafields, or metaobject references"; mỗi trường 1 nguồn.
- Gộp nhiều sản phẩm thành 1 listing (combined listings) theo title, tag hoặc metafield.
- Bật/tắt gửi giá gốc (compare-at).
- "Any changes that you make are processed with a delay."
- Ảnh, GTIN, brand: không nhắc. API cho app chỉnh mapping: không nhắc.
- Không đảm bảo thứ hạng hay câu chữ: mỗi kênh AI tự xếp và tự viết.

📖 File cho AI đọc (riêng, không thay Catalog): `/agents.md`, `/llms.txt`, `/llms-full.txt`; chỉnh bằng `agents.md.liquid`, `llms.txt.liquid`, `llms-full.txt.liquid` trong theme. Chính sách store nằm ở đây.
- Đã đọc `https://www.allbirds.com/agents.md`: hướng dẫn AI dùng "Shop skill" (https://shop.com/SKILL.md) và UCP. `llms-full.txt` của allbirds **không có chữ loyalty / reward / points**.
- 💭 Chỗ để mô tả chương trình loyalty cho AI đọc (kiểu ảnh Sữa Đại Việt). ⚠️ Chưa kiểm app có được ghi vào các template này không (app thường không được sửa file theme).

⚠️ "Some fields might be inferred by Shopify's AI" (trang Catalog cho dev) — trang Help về products không nhắc dữ liệu AI tự suy.

## 3. Một lượt mua, đi qua từng tool

Ví dụ: agent mua "Cleeves Coffee Table" ở shop Lulu and Georgia.
1. `search_catalog` trên Global Catalog, câu "wooden coffee table" → 📖 ra 10 sản phẩm, có "Cleeves Coffee Table", giá `{"amount": 169800, "currency": "USD"}` (= $1.698, giá tính bằng cent).
2. `get_product` → mọi tổ hợp option (màu Natural / Smoked Oak), còn hàng, `checkout_url`.
3. Agent chuyển sang Storefront Catalog của shop (`https://www.luluandgeorgia.com/api/ucp/mcp`).
4. `create_cart` → `create_checkout` (địa chỉ, giao hàng; capability `fulfillment`, `discount` áp vào đây).
5. `complete_checkout` (chỉ agent được tin, hoặc chuyển khách sang trang thanh toán) → đơn vào admin Shopify của shop như đơn thường.
6. `get_order` để theo dõi đơn.

⚠️ Bước 4–6 em chưa gọi thật (cần agent profile được tin và thanh toán thật).

## 4. Code: tự gọi thử

```bash
# 1. Shop này nhận những gì (tấm bảng trước sạp)
curl -s https://www.allbirds.com/.well-known/ucp | python3 -m json.tool | head -60

# 2. Danh sách tool của 1 shop
curl -s -X POST https://www.allbirds.com/api/ucp/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | python3 -m json.tool | grep '"name"'

# 3. Tìm sản phẩm trên toàn bộ Shopify
curl -s -X POST https://catalog.shopify.com/api/ucp/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"tools/call","id":1,"params":{"name":"search_catalog","arguments":{"meta":{"ucp-agent":{"profile":"https://shopify.dev/ucp/agent-profiles/examples/2026-08-25/valid-with-capabilities.json"}},"catalog":{"query":"wooden coffee table","filters":{"ships_to":{"country":"US"}}}}}}' \
  | python3 -m json.tool | head -80
```

`profile` ở trên là hồ sơ mẫu của Shopify (từ [bài hướng dẫn](https://shopify.dev/docs/agents/get-started/search-catalog)). Làm thật thì tạo hồ sơ riêng trong Dev Dashboard → Catalogs.

📖 [shopify.dev/docs/agents](https://shopify.dev/docs/agents) – bắt đầu: Node 18+, `npm install -g @shopify/ucp-cli`, cài Shopify AI Toolkit (Claude Code: `claude plugin install shopify-ai-toolkit@claude-plugins-official`).

## 5. Dev app Shopify cần làm gì

Có **2 phía**, đừng nhầm:

| Phía | Ai làm | Việc | Trạng thái |
|---|---|---|---|
| **Bên mua** (viết agent) | Ai muốn làm "người đi chợ hộ" | Gọi Catalog, Cart, Checkout, Order qua MCP | 📖 Mở cho mọi dev, không cần API key |
| **Bên bán** (app của merchant, vd Joy) | App cài trong shop | Làm cho **dữ liệu shop trả ra cho AI** đúng và giàu hơn | Xem bảng dưới |

**Bên bán – app có thể chạm vào đâu:**

| Chỗ | Nghĩa với app | Trạng thái |
|---|---|---|
| Dữ liệu sản phẩm (tiêu đề, mô tả, option, ảnh, thông số) | App làm giàu dữ liệu sản phẩm → Catalog dùng | 📖 Catalog có `metadata` (`top_features`, `tech_specs`…), ⚠️ chưa biết đọc metafield nào |
| Giảm giá (`dev.ucp.shopping.discount`) | Mã/giảm giá do app tạo (Shopify Functions) có áp trong checkout của agent không | ⚠️ capability có trên store; chưa kiểm discount của app có chạy qua đường này không |
| Nối tài khoản khách (`identity_linking`) | Khách đăng nhập → app biết là ai (loyalty, giá riêng) | 📖 capability có trên store; ⚠️ chưa kiểm app đọc được gì |
| Loyalty (`dev.ucp.common.loyalty`) | Hạng, quyền lợi, điểm sẽ nhận trong AI | 📖 có trong chuẩn, **Shopify chưa bật cho store** |
| Sidekick App Extensions | Merchant dùng app qua hội thoại trong admin | 📖 có (Winter '26, Spring '26) |
| Đơn từ AI | Đơn vào admin như đơn thường → webhook `orders/create` vẫn chạy | 💭 suy ra từ "đơn về admin"; ⚠️ chưa kiểm cách phân biệt đơn đến từ AI |

💭 Tóm lại cho app: **hôm nay** làm tốt dữ liệu (sản phẩm, giảm giá, chính sách) và Sidekick; **theo dõi** loyalty và identity linking vì đó là chỗ app loyalty sẽ được cắm vào.

## 6. Lưu ý khi chạy thật (production)

1. **Độ tin của agent quyết định giới hạn:** 📖 hồ sơ agent "determines the trust tier, which controls rate limits and tool access".
2. **Giá tính bằng đơn vị nhỏ nhất:** 📖 `{"amount": 600, "currency": "USD"}` là $6.00; JPY thì không chia.
3. **Phiên bản:** store hỗ trợ nhiều phiên bản cùng lúc (`2026-08-25`, `2026-04-08`, `2026-01-23`); code nên ghi rõ phiên bản và chịu được trường mới.
4. **Trường có thể thiếu:** dữ liệu do AI Shopify suy ra "might not always be present" → luôn có đường dự phòng.
5. **API cũ ngừng:** 📖 Global Catalog REST API ngừng 2026-11-02, chuyển sang MCP ([changelog](https://shopify.dev/changelog/posts/global-catalog-rest-api-stops-serving-traffic-on-november-2-2026)).
6. **Kênh thanh toán trong chat giới hạn nước:** 📖 Copilot chỉ cho khách ở Mỹ ([Shopify Help](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/ai-channels-with-built-in-checkout)).

## 7. Câu hỏi còn mở

- ⚠️ App có API để chỉnh Catalog mapping, hoặc ghi vào `agents.md.liquid` / `llms.txt.liquid` không.
- ⚠️ Giảm giá do app tạo có áp trong checkout của agent không.
- ⚠️ Shopify có kế hoạch bật `dev.ucp.common.loyalty` và mở cho app không.
- ⚠️ Cách phân biệt đơn đến từ AI trong admin / webhook.
