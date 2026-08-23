# Shopify Editions Spring '26 — Shop Minis & Sales Channels

> Shop Minis mở rộng surfaces, Intents API truyền context, Sign-in with Shop APIs, multi-channel sales channel apps, mixed fulfillment.

---

## 1. Shop Minis in More Parts of Shop

Shop Mini mở rộng ra nhiều surface hơn trong Shop app: **home feed, top navigation, product page**.

### Development stack

| Aspect | Detail |
|--------|--------|
| Framework | React SDK |
| Runtime | Node.js 20+ |
| Platforms | iOS (Xcode), Android (Android Studio) |
| Package manager | npm |

### Setup

```bash
# Init project
npm init @shopify/shop-mini@latest

# Start dev server
npx shop-minis dev
```

Dev server hỗ trợ: Android emulators, iOS simulators, physical devices (QR scan), deeplink testing.

### Debugging

- **iOS:** Safari Web Inspector (simulator)
- **Android:** Chrome DevTools remote debugging

### AI support

Pre-configured context files cho Claude, Cursor, Windsurf.

### Access

Developer cần **"Manage apps" permission** trong Partner organization.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/shop-minis

---

## 2. Intents for Shop Minis

Truyền **product context** giữa Shop app và Mini thông qua **Intents** — trigger Mini đúng thời điểm.

**Impact:** Mini nhận context sản phẩm customer đang xem → render UI phù hợp (size guide, loyalty reward, review) thay vì generic.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/shop-minis/intents

---

## 3. Access to Sign-in with Shop

Shop cung cấp **API, documentation, SDK** để build "Sign-in with Shop" — customer authenticate bằng Shop account với **one tap**.

**Impact:** App/storefront custom offer sign-in nhanh qua Shop, tăng conversion. Tương tự "Sign in with Google/Apple".

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/shop

---

## 4. Multi-channel Support for Sales Channel Apps

Sales channel app tạo **nhiều channel connections**, mỗi connection có specification riêng cho từng surface/account.

### Mutation

```graphql
mutation channelCreate($input: ChannelCreateInput!) {
  channelCreate(input: $input) {
    channel { id }
    userErrors { field message }
  }
}
```

**Impact:** App marketplace/social map nhiều account/surface vào một app installation — không yêu cầu install nhiều lần.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/admin-graphql/latest/mutations/channelCreate

---

## 5. Ship and Pick Up in One Order

Hỗ trợ **mixed fulfillment** trong một đơn — vừa ship vừa pick up.

**Impact:** App fulfillment/delivery cần ensure logic handle được order có cả shipping line và pickup line. Cần test kỹ checkout flow.

**Availability:** GA

---

## 6. Color Palettes for Themes

Kiến trúc **color customization** mới — define **color palette** trong setting, available xuyên suốt theme.

**Impact:** Theme developer cung cấp system màu sắc nhất quán. Merchant thay đổi palette một chỗ, toàn bộ theme update.

**Availability:** GA
**Docs:** https://shopify.dev/docs/storefronts/themes/best-practices/design/color-system

---

## Nguồn

- https://shopify.dev/docs/api/shop-minis
- https://shopify.dev/docs/api/shop-minis/intents
- https://shopify.dev/docs/api/shop
- https://shopify.dev/docs/api/admin-graphql/latest/mutations/channelCreate
- https://shopify.dev/docs/storefronts/themes/best-practices/design/color-system
