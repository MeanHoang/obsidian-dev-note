### 1️⃣ Relational Database  
Relational Database (Cơ sở dữ liệu quan hệ) là loại hệ quản trị CSDL lưu dữ liệu dưới dạng **bảng (table)**.
Mỗi bảng gồm:
- **Rows (hàng)** → bản ghi (record)
- **Columns (cột)** → thuộc tính (field)
Ý tưởng chính:
- Dữ liệu nên được biểu diễn dưới dạng quan hệ (relation)
- Quan hệ được thể hiện bằng bảng
- Có thể thao tác dữ liệu bằng toán học tập hợp (Hợp - Union, Giao - Intersection, Hiệu - Difference)
Đây là lý do SQL hoạt động rất mạnh.
#### Các đặc điểm quan trọng
** 🔹 1. Sử dụng SQL**
SQL = Structured Query Language
Ex
```sql
SELECT * FROM users WHERE id = 1;
```
**🔹 2. ACID Transactions**
ACID gồm:
- **Atomicity** – Hoặc làm hết, hoặc không làm gì cả
- **Consistency** – Dữ liệu luôn đúng theo rule
- **Isolation** – Transaction không phá nhau
- **Durability** – Commit rồi là không mất
Ví dụ:  
Chuyển tiền ngân hàng phải đảm bảo trừ và cộng cùng lúc → không được lỗi giữa chừng.
**🔹 3. Data Integrity (Tính toàn vẹn dữ liệu)**
Thông qua:
- Primary Key
- Foreign Key
- UNIQUE
- ...
**🔹 4. Thiết lập quan hệ giữa bảng**
Các loại quan hệ:
- 1–1
- 1–N
- N–N (thông qua bảng trung gian)
**🔹 5. Multi-user & Scalability**
Các hệ quản trị (RDBMS) phổ biến:
- **MySQL**
- **PostgreSQL**
- **Oracle Database**
- **Microsoft SQL Server**
**Tại sao Web Developer bắt buộc phải hiểu Relational DB?**
Vì:
- 90% backend doanh nghiệp dùng RDBMS
- Hệ thống thương mại điện tử bạn đang làm → chắc chắn cần transaction
- Social network → quan hệ user – post – comment – like
Nếu không hiểu:
- Database sẽ thiết kế sai
- Query chậm
- Data inconsistency
- Scale không nổi

### 2️⃣ RDBMS – Benefits & Limitations
✅ I. Benefits (Ưu điểm)
1️⃣ Structured Data (Dữ liệu có cấu trúc)
- Lưu dưới dạng bảng (rows & columns)
- Dễ truy vấn bằng SQL
- Phù hợp hệ thống: e-commerce, banking, ERP
---
2️⃣ ACID Properties
Đảm bảo giao dịch an toàn:
- **Atomicity** → Hoặc làm hết, hoặc rollback
- **Consistency** → Dữ liệu luôn hợp lệ
- **Isolation** → Transaction không ảnh hưởng nhau
- **Durability** → Commit rồi là không mất
👉 Rất quan trọng với hệ thống chuyển tiền, thanh toán.
---
3️⃣ Normalization (Chuẩn hoá dữ liệu)
- Giảm trùng lặp dữ liệu
- Tăng tính nhất quán
- Thiết kế theo 1NF, 2NF, 3NF
---
 4️⃣ Scalability (Khả năng mở rộng)
- Có thể tăng RAM, CPU, storage
- Scale dọc (Vertical scaling) khá tốt
---
5️⃣ Data Integrity
Cơ chế đảm bảo dữ liệu đúng:

---
## 6️⃣ Security (Bảo mật)
- Phân quyền user
- Authentication
- Access control
- Encryption
---
### ❌ II. Limitations (Nhược điểm)
---
1️⃣ Complexity (Phức tạp)
- Setup & quản lý khó
- Cần kiến thức tối ưu query, index, tuning
- Database lớn → quản lý phức tạp
---
## 2️⃣ Cost (Chi phí)
- Một số hệ như **Oracle Database** hoặc **Microsoft SQL Server** rất đắt
- Tốn tài nguyên server
---
## 3️⃣ Fixed Schema (Schema cứng)

- Phải định nghĩa cấu trúc trước
    
- Thay đổi schema → phải migration
    
- Không linh hoạt bằng NoSQL
    

---

## 4️⃣ Không phù hợp dữ liệu phi cấu trúc

Không tối ưu cho:

- Video
    
- Ảnh lớn
    
- Social media feed dạng linh hoạt
    
- IoT sensor data
    

---

## 5️⃣ Khó scale ngang (Horizontal scaling)

- Thêm nhiều server phức tạp
    
- Sharding khó
    
- Không linh hoạt bằng NoSQL