# Checkout Redesign & Validation

## Higher-Converting Redesigned Checkout

Giao diện checkout được thiết kế lại nhằm tăng conversion rate:
- Layout gọn hơn
- Delivery options dễ scan hơn
- Nút **Pay** được đẩy lên vị trí nổi bật hơn
- Giảm scrolling trên mobile

**Availability:** Available now, tất cả merchant.

> Docs chưa đề cập số liệu cụ thể về mức tăng conversion rate.

---

## VAT ID Validation at Checkout

Thu thập và validate VAT ID của buyer ngay tại checkout, tích hợp với Shopify Tax. Phục vụ merchant B2B tại EU và UK.

### Cách hoạt động

1. Khách B2B nhập VAT ID tại checkout
2. Hệ thống **tự động validate** qua EU's **VIES** system (real-time)
3. Nếu hợp lệ → VAT được **remove khỏi order** (reverse charge)
4. Khách tự chịu trách nhiệm khai báo và nộp VAT trên tax filings của mình

### Reverse charge áp dụng khi

- Order ship từ **EU fulfillment location** → **EU country khác**
- Order ship từ **EU fulfillment location** → **UK**

### Reverse charge **KHÔNG** áp dụng khi

- UK → EU
- UK → UK

### Yêu cầu

- **Shopify Tax** active cho EU hoặc UK
- Guest checkout hoặc Shop Pay checkout enabled
- **EU fulfillment location** (không phải UK location)
- Kết nối internet real-time cho VIES validation

### Setup

1. Vào checkout form settings trong Shopify admin
2. Tìm field **Company VAT number**
3. Đổi từ "Don't include" (default) sang **"Optional"**
4. Đảm bảo đã activate VAT invoices cho customers
5. Confirm dùng Shopify Tax cho EU hoặc UK

### Workaround

Nếu VIES validation fail hoặc unavailable → manually set customer tax status thành "Don't collect tax" từ customer profile.

---

## Faster Address Suggestions

Cải thiện address autocomplete và validation trong checkout -- gợi ý địa chỉ nhanh và chính xác hơn bằng external services (Google Autocomplete).

### Supported regions (22 quốc gia)

Australia, Austria, Belgium, Brazil, Canada, Denmark, France, Germany, Hong Kong SAR, India, Italy, Japan, Luxembourg, Netherlands, New Zealand, Norway, Saudi Arabia, Singapore, Spain, Sweden, Switzerland, United Kingdom, United States.

### Setup

1. Settings > Checkout trong Shopify admin
2. Trong Configurations, click **Edit**
3. Click gear icon → **Settings**
4. Toggle **"Use address autocompletion"** on/off

### Lưu ý

- Feature **active by default** cho tất cả merchant
- Nếu quốc gia của khách chưa hỗ trợ → manual entry vẫn hoạt động
- Third-party apps có thể build bằng Checkout UI extensions
- **Không nên** chạy cả default validation và third-party app cùng lúc (ảnh hưởng conversion)

---

## Address Format Validation (Checkout Blocks)

Enforce address restrictions trong checkout bằng rules trong **Checkout Blocks** app. Chỉ validate **shipping address** (billing address không validate).

### Supported validation rules

| Rule | Mô tả |
|---|---|
| **Block address types** | Chặn diplomatic, military, parcel locker, PO box, USPS gopost |
| **Block ZIP/postal codes** | Dùng `*` wildcard, ví dụ `100**` cho ranges |
| **Character counts** | Min/max limits trên address fields |
| **Required fields** | Biến optional fields thành mandatory |
| **Custom validation** | Block checkout khi fields match regex pattern |

### Setup

1. Apps > Checkout Blocks
2. Functions > **Create function**
3. Chọn **"Address format validation"**
4. Đặt tên rule, tuỳ chọn regional markets
5. Enable validation rules + custom error messages
6. Save → activate via status dropdown

### Hạn chế

- Billing addresses **không** validate được
- Rules "Block non-ASCII characters" và "Require street number" từ deprecated Address Blocker **chưa được hỗ trợ**
- Chỉ hỗ trợ **region-based markets** cho market-specific rules

---

## Customized Branding Across Checkout, Accounts, and Sign-in

Thiết lập brand identity một lần, áp dụng nhất quán trên checkout, customer account page, và sign-in page.

### Tuỳ chỉnh có sẵn

**Logo:**
- Upload store logo
- Điều chỉnh width (pixels) và alignment (left, center, right)

**Colors:**
- Header background + accent colors (cart icon, links)
- Main content area background
- Form field colors (transparent hoặc white)
- Error message colors
- Button + accent colors
- Order summary background color
- **Color Palette** feature: tạo reusable palette → update nhiều elements cùng lúc

**Typography:**
- Chọn predefined fonts cho heading và body text

### Áp dụng trên

- Checkout pages
- New customer account pages
- Customer sign-in pages

### Setup

1. Settings > Checkout trong Shopify admin
2. Configurations section → click **Edit**
3. Access **Settings** sidebar trong checkout editor
4. Customize colors, logo, typography
5. Click **Save**

### Design tips

- Giữ design **đơn giản**
- Dùng colors có **high contrast** -- checkout phục vụ mục đích functional
- Tính đến tháng 2/2026: **không thể** thêm background images vào header/main content areas, chỉ colors

---

## Order Value Limits for All Plans

Thiết lập giá trị đơn hàng tối thiểu/tối đa bằng **Checkout Blocks**.

### Cách tính

Order value limits tính dựa trên **order subtotal trước khi** gift cards/store credit được áp dụng. Nghĩa là khách có thể trả ít hơn minimum nếu dùng gift card.

### Phạm vi áp dụng

- Tất cả payment methods: Shop Pay, accelerated checkouts, Shop Cash
- Tự động convert sang **local currencies** cho international customers

### Setup

1. Apps > Checkout Blocks
2. Functions > **Create function**
3. Chọn **"Order limit validation"** (mục Validation)
4. Chọn áp dụng cho all customers hoặc chỉ B2B companies
5. Nhập minimum/maximum subtotal values
6. Save (initially inactive) → đổi status sang **Active**

**Ví dụ:** Minimum $1,000 USD, maximum $15,000 USD.

---

## Ship and Pick Up in One Checkout

Khách hàng chọn shipping cho một số sản phẩm và in-store pickup cho sản phẩm khác trong cùng một checkout.

### Status

- **Hiện tại:** Feature test drive cho Shopify Plus và Enterprise
- **Bắt buộc cho Plus:** từ **July 1, 2027**

### Yêu cầu

- Ít nhất 1 location activate cho in-store pickup
- Ít nhất 1 location cấu hình cho shipping
- Shipping profiles đúng cho supported items/locations

### Hạn chế

- Chỉ áp dụng cho **Shopify Checkout** (storefront pages không set được delivery options per item)
- Khách chỉ chọn được **1 pickup location** per order
- Pick up points và local delivery **không hỗ trợ** mixed delivery
- Orders tạo **separate fulfillments** -- cần điều chỉnh workflow
- Flat rates tính trên **order total** bất kể một số items là pickup

### Setup

1. Settings > **Feature test drives** trong Shopify admin
2. Tìm "Ship and pickup in one order" → chọn stores
3. Configure locations cho cả shipping và pickup
4. Thiết lập shipping profiles
5. Test checkout với mixed-delivery scenarios

### Lưu ý

- Kiểm tra **third-party app compatibility** (fulfillment, shipping, discount, email apps)
- Tax treatment khác nhau giữa shipped vs pickup items

---

## Docs

- [VAT validate](https://help.shopify.com/en/manual/taxes/shopify-tax/vat-validate)
- [Address autocomplete](https://help.shopify.com/en/manual/checkout-settings/address-collection-preferences#checkout-setup-autocomplete-orderaddress)
- [Address format validation](https://help.shopify.com/en/manual/checkout-settings/checkout-blocks/customizations/address-format-validation)
- [Checkout style](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style)
- [Order value limits](https://help.shopify.com/en/manual/checkout-settings/checkout-blocks/order-value-limits)
- [Ship and pickup](https://help.shopify.com/manual/checkout-settings/ship-and-pickup)
