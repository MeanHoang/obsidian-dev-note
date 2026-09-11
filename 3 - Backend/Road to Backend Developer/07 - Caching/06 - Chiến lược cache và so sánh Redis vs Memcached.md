# 06 — Chiến lược cache và so sánh Redis vs Memcached

> **Nguồn chính:**
> - Redis Docs — https://redis.io/docs/latest/develop/data-types/
> - Memcached Docs — https://docs.memcached.org/
> - RFC 9111 (HTTP Caching) — https://www.rfc-editor.org/rfc/rfc9111.txt
> - RFC 5861 (HTTP Cache-Control Extensions for Stale Content) — https://www.rfc-editor.org/rfc/rfc5861.txt
>
> Bài tổng kết phần 07: gom các chiến lược đọc/ghi cache, các sự cố kinh điển, và đối chiếu Redis với Memcached bằng chính tài liệu của hai bên.

---

> [!danger] ĐỌC TRƯỚC KHI ĐỌC TIẾP — ranh giới giữa "spec" và "truyền miệng"
> **Cache-aside, read-through, write-through, write-behind, refresh-ahead, cache stampede, cache penetration, cache avalanche là THUẬT NGỮ NGÀNH.**
> Không có RFC, không có W3C spec, cũng không có trang tài liệu chính thức nào của Redis hay Memcached định nghĩa chúng. Mỗi công ty / mỗi cuốn sách mô tả hơi khác nhau.
>
> Trong bài này:
> - Phần nào **trích được nguyên văn** từ tài liệu chính thức → có nhãn "Nguyên văn" (biểu tượng sách) kèm URL.
> - Phần nào **không trích được** → nằm trong section có tiêu đề ghi rõ *"thuật ngữ ngành"* hoặc *"nhận định"*, và **tuyệt đối không mang nhãn Nguyên văn**.
>
> Nếu bạn đi phỏng vấn và bị hỏi "định nghĩa chuẩn của write-behind là gì?" — câu trả lời trung thực là: *không có định nghĩa chuẩn*, chỉ có mô tả phổ biến.

---

# PHẦN A — Chiến lược đọc/ghi cache

> ⚠️ **Toàn bộ PHẦN A là thuật ngữ ngành, KHÔNG có spec chuẩn.**
> Các sơ đồ và bảng dưới đây là mô tả phổ biến trong ngành + nhận định của người viết note, không trích từ tài liệu chính thức nào.

Trước hết, thống nhất 3 vai:

```
┌──────────┐        ┌──────────┐        ┌──────────┐
│   App    │        │  Cache   │        │    DB    │
│ (client) │        │ (Redis/  │        │ (nguồn   │
│          │        │ Memcached│        │  sự thật)│
└──────────┘        └──────────┘        └──────────┘
```

Câu hỏi mà 5 chiến lược dưới đây trả lời chỉ có 2 cái:
1. **Ai chịu trách nhiệm nạp dữ liệu vào cache khi miss?** (app hay chính lớp cache)
2. **Khi ghi, ghi vào đâu trước và ghi xuống DB lúc nào?**

---

## A.1 — Cache-aside (lazy loading)

Phổ biến nhất. App tự quản lý cache; cache chỉ là một cái kho câm, không biết gì về DB.

**Luồng ĐỌC:**

```
   App                    Cache                   DB
    │                       │                      │
    │──(1) GET key ────────>│                      │
    │<─(2) MISS ────────────│                      │
    │                       │                      │
    │──(3) SELECT ─────────────────────────────────>│
    │<─(4) rows ────────────────────────────────────│
    │                       │                      │
    │──(5) SET key, TTL ───>│                      │
    │                       │                      │
    │  (lần sau)            │                      │
    │──(6) GET key ────────>│                      │
    │<─(7) HIT ─────────────│                      │
```

**Luồng GHI (biến thể phổ biến nhất):** ghi DB → **xoá** key khỏi cache (không ghi đè).

```
    │──(1) UPDATE ─────────────────────────────────>│
    │──(2) DEL key ────────>│                      │
```

> [!tip] Vì sao ghi xong thì `DEL` chứ không `SET`?
> Nếu `SET` giá trị mới vào cache, hai request ghi đồng thời có thể `SET` lệch thứ tự với thứ tự commit ở DB → cache giữ giá trị cũ vĩnh viễn. `DEL` thì lần đọc kế tiếp buộc phải xuống DB lấy sự thật.
> *(Nhận định, không trích từ tài liệu chính thức.)*

| | |
|---|---|
| **Ưu** | Đơn giản; cache chết thì app vẫn chạy (chỉ chậm); chỉ cache thứ thực sự được đọc → tiết kiệm RAM; không ràng buộc app vào một loại cache nào |
| **Nhược** | Logic cache rải rác khắp code; lần đọc đầu luôn chậm (cold start); dễ dính **cache stampede** (xem Phần B); dữ liệu có thể stale trong khoảng TTL |

---

## A.2 — Read-through

Giống cache-aside về mặt kết quả, khác ở **ai viết code nạp dữ liệu**. App chỉ nói chuyện với cache; lớp cache (hoặc một thư viện bọc quanh nó) tự xuống DB khi miss.

```
   App                 Cache layer                 DB
    │                       │                      │
    │──(1) get(key) ───────>│                      │
    │                       │─(2) MISS, tự load ──>│
    │                       │<─(3) rows ───────────│
    │                       │─(4) tự lưu lại       │
    │<─(5) value ───────────│                      │
```

| | |
|---|---|
| **Ưu** | Code ứng dụng sạch, chỉ còn `get(key)`; logic cache tập trung một chỗ, dễ thay đổi TTL/serialize đồng bộ |
| **Nhược** | Cần thư viện/lớp trung gian hỗ trợ; app bị buộc chặt vào lớp đó; khi cache layer lỗi, app không có đường vòng; vẫn chậm ở lần đọc đầu |

> [!note] Redis và Memcached **không** tự làm read-through
> Cả hai đều là key-value store thuần, không biết DB của bạn ở đâu. Read-through luôn do một lớp phần mềm bạn viết (hoặc thư viện bên thứ ba) đảm nhiệm. Xem lại [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] và [[05 - Memcached]].

---

## A.3 — Write-through

Mỗi lần ghi: ghi vào cache **và** ghi xuống DB, **đồng bộ**, trước khi trả về cho người gọi.

```
   App                   Cache                     DB
    │                       │                      │
    │──(1) write ──────────>│                      │
    │                       │──(2) write ─────────>│
    │                       │<─(3) OK ─────────────│
    │<─(4) OK ──────────────│                      │
         ▲
         └── chỉ trả về khi CẢ HAI đã xong
```

| | |
|---|---|
| **Ưu** | Cache gần như luôn đồng bộ với DB; đọc sau khi ghi chắc chắn hit; không mất dữ liệu nếu cache chết (DB đã có) |
| **Nhược** | Mỗi lần ghi tốn 2 lượt I/O → độ trễ ghi cao nhất trong 5 chiến lược; ghi cả những key sẽ chẳng ai đọc → lãng phí RAM (thường phải ghép với TTL) |

---

## A.4 — Write-behind / write-back

Ghi vào cache rồi trả về ngay. Việc đẩy xuống DB làm **bất đồng bộ** sau đó (theo lô, theo chu kỳ, hoặc qua queue).

```
   App                   Cache                     DB
    │                       │                      │
    │──(1) write ──────────>│                      │
    │<─(2) OK ──────────────│   (trả về ngay)      │
    │                       │                      │
    │                  ┌────┴────┐                 │
    │                  │ hàng đợi│                 │
    │                  └────┬────┘                 │
    │                       │─(3) flush theo lô ──>│
    │                          (sau X giây / N bản ghi)
```

> [!danger] Đây là chiến lược DUY NHẤT trong nhóm này có thể mất dữ liệu đã "ghi thành công"
> Giữa bước (2) và bước (3), dữ liệu chỉ tồn tại trong RAM của cache. Cache chết trong khoảng đó → mất trắng những bản ghi chưa flush, dù app đã báo "OK" cho người dùng.
> Muốn giảm rủi ro thì phải bật persistence của cache (với Redis là RDB/AOF — xem [[04 - Redis - Expiration, Eviction và Persistence]]), và ngay cả thế cũng chỉ là *giảm*, không phải *loại bỏ*.

| | |
|---|---|
| **Ưu** | Độ trễ ghi thấp nhất; gộp nhiều write thành 1 batch → giảm tải DB rất mạnh; chịu được burst ghi |
| **Nhược** | **Rủi ro mất dữ liệu**; phức tạp nhất (cần queue, retry, xử lý flush lỗi); DB tạm thời không phải nguồn sự thật mới nhất; báo cáo/job chạy thẳng trên DB sẽ thấy dữ liệu cũ |

---

## A.5 — Refresh-ahead

Cache chủ động làm mới một key **trước khi** nó hết hạn, dựa trên dự đoán key đó sắp được đọc lại.

```
     TTL = 60s
     ├──────────────────────────────────┬─────────┤
     0s                                50s       60s
                                        │
                                        └─ có request tới trong "vùng làm mới"
                                           → trả giá trị cũ NGAY cho người dùng
                                           → đồng thời nạp lại ngầm ở background
```

| | |
|---|---|
| **Ưu** | Người dùng gần như không bao giờ chờ vì miss; giảm mạnh cache stampede |
| **Nhược** | Có thể làm mới những key chẳng ai cần → tốn query DB vô ích; cần heuristic (key nào "nóng"?); phức tạp; người dùng trong vùng làm mới nhận dữ liệu hơi cũ |

> [!note] Refresh-ahead ở tầng HTTP thì lại **có spec**
> Ý tưởng "trả bản cũ ngay, làm mới ngầm" được chuẩn hoá cho HTTP dưới tên `stale-while-revalidate` trong RFC 5861 — trích nguyên văn ở Phần B.2 bên dưới, và xem [[02 - HTTP Caching]].

---

## A.6 — Bảng so sánh 5 chiến lược

> Bảng này là **nhận định tổng hợp**, không trích từ tài liệu chính thức. "Độ trễ ghi" là so sánh tương đối giữa các chiến lược, **không phải số đo**.

| Chiến lược | Độ trễ ghi | Rủi ro mất dữ liệu | Độ phức tạp | Khi nào dùng |
|---|---|---|---|---|
| **Cache-aside** | Trung bình (1 write DB + 1 DEL cache) | Không (DB là nguồn sự thật) | Thấp | Mặc định. Đọc nhiều hơn ghi, chấp nhận stale trong TTL |
| **Read-through** | — (chỉ nói về đọc) | Không | Trung bình | Muốn code app sạch, có sẵn thư viện cache layer |
| **Write-through** | Cao nhất (2 I/O đồng bộ) | Không | Trung bình | Ghi ít, đọc-ngay-sau-ghi nhiều, cần cache luôn nóng |
| **Write-behind** | Thấp nhất | **Có** — mất phần chưa flush | Cao nhất | Ghi rất nhiều, chịu được mất vài giây dữ liệu (đếm view, log hành vi) |
| **Refresh-ahead** | — (chỉ nói về đọc) | Không | Cao | Key "nóng" cố định, query DB đắt, không muốn user chờ |

💡 **Ví dụ đời sống — cache-aside vs write-through**

Hình dung **quán cà phê** (app), **tủ bánh trưng bày ở quầy** (cache), và **kho lạnh dưới bếp** (DB).

- **Cache-aside**: khách gọi bánh su. Nhân viên nhìn tủ trưng bày — *không có* (miss). Nhân viên chạy xuống kho lạnh lấy (đọc DB), đưa khách, rồi **tiện tay bày thêm mấy cái lên tủ** cho khách sau (SET cache). Khi bếp làm mẻ bánh su mới thay công thức, quản lý **vứt hết bánh su cũ trên tủ đi** (DEL key) — để lần sau có người gọi thì bắt buộc phải xuống kho lấy mẻ mới. Tủ trưng bày chỉ chứa thứ thực sự có người hỏi; tủ mà hỏng thì quán vẫn bán được, chỉ là chậm hơn vì lần nào cũng phải chạy xuống bếp.

- **Write-through**: bếp làm xong mẻ bánh mới thì **bắt buộc vừa cất kho lạnh vừa bày lên tủ ngay**, xong cả hai việc mới được coi là "làm xong mẻ bánh". Tủ trưng bày lúc nào cũng khớp với kho. Đổi lại, bếp mất công gấp đôi mỗi mẻ, và bày cả những loại bánh cả ngày chẳng ai gọi — chiếm chỗ tủ.

- **Write-behind** (cho đủ bộ): bếp làm xong bày thẳng lên tủ và **báo "xong"**, cuối ca mới gom sổ ghi vào kho. Nhanh nhất — nhưng mất điện giữa ca thì không ai biết ca đó đã làm những gì.

---

# PHẦN B — Các sự cố kinh điển và cách xử lý

> ⚠️ Tên gọi **cache stampede / thundering herd / cache penetration / cache avalanche** là **thuật ngữ ngành**, không có spec định nghĩa. Chỉ riêng `stale-while-revalidate` ở mục B.2 và phần invalidation ở mục B.5 là **có spec**, và sẽ được trích nguyên văn.

## B.1 — Cache stampede / thundering herd (thuật ngữ ngành)

**Hiện tượng:** một key nóng hết hạn. Trong khoảnh khắc đó có 5.000 request cùng `GET` key ấy → cả 5.000 đều MISS → cả 5.000 cùng chạy xuống DB chạy đúng một query giống hệt nhau.

```
             key "homepage" hết hạn tại đây
                        │
   request ──────┐      ▼
   request ──────┤   ┌─────┐        ┌────┐
   request ──────┼──>│MISS │───────>│ DB │  ← 5000 query giống hệt nhau
   request ──────┤   └─────┘        └────┘     trong cùng vài mili-giây
   request ──────┘                              ▼ DB sập
```

Nghịch lý: **cache càng hiệu quả thì cú sập càng đau**, vì DB đã quen với tải thấp và không còn được sizing cho tải thật.

**Ba cách giảm (nhận định tổng hợp, không trích từ tài liệu chính thức):**

1. **Lock / mutex khi miss** — request đầu tiên miss thì giành một "quyền nạp lại" (ví dụ `SET lock:key NX EX 10` trên Redis, xem [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]]). Chỉ nó được xuống DB; các request còn lại hoặc chờ ngắn rồi đọc lại cache, hoặc nhận bản cũ. Đánh đổi: phải xử lý lock chết (luôn đặt TTL cho lock), và request bị chờ.

2. **TTL lệch nhau (jitter)** — thay vì `TTL = 300`, dùng `TTL = 300 + random(0..60)`. Các key được ghi cùng lúc sẽ hết hạn rải ra thay vì cùng một giây. Rẻ nhất, hiệu quả bất ngờ, và cũng là thuốc cho **cache avalanche** ở mục B.4.

3. **Trả bản cũ, làm mới ngầm** — chính là refresh-ahead ở A.5. Ở tầng HTTP thì cái này **có chuẩn**: xem B.2.

## B.2 — `stale-while-revalidate`: cái duy nhất trong nhóm này CÓ SPEC

📖 **Nguyên văn** — RFC 5861 §3
> "When present in an HTTP response, the stale-while-revalidate Cache-Control extension indicates that caches MAY serve the response in which it appears after it becomes stale, up to the indicated number of seconds."
>
> "If a cached response is served stale due to the presence of this extension, the cache SHOULD attempt to revalidate it while still serving stale responses (i.e., without blocking)."

🇻🇳 **Dịch**
> "Khi xuất hiện trong một HTTP response, phần mở rộng `stale-while-revalidate` của `Cache-Control` cho biết rằng các cache **MAY** (được phép) phục vụ chính response đó kể cả sau khi nó đã trở nên stale, trong tối đa số giây được chỉ định."
>
> "Nếu một response đã cache được phục vụ ở trạng thái stale nhờ phần mở rộng này, cache **SHOULD** (nên) thử revalidate nó trong khi vẫn đang phục vụ các response stale (tức là không blocking)."

📖 **Nguyên văn** — RFC 5861 §3.1 (ví dụ trong chính spec)
> "A response containing:
>
>     Cache-Control: max-age=600, stale-while-revalidate=30
>
> indicates that it is fresh for 600 seconds, and it may continue to be served stale for up to an additional 30 seconds while an asynchronous validation is attempted. If validation is inconclusive, or if there is not traffic that triggers it, after 30 seconds the stale-while-revalidate function will cease to operate, and the cached response will be "truly" stale (i.e., the next request will block and be handled normally)."

🇻🇳 **Dịch**
> "Một response chứa:
>
>     Cache-Control: max-age=600, stale-while-revalidate=30
>
> cho biết nó fresh trong 600 giây, và nó có thể tiếp tục được phục vụ ở trạng thái stale thêm tối đa 30 giây nữa trong khi một lượt validation bất đồng bộ đang được thực hiện. Nếu validation không đi tới kết luận, hoặc nếu không có traffic nào kích hoạt nó, thì sau 30 giây chức năng `stale-while-revalidate` ngừng hoạt động, và response đã cache sẽ trở nên stale 'thực sự' (tức là request kế tiếp sẽ blocking và được xử lý bình thường)."

📖 **Nguyên văn** — RFC 5861 §3.1 (vì sao cửa sổ quá nhỏ thì vô dụng)
> "Since asynchronous validation will only happen if a request occurs after the response has become stale, but before the end of the stale-while-revalidate window, the size of that window and the likelihood of a request during it determines how likely it is that all requests will be served without delay. If the window is too small, or traffic is too sparse, some requests will fall outside of it, and block until the server can validate the cached response."

🇻🇳 **Dịch**
> "Vì validation bất đồng bộ chỉ xảy ra nếu có một request tới **sau** khi response đã stale nhưng **trước** khi kết thúc cửa sổ `stale-while-revalidate`, nên độ lớn của cửa sổ đó và xác suất có request rơi vào nó quyết định khả năng mọi request đều được phục vụ không phải chờ. Nếu cửa sổ quá nhỏ, hoặc traffic quá thưa, một số request sẽ rơi ra ngoài và bị blocking cho tới khi server validate được response đã cache."

> [!tip] Đây chính là refresh-ahead, nhưng có chuẩn
> Ở tầng application cache (Redis/Memcached) thì "trả bản cũ + làm mới ngầm" là pattern bạn tự viết. Ở tầng HTTP thì nó là một directive có RFC. Cùng ý tưởng, khác mức độ chính danh. Chi tiết `Cache-Control` xem [[02 - HTTP Caching]].

## B.3 — Cache penetration (thuật ngữ ngành)

**Hiện tượng:** kẻ tấn công (hoặc một bug) liên tục query những key **không tồn tại** — `GET /product/-99999`, `GET /user/aaaaaaa`. Cache không có (đúng, vì DB cũng không có) → miss → xuống DB → DB trả rỗng → không có gì để cache → request sau lại miss. Cache trở nên hoàn toàn vô dụng, mọi request xuyên thẳng xuống DB.

```
  request(key không tồn tại) ──> Cache: MISS ──> DB: không có
                                    ▲                 │
                                    └── không cache ──┘
                                        gì cả
                          → lần sau LẠI xuống DB. Mãi mãi.
```

**Cách xử lý (nhận định, không trích từ tài liệu chính thức):**
- **Cache cả kết quả rỗng** với TTL ngắn (ví dụ `SET user:aaaaaaa "__NULL__" EX 60`). Rẻ và hiệu quả ngay. Đánh đổi: nếu record đó *được tạo ra* trong 60 giây đó, người dùng vẫn thấy "không tồn tại" — nên TTL phải ngắn, và lúc tạo record phải chủ động `DEL` key rỗng.
- **Validate input trước khi xuống DB** — id âm, id sai định dạng UUID, slug quá dài thì chặn ngay ở tầng app.
- **Bloom filter** đặt trước cache để trả lời nhanh "key này chắc chắn không tồn tại". Phức tạp, chỉ đáng khi tập key lớn và ổn định.

## B.4 — Cache avalanche (thuật ngữ ngành)

**Hiện tượng:** khác stampede ở chỗ stampede là *một key nóng*, avalanche là *rất nhiều key cùng lúc*.

Hai kịch bản thường gặp:
1. Sau một lần deploy/warm-up, hàng loạt key được `SET` trong cùng một phút với **cùng một TTL** → 1 giờ sau chúng hết hạn gần như đồng thời.
2. Cache node bị restart / bị flush / bị mất → **toàn bộ** key biến mất một lúc.

```
   Bình thường:   DB tải  ▁▁▁▂▁▁▂▁▁▁
   Avalanche:     DB tải  ▁▁▁▁█████████  ← toàn bộ traffic đổ xuống DB
                          ↑ tất cả key hết hạn cùng một giây
```

**Cách xử lý (nhận định):**
- **TTL jitter** — thuốc chính. Không bao giờ đặt TTL cố định tuyệt đối cho một lô key lớn.
- **Phân tán cache ra nhiều node** để mất một node không mất toàn bộ key. Với Redis là Redis Cluster; với Memcached thì client hash sẵn ra nhiều server (xem Phần C).
- **Circuit breaker / rate limit ở tầng truy cập DB** — thà từ chối một phần request còn hơn để DB sập kéo sập cả hệ thống.
- **Warm-up sau restart** trước khi mở traffic vào.

## B.5 — Stale data và cache invalidation — phần CÓ spec (tầng HTTP)

Với application cache (Redis/Memcached), invalidation là việc bạn tự làm: ghi DB xong thì `DEL` key. Không có chuẩn nào quy định.

Với **HTTP cache** thì ngược lại — RFC 9111 quy định rất chặt:

📖 **Nguyên văn** — RFC 9111 §4.4 "Invalidating Stored Responses"
> "Because unsafe request methods (Section 9.2.1 of [HTTP]) such as PUT, POST, or DELETE have the potential for changing state on the origin server, intervening caches are required to invalidate stored responses to keep their contents up to date."
>
> "A cache MUST invalidate the target URI (Section 7.1 of [HTTP]) when it receives a non-error status code in response to an unsafe request method (including methods whose safety is unknown)."

🇻🇳 **Dịch**
> "Vì các request method không an toàn (unsafe) như PUT, POST hay DELETE có khả năng làm thay đổi trạng thái trên origin server, các cache nằm trên đường đi **bắt buộc** phải invalidate các response đã lưu để nội dung của chúng được cập nhật."
>
> "Một cache **MUST** (bắt buộc) invalidate target URI khi nó nhận được một status code không phải lỗi để đáp lại một unsafe request method (kể cả những method chưa rõ có an toàn hay không)."

📖 **Nguyên văn** — RFC 9111 §4.4, định nghĩa "invalidate"
> ""Invalidate" means that the cache will either remove all stored responses whose target URI matches the given URI or mark them as "invalid" and in need of a mandatory validation before they can be sent in response to a subsequent request."
>
> "A "non-error response" is one with a 2xx (Successful) or 3xx (Redirection) status code."

🇻🇳 **Dịch**
> "'Invalidate' nghĩa là cache sẽ hoặc xoá toàn bộ các response đã lưu có target URI khớp với URI đã cho, hoặc đánh dấu chúng là 'invalid' và cần được validate bắt buộc trước khi có thể được gửi đi để đáp lại một request sau đó."
>
> "Một 'non-error response' là response có status code 2xx (Successful) hoặc 3xx (Redirection)."

📖 **Nguyên văn** — RFC 9111 §4.4, giới hạn và lý do bảo mật
> "A cache MAY invalidate other URIs when it receives a non-error status code in response to an unsafe request method (including methods whose safety is unknown). In particular, the URI(s) in the Location and Content-Location response header fields (if present) are candidates for invalidation; other URIs might be discovered through mechanisms not specified in this document. However, a cache MUST NOT trigger an invalidation under these conditions if the origin (Section 4.3.1 of [HTTP]) of the URI to be invalidated differs from that of the target URI (Section 7.1 of [HTTP]). This helps prevent denial-of-service attacks."
>
> "Note that this does not guarantee that all appropriate responses are invalidated globally; a state-changing request would only invalidate responses in the caches it travels through."

🇻🇳 **Dịch**
> "Một cache **MAY** (được phép) invalidate các URI khác khi nó nhận được status code không phải lỗi đáp lại một unsafe request method (kể cả những method chưa rõ có an toàn hay không). Cụ thể, các URI trong header field `Location` và `Content-Location` của response (nếu có) là ứng viên để invalidate; các URI khác có thể được phát hiện qua những cơ chế không được quy định trong tài liệu này. Tuy nhiên, cache **MUST NOT** (tuyệt đối không được) kích hoạt invalidation trong các điều kiện này nếu origin của URI cần invalidate khác với origin của target URI. Điều này giúp ngăn các cuộc tấn công denial-of-service."
>
> "Lưu ý rằng điều này không đảm bảo mọi response liên quan đều được invalidate trên phạm vi toàn cầu; một request làm thay đổi trạng thái chỉ invalidate những response nằm trong các cache mà nó **đi ngang qua**."

> [!warning] Câu cuối là điểm đắt nhất của §4.4
> `POST /product/42` chỉ invalidate cache ở những proxy nằm **trên đường đi** của chính request đó. Cache ở CDN edge tại một châu lục khác, hay cache trong trình duyệt của người dùng khác, **không hề biết** dữ liệu đã đổi. Đây là lý do CDN nào cũng phải có API purge riêng — vì bản thân HTTP không có cơ chế đẩy invalidation ra toàn cầu.
> Xem thêm [[02 - HTTP Caching]] và [[01 - API là gì và nền tảng HTTP]].

## B.6 — Cache KHÔNG sửa được N+1

Đây là hiểu lầm phổ biến nhất khi người ta mới biết tới cache.

Nếu code đang chạy N+1 query xuống DB, mà bạn chỉ "bọc cache" quanh mỗi query con, thì bạn **vẫn còn N lần round-trip** — chỉ là N lần đó bắn tới Redis/Memcached thay vì tới Postgres. Nhanh hơn? Có. Sửa được N+1? Không. Số lần đi mạng không hề giảm.

Chính tài liệu của Memcached nói thẳng điều này:

📖 **Nguyên văn** — Memcached Docs, User Guide FAQ, "Can using memcached make my application slower?"
> "Yes, absolutely. If your DB queries are all fast, your website is fast, adding memcached might not make it faster.
>
> Also, this:"
>
>     my @post_ids = fetch_all_posts($thread_id);
>     my @post_entries = ();
>     for my $post_id (@post_ids) {
>         push(@post_entries, $memc->get($post_id));
>     }
>     # Yay I have all my post entries!
>
> "Instead of this anti-pattern, use pipelined gets instead. Fetching a single item from memcached still requires a network roundtrip and a little processing. The more you can fetch at once the better."

🇻🇳 **Dịch**
> "Có, chắc chắn có. Nếu các query DB của bạn đều nhanh, website của bạn nhanh, thì thêm memcached có thể không làm nó nhanh hơn.
>
> Và cả cái này nữa:"
>
> 🇻🇳 *(đoạn code Perl: lấy danh sách N post_id, rồi lặp N lần, mỗi lần gọi `get()` riêng lẻ xuống memcached — đúng hình dạng của N+1)*
>
> "Thay vì anti-pattern này, hãy dùng pipelined get. Lấy **một** item từ memcached vẫn tốn một lượt round-trip mạng và một chút xử lý. Càng lấy được nhiều thứ trong một lần thì càng tốt."

> [!warning] Cách duy nhất để sửa N+1 là **giảm số lần đi**, không phải làm mỗi lần đi nhanh hơn
> - Ở tầng DB: JOIN, `WHERE id IN (...)`, batch loading — xem [[07 - N+1 Problem]].
> - Ở tầng cache: multi-get (`MGET` với Redis, `get` nhiều key với Memcached), pipelining — đúng như đoạn trích trên khuyên.
>
> Nói cách khác: cache là cách **giảm tải cho DB**, không phải cách sửa một truy vấn sai hình dạng. Index sai vẫn sai, N+1 vẫn N+1. Xem thêm [[04 - Indexes]].

---

# PHẦN C — Redis vs Memcached

> **Quy tắc của bảng này:** mỗi ô hoặc truy được về một câu trích nguyên văn từ tài liệu chính thức **của chính sản phẩm đó** (đánh dấu `[R#]` / `[M#]`, trích đầy đủ ngay bên dưới bảng), hoặc để trống `—` kèm chú thích.
> Không có ô nào lấy từ blog, từ bài so sánh của bên thứ ba, hay từ trí nhớ.

| Tiêu chí | Redis | Memcached |
|---|---|---|
| **Mô hình dữ liệu** | "Redis is a data structure server." `[R1]` | "Simple Key/Value Store… It does not understand data structures; you must upload data that is pre-serialized." `[M1]` |
| **Kiểu dữ liệu hỗ trợ** | Strings, Bitmaps, Bitfields, Arrays, Geospatial indexes, Hashes, JSON, Lists, Probabilistic data types, Sets, Sorted sets, Streams, Time series, Vector sets `[R2]` | Không có kiểu dữ liệu. Item = key + expiration + flags + raw data `[M1]`; riêng `incr`/`decr` "may operate on the underlying data, but in a simple manner" `[M1]` |
| **Persistence** | RDB (snapshot), AOF (append-only log), không persistence, hoặc RDB+AOF `[R3]` | Chỉ trong một số tình huống, qua warm restart: "Yes, in some situations." `[M2]` — và "Memcached is an ephemeral data store" `[M2]` |
| **Replication** | Leader-follower (master-replica), mặc định bất đồng bộ `[R4]` | **Không có.** "It doesn't." `[M3]` |
| **Clustering / sharding** | Redis Cluster, 16384 hash slot, tự chia dataset ra nhiều node `[R5]` | Không có ở server. "Memcached servers are unaware of each other." `[M4]` |
| **Mô hình phân tán** | **Server-side** — node biết về nhau qua cluster bus và tự chia slot `[R5]` | **Client-side** — "A client-based hashing algorithm, which chooses a server based on the 'key'." `[M4]` |
| **Eviction policy** | `maxmemory-policy` với `noeviction`, `allkeys-lru`, `allkeys-lrm`, `allkeys-lfu`, `allkeys-random`, `volatile-lru`, `volatile-lrm`, `volatile-lfu`, `volatile-random`, `volatile-ttl` `[R6]` | LRU mặc định, không chọn policy: "Memcached is, by default, a Least Recently Used cache." `[M5]` |
| **Đa luồng** | "mostly, a single-threaded server from the POV of commands execution" `[R7]`; từ 4.0 có threaded actions giới hạn `[R7b]` | Đa luồng. "Threading is used to scale memcached across CPU's… By default 4 threads are allocated." `[M6]` |
| **Transaction** | `MULTI`, `EXEC`, `DISCARD`, `WATCH` — "executed as a single isolated operation" `[R8]` | **—** Tài liệu chính thức không có khái niệm transaction. Điều gần nhất được nói: "all commands are internally atomic" `[M7]` — đó là tính atomic của **từng lệnh**, không phải transaction nhiều lệnh. |
| **Pub/Sub** | `SUBSCRIBE`, `UNSUBSCRIBE`, `PUBLISH` `[R9]` | **—** Không kiểm chứng được từ tài liệu chính thức là có pub/sub. Tài liệu chỉ nói về việc **không** dùng memcached làm queue: "queue servers should either push to their workers, or notify their workers. If using memcached, they must constantly poll." `[M8]` |
| **Giới hạn key / thời gian sống** | "Redis can handle up to 2^32 keys… Every hash, list, set, and sorted set, can hold 2^32 elements." `[R10]` | Key ≤ 250 bytes; expiration tính bằng giây, `0` = không hết hạn, tối đa 30 ngày `[M9]` |
| **Hiệu năng (ops/giây, latency)** | **—** Không đưa vào bảng. Mọi con số benchmark phụ thuộc phần cứng, cấu hình, kích thước value và mô hình truy cập. Không so sánh được công bằng từ hai tài liệu độc lập. | **—** (như trên) |

### Các câu trích gốc cho bảng — phía Redis

📖 **Nguyên văn** `[R1]` `[R2]` — Redis Docs, "Redis data types" (https://redis.io/docs/latest/develop/data-types/)
> "Redis is a data structure server. At its core, Redis provides a collection of native data types that help you solve a wide variety of problems, from caching to queuing to event processing."
>
> "Redis Open Source implements the following data types:"
>
> - "Strings"
> - "Bitmaps"
> - "Bitfields"
> - "Arrays"
> - "Geospatial indexes"
> - "Hashes"
> - "JSON"
> - "Lists"
> - "Probabilistic data types"
> - "Sets"
> - "Sorted sets"
> - "Streams"
> - "Time series"
> - "Vector sets"

🇻🇳 **Dịch**
> "Redis là một data structure server. Ở lõi của nó, Redis cung cấp một tập hợp các kiểu dữ liệu native giúp bạn giải quyết rất nhiều loại bài toán, từ caching tới queuing tới xử lý event."
>
> "Redis Open Source hiện thực các kiểu dữ liệu sau:" — Strings, Bitmaps, Bitfields, Arrays, Geospatial indexes, Hashes, JSON, Lists, Probabilistic data types, Sets, Sorted sets, Streams, Time series, Vector sets.
>
> *(Danh sách này được chép đúng theo thứ tự trên trang tại thời điểm fetch; có thể thay đổi theo phiên bản — chi tiết từng kiểu xem [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]].)*

📖 **Nguyên văn** `[R3]` — Redis Docs, "Redis persistence" (https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
> "Persistence refers to the writing of data to durable storage, such as a solid-state disk (SSD). Redis provides a range of persistence options. These include:
>
> RDB (Redis Database): RDB persistence performs point-in-time snapshots of your dataset at specified intervals.
>
> AOF (Append Only File): AOF persistence logs every write operation received by the server. These operations can then be replayed again at server startup, reconstructing the original dataset. Commands are logged using the same format as the Redis protocol itself.
>
> No persistence: You can disable persistence completely. This is sometimes used when caching.
>
> RDB + AOF: You can also combine both AOF and RDB in the same instance."

🇻🇳 **Dịch**
> "Persistence là việc ghi dữ liệu xuống lưu trữ bền vững, chẳng hạn ổ SSD. Redis cung cấp một loạt lựa chọn persistence, gồm:
>
> **RDB (Redis Database):** persistence kiểu RDB tạo snapshot tại một thời điểm của dataset theo các khoảng thời gian được chỉ định.
>
> **AOF (Append Only File):** persistence kiểu AOF ghi log mọi thao tác ghi mà server nhận được. Các thao tác này sau đó có thể được replay lại lúc server khởi động, dựng lại dataset ban đầu. Lệnh được ghi log bằng đúng định dạng của chính Redis protocol.
>
> **No persistence:** bạn có thể tắt persistence hoàn toàn. Cách này đôi khi được dùng khi làm caching.
>
> **RDB + AOF:** bạn cũng có thể kết hợp cả AOF lẫn RDB trong cùng một instance."
>
> *(Chi tiết đánh đổi từng phương án ở [[04 - Redis - Expiration, Eviction và Persistence]].)*

📖 **Nguyên văn** `[R4]` — Redis Docs, "Redis replication" (https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
> "At the base of Redis replication (excluding the high availability features provided as an additional layer by Redis Cluster or Redis Sentinel) there is a leader follower (master-replica) replication that is simple to use and configure. It allows replica Redis instances to be exact copies of master instances."
>
> "Redis uses by default asynchronous replication, which being low latency and high performance, is the natural replication mode for the vast majority of Redis use cases."

🇻🇳 **Dịch**
> "Ở nền tảng của replication trong Redis (không tính các tính năng high availability được cung cấp như một lớp bổ sung bởi Redis Cluster hoặc Redis Sentinel) là kiểu replication leader-follower (master-replica), đơn giản để dùng và cấu hình. Nó cho phép các replica Redis instance là bản sao chính xác của master instance."
>
> "Redis mặc định dùng replication bất đồng bộ (asynchronous), vốn có độ trễ thấp và hiệu năng cao, là chế độ replication tự nhiên cho đại đa số các use case của Redis."

📖 **Nguyên văn** `[R5]` — Redis Docs, "Scale with Redis Cluster" (https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
> "Redis scales horizontally with a deployment topology called Redis Cluster."
>
> "Redis Cluster provides a way to run a Redis installation where data is automatically sharded across multiple Redis nodes."
>
> "There are 16384 hash slots in Redis Cluster… Every node in a Redis Cluster is responsible for a subset of the hash slots"
>
> "Every Redis Cluster node requires two open TCP connections: a Redis TCP port used to serve clients, e.g., 6379, and second port known as the cluster bus port."

🇻🇳 **Dịch**
> "Redis scale theo chiều ngang bằng một deployment topology tên là Redis Cluster."
>
> "Redis Cluster cung cấp cách chạy một cài đặt Redis trong đó dữ liệu được shard **tự động** ra nhiều Redis node."
>
> "Có 16384 hash slot trong Redis Cluster… Mỗi node trong một Redis Cluster chịu trách nhiệm cho một tập con các hash slot."
>
> "Mỗi node của Redis Cluster cần hai kết nối TCP mở: một Redis TCP port dùng để phục vụ client, ví dụ 6379, và một port thứ hai gọi là cluster bus port."
>
> *(Chính cái `cluster bus port` này là bằng chứng cho ô "phân tán server-side" trong bảng: các node **nói chuyện với nhau**.)*

📖 **Nguyên văn** `[R6]` — Redis Docs, "Key eviction" (https://redis.io/docs/latest/develop/reference/eviction/)
> "Use the maxmemory-policy configuration directive to select the eviction policy you want to use when the limit set by maxmemory is reached.
>
> The following policies are available:
>
> noeviction: Keys are not evicted but the server will return an error when you try to execute commands that cache new data…
>
> allkeys-lru: Evict the least recently used (LRU) keys.
>
> allkeys-lrm: Evict the least recently modified (LRM) keys.
>
> allkeys-lfu: Evict the least frequently used (LFU) keys.
>
> allkeys-random: Evict keys at random.
>
> volatile-lru: Evict the least recently used keys that have an associated expiration (TTL).
>
> volatile-lrm: Evict the least recently modified keys that have an associated expiration (TTL).
>
> volatile-lfu: Evict the least frequently used keys that have an associated expiration (TTL).
>
> volatile-random: Evicts random keys that have an associated expiration (TTL).
>
> volatile-ttl: Evict keys with an associated expiration (TTL) that have the shortest remaining TTL value.
>
> The volatile-xxx policies behave like noeviction if no keys have an associated expiration."

🇻🇳 **Dịch**
> "Dùng directive cấu hình `maxmemory-policy` để chọn eviction policy bạn muốn dùng khi chạm giới hạn đặt bởi `maxmemory`.
>
> Các policy sau đây có sẵn:
>
> `noeviction`: key không bị evict, nhưng server sẽ trả về lỗi khi bạn thử chạy các lệnh cache dữ liệu mới…
>
> `allkeys-lru`: evict các key ít được dùng gần đây nhất (LRU).
>
> `allkeys-lrm`: evict các key ít được sửa gần đây nhất (LRM).
>
> `allkeys-lfu`: evict các key ít được dùng thường xuyên nhất (LFU).
>
> `allkeys-random`: evict key ngẫu nhiên.
>
> `volatile-lru`: evict các key LRU **trong số các key có gắn expiration (TTL)**.
>
> `volatile-lrm`: evict các key LRM trong số các key có gắn expiration (TTL).
>
> `volatile-lfu`: evict các key LFU trong số các key có gắn expiration (TTL).
>
> `volatile-random`: evict ngẫu nhiên trong số các key có gắn expiration (TTL).
>
> `volatile-ttl`: evict các key có expiration (TTL) với TTL còn lại ngắn nhất.
>
> Các policy `volatile-xxx` hành xử như `noeviction` nếu không key nào có gắn expiration."

📖 **Nguyên văn** `[R7]` — Redis Docs, "Redis benchmark" (https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/)
> "Redis is, mostly, a single-threaded server from the POV of commands execution (actually modern versions of Redis use threads for different things). It is not designed to benefit from multiple CPU cores. People are supposed to launch several Redis instances to scale out on several cores if needed. It is not really fair to compare one single Redis instance to a multi-threaded data store."

🇻🇳 **Dịch**
> "Redis, phần lớn, là một server đơn luồng xét từ góc nhìn thực thi lệnh (thực ra các phiên bản Redis hiện đại có dùng thread cho một số việc khác). Nó không được thiết kế để hưởng lợi từ nhiều CPU core. Người dùng được kỳ vọng sẽ chạy nhiều Redis instance để scale out trên nhiều core nếu cần. Việc so sánh một Redis instance đơn với một data store đa luồng là không thực sự công bằng."

📖 **Nguyên văn** `[R7b]` `[R10]` — Redis Docs, "Redis FAQ" (https://redis.io/docs/latest/develop/get-started/faq/)
> "As of version 4.0, Redis has started implementing threaded actions. For now this is limited to deleting objects in the background and blocking commands implemented via Redis modules. For subsequent releases, the plan is to make Redis more and more threaded."
>
> "Redis can handle up to 2^32 keys, and was tested in practice to handle at least 250 million keys per instance.
>
> Every hash, list, set, and sorted set, can hold 2^32 elements.
>
> In other words your limit is likely the available memory in your system."

🇻🇳 **Dịch**
> "Kể từ phiên bản 4.0, Redis đã bắt đầu hiện thực các hành động chạy bằng thread. Hiện tại điều này giới hạn ở việc xoá object ở background và các blocking command được hiện thực qua Redis module. Với các bản phát hành sau, kế hoạch là làm cho Redis ngày càng đa luồng hơn."
>
> "Redis có thể xử lý tối đa 2^32 key, và trên thực tế đã được kiểm thử với ít nhất 250 triệu key mỗi instance.
>
> Mỗi hash, list, set và sorted set có thể chứa 2^32 phần tử.
>
> Nói cách khác, giới hạn của bạn nhiều khả năng chính là bộ nhớ khả dụng trên hệ thống."

📖 **Nguyên văn** `[R8]` — Redis Docs, "Transactions" (https://redis.io/docs/latest/develop/using-commands/transactions/)
> "Redis Transactions allow the execution of a group of commands in a single step, they are centered around the commands MULTI, EXEC, DISCARD and WATCH. Redis Transactions make two important guarantees:
>
> All the commands in a transaction are serialized and executed sequentially. A request sent by another client will never be served in the middle of the execution of a Redis Transaction. This guarantees that the commands are executed as a single isolated operation."

🇻🇳 **Dịch**
> "Redis Transaction cho phép thực thi một nhóm lệnh trong một bước duy nhất, xoay quanh các lệnh `MULTI`, `EXEC`, `DISCARD` và `WATCH`. Redis Transaction đưa ra hai bảo đảm quan trọng:
>
> Mọi lệnh trong một transaction đều được serialize và thực thi tuần tự. Một request gửi bởi client khác sẽ **không bao giờ** được phục vụ ở giữa quá trình thực thi của một Redis Transaction. Điều này bảo đảm các lệnh được thực thi như một thao tác đơn lẻ, cô lập."
>
> *(So sánh với ACID của database quan hệ ở [[05 - Transactions, ACID và MVCC]] — hai thứ này KHÔNG giống nhau, Redis Transaction không có rollback theo nghĩa của SQL.)*

📖 **Nguyên văn** `[R9]` — Redis Docs, "Redis Pub/Sub" (https://redis.io/docs/latest/develop/pubsub/)
> "SUBSCRIBE, UNSUBSCRIBE and PUBLISH implement the Publish/Subscribe messaging paradigm where (citing Wikipedia) senders (publishers) are not programmed to send their messages to specific receivers (subscribers). Rather, published messages are categorized into channels, without knowledge of what (if any) subscribers there may be. Subscribers express interest in one or more channels and only receive messages that are of interest, without knowledge of what (if any) publishers there are. This decoupling of publishers and subscribers allows for greater scalability and a more dynamic network topology."

🇻🇳 **Dịch**
> "`SUBSCRIBE`, `UNSUBSCRIBE` và `PUBLISH` hiện thực mô hình nhắn tin Publish/Subscribe, trong đó (trích Wikipedia) bên gửi (publisher) không được lập trình để gửi message tới những bên nhận cụ thể (subscriber). Thay vào đó, các message được publish sẽ được phân loại vào các channel, mà không cần biết có subscriber nào hay không. Subscriber bày tỏ quan tâm tới một hoặc nhiều channel và chỉ nhận những message mình quan tâm, mà không cần biết có publisher nào hay không. Việc tách rời publisher và subscriber này cho phép khả năng mở rộng tốt hơn và một network topology linh động hơn."

### Các câu trích gốc cho bảng — phía Memcached

📖 **Nguyên văn** `[M1]` `[M4]` `[M5]` — Memcached Docs, "Memcached Overview" (https://docs.memcached.org/)
> "Memcached is an in-memory key-value store for small arbitrary data (strings, objects) from results of database calls, API calls, or page rendering."
>
> "What is it Made Up Of?
> Client software, which is given a list of available memcached servers.
> A client-based hashing algorithm, which chooses a server based on the "key".
> Server software, which stores values with their keys into an internal hash table.
> LRU, which determine when to throw out old data (if out of memory), or reuse memory."
>
> "Simple Key/Value Store — The server does not care what your data looks like. Items are made up of a key, an expiration time, optional flags, and raw data. It does not understand data structures; you must upload data that is pre-serialized. Some commands (incr/decr) may operate on the underlying data, but in a simple manner."
>
> "Servers are Disconnected From Each Other — Memcached servers are unaware of each other. There is no crosstalk, no synchronization, no broadcasting, no replication. Adding servers increases the available memory. Cache invalidation is simplified, as clients delete or overwrite data on the server which owns it directly."
>
> "Forgetting is a Feature — Memcached is, by default, a Least Recently Used cache. Items expire after a specified amount of time."
>
> "Cache Invalidation — Rather than broadcasting changes to all available hosts, clients directly address the server holding the data to be invalidated."

🇻🇳 **Dịch**
> "Memcached là một key-value store trong bộ nhớ dành cho dữ liệu nhỏ tuỳ ý (string, object) đến từ kết quả của các lời gọi database, lời gọi API, hoặc render trang."
>
> "**Nó được tạo thành từ những gì?**
> Phần mềm client, được cấp một danh sách các memcached server khả dụng.
> Một thuật toán hashing **nằm ở client**, chọn server dựa trên 'key'.
> Phần mềm server, lưu các value cùng key của chúng vào một hash table nội bộ.
> LRU, quyết định khi nào vứt bỏ dữ liệu cũ (nếu hết bộ nhớ), hoặc tái sử dụng bộ nhớ."
>
> "**Key/Value store đơn giản** — Server không quan tâm dữ liệu của bạn trông ra sao. Một item gồm một key, một thời gian hết hạn, các flag tuỳ chọn, và dữ liệu thô. Nó **không hiểu các cấu trúc dữ liệu**; bạn phải upload dữ liệu đã được serialize sẵn. Một số lệnh (`incr`/`decr`) có thể thao tác lên dữ liệu bên dưới, nhưng theo cách đơn giản."
>
> "**Các server tách rời khỏi nhau** — Các memcached server không biết gì về nhau. Không có trao đổi chéo, không đồng bộ, không broadcast, không replication. Thêm server thì tăng bộ nhớ khả dụng. Cache invalidation được đơn giản hoá, vì client xoá hoặc ghi đè dữ liệu trực tiếp lên server sở hữu nó."
>
> "**Quên là một tính năng** — Memcached, theo mặc định, là một cache kiểu Least Recently Used. Các item hết hạn sau một khoảng thời gian được chỉ định."
>
> "**Cache Invalidation** — Thay vì broadcast thay đổi tới mọi host khả dụng, client đánh thẳng tới server đang giữ dữ liệu cần invalidate."

📖 **Nguyên văn** `[M2]` `[M3]` `[M7]` — Memcached Docs, User Guide FAQ (https://docs.memcached.org/userguide/faq/)
> "How do you handle replication? — It doesn't. Adding replication to the system halves your effective cache size. If you can't handle even a few percent extra cache misses, you have serious problems. Even with replication, things can break. More moving parts. Software to crash."
>
> "Can you persist cache between restarts? — Yes, in some situations. See the documentation on warm restart."
>
> "How do you handle failover? — You usually don't. Some clients have a "failover" option that will try the next server in the case of a failure."
>
> "Do clients and servers all need to talk to each other? — Nope. The less chatter, the more scalable the system."
>
> "Is memcached atomic? — Aside from any bugs you may come across, all commands are internally atomic. Issuing multiple sets at the same time has no ill effect, aside from the last one in being the one that sticks."
>
> "Why can't I use it as a database? — Memcached is an ephemeral data store. Meaning if the server goes down (crash, reboot, "cloud burps") then your data is gone."
>
> "Why Isn't curr_items Decreasing When Items Expire? — Expiration in memcached is lazy. In general, an item cannot be known to be expired until something looks at it."

🇻🇳 **Dịch**
> "**Xử lý replication thế nào?** — Nó không xử lý. Thêm replication vào hệ thống sẽ **giảm một nửa** kích thước cache hữu dụng của bạn. Nếu bạn không chịu nổi thêm vài phần trăm cache miss thì bạn đang có vấn đề nghiêm trọng. Kể cả có replication, mọi thứ vẫn có thể hỏng. Càng nhiều bộ phận chuyển động. Càng nhiều phần mềm để crash."
>
> "**Có giữ được cache qua các lần restart không?** — Có, trong một số tình huống. Xem tài liệu về warm restart."
>
> "**Xử lý failover thế nào?** — Thường là bạn không xử lý. Một số client có tuỳ chọn 'failover' sẽ thử server kế tiếp khi có lỗi."
>
> "**Client và server có cần nói chuyện với nhau hết không?** — Không. Càng ít tán gẫu, hệ thống càng dễ mở rộng."
>
> "**Memcached có atomic không?** — Ngoại trừ các bug bạn có thể gặp, mọi lệnh đều atomic ở bên trong. Phát nhiều lệnh `set` cùng lúc không gây hại gì, ngoài việc lệnh vào sau cùng là lệnh trụ lại."
>
> "**Vì sao không dùng nó làm database được?** — Memcached là một data store phù du (ephemeral). Nghĩa là nếu server chết (crash, reboot, 'cloud burps') thì dữ liệu của bạn biến mất."
>
> "**Vì sao `curr_items` không giảm khi item hết hạn?** — Expiration trong memcached là lazy. Nói chung, không thể biết một item đã hết hạn cho tới khi có thứ gì đó nhìn vào nó."
>
> *(Lưu ý câu `[M7]`: "all commands are internally atomic" nói về **từng lệnh**, đây KHÔNG phải transaction — vì vậy ô Transaction của Memcached trong bảng để `—`.)*

📖 **Nguyên văn** `[M6]` — Memcached Docs, Server Guide → Configuring (https://docs.memcached.org/serverguide/configuring/)
> "Threading is used to scale memcached across CPU's. The model is by "worker threads", meaning that each thread handles concurrent connections. Since using libevent allows good scalability with concurrent connections, each thread is able to handle many clients."
>
> "By default 4 threads are allocated. Unless you are running memcached extremely hard, you should not set this number to be any higher. Setting it to very large values (80+) will make it run considerably slower."
>
> "-m tells memcached how much RAM to use for item storage (in megabytes). Note carefully that this isn't a global memory limit, so memcached will use a little more memory than you tell it to."

🇻🇳 **Dịch**
> "Threading được dùng để scale memcached trên nhiều CPU. Mô hình là 'worker thread', nghĩa là mỗi thread xử lý các kết nối đồng thời. Vì dùng libevent cho khả năng mở rộng tốt với các kết nối đồng thời, mỗi thread có thể phục vụ nhiều client."
>
> "Mặc định 4 thread được cấp phát. Trừ khi bạn đang chạy memcached cực kỳ nặng, bạn **không nên** đặt con số này cao hơn. Đặt nó ở giá trị rất lớn (80+) sẽ làm nó chạy chậm đi đáng kể."
>
> "`-m` báo cho memcached biết dùng bao nhiêu RAM để lưu item (tính bằng megabyte). Lưu ý kỹ rằng đây **không phải** giới hạn bộ nhớ toàn cục, nên memcached sẽ dùng nhiều hơn con số bạn đưa ra một chút."

📖 **Nguyên văn** `[M8]` — Memcached Wiki, ProgrammingFAQ → "Why can't we use memcached as a queue server?" (https://github.com/memcached/memcached/wiki/ProgrammingFAQ)
> "To be succinct: queue servers should either push to their workers, or notify their workers. If using memcached, they must constantly poll. Scaling out beyond one server also ends up being silly. Workers poll all servers, and that doesn't mesh well with memcached clients, who want to resolve keys to a particular server."

🇻🇳 **Dịch**
> "Nói ngắn gọn: queue server nên hoặc **push** tới worker, hoặc **notify** worker. Nếu dùng memcached, chúng buộc phải poll liên tục. Việc scale ra nhiều hơn một server cũng trở nên vô lý. Worker phải poll tất cả các server, và điều đó không ăn khớp với memcached client, vốn muốn resolve key về một server cụ thể."

📖 **Nguyên văn** `[M9]` — Memcached Docs, Protocols → Basic Text Protocol (https://docs.memcached.org/protocols/basic/)
> "The "standard protocol stuff" of memcached involves running a command against an "item". An item consists of:
>
> A key (arbitrary string up to 250 bytes in length. No space or newlines for ASCII mode)
> A 32bit "flag" value
> An expiration time, in seconds. '0' means never expire. Can be up to 30 days. After 30 days, is treated as a unix timestamp of an exact date.
> A 64bit "CAS" value, which is kept unique.
> Arbitrary data"

🇻🇳 **Dịch**
> "'Phần protocol tiêu chuẩn' của memcached là việc chạy một lệnh lên một 'item'. Một item gồm:
>
> Một **key** (chuỗi tuỳ ý dài tối đa **250 bytes**. Không có dấu cách hay ký tự xuống dòng ở chế độ ASCII)
> Một giá trị **flag** 32 bit
> Một **thời gian hết hạn**, tính bằng giây. `'0'` nghĩa là không bao giờ hết hạn. Có thể lên tới **30 ngày**. Sau 30 ngày thì được hiểu là một unix timestamp của một ngày cụ thể.
> Một giá trị **CAS** 64 bit, được giữ duy nhất.
> Dữ liệu tuỳ ý."

---

## C.1 — "Chọn cái nào?" — NHẬN ĐỊNH, không phải trích dẫn

> [!warning] Phần này là ý kiến, không có nguồn
> Không có tài liệu chính thức nào của Redis hay Memcached khuyên bạn nên chọn cái nào. Dưới đây là suy luận **rút ra từ chính các câu trích ở trên**, không phải kết luận của nhà phát triển hai sản phẩm.

Lấy đúng những gì hai tài liệu tự nói, ta có thể suy ra:

**Nghiêng về Memcached khi:**
- Bài toán đúng là "cache thuần": lưu blob đã serialize, đọc bằng key, mất thì làm lại được. Tài liệu Memcached nói thẳng nó là "an ephemeral data store" `[M2]` — nếu bạn thấy điều đó là *chấp nhận được* chứ không phải *vấn đề*, đó là dấu hiệu đúng.
- Bạn muốn tận dụng nhiều CPU core trên **một** instance: Memcached đa luồng `[M6]`, Redis thì "mostly single-threaded" và tài liệu khuyên chạy nhiều instance để scale ra nhiều core `[R7]`.
- Bạn thích kiến trúc "server câm, client thông minh": server không biết nhau, không đồng bộ, không replication `[M4]` — ít bộ phận chuyển động hơn thì ít thứ hỏng hơn, đúng như lập luận của chính FAQ `[M3]`.

**Nghiêng về Redis khi:**
- Bạn cần **kiểu dữ liệu**, không chỉ blob: sorted set cho leaderboard, hash cho object có nhiều field, stream cho event log `[R1]` `[R2]`. Memcached nói rõ "It does not understand data structures" `[M1]` — muốn sửa một field trong object thì phải đọc cả blob, sửa, ghi lại cả blob.
- Bạn cần dữ liệu **sống sót qua restart** (RDB/AOF `[R3]`) hoặc cần **replica** để HA `[R4]`. Memcached trả lời thẳng "It doesn't" cho replication `[M3]`.
- Bạn cần thêm **pub/sub** `[R9]` hoặc **transaction nhiều lệnh** `[R8]` — hai thứ không kiểm chứng được ở phía Memcached.
- Bạn cần **eviction policy** chọn được, nhất là `volatile-*` để tách "dữ liệu có TTL được phép evict" khỏi "dữ liệu không TTL phải giữ" `[R6]`. Memcached chỉ có LRU mặc định `[M5]`.

**Điểm chung cần nhớ:** cả hai đều là in-memory key-value store, đều dùng LRU/eviction, đều **không** phải database. Nếu mất cache mà hệ thống của bạn sai kết quả (chứ không chỉ chậm), thì bạn đang dùng sai cả hai.

---

# PHẦN D — Khi KHÔNG nên cache

> [!warning] Toàn bộ PHẦN D là **nhận định**, không trích từ spec
> Ngoại lệ duy nhất: câu trích Memcached FAQ ở mục D.4 bên dưới, vốn là tài liệu chính thức.

## D.1 — Dữ liệu thay đổi liên tục

Nếu một giá trị đổi nhanh hơn TTL của nó, cache chỉ làm hai việc: tốn RAM và phát ra dữ liệu sai. Ví dụ: vị trí GPS của shipper đang giao hàng, số lượng tồn kho của flash sale đang chạy.

Cách nghĩ đơn giản: **tỉ lệ đọc / ghi**. Một key được ghi 10 lần rồi mới được đọc 1 lần thì cache là gánh nặng, không phải lợi ích.

## D.2 — Dữ liệu cá nhân nhạy cảm

> [!danger] Cache dùng chung + dữ liệu cá nhân = rò rỉ
> Rủi ro thực sự không phải "cache chậm" mà là **trả dữ liệu của người này cho người khác**:
> - Cache key quên mất `user_id` → hai user cùng đường dẫn `/api/me` chia nhau một entry.
> - Response chứa dữ liệu cá nhân lại bị cache bởi một shared cache (proxy/CDN) vì thiếu `Cache-Control: private` / `no-store` — xem [[02 - HTTP Caching]].
> - Redis/Memcached mặc định không mã hoá dữ liệu trong RAM; một cái `KEYS *` (hoặc dump) là nhìn thấy hết.
>
> Nếu vẫn phải cache: key **bắt buộc** gồm user id, TTL ngắn, và phải `DEL` ngay khi logout / đổi quyền. Liên quan: [[12 - Cookie và Session based Authentication]] — session store thường nằm trên Redis, nên đây không phải chuyện lý thuyết.

## D.3 — Dữ liệu cần chính xác tuyệt đối

Số dư tài khoản, số lượng vé còn lại của chuyến bay, số dư điểm loyalty của khách hàng, tồn kho lúc trừ kho.

Vấn đề không phải "cache có thể cũ vài giây". Vấn đề là **quyết định nghiệp vụ dựa trên bản cũ đó không thể rút lại**: trừ tiền hai lần, bán vé thứ 101 cho máy bay 100 ghế.

Nguyên tắc: **đọc để hiển thị** thì cache được (kèm ghi chú "cập nhật lúc..."); **đọc để quyết định ghi** thì phải đọc từ nguồn sự thật, trong transaction, có khoá — xem [[05 - Transactions, ACID và MVCC]].

## D.4 — Khi tỉ lệ hit quá thấp (hoặc DB vốn đã nhanh)

Đây là trường hợp duy nhất trong Phần D **có tài liệu chính thức nói tới**:

📖 **Nguyên văn** — Memcached Docs, User Guide FAQ (https://docs.memcached.org/userguide/faq/)
> "Can using memcached make my application slower? — Yes, absolutely. If your DB queries are all fast, your website is fast, adding memcached might not make it faster."
>
> "When would you not want to use memcached? — It doesn't always make sense to add memcached to your application."

🇻🇳 **Dịch**
> "**Dùng memcached có thể làm ứng dụng của tôi chậm đi không?** — Có, chắc chắn có. Nếu các query DB của bạn đều nhanh, website của bạn nhanh, thì thêm memcached có thể không làm nó nhanh hơn."
>
> "**Khi nào thì bạn không muốn dùng memcached?** — Không phải lúc nào thêm memcached vào ứng dụng cũng hợp lý."

Vì sao cache tỉ lệ hit thấp lại **chậm hơn** không cache? Vì mỗi lần miss bạn trả giá **2 lượt đi mạng** thay vì 1:

```
Không cache:   App ──────────────> DB        = 1 round-trip
Cache, HIT:    App ──> Cache                 = 1 round-trip (rẻ)
Cache, MISS:   App ──> Cache ──> App ──> DB ──> App ──> Cache
                                             = 2 round-trip + serialize
```

Với tỉ lệ hit đủ thấp, phần chi phí thêm vào áp đảo phần tiết kiệm được. Chưa kể chi phí ẩn: một thành phần hạ tầng nữa để vận hành, giám sát, và để hỏng.

> [!tip] Đo trước khi thêm
> Trước khi thêm cache, cần trả lời được: query nào đang chậm, chậm bao nhiêu, được gọi bao nhiêu lần, và tỉ lệ trùng lặp của tham số là bao nhiêu. Nếu query chậm vì **thiếu index** thì thêm index ([[04 - Indexes]]); nếu chậm vì **N+1** thì gộp query ([[07 - N+1 Problem]]). Cache đặt lên một query sai hình dạng chỉ giấu vấn đề đi, cho tới ngày cache miss.

---

## Tóm tắt phần 07

| Điều cần nhớ | Xem lại ở |
|---|---|
| Cache là gì, hit/miss/TTL, các tầng cache | [[01 - Caching là gì]] |
| `Cache-Control`, `ETag`, revalidation, 304 — cái duy nhất có RFC | [[02 - HTTP Caching]] |
| Redis là data structure server, không phải key-value thuần | [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] |
| TTL, eviction policy, RDB/AOF | [[04 - Redis - Expiration, Eviction và Persistence]] |
| Memcached: đơn giản có chủ đích, phân tán ở client | [[05 - Memcached]] |
| Chiến lược đọc/ghi + sự cố kinh điển = **thuật ngữ ngành**, không phải spec | bài này |

Ba câu chốt:
1. **Cache dễ, invalidation khó.** Phần khó nhất không phải đưa dữ liệu vào cache, mà là biết khi nào nó không còn đúng nữa — và RFC 9111 §4.4 nói thẳng rằng ngay cả HTTP cũng chỉ invalidate được ở những cache mà request "đi ngang qua".
2. **Cache không sửa được thiết kế sai.** N+1 vẫn là N+1, index thiếu vẫn là index thiếu.
3. **Cache là một đánh đổi tính nhất quán để lấy tốc độ.** Nếu bạn không nói được mình đang chấp nhận sai lệch tối đa bao lâu, thì bạn chưa thiết kế cache — bạn mới chỉ thêm một chỗ để dữ liệu sai.

---

## Liên kết

- Bài trước: [[05 - Memcached]]
- Quay lại mục lục: [[00 - Tổng hợp (Caching)]]
- [[01 - Caching là gì]] — khái niệm nền, hit/miss/TTL
- [[02 - HTTP Caching]] — `Cache-Control`, `stale-while-revalidate`, revalidation
- [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] — chi tiết các kiểu dữ liệu trích ở `[R2]`
- [[04 - Redis - Expiration, Eviction và Persistence]] — chi tiết `[R3]` và `[R6]`
- [[05 - Memcached]] — chi tiết `[M1]`, `[M4]`, `[M9]`
- [[01 - API là gì và nền tảng HTTP]] — `Cache-Control`, `ETag`, `If-None-Match`
- [[04 - HTTP Status Code và thiết kế lỗi]] — 304 Not Modified, và "non-error response" 2xx/3xx trong RFC 9111 §4.4
- [[02 - REST]] — cache là 1 trong 6 ràng buộc kiến trúc của REST
- [[12 - Cookie và Session based Authentication]] — session store trên Redis, rủi ro cache dữ liệu cá nhân
- [[04 - Indexes]] — cache KHÔNG thay thế index
- [[07 - N+1 Problem]] — cache KHÔNG sửa N+1, xem Phần B.6
- [[05 - Transactions, ACID và MVCC]] — cache phá vỡ tính nhất quán ở đâu; Redis Transaction khác ACID thế nào

## Nguồn tham khảo

- RFC 9111 — HTTP Caching : https://www.rfc-editor.org/rfc/rfc9111.txt (§4.4 Invalidating Stored Responses)
- RFC 5861 — HTTP Cache-Control Extensions for Stale Content : https://www.rfc-editor.org/rfc/rfc5861.txt (§3 `stale-while-revalidate`)
- Redis Docs — Redis data types : https://redis.io/docs/latest/develop/data-types/
- Redis Docs — Key eviction : https://redis.io/docs/latest/develop/reference/eviction/
- Redis Docs — Redis persistence : https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
- Redis Docs — Redis replication : https://redis.io/docs/latest/operate/oss_and_stack/management/replication/
- Redis Docs — Scale with Redis Cluster : https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/
- Redis Docs — Transactions : https://redis.io/docs/latest/develop/using-commands/transactions/
- Redis Docs — Redis Pub/Sub : https://redis.io/docs/latest/develop/pubsub/
- Redis Docs — Redis FAQ : https://redis.io/docs/latest/develop/get-started/faq/
- Redis Docs — Redis benchmark : https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/
- Redis Docs — Quick starts : https://redis.io/docs/latest/develop/get-started/
- Redis Docs — Coding patterns : https://redis.io/docs/latest/develop/clients/patterns/
- Memcached Docs — Memcached Overview : https://docs.memcached.org/
- Memcached Docs — User Guide FAQ : https://docs.memcached.org/userguide/faq/
- Memcached Docs — Basic Text Protocol : https://docs.memcached.org/protocols/basic/
- Memcached Docs — Server Guide / Configuring : https://docs.memcached.org/serverguide/configuring/
- Memcached Wiki — ProgrammingFAQ : https://github.com/memcached/memcached/wiki/ProgrammingFAQ
- Memcached — About : https://memcached.org/about
