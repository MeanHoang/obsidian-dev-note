# Returns, Exchanges & Gift Cards

Nhóm feature liên quan đến xử lý trả hàng, đổi hàng, gift card, và discount tại POS.

---

## Returns and Exchanges in One Cart

Workflow mới cho phép xử lý refund, exchange, và bán hàng mới cùng lúc trong **một cart duy nhất**. Trước đây staff phải thực hiện từng thao tác riêng biệt.

Ví dụ: khách trả lại áo size S, đổi sang size M, và mua thêm phụ kiện — tất cả trong một transaction.

### Quy trình Refund

**Bước 1 — Khởi tạo Return:**
- Chọn order → tap "Return or exchange"
- Điều chỉnh quantity bằng nút +/-
- Có thể refund tips và shipping (tuỳ chọn)
- Toggle "Restock at this location" cho từng item
- Thêm notes và chọn return reason

**Bước 2 — Hoàn tất Refund:**
- Chọn payment method(s) để refund
- Partial refund: tap "Edit amount" để điều chỉnh số tiền
- Có thể split refund qua nhiều payment method
- Gửi receipt và confirm

### Quy trình Exchange

1. Mở order → "Return or exchange" → chọn items trả lại
2. Thêm return reason và notes (tuỳ chọn)
3. Tap "Done"
4. Scan/search item thay thế → thêm vào cart
5. Nút checkout hiển thị "Checkout" (khách trả thêm) hoặc "Refund" (store hoàn tiền)
6. Hoàn tất payment hoặc refund

### Permissions cần thiết

- **"Return and exchange orders"** — bắt buộc
- Returning ineligible items
- Creating unverified returns
- Completing in-progress returns
- Managing item restock locations

### Limitations

- **Automatic discounts không áp dụng** cho exchange — phải thêm manual discount riêng.
- **Bundles** phải exchange từng item riêng, không exchange cả bundle.
- **In-progress returns** từ Admin sẽ block exchange trên POS cho đến khi đóng.
- **Inventory restock** chỉ tại exchange location, không redirect sang location khác.
- **Discount codes** không thể áp dụng cho exchange trên POS.
- Refund tối đa bằng original payment amount per payment method.
- Order đang có active return trong Admin → không refund qua POS được.

### Restocking

Refunded items tự động cộng lại inventory tại location được assign, trừ khi staff tắt toggle cho item đó. Third-party fulfilled products chỉ restock về original location.

**Availability:** Tất cả plan (exchange cần **POS Pro**).

---

## Gift Card Cashout

Cho phép staff chuyển đổi gift card có số dư thấp thành tiền mặt trực tiếp từ POS.

### Điều kiện

- Store phải accept **cash payments** (không hỗ trợ payment method khác cho cashout).
- Gift card balance phải **dưới $15 USD** (hoặc tương đương local currency).
- Card phải active và chưa expired.

### Quy trình

1. **Tìm gift card:** Scan, tìm qua customer search, hoặc order lookup.
2. **Chọn cashout:** Tap "Cash out balance" trên màn hình gift card details.
3. **Xác nhận số tiền:** Xem chính xác giá trị cashout.
4. **Hoàn tất:** Cash drawer mở ra để trả tiền → tap Done.

### Tại sao cần feature này?

Nhiều bang/tỉnh có quy định pháp lý yêu cầu merchant phải cashout gift card dưới một ngưỡng nhất định. Feature này giúp merchant tuân thủ luật pháp địa phương.

### Limitations

- Chỉ hiển thị option cashout cho card đủ điều kiện.
- Cần cash drawer system (không cashout được nếu không có).

**Availability:** Tất cả plan.

---

## Scannable Discounts (QR Codes)

Merchant tạo QR code cho discount trong Shopify Admin, sau đó chia sẻ cho khách hàng (in poster, social media, email, v.v.). Tại checkout, staff scan QR code để áp dụng discount ngay — không cần nhập code thủ công.

### Cách scan

1. Dùng **supported 2D barcode scanner**.
2. Hoặc tap biểu tượng barcode trên POS → dùng camera device để scan (cần cấp quyền camera).

### Requirements

- POS app **v11.5 trở lên**.
- Product trong cart phải eligible cho discount.
- QR code phải valid và cart đáp ứng điều kiện discount.

### Limitations

- Discount codes (bao gồm QR) **không áp dụng cho exchanges** trên POS.

**Availability:** Tất cả plan.

---

## In-Store Only Discounts

Tạo discount chỉ áp dụng tại cửa hàng vật lý, tách biệt với promotion online.

### Setup (Automatic Discounts trên POS)

1. Vào **Discounts** trong Shopify Admin.
2. Tạo hoặc chọn automatic discount.
3. Trong phần **Availability**, chọn "Apply on POS (Pro locations only)".

### Requirements & Limitations

- **Automatic discounts trên POS** chỉ hoạt động tại location có **POS Pro subscription**.
- Khi eligibility là "All customers" → phải bật POS thủ công.
- Khi dùng "Markets" eligibility → cần assign valid Retail market.
- **Discount codes** (code-based) **không thể giới hạn theo sales channel** — khách có thể redeem trên mọi channel đã setup.

> Lưu ý: Docs ghi rõ automatic discounts trên POS yêu cầu POS Pro, nhưng Editions page ghi "tất cả plan". Có thể Editions đề cập đến việc tạo discount với channel eligibility nói chung, còn auto-apply trên POS cụ thể cần Pro.

**Availability:** Tất cả plan (automatic discounts trên POS cần POS Pro tại location).

---

## Docs gốc

- [Refund orders](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/complete-refund-orders)
- [Exchange](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/exchange)
- [Gift card cashout](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/payment-management/gift-cards/cashing-out)
- [Discount management - QR code](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/discount-management/applying-discounts#qr-code)
- [Sales channel discounts](https://help.shopify.com/en/manual/discounts/sales-channel-discounts)
