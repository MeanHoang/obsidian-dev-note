# Payment Methods & Regions

## Managed Payment Methods

Shopify Payments tự động sắp xếp thứ tự hiển thị các phương thức thanh toán trong mỗi checkout session, ưu tiên phương thức có khả năng convert cao nhất.

### Cách hoạt động (Dynamic Ordering)

Hệ thống sử dụng **visibility optimization** dựa trên:
- **Buyer location** -- vị trí địa lý của khách
- **Purchase history** -- lịch sử mua hàng
- **Local trends** -- xu hướng thanh toán tại khu vực

Dữ liệu sử dụng là **aggregated, anonymized data**, được cập nhật thường xuyên.

### Phạm vi quản lý

Managed payment methods **tự động activate** các local payment methods của Shopify Payments (ví dụ: Bancontact ở Belgium, BLIK ở Poland). Tuy nhiên **KHÔNG** quản lý:
- Card types (Visa, Mastercard...)
- Cash on delivery
- Manual payment methods
- Gift cards
- Custom payment apps
- Third-party payment integrations

### Tuỳ chỉnh cho merchant

- Deactivate từng method riêng lẻ mà không tắt toàn bộ feature
- Tắt managed payment methods hoàn toàn nhưng giữ các methods đã activate trước đó
- Giữ nguyên checkout customizations và manual payment method settings

### Yêu cầu

- Shopify Payments phải active
- **Shopify Network Intelligence (SNI)** phải được bật trong Customer privacy settings (tắt SNI → feature tự deactivate)

### Phí

Không phí bổ sung ngoài standard Shopify Payments transaction rates.

---

## Meses Sin Intereses (MSI) -- Mexico

Cho phép khách hàng tại Mexico thanh toán trả góp không lãi suất qua credit card.

### Các gói trả góp

| Gói | Minimum order |
|---|---|
| 3 tháng | $300 MXN |
| 6 tháng | $600 MXN |
| 9 tháng | $900 MXN |
| 12 tháng | $1,200 MXN |

### Điều kiện

- Chỉ chấp nhận **Mexican credit cards** (không nhận debit cards)
- Transaction phải xử lý bằng **MXN**
- Plan availability phụ thuộc vào issuing bank của khách

### Phí

Có phí bổ sung khi khách dùng MSI. Xem chi tiết tại Shopify admin: Settings > Payments > Manage > View payment rates (mục Local payment methods).

### Setup

- Merchant **mới** tại Mexico: MSI được activate tự động
- Merchant **hiện tại**: vào Settings > Payments > Manage → chọn các gói installment muốn cung cấp

---

## Shopify Payments in UAE (Plus)

Doanh nghiệp có trụ sở tại UAE giờ có thể xử lý thanh toán online qua Shopify Payments.

- **Status:** Early access -- chỉ available cho certain merchants
- **Plan:** Shopify Plus only
- **Payment methods:** Credit/debit cards, accelerated checkout
- **Bảo mật:** Fraud detection, encryption, 3D Secure technology
- **Phí:** Phụ thuộc subscription plan (docs không nêu cụ thể rate)

---

## Local Payment Methods Expansion

Shopify Payments mở rộng hỗ trợ thêm các phương thức thanh toán local mới:

| Payment Method | Khu vực | Loại |
|---|---|---|
| **MobilePay** | Denmark, Finland | Mobile wallet |
| **TWINT** | Switzerland | Mobile wallet |
| **BLIK** | Poland | Mobile app |
| **Przelewy24** | Poland | Bank transfer |

### Điều kiện chung cho local payment methods

- Mỗi method chỉ khả dụng khi customer ở **supported country** và chọn **eligible currency**
- Orders dùng local methods xuất hiện trong Shopify Payments payouts cùng với credit/debit card transactions
- Merchant phải **deactivate conflicting additional payment gateways** trước khi activate
- Quốc gia ngoài primary business location cần setup thành **markets** để offer các methods này

### Danh sách đầy đủ local payment methods (tính đến Spring 2026)

| Method | Region | Ghi chú |
|---|---|---|
| Bancontact | Belgium | |
| BLIK | Poland | |
| EPS | Austria | |
| iDEAL / Wero | Netherlands | |
| Klarna | European countries | Flexible payment |
| MobilePay | Denmark, Finland | |
| MSI | Mexico | Installments |
| Multibanco | Portugal | |
| Przelewy24 | Poland | |
| Sofort | Select European countries | |
| Swish | Sweden | Shopify Plus only |
| TWINT | Switzerland | |
| ACH Direct Debit | US | B2B only |
| USDC | Multiple | Crypto stablecoin |

---

## Multi-Currency Payouts

Merchant có thể nhận payout bằng nhiều loại tiền tệ khác nhau, giảm phí chuyển đổi ngoại tệ.

### Yêu cầu plan

- Chỉ **Advanced** và **Shopify Plus** -- các plan thấp hơn chỉ nhận payout bằng domestic currency

### Cách hoạt động

- Payouts tự động route đến bank account có matching currency
- Nếu không có account cho currency đó → convert về default account currency (có conversion fee)
- Mỗi supported payout currency → **1 dedicated bank account**

### Supported regions & currencies

| Region | Bank account location | Additional currencies |
|---|---|---|
| **Australia** | Australia | NZD, USD |
| **Canada** | Canada hoặc US | USD |
| **Europe** | Multiple locations | 17+ currencies (GBP, USD, CHF, JPY...) |
| **Hong Kong** | Hong Kong | EUR, GBP, JPY, USD |
| **Singapore** | Singapore | EUR, GBP, JPY, USD |
| **United Kingdom** | Multiple locations | GBP (requires UK-based account) |
| **United States** | US | AUD, CAD, EUR, GBP |

### Phí

| Plan | Fee |
|---|---|
| Advanced | 1.5% (global); 1.5% (Canada) |
| Shopify Plus | 1.0% (global); 1.25% (Canada) |
| Domestic currency payouts | **Không phí** |

### Setup

1. Settings > Payments > Shopify Payments > Manage
2. Click "Add bank account"
3. Chọn payout currency và account country
4. Nhập thông tin banking
5. Confirm → designate default account cho unmatched currencies

> **Lưu ý:** Thêm bank account sau 24h kể từ initial setup → tất cả payouts bị **tạm dừng 3-5 business days**.

---

## Multi-Entity Selling Same Country (Plus)

Vận hành nhiều legal entity trong cùng một quốc gia từ một Shopify store duy nhất.

### Plan

Chỉ **Shopify Plus** và **Shopify Enterprise Commerce**.

### Use cases

- Tách online và retail entity
- Per-location entities
- Tách B2B và D2C entities

### Cách routing hoạt động

- **POS:** Physical location nơi POS device đăng nhập → xác định entity
- **Online:** Market settings + customer's shipping/billing location → xác định entity

### Setup (3 giai đoạn)

1. **Register entities:** Settings > Organization → thêm từng legal entity
2. **Connect Shopify Payments:** Settings > Payments > Add Shopify Payments account → chọn business entity → setup account → lặp lại cho mỗi entity
3. **Assign to markets:** Markets section → chọn POS locations hoặc online store → assign business entity + Shopify Payments account

### Hạn chế quan trọng

- **Managed Markets incompatible** -- không thể dùng managed markets với multi-entity
- Automated tax filing không tương thích
- Custom Shopify Payments rates **không được giữ** khi migrate từ multi-shop
- Routing by shipping address chưa hỗ trợ
- Post-purchase apps (cross-sell) có thể không hoạt động đúng → purchases route về primary entity
- Subscription payments xử lý qua primary entity → có thể phát sinh international/FX fees

### Payment method lưu ý

Entity xử lý transaction phải có **local currency set làm Default payout currency** để certain payment methods khả dụng. Ví dụ: Interac ở Canada cần CAD là default payout currency.

---

## Docs

- [Managed payment methods](https://help.shopify.com/en/manual/payments/shopify-payments/managed-payment-methods)
- [Installments with MSI](https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods/installments-with-msi)
- [UAE - Shopify Payments](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/united-arab-emirates)
- [Local payment methods](https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods)
- [Multi-currency payouts](https://help.shopify.com/en/manual/payments/shopify-payments/store-currency/payouts-in-multiple-currencies#requirements-for-multi-currency-payouts)
- [Selling with multiple entities](https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/selling-with-multiple-entities)
