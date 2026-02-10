# 1️⃣ Redis **client** là gì? (hiểu kiểu người thường)
👉 **Redis client = chương trình của bạn nói chuyện với Redis**
Ví dụ:
- Node.js dùng `ioredis`, `redis`
- Java dùng `Jedis`
```
App của bạn  ←→  Redis client  ←→  Redis Server
```
Client lo:
- mở kết nối TCP
- gửi command (`GET`, `SET`, `HSET`)
- nhận response
# 2️⃣ Redis **connection** là gì?

👉 **Connection = 1 đường dây TCP** nối client ↔ Redis
- Mỗi connection = 1 socket
- Redis **single-thread xử lý command**, nhưng **có thể có rất nhiều connection**
Ví dụ:
- App Node.js có 1 Redis client
- Redis client giữ 1 connection lâu dài
# 3️⃣ Connection lifecycle (vòng đời kết nối) là gì?

👉 Là **từ lúc mở kết nối → dùng → đóng kết nối**
Mình tách ra từng bước 👇
## 🔹 Bước 1: Khởi tạo client
```js
const redis = new Redis();
```
👉 Chuyện xảy ra:
- client chuẩn bị config
- **CHƯA chắc đã kết nối ngay**
## 🔹 Bước 2: Connect (mở kết nối)
```js
Client → TCP handshake → Redis
```
- Redis tạo 1 connection
- Gán client vào event loop
- Redis log:
```
  Accepted 127.0.0.1:51234
```
👉 Từ đây:
- connection **sống**
- có thể gửi command
## 🔹 Bước 3: Command lifecycle

Ví dụ:
```
await redis.get("user:1");
```
Luồng
```
client gửi GET user:1
Redis xử lý
Redis trả value
```
⚠️ Redis xử lý **từng command một**, rất nhanh (~µs)
## 🔹 Bước 4: Idle (rảnh)
- Connection **không gửi lệnh**
- Redis **giữ socket mở**
- Tốn rất ít RAM
👉 Redis KHÔNG tự đóng connection vì idle
## 🔹 Bước 5: Close / Disconnect
Xảy ra khi:
- App tắt
- Gọi `client.quit()` / `client.disconnect()`
- Network lỗi
- Timeout: cấu hình đc
```
redis.quit();
```
# 4️⃣ Một app có bao nhiêu Redis connection?
## Redis connection là gì?
- Redis dùng **TCP connection**
- Mỗi `connect()` = **1 socket mở**
- Redis **single-thread**, nhưng xử lý **nhiều connection**
❌ **Sai lầm phổ biến**
Mỗi request / mỗi service / mỗi function → mở 1 connection
✅ ĐÚNG:
**1 process → 1 Redis client → 1 connection**
Ví dụ:
- Node.js app
- 4 instance (PM2 / Docker)  
    👉 Redis có **4 connection**
# 5️⃣ Connection pooling có cần không?
👉 **Redis KHÔNG cần connection pool như MySQL**
Vì:
- Redis rất nhanh
- Single-thread
- Connection mở sẵn là tốt nhất
⚠️ Mở quá nhiều connection = **tốn RAM + context switch**

## Lifecycle nhìn tổng thể (tóm gọn)
```json
App start
  ↓
Create Redis client
  ↓
Open TCP connection
  ↓
Send commands (GET/SET)
  ↓
Idle (keep-alive)
  ↓
Close when app stops
```
