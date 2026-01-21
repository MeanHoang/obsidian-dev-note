# Dùng Object làm Hash Table (cách cũ)
```js
let hash = {};

hash["a"] = 1;
hash["b"] = 2;

console.log(hash["a"]); // 1
```
### ❌ Nhược điểm của Object
1. **Key chỉ là string hoặc symbol**
```js
hash[1] === hash["1"]; // true (bị ép kiểu)
```
 2. Có **key mặc định** từ prototype:
 ```js
 "toString" in hash // true
 ```
 3. Không biết chính xác số phần tử:
 ```js
 Object.keys(hash).length // tốn thời gian
 ```
 4.  Không đảm bảo thứ tự key rõ ràng

➡️ Vì vậy ES6 sinh ra **Map** để thay thế tốt hơn.
# 3. Map là gì?

- `Map` là cấu trúc dữ liệu **key – value chuẩn ES6**
- Được thiết kế **chuyên để làm Hash Table**
```js
const map = new Map();
```
# 4. Ưu điểm của Map so với Object

|Tiêu chí|Object|Map|
|---|---|---|
|Kiểu key|string, symbol|**mọi kiểu**|
|Ép kiểu key|Có|❌ Không|
|Kích thước|Không có sẵn|`map.size`|
|Thứ tự|Không rõ|**Giữ thứ tự insert**|
|Hiệu năng|Trung bình|**Tốt hơn cho hash table**|
# 5. Cách dùng Map như Hash Table
```js
const hash = new Map();

// Them phan tu
hash.set("a", 1);
hash.set("b", 2);
hash.set(10, "number key");
// 👉 **Key không bị ép kiểu**
hash.set(1, "one");
hash.set("1", "string one");

// Lay gia tri
hash.get(1);   // "one"
hash.get("1"); // "string one"

// Kiem tra ton tai
hash.has("b"); // true
hash.has("c"); // false

// Xoa phan tu 
hash.delete("a");

// Xoa toan bo
hash.clear();

// Lay so phan tu
hash.size; // số lượng key-value
```

# 6. Duyệt Map (rất quan trọng)
```js
// Duyet bang for ... of
for (let [key, value] of hash) {
  console.log(key, value);
}

// Duyet key
for (let key of hash.keys()) {
  console.log(key);
}

// Duyet value
for (let value of hash.values()) {
  console.log(value);
}
```

# 7. Ví dụ Map làm Hash Table chuẩn

### Đếm số lần xuất hiện phần tử (hay gặp LeetCode)
```js
const nums = [1, 2, 2, 3, 1];
const freq = new Map();

for (let num of nums) {
  freq.set(num, (freq.get(num) || 0) + 1);
}

console.log(freq.get(1)); // 2
console.log(freq.get(2)); // 2
```
# 8. Khi nào nên dùng Map thay Object?

✅ **NÊN dùng Map khi:**
- Làm **Hash Table / Frequency Counter**
- Key **không phải string**
- Cần **hiệu năng tốt**
- Cần biết **size nhanh**
- Cần duyệt theo **thứ tự thêm**

❌ **Object chỉ nên dùng khi:**

- Làm **JSON**
- Lưu dữ liệu cấu hình
- Key chắc chắn là string
---

# 9. So sánh ngắn gọn để ghi nhớ
> **Hash Table trong JS = Map (chuẩn nhất)**  
> Object ≠ Hash Table chuẩn, chỉ là cách mô phỏng