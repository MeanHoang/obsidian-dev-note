# Order MCP & Webhooks

Order MCP cho phép agent lấy trạng thái đơn hàng (line items, fulfillment events, adjustments). Order Webhooks push thay đổi real-time tới endpoint đã đăng ký.

---

## Order MCP

### Endpoint & Auth

```
POST https://{shop-domain}/api/ucp/mcp
```

**Yêu cầu:**
- **Token-tier** agents only (không hỗ trợ Signed hoặc Anonymous)
- Global API JWT với scope `read_global_api_orders`
- Profile phải declare `dev.ucp.shopping.order`
- Chỉ fetch được order **đặt qua agent của mình**

### Lấy token

```bash
curl -X POST https://api.shopify.com/auth/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "{your_client_id}",
    "client_secret": "{your_client_secret}",
    "grant_type": "client_credentials"
  }'
```

Response: `{ "access_token": "...", "scope": "read_global_api_orders", "expires_in": 3599 }`

---

### Tool: `get_order`

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "get_order",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/2026-04-08/valid-with-capabilities.json"
        }
      },
      "id": "gid://shopify/Order/6252199051413"
    }
  }
}
```

### Response structure

| Field | Type | Mô tả |
|---|---|---|
| `id` | string | Order Global ID |
| `label` | string | Buyer-facing ID (`#1042`) |
| `checkout_id` | string | Originating checkout GID |
| `permalink_url` | string | Order status page URL |
| `currency` | string | ISO 4217 |
| `totals` | array | Money breakdown |
| `line_items` | array | Purchased items |
| `fulfillment` | object | Expectations + event timeline |
| `adjustments` | array | Post-purchase changes |

### Totals

Typed money rows (signed integers, minor units):
- `items_discount`, `subtotal`, `discount`, `fulfillment`, `tax`, `fee`, `total`

### Line Items

```json
{
  "id": "gid://shopify/LineItem/14584740544661",
  "item": {
    "id": "gid://shopify/ProductVariant/46040179376277",
    "title": "Large / Black",
    "price": 3999,
    "image_url": "https://cdn.shopify.com/..."
  },
  "quantity": { "original": 2, "total": 1, "fulfilled": 1 },
  "status": "fulfilled"
}
```

**Status values:** `processing`, `partial`, `fulfilled`, `removed`

### Fulfillment Events

Event types theo category:

| Category | Events |
|---|---|
| Creation | `shipped`, `ready` |
| Tracking | `carrier_picked_up`, `confirmed`, `in_transit`, `out_for_delivery`, `attempted_delivery`, `delivered`, `ready_for_pickup`, `picked_up`, `delayed`, `buyer_action_required`, `returning_to_sender` |
| Cancellation | `fulfillment_canceled` |

### Adjustments

```json
{
  "type": "return",
  "occurred_at": "2026-03-27T11:00:00-04:00",
  "status": "completed",
  "totals": [{ "type": "total", "amount": -3999 }],
  "line_items": [{ "id": "...", "quantity": -1 }]
}
```

**Adjustment types:** `refund`, `cancellation`, `return`, `exchange`, `order_edit`, `sale_transaction`, `capture_transaction`, `refund_transaction`

### Error Codes

| Code | Severity | Mô tả |
|---|---|---|
| `invalid_order_id` | recoverable | Format GID sai |
| `order_not_found` | unrecoverable | Order không tồn tại hoặc không phải agent đặt |
| `orders_not_allowed` | unrecoverable | Thiếu scope `read_global_api_orders` |

---

## Order Webhooks

### Subscription

> **Không có self-serve API.** Liên hệ Shopify partner manager để đăng ký/chỉnh sửa webhook.

UCP profile có thể khai báo `webhook_url`, nhưng Shopify **chưa honor** field này (docs chưa đề cập thời điểm hỗ trợ).

### Topics

| Topic | Trigger |
|---|---|
| `orders/create` | Order mới đặt qua agent |
| `orders/updated` | Thay đổi (payment, fulfillment, adjustments...) |
| `orders/delete` | Order bị xóa (payload chứa last-known state) |

> Route tất cả webhook qua **một handler** — không branch theo topic name.

### Delivery

- Protocol: **HTTPS POST** với JSON body
- Retry: tối đa **8 lần** trong **4 giờ**, exponential backoff
- Response: trả **2xx nhanh**, xử lý async

### Request Headers

| Header | Mô tả |
|---|---|
| `X-Shopify-Topic` | `orders/create`, `orders/updated`, `orders/delete` |
| `X-Shopify-Shop-Domain` | Merchant domain |
| `X-Shopify-API-Version` | `2026-04` |
| `X-Shopify-Triggered-At` | RFC 3339 timestamp (nanosecond) |
| `X-Shopify-Webhook-Id` | Unique delivery ID (dùng để deduplicate) |
| `X-Shopify-Hmac-SHA256` | Base64 HMAC-SHA256 signature |
| `X-Shopify-Event-Id` | Shared across deliveries cùng merchant action |

### HMAC Verification

Signature: `base64(HMAC-SHA256(raw_body, client_secret))`

`client_secret` lấy từ Dev Dashboard > Catalog section.

**Node.js:**

```javascript
import crypto from "node:crypto";

function verifyOrderWebhook(rawBody, headers, sharedSecret) {
  const provided = headers["x-shopify-hmac-sha256"];
  if (!provided) return false;
  const computed = crypto
    .createHmac("sha256", sharedSecret)
    .update(rawBody)
    .digest("base64");
  const providedBuf = Buffer.from(provided, "utf8");
  const computedBuf = Buffer.from(computed, "utf8");
  if (providedBuf.length !== computedBuf.length) return false;
  return crypto.timingSafeEqual(providedBuf, computedBuf);
}
```

### Payload

Payload webhook **trùng format** với `get_order` response — full current state of order.

```json
{
  "ucp": { "version": "2026-04-08", "capabilities": { ... } },
  "id": "gid://shopify/Order/6252199051413",
  "label": "#1042",
  "currency": "USD",
  "totals": [
    { "type": "subtotal", "amount": 6298 },
    { "type": "fulfillment", "amount": 899 },
    { "type": "tax", "amount": 780 },
    { "type": "total", "amount": 7977 }
  ],
  "line_items": [ ... ],
  "fulfillment": {
    "expectations": [ ... ],
    "events": [
      {
        "type": "shipped",
        "occurred_at": "2026-03-25T14:30:00-04:00",
        "tracking_number": "1Z999AA10123456784",
        "tracking_url": "https://...",
        "carrier": "UPS"
      }
    ]
  },
  "adjustments": [ ... ]
}
```

### Best Practices

- Treat latest delivery là **authoritative source** — không merge/replay events
- **Deduplicate** bằng `X-Shopify-Webhook-Id`
- Respond **nhanh** (2xx), process async
- Dùng `permalink_url` trong buyer UI cho full order timeline
- **Không poll** — dùng webhook là primary channel, `get_order` chỉ cho buyer-initiated query
- Cho 10s propagation delay sau checkout completion trước lần `get_order` đầu
- Mint fresh token mỗi session (TTL 60 phút)

---

## Docs gốc

- Order MCP: https://shopify.dev/docs/agents/orders/order-mcp
- Order Webhooks: https://shopify.dev/docs/agents/orders/order-webhooks
