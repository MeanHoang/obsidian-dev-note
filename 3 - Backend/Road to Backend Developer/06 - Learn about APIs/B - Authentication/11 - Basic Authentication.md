# 11 — Basic Authentication

> **Nguồn chính:** RFC 7617 — *The 'Basic' HTTP Authentication Scheme* (IETF, Standards Track, 09/2015) — https://www.rfc-editor.org/rfc/rfc7617.txt
> **Nguồn phụ:** RFC 9110 §11 — *HTTP Semantics: HTTP Authentication* — https://www.rfc-editor.org/rfc/rfc9110.txt · RFC 7616 — *HTTP Digest Access Authentication* — https://www.rfc-editor.org/rfc/rfc7616.txt
> Bài này bám mục 2 (scheme Basic), 2.1 (`charset`), 2.2 (Reusing Credentials) và mục 4 (Security Considerations) của RFC 7617.

---

## 1. Basic authentication là gì

📖 **Nguyên văn** — RFC 7617, Abstract
> "This document defines the "Basic" Hypertext Transfer Protocol (HTTP) authentication scheme, which transmits credentials as user-id/password pairs, encoded using Base64."

🇻🇳 **Dịch**
> "Tài liệu này định nghĩa authentication scheme "Basic" của Hypertext Transfer Protocol (HTTP), scheme truyền credentials dưới dạng cặp user-id/password, được encode bằng Base64."

📖 **Nguyên văn** — RFC 7617, §1 Introduction
> "This scheme is not considered to be a secure method of user authentication unless used in conjunction with some external secure system such as TLS (Transport Layer Security, [RFC5246]), as the user-id and password are passed over the network as cleartext."

🇻🇳 **Dịch**
> "Scheme này không được xem là một phương pháp user authentication an toàn, trừ khi được dùng kèm với một hệ thống bảo mật bên ngoài như TLS (Transport Layer Security, [RFC5246]), bởi vì user-id và password được truyền qua mạng dưới dạng cleartext (văn bản thô)."

Ngay từ dòng thứ hai của phần Introduction, chính RFC đã tự gắn nhãn cảnh báo cho scheme mà nó định nghĩa. Đây là điểm quan trọng nhất của cả bài — xem mục 6.

📖 **Nguyên văn** — RFC 7617, §2 The 'Basic' Authentication Scheme
> "The Basic authentication scheme is based on the model that the client needs to authenticate itself with a user-id and a password for each protection space ("realm").  The realm value is a free-form string that can only be compared for equality with other realms on that server.  The server will service the request only if it can validate the user-id and password for the protection space applying to the requested resource."

🇻🇳 **Dịch**
> "Basic authentication scheme dựa trên mô hình: client cần tự xác thực bằng một user-id và một password cho mỗi protection space ("realm"). Giá trị realm là một chuỗi tự do, chỉ có thể đem so sánh bằng (equality) với các realm khác trên chính server đó. Server chỉ phục vụ request nếu nó xác minh được user-id và password cho protection space áp dụng cho resource được yêu cầu."

💡 **Ví dụ đời sống**
Basic auth giống việc vào một toà nhà mà bảo vệ yêu cầu **đưa CMND ra xem ở MỖI lần bước qua cửa**. Không có thẻ ra vào, không có dấu đóng lên tay — mỗi lần vào là một lần chìa nguyên tấm CMND. Và tấm CMND đó **không được bỏ trong phong bì niêm phong**: ai đứng cạnh cũng đọc được.

> [!note] Basic auth nằm trong một framework lớn hơn
> Basic chỉ là **một** scheme cắm vào HTTP Authentication Framework. Framework đó định nghĩa ở RFC 9110 §11, còn Basic/Digest là các scheme cụ thể được định nghĩa ở tài liệu riêng.

📖 **Nguyên văn** — RFC 9110, §11.1 Authentication Scheme
> "HTTP provides a general framework for access control and authentication, via an extensible set of challenge-response authentication schemes, which can be used by a server to challenge a client request and by a client to provide authentication information.  It uses a case-insensitive token to identify the authentication scheme:"

🇻🇳 **Dịch**
> "HTTP cung cấp một framework tổng quát cho access control và authentication, thông qua một tập các challenge-response authentication scheme có thể mở rộng, dùng để server thách thức (challenge) một request của client và để client cung cấp thông tin authentication. Nó dùng một token không phân biệt hoa thường để định danh authentication scheme:"

📖 **Nguyên văn** — RFC 9110, §11.1 (tiếp)
> "Aside from the general framework, this document does not specify any authentication schemes.  New and existing authentication schemes are specified independently and ought to be registered within the "Hypertext Transfer Protocol (HTTP) Authentication Scheme Registry".  For example, the "basic" and "digest" authentication schemes are defined by [RFC7617] and [RFC7616], respectively."

🇻🇳 **Dịch**
> "Ngoài framework tổng quát, tài liệu này không đặc tả bất kỳ authentication scheme nào. Các authentication scheme mới và hiện có được đặc tả độc lập và nên được đăng ký trong "Hypertext Transfer Protocol (HTTP) Authentication Scheme Registry". Ví dụ, các authentication scheme "basic" và "digest" lần lượt được định nghĩa bởi [RFC7617] và [RFC7616]."

---

## 2. Cách hoạt động — challenge rồi response

### 2.1. Bước 1 — server trả `401` kèm `WWW-Authenticate`

📖 **Nguyên văn** — RFC 9110, §11.3 Challenge and Response
> "A 401 (Unauthorized) response message is used by an origin server to challenge the authorization of a user agent, including a WWW-Authenticate header field containing at least one challenge applicable to the requested resource."

🇻🇳 **Dịch**
> "Một response message 401 (Unauthorized) được origin server dùng để thách thức authorization của một user agent, kèm theo một header field WWW-Authenticate chứa ít nhất một challenge áp dụng được cho resource được yêu cầu."

📖 **Nguyên văn** — RFC 7617, §2
> "Upon receipt of a request for a URI within the protection space that lacks credentials, the server can reply with a challenge using the 401 (Unauthorized) status code ([RFC7235], Section 3.1) and the WWW-Authenticate header field ([RFC7235], Section 4.1)."

🇻🇳 **Dịch**
> "Khi nhận được một request tới một URI nằm trong protection space mà request đó thiếu credentials, server có thể đáp lại bằng một challenge dùng status code 401 (Unauthorized) ([RFC7235], Mục 3.1) và header field WWW-Authenticate ([RFC7235], Mục 4.1)."

📖 **Nguyên văn** — RFC 7617, §2, ví dụ gốc
```
      HTTP/1.1 401 Unauthorized
      Date: Mon, 04 Feb 2014 16:50:53 GMT
      WWW-Authenticate: Basic realm="WallyWorld"
```

🇻🇳 Response challenge nguyên văn trong RFC: status `401 Unauthorized`, và header `WWW-Authenticate` khai báo scheme là `Basic` với realm tên `WallyWorld`.

📖 **Nguyên văn** — RFC 7617, §2 (giải thích ví dụ trên)
> "where "WallyWorld" is the string assigned by the server to identify the protection space."

🇻🇳 **Dịch**
> "trong đó "WallyWorld" là chuỗi do server gán để định danh protection space."

📖 **Nguyên văn** — RFC 7617, §2 (trường hợp proxy)
> "A proxy can respond with a similar challenge using the 407 (Proxy Authentication Required) status code ([RFC7235], Section 3.2) and the Proxy-Authenticate header field ([RFC7235], Section 4.3)."

🇻🇳 **Dịch**
> "Một proxy có thể đáp lại bằng một challenge tương tự, dùng status code 407 (Proxy Authentication Required) ([RFC7235], Mục 3.2) và header field Proxy-Authenticate ([RFC7235], Mục 4.3)."

> [!note] 401 khác 403
> RFC 9110 phân biệt rõ: thiếu/sai credentials → `401`; có credentials hợp lệ nhưng không đủ quyền → `403`. Chi tiết hai status code này đã bàn ở [[04 - HTTP Status Code và thiết kế lỗi]].

📖 **Nguyên văn** — RFC 9110, §11.4 Credentials
> "A server that receives valid credentials that are not adequate to gain access ought to respond with the 403 (Forbidden) status code (Section 15.5.4)."

🇻🇳 **Dịch**
> "Một server nhận được credentials hợp lệ nhưng không đủ để được truy cập thì nên đáp lại bằng status code 403 (Forbidden) (Mục 15.5.4)."

### 2.2. Bước 2 — client dựng credentials

📖 **Nguyên văn** — RFC 7617, §2
> "To receive authorization, the client
>
>    1.  obtains the user-id and password from the user,
>
>    2.  constructs the user-pass by concatenating the user-id, a single colon (":") character, and the password,
>
>    3.  encodes the user-pass into an octet sequence (see below for a discussion of character encoding schemes),
>
>    4.  and obtains the basic-credentials by encoding this octet sequence using Base64 ([RFC4648], Section 4) into a sequence of US-ASCII characters ([RFC0020])."

🇻🇳 **Dịch**
> "Để nhận được authorization, client
>
>    1. lấy user-id và password từ người dùng,
>
>    2. dựng chuỗi user-pass bằng cách nối user-id, một ký tự hai chấm (":") duy nhất, và password,
>
>    3. encode chuỗi user-pass thành một dãy octet (xem phần bên dưới bàn về character encoding scheme),
>
>    4. và thu được basic-credentials bằng cách encode dãy octet này bằng Base64 ([RFC4648], Mục 4) thành một dãy ký tự US-ASCII ([RFC0020])."

📖 **Nguyên văn** — RFC 7617, §2 (cú pháp credentials)
> "For credentials, the "token68" syntax defined in Section 2.1 of [RFC7235] is used.  The value is computed based on user-id and password as defined below."

🇻🇳 **Dịch**
> "Đối với credentials, cú pháp "token68" định nghĩa ở Mục 2.1 của [RFC7235] được sử dụng. Giá trị được tính từ user-id và password như định nghĩa bên dưới."

### 2.3. Ví dụ gốc trong RFC — `Aladdin` / `open sesame`

📖 **Nguyên văn** — RFC 7617, §2
> "If the user agent wishes to send the user-id "Aladdin" and password "open sesame", it would use the following header field:"

🇻🇳 **Dịch**
> "Nếu user agent muốn gửi user-id "Aladdin" và password "open sesame", nó sẽ dùng header field sau:"

📖 **Nguyên văn** — RFC 7617, §2 (chuỗi base64 gốc)
```
      Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
```

🇻🇳 Chuỗi `QWxhZGRpbjpvcGVuIHNlc2FtZQ==` chính là Base64 của `Aladdin:open sesame`. Không có khoá, không có muối, không có gì bí mật trong phép biến đổi này — ai cầm chuỗi cũng giải ngược ra được.

### 2.4. Ràng buộc trên user-id và password

📖 **Nguyên văn** — RFC 7617, §2
> "The user-id and password MUST NOT contain any control characters (see "CTL" in Appendix B.1 of [RFC5234])."

🇻🇳 **Dịch**
> "user-id và password KHÔNG ĐƯỢC chứa bất kỳ ký tự điều khiển (control character) nào (xem "CTL" ở Phụ lục B.1 của [RFC5234])."

📖 **Nguyên văn** — RFC 7617, §2
> "Furthermore, a user-id containing a colon character is invalid, as the first colon in a user-pass string separates user-id and password from one another; text after the first colon is part of the password.  User-ids containing colons cannot be encoded in user-pass strings."

🇻🇳 **Dịch**
> "Hơn nữa, một user-id có chứa ký tự hai chấm là không hợp lệ, vì dấu hai chấm đầu tiên trong chuỗi user-pass là thứ tách user-id khỏi password; phần text sau dấu hai chấm đầu tiên thuộc về password. Các user-id chứa dấu hai chấm không thể được encode trong chuỗi user-pass."

📖 **Nguyên văn** — RFC 7617, §2
> "Note that many user agents produce user-pass strings without checking that user-ids supplied by users do not contain colons; recipients will then treat part of the username input as part of the password."

🇻🇳 **Dịch**
> "Lưu ý rằng nhiều user agent tạo ra chuỗi user-pass mà không kiểm tra xem user-id người dùng nhập vào có chứa dấu hai chấm hay không; khi đó bên nhận sẽ coi một phần của phần username nhập vào là một phần của password."

---

## 3. `realm` — protection space

📖 **Nguyên văn** — RFC 7617, §2 (các tham số trong challenge)
> "   o  The scheme name is "Basic".
>
>    o  The authentication parameter 'realm' is REQUIRED ([RFC7235], Section 2.2).
>
>    o  The authentication parameter 'charset' is OPTIONAL (see Section 2.1).
>
>    o  No other authentication parameters are defined -- unknown parameters MUST be ignored by recipients, and new parameters can only be defined by revising this specification."

🇻🇳 **Dịch**
> "   o  Tên scheme là "Basic".
>
>    o  Authentication parameter 'realm' là BẮT BUỘC ([RFC7235], Mục 2.2).
>
>    o  Authentication parameter 'charset' là TUỲ CHỌN (xem Mục 2.1).
>
>    o  Không có authentication parameter nào khác được định nghĩa — các parameter không nhận biết được PHẢI bị bên nhận bỏ qua, và parameter mới chỉ có thể được định nghĩa bằng cách sửa đổi chính đặc tả này."

📖 **Nguyên văn** — RFC 7617, §2
> "Note that both scheme and parameter names are matched case-insensitively."

🇻🇳 **Dịch**
> "Lưu ý rằng cả tên scheme lẫn tên parameter đều được so khớp không phân biệt hoa thường."

📖 **Nguyên văn** — RFC 9110, §11.5 Establishing a Protection Space (Realm)
> "The "realm" authentication parameter is reserved for use by authentication schemes that wish to indicate a scope of protection.
>
>    A "protection space" is defined by the origin (see Section 4.3.1) of the server being accessed, in combination with the realm value if present.  These realms allow the protected resources on a server to be partitioned into a set of protection spaces, each with its own authentication scheme and/or authorization database.  The realm value is a string, generally assigned by the origin server, that can have additional semantics specific to the authentication scheme.  Note that a response can have multiple challenges with the same auth-scheme but with different realms."

🇻🇳 **Dịch**
> "Authentication parameter "realm" được dành riêng cho các authentication scheme muốn chỉ ra một phạm vi bảo vệ (scope of protection).
>
> Một "protection space" được xác định bởi origin (xem Mục 4.3.1) của server đang được truy cập, kết hợp với giá trị realm nếu có. Các realm này cho phép chia các protected resource trên một server thành một tập các protection space, mỗi space có authentication scheme và/hoặc authorization database riêng. Giá trị realm là một chuỗi, thường do origin server gán, và có thể mang thêm ngữ nghĩa đặc thù cho authentication scheme. Lưu ý rằng một response có thể chứa nhiều challenge cùng một auth-scheme nhưng khác realm."

📖 **Nguyên văn** — RFC 9110, §11.5
> "For historical reasons, a sender MUST only generate the quoted-string syntax.  Recipients might have to support both token and quoted-string syntax for maximum interoperability with existing clients that have been accepting both notations for a long time."

🇻🇳 **Dịch**
> "Vì lý do lịch sử, bên gửi CHỈ ĐƯỢC sinh ra cú pháp quoted-string. Bên nhận có thể phải hỗ trợ cả cú pháp token lẫn quoted-string để tương thích tối đa với các client hiện có vốn đã chấp nhận cả hai cách viết từ lâu."

💡 **Ví dụ đời sống**
`realm` giống tấm biển trên cửa: "Khu vực Kế toán" hay "Khu vực Kho". Bảo vệ nói "đây là khu vực Kế toán, cho xem giấy tờ" — bạn biết mình cần rút đúng thẻ của khu vực đó, chứ không phải thẻ của khu Kho. Bản thân tấm biển không bảo vệ gì cả, nó chỉ đặt tên cho vùng.

---

## 4. `charset` parameter

📖 **Nguyên văn** — RFC 7617, §2.1 The 'charset' auth-param
> "In challenges, servers can use the 'charset' authentication parameter to indicate the character encoding scheme they expect the user agent to use when generating "user-pass" (a sequence of octets).  This information is purely advisory."

🇻🇳 **Dịch**
> "Trong các challenge, server có thể dùng authentication parameter 'charset' để chỉ ra character encoding scheme mà nó mong user agent sử dụng khi sinh ra "user-pass" (một dãy octet). Thông tin này thuần tuý mang tính gợi ý."

📖 **Nguyên văn** — RFC 7617, §2.1
> "The only allowed value is "UTF-8"; it is to be matched case-insensitively (see [RFC2978], Section 2.3).  It indicates that the server expects character data to be converted to Unicode Normalization Form C ("NFC"; see Section 3 of [RFC5198]) and to be encoded into octets using the UTF-8 character encoding scheme ([RFC3629])."

🇻🇳 **Dịch**
> "Giá trị duy nhất được phép là "UTF-8"; nó được so khớp không phân biệt hoa thường (xem [RFC2978], Mục 2.3). Nó cho biết server mong dữ liệu ký tự được chuyển sang Unicode Normalization Form C ("NFC"; xem Mục 3 của [RFC5198]) và được encode thành octet bằng character encoding scheme UTF-8 ([RFC3629])."

📖 **Nguyên văn** — RFC 7617, §2.1 (ví dụ challenge có charset)
```
      WWW-Authenticate: Basic realm="foo", charset="UTF-8"
```

🇻🇳 Challenge nguyên văn trong RFC: realm tên `foo`, kèm gợi ý client dùng UTF-8 khi dựng chuỗi user-pass.

📖 **Nguyên văn** — RFC 7617, §2.1 (ví dụ mã hoá octet)
```
      't' 'e' 's' 't' ':' '1' '2' '3' pound
      74  65  73  74  3A  31  32  33  C2  A3
```

🇻🇳 Dãy octet nguyên văn trong RFC cho username `test` và password là `123` + ký tự U+00A3 (POUND SIGN): ký tự pound chiếm **hai** octet `C2 A3` khi encode bằng UTF-8 — đây chính là lý do `charset` tồn tại.

📖 **Nguyên văn** — RFC 7617, §2.1 (kết quả Base64)
```
      dGVzdDoxMjPCow==

      Authorization: Basic dGVzdDoxMjPCow==
```

🇻🇳 Base64 của dãy octet trên, và header `Authorization` hoàn chỉnh tương ứng — cả hai đều lấy nguyên văn từ RFC 7617 §2.1.

📖 **Nguyên văn** — RFC 7617, §2.1 (vì sao chỉ định nghĩa trên challenge)
> "      Note: The 'charset' is only defined on challenges, as Basic authentication uses a single token for credentials ('token68' syntax); thus, the credentials syntax isn't extensible."

🇻🇳 **Dịch**
> "      Ghi chú: 'charset' chỉ được định nghĩa trên các challenge, vì Basic authentication dùng một token duy nhất cho credentials (cú pháp 'token68'); do đó cú pháp của credentials không mở rộng được."

📖 **Nguyên văn** — RFC 7617, §2 (về encoding mặc định)
> "The original definition of this authentication scheme failed to specify the character encoding scheme used to convert the user-pass into an octet sequence.  In practice, most implementations chose either a locale-specific encoding such as ISO-8859-1 ([ISO-8859-1]), or UTF-8 ([RFC3629]).  For backwards compatibility reasons, this specification continues to leave the default encoding undefined, as long as it is compatible with US-ASCII (mapping any US-ASCII character to a single octet matching the US-ASCII character code)."

🇻🇳 **Dịch**
> "Định nghĩa ban đầu của authentication scheme này đã không đặc tả character encoding scheme dùng để chuyển user-pass thành dãy octet. Trên thực tế, phần lớn implementation chọn hoặc một encoding phụ thuộc locale như ISO-8859-1 ([ISO-8859-1]), hoặc UTF-8 ([RFC3629]). Vì lý do tương thích ngược, đặc tả này tiếp tục để ngỏ encoding mặc định, miễn là nó tương thích với US-ASCII (ánh xạ mọi ký tự US-ASCII thành một octet duy nhất khớp với mã ký tự US-ASCII)."

> [!warning] Password có dấu tiếng Việt là nguồn lỗi kinh điển
> Vì encoding mặc định **không được định nghĩa**, cùng một password chứa ký tự ngoài US-ASCII có thể tạo ra hai chuỗi Base64 khác nhau trên hai client khác nhau → login fail mà không rõ lý do.

📖 **Nguyên văn** — RFC 7617, §3 Internationalization Considerations
> "User-ids or passwords containing characters outside the US-ASCII character repertoire will cause interoperability issues, unless both communication partners agree on what character encoding scheme is to be used.  Servers can use the new 'charset' parameter (Section 2.1) to indicate a preference of "UTF-8", increasing the probability that clients will switch to that encoding."

🇻🇳 **Dịch**
> "user-id hoặc password chứa ký tự nằm ngoài bộ ký tự US-ASCII sẽ gây ra vấn đề interoperability, trừ khi cả hai bên giao tiếp thống nhất được character encoding scheme sẽ dùng. Server có thể dùng parameter 'charset' mới (Mục 2.1) để cho biết nó ưu tiên "UTF-8", làm tăng khả năng client chuyển sang encoding đó."

---

## 5. Credentials được gửi kèm MỌI request — và không có "đăng xuất"

Đây là hệ quả trực tiếp của việc HTTP là stateless (xem [[02 - REST]] về ràng buộc stateless và [[01 - API là gì và nền tảng HTTP]]): server không nhớ bạn, nên **mỗi request phải tự mang theo credentials**.

📖 **Nguyên văn** — RFC 7617, §2.2 Reusing Credentials
> "Given the absolute URI ([RFC3986], Section 4.3) of an authenticated request, the authentication scope of that request is obtained by removing all characters after the last slash ("/") character of the path component ("hier_part"; see [RFC3986], Section 3).  A client SHOULD assume that resources identified by URIs with a prefix-match of the authentication scope are also within the protection space specified by the realm value of that authenticated request."

🇻🇳 **Dịch**
> "Cho trước absolute URI ([RFC3986], Mục 4.3) của một request đã được authenticate, authentication scope của request đó thu được bằng cách bỏ đi tất cả ký tự sau dấu gạch chéo ("/") cuối cùng của thành phần path ("hier_part"; xem [RFC3986], Mục 3). Client NÊN giả định rằng các resource được định danh bởi các URI khớp tiền tố (prefix-match) với authentication scope đó cũng nằm trong protection space được chỉ ra bởi giá trị realm của request đã authenticate kia."

📖 **Nguyên văn** — RFC 7617, §2.2
> "A client MAY preemptively send the corresponding Authorization header field with requests for resources in that space without receipt of another challenge from the server.  Similarly, when a client sends a request to a proxy, it MAY reuse a user-id and password in the Proxy-Authorization header field without receiving another challenge from the proxy server."

🇻🇳 **Dịch**
> "Client CÓ THỂ gửi trước (preemptively) header field Authorization tương ứng kèm theo các request tới resource trong space đó mà không cần nhận thêm một challenge nào nữa từ server. Tương tự, khi client gửi request tới một proxy, nó CÓ THỂ tái sử dụng user-id và password trong header field Proxy-Authorization mà không cần nhận thêm challenge từ proxy server."

📖 **Nguyên văn** — RFC 7617, §2.2 (ví dụ phạm vi tái sử dụng)
```
      http://example.com/docs/index.html

      http://example.com/docs/
      http://example.com/docs/test.doc
      http://example.com/docs/?page=1

      http://example.com/other/
      https://example.com/docs/
```

🇻🇳 Ví dụ nguyên văn của RFC: sau khi authenticate ở `http://example.com/docs/index.html`, ba URI ở nhóm giữa được coi là dùng lại được credentials; hai URI nhóm cuối thì "would be considered to be outside the authentication scope" — nằm ngoài phạm vi (lưu ý `https://` khác scheme nên cũng nằm ngoài).

📖 **Nguyên văn** — RFC 9110, §11.5
> "The protection space determines the domain over which credentials can be automatically applied.  If a prior request has been authorized, the user agent MAY reuse the same credentials for all other requests within that protection space for a period of time determined by the authentication scheme, parameters, and/or user preferences (such as a configurable inactivity timeout)."

🇻🇳 **Dịch**
> "Protection space quyết định phạm vi mà credentials có thể được áp dụng tự động. Nếu một request trước đó đã được authorize, user agent CÓ THỂ tái sử dụng cùng credentials đó cho tất cả các request khác trong protection space ấy, trong một khoảng thời gian do authentication scheme, các parameter, và/hoặc tuỳ chọn của người dùng quyết định (ví dụ một inactivity timeout cấu hình được)."

### Không có cơ chế đăng xuất

📖 **Nguyên văn** — RFC 9110, §17.16.2 Credentials and Idle Clients
> "Existing HTTP clients and user agents typically retain authentication information indefinitely.  HTTP does not provide a mechanism for the origin server to direct clients to discard these cached credentials, since the protocol has no awareness of how credentials are obtained or managed by the user agent.  The mechanisms for expiring or revoking credentials can be specified as part of an authentication scheme definition."

🇻🇳 **Dịch**
> "Các HTTP client và user agent hiện nay thường giữ lại thông tin authentication vô thời hạn. HTTP không cung cấp cơ chế nào để origin server chỉ thị cho client vứt bỏ những credentials đã cache này, vì protocol không hề biết user agent lấy hay quản lý credentials bằng cách nào. Cơ chế hết hạn hoặc thu hồi credentials có thể được đặc tả như một phần của định nghĩa authentication scheme."

📖 **Nguyên văn** — RFC 9110, §17.16.2 (các tình huống xung đột)
> "   *  Clients that have been idle for an extended period, following which the server might wish to cause the client to re-prompt the user for credentials.
>
>    *  Applications that include a session termination indication (such as a "logout" or "commit" button on a page) after which the server side of the application "knows" that there is no further reason for the client to retain the credentials."

🇻🇳 **Dịch**
> "   * Các client đã nhàn rỗi một khoảng thời gian dài, sau đó server có thể muốn buộc client hỏi lại người dùng về credentials.
>
>    * Các ứng dụng có một dấu hiệu kết thúc phiên (chẳng hạn nút "logout" hay "commit" trên một trang), sau đó phía server của ứng dụng "biết" rằng không còn lý do gì để client giữ lại credentials nữa."

📖 **Nguyên văn** — RFC 9110, §17.16.2 (khuyến nghị)
> "User agents that cache credentials are encouraged to provide a readily accessible mechanism for discarding cached credentials under user control."

🇻🇳 **Dịch**
> "Các user agent có cache credentials được khuyến khích cung cấp một cơ chế dễ tiếp cận để người dùng tự chủ động vứt bỏ credentials đã cache."

> [!warning] Hệ quả thực tế của "không có logout"
> Basic auth không có khái niệm session, nên cũng không có khái niệm **kết thúc** session. Một password Basic auth đã phát ra chỉ hết hiệu lực khi bạn **đổi password ở phía server** — không có nút "đăng xuất tất cả thiết bị", không có token để thu hồi. Nội dung này là hệ quả rút ra từ RFC 9110 §17.16.2 trích ở trên, không phải câu chữ của RFC.

📖 **Nguyên văn** — RFC 9110, §17.16.3 Protection Spaces
> "Authentication schemes that solely rely on the "realm" mechanism for establishing a protection space will expose credentials to all resources on an origin server.  Clients that have successfully made authenticated requests with a resource can use the same authentication credentials for other resources on the same origin server.  This makes it possible for a different resource to harvest authentication credentials for other resources."

🇻🇳 **Dịch**
> "Các authentication scheme chỉ dựa duy nhất vào cơ chế "realm" để thiết lập protection space sẽ phơi bày credentials ra toàn bộ resource trên một origin server. Client đã thực hiện thành công các request có authenticate với một resource có thể dùng chính credentials đó cho các resource khác trên cùng origin server. Điều này khiến một resource khác có thể thu hoạch (harvest) credentials vốn dành cho các resource khác."

---

## 6. ⚠️ TRỌNG TÂM AN TOÀN — Base64 là encoding, KHÔNG phải encryption

> [!danger] Base64 KHÔNG mã hoá gì cả
> `QWxhZGRpbjpvcGVuIHNlc2FtZQ==` trông như chuỗi rối, nhưng nó là một phép **biến đổi định dạng hai chiều, công khai, không khoá** (RFC 4648). Bất kỳ ai chặn được request — Wi-Fi công cộng, proxy trung gian, log của load balancer, log của reverse proxy, ảnh chụp màn hình DevTools — đều **giải ngược ra password gốc** trong một dòng lệnh. RFC 7617 gọi thẳng đây là **cleartext transmission**.

📖 **Nguyên văn** — RFC 7617, §4 Security Considerations (đoạn mở đầu)
> "The Basic authentication scheme is not a secure method of user authentication, nor does it in any way protect the entity, which is transmitted in cleartext across the physical network used as the carrier.  HTTP does not prevent the addition of enhancements (such as schemes to use one-time passwords) to Basic authentication."

🇻🇳 **Dịch**
> "Basic authentication scheme không phải là một phương pháp user authentication an toàn, và nó cũng không hề bảo vệ entity — thứ được truyền dưới dạng cleartext qua mạng vật lý đóng vai trò đường truyền. HTTP không ngăn cản việc bổ sung các cải tiến (chẳng hạn các scheme dùng one-time password) vào Basic authentication."

📖 **Nguyên văn** — RFC 7617, §4
> "The most serious flaw of Basic authentication is that it results in the cleartext transmission of the user's password over the physical network.  Many other authentication schemes address this problem."

🇻🇳 **Dịch**
> "Khiếm khuyết nghiêm trọng nhất của Basic authentication là nó dẫn tới việc truyền password của người dùng dưới dạng cleartext qua mạng vật lý. Nhiều authentication scheme khác đã giải quyết vấn đề này."

### 6.1. Bắt buộc dùng kênh đã mã hoá

> [!danger] KHÔNG BAO GIỜ dùng Basic auth trên `http://`
> Chính RFC nói rõ: không có HTTPS thì **SHOULD NOT** dùng Basic auth để bảo vệ thông tin nhạy cảm hay có giá trị.

📖 **Nguyên văn** — RFC 7617, §4
> "Because Basic authentication involves the cleartext transmission of passwords, it SHOULD NOT be used (without enhancements such as HTTPS [RFC2818]) to protect sensitive or valuable information."

🇻🇳 **Dịch**
> "Vì Basic authentication kéo theo việc truyền password dưới dạng cleartext, nó KHÔNG NÊN được dùng (nếu không có các cải tiến như HTTPS [RFC2818]) để bảo vệ thông tin nhạy cảm hoặc có giá trị."

📖 **Nguyên văn** — RFC 9110, §17.16.1 Confidentiality of Credentials
> "The HTTP authentication framework does not define a single mechanism for maintaining the confidentiality of credentials; instead, each authentication scheme defines how the credentials are encoded prior to transmission.  While this provides flexibility for the development of future authentication schemes, it is inadequate for the protection of existing schemes that provide no confidentiality on their own, or that do not sufficiently protect against replay attacks.  Furthermore, if the server expects credentials that are specific to each individual user, the exchange of those credentials will have the effect of identifying that user even if the content within credentials remains confidential."

🇻🇳 **Dịch**
> "HTTP authentication framework không định nghĩa một cơ chế thống nhất để giữ bí mật credentials; thay vào đó, mỗi authentication scheme tự định nghĩa cách credentials được encode trước khi truyền đi. Việc này tuy linh hoạt cho sự phát triển của các authentication scheme tương lai, nhưng lại không đủ để bảo vệ những scheme hiện có vốn tự thân không cung cấp tính bí mật, hoặc không chống đỡ đủ tốt trước replay attack. Hơn nữa, nếu server yêu cầu credentials riêng cho từng người dùng cụ thể, việc trao đổi credentials đó sẽ có tác dụng định danh chính người dùng ấy, ngay cả khi nội dung bên trong credentials vẫn giữ được bí mật."

📖 **Nguyên văn** — RFC 9110, §17.16.1
> "HTTP depends on the security properties of the underlying transport- or session-level connection to provide confidential transmission of fields.  Services that depend on individual user authentication require a secured connection prior to exchanging credentials (Section 4.2.2)."

🇻🇳 **Dịch**
> "HTTP phụ thuộc vào các thuộc tính bảo mật của connection ở tầng transport hoặc tầng session bên dưới để đảm bảo việc truyền các field một cách bí mật. Các dịch vụ phụ thuộc vào authentication theo từng người dùng đòi hỏi phải có một connection đã được bảo mật **trước khi** trao đổi credentials (Mục 4.2.2)."

### 6.2. Rủi ro dùng lại password

📖 **Nguyên văn** — RFC 7617, §4
> "A common use of Basic authentication is for identification purposes -- requiring the user to provide a user-id and password as a means of identification, for example, for purposes of gathering accurate usage statistics on a server.  When used in this way it is tempting to think that there is no danger in its use if illicit access to the protected documents is not a major concern.  This is only correct if the server issues both user-id and password to the users and, in particular, does not allow the user to choose his or her own password.  The danger arises because naive users frequently reuse a single password to avoid the task of maintaining multiple passwords."

🇻🇳 **Dịch**
> "Một cách dùng phổ biến của Basic authentication là cho mục đích định danh — yêu cầu người dùng cung cấp user-id và password như một phương tiện nhận dạng, ví dụ để thu thập thống kê sử dụng chính xác trên một server. Khi dùng theo cách này, người ta dễ nghĩ rằng chẳng có nguy hiểm gì nếu việc truy cập trái phép vào các tài liệu được bảo vệ không phải mối lo lớn. Điều đó chỉ đúng nếu server tự phát cả user-id lẫn password cho người dùng và, đặc biệt, không cho người dùng tự chọn password của mình. Nguy hiểm nảy sinh vì những người dùng thiếu cảnh giác thường dùng đi dùng lại một password duy nhất để khỏi phải nhớ nhiều password."

📖 **Nguyên văn** — RFC 7617, §4
> "If a server permits users to select their own passwords, then the threat is not only unauthorized access to documents on the server but also unauthorized access to any other resources on other systems that the user protects with the same password.  Furthermore, in the server's password database, many of the passwords may also be users' passwords for other sites.  The owner or administrator of such a system could therefore expose all users of the system to the risk of unauthorized access to all those other sites if this information is not maintained in a secure fashion.  This raises both security and privacy concerns ([RFC6973]).  If the same user-id and password combination is in use to access other accounts, such as an email or health portal account, personal information could be exposed."

🇻🇳 **Dịch**
> "Nếu một server cho phép người dùng tự chọn password, thì mối đe doạ không chỉ là truy cập trái phép vào tài liệu trên server đó, mà còn là truy cập trái phép vào bất kỳ resource nào khác trên các hệ thống khác mà người dùng bảo vệ bằng cùng password ấy. Hơn nữa, trong database password của server, nhiều password có thể đồng thời là password của người dùng ở các site khác. Do đó chủ sở hữu hay quản trị viên của hệ thống như vậy có thể đẩy toàn bộ người dùng của hệ thống vào rủi ro bị truy cập trái phép ở tất cả các site khác kia, nếu thông tin này không được lưu giữ một cách an toàn. Điều này làm nảy sinh cả vấn đề bảo mật lẫn quyền riêng tư ([RFC6973]). Nếu cùng một tổ hợp user-id và password được dùng để truy cập các tài khoản khác, chẳng hạn tài khoản email hay cổng thông tin y tế, thông tin cá nhân có thể bị lộ."

### 6.3. Server giả mạo

📖 **Nguyên văn** — RFC 7617, §4
> "Basic authentication is also vulnerable to spoofing by counterfeit servers.  If a user can be led to believe that she is connecting to a host containing information protected by Basic authentication when, in fact, she is connecting to a hostile server or gateway, then the attacker can request a password, store it for later use, and feign an error."

🇻🇳 **Dịch**
> "Basic authentication cũng dễ bị tấn công giả mạo (spoofing) bởi các server giả. Nếu người dùng bị dẫn dắt để tin rằng mình đang kết nối tới một host chứa thông tin được bảo vệ bằng Basic authentication, trong khi thực tế cô ta đang kết nối tới một server hoặc gateway thù địch, thì kẻ tấn công có thể yêu cầu một password, lưu lại để dùng sau, rồi giả vờ báo lỗi."

### 6.4. Lưu password phía server

📖 **Nguyên văn** — RFC 7617, §4
> "Servers and proxies implementing Basic authentication need to store user passwords in some form in order to authenticate a request.  These passwords ought to be stored in such a way that a leak of the password data doesn't make them trivially recoverable.  This is especially important when users are allowed to set their own passwords, since users are known to choose weak passwords and to reuse them across authentication realms.  While a full discussion of good password hashing techniques is beyond the scope of this document, server operators ought to make an effort to minimize risks to their users in the event of a password data leak.  For example, servers ought to avoid storing user passwords in plaintext or as unsalted digests."

🇻🇳 **Dịch**
> "Server và proxy triển khai Basic authentication cần lưu password người dùng dưới một dạng nào đó để có thể authenticate một request. Những password này nên được lưu theo cách sao cho một vụ rò rỉ dữ liệu password không khiến chúng bị khôi phục lại một cách dễ dàng. Điều này đặc biệt quan trọng khi người dùng được phép tự đặt password, vì người dùng nổi tiếng là chọn password yếu và dùng lại chúng qua nhiều authentication realm. Dù một thảo luận đầy đủ về các kỹ thuật password hashing tốt nằm ngoài phạm vi tài liệu này, người vận hành server nên nỗ lực giảm thiểu rủi ro cho người dùng của mình trong trường hợp dữ liệu password bị rò rỉ. Ví dụ, server nên tránh lưu password người dùng dưới dạng plaintext hoặc dưới dạng digest không có salt (unsalted digest)."

---

## 7. Digest authentication — có tồn tại, và khác gì Basic

📖 **Nguyên văn** — RFC 7616, Abstract
> "The Hypertext Transfer Protocol (HTTP) provides a simple challenge-response authentication mechanism that may be used by a server to challenge a client request and by a client to provide authentication information.  This document defines the HTTP Digest Authentication scheme that can be used with the HTTP authentication mechanism."

🇻🇳 **Dịch**
> "Hypertext Transfer Protocol (HTTP) cung cấp một cơ chế challenge-response authentication đơn giản, có thể được server dùng để thách thức một request của client và được client dùng để cung cấp thông tin authentication. Tài liệu này định nghĩa HTTP Digest Authentication scheme có thể dùng với cơ chế authentication của HTTP."

📖 **Nguyên văn** — RFC 7616, §3.1 Overall Operation
> "The Digest scheme is based on a simple challenge-response paradigm.  The Digest scheme challenges using a nonce value and might indicate that username hashing is supported.  A valid response contains an unkeyed digest of the username, the password, the given nonce value, the HTTP method, and the requested URI.  In this way, the password is never sent in the clear, and the username can be hashed, depending on the indication received from the server.  The username and password must be prearranged in some fashion not addressed by this document."

🇻🇳 **Dịch**
> "Digest scheme dựa trên một mô hình challenge-response đơn giản. Digest scheme thách thức bằng một giá trị nonce và có thể cho biết nó hỗ trợ hashing username. Một response hợp lệ chứa một digest không khoá (unkeyed digest) của username, password, giá trị nonce đã cho, HTTP method, và URI được yêu cầu. Bằng cách này, password không bao giờ được gửi đi ở dạng thô, và username có thể được hash, tuỳ theo chỉ báo nhận từ server. Username và password phải được thoả thuận trước theo một cách nào đó mà tài liệu này không đề cập."

**Khác biệt cốt lõi:** Basic gửi password (đã Base64) qua mạng; Digest gửi một digest tính từ password + nonce + method + URI, nên password không bao giờ đi qua dây. Nhưng Digest **không phải** là lời giải thay thế:

📖 **Nguyên văn** — RFC 7616, §5.1 Limitations
> "HTTP Digest Authentication, when used with human-memorable passwords, is vulnerable to dictionary attacks.  Such attacks are much easier than cryptographic attacks on any widely used algorithm, including those that are no longer considered secure.  In other words, algorithm agility does not make this usage any more secure."

🇻🇳 **Dịch**
> "HTTP Digest Authentication, khi dùng với các password mà con người có thể nhớ được, dễ bị tấn công từ điển (dictionary attack). Các tấn công kiểu đó dễ hơn nhiều so với tấn công mật mã lên bất kỳ thuật toán phổ biến nào, kể cả những thuật toán không còn được coi là an toàn. Nói cách khác, khả năng linh hoạt về thuật toán (algorithm agility) không làm cho cách dùng này an toàn hơn chút nào."

📖 **Nguyên văn** — RFC 7616, §5.1
> "As a result, Digest Authentication SHOULD be used only with passwords that have a reasonable amount of entropy, e.g., 128-bit or more.  Such passwords typically cannot be memorized by humans but can be used for automated web services.
>
>    If Digest Authentication is being used, it SHOULD be over a secure channel like HTTPS [RFC2818]."

🇻🇳 **Dịch**
> "Do đó, Digest Authentication CHỈ NÊN được dùng với các password có lượng entropy hợp lý, ví dụ 128-bit trở lên. Những password như vậy thường con người không thể nhớ nổi, nhưng có thể dùng cho các web service tự động.
>
> Nếu Digest Authentication được sử dụng, nó NÊN chạy trên một kênh bảo mật như HTTPS [RFC2818]."

> [!warning] Digest cũng vẫn cần HTTPS
> Nhiều người tưởng "Digest an toàn hơn Basic nên khỏi cần TLS". Chính RFC 7616 §5.1 nói ngược lại: dùng Digest thì **vẫn** NÊN chạy trên kênh bảo mật.

---

## 8. Khi nào Basic auth còn dùng được

> [!note] Phần này là nhận định thực hành, không trích từ RFC
> RFC 7617 không liệt kê "các trường hợp nên dùng". Những gạch đầu dòng dưới đây là suy luận từ các câu trích ở trên, không phải khuyến nghị của IETF.

Điều RFC **có** nói: Basic chỉ chấp nhận được khi credentials **không phải password do người dùng tự chọn**, và kênh truyền đã được mã hoá. Hai điều kiện đó khớp với vài tình huống thật:

- **Gọi server-to-server trong mạng nội bộ / giữa các service.** Credential là một chuỗi ngẫu nhiên dài do hệ thống phát, không ai dùng lại nó cho email cá nhân — đúng với điều kiện "server issues both user-id and password to the users and, in particular, does not allow the user to choose his or her own password" ở §4.
- **API key nhét dưới dạng Basic.** Nhiều API public nhận API key bằng cách đặt nó vào phần user-id (hoặc password) của Basic auth, tận dụng việc mọi HTTP client đều có sẵn hỗ trợ Basic. Bản chất vẫn là bearer secret, không phải password người dùng.
- **Bảo vệ nhẹ các môi trường staging/nội bộ**, nơi mục tiêu chỉ là chặn người lạ và bot lướt qua, không phải bảo vệ dữ liệu nhạy cảm.
- **Health check, cron endpoint, webhook receiver** — client là máy, không có UI để đăng nhập, và việc "không có logout" không gây phiền.

Những chỗ Basic auth **không** phù hợp: đăng nhập người dùng cuối trên web/mobile (không logout được, password người dùng đi qua mạng mỗi request, không phân quyền theo scope, không hết hạn). Với các tình huống đó, xem các bài về token-based auth và OAuth 2.0 trong cùng thư mục này.

💡 **Ví dụ đời sống**
Đưa CMND cho bảo vệ xem mỗi lần vào cửa chỉ ổn khi: (1) "CMND" đó là thẻ hệ thống phát riêng cho việc vào toà nhà này, mất cũng không ảnh hưởng đời sống của bạn ở nơi khác; và (2) hành lang từ cửa tới bàn bảo vệ là **đường ống kín** (TLS), không ai đứng ngoài nhìn vào được. Thiếu một trong hai, đừng đưa.

---

## 9. Tóm tắt

| Khía cạnh | Basic (RFC 7617) | Digest (RFC 7616) |
|---|---|---|
| Server thách thức bằng | `401` + `WWW-Authenticate: Basic realm="..."` | `401` + challenge có `nonce` |
| Client gửi | `Authorization: Basic <base64(user-id:password)>` | digest của username + password + nonce + method + URI |
| Password đi qua mạng? | Có — RFC gọi là cleartext | "the password is never sent in the clear" (§3.1) |
| Parameter bắt buộc | `realm` | (xem RFC 7616) |
| Parameter tuỳ chọn | `charset` (chỉ nhận `"UTF-8"`) | — |
| Cần HTTPS? | SHOULD NOT dùng nếu không có (§4) | SHOULD chạy trên kênh bảo mật (§5.1) |
| Có logout? | Không — HTTP không có cơ chế bảo client vứt credentials (RFC 9110 §17.16.2) | Như trên |

---

## Liên kết
- Bài trước: [[10 - Authentication vs Authorization]]
- Bài kế: [[12 - Cookie và Session based Authentication]]
- [[10 - Authentication vs Authorization]] — phân biệt "bạn là ai" và "bạn được làm gì"; Basic auth thuần tuý là authentication
- [[04 - HTTP Status Code và thiết kế lỗi]] — `401 Unauthorized` vs `403 Forbidden`, `407 Proxy Authentication Required`
- [[01 - API là gì và nền tảng HTTP]] — header, request/response, nền tảng HTTP mà scheme này cắm vào
- [[02 - REST]] — ràng buộc stateless, lý do mỗi request phải tự mang credentials
- [[09 - So sánh API Styles và REST Security]] — bức tranh bảo mật API tổng quát

## Nguồn tham khảo
- RFC 7617 — *The 'Basic' HTTP Authentication Scheme* (IETF, Standards Track, 09/2015) : https://www.rfc-editor.org/rfc/rfc7617.txt
- RFC 9110 — *HTTP Semantics*, §11 HTTP Authentication và §17.16 Authentication Considerations : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 7616 — *HTTP Digest Access Authentication* (IETF, Standards Track, 09/2015) : https://www.rfc-editor.org/rfc/rfc7616.txt
- roadmap.sh — *Basic Authentication* (nguồn bên thứ ba) : https://roadmap.sh/guides/basic-authentication — URL trả HTTP 200 nhưng phần thân bài được render phía client, không lấy được nội dung để trích; **không có câu nào trong bài này lấy từ nguồn đó**.
