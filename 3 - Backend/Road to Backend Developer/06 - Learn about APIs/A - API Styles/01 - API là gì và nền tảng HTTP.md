# 01 — API là gì và nền tảng HTTP

> **Nguồn chính:** RFC 9110 — *HTTP Semantics* — https://www.rfc-editor.org/rfc/rfc9110.txt
> Bài này bám các mục §1.1, §3.1, §3.2, §8, §9.1, §9.2, §9.3, §11.6.2, §12, §13.1.2 của RFC 9110; bổ sung RFC 9111 (§5.2) cho `Cache-Control` và RFC 5789 cho `PATCH`.

> [!note] Phần cơ bản xem ở đây
> HTTP nhập môn (request/response là gì, status code, URL, HTTPS) đã học ở [[02 - What is HTTP]]. Bài này **không lặp lại** phần đó, mà đi thẳng vào **những gì một người thiết kế API cần biết về HTTP**: method semantics, safe/idempotent/cacheable, resource vs representation, content negotiation, và bộ header quyết định hành vi API.

---

## 1. API là gì

Roadmap backend (roadmap.sh) định nghĩa như sau:

📖 **Nguyên văn**
> "API (Application Programming Interface) defines rules and protocols for software applications to communicate. Provides standardized access to functionalities without understanding internal workings. Includes endpoints, request methods (GET, POST, PUT), and data formats (JSON, XML)."

🇻🇳 **Dịch**
> "API (Application Programming Interface) định nghĩa các quy tắc và protocol để các ứng dụng phần mềm giao tiếp với nhau. Nó cung cấp lối truy cập chuẩn hoá tới các chức năng mà không cần hiểu phần bên trong hoạt động ra sao. API bao gồm các endpoint, request method (GET, POST, PUT), và các định dạng dữ liệu (JSON, XML)."

Hai điểm cốt lõi rút ra từ định nghĩa này:

1. **API là một contract** — tập quy tắc hai bên cùng tuân theo. Không phải code, không phải server, mà là **thoả thuận**.
2. **API giấu phần bên trong** — "without understanding internal workings". Người dùng API không cần biết bạn lưu dữ liệu ở PostgreSQL hay Firestore.

### API nói chung vs web API

| | API nói chung | Web API |
|---|---|---|
| Phạm vi | Bất kỳ ranh giới phần mềm nào | Giao tiếp qua mạng, thường qua HTTP |
| Ví dụ | `Array.prototype.map()` của JavaScript, POSIX `open()`, thư viện `fs` của Node | REST API, GraphQL endpoint, gRPC service |
| Lỗi có thể xảy ra | Lỗi logic, exception | Thêm: mất mạng, timeout, request lặp, partial failure |
| Chi phí gọi | Nano giây | Mili giây tới giây |

> [!warning] Khác biệt quan trọng nhất
> Gọi hàm trong cùng process thì hoặc chạy xong, hoặc ném exception. Gọi web API còn có trạng thái thứ ba: **không biết đã chạy hay chưa** (mất kết nối trước khi nhận response). Toàn bộ khái niệm *idempotent* ở mục 4 sinh ra để xử lý đúng trạng thái thứ ba này.

---

## 2. Vì sao HTTP trở thành nền cho web API

RFC 9110 mở đầu bằng mô tả bản chất của HTTP:

📖 **Nguyên văn** (RFC 9110 §1.1 Purpose)
> "The Hypertext Transfer Protocol (HTTP) is a family of stateless, application-level, request/response protocols that share a generic interface, extensible semantics, and self-descriptive messages to enable flexible interaction with network-based hypertext information systems."

🇻🇳 **Dịch**
> "Hypertext Transfer Protocol (HTTP) là một họ các protocol stateless, ở tầng application, theo mô hình request/response, cùng chia sẻ một interface tổng quát, ngữ nghĩa mở rộng được, và các message tự mô tả, nhằm cho phép tương tác linh hoạt với các hệ thống thông tin hypertext trên mạng."

📖 **Nguyên văn** (RFC 9110 §1.1)
> "HTTP hides the details of how a service is implemented by presenting a uniform interface to clients that is independent of the types of resources provided.  Likewise, servers do not need to be aware of each client's purpose: a request can be considered in isolation rather than being associated with a specific type of client or a predetermined sequence of application steps.  This allows general-purpose implementations to be used effectively in many different contexts, reduces interaction complexity, and enables independent evolution over time."

🇻🇳 **Dịch**
> "HTTP giấu đi chi tiết một service được cài đặt thế nào, bằng cách trình ra cho client một interface đồng nhất, độc lập với loại resource được cung cấp. Tương tự, server không cần biết mục đích của từng client: một request có thể được xét một cách độc lập, thay vì phải gắn với một loại client cụ thể hay một chuỗi bước ứng dụng định sẵn. Điều này cho phép các cài đặt đa dụng được dùng hiệu quả trong nhiều bối cảnh khác nhau, giảm độ phức tạp khi tương tác, và cho phép hai bên tiến hoá độc lập theo thời gian."

Đọc kỹ đoạn này sẽ thấy **HTTP vốn đã là một API** trước khi ai đó xây API lên trên nó:

- **stateless** → server không giữ ngữ cảnh giữa các request → scale ngang dễ, thêm máy là xong.
- **uniform interface** → mọi resource dùng chung một bộ method → proxy, cache, CDN, load balancer hiểu được traffic mà không cần biết business logic của bạn.
- **self-descriptive messages** → mỗi message tự mang metadata (Content-Type, Cache-Control, ETag...) → trung gian xử lý được mà không cần đọc payload.
- **independent evolution** → client cũ và server mới vẫn nói chuyện được.

💡 **Ví dụ đời sống**
HTTP giống **hệ thống bưu chính**. Bạn không cần thoả thuận riêng với bưu điện về việc trong hộp có gì. Bạn chỉ cần dán nhãn đúng chuẩn: địa chỉ (URI), loại hàng (Content-Type), "hàng dễ vỡ / không được để kho" (Cache-Control), mã kiện (ETag). Nhân viên bưu điện (proxy, CDN) định tuyến và xử lý được **mà không cần mở hộp**. Đó chính là "self-descriptive messages".

---

## 3. HTTP methods — định nghĩa nguyên văn

Method là nơi ngữ nghĩa của request nằm ở đó:

📖 **Nguyên văn** (RFC 9110 §9.1 Overview)
> "The request method token is the primary source of request semantics; it indicates the purpose for which the client has made this request and what is expected by the client as a successful result."

🇻🇳 **Dịch**
> "Token method của request là nguồn ngữ nghĩa chính của request; nó cho biết client gửi request này với mục đích gì và client mong đợi kết quả thành công là như thế nào."

📖 **Nguyên văn** (RFC 9110 §9.1)
> "Unlike distributed objects, the standardized request methods in HTTP are not resource-specific, since uniform interfaces provide for better visibility and reuse in network-based systems [REST].  Once defined, a standardized method ought to have the same semantics when applied to any resource, though each resource determines for itself whether those semantics are implemented or allowed."

🇻🇳 **Dịch**
> "Khác với distributed object, các request method chuẩn hoá trong HTTP không gắn riêng với từng resource, bởi vì interface đồng nhất mang lại khả năng quan sát và tái sử dụng tốt hơn trong các hệ thống trên mạng [REST]. Một khi đã được định nghĩa, một method chuẩn hoá phải mang cùng một ngữ nghĩa khi áp lên bất kỳ resource nào, dù mỗi resource tự quyết định có cài đặt hay cho phép ngữ nghĩa đó hay không."

> [!danger] Đây là quy tắc bị vi phạm nhiều nhất
> "the same semantics when applied to any resource" nghĩa là bạn **không được** tự định nghĩa lại GET cho riêng endpoint của mình. `GET /orders/123/cancel` là sai — GET phải read-only ở **mọi** resource. Xem §9.2.1 ở mục 4 để biết hậu quả.

### 3.1. Bảng method

| Method | Định nghĩa nguyên văn (RFC 9110 §9.3, RFC 5789 §2) |
|---|---|
| **GET** | "The GET method requests transfer of a current selected representation for the target resource." |
| **HEAD** | "The HEAD method is identical to GET except that the server MUST NOT send content in the response." |
| **POST** | "The POST method requests that the target resource process the representation enclosed in the request according to the resource's own specific semantics." |
| **PUT** | "The PUT method requests that the state of the target resource be created or replaced with the state defined by the representation enclosed in the request message content." |
| **DELETE** | "The DELETE method requests that the origin server remove the association between the target resource and its current functionality." |
| **CONNECT** | "The CONNECT method requests that the recipient establish a tunnel to the destination origin server identified by the request target and, if successful, thereafter restrict its behavior to blind forwarding of data, in both directions, until the tunnel is closed." |
| **OPTIONS** | "The OPTIONS method requests information about the communication options available for the target resource, at either the origin server or an intervening intermediary." |
| **TRACE** | "The TRACE method requests a remote, application-level loop-back of the request message." |
| **PATCH** | "The PATCH method requests that a set of changes described in the request entity be applied to the resource identified by the Request-URI." (RFC 5789 §2) |

🇻🇳 **Dịch bảng**

| Method | Nghĩa |
|---|---|
| **GET** | Yêu cầu chuyển về representation hiện đang được chọn của target resource. |
| **HEAD** | Giống hệt GET, chỉ khác là server **MUST NOT** gửi content trong response. |
| **POST** | Yêu cầu target resource **xử lý** representation kèm trong request, theo ngữ nghĩa riêng của chính resource đó. |
| **PUT** | Yêu cầu state của target resource được **tạo mới hoặc thay thế** bằng state định nghĩa bởi representation nằm trong nội dung request message. |
| **DELETE** | Yêu cầu origin server gỡ bỏ **mối liên kết** giữa target resource và chức năng hiện tại của nó. |
| **CONNECT** | Yêu cầu bên nhận thiết lập một tunnel tới origin server đích, sau đó chỉ chuyển tiếp dữ liệu một cách "mù" theo cả hai chiều cho tới khi tunnel đóng. |
| **OPTIONS** | Yêu cầu thông tin về các tuỳ chọn giao tiếp khả dụng cho target resource, tại origin server hoặc tại một trung gian trên đường đi. |
| **TRACE** | Yêu cầu một phép loop-back ở tầng application từ xa đối với chính request message đó. |
| **PATCH** | Yêu cầu áp một **tập thay đổi** được mô tả trong request entity lên resource xác định bởi Request-URI. |

### 3.2. Vài điểm dễ hiểu sai

**DELETE không đảm bảo xoá dữ liệu.** Đọc lại: "remove the association between the target resource and its current functionality".

📖 **Nguyên văn** (RFC 9110 §9.3.5)
> "In effect, this method is similar to the \"rm\" command in UNIX: it expresses a deletion operation on the URI mapping of the origin server rather than an expectation that the previously associated information be deleted."

🇻🇳 **Dịch**
> "Trên thực tế, method này giống lệnh \"rm\" trong UNIX: nó diễn đạt một thao tác xoá trên ánh xạ URI của origin server, chứ không phải kỳ vọng rằng thông tin đã gắn với URI đó bị xoá đi."

→ Soft-delete (đánh dấu `deleted_at`) hoàn toàn hợp lệ với DELETE. Spec không đòi hỏi xoá vật lý.

**PUT vs PATCH** — khác nhau ở cách server xử lý entity gửi lên:

📖 **Nguyên văn** (RFC 5789 §2)
> "In a PUT request, the enclosed entity is considered to be a modified version of the resource stored on the origin server, and the client is requesting that the stored version be replaced.  With PATCH, however, the enclosed entity contains a set of instructions describing how a resource currently residing on the origin server should be modified to produce a new version."

🇻🇳 **Dịch**
> "Trong một PUT request, entity gửi kèm được coi là **phiên bản đã sửa** của resource đang lưu ở origin server, và client đang yêu cầu thay thế phiên bản đang lưu bằng nó. Còn với PATCH, entity gửi kèm chứa một **tập chỉ dẫn** mô tả resource đang nằm ở origin server nên được sửa ra sao để tạo ra phiên bản mới."

**POST là method "thùng chứa"** cho mọi thứ không khớp method khác — và RFC liệt kê rõ:

📖 **Nguyên văn** (RFC 9110 §9.3.3)
> "For example, POST is used for the following functions (among others):
>
> *  Providing a block of data, such as the fields entered into an HTML form, to a data-handling process;
>
> *  Posting a message to a bulletin board, newsgroup, mailing list, blog, or similar group of articles;
>
> *  Creating a new resource that has yet to be identified by the origin server; and
>
> *  Appending data to a resource's existing representation(s)."

🇻🇳 **Dịch**
> "Ví dụ, POST được dùng cho các chức năng sau (và còn nữa):
>
> * Cung cấp một khối dữ liệu, chẳng hạn các field nhập trong một HTML form, cho một tiến trình xử lý dữ liệu;
>
> * Đăng một message lên bảng tin, newsgroup, mailing list, blog, hoặc nhóm bài viết tương tự;
>
> * Tạo một resource mới mà origin server **chưa** định danh được; và
>
> * Nối thêm dữ liệu vào (các) representation hiện có của một resource."

> [!tip] Mẹo chọn PUT hay POST khi tạo mới
> Nếu **client** biết URI cuối cùng (`PUT /users/hoang`) → dùng PUT. Nếu **server** sinh ID (`POST /users` → trả về `/users/9f3a`) → dùng POST. Chính RFC ghi "yet to be identified by the origin server" cho POST.

---

## 4. Safe / Idempotent / Cacheable — trọng tâm của bài

Đây là ba thuộc tính quyết định API bạn thiết kế đúng hay sai. Sai ở đây không phải lỗi cú pháp — mà là lỗi **mất dữ liệu thật, tính tiền hai lần, dữ liệu người dùng bị cache nhầm cho người khác**.

### 4.1. Safe methods

📖 **Nguyên văn** (RFC 9110 §9.2.1)
> "Request methods are considered \"safe\" if their defined semantics are essentially read-only; i.e., the client does not request, and does not expect, any state change on the origin server as a result of applying a safe method to a target resource.  Likewise, reasonable use of a safe method is not expected to cause any harm, loss of property, or unusual burden on the origin server."

🇻🇳 **Dịch**
> "Các request method được coi là \"safe\" nếu ngữ nghĩa đã định nghĩa của chúng về cơ bản là chỉ-đọc; tức là client không yêu cầu, và cũng không kỳ vọng, bất kỳ thay đổi state nào ở origin server như hệ quả của việc áp một safe method lên một target resource. Tương tự, việc dùng một safe method một cách hợp lý được kỳ vọng là không gây ra thiệt hại, mất mát tài sản, hay gánh nặng bất thường nào cho origin server."

📖 **Nguyên văn** (RFC 9110 §9.2.1)
> "Of the request methods defined by this specification, the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe."

🇻🇳 **Dịch**
> "Trong số các request method mà đặc tả này định nghĩa, các method GET, HEAD, OPTIONS và TRACE được định nghĩa là safe."

Chú ý câu tiếp theo — nó giải thích "safe" **không** có nghĩa là server tuyệt đối không đổi gì:

📖 **Nguyên văn** (RFC 9110 §9.2.1)
> "This definition of safe methods does not prevent an implementation from including behavior that is potentially harmful, that is not entirely read-only, or that causes side effects while invoking a safe method.  What is important, however, is that the client did not request that additional behavior and cannot be held accountable for it."

🇻🇳 **Dịch**
> "Định nghĩa safe method này không ngăn một cài đặt có thêm hành vi tiềm ẩn gây hại, không hoàn toàn chỉ-đọc, hoặc gây side effect trong lúc thực thi một safe method. Tuy nhiên, điều quan trọng là **client đã không yêu cầu** hành vi bổ sung đó và **không phải chịu trách nhiệm** về nó."

→ Ghi access log, tăng counter lượt xem khi GET: vẫn safe. Vì đó là quyết định của server, client không yêu cầu.

**Vì sao phải phân biệt safe/unsafe:**

📖 **Nguyên văn** (RFC 9110 §9.2.1)
> "The purpose of distinguishing between safe and unsafe methods is to allow automated retrieval processes (spiders) and cache performance optimization (pre-fetching) to work without fear of causing harm."

🇻🇳 **Dịch**
> "Mục đích của việc phân biệt safe và unsafe method là để các tiến trình thu thập tự động (spider) và tối ưu hiệu năng cache (pre-fetching) hoạt động được mà không sợ gây ra thiệt hại."

Và cảnh báo trực diện nhất trong cả mục — dành riêng cho người thiết kế API:

📖 **Nguyên văn** (RFC 9110 §9.2.1)
> "For example, it is common for Web-based content editing software to use actions within query parameters, such as \"page?do=delete\".  If the purpose of such a resource is to perform an unsafe action, then the resource owner MUST disable or disallow that action when it is accessed using a safe request method.  Failure to do so will result in unfortunate side effects when automated processes perform a GET on every URI reference for the sake of link maintenance, pre-fetching, building a search index, etc."

🇻🇳 **Dịch**
> "Ví dụ, phần mềm soạn thảo nội dung trên web hay đặt hành động vào query parameter, kiểu \"page?do=delete\". Nếu mục đích của một resource như vậy là thực hiện một hành động unsafe, thì chủ resource **BẮT BUỘC** phải vô hiệu hoá hoặc từ chối hành động đó khi nó được truy cập bằng một safe request method. Không làm vậy sẽ dẫn tới những side effect đáng tiếc khi các tiến trình tự động thực hiện GET lên mọi URI reference để bảo trì link, pre-fetch, xây index tìm kiếm, v.v."

> [!danger] Bài học kinh điển
> Đây chính là lý do một công cụ crawl/prefetch (hay đơn giản là bot của trình duyệt) có thể **xoá sạch dữ liệu** của một admin panel dùng `GET /admin?do=delete&id=…`. Bot chỉ làm đúng việc của nó: GET được spec bảo đảm là safe. Lỗi nằm ở người thiết kế API.

### 4.2. Idempotent methods

📖 **Nguyên văn** (RFC 9110 §9.2.2)
> "A request method is considered \"idempotent\" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request.  Of the request methods defined by this specification, PUT, DELETE, and safe request methods are idempotent."

🇻🇳 **Dịch**
> "Một request method được coi là \"idempotent\" nếu tác động **dự định** lên server của nhiều request giống hệt nhau dùng method đó bằng đúng tác động của **một** request như vậy. Trong số các request method mà đặc tả này định nghĩa, PUT, DELETE và các safe request method là idempotent."

📖 **Nguyên văn** (RFC 9110 §9.2.2)
> "Idempotent methods are distinguished because the request can be repeated automatically if a communication failure occurs before the client is able to read the server's response.  For example, if a client sends a PUT request and the underlying connection is closed before any response is received, then the client can establish a new connection and retry the idempotent request.  It knows that repeating the request will have the same intended effect, even if the original request succeeded, though the response might differ."

🇻🇳 **Dịch**
> "Các idempotent method được phân biệt ra vì request có thể được **lặp lại tự động** nếu xảy ra sự cố liên lạc trước khi client kịp đọc response của server. Ví dụ, nếu một client gửi một PUT request và kết nối bên dưới bị đóng trước khi nhận được response nào, thì client có thể mở kết nối mới và retry request idempotent đó. Nó biết rằng lặp lại request sẽ cho cùng tác động dự định, kể cả khi request gốc đã thành công, dù response có thể khác."

📖 **Nguyên văn** (RFC 9110 §9.2.2)
> "A client SHOULD NOT automatically retry a request with a non-idempotent method unless it has some means to know that the request semantics are actually idempotent, regardless of the method, or some means to detect that the original request was never applied."

🇻🇳 **Dịch**
> "Client **KHÔNG NÊN** tự động retry một request dùng method không idempotent, trừ khi nó có cách nào đó để biết rằng ngữ nghĩa của request thực sự là idempotent bất kể method, hoặc có cách phát hiện rằng request gốc chưa hề được áp dụng."

📖 **Nguyên văn** (RFC 9110 §9.2.2)
> "A proxy MUST NOT automatically retry non-idempotent requests.  A client SHOULD NOT automatically retry a failed automatic retry."

🇻🇳 **Dịch**
> "Một proxy **BẮT BUỘC KHÔNG** được tự động retry các request không idempotent. Một client **KHÔNG NÊN** tự động retry lại một lần retry tự động đã thất bại."

💡 **Ví dụ đời sống — nút thang máy vs rút tiền ATM**

- **Bấm nút gọi thang máy** = idempotent. Bấm 1 lần hay 10 lần, kết quả cuối cùng vẫn là: thang máy sẽ tới tầng này. Trạng thái sau cùng của thế giới không đổi. Nếu bạn không chắc mình đã bấm chưa — cứ bấm lại, vô hại. Đó chính là **PUT/DELETE**.
- **Rút 500k ở ATM** = KHÔNG idempotent. Thao tác 1 lần mất 500k, thao tác 3 lần mất 1.5 triệu. Nếu máy treo giữa chừng và bạn không biết tiền đã trừ chưa — bạn **không dám** làm lại. Đó chính là **POST**.
- Nhưng: **"Đặt số dư tài khoản = 2 triệu"** lại idempotent trở lại. Làm bao nhiêu lần thì số dư vẫn là 2 triệu. Khác biệt nằm ở chỗ *mô tả trạng thái đích* (PUT) thay vì *mô tả mức thay đổi* (POST/PATCH kiểu delta).

Đó là toàn bộ trực giác của idempotent: **"đặt bằng" thì idempotent, "cộng thêm" thì không.**

> [!tip] Idempotency key — cách biến POST thành an toàn khi retry
> RFC viết "unless it has some means to know that the request semantics are actually idempotent, **regardless of the method**". Nghĩa là spec cho phép: bạn có thể tự làm cho một POST trở nên idempotent ở tầng ứng dụng, bằng cách client sinh một key duy nhất cho mỗi thao tác, server lưu key đó và nếu thấy key đã xử lý thì trả lại kết quả cũ thay vì thực hiện lần nữa. Đây là nền của mọi API thanh toán nghiêm túc.

> [!warning] "intended effect", không phải "response giống nhau"
> Định nghĩa nói về *tác động lên server*, không nói response phải giống nhau. `DELETE /users/1` lần đầu trả `204`, lần hai trả `404` — vẫn **hoàn toàn idempotent**, vì state cuối cùng (user 1 không còn) không đổi. RFC nói rõ: "though the response might differ".

📖 **Nguyên văn** (RFC 5789 §2)
> "PATCH is neither safe nor idempotent as defined by [RFC2616], Section 9.1."

🇻🇳 **Dịch**
> "PATCH không safe cũng không idempotent theo định nghĩa của [RFC2616] mục 9.1."

### 4.3. Cacheable

📖 **Nguyên văn** (RFC 9110 §3.8, định nghĩa "cacheable")
> "A response is \"cacheable\" if a cache is allowed to store a copy of the response message for use in answering subsequent requests.  Even when a response is cacheable, there might be additional constraints placed by the client or by the origin server on when that cached response can be used for a particular request."

🇻🇳 **Dịch**
> "Một response là \"cacheable\" nếu cache được phép lưu một bản sao của response message đó để dùng trả lời các request về sau. Ngay cả khi một response là cacheable, client hoặc origin server vẫn có thể đặt thêm ràng buộc về thời điểm bản cache đó được dùng cho một request cụ thể."

📖 **Nguyên văn** (RFC 9110 §9.2.3 Methods and Caching)
> "For a cache to store and use a response, the associated method needs to explicitly allow caching and to detail under what conditions a response can be used to satisfy subsequent requests; a method definition that does not do so cannot be cached.  For additional requirements see [CACHING].
>
>   This specification defines caching semantics for GET, HEAD, and POST, although the overwhelming majority of cache implementations only support GET and HEAD."

🇻🇳 **Dịch**
> "Để một cache lưu và dùng một response, method tương ứng phải cho phép caching một cách tường minh và nêu rõ dưới điều kiện nào response có thể được dùng để trả lời các request sau; một định nghĩa method không làm điều đó thì không thể được cache. Xem thêm yêu cầu ở [CACHING].
>
> Đặc tả này định nghĩa ngữ nghĩa caching cho GET, HEAD và POST, mặc dù đại đa số các cài đặt cache chỉ hỗ trợ GET và HEAD."

POST cacheable trong điều kiện rất hẹp:

📖 **Nguyên văn** (RFC 9110 §9.3.3)
> "Responses to POST requests are only cacheable when they include explicit freshness information (see Section 4.2.1 of [CACHING]) and a Content-Location header field that has the same value as the POST's target URI (Section 8.7)."

🇻🇳 **Dịch**
> "Response của POST request chỉ cacheable khi chúng kèm theo thông tin freshness tường minh (xem mục 4.2.1 của [CACHING]) và một header field Content-Location có giá trị trùng với target URI của POST đó."

### 4.4. Bảng tổng hợp — mỗi ô truy được về câu trích

| Method | Safe | Idempotent | Cacheable | Câu trích gốc |
|---|:---:|:---:|:---:|---|
| **GET** | ✅ | ✅ | ✅ | §9.2.1 "GET, HEAD, OPTIONS, and TRACE methods are defined to be safe" · §9.2.2 "PUT, DELETE, and safe request methods are idempotent" · §9.3.1 "The response to a GET request is cacheable" |
| **HEAD** | ✅ | ✅ | ✅ | §9.2.1 (như trên) · §9.2.2 (safe ⇒ idempotent) · §9.3.2 "The response to a HEAD request is cacheable" |
| **OPTIONS** | ✅ | ✅ | ❌ | §9.2.1 (như trên) · §9.2.2 (safe ⇒ idempotent) · §9.3.7 "Responses to the OPTIONS method are not cacheable" |
| **TRACE** | ✅ | ✅ | ❌ | §9.2.1 (như trên) · §9.2.2 (safe ⇒ idempotent) · §9.3.8 "Responses to the TRACE method are not cacheable" |
| **PUT** | ❌ | ✅ | ❌ | §9.2.2 "PUT, DELETE, and safe request methods are idempotent" · §9.3.4 "Responses to the PUT method are not cacheable" |
| **DELETE** | ❌ | ✅ | ❌ | §9.2.2 (như trên) · §9.3.5 "Responses to the DELETE method are not cacheable" |
| **POST** | ❌ | ❌ | ⚠️ có điều kiện | không nằm trong danh sách safe §9.2.1 và danh sách idempotent §9.2.2 · §9.3.3 "Responses to POST requests are only cacheable when they include explicit freshness information … and a Content-Location header field that has the same value as the POST's target URI" |
| **PATCH** | ❌ | ❌ | ❌ | RFC 5789 §2 "PATCH is neither safe nor idempotent" · không nằm trong "caching semantics for GET, HEAD, and POST" (§9.2.3) |
| **CONNECT** | ❌ | ❌ | ❌ | không nằm trong danh sách safe §9.2.1 và idempotent §9.2.2 · §9.3.6 "Responses to the CONNECT method are not cacheable" |

Ghi chú cách đọc bảng: RFC không liệt kê riêng "method nào không safe/không idempotent" — nó **liệt kê danh sách đóng** các method safe (GET, HEAD, OPTIONS, TRACE) và idempotent (PUT, DELETE + safe methods). Method không có tên trong danh sách thì không có thuộc tính đó.

> [!tip] Quan hệ giữa ba thuộc tính
> safe ⇒ idempotent (vì §9.2.2 gộp "safe request methods" vào danh sách idempotent). Chiều ngược lại thì không: PUT và DELETE idempotent nhưng không safe. Và cacheable gần như chỉ đi cùng safe.

---

## 5. Resource, Representation và Content Negotiation

Đây là nền để hiểu bài REST tiếp theo. Nếu ba khái niệm này mờ thì REST sẽ chỉ còn là "URL đặt theo danh từ", tức là hiểu sai.

### 5.1. Resource

📖 **Nguyên văn** (RFC 9110 §3.1 Resources)
> "The target of an HTTP request is called a \"resource\".  HTTP does not limit the nature of a resource; it merely defines an interface that might be used to interact with resources.  Most resources are identified by a Uniform Resource Identifier (URI), as described in Section 4."

🇻🇳 **Dịch**
> "Đối tượng đích của một HTTP request được gọi là một \"resource\". HTTP **không giới hạn bản chất** của resource; nó chỉ định nghĩa một interface có thể dùng để tương tác với các resource. Phần lớn resource được định danh bằng một Uniform Resource Identifier (URI), như mô tả ở mục 4."

📖 **Nguyên văn** (RFC 9110 §3.1)
> "One design goal of HTTP is to separate resource identification from request semantics, which is made possible by vesting the request semantics in the request method (Section 9) and a few request-modifying header fields.  A resource cannot treat a request in a manner inconsistent with the semantics of the method of the request.  For example, though the URI of a resource might imply semantics that are not safe, a client can expect the resource to avoid actions that are unsafe when processing a request with a safe method (see Section 9.2.1)."

🇻🇳 **Dịch**
> "Một mục tiêu thiết kế của HTTP là **tách việc định danh resource khỏi ngữ nghĩa của request**, điều này làm được bằng cách giao ngữ nghĩa request cho request method (mục 9) và một vài header field sửa đổi request. Một resource không được xử lý request theo cách mâu thuẫn với ngữ nghĩa của method trong request đó. Ví dụ, dù URI của một resource có thể ngụ ý ngữ nghĩa không safe, client vẫn có quyền kỳ vọng resource tránh các hành động unsafe khi xử lý một request dùng safe method (xem mục 9.2.1)."

> [!note] Đọc kỹ câu này
> "though the URI of a resource might imply semantics that are not safe" — tức là kể cả URI của bạn tên là `/delete-everything`, một `GET` lên nó **vẫn phải** read-only. URI chỉ *định danh*, method mới *quyết định hành động*. Đây là cùng một bài học ở §9.2.1, nhưng nói từ góc URI.

### 5.2. Representation

📖 **Nguyên văn** (RFC 9110 §3.2 Representations)
> "A \"representation\" is information that is intended to reflect a past, current, or desired state of a given resource, in a format that can be readily communicated via the protocol.  A representation consists of a set of representation metadata and a potentially unbounded stream of representation data (Section 8)."

🇻🇳 **Dịch**
> "Một \"representation\" là thông tin nhằm phản ánh state **quá khứ, hiện tại, hoặc mong muốn** của một resource nào đó, ở một định dạng có thể truyền đi dễ dàng qua protocol. Một representation gồm một tập representation metadata và một luồng representation data có thể dài vô hạn (mục 8)."

📖 **Nguyên văn** (RFC 9110 §3.2)
> "HTTP allows \"information hiding\" behind its uniform interface by defining communication with respect to a transferable representation of the resource state, rather than transferring the resource itself.  This allows the resource identified by a URI to be anything, including temporal functions like \"the current weather in Laguna Beach\", while potentially providing information that represents that resource at the time a message is generated [REST]."

🇻🇳 **Dịch**
> "HTTP cho phép \"che giấu thông tin\" sau interface đồng nhất của nó, bằng cách định nghĩa việc giao tiếp dựa trên một representation truyền đi được của state của resource, thay vì truyền đi chính bản thân resource. Điều này cho phép resource được định danh bởi một URI là **bất cứ thứ gì**, kể cả các hàm theo thời gian như \"thời tiết hiện tại ở Laguna Beach\", trong khi vẫn cung cấp được thông tin đại diện cho resource đó tại thời điểm message được sinh ra [REST]."

📖 **Nguyên văn** (RFC 9110 §3.2)
> "The uniform interface is similar to a window through which one can observe and act upon a thing only through the communication of messages to an independent actor on the other side.  A shared abstraction is needed to represent (\"take the place of\") the current or desired state of that thing in our communications."

🇻🇳 **Dịch**
> "Interface đồng nhất giống như một **cửa sổ**, qua đó người ta chỉ có thể quan sát và tác động lên một vật bằng cách trao đổi message với một tác nhân độc lập ở phía bên kia. Cần có một trừu tượng chung để đại diện (\"đứng thay chỗ cho\") state hiện tại hoặc state mong muốn của vật đó trong các trao đổi của chúng ta."

💡 **Ví dụ đời sống — resource vs representation**

Hãy nghĩ tới **"nhiệt độ phòng khách nhà bạn"**.

- **Resource** = chính cái khái niệm "nhiệt độ phòng khách". Nó không phải một con số, không phải một file. Nó là một *thứ có thể hỏi về*. Bạn không thể "gửi nhiệt độ phòng khách" qua mạng.
- **Representation** = câu trả lời cụ thể tại một thời điểm, ở một định dạng cụ thể: `{"celsius": 27.5}`, hoặc `"81.5°F"`, hoặc một biểu đồ PNG. Ba thứ này là **ba representation khác nhau của cùng một resource**.
- Đúng như RFC nói: resource có thể là "the current weather in Laguna Beach" — một thứ thay đổi liên tục, không phải file nằm trên đĩa.

Đây là lý do câu "REST = mỗi row trong database là một resource" là hiểu sai. Resource là **khái niệm**, representation là **thứ bạn truyền đi**. Bảng trong database chỉ là chi tiết cài đặt bị giấu sau interface.

📖 **Nguyên văn** (RFC 9110 §3.2)
> "A target resource might be provided with, or be capable of generating, multiple representations that are each intended to reflect the resource's current state.  An algorithm, usually based on content negotiation (Section 12), would be used to select one of those representations as being most applicable to a given request.  This \"selected representation\" provides the data and metadata for evaluating conditional requests (Section 13) and constructing the content for 200 (OK), 206 (Partial Content), and 304 (Not Modified) responses to GET (Section 9.3.1)."

🇻🇳 **Dịch**
> "Một target resource có thể được cấp cho, hoặc có khả năng sinh ra, **nhiều representation**, mỗi cái đều nhằm phản ánh state hiện tại của resource. Một thuật toán, thường dựa trên content negotiation (mục 12), sẽ được dùng để chọn ra một trong các representation đó là phù hợp nhất cho một request cụ thể. \"Selected representation\" này cung cấp data và metadata để đánh giá các conditional request (mục 13) và để dựng content cho các response 200 (OK), 206 (Partial Content) và 304 (Not Modified) của GET."

→ Đoạn này nối thẳng ba thứ lại: **nhiều representation → content negotiation chọn một → cái được chọn là căn cứ cho ETag / 304**. Cả mục 6 bên dưới xoay quanh dây chuyền này.

### 5.3. Representation data

📖 **Nguyên văn** (RFC 9110 §8.1 Representation Data)
> "The representation data associated with an HTTP message is either provided as the content of the message or referred to by the message semantics and the target URI.  The representation data is in a format and encoding defined by the representation metadata header fields.
>
>    The data type of the representation data is determined via the header fields Content-Type and Content-Encoding.  These define a two-layer, ordered encoding model:
>
>      representation-data := Content-Encoding( Content-Type( data ) )"

🇻🇳 **Dịch**
> "Representation data gắn với một HTTP message thì hoặc được cung cấp như content của message, hoặc được trỏ tới bởi ngữ nghĩa của message và target URI. Representation data ở một định dạng và encoding được định nghĩa bởi các header field representation metadata.
>
> Kiểu dữ liệu của representation data được xác định qua hai header field Content-Type và Content-Encoding. Chúng định nghĩa một mô hình encoding hai tầng, có thứ tự:
>
> `representation-data := Content-Encoding( Content-Type( data ) )`"

🇻🇳 Công thức trên đọc là: dữ liệu gốc được đóng theo Content-Type (ví dụ serialize thành JSON) trước, rồi mới được đóng theo Content-Encoding (ví dụ nén gzip) ở ngoài. Bên nhận phải mở ngược lại: giải nén trước, parse JSON sau.

### 5.4. Content negotiation

📖 **Nguyên văn** (RFC 9110 §12 Content Negotiation)
> "When responses convey content, whether indicating a success or an error, the origin server often has different ways of representing that information; for example, in different formats, languages, or encodings.  Likewise, different users or user agents might have differing capabilities, characteristics, or preferences that could influence which representation, among those available, would be best to deliver.  For this reason, HTTP provides mechanisms for content negotiation."

🇻🇳 **Dịch**
> "Khi response mang theo content, dù là báo thành công hay báo lỗi, origin server thường có nhiều cách khác nhau để biểu diễn thông tin đó; ví dụ ở các định dạng, ngôn ngữ, hoặc encoding khác nhau. Tương tự, người dùng hay user agent khác nhau có thể có khả năng, đặc tính, hoặc sở thích khác nhau, ảnh hưởng tới việc representation nào trong số có sẵn là phù hợp nhất để gửi đi. Vì lý do này, HTTP cung cấp các cơ chế cho content negotiation."

📖 **Nguyên văn** (RFC 9110 §12)
> "This specification defines three patterns of content negotiation that can be made visible within the protocol: \"proactive\" negotiation, where the server selects the representation based upon the user agent's stated preferences; \"reactive\" negotiation, where the server provides a list of representations for the user agent to choose from; and \"request content\" negotiation, where the user agent selects the representation for a future request based upon the server's stated preferences in past responses."

🇻🇳 **Dịch**
> "Đặc tả này định nghĩa ba kiểu content negotiation có thể nhìn thấy được bên trong protocol: negotiation \"proactive\", trong đó **server chọn** representation dựa trên sở thích mà user agent đã nêu; negotiation \"reactive\", trong đó server đưa ra một **danh sách** representation để user agent chọn; và negotiation \"request content\", trong đó user agent chọn representation cho request tương lai dựa trên sở thích mà server đã nêu trong các response trước đó."

📖 **Nguyên văn** (RFC 9110 §12.1 Proactive Negotiation)
> "When content negotiation preferences are sent by the user agent in a request to encourage an algorithm located at the server to select the preferred representation, it is called \"proactive negotiation\" (a.k.a., \"server-driven negotiation\")."

🇻🇳 **Dịch**
> "Khi các sở thích content negotiation được user agent gửi trong một request nhằm thúc đẩy một thuật toán nằm ở phía server chọn ra representation được ưa thích, thì gọi là \"proactive negotiation\" (còn gọi là \"server-driven negotiation\")."

Trong thực tế API, 99% trường hợp bạn gặp là **proactive negotiation** qua header `Accept`. Đây cũng là cơ chế chuẩn để làm versioning theo media type (`Accept: application/vnd.myapp.v2+json`) — dùng chính negotiation có sẵn của HTTP thay vì nhét version vào URL.

---

## 6. Các header quan trọng khi làm API

### 6.1. Content-Type

📖 **Nguyên văn** (RFC 9110 §8.3)
> "The \"Content-Type\" header field indicates the media type of the associated representation: either the representation enclosed in the message content or the selected representation, as determined by the message semantics.  The indicated media type defines both the data format and how that data is intended to be processed by a recipient, within the scope of the received message semantics, after any content codings indicated by Content-Encoding are decoded."

🇻🇳 **Dịch**
> "Header field \"Content-Type\" cho biết media type của representation liên quan: hoặc là representation nằm trong content của message, hoặc là selected representation, tuỳ theo ngữ nghĩa của message. Media type được chỉ ra định nghĩa cả **định dạng dữ liệu** lẫn **cách dữ liệu đó được mong đợi sẽ xử lý** bởi bên nhận, trong phạm vi ngữ nghĩa của message nhận được, sau khi mọi content coding chỉ ra bởi Content-Encoding đã được giải mã."

📖 **Nguyên văn** (RFC 9110 §8.3)
> "A sender that generates a message containing content SHOULD generate a Content-Type header field in that message unless the intended media type of the enclosed representation is unknown to the sender.  If a Content-Type header field is not present, the recipient MAY either assume a media type of \"application/octet-stream\" ([RFC2046], Section 4.5.1) or examine the data to determine its type."

🇻🇳 **Dịch**
> "Bên gửi tạo ra một message có content **NÊN** sinh ra header field Content-Type trong message đó, trừ khi bên gửi không biết media type dự định của representation kèm theo. Nếu không có header field Content-Type, bên nhận **CÓ THỂ** hoặc giả định media type là \"application/octet-stream\", hoặc tự xem xét dữ liệu để xác định kiểu của nó."

> [!warning] Thiếu Content-Type là lỗi thật, không phải chuyện nhỏ
> Spec cho phép bên nhận đoán mò hoặc coi payload là binary thô. Nghĩa là JSON của bạn có thể bị đối tác parse sai một cách hợp lệ theo spec.

### 6.2. Accept

📖 **Nguyên văn** (RFC 9110 §12.5.1)
> "The \"Accept\" header field can be used by user agents to specify their preferences regarding response media types.  For example, Accept header fields can be used to indicate that the request is specifically limited to a small set of desired types, as in the case of a request for an in-line image.
>
>    When sent by a server in a response, Accept provides information about which content types are preferred in the content of a subsequent request to the same resource."

🇻🇳 **Dịch**
> "Header field \"Accept\" có thể được user agent dùng để nêu sở thích của mình về media type của response. Ví dụ, header field Accept có thể dùng để cho biết request bị giới hạn cụ thể trong một tập nhỏ các kiểu mong muốn, như trong trường hợp request một ảnh in-line.
>
> Khi được server gửi trong một response, Accept cung cấp thông tin về những content type nào được ưa thích trong content của một request sau đó tới cùng resource."

📖 **Nguyên văn** (RFC 9110 §12.5.1)
> "The asterisk \"*\" character is used to group media types into ranges, with \"*/*\" indicating all media types and \"type/*\" indicating all subtypes of that type.  The media-range can include media type parameters that are applicable to that range."

🇻🇳 **Dịch**
> "Ký tự dấu sao \"*\" được dùng để gom các media type thành các dải, với \"*/*\" nghĩa là mọi media type và \"type/*\" nghĩa là mọi subtype của kiểu đó. Media-range có thể kèm các parameter media type áp dụng cho dải đó."

📖 **Nguyên văn** (RFC 9110 §12.5.1)
> "Each media-range might be followed by optional applicable media type parameters (e.g., charset), followed by an optional \"q\" parameter for indicating a relative weight (Section 12.4.2)."

🇻🇳 **Dịch**
> "Mỗi media-range có thể được theo sau bởi các parameter media type tuỳ chọn phù hợp (ví dụ charset), rồi tới một parameter \"q\" tuỳ chọn để chỉ ra một **trọng số tương đối** (mục 12.4.2)."

🇻🇳 Ví dụ đọc header `Accept: application/json;q=1.0, text/xml;q=0.5, */*;q=0.1` — client nói: ưu tiên nhất JSON, không có thì XML, cùng lắm thì gì cũng được.

### 6.3. Authorization

📖 **Nguyên văn** (RFC 9110 §11.6.2)
> "The \"Authorization\" header field allows a user agent to authenticate itself with an origin server -- usually, but not necessarily, after receiving a 401 (Unauthorized) response.  Its value consists of credentials containing the authentication information of the user agent for the realm of the resource being requested."

🇻🇳 **Dịch**
> "Header field \"Authorization\" cho phép một user agent tự xác thực với origin server — thường là, nhưng không nhất thiết là, sau khi nhận một response 401 (Unauthorized). Giá trị của nó gồm credentials chứa thông tin xác thực của user agent cho realm của resource đang được request."

📖 **Nguyên văn** (RFC 9110 §11.6.2)
> "A proxy forwarding a request MUST NOT modify any Authorization header fields in that request.  See Section 3.5 of [CACHING] for details of and requirements pertaining to handling of the Authorization header field by HTTP caches."

🇻🇳 **Dịch**
> "Một proxy khi chuyển tiếp request **BẮT BUỘC KHÔNG** được sửa bất kỳ header field Authorization nào trong request đó. Xem mục 3.5 của [CACHING] để biết chi tiết và các yêu cầu về việc HTTP cache xử lý header field Authorization."

> [!danger] Authorization và cache
> Response cho request có `Authorization` bị đối xử đặc biệt bởi cache (RFC 9111 §3.5). Nếu bạn đặt `Cache-Control: public` bừa lên response có dữ liệu cá nhân, bạn đang tự tạo ra lỗ hổng rò rỉ dữ liệu giữa các user qua tầng CDN.

### 6.4. Cache-Control

📖 **Nguyên văn** (RFC 9111 §5.2)
> "The \"Cache-Control\" header field is used to list directives for caches along the request/response chain.  Cache directives are unidirectional, in that the presence of a directive in a request does not imply that the same directive is present or copied in the response."

🇻🇳 **Dịch**
> "Header field \"Cache-Control\" được dùng để liệt kê các directive cho các cache dọc theo chuỗi request/response. Các cache directive là **một chiều**, ở chỗ sự có mặt của một directive trong request không hàm ý directive đó cũng có mặt hay được sao chép sang response."

📖 **Nguyên văn** (RFC 9111 §5.2)
> "A proxy, whether or not it implements a cache, MUST pass cache directives through in forwarded messages, regardless of their significance to that application, since the directives might apply to all recipients along the request/response chain.  It is not possible to target a directive to a specific cache."

🇻🇳 **Dịch**
> "Một proxy, dù có cài đặt cache hay không, **BẮT BUỘC** phải chuyển tiếp nguyên các cache directive trong message nó forward, bất kể directive đó có ý nghĩa gì với nó, vì directive có thể áp dụng cho mọi bên nhận dọc chuỗi request/response. **Không thể** nhắm một directive vào một cache cụ thể."

> [!note] Hệ quả thiết kế
> "It is not possible to target a directive to a specific cache" nghĩa là bạn không thể nói "chỉ CDN được cache, browser thì không" bằng một directive riêng lẻ. Bạn phải dùng các directive mà spec đã định nghĩa sẵn cho từng loại cache (shared vs private) — đó là lý do tồn tại của cặp `public` / `private`.

### 6.5. ETag

📖 **Nguyên văn** (RFC 9110 §8.8.3)
> "The \"ETag\" field in a response provides the current entity tag for the selected representation, as determined at the conclusion of handling the request.  An entity tag is an opaque validator for differentiating between multiple representations of the same resource, regardless of whether those multiple representations are due to resource state changes over time, content negotiation resulting in multiple representations being valid at the same time, or both.  An entity tag consists of an opaque quoted string, possibly prefixed by a weakness indicator."

🇻🇳 **Dịch**
> "Field \"ETag\" trong một response cung cấp entity tag hiện tại cho **selected representation**, được xác định vào lúc kết thúc xử lý request. Một entity tag là một **validator dạng opaque** dùng để phân biệt giữa nhiều representation của cùng một resource, bất kể việc có nhiều representation đó là do state của resource thay đổi theo thời gian, do content negotiation khiến nhiều representation cùng hợp lệ tại một thời điểm, hay cả hai. Một entity tag gồm một chuỗi trong dấu nháy có tính opaque, có thể có tiền tố là chỉ báo weak."

📖 **Nguyên văn** (RFC 9110 §8.8.3)
> "An entity tag can be more reliable for validation than a modification date in situations where it is inconvenient to store modification dates, where the one-second resolution of HTTP-date values is not sufficient, or where modification dates are not consistently maintained."

🇻🇳 **Dịch**
> "Một entity tag có thể đáng tin cậy hơn ngày sửa đổi khi dùng để validation, trong các tình huống mà việc lưu ngày sửa đổi là bất tiện, khi độ phân giải một giây của giá trị HTTP-date là không đủ, hoặc khi ngày sửa đổi không được duy trì nhất quán."

> [!tip] "opaque" là từ khoá
> ETag là **chuỗi mờ đục**: client không được suy diễn gì từ nội dung của nó, chỉ được so sánh bằng/khác. Bạn tự do sinh ETag bằng hash nội dung, số version trong DB, hay bất cứ gì — miễn là thay đổi khi representation đổi. Lưu ý ETag gắn với **representation** chứ không phải resource: cùng một resource trả JSON và trả XML thì phải có hai ETag khác nhau, đúng như câu "content negotiation resulting in multiple representations being valid at the same time".

### 6.6. If-None-Match

📖 **Nguyên văn** (RFC 9110 §13.1.2)
> "The \"If-None-Match\" header field makes the request method conditional on a recipient cache or origin server either not having any current representation of the target resource, when the field value is \"*\", or having a selected representation with an entity tag that does not match any of those listed in the field value."

🇻🇳 **Dịch**
> "Header field \"If-None-Match\" làm cho request method trở nên **có điều kiện**: điều kiện là cache bên nhận hoặc origin server hoặc không có representation hiện tại nào của target resource (khi giá trị field là \"*\"), hoặc có một selected representation mà entity tag của nó **không khớp** với bất kỳ tag nào liệt kê trong giá trị field."

📖 **Nguyên văn** (RFC 9110 §13.1.2)
> "A recipient MUST use the weak comparison function when comparing entity tags for If-None-Match (Section 8.8.3.2), since weak entity tags can be used for cache validation even if there have been changes to the representation data."

🇻🇳 **Dịch**
> "Bên nhận **BẮT BUỘC** dùng hàm so sánh weak khi so entity tag cho If-None-Match (mục 8.8.3.2), vì weak entity tag có thể dùng để validate cache ngay cả khi representation data đã có thay đổi."

📖 **Nguyên văn** (RFC 9110 §13.1.2 — ví dụ trong spec)
> ```
> If-None-Match: "xyzzy"
> If-None-Match: W/"xyzzy"
> If-None-Match: "xyzzy", "r2d2xxxx", "c3piozzzz"
> If-None-Match: W/"xyzzy", W/"r2d2xxxx", W/"c3piozzzz"
> If-None-Match: *
> ```

🇻🇳 Các ví dụ hợp lệ của field: một tag đơn, một tag weak (tiền tố `W/`), một danh sách tag, một danh sách tag weak, và ký tự `*` nghĩa là "với mọi representation hiện có".

**Dây chuyền hoàn chỉnh** (nối lại §3.2 → §12 → §8.8.3 → §13.1.2):

1. Client: `GET /products/42` với `Accept: application/json`
2. Server: content negotiation chọn selected representation → trả `200` + `Content-Type: application/json` + `ETag: "a1b2c3"`
3. Lần sau, client: `GET /products/42` với `If-None-Match: "a1b2c3"`
4. Nếu ETag hiện tại vẫn là `"a1b2c3"` → server trả **`304 Not Modified`, không có body**. Tiết kiệm toàn bộ băng thông payload.

> [!tip] If-None-Match còn dùng để chống ghi đè
> Với `PUT`/`PATCH`, cặp `ETag` + `If-Match` (anh em của `If-None-Match`) cho phép nói "chỉ ghi nếu bản trên server vẫn là bản tôi đã đọc" — tức optimistic locking ở tầng HTTP, tránh hai client ghi đè lên nhau.

---

## 7. Tóm tắt — checklist thiết kế API dựa trên HTTP

- [ ] Mỗi endpoint dùng method đúng ngữ nghĩa RFC 9110 §9.3, **không** tự định nghĩa lại.
- [ ] Không có hành động thay đổi state nào nấp sau GET/HEAD/OPTIONS/TRACE (§9.2.1 — MUST).
- [ ] PUT và DELETE thực sự idempotent: gọi 5 lần = gọi 1 lần về mặt state (§9.2.2).
- [ ] POST có tác dụng phụ tiền bạc/dữ liệu → có cơ chế chống lặp (idempotency key), vì spec cấm proxy tự retry POST nhưng không cấm client "đoán liều" (§9.2.2).
- [ ] Mọi response có body đều có `Content-Type` (§8.3 — SHOULD).
- [ ] Response chứa dữ liệu riêng tư không bao giờ được đánh dấu cache dùng chung (§11.6.2 + RFC 9111 §3.5).
- [ ] Resource nặng, đọc nhiều → có `ETag`, hỗ trợ `If-None-Match` → trả `304` (§8.8.3, §13.1.2).
- [ ] Phân biệt rõ trong đầu: **resource** là khái niệm, **representation** là thứ truyền đi (§3.1, §3.2).

---

## Liên kết

- Bài kế: [[02 - REST]]
- [[02 - What is HTTP]] — HTTP nhập môn: request/response, status code, URL, HTTPS. Đọc lại nếu phần method/header ở trên còn lạ.
- [[01 - How does the internet work]] — tầng bên dưới HTTP, giải thích vì sao "mất kết nối giữa chừng" là tình huống có thật và idempotent mới quan trọng đến vậy.
- [[05 - DNS and how it works]] — cách một hostname trong URI của API được phân giải thành địa chỉ thật.
- [[11 - NULL, Hàm String, Date và JSON]] — JSON/JSONB phía database, liên quan tới `Content-Type: application/json` của representation.
- [[13 - SQL Injection và Parameterized Query]] — dữ liệu đến từ API request là input không tin cậy; đây là lỗ hổng kinh điển ở tầng ngay sau API.
- [[07 - N+1 Problem]] — vấn đề hiệu năng nền tảng, sẽ quay lại rất đậm khi học REST và GraphQL.

## Nguồn tham khảo

- RFC 9110 — *HTTP Semantics* : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 9112 — *HTTP/1.1* : https://www.rfc-editor.org/rfc/rfc9112.txt
- RFC 9111 — *HTTP Caching* (tham chiếu `[CACHING]` trong RFC 9110, dùng cho `Cache-Control` §5.2) : https://www.rfc-editor.org/rfc/rfc9111.txt
- RFC 5789 — *PATCH Method for HTTP* (được RFC 9110 dẫn trong mục References) : https://www.rfc-editor.org/rfc/rfc5789.txt
- roadmap.sh backend — mục *APIs* : https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/roadmaps/backend/content/learn-about-apis%40EwvLPSI6AlZ4TnNIJTZA4.md
