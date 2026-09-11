# 17 — SAML (Security Assertion Markup Language)

> **Nguồn chính:** OASIS *Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0* (saml-core-2.0-os, 15 March 2005) — https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf
> Kèm *SAML V2.0 Technical Overview* (sstc-saml-tech-overview-2.0, 25 March 2008), *Bindings*, *Profiles* và *OWASP SAML Security Cheat Sheet*.
> Bài này bám mục: assertion, ba loại statement, ba tầng protocol/binding/profile, Web Browser SSO Profile, XML Signature, và rủi ro bảo mật.

> [!note] Bài này viết theo tinh thần "hiểu đủ để tích hợp"
> SAML 2.0 là chuẩn từ 2005, dựa trên XML, sinh ra cùng thời với [[05 - SOAP]]. Nó vẫn là chuẩn thống trị cho SSO trong doanh nghiệp lớn. Mục tiêu ở đây là hiểu đủ các khái niệm và luồng để tích hợp khi khách hàng doanh nghiệp yêu cầu — không đi sâu vào toàn bộ XML schema của spec (86 trang riêng cho Core).

---

## 1. SAML là gì

📖 **Nguyên văn** — SAML Core 2.0, §1 Introduction

> "The Security Assertion Markup Language (SAML) defines the syntax and processing semantics of assertions made about a subject by a system entity. In the course of making, or relying upon such assertions, SAML system entities may use other protocols to communicate either regarding an assertion itself, or the subject of an assertion. This specification defines both the structure of SAML assertions, and an associated set of protocols, in addition to the processing rules involved in managing a SAML system."

🇻🇳 **Dịch**

> "Security Assertion Markup Language (SAML) định nghĩa cú pháp và ngữ nghĩa xử lý của các assertion được đưa ra về một subject bởi một system entity. Trong quá trình tạo ra, hoặc dựa vào những assertion đó, các SAML system entity có thể dùng các protocol khác để trao đổi về chính assertion đó, hoặc về subject của assertion. Spec này định nghĩa cả cấu trúc của SAML assertion, lẫn một tập protocol đi kèm, cùng với các quy tắc xử lý liên quan tới việc vận hành một hệ thống SAML."

📖 **Nguyên văn** — SAML Core 2.0, §1 Introduction (đoạn tiếp)

> "SAML assertions and protocol messages are encoded in XML [XML] and use XML namespaces [XMLNS]. They are typically embedded in other structures for transport, such as HTTP POST requests or XML-encoded SOAP messages."

🇻🇳 **Dịch**

> "SAML assertion và protocol message được mã hoá bằng XML và dùng XML namespace. Chúng thường được nhúng vào các cấu trúc khác để vận chuyển, ví dụ HTTP POST request hoặc SOAP message mã hoá bằng XML."

📖 **Nguyên văn** — SAML Technical Overview, §2 Overview

> "The OASIS Security Assertion Markup Language (SAML) standard defines an XML-based framework for describing and exchanging security information between on-line business partners. This security information is expressed in the form of portable SAML assertions that applications working across security domain boundaries can trust. The OASIS SAML standard defines precise syntax and rules for requesting, creating, communicating, and using these SAML assertions."

🇻🇳 **Dịch**

> "Chuẩn OASIS Security Assertion Markup Language (SAML) định nghĩa một framework dựa trên XML để mô tả và trao đổi thông tin bảo mật giữa các đối tác kinh doanh trực tuyến. Thông tin bảo mật này được biểu diễn dưới dạng các SAML assertion khả chuyển mà các ứng dụng làm việc xuyên qua ranh giới các security domain có thể tin cậy. Chuẩn OASIS SAML định nghĩa cú pháp và quy tắc chính xác để request, tạo, truyền và sử dụng các SAML assertion này."

💡 **Ví dụ đời sống — thẻ nhân viên của toà nhà**

Bạn vào làm ở một công ty trong một toà nhà văn phòng. Phòng nhân sự phát cho bạn **một** thẻ nhân viên. Cái thẻ đó quẹt được ở cửa văn phòng, ở căng tin tầng trệt, ở barrier bãi xe, và ở phòng gym tầng hầm.

- Căng tin **không tự phát thẻ riêng**, bãi xe cũng không, phòng gym cũng không. Họ chỉ cần tin phòng nhân sự.
- Phòng nhân sự là **Identity Provider (IdP)** — nơi duy nhất xác minh "anh này đúng là nhân viên công ty X".
- Căng tin, bãi xe, phòng gym là các **Service Provider (SP)** — mỗi nơi chỉ hỏi "thẻ này thật không, của ai, còn hạn không", rồi tự quyết định cho làm gì (nhân viên thường được ăn trưa; chỉ quản lý mới vào được phòng họp VIP).
- Cái thẻ — mảnh thông tin có dấu xác nhận của phòng nhân sự, có hạn sử dụng, ghi rõ phát cho ai — chính là **assertion**.

Đó là **single sign-on (SSO)**: xác thực một lần ở một chỗ, dùng được ở nhiều dịch vụ độc lập.

---

## 2. Vì sao SAML ra đời: bài toán multi-domain SSO

📖 **Nguyên văn** — SAML Technical Overview, §2.1 Drivers of SAML Adoption

> "Single Sign-On: Over the years, various products have been marketed with the claim of providing support for web-based SSO. These products have typically relied on browser cookies to maintain user authentication state information so that re-authentication is not required each time the web user accesses the system. However, since browser cookies are never transmitted between DNS domains, the authentication state information in the cookies from one domain is never available to another domain. Therefore, these products have typically supported multi-domain SSO (MDSSO) through the use of proprietary mechanisms to pass the authentication state information between the domains. While the use of a single vendor's product may sometimes be viable within a single enterprise, business partners usually have heterogeneous environments that make the use of proprietary protocols impractical for MDSSO. SAML solves the MDSSO problem by providing a standard vendor-independent grammar and protocol for transferring information about a user from one web server to another independent of the server DNS domains."

🇻🇳 **Dịch**

> "Single Sign-On: Qua nhiều năm, nhiều sản phẩm được tiếp thị với tuyên bố hỗ trợ SSO trên nền web. Các sản phẩm này thường dựa vào browser cookie để lưu trạng thái authentication của user, nhờ đó không phải xác thực lại mỗi lần user truy cập hệ thống. Tuy nhiên, vì browser cookie không bao giờ được gửi giữa các DNS domain khác nhau, thông tin trạng thái authentication trong cookie của domain này không bao giờ dùng được ở domain khác. Do đó các sản phẩm này thường hỗ trợ multi-domain SSO (MDSSO) bằng các cơ chế độc quyền để chuyển trạng thái authentication giữa các domain. Việc dùng sản phẩm của một hãng duy nhất đôi khi khả thi trong nội bộ một doanh nghiệp, nhưng các đối tác kinh doanh thường có môi trường không đồng nhất, khiến việc dùng protocol độc quyền trở nên bất khả thi cho MDSSO. SAML giải quyết bài toán MDSSO bằng cách cung cấp một ngữ pháp và protocol chuẩn, độc lập với nhà cung cấp, để chuyển thông tin về một user từ web server này sang web server khác, bất kể DNS domain của server."

> [!tip] Điểm mấu chốt
> Cookie không đi xuyên DNS domain — đó là lý do kỹ thuật gốc rễ khiến SSO liên miền cần một chuẩn riêng. SAML chuyển trạng thái xác thực qua **browser**, dưới dạng một tài liệu XML có chữ ký, thay vì qua cookie chung.

---

## 3. Các vai trò trong một giao dịch SAML

📖 **Nguyên văn** — SAML Technical Overview, §3.1 SAML Participants

> "Who are the participants involved in a SAML interaction? At a minimum, SAML exchanges take place between system entities referred to as a SAML asserting party and a SAML relying party. In many SAML use cases, a user, perhaps running a web browser or executing a SAML-enabled application, is also a participant, and may even be the asserting party.
> An asserting party is a system entity that makes SAML assertions. It is also sometimes called a SAML authority. A relying party is a system entity that uses assertions it has received. When a SAML asserting or relying party makes a direct request to another SAML entity, the party making the request is called a SAML requester, and the other party is referred to as a SAML responder. A replying party's willingness to rely on information from an asserting party depends on the existence of a trust relationship with the asserting party."

🇻🇳 **Dịch**

> "Ai là những bên tham gia trong một tương tác SAML? Ở mức tối thiểu, trao đổi SAML diễn ra giữa các system entity gọi là SAML asserting party và SAML relying party. Trong nhiều use case SAML, một user — có thể đang dùng web browser hoặc chạy một ứng dụng hỗ trợ SAML — cũng là một bên tham gia, và thậm chí có thể chính là asserting party.
> Một asserting party là một system entity tạo ra các SAML assertion. Nó đôi khi cũng được gọi là SAML authority. Một relying party là một system entity sử dụng các assertion mà nó nhận được. Khi một asserting party hoặc relying party gửi request trực tiếp tới một SAML entity khác, bên gửi request gọi là SAML requester, bên kia gọi là SAML responder. Sự sẵn lòng của relying party trong việc tin vào thông tin từ asserting party phụ thuộc vào việc có tồn tại một quan hệ tin cậy (trust relationship) với asserting party hay không."

### 3.1 Identity Provider và Service Provider

📖 **Nguyên văn** — SAML Technical Overview, §3.1

> "SAML system entities can operate in a variety of SAML roles which define the SAML services and protocol messages they will use and the types of assertions they will generate or consume. For example, to support Multi-Domain Single Sign-On (MDSSO, or often just SSO), SAML defines the roles called identity provider (IdP) and service provider (SP). Another example is the attribute authority role where a SAML entity produces assertions in response to identity attribute queries from an entity acting as an attribute requester."

🇻🇳 **Dịch**

> "Các SAML system entity có thể hoạt động trong nhiều SAML role khác nhau; role định nghĩa những SAML service và protocol message mà entity đó sẽ dùng, cũng như những loại assertion nó sẽ tạo ra hoặc tiêu thụ. Ví dụ, để hỗ trợ Multi-Domain Single Sign-On (MDSSO, hay thường gọi tắt là SSO), SAML định nghĩa các role gọi là identity provider (IdP) và service provider (SP). Một ví dụ khác là role attribute authority, nơi một SAML entity tạo ra assertion để trả lời các truy vấn identity attribute từ một entity đóng vai attribute requester."

### 3.2 Subject / Principal

📖 **Nguyên văn** — SAML Technical Overview, §3.1

> "At the heart of most SAML assertions is a subject (a principal – an entity that can be authenticated – within the context of a particular security domain) about which something is being asserted. The subject could be a human but could also be some other kind of entity, such as a company or a computer. The terms subject and principal tend to be used interchangeably in this document.
> A typical assertion from an identity provider might convey information such as "This user is John Doe, he has an email address of john.doe@example.com, and he was authenticated into this system using a password mechanism." A service provider could choose to use this information, depending on its access policies, to grant John Doe web SSO access to local resources."

🇻🇳 **Dịch**

> "Trung tâm của hầu hết SAML assertion là một subject (một principal – một entity có thể được authenticate – trong ngữ cảnh của một security domain cụ thể) mà điều gì đó đang được khẳng định về nó. Subject có thể là một con người, nhưng cũng có thể là một loại entity khác, ví dụ một công ty hay một máy tính. Trong tài liệu này, thuật ngữ subject và principal thường được dùng thay thế cho nhau.
> Một assertion điển hình từ identity provider có thể chuyển tải thông tin kiểu: 'User này là John Doe, anh ta có email john.doe@example.com, và anh ta đã được xác thực vào hệ thống này bằng cơ chế password.' Service provider có thể chọn dùng thông tin này, tuỳ theo access policy của nó, để cấp cho John Doe quyền truy cập SSO tới các resource nội bộ."

> [!note] Authentication vs authorization
> Quan sát kỹ câu trích trên: IdP nói **"anh ta được xác thực bằng password"** (authentication — bạn là ai). SP là bên **"tuỳ theo access policy của nó"** quyết định cho truy cập gì (authorization — bạn được làm gì). SAML mang cả hai loại thông tin, nhưng chúng là hai tầng tách biệt. Xem thêm [[09 - So sánh API Styles và REST Security]].

| Vai trò | Trong ví dụ thẻ nhân viên | Trong SAML |
|---|---|---|
| Asserting party / SAML authority | Phòng nhân sự phát thẻ | **Identity Provider (IdP)** — tạo assertion |
| Relying party | Căng tin, bãi xe, phòng gym | **Service Provider (SP)** — tiêu thụ assertion |
| Subject / Principal | Bạn — người cầm thẻ | `<Subject>` trong assertion |
| Trust relationship | Các nơi tin phòng nhân sự | Trao đổi metadata + certificate trước |
| User agent | — | Trình duyệt, đóng vai trung gian chuyển message |

---

## 4. Bốn khối xây dựng: Assertion, Protocol, Binding, Profile

Đây là cấu trúc phân tầng đặc trưng nhất của SAML. Hiểu bốn tầng này là hiểu được 80% spec.

📖 **Nguyên văn** — SAML Technical Overview, §4.1 Basic Concepts

> "SAML assertions carry statements about a principal that an asserting party claims to be true. The valid structure and contents of an assertion are defined by the SAML assertion XML schema. Assertions are usually created by an asserting party based on a request of some sort from a relying party, although under certain circumstances, the assertions can be delivered to a relying party in an unsolicited manner. SAML protocol messages are used to make the SAML-defined requests and return appropriate responses. The structure and contents of these messages are defined by the SAML-defined protocol XML schema.
> The means by which lower-level communication or messaging protocols (such as HTTP or SOAP) are used to transport SAML protocol messages between participants is defined by the SAML bindings. Next, SAML profiles are defined to satisfy a particular business use case, for example the Web Browser SSO profile. Profiles typically define constraints on the contents of SAML assertions, protocols, and bindings in order to solve the business use case in an interoperable fashion."

🇻🇳 **Dịch**

> "SAML assertion mang các statement về một principal mà asserting party khẳng định là đúng. Cấu trúc và nội dung hợp lệ của một assertion được định nghĩa bởi SAML assertion XML schema. Assertion thường được asserting party tạo ra dựa trên một request nào đó từ relying party, mặc dù trong một số hoàn cảnh, assertion có thể được gửi tới relying party theo kiểu không được yêu cầu trước (unsolicited). SAML protocol message được dùng để tạo ra các request do SAML định nghĩa và trả về response phù hợp. Cấu trúc và nội dung của các message này được định nghĩa bởi protocol XML schema của SAML.
> Cách thức mà các protocol truyền thông/nhắn tin ở tầng thấp hơn (như HTTP hay SOAP) được dùng để vận chuyển SAML protocol message giữa các bên tham gia được định nghĩa bởi các SAML binding. Tiếp theo, các SAML profile được định nghĩa để đáp ứng một business use case cụ thể, ví dụ Web Browser SSO profile. Profile thường định nghĩa các ràng buộc lên nội dung của SAML assertion, protocol và binding nhằm giải quyết business use case đó theo cách có tính liên thông (interoperable)."

```
┌──────────────────────────────────────────────┐
│ PROFILE   — "giải bài toán nghiệp vụ nào"    │  Web Browser SSO, ECP,
│                                              │  Single Logout, ...
├──────────────────────────────────────────────┤
│ BINDING   — "đi trên phương tiện nào"        │  HTTP Redirect, HTTP POST,
│                                              │  HTTP Artifact, SOAP, PAOS, URI
├──────────────────────────────────────────────┤
│ PROTOCOL  — "hỏi/đáp cái gì"                 │  AuthnRequest, Single Logout,
│                                              │  Assertion Query, Artifact Resolution...
├──────────────────────────────────────────────┤
│ ASSERTION — "nội dung khẳng định"            │  Authn / Attribute /
│                                              │  AuthzDecision statement
└──────────────────────────────────────────────┘
```

🇻🇳 Sơ đồ tự vẽ để tóm tắt bốn tầng theo đúng thứ tự spec mô tả (assertion → protocol → binding → profile); tên các thành phần trong mỗi tầng lấy nguyên từ §4.3 Technical Overview trích ở dưới.

### 4.1 Protocols

📖 **Nguyên văn** — SAML Technical Overview, §4.3 SAML Components

> "Protocols: SAML defines a number of generalized request/response protocols:
> - Authentication Request Protocol: Defines a means by which a principal (or an agent acting on behalf of the principal) can request assertions containing authentication statements and, optionally, attribute statements. The Web Browser SSO Profile uses this protocol when redirecting a user from an SP to an IdP when it needs to obtain an assertion in order to establish a security context for the user at the SP.
> - Single Logout Protocol: Defines a mechanism to allow near-simultaneous logout of active sessions associated with a principal. The logout can be directly initiated by the user, or initiated by an IdP or SP because of a session timeout, administrator command, etc.
> - Assertion Query and Request Protocol: Defines a set of queries by which SAML assertions may be obtained. The Request form of this protocol can ask an asserting party for an existing assertion by referring to its assertion ID. The Query form of this protocol defines how a relying party can ask for assertions (new or existing) on the basis of a specific subject and the desired statement type.
> - Artifact Resolution Protocol: Provides a mechanism by which SAML protocol messages may be passed by reference using a small, fixed-length value called an artifact. The artifact receiver uses the Artifact Resolution Protocol to ask the message creator to dereference the artifact and return the actual protocol message.
> - Name Identifier Management Protocol: Provides mechanisms to change the value or format of the name identifier used to refer to a principal.
> - Name Identifier Mapping Protocol: Provides a mechanism to programmatically map one SAML name identifier into another, subject to appropriate policy controls."

🇻🇳 **Dịch**

> "Protocol: SAML định nghĩa một số protocol request/response tổng quát:
> - **Authentication Request Protocol**: Định nghĩa cách một principal (hoặc một agent hành động thay mặt principal) có thể yêu cầu các assertion chứa authentication statement và, tuỳ chọn, attribute statement. Web Browser SSO Profile dùng protocol này khi redirect user từ SP sang IdP, lúc SP cần lấy một assertion để thiết lập security context cho user tại SP.
> - **Single Logout Protocol**: Định nghĩa cơ chế cho phép đăng xuất gần như đồng thời tất cả các session đang hoạt động gắn với một principal. Việc logout có thể do user khởi phát trực tiếp, hoặc do IdP hay SP khởi phát vì session timeout, lệnh của administrator, v.v.
> - **Assertion Query and Request Protocol**: Định nghĩa một tập truy vấn để lấy các SAML assertion. Dạng Request của protocol này có thể hỏi asserting party một assertion đã tồn tại bằng cách tham chiếu assertion ID. Dạng Query định nghĩa cách relying party yêu cầu assertion (mới hoặc đã có) dựa trên một subject cụ thể và loại statement mong muốn.
> - **Artifact Resolution Protocol**: Cung cấp cơ chế truyền SAML protocol message *bằng tham chiếu*, dùng một giá trị nhỏ, độ dài cố định gọi là artifact. Bên nhận artifact dùng Artifact Resolution Protocol để yêu cầu bên tạo message giải tham chiếu artifact và trả về protocol message thật.
> - **Name Identifier Management Protocol**: Cung cấp cơ chế thay đổi giá trị hoặc format của name identifier dùng để chỉ tới một principal.
> - **Name Identifier Mapping Protocol**: Cung cấp cơ chế ánh xạ bằng chương trình một SAML name identifier sang một cái khác, tuân theo các kiểm soát policy phù hợp."

### 4.2 Bindings

📖 **Nguyên văn** — SAML Technical Overview, §4.3

> "Bindings: SAML bindings detail exactly how the various SAML protocol messages can be carried over underlying transport protocols. The bindings defined by SAML V2.0 are:
> - HTTP Redirect Binding: Defines how SAML protocol messages can be transported using HTTP redirect messages (302 status code responses).
> - HTTP POST Binding: Defines how SAML protocol messages can be transported within the base64-encoded content of an HTML form control.
> - HTTP Artifact Binding: Defines how an artifact (described above in the Artifact Resolution Protocol) is transported from a message sender to a message receiver using HTTP. Two mechanisms are provided: either an HTML form control or a query string in the URL.
> - SAML SOAP Binding: Defines how SAML protocol messages are transported within SOAP 1.1 messages, with details about using SOAP over HTTP.
> - Reverse SOAP (PAOS) Binding: Defines a multi-stage SOAP/HTTP message exchange that permits an HTTP client to be a SOAP responder. Used in the Enhanced Client and Proxy Profile to enable clients and proxies capable of assisting in IDP discovery.
> - SAML URI Binding: Defines a means for retrieving an existing SAML assertion by resolving a URI (uniform resource identifier)."

🇻🇳 **Dịch**

> "Binding: SAML binding mô tả chính xác cách các SAML protocol message được chuyên chở trên các transport protocol nền tảng. Các binding mà SAML V2.0 định nghĩa:
> - **HTTP Redirect Binding**: Định nghĩa cách SAML protocol message được vận chuyển bằng HTTP redirect (response có status code 302).
> - **HTTP POST Binding**: Định nghĩa cách SAML protocol message được vận chuyển bên trong nội dung base64 của một HTML form control.
> - **HTTP Artifact Binding**: Định nghĩa cách một artifact (đã mô tả ở Artifact Resolution Protocol) được vận chuyển từ bên gửi tới bên nhận message qua HTTP. Có hai cơ chế: hoặc một HTML form control, hoặc query string trong URL.
> - **SAML SOAP Binding**: Định nghĩa cách SAML protocol message được vận chuyển bên trong SOAP 1.1 message, kèm chi tiết về việc dùng SOAP trên HTTP.
> - **Reverse SOAP (PAOS) Binding**: Định nghĩa một trao đổi message SOAP/HTTP nhiều giai đoạn, cho phép một HTTP client trở thành SOAP responder. Dùng trong Enhanced Client and Proxy Profile để các client và proxy có thể hỗ trợ việc IdP discovery.
> - **SAML URI Binding**: Định nghĩa cách lấy một SAML assertion đã tồn tại bằng cách resolve một URI (uniform resource identifier)."

> [!note] SOAP binding — dấu vết thời đại
> Việc SAML có hẳn một SOAP binding và một Reverse SOAP binding là bằng chứng rõ nhất về thời điểm nó ra đời. Xem [[05 - SOAP]] để hiểu envelope/SOAP body mà SAML message được nhúng vào.

### 4.3 Profiles

📖 **Nguyên văn** — SAML Technical Overview, §4.3

> "Profiles: SAML profiles define how the SAML assertions, protocols, and bindings are combined and constrained to provide greater interoperability in particular usage scenarios. Some of these profiles are examined in detail later in this document. The profiles defined by SAML V2.0 are:
> - Web Browser SSO Profile: Defines how SAML entities use the Authentication Request Protocol and SAML Response messages and assertions to achieve single sign-on with standard web browsers. It defines how the messages are used in combination with the HTTP Redirect, HTTP POST, and HTTP Artifact bindings.
> - Enhanced Client and Proxy (ECP) Profile: Defines a specialized SSO profile where specialized clients or gateway proxies can use the Reverse-SOAP (PAOS) and SOAP bindings.
> - Identity Provider Discovery Profile: Defines one possible mechanism for service providers to learn about the identity providers that a user has previously visited.
> - Single Logout Profile: Defines how the SAML Single Logout Protocol can be used with SOAP, HTTP Redirect, HTTP POST, and HTTP Artifact bindings.
> - Assertion Query/Request Profile: Defines how SAML entities can use the SAML Query and Request Protocol to obtain SAML assertions over a synchronous binding, such as SOAP.
> - Artifact Resolution Profile: Defines how SAML entities can use the Artifact Resolution Protocol over a synchronous binding, such as SOAP, to obtain the protocol message referred to by an artifact.
> - Name Identifier Management Profile: Defines how the Name Identifier Management Protocol may be used with SOAP, HTTP Redirect, HTTP POST, and HTTP Artifact bindings.
> - Name Identifier Mapping Profile: Defines how the Name Identifier Mapping Protocol uses a synchronous binding such as SOAP."

🇻🇳 **Dịch**

> "Profile: SAML profile định nghĩa cách các SAML assertion, protocol và binding được kết hợp và ràng buộc để đạt tính liên thông cao hơn trong những kịch bản sử dụng cụ thể. Các profile mà SAML V2.0 định nghĩa:
> - **Web Browser SSO Profile**: Định nghĩa cách các SAML entity dùng Authentication Request Protocol cùng các SAML Response message và assertion để đạt single sign-on với trình duyệt web tiêu chuẩn. Nó định nghĩa cách các message được dùng kết hợp với binding HTTP Redirect, HTTP POST và HTTP Artifact.
> - **Enhanced Client and Proxy (ECP) Profile**: Định nghĩa một profile SSO chuyên biệt, nơi các client hoặc gateway proxy chuyên dụng có thể dùng binding Reverse-SOAP (PAOS) và SOAP.
> - **Identity Provider Discovery Profile**: Định nghĩa một cơ chế khả dĩ để service provider biết được các identity provider mà user đã từng ghé qua.
> - **Single Logout Profile**: Định nghĩa cách Single Logout Protocol có thể dùng với binding SOAP, HTTP Redirect, HTTP POST và HTTP Artifact.
> - **Assertion Query/Request Profile**: Định nghĩa cách các SAML entity dùng SAML Query and Request Protocol để lấy SAML assertion qua một binding đồng bộ, ví dụ SOAP.
> - **Artifact Resolution Profile**: Định nghĩa cách các SAML entity dùng Artifact Resolution Protocol qua một binding đồng bộ như SOAP để lấy protocol message mà artifact tham chiếu tới.
> - **Name Identifier Management Profile**: Định nghĩa cách Name Identifier Management Protocol có thể dùng với binding SOAP, HTTP Redirect, HTTP POST và HTTP Artifact.
> - **Name Identifier Mapping Profile**: Định nghĩa cách Name Identifier Mapping Protocol dùng một binding đồng bộ như SOAP."

### 4.4 Hai khái niệm phụ nhưng phải biết: Metadata và Authentication Context

📖 **Nguyên văn** — SAML Technical Overview, §4.1

> "Metadata defines a way to express and share configuration information between SAML parties. For instance, an entity's supported SAML bindings, operational roles (IDP, SP, etc), identifier information, supporting identity attributes, and key information for encryption and signing can be expressed using SAML metadata XML documents. SAML Metadata is defined by its own XML schema."

🇻🇳 **Dịch**

> "Metadata định nghĩa cách biểu diễn và chia sẻ thông tin cấu hình giữa các bên SAML. Ví dụ: các SAML binding mà một entity hỗ trợ, các role vận hành (IdP, SP, v.v.), thông tin định danh, các identity attribute hỗ trợ, và thông tin khoá dùng cho mã hoá và ký — tất cả đều có thể được biểu diễn bằng tài liệu XML SAML metadata. SAML Metadata được định nghĩa bằng XML schema riêng của nó."

> [!tip] Metadata là thứ bạn thực sự phải trao đổi khi tích hợp
> Trong thực tế, "tích hợp SAML với khách hàng doanh nghiệp" thường quy về: khách gửi bạn **metadata XML của IdP** (entityID, SSO endpoint, certificate ký), bạn gửi lại **metadata XML của SP** (entityID, Assertion Consumer Service URL). Mọi thứ còn lại là cấu hình.

---

## 5. Assertion — trái tim của SAML

### 5.1 Element `<Assertion>`

📖 **Nguyên văn** — SAML Core 2.0, §2.3.3 Element `<Assertion>`

> "The `<Assertion>` element is of the AssertionType complex type. This type specifies the basic information that is common to all assertions, including the following elements and attributes:
> **Version [Required]**
> The version of this assertion. The identifier for the version of SAML defined in this specification is "2.0".
> **ID [Required]**
> The identifier for this assertion. It is of type xs:ID, and MUST follow the requirements specified in Section 1.3.4 for identifier uniqueness.
> **IssueInstant [Required]**
> The time instant of issue in UTC, as described in Section 1.3.3.
> **`<Issuer>` [Required]**
> The SAML authority that is making the claim(s) in the assertion. The issuer SHOULD be unambiguous to the intended relying parties.
> **`<ds:Signature>` [Optional]**
> An XML Signature that protects the integrity of and authenticates the issuer of the assertion, as described below and in Section 5.
> **`<Subject>` [Optional]**
> The subject of the statement(s) in the assertion.
> **`<Conditions>` [Optional]**
> Conditions that MUST be evaluated when assessing the validity of and/or when using the assertion.
> **`<Advice>` [Optional]**
> Additional information related to the assertion that assists processing in certain situations but which MAY be ignored by applications that do not understand the advice or do not wish to make use of it."

🇻🇳 **Dịch**

> "Element `<Assertion>` thuộc complex type AssertionType. Type này quy định thông tin cơ bản chung cho mọi assertion, gồm các element và attribute sau:
> **Version [Bắt buộc]** — Phiên bản của assertion này. Định danh phiên bản SAML định nghĩa trong spec này là "2.0".
> **ID [Bắt buộc]** — Định danh của assertion này. Kiểu xs:ID, và PHẢI tuân theo yêu cầu về tính duy nhất của identifier nêu ở Mục 1.3.4.
> **IssueInstant [Bắt buộc]** — Thời điểm phát hành theo UTC, như mô tả ở Mục 1.3.3.
> **`<Issuer>` [Bắt buộc]** — SAML authority đang đưa ra (các) khẳng định trong assertion. Issuer NÊN rõ ràng, không mơ hồ đối với các relying party dự kiến.
> **`<ds:Signature>` [Tuỳ chọn]** — Một XML Signature bảo vệ tính toàn vẹn và xác thực issuer của assertion, như mô tả bên dưới và ở Mục 5.
> **`<Subject>` [Tuỳ chọn]** — Subject của (các) statement trong assertion.
> **`<Conditions>` [Tuỳ chọn]** — Các điều kiện PHẢI được đánh giá khi thẩm định tính hợp lệ và/hoặc khi sử dụng assertion.
> **`<Advice>` [Tuỳ chọn]** — Thông tin bổ sung liên quan tới assertion, giúp ích cho việc xử lý trong một số tình huống, nhưng CÓ THỂ bị bỏ qua bởi ứng dụng không hiểu advice hoặc không muốn dùng nó."

📖 **Nguyên văn** — SAML Core 2.0, §2.3.3 (schema fragment)

```xml
<element name="Assertion" type="saml:AssertionType"/>
<complexType name="AssertionType">
   <sequence>
       <element ref="saml:Issuer"/>
       <element ref="ds:Signature" minOccurs="0"/>
       <element ref="saml:Subject" minOccurs="0"/>
       <element ref="saml:Conditions" minOccurs="0"/>
       <element ref="saml:Advice" minOccurs="0"/>
       <choice minOccurs="0" maxOccurs="unbounded">
          <element ref="saml:Statement"/>
          <element ref="saml:AuthnStatement"/>
          <element ref="saml:AuthzDecisionStatement"/>
          <element ref="saml:AttributeStatement"/>
       </choice>
   </sequence>
   <attribute name="Version" type="string" use="required"/>
   <attribute name="ID" type="ID" use="required"/>
   <attribute name="IssueInstant" type="dateTime" use="required"/>
</complexType>
```

🇻🇳 Schema fragment gốc từ spec: thứ tự element là cố định (`Issuer` → `Signature` → `Subject` → `Conditions` → `Advice`), rồi tới khối `<choice>` lặp không giới hạn chứa **ba loại statement** mà SAML định nghĩa sẵn, cộng `<Statement>` cho type mở rộng.

📖 **Nguyên văn** — SAML Core 2.0, §2.3.3

> "An assertion with no statements MUST contain a `<Subject>` element. Such an assertion identifies a principal in a manner which can be referenced or confirmed using SAML methods, but asserts no further information associated with that principal.
> Otherwise `<Subject>`, if present, identifies the subject of all of the statements in the assertion. If `<Subject>` is omitted, then the statements in the assertion apply to a subject or subjects identified in an application- or profile-specific manner."

🇻🇳 **Dịch**

> "Một assertion không có statement nào PHẢI chứa element `<Subject>`. Assertion như vậy định danh một principal theo cách có thể được tham chiếu hoặc xác nhận bằng các phương thức SAML, nhưng không khẳng định thêm thông tin nào về principal đó.
> Ngoài ra, `<Subject>`, nếu có mặt, định danh subject của **tất cả** các statement trong assertion. Nếu `<Subject>` bị bỏ đi, các statement trong assertion áp dụng cho một hoặc nhiều subject được định danh theo cách riêng của ứng dụng hoặc của profile."

### 5.2 Ba loại statement

#### (1) Authentication Statement

📖 **Nguyên văn** — SAML Core 2.0, §2.7.2 Element `<AuthnStatement>`

> "The `<AuthnStatement>` element describes a statement by the SAML authority asserting that the assertion subject was authenticated by a particular means at a particular time. Assertions containing `<AuthnStatement>` elements MUST contain a `<Subject>` element."

🇻🇳 **Dịch**

> "Element `<AuthnStatement>` mô tả một statement của SAML authority khẳng định rằng subject của assertion đã được authenticate bằng **một phương thức cụ thể** tại **một thời điểm cụ thể**. Assertion chứa element `<AuthnStatement>` PHẢI chứa element `<Subject>`."

📖 **Nguyên văn** — SAML Technical Overview, §4.3

> "Authentication statements: These are created by the party that successfully authenticated a user. At a minimum, they describe the particular means used to authenticate the user and the specific time at which the authentication took place."

🇻🇳 **Dịch**

> "Authentication statement: Được tạo ra bởi bên đã xác thực thành công một user. Ở mức tối thiểu, chúng mô tả phương thức cụ thể được dùng để xác thực user và thời điểm cụ thể mà việc xác thực diễn ra."

#### (2) Attribute Statement

📖 **Nguyên văn** — SAML Core 2.0, §2.7.3 Element `<AttributeStatement>`

> "The `<AttributeStatement>` element describes a statement by the SAML authority asserting that the assertion subject is associated with the specified attributes. Assertions containing `<AttributeStatement>` elements MUST contain a `<Subject>` element.
> It is of type AttributeStatementType, which extends StatementAbstractType with the addition of the following elements:
> `<Attribute>` or `<EncryptedAttribute>` [One or More]
> The `<Attribute>` element specifies an attribute of the assertion subject. An encrypted SAML attribute may be included with the `<EncryptedAttribute>` element."

🇻🇳 **Dịch**

> "Element `<AttributeStatement>` mô tả một statement của SAML authority khẳng định rằng subject của assertion gắn với các attribute được nêu. Assertion chứa element `<AttributeStatement>` PHẢI chứa element `<Subject>`.
> Nó thuộc type AttributeStatementType, mở rộng StatementAbstractType bằng các element sau:
> `<Attribute>` hoặc `<EncryptedAttribute>` [Một hoặc nhiều] — Element `<Attribute>` chỉ định một attribute của subject. Một SAML attribute đã mã hoá có thể được đưa vào bằng element `<EncryptedAttribute>`."

📖 **Nguyên văn** — SAML Technical Overview, §4.3

> "Attribute statements: These contain specific identifying attributes about the subject (for example, that user "John Doe" has "Gold" card status)."

🇻🇳 **Dịch**

> "Attribute statement: Chứa các attribute định danh cụ thể về subject (ví dụ: user "John Doe" có trạng thái thẻ "Gold")."

📖 **Nguyên văn** — SAML Profiles 2.0, §8.2.6 Example (X.500/LDAP Attribute Profile)

```xml
<saml:Attribute
xmlns:x500="urn:oasis:names:tc:SAML:2.0:profiles:attribute:X500"
              NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
              Name="urn:oid:2.5.4.42" FriendlyName="givenName">
       <saml:AttributeValue xsi:type="xs:string"
              x500:Encoding="LDAP">Steven</saml:AttributeValue>
</saml:Attribute>
```

🇻🇳 Ví dụ gốc trong spec Profiles: ánh xạ attribute thư mục `givenName` (OID 2.5.4.42) của subject sang một `<saml:Attribute>` với giá trị "Steven". `FriendlyName` là tên dễ đọc, `Name` mới là định danh chuẩn.

#### (3) Authorization Decision Statement

📖 **Nguyên văn** — SAML Core 2.0, §2.7.4 Element `<AuthzDecisionStatement>`

> "Note: The `<AuthzDecisionStatement>` feature has been frozen as of SAML V2.0, with no future enhancements planned. Users who require additional functionality may want to consider the eXtensible Access Control Markup Language [XACML], which offers enhanced authorization decision features.
> The `<AuthzDecisionStatement>` element describes a statement by the SAML authority asserting that a request for access by the assertion subject to the specified resource has resulted in the specified authorization decision on the basis of some optionally specified evidence. Assertions containing `<AuthzDecisionStatement>` elements MUST contain a `<Subject>` element.
> The resource is identified by means of a URI reference. In order for the assertion to be interpreted correctly and securely, the SAML authority and SAML relying party MUST interpret each URI reference in a consistent manner."

🇻🇳 **Dịch**

> "**Ghi chú:** Tính năng `<AuthzDecisionStatement>` đã bị đóng băng kể từ SAML V2.0, không có kế hoạch nâng cấp trong tương lai. Người dùng cần thêm chức năng có thể cân nhắc eXtensible Access Control Markup Language [XACML], vốn cung cấp các tính năng authorization decision nâng cao hơn.
> Element `<AuthzDecisionStatement>` mô tả một statement của SAML authority khẳng định rằng một yêu cầu truy cập của subject tới resource được nêu đã dẫn tới quyết định authorization được nêu, trên cơ sở một số bằng chứng (evidence) tuỳ chọn. Assertion chứa element `<AuthzDecisionStatement>` PHẢI chứa element `<Subject>`.
> Resource được định danh bằng một URI reference. Để assertion được diễn giải đúng và an toàn, SAML authority và SAML relying party PHẢI diễn giải mỗi URI reference theo cách nhất quán."

📖 **Nguyên văn** — SAML Technical Overview, §4.3

> "Authorization decision statements: These define something that the subject is entitled to do (for example, whether "John Doe" is permitted to buy a specified item)."

🇻🇳 **Dịch**

> "Authorization decision statement: Định nghĩa điều gì đó mà subject có quyền làm (ví dụ: "John Doe" có được phép mua một món hàng cụ thể hay không)."

> [!warning] Đừng xây hệ thống mới trên `<AuthzDecisionStatement>`
> Spec nói thẳng tính năng này **đã bị đóng băng từ SAML V2.0, không có kế hoạch phát triển thêm**, và khuyến nghị dùng XACML nếu cần authorization decision đầy đủ. Trong thực tế tích hợp SSO doanh nghiệp, bạn gần như chỉ gặp Authentication Statement và Attribute Statement.

### 5.3 `<Conditions>` — thứ bắt buộc phải kiểm tra

📖 **Nguyên văn** — SAML Core 2.0, §2.5.1.2 Attributes NotBefore and NotOnOrAfter

> "The NotBefore and NotOnOrAfter attributes specify time limits on the validity of the assertion within the context of its profile(s) of use. They do not guarantee that the statements in the assertion will be correct or accurate throughout the validity period.
> The NotBefore attribute specifies the time instant at which the validity interval begins. The NotOnOrAfter attribute specifies the time instant at which the validity interval has ended.
> If both attributes are present, the value for NotBefore MUST be less than (earlier than) the value for NotOnOrAfter."

🇻🇳 **Dịch**

> "Attribute NotBefore và NotOnOrAfter quy định giới hạn thời gian về tính hợp lệ của assertion trong ngữ cảnh (các) profile sử dụng nó. Chúng không bảo đảm rằng các statement trong assertion sẽ đúng hoặc chính xác trong suốt khoảng thời gian hợp lệ.
> Attribute NotBefore quy định thời điểm mà khoảng hợp lệ bắt đầu. Attribute NotOnOrAfter quy định thời điểm mà khoảng hợp lệ đã kết thúc.
> Nếu cả hai attribute cùng có mặt, giá trị NotBefore PHẢI nhỏ hơn (sớm hơn) giá trị NotOnOrAfter."

📖 **Nguyên văn** — SAML Core 2.0, §2.5.1.4 Elements `<AudienceRestriction>` and `<Audience>`

> "The `<AudienceRestriction>` element specifies that the assertion is addressed to one or more specific audiences identified by `<Audience>` elements. Although a SAML relying party that is outside the audiences specified is capable of drawing conclusions from an assertion, the SAML asserting party explicitly makes no representation as to accuracy or trustworthiness to such a party. It contains the following element:
> `<Audience>`
> A URI reference that identifies an intended audience. The URI reference MAY identify a document that describes the terms and conditions of audience membership. It MAY also contain the unique identifier URI from a SAML name identifier that describes a system entity.
> The audience restriction condition evaluates to Valid if and only if the SAML relying party is a member of one or more of the audiences specified."

🇻🇳 **Dịch**

> "Element `<AudienceRestriction>` quy định rằng assertion được gửi tới một hoặc nhiều audience cụ thể, được định danh bởi các element `<Audience>`. Dù một SAML relying party nằm ngoài danh sách audience vẫn có thể rút ra kết luận từ assertion, SAML asserting party tuyên bố rõ ràng là không cam kết gì về độ chính xác hay độ tin cậy đối với bên đó. Nó chứa element sau:
> `<Audience>` — Một URI reference định danh audience dự kiến. URI reference CÓ THỂ trỏ tới một tài liệu mô tả các điều khoản và điều kiện của tư cách thành viên audience. Nó CŨNG CÓ THỂ chứa URI định danh duy nhất từ một SAML name identifier mô tả một system entity.
> Điều kiện audience restriction được đánh giá là Valid **khi và chỉ khi** SAML relying party là thành viên của một hoặc nhiều audience được nêu."

💡 **Ví dụ đời sống**

`NotBefore` / `NotOnOrAfter` là **hạn sử dụng in trên thẻ**. `<Audience>` là dòng **"chỉ có giá trị tại chi nhánh Hà Nội"**. Thẻ hết hạn, hoặc mang sang chi nhánh khác — cả hai trường hợp đều phải bị từ chối, kể cả khi chữ ký trên thẻ hoàn toàn thật.

### 5.4 Một assertion thật, trích từ spec

📖 **Nguyên văn** — SAML Core 2.0, §5.4.6 Example (phần `<Assertion>`; khối `<ds:Signature>` dài đã được lược bỏ ở đây)

```xml
<Subject>
   <NameID
       Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
       scott@example.org
   </NameID>
   <SubjectConfirmation
       Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>
</Subject>
<Conditions NotBefore="2003-04-17T00:46:02Z"
       NotOnOrAfter="2003-04-17T00:51:02Z">
   <AudienceRestriction>
       <Audience>http://www.opensaml.org/SP</Audience>
   </AudienceRestriction>
</Conditions>
<AuthnStatement AuthnInstant="2003-04-17T00:46:00Z">
   <AuthnContext>
       <AuthnContextClassRef>
          urn:oasis:names:tc:SAML:2.0:ac:classes:Password
       </AuthnContextClassRef>
   </AuthnContext>
</AuthnStatement>
```

🇻🇳 Đọc từ trên xuống: subject là `scott@example.org` (định dạng email), xác nhận theo phương thức **bearer** (ai cầm assertion thì được coi là chủ sở hữu); assertion chỉ hợp lệ trong 5 phút (00:46:02 → 00:51:02) và **chỉ dành cho** audience `http://www.opensaml.org/SP`; authentication statement ghi nhận user đã xác thực lúc 00:46:00 bằng authentication context class `Password`.

Spec ghi rõ về ví dụ này:

📖 **Nguyên văn** — SAML Core 2.0, §5.4.6

> "Following is an example of a signed response containing a signed assertion. Line breaks have been added for readability; the signatures are not valid and cannot be successfully verified."

🇻🇳 **Dịch**

> "Sau đây là ví dụ một response đã ký chứa một assertion đã ký. Các dấu xuống dòng được thêm vào cho dễ đọc; các chữ ký không hợp lệ và không thể verify thành công."

---

## 6. Web Browser SSO Profile — luồng phổ biến nhất

### 6.1 Định nghĩa profile

📖 **Nguyên văn** — SAML Profiles 2.0, §4.1 Web Browser SSO Profile

> "In the scenario supported by the web browser SSO profile, a web user either accesses a resource at a service provider, or accesses an identity provider such that the service provider and desired resource are understood or implicit. The web user authenticates (or has already authenticated) to the identity provider, which then produces an authentication assertion (possibly with input from the service provider) and the service provider consumes the assertion to establish a security context for the web user. During this process, a name identifier might also be established between the providers for the principal, subject to the parameters of the interaction and the consent of the parties.
> To implement this scenario, a profile of the SAML Authentication Request protocol is used, in conjunction with the HTTP Redirect, HTTP POST and HTTP Artifact bindings.
> It is assumed that the user is using a standard commercial browser and can authenticate to the identity provider by some means outside the scope of SAML."

🇻🇳 **Dịch**

> "Trong kịch bản mà web browser SSO profile hỗ trợ, một web user hoặc truy cập một resource tại service provider, hoặc truy cập một identity provider theo cách mà service provider và resource mong muốn đã được hiểu ngầm hoặc ngầm định. Web user xác thực (hoặc đã xác thực từ trước) với identity provider; identity provider sau đó tạo ra một authentication assertion (có thể có đầu vào từ service provider), và service provider tiêu thụ assertion đó để thiết lập security context cho web user. Trong quá trình này, một name identifier cũng có thể được thiết lập giữa các provider cho principal, tuỳ theo các tham số của tương tác và sự đồng ý của các bên.
> Để hiện thực kịch bản này, một profile của SAML Authentication Request protocol được dùng, kết hợp với các binding HTTP Redirect, HTTP POST và HTTP Artifact.
> Giả định là user đang dùng một trình duyệt thương mại tiêu chuẩn và có thể xác thực với identity provider bằng một cách nào đó nằm ngoài phạm vi của SAML."

📖 **Nguyên văn** — SAML Profiles 2.0, §4.1.1 Required Information

> "Identification: urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser
> SAML Confirmation Method Identifiers: The SAML V2.0 "bearer" confirmation method identifier, urn:oasis:names:tc:SAML:2.0:cm:bearer, is used by this profile."

🇻🇳 **Dịch**

> "Định danh: urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser
> Định danh SAML Confirmation Method: Profile này dùng định danh confirmation method "bearer" của SAML V2.0, tức urn:oasis:names:tc:SAML:2.0:cm:bearer."

Sơ đồ trong spec (Figure 1, §4.1.2) mô tả sáu bước:

📖 **Nguyên văn** — SAML Profiles 2.0, Figure 1 (nhãn trong sơ đồ)

```
User Agent                     Service Provider                       Identity Provider

                                          Do I have a security context for this UA?
                                           Hm, no, so I'm going to establish one...

   1. User Agent attempts to access
    some resource at the Service Provider      2. Service Provider determines
                                               Identity Provider to use (methods vary,
                                               details not shown)

   3. <AuthnRequest> message
   issued by Service Provider to Identity Provider

   4. Identity Provider identifies Principal (methods vary, details not shown)

   5. <Response> message issued by Identity Provider to Service Provider

    6. Based on the Identity Provider's
    response identifying (or not) the Principal,
    the Service Provider either returns the resource or
    an (HTTP) error
```

🇻🇳 Nhãn gốc của sơ đồ 6 bước: (1) user agent thử truy cập resource ở SP → (2) SP xác định IdP → (3) SP phát `<AuthnRequest>` tới IdP → (4) IdP định danh principal → (5) IdP phát `<Response>` về SP → (6) SP trả resource hoặc lỗi HTTP tuỳ theo response.

### 6.2 SP-initiated vs IdP-initiated

📖 **Nguyên văn** — SAML Technical Overview, §5.1.1 Introduction

> "The Web Browser SSO Profile defines how to use SAML messages and bindings to support the web SSO use case described in section 3.2. This profile provides a wide variety of options, primarily having to do with two dimensions of choice: first whether the message flows are IdP-initiated or SP-initiated, and second, which bindings are used to deliver messages between the IdP and the SP.
> The first choice has to do with where the user starts the process of a web SSO exchange. SAML supports two general message flows to support the processes. The most common scenario for starting a web SSO exchange is the SP-initiated web SSO model which begins with the user choosing a browser bookmark or clicking a link that takes them directly to an SP application resource they need to access. However, since the user is not logged in at the SP, before it allows access to the resource, the SP sends the user to an IdP to authenticate. The IdP builds an assertion representing the user's authentication at the IdP and then sends the user back to the SP with the assertion. The SP processes the assertion and determines whether to grant the user access to the resource.
> In an IdP-initiated scenario, the user is visiting an IdP where they are already authenticated and they click on a link to a partner SP. The IdP builds an assertion representing the user's authentication state at the IdP and sends the user's browser over to the SP's assertion consumer service, which processes the assertion and creates a local security context for the user at the SP. This approach is useful in certain environments, but requires the IdP to be configured with inter-site transfer links to the SP's site. Sometimes a binding-specific field called RelayState is used to coordinate messages and actions of IdPs and SPs, for example, to allow an IdP (with which SSO was initiated) to indicate the URL of a desired resource when communicating with an SP."

🇻🇳 **Dịch**

> "Web Browser SSO Profile định nghĩa cách dùng SAML message và binding để hỗ trợ use case web SSO mô tả ở mục 3.2. Profile này cung cấp rất nhiều tuỳ chọn, chủ yếu xoay quanh hai chiều lựa chọn: thứ nhất, luồng message là IdP-initiated hay SP-initiated; thứ hai, binding nào được dùng để chuyển message giữa IdP và SP.
> Lựa chọn thứ nhất liên quan tới việc user bắt đầu quá trình trao đổi web SSO ở đâu. SAML hỗ trợ hai luồng message tổng quát. Kịch bản phổ biến nhất để khởi động một trao đổi web SSO là mô hình **SP-initiated**: bắt đầu bằng việc user chọn một bookmark trình duyệt hoặc bấm một link đưa họ thẳng tới một resource ứng dụng ở SP mà họ cần truy cập. Tuy nhiên, vì user chưa đăng nhập tại SP, trước khi cho truy cập resource, SP gửi user sang IdP để xác thực. IdP dựng một assertion biểu diễn việc user đã xác thực tại IdP rồi gửi user quay lại SP kèm assertion đó. SP xử lý assertion và quyết định có cấp quyền truy cập resource cho user hay không.
> Trong kịch bản **IdP-initiated**, user đang ở IdP nơi họ đã xác thực sẵn và họ bấm vào một link tới một SP đối tác. IdP dựng một assertion biểu diễn trạng thái xác thực của user tại IdP và gửi trình duyệt của user sang assertion consumer service của SP; service này xử lý assertion và tạo một security context cục bộ cho user tại SP. Cách tiếp cận này hữu ích trong một số môi trường, nhưng đòi hỏi IdP phải được cấu hình sẵn các inter-site transfer link trỏ tới site của SP. Đôi khi một trường đặc thù theo binding gọi là RelayState được dùng để phối hợp message và hành động giữa IdP và SP — ví dụ, để IdP (nơi SSO được khởi phát) chỉ ra URL của resource mong muốn khi giao tiếp với SP."

📖 **Nguyên văn** — SAML Technical Overview, §5.1.4 IdP-Initiated SSO: POST Binding

> "In addition to supporting the new SP-Initiated web SSO use cases, SAML v2 continues to support the IdP-initiated web SSO use cases originally supported by SAML v1. In an IdP-initiated use case, the identity provider is configured with specialized links that refer to the desired service providers. These links actually refer to the local IdP's Single Sign-On Service and pass parameters to the service identifying the remote SP. So instead of visiting the SP directly, the user accesses the IdP site and clicks on one of the links to gain access to the remote SP."

🇻🇳 **Dịch**

> "Ngoài việc hỗ trợ các use case web SSO SP-Initiated mới, SAML v2 tiếp tục hỗ trợ các use case web SSO IdP-initiated vốn đã được SAML v1 hỗ trợ từ đầu. Trong use case IdP-initiated, identity provider được cấu hình sẵn các link chuyên biệt trỏ tới các service provider mong muốn. Thực chất các link này trỏ tới Single Sign-On Service của chính IdP và truyền tham số định danh SP ở xa cho service đó. Vậy nên thay vì vào thẳng SP, user vào site của IdP rồi bấm một trong các link đó để truy cập SP ở xa."

| | **SP-initiated** | **IdP-initiated** |
|---|---|---|
| Bắt đầu ở đâu | User vào thẳng resource của SP | User đang ở portal IdP, bấm link tới SP |
| Có `<AuthnRequest>` không | Có — SP gửi sang IdP | **Không** |
| `InResponseTo` trong Response | Có, khớp ID của AuthnRequest | Phải **không** có (spec: "MUST NOT be present") |
| Spec gọi là | Luồng chuẩn của profile | *Unsolicited Response* (Profiles §4.1.5) |
| Ví dụ đời sống | Bạn tới cổng bãi xe trước, bảo vệ bảo "lên HR lấy thẻ đã" | Bạn ở phòng HR sẵn, cầm thẻ mới rồi mới đi xuống bãi xe |

📖 **Nguyên văn** — SAML Profiles 2.0, §4.1.5 Unsolicited Responses

> "An identity provider MAY initiate this profile by delivering an unsolicited `<Response>` message to a service provider.
> An unsolicited `<Response>` MUST NOT contain an InResponseTo attribute, nor should any bearer `<SubjectConfirmationData>` elements contain one. If metadata as specified in [SAMLMeta] is used, the `<Response>` or artifact SHOULD be delivered to the `<md:AssertionConsumerService>` endpoint of the service provider designated as the default.
> Of special mention is that the identity provider MAY include a binding-specific "RelayState" parameter that indicates, based on mutual agreement with the service provider, how to handle subsequent interactions with the user agent. This MAY be the URL of a resource at the service provider."

🇻🇳 **Dịch**

> "Một identity provider CÓ THỂ khởi phát profile này bằng cách gửi một message `<Response>` không được yêu cầu trước (unsolicited) tới service provider.
> Một `<Response>` unsolicited PHẢI KHÔNG chứa attribute InResponseTo, và các element `<SubjectConfirmationData>` dạng bearer cũng không nên chứa nó. Nếu dùng metadata theo [SAMLMeta], `<Response>` hoặc artifact NÊN được gửi tới endpoint `<md:AssertionConsumerService>` của service provider được chỉ định là mặc định.
> Đáng chú ý là identity provider CÓ THỂ đưa vào một tham số "RelayState" đặc thù theo binding, chỉ ra — dựa trên thoả thuận song phương với service provider — cách xử lý các tương tác tiếp theo với user agent. Tham số này CÓ THỂ là URL của một resource tại service provider."

### 6.3 Hai binding hay gặp nhất

📖 **Nguyên văn** — SAML Bindings 2.0, §3.5.4 Message Encoding (HTTP POST Binding)

> "Messages are encoded for use with this binding by encoding the XML into an HTML form control and are transmitted using the HTTP POST method. A SAML protocol message is form-encoded by applying the base-64 encoding rules to the XML representation of the message and placing the result in a hidden form control within a form as defined by [HTML401] Section 17. The HTML document MUST adhere to the XHTML specification, [XHTML].
> If the message is a SAML request, then the form control MUST be named SAMLRequest. If the message is a SAML response, then the form control MUST be named SAMLResponse. Any additional form controls or presentation MAY be included but MUST NOT be required in order for the recipient to process the message.
> If a "RelayState" value is to accompany the SAML protocol message, it MUST be placed in an additional hidden form control named RelayState within the same form with the SAML message.
> The action attribute of the form MUST be the recipient's HTTP endpoint for the protocol or profile using this binding to which the SAML message is to be delivered. The method attribute MUST be "POST"."

🇻🇳 **Dịch**

> "Message được mã hoá để dùng với binding này bằng cách mã hoá XML vào một HTML form control, rồi truyền bằng phương thức HTTP POST. Một SAML protocol message được form-encode bằng cách áp dụng quy tắc base-64 lên biểu diễn XML của message và đặt kết quả vào một hidden form control bên trong một form theo định nghĩa ở [HTML401] Mục 17. Tài liệu HTML PHẢI tuân thủ spec XHTML.
> Nếu message là một SAML request, form control PHẢI được đặt tên là SAMLRequest. Nếu message là một SAML response, form control PHẢI được đặt tên là SAMLResponse. Các form control hay phần trình bày bổ sung CÓ THỂ có mặt nhưng PHẢI KHÔNG được là điều kiện bắt buộc để bên nhận xử lý message.
> Nếu có một giá trị "RelayState" đi kèm SAML protocol message, nó PHẢI được đặt trong một hidden form control bổ sung tên RelayState, trong cùng form với SAML message.
> Attribute action của form PHẢI là HTTP endpoint của bên nhận, ứng với protocol hoặc profile dùng binding này, nơi SAML message sẽ được gửi tới. Attribute method PHẢI là "POST"."

📖 **Nguyên văn** — SAML Bindings 2.0, §3.5.5 Message Exchange (ví dụ form, phần giá trị base64 đã lược)

```html
<form action="https://IdentityProvider.com/SAML/SLO/Response"
method="post">
<div>
<input type="hidden" name="RelayState"
value="0043bfc1bc45110dae17004005b13a2b"/>
<input type="hidden" name="SAMLResponse"
value="PHNhbWxwOkxvZ291dFJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFt
...
```

🇻🇳 Ví dụ gốc từ spec Bindings: SAML message nằm nguyên trong `value` của một `<input type="hidden">`, đã base64, kèm `RelayState`. Trình duyệt chỉ đóng vai người đưa thư — nó tự submit form này sang endpoint của bên nhận.

📖 **Nguyên văn** — SAML Bindings 2.0, §3.4.4 Message Encoding (HTTP Redirect Binding)

> "Messages are encoded for use with this binding using a URL encoding technique, and transmitted using the HTTP GET method. (…) A URL encoding MUST place the message entirely within the URL query string, and MUST reserve the rest of the URL for the endpoint of the message recipient.
> A query string parameter named SAMLEncoding is reserved to identify the encoding mechanism used. If this parameter is omitted, then the value is assumed to be urn:oasis:names:tc:SAML:2.0:bindings:URL-Encoding:DEFLATE. All endpoints that support this binding MUST support the DEFLATE encoding described in the following sub-section."

🇻🇳 **Dịch**

> "Message được mã hoá cho binding này bằng kỹ thuật URL encoding, và truyền bằng phương thức HTTP GET. (…) Một URL encoding PHẢI đặt toàn bộ message bên trong query string của URL, và PHẢI dành phần còn lại của URL cho endpoint của bên nhận message.
> Một query string parameter tên SAMLEncoding được dành riêng để định danh cơ chế mã hoá đang dùng. Nếu tham số này bị bỏ đi, giá trị được ngầm hiểu là urn:oasis:names:tc:SAML:2.0:bindings:URL-Encoding:DEFLATE. Mọi endpoint hỗ trợ binding này PHẢI hỗ trợ mã hoá DEFLATE mô tả ở tiểu mục kế tiếp."

> [!note] Vì sao cần cả hai binding
> `<AuthnRequest>` nhỏ nên nhét vừa query string → **HTTP Redirect**. `<Response>` chứa assertion đã ký, có certificate, rất lớn → không nhét vừa URL → **HTTP POST**. Đó là lý do luồng phổ biến nhất trong thực tế được gọi là **Redirect/POST**. Xem [[02 - What is HTTP]] về giới hạn thực tế của URL và ngữ nghĩa GET/POST.

### 6.4 Quy tắc xử lý `<Response>` — phần dễ làm sai nhất

📖 **Nguyên văn** — SAML Profiles 2.0, §4.1.4.3 `<Response>` Message Processing Rules

> "Regardless of the SAML binding used, the service provider MUST do the following:
> - Verify any signatures present on the assertion(s) or the response
> - Verify that the Recipient attribute in any bearer `<SubjectConfirmationData>` matches the assertion consumer service URL to which the `<Response>` or artifact was delivered
> - Verify that the NotOnOrAfter attribute in any bearer `<SubjectConfirmationData>` has not passed, subject to allowable clock skew between the providers
> - Verify that the InResponseTo attribute in the bearer `<SubjectConfirmationData>` equals the ID of its original `<AuthnRequest>` message, unless the response is unsolicited (see Section 4.1.5), in which case the attribute MUST NOT be present
> - Verify that any assertions relied upon are valid in other respects
> - If any bearer `<SubjectConfirmationData>` includes an Address attribute, the service provider MAY check the user agent's client address against it.
> - Any assertion which is not valid, or whose subject confirmation requirements cannot be met SHOULD be discarded and SHOULD NOT be used to establish a security context for the principal.
> - If an `<AuthnStatement>` used to establish a security context for the principal contains a SessionNotOnOrAfter attribute, the security context SHOULD be discarded once this time is reached, unless the service provider reestablishes the principal's identity by repeating the use of this profile."

🇻🇳 **Dịch**

> "Bất kể dùng SAML binding nào, service provider PHẢI làm những việc sau:
> - Verify mọi chữ ký có mặt trên (các) assertion hoặc trên response
> - Verify rằng attribute Recipient trong bất kỳ `<SubjectConfirmationData>` dạng bearer nào khớp với URL của assertion consumer service nơi `<Response>` hoặc artifact được gửi tới
> - Verify rằng attribute NotOnOrAfter trong bất kỳ `<SubjectConfirmationData>` bearer nào chưa qua hạn, có tính tới độ lệch đồng hồ cho phép giữa các provider
> - Verify rằng attribute InResponseTo trong `<SubjectConfirmationData>` bearer bằng ID của message `<AuthnRequest>` gốc của nó — trừ khi response là unsolicited (xem Mục 4.1.5), trường hợp đó attribute này PHẢI KHÔNG có mặt
> - Verify rằng mọi assertion được tin dùng đều hợp lệ ở các khía cạnh khác
> - Nếu một `<SubjectConfirmationData>` bearer có attribute Address, service provider CÓ THỂ đối chiếu địa chỉ client của user agent với nó.
> - Bất kỳ assertion nào không hợp lệ, hoặc không thoả được yêu cầu subject confirmation, NÊN bị loại bỏ và KHÔNG NÊN dùng để thiết lập security context cho principal.
> - Nếu một `<AuthnStatement>` dùng để thiết lập security context cho principal có attribute SessionNotOnOrAfter, security context NÊN bị huỷ khi tới thời điểm đó, trừ khi service provider thiết lập lại danh tính principal bằng cách lặp lại profile này."

📖 **Nguyên văn** — SAML Profiles 2.0, §4.1.4.5 POST-Specific Processing Rules

> "If the HTTP POST binding is used to deliver the `<Response>`, the enclosed assertion(s) MUST be signed.
> The service provider MUST ensure that bearer assertions are not replayed, by maintaining the set of used ID values for the length of time for which the assertion would be considered valid based on the NotOnOrAfter attribute in the `<SubjectConfirmationData>`."

🇻🇳 **Dịch**

> "Nếu HTTP POST binding được dùng để chuyển `<Response>`, (các) assertion bên trong PHẢI được ký.
> Service provider PHẢI bảo đảm các bearer assertion không bị replay, bằng cách duy trì tập các giá trị ID đã dùng trong khoảng thời gian mà assertion còn được coi là hợp lệ, dựa theo attribute NotOnOrAfter trong `<SubjectConfirmationData>`."

> [!danger] Chống replay là trách nhiệm của SP, không phải của thư viện mặc định
> Spec dùng chữ **MUST**: SP phải lưu lại tập ID assertion đã tiêu thụ trong suốt thời gian assertion còn hạn. Nếu không, một assertion bị chặn lại (từ log, từ history trình duyệt, từ proxy) có thể được dùng lại để đăng nhập. Nhiều thư viện SAML **không** bật replay cache mặc định hoặc để nó ở bộ nhớ tiến trình — điều đó vô nghĩa khi hệ thống chạy nhiều instance.

---

## 7. XML Signature — vì sao nó là tất cả

Trong Web Browser SSO, assertion **đi xuyên qua trình duyệt của chính user** — một môi trường mà bạn không kiểm soát. Kênh vận chuyển không đáng tin. Thứ duy nhất khiến SP dám tin nội dung assertion là chữ ký của IdP.

📖 **Nguyên văn** — SAML Core 2.0, §2.3.3

> "If such a signature is used, then the `<ds:Signature>` element MUST be present, and a relying party MUST verify that the signature is valid (that is, that the assertion has not been tampered with) in accordance with [XMLSig]. If it is invalid, then the relying party MUST NOT rely on the contents of the assertion. If it is valid, then the relying party SHOULD evaluate the signature to determine the identity and appropriateness of the issuer and may continue to process the assertion in accordance with this specification and as it deems appropriate (for example, evaluating conditions, advice, following profile-specific rules, and so on)."

🇻🇳 **Dịch**

> "Nếu chữ ký như vậy được dùng, element `<ds:Signature>` PHẢI có mặt, và relying party PHẢI verify rằng chữ ký hợp lệ (tức là assertion chưa bị can thiệp) theo [XMLSig]. Nếu chữ ký không hợp lệ, relying party PHẢI KHÔNG được tin vào nội dung của assertion. Nếu hợp lệ, relying party NÊN đánh giá chữ ký để xác định danh tính và tính phù hợp của issuer, và có thể tiếp tục xử lý assertion theo spec này và theo cách nó thấy phù hợp (ví dụ: đánh giá condition, advice, tuân theo quy tắc riêng của profile, v.v.)."

📖 **Nguyên văn** — SAML Core 2.0, §5.4.1 Signing Formats and Algorithms

> "XML Signature has three ways of relating a signature to a document: enveloping, enveloped, and detached.
> SAML assertions and protocols MUST use enveloped signatures when signing assertions and protocol messages. SAML processors SHOULD support the use of RSA signing and verification for public key operations in accordance with the algorithm identified by http://www.w3.org/2000/09/xmldsig#rsa-sha1."

🇻🇳 **Dịch**

> "XML Signature có ba cách gắn chữ ký với tài liệu: enveloping, enveloped và detached.
> SAML assertion và protocol PHẢI dùng chữ ký **enveloped** khi ký assertion và protocol message. SAML processor NÊN hỗ trợ ký và verify RSA cho các thao tác public key theo thuật toán định danh bởi http://www.w3.org/2000/09/xmldsig#rsa-sha1."

> [!danger] `rsa-sha1` trong spec 2005 đã lỗi thời
> SAML Core §5.4.1 (năm 2005) khuyến nghị `#rsa-sha1`. **OWASP SAML Security Cheat Sheet (bản hiện hành) yêu cầu ngược lại** — trích nguyên văn:
> > "Explicitly verify the signature algorithm is at least RSA-SHA-256 (or stronger). Reject SHA-1-based algorithms (http://www.w3.org/2000/09/xmldsig#rsa-sha1, ...#hmac-sha1) and `<ds:DigestMethod Algorithm="...sha1">`. NIST SP 800-131A Rev. 2 disallows SHA-1 in digital signatures."
>
> 🇻🇳 "Kiểm tra một cách tường minh rằng thuật toán chữ ký ít nhất là RSA-SHA-256 (hoặc mạnh hơn). Từ chối các thuật toán dựa trên SHA-1 (…#rsa-sha1, …#hmac-sha1) và `<ds:DigestMethod Algorithm="...sha1">`. NIST SP 800-131A Rev. 2 cấm dùng SHA-1 trong chữ ký số."
>
> **Khi spec cũ và khuyến nghị bảo mật mới mâu thuẫn → theo cái mới.** SHA-1 đã bị phá vỡ về mặt kháng va chạm sau khi spec 2005 được viết.

📖 **Nguyên văn** — SAML Core 2.0, §5.4.2 References

> "SAML assertions and protocol messages MUST supply a value for the ID attribute on the root element of the assertion or protocol message being signed. (…) Signatures MUST contain a single `<ds:Reference>` containing a same-document reference to the ID attribute value of the root element of the assertion or protocol message being signed. For example, if the ID attribute value is "foo", then the URI attribute in the `<ds:Reference>` element MUST be "#foo"."

🇻🇳 **Dịch**

> "SAML assertion và protocol message PHẢI cung cấp giá trị cho attribute ID trên root element của assertion hoặc protocol message được ký. (…) Chữ ký PHẢI chứa **đúng một** `<ds:Reference>` chứa tham chiếu trong cùng tài liệu tới giá trị attribute ID của root element của assertion hoặc protocol message được ký. Ví dụ, nếu giá trị ID là "foo", thì attribute URI trong element `<ds:Reference>` PHẢI là "#foo"."

> [!warning] Đây chính là chỗ XML Signature Wrapping đánh vào
> Chữ ký trỏ tới một element **theo ID**. Nếu code của bạn verify chữ ký trên element `#foo` nhưng lại **đọc dữ liệu từ một element khác** mà attacker chèn thêm vào tài liệu, bạn sẽ verify thành công một thứ rồi tin một thứ khác. Xem mục 8.

📖 **Nguyên văn** — SAML Core 2.0, §5.4.4 Transforms

> "Signatures in SAML messages SHOULD NOT contain transforms other than the enveloped signature transform (with the identifier http://www.w3.org/2000/09/xmldsig#enveloped-signature) or the exclusive canonicalization transforms (…).
> Verifiers of signatures MAY reject signatures that contain other transform algorithms as invalid. If they do not, verifiers MUST ensure that no content of the SAML message is excluded from the signature."

🇻🇳 **Dịch**

> "Chữ ký trong SAML message KHÔNG NÊN chứa transform nào khác ngoài enveloped signature transform (định danh http://www.w3.org/2000/09/xmldsig#enveloped-signature) hoặc các exclusive canonicalization transform (…).
> Bên verify chữ ký CÓ THỂ từ chối, coi là không hợp lệ, những chữ ký chứa thuật toán transform khác. Nếu không từ chối, bên verify PHẢI bảo đảm rằng **không có phần nội dung nào** của SAML message bị loại khỏi phạm vi chữ ký."

📖 **Nguyên văn** — SAML Technical Overview, §4.6 Security in SAML

> "SAML defines a number of security mechanisms to detect and protect against such attacks. The primary mechanism is for the relying party and asserting party to have a pre-existing trust relationship which typically relies on a Public Key Infrastructure (PKI). While use of a PKI is not mandated by SAML, it is recommended.
> (…) When a response message containing an assertion is delivered to a relying party via a user's web browser (for example using the HTTP POST binding), then to ensure message integrity, it is mandated that the response message be digitally signed using XML Signature"

🇻🇳 **Dịch**

> "SAML định nghĩa một số cơ chế bảo mật để phát hiện và chống lại các tấn công như vậy. Cơ chế chính yếu là relying party và asserting party phải có sẵn một quan hệ tin cậy từ trước, thường dựa trên một Public Key Infrastructure (PKI). Việc dùng PKI không bị SAML bắt buộc, nhưng được khuyến nghị.
> (…) Khi một response message chứa assertion được chuyển tới relying party **thông qua trình duyệt web của user** (ví dụ dùng HTTP POST binding), thì để bảo đảm tính toàn vẹn message, việc response message phải được ký số bằng XML Signature là **bắt buộc**."

💡 **Ví dụ đời sống**

Trở lại cái thẻ nhân viên. Bạn cầm thẻ đi từ phòng HR xuống bãi xe — **bạn** là kênh vận chuyển, và bạn hoàn toàn có động cơ sửa cái thẻ (đổi "nhân viên" thành "giám đốc"). Chữ ký số là con dấu nổi + hologram mà bạn không làm giả được. Bảo vệ bãi xe không cần gọi điện lên HR; chỉ cần con dấu đúng là đủ.

Nhưng — và đây là toàn bộ bài học bảo mật của SAML — **con dấu chỉ có giá trị nếu bảo vệ thật sự soi đúng chỗ có dấu**. Nếu attacker dán một cái thẻ giả bên cạnh cái thẻ thật đã đóng dấu, và bảo vệ đọc nội dung ở cái thẻ giả trong khi soi dấu ở cái thẻ thật — con dấu trở nên vô dụng.

---

## 8. 🔴 Bảo mật — OWASP SAML Security Cheat Sheet

> Toàn bộ mục này trích nguyên văn từ OWASP SAML Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html

📖 **Nguyên văn** — OWASP, mở đầu

> "The Security Assertion Markup Language (SAML) is an open standard for exchanging authorization and authentication information. The Web Browser SAML/SSO Profile with Redirect/POST bindings is one of the most common SSO implementation. This cheatsheet will focus primarily on that profile."

🇻🇳 **Dịch**

> "Security Assertion Markup Language (SAML) là một chuẩn mở để trao đổi thông tin authorization và authentication. Web Browser SAML/SSO Profile với binding Redirect/POST là một trong những triển khai SSO phổ biến nhất. Cheat sheet này tập trung chủ yếu vào profile đó."

### 8.1 XML Signature Wrapping

> [!danger] XML Signature Wrapping — lỗ hổng đặc trưng của SAML

📖 **Nguyên văn** — OWASP, *Validate Signatures*

> "Vulnerabilities in SAML implementations due to XML Signature Wrapping attacks were described in 2012, On Breaking SAML: Be Whoever You Want to Be.
> The following recommendations were proposed in response (Secure SAML validation to prevent XML signature wrapping attacks):
> - Without exception, always perform schema validation on the XML document prior to using it for any security-related purposes:
>   - Always use local, trusted copies of schemas for validation.
>   - Never allow automatic download of schemas from third party locations.
>   - If possible, inspect schemas and perform schema hardening, to disable possible wildcard type or relaxed processing statements.
> - Securely validate the digital signature:
>   - If you expect only one signing key, use StaticKeySelector. Obtain the key directly from the identity provider, store it in a local file and ignore any KeyInfo elements in the document.
>   - If you expect more than one signing key, use X509KeySelector (the JKS variant). Obtain these keys directly from the identity providers, store them in local JKS and ignore any KeyInfo elements in the document.
> - Avoid signature-wrapping attacks.
>   - Never use getElementsByTagName to select security related elements in an XML document without prior validation.
>   - Always use absolute XPath expressions to select elements, unless a hardened schema is used for validation."

🇻🇳 **Dịch**

> "Các lỗ hổng trong triển khai SAML do tấn công XML Signature Wrapping đã được mô tả năm 2012 trong bài *On Breaking SAML: Be Whoever You Want to Be*.
> Các khuyến nghị sau được đề xuất để đáp lại (*Secure SAML validation to prevent XML signature wrapping attacks*):
> - Không có ngoại lệ: **luôn** thực hiện schema validation trên tài liệu XML trước khi dùng nó cho bất kỳ mục đích liên quan tới bảo mật nào:
>   - Luôn dùng bản sao schema cục bộ, đáng tin cậy để validate.
>   - **Không bao giờ** cho phép tự động tải schema từ nguồn bên thứ ba.
>   - Nếu có thể, soi lại schema và làm cứng (harden) schema, để vô hiệu hoá các khai báo kiểu wildcard hoặc xử lý lỏng lẻo.
> - Validate chữ ký số một cách an toàn:
>   - Nếu bạn chỉ chờ đợi một khoá ký, hãy dùng StaticKeySelector. Lấy khoá trực tiếp từ identity provider, lưu vào file cục bộ, và **bỏ qua mọi element KeyInfo trong tài liệu**.
>   - Nếu bạn chờ đợi nhiều hơn một khoá ký, dùng X509KeySelector (biến thể JKS). Lấy các khoá này trực tiếp từ identity provider, lưu trong JKS cục bộ, và bỏ qua mọi element KeyInfo trong tài liệu.
> - Tránh tấn công signature-wrapping.
>   - **Không bao giờ** dùng getElementsByTagName để chọn các element liên quan tới bảo mật trong tài liệu XML mà chưa validate trước.
>   - Luôn dùng biểu thức XPath tuyệt đối để chọn element, trừ khi đã dùng schema đã được làm cứng để validate."

> [!danger] Chú ý điểm "bỏ qua mọi element KeyInfo"
> `<ds:KeyInfo>` nằm **trong chính tài liệu mà attacker gửi tới**. Nếu code của bạn lấy public key từ `KeyInfo` rồi dùng nó để verify chữ ký, thì attacker chỉ cần tự ký bằng khoá của mình và đính kèm certificate của mình — chữ ký sẽ luôn hợp lệ. Khoá tin cậy **phải** đến từ metadata IdP bạn đã cấu hình trước, không bao giờ từ message.

### 8.2 Danh sách kiểm tra bắt buộc phía Service Provider

📖 **Nguyên văn** — OWASP, *Service Provider Considerations*

> "- Validating session state for user
> - Level of granularity in setting authorization context when consuming SAML token (do you use groups, roles, attributes)
> - Ensure each Assertion or the entire Response element is signed
> - Validate Signatures
> - Validate if signed by an authorized IdP
> - Validate IDP certificates for revocation against CRL/OCSP if they are present
> - Validate the Destination attribute on `<samlp:Response>` exactly matches the SP's expected Assertion Consumer Service (ACS) URL (SAML Core 2.0 §3.2.2.1). Reject responses that are missing Destination or where it does not match — this prevents cross-SP assertion replay.
> - Validate `<saml:Audience>` matches the SP's EntityID
> - Validate NotBefore and NotOnorAfter
> - Validate Recipient attribute, InResponseTo, and `<saml:SubjectConfirmationData>` (Recipient, NotOnOrAfter, InResponseTo)
> - Explicitly verify the signature algorithm is at least RSA-SHA-256 (or stronger). Reject SHA-1-based algorithms (…) NIST SP 800-131A Rev. 2 disallows SHA-1 in digital signatures.
> - Verify the `<ds:Reference URI>` in the XML signature covers the `<saml:Assertion>` element being trusted. This mitigates XML Signature Wrapping attacks.
> - Define criteria for SAML logout
> - Exchange assertions only over secure transports like TLS
> - Define criteria for session management
> - Verify user identities obtained from SAML ticket assertions whenever possible."

🇻🇳 **Dịch**

> "- Kiểm tra trạng thái session của user
> - Mức độ chi tiết khi thiết lập authorization context lúc tiêu thụ SAML token (bạn dùng group, role hay attribute?)
> - Bảo đảm mỗi Assertion hoặc toàn bộ element Response đều được ký
> - Verify chữ ký
> - Kiểm tra xem có phải được ký bởi một IdP được uỷ quyền hay không
> - Kiểm tra certificate của IdP xem có bị thu hồi hay không, đối chiếu CRL/OCSP nếu chúng có mặt
> - Kiểm tra attribute Destination trên `<samlp:Response>` khớp **chính xác** với ACS URL mà SP kỳ vọng (SAML Core 2.0 §3.2.2.1). Từ chối các response thiếu Destination hoặc có Destination không khớp — điều này chặn việc replay assertion sang SP khác.
> - Kiểm tra `<saml:Audience>` khớp EntityID của SP
> - Kiểm tra NotBefore và NotOnOrAfter
> - Kiểm tra attribute Recipient, InResponseTo, và `<saml:SubjectConfirmationData>` (Recipient, NotOnOrAfter, InResponseTo)
> - Verify một cách tường minh rằng thuật toán chữ ký ít nhất là RSA-SHA-256 (hoặc mạnh hơn). Từ chối các thuật toán dựa trên SHA-1 (…). NIST SP 800-131A Rev. 2 cấm SHA-1 trong chữ ký số.
> - Verify rằng `<ds:Reference URI>` trong XML signature **bao phủ đúng element `<saml:Assertion>` đang được tin dùng**. Điều này giảm thiểu tấn công XML Signature Wrapping.
> - Định nghĩa tiêu chí cho SAML logout
> - Chỉ trao đổi assertion trên các transport an toàn như TLS
> - Định nghĩa tiêu chí quản lý session
> - Xác minh danh tính user lấy từ SAML ticket assertion bất cứ khi nào có thể."

### 8.3 IdP-initiated SSO kém an toàn hơn theo thiết kế

📖 **Nguyên văn** — OWASP, *Unsolicited Response (ie. IdP Initiated SSO) Considerations for Service Providers*

> "Unsolicited Response is inherently less secure by design due to the lack of login CSRF protection. This limitation arises because the Service Provider (SP) has no opportunity to create a pre-login session or verify that the authentication request was intentionally initiated by the user.
> While this design does not make IdP-initiated SSO uniquely vulnerable to Man-in-the-Middle (MITM) attacks—those risks apply equally to SP-initiated flows if transport security is compromised—it does remove an important layer of login intent validation.
> Despite these concerns, IdP-initiated SSO remains supported for backward compatibility (notably with SAML 1.1). If it must be enabled, the following steps (in addition to those mentioned above) should help secure this flow:
> - Follow the validation process mentioned in SAML Profiles (section 4.1.5). This step will help counter the following attacks: Replay (6.1.2), Message Insertion (6.1.3)
> - If the contract of the RelayState parameter is a URL, make sure the URL is validated and explicitly on an allowlist. This step will help counter the following attack: Open Redirect
> - Implement proper replay detection either at the response or assertion level. This will help counter the following attack: Replay (6.1.2)"

🇻🇳 **Dịch**

> "Unsolicited Response về bản chất thiết kế là kém an toàn hơn, do thiếu cơ chế bảo vệ chống login CSRF. Hạn chế này phát sinh vì Service Provider (SP) không có cơ hội tạo một session trước-đăng-nhập hoặc xác minh rằng authentication request thực sự do user chủ động khởi phát.
> Dù thiết kế này không khiến IdP-initiated SSO dễ bị tấn công Man-in-the-Middle (MITM) hơn một cách đặc thù — các rủi ro đó áp dụng như nhau cho luồng SP-initiated nếu transport security bị phá vỡ — nó vẫn loại bỏ một lớp quan trọng: xác thực ý định đăng nhập.
> Bất chấp các quan ngại này, IdP-initiated SSO vẫn được hỗ trợ vì lý do tương thích ngược (đáng chú ý là với SAML 1.1). Nếu buộc phải bật, các bước sau (bên cạnh những bước đã nêu ở trên) sẽ giúp làm luồng này an toàn hơn:
> - Tuân theo quy trình validation nêu ở SAML Profiles (mục 4.1.5). Bước này giúp chống các tấn công: Replay (6.1.2), Message Insertion (6.1.3)
> - Nếu quy ước của tham số RelayState là một URL, hãy bảo đảm URL đó được validate và nằm tường minh trong một allowlist. Bước này giúp chống tấn công: Open Redirect
> - Triển khai cơ chế phát hiện replay đúng đắn, ở mức response hoặc mức assertion. Điều này giúp chống tấn công: Replay (6.1.2)"

### 8.4 Vụ Google SSO — vì sao thiếu `InResponseTo` là chết người

📖 **Nguyên văn** — OWASP, *Validate Protocol Usage*

> "This is a common area for security gaps - see Google SSO vulnerability for a real life example. Their SSO profile was vulnerable to a Man-in-the-middle attack from a malicious SP (Service Provider).
> The SSO Web Browser Profile is most susceptible to attacks from trusted partners. This particular security flaw was exposed because the SAML Response did not contain all of the required data elements necessary for a secure message exchange. (…)
> The AVANTSSAR team suggested the following data elements should be required:
> - AuthnRequest(ID, SP): An AuthnRequest must contain and ID and SP. Where ID is a string uniquely identifying the request and an SP identifies the Service Provider that initiated the request. Furthermore, the request ID attribute must be returned in the response (InResponseTo="`<requestId>`"). InResponseTo helps guarantee authenticity of the response from the trusted IdP. This was one of the missing attributes that left Google's SSO vulnerable.
> - Response(ID, SP, IdP, {AA} K -1/IdP): A Response must contain all these elements. Where ID is a string uniquely identifying the response. SP identifies the recipient of the response. IdP identifies the identity provider authorizing the response. {AA} K -1/IdP is the assertion digitally signed with the private key of the IdP.
> - AuthAssert(ID, C, IdP, SP): An authentication assertion must exist within the Response. It must contain an ID, a client (C), an identity provider (IdP), and a service provider (SP) identifier."

🇻🇳 **Dịch**

> "Đây là một khu vực thường có lỗ hổng bảo mật — xem lỗ hổng SSO của Google như một ví dụ đời thực. SSO profile của họ từng dễ bị tấn công Man-in-the-middle từ một SP (Service Provider) độc hại.
> SSO Web Browser Profile dễ tổn thương nhất trước tấn công từ chính các đối tác đáng tin cậy. Lỗ hổng cụ thể này lộ ra vì SAML Response không chứa đủ tất cả các thành phần dữ liệu bắt buộc cần thiết cho một trao đổi message an toàn. (…)
> Nhóm AVANTSSAR đề xuất các thành phần dữ liệu sau phải là bắt buộc:
> - **AuthnRequest(ID, SP)**: Một AuthnRequest phải chứa ID và SP. Trong đó ID là chuỗi định danh duy nhất request, và SP định danh Service Provider đã khởi phát request. Hơn nữa, attribute ID của request **phải được trả lại trong response** (InResponseTo="`<requestId>`"). InResponseTo giúp bảo đảm tính xác thực của response từ IdP tin cậy. Đây là một trong những attribute bị thiếu khiến SSO của Google trở nên dễ bị tấn công.
> - **Response(ID, SP, IdP, {AA} K -1/IdP)**: Một Response phải chứa tất cả các thành phần này. ID là chuỗi định danh duy nhất response. SP định danh bên nhận response. IdP định danh identity provider cấp phép response. {AA} K -1/IdP là assertion được ký số bằng private key của IdP.
> - **AuthAssert(ID, C, IdP, SP)**: Một authentication assertion phải tồn tại trong Response. Nó phải chứa một ID, một client (C), một identity provider (IdP), và một định danh service provider (SP)."

### 8.5 Input validation vẫn cần

📖 **Nguyên văn** — OWASP, *Input Validation*

> "Just because SAML is a security protocol does not mean that input validation goes away. Ensure that all SAML providers/consumers do proper input validation."

🇻🇳 **Dịch**

> "Việc SAML là một protocol bảo mật không có nghĩa là input validation biến mất. Hãy bảo đảm mọi SAML provider/consumer đều thực hiện input validation đúng đắn."

> [!warning] Attribute trong assertion vẫn là dữ liệu từ bên ngoài
> Sau khi verify chữ ký, các giá trị `<AttributeValue>` (tên, email, group, role) vẫn là chuỗi do IdP điền vào và có thể đi thẳng vào truy vấn database hay HTML của bạn. Xem [[13 - SQL Injection và Parameterized Query]].

> [!note] Một rủi ro thường được nhắc kèm nhưng KHÔNG có trong cheat sheet này
> Tài liệu OWASP SAML Security Cheat Sheet (bản fetch ngày viết bài) **không** đề cập tới **XXE (XML External Entity)**. Vì spec này yêu cầu không bịa lời khuyên bảo mật, ở đây chỉ ghi nhận: rủi ro tấn công vào bộ parse XML là điều cần tra cứu riêng ở OWASP XXE Prevention Cheat Sheet trước khi triển khai — bài này không đưa ra khuyến nghị cụ thể vì nguồn được giao không nói tới.

---

## 9. SAML vs OpenID Connect

Hai chuẩn cùng giải bài toán federation/SSO nhưng sinh ra ở hai thời đại khác nhau.

> [!note] Cách đọc bảng
> Cột **SAML** truy được về các câu trích ở trên (có ghi mục). Cột **OpenID Connect** là **nhận định tổng hợp** dựa trên [[16 - OpenID Connect]] — không phải trích dẫn từ nguồn SAML nào; đối chiếu lại bài đó khi cần chính xác.

| Tiêu chí | SAML 2.0 | OpenID Connect | Nguồn cột SAML |
|---|---|---|---|
| Năm chuẩn hoá | 2005 (OASIS) | 2014 (OpenID Foundation) | saml-core-2.0-os, 15 March 2005 |
| Định dạng token | XML — `<Assertion>` | JSON — ID Token dạng JWT | Core §1: "encoded in XML [XML] and use XML namespaces" |
| Ký / toàn vẹn | XML Signature, enveloped | JWS | Core §5.4.1: "MUST use enveloped signatures" |
| Mã hoá | XML Encryption (`<EncryptedAssertion>`) | JWE | Core §6 "SAML and XML Encryption Syntax and Processing" |
| Transport | Binding riêng biệt: HTTP Redirect, HTTP POST, HTTP Artifact, SOAP, PAOS, URI | HTTP/REST + JSON, không có tầng binding tách rời | Tech Overview §4.3 Bindings |
| Bên phát hành | Identity Provider (IdP) | OpenID Provider (OP) | Tech Overview §3.1 |
| Bên tiêu thụ | Service Provider (SP) | Relying Party (RP) | Tech Overview §3.1 |
| Nền tảng bên dưới | Chuẩn độc lập, đồng thời với thời SOAP | Lớp identity dựng trên OAuth 2.0 | Tech Overview §2.1 (nhắc WS-Security, Liberty Alliance) |
| Cơ chế "mang thông tin thêm" | `<AttributeStatement>` | claims trong ID Token / UserInfo endpoint | Core §2.7.3 |
| Ràng buộc người nhận | `<AudienceRestriction>` / `<Audience>` | claim `aud` | Core §2.5.1.4 |
| Ràng buộc thời gian | `NotBefore` / `NotOnOrAfter` | claim `exp` / `nbf` / `iat` | Core §2.5.1.2 |
| Chống replay theo request | `InResponseTo` khớp ID của `<AuthnRequest>` | `nonce` / `state` | Profiles §4.1.4.3 |
| Điểm mạnh thực tế | Hệ sinh thái doanh nghiệp cực rộng (AD FS, Okta, Entra, Shibboleth) | Nhẹ, hợp với mobile/SPA/API | *nhận định* |
| Điểm yếu thực tế | XML Signature phức tạp → nhiều lỗ hổng triển khai | *xem bài 16* | OWASP *Validate Signatures* |

> [!tip] Nhận định thực dụng
> Đây là **nhận định**, không phải trích spec: nếu bạn xây mới và khách hàng không ép, chọn OpenID Connect. Bạn phải làm SAML chủ yếu khi **khách hàng doanh nghiệp yêu cầu**, vì IdP của họ (AD FS, Okta, Entra ID, Shibboleth ở trường đại học) đã cấu hình theo SAML từ lâu. Trong trường hợp đó, tuyệt đối **không tự viết bộ verify assertion** — dùng thư viện trưởng thành và bật đủ các kiểm tra ở mục 8.2.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

Nếu phải làm SP trên stack JavaScript + Firebase + Google Cloud:

- Việc bạn phải hiện thực là **Assertion Consumer Service (ACS)** — một endpoint nhận HTTP POST với form field `SAMLResponse` (và `RelayState` nếu có). Đó là lý do nó phải là một endpoint nhận `application/x-www-form-urlencoded`, không phải JSON.
- Cần cấu hình từ phía khách hàng: **entityID của IdP**, **SSO URL** (Single Sign-On Service), và **certificate ký** (hoặc metadata URL). Bạn cung cấp ngược lại: **entityID của SP** và **ACS URL**.
- Replay cache (mục 6.4, spec dùng chữ MUST) **không** được để trong bộ nhớ tiến trình nếu backend chạy nhiều instance — phải là một store dùng chung với TTL bằng thời gian còn hạn của assertion.
- Sau khi verify assertion xong, bạn cần một cơ chế phiên riêng của ứng dụng. Đừng truyền assertion đi lòng vòng như một token phiên — nó là bằng chứng xác thực một lần, có hạn rất ngắn (ví dụ trong spec là 5 phút).

Không đưa ra khuyến nghị về tên API hay giới hạn cụ thể của Firebase/GCP ở đây vì bài này không tra cứu tài liệu của các nền tảng đó.

---

## Liên kết

- Bài trước: [[16 - OpenID Connect]]
- Quay lại mục lục: [[00 - Tổng hợp (Learn about APIs)]]
- [[01 - API là gì và nền tảng HTTP]] — nền tảng HTTP mà mọi binding của SAML dựa vào
- [[02 - What is HTTP]] — redirect 302, GET vs POST, giới hạn thực tế của URL (lý do có cả hai binding Redirect và POST)
- [[05 - SOAP]] — SAML SOAP Binding và Reverse SOAP (PAOS) Binding; cùng thời đại XML/WS-*
- [[04 - HTTP Status Code và thiết kế lỗi]] — 401 vs 403, đối chiếu với `<samlp:Status>` của SAML
- [[08 - OpenAPI Specification]] — Security Scheme Object; SAML không nằm trong danh sách scheme của OpenAPI, đây là một khác biệt đáng lưu ý
- [[09 - So sánh API Styles và REST Security]] — phân biệt authentication và authorization
- [[13 - SQL Injection và Parameterized Query]] — attribute trong assertion vẫn là input cần validate
- [[16 - OpenID Connect]] — chuẩn federation thế hệ JSON/REST, đối trọng hiện đại của SAML
- [[05 - DNS and how it works]] — vì sao cookie không đi xuyên DNS domain, gốc rễ của bài toán MDSSO

## Nguồn tham khảo

- OASIS — *Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0* (saml-core-2.0-os, 15 March 2005) : https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf
- OASIS — *Bindings for the OASIS Security Assertion Markup Language (SAML) V2.0* (saml-bindings-2.0-os) : https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf
- OASIS — *Profiles for the OASIS Security Assertion Markup Language (SAML) V2.0* (saml-profiles-2.0-os) : https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf
- OASIS — *Security Assertion Markup Language (SAML) V2.0 Technical Overview* (sstc-saml-tech-overview-2.0, 25 March 2008) : https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html
- OWASP Cheat Sheet Series — *SAML Security Cheat Sheet* : https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html
