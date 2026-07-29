# Catalog API — Technical Reference

Chi tiết kỹ thuật về cách gọi Catalog MCP, bao gồm endpoint, authentication, request/response format, và code example cho cả Global Catalog và Storefront Catalog.

---

## Endpoint

| Catalog | Endpoint |
|---|---|
| Global | `POST https://catalog.shopify.com/api/ucp/mcp` |
| Storefront | `POST https://{storeDomain}/api/ucp/mcp` |

Protocol: **JSON-RPC 2.0**. Mọi request gửi qua `method: "tools/call"`.

---

## Authentication

Mọi request **bắt buộc** kèm `meta.ucp-agent.profile` — URL trỏ tới agent profile (JSON document host tại public URL).

```json
"meta": {
  "ucp-agent": {
    "profile": "https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json"
  }
}
```

Với các operation yêu cầu auth cao hơn (Order, Checkout complete), cần Bearer token:

```bash
# Lấy token
curl -X POST https://api.shopify.com/auth/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "{your_client_id}",
    "client_secret": "{your_client_secret}",
    "grant_type": "client_credentials"
  }'
```

Response: `{ "access_token": "{jwt_token}" }` — TTL 60 phút, scope `read_global_api_catalog_search`.

Credentials lấy từ **Dev Dashboard > Catalogs > Get an API key**.

---

## Tool 1: `search_catalog`

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "search_catalog",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json"
        }
      },
      "catalog": {
        "query": "trail running shoes",
        "filters": {
          "price": { "max": 15000 },
          "attributes": [{ "name": "Color", "values": ["Black"] }],
          "ships_to": { "country": "US" }
        },
        "context": {
          "address_country": "US",
          "language": "en",
          "currency": "USD",
          "intent": "Customer prefers lightweight shoes"
        },
        "pagination": { "limit": 10 },
        "placements": ["affiliate"]
      }
    }
  }
}
```

### Parameters

| Parameter | Type | Required | Mô tả |
|---|---|---|---|
| `catalog.query` | string | Không | Free-text search query |
| `catalog.like` | array | Không | Image/product similarity search |
| `catalog.filters` | object | Không | Price, condition, ships_to, attributes, rating... |
| `catalog.context` | object | Không | address_country, language, currency, intent |
| `catalog.pagination` | object | Không | `cursor` + `limit` (1-50 Global, 1-250 Storefront) |
| `catalog.view` | string | Không | `"offer"` cho comparison shopping |
| `catalog.placements` | array | Không | `["affiliate"]` để blend sponsored results |

### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "structuredContent": {
      "ucp": {
        "version": "2026-04-08",
        "capabilities": {
          "dev.ucp.shopping.catalog.search": [{ "version": "2026-04-08" }]
        }
      },
      "products": [ ... ],
      "pagination": {
        "cursor": "eyJwYWdlIjoxfQ==",
        "has_next_page": true,
        "total_count": 24
      }
    }
  }
}
```

### CLI

```bash
ucp catalog search \
  --set /query='wireless headphones under $100' \
  --set /context/address_country=US \
  --view :compact \
  --format md
```

Storefront:

```bash
ucp catalog search --business https://{shop}.example.com \
  --set /query='cold brew' \
  --view :compact \
  --format md
```

---

## Tool 2: `lookup_catalog`

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "lookup_catalog",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json"
        }
      },
      "catalog": {
        "ids": [
          "gid://shopify/p/7f3a2b8c1d9e",
          "gid://shopify/ProductVariant/12345678"
        ],
        "context": { "address_country": "US" }
      }
    }
  }
}
```

### Parameters

| Parameter | Type | Required | Mô tả |
|---|---|---|---|
| `catalog.ids` | array | **Bắt buộc** | 1-50 (Global) hoặc 1-10 (Storefront) identifier |
| `catalog.filters` | object | Không | Giống search_catalog |
| `catalog.context` | object | Không | Localization |
| `catalog.view` | string | Không | `"offer"` hoặc default |

Chấp nhận format ID:
- `gid://shopify/p/{upid}` — Universal Product ID
- `gid://shopify/Product/{id}`
- `gid://shopify/ProductVariant/{id}`
- HTTP/HTTPS Shopify product URL

### Response

Variant trong response có `inputs` correlation:
```json
"inputs": [
  { "id": "gid://shopify/Product/123", "match": "featured" }
]
```

Và `not_found` message cho ID không resolve được.

### CLI

```bash
ucp catalog lookup \
  --set '/ids/0=gid://shopify/ProductVariant/12345'
```

---

## Tool 3: `get_product`

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "id": 1,
  "params": {
    "name": "get_product",
    "arguments": {
      "meta": {
        "ucp-agent": {
          "profile": "https://shopify.dev/ucp/agent-profiles/examples/2026-04-08/valid-with-capabilities.json"
        }
      },
      "catalog": {
        "id": "gid://shopify/Product/123",
        "selected": [{ "name": "Color", "label": "Blue" }],
        "preferences": [{ "name": "Color" }, { "name": "Size" }],
        "context": { "address_country": "US" }
      }
    }
  }
}
```

### Parameters

| Parameter | Type | Required | Mô tả |
|---|---|---|---|
| `catalog.id` | string | **Bắt buộc** | Product/variant GID |
| `catalog.selected` | array | Không | Option selections: `[{"name": "Color", "label": "Blue"}]` |
| `catalog.preferences` | array | Không | Thứ tự ưu tiên relaxation nếu selected ko available |
| `catalog.filters` | object | Không | Availability, shipping, condition |
| `catalog.context` | object | Không | Localization |
| `catalog.view` | string | Không | `"summary"` hoặc default |

### Response key fields

Option values trả kèm availability signal:

```json
"options": [
  {
    "name": "Color",
    "values": [
      { "label": "Blue", "available": true, "exists": true },
      { "label": "Green", "available": false, "exists": true }
    ]
  }
]
```

- `available`: variant với option này còn hàng
- `exists`: variant với option này tồn tại (dù hết hàng)

`product.selected` phản ánh effective selections sau khi xử lý.

### CLI

```bash
ucp catalog get_product gid://shopify/Product/67890 \
  --business https://{shop}.example.com \
  --set '/selected/0={"name":"Color","label":"Black"}'
```

---

## Response Metadata

Mọi response đều kèm UCP metadata:

```json
"ucp": {
  "version": "2026-04-08",
  "capabilities": {
    "dev.ucp.shopping.catalog.search": [{ "version": "2026-04-08" }],
    "dev.shopify.catalog.global": [{ "version": "2026-04-08" }]
  }
}
```

---

## Tool Discovery

Gọi `tools/list` method để lấy danh sách tool available dựa trên capability đã negotiate.

---

## Ràng buộc

- Không cache kết quả search hoặc image
- Rate limit áp dụng — keyless access không hỗ trợ tăng limit
- API URL có thể thay đổi
- Giá luôn ở **minor units** (cent cho USD)
- Identifier dùng Shopify GraphQL Global ID format

---

## Docs gốc

- Global Catalog MCP: https://shopify.dev/docs/agents/catalog/global-catalog
- Storefront Catalog MCP: https://shopify.dev/docs/agents/catalog/storefront-catalog
- Catalog MCP server: https://shopify.dev/docs/agents/catalog/mcp
- Search Catalog walkthrough: https://shopify.dev/docs/agents/get-started/search-catalog
- Authentication: https://shopify.dev/docs/agents/get-started/authentication
