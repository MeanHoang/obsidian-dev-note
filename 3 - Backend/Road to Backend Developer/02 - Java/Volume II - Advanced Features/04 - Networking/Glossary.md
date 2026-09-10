# Glossary — Networking

> Thuật ngữ chương 4: Networking. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**absolute URI**
URI **có phần `scheme:`**. Nếu không có `scheme:` thì URI là **relative**. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

**authority**
Phần của một hierarchical URI, với URI dựa trên server thì có dạng `[user-info@]host[:port]`; **port phải là số nguyên**. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

## B

**Base64 encoding**
Cách **mã hoá một dãy byte thành một dãy ký tự ASCII in được**. Dùng cho HTTP basic authentication: nối `username:password`, mã hoá Base64, rồi set request property `"Authorization"` với value `"Basic " + encoding`. Xem [[03 - Getting Web Data#4.3.2. Using a URLConnection to Retrieve Information]].

**body handler**
Thứ báo cho `HttpClient` biết **cách xử lý response**. Gồm `BodyHandlers.ofString()`, `ofFile(filePath)`, `ofFileDownload(directoryPath)` (lấy tên file từ header `Content-Disposition`), `discarding()`. Xem [[04 - The HTTP Client#4.4. The HTTP Client]].

**body publisher**
Thứ **biến request data thành data được post đi** trong một `POST` request của `HttpClient`. Có body publisher cho **string, byte array và file**. Xem [[04 - The HTTP Client#4.4. The HTTP Client]].

**builder pattern**
Cách dựng object: lấy một **builder**, gọi các method để **tuỳ chỉnh** thứ sắp được dựng, rồi gọi **`build`** để hoàn tất. Sách gọi đây là **pattern phổ biến để dựng object immutable**. `HttpClient` và `HttpRequest` đều dùng pattern này. Xem [[04 - The HTTP Client#4.4. The HTTP Client]].

## C

**channel**
Đối tượng của `java.nio` **không có stream đi kèm**; thay vào đó có method `read`/`write` dùng object `Buffer`, khai báo trong interface `ReadableByteChannel` và `WritableByteChannel`. Dùng `SocketChannel` để **interrupt được** socket operation. Xem [[02 - Implementing Servers#4.2.4. Interruptible Sockets]].

## D

**datagram**
Tên gọi khác của **packet** trong UDP. Xem [[01 - Connecting to a Server#4.1.2. Connecting to a Server with Java]].

## G

**GET**
Một trong hai command thường dùng để gửi thông tin tới web server. Với `GET`, **query parameter được gắn vào cuối URL** theo dạng `http://host/path?query`, mỗi parameter dạng `name=value`, ngăn nhau bằng `&`, value được **URL-encode**. Xem [[03 - Getting Web Data#4.3.3. Posting Form Data]].

## H

**half-close**
Cho phép **một đầu** của socket connection **kết thúc output của mình** mà **vẫn nhận data từ đầu kia**. Thực hiện bằng `shutdownOutput()`. Chỉ hữu ích cho **service "một phát" (one-shot)** như HTTP. Xem [[02 - Implementing Servers#4.2.3. Half-Close]].

**hierarchical URI**
**Mọi absolute URI không opaque + mọi relative URI.** `schemeSpecificPart` có cấu trúc `[//authority][path][?query]`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

**HttpClient**
API client HTTP hiện đại, **hỗ trợ HTTP/2**, ra đời vì phần hỗ trợ HTTP của `URLConnection` **hơi cồng kềnh**. Ở Java 9–10 nằm trong `jdk.incubator.http`; **từ Java 11** nằm trong **`java.net.http`**. Xem [[04 - The HTTP Client#4.4. The HTTP Client]].

**HttpURLConnection**
**Subclass của `URLConnection`** chứa `getErrorStream` và vài method khác. Nếu request tới URL bắt đầu bằng `http://` hoặc `https://`, **cast được** object connection sang kiểu này. Xem [[03 - Getting Web Data#4.3.3. Posting Form Data]].

## I

**InetAddress**
Class dùng để **chuyển đổi qua lại giữa host name và Internet address**. `getByName` trả về một địa chỉ, `getAllByName` trả về **mọi địa chỉ** (host nhiều traffic có nhiều địa chỉ để **load balancing**), `getLocalHost` trả về địa chỉ local host. Xem [[01 - Connecting to a Server#4.1.4. Internet Addresses]].

**Internet address**
Địa chỉ host **dạng số**, gồm **4 byte** (hoặc **16 byte với IPv6**), ví dụ `129.6.15.28`. Xem [[01 - Connecting to a Server#4.1.4. Internet Addresses]].

**interruptible socket**
Socket mở qua **`SocketChannel`** của `java.nio`. Khi thread bị **interrupt** trong lúc open/read/write, operation **không block mà bị kết thúc bằng exception** — trái với blocking socket vốn **không unblock được bằng `interrupt`**. Xem [[02 - Implementing Servers#4.2.4. Interruptible Sockets]].

## L

**local loopback address**
Địa chỉ **`127.0.0.1`** luôn nhận được khi hỏi địa chỉ của `localhost`; **người khác không dùng nó để kết nối tới máy bạn được**. Muốn địa chỉ thật thì dùng `InetAddress.getLocalHost()`. Xem [[01 - Connecting to a Server#4.1.4. Internet Addresses]].

## O

**opaque URI**
Absolute URI mà `schemeSpecificPart` **không bắt đầu bằng `/`**, ví dụ `mailto:cay@horstmann.com`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

## P

**port**
**Không phải thiết bị vật lý**, mà là một **abstraction** giúp việc giao tiếp giữa server và client dễ dàng hơn. Theo quy ước, service "time of day" luôn gắn với **port 13**; SMTP là **port 25**. Xem [[01 - Connecting to a Server#4.1.1. Using Telnet]].

**POST**
Command gửi thông tin tới web server dùng cho **form nhiều data** (query string dài trông xấu, browser/proxy đời cũ giới hạn số ký tự trong `GET`). Không gắn parameter vào URL mà **lấy output stream từ `URLConnection` và ghi cặp name/value vào đó**; vẫn phải URL-encode value và ngăn bằng `&`. Header của `POST` phải kèm **`Content-Length`**. Xem [[03 - Getting Web Data#4.3.3. Posting Form Data]].

## R

**redirect**
Server trả lời bằng **một URL khác cần được gọi** để lấy thông tin thực sự. `HttpURLConnection` xử lý được trong hầu hết trường hợp, nhưng **redirect tự động giữa HTTP và HTTPS không được hỗ trợ vì lý do bảo mật**, và redirect tự động **luôn gửi user agent chung chung chứa từ `Java`**. Tự làm bằng tay thì tắt `setInstanceFollowRedirects(false)`, kiểm tra response code, rồi đọc header `Location`. Xem [[03 - Getting Web Data#4.3.3. Posting Form Data]].

**relativization**
Quá trình **ngược với resolving**: từ base URI và một URI đầy đủ, cho ra **URI tương đối**. Method `base.relativize(combined)`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

**resolving a relative URL**
Quá trình **gộp một absolute URI với một relative URI thành một absolute URI**. Method `base.resolve(relative)`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

## S

**ServerSocket**
Class **thiết lập một socket theo dõi một port**. Method **`accept()`** **chờ vô hạn** cho tới khi client connect, rồi trả về một object `Socket` đại diện cho connection. Xem [[02 - Implementing Servers#4.2.1. Server Sockets]].

**SMTP** (Simple Mail Transport Protocol)
Protocol **mô tả định dạng cho e-mail message**, gắn với **port 25**. **RFC 821** quy định các dòng phải **kết thúc bằng `\r` rồi `\n`**. Ngày nay hầu hết server **chỉ nhận request từ user hoặc dải IP tin cậy**, authentication qua secure socket connection. Xem [[05 - Sending E-Mail#4.5. Sending E-Mail]].

**socket**
Một **abstraction phần mềm mạng** cho phép giao tiếp ra và vào chương trình. Constructor nhận **địa chỉ remote và số port**; thất bại thì ném `UnknownHostException`, vấn đề khác thì `IOException`. Class `Socket` che giấu sự phức tạp của việc thiết lập connection, cho **cùng programming interface như khi làm việc với file**. Xem [[01 - Connecting to a Server#4.1.2. Connecting to a Server with Java]].

**socket timeout**
Giá trị set bằng **`setSoTimeout`** (millisecond). Sau khi set, **mọi read operation** ném **`SocketTimeoutException`** khi hết timeout. **Không có timeout cho write operation.** Constructor `Socket(host, port)` **block vô hạn** — khắc phục bằng cách dựng socket chưa connect rồi `connect(address, timeout)`. Xem [[01 - Connecting to a Server#4.1.3. Socket Timeouts]].

## T

**TCP** (Transmission Control Protocol)
Protocol **duy nhất** được sách trình bày. Xem [[01 - Connecting to a Server#4.1.2. Connecting to a Server with Java]].

**telnet**
Chương trình là **công cụ debug rất tốt cho lập trình network**. Dùng được để giao tiếp với các service khác của Internet host, ví dụ `telnet time-a.nist.gov 13` hay gõ thẳng request HTTP vào `telnet horstmann.com 80`. Trên Windows phải **bật thủ công** trong Windows Features. Xem [[01 - Connecting to a Server#4.1.1. Using Telnet]].

## U

**UDP** (User Datagram Protocol)
Protocol gửi **packet (datagram)** với **overhead thấp hơn TCP nhiều**. Nhược điểm: packet **không nhất thiết đến đúng thứ tự** và **có thể bị mất**; bên nhận phải tự sắp lại và yêu cầu gửi lại. Hợp với **audio/video stream hoặc đo đạc liên tục**. Xem [[01 - Connecting to a Server#4.1.2. Connecting to a Server with Java]].

**URI** (uniform resource identifier)
Cấu trúc **thuần tuý về cú pháp** chứa các phần của string chỉ định một web resource. Cú pháp `[scheme:]schemeSpecificPart[#fragment]`. Trong Java library, class `URI` **không có method truy cập resource** — **mục đích duy nhất là parsing**. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

**URL** (uniform resource locator)
**Một dạng URI đặc biệt** — loại có **đủ thông tin để định vị một resource**. Class `URL` **mở được stream** tới resource, nên chỉ làm việc với các scheme Java biết xử lý: `http:`, `https:`, `ftp:`, `file:`, `jar:`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

**URL encoding**
Scheme mã hoá value của parameter: giữ nguyên **A–Z, a–z, 0–9** và `. - ~ _`; thay **mọi dấu cách bằng `+`**; mọi ký tự khác mã hoá sang **UTF-8** rồi mỗi byte thành **`%` + hexa hai chữ số**. Ví dụ `San Francisco, CA` → `San+Francisco%2c+CA`. Mục đích: **ngăn chương trình trung gian làm hỏng dấu cách và ký tự đặc biệt**. Xem [[03 - Getting Web Data#4.3.3. Posting Form Data]].

**URLConnection**
Class cho **quyền kiểm soát nhiều hơn** class `URL` cơ bản. Phải theo đúng **5 bước**: `openConnection` → set request property → `connect` → truy vấn header → truy cập data. Sách cảnh báo: **`getInputStream`/`getOutputStream` của nó KHÔNG giống của `Socket`** vì class này **làm nhiều "phép màu" ở hậu trường** với request/response header. Xem [[03 - Getting Web Data#4.3.2. Using a URLConnection to Retrieve Information]].

**URN** (uniform resource name)
URI **không phải locator** — **không có data nào để định vị** từ identifier đó, ví dụ `mailto:cay@horstmann.com`. Xem [[03 - Getting Web Data#4.3.1. URLs and URIs]].

---

## Vòng lặp của mọi chương trình server

| # | Bước |
|---|---|
| 1 | Nhận **command từ client** qua incoming data stream |
| 2 | **Giải mã** command |
| 3 | **Thu thập** thông tin client yêu cầu |
| 4 | **Gửi** thông tin qua outgoing data stream |

Xem [[02 - Implementing Servers#4.2.1. Server Sockets]].
