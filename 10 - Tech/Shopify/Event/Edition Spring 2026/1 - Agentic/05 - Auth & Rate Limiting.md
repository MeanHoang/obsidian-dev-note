# Auth & Rate Limiting

Tổng hợp cách agent xác thực với Shopify và các giới hạn rate limit theo tier.

---

## 3 Authentication Tiers

### 1. Token (cao nhất)

- **Method**: JWT Bearer token — `Authorization: Bearer {token}`
- Credentials lấy từ **Dev Dashboard > Catalogs > Get an API key**
- Token exchange qua `POST https://api.shopify.com/auth/access_token`

```bash
curl -X POST https://api.shopify.com/auth/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "{client_id}",
    "client_secret": "{client_secret}",
    "grant_type": "client_credentials"
  }'
```

- TTL: **60 phút**
- Scope ví dụ: `read_global_api_catalog_search`, `read_global_api_orders`

### 2. Signed

- **Method**: HTTP Message Signatures theo **RFC 9421** dùng **ECDSA P-256**
- Public key publish trong agent's well-known UCP profile
- Không cần tạo API key
- Tham khảo UCP signatures spec để construct request

### 3. Anonymous (thấp nhất)

- **Method**: Không credentials, không signature
- Gửi request **không có** `Authorization` header hoặc signature headers

---

## Capability Matrix theo Tier

| Tier | Catalog | Cart | Checkout | `complete_checkout` | Orders |
|---|---|---|---|---|---|
| **Token** | Yes | Yes | Yes | When permitted | Yes (scope `read_global_api_orders`) |
| **Signed** | Yes | Yes | Yes | No | No |
| **Anonymous** | Yes | Yes | Yes | No | No |

---

## Rate Limiting

Cấu trúc rate limit 3 cấp:

```
Token > Signed > Anonymous
```

**Nguyên tắc chung:**
- Checkout MCP bị rate-limit **nghiêm ngặt hơn** Cart MCP ở **mọi** tier
- Retry theo HTTP `Retry-After` header + exponential backoff

> [!note]
> Docs **không công bố** con số rate limit cụ thể (requests/minute...).

---

## Scopes

| Scope | Mô tả |
|---|---|
| `read_global_api_catalog_search` | Tìm kiếm Global Catalog |
| `read_global_api_orders` | Truy cập Order MCP (chỉ order đặt qua agent) |

---

## Best Practices

- Dùng [[Cart MCP]] để iterate, chỉ tạo checkout khi buyer sẵn sàng (tiết kiệm Checkout rate limit)
- Dùng `get_order` chỉ cho buyer-initiated request, không poll
- Mint fresh token mỗi session

---

## Buyer-Linked Tokens

Xem chi tiết: [[Buyer-Linked Tokens & Shop Sign-in]]

---

## Docs gốc

- Auth and Rate Limiting: https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting
- Authentication guide: https://shopify.dev/docs/agents/get-started/authentication
