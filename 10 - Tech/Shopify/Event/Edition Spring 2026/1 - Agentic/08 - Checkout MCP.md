# Checkout MCP

Checkout MCP server implement UCP checkout capability (`dev.ucp.shopping.checkout`). Cho phép agent tạo checkout session, update thông tin, và complete order — hoặc escalate buyer sang merchant storefront.

---

## Endpoint & Auth

```
POST https://{shop-domain}/api/ucp/mcp
```

### Lấy access token

```bash
curl -X POST https://api.shopify.com/auth/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "{your_client_id}",
    "client_secret": "{your_client_secret}",
    "grant_type": "client_credentials"
  }'
```

Response: `{ "access_token": "{jwt}", "scope": "...", "expires_in": 3599 }`

Kèm header: `Authorization: Bearer {token}` — TTL 60 phút.

---

## 5 Tools

### 1. `create_checkout`

Tạo checkout session mới, có thể convert từ cart.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "create_checkout",
    "arguments": {
      "meta": {
        "ucp-agent": { "profile": "..." }
      },
      "cart_id": "gid://shopify/Cart/cart_abc123",
      "checkout": {
        "currency": "USD",
        "line_items": [
          { "quantity": 2, "item": { "id": "gid://shopify/ProductVariant/12345678901" } }
        ],
        "buyer": { "email": "buyer@example.com" },
        "fulfillment": {
          "methods": [{
            "type": "shipping",
            "destinations": [{
              "first_name": "Jane", "last_name": "Smith",
              "street_address": "123 Main Street",
              "address_locality": "Brooklyn", "address_region": "NY",
              "postal_code": "11201", "address_country": "US"
            }]
          }]
        }
      }
    }
  }
}
```

Khi có `cart_id`, `checkout` parameter trở thành optional. Cart contents **override** overlapping checkout fields. Idempotent — gọi lại với cùng `cart_id` trả về checkout đã tạo.

**Cart conversion error codes:**
- `invalid_cart_id` — GID format sai
- `cart_not_found` — cart không tồn tại hoặc đã expire

---

### 2. `get_checkout`

Lấy trạng thái hiện tại của checkout session.

```json
{
  "params": {
    "name": "get_checkout",
    "arguments": {
      "meta": { "ucp-agent": { "profile": "..." } },
      "id": "gid://shopify/Checkout/abc123?key=xyz789"
    }
  }
}
```

---

### 3. `update_checkout`

**PUT semantics** — replace toàn bộ checkout state. Field bị bỏ sẽ bị **xóa**.

```json
{
  "params": {
    "name": "update_checkout",
    "arguments": {
      "meta": { "ucp-agent": { "profile": "..." } },
      "id": "gid://shopify/Checkout/abc123?key=xyz789",
      "checkout": {
        "line_items": [
          { "quantity": 1, "item": { "id": "gid://shopify/ProductVariant/12345678901" } }
        ],
        "fulfillment": {
          "methods": [{
            "type": "shipping",
            "destinations": [{
              "first_name": "Jane", "last_name": "Smith",
              "street_address": "456 Oak Avenue",
              "address_locality": "Manhattan", "address_region": "NY",
              "postal_code": "10001", "address_country": "US"
            }]
          }]
        }
      }
    }
  }
}
```

---

### 4. `complete_checkout`

Finalize payment, đặt hàng. **Bắt buộc** `idempotency-key` (UUID).

```json
{
  "params": {
    "name": "complete_checkout",
    "arguments": {
      "meta": {
        "ucp-agent": { "profile": "..." },
        "idempotency-key": "661e9500-f39c-52e5-b827-557766551111"
      },
      "id": "gid://shopify/Checkout/abc123?key=xyz789",
      "checkout": {
        "payment": {
          "instruments": [{
            "id": "pm_1234567890abc",
            "handler_id": "gpay_7k2m",
            "type": "card"
          }]
        }
      }
    }
  }
}
```

**Preconditions:**
- Checkout status phải là `ready_for_complete`
- Buyer đã review và confirm
- Payment credential đã thu thập

Success response trả `status: "completed"` kèm `order.id` và `order.permalink_url`.

---

### 5. `cancel_checkout`

Hủy checkout session. Bắt buộc `idempotency-key`.

```json
{
  "params": {
    "name": "cancel_checkout",
    "arguments": {
      "meta": {
        "ucp-agent": { "profile": "..." },
        "idempotency-key": "772f0611-g40d-63f6-c938-668877662222"
      },
      "id": "gid://shopify/Checkout/abc123?key=xyz789"
    }
  }
}
```

---

## Checkout Status Lifecycle

```
incomplete → requires_escalation → ready_for_complete → complete_in_progress → completed
     ↓              ↓                      ↓
  canceled       canceled              canceled
```

| Status | Mô tả | Next action |
|---|---|---|
| `incomplete` | Thiếu thông tin | `update_checkout` để fix recoverable messages |
| `requires_escalation` | Cần buyer input ngoài API | Redirect buyer tới `continue_url` |
| `ready_for_complete` | Đủ thông tin | `complete_checkout` hoặc handoff qua `continue_url` |
| `complete_in_progress` | Đang xử lý | Chờ status cuối |
| `completed` | Đặt hàng thành công | Show order confirmation |
| `canceled` | Session đã hủy/hết hạn | Tạo session mới nếu cần |

---

## Message Severity

| Severity | Mô tả |
|---|---|
| `recoverable` | Fix được qua `update_checkout` API |
| `requires_buyer_input` | Buyer phải cung cấp info (address, payment) |
| `requires_buyer_review` | Buyer chưa opt-in channel hoặc cần review |

---

## Escalation Flow

Khi `status` = `requires_escalation`, redirect buyer tới `continue_url`. Merchant storefront xử lý phần còn lại.

```bash
# Auto-open browser khi escalation
export UCP_ON_ESCALATION='jq -r .url | xargs open'
```

UTM tracking:
```
https://merchant.example/checkout/cn/...?utm_source=your_agent&utm_medium=agentic_commerce
```

---

## Response Structure

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "structuredContent": {
      "ucp": { "version": "2026-01-23", "capabilities": { ... } },
      "id": "gid://shopify/Checkout/abc123?key=xyz789",
      "status": "incomplete",
      "currency": "USD",
      "buyer": { "email": "..." },
      "line_items": [ ... ],
      "totals": [
        { "type": "subtotal", "amount": 8900 },
        { "type": "fulfillment", "amount": 599 },
        { "type": "tax", "amount": 780 },
        { "type": "total", "amount": 10279 }
      ],
      "fulfillment": { ... },
      "payment": { "instruments": [ ... ] },
      "messages": [ ... ],
      "continue_url": "https://...",
      "expires_at": "2026-04-01T00:00:00Z"
    }
  }
}
```

---

## Error Handling

**Protocol error** (auth, rate limit):
```json
{ "error": { "code": -32000, "message": "Unauthorized" } }
```

**Business outcome** (invalid address, declined payment):
```json
{
  "result": {
    "structuredContent": {
      "status": "incomplete",
      "messages": [{
        "type": "error",
        "code": "address_invalid",
        "content": "Shipping address is missing a postal code",
        "path": "$.fulfillment.methods[0].destinations[0].postal_code"
      }]
    }
  }
}
```

---

## Rate Limiting

> Checkout MCP bị rate-limit **nghiêm ngặt hơn** Cart MCP ở mọi tier.

Best practice: iterate nội dung ở [[Cart MCP]], chỉ tạo checkout khi buyer sẵn sàng mua.

---

## Docs gốc

- Checkout MCP: https://shopify.dev/docs/agents/carts-and-checkout/checkout-mcp
- Carts and checkout overview: https://shopify.dev/docs/agents/carts-and-checkout
- Auth and rate limiting: https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting
