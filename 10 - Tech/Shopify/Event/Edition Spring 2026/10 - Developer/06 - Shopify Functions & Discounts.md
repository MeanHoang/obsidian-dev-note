# Shopify Editions Spring '26 — Shopify Functions & Discounts

> Functions mạnh hơn: đọc metaobject data, access billing address/PO number, prerequisites trong discount. Admin UI extensions cho discount config và bulk editing.

---

## 1. Metaobject Data in Checkout Functions

Sử dụng **metaobject entry** trong function input để power custom logic — discount, delivery, cart transform.

### Yêu cầu

- Type phải dùng **`$app` reserved prefix**: ví dụ `$app:pricing-config`, `$app:loyalty-tier`
- **Merchant-owned types** (prefix `custom`) **không hoạt động** trong function input queries

### Complexity budget

| Item | Cost |
|------|------|
| Mỗi `metaobject` root call | 1 point |
| Mỗi `field(key:)` call | 3 points |
| **Budget limit** | **30 points/input query** |

Ví dụ: 1 metaobject + 3 fields = 1 + (3 x 3) = **10 points**.

### Supported function types

App-owned metaobjects hoạt động across tất cả function types:
- Discounts
- Cart transforms
- Delivery customization
- Fulfillment constraints

### Use case cho Joy Loyalty

Loyalty tier lưu trong metaobject (`$app:loyalty-tier`), function đọc tier để áp discount — thay đổi tier config **không cần redeploy function**.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/metaobjects#use-in-shopify-functions

---

## 2. Billing Address and PO Number in Functions

Query **billing address** và **PO number** trong Cart and Checkout Validation function.

### Input query

```graphql
query {
  cart {
    billingAddress {
      address1
      address2
      city
      company
      countryCode
      firstName
      lastName
      phone
      provinceCode
      zip
    }
    poNumber
  }
}
```

### Supported checkout field targets

Dùng để trả validation error về đúng field trên checkout UI:

| Field | Target |
|-------|--------|
| `billingAddress.address1` | `$.cart.billingAddress.address1` |
| `billingAddress.city` | `$.cart.billingAddress.city` |
| `billingAddress.company` | `$.cart.billingAddress.company` |
| `billingAddress.countryCode` | `$.cart.billingAddress.countryCode` |
| `billingAddress.firstName` | `$.cart.billingAddress.firstName` |
| `billingAddress.lastName` | `$.cart.billingAddress.lastName` |
| `billingAddress.phone` | `$.cart.billingAddress.phone` |
| `billingAddress.provinceCode` | `$.cart.billingAddress.provinceCode` |
| `billingAddress.zip` | `$.cart.billingAddress.zip` |
| `poNumber` | `$.cart.poNumber` |

### Code pattern (Rust)

```rust
if is_po_box(billing_address.address1) {
    errors.push(ValidationError {
        message: "PO Box not allowed for billing.".to_string(),
        target: "$.cart.billingAddress.address1".to_string(),
    });
}
```

**Impact:** App B2B có thể validate billing address (block quốc gia bị cấm) hoặc require PO number — data trước đây không có trong function input.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/functions/latest/cart-and-checkout-validation#supported-checkout-field-targets

---

## 3. Prerequisites in Product Discount Functions

Field mới cho phép chỉ định **required item purchase** trước khi discount áp dụng trong BXGY discount function.

**Impact:** Build logic "mua X mới được giảm Y" trực tiếp trong function, không cần workaround. Native support cho BXGY use case phức tạp.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/functions/latest/discount

---

## 4. Discount Configuration with Admin UI Extensions

Admin UI extension quản lý **discount class** và render **conditional UI** dựa trên discount method.

### Discount classes

| Class | Áp dụng lên |
|-------|-------------|
| `Product` | Cart lines riêng lẻ |
| `Order` | Order subtotal |
| `Shipping` | Delivery/shipping rates |

### Extension target

```
admin.discount-details.function-settings.render
```

### Metafield storage

```toml
[discount.metafields.app.function-configuration]
type = "json"
access.admin = "merchant_read_write"
```

JSON structure lưu: cart line percentage, order percentage, delivery percentage, collection IDs.

### UI components (web components)

| Component | Mô tả |
|-----------|--------|
| `<s-select>` | Dropdown selection |
| `<s-text-field>` | Input field |
| `<s-stack>` | Layout composition |
| Resource picker API | Collection selection |

Extension check `input.discount().discount_classes()` và conditionally render UI + create discount operations.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/discounts/build-ui-extension

---

## 5. Bulk Editing Extensions for Discounts

Build extension cho phép merchant **bulk action trên discount index** — quản lý nhiều discount cùng lúc.

**Impact:** App discount management cung cấp UX tốt hơn cho merchant có hàng trăm discount. Tương tự bulk action trên product/order.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/admin/actions-blocks/build-admin-action

---

## Nguồn

- https://shopify.dev/docs/apps/build/metaobjects#use-in-shopify-functions
- https://shopify.dev/docs/api/functions/latest/cart-and-checkout-validation#supported-checkout-field-targets
- https://shopify.dev/docs/api/functions/latest/discount
- https://shopify.dev/docs/apps/build/discounts/build-ui-extension
- https://shopify.dev/docs/apps/build/admin/actions-blocks/build-admin-action
