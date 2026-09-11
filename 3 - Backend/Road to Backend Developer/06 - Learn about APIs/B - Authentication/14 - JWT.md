# 14 — JWT (JSON Web Token)

> **Nguồn chính:** RFC 7519 — JSON Web Token (JWT) — https://www.rfc-editor.org/rfc/rfc7519.txt
> Bài này bám RFC 7519 (định dạng token + claims), RFC 7515 (JWS — chữ ký), RFC 7518 (JWA — thuật toán), RFC 7516 (JWE — mã hoá) và **RFC 8725 — JWT Best Current Practices** (phần "dùng sai thế nào").

> [!danger] Đọc trước khi triển khai
> JWT là công nghệ bị dùng sai nhiều bậc nhất trong mảng authentication. Ba hiểu nhầm chết người:
> 1. Tưởng payload được **mã hoá** — không, nó chỉ được **encode**, ai cũng đọc được.
> 2. Tin vào trường `alg` do chính token khai báo — mở đường cho tấn công `alg: none` và algorithm confusion.
> 3. Tưởng JWT thu hồi được như session — không, token đã phát ra thì sống tới khi `exp` hết hạn.
>
> Bài này trích nguyên văn spec cho cả ba.

---

# PHẦN A — JWT là gì

## A.1. Định nghĩa chính thức

📖 **Nguyên văn** — RFC 7519 §1 (Introduction)
> "JSON Web Token (JWT) is a compact claims representation format intended for space constrained environments such as HTTP Authorization headers and URI query parameters.  JWTs encode claims to be transmitted as a JSON [RFC7159] object that is used as the payload of a JSON Web Signature (JWS) [JWS] structure or as the plaintext of a JSON Web Encryption (JWE) [JWE] structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.  JWTs are always represented using the JWS Compact Serialization or the JWE Compact Serialization."

🇻🇳 **Dịch**
> "JSON Web Token (JWT) là một **định dạng biểu diễn claims** gọn nhẹ, dành cho những môi trường hạn chế về chỗ chứa như HTTP Authorization header và URI query parameter. JWT encode các claims để truyền đi dưới dạng một JSON object, object này được dùng làm payload của một cấu trúc JSON Web Signature (JWS), hoặc làm plaintext của một cấu trúc JSON Web Encryption (JWE), cho phép các claims được ký số hoặc được bảo vệ toàn vẹn bằng Message Authentication Code (MAC) và/hoặc được mã hoá. JWT luôn được biểu diễn bằng JWS Compact Serialization hoặc JWE Compact Serialization."

📖 **Nguyên văn** — RFC 7519 §2 (Terminology)
> "JSON Web Token (JWT)
>       A string representing a set of claims as a JSON object that is
>       encoded in a JWS or JWE, enabling the claims to be digitally
>       signed or MACed and/or encrypted.
>
>    JWT Claims Set
>       A JSON object that contains the claims conveyed by the JWT.
>
>    Claim
>       A piece of information asserted about a subject.  A claim is
>       represented as a name/value pair consisting of a Claim Name and a
>       Claim Value."

🇻🇳 **Dịch**
> "JSON Web Token (JWT)
> Một chuỗi biểu diễn một tập claims dưới dạng JSON object, được encode trong một JWS hoặc JWE, cho phép các claims đó được ký số hoặc MAC hoá và/hoặc mã hoá.
>
> JWT Claims Set
> Một JSON object chứa các claims mà JWT truyền tải.
>
> Claim
> Một mẩu thông tin được khẳng định về một subject. Một claim được biểu diễn bằng cặp name/value gồm một Claim Name và một Claim Value."

## A.2. JWT là ĐỊNH DẠNG, không phải giao thức xác thực

Chú ý từ khoá trong định nghĩa: *"claims representation **format**"*. Spec không hề nói tới đăng nhập, mật khẩu, phiên làm việc, hay luồng nào cả.

| Câu hỏi | JWT có trả lời không? |
|---|---|
| Token trông như thế nào? | ✅ Có — đó chính là nội dung RFC 7519 |
| Bên nhận kiểm tra token thế nào? | ✅ Có — RFC 7519 §7.2 + RFC 7515 §5.2 |
| Trong token đặt được những thông tin chuẩn nào? | ✅ Có — Registered Claim Names |
| Người dùng đăng nhập ra sao? | ❌ Không — nằm ngoài spec |
| Token được cấp phát theo luồng nào? | ❌ Không — đó là việc của OAuth 2.0 / OpenID Connect |
| Token bị thu hồi thế nào? | ❌ Không — RFC 7519 không có cơ chế thu hồi |

📖 **Nguyên văn** — RFC 7519 §4 (JWT Claims)
> "The set of claims that a JWT must contain to be considered valid is context dependent and is outside the scope of this specification.  Specific applications of JWTs will require implementations to understand and process some claims in particular ways.  However, in the absence of such requirements, all claims that are not understood by implementations MUST be ignored."

🇻🇳 **Dịch**
> "Tập claims mà một JWT phải chứa để được coi là hợp lệ **phụ thuộc vào ngữ cảnh và nằm ngoài phạm vi của spec này**. Các ứng dụng cụ thể của JWT sẽ yêu cầu phần triển khai hiểu và xử lý một số claims theo cách riêng. Tuy nhiên, khi không có những yêu cầu như vậy, mọi claim mà phần triển khai không hiểu đều PHẢI bị bỏ qua."

> [!note] Hệ quả thực tế
> "Dùng JWT để authentication" không phải một thiết kế — nó mới chỉ là chọn định dạng token. Bạn vẫn phải tự quyết: ai cấp token, cấp sau bước xác thực nào, token sống bao lâu, bên nhận kiểm những claim nào. RFC 7519 không quyết hộ bạn bất kỳ điểm nào trong số đó.

💡 **Ví dụ đời sống**
JWT giống như **khổ giấy và bố cục của tấm vé** — vé in dọc hay ngang, ô nào ghi tên, ô nào ghi giờ hết hạn, góc nào dán tem. Biết bố cục vé không có nghĩa là biết quy trình bán vé, quy trình soát vé, hay chính sách hoàn vé. JWT chỉ chuẩn hoá tấm vé.

## A.3. Cấu trúc ba phần

📖 **Nguyên văn** — RFC 7519 §3 (JWT Overview)
> "A JWT is represented as a sequence of URL-safe parts separated by period ('.') characters.  Each part contains a base64url-encoded value.  The number of parts in the JWT is dependent upon the representation of the resulting JWS using the JWS Compact Serialization or JWE using the JWE Compact Serialization."

🇻🇳 **Dịch**
> "Một JWT được biểu diễn dưới dạng một chuỗi các phần an toàn với URL, ngăn cách nhau bằng ký tự dấu chấm ('.'). Mỗi phần chứa một giá trị đã được base64url-encode. Số phần trong JWT phụ thuộc vào việc kết quả được biểu diễn bằng JWS Compact Serialization hay JWE Compact Serialization."

📖 **Nguyên văn** — RFC 7515 §3.1 (JWS Compact Serialization Overview)
> "In the JWS Compact Serialization, a JWS is represented as the concatenation:
>
>       BASE64URL(UTF8(JWS Protected Header)) || '.' ||
>       BASE64URL(JWS Payload) || '.' ||
>       BASE64URL(JWS Signature)"

🇻🇳 **Dịch**
> "Trong JWS Compact Serialization, một JWS được biểu diễn bằng phép nối:
> BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload) || '.' || BASE64URL(JWS Signature)"

Đó chính là dạng **3 phần** quen thuộc: `header.payload.signature`.

> [!note] JWT không phải lúc nào cũng có 3 phần
> Con số 3 chỉ đúng với JWS Compact Serialization. Nếu JWT được mã hoá (JWE), nó có **5 phần** — xem phần C.5.

## A.4. Ví dụ JWT nguyên văn trong RFC 7519 §3.1

📖 **Nguyên văn** — RFC 7519 §3.1, JOSE Header
> "The following example JOSE Header declares that the encoded object is a JWT, and the JWT is a JWS that is MACed using the HMAC SHA-256 algorithm:
>
>      {"typ":"JWT",
>       "alg":"HS256"}"

🇻🇳 **Dịch**
> "Ví dụ JOSE Header dưới đây khai báo rằng object được encode là một JWT, và JWT này là một JWS được MAC hoá bằng thuật toán HMAC SHA-256: `{"typ":"JWT","alg":"HS256"}`"

📖 **Nguyên văn** — RFC 7519 §3.1, encoded header
> "Base64url encoding the octets of the UTF-8 representation of the JOSE Header yields this encoded JOSE Header value:
>
>      eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9"

🇻🇳 Đây là phần 1 của token: chuỗi base64url của JSON header ở trên.

📖 **Nguyên văn** — RFC 7519 §3.1, JWT Claims Set và encoded payload
> "The following is an example of a JWT Claims Set:
>
>      {"iss":"joe",
>       "exp":1300819380,
>       "http://example.com/is_root":true}"
>
> "Base64url encoding the JWS Payload yields this encoded JWS Payload (with line breaks for display purposes only):
>
>      eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly
>      9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ"

🇻🇳 **Dịch**
> "Dưới đây là một ví dụ JWT Claims Set: issuer là `joe`, thời điểm hết hạn `exp` là 1300819380 (NumericDate), và một claim tự định nghĩa `http://example.com/is_root` bằng `true`. Base64url-encode JWS Payload này thu được encoded JWS Payload sau (xuống dòng chỉ để trình bày)."

📖 **Nguyên văn** — RFC 7519 §3.1, signature
> "Computing the MAC of the encoded JOSE Header and encoded JWS Payload with the HMAC SHA-256 algorithm and base64url encoding the HMAC value in the manner specified in [JWS] yields this encoded JWS Signature:
>
>      dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

🇻🇳 **Dịch**
> "Tính MAC của encoded JOSE Header và encoded JWS Payload bằng thuật toán HMAC SHA-256, rồi base64url-encode giá trị HMAC đó theo cách quy định trong [JWS], thu được JWS Signature đã encode: `dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`"

📖 **Nguyên văn** — RFC 7519 §3.1, token hoàn chỉnh
> "Concatenating these encoded parts in this order with period ('.') characters between the parts yields this complete JWT (with line breaks for display purposes only):
>
>      eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9
>      .
>      eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFt
>      cGxlLmNvbS9pc19yb290Ijp0cnVlfQ
>      .
>      dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

🇻🇳 Ba phần nối bằng dấu chấm thành JWT hoàn chỉnh; các dấu xuống dòng ở trên chỉ để trình bày trong RFC.

## A.5. ⚠️ base64url là ENCODING, không phải mã hoá

📖 **Nguyên văn** — RFC 7515 §2 (Terminology), định nghĩa Base64url Encoding
> "Base64url Encoding
>       Base64 encoding using the URL- and filename-safe character set
>       defined in Section 5 of RFC 4648 [RFC4648], with all trailing '='
>       characters omitted (as permitted by Section 3.2) and without the
>       inclusion of any line breaks, whitespace, or other additional
>       characters."

🇻🇳 **Dịch**
> "Base64url Encoding: mã base64 dùng bộ ký tự an toàn cho URL và tên file được định nghĩa ở Mục 5 của RFC 4648, bỏ hết dấu '=' ở cuối (như Mục 3.2 cho phép) và không chèn bất kỳ ký tự xuống dòng, khoảng trắng hay ký tự phụ nào khác."

Không có khoá, không có bí mật, không có gì cả — đó chỉ là cách viết lại byte sang tập ký tự an toàn cho URL. **Bất kỳ ai cầm token cũng decode được payload trong một giây.**

> [!danger] KHÔNG đặt dữ liệu nhạy cảm trong payload của JWT được ký
> Chữ ký chỉ đảm bảo **toàn vẹn** (không sửa được), **không** đảm bảo **bí mật** (không đọc được). Payload của một JWS là văn bản rõ đã encode. Mật khẩu, số thẻ, số CMND/CCCD, thông tin y tế, email nội bộ... đặt vào payload là công khai chúng cho bất kỳ ai chặn được token — kể cả chính người dùng cầm token đó.

📖 **Nguyên văn** — RFC 7519 §12 (Privacy Considerations)
> "A JWT may contain privacy-sensitive information.  When this is the case, measures MUST be taken to prevent disclosure of this information to unintended parties.  One way to achieve this is to use an encrypted JWT and authenticate the recipient.  Another way is to ensure that JWTs containing unencrypted privacy-sensitive information are only transmitted using protocols utilizing encryption that support endpoint authentication, such as Transport Layer Security (TLS).  Omitting privacy-sensitive information from a JWT is the simplest way of minimizing privacy issues."

🇻🇳 **Dịch**
> "Một JWT có thể chứa thông tin nhạy cảm về quyền riêng tư. Khi đó, PHẢI áp dụng biện pháp ngăn việc lộ thông tin này cho các bên không mong muốn. Một cách là dùng JWT đã mã hoá (encrypted JWT) và xác thực bên nhận. Một cách khác là đảm bảo các JWT chứa thông tin nhạy cảm chưa mã hoá chỉ được truyền qua những protocol có mã hoá và hỗ trợ xác thực endpoint, ví dụ Transport Layer Security (TLS). **Bỏ hẳn thông tin nhạy cảm ra khỏi JWT là cách đơn giản nhất để giảm thiểu vấn đề riêng tư.**"

📖 **Nguyên văn** — RFC 7519 §11.1 (Trust Decisions)
> "The contents of a JWT cannot be relied upon in a trust decision unless its contents have been cryptographically secured and bound to the context necessary for the trust decision."

🇻🇳 **Dịch**
> "Không được dựa vào nội dung của một JWT để ra quyết định tin cậy trừ khi nội dung đó đã được bảo vệ bằng mật mã **và** được ràng buộc với ngữ cảnh cần thiết cho quyết định tin cậy đó."

💡 **Ví dụ đời sống**
Tấm vé xem phim có in rõ tên bạn, ghế bạn ngồi, suất chiếu mấy giờ — ai cầm vé cũng **đọc** được hết. Cái người ta không làm được là **sửa** dòng "ghế C5" thành "ghế VIP A1" mà con tem chống giả vẫn khớp. Tem bảo vệ tính toàn vẹn, không che giấu nội dung. JWS y hệt: chữ ký chống sửa, không chống đọc.

---

# PHẦN B — Claims

## B.1. Ba lớp Claim Name

📖 **Nguyên văn** — RFC 7519 §4
> "There are three classes of JWT Claim Names: Registered Claim Names, Public Claim Names, and Private Claim Names."

🇻🇳 **Dịch**
> "Có ba lớp JWT Claim Name: Registered Claim Names, Public Claim Names, và Private Claim Names."

📖 **Nguyên văn** — RFC 7519 §4, quy tắc trùng tên
> "The Claim Names within a JWT Claims Set MUST be unique; JWT parsers MUST either reject JWTs with duplicate Claim Names or use a JSON parser that returns only the lexically last duplicate member name, as specified in Section 15.12 ("The JSON Object") of ECMAScript 5.1 [ECMAScript]."

🇻🇳 **Dịch**
> "Các Claim Name trong một JWT Claims Set PHẢI là duy nhất; JWT parser PHẢI hoặc từ chối các JWT có Claim Name trùng lặp, hoặc dùng một JSON parser chỉ trả về member trùng tên xuất hiện **cuối cùng**, như quy định ở Mục 15.12 ("The JSON Object") của ECMAScript 5.1."

## B.2. Registered Claim Names

📖 **Nguyên văn** — RFC 7519 §4.1
> "The following Claim Names are registered in the IANA "JSON Web Token Claims" registry established by Section 10.1.  None of the claims defined below are intended to be mandatory to use or implement in all cases, but rather they provide a starting point for a set of useful, interoperable claims.  Applications using JWTs should define which specific claims they use and when they are required or optional.  All the names are short because a core goal of JWTs is for the representation to be compact."

🇻🇳 **Dịch**
> "Các Claim Name sau được đăng ký trong registry "JSON Web Token Claims" của IANA lập bởi Mục 10.1. **Không claim nào dưới đây là bắt buộc phải dùng hay phải triển khai trong mọi trường hợp**; chúng chỉ là điểm khởi đầu cho một tập claims hữu ích và có tính liên thông. Ứng dụng dùng JWT nên tự định nghĩa mình dùng claim cụ thể nào, và khi nào chúng là bắt buộc hay tuỳ chọn. Mọi tên đều ngắn vì một mục tiêu cốt lõi của JWT là biểu diễn gọn nhẹ."

Bảng tóm tắt (chi tiết nguyên văn ở ngay dưới bảng):

| Claim | Tên đầy đủ | Ý nghĩa ngắn gọn | Kiểu giá trị | Bắt buộc? |
|---|---|---|---|---|
| `iss` | Issuer | Bên **phát hành** token | StringOrURI, phân biệt hoa thường | OPTIONAL |
| `sub` | Subject | **Chủ thể** mà các claims nói về | StringOrURI, phân biệt hoa thường | OPTIONAL |
| `aud` | Audience | (Các) **bên nhận** mà token dành cho | Mảng StringOrURI (hoặc 1 chuỗi) | OPTIONAL |
| `exp` | Expiration Time | Thời điểm **hết hạn** | NumericDate | OPTIONAL |
| `nbf` | Not Before | Thời điểm **bắt đầu có hiệu lực** | NumericDate | OPTIONAL |
| `iat` | Issued At | Thời điểm **được phát hành** | NumericDate | OPTIONAL |
| `jti` | JWT ID | **Định danh duy nhất** của token | Chuỗi, phân biệt hoa thường | OPTIONAL |

> [!warning] "OPTIONAL" là theo RFC 7519, không phải theo ứng dụng của bạn
> RFC 7519 chỉ định nghĩa *cú pháp*. RFC 8725 (phần D) biến một số claim trong bảng trên thành **MUST validate** đối với ứng dụng — đặc biệt `iss`, `sub`, `aud`.

### `iss` — Issuer

📖 **Nguyên văn** — RFC 7519 §4.1.1
> "The "iss" (issuer) claim identifies the principal that issued the JWT.  The processing of this claim is generally application specific.  The "iss" value is a case-sensitive string containing a StringOrURI value.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "iss" (issuer) xác định principal đã phát hành JWT. Việc xử lý claim này nhìn chung tuỳ theo từng ứng dụng. Giá trị "iss" là một chuỗi phân biệt hoa thường chứa một giá trị StringOrURI. Việc dùng claim này là TUỲ CHỌN."

### `sub` — Subject

📖 **Nguyên văn** — RFC 7519 §4.1.2
> "The "sub" (subject) claim identifies the principal that is the subject of the JWT.  The claims in a JWT are normally statements about the subject.  The subject value MUST either be scoped to be locally unique in the context of the issuer or be globally unique.  The processing of this claim is generally application specific.  The "sub" value is a case-sensitive string containing a StringOrURI value.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "sub" (subject) xác định principal là chủ thể của JWT. Các claims trong một JWT thường là những khẳng định về subject. Giá trị subject PHẢI hoặc là duy nhất cục bộ trong phạm vi của issuer, hoặc là duy nhất toàn cục. Việc xử lý claim này nhìn chung tuỳ theo từng ứng dụng. Giá trị "sub" là chuỗi phân biệt hoa thường chứa giá trị StringOrURI. Việc dùng claim này là TUỲ CHỌN."

> [!warning] `sub` chỉ duy nhất **trong phạm vi issuer**
> Spec nói rõ: duy nhất *locally unique in the context of the issuer* hoặc *globally unique*. Nghĩa là `sub = "1234"` của issuer A và `sub = "1234"` của issuer B là **hai người khác nhau**. Tra user trong DB chỉ bằng `sub` mà bỏ qua `iss` là lỗi thiết kế — OWASP gọi rủi ro này là "cross-issuer user impersonation".

### `aud` — Audience

📖 **Nguyên văn** — RFC 7519 §4.1.3
> "The "aud" (audience) claim identifies the recipients that the JWT is intended for.  Each principal intended to process the JWT MUST identify itself with a value in the audience claim.  If the principal processing the claim does not identify itself with a value in the "aud" claim when this claim is present, then the JWT MUST be rejected.  In the general case, the "aud" value is an array of case-sensitive strings, each containing a StringOrURI value.  In the special case when the JWT has one audience, the "aud" value MAY be a single case-sensitive string containing a StringOrURI value.  The interpretation of audience values is generally application specific.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "aud" (audience) xác định những bên nhận mà JWT này dành cho. Mỗi principal có ý định xử lý JWT PHẢI tự nhận diện mình bằng một giá trị trong claim audience. **Nếu principal đang xử lý claim không tự nhận diện mình bằng một giá trị trong claim "aud" khi claim này có mặt, thì JWT PHẢI bị từ chối.** Trong trường hợp tổng quát, giá trị "aud" là một mảng các chuỗi phân biệt hoa thường, mỗi chuỗi chứa một giá trị StringOrURI. Trong trường hợp đặc biệt JWT chỉ có một audience, giá trị "aud" CÓ THỂ là một chuỗi đơn phân biệt hoa thường chứa giá trị StringOrURI. Cách diễn giải các giá trị audience nhìn chung tuỳ theo từng ứng dụng. Việc dùng claim này là TUỲ CHỌN."

### `exp` — Expiration Time

📖 **Nguyên văn** — RFC 7519 §4.1.4
> "The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.  The processing of the "exp" claim requires that the current date/time MUST be before the expiration date/time listed in the "exp" claim.  Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.  Its value MUST be a number containing a NumericDate value.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "exp" (expiration time) xác định thời điểm hết hạn, mà tại hoặc sau thời điểm đó JWT **KHÔNG ĐƯỢC PHÉP** được chấp nhận để xử lý. Việc xử lý claim "exp" đòi hỏi thời gian hiện tại PHẢI trước thời điểm hết hạn ghi trong claim "exp". Người triển khai CÓ THỂ cho phép một khoảng dung sai nhỏ, thường không quá vài phút, để bù cho lệch đồng hồ (clock skew). Giá trị của nó PHẢI là một số chứa giá trị NumericDate. Việc dùng claim này là TUỲ CHỌN."

### `nbf` — Not Before

📖 **Nguyên văn** — RFC 7519 §4.1.5
> "The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.  The processing of the "nbf" claim requires that the current date/time MUST be after or equal to the not-before date/time listed in the "nbf" claim.  Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.  Its value MUST be a number containing a NumericDate value.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "nbf" (not before) xác định thời điểm mà **trước** nó JWT KHÔNG ĐƯỢC PHÉP được chấp nhận để xử lý. Việc xử lý claim "nbf" đòi hỏi thời gian hiện tại PHẢI sau hoặc bằng thời điểm not-before ghi trong claim "nbf". Người triển khai CÓ THỂ cho phép một khoảng dung sai nhỏ, thường không quá vài phút, để bù cho lệch đồng hồ. Giá trị PHẢI là một số chứa giá trị NumericDate. Việc dùng claim này là TUỲ CHỌN."

### `iat` — Issued At

📖 **Nguyên văn** — RFC 7519 §4.1.6
> "The "iat" (issued at) claim identifies the time at which the JWT was issued.  This claim can be used to determine the age of the JWT.  Its value MUST be a number containing a NumericDate value.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "iat" (issued at) xác định thời điểm JWT được phát hành. Claim này có thể dùng để xác định "tuổi" của JWT. Giá trị PHẢI là một số chứa giá trị NumericDate. Việc dùng claim này là TUỲ CHỌN."

### `jti` — JWT ID

📖 **Nguyên văn** — RFC 7519 §4.1.7
> "The "jti" (JWT ID) claim provides a unique identifier for the JWT.  The identifier value MUST be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object; if the application uses multiple issuers, collisions MUST be prevented among values produced by different issuers as well.  The "jti" claim can be used to prevent the JWT from being replayed.  The "jti" value is a case-sensitive string.  Use of this claim is OPTIONAL."

🇻🇳 **Dịch**
> "Claim "jti" (JWT ID) cung cấp một định danh duy nhất cho JWT. Giá trị định danh PHẢI được gán theo cách đảm bảo xác suất cùng một giá trị bị vô tình gán cho một data object khác là không đáng kể; nếu ứng dụng dùng nhiều issuer, cũng PHẢI ngăn va chạm giữa các giá trị do những issuer khác nhau sinh ra. **Claim "jti" có thể dùng để ngăn JWT bị replay.** Giá trị "jti" là chuỗi phân biệt hoa thường. Việc dùng claim này là TUỲ CHỌN."

## B.3. Public Claim Names và Private Claim Names

📖 **Nguyên văn** — RFC 7519 §4.2 (Public Claim Names)
> "Claim Names can be defined at will by those using JWTs.  However, in order to prevent collisions, any new Claim Name should either be registered in the IANA "JSON Web Token Claims" registry established by Section 10.1 or be a Public Name: a value that contains a Collision-Resistant Name.  In each case, the definer of the name or value needs to take reasonable precautions to make sure they are in control of the part of the namespace they use to define the Claim Name."

🇻🇳 **Dịch**
> "Người dùng JWT có thể tự định nghĩa Claim Name tuỳ ý. Tuy nhiên, để tránh va chạm, bất kỳ Claim Name mới nào cũng nên hoặc được đăng ký trong registry "JSON Web Token Claims" của IANA lập bởi Mục 10.1, hoặc là một Public Name: một giá trị chứa một Collision-Resistant Name. Trong cả hai trường hợp, người định nghĩa tên hoặc giá trị cần có biện pháp phòng ngừa hợp lý để chắc rằng họ đang kiểm soát phần namespace mà họ dùng để định nghĩa Claim Name đó."

📖 **Nguyên văn** — RFC 7519 §4.3 (Private Claim Names)
> "A producer and consumer of a JWT MAY agree to use Claim Names that are Private Names: names that are not Registered Claim Names (Section 4.1) or Public Claim Names (Section 4.2).  Unlike Public Claim Names, Private Claim Names are subject to collision and should be used with caution."

🇻🇳 **Dịch**
> "Bên tạo và bên tiêu thụ một JWT CÓ THỂ thoả thuận dùng các Claim Name là Private Name: những tên không phải Registered Claim Name (Mục 4.1) cũng không phải Public Claim Name (Mục 4.2). Khác với Public Claim Name, **Private Claim Name có nguy cơ va chạm và nên được dùng thận trọng**."

Trong ví dụ ở §3.1, claim `"http://example.com/is_root"` chính là một Public Claim Name kiểu Collision-Resistant Name (dùng URI mình sở hữu làm tiền tố). Còn `"role"`, `"shop_id"` trần trụi là Private Claim Name — chỉ có nghĩa khi hai bên đã thoả thuận trước.

---

# PHẦN C — Chữ ký (JWS)

## C.1. JWS là gì

📖 **Nguyên văn** — RFC 7515 §3 (JWS Overview)
> "JWS represents digitally signed or MACed content using JSON data structures and base64url encoding. ... In both serializations, the JWS Protected Header, JWS Payload, and JWS Signature are base64url encoded, since JSON lacks a way to directly represent arbitrary octet sequences."

🇻🇳 **Dịch**
> "JWS biểu diễn nội dung đã được ký số hoặc MAC hoá bằng cấu trúc dữ liệu JSON và base64url encoding. ... Trong cả hai kiểu serialization, JWS Protected Header, JWS Payload và JWS Signature đều được base64url-encode, vì JSON không có cách biểu diễn trực tiếp một dãy octet tuỳ ý."

## C.2. Ký cái gì — "JWS Signing Input"

📖 **Nguyên văn** — RFC 7515 §2 (Terminology)
> "JWS Signing Input
>       The input to the digital signature or MAC computation.  Its value
>       is ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' ||
>       BASE64URL(JWS Payload))."

🇻🇳 **Dịch**
> "JWS Signing Input: đầu vào của phép tính chữ ký số hoặc MAC. Giá trị của nó là ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload))."

Điểm cực kỳ quan trọng: **header nằm trong phạm vi được ký**. Sửa một ký tự trong header (ví dụ đổi `alg`) là chữ ký hỏng ngay — *miễn là bên verify thực sự kiểm chữ ký bằng thuật toán đúng*. Toàn bộ phần C.4 và C.5 dưới đây là về chuyện bên verify **không** làm đúng.

## C.3. Quy trình ký và verify (nguyên văn spec)

📖 **Nguyên văn** — RFC 7515 §5.1 (Message Signature or MAC Computation), bước 5
> "5.  Compute the JWS Signature in the manner defined for the
>        particular algorithm being used over the JWS Signing Input
>        ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' ||
>        BASE64URL(JWS Payload)).  The "alg" (algorithm) Header Parameter
>        MUST be present in the JOSE Header, with the algorithm value
>        accurately representing the algorithm used to construct the JWS
>        Signature."

🇻🇳 **Dịch**
> "5. Tính JWS Signature theo cách được định nghĩa cho thuật toán cụ thể đang dùng, trên JWS Signing Input ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload)). Header Parameter "alg" PHẢI có mặt trong JOSE Header, với giá trị thuật toán **phản ánh chính xác** thuật toán đã dùng để tạo JWS Signature."

📖 **Nguyên văn** — RFC 7515 §5.2 (Message Signature or MAC Validation), bước 8 và 10
> "8.  Validate the JWS Signature against the JWS Signing Input
>        ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' ||
>        BASE64URL(JWS Payload)) in the manner defined for the algorithm
>        being used, which MUST be accurately represented by the value of
>        the "alg" (algorithm) Header Parameter, which MUST be present.
>        See Section 10.6 for security considerations on algorithm
>        validation.  Record whether the validation succeeded or not.
>
>    10. If none of the validations in step 9 succeeded, then the JWS MUST
>        be considered invalid."

🇻🇳 **Dịch**
> "8. Kiểm chứng JWS Signature dựa trên JWS Signing Input ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload)) theo cách được định nghĩa cho thuật toán đang dùng — thuật toán này PHẢI được phản ánh chính xác bởi giá trị của Header Parameter "alg", và "alg" PHẢI có mặt. Xem Mục 10.6 về các cân nhắc bảo mật khi kiểm chứng thuật toán. Ghi nhận việc kiểm chứng thành công hay không.
> 10. Nếu không phép kiểm chứng nào ở bước 9 thành công, thì JWS PHẢI bị coi là không hợp lệ."

📖 **Nguyên văn** — RFC 7519 §7.2 (Validating a JWT), câu kết
> "Even if a JWT can be successfully validated, unless the algorithms used in the JWT are acceptable to the application, it SHOULD reject the JWT."

🇻🇳 **Dịch**
> "Ngay cả khi một JWT được kiểm chứng thành công, nếu các thuật toán dùng trong JWT đó không được ứng dụng chấp nhận, ứng dụng NÊN từ chối JWT." (Câu ngay trước đó nói rõ: thuật toán nào được phép dùng là **quyết định của ứng dụng**.)

## C.4. Thuật toán: `HS256` vs `RS256` / `ES256`

📖 **Nguyên văn** — RFC 7518 §3.1, bảng "alg" Header Parameter Values for JWS (trích)
> ```
>    +--------------+-------------------------------+--------------------+
>    | "alg" Param  | Digital Signature or MAC      | Implementation     |
>    | Value        | Algorithm                     | Requirements       |
>    +--------------+-------------------------------+--------------------+
>    | HS256        | HMAC using SHA-256            | Required           |
>    | HS384        | HMAC using SHA-384            | Optional           |
>    | HS512        | HMAC using SHA-512            | Optional           |
>    | RS256        | RSASSA-PKCS1-v1_5 using       | Recommended        |
>    |              | SHA-256                       |                    |
>    | RS384        | RSASSA-PKCS1-v1_5 using       | Optional           |
>    |              | SHA-384                       |                    |
>    | RS512        | RSASSA-PKCS1-v1_5 using       | Optional           |
>    |              | SHA-512                       |                    |
>    | ES256        | ECDSA using P-256 and SHA-256 | Recommended+       |
>    | ES384        | ECDSA using P-384 and SHA-384 | Optional           |
>    | ES512        | ECDSA using P-521 and SHA-512 | Optional           |
>    | PS256        | RSASSA-PSS using SHA-256 and  | Optional           |
>    |              | MGF1 with SHA-256             |                    |
>    | PS384        | RSASSA-PSS using SHA-384 and  | Optional           |
>    |              | MGF1 with SHA-384             |                    |
>    | PS512        | RSASSA-PSS using SHA-512 and  | Optional           |
>    |              | MGF1 with SHA-512             |                    |
>    | none         | No digital signature or MAC   | Optional           |
>    |              | performed                     |                    |
>    +--------------+-------------------------------+--------------------+
> ```

🇻🇳 Bảng các giá trị `alg` hợp lệ cho JWS theo RFC 7518: họ `HS*` là HMAC (đối xứng), `RS*`/`PS*` là RSA, `ES*` là ECDSA (bất đối xứng), và `none` nghĩa là **không ký gì cả**. Cột cuối là mức độ bắt buộc khi triển khai thư viện.

### Khác biệt bản chất: MAC vs chữ ký số

📖 **Nguyên văn** — RFC 7515 §10.5 (Differences between Digital Signatures and MACs)
> "Both signatures and MACs provide for integrity checking -- verifying that the message has not been modified since the integrity value was computed.  However, MACs provide for origination identification only under specific circumstances. ... a MAC key needs to be in the hands of all the entities that use it for integrity computation and checking.  Validation of a MAC only provides corroboration that the message was generated by one of the parties that knows the symmetric MAC key.  This means that origination can only be determined if a MAC key is known only to two entities and the recipient knows that it did not create the message.  MAC validation cannot be used to prove origination to a third party."

🇻🇳 **Dịch**
> "Cả chữ ký số lẫn MAC đều cung cấp khả năng kiểm tra tính toàn vẹn — xác minh rằng thông điệp chưa bị sửa kể từ lúc tính giá trị toàn vẹn. Tuy nhiên, MAC chỉ cho phép xác định nguồn gốc trong những hoàn cảnh nhất định. ... khoá MAC phải nằm trong tay **tất cả** các bên dùng nó để tính và kiểm tính toàn vẹn. Việc kiểm chứng một MAC chỉ chứng thực rằng thông điệp được tạo bởi **một trong những bên biết khoá MAC đối xứng**. Nghĩa là chỉ xác định được nguồn gốc nếu khoá MAC chỉ có đúng hai bên biết và bên nhận biết rằng chính mình không tạo ra thông điệp đó. **Không thể dùng việc kiểm chứng MAC để chứng minh nguồn gốc với bên thứ ba.**"

| | `HS256` (HMAC — đối xứng) | `RS256` / `ES256` (chữ ký số — bất đối xứng) |
|---|---|---|
| Khoá ký | Secret dùng chung | Private key (chỉ issuer giữ) |
| Khoá verify | **Cùng secret đó** | Public key (công khai được) |
| Ai ký được token? | Mọi bên verify được đều ký được | Chỉ bên giữ private key |
| Chứng minh nguồn gốc với bên thứ ba | ❌ Không (RFC 7515 §10.5) | ✅ Có |
| Phân phối khoá cho nhiều bên nhận | Khó — mỗi cặp (issuer, audience) cần secret riêng | Dễ — publish public key / JWKS |
| Hợp khi nào | Issuer và audience là **cùng một hệ thống** | Nhiều service khác nhau cần verify |

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, mục "Public-key Signatures vs. MAC" *(nguồn bên thứ ba)*
> "When using a MAC:
>
> - A different secret must be used for each (issuer, audience) pair. If, for example, the same secret is reused for difference audiences, one audience can forge a token (impersonating the issuer).
> - Secret keys must obviously not be published at a public HTTPS URI. Some solution for secret distribution and rotation must be found."

🇻🇳 **Dịch**
> "Khi dùng MAC:
> - Phải dùng một secret **khác nhau cho mỗi cặp (issuer, audience)**. Ví dụ nếu tái sử dụng cùng một secret cho nhiều audience khác nhau, thì một audience có thể giả mạo token (đóng vai issuer).
> - Hiển nhiên không được publish secret key lên một HTTPS URI công khai. Phải tìm giải pháp phân phối và xoay vòng secret."

📖 **Nguyên văn** — RFC 7518 §3.2 (HMAC with SHA-2) và §3.3 (RSASSA-PKCS1-v1_5), yêu cầu kích thước khoá
> "A key of the same size as the hash output (for instance, 256 bits for "HS256") or larger MUST be used with this algorithm."
>
> "A key of size 2048 bits or larger MUST be used with these algorithms."

🇻🇳 **Dịch**
> "PHẢI dùng với thuật toán này (họ `HS*`) một khoá có kích thước bằng đầu ra hash (ví dụ 256 bit với "HS256") hoặc lớn hơn."
> "PHẢI dùng với các thuật toán này (`RS256`/`RS384`/`RS512`) một khoá có kích thước từ 2048 bit trở lên."

📖 **Nguyên văn** — RFC 8725 §3.5 (Ensure Cryptographic Keys Have Sufficient Entropy)
> "The Key Entropy and Random Values advice in Section 10.1 of [RFC7515] and the Password Considerations in Section 8.8 of [RFC7518] MUST be followed.  In particular, human-memorizable passwords MUST NOT be directly used as the key to a keyed-MAC algorithm such as "HS256"."

🇻🇳 **Dịch**
> "PHẢI tuân thủ khuyến nghị về Key Entropy and Random Values ở Mục 10.1 của [RFC7515] và Password Considerations ở Mục 8.8 của [RFC7518]. Cụ thể, **KHÔNG ĐƯỢC dùng trực tiếp mật khẩu mà con người nhớ được làm khoá cho thuật toán keyed-MAC như "HS256"**."

> [!danger] Secret HS256 không phải là mật khẩu
> `JWT_SECRET=MyApp2026!` là lỗ hổng, không phải cấu hình. RFC 8725 §3.5 cấm thẳng. Lý do ở §2.2 ngay dưới đây: token bị lộ ra ngoài là attacker brute-force offline được, không giới hạn số lần thử, không ai biết.

📖 **Nguyên văn** — RFC 8725 §2.2 (Weak Symmetric Keys)
> "In addition, some applications use a keyed Message Authentication Code (MAC) algorithm, such as "HS256", to sign tokens but supply a weak symmetric key with insufficient entropy (such as a human-memorable password).  Such keys are vulnerable to offline brute-force or dictionary attacks once an attacker gets hold of such a token [Langkemper]."

🇻🇳 **Dịch**
> "Thêm vào đó, một số ứng dụng dùng thuật toán keyed Message Authentication Code (MAC) như "HS256" để ký token nhưng lại cấp một khoá đối xứng yếu, không đủ entropy (chẳng hạn một mật khẩu con người nhớ được). Những khoá như vậy dễ bị tấn công brute-force hoặc dictionary **offline** một khi attacker có được một token như thế."

## C.5. 🔴 Tấn công `alg: none`

Đây là lỗ hổng kinh điển nhất của JWT. Gốc rễ: `alg` nằm trong header, mà **header do attacker kiểm soát hoàn toàn** — nó chỉ là base64url của JSON, ai cũng sửa được. Nếu thư viện verify "ngoan ngoãn làm theo `alg` mà token khai báo", thì attacker chỉ cần khai `"alg":"none"`, xoá chữ ký, và token giả được chấp nhận.

📖 **Nguyên văn** — RFC 8725 §2.1 (Weak Signatures and Insufficient Signature Validation)
> "Signed JSON Web Tokens carry an explicit indication of the signing algorithm, in the form of the "alg" Header Parameter, to facilitate cryptographic agility.  This, in conjunction with design flaws in some libraries and applications, has led to several attacks:
>
>    *  The algorithm can be changed to "none" by an attacker, and some
>       libraries would trust this value and "validate" the JWT without
>       checking any signature.
>
>    *  An "RS256" (RSA, 2048 bit) parameter value can be changed into
>       "HS256" (HMAC, SHA-256), and some libraries would try to validate
>       the signature using HMAC-SHA256 and using the RSA public key as
>       the HMAC shared secret (see [McLean] and [CVE-2015-9235])."

🇻🇳 **Dịch**
> "JWT đã ký mang theo chỉ dẫn tường minh về thuật toán ký, dưới dạng Header Parameter "alg", nhằm tạo thuận lợi cho tính linh hoạt mật mã (cryptographic agility). Điều này, kết hợp với các lỗi thiết kế trong một số thư viện và ứng dụng, đã dẫn tới nhiều tấn công:
> - **Thuật toán có thể bị attacker đổi thành "none", và một số thư viện sẽ tin giá trị này rồi "kiểm chứng" JWT mà không kiểm tra chữ ký nào cả.**
> - **Một giá trị tham số "RS256" (RSA, 2048 bit) có thể bị đổi thành "HS256" (HMAC, SHA-256), và một số thư viện sẽ thử kiểm chứng chữ ký bằng HMAC-SHA256, dùng chính RSA public key làm shared secret của HMAC** (xem [McLean] và [CVE-2015-9235])."

> [!danger] Biện pháp bắt buộc: ứng dụng phải tự quyết định thuật toán TRƯỚC, không hỏi token
> RFC 8725 §3.1 là câu trả lời chính thức cho cả hai tấn công trên.

📖 **Nguyên văn** — RFC 8725 §3.1 (Perform Algorithm Verification)
> "Libraries MUST enable the caller to specify a supported set of algorithms and MUST NOT use any other algorithms when performing cryptographic operations.  The library MUST ensure that the "alg" or "enc" header specifies the same algorithm that is used for the cryptographic operation.  Moreover, each key MUST be used with exactly one algorithm, and this MUST be checked when the cryptographic operation is performed."

🇻🇳 **Dịch**
> "Các thư viện **PHẢI** cho phép bên gọi chỉ định một **tập thuật toán được hỗ trợ**, và **KHÔNG ĐƯỢC** dùng bất kỳ thuật toán nào khác khi thực hiện các phép toán mật mã. Thư viện PHẢI đảm bảo rằng header "alg" hoặc "enc" chỉ định **đúng** thuật toán được dùng cho phép toán mật mã. Hơn nữa, **mỗi khoá PHẢI được dùng với đúng một thuật toán**, và điều này PHẢI được kiểm tra khi thực hiện phép toán mật mã."

📖 **Nguyên văn** — RFC 8725 §3.2 (Use Appropriate Algorithms), về `none`
> "That said, if a JWT is cryptographically protected end-to-end by a transport layer, such as TLS using cryptographically current algorithms, there may be no need to apply another layer of cryptographic protections to the JWT.  In such cases, the use of the "none" algorithm can be perfectly acceptable.  The "none" algorithm should only be used when the JWT is cryptographically protected by other means. ... JWT libraries SHOULD NOT generate JWTs using "none" unless explicitly requested to do so by the caller.  Similarly, JWT libraries SHOULD NOT consume JWTs using "none" unless explicitly requested by the caller."

🇻🇳 **Dịch**
> "Dù vậy, nếu một JWT đã được bảo vệ bằng mật mã end-to-end ở tầng transport — ví dụ TLS với các thuật toán hiện hành — thì có thể không cần thêm một lớp bảo vệ mật mã nữa cho JWT. Trong những trường hợp như vậy, dùng thuật toán "none" hoàn toàn có thể chấp nhận được. **Thuật toán "none" chỉ nên được dùng khi JWT đã được bảo vệ bằng mật mã theo cách khác.** ... **Thư viện JWT KHÔNG NÊN sinh ra JWT dùng "none" trừ khi bên gọi yêu cầu tường minh. Tương tự, thư viện JWT KHÔNG NÊN tiêu thụ JWT dùng "none" trừ khi bên gọi yêu cầu tường minh.**"

📖 **Nguyên văn** — RFC 7518 §3.6 (Using the Algorithm "none")
> "Implementations that support Unsecured JWSs MUST NOT accept such objects as valid unless the application specifies that it is acceptable for a specific object to not be integrity protected.  Implementations MUST NOT accept Unsecured JWSs by default."

🇻🇳 **Dịch**
> "Các phần triển khai hỗ trợ Unsecured JWS **KHÔNG ĐƯỢC** chấp nhận những object như vậy là hợp lệ, trừ khi ứng dụng chỉ định rõ rằng một object cụ thể được phép không có bảo vệ toàn vẹn. **Các phần triển khai KHÔNG ĐƯỢC chấp nhận Unsecured JWS theo mặc định.**"

📖 **Nguyên văn** — RFC 7519 §6 (Unsecured JWTs) + §6.1, token ví dụ
> "An Unsecured JWT is a JWS using the "alg" Header Parameter value "none" and with the empty string for its JWS Signature value, as defined in the JWA specification [JWA]; it is an Unsecured JWS with the JWT Claims Set as its JWS Payload."
>
> "The encoded JWS Signature is the empty string."

🇻🇳 **Dịch**
> "Một Unsecured JWT là một JWS dùng giá trị Header Parameter "alg" bằng "none" và có JWS Signature là chuỗi rỗng, như định nghĩa trong spec JWA; nó là một Unsecured JWS với JWT Claims Set làm JWS Payload của nó."
> "JWS Signature đã encode là chuỗi rỗng."

Nghĩa là token tấn công có dạng `eyJhbGciOiJub25lIn0.<payload tự chế>.` — phần sau dấu chấm cuối **rỗng**. Không cần biết secret, không cần phá mã gì hết.

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, mục "Unsecured JWTs" *(nguồn bên thứ ba)*
> "Some JWT libraries, used to accept unsecured JWTs by default ("alg":"none"). In this case, an attacker would be able to forge their own JWTs: depending on the application, they might be able to impersonate arbitrary users, obtains arbitrary authorizations, etc.
> This issue should now be fixed in JWT libraries.
> Mitigation:
>
> - Make sure that `"alg":"none"` is not accepted by your JWT parser. It should be disabled by default by recent implementations."

🇻🇳 **Dịch**
> "Một số thư viện JWT trước đây chấp nhận unsecured JWT theo mặc định (`"alg":"none"`). Trong trường hợp đó, attacker có thể tự chế JWT của riêng mình: tuỳ ứng dụng, họ có thể mạo danh người dùng bất kỳ, giành quyền bất kỳ, v.v.
> Vấn đề này hiện đã được vá trong các thư viện JWT.
> Giảm thiểu: đảm bảo `"alg":"none"` không được JWT parser của bạn chấp nhận. Các bản triển khai gần đây nên tắt sẵn theo mặc định."

## C.6. 🔴 Tấn công nhầm lẫn thuật toán (algorithm / key confusion)

Kịch bản: hệ thống ký bằng `RS256` và **công khai public key** (đúng như thiết kế bất đối xứng). Attacker lấy public key đó, tự chế payload, ký bằng `HS256` **coi chuỗi byte của public key làm secret HMAC**, rồi đổi header thành `"alg":"HS256"`. Nếu bên verify chỉ làm "lấy khoá đã cấu hình + chạy thuật toán mà token khai báo", HMAC sẽ khớp — vì attacker dùng đúng thứ mà server dùng để verify.

Nguyên văn RFC 8725 §2.1 mô tả chính tấn công này đã trích ở C.5 (gạch đầu dòng thứ hai). Biện pháp cũng là RFC 8725 §3.1: **cố định tập thuật toán, và mỗi khoá chỉ dùng với đúng một thuật toán**.

📖 **Nguyên văn** — RFC 8725 §3.1 (nhắc lại phần then chốt)
> "Moreover, each key MUST be used with exactly one algorithm, and this MUST be checked when the cryptographic operation is performed."

🇻🇳 **Dịch**
> "Hơn nữa, mỗi khoá PHẢI được dùng với **đúng một** thuật toán, và điều này PHẢI được kiểm tra khi thực hiện phép toán mật mã."

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, mục "Key type confusion" *(nguồn bên thứ ba)*
> "Some JWT implementations would accept to use a public key intended for public-key digital signature as if it was a secret key used for MAC verification. In this context, an attacker could forge a MAC-based JWT by using the public key of the real issuer as if it was a secret key.
> This threat is also called "key confusion" or "algorithm confusion"."
>
> "- chose the key depending on the requested signature algorithm or validate that the key used for validation is consistent with the signature algorithm;
> - if possible, hardcode the accepted algorithms and do not mix public-key digital signatures algorithms and MAC algorithms."

🇻🇳 **Dịch**
> "Một số bản triển khai JWT chấp nhận dùng một public key vốn dành cho chữ ký số bất đối xứng **như thể nó là secret key dùng để kiểm chứng MAC**. Trong bối cảnh đó, attacker có thể giả mạo một JWT dựa trên MAC bằng cách dùng public key của issuer thật như thể đó là secret key. Mối đe doạ này còn gọi là "key confusion" hoặc "algorithm confusion"."
> Cách giảm thiểu lúc kiểm chứng: "chọn khoá tuỳ theo thuật toán chữ ký được yêu cầu, hoặc kiểm tra rằng khoá dùng để verify là nhất quán với thuật toán chữ ký; **nếu được, hardcode danh sách thuật toán chấp nhận và không trộn lẫn thuật toán chữ ký số bất đối xứng với thuật toán MAC.**"

## C.7. Đừng tin khoá do chính token chỉ ra

Một biến thể cùng họ: header JWT có thể chứa `jwk` (khoá nhúng thẳng), `jku` / `x5u` (URL trỏ tới khoá), `kid` (chọn khoá theo ID). Tất cả đều là **đầu vào chưa được xác thực do attacker kiểm soát**.

📖 **Nguyên văn** — RFC 8725 §3.10 (Do Not Trust Received Claims)
> "The "kid" (key ID) header is used by the relying application to perform key lookup.  Applications should ensure that this does not create SQL or LDAP injection vulnerabilities by validating and/or sanitizing the received value.
>
>    Similarly, blindly following a "jku" (JWK set URL) or "x5u" (X.509 URL) header, which may contain an arbitrary URL, could result in server-side request forgery (SSRF) attacks."

🇻🇳 **Dịch**
> "Header "kid" (key ID) được ứng dụng dùng để tra cứu khoá. Ứng dụng nên đảm bảo việc này không tạo ra lỗ hổng SQL hay LDAP injection, bằng cách validate và/hoặc sanitize giá trị nhận được.
> Tương tự, đi theo một cách mù quáng header "jku" (JWK set URL) hoặc "x5u" (X.509 URL) — vốn có thể chứa một URL tuỳ ý — có thể dẫn tới tấn công server-side request forgery (SSRF)."

> [!note] Liên hệ bài SQL Injection
> `kid` đi thẳng vào câu truy vấn tra khoá là đúng mẫu lỗi đã học ở [[13 - SQL Injection và Parameterized Query]] — dữ liệu do client kiểm soát được ghép thẳng vào query.

## C.8. JWS vs JWE — phân biệt

RFC 7519 cho phép JWT được biểu diễn bằng JWS (ký) **hoặc** JWE (mã hoá). Hầu hết những gì người ta gọi là "JWT" trong thực tế đều là JWS.

📖 **Nguyên văn** — RFC 7516 §1 (Introduction) và §3.1 (JWE Compact Serialization Overview)
> "JSON Web Encryption (JWE) represents encrypted content using JSON-based data structures [RFC7159].  The JWE cryptographic mechanisms encrypt and provide integrity protection for an arbitrary sequence of octets."
>
> "In the JWE Compact Serialization, a JWE is represented as the concatenation:
>
>       BASE64URL(UTF8(JWE Protected Header)) || '.' ||
>       BASE64URL(JWE Encrypted Key) || '.' ||
>       BASE64URL(JWE Initialization Vector) || '.' ||"

🇻🇳 **Dịch**
> "JSON Web Encryption (JWE) biểu diễn **nội dung đã được mã hoá** bằng các cấu trúc dữ liệu dựa trên JSON. Các cơ chế mật mã của JWE mã hoá và cung cấp bảo vệ toàn vẹn cho một dãy octet tuỳ ý." Ở dạng compact, JWE là phép nối của (trích 3 phần đầu ở trên, cộng JWE Ciphertext và JWE Authentication Tag) — tổng cộng **5 phần**, khác hẳn 3 phần của JWS.

| | JWS (ký) | JWE (mã hoá) |
|---|---|---|
| Số phần trong compact form | 3 | 5 |
| Payload đọc được không? | **Có** — base64url thuần | Không — ciphertext |
| Bảo vệ gì | Toàn vẹn + nguồn gốc | Bí mật + toàn vẹn |
| Dùng khi | Mặc định cho access token / ID token | Claims có nội dung nhạy cảm cần giấu |

---

# PHẦN D — Dùng JWT đúng cách (RFC 8725)

## D.0. Vì sao có RFC 8725

📖 **Nguyên văn** — RFC 8725 §1 (Introduction)
> "Since the JWT specification was published, there have been several widely published attacks on implementations and deployments.  Such attacks are the result of under-specified security mechanisms, as well as incomplete implementations and incorrect usage by applications.
>
>    The goal of this document is to facilitate secure implementation and deployment of JWTs."

🇻🇳 **Dịch**
> "Kể từ khi spec JWT được công bố, đã có nhiều tấn công được công bố rộng rãi nhắm vào các bản triển khai và triển khai vận hành. Những tấn công đó là hệ quả của các **cơ chế bảo mật bị đặc tả thiếu**, cũng như các bản triển khai không đầy đủ và việc **dùng sai từ phía ứng dụng**.
> Mục tiêu của tài liệu này là tạo thuận lợi cho việc triển khai và vận hành JWT một cách an toàn."

RFC 8725 tự mô tả mình là *"minimum recommendations"* và *"a floor, not a ceiling"* (§1) — 🇻🇳 khuyến nghị **tối thiểu**, là **sàn chứ không phải trần**; làm chặt hơn luôn được phép.

## D.1. Luôn validate `iss`, `sub`, `aud`, `exp`

📖 **Nguyên văn** — RFC 8725 §3.8 (Validate Issuer and Subject)
> "When a JWT contains an "iss" (issuer) claim, the application MUST validate that the cryptographic keys used for the cryptographic operations in the JWT belong to the issuer.  If they do not, the application MUST reject the JWT.
>
>    ... Similarly, when the JWT contains a "sub" (subject) claim, the application MUST validate that the subject value corresponds to a valid subject and/or issuer-subject pair at the application.  This may include confirming that the issuer is trusted by the application.  If the issuer, subject, or the pair are invalid, the application MUST reject the JWT."

🇻🇳 **Dịch**
> "Khi một JWT chứa claim "iss" (issuer), ứng dụng **PHẢI** kiểm chứng rằng các khoá mật mã dùng cho các phép toán mật mã trong JWT đó **thuộc về issuer**. Nếu không, ứng dụng PHẢI từ chối JWT.
> ... Tương tự, khi JWT chứa claim "sub" (subject), ứng dụng PHẢI kiểm chứng rằng giá trị subject tương ứng với một subject hợp lệ và/hoặc **cặp issuer-subject** hợp lệ tại ứng dụng. Việc này có thể bao gồm xác nhận rằng issuer được ứng dụng tin cậy. Nếu issuer, subject, hoặc cặp đó không hợp lệ, ứng dụng PHẢI từ chối JWT."

📖 **Nguyên văn** — RFC 8725 §3.9 (Use and Validate Audience)
> "If the same issuer can issue JWTs that are intended for use by more than one relying party or application, the JWT MUST contain an "aud" (audience) claim that can be used to determine whether the JWT is being used by an intended party or was substituted by an attacker at an unintended party.
>
>    In such cases, the relying party or application MUST validate the audience value, and if the audience value is not present or not associated with the recipient, it MUST reject the JWT."

🇻🇳 **Dịch**
> "Nếu cùng một issuer có thể phát hành các JWT dành cho nhiều relying party hoặc nhiều ứng dụng khác nhau, thì JWT **PHẢI** chứa claim "aud" (audience) để có thể xác định JWT đang được dùng bởi bên dự kiến hay đã bị attacker mang sang một bên không dự kiến.
> Trong những trường hợp đó, relying party hoặc ứng dụng **PHẢI** kiểm chứng giá trị audience, và nếu giá trị audience không có mặt hoặc không liên quan tới bên nhận, thì **PHẢI** từ chối JWT."

Đây là biện pháp chống **substitution attack**:

📖 **Nguyên văn** — RFC 8725 §2.7 (Substitution Attacks)
> "There are attacks in which one recipient will be given a JWT that was intended for it and will attempt to use it at a different recipient for which that JWT was not intended."

🇻🇳 **Dịch**
> "Có những tấn công trong đó một bên nhận được cấp một JWT dành đúng cho mình, rồi tìm cách dùng nó tại một bên nhận khác mà JWT đó không dành cho."

Với `exp`, yêu cầu MUST nằm ở chính RFC 7519 §4.1.4 (đã trích ở B.2): *"the current date/time MUST be before the expiration date/time listed in the "exp" claim"*.

> [!warning] Decode ≠ verify
> Trong hầu hết thư viện, có một hàm "decode" chỉ tách và base64url-decode (không kiểm gì), và một hàm "verify" kiểm chữ ký + claims. Gọi nhầm hàm đầu tiên rồi tin kết quả là bỏ trắng toàn bộ bảo mật của JWT. Kiểm tra kỹ hàm mình đang gọi làm gì.

## D.2. Cố định tập thuật toán, thiết kế để đổi được thuật toán

📖 **Nguyên văn** — RFC 8725 §3.2 (Use Appropriate Algorithms)
> "Therefore, applications MUST only allow the use of cryptographically current algorithms that meet the security requirements of the application. ... Applications MUST therefore be designed to enable cryptographic agility."

🇻🇳 **Dịch**
> "Do đó, ứng dụng **CHỈ ĐƯỢC** cho phép dùng những thuật toán mật mã còn hiện hành, đáp ứng yêu cầu bảo mật của ứng dụng. ... Vì vậy ứng dụng PHẢI được thiết kế để hỗ trợ **cryptographic agility** (đổi thuật toán được)."

## D.3. Kiểm mọi phép toán mật mã, không bỏ sót lớp nào

📖 **Nguyên văn** — RFC 8725 §3.3 (Validate All Cryptographic Operations)
> "All cryptographic operations used in the JWT MUST be validated and the entire JWT MUST be rejected if any of them fail to validate."

🇻🇳 **Dịch**
> "**Mọi** phép toán mật mã dùng trong JWT PHẢI được kiểm chứng, và **toàn bộ** JWT PHẢI bị từ chối nếu bất kỳ phép nào trong số đó kiểm chứng thất bại."

Lý do có khuyến nghị này (RFC 8725 §2.3): *"Some libraries that decrypt a JWE-encrypted JWT to obtain a JWS-signed object do not always validate the internal signature."* — giải mã xong lớp ngoài rồi quên verify chữ ký lớp trong.

## D.4. Gắn nhãn loại token — chống Cross-JWT Confusion

📖 **Nguyên văn** — RFC 8725 §2.8 (Cross-JWT Confusion)
> "If the JWT could be used in an application context in which it could be confused with other kinds of JWTs, then mitigations MUST be employed to prevent these substitution attacks."

🇻🇳 **Dịch**
> "Nếu JWT có thể được dùng trong một ngữ cảnh ứng dụng mà nó có thể bị nhầm với các loại JWT khác, thì **PHẢI** áp dụng biện pháp giảm thiểu để ngăn những substitution attack này."

📖 **Nguyên văn** — RFC 8725 §3.11 (Use Explicit Typing) và §3.12 (Use Mutually Exclusive Validation Rules)
> "If a particular kind of JWT is subject to such confusion, that JWT can include an explicit JWT type value, and the validation rules can specify checking the type. ... Explicit JWT typing is accomplished by using the "typ" Header Parameter. ... Explicit typing is RECOMMENDED for new uses of JWTs."
>
> "If more than one kind of JWT can be issued by the same issuer, the validation rules for those JWTs MUST be written such that they are mutually exclusive, rejecting JWTs of the wrong kind."

🇻🇳 **Dịch**
> "Nếu một loại JWT cụ thể có nguy cơ bị nhầm như vậy, JWT đó có thể chứa một giá trị kiểu JWT tường minh, và các quy tắc kiểm chứng có thể quy định việc kiểm tra kiểu này. ... Việc gắn kiểu tường minh cho JWT được thực hiện bằng Header Parameter "typ". ... **Gắn kiểu tường minh được KHUYẾN NGHỊ cho các cách dùng JWT mới.**"
> "Nếu **cùng một issuer** có thể phát hành **nhiều loại JWT**, thì các quy tắc kiểm chứng cho những JWT đó PHẢI được viết sao cho **loại trừ lẫn nhau**, tức là từ chối JWT sai loại."

> [!warning] Hệ quả rất thực tế
> Nếu access token và refresh token của bạn là hai JWT do cùng một issuer ký bằng cùng một khoá, và endpoint kiểm token không phân biệt loại, thì refresh token dùng được như access token (và ngược lại). RFC 8725 §3.12 gợi ý các cách phân tách: khác `typ`, khác tập claim bắt buộc, khác khoá, khác `aud`, khác `iss`.

## D.5. 🔴 JWT KHÔNG thu hồi được

Đây là điểm mà JWT khác hẳn session phía server ở [[12 - Cookie và Session based Authentication]]. Với session, server giữ trạng thái — xoá bản ghi session là phiên chết ngay lập tức. Với JWT đã ký, server **không giữ gì cả**: token tự chứng minh tính hợp lệ của nó bằng chữ ký và `exp`.

RFC 7519 không định nghĩa bất kỳ cơ chế thu hồi nào. Cơ chế duy nhất khiến token ngừng hợp lệ là `exp` (RFC 7519 §4.1.4). Muốn thu hồi sớm hơn, bạn phải **thêm trạng thái ở phía server** — và khi đó tính stateless không còn nữa.

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, mục "Not using JWTs" *(nguồn bên thứ ba)*
> "Before using JWTs to solve your problems, you should consider if they are really necessary for your use case.
> JWTs are often suggested for "stateless" user sessions. However, if you use JWTs for user sessions, you will need a solution for managing session invalidation. This can be achieved using a deny list of revoked sessions/tokens. If your application implements such a deny list, user sessions won't be completely stateless anymore which might defeat the benefits of stateless sessions. You might want to consider using a plain session system and follow the advices from the dedicated session management cheat sheet."

🇻🇳 **Dịch**
> "Trước khi dùng JWT để giải quyết vấn đề của bạn, hãy cân nhắc xem nó có thực sự cần thiết cho trường hợp của bạn không.
> JWT thường được đề xuất cho phiên người dùng "stateless". Tuy nhiên, **nếu bạn dùng JWT cho phiên người dùng, bạn sẽ cần một giải pháp để quản lý việc vô hiệu hoá phiên**. Việc này có thể làm bằng một deny list các phiên/token đã bị thu hồi. Nếu ứng dụng của bạn triển khai deny list như vậy, **phiên người dùng sẽ không còn hoàn toàn stateless nữa, và điều đó có thể triệt tiêu chính lợi ích của phiên stateless**. Bạn có lẽ nên cân nhắc dùng một hệ session thông thường và làm theo lời khuyên ở cheat sheet về quản lý session."

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, mục "JWT denylist" *(nguồn bên thứ ba)*
> "Warning: Using the raw JWT or a secure hash of the JWT (SHA-256(token)) as the denylist key is not safe and might expose the application to denylist bypass through JWT malleability."

🇻🇳 **Dịch**
> "Cảnh báo: Dùng chính chuỗi JWT thô hoặc hash an toàn của JWT (SHA-256(token)) làm khoá của denylist là **không an toàn** và có thể khiến ứng dụng bị bypass denylist thông qua tính malleability của JWT."

OWASP khuyến nghị đánh khoá denylist theo cặp `(jti, iss)` thay vì theo chuỗi token — khớp với vai trò chống replay của `jti` ở RFC 7519 §4.1.7.

📖 **Nguyên văn** — OWASP JSON Web Token Cheat Sheet, các giải pháp thay cho denylist *(nguồn bên thứ ba)*
> "Before implementing such a JWT denylist, you should consider whether there is a better solution for your problem:
>
> - Token Status List is a scalable solution for revocation of the JWT by the issuer.
> - Token reuse can be mitigated by using short expiration time in the JWT.
> - The risk of token exfiltration can be mitigated by using sender constrained JWT (such a DPoP or TLS-bound JWT)."

🇻🇳 **Dịch**
> "Trước khi triển khai một denylist JWT như vậy, bạn nên cân nhắc liệu có giải pháp tốt hơn cho vấn đề của mình không:
> - **Token Status List** là một giải pháp có khả năng mở rộng để issuer thu hồi JWT.
> - **Việc tái sử dụng token có thể được giảm thiểu bằng thời gian hết hạn ngắn trong JWT.**
> - Rủi ro token bị đánh cắp có thể được giảm thiểu bằng JWT ràng buộc người gửi (sender constrained JWT), chẳng hạn DPoP hoặc JWT gắn với TLS."

📖 **Nguyên văn** — RFC 7515 §10.10 (Replay Protection)
> "applications using JWS (or JWE) objects can thwart replay attacks by including a unique message identifier as integrity-protected content in the JWS (or JWE) message and having the recipient verify that the message has not been previously received or acted upon."

🇻🇳 **Dịch**
> "các ứng dụng dùng object JWS (hoặc JWE) có thể chặn tấn công replay bằng cách đưa một định danh thông điệp duy nhất vào nội dung được bảo vệ toàn vẹn của thông điệp JWS (hoặc JWE), và yêu cầu bên nhận kiểm chứng rằng thông điệp đó chưa từng được nhận hay xử lý trước đó."

💡 **Ví dụ đời sống**
Vé xem phim đã in và đã phát ra tay khách thì rạp **không thu hồi được từ xa**. Muốn chặn một tấm vé cụ thể, rạp phải phát cho mọi nhân viên soát vé một **danh sách mã vé cấm** và bắt họ tra danh sách đó mỗi lần soát — nghĩa là rạp lại phải duy trì và đồng bộ một trạng thái tập trung, đúng thứ mà "vé tự chứng minh" ban đầu định né. Hoặc rạp in vé **hết hạn sau 15 phút** để thiệt hại nếu mất vé là nhỏ.

## D.6. Access token ngắn hạn + refresh token

> [!note] Mức độ chắc chắn của phần này
> RFC 7519/7515/7518 **không** định nghĩa refresh token. RFC 8725 §1 chỉ nhắc tới việc JWT được dùng làm access token và refresh token của OAuth 2.0. Phần dưới đây trích đúng những gì nguồn nói; chi tiết luồng refresh thuộc về OAuth 2.0, không thuộc JWT.

📖 **Nguyên văn** — RFC 8725 §1 (Introduction)
> "One application area in which JWTs are commonly used is representing digital identity information, such as OpenID Connect ID Tokens [OpenID.Core] and OAuth 2.0 [RFC6749] access tokens and refresh tokens, the details of which are deployment-specific."

🇻🇳 **Dịch**
> "Một lĩnh vực ứng dụng mà JWT thường được dùng là biểu diễn thông tin danh tính số, chẳng hạn ID Token của OpenID Connect và access token cùng refresh token của OAuth 2.0 — **chi tiết của chúng tuỳ theo từng triển khai**."

Khuyến nghị "dùng thời hạn ngắn" thì có nguồn rõ ràng — OWASP JWT Cheat Sheet, đã trích ở D.5: *"Token reuse can be mitigated by using short expiration time in the JWT."*

## D.7. Lưu JWT ở đâu phía client

> [!note] Mức độ chắc chắn của phần này
> Không RFC nào trong bộ JOSE quy định chỗ lưu token phía trình duyệt. Trích dưới đây là từ OWASP HTML5 Security Cheat Sheet (nguồn bên thứ ba, nói về local storage nói chung chứ không riêng JWT). Việc áp dụng cho JWT là suy luận, xin ghi rõ.

📖 **Nguyên văn** — OWASP HTML5 Security Cheat Sheet, mục "Local Storage" *(nguồn bên thứ ba)*
> "A single Cross Site Scripting can be used to steal all the data in these objects, so again it's recommended not to store sensitive information in local storage.
> A single Cross Site Scripting can be used to load malicious data into these objects too, so don't consider objects in these to be trusted."

🇻🇳 **Dịch**
> "**Chỉ cần một lỗ hổng Cross Site Scripting là đủ để đánh cắp toàn bộ dữ liệu trong các object này**, nên xin nhắc lại là không nên lưu thông tin nhạy cảm trong local storage.
> Chỉ cần một lỗ hổng Cross Site Scripting cũng đủ để nạp dữ liệu độc hại vào các object này, nên đừng coi các object trong đó là đáng tin cậy."

📖 **Nguyên văn** — OWASP HTML5 Security Cheat Sheet, mục "Local Storage" *(nguồn bên thứ ba)*
> "Do not store session identifiers in local storage as the data is always accessible by JavaScript. Cookies can mitigate this risk using the httpOnly flag."

🇻🇳 **Dịch**
> "**Không lưu session identifier trong local storage** vì dữ liệu ở đó luôn luôn truy cập được bằng JavaScript. Cookie có thể giảm thiểu rủi ro này nhờ cờ `httpOnly`."

> [!warning] Nhận định (không phải trích spec)
> Một JWT dùng làm access token có vai trò thực tế giống hệt session identifier: ai cầm được nó thì hành động được thay mặt người dùng. Theo lập luận đó, khuyến nghị "không lưu session identifier trong localStorage" áp dụng tương đương cho JWT. Đổi lại, cookie `HttpOnly` mở ra bề mặt tấn công CSRF, cần xử lý riêng (xem [[12 - Cookie và Session based Authentication]]). Không có lựa chọn nào miễn phí — đây là đánh đổi, không phải "cái này đúng cái kia sai".

## D.8. Bảng tổng kết: JWT giải quyết gì, KHÔNG giải quyết gì

| JWT (JWS) **giải quyết** | Căn cứ |
|---|---|
| Định dạng token gọn, an toàn cho URL và HTTP header | RFC 7519 §1 |
| Chống sửa đổi nội dung token (toàn vẹn) | RFC 7515 §3, §5.2 |
| Bên nhận verify token **không cần gọi lại issuer** (với khoá bất đối xứng) | RFC 7515 §10.5 |
| Bộ claim chuẩn, liên thông giữa các hệ thống | RFC 7519 §4.1 |
| Mốc hết hạn tự mang theo (`exp`, `nbf`) | RFC 7519 §4.1.4–4.1.5 |
| Xác định nguồn gốc chứng minh được với bên thứ ba (chỉ khi dùng chữ ký số) | RFC 7515 §10.5 |

| JWT (JWS) **KHÔNG giải quyết** | Căn cứ |
|---|---|
| Giữ bí mật nội dung payload | RFC 7519 §12 — cần JWE hoặc bỏ hẳn dữ liệu nhạy cảm |
| Thu hồi token trước khi hết hạn | RFC 7519 không định nghĩa cơ chế thu hồi; OWASP: cần denylist / Token Status List |
| Luồng đăng nhập, cấp phát token | Ngoài phạm vi RFC 7519 §4 |
| Ngăn token bị đánh cắp rồi dùng lại | RFC 7515 §10.10 — cần `jti` + kiểm phía nhận, hoặc sender-constrained token |
| Xác định nguồn gốc khi dùng HMAC | RFC 7515 §10.5 — "MAC validation cannot be used to prove origination to a third party" |
| Bảo vệ nếu bên verify không cố định thuật toán | RFC 8725 §2.1, §3.1 |

## D.9. Checklist triển khai (mọi dòng đều dẫn nguồn)

- [ ] Cố định danh sách `alg` chấp nhận ở phía ứng dụng; không đọc `alg` từ token để chọn thuật toán — RFC 8725 §3.1
- [ ] Từ chối `alg: none` theo mặc định — RFC 7518 §3.6, RFC 8725 §3.2
- [ ] Không trộn thuật toán MAC và chữ ký số trên cùng một khoá — RFC 8725 §3.1
- [ ] Secret HS256 ≥ 256 bit, sinh ngẫu nhiên bằng nguồn mật mã, **không phải mật khẩu** — RFC 7518 §3.2, RFC 8725 §3.5
- [ ] Khoá RSA ≥ 2048 bit — RFC 7518 §3.3
- [ ] Kiểm `exp` (và `nbf` nếu có), cho dung sai clock skew tối đa vài phút — RFC 7519 §4.1.4–4.1.5
- [ ] Kiểm `iss` và ràng khoá verify với issuer đó — RFC 8725 §3.8
- [ ] Kiểm `aud` khớp với chính mình; thiếu `aud` hoặc không khớp thì từ chối — RFC 7519 §4.1.3, RFC 8725 §3.9
- [ ] Tra user theo cặp `(iss, sub)`, không chỉ `sub` — RFC 7519 §4.1.2, RFC 8725 §3.8
- [ ] Gắn `typ` tường minh cho loại JWT mới; viết quy tắc kiểm loại trừ lẫn nhau giữa các loại token — RFC 8725 §3.11, §3.12
- [ ] Validate/sanitize `kid`; không đi theo `jku`/`x5u` tuỳ tiện — RFC 8725 §3.10
- [ ] Không đặt dữ liệu nhạy cảm vào payload — RFC 7519 §12
- [ ] Truyền token qua TLS — RFC 7519 §12
- [ ] Nếu cần thu hồi: đánh khoá denylist theo `(jti, iss)`, không theo hash của chuỗi token — OWASP JWT Cheat Sheet
- [ ] Đặt `exp` ngắn để giảm thiệt hại khi token bị lộ — OWASP JWT Cheat Sheet

---

## Liên kết

- Bài trước: [[13 - Token Authentication và Bearer Token]]
- Bài kế: [[15 - OAuth 2.0]]
- [[12 - Cookie và Session based Authentication]] — đối cực của JWT: trạng thái ở server, thu hồi được ngay; cũng là nơi bàn cookie `HttpOnly` và CSRF
- [[13 - Token Authentication và Bearer Token]] — JWT thường được mang đi dưới dạng bearer token; "ai cầm token thì dùng được" là tiền đề cho toàn bộ phần D.5 và D.7
- [[02 - REST]] — ràng buộc stateless; JWT hấp dẫn chính vì hứa hẹn stateless, và mất sức hấp dẫn đó ngay khi cần denylist
- [[04 - HTTP Status Code và thiết kế lỗi]] — JWT hỏng/hết hạn trả 401, JWT hợp lệ nhưng thiếu quyền trả 403
- [[08 - OpenAPI Specification]] — Security Scheme Object mô tả `bearerFormat: JWT` trong tài liệu API
- [[09 - So sánh API Styles và REST Security]] — bối cảnh chung về bảo mật API
- [[13 - SQL Injection và Parameterized Query]] — `kid` từ header JWT đi vào truy vấn tra khoá là cùng một lớp lỗi
- [[01 - API là gì và nền tảng HTTP]] — JWT được truyền trong `Authorization` header
- [[02 - What is HTTP]] — nền tảng HTTP header

## Nguồn tham khảo

- RFC 7519 — JSON Web Token (JWT) : https://www.rfc-editor.org/rfc/rfc7519.txt
- RFC 7515 — JSON Web Signature (JWS) : https://www.rfc-editor.org/rfc/rfc7515.txt
- RFC 7516 — JSON Web Encryption (JWE) : https://www.rfc-editor.org/rfc/rfc7516.txt
- RFC 7518 — JSON Web Algorithms (JWA) : https://www.rfc-editor.org/rfc/rfc7518.txt
- RFC 8725 (BCP 225) — JSON Web Token Best Current Practices : https://www.rfc-editor.org/rfc/rfc8725.txt
- OWASP Cheat Sheet Series — JSON Web Token Cheat Sheet *(nguồn bên thứ ba)* : https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html
- OWASP Cheat Sheet Series — HTML5 Security Cheat Sheet *(nguồn bên thứ ba)* : https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
