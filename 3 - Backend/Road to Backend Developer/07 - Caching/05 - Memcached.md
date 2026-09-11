# 05 — Memcached

> **Nguồn chính:** Memcached Documentation (docs.memcached.org) — https://docs.memcached.org/
> Bài này bám trang **Memcached Overview**, **Basic Text Protocol**, **Performance and Efficiency**, **FAQ** và file `doc/protocol.txt` / `doc/new_lru.txt` trong source tree.

> [!note] Về đường dẫn nguồn
> Các trang wiki cũ trên GitHub (`.../wiki/Overview`, `.../wiki/Commands`, `.../wiki/UserInternals`...) nay chỉ còn đúng một dòng trỏ sang site tài liệu mới — ví dụ `Overview.md` hiện chỉ chứa `See https://docs.memcached.org/`. Vì vậy mọi câu trích dưới đây lấy từ **docs.memcached.org** và các file text gốc trong repo.

---

## Memcached là gì

📖 **Nguyên văn** — *Memcached Overview*
> "Free & open source, high-performance, distributed memory object caching system, generic in nature, but intended for use in speeding up dynamic web applications by alleviating database load."
>
> "Memcached is an in-memory key-value store for small arbitrary data (strings, objects) from results of database calls, API calls, or page rendering."
>
> "Memcached is simple yet powerful. Its simple design promotes quick deployment, ease of development, and solves many problems facing large data caches. Its API is available for most popular languages."

🇻🇳 **Dịch**
> "Miễn phí & mã nguồn mở, **distributed memory object caching system** hiệu năng cao, có tính tổng quát, nhưng nhắm tới việc tăng tốc các ứng dụng web động bằng cách giảm tải cho database."
>
> "Memcached là một **in-memory key-value store** dành cho dữ liệu nhỏ tuỳ ý (chuỗi, đối tượng) lấy từ kết quả của các lệnh gọi database, gọi API, hoặc render trang."
>
> "Memcached đơn giản mà mạnh mẽ. Thiết kế đơn giản của nó giúp triển khai nhanh, dễ phát triển, và giải quyết nhiều vấn đề mà các cache dữ liệu lớn gặp phải. **API** của nó có sẵn cho hầu hết các ngôn ngữ phổ biến."

📖 **Nguyên văn** — *memcached.org — About Memcached*
> "memcached is a high-performance, distributed memory object caching system, generic in nature, but originally intended for use in speeding up dynamic web applications by alleviating database load."
>
> "You can think of it as a short-term memory for your applications."

🇻🇳 **Dịch**
> "memcached là một **distributed memory object caching system** hiệu năng cao, có tính tổng quát, nhưng ban đầu nhắm tới việc tăng tốc ứng dụng web động bằng cách giảm tải cho database."
>
> "Bạn có thể coi nó như **bộ nhớ ngắn hạn** cho ứng dụng của mình."

📖 **Nguyên văn** — *Overview → How Does It Work?*
> "Memcached is a developer tool, not a “code accelerator”, nor is it database middleware. If you’re trying to set up an application you have downloaded or purchased to use memcached, read your app’s documentation."

🇻🇳 **Dịch**
> "Memcached là một công cụ dành cho lập trình viên, **không phải** “bộ tăng tốc code”, cũng không phải middleware cho database. Nếu bạn đang cố cấu hình một ứng dụng tải về hoặc mua sẵn để dùng memcached, hãy đọc tài liệu của ứng dụng đó."

> [!warning] Memcached không tự động làm gì cả
> Trang *User Guide* nói thẳng: "Memcached is not an automatic application accelerator: it must be integrated into an application via code."
> 🇻🇳 "Memcached không phải bộ tăng tốc ứng dụng tự động: nó phải được tích hợp vào ứng dụng bằng code." Nghĩa là bạn phải tự viết logic đọc cache — trúng thì trả về, trượt thì query rồi `set` lại.

---

## Memcached gồm những gì

📖 **Nguyên văn** — *Overview → What is it Made Up Of?*
> "Client software, which is given a list of available memcached servers.
>
> A client-based hashing algorithm, which chooses a server based on the “key”.
>
> Server software, which stores values with their keys into an internal hash table.
>
> LRU, which determine when to throw out old data (if out of memory), or reuse memory."

🇻🇳 **Dịch**
> "Phần mềm **client**, được đưa cho một danh sách các memcached **server** khả dụng.
>
> Một thuật toán hashing **nằm ở phía client**, chọn ra server dựa trên “key”.
>
> Phần mềm **server**, lưu các value cùng key của chúng vào một hash table nội bộ.
>
> **LRU**, thứ quyết định khi nào vứt bỏ dữ liệu cũ (nếu hết bộ nhớ), hoặc tái sử dụng bộ nhớ."

Bốn thành phần này là toàn bộ Memcached: không query engine, không index, không replication, không scripting.

---

## Triết lý thiết kế

Trang Overview có hẳn một mục tên **Design Philosophy** — phần đáng đọc nhất của toàn bộ tài liệu Memcached.

### Simple Key/Value Store

📖 **Nguyên văn**
> "The server does not care what your data looks like. Items are made up of a key, an expiration time, optional flags, and raw data. It does not understand data structures; you must upload data that is pre-serialized. Some commands (incr/decr) may operate on the underlying data, but in a simple manner."

🇻🇳 **Dịch**
> "**Server không quan tâm dữ liệu của bạn trông như thế nào.** Một item gồm một key, một thời gian hết hạn, các flag tuỳ chọn, và dữ liệu thô. Nó **không hiểu cấu trúc dữ liệu**; bạn phải upload dữ liệu đã được serialize sẵn. Một vài lệnh (`incr`/`decr`) có thể thao tác lên dữ liệu bên dưới, nhưng theo cách rất đơn giản."

### Logic Half in Client, Half in Server

📖 **Nguyên văn**
> "A “memcached implementation” is partially in a client, and partially in a server. Clients understand how to choose which server to read or write to for an item, what to do when it cannot contact a server.
>
> The servers understand how to store and fetch items. They also manage when to evict or reuse memory."

🇻🇳 **Dịch**
> "Một “bản cài đặt memcached” nằm một phần ở **client**, một phần ở **server**. Client biết cách chọn server nào để đọc hoặc ghi một item, và phải làm gì khi không liên lạc được với một server.
>
> Server biết cách lưu và lấy item. Server cũng quản lý khi nào **evict** hoặc tái sử dụng bộ nhớ."

### Servers are Disconnected From Each Other

📖 **Nguyên văn**
> "Memcached servers are unaware of each other. There is no crosstalk, no synchronization, no broadcasting, no replication. Adding servers increases the available memory. Cache invalidation is simplified, as clients delete or overwrite data on the server which owns it directly."

🇻🇳 **Dịch**
> "**Các memcached server không hề biết đến nhau.** Không có trao đổi chéo, không đồng bộ, không broadcast, không replication. Thêm server thì tăng bộ nhớ khả dụng. Việc **cache invalidation** được đơn giản hoá, vì client xoá hoặc ghi đè dữ liệu trực tiếp trên server đang giữ dữ liệu đó."

### O(1)

📖 **Nguyên văn**
> "All commands are implemented to be as fast and lock-friendly as possible. This allows near-deterministic query speeds for all use cases.
>
> Queries on slow machines should run in well under 1ms. High end servers can serve millions of keys per second in throughput."

🇻🇳 **Dịch**
> "Mọi lệnh đều được cài đặt sao cho nhanh nhất và thân thiện với khoá nhất có thể. Điều này cho phép tốc độ query gần như **tất định (deterministic)** cho mọi use case.
>
> Query trên các máy chậm nên chạy dưới 1ms khá xa. Server cao cấp có thể phục vụ hàng triệu key mỗi giây về mặt throughput."

> [!note] Đây là con số của tài liệu, không phải benchmark của bạn
> Hai con số "well under 1ms" và "millions of keys per second" là trích nguyên văn từ trang Overview. Chúng là mô tả định tính của dự án, không phải kết quả đo trên hạ tầng cụ thể nào.

### Forgetting is a Feature

📖 **Nguyên văn**
> "Memcached is, by default, a Least Recently Used cache. Items expire after a specified amount of time. Both of these are elegant solutions to many problems; Expire items after a minute to limit stale data being returned, or flush unused data in an effort to retain frequently requested information.
>
> No “pauses” waiting for a garbage collector ensures low latency, and free space is lazily reclaimed."

🇻🇳 **Dịch**
> "Mặc định, Memcached là một cache kiểu **Least Recently Used**. Item hết hạn sau một khoảng thời gian định trước. Cả hai điều này đều là lời giải thanh lịch cho nhiều bài toán; cho item hết hạn sau một phút để hạn chế trả về dữ liệu cũ, hoặc dọn dữ liệu không dùng tới nhằm giữ lại thông tin được yêu cầu thường xuyên.
>
> Không có “khoảng dừng” chờ garbage collector giúp đảm bảo **latency** thấp, và không gian trống được thu hồi một cách lười (lazily)."

### Cache Invalidation

📖 **Nguyên văn**
> "Rather than broadcasting changes to all available hosts, clients directly address the server holding the data to be invalidated."

🇻🇳 **Dịch**
> "Thay vì broadcast thay đổi tới mọi host khả dụng, client **gửi thẳng** tới server đang giữ dữ liệu cần invalidate."

💡 **Ví dụ đời sống — con dao bếp và con dao Thuỵ Sĩ**
Con dao Thuỵ Sĩ có 20 công cụ: kéo, tuốc-nơ-vít, mở nút chai, dũa móng tay — tiện khi cắm trại. Nhưng không đầu bếp nào dùng nó để thái hành, vì lưỡi ngắn, cán cấn tay, và mỗi lần dùng phải mở đúng công cụ. Con dao bếp chỉ làm được **một** việc: cắt — đổi lại nó cắt nhanh, cắt chuẩn, cầm quen tay.

Memcached là con dao bếp. Nó không có list, sorted set, pub/sub, script, transaction, persistence. Đổi lại, mọi lệnh đều O(1), không có GC pause, và server không cần biết server khác tồn tại. Redis là con dao Thuỵ Sĩ — xem [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] để thấy sự đối lập.

---

## Mô hình dữ liệu: một item gồm những gì

📖 **Nguyên văn** — *Basic Text Protocol → Standard Protocol*
> "The “standard protocol stuff” of memcached involves running a command against an “item”. An item consists of:
>
> A key (arbitrary string up to 250 bytes in length. No space or newlines for ASCII mode)
>
> A 32bit “flag” value
>
> An expiration time, in seconds. ‘0’ means never expire. Can be up to 30 days. After 30 days, is treated as a unix timestamp of an exact date.
>
> A 64bit “CAS” value, which is kept unique.
>
> Arbitrary data"

🇻🇳 **Dịch**
> "Phần “giao thức tiêu chuẩn” của memcached xoay quanh việc chạy một lệnh lên một “item”. Một item gồm:
>
> Một **key** (chuỗi tuỳ ý dài tối đa **250 bytes**. Không có dấu cách hay xuống dòng khi ở chế độ ASCII)
>
> Một giá trị **“flag” 32 bit**
>
> Một **thời gian hết hạn**, tính bằng giây. ‘0’ nghĩa là không bao giờ hết hạn. Tối đa 30 ngày. Quá 30 ngày thì được hiểu là unix timestamp của một ngày cụ thể.
>
> Một giá trị **“CAS” 64 bit**, luôn được giữ là duy nhất.
>
> **Dữ liệu tuỳ ý**"

📖 **Nguyên văn** — *doc/protocol.txt → Keys*
> "Data stored by memcached is identified with the help of a key. A key is a text string which should uniquely identify the data for clients that are interested in storing and retrieving it.  Currently the length limit of a key is set at 250 characters (of course, normally clients wouldn't need to use such long keys); the key must not include control characters or whitespace."

🇻🇳 **Dịch**
> "Dữ liệu do memcached lưu được nhận diện qua một key. Key là một chuỗi text định danh duy nhất cho dữ liệu đối với các client muốn lưu và lấy nó. Hiện tại **giới hạn độ dài của key là 250 ký tự** (dĩ nhiên, client bình thường không cần key dài đến vậy); key **không được chứa ký tự điều khiển hay khoảng trắng**."

> [!warning] Value là một blob — server không nhìn vào bên trong
> Tài liệu gọi nó là "raw data" / "Arbitrary data". Server không biết đó là JSON, protobuf, hay ảnh PNG. Bạn muốn lưu object thì **phải tự serialize** ("you must upload data that is pre-serialized"). Muốn sửa một trường trong object thì phải `get` → deserialize → sửa → serialize → `set`. Không có `HSET` như Redis.

### Về kích thước value tối đa

Tài liệu **không** phát biểu trực tiếp một câu kiểu "the maximum item size is 1MB". Những gì trích được là:

📖 **Nguyên văn** — *Server Guide → Configuring → Inspecting Running Configuration* (output mẫu của `stats settings`)
> ```
> $ echo "stats settings" | nc localhost 11211
> STAT maxbytes 67108864
> STAT maxconns 1024
> STAT growth_factor 1.25
> STAT chunk_size 48
> STAT num_threads 4
> STAT cas_enabled yes
> STAT item_size_max 1048576
> END
> [... đã lược bớt vài dòng STAT không liên quan tới mục này ...]
> ```

🇻🇳 Output mẫu trong tài liệu cho thấy `item_size_max` = **1048576** byte (= 1 MiB) ở cấu hình mặc định, `maxbytes` = 67108864 (64 MB bộ nhớ item), `maxconns` = 1024, `num_threads` = 4.

📖 **Nguyên văn** — *Performance and Efficiency → How Memory Gets Allocated For Items*
> "The primary storage is broken up (by default) into 1 megabyte pages."
>
> "In slab class 1, each chunk is 80 bytes, and each page can then contain 13,107 chunks (or items). This continues all the way up to 1 megabyte."

🇻🇳 **Dịch**
> "Kho lưu trữ chính được chia (mặc định) thành các **page 1 megabyte**."
>
> "Ở slab class 1, mỗi chunk là 80 byte, và mỗi page khi đó chứa được 13.107 chunk (hay item). Chuyện này tiếp diễn lên đến tận 1 megabyte."

📖 **Nguyên văn** — *Basic Text Protocol → append*
> "Add this data after the last byte in an existing item. This does not allow you to extend past the item limit. Useful for managing lists."

🇻🇳 **Dịch**
> "Thêm dữ liệu này vào sau byte cuối cùng của một item đã tồn tại. Việc này **không cho phép bạn vượt quá giới hạn item**. Hữu ích để quản lý danh sách."

> [!note] Chốt lại về giới hạn
> - **Key: 250 ký tự/byte** — trích được nguyên văn từ hai nguồn độc lập (protocol.txt và trang Basic Text Protocol). Chắc chắn.
> - **Value: `item_size_max` mặc định 1048576 byte** — suy từ output mẫu `stats settings` trong tài liệu chính thức cộng câu "1 megabyte pages". Tài liệu không viết thành một câu khẳng định riêng, và giá trị này **cấu hình được**, nên đừng coi là hằng số. Muốn biết chắc trên instance của bạn: chạy `stats settings` và đọc `item_size_max`.

---

## Bảng lệnh cơ bản

Toàn bộ mô tả dưới đây trích nguyên văn từ trang *Basic Text Protocol*, trừ `touch` (trang này không liệt kê `touch`, nên lấy từ `doc/protocol.txt`).

| Lệnh | 📖 Mô tả nguyên văn | 🇻🇳 Diễn giải |
|---|---|---|
| `set` | "Most common command. Store this data, possibly overwriting any existing data. New items are at the top of the LRU." | Lệnh phổ biến nhất. Lưu dữ liệu, có thể ghi đè dữ liệu đang có. Item mới nằm ở đỉnh LRU. |
| `add` | "Store this data, only if it does not already exist. New items are at the top of the LRU. If an item already exists and an add fails, it promotes the item to the front of the LRU anyway." | Chỉ lưu nếu key **chưa** tồn tại. Nếu item đã có và `add` thất bại, item đó vẫn được đẩy lên đầu LRU. |
| `replace` | "Store this data, but only if the data already exists. Almost never used, and exists for protocol completeness (set, add, replace, etc)" | Chỉ lưu nếu key **đã** tồn tại. Gần như không ai dùng, tồn tại cho đủ bộ giao thức. |
| `append` | "Add this data after the last byte in an existing item. This does not allow you to extend past the item limit. Useful for managing lists." | Nối thêm dữ liệu vào cuối item đang có. Không vượt được giới hạn item. |
| `prepend` | "Same as append, but adding new data before existing data." | Như `append`, nhưng chèn vào **trước** dữ liệu cũ. |
| `cas` | "Check And Set (or Compare And Swap). An operation that stores data, but only if no one else has updated the data since you read it last. Useful for resolving race conditions on updating cache data." | Chỉ ghi nếu chưa ai cập nhật dữ liệu kể từ lần bạn đọc gần nhất. Dùng để xử lý **race condition**. |
| `get` | "Command for retrieving data. Takes one or more keys and returns all found items." | Lấy dữ liệu. Nhận **một hoặc nhiều** key, trả về mọi item tìm thấy. |
| `gets` | "An alternative get command for using with CAS. Returns a CAS identifier (a unique 64bit number) with the item. Return this value with the cas command. If the item’s CAS value has changed since you gets‘ed it, it will not be stored." | Biến thể của `get` dùng cho CAS. Trả kèm một **CAS identifier** 64 bit. |
| `delete` | "Removes an item from the cache, if it exists." | Xoá item khỏi cache, nếu nó tồn tại. |
| `incr` / `decr` | "Increment and Decrement. If an item stored is the string representation of an unsigned 64bit integer, you may run incr or decr commands to modify that number. You may only incr by positive values, or decr by positive values. They do not accept negative values." … "If a value does not already exist, incr/decr will fail." | Tăng/giảm. Chỉ hoạt động nếu value là **biểu diễn chuỗi** của số nguyên 64 bit không dấu. Chỉ nhận giá trị dương. **Không tự khởi tạo** key chưa tồn tại. |
| `touch` | "The \"touch\" command is used to update the expiration time of an existing item without fetching it." (`doc/protocol.txt`) | Cập nhật thời gian hết hạn của item mà **không cần lấy dữ liệu về**. |
| `stats` | "ye ‘ole basic stats command." | Lệnh thống kê cơ bản. |
| `stats items` | "Returns some information, broken down by slab, about items stored in memcached." | Thông tin về item, chia theo **slab**. |
| `stats slabs` | "Returns more information, broken down by slab, about items stored in memcached. More centered to performance of a slab rather than counts of particular items." | Thông tin thiên về hiệu năng của từng slab. |
| `stats sizes` | "A special command that shows you how items would be distributed if slabs were broken into 32byte buckets instead of your current number of slabs. Useful for determining how efficient your slab sizing is." | Mô phỏng phân bố item nếu slab được chia theo bucket 32 byte. Dùng để đánh giá slab sizing. |
| `flush_all` | "Invalidate all existing cache items. Optionally takes a parameter, which means to invalidate all items after N seconds have passed." | Vô hiệu hoá toàn bộ item trong cache. |

📖 **Nguyên văn** — *`touch` trong `doc/protocol.txt`*
> "<exptime> is expiration time. Works the same as with the update commands (set/add/etc). This replaces the existing expiration time. If an existing item were to expire in 10 seconds, but then was touched with an expiration time of \"20\", the item would then expire in 20 seconds."

🇻🇳 **Dịch**
> "`<exptime>` (thời gian hết hạn). Hoạt động giống như với các lệnh cập nhật (`set`/`add`/v.v.). Nó **thay thế** thời gian hết hạn hiện có. Nếu một item sắp hết hạn sau 10 giây, rồi được `touch` với thời gian hết hạn là \"20\", thì item sẽ hết hạn sau 20 giây."

> [!danger] `flush_all` không giải phóng bộ nhớ
> 📖 "This command does not pause the server, as it returns immediately. It does not free up or flush memory at all, it just causes all items to expire."
> 🇻🇳 "Lệnh này không làm server dừng lại, vì nó trả về ngay lập tức. Nó **hoàn toàn không** giải phóng hay xả bộ nhớ, nó chỉ khiến toàn bộ item hết hạn."
> Nghĩa là: `flush_all` xoá sạch cache về mặt logic — mọi request sau đó đều miss và đổ thẳng xuống database. Trên hệ thống đang chạy tải cao, đây là cách gây **thundering herd** nhanh nhất.

> [!warning] `stats sizes` có thể làm treo instance
> 📖 **Nguyên văn** "WARNING this is a development command. As of 1.4 it is still the only command which will lock your memcached instance for some time. If you have many millions of stored items, it can become unresponsive for several minutes. Run this at your own risk."
> 🇻🇳 "CẢNH BÁO đây là lệnh dành cho phát triển. Tính đến bản 1.4 nó vẫn là lệnh duy nhất sẽ **khoá instance memcached của bạn trong một khoảng thời gian**. Nếu bạn có hàng triệu item, nó có thể ngừng phản hồi trong vài phút. Chạy thì tự chịu rủi ro."

---

## `cas` — Check And Set

Đây là tính năng ít người dùng nhưng lại là thứ duy nhất Memcached cho bạn để chống ghi đè khi có tranh chấp.

📖 **Nguyên văn** — *doc/protocol.txt → Storage commands*
> "\"cas\" is a check and set operation which means \"store this data but only if no one else has updated since I last fetched it.\""
>
> "- <cas unique> is a unique 64-bit value of an existing entry.
>   Clients should use the value returned from the \"gets\" command
>   when issuing \"cas\" updates."

🇻🇳 **Dịch**
> "`cas` là một thao tác **check and set**, nghĩa là \"lưu dữ liệu này, nhưng chỉ khi chưa ai cập nhật nó kể từ lần tôi lấy về gần nhất\"."
>
> "`<cas unique>` là một giá trị 64 bit duy nhất của một entry đang tồn tại. Client nên dùng giá trị trả về từ lệnh `gets` khi phát lệnh `cas`."

📖 **Nguyên văn** — *doc/protocol.txt → phản hồi của storage command*
> "- \"STORED\r\n\", to indicate success.
>
> - \"NOT_STORED\r\n\" to indicate the data was not stored, but not because of an error. This normally means that the condition for an \"add\" or a \"replace\" command wasn't met.
>
> - \"EXISTS\r\n\" to indicate that the item you are trying to store with a \"cas\" command has been modified since you last fetched it.
>
> - \"NOT_FOUND\r\n\" to indicate that the item you are trying to store with a \"cas\" command did not exist."

🇻🇳 **Dịch**
> "`STORED` — thành công.
> `NOT_STORED` — dữ liệu không được lưu, nhưng không phải do lỗi. Thường nghĩa là điều kiện của `add` hoặc `replace` không thoả.
> **`EXISTS`** — item bạn đang cố lưu bằng `cas` **đã bị sửa kể từ lần bạn lấy nó về**.
> **`NOT_FOUND`** — item bạn đang cố lưu bằng `cas` không tồn tại."

### Vì sao cần `cas`

Kịch bản kinh điển với `get` + `set` thường:

```
Thời điểm   Client A                      Client B
t1          get("cart:42") -> {A:1}
t2                                        get("cart:42") -> {A:1}
t3          thêm món B -> {A:1,B:1}
t4          set("cart:42", {A:1,B:1})
t5                                        thêm món C -> {A:1,C:1}
t6                                        set("cart:42", {A:1,C:1})   <-- món B biến mất
```

🇻🇳 Đây là **lost update**: cập nhật của A bị B ghi đè mất, và không ai biết. Với `cas`, `gets` ở t1/t2 trả về kèm một số 64 bit. Đến t6, `cas` của B mang theo số cũ, server thấy số đã đổi (vì A ghi ở t4) và trả `EXISTS` thay vì ghi đè. B biết mình thua và đọc lại rồi thử lại.

📖 **Nguyên văn** — *Basic Text Protocol → gets*
> "If the item’s CAS value has changed since you gets‘ed it, it will not be stored."

🇻🇳 **Dịch**
> "Nếu giá trị CAS của item đã thay đổi kể từ lúc bạn `gets` nó, thì nó sẽ **không được lưu**."

💡 **Ví dụ đời sống — sửa file Google Docs offline**
Hai người cùng tải một file Word về sửa rồi upload đè lên. Người upload sau thắng, sửa của người trước bay sạch. `cas` giống như hệ thống ghi kèm số phiên bản: khi bạn upload, nó kiểm tra "bản bạn tải về là v7, nhưng trên server giờ là v8" và từ chối, bắt bạn tải lại bản mới.

> [!note] CAS có thể bị tắt
> 📖 "CAS is optional (can be disabled entirely with -C, and there are more fields that internally make up an item, but these are what your client interacts with."
> 🇻🇳 "CAS là tuỳ chọn (có thể tắt hoàn toàn bằng `-C`, và còn nhiều trường khác cấu thành một item ở bên trong, nhưng đây là những thứ client của bạn tương tác)." Trong output `stats settings` ở trên, `cas_enabled` = `yes`.

> [!warning] `cas` không phải transaction
> Nó chỉ bảo vệ **một key, một thao tác ghi**. Không có cách nào ghi nguyên tử nhiều key cùng lúc trong Memcached. Nếu bài toán của bạn cần thế, cache không phải chỗ để đặt nó — xem [[05 - Transactions, ACID và MVCC]].

---

## Cấp phát bộ nhớ: slab allocator

📖 **Nguyên văn** — *Performance and Efficiency → How Memory Gets Allocated For Items*
> "Memory assigned via the -m commandline argument to memcached is reserved for item data storage. The primary storage is broken up (by default) into 1 megabyte pages. Each page is then assigned into slab classes as necessary, then cut into chunks of a specific size for that slab class.
>
> Once a page is assigned to a class, it is never moved. If your access patterns end up putting 80% of your pages in class 3, there will be less memory available for class 4. The best way to think about this is that memcached is actually many smaller individual caches. Each class has its own set of statistical counters, and its own LRU."

🇻🇳 **Dịch**
> "Bộ nhớ chỉ định qua tham số dòng lệnh `-m` được dành riêng cho việc lưu dữ liệu item. Kho lưu trữ chính được chia (mặc định) thành các **page 1 megabyte**. Mỗi page sau đó được gán vào các **slab class** khi cần, rồi cắt thành các **chunk** có kích thước cụ thể của slab class đó.
>
> **Một khi page đã được gán cho một class, nó không bao giờ được chuyển đi.** Nếu access pattern của bạn dồn 80% số page vào class 3, thì sẽ còn ít bộ nhớ hơn cho class 4. Cách nghĩ đúng nhất là: memcached thực ra là **nhiều cache nhỏ riêng biệt**. Mỗi class có bộ đếm thống kê riêng, và **LRU riêng**."

📖 **Nguyên văn** — *bảng slab class in ra khi chạy `memcached -vv`*
> ```
> $ ./memcached -vv
> slab class   1: chunk size        80 perslab   13107
> slab class   2: chunk size       104 perslab   10082
> slab class   3: chunk size       136 perslab    7710
> slab class   4: chunk size       176 perslab    5957
> slab class   5: chunk size       224 perslab    4681
> [...etc...]
> ```

🇻🇳 Mỗi slab class có một `chunk size` cố định, tăng dần theo hệ số (`growth_factor` mặc định 1.25 theo output `stats settings` ở trên), và `perslab` là số chunk chứa được trong một page 1 MB.

📖 **Nguyên văn** — *cùng mục*
> "When storing items, they are pushed into the slab class of the nearest fit. If your key + misc data + value is 50 bytes total, it will go into class 1, with an overhead loss of 30 bytes. If your data is 90 bytes total, it will go into class2, with an overhead of 14 bytes."
>
> "You can adjust the slab classes with -f and inspect them in various ways, but those’re more advanced topics for when you need them. It’s best to be aware of the basics because they can bite you."

🇻🇳 **Dịch**
> "Khi lưu item, chúng được nhét vào slab class **vừa khít nhất**. Nếu key + dữ liệu phụ + value của bạn tổng cộng 50 byte, nó sẽ vào class 1, **hao phí 30 byte**. Nếu dữ liệu tổng cộng 90 byte, nó vào class 2, hao phí 14 byte."
>
> "Bạn có thể chỉnh slab class bằng `-f` và soi chúng theo nhiều cách, nhưng đó là chủ đề nâng cao dành cho khi bạn thực sự cần. Tốt nhất là nắm được phần cơ bản vì **chúng có thể cắn bạn**."

### Hệ quả: phân mảnh theo slab class

Hai hệ quả trực tiếp, cả hai đều trích được:

1. **Lãng phí trong chunk.** Item 50 byte vào chunk 80 byte → mất 30 byte. Tài liệu gọi thẳng là "overhead loss".
2. **Kẹt page theo class.** "Once a page is assigned to a class, it is never moved." Nếu hôm nay ứng dụng lưu toàn item nhỏ, page dồn hết vào class thấp; mai đổi sang lưu item lớn thì class lớn đói bộ nhớ dù tổng RAM vẫn còn.

📖 **Nguyên văn** — *Maintenance → Slab imbalance*
> "A more complicated issue is an imbalance of the amount of memory assigned per slab, compared to where your actual data wants to go."
>
> "If the slabs with the highest evictions do not line up with the pages very well, you need to restart memcached so it can re-allocate memory."

🇻🇳 **Dịch**
> "Một vấn đề phức tạp hơn là **sự mất cân bằng** giữa lượng bộ nhớ được gán cho mỗi slab so với nơi dữ liệu thực tế của bạn muốn đi vào."
>
> "Nếu các slab có số eviction cao nhất không khớp với số page cho lắm, bạn cần **restart memcached** để nó cấp phát lại bộ nhớ."

💡 **Ví dụ đời sống — tủ để giày chia ô cố định**
Tủ có 10 ô cỡ 25cm, 10 ô cỡ 30cm, 10 ô cỡ 40cm. Đôi dép 22cm vẫn phải chiếm trọn một ô 25cm — 3cm thừa không dùng được vào việc gì. Tệ hơn: cả nhà toàn đi giày 30cm, 10 ô đó đầy ứ trong khi 10 ô cỡ 40cm trống trơn, và bạn **không tháo vách ngăn ra được** — muốn chia lại thì phải dỡ cả tủ (restart).

> [!tip] Theo dõi `stats slabs` và `stats items`
> 📖 "Monitor the global ’evictions’ stat. If it starts going up." … "Monitor the evicted and evicted_nonzero stats inside stats items. evicted_nonzero means the object was evicted early and did not have an infinite expiration time. This information is per-slab."
> 🇻🇳 "Theo dõi chỉ số `evictions` toàn cục. Nếu nó bắt đầu tăng." … "Theo dõi `evicted` và `evicted_nonzero` trong `stats items`. `evicted_nonzero` nghĩa là object bị evict sớm và **không** có thời gian hết hạn vô hạn. Thông tin này là theo từng slab."

---

## LRU và eviction

📖 **Nguyên văn** — *Performance and Efficiency → When Are Items Evicted*
> "Items are evicted if they have not expired (an expiration time of 0 or some time in the future), the slab class is completely out of free chunks, and there are no free pages to assign to a slab class."

🇻🇳 **Dịch**
> "Item bị **evict** khi: nó chưa hết hạn (exptime là 0 hoặc một thời điểm trong tương lai), slab class đã **hoàn toàn hết chunk trống**, và **không còn page trống** nào để gán cho slab class đó."

📖 **Nguyên văn** — *How the LRU Decides What to Evict*
> "Memory is also reclaimed when it’s time to store a new item. If there are no free chunks, and no free pages in the appropriate slab class, memcached will look at the end of the LRU for an item to “reclaim”. It will search the last few items in the tail for one which has already been expired, and is thus free for reuse. If it cannot find an expired item however, it will “evict” one which has not yet expired. This is then noted in several statistical counters."

🇻🇳 **Dịch**
> "Bộ nhớ cũng được thu hồi khi đến lúc lưu một item mới. Nếu không còn chunk trống và không còn page trống ở slab class phù hợp, memcached sẽ nhìn vào **cuối LRU** để tìm một item để “reclaim”. Nó tìm trong vài item cuối cùng ở phần đuôi xem có cái nào **đã hết hạn** và do đó rảnh để tái sử dụng. Tuy nhiên nếu không tìm thấy item hết hạn nào, nó sẽ **“evict” một item chưa hết hạn**. Việc này được ghi nhận vào một số bộ đếm thống kê."

📖 **Nguyên văn** — *Maintenance → Evictions*
> "An item is “evicted” from the cache if it still has time to live, but ended up at the tail end of the LRU cache when it comes time to allocate a new item. While memcached tries a little to find an expired item from the tail, it doesn’t guarantee it."
>
> "’evicted_time’ notes how many seconds it’s been since the last item to be evicted, was last fetched. If this number is small, it means you’re evicting items which were recently used."

🇻🇳 **Dịch**
> "Một item bị “evict” khỏi cache nếu nó **vẫn còn hạn sống**, nhưng lại nằm ở đuôi của LRU cache vào đúng lúc cần cấp phát cho item mới. Memcached có cố gắng chút ít để tìm item đã hết hạn ở đuôi, nhưng **không đảm bảo**."
>
> "`evicted_time` ghi lại đã bao nhiêu giây kể từ lần cuối item vừa bị evict được fetch. Nếu con số này nhỏ, nghĩa là bạn đang evict những item **vừa mới được dùng**."

> [!danger] Item có thể biến mất bất cứ lúc nào
> Ngay cả khi bạn `set` với exptime = 0 ("never expire"), item vẫn có thể bị evict. protocol.txt nói rõ ở phần `<exptime>`: "If it's 0, the item never expires (although it may be deleted from the cache to make place for other items)" — 🇻🇳 "Nếu là 0, item không bao giờ hết hạn (**mặc dù nó vẫn có thể bị xoá khỏi cache để nhường chỗ cho item khác**)."
> Code của bạn **phải** xử lý được trường hợp cache miss ở mọi key, mọi lúc.

### Hết hạn là lười (lazy expiration)

📖 **Nguyên văn** — *FAQ → Why Isn’t curr_items Decreasing When Items Expire?*
> "Expiration in memcached is lazy. In general, an item cannot be known to be expired until something looks at it. This helps the server keep consistent performance."
>
> "Since 1.5.0 a background thread analyzes the cache over time and asynchronously removes expired items from memory."

🇻🇳 **Dịch**
> "Việc hết hạn trong memcached là **lười**. Nói chung, không thể biết một item đã hết hạn cho tới khi có thứ gì đó nhìn vào nó. Điều này giúp server giữ hiệu năng ổn định."
>
> "Từ bản 1.5.0, một **background thread** phân tích cache theo thời gian và xoá các item hết hạn khỏi bộ nhớ một cách bất đồng bộ."

### LRU phân đoạn: HOT / WARM / COLD

Tài liệu `Performance and Efficiency` kết bằng câu "See LRU Documentation for detail on the latest LRU algorithm.", trỏ tới `doc/new_lru.txt` trong source tree.

📖 **Nguyên văn** — *doc/new_lru.txt*
> "In versions new enough to have the `-o lru_maintainer` option, a new LRU mechanic is available.
>
> Previously: Each slab class has an independent doubly-linked list comprising its LRU. Items are pulled from the bottom and either reclaimed or evicted as needed.
>
> Now, enabling `-o lru_maintainer` changes all of the behavior below:
>
>  * LRU's are now split between HOT, WARM, and COLD LRU's. New items enter the HOT LRU.
>  * Items hit at least twice are considered active.
>  * LRU updates only happen as items reach the bottom of an LRU. If active in HOT, move to WARM, if active in WARM, stay in WARM. If active in COLD, move to WARM.
>    The exception is that items active in COLD are immediately moved to WARM.
>  * HOT/WARM each capped at N% of memory available for that slab class. COLD is uncapped (by default, as of this writing).
>  * HOT/WARM are also age capped by ratios of COLD's age. IE: HOT is capped at N% of memory, or 10% of the age of COLD, whichever comes first.
>  * Items flow from HOT/WARM into COLD.
>  * A background thread exists which shuffles items between/within the LRU's as limits are reached. This includes moves from COLD to WARM.
>  * The background thread can also control the lru_crawler, if enabled."

🇻🇳 **Dịch**
> "Ở các phiên bản đủ mới để có tuỳ chọn `-o lru_maintainer`, một cơ chế LRU mới đã sẵn sàng.
>
> Trước đây: mỗi slab class có một danh sách liên kết đôi độc lập tạo thành LRU của nó. Item bị lôi ra từ đáy và được reclaim hoặc evict tuỳ nhu cầu.
>
> Giờ đây, bật `-o lru_maintainer` thay đổi toàn bộ hành vi bên dưới:
>
> * LRU nay được **chia thành HOT, WARM và COLD**. Item mới đi vào LRU **HOT**.
> * Item được truy cập **ít nhất hai lần** thì được coi là *active*.
> * Việc cập nhật LRU **chỉ xảy ra khi item chạm đáy một LRU**. Nếu active ở HOT thì chuyển sang WARM; nếu active ở WARM thì ở lại WARM; nếu active ở COLD thì chuyển sang WARM. Ngoại lệ: item active ở COLD được chuyển sang WARM **ngay lập tức**.
> * HOT/WARM mỗi cái bị giới hạn ở N% bộ nhớ khả dụng của slab class đó. COLD **không bị giới hạn** (mặc định, tại thời điểm viết).
> * HOT/WARM còn bị giới hạn theo **tuổi**, theo tỉ lệ với tuổi của COLD. Ví dụ: HOT bị chặn ở N% bộ nhớ, hoặc 10% tuổi của COLD, cái nào tới trước.
> * Item chảy từ HOT/WARM vào COLD.
> * Có một **background thread** xáo item giữa/trong các LRU khi chạm giới hạn. Bao gồm cả việc chuyển từ COLD sang WARM.
> * Background thread cũng có thể điều khiển `lru_crawler`, nếu được bật."

📖 **Nguyên văn** — *doc/new_lru.txt, mục tiêu*
> "The primary goal is to better protect active items from \"scanning\". Items which are never hit again will flow from HOT, through COLD, and out the bottom. Items occasionally active (reaching COLD, but being hit before eviction), move to WARM. There they can stay relatively protected.
>
> A secondary goal is to improve latency. The LRU locks are no longer used on most item reads, largely during sets and from the background thread."

🇻🇳 **Dịch**
> "Mục tiêu chính là **bảo vệ các item đang active khỏi hiện tượng “scanning”**. Những item không bao giờ được truy cập lại sẽ chảy từ HOT, qua COLD, rồi rơi khỏi đáy. Những item thỉnh thoảng mới active (chạm tới COLD nhưng được truy cập trước khi bị evict) sẽ chuyển sang WARM. Ở đó chúng tương đối được bảo vệ.
>
> Mục tiêu thứ hai là cải thiện **latency**. Các khoá LRU không còn được dùng ở hầu hết thao tác đọc item, mà chủ yếu chỉ khi `set` và từ background thread."

💡 **Ví dụ đời sống — vấn đề "scanning"**
Một job batch quét toàn bộ 10 triệu bản ghi lúc 2 giờ sáng, đọc mỗi bản ghi đúng một lần. Với LRU thuần, nguyên đợt quét đó sẽ đẩy toàn bộ dữ liệu nóng (trang chủ, sản phẩm bán chạy) ra khỏi cache, sáng hôm sau cache lạnh ngắt. LRU phân đoạn giải bài này: dữ liệu của job quét chỉ được chạm **một lần** nên không bao giờ thành *active*, nó trôi từ HOT qua COLD rồi rơi ra; còn dữ liệu nóng đã ở WARM nên được giữ lại.

> [!note] TEMP LRU
> 📖 **Nguyên văn** "An extra option: `-o temporary_ttl=N` (when used with lru_maintainer) will make items with a TTL less than or equal to this value use a fourth TEMP LRU. Items stored in TEMP are never bumped within its LRU or moved to other LRU's. They also cannot be evicted."
> 🇻🇳 "Một tuỳ chọn bổ sung: `-o temporary_ttl=N` (khi dùng cùng `lru_maintainer`) sẽ khiến các item có TTL nhỏ hơn hoặc bằng giá trị này dùng một **LRU thứ tư là TEMP**. Item nằm trong TEMP không bao giờ bị đẩy lên trong LRU của nó hay chuyển sang LRU khác. Chúng cũng **không thể bị evict**."
> Cảnh báo ngay sau đó: "Do not set temporary_ttl too high or memory could become exhausted." 🇻🇳 "Đừng đặt `temporary_ttl` quá cao, nếu không bộ nhớ có thể cạn kiệt."

---

## Phân tán: server không biết nhau, client quyết định tất cả

Đây là khác biệt kiến trúc lớn nhất giữa Memcached và hầu hết các hệ phân tán khác.

📖 **Nguyên văn** — *Overview → What is it Made Up Of?*
> "A client-based hashing algorithm, which chooses a server based on the “key”."

🇻🇳 **Dịch**
> "Một thuật toán hashing **nằm ở phía client**, chọn ra server dựa trên “key”."

📖 **Nguyên văn** — *FAQ → Do clients and servers all need to talk to each other?*
> "Nope. The less chatter, the more scalable the system."

🇻🇳 **Dịch**
> "Không. Càng ít chuyện trò, hệ thống càng dễ scale."

📖 **Nguyên văn** — *memcached.org — About → What it Does*
> "With memcached, you can see that all of the servers are looking into the same virtual pool of memory.  This means that a given item is always stored and always retrieved from the same location in your entire web cluster."

🇻🇳 **Dịch**
> "Với memcached, bạn thấy rằng tất cả server đều nhìn vào **cùng một pool bộ nhớ ảo**. Điều này có nghĩa một item cho trước luôn được lưu và luôn được lấy về **từ cùng một vị trí** trong toàn bộ web cluster của bạn."

> [!note] "Consistent hashing" là thuật ngữ ngành, không phải từ trong tài liệu Memcached
> Tài liệu chính thức chỉ nói "A client-based hashing algorithm, which chooses a server based on the “key”." — **không** nêu tên thuật toán cụ thể. Trong thực tế, thư viện client phổ biến hay dùng **consistent hashing** (còn gọi là ketama) để khi thêm/bớt server thì chỉ một phần nhỏ key phải đổi chỗ, thay vì `hash(key) % N` khiến gần như toàn bộ key đổi chỗ khi N thay đổi. Đây là **nhận định/kiến thức ngành**, bạn phải kiểm tra tài liệu của client bạn dùng để biết nó cài đặt thuật toán nào.

📖 **Nguyên văn** — *FAQ → How do you handle failover? / How do you handle replication?*
> "You usually don’t. Some clients have a “failover” option that will try the next server in the case of a failure."
>
> "It doesn’t. Adding replication to the system halves your effective cache size. If you can’t handle even a few percent extra cache misses, you have serious problems. Even with replication, things can break. More moving parts. Software to crash."

🇻🇳 **Dịch**
> (Failover) "Thường thì bạn **không** xử lý. Một số client có tuỳ chọn “failover” sẽ thử server kế tiếp khi có sự cố."
>
> (Replication) "Nó **không** làm chuyện đó. Thêm replication vào hệ thống làm **giảm một nửa** dung lượng cache hiệu dụng của bạn. Nếu bạn không chịu nổi chỉ vài phần trăm cache miss tăng thêm, thì bạn đang có vấn đề nghiêm trọng. Kể cả có replication, mọi thứ vẫn có thể hỏng. Thêm bộ phận chuyển động. Thêm phần mềm để crash."

💡 **Ví dụ đời sống — tủ gửi đồ đánh số**
Nhà ga có 5 dãy tủ gửi đồ. Các dãy tủ **không nói chuyện với nhau** — chúng chỉ là hộp sắt. Cái quyết định đồ của bạn nằm ở dãy nào chính là **quy tắc bạn cầm trong tay**: "chữ cái đầu của tên → dãy số mấy". Ai cũng dùng cùng quy tắc nên ai cũng tìm đúng dãy. Thêm một dãy thứ 6 thì phải cập nhật quy tắc cho tất cả mọi người, và một số đồ sẽ phải chuyển chỗ. Nếu dãy số 3 cháy, đồ trong đó mất — nhưng 4 dãy kia không hề hấn gì.

---

## Không có persistence

📖 **Nguyên văn** — *FAQ → Why can’t I use it as a database?*
> "Memcached is an ephemeral data store. Meaning if the server goes down (crash, reboot, “cloud burps”) then your data is gone. The ephemeral nature of the software allows us to take extreme tradeoffs in design which allow us to be 10x, 100x, or even 1000x faster than a traditional database. Combining caching with traditional datastores allows reducing cost and improving user experience."

🇻🇳 **Dịch**
> "Memcached là một kho dữ liệu **phù du (ephemeral)**. Nghĩa là nếu server sập (crash, reboot, “cloud giở chứng”) thì **dữ liệu của bạn biến mất**. Bản chất phù du của phần mềm cho phép chúng tôi đánh đổi cực đoan trong thiết kế, nhờ đó nhanh hơn database truyền thống 10 lần, 100 lần, thậm chí 1000 lần. Kết hợp caching với các datastore truyền thống cho phép giảm chi phí và cải thiện trải nghiệm người dùng."

📖 **Nguyên văn** — *FAQ → Why only RAM?*
> "Everything memcached does is an attempt to guarantee latency and speed. That said, it can make sense for some larger values to be fetched from high speed flash drives. A feature called extstore allows splitting items between RAM and disk storage."

🇻🇳 **Dịch**
> "Mọi thứ memcached làm đều nhằm **đảm bảo latency và tốc độ**. Dẫu vậy, với một số value lớn hơn thì lấy từ ổ flash tốc độ cao cũng hợp lý. Một tính năng tên **extstore** cho phép chia item giữa RAM và ổ đĩa."

📖 **Nguyên văn** — *FAQ → Can you persist cache between restarts?*
> "Yes, in some situations. See the documentation on warm restart."

🇻🇳 **Dịch**
> "Có, trong **một số tình huống**. Xem tài liệu về **warm restart**."

> [!danger] Mất điện là mất sạch cache
> Memcached không ghi gì xuống đĩa cho mục đích khôi phục. Tài liệu gọi nó là "ephemeral data store" và nói thẳng "if the server goes down ... then your data is gone".
> Có hai ngoại lệ **có điều kiện**, và phải hiểu đúng:
> - **extstore** — chia item giữa RAM và flash vì lý do **dung lượng/chi phí**, không phải để chống mất dữ liệu.
> - **warm restart** — giữ cache qua một lần restart, và FAQ nói rõ là "in some situations" (chỉ trong một số tình huống), không phải một đảm bảo tổng quát.
>
> Kết luận thực dụng: **thiết kế ứng dụng với giả định cache có thể trống rỗng bất cứ lúc nào.** Mọi dữ liệu không thể tái tạo từ nguồn gốc thì không được đặt ở đây.

📖 **Nguyên văn** — *FAQ → Why is memcached not recommended for sessions? Everyone does it!*
> "If a session disappears, often the user is logged out. If a portion of a cache disappears, either due to a hardware crash or a simple software upgrade, it should not cause your users noticeable pain."

🇻🇳 **Dịch**
> "Nếu một **session** biến mất, thường người dùng bị đăng xuất. Còn nếu một phần cache biến mất, dù do hỏng phần cứng hay chỉ là nâng cấp phần mềm, thì **không nên** gây cho người dùng của bạn nỗi đau dễ nhận thấy."

> [!warning] Đừng dùng Memcached làm session store
> Chính FAQ của Memcached khuyên như vậy. Đây là điểm đáng lưu ý khi đọc [[12 - Cookie và Session based Authentication]] — session cần độ bền mà cache không hứa.

---

## Vài điều dễ hiểu nhầm khác

### Memcached có thể làm ứng dụng **chậm** đi

📖 **Nguyên văn** — *FAQ → Can using memcached make my application slower?*
> "Yes, absolutely. If your DB queries are all fast, your website is fast, adding memcached might not make it faster."
>
> (về anti-pattern vòng lặp `get` từng key một) "Instead of this anti-pattern, use pipelined gets instead. Fetching a single item from memcached still requires a network roundtrip and a little processing. The more you can fetch at once the better."

🇻🇳 **Dịch**
> "Có, hoàn toàn có thể. Nếu các query DB của bạn đều nhanh, website của bạn nhanh, thì thêm memcached có thể **không** làm nó nhanh hơn."
>
> "Thay vì anti-pattern này, hãy dùng **pipelined gets**. Lấy một item đơn lẻ từ memcached vẫn cần một round-trip mạng và chút xử lý. Càng lấy được nhiều thứ trong một lần thì càng tốt."

> [!warning] Đây chính là N+1 nhưng ở tầng cache
> Vòng lặp `get` từng key một là bản sao của [[07 - N+1 Problem]], chỉ khác là round-trip đi tới cache thay vì tới database. Lệnh `get` của Memcached nhận **nhiều key** ("Takes one or more keys and returns all found items") — hãy dùng đúng khả năng đó.

### Không có thao tác phức tạp — và đó là cố ý

📖 **Nguyên văn** — *FAQ → Why no complex operations?*
> "All operations should run in O(1) time. They must be atomic. This doesn’t necessarily mean complex operations can never happen, but it means we have to think very carefully about them first. Many complex operations can be emulated on top of more basic functionality."

🇻🇳 **Dịch**
> "Mọi thao tác đều nên chạy trong thời gian **O(1)**. Chúng phải **nguyên tử**. Điều này không hẳn nghĩa là các thao tác phức tạp không bao giờ xuất hiện, mà nghĩa là chúng tôi phải suy nghĩ **rất kỹ** về chúng trước đã. Nhiều thao tác phức tạp có thể mô phỏng lại trên nền các chức năng cơ bản hơn."

### `incr` không tự khởi tạo — race condition rình sẵn

📖 **Nguyên văn** — *User Guide → Proper Use of incr or decr*
> "incr and decr commands can be used to maintain counters. Such as how many hits a page has received, when you rate limit a user, etc. These commands will allow you to add values from 1 or higher, or even negative values.
>
> They do not, however, initialize a missing value."

🇻🇳 **Dịch**
> "Lệnh `incr` và `decr` có thể dùng để duy trì **counter**. Chẳng hạn một trang nhận bao nhiêu lượt truy cập, khi bạn **rate limit** một người dùng, v.v.
>
> Tuy nhiên, chúng **không khởi tạo** một giá trị đang thiếu."

📖 **Nguyên văn** — *bình luận trong pseudocode kèm theo*
> "# Whoops, key doesn't already exist!" … "# so we use `add` instead of `set`" … "# Failed! Someone else already put it back." … "# So lets try one more time to incr."

🇻🇳 Mẫu ba bước: thử `incr` trước; nếu trượt vì key chưa có thì dùng **`add`** (không phải `set`) để khởi tạo — vì `add` chỉ thành công khi chưa ai kịp tạo; nếu `add` cũng trượt tức là có người khác vừa tạo, thì `incr` lại lần nữa. Tài liệu chốt: "Just don’t run a set when you mean to do an add in this case." 🇻🇳 "Chỉ cần đừng chạy `set` khi ý bạn là `add` trong trường hợp này."

### Key: đừng nhét input của người dùng vào

📖 **Nguyên văn** — *User Guide → Avoid User Input*
> "It’s very easy to compromise memcached if you use arbitrary user input for keys. The ASCII protocol uses spaces and newlines. Ensure that neither show up your keys, live long and prosper. Binary protocol does not have this issue."

🇻🇳 **Dịch**
> "Rất dễ để **xâm hại** memcached nếu bạn dùng input tuỳ ý của người dùng làm key. Giao thức ASCII dùng **dấu cách và ký tự xuống dòng**. Hãy đảm bảo không cái nào trong hai thứ đó xuất hiện trong key của bạn. Giao thức binary không gặp vấn đề này."

> [!danger] Command injection ở tầng cache
> Cơ chế y hệt [[13 - SQL Injection và Parameterized Query]]: dữ liệu người dùng bị hiểu thành cú pháp lệnh. Ở đây ký tự nguy hiểm là dấu cách và `\r\n` thay vì dấu nháy đơn. Luôn hash hoặc encode (base64/hex) phần key đến từ input bên ngoài.

📖 **Nguyên văn** — *User Guide → Key Usage*
> "Memcached is a hash, but it also remembers the full key internally. The longer your keys are, the more bytes memcached has to hash to look up your value, and the more memory it wastes storing a full copy of your key."

🇻🇳 **Dịch**
> "Memcached là một hash, nhưng nó cũng **nhớ nguyên key ở bên trong**. Key càng dài thì memcached càng phải hash nhiều byte để tra ra value của bạn, và càng lãng phí bộ nhớ để lưu một bản sao đầy đủ của key."

> [!warning] Không có cách nào liệt kê hết key
> 📖 "You can list all keys using an interface that is deliberately limited. Applications must not rely on reading all keys back from a memcached server. A server may have millions or billions of unrelated keys. An application that relies on looking at all keys to then render a page will eventually fail."
> 🇻🇳 "Bạn có thể liệt kê toàn bộ key qua một interface **cố ý bị giới hạn**. Ứng dụng **không được** phụ thuộc vào việc đọc lại toàn bộ key từ một memcached server. Một server có thể có hàng triệu hoặc hàng tỉ key không liên quan. Ứng dụng phụ thuộc vào việc nhìn hết mọi key để render một trang thì sớm muộn cũng hỏng."
> Đây cũng là lý do "invalidate theo tag" không làm được: trang *User Guide* mục **Invalidating by Tag** chỉ ghi đúng một dòng `TODO: link to namespacing document + say how this isn’t possible.`

---

## Memcached so với Redis — đối chiếu theo tài liệu

> [!note] Bảng này là tổng hợp/nhận định dựa trên các câu đã trích ở trên
> Không có tài liệu chính thức nào của Memcached viết ra bảng so sánh này. Cột bên trái trích được từ docs.memcached.org; cột bên phải xem [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] để đối chiếu với tài liệu Redis.

| Khía cạnh | Memcached (theo tài liệu) |
|---|---|
| Kiểu dữ liệu | "It does not understand data structures; you must upload data that is pre-serialized." — chỉ key → blob |
| Giới hạn key | "up to 250 bytes in length. No space or newlines for ASCII mode" |
| Persistence | "Memcached is an ephemeral data store... then your data is gone." Warm restart chỉ "in some situations" |
| Replication | "It doesn’t. Adding replication to the system halves your effective cache size." |
| Server biết nhau? | "Memcached servers are unaware of each other." |
| Ai chọn server? | "A client-based hashing algorithm, which chooses a server based on the “key”." |
| Thao tác phức tạp | "All operations should run in O(1) time. They must be atomic." — không có script/transaction |
| Concurrency control | `cas` — "store this data but only if no one else has updated since I last fetched it." |
| Mô hình thread | "By default 4 threads are allocated." — đa luồng (worker threads + libevent) |

📖 **Nguyên văn** — *Configuring → Threading*: "Threading is used to scale memcached across CPU’s. The model is by “worker threads”, meaning that each thread handles concurrent connections."
🇻🇳 **Dịch**: "Threading được dùng để scale memcached qua nhiều CPU. Mô hình là **“worker thread”**, nghĩa là mỗi thread xử lý các kết nối đồng thời."

---

## Bảo mật: đừng phơi Memcached ra Internet

📖 **Nguyên văn** — *Configuring → Networking*
> "Since 1.5.6 memcached defaults to listening only on TCP. -l allows you to bind to specific interfaces or IP addresses. Memcached does not spend much, if any, effort in ensuring its defensibility from random internet connections. So you must not expose memcached directly to the internet, or otherwise any untrusted users. Using SASL authentication here helps, but should not be totally trusted."

🇻🇳 **Dịch**
> "Từ bản 1.5.6 memcached mặc định chỉ lắng nghe trên TCP. `-l` cho phép bạn bind vào interface hoặc địa chỉ IP cụ thể. Memcached **gần như không bỏ chút công sức nào** vào việc tự vệ trước các kết nối ngẫu nhiên từ internet. Vì vậy bạn **không được phơi memcached trực tiếp ra internet**, hay ra bất kỳ người dùng không đáng tin nào. Dùng SASL authentication ở đây có giúp, nhưng **không nên tin tưởng hoàn toàn**."

> [!danger] Không có mô hình bảo mật mạnh
> FAQ mục *How do I authenticate?* chỉ nói: "Limited password based authentication is available in the basic protocol - You can also enable TLS and authenticate by certificates verification." 🇻🇳 "Chỉ có xác thực bằng mật khẩu ở mức hạn chế trong giao thức cơ bản — bạn cũng có thể bật TLS và xác thực bằng kiểm tra certificate."
> Memcached được thiết kế để chạy trong mạng nội bộ tin cậy. Tài liệu còn có hẳn một trang *Advisories → UDP DDoS* về việc bị lạm dụng làm amplifier.

---

## Khi nào chọn Memcached

> [!note] Phần này là **nhận định**, tổng hợp từ các câu đã trích ở trên — không phải khuyến nghị chính thức của dự án.
> **Hợp** khi: chỉ cần key → blob; cần scale ngang đơn giản (thêm node là thêm RAM, không coordination); chấp nhận được mất sạch cache bất cứ lúc nào; muốn ít bộ phận chuyển động nhất có thể.
> **Không hợp** khi: cần cấu trúc dữ liệu hoặc thao tác server-side phức tạp; cần persistence/replication/failover thật sự; cần lưu session hay dữ liệu không tái tạo được; cần invalidate theo nhóm/tag (tài liệu ghi thẳng là "this isn’t possible").

---

## Liên kết

- Bài trước: [[04 - Redis - Expiration, Eviction và Persistence]]
- Bài kế: [[06 - Chiến lược cache và so sánh Redis vs Memcached]]
- [[01 - Caching là gì]] — khái niệm nền: cache hit/miss, TTL, eviction. Memcached là một cài đặt cụ thể của mọi khái niệm đó.
- [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]] — đối chiếu trực tiếp: Redis hiểu cấu trúc dữ liệu, Memcached thì "does not understand data structures".
- [[02 - REST]] — cache là một trong sáu ràng buộc kiến trúc của REST; Memcached là cache phía server, không phải HTTP cache. Xem thêm [[01 - API là gì và nền tảng HTTP]]: `cas` giải bài toán tương tự `ETag` / `If-Match` nhưng ở tầng ứng dụng.
- [[12 - Cookie và Session based Authentication]] — FAQ của Memcached khuyên **không** dùng nó làm session store.
- [[07 - N+1 Problem]] — vòng lặp `get` từng key là N+1 ở tầng cache; dùng multi-get/pipelined gets.
- [[04 - Indexes]] — cache giảm tải database nhưng không thay thế index; query chậm thì vẫn chậm ở mọi lần cache miss. Và `cas` chỉ bảo vệ một key — Memcached không có transaction, xem [[05 - Transactions, ACID và MVCC]].
- [[13 - SQL Injection và Parameterized Query]] — cùng một lớp lỗi: input người dùng bị hiểu thành cú pháp lệnh.

## Nguồn tham khảo

- Memcached Documentation — Overview : https://docs.memcached.org/
- Memcached Documentation — Basic Text Protocol : https://docs.memcached.org/protocols/basic/
- Memcached Documentation — User Guide : https://docs.memcached.org/userguide/
- Memcached Documentation — FAQ : https://docs.memcached.org/userguide/faq/
- Memcached Documentation — Configuring : https://docs.memcached.org/serverguide/configuring/
- Memcached Documentation — Performance and Efficiency : https://docs.memcached.org/serverguide/performance/
- Memcached Documentation — Maintenance : https://docs.memcached.org/serverguide/maintenance/
- memcached.org — About Memcached : https://memcached.org/about
- Memcached source — `doc/protocol.txt` : https://github.com/memcached/memcached/blob/master/doc/protocol.txt
- Memcached source — `doc/new_lru.txt` : https://github.com/memcached/memcached/blob/master/doc/new_lru.txt
- Wiki cũ (nay chỉ redirect sang docs.memcached.org) : https://github.com/memcached/memcached/wiki/Overview · https://github.com/memcached/memcached/wiki/Commands · https://github.com/memcached/memcached/wiki/ProgrammingFAQ
