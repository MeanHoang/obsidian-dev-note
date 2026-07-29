# Shopify Editions Spring '26 — App Distribution: Pricing, Submission, Security

> Ba thay đổi lớn về app distribution: Shopify App Pricing thay thế billing cũ, streamlined submission, và expiring tokens OAuth 2.0 (breaking change cho mọi public app).

---

## 1. Shopify App Pricing — Next-gen Billing

Cấu hình pricing model trực tiếp trong app submission. Shopify quản lý toàn bộ: plan selection, charge approval, invoicing.

### Pricing models

| Model | Mô tả |
|-------|--------|
| **Recurring** | Flat-rate monthly fee |
| **Usage-based** | Charges dựa trên merchant activity |
| **Hybrid** | Recurring + usage charges |

### Usage-based pricing tiers

| Tier type | Mô tả |
|-----------|--------|
| **Fixed** | Uniform rate per unit |
| **Graduated** | Tiered rates summed across usage bands |
| **Volume** | Single rate dựa trên total usage tier |

### Constraints

| Limit | Giá trị |
|-------|---------|
| Usage meters per plan | Tối đa **5** |
| Pricing tiers per meter | Tối đa **6** |
| Public plans per app | Tối đa **4** |
| Billing cycle | **Monthly only** (usage charges không combine với yearly-only plans) |
| Currency | **USD only** |

### Key APIs

| API | Mô tả |
|-----|--------|
| **App Events API** | Gửi usage events, Shopify tự match meters + calculate charges + invoice (xem [[04 - Dev Dashboard & Monitoring#2. App Events API]]) |
| **Active Subscription API** | Real-time subscription status (active/pending/cancelled/frozen), persist beyond app uninstalls |
| **Historical Events API** | Full event log: installs, uninstalls, subscription changes, charges, credits, usage |

### Negative reporting

Hỗ trợ **negative usage events** cho automatic corrections: bounced messages, reversed transactions, retried jobs.

### Migration từ Legacy Billing API

| Mốc | Sự kiện |
|------|---------|
| Trước 28/4/2026 | Có thể query Billing API cho subscription status |
| Sau 28/4/2026 | **Partners API bắt buộc** cho subscription queries |
| Auto-transition | Apps trên Managed Pricing tự chuyển sang App Pricing |

### Breaking changes

- Subscription queries phải chuyển từ **GraphQL Admin API → Partners API**
- Webhooks **không còn deliver** subscription notifications
- Billing API giờ ở trạng thái **legacy**

### Chưa hỗ trợ

- One-time charges
- Usage caps (`cappedAmount` equivalent)
- Yearly base + monthly usage combination
- Multi-currency billing
- Plan localization via GraphQL upload
- Merchant-specific discounts/coupons
- Store plan targeting

**Availability:** GA
**Docs:** https://community.shopify.dev/t/shopify-app-pricing-the-next-generation-of-app-billing

---

## 2. Streamlined App Store Submission

Partner Dashboard checks mới cho phép developer **fix issue trước khi submit**. Review feedback tracking tích hợp trực tiếp.

**Impact:** Giảm reject rate và time-to-publish. Developer biết lỗi trước khi reviewer xem.

**Availability:** GA
**Docs:** https://community.shopify.dev/t/app-store-review-updates-new-tools-to-speed-up-submissions/33472

---

## 3. Expiring Tokens + OAuth 2.0 Refresh — Breaking Change

Public app dùng **expiring access token** với **OAuth 2.0-compliant refresh flow**. Thay thế non-expiring token.

### Token lifecycle

| Token | Duration |
|-------|----------|
| **Access token** | 1 giờ (`expires_in: 3600`) |
| **Refresh token** | 90 ngày (`refresh_token_expires_in: 7776000`) |

### Refresh endpoint

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
```

**Request:**
```json
{
  "client_id": "API_KEY",
  "client_secret": "CLIENT_SECRET",
  "grant_type": "refresh_token",
  "refresh_token": "shprt_..."
}
```

**Response:**
```json
{
  "access_token": "shpat_...",
  "expires_in": 3600,
  "refresh_token": "shprt_...",
  "refresh_token_expires_in": 7776000,
  "scope": "read_products,write_products"
}
```

### Token acquisition — Token Exchange from Session Token

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
```

Parameters:
- `grant_type`: `urn:ietf:params:oauth:grant-type:token-exchange`
- `subject_token`: ID token from merchant session
- `subject_token_type`: `urn:ietf:params:oauth:token-type:id_token`
- `requested_token_type`: `urn:shopify:params:oauth:token-type:offline-access-token`
- `expiring`: `1` (cho expiring tokens)

### Token acquisition — Authorization Code Grant

Parameters:
- `client_id`, `client_secret`
- `code`: Authorization code from redirect
- `expiring`: `0` hoặc `1`

### Migration từ non-expiring tokens

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
```

Parameters:
- `grant_type`: `urn:ietf:params:oauth:grant-type:token-exchange`
- `subject_token`: **Non-expiring offline token hiện tại**
- `subject_token_type`: `urn:shopify:params:oauth:token-type:offline-access-token`
- `requested_token_type`: `urn:shopify:params:oauth:token-type:offline-access-token`
- `expiring`: `1`

> **CRITICAL:** Non-expiring token bị revoke ngay khi exchange thành công. **Migration không thể revert.**

### Retry behavior

Shopify trả **cùng refreshed token response trong 1 giờ** nếu client không nhận response (network issue). Retry khi gặp `5xx`, `429`, timeout, network error.

Token invalid definitively chỉ khi nhận `401` với `error: "invalid_request"` + description về inactive refresh tokens, hoặc sau 90-day expiry.

### Timeline

| Mốc | Sự kiện |
|------|---------|
| **1/4/2026** | New public apps **bắt buộc** dùng expiring tokens |
| **1/1/2027** | Existing public apps **bắt buộc** migrate — non-expiring token requests nhận errors |
| N/A | Custom apps và merchant-created apps **exempt** |

### Implementation steps

1. Extend session storage với `expires_at`, `refresh_token`, `refresh_token_expires_at`
2. Check token expiration trước mỗi API request; refresh nếu cần
3. Request expiring tokens cho new installations
4. Migrate existing installations qua token exchange (background job hoặc app launch)

### Impact cho Joy Loyalty

- **Deadline:** 1/1/2027 — tất cả public app phải migrate
- Cần update session management: store refresh token, check expiry, auto-refresh
- Migration irreversible — test kỹ trên dev store trước
- Custom apps exempt (không ảnh hưởng)

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens

---

## Nguồn

- https://community.shopify.dev/t/shopify-app-pricing-the-next-generation-of-app-billing
- https://community.shopify.dev/t/app-store-review-updates-new-tools-to-speed-up-submissions/33472
- https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens
