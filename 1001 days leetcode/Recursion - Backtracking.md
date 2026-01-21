## 1️⃣ Recursion (Đệ quy) là gì?
**Recursion** là kỹ thuật lập trình trong đó **một hàm tự gọi lại chính nó** để giải quyết bài toán.
👉 Ý tưởng cốt lõi:
> **Bài toán lớn → chia thành các bài toán nhỏ hơn giống hệt nhau**
---
## 2️⃣ Ví dụ đời thực (rất quan trọng để hiểu)
### 📂 Tìm file trong thư mục
- Mở thư mục
- Với mỗi thư mục con → tiếp tục tìm bên trong
- Lặp lại cho đến khi **không còn thư mục con**
➡️ Đây chính là đệ quy
---
## 3️⃣ Cấu trúc BẮT BUỘC của Recursion

Một hàm đệ quy **luôn phải có 2 phần**:
### ① Base Case (điều kiện dừng)
- Khi nào thì **dừng gọi lại**
- ❗ Nếu không có → **vòng lặp vô hạn → stack overflow**
### ② Recursive Case (gọi lại chính nó)
- Hàm gọi lại chính nó với **bài toán nhỏ hơn**
---
## 4️⃣ Ví dụ đơn giản nhất: Tính giai thừa

### Công thức:
```
n! = n × (n-1)!
0! = 1
```
### Code JavaScript:
```js
function factorial(n) {
    // Base case
    if (n === 0) return 1;
    // Recursive case
    return n * factorial(n - 1);
}
```
## 5️⃣ Call Stack – thứ khiến đệ quy “khó hiểu”
Mỗi lần hàm gọi:
- JS **đẩy hàm vào stack**
- Khi gặp base case → **bắt đầu trả ngược kết quả**
## 6️⃣ ## Khi nào NÊN dùng Recursion?
✅ Bài toán có cấu trúc:
- Cây (Tree, DOM)
- Đồ thị (DFS)
- Chia để trị (Divide & Conquer)
- Backtracking
- Duyệt thư mục

❌ KHÔNG nên dùng khi:
- Vòng lặp đơn giản
- Performance quan trọng (JS recursion dễ overflow)
---

# 🔁 1️⃣ Backtracking là gì?
**Backtracking** là một **kỹ thuật thuật toán** dùng để:
> **Thử – sai – quay lui – thử tiếp**

Nó thường được xây dựng **trên nền Recursion**.
👉 Khi phát hiện **hướng đang đi không hợp lệ** → **quay lại (backtrack)** để thử hướng khác.

---
# 🧠 2️⃣ Ví dụ đời thực

### 🧩 Giải mê cung
- Đi thử 1 hướng
- Nếu **bị tường / ngõ cụt** → quay lại
- Thử hướng khác
➡️ Đó chính là Backtracking
---
# ⚙️ 3️⃣ Cấu trúc chuẩn của Backtracking

Backtracking luôn có **4 bước**
```
1. Chọn (Choose)
2. Kiểm tra hợp lệ (Constraint / Check)
3. Đi tiếp (Explore / Recurse)
4. Hoàn tác (Unchoose / Backtrack)
```
# 🧩 4️⃣ Template Backtracking (RẤT QUAN TRỌNG)
```js
function backtrack(state) {
    if (đạt_kết_quả) {
        lưu_kết_quả;
        return;
    }

    for (mỗi lựa chọn hợp lệ) {
        chọn;
        backtrack(state_mới);
        hoàn tác;
    }
}
```
📌 **Cốt lõi**: Sau khi quay về, trạng thái phải **GIỐNG Y HỆT ban đầu**
# 📌 5️⃣ Ví dụ : Sinh tất cả tập con (Subsets)

### Input: [1, 2]
### Output: [], [1], [1,2], [2]
### Code js 
```js
function subsets(nums) {
    const result = [];

    function backtrack(start, path) {
        result.push([...path]); // lưu kết quả

        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);      // choose
            backtrack(i + 1, path);  // explore
            path.pop();              // unchoose
        }
    }

    backtrack(0, []);
    return result;
}
```

# 🚨 8️⃣ Điểm khác giữa Recursion & Backtracking

|Recursion|Backtracking|
|---|---|
|Kỹ thuật gọi hàm|Kỹ thuật tìm nghiệm|
|Không cần hoàn tác|BẮT BUỘC hoàn tác|
|Ví dụ: factorial|Ví dụ: permutations|

👉 **Backtracking = Recursion + Undo**
# 🔥 9️⃣ Bài toán kinh điển dùng Backtracking

| Bài toán        | Ghi chú            |
| --------------- | ------------------ |
| Subsets         | Cơ bản             |
| Permutations    | Rất hay gặp        |
| Combination Sum | Có pruning         |
| N-Queens        | Khó                |
| Sudoku Solver   | Khó                |
| Word Search     | DFS + backtracking |
# ✂️ 1️⃣0️⃣ Pruning (Cắt nhánh)

Backtracking **rất chậm** nếu không cắt nhánh.
### Ví dụ:

`if (currentSum > target) return;`

➡️ Dừng sớm → không đi nhánh vô ích

---
# 🧠 1️⃣1️⃣ Tư duy giải Backtracking (CÔNG THỨC VÀNG)

> 1️⃣ Mỗi bước bạn đang **chọn cái gì?**  
> 2️⃣ Điều kiện nào **không hợp lệ?**  
> 3️⃣ Khi nào **đủ kết quả?**  
> 4️⃣ Sau khi quay lại, **phải trả trạng thái về đâu?**

---
# 📌 1️⃣2️⃣ Phân biệt nhanh các dạng bài

|Dạng|Đặc điểm|
|---|---|
|Subsets|Có / không chọn|
|Combination|Không quan tâm thứ tự|
|Permutation|Quan tâm thứ tự|
|Path|DFS|
