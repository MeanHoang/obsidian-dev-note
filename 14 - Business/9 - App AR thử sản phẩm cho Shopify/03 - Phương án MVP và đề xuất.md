# 03 – Phương án MVP và đề xuất

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Dựa trên [[9 - App AR thử sản phẩm cho Shopify/01 - Đối thủ và thị trường|01 - Đối thủ và thị trường]] và [[9 - App AR thử sản phẩm cho Shopify/02 - Kỹ thuật làm được gì hôm nay|02 - Kỹ thuật làm được gì hôm nay]].

> Toàn bộ note này là 💭 nhận định, trừ chỗ ghi 📖.

**Kết luận trước:** Chọn **C – MVP một ngành**: nội thất/trang trí, app **làm ra file 3D đúng kích thước** từ ảnh + số đo merchant đã có, rồi đẩy vào product media gốc của Shopify. Giai đoạn 1 chỉ làm hàng phẳng (tranh, thảm, gương) vì chính xác 100% mà không cần AI.

## 1. So sánh A / B / C

| Tiêu chí | A. Nền tảng đa ngành | B. Nền tảng chung, 2 trải nghiệm (đặt phòng + đeo người) | C. MVP 1 ngành |
|---|---|---|---|
| Merchant thấy gì | Một app cho mọi loại hàng | Một app, 2 chế độ | App chỉ cho đồ nội thất/decor |
| Đối thủ | Camweara (đa ngành mảng đeo), GenLook, Viewly… | Như A | Viewly, Try at Home, RoomRefresh — nhưng đều cần GLB có sẵn hoặc né 3D |
| Độ khó kỹ thuật | Rất cao: 3 công nghệ lõi khác nhau | Cao: 2 công nghệ | Thấp → trung bình |
| Thời gian 1 dev | ⚠️ nhiều tháng | ⚠️ 3–5 tháng | ⚠️ 3–6 tuần cho bản hàng phẳng |
| Ma sát onboarding | Cao: mỗi ngành cần dữ liệu khác | Cao | Thấp: merchant đã có ảnh + kích thước trong mô tả |
| Kiếm tiền | Khó định giá | Khó định giá | Theo số SP được tạo 3D |
| Chống bị chép | Thấp | Thấp | Trung bình: chất lượng sinh 3D đúng tỉ lệ + nhập hàng loạt |

**Chọn C**, vì nó nhắm đúng chỗ tắc đã thấy: 📖 làm 3D tốn từ $100/mẫu và cần đo đạc (nguồn 14, 15), còn 📖 viewer thì Shopify có sẵn (nguồn 1, 2).

## 2. Năm cơ hội MVP

| # | Ý tưởng | Khách thấy gì | Khó | Đối thủ | Đánh giá |
|---|---|---|---|---|---|
| 1 | **Hàng phẳng đúng kích thước** (tranh, poster, thảm, gương, giấy dán tường) | Nút AR Shopify gốc, treo tranh đúng cỡ lên tường thật | Thấp: sinh GLB tấm phẳng bằng code | Try at Home có chế độ phẳng | ⭐ Làm trước để kiểm chứng nhu cầu |
| 2 | **Ảnh → 3D đúng tỉ lệ cho nội thất** (ghế, bàn, đèn, chậu) | Như trên, cho đồ có khối | Trung bình: API image-to-3D + chỉnh tỉ lệ + cho merchant duyệt | 📖 Đã có: AI 3D Model Generator (miễn phí), 3Dify ($9.99) — chưa app nào ghi rõ đúng kích thước thật. Xem [[9 - App AR thử sản phẩm cho Shopify/05 - Shopify tự làm AR tới đâu\|05]] | ⚠️ Giai đoạn 2, chỉ còn khác biệt ở độ đúng kích thước |
| 3 | Thử quần áo bằng AI | Ảnh khách mặc đồ | Thấp tích hợp, tốn tiền AI theo lượt | GenLook rẻ, review tốt | ❌ Bỏ |
| 4 | Thử kính bằng camera | Kính trên mặt | Cao | Camweara, TouchTry | ❌ Bỏ |
| 5 | Ghép nhiều SP trong 1 phòng (sofa + bàn + thảm) | Bộ sưu tập trong phòng | Cao: ⚠️ chưa kiểm Quick Look có cho không | Chưa thấy | 🔮 Để sau, gần với tầm nhìn kính AR |

## 3. Kiến trúc đề xuất (cho #1 rồi #2)

1. **Admin app** (React + Polaris): merchant chọn sản phẩm, app đọc ảnh + kích thước (từ metafield hoặc nhập tay).
2. **Backend** (Firebase Functions + Firestore, quen tay): hàng phẳng → sinh GLB tấm phẳng; hàng khối → gọi API image-to-3D, rồi scale theo kích thước thật.
3. **Merchant duyệt** bản xem trước 3D trong admin trước khi đăng.
4. **Đẩy file** vào product media qua Shopify GraphQL Admin API (`stagedUploadsCreate` + `productCreateMedia` — ⚠️ tên mutation chưa kiểm lại trên shopify.dev). Shopify tự tạo USDZ (📖 nguồn 1).
5. **Storefront:** không cần widget riêng. Theme hiện nút AR có sẵn. Thêm theme app extension chỉ để đếm lượt mở AR (nếu cần số liệu).

## 4. Merchant cần đưa gì

| Hàng | Cần | Thường đã có? |
|---|---|---|
| Hàng phẳng | 1 ảnh mặt trước + rộng × cao (+ dày) | 💭 Có, thường ghi trong mô tả |
| Hàng khối | 2–4 ảnh nhiều góc trên nền sạch + rộng × sâu × cao | ⚠️ Chưa kiểm bao nhiêu shop có đủ |

## 5. Phạm vi MVP

**Làm:** hàng phẳng, nhập hàng loạt theo collection, đọc kích thước, sinh GLB, đẩy vào product media, gói theo số SP.

**Không làm:** viewer riêng, quần áo, kính, nhiều SP trong 1 cảnh, kính AR, AR trong trình duyệt iPhone.

## 6. Lộ trình

| Giai đoạn | Nội dung | Điều kiện đi tiếp |
|---|---|---|
| 0. Kiểm chứng (2 tuần) | Phỏng vấn merchant, làm tay 3D cho 2–3 shop | Xem [[9 - App AR thử sản phẩm cho Shopify/04 - Rủi ro và kế hoạch kiểm chứng\|04 - Rủi ro và kế hoạch kiểm chứng]] |
| 1. Hàng phẳng | App bản đầu | ≥ 5 shop cài, có lượt mở AR |
| 2. Hàng khối | Ảnh → 3D + merchant duyệt | Tỉ lệ merchant duyệt ≥ ⚠️ chưa có cơ sở đặt ngưỡng |
| 3. Ghép nhiều SP / kính AR | Dùng lại kho GLB chuẩn | Khi thiết bị đủ phổ biến |

## 7. Chi phí ước tính

⚠️ Chưa có số đo. Giả định:
- Hạ tầng lúc kiểm chứng: Firebase gói miễn phí + Shopify giữ file 3D → gần $0.
- Hàng phẳng: không tốn tiền AI.
- Hàng khối: 20–35 credit Meshy/lần sinh (📖 nguồn 16), ⚠️ chưa đổi ra USD; cộng lượt sinh lại khi hỏng.
