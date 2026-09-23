# 02 — Message Parsing, Connection và Keep-alive

> **Nguồn chính:** RFC 9112 — *HTTP/1.1* (STD 99, June 2022) — https://www.rfc-editor.org/rfc/rfc9112.txt
> Bài này bám các mục §2.2 (Message Parsing), §6.3 (Message Body Length), §8 (Handling Incomplete Messages), §9 (Connection Management), §9.2 (Associating a Response to a Request), §9.3 (Persistence), §9.3.2 (Pipelining), §9.4 (Concurrency), §9.5 (Failures and Timeouts), §9.6 (Tear-down), §11.1 (Response Splitting) và §11.2 (Request Smuggling) của RFC 9112.

Bài [[01 - Web Server là gì]] định nghĩa server **là gì** theo RFC 9110. Bài này trả lời server **làm gì ở mức byte**: đọc message thế nào, biết body dài bao nhiêu, và giữ/đóng connection ra sao. Đây là phần spec mà cả 4 sản phẩm ở các bài sau (Nginx, Apache, Caddy, IIS) đều đang cài đặt.

Phần này cũng là chỗ trả nợ khái niệm **connection pooling / keep-alive** mà [[00 - Tổng hợp (Caching)]] đã hẹn "để dành cho `08 - Learn about Web Servers`".

---

## 1. Thủ tục parse một HTTP message (§2.2)

📖 **Nguyên văn** (RFC 9112 §2.2 "Message Parsing")
> "The normal procedure for parsing an HTTP message is to read the start-line into a structure, read each header field line into a hash table by field name until the empty line, and then use the parsed data to determine if a message body is expected.  If a message body has been indicated, then it is read as a stream until an amount of octets equal to the message body length is read or the connection is closed."

🇻🇳 **Dịch**
> "Thủ tục thông thường để parse một HTTP message là: đọc start-line vào một structure, đọc từng dòng header field vào một hash table theo tên field cho tới khi gặp **dòng trống**, rồi dùng dữ liệu đã parse để xác định xem có mong đợi một message body hay không. Nếu message body đã được chỉ báo, nó được đọc như một stream cho tới khi đọc đủ số octet bằng message body length, hoặc cho tới khi connection bị đóng."

> [!note] Ba bước, đúng theo thứ tự
> 1. start-line (`GET /x HTTP/1.1`)
> 2. header cho tới dòng trống
> 3. body — **chỉ khi** bước 2 nói là có body, và đọc đúng số byte đã khai
>
> Toàn bộ mục §6.3 ở dưới tồn tại chỉ để trả lời câu "đúng số byte là bao nhiêu". Sai bước này là sinh lỗ hổng, không phải sinh bug nhỏ.

### 1.1. Phải parse theo octet, không phải theo ký tự Unicode

📖 **Nguyên văn** (RFC 9112 §2.2)
> "A recipient MUST parse an HTTP message as a sequence of octets in an encoding that is a superset of US-ASCII [USASCII].  Parsing an HTTP message as a stream of Unicode characters, without regard for the specific encoding, creates security vulnerabilities due to the varying ways that string processing libraries handle invalid multibyte character sequences that contain the octet LF (%x0A).  String-based parsers can only be safely used within protocol elements after the element has been extracted from the message, such as within a header field line value after message parsing has delineated the individual field lines."

🇻🇳 **Dịch**
> "Bên nhận PHẢI parse một HTTP message như một **dãy octet** theo một encoding là superset của US-ASCII. Việc parse một HTTP message như một stream các ký tự Unicode, không quan tâm tới encoding cụ thể, **tạo ra lỗ hổng bảo mật** do các thư viện xử lý chuỗi xử lý khác nhau đối với những dãy ký tự multibyte không hợp lệ có chứa octet LF (`%x0A`). Các parser dựa trên chuỗi chỉ có thể dùng an toàn **bên trong** một protocol element sau khi element đó đã được tách ra khỏi message — chẳng hạn bên trong giá trị của một dòng header field, sau khi việc parse message đã phân định xong từng dòng field."

### 1.2. CRLF, bare CR và khoảng trắng lạ

📖 **Nguyên văn** (RFC 9112 §2.2)
> "Although the line terminator for the start-line and fields is the sequence CRLF, a recipient MAY recognize a single LF as a line terminator and ignore any preceding CR.
>
>    A sender MUST NOT generate a bare CR (a CR character not immediately followed by LF) within any protocol elements other than the content.  A recipient of such a bare CR MUST consider that element to be invalid or replace each bare CR with SP before processing the element or forwarding the message."

🇻🇳 **Dịch**
> "Mặc dù ký tự kết thúc dòng cho start-line và các field là dãy CRLF, bên nhận CÓ THỂ nhận diện một LF đơn lẻ làm ký tự kết thúc dòng và bỏ qua mọi CR đứng trước.
>
> Bên gửi KHÔNG ĐƯỢC sinh ra một **bare CR** (ký tự CR không đi liền ngay sau bởi LF) bên trong bất kỳ protocol element nào ngoại trừ phần content. Bên nhận khi gặp bare CR như vậy PHẢI coi element đó là không hợp lệ, hoặc thay mỗi bare CR bằng SP trước khi xử lý element hoặc chuyển tiếp message."

📖 **Nguyên văn** (RFC 9112 §2.2)
> "In the interest of robustness, a server that is expecting to receive and parse a request-line SHOULD ignore at least one empty line (CRLF) received prior to the request-line.
>
>    A sender MUST NOT send whitespace between the start-line and the first header field.
>
>    A recipient that receives whitespace between the start-line and the first header field MUST either reject the message as invalid or consume each whitespace-preceded line without further processing of it (i.e., ignore the entire line, along with any subsequent lines preceded by whitespace, until a properly formed header field is received or the header section is terminated).  Rejection or removal of invalid whitespace-preceded lines is necessary to prevent their misinterpretation by downstream recipients that might be vulnerable to request smuggling (Section 11.2) or response splitting (Section 11.1) attacks."

🇻🇳 **Dịch**
> "Vì mục tiêu bền bỉ (robustness), một server đang chờ nhận và parse một request-line NÊN bỏ qua ít nhất một dòng trống (CRLF) nhận được trước request-line.
>
> Bên gửi KHÔNG ĐƯỢC gửi khoảng trắng giữa start-line và header field đầu tiên.
>
> Bên nhận khi nhận được khoảng trắng giữa start-line và header field đầu tiên PHẢI hoặc **từ chối** message là không hợp lệ, hoặc **ăn** mỗi dòng bắt đầu bằng khoảng trắng mà không xử lý gì thêm (tức là bỏ qua cả dòng, cùng mọi dòng tiếp theo bắt đầu bằng khoảng trắng, cho tới khi nhận được một header field đúng dạng hoặc phần header kết thúc). Việc từ chối hoặc loại bỏ những dòng bắt đầu bằng khoảng trắng không hợp lệ là **cần thiết để ngăn** các bên nhận phía downstream hiểu sai chúng — những bên có thể đang có lỗ hổng với tấn công request smuggling (Mục 11.2) hoặc response splitting (Mục 11.1)."

📖 **Nguyên văn** (RFC 9112 §2.2)
> "When a server listening only for HTTP request messages, or processing what appears from the start-line to be an HTTP request message, receives a sequence of octets that does not match the HTTP-message grammar aside from the robustness exceptions listed above, the server SHOULD respond with a 400 (Bad Request) response and close the connection."

🇻🇳 **Dịch**
> "Khi một server chỉ lắng nghe các HTTP request message, hoặc đang xử lý thứ mà từ start-line trông giống một HTTP request message, nhận được một dãy octet không khớp với grammar của HTTP-message (ngoài các ngoại lệ vì robustness nêu trên), server NÊN trả về response 400 (Bad Request) **và đóng connection**."

> [!warning] Vì sao 400 phải kèm đóng connection
> Vì message đã sai khung (framing). Server không còn biết byte tiếp theo trên connection là "phần còn lại của message rác" hay "request mới". Giữ connection lại chính là mở đường cho request smuggling. Trả 400 rồi cắt là cách duy nhất an toàn.

💡 **Ví dụ đời sống — vì sao khung message quan trọng hơn nội dung**
Bạn nhận một chồng đơn hàng viết trên giấy, mỗi đơn bắt đầu bằng một dòng tiêu đề và kết thúc bằng một dòng trống, sau đó ghi "hàng kèm theo: 51 dòng".
- Nếu bạn đếm **đúng** 51 dòng → đơn tiếp theo bắt đầu đúng chỗ.
- Nếu ai đó viết "51 dòng" nhưng nhét vào 60 dòng, và trong 9 dòng dư có nội dung trông y như một đơn mới ("giao 100 két bia tới địa chỉ X") → bạn sẽ xử lý **một đơn mà không ai gửi**.
- Đó chính là request smuggling. Lỗ hổng không nằm ở nội dung từng đơn, mà nằm ở **chỗ bạn tin sai số đếm**.

---

## 2. Message body dài bao nhiêu — 8 quy tắc theo thứ tự ưu tiên (§6.3)

Đây là mục quan trọng nhất của cả RFC 9112 với người vận hành web server. Spec ghi rõ **in order of precedence** — xét từ trên xuống, khớp cái nào dùng cái đó.

📖 **Nguyên văn** (RFC 9112 §6.3 "Message Body Length")
> "The length of a message body is determined by one of the following (in order of precedence):
>
>    1.  Any response to a HEAD request and any response with a 1xx (Informational), 204 (No Content), or 304 (Not Modified) status code is always terminated by the first empty line after the header fields, regardless of the header fields present in the message, and thus cannot contain a message body or trailer section.
>
>    2.  Any 2xx (Successful) response to a CONNECT request implies that the connection will become a tunnel immediately after the empty line that concludes the header fields.  A client MUST ignore any Content-Length or Transfer-Encoding header fields received in such a message.
>
>    3.  If a message is received with both a Transfer-Encoding and a Content-Length header field, the Transfer-Encoding overrides the Content-Length.  Such a message might indicate an attempt to perform request smuggling (Section 11.2) or response splitting (Section 11.1) and ought to be handled as an error.  An intermediary that chooses to forward the message MUST first remove the received Content-Length field and process the Transfer-Encoding (as described below) prior to forwarding the message downstream."

🇻🇳 **Dịch**
> "Độ dài của một message body được xác định bởi **một** trong các quy tắc sau (theo thứ tự ưu tiên):
>
> 1. Mọi response cho một request HEAD, và mọi response có status code 1xx (Informational), 204 (No Content), hoặc 304 (Not Modified) **luôn** kết thúc ở dòng trống đầu tiên sau các header field, bất kể trong message có những header field nào, và do đó **không thể** chứa message body hay trailer section.
> 2. Mọi response 2xx (Successful) cho một request CONNECT hàm ý rằng connection sẽ trở thành một tunnel ngay sau dòng trống kết thúc phần header field. Client PHẢI bỏ qua mọi header field `Content-Length` hay `Transfer-Encoding` nhận được trong message như vậy.
> 3. Nếu một message được nhận với **cả** `Transfer-Encoding` **và** `Content-Length`, thì `Transfer-Encoding` ghi đè `Content-Length`. Một message như vậy **có thể là dấu hiệu của nỗ lực request smuggling hoặc response splitting, và nên được xử lý như một lỗi**. Một intermediary chọn chuyển tiếp message đó PHẢI **xoá** field `Content-Length` đã nhận và xử lý `Transfer-Encoding` trước khi chuyển tiếp message xuống downstream."

> [!warning] Quy tắc 3 chính là lớp CVE request smuggling kinh điển
> Lỗ hổng cổ điển (CL.TE / TE.CL) sinh ra khi **reverse proxy và backend không đồng thuận** về quy tắc này: một bên tin `Content-Length`, bên kia tin `Transfer-Encoding`. Spec ra hai chỉ thị cứng để chặn: *"ought to be handled as an error"* và *"MUST first remove the received Content-Length"*. Đây là lý do rất cụ thể để **luôn cập nhật phiên bản web server/proxy** thay vì để chạy bản cũ nhiều năm.

📖 **Nguyên văn** (RFC 9112 §6.3, quy tắc 4)
> "4.  If a Transfer-Encoding header field is present and the chunked transfer coding (Section 7.1) is the final encoding, the message body length is determined by reading and decoding the chunked data until the transfer coding indicates the data is complete.
>
>       If a Transfer-Encoding header field is present in a response and the chunked transfer coding is not the final encoding, the message body length is determined by reading the connection until it is closed by the server.
>
>       If a Transfer-Encoding header field is present in a request and the chunked transfer coding is not the final encoding, the message body length cannot be determined reliably; the server MUST respond with the 400 (Bad Request) status code and then close the connection."

🇻🇳 **Dịch**
> "4. Nếu có header field `Transfer-Encoding` và chunked transfer coding là encoding **cuối cùng**, message body length được xác định bằng cách đọc và decode dữ liệu chunked cho tới khi transfer coding báo rằng dữ liệu đã hoàn tất.
>
> Nếu `Transfer-Encoding` có mặt trong một **response** mà chunked không phải encoding cuối cùng, message body length được xác định bằng cách đọc connection cho tới khi server đóng nó.
>
> Nếu `Transfer-Encoding` có mặt trong một **request** mà chunked không phải encoding cuối cùng, message body length **không thể xác định một cách đáng tin**; server PHẢI trả về status code 400 (Bad Request) rồi đóng connection."

📖 **Nguyên văn** (RFC 9112 §6.3, quy tắc 5)
> "5.  If a message is received without Transfer-Encoding and with an invalid Content-Length header field, then the message framing is invalid and the recipient MUST treat it as an unrecoverable error, unless the field value can be successfully parsed as a comma-separated list (Section 5.6.1 of [HTTP]), all values in the list are valid, and all values in the list are the same (in which case, the message is processed with that single value used as the Content-Length field value).  If the unrecoverable error is in a request message, the server MUST respond with a 400 (Bad Request) status code and then close the connection.  If it is in a response message received by a proxy, the proxy MUST close the connection to the server, discard the received response, and send a 502 (Bad Gateway) response to the client.  If it is in a response message received by a user agent, the user agent MUST close the connection to the server and discard the received response."

🇻🇳 **Dịch**
> "5. Nếu một message được nhận **không** có `Transfer-Encoding` và có header field `Content-Length` **không hợp lệ**, thì framing của message là không hợp lệ và bên nhận PHẢI coi đó là lỗi **không thể khắc phục** — trừ khi giá trị field parse được thành một danh sách phân tách bằng dấu phẩy, mọi giá trị trong danh sách đều hợp lệ, và mọi giá trị trong danh sách đều **giống nhau** (khi đó message được xử lý với giá trị duy nhất ấy làm `Content-Length`). Nếu lỗi không thể khắc phục đó nằm ở một request message, server PHẢI trả status code 400 (Bad Request) rồi đóng connection. Nếu nó nằm ở một response message mà **proxy** nhận được, proxy PHẢI đóng connection tới server, **loại bỏ** response đã nhận, và gửi response **502 (Bad Gateway)** cho client. Nếu nó nằm ở một response message mà user agent nhận được, user agent PHẢI đóng connection tới server và loại bỏ response."

> [!tip] Đây là một nguồn gốc rất thật của lỗi 502
> `502 Bad Gateway` không phải lúc nào cũng nghĩa "backend chết". Theo đúng quy tắc 5, proxy **PHẢI** trả 502 khi backend gửi về một response có `Content-Length` sai khung. Tức là backend vẫn sống, vẫn trả lời, nhưng trả lời sai chuẩn → proxy buộc phải biến nó thành 502. Khi debug 502, kiểm tra framing của response backend là một hướng đáng nhớ.

📖 **Nguyên văn** (RFC 9112 §6.3, quy tắc 6-8)
> "6.  If a valid Content-Length header field is present without Transfer-Encoding, its decimal value defines the expected message body length in octets.  If the sender closes the connection or the recipient times out before the indicated number of octets are received, the recipient MUST consider the message to be incomplete and close the connection.
>
>    7.  If this is a request message and none of the above are true, then the message body length is zero (no message body is present).
>
>    8.  Otherwise, this is a response message without a declared message body length, so the message body length is determined by the number of octets received prior to the server closing the connection."

🇻🇳 **Dịch**
> "6. Nếu có một `Content-Length` hợp lệ mà không có `Transfer-Encoding`, giá trị thập phân của nó định nghĩa message body length mong đợi tính theo octet. Nếu bên gửi đóng connection hoặc bên nhận bị timeout trước khi nhận đủ số octet đã nêu, bên nhận PHẢI coi message là **không hoàn chỉnh** và đóng connection.
>
> 7. Nếu đây là một **request** message và không quy tắc nào ở trên đúng, thì message body length bằng **không** (không có message body).
>
> 8. Ngược lại, đây là một **response** message không khai báo message body length, nên message body length được xác định bằng số octet nhận được trước khi server đóng connection."

📖 **Nguyên văn** (RFC 9112 §6.3)
> "Since there is no way to distinguish a successfully completed, close-delimited response message from a partially received message interrupted by network failure, a server SHOULD generate encoding or length-delimited messages whenever possible.  The close-delimiting feature exists primarily for backwards compatibility with HTTP/1.0.
>
>       |  *Note:* Request messages are never close-delimited because they
>       |  are always explicitly framed by length or transfer coding, with
>       |  the absence of both implying the request ends immediately after
>       |  the header section."

🇻🇳 **Dịch**
> "Vì không có cách nào phân biệt một response message **close-delimited** đã hoàn tất thành công với một message chỉ nhận được một phần do lỗi mạng, server NÊN sinh ra các message được phân định bằng encoding hoặc bằng độ dài bất cứ khi nào có thể. Tính năng close-delimiting tồn tại chủ yếu để tương thích ngược với HTTP/1.0.
>
> *Ghi chú:* Request message **không bao giờ** close-delimited, vì chúng luôn được đóng khung tường minh bằng độ dài hoặc transfer coding; việc thiếu cả hai hàm ý request kết thúc ngay sau phần header."

📖 **Nguyên văn** (RFC 9112 §6.3)
> "A server MAY reject a request that contains a message body but not a Content-Length by responding with 411 (Length Required)."

🇻🇳 **Dịch**
> "Một server CÓ THỂ từ chối một request chứa message body nhưng không có `Content-Length` bằng cách trả về 411 (Length Required)."

📖 **Nguyên văn** (RFC 9112 §6.3)
> "If the final response to the last request on a connection has been completely received and there remains additional data to read, a user agent MAY discard the remaining data or attempt to determine if that data belongs as part of the prior message body, which might be the case if the prior message's Content-Length value is incorrect.  A client MUST NOT process, cache, or forward such extra data as a separate response, since such behavior would be vulnerable to cache poisoning."

🇻🇳 **Dịch**
> "Nếu response cuối cùng cho request cuối cùng trên một connection đã được nhận đầy đủ mà vẫn còn dữ liệu chờ đọc, user agent CÓ THỂ loại bỏ dữ liệu còn lại hoặc thử xác định xem dữ liệu đó có thuộc phần body của message trước không — trường hợp này có thể xảy ra nếu `Content-Length` của message trước bị sai. Client KHÔNG ĐƯỢC xử lý, cache, hay chuyển tiếp dữ liệu dư đó như một response riêng biệt, vì hành vi như vậy sẽ **dễ bị cache poisoning**."

> [!note] Liên hệ với phần Caching
> Câu cuối nối trực tiếp sang [[02 - HTTP Caching]]: byte dư trên connection mà bị coi là "một response mới" thì có thể bị ghi vào shared cache và phục vụ cho người khác. Framing sai → cache poisoning, dù `Cache-Control` viết đúng hoàn hảo.

---

## 3. Message không hoàn chỉnh (§8)

📖 **Nguyên văn** (RFC 9112 §8 "Handling Incomplete Messages")
> "A server that receives an incomplete request message, usually due to a canceled request or a triggered timeout exception, MAY send an error response prior to closing the connection.
>
>    A client that receives an incomplete response message, which can occur when a connection is closed prematurely or when decoding a supposedly chunked transfer coding fails, MUST record the message as incomplete.  Cache requirements for incomplete responses are defined in Section 3.3 of [CACHING]."

🇻🇳 **Dịch**
> "Một server nhận được một request message không hoàn chỉnh — thường do request bị huỷ hoặc do một exception timeout được kích hoạt — CÓ THỂ gửi một error response trước khi đóng connection.
>
> Một client nhận được một response message không hoàn chỉnh — có thể xảy ra khi connection bị đóng sớm hoặc khi việc decode một transfer coding được cho là chunked thất bại — PHẢI **ghi nhận message đó là không hoàn chỉnh**. Các yêu cầu về cache cho response không hoàn chỉnh được định nghĩa ở Mục 3.3 của [CACHING]."

📖 **Nguyên văn** (RFC 9112 §8)
> "A message body that uses the chunked transfer coding is incomplete if the zero-sized chunk that terminates the encoding has not been received.  A message that uses a valid Content-Length is incomplete if the size of the message body received (in octets) is less than the value given by Content-Length.  A response that has neither chunked transfer coding nor Content-Length is terminated by closure of the connection and, if the header section was received intact, is considered complete unless an error was indicated by the underlying connection (e.g., an "incomplete close" in TLS would leave the response incomplete, as described in Section 9.8)."

🇻🇳 **Dịch**
> "Một message body dùng chunked transfer coding là **không hoàn chỉnh** nếu chunk kích thước 0 — cái kết thúc encoding — chưa được nhận. Một message dùng `Content-Length` hợp lệ là không hoàn chỉnh nếu kích thước message body nhận được (theo octet) **nhỏ hơn** giá trị `Content-Length`. Một response không có chunked transfer coding lẫn `Content-Length` thì kết thúc bằng việc đóng connection, và nếu phần header đã nhận nguyên vẹn thì được coi là **hoàn chỉnh** — trừ khi connection bên dưới báo lỗi (ví dụ một "incomplete close" trong TLS sẽ khiến response là không hoàn chỉnh)."

---

## 4. Connection Management (§9)

📖 **Nguyên văn** (RFC 9112 §9 "Connection Management")
> "HTTP messaging is independent of the underlying transport- or session-layer connection protocol(s).  HTTP only presumes a reliable transport with in-order delivery of requests and the corresponding in-order delivery of responses.  The mapping of HTTP request and response structures onto the data units of an underlying transport protocol is outside the scope of this specification."

🇻🇳 **Dịch**
> "Việc truyền message của HTTP **độc lập** với (các) protocol connection ở tầng transport hay session bên dưới. HTTP chỉ giả định một transport đáng tin cậy với việc giao request **theo đúng thứ tự** và giao response tương ứng cũng theo đúng thứ tự. Việc ánh xạ cấu trúc request/response HTTP lên các đơn vị dữ liệu của protocol transport bên dưới nằm ngoài phạm vi đặc tả này."

📖 **Nguyên văn** (RFC 9112 §9)
> "HTTP implementations are expected to engage in connection management, which includes maintaining the state of current connections, establishing a new connection or reusing an existing connection, processing messages received on a connection, detecting connection failures, and closing each connection.  Most clients maintain multiple connections in parallel, including more than one connection per server endpoint.  Most servers are designed to maintain thousands of concurrent connections, while controlling request queues to enable fair use and detect denial-of-service attacks."

🇻🇳 **Dịch**
> "Các cài đặt HTTP được kỳ vọng tham gia vào việc **quản lý connection**, bao gồm: giữ trạng thái của các connection hiện tại, thiết lập connection mới hoặc **tái sử dụng** connection có sẵn, xử lý các message nhận được trên một connection, phát hiện connection lỗi, và đóng từng connection. Phần lớn client duy trì nhiều connection song song, kể cả nhiều hơn một connection cho mỗi server endpoint. Phần lớn server được thiết kế để duy trì **hàng nghìn** connection đồng thời, đồng thời điều tiết các hàng đợi request để bảo đảm sử dụng công bằng và phát hiện tấn công từ chối dịch vụ."

> [!note] "connection pooling" nằm ở đây
> Cụm *"establishing a new connection or reusing an existing connection"* chính là connection pooling ở mức spec. Spec không dùng chữ "pool" — đó là thuật ngữ ngành. Phần spec chỉ nói: tái sử dụng connection là hành vi được kỳ vọng, và §9.3 dưới đây định nghĩa khi nào được tái sử dụng.

### 4.1. Ghép response với request: HTTP/1.1 chỉ có thứ tự (§9.2)

📖 **Nguyên văn** (RFC 9112 §9.2 "Associating a Response to a Request")
> "HTTP/1.1 does not include a request identifier for associating a given request message with its corresponding one or more response messages.  Hence, it relies on the order of response arrival to correspond exactly to the order in which requests are made on the same connection.  More than one response message per request only occurs when one or more informational responses (1xx; see Section 15.2 of [HTTP]) precede a final response to the same request."

🇻🇳 **Dịch**
> "HTTP/1.1 **không có** request identifier để ghép một request message với (các) response message tương ứng của nó. Do đó nó dựa vào **thứ tự** response đến, phải khớp chính xác với thứ tự các request được gửi trên cùng connection. Việc có nhiều hơn một response message cho một request chỉ xảy ra khi một hoặc nhiều informational response (1xx) đi trước response cuối cùng của cùng request đó."

📖 **Nguyên văn** (RFC 9112 §9.2)
> "If a client receives data on a connection that doesn't have outstanding requests, the client MUST NOT consider that data to be a valid response; the client SHOULD close the connection, since message delimitation is now ambiguous, unless the data consists only of one or more CRLF (which can be discarded per Section 2.2)."

🇻🇳 **Dịch**
> "Nếu client nhận được dữ liệu trên một connection **không có request nào đang chờ**, client KHÔNG ĐƯỢC coi dữ liệu đó là một response hợp lệ; client NÊN đóng connection, vì việc phân định message giờ đã nhập nhằng — trừ khi dữ liệu chỉ gồm một hay nhiều CRLF (có thể loại bỏ theo Mục 2.2)."

> [!tip] Đây là lý do HTTP/2 có stream ID
> HTTP/1.1 ghép request–response bằng **thứ tự**, nên một response lệch thứ tự là một thảm hoạ không cứu được (phải cắt connection). HTTP/2 thêm identifier cho từng stream nên nhiều request có thể trả lời không theo thứ tự trên cùng connection. Hiểu điểm yếu này của 1.1 là hiểu vì sao 2 ra đời.

### 4.2. Persistent connection — mặc định của HTTP/1.1 (§9.3)

📖 **Nguyên văn** (RFC 9112 §9.3 "Persistence")
> "HTTP/1.1 defaults to the use of "persistent connections", allowing multiple requests and responses to be carried over a single connection.  HTTP implementations SHOULD support persistent connections.
>
>    A recipient determines whether a connection is persistent or not based on the protocol version and Connection header field (Section 7.6.1 of [HTTP]) in the most recently received message, if any:
>
>    *  If the "close" connection option is present (Section 9.6), the connection will not persist after the current response; else,
>
>    *  If the received protocol is HTTP/1.1 (or later), the connection will persist after the current response; else,
>
>    *  If the received protocol is HTTP/1.0, the "keep-alive" connection option is present, either the recipient is not a proxy or the message is a response, and the recipient wishes to honor the HTTP/1.0 "keep-alive" mechanism, the connection will persist after the current response; otherwise,
>
>    *  The connection will close after the current response."

🇻🇳 **Dịch**
> "HTTP/1.1 **mặc định** dùng "persistent connection", cho phép nhiều request và response được chở trên một connection duy nhất. Các cài đặt HTTP NÊN hỗ trợ persistent connection.
>
> Bên nhận xác định một connection có persistent hay không dựa trên phiên bản protocol và header field `Connection` trong message nhận được gần nhất (nếu có), theo thứ tự:
>
> - Nếu có connection option `close` → connection **sẽ không** persist sau response hiện tại; nếu không thì
> - Nếu protocol nhận được là HTTP/1.1 (hoặc mới hơn) → connection **sẽ** persist sau response hiện tại; nếu không thì
> - Nếu protocol nhận được là HTTP/1.0, có connection option `keep-alive`, và (bên nhận không phải proxy **hoặc** message là một response), và bên nhận muốn tôn trọng cơ chế "keep-alive" của HTTP/1.0 → connection sẽ persist sau response hiện tại; ngược lại
> - Connection sẽ đóng sau response hiện tại."

> [!warning] `Connection: keep-alive` trong HTTP/1.1 là dư
> Đọc kỹ danh sách: với HTTP/1.1, persist là **mặc định** — không cần `keep-alive`. Header `keep-alive` chỉ có nghĩa với HTTP/1.0. Viết `Connection: keep-alive` trong app HTTP/1.1 không sai nhưng không thêm gì.

📖 **Nguyên văn** (RFC 9112 §9.3)
> "A client that does not support persistent connections MUST send the "close" connection option in every request message.
>
>    A server that does not support persistent connections MUST send the "close" connection option in every response message that does not have a 1xx (Informational) status code."

🇻🇳 **Dịch**
> "Client không hỗ trợ persistent connection PHẢI gửi connection option `close` trong **mọi** request message.
>
> Server không hỗ trợ persistent connection PHẢI gửi connection option `close` trong mọi response message không có status code 1xx."

📖 **Nguyên văn** (RFC 9112 §9.3)
> "In order to remain persistent, all messages on a connection need to have a self-defined message length (i.e., one not defined by closure of the connection), as described in Section 6.  A server MUST read the entire request message body or close the connection after sending its response; otherwise, the remaining data on a persistent connection would be misinterpreted as the next request.  Likewise, a client MUST read the entire response message body if it intends to reuse the same connection for a subsequent request."

🇻🇳 **Dịch**
> "Để vẫn persistent, mọi message trên một connection cần có **độ dài tự định nghĩa** (tức là không được xác định bằng việc đóng connection), như mô tả ở Mục 6. Một server PHẢI đọc **toàn bộ** request message body, hoặc đóng connection sau khi gửi response; nếu không, dữ liệu còn lại trên persistent connection **sẽ bị hiểu sai thành request tiếp theo**. Tương tự, một client PHẢI đọc toàn bộ response message body nếu nó định tái sử dụng cùng connection cho request tiếp theo."

> [!tip] Một lỗi thực tế rất dễ mắc
> Nếu handler của bạn trả lỗi sớm (ví dụ 413, 401) mà **không đọc hết body** rồi vẫn giữ connection, phần body chưa đọc sẽ bị parse như request kế tiếp. Spec đưa ra đúng hai lựa chọn hợp lệ: đọc hết body, **hoặc** đóng connection. Không có lựa chọn thứ ba.

📖 **Nguyên văn** (RFC 9112 §9.3)
> "A proxy server MUST NOT maintain a persistent connection with an HTTP/1.0 client (see Appendix C.2.2 for information and discussion of the problems with the Keep-Alive header field implemented by many HTTP/1.0 clients)."

🇻🇳 **Dịch**
> "Một proxy server KHÔNG ĐƯỢC duy trì persistent connection với một client HTTP/1.0."

### 4.3. Pipelining (§9.3.2)

📖 **Nguyên văn** (RFC 9112 §9.3.2 "Pipelining")
> "A client that supports persistent connections MAY "pipeline" its requests (i.e., send multiple requests without waiting for each response).  A server MAY process a sequence of pipelined requests in parallel if they all have safe methods (Section 9.2.1 of [HTTP]), but it MUST send the corresponding responses in the same order that the requests were received."

🇻🇳 **Dịch**
> "Một client hỗ trợ persistent connection CÓ THỂ "pipeline" các request của nó (tức là gửi nhiều request mà không chờ từng response). Một server CÓ THỂ xử lý một dãy pipelined request **song song** nếu tất cả đều dùng safe method, nhưng nó PHẢI gửi các response tương ứng **theo đúng thứ tự** các request đã được nhận."

📖 **Nguyên văn** (RFC 9112 §9.3.2)
> "Idempotent methods (Section 9.2.2 of [HTTP]) are significant to pipelining because they can be automatically retried after a connection failure.  A user agent SHOULD NOT pipeline requests after a non-idempotent method, until the final response status code for that method has been received, unless the user agent has a means to detect and recover from partial failure conditions involving the pipelined sequence."

🇻🇳 **Dịch**
> "Các method idempotent có ý nghĩa quan trọng với pipelining vì chúng có thể được **tự động thử lại** sau khi connection lỗi. Một user agent KHÔNG NÊN pipeline các request sau một method không idempotent, cho tới khi nhận được status code cuối cùng của method đó — trừ khi user agent có cách phát hiện và khắc phục các tình trạng lỗi một phần liên quan tới dãy pipeline ấy."

> [!note] Pipelining ≠ multiplexing
> Server **được phép xử lý song song** nhưng **phải trả về đúng thứ tự**. Nghĩa là một request chậm ở đầu dãy vẫn chặn các response sau nó — head-of-line blocking, đúng cái §9.4 nói ngay dưới đây. Đây là lý do pipelining gần như không được dùng trong thực tế, và cũng là điểm HTTP/2 giải quyết.

### 4.4. Concurrency: vì sao không nên mở nhiều connection (§9.4)

📖 **Nguyên văn** (RFC 9112 §9.4 "Concurrency")
> "A client ought to limit the number of simultaneous open connections that it maintains to a given server.
>
>    Previous revisions of HTTP gave a specific number of connections as a ceiling, but this was found to be impractical for many applications.  As a result, this specification does not mandate a particular maximum number of connections but, instead, encourages clients to be conservative when opening multiple connections."

🇻🇳 **Dịch**
> "Một client nên giới hạn số connection mở đồng thời mà nó duy trì tới một server cho trước.
>
> Các bản HTTP trước đưa ra một con số cụ thể làm mức trần, nhưng điều này bị thấy là không thực tế với nhiều ứng dụng. Do đó đặc tả này **không quy định** một số connection tối đa cụ thể, mà thay vào đó khuyến khích client **dè dặt** khi mở nhiều connection."

📖 **Nguyên văn** (RFC 9112 §9.4)
> "Multiple connections are typically used to avoid the "head-of-line blocking" problem, wherein a request that takes significant server-side processing and/or transfers very large content would block subsequent requests on the same connection.  However, each connection consumes server resources.
>
>    Furthermore, using multiple connections can cause undesirable side effects in congested networks.  Using larger numbers of connections can also cause side effects in otherwise uncongested networks, because their aggregate and initially synchronized sending behavior can cause congestion that would not have been present if fewer parallel connections had been used."

🇻🇳 **Dịch**
> "Nhiều connection thường được dùng để tránh vấn đề "head-of-line blocking" — khi một request cần server xử lý lâu và/hoặc truyền content rất lớn sẽ **chặn** các request tiếp theo trên cùng connection. Tuy nhiên, mỗi connection **tiêu tốn tài nguyên server**.
>
> Hơn nữa, dùng nhiều connection có thể gây tác dụng phụ không mong muốn trên các mạng đang tắc nghẽn. Dùng số lượng connection lớn cũng có thể gây tác dụng phụ ngay trên mạng **không** tắc nghẽn, vì hành vi gửi đồng loạt và đồng bộ ban đầu của chúng **có thể tự gây ra tắc nghẽn** — điều đã không xảy ra nếu dùng ít connection song song hơn."

📖 **Nguyên văn** (RFC 9112 §9.4)
> "Note that a server might reject traffic that it deems abusive or characteristic of a denial-of-service attack, such as an excessive number of open connections from a single client."

🇻🇳 **Dịch**
> "Lưu ý rằng một server có thể **từ chối** traffic mà nó cho là lạm dụng hoặc mang đặc trưng của tấn công từ chối dịch vụ, chẳng hạn số connection mở quá nhiều từ một client duy nhất."

### 4.5. Failures và timeout (§9.5)

📖 **Nguyên văn** (RFC 9112 §9.5 "Failures and Timeouts")
> "Servers will usually have some timeout value beyond which they will no longer maintain an inactive connection.  Proxy servers might make this a higher value since it is likely that the client will be making more connections through the same proxy server.  The use of persistent connections places no requirements on the length (or existence) of this timeout for either the client or the server."

🇻🇳 **Dịch**
> "Server thường có một giá trị timeout nào đó, vượt quá đó thì chúng không duy trì một connection không hoạt động nữa. Proxy server có thể đặt giá trị này **cao hơn**, vì khả năng cao là client sẽ mở thêm connection qua cùng proxy đó. Việc dùng persistent connection **không đặt ra yêu cầu nào** về độ dài (hay sự tồn tại) của timeout này, cho cả client lẫn server."

📖 **Nguyên văn** (RFC 9112 §9.5)
> "A client or server that wishes to time out SHOULD issue a graceful close on the connection.  Implementations SHOULD constantly monitor open connections for a received closure signal and respond to it as appropriate, since prompt closure of both sides of a connection enables allocated system resources to be reclaimed."

🇻🇳 **Dịch**
> "Client hay server muốn timeout thì NÊN thực hiện một **graceful close** trên connection. Các cài đặt NÊN liên tục theo dõi các connection đang mở để nhận tín hiệu đóng và phản ứng thích hợp, vì việc đóng kịp thời cả hai phía của connection cho phép **thu hồi** các tài nguyên hệ thống đã cấp."

📖 **Nguyên văn** (RFC 9112 §9.5)
> "A client, server, or proxy MAY close the transport connection at any time.  For example, a client might have started to send a new request at the same time that the server has decided to close the "idle" connection.  From the server's point of view, the connection is being closed while it was idle, but from the client's point of view, a request is in progress."

🇻🇳 **Dịch**
> "Client, server, hay proxy CÓ THỂ đóng transport connection **bất cứ lúc nào**. Ví dụ, client có thể vừa bắt đầu gửi một request mới đúng vào lúc server quyết định đóng connection "idle". Theo góc nhìn của server, connection đang bị đóng lúc rảnh rỗi; nhưng theo góc nhìn của client, **một request đang diễn ra**."

> [!warning] Đây là mô tả chính thống của lỗi "connection reset" ngẫu nhiên
> Cùng một thời điểm, hai bên nhìn khác nhau: server thấy connection idle nên đóng, client thấy mình vừa gửi request. Spec ghi nhận đây là tình huống **hợp lệ** của protocol, không phải bug. Hệ quả thực tế: idle timeout của client **nên nhỏ hơn** của server, và request idempotent nên được retry (§9.3.1 dẫn sang RFC 9110 §9.2.2).

📖 **Nguyên văn** (RFC 9112 §9.5)
> "A server SHOULD sustain persistent connections, when possible, and allow the underlying transport's flow-control mechanisms to resolve temporary overloads rather than terminate connections with the expectation that clients will retry.  The latter technique can exacerbate network congestion or server load."

🇻🇳 **Dịch**
> "Một server NÊN duy trì persistent connection khi có thể, và để cho các cơ chế flow-control của transport bên dưới tự giải quyết tình trạng quá tải tạm thời, **thay vì** đóng connection với kỳ vọng client sẽ thử lại. Kỹ thuật sau có thể **làm trầm trọng thêm** tắc nghẽn mạng hoặc tải của server."

### 4.6. Tear-down: `Connection: close` và bài toán TCP reset (§9.6)

📖 **Nguyên văn** (RFC 9112 §9.6 "Tear-down")
> "The "close" connection option is defined as a signal that the sender will close this connection after completion of the response.  A sender SHOULD send a Connection header field (Section 7.6.1 of [HTTP]) containing the "close" connection option when it intends to close a connection.  For example,
>
>    Connection: close
>
>    as a request header field indicates that this is the last request that the client will send on this connection, while in a response, the same field indicates that the server is going to close this connection after the response message is complete."

🇻🇳 **Dịch**
> "Connection option `close` được định nghĩa là **tín hiệu** rằng bên gửi sẽ đóng connection này sau khi hoàn tất response. Bên gửi NÊN gửi header field `Connection` chứa option `close` khi có ý định đóng connection. Ví dụ `Connection: close`: ở request header nghĩa là đây là request **cuối cùng** client sẽ gửi trên connection này; còn ở response, cùng field đó nghĩa là server sẽ đóng connection này sau khi response message hoàn tất."

📖 **Nguyên văn** (RFC 9112 §9.6)
> "A server that receives a "close" connection option MUST initiate closure of the connection (see below) after it sends the final response to the request that contained the "close" connection option.  The server SHOULD send a "close" connection option in its final response on that connection.  The server MUST NOT process any further requests received on that connection."

🇻🇳 **Dịch**
> "Một server nhận được connection option `close` PHẢI khởi động việc đóng connection sau khi nó gửi response cuối cùng cho request có chứa option `close` đó. Server NÊN gửi option `close` trong response cuối cùng của mình trên connection đó. Server **KHÔNG ĐƯỢC xử lý bất kỳ request nào nữa** nhận được trên connection ấy."

📖 **Nguyên văn** (RFC 9112 §9.6 — bài toán TCP reset)
> "If a server performs an immediate close of a TCP connection, there is a significant risk that the client will not be able to read the last HTTP response.  If the server receives additional data from the client on a fully closed connection, such as another request sent by the client before receiving the server's response, the server's TCP stack will send a reset packet to the client; unfortunately, the reset packet might erase the client's unacknowledged input buffers before they can be read and interpreted by the client's HTTP parser."

🇻🇳 **Dịch**
> "Nếu server thực hiện đóng **ngay lập tức** một TCP connection, có rủi ro đáng kể là client **sẽ không đọc được response HTTP cuối cùng**. Nếu server nhận thêm dữ liệu từ client trên một connection đã đóng hoàn toàn — chẳng hạn một request khác mà client gửi trước khi nhận được response của server — thì TCP stack của server sẽ gửi một **reset packet** cho client; và đáng tiếc là reset packet đó có thể **xoá sạch** các input buffer chưa được xác nhận của client trước khi HTTP parser của client kịp đọc và hiểu chúng."

📖 **Nguyên văn** (RFC 9112 §9.6 — cách đóng theo từng bước)
> "To avoid the TCP reset problem, servers typically close a connection in stages.  First, the server performs a half-close by closing only the write side of the read/write connection.  The server then continues to read from the connection until it receives a corresponding close by the client, or until the server is reasonably certain that its own TCP stack has received the client's acknowledgement of the packet(s) containing the server's last response.  Finally, the server fully closes the connection."

🇻🇳 **Dịch**
> "Để tránh bài toán TCP reset, server thường đóng connection **theo từng bước**. Đầu tiên, server thực hiện **half-close** bằng cách chỉ đóng phía ghi (write side) của connection đọc/ghi. Sau đó server tiếp tục **đọc** từ connection cho tới khi nhận được tín hiệu đóng tương ứng từ client, hoặc cho tới khi server khá chắc chắn rằng TCP stack của chính nó đã nhận được xác nhận của client cho (các) packet chứa response cuối cùng của server. Cuối cùng, server mới đóng hoàn toàn connection."

📖 **Nguyên văn** (RFC 9112 §9.6)
> "Note that a TCP connection that is half-closed by the client does not delimit a request message, nor does it imply that the client is no longer interested in a response.  In general, transport signals cannot be relied upon to signal edge cases, since HTTP/1.1 is independent of transport."

🇻🇳 **Dịch**
> "Lưu ý rằng một TCP connection bị client half-close **không** phân định một request message, và cũng **không** hàm ý rằng client không còn quan tâm tới response. Nói chung, không thể dựa vào các tín hiệu tầng transport để báo hiệu các tình huống biên, vì HTTP/1.1 độc lập với transport."

💡 **Ví dụ đời sống — vì sao phải đóng theo từng bước**
Bạn kết thúc cuộc gọi với khách.
- **Đóng ngay** = bạn nói xong câu cuối rồi **dập máy tức thì**. Nếu khách đang nói chen vào, họ chỉ nghe "tút tút" và **không chắc đã nghe hết câu của bạn**.
- **Half-close** = bạn nói "tôi hết phần trình bày rồi" (đóng phía nói của mình) nhưng **vẫn áp tai nghe**, chờ khách nói "vâng tôi nghe rõ rồi", rồi mới cúp.
- Cách hai chậm hơn vài giây nhưng bảo đảm câu cuối của bạn tới được tai người nghe. Web server chuẩn làm cách hai.

---

## 5. Hai lớp tấn công sinh ra từ parse sai (§11.1, §11.2)

📖 **Nguyên văn** (RFC 9112 §11.1 "Response Splitting")
> "Response splitting (a.k.a. CRLF injection) is a common technique, used in various attacks on Web usage, that exploits the line-based nature of HTTP message framing and the ordered association of requests to responses on persistent connections [Klein].  This technique can be particularly damaging when the requests pass through a shared cache."

🇻🇳 **Dịch**
> "Response splitting (còn gọi là CRLF injection) là một kỹ thuật phổ biến, dùng trong nhiều kiểu tấn công vào việc sử dụng Web, khai thác **bản chất theo dòng** của việc đóng khung message HTTP và việc ghép request–response **theo thứ tự** trên persistent connection. Kỹ thuật này đặc biệt gây thiệt hại khi các request đi qua một **shared cache**."

📖 **Nguyên văn** (RFC 9112 §11.1)
> "Response splitting exploits a vulnerability in servers (usually within an application server) where an attacker can send encoded data within some parameter of the request that is later decoded and echoed within any of the response header fields of the response.  If the decoded data is crafted to look like the response has ended and a subsequent response has begun, the response has been split, and the content within the apparent second response is controlled by the attacker.  The attacker can then make any other request on the same persistent connection and trick the recipients (including intermediaries) into believing that the second half of the split is an authoritative answer to the second request."

🇻🇳 **Dịch**
> "Response splitting khai thác một lỗ hổng ở server (thường là trong application server), nơi kẻ tấn công có thể gửi dữ liệu đã encode trong một parameter nào đó của request, mà sau đó dữ liệu ấy được decode và **echo lại vào một header field nào đó của response**. Nếu dữ liệu đã decode được dựng sao cho trông như response đã kết thúc và một response tiếp theo đã bắt đầu, thì response đã **bị chẻ đôi**, và nội dung trong phần "response thứ hai" giả kia do kẻ tấn công điều khiển. Kẻ tấn công sau đó có thể gửi một request khác trên cùng persistent connection và **lừa các bên nhận (kể cả intermediary) tin rằng nửa sau của phần bị chẻ là câu trả lời có thẩm quyền cho request thứ hai**."

📖 **Nguyên văn** (RFC 9112 §11.1)
> "A common defense against response splitting is to filter requests for data that looks like encoded CR and LF (e.g., "%0D" and "%0A").  However, that assumes the application server is only performing URI decoding rather than more obscure data transformations like charset transcoding, XML entity translation, base64 decoding, sprintf reformatting, etc.  A more effective mitigation is to prevent anything other than the server's core protocol libraries from sending a CR or LF within the header section, which means restricting the output of header fields to APIs that filter for bad octets and not allowing application servers to write directly to the protocol stream."

🇻🇳 **Dịch**
> "Một biện pháp phòng vệ thông dụng chống response splitting là **lọc** request để tìm dữ liệu trông giống CR và LF đã encode (ví dụ `%0D` và `%0A`). Tuy nhiên cách đó giả định application server chỉ thực hiện URI decoding, chứ không làm các phép biến đổi dữ liệu khó thấy hơn như transcoding charset, dịch XML entity, decode base64, định dạng lại bằng sprintf, v.v. Một biện pháp giảm thiểu **hiệu quả hơn** là ngăn mọi thứ ngoài các thư viện protocol lõi của server gửi CR hay LF vào trong phần header — nghĩa là chỉ cho phép xuất header field qua các API có lọc octet xấu, và **không cho application server ghi trực tiếp vào protocol stream**."

📖 **Nguyên văn** (RFC 9112 §11.2 "Request Smuggling")
> "Request smuggling ([Linhart]) is a technique that exploits differences in protocol parsing among various recipients to hide additional requests (which might otherwise be blocked or disabled by policy) within an apparently harmless request.  Like response splitting, request smuggling can lead to a variety of attacks on HTTP usage.
>
>    This specification has introduced new requirements on request parsing, particularly with regard to message framing in Section 6.3, to reduce the effectiveness of request smuggling."

🇻🇳 **Dịch**
> "Request smuggling là một kỹ thuật khai thác **sự khác biệt trong cách parse protocol giữa các bên nhận khác nhau** để giấu thêm request (những request mà nếu đi riêng có thể bị chặn hoặc bị chính sách vô hiệu hoá) **bên trong** một request trông vô hại. Giống response splitting, request smuggling có thể dẫn tới nhiều kiểu tấn công vào việc sử dụng HTTP.
>
> Đặc tả này đã đưa ra các yêu cầu mới về việc parse request — đặc biệt là về message framing ở Mục 6.3 — **để giảm hiệu quả của request smuggling**."

> [!warning] Điểm nối quan trọng nhất của cả bài
> Spec nói thẳng: request smuggling khai thác **sự khác biệt trong cách parse giữa các bên nhận**. Trong kiến trúc thật, các "bên nhận" đó chính là **reverse proxy** và **app server** của bạn. Nghĩa là: dù mỗi thành phần đều đúng chuẩn một cách riêng lẻ, cặp *proxy + backend* lệch nhau về framing vẫn tạo lỗ hổng. Đây là lý do rất cụ thể để giữ **cả hai** thành phần được cập nhật, chứ không chỉ một. Xem thêm [[13 - SQL Injection và Parameterized Query]] cho cùng một mô hình sai (dữ liệu bị hiểu thành cấu trúc).

---

## 6. Những chỗ spec KHÔNG nói

- **"Connection pooling"** không phải thuật ngữ của RFC 9112. Spec chỉ nói *"establishing a new connection or reusing an existing connection"* (§9). "Pool" là tên ngành đặt cho việc cài đặt cơ chế tái sử dụng đó.
- **Không có con số timeout khuyến nghị nào.** §9.5 ghi rõ: *"places no requirements on the length (or existence) of this timeout"*. Mọi con số `keepalive_timeout 65` hay tương tự là mặc định của **sản phẩm**, không phải của spec.
- **Không có giới hạn số connection.** §9.4 nói các bản HTTP trước từng đưa mức trần nhưng đã bỏ vì "impractical".
- **Không có con số "server chịu được bao nhiêu connection".** §9 chỉ nói *"most servers are designed to maintain thousands of concurrent connections"* — "hàng nghìn", không có benchmark.
- **Mô hình process/thread/event của web server** (prefork, worker, event loop) **không thuộc spec HTTP**. Đó là quyết định cài đặt của từng sản phẩm — xem [[03 - Nginx - Kiến trúc và xử lý request]] và [[05 - Apache HTTP Server]].

---

## Nguồn tham khảo
- RFC 9112 — HTTP/1.1: <https://www.rfc-editor.org/rfc/rfc9112.txt>
- RFC 9110 — HTTP Semantics: <https://www.rfc-editor.org/rfc/rfc9110.txt>
- RFC 9111 — HTTP Caching: <https://www.rfc-editor.org/rfc/rfc9111.txt>
