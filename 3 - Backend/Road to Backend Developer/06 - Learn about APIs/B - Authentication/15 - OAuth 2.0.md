# 15 — OAuth 2.0

> **Nguồn chính:** RFC 9700 — *Best Current Practice for OAuth 2.0 Security* (BCP 240, tháng 1/2025) — https://www.rfc-editor.org/rfc/rfc9700.txt
> **Spec gốc:** RFC 6749 — *The OAuth 2.0 Authorization Framework* (tháng 10/2012) — https://www.rfc-editor.org/rfc/rfc6749.txt
> Bài này bám RFC 6749 §1 (khái niệm, vai trò, protocol flow, grant type) và RFC 9700 §2 (best practices), RFC 7636 (PKCE), RFC 8252 (native apps), RFC 8628 (device grant).

> [!danger] ĐỌC DÒNG NÀY TRƯỚC
> RFC 6749 ra đời năm 2012 và **vẫn còn mô tả những cơ chế mà ngày nay KHÔNG được dùng nữa** (implicit grant, resource owner password credentials grant). RFC 9700 (2025) đã loại bỏ chúng.
> Trong bài này, mỗi khi RFC 6749 và RFC 9700 mâu thuẫn, **RFC 9700 là nguồn quyết định** — vì nó là Best Current Practice mới nhất và chính thức `Updates: 6749, 6750, 6819`.

---

## ⚠️ Hiểu nhầm số 1: OAuth 2.0 KHÔNG phải authentication

OAuth 2.0 tự mô tả mình là gì, ngay ở dòng Abstract:

📖 **Nguyên văn** — RFC 6749, Abstract
> "The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf.  This specification replaces and obsoletes the OAuth 1.0 protocol described in RFC 5849."

🇻🇳 **Dịch**
> "OAuth 2.0 authorization framework cho phép một ứng dụng bên thứ ba có được quyền truy cập **giới hạn** vào một HTTP service, hoặc là **thay mặt** một resource owner bằng cách dàn xếp một tương tác chấp thuận giữa resource owner và HTTP service đó, hoặc là cho phép ứng dụng bên thứ ba lấy quyền truy cập **nhân danh chính nó**. Đặc tả này thay thế và làm lỗi thời protocol OAuth 1.0 mô tả trong RFC 5849."

> [!warning] Từ khoá là "authorization", không phải "authentication"
> Cả tên tài liệu lẫn Abstract đều nói **authorization framework**. Không chỗ nào trong RFC 6749 nói OAuth trả lời câu hỏi "người dùng này là ai".
> - **Authentication** = bạn là ai → xem [[10 - Authentication vs Authorization]]
> - **Authorization** = bạn được phép làm gì → đây là phần OAuth 2.0 lo
>
> Access token của OAuth nói: "cái client này được phép đọc ảnh của tài khoản X". Nó **không** phải là bằng chứng đáng tin cậy rằng "người đang ngồi trước màn hình là X".
> Nếu bạn cần biết người dùng là ai (đăng nhập bằng Google, bằng Shopify...), thứ bạn cần là **OpenID Connect** — một lớp identity xây **trên** OAuth 2.0 (bài 16).

💡 **Ví dụ đời sống — chìa khoá phòng khách sạn**

Bạn thuê phòng 705. Nhân viên dọn phòng cần vào phòng bạn.

- **Cách sai (giống password grant):** bạn đưa luôn chìa khoá nhà mình + mã két sắt cho họ. Họ mở được mọi thứ, mãi mãi, và bạn không rút lại được trừ khi đổi khoá.
- **Cách OAuth:** bạn nhờ **lễ tân** (authorization server) cấp cho họ một **thẻ từ** (access token) chỉ mở được **phòng 705** (scope), **chỉ trong khung 9h–11h sáng** (lifetime), và bạn có thể **huỷ thẻ bất cứ lúc nào** mà không ảnh hưởng chìa khoá của bạn.

Điểm mấu chốt: **nhân viên dọn phòng không bao giờ biết mật khẩu của bạn.** Và tấm thẻ đó chứng minh "được vào phòng 705", chứ không chứng minh "người cầm thẻ tên là gì" — đúng bản chất authorization, không phải authentication.

RFC 6749 cũng dùng một ví dụ tương tự:

📖 **Nguyên văn** — RFC 6749 §1
> "For example, an end-user (resource owner) can grant a printing service (client) access to her protected photos stored at a photo-sharing service (resource server), without sharing her username and password with the printing service.  Instead, she authenticates directly with a server trusted by the photo-sharing service (authorization server), which issues the printing service delegation-specific credentials (access token)."

🇻🇳 **Dịch**
> "Ví dụ, một end-user (resource owner) có thể cấp cho một dịch vụ in ảnh (client) quyền truy cập vào các tấm ảnh được bảo vệ của cô ấy đang lưu ở một dịch vụ chia sẻ ảnh (resource server), mà **không phải chia sẻ username và password** của cô ấy cho dịch vụ in. Thay vào đó, cô ấy authenticate trực tiếp với một server được dịch vụ chia sẻ ảnh tin tưởng (authorization server), và server này cấp cho dịch vụ in một credential riêng cho việc uỷ quyền đó (access token)."

---

## PHẦN A — Nền tảng

### A.1. Vấn đề OAuth sinh ra để giải quyết

📖 **Nguyên văn** — RFC 6749 §1
> "In the traditional client-server authentication model, the client requests an access-restricted resource (protected resource) on the server by authenticating with the server using the resource owner's credentials.  In order to provide third-party applications access to restricted resources, the resource owner shares its credentials with the third party.  This creates several problems and limitations:
>
>    o  Third-party applications are required to store the resource owner's credentials for future use, typically a password in clear-text.
>
>    o  Servers are required to support password authentication, despite the security weaknesses inherent in passwords.
>
>    o  Third-party applications gain overly broad access to the resource owner's protected resources, leaving resource owners without any ability to restrict duration or access to a limited subset of resources.
>
>    o  Resource owners cannot revoke access to an individual third party without revoking access to all third parties, and must do so by changing the third party's password.
>
>    o  Compromise of any third-party application results in compromise of the end-user's password and all of the data protected by that password."

🇻🇳 **Dịch**
> "Trong mô hình client-server authentication truyền thống, client yêu cầu một resource bị hạn chế truy cập (protected resource) trên server bằng cách authenticate với server dùng credential của resource owner. Để cho phép ứng dụng bên thứ ba truy cập resource bị hạn chế, resource owner phải chia sẻ credential của mình cho bên thứ ba. Điều này tạo ra nhiều vấn đề và hạn chế:
>
> - Ứng dụng bên thứ ba buộc phải **lưu trữ credential của resource owner** để dùng về sau, thường là password ở dạng clear-text.
> - Server buộc phải hỗ trợ password authentication, bất chấp các điểm yếu bảo mật vốn có của password.
> - Ứng dụng bên thứ ba giành được quyền truy cập **rộng quá mức cần thiết** vào các protected resource của resource owner, khiến resource owner không có cách nào giới hạn thời hạn hay giới hạn truy cập vào một tập con resource.
> - Resource owner **không thể thu hồi quyền của riêng một bên thứ ba** mà không thu hồi quyền của tất cả các bên thứ ba, và muốn làm vậy thì phải đổi password.
> - Bất kỳ ứng dụng bên thứ ba nào bị xâm nhập đều dẫn tới password của end-user và **toàn bộ** dữ liệu được password đó bảo vệ bị xâm nhập."

📖 **Nguyên văn** — RFC 6749 §1
> "Instead of using the resource owner's credentials to access protected resources, the client obtains an access token -- a string denoting a specific scope, lifetime, and other access attributes.  Access tokens are issued to third-party clients by an authorization server with the approval of the resource owner.  The client uses the access token to access the protected resources hosted by the resource server."

🇻🇳 **Dịch**
> "Thay vì dùng credential của resource owner để truy cập protected resource, client nhận được một **access token** — một chuỗi biểu thị một scope cụ thể, một thời hạn (lifetime), và các thuộc tính truy cập khác. Access token được cấp cho client bên thứ ba bởi authorization server, với sự chấp thuận của resource owner. Client dùng access token đó để truy cập các protected resource nằm ở resource server."

---

### A.2. Bốn vai trò (roles)

📖 **Nguyên văn** — RFC 6749 §1.1 Roles
> "OAuth defines four roles:
>
>    resource owner
>       An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.
>
>    resource server
>       The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
>
>    client
>       An application making protected resource requests on behalf of the resource owner and with its authorization.  The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).
>
>    authorization server
>       The server issuing access tokens to the client after successfully authenticating the resource owner and obtaining authorization."

🇻🇳 **Dịch**
> "OAuth định nghĩa bốn vai trò:
>
> - **resource owner** — Một thực thể có khả năng cấp quyền truy cập vào một protected resource. Khi resource owner là một con người, nó được gọi là **end-user**.
> - **resource server** — Server đang chứa (host) các protected resource, có khả năng tiếp nhận và trả lời các request tới protected resource bằng access token.
> - **client** — Một ứng dụng thực hiện các request tới protected resource **thay mặt** resource owner và **với sự cho phép** của resource owner. Thuật ngữ "client" không hàm ý bất kỳ đặc điểm triển khai cụ thể nào (ví dụ: ứng dụng chạy trên server, trên desktop, hay trên thiết bị khác).
> - **authorization server** — Server cấp phát access token cho client, sau khi đã authenticate thành công resource owner và nhận được sự cho phép (authorization)."

📖 **Nguyên văn** — RFC 6749 §1.1 (tiếp)
> "The interaction between the authorization server and resource server is beyond the scope of this specification.  The authorization server may be the same server as the resource server or a separate entity.  A single authorization server may issue access tokens accepted by multiple resource servers."

🇻🇳 **Dịch**
> "Tương tác giữa authorization server và resource server nằm ngoài phạm vi của đặc tả này. Authorization server **có thể là cùng một server** với resource server, hoặc là một thực thể tách biệt. Một authorization server duy nhất có thể cấp access token được **nhiều** resource server chấp nhận."

> [!note] Ghi nhớ cách ánh xạ vào ví dụ khách sạn
> resource owner = bạn (khách thuê phòng) · resource server = cánh cửa phòng 705 · client = nhân viên dọn phòng · authorization server = quầy lễ tân cấp thẻ từ.

---

### A.3. Protocol flow tổng quát

📖 **Nguyên văn** — RFC 6749 §1.2 Protocol Flow, Figure 1

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

                     Figure 1: Abstract Protocol Flow
```

🇻🇳 Sơ đồ ASCII nguyên văn của RFC 6749 §1.2: Client đi qua 6 bước A→F. Trục trái luôn là Client; ba khối bên phải lần lượt là Resource Owner, Authorization Server, Resource Server. Đọc theo chiều mũi tên: xin phép → nhận grant → đổi grant lấy access token → dùng access token gọi resource.

📖 **Nguyên văn** — RFC 6749 §1.2, mô tả 6 bước
> "(A)  The client requests authorization from the resource owner.  The authorization request can be made directly to the resource owner (as shown), or preferably indirectly via the authorization server as an intermediary.
>
>    (B)  The client receives an authorization grant, which is a credential representing the resource owner's authorization, expressed using one of four grant types defined in this specification or using an extension grant type.  The authorization grant type depends on the method used by the client to request authorization and the types supported by the authorization server.
>
>    (C)  The client requests an access token by authenticating with the authorization server and presenting the authorization grant.
>
>    (D)  The authorization server authenticates the client and validates the authorization grant, and if valid, issues an access token.
>
>    (E)  The client requests the protected resource from the resource server and authenticates by presenting the access token.
>
>    (F)  The resource server validates the access token, and if valid, serves the request."

🇻🇳 **Dịch**
> "**(A)** Client xin authorization từ resource owner. Authorization request có thể gửi trực tiếp tới resource owner (như hình vẽ), hoặc — **cách được ưu tiên hơn** — gửi gián tiếp thông qua authorization server đóng vai trung gian.
> **(B)** Client nhận được một **authorization grant**, tức một credential đại diện cho sự cho phép của resource owner, được biểu diễn bằng một trong bốn grant type định nghĩa trong đặc tả này, hoặc bằng một extension grant type. Loại authorization grant phụ thuộc vào phương pháp mà client dùng để xin authorization và các loại mà authorization server hỗ trợ.
> **(C)** Client yêu cầu một access token bằng cách authenticate với authorization server và xuất trình authorization grant.
> **(D)** Authorization server authenticate client và kiểm tra authorization grant; nếu hợp lệ thì cấp một access token.
> **(E)** Client yêu cầu protected resource từ resource server và authenticate bằng cách xuất trình access token.
> **(F)** Resource server kiểm tra access token; nếu hợp lệ thì phục vụ request."

> [!tip] Chú ý câu "preferably indirectly"
> Ngay từ 2012 RFC đã nói cách **ưu tiên** là để authorization server làm trung gian ở bước (A)(B) — nghĩa là client **không bao giờ** tự đi hỏi mật khẩu người dùng. Đây chính là lý do cái gọi là "password grant" bị loại bỏ ở phần B.

---

### A.4. Access token

📖 **Nguyên văn** — RFC 6749 §1.4 Access Token
> "Access tokens are credentials used to access protected resources.  An access token is a string representing an authorization issued to the client.  The string is usually opaque to the client.  Tokens represent specific scopes and durations of access, granted by the resource owner, and enforced by the resource server and authorization server.
>
>    The token may denote an identifier used to retrieve the authorization information or may self-contain the authorization information in a verifiable manner (i.e., a token string consisting of some data and a signature).  Additional authentication credentials, which are beyond the scope of this specification, may be required in order for the client to use a token."

🇻🇳 **Dịch**
> "Access token là credential dùng để truy cập protected resource. Access token là một chuỗi đại diện cho một authorization đã được cấp cho client. Chuỗi này **thường là opaque đối với client** (client không cần và không nên hiểu nội dung bên trong). Token đại diện cho những scope và thời hạn truy cập cụ thể, do resource owner cấp, và được resource server cùng authorization server thực thi.
>
> Token **có thể là một định danh** dùng để tra cứu thông tin authorization, **hoặc có thể tự chứa** thông tin authorization ở dạng có thể kiểm chứng (tức một chuỗi token gồm một phần dữ liệu và một chữ ký). Có thể cần thêm các authentication credential khác — nằm ngoài phạm vi đặc tả này — để client dùng được token."

> [!note] Hai kiểu token trong câu trên chính là hai bài trước
> - "an identifier used to retrieve the authorization information" → opaque token, server phải tra DB → [[13 - Token Authentication và Bearer Token]]
> - "self-contain the authorization information ... data and a signature" → đúng mô tả của JWT → [[14 - JWT]]
>
> RFC 6749 **không bắt buộc** access token phải là JWT. Nhiều người tưởng "OAuth = JWT" — sai. Format token là chuyện riêng của authorization server.

📖 **Nguyên văn** — RFC 6749 §1.4 (tiếp)
> "The access token provides an abstraction layer, replacing different authorization constructs (e.g., username and password) with a single token understood by the resource server."

🇻🇳 **Dịch**
> "Access token cung cấp một lớp trừu tượng, thay thế các cấu trúc authorization khác nhau (ví dụ username và password) bằng **một token duy nhất** mà resource server hiểu được."

---

### A.5. Refresh token

📖 **Nguyên văn** — RFC 6749 §1.5 Refresh Token
> "Refresh tokens are credentials used to obtain access tokens.  Refresh tokens are issued to the client by the authorization server and are used to obtain a new access token when the current access token becomes invalid or expires, or to obtain additional access tokens with identical or narrower scope (access tokens may have a shorter lifetime and fewer permissions than authorized by the resource owner).  Issuing a refresh token is optional at the discretion of the authorization server.
>
>    A refresh token is a string representing the authorization granted to the client by the resource owner.  The string is usually opaque to the client.  The token denotes an identifier used to retrieve the authorization information.  Unlike access tokens, refresh tokens are intended for use only with authorization servers and are never sent to resource servers."

🇻🇳 **Dịch**
> "Refresh token là credential dùng để **lấy access token**. Refresh token do authorization server cấp cho client, và được dùng để lấy access token mới khi access token hiện tại hết hiệu lực hoặc hết hạn, hoặc để lấy thêm access token với scope **giống hệt hoặc hẹp hơn** (access token có thể có lifetime ngắn hơn và ít quyền hơn so với mức resource owner đã cho phép). Việc cấp refresh token là **tuỳ chọn**, do authorization server quyết định.
>
> Refresh token là một chuỗi đại diện cho authorization mà resource owner đã cấp cho client. Chuỗi này thường opaque đối với client. Token này là một định danh dùng để tra cứu thông tin authorization. **Khác với access token, refresh token chỉ được dùng với authorization server và KHÔNG BAO GIỜ được gửi tới resource server.**"

> [!danger] Câu cuối là quy tắc bảo mật thực chiến
> Nếu code của bạn gửi refresh token kèm trong request tới API resource (ví dụ nhét vào header `Authorization` của một API thường), là đã sai spec và tạo ra rò rỉ nghiêm trọng — refresh token là thứ có giá trị cao nhất trong hệ thống (xem Phần C.4).

💡 **Ví dụ đời sống** — Access token là **thẻ từ phòng 705 hết hạn lúc 11h**. Refresh token là **tờ phiếu xác nhận đặt phòng**: cầm nó ra **quầy lễ tân** (authorization server) để xin thẻ từ mới. Bạn không bao giờ quẹt tờ phiếu đặt phòng vào ổ khoá cửa (resource server) — sai chỗ, và làm lộ thứ quan trọng nhất.

---

### A.6. Scope

📖 **Nguyên văn** — RFC 6749 §3.3 Access Token Scope
> "The authorization and token endpoints allow the client to specify the scope of the access request using the "scope" request parameter.  In turn, the authorization server uses the "scope" response parameter to inform the client of the scope of the access token issued.
>
>    The value of the scope parameter is expressed as a list of space-delimited, case-sensitive strings.  The strings are defined by the authorization server.  If the value contains multiple space-delimited strings, their order does not matter, and each string adds an additional access range to the requested scope."

🇻🇳 **Dịch**
> "Authorization endpoint và token endpoint cho phép client chỉ định **scope** của yêu cầu truy cập bằng request parameter `scope`. Ngược lại, authorization server dùng response parameter `scope` để báo cho client biết scope của access token thực sự được cấp.
>
> Giá trị của parameter `scope` là một danh sách các chuỗi **phân cách bằng dấu cách, phân biệt hoa thường**. Các chuỗi này do **authorization server tự định nghĩa**. Nếu giá trị chứa nhiều chuỗi cách nhau bằng dấu cách thì **thứ tự không quan trọng**, và mỗi chuỗi thêm một phạm vi truy cập nữa vào scope được yêu cầu."

📖 **Nguyên văn** — RFC 6749 §3.3 (ABNF)
```
     scope       = scope-token *( SP scope-token )
     scope-token = 1*( %x21 / %x23-5B / %x5D-7E )
```

🇻🇳 Cú pháp ABNF của `scope`: một hoặc nhiều `scope-token` nối nhau bằng ký tự space (`SP`); mỗi `scope-token` là chuỗi ít nhất 1 ký tự ASCII in được, loại trừ space (`%x20`), dấu nháy kép `"` (`%x22`) và dấu `\` (`%x5C`).

📖 **Nguyên văn** — RFC 6749 §3.3 (tiếp)
> "The authorization server MAY fully or partially ignore the scope requested by the client, based on the authorization server policy or the resource owner's instructions.  If the issued access token scope is different from the one requested by the client, the authorization server MUST include the "scope" response parameter to inform the client of the actual scope granted."

🇻🇳 **Dịch**
> "Authorization server **CÓ THỂ bỏ qua toàn bộ hoặc một phần** scope mà client yêu cầu, dựa trên chính sách của authorization server hoặc chỉ dẫn của resource owner. Nếu scope của access token được cấp khác với scope client đã yêu cầu, authorization server **PHẢI** kèm response parameter `scope` để báo cho client biết scope thực sự được cấp."

> [!warning] Đừng giả định client xin gì là được nấy
> Client xin `read write delete` mà người dùng chỉ tick "read" thì token trả về chỉ có `read`. Code client **bắt buộc** phải đọc `scope` trong response chứ không được giả định.

---

## PHẦN B — Các grant type, theo trạng thái HIỆN TẠI

RFC 6749 định nghĩa bốn grant type:

📖 **Nguyên văn** — RFC 6749 §1.3 Authorization Grant
> "An authorization grant is a credential representing the resource owner's authorization (to access its protected resources) used by the client to obtain an access token.  This specification defines four grant types -- authorization code, implicit, resource owner password credentials, and client credentials -- as well as an extensibility mechanism for defining additional types."

🇻🇳 **Dịch**
> "Authorization grant là một credential đại diện cho sự cho phép của resource owner (cho phép truy cập protected resource của họ), được client dùng để lấy access token. Đặc tả này định nghĩa bốn grant type — **authorization code, implicit, resource owner password credentials, và client credentials** — cùng một cơ chế mở rộng để định nghĩa thêm các loại khác."

> [!danger] Trong bốn loại đó, năm 2025 chỉ còn HAI loại được dùng
> `implicit` và `resource owner password credentials` đã bị RFC 9700 loại bỏ. Xem B.4 và B.5 — có trích nguyên văn.

---

### B.1. Authorization Code Grant — cách chuẩn hiện nay

📖 **Nguyên văn** — RFC 6749 §4.1 Authorization Code Grant
> "The authorization code grant type is used to obtain both access tokens and refresh tokens and is optimized for confidential clients.  Since this is a redirection-based flow, the client must be capable of interacting with the resource owner's user-agent (typically a web browser) and capable of receiving incoming requests (via redirection) from the authorization server."

🇻🇳 **Dịch**
> "Grant type authorization code được dùng để lấy **cả access token lẫn refresh token**, và được tối ưu cho **confidential client** (client giữ được bí mật). Vì đây là một flow dựa trên redirect, client phải có khả năng tương tác với user-agent của resource owner (thường là web browser) và có khả năng nhận request đến (qua redirect) từ authorization server."

📖 **Nguyên văn** — RFC 6749 §4.1, Figure 3

```
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)

   Note: The lines illustrating steps (A), (B), and (C) are broken into
   two parts as they pass through the user-agent.

                     Figure 3: Authorization Code Flow
```

🇻🇳 Sơ đồ nguyên văn RFC 6749 §4.1. Điểm cần nhìn ra: bước (A)(B)(C) **đi xuyên qua trình duyệt**, nên chỉ chuyển `authorization code` — một mẩu dùng-một-lần. Bước (D)(E) là kênh **back-channel** server↔server, access token đi trên kênh này và **không bao giờ xuất hiện trên URL của trình duyệt**. Đó là toàn bộ ưu thế bảo mật so với implicit grant.

📖 **Nguyên văn** — RFC 6749 §1.3.1 Authorization Code
> "Before directing the resource owner back to the client with the authorization code, the authorization server authenticates the resource owner and obtains authorization.  Because the resource owner only authenticates with the authorization server, the resource owner's credentials are never shared with the client.
>
>    The authorization code provides a few important security benefits, such as the ability to authenticate the client, as well as the transmission of the access token directly to the client without passing it through the resource owner's user-agent and potentially exposing it to others, including the resource owner."

🇻🇳 **Dịch**
> "Trước khi chuyển hướng resource owner quay lại client kèm authorization code, authorization server **authenticate resource owner** và thu được sự cho phép. Bởi vì resource owner chỉ authenticate với authorization server, **credential của resource owner không bao giờ bị chia sẻ cho client**.
>
> Authorization code mang lại vài lợi ích bảo mật quan trọng, chẳng hạn khả năng authenticate client, cũng như việc truyền access token **thẳng tới client mà không đi xuyên qua user-agent** của resource owner — nhờ đó không phơi bày token cho những bên khác, **kể cả cho chính resource owner**."

---

### B.2. PKCE — mảnh ghép bắt buộc (RFC 7636)

PKCE (đọc là "pixy") sinh ra để vá một lỗ hổng cụ thể của authorization code grant.

📖 **Nguyên văn** — RFC 7636, Abstract
> "OAuth 2.0 public clients utilizing the Authorization Code Grant are susceptible to the authorization code interception attack.  This specification describes the attack as well as a technique to mitigate against the threat through the use of Proof Key for Code Exchange (PKCE, pronounced "pixy")."

🇻🇳 **Dịch**
> "Các **public client** của OAuth 2.0 dùng Authorization Code Grant dễ bị tấn công **chặn bắt authorization code** (authorization code interception attack). Đặc tả này mô tả kiểu tấn công đó cũng như một kỹ thuật để giảm thiểu mối đe doạ, thông qua việc dùng Proof Key for Code Exchange (PKCE, đọc là "pixy")."

#### PKCE chống tấn công gì?

📖 **Nguyên văn** — RFC 7636 §1 Introduction
> "In this attack, the attacker intercepts the authorization code returned from the authorization endpoint within a communication path not protected by Transport Layer Security (TLS), such as inter-application communication within the client's operating system.
>
>    Once the attacker has gained access to the authorization code, it can use it to obtain the access token."

🇻🇳 **Dịch**
> "Trong kiểu tấn công này, kẻ tấn công **chặn bắt authorization code** được trả về từ authorization endpoint, ở một đoạn đường truyền **không được TLS bảo vệ** — ví dụ đường giao tiếp giữa các ứng dụng bên trong hệ điều hành của client.
>
> Một khi kẻ tấn công có được authorization code, nó có thể dùng code đó để lấy access token."

📖 **Nguyên văn** — RFC 7636 §1
> "Note that it is possible for a malicious app to register itself as a handler for the custom scheme in addition to the legitimate OAuth 2.0 app.  Once it does so, the malicious app is now able to intercept the authorization code in step (4).  This allows the attacker to request and obtain an access token in steps (5) and (6), respectively."

🇻🇳 **Dịch**
> "Lưu ý rằng một app độc hại **hoàn toàn có thể tự đăng ký làm handler cho cùng một custom URI scheme** bên cạnh app OAuth 2.0 hợp pháp. Khi đã làm được vậy, app độc hại có thể chặn bắt authorization code ở bước (4). Điều này cho phép kẻ tấn công yêu cầu và nhận được access token ở bước (5) và (6)."

📖 **Nguyên văn** — RFC 7636 §1, Figure 1: Authorization Code Interception Attack

```
    +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
    | End Device (e.g., Smartphone)  |
    |                                |
    | +-------------+   +----------+ | (6) Access Token  +----------+
    | |Legitimate   |   | Malicious|<--------------------|          |
    | |OAuth 2.0 App|   | App      |-------------------->|          |
    | +-------------+   +----------+ | (5) Authorization |          |
    |        |    ^          ^       |        Grant      |          |
    |        |     \         |       |                   |          |
    |        |      \   (4)  |       |                   |          |
    |    (1) |       \  Authz|       |                   |          |
    |   Authz|        \ Code |       |                   |  Authz   |
    | Request|         \     |       |                   |  Server  |
    |        |          \    |       |                   |          |
    |        |           \   |       |                   |          |
    |        v            \  |       |                   |          |
    | +----------------------------+ |                   |          |
    | |                            | | (3) Authz Code    |          |
    | |     Operating System/      |<--------------------|          |
    | |         Browser            |-------------------->|          |
    | |                            | | (2) Authz Request |          |
    | +----------------------------+ |                   +----------+
    +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+

             Figure 1: Authorization Code Interception Attack
```

🇻🇳 Sơ đồ nguyên văn RFC 7636 §1. Đọc từ dưới lên: app hợp pháp gửi authz request (1)(2), authz server trả code về OS/Browser (3), nhưng ở (4) **app độc hại** — đã đăng ký cùng custom scheme — cướp được code, rồi đem đổi lấy access token ở (5)(6).

#### Cơ chế PKCE

📖 **Nguyên văn** — RFC 7636 §1.1 Protocol Flow, Figure 2

```
                                                 +-------------------+
                                                 |   Authz Server    |
       +--------+                                | +---------------+ |
       |        |--(A)- Authorization Request ---->|               | |
       |        |       + t(code_verifier), t_m  | | Authorization | |
       |        |                                | |    Endpoint   | |
       |        |<-(B)---- Authorization Code -----|               | |
       |        |                                | +---------------+ |
       | Client |                                |                   |
       |        |                                | +---------------+ |
       |        |--(C)-- Access Token Request ---->|               | |
       |        |          + code_verifier       | |    Token      | |
       |        |                                | |   Endpoint    | |
       |        |<-(D)------ Access Token ---------|               | |
       +--------+                                | +---------------+ |
                                                 +-------------------+

                     Figure 2: Abstract Protocol Flow
```

🇻🇳 Sơ đồ nguyên văn RFC 7636 §1.1: so với flow gốc chỉ thêm 2 thứ — ở (A) gửi kèm `t(code_verifier)` (tức `code_challenge`) và phương pháp biến đổi `t_m`; ở (C) gửi kèm `code_verifier` gốc.

📖 **Nguyên văn** — RFC 7636 §1.1
> "A. The client creates and records a secret named the "code_verifier" and derives a transformed version "t(code_verifier)" (referred to as the "code_challenge"), which is sent in the OAuth 2.0 Authorization Request along with the transformation method "t_m".
>
>    B. The Authorization Endpoint responds as usual but records "t(code_verifier)" and the transformation method.
>
>    C. The client then sends the authorization code in the Access Token Request as usual but includes the "code_verifier" secret generated at (A).
>
>    D. The authorization server transforms "code_verifier" and compares it to "t(code_verifier)" from (B).  Access is denied if they are not equal.
>
>    An attacker who intercepts the authorization code at (B) is unable to redeem it for an access token, as they are not in possession of the "code_verifier" secret."

🇻🇳 **Dịch**
> "**A.** Client tạo và ghi nhớ một bí mật tên là `code_verifier`, rồi suy ra một phiên bản đã biến đổi `t(code_verifier)` (gọi là `code_challenge`), và gửi nó trong OAuth 2.0 Authorization Request cùng với phương pháp biến đổi `t_m`.
> **B.** Authorization Endpoint trả lời như bình thường nhưng **ghi nhớ** `t(code_verifier)` và phương pháp biến đổi.
> **C.** Sau đó client gửi authorization code trong Access Token Request như bình thường, nhưng **kèm theo bí mật `code_verifier`** đã tạo ở bước (A).
> **D.** Authorization server biến đổi `code_verifier` rồi so sánh với `t(code_verifier)` lưu từ bước (B). **Nếu không khớp thì từ chối.**
>
> Kẻ tấn công chặn được authorization code ở bước (B) **không thể đổi nó lấy access token, vì nó không có bí mật `code_verifier`.**"

#### code_verifier và code_challenge

📖 **Nguyên văn** — RFC 7636 §4.1 Client Creates a Code Verifier
> "code_verifier = high-entropy cryptographic random STRING using the unreserved characters [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~" from Section 2.3 of [RFC3986], with a minimum length of 43 characters and a maximum length of 128 characters.
>
>    NOTE: The code verifier SHOULD have enough entropy to make it impractical to guess the value.  It is RECOMMENDED that the output of a suitable random number generator be used to create a 32-octet sequence.  The octet sequence is then base64url-encoded to produce a 43-octet URL safe string to use as the code verifier."

🇻🇳 **Dịch**
> "`code_verifier` = một chuỗi ngẫu nhiên mật mã có entropy cao, dùng các ký tự unreserved `[A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"` theo §2.3 của RFC 3986, **dài tối thiểu 43 và tối đa 128 ký tự**.
>
> GHI CHÚ: code verifier **NÊN** có đủ entropy để không thể đoán được giá trị. **KHUYẾN NGHỊ** dùng output của một bộ sinh số ngẫu nhiên phù hợp để tạo một dãy 32 octet; dãy octet đó sau đó được base64url-encode để tạo ra một chuỗi 43 octet an toàn cho URL, dùng làm code verifier."

📖 **Nguyên văn** — RFC 7636 §4.2 Client Creates the Code Challenge
> "The client then creates a code challenge derived from the code verifier by using one of the following transformations on the code verifier:
>
>    plain
>       code_challenge = code_verifier
>
>    S256
>       code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
>
>    If the client is capable of using "S256", it MUST use "S256", as "S256" is Mandatory To Implement (MTI) on the server.  Clients are permitted to use "plain" only if they cannot support "S256" for some technical reason and know via out-of-band configuration that the server supports "plain"."

🇻🇳 **Dịch**
> "Sau đó client tạo một code challenge suy ra từ code verifier, bằng một trong hai phép biến đổi sau:
>
> - `plain` → `code_challenge = code_verifier`
> - `S256` → `code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))`
>
> **Nếu client có khả năng dùng `S256` thì BẮT BUỘC phải dùng `S256`**, vì `S256` là Mandatory To Implement (bắt buộc triển khai) ở phía server. Client chỉ được phép dùng `plain` khi vì lý do kỹ thuật nào đó nó không hỗ trợ được `S256` **và** biết qua cấu hình out-of-band rằng server có hỗ trợ `plain`."

📖 **Nguyên văn** — RFC 7636 §4.3
> "code_challenge
>       REQUIRED.  Code challenge.
>
>    code_challenge_method
>       OPTIONAL, defaults to "plain" if not present in the request.  Code verifier transformation method is "S256" or "plain"."

🇻🇳 **Dịch**
> "`code_challenge` — **BẮT BUỘC**. Chính là code challenge.
> `code_challenge_method` — **TUỲ CHỌN**, nếu không có trong request thì **mặc định là `plain`**. Phương pháp biến đổi code verifier là `S256` hoặc `plain`."

> [!danger] Cái bẫy mặc định
> `code_challenge_method` mặc định là `plain` — tức `code_challenge` **chính là** `code_verifier` gửi thẳng trên URL. Kẻ đọc được authorization request sẽ có luôn verifier và PKCE mất tác dụng hoàn toàn.
> **Luôn gửi `code_challenge_method=S256` một cách tường minh.** RFC 9700 cũng nói đúng điều này (xem C.1), và OAuth 2.1 đã **xoá hẳn** method `plain`.

---

### B.3. Client Credentials Grant — server-to-server

📖 **Nguyên văn** — RFC 6749 §1.3.4 Client Credentials
> "The client credentials (or other forms of client authentication) can be used as an authorization grant when the authorization scope is limited to the protected resources under the control of the client, or to protected resources previously arranged with the authorization server.  Client credentials are used as an authorization grant typically when the client is acting on its own behalf (the client is also the resource owner) or is requesting access to protected resources based on an authorization previously arranged with the authorization server."

🇻🇳 **Dịch**
> "Client credential (hoặc dạng client authentication khác) có thể được dùng làm authorization grant khi scope của authorization **giới hạn trong các protected resource do chính client kiểm soát**, hoặc các protected resource đã được thoả thuận trước với authorization server. Client credential được dùng làm authorization grant điển hình khi client **hành động nhân danh chính nó** (client đồng thời là resource owner), hoặc khi client yêu cầu truy cập protected resource dựa trên một authorization đã thoả thuận trước với authorization server."

📖 **Nguyên văn** — RFC 6749 §4.4 Client Credentials Grant
> "The client credentials grant type MUST only be used by confidential clients."

🇻🇳 **Dịch**
> "Grant type client credentials **CHỈ ĐƯỢC** dùng bởi confidential client (client có khả năng giữ bí mật an toàn)."

📖 **Nguyên văn** — RFC 6749 §4.4, Figure 6

```
     +---------+                                  +---------------+
     |         |                                  |               |
     |         |>--(A)- Client Authentication --->| Authorization |
     | Client  |                                  |     Server    |
     |         |<--(B)---- Access Token ---------<|               |
     |         |                                  |               |
     +---------+                                  +---------------+

                     Figure 6: Client Credentials Flow
```

🇻🇳 Sơ đồ nguyên văn RFC 6749 §4.4 — đơn giản nhất trong tất cả các grant type: **không có resource owner, không có browser, không có redirect**. Chỉ 2 bước: client authenticate, nhận access token.

📖 **Nguyên văn** — RFC 6749 §4.4.1
> "Since the client authentication is used as the authorization grant, no additional authorization request is needed."

🇻🇳 **Dịch**
> "Vì bản thân việc client authentication đã đóng vai trò authorization grant, **không cần thêm authorization request nào nữa.**"

> [!tip] Dùng khi nào
> Cron job gọi API nội bộ, backend service A gọi backend service B, một daemon đồng bộ dữ liệu định kỳ. Nói cách khác: **khi không có con người nào ngồi trước màn hình để bấm "Cho phép".**
> Ngược lại: nếu luồng của bạn cần một con người chấp thuận, client credentials là **sai công cụ** — dùng authorization code + PKCE.

---

### B.4. 🔴 Implicit Grant — ĐÃ BỊ LOẠI BỎ

RFC 6749 (2012) mô tả nó như sau:

📖 **Nguyên văn** — RFC 6749 §1.3.2 Implicit
> "The implicit grant is a simplified authorization code flow optimized for clients implemented in a browser using a scripting language such as JavaScript.  In the implicit flow, instead of issuing the client an authorization code, the client is issued an access token directly (as the result of the resource owner authorization).  The grant type is implicit, as no intermediate credentials (such as an authorization code) are issued (and later used to obtain an access token).
>
>    When issuing an access token during the implicit grant flow, the authorization server does not authenticate the client."

🇻🇳 **Dịch**
> "Implicit grant là một phiên bản rút gọn của authorization code flow, tối ưu cho client viết bằng ngôn ngữ scripting như JavaScript chạy trong trình duyệt. Trong implicit flow, thay vì cấp cho client một authorization code, client **được cấp thẳng access token** (như kết quả của việc resource owner cho phép). Grant type này gọi là "implicit" vì **không có credential trung gian nào** (như authorization code) được cấp rồi dùng lại sau để lấy access token.
>
> Khi cấp access token trong implicit grant flow, **authorization server KHÔNG authenticate client.**"

Và đây là điều RFC 9700 (2025) nói về nó:

> [!danger] RFC 9700 §2.1.2 — KHÔNG DÙNG IMPLICIT GRANT
>
> 📖 **Nguyên văn** — RFC 9700 §2.1.2 Implicit Grant
> > "The implicit grant (response type token) and other response types causing the authorization server to issue access tokens in the authorization response are vulnerable to access token leakage and access token replay as described in Sections 4.1, 4.2, 4.3, and 4.6.
> >
> >    Moreover, no standardized method for sender-constraining exists to bind access tokens to a specific client (as recommended in Section 2.2) when the access tokens are issued in the authorization response.  This means that an attacker can use the leaked or stolen access token at a resource endpoint.
> >
> >    In order to avoid these issues, clients SHOULD NOT use the implicit grant (response type token) or other response types issuing access tokens in the authorization response, unless access token injection in the authorization response is prevented and the aforementioned token leakage vectors are mitigated.
> >
> >    Clients SHOULD instead use the response type code (i.e., authorization code grant type) as specified in Section 2.1.1 or any other response type that causes the authorization server to issue access tokens in the token response, such as the code id_token response type.  This allows the authorization server to detect replay attempts by attackers and generally reduces the attack surface since access tokens are not exposed in URLs.  It also allows the authorization server to sender-constrain the issued tokens (see Section 2.2)."
>
> 🇻🇳 **Dịch**
> > "Implicit grant (`response_type=token`) và các response type khác khiến authorization server cấp access token **ngay trong authorization response** đều **dễ bị rò rỉ access token và bị replay access token**, như mô tả ở các mục 4.1, 4.2, 4.3 và 4.6.
> >
> > Hơn nữa, **không tồn tại phương pháp chuẩn hoá nào để sender-constrain** — tức ràng buộc access token vào một client cụ thể (như khuyến nghị ở §2.2) — khi access token được cấp trong authorization response. Điều này có nghĩa là **kẻ tấn công có thể dùng access token bị rò rỉ hoặc bị đánh cắp tại resource endpoint.**
> >
> > Để tránh những vấn đề này, client **KHÔNG NÊN (SHOULD NOT)** dùng implicit grant (`response_type=token`) hay bất kỳ response type nào cấp access token trong authorization response, trừ khi đã ngăn được việc tiêm access token vào authorization response và đã giảm thiểu được các hướng rò rỉ token nói trên.
> >
> > Thay vào đó client **NÊN** dùng `response_type=code` (tức authorization code grant type) như quy định ở §2.1.1, hoặc bất kỳ response type nào khiến authorization server cấp access token **trong token response**, ví dụ response type `code id_token`. Cách này cho phép authorization server phát hiện các nỗ lực replay của kẻ tấn công và nhìn chung **giảm bề mặt tấn công vì access token không bị phơi bày trên URL**. Nó cũng cho phép authorization server sender-constrain các token đã cấp (xem §2.2)."

RFC 9700 còn nêu thẳng một lý do khiến mô hình bảo mật gốc của implicit grant sụp đổ:

📖 **Nguyên văn** — RFC 9700 §1 Introduction
> "Technology has changed.  For example, the way browsers treat fragments when redirecting requests has changed, and with it, the implicit grant's underlying security model."

🇻🇳 **Dịch**
> "Công nghệ đã thay đổi. Ví dụ, cách các trình duyệt xử lý **fragment** (phần sau dấu `#` trong URL) khi redirect request đã thay đổi, và cùng với nó là **mô hình bảo mật nền tảng của implicit grant.**"

> [!danger] Kết luận thực hành
> Nếu bạn đang bảo trì một SPA dùng `response_type=token`, đó là nợ bảo mật cần trả. Cách thay thế: **authorization code + PKCE** cho SPA — RFC 9700 §2.1.1 ghi rõ PKCE áp dụng cho **mọi** loại client, kể cả web app (xem C.1).

---

### B.5. 🔴 Resource Owner Password Credentials Grant — ĐÃ BỊ LOẠI BỎ

RFC 6749 (2012) mô tả:

📖 **Nguyên văn** — RFC 6749 §1.3.3 Resource Owner Password Credentials
> "The resource owner password credentials (i.e., username and password) can be used directly as an authorization grant to obtain an access token.  The credentials should only be used when there is a high degree of trust between the resource owner and the client (e.g., the client is part of the device operating system or a highly privileged application), and when other authorization grant types are not available (such as an authorization code)."

🇻🇳 **Dịch**
> "Resource owner password credential (tức username và password) có thể được dùng **trực tiếp** làm authorization grant để lấy access token. Credential này chỉ nên được dùng khi có **mức độ tin cậy rất cao** giữa resource owner và client (ví dụ client là một phần của hệ điều hành thiết bị, hoặc là một ứng dụng có đặc quyền cao), **và** khi không có grant type nào khác khả dụng (chẳng hạn authorization code)."

Và RFC 9700 (2025):

> [!danger] RFC 9700 §2.4 — CẤM DÙNG (MUST NOT)
>
> 📖 **Nguyên văn** — RFC 9700 §2.4 Resource Owner Password Credentials Grant
> > "The resource owner password credentials grant [RFC6749] MUST NOT be used.  This grant type insecurely exposes the credentials of the resource owner to the client.  Even if the client is benign, usage of this grant results in an increased attack surface (i.e., credentials can leak in more places than just the authorization server) and in training users to enter their credentials in places other than the authorization server.
> >
> >    Furthermore, the resource owner password credentials grant is not designed to work with two-factor authentication and authentication processes that require multiple user interaction steps.  Authentication with cryptographic credentials (cf. WebCrypto [W3C.WebCrypto], WebAuthn [W3C.WebAuthn]) may be impossible to implement with this grant type, as it is usually bound to a specific web origin."
>
> 🇻🇳 **Dịch**
> > "Resource owner password credentials grant [RFC6749] **KHÔNG ĐƯỢC PHÉP DÙNG (MUST NOT be used)**. Grant type này phơi bày credential của resource owner cho client một cách **không an toàn**. Ngay cả khi client là lành tính, việc dùng grant này vẫn dẫn tới **bề mặt tấn công lớn hơn** (tức credential có thể rò rỉ ở nhiều nơi chứ không chỉ ở authorization server) và **huấn luyện người dùng thói quen nhập credential ở những nơi không phải authorization server**.
> >
> > Hơn nữa, resource owner password credentials grant **không được thiết kế để hoạt động với two-factor authentication** và các quy trình authentication đòi hỏi nhiều bước tương tác của người dùng. Authentication bằng credential mật mã (xem WebCrypto, WebAuthn) có thể **không thể triển khai được** với grant type này, vì các cơ chế đó thường bị ràng buộc vào một web origin cụ thể."

> [!warning] Chú ý mức độ ngôn từ — nó khác nhau
> - Implicit grant: RFC 9700 dùng **SHOULD NOT** (không nên).
> - Password grant: RFC 9700 dùng **MUST NOT** (cấm).
>
> Theo BCP 14, đây là hai mức khác nhau. Password grant là mức nghiêm ngặt nhất. Và lý do "huấn luyện người dùng thói quen nhập password ở nơi khác" là một rủi ro **xã hội**, không phải kỹ thuật — nó mở đường cho phishing hàng loạt, và không có bản vá kỹ thuật nào chữa được.

---

### B.6. Device Authorization Grant (RFC 8628)

Đây là một **extension grant** (không nằm trong 4 loại gốc của RFC 6749), ra đời năm 2019.

📖 **Nguyên văn** — RFC 8628, Abstract
> "The OAuth 2.0 device authorization grant is designed for Internet-connected devices that either lack a browser to perform a user-agent-based authorization or are input constrained to the extent that requiring the user to input text in order to authenticate during the authorization flow is impractical.  It enables OAuth clients on such devices (like smart TVs, media consoles, digital picture frames, and printers) to obtain user authorization to access protected resources by using a user agent on a separate device."

🇻🇳 **Dịch**
> "OAuth 2.0 device authorization grant được thiết kế cho các thiết bị có kết nối Internet mà hoặc là **không có trình duyệt** để thực hiện authorization dựa trên user-agent, hoặc là **bị hạn chế về khả năng nhập liệu** tới mức việc bắt người dùng gõ chữ để authenticate trong flow authorization là không thực tế. Nó cho phép OAuth client trên các thiết bị đó (như smart TV, media console, khung ảnh số, và máy in) có được authorization của người dùng để truy cập protected resource **bằng cách dùng một user agent trên một thiết bị khác**."

💡 **Ví dụ đời sống** — Đúng cái màn hình "Vào `example.com/activate` và nhập mã `WDJB-MJHT`" khi bạn đăng nhập app trên Smart TV. Bạn lấy điện thoại ra bấm, TV thì cứ hỏi server "xong chưa?" cho tới khi bạn xác nhận.

---

### B.7. Bảng tổng hợp trạng thái các grant type

| Grant type | RFC gốc nói gì | Trạng thái theo RFC 9700 (2025) | Dùng khi nào |
|---|---|---|---|
| **Authorization Code** | RFC 6749 §4.1 — "used to obtain both access tokens and refresh tokens and is optimized for confidential clients" | ✅ Được khuyến nghị. §2.1.1 bắt buộc kèm PKCE (public client: MUST; confidential client: RECOMMENDED) | Mọi luồng có con người chấp thuận: web app, SPA, mobile app |
| **Authorization Code + PKCE** | PKCE ở RFC 7636 (2015), ban đầu nhắm native app | ✅ **Mặc định hiện nay.** §2.1.1: "this advice applies to all kinds of OAuth clients, including web applications" | Luôn luôn, khi dùng authorization code |
| **Client Credentials** | RFC 6749 §4.4 — "MUST only be used by confidential clients" | ✅ Vẫn hợp lệ, không bị đụng tới trong §2 của RFC 9700 | Server-to-server, cron job, daemon — không có người dùng |
| **Device Authorization** | RFC 8628 (2019), extension grant | ✅ Hợp lệ (spec riêng, Standards Track) | Smart TV, máy in, thiết bị không có/khó nhập liệu |
| **Implicit** | RFC 6749 §1.3.2 — "a simplified authorization code flow optimized for clients implemented in a browser" | 🔴 **Bị loại bỏ.** §2.1.2: "clients SHOULD NOT use the implicit grant" | ❌ Không dùng. Thay bằng Authorization Code + PKCE |
| **Resource Owner Password Credentials** | RFC 6749 §1.3.3 — chỉ khi "high degree of trust" | 🔴 **Bị cấm.** §2.4: "MUST NOT be used" | ❌ Không bao giờ |

---

### B.8. Native app: luôn dùng trình duyệt ngoài (RFC 8252)

📖 **Nguyên văn** — RFC 8252 §4 Overview
> "For authorizing users in native apps, the best current practice is to perform the OAuth authorization request in an external user-agent (typically the browser) rather than an embedded user-agent (such as one implemented with web-views).
>
>    Previously, it was common for native apps to use embedded user-agents (commonly implemented with web-views) for OAuth authorization requests.  That approach has many drawbacks, including the host app being able to copy user credentials and cookies as well as the user needing to authenticate from scratch in each app."

🇻🇳 **Dịch**
> "Để authorize người dùng trong native app, **best current practice là thực hiện OAuth authorization request trong một user-agent bên ngoài** (thường là trình duyệt), chứ **không** phải trong một user-agent nhúng (như loại triển khai bằng web-view).
>
> Trước đây, native app thường dùng user-agent nhúng (thường triển khai bằng web-view) cho OAuth authorization request. Cách làm đó có nhiều nhược điểm, bao gồm việc **app chủ có thể sao chép credential và cookie của người dùng**, cũng như việc người dùng phải authenticate lại từ đầu trong mỗi app."

📖 **Nguyên văn** — RFC 8252 §8.1 Protecting the Authorization Code
> "The PKCE [RFC7636] protocol was created specifically to mitigate this attack.  It is a proof-of-possession extension to OAuth 2.0 that protects the authorization code from being used if it is intercepted."

🇻🇳 **Dịch**
> "Protocol PKCE [RFC7636] được tạo ra **đặc biệt để giảm thiểu kiểu tấn công này**. Nó là một extension kiểu proof-of-possession (chứng minh sở hữu) cho OAuth 2.0, bảo vệ authorization code khỏi bị dùng ngay cả khi nó bị chặn bắt."

> [!danger] Web-view để đăng nhập là anti-pattern
> Nếu app của bạn mở một WebView trong app để người dùng gõ password vào đó, app của bạn **về mặt kỹ thuật đọc được password đó**. Người dùng không có cách nào phân biệt WebView thật với WebView giả mạo — không có thanh địa chỉ, không có chứng chỉ để xem. Đó là lý do RFC 8252 tồn tại.

---

## PHẦN C — Khuyến nghị bảo mật (RFC 9700 §2)

RFC 9700 mở đầu phần best practice bằng lời tự định vị:

📖 **Nguyên văn** — RFC 9700 §2 Best Practices
> "This section describes the core set of security mechanisms and measures that are considered to be best practices at the time of writing."

🇻🇳 **Dịch**
> "Mục này mô tả tập hợp cốt lõi các cơ chế và biện pháp bảo mật được coi là **best practice tại thời điểm viết** tài liệu."

---

### C.1. PKCE cho mọi client dùng authorization code

> [!danger] Bắt buộc — mức MUST cho public client
>
> 📖 **Nguyên văn** — RFC 9700 §2.1.1 Authorization Code Grant
> > "Clients MUST prevent authorization code injection attacks (see Section 4.5) and misuse of authorization codes using one of the following options:
> >
> >    *  Public clients MUST use PKCE [RFC7636] to this end, as motivated in Section 4.5.3.1.
> >    *  For confidential clients, the use of PKCE [RFC7636] is RECOMMENDED, as it provides strong protection against misuse and injection of authorization codes as described in Section 4.5.3.1.  Also, as a side effect, it prevents CSRF even in the presence of strong attackers as described in Section 4.7.1."
>
> 🇻🇳 **Dịch**
> > "Client **BẮT BUỘC (MUST)** phải ngăn chặn tấn công **tiêm authorization code** (authorization code injection) và việc lạm dụng authorization code, bằng một trong các cách sau:
> >
> > - **Public client BẮT BUỘC dùng PKCE** [RFC7636] cho mục đích này, theo lý do trình bày ở §4.5.3.1.
> > - Với **confidential client**, việc dùng PKCE được **KHUYẾN NGHỊ (RECOMMENDED)**, vì nó cung cấp sự bảo vệ mạnh chống lại việc lạm dụng và tiêm authorization code như mô tả ở §4.5.3.1. Ngoài ra, như một tác dụng phụ, **nó chống được CSRF ngay cả khi đối mặt với kẻ tấn công mạnh**, như mô tả ở §4.7.1."

📖 **Nguyên văn** — RFC 9700 §2.1.1 (Note)
> "Note: Although PKCE was designed as a mechanism to protect native apps, this advice applies to all kinds of OAuth clients, including web applications."

🇻🇳 **Dịch**
> "Ghi chú: Mặc dù PKCE được thiết kế như một cơ chế để bảo vệ native app, **lời khuyên này áp dụng cho MỌI loại OAuth client, bao gồm cả web application.**"

📖 **Nguyên văn** — RFC 9700 §2.1.1 (yêu cầu với S256 và với authorization server)
> "When using PKCE, clients SHOULD use PKCE code challenge methods that do not expose the PKCE verifier in the authorization request.  Otherwise, attackers that can read the authorization request (cf. Attacker (A4) in Section 3) can break the security provided by PKCE.  Currently, S256 is the only such method.
>
>    Authorization servers MUST support PKCE [RFC7636].
>
>    If a client sends a valid PKCE code_challenge parameter in the authorization request, the authorization server MUST enforce the correct usage of code_verifier at the token endpoint.
>
>    Authorization servers MUST mitigate PKCE downgrade attacks by ensuring that a token request containing a code_verifier parameter is accepted only if a code_challenge parameter was present in the authorization request; see Section 4.8.2 for details."

🇻🇳 **Dịch**
> "Khi dùng PKCE, client **NÊN** dùng các PKCE code challenge method **không làm lộ PKCE verifier trong authorization request**. Nếu không, kẻ tấn công đọc được authorization request (xem Attacker (A4) ở §3) có thể phá vỡ sự bảo vệ mà PKCE mang lại. **Hiện tại, `S256` là method duy nhất như vậy.**
>
> Authorization server **BẮT BUỘC (MUST) phải hỗ trợ PKCE**.
>
> Nếu client gửi một parameter `code_challenge` hợp lệ trong authorization request, authorization server **BẮT BUỘC phải thực thi việc dùng `code_verifier` đúng cách tại token endpoint.**
>
> Authorization server **BẮT BUỘC phải giảm thiểu tấn công hạ cấp PKCE (PKCE downgrade attack)** bằng cách đảm bảo rằng một token request có chứa parameter `code_verifier` **chỉ được chấp nhận nếu authorization request trước đó đã có parameter `code_challenge`**; chi tiết ở §4.8.2."

📖 **Nguyên văn** — RFC 9700 §2.1.1 (tính duy nhất của challenge)
> "In any case, the PKCE challenge or OpenID Connect nonce MUST be transaction-specific and securely bound to the client and the user agent in which the transaction was started.  Authorization servers are encouraged to make a reasonable effort at detecting and preventing the use of constant values for the PKCE challenge or OpenID Connect nonce."

🇻🇳 **Dịch**
> "Trong mọi trường hợp, PKCE challenge (hoặc nonce của OpenID Connect) **BẮT BUỘC phải riêng cho từng giao dịch** (transaction-specific) và được ràng buộc an toàn vào client cùng user agent nơi giao dịch được khởi tạo. Authorization server **được khuyến khích nỗ lực hợp lý để phát hiện và ngăn chặn việc dùng giá trị hằng số (constant)** cho PKCE challenge hoặc nonce."

> [!danger] Hardcode code_verifier = PKCE vô dụng
> Câu "MUST be transaction-specific" nghĩa là: sinh `code_verifier` **mới cho mỗi lần** bắt đầu luồng đăng nhập. Đặt một hằng số trong config rồi tái sử dụng là biến PKCE thành trang trí.

---

### C.2. Redirect URI phải so khớp chính xác

> [!danger] Mức MUST — đây là lỗ hổng bị khai thác nhiều nhất thực tế
>
> 📖 **Nguyên văn** — RFC 9700 §2.1 Protecting Redirect-Based Flows
> > "When comparing client redirection URIs against pre-registered URIs, authorization servers MUST utilize exact string matching except for port numbers in localhost redirection URIs of native apps (see Section 4.1.3).  This measure contributes to the prevention of leakage of authorization codes and access tokens (see Section 4.1).  It can also help to detect mix-up attacks (see Section 4.4).
> >
> >    Clients and authorization servers MUST NOT expose URLs that forward the user's browser to arbitrary URIs obtained from a query parameter (open redirectors) as described in Section 4.11.  Open redirectors can enable exfiltration of authorization codes and access tokens."
>
> 🇻🇳 **Dịch**
> > "Khi so sánh redirection URI của client với các URI đã đăng ký trước, authorization server **BẮT BUỘC (MUST) dùng so khớp chuỗi chính xác (exact string matching)**, ngoại trừ số port trong redirection URI kiểu localhost của native app (xem §4.1.3). Biện pháp này góp phần **ngăn rò rỉ authorization code và access token** (xem §4.1). Nó cũng giúp phát hiện **mix-up attack** (xem §4.4).
> >
> > Client và authorization server **KHÔNG ĐƯỢC (MUST NOT) phơi bày các URL chuyển tiếp trình duyệt của người dùng tới một URI tuỳ ý lấy từ query parameter** (tức **open redirector**), như mô tả ở §4.11. Open redirector có thể tạo điều kiện cho việc **rút trộm (exfiltration) authorization code và access token**."

RFC 9700 định nghĩa rõ open redirector là gì:

📖 **Nguyên văn** — RFC 9700 §1.2 Conventions and Terminology
> "An "open redirector" is an endpoint on a web server that forwards a user's browser to an arbitrary URI obtained from a query parameter."

🇻🇳 **Dịch**
> "**"Open redirector"** là một endpoint trên web server chuyển tiếp trình duyệt của người dùng tới **một URI tuỳ ý lấy từ query parameter.**"

> [!warning] "Exact string matching" nghĩa là đúng nghĩa đen
> Không wildcard (`https://app.example.com/*`), không so khớp theo prefix, không "chỉ cần cùng domain là được". Chuỗi đăng ký và chuỗi trong request phải **giống hệt nhau từng ký tự**. Ngoại lệ duy nhất được phép: **số port** của redirect URI localhost trong native app.
> Lý do: nếu server chấp nhận `https://app.example.com/cb?x=...` khớp prefix, kẻ tấn công đăng ký/lợi dụng được `https://app.example.com/cb/../evil` hay một open redirect nằm trên cùng domain để lái authorization code ra ngoài.

---

### C.3. Chống CSRF bằng `state` hoặc PKCE

> [!danger] Mức MUST — client phải chống CSRF
>
> 📖 **Nguyên văn** — RFC 9700 §2.1
> > "Clients MUST prevent Cross-Site Request Forgery (CSRF).  In this context, CSRF refers to requests to the redirection endpoint that do not originate at the authorization server, but at a malicious third party (see Section 4.4.1.8 of [RFC6819] for details).  Clients that have ensured that the authorization server supports Proof Key for Code Exchange (PKCE) [RFC7636] MAY rely on the CSRF protection provided by PKCE.  In OpenID Connect flows, the nonce parameter provides CSRF protection.  Otherwise, one-time use CSRF tokens carried in the state parameter that are securely bound to the user agent MUST be used for CSRF protection (see Section 4.7.1)."
>
> 🇻🇳 **Dịch**
> > "Client **BẮT BUỘC (MUST) phải ngăn chặn Cross-Site Request Forgery (CSRF)**. Trong ngữ cảnh này, CSRF chỉ những request tới redirection endpoint mà **không xuất phát từ authorization server, mà từ một bên thứ ba độc hại** (chi tiết xem §4.4.1.8 của RFC 6819). Client nào đã **chắc chắn rằng authorization server có hỗ trợ PKCE** thì **CÓ THỂ (MAY) dựa vào sự bảo vệ CSRF mà PKCE cung cấp**. Trong các flow OpenID Connect, parameter `nonce` cung cấp bảo vệ CSRF. **Nếu không có những cách trên**, thì **BẮT BUỘC phải dùng CSRF token dùng-một-lần đặt trong parameter `state`**, được ràng buộc an toàn vào user agent, để chống CSRF (xem §4.7.1)."

Ngoài ra, khi client nói chuyện với nhiều authorization server:

📖 **Nguyên văn** — RFC 9700 §2.1
> "When an OAuth client can interact with more than one authorization server, a defense against mix-up attacks (see Section 4.4) is REQUIRED.  To this end, clients SHOULD
>
>    *  use the iss parameter as a countermeasure according to [RFC9207], or
>    *  use an alternative countermeasure based on an iss value in the authorization response (such as the iss claim in the ID Token in [OpenID.Core] or in [OpenID.JARM] responses), processing that value as described in [RFC9207]."

🇻🇳 **Dịch**
> "Khi một OAuth client có thể tương tác với **nhiều hơn một authorization server**, việc phòng vệ chống **mix-up attack** (xem §4.4) là **BẮT BUỘC (REQUIRED)**. Để làm việc đó, client **NÊN**:
>
> - dùng parameter `iss` làm biện pháp đối phó theo RFC 9207, hoặc
> - dùng một biện pháp thay thế dựa trên giá trị `iss` trong authorization response (chẳng hạn claim `iss` trong ID Token của OpenID Connect, hoặc trong response kiểu OpenID JARM), xử lý giá trị đó như mô tả trong RFC 9207."

💡 **Ví dụ đời sống về CSRF trong OAuth** — Kẻ tấn công tự đăng nhập Google của **hắn**, lấy được authorization code của hắn, rồi lừa bạn bấm vào link `https://app-cua-ban.com/callback?code=<code-cua-hacker>`. Nếu app không kiểm tra `state`, app sẽ vui vẻ gắn tài khoản Google **của kẻ tấn công** vào session của **bạn** — sau đó mọi dữ liệu bạn lưu (ví dụ thẻ thanh toán) đi thẳng vào tài khoản hắn kiểm soát. Đây gọi là **authorization code injection**.

---

### C.4. Refresh token: rotation hoặc sender-constrained

> [!danger] Mức MUST cho public client
>
> 📖 **Nguyên văn** — RFC 9700 §2.2.2 Refresh Tokens
> > "Refresh tokens for public clients MUST be sender-constrained or use refresh token rotation as described in Section 4.14.  [RFC6749] already mandates that refresh tokens for confidential clients can only be used by the client for which they were issued."
>
> 🇻🇳 **Dịch**
> > "Refresh token của **public client BẮT BUỘC (MUST) phải được sender-constrained hoặc phải dùng refresh token rotation** như mô tả ở §4.14. RFC 6749 vốn đã yêu cầu rằng refresh token của confidential client chỉ có thể được dùng bởi đúng client mà nó được cấp cho."

Vì sao refresh token nguy hiểm đến vậy:

📖 **Nguyên văn** — RFC 9700 §4.14.1 Discussion
> "Refresh tokens are an attractive target for attackers because they represent the full scope of access granted to a certain client, and they are not further constrained to a specific resource.  If an attacker is able to exfiltrate and successfully replay a refresh token, the attacker will be able to mint access tokens and use them to access resource servers on behalf of the resource owner."

🇻🇳 **Dịch**
> "Refresh token là **mục tiêu hấp dẫn** với kẻ tấn công, vì chúng đại diện cho **toàn bộ scope truy cập** đã cấp cho một client, và chúng **không bị ràng buộc thêm vào một resource cụ thể nào**. Nếu kẻ tấn công rút trộm được và replay thành công một refresh token, hắn sẽ có thể **đúc ra access token** và dùng chúng để truy cập các resource server **thay mặt resource owner**."

Hai cách được chấp nhận:

📖 **Nguyên văn** — RFC 9700 §4.14.2 Recommendations
> "Authorization servers MUST utilize one of these methods to detect refresh token replay by malicious actors for public clients:
>
>    *  *Sender-constrained refresh tokens:* the authorization server cryptographically binds the refresh token to a certain client instance, e.g., by utilizing [RFC8705] or [RFC9449].
>
>    *  *Refresh token rotation:* the authorization server issues a new refresh token with every access token refresh response.  The previous refresh token is invalidated, but information about the relationship is retained by the authorization server.  If a refresh token is compromised and subsequently used by both the attacker and the legitimate client, one of them will present an invalidated refresh token, which will inform the authorization server of the breach.  The authorization server cannot determine which party submitted the invalid refresh token, but it will revoke the active refresh token.  This stops the attack at the cost of forcing the legitimate client to obtain a fresh authorization grant."

🇻🇳 **Dịch**
> "Authorization server **BẮT BUỘC (MUST) dùng một trong hai phương pháp sau** để phát hiện việc replay refresh token bởi kẻ xấu, đối với public client:
>
> - **Sender-constrained refresh token:** authorization server **ràng buộc refresh token bằng mật mã vào một instance client cụ thể**, ví dụ bằng cách dùng RFC 8705 (mutual TLS) hoặc RFC 9449 (DPoP).
>
> - **Refresh token rotation:** authorization server **cấp một refresh token mới mỗi lần refresh access token**. Refresh token cũ bị vô hiệu hoá, nhưng authorization server vẫn giữ lại thông tin về mối quan hệ giữa chúng. Nếu một refresh token bị lộ và sau đó **cả kẻ tấn công lẫn client hợp pháp cùng dùng nó**, thì một trong hai sẽ xuất trình một refresh token đã bị vô hiệu — và điều đó **báo cho authorization server biết đã có sự cố**. Authorization server không xác định được bên nào đã gửi token không hợp lệ, nhưng nó sẽ **thu hồi refresh token đang hoạt động**. Cách này chặn được cuộc tấn công, với cái giá là buộc client hợp pháp phải xin một authorization grant mới."

Và một yêu cầu nữa về scope:

📖 **Nguyên văn** — RFC 9700 §4.14.2
> "If refresh tokens are issued, those refresh tokens MUST be bound to the scope and resource servers as consented by the resource owner.  This is to prevent privilege escalation by the legitimate client and reduce the impact of refresh token leakage."

🇻🇳 **Dịch**
> "Nếu có cấp refresh token, những refresh token đó **BẮT BUỘC phải được ràng buộc vào đúng scope và đúng các resource server mà resource owner đã đồng ý**. Điều này nhằm **ngăn chính client hợp pháp leo thang đặc quyền** và giảm tác động khi refresh token bị rò rỉ."

💡 **Ví dụ đời sống về rotation** — Thẻ gửi xe dùng-một-lần: mỗi lần ra vào bạn đổi thẻ mới, thẻ cũ huỷ. Nếu có kẻ copy thẻ của bạn, sẽ có lúc **hai người cùng chìa ra một mã đã huỷ** — bảo vệ lập tức biết có gian lận và khoá cả hai. Bạn phải ra quầy đăng ký lại, phiền, nhưng kẻ trộm cũng bị chặn.

---

### C.5. Giới hạn đặc quyền của access token (audience + scope)

> [!warning] Mức SHOULD — nguyên tắc đặc quyền tối thiểu
>
> 📖 **Nguyên văn** — RFC 9700 §2.3 Access Token Privilege Restriction
> > "The privileges associated with an access token SHOULD be restricted to the minimum required for the particular application or use case.  This prevents clients from exceeding the privileges authorized by the resource owner.  It also prevents users from exceeding their privileges authorized by the respective security policy.  Privilege restrictions also help to reduce the impact of access token leakage."
>
> 🇻🇳 **Dịch**
> > "Các đặc quyền gắn với một access token **NÊN được giới hạn ở mức tối thiểu cần thiết** cho ứng dụng hoặc use case cụ thể đó. Điều này ngăn client vượt quá đặc quyền mà resource owner đã cho phép. Nó cũng ngăn người dùng vượt quá đặc quyền mà chính sách bảo mật tương ứng cho phép. **Giới hạn đặc quyền cũng giúp giảm tác động khi access token bị rò rỉ.**"

📖 **Nguyên văn** — RFC 9700 §2.3 (audience restriction)
> "In particular, access tokens SHOULD be audience-restricted to a specific resource server or, if that is not feasible, to a small set of resource servers.  To put this into effect, the authorization server associates the access token with certain resource servers, and every resource server is obliged to verify, for every request, whether the access token sent with that request was meant to be used for that particular resource server.  If it was not, the resource server MUST refuse to serve the respective request.  The aud claim as defined in [RFC9068] MAY be used to audience-restrict access tokens."

🇻🇳 **Dịch**
> "Cụ thể, access token **NÊN được giới hạn audience** vào **một** resource server cụ thể, hoặc nếu không khả thi thì vào **một tập nhỏ** các resource server. Để thực hiện điều này, authorization server gắn access token với những resource server nhất định, và **mọi resource server có nghĩa vụ kiểm tra, với MỌI request**, xem access token gửi kèm request đó có thực sự được dành cho chính resource server này hay không. Nếu không, resource server **BẮT BUỘC (MUST) phải từ chối phục vụ** request đó. Claim `aud` định nghĩa trong RFC 9068 **CÓ THỂ** được dùng để giới hạn audience cho access token."

📖 **Nguyên văn** — RFC 9700 §2.3 (resource/action restriction)
> "Additionally, access tokens SHOULD be restricted to certain resources and actions on resource servers or resources.  To put this into effect, the authorization server associates the access token with the respective resource and actions and every resource server is obliged to verify, for every request, whether the access token sent with that request was meant to be used for that particular action on the particular resource.  If not, the resource server must refuse to serve the respective request."

🇻🇳 **Dịch**
> "Ngoài ra, access token **NÊN được giới hạn vào những resource và hành động cụ thể** trên resource server. Để thực hiện, authorization server gắn access token với resource và các hành động tương ứng, và mọi resource server có nghĩa vụ kiểm tra, với mọi request, xem access token có thực sự dành cho **hành động đó trên resource đó** hay không. Nếu không, resource server phải từ chối phục vụ request."

> [!note] Liên hệ với claim `aud` của JWT
> Đây chính là lý do claim `aud` tồn tại trong JWT — xem [[14 - JWT]]. Nếu resource server không kiểm `aud`, một token cấp cho service A có thể bị đem dùng ở service B (token replay giữa các service).

---

### C.6. Các yêu cầu quan trọng khác

📖 **Nguyên văn** — RFC 9700 §2.5 Client Authentication
> "Authorization servers SHOULD enforce client authentication if it is feasible, in the particular deployment, to establish a process for issuance/registration of credentials for clients and ensuring the confidentiality of those credentials.
>
>    It is RECOMMENDED to use asymmetric cryptography for client authentication, such as mutual TLS for OAuth 2.0 [RFC8705] or signed JWTs ("Private Key JWT") in accordance with [RFC7521] and [RFC7523].  ...  When asymmetric cryptography for client authentication is used, authorization servers do not need to store sensitive symmetric keys, making these methods more robust against leakage of keys."

🇻🇳 **Dịch**
> "Authorization server **NÊN thực thi client authentication** nếu trong triển khai cụ thể đó việc thiết lập quy trình cấp/đăng ký credential cho client và đảm bảo tính bí mật của credential là khả thi.
>
> **KHUYẾN NGHỊ dùng mật mã bất đối xứng** cho client authentication, chẳng hạn mutual TLS cho OAuth 2.0 (RFC 8705) hoặc JWT có chữ ký ("Private Key JWT") theo RFC 7521 và RFC 7523. ... Khi dùng mật mã bất đối xứng cho client authentication, **authorization server không cần lưu các khoá đối xứng nhạy cảm**, khiến các phương pháp này bền hơn trước nguy cơ rò rỉ khoá."

> [!danger] Cấm authorization response đi qua kết nối không mã hoá
>
> 📖 **Nguyên văn** — RFC 9700 §2.6 Other Recommendations
> > "Authorization responses MUST NOT be transmitted over unencrypted network connections.  To this end, authorization servers MUST NOT allow redirection URIs that use the http scheme except for native clients that use loopback interface redirection as described in Section 7.3 of [RFC8252]."
>
> 🇻🇳 **Dịch**
> > "Authorization response **KHÔNG ĐƯỢC (MUST NOT) truyền qua kết nối mạng không mã hoá**. Vì vậy, authorization server **KHÔNG ĐƯỢC cho phép redirection URI dùng scheme `http`**, ngoại trừ trường hợp native client dùng redirect qua loopback interface như mô tả ở §7.3 của RFC 8252."

📖 **Nguyên văn** — RFC 9700 §2.6 (CORS)
> "To support browser-based clients, endpoints directly accessed by such clients including the Token Endpoint, Authorization Server Metadata Endpoint, jwks_uri Endpoint, and Dynamic Client Registration Endpoint MAY support the use of Cross-Origin Resource Sharing (CORS) [WHATWG.CORS].  However, CORS MUST NOT be supported at the authorization endpoint, as the client does not access this endpoint directly; instead, the client redirects the user agent to it."

🇻🇳 **Dịch**
> "Để hỗ trợ client chạy trên trình duyệt, các endpoint mà client truy cập trực tiếp — gồm Token Endpoint, Authorization Server Metadata Endpoint, endpoint `jwks_uri`, và Dynamic Client Registration Endpoint — **CÓ THỂ** hỗ trợ CORS. Tuy nhiên, **CORS KHÔNG ĐƯỢC hỗ trợ tại authorization endpoint**, vì client không truy cập endpoint đó trực tiếp; thay vào đó client **redirect user agent** tới nó."

📖 **Nguyên văn** — RFC 9700 §2.6 (metadata)
> "It is therefore RECOMMENDED that authorization servers publish OAuth Authorization Server Metadata according to [RFC8414] and that clients make use of this Authorization Server Metadata (when available) to configure themselves."

🇻🇳 **Dịch**
> "Do đó **KHUYẾN NGHỊ** authorization server công bố OAuth Authorization Server Metadata theo RFC 8414, và client **sử dụng metadata đó (khi có) để tự cấu hình**."

---

### C.7. Mô hình kẻ tấn công đã được cập nhật

RFC 9700 định nghĩa lại rõ ràng OAuth phải chống được ai:

📖 **Nguyên văn** — RFC 9700 §3 The Updated OAuth 2.0 Attacker Model
> "(A1)  Web attackers that can set up and operate an arbitrary number of network endpoints (besides the "honest" ones) including browsers and servers.  Web attackers may set up websites that are visited by the resource owner, operate their own user agents, and participate in the protocol.
>
>    ...
>
>    (A2)  Network attackers that additionally have full control over the network over which protocol participants communicate.  They can eavesdrop on, manipulate, and spoof messages, except when these are properly protected by cryptographic methods (e.g., TLS).  Network attackers can also block arbitrary messages."

🇻🇳 **Dịch**
> "**(A1) Web attacker** — kẻ có thể dựng và vận hành **số lượng tuỳ ý các network endpoint** (bên cạnh các endpoint "trung thực"), bao gồm cả browser và server. Web attacker có thể dựng website mà resource owner ghé thăm, vận hành user agent của riêng hắn, và **tham gia vào protocol**.
>
> **(A2) Network attacker** — ngoài những năng lực trên còn **kiểm soát hoàn toàn đường mạng** mà các bên tham gia protocol dùng để giao tiếp. Hắn có thể **nghe lén, thao túng và giả mạo** message, trừ khi message được bảo vệ đúng cách bằng phương pháp mật mã (ví dụ TLS). Network attacker cũng có thể **chặn** bất kỳ message nào."

> [!note] Vì sao điều này quan trọng
> Mọi khuyến nghị ở Phần C được thiết kế để đứng vững trước (A1) và (A2). Khi bạn bỏ bớt một biện pháp ("chắc không ai nghe lén đâu"), bạn đang tự hạ mô hình kẻ tấn công xuống dưới mức mà spec giả định — và các bảo đảm bảo mật của spec **không còn áp dụng**.

---

## PHẦN D — OAuth 2.1 (DRAFT, chưa phải chuẩn chính thức)

> [!warning] ĐÂY LÀ INTERNET-DRAFT, KHÔNG PHẢI RFC
> Tại thời điểm viết note này, OAuth 2.1 là **`draft-ietf-oauth-v2-1-16`**, published **3 September 2026**, Intended Status **Standards Track**, Expires **7 March 2027**. Nó **chưa được cấp số RFC**.
>
> 📖 **Nguyên văn** — Status of This Memo, draft-ietf-oauth-v2-1-16
> > "Internet-Drafts are draft documents valid for a maximum of six months and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to use Internet-Drafts as reference material or to cite them other than as "work in progress.""
>
> 🇻🇳 **Dịch**
> > "Internet-Draft là các tài liệu nháp có hiệu lực tối đa **sáu tháng** và có thể bị cập nhật, thay thế hoặc làm lỗi thời bởi tài liệu khác **bất cứ lúc nào**. **Việc dùng Internet-Draft làm tài liệu tham chiếu, hay trích dẫn nó theo cách nào khác ngoài "work in progress", là không phù hợp.**"
>
> Vì vậy: dùng OAuth 2.1 để **hiểu hướng đi**, nhưng khi cần viện dẫn một yêu cầu bắt buộc, hãy viện dẫn **RFC 9700**.

RFC 9700 chính nó cũng nhắc tới draft này:

📖 **Nguyên văn** — RFC 9700 §1 Introduction
> "OAuth 2.1, under development as [OAUTH-V2.1], will incorporate security recommendations from this document."

🇻🇳 **Dịch**
> "OAuth 2.1, đang được phát triển dưới dạng [OAUTH-V2.1], **sẽ tích hợp các khuyến nghị bảo mật từ tài liệu này**."

### D.1. OAuth 2.1 là gì

📖 **Nguyên văn** — draft-ietf-oauth-v2-1-16, Abstract
> "The OAuth 2.1 authorization framework enables an application to obtain limited access to a protected resource, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and an authorization service, or by allowing the application to obtain access on its own behalf.  This specification replaces and obsoletes the OAuth 2.0 Authorization Framework described in RFC 6749 and the Bearer Token Usage in RFC 6750."

🇻🇳 **Dịch**
> "OAuth 2.1 authorization framework cho phép một ứng dụng có được quyền truy cập giới hạn vào một protected resource, hoặc là thay mặt một resource owner bằng cách dàn xếp một tương tác chấp thuận giữa resource owner và một authorization service, hoặc là cho phép ứng dụng lấy quyền truy cập nhân danh chính nó. **Đặc tả này thay thế và làm lỗi thời OAuth 2.0 Authorization Framework mô tả trong RFC 6749, cùng với Bearer Token Usage trong RFC 6750.**"

### D.2. Những gì thay đổi so với OAuth 2.0

📖 **Nguyên văn** — draft-ietf-oauth-v2-1-16 §10 Differences from OAuth 2.0
> "This draft consolidates the functionality in OAuth 2.0 [RFC6749], OAuth 2.0 for Native Apps [RFC8252], Proof Key for Code Exchange [RFC7636], OAuth 2.0 for Browser-Based Apps [I-D.ietf-oauth-browser-based-apps], OAuth Security Best Current Practice [RFC9700], and Bearer Token Usage [RFC6750].
>
>    Where a later draft updates or obsoletes functionality found in the original [RFC6749], that functionality in this draft is updated with the normative changes described in a later draft, or removed entirely.
>
>    A non-normative list of changes from OAuth 2.0 is listed below:
>
>    The authorization code grant is extended with the functionality from PKCE [RFC7636] such that the default method of using the authorization code grant according to this specification requires the addition of the PKCE parameters
>
>    Redirect URIs must be compared using exact string matching as per Section 4.1.3 of [RFC9700]
>
>    The Implicit grant (response_type=token) is omitted from this specification as per Section 2.1.2 of [RFC9700]
>
>    The Resource Owner Password Credentials grant is omitted from this specification as per Section 2.4 of [RFC9700]
>
>    Bearer token usage omits the use of bearer tokens in the query string of URIs as per Section 4.3.2 of [RFC9700]
>
>    Refresh tokens for public clients must either be sender-constrained or one-time use as per Section 4.14.2 of [RFC9700]
>
>    The token endpoint request containing an authorization code no longer contains the redirect_uri parameter
>
>    Authorization servers must support client credentials in the request body
>
>    The PKCE plain method is removed"

🇻🇳 **Dịch**
> "Draft này **gom chung** các chức năng của OAuth 2.0 (RFC 6749), OAuth 2.0 for Native Apps (RFC 8252), Proof Key for Code Exchange (RFC 7636), OAuth 2.0 for Browser-Based Apps (draft), OAuth Security Best Current Practice (RFC 9700), và Bearer Token Usage (RFC 6750).
>
> Ở những chỗ một tài liệu ra sau cập nhật hoặc làm lỗi thời chức năng trong RFC 6749 gốc, thì chức năng đó trong draft này **được cập nhật theo các thay đổi có tính chuẩn tắc của tài liệu sau, hoặc bị gỡ bỏ hoàn toàn**.
>
> Danh sách (không mang tính chuẩn tắc) các thay đổi so với OAuth 2.0:
>
> - **Authorization code grant được mở rộng bằng chức năng của PKCE**, sao cho cách dùng mặc định của authorization code grant theo đặc tả này **bắt buộc phải thêm các parameter PKCE**.
> - **Redirect URI phải được so sánh bằng so khớp chuỗi chính xác**, theo §4.1.3 của RFC 9700.
> - **Implicit grant (`response_type=token`) bị loại khỏi** đặc tả này, theo §2.1.2 của RFC 9700.
> - **Resource Owner Password Credentials grant bị loại khỏi** đặc tả này, theo §2.4 của RFC 9700.
> - Cách dùng bearer token **không còn cho phép đặt bearer token trong query string của URI**, theo §4.3.2 của RFC 9700.
> - **Refresh token của public client phải hoặc là sender-constrained, hoặc là dùng-một-lần**, theo §4.14.2 của RFC 9700.
> - Request tới token endpoint có chứa authorization code **không còn chứa parameter `redirect_uri`** nữa.
> - **Authorization server phải hỗ trợ nhận client credential trong request body.**
> - **PKCE method `plain` bị gỡ bỏ.**"

### D.3. Vì sao implicit grant bị gỡ

📖 **Nguyên văn** — draft-ietf-oauth-v2-1-16 §10.1 Removal of the OAuth 2.0 Implicit grant
> "The OAuth 2.0 Implicit grant is omitted from OAuth 2.1 as it was deprecated in [RFC9700].
>
>    The intent of removing the Implicit grant is to no longer issue access tokens in the authorization response, as such tokens are vulnerable to leakage and injection, and are unable to be sender-constrained to a client. This behavior was indicated by clients using the response_type=token parameter. This value for the response_type parameter is no longer defined in OAuth 2.1.
>
>    Removal of response_type=token does not have an effect on other extension response types returning other artifacts from the authorization endpoint, for example, response_type=id_token defined by [OpenID.Connect]."

🇻🇳 **Dịch**
> "Implicit grant của OAuth 2.0 **bị loại khỏi OAuth 2.1 vì nó đã bị deprecate trong RFC 9700**.
>
> Mục đích của việc gỡ Implicit grant là **không còn cấp access token trong authorization response nữa**, vì những token như vậy **dễ bị rò rỉ và bị tiêm (injection), và không thể sender-constrain vào một client**. Hành vi này trước đây được client báo hiệu bằng parameter `response_type=token`. **Giá trị này của `response_type` không còn được định nghĩa trong OAuth 2.1.**
>
> Việc gỡ `response_type=token` **không ảnh hưởng** tới các extension response type khác trả về artifact khác từ authorization endpoint, ví dụ `response_type=id_token` do OpenID Connect định nghĩa."

### D.4. Vì sao `redirect_uri` bị bỏ khỏi token request

📖 **Nguyên văn** — draft-ietf-oauth-v2-1-16 §10.2 Redirect URI Parameter in Token Request
> "In OAuth 2.1, authorization code injection is prevented by the code_challenge and code_verifier parameters, making the inclusion of the redirect_uri parameter serve no purpose in the token request. As such, it has been removed.
>
>    For backwards compatibility of an authorization server wishing to support both OAuth 2.0 and OAuth 2.1 clients, the authorization server MUST allow clients to send the redirect_uri parameter in the token request (Section 4.1.3), and MUST enforce the parameter as described in [RFC6749]."

🇻🇳 **Dịch**
> "Trong OAuth 2.1, **tấn công tiêm authorization code đã được ngăn bởi parameter `code_challenge` và `code_verifier`**, khiến việc kèm parameter `redirect_uri` trong token request **không còn tác dụng gì nữa**. Vì vậy nó đã bị gỡ bỏ.
>
> Để tương thích ngược với authorization server muốn hỗ trợ cả client OAuth 2.0 lẫn OAuth 2.1, authorization server **BẮT BUỘC phải cho phép client gửi parameter `redirect_uri` trong token request** (§4.1.3), và **BẮT BUỘC phải thực thi parameter đó như mô tả trong RFC 6749**."

> [!tip] Đọc OAuth 2.1 như một bản tóm tắt
> Nếu bạn cần nắm "năm 2026 làm OAuth thế nào cho đúng", danh sách 9 gạch đầu dòng ở D.2 chính là câu trả lời cô đọng nhất. Toàn bộ chúng đều trỏ ngược về RFC 9700 — nguồn đã là chuẩn chính thức.

---

## Tóm tắt để nhớ

1. **OAuth 2.0 là authorization, không phải authentication.** Cần biết "người này là ai" → OpenID Connect.
2. **Bốn vai trò:** resource owner, client, authorization server, resource server.
3. **Ba khái niệm token:** access token (ngắn hạn, gửi tới resource server), refresh token (**không bao giờ** gửi tới resource server), scope (do authorization server định nghĩa, có thể bị cắt bớt).
4. **Chỉ dùng 2 grant type chính:** Authorization Code + PKCE (có người dùng) và Client Credentials (server-to-server). Thêm Device Grant cho thiết bị không nhập liệu được.
5. **Implicit grant:** RFC 9700 nói SHOULD NOT. **Password grant:** RFC 9700 nói MUST NOT.
6. **PKCE luôn dùng `S256`** — mặc định `plain` là bẫy; `code_verifier` phải mới mỗi giao dịch.
7. **Redirect URI:** exact string matching, không wildcard. Không open redirector.
8. **CSRF:** `state` dùng-một-lần, hoặc dựa vào PKCE nếu chắc chắn server hỗ trợ.
9. **Refresh token public client:** rotation hoặc sender-constrained — bắt buộc.
10. **Access token:** giới hạn `aud` và `scope`; resource server phải kiểm `aud` ở mọi request.
11. **OAuth 2.1 là DRAFT** (`draft-ietf-oauth-v2-1-16`, 3/9/2026) — đọc để nắm hướng, viện dẫn thì dùng RFC 9700.

---

## Liên kết

- Bài trước: [[14 - JWT]]
- Bài kế: [[16 - OpenID Connect]]
- [[10 - Authentication vs Authorization]] — phân biệt cốt lõi; OAuth 2.0 nằm hoàn toàn ở vế authorization
- [[13 - Token Authentication và Bearer Token]] — access token của OAuth thường được gửi dưới dạng Bearer token
- [[14 - JWT]] — một trong hai dạng access token mà RFC 6749 §1.4 mô tả ("self-contain the authorization information ... data and a signature"); claim `aud` liên quan trực tiếp tới C.5
- [[08 - OpenAPI Specification]] — Security Scheme Object của OpenAPI có type `oauth2` với các flow tương ứng grant type ở đây
- [[04 - HTTP Status Code và thiết kế lỗi]] — 401 (chưa authenticate) vs 403 (đã authenticate nhưng thiếu scope) khi resource server từ chối token
- [[09 - So sánh API Styles và REST Security]] — bối cảnh bảo mật API nói chung
- [[02 - REST]] — ràng buộc stateless và lý do token tự chứa thông tin lại hấp dẫn

---

## Nguồn tham khảo

- RFC 9700 — *Best Current Practice for OAuth 2.0 Security* (BCP 240, January 2025) : https://www.rfc-editor.org/rfc/rfc9700.txt
- RFC 6749 — *The OAuth 2.0 Authorization Framework* (October 2012) : https://www.rfc-editor.org/rfc/rfc6749.txt
- RFC 7636 — *Proof Key for Code Exchange by OAuth Public Clients* (September 2015) : https://www.rfc-editor.org/rfc/rfc7636.txt
- RFC 8252 — *OAuth 2.0 for Native Apps* (BCP 212, October 2017) : https://www.rfc-editor.org/rfc/rfc8252.txt
- RFC 8628 — *OAuth 2.0 Device Authorization Grant* (August 2019) : https://www.rfc-editor.org/rfc/rfc8628.txt
- RFC 6819 — *OAuth 2.0 Threat Model and Security Considerations* (January 2013) : https://www.rfc-editor.org/rfc/rfc6819.txt
- `draft-ietf-oauth-v2-1-16` — *The OAuth 2.1 Authorization Framework* (Internet-Draft, published 3 September 2026, expires 7 March 2027) : https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1
