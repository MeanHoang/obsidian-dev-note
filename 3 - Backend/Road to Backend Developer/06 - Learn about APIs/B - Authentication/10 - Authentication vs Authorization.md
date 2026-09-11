# 10 — Authentication vs Authorization

> **Nguồn chính:** RFC 9110 §11 "HTTP Authentication" — https://www.rfc-editor.org/rfc/rfc9110.txt
> **Nguồn phụ:** OWASP Authentication Cheat Sheet, OWASP Authorization Cheat Sheet, OWASP Session Management Cheat Sheet, RFC 6749 (OAuth 2.0)
> Bài mở đầu đợt B: dựng bộ khái niệm nền (authentication, authorization, challenge, credentials, realm, 401 vs 403) mà 7 bài sau đều cắm vào.

---

## 1. Hai khái niệm bị lẫn lộn nhiều nhất

### 1.1. Authentication — bạn là ai?

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Introduction*)
> "Authentication (AuthN) is the process of verifying that an individual, entity, or website is who or what it claims to be by determining the validity of one or more authenticators (like passwords, fingerprints, or security tokens) that are used to back up this claim."

🇻🇳 **Dịch**
> "Authentication (AuthN) là quá trình xác minh rằng một cá nhân, thực thể hay website đúng là cái mà nó tự nhận, bằng cách xác định tính hợp lệ của một hoặc nhiều authenticator (như password, vân tay, hay security token) dùng để chống lưng cho lời tự nhận đó."

### 1.2. Authorization — bạn được làm gì?

📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, mục *Introduction*)
> "Authorization may be defined as "the process of verifying that a requested action or service is approved for a specific entity" (NIST). Authorization is distinct from authentication which is the process of verifying an entity's identity."

🇻🇳 **Dịch**
> "Authorization có thể được định nghĩa là "quá trình xác minh rằng một hành động hoặc dịch vụ được yêu cầu có được chấp thuận cho một thực thể cụ thể hay không" (NIST). Authorization khác biệt với authentication — vốn là quá trình xác minh danh tính của một thực thể."

📖 **Nguyên văn** (cùng mục, phần làm rõ quan hệ hai chiều)
> "A user who has been authenticated (perhaps by providing a username and password) is often not authorized to access every resource and perform every action that is technically possible through a system. For example, a web app may have both regular users and admins, with the admins being able to perform actions the average user is not privileged to perform, even though they have been authenticated. Additionally, authentication is not always required for accessing resources; an unauthenticated user may be authorized to access certain public resources, such as an image or login page, or even an entire web app."

🇻🇳 **Dịch**
> "Một user đã được authenticate (chẳng hạn bằng cách cung cấp username và password) thường vẫn KHÔNG được authorize để truy cập mọi resource và thực hiện mọi hành động mà hệ thống về mặt kỹ thuật có thể làm. Ví dụ, một web app có thể có cả user thường lẫn admin, trong đó admin làm được những hành động mà user thường không có đặc quyền thực hiện, dù cả hai đều đã được authenticate. Ngoài ra, authentication không phải lúc nào cũng bắt buộc để truy cập resource; một user chưa authenticate vẫn có thể được authorize để truy cập một số public resource, chẳng hạn một ảnh hay trang login, hoặc thậm chí cả một web app."

💡 **Ví dụ đời sống**

Bạn tới toà nhà văn phòng công ty:

- **Authentication = bảo vệ ở cổng kiểm tra CMND/CCCD của bạn.** Câu hỏi duy nhất ở đây: "Người đứng trước mặt tôi có đúng là Hoàng không?" Kiểm xong, bảo vệ biết bạn là ai — và chỉ có vậy.
- **Authorization = thẻ nhân viên của bạn quẹt mở được những phòng nào.** Bạn đã được xác minh đúng là Hoàng rồi, nhưng thẻ của Hoàng quẹt được tầng 5 (phòng dev), không quẹt được phòng server và cũng không mở được tủ hồ sơ lương.

Hai chuyện này độc lập:

- Xác minh đúng người nhưng vẫn bị chặn cửa → authentication OK, authorization từ chối (tương ứng HTTP **403**).
- Quên mang CMND, bảo vệ không biết bạn là ai → chưa authenticate được (tương ứng HTTP **401**).
- Sảnh tiếp khách ai cũng vào được, không cần CMND → resource public, không yêu cầu authentication nhưng vẫn có authorization (mặc định "cho phép").

### 1.3. Bảng đối chiếu

| | **Authentication (AuthN)** | **Authorization (AuthZ)** |
|---|---|---|
| Câu hỏi trả lời | Bạn **là ai**? | Bạn **được làm gì**? |
| Định nghĩa nguồn | "verifying that an individual, entity, or website is who or what it claims to be" (OWASP) | "the process of verifying that a requested action or service is approved for a specific entity" (NIST, dẫn trong OWASP) |
| Đầu vào | Credentials: password, vân tay, security token | Danh tính đã xác minh + resource + action được yêu cầu |
| Kết quả | Một danh tính (hoặc thất bại) | Cho phép / từ chối |
| Xảy ra khi nào | Thường một lần, đầu phiên | **Mọi request** (xem §5.2) |
| HTTP status khi thất bại | `401 Unauthorized` | `403 Forbidden` |
| Header HTTP liên quan | `WWW-Authenticate`, `Authorization` | (không có header chuẩn riêng — là logic của application) |
| Có bắt buộc không | Không, resource public bỏ qua được | **Luôn phải quyết định**, kể cả khi không có rule nào khớp (deny by default) |

> [!warning] Tên header HTTP `Authorization` là một cái bẫy đặt tên
> Header tên `Authorization` nhưng nhiệm vụ của nó theo RFC 9110 §11.6.2 lại là **authenticate**: "The "Authorization" header field allows a user agent to authenticate itself with an origin server". Tương tự, status code `401` tên là `Unauthorized` nhưng nghĩa thật là "thiếu authentication credentials hợp lệ". Đây là di sản đặt tên từ HTTP đời đầu, không phải bạn hiểu sai.

---

## 2. Cảnh báo đọc trước: OAuth 2.0 là framework **authorization**

Đây là hiểu nhầm phổ biến nhất của cả chủ đề, nên nói trước ở bài 10 để khi tới bài OAuth bạn không đọc lệch.

📖 **Nguyên văn** (RFC 6749, tiêu đề và *Abstract*)
> "                 The OAuth 2.0 Authorization Framework
>
> Abstract
>
>    The OAuth 2.0 authorization framework enables a third-party
>    application to obtain limited access to an HTTP service, either on
>    behalf of a resource owner by orchestrating an approval interaction
>    between the resource owner and the HTTP service, or by allowing the
>    third-party application to obtain access on its own behalf."

🇻🇳 **Dịch**
> "OAuth 2.0 Authorization Framework
>
> Tóm tắt
>
> Authorization framework OAuth 2.0 cho phép một ứng dụng bên thứ ba lấy được quyền truy cập **giới hạn** vào một HTTP service, hoặc là thay mặt một resource owner bằng cách điều phối một tương tác phê duyệt giữa resource owner và HTTP service đó, hoặc là cho phép ứng dụng bên thứ ba lấy quyền truy cập nhân danh chính nó."

Tức là: **chính spec tự gọi mình là "authorization framework"**, không phải "authentication protocol". Đây là trích dẫn nguyên văn, không phải nhận định của tôi.

📖 **Nguyên văn** (RFC 6749 §1 *Introduction*)
> "OAuth addresses these issues by introducing an authorization layer and separating the role of the client from that of the resource owner.  In OAuth, the client requests access to resources controlled by the resource owner and hosted by the resource server, and is issued a different set of credentials than those of the resource owner."

🇻🇳 **Dịch**
> "OAuth giải quyết những vấn đề này bằng cách đưa vào một **authorization layer** và tách vai trò của client khỏi vai trò của resource owner. Trong OAuth, client yêu cầu quyền truy cập tới các resource do resource owner kiểm soát và do resource server lưu trữ, và được cấp một bộ credentials KHÁC với credentials của resource owner."

OWASP nói thẳng cùng ý, và chỉ ra cái gì mới là phần authentication:

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *OAuth 2.0 and 2.1* và *OpenID Connect (OIDC)*)
> "OAuth is an authorization framework for delegated access to APIs."
>
> "OpenID Connect 1.0 (OIDC) is an identity layer on top of OAuth. It defines how a client (relying party) verifies the end user's identity using an ID Token (a signed JWT) and how to obtain user claims in an interoperable way. Use OIDC for authentication/SSO; use OAuth for authorization to APIs."

🇻🇳 **Dịch**
> "OAuth là một authorization framework dành cho việc uỷ quyền truy cập (delegated access) tới các API."
>
> "OpenID Connect 1.0 (OIDC) là một **identity layer nằm trên OAuth**. Nó định nghĩa cách một client (relying party) xác minh danh tính của end user bằng một ID Token (một JWT đã ký) và cách lấy các claim về user theo cách tương thích chuẩn. **Dùng OIDC cho authentication/SSO; dùng OAuth cho authorization tới API.**"

> [!danger] Đừng dùng OAuth 2.0 trần để "đăng nhập"
> Một access token của OAuth 2.0 nói rằng "client này được phép gọi API kia trong phạm vi scope này". Nó **không** phải là một khẳng định đã ký về việc "người dùng này là ai" gửi cho ứng dụng của bạn. Muốn authentication thì dùng lớp OIDC ở trên, với ID Token và các bước validate mà OWASP liệt kê:
>
> 📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *OIDC implementation guidance*)
> > "Validate ID Tokens on the relying party: issuer (iss), audience (aud), signature (per provider JWKs), expiration (exp)."
>
> 🇻🇳 **Dịch**
> > "Validate ID Token ở phía relying party: issuer (`iss`), audience (`aud`), chữ ký (theo JWKs của provider), thời hạn (`exp`)."

---

## 3. HTTP Authentication framework — RFC 9110 §11

Đây là cái khung chung mà Basic auth và Bearer token đều chỉ là "plugin" cắm vào. Hiểu khung này thì 7 bài sau đọc rất nhanh.

### 3.1. Authentication scheme

📖 **Nguyên văn** (RFC 9110 §11.1)
> "HTTP provides a general framework for access control and
>    authentication, via an extensible set of challenge-response
>    authentication schemes, which can be used by a server to challenge a
>    client request and by a client to provide authentication information.
>    It uses a case-insensitive token to identify the authentication
>    scheme:
>
>      auth-scheme    = token
>
>    Aside from the general framework, this document does not specify any
>    authentication schemes.  New and existing authentication schemes are
>    specified independently and ought to be registered within the
>    "Hypertext Transfer Protocol (HTTP) Authentication Scheme Registry".
>    For example, the "basic" and "digest" authentication schemes are
>    defined by [RFC7617] and [RFC7616], respectively."

🇻🇳 **Dịch**
> "HTTP cung cấp một framework tổng quát cho access control và authentication, thông qua một tập **authentication scheme kiểu challenge-response** có thể mở rộng, được server dùng để thách đố (challenge) một request của client và được client dùng để cung cấp thông tin authentication. Nó dùng một token không phân biệt hoa thường để định danh authentication scheme:
>
> `auth-scheme = token`
>
> Ngoài khung tổng quát đó, tài liệu này **không định nghĩa bất kỳ authentication scheme nào**. Các scheme mới và cũ được đặc tả độc lập và nên được đăng ký trong "Hypertext Transfer Protocol (HTTP) Authentication Scheme Registry". Ví dụ, scheme "basic" và "digest" lần lượt được định nghĩa bởi [RFC7617] và [RFC7616]."

💡 **Ví dụ đời sống**
RFC 9110 giống như quy định "ở cổng toà nhà phải có một quầy kiểm tra, bảo vệ hỏi giấy tờ, khách xuất trình giấy tờ". Nó **không** quy định giấy tờ đó là CMND, hộ chiếu hay thẻ nhân viên — mỗi loại giấy tờ là một *scheme* riêng, do quy định riêng định nghĩa (`Basic` ở RFC 7617, `Bearer` ở RFC 6750...).

### 3.2. Challenge và Response

📖 **Nguyên văn** (RFC 9110 §11.3)
> "A 401 (Unauthorized) response message is used by an origin server to
>    challenge the authorization of a user agent, including a
>    WWW-Authenticate header field containing at least one challenge
>    applicable to the requested resource.
>
>    A 407 (Proxy Authentication Required) response message is used by a
>    proxy to challenge the authorization of a client, including a
>    Proxy-Authenticate header field containing at least one challenge
>    applicable to the proxy for the requested resource.
>
>      challenge   = auth-scheme [ 1*SP ( token68 / #auth-param ) ]"

🇻🇳 **Dịch**
> "Một response `401 (Unauthorized)` được origin server dùng để thách đố authorization của user agent, kèm theo header `WWW-Authenticate` chứa ít nhất một challenge áp dụng cho resource được yêu cầu.
>
> Một response `407 (Proxy Authentication Required)` được proxy dùng để thách đố authorization của client, kèm theo header `Proxy-Authenticate` chứa ít nhất một challenge áp dụng cho proxy đối với resource được yêu cầu.
>
> `challenge = auth-scheme [ 1*SP ( token68 / #auth-param ) ]` — tức một challenge = tên scheme, rồi tới tham số."

📖 **Nguyên văn** (RFC 9110 §11.3, tiếp)
> "A user agent that wishes to authenticate itself with an origin server
>    -- usually, but not necessarily, after receiving a 401 (Unauthorized)
>    -- can do so by including an Authorization header field with the
>    request.
>
>    A client that wishes to authenticate itself with a proxy -- usually,
>    but not necessarily, after receiving a 407 (Proxy Authentication
>    Required) -- can do so by including a Proxy-Authorization header
>    field with the request."

🇻🇳 **Dịch**
> "Một user agent muốn tự authenticate với origin server — **thường, nhưng không nhất thiết**, sau khi nhận `401 (Unauthorized)` — có thể làm vậy bằng cách đính header `Authorization` vào request.
>
> Một client muốn tự authenticate với proxy — thường, nhưng không nhất thiết, sau khi nhận `407 (Proxy Authentication Required)` — có thể làm vậy bằng cách đính header `Proxy-Authorization` vào request."

> [!note] "không nhất thiết" là chỗ API thực tế hay đi
> Phần lớn API ngày nay không chờ bị challenge: client gửi thẳng `Authorization: Bearer <token>` ngay từ request đầu tiên. RFC cho phép điều đó — vòng challenge chỉ là *thường gặp*, không bắt buộc.

### 3.3. Credentials

📖 **Nguyên văn** (RFC 9110 §11.4)
> "Both the Authorization field value and the Proxy-Authorization field
>    value contain the client's credentials for the realm of the resource
>    being requested, based upon a challenge received in a response
>    (possibly at some point in the past).  When creating their values,
>    the user agent ought to do so by selecting the challenge with what it
>    considers to be the most secure auth-scheme that it understands,
>    obtaining credentials from the user as appropriate.  Transmission of
>    credentials within header field values implies significant security
>    considerations regarding the confidentiality of the underlying
>    connection, as described in Section 17.16.1.
>
>      credentials = auth-scheme [ 1*SP ( token68 / #auth-param ) ]"

🇻🇳 **Dịch**
> "Cả giá trị của field `Authorization` lẫn `Proxy-Authorization` đều chứa credentials của client cho realm của resource đang được yêu cầu, dựa trên một challenge đã nhận trong một response (có thể từ lúc nào đó trong quá khứ). Khi tạo giá trị này, user agent nên chọn challenge có auth-scheme mà nó cho là **an toàn nhất trong số nó hiểu được**, rồi lấy credentials từ người dùng cho phù hợp. Việc truyền credentials bên trong giá trị header kéo theo những cân nhắc bảo mật đáng kể về tính bí mật của kết nối bên dưới, như mô tả ở Section 17.16.1.
>
> `credentials = auth-scheme [ 1*SP ( token68 / #auth-param ) ]` — credentials có cú pháp cùng dạng với challenge."

> [!danger] Credentials nằm trần trong header → bắt buộc TLS
> Chính RFC chỉ ra credentials trong header phụ thuộc hoàn toàn vào tính bí mật của kết nối bên dưới. OWASP nói cụ thể hơn:
>
> 📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Transmit Passwords Only Over TLS or Other Strong Transport*)
> > "The login page and all subsequent authenticated pages must be exclusively accessed over TLS or other strong transport. Failure to utilize TLS or other strong transport for the login page allows an attacker to modify the login form action, causing the user's credentials to be posted to an arbitrary location. Failure to utilize TLS or other strong transport for authenticated pages after login enables an attacker to view the unencrypted session ID and compromise the user's authenticated session."
>
> 🇻🇳 **Dịch**
> > "Trang login và **tất cả** các trang đã authenticate sau đó phải được truy cập độc quyền qua TLS hoặc transport mạnh khác. Không dùng TLS cho trang login cho phép attacker sửa action của form login, khiến credentials của user bị POST tới một địa chỉ tuỳ ý. Không dùng TLS cho các trang đã authenticate sau khi login cho phép attacker nhìn thấy session ID không mã hoá và chiếm đoạt phiên đã authenticate của user."

### 3.4. `WWW-Authenticate` và `Authorization`

📖 **Nguyên văn** (RFC 9110 §11.6.1)
> "The "WWW-Authenticate" response header field indicates the
>    authentication scheme(s) and parameters applicable to the target
>    resource.
>
>      WWW-Authenticate = #challenge
>
>    A server generating a 401 (Unauthorized) response MUST send a WWW-
>    Authenticate header field containing at least one challenge.  A
>    server MAY generate a WWW-Authenticate header field in other response
>    messages to indicate that supplying credentials (or different
>    credentials) might affect the response."

🇻🇳 **Dịch**
> "Header response `"WWW-Authenticate"` cho biết (các) authentication scheme và tham số áp dụng cho target resource.
>
> `WWW-Authenticate = #challenge` (một danh sách challenge)
>
> Một server sinh ra response `401 (Unauthorized)` **PHẢI (MUST)** gửi header `WWW-Authenticate` chứa ít nhất một challenge. Server **CÓ THỂ (MAY)** sinh header `WWW-Authenticate` trong các response khác để cho biết rằng việc cung cấp credentials (hoặc credentials khác) có thể làm thay đổi response."

📖 **Nguyên văn** (RFC 9110 §11.6.1, ví dụ)
> "   WWW-Authenticate: Basic realm="simple", Newauth realm="apps",
>                    type=1, title="Login to \"apps\""
>
>    This header field contains two challenges, one for the "Basic" scheme
>    with a realm value of "simple" and another for the "Newauth" scheme
>    with a realm value of "apps"."

🇻🇳 **Dịch**
> "Header này chứa hai challenge: một cho scheme `"Basic"` với realm là `"simple"`, và một cho scheme `"Newauth"` với realm là `"apps"`." — tức server có thể chào nhiều scheme cùng lúc để client tự chọn.

📖 **Nguyên văn** (RFC 9110 §11.6.2)
> "The "Authorization" header field allows a user agent to authenticate
>    itself with an origin server -- usually, but not necessarily, after
>    receiving a 401 (Unauthorized) response.  Its value consists of
>    credentials containing the authentication information of the user
>    agent for the realm of the resource being requested.
>
>      Authorization = credentials
>
>    If a request is authenticated and a realm specified, the same
>    credentials are presumed to be valid for all other requests within
>    this realm"
>
> "A proxy forwarding a request MUST NOT modify any Authorization header
>    fields in that request."

🇻🇳 **Dịch**
> "Header `"Authorization"` cho phép một user agent tự authenticate với origin server — thường, nhưng không nhất thiết, sau khi nhận response `401 (Unauthorized)`. Giá trị của nó là credentials chứa thông tin authentication của user agent cho realm của resource đang được yêu cầu.
>
> `Authorization = credentials`
>
> Nếu một request đã được authenticate và có chỉ định realm, thì **cùng bộ credentials được giả định là hợp lệ cho mọi request khác trong realm đó**."
>
> "Một proxy khi forward request **KHÔNG ĐƯỢC (MUST NOT)** sửa bất kỳ header `Authorization` nào trong request đó."

### 3.5. `Proxy-Authenticate` / `Proxy-Authorization`

📖 **Nguyên văn** (RFC 9110 §11.7.1)
> "The "Proxy-Authenticate" header field consists of at least one
>    challenge that indicates the authentication scheme(s) and parameters
>    applicable to the proxy for this request.  A proxy MUST send at least
>    one Proxy-Authenticate header field in each 407 (Proxy Authentication
>    Required) response that it generates.
>
>      Proxy-Authenticate = #challenge
>
>    Unlike WWW-Authenticate, the Proxy-Authenticate header field applies
>    only to the next outbound client on the response chain."

🇻🇳 **Dịch**
> "Header `"Proxy-Authenticate"` gồm ít nhất một challenge cho biết (các) authentication scheme và tham số áp dụng cho **proxy** đối với request này. Một proxy **PHẢI (MUST)** gửi ít nhất một header `Proxy-Authenticate` trong mỗi response `407 (Proxy Authentication Required)` mà nó sinh ra.
>
> `Proxy-Authenticate = #challenge`
>
> Khác với `WWW-Authenticate`, header `Proxy-Authenticate` chỉ áp dụng cho client kế tiếp theo hướng ra trên chuỗi response."

📖 **Nguyên văn** (RFC 9110 §11.7.2)
> "The "Proxy-Authorization" header field allows the client to identify
>    itself (or its user) to a proxy that requires authentication.
>
>      Proxy-Authorization = credentials
>
>    Unlike Authorization, the Proxy-Authorization header field applies
>    only to the next inbound proxy that demanded authentication using the
>    Proxy-Authenticate header field."

🇻🇳 **Dịch**
> "Header `"Proxy-Authorization"` cho phép client tự định danh (hoặc định danh user của nó) với một proxy yêu cầu authentication.
>
> `Proxy-Authorization = credentials`
>
> Khác với `Authorization`, header `Proxy-Authorization` chỉ áp dụng cho proxy kế tiếp theo hướng vào — cái proxy đã đòi authentication bằng header `Proxy-Authenticate`."

💡 **Ví dụ đời sống**
Hai cặp header này là hai lớp cổng khác nhau: `Proxy-*` là **bảo vệ ở cổng khu công nghiệp** (proxy của công ty/ISP, chỉ hỏi để cho bạn đi qua khu), còn `WWW-Authenticate`/`Authorization` là **lễ tân của chính toà nhà bạn định vào** (origin server). Qua cổng khu không có nghĩa là vào được toà nhà.

### 3.6. `realm` — không gian bảo vệ

📖 **Nguyên văn** (RFC 9110 §11.5)
> "The "realm" authentication parameter is reserved for use by
>    authentication schemes that wish to indicate a scope of protection.
>
>    A "protection space" is defined by the origin (see Section 4.3.1) of
>    the server being accessed, in combination with the realm value if
>    present.  These realms allow the protected resources on a server to
>    be partitioned into a set of protection spaces, each with its own
>    authentication scheme and/or authorization database.  The realm value
>    is a string, generally assigned by the origin server, that can have
>    additional semantics specific to the authentication scheme."

🇻🇳 **Dịch**
> "Tham số authentication `"realm"` được dành riêng cho các authentication scheme muốn chỉ ra một **phạm vi bảo vệ**.
>
> Một `"protection space"` (không gian bảo vệ) được xác định bởi origin của server đang được truy cập, kết hợp với giá trị realm nếu có. Các realm này cho phép chia các protected resource trên một server thành nhiều protection space, **mỗi cái có authentication scheme và/hoặc authorization database riêng**. Giá trị realm là một chuỗi, thường do origin server gán, và có thể mang thêm ngữ nghĩa riêng của từng authentication scheme."

📖 **Nguyên văn** (RFC 9110 §11.5, tiếp)
> "The protection space determines the domain over which credentials can
>    be automatically applied.  If a prior request has been authorized,
>    the user agent MAY reuse the same credentials for all other requests
>    within that protection space"
>
> "Unless specifically allowed by the authentication scheme, a
>    single protection space cannot extend outside the scope of its
>    server."

🇻🇳 **Dịch**
> "Protection space quyết định miền mà credentials có thể được áp dụng tự động. Nếu một request trước đó đã được authorize, user agent **CÓ THỂ (MAY)** tái sử dụng cùng bộ credentials cho mọi request khác trong protection space đó."
>
> "Trừ khi authentication scheme cho phép rõ ràng, **một protection space không thể mở rộng ra ngoài phạm vi server của nó**."

💡 **Ví dụ đời sống**
`realm` là "khu vực" trên tấm biển ở cửa: *"Khu A — Kho hàng"* và *"Khu B — Kế toán"*. Cùng một toà nhà (cùng origin) nhưng hai khu dùng danh sách người được vào khác nhau. Quẹt thẻ mở được Khu A thì trình viên bảo vệ Khu A khỏi hỏi lại — đó chính là "credentials được tự động áp dụng trong protection space".

### 3.7. HTTP không bắt buộc bạn dùng khung này

📖 **Nguyên văn** (RFC 9110 §11.4, cuối mục)
> "HTTP does not restrict applications to this simple challenge-response
>    framework for access authentication.  Additional mechanisms can be
>    used, such as authentication at the transport level or via message
>    encapsulation, and with additional header fields specifying
>    authentication information.  However, such additional mechanisms are
>    not defined by this specification.
>
>    Note that various custom mechanisms for user authentication use the
>    Set-Cookie and Cookie header fields, defined in [COOKIE], for passing
>    tokens related to authentication."

🇻🇳 **Dịch**
> "HTTP **không giới hạn** ứng dụng phải dùng framework challenge-response đơn giản này cho access authentication. Có thể dùng thêm các cơ chế khác, như authentication ở tầng transport hoặc qua việc bọc message, kèm các header bổ sung chỉ định thông tin authentication. Tuy nhiên, những cơ chế bổ sung đó không được định nghĩa trong specification này.
>
> Lưu ý rằng nhiều cơ chế authentication user tuỳ biến sử dụng các header `Set-Cookie` và `Cookie`, định nghĩa ở [COOKIE], để truyền các token liên quan tới authentication."

Đoạn cuối này chính là lý do session/cookie auth — thứ chiếm đa số web app — **không** nằm trong §11: nó là "cơ chế tuỳ biến" dùng `Cookie`, được RFC 9110 công nhận sự tồn tại nhưng không đặc tả.

---

## 4. `401` vs `403` — trích nguyên văn cho hết cãi

Xem thêm [[04 - HTTP Status Code và thiết kế lỗi]] về cách thiết kế body lỗi.

### 4.1. 401 Unauthorized

📖 **Nguyên văn** (RFC 9110 §15.5.2)
> "The 401 (Unauthorized) status code indicates that the request has not
>    been applied because it lacks valid authentication credentials for
>    the target resource.  The server generating a 401 response MUST send
>    a WWW-Authenticate header field (Section 11.6.1) containing at least
>    one challenge applicable to the target resource.
>
>    If the request included authentication credentials, then the 401
>    response indicates that authorization has been refused for those
>    credentials.  The user agent MAY repeat the request with a new or
>    replaced Authorization header field (Section 11.6.2)."

🇻🇳 **Dịch**
> "Status code `401 (Unauthorized)` cho biết request **chưa được thực thi vì nó thiếu authentication credentials hợp lệ** cho target resource. Server sinh ra response 401 **PHẢI (MUST)** gửi header `WWW-Authenticate` chứa ít nhất một challenge áp dụng cho target resource.
>
> Nếu request đã có kèm authentication credentials, thì response 401 cho biết authorization đã bị từ chối đối với bộ credentials đó. User agent **CÓ THỂ (MAY)** lặp lại request với header `Authorization` mới hoặc đã thay."

### 4.2. 403 Forbidden

📖 **Nguyên văn** (RFC 9110 §15.5.4)
> "The 403 (Forbidden) status code indicates that the server understood
>    the request but refuses to fulfill it.  A server that wishes to make
>    public why the request has been forbidden can describe that reason in
>    the response content (if any).
>
>    If authentication credentials were provided in the request, the
>    server considers them insufficient to grant access.  The client
>    SHOULD NOT automatically repeat the request with the same
>    credentials.  The client MAY repeat the request with new or different
>    credentials.  However, a request might be forbidden for reasons
>    unrelated to the credentials.
>
>    An origin server that wishes to "hide" the current existence of a
>    forbidden target resource MAY instead respond with a status code of
>    404 (Not Found)."

🇻🇳 **Dịch**
> "Status code `403 (Forbidden)` cho biết server **đã hiểu request nhưng từ chối thực hiện nó**. Server nào muốn công khai lý do request bị cấm thì có thể mô tả lý do đó trong response content (nếu có).
>
> Nếu request có kèm authentication credentials, server coi chúng là **không đủ** để cấp quyền truy cập. Client **KHÔNG NÊN (SHOULD NOT)** tự động lặp lại request với cùng bộ credentials. Client **CÓ THỂ (MAY)** lặp lại request với credentials mới hoặc khác. Tuy nhiên, một request có thể bị cấm vì những lý do **không liên quan gì tới credentials**.
>
> Một origin server muốn "giấu" sự tồn tại của một target resource bị cấm **CÓ THỂ (MAY)** trả về status code `404 (Not Found)` thay thế."

### 4.3. Quy tắc chọn

📖 **Nguyên văn** (RFC 9110 §11.4 — câu chốt phân định)
> "A server that receives valid credentials that are not adequate to
>    gain access ought to respond with the 403 (Forbidden) status code
>    (Section 15.5.4)."

🇻🇳 **Dịch**
> "Một server nhận được credentials **hợp lệ nhưng không đủ** để giành quyền truy cập thì **nên (ought to)** trả về status code `403 (Forbidden)`."

| Tình huống | Status | Bắt buộc kèm |
|---|---|---|
| Không gửi credentials | `401` | `WWW-Authenticate` (MUST) |
| Credentials sai / hết hạn / không parse được | `401` | `WWW-Authenticate` (MUST) |
| Credentials **hợp lệ** nhưng không đủ quyền | `403` | — |
| Bị cấm vì lý do không liên quan credentials (IP blocklist, kill switch...) | `403` | — |
| Muốn giấu luôn sự tồn tại của resource | `404` (thay cho `403`) | — |
| Proxy đòi authentication | `407` | `Proxy-Authenticate` (MUST) |

> [!tip] `401` mà quên `WWW-Authenticate` là sai spec
> Rất nhiều API JSON trả `401` trần. Theo RFC 9110 §15.5.2 đó là vi phạm `MUST`. Với Bearer token, header tối thiểu chỉ là tên scheme cộng realm — ví dụ dạng `WWW-Authenticate: Bearer realm="..."` theo đúng grammar `challenge = auth-scheme [ 1*SP ( token68 / #auth-param ) ]` ở §11.3.

> [!note] Mẹo nhớ: hai cái tên đều đặt ngược
> `401 Unauthorized` = **thiếu authentication**. `403 Forbidden` = **thiếu authorization**. Tên nói một đằng, nghĩa một nẻo — cứ bám định nghĩa nguyên văn ở trên chứ đừng bám tên.

---

## 5. Bản đồ 7 bài tới

### 5.1. Mỗi cơ chế một dòng

| Cơ chế | Một dòng |
|---|---|
| **Basic** | Authentication scheme của HTTP (RFC 7617), gửi `user:password` base64 trong `Authorization` — nằm trực tiếp trong khung §11 ở trên. |
| **Session / Cookie** | Server giữ state phiên, phát session ID qua header `Cookie` — đúng loại "custom mechanism" mà RFC 9110 §11.4 nhắc tới, không phải auth-scheme. |
| **Token / Bearer** | Client cầm một token do server phát và đính vào `Authorization`; Bearer là auth-scheme đăng ký trong registry của §11.1. |
| **JWT** | Một **định dạng token** đã ký (không phải cơ chế auth): quy định cách đóng gói claim, thường được dùng làm nội dung của Bearer token hoặc ID Token. |
| **OAuth 2.0** | **Authorization framework** cho delegated access tới API — RFC 6749 tự gọi mình như vậy (xem §2). |
| **OpenID Connect** | "an identity layer on top of OAuth" (OWASP) — lớp **authentication**/SSO chồng lên OAuth, dùng ID Token. |
| **SAML** | Protocol federation dựa trên XML và browser redirect, phổ biến trong enterprise SSO. |

📖 **Nguyên văn** (OWASP Session Management Cheat Sheet, mục *Introduction*)
> "A web session is a sequence of network HTTP request and response transactions associated with the same user."
>
> "Once an authenticated session has been established, the session ID (or token) is temporarily equivalent to the strongest authentication method used by the application, such as username and password, passphrases, one-time passwords (OTP), client-based digital certificates, smartcards, or biometrics (such as fingerprint or eye retina)."

🇻🇳 **Dịch**
> "Một web session là một chuỗi các giao dịch request và response HTTP gắn với **cùng một user**."
>
> "Một khi phiên đã authenticate được thiết lập, session ID (hay token) **tạm thời tương đương với phương thức authentication mạnh nhất** mà ứng dụng dùng, chẳng hạn username và password, passphrase, one-time password (OTP), digital certificate phía client, smartcard, hay sinh trắc học (như vân tay hay võng mạc)."

> [!danger] Hệ quả: session ID rò rỉ = password rò rỉ
> Vì session ID "tạm thời tương đương" với phương thức authentication mạnh nhất, việc để lộ nó nguy hiểm ngang để lộ password. OWASP nói rõ hậu quả:
>
> 📖 **Nguyên văn** (OWASP Session Management Cheat Sheet, *Introduction*)
> > "The disclosure, capture, prediction, brute force, or fixation of the session ID will lead to session hijacking (or sidejacking) attacks, where an attacker is able to fully impersonate a victim user in the web application."
>
> 🇻🇳 **Dịch**
> > "Việc để lộ, bắt được, đoán được, brute force, hay fixation session ID sẽ dẫn tới tấn công session hijacking (hay sidejacking), trong đó attacker có thể **mạo danh hoàn toàn** user nạn nhân trong web application."

### 5.2. Bảng phân loại — cái nào thuộc loại gì

Đây là bảng nên dán lên tường. Nhầm cột ở đây là gốc của hầu hết lỗi thiết kế auth.

| Cơ chế | AuthN | AuthZ | Định dạng token | Federation / SSO |
|---|:---:|:---:|:---:|:---:|
| Basic (RFC 7617) | ✅ | — | — | — |
| Session / Cookie | ✅ (duy trì trạng thái đã AuthN) | — | — | — |
| Bearer token (RFC 6750) | ✅ khi token đại diện user | ✅ khi token mang scope | — | — |
| JWT | — | — | ✅ | — |
| OAuth 2.0 | ❌ **không phải AuthN** | ✅ | — | một phần (delegated access) |
| OpenID Connect | ✅ | (kế thừa OAuth bên dưới) | dùng JWT làm ID Token | ✅ |
| SAML 2.0 | ✅ | (qua attribute/assertion) | XML assertion | ✅ |

> [!warning] JWT không phải là "một kiểu authentication"
> JWT chỉ là **cách đóng gói và ký dữ liệu**. Câu "app của tôi dùng JWT auth" không nói được gì về việc token lấy từ đâu, sống bao lâu, thu hồi kiểu gì — mà đó mới là những thứ quyết định an toàn hay không.

---

## 6. Khuyến nghị nền từ OWASP

Những mục dưới đây áp dụng cho mọi cơ chế ở §5, nên đặt ở bài mở đầu.

### 6.1. Không tự viết chỗ lưu password

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Store Passwords in a Secure Fashion*)
> "It is critical for an application to store a password using the right cryptographic technique. Please see Password Storage Cheat Sheet for details on this feature."

🇻🇳 **Dịch**
> "Việc một ứng dụng lưu password bằng đúng kỹ thuật mật mã là **cực kỳ then chốt**. Xem Password Storage Cheat Sheet để biết chi tiết về tính năng này."

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Compare Password Hashes Using Safe Functions*)
> "Where possible, the user-supplied password should be compared to the stored password hash using a secure password comparison function provided by the language or framework, such as the password_verify() function in PHP. Where this is not possible, ensure that the comparison function:
>
> Has a maximum input length, to protect against denial of service attacks with very long inputs.
>
> Explicitly sets the type of both variables, to protect against type confusion attacks such as Magic Hashes in PHP.
>
> Returns in constant time, to protect against timing attacks."

🇻🇳 **Dịch**
> "Khi có thể, password do user cung cấp nên được so sánh với password hash đã lưu bằng một hàm so sánh password an toàn do ngôn ngữ hoặc framework cung cấp, ví dụ hàm `password_verify()` trong PHP. Khi không làm được vậy, hãy đảm bảo hàm so sánh:
>
> - Có **độ dài input tối đa**, để chống tấn công từ chối dịch vụ bằng input rất dài.
> - **Đặt kiểu rõ ràng cho cả hai biến**, để chống tấn công type confusion như Magic Hashes trong PHP.
> - **Trả về trong thời gian hằng số (constant time)**, để chống timing attack."

### 6.2. Độ mạnh password

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Implement Proper Password Strength Controls*)
> "If MFA is enabled passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
>
> If MFA is not enabled passwords shorter than 15 characters are considered to be weak (NIST SP800-63B).
>
> Maximum password length should be at least 64 characters to allow passphrases (NIST SP800-63B). Note that certain implementations of hashing algorithms may cause long password denial of service."

🇻🇳 **Dịch**
> "Nếu có bật MFA, password ngắn hơn **8 ký tự** bị coi là yếu (NIST SP800-63B).
>
> Nếu **không** bật MFA, password ngắn hơn **15 ký tự** bị coi là yếu (NIST SP800-63B).
>
> Độ dài password tối đa nên **ít nhất 64 ký tự** để cho phép passphrase (NIST SP800-63B). Lưu ý một số cách triển khai thuật toán hash có thể gây từ chối dịch vụ với password dài."

📖 **Nguyên văn** (cùng mục)
> "Do not silently truncate passwords."
>
> "Allow usage of all characters including unicode and whitespace. There should be no password composition rules limiting the type of characters permitted."
>
> "Avoid requiring periodic password changes; instead, encourage users to pick strong passwords and enable Multifactor Authentication Cheat Sheet (MFA). According to NIST guidelines, verifiers should not mandate arbitrary password changes (e.g., periodically)."

🇻🇳 **Dịch**
> "**Đừng âm thầm cắt ngắn password.**"
>
> "Cho phép dùng mọi ký tự, kể cả unicode và khoảng trắng. **Không nên có quy tắc thành phần password** giới hạn loại ký tự được phép."
>
> "**Tránh bắt đổi password định kỳ**; thay vào đó khuyến khích user chọn password mạnh và bật MFA. Theo hướng dẫn của NIST, bên xác minh không nên bắt buộc đổi password một cách tuỳ tiện (ví dụ theo chu kỳ)."

### 6.3. MFA

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Multi-Factor Authentication*)
> "Multi-factor authentication (MFA) is by far the best defense against the majority of password-related attacks, including brute-force attacks, with analysis by Microsoft suggesting that it would have stopped 99.9% of account compromises. As such, it should be implemented wherever possible; however, depending on the audience of the application, it may not be practical or feasible to enforce the use of MFA."

🇻🇳 **Dịch**
> "Multi-factor authentication (MFA) **cho tới nay là biện pháp phòng thủ tốt nhất** chống lại đa số các tấn công liên quan password, bao gồm cả brute-force; phân tích của Microsoft cho rằng nó đã có thể chặn 99.9% các vụ tài khoản bị xâm phạm. Vì vậy nên triển khai nó ở mọi nơi có thể; tuy nhiên, tuỳ vào đối tượng người dùng của ứng dụng, việc bắt buộc dùng MFA có thể không thực tế hoặc không khả thi."

> [!note] Câu hỏi bảo mật KHÔNG phải là một factor thứ hai
> 📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Security Questions and Memorable Words*)
> > "It should be noted that this does not constitute multi-factor authentication, as both factors are the same (something you know). Furthermore, security questions are often weak and have predictable answers, so they must be carefully chosen."
>
> 🇻🇳 **Dịch**
> > "Cần lưu ý rằng điều này **không cấu thành multi-factor authentication**, vì cả hai factor đều cùng loại (thứ bạn biết). Hơn nữa, câu hỏi bảo mật thường yếu và có câu trả lời dễ đoán, nên phải được chọn cẩn thận."

### 6.4. Error message không được tiết lộ thông tin

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Authentication and Error Messages* / *Authentication Responses*)
> "Incorrectly implemented error messages in the case of authentication functionality can be used for the purposes of user ID and password enumeration. An application should respond (both HTTP and HTML) in a generic manner."
>
> "Using any of the authentication mechanisms (login, password reset, or password recovery), an application must respond with a generic error message regardless of whether:
>
> The user ID or password was incorrect.
>
> The account does not exist.
>
> The account is locked or disabled."

🇻🇳 **Dịch**
> "Error message bị triển khai sai ở tính năng authentication có thể bị lợi dụng để **liệt kê (enumerate) user ID và password**. Ứng dụng nên phản hồi (cả HTTP lẫn HTML) theo cách chung chung.
>
> Với bất kỳ cơ chế authentication nào (login, password reset, hay password recovery), ứng dụng **phải** trả về một error message chung chung, bất kể:
>
> - User ID hay password sai.
> - Tài khoản không tồn tại.
> - Tài khoản bị khoá hoặc bị vô hiệu hoá."

> [!danger] Chung chung cả nội dung lẫn **thời gian đáp ứng**
> 📖 **Nguyên văn** (cùng mục)
> > "It is interesting to note that the business logic itself can bring a discrepancy factor related to the processing time taken. Indeed, depending on the implementation, the processing time can be significantly different according to the case (success vs failure) allowing an attacker to mount a time-based attack (delta of some seconds for example)."
>
> 🇻🇳 **Dịch**
> > "Đáng chú ý là bản thân business logic cũng có thể tạo ra yếu tố chênh lệch liên quan tới **thời gian xử lý**. Thật vậy, tuỳ cách triển khai, thời gian xử lý có thể khác nhau đáng kể giữa các trường hợp (thành công và thất bại), cho phép attacker thực hiện một tấn công dựa trên thời gian (chênh lệch vài giây chẳng hạn)."

OWASP minh hoạ bằng pseudo-code. Trích nguyên văn cả hai bản, vì chỗ khác nhau rất tinh vi:

📖 **Nguyên văn** (OWASP, *"First implementation using the "quick exit" approach"*)
```
IF USER_EXISTS(username) THEN
    password_hash=HASH(password)
    IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
    IF NOT IS_VALID THEN
        RETURN Error("Invalid Username or Password!")
    ENDIF
ELSE
   RETURN Error("Invalid Username or Password!")
ENDIF
```

🇻🇳 Bản SAI: có nhánh `IF USER_EXISTS` thoát sớm, nên khi username không tồn tại server trả lời nhanh hơn hẳn so với khi username đúng mà password sai — attacker đo thời gian là biết username nào có thật.

📖 **Nguyên văn** (OWASP, *"Second implementation without relying on the "quick exit" approach"*)
```
password_hash=HASH(password)
IS_VALID=LOOKUP_CREDENTIALS_IN_STORE(username, password_hash)
IF NOT IS_VALID THEN
   RETURN Error("Invalid Username or Password!")
ENDIF
```

🇻🇳 Bản ĐÚNG: luôn hash rồi luôn tra cứu, không rẽ nhánh theo sự tồn tại của user — OWASP mô tả là "This code will go through the same process no matter what the user or the password is, allowing the application to return in approximately the same response time."

### 6.5. Chống tấn công tự động

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Protect Against Automated Attacks*)
> "Brute Force
> Testing multiple passwords from a dictionary or other source against a single account.
>
> Credential Stuffing
> Testing username/password pairs obtained from the breach of another site.
>
> Password Spraying
> Testing a single weak password against a large number of different accounts."

🇻🇳 **Dịch**
> "**Brute Force** — thử nhiều password từ một từ điển hoặc nguồn khác lên **một tài khoản**.
>
> **Credential Stuffing** — thử các cặp username/password lấy được từ vụ rò rỉ của **một site khác**.
>
> **Password Spraying** — thử **một** password yếu lên **rất nhiều tài khoản khác nhau**."

📖 **Nguyên văn** (cùng mục, *Account Lockout*)
> "The counter of failed logins should be associated with the account itself, rather than the source IP address, in order to prevent an attacker from making login attempts from a large number of different IP addresses."
>
> "When designing an account lockout system, care must be taken to prevent it from being used to cause a denial of service by locking out other users' accounts. One way this could be performed is to allow the use of the forgotten password functionality to log in, even if the account is locked out."

🇻🇳 **Dịch**
> "Bộ đếm login thất bại nên gắn với **chính tài khoản**, chứ không phải với địa chỉ IP nguồn, để attacker không thể né bằng cách thử login từ rất nhiều IP khác nhau."
>
> "Khi thiết kế hệ thống khoá tài khoản, phải cẩn thận để nó không bị dùng để gây **từ chối dịch vụ** bằng cách khoá tài khoản của người khác. Một cách xử lý là cho phép dùng chức năng quên mật khẩu để đăng nhập, ngay cả khi tài khoản đang bị khoá."

📖 **Nguyên văn** (cùng mục, *CAPTCHA*)
> "As such, the use of CAPTCHA should be viewed as a defense-in-depth control to make brute-force attacks more time-consuming and expensive, rather than as a preventative."

🇻🇳 **Dịch**
> "Do đó, việc dùng CAPTCHA nên được xem là một biện pháp **phòng thủ nhiều lớp** làm cho tấn công brute-force tốn thời gian và tốn kém hơn, chứ **không phải** là một biện pháp ngăn chặn dứt điểm."

### 6.6. Re-authentication cho hành động nhạy cảm

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Require Re-authentication for Sensitive Features*)
> "In order to mitigate CSRF and session hijacking, it's important to require the current credentials for an account before updating sensitive account information such as the user's password or email address -- or before sensitive transactions, such as shipping a purchase to a new address. Without this countermeasure, an attacker may be able to execute sensitive transactions through a CSRF or XSS attack without needing to know the user's current credentials."

🇻🇳 **Dịch**
> "Để giảm nhẹ CSRF và session hijacking, cần **yêu cầu credentials hiện tại** của tài khoản trước khi cập nhật thông tin nhạy cảm như password hay email của user — hoặc trước các giao dịch nhạy cảm, như giao hàng tới một địa chỉ mới. Nếu không có biện pháp này, attacker có thể thực hiện các giao dịch nhạy cảm qua tấn công CSRF hay XSS mà **không cần biết credentials hiện tại** của user."

### 6.7. Logging

📖 **Nguyên văn** (OWASP Authentication Cheat Sheet, mục *Logging and Monitoring*)
> "Enable logging and monitoring of authentication functions to detect attacks/failures on a real-time basis
>
> Ensure that all failures are logged and reviewed
>
> Ensure that all account lockouts are logged and reviewed"

🇻🇳 **Dịch**
> "Bật logging và monitoring cho các chức năng authentication để phát hiện tấn công/thất bại theo thời gian thực. Đảm bảo **mọi** thất bại đều được log và được rà soát. Đảm bảo mọi lần khoá tài khoản đều được log và rà soát."

> [!danger] Log sự kiện, đừng log credentials
> OWASP yêu cầu log các *thất bại*, không phải log giá trị password/token. Ghi credentials vào log là biến file log thành kho password sạch — đây là nhận định của tôi, không phải trích dẫn.

### 6.8. Về phía authorization

📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, mục *Deny by Default*)
> "Even when no access control rules are explicitly matched, the application cannot remain neutral when an entity is requesting access to a particular resource. The application must always make a decision, whether implicitly or explicitly, to either deny or permit the requested access. ... For security purposes an application should be configured to deny access by default."

🇻🇳 **Dịch**
> "Ngay cả khi không có rule access control nào khớp một cách tường minh, ứng dụng **không thể giữ thái độ trung lập** khi một thực thể đang yêu cầu truy cập một resource cụ thể. Ứng dụng luôn phải ra một quyết định, dù ngầm định hay tường minh, là từ chối hay cho phép truy cập được yêu cầu. ... Vì mục đích bảo mật, ứng dụng nên được cấu hình **mặc định từ chối truy cập**."

📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, mục *Validate the Permissions on Every Request*)
> "Permission should be validated correctly on every request, regardless of whether the request was initiated by an AJAX script, server-side, or any other source. The technology used to perform such checks should allow for global, application-wide configuration rather than needing to be applied individually to every method or class. Remember an attacker only needs to find one way in. Even if just a single access control check is "missed", the confidentiality and/or integrity of a resource can be jeopardized."

🇻🇳 **Dịch**
> "Quyền phải được validate đúng **trên mọi request**, bất kể request được khởi tạo bởi một script AJAX, từ phía server, hay bất kỳ nguồn nào khác. Công nghệ dùng để thực hiện các kiểm tra đó nên cho phép cấu hình **toàn cục, toàn ứng dụng**, thay vì phải áp dụng riêng lẻ cho từng method hay class. Hãy nhớ rằng attacker **chỉ cần tìm ra một lối vào**. Chỉ cần một lần kiểm tra access control bị "bỏ sót", tính bí mật và/hoặc toàn vẹn của resource đã có thể bị đe doạ."

📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, mục *Enforce Least Privileges*)
> "As a security concept, Least Privileges refers to the principle of assigning users only the minimum privileges necessary to complete their job."

🇻🇳 **Dịch**
> "Với tư cách một khái niệm bảo mật, **Least Privileges** chỉ nguyên tắc chỉ cấp cho user **những đặc quyền tối thiểu cần thiết** để hoàn thành công việc của họ."

> [!danger] Broken Access Control là hạng mục rủi ro số 1
> 📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, *Introduction*)
> > "Flaws related to authorization logic are a notable concern for web apps. Broken Access Control was ranked as the most concerning web security vulnerability in OWASP's 2021 Top 10 and asserted to have a "High" likelihood of exploit by MITRE's CWE program."
>
> 🇻🇳 **Dịch**
> > "Các lỗi liên quan tới logic authorization là mối lo đáng kể với web app. **Broken Access Control được xếp là lỗ hổng bảo mật web đáng lo ngại nhất trong OWASP Top 10 năm 2021** và được chương trình CWE của MITRE đánh giá có khả năng bị khai thác ở mức "Cao"."
>
> 📖 **Nguyên văn** (cùng mục)
> > "Horizontal privilege elevation (i.e. being able to access another user's resources) is an especially common weakness that an authenticated user may be able to take advantage of."
>
> 🇻🇳 **Dịch**
> > "**Leo thang đặc quyền theo chiều ngang** (tức là truy cập được resource của user khác) là một điểm yếu đặc biệt phổ biến mà một user đã authenticate có thể lợi dụng."

---

## 7. Đường tắt vòng qua cả hai lớp: injection

Authentication và authorization được cài đúng vẫn có thể bị bỏ qua hoàn toàn nếu câu truy vấn kiểm tra credentials được ghép chuỗi. Một payload chèn vào ô username có thể làm mệnh đề `WHERE` luôn đúng, và server "xác minh" thành công một user không tồn tại — bypass authentication mà không cần biết password nào.

Chi tiết cơ chế và cách phòng (parameterized query / prepared statement) đã có ở [[13 - SQL Injection và Parameterized Query]]. Ở đây chỉ cần nhớ: **auth mạnh tới đâu cũng vô nghĩa nếu câu query phía dưới nó ghép chuỗi**.

Cùng tinh thần "đừng tự viết", OWASP cảnh báo cả về framework:

📖 **Nguyên văn** (OWASP Authorization Cheat Sheet, mục *Thoroughly Review the Authorization Logic of Chosen Tools and Technologies...*)
> "Even in an otherwise securely developed application, vulnerabilities in third-party components can allow an attacker to bypass normal authorization controls. ... Implement defense in depth. Do not depend on any single framework, library, technology, or control to be the sole thing enforcing proper access control."

🇻🇳 **Dịch**
> "Ngay cả trong một ứng dụng được phát triển an toàn về mọi mặt khác, lỗ hổng trong component bên thứ ba vẫn có thể cho phép attacker bỏ qua các biện pháp authorization thông thường. ... Hãy triển khai **phòng thủ nhiều lớp**. Đừng phụ thuộc vào bất kỳ framework, library, công nghệ hay biện pháp đơn lẻ nào như là thứ duy nhất thực thi access control."

---

## 8. Roadmap nói gì

📖 **Nguyên văn** (roadmap.sh — Backend Developer Roadmap, mục *Authentication*; nguồn bên thứ ba, không phải spec)
> "API authentication verifies client identity to ensure only authorized access to resources. Common methods include API keys, OAuth 2.0, JWT, and basic auth. It protects data, prevents unauthorized access, enables usage tracking, and provides granular control over API resources."

🇻🇳 **Dịch**
> "API authentication xác minh danh tính của client để đảm bảo chỉ có truy cập đã được authorize tới các resource. Các phương pháp phổ biến gồm API key, OAuth 2.0, JWT, và basic auth. Nó bảo vệ dữ liệu, ngăn truy cập trái phép, cho phép theo dõi mức sử dụng, và cung cấp khả năng kiểm soát chi tiết đối với API resource."

> [!warning] Ngay cả roadmap cũng gộp chung
> Câu trên xếp OAuth 2.0 và JWT vào cùng một rổ "authentication methods". Đối chiếu với §2 và §5.2: OAuth 2.0 là authorization framework, JWT là định dạng token. Đây đúng là lối nói gộp phổ biến — đọc roadmap để biết lộ trình, còn định nghĩa thì bám spec.

---

## Liên kết

- Bài trước: [[09 - So sánh API Styles và REST Security]] (hết đợt A)
- Bài kế: [[11 - Basic Authentication]]
- [[01 - API là gì và nền tảng HTTP]] — nền HTTP mà toàn bộ framework §11 đứng trên
- [[02 - REST]] — ràng buộc stateless: vì sao REST đẩy thông tin auth vào từng request thay vì giữ state phiên ở server
- [[04 - HTTP Status Code và thiết kế lỗi]] — 401 vs 403 vs 404 trong bối cảnh thiết kế lỗi tổng thể
- [[08 - OpenAPI Specification]] — Security Scheme Object: cách mô tả các scheme ở §5 trong file spec
- [[09 - So sánh API Styles và REST Security]] — bức tranh security của REST
- [[13 - SQL Injection và Parameterized Query]] — bypass authentication qua injection (§7)
- [[02 - What is HTTP]] — HTTP cơ bản, request/response và header

## Nguồn tham khảo

- RFC 9110 — *HTTP Semantics*, §11 HTTP Authentication, §15.5.2 (401), §15.5.4 (403) : https://www.rfc-editor.org/rfc/rfc9110.txt
- RFC 6749 — *The OAuth 2.0 Authorization Framework* : https://www.rfc-editor.org/rfc/rfc6749.txt
- OWASP Authentication Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Authorization Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- roadmap.sh Backend Developer Roadmap — Authentication (nguồn bên thứ ba) : https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/roadmaps/backend/content/authentication%40PY9G7KQy8bF6eIdr1ydHf.md
