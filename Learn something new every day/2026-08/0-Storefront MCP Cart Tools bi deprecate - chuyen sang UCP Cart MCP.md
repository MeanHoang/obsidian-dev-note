# 0 — Storefront MCP cart tools bị deprecate, chuyển sang UCP Cart MCP

> [!quote] 💬
> "The cart tools on the Storefront MCP server are being deprecated in favour of the UCP-conforming Cart MCP tools." — [Shopify developer changelog, 24/06/2026](https://shopify.dev/changelog/storefront-mcp-cart-tools-are-being-deprecated-in-favour-of-ucp-cart-mcp)

---
## 🎯 Tóm tắt changelog

| Thông tin | Giá trị (nguyên văn từ trang) |
|---|---|
| Ngày công bố | **June 24, 2026** |
| Flags | `Deprecation announcement` · **`Action required`** |
| Surfaces | `API` |
| Bị deprecate | `get_cart` và `update_cart` trên `https://{shop}.myshopify.com/api/mcp` |
| Thay bằng | Cart MCP tools trên `https://{shop-domain}/api/ucp/mcp` |
| UCP capability | `dev.ucp.shopping.cart`, version **`2026-04-08`** |
| Deadline | *"The deprecated tools will be maintained until **August 31, 2026**, but all documentation will refer to the Cart MCP tools."* |

Nói ngắn: Shopify không chỉ đổi tên tool — họ **dời cart sang một endpoint khác, theo một protocol khác (UCP)**, và tắt đường cũ sau 31/08/2026.

> [!note] 📝 So sánh dễ hiểu
> Tưởng tượng bạn có một **shop mặt phố**. Trước giờ mỗi hãng giao hàng (Grab, Ahamove, shipper riêng) đều tự chế một cái cửa sau riêng để vào lấy đơn — mỗi hãng một kiểu chuông, một kiểu sổ ghi. Đó là **MCP kiểu cũ, mỗi nền tảng một cách nói chuyện**.
>
> Giờ cả khu phố thống nhất: **một cửa chuẩn, một mẫu phiếu chuẩn**, ai đến cũng phải xuất trình **thẻ nhân viên** (đó là `ucp-agent.profile`) rồi mới được vào. Cửa cũ vẫn để hé tới cuối tháng 8, sau đó khoá hẳn. Đó là **UCP**.
>
> Và cái *giỏ hàng* trong câu chuyện này quan trọng vì nó là chỗ AI agent thay mặt khách bỏ đồ vào — trước khi tiền thật sự chuyển đi.

---
## 🧩 MCP, Storefront MCP, UCP — phân biệt cho rõ

- **MCP (Model Context Protocol)** — chuẩn để AI agent gọi được "tool" từ hệ thống bên ngoài. Agent không đoán mò, nó gọi hàm có schema rõ ràng.
- **Storefront MCP** — server MCP của riêng Shopify, đặt tại `https://{shop}.myshopify.com/api/mcp`. Đây là **đồ Shopify-specific**, chỉ nói chuyện được với shop Shopify.
- **UCP (Universal Commerce Protocol)** — theo [shopify.engineering/UCP](https://shopify.engineering/UCP): *"We co-developed UCP with Google to create an open standard for AI agents to connect and transact with any merchant."* Được hậu thuẫn bởi **Etsy, Target, Walmart, Wayfair** và merchant Shopify.

Lý do đổi, trích từ bài engineering: *"Monolithic protocols eventually collapse under complexity: too rigid to adapt, too slow to evolve."* UCP thiết kế theo hướng **capability negotiation** — merchant khai báo mình hỗ trợ capability gì (kể cả bespoke functionality), agent discover rồi thương lượng xem nó xử lý được cái nào.

Theo [docs/agents](https://shopify.dev/docs/agents), UCP chia làm 4 giai đoạn: **Negotiate and Authenticate → Discover Products (Global Catalog / Storefront Catalog) → Build Carts & Checkout (Cart MCP + Checkout MCP) → Monitor Orders (Order MCP + Order Webhooks)**. Cart MCP chỉ là **một mảnh** trong bức tranh đó — nên đừng migrate cart xong rồi tưởng là xong việc.

---
## 🔀 Mapping tool cũ → tool mới

| Storefront MCP (cũ) `/api/mcp` | Cart MCP (mới) `/api/ucp/mcp` | Ghi chú |
|---|---|---|
| — (không có) | **`create_cart`** | *"Create a new cart with line items and optional buyer context."* Trước đây tạo cart là tác dụng phụ của `update_cart`; giờ tách hẳn ra. |
| `get_cart` ⚠️ deprecated | **`get_cart`** | *"Retrieve the current state of a cart."* Cùng tên nhưng **khác endpoint + khác schema**. |
| `update_cart` ⚠️ deprecated | **`update_cart`** | *"Replace the cart's contents."* — **PUT semantics**, xem cảnh báo bên dưới. |
| — (không có) | **`cancel_cart`** | *"Cancel a cart."* Bắt buộc kèm `meta["idempotency-key"]` (UUID). |

> [!warning] ⚠️ `search_shop_policies_and_faqs` thì sao?
> Changelog **không nhắc tới** tool này — nó vẫn chỉ nằm trên `/api/mcp`. Có [thread trên Shopify Developer Community](https://community.shopify.dev/t/no-ucp-successor-for-search-shop-policies-and-faqs-before-the-aug-31-sunset/36802) hỏi đúng chuyện này và **chưa có câu trả lời chính thức từ Shopify staff** tại thời điểm ghi note. Người hỏi tự kết luận: *"only the cart tools were deprecated, not the endpoint."* → Tức là **endpoint `/api/mcp` chưa bị tắt**, chỉ 2 cart tool bị deprecate. Nhưng đây là suy luận của community, không phải cam kết của Shopify — nếu app bạn phụ thuộc tool này thì nên theo dõi tiếp.

---
## 💻 Code: trước vs sau

**❌ Trước (Storefront MCP, sẽ chết sau 31/08/2026):**
```js
// endpoint cũ, không có meta, không cần agent profile
const res = await fetch(`https://${shop}.myshopify.com/api/mcp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    id: 1,
    params: {
      name: 'update_cart',
      arguments: { /* payload kiểu cũ */ },
    },
  }),
});
```

**✅ Sau (Cart MCP theo UCP)** — payload dưới đây lấy nguyên văn từ [docs Cart MCP](https://shopify.dev/docs/agents/carts-and-checkout/cart-mcp):
```js
const UCP_ENDPOINT = `https://${shopDomain}/api/ucp/mcp`;

// meta bắt buộc có mặt trong MỌI request
const meta = {
  'ucp-agent': {
    profile:
      'https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json',
  },
};

async function callCartTool(name, args, id = 1) {
  const res = await fetch(UCP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      id,
      params: { name, arguments: { meta, ...args } },
    }),
  });
  return res.json();
}

// 1. Tạo cart
const created = await callCartTool('create_cart', {
  cart: {
    line_items: [
      { quantity: 2, item: { id: 'gid://shopify/ProductVariant/12345678901' } },
    ],
    context: { address_country: 'US' },
  },
});

const { id, currency, continue_url, expires_at } =
  created.result.structuredContent.cart;
// continue_url ví dụ: https://shop.example.com/cart/c/cart_abc123
```

**PUT semantics — chỗ dễ vỡ nhất khi migrate:**
```js
// ❌ SAI: tưởng là PATCH, chỉ gửi item muốn thêm
await callCartTool('update_cart', {
  cart: { id, line_items: [{ quantity: 1, item: { id: newVariantGid } }] },
});
// → 2 item cũ BIẾN MẤT. Docs nói rõ:
// "Each request replaces the cart's full state with the payload you send.
//  Omit a field and it's removed from the cart."

// ✅ ĐÚNG: đọc state hiện tại, merge ở client, gửi ĐẦY ĐỦ line_items
const current = (await callCartTool('get_cart', { cart: { id } }))
  .result.structuredContent.cart;

await callCartTool('update_cart', {
  cart: {
    id,
    line_items: [
      ...current.line_items,
      { quantity: 1, item: { id: newVariantGid } },
    ],
  },
});
```

**`cancel_cart` bắt buộc idempotency-key:**
```js
await callCartTool('cancel_cart', { cart: { id } }, 2, {
  ...meta,
  'idempotency-key': crypto.randomUUID(), // Node 18+ / Cloud Run OK
});
```

> [!tip] 💡 Cart ≠ Checkout
> Docs ghi: cart cho phép **unauthenticated** iteration về item và total; checkout thì **yêu cầu authentication** và là purchase đang chạy thật. Đường nối giữa hai bên: *"convert a cart from Cart MCP into a checkout by passing the cart's `id` as `cart_id` on `create_checkout`."* Ngoài ra `continue_url` dùng để **đưa cart cho buyer thật mở trên browser** trước khi checkout — rất hữu ích nếu muốn agent dừng lại cho người xác nhận.

---
## 🚨 Rủi ro nếu không migrate kịp

> [!warning] ⚠️ Sau 31/08/2026
> - `get_cart` / `update_cart` trên `/api/mcp` **hết được maintain**. Changelog gắn flag **`Action required`** — không phải loại "biết cho vui".
> - Docs đã **ngừng nhắc tới tool cũ ngay từ 24/06/2026** (*"all documentation will refer to the Cart MCP tools"*). Nghĩa là từ giờ debug tool cũ bạn sẽ không còn tài liệu để tra.
> - Đây là **breaking change im lặng**: đổi endpoint sẽ fail ồn ào (dễ phát hiện), nhưng bỏ sót **PUT semantics** thì code vẫn chạy, chỉ có điều **giỏ hàng của khách bị xoá mất item** — bug kiểu này ra production rồi mới lộ, và nó nằm đúng trên path tiền.
> - `meta.ucp-agent.profile` thiếu → request bị từ chối. Đừng để nó là hằng số hardcode rải rác, gom vào 1 chỗ.

---
## 🛠️ Áp vào công việc thế nào

Với app loyalty/retention kiểu **Joy Loyalty**, cart là nơi điểm thưởng gặp tiền thật, nên đợt đổi này chạm đúng vùng nhạy cảm:

- **Kiểm tra trước: app mình có thật sự gọi Storefront MCP không?** Rất nhiều Shopify app loyalty hiện chỉ đụng Storefront API / Cart Ajax API / Function — không dính MCP. Grep codebase tìm `/api/mcp`, `update_cart`, `tools/call` trước khi hoảng. Nếu không có kết quả → note này là chuẩn bị cho tương lai, không phải việc gấp.
- **Nếu có tích hợp agent:** mọi flow "AI agent thêm sản phẩm / đổi quà vào giỏ" phải chuyển sang `create_cart` + `update_cart` của Cart MCP, và **bọc lại thành 1 module JS duy nhất** (`ucpCart.js`) thay vì gọi fetch rải rác — vì schema UCP còn version hoá (`2026-04-08`), sẽ còn đổi tiếp.
- **PUT semantics vs logic reward:** flow "redeem 500 điểm → thêm free gift vào cart" mà gửi thiếu `line_items` sẽ **xoá sạch giỏ của khách nhưng vẫn trừ điểm**. Bắt buộc: `get_cart` → merge → `update_cart`, và **chỉ trừ điểm SAU khi response cart trả về có đúng free gift**. Đây là chỗ tuyệt đối không được lười (xem [[0-Ponytail - Lazy Senior Dev cho AI Agent]] — mục "khi nào KHÔNG được lười").
- **Discount / mã giảm giá:** docs Cart MCP **không nêu** cách áp discount code programmatically trong tool; chỗ duy nhất nhắc discount là cart permalink — *"append query parameters to prefill buyer information, apply discounts…"*. Tức là hiện tại, muốn agent áp discount của loyalty app thì hướng khả dĩ là qua **`continue_url` / cart permalink**, chứ chưa thấy field trong tool schema. **Chưa rõ** Shopify có bổ sung capability discount riêng cho UCP không — cần theo dõi.
- **Idempotency là bạn của Firebase:** `cancel_cart` yêu cầu UUID idempotency-key — dùng luôn pattern này cho mọi Cloud Function ghi điểm: lưu key vào Firestore doc id để retry của Cloud Tasks không cộng điểm hai lần.
- **Đừng chỉ nhìn cart:** UCP có cả **Order MCP + Order Webhooks** cho "Monitor Orders". Với loyalty, order webhook mới là nguồn sự thật để cộng điểm — nếu ecosystem dịch chuyển sang UCP thì phần này đáng đọc trước khi Shopify ra changelog tiếp theo.

---
## 📚 Tham khảo

- 🔥 [Storefront MCP cart tools are being deprecated in favour of UCP Cart MCP](https://shopify.dev/changelog/storefront-mcp-cart-tools-are-being-deprecated-in-favour-of-ucp-cart-mcp) — changelog gốc 24/06/2026: nêu chính xác 2 tool bị deprecate, 4 tool thay thế, deadline 31/08/2026 và 4 việc phải làm khi migrate.
- [Cart MCP — shopify.dev/docs/agents/carts-and-checkout/cart-mcp](https://shopify.dev/docs/agents/carts-and-checkout/cart-mcp) — docs chính thức của server mới: endpoint, capability `dev.ucp.shopping.cart` v`2026-04-08`, schema `meta`, ví dụ JSON-RPC create_cart, giải thích PUT semantics và `continue_url`.
- [Carts and checkout](https://shopify.dev/docs/agents/carts-and-checkout) — quan hệ Cart MCP ↔ Checkout MCP, cách convert cart sang checkout bằng `cart_id` trên `create_checkout`, cart permalink.
- [Build commerce agents with UCP — shopify.dev/docs/agents](https://shopify.dev/docs/agents) — bản đồ tổng: 4 giai đoạn Negotiate/Discover/Cart-Checkout/Orders, Global Catalog vs Storefront Catalog, trust tiers.
- [Storefront MCP server](https://shopify.dev/docs/apps/build/storefront-mcp/servers/storefront) — trang server cũ, còn liệt kê `get_cart` / `update_cart` / `search_shop_policies_and_faqs` trên `/api/mcp`; đối chiếu để biết mình đang gọi cái nào.
- [Building the Universal Commerce Protocol (2026) — Shopify Engineering](https://shopify.engineering/UCP) — lý do đằng sau: đồng phát triển với Google, "monolithic protocols eventually collapse under complexity", capability negotiation, danh sách bên hậu thuẫn.
- [Community: No UCP successor for `search_shop_policies_and_faqs`](https://community.shopify.dev/t/no-ucp-successor-for-search-shop-policies-and-faqs-before-the-aug-31-sunset/36802) — thread mở, chưa có câu trả lời chính thức; theo dõi nếu app dùng tool này.

---
## ✅ Checklist migrate

- [ ] Grep codebase: `/api/mcp`, `update_cart`, `get_cart`, `tools/call` — xác nhận có/không dính MCP
- [ ] Đổi endpoint sang `https://{shop-domain}/api/ucp/mcp`
- [ ] Thêm `meta["ucp-agent"].profile` vào **mọi** request (gom về 1 module JS chung)
- [ ] Thay flow "tạo cart" bằng `create_cart` thay vì lợi dụng `update_cart`
- [ ] Sửa `update_cart` sang PUT semantics: `get_cart` → merge → gửi **full** `line_items`
- [ ] Viết test cho case "thêm 1 item vào cart đã có 2 item" — phải còn đủ 3, không mất item
- [ ] `cancel_cart`: sinh `meta["idempotency-key"]` bằng `crypto.randomUUID()`
- [ ] Đọc lại request/response schema mới, sửa mọi chỗ parse `result.structuredContent.cart`
- [ ] Chỉ trừ điểm loyalty **sau khi** cart response xác nhận thành công
- [ ] Xử lý `expires_at` của cart — cart hết hạn thì reward đã issue phải rollback
- [ ] Xem xét dùng `continue_url` để buyer xác nhận trước khi checkout
- [ ] Theo dõi số phận `search_shop_policies_and_faqs` trên `/api/mcp`
- [ ] Hoàn tất **trước 31/08/2026**
