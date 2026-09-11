# 01 — Caching là gì

> **Nguồn chính:** RFC 9111 — HTTP Caching — https://www.rfc-editor.org/rfc/rfc9111.txt
> Bài này đặt nền khái niệm cho cả phần 07: cache là gì, các thuật ngữ chuẩn (fresh/stale/age/validation), cache trong kiến trúc REST, eviction, và những vấn đề kinh điển.

---

## 1. Caching là gì

Bắt đầu từ mô tả của roadmap:

📖 **Nguyên văn** — developer-roadmap, mục `caching`
> "Caching is a technique used to store copies of data in a temporary storage location so that future requests for that data can be served faster. This temporary storage, known as a cache, can be located closer to the request source than the original data source, reducing latency and improving application performance. By retrieving data from the cache instead of the original source, applications can respond more quickly and efficiently."

🇻🇳 **Dịch**
> "Caching là kỹ thuật lưu các bản sao của dữ liệu ở một nơi lưu trữ tạm, để những request sau này cần dữ liệu đó được phục vụ nhanh hơn. Nơi lưu trữ tạm này — gọi là cache — có thể nằm gần nguồn phát request hơn so với nguồn dữ liệu gốc, nhờ vậy giảm latency và cải thiện hiệu năng ứng dụng. Bằng cách lấy dữ liệu từ cache thay vì từ nguồn gốc, ứng dụng có thể phản hồi nhanh và hiệu quả hơn."

Định nghĩa chính thống hơn nằm trong RFC 9111 — tài liệu chuẩn hoá việc cache của HTTP:

📖 **Nguyên văn** — RFC 9111, §1 Introduction
> "An HTTP "cache" is a local store of response messages and the subsystem that controls storage, retrieval, and deletion of messages in it.  A cache stores cacheable responses to reduce the response time and network bandwidth consumption on future equivalent requests.  Any client or server MAY use a cache, though not when acting as a tunnel (Section 3.7 of [HTTP])."

🇻🇳 **Dịch**
> "Một "cache" HTTP là một kho lưu trữ cục bộ chứa các response message, cùng với hệ thống con điều khiển việc lưu, lấy ra và xoá các message trong đó. Cache lưu các response có thể cache được nhằm giảm thời gian phản hồi và lượng băng thông mạng tiêu thụ cho những request tương đương trong tương lai. Bất kỳ client hay server nào cũng CÓ THỂ dùng cache, trừ khi nó đang đóng vai trò tunnel (Mục 3.7 của [HTTP])."

Chú ý hai vế trong định nghĩa: cache **không chỉ là cái kho**, mà còn là **cơ chế quản lý kho đó** (lưu gì, lấy ra khi nào, xoá lúc nào). Phần lớn cái khó của caching nằm ở vế thứ hai.

📖 **Nguyên văn** — RFC 9111, §1
> "The goal of HTTP caching is significantly improving performance by reusing a prior response message to satisfy a current request.  A cache considers a stored response "fresh", as defined in Section 4.2, if it can be reused without "validation" (checking with the origin server to see if the cached response remains valid for this request).  A fresh response can therefore reduce both latency and network overhead each time the cache reuses it."

🇻🇳 **Dịch**
> "Mục tiêu của HTTP caching là cải thiện đáng kể hiệu năng bằng cách tái sử dụng một response message trước đó để phục vụ một request hiện tại. Cache xem một response đã lưu là "fresh" (theo định nghĩa ở Mục 4.2) nếu nó có thể được tái sử dụng mà không cần "validation" (hỏi lại origin server xem response đã cache còn hợp lệ cho request này không). Nhờ đó, một response fresh giảm được cả latency lẫn chi phí mạng mỗi lần cache tái sử dụng nó."

### Vì sao cache nhanh hơn

Ba lý do, rút ra trực tiếp từ hai đoạn trích trên:

| Lý do | Giải thích |
|---|---|
| **Gần hơn** | Cache "can be located closer to the request source than the original data source" → quãng đường mạng ngắn hơn → latency thấp hơn |
| **Rẻ hơn** | "reduce ... network bandwidth consumption" → không phải truyền lại dữ liệu qua mạng |
| **Ít tính toán lại** | "reusing a prior response message" → origin server không phải dựng lại response (query DB, render template, gọi API khác) |

> [!note]
> Cả ba lý do đều là **giảm công việc**, không phải "làm cùng một việc nhanh hơn". Cache không tối ưu query của bạn — nó chỉ tránh phải chạy query đó. Đây là lý do cache **không thay thế** việc đánh index (xem [[04 - Indexes]]) hay sửa [[07 - N+1 Problem]].

💡 **Ví dụ đời sống**
Bạn ngồi làm việc ở tầng 2, nước uống ở bếp tầng 1. Mỗi lần khát mà chạy xuống bếp thì mất 2 phút → đó là "gọi thẳng origin server".
Cache = **để sẵn một chai nước trên bàn**. Khát thì với tay lấy, mất 2 giây:
- **gần hơn**: chai nước ở ngay trên bàn;
- **rẻ hơn**: không tốn công đi lại;
- **ít tính toán lại**: không phải mở tủ lạnh, rót, đậy nắp nữa.

Nhưng chai nước để lâu thì **nguội, cũ, hết** — đó chính xác là khái niệm **stale** ở mục 3. Và khi ai đó thay bình lọc dưới bếp bằng nước mới, chai trên bàn bạn **vẫn là nước cũ** — đó là bài toán **cache invalidation** ở mục 6.

---

## 2. Cache là một trong sáu ràng buộc kiến trúc của REST

Đây là điểm nối lý thuyết quan trọng với [[02 - REST]]. Trong luận án của Roy Fielding, REST được **dẫn xuất** ra bằng cách cộng dồn từng ràng buộc một vào "null style": §5.1.2 Client-Server → §5.1.3 Stateless → **§5.1.4 Cache** → §5.1.5 Uniform Interface → §5.1.6 Layered System → §5.1.7 Code-On-Demand. Cache là ràng buộc thứ ba trong sáu ràng buộc đó.

📖 **Nguyên văn** — Fielding, *Architectural Styles and the Design of Network-based Software Architectures*, §5.1.4 Cache
> "In order to improve network efficiency, we add cache constraints to form the client-cache-stateless-server style of Section 3.4.4 (Figure 5-4). Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests."

🇻🇳 **Dịch**
> "Để cải thiện hiệu quả mạng, chúng ta thêm các ràng buộc cache để tạo thành style client-cache-stateless-server ở Mục 3.4.4 (Hình 5-4). Ràng buộc cache đòi hỏi dữ liệu bên trong một response của một request phải được gán nhãn — ngầm định hoặc tường minh — là cacheable hay non-cacheable. Nếu một response là cacheable, thì cache phía client được trao quyền tái sử dụng dữ liệu response đó cho các request tương đương về sau."

Ba ý cần khắc:

1. Cache **kế thừa** ràng buộc **stateless** — chính vì mỗi request là self-contained, cache mới biết được "request tương đương" nghĩa là gì mà tái dùng.
2. Ràng buộc này bắt **mọi response phải được gán nhãn** cacheable / non-cacheable. Trong HTTP, nhãn đó chính là `Cache-Control`, `Expires` — xem [[01 - API là gì và nền tảng HTTP]].
3. "implicitly or explicitly" — nếu server **không** nói gì, cache vẫn được quyền tự đoán (RFC 9111 gọi là *heuristic freshness*). Nghĩa là **im lặng không phải là "đừng cache"**.

### Trade-off: cache làm giảm độ tin cậy

Phần quan trọng nhất của §5.1.4 — và cũng là phần hay bị bỏ qua khi người ta dạy REST:

📖 **Nguyên văn** — Fielding, §5.1.4 Cache
> "The advantage of adding cache constraints is that they have the potential to partially or completely eliminate some interactions, improving efficiency, scalability, and user-perceived performance by reducing the average latency of a series of interactions. The trade-off, however, is that a cache can decrease reliability if stale data within the cache differs significantly from the data that would have been obtained had the request been sent directly to the server."

🇻🇳 **Dịch**
> "Lợi thế của việc thêm ràng buộc cache là chúng có tiềm năng loại bỏ một phần hoặc hoàn toàn một số tương tác, qua đó cải thiện hiệu quả, khả năng mở rộng (scalability) và hiệu năng mà người dùng cảm nhận được, bằng cách giảm latency trung bình của một chuỗi tương tác. Tuy nhiên, cái giá đánh đổi là cache có thể **làm giảm độ tin cậy** nếu dữ liệu stale trong cache khác biệt đáng kể so với dữ liệu lẽ ra đã nhận được nếu request được gửi thẳng tới server."

> [!warning] Caching là một đánh đổi, không phải một tối ưu miễn phí
> Fielding nói thẳng: cache **decrease reliability**. Bạn đổi **tính đúng đắn tức thời** lấy **tốc độ**. Mọi quyết định cache đều là câu hỏi "sai lệch bao lâu thì chấp nhận được?" — chứ không phải "cache có tốt không?".
> Liên hệ với [[05 - Transactions, ACID và MVCC]]: database bỏ rất nhiều công để đảm bảo consistency; đặt một tầng cache lên trước nó là **cố ý** phá vỡ đảm bảo đó ở phạm vi ứng dụng.

📖 **Nguyên văn** — Fielding, §5.1.4 Cache (bối cảnh lịch sử)
> "The early Web architecture, as portrayed by the diagram in Figure 5-5 [11], was defined by the client-cache-stateless-server set of constraints. That is, the design rationale presented for the Web architecture prior to 1994 focused on stateless client-server interaction for the exchange of static documents over the Internet."

🇻🇳 **Dịch**
> "Kiến trúc Web thời kỳ đầu, như mô tả trong sơ đồ ở Hình 5-5 [11], được định nghĩa bởi tập ràng buộc client-cache-stateless-server. Nghĩa là, luận cứ thiết kế cho kiến trúc Web trước năm 1994 tập trung vào tương tác client-server stateless để trao đổi các tài liệu tĩnh trên Internet."

Tức là cache có mặt trong Web **từ trước cả khi REST được đặt tên**. Nó không phải thứ "thêm vào sau cho nhanh".

---

## 3. Thuật ngữ nền — trích nguyên văn RFC 9111

### 3.1. Fresh, stale, freshness lifetime, age

📖 **Nguyên văn** — RFC 9111, §4.2 Freshness
> "A "fresh" response is one whose age has not yet exceeded its freshness lifetime.  Conversely, a "stale" response is one where it has.
>
>    A response's "freshness lifetime" is the length of time between its generation by the origin server and its expiration time.  An "explicit expiration time" is the time at which the origin server intends that a stored response can no longer be used by a cache without further validation, whereas a "heuristic expiration time" is assigned by a cache when no explicit expiration time is available.
>
>    A response's "age" is the time that has passed since it was generated by, or successfully validated with, the origin server."

🇻🇳 **Dịch**
> "Một response "fresh" là response có age chưa vượt quá freshness lifetime của nó. Ngược lại, response "stale" là response đã vượt quá.
>
> "freshness lifetime" của một response là khoảng thời gian tính từ lúc nó được origin server sinh ra cho tới thời điểm hết hạn của nó. "explicit expiration time" là thời điểm mà origin server muốn rằng response đã lưu không được cache dùng tiếp nếu chưa validation thêm; còn "heuristic expiration time" là do chính cache tự gán khi không có explicit expiration time nào."
>
> ""age" của một response là khoảng thời gian đã trôi qua kể từ khi nó được origin server sinh ra, hoặc được validate thành công với origin server."

Công thức quyết định, nguyên văn:

📖 **Nguyên văn** — RFC 9111, §4.2
> "The calculation to determine if a response is fresh is:
>
>       response_is_fresh = (freshness_lifetime > current_age)"

🇻🇳 Một response còn fresh khi **thời gian sống cho phép** lớn hơn **tuổi hiện tại** của nó. Chỉ có vậy — toàn bộ phần còn lại của RFC là cách tính hai vế này cho chính xác.

`freshness_lifetime` được tính theo thứ tự ưu tiên, lấy cái khớp đầu tiên:

📖 **Nguyên văn** — RFC 9111, §4.2.1 Calculating Freshness Lifetime
> "*  If the cache is shared and the s-maxage response directive (Section 5.2.2.10) is present, use its value, or
>
>    *  If the max-age response directive (Section 5.2.2.1) is present, use its value, or
>
>    *  If the Expires response header field (Section 5.3) is present, use its value minus the value of the Date response header field (using the time the message was received if it is not present, as per Section 6.6.1 of [HTTP]), or
>
>    *  Otherwise, no explicit expiration time is present in the response. A heuristic freshness lifetime might be applicable; see Section 4.2.2."

🇻🇳 **Dịch**
> "* Nếu cache là shared cache và có directive `s-maxage` trong response (Mục 5.2.2.10), dùng giá trị của nó; hoặc
>
> * Nếu có directive `max-age` trong response (Mục 5.2.2.1), dùng giá trị của nó; hoặc
>
> * Nếu có header field `Expires` (Mục 5.3), dùng giá trị của nó trừ đi giá trị của header `Date` (nếu không có `Date` thì dùng thời điểm nhận được message, theo Mục 6.6.1 của [HTTP]); hoặc
>
> * Nếu không, response không có explicit expiration time nào. Khi đó có thể áp dụng heuristic freshness lifetime; xem Mục 4.2.2."

Còn `Age` là một header thật sự được gửi đi:

📖 **Nguyên văn** — RFC 9111, §5.1 Age
> "The "Age" response header field conveys the sender's estimate of the time since the response was generated or successfully validated at the origin server.  Age values are calculated as specified in Section 4.2.3.
>
>      Age = delta-seconds"

🇻🇳 **Dịch**
> "Header field response "Age" truyền tải ước lượng của bên gửi về khoảng thời gian kể từ khi response được sinh ra hoặc được validate thành công tại origin server. Giá trị Age được tính theo Mục 4.2.3.
>
> `Age = delta-seconds` (số giây, là một số nguyên không âm)."

> [!tip]
> Khi debug CDN, `Age` là header đáng nhìn đầu tiên. `Age: 0` nghĩa là response vừa được lấy từ origin; `Age` lớn nghĩa là bạn đang nhận một bản đã nằm trong cache khá lâu.

### 3.2. Validation

📖 **Nguyên văn** — RFC 9111, §4.3 Validation
> "When a cache has one or more stored responses for a requested URI, but cannot serve any of them (e.g., because they are not fresh, or one cannot be chosen; see Section 4.1), it can use the conditional request mechanism (Section 13 of [HTTP]) in the forwarded request to give the next inbound server an opportunity to choose a valid stored response to use, updating the stored metadata in the process, or to replace the stored response(s) with a new response.  This process is known as "validating" or "revalidating" the stored response."

🇻🇳 **Dịch**
> "Khi cache có một hoặc nhiều response đã lưu cho một URI được yêu cầu, nhưng không thể phục vụ bất kỳ cái nào trong số đó (ví dụ vì chúng không còn fresh, hoặc không chọn được cái nào; xem Mục 4.1), nó có thể dùng cơ chế conditional request (Mục 13 của [HTTP]) trong request được chuyển tiếp, để trao cho server phía trong cơ hội chọn một response đã lưu còn hợp lệ mà dùng — đồng thời cập nhật metadata đã lưu — hoặc thay thế (các) response đã lưu bằng một response mới. Quá trình này gọi là "validating" hoặc "revalidating" response đã lưu."

Hai "validator" được dùng để làm việc đó:

📖 **Nguyên văn** — RFC 9111, §4.3.1 Sending a Validation Request
> "One such validator is the timestamp given in a Last-Modified header field (Section 8.8.2 of [HTTP]), which can be used in an If-Modified-Since header field for response validation...
>
>    Another validator is the entity tag given in an ETag field (Section 8.8.3 of [HTTP]).  One or more entity tags, indicating one or more stored responses, can be used in an If-None-Match header field for response validation..."

🇻🇳 **Dịch**
> "Một validator là mốc thời gian trong header field `Last-Modified` (Mục 8.8.2 của [HTTP]), có thể dùng trong header field `If-Modified-Since` để validate response...
>
> Một validator khác là entity tag trong field `ETag` (Mục 8.8.3 của [HTTP]). Một hoặc nhiều entity tag — trỏ tới một hoặc nhiều response đã lưu — có thể dùng trong header field `If-None-Match` để validate response..."

> [!note]
> `ETag` / `If-None-Match` và status `304 Not Modified` đã gặp ở [[01 - API là gì và nền tảng HTTP]] và [[04 - HTTP Status Code và thiết kế lỗi]]. Ở đây bạn thấy vai trò thật của chúng: **validation là cách biến một entry stale thành fresh trở lại mà không phải tải lại toàn bộ body**.

### 3.3. Cache miss, cache key, và "collapse requests"

RFC 9111 dùng thuật ngữ "cache miss" khi nói về việc gộp request:

📖 **Nguyên văn** — RFC 9111, §4 Constructing Responses from Caches
> "A cache can use a response that is stored or storable to satisfy multiple requests, provided that it is allowed to reuse that response for the requests in question.  This enables a cache to "collapse requests" -- or combine multiple incoming requests into a single forward request upon a cache miss -- thereby reducing load on the origin server and network."

🇻🇳 **Dịch**
> "Cache có thể dùng một response đã lưu hoặc có thể lưu được để phục vụ nhiều request, miễn là nó được phép tái sử dụng response đó cho những request đang xét. Điều này cho phép cache "collapse requests" — tức gộp nhiều request đến thành một request chuyển tiếp duy nhất khi xảy ra cache miss — nhờ đó giảm tải cho origin server và cho mạng."

📖 **Nguyên văn** — RFC 9111, §2 Overview of Cache Operation
> "The "cache key" is the information a cache uses to choose a response and is composed from, at a minimum, the request method and target URI used to retrieve the stored response; the method determines under which circumstances that response can be used to satisfy a subsequent request.  However, many HTTP caches in common use today only cache GET responses and therefore only use the URI as the cache key."

🇻🇳 **Dịch**
> ""cache key" là thông tin mà cache dùng để chọn ra một response; tối thiểu nó gồm request method và target URI đã dùng để lấy về response được lưu. Method quyết định response đó được dùng để phục vụ request sau trong hoàn cảnh nào. Tuy nhiên, nhiều HTTP cache phổ biến hiện nay chỉ cache response của GET, và vì vậy chỉ dùng URI làm cache key."

> [!warning] Hai thuật ngữ KHÔNG có trong RFC 9111
> - **"cache hit"** — RFC 9111 có dùng "cache miss" (§4, trích ở trên) nhưng **không** định nghĩa "cache hit". "Cache hit / cache miss" là **thuật ngữ ngành**: hit = tìm thấy và dùng được dữ liệu trong cache, miss = không.
> - **"cache entry"** — cụm này **không xuất hiện** trong RFC 9111; RFC dùng "stored response". Riêng tài liệu Redis có dùng "cache entries" (trích ở mục 5). Trong note này, "cache entry" được hiểu là **thuật ngữ ngành** chỉ một mục dữ liệu trong cache (key + value + metadata).
>
> Redis gọi hit/miss bằng tên chỉ số cụ thể — đây mới là phần trích được:

📖 **Nguyên văn** — Redis Docs, *Key eviction* → Using the INFO command
> "the INFO stats section includes two important entries, keyspace_hits (the number of times keys were successfully found in the cache) and keyspace_misses (the number of times a key was requested but was not in the cache). The calculation below gives the percentage of attempted accesses that were satisfied from the cache:
>
> keyspace_hits / (keyspace_hits + keyspace_misses) * 100"

🇻🇳 **Dịch**
> "phần INFO stats bao gồm hai mục quan trọng: `keyspace_hits` (số lần key được tìm thấy thành công trong cache) và `keyspace_misses` (số lần một key được yêu cầu nhưng không có trong cache). Phép tính dưới đây cho ra tỉ lệ phần trăm số lần truy cập được phục vụ từ cache:
>
> `keyspace_hits / (keyspace_hits + keyspace_misses) * 100`"

---

## 4. Các tầng cache

> [!note] Phân loại chung
> Việc chia cache thành "client / proxy / CDN / application / database" là **cách phân loại phổ biến trong ngành**, KHÔNG phải phân loại có trong RFC 9111. Phần **trích được** từ RFC là sự phân biệt **private cache** vs **shared cache**.

📖 **Nguyên văn** — RFC 9111, §1 Introduction
> "A "shared cache" is a cache that stores responses for reuse by more than one user; shared caches are usually (but not always) deployed as a part of an intermediary.  A "private cache", in contrast, is dedicated to a single user; often, they are deployed as a component of a user agent."

🇻🇳 **Dịch**
> "Một "shared cache" là cache lưu response để **nhiều hơn một người dùng** tái sử dụng; shared cache thường (nhưng không phải luôn luôn) được triển khai như một phần của một intermediary. Ngược lại, "private cache" dành riêng cho **một người dùng duy nhất**; thường nó được triển khai như một thành phần của user agent."

Đây là ranh giới bảo mật quan trọng nhất của caching:

📖 **Nguyên văn** — RFC 9111, §7.1 Cache Poisoning
> "Storing malicious content in a cache can extend the reach of an attacker to affect multiple users.  Such "cache poisoning" attacks happen when an attacker uses implementation flaws, elevated privileges, or other techniques to insert a response into a cache.  This is especially effective when shared caches are used to distribute malicious content to many clients."

🇻🇳 **Dịch**
> "Việc lưu nội dung độc hại vào cache có thể mở rộng tầm ảnh hưởng của kẻ tấn công tới nhiều người dùng. Các tấn công "cache poisoning" xảy ra khi kẻ tấn công lợi dụng lỗi cài đặt, quyền hạn bị nâng cao, hoặc kỹ thuật khác để chèn một response vào cache. Điều này đặc biệt hiệu quả khi shared cache được dùng để phát tán nội dung độc hại tới nhiều client."

Bảng dưới là **phân loại ngành**, đối chiếu với khái niệm private/shared của RFC:

| Tầng | Ở đâu | Private hay shared | Ví dụ |
|---|---|---|---|
| Client cache | Trong trình duyệt / app người dùng | **private** (RFC: "dedicated to a single user ... a component of a user agent") | HTTP cache của browser |
| Proxy cache | Intermediary trên đường đi | **shared** | reverse proxy, forward proxy |
| CDN | Node đặt gần người dùng về mặt địa lý | **shared** | — |
| Application cache | Trong tiến trình app, hoặc một cache server riêng | tuỳ thiết kế | Redis, Memcached, biến in-process |
| Database cache | Bên trong DB | thuộc về DB | buffer/page cache của DB engine |

> [!danger] Dữ liệu riêng tư không được vào shared cache
> Một response chứa dữ liệu của **một user cụ thể** mà lọt vào một shared cache (proxy, CDN) thì user khác có thể nhận được nó. Đây chính là lý do `Cache-Control: private` và `no-store` tồn tại. Liên quan tới [[12 - Cookie và Session based Authentication]]: response gắn với session **không bao giờ** được cache ở tầng shared.

---

## 5. Eviction — khi cache đầy thì bỏ gì?

Cache có dung lượng hữu hạn. Khi đầy, phải **bỏ bớt** (evict) để chỗ cho dữ liệu mới.

📖 **Nguyên văn** — Redis Docs, *Key eviction*
> "Redis is commonly used as a cache to speed up read accesses to a slower server or database. Since cache entries are copies of persistently-stored data, it is usually safe to evict them when the cache runs out of memory (they can be cached again in the future if necessary).
> Redis lets you specify an eviction policy to evict keys automatically when the size of the cache exceeds a set memory limit. Whenever a client runs a new command that adds more data to the cache, Redis checks the memory usage. If it is greater than the limit, Redis evicts keys according to the chosen eviction policy until the total memory used is back below the limit."

🇻🇳 **Dịch**
> "Redis thường được dùng làm cache để tăng tốc truy cập đọc tới một server hoặc database chậm hơn. Vì các cache entry là bản sao của dữ liệu đã được lưu bền vững, nên thường là an toàn khi evict chúng lúc cache hết bộ nhớ (sau này nếu cần vẫn có thể cache lại).
> Redis cho phép bạn chỉ định một eviction policy để tự động evict key khi kích thước cache vượt quá một giới hạn bộ nhớ đã đặt. Mỗi khi một client chạy một lệnh mới thêm dữ liệu vào cache, Redis kiểm tra mức dùng bộ nhớ. Nếu vượt quá giới hạn, Redis evict các key theo eviction policy đã chọn cho tới khi tổng bộ nhớ dùng tụt xuống dưới giới hạn."

Câu đầu tiên là một nguyên tắc thiết kế lớn: **cache an toàn để mất, vì dữ liệu thật nằm chỗ khác.** Nếu mất dữ liệu trong cache làm hỏng nghiệp vụ thì cái đó không phải cache — đó là database.

### Các eviction policy của Redis

📖 **Nguyên văn** — Redis Docs, *Key eviction* → Eviction policies
> "Use the maxmemory-policy configuration directive to select the eviction policy you want to use when the limit set by maxmemory is reached. The following policies are available:
>
> noeviction: Keys are not evicted but the server will return an error when you try to execute commands that cache new data. If your database uses replication then this condition only applies to the primary database. Note that commands that only read existing data still work as normal.
> allkeys-lru: Evict the least recently used (LRU) keys.
> allkeys-lrm: Evict the least recently modified (LRM) keys.
> allkeys-lfu: Evict the least frequently used (LFU) keys.
> allkeys-random: Evict keys at random.
> volatile-lru: Evict the least recently used keys that have an associated expiration (TTL).
> volatile-lrm: Evict the least recently modified keys that have an associated expiration (TTL).
> volatile-lfu: Evict the least frequently used keys that have an associated expiration (TTL).
> volatile-random: Evicts random keys that have an associated expiration (TTL).
> volatile-ttl: Evict keys with an associated expiration (TTL) that have the shortest remaining TTL value.
>
> The volatile-xxx policies behave like noeviction if no keys have an associated expiration."

🇻🇳 **Dịch** (dạng bảng)

| Policy | Nghĩa |
|---|---|
| `noeviction` | Không evict key nào; server trả về lỗi khi bạn chạy lệnh ghi thêm dữ liệu vào cache. Nếu database dùng replication thì điều kiện này chỉ áp cho primary. Lệnh chỉ đọc dữ liệu sẵn có vẫn chạy bình thường |
| `allkeys-lru` | Evict các key ít được dùng gần đây nhất (LRU) |
| `allkeys-lrm` | Evict các key ít được sửa gần đây nhất (LRM) |
| `allkeys-lfu` | Evict các key ít được dùng thường xuyên nhất (LFU) |
| `allkeys-random` | Evict key ngẫu nhiên |
| `volatile-lru` | Evict key LRU **trong số các key có gắn expiration (TTL)** |
| `volatile-lrm` | Evict key LRM trong số các key có gắn TTL |
| `volatile-lfu` | Evict key LFU trong số các key có gắn TTL |
| `volatile-random` | Evict key ngẫu nhiên trong số các key có gắn TTL |
| `volatile-ttl` | Evict key có TTL còn lại ngắn nhất |
>
> Các policy `volatile-xxx` hành xử như `noeviction` nếu không có key nào gắn expiration.

Redis có khuyến nghị chọn policy — và đây là khuyến nghị **của chính docs**, không phải nhận định của note này:

📖 **Nguyên văn** — Redis Docs, *Key eviction* → Eviction policies
> "Use allkeys-lru when you expect that a subset of elements will be accessed far more often than the rest. This is a very common case according to the Pareto principle, so allkeys-lru is a good default option if you have no reason to prefer any others."

🇻🇳 **Dịch**
> "Dùng `allkeys-lru` khi bạn dự đoán rằng một tập con các phần tử sẽ được truy cập thường xuyên hơn hẳn phần còn lại. Đây là trường hợp rất phổ biến theo nguyên lý Pareto, nên `allkeys-lru` là lựa chọn mặc định tốt nếu bạn không có lý do nào để thích cái khác."

### LRU của Redis là xấp xỉ, không phải LRU thật

📖 **Nguyên văn** — Redis Docs, *Key eviction* → Approximated LRU algorithm
> "The Redis LRU algorithm uses an approximation of the least recently used keys rather than calculating them exactly. It samples a small number of keys at random and then evicts the ones with the longest time since last access. From Redis 3.0 onwards, the algorithm also tracks a pool of good candidates for eviction. This improves the performance of the algorithm, making it a close approximation to a true LRU algorithm."

🇻🇳 **Dịch**
> "Thuật toán LRU của Redis dùng một phép **xấp xỉ** các key ít được dùng gần đây nhất, thay vì tính chính xác chúng. Nó lấy mẫu ngẫu nhiên một số ít key rồi evict những key có thời gian kể từ lần truy cập cuối là dài nhất. Từ Redis 3.0 trở đi, thuật toán còn theo dõi một pool các ứng viên tốt để evict. Điều này cải thiện hiệu năng thuật toán, khiến nó xấp xỉ rất sát một thuật toán LRU thật."

📖 **Nguyên văn** — Redis Docs, *Key eviction* → Approximated LRU algorithm / LFU eviction
> "The reason Redis does not use a true LRU implementation is because it costs more memory. However, the approximation is virtually equivalent for an application using Redis."
>
> "Starting with Redis 4.0, the Least Frequently Used eviction mode is available. This mode may work better (provide a better hits/misses ratio) in certain cases. In LFU mode, Redis will try to track the frequency of access of items, so the ones used rarely are evicted. This means the keys used often have a higher chance of remaining in memory."

🇻🇳 **Dịch**
> "Lý do Redis không dùng một cài đặt LRU thật là vì nó tốn nhiều bộ nhớ hơn. Tuy nhiên, với một ứng dụng dùng Redis thì bản xấp xỉ gần như tương đương."
>
> "Từ Redis 4.0, chế độ evict Least Frequently Used đã có sẵn. Chế độ này có thể hoạt động tốt hơn (cho tỉ lệ hits/misses tốt hơn) trong một số trường hợp. Ở chế độ LFU, Redis cố gắng theo dõi tần suất truy cập của các item, để những item ít dùng bị evict. Nghĩa là các key được dùng thường xuyên có cơ hội ở lại trong bộ nhớ cao hơn."

### Memcached: quên là một tính năng

📖 **Nguyên văn** — Memcached Documentation, *Memcached Overview* → What is it Made Up Of?
> "Client software, which is given a list of available memcached servers.
> A client-based hashing algorithm, which chooses a server based on the "key".
> Server software, which stores values with their keys into an internal hash table.
> LRU, which determine when to throw out old data (if out of memory), or reuse memory."

🇻🇳 **Dịch**
> "Phần mềm client, được cấp một danh sách các memcached server khả dụng.
> Một thuật toán hashing phía client, dùng để chọn server dựa trên "key".
> Phần mềm server, lưu các giá trị cùng key của chúng vào một hash table nội bộ.
> LRU, quyết định khi nào vứt bỏ dữ liệu cũ (nếu hết bộ nhớ), hoặc tái sử dụng bộ nhớ."

📖 **Nguyên văn** — Memcached Documentation, *Memcached Overview* → Forgetting is a Feature
> "Memcached is, by default, a Least Recently Used cache. Items expire after a specified amount of time. Both of these are elegant solutions to many problems; Expire items after a minute to limit stale data being returned, or flush unused data in an effort to retain frequently requested information.
> No "pauses" waiting for a garbage collector ensures low latency, and free space is lazily reclaimed."

🇻🇳 **Dịch**
> "Memcached, theo mặc định, là một cache Least Recently Used. Các item hết hạn sau một khoảng thời gian đã định. Cả hai điều này đều là những giải pháp thanh lịch cho nhiều vấn đề: cho item hết hạn sau một phút để hạn chế việc trả về dữ liệu stale, hoặc xả bớt dữ liệu không dùng nhằm giữ lại thông tin được yêu cầu thường xuyên.
> Việc không có "khoảng dừng" chờ garbage collector đảm bảo latency thấp, và không gian trống được thu hồi một cách lười (lazily)."

| | Redis | Memcached |
|---|---|---|
| Chính sách mặc định (theo docs) | chọn qua `maxmemory-policy` | "by default, a Least Recently Used cache" |
| Bộ policy | 10 policy: `noeviction`, `allkeys-{lru,lrm,lfu,random}`, `volatile-{lru,lrm,lfu,random,ttl}` | LRU |
| LRU chính xác? | "an approximation ... rather than calculating them exactly" | docs Overview không nói, có trang LRU riêng |

---

## 6. Cache invalidation — vì sao khó

Có một câu đùa nổi tiếng trong ngành. Nguồn ghi nhận đáng tin nhất là bài *Two Hard Things* của Martin Fowler (14/07/2009), nơi câu này được gán cho **Phil Karlton**:

📖 **Nguyên văn** — Martin Fowler, *Two Hard Things* (nguồn bên thứ ba)
> "There are only two hard things in Computer Science: cache invalidation and naming things.
>
> -- Phil Karlton"

🇻🇳 **Dịch**
> "Chỉ có hai thứ khó trong Khoa học Máy tính: cache invalidation và đặt tên cho mọi thứ.
>
> — Phil Karlton"

> [!note]
> Chính Fowler cũng ghi trong bài: *"Long a favorite saying of mine, one for which I couldn't find a satisfactory URL"* (🇻🇳 "Từ lâu là một câu nói tôi rất thích, nhưng tôi không tìm được một URL nguồn nào thoả đáng cho nó"). Nên xem đây là **câu đùa được lưu truyền**, không phải trích dẫn có nguồn gốc sơ cấp.

Vì sao khó? Vì invalidation là bài toán **phân tán**: dữ liệu gốc đổi ở một chỗ, nhưng bản sao nằm rải rác ở nhiều cache mà bên ghi không kiểm soát được. RFC 9111 định nghĩa "invalidate" rất cụ thể:

📖 **Nguyên văn** — RFC 9111, §4.4 Invalidating Stored Responses
> ""Invalidate" means that the cache will either remove all stored responses whose target URI matches the given URI or mark them as "invalid" and in need of a mandatory validation before they can be sent in response to a subsequent request."

🇻🇳 **Dịch**
> ""Invalidate" nghĩa là cache sẽ hoặc **xoá** tất cả các response đã lưu có target URI khớp với URI đã cho, hoặc **đánh dấu chúng là "invalid"** và bắt buộc phải validation trước khi được gửi đi để trả lời một request về sau."

📖 **Nguyên văn** — RFC 9111, §4.4
> "Because unsafe request methods (Section 9.2.1 of [HTTP]) such as PUT, POST, or DELETE have the potential for changing state on the origin server, intervening caches are required to invalidate stored responses to keep their contents up to date.
>
>    A cache MUST invalidate the target URI (Section 7.1 of [HTTP]) when it receives a non-error status code in response to an unsafe request method (including methods whose safety is unknown)."

🇻🇳 **Dịch**
> "Vì các request method unsafe (Mục 9.2.1 của [HTTP]) như PUT, POST hay DELETE có khả năng làm thay đổi trạng thái trên origin server, nên các cache nằm trên đường đi buộc phải invalidate các response đã lưu để giữ nội dung của chúng luôn cập nhật.
>
> Cache **PHẢI** invalidate target URI (Mục 7.1 của [HTTP]) khi nó nhận được một status code không phải lỗi cho một request method unsafe (kể cả các method chưa rõ có safe hay không)."

Và đây là câu giải thích chính xác **vì sao invalidation không bao giờ đủ**:

📖 **Nguyên văn** — RFC 9111, §4.4
> "Note that this does not guarantee that all appropriate responses are invalidated globally; a state-changing request would only invalidate responses in the caches it travels through."

🇻🇳 **Dịch**
> "Lưu ý rằng điều này **không đảm bảo** mọi response tương ứng đều bị invalidate trên toàn cục; một request làm thay đổi trạng thái chỉ invalidate được các response nằm trong những cache mà nó **đi qua**."

> [!warning]
> Đọc kỹ câu trên: request `POST /products/123` của bạn chỉ xoá cache ở những nút mạng mà nó đi qua. Một CDN node ở châu lục khác, hay browser cache của một user khác, **không biết gì cả** và vẫn phục vụ bản cũ cho tới khi hết `freshness_lifetime`. Đây là lý do người ta chọn **TTL ngắn** thay vì tin vào invalidation chủ động.

Memcached chọn hướng khác — làm cho invalidation đơn giản bằng cách bỏ hẳn đồng bộ giữa các server:

📖 **Nguyên văn** — Memcached Documentation, *Memcached Overview* → Servers are Disconnected From Each Other / Cache Invalidation
> "Memcached servers are unaware of each other. There is no crosstalk, no synchronization, no broadcasting, no replication. Adding servers increases the available memory. Cache invalidation is simplified, as clients delete or overwrite data on the server which owns it directly."
>
> "Rather than broadcasting changes to all available hosts, clients directly address the server holding the data to be invalidated."

🇻🇳 **Dịch**
> "Các memcached server không biết đến sự tồn tại của nhau. Không có trao đổi chéo, không đồng bộ, không broadcast, không replication. Thêm server thì tăng bộ nhớ khả dụng. Việc cache invalidation được đơn giản hoá, vì client xoá hoặc ghi đè dữ liệu trực tiếp trên đúng server đang giữ nó."
>
> "Thay vì broadcast thay đổi tới mọi host khả dụng, client địa chỉ trực tiếp tới server đang giữ dữ liệu cần invalidate."

---

## 7. Ba vấn đề kinh điển

### 7.1. Stale data — dữ liệu cũ

Đây là vấn đề **có định nghĩa trong spec**: stale = age đã vượt freshness lifetime (§4.2, đã trích ở mục 3.1). Hệ quả của nó là điều Fielding cảnh báo ở §5.1.4: "a cache can decrease reliability if stale data within the cache differs significantly from the data that would have been obtained had the request been sent directly to the server".

Quan trọng: **stale không tự động nghĩa là bỏ đi**. RFC cho phép phục vụ bản stale trong một số điều kiện:

📖 **Nguyên văn** — RFC 9111, §4.2.4 Serving Stale Responses
> "A cache MUST NOT generate a stale response unless it is disconnected or doing so is explicitly permitted by the client or origin server (e.g., by the max-stale request directive in Section 5.2.1, extension directives such as those defined in [RFC5861], or configuration in accordance with an out-of-band contract)."

🇻🇳 **Dịch**
> "Cache **KHÔNG ĐƯỢC** sinh ra một response stale trừ khi nó đang bị mất kết nối (disconnected), hoặc việc đó được client hay origin server cho phép một cách tường minh (ví dụ qua directive `max-stale` ở Mục 5.2.1, các extension directive như định nghĩa trong [RFC5861], hoặc cấu hình theo một thoả thuận ngoài giao thức)."

### 7.2. Thundering herd / cache stampede

> [!note] Nhãn thuật ngữ
> "Thundering herd" / "cache stampede" là **thuật ngữ ngành**, không có trong RFC 9111. Tuy nhiên docs của Memcached có mục riêng tên *"Avoiding stampeding herd"* — nên phần mô tả vấn đề dưới đây **trích được nguyên văn**.

📖 **Nguyên văn** — Memcached Documentation, *Use Cases* → Avoiding stampeding herd
> "It's a big problem when cache misses on hot (or expensive) items cause a mess of application processes to slam your database for answers. There are a large array of choices one has to avoid this problem, and we'll discuss a few below."

🇻🇳 **Dịch**
> "Đó là một vấn đề lớn khi cache miss trên các item nóng (hoặc đắt đỏ) khiến một mớ tiến trình ứng dụng cùng lúc dập vào database của bạn để lấy câu trả lời. Có cả một dải lựa chọn để tránh vấn đề này, và chúng ta sẽ bàn vài cái ở dưới."

Một trong các cách xử lý được docs mô tả — "soft expiration" (hết hạn mềm):

📖 **Nguyên văn** — Memcached Documentation, *Use Cases* → Scaling expiration
> "A common trick is to use soft expiration values embedded in your cached object. If your object is due to expire in an hour, set it to actually expire in 1.5 hours or more. Inside your object set a "soft timeout" for when you think the object is old.
> When you fetch an object and it has passed the soft timeout, you can pick any method that agrees with you to re-cache it:
> Do a "lock" as noted above. If you fail to acquire the lock, return the old cached item. Lock winner recaches.
> ...
> The cache object can still go away for many reasons (server restart, LRU, eviction, etc). Use this as mitigation but not your only line of defense."

🇻🇳 **Dịch**
> "Một mẹo phổ biến là nhúng giá trị hết hạn "mềm" vào chính object được cache. Nếu object của bạn đáng lẽ hết hạn sau một giờ, hãy đặt cho nó hết hạn thật sau 1,5 giờ hoặc hơn. Bên trong object, đặt một "soft timeout" cho thời điểm bạn coi là object đã cũ.
> Khi bạn lấy một object ra và nó đã qua soft timeout, bạn có thể chọn bất kỳ cách nào phù hợp để cache lại nó:
> Thực hiện một "lock" như nói ở trên. Nếu không giành được lock, trả về item cũ trong cache. Bên giành được lock sẽ cache lại.
> ...
> Object trong cache vẫn có thể biến mất vì nhiều lý do (server restart, LRU, eviction, v.v.). Hãy dùng cách này như một biện pháp giảm thiểu, **chứ không phải tuyến phòng thủ duy nhất** của bạn."

Lưu ý rằng chính RFC 9111 cũng có cơ chế cho vấn đề này ở tầng HTTP — "collapse requests" (§4, đã trích ở mục 3.3): gộp nhiều request đến thành **một** request chuyển tiếp khi cache miss.

💡 **Ví dụ đời sống**
Cả văn phòng cùng uống chung một chai nước trên bàn. Chai vừa cạn, 20 người cùng lúc phát hiện ra và **cả 20 người cùng chạy xuống bếp**. Bếp tắc nghẽn. Cách đúng: một người xung phong đi lấy (giành "lock"), 19 người còn lại chờ hoặc tạm uống chỗ nước cũ còn sót.

### 7.3. Cache penetration

> [!note] Nhãn thuật ngữ
> "Cache penetration" là **thuật ngữ ngành**. Tôi **không** trích được cụm này từ RFC 9111, Redis docs hay Memcached docs — nên phần mô tả dưới đây là **giải thích của note này**, không phải trích dẫn.

Mô tả vấn đề: request hỏi những key **không tồn tại ở cả cache lẫn database**. Cache luôn miss (vì không có gì để lưu), nên mọi request đều xuyên qua cache và đập thẳng vào database. Nếu key được sinh ngẫu nhiên (ví dụ một kẻ tấn công bắn `/products/{id}` với id ngẫu nhiên), cache mất hoàn toàn tác dụng bảo vệ.

Có một chi tiết **trích được** từ RFC 9111 liên quan trực tiếp: cache HTTP **được phép lưu cả kết quả âm**:

📖 **Nguyên văn** — RFC 9111, §2 Overview of Cache Operation
> "Most commonly, caches store the successful result of a retrieval request: i.e., a 200 (OK) response to a GET request, which contains a representation of the target resource (Section 9.3.1 of [HTTP]).  However, it is also possible to store redirects, negative results (e.g., 404 (Not Found)), incomplete results (e.g., 206 (Partial Content)), and responses to methods other than GET if the method's definition allows such caching and defines something suitable for use as a cache key."

🇻🇳 **Dịch**
> "Thông thường nhất, cache lưu kết quả thành công của một request lấy dữ liệu: tức response 200 (OK) cho một request GET, chứa một representation của target resource (Mục 9.3.1 của [HTTP]). Tuy nhiên, cũng có thể lưu các redirect, các **kết quả âm** (ví dụ 404 (Not Found)), các kết quả không đầy đủ (ví dụ 206 (Partial Content)), và response của những method khác GET nếu định nghĩa của method đó cho phép cache như vậy và định nghĩa được thứ gì đó phù hợp để làm cache key."

Tức là **cache chính kết quả "không tìm thấy"** là một cách chuẩn HTTP đã tính đến. Xem thêm [[04 - HTTP Status Code và thiết kế lỗi]] về 404.

---

## 8. Cache KHÔNG thay được index, cũng KHÔNG sửa được N+1

> [!warning] Nhận định của note này (không trích từ spec)
> Đây là hai ngộ nhận rất hay gặp khi mới học cache.

**Cache ≠ index.** [[04 - Indexes]] làm cho **chính query đó** chạy nhanh, cho **mọi** giá trị tham số, kể cả lần đầu tiên. Cache chỉ nhanh **từ lần thứ hai trở đi**, và chỉ cho **đúng cache key đã gặp**. Một query full-scan chậm được cache lại thì:
- lần miss đầu tiên vẫn chậm y nguyên;
- mỗi lần eviction / hết TTL là lại chậm một lần nữa;
- nếu tập tham số đa dạng (mỗi user một giá trị), hit rate thấp và cache gần như vô dụng.
→ Đánh index trước, cache sau.

**Cache ≠ sửa N+1.** [[07 - N+1 Problem]] là bài toán **số lượng round-trip**: 1 query lấy danh sách + N query lấy chi tiết từng phần tử. Đặt cache lên trước thì bạn vẫn thực hiện **N lần round-trip** — chỉ là round-trip **tới cache** thay vì tới database. Nếu cache nằm trên máy khác (Redis, Memcached qua mạng), N round-trip mạng vẫn còn nguyên đó. Cách sửa N+1 đúng là **gộp truy vấn** (JOIN, `IN (...)`, batching) — xem [[03 - Queries - SELECT, JOIN, Aggregate]].

💡 **Ví dụ đời sống**
Bạn cần 50 món trong siêu thị. N+1 = đi 50 chuyến, mỗi chuyến mua 1 món. Đặt một cái tủ ngay cửa nhà (cache) làm mỗi chuyến ngắn hơn — nhưng **vẫn là 50 chuyến**. Cách sửa thật là **cầm một cái giỏ và mua cả 50 món trong một chuyến**.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

- **Cache trong biến toàn cục của một tiến trình là private cache của đúng tiến trình đó.** Khi app chạy trên một nền tảng auto-scale nhiều instance, mỗi instance có bản cache riêng, không đồng bộ với nhau. Hệ quả: xoá cache ở instance A không xoá được ở instance B — đúng y hệt điều RFC 9111 §4.4 cảnh báo ("would only invalidate responses in the caches it travels through"). Muốn invalidation dùng chung thì cache phải nằm ở một chỗ dùng chung (Redis/Memcached), không nằm trong bộ nhớ tiến trình.
- **Response của API gắn với một shop/user cụ thể phải được đánh dấu là private** trước khi qua bất kỳ CDN hay reverse proxy nào — nếu không, dữ liệu của shop này có thể được phục vụ cho shop khác (mục 4, RFC 9111 §7.1 cache poisoning và định nghĩa shared cache).
- **TTL ngắn thường an toàn hơn invalidation chủ động.** Lý do đã nêu ở mục 6: bạn không kiểm soát được mọi cache trên đường đi.

---

## Liên kết

- Bài kế: [[02 - HTTP Caching]]
- [[02 - REST]] — cache là ràng buộc kiến trúc thứ ba trong sáu ràng buộc dẫn xuất ra REST (Fielding §5.1.4)
- [[01 - API là gì và nền tảng HTTP]] — `Cache-Control`, `ETag`, `If-None-Match` ở tầng header
- [[04 - HTTP Status Code và thiết kế lỗi]] — `304 Not Modified` là kết quả của validation; `404` cũng cache được
- [[12 - Cookie và Session based Authentication]] — vì sao response gắn session không được vào shared cache
- [[04 - Indexes]] — cache không thay thế index
- [[07 - N+1 Problem]] — cache không sửa được N+1, chỉ đổi đích của N round-trip
- [[03 - Queries - SELECT, JOIN, Aggregate]] — gộp truy vấn mới là cách sửa N+1
- [[05 - Transactions, ACID và MVCC]] — cache cố ý phá vỡ đảm bảo consistency mà DB dày công xây
- [[02 - What is HTTP]] — nền tảng giao thức mà RFC 9111 mở rộng

## Nguồn tham khảo

- RFC 9111 — HTTP Caching : https://www.rfc-editor.org/rfc/rfc9111.txt
- Roy T. Fielding, *Architectural Styles and the Design of Network-based Software Architectures*, §5.1.4 Cache : https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- Redis Docs — Key eviction : https://redis.io/docs/latest/develop/reference/eviction/
- Memcached Documentation — Memcached Overview : https://docs.memcached.org/ (trang wiki cũ https://github.com/memcached/memcached/wiki/Overview nay chỉ trỏ về đây)
- Memcached Documentation — User Guide / Use Cases : https://docs.memcached.org/userguide/usecases/
- developer-roadmap — Backend, mục `caching` : https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/roadmaps/backend/content/caching%40uPjCrDGA2MHylWXbZvMBM.md
- Martin Fowler — *Two Hard Things* (nguồn bên thứ ba, cho câu nói của Phil Karlton) : https://martinfowler.com/bliki/TwoHardThings.html
