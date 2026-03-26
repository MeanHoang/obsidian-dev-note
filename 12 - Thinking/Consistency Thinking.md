# 🧠 Consistency Thinking là gì?
👉 **Consistency Thinking = luôn suy nghĩ dữ liệu có đồng nhất ở mọi nơi không, và khi nào thì đồng nhất**
Không chỉ hỏi:
“Data đúng chưa?”
Mà hỏi:
“Data có giống nhau ở tất cả các nơi không? và có đúng _ngay lập tức_ không?”
Nhưng mà tôi thấy việc để cho 1 hệ thống phân tán đi mà ép nó phải đúng cho mọi trường hợp là mình chỉ đang tạo nên 1 sản phẩm chậm chạp lề mề mà thôi. Chúng ta cần phải đánh đổi trải nghiệm của người dùng lấy tính chính xác của dữ liệu hay không . Nên hãy đặt các câu hỏi là 
- Ai cần thấy dữ liệu
- Cần thấy đúng trong bao lâu 
- Đúng ngay hay đúng sau vài giây là chấp nhận đc 

---
# ⚡ Ví dụ cực thực tế
## 🛒 Case: đặt hàng
### Flow:
```
User đặt hàng → trừ tồn kho → tạo order
```
### ❌ Không có Consistency Thinking:
- trừ tồn kho OK
- tạo order OK
👉 tưởng là xong
### 💀 Nhưng thực tế:
- tồn kho đã trừ
- order FAIL
👉 data **lệch nhau** → hệ thống sai
### ✅ Có Consistency Thinking:
Bạn sẽ nghĩ:
- 2 hành động này phải **atomic** (cùng thành công hoặc cùng fail)
---
# 🔥 Các loại consistency (cực quan trọng)
## 1. 🧱 Strong Consistency
👉 Ghi xong → đọc là thấy ngay. Dùng cho: Payment, Banking, Stock, Inventory
```
Write → Read = dữ liệu mới nhất
```
✔️ Dữ liệu luôn đúng  
❌ Chậm hơn, khó scale
## 2. 🌫️ Eventual Consistency
👉 Ghi xong → một lúc sau mới đồng bộ. Dùng cho: Facebook đăng bài, Shopee cập nhập sản phẩm.
```
Write → (delay) → Read thấy data mới
```
✔️ Scale tốt  
✔️ Nhanh hơn  
❌ Có thể đọc dữ liệu cũ
## ⚡ Ví dụ:
- Facebook đăng bài → người khác chưa thấy ngay
- Shopee update số lượng → có delay
👉 đều là eventual consistency
## ⚡ 3. Causal Consistency (nhân quả)
👉 Nếu A xảy ra trước B → thì mọi người sẽ thấy A trước B
### 📌 Ví dụ:
- Comment → Reply
👉 Không thể thấy reply trước comment
### 🧠 Insight:
- Giữ **logic đúng theo thứ tự nguyên nhân – kết quả**
- Không cần strict như strong consistency
## 👀 4. Read-your-writes Consistency
👉 User sẽ luôn thấy dữ liệu mà **chính họ vừa ghi**
### 📌 Ví dụ:
- Bạn đăng bài → reload → phải thấy bài của mình
👉 dù người khác chưa thấy cũng được
### 🧠 Rất hay dùng trong:
- social media
- dashboard user
## 🔁 5. Monotonic Read Consistency
👉 Nếu đã đọc version mới → không bao giờ đọc lại version cũ
### 📌 Ví dụ:
- bạn refresh trang
- không thể thấy data “lùi về quá khứ”
## 🧩 6. Monotonic Write Consistency
👉 Các write của 1 user phải theo đúng thứ tự
### 📌 Ví dụ:
- update profile:
    1. name = A
    2. name = B
👉 không thể bị đảo ngược
# 🔥 Tổng hợp nhanh (rất nên note)
```
Strong Consistency
→ luôn đúng, chậm

Eventual Consistency
→ nhanh, có delay

Causal Consistency
→ đúng theo quan hệ nhân quả

Read-your-writes
→ user thấy data của mình

Monotonic Read
→ không đọc lùi

Monotonic Write
→ write đúng thứ tự
```
![[Pasted image 20260326142934.png]]
=> Phân tách 1 hành động thành nhiều yêu cầu nhất quán khác nhau. Đó chính là tư duy senior

---
# 🧠 CAP Theorem (phải biết)
👉 Trong distributed system, bạn không thể có đủ 3:
- **C – Consistency (Nhất quán)**
👉 Tất cả các node đều thấy **cùng 1 dữ liệu tại cùng 1 thời điểm**
- **A – Availability (Sẵn sàng)**
👉 Hệ thống **luôn phản hồi request**, không bị treo
- **P – Partition Tolerance (Chịu lỗi phân vùng mạng)**
👉 Hệ thống vẫn hoạt động **khi các node bị mất kết nối với nhau**
👉 phải chọn:
```
CP hoặc AP chứ không thể cố chọn cả 3
```
## Ví dụ:
- Banking → ưu tiên **Consistency (CP)**
- Social media → ưu tiên **Availability (AP)**

---
# 🔥 Các tình huống gây inconsistency
### 1. 🧊 Cache
- DB đã update
- Cache chưa update
👉 user thấy data cũ
### 2. 📖 Read Replica
- write vào primary
- read từ replica (chưa sync)
### 3. 📨 Queue (async)
- job chưa xử lý xong
- data chưa cập nhật
### 4. 🌐 Distributed services
- service A update
- service B chưa biết
---
# ⚡ Cách xử lý consistency
## 1. 🔒 Transaction (ACID)
👉 trong 1 DB
```
All or nothing
```
## 2. 🔁 Retry + Idempotency
👉 tránh duplicate / mất dữ liệu
## 3. 📩 Event-driven (eventual consistency)
👉 publish event:
```
OrderCreated → InventoryService update
```
## 4. 🧠 Saga pattern (nâng cao)
👉 nếu fail → rollback từng bước

---
# 🔥 Insight cực đáng nhớ
👉 **System nhanh + scale tốt nhưng data sai = vô dụng**
![[Pasted image 20260326143211.png]]