# 1️⃣ Bản chất của INDEX: DB KHÔNG “TÌM”, DB “ĐI THEO THỨ TỰ”
Điều đầu tiên cần phá vỡ:
❌ DB **không tìm** dữ liệu như con người  
 ✅ DB **chỉ biết đi tuần tự trên cấu trúc đã được sắp xếp**
 Index = **dữ liệu đã được SORT trước**
## 1.1 Index không phải hash map
Rất nhiều người tưởng index giống:
```
{ userId: [row1, row2] }
```
❌ Sai cho query range, sort, pagination.
Thực tế:
- SQL: **B+Tree**
- Firestore: **sorted key-value store (giống B-Tree logic)**
👉 Cốt lõi: **giữ thứ tự**
