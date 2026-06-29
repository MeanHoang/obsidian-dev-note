# 💡 Ví dụ thực tế (SaaS / Web App)

> Áp dụng [[02 - Checklist phân tích Feature]] vào các tình huống quen thuộc.

## Ví dụ A — "Thêm Export CSV cho trang Đơn hàng"

**❌ Dev thuần:** thêm nút, query hết đơn, đẩy ra file. Xong.

**✅ Product Engineer:**

| Bước | Phân tích |
|---|---|
| **WHY** | Tại sao cần export? → Kế toán đối chiếu doanh thu cuối tháng, đang **copy-paste tay** (bằng chứng pain thật) |
| **VALUE** | Tiết kiệm ~2h/tháng, giảm sai sót nhập tay |
| **SCOPE** | Chỉ export cột kế toán dùng (mã, ngày, tổng tiền, trạng thái) + filter theo tháng. **Non-goals:** chọn cột tùy biến, PDF, lên lịch tự động |
| **CASES** | List rỗng? 100k dòng → timeout → cần async + email? Phân quyền (chỉ đơn của mình?)? Format tiền/locale vỡ CSV? |
| **RULES** | Chỉ Accountant/Admin export? Audit log ai export data nhạy cảm? |
| **WHERE** | Logic build data đặt ở **service layer** → tái dùng cho API và scheduled job sau |
| **DONE** | Kế toán mở file bằng Excel không lỗi font, số khớp dashboard, **thực sự bỏ được copy tay** |

> 🎁 Kết quả: có khi MVP chỉ tốn 1 ngày thay vì 1 tuần — và đúng cái họ cần.

## Ví dụ B — "Làm tính năng Comment trong app quản lý Task"

**Câu hỏi MVP đắt giá:** Comment để làm gì? → Giảm việc nhảy qua Slack hỏi nhau về task.

- **MVP:** text comment + tên người + thời gian. **Đủ.**
- **Cắt khỏi MVP (Could):** mention @user, đính kèm file, emoji, edit/delete, realtime push.
- **Bẫy thường gặp:** dev nhảy vào làm websocket realtime + mention ngay → tốn 2 tuần cho thứ **chưa chắc ai dùng**.

> Bài học: làm phần lõi trước, xác nhận có người dùng rồi mới đầu tư phần đắt tiền.

## Ví dụ C — Cách công ty SaaS quyết định làm feature

Họ gác feature qua bộ lọc [[06 - Frameworks|RICE]]:

- **Reach** — bao nhiêu user bị ảnh hưởng?
- **Impact** — tác động lên metric chính (activation/retention/revenue)?
- **Confidence** — ta chắc chắn cỡ nào?
- **Effort** — tốn bao nhiêu?

> Feature "nghe hay" nhưng Reach thấp + Effort cao → thường bị gạt.
> Là Product Engineer, bạn dùng chính RICE để **bảo vệ thời gian của mình**.

## Ví dụ D — Phân biệt Problem vs Solution (luyện tập)

| Yêu cầu nhận được (Solution) | Problem thật có thể là |
|---|---|
| "Thêm filter cho bảng" | User không tìm thấy item họ cần |
| "Thêm nút Refresh" | User không tin data đang hiển thị là mới |
| "Cho phép tùy chỉnh dashboard" | Mỗi role quan tâm metric khác nhau |
| "Gửi thêm email thông báo" | User bỏ lỡ sự kiện quan trọng |

> Luôn hỏi: *"Yêu cầu này đang giải quyết vấn đề gì? Có cách rẻ hơn không?"*

Liên quan: [[02 - Checklist phân tích Feature]] · [[06 - Frameworks]]
