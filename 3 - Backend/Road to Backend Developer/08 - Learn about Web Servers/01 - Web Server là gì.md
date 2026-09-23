# 01 — Web Server là gì

> **Nguồn chính:** RFC 9110 — *HTTP Semantics* (STD 97, June 2022) — https://www.rfc-editor.org/rfc/rfc9110.txt
> Bài này bám các mục §3.3 (Connections, Clients, and Servers), §3.5 (User Agents), §3.6 (Origin Server), §3.7 (Intermediaries), §3.9 (Example Message Exchange), §7.2 (Host and :authority), §7.4 (Rejecting Misdirected Requests), §7.6.3 (Via) và §10.2.4 (Server) của RFC 9110.

Nền tảng HTTP (request/response, method, header) đã học ở [[02 - What is HTTP]] và [[01 - API là gì và nền tảng HTTP]] — bài này không lặp lại, chỉ tập trung vào **định nghĩa chuẩn của "server"** và các vai trò mà một web server có thể đóng.

---

## 1. Client và server là VAI TRÒ, không phải loại máy (§3.3)

📖 **Nguyên văn** (RFC 9110 §3.3 "Connections, Clients, and Servers")
> "HTTP is a client/server protocol that operates over a reliable transport- or session-layer "connection".
>
>    An HTTP "client" is a program that establishes a connection to a server for the purpose of sending one or more HTTP requests.  An HTTP "server" is a program that accepts connections in order to service HTTP requests by sending HTTP responses."

🇻🇳 **Dịch**
> "HTTP là một protocol client/server hoạt động trên một "connection" ở tầng transport hoặc session đáng tin cậy.
>
> Một HTTP "client" là một chương trình thiết lập connection tới một server nhằm mục đích gửi một hoặc nhiều HTTP request. Một HTTP "server" là một chương trình chấp nhận các connection để phục vụ các HTTP request bằng cách gửi HTTP response."

📖 **Nguyên văn** (RFC 9110 §3.3)
> "The terms client and server refer only to the roles that these programs perform for a particular connection.  The same program might act as a client on some connections and a server on others."

🇻🇳 **Dịch**
> "Các thuật ngữ client và server chỉ nói tới **vai trò** mà những chương trình này đảm nhiệm cho một connection cụ thể. Cùng một chương trình có thể đóng vai client trên một số connection và đóng vai server trên các connection khác."

> [!note] Đây là câu quan trọng nhất của cả bài
> Spec không định nghĩa server theo "máy chủ", "phần cứng" hay "sản phẩm". Server = **chương trình đang chấp nhận connection để trả lời request trên connection đó**. Cùng một tiến trình Nginx vừa là server (với browser) vừa là client (với backend phía sau) — đúng chuẩn, không phải lạm dụng thuật ngữ.

📖 **Nguyên văn** (RFC 9110 §3.3)
> "HTTP is defined as a stateless protocol, meaning that each request message's semantics can be understood in isolation, and that the relationship between connections and messages on them has no impact on the interpretation of those messages. ... Many implementations depend on HTTP's stateless design in order to reuse proxied connections or dynamically load balance requests across multiple servers."

🇻🇳 **Dịch**
> "HTTP được định nghĩa là một protocol stateless, nghĩa là ngữ nghĩa của mỗi request message có thể hiểu được một cách độc lập, và mối quan hệ giữa các connection với các message trên đó không ảnh hưởng tới việc giải nghĩa những message ấy. ... Nhiều cài đặt phụ thuộc vào thiết kế stateless của HTTP để tái sử dụng các proxied connection hoặc để load balance động các request trên nhiều server."

📖 **Nguyên văn** (RFC 9110 §3.3)
> "As a result, a server MUST NOT assume that two requests on the same connection are from the same user agent unless the connection is secured and specific to that agent.  Some non-standard HTTP extensions (e.g., [RFC4559]) have been known to violate this requirement, resulting in security and interoperability problems."

🇻🇳 **Dịch**
> "Do đó, một server KHÔNG ĐƯỢC giả định rằng hai request trên cùng một connection là đến từ cùng một user agent, trừ khi connection đó được bảo mật và dành riêng cho agent ấy. Một số extension HTTP không chuẩn (ví dụ [RFC4559]) đã được biết là vi phạm yêu cầu này, dẫn tới các vấn đề về bảo mật và tương thích."

> [!warning] Hệ quả: không được xác thực theo connection
> Spec nói thẳng: hai request trên cùng một TCP connection **không được coi là cùng một người**. Đây chính là lý do danh tính phải nằm trong từng request (cookie, bearer token) chứ không nằm ở connection — xem [[12 - Cookie và Session based Authentication]] và [[13 - Token Authentication và Bearer Token]].

💡 **Ví dụ đời sống — client/server là vai trò**
Một quầy tiếp nhận ở bệnh viện.
- Với **bệnh nhân**, nhân viên quầy là "người phục vụ": nhận yêu cầu, trả kết quả. Đó là vai **server**.
- Nhưng để có kết quả, chính nhân viên đó **gọi điện xuống phòng xét nghiệm** và trở thành "người đi yêu cầu". Với phòng xét nghiệm, họ là vai **client**.
- Vẫn là một con người, một cái bàn. "Client" hay "server" phụ thuộc vào **đang nói tới cuộc trao đổi nào**, chứ không phải chức danh cố định.

---

## 2. Origin server — ai là bên "có thẩm quyền" (§3.6)

📖 **Nguyên văn** (RFC 9110 §3.6 "Origin Server")
> "The term "origin server" refers to a program that can originate authoritative responses for a given target resource."

🇻🇳 **Dịch**
> "Thuật ngữ "origin server" chỉ một chương trình có thể sinh ra các response **có thẩm quyền** (authoritative) cho một target resource cho trước."

📖 **Nguyên văn** (RFC 9110 §3.6)
> "The most familiar form of origin server are large public websites.  However, like user agents being equated with browsers, it is easy to be misled into thinking that all origin servers are alike.  Common origin servers also include home automation units, configurable networking components, office machines, autonomous robots, news feeds, traffic cameras, real-time ad selectors, and video-on-demand platforms."

🇻🇳 **Dịch**
> "Dạng origin server quen thuộc nhất là các website công khai lớn. Tuy nhiên, giống như việc đồng nhất user agent với browser, người ta rất dễ bị dẫn tới ý nghĩ rằng mọi origin server đều giống nhau. Các origin server thông dụng còn bao gồm bộ điều khiển nhà thông minh, thiết bị mạng có thể cấu hình, máy văn phòng, robot tự hành, news feed, camera giao thông, bộ chọn quảng cáo thời gian thực, và các nền tảng video-on-demand."

📖 **Nguyên văn** (RFC 9110 §3.6 — sơ đồ trường hợp đơn giản nhất, giữ nguyên căn cột)
> "Most HTTP communication consists of a retrieval request (GET) for a representation of some resource identified by a URI.  In the simplest case, this might be accomplished via a single bidirectional connection (===) between the user agent (UA) and the origin server (O).
>
> ```
>             request   >
>        UA ======================================= O
>                                    <   response
>
>                                   Figure 1
> ```
> "

🇻🇳 **Dịch**
> "Phần lớn giao tiếp HTTP gồm một request lấy dữ liệu (GET) cho một representation của resource nào đó được xác định bởi một URI. Trong trường hợp đơn giản nhất, việc này có thể hoàn thành qua một connection song hướng duy nhất (===) giữa user agent (UA) và origin server (O)."

📖 **Nguyên văn** (RFC 9110 §3.5 "User Agents")
> "The term "user agent" refers to any of the various client programs that initiate a request.
>
>    The most familiar form of user agent is the general-purpose Web browser, but that's only a small percentage of implementations.  Other common user agents include spiders (web-traversing robots), command-line tools, billboard screens, household appliances, scales, light bulbs, firmware update scripts, mobile apps, and communication devices in a multitude of shapes and sizes."

🇻🇳 **Dịch**
> "Thuật ngữ "user agent" chỉ bất kỳ chương trình client nào trong số các chương trình khởi tạo một request.
>
> Dạng user agent quen thuộc nhất là Web browser đa dụng, nhưng đó chỉ là một tỉ lệ nhỏ trong các cài đặt. Các user agent thông dụng khác gồm spider (robot duyệt web), công cụ command-line, màn hình biển quảng cáo, thiết bị gia dụng, cân, bóng đèn, script cập nhật firmware, mobile app, và các thiết bị truyền thông với vô số hình dạng kích cỡ."

> [!note] Hai cặp thuật ngữ cần tách rõ
> - **user agent / origin server** — nói về *hai đầu* của chuỗi: bên khởi tạo request và bên có thẩm quyền trả lời.
> - **client / server** — nói về *một connection đơn lẻ* trong chuỗi đó.
>
> Vì vậy một reverse proxy là **server** (với browser) nhưng **không phải origin server** (nó không có thẩm quyền về resource). Phân biệt này là gốc của bài [[02 - Reverse Proxy, Gateway và Load Balancing]].

---

## 3. Ba loại intermediary: proxy, gateway, tunnel (§3.7)

📖 **Nguyên văn** (RFC 9110 §3.7 "Intermediaries")
> "HTTP enables the use of intermediaries to satisfy requests through a chain of connections.  There are three common forms of HTTP "intermediary": proxy, gateway, and tunnel.  In some cases, a single intermediary might act as an origin server, proxy, gateway, or tunnel, switching behavior based on the nature of each request.
>
> ```
>             >             >             >             >
>        UA =========== A =========== B =========== C =========== O
>                   <             <             <             <
>
>                                   Figure 2
> ```
> "

🇻🇳 **Dịch**
> "HTTP cho phép dùng các intermediary (bên trung gian) để đáp ứng request thông qua một chuỗi connection. Có ba dạng "intermediary" HTTP thông dụng: **proxy**, **gateway**, và **tunnel**. Trong một số trường hợp, một intermediary duy nhất có thể đóng vai origin server, proxy, gateway, hay tunnel — chuyển đổi hành vi tuỳ theo bản chất của từng request."

📖 **Nguyên văn** (RFC 9110 §3.7)
> "The figure above shows three intermediaries (A, B, and C) between the user agent and origin server.  A request or response message that travels the whole chain will pass through four separate connections.  Some HTTP communication options might apply only to the connection with the nearest, non-tunnel neighbor, only to the endpoints of the chain, or to all connections along the chain."

🇻🇳 **Dịch**
> "Hình trên cho thấy ba intermediary (A, B và C) giữa user agent và origin server. Một request hay response message đi hết chuỗi sẽ đi qua **bốn connection riêng biệt**. Một số tuỳ chọn giao tiếp HTTP có thể chỉ áp dụng cho connection với bên kề cận không-phải-tunnel, chỉ cho hai đầu của chuỗi, hoặc cho toàn bộ các connection dọc chuỗi."

### 3.1. Bốn từ chỉ hướng: upstream, downstream, inbound, outbound

📖 **Nguyên văn** (RFC 9110 §3.7)
> "The terms "upstream" and "downstream" are used to describe directional requirements in relation to the message flow: all messages flow from upstream to downstream.  The terms "inbound" and "outbound" are used to describe directional requirements in relation to the request route: inbound means "toward the origin server", whereas outbound means "toward the user agent"."

🇻🇳 **Dịch**
> "Các thuật ngữ "upstream" và "downstream" dùng để mô tả yêu cầu về hướng **theo dòng chảy của message**: mọi message chảy từ upstream sang downstream. Các thuật ngữ "inbound" và "outbound" mô tả yêu cầu về hướng **theo lộ trình của request**: inbound nghĩa là "về phía origin server", còn outbound nghĩa là "về phía user agent"."

> [!tip] Vì sao phải nhớ 4 từ này
> `upstream` trong file cấu hình Nginx (`upstream backend { ... }`) chính là từ này: khối đó khai báo **các server ở phía trên dòng chảy** mà Nginx sẽ chuyển request tới. Đọc config mà không nắm 4 từ này thì rất dễ nhầm hướng.

### 3.2. Proxy

📖 **Nguyên văn** (RFC 9110 §3.7)
> "A "proxy" is a message-forwarding agent that is chosen by the client, usually via local configuration rules, to receive requests for some type(s) of absolute URI and attempt to satisfy those requests via translation through the HTTP interface.  Some translations are minimal, such as for proxy requests for "http" URIs, whereas other requests might require translation to and from entirely different application-level protocols.  Proxies are often used to group an organization's HTTP requests through a common intermediary for the sake of security services, annotation services, or shared caching."

🇻🇳 **Dịch**
> "Một "proxy" là một agent chuyển tiếp message **do client chọn**, thường qua các quy tắc cấu hình cục bộ, để nhận request cho một số loại absolute URI và cố gắng đáp ứng những request đó bằng cách dịch chuyển qua giao diện HTTP. Một số phép dịch là tối thiểu, chẳng hạn với proxy request cho URI "http"; trong khi các request khác có thể cần dịch qua lại với những protocol tầng ứng dụng hoàn toàn khác. Proxy thường được dùng để gom các HTTP request của một tổ chức qua một intermediary chung, nhằm phục vụ các dịch vụ bảo mật, dịch vụ chú giải (annotation), hoặc shared caching."

### 3.3. Gateway (còn gọi là reverse proxy)

📖 **Nguyên văn** (RFC 9110 §3.7)
> "A "gateway" (a.k.a. "reverse proxy") is an intermediary that acts as an origin server for the outbound connection but translates received requests and forwards them inbound to another server or servers.  Gateways are often used to encapsulate legacy or untrusted information services, to improve server performance through "accelerator" caching, and to enable partitioning or load balancing of HTTP services across multiple machines."

🇻🇳 **Dịch**
> "Một "gateway" (còn gọi là "reverse proxy") là một intermediary **hành xử như origin server đối với connection outbound**, nhưng dịch các request nhận được và chuyển tiếp chúng inbound tới một hoặc nhiều server khác. Gateway thường được dùng để bọc các dịch vụ thông tin cũ (legacy) hoặc không đáng tin, để cải thiện hiệu năng server thông qua caching kiểu "accelerator", và để cho phép phân vùng (partitioning) hoặc load balancing các dịch vụ HTTP trên nhiều máy."

📖 **Nguyên văn** (RFC 9110 §3.7)
> "All HTTP requirements applicable to an origin server also apply to the outbound communication of a gateway.  A gateway communicates with inbound servers using any protocol that it desires, including private extensions to HTTP that are outside the scope of this specification.  However, an HTTP-to-HTTP gateway that wishes to interoperate with third-party HTTP servers needs to conform to user agent requirements on the gateway's inbound connection."

🇻🇳 **Dịch**
> "Mọi yêu cầu HTTP áp dụng cho một origin server cũng áp dụng cho giao tiếp outbound của một gateway. Một gateway giao tiếp với các server inbound bằng bất kỳ protocol nào nó muốn, kể cả các extension riêng của HTTP nằm ngoài phạm vi đặc tả này. Tuy nhiên, một gateway HTTP-sang-HTTP muốn tương tác được với các HTTP server của bên thứ ba thì cần tuân thủ các yêu cầu dành cho **user agent** trên connection inbound của gateway."

> [!note] "proxy" và "reverse proxy" khác nhau ở CHỖ AI CHỌN NÓ
> Spec phân biệt không phải bằng hướng mạng mà bằng quyền chọn:
> - **proxy**: *"chosen by the client"* — client cấu hình để đi qua nó.
> - **gateway / reverse proxy**: client không biết nó tồn tại; với client nó **chính là** origin server.
>
> Và câu cuối đoạn trên rất đáng chú ý: ở chân inbound, gateway phải tuân theo yêu cầu của **user agent** — tức là nó thực sự đổi vai, đúng như §3.3 đã nói.

💡 **Ví dụ đời sống — proxy vs gateway**
- **Proxy** = bạn tự thuê một người **đi chợ hộ**. Bạn biết rõ có người trung gian, chính bạn chọn họ. Mọi đơn hàng của bạn đi qua họ.
- **Gateway / reverse proxy** = bạn gọi tổng đài **19001234** của một chuỗi nhà hàng. Bạn tưởng mình đang nói chuyện với "nhà hàng". Thực tế tổng đài nhận cuộc gọi rồi chuyển về chi nhánh gần nhất còn chỗ. Bạn **không chọn** tổng đài, và cũng không biết chi nhánh nào sẽ nấu.

### 3.4. Tunnel

📖 **Nguyên văn** (RFC 9110 §3.7)
> "A "tunnel" acts as a blind relay between two connections without changing the messages.  Once active, a tunnel is not considered a party to the HTTP communication, though the tunnel might have been initiated by an HTTP request.  A tunnel ceases to exist when both ends of the relayed connection are closed.  Tunnels are used to extend a virtual connection through an intermediary, such as when Transport Layer Security (TLS, [TLS13]) is used to establish confidential communication through a shared firewall proxy."

🇻🇳 **Dịch**
> "Một "tunnel" hành xử như một bộ chuyển tiếp **mù** giữa hai connection mà không thay đổi các message. Khi đã hoạt động, tunnel không được coi là một bên tham gia vào giao tiếp HTTP, dù nó có thể đã được khởi tạo bởi một HTTP request. Một tunnel không còn tồn tại khi cả hai đầu của connection được chuyển tiếp đã đóng. Tunnel được dùng để mở rộng một connection ảo xuyên qua một intermediary, chẳng hạn khi Transport Layer Security (TLS, [TLS13]) được dùng để thiết lập giao tiếp bảo mật xuyên qua một firewall proxy dùng chung."

### 3.5. Intermediary tầng dưới và interception proxy

📖 **Nguyên văn** (RFC 9110 §3.7)
> "The above categories for intermediary only consider those acting as participants in the HTTP communication.  There are also intermediaries that can act on lower layers of the network protocol stack, filtering or redirecting HTTP traffic without the knowledge or permission of message senders.  Network intermediaries are indistinguishable (at a protocol level) from an on-path attacker, often introducing security flaws or interoperability problems due to mistakenly violating HTTP semantics."

🇻🇳 **Dịch**
> "Các phân loại intermediary ở trên chỉ xét những bên **tham gia** vào giao tiếp HTTP. Còn có những intermediary hoạt động ở các tầng thấp hơn của network protocol stack, lọc hoặc chuyển hướng traffic HTTP mà bên gửi message không biết và không cho phép. Các network intermediary này **không thể phân biệt được (ở mức protocol) với một kẻ tấn công nằm trên đường truyền (on-path attacker)**, và thường gây ra lỗ hổng bảo mật hoặc vấn đề tương thích do vi phạm ngữ nghĩa HTTP một cách sai lầm."

📖 **Nguyên văn** (RFC 9110 §3.7)
> "For example, an "interception proxy" [RFC3040] (also commonly known as a "transparent proxy" [RFC1919]) differs from an HTTP proxy because it is not chosen by the client.  Instead, an interception proxy filters or redirects outgoing TCP port 80 packets (and occasionally other common port traffic).  Interception proxies are commonly found on public network access points, as a means of enforcing account subscription prior to allowing use of non-local Internet services, and within corporate firewalls to enforce network usage policies."

🇻🇳 **Dịch**
> "Ví dụ, một "interception proxy" [RFC3040] (cũng thường được gọi là "transparent proxy" [RFC1919]) khác với một HTTP proxy vì **nó không do client chọn**. Thay vào đó, interception proxy lọc hoặc chuyển hướng các packet TCP port 80 đi ra (và đôi khi cả traffic của các port thông dụng khác). Interception proxy thường thấy ở các điểm truy cập mạng công cộng, như một cách bắt buộc đăng ký tài khoản trước khi cho dùng các dịch vụ Internet, và trong firewall doanh nghiệp để cưỡng chế chính sách sử dụng mạng."

---

## 4. Virtual hosting: `Host` header là cơ chế định tuyến tầng ứng dụng (§7.2)

📖 **Nguyên văn** (RFC 9110 §7.2 "Host and :authority")
> "The "Host" header field in a request provides the host and port information from the target URI, enabling the origin server to distinguish among resources while servicing requests for multiple host names.
>
>    In HTTP/2 [HTTP/2] and HTTP/3 [HTTP/3], the Host header field is, in some cases, supplanted by the ":authority" pseudo-header field of a request's control data.
>
>      Host = uri-host [ ":" port ] ; Section 4"

🇻🇳 **Dịch**
> "Header field "Host" trong một request cung cấp thông tin host và port lấy từ target URI, **cho phép origin server phân biệt giữa các resource khi phục vụ request cho nhiều host name**.
>
> Trong HTTP/2 và HTTP/3, header field `Host` trong một số trường hợp được thay thế bởi pseudo-header field `:authority` thuộc phần control data của request.
>
> Cú pháp: `Host = uri-host [ ":" port ]`"

📖 **Nguyên văn** (RFC 9110 §7.2)
> "The target URI's authority information is critical for handling a request.  A user agent MUST generate a Host header field in a request unless it sends that information as an ":authority" pseudo-header field.  A user agent that sends Host SHOULD send it as the first field in the header section of a request.
>
>    For example, a GET request to the origin server for <http://www.example.org/pub/WWW/> would begin with:
>
>    GET /pub/WWW/ HTTP/1.1
>    Host: www.example.org"

🇻🇳 **Dịch**
> "Thông tin authority của target URI là **tối quan trọng** để xử lý một request. Một user agent PHẢI sinh header field `Host` trong request, trừ khi nó gửi thông tin đó dưới dạng pseudo-header field `:authority`. User agent nào gửi `Host` thì NÊN gửi nó làm field đầu tiên trong phần header của request.
>
> Ví dụ, một GET request tới origin server cho `<http://www.example.org/pub/WWW/>` sẽ bắt đầu bằng:
> ```
> GET /pub/WWW/ HTTP/1.1
> Host: www.example.org
> ```
> "

📖 **Nguyên văn** (RFC 9110 §7.2)
> "Since the host and port information acts as an application-level routing mechanism, it is a frequent target for malware seeking to poison a shared cache or redirect a request to an unintended server.  An interception proxy is particularly vulnerable if it relies on the host and port information for redirecting requests to internal servers, or for use as a cache key in a shared cache, without first verifying that the intercepted connection is targeting a valid IP address for that host."

🇻🇳 **Dịch**
> "Vì thông tin host và port hoạt động như một **cơ chế định tuyến ở tầng ứng dụng**, nó là mục tiêu thường xuyên của malware muốn đầu độc một shared cache hoặc chuyển hướng request tới một server không mong muốn. Một interception proxy đặc biệt dễ bị tấn công nếu nó dựa vào thông tin host và port để chuyển hướng request tới các server nội bộ, hoặc để dùng làm cache key trong một shared cache, mà không xác minh trước rằng connection bị chặn đang nhắm tới một địa chỉ IP hợp lệ cho host đó."

> [!note] Đây chính là nền tảng của "virtual host"
> Một tiến trình web server, một địa chỉ IP, một port 443 — nhưng phục vụ được `a.com`, `b.com`, `c.com`. Cơ chế duy nhất giúp nó biết request này thuộc site nào chính là `Host` header. Trong Nginx nó là `server_name`, trong Apache là `<VirtualHost>`, trong Caddy là site address. Bốn sản phẩm ở các bài sau đều đang cài đặt cùng một điều §7.2 này.

### 4.1. Khi `Host` không khớp connection → 421 (§7.4)

📖 **Nguyên văn** (RFC 9110 §7.4 "Rejecting Misdirected Requests")
> "Once a request is received by a server and parsed sufficiently to determine its target URI, the server decides whether to process the request itself, forward the request to another server, redirect the client to a different resource, respond with an error, or drop the connection.  This decision can be influenced by anything about the request or connection context, but is specifically directed at whether the server has been configured to process requests for that target URI and whether the connection context is appropriate for that request."

🇻🇳 **Dịch**
> "Khi một request đã được server nhận và phân tích đủ để xác định target URI của nó, server quyết định xem sẽ **tự xử lý** request, **chuyển tiếp** request tới server khác, **redirect** client sang resource khác, **trả lỗi**, hay **đóng connection**. Quyết định này có thể bị ảnh hưởng bởi bất cứ điều gì về request hay ngữ cảnh connection, nhưng nhắm cụ thể vào việc server có được cấu hình để xử lý request cho target URI đó hay không, và ngữ cảnh connection có phù hợp cho request đó hay không."

📖 **Nguyên văn** (RFC 9110 §7.4)
> "For example, a request might have been misdirected, deliberately or accidentally, such that the information within a received Host header field differs from the connection's host or port.  If the connection is from a trusted gateway, such inconsistency might be expected; otherwise, it might indicate an attempt to bypass security filters, trick the server into delivering non-public content, or poison a cache."

🇻🇳 **Dịch**
> "Ví dụ, một request có thể đã bị định tuyến sai — cố ý hoặc tình cờ — khiến thông tin trong header field `Host` nhận được khác với host hay port của connection. Nếu connection đến từ một **trusted gateway** thì sự không nhất quán đó có thể là điều dự kiến; ngược lại, nó có thể là dấu hiệu của nỗ lực vượt qua các bộ lọc bảo mật, lừa server phục vụ nội dung không công khai, hoặc đầu độc cache."

📖 **Nguyên văn** (RFC 9110 §7.4)
> "Unless the connection is from a trusted gateway, an origin server MUST reject a request if any scheme-specific requirements for the target URI are not met.  In particular, a request for an "https" resource MUST be rejected unless it has been received over a connection that has been secured via a certificate valid for that target URI's origin, as defined by Section 4.2.2.
>
>    The 421 (Misdirected Request) status code in a response indicates that the origin server has rejected the request because it appears to have been misdirected (Section 15.5.20)."

🇻🇳 **Dịch**
> "Trừ khi connection đến từ một trusted gateway, một origin server PHẢI từ chối request nếu bất kỳ yêu cầu đặc thù theo scheme nào cho target URI không được thoả mãn. Cụ thể, một request cho resource "https" PHẢI bị từ chối trừ khi nó được nhận qua một connection đã được bảo mật bằng một certificate hợp lệ cho origin của target URI đó, theo định nghĩa ở Mục 4.2.2.
>
> Status code 421 (Misdirected Request) trong response cho biết origin server đã từ chối request vì nó có vẻ bị định tuyến sai."

> [!tip] "trusted gateway" giải thích một hành vi hay gây bối rối
> Khi app chạy phía sau reverse proxy, `Host` mà app thấy **được phép** khác với host của connection TCP tới app. Spec cho phép điều này đúng khi connection đến từ gateway đáng tin. Đó là lý do mọi framework đều có khái niệm "trusted proxy" — và cũng là lý do bật nó bừa cho mọi IP là một lỗ hổng. Status code xem thêm [[04 - HTTP Status Code và thiết kế lỗi]].

---

## 5. `Via` — dấu vết các intermediary đã đi qua (§7.6.3)

📖 **Nguyên văn** (RFC 9110 §7.6.3 "Via")
> "The "Via" header field indicates the presence of intermediate protocols and recipients between the user agent and the server (on requests) or between the origin server and the client (on responses), similar to the "Received" header field in email (Section 3.6.7 of [RFC5322]).  Via can be used for tracking message forwards, avoiding request loops, and identifying the protocol capabilities of senders along the request/response chain."

🇻🇳 **Dịch**
> "Header field "Via" cho biết sự hiện diện của các protocol và bên nhận trung gian giữa user agent và server (trên request), hoặc giữa origin server và client (trên response) — tương tự header field "Received" trong email. `Via` có thể dùng để theo dõi việc chuyển tiếp message, **tránh request loop**, và nhận biết năng lực protocol của các bên gửi dọc theo chuỗi request/response."

📖 **Nguyên văn** (RFC 9110 §7.6.3)
> "Each member of the Via field value represents a proxy or gateway that has forwarded the message.  Each intermediary appends its own information about how the message was received, such that the end result is ordered according to the sequence of forwarding recipients.
>
>    A proxy MUST send an appropriate Via header field, as described below, in each message that it forwards.  An HTTP-to-HTTP gateway MUST send an appropriate Via header field in each inbound request message and MAY send a Via header field in forwarded response messages."

🇻🇳 **Dịch**
> "Mỗi thành phần trong giá trị field `Via` đại diện cho một proxy hay gateway đã chuyển tiếp message. Mỗi intermediary **nối thêm** thông tin của chính nó về cách message được nhận, sao cho kết quả cuối cùng được sắp theo trình tự các bên nhận đã chuyển tiếp.
>
> Một proxy PHẢI gửi một header field `Via` thích hợp trong mỗi message mà nó chuyển tiếp. Một gateway HTTP-sang-HTTP PHẢI gửi một header field `Via` thích hợp trong mỗi request message inbound, và CÓ THỂ gửi `Via` trong các response message được chuyển tiếp."

📖 **Nguyên văn** (RFC 9110 §7.6.3 — ví dụ)
> "For example, a request message could be sent from an HTTP/1.0 user agent to an internal proxy code-named "fred", which uses HTTP/1.1 to forward the request to a public proxy at p.example.net, which completes the request by forwarding it to the origin server at www.example.com.  The request received by www.example.com would then have the following Via header field:
>
>    Via: 1.0 fred, 1.1 p.example.net"

🇻🇳 **Dịch**
> "Ví dụ, một request message có thể được gửi từ một user agent HTTP/1.0 tới một proxy nội bộ có mật danh "fred", proxy này dùng HTTP/1.1 để chuyển tiếp request tới một proxy công khai ở `p.example.net`, và proxy đó hoàn tất request bằng cách chuyển tiếp tới origin server ở `www.example.com`. Request mà `www.example.com` nhận được khi đó sẽ có header field `Via` như sau: `Via: 1.0 fred, 1.1 p.example.net`"

📖 **Nguyên văn** (RFC 9110 §7.6.3)
> "The received-by portion is normally the host and optional port number of a recipient server or client that subsequently forwarded the message.  However, if the real host is considered to be sensitive information, a sender MAY replace it with a pseudonym."

🇻🇳 **Dịch**
> "Phần received-by thường là host và số port tuỳ chọn của một server hay client nhận rồi sau đó chuyển tiếp message. Tuy nhiên, nếu host thật được coi là thông tin nhạy cảm, bên gửi CÓ THỂ thay nó bằng một **bí danh (pseudonym)**."

📖 **Nguyên văn** (RFC 9110 §7.6.3)
> "An intermediary used as a portal through a network firewall SHOULD NOT forward the names and ports of hosts within the firewall region unless it is explicitly enabled to do so.  If not enabled, such an intermediary SHOULD replace each received-by host of any host behind the firewall by an appropriate pseudonym for that host."

🇻🇳 **Dịch**
> "Một intermediary dùng làm cổng xuyên qua network firewall KHÔNG NÊN chuyển tiếp tên và port của các host nằm trong vùng firewall, trừ khi được bật rõ ràng cho phép làm vậy. Nếu không được bật, intermediary đó NÊN thay mỗi received-by host của bất kỳ host nằm sau firewall bằng một bí danh thích hợp cho host ấy."

---

## 6. `Server` header — và lý do nên nói ít (§10.2.4)

📖 **Nguyên văn** (RFC 9110 §10.2.4 "Server")
> "The "Server" header field contains information about the software used by the origin server to handle the request, which is often used by clients to help identify the scope of reported interoperability problems, to work around or tailor requests to avoid particular server limitations, and for analytics regarding server or operating system use.  An origin server MAY generate a Server header field in its responses.
>
>      Server = product *( RWS ( product / comment ) )"

🇻🇳 **Dịch**
> "Header field "Server" chứa thông tin về phần mềm mà origin server dùng để xử lý request. Thông tin này thường được client dùng để giúp xác định phạm vi của các vấn đề tương thích được báo cáo, để lách hoặc điều chỉnh request nhằm tránh một số giới hạn cụ thể của server, và cho mục đích phân tích thống kê về việc sử dụng server hay hệ điều hành. Một origin server **CÓ THỂ** (MAY — không bắt buộc) sinh header field `Server` trong response của nó."

📖 **Nguyên văn** (RFC 9110 §10.2.4)
> "An origin server SHOULD NOT generate a Server header field containing needlessly fine-grained detail and SHOULD limit the addition of subproducts by third parties.  Overly long and detailed Server field values increase response latency and potentially reveal internal implementation details that might make it (slightly) easier for attackers to find and exploit known security holes."

🇻🇳 **Dịch**
> "Một origin server KHÔNG NÊN sinh header field `Server` chứa chi tiết mịn một cách không cần thiết, và NÊN giới hạn việc các bên thứ ba thêm subproduct vào. Giá trị field `Server` quá dài và quá chi tiết làm tăng latency của response, và có khả năng tiết lộ chi tiết cài đặt nội bộ — điều này có thể khiến kẻ tấn công **dễ hơn (một chút)** trong việc tìm và khai thác các lỗ hổng bảo mật đã biết."

> [!tip] Đọc kỹ chữ "(slightly)"
> Spec cố ý viết "dễ hơn một chút". Ẩn `Server: nginx/1.25.3` thành `Server: nginx` là việc nên làm, nhưng đừng coi đó là biện pháp bảo mật thật — nó chỉ là giảm bề mặt thông tin. Bốn web server ở các bài sau đều có tuỳ chọn tắt/ẩn version (`server_tokens off` của Nginx, `ServerTokens` của Apache…), và lý do chính thống nằm đúng ở đoạn này.

---

## 7. Ví dụ trao đổi message đầy đủ (§3.9)

📖 **Nguyên văn** (RFC 9110 §3.9 "Example Message Exchange")
> "The following example illustrates a typical HTTP/1.1 message exchange for a GET request (Section 9.3.1) on the URI "http://www.example.com/hello.txt":
>
>    Client request:
>
> ```
>    GET /hello.txt HTTP/1.1
>    User-Agent: curl/7.64.1
>    Host: www.example.com
>    Accept-Language: en, mi
> ```
>
>    Server response:
>
> ```
>    HTTP/1.1 200 OK
>    Date: Mon, 27 Jul 2009 12:28:53 GMT
>    Server: Apache
>    Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
>    ETag: "34aa387-d-1568eb00"
>    Accept-Ranges: bytes
>    Content-Length: 51
>    Vary: Accept-Encoding
>    Content-Type: text/plain
>
>    Hello World! My content includes a trailing CRLF.
> ```
> "

🇻🇳 **Dịch**
> "Ví dụ sau minh hoạ một trao đổi message HTTP/1.1 điển hình cho một GET request trên URI `http://www.example.com/hello.txt`" — phần request và response giữ nguyên như trên.

> [!note] Trong đúng ví dụ này có gần hết bài
> - `Host: www.example.com` → cơ chế định tuyến §7.2.
> - `Server: Apache` → §10.2.4, và chú ý spec chọn ví dụ **không kèm version**.
> - `ETag`, `Last-Modified`, `Vary` → thuộc [[02 - HTTP Caching]].
> - Không có `Via` → chuỗi này không đi qua proxy hay gateway nào.

---

## 8. Chốt lại: "web server" trong roadmap nghĩa là gì

Node **Learn about Web Servers** của roadmap liệt kê 4 sản phẩm: Nginx, Apache, Caddy, MS IIS. Theo đúng thuật ngữ RFC 9110, mỗi sản phẩm đó là **một chương trình có thể đóng nhiều vai tuỳ cấu hình**:

| Vai (theo RFC 9110) | Nghĩa | Cấu hình tương ứng |
|---|---|---|
| **origin server** (§3.6) | tự sinh response có thẩm quyền | serve file tĩnh từ đĩa |
| **gateway / reverse proxy** (§3.7) | đóng vai origin với client, chuyển request inbound tới server khác | `proxy_pass`, `ProxyPass`, `reverse_proxy` |
| **proxy** (§3.7) | do client chọn, chuyển tiếp request ra ngoài | forward proxy (ít dùng trong 4 sản phẩm này) |
| **tunnel** (§3.7) | chuyển tiếp mù, không đổi message | xử lý `CONNECT` / TLS passthrough |
| **cache** (§3.8) | lưu response để trả lại lần sau | `proxy_cache` — xem [[02 - HTTP Caching]] |

📖 **Nguyên văn** (RFC 9110 §3.8 "Caches")
> "A "cache" is a local store of previous response messages and the subsystem that controls its message storage, retrieval, and deletion.  A cache stores cacheable responses in order to reduce the response time and network bandwidth consumption on future, equivalent requests.  Any client or server MAY employ a cache, though a cache cannot be used while acting as a tunnel."

🇻🇳 **Dịch**
> "Một "cache" là kho lưu trữ cục bộ các response message trước đó, cùng phân hệ điều khiển việc lưu, lấy ra và xoá message trong đó. Cache lưu các response cacheable nhằm giảm thời gian phản hồi và lượng băng thông mạng tiêu thụ cho các request tương đương trong tương lai. Bất kỳ client hay server nào CÓ THỂ dùng cache, dù cache không thể được dùng khi đang đóng vai tunnel."

> [!warning] Một câu để nhớ cả phần này
> "Web server" **không phải một vai cố định**. Cùng một file `nginx.conf` có thể khiến tiến trình đó là origin server ở `location /static/`, là gateway ở `location /api/`, và là cache ở cả hai — theo đúng câu §3.7: *"a single intermediary might act as an origin server, proxy, gateway, or tunnel, switching behavior based on the nature of each request."*

---

## Nguồn tham khảo
- RFC 9110 — HTTP Semantics: <https://www.rfc-editor.org/rfc/rfc9110.txt>
- RFC 9111 — HTTP Caching (đã học ở phần 7): <https://www.rfc-editor.org/rfc/rfc9111.txt>
- roadmap.sh — Backend, node *Learn about Web Servers*: <https://roadmap.sh/backend>
