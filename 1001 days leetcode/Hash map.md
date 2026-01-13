## Hash Map là gì? (Giải thích từ gốc – dễ hiểu nhưng đi sâu)
**Hash Map** (còn gọi là **Hash Table**) là **cấu trúc dữ liệu** dùng để **lưu trữ cặp key–value** và cho phép:
- Thêm (insert)
- Tìm (lookup)
- Xóa (delete)
👉 Với **thời gian trung bình O(1)** – cực nhanh.
---
## 1️⃣ Tư duy cốt lõi của Hash Map
> “Cho tôi **key**, tôi trả về **value** ngay lập tức.”

Ví dụ:
```
"email" → "hoang@gmail.com"
"id"    → 123
```
Ta **không duyệt từng phần tử** như array, mà:
1. Biến `key` thành một **con số**
2. Dùng con số đó làm **vị trí lưu trong bộ nhớ**
Đó là lý do nó nhanh.
---
## 2️⃣ Hash Function – trái tim của Hash Map

### Hash function là gì?

Là hàm:
```scss
hash(key) → index
```
Ví dụ đơn giản 
```js
hash("abc") = 963 % 10 = 3
```
👉 `"abc"` sẽ được lưu ở **bucket số 3**
### Yêu cầu của hash function tốt:
- **Deterministic**: cùng key → cùng index
- **Phân bố đều**
- **Nhanh**
## 3️⃣ Bucket & Cấu trúc bên trong

Hash Map thực chất là:
```
Array (bucket)
```
Ví dụ:
```
Index:  0   1   2   3         []  []  []  []
```
Sau khi thêm:
```
Index 3 → [("abc", 10), ("cab", 99)]
```
## 4️⃣ Collision (đụng độ) – vấn đề bắt buộc
### Collision là gì?
Khi:
```
hash(key1) === hash(key2)
```
➡️ 2 key cùng 1 index
### Cách xử lý collision
#### 🔹 1. Chaining (phổ biến)
Mỗi bucket là:
- Linked List
- Array
```
bucket[3] = [
  ("abc", 10),
  ("cab", 99)
]
```
➡️ Lookup: O(k) (k nhỏ)
#### 🔹 2. Open Addressing
Nếu bị trùng → tìm slot khác
- Linear probing
- Quadratic probing   
- Double hashing
## 5️⃣ Vì sao Hash Map có thể O(1)?

|Trường hợp|Độ phức tạp|
|---|---|
|Trung bình|**O(1)**|
|Tệ nhất (collision nhiều)|O(n)|

👉 Nếu hash function tốt & resize hợp lý → gần như luôn O(1)
## 6️⃣ Resize & Load Factor

### Load factor:
