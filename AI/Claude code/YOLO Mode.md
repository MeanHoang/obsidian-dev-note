YOLO mode trong Claude Code là chế độ cho phép Claude tự động thực thi các lệnh shell và tool calls **mà không cần hỏi xác nhận** từ người dùng mỗi lần.
**Cách bật:**
- Chạy `claude --dangerously-skip-permissions` khi khởi động
- Hoặc dùng flag `--yolo` (alias ngắn gọn)
**Tác dụng:**
- Bỏ qua tất cả prompt xác nhận permission
- Claude tự do chạy bash commands, edit files, tạo files mà không cần approve
- Tăng tốc workflow khi bạn tin tưởng Claude sẽ làm đúng
**Rủi ro:**
- Không có cơ hội review trước khi Claude thực thi lệnh nguy hiểm (xóa file, force push, v.v.)
- Chỉ nên dùng trong môi trường sandbox hoặc khi bạn hiểu rõ task đang làm
**Cách an toàn hơn:** Thay vì YOLO mode hoàn toàn, bạn có thể cấu hình permission chi tiết trong `settings.json` để auto-allow các tool cụ thể (ví dụ: cho phép `Read`, `Glob`, `Grep` tự động nhưng vẫn hỏi khi `Bash` hoặc `Write`).