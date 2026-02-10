## 1️⃣ Sliding Window là gì?

**Sliding Window** là kỹ thuật dùng **một “cửa sổ” con liên tục** trên mảng / chuỗi, thay vì duyệt mọi subarray → giảm độ phức tạp từ **O(n²)** xuống **O(n)**.

Cửa sổ được xác định bởi 2 con trỏ:

- `left`
    
- `right`
    

---

## 2️⃣ Sliding Window “Dynamic” là gì?

👉 **Dynamic Sliding Window** = **kích thước cửa sổ KHÔNG cố định**

- Mở rộng `right` khi **chưa thỏa điều kiện**
    
- Thu hẹp `left` khi **đã thỏa điều kiện**
    

📌 Thường dùng khi đề bài có dạng:

- “**ít nhất**”
    
- “**nhiều nhất**”
    
- “**tối thiểu / tối đa**”
    
- “subarray / substring thỏa điều kiện”
    

---

## 3️⃣ Khung tư duy chuẩn (rất quan trọng) 🧠

```js
left = 0
for right in range(n):
    thêm nums[right] vào window

    while window thỏa điều kiện:
        cập nhật kết quả
        loại nums[left] khỏi window
        left++

```
🔁 **right mở rộng**  
🔁 **left co lại**

## 4️⃣ Khi nào dùng Dynamic Sliding Window? 🤔

|Dấu hiệu trong đề|Có dùng được không|
|---|---|
|Subarray liên tiếp|✅|
|Ít nhất / nhiều nhất|✅|
|Có điều kiện kiểm tra|✅|
|Không liên tiếp|❌|
|Hoán vị|❌|

---

## 5️⃣ So sánh nhanh

|Loại|Đặc điểm|
|---|---|
|Fixed Window|Kích thước cố định (k)|
|Dynamic Window|Kích thước thay đổi theo điều kiện|

---

## 6️⃣  Checklist tư duy khi gặp bài Sliding Window ✅

✔ Dữ liệu **liên tiếp**  
✔ Có điều kiện kiểm tra cửa sổ  
✔ Có thể cập nhật nhanh khi thêm/bớt phần tử