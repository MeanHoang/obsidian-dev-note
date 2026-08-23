# Fulfillment & Inventory tại Store

Nhóm feature liên quan đến pickup orders, quản lý transfers giữa các location, và bán hàng offline.

---

## In-Person Pickup Orders (POS Pro)

Staff tại cửa hàng tạo order cho khách đến nhận tại chỗ (pickup), gửi notification, và đánh dấu fulfilled khi khách đến lấy. Phù hợp cho mô hình BOPIS (Buy Online, Pick Up In-Store) hoặc staff tạo order trực tiếp cho khách đến lấy sau.

### Tạo Pickup Order

1. Thêm items vào cart (hỗ trợ mix digital + physical products).
2. Chọn **"Pickup all items"**.
3. (Tuỳ chọn) Đổi pickup location nếu có nhiều site — yêu cầu POS app **v11.8+**, nhiều locations setup cho pickup fulfillment, và inventory available tại location thay thế.
4. Thêm customer information.
5. Xử lý payment.

**Lưu ý:**
- Location xử lý order = default pickup location.
- **Không hỗ trợ:** Subscriptions và physical gift cards.
- Inventory phải available tại pickup location.
- Location phải cùng quốc gia với POS device.

### Customer Notifications

- Push notifications cho staff khi có pickup order mới (**chỉ iOS**).
- Staff bật qua Settings > Order Notifications.
- Staff gửi notification cho khách khi order sẵn sàng — qua email hoặc text.

### Fulfilling Pickup Orders

Staff cần permission **"Fulfill shipping and pickup orders"**.

1. **Prepare:** Đánh dấu order "Ready for pickup" → set aside items.
2. **Confirm pickup:** Khi khách đến → đánh dấu "Picked up".
3. **Communicate:** Gửi email/text xác nhận pickup.
4. (Tuỳ chọn) In và scan pickup slip QR code để tìm order nhanh.

**Availability:** Chỉ dành cho **POS Pro**.

---

## Receive and Fulfill Transfers (POS Pro)

Staff nhận incoming purchase orders và fulfill outgoing transfers trực tiếp từ POS — không cần vào Shopify Admin.

### Requirements

- Location phải có **POS Pro subscription**.
- Staff cần permissions: **"Inventory"** và **"Manage transfers"**.

### Fulfill Outgoing Transfers

1. Vào Order icon → chọn **Outgoing transfers**.
2. Chọn transfer → tap **Create shipment**.
3. Thêm items: scan barcode hoặc nhập quantity thủ công.
4. Tap **Send Shipment** → **Send**.

Hệ thống cập nhật inventory counts và notify destination location.

### Receive Incoming Transfers

Staff tại location nhận hàng có thể:
- Accept tất cả shipments cùng lúc.
- Review và accept từng shipment riêng.
- Scan hoặc đếm quantity trước khi accept từng line item.

### Limitations

- **Không thể tạo transfer trong POS** — phải tạo từ Admin.
- Không hỗ trợ mua/in shipping label.
- Không hỗ trợ in barcode label khi receive inventory.

**Availability:** Chỉ dành cho **POS Pro**.

---

## Packing Slips for Outgoing Transfers

In packing slip (phiếu đóng gói) cho các lần chuyển inventory giữa locations. Packing slip PDF bao gồm:
- Items (variant name + quantity)
- Origin location
- Destination location
- Transfer reference name và notes

### Requirements

- POS **v11.6+**.
- Máy in kết nối.

Sau khi tạo shipment, staff có option in packing slip.

**Availability:** Tất cả plan.

---

## Manually Enable Offline Checkout

Staff chủ động bật offline mode từ device settings khi internet không khả dụng hoặc sắp không ổn định (sự kiện ngoài trời, pop-up store).

### Cách bật

Vào connectivity icon trên POS → chọn Shopify → bật **"Force offline checkout"**. Nếu store cấu hình yêu cầu, manager phải nhập PIN để approve.

### Permission cần thiết

- Staff cần permission **"Switch device to offline checkout"**.
- Cấu hình tại Settings > Users > Roles trong Shopify Admin.
- (Tuỳ chọn) Yêu cầu manager approval trước khi staff bật.

### Payment methods hỗ trợ khi offline

| Method | Hỗ trợ |
|---|---|
| Cash | Fully supported |
| Custom manual payment methods | Supported (checks, third-party terminals) |
| Card payments | Cần activate offline payments trong Admin + card reader tương thích |

**Card readers tương thích:** POS Go, POS Terminal, Tap & Chip, Chipper 2X BT, Wisepad 3, Chip & Swipe.

**Đặc biệt:** Nếu có POS Terminal Reader, "Always-on card authorization" có thể cho phép card authorization real-time ngay cả khi offline (nếu device vẫn kết nối được payment processor qua local network).

### Limitations

- **France:** Offline checkout không available cho retail locations tại Pháp.
- **Không tắt device / sign out** sau khi bán offline — có nguy cơ mất orders.
- Phải thu thập phone number hoặc email của khách cho offline transactions.
- Swipe cards, manual card entry, Tap to Pay **không hỗ trợ offline**.
- Canadian Interac và Australian eftpos **không available offline**.

### Khi online trở lại

Orders và inventory tự động sync. Payment hiển thị badge "Payment pending" cho đến khi xử lý xong.

**Availability:** Tất cả plan.

---

## Docs gốc

- [Pickup in-store for online orders](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/pickup-in-store-for-online-orders)
- [Fulfilling and receiving transfers](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/inventory-management/fulfilling-and-receiving-transfers)
- [Offline checkout](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/selling-offline/offline-checkout)
- [Offline payments setup](https://help.shopify.com/en/manual/sell-in-person/shopify-pos/selling-offline/offline-payments)
