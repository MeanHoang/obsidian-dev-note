# Claude for Chrome

> Nguồn: https://claude.com/claude-for-chrome — cập nhật 2026-07-02, đang **beta**, cần **gói trả phí** (mọi paid plan).

## Nó là gì

Extension Chrome chính thức của Anthropic, cho phép Claude **điều khiển trình duyệt thật**: điều hướng trang, nhấp nút, điền form — thay vì chỉ trả lời text. Cài từ Chrome Web Store → "Add to Chrome".

## Tính năng chính

- **Điều khiển browser**: navigate, click, fill form trực tiếp trên tab Chrome.
- **Chạy nền (background tasks)**: giao việc cho Claude làm trong khi mình làm việc khác.
- **Scheduled workflows**: thiết lập quy trình chạy định kỳ hàng ngày/tuần (báo cáo, kiểm tra).
- **Tích hợp Claude Code / Cowork / Claude Desktop**:
	- Với **Cowork**: Chrome đi thu thập dữ liệu → Cowork xuất Excel, deck so sánh, report.
	- Với **Desktop**: bắt đầu task ở Desktop, Claude tự xử lý phần browser không cần chuyển cửa sổ.
	- Với **Claude Code**: quy trình end-to-end không cần copy-paste dữ liệu giữa các app.

## Use case mẫu (từ trang chủ)

1. Trích số liệu từ analytics dashboard
2. Sắp xếp Google Drive, tạo cấu trúc thư mục
3. Đọc lịch + email → lên kế hoạch, đặt phòng họp
4. So sánh giá/tính năng đối thủ cạnh tranh
5. Tự ghi activity log vào CRM sau cuộc họp
6. Quét inbox dọn email quảng cáo

## Kiểm soát quyền

- **Pre-approve** hành động cho từng website trước khi bắt đầu, hoặc skip toàn bộ permission (chỉ nên khi giám sát chặt).
- Claude **luôn hỏi xác nhận** với hành động không thể hoàn tác (mua hàng, xóa).

## Rủi ro & giới hạn ⚠️

- **Prompt injection**: trang web độc hại có thể nhúng chỉ dẫn lừa Claude làm hành động ngoài ý muốn.
- Claude có thể **hallucinate** → thao tác sai.
- Anthropic khuyến cáo **tránh dùng cho**: giao dịch tài chính, quản lý mật khẩu, dữ liệu nhạy cảm.
- Khuyến nghị: bắt đầu với site tin cậy, review kỹ task nhạy cảm, report hành vi lạ.

---

## Ý tưởng ứng dụng cho Joy (Shopify loyalty app)

### 1. Test luồng E2E trên staging ⭐ tiềm năng nhất

- **Install / uninstall flow**: cho Claude tự install app Joy lên dev store → verify webhook `APP_UNINSTALLED` được đăng ký (liên quan bug [[Joy webhook APP_UNINSTALLED]]) → uninstall → check `hasUninstalled`.
- **Smoke test embedded admin**: mở app trong Shopify admin, đi qua các màn chính (program setup, points, rewards, tiers) xem có màn nào trắng/lỗi sau mỗi lần deploy staging.
- **Test tính point**: tạo order test trên dev store → chờ → mở Joy admin kiểm tra point cộng đúng chưa (bug kiểu "check tính point sai" có thể tự động hoá phần reproduce).
- **Coupon/reward redemption trên storefront**: Claude tự đi qua flow customer đổi point lấy coupon → apply vào checkout → verify discount (case POS thì khó vì cần thiết bị).
- **Gift card / referral flow**: đi hết flow referral link → signup → verify reward.

### 2. Kiểm tra định kỳ (scheduled workflows)

- Hàng sáng: mở Firebase console / dashboard staging → check error logs, function failures → tổng hợp báo cáo.
- Hàng tuần: quét review app Joy trên Shopify App Store, tổng hợp complaint mới.

### 3. Nghiên cứu đối thủ

- Định kỳ crawl trang pricing/changelog của Smile.io, Yotpo, Rivo, BON... → so sánh tính năng, kết hợp Cowork xuất deck so sánh.

### 4. Hỗ trợ debug support ticket

- Merchant báo bug → Claude tự vào dev store, reproduce theo mô tả ticket, chụp lại các bước → đỡ công reproduce thủ công.

### Lưu ý khi dùng cho Joy

- **Chỉ dùng dev/staging store**, không đụng production store có dữ liệu merchant thật (rủi ro prompt injection + hallucination).
- Shopify admin login + 2FA có thể là điểm nghẽn — nên dùng session đã đăng nhập sẵn trên dev store.
- Không thay thế E2E test tự động (Playwright/Cypress) cho CI — mạnh nhất ở **exploratory testing** và các flow one-off khó script.

## Liên quan

- [[Claude code]]
