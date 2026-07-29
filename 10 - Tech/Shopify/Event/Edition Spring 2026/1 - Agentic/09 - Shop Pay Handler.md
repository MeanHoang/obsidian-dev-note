# Shop Pay Payment Handler

`dev.shopify.shop_pay` handler cho phép merchant và agent tích hợp **Shop Pay** làm accelerated checkout option thông qua UCP. Agent orchestrate payment mà **không trực tiếp xử lý** sensitive payment credentials (delegated payment architecture).

---

## Ưu điểm

- Buyer complete purchase nhanh hơn nhờ saved payment + shipping info
- Agent không touch sensitive credentials (delegated)
- Một integration hoạt động trên tất cả UCP-compatible merchants

---

## Merchant Configuration

Shopify merchant: Shop tự **advertise tất cả** UCP payment handlers (bao gồm Shop Pay).

External merchant: phải đăng ký Shop Pay để lấy `shop_id`.

```json
{
  "ucp": {
    "payment_handlers": {
      "dev.shopify.shop_pay": [
        {
          "id": "shop_pay",
          "version": "2026-01-23",
          "spec": "https://shopify.dev/ucp/shop-pay-handler/2026-01-23/spec.md",
          "schema": "https://shopify.dev/ucp/shop-pay-handler/2026-01-23/schema.json",
          "config": {
            "shop_id": "shopify-559128571"
          }
        }
      ]
    }
  }
}
```

---

## Agent Configuration

Agent cần đăng ký với Shop Pay để lấy `client_id`.

> Self-serve registration cho Shop Pay `client_id` **chưa mở** (docs chưa đề cập thời điểm).

```json
{
  "ucp": {
    "payment_handlers": {
      "dev.shopify.shop_pay": [
        {
          "id": "shop_pay",
          "version": "2026-01-23",
          "config": {
            "client_id": "shop-client-4578576128"
          }
        }
      ]
    }
  }
}
```

---

## Delegated Payment Flow

### Step 1 — Discover Handler

Tìm `dev.shopify.shop_pay` trong `payment_handlers` của checkout response hoặc merchant profile.

### Step 2 — Build Payment Request

Cung cấp:
- Merchant's `shop_id`
- Agent's `client_id`
- Totals (subtotal, shipping, tax, grand total)
- Fulfillment options
- Line items
- Currency & locale

Present qua Shop Pay interface → buyer authenticate + chọn payment method.

### Step 3 — Complete Checkout

Wrap **Shop Token** trong UCP payment instrument rồi submit:

```json
{
  "payment": {
    "instruments": [
      {
        "id": "instr_shop_pay_1",
        "handler_id": "shop_pay",
        "type": "shop_pay",
        "credential": {
          "type": "shop_token",
          "token": "shop_abc123xyz789..."
        },
        "display": {
          "email": "buyer@example.com"
        },
        "billing_address": {
          "full_name": "Jane Doe",
          "street_address": "123 Main St",
          "address_locality": "San Francisco",
          "address_region": "CA",
          "postal_code": "94102",
          "address_country": "US"
        },
        "selected": true
      }
    ]
  }
}
```

---

## Shop Token

Shop Token là **single-use, checkout-scoped credential** — đại diện buyer authorization cho specific payment trên specific merchant.

| Thuộc tính | Giá trị |
|---|---|
| Single-use | Không reuse across transactions |
| Time-limited | Validity period giới hạn |
| Checkout-scoped | Bind vào specific checkout + merchant |
| Transport | TLS 1.2+ bắt buộc |

---

## Payment Instrument Schema

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `id` | string | Yes | Unique instrument ID |
| `handler_id` | string | Yes | Match handler `id` (VD: `shop_pay`) |
| `type` | string | Yes | `"shop_pay"` |
| `credential.type` | string | Yes | `"shop_token"` |
| `credential.token` | string | Yes | Shop Token từ delegated flow |
| `billing_address` | object | Yes | Billing address từ Shop Pay account |
| `display.email` | string | No | Buyer email |

---

## Docs gốc

- Shop Pay handler specification: https://shopify.dev/docs/agents/carts-and-checkout/shop-pay-handler
