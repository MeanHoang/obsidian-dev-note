# 03 — Redis: Kiểu dữ liệu và lệnh cơ bản

> **Nguồn chính:** Redis Documentation (redis.io/docs/latest) — https://redis.io/docs/latest/develop/data-types/
> Bài này bám các trang `develop/get-started`, `develop/data-types/*` và `develop/using-commands/keyspace` của redis.io, cộng thêm mô tả Redis trong roadmap.sh backend.

---

## 1. Redis là gì

### 1.1. Mô tả trong roadmap

📖 **Nguyên văn**
> "Redis is an open-source, in-memory data structure store supporting strings, lists, sets, hashes, and sorted sets. Used for caching, session management, real-time analytics, and message brokering. Offers persistence, replication, clustering, and low-latency high-throughput performance."

🇻🇳 **Dịch**
> "Redis là một in-memory data structure store mã nguồn mở, hỗ trợ strings, lists, sets, hashes và sorted sets. Được dùng cho caching, quản lý session, phân tích thời gian thực và message brokering. Nó cung cấp persistence, replication, clustering và hiệu năng độ trễ thấp — thông lượng cao."

### 1.2. Redis tự mô tả mình thế nào

📖 **Nguyên văn** — trang *Redis data types*
> "Redis is a data structure server.
> At its core, Redis provides a collection of native data types that help you solve a wide variety of problems, from caching to queuing to event processing."

🇻🇳 **Dịch**
> "Redis là một data structure server.
> Ở lõi của mình, Redis cung cấp một tập hợp các kiểu dữ liệu native giúp bạn giải quyết rất nhiều loại bài toán, từ caching tới queuing tới xử lý sự kiện (event processing)."

📖 **Nguyên văn** — trang *Quick starts*
> "Redis can be used as a database, cache, streaming engine, message broker, and more."

🇻🇳 **Dịch**
> "Redis có thể được dùng như một database, cache, streaming engine, message broker, và nhiều thứ khác."

> [!note] Điểm phân biệt lớn nhất
> Cụm từ mấu chốt là **data structure server** / **in-memory data structure store**, chứ không phải "key-value cache".
> Với một cache key-value thuần, value chỉ là một khối byte — muốn sửa một trường bên trong thì phải đọc cả khối về, sửa, rồi ghi đè cả khối.
> Redis thì có lệnh thao tác **trực tiếp lên cấu trúc** đang nằm trong bộ nhớ server: tăng một số đếm (`INCR`), thêm một phần tử vào set (`SADD`), cập nhật đúng một field của một record (`HSET`), chèn vào đầu danh sách (`LPUSH`)...
> Đây chính là khác biệt cốt lõi so với Memcached — sẽ nói kỹ ở bài so sánh riêng.

💡 **Ví dụ đời sống**
Hình dung bạn gửi đồ ở quầy giữ đồ siêu thị.

- **Tủ khoá kiểu cũ (key-value cache thuần):** bạn đưa cả một cái túi ni-lông buộc kín, nhận lại số thẻ. Muốn lấy ra đúng cây bút trong túi? Không được — phải lấy nguyên túi ra, mở, lấy bút, buộc lại, gửi lại.
- **Quầy giữ đồ có ngăn kệ (Redis):** nhân viên xếp đồ của bạn vào một ngăn có các ô nhỏ dán nhãn "bút", "sổ", "ví". Bạn nói "cho tôi xin cây bút" → họ với tay lấy đúng ô đó. Bạn nói "thêm quyển sổ nữa vào ngăn của tôi" → họ bỏ vào đúng ô, không đụng gì tới các ô còn lại.

Cấu trúc dữ liệu nằm ở phía server chính là cái "ngăn kệ có ô dán nhãn" đó.

---

## 2. Keyspace — key và value

### 2.1. Key là gì

📖 **Nguyên văn**
> "Every data object that you store in a Redis database has its own unique key. The key is a string that you pass to Redis commands to retrieve the corresponding object or modify its data. The data object associated with a particular key is known as the value and the two together are known as as key-value pair."

🇻🇳 **Dịch**
> "Mỗi data object bạn lưu trong một Redis database đều có key riêng, duy nhất. Key là một string mà bạn truyền cho các lệnh Redis để lấy về object tương ứng hoặc sửa dữ liệu của nó. Data object gắn với một key cụ thể được gọi là value, và cả hai hợp lại được gọi là một key-value pair."

### 2.2. Nội dung của key và quy ước đặt tên

📖 **Nguyên văn**
> "A key is typically a textual name that has some meaning within your data model. Unlike variable names in a programming language, Redis keys have few restrictions on their format, so keys with whitespace or punctuation characters are mostly fine (for example, "1st Attempt", or "% of price in $"). Redis doesn't support namespaces or other categories for keys, so you must take care to avoid name collisions. However, there is a convention for using the colon ":" character to split keys into sections (for example, "person:1", "person:2", "office:London", "office:NewYork:1"). You can use this as a simple way to collect keys together into categories."

🇻🇳 **Dịch**
> "Key thường là một cái tên dạng văn bản, mang ý nghĩa nào đó trong data model của bạn. Khác với tên biến trong ngôn ngữ lập trình, key của Redis có rất ít ràng buộc về định dạng, nên key chứa khoảng trắng hay dấu câu hầu như đều dùng được (ví dụ "1st Attempt", hoặc "% of price in $"). Redis không hỗ trợ namespace hay các dạng phân loại key khác, nên bạn phải tự lo tránh trùng tên. Tuy nhiên, có một quy ước là dùng ký tự hai chấm ":" để chia key thành các phần (ví dụ "person:1", "person:2", "office:London", "office:NewYork:1"). Bạn có thể dùng cách này như một cách đơn giản để gom key thành từng nhóm."

📖 **Nguyên văn**
> "Although keys are usually textual, Redis actually implements binary-safe keys, so you can use any sequence of bytes as a valid key, such as a JPEG file or a struct value from your app. The empty string is also a valid key in Redis."

🇻🇳 **Dịch**
> "Mặc dù key thường là văn bản, thực ra Redis hiện thực key theo kiểu binary-safe, nên bạn có thể dùng bất kỳ chuỗi byte nào làm key hợp lệ, chẳng hạn một file JPEG hay một giá trị struct trong app của bạn. Chuỗi rỗng cũng là một key hợp lệ trong Redis."

Ba lời khuyên và một giới hạn, trích nguyên văn từ cùng trang:

📖 **Nguyên văn**
> "Very short keys are often not a good idea. There is little point in writing "u1000flw" as a key if you can instead write "user:1000:followers". The latter is more readable and the added space is minor compared to the space used by the key object itself and the value object. While short keys will obviously consume a bit less memory, your job is to find the right balance."

🇻🇳 **Dịch**
> "Key quá ngắn thường cũng không hay. Chẳng được lợi gì mấy khi viết "u1000flw" làm key trong khi bạn có thể viết "user:1000:followers". Cái sau dễ đọc hơn, và phần dung lượng tăng thêm là nhỏ so với dung lượng mà bản thân key object và value object chiếm. Dĩ nhiên key ngắn tốn ít bộ nhớ hơn một chút, nhưng việc của bạn là tìm điểm cân bằng hợp lý."

📖 **Nguyên văn**
> "Try to stick with a schema. For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields, as in "comment:4321:reply.to" or "comment:4321:reply-to"."

🇻🇳 **Dịch**
> "Hãy cố bám theo một schema. Ví dụ "object-type:id" là một ý hay, như "user:1000". Dấu chấm hoặc dấu gạch ngang thường được dùng cho các trường nhiều từ, như "comment:4321:reply.to" hoặc "comment:4321:reply-to"."

📖 **Nguyên văn**
> "The maximum allowed key size is 512 MB."

🇻🇳 **Dịch**
> "Kích thước key tối đa cho phép là 512 MB."

### 2.3. Thao tác trên keyspace: EXISTS, DEL, TYPE

📖 **Nguyên văn**
> "There are commands that are not defined on particular types, but are useful in order to interact with the space of keys, and thus, can be used with keys of any type.
> For example the EXISTS command returns 1 or 0 to signal if a given key exists or not in the database, while the DEL command deletes a key and associated value, whatever the value is."

🇻🇳 **Dịch**
> "Có những lệnh không gắn với một kiểu cụ thể nào, nhưng hữu ích để tương tác với không gian key (key space), và vì vậy dùng được với key thuộc bất kỳ kiểu nào.
> Ví dụ lệnh EXISTS trả về 1 hoặc 0 để báo một key có tồn tại trong database hay không, còn lệnh DEL xoá một key cùng value gắn với nó, bất kể value là gì."

📖 **Nguyên văn**
> ```
> > set mykey hello
> OK
> > exists mykey
> (integer) 1
> > del mykey
> (integer) 1
> > exists mykey
> (integer) 0
> ```

🇻🇳 Đặt key `mykey`, kiểm tra tồn tại (trả `1`), xoá (trả `1` nghĩa là có xoá được), kiểm tra lại (trả `0`).

📖 **Nguyên văn**
> "There are many key space related commands, but the above two are the essential ones together with the TYPE command, which returns the kind of value stored at the specified key:"

🇻🇳 **Dịch**
> "Có nhiều lệnh liên quan tới key space, nhưng hai lệnh trên là thiết yếu, cùng với lệnh TYPE — lệnh trả về loại value đang được lưu ở key chỉ định:"

📖 **Nguyên văn**
> ```
> > set mykey x
> OK
> > type mykey
> string
> > del mykey
> (integer) 1
> > type mykey
> none
> ```

🇻🇳 `TYPE` trả về `string` khi key còn tồn tại, và `none` sau khi key đã bị xoá.

### 2.4. Key expiration (TTL)

📖 **Nguyên văn**
> "Before moving on, we should look at an important Redis feature that works regardless of the type of value you're storing: key expiration. Key expiration lets you set a timeout for a key, also known as a "time to live", or "TTL". When the time to live elapses, the key is automatically destroyed."

🇻🇳 **Dịch**
> "Trước khi đi tiếp, ta nên xem một tính năng quan trọng của Redis, hoạt động bất kể bạn đang lưu value thuộc kiểu nào: key expiration. Key expiration cho phép bạn đặt timeout cho một key, còn gọi là "time to live" hay "TTL". Khi thời gian sống trôi hết, key bị huỷ tự động."

📖 **Nguyên văn**
> "They can be set both using seconds or milliseconds precision.
> However the expire time resolution is always 1 millisecond.
> Information about expires are replicated and persisted on disk, the time virtually passes when your Redis server remains stopped (this means that Redis saves the date at which a key will expire)."

🇻🇳 **Dịch**
> "Chúng có thể được đặt theo độ chính xác giây hoặc mili-giây.
> Tuy nhiên độ phân giải của thời gian hết hạn luôn là 1 mili-giây.
> Thông tin về expire được replicate và persist xuống đĩa; thời gian vẫn "trôi" trên danh nghĩa ngay cả khi Redis server đang dừng (nghĩa là Redis lưu lại thời điểm mà key sẽ hết hạn)."

📖 **Nguyên văn**
> ```
> > set key some-value
> OK
> > expire key 5
> (integer) 1
> > get key (immediately)
> "some-value"
> > get key (after some time)
> (nil)
> ```

🇻🇳 Đặt TTL 5 giây bằng `EXPIRE`; `GET` ngay lập tức vẫn ra value, `GET` sau đó trả `(nil)` vì key đã tự biến mất.

📖 **Nguyên văn**
> ```
> > set key 100 ex 10
> OK
> > ttl key
> (integer) 9
> ```

🇻🇳 Tạo key kèm TTL ngay trong `SET` bằng option `EX`; `TTL` cho biết số giây còn lại.

> [!tip] TTL là trái tim của cache
> Trong ngữ cảnh caching, `EXPIRE` / `SET ... EX` là công cụ hết hạn dữ liệu cũ. Xem lại [[01 - Caching là gì]] về lý do dữ liệu cache phải có tuổi thọ.

### 2.5. Duyệt keyspace: SCAN vs KEYS

📖 **Nguyên văn**
> "To incrementally iterate over the keys in a Redis database in an efficient manner, you can use the SCAN command.
> Since SCAN allows for incremental iteration, returning only a small number of elements per call, it can be used in production without the downside of commands like KEYS or SMEMBERS that may block the server for a long time (even several seconds) when called against big collections of keys or elements."

🇻🇳 **Dịch**
> "Để duyệt tăng dần (incrementally iterate) qua các key trong một Redis database một cách hiệu quả, bạn có thể dùng lệnh SCAN.
> Vì SCAN cho phép duyệt tăng dần, mỗi lần gọi chỉ trả về một lượng nhỏ phần tử, nên nó có thể dùng trên production mà không dính nhược điểm của các lệnh như KEYS hay SMEMBERS — những lệnh có thể block server trong thời gian dài (thậm chí vài giây) khi được gọi trên tập key hoặc tập phần tử lớn."

📖 **Nguyên văn**
> "However while blocking commands like SMEMBERS are able to provide all the elements that are part of a Set in a given moment.
> The SCAN family of commands only offer limited guarantees about the returned elements since the collection that we incrementally iterate can change during the iteration process."

🇻🇳 **Dịch**
> "Tuy nhiên, trong khi các lệnh blocking như SMEMBERS có thể cung cấp toàn bộ phần tử thuộc một Set tại một thời điểm nhất định, thì họ lệnh SCAN chỉ đưa ra những đảm bảo hạn chế về các phần tử trả về, vì tập hợp mà ta duyệt tăng dần có thể thay đổi trong quá trình duyệt."

📖 **Nguyên văn** — trang lệnh `SCAN`
> "SCAN is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
> An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0. The following is an example of SCAN iteration:"

🇻🇳 **Dịch**
> "SCAN là một iterator dựa trên cursor. Nghĩa là mỗi lần gọi lệnh, server trả về một cursor đã cập nhật mà người dùng cần truyền làm tham số cursor cho lần gọi kế tiếp.
> Một vòng duyệt bắt đầu khi cursor bằng 0, và kết thúc khi cursor server trả về bằng 0. Dưới đây là ví dụ một vòng duyệt SCAN:"

📖 **Nguyên văn**
> ```
> > scan 0
> 1) "17"
> 2)  1) "key:12"
>     2) "key:8"
>     3) "key:4"
>     ...
> > scan 17
> 1) "0"
> 2) 1) "key:5"
>    2) "key:18"
>    3) "key:0"
>    ...
> ```

🇻🇳 Lần gọi đầu dùng cursor `0`, server trả cursor mới là `17` kèm một lô key; gọi tiếp `scan 17` trả cursor `0` — báo hiệu đã duyệt xong.

📖 **Nguyên văn** — trang lệnh `KEYS`
> "Returns all keys matching pattern."

🇻🇳 **Dịch**
> "Trả về tất cả key khớp với pattern."

> [!danger] Cảnh báo về `KEYS` trên production
> 📖 **Nguyên văn** (trang *Keys and values*)
> > "Another way to iterate over the keyspace is to use the KEYS command, but this approach should be used with care, since KEYS will block the Redis server until all keys are returned.
> > Warning: consider KEYS as a command that should only be used in production environments with extreme care.
> > KEYS may ruin performance when it is executed against large databases. This command is intended for debugging and special operations, such as changing your keyspace layout. Don't use KEYS in your regular application code. If you're looking for a way to find keys in a subset of your keyspace, consider using SCAN or sets."
>
> 🇻🇳 **Dịch**
> > "Một cách khác để duyệt keyspace là dùng lệnh KEYS, nhưng cách này phải dùng cẩn thận, vì KEYS sẽ block Redis server cho tới khi trả về hết mọi key.
> > Cảnh báo: hãy coi KEYS là lệnh chỉ được dùng trong môi trường production với sự cẩn trọng tột độ.
> > KEYS có thể phá nát hiệu năng khi chạy trên các database lớn. Lệnh này dành cho mục đích debug và các thao tác đặc biệt, chẳng hạn thay đổi bố cục keyspace của bạn. Đừng dùng KEYS trong code ứng dụng chạy thường xuyên. Nếu bạn cần tìm key trong một phần của keyspace, hãy cân nhắc dùng SCAN hoặc sets."

Các pattern glob mà `KEYS` hỗ trợ, trích nguyên văn:

📖 **Nguyên văn**
> "h?llo matches hello, hallo and hxllo
> h*llo matches hllo and heeeello
> h[ae]llo matches hello and hallo, but not hillo
> h[^e]llo matches hallo, hbllo, ... but not hello
> h[a-b]llo matches hallo and hbllo
> Use \ to escape special characters if you want to match them verbatim."

🇻🇳 **Dịch**
> "h?llo khớp hello, hallo và hxllo
> h*llo khớp hllo và heeeello
> h[ae]llo khớp hello và hallo, nhưng không khớp hillo
> h[^e]llo khớp hallo, hbllo, ... nhưng không khớp hello
> h[a-b]llo khớp hallo và hbllo
> Dùng \ để escape các ký tự đặc biệt nếu bạn muốn khớp đúng nguyên văn chúng."

---

## 3. Các kiểu dữ liệu

### 3.1. Danh sách kiểu mà Redis Open Source hiện thực

📖 **Nguyên văn**
> "Redis Open Source implements the following data types:
> Strings
> Bitmaps
> Bitfields
> Arrays
> Geospatial indexes
> Hashes
> JSON
> Lists
> Probabilistic data types
> Sets
> Sorted sets
> Streams
> Time series
> Vector sets"

🇻🇳 **Dịch**
> "Redis Open Source hiện thực các kiểu dữ liệu sau:
> Strings
> Bitmaps
> Bitfields
> Arrays
> Geospatial indexes (chỉ mục địa lý)
> Hashes
> JSON
> Lists
> Probabilistic data types (các kiểu dữ liệu xác suất)
> Sets
> Sorted sets
> Streams
> Time series (chuỗi thời gian)
> Vector sets"

> [!note] Về JSON, Vector sets, Time series
> Trang *Redis data types* của redis.io liệt kê JSON, Time series và Vector sets **nằm chung trong danh sách "Redis Open Source implements the following data types"**, không tách ra thành module riêng. Ở đây note chỉ ghi lại đúng như tài liệu trình bày.

### 3.2. Bảng tổng hợp

Cột "dùng làm gì" và "lệnh tiêu biểu" dưới đây tóm tắt lại mô tả từ chính các trang docs tương ứng (phần trích nguyên văn nằm ở các mục 3.3 → 3.5 và mục 4).

| Kiểu | Dùng làm gì (theo docs) | Lệnh tiêu biểu |
|---|---|---|
| **String** | Lưu chuỗi byte: text, object đã serialize, mảng nhị phân. Caching, counters, thao tác bit | `SET` `GET` `MSET` `MGET` `INCR` `INCRBY` `DECR` `APPEND` |
| **Hash** | Record type: tập các cặp field-value. Biểu diễn object cơ bản, nhóm counters | `HSET` `HGET` `HGETALL` `HMGET` `HINCRBY` `HEXPIRE` |
| **Sorted set** | Tập string duy nhất có thứ tự theo score. Leaderboards, rate limiters | `ZADD` `ZRANGE` `ZREVRANGE` `ZRANGEBYSCORE` `ZINCRBY` `ZREM` |
| **List** | Linked list các string. Stack, queue, hàng đợi cho background worker | `LPUSH` `RPUSH` `LPOP` `RPOP` `LRANGE` `LTRIM` `LMOVE` `BRPOP` |
| **Set** | Tập string duy nhất, không thứ tự. Theo dõi item duy nhất, biểu diễn quan hệ, phép giao/hợp/hiệu | `SADD` `SISMEMBER` `SINTER` `SDIFF` `SCARD` `SMEMBERS` |
| **Stream** | Cấu trúc kiểu append-only log, ghi lại sự kiện theo thứ tự xảy ra | `XADD` `XRANGE` `XREAD` `XREADGROUP` `XTRIM` |
| **Bitmap** | Thao tác hướng-bit trên String; biểu diễn set khi phần tử tương ứng số nguyên 0-N, quyền của object | `SETBIT` `GETBIT` `BITCOUNT` |
| **HyperLogLog** | Ước lượng cardinality (số phần tử) của tập lớn theo kiểu xác suất | `PFADD` `PFCOUNT` `PFMERGE` |
| **Geospatial index** | Lưu toạ độ và tìm điểm gần trong bán kính / hộp bao | `GEOADD` `GEOSEARCH` |

### 3.3. String — đi sâu

📖 **Nguyên văn**
> "Redis strings store sequences of bytes, including text, serialized objects, and binary arrays.
> As such, strings are the simplest type of value you can associate with a Redis key.
> They're often used for caching, but they support additional functionality that lets you implement counters and perform bitwise operations, too."

🇻🇳 **Dịch**
> "Redis string lưu các chuỗi byte, bao gồm text, object đã được serialize, và mảng nhị phân.
> Vì vậy, string là kiểu value đơn giản nhất mà bạn có thể gắn với một Redis key.
> Chúng thường được dùng cho caching, nhưng còn hỗ trợ thêm chức năng cho phép bạn hiện thực counters và thực hiện các phép toán bit nữa."

📖 **Nguyên văn**
> "Since Redis keys are strings, when we use the string type as a value too, we are mapping a string to another string. The string data type is useful for a number of use cases, like caching HTML fragments or pages."

🇻🇳 **Dịch**
> "Vì key của Redis là string, khi ta dùng kiểu string cho cả value nữa thì ta đang map một string sang một string khác. Kiểu dữ liệu string hữu ích cho nhiều use case, ví dụ như cache các HTML fragment hay cả trang."

**SET / GET** — ví dụ gốc từ docs (mô tả: *"Foundational: Set and retrieve string values using SET and GET (overwrites existing values)"*):

📖 **Nguyên văn**
> ```
> > SET bike:1 Deimos
> OK
> > GET bike:1
> "Deimos"
> ```

🇻🇳 Ghi chuỗi `Deimos` vào key `bike:1`, rồi đọc lại.

📖 **Nguyên văn** — mô tả lệnh trong command summary
> "SET — Sets the string value of a key, ignoring its type. The key is created if it doesn't exist."
> "GET — Returns the string value of a key."

🇻🇳 **Dịch**
> "SET — Đặt string value cho một key, bỏ qua kiểu hiện tại của nó. Key sẽ được tạo nếu chưa tồn tại."
> "GET — Trả về string value của một key."

**Giới hạn:**

📖 **Nguyên văn**
> "By default, a single Redis string can be a maximum of 512 MB."

🇻🇳 **Dịch**
> "Mặc định, một Redis string đơn lẻ có kích thước tối đa 512 MB."

**Hiệu năng:**

📖 **Nguyên văn**
> "Most string operations are O(1), which means they're highly efficient.
> However, be careful with the SUBSTR, GETRANGE, and SETRANGE commands, which can be O(n).
> These random-access string commands may cause performance issues when dealing with large strings."

🇻🇳 **Dịch**
> "Phần lớn thao tác trên string là O(1), nghĩa là chúng rất hiệu quả.
> Tuy nhiên, hãy cẩn thận với các lệnh SUBSTR, GETRANGE và SETRANGE — chúng có thể là O(n).
> Các lệnh truy cập ngẫu nhiên trên string này có thể gây vấn đề hiệu năng khi làm việc với string lớn."

**Khi nào nên bỏ String mà chuyển sang Hash / JSON:**

📖 **Nguyên văn**
> "If you're storing structured data as a serialized string, you may also want to consider Redis hashes or JSON."

🇻🇳 **Dịch**
> "Nếu bạn đang lưu dữ liệu có cấu trúc dưới dạng một string đã serialize, bạn cũng nên cân nhắc dùng Redis hashes hoặc JSON."

### 3.4. Hash — đi sâu

📖 **Nguyên văn**
> "Redis hashes are record types structured as collections of field-value pairs.
> You can use hashes to represent basic objects and to store groupings of counters, among other things."

🇻🇳 **Dịch**
> "Redis hash là các record type được cấu trúc thành tập hợp các cặp field-value.
> Bạn có thể dùng hash để biểu diễn các object cơ bản và để lưu các nhóm counter, bên cạnh nhiều việc khác."

📖 **Nguyên văn** — trang *Redis data types*
> "Redis hashes are record types modeled as collections of field-value pairs. As such, Redis hashes resemble Python dictionaries, Java HashMaps, and Ruby hashes."

🇻🇳 **Dịch**
> "Redis hash là các record type được mô hình hoá thành tập hợp các cặp field-value. Vì vậy, Redis hash tương tự dictionary của Python, HashMap của Java, và hash của Ruby."

Ví dụ gốc từ docs:

📖 **Nguyên văn**
> ```
> > HSET bike:1 model Deimos brand Ergonom type 'Enduro bikes' price 4972
> (integer) 4
> > HGET bike:1 model
> "Deimos"
> > HGET bike:1 price
> "4972"
> > HGETALL bike:1
> 1) "model"
> 2) "Deimos"
> 3) "brand"
> 4) "Ergonom"
> 5) "type"
> 6) "Enduro bikes"
> 7) "price"
> 8) "4972"
> ```

🇻🇳 Một chiếc xe đạp được lưu thành 4 field trong một key duy nhất; `HGET` lấy đúng một field, `HGETALL` lấy toàn bộ cặp field-value.

Hash làm nhóm counter — ví dụ gốc từ docs:

📖 **Nguyên văn**
> ```
> > HINCRBY bike:1:stats rides 1
> (integer) 1
> > HINCRBY bike:1:stats rides 1
> (integer) 2
> > HINCRBY bike:1:stats rides 1
> (integer) 3
> > HINCRBY bike:1:stats crashes 1
> (integer) 1
> > HINCRBY bike:1:stats owners 1
> (integer) 1
> > HGET bike:1:stats rides
> "3"
> > HMGET bike:1:stats owners crashes
> 1) "1"
> 2) "1"
> ```

🇻🇳 `HINCRBY` tăng từng field số đếm riêng trong cùng một hash; `HMGET` đọc nhiều field trong một lần gọi.

Hash còn cho phép đặt TTL **cho từng field**, không chỉ cho cả key — ví dụ gốc từ docs:

📖 **Nguyên văn**
> ```
> > HSET sensor:sensor1 air_quality 256 battery_level 89
> (integer) 2
> > HEXPIRE sensor:sensor1 60 FIELDS 2 air_quality battery_level
> 1) (integer) 1
> 2) (integer) 1
> > HTTL sensor:sensor1 FIELDS 2 air_quality battery_level
> 1) (integer) 60
> 2) (integer) 60
> ```

🇻🇳 `HEXPIRE` đặt TTL 60 giây cho hai field `air_quality` và `battery_level`; `HTTL` đọc lại TTL còn lại của từng field.

> [!tip] Vì sao Hash rất hợp với cache object
> Cache một object dưới dạng String buộc bạn phải `JSON.stringify` cả object, và mỗi lần sửa một trường là ghi lại toàn bộ. Với Hash, docs cho thấy `HGET` đọc đúng một field, `HINCRBY` tăng đúng một counter, `HEXPIRE` hết hạn đúng một field. Đây là *nhận định* rút ra từ các ví dụ trên, không phải trích dẫn.

### 3.5. Sorted Set — đi sâu

📖 **Nguyên văn**
> "A Redis sorted set is a collection of unique strings (members) ordered by an associated score.
> When more than one string has the same score, the strings are ordered lexicographically.
> Some use cases for sorted sets include:
> Leaderboards. For example, you can use sorted sets to easily maintain ordered lists of the highest scores in a massive online game.
> Rate limiters. In particular, you can use a sorted set to build a sliding-window rate limiter to prevent excessive API requests."

🇻🇳 **Dịch**
> "Một Redis sorted set là một tập hợp các string duy nhất (gọi là member) được sắp thứ tự theo một score gắn kèm.
> Khi nhiều string có cùng score, các string đó được sắp theo thứ tự từ điển (lexicographically).
> Một số use case của sorted set gồm:
> Leaderboards. Ví dụ, bạn có thể dùng sorted set để duy trì dễ dàng các danh sách điểm cao nhất đã sắp xếp trong một game online quy mô lớn.
> Rate limiters. Cụ thể, bạn có thể dùng sorted set để xây một sliding-window rate limiter nhằm ngăn số lượng API request quá mức."

📖 **Nguyên văn**
> "You can think of sorted sets as a mix between a Set and a Hash. Like sets, sorted sets are composed of unique, non-repeating string elements, so in some sense a sorted set is a set as well.
> However while elements inside sets are not ordered, every element in a sorted set is associated with a floating point value, called the score (this is why the type is also similar to a hash, since every element is mapped to a value)."

🇻🇳 **Dịch**
> "Bạn có thể hình dung sorted set như một sự pha trộn giữa Set và Hash. Giống set, sorted set gồm các phần tử string duy nhất, không lặp lại, nên theo nghĩa nào đó sorted set cũng là một set.
> Tuy nhiên, trong khi các phần tử trong set không có thứ tự, thì mỗi phần tử trong sorted set được gắn với một giá trị dấu chấm động, gọi là score (đây là lý do kiểu này cũng giống hash, vì mỗi phần tử được map tới một giá trị)."

📖 **Nguyên văn**
> "If B and A are two elements with a different score, then A > B if A.score is > B.score.
> If B and A have exactly the same score, then A > B if the A string is lexicographically greater than the B string. B and A strings can't be equal since sorted sets only have unique elements."

🇻🇳 **Dịch**
> "Nếu B và A là hai phần tử có score khác nhau, thì A > B khi A.score > B.score.
> Nếu B và A có score hoàn toàn bằng nhau, thì A > B khi string A lớn hơn string B theo thứ tự từ điển. Hai string B và A không thể bằng nhau vì sorted set chỉ chứa các phần tử duy nhất."

Ví dụ gốc từ docs — thêm tay đua và điểm:

📖 **Nguyên văn**
> ```
> > ZADD racer_scores 10 "Norem"
> (integer) 1
> > ZADD racer_scores 12 "Castilla"
> (integer) 1
> > ZADD racer_scores 8 "Sam-Bodden" 10 "Royce" 6 "Ford" 14 "Prickett"
> (integer) 4
> ```

🇻🇳 `ZADD` thêm member kèm score; giá trị trả về là số member mới được thêm.

📖 **Nguyên văn**
> ```
> > ZRANGE racer_scores 0 -1
> 1) "Ford"
> 2) "Sam-Bodden"
> 3) "Norem"
> 4) "Royce"
> 5) "Castilla"
> 6) "Prickett"
> > ZREVRANGE racer_scores 0 -1
> 1) "Prickett"
> 2) "Castilla"
> 3) "Royce"
> 4) "Norem"
> 5) "Sam-Bodden"
> 6) "Ford"
> ```

🇻🇳 `ZRANGE` liệt kê theo score tăng dần, `ZREVRANGE` theo chiều ngược lại — đúng hình dạng một bảng xếp hạng.

📖 **Nguyên văn**
> ```
> > ZRANGEBYSCORE racer_scores -inf 10
> 1) "Ford"
> 2) "Sam-Bodden"
> 3) "Norem"
> 4) "Royce"
> ```

🇻🇳 Lọc theo khoảng score, `-inf` là biên dưới vô cực.

📖 **Nguyên văn**
> ```
> > ZADD racer_scores 100 "Wood"
> (integer) 1
> > ZADD racer_scores 100 "Henshaw"
> (integer) 1
> > ZADD racer_scores 150 "Henshaw"
> (integer) 0
> > ZINCRBY racer_scores 50 "Wood"
> "150"
> > ZINCRBY racer_scores 50 "Henshaw"
> "200"
> ```

🇻🇳 `ZADD` trên member đã tồn tại trả `0` (cập nhật score chứ không thêm mới); `ZINCRBY` cộng thêm vào score hiện tại.

---

## 4. Các kiểu còn lại

### 4.1. List

📖 **Nguyên văn**
> "Redis lists are linked lists of string values.
> Redis lists are frequently used to:
> Implement stacks and queues.
> Build queue management for background worker systems."

🇻🇳 **Dịch**
> "Redis list là các linked list chứa các giá trị string.
> Redis list thường được dùng để:
> Hiện thực stack và queue.
> Xây dựng cơ chế quản lý hàng đợi cho các hệ thống background worker."

📖 **Nguyên văn** — ví dụ "Treat a list like a queue (first in, first out)"
> ```
> > LPUSH bikes:repairs bike:1
> (integer) 1
> > LPUSH bikes:repairs bike:2
> (integer) 2
> > RPOP bikes:repairs
> "bike:1"
> > RPOP bikes:repairs
> "bike:2"
> ```

🇻🇳 Đẩy vào đầu bằng `LPUSH`, lấy ra ở cuối bằng `RPOP` → hàng đợi FIFO.

Ví dụ gốc cho thấy Redis báo lỗi khi dùng sai kiểu trên một key:

📖 **Nguyên văn**
> ```
> > DEL new_bikes
> (integer) 1
> > SET new_bikes bike:1
> OK
> > TYPE new_bikes
> string
> > LPUSH new_bikes bike:2 bike:3
> (error) WRONGTYPE Operation against a key holding the wrong kind of value
> ```

🇻🇳 Key đang giữ một `string`; gọi lệnh của kiểu list lên nó thì Redis trả lỗi `WRONGTYPE`.

### 4.2. Set

📖 **Nguyên văn**
> "A Redis set is an unordered collection of unique strings (members).
> You can use Redis sets to efficiently:
> Track unique items (e.g., track all unique IP addresses accessing a given blog post).
> Represent relations (e.g., the set of all users with a given role).
> Perform common set operations such as intersection, unions, and differences."

🇻🇳 **Dịch**
> "Một Redis set là một tập hợp không có thứ tự gồm các string duy nhất (gọi là member).
> Bạn có thể dùng Redis set để làm một cách hiệu quả những việc sau:
> Theo dõi các item duy nhất (ví dụ theo dõi toàn bộ địa chỉ IP duy nhất truy cập một bài blog).
> Biểu diễn quan hệ (ví dụ tập hợp toàn bộ user có một role nhất định).
> Thực hiện các phép toán tập hợp thông dụng như giao (intersection), hợp (union) và hiệu (difference)."

📖 **Nguyên văn**
> "With a Redis set, you can add, remove, and test for existence in O(1) time (in other words, regardless of the number of set elements)."

🇻🇳 **Dịch**
> "Với một Redis set, bạn có thể thêm, xoá và kiểm tra sự tồn tại trong thời gian O(1) (nói cách khác, không phụ thuộc vào số phần tử của set)."

📖 **Nguyên văn**
> ```
> > SADD bikes:racing:france bike:1
> (integer) 1
> > SADD bikes:racing:france bike:1
> (integer) 0
> > SADD bikes:racing:france bike:2 bike:3
> (integer) 2
> > SADD bikes:racing:usa bike:1 bike:4
> (integer) 2
> ```

🇻🇳 Thêm member trùng thì `SADD` trả `0` — set tự loại trùng.

📖 **Nguyên văn**
> ```
> > SISMEMBER bikes:racing:usa bike:1
> (integer) 1
> > SISMEMBER bikes:racing:usa bike:2
> (integer) 0
> ```

🇻🇳 `SISMEMBER` kiểm tra một member có trong set hay không.

📖 **Nguyên văn**
> ```
> > SINTER bikes:racing:france bikes:racing:usa
> 1) "bike:1"
> ```

🇻🇳 `SINTER` lấy giao của hai set.

### 4.3. Stream

📖 **Nguyên văn**
> "A Redis stream is a data structure that acts like an append-only log but also implements several operations to overcome some of the limits of a typical append-only log. These include random access in O(1) time and complex consumption strategies, such as consumer groups."

🇻🇳 **Dịch**
> "Một Redis stream là một cấu trúc dữ liệu hoạt động như một append-only log, nhưng còn hiện thực thêm vài thao tác để vượt qua một số giới hạn của append-only log thông thường. Trong đó có truy cập ngẫu nhiên trong thời gian O(1) và các chiến lược tiêu thụ (consumption) phức tạp, chẳng hạn consumer groups."

📖 **Nguyên văn** — trang *Redis data types*
> "Streams help record events in the order they occur and then syndicate them for processing."

🇻🇳 **Dịch**
> "Stream giúp ghi lại các sự kiện theo đúng thứ tự chúng xảy ra, rồi phân phối chúng đi để xử lý."

📖 **Nguyên văn**
> ```
> > XADD race:france * rider Castilla speed 30.2 position 1 location_id 1
> "1692632086370-0"
> > XADD race:france * rider Norem speed 28.8 position 3 location_id 1
> "1692632094485-0"
> > XADD race:france * rider Prickett speed 29.7 position 2 location_id 1
> "1692632102976-0"
> ```

🇻🇳 `XADD` ghi thêm một entry vào stream; dấu `*` để Redis tự sinh ID, ID trả về có dạng `<timestamp>-<số thứ tự>`.

### 4.4. Bitmap

📖 **Nguyên văn**
> "Bitmaps are not an actual data type, but a set of bit-oriented operations defined on the String type which is treated like a bit vector.
> Since strings are binary safe blobs and their maximum length is 512 MB, they are suitable to set up to 2^32 different bits."

🇻🇳 **Dịch**
> "Bitmap không phải là một kiểu dữ liệu thực sự, mà là một tập các thao tác hướng-bit được định nghĩa trên kiểu String — kiểu này được đối xử như một vector bit.
> Vì string là các blob binary-safe và độ dài tối đa của chúng là 512 MB, chúng phù hợp để đặt tới 2^32 bit khác nhau."

📖 **Nguyên văn**
> "Some examples of bitmap use cases include:
> Efficient set representations for cases where the members of a set correspond to the integers 0-N.
> Object permissions, where each bit represents a particular permission, similar to the way that file systems store permissions."

🇻🇳 **Dịch**
> "Một số ví dụ use case của bitmap:
> Biểu diễn tập hợp hiệu quả cho các trường hợp mà member của tập tương ứng với các số nguyên 0-N.
> Quyền trên object, trong đó mỗi bit biểu diễn một quyền cụ thể, tương tự cách các file system lưu quyền."

📖 **Nguyên văn**
> ```
> > SETBIT pings:2024-01-01-00:00 123 1
> (integer) 0
> > GETBIT pings:2024-01-01-00:00 123
> 1
> > GETBIT pings:2024-01-01-00:00 456
> 0
> ```

🇻🇳 Bật bit ở vị trí 123 trong key của giờ đó; đọc lại bit 123 ra `1`, bit 456 chưa từng bật nên ra `0`.

### 4.5. HyperLogLog

📖 **Nguyên văn**
> "HyperLogLog is a probabilistic data structure that estimates the cardinality of a set, trading perfect accuracy for efficient space utilization. The Redis implementation uses up to 12 KB of memory and provides a standard error rate of 0.81%."

🇻🇳 **Dịch**
> "HyperLogLog là một cấu trúc dữ liệu xác suất, ước lượng cardinality (số phần tử) của một tập hợp, đánh đổi độ chính xác tuyệt đối lấy việc dùng không gian hiệu quả. Bản hiện thực của Redis dùng tối đa 12 KB bộ nhớ và cho sai số chuẩn 0.81%."

📖 **Nguyên văn**
> "HLLs in Redis, while technically a different data structure, are encoded as a Redis string, so you can call GET to serialize a HLL, and SET to deserialize it back to the server."

🇻🇳 **Dịch**
> "HLL trong Redis, dù về mặt kỹ thuật là một cấu trúc dữ liệu khác, vẫn được mã hoá dưới dạng một Redis string, nên bạn có thể gọi GET để serialize một HLL, và SET để deserialize nó ngược trở lại server."

📖 **Nguyên văn**
> ```
> > PFADD bikes Hyperion Deimos Phoebe Quaoar
> (integer) 1
> > PFCOUNT bikes
> (integer) 4
> > PFADD commuter_bikes Salacia Mimas Quaoar
> (integer) 1
> > PFMERGE all_bikes bikes commuter_bikes
> OK
> > PFCOUNT all_bikes
> (integer) 6
> ```

🇻🇳 `PFADD` thêm phần tử, `PFCOUNT` ước lượng số phần tử duy nhất, `PFMERGE` gộp nhiều HLL (ở đây `Quaoar` trùng nên tổng là 6 chứ không phải 7).

### 4.6. Geospatial index

📖 **Nguyên văn**
> "Redis geospatial indexes let you store coordinates and search for them.
> This data structure is useful for finding nearby points within a given radius or bounding box."

🇻🇳 **Dịch**
> "Redis geospatial index cho phép bạn lưu toạ độ và tìm kiếm theo toạ độ.
> Cấu trúc dữ liệu này hữu ích để tìm các điểm ở gần trong một bán kính hoặc một hộp bao (bounding box) cho trước."

📖 **Nguyên văn**
> ```
> > GEOADD bikes:rentable -122.27652 37.805186 station:1
> (integer) 1
> > GEOADD bikes:rentable -122.2674626 37.8062344 station:2
> (integer) 1
> > GEOADD bikes:rentable -122.2469854 37.8104049 station:3
> (integer) 1
> ```

🇻🇳 `GEOADD` lưu kinh độ, vĩ độ và tên của từng trạm vào cùng một key.

📖 **Nguyên văn**
> ```
> > GEOSEARCH bikes:rentable FROMLONLAT -122.2612767 37.7936847 BYRADIUS 5 km WITHDIST
> 1) 1) "station:1"
>    2) "1.8523"
> 2) 1) "station:2"
>    2) "1.4979"
> 3) 1) "station:3"
>    2) "2.2441"
> ```

🇻🇳 `GEOSEARCH` tìm mọi trạm trong bán kính 5 km quanh một toạ độ, `WITHDIST` trả kèm khoảng cách.

### 4.7. Các kiểu xác suất khác và kiểu nâng cao

📖 **Nguyên văn**
> "These data types let you gather and calculate statistics in a way that is approximate but highly efficient. The following types are available:
> Bloom filter
> Count-min sketch
> Cuckoo filter
> HyperLogLog
> t-digest
> Top-K"

🇻🇳 **Dịch**
> "Các kiểu dữ liệu này cho phép bạn thu thập và tính toán thống kê theo cách gần đúng nhưng rất hiệu quả. Các kiểu sau hiện có:
> Bloom filter
> Count-min sketch
> Cuckoo filter
> HyperLogLog
> t-digest
> Top-K"

📖 **Nguyên văn** — JSON
> "Redis JSON provides structured, hierarchical arrays and key-value objects that match the popular JSON text file format. You can import JSON text into Redis objects and access, modify, and query individual data elements."

🇻🇳 **Dịch**
> "Redis JSON cung cấp các mảng và object key-value có cấu trúc, phân cấp, khớp với định dạng file văn bản JSON phổ biến. Bạn có thể import văn bản JSON vào các Redis object rồi truy cập, sửa đổi và truy vấn từng phần tử dữ liệu riêng lẻ."

📖 **Nguyên văn** — Vector sets
> "Redis vector sets are a specialized data type designed for managing high-dimensional vector data, enabling fast and efficient vector similarity search within Redis. Vector sets are optimized for use cases involving machine learning, recommendation systems, and semantic search, where each vector represents a data point in multi-dimensional space."

🇻🇳 **Dịch**
> "Redis vector set là một kiểu dữ liệu chuyên biệt được thiết kế để quản lý dữ liệu vector nhiều chiều, cho phép tìm kiếm tương đồng vector (vector similarity search) nhanh và hiệu quả ngay trong Redis. Vector set được tối ưu cho các use case liên quan tới machine learning, hệ thống gợi ý và semantic search, trong đó mỗi vector biểu diễn một điểm dữ liệu trong không gian nhiều chiều."

---

## 5. Lệnh cơ bản

### 5.1. MSET / MGET

📖 **Nguyên văn** — trang lệnh `MSET`
> "Sets the given keys to their respective values.
> MSET replaces existing values with new values, just as regular SET.
> See MSETNX if you don't want to overwrite existing values.
> MSET is atomic, so all given keys are set at once.
> It is not possible for clients to see that some of the keys were updated while others are unchanged."

🇻🇳 **Dịch**
> "Đặt các key đã cho thành các value tương ứng của chúng.
> MSET thay thế value cũ bằng value mới, giống hệt SET thông thường.
> Xem MSETNX nếu bạn không muốn ghi đè các value đang tồn tại.
> MSET là atomic, nên toàn bộ key đã cho được đặt cùng một lúc.
> Client không thể quan sát thấy trạng thái trong đó một số key đã được cập nhật còn số khác thì chưa."

📖 **Nguyên văn** — trang lệnh `MGET`
> "Returns the values of all specified keys."

🇻🇳 **Dịch**
> "Trả về value của tất cả các key được chỉ định."

📖 **Nguyên văn** — ví dụ trên trang *Redis Strings* (mô tả: *"Set and retrieve multiple values using MSET and MGET when you need to reduce round trips to the server"*)
> ```
> > MSET bike:1 "Deimos" bike:2 "Ares" bike:3 "Vanth"
> OK
> > MGET bike:1 bike:2 bike:3
> 1) "Deimos"
> 2) "Ares"
> 3) "Vanth"
> ```

🇻🇳 Ghi và đọc ba key trong đúng hai lần gọi, thay vì sáu lần — giảm số round trip tới server.

### 5.2. INCR / DECR

📖 **Nguyên văn** — trang lệnh `INCR`
> "Increments the number stored at key by one.
> If the key does not exist, it is set to 0 before performing the operation.
> An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer.
> This operation is limited to 64 bit signed integers."

🇻🇳 **Dịch**
> "Tăng số đang lưu tại key lên một đơn vị.
> Nếu key chưa tồn tại, nó được đặt bằng 0 trước khi thực hiện thao tác.
> Lỗi được trả về nếu key chứa value sai kiểu hoặc chứa một string không thể biểu diễn thành số nguyên.
> Thao tác này giới hạn ở số nguyên có dấu 64 bit."

📖 **Nguyên văn**
> "Note: this is a string operation because Redis does not have a dedicated integer type.
> The string stored at the key is interpreted as a base-10 64-bit signed integer to execute the operation.
> Redis stores integers in their integer representation, so for string values that actually hold an integer, there is no overhead for storing the string representation of the integer."

🇻🇳 **Dịch**
> "Lưu ý: đây là một thao tác trên string vì Redis không có kiểu số nguyên riêng.
> String lưu tại key được diễn giải thành số nguyên có dấu 64 bit hệ cơ số 10 để thực hiện thao tác.
> Redis lưu số nguyên ở dạng biểu diễn số nguyên của chúng, nên với các string value thực chất chứa một số nguyên thì không có chi phí phụ trội cho việc lưu dạng chuỗi của số đó."

📖 **Nguyên văn** — trang lệnh `DECR`
> "Decrements the number stored at key by one."

🇻🇳 **Dịch**
> "Giảm số đang lưu tại key đi một đơn vị."

📖 **Nguyên văn** — ví dụ gốc trên trang *Redis Strings*
> ```
> > SET total_crashes 0
> OK
> > INCR total_crashes
> (integer) 1
> > INCRBY total_crashes 10
> (integer) 11
> ```

🇻🇳 `INCR` tăng 1, `INCRBY` tăng theo số chỉ định; cả hai trả về giá trị sau khi tăng.

### 5.3. INCR là atomic — vì sao quan trọng

📖 **Nguyên văn**
> "The INCR command parses the string value as an integer, increments it by one, and finally sets the obtained value as the new value.
> There are other similar commands like INCRBY, DECR and DECRBY. Internally it's always the same command, acting in a slightly different way."

🇻🇳 **Dịch**
> "Lệnh INCR phân tích string value thành một số nguyên, tăng nó lên một, và cuối cùng đặt giá trị thu được làm value mới.
> Còn có các lệnh tương tự khác như INCRBY, DECR và DECRBY. Bên trong thì luôn là cùng một lệnh, chỉ hành xử hơi khác nhau."

📖 **Nguyên văn**
> "What does it mean that INCR is atomic?
> That even multiple clients issuing INCR against the same key will never enter into a race condition. For instance, it will never happen that client 1 reads "10", client 2 reads "10" at the same time, both increment to 11, and set the new value to 11. The final value will always be 12 and the read-increment-set operation is performed while all the other clients are not executing a command at the same time."

🇻🇳 **Dịch**
> "Việc INCR là atomic nghĩa là gì?
> Nghĩa là ngay cả khi nhiều client cùng gửi INCR lên cùng một key thì cũng không bao giờ rơi vào race condition. Ví dụ, sẽ không bao giờ xảy ra chuyện client 1 đọc được "10", client 2 cũng đọc được "10" cùng lúc, cả hai cùng tăng lên 11, rồi cùng đặt value mới là 11. Giá trị cuối cùng sẽ luôn là 12, và thao tác đọc-tăng-ghi được thực hiện trong lúc tất cả các client khác không đang chạy lệnh nào cùng thời điểm."

### 5.4. DEL / EXISTS / TYPE

📖 **Nguyên văn** — trang lệnh `DEL`
> "Removes the specified keys.
> A key is ignored if it does not exist."

🇻🇳 **Dịch**
> "Xoá các key được chỉ định.
> Một key sẽ bị bỏ qua nếu nó không tồn tại."

📖 **Nguyên văn** — trang lệnh `EXISTS`
> "Returns the number of keys that exist.
> If you specify the same existing key multiple times, EXISTS counts it each time. For example, if somekey exists, EXISTS somekey somekey returns 2."

🇻🇳 **Dịch**
> "Trả về số lượng key đang tồn tại.
> Nếu bạn chỉ định cùng một key đang tồn tại nhiều lần, EXISTS đếm nó mỗi lần. Ví dụ, nếu somekey tồn tại thì EXISTS somekey somekey trả về 2."

📖 **Nguyên văn** — trang lệnh `TYPE`
> "Returns the string representation of the type of the value stored at key."

🇻🇳 **Dịch**
> "Trả về biểu diễn dạng chuỗi của kiểu value đang được lưu tại key."

---

## 6. Tính đơn luồng (single-threaded) của Redis

Phần này trích từ trang *Diagnosing latency issues* của redis.io, mục "Single threaded nature of Redis".

📖 **Nguyên văn**
> "Redis uses a mostly single threaded design. This means that a single process serves all the client requests, using a technique called multiplexing. This means that Redis can serve a single request in every given moment, so all the requests are served sequentially. This is very similar to how Node.js works as well. However, both products are not often perceived as being slow. This is caused in part by the small amount of time to complete a single request, but primarily because these products are designed to not block on system calls, such as reading data from or writing data to a socket."

🇻🇳 **Dịch**
> "Redis dùng một thiết kế gần như đơn luồng. Nghĩa là một tiến trình duy nhất phục vụ toàn bộ client request, bằng một kỹ thuật gọi là multiplexing. Nghĩa là tại mỗi thời điểm Redis chỉ có thể phục vụ một request, nên mọi request được phục vụ tuần tự. Điều này rất giống cách Node.js hoạt động. Tuy nhiên, cả hai sản phẩm này thường không bị coi là chậm. Một phần là do thời gian hoàn tất một request rất nhỏ, nhưng chủ yếu là vì chúng được thiết kế để không block ở các system call, chẳng hạn đọc dữ liệu từ socket hoặc ghi dữ liệu vào socket."

📖 **Nguyên văn**
> "I said that Redis is mostly single threaded since actually from Redis 2.4 we use threads in Redis in order to perform some slow I/O operations in the background, mainly related to disk I/O, but this does not change the fact that Redis serves all the requests using a single thread."

🇻🇳 **Dịch**
> "Tôi nói Redis *gần như* đơn luồng vì thực ra từ Redis 2.4 chúng tôi có dùng thread trong Redis để thực hiện một số thao tác I/O chậm ở chế độ nền, chủ yếu liên quan tới disk I/O, nhưng điều đó không thay đổi sự thật rằng Redis phục vụ mọi request bằng một thread duy nhất."

**Hệ quả thứ nhất — lệnh chạy tuần tự nên atomic một cách tự nhiên.** Đây chính là nền của đoạn nói về `INCR` ở mục 5.3: "the read-increment-set operation is performed while all the other clients are not executing a command at the same time". Tài liệu về Transactions nói cùng ý này ở cấp độ transaction:

📖 **Nguyên văn** — trang *Transactions*
> "All the commands in a transaction are serialized and executed sequentially. A request sent by another client will never be served in the middle of the execution of a Redis Transaction. This guarantees that the commands are executed as a single isolated operation."

🇻🇳 **Dịch**
> "Toàn bộ lệnh trong một transaction được serialize và thực thi tuần tự. Một request do client khác gửi sẽ không bao giờ được phục vụ ở giữa quá trình thực thi một Redis Transaction. Điều này đảm bảo các lệnh được thực thi như một thao tác đơn lẻ, cô lập."

**Hệ quả thứ hai — một lệnh chậm chặn cả server.**

📖 **Nguyên văn**
> "A consequence of being single thread is that when a request is slow to serve all the other clients will wait for this request to be served. When executing normal commands, like GET or SET or LPUSH this is not a problem at all since these commands are executed in constant (and very small) time. However there are commands operating on many elements, like SORT, LREM, SUNION and others. For instance taking the intersection of two big sets can take a considerable amount of time."

🇻🇳 **Dịch**
> "Một hệ quả của việc đơn luồng là khi một request phục vụ chậm thì mọi client khác sẽ phải chờ request đó được phục vụ xong. Khi chạy các lệnh thông thường như GET, SET hay LPUSH thì điều này hoàn toàn không thành vấn đề, vì các lệnh này chạy trong thời gian hằng số (và rất nhỏ). Tuy nhiên có những lệnh thao tác trên nhiều phần tử, như SORT, LREM, SUNION và các lệnh khác. Ví dụ, lấy giao của hai set lớn có thể tốn một khoảng thời gian đáng kể."

📖 **Nguyên văn**
> "The algorithmic complexity of all commands is documented. A good practice is to systematically check it when using commands you are not familiar with.
> If you have latency concerns you should either not use slow commands against values composed of many elements, or you should run a replica using Redis replication where you run all your slow queries."

🇻🇳 **Dịch**
> "Độ phức tạp thuật toán của mọi lệnh đều được ghi trong tài liệu. Một thói quen tốt là kiểm tra nó một cách có hệ thống khi dùng những lệnh bạn chưa quen.
> Nếu bạn lo về latency thì hoặc là đừng dùng các lệnh chậm lên những value gồm nhiều phần tử, hoặc là chạy một replica bằng Redis replication và dồn mọi truy vấn chậm vào đó."

> [!danger] KEYS là ví dụ kinh điển của "một lệnh chậm chặn cả server"
> 📖 **Nguyên văn**
> > "IMPORTANT NOTE: a VERY common source of latency generated by the execution of slow commands is the use of the KEYS command in production environments. KEYS, as documented in the Redis documentation, should only be used for debugging purposes. Since Redis 2.8 a new commands were introduced in order to iterate the key space and other large collections incrementally, please check the SCAN, SSCAN, HSCAN and ZSCAN commands for more information."
>
> 🇻🇳 **Dịch**
> > "LƯU Ý QUAN TRỌNG: một nguồn latency RẤT phổ biến sinh ra bởi việc chạy các lệnh chậm là việc dùng lệnh KEYS trong môi trường production. KEYS, như đã ghi trong tài liệu Redis, chỉ nên dùng cho mục đích debug. Từ Redis 2.8, các lệnh mới đã được giới thiệu để duyệt key space và các tập lớn khác một cách tăng dần; hãy xem các lệnh SCAN, SSCAN, HSCAN và ZSCAN để biết thêm."

---

## 7. 💡 Ví dụ đời sống: cache không chỉ lưu chuỗi

**Lớp 1 — chuyện đời thường.**
Bạn là quản lý một quán cà phê, và cần theo dõi "hôm nay bán được bao nhiêu ly".

- **Cách 1 — tờ giấy dán tường.** Trên tường có một mảnh giấy ghi con số. Mỗi lần bán một ly, nhân viên phải: bước tới tường, đọc số, gỡ giấy, gạch đi, viết số mới, dán lại. Hai nhân viên cùng bán một lúc, cả hai cùng đọc thấy "37", cả hai cùng viết "38" — mất một ly.
- **Cách 2 — cái đếm tay (clicker).** Nhân viên chỉ bấm một cái "tách". Bản thân cái máy đảm bảo mỗi cú bấm cộng đúng một đơn vị. Không ai phải đọc rồi viết lại.

**Lớp 2 — khái niệm.**
Tờ giấy dán tường là cache chỉ biết lưu chuỗi: mọi thay đổi đều phải "đọc cả — sửa — ghi đè cả", và chỗ nối giữa ba bước đó là nơi race condition chui vào. Cái clicker là cấu trúc dữ liệu nằm sẵn ở phía server, với một thao tác "tăng" được định nghĩa ngay trên nó. Đây chính là điều docs nói: *"Redis is a data structure server"*, và *"even multiple clients issuing INCR against the same key will never enter into a race condition"*.

Mở rộng ra cả bộ dụng cụ của quán:

| Việc cần làm ở quán | "Tờ giấy" | Dụng cụ chuyên dụng | Kiểu Redis |
|---|---|---|---|
| Đếm số ly bán hôm nay | Gỡ giấy, sửa số, dán lại | Clicker | String + `INCR` |
| Hồ sơ một khách quen | Chép lại cả tờ khai mỗi lần đổi số điện thoại | Tủ hồ sơ có ô từng mục | Hash + `HSET`/`HGET` |
| Bảng "khách mua nhiều nhất tháng" | Chép lại cả bảng rồi sắp xếp tay | Bảng ghim tự đẩy thẻ lên đúng chỗ | Sorted set + `ZADD`/`ZRANGE` |
| Danh sách bàn đang chờ phục vụ | Viết thêm dòng vào cuối trang | Kẹp phiếu order kiểu xoay vòng | List + `LPUSH`/`RPOP` |
| "Hôm nay có bao nhiêu khách khác nhau ghé?" | Ghi tên từng người rồi lọc trùng | Sổ điểm danh có dò trùng | Set + `SADD`/`SCARD` |

**Lớp 3 — code.**
Cùng một bài toán "đếm lượt xem bài viết", viết theo hai kiểu (ví dụ minh hoạ, không trích từ docs):

```
# Kiểu "tờ giấy": đọc — sửa — ghi. Có khe hở race condition.
> GET post:42:views
"37"
# ... app cộng 1 trong RAM của nó ...
> SET post:42:views 38
OK

# Kiểu "clicker": một lệnh duy nhất, atomic.
> INCR post:42:views
(integer) 38
```

---

## 8. So với PostgreSQL: kiểu dữ liệu ở đây khác chỗ nào

Ở [[11 - NULL, Hàm String, Date và JSON]] ta đã gặp khái niệm "kiểu dữ liệu" trong PostgreSQL: `TEXT`, `INTEGER`, `DATE`, `JSONB`... Đó là kiểu của **một cột trong một hàng**, và chúng phục vụ việc mô tả *giá trị đó là gì*.

Kiểu dữ liệu của Redis là chuyện khác: đó là kiểu của **value gắn với một key**, và điều quan trọng không phải "value này là gì" mà là "value này hỗ trợ những thao tác nào". Chọn Hash thay vì String không phải vì dữ liệu "có bản chất hash", mà vì bạn cần `HGET` / `HINCRBY` / `HEXPIRE`.

Hai điểm giao nhau đáng chú ý, cả hai đều trích được từ docs:

- Redis có kiểu **JSON** — *"structured, hierarchical arrays and key-value objects that match the popular JSON text file format"* — vai trò khá gần với `JSONB` của PostgreSQL, cùng cho phép *"access, modify, and query individual data elements"*.
- Redis có **Transactions** với đảm bảo *"All the commands in a transaction are serialized and executed sequentially"*, nhưng docs nói rõ Redis khác database quan hệ ở chỗ:

📖 **Nguyên văn**
> "Redis does not support rollbacks of transactions since supporting rollbacks would have a significant impact on the simplicity and performance of Redis."

🇻🇳 **Dịch**
> "Redis không hỗ trợ rollback transaction, vì hỗ trợ rollback sẽ ảnh hưởng đáng kể tới tính đơn giản và hiệu năng của Redis."

> [!warning] Đừng mang kỳ vọng ACID của PostgreSQL sang Redis
> Một lệnh trong transaction của Redis fail thì các lệnh còn lại **vẫn chạy**: *"even when a command fails, all the other commands in the queue are processed – Redis will not stop the processing of commands."* (🇻🇳 "ngay cả khi một lệnh fail, toàn bộ các lệnh còn lại trong hàng đợi vẫn được xử lý — Redis sẽ không dừng việc xử lý lệnh lại.")

---

## Liên kết

- Bài trước: [[02 - HTTP Caching]]
- Bài kế: [[04 - Redis - Expiration, Eviction và Persistence]]
- [[01 - Caching là gì]] — vì sao cần cache, TTL và vòng đời dữ liệu cache
- [[11 - NULL, Hàm String, Date và JSON]] — kiểu dữ liệu và JSON/JSONB phía PostgreSQL, đối chiếu với mục 8
- [[05 - Transactions, ACID và MVCC]] — đảm bảo transaction của database quan hệ, so với "no rollback" của Redis
- [[04 - Indexes]] · [[07 - N+1 Problem]] — giảm tải DB bằng index và sửa truy vấn, chứ không phải bằng cách phủ cache lên trên
- [[12 - Cookie và Session based Authentication]] — session store; roadmap liệt kê "session management" là một use case của Redis

## Nguồn tham khảo

- Redis Docs — *Quick starts* : https://redis.io/docs/latest/develop/get-started/
- Redis Docs — *Redis data types* : https://redis.io/docs/latest/develop/data-types/
- Redis Docs — *Redis Strings* : https://redis.io/docs/latest/develop/data-types/strings/
- Redis Docs — *Redis lists* : https://redis.io/docs/latest/develop/data-types/lists/
- Redis Docs — *Redis sets* : https://redis.io/docs/latest/develop/data-types/sets/
- Redis Docs — *Redis hashes* : https://redis.io/docs/latest/develop/data-types/hashes/
- Redis Docs — *Redis sorted sets* : https://redis.io/docs/latest/develop/data-types/sorted-sets/
- Redis Docs — *Redis Streams* : https://redis.io/docs/latest/develop/data-types/streams/
- Redis Docs — *Redis bitmaps* : https://redis.io/docs/latest/develop/data-types/strings/bitmaps/
- Redis Docs — *HyperLogLog* : https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/
- Redis Docs — *Redis geospatial* : https://redis.io/docs/latest/develop/data-types/geospatial/
- Redis Docs — *Keys and values* : https://redis.io/docs/latest/develop/using-commands/keyspace/
- Redis Docs — *Transactions* : https://redis.io/docs/latest/develop/using-commands/transactions/
- Redis Docs — *Diagnosing latency issues* : https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
- Redis Docs — command references : https://redis.io/docs/latest/commands/set/ · https://redis.io/docs/latest/commands/get/ · https://redis.io/docs/latest/commands/mset/ · https://redis.io/docs/latest/commands/mget/ · https://redis.io/docs/latest/commands/del/ · https://redis.io/docs/latest/commands/exists/ · https://redis.io/docs/latest/commands/type/ · https://redis.io/docs/latest/commands/incr/ · https://redis.io/docs/latest/commands/decr/ · https://redis.io/docs/latest/commands/scan/ · https://redis.io/docs/latest/commands/keys/
- roadmap.sh backend roadmap — nội dung node "Redis" : https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/roadmaps/backend/content/redis%40M0iaSSdVPWaCUpyTG50Vf.md
