# 00 — Tổng hợp: Caching

> Phần 7 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Caching** (Server Side: Redis, Memcached · Client Side: HTTP Caching).
>
> **Nguồn chính thống:** RFC 9111 (HTTP Caching) · luận án Fielding · redis.io/docs · docs.memcached.org
>
> **Cách trình bày:** 📖 trích nguyên văn → 🇻🇳 dịch → 💡 ví dụ đời sống.

---

## Mục lục — 7 note, 4.903 dòng, 298 khối trích dẫn

| # | Bài | Nguồn gốc | Dòng |
|---|---|---|---|
| 01 | [[01 - Caching là gì]] | RFC 9111 + **Fielding §5.1.4** | 529 |
| 02 | [[02 - HTTP Caching]] ⭐⭐ | **RFC 9111** + 5861 + 8246 | 968 |
| 03 | [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] ⭐ | redis.io/docs | 1076 |
| 04 | [[04 - Redis - Expiration, Eviction và Persistence]] ⭐ | redis.io/docs | 802 |
| 05 | [[05 - Memcached]] | docs.memcached.org + repo | 700 |
| 06 | [[06 - Chiến lược cache và so sánh Redis vs Memcached]] | tổng hợp | 828 |

---

## Bản đồ khái niệm

```
CACHE = bản sao dữ liệu đặt gần hơn / rẻ hơn / khỏi tính lại

   └── là 1 trong 6 RÀNG BUỘC KIẾN TRÚC của REST  ◄── [[02 - REST]]
       và Fielding nói thẳng cái giá: giảm độ tin cậy của dữ liệu

TẦNG CLIENT / PROXY / CDN ──► HTTP CACHING (RFC 9111)              (02)
   ├── private cache vs shared cache
   ├── FRESHNESS   : max-age · s-maxage · Expires · Age · heuristic
   ├── VALIDATION  : ETag · Last-Modified · If-None-Match ─► 304
   ├── Cache-Control: 7 request directive · 10 response directive
   │                  ⚠️ no-cache ≠ no-store
   ├── Vary        : thiếu nó = phục vụ nhầm nội dung người khác
   └── stale-while-revalidate · stale-if-error (RFC 5861) · immutable (8246)

TẦNG APPLICATION ──► CACHE SERVER
   ├── REDIS      in-memory DATA STRUCTURE store                   (03, 04)
   │   ├── 9+ kiểu: String List Set Hash SortedSet Stream ...
   │   ├── TTL: EXPIRE/TTL · lazy + active expiration
   │   ├── maxmemory + 10 eviction policy (LRU/LFU là XẤP XỈ)
   │   └── persistence: RDB (snapshot) · AOF (append-only)
   └── MEMCACHED  key-value thuần, tối giản có chủ đích            (05)
       ├── value là blob, không có kiểu dữ liệu
       ├── slab allocator · LRU phân đoạn HOT/WARM/COLD
       └── server KHÔNG biết nhau — client quyết định chia key

CHIẾN LƯỢC (thuật ngữ ngành, KHÔNG có spec)                        (06)
   cache-aside · read-through · write-through · write-behind · refresh-ahead
   vấn đề: stampede · penetration · avalanche · stale data
```

---

## 12 điều cần nhớ

1. **Cache là ràng buộc kiến trúc của REST**, không phải mẹo tối ưu gắn thêm. Fielding cũng nói rõ cái giá của nó. ([[01 - Caching là gì]])
2. **`no-cache` KHÔNG có nghĩa là không lưu.** Nó nghĩa là "lưu được, nhưng phải validate trước khi dùng". Không lưu là `no-store`. ([[02 - HTTP Caching]])
3. **Freshness vs validation là hai cơ chế khác nhau**: một cái xem hạn dùng, một cái hỏi lại server.
4. **Thiếu `Vary` = phục vụ nội dung của người này cho người khác.** Nguy hiểm nhất khi response phụ thuộc `Cookie` hay `Authorization`.
5. **`stale-while-revalidate` là cách chuẩn hoá để giảm cache stampede** — có spec thật (RFC 5861), khác với các "chiến lược" truyền miệng.
6. **Redis là data structure store, không chỉ là key-value cache.** Đây là khác biệt lớn nhất với Memcached. ([[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]])
7. **Key hết hạn không biến mất ngay** — Redis dùng lazy + active expiration. ([[04 - Redis - Expiration, Eviction và Persistence]])
8. **LRU của Redis là xấp xỉ, không chính xác** — nó lấy mẫu chứ không duyệt toàn bộ.
9. ⚠️ **Policy `volatile-*` hành xử như `noeviction` nếu không key nào có TTL** — triệu chứng: đọc vẫn chạy, ghi thì lỗi.
10. **Memcached server không biết nhau** — client quyết định key nào đi server nào. Khác hẳn mô hình cluster của Redis. ([[05 - Memcached]])
11. **Cache KHÔNG sửa được N+1.** Vẫn N lần round-trip, chỉ đổi đích đến từ DB sang cache. ([[07 - N+1 Problem]])
12. **Cache không thay thế index.** Miss cache là vẫn phải xuống DB, và lúc đó query chậm vẫn chậm. ([[04 - Indexes]])

---

## Những chỗ nguồn gốc KHÔNG nói — đã đánh dấu trong bài

Phần này có **tỉ lệ nội dung không trích dẫn được cao nhất** trong cả series. Caching là lĩnh vực nhiều kiến thức truyền miệng.

- **Toàn bộ 5 "chiến lược cache"** (cache-aside, read-through, write-through, write-behind, refresh-ahead) là **thuật ngữ ngành, không có spec chuẩn nào định nghĩa**. Bài 06 tách hẳn thành section riêng, không gắn nhãn trích dẫn.
- **Cache stampede, cache penetration, cache avalanche** — tương tự. Riêng vấn đề stampede thì mô tả trích được từ docs Memcached; cách giải bằng `stale-while-revalidate` thì có RFC 5861.
- **RFC 9111 không định nghĩa "cache hit" lẫn "cache entry"** — RFC dùng "stored response". Hai cụm này gắn nhãn thuật ngữ ngành.
- **Kích thước value tối đa của Memcached**: docs **không** có câu khẳng định trực tiếp. Con số 1 MB mà ai cũng "nhớ" chỉ suy ra được từ output mẫu `stats settings` — đã ghi rõ là suy luận và dặn tự chạy lệnh kiểm tra.
- **Memcached docs không nêu tên "consistent hashing"** — chỉ nói "client-based hashing algorithm". Tên thuật toán gắn nhãn thuật ngữ ngành.
- **Không tuyệt đối hoá "Memcached không có persistence"** — FAQ nêu hai ngoại lệ có điều kiện (extstore, warm restart).
- **Hiệu năng của Redis và Memcached**: bảng so sánh **để trống cả hai ô** — không bịa ops/giây hay latency. Trong cả phần không có một con số benchmark nào.
- **"Cache thuần có cần persistence không"**: docs Redis chỉ có đúng một câu liên quan; phần suy luận được bọc callout ghi rõ là nhận định.

### Nguồn đã thay đổi so với dự kiến

- **Wiki GitHub của Memcached đã bị rút ruột** — các trang chỉ còn một dòng trỏ sang `docs.memcached.org`; trang `NewLRU` 404. Agent chuyển sang docs mới và lấy `doc/new_lru.txt` từ repo gốc để có phần LRU phân đoạn.
- **Ba URL redis.io mình đưa đã đổi**: hyperloglogs → `/data-types/probabilistic/`, bitmaps → `/data-types/strings/bitmaps/`, keyspace → `/develop/using-commands/keyspace/`.
- **Redis hiện có 10 eviction policy, không phải 8** — bản 8.6 thêm `allkeys-lrm` và `volatile-lrm` (Least Recently Modified).

---

## Chưa học (nằm ở phần sau của roadmap)

- **CDN** — roadmap backend không có node riêng; thuộc chủ đề hạ tầng
- **Connection pooling** → liên quan `08 - Learn about Web Servers`
- **Rate limiting, throttling, backpressure** → `11 - Advanced Backend/11 - Building For Scale`
- **Redis làm message broker / pub-sub** → `11 - Advanced Backend/04 - Message Brokers`
- **Redis cluster, replication, sharding** → `11 - Advanced Backend/09 - Scaling Databases`

## Nguồn tham khảo
- RFC 9111 HTTP Caching: <https://www.rfc-editor.org/rfc/rfc9111.txt>
- RFC 5861 stale-while-revalidate: <https://www.rfc-editor.org/rfc/rfc5861.txt>
- RFC 8246 immutable: <https://www.rfc-editor.org/rfc/rfc8246.txt>
- Fielding dissertation §5.1.4 Cache: <https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm>
- Redis Documentation: <https://redis.io/docs/latest/>
- Memcached Documentation: <https://docs.memcached.org/>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
