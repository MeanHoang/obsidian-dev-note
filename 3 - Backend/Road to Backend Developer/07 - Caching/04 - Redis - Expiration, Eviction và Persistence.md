# 04 — Redis: Expiration, Eviction và Persistence

> **Nguồn chính:** Redis Docs — [EXPIRE](https://redis.io/docs/latest/commands/expire/) · [Key eviction](https://redis.io/docs/latest/develop/reference/eviction/) · [Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
> Bài này là phần **vận hành** khi dùng Redis làm cache thật: key sống bao lâu (TTL), hết RAM thì bỏ key nào (eviction), và dữ liệu có được ghi xuống đĩa không (persistence).

Ở [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] ta đã biết Redis lưu gì và ra lệnh thế nào. Nhưng một cache thật thì câu hỏi sống còn không phải "lưu được gì" mà là: **khi RAM đầy thì chuyện gì xảy ra?**

---

## Phần A — Expiration (TTL)

### A1. `EXPIRE` làm gì

📖 **Nguyên văn**
> "Set a timeout on key.
> After the timeout has expired, the key will automatically be deleted.
> A key with an associated timeout is often said to be volatile in Redis terminology."

🇻🇳 **Dịch**
> "Đặt một timeout lên key.
> Sau khi timeout hết hạn, key sẽ tự động bị xoá.
> Một key có gắn timeout thường được gọi là **volatile** trong thuật ngữ Redis."

> [!note] Nhớ chữ "volatile"
> Từ **volatile** này sẽ quay lại ở phần Eviction: các policy `volatile-*` chỉ động tới nhóm key "có TTL" này. Key không có TTL không phải volatile.

Cú pháp (nguyên văn từ trang docs):

📖 **Nguyên văn**
> ```
> EXPIRE key seconds [NX | XX | GT | LT]
> ```

🇻🇳 Cú pháp lệnh: đặt TTL tính bằng giây cho `key`, kèm một điều kiện tuỳ chọn.

### A2. TTL bị xoá lúc nào, giữ nguyên lúc nào

Đây là chỗ rất dễ sai khi viết code cache.

📖 **Nguyên văn**
> "The timeout will only be cleared by commands that delete or overwrite the contents of the key, including DEL, SET, GETSET and all the *STORE commands.
> This means that all the operations that conceptually alter the value stored at the key without replacing it with a new one will leave the timeout untouched.
> For instance, incrementing the value of a key with INCR, pushing a new value into a list with LPUSH, or altering the field value of a hash with HSET are all operations that will leave the timeout untouched."

🇻🇳 **Dịch**
> "Timeout chỉ bị xoá bởi những lệnh xoá hoặc **ghi đè** nội dung của key, bao gồm `DEL`, `SET`, `GETSET` và tất cả các lệnh `*STORE`.
> Điều này nghĩa là mọi thao tác về mặt khái niệm chỉ *sửa* giá trị đang lưu tại key mà không thay nó bằng một giá trị mới thì sẽ **để nguyên** timeout.
> Ví dụ, tăng giá trị của key bằng `INCR`, đẩy một giá trị mới vào list bằng `LPUSH`, hay sửa giá trị field của một hash bằng `HSET` đều là những thao tác giữ nguyên timeout."

> [!warning] Bẫy kinh điển
> `SET key value` (không kèm `EX`) trên một key đang có TTL sẽ **xoá luôn TTL đó** — key trở thành sống mãi mãi. Rất nhiều "memory leak" trên Redis đến từ đúng dòng này: lần đầu set có TTL, lần refresh sau quên mất.

Về `PERSIST`, docs viết: *"The timeout can also be cleared, turning the key back into a persistent key, using the PERSIST command."* — 🇻🇳 timeout cũng có thể bị xoá đi, biến key trở lại thành key **persistent** (sống mãi), bằng lệnh `PERSIST`.

Docs cũng lưu ý: *"calling EXPIRE/PEXPIRE with a non-positive timeout or EXPIREAT/PEXPIREAT with a time in the past will result in the key being deleted rather than expired"* — 🇻🇳 gọi với timeout không dương hoặc thời điểm trong quá khứ thì key bị **xoá** chứ không phải **expire** (key event phát ra là `del`, không phải `expired`).

### A3. Bốn option điều kiện: NX / XX / GT / LT

📖 **Nguyên văn**
> "These options are mutually exclusive.
>
> NX
> Set the expiry only when the key has no expiry.
>
> XX
> Set the expiry only when the key already has an expiry.
>
> GT
> Set the expiry only when the new expiry is greater than the current one. A non-volatile key is treated as an infinite TTL for the purpose of GT.
>
> LT
> Set the expiry only when the new expiry is less than the current one. A non-volatile key is treated as an infinite TTL for the purpose of LT."

🇻🇳 **Dịch**
> "Các option này loại trừ lẫn nhau.
> `NX` — Chỉ đặt expiry khi key **chưa có** expiry.
> `XX` — Chỉ đặt expiry khi key **đã có** expiry.
> `GT` — Chỉ đặt expiry khi expiry mới **lớn hơn** expiry hiện tại. Với `GT`, key non-volatile được coi là có TTL vô hạn.
> `LT` — Chỉ đặt expiry khi expiry mới **nhỏ hơn** expiry hiện tại. Với `LT`, key non-volatile được coi là có TTL vô hạn."

Hệ quả của quy ước "vô hạn": `EXPIRE key 60 GT` trên key không TTL sẽ **không** làm gì (60 < ∞), còn `EXPIRE key 60 LT` thì **có** tác dụng.

### A4. Ví dụ gốc trong docs

📖 **Nguyên văn**
> ```
> > SET mykey "Hello"
> OK
> > EXPIRE mykey 10
> (integer) 1
> > TTL mykey
> (integer) 10
> > SET mykey "Hello World"
> OK
> > TTL mykey
> (integer) -1
> > EXPIRE mykey 10 XX
> (integer) 0
> > TTL mykey
> (integer) -1
> > EXPIRE mykey 10 NX
> (integer) 1
> > TTL mykey
> (integer) 10
> ```

🇻🇳 Ví dụ gốc của docs, đọc theo thứ tự: đặt TTL 10 giây → `TTL` trả về `10`; **`SET` đè lên làm TTL biến mất**, `TTL` trả về `-1` (nghĩa là không có TTL); `EXPIRE ... XX` thất bại (trả `0`) vì key lúc này không còn expiry; `EXPIRE ... NX` thành công (trả `1`) vì key đang không có expiry.

> [!tip] `SET key value EX seconds`
> Trong ví dụ trên, chính `SET` đã thổi bay TTL. Cách tránh là **đặt giá trị và TTL trong cùng một lệnh** thay vì hai lệnh rời:
> `SET key value EX 60`
> (Option `EX` của `SET` — trang EXPIRE này không mô tả `SET`, đây là ghi chú vận hành.)

### A5. Redis xoá key hết hạn như thế nào — quan trọng

Nhiều người tưởng key hết hạn là biến mất **ngay khoảnh khắc** TTL về 0. Không phải.

📖 **Nguyên văn**
> "Redis keys are expired in two ways: a passive way and an active way.
>
> A key is passively expired when a client tries to access it and the key is timed out.
>
> However, this is not enough as there are expired keys that will never be accessed again.
> These keys should be expired anyway, so periodically, Redis tests a few keys at random amongst the set of keys with an expiration.
> All the keys that are already expired are deleted from the keyspace."

🇻🇳 **Dịch**
> "Key trong Redis hết hạn theo hai cách: cách **thụ động** (passive) và cách **chủ động** (active).
>
> Một key hết hạn theo cách thụ động khi có client thử truy cập nó và key đã quá hạn.
>
> Tuy nhiên như thế là chưa đủ, vì có những key đã hết hạn mà sẽ **không bao giờ được truy cập lại nữa**.
> Những key đó dù sao cũng phải được cho hết hạn, nên **định kỳ** Redis kiểm tra **một vài key lấy ngẫu nhiên** trong tập các key có expiration.
> Tất cả những key nào đã hết hạn đều bị xoá khỏi keyspace."

💡 **Ví dụ đời sống**
Tủ lạnh nhà bạn có hai cơ chế dọn đồ hết hạn:
- **Thụ động**: bạn với tay lấy hộp sữa, nhìn hạn thấy quá date → vứt ngay lúc đó. Không đụng tới thì nó vẫn nằm im trong tủ.
- **Chủ động**: cuối tuần bạn mở tủ, bốc đại vài hộp ra xem hạn, cái nào quá thì bỏ. Bạn không kiểm tra *toàn bộ* tủ — chỉ vài món ngẫu nhiên, vì quét sạch cả tủ mỗi lần thì quá tốn công.

Hệ quả thực tế: **một key đã hết hạn vẫn có thể đang chiếm RAM** cho tới khi ai đó chạm vào nó, hoặc tới khi vòng quét ngẫu nhiên bốc trúng nó. TTL đảm bảo bạn **không đọc được dữ liệu cũ**, nó không đảm bảo RAM được giải phóng tức thì.

### A6. Độ chính xác của expiration

📖 **Nguyên văn**
> "In Redis 2.4 the expire might not be pin-point accurate, and it could be between zero to one seconds out.
>
> Since Redis 2.6 the expire error is from 0 to 1 milliseconds."

🇻🇳 **Dịch**
> "Ở Redis 2.4, expire có thể không chính xác tuyệt đối, và có thể sai lệch từ 0 đến 1 giây.
>
> Từ Redis 2.6 trở đi, sai số của expire là từ 0 đến 1 millisecond."

### A7. Expire chạy theo đồng hồ máy — cẩn thận

📖 **Nguyên văn**
> "Keys expiring information is stored as absolute Unix timestamps (in milliseconds in case of Redis version 2.6 or greater).
> This means that the time is flowing even when the Redis instance is not active.
>
> For expires to work well, the computer time must be taken stable.
> If you move an RDB file from two computers with a big desync in their clocks, funny things may happen (like all the keys loaded to be expired at loading time)."

🇻🇳 **Dịch**
> "Thông tin hết hạn của key được lưu dưới dạng **Unix timestamp tuyệt đối** (tính bằng millisecond với Redis từ 2.6 trở lên).
> Điều này nghĩa là thời gian vẫn trôi **ngay cả khi Redis instance không chạy**.
>
> Để expire hoạt động tốt, đồng hồ máy phải ổn định.
> Nếu bạn chuyển một file RDB giữa hai máy có đồng hồ lệch nhau nhiều, những chuyện kỳ quặc có thể xảy ra (kiểu như toàn bộ key vừa nạp lên đã hết hạn ngay lúc load)."

---

## Phần B — Eviction: hết RAM thì bỏ key nào

Đây là phần cốt lõi nhất khi dùng Redis làm cache.

### B1. Vì sao evict được

📖 **Nguyên văn**
> "Redis is commonly used as a cache to speed up read accesses to a slower server or database. Since cache entries are copies of persistently-stored data, it is usually safe to evict them when the cache runs out of memory (they can be cached again in the future if necessary)."

🇻🇳 **Dịch**
> "Redis thường được dùng làm cache để tăng tốc truy cập đọc tới một server hoặc database chậm hơn. Vì các mục trong cache là **bản sao** của dữ liệu đã được lưu bền vững, nên nhìn chung có thể **evict (đuổi) chúng một cách an toàn** khi cache hết bộ nhớ (sau này cần thì cache lại được)."

Đây chính là mệnh đề nền tảng đã nói ở [[01 - Caching là gì]]: cache là bản sao, nguồn chân lý nằm ở nơi khác.

📖 **Nguyên văn**
> "Redis lets you specify an eviction policy to evict keys automatically when the size of the cache exceeds a set memory limit. Whenever a client runs a new command that adds more data to the cache, Redis checks the memory usage.
> If it is greater than the limit, Redis evicts keys according to the chosen eviction policy until the total memory used is back below the limit."

🇻🇳 **Dịch**
> "Redis cho phép bạn chỉ định một **eviction policy** để tự động đuổi key khi kích thước cache vượt quá giới hạn bộ nhớ đã đặt. Mỗi khi một client chạy một lệnh mới làm thêm dữ liệu vào cache, Redis kiểm tra mức sử dụng bộ nhớ.
> Nếu nó lớn hơn giới hạn, Redis sẽ evict key theo eviction policy đã chọn cho tới khi tổng bộ nhớ dùng quay lại dưới giới hạn."

Lưu ý quan trọng của docs: *"when a command adds a lot of data to the cache (for example, a big set intersection stored into a new key), this might temporarily exceed the limit by a large amount"* — 🇻🇳 một lệnh ghi rất nhiều dữ liệu cùng lúc có thể khiến bộ nhớ **tạm thời vượt giới hạn một lượng lớn**.

### B2. `maxmemory`

📖 **Nguyên văn**
> "The maxmemory configuration directive specifies the maximum amount of memory to use for the cache data. You can set maxmemory with the redis.conf file at startup time. For example, to configure a memory limit of 100 megabytes, you can use the following directive inside redis.conf:
>
> ```
> maxmemory 100mb
> ```
>
> You can also use CONFIG SET to set maxmemory at runtime using redis-cli:
>
> ```
> > CONFIG SET maxmemory 100mb
> ```
>
> Set maxmemory to zero to specify that you don't want to limit the memory for the dataset. This is the default behavior for 64-bit systems, while 32-bit systems use an implicit memory limit of 3GB."

🇻🇳 **Dịch**
> "Directive cấu hình `maxmemory` chỉ định **lượng bộ nhớ tối đa dùng cho dữ liệu cache**. Bạn có thể đặt `maxmemory` trong file `redis.conf` lúc khởi động. Ví dụ, để cấu hình giới hạn 100 megabyte, dùng directive sau trong `redis.conf`:
> `maxmemory 100mb`
> Bạn cũng có thể dùng `CONFIG SET` để đặt `maxmemory` lúc đang chạy qua `redis-cli`:
> `> CONFIG SET maxmemory 100mb`
> Đặt `maxmemory` bằng 0 nghĩa là bạn **không muốn giới hạn** bộ nhớ cho dataset. Đây là hành vi mặc định trên hệ 64-bit, còn hệ 32-bit dùng giới hạn ngầm định 3GB."

> [!warning] Mặc định trên 64-bit là KHÔNG giới hạn
> Nghĩa là nếu bạn cài Redis rồi dùng làm cache mà **không đặt `maxmemory`**, nó sẽ ăn RAM tới khi hệ điều hành ra tay. Đặt `maxmemory` là bước đầu tiên của việc "dùng Redis làm cache thực sự".

### B3. Chừa RAM cho buffer khi có replication/persistence

📖 **Nguyên văn**
> "If you are using replication or persistence for a server, Redis will use some RAM as a buffer to store the set of updates waiting to be written to the replicas or AOF files.
> The memory used by this buffer is not included in the total that is compared to maxmemory to see if eviction is required."

🇻🇳 **Dịch**
> "Nếu bạn dùng **replication** hoặc **persistence** cho một server, Redis sẽ dùng một phần RAM làm **buffer** để chứa tập các update đang chờ ghi xuống replica hoặc file AOF.
> Bộ nhớ mà buffer này dùng **không được tính** vào tổng số đem so với `maxmemory` để quyết định có cần evict hay không."

Docs khuyến nghị nguyên văn: *"we recommend that you set maxmemory to leave a little RAM free to store the buffers"* — 🇻🇳 đặt `maxmemory` sao cho chừa lại một chút RAM trống để chứa các buffer.

### B4. Bảng các eviction policy

Chọn bằng directive `maxmemory-policy`.

📖 **Nguyên văn**
> "Use the maxmemory-policy configuration directive to select the eviction policy you want to use when the limit set by maxmemory is reached.
> The following policies are available:
>
> noeviction: Keys are not evicted but the server will return an error when you try to execute commands that cache new data. If your database uses replication then this condition only applies to the primary database. Note that commands that only read existing data still work as normal.
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
> volatile-ttl: Evict keys with an associated expiration (TTL) that have the shortest remaining TTL value."

🇻🇳 **Dịch**
> "Dùng directive cấu hình `maxmemory-policy` để chọn eviction policy bạn muốn dùng khi chạm giới hạn `maxmemory`.
> Các policy sau đây có sẵn:
> `noeviction`: Key **không** bị evict, nhưng server sẽ **trả về lỗi** khi bạn thử chạy các lệnh cache thêm dữ liệu mới. Nếu database của bạn dùng replication thì điều kiện này chỉ áp dụng cho database chính. Lưu ý rằng các lệnh chỉ **đọc** dữ liệu sẵn có vẫn hoạt động bình thường.
> `allkeys-lru`: Evict các key **ít được dùng gần đây nhất** (LRU).
> `allkeys-lrm`: Evict các key **ít được sửa gần đây nhất** (LRM).
> `allkeys-lfu`: Evict các key **ít được dùng thường xuyên nhất** (LFU).
> `allkeys-random`: Evict key **ngẫu nhiên**.
> `volatile-lru`: Evict các key ít được dùng gần đây nhất **trong số các key có gắn expiration (TTL)**.
> `volatile-lrm`: Evict các key ít được sửa gần đây nhất trong số các key có gắn expiration (TTL).
> `volatile-lfu`: Evict các key ít được dùng thường xuyên nhất trong số các key có gắn expiration (TTL).
> `volatile-random`: Evict key ngẫu nhiên trong số các key có gắn expiration (TTL).
> `volatile-ttl`: Evict các key có gắn expiration (TTL) mà có **TTL còn lại ngắn nhất**."

Tóm lại thành bảng — cột "Phạm vi" là tập key mà policy được phép đụng vào:

| Policy | Phạm vi | Tiêu chí bỏ key |
|---|---|---|
| `noeviction` | — | Không bỏ gì; báo lỗi khi ghi thêm |
| `allkeys-lru` | Mọi key | Ít được **dùng** gần đây nhất |
| `allkeys-lrm` | Mọi key | Ít được **sửa** gần đây nhất |
| `allkeys-lfu` | Mọi key | Ít được dùng **thường xuyên** nhất |
| `allkeys-random` | Mọi key | Ngẫu nhiên |
| `volatile-lru` | Chỉ key có TTL | Ít được dùng gần đây nhất |
| `volatile-lrm` | Chỉ key có TTL | Ít được sửa gần đây nhất |
| `volatile-lfu` | Chỉ key có TTL | Ít được dùng thường xuyên nhất |
| `volatile-random` | Chỉ key có TTL | Ngẫu nhiên |
| `volatile-ttl` | Chỉ key có TTL | TTL còn lại **ngắn nhất** |

> [!note] `allkeys-lrm` / `volatile-lrm` là mới
> Docs ghi rõ: *"Starting with Redis 8.6, the Least Recently Modified (LRM) eviction policy is available."* — Nếu bạn chạy Redis cũ hơn thì chỉ có 8 policy còn lại. Đừng cấu hình `lrm` trên bản cũ.

💡 **Ví dụ đời sống — tủ lạnh đầy**
Tủ lạnh đã đầy ắp mà bạn vừa đi chợ về, phải bỏ bớt món gì. Mỗi eviction policy là một *triết lý dọn tủ*:

- **`allkeys-lru`** — "món nào lâu nhất chưa ai đụng tới thì bỏ". Hộp pate mua 3 tuần trước, không ai mở, ra đi. Đây là bản năng tự nhiên nhất của con người.
- **`allkeys-lfu`** — "món nào **ít khi** được ăn thì bỏ". Lọ mù tạt hôm qua vừa dùng một lần, nhưng cả năm chỉ dùng 2 lần → vẫn bỏ. Trong khi hộp sữa tuần nào cũng uống, dù hôm nay chưa đụng, thì giữ. LFU nhìn **thói quen dài hạn**, LRU chỉ nhìn **lần chạm cuối**.
- **`allkeys-lrm`** — "món nào lâu rồi không được **bổ sung/thay mới** thì bỏ", kể cả bạn hay mở ra ngắm. Phân biệt "đọc" với "ghi".
- **`volatile-ttl`** — "món nào **sắp hết hạn nhất** thì bỏ trước". Hộp sữa còn 1 ngày date ra đi trước hộp còn 2 tuần.
- **`allkeys-random`** — nhắm mắt bốc đại một món ném đi. Nghe ngu ngốc, nhưng nếu mọi món trong tủ đều được ăn đều như nhau thì cách này vừa công bằng vừa rẻ (không phải nhớ ai ăn gì lúc nào).
- **`volatile-*`** — "chỉ được bỏ những món **có dán nhãn ngày hết hạn**". Món không dán nhãn (không TTL) là bất khả xâm phạm.
- **`noeviction`** — "không bỏ gì cả; tủ đầy thì đi chợ về cứ để ngoài, không nhét vào được nữa". Tức là báo lỗi.

### B5. ⚠️ Cái bẫy lớn nhất: `volatile-*` khi không key nào có TTL

📖 **Nguyên văn**
> "The volatile-xxx policies behave like noeviction if no keys have an associated expiration."

🇻🇳 **Dịch**
> "Các policy `volatile-xxx` sẽ **hành xử giống như `noeviction`** nếu không có key nào gắn expiration."

> [!danger] Cấu hình đúng vẫn chết
> Bạn đặt `maxmemory 2gb` và `maxmemory-policy volatile-lru`, yên tâm rằng "hết RAM thì Redis tự dọn". Nhưng nếu code của bạn set key **không kèm TTL** (nhớ mục A2: một lệnh `SET` trần là đủ để thổi bay TTL), thì tập key-có-TTL rỗng → Redis **không có gì để evict** → nó rơi về hành vi `noeviction` → **mọi lệnh ghi bắt đầu trả lỗi**.
>
> Triệu chứng nhìn từ ứng dụng: Redis vẫn `PING` được, `GET` vẫn chạy bình thường (docs: *"commands that only read existing data still work as normal"*), chỉ có ghi là fail. Rất dễ chẩn đoán nhầm.
>
> Với cache thuần, `allkeys-lru` an toàn hơn vì nó luôn có key để đuổi.

📖 **Nguyên văn**
> "The volatile-lru, volatile-lrm, and volatile-random policies are mainly useful when you want to use a single Redis instance for both caching and for a set of persistent keys. However, you should consider running two separate Redis instances in a case like this, if possible.
>
> Also note that setting an expire value for a key costs memory, so a policy like allkeys-lru is more memory efficient since it doesn't need an expire value to operate."

🇻🇳 **Dịch**
> "Các policy `volatile-lru`, `volatile-lrm` và `volatile-random` chủ yếu hữu ích khi bạn muốn dùng **một instance Redis duy nhất cho cả việc cache lẫn một tập key cần giữ lâu dài**. Tuy nhiên, trong trường hợp như vậy bạn nên cân nhắc chạy **hai instance Redis riêng biệt**, nếu có thể.
>
> Cũng lưu ý rằng việc đặt giá trị expire cho một key **tốn bộ nhớ**, nên một policy như `allkeys-lru` tiết kiệm bộ nhớ hơn vì nó không cần giá trị expire để hoạt động."

### B6. Chọn policy nào — khuyến nghị của docs

📖 **Nguyên văn**
> "As a rule of thumb:
>
> Use allkeys-lru when you expect that a subset of elements will be accessed far more often than the rest. This is a very common case according to the Pareto principle, so allkeys-lru is a good default option if you have no reason to prefer any others.
>
> Use allkeys-random when you expect all keys to be accessed with roughly equal frequency. An example of this is when your app reads data items in a repeating cycle.
>
> Use volatile-ttl if your code can estimate which keys are good candidates for eviction and assign short TTLs to them. Note also that if you make good use of key expiration, then you are less likely to run into the cache memory limit because keys will often expire before they need to be evicted."

🇻🇳 **Dịch**
> "Theo kinh nghiệm chung:
>
> Dùng `allkeys-lru` khi bạn dự đoán một **tập con** phần tử sẽ được truy cập nhiều hơn hẳn phần còn lại. Đây là trường hợp rất phổ biến theo **nguyên lý Pareto**, nên `allkeys-lru` là lựa chọn mặc định tốt nếu bạn không có lý do nào để ưu tiên cái khác.
>
> Dùng `allkeys-random` khi bạn dự đoán mọi key được truy cập với tần suất **xấp xỉ bằng nhau**. Ví dụ là khi app đọc các mục dữ liệu theo một vòng lặp lặp lại.
>
> Dùng `volatile-ttl` nếu code của bạn có thể ước lượng được key nào là ứng viên tốt để evict và gán TTL ngắn cho chúng. Cũng lưu ý rằng nếu bạn tận dụng key expiration tốt thì **ít khả năng chạm giới hạn bộ nhớ cache** hơn, vì key thường sẽ hết hạn trước khi cần bị evict."

(Docs còn một mục nữa cho `allkeys-lrm`: dùng khi muốn giữ dữ liệu được đọc nhiều nhưng đuổi dữ liệu lâu không được sửa.)

### B7. Đo bằng `INFO`

📖 **Nguyên văn**
> "the INFO stats section includes two important entries, keyspace_hits (the number of times keys were successfully found in the cache) and keyspace_misses (the number of times a key was requested but was not in the cache). The calculation below gives the percentage of attempted accesses that were satisfied from the cache:
>
> ```
> keyspace_hits / (keyspace_hits + keyspace_misses) * 100
> ```"

🇻🇳 **Dịch**
> "phần `INFO stats` bao gồm hai mục quan trọng: `keyspace_hits` (số lần key được tìm thấy thành công trong cache) và `keyspace_misses` (số lần một key được yêu cầu nhưng không có trong cache). Phép tính dưới đây cho ra **phần trăm số lần truy cập được phục vụ từ cache**:
> `keyspace_hits / (keyspace_hits + keyspace_misses) * 100`"

Các chỉ số khác docs nêu, dùng để chẩn đoán (dịch sát từ docs):

- `used_memory_dataset` (phần memory) — lượng bộ nhớ dùng cho dữ liệu cache; lớn hơn `maxmemory` bao nhiêu thì đó là mức đã vượt.
- `current_eviction_exceeded_time` (phần stats) — thời gian kể từ lần cuối cache bắt đầu vượt `maxmemory`.
- Phần `commandstats` — báo cáo **số lần mỗi lệnh bị từ chối**. Docs viết: *"If you are using noeviction or one of the volatile_xxx policies, you can use this to find which commands are being stopped by the maxmemory limit and how often it is happening."*
- `evicted_keys`, `expired_keys` (phần stats) — số key bị evict và số key đã hết hạn.

> [!tip] Đúng chỗ để soi cái bẫy B5
> Nếu nghi ngờ dính bẫy `volatile-*` + không key nào có TTL, `commandstats` chính là nơi nhìn thấy số lệnh ghi bị reject.

### B8. LRU của Redis là **xấp xỉ**, không chính xác

Điểm rất nhiều người không biết.

📖 **Nguyên văn**
> "The Redis LRU algorithm uses an approximation of the least recently used keys rather than calculating them exactly. It samples a small number of keys at random and then evicts the ones with the longest time since last access.
>
> From Redis 3.0 onwards, the algorithm also tracks a pool of good candidates for eviction. This improves the performance of the algorithm, making it a close approximation to a true LRU algorithm.
>
> (Redis Open Source only) You can tune the performance of the algorithm by changing the number of samples to check before every eviction with the maxmemory-samples configuration directive:
>
> ```
> maxmemory-samples 5
> ```"

🇻🇳 **Dịch**
> "Thuật toán LRU của Redis dùng một phép **xấp xỉ** tập key ít dùng gần đây nhất, chứ không tính chính xác. Nó **lấy mẫu ngẫu nhiên một số nhỏ key** rồi evict những key có thời gian kể từ lần truy cập cuối là dài nhất.
>
> Từ Redis 3.0 trở đi, thuật toán còn theo dõi thêm một **pool các ứng viên tốt** để evict. Điều này cải thiện hiệu năng của thuật toán, khiến nó xấp xỉ rất sát một thuật toán LRU thật.
>
> (Chỉ áp dụng cho Redis Open Source) Bạn có thể tinh chỉnh hiệu năng của thuật toán bằng cách thay đổi **số lượng mẫu** cần kiểm tra trước mỗi lần evict, qua directive cấu hình `maxmemory-samples`:
> `maxmemory-samples 5`"

📖 **Nguyên văn**
> "The reason Redis does not use a true LRU implementation is because it costs more memory. However, the approximation is virtually equivalent for an application using Redis."

🇻🇳 **Dịch**
> "Lý do Redis không dùng một cài đặt LRU thật là vì nó **tốn thêm bộ nhớ**. Tuy nhiên, với một ứng dụng dùng Redis thì phép xấp xỉ này gần như tương đương."

📖 **Nguyên văn**
> "However you can raise the sample size to 10 at the cost of some additional CPU usage to closely approximate true LRU, and check if this makes a difference in your cache misses rate."

🇻🇳 **Dịch**
> "Tuy nhiên bạn có thể nâng kích thước mẫu lên 10, đánh đổi bằng chút CPU, để xấp xỉ sát LRU thật hơn, và kiểm tra xem điều đó có tạo khác biệt trong tỉ lệ cache miss của bạn không."

💡 **Ví dụ đời sống**
Tủ lạnh có 200 món. Để chọn "món lâu nhất chưa ai đụng" một cách *chính xác*, bạn phải ghi sổ ngày giờ mỗi lần ai mở mỗi món — tốn giấy mực (= tốn RAM). Redis làm khác: **bốc ngẫu nhiên 5 món ra so**, món nào cũ nhất trong 5 món đó thì bỏ. Có thể bỏ nhầm món hơi mới? Có. Nhưng rẻ hơn nhiều, và nếu đúng là có vài món ai cũng ăn còn phần lớn thì không, thì bốc 5 món ngẫu nhiên gần như chắc chắn trúng nhóm "ít ai đụng". Bốc 10 món thì chính xác hơn nhưng mất công hơn — đúng nghĩa `maxmemory-samples`.

### B9. LFU và các tham số

📖 **Nguyên văn**
> "Starting with Redis 4.0, the Least Frequently Used eviction mode is available. This mode may work better (provide a better hits/misses ratio) in certain cases. In LFU mode, Redis will try to track the frequency of access of items, so the ones used rarely are evicted. This means the keys used often have a higher chance of remaining in memory."

🇻🇳 **Dịch**
> "Từ Redis 4.0 trở đi, chế độ eviction **Least Frequently Used** có sẵn. Chế độ này có thể hoạt động tốt hơn (cho tỉ lệ hit/miss tốt hơn) trong một số trường hợp. Ở chế độ LFU, Redis sẽ cố theo dõi **tần suất truy cập** của các mục, để những mục ít khi được dùng bị evict. Nghĩa là các key hay được dùng có cơ hội ở lại bộ nhớ cao hơn."

📖 **Nguyên văn**
> "LFU is approximated like LRU: it uses a probabilistic counter, called a Morris counter to estimate the object access frequency using just a few bits per object, combined with a decay period so that the counter is reduced over time. At some point we no longer want to consider keys as frequently accessed, even if they were in the past, so that the algorithm can adapt to a shift in the access pattern."

🇻🇳 **Dịch**
> "LFU cũng là **xấp xỉ** giống LRU: nó dùng một bộ đếm xác suất gọi là **Morris counter** để ước lượng tần suất truy cập của object chỉ với vài bit cho mỗi object, kết hợp với một **decay period** để bộ đếm giảm dần theo thời gian. Tới một lúc nào đó ta không còn muốn coi các key là "được truy cập thường xuyên" nữa, dù trong quá khứ chúng từng như vậy, để thuật toán có thể **thích nghi khi pattern truy cập thay đổi**."

📖 **Nguyên văn**
> "By default Redis is configured to:
>
> Saturate the counter at, around, one million requests.
>
> Decay the counter every one minute.
>
> Those should be reasonable values and were tested experimentally, but the user may want to play with these configuration settings to pick optimal values."

🇻🇳 **Dịch**
> "Mặc định Redis được cấu hình để:
> Bão hoà bộ đếm ở khoảng **một triệu request**.
> Giảm (decay) bộ đếm **mỗi một phút**.
> Đó là những giá trị hợp lý và đã được kiểm nghiệm thực nghiệm, nhưng người dùng có thể muốn chỉnh các thiết lập này để chọn giá trị tối ưu."

📖 **Nguyên văn**
> ```
> lfu-log-factor 10
> lfu-decay-time 1
> ```
>
> "The decay time is the obvious one, it is the amount of minutes a counter should be decayed, when sampled and found to be older than that value. A special value of 0 means: we will never decay the counter.
>
> The counter logarithm factor changes how many hits are needed to saturate the frequency counter, which is just in the range 0-255. The higher the factor, the more accesses are needed to reach the maximum. The lower the factor, the better is the resolution of the counter for low accesses, according to the following table:"

🇻🇳 **Dịch**
> "`decay time` là cái dễ hiểu: là **số phút** mà một bộ đếm nên bị giảm đi, khi được lấy mẫu và thấy cũ hơn giá trị đó. Giá trị đặc biệt 0 nghĩa là: **không bao giờ decay** bộ đếm.
>
> `counter logarithm factor` thay đổi **cần bao nhiêu hit để bộ đếm tần suất bão hoà**, bộ đếm này chỉ nằm trong khoảng 0–255. Factor càng cao thì càng cần nhiều lần truy cập để chạm mức tối đa. Factor càng thấp thì độ phân giải của bộ đếm ở vùng ít truy cập càng tốt, theo bảng dưới đây:"

📖 **Nguyên văn**
> ```
> +--------+------------+------------+------------+------------+------------+
> | factor | 100 hits   | 1000 hits  | 100K hits  | 1M hits    | 10M hits   |
> +--------+------------+------------+------------+------------+------------+
> | 0      | 104        | 255        | 255        | 255        | 255        |
> +--------+------------+------------+------------+------------+------------+
> | 1      | 18         | 49         | 255        | 255        | 255        |
> +--------+------------+------------+------------+------------+------------+
> | 10     | 10         | 18         | 142        | 255        | 255        |
> +--------+------------+------------+------------+------------+------------+
> | 100    | 8          | 11         | 49         | 143        | 255        |
> +--------+------------+------------+------------+------------+------------+
> ```

🇻🇳 Bảng gốc của docs: mỗi ô là **giá trị bộ đếm** đạt được sau số lần hit ở cột, ứng với `lfu-log-factor` ở hàng. Đọc hàng `factor 0`: chỉ 1000 hit là đã kịch trần 255 — không phân biệt nổi key 1000 hit với key 10 triệu hit. Đọc hàng `factor 100`: tới 1 triệu hit mới đạt 143, vẫn còn dư địa phân biệt. Docs kết: *"the factor is a trade off between better distinguishing items with low accesses VS distinguishing items with high accesses"* — factor là đánh đổi giữa phân giải tốt ở vùng ít truy cập và ở vùng nhiều truy cập.

---

## Phần C — Persistence: dữ liệu có xuống đĩa không

### C1. Bốn lựa chọn

📖 **Nguyên văn**
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
> "Persistence nghĩa là việc ghi dữ liệu xuống **bộ nhớ bền vững**, ví dụ ổ SSD. Redis cung cấp một dải các lựa chọn persistence, bao gồm:
>
> **RDB (Redis Database)**: persistence kiểu RDB tạo các **snapshot tại một thời điểm** của dataset theo những khoảng thời gian đã định.
>
> **AOF (Append Only File)**: persistence kiểu AOF **ghi log mọi thao tác ghi** mà server nhận được. Các thao tác này sau đó có thể được **phát lại** lúc server khởi động, tái dựng lại dataset ban đầu. Lệnh được ghi log bằng đúng định dạng của chính Redis protocol.
>
> **Không persistence**: Bạn có thể tắt hoàn toàn persistence. Cách này **đôi khi được dùng khi làm cache**.
>
> **RDB + AOF**: Bạn cũng có thể kết hợp cả AOF và RDB trong cùng một instance."

### C2. RDB — ưu điểm

📖 **Nguyên văn**
> "RDB is a very compact single-file point-in-time representation of your Redis data. RDB files are perfect for backups. For instance you may want to archive your RDB files every hour for the latest 24 hours, and to save an RDB snapshot every day for 30 days. This allows you to easily restore different versions of the data set in case of disasters.
>
> RDB is very good for disaster recovery, being a single compact file that can be transferred to far data centers, or onto Amazon S3 (possibly encrypted).
>
> RDB maximizes Redis performances since the only work the Redis parent process needs to do in order to persist is forking a child that will do all the rest. The parent process will never perform disk I/O or alike.
>
> RDB allows faster restarts with big datasets compared to AOF.
>
> On replicas, RDB supports partial resynchronizations after restarts and failovers."

🇻🇳 **Dịch**
> "RDB là một biểu diễn **một-file, rất gọn, tại một thời điểm** của dữ liệu Redis. File RDB rất hợp để backup. Ví dụ bạn có thể lưu trữ file RDB mỗi giờ cho 24 giờ gần nhất, và lưu một snapshot RDB mỗi ngày trong 30 ngày. Nhờ đó dễ dàng khôi phục các phiên bản khác nhau của dataset khi có thảm hoạ.
>
> RDB rất tốt cho **disaster recovery**, vì là một file gọn duy nhất có thể chuyển tới data center ở xa, hoặc lên Amazon S3 (có thể mã hoá).
>
> RDB **tối đa hoá hiệu năng Redis** vì việc duy nhất mà tiến trình cha của Redis phải làm để persist là **fork ra một tiến trình con** lo hết phần còn lại. Tiến trình cha **không bao giờ** phải làm disk I/O hay tương tự.
>
> RDB cho phép **khởi động lại nhanh hơn** so với AOF khi dataset lớn.
>
> Trên replica, RDB hỗ trợ **partial resynchronization** sau khi restart và failover."

### C3. RDB — nhược điểm

📖 **Nguyên văn**
> "RDB is NOT good if you need to minimize the chance of data loss in case Redis stops working (for example after a power outage). You can configure different save points where an RDB is produced (for instance after at least five minutes and 100 writes against the data set, you can have multiple save points). However you'll usually create an RDB snapshot every five minutes or more, so in case of Redis stopping working without a correct shutdown for any reason you should be prepared to lose the latest minutes of data.
>
> RDB needs to fork() often in order to persist on disk using a child process. fork() can be time consuming if the dataset is big, and may result in Redis stopping serving clients for some milliseconds or even for one second if the dataset is very big and the CPU performance is not great. AOF also needs to fork() but less frequently and you can tune how often you want to rewrite your logs without any trade-off on durability."

🇻🇳 **Dịch**
> "RDB **KHÔNG** tốt nếu bạn cần giảm thiểu khả năng mất dữ liệu khi Redis ngừng hoạt động (ví dụ sau khi mất điện). Bạn có thể cấu hình nhiều **save point** khác nhau để sinh RDB (ví dụ sau ít nhất năm phút và 100 lần ghi vào dataset; có thể có nhiều save point). Tuy nhiên bạn thường sẽ tạo snapshot RDB mỗi năm phút hoặc lâu hơn, nên nếu Redis ngừng hoạt động mà không shutdown đúng cách vì bất kỳ lý do gì, bạn phải **chuẩn bị tinh thần mất dữ liệu của vài phút gần nhất**.
>
> RDB cần `fork()` thường xuyên để persist xuống đĩa bằng tiến trình con. `fork()` có thể tốn thời gian nếu dataset lớn, và có thể khiến Redis **ngừng phục vụ client trong vài millisecond hoặc thậm chí một giây** nếu dataset rất lớn và CPU không mạnh. AOF cũng cần `fork()` nhưng ít thường xuyên hơn, và bạn có thể chỉnh tần suất rewrite log mà không phải đánh đổi gì về durability."

### C4. AOF — ưu điểm

📖 **Nguyên văn**
> "Using AOF Redis is much more durable: you can have different fsync policies: no fsync at all, fsync every second, fsync at every query. With the default policy of fsync every second, write performance is still great. fsync is performed using a background thread and the main thread will try hard to perform writes when no fsync is in progress, so you can only lose one second worth of writes.
>
> The AOF log is an append-only log, so there are no seeks, nor corruption problems if there is a power outage. Even if the log ends with a half-written command for some reason (disk full or other reasons) the redis-check-aof tool is able to fix it easily.
>
> Redis is able to automatically rewrite the AOF in background when it gets too big.
>
> AOF contains a log of all the operations one after the other in an easy to understand and parse format. You can even easily export an AOF file. For instance even if you've accidentally flushed everything using the FLUSHALL command, as long as no rewrite of the log was performed in the meantime, you can still save your data set just by stopping the server, removing the latest command, and restarting Redis again."

🇻🇳 **Dịch**
> "Dùng AOF thì Redis **bền vững hơn nhiều**: bạn có thể chọn các fsync policy khác nhau — không fsync gì cả, fsync mỗi giây, fsync ở mọi query. Với policy mặc định là fsync mỗi giây, hiệu năng ghi vẫn rất tốt. `fsync` được thực hiện bằng một **background thread** và main thread sẽ cố hết sức để thực hiện các lần ghi khi không có `fsync` nào đang chạy, nên bạn **chỉ có thể mất khối lượng ghi của một giây**.
>
> AOF log là một log **chỉ ghi thêm** (append-only), nên không có thao tác seek, cũng không có vấn đề hỏng file khi mất điện. Kể cả nếu log kết thúc bằng một lệnh ghi dở vì lý do nào đó (đầy đĩa hoặc lý do khác) thì công cụ `redis-check-aof` có thể sửa dễ dàng.
>
> Redis có thể **tự động rewrite AOF ở background** khi nó phình quá to.
>
> AOF chứa log của tất cả thao tác lần lượt nối nhau ở định dạng **dễ hiểu và dễ parse**. Bạn thậm chí có thể export một file AOF dễ dàng. Ví dụ ngay cả khi bạn lỡ tay `FLUSHALL` xoá sạch mọi thứ, miễn là trong lúc đó chưa có lần rewrite log nào xảy ra, bạn vẫn có thể cứu dataset chỉ bằng cách dừng server, **xoá lệnh cuối cùng đi**, rồi khởi động lại Redis."

### C5. AOF — nhược điểm

📖 **Nguyên văn**
> "AOF files are usually bigger than the equivalent RDB files for the same dataset.
>
> AOF can be slower than RDB depending on the exact fsync policy. In general with fsync set to every second performance is still very high, and with fsync disabled it should be exactly as fast as RDB even under high load. Still RDB is able to provide more guarantees about the maximum latency even in the case of a huge write load."

🇻🇳 **Dịch**
> "File AOF thường **lớn hơn** file RDB tương đương cho cùng một dataset.
>
> AOF có thể **chậm hơn** RDB tuỳ vào fsync policy cụ thể. Nhìn chung với fsync đặt ở mức mỗi giây thì hiệu năng vẫn rất cao, và với fsync tắt hẳn thì nó nhanh đúng bằng RDB ngay cả dưới tải lớn. Dù vậy RDB vẫn cho **đảm bảo tốt hơn về độ trễ tối đa**, kể cả trong trường hợp tải ghi khổng lồ."

### C6. Bảng so sánh RDB vs AOF

Tổng hợp từ đúng các đoạn C2–C5 ở trên:

| Tiêu chí | RDB (snapshot) | AOF (append-only file) |
|---|---|---|
| Bản chất | Ảnh chụp dataset tại một thời điểm | Log mọi thao tác ghi, phát lại khi khởi động |
| Rủi ro mất dữ liệu | Mất dữ liệu "vài phút gần nhất" nếu shutdown không sạch | Với `everysec`, chỉ mất khối lượng ghi của 1 giây |
| Kích thước file | Rất gọn, một file | Thường lớn hơn RDB cho cùng dataset |
| Backup / disaster recovery | "Perfect for backups", dễ chuyển đi xa / lên S3 | Vẫn backup được nhưng cồng kềnh hơn |
| Tốc độ khởi động lại (dataset lớn) | Nhanh hơn AOF | Chậm hơn |
| Ảnh hưởng hiệu năng | Tiến trình cha không làm disk I/O; nhưng `fork()` thường xuyên có thể chặn phục vụ client "vài ms đến 1 giây" với dataset rất lớn | Có thể chậm hơn tuỳ fsync policy; `fork()` ít thường xuyên hơn |
| Đảm bảo latency tối đa | Tốt hơn khi tải ghi lớn | Kém hơn |
| Chống hỏng file | — | Append-only, không seek; `redis-check-aof` sửa được lệnh ghi dở |
| Cứu nhầm lẫn kiểu `FLUSHALL` | Không | Có (nếu chưa rewrite) |

### C7. Docs khuyên dùng cái nào

📖 **Nguyên văn**
> "The general indication you should use both persistence methods is if you want a degree of data safety comparable to what PostgreSQL can provide you.
>
> If you care a lot about your data, but still can live with a few minutes of data loss in case of disasters, you can simply use RDB alone.
>
> There are many users using AOF alone, but we discourage it since to have an RDB snapshot from time to time is a great idea for doing database backups, for faster restarts, and in the event of bugs in the AOF engine."

🇻🇳 **Dịch**
> "Chỉ dẫn chung là bạn nên dùng **cả hai** phương pháp persistence nếu muốn mức an toàn dữ liệu **tương đương những gì PostgreSQL có thể cho bạn**.
>
> Nếu bạn quan tâm nhiều tới dữ liệu, nhưng vẫn chấp nhận được việc mất vài phút dữ liệu khi có thảm hoạ, bạn có thể chỉ dùng RDB.
>
> Có nhiều người dùng chỉ dùng AOF, nhưng chúng tôi **không khuyến khích** điều đó, vì có một snapshot RDB thỉnh thoảng là ý tưởng rất tốt cho việc backup database, cho khởi động lại nhanh hơn, và phòng khi có bug trong AOF engine."

> [!note] Liên hệ ACID
> Câu "tương đương những gì PostgreSQL có thể cho bạn" đáng chú ý: nó ngầm thừa nhận rằng **mặc định Redis không cho mức đảm bảo đó**. Xem [[05 - Transactions, ACID và MVCC]] — chữ **D (Durability)** trong ACID ở RDBMS nghĩa là commit xong thì dữ liệu chắc chắn còn. Redis với `appendfsync everysec` chỉ hứa "mất tối đa 1 giây". Đây là lý do **Redis không phải RDBMS** và không nên là nơi lưu nguồn chân lý.

### C8. `appendfsync` — ba mức

📖 **Nguyên văn**
> "You can configure how many times Redis will fsync data on disk. There are three options:
>
> appendfsync always: fsync every time new commands are appended to the AOF. Very very slow, very safe. Note that the commands are appended to the AOF after a batch of commands from multiple clients or a pipeline are executed, so it means a single write and a single fsync (before sending the replies).
>
> appendfsync everysec: fsync every second. Fast enough (since version 2.4 likely to be as fast as snapshotting), and you may lose 1 second of data if there is a disaster.
>
> appendfsync no: Never fsync, just put your data in the hands of the Operating System. The faster and less safe method. Normally Linux will flush data every 30 seconds with this configuration, but it's up to the kernel's exact tuning.
>
> The suggested (and default) policy is to fsync every second. It is both fast and relatively safe."

🇻🇳 **Dịch**
> "Bạn có thể cấu hình Redis `fsync` dữ liệu xuống đĩa bao nhiêu lần. Có ba lựa chọn:
>
> `appendfsync always`: `fsync` **mỗi khi** có lệnh mới được append vào AOF. **Rất rất chậm, rất an toàn.** Lưu ý rằng các lệnh được append vào AOF sau khi một lô lệnh từ nhiều client hoặc một pipeline được thực thi, nên nó có nghĩa là một lần write và một lần `fsync` (trước khi gửi reply).
>
> `appendfsync everysec`: `fsync` **mỗi giây**. Đủ nhanh (từ phiên bản 2.4 thì nhiều khả năng nhanh ngang snapshotting), và bạn **có thể mất 1 giây dữ liệu** nếu có thảm hoạ.
>
> `appendfsync no`: **Không bao giờ** `fsync`, cứ giao dữ liệu vào tay hệ điều hành. Cách nhanh nhất và kém an toàn nhất. Bình thường Linux sẽ flush dữ liệu mỗi 30 giây với cấu hình này, nhưng còn tuỳ vào tinh chỉnh cụ thể của kernel.
>
> Policy được gợi ý (và mặc định) là `fsync` **mỗi giây**. Nó vừa nhanh vừa tương đối an toàn."

| Mức | Mất tối đa | Docs mô tả |
|---|---|---|
| `always` | ~0 | "Very very slow, very safe" |
| `everysec` (mặc định) | 1 giây dữ liệu | "Fast enough… relatively safe" |
| `no` | Tuỳ kernel (Linux thường flush mỗi 30s) | "The faster and less safe method" |

### C9. Kết hợp RDB + AOF

Docs cho biết Redis tự tránh để hai tiến trình nền cùng làm disk I/O nặng: *"Redis >= 2.4 makes sure to avoid triggering an AOF rewrite when an RDB snapshotting operation is already in progress, or allowing a BGSAVE while the AOF rewrite is in progress."* — 🇻🇳 không kích hoạt AOF rewrite khi đang chạy RDB snapshot, và không cho `BGSAVE` khi AOF rewrite đang chạy.

📖 **Nguyên văn**
> "In the case both AOF and RDB persistence are enabled and Redis restarts the AOF file will be used to reconstruct the original dataset since it is guaranteed to be the most complete."

🇻🇳 **Dịch**
> "Trong trường hợp bật cả AOF lẫn RDB và Redis khởi động lại, **file AOF sẽ được dùng** để tái dựng dataset ban đầu, vì nó được đảm bảo là **đầy đủ nhất**."

Về cấu hình snapshot, docs viết: *"You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the SAVE or BGSAVE commands."* — 🇻🇳 cấu hình lưu dataset mỗi N giây nếu có ít nhất M thay đổi, hoặc gọi thủ công `SAVE` / `BGSAVE`. File mặc định tên `dump.rdb`; ví dụ docs đưa ra là `save 60 1000` (dump nếu có ít nhất 1000 key đổi trong 60 giây).

### C10. ⚠️ Dùng Redis làm cache thuần thì có cần persistence không?

Docs có bàn trực tiếp, tuy rất ngắn:

📖 **Nguyên văn**
> "No persistence: You can disable persistence completely. This is sometimes used when caching."

🇻🇳 **Dịch**
> "**Không persistence**: Bạn có thể tắt hoàn toàn persistence. Cách này **đôi khi được dùng khi làm cache**."

> [!warning] Đây là một câu rất ngắn — phần dưới là nhận định, không phải trích docs
> Docs chỉ xác nhận "đôi khi được dùng khi làm cache", không đưa ra khuyến nghị dứt khoát cho trường hợp cache thuần. Suy luận dưới đây là **nhận định của người viết note**, dựa trên các sự kiện đã trích ở trên:
>
> - Nếu Redis chỉ chứa bản sao của dữ liệu có thể dựng lại từ database, thì mất toàn bộ nội dung khi restart chỉ gây **cache miss hàng loạt**, không mất dữ liệu. Đúng với mệnh đề đã trích ở B1: *"it is usually safe to evict them when the cache runs out of memory (they can be cached again in the future if necessary)"*.
> - Đánh đổi thật: tắt persistence thì tránh được chi phí `fork()` (mục C3) và chi phí `fsync` (C8), đồng thời **không cần chừa RAM cho buffer** (mục B3, docs khuyên chừa RAM khi bật persistence).
> - Mặt trái: sau restart, toàn bộ traffic dồn thẳng vào database cho tới khi cache ấm lại. Đây là rủi ro vận hành thật, không phải rủi ro mất dữ liệu.
>
> Câu hỏi quyết định không phải "cache thì có cần persistence không" mà là: **instance này có chứa thứ gì không dựng lại được từ nguồn khác không?** Nếu có (ví dụ session store — xem [[12 - Cookie và Session based Authentication]]), thì mất nó là mất thật, và persistence là cần thiết.

> [!danger] Cẩn thận khi chuyển từ RDB sang AOF
> Docs cảnh báo nguyên văn về quy trình bật AOF trên server đang chạy RDB:
> *"IMPORTANT: not following this procedure (e.g. just changing the config and restarting the server) can result in data loss!"*
> 🇻🇳 "QUAN TRỌNG: không theo đúng quy trình này (ví dụ chỉ đổi config rồi restart server) **có thể dẫn tới mất dữ liệu!**" — đúng cách là bật AOF bằng `CONFIG SET` trên server đang sống trước, rồi mới sửa `redis.conf`.

---

## Phần D — Hai chủ đề liên quan

### D1. Client-side caching (Tracking)

Redis không chỉ *là* cache, nó còn giúp ứng dụng tự cache trong RAM của chính mình.

📖 **Nguyên văn**
> "Client-side caching is a technique used to create high performance services.
> It exploits the memory available on application servers, servers that are usually distinct computers compared to the database nodes, to store some subset of the database information directly in the application side."

🇻🇳 **Dịch**
> "**Client-side caching** là một kỹ thuật dùng để tạo ra các service hiệu năng cao.
> Nó tận dụng bộ nhớ có sẵn trên **application server** — những máy thường tách biệt với các node database — để lưu một phần dữ liệu của database ngay tại phía ứng dụng."

Lợi ích docs nêu: *"the time needed in order to access the local computer memory is orders of magnitude smaller compared to accessing a networked service like a database"* — 🇻🇳 truy cập RAM cục bộ nhanh hơn nhiều bậc độ lớn so với gọi một service qua mạng.

Vấn đề cốt lõi vẫn là invalidation:

Docs nêu vấn đề: *"A problem with the above pattern is how to invalidate the information that the application is holding, in order to avoid presenting stale data to the user."* — 🇻🇳 làm sao **invalidate** thông tin mà ứng dụng đang giữ, để tránh phục vụ dữ liệu cũ cho người dùng.

📖 **Nguyên văn**
> "The Redis client-side caching support is called Tracking, and has two modes:
>
> In the default mode, the server remembers what keys a given client accessed, and sends invalidation messages when the same keys are modified. This costs memory in the server side, but sends invalidation messages only for the set of keys that the client might have in memory.
>
> In the broadcasting mode, the server does not attempt to remember what keys a given client accessed, so this mode costs no memory at all in the server side. Instead clients subscribe to key prefixes such as object: or user:, and receive a notification message every time a key matching a subscribed prefix is touched."

🇻🇳 **Dịch**
> "Hỗ trợ client-side caching của Redis được gọi là **Tracking**, và có hai chế độ:
>
> Ở chế độ **mặc định**, server **ghi nhớ những key mà mỗi client đã truy cập**, và gửi invalidation message khi chính các key đó bị sửa. Cách này **tốn bộ nhớ phía server**, nhưng chỉ gửi invalidation message cho đúng tập key mà client có thể đang giữ trong bộ nhớ.
>
> Ở chế độ **broadcasting**, server **không** cố ghi nhớ client nào đã truy cập key nào, nên chế độ này **không tốn chút bộ nhớ nào phía server**. Thay vào đó client **subscribe theo tiền tố key** như `object:` hay `user:`, và nhận notification mỗi khi một key khớp tiền tố đã subscribe bị chạm tới."

Điểm nối trực tiếp với hai phần trên của bài này:

📖 **Nguyên văn**
> "When a key is modified by some client, or is evicted because it has an associated expire time, or evicted because of a maxmemory policy, all the clients with tracking enabled that may have the key cached, are notified with an invalidation message."

🇻🇳 **Dịch**
> "Khi một key bị sửa bởi client nào đó, **hoặc bị đuổi vì nó có expire time**, **hoặc bị đuổi vì maxmemory policy**, thì tất cả các client đang bật tracking mà có thể đang cache key đó sẽ được **thông báo bằng một invalidation message**."

> [!note] Expiration và eviction là sự kiện quan sát được
> Cả TTL hết hạn lẫn eviction do `maxmemory` đều phát ra invalidation — tức là hai cơ chế ở Phần A và B không âm thầm, client-side cache biết được để dọn theo.

### D2. Distributed lock — chỉ khái niệm và cảnh báo

📖 **Nguyên văn**
> "Distributed locks are a very useful primitive in many environments where different processes must operate with shared resources in a mutually exclusive way."

🇻🇳 **Dịch**
> "**Distributed lock** là một primitive rất hữu ích trong nhiều môi trường nơi các process khác nhau phải thao tác trên tài nguyên chung theo cách **loại trừ lẫn nhau**."

Cách khoá đơn giản nhất trên một instance, theo docs, là `SET resource_name my_random_value NX PX 30000` — *"The command will set the key only if it does not already exist (NX option), with an expire of 30000 milliseconds (PX option)"*, và giá trị ngẫu nhiên *"must be unique across all clients and all lock requests"*.
🇻🇳 Chỉ set key nếu nó chưa tồn tại (`NX`), kèm expire 30000 ms (`PX`); giá trị ngẫu nhiên phải duy nhất trên mọi client và mọi lần xin khoá. Chú ý: chính cơ chế TTL ở Phần A là thứ giữ cho khoá tự nhả.

Docs nhấn mạnh khi nhả khoá: *"Using just DEL is not safe as a client may remove another client's lock"* — 🇻🇳 chỉ dùng `DEL` là không an toàn vì một client có thể xoá mất khoá của client khác; mọi khoá phải được "ký" bằng chuỗi ngẫu nhiên và chỉ xoá nếu chữ ký còn khớp.

> [!danger] Cảnh báo nguyên văn của docs về tính đúng đắn
> 📖 **Nguyên văn**
> > "If you are concerned about consistency and correctness, you should pay attention to the following topics:
> >
> > You should implement fencing tokens.
> > This is especially important for processes that can take significant time and applies to any distributed locking system.
> > Extending locks' lifetime is also an option, but don´t assume that a lock is retained as long as the process that had acquired it is alive.
> >
> > Redis is not using monotonic clock for TTL expiration mechanism.
> > That means that a wall-clock shift may result in a lock being acquired by more than one process."
>
> 🇻🇳 **Dịch**
> > "Nếu bạn quan tâm tới tính nhất quán và tính đúng đắn, hãy chú ý những điểm sau:
> >
> > Bạn **nên cài đặt fencing token**.
> > Điều này đặc biệt quan trọng với các process có thể chạy lâu, và áp dụng cho **mọi** hệ thống distributed locking.
> > Kéo dài vòng đời khoá cũng là một lựa chọn, nhưng **đừng giả định rằng khoá còn được giữ chừng nào process đã lấy nó còn sống**.
> >
> > Redis **không dùng monotonic clock** cho cơ chế TTL expiration.
> > Nghĩa là một cú lệch đồng hồ (wall-clock shift) có thể dẫn tới việc **nhiều hơn một process cùng lấy được khoá**."

Điều này khớp thẳng với mục A7: TTL của Redis dựa trên timestamp tuyệt đối của đồng hồ máy.

Và về persistence với lock, docs mô tả kịch bản hỏng:

📖 **Nguyên văn**
> "let’s assume we configure Redis without persistence at all. A client acquires the lock in 3 of 5 instances. One of the instances where the client was able to acquire the lock is restarted, at this point there are again 3 instances that we can lock for the same resource, and another client can lock it again, violating the safety property of exclusivity of lock."

🇻🇳 **Dịch**
> "giả sử ta cấu hình Redis **hoàn toàn không persistence**. Một client lấy được khoá trên 3 trong 5 instance. Một trong các instance mà client đã khoá được bị **restart**; lúc này lại có 3 instance có thể khoá cho cùng tài nguyên đó, và một client khác có thể khoá lại nó, **vi phạm tính chất an toàn về loại trừ của khoá**."

> [!warning] Nối lại với C10
> Ở C10 ta kết luận "cache thuần thì tắt persistence cũng được". Đoạn trên là ví dụ cụ thể cho vế ngược lại: **ngay khi Redis giữ thứ không dựng lại được** (ở đây là trạng thái khoá), việc tắt persistence chuyển từ "tối ưu hiệu năng" thành "lỗi đúng đắn".

---

## Tóm tắt

| Câu hỏi | Cơ chế | Cấu hình |
|---|---|---|
| Key sống bao lâu? | TTL | `EXPIRE`, `SET … EX`, `PERSIST`, `TTL` |
| Key hết hạn bị xoá lúc nào? | Passive (khi bị truy cập) + Active (quét ngẫu nhiên định kỳ) | — |
| Giới hạn RAM là bao nhiêu? | `maxmemory` (mặc định 64-bit: **không giới hạn**) | `maxmemory 100mb` |
| Hết RAM thì bỏ key nào? | Eviction policy | `maxmemory-policy allkeys-lru` |
| LRU có chính xác không? | **Không** — lấy mẫu ngẫu nhiên | `maxmemory-samples 5` |
| Dữ liệu có xuống đĩa không? | RDB / AOF / cả hai / không gì cả | `save 60 1000`, `appendonly yes` |
| Mất tối đa bao nhiêu dữ liệu? | Tuỳ fsync policy | `appendfsync everysec` (mặc định) |

Ba cái bẫy dễ dính nhất, theo đúng thứ tự nguy hiểm:
1. Không đặt `maxmemory` → Redis ăn hết RAM máy.
2. Đặt `volatile-*` nhưng key không có TTL → Redis hành xử như `noeviction`, **mọi lệnh ghi trả lỗi**.
3. `SET` lại key mà quên `EX` → TTL biến mất, key sống mãi mãi.

---

## Liên kết

- Bài trước: [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]]
- Bài kế: [[05 - Memcached]]
- [[01 - Caching là gì]] — mệnh đề nền: cache là bản sao, nên evict được. Docs eviction nói thẳng điều này ở B1.
- [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] — các lệnh `SET`, `GET`, kiểu dữ liệu; bài này là phần vận hành tiếp theo.
- [[05 - Transactions, ACID và MVCC]] — **Redis không phải RDBMS**. Chữ D (Durability) của ACID hứa "commit xong là chắc chắn còn"; Redis với `appendfsync everysec` chỉ hứa "mất tối đa 1 giây", và cache thuần thì thường tắt hẳn persistence. Đây là khác biệt nền tảng về đảm bảo dữ liệu, không phải chi tiết cấu hình.
- [[12 - Cookie và Session based Authentication]] — session store đặt trên Redis là ví dụ điển hình của "dữ liệu không dựng lại được từ database", nên áp dụng kết luận ở C10 phải cẩn thận.
- [[04 - Indexes]] · [[07 - N+1 Problem]] — cache giảm tải database, nhưng không sửa được index sai hay query N+1 ở dưới.

## Nguồn tham khảo

- Redis Docs — EXPIRE : https://redis.io/docs/latest/commands/expire/
- Redis Docs — Key eviction : https://redis.io/docs/latest/develop/reference/eviction/
- Redis Docs — Redis persistence : https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
- Redis Docs — Client-side caching : https://redis.io/docs/latest/develop/reference/client-side-caching/
- Redis Docs — Distributed Locks with Redis : https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
