# Shopify Editions Spring '26 — Developer: Apps & Extensions

> Section **Apps & Extensions** trong nhóm Developer của Shopify Editions Spring 2026.
> Tổng cộng **29 updates** tập trung vào app billing, checkout extension, POS, security, Hydrogen, Shop Minis, storefront, và theme API.

---

## Simple billing with Shopify App Pricing

Cấu hình **usage-based, recurring, hoặc hybrid pricing model** trực tiếp trong app submission. Shopify quản lý toàn bộ flow: plan selection, charge approval, và invoicing.

**Impact:** Developer không cần build billing UI hay manage subscription logic. Shopify handle payment flow end-to-end — app chỉ cần declare pricing model. Giảm đáng kể effort build billing cho app mới.

- Availability: GA
- Docs: https://community.shopify.dev/t/shopify-app-pricing-the-next-generation-of-app-billing

---

## Shop Minis in more parts of Shop

Shop Mini mở rộng ra nhiều surface hơn trong Shop app: **home feed, top navigation, product page**. Mini xuất hiện đúng thời điểm shopper cần.

**Impact:** App có Shop Mini sẽ được expose nhiều hơn, tăng engagement. Developer nên review lại Mini placement strategy.

- Availability: GA
- Docs: https://shopify.dev/docs/api/shop-minis

---

## Refreshed API for branding checkout and accounts

API mới cho phép control **branding** xuyên suốt checkout, customer account, và sign-in bằng **một unified API** — hỗ trợ cả global setting lẫn page-specific customization.

**Impact:** App branding/customization có thể cung cấp trải nghiệm nhất quán hơn cho merchant. Một API thay vì phải gọi nhiều endpoint riêng.

- Availability: GA
- Docs: https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/checkoutAndAccountsConfigurationUpdate

---

## WhatsApp marketing consent APIs

Lưu và quản lý **WhatsApp marketing consent** thông qua Customer Account API và Admin API, cùng cấp với email và SMS consent hiện tại.

**Impact:** App marketing/CRM có thể thu thập consent WhatsApp chuẩn compliance, tích hợp vào flow opt-in hiện có mà không cần custom field.

- Availability: GA

---

## Access to Sign-in with Shop

Shop cung cấp **API, documentation, và SDK** cho developer build tính năng "Sign-in with Shop" — customer authenticate bằng Shop account chỉ với **one tap**.

**Impact:** App hoặc storefront custom có thể offer sign-in nhanh qua Shop, tăng conversion vì giảm friction đăng nhập. Tương tự "Sign in with Google/Apple".

- Availability: GA
- Docs: https://shopify.dev/docs/api/shop

---

## Shopify AI Toolkit for optimized checkout extensions

Dùng AI để **audit checkout UI extension** về performance và nhận **optimization recommendation** cụ thể.

**Impact:** Developer biết chính xác extension nào chậm và cần fix gì — thay vì đoán. Đặc biệt quan trọng khi Shopify siết tiêu chuẩn performance cho Built for Shopify.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/checkout/extension-performance

---

## All-new Hydrogen on any stack

Hydrogen được **viết lại từ đầu**, agent-first, hợp tác với **Vercel**. Hoạt động với **bất kỳ framework** nào gồm **Next.js** — không còn bắt buộc Remix.

**Impact:** Developer dùng Next.js hay framework khác giờ có thể dùng Hydrogen mà không cần migrate sang Remix. Mở rộng đáng kể ecosystem headless commerce của Shopify.

- Availability: **Developer Preview**
- Docs: https://hydrogen.shopify.dev/update/hydrogen-developer-preview

---

## Prerequisites in product discount functions

Field mới cho phép chỉ định **required item purchase** trước khi discount được áp dụng trong BXGY discount function.

**Impact:** App discount có thể build logic "mua X mới được giảm Y" trực tiếp trong function, không cần workaround. Native support cho BXGY use case phức tạp.

- Availability: GA
- Docs: https://shopify.dev/docs/api/functions/latest/discount

---

## Bulk editing extensions for discounts

Build extension cho phép merchant thực hiện **bulk action trên discount index** — quản lý nhiều discount cùng lúc.

**Impact:** App discount management có thể cung cấp UX tốt hơn cho merchant có hàng trăm discount. Tương tự bulk action trên product/order.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/admin/actions-blocks/build-admin-action

---

## Cash management extensions (POS)

API mới hỗ trợ quản lý cash tại register: **reason code, event, POS extension target** cho cash session management, prompting count, và audit trail.

**Impact:** App POS có thể build tính năng quản lý tiền mặt (mở/đóng ca, kiểm đếm, ghi lý do thu/chi) — trước đây phải dùng giải pháp ngoài.

- Availability: GA
- Docs: https://shopify.dev/changelog/new-retail-cash-management-capabilities

---

## SKU sharing by default

Bỏ field **`permitsSkuSharing`** — inventory mặc định có thể stock tại **nhiều location** cho bất kỳ fulfillment service nào.

**Impact:** App fulfillment không cần set `permitsSkuSharing: true` nữa. Đơn giản hóa setup cho multi-location inventory. App cũ dùng field này cần update code (field bị remove).

- Availability: GA
- Docs: https://shopify.dev/changelog/removing-permitsskusharing-field-from-fulfillment-service

---

## Multi-channel support for sales channel apps

Sales channel app có thể tạo **nhiều channel connection**, mỗi connection có specification riêng cho từng surface hoặc account khác nhau.

**Impact:** App bán hàng đa kênh (marketplace, social) có thể map nhiều account/surface vào một app installation thay vì yêu cầu install nhiều lần.

- Availability: GA
- Docs: https://shopify.dev/docs/api/admin-graphql/latest/mutations/channelCreate

---

## Ship and pick up in one order

Hỗ trợ **mixed fulfillment** trong một đơn — vừa ship vừa pick up. App tương tác với delivery, fulfillment, hoặc order logic cần test compatibility.

**Impact:** App fulfillment/delivery cần ensure logic handle được order có cả shipping line và pickup line. Cần test kỹ checkout flow.

- Availability: GA

---

## Stronger app security (expiring tokens + OAuth 2.0 refresh)

Public app giờ dùng **expiring access token** với **OAuth 2.0-compliant refresh flow**, thay thế non-expiring token.

**Impact:** Thay đổi quan trọng cho mọi public app. Token hết hạn → app phải implement refresh logic. Tăng security đáng kể nhưng cần update code nếu app hiện tại dùng long-lived token.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens

---

## POS UI extensions — activation status

Query **activation status** của POS UI extension, tương tự checkout, admin, customer account, và theme extension — qua unified interface.

**Impact:** App có thể check programmatically xem POS extension đã active chưa, hữu ích cho onboarding flow hoặc troubleshooting.

- Availability: GA
- Docs: https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api

---

## POS UI extensions — offline support

Cấu hình POS UI extension tiếp tục hoạt động khi POS device **mất kết nối mạng**.

**Impact:** App POS retail phải hoạt động ổn định trong điều kiện mạng kém (cửa hàng, pop-up). Extension giờ có thể declare offline capability.

- Availability: GA
- Docs: https://shopify.dev/docs/api/pos-ui-extensions/latest

---

## POS UI extensions — localization

Dịch POS UI extension sang **nhiều ngôn ngữ** với hỗ trợ **locale-aware currency, number formatting, và pluralization**.

**Impact:** App POS phục vụ merchant quốc tế có thể cung cấp UI đúng ngôn ngữ và format — tăng chất lượng trải nghiệm đáng kể.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/pos/localization

---

## POS UI extensions — camera access

**Camera API** cho phép POS extension truy cập camera để scan ID, chụp ảnh sản phẩm, hoặc attach image.

**Impact:** Mở ra use case mới cho POS app: age verification (scan ID), visual inventory (chụp ảnh), damage report. Trước đây camera bị lock khỏi extension.

- Availability: GA
- Docs: https://shopify.dev/docs/api/pos-ui-extensions/latest/target-apis/platform-apis/camera-api

---

## Inventory API — idempotency

Inventory API có **idempotency protection** — ngăn duplicate write hoặc data sai khi command bị retry do network issue.

**Impact:** App inventory sync không còn lo duplicate adjustment khi network timeout. Retry an toàn mà không cần custom dedup logic.

- Availability: GA
- Docs: https://shopify.dev/docs/api/usage/idempotent-requests

---

## Subscription payment methods natively replaced

Customer account UI extension có thể **update payment method** cho subscription natively thông qua **Intents API** — không cần redirect ra ngoài.

**Impact:** App subscription có thể cung cấp UX đổi payment method mượt mà trong customer account, thay vì redirect sang trang riêng hoặc yêu cầu cancel/re-subscribe.

- Availability: GA
- Docs: https://shopify.dev/docs/api/customer-account-ui-extensions/latest/target-apis/platform-apis/intents-api

---

## Cart metafields carry over to orders (cartToOrderCopyable)

Setting mới **`cartToOrderCopyable`** trên metafield definition — cart metafield value tự động copy sang order khi checkout hoàn thành.

**Impact:** App lưu data vào cart metafield (gift message, custom instruction, loyalty point snapshot) giờ đảm bảo data đó tồn tại trên order — không bị mất sau checkout. Trước đây phải dùng workaround webhook.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/metafields/use-metafield-capabilities

---

## Pre-populate email on sign-in (login_hint)

Dùng parameter **`login_hint`** để pre-populate email address khi link customer đến trang sign-in.

**Impact:** App gửi email marketing có thể include login link với email sẵn — customer không cần gõ lại email, tăng conversion sign-in.

- Availability: GA
- Docs: https://shopify.dev/docs/storefronts/themes/sign-in

---

## Customer account web component

Shopify-managed **web component** cho customer account — cho phép sign-in và access account menu **không rời store**.

**Impact:** Theme developer và app có thể embed account component trực tiếp vào storefront, thay vì redirect sang `/account`. UX liền mạch hơn.

- Availability: GA
- Docs: https://shopify.dev/docs/storefronts/themes/customer-engagement/account-component

---

## Standard storefront events and actions

Theme adopt **standardized event và action** — cho phép app và AI agent tương tác với storefront một cách nhất quán và đáng tin cậy.

**Impact:** App analytics, personalization, A/B testing có thể listen event chuẩn (add to cart, view product...) mà không phụ thuộc theme custom code. Giảm fragmentation giữa các theme.

- Availability: GA
- Docs: https://shopify.dev/docs/storefronts/themes/best-practices/standard-events-and-actions

---

## Streamlined app store submission

**Partner Dashboard checks** mới cho phép developer fix issue **trước khi submit** app. Review feedback tracking được tích hợp trực tiếp.

**Impact:** Giảm reject rate và time-to-publish. Developer biết lỗi trước khi reviewer xem, không phải submit → chờ → reject → fix → submit lại.

- Availability: GA
- Docs: https://community.shopify.dev/t/app-store-review-updates-new-tools-to-speed-up-submissions/33472

---

## Built for Shopify — Customer Account API requirement

App trong category **returns và subscriptions** bắt buộc dùng **Customer Account API** authentication để giữ trạng thái Built for Shopify.

**Impact:** App loyalty/returns/subscription (bao gồm Joy Loyalty) cần kiểm tra xem đã integrate Customer Account API chưa. Nếu chưa, cần plan migration để giữ badge.

- Availability: GA (Policy update)
- Docs: https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps

---

## Intents for Shop Minis

Truyền **product context** giữa Shop app và Mini thông qua **Intents** — trigger Mini đúng thời điểm phù hợp.

**Impact:** Mini có thể nhận context sản phẩm customer đang xem và render UI phù hợp (size guide, loyalty reward, review) — thay vì Mini generic.

- Availability: GA
- Docs: https://shopify.dev/docs/api/shop-minis/intents

---

## Color palettes for themes

Kiến trúc **color customization** mới — define **color palette** trong setting, available xuyên suốt theme.

**Impact:** Theme developer có thể cung cấp system màu sắc nhất quán. Merchant thay đổi palette một chỗ, toàn bộ theme update — thay vì sửa từng section.

- Availability: GA
- Docs: https://shopify.dev/docs/storefronts/themes/best-practices/design/color-system

---

## New Collections API

API mới cho collection với **composable source group**, **variant-level condition**, và **exclusion rule**.

**Impact:** App quản lý collection có thể build logic phức tạp hơn: include/exclude theo variant (không chỉ product), compose nhiều nguồn vào một collection. Mở ra smart collection nâng cao.

- Availability: **Beta/Preview**
- Docs: https://shopify.dev/docs/api/admin-graphql/2026-07/mutations/collectionConditionsSourceCreate

---

## Nguồn

- Shopify Editions Spring 2026: https://www.shopify.com/editions/spring2026
- Section: Developer > Apps & Extensions
