# Universal Commerce Protocol (UCP)

**Universal Commerce Protocol (UCP)** là một open standard cho phép AI agent thực hiện các thao tác commerce — từ discovery đến checkout — một cách chuẩn hóa, không cần custom integration cho từng merchant. UCP là "the common language for platforms, agents, and businesses."

---

## Kiến trúc & Thiết kế

UCP được xây trên nền các chuẩn công nghiệp:

- **REST / JSON-RPC** — transport layer
- **Model Context Protocol (MCP)** — cho AI agent gọi tool
- **Agent2Agent (A2A)** — giao tiếp giữa các agent
- **Agent Payments Protocol (AP2)** — xử lý thanh toán
- **OAuth 2.0** — account linking & identity

### Nguyên tắc thiết kế

| Nguyên tắc | Mô tả |
|---|---|
| Surface-agnostic | Hoạt động trên chat, voice, visual commerce |
| Business-centric | Merchant giữ quyền kiểm soát, giữ quan hệ khách hàng |
| Open & extensible | Community-driven capabilities, ai cũng có thể extend |
| Security-first | OAuth 2.0 cho identity, AP2 cho payment |

---

## Versioning

Các version hiện được hỗ trợ:

- `2026-04-08` (current)
- `2026-01-23`
- `draft`

Version được khai báo trong agent profile qua field `ucp.version`. Merchant và agent phải match version để negotiate thành công.

---

## Capability Model

UCP tổ chức chức năng commerce thành các **capability** riêng biệt, mỗi capability có version riêng:

| Capability | Mô tả |
|---|---|
| `dev.ucp.shopping.catalog.search` | Tìm kiếm sản phẩm |
| `dev.ucp.shopping.catalog.lookup` | Tra cứu sản phẩm theo ID |
| `dev.ucp.shopping.cart` | Quản lý giỏ hàng |
| `dev.ucp.shopping.checkout` | Checkout session |
| `dev.ucp.shopping.order` | Quản lý đơn hàng |
| `dev.ucp.shopping.fulfillment` | Shipping/fulfillment (extends checkout + cart) |
| `dev.ucp.shopping.discount` | Áp dụng discount (extends checkout + cart) |
| `dev.ucp.shopping.buyer_consent` | Consent management (extends checkout) |
| `dev.shopify.catalog` | Shopify-specific catalog extension |
| `dev.shopify.catalog.global` | Global catalog access |

Capabilities có thể `extends` capability khác — ví dụ `fulfillment` yêu cầu cả `checkout` và `cart` đã negotiate.

---

## Agent Profile & Negotiation

Agent khai báo capabilities qua một **profile** — JSON document host tại public URL.

### Cấu trúc profile

```json
{
  "ucp": {
    "version": "2026-04-08",
    "services": {
      "dev.ucp.shopping": [
        {
          "version": "2026-04-08",
          "spec": "<specification-url>",
          "transport": "mcp",
          "schema": "<schema-url>"
        }
      ]
    },
    "capabilities": {
      "dev.ucp.shopping.cart": [{ "version": "2026-04-08" }],
      "dev.ucp.shopping.checkout": [{ "version": "2026-04-08" }]
    },
    "payment_handlers": {}
  }
}
```

### Negotiation flow

1. Agent gửi request kèm profile URL qua `meta.ucp-agent.profile`
2. Shopify fetch profile, validate JSON
3. Kiểm tra tương thích `ucp.version`
4. **Capability intersection**: lọc capability match tên + version, prune dependency
5. Response trả về negotiated capabilities cho session

### Gửi profile trong request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "create_checkout",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/2026-04-08/valid-with-capabilities.json"
        }
      },
      "input": { "lines": [] }
    }
  }
}
```

---

## Error Handling trong Negotiation

| Lỗi | Mô tả |
|---|---|
| Missing UCP version | Profile thiếu `ucp.version` → negotiation fail |
| Unsupported version | Version không match → terminate ngay |
| Empty capabilities | Không có capability → intersection fail |
| Version mismatch | Partial negotiation — match thì active, không match thì bỏ |
| Profile too large | Vượt size limit → reject với `profile_too_large` |
| Malformed JSON | Parse fail |

Shopify cung cấp test fixtures tại: `https://shopify.dev/ucp/agent-profiles/[version]/[scenario].json`

---

## Implementation Options

| Mode | Mô tả |
|---|---|
| Native Checkout | Agent tích hợp trực tiếp với seller API, native UI |
| Embedded Checkout | Business-hosted UI, bidirectional communication |

---

## Ngành hàng hỗ trợ

- **Shopping** — đã có spec đầy đủ
- **Lodging** — đang phát triển, "detailed specifications coming soon"
- **Food** — đang phát triển

---

## Ecosystem

UCP được đồng phát triển bởi 11 công ty lớn: **Google, Shopify, Amazon, Walmart** và các đối tác khác. Hơn 50 tổ chức trong lĩnh vực retail, payments, logistics, hospitality đã endorse.

Spec là open-source, host trên GitHub với public SDK và reference implementation.

---

## Docs gốc

- UCP website: https://ucp.dev
- Shopify agents docs: https://shopify.dev/docs/agents
- Agent profiles: https://shopify.dev/docs/agents/profiles
- Profile definition guide: https://shopify.dev/docs/agents/get-started/profile
