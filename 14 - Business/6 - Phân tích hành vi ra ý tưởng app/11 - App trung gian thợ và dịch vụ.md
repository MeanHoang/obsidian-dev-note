# 11 – App trung gian thợ và dịch vụ

Ý tưởng của anh, ngày 2026-10-11. Nguồn gốc: vụ chủ nhà và đội phá dỡ cãi nhau vì tiền ở Hà Nội (tháng 10/2026).

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.

## Ý tưởng ban đầu

App đứng giữa, kết nối khách với thợ (tháo dỡ, xây, sửa, điện nước, sơn, chuyển nhà…) và bảo vệ tiền để không ai bị quỵt. Bắt đầu ở Việt Nam, sau có thể ra thế giới.

**Điều anh lo:** thợ thường thuộc một công ty hoặc đội, và khách liên hệ qua công ty chứ không qua từng thợ.

## Các file

| File | Nội dung |
|---|---|
| [[11.1 - Thị trường Việt Nam]] | Vụ việc, cách người Việt thuê thợ, app nào đã làm, pháp lý giữ tiền, quy mô |
| [[11.2 - Thế giới và bài học]] | Thumbtack, TaskRabbit, Urban Company, Kaodim, Homejoy…; 5 bài học khó; giữ tiền trung gian; thợ thuộc công ty |

## Phát hiện chính

| Câu hỏi | Trả lời ngắn |
|---|---|
| Vụ việc thật ra thiếu gì? | Không thiếu kênh chuyển tiền (hai bên có chuyển khoản). Thiếu **một bản ghi hai bên cùng xác nhận**: ai thuê, làm phần nào, giá bao nhiêu, dừng ở đâu. Bên đòi tiền là **một đội**, không có hợp đồng giấy |
| Ai bị thiệt? | **Cả hai chiều:** thợ bị chủ nhà hoặc cai thầu quỵt; khách bị chặt chém, thợ làm ẩu. Đặt thợ qua app vẫn bị chê đòi giá khác app |
| Ở Việt Nam ai đã làm? | Chỉ **giúp việc theo giờ** thành công thật (bTaskee). App gọi thợ (Vua Thợ, Thợ Việt, 5Sao, FixME) nhỏ hoặc bị chê; Rada, Thế Giới Thợ coi như đã chết |
| Thế giới thì sao? | Nền tảng sống khoẻ **không giữ tiền**: bán thông tin khách cho thợ (Thumbtack, Bark) hoặc thu phí thành viên (Checkatrade). Nền tảng giữ tiền và ăn hoa hồng phần lớn đã chết, bị bán hoặc vẫn lỗ. Urban Company có lãi nhờ kiểm soát thợ rất chặt, và chỉ làm việc nhỏ, giá chuẩn |
| App tự giữ tiền được không? | **Gần như không** với người làm một mình. Theo Nghị định 52/2024 cần giấy phép Ngân hàng Nhà nước, vốn tối thiểu 50 tỷ. Grab từng bị phạt 900 triệu vì ví chưa có phép |
| Giữ tiền có hút người dùng không? | Chưa thấy bằng chứng nào |
| Thợ thuộc công ty thì sao? | Đúng là chỗ khó. Phần lớn nền tảng thế giới coi **công ty là khách hàng**. Riêng vụ việc có hai kiểu quỵt: khách quỵt đội thợ, và cai hoặc công ty quỵt thợ. Giữ tiền của khách chỉ chặn được kiểu đầu |

## 💭 Đánh giá: chợ kết nối thợ (ý tưởng ban đầu)

| Vấn đề | Mức |
|---|---|
| Khách và thợ gặp nhau xong thì lần sau làm thẳng, bỏ app | Rất cao |
| Việc lớn như tháo dỡ, xây sửa hiếm khi lặp lại, nên mỗi khách mới rất đắt | Cao |
| Phải gây dựng cả thợ lẫn khách, từng thành phố | Cao |
| Thợ làm ẩu thì app bị trách | Cao |
| Giữ tiền cần giấy phép | Gần như chặn |
| Đối thủ ở Việt Nam đã thử và phần lớn chết | Cao |

💭 **Không nên làm chợ kết nối thợ**, nhất là bắt đầu bằng việc lớn như tháo dỡ, và chưa nên làm toàn cầu.

## 💭 Hướng đáng thử hơn: công cụ cho chính đội thợ

Chuyện anh lo ("thợ thuộc công ty") lại chỉ ra hướng hợp hơn. **Khách hàng của app là đội thợ, cai thầu, công ty nhỏ**, không phải người đi tìm thợ.

**Tên tạm: "Biên bản giao việc"**

| Phần | Nội dung |
|---|---|
| App là gì | Công cụ giúp đội thợ tạo thoả thuận làm việc có hai bên xác nhận, ghi lại tiến độ, nghiệm thu và thu tiền theo từng mốc. **App không giữ tiền** |
| Luồng | 1. Đội thợ tạo báo giá: phạm vi, giá, các mốc thanh toán. 2. Gửi link qua Zalo, chủ nhà xác nhận bằng mã OTP (hợp đồng điện tử). 3. Mỗi ngày chụp ảnh tiến độ, có ngày giờ và vị trí. 4. Xong mỗi mốc, gửi link nghiệm thu kèm mã VietQR để chuyển khoản. 5. Phát sinh thì tạo phụ lục, hai bên xác nhận lại. 6. Có tranh chấp thì xuất một file PDF đủ bằng chứng |
| Giải quyết gì trong vụ việc | Có bản ghi rõ ai thuê, phạm vi, giá, đã trả bao nhiêu, còn bao nhiêu |
| Ai trả | Đội thợ, cai thầu, công ty sửa chữa nhỏ (gói tháng thấp) |
| Mở rộng sau | Cai trả lương thợ theo ngày công có bản ghi (chặn kiểu quỵt thứ hai); về sau mới thêm phần tìm khách |
| Ra thế giới | Mô hình này đã có ở nước ngoài (Buildertrend, Houzz Pro, Joist); ở Việt Nam thì chưa thấy |

**Rủi ro:**
- Đội thợ quen làm miệng và tiền mặt, ngại giấy tờ. Có thể họ không muốn gửi hợp đồng vì sợ mất khách.
- Chủ nhà có thể không chịu ký.
- Khả năng chi trả của đội thợ nhỏ thấp.
- ⚠️ Cần hỏi luật sư xem xác nhận bằng OTP và nhật ký ảnh có đủ giá trị chứng cứ không.

## Kiểm chứng trước khi viết code (2 tuần)

1. Nói chuyện với 5–10 đội thợ hoặc cai thầu (sửa nhà, phá dỡ, sơn, điện nước). Có thể tìm qua người quen, nhóm Facebook thợ, hoặc số điện thoại trên tờ rơi. Hỏi theo kiểu The Mom Test ([[13 - How to Talk to Users]]):
   - "Lần gần nhất bị chậm hoặc mất tiền là khi nào? Chuyện xảy ra thế nào?"
   - "Anh đang chốt giá, chốt phạm vi với khách bằng gì?"
   - "Phát sinh thì xử lý sao?"
2. Hỏi 3–5 chủ nhà vừa sửa nhà: lần đó có tranh cãi gì không, có muốn một bản thoả thuận rõ ràng không.
3. Làm tay bằng Google Docs và Zalo cho 2–3 đội thợ thật trong một công trình, xem họ có dùng hết công trình không.
4. **Dừng nếu** đội thợ không muốn đưa giấy tờ cho khách, hoặc không ai chịu trả tiền sau khi đã dùng thử.
