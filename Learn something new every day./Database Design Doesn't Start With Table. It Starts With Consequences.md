https://thetshaped.dev/p/database-design-foundations-backend-engineers-mistakes-and-lessons?ref=dailydev
## 📌 Ý chính bài viết
### 🧠 1. **Database design là một quyết định dài hạn**
Không như code có thể sửa nhanh, **schema database rất khó thay đổi** — migrations trên bảng lớn có thể mất nhiều tuần và ảnh hưởng tới production. Thiết kế sai từ đầu sẽ khiến bạn _cháy deadline để fix lỗi, chứ không chỉ tuning performance_.
➡️ **Bài học:** Đừng bắt đầu bằng cách `CREATE TABLE` ngay — hãy hiểu domain business trước.

---
## 🧱 2. **Bắt đầu từ thực tế, không phải bảng**
Hãy:
- Xác định những **thực thể (entities)** trong domain (ví dụ: user, order, product).
- Hiểu **quan hệ và quy tắc dữ liệu** (ví dụ: trạng thái bài đăng có thể là draft/published/expired).
    Nếu schema cho phép trạng thái _không tồn tại trong thực tế_, _sớm muộn sẽ sai dữ liệu_.
---
## 📐 3. **Chuẩn hóa trước, rồi mới cân nhắc hiệu năng**
- Normalization (3NF) giúp loại trừ dư thừa và tránh lỗi cập nhật dữ liệu.
- Tuy nhiên _quá chuẩn hóa_ (quá nhiều join) có thể làm queries chậm.
- **Thiết kế theo pattern truy vấn thực tế:** bắt đầu chuẩn hóa rồi _denormalize có chủ đích_ khi bạn đã rõ dữ liệu và yêu cầu.
---
## 🔍 4. **Indexes là “hợp đồng với tương lai của bạn”**
Indexes giúp truy vấn nhanh hơn nhưng:
- Tăng chi phí ghi (write),
- Tốn không gian lưu trữ,
- Cần được _giám sát và tối ưu định kỳ_.
Cách làm tốt:
- Index trên khóa ngoại và cột hay dùng trong WHERE/JOIN/ORDER BY,
- Tránh index cột có ít giá trị (ví dụ boolean).
---
## 🚫 5. **Constraints = tài liệu tự enforce quy tắc dữ liệu**
Constraint như:
- `FOREIGN KEY`
- `NOT NULL`
- `UNIQUE`
- `CHECK`
Không chỉ bảo vệ tính toàn vẹn dữ liệu mà còn _giảm lỗi trong code_, vì database reject dữ liệu sai ngay từ lúc insert/update.

---
## 🏃‍♂️ 6. **Performance là một lựa chọn thiết kế**
Chasing performance bằng caching, read replicas hay tuning connection pool chưa chắc giải quyết gốc rễ — _nhiều lỗi performance xuất phát từ schema sai_. Thiết kế đúng lúc đầu có thể “dọn sạch” root problems và giúp hệ thống mở rộng tốt hơn.

---
## 🎓 7. **Lời khuyên từ người đi trước**
- Practice với các hệ thống thực tế (ví dụ LinkedIn, Airbnb).
- Vẽ ERD (entity–relationship diagram) trước khi implement code.
- Học SQL sâu: joins, window functions, CTE, query plans.
- Đừng sợ migration nếu bạn học được thêm điều gì đó từ dữ liệu thật.
---
## 📌 **Tóm lại**

> **Database design không phải chỉ tạo bảng – mà là hiểu hậu quả lâu dài của mỗi quyết định.**  
> Hãy thiết kế **schema từ domain và quy tắc business**, rồi mới làm performance optimization – và luôn quan sát, đo lường dữ liệu để tinh chỉnh theo thực tế.