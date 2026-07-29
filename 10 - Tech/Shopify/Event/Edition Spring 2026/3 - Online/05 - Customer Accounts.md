# Customer Accounts - Editions Spring 2026

3 updates lớn cho customer accounts: thiết kế lại giao diện, đồng bộ data từ identity providers, và kéo dài session lên 365 ngày.

---

## Refreshed customer accounts (Design Uplift)

Thiết kế lại trang customer accounts với giao diện mới, navigation tốt hơn. Rollout bắt đầu từ 17/06/2026.

### Thay đổi chính

**Navigation:**
- Account menus với tối đa 4 navigation links giờ hiển thị **inline trên mobile** thay vì ẩn sau hamburger menu
- Navigation accessible trên mọi screen size

**Order experience:**
- Order details hiển thị inline thay vì collapsed → giảm số lần click
- Product images link trực tiếp đến product pages
- Order actions surface ở **top** of order summary thay vì nested trong menus
- Order summary hiển thị inline trên page

**First-time shopper experience:**
- Khách chưa có purchase history nhận **curated product recommendations** thay vì empty state

**Branded sign-in:**
- Enhanced controls cho logo, colors, section styles, và brand imagery trên sign-in page

**Availability:** Tất cả store trên latest customer accounts version. Legacy account users truy cập new order status page cũng nhận updates.

---

## Customer data syncs from identity providers

Đồng bộ dữ liệu khách hàng từ các identity provider bên ngoài.

### Data được sync

| Field | Ghi chú |
|-------|---------|
| **Email address** | Chỉ sync khi tạo account mới; dùng để identify và match customers |
| **Name** | First + last names sync cùng nhau; cả 2 bị replace khi bật overwrite |
| **Phone number** | Contact information |
| **Address** | Street, city, province/state, postal code, country; multiple addresses import as group |
| **Tags** | Customer tags import as group; tất cả existing tags bị replace khi overwrite |

**Lưu ý:** Availability phụ thuộc vào data mà identity provider gửi sang.

### Setup

1. **Settings** > **Customer accounts** trong Shopify admin
2. **Manage** trong Authentication section
3. **Manage providers** dưới Identity provider
4. Mở settings của provider cần cấu hình
5. Bật toggle **Sync customer data**
6. Chọn overwrite rule:
   - "Do not overwrite existing customer data" (giữ giá trị hiện tại)
   - "Overwrite existing customer data" (thay bằng data từ provider)
7. Save

### Lưu ý quan trọng

- Syncing xảy ra **mỗi lần khách sign in** (không phải real-time background sync)
- Field groups (name, tags, address) xử lý together, không phải individual fields
- Overwrite rules áp dụng selective theo field groups
- Nếu khách sign in qua external identity provider → **không thể update email address** trong Shopify

**Availability:** Shopify Plus plan only (yêu cầu connected identity provider).

---

## 365-day sessions for customer accounts

Kéo dài session của customer accounts lên 365 ngày.

### Cách hoạt động

"Sign-in sessions persist for up to 365 days, so customers don't have to sign in again" khi quay lại store. Giảm friction cho repeat purchases.

### Sign-in options

| Option | Mô tả |
|--------|--------|
| **Passwordless** | Nhập email, nhận one-time 6-digit code |
| **Shop Sign-In** | Dùng Shop credentials và passkeys (cần Shop Pay active) |
| **Social Sign-In** | Google và Facebook |
| **Custom Identity Provider** | Thay thế default experience (Shopify Plus only) |

### Account creation

- Accounts tự động tạo khi ai đó sign in với email chưa đăng ký
- Existing customer profiles trong Shopify admin được cấp access ngay
- Shop account holders nhận "accelerated sign-in and checkout experience" với pre-filled information

### Customization

Khách có thể update names, email addresses, và shipping addresses. Email verification xảy ra sau khi thay đổi. Nếu sign in qua external identity provider → không thể update email.

**Availability:** Tất cả plan (custom identity provider chỉ Plus).

---

## Nguon

- [Customer accounts](https://help.shopify.com/en/manual/customers/customer-accounts)
- [Sync customer data from identity providers](https://help.shopify.com/en/manual/customers/customer-accounts/sign-in-options/identity-provider/sync-customer-data)
- [Customer accounts design uplift changelog](https://changelog.shopify.com/posts/customer-accounts-get-a-design-uplift)
- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026) - truy cap 2026-07-29
