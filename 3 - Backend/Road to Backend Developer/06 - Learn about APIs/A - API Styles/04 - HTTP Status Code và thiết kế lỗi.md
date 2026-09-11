# 04 — HTTP Status Code và thiết kế lỗi

> **Nguồn chính:** RFC 9110 "HTTP Semantics", §15 Status Codes — https://www.rfc-editor.org/rfc/rfc9110.txt
> **Nguồn chính phần B:** RFC 9457 "Problem Details for HTTP APIs" — https://www.rfc-editor.org/rfc/rfc9457.txt
> Bài này bám §15 của RFC 9110 (5 lớp status code + các code hay dùng nhất trong API), rồi sang RFC 9457 — chuẩn IETF cho **định dạng lỗi** của API, thứ rất ít người biết nhưng nên dùng.

Trước khi đọc: phần nền tảng HTTP (request/response, header, method) đã có ở [[01 - API là gì và nền tảng HTTP]] và [[02 - What is HTTP]] — bài này không lặp lại.

---

# PHẦN A — Status code

## A1. Status code là gì

📖 **Nguyên văn** — RFC 9110 §15

> "The status code of a response is a three-digit integer code that describes the result of the request and the semantics of the response, including whether the request was successful and what content is enclosed (if any).  All valid status codes are within the range of 100 to 599, inclusive."

🇻🇳 **Dịch**

> "Status code của một response là một số nguyên ba chữ số mô tả kết quả của request và semantics của response, bao gồm việc request có thành công hay không và nội dung nào đang được đính kèm (nếu có). Mọi status code hợp lệ đều nằm trong khoảng từ 100 đến 599."

Câu này quan trọng hơn vẻ ngoài của nó: status code **là** nơi chứa kết luận thành công/thất bại. Không phải body.

📖 **Nguyên văn** — RFC 9110 §15

> "The first digit of the status code defines the class of response.  The last two digits do not have any categorization role."

🇻🇳 **Dịch**

> "Chữ số đầu tiên của status code xác định lớp (class) của response. Hai chữ số cuối không đóng vai trò phân loại nào."

---

## A2. Năm lớp status code (1xx–5xx)

📖 **Nguyên văn** — RFC 9110 §15, danh sách năm giá trị của chữ số đầu

> "*  1xx (Informational): The request was received, continuing process
>  *  2xx (Successful): The request was successfully received, understood, and accepted
>  *  3xx (Redirection): Further action needs to be taken in order to complete the request
>  *  4xx (Client Error): The request contains bad syntax or cannot be fulfilled
>  *  5xx (Server Error): The server failed to fulfill an apparently valid request"

🇻🇳 **Dịch**

> "* 1xx (Informational): Request đã được nhận, đang tiếp tục xử lý
>  * 2xx (Successful): Request đã được nhận, hiểu và chấp nhận thành công
>  * 3xx (Redirection): Cần thực hiện thêm hành động nữa để hoàn tất request
>  * 4xx (Client Error): Request chứa cú pháp sai hoặc không thể được đáp ứng
>  * 5xx (Server Error): Server thất bại trong việc đáp ứng một request trông có vẻ hợp lệ"

Định nghĩa chi tiết từng lớp, cũng nguyên văn RFC 9110:

📖 **Nguyên văn** — §15.2, §15.3, §15.4, §15.5, §15.6

> "The 1xx (Informational) class of status code indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response."
>
> "The 2xx (Successful) class of status code indicates that the client's request was successfully received, understood, and accepted."
>
> "The 3xx (Redirection) class of status code indicates that further action needs to be taken by the user agent in order to fulfill the request."
>
> "The 4xx (Client Error) class of status code indicates that the client seems to have erred.  Except when responding to a HEAD request, the server SHOULD send a representation containing an explanation of the error situation, and whether it is a temporary or permanent condition."
>
> "The 5xx (Server Error) class of status code indicates that the server is aware that it has erred or is incapable of performing the requested method.  Except when responding to a HEAD request, the server SHOULD send a representation containing an explanation of the error situation, and whether it is a temporary or permanent condition."

🇻🇳 **Dịch**

> "Lớp status code 1xx (Informational) chỉ ra một response tạm thời (interim) dùng để truyền đạt trạng thái kết nối hoặc tiến độ của request, trước khi hoàn tất hành động được yêu cầu và gửi response cuối cùng."
>
> "Lớp status code 2xx (Successful) chỉ ra rằng request của client đã được nhận, hiểu và chấp nhận thành công."
>
> "Lớp status code 3xx (Redirection) chỉ ra rằng user agent cần thực hiện thêm hành động nữa để đáp ứng request."
>
> "Lớp status code 4xx (Client Error) chỉ ra rằng client có vẻ đã làm sai. Trừ khi đang trả lời một request HEAD, server **SHOULD** gửi kèm một representation giải thích tình huống lỗi, và cho biết đó là tình trạng tạm thời hay vĩnh viễn."
>
> "Lớp status code 5xx (Server Error) chỉ ra rằng server ý thức được là nó đã lỗi hoặc không có khả năng thực hiện method được yêu cầu. Trừ khi đang trả lời một request HEAD, server **SHOULD** gửi kèm một representation giải thích tình huống lỗi, và cho biết đó là tình trạng tạm thời hay vĩnh viễn."

> [!tip] Hai câu 4xx/5xx ở trên chính là chỗ RFC "bật đèn xanh" cho việc trả **body mô tả lỗi**. Nhưng chú ý: nó nói gửi kèm giải thích *cùng với* status code lỗi, chứ không phải thay thế status code. Đây là cầu nối sang PHẦN B (RFC 9457).

💡 **Ví dụ đời sống**
Nghĩ về chữ số đầu như **màu đèn giao thông mở rộng**: 2xx = xanh (đi được), 3xx = biển chỉ đường (rẽ hướng khác), 4xx = công an thổi phạt *bạn* (giấy tờ bạn sai), 5xx = đèn tín hiệu hỏng (không phải lỗi bạn, do hệ thống). Người đi đường chỉ cần nhìn màu là biết phải làm gì, không cần đọc hết tờ biên bản.

### Quy tắc dự phòng: không hiểu code lạ thì làm gì

📖 **Nguyên văn** — RFC 9110 §15

> "HTTP status codes are extensible.  A client is not required to understand the meaning of all registered status codes, though such understanding is obviously desirable.  However, a client MUST understand the class of any status code, as indicated by the first digit, and treat an unrecognized status code as being equivalent to the x00 status code of that class."

🇻🇳 **Dịch**

> "Status code của HTTP có thể mở rộng. Client không bắt buộc phải hiểu ý nghĩa của mọi status code đã đăng ký, dù rõ ràng hiểu được thì tốt hơn. Tuy nhiên, client **MUST** hiểu lớp của bất kỳ status code nào, thể hiện qua chữ số đầu tiên, và phải coi một status code không nhận diện được như tương đương với status code x00 của lớp đó."

Tức là: client nhận 471 lạ hoắc thì cứ xử lý như 400. Nhận 599 thì xử lý như 500. Đây là lý do bạn có thể an tâm dùng những code ít phổ biến như 409, 422 — client viết đúng chuẩn vẫn không vỡ.

---

## A3. Bảng các status code dùng nhiều nhất trong API

Cột "Mô tả nguyên văn" là trích **rút gọn** từ đúng mục tương ứng của RFC 9110 (429 từ RFC 6585).

| Code | Tên | Mô tả nguyên văn (rút gọn) | Dịch | Khi nào dùng |
|---|---|---|---|---|
| 200 | OK | "indicates that the request has succeeded" | chỉ ra rằng request đã thành công | GET trả dữ liệu; PUT/PATCH sửa xong và có trả body |
| 201 | Created | "indicates that the request has been fulfilled and has resulted in one or more new resources being created" | request đã được đáp ứng và đã dẫn tới việc tạo ra một hoặc nhiều resource mới | POST tạo mới; PUT tạo mới. Kèm header `Location` |
| 202 | Accepted | "indicates that the request has been accepted for processing, but the processing has not been completed" | request đã được chấp nhận để xử lý, nhưng việc xử lý chưa hoàn tất | Job bất đồng bộ: queue, import file lớn, bulk operation |
| 204 | No Content | "indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response content" | server đã đáp ứng request thành công và không có nội dung bổ sung nào để gửi trong response content | DELETE thành công; PUT/PATCH thành công nhưng không trả body |
| 301 | Moved Permanently | "indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs" | target resource đã được gán một URI vĩnh viễn mới và mọi tham chiếu tương lai tới resource này nên dùng một trong các URI đính kèm | Đổi domain, đổi đường dẫn API cũ vĩnh viễn |
| 304 | Not Modified | "indicates that a conditional GET or HEAD request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition evaluated to false" | một conditional GET hoặc HEAD request đã được nhận và lẽ ra sẽ cho ra response 200 (OK) nếu không phải vì điều kiện được đánh giá là false | Client gửi `If-None-Match`/`If-Modified-Since` và cache vẫn còn hợp lệ |
| 400 | Bad Request | "indicates that the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)" | server không thể hoặc không chịu xử lý request vì một điều gì đó bị coi là lỗi của client (ví dụ: cú pháp request sai định dạng, khung message request không hợp lệ, hoặc định tuyến request gian dối) | JSON parse lỗi, thiếu query param bắt buộc, kiểu dữ liệu sai cú pháp |
| 401 | Unauthorized | "indicates that the request has not been applied because it lacks valid authentication credentials for the target resource" | request chưa được áp dụng vì nó thiếu authentication credentials hợp lệ cho target resource | Chưa đăng nhập, token thiếu / hết hạn / sai |
| 403 | Forbidden | "indicates that the server understood the request but refuses to fulfill it" | server đã hiểu request nhưng từ chối đáp ứng nó | Đã đăng nhập nhưng không đủ quyền / sai scope / sai tenant |
| 404 | Not Found | "indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists" | origin server không tìm thấy representation hiện tại cho target resource hoặc không muốn tiết lộ rằng nó tồn tại | ID không tồn tại; hoặc cố tình giấu sự tồn tại của resource |
| 405 | Method Not Allowed | "indicates that the method received in the request-line is known by the origin server but not supported by the target resource" | method nhận được trong request-line thì origin server có biết, nhưng không được target resource hỗ trợ | DELETE lên một endpoint chỉ chấp nhận GET. **MUST** kèm header `Allow` |
| 406 | Not Acceptable | "indicates that the target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request" | target resource không có representation hiện tại nào mà user agent chấp nhận được, theo các header field negotiation chủ động nhận được trong request | Client gửi `Accept: application/xml` mà API chỉ có JSON |
| 409 | Conflict | "indicates that the request could not be completed due to a conflict with the current state of the target resource" | request không thể hoàn tất do xung đột với trạng thái hiện tại của target resource | Trùng email khi đăng ký; sửa bản ghi đã bị người khác sửa (optimistic locking) |
| 410 | Gone | "indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent" | việc truy cập tới target resource không còn khả dụng tại origin server và tình trạng này nhiều khả năng là vĩnh viễn | Endpoint API version cũ đã khai tử; resource đã xoá vĩnh viễn và ta muốn nói rõ |
| 415 | Unsupported Media Type | "indicates that the origin server is refusing to service the request because the content is in a format not supported by this method on the target resource" | origin server từ chối phục vụ request vì content đang ở định dạng không được method này hỗ trợ trên target resource | Client POST `Content-Type: text/plain` trong khi API chỉ nhận `application/json` |
| 422 | Unprocessable Content | "indicates that the server understands the content type of the request content ... and the syntax of the request content is correct, but it was unable to process the contained instructions" | server hiểu content type của request content ... và cú pháp của request content là đúng, nhưng nó không thể xử lý các chỉ thị chứa bên trong | JSON đúng cú pháp nhưng sai nghiệp vụ: `age: -5`, `email` sai định dạng, ngày kết thúc trước ngày bắt đầu |
| 429 | Too Many Requests | "indicates that the user has sent too many requests in a given amount of time (\"rate limiting\")" | user đã gửi quá nhiều request trong một khoảng thời gian nhất định ("rate limiting") | Vượt quota API. Nên kèm `Retry-After` |
| 500 | Internal Server Error | "indicates that the server encountered an unexpected condition that prevented it from fulfilling the request" | server gặp một tình huống ngoài dự kiến khiến nó không thể đáp ứng request | Exception không bắt được — lỗi của **ta**, không phải của client |
| 502 | Bad Gateway | "indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request" | server, khi đóng vai trò gateway hoặc proxy, đã nhận một response không hợp lệ từ một server phía trong mà nó truy cập khi cố đáp ứng request | Load balancer / reverse proxy nhận rác từ backend |
| 503 | Service Unavailable | "indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay" | server hiện không thể xử lý request do quá tải tạm thời hoặc bảo trì theo lịch, tình trạng này nhiều khả năng sẽ được giải toả sau một khoảng chờ | Bảo trì, quá tải. **MAY** kèm `Retry-After` |
| 504 | Gateway Timeout | "indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request" | server, khi đóng vai trò gateway hoặc proxy, đã không nhận được response kịp thời từ một upstream server mà nó cần truy cập để hoàn tất request | Backend xử lý quá lâu, proxy hết kiên nhẫn |

> [!note] Nguồn của từng code
> Tất cả các code trên đều định nghĩa trong **RFC 9110** (mục §15.3.x / §15.4.x / §15.5.x / §15.6.x), **trừ 429** — code này đến từ **RFC 6585 "Additional HTTP Status Codes"** §4 (2012), không nằm trong RFC 9110.

---

## A4. 401 vs 403 — chỗ nhầm kinh điển

> [!warning] Đây là cặp bị dùng sai nhiều nhất trong API
> Cả hai đều là 4xx, đều nghĩa là "bạn không vào được", nhưng lý do khác hẳn nhau.

📖 **Nguyên văn** — RFC 9110 §15.5.2 (401 Unauthorized)

> "The 401 (Unauthorized) status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.  The server generating a 401 response MUST send a WWW-Authenticate header field (Section 11.6.1) containing at least one challenge applicable to the target resource.
>
> If the request included authentication credentials, then the 401 response indicates that authorization has been refused for those credentials.  The user agent MAY repeat the request with a new or replaced Authorization header field (Section 11.6.2)."

🇻🇳 **Dịch**

> "Status code 401 (Unauthorized) chỉ ra rằng request chưa được áp dụng vì nó **thiếu authentication credentials hợp lệ** cho target resource. Server sinh ra response 401 **MUST** gửi header field `WWW-Authenticate` (Mục 11.6.1) chứa ít nhất một challenge áp dụng được cho target resource.
>
> Nếu request đã có kèm authentication credentials, thì response 401 chỉ ra rằng quyền truy cập đã bị từ chối đối với những credentials đó. User agent **MAY** lặp lại request với header field `Authorization` mới hoặc đã thay thế."

📖 **Nguyên văn** — RFC 9110 §15.5.4 (403 Forbidden)

> "The 403 (Forbidden) status code indicates that the server understood the request but refuses to fulfill it.  A server that wishes to make public why the request has been forbidden can describe that reason in the response content (if any).
>
> If authentication credentials were provided in the request, the server considers them insufficient to grant access.  The client SHOULD NOT automatically repeat the request with the same credentials.  However, a request might be forbidden for reasons unrelated to the credentials.
>
> An origin server that wishes to "hide" the current existence of a forbidden target resource MAY instead respond with a status code of 404 (Not Found)."

🇻🇳 **Dịch**

> "Status code 403 (Forbidden) chỉ ra rằng server **đã hiểu request nhưng từ chối đáp ứng** nó. Một server muốn công khai lý do request bị cấm có thể mô tả lý do đó trong response content (nếu có).
>
> Nếu authentication credentials đã được cung cấp trong request, server coi chúng là **không đủ** để cấp quyền truy cập. Client **SHOULD NOT** tự động lặp lại request với cùng credentials đó. Tuy nhiên, một request có thể bị cấm vì những lý do không liên quan gì tới credentials.
>
> Một origin server muốn "giấu" sự tồn tại hiện tại của một target resource bị cấm **MAY** trả về status code 404 (Not Found) thay thế."

**Rút ra từ chính hai đoạn trên:**

| | 401 | 403 |
|---|---|---|
| Bản chất | thiếu / sai **credentials** | credentials có nhưng **không đủ quyền**, hoặc lý do khác |
| Header bắt buộc | **MUST** có `WWW-Authenticate` | không có yêu cầu header nào |
| Client nên làm gì | **MAY** thử lại với credentials mới | **SHOULD NOT** thử lại với cùng credentials |
| Câu thần chú | "bạn là ai?" | "tôi biết bạn là ai, nhưng không." |

💡 **Ví dụ đời sống**
Vào toà nhà văn phòng. **401** = bạn chưa quẹt thẻ, bảo vệ chặn ở cửa và **chìa máy quẹt thẻ ra** (`WWW-Authenticate` chính là cái máy quẹt đó — RFC bắt buộc phải chìa ra, nếu không client biết đăng nhập kiểu gì?). Quẹt lại thẻ khác thì có thể vào. **403** = bạn đã quẹt thẻ, thẻ hợp lệ, nhưng thẻ nhân viên tầng 3 không mở được cửa phòng server tầng 9. Quẹt lại 10 lần cũng thế — nên client **SHOULD NOT** thử lại. Còn câu cuối của §15.5.4 là lựa chọn bảo mật: bảo vệ có thể nói thẳng "phòng server tầng 9 anh không vào được" (403), hoặc giả vờ "làm gì có phòng nào tầng 9" (404) để không lộ sơ đồ toà nhà.

> [!tip] Mẹo nhớ: tên tiếng Anh bị đặt ngược
> 401 tên là "Unauthorized" nhưng thực chất nói về **authentication**. 403 tên là "Forbidden" mới là cái nói về **authorization**. Cứ đọc theo định nghĩa RFC, đừng đọc theo tên.

---

## A5. 400 vs 422 — và 422 đến từ đâu

> [!note] 422 có nằm trong RFC 9110 không? — CÓ.
> Trước đây 422 chỉ được định nghĩa trong **RFC 4918 (WebDAV)** với tên "Unprocessable Entity", nên nhiều bài blog vẫn gọi nó là "code của WebDAV". Điều đó **đã cũ**: RFC 9110 (2022) đã đưa 422 vào thẳng core HTTP tại mục **§15.5.21**, và đổi tên thành **"Unprocessable Content"**. Dùng 422 trong REST API ngày nay là hoàn toàn chuẩn, không phải mượn tạm.

📖 **Nguyên văn** — RFC 9110 §15.5.21

> "The 422 (Unprocessable Content) status code indicates that the server understands the content type of the request content (hence a 415 (Unsupported Media Type) status code is inappropriate), and the syntax of the request content is correct, but it was unable to process the contained instructions.  For example, this status code can be sent if an XML request content contains well-formed (i.e., syntactically correct), but semantically erroneous XML instructions."

🇻🇳 **Dịch**

> "Status code 422 (Unprocessable Content) chỉ ra rằng server **hiểu được content type** của request content (do đó status code 415 (Unsupported Media Type) là không phù hợp), và **cú pháp của request content là đúng**, nhưng nó **không thể xử lý các chỉ thị chứa bên trong**. Ví dụ, status code này có thể được gửi nếu một request content XML chứa các chỉ thị XML well-formed (tức là đúng cú pháp) nhưng sai về mặt ngữ nghĩa."

Chính đoạn trích này vạch ra ba tầng lỗi, theo đúng thứ tự server kiểm tra:

| Tầng kiểm tra | Hỏng ở tầng nào | Code |
|---|---|---|
| 1. Content-Type có hỗ trợ không? | không hỗ trợ | **415** |
| 2. Cú pháp payload có parse được không? | parse lỗi (JSON vỡ, thiếu dấu `}`) | **400** |
| 3. Nội dung có hợp lệ về nghiệp vụ không? | parse OK nhưng giá trị vô nghĩa | **422** |

Ví dụ cụ thể với cùng một endpoint `POST /customers`:

```http
Content-Type: text/csv          →  415  (API chỉ nhận application/json)
{"email": "a@b.com",            →  400  (JSON vỡ, thiếu dấu đóng)
{"email": "khong-phai-email"}   →  422  (JSON hợp lệ, nhưng email sai nghiệp vụ)
```

🇻🇳 Ba dòng trên minh hoạ đúng ba tầng ở bảng: sai media type → 415, sai cú pháp → 400, đúng cú pháp nhưng sai ngữ nghĩa → 422.

> [!tip] Có bắt buộc phải dùng 422 không?
> Không. 400 là "ô lớn" hợp lệ cho mọi lỗi phía client — chính định nghĩa §15.5.1 nói "something that is perceived to be a client error", đủ rộng để bao cả lỗi validation. Nhiều API lớn chỉ dùng 400. Nhưng nếu tách 422 ra, client phân biệt được "tôi gửi rác" (400, bug ở code client) với "tôi gửi đúng format nhưng user nhập sai" (422, cần hiện lỗi lên form) — rất đáng giá. **Chọn một cách rồi giữ nhất quán toàn API** là quan trọng hơn chọn cách nào.

---

## A6. PUT vs PATCH và status code tương ứng

📖 **Nguyên văn** — RFC 9110 §9.3.4 (PUT)

> "The PUT method requests that the state of the target resource be created or replaced with the state defined by the representation enclosed in the request message content."

🇻🇳 **Dịch**

> "Method PUT yêu cầu rằng trạng thái của target resource được **tạo mới hoặc thay thế** bằng trạng thái được định nghĩa bởi representation đính kèm trong content của request message."

📖 **Nguyên văn** — RFC 5789 §2 (PATCH Method for HTTP) — nguồn chuẩn định nghĩa PATCH, RFC 9110 §14.5 dẫn chiếu tới nó

> "The difference between the PUT and PATCH requests is reflected in the way the server processes the enclosed entity to modify the resource identified by the Request-URI.  In a PUT request, the enclosed entity is considered to be a modified version of the resource stored on the origin server, and the client is requesting that the stored version be replaced.  With PATCH, however, the enclosed entity contains a set of instructions describing how a resource currently residing on the origin server should be modified to produce a new version."

🇻🇳 **Dịch**

> "Khác biệt giữa request PUT và PATCH thể hiện ở cách server xử lý entity đính kèm để sửa đổi resource được xác định bởi Request-URI. Trong một request PUT, entity đính kèm được coi là một **phiên bản đã sửa của resource** đang lưu trên origin server, và client đang yêu cầu **thay thế** phiên bản đã lưu. Với PATCH, ngược lại, entity đính kèm chứa **một tập chỉ thị mô tả cách resource hiện đang nằm trên origin server nên được sửa đổi** để tạo ra phiên bản mới."

📖 **Nguyên văn** — RFC 5789 §2, về tính idempotent

> "PATCH is neither safe nor idempotent as defined by [RFC2616], Section 9.1."

🇻🇳 **Dịch**

> "PATCH không safe cũng không idempotent theo định nghĩa ở [RFC2616], Mục 9.1."

(Đối lại, RFC 9110 §9.3.4 nói về PUT: *"the intent of PUT is idempotent and visible to intermediaries"* — 🇻🇳 "ý định của PUT là idempotent và nhìn thấy được đối với các intermediaries".)

### Status code nào cho PUT — RFC quy định thẳng

📖 **Nguyên văn** — RFC 9110 §9.3.4

> "If the target resource does not have a current representation and the PUT successfully creates one, then the origin server MUST inform the user agent by sending a 201 (Created) response.  If the target resource does have a current representation and that representation is successfully modified in accordance with the state of the enclosed representation, then the origin server MUST send either a 200 (OK) or a 204 (No Content) response to indicate successful completion of the request."

🇻🇳 **Dịch**

> "Nếu target resource **chưa** có representation hiện tại và PUT tạo ra được một cái, thì origin server **MUST** báo cho user agent bằng cách gửi response **201 (Created)**. Nếu target resource **đã** có representation hiện tại và representation đó được sửa đổi thành công theo trạng thái của representation đính kèm, thì origin server **MUST** gửi hoặc **200 (OK)** hoặc **204 (No Content)** để chỉ ra request đã hoàn tất thành công."

Đây là **MUST**, không phải gợi ý. PUT tạo mới mà trả 200 là sai chuẩn.

📖 **Nguyên văn** — RFC 9110 §9.3.4, về lỗi khi PUT không hợp lệ

> "The 409 (Conflict) or 415 (Unsupported Media Type) status codes are suggested, with the latter being specific to constraints on Content-Type values."

🇻🇳 **Dịch**

> "Các status code **409 (Conflict)** hoặc **415 (Unsupported Media Type)** được gợi ý, trong đó code sau dành riêng cho các ràng buộc về giá trị Content-Type."

### Bảng tổng hợp

| | PUT | PATCH |
|---|---|---|
| Body chứa gì | **toàn bộ** representation mới (thay thế) | **tập chỉ thị** sửa đổi (patch document) |
| Idempotent | có ("the intent of PUT is idempotent") | **không** ("neither safe nor idempotent") |
| Tạo mới resource | **MUST** trả `201 Created` | "MAY create a new resource, depending on the patch document type" |
| Sửa thành công, có trả body | `200 OK` | `200 OK` |
| Sửa thành công, không trả body | `204 No Content` | `204 No Content` |
| Content-Type không hỗ trợ | `415` | `415` |
| Xung đột trạng thái | `409` | `409` |
| Payload đúng cú pháp, sai nghiệp vụ | `422` | `422` |

💡 **Ví dụ đời sống**
PUT là **gửi lại toàn bộ tờ khai đã điền lại từ đầu** — nộp bao nhiêu lần thì tờ khai cuối vẫn y hệt nhau (idempotent). PATCH là **gửi một mẩu giấy ghi "dòng số 3 sửa thành X, thêm 1 vào ô số 7"** — gửi hai lần thì ô số 7 bị cộng 2, ra kết quả khác (không idempotent). Đó chính xác là điều RFC 5789 cảnh báo.

---

## A7. Đừng trả 200 kèm `{"error": ...}`

Đây là lỗi thiết kế API phổ biến nhất: mọi thứ đều `HTTP 200`, còn thành công hay thất bại thì nhét vào body dạng `{"success": false, "error": "..."}`.

**Có câu nào trong RFC phản đối không?** Không có câu nào nói thẳng "đừng làm vậy". Nhưng có ba đoạn trong spec khiến cách làm đó sai về mặt kỹ thuật, đã trích ở trên, gom lại đây:

1. **§15** — *"The status code of a response is a three-digit integer code that describes the result of the request ... including whether the request was successful"* → 🇻🇳 status code **là** nơi biểu đạt thành công/thất bại. Trả 200 cho một request thất bại là khai báo sai kết quả.
2. **§15.3** — *"The 2xx (Successful) class of status code indicates that the client's request was successfully received, understood, and **accepted**"* → 🇻🇳 2xx nghĩa là request đã được **chấp nhận**. Một request bị từ chối vì validation thì không thoả điều kiện này.
3. **§15.1** — *"Responses with status codes that are defined as heuristically cacheable (e.g., 200, 203, 204, 206, 300, 301, 308, 404, 405, 410, 414, and 501 in this specification) can be reused by a cache with heuristic expiration"* → 🇻🇳 200 nằm trong danh sách **heuristically cacheable**. Trả lỗi dưới mã 200 nghĩa là cho phép cache và proxy lưu lại thông báo lỗi đó rồi phát cho request sau. Đây không phải lý thuyết suông mà là hệ quả trực tiếp của spec.

Còn RFC 9457 §1 gọi tên đúng thứ bệnh này:

📖 **Nguyên văn** — RFC 9457 §1 Introduction

> "This specification's aim is to define common error formats for applications that need one so that they aren't required to define their own or, worse, tempted to redefine the semantics of existing HTTP status codes."

🇻🇳 **Dịch**

> "Mục tiêu của đặc tả này là định nghĩa các định dạng lỗi chung cho những ứng dụng cần đến, để chúng không buộc phải tự định nghĩa định dạng riêng, hoặc tệ hơn, **bị cám dỗ định nghĩa lại semantics của các HTTP status code hiện có**."

"Định nghĩa lại semantics của status code hiện có" chính là việc biến 200 thành "có thể thành công, có thể thất bại, đọc body đi rồi biết".

> [!warning] Hệ quả thực tế khi trả 200 cho lỗi
> - Cache/CDN/proxy lưu lại response lỗi (200 là heuristically cacheable) và phục vụ cho người dùng sau.
> - Mọi HTTP client library (`fetch`, `axios`, retry middleware, circuit breaker) coi đó là thành công → không retry, không mở circuit, không cảnh báo.
> - Hệ thống monitoring dựng biểu đồ error rate theo status code sẽ báo **0% lỗi** trong khi API đang hỏng.
> - Lập trình viên client phải đọc tài liệu riêng của bạn mới biết cách phát hiện lỗi — đúng cái mà HTTP sinh ra để tránh.

**Nguyên tắc:** status code cho **máy** (cache, proxy, client library, monitoring), body cho **người và cho logic ứng dụng**. Phần B là chuẩn cho cái body đó.

---

# PHẦN B — RFC 9457: Problem Details for HTTP APIs

> Đây là phần ít người biết nhất trong bài. RFC 9457 (7/2023, Standards Track, thay thế RFC 7807) trả lời câu hỏi: **body của một response lỗi nên có hình dạng nào?**

## B1. Vấn đề nó giải quyết

📖 **Nguyên văn** — RFC 9457, Abstract

> "This document defines a "problem detail" to carry machine-readable details of errors in HTTP response content to avoid the need to define new error response formats for HTTP APIs.
>
> This document obsoletes RFC 7807."

🇻🇳 **Dịch**

> "Tài liệu này định nghĩa một "problem detail" để mang các chi tiết lỗi **máy đọc được** trong content của HTTP response, nhằm tránh việc phải định nghĩa các định dạng response lỗi mới cho các HTTP API.
>
> Tài liệu này thay thế (obsoletes) RFC 7807."

📖 **Nguyên văn** — RFC 9457 §1 Introduction, hai đoạn mở đầu

> "HTTP status codes (Section 15 of [HTTP]) cannot always convey enough information about errors to be helpful.  While humans using web browsers can often understand an HTML [HTML5] response content, non-human consumers of HTTP APIs have difficulty doing so.
>
> To address that shortcoming, this specification defines simple JSON [JSON] and XML [XML] document formats to describe the specifics of a problem encountered -- "problem details"."

🇻🇳 **Dịch**

> "Các HTTP status code (Mục 15 của [HTTP]) **không phải lúc nào cũng truyền tải đủ thông tin** về lỗi để trở nên hữu ích. Trong khi con người dùng trình duyệt web thường có thể hiểu được một response content dạng HTML, thì những bên tiêu thụ HTTP API **không phải con người** lại gặp khó khăn khi làm điều đó.
>
> Để khắc phục thiếu sót đó, đặc tả này định nghĩa các định dạng tài liệu JSON [JSON] và XML [XML] đơn giản để mô tả chi tiết của một vấn đề gặp phải — gọi là "problem details"."

📖 **Nguyên văn** — RFC 9457 §1, ví dụ minh hoạ

> "For example, consider a response indicating that the client's account doesn't have enough credit.  The API's designer might decide to use the 403 Forbidden status code to inform generic HTTP software (such as client libraries, caches, and proxies) of the response's general semantics.  API-specific problem details (such as why the server refused the request and the applicable account balance) can be carried in the response content so that the client can act upon them appropriately (for example, triggering a transfer of more credit into the account)."

🇻🇳 **Dịch**

> "Ví dụ, xét một response cho biết tài khoản của client không đủ tín dụng. Người thiết kế API có thể quyết định dùng status code 403 Forbidden để **thông báo cho các phần mềm HTTP tổng quát** (như client library, cache, và proxy) về semantics chung của response. Còn **problem details đặc thù của API** (như tại sao server từ chối request và số dư tài khoản liên quan) có thể được mang trong response content để client hành động phù hợp (ví dụ, kích hoạt việc chuyển thêm tín dụng vào tài khoản)."

Đây là phát biểu rõ ràng nhất của nguyên tắc **hai tầng thông tin lỗi**, đúng cái đã nói ở A7:

- **Status code** → cho phần mềm chung: cache, proxy, client library, monitoring.
- **Problem details trong body** → cho ứng dụng cụ thể: *tại sao*, *số dư bao nhiêu*, *làm gì tiếp*.

📖 **Nguyên văn** — RFC 9457 §1, về phạm vi áp dụng

> "Problem details can be used with any HTTP status code, but they most naturally fit the semantics of 4xx and 5xx responses.  Note that problem details are (naturally) not the only way to convey the details of a problem in HTTP.  If the response is still a representation of a resource, for example, it's often preferable to describe the relevant details in that application's format.  Likewise, defined HTTP status codes cover many situations with no need to convey extra detail."

🇻🇳 **Dịch**

> "Problem details có thể được dùng với **bất kỳ HTTP status code nào**, nhưng chúng khớp tự nhiên nhất với semantics của các response 4xx và 5xx. Lưu ý rằng problem details (hiển nhiên) không phải cách duy nhất để truyền đạt chi tiết một vấn đề trong HTTP. Ví dụ, nếu response vẫn là một representation của một resource, thì thường nên mô tả các chi tiết liên quan theo định dạng của chính ứng dụng đó. Tương tự, các HTTP status code đã được định nghĩa bao phủ nhiều tình huống mà **không cần truyền thêm chi tiết nào**."

> [!note] RFC không bắt bạn dùng problem details cho mọi lỗi
> Đoạn §4 nói rõ: *"truly generic problems -- i.e., conditions that might apply to any resource on the Web -- are usually better expressed as plain status codes.  For example, a "write access disallowed" problem is probably unnecessary, since a 403 Forbidden status code in response to a PUT request is self-explanatory."*
> 🇻🇳 "những vấn đề thực sự tổng quát — tức là các tình huống có thể áp dụng cho bất kỳ resource nào trên Web — thường được diễn đạt tốt hơn bằng status code trơn. Ví dụ, một problem type kiểu 'không cho phép quyền ghi' có lẽ là không cần thiết, vì status code 403 Forbidden trả lời cho một request PUT đã tự nó giải thích rồi."

💡 **Ví dụ đời sống — vì sao cần chuẩn hoá thông báo lỗi**
Hình dung bạn đi khám ở mười bệnh viện khác nhau. Mỗi nơi trả kết quả xét nghiệm theo một mẫu giấy riêng: nơi ghi "chỉ số đường huyết", nơi ghi "glucose", nơi ghi mã số `GL-01`; nơi để đơn vị mmol/L, nơi mg/dL, nơi không ghi đơn vị. Bác sĩ (là con người, biết suy luận) vẫn đọc được, nhưng nếu bạn muốn viết **một phần mềm** tổng hợp hồ sơ sức khoẻ từ cả mười nơi thì phải viết mười bộ parser riêng, và nơi thứ mười một đổi mẫu là hỏng.

RFC 9457 là **mẫu phiếu kết quả thống nhất**: luôn có ô "loại vấn đề" (`type`), ô "tên ngắn gọn" (`title`), ô "mức độ theo thang chung" (`status`), ô "chi tiết ca này" (`detail`), ô "mã ca bệnh cụ thể" (`instance`). Bệnh viện nào cần thêm chỉ số riêng thì ghi thêm ô ở dưới (extension members), và phần mềm đã có sẵn quy tắc: **ô nào không hiểu thì bỏ qua, đừng vỡ**.

---

## B2. Media type `application/problem+json`

📖 **Nguyên văn** — RFC 9457 §3

> "The canonical model for problem details is a JSON [JSON] object.  When serialized in a JSON document, that format is identified with the "application/problem+json" media type."

🇻🇳 **Dịch**

> "Mô hình chuẩn tắc (canonical model) cho problem details là một object JSON. Khi được serialize thành một tài liệu JSON, định dạng đó được nhận diện bằng media type **`application/problem+json`**."

📖 **Nguyên văn** — RFC 9457 §1

> "The data model for problem details is a JSON [JSON] object; when serialized as a JSON document, it uses the "application/problem+json" media type.  Appendix B defines an equivalent XML format, which uses the "application/problem+xml" media type."

🇻🇳 **Dịch**

> "Mô hình dữ liệu cho problem details là một object JSON; khi được serialize thành tài liệu JSON, nó dùng media type `application/problem+json`. Phụ lục B định nghĩa một định dạng XML tương đương, dùng media type `application/problem+xml`."

Điểm tinh tế: server **được phép** trả `application/problem+json` ngay cả khi client không hề liệt kê nó trong `Accept`.

📖 **Nguyên văn** — RFC 9457 §3

> "Note also that the API has responded with the "application/problem+json" type, even though the client did not list it in Accept, as is allowed by HTTP (see Section 12.5.1 of [HTTP])."

🇻🇳 **Dịch**

> "Cũng lưu ý rằng API đã trả lời với type `application/problem+json` mặc dù client không liệt kê nó trong `Accept`, đúng như HTTP cho phép (xem Mục 12.5.1 của [HTTP])."

---

## B3. Năm trường chuẩn

📖 **Nguyên văn** — RFC 9457 §3.1, câu mở đầu

> "Problem detail objects can have the following members.  If a member's value type does not match the specified type, the member MUST be ignored -- i.e., processing will continue as if the member had not been present."

🇻🇳 **Dịch**

> "Các object problem detail có thể có những member sau. Nếu kiểu giá trị của một member không khớp với kiểu đã định, member đó **MUST** bị bỏ qua — tức là quá trình xử lý sẽ tiếp tục như thể member đó không hề tồn tại."

### `type`

📖 **Nguyên văn** — RFC 9457 §3.1.1

> "The "type" member is a JSON string containing a URI reference [URI] that identifies the problem type.  Consumers MUST use the "type" URI (after resolution, if necessary) as the problem type's primary identifier.
>
> When this member is not present, its value is assumed to be "about:blank".
>
> If the type URI is a locator (e.g., those with an "http" or "https" scheme), dereferencing it SHOULD provide human-readable documentation for the problem type (e.g., using HTML [HTML5]).  However, consumers SHOULD NOT automatically dereference the type URI, unless they do so when providing information to developers (e.g., when a debugging tool is in use)."

🇻🇳 **Dịch**

> "Member `type` là một chuỗi JSON chứa một URI reference **định danh loại vấn đề** (problem type). Bên tiêu thụ **MUST** dùng URI trong `type` (sau khi resolve, nếu cần) làm **định danh chính** của problem type.
>
> Khi member này không có mặt, giá trị của nó được coi là `about:blank`.
>
> Nếu type URI là một locator (ví dụ loại có scheme `http` hoặc `https`), việc dereference nó **SHOULD** cung cấp tài liệu con người đọc được cho problem type đó (ví dụ bằng HTML). Tuy nhiên, bên tiêu thụ **SHOULD NOT** tự động dereference type URI, trừ khi làm vậy để cung cấp thông tin cho lập trình viên (ví dụ khi đang dùng một công cụ debug)."

📖 **Nguyên văn** — RFC 9457 §3.1.1, khuyến nghị về URI tuyệt đối

> "As a result, it is RECOMMENDED that absolute URIs be used in "type" when possible and that when relative URIs are used, they include the full path (e.g., "/types/123")."

🇻🇳 **Dịch**

> "Do đó, **RECOMMENDED** rằng nên dùng URI tuyệt đối trong `type` khi có thể, và khi dùng URI tương đối thì chúng nên bao gồm đường dẫn đầy đủ (ví dụ `/types/123`)."

> [!tip] `type` không nhất thiết phải truy cập được
> §3.1.1: *"The type URI is allowed to be a non-resolvable URI."* — 🇻🇳 "type URI được phép là một URI không resolve được." Ví dụ RFC đưa ra là `tag:example@example.org,2021-09-17:OutOfLuck`. Nhưng RFC vẫn khuyến khích dùng URI resolve được, vì đổi sang URI resolve được về sau *"creating a new identity for the problem type and thus introducing a breaking change"* — 🇻🇳 "tạo ra một định danh mới cho problem type và do đó gây ra một breaking change".

### `status`

📖 **Nguyên văn** — RFC 9457 §3.1.2

> "The "status" member is a JSON number indicating the HTTP status code ([HTTP], Section 15) generated by the origin server for this occurrence of the problem.
>
> The "status" member, if present, is only advisory; it conveys the HTTP status code used for the convenience of the consumer.  Generators MUST use the same status code in the actual HTTP response, to assure that generic HTTP software that does not understand this format still behaves correctly."

🇻🇳 **Dịch**

> "Member `status` là một **số** JSON chỉ ra HTTP status code (RFC 9110 Mục 15) do origin server sinh ra cho lần xảy ra vấn đề này.
>
> Member `status`, nếu có mặt, chỉ mang tính **tham khảo**; nó truyền đạt HTTP status code đã dùng để tiện cho bên tiêu thụ. Bên sinh ra response **MUST** dùng **cùng status code đó trong HTTP response thực tế**, để đảm bảo các phần mềm HTTP tổng quát không hiểu định dạng này vẫn hành xử đúng."

> [!warning] `status` trong body không thay thế status code thật
> RFC dùng chữ **MUST**: hai con số phải khớp. `"status": 404` trong body mà HTTP response là `200 OK` là vi phạm spec — và đó chính xác là cái phản mẫu đã mổ ở mục A7.

📖 **Nguyên văn** — RFC 9457 §3.1.2, vì sao vẫn nên có trường này

> "Consumers can use the status member to determine what the original status code used by the generator was when it has been changed (e.g., by an intermediary or cache) and when a message's content is persisted without HTTP information."

🇻🇳 **Dịch**

> "Bên tiêu thụ có thể dùng member `status` để xác định status code gốc mà bên sinh đã dùng, trong trường hợp nó **đã bị thay đổi** (ví dụ bởi một intermediary hoặc cache) và khi content của message được lưu lại mà **không kèm thông tin HTTP** (ví dụ ghi vào log)."

### `title`

📖 **Nguyên văn** — RFC 9457 §3.1.3

> "The "title" member is a JSON string containing a short, human-readable summary of the problem type.
>
> It SHOULD NOT change from occurrence to occurrence of the problem, except for localization (e.g., using proactive content negotiation; see [HTTP], Section 12.1).
>
> The "title" string is advisory and is included only for users who are unaware of and cannot discover the semantics of the type URI (e.g., during offline log analysis)."

🇻🇳 **Dịch**

> "Member `title` là một chuỗi JSON chứa một **tóm tắt ngắn, con người đọc được** về problem type.
>
> Nó **SHOULD NOT** thay đổi giữa các lần vấn đề xảy ra, trừ trường hợp bản địa hoá (ví dụ dùng proactive content negotiation).
>
> Chuỗi `title` mang tính tham khảo và chỉ được đưa vào cho những người không biết và không thể tra ra semantics của type URI (ví dụ khi phân tích log offline)."

Điểm mấu chốt: `title` gắn với **loại lỗi**, nên nó cố định. Chi tiết thay đổi theo từng lần thì để ở `detail`.

### `detail`

📖 **Nguyên văn** — RFC 9457 §3.1.4

> "The "detail" member is a JSON string containing a human-readable explanation specific to this occurrence of the problem.
>
> The "detail" string, if present, ought to focus on helping the client correct the problem, rather than giving debugging information.
>
> Consumers SHOULD NOT parse the "detail" member for information; extensions are more suitable and less error-prone ways to obtain such information."

🇻🇳 **Dịch**

> "Member `detail` là một chuỗi JSON chứa **lời giải thích con người đọc được, riêng cho lần xảy ra vấn đề này**.
>
> Chuỗi `detail`, nếu có, nên tập trung vào việc **giúp client sửa vấn đề**, thay vì đưa ra thông tin debug.
>
> Bên tiêu thụ **SHOULD NOT** parse member `detail` để lấy thông tin; các extension mới là cách phù hợp hơn và ít sai sót hơn để lấy thông tin như vậy."

> [!danger] "rather than giving debugging information" là một yêu cầu bảo mật
> Đừng nhét stack trace, câu SQL, tên bảng, đường dẫn file server vào `detail`. §4 của RFC nói thẳng: *"Problem details are not a debugging tool for the underlying implementation; rather, they are a way to expose greater detail about the HTTP interface itself."* — 🇻🇳 "Problem details không phải công cụ debug cho phần cài đặt bên dưới; đúng hơn, chúng là cách phơi bày chi tiết hơn về chính HTTP interface." Rò rỉ tên bảng qua thông báo lỗi là bước đầu của nhiều cuộc tấn công — xem thêm [[13 - SQL Injection và Parameterized Query]].

### `instance`

📖 **Nguyên văn** — RFC 9457 §3.1.5

> "The "instance" member is a JSON string containing a URI reference that identifies the specific occurrence of the problem.
>
> When the "instance" URI is dereferenceable, the problem details object can be fetched from it.  It might also return information about the problem occurrence in other formats through use of proactive content negotiation.
>
> When the "instance" URI is not dereferenceable, it serves as a unique identifier for the problem occurrence that may be of significance to the server but is opaque to the client."

🇻🇳 **Dịch**

> "Member `instance` là một chuỗi JSON chứa một URI reference **định danh lần xảy ra cụ thể** của vấn đề.
>
> Khi URI trong `instance` dereference được, object problem details có thể được fetch từ chính nó. Nó cũng có thể trả về thông tin về lần xảy ra vấn đề dưới các định dạng khác thông qua proactive content negotiation.
>
> Khi URI trong `instance` không dereference được, nó đóng vai trò **định danh duy nhất cho lần xảy ra vấn đề**, có thể có ý nghĩa với server nhưng **mờ đục (opaque) đối với client**."

Ở §1, RFC mô tả công dụng của `instance` bằng một câu rất dễ nhớ:

📖 **Nguyên văn** — RFC 9457 §1

> "Problem details can contain other information, such as a URI identifying the problem's specific occurrence (effectively giving an identifier to the concept "The time Joe didn't have enough credit last Thursday"), which can be useful for support or forensic purposes."

🇻🇳 **Dịch**

> "Problem details có thể chứa thông tin khác, ví dụ một URI định danh lần xảy ra cụ thể của vấn đề (thực chất là gán một định danh cho khái niệm **"cái lần mà Joe không đủ tín dụng hôm thứ Năm tuần trước"**), rất hữu ích cho mục đích hỗ trợ khách hàng hoặc điều tra."

### Tóm tắt năm trường

| Trường | Kiểu | Gắn với | Vai trò |
|---|---|---|---|
| `type` | string (URI reference) | **loại lỗi** | định danh chính. Vắng mặt ⇒ `about:blank` |
| `status` | number | lần xảy ra | HTTP status code, chỉ advisory, **MUST** khớp response thật |
| `title` | string | **loại lỗi** | tóm tắt ngắn, không đổi giữa các lần |
| `detail` | string | lần xảy ra | giải thích cho lần này, giúp client sửa — không phải để debug |
| `instance` | string (URI reference) | lần xảy ra | định danh lần xảy ra cụ thể, phục vụ support/forensic |

### `about:blank` — khi không cần loại lỗi riêng

📖 **Nguyên văn** — RFC 9457 §4.2.1

> "The "about:blank" URI [ABOUT], when used as a problem type, indicates that the problem has no additional semantics beyond that of the HTTP status code.
>
> When "about:blank" is used, the title SHOULD be the same as the recommended HTTP status phrase for that code (e.g., "Not Found" for 404, and so on), although it MAY be localized to suit client preferences (expressed with the Accept-Language request header)."

🇻🇳 **Dịch**

> "URI `about:blank`, khi được dùng làm problem type, chỉ ra rằng vấn đề **không có semantics bổ sung nào ngoài chính HTTP status code**.
>
> Khi dùng `about:blank`, `title` **SHOULD** giống với reason phrase khuyến nghị của status code đó (ví dụ "Not Found" cho 404, v.v.), dù nó **MAY** được bản địa hoá theo sở thích client (thể hiện qua request header `Accept-Language`)."

---

## B4. Extension members

📖 **Nguyên văn** — RFC 9457 §3.2

> "Problem type definitions MAY extend the problem details object with additional members that are specific to that problem type.
>
> For example, our out-of-credit problem above defines two such extensions -- "balance" and "accounts" to convey additional, problem-specific information.
>
> Clients consuming problem details MUST ignore any such extensions that they don't recognize; this allows problem types to evolve and include additional information in the future."

🇻🇳 **Dịch**

> "Các định nghĩa problem type **MAY** mở rộng object problem details bằng những member bổ sung đặc thù cho problem type đó.
>
> Ví dụ, problem "hết tín dụng" ở trên định nghĩa hai extension như vậy — `balance` và `accounts` — để truyền tải thông tin bổ sung đặc thù cho vấn đề.
>
> Client tiêu thụ problem details **MUST bỏ qua mọi extension mà chúng không nhận ra**; điều này cho phép các problem type tiến hoá và bổ sung thông tin trong tương lai."

Đây là điều khoản cứu bạn khỏi breaking change: thêm trường mới vào response lỗi **không** phá client cũ, vì spec đã bắt client phải bỏ qua cái nó không hiểu.

📖 **Nguyên văn** — RFC 9457 §4, quy tắc đặt tên extension

> "If such additional members are defined, their names SHOULD start with a letter (ALPHA, as per [ABNF], Appendix B.1) and SHOULD comprise characters from ALPHA, DIGIT ([ABNF], Appendix B.1), and "_" (so that it can be serialized in formats other than JSON), and they SHOULD be three characters or longer."

🇻🇳 **Dịch**

> "Nếu định nghĩa những member bổ sung như vậy, tên của chúng **SHOULD** bắt đầu bằng một chữ cái và **SHOULD** chỉ gồm các ký tự chữ cái, chữ số, và dấu `_` (để có thể serialize sang các định dạng khác ngoài JSON), và **SHOULD** dài từ ba ký tự trở lên."

📖 **Nguyên văn** — RFC 9457 §4, ba thứ bắt buộc khi định nghĩa problem type mới

> "New problem type definitions MUST document:
>
>    1.  a type URI (typically, with the "http" or "https" scheme)
>
>    2.  a title that appropriately describes it (think short)
>
>    3.  the HTTP status code for it to be used with"

🇻🇳 **Dịch**

> "Các định nghĩa problem type mới **MUST** ghi thành tài liệu:
>
> 1. một type URI (thường là với scheme `http` hoặc `https`)
> 2. một `title` mô tả nó thoả đáng (nghĩ theo hướng ngắn gọn)
> 3. HTTP status code mà nó sẽ được dùng cùng"

📖 **Nguyên văn** — RFC 9457 §3, khi có nhiều vấn đề cùng lúc

> "When an API encounters multiple problems that do not share the same type, it is RECOMMENDED that the most relevant or urgent problem be represented in the response.  While it is possible to create generic "batch" problem types that convey multiple, disparate types, they do not map well into HTTP semantics."

🇻🇳 **Dịch**

> "Khi một API gặp nhiều vấn đề không cùng một `type`, **RECOMMENDED** rằng vấn đề **liên quan nhất hoặc cấp bách nhất** được thể hiện trong response. Dù có thể tạo ra các problem type "batch" tổng quát để truyền tải nhiều type khác nhau, chúng **không ánh xạ tốt vào semantics của HTTP**."

---

## B5. Ví dụ nguyên văn từ RFC

Hai ví dụ dưới đây **copy nguyên văn** từ RFC 9457 §3, không sửa một ký tự.

### Ví dụ 1 — hết tín dụng (403 + hai extension)

📖 **Nguyên văn** — RFC 9457 §3

```http
   POST /purchase HTTP/1.1
   Host: store.example.com
   Content-Type: application/json
   Accept: application/json, application/problem+json

   {
     "item": 123456,
     "quantity": 2
   }

   HTTP/1.1 403 Forbidden
   Content-Type: application/problem+json
   Content-Language: en

   {
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "balance": 30,
    "accounts": ["/account/12345",
                 "/account/67890"]
   }
```

🇻🇳 Client POST đơn mua hàng; server trả **`403 Forbidden` ở dòng status thật** (không phải 200) kèm `Content-Type: application/problem+json`. Body có bốn trường chuẩn (`type`, `title`, `detail`, `instance`) cộng hai extension `balance` và `accounts`. Lưu ý client chỉ khai `Accept: application/json, application/problem+json`.

📖 **Nguyên văn** — RFC 9457 §3, lời giải thích chính RFC viết cho ví dụ trên

> "Here, the out-of-credit problem (identified by its type) indicates the reason for the 403 in "title", identifies the specific problem occurrence with "instance", gives occurrence-specific details in "detail", and adds two extensions: "balance" conveys the account's balance, and "accounts" lists links where the account can be topped up."

🇻🇳 **Dịch**

> "Ở đây, vấn đề hết tín dụng (được định danh bởi `type` của nó) cho biết lý do của mã 403 trong `title`, định danh lần xảy ra vấn đề cụ thể bằng `instance`, đưa ra chi tiết riêng của lần này trong `detail`, và thêm hai extension: `balance` truyền tải số dư tài khoản, còn `accounts` liệt kê các link nơi có thể nạp thêm tiền vào tài khoản."

### Ví dụ 2 — lỗi validation nhiều trường (422 + extension `errors`)

📖 **Nguyên văn** — RFC 9457 §3

```http
   POST /details HTTP/1.1
   Host: account.example.com
   Accept: application/json

   {
     "age": 42.3,
     "profile": {
       "color": "yellow"
     }
   }

   HTTP/1.1 422 Unprocessable Content
   Content-Type: application/problem+json
   Content-Language: en

   {
    "type": "https://example.net/validation-error",
    "title": "Your request is not valid.",
    "errors": [
                {
                  "detail": "must be a positive integer",
                  "pointer": "#/age"
                },
                {
                  "detail": "must be 'green', 'red' or 'blue'",
                  "pointer": "#/profile/color"
                }
             ]
   }
```

🇻🇳 Đây là mẫu chuẩn cho **lỗi validation nhiều trường** — và chú ý nó dùng đúng `422 Unprocessable Content` như đã phân tích ở mục A5 (JSON parse được, nhưng `age: 42.3` và `color: "yellow"` sai nghiệp vụ). Danh sách lỗi nằm trong extension `errors`, mỗi phần tử có `detail` mô tả và `pointer` trỏ tới vị trí lỗi trong request bằng JSON Pointer.

📖 **Nguyên văn** — RFC 9457 §3, giải thích cho ví dụ 2

> "The fictional problem type here defines the "errors" extension, an array that describes the details of each validation error.  Each member is an object containing "detail" to describe the issue and "pointer" to locate the problem within the request's content using a JSON Pointer [JSON-POINTER]."

🇻🇳 **Dịch**

> "Problem type hư cấu ở đây định nghĩa extension `errors`, một mảng mô tả chi tiết của từng lỗi validation. Mỗi phần tử là một object chứa `detail` để mô tả vấn đề và `pointer` để định vị vấn đề bên trong content của request bằng JSON Pointer."

> [!tip] `errors` không phải trường chuẩn
> RFC gọi nó là *"The fictional problem type here defines..."* — 🇻🇳 "problem type hư cấu ở đây định nghĩa..." Tức `errors` là **extension member** do problem type đó tự đặt ra, không nằm trong 5 trường chuẩn. Nhưng vì nó xuất hiện trong chính ví dụ của RFC nên nó đã thành quy ước thực tế rất phổ biến — dùng tên `errors` với cấu trúc này sẽ quen thuộc với người đọc API của bạn hơn là tự nghĩ tên khác.

---

## B6. Checklist áp dụng

> Phần này là ghi chú riêng tổng hợp từ các điều khoản đã trích ở trên, KHÔNG phải một đoạn trích của spec.

1. Chọn **status code đúng trước** — status code làm việc với cache/proxy/client library (RFC 9457 §1).
2. Đặt `Content-Type: application/problem+json` (§3).
3. `status` trong body **phải khớp** status code thật (§3.1.2, MUST).
4. `type` là URI, ưu tiên tuyệt đối, trỏ tới trang tài liệu giải thích cách sửa (§3.1.1 + §4).
5. `title` cố định theo loại lỗi; `detail` thay đổi theo từng lần (§3.1.3, §3.1.4).
6. `detail` giúp client sửa lỗi, **không** chứa stack trace / SQL / đường dẫn nội bộ (§3.1.4, §4).
7. Thông tin máy cần đọc thì để vào **extension member**, đừng bắt client parse `detail` (§3.1.4 SHOULD NOT).
8. Lỗi quá hiển nhiên (403 cho PUT không có quyền ghi) thì status code trơn là đủ, không cần dựng problem type (§4).
9. Nhiều lỗi khác `type` → chọn cái cấp bách nhất, đừng gộp batch (§3).

---

## Liên kết

- Bài trước: [[03 - JSON và JSON-API]]
- Bài kế: [[05 - SOAP]]
- [[01 - API là gì và nền tảng HTTP]] — request/response, method, header: nền cho toàn bộ bài này
- [[02 - What is HTTP]] — HTTP cơ bản đã học ở phần 01
- [[13 - SQL Injection và Parameterized Query]] — lý do `detail` không được chứa thông tin debug nội bộ

---

## Nguồn tham khảo

- RFC 9110 — HTTP Semantics (§15 Status Codes, §9.3.4 PUT) : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 9457 — Problem Details for HTTP APIs : https://www.rfc-editor.org/rfc/rfc9457.txt
- RFC 6585 — Additional HTTP Status Codes (§4 429 Too Many Requests) : https://www.rfc-editor.org/rfc/rfc6585.txt
- RFC 5789 — PATCH Method for HTTP (§2 The PATCH Method) : https://www.rfc-editor.org/rfc/rfc5789.txt
