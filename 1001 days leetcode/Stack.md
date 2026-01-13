# 1️⃣ Stack = tư duy “vào sau ra trước” (LIFO)
👉 **Last In – First Out**
Hình dung đời thực:
- Chồng đĩa
- Chồng sách
- Undo / Redo
📌 Bạn **chỉ thao tác ở trên cùng**  
📌 Không được rút ở giữa

---
# 2️⃣ Stack giải quyết bài toán gì?
Câu hỏi Stack trả lời rất giỏi:
> “Thứ gần nhất vừa xảy ra là gì?”

Ví dụ:
- Dấu ngoặc mở gần nhất
- Hàm được gọi gần nhất
- Phần tử chưa xử lý gần nhất
➡️ Stack = **ghi nhớ tạm thời theo thứ tự ngược**

---
# 3️⃣ Tư duy khác: Stack là “bộ nhớ tạm có kỷ luật”

Stack **không lưu lung tung**, mà có luật:
- Push → chỉ thêm trên đỉnh
- Pop → chỉ lấy trên đỉnh
👉 Vì vậy:
- Dễ quản lý
- Không bị rối trạng thái
---
# 4️⃣ Stack vs Array (rất dễ nhầm)

|Điểm|Array|Stack|
|---|---|---|
|Là gì|Cấu trúc dữ liệu|**Cách sử dụng dữ liệu**|
|Truy cập|Bất kỳ index|**Chỉ top**|
|Mục tiêu|Lưu trữ|**Kiểm soát thứ tự xử lý**|

👉 Stack **có thể được cài bằng array**