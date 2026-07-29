# Sidekick trong Admin & Mobile

Chi tiết về các tính năng Sidekick trên Shopify admin (desktop + mobile), Apple Watch, và các interaction patterns.

---

## Sidekick everywhere trong Shopify app

Trước đây Sidekick chỉ xuất hiện ở một số màn hình. Giờ merchant có thể truy cập Sidekick **trên bất kỳ màn hình nào** trong Shopify mobile app.

**Cách mở Sidekick:**
- **Desktop:** click Sidekick icon từ bất kỳ admin page nào. Hoặc truy cập trực tiếp qua `admin.shopify.com/sidekick`. Gõ message và click up arrow icon để gửi.
- **Mobile:** tap Sidekick icon trên bất kỳ store page nào. Gõ câu hỏi và tap up arrow để gửi.

**Display modes:**
- Desktop: giữ **Shift + click Sidekick icon** để mở fullscreen
- Desktop: click maximize icon cũng được
- Mobile: tap maximize icon để expand conversation area; swipe down để quay lại compact mode
- Minimize: dùng minimize icon để quay lại compact mode

**Mobile-specific:**
- Sidekick hiển thị trên Orders, Analytics, Products screens và mọi màn hình khác
- iOS: thêm Sidekick làm **lock screen widget**
- Hỗ trợ 3D scanning, barcode printing, tap-to-pay

Sidekick hoạt động theo **context của màn hình hiện tại** — đang ở trang product thì Sidekick hiểu merchant cần hỗ trợ về product đó.

---

## Sidekick trên Apple Watch

### Setup
- Yêu cầu pair Apple Watch với iPhone
- Download Shopify app trên iPhone, dùng Watch app để install
- Scan QR code để authenticate
- Chọn preferred stores khi setup

### Metrics trên Watch
Home view hiển thị:
- Sessions over time
- Total sales over time
- Orders over time
- Conversion rate over time
- Dùng calendar icon để thay đổi date range

### Complications (Watch Face Widgets)

| Complication | Hiển thị |
|---|---|
| Total Sales | Sales theo store và date range |
| Sessions | Online store session count |
| Unfulfilled Orders | Số orders cần fulfill |
| Combined Metrics | Sales + sessions (chỉ rectangular) |
| Sidekick | Truy cập voice trực tiếp từ watch face |
| Shopify button | Mở app nhanh |

Data refresh mỗi **15 phút**. Có thể bật privacy mode qua **Settings > Passcode** để ẩn data khi locked.

### Sidekick Voice Mode
Mở Shopify app hoặc tap **Sidekick complication** trên watch face, tap để bắt đầu nói.

> "After you ask your question, your answer is spoken aloud, and a text summary is displayed on your watch."

**Ví dụ câu hỏi:**
- "How many unfulfilled orders do I have?"
- "What were my total sales today?"
- "Do I have any low stock products?"
- "How many returns do I have?"

**Multiple stores:** response dựa trên active store, xác nhận từ complication label.

### Giới hạn Apple Watch
- Chỉ hỗ trợ **voice mode** (không gõ được)
- Không navigate đến pages trong admin
- Không thay đổi store (edit products, update settings)
- Không generate content hoặc apps
- Không screen sharing

### Kết nối
- Cần iPhone gần đó hoặc chung Wi-Fi
- Models có mobile data riêng thì không cần iPhone
- Real-time updates không xảy ra khi app đang mở (cần đóng/mở lại)

Cho advanced features, dùng Sidekick trên desktop hoặc mobile.

---

## Multi-task với Sidekick

Sidekick hỗ trợ multi-tasking thực sự:

- **Background processing:** Sidekick tiếp tục xử lý task ngay cả khi merchant chuyển sang làm việc khác hoặc đóng cửa sổ chat — "continues working in the background, even if you close the chat or navigate away, and notifies you when it's ready for review"
- **Multiple chats:** chạy nhiều cuộc hội thoại cùng lúc
- **Notification:** khi task chạy nền xong, Sidekick thông báo để merchant review
- **Track từ Home:** merchant có thể "track its progress from Shopify Home" — hiển thị active tasks và status

Đặc biệt hữu ích cho task tốn thời gian như generate app, phân tích data lớn, tạo nội dung hàng loạt.

---

## Follow-up questions

> "If Sidekick needs more details to complete your request, then it asks a follow-up question."

Thay vì bắt merchant gõ câu trả lời dài, Sidekick đưa ra **lựa chọn dạng multiple choice**. Merchant chỉ cần chọn đáp án phù hợp.

Ví dụ: khi yêu cầu "tạo discount", Sidekick có thể hỏi lại: loại discount nào (percentage / fixed amount / free shipping), áp dụng cho collection nào, thời hạn ra sao — tất cả dưới dạng lựa chọn nhanh.

---

## Actionable guidance (Sidekick Pulse + Home cards)

### Sidekick Pulse
Hiển thị "proactive recommendation cards in your Home feed" gợi ý next-best actions dựa trên store data. Đang rollout dần (early access feature).

### Home cards
"Blocks of information that change regularly to adapt to your business":
- Updates về Shopify features mới liên quan đến business
- Lời khuyên sử dụng Shopify hiệu quả
- Data-driven insights về store performance
- Guides cho recommended tasks

**Dismiss:** hover + click X trên desktop hoặc swipe trên mobile (trừ order task cards). Có thể gửi feedback về lý do dismiss.

**Permanent section:** "Discover more of Shopify" ở cuối feed, không dismiss được.

### Insights section

**Điều kiện:** stores trung bình **10+ orders/tuần** (6 tháng gần nhất)
**Tần suất:** tối đa **3 insights/ngày**, hết hạn sau **24 giờ**

3 loại insights:
1. **Trends over time:** so sánh performance với giai đoạn trước
2. **Streaks:** patterns tích cực/tiêu cực liên tục qua nhiều giai đoạn
3. **Top 5 values:** thay đổi giữa các dimensions hoạt động tốt nhất

3 lĩnh vực:
- **Sales:** revenue, orders, product performance theo product/region/channel/vendor
- **Sessions:** visitor changes, cart additions, checkout sessions, conversion rates theo city/country/device type/landing page
- **Fulfillments:** shipping/delivery efficiency theo carrier/channel/shipping location

Truy cập report chi tiết qua nút **"View report"** và có thể nhờ Sidekick guidance.

---

## Sidekick creates customers & fills forms

Merchant mô tả customer bằng ngôn ngữ tự nhiên, Sidekick tự động điền form. "Fields that Sidekick updates are highlighted in purple so you can review the changes."

### Các form Sidekick hỗ trợ:

| Loại | Chi tiết |
|------|---------|
| Customers | Tạo customer mới và thêm thông tin |
| Products | Tạo/edit products, discounts, collections |
| B2B | "Create new companies with available information" (cho store B2B) |
| Orders | Edit order: thêm product/custom items, tăng/giảm số lượng, thêm/update/remove line item discounts, điều chỉnh custom shipping fees, set edit reasons, control customer notifications |
| General | Điền field trên bất kỳ trang admin nào, dùng reference images hoặc direct instructions |

> "The order updates only after you review the changes and click **Update order**."

### Guided workflows
Sidekick tạo **guided workflows** cho onboarding và custom task lists — "guides you through each item" khi tạo products hàng loạt.

---

## Input features

- **Attach/upload files:** gửi file từ admin hoặc device
- **Target mode:** click icon target để chọn phần cụ thể — "click directly on components like buttons, sections, or fields" cho contextual assistance
- **Mention:** @mention products, orders, customers, collections, hoặc apps
- **Third-party apps:** tích hợp qua Sidekick app extensions (xem [[02 - Sidekick App Extensions]])
- **Reusable skills:** save prompts thành shortcuts để dùng lại

---

## Response actions

Tuỳ vào response của Sidekick, merchant có thể:
- Click right arrow icon để navigate đến trang được chỉ định
- Click **"Apply"** để áp dụng generated content vào store

---

## Feedback

Rate responses với thumbs up/down icons. Có thể thêm chi tiết qua **Add comment** dialog.

---

## Limitations

Sidekick **không thể**:
- Xử lý customer support
- Chia sẻ private merchant data
- Edit images trong themes
- Thay đổi bất kỳ gì mà không có merchant approval
- Hoạt động trên tablet devices

---

## Nguồn

- [Sidekick overview - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/index)
- [Sidekick setup & use - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/set-up)
- [Sidekick forms & guidance - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/help-and-guidance)
- [Apple Watch - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-app/watch-app)
- [Shopify Home - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-home)
