 ## Chia depth thành 4 tầng (rất quan trọng)
#### 🔹 Tầng 1 – Dùng được (Usage)
- API
- Best practice
- Common pattern
👉 Cái này bạn **đã qua hoặc sắp qua**
---
#### 🔹 Tầng 2 – Bên trong hoạt động thế nào (Mechanism)
Hỏi:
- Nó làm gì **bên trong**?
- Luồng chạy ra sao?
- Tại sao nhanh / chậm?
Ví dụ:
- DB dùng index thế nào?
- Event loop chạy ra sao?
---
#### 🔹 Tầng 3 – Khi nào nó **fail** (Failure)
Hỏi:
- Khi nào nó chết?
- Bottleneck ở đâu?
- Case xấu nhất là gì?
👉 Đây là **điểm phân biệt dev thường và dev giỏi**
---
#### 🔹 Tầng 4 – Trade-off & giới hạn
Hỏi:
- Vì sao design như vậy?
- Đổi design khác được không?
- Đánh đổi là gì?
👉 Tầng này giúp bạn **lên SA sau này**