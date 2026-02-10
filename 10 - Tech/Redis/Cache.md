# 1. Cache là gì? (hiểu cho đã trước)
👉 **Cache = chỗ lưu tạm kết quả để lần sau lấy nhanh hơn**
Ví dụ đời thường:
- Bạn hỏi DB: “user id = 123 là ai?”
- DB phải:
    - đọc disk
    - join bảng
    - xử lý  
        → chậm ⏳

Nếu bạn:
- hỏi Redis trước
- nếu **có sẵn** → trả ngay
- nếu **chưa có** → hỏi DB rồi **nhét vào Redis**
➡️ Lần sau khỏi hỏi DB nữa.

---
# 2. Redis đóng vai trò gì trong cache?

Redis = **cái hộp RAM siêu nhanh** nằm giữa:
```js
Client
  ↓
Redis (cache)
  ↓ (nếu miss)
Database
```
👉 Redis **không thay DB**, chỉ giúp DB **đỡ mệt**.
# 4. Key trong Redis cache phải như thế nào?
👉 Quy tắc vàng:
```js
<entity>:<type>:<id>
```
Ví dụ app joy đang lưu dạng:
- Key format
```js
- joy:notifications:{shopId}:{event}
```
- Value lưu gì
- Lưu toàn bộ document notification lấy từ Firestore (sau prepareDoc), ví dụ kiểu:
```json
    {
      "id": "BJXgMUpBTVgyJwKinnsI",
      "shopId": "123",
      "event": "POINTS_EARNED",
      "title": "...",
      "status": true,
      "template": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
```
- Được JSON.stringify → gzip → base64 trước khi set vào Redis.
# 5. Cache TTL là linh hồn 🔥
### TTL = thời gian sống của cache
Ví dụ 
- NOTIFICATION_CACHE_TTL = 2592000 → 30 ngày cho mỗi key.
## Vì sao bắt buộc phải có TTL?
Nếu không:
- Data cũ ❌
- Memory đầy ❌
- Bug khó tìm ❌

👉 **Cache không TTL = bug tiềm ẩn**
# 6. Cache cái gì là hợp lý?

### ✅ NÊN cache:
- User info
- Config
- Permission
- API response
- Count / statistic
### ❌ KHÔNG nên cache:
- Data thay đổi liên tục (real-time)
- Data quá lớn
- Data critical (banking)
# 7. Redis cache thường lưu gì?
Ở cấp logic (trước khi nén):
- Giá trị gốc là object JS (ví dụ notification full doc).
- Được JSON.stringify → thành chuỗi JSON.
# 8. Cache Invalidation – phần NGUY HIỂM ⚠️
**Cache khó nhất không phải set – mà là xóa**
## 8.1 Khi nào phải xóa cache?
Khi data gốc thay đổi bắt buộc phải xoá cache
## 8.2 Chiến lược phổ biến
### Cách 1: Xóa cache khi update (recommended)
Lần sau request → cache lại.
### Cách 2: Chờ TTL (đơn giản nhưng chậm)
- Chấp nhận data cũ trong 1 thời gian ngắn

# 9. Cache Stampede (lỗi nhiều người dính)
### Vấn đề:
- Cache hết hạn
- 1000 request cùng lúc
- 1000 query DB 💥
## Cách xử lý (đơn giản):
### Dùng lock
```js
SET lock:user:123 1 NX EX 5
```
Chỉ 1 request được phép query DB.
# 10. Redis eviction – khi RAM đầy thì sao?
**Redis là in-memory DB** ⇒ RAM mà đầy thì **bắt buộc phải “đuổi” bớt dữ liệu** hoặc… **ghi thêm không được**. Cách Redis xử lý chuyện này gọi là **eviction**.
Redis không crash, nó **đá cache cũ ra**.
Policy phổ biến:
- `volatile-lru`
- `allkeys-lru` ⭐
👉 Redis tự xóa key ít dùng nhất.
# 11. Redis cache KHÔNG đảm bảo dữ liệu
👉 Redis có thể:
- restart
- mất cache
- flush **= dọn sạch dữ liệu** 🧹
⚠️ **Cache mất = hệ thống vẫn chạy được**
Nếu app chết khi Redis down → design sai.
