# 🎨 AI Office — Mockup UI

Mockup tương tác chạy bằng **dữ liệu giả**, bám theo [[1 - Phân tích yêu cầu]].

- **File:** `mockup/ai-office-mockup.html`. Mở trực tiếp bằng trình duyệt, không cần server.
- **Bản online (private):** https://claude.ai/artifact/VP25oJznubwJ8EQqM1n9Wd, mở được từ cả Mac lẫn Windows.

---

## 🗺️ Các màn hình và cách xem
| Màn hình | Cách mở | Xem gì | Map yêu cầu |
|---|---|---|---|
| 🏢 **Văn phòng** | Mặc định | Thanh số liệu · Sảnh điều phối (Dispatcher, Workspace, Reporter) · 6 phòng với 6 bot mỗi phòng · lọc theo trạng thái · phòng 🚦 nhấp nháy, xếp lên đầu · hover bot để xem việc và model | F-01 → F-07 |
| 🔔 **Activity** | Nút góc trên phải | Feed sự kiện của mọi phòng | F-08 |
| 🚪 **Chi tiết phòng** | Bấm vào một phòng | Stepper Gate 1 → Ship · team và model · hộp 🚦 theo mẫu grill-me · 6 tab: Timeline / Plan / Progress / Decisions / Bằng chứng / Chi phí | R-01 → R-08 |
| ➕ **Giao việc** | Nút "Giao việc" | Bước 1 yêu cầu → bước 2 dispatcher đề xuất (sửa được model) → bước 3 workspace-manager mở phòng, có animation → phòng mới hiện trên sơ đồ | A-01 → A-04 |
| 🚦 **Chờ duyệt** | Sidebar | Gom mọi câu hỏi đang chờ. Bấm A/B/C thì phòng chạy tiếp | US-09, US-10 |
| 📊 **Báo cáo** | Sidebar | 4 tab: Hằng ngày · Chi phí (biểu đồ 7 ngày theo model, theo role) · Chất lượng (verify fail, đề xuất Standards) · Theo phòng | B-01 → B-05 |
| 👥 **Nhân sự & Model** | Sidebar / "Thuê nhân viên" | Bảng role → agent/model (Claude, Codex, Gemini, OpenCode) · agent đã kết nối · ngân sách mặc định | S-01, S-02, S-04 |
| ⚡ **Luật tự động** | Sidebar | Bảng `rules.yaml` có bật/tắt · rào chắn cứng · nút "Bắn sự kiện" để thử luật | S-03 |

---

## 🎬 Kịch bản demo nên thử
1. Ở **Văn phòng**, chờ khoảng 9 giây: phòng *Store credit* tự chuyển từ implementer sang verifier (minh hoạ trigger `code.done → verifier.run`).
2. Bấm phòng **"Email nhắc lên hạng VIP"**, chọn **A** trong hộp 🚦 Gate 1: phòng chuyển sang Gate 2, scout bắt đầu chạy.
3. Bấm phòng **"Lỗi redeem"** (đỏ, vượt ngân sách), chọn **A**: ngân sách tăng thêm $5, implementer opus chạy tiếp.
4. **Giao việc**, đi đủ 3 bước để xem phòng mới xuất hiện.
5. **Luật tự động**: chọn `verify.failed`, bấm "Bắn sự kiện" để xem luật nào được kích hoạt.
6. Bấm **Day/Night** để đổi chế độ sáng/tối.

---

## 📝 Ghi chú thiết kế
- Làm **2D** trước: mỗi phòng là một mặt sàn kẻ ô, mỗi bot ngồi ở một bàn có màn hình. Màn hình sáng khi bot đang làm, bot mờ khi rảnh. Chấm trạng thái: xanh dương = đang làm, vàng = 🚦, đỏ = lỗi, xanh lá = xong.
- Mỗi role một màu cố định, dùng thống nhất từ sơ đồ đến timeline và biểu đồ.
- Dữ liệu giả lấy từ chính các task gần đây của Joy (store credit, tier widget, calculator hu…) để nhìn cho thật.
- Các nút "Mở trong Orca", "Tạm dừng", "Dừng hẳn", "Kết nối" chỉ hiện toast, chưa có chức năng thật.

---

## ✅ Checklist duyệt mockup
- [ ] Bố cục Văn phòng đủ rõ, nhìn là biết việc gì chờ mình?
- [ ] Hộp 🚦 có đủ thông tin để quyết định mà không cần mở terminal?
- [ ] Luồng Giao việc 3 bước có thừa hay thiếu bước nào?
- [ ] Báo cáo ngày có đúng thứ mình cần đọc mỗi sáng?
- [ ] Có cần màn nào nữa không (VD: lịch sử phòng đã lưu trữ, so sánh model)?
