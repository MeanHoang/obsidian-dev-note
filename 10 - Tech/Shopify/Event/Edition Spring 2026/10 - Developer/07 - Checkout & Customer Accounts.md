# Shopify Editions Spring '26 — Checkout & Customer Accounts

> Branding API mới, nested cart lines cho accelerated checkout, customer account web component, cartToOrderCopyable, standard storefront events, và requirement mới cho Built for Shopify.

---

## 1. Refreshed API for Branding Checkout and Accounts

API mới cho phép control **branding** xuyên suốt checkout, customer account, và sign-in bằng **một unified mutation**.

### Mutation

```graphql
mutation checkoutAndAccountsConfigurationUpdate($id: ID!, $configuration: CheckoutAndAccountsConfigurationInput!) {
  checkoutAndAccountsConfigurationUpdate(id: $id, configuration: $configuration) {
    configuration { ... }
    userErrors { field message }
  }
}
```

### Required scopes

- `write_checkout_and_accounts_configurations` HOẶC `write_checkout_settings`

### Required permissions

- `manage_checkout_settings`
- `view_markets`
- `create_and_edit_markets`

**Impact:** App branding/customization dùng một API thay vì nhiều endpoint riêng. Chi tiết input fields xem trong API schema (`CheckoutAndAccountsConfigurationInput`).

**Availability:** GA (API version 2026-04+)
**Docs:** https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/checkoutAndAccountsConfigurationUpdate

---

## 2. AI Toolkit for Checkout Performance

Dùng AI audit checkout UI extension và nhận optimization recommendation. Chi tiết xem [[02 - AI Tooling - Dev MCP & Commerce Skills#5. AI Toolkit for Checkout Performance Audit]].

### Optimization checklist

1. **Eliminate external network calls** — store data trong metafields/metaobjects thay vì fetch external API
2. **Bundle size** — audit bằng esbuild metafile, thay Day.js/Moment.js bằng native `Intl.DateTimeFormat`
3. **Module-scope execution** — defer expensive operations, dùng nullish coalescing (`??=`) cho lazy init
4. **Signal subscriptions** — read Preact Signals ở leaf components, tránh re-render parent

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/checkout/extension-performance

---

## 3. Accelerated Checkout Support for Add-ons (Nested Cart Lines)

**Shop Pay, Apple Pay** và accelerated checkout khác hỗ trợ **nested cart line** — customer mua add-on từ product page vẫn dùng express checkout.

### Form field structure

Naming convention: `shopify-additional-items[index][attribute]`

| Property | Type | Mô tả |
|----------|------|--------|
| `id` | Required | Variant ID |
| `quantity` | Optional | Default: 1 |
| `parent_id` | Optional | Link child item với parent |
| `properties` | Optional | Line item metadata |
| `selling_plan` | Optional | Subscription plan ID |

> **Lưu ý:** Index bắt đầu từ `1` (không phải 0). Buy with Prime wallet **không hỗ trợ** thêm nhiều variant vào accelerated checkout từ product page.

### Ví dụ HTML

```html
<input type="hidden" name="shopify-additional-items[1][id]" value="44012345" />
<input type="hidden" name="shopify-additional-items[1][parent_id]" value="main-variant-id" />
<input type="hidden" name="shopify-additional-items[1][quantity]" value="1" />
```

**Impact:** App upsell/add-on không còn bị block bởi accelerated checkout. Conversion rate tăng.

**Availability:** GA
**Docs:** https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout/multiple-product-checkout

---

## 4. Customer Account Web Component

Shopify-managed **web component** `<shopify-account>` — sign-in và access account menu **không rời store**.

### Implementation

```html
{% if shop.customer_accounts_enabled %}
  <shopify-account menu="customer-account-main-menu">
  </shopify-account>
{% endif %}
```

### Attributes

| Attribute | Mô tả |
|-----------|--------|
| `menu` | Menu handle hiển thị trong account sheet |

### Customization via CSS

```css
/* Signed-out avatar */
shopify-account::part(signed-out-avatar) {
  padding: 12px;
  width: 64px;
  height: 64px;
}

/* Signed-in avatar */
--shopify-account-signed-in-avatar-size
--shopify-account-signed-in-avatar-color-background
--shopify-account-signed-in-avatar-color-text
```

### Menu config

Menu quản lý qua **Content > Menus** trong Shopify admin. Theme setting:
```json
{
  "type": "link_list",
  "id": "customer_account_menu",
  "label": "Customer account menu",
  "default": "customer-account-main-menu"
}
```

### Features

- Sign-in methods: passwordless, Shop recognition, social providers
- Avatar hiện initial hoặc Shop profile picture khi signed in
- Email marketing opt-in trong sign-in flow
- **Shopify controls component** — update independently of theme

**Availability:** GA
**Docs:** https://shopify.dev/docs/storefronts/themes/customer-engagement/account-component

---

## 5. Pre-populate Email on Sign-in (login_hint)

Parameter **`login_hint`** pre-populate email khi link customer đến sign-in page.

**Impact:** App marketing include login link với email sẵn — tăng conversion sign-in.

**Availability:** GA
**Docs:** https://shopify.dev/docs/storefronts/themes/sign-in

---

## 6. Cart Metafields Carry Over to Orders (cartToOrderCopyable)

Setting **`cartToOrderCopyable`** trên metafield definition — cart metafield value tự động copy sang order khi checkout hoàn thành.

### TOML config

```toml
[order.metafields.custom.gift_message]
name = "Gift Message"
type = "single_line_text_field"
capabilities.cart_to_order_copyable = true
```

### GraphQL mutation

```graphql
mutation {
  metafieldDefinitionCreate(definition: {
    name: "Gift Message"
    namespace: "custom"
    key: "gift_message"
    type: "single_line_text_field"
    ownerType: ORDER
    capabilities: {
      cartToOrderCopyable: {
        enabled: true
      }
    }
  }) {
    createdDefinition { id }
    userErrors { field message }
  }
}
```

### Yêu cầu

- **Namespace và key phải match** giữa cart và order metafield definitions
- Chỉ available cho **order metafield definitions** (ownerType: ORDER)
- Set cart metafield values qua: Storefront API `CartInputMetafieldInput` hoặc Checkout UI Extensions

### Use case cho Joy Loyalty

Loyalty point snapshot, reward code, referral tracking lưu trong cart metafield → tự động copy sang order → không cần webhook workaround.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/metafields/use-metafield-capabilities

---

## 7. Standard Storefront Events and Actions

Theme dispatch **standardized events** khi commerce interactions xảy ra. Apps và agents listen/trigger qua **`Shopify.actions`** namespace.

### Default actions

| Action | Mô tả |
|--------|--------|
| `Shopify.actions.updateCart` | Write Storefront API, refresh cart in-place hoặc reload page |
| `Shopify.actions.openCart` | Mở drawer nếu có, nếu không redirect `/cart` |
| `Shopify.actions.getCart` | Read current cart từ Storefront API |

### Event types

- Product view events
- Cart update events (`shopify:cart:lines-update`)
- Collection filter change events

### Cơ chế

- Apps dùng `addEventListener` để listen events
- Gọi action thành công → runtime **auto-emit matching event** (không cần manual dispatch)

### Developer tools

```bash
# Validate payloads + log warnings
shopify theme dev

# Debug UI real-time events + action testing
shopify theme dev --standard-events-inspector
```

**Impact:** App analytics, personalization, A/B testing listen event chuẩn mà không phụ thuộc theme custom code.

**Availability:** GA
**Docs:** https://shopify.dev/docs/storefronts/themes/best-practices/standard-events-and-actions

---

## 8. Subscription Payment Methods Natively Replaced

Customer account UI extension update **payment method** cho subscription natively qua **Intents API** — không redirect ra ngoài.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/customer-account-ui-extensions/latest/target-apis/platform-apis/intents-api

---

## 9. WhatsApp Marketing Consent APIs

Lưu và quản lý **WhatsApp marketing consent** qua Customer Account API và Admin API, cùng cấp với email/SMS consent.

**Impact:** App marketing/CRM thu thập consent WhatsApp chuẩn compliance, tích hợp vào flow opt-in hiện có.

**Availability:** GA

---

## 10. Built for Shopify — Customer Account API Requirement

App trong category **returns/exchanges** và **subscriptions** bắt buộc dùng **Customer Account API** authentication cho buyer-facing self-service experiences.

| Chi tiết | Giá trị |
|----------|---------|
| **Affected categories** | Returns & exchanges, Subscriptions |
| **Requirement** | Authenticate customers using Customer Account API |
| **Deadline** | **1 tháng 12, 2026** |
| **Non-compliance** | Mất Built for Shopify status |
| **Benefit** | Single, secure sign-in across storefront, apps, customer accounts |

### Action items cho Joy Loyalty

1. Check xem app đã integrate Customer Account API authentication chưa
2. Nếu chưa → plan migration trước deadline 1/12/2026
3. Review full Built for Shopify requirements documentation

**Availability:** GA (Policy update)
**Docs:** https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps

---

## Nguồn

- https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/checkoutAndAccountsConfigurationUpdate
- https://shopify.dev/docs/apps/build/checkout/extension-performance
- https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout/multiple-product-checkout
- https://shopify.dev/docs/storefronts/themes/customer-engagement/account-component
- https://shopify.dev/docs/storefronts/themes/sign-in
- https://shopify.dev/docs/apps/build/metafields/use-metafield-capabilities
- https://shopify.dev/docs/storefronts/themes/best-practices/standard-events-and-actions
- https://shopify.dev/docs/api/customer-account-ui-extensions/latest/target-apis/platform-apis/intents-api
- https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps
