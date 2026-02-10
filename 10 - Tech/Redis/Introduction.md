# 1. Redis là gì?

**Redis (Remote Dictionary Server)** là:
- **In-memory data store** → dữ liệu nằm trong RAM
- Dạng **key–value**
- Rất **nhanh** (microseconds)
- Dùng làm:
    - Cache
    - Database
    - Message broker
    - Session store
    - Rate limiter
    - Queue / PubSub
👉 Redis không chỉ là cache, nó là **data structure server**.
---
# 2. Redis nhanh vì sao?
So với DB truyền thống:

|Thành phần|Redis|
|---|---|
|Lưu trữ|RAM|
|I/O|Hầu như không đụng disk|
|Protocol|TCP + RESP (rất nhẹ)|
|Data structure|Native (hash, list, set…)|

➡️ **O(1)** cho rất nhiều operation.

---
# 3. Redis dùng để làm gì? (Use cases)

## 3.1 Cache (phổ biến nhất)
```
Client → Redis → DB
```
- Cache API response
- Cache query nặng
- Cache config / feature flag
