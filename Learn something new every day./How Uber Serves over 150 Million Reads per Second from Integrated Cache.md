https://blog.bytebytego.com/p/how-uber-serves-over-150-million?ref=dailydev
# 1. Bối cảnh bài toán của Uber
Khi người dùng mở app Uber:
- xem lịch sử chuyến đi
- xem thông tin tài xế
- check giá
- tìm xe gần
→ tất cả đều là **read request**.
Ở quy mô Uber:
- hàng trăm triệu user
- hàng tỷ request mỗi ngày
Nếu **mỗi request đọc trực tiếp database** thì:
- DB sẽ **quá tải**
- latency tăng (latency là đỗ trễ)
- hệ thống không scale được
→ giải pháp: **Caching layer**.
# 2. Ý tưởng cơ bản: Cache
## Flow cơ bản
```
Application
     |
     v
   Cache (Redis)
     |
     v
 Database (MySQL)
```
### Khi có request:
1️⃣ Check cache (Redis)
- Nếu có → trả luôn (**cache hit**)

2️⃣ Nếu không có (**cache miss**)
- query database
- lưu vào cache
- trả kết quả
Redis trả dữ liệu **microseconds**  
MySQL thường **milliseconds**.
Uber đạt:
**>99.9% cache hit rate**
→ database gần như không bị load.
# 3. Kiến trúc hệ thống Uber (Docstore)
Uber có hệ thống storage gọi là **Docstore**.
Kiến trúc 3 layer:
```
Services (Uber services)
        |
        v
Query Engine  (stateless)
        |
        v
CacheFront (Redis cache logic)
        |
        v
Storage Engine (MySQL cluster)
```
### 3 thành phần chính
### 1️⃣ Query Engine
- nhận request từ services
- stateless
- điều phối request
### 2️⃣ CacheFront
- logic cache
- dùng **Redis**
### 3️⃣ Storage Engine
- nơi dữ liệu thực sự tồn tại
- **MySQL cluster**
# 4. Read Path (đường đọc dữ liệu)
Flow:
```
Client request
      |
      v
Query Engine
      |
      v
Check Redis
   |       |
hit       miss
 |          |
return    query MySQL
            |
            v
        update cache
            |
            v
          return
```
Một điểm rất hay:
Uber hỗ trợ **partial cache miss**
Ví dụ:
request 10 rows  
cache có 7 rows
→ chỉ query DB 3 rows còn thiếu.
# 5. Write Path – phần khó nhất của caching
Caching dễ với **read** nhưng **write** rất khó.
Vì khi update DB:DB changed Cache vẫn giữ dữ liệu cũ
→ gọi là **stale cache**.
Ví dụ:
- user update destination
- cache vẫn trả destination cũ
→ app bị lỗi logic.
# 6. Hai loại write query
Uber chia thành 2 loại:
### 1️⃣ Point Writes
```
UPDATE users
SET name = "John"
WHERE id = 123
```
→ biết **row nào bị thay đổi**
→ dễ invalidate cache.
### 2️⃣ Conditional Updates
Ví dụ:
```
UPDATE trips
SET status = completed
WHERE duration > 60
```
Vấn đề:
- trước khi query chạy
- **không biết row nào bị thay đổi**
→ không biết **invalidate cache nào**.
Đây là **core problem của Uber**.
# 7. Giải pháp ban đầu: CDC (Flux)
Uber dùng hệ thống:
**Flux** Nó dùng: **Change Data Capture**
Cách hoạt động:
```
MySQL write
   |
   v
binlog
   |
   v
Flux đọc log
   |
   v
invalidate Redis
```
### Vấn đề của CDC
CDC chạy **asynchronous**.Có delay:
```
write DB
read cache
```
→ có thể đọc **data cũ**.
Gọi là: **Read-your-own-writes violation**
Ví dụ:
```
update profile
read profile ngay
→ thấy data cũ
```
# 8. TTL – cách backup
Cache có TTL.
Ví dụ:
```
TTL = 5 minutes
```
Sau 5 phút cache bị xoá. Uber recommend:
**TTL mặc định: 5 phút**.
### Nhưng TTL có vấn đề lớn
Engineer thường nghĩ:
```
TTL = 5 minutes  
→ data stale tối đa 5 phút
```
Sai.
### Ví dụ cực nguy hiểm
Scenario:
1️⃣ data trong DB **1 năm trước**
2️⃣ hôm nay đọc lần đầu
→ cache lưu data **1 năm tuổi**
3️⃣ ngay sau đó update DB
4️⃣ invalidation fail
→ cache vẫn giữ **data 1 năm cũ**
và TTL = 1h
→ hệ thống trả:**data 1 năm cũ trong 1 giờ**
# 9. Ba nguyên nhân gây inconsistency
Uber phát hiện 3 nguồn lỗi chính:
### 1️⃣ Cache invalidation delay
Flux chậm.
→ read-your-own-writes.
### 2️⃣ Redis failure
Redis node lỗi.→ invalidation không chạy.
### 3️⃣ Replication lag
Cache miss → đọc từ **MySQL follower** nhưng follower chưa sync leader.
→ cache bị **stale data**.
# 10. Breakthrough của Uber
Uber redesign storage. Họ làm 2 thay đổi lớn.
## 1️⃣ Soft delete
Thay vì:
```
DELETE row
```
Họ dùng:
```
tombstone flag
```
→ mark deleted.
## 2️⃣ Monotonic timestamps
Mỗi transaction có:
```
unique timestamp (microseconds)
```
### Sau đó họ làm trick rất thông minh
Sau khi write -> system chạy query:
```
SELECT rows
WHERE timestamp = transaction_timestamp
```
→ biết **row nào bị update**.

# 11. Write Path mới
Flow:
```
Write request
     |
     v
Query Engine
     |
     v
Write MySQL
     |
     v
Get modified rows
     |
     v
Invalidate Redis
```
Cache invalidation có thể:
### synchronous
- strong consistency
- latency cao hơn
### asynchronous
- nhanh
- consistency yếu hơn
# 12. Triple Defense Strategy
Uber dùng **3 lớp bảo vệ cache consistency**
### 1️⃣ TTL: cache tự expire.
### 2️⃣ CDC (Flux): background invalidation.
### 3️⃣ Write-path invalidation
invalidate ngay khi write.
Ba layer này kết hợp → consistency tốt hơn rất nhiều.
# 13. Tool: Cache Inspector
Uber còn build tool: **Cache Inspector**
Nó:
- đọc binlog
- so sánh Redis vs DB
để đo:
- stale entries
- staleness duration.
# 14. Kết quả cuối cùng
Hệ thống đạt:
- **>150 million reads / second**
- **>99.9% cache hit rate**
- stale gần như **0**
# 15. Các tối ưu thêm
Uber còn thêm:
- adaptive timeouts
- negative caching
- pipelined reads
- circuit breakers
- connection rate limiting
- compression
- cache warming
# 16. Bài học system design cực quan trọng
Bài blog này dạy 5 bài học lớn:
### 1️⃣ Cache là bắt buộc ở scale lớn
**DB không thể handle billions request.**
### 2️⃣ Cache invalidation là vấn đề cực khó
Có câu nổi tiếng:
**“Two hard things in CS: cache invalidation and naming things.”**
### 3️⃣ TTL không giải quyết consistency
TTL chỉ **giới hạn thời gian tồn tại cache**,  
không giới hạn **độ cũ của data**.
### 4️⃣ CDC rất mạnh nhưng không đủ
Cần:
```
CDC + write invalidation + TTL
```
### 5️⃣ Observability cực quan trọng
Uber build tool riêng:
```
Cache Inspector
```
để đo staleness.
# 17. Nếu bạn học System Design
Bài này liên quan trực tiếp tới:
- **Redis caching**
- **Cache invalidation**
- **CDC**
- **Consistency models**
- **Read-your-own-writes**
- **Distributed systems**
Đây là **level FAANG system design**.
# 📚 Checklist gọn nhất (20 concept quan trọng)
Nếu chỉ học **20 thứ quan trọng nhất**, thì học:
### Database
- ACID
- Transactions
- Index
- Replication
- Sharding
### Database Internals
- Binlog
- CDC
- WAL
### Cache
- Cache hit / miss
- TTL
- Cache invalidation
- LRU
### Distributed Systems
- CAP theorem
- Eventual consistency
- Read-your-own-writes
### Architecture
- Load balancer
- Message queue
- Pub/Sub
- Microservices