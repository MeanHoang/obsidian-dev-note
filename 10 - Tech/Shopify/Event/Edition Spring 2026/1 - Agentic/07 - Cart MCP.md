# Cart MCP

Cart MCP server implement UCP cart capability (`dev.ucp.shopping.cart`, version `2026-04-08`). Cart là "pre-checkout container for line items, localization context, and optional buyer information" — dùng để browse, iterate, ước tính total trước khi buyer sẵn sàng mua.

---

## Endpoint

```
POST https://{shop-domain}/api/ucp/mcp
```

Cart MCP chấp nhận **unauthenticated requests** — chỉ cần agent profile.

---

## 4 Tools

### 1. `create_cart`

Tạo cart mới với line items và localization context.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "create_cart",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json"
        }
      },
      "cart": {
        "line_items": [
          {
            "quantity": 2,
            "item": { "id": "gid://shopify/ProductVariant/12345678901" }
          }
        ],
        "context": {
          "address_country": "US",
          "address_region": "CA",
          "postal_code": "94105"
        }
      }
    }
  }
}
```

**Response chứa:**
- `cart.id` — `gid://shopify/Cart/cart_abc123`
- `cart.currency` — ISO currency code
- `cart.line_items` — array với item info, pricing, totals
- `cart.totals` — subtotal, total
- `cart.continue_url` — shareable cart URL
- `cart.expires_at` — expiration timestamp

CLI:
```bash
ucp cart create --business https://{shop}.example.com \
  --set /line_items/0/item/id='gid://shopify/ProductVariant/12345' \
  --set /line_items/0/quantity=1 \
  --set /context/address_country=US
```

---

### 2. `get_cart`

Lấy trạng thái hiện tại và refresh ước tính.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "get_cart",
    "arguments": {
      "meta": { "ucp-agent": { "profile": "..." } },
      "id": "gid://shopify/Cart/cart_abc123"
    }
  }
}
```

Nếu cart đã expire:
```json
{
  "messages": [{
    "type": "error",
    "code": "not_found",
    "content": "Cart not found or has expired",
    "severity": "unrecoverable"
  }]
}
```

---

### 3. `update_cart`

**PUT semantics** — replace toàn bộ cart state. Field bị bỏ sẽ bị **xóa**.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 2,
  "params": {
    "name": "update_cart",
    "arguments": {
      "meta": { "ucp-agent": { "profile": "..." } },
      "id": "gid://shopify/Cart/cart_abc123",
      "cart": {
        "line_items": [
          { "quantity": 3, "item": { "id": "gid://shopify/ProductVariant/12345678901" } },
          { "quantity": 1, "item": { "id": "gid://shopify/ProductVariant/22222222222" } }
        ],
        "context": {
          "address_country": "US",
          "address_region": "CA",
          "postal_code": "94105"
        }
      }
    }
  }
}
```

> [!warning] Quan trọng
> Mỗi `update_cart` replace **toàn bộ** state. Phải gửi complete desired state, không phải partial update.

---

### 4. `cancel_cart`

Hủy và xóa cart. Yêu cầu `idempotency-key` (UUID) để đảm bảo retry safety.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 3,
  "params": {
    "name": "cancel_cart",
    "arguments": {
      "meta": {
        "ucp-agent": { "profile": "..." },
        "idempotency-key": "660e8400-e29b-41d4-a716-446655440001"
      },
      "id": "gid://shopify/Cart/cart_abc123"
    }
  }
}
```

---

## Line Item Structure

```json
{
  "id": "gid://shopify/CartLine/li_1?cart=cart_abc123",
  "quantity": 2,
  "item": {
    "id": "gid://shopify/ProductVariant/12345678901",
    "title": "Organic Cotton Sweater",
    "price": 8900
  },
  "totals": [
    { "type": "subtotal", "amount": 17800, "display_text": "Subtotal" },
    { "type": "total", "amount": 17800, "display_text": "Total" }
  ]
}
```

---

## Localization Context

| Field | Mô tả | Ví dụ |
|---|---|---|
| `address_country` | ISO country code | `"US"` |
| `address_region` | State/province | `"CA"` |
| `postal_code` | Mã bưu chính | `"94105"` |

> Context **không phải** shipping address chính thức — chỉ là hint cho pricing/availability. Shipping address thật sẽ thu qua Checkout MCP.

---

## Error Handling

### Protocol errors (transport-level)

```json
{ "jsonrpc": "2.0", "id": 1, "error": { "code": -32000, "message": "Unauthorized" } }
```

### Business outcomes (application-level)

Trả trong `result` với `messages`:

```json
{
  "messages": [{
    "type": "warning",
    "code": "quantity_adjusted",
    "content": "Quantity adjusted; requested 100 units but only 12 available",
    "path": "$.line_items[0].quantity"
  }]
}
```

---

## Cart vs Checkout — Khi nào dùng gì?

| Scenario | Dùng |
|---|---|
| Browse, explore, ước tính total | Cart MCP |
| Share cart link cho buyer | Cart MCP (`continue_url`) |
| Buyer sẵn sàng mua | [[Checkout MCP]] |
| Complete đơn hàng | [[Checkout MCP]] (`complete_checkout`) |

---

## Docs gốc

- Cart MCP: https://shopify.dev/docs/agents/carts-and-checkout/cart-mcp
- Carts and checkout overview: https://shopify.dev/docs/agents/carts-and-checkout
