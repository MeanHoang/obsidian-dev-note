# 04 – Rủi ro và kế hoạch kiểm chứng

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]].

**Kết luận trước:** 💭 Rủi ro lớn nhất là **khách mua không bấm AR**, chứ không phải kỹ thuật. Cần đo việc này trên shop thật trước khi viết app.

## 1. Lý do ý tưởng có thể thất bại

| # | Rủi ro | Loại | Bằng chứng |
|---|---|---|---|
| 1 | Khách ít dùng AR, nên merchant không thấy đáng trả tiền | Giả thuyết | 📖 Bình luận ngành: khách không dùng hằng ngày, chưa quen (nguồn 19). ⚠️ Không có số đo tỉ lệ bấm AR |
| 2 | Lợi ích chuyển đổi không chứng minh được | Sự thật | ⚠️ Số "94%" không có nghiên cứu gốc (nguồn 17) |
| 3 | Shopify tự làm "ảnh → 3D" | Suy luận | 💭 Shopify đã làm sẵn viewer + chuyển định dạng; bước tiếp theo hợp lý là sinh 3D |
| 4 | Sinh 3D từ ảnh sai hình, merchant không dám đăng | Giả thuyết | 💭 Đồ trong suốt, phản chiếu, mỏng dễ hỏng |
| 5 | Thị trường đông app rẻ ($0–19) | Sự thật | 📖 Viewly $0–19, nhiều app 0 review (xem [[9 - App AR thử sản phẩm cho Shopify/01 - Đối thủ và thị trường\|01 - Đối thủ và thị trường]]) |
| 6 | Hàng phẳng quá dễ chép | Suy luận | 💭 Ai cũng sinh được tấm phẳng; giá trị chỉ là nhập hàng loạt + đọc kích thước |

## 2. Kế hoạch kiểm chứng 2 tuần (trước khi code)

1. **Tìm 15–20 shop** bán tranh, poster, thảm, gương, nội thất nhỏ trên Shopify.
2. **Phỏng vấn 8–10 merchant**, hỏi đúng các câu:
   - Khách có hỏi "kích thước thật trông thế nào" không? Bao nhiêu % đơn trả lại vì "không như tưởng tượng / sai cỡ"?
   - Đã thử 3D/AR chưa? Dừng ở bước nào?
   - Kích thước SP đang nằm ở đâu (mô tả, metafield, variant)?
   - Sẵn sàng trả bao nhiêu/tháng?
3. **Làm tay** GLB hàng phẳng cho 2–3 shop đồng ý, gắn vào product media gốc.
4. **Đo 2 tuần** trên các shop đó.

## 3. Tiêu chí thành công

⚠️ Chưa có cơ sở để đặt ngưỡng; số dưới là để anh quyết, không phải số đo.

| Đo gì | Lấy ở đâu |
|---|---|
| Số merchant nói có đơn trả lại vì sai cỡ | Phỏng vấn |
| % lượt xem trang SP có bấm AR | Theme app extension đếm lượt |
| Tỉ lệ thêm giỏ: nhóm bấm AR vs nhóm không | Shopify analytics + đếm lượt |
| Số merchant đồng ý trả tiền sau khi dùng thử | Phỏng vấn lại |

## 4. Câu hỏi còn mở

- ⚠️ AR Quick Look / Scene Viewer có cho nhiều sản phẩm trong 1 cảnh không?
- ⚠️ Safari iOS 2026 đã có WebXR `immersive-ar` chưa? Cần mở trang WebKit feature status.
- ⚠️ Viewly nút "Generate" là gì? Nếu là ảnh → 3D thì ý tưởng #2 đã có đối thủ trực tiếp.
- ⚠️ Chi phí Meshy tính ra USD mỗi sản phẩm.
- ⚠️ Lời phàn nàn của khách mua về AR trên Reddit / diễn đàn: chưa tìm.
