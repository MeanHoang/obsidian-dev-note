# 12 — Cookie và Session based Authentication

> **Nguồn chính:** RFC 6265 *HTTP State Management Mechanism* — https://www.rfc-editor.org/rfc/rfc6265.txt
> **Nguồn chính (session):** OWASP *Session Management Cheat Sheet* — https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
> Bài này bám: RFC 6265 §1, §3, §4.1.2, §8 · draft-ietf-httpbis-rfc6265bis-22 §4.1.2.7, §8.8 · OWASP Session Management Cheat Sheet · OWASP CSRF Prevention Cheat Sheet · Fielding dissertation §6.3.4.2.

> [!note] Trạng thái chuẩn hoá (kiểm tra ngày 2026-09-11)
> - **RFC 6265** (April 2011, Proposed Standard) — vẫn là RFC hiệu lực cho cookie. **RFC 6265 KHÔNG định nghĩa `SameSite`.**
> - **`SameSite` được định nghĩa trong `draft-ietf-httpbis-rfc6265bis`** — tới rev **22** (1 December 2025) vẫn là **Internet-Draft**, chưa được cấp số RFC. Datatracker ghi trạng thái IESG là *RFC Ed Queue* (đã duyệt, đang nằm hàng đợi RFC Editor), trang đầu draft ghi `Obsoletes: 6265 (if approved)`.
> - Vì vậy trong bài này mọi trích dẫn về `SameSite` đều ghi rõ **là trích từ Internet-Draft**, không phải RFC.

---

# PHẦN A — Cookie (RFC 6265)

## A1. Cookie là gì

📖 **Nguyên văn** — RFC 6265, §1 Introduction
> "This document defines the HTTP Cookie and Set-Cookie header fields. Using the Set-Cookie header field, an HTTP server can pass name/value pairs and associated metadata (called cookies) to a user agent. When the user agent makes subsequent requests to the server, the user agent uses the metadata and other information to determine whether to return the name/value pairs in the Cookie header."

🇻🇳 **Dịch**
> "Tài liệu này định nghĩa các header field HTTP `Cookie` và `Set-Cookie`. Dùng header field `Set-Cookie`, một HTTP server có thể truyền các cặp name/value cùng metadata đi kèm (gọi là *cookie*) tới user agent. Khi user agent thực hiện các request kế tiếp tới server, user agent dùng metadata và thông tin khác để quyết định có trả các cặp name/value đó trong header `Cookie` hay không."

📖 **Nguyên văn** — RFC 6265, Abstract
> "These header fields can be used by HTTP servers to store state (called cookies) at HTTP user agents, letting the servers maintain a stateful session over the mostly stateless HTTP protocol. Although cookies have many historical infelicities that degrade their security and privacy, the Cookie and Set-Cookie header fields are widely used on the Internet."

🇻🇳 **Dịch**
> "Các header field này được HTTP server dùng để lưu trạng thái (gọi là cookie) tại HTTP user agent, cho phép server duy trì một session có trạng thái (stateful) trên nền protocol HTTP vốn gần như stateless. Dù cookie mang nhiều khiếm khuyết lịch sử làm suy giảm tính bảo mật và quyền riêng tư của nó, hai header field `Cookie` và `Set-Cookie` vẫn được dùng rộng rãi trên Internet."

> [!note] Chú ý câu "mostly stateless HTTP protocol"
> Cookie sinh ra chính vì HTTP không nhớ gì giữa hai request — xem lại [[02 - What is HTTP]] và [[01 - API là gì và nền tảng HTTP]]. Cookie là cơ chế **vá** tính stateless của HTTP, chứ không phải một phần thiết kế gốc của nó. Điều này sẽ quay lại ám ảnh ta ở [Phần C3](#c3-session-stateful-mâu-thuẫn-với-ràng-buộc-stateless-của-rest).

💡 **Ví dụ đời sống**
Bạn vào một quán cà phê nhượng quyền. Lần đầu, nhân viên đưa bạn một **thẻ tích điểm có số** (`Set-Cookie`). Mỗi lần sau bạn tới, bạn chìa thẻ ra (`Cookie`), nhân viên đọc số trên thẻ rồi tra sổ để biết bạn là ai. Bản thân quán không nhớ mặt bạn — quán chỉ nhớ *cái sổ*, còn *cái thẻ* thì bạn giữ.

---

## A2. `Set-Cookie` và `Cookie` — cơ chế tổng quan

📖 **Nguyên văn** — RFC 6265, §3 Overview
> "To store state, the origin server includes a Set-Cookie header in an HTTP response. In subsequent requests, the user agent returns a Cookie request header to the origin server. The Cookie header contains cookies the user agent received in previous Set-Cookie headers. The origin server is free to ignore the Cookie header or use its contents for an application-defined purpose."

🇻🇳 **Dịch**
> "Để lưu trạng thái, origin server đưa header `Set-Cookie` vào một HTTP response. Ở các request kế tiếp, user agent trả về header request `Cookie` cho origin server. Header `Cookie` chứa các cookie mà user agent đã nhận trong các header `Set-Cookie` trước đó. Origin server có toàn quyền bỏ qua header `Cookie` hoặc dùng nội dung của nó cho mục đích do ứng dụng tự định nghĩa."

📖 **Nguyên văn** — RFC 6265, §3 Overview (quy tắc gửi)
> "Origin servers MAY send a Set-Cookie response header with any response. User agents MAY ignore Set-Cookie headers contained in responses with 100-level status codes but MUST process Set-Cookie headers contained in other responses (including responses with 400- and 500-level status codes). An origin server can include multiple Set-Cookie header fields in a single response."

🇻🇳 **Dịch**
> "Origin server **MAY** gửi header response `Set-Cookie` kèm bất kỳ response nào. User agent **MAY** bỏ qua header `Set-Cookie` trong các response có status code nhóm 100, nhưng **MUST** xử lý header `Set-Cookie` trong các response khác (kể cả response có status code nhóm 400 và 500). Một origin server có thể đưa nhiều header field `Set-Cookie` vào cùng một response."

> [!tip] Liên hệ status code
> "MUST process Set-Cookie … including 400- and 500-level responses" nghĩa là ngay cả response `401 Unauthorized` cũng có thể set cookie. Xem thêm [[04 - HTTP Status Code và thiết kế lỗi]].

### Ví dụ NGUYÊN VĂN từ RFC 6265 §3.1

📖 **Nguyên văn** — RFC 6265, §3.1 Examples
> "Using the Set-Cookie header, a server can send the user agent a short string in an HTTP response that the user agent will return in future HTTP requests that are within the scope of the cookie. For example, the server can send the user agent a "session identifier" named SID with the value 31d4d96e407aad42. The user agent then returns the session identifier in subsequent requests."

🇻🇳 **Dịch**
> "Dùng header `Set-Cookie`, server có thể gửi cho user agent một chuỗi ngắn trong HTTP response, và user agent sẽ trả lại chuỗi đó ở các HTTP request tương lai nằm trong phạm vi (scope) của cookie. Ví dụ, server có thể gửi cho user agent một "session identifier" tên `SID` với giá trị `31d4d96e407aad42`. User agent sau đó trả lại session identifier này ở các request kế tiếp."

📖 **Nguyên văn** — RFC 6265, §3.1 (khối ví dụ, giữ nguyên whitespace)
```
   == Server -> User Agent ==

   Set-Cookie: SID=31d4d96e407aad42

   == User Agent -> Server ==

   Cookie: SID=31d4d96e407aad42
```

🇻🇳 Server gửi xuống một cookie tên `SID`; browser tự động đính kèm lại `SID` ở mọi request sau đó tới server này.

📖 **Nguyên văn** — RFC 6265, §3.1 (ví dụ nhiều cookie + `Secure`/`HttpOnly`)
> "As shown in the next example, the server can store multiple cookies at the user agent. For example, the server can store a session identifier as well as the user's preferred language by returning two Set-Cookie header fields. Notice that the server uses the Secure and HttpOnly attributes to provide additional security protections for the more sensitive session identifier (see Section 4.1.2.)"

🇻🇳 **Dịch**
> "Như ví dụ kế tiếp cho thấy, server có thể lưu nhiều cookie tại user agent. Ví dụ, server có thể lưu một session identifier cùng với ngôn ngữ ưa thích của user bằng cách trả về hai header field `Set-Cookie`. Lưu ý rằng server dùng attribute `Secure` và `HttpOnly` để cung cấp thêm các lớp bảo vệ bảo mật cho session identifier vốn nhạy cảm hơn (xem Section 4.1.2)."

📖 **Nguyên văn** — RFC 6265, §3.1 (khối ví dụ, giữ nguyên whitespace)
```
   == Server -> User Agent ==

   Set-Cookie: SID=31d4d96e407aad42; Path=/; Secure; HttpOnly
   Set-Cookie: lang=en-US; Path=/; Domain=example.com

   == User Agent -> Server ==

   Cookie: SID=31d4d96e407aad42; lang=en-US
```

🇻🇳 Hai `Set-Cookie` riêng biệt → browser gộp lại thành **một** header `Cookie` duy nhất, các cookie ngăn nhau bằng `; `.

📖 **Nguyên văn** — RFC 6265, §3.1 (xoá cookie)
> "Finally, to remove a cookie, the server returns a Set-Cookie header with an expiration date in the past. The server will be successful in removing the cookie only if the Path and the Domain attribute in the Set-Cookie header match the values used when the cookie was created."

🇻🇳 **Dịch**
> "Cuối cùng, để xoá một cookie, server trả về header `Set-Cookie` với ngày hết hạn nằm trong quá khứ. Server chỉ xoá cookie thành công nếu attribute `Path` và `Domain` trong header `Set-Cookie` khớp với các giá trị đã dùng lúc tạo cookie."

📖 **Nguyên văn** — RFC 6265, §3.1 (khối ví dụ, giữ nguyên whitespace)
```
   == Server -> User Agent ==

   Set-Cookie: lang=; Expires=Sun, 06 Nov 1994 08:49:37 GMT
```

🇻🇳 Không có lệnh "xoá cookie" — chỉ có cách ghi đè nó bằng giá trị rỗng + hạn dùng đã quá.

---

## A3. Các attribute của `Set-Cookie` — trích nguyên văn từng cái

### `Expires`

📖 **Nguyên văn** — RFC 6265, §4.1.2.1 The Expires Attribute
> "The Expires attribute indicates the maximum lifetime of the cookie, represented as the date and time at which the cookie expires. The user agent is not required to retain the cookie until the specified date has passed. In fact, user agents often evict cookies due to memory pressure or privacy concerns."

🇻🇳 **Dịch**
> "Attribute `Expires` chỉ ra thời gian sống tối đa của cookie, biểu diễn bằng ngày giờ mà cookie hết hạn. User agent **không bắt buộc** phải giữ cookie cho đến khi ngày đó trôi qua. Trên thực tế, user agent thường xoá bớt cookie vì áp lực bộ nhớ hoặc vì lý do quyền riêng tư."

### `Max-Age`

📖 **Nguyên văn** — RFC 6265, §4.1.2.2 The Max-Age Attribute
> "The Max-Age attribute indicates the maximum lifetime of the cookie, represented as the number of seconds until the cookie expires. The user agent is not required to retain the cookie for the specified duration. In fact, user agents often evict cookies due to memory pressure or privacy concerns."
>
> "If a cookie has both the Max-Age and the Expires attribute, the Max-Age attribute has precedence and controls the expiration date of the cookie. If a cookie has neither the Max-Age nor the Expires attribute, the user agent will retain the cookie until "the current session is over" (as defined by the user agent)."

🇻🇳 **Dịch**
> "Attribute `Max-Age` chỉ ra thời gian sống tối đa của cookie, biểu diễn bằng số giây cho tới khi cookie hết hạn. User agent không bắt buộc phải giữ cookie đủ khoảng thời gian đó. Trên thực tế, user agent thường xoá bớt cookie vì áp lực bộ nhớ hoặc vì lý do quyền riêng tư."
>
> "Nếu một cookie có **cả** `Max-Age` lẫn `Expires`, thì `Max-Age` được ưu tiên và quyết định ngày hết hạn của cookie. Nếu cookie **không có** cả `Max-Age` lẫn `Expires`, user agent sẽ giữ cookie cho tới khi "phiên hiện tại kết thúc" (theo định nghĩa của chính user agent)."

> [!note] Đây chính là "session cookie"
> Cookie không có `Expires`/`Max-Age` = *session cookie* theo nghĩa của browser: mất khi đóng browser. Đừng nhầm với "session" phía server ở [Phần B](#phần-b--session-based-authentication-owasp) — hai khái niệm trùng tên nhưng khác tầng.

### `Domain`

📖 **Nguyên văn** — RFC 6265, §4.1.2.3 The Domain Attribute
> "The Domain attribute specifies those hosts to which the cookie will be sent. For example, if the value of the Domain attribute is "example.com", the user agent will include the cookie in the Cookie header when making HTTP requests to example.com, www.example.com, and www.corp.example.com. […] If the server omits the Domain attribute, the user agent will return the cookie only to the origin server."

🇻🇳 **Dịch**
> "Attribute `Domain` chỉ định những host mà cookie sẽ được gửi tới. Ví dụ, nếu giá trị của `Domain` là `"example.com"`, user agent sẽ đính cookie vào header `Cookie` khi gửi HTTP request tới `example.com`, `www.example.com`, và `www.corp.example.com`. […] Nếu server **bỏ qua** attribute `Domain`, user agent chỉ trả cookie về đúng origin server."

### `Path`

📖 **Nguyên văn** — RFC 6265, §4.1.2.4 The Path Attribute
> "The scope of each cookie is limited to a set of paths, controlled by the Path attribute. If the server omits the Path attribute, the user agent will use the "directory" of the request-uri's path component as the default value. […]"
>
> "Although seemingly useful for isolating cookies between different paths within a given host, the Path attribute cannot be relied upon for security (see Section 8)."

🇻🇳 **Dịch**
> "Phạm vi của mỗi cookie bị giới hạn theo một tập path, do attribute `Path` kiểm soát. Nếu server bỏ qua `Path`, user agent sẽ dùng "thư mục" trong phần path của request-uri làm giá trị mặc định. […]"
>
> "Dù trông có vẻ hữu ích để cô lập cookie giữa các path khác nhau trên cùng một host, attribute `Path` **không đáng tin cậy về mặt bảo mật** (xem Section 8)."

### `Secure` ⚠️

📖 **Nguyên văn** — RFC 6265, §4.1.2.5 The Secure Attribute
> "The Secure attribute limits the scope of the cookie to "secure" channels (where "secure" is defined by the user agent). When a cookie has the Secure attribute, the user agent will include the cookie in an HTTP request only if the request is transmitted over a secure channel (typically HTTP over Transport Layer Security (TLS) [RFC2818])."
>
> "Although seemingly useful for protecting cookies from active network attackers, the Secure attribute protects only the cookie's confidentiality. An active network attacker can overwrite Secure cookies from an insecure channel, disrupting their integrity (see Section 8.6 for more details)."

🇻🇳 **Dịch**
> "Attribute `Secure` giới hạn phạm vi cookie trong các kênh "an toàn" (với "an toàn" do user agent định nghĩa). Khi một cookie có attribute `Secure`, user agent chỉ đính cookie đó vào HTTP request nếu request được truyền qua kênh an toàn (thường là HTTP trên nền Transport Layer Security (TLS) [RFC2818])."
>
> "Dù trông có vẻ hữu ích để bảo vệ cookie khỏi kẻ tấn công mạng chủ động, attribute `Secure` **chỉ bảo vệ tính bí mật (confidentiality)** của cookie. Một kẻ tấn công mạng chủ động vẫn có thể ghi đè cookie `Secure` từ một kênh không an toàn, phá vỡ tính toàn vẹn (integrity) của nó (xem Section 8.6)."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Secure Attribute*
> "The Secure cookie attribute instructs web browsers to only send the cookie through an encrypted HTTPS (SSL/TLS) connection. This session protection mechanism is mandatory to prevent the disclosure of the session ID through MitM (Man-in-the-Middle) attacks. It ensures that an attacker cannot simply capture the session ID from web browser traffic."

🇻🇳 **Dịch**
> "Attribute cookie `Secure` chỉ thị cho web browser chỉ gửi cookie qua kết nối HTTPS (SSL/TLS) được mã hoá. Cơ chế bảo vệ session này là **bắt buộc** để ngăn lộ session ID qua tấn công MitM (Man-in-the-Middle). Nó đảm bảo kẻ tấn công không thể bắt được session ID đơn giản chỉ bằng cách nghe lén traffic của browser."

### `HttpOnly` ⚠️

📖 **Nguyên văn** — RFC 6265, §4.1.2.6 The HttpOnly Attribute
> "The HttpOnly attribute limits the scope of the cookie to HTTP requests. In particular, the attribute instructs the user agent to omit the cookie when providing access to cookies via "non-HTTP" APIs (such as a web browser API that exposes cookies to scripts)."
>
> "Note that the HttpOnly attribute is independent of the Secure attribute: a cookie can have both the HttpOnly and the Secure attribute."

🇻🇳 **Dịch**
> "Attribute `HttpOnly` giới hạn phạm vi của cookie trong các HTTP request. Cụ thể, attribute này chỉ thị cho user agent **bỏ qua** cookie đó khi cấp quyền truy cập cookie qua các API "không phải HTTP" (chẳng hạn một API của browser phơi cookie ra cho script)."
>
> "Lưu ý rằng attribute `HttpOnly` **độc lập** với attribute `Secure`: một cookie có thể mang cả `HttpOnly` lẫn `Secure`."

---

## A4. `SameSite` — chưa nằm trong RFC 6265

> [!warning] Ghi rõ trạng thái chuẩn hoá
> `SameSite` **không** có trong RFC 6265 (2011). Nó được định nghĩa trong Internet-Draft **`draft-ietf-httpbis-rfc6265bis`**, bản mới nhất lúc viết bài là **rev 22, ngày 1 December 2025**, trang bìa ghi `Obsoletes: 6265 (if approved)`, `Intended status: Standards Track`, `Expires: 4 June 2026`. Datatracker cho biết document đang ở trạng thái IESG *RFC Ed Queue* — tức **đã được duyệt nhưng CHƯA được cấp số RFC**. Mọi trích dẫn dưới đây là trích **từ draft**, không phải từ một RFC đã xuất bản.

📖 **Nguyên văn** — draft-ietf-httpbis-rfc6265bis-22, §4.1.2.7 The SameSite Attribute
> "The "SameSite" attribute limits the scope of the cookie such that it will only be attached to requests if those requests are same-site, as defined by the algorithm in Section 5.2. For example, requests for https://site.example/sekrit-image will attach same-site cookies if and only if initiated from a context whose "site for cookies" is an origin with a scheme and registered domain of "https" and "site.example" respectively."

🇻🇳 **Dịch**
> "Attribute `"SameSite"` giới hạn phạm vi cookie sao cho nó chỉ được đính vào request nếu các request đó là *same-site*, theo thuật toán định nghĩa ở Section 5.2. Ví dụ, request tới `https://site.example/sekrit-image` sẽ đính các cookie same-site **khi và chỉ khi** nó được khởi tạo từ một ngữ cảnh mà "site for cookies" là một origin có scheme và registered domain lần lượt là `"https"` và `"site.example"`."

📖 **Nguyên văn** — draft-ietf-httpbis-rfc6265bis-22, §4.1.2.7 (ba giá trị)
> "If the "SameSite" attribute's value is "Strict", the cookie will only be sent along with "same-site" requests. If the value is "Lax", the cookie will be sent with same-site requests, and with "cross-site" top-level navigations, as described in Section 5.6.7.1. If the value is "None", the cookie will be sent with same-site and cross-site requests. If the "SameSite" attribute's value is something other than these three known keywords, the attribute's value will be subject to a default enforcement mode that is equivalent to "Lax"."

🇻🇳 **Dịch**
> "Nếu giá trị của attribute `"SameSite"` là `"Strict"`, cookie **chỉ** được gửi kèm các request "same-site". Nếu giá trị là `"Lax"`, cookie được gửi kèm các request same-site, **và** kèm các *top-level navigation* "cross-site", như mô tả ở Section 5.6.7.1. Nếu giá trị là `"None"`, cookie được gửi kèm cả request same-site lẫn cross-site. Nếu giá trị của `"SameSite"` là thứ gì đó ngoài ba keyword đã biết này, giá trị đó sẽ chịu một chế độ thực thi mặc định tương đương `"Lax"`."

📖 **Nguyên văn** — draft-ietf-httpbis-rfc6265bis-22, §4.1.2.7 (ảnh hưởng tới việc *tạo* cookie)
> "The "SameSite" attribute affects cookie creation as well as delivery. Cookies which assert "SameSite=Lax" or "SameSite=Strict" cannot be set in responses to cross-site subresource requests, or cross-site nested navigations. They can be set along with any top-level navigation, cross-site or otherwise."

🇻🇳 **Dịch**
> "Attribute `"SameSite"` ảnh hưởng tới cả việc **tạo** cookie chứ không chỉ việc **gửi** cookie. Cookie khai báo `"SameSite=Lax"` hoặc `"SameSite=Strict"` **không thể** được set trong response cho các request subresource cross-site, hay các nested navigation cross-site. Chúng có thể được set kèm bất kỳ top-level navigation nào, dù cross-site hay không."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *SameSite Attribute*
> "The SameSite attribute controls whether browsers send a cookie with cross-site requests. SameSite=Strict excludes cross-site requests, while SameSite=Lax permits top-level cross-site navigations that use safe HTTP methods. Treat SameSite as defense in depth against CSRF, not as a replacement for a CSRF token. Session cookies must explicitly set SameSite=Strict (preferred) or SameSite=Lax. Never use SameSite=None without Secure, and do not rely on the browser-default value, which varies across browsers and versions."

🇻🇳 **Dịch**
> "Attribute `SameSite` kiểm soát việc browser có gửi cookie kèm các request cross-site hay không. `SameSite=Strict` loại bỏ request cross-site, còn `SameSite=Lax` cho phép các top-level navigation cross-site dùng HTTP method an toàn. Hãy coi `SameSite` là **phòng thủ theo chiều sâu (defense in depth)** chống CSRF, **không phải** thứ thay thế cho CSRF token. Session cookie **phải** set tường minh `SameSite=Strict` (ưu tiên) hoặc `SameSite=Lax`. Tuyệt đối không dùng `SameSite=None` mà thiếu `Secure`, và đừng dựa vào giá trị mặc định của browser vì nó khác nhau giữa các browser và các phiên bản."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Cookie Name Prefixes*
> "Use cookie name prefixes to bind cookies to security properties at the browser level (RFC 6265bis §4.1.3):"
>
> "__Host- — the cookie must be set with Secure, must not have a Domain attribute, and must use Path=/. Prevents subdomain forgery and HTTPS downgrade attacks. Recommended for session IDs."
>
> "__Secure- — the cookie must be set with Secure. Use only when subdomain sharing is required."

🇻🇳 **Dịch**
> "Dùng tiền tố tên cookie (cookie name prefix) để ràng buộc cookie vào các thuộc tính bảo mật ngay ở tầng browser (RFC 6265bis §4.1.3):"
>
> "`__Host-` — cookie **phải** được set kèm `Secure`, **không được** có attribute `Domain`, và **phải** dùng `Path=/`. Ngăn giả mạo từ subdomain và tấn công hạ cấp HTTPS. **Được khuyến nghị cho session ID.**"
>
> "`__Secure-` — cookie phải được set kèm `Secure`. Chỉ dùng khi cần chia sẻ cookie giữa các subdomain."

---

## A5. Security Considerations của RFC 6265 — nguyên văn

📖 **Nguyên văn** — RFC 6265, §8.1 Overview
> "Cookies have a number of security pitfalls. This section overviews a few of the more salient issues."
>
> "In particular, cookies encourage developers to rely on ambient authority for authentication, often becoming vulnerable to attacks such as cross-site request forgery [CSRF]. Also, when storing session identifiers in cookies, developers often create session fixation vulnerabilities."
>
> "Transport-layer encryption, such as that employed in HTTPS, is insufficient to prevent a network attacker from obtaining or altering a victim's cookies because the cookie protocol itself has various vulnerabilities (see "Weak Confidentiality" and "Weak Integrity", below). In addition, by default, cookies do not provide confidentiality or integrity from network attackers, even when used in conjunction with HTTPS."

🇻🇳 **Dịch**
> "Cookie có một loạt cạm bẫy bảo mật. Mục này điểm qua vài vấn đề nổi bật hơn cả."
>
> "Cụ thể, cookie **khuyến khích lập trình viên dựa vào *ambient authority* để làm authentication**, và do đó thường trở nên dễ tổn thương trước các tấn công như cross-site request forgery [CSRF]. Ngoài ra, khi lưu session identifier trong cookie, lập trình viên thường tạo ra lỗ hổng session fixation."
>
> "Mã hoá ở tầng transport, như HTTPS dùng, là **không đủ** để ngăn kẻ tấn công mạng lấy hoặc sửa cookie của nạn nhân, bởi bản thân protocol cookie có nhiều lỗ hổng (xem "Weak Confidentiality" và "Weak Integrity" bên dưới). Thêm nữa, **mặc định cookie không cung cấp tính bí mật hay tính toàn vẹn** trước kẻ tấn công mạng, ngay cả khi dùng kèm HTTPS."

📖 **Nguyên văn** — RFC 6265, §8.2 Ambient Authority
> "A server that uses cookies to authenticate users can suffer security vulnerabilities because some user agents let remote parties issue HTTP requests from the user agent (e.g., via HTTP redirects or HTML forms). When issuing those requests, user agents attach cookies even if the remote party does not know the contents of the cookies, potentially letting the remote party exercise authority at an unwary server."
>
> "Although this security concern goes by a number of names (e.g., cross-site request forgery, confused deputy), the issue stems from cookies being a form of ambient authority. Cookies encourage server operators to separate designation (in the form of URLs) from authorization (in the form of cookies). Consequently, the user agent might supply the authorization for a resource designated by the attacker, possibly causing the server or its clients to undertake actions designated by the attacker as though they were authorized by the user."

🇻🇳 **Dịch**
> "Một server dùng cookie để authenticate user có thể mắc lỗ hổng bảo mật, bởi vì một số user agent cho phép bên thứ ba từ xa phát ra HTTP request từ chính user agent đó (ví dụ qua HTTP redirect hoặc HTML form). Khi phát ra các request ấy, user agent **vẫn đính cookie vào** dù bên thứ ba không hề biết nội dung cookie, qua đó có thể để bên thứ ba thực thi quyền hạn trên một server thiếu cảnh giác."
>
> "Dù mối lo bảo mật này mang nhiều tên gọi (cross-site request forgery, confused deputy…), gốc rễ vấn đề nằm ở chỗ cookie là một dạng **ambient authority** (quyền hạn "có sẵn trong không khí"). Cookie khuyến khích người vận hành server **tách *chỉ định* (dưới dạng URL) khỏi *cấp quyền* (dưới dạng cookie)**. Hậu quả là user agent có thể cung cấp phần cấp quyền cho một resource do kẻ tấn công chỉ định, khiến server hoặc client của nó thực hiện hành động do kẻ tấn công chỉ định như thể chúng được user cho phép."

📖 **Nguyên văn** — RFC 6265, §8.3 Clear Text
> "Unless sent over a secure channel (such as TLS), the information in the Cookie and Set-Cookie headers is transmitted in the clear."
>
> "1.  All sensitive information conveyed in these headers is exposed to an eavesdropper."
>
> "2.  A malicious intermediary could alter the headers as they travel in either direction, with unpredictable results."
>
> "3.  A malicious client could alter the Cookie header before transmission, with unpredictable results."
>
> "In addition to encrypting and signing the contents of every cookie, servers that require a higher level of security SHOULD use the Cookie and Set-Cookie headers only over a secure channel. When using cookies over a secure channel, servers SHOULD set the Secure attribute (see Section 4.1.2.5) for every cookie. If a server does not set the Secure attribute, the protection provided by the secure channel will be largely moot."

🇻🇳 **Dịch**
> "Trừ khi được gửi qua kênh an toàn (như TLS), thông tin trong header `Cookie` và `Set-Cookie` được truyền ở dạng rõ (clear text)."
>
> "1. Mọi thông tin nhạy cảm chuyển trong các header này đều phơi ra trước kẻ nghe lén."
>
> "2. Một trung gian độc hại có thể sửa các header này khi chúng đi theo cả hai chiều, với hậu quả khó lường."
>
> "3. Một client độc hại có thể sửa header `Cookie` trước khi truyền, với hậu quả khó lường."
>
> "Ngoài việc mã hoá và ký nội dung mọi cookie, server yêu cầu mức bảo mật cao hơn **SHOULD** chỉ dùng header `Cookie` và `Set-Cookie` trên kênh an toàn. Khi dùng cookie trên kênh an toàn, server **SHOULD** set attribute `Secure` (xem Section 4.1.2.5) cho **mọi** cookie. Nếu server không set `Secure`, lớp bảo vệ mà kênh an toàn mang lại gần như trở nên vô nghĩa."

📖 **Nguyên văn** — RFC 6265, §8.4 Session Identifiers
> "Instead of storing session information directly in a cookie (where it might be exposed to or replayed by an attacker), servers commonly store a nonce (or "session identifier") in a cookie. When the server receives an HTTP request with a nonce, the server can look up state information associated with the cookie using the nonce as a key."
>
> "Using session identifier cookies limits the damage an attacker can cause if the attacker learns the contents of a cookie because the nonce is useful only for interacting with the server (unlike non-nonce cookie content, which might itself be sensitive)."

🇻🇳 **Dịch**
> "Thay vì lưu thẳng thông tin session vào cookie (nơi nó có thể bị kẻ tấn công đọc được hoặc phát lại), server thường lưu một *nonce* (hay "session identifier") trong cookie. Khi server nhận HTTP request kèm nonce, server có thể tra cứu thông tin trạng thái gắn với cookie đó, dùng nonce làm key."
>
> "Dùng cookie chứa session identifier giúp giới hạn thiệt hại khi kẻ tấn công biết được nội dung cookie, bởi nonce chỉ có ích khi tương tác với chính server đó (khác với nội dung cookie không phải nonce — thứ bản thân nó có thể đã nhạy cảm)."

📖 **Nguyên văn** — RFC 6265, §8.4 (session fixation)
> "Using session identifiers is not without risk. For example, the server SHOULD take care to avoid "session fixation" vulnerabilities. A session fixation attack proceeds in three steps. First, the attacker transplants a session identifier from his or her user agent to the victim's user agent. Second, the victim uses that session identifier to interact with the server, possibly imbuing the session identifier with the user's credentials or confidential information. Third, the attacker uses the session identifier to interact with server directly, possibly obtaining the user's authority or confidential information."

🇻🇳 **Dịch**
> "Dùng session identifier không phải là không có rủi ro. Ví dụ, server **SHOULD** cẩn thận để tránh lỗ hổng "session fixation". Một tấn công session fixation diễn ra theo ba bước. **Thứ nhất**, kẻ tấn công cấy một session identifier từ user agent của hắn sang user agent của nạn nhân. **Thứ hai**, nạn nhân dùng chính session identifier đó để tương tác với server, qua đó có thể gán credential hoặc thông tin mật của mình vào session identifier ấy. **Thứ ba**, kẻ tấn công dùng session identifier đó để tương tác trực tiếp với server, qua đó có thể chiếm quyền hoặc thông tin mật của user."

# PHẦN B — Session-based authentication (OWASP)

## B1. Session là gì

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Introduction*
> "A web session is a sequence of network HTTP request and response transactions associated with the same user. Modern and complex web applications require the retaining of information or status about each user for the duration of multiple requests. Therefore, sessions provide the ability to establish variables – such as access rights and localization settings – which will apply to each and every interaction a user has with the web application for the duration of the session."

🇻🇳 **Dịch**
> "Một *web session* là một chuỗi các giao dịch request và response HTTP qua mạng gắn với **cùng một user**. Các web application hiện đại và phức tạp cần lưu giữ thông tin hoặc trạng thái về từng user xuyên suốt nhiều request. Do đó, session cung cấp khả năng thiết lập các biến — như quyền truy cập và thiết lập ngôn ngữ/vùng — áp dụng cho **mọi** tương tác của user với web application trong suốt thời gian session tồn tại."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Introduction*
> "Once an authenticated session has been established, the session ID (or token) is temporarily equivalent to the strongest authentication method used by the application, such as username and password, passphrases, one-time passwords (OTP), client-based digital certificates, smartcards, or biometrics (such as fingerprint or eye retina)."

🇻🇳 **Dịch**
> "Một khi session đã được authenticate được thiết lập, **session ID (hay token) tạm thời tương đương với phương thức authentication mạnh nhất mà ứng dụng dùng**, chẳng hạn username và password, passphrase, one-time password (OTP), digital certificate phía client, smartcard, hay sinh trắc học (vân tay, võng mạc)."

> [!danger] Hệ quả trực tiếp
> Session ID **có giá trị ngang mật khẩu**. Ai cầm được session ID thì trong thời gian session còn sống, họ *chính là* user đó. Mọi quyết định thiết kế ở phần dưới đều xuất phát từ một câu này.

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Introduction*
> "HTTP is a stateless protocol (RFC2616 section 5), where each request and response pair is independent of other web interactions. Therefore, in order to introduce the concept of a session, it is required to implement session management capabilities that link both the authentication and access control (or authorization) modules commonly available in web applications"

🇻🇳 **Dịch**
> "HTTP là một protocol **stateless** (RFC2616 section 5), trong đó mỗi cặp request/response độc lập với các tương tác web khác. Vì vậy, để đưa khái niệm session vào, ta buộc phải hiện thực các năng lực session management nối module authentication với module access control (hay authorization) vốn có sẵn trong web application."

💡 **Ví dụ đời sống — vé gửi xe có số**
Bạn gửi xe ở bãi. Nhân viên ghi biển số xe vào **sổ** và đưa bạn **tấm vé số 137**. Tấm vé không ghi bạn là ai, không ghi xe gì — nó chỉ là **con số** (session ID). Toàn bộ thông tin nằm ở cái sổ của bãi (session store phía server). Lấy xe ra, bạn chìa vé, nhân viên tra sổ.
→ Ai nhặt được vé 137 thì lấy được xe của bạn. Đó chính là session hijacking.
(Còn một kiểu vé khác: vé tự ghi đầy đủ "Honda Wave, biển 29X1-…, gửi 8h00" có đóng dấu chống giả — bãi không cần sổ. Đó là **token tự chứa**, học ở [[13 - Token Authentication và Bearer Token]].)

## B2. Vòng đời của session ID

Từ các mục OWASP đã trích ở trên, vòng đời rút gọn:

| Giai đoạn | Chuyện gì xảy ra | Nguồn |
|---|---|---|
| **Tạo** | Session ID được cấp lúc session được tạo, sinh bằng CSPRNG | OWASP §Session ID Properties, §Entropy |
| **Trao đổi** | Gửi kèm **mọi** HTTP request (thường qua cookie) | OWASP §Session ID Properties |
| **Đăng nhập** | Session ID **phải được regenerate** khi privilege level đổi | OWASP §Renew the Session ID… |
| **Hết hạn** | Idle timeout + absolute timeout, enforce **phía server** | OWASP §Session Expiration |
| **Đăng xuất** | Server **phải** invalidate session thật, không chỉ xoá cookie | OWASP §Session Expiration, §Logout Button |

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session ID Properties*
> "In order to keep the authenticated state and track the users progress within the web application, applications provide users with a session identifier (session ID or token) that is assigned at session creation time, and is shared and exchanged by the user and the web application for the duration of the session (it is sent on every HTTP request). The session ID is a name=value pair."

🇻🇳 **Dịch**
> "Để giữ trạng thái đã authenticate và theo dõi tiến trình của user trong web application, ứng dụng cấp cho user một *session identifier* (session ID hay token) được gán **lúc tạo session**, và được user cùng web application chia sẻ, trao đổi **suốt thời gian session tồn tại (nó được gửi kèm MỌI HTTP request)**. Session ID là một cặp `name=value`."

## B3. Session ID properties — entropy, độ dài, nội dung

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session ID Entropy*
> "Session identifiers must have at least 64 bits of entropy to prevent brute-force session guessing attacks. Entropy refers to the amount of randomness or unpredictability in a value. Each “bit” of entropy doubles the number of possible outcomes, meaning a session ID with 64 bits of entropy can have 2^64 possible values."
>
> "A strong CSPRNG (Cryptographically Secure Pseudorandom Number Generator) must be used to generate session IDs. This ensures the generated values are evenly distributed among all possible values. Otherwise, attackers may be able to use statistical analysis techniques to identify patterns in how the session IDs are created, effectively reducing the entropy and allowing the attacker to guess or predict valid session IDs more easily."

🇻🇳 **Dịch**
> "Session identifier **phải có ít nhất 64 bit entropy** để chống tấn công brute-force đoán session. *Entropy* là mức độ ngẫu nhiên hay khó đoán của một giá trị. Mỗi "bit" entropy nhân đôi số kết cục khả dĩ, nghĩa là một session ID có 64 bit entropy có thể nhận 2^64 giá trị."
>
> "**Phải dùng một CSPRNG mạnh** (Cryptographically Secure Pseudorandom Number Generator) để sinh session ID. Điều này đảm bảo các giá trị sinh ra phân bố đều trên toàn bộ không gian giá trị. Nếu không, kẻ tấn công có thể dùng kỹ thuật phân tích thống kê để nhận ra quy luật tạo session ID, qua đó làm giảm entropy thực tế và đoán/dự báo session ID hợp lệ dễ dàng hơn."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session ID Entropy* (NOTE)
> "If a web application generates session IDs with 64 bits of entropy, an attacker can expect to spend approximately 585 years to successfully guess a valid session ID, assuming the attacker can try 10,000 guesses per second with 100,000 valid simultaneous sessions available in the application."

🇻🇳 **Dịch**
> "Nếu một web application sinh session ID với 64 bit entropy, kẻ tấn công dự kiến phải mất khoảng **585 năm** để đoán trúng một session ID hợp lệ, với giả định hắn thử được 10.000 lần đoán mỗi giây và ứng dụng có 100.000 session hợp lệ đang cùng tồn tại."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session ID Length*
> "As mentioned in the previous Session ID Entropy section, a primary security requirement for session IDs is that they contain at least 64 bits of entropy to prevent brute-force guessing attacks. Although session ID length matters, it's the entropy that ensures security. The session ID must be long enough to encode sufficient entropy, preventing brute force attacks where an attacker guesses valid session IDs."
>
> "Different encoding methods can result in different lengths for the same amount of entropy. Session IDs are often represented using hexadecimal encoding. When using hexadecimal encoding, a session ID must be at least 16 hexadecimal characters long to achieve the required 64 bits of entropy."

🇻🇳 **Dịch**
> "Như đã nói ở mục Session ID Entropy phía trước, yêu cầu bảo mật cốt lõi cho session ID là chúng chứa **ít nhất 64 bit entropy** để chống brute-force. Dù độ dài session ID có ý nghĩa, thứ đảm bảo an toàn vẫn là **entropy**. Session ID phải đủ dài để mã hoá được lượng entropy cần thiết."
>
> "Các phương pháp encoding khác nhau cho ra độ dài khác nhau với cùng lượng entropy. Session ID thường được biểu diễn bằng encoding hexadecimal. Khi dùng hexadecimal, session ID **phải dài ít nhất 16 ký tự hex** để đạt 64 bit entropy yêu cầu."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session ID Content (or Value)*
> "The session ID content (or value) must be meaningless to prevent information disclosure attacks, where an attacker is able to decode the contents of the ID and extract details of the user, the session, or the inner workings of the web application."
>
> "The session ID must simply be an identifier on the client side, and its value must never include sensitive information or Personally Identifiable Information (PII)."
>
> "The meaning and business or application logic associated with the session ID must be stored on the server side, and specifically, in session objects or in a session management database or repository."

🇻🇳 **Dịch**
> "Nội dung (giá trị) của session ID **phải vô nghĩa** để ngăn tấn công lộ thông tin, trong đó kẻ tấn công giải mã được nội dung ID và rút ra chi tiết về user, về session, hoặc về cách vận hành nội bộ của web application."
>
> "Session ID ở phía client chỉ đơn thuần là một **định danh**, và giá trị của nó **tuyệt đối không được** chứa thông tin nhạy cảm hay Personally Identifiable Information (PII)."
>
> "Ý nghĩa cùng business logic / application logic gắn với session ID **phải được lưu ở phía server**, cụ thể là trong session object hoặc trong một database/repository quản lý session."

## B4. Regenerate session ID sau khi đăng nhập — chống session fixation

> [!danger] Đây là quy tắc dễ quên nhất và hậu quả là chiếm tài khoản
> Nếu bạn **giữ nguyên** session ID trước và sau khi đăng nhập, kẻ tấn công chỉ cần cấy sẵn một session ID vào browser nạn nhân, chờ nạn nhân đăng nhập, rồi dùng chính ID đó để vào tài khoản. Đó là **session fixation**.

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Renew the Session ID After Any Privilege Level Change*
> "The session ID must be renewed or regenerated by the web application after any privilege level change within the associated user session. The most common scenario where the session ID regeneration is mandatory is during the authentication process, as the privilege level of the user changes from the unauthenticated (or anonymous) state to the authenticated state though in some cases still not yet the authorized state. Common scenarios to consider include; password changes, permission changes, or switching from a regular user role to an administrator role within the web application. For all sensitive pages of the web application, any previous session IDs must be ignored, only the current session ID must be assigned to every new request received for the protected resource, and the old or previous session ID must be destroyed."

🇻🇳 **Dịch**
> "Session ID **phải** được làm mới hoặc tái sinh (regenerate) bởi web application **sau bất kỳ thay đổi nào về privilege level** trong session của user. Tình huống phổ biến nhất bắt buộc phải regenerate session ID là **trong quá trình authentication**, vì privilege level của user chuyển từ trạng thái chưa authenticate (hoặc ẩn danh) sang trạng thái đã authenticate — dù trong một số trường hợp vẫn chưa phải trạng thái đã authorize. Các tình huống phổ biến khác cần cân nhắc gồm: đổi password, đổi permission, hoặc chuyển từ role user thường sang role administrator. Với mọi trang nhạy cảm của web application, **mọi session ID cũ phải bị bỏ qua**, chỉ session ID hiện tại mới được gán cho mỗi request mới tới protected resource, và **session ID cũ phải bị huỷ**."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Renew the Session ID…* (vì sao)
> "The session ID regeneration is mandatory to prevent session fixation attacks, where an attacker sets the session ID on the victim user's web browser instead of gathering the victim's session ID, as in most of the other session-based attacks, and independently of using HTTP or HTTPS. This protection mitigates the impact of other web-based vulnerabilities that can also be used to launch session fixation attacks, such as HTTP response splitting or XSS"

🇻🇳 **Dịch**
> "Việc regenerate session ID là **bắt buộc** để ngăn tấn công session fixation, trong đó kẻ tấn công **set** session ID lên browser của nạn nhân thay vì đi thu thập session ID của nạn nhân như hầu hết các tấn công session khác — và điều này **không phụ thuộc** việc dùng HTTP hay HTTPS. Lớp bảo vệ này còn giảm nhẹ tác động của các lỗ hổng web khác cũng có thể dùng để phát động session fixation, như HTTP response splitting hay XSS."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Manage Session ID as Any Other User Input*
> "Session IDs must be considered untrusted, as any other user input processed by the web application, and they must be thoroughly validated and verified. […] If web applications do not validate and filter out invalid session ID values before processing them, they can potentially be used to exploit other web vulnerabilities, such as SQL injection if the session IDs are stored on a relational database, or persistent XSS if the session IDs are stored and reflected back afterwards by the web application."

🇻🇳 **Dịch**
> "Session ID **phải bị coi là không đáng tin**, y như mọi user input khác mà web application xử lý, và phải được validate, verify kỹ lưỡng. […] Nếu web application không validate và lọc bỏ các giá trị session ID không hợp lệ trước khi xử lý, chúng có thể bị lợi dụng để khai thác các lỗ hổng web khác — như **SQL injection** nếu session ID được lưu trong relational database, hoặc **persistent XSS** nếu session ID được lưu rồi phản chiếu lại bởi ứng dụng."

> [!tip] Session ID là user input
> Câu trên nối thẳng về [[13 - SQL Injection và Parameterized Query]]: session ID đi vào câu query tra session store cũng phải qua parameterized query như mọi input khác.

## B5. Session expiration — idle timeout vs absolute timeout

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session Expiration*
> "In order to minimize the time period an attacker can launch attacks over active sessions and hijack them, it is mandatory to set expiration timeouts for every session, establishing the amount of time a session will remain active. Insufficient session expiration by the web application increases the exposure of other session-based attacks, as for the attacker to be able to reuse a valid session ID and hijack the associated session, it must still be active."

🇻🇳 **Dịch**
> "Để giảm thiểu khoảng thời gian kẻ tấn công có thể phát động tấn công lên các session đang hoạt động và chiếm chúng, việc **đặt timeout hết hạn cho MỌI session là bắt buộc**, xác định rõ session sẽ còn active bao lâu. Nếu web application để session hết hạn không đủ chặt, mức phơi nhiễm trước các tấn công session khác tăng lên, bởi để kẻ tấn công tái dùng được một session ID hợp lệ và chiếm session gắn với nó, session đó phải còn đang active."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Idle Timeout*
> "All sessions should implement an idle or inactivity timeout. This timeout defines the amount of time a session will remain active in case there is no activity in the session, closing and invalidating the session upon the defined idle period since the last HTTP request received by the web application for a given session ID."
>
> "The idle timeout limits the chances an attacker has to guess and use a valid session ID from another user. However, if the attacker is able to hijack a given session, the idle timeout does not limit the attacker's actions, as they can generate activity on the session periodically to keep the session active for longer periods of time."
>
> "Session timeout management and expiration must be enforced server-side. If the client is used to enforce the session timeout, for example using the session token or other client parameters to track time references (e.g. number of minutes since login time), an attacker could manipulate these to extend the session duration."

🇻🇳 **Dịch**
> "Mọi session **nên** hiện thực một *idle timeout* (timeout do không hoạt động). Timeout này định nghĩa khoảng thời gian session còn active trong trường hợp không có hoạt động nào trong session, và sẽ đóng + vô hiệu hoá session khi hết khoảng nhàn rỗi đó tính từ **HTTP request cuối cùng** mà web application nhận cho session ID đó."
>
> "Idle timeout giới hạn cơ hội kẻ tấn công đoán và dùng một session ID hợp lệ của user khác. Tuy nhiên, nếu kẻ tấn công **đã chiếm được** session, idle timeout không hạn chế được hành động của hắn, vì hắn có thể tạo hoạt động định kỳ trên session để giữ session sống lâu hơn."
>
> "Việc quản lý và thực thi timeout session **phải được enforce ở phía server**. Nếu dùng client để enforce session timeout — ví dụ dùng session token hay tham số client khác để theo dõi mốc thời gian (số phút kể từ lúc login) — kẻ tấn công có thể thao túng chúng để kéo dài thời lượng session."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Absolute Timeout*
> "All sessions should implement an absolute timeout, regardless of session activity. This timeout defines the maximum amount of time a session can be active, closing and invalidating the session upon the defined absolute period since the given session was initially created by the web application. After invalidating the session, the user is forced to (re)authenticate again in the web application and establish a new session."
>
> "The absolute session limits the amount of time an attacker can use a hijacked session and impersonate the victim user."

🇻🇳 **Dịch**
> "Mọi session **nên** hiện thực một *absolute timeout*, bất kể session có hoạt động hay không. Timeout này định nghĩa **thời lượng tối đa** một session có thể active, đóng và vô hiệu hoá session khi hết khoảng thời gian tuyệt đối đó tính từ lúc session được web application tạo ra lần đầu. Sau khi session bị vô hiệu hoá, user buộc phải authenticate lại và thiết lập session mới."
>
> "Absolute timeout giới hạn khoảng thời gian kẻ tấn công có thể dùng một session đã chiếm được để mạo danh user nạn nhân."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session Expiration* (con số tham khảo)
> "Both the idle and absolute timeout values are highly dependent on how critical the web application and its data are. Common idle timeouts ranges are 2-5 minutes for high-value applications and 15-30 minutes for low risk applications. Absolute timeouts depend on how long a user usually uses the application. If the application is intended to be used by an office worker for a full day, an appropriate absolute timeout range could be between 4 and 8 hours."

🇻🇳 **Dịch**
> "Cả giá trị idle timeout lẫn absolute timeout đều phụ thuộc rất nhiều vào mức độ trọng yếu của web application và dữ liệu của nó. Khoảng idle timeout thường gặp là **2–5 phút** cho ứng dụng giá trị cao và **15–30 phút** cho ứng dụng rủi ro thấp. Absolute timeout phụ thuộc vào thời lượng user thường dùng ứng dụng. Nếu ứng dụng dành cho nhân viên văn phòng dùng cả ngày, khoảng absolute timeout hợp lý có thể là **4–8 giờ**."

## B6. Logout — server phải huỷ session thật

> [!danger] Xoá cookie ở client KHÔNG phải là đăng xuất
> Nếu server không invalidate session, ai đang giữ bản sao session ID (kẻ tấn công đã hijack, log proxy, tab khác…) vẫn tiếp tục dùng được. Xoá cookie chỉ làm *browser của user* quên ID — session phía server vẫn sống.

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Session Expiration*
> "When a session expires, the web application must take active actions to invalidate the session on both sides, client and server. The latter is the most relevant and mandatory from a security perspective."
>
> "For most session exchange mechanisms, client side actions to invalidate the session ID are based on clearing out the token value. For example, to invalidate a cookie it is recommended to provide an empty (or invalid) value for the session ID, and set the Expires (or Max-Age) attribute to a date from the past (in case a persistent cookie is being used): Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT"
>
> "In order to close and invalidate the session on the server side, it is mandatory for the web application to take active actions when the session expires, or the user actively logs out, by using the functions and methods offered by the session management mechanisms, such as HttpSession.invalidate() (J2EE), Session.Abandon() (ASP .NET) or session_destroy()/unset() (PHP)."

🇻🇳 **Dịch**
> "Khi một session hết hạn, web application **phải chủ động hành động để vô hiệu hoá session ở CẢ HAI phía**, client và server. **Phía server mới là phía quan trọng nhất và bắt buộc** xét từ góc độ bảo mật."
>
> "Với hầu hết cơ chế trao đổi session, hành động phía client để vô hiệu hoá session ID dựa trên việc xoá rỗng giá trị token. Ví dụ, để vô hiệu hoá một cookie, khuyến nghị là đặt giá trị rỗng (hoặc không hợp lệ) cho session ID và set attribute `Expires` (hoặc `Max-Age`) về một ngày trong quá khứ (trong trường hợp dùng persistent cookie): `Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT`"
>
> "Để đóng và vô hiệu hoá session ở phía server, web application **bắt buộc** phải chủ động hành động khi session hết hạn hoặc khi user chủ động đăng xuất, bằng các hàm/method mà cơ chế session management cung cấp, như `HttpSession.invalidate()` (J2EE), `Session.Abandon()` (ASP.NET) hay `session_destroy()`/`unset()` (PHP)."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Logout Button*
> "Web applications must provide a visible and easily accessible logout (logoff, exit, or close session) button that is available on the web application header or menu and reachable from every web application resource and page, so that the user can manually close the session at any time. As described in Session_Expiration section, the web application must invalidate the session at least on server side."

🇻🇳 **Dịch**
> "Web application **phải** cung cấp một nút đăng xuất (logout / logoff / exit / close session) nhìn thấy được và dễ truy cập, có mặt ở header hoặc menu của ứng dụng và tiếp cận được từ **mọi** resource, mọi trang, để user có thể chủ động đóng session bất cứ lúc nào. Như mô tả ở mục Session Expiration, web application **phải vô hiệu hoá session ít nhất ở phía server**."

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *Web Content Caching and Clear-Site-Data*
> "Session identifiers must never be cached. To prevent this, it is highly recommended to include the Cache-Control: no-store directive in responses containing session IDs. Unlike no-cache, which allows caching but requires revalidation, no-store ensures that the response (including headers like Set-Cookie) is never stored in any cache."
>
> "In addition to preventing future caching, applications should ensure that previously stored sensitive data is removed when a session ends. This can be achieved by returning the Clear-Site-Data response header (for example, Clear-Site-Data: "cache", "cookies", "storage") during logout or session termination."

🇻🇳 **Dịch**
> "Session identifier **tuyệt đối không được cache**. Để ngăn điều đó, rất khuyến nghị đưa directive `Cache-Control: no-store` vào các response chứa session ID. Khác với `no-cache` — vốn cho phép cache nhưng yêu cầu revalidate — `no-store` đảm bảo response (kể cả các header như `Set-Cookie`) **không bao giờ** được lưu ở bất kỳ cache nào."
>
> "Ngoài việc ngăn cache về sau, ứng dụng nên đảm bảo dữ liệu nhạy cảm đã lưu trước đó bị xoá khi session kết thúc. Có thể làm điều này bằng cách trả header response `Clear-Site-Data` (ví dụ `Clear-Site-Data: "cache", "cookies", "storage"`) lúc logout hoặc khi kết thúc session."

---

# PHẦN C — Rủi ro và đối chiếu

## C1. CSRF — gốc rễ nằm ở việc cookie TỰ ĐỘNG gửi kèm

📖 **Nguyên văn** — OWASP CSRF Prevention Cheat Sheet, *Introduction*
> "A Cross-Site Request Forgery (CSRF) attack occurs when a malicious web site, email, blog, instant message, or program tricks an authenticated user's web browser into performing an unwanted action on a trusted site. If a target user is authenticated to the site, unprotected target sites cannot distinguish between legitimate authorized requests and forged authenticated requests."
>
> "Since browser requests automatically include all cookies including session cookies, this attack works unless proper authorization is used, which means that the target site's challenge-response mechanism does not verify the identity and authority of the requester. In effect, CSRF attacks make a target system perform attacker-specified functions via the victim's browser without the victim's knowledge (normally until after the unauthorized actions have been committed)."

🇻🇳 **Dịch**
> "Tấn công Cross-Site Request Forgery (CSRF) xảy ra khi một website, email, blog, tin nhắn hoặc chương trình độc hại lừa browser của một user đã authenticate thực hiện một hành động ngoài ý muốn trên một site đáng tin. Nếu user mục tiêu đang authenticate với site đó, thì site mục tiêu không được bảo vệ **không thể phân biệt** đâu là request hợp lệ được uỷ quyền và đâu là request đã authenticate nhưng bị giả mạo."
>
> "**Vì request của browser tự động kèm theo TẤT CẢ cookie, bao gồm cả session cookie**, tấn công này thành công trừ khi có authorization đúng đắn — nghĩa là cơ chế challenge-response của site mục tiêu không xác minh danh tính và quyền hạn của bên gửi request. Trên thực tế, tấn công CSRF khiến hệ thống mục tiêu thực thi các chức năng do kẻ tấn công chỉ định thông qua browser của nạn nhân mà nạn nhân không hề hay biết (thường là tới khi hành động trái phép đã xảy ra rồi)."

> [!danger] Cookie là "ambient authority" — đây là đúng vấn đề RFC 6265 §8.2 đã cảnh báo
> Browser đính session cookie vào **mọi** request tới domain đó, **không quan tâm request được khởi phát từ trang nào**. Một thẻ `<img src="https://bank.example/transfer?to=attacker&amount=1000">` nằm trên site của kẻ tấn công vẫn khiến browser gửi cookie đăng nhập của bạn đi kèm. Server nhìn vào chỉ thấy "một request hợp lệ có session cookie hợp lệ".
> Đối chiếu RFC 6265 §8.2 đã trích ở [A5](#a5-security-considerations-của-rfc-6265--nguyên-văn): *"Cookies encourage server operators to separate designation (in the form of URLs) from authorization (in the form of cookies)."*

### Các biện pháp phòng thủ — nguyên văn OWASP

📖 **Nguyên văn** — OWASP CSRF Prevention Cheat Sheet, *Introduction* (danh sách nguyên tắc)
> "In short, the following principles should be followed to defend against CSRF:"
>
> "IMPORTANT: Remember that Cross-Site Scripting (XSS) can defeat all CSRF mitigation techniques! While Cross-Site Scripting (XSS) vulnerabilities can bypass CSRF protections, CSRF tokens are still essential for web applications that rely on cookies for authentication."
>
> "- First, check if your framework has built-in CSRF protection and use it"
>
> "- If the framework does not have built-in CSRF protection, add CSRF tokens to all state-changing requests (requests that cause actions on the site) and validate them on the backend."
>
> "- Stateful software should use the synchronizer token pattern"
>
> "- Stateless software should use double submit cookies"
>
> "- If an API-driven site can't use <form> tags, consider using custom request headers"
>
> "- Implement at least one mitigation from Defense in Depth Mitigations section"
>
> "- SameSite Cookie Attribute can be used for session cookies but be careful to NOT set a cookie specifically for a domain. This action introduces a security vulnerability because all subdomains of that domain will share the cookie"
>
> "- Do not use GET requests for state changing operations."

🇻🇳 **Dịch**
> "Tóm lại, nên tuân thủ các nguyên tắc sau để phòng thủ CSRF:"
>
> "QUAN TRỌNG: Nhớ rằng **Cross-Site Scripting (XSS) có thể vô hiệu hoá MỌI kỹ thuật giảm thiểu CSRF!** Dù lỗ hổng XSS có thể vượt qua các lớp bảo vệ CSRF, CSRF token vẫn là thiết yếu với web application dựa vào cookie để authentication."
>
> "- Trước hết, kiểm tra xem framework của bạn có sẵn cơ chế bảo vệ CSRF không và dùng nó"
>
> "- Nếu framework không có sẵn, hãy thêm CSRF token vào **mọi** request làm thay đổi trạng thái (request gây ra hành động trên site) và validate chúng ở backend."
>
> "- Phần mềm **stateful** nên dùng *synchronizer token pattern*"
>
> "- Phần mềm **stateless** nên dùng *double submit cookies*"
>
> "- Nếu một site hướng API không thể dùng thẻ `<form>`, hãy cân nhắc dùng custom request header"
>
> "- Hiện thực ít nhất một biện pháp giảm thiểu từ mục Defense in Depth Mitigations"
>
> "- Attribute cookie `SameSite` có thể dùng cho session cookie, nhưng phải cẩn thận **KHÔNG** set cookie riêng cho cả một domain. Làm vậy tạo ra lỗ hổng bảo mật vì mọi subdomain của domain đó sẽ chia sẻ cookie"
>
> "- Không dùng request GET cho các thao tác thay đổi trạng thái."

📖 **Nguyên văn** — OWASP CSRF Prevention Cheat Sheet, *Synchronizer Token Pattern*
> "CSRF tokens should be generated on the server-side and they should be generated only once per user session or each request. Because the time range for an attacker to exploit the stolen tokens is minimal for per-request tokens, they are more secure than per-session tokens."
>
> "When a client issues a request, the server-side component must verify the existence and validity of the token in that request and compare it to the token found in the user session. The request should be rejected if that token was not found within the request or the value provided does not match the value within the user session."
>
> "CSRF tokens should be:"
>
> "- Unique per user session."
>
> "- Secret"
>
> "- Unpredictable (large random value generated by a secure method)."
>
> "CSRF tokens prevent CSRF because without a CSRF token, an attacker cannot create valid requests to the backend server."

🇻🇳 **Dịch**
> "CSRF token nên được sinh ở phía server, và chỉ sinh một lần mỗi session của user hoặc mỗi request. Vì khoảng thời gian để kẻ tấn công khai thác token đánh cắp được là tối thiểu với token theo từng request, loại này an toàn hơn token theo session."
>
> "Khi client phát ra một request, thành phần phía server **phải** xác minh sự tồn tại và tính hợp lệ của token trong request đó rồi so sánh với token lưu trong session của user. Request **phải bị từ chối** nếu không tìm thấy token trong request hoặc giá trị cung cấp không khớp giá trị trong session."
>
> "CSRF token nên:"
>
> "- Duy nhất theo từng session của user."
>
> "- Bí mật."
>
> "- Không đoán trước được (giá trị ngẫu nhiên lớn, sinh bằng phương pháp an toàn)."
>
> "CSRF token ngăn được CSRF vì nếu không có CSRF token, kẻ tấn công không thể tạo ra request hợp lệ gửi tới backend server."

📖 **Nguyên văn** — OWASP CSRF Prevention Cheat Sheet, *SameSite (Cookie Attribute)* — mục **Defense In Depth Techniques**
> "SameSite is a cookie attribute (similar to HTTPOnly, Secure etc.) which aims to mitigate CSRF attacks. It is defined in RFC6265bis. This attribute helps the browser decide whether to send cookies along with cross-site requests. Possible values for this attribute are Lax, Strict, or None."
>
> "The Strict value will prevent the cookie from being sent by the browser to the target site in all cross-site browsing context, even when following a regular link."
>
> "All modern desktop and mobile browsers support the SameSite attribute. […] Chrome implemented SameSite=Lax as the default behavior in 2020, and Firefox and Edge have followed suit. Additionally, the Secure flag is required for cookies that are marked as SameSite=None."

🇻🇳 **Dịch**
> "`SameSite` là một attribute của cookie (tương tự `HTTPOnly`, `Secure`…) nhằm giảm thiểu tấn công CSRF. **Nó được định nghĩa trong RFC6265bis.** Attribute này giúp browser quyết định có gửi cookie kèm các request cross-site hay không. Các giá trị khả dĩ là `Lax`, `Strict`, hoặc `None`."
>
> "Giá trị `Strict` sẽ ngăn browser gửi cookie tới site mục tiêu trong **mọi** ngữ cảnh duyệt cross-site, kể cả khi người dùng bấm theo một link thông thường."
>
> "Mọi browser hiện đại trên desktop lẫn mobile đều hỗ trợ attribute `SameSite`. […] Chrome đã áp dụng `SameSite=Lax` làm hành vi mặc định từ năm 2020, Firefox và Edge sau đó cũng làm theo. Ngoài ra, **flag `Secure` là bắt buộc** với cookie được đánh dấu `SameSite=None`."

> [!danger] SameSite KHÔNG thay thế được CSRF token
> OWASP liệt kê `SameSite` trong mục **"Defense In Depth Techniques"** — tức lớp phòng thủ bổ sung, không phải lớp chính.

📖 **Nguyên văn** — OWASP CSRF Prevention Cheat Sheet, *Limitations of SameSite*
> "SameSite is useful as a defense-in-depth control but it does not replace a proper CSRF defense in most deployments. Treat the following as known gaps when reasoning about how much protection it actually provides:"
>
> "- Lax only blocks unsafe methods. The default Lax behavior still allows the cookie on top-level navigations that use safe methods (GET, HEAD, OPTIONS, TRACE). If any state-changing operation in the application is reachable via a GET request, SameSite=Lax will not stop it. This is the single most common way SameSite-based defenses fail in practice."
>
> "- SameSite is scoped to the registrable domain, not the origin. A cookie set on app.example.com with any SameSite value is still considered "same-site" when the request originates from anything.example.com."
>
> "- Browser coverage is not universal. While current mainstream browsers enforce SameSite=Lax by default, users on older browsers, embedded browsers, or non-mainstream clients may receive cookies that behave as if no SameSite value were set."
>
> "- Client-side CSRF is unaffected."

🇻🇳 **Dịch**
> "`SameSite` hữu ích như một biện pháp kiểm soát phòng thủ theo chiều sâu, nhưng **nó không thay thế một lớp phòng thủ CSRF đúng nghĩa** trong hầu hết các triển khai. Hãy coi những điểm sau là các lỗ hổng đã biết khi đánh giá mức bảo vệ thực tế nó mang lại:"
>
> "- **`Lax` chỉ chặn các method không an toàn.** Hành vi `Lax` mặc định vẫn cho phép cookie đi kèm top-level navigation dùng các method an toàn (GET, HEAD, OPTIONS, TRACE). Nếu có bất kỳ thao tác thay đổi trạng thái nào trong ứng dụng tiếp cận được qua request GET, `SameSite=Lax` **sẽ không chặn được**. Đây là cách phổ biến nhất khiến phòng thủ dựa trên `SameSite` thất bại trong thực tế."
>
> "- **`SameSite` có phạm vi theo registrable domain, không phải theo origin.** Một cookie set trên `app.example.com` với bất kỳ giá trị `SameSite` nào vẫn bị coi là "same-site" khi request xuất phát từ `anything.example.com`."
>
> "- **Độ phủ browser không phải toàn bộ.** Dù các browser chính hiện nay enforce `SameSite=Lax` mặc định, user dùng browser cũ, browser nhúng, hay client không phổ thông có thể nhận cookie hành xử như thể không có giá trị `SameSite` nào."
>
> "- **CSRF phía client không bị ảnh hưởng.**"

## C2. XSS đánh cắp cookie — vì sao `HttpOnly` quan trọng

📖 **Nguyên văn** — OWASP Session Management Cheat Sheet, *HttpOnly Attribute*
> "The HttpOnly cookie attribute instructs web browsers not to allow scripts (e.g. JavaScript or VBscript) an ability to access the cookies via the DOM document.cookie object. This session ID protection is mandatory to prevent session ID stealing through XSS attacks. However, if an XSS attack is combined with a CSRF attack, the requests sent to the web application will include the session cookie, as the browser always includes the cookies when sending requests. The HttpOnly cookie only protects the confidentiality of the cookie; the attacker cannot use it offline, outside of the context of an XSS attack."

🇻🇳 **Dịch**
> "Attribute cookie `HttpOnly` chỉ thị cho browser **không cho phép script** (ví dụ JavaScript hay VBScript) truy cập cookie qua đối tượng DOM `document.cookie`. Lớp bảo vệ session ID này là **bắt buộc** để ngăn session ID bị đánh cắp qua tấn công XSS. Tuy nhiên, nếu tấn công XSS được kết hợp với tấn công CSRF, các request gửi tới web application **vẫn sẽ kèm session cookie**, vì browser luôn đính cookie khi gửi request. Cookie `HttpOnly` **chỉ bảo vệ tính bí mật** của cookie; kẻ tấn công không thể dùng nó offline, ngoài ngữ cảnh của cuộc tấn công XSS."

> [!warning] Đọc kỹ vế sau của đoạn trên
> `HttpOnly` ngăn kẻ tấn công **mang cookie đi nơi khác dùng**. Nó **không** ngăn kẻ tấn công dùng chính browser nạn nhân để phát request thay mặt nạn nhân. Đó là lý do OWASP CSRF cheat sheet viết in hoa: *"Remember that Cross-Site Scripting (XSS) can defeat all CSRF mitigation techniques!"*

## C3. Session (stateful) mâu thuẫn với ràng buộc stateless của REST

Đây là điểm nối lý thuyết quan trọng nhất của bài. Ở [[02 - REST]] ta đã học ràng buộc **stateless**: mỗi request từ client tới server phải chứa **toàn bộ** thông tin cần thiết để hiểu request, và server **không được** lợi dụng ngữ cảnh lưu sẵn. Session-based authentication làm đúng điều ngược lại: server giữ session store, client chỉ cầm một con số trỏ vào đó.

Fielding — người định nghĩa REST — dành hẳn một mục trong luận án để nói cookie **vi phạm** REST:

📖 **Nguyên văn** — Fielding, *Architectural Styles and the Design of Network-based Software Architectures*, §6.3.4.2 Cookies
> "An example of where an inappropriate extension has been made to the protocol to support features that contradict the desired properties of the generic interface is the introduction of site-wide state information in the form of HTTP cookies [73]. Cookie interaction fails to match REST's model of application state, often resulting in confusion for the typical browser application."

🇻🇳 **Dịch**
> "Một ví dụ về việc mở rộng protocol một cách không thích đáng để hỗ trợ những tính năng đi ngược lại các thuộc tính mong muốn của generic interface là việc đưa vào thông tin trạng thái áp dụng trên toàn site dưới dạng HTTP cookie [73]. **Tương tác cookie không khớp với mô hình application state của REST**, và thường gây ra nhầm lẫn cho ứng dụng browser thông thường."

📖 **Nguyên văn** — Fielding, §6.3.4.2 Cookies (vấn đề nằm ở đâu)
> "An HTTP cookie is opaque data that can be assigned by the origin server to a user agent by including it within a Set-Cookie response header field, with the intention being that the user agent should include the same cookie on all future requests to that server until it is replaced or expires. Such cookies typically contain an array of user-specific configuration choices, or a token to be matched against the server's database on future requests. The problem is that a cookie is defined as being attached to any future requests for a given set of resource identifiers, usually encompassing an entire site, rather than being associated with the particular application state (the set of currently rendered representations) on the browser. When the browser's history functionality (the "Back" button) is subsequently used to back-up to a view prior to that reflected by the cookie, the browser's application state no longer matches the stored state represented within the cookie. Therefore, the next request sent to the same server will contain a cookie that misrepresents the current application context, leading to confusion on both sides."

🇻🇳 **Dịch**
> "Một HTTP cookie là dữ liệu *opaque* (mờ đục, không có ngữ nghĩa lộ ra) mà origin server có thể gán cho user agent bằng cách đưa nó vào header field response `Set-Cookie`, với chủ ý là user agent sẽ đính đúng cookie đó vào mọi request tương lai tới server ấy cho đến khi nó bị thay hoặc hết hạn. Cookie kiểu vậy thường chứa một mảng các lựa chọn cấu hình riêng của user, **hoặc một token để đối chiếu với database của server ở các request sau** (← chính là session ID). **Vấn đề nằm ở chỗ cookie được định nghĩa là gắn vào BẤT KỲ request tương lai nào tới một tập resource identifier cho trước — thường bao trùm cả một site — thay vì gắn với application state cụ thể (tập các representation đang được render) trên browser.** Khi tính năng lịch sử của browser (nút "Back") được dùng để lùi về một view có trước trạng thái mà cookie phản ánh, application state của browser không còn khớp với trạng thái đã lưu trong cookie. Do đó, request kế tiếp gửi tới cùng server sẽ mang một cookie **mô tả sai ngữ cảnh ứng dụng hiện tại**, dẫn tới nhầm lẫn ở cả hai phía."

📖 **Nguyên văn** — Fielding, §6.3.4.2 Cookies (kết luận)
> "As a result, cookie-based applications on the Web will never be reliable. The same functionality should have been accomplished via anonymous authentication and true client-side state. A state mechanism that involves preferences can be more efficiently implemented using judicious use of context-setting URI rather than cookies, where judicious means one URI per state rather than an unbounded number of URI due to the embedding of a user-id."

🇻🇳 **Dịch**
> "Kết quả là, **các ứng dụng dựa trên cookie trên Web sẽ không bao giờ đáng tin cậy**. Cùng chức năng ấy lẽ ra nên được đạt tới bằng anonymous authentication và client-side state thực thụ. Một cơ chế trạng thái liên quan tới tuỳ chọn (preferences) có thể được hiện thực hiệu quả hơn bằng cách dùng URI thiết lập ngữ cảnh một cách khôn ngoan thay vì dùng cookie — "khôn ngoan" ở đây nghĩa là **một URI cho mỗi trạng thái**, thay vì một số lượng URI không giới hạn do nhúng user-id vào."

> [!note] Đọc Fielding thế nào cho đúng
> Fielding **không** nói "đừng bao giờ dùng session". Ông nói: cookie là một extension đi ngược lại thuộc tính mong muốn của generic interface, và session-based auth khiến API **không còn stateless theo nghĩa REST**. Trong thực tế, phần lớn web app truyền thống vẫn chọn session vì đánh đổi được: server kiểm soát tuyệt đối việc thu hồi (revoke) — thứ mà token tự chứa rất khó làm. Đây là **đánh đổi có ý thức**, không phải sự ngu dốt. Điều bài này yêu cầu là: bạn biết mình đang đánh đổi cái gì.
>
> Ghi chú riêng, không trích spec: nhiều hệ thống gọi mình là "RESTful API" nhưng dùng session cookie — về mặt thuật ngữ chặt chẽ thì chúng vi phạm ràng buộc stateless của REST. Xem [[02 - REST]] và [[09 - So sánh API Styles và REST Security]].

## C4. Bảng so sánh session-based vs token-based

> Bảng này chỉ **nêu** để định vị. Chi tiết token, JWT, signature, revoke… học ở [[13 - Token Authentication và Bearer Token]].

| Tiêu chí | Session-based (cookie + session store) | Token-based (token tự chứa) |
|---|---|---|
| Nơi lưu sự thật | Server (session store/DB) | Bên trong chính token |
| Client cầm gì | Một định danh **vô nghĩa** (OWASP: *"must be meaningless"*) | Dữ liệu có cấu trúc, đọc được |
| Ràng buộc stateless của REST | **Vi phạm** (Fielding §6.3.4.2) | Sát hơn với stateless |
| Thu hồi (revoke) ngay lập tức | Dễ — xoá bản ghi session phía server | Khó — cần cơ chế bổ sung |
| Rủi ro CSRF | **Cao** nếu truyền qua cookie (cookie tự động gửi kèm) | Thấp hơn nếu truyền qua header tự đặt (chịu same-origin policy) |
| Rủi ro XSS | Giảm nhẹ được bằng `HttpOnly` | Phụ thuộc nơi lưu token phía client |
| Mở rộng đa server | Cần shared session store / sticky session | Không cần tra store để verify |

> [!warning] Đừng đọc bảng này như "token tốt hơn session"
> Hai cột là hai bộ đánh đổi khác nhau. Cột revoke là nơi session thắng rõ rệt; cột stateless là nơi token thắng. OWASP CSRF cheat sheet cũng phân nhánh đúng theo trục này: *"Stateful software should use the synchronizer token pattern. Stateless software should use double submit cookies."*

---

## ✅ Checklist rút ra (tất cả đều trích dẫn được ở trên)

- [ ] Session ID ≥ **64 bit entropy**, sinh bằng **CSPRNG** — OWASP §Session ID Entropy
- [ ] Nếu encode hex: **≥ 16 ký tự hex** — OWASP §Session ID Length
- [ ] Giá trị session ID **vô nghĩa**, không chứa PII — OWASP §Session ID Content
- [ ] Cookie mang `Secure` + `HttpOnly` — RFC 6265 §4.1.2.5, §4.1.2.6; OWASP §Cookies
- [ ] Set tường minh `SameSite=Strict` (ưu tiên) hoặc `Lax` — OWASP §SameSite Attribute
- [ ] Dùng prefix `__Host-` cho session ID — OWASP §Cookie Name Prefixes
- [ ] **Regenerate session ID ngay sau khi đăng nhập** và sau mọi thay đổi privilege — OWASP §Renew the Session ID…
- [ ] Có **idle timeout** và **absolute timeout**, enforce **phía server** — OWASP §Idle/Absolute Timeout
- [ ] Logout **huỷ session phía server**, không chỉ xoá cookie — OWASP §Session Expiration, §Logout Button
- [ ] `Cache-Control: no-store` cho response chứa session ID — OWASP §Web Content Caching
- [ ] CSRF token cho **mọi** request đổi trạng thái; GET không được đổi trạng thái — OWASP CSRF §Introduction
- [ ] Không coi `SameSite` là lớp phòng thủ CSRF duy nhất — OWASP CSRF §Limitations of SameSite

---

## Liên kết
- Bài trước: [[11 - Basic Authentication]]
- Bài kế: [[13 - Token Authentication và Bearer Token]]
- [[02 - REST]] — ràng buộc **stateless**; đây là ràng buộc mà session-based auth vi phạm (Fielding §6.3.4.2)
- [[01 - API là gì và nền tảng HTTP]] — HTTP request/response, header
- [[02 - What is HTTP]] — vì sao HTTP không nhớ gì giữa hai request
- [[04 - HTTP Status Code và thiết kế lỗi]] — `401` vs `403`; RFC 6265 yêu cầu xử lý `Set-Cookie` cả trong response 4xx/5xx
- [[09 - So sánh API Styles và REST Security]] — bức tranh bảo mật API tổng thể
- [[13 - SQL Injection và Parameterized Query]] — session ID là user input, phải validate như mọi input khác
- [[08 - OpenAPI Specification]] — Security Scheme Object mô tả cơ chế auth của API

## Nguồn tham khảo
- RFC 6265 — *HTTP State Management Mechanism* (Proposed Standard, April 2011) : https://www.rfc-editor.org/rfc/rfc6265.txt
- draft-ietf-httpbis-rfc6265bis-22 — *Cookies: HTTP State Management Mechanism* (Internet-Draft, 1 December 2025, `Obsoletes: 6265 (if approved)`, trạng thái IESG: RFC Ed Queue) : https://www.ietf.org/archive/id/draft-ietf-httpbis-rfc6265bis-22.txt
- Trang theo dõi trạng thái draft trên IETF Datatracker : https://datatracker.ietf.org/doc/draft-ietf-httpbis-rfc6265bis/
- OWASP — *Session Management Cheat Sheet* : https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP — *Cross-Site Request Forgery Prevention Cheat Sheet* : https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Roy T. Fielding — *Architectural Styles and the Design of Network-based Software Architectures*, §6.3.4.2 Cookies : https://www.ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm
