**Airtable** (Airtable) là một công cụ dạng **“database + spreadsheet” (bảng tính + cơ sở dữ liệu)** chạy trên cloud.
Hiểu đơn giản:  
👉 Nó giống **Excel / Google Sheets**, nhưng **mạnh hơn vì có cấu trúc database**.

---
## 🔹 Airtable dùng để làm gì?
Bạn có thể dùng Airtable để:
- Quản lý data (khách hàng, đơn hàng, task…)
- Làm CRM mini
- Quản lý project (giống Trello + database)
- Lưu trữ nội dung (content calendar)
- Backend nhẹ cho app (no-code / low-code)
---
## 🔹 Điểm khác Excel / Google Sheets

|Excel / Sheets|Airtable|
|---|---|
|Chỉ là bảng|Có quan hệ giữa bảng (relational)|
|Cell = text|Field có type (email, select, link record…)|
|Không có view nâng cao|Có Grid, Kanban, Calendar, Gallery|
|Không có API mạnh|Có API built-in|
## 🔹 Concept chính (rất quan trọng)

- **Base** = 1 database (giống 1 project)
    
- **Table** = bảng (giống sheet)
    
- **Record** = dòng (row)
    
- **Field** = cột (column)
    
- **View** = cách nhìn dữ liệu (filter/sort/display)
    

👉 Điểm mạnh nhất:  
**Link giữa các table (relational database)**

Ví dụ:

- Table Users ↔ Table Orders
    
- Bạn link user vào order → giống foreign key trong DB
    

---

## 🔹 Ví dụ thực tế

Bạn làm app Shopify:

- Table: Customers
    
- Table: Discounts
    
- Table: Logs
    

👉 Bạn có thể:

- Link customer ↔ discount
    
- Track ai dùng discount nào
    
- Filter nhanh, không cần viết query SQL
    

---

## 🔹 Khi nào nên dùng Airtable?

👉 Dùng khi:

- Không muốn setup DB phức tạp
    
- Làm tool nội bộ nhanh
    
- Prototype / MVP
    
- Non-tech team cần tự quản lý data
    

👉 Không nên dùng khi:

- Data cực lớn (hàng triệu records)
    
- Logic backend phức tạp
    
- Cần performance cao (thay bằng PostgreSQL, MongoDB…)
    

---

## 🔹 So sánh nhanh với Lark Base (bạn vừa hỏi trước đó)

|Airtable|Lark Base|
|---|---|
|Global, phổ biến|Phổ biến ở Trung Quốc / SEA|
|API mạnh|Tích hợp tốt với hệ sinh thái Lark|
|Nhiều template|UI đơn giản hơn|

---

## 🔹 Tóm gọn 1 câu

👉 **Airtable = Google Sheets + Database + API + UI no-code**

---

Nếu bạn đang build system (Shopify app / queue / CRM), mình có thể giúp bạn:

- Nên dùng Airtable hay Redis / DB thật
    
- Hoặc design schema luôn cho bạn 👍