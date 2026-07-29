# Sidekick-generated Apps

Sidekick có khả năng tạo app từ mô tả bằng ngôn ngữ tự nhiên. Trong Editions Spring 2026, trải nghiệm chỉnh sửa app được cải thiện mạnh.

---

## Plan availability

> "Generating apps with Sidekick is available only to stores on the Grow plan, Advanced plan, and Shopify Plus plan."

## Permissions

Staff members cần quyền **"App development > Develop"** để generate hoặc edit apps. Apps được shared tại store level.

---

## Quy trình tạo app

1. Mô tả app idea cho Sidekick bằng ngôn ngữ tự nhiên
2. Sidekick tạo plan và generate app
3. Có thể build complex applications theo từng giai đoạn (stages) — Sidekick "may construct the app in multiple stages" cho app phức tạp

**Lưu ý:** chỉ khả dụng trên **desktop web browser** trong Shopify admin — không hỗ trợ mobile devices, tablets, hoặc mobile web admin.

---

## App Editor features

### Chat-based refinement
Mô tả thay đổi trong chat, Sidekick cập nhật code tương ứng. Merchant refine app thông qua feedback liên tục.

### Code editor
Chuyển đổi giữa chế độ xem **code** và **preview**.

### Targeted editing
Click **icon target** để chọn đúng phần cần Sidekick chỉnh sửa — "target specific sections using the selection tool."

### Cross-device preview
Xem trước app trên cả **Desktop** và **Mobile** view tại các screen sizes khác nhau.

---

## Version management

- Sidekick tạo **version mới** mỗi lần cập nhật app
- Merchant có thể chọn giữa các versions và **restore version cũ** nếu cần
- Cho phép an toàn thử nghiệm thay đổi mà không mất code trước đó

---

## API Access

Generated apps chỉ truy cập được **Admin API**, bao gồm:
- Orders
- Products
- Customers
- Discounts
- Content (metaobjects, files, menus, blog posts)
- Analytics data

---

## Limitations

- Apps chỉ hoạt động **trong Shopify admin** — "aren't visible to customers and can't access functions outside the Shopify admin":
  - Themes
  - Checkout
  - Customer account apps
  - Customer-facing functions
- Có **usage limits theo giờ và theo tuần** (tự refresh) — dựa trên app complexity. Merchant nhận thông báo khi gần đạt limit.
- Chỉ hoạt động trên **desktop web browser**, không khả dụng trên Shopify mobile app, mobile web admin, iPhone, Android, hay tablets

---

## Testing & Installation

- **Trước khi install:** test kỹ app vì chúng có thể modify customer-facing store data
- Merchant có thể review permissions trước khi install
- Install qua nút **"Install"** trong editor
- Uninstall như bất kỳ app thông thường nào

---

## Edit app đã có

2 cách:
1. Vào **Apps page** > menu options để edit installed apps
2. Tiếp tục edit app đang làm dở từ previous Sidekick conversations

---

## Nguồn

- [Sidekick-generated apps - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/generate-apps)
