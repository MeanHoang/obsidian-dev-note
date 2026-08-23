# Shop Pay Everywhere

## Shop Pay Available to Any Brand on Any Platform

Mọi doanh nghiệp, bất kể quy mô hay platform, đều có thể tích hợp Shop Pay vào checkout -- không cần migrate sang Shopify online store. Merchant tiếp cận **250M+ shoppers** trong Shop Pay network và tính năng one-click purchasing.

### Cách hoạt động

Khi customer đã có Shop Pay account đến checkout, hệ thống tự nhận diện và điền sẵn shipping, billing, payment details -- hoàn tất "in one tap".

### Yêu cầu

- Checkout phải thu thập customer email **trước** khi xử lý payment
- Business phải eligible cho Shopify Payments (quốc gia được hỗ trợ)
- Integration team cần kinh nghiệm API development

### Tính năng đi kèm

| Tính năng | Chi tiết |
|---|---|
| **Shop Pay Button** | Hiển thị trên product page, cart, checkout cho registered users |
| **Shop Pay Installments** | Trả góp không lãi suất hoặc monthly installments -- hỗ trợ tại Canada, US, UK (có phí transaction bổ sung) |
| **Order Tracking** | Khách theo dõi đơn hàng qua Shop app sau khi mua |

### Setup process (3 bước)

1. **Đăng ký** qua Shop Pay enterprise landing page → nhận Shopify admin credentials
2. **Activate Shopify Payments** và kết nối bank account
3. **Lấy API credentials** (Shop ID, Client ID, Admin API, Storefront API) → implement Shop Pay Wallet API

> **Lưu ý quan trọng:** Merchant phải hoàn tất payout setup trong vòng **21 ngày** kể từ khi nhận payment đầu tiên, nếu không tất cả payments sẽ tự động refund cho customer.

### Cấu hình thêm

- Kết nối domain để hệ thống nhận diện customer
- Brand customization: store description, avatar, policies, contact info, social links

---

## Shop Pay Includes More Local Payment Methods

Shop Pay giờ tích hợp thêm các phương thức thanh toán local và regional vào cùng một wallet. Danh sách local payment methods hỗ trợ qua Shop Pay:

| Payment Method | Ghi chú |
|---|---|
| Bancontact | Belgium |
| BLIK | Poland |
| EPS | Austria |
| iDEAL / Wero | Netherlands |
| MobilePay | Denmark, Finland |
| Multibanco | Portugal |
| Przelewy24 | Poland |
| Swish | Sweden (Shopify Plus only) |
| TWINT | Switzerland |
| USDC | Crypto stablecoin |

Third-party methods như PayPal và Klarna **không** khả dụng qua Shop Pay.

### Cách hoạt động cho buyer

- **Online:** Xác minh mua hàng qua Shop passkey hoặc SMS code 6 chữ số → checkout không cần xác thực lại trên cùng device
- **Retail:** Staff hiển thị QR code cho khách scan → hoàn tất purchase trên Shop website
- **Quản lý payment:** Khách đăng nhập Shop.app để cập nhật thẻ, xem subscriptions, quản lý plans

### Ngôn ngữ hỗ trợ

Shop Pay hoạt động trên **23 ngôn ngữ** bao gồm English, Spanish, French, German, Japanese, Chinese (cả Simplified và Traditional).

### Lưu ý theo quốc gia

Payment method availability khác nhau theo market -- thiết lập ở platform level, không thể customize riêng. Ví dụ: Germany chỉ hỗ trợ Shop Pay cho card payments.

---

## Docs

- [Shop Pay on any platform](https://help.shopify.com/en/manual/payments/shop-pay/shop-pay-on-any-platform)
- [Shop Pay](https://help.shopify.com/en/manual/payments/shop-pay/shop-pay)
