# Shop Minis cho Developer

Đây là phần quan trọng nhất cho app developer. Shop Minis là **mini-app** chạy bên trong Shop app, cho phép developer xây dựng interactive experience tiếp cận hàng triệu shopper.

---

## Shop Minis là gì?

Theo shopify.dev: Shop Minis là "immersive, full-screen buyer experiences within the Shop app". Chúng được thiết kế để:
- **Fast and responsive** — load tối đa 3 giây trên 5G
- **Easy to develop and maintain** — dùng React SDK
- **Secure and reliable** — chạy sandbox trong Shop app

**Tech stack:** React SDK (TypeScript + Tailwind CSS). Cần Node.js 20+ và Xcode hoặc Android Studio để test local.

---

## Surfaces — Mini hiển thị ở đâu?

Editions Spring '26 mở rộng Shop Minis ra nhiều vị trí hơn:

| Surface | Mô tả |
|---------|--------|
| **Home feed** | Quick link trên home screen, tăng discoverability |
| **Top navigation** | Explore section với curated categories (Snap & Shop, Design Your Space, Beauty Solutions, Play & Shop) |
| **Product pages** | Mini được launch từ product detail page qua hệ thống Intents |
| **Explore tab** | Gallery các Mini, tổ chức theo collection |

Việc mở rộng surface nghĩa là Mini không chỉ nằm trong Explore tab nữa — nó có thể xuất hiện ngay tại nơi buyer intent cao nhất (ví dụ: product page).

---

## Intents — Hệ thống kết nối Mini với ngữ cảnh

### Concept

Intents là cơ chế để Shop app **launch Mini từ ngữ cảnh phù hợp** và truyền data vào. Ví dụ: shopper đang xem một chiếc áo → Shop app launch Mini "virtual try-on" và truyền product data vào Mini đó.

### Supported Intents

| Intent key | Mô tả | Use case |
|------------|--------|----------|
| `try_on` | Virtual try-on cho wearables | Thời trang, kính, phụ kiện |
| `view_in` | AR/room-placement visualization | Nội thất, trang trí |
| `select:shopify/ProductVariant` | Chọn variant sản phẩm | Custom variant selector |
| `add_to_cart:shopify/ProductVariant` | Thêm variant vào cart | Quick add-to-cart flow |
| `buy_now:shopify/ProductVariant` | Express checkout cho variant | Mua nhanh |
| `create:shop/UserImage` | Tạo user-generated image | UGC experience |

Shopify khuyến khích developer đề xuất intent mới nếu có use case khác (recipe building, gift finding, custom configurations...).

### Hooks cho Intents

**`useIntent`** — Parse intent được truyền vào Mini qua deeplink:

```tsx
import {useIntent} from '@shopify/shop-minis-react'

function App() {
  const intent = useIntent()

  if (intent?.action === 'try_on') {
    return <TryOnExperience product={intent.product} />
  }

  return <DefaultExperience />
}
```

**`useResolveIntent`** — Trả kết quả về cho Shop app khi Mini hoàn thành intent:

```tsx
import {useResolveIntent} from '@shopify/shop-minis-react'

function TryOnExperience() {
  const {resolveIntent} = useResolveIntent('tryOnProduct')

  const handleComplete = async () => {
    try {
      // Thành công — trả kết quả về Shop app
      await resolveIntent({
        code: 'ok',
        data: {imageUrl: 'https://cdn.shopify.com/tryon/example.jpg'},
      })
    } catch (error) {
      console.error('Could not resolve intent:', error)
    }
  }

  const handleCancel = async () => {
    // User huỷ — không hoàn thành
    await resolveIntent({code: 'closed'})
  }

  const handleError = async () => {
    // Lỗi xảy ra
    await resolveIntent({code: 'error', message: 'Camera not available'})
  }
}
```

Ba loại kết quả khi resolve:
- `{code: 'ok', data: T}` — thành công, có data trả về
- `{code: 'closed'}` — user dismiss, không hoàn thành
- `{code: 'error', message: string}` — lỗi

**Product Variant Intent Hooks** (thêm trong SDK May-June 2026):

```tsx
import {useSelectVariant, useAddToCart, useBuyNow} from '@shopify/shop-minis-react'

// Mở native Shop variant selector sheet
const selectVariant = useSelectVariant()   // wraps select:shopify/ProductVariant
const addToCart = useAddToCart()             // wraps add_to_cart:shopify/ProductVariant
const buyNow = useBuyNow()                  // wraps buy_now:shopify/ProductVariant
```

Các hook này mở native Shop variant selector sheet khi Mini có product ID nhưng cần buyer chọn variant hoặc quantity.

---

## Getting Started

### Khởi tạo project

```bash
npm init @shopify/shop-mini@latest
```

### Chạy development server

```bash
npx shop-minis dev
```

Dev server hỗ trợ preview trên Android emulator, iOS simulator, hoặc physical device qua QR code.

### CLI Commands quan trọng

| Command | Mô tả |
|---------|--------|
| `npx shop-minis dev` | Start dev server |
| `npx shop-minis dashboard` | Web UI xem submission history và performance reports |
| `npx shop-minis enable` / `disable` | Toggle Mini on/off |
| `npx shop-minis submit` | Submit Mini (tự chạy build verification) |
| `npx shop-minis verify-build` | Chạy build verification riêng |

### Project structure

Mỗi project tự động include:
- **AGENTS.md** — context file cho coding assistant (Claude, Cursor, Windsurf) hiểu SDK patterns
- **CLAUDE.md** — reference file cho tool compatibility

Developer có thể thêm vào AGENTS.md: feature riêng, coding convention, custom patterns — coding assistant sẽ dùng khi generate suggestions.

---

## SDK Hooks Reference

### Product Hooks

| Hook | Mô tả |
|------|--------|
| `useProduct` | Lấy 1 product theo ID |
| `useProducts` | Batch fetch nhiều product |
| `useProductVariants` | Lấy variant của product |
| `useProductMedia` | Lấy media items |
| `useProductReviews` | Lấy reviews |
| `useProductSearch` | Tìm product theo query |
| `useRecommendedProducts` | Personalized recommendation (thay thế `usePopularProducts` đã deprecated) |
| `useProductList` / `useProductLists` | Lấy product collection |
| `useProductListActions` | CRUD cho product collection |

### User Hooks

| Hook | Mô tả |
|------|--------|
| `useCurrentUser` | Profile info (display name, avatar) |
| `useBuyerAttributes` | Shopping preference signals cho personalization |
| `useOrders` | Recent order history từ tất cả Shop stores |
| `useRecentProducts` | Product đã xem gần đây |
| `useSavedProducts` / `useSavedProductsActions` | Manage saved/favorite products |
| `useFollowedShops` / `useFollowedShopsActions` | Manage followed shops |
| `useGenerateUserToken` | Tạo temp token authenticate user với backend của developer |

### Navigation Hooks

| Hook | Mô tả |
|------|--------|
| `useNavigateWithTransition` | Programmatic navigation với smooth transition |
| `useCloseMini` | Đóng Mini, quay về Shop app |
| `useDeeplink` | Lấy deeplink URL đã launch Mini |
| `useShopNavigation` | Navigate đến native Shop screen (giữ Mini trong nav stack) |

### Content & Storage Hooks

| Hook | Mô tả |
|------|--------|
| `useCreateImageContent` | Upload + tạo UGC entry, hỗ trợ tag product |
| `useImageUpload` | Upload pipeline |
| `useImagePicker` | Camera + gallery access |
| `useAsyncStorage` | Persistent storage (tối đa 10 keys, 1 MB/key) |
| `useSecureStorage` | Secure storage cho sensitive data |

### Utility Hooks

| Hook | Mô tả |
|------|--------|
| `useCheckScopesConsent` | Check user đã grant scope nào |
| `useRequestScopesConsent` | Request consent lại sau khi user decline |
| `useRequestPermissions` | Request native device permissions |
| `useSafeArea` | Safe area insets cho notched devices |
| `useShare` | Native share sheet |
| `useErrorScreen` / `useErrorToast` | Error UI (blocking / non-blocking) |
| `useKeyboardAvoidingView` | Layout adjustment khi keyboard hiện |

---

## Navigation Transitions

Shop Minis hỗ trợ smooth page transition giống native app:

```tsx
import {MinisRouter, TransitionLink} from '@shopify/shop-minis-react'

// Bật transition cho toàn app
<MinisRouter viewTransitions>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products/:id" element={<ProductPage />} />
  </Routes>
</MinisRouter>

// Declarative navigation
<TransitionLink to={`/products/${product.id}`}>
  <img src={product.image} alt={product.title} />
</TransitionLink>
```

- Forward: slide từ phải → trái
- Back: slide từ trái → phải
- Tự động respond iOS swipe gesture và Android back button
- Respect `prefers-reduced-motion` media query

---

## Consent & Permissions

### Scope Consent (SDK Mar-Apr 2026)

User có thể **selectively grant/reject** permissions. Mini cần handle graceful degradation:

```tsx
const consent = useCheckScopesConsent()
// Phân biệt: "chưa hỏi" vs "đã hỏi và từ chối" (request_blocked)

const requestConsent = useRequestScopesConsent()
// Chỉ gọi khi user chủ động trigger, không tự popup
```

### Privacy

- Mini **phải** có privacy policy URL trong manifest
- **Cấm:** cross-context tracking, targeted ads, bán data, profiling ngoài core functionality
- **Cấm request trực tiếp:** email, payment data, shipping address, sensitive info

---

## Giới hạn và Quy định

### Performance
- Load time tối đa **3 giây** trên 5G
- Kích thước tối đa **5 MB**

### Cấm
- Không dùng "Shop" hoặc "Mini" trong tên Mini
- Không link ra ngoài (website, app, store khác)
- Không chạy ads
- Không xử lý payment ngoài Shop Pay
- Không livestream UGC
- `localStorage` / `sessionStorage` **đã deprecated** — dùng `useAsyncStorage`

### Review
Shopify reject ngay nếu: vi phạm security/privacy, thiếu docs, performance kém, chức năng bị cấm. Quyết định là final, không có appeal.

---

## Package Versions (tính đến June 2026)

| Package | Version |
|---------|---------|
| `@shopify/shop-minis-platform` | 0.26.0 |
| `@shopify/shop-minis-react` | 0.28.0 |
| `@shopify/shop-minis-cli` | 0.3.21 |

TypeScript 6.0.2.

---

## Nguồn

- [Shop Minis — shopify.dev](https://shopify.dev/docs/api/shop-minis)
- [Shop Minis Hooks](https://shopify.dev/docs/api/shop-minis/hooks)
- [useResolveIntent](https://shopify.dev/docs/api/shop-minis/hooks/intents/useresolveintent)
- [Navigation Transitions](https://shopify.dev/docs/api/shop-minis/navigation-transitions)
- [Guidelines](https://shopify.dev/docs/api/shop-minis/guidelines)
- [Coding Assistant Support](https://shopify.dev/docs/api/shop-minis/coding-assistant-support)
- [Shop Minis May-June 2026 Update](https://shopify.dev/changelog/shop-minis-may-june-2026-update)
- [Shop Minis March-April 2026 Update](https://shopify.dev/changelog/shop-minis-march-april-2026-update)
- [Shop Minis February 2026 Update](https://shopify.dev/changelog/shop-minis-february-2026-update)
- [Shop Minis January 2026 Update](https://shopify.dev/changelog/shop-minis-january-2026-update)
- [Shop Minis Gallery](https://shop.app/minis#gallery)

Quay lại: [[01 - Shop App Overview]]
