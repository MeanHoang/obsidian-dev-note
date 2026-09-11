# 16 — OpenID Connect

> **Nguồn chính:** OpenID Connect Core 1.0 incorporating errata set 2 (December 15, 2023) — https://openid.net/specs/openid-connect-core-1_0.html
> Bài này bám các mục: 1.2 Terminology · 1.3 Overview · 2 ID Token · 3 Authentication (3.1 Code Flow, 3.2 Implicit Flow, 3.3 Hybrid Flow) · 3.1.3.7 ID Token Validation · 5.1 Standard Claims · 5.3 UserInfo Endpoint · 5.4 Requesting Claims using Scope Values · 15.5.2 Nonce Implementation Notes; và OpenID Connect Discovery 1.0 §3–4.

---

## 1. OIDC là lớp identity xây TRÊN OAuth 2.0

> [!warning] Đây là điểm cốt lõi của cả bài
> OpenID Connect **không thay thế** OAuth 2.0. Nó là một lớp (layer) bổ sung, chạy trên chính các endpoint và các flow của OAuth 2.0.

📖 **Nguyên văn** — OpenID Connect Core 1.0, Abstract
> "OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. It enables Clients to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner."

🇻🇳 **Dịch**
> "OpenID Connect 1.0 là một lớp identity đơn giản nằm trên protocol OAuth 2.0. Nó cho phép các Client xác minh identity của End-User dựa trên việc authentication do một Authorization Server thực hiện, cũng như lấy thông tin profile cơ bản về End-User theo cách interoperable và REST-like."

📖 **Nguyên văn** — Core 1.0 §2 (ID Token), câu mở đầu
> "The primary extension that OpenID Connect makes to OAuth 2.0 to enable End-Users to be Authenticated is the ID Token data structure."

🇻🇳 **Dịch**
> "Phần mở rộng chính mà OpenID Connect thêm vào OAuth 2.0 để End-User có thể được Authenticated là cấu trúc dữ liệu ID Token."

📖 **Nguyên văn** — Core 1.0 §3 (Authentication)
> "OpenID Connect performs authentication to log in the End-User or to determine that the End-User is already logged in. OpenID Connect returns the result of the Authentication performed by the Server to the Client in a secure manner so that the Client can rely on it. For this reason, the Client is called Relying Party (RP) in this case. The Authentication result is returned in an ID Token, as defined in Section 2."

🇻🇳 **Dịch**
> "OpenID Connect thực hiện authentication để đăng nhập End-User, hoặc để xác định rằng End-User đã đăng nhập sẵn. OpenID Connect trả kết quả của việc Authentication do Server thực hiện về cho Client theo cách an toàn, để Client có thể tin cậy vào kết quả đó. Vì lý do này, Client trong trường hợp này được gọi là Relying Party (RP). Kết quả Authentication được trả về trong một ID Token, như định nghĩa ở Section 2."

### Hai câu hỏi khác nhau

| | Trả lời câu hỏi | Tài liệu định nghĩa |
|---|---|---|
| **OAuth 2.0** | "Client này được phép làm gì trên resource của user?" — authorization | RFC 6749 |
| **OpenID Connect** | "Người dùng vừa đăng nhập này **là ai**?" — authentication | OpenID Connect Core 1.0 |

RFC 6749 tự mô tả phạm vi của mình là authorization:

📖 **Nguyên văn** — RFC 6749, Abstract
> "The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf."

🇻🇳 **Dịch**
> "Framework authorization OAuth 2.0 cho phép một ứng dụng bên thứ ba có được quyền truy cập giới hạn vào một HTTP service, hoặc thay mặt một resource owner bằng cách dàn xếp một tương tác chấp thuận giữa resource owner và HTTP service, hoặc bằng cách cho phép ứng dụng bên thứ ba tự lấy quyền truy cập nhân danh chính nó."

> [!danger] Hiểu nhầm phổ biến nhất của cả chủ đề
> Dùng access token của OAuth 2.0 làm bằng chứng "user đã đăng nhập" là **sai**. Access token nói lên *quyền truy cập*, không nói lên *ai đang đứng đó*. Xem [[10 - Authentication vs Authorization]] và [[15 - OAuth 2.0]]. OIDC sinh ra chính vì khoảng trống này: nó thêm ID Token — token nói về **sự kiện authentication**.

💡 **Ví dụ đời sống — federation**
Bạn ra ngân hàng mở tài khoản. Ngân hàng **không tự cấp danh tính** cho bạn: họ không tự quyết định bạn tên gì, sinh năm nào. Họ yêu cầu bạn xuất trình CMND/CCCD do cơ quan nhà nước cấp, rồi *tin* vào giấy tờ đó vì tin cơ quan cấp.
- Cơ quan cấp CCCD = **OpenID Provider (OP)** — nơi thực sự xác minh bạn là ai.
- Ngân hàng = **Relying Party (RP)** — "bên tin cậy", chỉ đọc và kiểm tra giấy tờ.
- Tấm CCCD (có con dấu, có hạn dùng, có ghi ai cấp) = **ID Token**.
- Việc ngân hàng soi con dấu, soi ngày hết hạn, kiểm tra giấy đúng là cấp cho *mình* xem = **ID Token Validation** ở mục 5 bên dưới.

---

## 2. Các vai trò: End-User, RP, OP

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology
> "End-User
> Human participant."

🇻🇳 **Dịch**
> "End-User
> Người tham gia là con người."

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology
> "Relying Party (RP)
> OAuth 2.0 Client application requiring End-User Authentication and Claims from an OpenID Provider."

🇻🇳 **Dịch**
> "Relying Party (RP)
> Ứng dụng Client OAuth 2.0 cần việc Authentication End-User và các Claim từ một OpenID Provider."

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology
> "OpenID Provider (OP)
> OAuth 2.0 Authorization Server that is capable of Authenticating the End-User and providing Claims to a Relying Party about the Authentication event and the End-User."

🇻🇳 **Dịch**
> "OpenID Provider (OP)
> Authorization Server OAuth 2.0 có khả năng Authenticating End-User và cung cấp cho Relying Party các Claim về sự kiện Authentication và về End-User."

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology
> "Claim
> Piece of information asserted about an Entity."

🇻🇳 **Dịch**
> "Claim
> Một mẩu thông tin được khẳng định về một Entity."

### Đối chiếu với 4 vai trò của OAuth 2.0

📖 **Nguyên văn** — RFC 6749 §1.1 Roles
> "OAuth defines four roles:
>
>    resource owner
>       An entity capable of granting access to a protected resource.
>       When the resource owner is a person, it is referred to as an
>       end-user.
>
>    resource server
>       The server hosting the protected resources, capable of accepting
>       and responding to protected resource requests using access tokens.
>
>    client
>       An application making protected resource requests on behalf of the
>       resource owner and with its authorization.  The term "client" does
>       not imply any particular implementation characteristics (e.g.,
>       whether the application executes on a server, a desktop, or other
>       devices).
>
>    authorization server
>       The server issuing access tokens to the client after successfully
>       authenticating the resource owner and obtaining authorization."

🇻🇳 **Dịch**
> "OAuth định nghĩa bốn vai trò:
>
>    resource owner
>       Một entity có khả năng cấp quyền truy cập tới một protected resource.
>       Khi resource owner là một người, nó được gọi là end-user.
>
>    resource server
>       Server chứa các protected resource, có khả năng tiếp nhận và
>       phản hồi các request tới protected resource bằng access token.
>
>    client
>       Ứng dụng thực hiện các request tới protected resource thay mặt cho
>       resource owner và với sự authorization của resource owner. Thuật ngữ
>       "client" không hàm ý bất kỳ đặc điểm triển khai cụ thể nào (ví dụ,
>       ứng dụng chạy trên server, trên desktop, hay trên thiết bị khác).
>
>    authorization server
>       Server phát access token cho client sau khi authenticating thành công
>       resource owner và lấy được authorization."

Ánh xạ (mỗi ô truy được về hai đoạn trích ngay trên):

| OAuth 2.0 (RFC 6749 §1.1) | OpenID Connect (Core §1.2) | Ghi chú |
|---|---|---|
| resource owner (khi là người thì gọi là end-user) | **End-User** — "Human participant" | OIDC nói thẳng: con người |
| client | **Relying Party (RP)** — "OAuth 2.0 Client application requiring End-User Authentication and Claims" | RP *là* một OAuth 2.0 Client, thêm nhu cầu authentication |
| authorization server | **OpenID Provider (OP)** — "OAuth 2.0 Authorization Server that is capable of Authenticating the End-User..." | OP *là* một Authorization Server, thêm khả năng authenticate + phát Claim |
| resource server | (Core §5.3) **UserInfo Endpoint** — "an OAuth 2.0 Protected Resource that returns Claims about the authenticated End-User" | UserInfo là một protected resource cụ thể do OIDC định nghĩa |

---

## 3. Luồng tổng quan (Overview)

📖 **Nguyên văn** — Core 1.0 §1.3 Overview
> "The OpenID Connect protocol, in abstract, follows the following steps.
>
> 1. The RP (Client) sends a request to the OpenID Provider (OP).
> 2. The OP authenticates the End-User and obtains authorization.
> 3. The OP responds with an ID Token and usually an Access Token.
> 4. The RP can send a request with the Access Token to the UserInfo Endpoint.
> 5. The UserInfo Endpoint returns Claims about the End-User."

🇻🇳 **Dịch**
> "Protocol OpenID Connect, ở mức trừu tượng, gồm các bước sau.
>
> 1. RP (Client) gửi một request tới OpenID Provider (OP).
> 2. OP authenticate End-User và lấy authorization.
> 3. OP phản hồi bằng một ID Token và thường kèm một Access Token.
> 4. RP có thể gửi một request kèm Access Token tới UserInfo Endpoint.
> 5. UserInfo Endpoint trả về các Claim về End-User."

Chú ý bước 3: **ID Token** (bạn là ai) và **Access Token** (bạn được làm gì) là hai thứ khác nhau, đi cùng nhau trong một response.

---

## 4. ID Token — trọng tâm

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology
> "ID Token
> JSON Web Token (JWT) [JWT] that contains Claims about the Authentication event. It MAY contain other Claims."

🇻🇳 **Dịch**
> "ID Token
> JSON Web Token (JWT) [JWT] chứa các Claim về sự kiện Authentication. Nó CÓ THỂ chứa các Claim khác."

📖 **Nguyên văn** — Core 1.0 §2
> "The ID Token is a security token that contains Claims about the Authentication of an End-User by an Authorization Server when using a Client, and potentially other requested Claims. The ID Token is represented as a JSON Web Token (JWT) [JWT]."

🇻🇳 **Dịch**
> "ID Token là một security token chứa các Claim về việc Authentication một End-User bởi một Authorization Server khi dùng một Client, và có thể cả các Claim khác được yêu cầu. ID Token được biểu diễn dưới dạng một JSON Web Token (JWT) [JWT]."

Định dạng JWT đã học ở [[14 - JWT]]; đối chiếu định nghĩa gốc:

📖 **Nguyên văn** — RFC 7519 §1 Introduction
> "JSON Web Token (JWT) is a compact claims representation format intended for space constrained environments such as HTTP Authorization headers and URI query parameters."

🇻🇳 **Dịch**
> "JSON Web Token (JWT) là một định dạng biểu diễn claim gọn nhẹ, dành cho các môi trường hạn chế về không gian như HTTP Authorization header và URI query parameter."

📖 **Nguyên văn** — Core 1.0 §2 (yêu cầu chữ ký)
> "ID Tokens MUST be signed using JWS [JWS] and optionally both signed and then encrypted using JWS [JWS] and JWE [JWE] respectively, thereby providing authentication, integrity, non-repudiation, and optionally, confidentiality, per Section 16.14."

🇻🇳 **Dịch**
> "ID Token PHẢI được ký bằng JWS [JWS], và tuỳ chọn có thể vừa ký vừa mã hoá bằng JWS [JWS] và JWE [JWE] tương ứng, qua đó cung cấp authentication, tính toàn vẹn, tính không thể chối bỏ, và tuỳ chọn thêm tính bảo mật, theo Section 16.14."

📖 **Nguyên văn** — Core 1.0 §2 (cấm `alg: none` trừ một trường hợp hẹp)
> "ID Tokens MUST NOT use none as the alg value unless the Response Type used returns no ID Token from the Authorization Endpoint (such as when using the Authorization Code Flow) and the Client explicitly requested the use of none at Registration time."

🇻🇳 **Dịch**
> "ID Token KHÔNG ĐƯỢC dùng none làm giá trị alg, trừ khi Response Type được dùng không trả ID Token từ Authorization Endpoint (ví dụ khi dùng Authorization Code Flow) và Client đã yêu cầu rõ ràng việc dùng none tại thời điểm Registration."

### 4.1. Các Claim trong ID Token

📖 **Nguyên văn** — Core 1.0 §2, câu dẫn
> "The following Claims are used within the ID Token for all OAuth 2.0 flows used by OpenID Connect:"

🇻🇳 **Dịch**
> "Các Claim sau được dùng bên trong ID Token cho mọi flow OAuth 2.0 mà OpenID Connect sử dụng:"

| Claim | Mức bắt buộc (nguyên văn) | Ý nghĩa (theo spec) |
|---|---|---|
| `iss` | REQUIRED | "Issuer Identifier for the Issuer of the response." Là URL case-sensitive dùng scheme `https`, không có query/fragment |
| `sub` | REQUIRED | "Subject Identifier. A locally unique and never reassigned identifier within the Issuer for the End-User" — không quá 255 ký tự ASCII |
| `aud` | REQUIRED | "Audience(s) that this ID Token is intended for." Bắt buộc chứa `client_id` của RP |
| `exp` | REQUIRED | "Expiration time on or after which the ID Token MUST NOT be accepted by the RP" |
| `iat` | REQUIRED | "Time at which the JWT was issued." |
| `auth_time` | "this Claim is REQUIRED" khi có `max_age` hoặc khi `auth_time` được yêu cầu như Essential Claim; ngoài ra OPTIONAL | "Time when the End-User authentication occurred." |
| `nonce` | (không gắn nhãn REQUIRED/OPTIONAL ở §2 — bắt buộc có nếu request có gửi `nonce`) | "String value used to associate a Client session with an ID Token, and to mitigate replay attacks." |
| `acr` | OPTIONAL | "Authentication Context Class Reference." Mức độ/nhóm phương thức authentication đã đạt |
| `amr` | OPTIONAL | "Authentication Methods References." Mảng string chỉ các phương thức authentication đã dùng |
| `azp` | OPTIONAL | "Authorized party - the party to which the ID Token was issued." |

Trích nguyên văn từng claim quan trọng:

📖 **Nguyên văn** — Core 1.0 §2, `iss`
> "iss
> REQUIRED. Issuer Identifier for the Issuer of the response. The iss value is a case-sensitive URL using the https scheme that contains scheme, host, and optionally, port number and path components and no query or fragment components."

🇻🇳 **Dịch**
> "iss
> BẮT BUỘC. Issuer Identifier của bên phát hành response. Giá trị iss là một URL phân biệt hoa thường dùng scheme https, chứa scheme, host, và tuỳ chọn thêm port và path, và không có thành phần query hay fragment."

📖 **Nguyên văn** — Core 1.0 §2, `sub`
> "sub
> REQUIRED. Subject Identifier. A locally unique and never reassigned identifier within the Issuer for the End-User, which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4. It MUST NOT exceed 255 ASCII [RFC20] characters in length. The sub value is a case-sensitive string."

🇻🇳 **Dịch**
> "sub
> BẮT BUỘC. Subject Identifier. Một định danh duy nhất cục bộ và không bao giờ được cấp lại, trong phạm vi Issuer, dành cho End-User, và được thiết kế để Client tiêu thụ, ví dụ 24400320 hoặc AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4. Nó KHÔNG ĐƯỢC dài quá 255 ký tự ASCII [RFC20]. Giá trị sub là chuỗi phân biệt hoa thường."

> [!tip] Khoá chính của user trong hệ thống bạn là cặp (`iss`, `sub`)
> `sub` chỉ "locally unique... within the Issuer" — duy nhất **trong phạm vi một Issuer**. Hai OP khác nhau hoàn toàn có thể phát `sub` trùng nhau. Dùng riêng `sub` làm khoá là sai; phải gắn kèm `iss`.

📖 **Nguyên văn** — Core 1.0 §2, `aud`
> "aud
> REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value. It MAY also contain identifiers for other audiences. In the general case, the aud value is an array of case-sensitive strings. In the common special case when there is one audience, the aud value MAY be a single case-sensitive string."

🇻🇳 **Dịch**
> "aud
> BẮT BUỘC. (Các) đối tượng mà ID Token này dành cho. Nó PHẢI chứa client_id OAuth 2.0 của Relying Party như một giá trị audience. Nó CÓ THỂ chứa thêm định danh của các audience khác. Ở trường hợp tổng quát, giá trị aud là một mảng các chuỗi phân biệt hoa thường. Ở trường hợp đặc biệt phổ biến khi chỉ có một audience, giá trị aud CÓ THỂ là một chuỗi đơn phân biệt hoa thường."

📖 **Nguyên văn** — Core 1.0 §2, `exp`
> "exp
> REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted by the RP when performing authentication with the OP. The processing of this parameter requires that the current date/time MUST be before the expiration date/time listed in the value. Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew."

🇻🇳 **Dịch**
> "exp
> BẮT BUỘC. Thời điểm hết hạn, tại hoặc sau thời điểm đó ID Token KHÔNG ĐƯỢC RP chấp nhận khi thực hiện authentication với OP. Việc xử lý parameter này đòi hỏi ngày/giờ hiện tại PHẢI trước ngày/giờ hết hạn ghi trong giá trị. Người triển khai CÓ THỂ cho phép một khoảng xê dịch nhỏ, thường không quá vài phút, để tính tới sai lệch đồng hồ."

📖 **Nguyên văn** — Core 1.0 §2, ghi chú kèm `exp`
> "NOTE: The ID Token expiration time is unrelated the lifetime of the authenticated session between the RP and the OP."

🇻🇳 **Dịch**
> "GHI CHÚ: Thời điểm hết hạn của ID Token không liên quan tới vòng đời của session đã authenticate giữa RP và OP."

📖 **Nguyên văn** — Core 1.0 §2, `iat`
> "iat
> REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from 1970-01-01T00:00:00Z as measured in UTC until the date/time."

🇻🇳 **Dịch**
> "iat
> BẮT BUỘC. Thời điểm JWT được phát hành. Giá trị của nó là một số JSON biểu diễn số giây tính từ 1970-01-01T00:00:00Z đo theo UTC cho tới ngày/giờ đó."

📖 **Nguyên văn** — Core 1.0 §2, `auth_time`
> "auth_time
> Time when the End-User authentication occurred. Its value is a JSON number representing the number of seconds from 1970-01-01T00:00:00Z as measured in UTC until the date/time. When a max_age request is made or when auth_time is requested as an Essential Claim, then this Claim is REQUIRED; otherwise, its inclusion is OPTIONAL."

🇻🇳 **Dịch**
> "auth_time
> Thời điểm việc authentication End-User diễn ra. Giá trị của nó là một số JSON biểu diễn số giây tính từ 1970-01-01T00:00:00Z đo theo UTC cho tới ngày/giờ đó. Khi có request max_age, hoặc khi auth_time được yêu cầu như một Essential Claim, thì Claim này là BẮT BUỘC; ngoài ra, việc đưa nó vào là TUỲ CHỌN."

> [!note] `iat` khác `auth_time`
> `iat` = lúc **token được phát**. `auth_time` = lúc **người dùng thực sự đăng nhập**. Một OP đang có session sẵn có thể phát token mới (`iat` = bây giờ) cho một lần đăng nhập từ hôm qua (`auth_time` = hôm qua). Muốn ép đăng nhập lại thì phải nhìn `auth_time`, không phải `iat`.

📖 **Nguyên văn** — Core 1.0 §2, `acr`
> "acr
> OPTIONAL. Authentication Context Class Reference. String specifying an Authentication Context Class Reference value that identifies the Authentication Context Class that the authentication performed satisfied. The value "0" indicates the End-User authentication did not meet the requirements of ISO/IEC 29115 [ISO29115] level 1. For historic reasons, the value "0" is used to indicate that there is no confidence that the same person is actually there. Authentications with level 0 SHOULD NOT be used to authorize access to any resource of any monetary value."

🇻🇳 **Dịch**
> "acr
> TUỲ CHỌN. Authentication Context Class Reference. Chuỗi chỉ định một giá trị Authentication Context Class Reference, xác định Authentication Context Class mà lần authentication vừa thực hiện đã thoả mãn. Giá trị "0" cho biết việc authentication End-User không đạt yêu cầu của ISO/IEC 29115 [ISO29115] mức 1. Vì lý do lịch sử, giá trị "0" được dùng để chỉ rằng không có độ tin cậy nào về việc đúng là cùng một người đang thực sự ở đó. Các lần authentication ở mức 0 KHÔNG NÊN được dùng để authorize truy cập tới bất kỳ resource nào có giá trị tiền bạc."

📖 **Nguyên văn** — Core 1.0 §2, `amr`
> "amr
> OPTIONAL. Authentication Methods References. JSON array of strings that are identifiers for authentication methods used in the authentication. For instance, values might indicate that both password and OTP authentication methods were used. The amr value is an array of case-sensitive strings."

🇻🇳 **Dịch**
> "amr
> TUỲ CHỌN. Authentication Methods References. Mảng JSON các chuỗi là định danh của các phương thức authentication đã dùng trong lần authentication. Ví dụ, các giá trị có thể cho biết rằng cả phương thức password lẫn OTP đều đã được dùng. Giá trị amr là mảng các chuỗi phân biệt hoa thường."

📖 **Nguyên văn** — Core 1.0 §2, `azp`
> "azp
> OPTIONAL. Authorized party - the party to which the ID Token was issued. If present, it MUST contain the OAuth 2.0 Client ID of this party. The azp value is a case-sensitive string containing a StringOrURI value. Note that in practice, the azp Claim only occurs when extensions beyond the scope of this specification are used; therefore, implementations not using such extensions are encouraged to not use azp and to ignore it when it does occur."

🇻🇳 **Dịch**
> "azp
> TUỲ CHỌN. Bên được uỷ quyền — bên mà ID Token được phát cho. Nếu có mặt, nó PHẢI chứa Client ID OAuth 2.0 của bên này. Giá trị azp là một chuỗi phân biệt hoa thường chứa một giá trị StringOrURI. Lưu ý rằng trên thực tế, Claim azp chỉ xuất hiện khi các extension nằm ngoài phạm vi của specification này được dùng; do đó, các implementation không dùng các extension đó được khuyến khích không dùng azp và bỏ qua nó khi nó xuất hiện."

📖 **Nguyên văn** — Core 1.0 §2, ví dụ non-normative của JWT Claims Set trong ID Token
> ```
> {
>  "iss": "https://server.example.com",
>  "sub": "24400320",
>  "aud": "s6BhdRkqt3",
>  "nonce": "n-0S6_WzA2Mj",
>  "exp": 1311281970,
>  "iat": 1311280970,
>  "auth_time": 1311280969,
>  "acr": "urn:mace:incommon:iap:silver"
> }
> ```

🇻🇳 Đây là phần payload (JWT Claims Set) của ID Token sau khi giải mã base64url — spec ghi rõ đây là ví dụ non-normative, không phải yêu cầu bắt buộc về nội dung.

---

## 5. ID Token Validation — chỗ triển khai sai gây lỗ hổng

> [!danger] Không kiểm tra đủ các bước dưới đây = chấp nhận token giả
> Toàn bộ giá trị bảo mật của OIDC nằm ở việc RP **tự kiểm chứng** ID Token. Một ID Token chưa được validate chỉ là một chuỗi base64 ai cũng tự tạo được. Các lỗi kinh điển: không kiểm `iss`, không kiểm `aud` (token phát cho app khác vẫn được nhận — confused deputy), không kiểm chữ ký, hoặc chấp nhận `alg: none`.

📖 **Nguyên văn** — Core 1.0 §3.1.3.7 ID Token Validation
> "Clients MUST validate the ID Token in the Token Response in the following manner:
>
> 1. If the ID Token is encrypted, decrypt it using the keys and algorithms that the Client specified during Registration that the OP was to use to encrypt the ID Token. If encryption was negotiated with the OP at Registration time and the ID Token is not encrypted, the RP SHOULD reject it.
> 2. The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
> 3. The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience. The aud (audience) Claim MAY contain an array with more than one element. The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
> 4. If the implementation is using extensions (which are beyond the scope of this specification) that result in the azp (authorized party) Claim being present, it SHOULD validate the azp value as specified by those extensions.
> 5. This validation MAY include that when an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
> 6. If the ID Token is received via direct communication between the Client and the Token Endpoint (which it is in this flow), the TLS server validation MAY be used to validate the issuer in place of checking the token signature. The Client MUST validate the signature of all other ID Tokens according to JWS [JWS] using the algorithm specified in the JWT alg Header Parameter. The Client MUST use the keys provided by the Issuer.
> 7. The alg value SHOULD be the default of RS256 or the algorithm sent by the Client in the id_token_signed_response_alg parameter during Registration.
> 8. If the JWT alg Header Parameter uses a MAC based algorithm such as HS256, HS384, or HS512, the octets of the UTF-8 [RFC3629] representation of the client_secret corresponding to the client_id contained in the aud (audience) Claim are used as the key to validate the signature. For MAC based algorithms, the behavior is unspecified if the aud is multi-valued.
> 9. The current time MUST be before the time represented by the exp Claim.
> 10. The iat Claim can be used to reject tokens that were issued too far away from the current time, limiting the amount of time that nonces need to be stored to prevent attacks. The acceptable range is Client specific.
> 11. If a nonce value was sent in the Authentication Request, a nonce Claim MUST be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The Client SHOULD check the nonce value for replay attacks. The precise method for detecting replay attacks is Client specific.
> 12. If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate. The meaning and processing of acr Claim Values is out of scope for this specification.
> 13. If the auth_time Claim was requested, either through a specific request for this Claim or by using the max_age parameter, the Client SHOULD check the auth_time Claim value and request re-authentication if it determines too much time has elapsed since the last End-User authentication."

🇻🇳 **Dịch**
> "Client PHẢI validate ID Token trong Token Response theo cách sau:
>
> 1. Nếu ID Token được mã hoá, giải mã nó bằng các key và thuật toán mà Client đã chỉ định lúc Registration để OP dùng mã hoá ID Token. Nếu việc mã hoá đã được thoả thuận với OP lúc Registration mà ID Token lại không được mã hoá, RP NÊN từ chối nó.
> 2. Issuer Identifier của OpenID Provider (thường lấy được trong quá trình Discovery) PHẢI khớp chính xác với giá trị của Claim iss (issuer).
> 3. Client PHẢI validate rằng Claim aud (audience) có chứa giá trị client_id của mình — client_id đã đăng ký tại Issuer được xác định bởi Claim iss — như một audience. Claim aud CÓ THỂ chứa một mảng nhiều hơn một phần tử. ID Token PHẢI bị từ chối nếu nó không liệt kê Client như một audience hợp lệ, hoặc nếu nó chứa thêm những audience mà Client không tin cậy.
> 4. Nếu implementation dùng các extension (nằm ngoài phạm vi specification này) khiến Claim azp (authorized party) xuất hiện, thì NÊN validate giá trị azp theo quy định của các extension đó.
> 5. Việc validate này CÓ THỂ bao gồm: khi Claim azp có mặt, Client NÊN xác minh rằng client_id của mình chính là giá trị của Claim đó.
> 6. Nếu ID Token được nhận qua liên lạc trực tiếp giữa Client và Token Endpoint (đúng như trong flow này), thì việc TLS server validation CÓ THỂ được dùng để validate issuer thay cho việc kiểm tra chữ ký token. Client PHẢI validate chữ ký của tất cả các ID Token khác theo JWS [JWS], dùng thuật toán chỉ định trong JWT alg Header Parameter. Client PHẢI dùng các key do Issuer cung cấp.
> 7. Giá trị alg NÊN là mặc định RS256 hoặc thuật toán mà Client đã gửi trong parameter id_token_signed_response_alg lúc Registration.
> 8. Nếu JWT alg Header Parameter dùng một thuật toán dựa trên MAC như HS256, HS384, hay HS512, thì các octet của biểu diễn UTF-8 [RFC3629] của client_secret tương ứng với client_id chứa trong Claim aud (audience) được dùng làm key để validate chữ ký. Với các thuật toán dựa trên MAC, hành vi là không xác định nếu aud có nhiều giá trị.
> 9. Thời gian hiện tại PHẢI trước thời điểm biểu diễn bởi Claim exp.
> 10. Claim iat có thể được dùng để từ chối những token được phát hành quá xa thời gian hiện tại, qua đó giới hạn khoảng thời gian cần lưu trữ nonce để chống tấn công. Khoảng chấp nhận được là tuỳ Client.
> 11. Nếu một giá trị nonce đã được gửi trong Authentication Request, thì Claim nonce PHẢI có mặt và giá trị của nó phải được kiểm tra để xác minh nó đúng bằng giá trị đã gửi trong Authentication Request. Client NÊN kiểm tra giá trị nonce để phát hiện tấn công replay. Phương pháp chính xác để phát hiện replay là tuỳ Client.
> 12. Nếu Claim acr đã được yêu cầu, Client NÊN kiểm tra rằng giá trị Claim được khẳng định là phù hợp. Ý nghĩa và cách xử lý các giá trị Claim acr nằm ngoài phạm vi specification này.
> 13. Nếu Claim auth_time đã được yêu cầu, dù qua một request cụ thể cho Claim này hay qua parameter max_age, Client NÊN kiểm tra giá trị Claim auth_time và yêu cầu authenticate lại nếu xác định là đã trôi qua quá nhiều thời gian kể từ lần authentication End-User gần nhất."

> [!danger] Ba mục tuyệt đối không được bỏ
> - **Mục 2 — `iss` phải khớp *chính xác*** ("MUST exactly match"). So sánh chuỗi, không "chứa", không bỏ qua dấu `/` cuối.
> - **Mục 3 — `aud` phải chứa `client_id` của chính bạn**, và phải **từ chối** nếu có audience lạ mà bạn không tin cậy. Bỏ bước này là mở cửa cho token của app khác.
> - **Mục 6 — chữ ký phải được validate bằng key *do Issuer cung cấp*** (lấy qua `jwks_uri`), không phải key nằm trong header của chính token đó. Kết hợp với §2: `alg` không được là `none` (trừ ngoại lệ hẹp đã trích ở mục 4 bên trên).

💡 **Ví dụ đời sống**
Tấm CCCD nếu chỉ "cầm lên nhìn" thì vô nghĩa. Ngân hàng phải: xem đúng cơ quan cấp (`iss`), xem tên trên giấy đúng là người đang đứng trước mặt và giấy này cấp cho giao dịch với *mình* (`aud`), xem chưa hết hạn (`exp`), và soi con dấu/hologram thật (chữ ký JWS). Thiếu bước soi con dấu thì ai in ra tấm giấy tương tự cũng qua cửa.

---

## 6. Ba flow: Authorization Code, Implicit, Hybrid

📖 **Nguyên văn** — Core 1.0 §3
> "Authentication can follow one of three paths: the Authorization Code Flow (response_type=code), the Implicit Flow (response_type=id_token token or response_type=id_token), or the Hybrid Flow (using other Response Type values defined in OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]). The flows determine how the ID Token and Access Token are returned to the Client."

🇻🇳 **Dịch**
> "Việc Authentication có thể đi theo một trong ba con đường: Authorization Code Flow (response_type=code), Implicit Flow (response_type=id_token token hoặc response_type=id_token), hoặc Hybrid Flow (dùng các giá trị Response Type khác được định nghĩa trong OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]). Các flow quyết định cách ID Token và Access Token được trả về cho Client."

📖 **Nguyên văn** — Core 1.0 §3, bảng "OpenID Connect Authentication Flows" (non-normative)

| Property | Authorization Code Flow | Implicit Flow | Hybrid Flow |
|---|---|---|---|
| All tokens returned from Authorization Endpoint | no | yes | no |
| All tokens returned from Token Endpoint | yes | no | no |
| Tokens not revealed to User Agent | yes | no | no |
| Client can be authenticated | yes | no | yes |
| Refresh Token possible | yes | no | yes |
| Communication in one round trip | no | yes | no |
| Most communication server-to-server | yes | no | varies |

🇻🇳 **Dịch** — bảng trên, giữ nguyên thứ tự dòng

| Thuộc tính | Authorization Code Flow | Implicit Flow | Hybrid Flow |
|---|---|---|---|
| Mọi token trả về từ Authorization Endpoint | không | có | không |
| Mọi token trả về từ Token Endpoint | có | không | không |
| Token không bị lộ ra User Agent | có | không | không |
| Client có thể được authenticate | có | không | có |
| Có thể có Refresh Token | có | không | có |
| Giao tiếp trong một round trip | không | có | không |
| Phần lớn giao tiếp là server-to-server | có | không | tuỳ |

📖 **Nguyên văn** — Core 1.0 §3, bảng ánh xạ `response_type` → flow

| "response_type" value | Flow |
|---|---|
| `code` | Authorization Code Flow |
| `id_token` | Implicit Flow |
| `id_token token` | Implicit Flow |
| `code id_token` | Hybrid Flow |
| `code token` | Hybrid Flow |
| `code id_token token` | Hybrid Flow |

🇻🇳 Bảng ánh xạ: giá trị `response_type` gửi trong Authorization Request quyết định flow nào được dùng.

📖 **Nguyên văn** — Core 1.0 §3, ghi chú về `token`
> "NOTE: While OAuth 2.0 also defines the token Response Type value for the Implicit Flow, OpenID Connect does not use this Response Type, since no ID Token would be returned."

🇻🇳 **Dịch**
> "GHI CHÚ: Dù OAuth 2.0 cũng định nghĩa giá trị Response Type token cho Implicit Flow, OpenID Connect không dùng Response Type này, vì sẽ không có ID Token nào được trả về."

### 6.1. Authorization Code Flow

📖 **Nguyên văn** — Core 1.0 §3.1
> "This section describes how to perform authentication using the Authorization Code Flow. When using the Authorization Code Flow, all tokens are returned from the Token Endpoint. The Authorization Code Flow returns an Authorization Code to the Client, which can then exchange it for an ID Token and an Access Token directly. This provides the benefit of not exposing any tokens to the User Agent and possibly other malicious applications with access to the User Agent. The Authorization Server can also authenticate the Client before exchanging the Authorization Code for an Access Token. The Authorization Code flow is suitable for Clients that can securely maintain a Client Secret between themselves and the Authorization Server."

🇻🇳 **Dịch**
> "Mục này mô tả cách thực hiện authentication bằng Authorization Code Flow. Khi dùng Authorization Code Flow, mọi token đều được trả về từ Token Endpoint. Authorization Code Flow trả một Authorization Code về cho Client, rồi Client có thể đổi trực tiếp code đó lấy một ID Token và một Access Token. Điều này mang lại lợi ích là không phơi bày bất kỳ token nào ra User Agent và có thể cả các ứng dụng độc hại khác có quyền truy cập User Agent. Authorization Server cũng có thể authenticate Client trước khi đổi Authorization Code lấy Access Token. Authorization Code flow phù hợp với các Client có thể giữ an toàn một Client Secret giữa chúng và Authorization Server."

📖 **Nguyên văn** — Core 1.0 §3.1.1 Authorization Code Flow Steps
> "The Authorization Code Flow goes through the following steps.
>
> 1. Client prepares an Authentication Request containing the desired request parameters.
> 2. Client sends the request to the Authorization Server.
> 3. Authorization Server Authenticates the End-User.
> 4. Authorization Server obtains End-User Consent/Authorization.
> 5. Authorization Server sends the End-User back to the Client with an Authorization Code.
> 6. Client requests a response using the Authorization Code at the Token Endpoint.
> 7. Client receives a response that contains an ID Token and Access Token in the response body.
> 8. Client validates the ID token and retrieves the End-User's Subject Identifier."

🇻🇳 **Dịch**
> "Authorization Code Flow đi qua các bước sau.
>
> 1. Client chuẩn bị một Authentication Request chứa các request parameter mong muốn.
> 2. Client gửi request tới Authorization Server.
> 3. Authorization Server Authenticate End-User.
> 4. Authorization Server lấy Consent/Authorization của End-User.
> 5. Authorization Server gửi End-User quay lại Client kèm một Authorization Code.
> 6. Client yêu cầu một response bằng Authorization Code tại Token Endpoint.
> 7. Client nhận một response chứa ID Token và Access Token trong response body.
> 8. Client validate ID token và lấy ra Subject Identifier của End-User."

### 6.2. Implicit Flow

📖 **Nguyên văn** — Core 1.0 §3.2
> "This section describes how to perform authentication using the Implicit Flow. When using the Implicit Flow, all tokens are returned from the Authorization Endpoint; the Token Endpoint is not used. The Implicit Flow is mainly used by Clients implemented in a browser using a scripting language. The Access Token and ID Token are returned directly to the Client, which may expose them to the End-User and applications that have access to the End-User's User Agent. The Authorization Server does not perform Client Authentication."

🇻🇳 **Dịch**
> "Mục này mô tả cách thực hiện authentication bằng Implicit Flow. Khi dùng Implicit Flow, mọi token đều được trả về từ Authorization Endpoint; Token Endpoint không được dùng. Implicit Flow chủ yếu được dùng bởi các Client triển khai trong browser bằng một ngôn ngữ scripting. Access Token và ID Token được trả thẳng về Client, điều này có thể phơi bày chúng ra cho End-User và các ứng dụng có quyền truy cập User Agent của End-User. Authorization Server không thực hiện Client Authentication."

> [!danger] Implicit Flow — KHÔNG dùng cho code mới
> **Lưu ý về nguồn:** bản OpenID Connect Core 1.0 incorporating errata set 2 (15/12/2023) mà bài này đọc **không** có ghi chú deprecation cho Implicit Flow — nó vẫn mô tả Implicit Flow như một trong ba flow hợp lệ. Khuyến cáo dưới đây là **đối chiếu chéo** với RFC 9700 (đã trình bày ở bài [[15 - OAuth 2.0]]), **không phải trích từ spec OIDC**.

📖 **Nguyên văn** — RFC 9700 (Best Current Practice for OAuth 2.0 Security, January 2025) §2.1.2 Implicit Grant
> "The implicit grant (response type token) and other response types causing the authorization server to issue access tokens in the authorization response are vulnerable to access token leakage and access token replay as described in Sections 4.1, 4.2, 4.3, and 4.6.
>
>    Moreover, no standardized method for sender-constraining exists to
>    bind access tokens to a specific client (as recommended in
>    Section 2.2) when the access tokens are issued in the authorization
>    response.  This means that an attacker can use the leaked or stolen
>    access token at a resource endpoint.
>
>    In order to avoid these issues, clients SHOULD NOT use the implicit
>    grant (response type token) or other response types issuing access
>    tokens in the authorization response, unless access token injection
>    in the authorization response is prevented and the aforementioned
>    token leakage vectors are mitigated.
>
>    Clients SHOULD instead use the response type code (i.e.,
>    authorization code grant type) as specified in Section 2.1.1 or any
>    other response type that causes the authorization server to issue
>    access tokens in the token response, such as the code id_token
>    response type."

🇻🇳 **Dịch**
> "Implicit grant (response type token) và các response type khác khiến authorization server phát access token trong authorization response đều dễ bị rò rỉ access token và replay access token như mô tả ở các Section 4.1, 4.2, 4.3 và 4.6.
>
> Hơn nữa, không tồn tại phương pháp chuẩn hoá nào để sender-constrain nhằm ràng buộc access token vào một client cụ thể (như khuyến nghị ở Section 2.2) khi access token được phát trong authorization response. Điều này nghĩa là kẻ tấn công có thể dùng access token bị rò rỉ hoặc bị đánh cắp tại một resource endpoint.
>
> Để tránh các vấn đề này, các client KHÔNG NÊN dùng implicit grant (response type token) hay các response type khác phát access token trong authorization response, trừ khi việc tiêm access token vào authorization response đã được ngăn chặn và các hướng rò rỉ token nói trên đã được giảm thiểu.
>
> Thay vào đó, các client NÊN dùng response type code (tức authorization code grant type) như quy định ở Section 2.1.1, hoặc bất kỳ response type nào khác khiến authorization server phát access token trong token response, chẳng hạn response type code id_token."

> [!note] Đọc kỹ câu cuối của RFC 9700
> RFC 9700 nêu đích danh `code id_token` — tức một **Hybrid Flow của OIDC** — như phương án được chấp nhận. Cái bị loại là việc phát **access token** trong authorization response, không phải bản thân OIDC.

### 6.3. Hybrid Flow

📖 **Nguyên văn** — Core 1.0 §3.3
> "This section describes how to perform authentication using the Hybrid Flow. When using the Hybrid Flow, some tokens are returned from the Authorization Endpoint and others are returned from the Token Endpoint. The mechanisms for returning tokens in the Hybrid Flow are specified in OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]."

🇻🇳 **Dịch**
> "Mục này mô tả cách thực hiện authentication bằng Hybrid Flow. Khi dùng Hybrid Flow, một số token được trả về từ Authorization Endpoint và số còn lại được trả về từ Token Endpoint. Các cơ chế trả token trong Hybrid Flow được quy định trong OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]."

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology, ba định nghĩa flow
> "Authorization Code Flow
> OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint and all tokens are returned from the Token Endpoint."
>
> "Implicit Flow
> OAuth 2.0 flow in which all tokens are returned from the Authorization Endpoint and neither the Token Endpoint nor an Authorization Code are used."
>
> "Hybrid Flow
> OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint, some tokens are returned from the Authorization Endpoint, and others are returned from the Token Endpoint."

🇻🇳 **Dịch**
> "Authorization Code Flow
> Flow OAuth 2.0 trong đó một Authorization Code được trả về từ Authorization Endpoint và mọi token được trả về từ Token Endpoint."
>
> "Implicit Flow
> Flow OAuth 2.0 trong đó mọi token được trả về từ Authorization Endpoint và không dùng tới Token Endpoint lẫn Authorization Code."
>
> "Hybrid Flow
> Flow OAuth 2.0 trong đó một Authorization Code được trả về từ Authorization Endpoint, một số token được trả về từ Authorization Endpoint, và số khác được trả về từ Token Endpoint."

---

## 7. Scope `openid` — bắt buộc

📖 **Nguyên văn** — Core 1.0 §3.1.2.1 Authentication Request, parameter `scope`
> "scope
> REQUIRED. OpenID Connect requests MUST contain the openid scope value. If the openid scope value is not present, the behavior is entirely unspecified. Other scope values MAY be present. Scope values used that are not understood by an implementation SHOULD be ignored."

🇻🇳 **Dịch**
> "scope
> BẮT BUỘC. Các request OpenID Connect PHẢI chứa giá trị scope openid. Nếu giá trị scope openid không có mặt, hành vi là hoàn toàn không xác định. Các giá trị scope khác CÓ THỂ có mặt. Các giá trị scope được dùng mà implementation không hiểu thì NÊN được bỏ qua."

> [!tip] `openid` chính là công tắc bật OIDC
> Cùng một Authorization Endpoint: gửi `scope=email` là request OAuth 2.0 thuần; thêm `openid` vào (`scope=openid email`) mới biến nó thành Authentication Request của OIDC và mới có ID Token. Chi tiết Authentication Request là "OAuth 2.0 Authorization Request" mở rộng — xem [[15 - OAuth 2.0]].

📖 **Nguyên văn** — Core 1.0 §1.2 Terminology, "Authentication Request"
> "Authentication Request
> OAuth 2.0 Authorization Request using extension parameters and scopes defined by OpenID Connect to request that the End-User be authenticated by the Authorization Server, which is an OpenID Connect Provider, to the Client, which is an OpenID Connect Relying Party."

🇻🇳 **Dịch**
> "Authentication Request
> Authorization Request OAuth 2.0 dùng các parameter mở rộng và các scope do OpenID Connect định nghĩa, để yêu cầu rằng End-User được Authorization Server — vốn là một OpenID Connect Provider — authenticate cho Client, vốn là một OpenID Connect Relying Party."

### Các scope khác và Claim mà chúng yêu cầu

📖 **Nguyên văn** — Core 1.0 §5.4 Requesting Claims using Scope Values
> "OpenID Connect defines the following scope values that are used to request Claims:
>
> profile
> OPTIONAL. This scope value requests access to the End-User's default profile Claims, which are: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, and updated_at.
>
> email
> OPTIONAL. This scope value requests access to the email and email_verified Claims.
>
> address
> OPTIONAL. This scope value requests access to the address Claim.
>
> phone
> OPTIONAL. This scope value requests access to the phone_number and phone_number_verified Claims.
>
> Multiple scope values MAY be used by creating a space-delimited, case-sensitive list of ASCII scope values."

🇻🇳 **Dịch**
> "OpenID Connect định nghĩa các giá trị scope sau để request Claim:
>
> profile
> TUỲ CHỌN. Giá trị scope này request quyền truy cập các Claim profile mặc định của End-User, gồm: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, và updated_at.
>
> email
> TUỲ CHỌN. Giá trị scope này request quyền truy cập các Claim email và email_verified.
>
> address
> TUỲ CHỌN. Giá trị scope này request quyền truy cập Claim address.
>
> phone
> TUỲ CHỌN. Giá trị scope này request quyền truy cập các Claim phone_number và phone_number_verified.
>
> Có thể dùng nhiều giá trị scope bằng cách tạo một danh sách các giá trị scope ASCII phân cách bằng dấu cách, phân biệt hoa thường."

📖 **Nguyên văn** — Core 1.0 §5.4, ghi chú về mức độ ràng buộc
> "Claims requested by the following scopes are treated by Authorization Servers as Voluntary Claims."

🇻🇳 **Dịch**
> "Các Claim được request bởi những scope dưới đây được Authorization Server xử lý như các Voluntary Claim."

> [!warning] "Voluntary" nghĩa là OP có quyền không trả
> Request `scope=openid email` **không đảm bảo** bạn sẽ nhận được `email`. §5.3.2 nói rõ: "For privacy reasons, OpenID Providers MAY elect to not return values for some requested Claims. It is not an error condition to not return a requested Claim." (🇻🇳 "Vì lý do riêng tư, OpenID Provider CÓ THỂ chọn không trả giá trị cho một số Claim được request. Việc không trả một Claim được request không phải là tình trạng lỗi.") Code phải chịu được trường hợp thiếu field.

---

## 8. `nonce` — chống replay

📖 **Nguyên văn** — Core 1.0 §3.1.2.1, request parameter `nonce`
> "nonce
> OPTIONAL. String value used to associate a Client session with an ID Token, and to mitigate replay attacks. The value is passed through unmodified from the Authentication Request to the ID Token. Sufficient entropy MUST be present in the nonce values used to prevent attackers from guessing values. For implementation notes, see Section 15.5.2."

🇻🇳 **Dịch**
> "nonce
> TUỲ CHỌN. Giá trị chuỗi dùng để liên kết một session của Client với một ID Token, và để giảm thiểu tấn công replay. Giá trị này được truyền nguyên vẹn không thay đổi từ Authentication Request sang ID Token. PHẢI có đủ entropy trong các giá trị nonce được dùng để ngăn kẻ tấn công đoán được giá trị. Xem ghi chú triển khai tại Section 15.5.2."

📖 **Nguyên văn** — Core 1.0 §2, ID Token Claim `nonce`
> "nonce
> String value used to associate a Client session with an ID Token, and to mitigate replay attacks. The value is passed through unmodified from the Authentication Request to the ID Token. If present in the ID Token, Clients MUST verify that the nonce Claim Value is equal to the value of the nonce parameter sent in the Authentication Request. If present in the Authentication Request, Authorization Servers MUST include a nonce Claim in the ID Token with the Claim Value being the nonce value sent in the Authentication Request. Authorization Servers SHOULD perform no other processing on nonce values used. The nonce value is a case-sensitive string."

🇻🇳 **Dịch**
> "nonce
> Giá trị chuỗi dùng để liên kết một session của Client với một ID Token, và để giảm thiểu tấn công replay. Giá trị này được truyền nguyên vẹn không thay đổi từ Authentication Request sang ID Token. Nếu có mặt trong ID Token, Client PHẢI xác minh rằng giá trị Claim nonce bằng đúng giá trị của parameter nonce đã gửi trong Authentication Request. Nếu có mặt trong Authentication Request, Authorization Server PHẢI đưa Claim nonce vào ID Token với giá trị Claim chính là giá trị nonce đã gửi trong Authentication Request. Authorization Server KHÔNG NÊN thực hiện xử lý nào khác trên các giá trị nonce được dùng. Giá trị nonce là chuỗi phân biệt hoa thường."

📖 **Nguyên văn** — Core 1.0 §15.5.2 Nonce Implementation Notes
> "The nonce parameter value needs to include per-session state and be unguessable to attackers. One method to achieve this for Web Server Clients is to store a cryptographically random value as an HttpOnly session cookie and use a cryptographic hash of the value as the nonce parameter. In that case, the nonce in the returned ID Token is compared to the hash of the session cookie to detect ID Token replay by third parties. A related method applicable to JavaScript Clients and other Browser-Based Clients is to store the cryptographically random value in HTML5 local storage and use a cryptographic hash of this value."

🇻🇳 **Dịch**
> "Giá trị parameter nonce cần chứa state theo từng session và không thể đoán được đối với kẻ tấn công. Một cách để đạt điều này với Web Server Client là lưu một giá trị ngẫu nhiên về mặt mật mã dưới dạng session cookie HttpOnly, và dùng một hash mật mã của giá trị đó làm parameter nonce. Trong trường hợp đó, nonce trong ID Token trả về được so sánh với hash của session cookie để phát hiện việc bên thứ ba replay ID Token. Một phương pháp tương tự áp dụng cho JavaScript Client và các Browser-Based Client khác là lưu giá trị ngẫu nhiên mật mã trong HTML5 local storage và dùng một hash mật mã của giá trị này."

> [!warning] `nonce` và `state` là hai thứ khác nhau
> Spec mô tả `state` là "Opaque value used to maintain state between the request and the callback. Typically, Cross-Site Request Forgery (CSRF, XSRF) mitigation is done by cryptographically binding the value of this parameter with a browser cookie." (🇻🇳 "Giá trị mờ dùng để duy trì state giữa request và callback. Thông thường việc giảm thiểu CSRF/XSRF được thực hiện bằng cách ràng buộc về mặt mật mã giá trị của parameter này với một browser cookie.") — `state` chống CSRF trên luồng redirect; `nonce` chống replay ID Token. Cần cả hai, không thay thế cho nhau.

---

## 9. UserInfo Endpoint

📖 **Nguyên văn** — Core 1.0 §5.3 UserInfo Endpoint
> "The UserInfo Endpoint is an OAuth 2.0 Protected Resource that returns Claims about the authenticated End-User. To obtain the requested Claims about the End-User, the Client makes a request to the UserInfo Endpoint using an Access Token obtained through OpenID Connect Authentication. These Claims are normally represented by a JSON object that contains a collection of name and value pairs for the Claims.
>
> Communication with the UserInfo Endpoint MUST utilize TLS. See Section 16.17 for more information on using TLS.
>
> The UserInfo Endpoint MUST support the use of the HTTP GET and HTTP POST methods defined in RFC 7231 [RFC7231].
>
> The UserInfo Endpoint MUST accept Access Tokens as OAuth 2.0 Bearer Token Usage [RFC6750]."

🇻🇳 **Dịch**
> "UserInfo Endpoint là một Protected Resource OAuth 2.0 trả về các Claim về End-User đã được authenticate. Để lấy các Claim được yêu cầu về End-User, Client thực hiện một request tới UserInfo Endpoint dùng một Access Token lấy được qua OpenID Connect Authentication. Các Claim này thường được biểu diễn bằng một object JSON chứa tập hợp các cặp tên–giá trị của các Claim.
>
> Việc liên lạc với UserInfo Endpoint PHẢI dùng TLS. Xem Section 16.17 để biết thêm về việc dùng TLS.
>
> UserInfo Endpoint PHẢI hỗ trợ dùng các method HTTP GET và HTTP POST được định nghĩa trong RFC 7231 [RFC7231].
>
> UserInfo Endpoint PHẢI chấp nhận Access Token theo OAuth 2.0 Bearer Token Usage [RFC6750]."

📖 **Nguyên văn** — Core 1.0 §5.3.1, ví dụ non-normative của UserInfo Request
> ```
> GET /userinfo HTTP/1.1
> Host: server.example.com
> Authorization: Bearer SlAV32hkKG
> ```

🇻🇳 Gọi UserInfo bằng `GET`, đính Access Token vào header `Authorization` theo kiểu Bearer — đúng như mọi protected resource OAuth 2.0 khác.

📖 **Nguyên văn** — Core 1.0 §5.3.2 Successful UserInfo Response
> "The sub (subject) Claim MUST always be returned in the UserInfo Response.
>
> NOTE: Due to the possibility of token substitution attacks (see Section 16.11), the UserInfo Response is not guaranteed to be about the End-User identified by the sub (subject) element of the ID Token. The sub Claim in the UserInfo Response MUST be verified to exactly match the sub Claim in the ID Token; if they do not match, the UserInfo Response values MUST NOT be used."

🇻🇳 **Dịch**
> "Claim sub (subject) PHẢI luôn được trả về trong UserInfo Response.
>
> GHI CHÚ: Do khả năng xảy ra tấn công thay thế token (xem Section 16.11), UserInfo Response không được đảm bảo là nói về End-User được xác định bởi phần tử sub (subject) của ID Token. Claim sub trong UserInfo Response PHẢI được xác minh là khớp chính xác với Claim sub trong ID Token; nếu chúng không khớp, các giá trị trong UserInfo Response KHÔNG ĐƯỢC sử dụng."

> [!danger] Luôn so `sub` của UserInfo với `sub` của ID Token
> Đây là bước rất hay bị bỏ. Nếu không so, một access token bị thay thế có thể khiến bạn gán profile của người khác vào session của user hiện tại.

---

## 10. Standard Claims

📖 **Nguyên văn** — Core 1.0 §5.1 Standard Claims, câu dẫn
> "This specification defines a set of standard Claims. They can be requested to be returned either in the UserInfo Response, per Section 5.3.2, or in the ID Token, per Section 2."

🇻🇳 **Dịch**
> "Specification này định nghĩa một tập các Claim tiêu chuẩn. Chúng có thể được yêu cầu trả về hoặc trong UserInfo Response (theo Section 5.3.2), hoặc trong ID Token (theo Section 2)."

📖 **Nguyên văn** — Core 1.0 §5.1, bảng Standard Claims (trích các member chính)

| Member | Type | Description |
|---|---|---|
| `sub` | string | "Subject - Identifier for the End-User at the Issuer." |
| `name` | string | "End-User's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User's locale and preferences." |
| `given_name` | string | "Given name(s) or first name(s) of the End-User. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters." |
| `family_name` | string | "Surname(s) or last name(s) of the End-User. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters." |
| `preferred_username` | string | "Shorthand name by which the End-User wishes to be referred to at the RP, such as janedoe or j.doe. This value MAY be any valid JSON string including special characters such as @, /, or whitespace. The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7." |
| `picture` | string | "URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image." |
| `email` | string | "End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7." |
| `email_verified` | boolean | "True if the End-User's e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed." |
| `locale` | string | "End-User's locale, represented as a BCP47 [RFC5646] language tag. This is typically an ISO 639 Alpha-2 [ISO639] language code in lowercase and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash. For example, en-US or fr-CA." |
| `zoneinfo` | string | "String from IANA Time Zone Database [IANA.time‑zones] representing the End-User's time zone. For example, Europe/Paris or America/Los_Angeles." |
| `phone_number_verified` | boolean | "True if the End-User's phone number has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this phone number was controlled by the End-User at the time the verification was performed." |
| `address` | JSON object | "End-User's preferred postal address. The value of the address member is a JSON [RFC8259] structure containing some or all of the members defined in Section 5.1.1." |

🇻🇳 **Dịch** — bảng trên

| Member | Kiểu | Mô tả |
|---|---|---|
| `sub` | string | "Subject — Định danh của End-User tại Issuer." |
| `name` | string | "Họ tên đầy đủ của End-User ở dạng hiển thị được, gồm mọi thành phần tên, có thể gồm cả danh xưng và hậu tố, sắp xếp theo locale và sở thích của End-User." |
| `given_name` | string | "Tên gọi của End-User. Lưu ý ở một số nền văn hoá, người ta có thể có nhiều tên gọi; tất cả đều có thể xuất hiện, các tên phân cách bằng ký tự khoảng trắng." |
| `family_name` | string | "Họ của End-User. Lưu ý ở một số nền văn hoá, người ta có thể có nhiều họ hoặc không có họ; tất cả đều có thể xuất hiện, phân cách bằng ký tự khoảng trắng." |
| `preferred_username` | string | "Tên gọi ngắn mà End-User muốn được gọi tại RP, ví dụ janedoe hoặc j.doe. Giá trị này CÓ THỂ là bất kỳ chuỗi JSON hợp lệ nào, kể cả ký tự đặc biệt như @, /, hay khoảng trắng. RP KHÔNG ĐƯỢC dựa vào việc giá trị này là duy nhất, như bàn ở Section 5.7." |
| `picture` | string | "URL ảnh đại diện của End-User. URL này PHẢI trỏ tới một file ảnh (ví dụ file PNG, JPEG hay GIF), chứ không trỏ tới một trang Web có chứa ảnh." |
| `email` | string | "Địa chỉ e-mail ưa dùng của End-User. Giá trị của nó PHẢI tuân theo cú pháp addr-spec của RFC 5322 [RFC5322]. RP KHÔNG ĐƯỢC dựa vào việc giá trị này là duy nhất, như bàn ở Section 5.7." |
| `email_verified` | boolean | "True nếu địa chỉ e-mail của End-User đã được xác minh; ngược lại là false. Khi giá trị Claim này là true, nghĩa là OP đã thực hiện các bước khẳng định để đảm bảo địa chỉ e-mail này do End-User kiểm soát tại thời điểm việc xác minh được thực hiện." |
| `locale` | string | "Locale của End-User, biểu diễn dưới dạng thẻ ngôn ngữ BCP47 [RFC5646]. Thường là mã ngôn ngữ ISO 639 Alpha-2 [ISO639] viết thường và mã quốc gia ISO 3166-1 Alpha-2 [ISO3166‑1] viết hoa, phân cách bằng dấu gạch ngang. Ví dụ en-US hoặc fr-CA." |
| `zoneinfo` | string | "Chuỗi lấy từ IANA Time Zone Database [IANA.time‑zones] biểu diễn múi giờ của End-User. Ví dụ Europe/Paris hoặc America/Los_Angeles." |
| `phone_number_verified` | boolean | "True nếu số điện thoại của End-User đã được xác minh; ngược lại là false. Khi giá trị Claim này là true, nghĩa là OP đã thực hiện các bước khẳng định để đảm bảo số điện thoại này do End-User kiểm soát tại thời điểm việc xác minh được thực hiện." |
| `address` | JSON object | "Địa chỉ bưu chính ưa dùng của End-User. Giá trị của member address là một cấu trúc JSON [RFC8259] chứa một phần hoặc toàn bộ các member định nghĩa ở Section 5.1.1." |

### `email_verified` — đọc thật kỹ

> [!danger] Có `email` trong token KHÔNG có nghĩa email đó đã được xác minh
> Hai claim này tách rời nhau có chủ đích. `email` chỉ là "preferred e-mail address" mà OP biết; chỉ khi `email_verified` là `true` thì spec mới khẳng định OP "took affirmative steps to ensure that this e-mail address was controlled by the End-User".
>
> Hệ quả trực tiếp: **không được match tài khoản nội bộ theo `email` nếu `email_verified` không phải `true`.** Nếu một OP cho phép người dùng tự khai email tuỳ ý mà không xác minh, kẻ tấn công khai email của nạn nhân rồi đăng nhập vào app của bạn là chiếm được tài khoản nạn nhân.
>
> Thêm hai ràng buộc nữa từ chính bảng trên: spec nói rõ **"The RP MUST NOT rely upon this value being unique"** cho cả `email` lẫn `preferred_username`. Khoá định danh duy nhất là cặp (`iss`, `sub`) — không phải email.

📖 **Nguyên văn** — Core 1.0 §5.1, `email_verified` (trích riêng, đầy đủ)
> "email_verified
> boolean
> True if the End-User's e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed. The means by which an e-mail address is verified is context specific, and dependent upon the trust framework or contractual agreements within which the parties are operating."

🇻🇳 **Dịch**
> "email_verified
> boolean
> True nếu địa chỉ e-mail của End-User đã được xác minh; ngược lại là false. Khi giá trị Claim này là true, nghĩa là OP đã thực hiện các bước khẳng định để đảm bảo rằng địa chỉ e-mail này do End-User kiểm soát tại thời điểm việc xác minh được thực hiện. Cách thức xác minh một địa chỉ e-mail là tuỳ ngữ cảnh, và phụ thuộc vào trust framework hoặc các thoả thuận hợp đồng mà các bên đang hoạt động trong đó."

💡 **Ví dụ đời sống**
Tờ khai ở quầy ngân hàng có ô "số điện thoại". Bạn viết gì vào đó cũng được — đó là `email`/`phone_number`. Chỉ khi nhân viên gọi vào số đó, bạn bắt máy và đọc đúng mã, thì ô "đã xác minh" mới được tick — đó là `email_verified`/`phone_number_verified`. Ngân hàng nào coi ô tự khai là đã xác minh thì ai cũng khai được số của người khác.

---

## 11. Discovery — `.well-known/openid-configuration`

> **Nguồn:** OpenID Connect Discovery 1.0 incorporating errata set 2 — https://openid.net/specs/openid-connect-discovery-1_0.html

📖 **Nguyên văn** — Discovery 1.0, Abstract (đoạn riêng của Discovery)
> "This specification defines a mechanism for an OpenID Connect Relying Party to discover the End-User's OpenID Provider and obtain information needed to interact with it, including its OAuth 2.0 endpoint locations."

🇻🇳 **Dịch**
> "Specification này định nghĩa một cơ chế để một Relying Party OpenID Connect khám phá ra OpenID Provider của End-User và lấy thông tin cần thiết để tương tác với nó, bao gồm cả vị trí các endpoint OAuth 2.0 của nó."

📖 **Nguyên văn** — Discovery 1.0 §4 Obtaining OpenID Provider Configuration Information
> "Using the Issuer location discovered as described in Section 2 or by other means, the OpenID Provider's configuration information can be retrieved.
>
> OpenID Providers supporting Discovery MUST make a JSON document available at the path formed by concatenating the string /.well-known/openid-configuration to the Issuer. The syntax and semantics of .well-known are defined in RFC 5785 [RFC5785] and apply to the Issuer value when it contains no path component. openid-configuration MUST point to a JSON document compliant with this specification and MUST be returned using the application/json content type."

🇻🇳 **Dịch**
> "Dùng vị trí Issuer đã khám phá được theo mô tả ở Section 2 hoặc bằng cách khác, có thể lấy về thông tin cấu hình của OpenID Provider.
>
> Các OpenID Provider có hỗ trợ Discovery PHẢI cung cấp một tài liệu JSON tại đường dẫn tạo thành bằng cách nối chuỗi /.well-known/openid-configuration vào sau Issuer. Cú pháp và ngữ nghĩa của .well-known được định nghĩa trong RFC 5785 [RFC5785] và áp dụng cho giá trị Issuer khi nó không chứa thành phần path. openid-configuration PHẢI trỏ tới một tài liệu JSON tuân thủ specification này và PHẢI được trả về với content type application/json."

📖 **Nguyên văn** — Discovery 1.0 §4.1, ví dụ non-normative
> ```
> GET /.well-known/openid-configuration HTTP/1.1
> Host: example.com
> ```

🇻🇳 Request lấy metadata của Issuer `https://example.com` — vì Issuer không có thành phần path nên `.well-known` nằm ngay gốc.

📖 **Nguyên văn** — Discovery 1.0 §4.1, trường hợp Issuer có path
> "If the Issuer value contains a path component, any terminating / MUST be removed before appending /.well-known/openid-configuration."
> ```
> GET /issuer1/.well-known/openid-configuration HTTP/1.1
> Host: example.com
> ```
> "Using path components enables supporting multiple issuers per host. This is required in some multi-tenant hosting configurations."

🇻🇳 **Dịch**
> "Nếu giá trị Issuer chứa thành phần path, mọi dấu / kết thúc PHẢI được loại bỏ trước khi nối thêm /.well-known/openid-configuration."
> ```
> GET /issuer1/.well-known/openid-configuration HTTP/1.1
> Host: example.com
> ```
> "Việc dùng thành phần path cho phép hỗ trợ nhiều issuer trên cùng một host. Điều này là cần thiết trong một số cấu hình hosting multi-tenant."

### Các metadata quan trọng nhất

📖 **Nguyên văn** — Discovery 1.0 §3 OpenID Provider Metadata
> "issuer
> REQUIRED. URL using the https scheme with no query or fragment components that the OP asserts as its Issuer Identifier. If Issuer discovery is supported (see Section 2), this value MUST be identical to the issuer value returned by WebFinger. This also MUST be identical to the iss Claim value in ID Tokens issued from this Issuer.
>
> authorization_endpoint
> REQUIRED. URL of the OP's OAuth 2.0 Authorization Endpoint [OpenID.Core]. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
>
> token_endpoint
> URL of the OP's OAuth 2.0 Token Endpoint [OpenID.Core]. This is REQUIRED unless only the Implicit Flow is used. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
>
> userinfo_endpoint
> RECOMMENDED. URL of the OP's UserInfo Endpoint [OpenID.Core]. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
>
> jwks_uri
> REQUIRED. URL of the OP's JWK Set [JWK] document, which MUST use the https scheme. This contains the signing key(s) the RP uses to validate signatures from the OP."

🇻🇳 **Dịch**
> "issuer
> BẮT BUỘC. URL dùng scheme https, không có thành phần query hay fragment, mà OP khẳng định là Issuer Identifier của mình. Nếu Issuer discovery được hỗ trợ (xem Section 2), giá trị này PHẢI y hệt giá trị issuer mà WebFinger trả về. Nó cũng PHẢI y hệt giá trị Claim iss trong các ID Token do Issuer này phát hành.
>
> authorization_endpoint
> BẮT BUỘC. URL của Authorization Endpoint OAuth 2.0 của OP [OpenID.Core]. URL này PHẢI dùng scheme https và CÓ THỂ chứa thành phần port, path, và query parameter.
>
> token_endpoint
> URL của Token Endpoint OAuth 2.0 của OP [OpenID.Core]. Trường này là BẮT BUỘC trừ khi chỉ dùng Implicit Flow. URL này PHẢI dùng scheme https và CÓ THỂ chứa thành phần port, path, và query parameter.
>
> userinfo_endpoint
> KHUYẾN NGHỊ. URL của UserInfo Endpoint của OP [OpenID.Core]. URL này PHẢI dùng scheme https và CÓ THỂ chứa thành phần port, path, và query parameter.
>
> jwks_uri
> BẮT BUỘC. URL của tài liệu JWK Set [JWK] của OP, tài liệu này PHẢI dùng scheme https. Nó chứa (các) signing key mà RP dùng để validate chữ ký từ OP."

📖 **Nguyên văn** — Discovery 1.0 §3, `id_token_signing_alg_values_supported`
> "id_token_signing_alg_values_supported
> REQUIRED. JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT [JWT]. The algorithm RS256 MUST be included. The value none MAY be supported but MUST NOT be used unless the Response Type used returns no ID Token from the Authorization Endpoint (such as when using the Authorization Code Flow)."

🇻🇳 **Dịch**
> "id_token_signing_alg_values_supported
> BẮT BUỘC. Mảng JSON chứa danh sách các thuật toán ký JWS (giá trị alg) mà OP hỗ trợ cho ID Token để mã hoá các Claim trong một JWT [JWT]. Thuật toán RS256 PHẢI được bao gồm. Giá trị none CÓ THỂ được hỗ trợ nhưng KHÔNG ĐƯỢC dùng trừ khi Response Type được dùng không trả ID Token từ Authorization Endpoint (chẳng hạn khi dùng Authorization Code Flow)."

> [!tip] `jwks_uri` là lý do bạn không phải hard-code public key
> RP fetch `.well-known/openid-configuration`, lấy `jwks_uri`, fetch JWK Set, rồi dùng key có `kid` khớp với header của ID Token để validate chữ ký. Nhờ vậy OP xoay vòng khoá (key rotation) mà RP không cần deploy lại. Lưu ý bước mục 2 của ID Token Validation: `issuer` trong metadata phải khớp **chính xác** `iss` trong token — đúng như Discovery §3 khẳng định hai giá trị này phải y hệt nhau.

---

## 12. Bảng so sánh OAuth 2.0 vs OpenID Connect

Mỗi ô dưới đây truy về một câu trích đã xuất hiện ở trên trong bài.

| Khía cạnh | OAuth 2.0 | OpenID Connect | Truy về |
|---|---|---|---|
| Mục đích tự khai | "authorization framework... obtain limited access to an HTTP service" | "a simple identity layer on top of the OAuth 2.0 protocol" | RFC 6749 Abstract (mục 1) · Core Abstract (mục 1) |
| Quan hệ | Nền tảng | Lớp xây **trên** OAuth 2.0 | Core Abstract (mục 1) |
| Token đặc trưng | access token (do authorization server phát) | **ID Token** — "JWT that contains Claims about the Authentication event" | RFC 6749 §1.1 (mục 2) · Core §1.2 (mục 4) |
| Bên tiêu thụ token | resource server — "hosting the protected resources" | RP tự validate ID Token; UserInfo là "an OAuth 2.0 Protected Resource" | RFC 6749 §1.1 (mục 2) · Core §5.3 (mục 9) |
| Vai trò client | "client" | **Relying Party (RP)** — "OAuth 2.0 Client application requiring End-User Authentication and Claims" | RFC 6749 §1.1 · Core §1.2 (mục 2) |
| Vai trò server | "authorization server" | **OpenID Provider (OP)** — "Authorization Server that is capable of Authenticating the End-User" | RFC 6749 §1.1 · Core §1.2 (mục 2) |
| Định dạng token | Không quy định trong RFC 6749 | ID Token là JWT, và "MUST be signed using JWS" | Core §2 (mục 4) |
| Định danh user | Không định nghĩa | `sub` — "locally unique and never reassigned identifier within the Issuer" | Core §2 (mục 4.1) |
| Cách bật | Dùng scope tuỳ hệ thống | Bắt buộc scope `openid`: "OpenID Connect requests MUST contain the openid scope value" | Core §3.1.2.1 (mục 7) |
| Chống replay trên token danh tính | Không có cơ chế tương đương | `nonce` — "to associate a Client session with an ID Token, and to mitigate replay attacks" | Core §2, §3.1.2.1 (mục 8) |
| Lấy thông tin user | Không định nghĩa endpoint chuẩn | **UserInfo Endpoint** + tập **Standard Claims** chuẩn hoá | Core §5.3, §5.1 (mục 9, 10) |
| Tự khám phá cấu hình | Không có trong RFC 6749 | "MUST make a JSON document available at the path formed by concatenating the string /.well-known/openid-configuration to the Issuer" | Discovery §4 (mục 11) |
| Flow được khuyến nghị hôm nay | `code` + PKCE (RFC 9700) | Authorization Code Flow, hoặc `code id_token` — RFC 9700 nêu đích danh | RFC 9700 §2.1.2 (mục 6.2) |

---

## Liên kết

- Bài trước: [[15 - OAuth 2.0]]
- Bài kế: [[17 - SAML]]
- [[15 - OAuth 2.0]] — nền tảng mà OIDC xây lên: các flow, endpoint, PKCE, và lý do RFC 9700 loại implicit grant
- [[14 - JWT]] — cấu trúc và cách validate JWT; ID Token chính là một JWT
- [[10 - Authentication vs Authorization]] — phân biệt "bạn là ai" và "bạn được làm gì", đúng ranh giới giữa OIDC và OAuth 2.0
- [[01 - API là gì và nền tảng HTTP]] — UserInfo Endpoint là một HTTP protected resource bình thường
- [[04 - HTTP Status Code và thiết kế lỗi]] — 401 vs 403 khi token thiếu/sai vs không đủ quyền
- [[08 - OpenAPI Specification]] — Security Scheme Object có kiểu `openIdConnect` để khai báo OIDC trong tài liệu API
- [[02 - What is HTTP]] — redirect, header, query string là nền của toàn bộ luồng Authorization Endpoint

## Nguồn tham khảo

- OpenID Connect Core 1.0 incorporating errata set 2 (December 15, 2023) : https://openid.net/specs/openid-connect-core-1_0.html
- OpenID Connect Discovery 1.0 incorporating errata set 2 : https://openid.net/specs/openid-connect-discovery-1_0.html
- RFC 6749 — The OAuth 2.0 Authorization Framework : https://www.rfc-editor.org/rfc/rfc6749.txt
- RFC 7519 — JSON Web Token (JWT) : https://www.rfc-editor.org/rfc/rfc7519.txt
- RFC 9700 — Best Current Practice for OAuth 2.0 Security (January 2025) : https://www.rfc-editor.org/rfc/rfc9700.txt
