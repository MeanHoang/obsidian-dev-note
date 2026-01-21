Thuật toán **Boyer–Moore Majority Vote** dùng để **tìm phần tử xuất hiện nhiều hơn ⌊n/2⌋ lần** trong mảng (gọi là **majority element**).
Mình giải thích **từ bản chất → cách làm → code → khi nào dùng / không dùng** nhé.

---
## 1️⃣ Bài toán nó giải quyết là gì?
> Cho mảng `nums` có `n` phần tử  
> 👉 **Tìm phần tử xuất hiện nhiều hơn n/2 lần**  
> 👉 **Luôn đảm bảo là có tồn tại** (theo giả thiết của thuật toán)
 
Ví dụ:
`[2,2,1,1,1,2,2] → 2`

---
## 2️⃣ Ý tưởng cốt lõi (bản chất)

### 🔑 Tư duy “triệt tiêu cặp đôi”
- Nếu **một phần tử xuất hiện > n/2*
- Thì dù bạn **ghép cặp nó với các phần tử khác để triệt tiêu**
- 👉 Nó **vẫn còn sống sót cuối cùng**
📌 Coi như:
- 1 phần tử majority = +1
- 1 phần tử khác = −1
- Tổng cuối cùng **không thể về 0**
---
## 3️⃣ Cách hoạt động (intuition)
Duy trì:
- `candidate` → ứng viên majority
- `count` → số phiếu
### Luật:
1. Nếu `count == 0`  
    👉 đổi `candidate = nums[i]`
2. Nếu `nums[i] == candidate`  
    👉 `count++`
3. Ngược lại  
    👉 `count--`
---
## 4️⃣ Ví dụ chạy tay (rất quan trọng)

### Mảng:
```
[2,2,1,1,1,2,2]
```

| i   | nums[i] | candidate | count |
| --- | ------- | --------- | ----- |
| 0   | 2       | 2         | 1     |
| 1   | 2       | 2         | 2     |
| 2   | 1       | 2         | 1     |
| 3   | 1       | 2         | 0     |
| 4   | 1       | 1         | 1     |
| 5   | 2       | 1         | 0     |
| 6   | 2       | 2         | 1     |
➡️ **candidate cuối = 2**
## 5️⃣ Code JavaScript
```js
function majorityElement(nums) {
    let candidate = null;
    let count = 0;

    for (let num of nums) {
        if (count === 0) {
            candidate = num;
        }

        count += (num === candidate) ? 1 : -1;
    }

    return candidate;
}
```
⏱ **Time:** `O(n)`  
💾 **Space:** `O(1)`
## 6️⃣ Vì sao thuật toán này đúng?

### Lập luận đơn giản:
- Majority xuất hiện > n/2
- Các phần tử khác cộng lại < n/2
- Khi triệt tiêu:
    - Majority **không thể bị triệt tiêu hết**
- 👉 phần tử sống sót cuối cùng **bắt buộc là majority**
---

## 7️⃣ Khi nào KHÔNG dùng được?
⚠️ **Nếu đề KHÔNG đảm bảo tồn tại majority (> n/2)**  
→ Boyer–Moore **chỉ cho candidate**, không chắc đúng

📌 Cách xử lý:
- Chạy thêm **bước verify**
```js
function majorityElement(nums) {
    let candidate = null;
    let count = 0;

    for (let num of nums) {
        if (count === 0) candidate = num;
        count += (num === candidate) ? 1 : -1;
    }

    // verify
    let freq = 0;
    for (let num of nums) {
        if (num === candidate) freq++;
    }

    return freq > nums.length / 2 ? candidate : null;
}
```