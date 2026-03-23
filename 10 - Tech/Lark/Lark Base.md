# Lark Base là gì?
**Lark Base** (hay còn gọi là **Bitable**) là:
👉 Một hệ **database dạng bảng + UI như spreadsheet (Excel/Airtable)**  
👉 Nhưng có thêm:
- API
- automation
- relation giữa bảng
💡 Hiểu đơn giản:
> **Lark Base = Airtable + Google Sheets + API backend**

---
# So sánh để dễ hiểu

| Concept | Lark Base | Backend truyền thống |
| ------- | --------- | -------------------- |
| Base    | Database  | Database             |
| Table   | Table     | Table                |
| Record  | Row       | Row                  |
| Field   | Column    | Column               |
| View    | Query UI  | Query + UI           |
👉 Nếu bạn làm dev:
- Base = 1 database
- Table = collection (Mongo) hoặc table (SQL)
- Record = document / row

## Lark API cần dùng
### 1. Lấy Access Token
```
POST https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal

Body:
{
  "app_id": "cli_a740c8272bb9d02f",
  "app_secret": "<secret>"
}

Response: { "tenant_access_token": "t-xxx", "expire": 7200 }
```

Token có hiệu lực 2 tiếng, cần refresh trước khi hết hạn.
### 2. Bitable (Base) API — Các endpoint cần dùng
**Tạo records (batch):**
```
POST /open-apis/bitable/v1/apps/{base_id}/tables/{table_id}/records/batch_create

Body: {
  "records": [
    { "fields": { "Customer Name": "John", "Email": "john@x.com", "Points": 100 } },
    ...
  ]
}
```
Max 500 records/lần.
**Cập nhật records (batch):**
```
POST /open-apis/bitable/v1/apps/{base_id}/tables/{table_id}/records/batch_update

Body: {
  "records": [
    { "record_id": "recXXX", "fields": { "Points": 200 } },
    ...
  ]
}
```
**Tìm records (để upsert — tìm trước rồi update hoặc create):**
```
POST /open-apis/bitable/v1/apps/{base_id}/tables/{table_id}/records/search

Body: {
  "filter": {
    "conjunction": "and",
    "conditions": [{ "field_name": "Email", "operator": "is", "value": ["john@x.com"] }]
  }
}
```
**Lấy danh sách fields (để biết cột nào đã có):**
```
GET /open-apis/bitable/v1/apps/{base_id}/tables/{table_id}/fields
```
### 3. Về trang Lark Base của khách
URL: `delistvn.sg.larksuite.com/wiki/...?table=********`
Đây là trang private, cần quyền truy cập. Nhưng từ URL ta đã có đủ **Base ID** và **Table ID** để gọi API.