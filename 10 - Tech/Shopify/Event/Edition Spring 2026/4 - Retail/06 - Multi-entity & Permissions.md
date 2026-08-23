# Multi-entity & Permissions

Nhóm feature dành cho doanh nghiệp lớn (Shopify Plus/Enterprise) vận hành nhiều pháp nhân, kèm các cải tiến về permissions và quản lý tiền mặt.

---

## Multi-Entity Selling (Shopify Plus)

Cho phép vận hành nhiều pháp nhân (legal entities) khác nhau trong cùng một quốc gia, từ một Shopify store duy nhất.

### Cấu trúc hỗ trợ

- Online entity và retail entity tách biệt.
- Mỗi location một entity riêng.
- Tách B2B và D2C thành entity khác nhau.

### Setup Requirements

1. Dùng **New Markets** feature.
2. Setup business entities trong **Organization settings**.
3. Kết nối mỗi entity riêng biệt với **Shopify Payments** (separate accounts, payout currencies, bank accounts per entity).
4. Assign entities vào specific markets.

### Entity Selection hoạt động ra sao

- **POS transactions:** Entity được xác định bởi **physical location** nơi POS device đăng nhập. Staff **không thể override** thủ công.
- **Online transactions:** Xác định qua market settings và customer shipping/billing location.

### Region Availability

Entities phải ở quốc gia có **Shopify Payments hoạt động**. Docs không liệt kê danh sách cụ thể — cần check supported countries của Shopify Payments.

### Limitations

- **Managed markets** không tương thích.
- **Automated tax filing** không hoạt động với multi-entity.
- **Post-purchase apps** có thể route sai về primary entity.
- **Custom Shopify Payments rates** không được giữ lại khi migrate.
- Domestic payment methods (ví dụ Interac ở Canada) yêu cầu local currency là **Default** payout currency (không chỉ là available option).

**Availability:** Chỉ dành cho **Shopify Plus** và **Enterprise Commerce**.

---

## Tap to Pay Multi-Entity

Doanh nghiệp multi-entity kích hoạt Tap to Pay cho tất cả location — chấp nhận thanh toán contactless qua iPhone và Android.

### Requirements

- **Shopify Plus** hoặc **Enterprise** plan.
- Mỗi entity phải có Shopify Payments account riêng.
- Activate Tap to Pay cho từng entity trong Admin dashboard.

### Tap to Pay on iPhone — Chi tiết

**Device:** iPhone XS trở lên, iOS 16.7–17.4+ (tuỳ region). Không hỗ trợ iPad hoặc iOS beta.

**Supported countries:**
- North America: Canada, US (trừ Puerto Rico)
- Europe: Czech Republic, France, Germany, Ireland, Italy, Luxembourg, Netherlands, Spain, Switzerland, UK
- Asia-Pacific: Australia, New Zealand

**Card brands:** Visa, MasterCard, Amex + regional options (Interac ở Canada, Discover/Diners Club ở US, eftpos AU ở Australia).

**Activation:** Accept Apple's Terms of Service bằng Apple ID trong POS app. Sau khi activate, tự động extend sang các iPhone compatible khác đăng nhập cùng store.

### Tap to Pay on Android

Docs chưa đề cập chi tiết setup riêng cho Android trong context multi-entity. Cần check docs Android riêng.

**Availability:** Chỉ dành cho **Shopify Plus**.

---

## Multi-Entity Offline Payments

Offline payments hoạt động xuyên suốt các multi-entity retail setups trên Shopify Payments.

### Transaction Limits

Hai ngưỡng cấu hình:
1. **Device daily limit:** Giới hạn tổng offline payments per device (ví dụ $5,000 USD max).
2. **Transaction limit:** Giới hạn từng order riêng lẻ khi offline (ví dụ $100 USD max).

Limits tự động convert sang local currencies khi áp dụng cho nhiều locations.

### Multi-location

Settings và transaction limits **áp dụng cho tất cả locations** — đảm bảo tính nhất quán.

### Requirements

- POS app **v9.14.0+**.
- Card reader tương thích: POS Go, POS Terminal, Tap & Chip, Chipper 2X BT, Wisepad 3, Chip & Swipe.
- Staff cần permission **"Accept offline credit and debit payments"**.
- POS Terminal yêu cầu local Wi-Fi network hoạt động (không restart router / switch network khi offline).

### Limitations

- Swipe cards, manual card entry, Tap to Pay **không hỗ trợ offline**.
- Canadian Interac và Australian eftpos **không available offline**.
- **France:** Không hỗ trợ offline payments.

**Availability:** Chỉ dành cho **Shopify Plus**.

---

## Cash Visibility and Control (POS Pro)

Bộ công cụ quản lý tiền mặt toàn diện cho cửa hàng retail.

### Core Features

- **Register sessions:** Record tất cả cash activity — starting float, cash added/removed, final count.
- **Cash rules & reason codes:** Đặt quy tắc cho thao tác với ngăn kéo tiền, yêu cầu staff chọn lý do khi mở.
- **Track drawer activity:** Theo dõi tất cả lần mở ngăn kéo across registers.
- **Mid-session cash counts:** Yêu cầu staff kiểm đếm tiền mặt giữa ca làm việc.
- **Audit trails & reconciliation:** Đối soát cuối ca, so sánh expected totals vs physical drawer counts.

### Quản lý qua

- **Shopify POS:** Mở/đóng sessions, điều chỉnh trực tiếp.
- **Shopify Admin:** Review, điều chỉnh sessions, xem cash tracking reports by location.

**Availability:** Chỉ dành cho **POS Pro**.

---

## Permission Settings for Customer Data

Permission mới kiểm soát staff nào được xem/chỉnh sửa thông tin nhạy cảm của khách hàng.

### 6 Permissions

| Permission | Mô tả |
|---|---|
| Create new customers | Thêm customer mới vào cart, xem basic info |
| Edit customer details | Sửa thông tin customer |
| Delete customers | Xoá customer accounts |
| View customer details | Xem email, phone number, shipping address |
| View metafields | Xem custom metadata fields |
| Edit metafields | Sửa custom metadata fields |

### Cấu hình

Mỗi permission (trừ delete) có 3 mức:
- **Allowed** — cho phép.
- **Denied** — từ chối.
- **Approval required** — cần manager nhập PIN để approve.

Dùng role-based access: gán permissions cho POS roles → assign roles cho staff. Phù hợp cho cửa hàng có nhiều nhân viên part-time cần hạn chế quyền truy cập dữ liệu khách.

**Availability:** Tất cả plan.

---

## Docs gốc

- [Selling with multiple entities](https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/selling-with-multiple-entities)
- [Tap to Pay on iPhone](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/payment-management/tap-to-pay-iphone)
- [Tap to Pay on Android](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/payment-management/tap-to-pay-android)
- [Offline payments setup](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/selling-offline/offline-payments)
- [Cash register management](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/cash-register-management)
- [POS permissions](https://help.shopify.com/en/manual/your-account/users/roles/permissions/pos-permissions)
