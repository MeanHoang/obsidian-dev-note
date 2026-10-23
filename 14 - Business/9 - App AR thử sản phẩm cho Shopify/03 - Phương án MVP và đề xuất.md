# 03 – Hướng đã chốt và MVP

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Stack ở [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06 - Stack công nghệ]].

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.
> Chốt ngày 2026-10-23 (anh chốt).

**Kết luận trước:** Làm **trang AR đặt nội thất trong phòng, chạy ngay trên trang sản phẩm, có thanh bên đổi variant tại chỗ, bấm "Thêm vào giỏ" là thêm đúng variant đang thấy.** Ngành đầu tiên: nội thất (bàn, ghế, kệ, đèn). Merchant tự có file 3D (GLB) hoặc dùng app/dịch vụ khác để làm.

## 1. Khách thấy gì (theo 1 ví dụ)

Khách xem "Bàn gỗ Oak" có 2 kích thước (1m2, 1m6) × 2 màu (sồi, óc chó):
1. Mở trang sản phẩm trên điện thoại. Dưới ảnh có nút **"Đặt thử trong phòng"** (nút của app, không phải nút AR của Shopify).
2. Bấm nút. Trình duyệt hỏi quyền camera. Màn AR toàn màn hình mở ra **ngay trên trang sản phẩm**, không nhảy app.
3. Chĩa xuống sàn, chạm để đặt bàn. Kéo để dời, xoay bằng 2 ngón. Kích thước khoá đúng tỉ lệ thật.
4. **Thanh bên** liệt kê variant. Bấm "1m6" → bàn dài ra tại chỗ. Bấm "óc chó" → đổi chất liệu tại chỗ.
5. Bấm **"Thêm vào giỏ"** trên thanh bên → thêm variant "1m6 / óc chó". Đóng AR, quay về trang sản phẩm như cũ.

## 2. So với cái đã có

| | Nút AR của Shopify | App mình |
|---|---|---|
| Ở lại trang | Không: nhảy sang Quick Look / Scene Viewer | Có |
| Đổi variant trong cảnh | Không: thoát ra, chọn, mở lại | Có, thanh bên |
| Thêm giỏ trong cảnh | Không | Có, đúng variant đang xem |
| Nhiều món cùng lúc | Không | Giai đoạn 3 |
| Đo hiệu quả | Không có số liệu | Đếm mở AR, đổi variant, thêm giỏ |

## 3. Variant nối với mô hình 3D thế nào

💭 Variant mỗi shop tự đặt (màu, kích thước, chất liệu, kiểu dáng…), nên merchant khai báo cho từng variant 1 trong 3 cách:

| Variant khác nhau ở | Cách hiện | Merchant đưa |
|---|---|---|
| Hình dạng (bàn tròn / vuông) | Mỗi variant 1 file GLB | Nhiều file GLB |
| Màu, chất liệu | Cùng file, đổi chất liệu | Tên chất liệu trong file GLB, hoặc ảnh texture |
| Kích thước, cùng hình dạng | Cùng file, scale theo số đo | Số đo dài × rộng × cao của variant |

💭 Mặc định: không khai báo gì thì variant dùng file 3D chung của sản phẩm.

⚠️ Scale theo số đo sẽ làm chân bàn dày lên theo. Cần thử xem mắt người có chấp nhận không. Nếu không, variant kích thước cũng phải có file riêng.

## 4. Phạm vi MVP

**Làm:**
- Nút "Đặt thử trong phòng" (theme app extension).
- Màn AR trên trang: đặt lên sàn, dời, xoay, kích thước thật cố định.
- Thanh bên đổi variant (3 cách ở mục 3) + "Thêm vào giỏ".
- Admin: chọn sản phẩm, tải GLB, gắn GLB/chất liệu/số đo cho variant, xem trước.
- Đếm sự kiện: mở AR, đặt thành công, đổi variant, thêm giỏ.
- Máy không chạy được AR → trình xem 3D thường (xoay bằng tay), vẫn có thanh variant. Desktop → mã QR mở trên điện thoại.

- **Ảnh → 3D trong app (anh chốt 2026-10-23):** merchant chọn 2–4 ảnh + nhập số đo → app gọi API sinh GLB → tự scale đúng số đo → merchant xem trước, duyệt → app đẩy vào product media. Sinh lại được nếu hỏng.

**Không làm ở MVP:**
- Nhiều món cùng lúc trong 1 cảnh.
- Quần áo, kính, phụ kiện đeo (công nghệ khác hẳn).
- Treo tường (tranh, gương).

## 5. Lộ trình

| Giai đoạn | Nội dung | Điều kiện đi tiếp | Thời gian 💭 |
|---|---|---|---|
| 0. Thử kỹ thuật | Trang HTML tĩnh: three.js WebGPU + WebXR đặt 1 cái bàn lên sàn trên Android + thanh 2 variant; iPhone mở Quick Look. Việc cần kiểm ở [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ\|06]] mục 5 | Đặt được, đứng yên khi đi quanh, đổi variant không giật | 1–2 ngày |
| 1. Kiểm chứng merchant | Phỏng vấn 8–10 shop nội thất có variant; cài bản 0 cho 2–3 shop | ≥ 2 shop đồng ý dùng thử thật | 2 tuần |
| 2. MVP | Mục 4 | ≥ 5 shop cài, có số liệu thêm giỏ từ AR | 4–6 tuần |
| 3. Mở rộng | Nhiều món cùng lúc, treo tường, Android chuyển sang WebXR | Khách đặt ≥ 2 món/phiên | — |
| 4. Tương lai | Kính AR / MR dùng lại kho GLB + số đo + map variant | Thiết bị đủ phổ biến | — |

Các ngưỡng ở cột "Điều kiện đi tiếp" là ⚠️ số em đặt để anh sửa, chưa có cơ sở đo.

## 6. Merchant cần đưa gì

| Cần | Bắt buộc | Ghi chú |
|---|---|---|
| File GLB **hoặc** 2–4 ảnh nhiều góc trên nền sạch | Có | Không có GLB thì app tự sinh từ ảnh |
| Map variant → file / chất liệu / số đo | Không (mặc định dùng file chung) | Làm trong admin app |
| Số đo thật của sản phẩm | Khuyến nghị | App dùng để kiểm file GLB có đúng cỡ không |

## 7. Chi phí ước tính

💭 Giả định, chưa đo:
- 8th Wall engine binary: 📖 LICENSE cấm dùng cho sản phẩm thu phí, xem [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06]] mục 6.
- Sinh 3D (Meshy): 📖 Image/Multi-Image to 3D có texture = 30 credit/lần (meshy-6 / 7.1). 📖 Gói Pro 527.000₫ / 1.000 credit, Premium 1.050.000₫ / 3.000 credit (trang giá Meshy hiện VND). → khoảng 10.500–15.800₫ (~$0,4–0,6) / lần sinh. ⚠️ API mua credit riêng trong cài đặt gói, giá API có thể khác; chưa tính số lần sinh lại.
- File GLB và JS: trên CDN của Shopify (product media + asset của theme app extension) → gần $0.
- Backend: Firebase gói miễn phí lúc kiểm chứng.
