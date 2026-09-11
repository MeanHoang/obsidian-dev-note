# 09 — So sánh API Styles và REST Security

> **Nguồn chính:** Fielding Dissertation ch.5 (REST) · W3C SOAP 1.2 Part 1 · grpc.io docs · GraphQL Spec October 2021 + graphql.org/learn · RFC 9110 (HTTP Semantics) · OWASP REST Security Cheat Sheet
> Bài tổng kết đợt A: gom lại 4 style đã học (REST / SOAP / gRPC / GraphQL) thành một bảng đối chiếu **chỉ dựa trên tài liệu chính thức của chính công nghệ đó**, rồi đi hết mục lục của OWASP REST Security Cheat Sheet.

> [!note] Cách đọc bài này
> Bài này **không giới thiệu khái niệm mới**. Mỗi ô trong bảng so sánh ở Phần A đều phải truy được về một câu trích nguyên văn nằm ngay trong bài. Ô nào tài liệu chính thức không nói thì để trống và ghi rõ — không suy đoán.
> Chi tiết từng style nằm ở các bài riêng:
> [[01 - API là gì và nền tảng HTTP]] · [[02 - REST]] · [[03 - JSON và JSON-API]] · [[04 - HTTP Status Code và thiết kế lỗi]] · [[05 - SOAP]] · [[06 - gRPC và Protocol Buffers]] · [[07 - GraphQL]] · [[08 - OpenAPI Specification]]

---

# PHẦN A — So sánh 4 API style

Trước khi đọc bảng, đây là **bằng chứng**: các câu trích nguyên văn từ tài liệu gốc của từng công nghệ. Bảng tổng hợp nằm ở cuối Phần A.

---

## A.1 — REST (Fielding dissertation, ch.5)

### Bản chất: architectural style, không phải protocol

📖 **Nguyên văn**
> "This chapter introduces and elaborates the Representational State Transfer (REST) architectural style for distributed hypermedia systems, describing the software engineering principles guiding REST and the interaction constraints chosen to retain those principles, while contrasting them to the constraints of other architectural styles."

🇻🇳 **Dịch**
> "Chương này giới thiệu và trình bày chi tiết **architectural style** Representational State Transfer (REST) dành cho các hệ thống hypermedia phân tán, mô tả các nguyên tắc kỹ nghệ phần mềm dẫn dắt REST và những ràng buộc tương tác được chọn để giữ các nguyên tắc đó, đồng thời đối chiếu chúng với ràng buộc của các architectural style khác."

💡 **Ví dụ đời sống**
REST giống "luật giao thông" chứ không phải "chiếc xe". Luật nói *đi bên phải, dừng đèn đỏ*; xe nào cũng phải theo. SOAP và gRPC thì ngược lại — chúng là chiếc xe cụ thể, có động cơ, có khung sườn, có định dạng riêng.

### Transport: không bị trói vào một protocol

📖 **Nguyên văn**
> "REST does not restrict communication to a particular protocol, but it does constrain the interface between components, and hence the scope of interaction and implementation assumptions that might otherwise be made between components. For example, the Web's primary transfer protocol is HTTP, but the architecture also includes seamless access to resources that originate on pre-existing network servers, including FTP [107], Gopher [7], and WAIS [36]."

🇻🇳 **Dịch**
> "REST không giới hạn việc giao tiếp vào một protocol cụ thể, nhưng nó ràng buộc interface giữa các component, và do đó ràng buộc luôn phạm vi tương tác cũng như những giả định về implementation mà lẽ ra các component có thể tự đặt ra với nhau. Ví dụ, transfer protocol chính của Web là HTTP, nhưng kiến trúc này cũng bao gồm việc truy cập liền mạch tới các resource nằm trên những network server có sẵn, kể cả FTP, Gopher và WAIS."

### Định dạng dữ liệu: không cố định, chọn động

📖 **Nguyên văn**
> "REST components communicate by transferring a representation of a resource in a format matching one of an evolving set of standard data types, selected dynamically based on the capabilities or desires of the recipient and the nature of the resource."

🇻🇳 **Dịch**
> "Các component của REST giao tiếp bằng cách truyền đi một **representation** của một resource, ở một định dạng thuộc về một tập các kiểu dữ liệu chuẩn đang tiến hoá, được **chọn động** dựa trên khả năng hoặc mong muốn của bên nhận và bản chất của resource đó."

> [!note] Đây chính là gốc của `Content-Type` / `Accept`
> Câu trên là lý do REST không "thuộc về JSON". JSON chỉ là lựa chọn phổ biến nhất hiện nay — xem [[03 - JSON và JSON-API]].

### Cache là một constraint bắt buộc của style

📖 **Nguyên văn**
> "In order to improve network efficiency, we add cache constraints to form the client-cache-stateless-server style of Section 3.4.4 (Figure 5-4). Cache constraints require that the data within a response to a request be implicitly or explicitly labeled as cacheable or non-cacheable. If a response is cacheable, then a client cache is given the right to reuse that response data for later, equivalent requests."

🇻🇳 **Dịch**
> "Để cải thiện hiệu quả mạng, ta thêm các ràng buộc **cache** để tạo thành style client-cache-stateless-server (Mục 3.4.4, Hình 5-4). Ràng buộc cache yêu cầu dữ liệu bên trong một response cho một request phải được gán nhãn ngầm định hoặc tường minh là cacheable hay non-cacheable. Nếu một response là cacheable, thì cache phía client được trao quyền tái sử dụng dữ liệu response đó cho những request tương đương về sau."

Và phía HTTP, RFC 9110 chốt method nào được cache:

📖 **Nguyên văn** (RFC 9110 §9.2.3 Methods and Caching)
> "For a cache to store and use a response, the associated method needs to explicitly allow caching and to detail under what conditions a response can be used to satisfy subsequent requests; a method definition that does not do so cannot be cached.  For additional requirements see [CACHING].
>
>    This specification defines caching semantics for GET, HEAD, and POST, although the overwhelming majority of cache implementations only support GET and HEAD."

🇻🇳 **Dịch**
> "Để một cache lưu và dùng một response, method tương ứng phải cho phép caching một cách tường minh và phải nêu rõ trong điều kiện nào thì response đó được dùng để đáp ứng các request về sau; một định nghĩa method không làm điều đó thì không thể được cache. Các yêu cầu bổ sung xem [CACHING].
>
> Đặc tả này định nghĩa ngữ nghĩa caching cho **GET, HEAD và POST**, mặc dù đại đa số các implementation cache chỉ hỗ trợ GET và HEAD."

### Stateless

📖 **Nguyên văn**
> "We next add a constraint to the client-server interaction: communication must be stateless in nature, as in the client-stateless-server (CSS) style of Section 3.4.3 (Figure 5-3), such that each request from client to server must contain all of the information necessary to understand the request, and cannot take advantage of any stored context on the server. Session state is therefore kept entirely on the client."

🇻🇳 **Dịch**
> "Tiếp theo ta thêm một ràng buộc vào tương tác client-server: giao tiếp phải **stateless** về bản chất, như trong style client-stateless-server (CSS) ở Mục 3.4.3 (Hình 5-3), sao cho mỗi request từ client tới server phải chứa **toàn bộ thông tin cần thiết để hiểu request đó**, và không được lợi dụng bất kỳ context nào đã lưu trên server. Do đó session state được giữ hoàn toàn ở phía client."

### Uniform interface — 4 ràng buộc

📖 **Nguyên văn**
> "In order to obtain a uniform interface, multiple architectural constraints are needed to guide the behavior of components. REST is defined by four interface constraints: identification of resources; manipulation of resources through representations; self-descriptive messages; and, hypermedia as the engine of application state."

🇻🇳 **Dịch**
> "Để có được một **uniform interface**, cần nhiều ràng buộc kiến trúc để dẫn dắt hành vi của các component. REST được định nghĩa bởi bốn ràng buộc về interface: định danh các resource; thao tác resource thông qua representation; message tự mô tả; và hypermedia là động cơ của application state."

---

## A.2 — SOAP (W3C SOAP Version 1.2 Part 1, Recommendation)

### Bản chất: một protocol, có envelope XML

📖 **Nguyên văn** (Abstract)
> "SOAP Version 1.2 is a lightweight protocol intended for exchanging structured information in a decentralized, distributed environment. "Part 1: Messaging Framework" defines, using XML technologies, an extensible messaging framework containing a message construct that can be exchanged over a variety of underlying protocols."

🇻🇳 **Dịch**
> "SOAP Version 1.2 là một **protocol** nhẹ, nhằm trao đổi thông tin có cấu trúc trong một môi trường phi tập trung, phân tán. "Part 1: Messaging Framework" định nghĩa — bằng các công nghệ XML — một messaging framework mở rộng được, chứa một cấu trúc message có thể được trao đổi qua **nhiều underlying protocol khác nhau**."

> [!note] Đây là điểm đối lập rõ nhất với REST
> REST là *style* ràng buộc interface; SOAP là *protocol* định nghĩa hẳn cấu trúc message. Cả hai đều không trói vào một transport duy nhất, nhưng vì lý do khác nhau.

### Định dạng dữ liệu: XML Infoset, bắt buộc có Envelope

📖 **Nguyên văn** (§5. SOAP Message Construct)
> "A SOAP message is specified as an XML infoset whose comment, element, attribute, namespace and character information items are able to be serialized as XML 1.0. [...] A SOAP message Infoset consists of a document information item with exactly one member in its [children] property, which MUST be the SOAP Envelope  element information item (see 5.1 SOAP Envelope)."

🇻🇳 **Dịch**
> "Một SOAP message được đặc tả như một **XML infoset** mà các information item kiểu comment, element, attribute, namespace và character của nó có thể được serialize thành XML 1.0. [...] Infoset của một SOAP message gồm một document information item có **đúng một** phần tử trong thuộc tính [children], và phần tử đó **BẮT BUỘC** là element information item **SOAP Envelope**."

### Transport: binding framework, không chỉ HTTP

📖 **Nguyên văn** (§2, tổng quan các mục)
> "Section 4. SOAP Protocol Binding Framework defines a framework for describing the rules for how SOAP messages can be exchanged over a variety of underlying protocols."

🇻🇳 **Dịch**
> "Mục 4. SOAP Protocol Binding Framework định nghĩa một framework để mô tả các quy tắc về việc SOAP message có thể được trao đổi qua nhiều underlying protocol khác nhau như thế nào."

📖 **Nguyên văn** (§4.2 Binding Framework)
> "5. SOAP Message Construct provides that all SOAP envelopes are serializable using an XML 1.0 serialization, so XML 1.0 or later versions of XML MAY be used by bindings as the "on the wire" representation of the XML Infoset.  However, the binding framework does not require that every binding use an XML serialization for transmission; compressed, encrypted, fragmented representations and so on can be used if appropriate."

🇻🇳 **Dịch**
> "Mục 5. SOAP Message Construct quy định rằng mọi SOAP envelope đều serialize được bằng XML 1.0, nên binding **CÓ THỂ** dùng XML 1.0 hoặc phiên bản XML mới hơn làm biểu diễn "trên đường truyền" của XML Infoset. Tuy nhiên, binding framework **không bắt buộc** mọi binding phải dùng XML serialization để truyền; các biểu diễn nén, mã hoá, phân mảnh… đều dùng được nếu phù hợp."

### Contract/schema: WSDL + XML Schema (W3C, spec riêng)

📖 **Nguyên văn** (W3C WSDL 2.0 Part 1, Abstract)
> "This document describes the Web Services Description Language Version 2.0 (WSDL 2.0), an XML language for describing Web services. This specification defines the core language which can be used to describe Web services based on an abstract model of what the service offers."

🇻🇳 **Dịch**
> "Tài liệu này mô tả Web Services Description Language Version 2.0 (WSDL 2.0), một ngôn ngữ XML dùng để **mô tả Web service**. Đặc tả này định nghĩa ngôn ngữ lõi, có thể dùng để mô tả Web service dựa trên một mô hình trừu tượng về những gì service cung cấp."

📖 **Nguyên văn** (WSDL 2.0 §2, Description)
> "At an abstract level, WSDL 2.0 describes a Web service in terms of the messages it sends and receives; messages are described independent of a specific wire format using a type system, typically XML Schema."

🇻🇳 **Dịch**
> "Ở mức trừu tượng, WSDL 2.0 mô tả một Web service theo các message mà nó gửi và nhận; message được mô tả **độc lập với wire format cụ thể**, bằng một **type system**, thường là XML Schema."

> [!note] SOAP có kiểu dữ liệu — do XML Schema cung cấp
> Bản thân SOAP 1.2 Part 1 không định nghĩa type system; nó chỉ định nghĩa envelope và processing model. Type system đến từ XML Schema thông qua WSDL.

---

## A.3 — gRPC (grpc.io docs)

### Bản chất: framework RPC, có stub sinh tự động

📖 **Nguyên văn** (Introduction to gRPC → Overview)
> "In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types."

🇻🇳 **Dịch**
> "Trong gRPC, một ứng dụng client có thể gọi trực tiếp một method trên một ứng dụng server nằm ở máy khác **như thể đó là một object cục bộ**, giúp bạn tạo ứng dụng và service phân tán dễ hơn. Như trong nhiều hệ RPC khác, gRPC xoay quanh ý tưởng định nghĩa một service, chỉ rõ các method có thể gọi từ xa cùng với tham số và kiểu trả về của chúng."

💡 **Ví dụ đời sống**
REST giống gửi bưu phẩm: bạn đóng gói địa chỉ (URL), ghi loại hàng (Content-Type), bưu điện chuyển. gRPC giống gọi nội bộ trong công ty: bấm số máy lẻ, người bên kia nhấc máy — bạn không nghĩ tới chuyện "đóng gói" nữa vì tổng đài (stub) làm giùm.

### Contract: Protocol Buffers làm IDL

📖 **Nguyên văn** (Core concepts → Service definition)
> "Like many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. By default, gRPC uses protocol buffers as the Interface Definition Language (IDL) for describing both the service interface and the structure of the payload messages. It is possible to use other alternatives if desired."

🇻🇳 **Dịch**
> "Như nhiều hệ RPC khác, gRPC xoay quanh ý tưởng định nghĩa một service, chỉ rõ các method có thể gọi từ xa cùng tham số và kiểu trả về. **Mặc định**, gRPC dùng protocol buffers làm **Interface Definition Language (IDL)** để mô tả cả service interface lẫn cấu trúc của các payload message. Có thể dùng phương án khác nếu muốn."

### Định dạng dữ liệu: Protocol Buffers (nhị phân), nhưng mở

📖 **Nguyên văn** (Protocol Buffers → Overview)
> "Protocol Buffers are a language-neutral, platform-neutral extensible mechanism for serializing structured data. It’s like JSON, except it’s smaller and faster, and it generates native language bindings."

🇻🇳 **Dịch**
> "Protocol Buffers là một cơ chế serialize dữ liệu có cấu trúc, **trung lập về ngôn ngữ, trung lập về nền tảng**, mở rộng được. Nó giống JSON, chỉ khác là **nhỏ hơn và nhanh hơn**, và nó sinh ra native language binding."

📖 **Nguyên văn** (gRPC FAQ)
> "**Can I use gRPC with my favorite data format (JSON, Protobuf, Thrift, XML) ?**
> Yes. gRPC is designed to be extensible to support multiple content types. The initial release contains support for Protobuf and with external support for other content types such as FlatBuffers and Thrift, at varying levels of maturity."

🇻🇳 **Dịch**
> "**Tôi dùng gRPC với định dạng dữ liệu ưa thích của tôi (JSON, Protobuf, Thrift, XML) được không?**
> Được. gRPC được thiết kế để mở rộng nhằm hỗ trợ nhiều content type. Bản phát hành đầu tiên hỗ trợ Protobuf, còn các content type khác như FlatBuffers và Thrift được hỗ trợ từ bên ngoài, ở mức độ trưởng thành khác nhau."

### Transport: HTTP/2

📖 **Nguyên văn** (gRPC FAQ → "Why is gRPC better/worse than REST?")
> "gRPC largely follows HTTP semantics over HTTP/2 but we explicitly allow for full-duplex streaming. We diverge from typical REST conventions as we use static paths for performance reasons during call dispatch as parsing call parameters from paths, query parameters and payload body adds latency and complexity. We have also formalized a set of errors that we believe are more directly applicable to API use cases than the HTTP status codes."

🇻🇳 **Dịch**
> "gRPC phần lớn tuân theo ngữ nghĩa HTTP **trên nền HTTP/2**, nhưng chúng tôi cho phép tường minh việc **streaming full-duplex**. Chúng tôi đi chệch khỏi quy ước REST thông thường ở chỗ dùng **static path** vì lý do hiệu năng khi dispatch lời gọi, bởi việc parse tham số từ path, query parameter và payload body làm tăng độ trễ và độ phức tạp. Chúng tôi cũng đã chuẩn hoá một tập error mà chúng tôi tin là áp dụng trực tiếp cho use case API tốt hơn các HTTP status code."

> [!note] Câu này trả lời luôn 2 ô trong bảng
> — transport = HTTP/2; và "mã lỗi" = tập error riêng của gRPC, **không phải** HTTP status code (xem [[04 - HTTP Status Code và thiết kế lỗi]] để so sánh).

### Streaming: 4 kiểu method

📖 **Nguyên văn** (Core concepts)
> "gRPC lets you define four kinds of service method:
>
> - Unary RPCs where the client sends a single request to the server and gets a single response back, just like a normal function call.
> - Server streaming RPCs where the client sends a request to the server and gets a stream to read a sequence of messages back. The client reads from the returned stream until there are no more messages. gRPC guarantees message ordering within an individual RPC call.
> - Client streaming RPCs where the client writes a sequence of messages and sends them to the server, again using a provided stream. Once the client has finished writing the messages, it waits for the server to read them and return its response.
> - Bidirectional streaming RPCs where both sides send a sequence of messages using a read-write stream. The two streams operate independently, so clients and servers can read and write in whatever order they like"

🇻🇳 **Dịch**
> "gRPC cho phép bạn định nghĩa **bốn kiểu service method**:
>
> - **Unary RPC**: client gửi một request duy nhất tới server và nhận lại một response duy nhất, y như một lời gọi hàm bình thường.
> - **Server streaming RPC**: client gửi một request tới server và nhận lại một stream để đọc một chuỗi message. Client đọc từ stream trả về cho đến khi hết message. gRPC bảo đảm thứ tự message trong phạm vi một lời gọi RPC.
> - **Client streaming RPC**: client ghi một chuỗi message và gửi tới server, cũng qua một stream được cấp. Khi client ghi xong, nó chờ server đọc hết rồi trả về response.
> - **Bidirectional streaming RPC**: cả hai phía gửi một chuỗi message qua một stream đọc-ghi. Hai stream hoạt động độc lập, nên client và server có thể đọc và ghi theo thứ tự tuỳ ý."

### Trình duyệt gọi trực tiếp?

📖 **Nguyên văn** (gRPC FAQ)
> "**Can I use it in the browser?**
> The gRPC-Web project is Generally Available."

🇻🇳 **Dịch**
> "**Tôi dùng nó trong trình duyệt được không?**
> Dự án **gRPC-Web** đã ở trạng thái Generally Available (phát hành rộng rãi)."

> [!warning] Đọc kỹ câu trả lời này
> Tài liệu chính thức **không nói** "trình duyệt gọi gRPC trực tiếp được". Nó trỏ sang một dự án **riêng** tên gRPC-Web. Nghĩa là: muốn gọi từ browser, phải đi qua gRPC-Web, không phải gRPC thuần.

---

## A.4 — GraphQL (GraphQL Spec October 2021 + graphql.org/learn)

### Bản chất: query language + execution engine

📖 **Nguyên văn** (Spec, Introduction)
> "This is the specification for GraphQL, a query language and execution engine originally created at Facebook in 2012 for describing the capabilities and requirements of data models for client-server applications."

🇻🇳 **Dịch**
> "Đây là đặc tả cho GraphQL, một **query language và execution engine** ban đầu được tạo ra tại Facebook năm 2012 để mô tả năng lực và yêu cầu của các data model cho ứng dụng client-server."

### Kiểu dữ liệu: type system bắt buộc, kiểm tra trước khi chạy

📖 **Nguyên văn** (Spec, Introduction → Design Principles)
> "Strong-typing: Every GraphQL service defines an application-specific type system. Requests are executed within the context of that type system. Given a GraphQL operation, tools can ensure that it is both syntactically correct and valid within that type system before execution, i.e. at development time, and the service can make certain guarantees about the shape and nature of the response."

🇻🇳 **Dịch**
> "**Strong-typing**: Mỗi GraphQL service định nghĩa một type system riêng cho ứng dụng. Request được thực thi trong ngữ cảnh của type system đó. Với một GraphQL operation cho trước, công cụ có thể bảo đảm nó vừa đúng cú pháp vừa hợp lệ trong type system đó **trước khi thực thi**, tức là ở thời điểm phát triển, và service có thể đưa ra những bảo đảm nhất định về hình dạng và bản chất của response."

### Client quyết định hình dạng response

📖 **Nguyên văn** (Spec, Design Principles)
> "Client-specified response: Through its type system, a GraphQL service publishes the capabilities that its clients are allowed to consume. It is the client that is responsible for specifying exactly how it will consume those published capabilities. These requests are specified at field-level granularity. In the majority of client-server applications written without GraphQL, the service determines the shape of data returned from its various endpoints. A GraphQL response, on the other hand, contains exactly what a client asks for and no more."

🇻🇳 **Dịch**
> "**Client-specified response**: Thông qua type system của mình, một GraphQL service công bố những năng lực mà client được phép tiêu thụ. Chính **client** chịu trách nhiệm chỉ rõ nó sẽ tiêu thụ các năng lực đã công bố đó ra sao. Các request này được chỉ định ở mức **từng field**. Trong đa số ứng dụng client-server viết không dùng GraphQL, chính service quyết định hình dạng dữ liệu trả về từ các endpoint khác nhau. Ngược lại, một GraphQL response chứa **đúng những gì client hỏi, không hơn**."

💡 **Ví dụ đời sống**
REST là cơm phần cố định: gọi "suất cơm gà" thì bưng ra nguyên khay, có món bạn không ăn. GraphQL là buffet gọi món: bạn liệt kê đúng 3 thứ mình muốn, nhà bếp bưng đúng 3 thứ đó.

### Định dạng dữ liệu: JSON là phổ biến nhất, nhưng không bắt buộc

📖 **Nguyên văn** (Spec §7.2 / §7.2.1)
> "GraphQL does not require a specific serialization format. However, clients should use a serialization format that supports the major primitives in the GraphQL response."

🇻🇳 **Dịch**
> "GraphQL **không yêu cầu** một serialization format cụ thể. Tuy nhiên, client nên dùng một serialization format hỗ trợ được các primitive chính trong GraphQL response."

📖 **Nguyên văn** (Spec §7.2.1 JSON Serialization)
> "JSON is the most common serialization format for GraphQL. Though as mentioned above, GraphQL does not require a specific serialization format."

🇻🇳 **Dịch**
> "JSON là serialization format **phổ biến nhất** cho GraphQL. Dù vậy, như đã nêu ở trên, GraphQL không yêu cầu một serialization format cụ thể."

### Transport: spec không quy định, thực tế là HTTP một endpoint

📖 **Nguyên văn** (graphql.org/learn → Serving over HTTP)
> "The GraphQL specification doesn’t require particular client-server protocols when sending API requests and responses, but HTTP is the most common choice because of its ubiquity."

🇻🇳 **Dịch**
> "Đặc tả GraphQL không yêu cầu protocol client-server cụ thể khi gửi request và response của API, nhưng **HTTP là lựa chọn phổ biến nhất** vì nó có mặt ở khắp nơi."

📖 **Nguyên văn** (graphql.org/learn → Serving over HTTP → API endpoint)
> "HTTP is commonly associated with REST, which uses “resources” as its core concept. In contrast, GraphQL’s conceptual model is an entity graph. As a result, entities in GraphQL are not identified by URLs. Instead, a GraphQL server operates on a single URL/endpoint, usually /graphql, and all GraphQL requests for a given service should be directed to this endpoint."

🇻🇳 **Dịch**
> "HTTP thường gắn liền với REST, vốn lấy "resource" làm khái niệm cốt lõi. Ngược lại, mô hình khái niệm của GraphQL là một **entity graph**. Hệ quả là các entity trong GraphQL **không được định danh bằng URL**. Thay vào đó, một GraphQL server hoạt động trên **một URL/endpoint duy nhất**, thường là `/graphql`, và mọi GraphQL request của service đó nên được gửi tới endpoint này."

📖 **Nguyên văn** (graphql.org/learn → Serving over HTTP → Methods)
> "Your GraphQL HTTP server must handle the HTTP POST method for query and mutation operations, and may also accept the GET method for query operations."

🇻🇳 **Dịch**
> "GraphQL HTTP server của bạn **phải** xử lý HTTP method **POST** cho các operation query và mutation, và **có thể** chấp nhận thêm method **GET** cho các operation query."

### Cache theo HTTP: mất "chìa khoá" URL

📖 **Nguyên văn** (graphql.org/learn → Caching)
> "In an endpoint-based API, clients can use HTTP caching to avoid refetching resources and to identify when two resources are the same. The URL in these APIs is a globally unique identifier that the client can leverage to build a cache.
>
> In GraphQL, there’s no URL-like primitive that provides this globally unique identifier for a given object. Hence, it’s a best practice for the API to expose such an identifier for clients to use as a prerequisite for certain types of caching."

🇻🇳 **Dịch**
> "Trong một API dựa trên endpoint, client có thể dùng **HTTP caching** để khỏi phải fetch lại resource và để nhận ra khi nào hai resource là một. URL trong các API đó là một **định danh duy nhất toàn cục** mà client có thể tận dụng để xây cache.
>
> Trong GraphQL, **không có primitive giống URL** nào cung cấp định danh duy nhất toàn cục cho một object. Vì thế, best practice là API tự phơi ra một định danh như vậy để client dùng, như điều kiện tiên quyết cho một số kiểu caching."

📖 **Nguyên văn** (graphql.org/learn → Serving over HTTP → Methods)
> "When servers do support the GET method for query operations, a client may be encouraged to leverage this option to facilitate HTTP caching or edge caching in a content delivery network (CDN). However, because GraphQL documents strings may be quite long for complex operations, the query parameters may exceed the limits that browsers and CDNs impose on URL lengths."

🇻🇳 **Dịch**
> "Khi server có hỗ trợ method GET cho các operation query, client có thể được khuyến khích tận dụng lựa chọn này để tạo điều kiện cho HTTP caching hoặc edge caching trong CDN. Tuy nhiên, vì chuỗi GraphQL document có thể khá dài với các operation phức tạp, các query parameter có thể **vượt quá giới hạn độ dài URL** mà trình duyệt và CDN áp đặt."

### Streaming: subscription, nhưng transport bỏ ngỏ

📖 **Nguyên văn** (Spec §6.2.3 Subscription → "Delivery Agnostic")
> "GraphQL subscriptions do not require any specific serialization format or transport mechanism. Subscriptions specifies algorithms for the creation of a stream, the content of each payload on that stream, and the closing of that stream. There are intentionally no specifications for message acknowledgement, buffering, resend requests, or any other quality of service (QoS) details. Message serialization, transport mechanisms, and quality of service details should be chosen by the implementing service."

🇻🇳 **Dịch**
> "GraphQL subscription **không yêu cầu** bất kỳ serialization format hay cơ chế transport cụ thể nào. Subscription chỉ đặc tả thuật toán để tạo ra một stream, nội dung của từng payload trên stream đó, và việc đóng stream. **Cố ý không có** đặc tả nào cho việc xác nhận message, buffering, yêu cầu gửi lại, hay bất kỳ chi tiết quality of service (QoS) nào. Việc serialize message, cơ chế transport và các chi tiết QoS **do service triển khai tự chọn**."

### Introspection — điểm khiến GraphQL tự mô tả

📖 **Nguyên văn** (Spec, Design Principles)
> "Introspective: GraphQL is introspective. A GraphQL service’s type system can be queryable by the GraphQL language itself, as will be described in this specification. GraphQL introspection serves as a powerful platform for building common tools and client software libraries."

🇻🇳 **Dịch**
> "**Introspective**: GraphQL có khả năng tự soi. Type system của một GraphQL service có thể được truy vấn bằng chính ngôn ngữ GraphQL, như đặc tả này sẽ mô tả. GraphQL introspection là một nền tảng mạnh để xây các công cụ chung và thư viện client."

> [!danger] Introspection cũng là bề mặt tấn công
> Cùng một cơ chế giúp GraphiQL tự sinh tài liệu cũng cho kẻ tấn công đọc trọn schema — biết đủ tên type, field, argument để dò. Đây là lý do các đội thường tắt introspection ở production. *(Nhận định thực hành, không phải trích dẫn từ spec.)*

---

## A.5 — BẢNG SO SÁNH

> [!warning] Quy tắc của bảng này
> Mỗi ô đều truy được về một câu trích ở Phần A.1–A.4 phía trên. Ô ghi **“— không kiểm chứng được từ tài liệu chính thức”** nghĩa là spec/docs gốc của công nghệ đó **không phát biểu** điều này, nên bài cố tình bỏ trống thay vì đoán.

| Tiêu chí | REST | SOAP | gRPC | GraphQL |
|---|---|---|---|---|
| **Bản chất** | *Architectural style* — "the Representational State Transfer (REST) **architectural style** for distributed hypermedia systems" | *Protocol* — "SOAP Version 1.2 is a lightweight **protocol** intended for exchanging structured information" | *Framework RPC* — "a client application can **directly call a method** on a server application on a different machine as if it were a local object" | *Query language + execution engine* — "a **query language and execution engine**" |
| **Định dạng dữ liệu** | Không cố định, chọn động — "a format matching one of an **evolving set of standard data types, selected dynamically**" | XML — "A SOAP message is specified as an **XML infoset** […] MUST be the SOAP Envelope element" | Protocol Buffers (nhị phân) mặc định, mở rộng được — "It’s like JSON, except it’s **smaller and faster**" + FAQ: "gRPC is designed to be **extensible to support multiple content types**" | Không bắt buộc; JSON phổ biến nhất — "**GraphQL does not require a specific serialization format**" / "**JSON is the most common** serialization format for GraphQL" |
| **Transport** | Không trói vào một protocol — "**REST does not restrict communication to a particular protocol**" (Web dùng HTTP) | Nhiều underlying protocol — "can be exchanged over a **variety of underlying protocols**" | HTTP/2 — "gRPC largely follows HTTP semantics **over HTTP/2**" | Spec không quy định; thực tế HTTP — "The GraphQL specification **doesn’t require particular client-server protocols** […] but **HTTP is the most common choice**" |
| **Contract / schema** | Không có contract bắt buộc trong style; message tự mô tả — "**self-descriptive messages**". *(Contract dạng file là OpenAPI — xem [[08 - OpenAPI Specification]], nằm ngoài dissertation.)* | WSDL + XML Schema — "**WSDL 2.0**, an XML language for **describing Web services**" | Protocol Buffers làm IDL — "gRPC uses protocol buffers as the **Interface Definition Language (IDL)** for describing both the service interface and the structure of the payload messages" | Schema/type system là một phần của chính spec — "**Every GraphQL service defines an application-specific type system**" |
| **Kiểu dữ liệu (typing)** | — không kiểm chứng được từ tài liệu chính thức *(dissertation nói về representation và data type của media type, không định nghĩa type system cho API)* | Có, nhưng do XML Schema cấp qua WSDL — "messages are described independent of a specific wire format using a **type system, typically XML Schema**" | Có, do `.proto` định nghĩa — "Protocol buffer data is structured as **messages** […] a series of name-value pairs called **fields**" (`string name = 1;`) | Có, bắt buộc và kiểm tra trước khi chạy — "tools can ensure that it is both syntactically correct and **valid within that type system before execution**" |
| **Streaming** | — không kiểm chứng được từ tài liệu chính thức *(dissertation không đặc tả streaming API)* | — không kiểm chứng được từ tài liệu chính thức *(SOAP 1.2 Part 1 định nghĩa MEP, không định nghĩa streaming)* | Có, 4 kiểu: **unary / server streaming / client streaming / bidirectional streaming**; FAQ: "we explicitly allow for **full-duplex streaming**" | Có `subscription`, nhưng transport bỏ ngỏ — "GraphQL subscriptions **do not require any specific serialization format or transport mechanism**" |
| **Cache theo HTTP** | Là **constraint bắt buộc** của style — "Cache constraints require that the data within a response […] be implicitly or explicitly labeled as **cacheable or non-cacheable**"; RFC 9110: caching semantics cho **GET, HEAD, POST** | — không kiểm chứng được từ tài liệu chính thức *(SOAP 1.2 Part 1 không nói về HTTP cache)* | — không kiểm chứng được từ tài liệu chính thức *(docs gRPC không mô tả cache theo HTTP; chúng dùng static path + HTTP/2)* | Khó: mất định danh URL — "In GraphQL, there’s **no URL-like primitive** that provides this globally unique identifier"; nếu dùng GET thì "query parameters **may exceed the limits** that browsers and CDNs impose on URL lengths" |
| **Trình duyệt gọi trực tiếp?** | Có — style của chính Web; representation được chọn theo "the **capabilities or desires of the recipient**" | — không kiểm chứng được từ tài liệu chính thức *(SOAP 1.2 Part 1 không phát biểu về browser)* | **Không trực tiếp** — FAQ trả lời "Can I use it in the browser?" bằng "**The gRPC-Web project** is Generally Available" (tức phải qua gRPC-Web) | Có, qua HTTP — "Your GraphQL HTTP server **must handle the HTTP POST method**" tới "**a single URL/endpoint, usually /graphql**" |
| **Điểm nhận diện** | Resource + URI + HTTP verb + stateless + cache | Envelope XML + `mustUnderstand` + SOAP Fault | `.proto` + stub sinh tự động + HTTP/2 + tập error riêng | Một endpoint + client chọn từng field + introspection |

### Một khác biệt đáng ghi riêng: mã lỗi

📖 **Nguyên văn** (gRPC FAQ)
> "We have also formalized a set of errors that we believe are more directly applicable to API use cases than the HTTP status codes."

🇻🇳 **Dịch**
> "Chúng tôi cũng đã chuẩn hoá **một tập error** mà chúng tôi tin là áp dụng trực tiếp cho các use case API tốt hơn so với HTTP status code."

Nghĩa là: REST dùng HTTP status code (xem [[04 - HTTP Status Code và thiết kế lỗi]]), SOAP dùng **SOAP Fault** (§5.4), gRPC dùng **status code riêng**, GraphQL trả lỗi trong `errors` của response body. Bốn hệ lỗi khác nhau hoàn toàn.

---

## A.6 — Chọn cái nào?

> [!note] Phần này là **nhận định thực hành**, KHÔNG phải trích dẫn
> Không một spec nào ở trên nói "hãy dùng X khi Y". Những gợi ý dưới đây là suy luận từ các thuộc tính đã trích ở bảng trên, không phải phát biểu của W3C / gRPC / GraphQL Foundation.

**Dùng REST khi:** API công khai cho nhiều loại client lạ, cần cache ở CDN/proxy, cần gọi được từ `curl` và thanh địa chỉ trình duyệt. Lý do rút ra từ bảng: chỉ REST có cache là *constraint* của chính style và có định danh URL cho từng resource.

**Dùng SOAP khi:** đang tích hợp với hệ thống doanh nghiệp đã có sẵn WSDL (ngân hàng, bảo hiểm, viễn thông, cơ quan nhà nước), hoặc cần các header block bắt buộc-phải-hiểu (`mustUnderstand`). Lý do: SOAP là style duy nhất trong bốn cái mà envelope và processing model được chuẩn hoá ở mức W3C Recommendation.

**Dùng gRPC khi:** giao tiếp **service ↔ service** trong nội bộ, payload lớn hoặc tần suất cao, cần streaming hai chiều. Lý do: protobuf nhị phân "smaller and faster", HTTP/2, 4 kiểu streaming. Đổi lại: browser phải qua gRPC-Web, và bạn mất HTTP cache.

**Dùng GraphQL khi:** nhiều loại client (web/iOS/Android) cần các tập field khác nhau từ cùng một nguồn dữ liệu, và bạn muốn tránh over-fetching. Lý do: "A GraphQL response […] contains exactly what a client asks for and no more". Đổi lại: HTTP cache gần như mất, và phía server bạn tự chuốc bài toán [[07 - N+1 Problem]] khi resolver gọi DB theo từng field.

> [!tip] Bốn cái không loại trừ nhau
> Một hệ thống thật thường có REST cho API công khai, gRPC giữa các internal service, và GraphQL làm lớp gateway cho frontend. Câu hỏi đúng không phải "cái nào tốt nhất" mà "ở ranh giới này, ai gọi ai, và họ cần gì".

---

# PHẦN B — REST Security (OWASP REST Security Cheat Sheet)

> **Nguồn:** OWASP Cheat Sheet Series — REST Security Cheat Sheet
> `https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html`

Toàn bộ Phần B là trích nguyên văn từ cheat sheet này, theo đúng thứ tự mục lục của nó.

## B.0 Introduction — OWASP định nghĩa lại REST

📖 **Nguyên văn**
> "REST APIs are stateless. Stateful APIs do not adhere to the REST architectural style. State in the REST acronym refers to the state of the resource which the API accesses, not the state of a session within which the API is called. While there may be good reasons for building a stateful API, it is important to realize that managing sessions is complex and difficult to do securely."

🇻🇳 **Dịch**
> "REST API là **stateless**. API stateful không tuân theo architectural style REST. Chữ "State" trong từ viết tắt REST chỉ **trạng thái của resource** mà API truy cập, **không phải** trạng thái của một session mà trong đó API được gọi. Dù có thể có lý do chính đáng để xây một API stateful, điều quan trọng là phải nhận ra rằng **quản lý session thì phức tạp và khó làm cho an toàn**."

📖 **Nguyên văn**
> "Stateful services are out of scope of this Cheat Sheet: Passing state from client to backend, while making the service technically stateless, is an anti-pattern that should also be avoided as it is prone to replay and impersonation attacks."

🇻🇳 **Dịch**
> "Service stateful nằm ngoài phạm vi của Cheat Sheet này: việc **truyền state từ client xuống backend** — dù về mặt kỹ thuật khiến service trở thành stateless — là một **anti-pattern** cũng nên tránh, vì nó dễ bị tấn công **replay** và **mạo danh (impersonation)**."

> [!danger] Đừng nhét session state vào request rồi tự nhận là stateless
> Đây là cái bẫy hay gặp nhất khi đọc chữ "stateless" theo nghĩa đen. Gửi kèm `?userRole=admin` để "khỏi tra DB" chính là ví dụ điển hình: về hình thức thì stateless, về bản chất là trao quyền quyết định cho kẻ tấn công.

📖 **Nguyên văn**
> "In order to implement flows with REST APIs, resources are typically created, read, updated and deleted. For example, an ecommerce site may offer methods to create an empty shopping cart, to add items to the cart and to check out the cart. Each of these REST calls is stateless and **the endpoint should check whether the caller is authorized to perform the requested operation**."

🇻🇳 **Dịch**
> "Để hiện thực các luồng nghiệp vụ bằng REST API, resource thường được tạo, đọc, cập nhật và xoá. Ví dụ, một trang thương mại điện tử có thể cung cấp các method để tạo giỏ hàng rỗng, thêm món vào giỏ, và thanh toán giỏ. **Mỗi lời gọi REST này đều stateless và endpoint phải kiểm tra xem người gọi có được phép thực hiện thao tác được yêu cầu hay không.**"

---

## B.1 HTTPS

📖 **Nguyên văn**
> "Secure REST services must only provide HTTPS endpoints. This protects authentication credentials in transit, for example passwords, API keys or JSON Web Tokens. It also allows clients to authenticate the service and guarantees integrity of the transmitted data.
>
> See the Transport Layer Security Cheat Sheet for additional information.
>
> Consider the use of mutually authenticated client-side certificates to provide additional protection for highly privileged web services."

🇻🇳 **Dịch**
> "REST service an toàn **chỉ được** cung cấp endpoint HTTPS. Điều này bảo vệ authentication credential khi đang truyền, ví dụ mật khẩu, API key hay JSON Web Token. Nó cũng cho phép client xác thực chính service đó và bảo đảm **tính toàn vẹn** của dữ liệu được truyền.
>
> Xem Transport Layer Security Cheat Sheet để biết thêm.
>
> Cân nhắc dùng **client-side certificate xác thực hai chiều** để bảo vệ thêm cho các web service có đặc quyền cao."

> [!danger] "must only provide HTTPS endpoints"
> Chú ý chữ **only**. Không phải "hỗ trợ cả HTTP lẫn HTTPS rồi redirect". Bất kỳ request HTTP đầu tiên nào cũng đã lộ credential trước khi kịp redirect.

---

## B.2 Access Control

📖 **Nguyên văn**
> "Non-public REST services must perform access control at each API endpoint. Web services in monolithic applications implement this by means of user authentication, authorization logic and session management. This has several drawbacks for modern architectures which compose multiple microservices following the RESTful style.
>
> - in order to minimize latency and reduce coupling between services, the access control decision should be taken locally by REST endpoints
> - user authentication should be centralised in a Identity Provider (IdP), which issues access tokens"

🇻🇳 **Dịch**
> "REST service không công khai **phải thực hiện access control tại từng API endpoint**. Web service trong ứng dụng monolith làm việc này bằng user authentication, logic authorization và quản lý session. Cách đó có vài nhược điểm với kiến trúc hiện đại gồm nhiều microservice theo style RESTful.
>
> - để giảm thiểu độ trễ và giảm coupling giữa các service, **quyết định access control nên được đưa ra cục bộ tại từng REST endpoint**
> - **user authentication nên được tập trung hoá ở một Identity Provider (IdP)**, nơi phát hành access token"

> [!danger] "at each API endpoint" — từng endpoint, không phải từng "khu vực"
> Kiểm tra quyền ở gateway rồi tin tưởng mọi thứ phía sau là mô hình đổ vỡ ngay khi ai đó gọi thẳng vào service nội bộ. Đây cũng chính là **API1:2023 Broken Object Level Authorization** và **API5:2023 Broken Function Level Authorization** trong OWASP API Security Top 10 (xem B.16).

💡 **Ví dụ đời sống**
Toà nhà có bảo vệ ở sảnh (IdP) kiểm tra CMND và phát thẻ ra vào. Nhưng mỗi cánh cửa phòng vẫn phải tự quẹt thẻ — bảo vệ sảnh không biết ai được vào phòng kế toán. Sảnh lo *anh là ai*; cửa phòng lo *anh được vào đây không*.

---

## B.3 JWT

📖 **Nguyên văn**
> "There seems to be a convergence towards using JSON Web Tokens (JWT) as the format for security tokens. JWTs are JSON data structures containing a set of claims that can be used for access control decisions. A cryptographic signature or message authentication code (MAC) can be used to protect the integrity of the JWT.
>
> - Ensure JWTs are integrity protected by either a signature or a MAC. Do not allow the unsecured JWTs: {"alg":"none"}.
> - In general, signatures should be preferred over MACs for integrity protection of JWTs."

🇻🇳 **Dịch**
> "Dường như đang có sự hội tụ về việc dùng **JSON Web Token (JWT)** làm định dạng cho security token. JWT là cấu trúc dữ liệu JSON chứa một tập **claim** dùng cho các quyết định access control. Một chữ ký mật mã (signature) hoặc message authentication code (MAC) có thể được dùng để bảo vệ tính toàn vẹn của JWT.
>
> - Bảo đảm JWT được bảo vệ toàn vẹn bằng signature hoặc MAC. **Không cho phép JWT không được bảo vệ: `{"alg":"none"}`**.
> - Nhìn chung, nên **ưu tiên signature hơn MAC** để bảo vệ toàn vẹn JWT."

📖 **Nguyên văn**
> "A relying party must verify the integrity of the JWT based on its own configuration or hard-coded logic. It must not rely on the information of the JWT header to select the verification algorithm."

🇻🇳 **Dịch**
> "Bên tin cậy (relying party) **phải** kiểm tra tính toàn vẹn của JWT dựa trên cấu hình của chính nó hoặc logic hard-code. Nó **không được** dựa vào thông tin trong header của JWT để chọn thuật toán kiểm tra."

> [!danger] Hai lỗ hổng kinh điển nằm gọn trong hai câu trên
> 1. **`alg: none`** — kẻ tấn công gửi JWT không chữ ký, server ngây thơ chấp nhận.
> 2. **Algorithm confusion** — kẻ tấn công đổi `alg` từ `RS256` sang `HS256` rồi ký bằng chính public key. Nếu server đọc `alg` từ header để chọn thuật toán, nó sẽ xác minh thành công.
> Cả hai đều bị chặn nếu server **tự quyết định** thuật toán, không hỏi token.

📖 **Nguyên văn**
> "Some claims have been standardized and should be present in JWT used for access controls. At least the following of the standard claims should be verified:
>
> - iss or issuer - is this a trusted issuer? Is it the expected owner of the signing key?
> - aud or audience - is the relying party in the target audience for this JWT?
> - exp or expiration time - is the current time before the end of the validity period of this token?
> - nbf or not before time - is the current time after the start of the validity period of this token?"

🇻🇳 **Dịch**
> "Một số claim đã được chuẩn hoá và nên có mặt trong JWT dùng cho access control. Tối thiểu các standard claim sau nên được kiểm tra:
>
> - **`iss`** (issuer) — đây có phải issuer đáng tin không? Có đúng là chủ sở hữu dự kiến của signing key không?
> - **`aud`** (audience) — relying party có nằm trong nhóm audience đích của JWT này không?
> - **`exp`** (expiration time) — thời điểm hiện tại có trước khi hết hạn hiệu lực của token không?
> - **`nbf`** (not before time) — thời điểm hiện tại có sau khi bắt đầu hiệu lực của token không?"

> [!note] Bài này chỉ **nhắc** JWT
> Chi tiết JWT (cấu trúc header/payload/signature, ký và verify, refresh token, revoke) thuộc về đợt B `B - Authentication`. Ở đây chỉ cần nhớ 4 claim phải verify và 2 bẫy `alg`.

---

## B.4 API Keys

📖 **Nguyên văn**
> "Public REST services without access control run the risk of being farmed leading to excessive bills for bandwidth or compute cycles. API keys can be used to mitigate this risk. They are also often used by organization to monetize APIs; instead of blocking high-frequency calls, clients are given access in accordance to a purchased access plan.
>
> API keys can reduce the impact of denial-of-service attacks. However, when they are issued to third-party clients, they are relatively easy to compromise.
>
> - Require API keys for every request to the protected endpoint.
> - Return 429 Too Many Requests HTTP response code if requests are coming in too quickly.
> - Revoke the API key if the client violates the usage agreement.
> - Do not rely exclusively on API keys to protect sensitive, critical or high-value resources."

🇻🇳 **Dịch**
> "REST service công khai mà không có access control có nguy cơ **bị khai thác ồ ạt (farmed)**, dẫn tới hoá đơn băng thông hoặc compute khổng lồ. API key có thể dùng để giảm rủi ro này. Chúng cũng thường được tổ chức dùng để **kiếm tiền từ API**: thay vì chặn các lời gọi tần suất cao, client được cấp quyền truy cập theo gói đã mua.
>
> API key có thể giảm tác động của tấn công denial-of-service. Tuy nhiên, khi được phát cho **client bên thứ ba**, chúng tương đối **dễ bị lộ**.
>
> - Yêu cầu API key cho **mọi** request tới endpoint được bảo vệ.
> - Trả về mã **`429 Too Many Requests`** nếu request đến quá nhanh.
> - **Thu hồi** API key nếu client vi phạm thoả thuận sử dụng.
> - **Không dựa duy nhất vào API key** để bảo vệ resource nhạy cảm, trọng yếu hoặc giá trị cao."

> [!danger] API key ≠ authentication
> Câu chốt của OWASP: "Do not rely **exclusively** on API keys". API key trả lời "ứng dụng nào đang gọi", không trả lời "người dùng nào đang gọi". Dùng nó để tính cước và rate-limit thì được; dùng nó làm cổng duy nhất vào dữ liệu nhạy cảm thì không.

---

## B.5 Restrict HTTP methods

📖 **Nguyên văn**
> "- Apply an allowlist of permitted HTTP Methods e.g. GET, POST, PUT.
> - Reject all requests not matching the allowlist with HTTP response code 405 Method not allowed.
> - Make sure the caller is authorized to use the incoming HTTP method on the resource collection, action, and record"

🇻🇳 **Dịch**
> "- Áp dụng một **allowlist** các HTTP method được phép, ví dụ GET, POST, PUT.
> - **Từ chối** mọi request không khớp allowlist bằng mã **`405 Method not allowed`**.
> - Bảo đảm người gọi **được phép** dùng HTTP method đó trên resource collection, action và record tương ứng."

📖 **Nguyên văn**
> "In Java EE in particular, this can be difficult to implement properly. See Bypassing Web Authentication and Authorization with HTTP Verb Tampering for an explanation of this common misconfiguration."

🇻🇳 **Dịch**
> "Riêng với Java EE, việc này có thể khó hiện thực cho đúng. Xem "Bypassing Web Authentication and Authorization with HTTP Verb Tampering" để hiểu về cấu hình sai phổ biến này."

> [!warning] Allowlist, không phải denylist
> Liệt kê cái được phép, chứ không liệt kê cái bị cấm. Denylist luôn thiếu — bạn sẽ quên `TRACE`, `PATCH`, hoặc một verb tuỳ biến nào đó.

---

## B.6 Preventing Out-of-Order API Execution

📖 **Nguyên văn**
> "Modern REST APIs often implement business workflows through a sequence of endpoints (for example, create → validate → approve → finalize). If the backend does not explicitly validate workflow state transitions, attackers may invoke endpoints out of sequence to bypass intended controls."

🇻🇳 **Dịch**
> "REST API hiện đại thường hiện thực luồng nghiệp vụ qua một **chuỗi endpoint** (ví dụ create → validate → approve → finalize). Nếu backend **không kiểm tra tường minh các chuyển trạng thái** của workflow, kẻ tấn công có thể gọi các endpoint **sai thứ tự** để vượt qua các kiểm soát dự định."

📖 **Nguyên văn** (Problem)
> "Out-of-order API execution occurs when an attacker:
>
> - Skips required workflow steps by directly calling later-stage endpoints
> - Replays or reuses tokens across workflow boundaries
> - Exploits assumptions that the frontend enforces correct sequencing
>
> Because each endpoint may be individually authenticated and authorized, traditional access control checks often fail to detect these issues."

🇻🇳 **Dịch**
> "Thực thi API sai thứ tự xảy ra khi kẻ tấn công:
>
> - **Bỏ qua** các bước workflow bắt buộc bằng cách gọi thẳng endpoint ở giai đoạn sau
> - **Replay hoặc tái sử dụng token** xuyên qua ranh giới workflow
> - Khai thác giả định rằng **frontend** là nơi bảo đảm đúng thứ tự
>
> Vì mỗi endpoint có thể đã được authenticate và authorize riêng lẻ, các kiểm tra access control truyền thống **thường không phát hiện được** những vấn đề này."

📖 **Nguyên văn** (Example)
> ```
> POST /checkout/create
> POST /checkout/pay
> POST /checkout/confirm
> ```
> "If the backend does not validate workflow state transitions, an attacker could directly invoke:"
> ```
> POST /checkout/confirm
> ```
> "without completing payment."

🇻🇳 **Dịch**
> Luồng thanh toán dự kiến gồm 3 bước theo thứ tự: tạo đơn → trả tiền → xác nhận. Nếu backend không kiểm tra chuyển trạng thái, kẻ tấn công gọi thẳng `POST /checkout/confirm` — **xác nhận đơn mà chưa trả tiền**.

> [!danger] Đây là lỗi nghiệp vụ, không phải lỗi code
> Mỗi endpoint riêng lẻ đều "đúng": có token hợp lệ, có quyền hợp lệ. Cái sai nằm ở chỗ **không ai kiểm tra thứ tự**. Scanner tự động gần như không bắt được loại lỗi này.

📖 **Nguyên văn** (Prevention Guidance)
> "- Enforce workflow state validation on the server side for every request
> - Model workflows explicitly using finite states or state machines
> - Bind tokens or identifiers to specific workflow stages
> - Avoid relying on frontend logic to enforce sequencing
> - Reject invalid or out-of-order transitions with clear error responses"

🇻🇳 **Dịch**
> "- **Bắt buộc kiểm tra trạng thái workflow ở phía server cho mọi request**
> - Mô hình hoá workflow một cách tường minh bằng **finite state** hoặc **state machine**
> - **Gắn token hoặc định danh vào từng giai đoạn** workflow cụ thể
> - Tránh dựa vào logic frontend để bảo đảm thứ tự
> - Từ chối các chuyển trạng thái không hợp lệ hoặc sai thứ tự bằng response lỗi rõ ràng"

📖 **Nguyên văn** (Testing Checklist)
> "- Can endpoints be invoked out of sequence?
> - Does each endpoint validate the current workflow state?
> - Are tokens reusable across workflow steps?
> - Are invalid state transitions consistently rejected?"

🇻🇳 **Dịch**
> "- Các endpoint có gọi được sai thứ tự không?
> - Mỗi endpoint có kiểm tra trạng thái workflow hiện tại không?
> - Token có tái sử dụng được xuyên các bước workflow không?
> - Các chuyển trạng thái không hợp lệ có bị từ chối một cách nhất quán không?"

---

## B.7 Input validation

📖 **Nguyên văn**
> "- Do not trust input parameters/objects.
> - Validate input: length / range / format and type.
> - Achieve an implicit input validation by using strong types like numbers, booleans, dates, times or fixed data ranges in API parameters.
> - Constrain string inputs with regexps.
> - Reject unexpected/illegal content.
> - Make use of validation/sanitation libraries or frameworks in your specific language.
> - Define an appropriate request size limit and reject requests exceeding the limit with HTTP response status 413 Request Entity Too Large.
> - Consider logging input validation failures. Assume that someone who is performing hundreds of failed input validations per second is up to no good.
> - Use a secure parser for parsing the incoming messages. If you are using XML, make sure to use a parser that is not vulnerable to XXE and similar attacks."

🇻🇳 **Dịch**
> "- **Đừng tin** tham số/object đầu vào.
> - Validate input: **độ dài / khoảng giá trị / định dạng và kiểu**.
> - Đạt được validation ngầm bằng cách dùng **kiểu mạnh** như number, boolean, date, time hoặc khoảng dữ liệu cố định trong tham số API.
> - Ràng buộc input dạng chuỗi bằng **regexp**.
> - **Từ chối** nội dung không mong đợi/không hợp lệ.
> - Dùng thư viện hoặc framework validation/sanitation của ngôn ngữ bạn dùng.
> - Định nghĩa **giới hạn kích thước request** phù hợp và từ chối request vượt giới hạn bằng mã **`413 Request Entity Too Large`**.
> - Cân nhắc **ghi log các lần validation thất bại**. Cứ cho rằng ai đó đang tạo ra hàng trăm lần validation thất bại mỗi giây là đang có ý đồ xấu.
> - Dùng **parser an toàn** để parse message đến. Nếu dùng XML, hãy chắc chắn parser đó không dính lỗ hổng **XXE** và các tấn công tương tự."

> [!danger] Input validation là tuyến đầu của hầu hết lỗ hổng inject
> Cùng một nguyên tắc "đừng tin input" là gốc của SQL Injection. Nhưng lưu ý: validation **không thay thế** được parameterized query — xem [[13 - SQL Injection và Parameterized Query]]. Validate để loại rác từ sớm; parameterize để dữ liệu không bao giờ bị hiểu nhầm thành câu lệnh.

💡 **Ví dụ đời sống**
Nhân viên hải quan không "đọc lướt tờ khai rồi tin". Họ có danh sách mặt hàng được phép, có cân trọng lượng tối đa, và mở kiện ra soi. Một tờ khai ghi "quà tặng" không làm kiện hàng thành quà tặng.

---

## B.8 Validate content types

📖 **Nguyên văn**
> "A REST request or response body should match the intended content type in the header. Otherwise this could cause misinterpretation at the consumer/producer side and lead to code injection/execution.
>
> - Document all supported content types in your API."

🇻🇳 **Dịch**
> "Body của một REST request hay response **nên khớp** với content type dự định ghi trong header. Nếu không, điều đó có thể gây hiểu sai ở phía bên tiêu thụ/bên tạo ra và dẫn tới **code injection/execution**.
>
> - **Ghi tài liệu** cho tất cả content type mà API của bạn hỗ trợ."

📖 **Nguyên văn** (Validate request content types)
> "- Reject requests containing unexpected or missing content type headers with HTTP response status 406 Unacceptable or 415 Unsupported Media Type. For requests with Content-Length: 0 however, a Content-type header is optional.
> - For XML content types ensure appropriate XML parser hardening, see the XXE cheat sheet.
> - Avoid accidentally exposing unintended content types by explicitly defining content types e.g. Jersey (Java) @consumes("application/json"); @produces("application/json"). This avoids XXE-attack vectors for example."

🇻🇳 **Dịch**
> "- **Từ chối** request có content type header không mong đợi hoặc thiếu, bằng mã **`406 Unacceptable`** hoặc **`415 Unsupported Media Type`**. Tuy nhiên với request có `Content-Length: 0` thì header `Content-type` là tuỳ chọn.
> - Với các content type XML, hãy bảo đảm **hardening cho XML parser**, xem XXE cheat sheet.
> - Tránh vô tình phơi ra content type ngoài ý muốn bằng cách **định nghĩa tường minh** content type, ví dụ Jersey (Java) `@consumes("application/json")`; `@produces("application/json")`. Cách này chẳng hạn giúp tránh vector tấn công XXE."

📖 **Nguyên văn** (Send safe response content types)
> "It is common for REST services to allow multiple response types (e.g. application/xml or application/json, and the client specifies the preferred order of response types by the Accept header in the request.
>
> - Do NOT simply copy the Accept header to the Content-type header of the response.
> - Reject the request (ideally with a 406 Not Acceptable response) if the Accept header does not specifically contain one of the allowable types.
>
> Services including script code (e.g. JavaScript) in their responses must be especially careful to defend against header injection attack.
>
> - Ensure sending intended content type headers in your response matching your body content e.g. application/json and not application/javascript."

🇻🇳 **Dịch**
> "REST service thường cho phép nhiều response type (ví dụ `application/xml` hoặc `application/json`), và client chỉ định thứ tự ưu tiên của các response type qua header `Accept` trong request.
>
> - **TUYỆT ĐỐI KHÔNG** copy thẳng header `Accept` sang header `Content-type` của response.
> - **Từ chối** request (lý tưởng là bằng response `406 Not Acceptable`) nếu header `Accept` không chứa cụ thể một trong các kiểu được phép.
>
> Các service có chèn mã script (ví dụ JavaScript) vào response phải đặc biệt cẩn thận để phòng tấn công **header injection**.
>
> - Bảo đảm gửi đúng content type header trong response khớp với nội dung body, ví dụ `application/json` **chứ không phải** `application/javascript`."

> [!danger] "Do NOT simply copy the Accept header to the Content-type header"
> Copy nguyên xi nghĩa là **để client tự chọn** header `Content-Type` của response. Kẻ tấn công gửi `Accept: text/html`, nhận về JSON được gắn nhãn HTML, và trình duyệt render nó — thành XSS.

---

## B.9 Management endpoints

📖 **Nguyên văn**
> "- Avoid exposing management endpoints via Internet.
> - If management endpoints must be accessible via the Internet, make sure that users must use a strong authentication mechanism, e.g. multi-factor.
> - Expose management endpoints via different HTTP ports or hosts preferably on a different NIC and restricted subnet.
> - Restrict access to these endpoints by firewall rules  or use of access control lists."

🇻🇳 **Dịch**
> "- **Tránh phơi management endpoint ra Internet.**
> - Nếu buộc phải truy cập được từ Internet, hãy bảo đảm người dùng phải dùng **cơ chế xác thực mạnh**, ví dụ **multi-factor**.
> - Phơi management endpoint qua **cổng HTTP hoặc host khác**, tốt nhất là trên một **NIC khác và subnet bị giới hạn**.
> - Giới hạn truy cập tới các endpoint này bằng **firewall rule** hoặc **access control list**."

> [!danger] Liên quan trực tiếp tới API9:2023 — Improper Inventory Management
> Endpoint `/actuator`, `/debug`, `/admin`, `/metrics` bị quên ngoài Internet là một trong những đường vào phổ biến nhất. Xem B.16.

---

## B.10 Error handling

📖 **Nguyên văn**
> "- Respond with generic error messages - avoid revealing details of the failure unnecessarily.
> - Do not pass technical details (e.g. call stacks or other internal hints) to the client."

🇻🇳 **Dịch**
> "- Trả về **thông điệp lỗi chung chung** — tránh tiết lộ chi tiết của thất bại một cách không cần thiết.
> - **Không chuyển chi tiết kỹ thuật** (ví dụ call stack hay các gợi ý nội bộ khác) cho client."

> [!danger] Stack trace là bản đồ cho kẻ tấn công
> Một stack trace lộ ra tên framework, phiên bản, đường dẫn file, tên bảng DB. Kết hợp với B.15 (mã 500) thì quy tắc là: **log đầy đủ ở server, trả tối thiểu cho client**, kèm một correlation ID để đội vận hành tra lại.

---

## B.11 Audit logs

📖 **Nguyên văn**
> "- Write audit logs before and after security related events.
> - Consider logging token validation errors in order to detect attacks.
> - Take care of log injection attacks by sanitizing log data beforehand."

🇻🇳 **Dịch**
> "- Ghi audit log **trước và sau** các sự kiện liên quan tới bảo mật.
> - Cân nhắc **ghi log các lỗi validate token** để phát hiện tấn công.
> - Cẩn thận với tấn công **log injection** bằng cách **sanitize dữ liệu log trước khi ghi**."

> [!warning] "before and after" — ghi cả hai đầu
> Chỉ ghi sau khi thành công thì bạn mất dấu mọi nỗ lực thất bại. Mà chuỗi nỗ lực thất bại mới chính là thứ tố cáo một cuộc tấn công đang diễn ra.

---

## B.12 Security Headers

📖 **Nguyên văn**
> "There are a number of security related headers that can be returned in the HTTP responses to instruct browsers to act in specific ways. However, some of these headers are intended to be used with HTML responses, and as such may provide little or no security benefits on an API that does not return HTML. Note that if the API is only consumed by non-browser clients (e.g. mobile apps, server-to-server calls, command-line tools), most of these headers will have no effect since they are directives for browsers."

🇻🇳 **Dịch**
> "Có một số header liên quan tới bảo mật có thể được trả về trong HTTP response để chỉ thị cho trình duyệt hành xử theo cách nhất định. Tuy nhiên, một số header trong đó vốn dành cho response HTML, nên có thể mang lại **rất ít hoặc không có lợi ích bảo mật** cho một API không trả về HTML. Lưu ý rằng nếu API chỉ được tiêu thụ bởi client không phải trình duyệt (ví dụ app mobile, lời gọi server-to-server, công cụ dòng lệnh), **phần lớn các header này sẽ không có tác dụng** vì chúng là chỉ thị dành cho trình duyệt."

📖 **Nguyên văn** (bảng — nhóm "should be included in all API responses that may be consumed by browser clients")

| Header | Rationale |
|---|---|
| `Cache-Control: no-store` | "Header used to direct caching done by browsers. Providing no-store indicates that any caches of any kind (private or shared) should not store the response that contains the header. A browser must make a new request everytime the API is called to fetch the latest response. This header with a no-store value prevents sensitive information from being cached or stored." |
| `Content-Security-Policy: frame-ancestors 'none'` | "Header used to specify whether a response can be framed in a `<frame>`, `<iframe>`, `<embed>` or `<object>` element. For an API response, there is no requirement to be framed in any of those elements. Providing frame-ancestors 'none' prevents any domain from framing the response returned by the API call. This header protects against drag-and-drop style clickjacking attacks." |
| `Content-Type` | "Header to specify the content type of a response. This must be specified as per the type of content returned by an API call. If not specified or if specified incorrectly, a browser might attempt to guess the content type of the response. This can return in MIME sniffing attacks. One common content type value is application/json if the API response is JSON." |
| `Strict-Transport-Security` | "Header to instruct a browser that the domain should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS. This header ensures that API calls are made over HTTPS and protects against spoofed certificates." |
| `X-Content-Type-Options: nosniff` | "Header to instruct a browser to always use the MIME type that is declared in the Content-Type header rather than trying to determine the MIME type based on the file's content. This header with a nosniff value prevents browsers from performing MIME sniffing, and inappropriately interpreting responses as HTML." |
| `X-Frame-Options: DENY` | "Legacy header superseded by Content-Security-Policy: frame-ancestors 'none' (see above). Still recommended for compatibility with older browsers that do not support CSP Level 2. Providing DENY prevents any domain from framing the response." |

🇻🇳 **Dịch**

| Header | Lý do |
|---|---|
| `Cache-Control: no-store` | Điều khiển caching do trình duyệt thực hiện. Giá trị `no-store` nói rằng **mọi cache thuộc mọi loại** (riêng tư hay dùng chung) **không được lưu** response chứa header này. Trình duyệt phải tạo request mới mỗi lần gọi API. Header này ngăn thông tin nhạy cảm bị cache hoặc lưu lại. |
| `Content-Security-Policy: frame-ancestors 'none'` | Chỉ định response có được nhúng trong `<frame>`, `<iframe>`, `<embed>` hay `<object>` không. Với một API response thì **không có nhu cầu** bị nhúng. Giá trị `frame-ancestors 'none'` ngăn **mọi domain** nhúng response đó. Header này chống **clickjacking** kiểu kéo-thả. |
| `Content-Type` | Chỉ định content type của response. **Bắt buộc** ghi đúng theo loại nội dung API trả về. Nếu không ghi hoặc ghi sai, trình duyệt có thể **đoán** content type, dẫn tới tấn công **MIME sniffing**. Giá trị phổ biến là `application/json` nếu response là JSON. |
| `Strict-Transport-Security` | Chỉ thị cho trình duyệt rằng domain này **chỉ được truy cập qua HTTPS**, và mọi lần truy cập bằng HTTP sau này phải tự động chuyển sang HTTPS. Header này bảo đảm lời gọi API đi qua HTTPS và chống **certificate giả mạo**. |
| `X-Content-Type-Options: nosniff` | Chỉ thị cho trình duyệt **luôn dùng** MIME type khai báo trong header `Content-Type`, thay vì tự suy ra từ nội dung file. Giá trị `nosniff` ngăn trình duyệt MIME sniffing và diễn giải nhầm response thành HTML. |
| `X-Frame-Options: DENY` | Header **cũ**, đã được `Content-Security-Policy: frame-ancestors 'none'` thay thế. Vẫn khuyến nghị dùng để tương thích với trình duyệt cũ không hỗ trợ CSP Level 2. Giá trị `DENY` ngăn mọi domain nhúng response. |

📖 **Nguyên văn** (nhóm chỉ cần khi response có thể được render như HTML)
> "The headers below are only intended to provide additional security when responses are rendered as HTML. As such, if the API will never return HTML in responses, then these headers may not be necessary. However, if there is any uncertainty about the function of the headers, or the types of information that the API returns (or may return in future), then it is recommended to include them as part of a defense-in-depth approach."

🇻🇳 **Dịch**
> "Các header dưới đây chỉ nhằm cung cấp bảo mật bổ sung **khi response được render như HTML**. Do đó, nếu API sẽ không bao giờ trả về HTML thì các header này có thể không cần thiết. Tuy nhiên, nếu còn bất kỳ điều gì chưa chắc chắn về chức năng của các header đó, hoặc về những loại thông tin mà API trả về (hoặc có thể trả về trong tương lai), thì nên **thêm chúng vào như một phần của cách tiếp cận defense-in-depth**."

📖 **Nguyên văn** (ví dụ của nhóm này)
> "Content-Security-Policy | Content-Security-Policy: default-src 'none' | The majority of CSP functionality only affects pages rendered as HTML.
> Permissions-Policy | […] | This header used to be named Feature-Policy. When browsers heed this header, it is used to control browser features via directives. The example disables features with an empty allowlist for a number of permitted directive names.
> Referrer-Policy | Referrer-Policy: no-referrer | Non-HTML responses should not trigger additional requests."

🇻🇳 **Dịch**
> - `Content-Security-Policy: default-src 'none'` — phần lớn chức năng của CSP chỉ ảnh hưởng tới trang được render dưới dạng HTML.
> - `Permissions-Policy` — header này trước đây tên là `Feature-Policy`. Khi trình duyệt tuân theo, nó dùng để điều khiển các tính năng của trình duyệt bằng các directive. Ví dụ trong cheat sheet **tắt các tính năng bằng một allowlist rỗng** cho một loạt tên directive được phép.
> - `Referrer-Policy: no-referrer` — response không phải HTML thì không nên kích hoạt thêm request nào.

---

## B.13 CORS

📖 **Nguyên văn**
> "Cross-Origin Resource Sharing (CORS) is a W3C standard to flexibly specify what cross-domain requests are permitted. By delivering appropriate CORS Headers your REST API signals to the browser which domains, AKA origins, are allowed to make JavaScript calls to the REST service.
>
> - Disable CORS headers if cross-domain calls are not supported/expected.
> - Be as specific as possible and as general as necessary when setting the origins of cross-domain calls."

🇻🇳 **Dịch**
> "**Cross-Origin Resource Sharing (CORS)** là một chuẩn W3C để chỉ định linh hoạt những request cross-domain nào được phép. Bằng cách gửi các CORS header phù hợp, REST API của bạn báo cho trình duyệt biết **những domain (tức origin) nào** được phép thực hiện lời gọi JavaScript tới REST service.
>
> - **Tắt CORS header** nếu không hỗ trợ/không mong đợi lời gọi cross-domain.
> - Khi đặt origin cho lời gọi cross-domain, hãy **cụ thể nhất có thể và chỉ tổng quát ở mức cần thiết**."

> [!danger] `Access-Control-Allow-Origin: *` là câu trả lời sai cho lỗi CORS
> Nguyên tắc OWASP là "as specific as possible". Đặt `*` để cho hết lỗi đỏ trong console nghĩa là bạn đã cho **mọi trang web trên Internet** gọi API của mình bằng JavaScript. Liệt kê đích danh origin được phép.

💡 **Ví dụ đời sống**
CORS là danh sách khách mời ở cửa, do **lễ tân trình duyệt** cầm. Server ghi tên ai được vào; trình duyệt là người đối chiếu. Lưu ý hệ quả: công cụ không phải trình duyệt (curl, script server) **không cầm danh sách này** — nên CORS không bao giờ thay thế được access control ở B.2.

---

## B.14 Sensitive information in HTTP requests

📖 **Nguyên văn**
> "RESTful web services should be careful to prevent leaking credentials. Passwords, security tokens, and API keys should not appear in the URL, as this can be captured in web server logs, which makes them intrinsically valuable.
>
> - In POST/PUT requests sensitive data should be transferred in the request body or request headers.
> - In GET requests sensitive data should be transferred in an HTTP Header."

🇻🇳 **Dịch**
> "RESTful web service phải cẩn thận để tránh **rò rỉ credential**. Mật khẩu, security token và API key **không được xuất hiện trong URL**, vì chúng có thể bị ghi lại trong **log của web server**, khiến các log đó tự thân trở nên có giá trị (với kẻ tấn công).
>
> - Trong request POST/PUT, dữ liệu nhạy cảm nên được truyền trong **request body hoặc request header**.
> - Trong request GET, dữ liệu nhạy cảm nên được truyền trong một **HTTP Header**."

📖 **Nguyên văn** (ví dụ)
> "OK:
> https://example.com/resourceCollection/[ID]/action
> https://twitter.com/vanderaj/lists
>
> NOT OK:
> https://example.com/controller/123/action?apiKey=a53f435643de32 because the apiKey is in the URL."

🇻🇳 **Dịch**
> Hai URL đầu **được**: chỉ chứa định danh resource, không có bí mật. URL cuối **không được** vì `apiKey` nằm ngay trong query string — nó sẽ đi vào access log, vào lịch sử trình duyệt, và vào header `Referer` gửi sang site khác.

> [!danger] URL bị ghi lại ở rất nhiều nơi ngoài tầm kiểm soát của bạn
> Access log của web server, log của load balancer, log của CDN, lịch sử trình duyệt, bookmark, và header `Referer` khi người dùng bấm sang link ngoài. HTTPS mã hoá đường truyền nhưng **không** ngăn chính server của bạn ghi URL ra file log.

---

## B.15 HTTP Return Code

📖 **Nguyên văn**
> "HTTP defines status code. When designing REST API, don't just use 200 for success or 404 for error. Always use the semantically appropriate status code for the response.
>
> Here is a non-exhaustive selection of security related REST API status codes. Use it to ensure you return the correct code."

🇻🇳 **Dịch**
> "HTTP có định nghĩa status code. Khi thiết kế REST API, **đừng chỉ dùng 200 cho thành công hay 404 cho lỗi**. Hãy **luôn dùng status code đúng về mặt ngữ nghĩa** cho response.
>
> Dưới đây là một tuyển chọn (không đầy đủ) các status code của REST API liên quan tới bảo mật. Dùng nó để bảo đảm bạn trả về đúng mã."

📖 **Nguyên văn** (bảng status code)

| Code | Message | Description |
|---|---|---|
| 200 | OK | "Response to a successful REST API action. The HTTP method can be GET, POST, PUT, PATCH or DELETE." |
| 201 | Created | "The request has been fulfilled and resource created. A URI for the created resource is returned in the Location header." |
| 202 | Accepted | "The request has been accepted for processing, but processing is not yet complete." |
| 301 | Moved Permanently | "Permanent redirection." |
| 304 | Not Modified | "Caching related response that returned when the client has the same copy of the resource as the server." |
| 307 | Temporary Redirect | "Temporary redirection of resource." |
| 400 | Bad Request | "The request is malformed, such as message body format error." |
| 401 | Unauthorized | "Wrong or no authentication ID/password provided." |
| 403 | Forbidden | "It's used when the authentication succeeded but authenticated user doesn't have permission to the request resource." |
| 404 | Not Found | "When a non-existent resource is requested." |
| 405 | Method Not Acceptable | "The error for an unexpected HTTP method. For example, the REST API is expecting HTTP GET, but HTTP PUT is used." |
| 406 | Unacceptable | "The client presented a content type in the Accept header which is not supported by the server API." |
| 413 | Payload too large | "Use it to signal that the request size exceeded the given limit e.g. regarding file uploads." |
| 415 | Unsupported Media Type | "The requested content type is not supported by the REST service." |
| 429 | Too Many Requests | "The error is used when there may be DOS attack detected or the request is rejected due to rate limiting." |
| 500 | Internal Server Error | "An unexpected condition prevented the server from fulfilling the request. Be aware that the response should not reveal internal  information that helps an attacker, e.g. detailed error messages or  stack traces." |
| 501 | Not Implemented | "The REST service does not implement the requested operation yet." |
| 503 | Service Unavailable | "The REST service is temporarily unable to process the request. Used to inform the client it should retry at a later time." |

🇻🇳 **Dịch** (các mã trọng yếu về bảo mật)

| Code | Ý nghĩa theo OWASP |
|---|---|
| **401** Unauthorized | Cung cấp **sai hoặc không cung cấp** ID/mật khẩu xác thực. → *bạn là ai, tôi chưa biết* |
| **403** Forbidden | Dùng khi **authentication đã thành công** nhưng người dùng đã xác thực **không có quyền** với resource được yêu cầu. → *tôi biết bạn là ai, và bạn không được phép* |
| **404** Not Found | Khi resource được yêu cầu **không tồn tại**. |
| **405** Method Not Acceptable | Lỗi cho HTTP method không mong đợi. Ví dụ REST API đang chờ GET nhưng lại nhận PUT. |
| **406** Unacceptable | Client đưa ra một content type trong header `Accept` mà server API **không hỗ trợ**. |
| **413** Payload too large | Báo hiệu kích thước request **vượt quá giới hạn** cho trước, ví dụ với upload file. |
| **415** Unsupported Media Type | Content type được yêu cầu **không được** REST service hỗ trợ. |
| **429** Too Many Requests | Dùng khi **có thể đã phát hiện tấn công DOS** hoặc request bị từ chối vì **rate limiting**. |
| **500** Internal Server Error | Một điều kiện bất ngờ khiến server không hoàn thành được request. **Lưu ý response không được tiết lộ thông tin nội bộ giúp ích cho kẻ tấn công**, ví dụ thông điệp lỗi chi tiết hay stack trace. |
| **503** Service Unavailable | REST service **tạm thời** không xử lý được request. Dùng để báo client nên thử lại sau. |

> [!danger] Phân biệt 401 và 403 — và biết khi nào nên nói dối bằng 404
> Theo OWASP: 401 = chưa xác thực được; 403 = xác thực xong nhưng không có quyền. Nhưng chú ý tác dụng phụ: trả 403 cho `/orders/12345` **xác nhận rằng đơn 12345 tồn tại**. Với resource nhạy cảm, nhiều đội chọn trả 404 để không rò rỉ sự tồn tại. *(Câu cuối là nhận định thực hành, không nằm trong cheat sheet.)*

📖 **Nguyên văn**
> "Additional information about HTTP return code usage in REST API can be found here and here."

🇻🇳 **Dịch**
> "Thông tin bổ sung về cách dùng HTTP return code trong REST API có thể xem tại các liên kết dẫn trong cheat sheet."

Chi tiết đầy đủ về status code và thiết kế body lỗi: [[04 - HTTP Status Code và thiết kế lỗi]].

---

## B.16 Bối cảnh rộng hơn: OWASP API Security Top 10 (2023)

> [!note] Về URL của nguồn này
> URL `https://owasp.org/API-Security/editions/2023/en/0x11-t10/` **trả về 404** tại thời điểm viết bài (nó redirect 308 sang bản không có dấu `/` cuối, rồi 404). Trang chính thức còn sống của dự án là **`https://owasp.org/www-project-api-security/`**, và chính trang đó đăng đầy đủ danh sách 2023 kèm mô tả. Các trích dẫn dưới đây lấy nguyên văn từ trang này.

📖 **Nguyên văn**
> "API1:2023 - Broken Object Level Authorization
> APIs tend to expose endpoints that handle object identifiers, creating a wide attack surface of Object Level Access Control issues. Object level authorization checks should be considered in every function that accesses a data source using an ID from the user."

🇻🇳 **Dịch**
> "**API1:2023 — Broken Object Level Authorization.** API có xu hướng phơi ra các endpoint xử lý **định danh object**, tạo nên một bề mặt tấn công rộng về vấn đề Object Level Access Control. Việc kiểm tra authorization **ở mức object** cần được cân nhắc trong **mọi hàm** truy cập nguồn dữ liệu bằng một ID đến từ người dùng."

> [!danger] Đây là rủi ro số 1
> Đổi `/orders/1001` thành `/orders/1002` và đọc được đơn của người khác. Đơn giản đến mức khó tin, và vẫn đứng đầu bảng.

📖 **Nguyên văn**
> "API2:2023 - Broken Authentication
> Authentication mechanisms are often implemented incorrectly, allowing attackers to compromise authentication tokens or to exploit implementation flaws to assume other user’s identities temporarily or permanently. Compromising a system’s ability to identify the client/user, compromises API security overall."

🇻🇳 **Dịch**
> "**API2:2023 — Broken Authentication.** Cơ chế authentication thường bị hiện thực sai, cho phép kẻ tấn công chiếm đoạt authentication token hoặc khai thác lỗi hiện thực để **mạo danh người dùng khác**, tạm thời hoặc vĩnh viễn. Phá hỏng khả năng nhận diện client/user của hệ thống là phá hỏng toàn bộ bảo mật API."

📖 **Nguyên văn**
> "API3:2023 - Broken Object Property Level Authorization
> This category combines API3:2019 Excessive Data Exposure and API6:2019 - Mass Assignment, focusing on the root cause: the lack of or improper authorization validation at the object property level. This leads to information exposure or manipulation by unauthorized parties."

🇻🇳 **Dịch**
> "**API3:2023 — Broken Object Property Level Authorization.** Hạng mục này gộp API3:2019 (Excessive Data Exposure) và API6:2019 (Mass Assignment), tập trung vào nguyên nhân gốc: **thiếu hoặc sai việc kiểm tra authorization ở mức thuộc tính của object**. Điều này dẫn tới lộ thông tin hoặc bị bên không có thẩm quyền thao túng dữ liệu."

📖 **Nguyên văn**
> "API4:2023 - Unrestricted Resource Consumption
> Satisfying API requests requires resources such as network bandwidth, CPU, memory, and storage. Other resources such as emails/SMS/phone calls or biometrics validation are made available by service providers via API integrations, and paid for per request. Successful attacks can lead to Denial of Service or an increase of operational costs."

🇻🇳 **Dịch**
> "**API4:2023 — Unrestricted Resource Consumption.** Đáp ứng request API cần tài nguyên như băng thông mạng, CPU, bộ nhớ và lưu trữ. Các tài nguyên khác như email/SMS/cuộc gọi hay xác thực sinh trắc học được nhà cung cấp dịch vụ cấp qua tích hợp API và **tính tiền theo từng request**. Tấn công thành công có thể dẫn tới Denial of Service hoặc **tăng chi phí vận hành**."

📖 **Nguyên văn**
> "API5:2023 - Broken Function Level Authorization
> Complex access control policies with different hierarchies, groups, and roles, and an unclear separation between administrative and regular functions, tend to lead to authorization flaws. By exploiting these issues, attackers can gain access to other users’ resources and/or administrative functions."

🇻🇳 **Dịch**
> "**API5:2023 — Broken Function Level Authorization.** Các chính sách access control phức tạp với nhiều tầng phân cấp, nhóm và role khác nhau, cộng với **ranh giới không rõ ràng giữa chức năng quản trị và chức năng thường**, hay dẫn tới lỗ hổng authorization. Khai thác được, kẻ tấn công có thể truy cập resource của người dùng khác và/hoặc các chức năng quản trị."

📖 **Nguyên văn**
> "API6:2023 - Unrestricted Access to Sensitive Business Flows
> APIs vulnerable to this risk expose a business flow - such as buying a ticket, or posting a comment - without compensating for how the functionality could harm the business if used excessively in an automated manner. This doesn’t necessarily come from implementation bugs."

🇻🇳 **Dịch**
> "**API6:2023 — Unrestricted Access to Sensitive Business Flows.** API dính rủi ro này phơi ra một luồng nghiệp vụ — như mua vé hay đăng bình luận — mà **không tính tới việc chức năng đó có thể gây hại cho doanh nghiệp nếu bị dùng quá mức theo cách tự động**. Rủi ro này **không nhất thiết đến từ bug hiện thực**."

> [!warning] Không phải bug, mà là thiếu suy nghĩ về lạm dụng
> Ví dụ: bot mua sạch vé concert trong 3 giây. Từng request đều hợp lệ, đều có quyền. Cái sai là chưa từng ai hỏi "nếu có người gọi cái này 10.000 lần/phút thì sao?".

📖 **Nguyên văn**
> "API7:2023 - Server Side Request Forgery
> Server-Side Request Forgery (SSRF) flaws can occur when an API is fetching a remote resource without validating the user-supplied URI. This enables an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall or a VPN."

🇻🇳 **Dịch**
> "**API7:2023 — Server Side Request Forgery.** Lỗ hổng SSRF có thể xảy ra khi một API **fetch một resource từ xa mà không validate URI do người dùng cung cấp**. Điều này cho phép kẻ tấn công ép ứng dụng gửi một request được dựng sẵn tới **đích không mong đợi**, kể cả khi được bảo vệ bởi firewall hay VPN."

📖 **Nguyên văn**
> "API8:2023 - Security Misconfiguration
> APIs and the systems supporting them typically contain complex configurations, meant to make the APIs more customizable. Software and DevOps engineers can miss these configurations, or don’t follow security best practices when it comes to configuration, opening the door for different types of attacks."

🇻🇳 **Dịch**
> "**API8:2023 — Security Misconfiguration.** API và các hệ thống hỗ trợ chúng thường có cấu hình phức tạp, nhằm giúp API tuỳ biến được nhiều hơn. Kỹ sư phần mềm và DevOps có thể **bỏ sót** các cấu hình này, hoặc không theo best practice bảo mật khi cấu hình, mở cửa cho nhiều kiểu tấn công."

📖 **Nguyên văn**
> "API9:2023 - Improper Inventory Management
> APIs tend to expose more endpoints than traditional web applications, making proper and updated documentation highly important. A proper inventory of hosts and deployed API versions also are important to mitigate issues such as deprecated API versions and exposed debug endpoints."

🇻🇳 **Dịch**
> "**API9:2023 — Improper Inventory Management.** API có xu hướng phơi ra **nhiều endpoint hơn** ứng dụng web truyền thống, khiến tài liệu đúng và cập nhật trở nên rất quan trọng. Một **danh mục (inventory)** chuẩn về các host và các phiên bản API đã deploy cũng quan trọng để giảm thiểu vấn đề như **phiên bản API đã bị loại bỏ** và **debug endpoint bị phơi ra**."

> [!tip] Đây là chỗ [[08 - OpenAPI Specification]] trả nợ
> Một file OpenAPI được sinh tự động và kiểm tra trong CI chính là cái "inventory" mà API9 đang nói tới. Không có nó, chẳng ai biết `/v1/internal/export` còn sống hay không.

📖 **Nguyên văn**
> "API10:2023 - Unsafe Consumption of APIs
> Developers tend to trust data received from third-party APIs more than user input, and so tend to adopt weaker security standards. In order to compromise APIs, attackers go after integrated third-party services instead of trying to compromise the target API directly."

🇻🇳 **Dịch**
> "**API10:2023 — Unsafe Consumption of APIs.** Lập trình viên có xu hướng **tin dữ liệu nhận từ API bên thứ ba hơn là input của người dùng**, nên áp dụng tiêu chuẩn bảo mật lỏng hơn. Để xâm nhập API, kẻ tấn công nhắm vào **các dịch vụ bên thứ ba đã tích hợp** thay vì cố tấn công trực tiếp API đích."

> [!danger] "Đừng tin input" áp dụng cho cả API đối tác
> Response từ một API bên ngoài cũng là input. Nó cũng phải qua validate content type (B.8) và input validation (B.7) như bất kỳ dữ liệu nào từ người lạ.

---

# PHẦN C — Chuyển tiếp sang đợt B: Authentication

Xuyên suốt Phần B, OWASP liên tục chạm vào xác thực nhưng đẩy chi tiết sang nơi khác: mục **Access Control** nói "user authentication should be centralised in a Identity Provider (IdP), which issues access tokens"; mục **JWT** chỉ liệt kê các claim cần verify rồi trỏ sang JSON Web Token Cheat Sheet; mục **API Keys** cảnh báo "Do not rely exclusively on API keys". Còn **API2:2023 Broken Authentication** thì nói thẳng rằng phá được khả năng nhận diện người dùng là phá được toàn bộ bảo mật API.

Nói cách khác: **authentication là một chủ đề đủ lớn để đứng riêng**, và bài này cố tình không đào sâu. Nó sẽ là nội dung của đợt B — thư mục `B - Authentication` — gồm: JWT (cấu trúc, ký/verify, `alg` confusion, vòng đời và revoke), **OAuth 2.0** (authorization framework, các grant type), **OpenID Connect** (lớp identity dựng trên OAuth 2.0), **SAML**, và các mô hình session/token trong thực tế.

Khi học đợt B, hãy quay lại B.2 và B.3 của bài này — chúng là bản tóm tắt "cần làm gì" ở mức API; đợt B sẽ giải thích "làm bằng cách nào".

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

Vài mục trong Phần B ánh xạ trực tiếp vào công việc hằng ngày với Shopify app + Firebase/GCP:

- **B.1 HTTPS** — Cloud Run và Firebase Hosting phục vụ qua HTTPS mặc định, nên phần "chỉ HTTPS" gần như miễn phí. Cái cần tự làm là B.14: đừng nhét token vào query string, vì Cloud Logging sẽ ghi lại URL đầy đủ trong request log.
- **B.2 Access control tại từng endpoint** — với app Shopify, mỗi request từ admin/app proxy phải được xác minh rồi **vẫn phải** kiểm tra shop đó có quyền trên bản ghi đang đụng tới. Một hàm Cloud Function đã "đăng nhập được" không đồng nghĩa với "được đọc bản ghi này" — đúng tinh thần API1:2023.
- **B.10 Error handling + B.15 mã 500** — mặc định nhiều framework Node trả stack trace khi `NODE_ENV` không phải `production`. Đây là lỗi cấu hình hay gặp nhất khi deploy vội.
- **B.13 CORS** — app block/extension chạy trên domain storefront của merchant, tức mỗi merchant là một origin khác nhau. Đây đúng là tình huống "as specific as possible and as general as necessary" mà OWASP nói: cần cơ chế allowlist động theo shop, không phải `*`.
- **B.16 API9 Improper Inventory Management** — endpoint debug/admin quên tắt trong một service Cloud Run cũ là rủi ro thật, vì Cloud Run cấp URL công khai mặc định cho mỗi revision.

---

## Liên kết

- Bài kế: [[10 - Authentication vs Authorization]] (sang đợt B — Authentication)
- Bài trước: [[08 - OpenAPI Specification]]
- [[01 - API là gì và nền tảng HTTP]] — nền HTTP mà cả REST, SOAP, gRPC, GraphQL đều đứng lên
- [[02 - REST]] — chi tiết 6 constraint của REST, bài này chỉ trích lại phần liên quan tới so sánh
- [[03 - JSON và JSON-API]] — định dạng dữ liệu phổ biến nhất của REST và GraphQL
- [[04 - HTTP Status Code và thiết kế lỗi]] — chi tiết status code; đối chiếu với bảng B.15
- [[05 - SOAP]] — envelope, header block, SOAP Fault
- [[06 - gRPC và Protocol Buffers]] — `.proto`, stub, 4 kiểu streaming
- [[07 - GraphQL]] — schema, query/mutation/subscription, introspection
- [[08 - OpenAPI Specification]] — contract cho REST; cũng là lời giải cho API9:2023
- [[02 - What is HTTP]] — HTTP cơ bản đã học ở phần 01
- [[13 - SQL Injection và Parameterized Query]] — liên quan trực tiếp mục B.7 Input validation
- [[07 - N+1 Problem]] — cái giá phải trả phía server khi chọn GraphQL
- [[11 - NULL, Hàm String, Date và JSON]] — JSON/JSONB ở tầng database

## Nguồn tham khảo

- Fielding, R.T. — *Architectural Styles and the Design of Network-based Software Architectures*, Chapter 5: Representational State Transfer (REST) : https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- W3C — *SOAP Version 1.2 Part 1: Messaging Framework (Second Edition)*, W3C Recommendation : https://www.w3.org/TR/soap12-part1/
- W3C — *Web Services Description Language (WSDL) Version 2.0 Part 1: Core Language*, W3C Recommendation : https://www.w3.org/TR/wsdl20/
- gRPC — *Introduction to gRPC* : https://grpc.io/docs/what-is-grpc/introduction/
- gRPC — *Core concepts, architecture and lifecycle* : https://grpc.io/docs/what-is-grpc/core-concepts/
- gRPC — *Frequently Asked Questions* : https://grpc.io/docs/what-is-grpc/faq/
- Protocol Buffers — *Overview* : https://protobuf.dev/overview/
- GraphQL — *GraphQL Specification, October 2021 Edition* : https://spec.graphql.org/October2021/
- GraphQL — *Learn: Serving over HTTP* : https://graphql.org/learn/serving-over-http/
- GraphQL — *Learn: Caching* : https://graphql.org/learn/caching/
- IETF — *RFC 9110: HTTP Semantics* : https://www.rfc-editor.org/rfc/rfc9110.txt
- OWASP — *REST Security Cheat Sheet* : https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- OWASP — *API Security Project (API Security Top 10 2023)* : https://owasp.org/www-project-api-security/
