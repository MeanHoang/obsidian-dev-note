# 🔹 Two Pointers là gì?
**Two Pointers** là kỹ thuật dùng **2 biến chỉ số (con trỏ)** để duyệt dữ liệu (thường là array hoặc string) **cùng lúc** nhằm giảm độ phức tạp.
Thay vì:
- 2 vòng `for` → `O(n²)`
Ta dùng:
- 1 vòng + 2 con trỏ → `O(n)`

# 🔹Vì sao Two Pointers hiệu quả?
### Cách duyệt truyền thống (brute force)
Ví dụ: tìm cặp phần tử thỏa điều kiện
```js
for (i)
  for (j)
```
⛔ O(n²) – rất chậm khi n lớn
### Two Pointers
- Duyệt **mỗi phần tử tối đa 1–2 lần**
- Tận dụng **tính chất dữ liệu** (đã sắp xếp, cửa sổ, thứ tự...)
👉 Độ phức tạp thường là **O(n)**

# 🔹 Các dạng Two Pointers phổ biến

### 1️⃣ Hai con trỏ từ **hai đầu** (Opposite direction)
```
L ---->.    <---- R
```
📌 Dùng khi:
- Array đã **sorted**
- Bài toán: tìm cặp, palindrome, tối ưu điều kiện
**Ví dụ**: kiểm tra palindrome
```c++
let l = 0, r = s.length - 1;
while (l < r) {
  if (s[l] !== s[r]) return false;
  l++; r--;
}
return true;
```
### 2️⃣ Hai con trỏ **cùng chiều** (Fast & Slow)
```
slow ->
fast ---->
```
📌 Dùng khi:
- Xóa phần tử
- Detect cycle
- Remove duplicates
**Ví dụ**: xóa phần tử trùng trong array sorted
```c++
let slow = 0;
for (let fast = 1; fast < nums.length; fast++) {
  if (nums[fast] !== nums[slow]) {
    slow++;
    nums[slow] = nums[fast];
  }
}
return slow + 1;
```
### 3️⃣ Sliding Window (biến thể của two pointers)
```
L ---- window ---- R
```
📌 Dùng khi:
- Subarray / substring
- Tổng, độ dài, điều kiện liên tục
**Ví dụ**: subarray sum
```c++
let l = 0, sum = 0;
for (let r = 0; r < nums.length; r++) {
  sum += nums[r];
  while (sum > k) {
    sum -= nums[l];
    l++;
  }
}
```