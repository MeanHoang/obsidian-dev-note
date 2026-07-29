# Shopify Editions Spring '26 — POS UI Extensions

> POS extensions mạnh hơn: activation status, offline support, localization đa ngôn ngữ, camera API, cash management.

---

## 1. Activation Status

Query **activation status** của POS UI extension — tương tự checkout, admin, customer account, theme extension — qua unified interface.

**Impact:** App check programmatically xem POS extension đã active chưa — hữu ích cho onboarding flow hoặc troubleshooting.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api

---

## 2. Offline Support

Cấu hình POS UI extension tiếp tục hoạt động khi POS device **mất kết nối mạng**.

**Impact:** Extension hoạt động ổn định trong điều kiện mạng kém (cửa hàng, pop-up, event). Extension declare offline capability trong config.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/pos-ui-extensions/latest

---

## 3. Localization

Dịch POS UI extension sang nhiều ngôn ngữ với **locale-aware formatting**.

### Locale file structure

```
locales/
  en.json              # Non-regional
  en-CA.json           # Regional
  en-CA.default.json   # Default
```

Encoding: UTF-8 JSON.

### Translation resolution order (high → low priority)

1. Customer locale (`de-DE`)
2. Non-regional customer locale (`de`)
3. Shop locale (`fr-FR`)
4. Non-regional shop locale (`fr`)
5. Extension's default locale

### Pluralization

Theo CLDR language rules, dùng `Intl.PluralRules.select()`:

```json
{
  "youHaveMessages": {
    "one": "you have one message",
    "other": "you have {{count}} messages"
  }
}
```

Arabic hỗ trợ thêm: `zero`, `one`, `two`, `few`, `many`, `other`.

Gọi `translate()` với option `count` — translation **phải define tất cả possible plural keys** cho locale.

### Supported Intl APIs

| API | Mô tả |
|-----|--------|
| `Intl.NumberFormat` | Currency, number formatting |
| `Intl.DateTimeFormat` | Date/time formatting |
| `Intl.PluralRules` | Pluralization rules |

Shopify polyfills cho older browsers thiếu `Intl` support.

### Restrictions

- Merchants **không thể** override hoặc add translations
- Translations **không chứa** HTML
- Dùng provided `i18n` functions cho localization

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/pos/localization

---

## 4. Camera API

**Camera API** cho phép POS extension truy cập camera để scan, chụp ảnh, attach image.

### Core method

```javascript
const photo = await shopify.camera.takePhoto({
  quality: 0.8,
  maxWidth: 1520,
  maxHeight: 1520,
  facingMode: 'environment'  // 'user' | 'environment'
});
```

### CameraMediaOptions (input)

| Parameter | Type | Mô tả |
|-----------|------|--------|
| `facingMode` | `'user' \| 'environment'` | Front hoặc rear camera |
| `maxWidth` | number (1-1920) | Max width pixels |
| `maxHeight` | number (1-1920) | Max height pixels |
| `quality` | number (0-1) | Compression quality |

### CameraMediaResponse (output)

| Field | Type | Mô tả |
|-------|------|--------|
| `base64` | string | Image encoded base64 |
| `type` | string | MIME type |
| `width` | number | Width pixels |
| `height` | number | Height pixels |
| `fileSize` | number | Size bytes |

### Supported targets (22 total)

Cart line-item details, customer details, draft orders, orders, products, home screen tiles/modals, post-purchase actions, register details — across menu items, action modals, block renders.

### Limitations

- **Một camera operation tại một thời điểm** — không parallel
- Base64 strings memory-intensive cho large images
- `facingMode` behavior varies trên Android devices

### Use cases

- Age verification (scan ID)
- Visual inventory (chụp ảnh sản phẩm)
- Damage report
- Barcode/QR scanning

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/pos-ui-extensions/latest/target-apis/platform-apis/camera-api

---

## 5. Cash Management Extensions

API mới cho quản lý cash tại register: **reason code, event, POS extension target** cho cash session management.

### Capabilities

- Mở/đóng ca (cash session management)
- Kiểm đếm tiền mặt (prompting count)
- Ghi lý do thu/chi (reason codes)
- Audit trail

**Impact:** App POS build tính năng quản lý tiền mặt — trước đây phải dùng giải pháp ngoài.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/new-retail-cash-management-capabilities

---

## Nguồn

- https://shopify.dev/docs/api/app-home/apis/authentication-and-data/app-api
- https://shopify.dev/docs/api/pos-ui-extensions/latest
- https://shopify.dev/docs/apps/build/pos/localization
- https://shopify.dev/docs/api/pos-ui-extensions/latest/target-apis/platform-apis/camera-api
- https://shopify.dev/changelog/new-retail-cash-management-capabilities
