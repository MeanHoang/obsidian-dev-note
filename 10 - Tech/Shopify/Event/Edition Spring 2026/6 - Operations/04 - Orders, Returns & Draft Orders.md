# Operations - Orders, Returns & Draft Orders

Editions Spring '26 có **5 cập nhật** liên quan đến orders, returns, và draft orders.

---

## Discounts on refund page

Áp dụng discount **trực tiếp trên refund page** trong khi vẫn giữ chính xác financials.

**Cách làm:**
1. Click vào item price trên refund page
2. Chọn discount type từ dropdown
3. Nhập discount amount (per unit hoặc total, tuỳ type)
4. Tuỳ chọn: thêm reason note (visible cho customer)
5. Save discount

**Lưu ý quan trọng:**
- Discount áp dụng cho **toàn bộ quantity** của item đó, bất kể bạn chọn refund bao nhiêu units. Ví dụ: item có 2 units, discount sẽ apply cho cả 2 dù chỉ refund 1.
- Discount được save ngay khi click Save, **ngay cả khi chưa complete refund**.
- Nếu apply discount mà không complete refund → order hiển thị "refund owed to the customer".
- Apply discount **không tự động issue refund** — phải hoàn tất refund process riêng.

**Docs:** [Refunding orders](https://help.shopify.com/en/manual/fulfillment/managing-orders/refunding-orders#refund-an-entire-order)

---

## Consistent calculations across returns and upsells

Pricing logic trên returns và upsells giờ **dùng cùng logic với checkout**. Không còn discrepancies giữa giá lúc mua, lúc return, lúc upsell.

Đảm bảo tính nhất quán tài chính across toàn bộ order lifecycle.

> Docs chính thức không có link riêng cho feature này.

---

## Category-specific return reasons

Return reasons được **match tự động theo product category**.

**Cách hoạt động:**
- Return reasons hiển thị tuỳ theo category sản phẩm. Ví dụ: apparel hiển thị "Too big", "Too small"; các categories khác hiển thị reasons phù hợp riêng
- Áp dụng nhất quán across **Shopify admin, POS, và self-serve returns**
- Không cần setup riêng — hệ thống tự dựa trên product category data

**Phân tích:** Merchant có thể xem return reasons trong analytics để identify trends và hiểu lý do customers trả hàng.

**Docs:** [Creating returns](https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/creating-returns#create-a-return)

---

## Custom pricing on draft orders

Override giá từng line item và áp dụng custom discounts trên draft orders.

**Custom price:**
- Click vào line item price → edit icon → nhập custom amount
- Custom price **thay thế listed price** mà không hiển thị price reduction cho customer
- Chỉ áp dụng cho draft order đó, không ảnh hưởng catalog price

**Discount options trên draft orders:**
- Existing discount codes (cho eligible items)
- Automatic discounts
- Custom amount-off (percentage hoặc fixed) cho toàn order
- Custom amount-off cho individual line items

**Khác biệt:** Custom price = thay thế giá gốc (khách không thấy giảm). Discount = hiển thị rõ ràng mức giảm từ giá gốc.

**Use cases:** B2B negotiated rates, wholesale pricing, competitor price matching, surcharges cho expedited orders. Payment terms (Net 7-90, fixed dates) hỗ trợ thêm cho B2B workflows.

**Docs:** [Create draft orders - Custom prices](https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders/create-draft#set-custom-line-item-prices)

---

## Order cancellation requests

Customers có thể **tự request cancel order** trước fulfillment hoặc **request return** sau fulfillment, trực tiếp từ order status page.

**Customer flow:**
1. Sign in vào customer account (email + 6-digit verification code)
2. Chọn order → request cancellation (chỉ cho items chưa shipped)

**Merchant settings** (Settings > Customer accounts):
- Bật cả returns + cancellations
- Chỉ cancellations
- Chỉ returns

**Lưu ý quan trọng:**
- Cancellation request **không tự động cancel** order — merchant review và quyết định approve/deny
- Không thể cancel items đã shipped
- Cancel subscription order **không cancel subscription contract**
- Áp dụng cho tất cả order types, kể cả B2B
- Digital goods và personalized products phải handle thủ công

**Docs:** [Self-serve cancellations](https://help.shopify.com/manual/fulfillment/managing-orders/returns/self-serve-cancellations)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin, Inventory
