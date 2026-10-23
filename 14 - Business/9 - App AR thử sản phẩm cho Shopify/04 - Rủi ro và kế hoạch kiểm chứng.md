# 04 – Rủi ro và kế hoạch kiểm chứng

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]].

**Kết luận trước:** 💭 Rủi ro lớn nhất là **khách mua không bấm AR**, chứ không phải kỹ thuật. Cần đo việc này trên shop thật trước khi viết app.

## 1. Lý do ý tưởng có thể thất bại

| # | Rủi ro | Loại | Bằng chứng |
|---|---|---|---|
| 1 | Khách ít dùng AR, nên merchant không thấy đáng trả tiền | Giả thuyết | 📖 Bình luận ngành: khách không dùng hằng ngày, chưa quen (nguồn 19). ⚠️ Không có số đo tỉ lệ bấm AR |
| 2 | Lợi ích chuyển đổi không chứng minh được | Sự thật | ⚠️ Số "94%" không có nghiên cứu gốc (nguồn 17) |
| 3 | 8th Wall trên iPhone bám sàn kém (trôi, sai cỡ) | Giả thuyết | ⚠️ Chưa thử. SLAM bằng JavaScript thường kém ARKit/ARCore. Thử ở giai đoạn 0 |
| 4 | Giấy phép 8th Wall binary có giới hạn | Chưa rõ | 📖 "limited-use license which places restrictions on how it can be used"; ⚠️ chưa đọc hết LICENSE |
| 5 | 8th Wall ngừng hẳn bản binary | Giả thuyết | 📖 Niantic đã tắt hosting năm 2026. 💭 Tách lớp tracking riêng để đổi sang WebXR (Android) / app native (iOS) |
| 6 | Merchant không có file 3D cho từng variant | Giả thuyết | 💭 Shop nội thất nhiều variant hình dạng khác nhau → cần nhiều file. Hỏi ở phỏng vấn |
| 7 | Tải nặng trên 4G (engine + three.js + GLB) | Giả thuyết | ⚠️ Chưa đo. Tải lười chỉ khi bấm nút |
| 8 | Thị trường đông app 3D/AR rẻ ($0–19) | Sự thật | 📖 Viewly $0–19, nhiều app 0 review (xem [[9 - App AR thử sản phẩm cho Shopify/01 - Đối thủ và thị trường\|01 - Đối thủ và thị trường]]). 💭 Nhưng chưa thấy app nào có thanh đổi variant trong cảnh AR |

## 2. Kế hoạch kiểm chứng

**Giai đoạn 0 – thử kỹ thuật (1–2 ngày):** xem [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06]] mục 5.

**Giai đoạn 1 – kiểm chứng merchant (2 tuần):**
1. **Tìm 15–20 shop** nội thất trên Shopify có sản phẩm nhiều variant (kích thước, màu, chất liệu).
2. **Phỏng vấn 8–10 merchant**, hỏi đúng các câu:
   - Khách có hỏi "bản 1m6 đặt vào phòng trông thế nào" không? Bao nhiêu % đơn trả lại vì "không như tưởng tượng / sai cỡ"?
   - Đã thử 3D/AR chưa? Dừng ở bước nào?
   - Có file 3D không? Mỗi variant có file riêng không?
   - Sẵn sàng trả bao nhiêu/tháng?
3. **Cài bản giai đoạn 0** cho 2–3 shop đồng ý.
4. **Đo 2 tuần** trên các shop đó.

## 3. Tiêu chí thành công

⚠️ Chưa có cơ sở để đặt ngưỡng; số dưới là để anh quyết, không phải số đo.

| Đo gì | Lấy ở đâu |
|---|---|
| Số merchant nói có đơn trả lại vì sai cỡ | Phỏng vấn |
| % lượt xem trang SP có bấm AR | Theme app extension đếm lượt |
| Tỉ lệ thêm giỏ: nhóm bấm AR vs nhóm không | Shopify analytics + đếm lượt |
| Số lần đổi variant trong 1 phiên AR | Sự kiện từ thanh variant |
| Thêm giỏ ngay trong màn AR | Sự kiện "Thêm vào giỏ" của thanh variant |
| Số merchant đồng ý trả tiền sau khi dùng thử | Phỏng vấn lại |

## 4. Câu hỏi còn mở

- ⚠️ Safari iOS 2026 đã có WebXR `immersive-ar` chưa? Cần mở trang WebKit feature status. Nếu có, iPhone dùng WebXR thay 8th Wall.
- ⚠️ Có app Shopify nào đã làm thanh đổi variant trong cảnh AR chưa? Cần tìm kỹ trước giai đoạn 1.
- ⚠️ Lời phàn nàn của khách mua về AR trên Reddit / diễn đàn: chưa tìm.
- ⚠️ Video Amazon "View in Your Room" ([YouTube, i3D, 2026-07-31](https://www.youtube.com/watch?v=IamExgPUudc)) chấm điểm thế nào: chưa xem nội dung.
