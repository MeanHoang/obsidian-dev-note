# 13 — Token Authentication và Bearer Token

> **Nguồn chính:** RFC 6750 — *The OAuth 2.0 Authorization Framework: Bearer Token Usage* — https://www.rfc-editor.org/rfc/rfc6750.txt
> Bài này bám các mục 1.2 (Terminology), 2 (Authenticated Requests), 3 (WWW-Authenticate), 5 (Security Considerations) của RFC 6750; bổ sung RFC 9110 §11 cho khung authentication của HTTP, RFC 7009 cho token revocation, RFC 9449 cho khái niệm proof-of-possession.

---

## 1. Token-based authentication là gì

Ở [[12 - Cookie và Session based Authentication]], server giữ **session state**: client chỉ cầm một session ID, mọi dữ liệu thật nằm trong bộ nhớ/database của server. Token-based authentication đi hướng ngược lại — client cầm một **token**, và token đó tự nó đã mang (hoặc trỏ tới) thông tin authorization.

RFC 6750 mở đầu bằng việc định nghĩa access token dựa trên RFC 6749:

📖 **Nguyên văn** (RFC 6750, §1 Introduction)
> "OAuth enables clients to access protected resources by obtaining an access token, which is defined in "The OAuth 2.0 Authorization Framework" [RFC6749] as "a string representing an access authorization issued to the client", rather than using the resource owner's credentials directly."

🇻🇳 **Dịch**
> "OAuth cho phép client truy cập protected resource bằng cách lấy về một access token — được RFC 6749 định nghĩa là "một chuỗi đại diện cho một access authorization được cấp cho client" — thay vì dùng trực tiếp credentials của resource owner."

Điểm quan trọng: token là một **lớp trừu tượng** thay thế cho credentials.

📖 **Nguyên văn** (RFC 6750, §1.3 Overview)
> "The access token provides an abstraction, replacing different authorization constructs (e.g., username and password, assertion) for a single token understood by the resource server.  This abstraction enables issuing access tokens valid for a short time period, as well as removing the resource server's need to understand a wide range of authentication schemes."

🇻🇳 **Dịch**
> "Access token cung cấp một lớp trừu tượng, thay thế các cấu trúc authorization khác nhau (ví dụ username và password, assertion) bằng một token duy nhất mà resource server hiểu được. Lớp trừu tượng này cho phép cấp access token chỉ có hiệu lực trong khoảng thời gian ngắn, đồng thời gỡ bỏ nhu cầu resource server phải hiểu một loạt authentication scheme khác nhau."

So với [[11 - Basic Authentication]] — nơi client gửi lại username/password thật ở **mọi** request — token có hai cải thiện rõ: (1) credentials thật chỉ xuất hiện một lần lúc đổi lấy token, (2) token có thời hạn.

> [!note] Đừng nhầm với authorization
> RFC 6750 là một phần của OAuth 2.0 — một framework **authorization**. Bản thân việc "cầm token hợp lệ" mới chỉ trả lời câu "được phép làm gì", không đương nhiên trả lời "bạn là ai". Xem lại [[10 - Authentication vs Authorization]].

RFC 6750 cũng nói rõ nó không chỉ dùng được trong OAuth:

📖 **Nguyên văn** (RFC 6750, §1)
> "While designed for use with access tokens resulting from OAuth 2.0 authorization [RFC6749] flows to access OAuth protected resources, this specification actually defines a general HTTP authorization method that can be used with bearer tokens from any source to access any resources protected by those bearer tokens."

🇻🇳 **Dịch**
> "Mặc dù được thiết kế để dùng với access token sinh ra từ các OAuth 2.0 authorization flow nhằm truy cập OAuth protected resource, spec này thực ra định nghĩa một HTTP authorization method tổng quát, có thể dùng với bearer token từ bất kỳ nguồn nào để truy cập bất kỳ resource nào được bảo vệ bởi bearer token đó."

Nói cách khác: API tự viết của bạn, không dính dáng gì OAuth, vẫn có thể dùng đúng cơ chế `Authorization: Bearer` này.

---

## 2. "Bearer" nghĩa là gì — phần cốt lõi của cả bài

Đây là định nghĩa quan trọng nhất trong RFC 6750. Đọc kỹ từng chữ.

📖 **Nguyên văn** (RFC 6750, §1.2 Terminology)
> "Bearer Token
>    A security token with the property that any party in possession of the token (a "bearer") can use the token in any way that any other party in possession of it can.  Using a bearer token does not require a bearer to prove possession of cryptographic key material (proof-of-possession)."

🇻🇳 **Dịch**
> "Bearer Token
>    Một security token có tính chất: **bất kỳ bên nào đang giữ token** (một "bearer" — người cầm) **đều có thể dùng token theo đúng mọi cách mà bất kỳ bên nào khác đang giữ nó có thể dùng**. Việc sử dụng một bearer token **không đòi hỏi bearer phải chứng minh mình sở hữu cryptographic key material** (proof-of-possession)."

Phần Abstract của RFC nhắc lại ý này ngay dòng đầu tiên:

📖 **Nguyên văn** (RFC 6750, Abstract)
> "Any party in possession of a bearer token (a "bearer") can use it to get access to the associated resources (without demonstrating possession of a cryptographic key).  To prevent misuse, bearer tokens need to be protected from disclosure in storage and in transport."

🇻🇳 **Dịch**
> "Bất kỳ bên nào đang giữ bearer token (một "bearer") đều có thể dùng nó để truy cập các resource tương ứng (mà không cần chứng minh mình sở hữu một cryptographic key). Để ngăn lạm dụng, bearer token cần được bảo vệ khỏi bị lộ — cả khi lưu trữ lẫn khi truyền đi."

> [!danger] Hệ quả trực tiếp: token bị lộ = tài khoản bị chiếm
> RFC không nói "nếu kẻ tấn công còn biết password thì mới nguy hiểm". Nó nói **any party in possession**. Server không có cách nào phân biệt request đến từ client hợp lệ hay từ kẻ vừa copy được token, vì bearer token **không kèm bất cứ bằng chứng nào** về danh tính người gửi.
>
> Đó chính xác là lý do phần §5 của RFC 6750 dành gần như toàn bộ dung lượng cho việc **đừng để token lọt ra ngoài**, chứ không phải cho việc xác minh người gửi — vì với bearer token, việc xác minh người gửi là **bất khả thi theo thiết kế**.

💡 **Ví dụ đời sống**
Bearer token là **vé xem phim giấy**. Bạn mua vé, trên vé ghi "Phòng 3, ghế G7, suất 19h" — không ghi tên bạn, không ghi CMND. Bạn đánh rơi vé ở sảnh, ai nhặt được cũng vào xem được, và nhân viên soát vé **không làm gì sai** khi cho người đó vào: họ chỉ có nhiệm vụ kiểm tra tấm vé có thật và còn hạn hay không, không có cách nào kiểm tra người cầm vé có phải người mua vé.

Ngược lại, vé máy bay có ghi tên và phải xuất trình giấy tờ tuỳ thân khớp với tên trên vé — đó là **proof-of-possession** (mục 7 bên dưới), không phải bearer.

---

## 3. Ba cách gửi bearer token

📖 **Nguyên văn** (RFC 6750, §2 Authenticated Requests)
> "This section defines three methods of sending bearer access tokens in resource requests to resource servers.  Clients MUST NOT use more than one method to transmit the token in each request."

🇻🇳 **Dịch**
> "Mục này định nghĩa ba phương thức gửi bearer access token trong request tới resource server. Client **MUST NOT** dùng nhiều hơn một phương thức để truyền token trong mỗi request."

(Dùng hai cách cùng lúc sẽ bị trả `invalid_request` — xem mục 5.)

### 3.1. `Authorization` request header field — cách được khuyến nghị

📖 **Nguyên văn** (RFC 6750, §2.1)
> "When sending the access token in the "Authorization" request header field defined by HTTP/1.1 [RFC2617], the client uses the "Bearer" authentication scheme to transmit the access token.
>
>    For example:
>
>      GET /resource HTTP/1.1
>      Host: server.example.com
>      Authorization: Bearer mF_9.B5f-4.1JqM"

🇻🇳 **Dịch**
> "Khi gửi access token trong "Authorization" request header field do HTTP/1.1 định nghĩa, client dùng authentication scheme "Bearer" để truyền access token.
>
> Ví dụ: request `GET /resource`, header `Authorization` mang giá trị `Bearer` + một khoảng trắng + chính token."

Cú pháp của credentials được định nghĩa bằng ABNF:

📖 **Nguyên văn** (RFC 6750, §2.1)
> "     b64token    = 1*( ALPHA / DIGIT /
>                        "-" / "." / "_" / "~" / "+" / "/" ) *"="
>      credentials = "Bearer" 1*SP b64token"

🇻🇳 Khối ABNF: `credentials` = chuỗi literal `"Bearer"`, theo sau là **ít nhất một** khoảng trắng (`1*SP`), rồi tới `b64token` — một chuỗi gồm chữ cái, chữ số và các ký tự `- . _ ~ + /`, có thể kết thúc bằng một hoặc nhiều dấu `=` (đuôi padding kiểu base64).

📖 **Nguyên văn** (RFC 6750, §2.1)
> "Clients SHOULD make authenticated requests with a bearer token using the "Authorization" request header field with the "Bearer" HTTP authorization scheme.  Resource servers MUST support this method."

🇻🇳 **Dịch**
> "Client **SHOULD** thực hiện authenticated request bằng bearer token thông qua "Authorization" request header field với HTTP authorization scheme "Bearer". Resource server **MUST** hỗ trợ phương thức này."

> [!tip] Đây là mặc định
> Trong ba cách, đây là cách duy nhất được `SHOULD` cho client và `MUST` cho server. Hai cách còn lại đều chỉ là `MAY` cho server. Nếu không có lý do ép buộc, luôn dùng cách này.

### 3.2. Form-encoded body parameter

📖 **Nguyên văn** (RFC 6750, §2.2)
> "When sending the access token in the HTTP request entity-body, the client adds the access token to the request-body using the "access_token" parameter.  The client MUST NOT use this method unless all of the following conditions are met:
>
>    o  The HTTP request entity-header includes the "Content-Type" header field set to "application/x-www-form-urlencoded".
>
>    o  The entity-body follows the encoding requirements of the "application/x-www-form-urlencoded" content-type as defined by HTML 4.01 [W3C.REC-html401-19991224].
>
>    o  The HTTP request entity-body is single-part."

🇻🇳 **Dịch**
> "Khi gửi access token trong entity-body của HTTP request, client thêm access token vào request-body qua parameter tên "access_token". Client **MUST NOT** dùng phương thức này trừ khi thoả **tất cả** các điều kiện sau:
> - entity-header của request có `Content-Type` đặt là `application/x-www-form-urlencoded`;
> - entity-body tuân thủ quy tắc encoding của content-type `application/x-www-form-urlencoded` theo HTML 4.01;
> - entity-body của request là single-part (không phải multipart)."

📖 **Nguyên văn** (RFC 6750, §2.2, tiếp)
> "   o  The content to be encoded in the entity-body MUST consist entirely of ASCII [USASCII] characters.
>
>    o  The HTTP request method is one for which the request-body has defined semantics.  In particular, this means that the "GET" method MUST NOT be used."

🇻🇳 **Dịch**
> "- Nội dung được encode trong entity-body **MUST** hoàn toàn là ký tự ASCII.
> - HTTP request method phải là method mà request-body có ngữ nghĩa được định nghĩa. Cụ thể, điều này nghĩa là method `GET` **MUST NOT** được dùng."

📖 **Nguyên văn** (RFC 6750, §2.2, ví dụ)
> "     POST /resource HTTP/1.1
>      Host: server.example.com
>      Content-Type: application/x-www-form-urlencoded
>
>      access_token=mF_9.B5f-4.1JqM"

🇻🇳 Khối ví dụ: một request `POST` với `Content-Type` là form-urlencoded, token nằm trong body dưới dạng cặp `access_token=<giá trị>`.

📖 **Nguyên văn** (RFC 6750, §2.2)
> "The "application/x-www-form-urlencoded" method SHOULD NOT be used except in application contexts where participating browsers do not have access to the "Authorization" request header field.  Resource servers MAY support this method."

🇻🇳 **Dịch**
> "Phương thức `application/x-www-form-urlencoded` **SHOULD NOT** được dùng, trừ trong những ngữ cảnh ứng dụng mà browser tham gia không truy cập được "Authorization" request header field. Resource server **MAY** hỗ trợ phương thức này."

### 3.3. URI query parameter — cách KHÔNG nên dùng

📖 **Nguyên văn** (RFC 6750, §2.3)
> "When sending the access token in the HTTP request URI, the client adds the access token to the request URI query component as defined by "Uniform Resource Identifier (URI): Generic Syntax" [RFC3986], using the "access_token" parameter.
>
>    For example, the client makes the following HTTP request using transport-layer security:
>
>      GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
>      Host: server.example.com"

🇻🇳 **Dịch**
> "Khi gửi access token trong URI của HTTP request, client thêm access token vào thành phần query của request URI theo RFC 3986, dùng parameter `access_token`.
>
> Ví dụ (có dùng transport-layer security): `GET /resource?access_token=mF_9.B5f-4.1JqM`."

Và đây là đoạn khuyến cáo — trích **nguyên văn**, đọc đủ cả hai đoạn:

📖 **Nguyên văn** (RFC 6750, §2.3)
> "Because of the security weaknesses associated with the URI method (see Section 5), including the high likelihood that the URL containing the access token will be logged, it SHOULD NOT be used unless it is impossible to transport the access token in the "Authorization" request header field or the HTTP request entity-body.  Resource servers MAY support this method.
>
>    This method is included to document current use; its use is not recommended, due to its security deficiencies (see Section 5) and also because it uses a reserved query parameter name, which is counter to URI namespace best practices, per "Architecture of the World Wide Web, Volume One" [W3C.REC-webarch-20041215]."

🇻🇳 **Dịch**
> "Vì các điểm yếu bảo mật gắn với phương thức URI (xem Mục 5), **bao gồm khả năng rất cao là URL chứa access token sẽ bị ghi vào log**, phương thức này **SHOULD NOT** được dùng trừ khi **không thể** truyền access token trong "Authorization" request header field hoặc trong entity-body của request. Resource server **MAY** hỗ trợ phương thức này.
>
> Phương thức này được đưa vào spec chỉ để ghi nhận thực tế đang được dùng; **việc dùng nó không được khuyến nghị**, do các khiếm khuyết bảo mật (xem Mục 5) và cũng vì nó chiếm dụng một tên query parameter dành riêng — đi ngược lại best practice về URI namespace theo "Architecture of the World Wide Web, Volume One"."

Mục 5.3 nói thẳng hơn, và liệt kê đúng những nơi token sẽ bị rò:

📖 **Nguyên văn** (RFC 6750, §5.3 Summary of Recommendations)
> "Don't pass bearer tokens in page URLs:  Bearer tokens SHOULD NOT be passed in page URLs (for example, as query string parameters).  Instead, bearer tokens SHOULD be passed in HTTP message headers or message bodies for which confidentiality measures are taken.  Browsers, web servers, and other software may not adequately secure URLs in the browser history, web server logs, and other data structures.  If bearer tokens are passed in page URLs, attackers might be able to steal them from the history data, logs, or other unsecured locations."

🇻🇳 **Dịch**
> "**Đừng truyền bearer token trong URL của trang:** Bearer token **SHOULD NOT** được truyền trong URL của trang (ví dụ dưới dạng query string parameter). Thay vào đó, bearer token **SHOULD** được truyền trong HTTP message header hoặc message body — những nơi đã có biện pháp bảo mật tính bí mật. Browser, web server và các phần mềm khác **có thể không bảo vệ đầy đủ** các URL nằm trong **lịch sử trình duyệt, log của web server và các cấu trúc dữ liệu khác**. Nếu bearer token được truyền trong URL của trang, kẻ tấn công có thể đánh cắp chúng từ dữ liệu lịch sử, log, hoặc các vị trí không được bảo vệ khác."

> [!danger] Vì sao query parameter là lựa chọn tệ nhất
> Ba nơi token rò ra, đều **nằm ngoài tầm kiểm soát của bạn** dù đã bật HTTPS — vì HTTPS chỉ mã hoá đường truyền, không ngăn hai đầu ghi URL ra đĩa:
> 1. **Log** — access log của web server, load balancer, CDN, proxy đều ghi full URL theo mặc định. Token nằm nguyên văn trong file log, thường được giữ hàng tháng và có nhiều người đọc được hơn database.
> 2. **Lịch sử trình duyệt** — URL kèm token nằm lại trong history, được đồng bộ giữa các thiết bị, và hiện ra trong thanh gợi ý địa chỉ.
> 3. **Referer** — khi trang chứa URL đó dẫn sang site khác, URL gốc có thể bị gửi kèm trong header `Referer` sang bên thứ ba.
>
> Nếu đang dùng cách này, mặc định coi như token **đã bị lộ**: xoay (rotate) token và chuyển sang `Authorization` header.

📖 **Nguyên văn** (RFC 6750, §2.3)
> "Clients using the URI Query Parameter method SHOULD also send a Cache-Control header containing the "no-store" option.  Server success (2XX status) responses to these requests SHOULD contain a Cache-Control header with the "private" option."

🇻🇳 **Dịch**
> "Client dùng phương thức URI Query Parameter **SHOULD** gửi kèm header `Cache-Control` có option `no-store`. Response thành công (status 2XX) của server cho những request này **SHOULD** chứa header `Cache-Control` với option `private`."

---

## 4. Bearer nằm trong khung authentication của HTTP

Bearer không phải phát minh riêng của OAuth — nó là một **auth-scheme** cắm vào khung challenge–response chung của HTTP, khung mà [[11 - Basic Authentication]] cũng dùng.

📖 **Nguyên văn** (RFC 9110, §11.1 Authentication Scheme)
> "HTTP provides a general framework for access control and authentication, via an extensible set of challenge-response authentication schemes, which can be used by a server to challenge a client request and by a client to provide authentication information.  It uses a case-insensitive token to identify the authentication scheme:
>
>      auth-scheme    = token"

🇻🇳 **Dịch**
> "HTTP cung cấp một framework tổng quát cho access control và authentication, thông qua một tập **có thể mở rộng** các challenge-response authentication scheme; server dùng nó để thách thức (challenge) một request của client, còn client dùng nó để cung cấp thông tin authentication. Framework này dùng một token **không phân biệt hoa thường** để định danh authentication scheme."

📖 **Nguyên văn** (RFC 9110, §11.3 Challenge and Response)
> "A 401 (Unauthorized) response message is used by an origin server to challenge the authorization of a user agent, including a WWW-Authenticate header field containing at least one challenge applicable to the requested resource."

🇻🇳 **Dịch**
> "Response 401 (Unauthorized) được origin server dùng để thách thức authorization của một user agent, kèm theo một WWW-Authenticate header field chứa **ít nhất một** challenge áp dụng cho resource được yêu cầu."

📖 **Nguyên văn** (RFC 9110, §11.4 Credentials)
> "Both the Authorization field value and the Proxy-Authorization field value contain the client's credentials for the realm of the resource being requested, based upon a challenge received in a response (possibly at some point in the past).  [...] Transmission of credentials within header field values implies significant security considerations regarding the confidentiality of the underlying connection, as described in Section 17.16.1."

🇻🇳 **Dịch**
> "Cả giá trị field `Authorization` lẫn `Proxy-Authorization` đều chứa credentials của client cho realm của resource đang được yêu cầu, dựa trên một challenge nhận được trong một response (có thể từ trước đó khá lâu). [...] Việc truyền credentials bên trong giá trị header field kéo theo **những vấn đề bảo mật đáng kể về tính bí mật của connection bên dưới**."

> [!note] `b64token` và `token68`
> ABNF của `b64token` trong RFC 6750 §2.1 trùng khớp với `token68` mà RFC 9110 §11.2 định nghĩa cho toàn bộ khung authentication. Đây chính là chỗ Bearer "cắm" vào HTTP: cùng một lớp ký tự cho phép.
>
> Lưu ý: `b64token` chỉ **mô tả tập ký tự hợp lệ**, không có nghĩa token phải là base64 hay phải giải mã được ra cái gì. Token có thể chỉ là một chuỗi ngẫu nhiên vô nghĩa.

---

## 5. `WWW-Authenticate` với scheme Bearer và các error code

📖 **Nguyên văn** (RFC 6750, §3)
> "If the protected resource request does not include authentication credentials or does not contain an access token that enables access to the protected resource, the resource server MUST include the HTTP "WWW-Authenticate" response header field; it MAY include it in response to other conditions as well.  The "WWW-Authenticate" header field uses the framework defined by HTTP/1.1 [RFC2617].
>
>    All challenges defined by this specification MUST use the auth-scheme value "Bearer".  This scheme MUST be followed by one or more auth-param values."

🇻🇳 **Dịch**
> "Nếu request tới protected resource không kèm authentication credentials, hoặc không chứa access token cho phép truy cập protected resource đó, resource server **MUST** đưa vào HTTP "WWW-Authenticate" response header field; server **MAY** đưa nó vào cả những tình huống khác.
>
> Mọi challenge do spec này định nghĩa **MUST** dùng giá trị auth-scheme là "Bearer". Scheme này **MUST** được theo sau bởi một hoặc nhiều giá trị auth-param."

### 5.1. Ví dụ response — nguyên văn từ spec

📖 **Nguyên văn** (RFC 6750, §3)
> "For example, in response to a protected resource request without authentication:
>
>      HTTP/1.1 401 Unauthorized
>      WWW-Authenticate: Bearer realm="example""

🇻🇳 Khối ví dụ: request không kèm authentication → server trả `401 Unauthorized` kèm challenge tối giản chỉ có `realm`, **không** kèm error code (lý do ở mục 5.3 bên dưới).

📖 **Nguyên văn** (RFC 6750, §3)
> "And in response to a protected resource request with an authentication attempt using an expired access token:
>
>      HTTP/1.1 401 Unauthorized
>      WWW-Authenticate: Bearer realm="example",
>                        error="invalid_token",
>                        error_description="The access token expired""

🇻🇳 Khối ví dụ: request có gửi token nhưng token đã hết hạn → vẫn `401`, nhưng challenge có thêm `error="invalid_token"` và `error_description` mô tả cho developer đọc.

📖 **Nguyên văn** (RFC 6750, §3)
> "If the protected resource request included an access token and failed authentication, the resource server SHOULD include the "error" attribute to provide the client with the reason why the access request was declined.  [...] In addition, the resource server MAY include the "error_description" attribute to provide developers a human-readable explanation that is not meant to be displayed to end-users.  It also MAY include the "error_uri" attribute with an absolute URI identifying a human-readable web page explaining the error."

🇻🇳 **Dịch**
> "Nếu request tới protected resource **có kèm** access token nhưng authentication thất bại, resource server **SHOULD** đưa vào attribute `error` để cho client biết lý do request bị từ chối. [...] Ngoài ra, resource server **MAY** đưa vào attribute `error_description` để cung cấp cho developer một lời giải thích người đọc được — **không nhằm hiển thị cho end-user**. Server cũng **MAY** đưa vào attribute `error_uri` với một URI tuyệt đối trỏ tới trang web giải thích lỗi."

Về attribute `scope`:

📖 **Nguyên văn** (RFC 6750, §3)
> "The "scope" attribute is a space-delimited list of case-sensitive scope values indicating the required scope of the access token for accessing the requested resource. "scope" values are implementation defined; there is no centralized registry for them; allowed values are defined by the authorization server."

🇻🇳 **Dịch**
> "Attribute `scope` là một danh sách các giá trị scope **phân biệt hoa thường**, ngăn cách bằng khoảng trắng, cho biết scope mà access token cần có để truy cập resource được yêu cầu. Các giá trị `scope` do implementation tự định nghĩa; **không có registry tập trung** cho chúng; các giá trị hợp lệ do authorization server quy định."

### 5.2. Ba error code

📖 **Nguyên văn** (RFC 6750, §3.1 Error Codes)
> "When a request fails, the resource server responds using the appropriate HTTP status code (typically, 400, 401, 403, or 405) and includes one of the following error codes in the response:
>
>    invalid_request
>          The request is missing a required parameter, includes an unsupported parameter or parameter value, repeats the same parameter, uses more than one method for including an access token, or is otherwise malformed.  The resource server SHOULD respond with the HTTP 400 (Bad Request) status code."

🇻🇳 **Dịch**
> "Khi một request thất bại, resource server trả về HTTP status code phù hợp (thường là 400, 401, 403 hoặc 405) và kèm theo **một** trong các error code sau:
>
> **`invalid_request`** — Request thiếu một parameter bắt buộc, chứa parameter hoặc giá trị parameter không được hỗ trợ, lặp lại cùng một parameter, **dùng nhiều hơn một phương thức để đính kèm access token**, hoặc sai định dạng theo cách khác. Resource server **SHOULD** trả về status code HTTP 400 (Bad Request)."

📖 **Nguyên văn** (RFC 6750, §3.1)
> "   invalid_token
>          The access token provided is expired, revoked, malformed, or invalid for other reasons.  The resource SHOULD respond with the HTTP 401 (Unauthorized) status code.  The client MAY request a new access token and retry the protected resource request."

🇻🇳 **Dịch**
> "**`invalid_token`** — Access token được cung cấp đã **hết hạn, bị thu hồi (revoked), sai định dạng, hoặc không hợp lệ vì lý do khác**. Resource **SHOULD** trả về status code HTTP 401 (Unauthorized). Client **MAY** xin một access token mới rồi thử lại request tới protected resource."

📖 **Nguyên văn** (RFC 6750, §3.1)
> "   insufficient_scope
>          The request requires higher privileges than provided by the access token.  The resource server SHOULD respond with the HTTP 403 (Forbidden) status code and MAY include the "scope" attribute with the scope necessary to access the protected resource."

🇻🇳 **Dịch**
> "**`insufficient_scope`** — Request đòi hỏi quyền **cao hơn** mức mà access token cung cấp. Resource server **SHOULD** trả về status code HTTP 403 (Forbidden) và **MAY** kèm attribute `scope` chứa scope cần thiết để truy cập protected resource."

> [!tip] Đây chính là 401 vs 403 trong thực tế
> Ba error code này ánh xạ gọn ghẽ vào phân biệt đã học ở [[04 - HTTP Status Code và thiết kế lỗi]] và [[10 - Authentication vs Authorization]]:
> - `invalid_token` → **401** — "token của bạn hỏng/hết hạn, đi lấy token mới rồi quay lại". Đây là vấn đề **authentication**.
> - `insufficient_scope` → **403** — "token của bạn hoàn toàn hợp lệ, nhưng không đủ quyền cho việc này. Lấy token mới cũng vô ích nếu tài khoản không có quyền". Đây là vấn đề **authorization**.
> - `invalid_request` → **400** — request sai cú pháp, chưa bàn tới chuyện token đúng hay sai.

### 5.3. Khi request hoàn toàn không có credentials

📖 **Nguyên văn** (RFC 6750, §3.1)
> "If the request lacks any authentication information (e.g., the client was unaware that authentication is necessary or attempted using an unsupported authentication method), the resource server SHOULD NOT include an error code or other error information."

🇻🇳 **Dịch**
> "Nếu request **hoàn toàn không có** thông tin authentication (ví dụ client không biết là cần authentication, hoặc đã thử bằng một authentication method không được hỗ trợ), resource server **SHOULD NOT** đưa vào error code hay thông tin lỗi nào khác."

> [!note] Vì sao im lặng
> Chưa có token thì cũng chưa có gì để nói "sai" cả — challenge trống (`WWW-Authenticate: Bearer realm="example"`) đã đủ thông tin. Kèm thêm chi tiết lỗi ở tình huống này chỉ làm lộ thông tin về hệ thống mà không giúp ích cho client hợp lệ.

### 5.4. Token được cấp ra trông thế nào

📖 **Nguyên văn** (RFC 6750, §4 Example Access Token Response)
> "     HTTP/1.1 200 OK
>      Content-Type: application/json;charset=UTF-8
>      Cache-Control: no-store
>      Pragma: no-cache
>
>      {
>        "access_token":"mF_9.B5f-4.1JqM",
>        "token_type":"Bearer",
>        "expires_in":3600,
>        "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA"
>      }"

🇻🇳 Khối ví dụ: response cấp token là JSON, có `token_type` là `"Bearer"`, `expires_in` tính bằng giây (ở đây 3600 = 1 giờ), kèm `refresh_token` để xin access token mới khi cái cũ hết hạn. Hai header `Cache-Control: no-store` và `Pragma: no-cache` bắt buộc phải có để response chứa token không bị cache lại ở bất kỳ đâu.

---

## 6. Security Considerations của RFC 6750

Mục 5 của RFC 6750 chia làm ba phần: threat, mitigation, và bảng tóm tắt khuyến nghị.

### 6.1. Bốn mối đe doạ

📖 **Nguyên văn** (RFC 6750, §5.1 Security Threats)
> "Token manufacture/modification:  An attacker may generate a bogus token or modify the token contents (such as the authentication or attribute statements) of an existing token, causing the resource server to grant inappropriate access to the client.  For example, an attacker may modify the token to extend the validity period; a malicious client may modify the assertion to gain access to information that they should not be able to view.
>
>    Token disclosure:  Tokens may contain authentication and attribute statements that include sensitive information."

🇻🇳 **Dịch**
> "**Chế tạo/sửa đổi token:** Kẻ tấn công có thể sinh ra một token giả hoặc sửa nội dung token (chẳng hạn các authentication statement hay attribute statement) của một token có sẵn, khiến resource server cấp quyền truy cập không phù hợp cho client. Ví dụ, kẻ tấn công có thể sửa token để **kéo dài thời hạn hiệu lực**; một client độc hại có thể sửa assertion để xem được thông tin lẽ ra không được xem.
>
> **Lộ token:** Token có thể chứa các authentication statement và attribute statement mang thông tin nhạy cảm."

📖 **Nguyên văn** (RFC 6750, §5.1)
> "   Token redirect:  An attacker uses a token generated for consumption by one resource server to gain access to a different resource server that mistakenly believes the token to be for it.
>
>    Token replay:  An attacker attempts to use a token that has already been used with that resource server in the past."

🇻🇳 **Dịch**
> "**Chuyển hướng token (token redirect):** Kẻ tấn công dùng một token vốn được sinh ra cho **một** resource server để truy cập vào **một resource server khác** — server này nhầm tưởng token là dành cho mình.
>
> **Phát lại token (token replay):** Kẻ tấn công tìm cách dùng lại một token đã từng được dùng với resource server đó trước đây."

### 6.2. Bảo vệ token khi truyền — TLS là bắt buộc

📖 **Nguyên văn** (RFC 6750, §5.2 Threat Mitigation)
> "To protect against token disclosure, confidentiality protection MUST be applied using TLS [RFC5246] with a ciphersuite that provides confidentiality and integrity protection.  This requires that the communication interaction between the client and the authorization server, as well as the interaction between the client and the resource server, utilize confidentiality and integrity protection."

🇻🇳 **Dịch**
> "Để chống lộ token, **bắt buộc (MUST)** phải áp dụng bảo vệ tính bí mật bằng TLS với một ciphersuite cung cấp cả confidentiality lẫn integrity protection. Điều này đòi hỏi **cả** giao tiếp giữa client và authorization server, **lẫn** giao tiếp giữa client và resource server, đều phải có bảo vệ tính bí mật và toàn vẹn."

📖 **Nguyên văn** (RFC 6750, §5.2)
> "As a further defense against token disclosure, the client MUST validate the TLS certificate chain when making requests to protected resources, including checking the Certificate Revocation List (CRL) [RFC5280]."

🇻🇳 **Dịch**
> "Như một lớp phòng thủ nữa chống lộ token, client **MUST** xác thực TLS certificate chain khi gửi request tới protected resource, bao gồm cả việc kiểm tra Certificate Revocation List (CRL)."

> [!danger] Tắt kiểm tra certificate = đưa token cho kẻ tấn công
> Đây là lỗi cực phổ biến: bật cờ kiểu "bỏ qua lỗi SSL" để chạy cho nhanh lúc dev, rồi quên tắt khi lên production. RFC nói rõ hậu quả:
>
> 📖 **Nguyên văn** (RFC 6750, §5.2)
> > "Presenting the token to an unauthenticated and unauthorized resource server or failing to validate the certificate chain will allow adversaries to steal the token and gain unauthorized access to protected resources."
>
> 🇻🇳 **Dịch**
> > "Việc xuất trình token cho một resource server chưa được xác thực và không được uỷ quyền, hoặc việc không xác thực certificate chain, sẽ **cho phép kẻ địch đánh cắp token và giành quyền truy cập trái phép** vào protected resource."
>
> Và ở §5.3, khuyến nghị là tuyệt đối:
>
> 📖 **Nguyên văn** (RFC 6750, §5.3)
> > "Always use TLS (https):  Clients MUST always use TLS [RFC5246] (https) or equivalent transport security when making requests with bearer tokens.  Failing to do so exposes the token to numerous attacks that could give attackers unintended access."
>
> 🇻🇳 **Dịch**
> > "**Luôn dùng TLS (https):** Client **MUST** luôn dùng TLS (https) hoặc transport security tương đương khi gửi request kèm bearer token. Không làm vậy sẽ phơi token ra trước hàng loạt kiểu tấn công có thể cho kẻ tấn công quyền truy cập ngoài ý muốn."

### 6.3. Không lưu token ở nơi không an toàn

📖 **Nguyên văn** (RFC 6750, §5.2)
> "Cookies are typically transmitted in the clear.  Thus, any information contained in them is at risk of disclosure.  Therefore, bearer tokens MUST NOT be stored in cookies that can be sent in the clear.  See "HTTP State Management Mechanism" [RFC6265] for security considerations about cookies."

🇻🇳 **Dịch**
> "Cookie thường được truyền ở dạng không mã hoá. Do đó, mọi thông tin chứa trong cookie đều có nguy cơ bị lộ. Vì vậy, bearer token **MUST NOT** được lưu trong cookie có thể bị gửi đi ở dạng không mã hoá. Xem "HTTP State Management Mechanism" (RFC 6265) để biết các vấn đề bảo mật về cookie."

📖 **Nguyên văn** (RFC 6750, §5.3)
> "Don't store bearer tokens in cookies:  Implementations MUST NOT store bearer tokens within cookies that can be sent in the clear (which is the default transmission mode for cookies).  Implementations that do store bearer tokens in cookies MUST take precautions against cross-site request forgery."

🇻🇳 **Dịch**
> "**Đừng lưu bearer token trong cookie:** Implementation **MUST NOT** lưu bearer token bên trong cookie có thể bị gửi ở dạng không mã hoá (đây là **chế độ truyền mặc định** của cookie). Implementation nào có lưu bearer token trong cookie thì **MUST** áp dụng biện pháp phòng ngừa chống cross-site request forgery."

> [!warning] Liên hệ với bài cookie/session
> Vế thứ hai là điểm nối thẳng với [[12 - Cookie và Session based Authentication]]: một khi token nằm trong cookie, trình duyệt **tự động đính kèm nó** vào request — và đó chính là điều kiện để CSRF xảy ra. RFC không cấm tuyệt đối việc để token trong cookie, nhưng đặt kèm một `MUST` về phòng chống CSRF.

Còn một chỗ rò rỉ dễ bị bỏ sót trong kiến trúc có load balancer:

📖 **Nguyên văn** (RFC 6750, §5.2)
> "In some deployments, including those utilizing load balancers, the TLS connection to the resource server terminates prior to the actual server that provides the resource.  This could leave the token unprotected between the front-end server where the TLS connection terminates and the back-end server that provides the resource.  In such deployments, sufficient measures MUST be employed to ensure confidentiality of the token between the front-end and back-end servers; encryption of the token is one such possible measure."

🇻🇳 **Dịch**
> "Trong một số triển khai, bao gồm các triển khai dùng load balancer, TLS connection tới resource server **kết thúc trước** khi đến server thực sự cung cấp resource. Điều này có thể khiến token **không được bảo vệ** trên đoạn giữa front-end server (nơi TLS connection kết thúc) và back-end server cung cấp resource. Trong các triển khai như vậy, **MUST** áp dụng đủ biện pháp để đảm bảo tính bí mật của token giữa front-end và back-end server; mã hoá token là một biện pháp khả dĩ."

### 6.4. Thời hạn sống ngắn và giới hạn audience

📖 **Nguyên văn** (RFC 6750, §5.2)
> "To deal with token capture and replay, the following recommendations are made: First, the lifetime of the token MUST be limited; one means of achieving this is by putting a validity time field inside the protected part of the token.  Note that using short-lived (one hour or less) tokens reduces the impact of them being leaked."

🇻🇳 **Dịch**
> "Để xử lý việc token bị bắt và phát lại, có các khuyến nghị sau: Thứ nhất, **thời gian sống của token MUST bị giới hạn**; một cách đạt được điều này là đặt một field thời hạn hiệu lực vào phần được bảo vệ của token. Lưu ý rằng dùng token sống ngắn (**một giờ hoặc ít hơn**) làm giảm thiệt hại khi chúng bị rò rỉ."

📖 **Nguyên văn** (RFC 6750, §5.3)
> "Issue short-lived bearer tokens:  Token servers SHOULD issue short-lived (one hour or less) bearer tokens, particularly when issuing tokens to clients that run within a web browser or other environments where information leakage may occur.  Using short-lived bearer tokens can reduce the impact of them being leaked."

🇻🇳 **Dịch**
> "**Cấp bearer token sống ngắn:** Token server **SHOULD** cấp bearer token sống ngắn (một giờ hoặc ít hơn), **đặc biệt** khi cấp token cho client chạy bên trong web browser hoặc các môi trường khác nơi có thể xảy ra rò rỉ thông tin. Dùng bearer token sống ngắn có thể giảm thiệt hại khi chúng bị rò."

Với token redirect, phòng thủ là **audience restriction**:

📖 **Nguyên văn** (RFC 6750, §5.2)
> "To deal with token redirect, it is important for the authorization server to include the identity of the intended recipients (the audience), typically a single resource server (or a list of resource servers), in the token.  Restricting the use of the token to a specific scope is also RECOMMENDED."

🇻🇳 **Dịch**
> "Để xử lý token redirect, điều quan trọng là authorization server phải đưa **danh tính của bên nhận dự kiến (audience)** — thường là một resource server duy nhất (hoặc một danh sách resource server) — vào trong token. Việc giới hạn token trong một scope cụ thể cũng **được khuyến nghị (RECOMMENDED)**."

RFC 8725 (JWT Best Current Practices) mô tả chính xác kịch bản tấn công mà audience restriction ngăn chặn:

📖 **Nguyên văn** (RFC 8725, §2.7 Substitution Attacks)
> "There are attacks in which one recipient will be given a JWT that was intended for it and will attempt to use it at a different recipient for which that JWT was not intended.  For instance, if an OAuth 2.0 [RFC6749] access token is legitimately presented to an OAuth 2.0 protected resource for which it is intended, that protected resource might then present that same access token to a different protected resource for which the access token is not intended, in an attempt to gain access."

🇻🇳 **Dịch**
> "Có những kiểu tấn công trong đó một bên nhận được trao một JWT vốn dành cho chính nó, rồi lại tìm cách dùng JWT đó ở **một bên nhận khác** mà JWT không dành cho. Ví dụ, nếu một OAuth 2.0 access token được xuất trình hợp lệ tới protected resource mà nó dành cho, thì chính protected resource đó **có thể đem cùng access token ấy xuất trình sang một protected resource khác** mà token không dành cho, nhằm giành quyền truy cập."

📖 **Nguyên văn** (RFC 8725, §3.9 Use and Validate Audience)
> "If the same issuer can issue JWTs that are intended for use by more than one relying party or application, the JWT MUST contain an "aud" (audience) claim that can be used to determine whether the JWT is being used by an intended party or was substituted by an attacker at an unintended party.
>
>    In such cases, the relying party or application MUST validate the audience value, and if the audience value is not present or not associated with the recipient, it MUST reject the JWT."

🇻🇳 **Dịch**
> "Nếu cùng một issuer có thể cấp các JWT dành cho **nhiều hơn một** relying party hoặc ứng dụng, thì JWT **MUST** chứa claim `aud` (audience) — dùng để xác định JWT đang được dùng bởi đúng bên dự kiến hay đã bị kẻ tấn công tráo sang một bên không dự kiến.
>
> Trong những trường hợp như vậy, relying party hoặc ứng dụng **MUST** xác thực giá trị audience, và nếu giá trị audience **không có mặt** hoặc **không gắn với bên nhận**, nó **MUST từ chối** JWT."

> [!note] Chi tiết JWT ở bài sau
> RFC 8725 nói riêng về JWT — một **định dạng** token cụ thể. Ở đây ta chỉ mượn hai mục liên quan tới token nói chung (substitution attack và audience). Cấu trúc JWT, thuật toán ký, lỗ hổng `alg: none`… thuộc về [[14 - JWT]].

### 6.5. Bảo vệ tính toàn vẹn của token

📖 **Nguyên văn** (RFC 6750, §5.2)
> "A large range of threats can be mitigated by protecting the contents of the token by using a digital signature or a Message Authentication Code (MAC).  Alternatively, a bearer token can contain a reference to authorization information, rather than encoding the information directly.  Such references MUST be infeasible for an attacker to guess; using a reference may require an extra interaction between a server and the token issuer to resolve the reference to the authorization information."

🇻🇳 **Dịch**
> "Một dải lớn các mối đe doạ có thể được giảm thiểu bằng cách bảo vệ **nội dung** của token thông qua digital signature hoặc Message Authentication Code (MAC). Một cách khác: bearer token có thể chứa một **tham chiếu** tới thông tin authorization thay vì mã hoá thẳng thông tin đó vào token. Các tham chiếu như vậy **MUST** không thể đoán được đối với kẻ tấn công; dùng tham chiếu có thể đòi hỏi một lượt trao đổi thêm giữa server và bên cấp token để phân giải tham chiếu thành thông tin authorization."

> [!tip] Hai kiểu token — đây là gốc rễ của vấn đề revocation
> Đoạn trên định nghĩa hai kiểu token, và lựa chọn giữa chúng quyết định gần như mọi thứ còn lại:
> - **Self-contained token** — thông tin authorization nằm ngay trong token, được bảo vệ bằng chữ ký. Server verify bằng khoá, **không cần tra database** → cực nhanh, cực dễ scale.
> - **Reference token (handle)** — token chỉ là một chuỗi ngẫu nhiên trỏ tới bản ghi trên server. Mỗi request phải tra cứu → chậm hơn, nhưng server luôn nắm quyền kiểm soát.
>
> Giữ nguyên hai khái niệm này khi đọc mục 7 tiếp theo.

### 6.6. Nguyên tắc bao trùm

📖 **Nguyên văn** (RFC 6750, §5.3)
> "Safeguard bearer tokens:  Client implementations MUST ensure that bearer tokens are not leaked to unintended parties, as they will be able to use them to gain access to protected resources.  This is the primary security consideration when using bearer tokens and underlies all the more specific recommendations that follow."

🇻🇳 **Dịch**
> "**Giữ gìn bearer token:** Implementation phía client **MUST** đảm bảo bearer token không rò rỉ sang các bên không dự kiến, vì những bên đó sẽ có thể dùng token để truy cập protected resource. **Đây là vấn đề bảo mật hàng đầu khi dùng bearer token, và là nền tảng cho mọi khuyến nghị cụ thể hơn theo sau.**"

---

## 7. Token revocation — nhược điểm lớn nhất so với session

Với session, "đăng xuất" rất đơn giản: xoá bản ghi session trên server, session ID trong tay client lập tức thành vô nghĩa. Với bearer token **self-contained**, chuyện không dễ như vậy — vì resource server không hỏi ai cả trước khi chấp nhận token.

RFC 7009 định nghĩa một endpoint để thu hồi token:

📖 **Nguyên văn** (RFC 7009, §1 Introduction)
> "The OAuth 2.0 core specification [RFC6749] defines several ways for a client to obtain refresh and access tokens.  This specification supplements the core specification with a mechanism to revoke both types of tokens.  A token is a string representing an authorization grant issued by the resource owner to the client.  A revocation request will invalidate the actual token and, if applicable, other tokens based on the same authorization grant and the authorization grant itself."

🇻🇳 **Dịch**
> "Spec lõi OAuth 2.0 (RFC 6749) định nghĩa vài cách để client lấy refresh token và access token. Spec này bổ sung cho spec lõi một **cơ chế thu hồi cả hai loại token**. Token là một chuỗi đại diện cho một authorization grant mà resource owner cấp cho client. Một revocation request sẽ vô hiệu hoá chính token đó và, nếu áp dụng được, cả các token khác dựa trên cùng authorization grant lẫn bản thân authorization grant."

📖 **Nguyên văn** (RFC 7009, §1)
> "From an end-user's perspective, OAuth is often used to log into a certain site or application.  This revocation mechanism allows a client to invalidate its tokens if the end-user logs out, changes identity, or uninstalls the respective application.  [...] This behavior prevents a situation in which there is still a valid authorization grant for a particular client of which the end-user is not aware."

🇻🇳 **Dịch**
> "Dưới góc nhìn end-user, OAuth thường được dùng để đăng nhập vào một site hay ứng dụng. Cơ chế revocation này cho phép client vô hiệu hoá token của mình khi end-user **đăng xuất, đổi danh tính, hoặc gỡ cài đặt** ứng dụng tương ứng. [...] Hành vi này ngăn tình huống vẫn còn một authorization grant hợp lệ cho một client nào đó mà **end-user không hề hay biết**."

Và đây là đoạn quan trọng nhất — RFC 7009 giải thích **vì sao self-contained token khó thu hồi**:

📖 **Nguyên văn** (RFC 7009, §3 Implementation Note)
> "OAuth 2.0 allows deployment flexibility with respect to the style of access tokens.  The access tokens may be self-contained so that a resource server needs no further interaction with an authorization server issuing these tokens to perform an authorization decision of the client requesting access to a protected resource.  A system design may, however, instead use access tokens that are handles referring to authorization data stored at the authorization server.  This consequently requires a resource server to issue a request to the respective authorization server to retrieve the content of the access token every time a client presents an access token."

🇻🇳 **Dịch**
> "OAuth 2.0 cho phép linh hoạt về kiểu access token khi triển khai. Access token có thể là **self-contained**, khiến resource server **không cần trao đổi thêm** với authorization server đã cấp token để ra quyết định authorization cho client đang xin truy cập protected resource. Tuy nhiên, một thiết kế hệ thống có thể thay vào đó dùng access token là **handle** — tham chiếu tới dữ liệu authorization lưu ở authorization server. Điều này kéo theo việc resource server phải gửi request tới authorization server tương ứng để lấy nội dung của access token **mỗi lần** client xuất trình access token."

📖 **Nguyên văn** (RFC 7009, §3)
> "While these are not the only options, they illustrate the implications for revocation.  In the latter case, the authorization server is able to revoke an access token previously issued to a client when the resource server relays a received access token.  In the former case, some (currently non-standardized) backend interaction between the authorization server and the resource server may be used when immediate access token revocation is desired.  Another design alternative is to issue short-lived access tokens, which can be refreshed at any time using the corresponding refresh tokens.  This allows the authorization server to impose a limit on the time revoked when access tokens are in use."

🇻🇳 **Dịch**
> "Dù đây không phải là hai lựa chọn duy nhất, chúng minh hoạ rõ hệ quả đối với việc revocation. Ở trường hợp **sau** (handle/reference token), authorization server **có thể thu hồi** một access token đã cấp cho client, vì resource server chuyển tiếp access token nhận được về cho nó. Ở trường hợp **trước** (self-contained token), nếu muốn thu hồi access token **ngay lập tức** thì phải dùng đến một dạng trao đổi backend giữa authorization server và resource server — **hiện chưa được chuẩn hoá**. Một lựa chọn thiết kế khác là cấp access token **sống ngắn**, có thể làm mới bất cứ lúc nào bằng refresh token tương ứng. Cách này cho phép authorization server áp một giới hạn lên khoảng thời gian mà token đã bị thu hồi vẫn còn đang được sử dụng."

📖 **Nguyên văn** (RFC 7009, §3)
> "Which approach of token revocation is chosen will depend on the overall system design and on the application service provider's risk analysis.  The cost of revocation in terms of required state and communication overhead is ultimately the result of the desired security properties."

🇻🇳 **Dịch**
> "Chọn cách thu hồi token nào sẽ tuỳ thuộc vào thiết kế tổng thể của hệ thống và vào phân tích rủi ro của nhà cung cấp dịch vụ. **Chi phí của việc revocation — xét về lượng state phải giữ và overhead giao tiếp — rốt cuộc là hệ quả của các thuộc tính bảo mật mà ta muốn có.**"

> [!danger] Sự thật phũ phàng về "đăng xuất" với self-contained token
> Đọc kỹ đoạn trên: với self-contained token, **không có cách chuẩn hoá nào để thu hồi ngay lập tức**. Ba hệ quả thực tế:
>
> 1. Nút "Đăng xuất" của bạn, nếu chỉ xoá token ở phía client, **không hề vô hiệu hoá** token đó. Bản copy mà kẻ tấn công giữ vẫn chạy tốt tới khi hết hạn.
> 2. Đổi password cũng vậy — các token đã cấp trước đó không tự chết.
> 3. "Cửa sổ nguy hiểm" = thời gian còn lại tới lúc token hết hạn. Đây chính là lý do RFC 6750 §5.3 khăng khăng đòi token sống **một giờ hoặc ít hơn**: nó không sửa được vấn đề, nó chỉ **giới hạn thiệt hại**.
>
> Muốn thu hồi tức thì thật sự thì phải **đánh đổi**: dùng reference token, hoặc thêm một bước tra cứu (deny-list) ở mỗi request — tức là chấp nhận giữ state trở lại, đúng cái mà token-based auth định tránh. Câu cuối của RFC 7009 §3 nói chính xác điều đó.

Câu lưu ý này cũng đáng nhớ khi viết client:

📖 **Nguyên văn** (RFC 7009, §2.1)
> "Note: A client compliant with [RFC6749] must be prepared to handle unexpected token invalidation at any time.  Independent of the revocation mechanism specified in this document, resource owners may revoke authorization grants, or the authorization server may invalidate tokens in order to mitigate security threats."

🇻🇳 **Dịch**
> "Lưu ý: Một client tuân thủ RFC 6749 **phải sẵn sàng xử lý việc token bị vô hiệu hoá bất ngờ, vào bất cứ lúc nào**. Độc lập với cơ chế revocation được đặc tả trong tài liệu này, resource owner có thể thu hồi authorization grant, hoặc authorization server có thể vô hiệu hoá token để giảm thiểu các mối đe doạ bảo mật."

---

## 8. Proof-of-possession và DPoP — thứ đối lập với bearer

Định nghĩa bearer ở mục 2 có một mệnh đề phủ định: *"does not require a bearer to prove possession of cryptographic key material (proof-of-possession)"*. RFC 9449 định nghĩa đúng cái bị phủ định đó.

📖 **Nguyên văn** (RFC 9449, Abstract)
> "This document describes a mechanism for sender-constraining OAuth 2.0 tokens via a proof-of-possession mechanism on the application level.  This mechanism allows for the detection of replay attacks with access and refresh tokens."

🇻🇳 **Dịch**
> "Tài liệu này mô tả một cơ chế **ràng buộc token OAuth 2.0 vào bên gửi (sender-constraining)** thông qua một cơ chế proof-of-possession ở tầng ứng dụng. Cơ chế này cho phép **phát hiện các cuộc tấn công phát lại (replay attack)** với access token và refresh token."

📖 **Nguyên văn** (RFC 9449, §1 Introduction)
> "Demonstrating Proof of Possession (DPoP) is an application-level mechanism for sender-constraining OAuth [RFC6749] access and refresh tokens.  It enables a client to prove the possession of a public/private key pair by including a DPoP header in an HTTP request.  [...] Recipients of such tokens are then able to verify the binding of the token to the key pair that the client has demonstrated that it holds via the DPoP header, thereby providing some assurance that the client presenting the token also possesses the private key.  In other words, the legitimate presenter of the token is constrained to be the sender that holds and proves possession of the private part of the key pair."

🇻🇳 **Dịch**
> "DPoP (Demonstrating Proof of Possession) là một cơ chế ở tầng ứng dụng để ràng buộc access token và refresh token của OAuth vào bên gửi. Nó cho phép client **chứng minh mình sở hữu một cặp khoá public/private** bằng cách đính kèm một header `DPoP` vào HTTP request. [...] Bên nhận token khi đó có thể xác thực rằng token được ràng buộc vào đúng cặp khoá mà client đã chứng minh mình nắm giữ qua header `DPoP`, qua đó có được một mức đảm bảo rằng client xuất trình token **cũng đang sở hữu private key**. Nói cách khác, người xuất trình token hợp lệ **bị giới hạn** chỉ còn là bên gửi nắm giữ và chứng minh được quyền sở hữu phần private của cặp khoá."

📖 **Nguyên văn** (RFC 9449, §2 Objectives)
> "The primary aim of DPoP is to prevent unauthorized or illegitimate parties from using leaked or stolen access tokens, by binding a token to a public key upon issuance and requiring that the client proves possession of the corresponding private key when using the token.  This constrains the legitimate sender of the token to only the party with access to the private key and gives the server receiving the token added assurances that the sender is legitimately authorized to use it."

🇻🇳 **Dịch**
> "Mục tiêu chính của DPoP là **ngăn các bên không được phép hoặc bất hợp pháp sử dụng access token đã bị rò rỉ hoặc bị đánh cắp**, bằng cách ràng buộc token vào một public key ngay lúc cấp và yêu cầu client chứng minh mình sở hữu private key tương ứng khi dùng token. Điều này giới hạn bên gửi hợp lệ của token **chỉ còn là bên có quyền truy cập private key**, và cho server nhận token thêm mức đảm bảo rằng bên gửi thực sự được phép dùng nó."

Và đây là câu đặt DPoP đối lập trực tiếp với bearer:

📖 **Nguyên văn** (RFC 9449, §2)
> "Access tokens that are sender-constrained via DPoP thus stand in contrast to the typical bearer token, which can be used by any party in possession of such a token.  Although protections generally exist to prevent unintended disclosure of bearer tokens, unforeseen vectors for leakage have occurred due to vulnerabilities and implementation issues in other layers in the protocol or software stack [...] There have also been numerous published token theft attacks on OAuth implementations themselves ([GitHub.Tokens] is just one high-profile example).  DPoP provides a general defense in depth against the impact of unanticipated token leakage."

🇻🇳 **Dịch**
> "Access token được sender-constrained qua DPoP vì thế **đối lập với bearer token thông thường — loại có thể được dùng bởi bất kỳ bên nào đang giữ nó**. Mặc dù nhìn chung vẫn có các biện pháp bảo vệ nhằm ngăn bearer token bị lộ ngoài ý muốn, những hướng rò rỉ **không lường trước** vẫn đã xảy ra do lỗ hổng và vấn đề triển khai ở các tầng khác trong protocol hoặc software stack [...] Cũng đã có rất nhiều vụ tấn công đánh cắp token được công bố nhắm vào chính các implementation của OAuth (GitHub.Tokens chỉ là một ví dụ nổi bật). DPoP cung cấp một lớp **phòng thủ theo chiều sâu** trước tác động của việc token bị rò rỉ ngoài dự tính."

💡 **Ví dụ đời sống**
Quay lại ví dụ vé xem phim: bearer token là vé giấy không ghi tên. DPoP là **vé máy bay ghi tên hành khách** — nhặt được vé của người khác cũng vô dụng, vì ở cửa lên máy bay bạn phải xuất trình thêm giấy tờ tuỳ thân khớp với tên trên vé. Tấm vé (token) vẫn có thể bị copy, nhưng **giấy tờ tuỳ thân (private key) thì không đi kèm tấm vé** — nó ở lại trong túi bạn.

> [!note] Phạm vi bài này
> Ở đây chỉ nêu khái niệm để làm rõ nghĩa chữ "bearer" bằng cách đối chiếu với thứ đối lập. Chi tiết cấu trúc DPoP proof JWT, claim `htm`/`htu`/`jti`, `nonce`, cách bind access token… nằm ngoài phạm vi bài. RFC 9449 cũng lưu ý DPoP **không phải** cơ chế client authentication:
>
> 📖 **Nguyên văn** (RFC 9449, §1)
> > "DPoP can be used to sender-constrain access tokens regardless of the client authentication method employed, but DPoP itself is not used for client authentication."
>
> 🇻🇳 **Dịch**
> > "DPoP có thể dùng để sender-constrain access token bất kể client authentication method nào đang được dùng, nhưng **bản thân DPoP không được dùng để làm client authentication**."

---

## 9. Bảng so sánh: session-based vs bearer token

> Bảng này là tổng hợp của người viết dựa trên các đoạn đã trích ở trên, không phải trích nguyên văn từ một mục nào.

| Tiêu chí | Session-based ([[12 - Cookie và Session based Authentication]]) | Bearer token (RFC 6750) |
|---|---|---|
| **State lưu ở đâu** | Server giữ session store; client chỉ cầm session ID | Self-contained: state nằm trong chính token, server không cần lưu gì. Reference token: server vẫn phải lưu (RFC 7009 §3) |
| **Verify mỗi request** | Tra cứu session store | Self-contained: verify chữ ký bằng khoá, không tra DB. Reference: phải hỏi authorization server mỗi lần (RFC 7009 §3) |
| **Thu hồi (revocation)** | Xoá bản ghi session → có hiệu lực **tức thì** | Self-contained: **không có cách chuẩn hoá để thu hồi ngay**; phải dựa vào backend interaction chưa chuẩn hoá, hoặc chấp nhận chờ token hết hạn (RFC 7009 §3) |
| **Mở rộng theo chiều ngang** | Mọi instance phải cùng truy cập được session store → cần store chia sẻ, sticky session, hoặc replicate | Self-contained: bất kỳ instance nào có khoá verify đều xử lý được request, **không cần state chung** — đây là lợi thế chính |
| **Rủi ro khi bị đánh cắp** | Kẻ tấn công dùng được cho tới khi session bị xoá — nhưng ta **xoá được ngay khi phát hiện** | Kẻ tấn công dùng được **tới khi token hết hạn**, và ta thường **không có cách chặn lại**. Vì vậy RFC 6750 §5.3 đòi token sống ≤ 1 giờ để giới hạn thiệt hại |
| **Kênh truyền** | Cookie — trình duyệt tự đính kèm → dễ dính CSRF | `Authorization` header — không tự đính kèm → không dính CSRF **theo mặc định**; nhưng nếu lưu token vào cookie thì RFC 6750 §5.3 **MUST** phòng chống CSRF |
| **Phù hợp khi nào** | App web truyền thống, một domain, cần đăng xuất tức thì | API cho nhiều loại client (mobile, SPA, service-to-service), nhiều instance, cross-domain |

> [!warning] "Stateless nên tốt hơn" là kết luận sai
> Bảng trên không có cột nào thắng tuyệt đối. Bearer token đổi **khả năng thu hồi tức thì** lấy **khả năng scale không cần state chung**. Câu cuối RFC 7009 §3 đã nói thẳng: chi phí của revocation chính là hệ quả của thuộc tính bảo mật mà bạn muốn — muốn thu hồi được thì phải trả bằng state và giao tiếp.
>
> Lưu ý thêm: "stateless" ở đây là stateless của **server lưu session**, cùng tinh thần với constraint stateless của REST đã học ở [[02 - REST]] — mỗi request phải tự mang đủ thông tin để hiểu được.

---

## 10. Bearer trong OpenAPI Specification

[[08 - OpenAPI Specification]] có Security Scheme Object để mô tả cơ chế authentication của API. Bearer được mô tả bằng `type: http` với `scheme: bearer`, và trường `bearerFormat` để ghi chú định dạng token (ví dụ `JWT`) — đây là phần thuộc OpenAPI, không phải RFC 6750, nên quay lại bài 08 để lấy chi tiết chính xác.

Điểm đáng chú ý về mặt khái niệm: OpenAPI xếp `bearer` chung nhóm `http` với `basic`, đúng như RFC 9110 §11.1 mô tả — cả hai đều chỉ là **auth-scheme** cắm vào cùng một khung challenge–response của HTTP. Xem lại [[11 - Basic Authentication]] để đối chiếu hai scheme cạnh nhau.

---

## Liên kết

- Bài trước: [[12 - Cookie và Session based Authentication]]
- Bài kế: [[14 - JWT]]
- [[10 - Authentication vs Authorization]] — 401 vs 403; `invalid_token` là authentication, `insufficient_scope` là authorization
- [[11 - Basic Authentication]] — scheme cùng khung `Authorization`/`WWW-Authenticate`; khác ở chỗ Basic gửi lại credentials thật mỗi request
- [[12 - Cookie và Session based Authentication]] — đối trọng chính của bài này: state ở server, thu hồi tức thì, rủi ro CSRF
- [[14 - JWT]] — một **định dạng** self-contained token cụ thể; RFC 8725 dành riêng cho nó
- [[08 - OpenAPI Specification]] — Security Scheme Object: `type: http`, `scheme: bearer`, `bearerFormat`
- [[04 - HTTP Status Code và thiết kế lỗi]] — 400 / 401 / 403 dùng đúng chỗ cho ba error code của RFC 6750
- [[02 - REST]] — constraint stateless, nền tảng khái niệm cho self-contained token
- [[09 - So sánh API Styles và REST Security]] — bức tranh chung về bảo mật API
- [[01 - API là gì và nền tảng HTTP]] — header, request/response, nền tảng cho toàn bộ bài
- [[02 - What is HTTP]] — HTTP cơ bản

## Nguồn tham khảo

- RFC 6750 — *The OAuth 2.0 Authorization Framework: Bearer Token Usage* (Standards Track, tháng 10/2012) : https://www.rfc-editor.org/rfc/rfc6750.txt
- RFC 9110 — *HTTP Semantics*, §11 HTTP Authentication : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 8725 — *JSON Web Token Best Current Practices* (BCP 225) : https://www.rfc-editor.org/rfc/rfc8725.txt
- RFC 7009 — *OAuth 2.0 Token Revocation* (Standards Track, tháng 8/2013) : https://www.rfc-editor.org/rfc/rfc7009.txt
- RFC 9449 — *OAuth 2.0 Demonstrating Proof of Possession (DPoP)* (Standards Track, tháng 9/2023) : https://www.rfc-editor.org/rfc/rfc9449.txt
