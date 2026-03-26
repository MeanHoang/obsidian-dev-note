## 🧠 Scaling Thinking là gì?
👉 **Scaling Thinking = luôn suy nghĩ hệ thống sẽ hoạt động thế nào khi số lượng user / data tăng lên**
Không chỉ hỏi:
 “Chạy được chưa?”
Mà hỏi:
 “Nếu 10 user → 10,000 user thì có sập không?”
  ![[Pasted image 20260326135438.png]]

---
## ⚡ Ví dụ dễ hiểu
### API hiện tại:
100 requests / phút → OK
### ❌ Không có Scaling Thinking:
- “Chạy mượt rồi, deploy thôi”
---
### ✅ Có Scaling Thinking:
Bạn sẽ hỏi:
- 1,000 req/min thì sao?
- 10,000 req/min thì sao?
- DB chịu nổi không?
- server có bị quá tải không?
---
# 🧠 Scale Read vs Scale Write là gì?
## 1. 📖 Scale Read (mở rộng đọc)
👉 Khi hệ thống có **nhiều request đọc (GET)**  
=> cần tăng khả năng đọc dữ liệu
### 💥 Vấn đề
```
1 DB → 10,000 request đọc  
=> DB bị quá tải
```
### ✅ Giải pháp: **Read Replica**
```
        → Replica 1 (read)
Client → Primary DB (write)
        → Replica 2 (read)
        → Replica 3 (read)
```
👉 Flow:
- **Write → Primary DB**
- **Read → Replica**
### ⚡ Ví dụ thực tế
- Facebook newsfeed
- Shopee xem sản phẩm
👉 99% là đọc → phải scale read
### ⚠️ Trade-off
- Replica có thể **delay (eventual consistency)**  
    👉 vừa write xong → read chưa thấy ngay
## 2. ✍️ Scale Write (mở rộng ghi)
👉 Khi hệ thống có **nhiều request ghi (POST, PUT, INSERT)**
### 💥 Vấn đề
```
1 DB → 10,000 write/s
=> DB choke 💀
```
👉 Khác với read:
- Write khó scale hơn rất nhiều
## 🔥 Cách scale write
### 1. 🧩 Sharding (quan trọng nhất)
👉 Chia data ra nhiều DB
```
UserID % 3  
  
DB1 → user 1,4,7  
DB2 → user 2,5,8  
DB3 → user 3,6,9
```
✔️ Giảm load mỗi DB  
❌ Phức tạp query (join, aggregation)
### 2. 📨 Queue (async write)
👉 Không ghi trực tiếp
```
Client → API → Queue → Worker → DB
```
✔️ Giảm peak load  
✔️ chống sập DB
👉 Ví dụ:
- gửi email
- log
- payment processing
### 3. 🧊 Batch write
👉 Gom nhiều write lại
```
1000 insert → 1 batch insert
```
✔️ giảm số lần query  
✔️ nhanh hơn nhiều
### 4. ⚡ NoSQL (trong vài case)
👉 Ví dụ:
- MongoDB
- Cassandra
✔️ scale write tốt hơn RDBMS  
❌ mất ACID (tuỳ hệ)

---
## 🔥 3 hướng scale chính
### 1. 📈 Vertical Scaling (scale up)
- Tăng CPU, RAM
👉 Ví dụ:
- từ 2GB → 8GB RAM
✔️ Dễ làm  
❌ Có giới hạn, tốn tiền

---
### 2. 📊 Horizontal Scaling (scale out)
- Thêm nhiều server
1 server → 10 servers => Người ta gọi này là Load Balancer chia việc cho nhiều con sever
✔️ Scale tốt  
❌ Phức tạp hơn (load balancing, sync data)

---
### 3. 🧠 Optimize architecture
- Cache (Redis)
- Queue (RabbitMQ, Kafka)
- CDN
- DB sharding
👉 Đây mới là “pro scaling”
![[Pasted image 20260326135531.png]]

---
## 🔥 Những bottleneck khi scale
Khi user tăng, các vấn đề sẽ lộ ra:
### 🗄️ Database
- single DB → quá tải
- cần:
    - read replica
    - sharding
### 🌐 API server
- CPU 100%
- memory leak
### 🔄 External services
- rate limit
- timeout
### 🧵 Concurrency

- race condition
- deadlock

---
## ⚡ Ví dụ thực tế (rất hay gặp)
### ❌ Code:
```js
await sendEmail(user)
```

👉 10,000 user = gửi 10,000 email sync  
=> 💀 server chết

---
### ✅ Scaling Thinking:
→ push vào queue (RabbitMQ)  
→ worker xử lý dần
👉 Hệ thống vẫn sống

---
## 🚀 Insight quan trọng (rất đáng nhớ)
👉 **System chạy được ≠ System scale được**
👉 Không có hệ thống nào tự nhiên scale. Tất cả phải được thiết kế để scale
