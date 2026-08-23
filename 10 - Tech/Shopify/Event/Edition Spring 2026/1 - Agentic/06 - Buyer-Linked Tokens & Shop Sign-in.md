# Buyer-Linked Tokens & Shop Sign-in

Mặc định, agent token chỉ xác định agent. **Buyer-linked token** mở rộng bằng cách gắn thêm identity của **signed-in Shop customer**, cho phép personalized interactions.

Flow dùng **Shop** (`accounts.shop.app`) là **delegated identity provider** của Shopify, chain customer session qua mà không cần browser authorization riêng.

---

## Three-Step OAuth Flow

Dựa trên RFC 8693 (Token Exchange) và RFC 7523 (JWT Bearer Assertion).

### Step 1 — Customer Authorization với Shop

Standard OAuth 2.0 authorization code flow, customer approve trên Shop:

```
https://accounts.shop.app/oauth/authorize
  ?response_type=code
  &client_id={client_id}
  &redirect_uri={redirect_uri}
  &scope=openid%20dev.ucp.shopping.catalog.search:read
  &state={state}
```

Customer approve → Shop redirect kèm authorization code → exchange cho **Shop access token** tại `https://accounts.shop.app/oauth/token`.

### Step 2 — Token Exchange cho Authorization Grant

Convert Shop access token thành short-lived JWT (RFC 8693):

```bash
curl -X POST https://accounts.shop.app/oauth/token \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:token-exchange' \
  --data-urlencode 'subject_token={shop_access_token}' \
  --data-urlencode 'subject_token_type=urn:ietf:params:oauth:token-type:access_token' \
  --data-urlencode 'requested_token_type=urn:ietf:params:oauth:token-type:jwt' \
  --data-urlencode 'audience=api.shopify.com' \
  --data-urlencode 'client_id={client_id}' \
  --data-urlencode 'client_secret={client_secret}'
```

Response chứa `access_token` — đây là **signed, single-use, short-lived assertion** (KHÔNG phải access token thật), chỉ có **60 giây** validity.

### Step 3 — JWT Bearer Assertion Redemption

Đưa JWT grant cho Shopify token endpoint (RFC 7523):

```bash
curl -X POST https://api.shopify.com/auth/access_token \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data-urlencode 'assertion={jwt_authorization_grant}' \
  --data-urlencode 'scope=dev.ucp.shopping.catalog.search:read' \
  --data-urlencode 'client_id={client_id}' \
  --data-urlencode 'client_secret={client_secret}'
```

Shopify verify JWT signature bằng Shop's published keys → resolve customer identity → issue **buyer-linked token**.

---

## Flow tổng quan

```
Customer → Shop OAuth → Shop access token
                            ↓
                    Token Exchange (RFC 8693)
                            ↓
                    JWT assertion (60s TTL)
                            ↓
                    JWT Bearer (RFC 7523) → Shopify
                            ↓
                    Buyer-linked token (60 min TTL)
```

---

## Dynamic Endpoint Discovery

Không nên hard-code endpoint. Thay vào đó:

1. **Shopify Authorization Server**: resolve qua OAuth protected resource metadata từ resource server (VD: `catalog.shopify.com`) → trỏ tới `api.shopify.com`
2. **Shop as Delegated IdP**: đọc capability `dev.ucp.common.identity_linking` trong Shopify UCP business profile → tìm Shop và `auth_url`
3. **Shop endpoints**: query `https://accounts.shop.app/.well-known/oauth-authorization-server` → lấy `authorization_endpoint` + `token_endpoint`

---

## Token Characteristics

| Thuộc tính | Giá trị |
|---|---|
| Format | JWT |
| TTL | ~60 phút |
| Refreshable | **Không** — phải repeat 3-step flow |
| Refresh strategy | Dùng customer's persisting Shop session |
| Scope ví dụ | `dev.ucp.shopping.catalog.search:read` |

---

## Requirements

- Dev Dashboard client credentials (ID + secret)
- Configured redirect URI match authorization request
- **Server-side** execution — `client_secret` là confidential, không chạy trên browser/mobile

> [!warning] Security
> Steps 2 và 3 **không được** chạy trong browser hoặc mobile code — secret có thể bị recovered từ shipped source hoặc network traffic.

---

## Personalization

Buyer-linked token cho phép agent cung cấp "personalized results" khi access service như Global Catalog.

> **Personalized search results** dựa trên Shop account hiện đang ở trạng thái **coming soon** (docs chưa đề cập chi tiết cơ chế).

---

## Docs gốc

- Buyer-linked tokens: https://shopify.dev/docs/agents/profiles/buyer-linked-tokens
- Auth and rate limiting: https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting
