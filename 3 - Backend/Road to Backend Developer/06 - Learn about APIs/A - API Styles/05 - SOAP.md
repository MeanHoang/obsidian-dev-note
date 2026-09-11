# 05 — SOAP

> **Nguồn chính:** SOAP Version 1.2 Part 1: Messaging Framework (W3C Recommendation) — https://www.w3.org/TR/soap12-part1/
> Bổ sung: SOAP Version 1.2 Part 0: Primer — https://www.w3.org/TR/soap12-part0/ · WSDL 2.0 Part 1: Core Language — https://www.w3.org/TR/wsdl20/
> Bài này bám mục 1 (Introduction), 4 (SOAP Protocol Binding Framework) và 5 (SOAP Message Construct) của Part 1, mục 4.2 (SOAP Over Email) của Part 0, và mục 1 của WSDL 2.0.

---

> [!note] Đọc bài này với tinh thần nào
> SOAP là công nghệ cũ, gần như không ai chọn cho API mới nữa. Nhưng khi tích hợp với hệ thống doanh nghiệp, ngân hàng, ERP, hãng vận chuyển… bạn vẫn sẽ gặp. Mục tiêu ở đây là **hiểu đủ để đọc được một message SOAP và một file WSDL khi bị ném vào mặt**, không phải để trở thành chuyên gia WS-*.

---

## 1. SOAP là gì

📖 **Nguyên văn** — SOAP 1.2 Part 1, §1 Introduction
> "SOAP Version 1.2 (SOAP) is a lightweight protocol intended for exchanging structured information in a decentralized, distributed environment. It uses XML technologies to define an extensible messaging framework providing a message construct that can be exchanged over a variety of underlying protocols. The framework has been designed to be independent of any particular programming model and other implementation specific semantics."

🇻🇳 **Dịch**
> "SOAP Version 1.2 (SOAP) là một protocol nhẹ, nhằm mục đích trao đổi thông tin có cấu trúc trong một môi trường phi tập trung, phân tán. Nó dùng các công nghệ XML để định nghĩa một messaging framework có thể mở rộng, cung cấp một cấu trúc message có thể được trao đổi qua nhiều protocol nền khác nhau. Framework này được thiết kế để độc lập với bất kỳ mô hình lập trình cụ thể nào và với các ngữ nghĩa đặc thù của cách hiện thực."

Ba chữ quan trọng nhất trong câu trên: **lightweight protocol**. SOAP tự nhận mình là một **protocol** — tức là có spec, có quy tắc bắt buộc (MUST / MUST NOT theo RFC 2119), có thể kiểm tra tính tuân thủ.

📖 **Nguyên văn** — SOAP 1.2 Part 1, §1.2 Conformance
> "For an implementation to claim conformance with the SOAP Version 1.2 specification, it MUST correctly implement all mandatory ("MUST") requirements expressed in Part 1 of the"

🇻🇳 **Dịch**
> "Để một implementation tuyên bố tuân thủ đặc tả SOAP Version 1.2, nó PHẢI hiện thực đúng mọi yêu cầu bắt buộc ("MUST") được nêu trong Part 1 của…"

📖 **Nguyên văn** — SOAP 1.2 Part 1, §1 Introduction (ghi chú cuối mục)
> "Note: In previous versions of this specification the SOAP name was an acronym. This is no longer the case."

🇻🇳 **Dịch**
> "Ghi chú: Ở các phiên bản trước của đặc tả này, cái tên SOAP là một từ viết tắt. Bây giờ thì không còn nữa."

> [!tip] Đừng đi giải thích SOAP = "Simple Object Access Protocol"
> Từ SOAP 1.2 trở đi, W3C nói thẳng SOAP **không còn là từ viết tắt**. Nó chỉ là một cái tên.

### Hai mục tiêu thiết kế

📖 **Nguyên văn** — SOAP 1.2 Part 1, §1 Introduction
> "Two major design goals for SOAP are simplicity and extensibility (see XMLP Requirements [XMLP Requirements]). SOAP attempts to meet these goals by omitting, from the messaging framework, features that are often found in distributed systems. Such features include but are not limited to "reliability", "security", "correlation", "routing", and "Message Exchange Patterns" (MEPs). While it is anticipated that many features will be defined, this specification provides specifics only for two MEPs. Other features are left to be defined as extensions by other specifications."

🇻🇳 **Dịch**
> "Hai mục tiêu thiết kế lớn của SOAP là sự đơn giản và khả năng mở rộng (xem XMLP Requirements). SOAP cố đạt các mục tiêu này bằng cách **lược bỏ khỏi messaging framework** những tính năng thường thấy trong hệ phân tán. Những tính năng đó bao gồm nhưng không giới hạn ở "reliability" (độ tin cậy), "security" (bảo mật), "correlation" (tương quan message), "routing" (định tuyến) và "Message Exchange Patterns" (MEPs). Dù dự kiến sẽ có nhiều tính năng được định nghĩa, đặc tả này chỉ nêu chi tiết cho hai MEP. Các tính năng khác được để lại cho các đặc tả khác định nghĩa dưới dạng extension."

Đây chính là nguồn gốc của cả họ **WS-\*** mà bạn hay nghe: bản thân SOAP cố tình *không* làm security, *không* làm reliability, nên các spec khác mọc lên để lấp chỗ trống đó.

---

## 2. SOAP là protocol, REST là architectural style

Đây là điểm đối lập cốt lõi giữa bài này và [[02 - REST]].

- **SOAP**: W3C định nghĩa nguyên văn là *"a lightweight protocol"* (trích ở §1 bên trên), có §1.2 Conformance quy định thế nào là tuân thủ. Bạn có thể validate một message SOAP bằng XML Schema mà W3C phát hành cho namespace `http://www.w3.org/2003/05/soap-envelope`.
- **REST**: là một **architectural style** — tập các ràng buộc kiến trúc, không có message format bắt buộc, không có schema để validate, không có khái niệm "API này conform với REST" theo kiểu pass/fail.

> [!note] Đây là nhận định so sánh của note, không phải câu trích
> Phần chữ về REST ở trên tổng hợp lại từ [[02 - REST]]. Mọi câu trích tiếng Anh trong bài này đều thuộc về tài liệu SOAP/WSDL của W3C.

Hệ quả thực tế của khác biệt đó:

| | SOAP | REST |
|---|---|---|
| Bản chất | protocol — *"a lightweight protocol"* (SOAP 1.2 Part 1, §1) | architectural style (xem [[02 - REST]]) — *nhận định* |
| Format message | XML, bắt buộc — Envelope MUST là `env:Envelope` trong namespace `http://www.w3.org/2003/05/soap-envelope` (§5.1) | không quy định; thực tế phần lớn dùng JSON — *nhận định* |
| Protocol nền | *"a variety of underlying protocols"* (§1); binding chuẩn duy nhất của 1.2 là HTTP (Part 0, §4) | gắn với HTTP trên thực tế — *nhận định* |
| Báo lỗi | `env:Fault` trong Body, có `Code`/`Reason`/`Detail` (§5.4) | HTTP status code — *nhận định* |
| Contract | WSDL — *"provides a model and an XML format for describing Web services"* (WSDL 2.0, §1) | không bắt buộc; sau này có [[08 - OpenAPI Specification]] — *nhận định* |
| Tính mở rộng | qua SOAP Header block + SOAP modules (§5.2, §3.3) | qua HTTP header / media type — *nhận định* |
| Trạng thái | *"SOAP is fundamentally a stateless, one-way message exchange paradigm"* (Part 0, §1.1) | stateless là một ràng buộc của style (xem [[02 - REST]]) — *nhận định* |

---

## 3. SOAP không gắn chặt với HTTP

Đây là điểm dễ gây bất ngờ nhất cho người quen REST: SOAP **không mặc định chạy trên HTTP**. HTTP chỉ là một trong nhiều "underlying protocol".

📖 **Nguyên văn** — SOAP 1.2 Part 1, §4 SOAP Protocol Binding Framework
> "SOAP enables exchange of SOAP messages using a variety of underlying protocols. The formal set of rules for carrying a SOAP message within or on top of another protocol (underlying protocol) for the purpose of exchange is called a binding. The SOAP Protocol Binding Framework provides general rules for the specification of protocol bindings; the framework also describes the relationship between bindings and SOAP nodes that implement those bindings. The HTTP binding in SOAP 1.2 Part 2 [SOAP Part 2] illustrates the specification of a binding. Additional bindings can be created by specifications that conform to the binding framework introduced in this chapter."

🇻🇳 **Dịch**
> "SOAP cho phép trao đổi các SOAP message bằng **nhiều protocol nền khác nhau**. Tập quy tắc chính thức để chở một SOAP message bên trong hoặc bên trên một protocol khác (protocol nền) nhằm mục đích trao đổi được gọi là một **binding**. SOAP Protocol Binding Framework cung cấp các quy tắc chung để đặc tả các protocol binding; framework này cũng mô tả quan hệ giữa các binding và các SOAP node hiện thực chúng. HTTP binding trong SOAP 1.2 Part 2 minh hoạ cách đặc tả một binding. Có thể tạo thêm binding khác bằng các đặc tả tuân theo binding framework giới thiệu ở chương này."

📖 **Nguyên văn** — SOAP 1.2 Part 0 (Primer), §2.1
> "A SOAP message such as that in Example 1 may be transferred by different underlying protocols and used in a variety of message exchange patterns. For example, for a Web-based access to a travel service application, it could be placed in the body of a HTTP POST request. In another protocol binding, it might be sent in an email message (see section 4.2)."

🇻🇳 **Dịch**
> "Một SOAP message như ở Ví dụ 1 có thể được chuyển đi bằng các protocol nền khác nhau và dùng trong nhiều message exchange pattern khác nhau. Ví dụ, để truy cập một ứng dụng dịch vụ du lịch qua Web, nó có thể được đặt trong body của một HTTP POST request. Ở một protocol binding khác, nó có thể được gửi trong một email (xem mục 4.2)."

### SOAP qua email / SMTP

📖 **Nguyên văn** — SOAP 1.2 Part 0, §4.2 SOAP Over Email
> "Application developers can use the Internet email infrastructure to move SOAP messages as either email text or attachments. The examples shown below offer one way to carry SOAP messages, and should not be construed as being the standard way of doing so. The SOAP Version 1.2 specifications do not specify such a binding. However, there is a non-normative W3C Note [SOAP Email Binding] describing an email binding for SOAP, its main purpose being to demonstrate the application of the general SOAP Protocol Binding Framework described in [SOAP Part 1]."

🇻🇳 **Dịch**
> "Lập trình viên ứng dụng có thể dùng hạ tầng email của Internet để chuyển các SOAP message dưới dạng nội dung email hoặc file đính kèm. Các ví dụ bên dưới chỉ là **một** cách chở SOAP message, và không nên hiểu là cách chuẩn để làm việc đó. Các đặc tả SOAP Version 1.2 **không** đặc tả một binding như vậy. Tuy nhiên, có một W3C Note không mang tính chuẩn mực mô tả một email binding cho SOAP, mục đích chính là để minh hoạ việc áp dụng SOAP Protocol Binding Framework tổng quát mô tả trong Part 1."

📖 **Nguyên văn** — SOAP 1.2 Part 0, Example 14 (phần header email)
> ```
> From: a.oyvind@mycompany.example.com
> To: reservations@travelcompany.example.org
> Subject: Travel to LA
> Date: Thu, 29 Nov 2001 13:20:00 EST
> Message-Id: <EE492E16A090090276D208424960C0C@mycompany.example.com>
> Content-Type: application/soap+xml
> ```

🇻🇳 Đây là header của một email RFC 2822 bình thường, chỉ khác ở `Content-Type: application/soap+xml` — phần body phía sau chính là một SOAP Envelope. Người nhận là một SOAP node có khả năng xử lý.

📖 **Nguyên văn** — SOAP 1.2 Part 0, §4
> "The next sections show examples of two underlying protocol bindings for SOAP, namely those to [HTTP 1.1] and email. It should be emphasized again that the only normative binding for SOAP 1.2 messages is to [HTTP 1.1]. The examples in section 4.2 showing email as a transport mechanism for SOAP is simply meant to suggest that other choices for the transfer of SOAP messages are possible, although not standardized at this time."

🇻🇳 **Dịch**
> "Các mục tiếp theo trình bày ví dụ về hai protocol binding nền cho SOAP, cụ thể là HTTP 1.1 và email. Cần nhấn mạnh lại rằng **binding mang tính chuẩn mực duy nhất** cho các message SOAP 1.2 là binding tới HTTP 1.1. Các ví dụ ở mục 4.2 cho thấy email như một cơ chế transport chỉ nhằm gợi ý rằng có thể có các lựa chọn khác để chuyển SOAP message, dù chưa được chuẩn hoá vào thời điểm này."

> [!warning] Đừng nói quá
> SOAP **có thể** chạy trên protocol khác HTTP, nhưng SOAP 1.2 **chỉ chuẩn hoá binding tới HTTP**. Email binding chỉ là một W3C Note không mang tính chuẩn mực. Nói "SOAP chạy trên SMTP" là đúng về nguyên lý, nhưng trong thực tế 99% SOAP bạn gặp đều đi qua HTTP POST.

---

## 4. Cấu trúc message SOAP

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5 SOAP Message Construct
> "A SOAP message is specified as an XML infoset whose comment, element, attribute, namespace and character information items are able to be serialized as XML 1.0. […] A SOAP message Infoset consists of a document information item with exactly one member in its [children] property, which MUST be the SOAP Envelope element information item (see 5.1 SOAP Envelope)."

🇻🇳 **Dịch**
> "Một SOAP message được đặc tả như một XML infoset mà các information item comment, element, attribute, namespace và character của nó có thể serialize được thành XML 1.0. […] Một SOAP message Infoset gồm một document information item có **đúng một** phần tử con, và phần tử đó **PHẢI** là Envelope element information item."

### 4.1 Envelope

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.1 SOAP Envelope
> "The SOAP Envelope element information item has:
> A [local name] of Envelope .
> A [namespace name] of "http://www.w3.org/2003/05/soap-envelope".
> Zero or more namespace-qualified attribute information items amongst its [attributes] property.
> One or two element information items in its [children] property in order as follows:
> An optional Header element information item (see 5.2 SOAP Header).
> A mandatory Body element information item (see 5.3 SOAP Body)."

🇻🇳 **Dịch**
> "Envelope element information item của SOAP có:
> [local name] là Envelope.
> [namespace name] là "http://www.w3.org/2003/05/soap-envelope".
> Không hoặc nhiều attribute information item có namespace trong thuộc tính [attributes].
> Một hoặc hai element information item trong thuộc tính [children], theo thứ tự:
> Một Header element information item **không bắt buộc**.
> Một Body element information item **bắt buộc**."

💡 **Ví dụ đời sống — cái phong bì**

Hình dung bạn gửi một lá thư giấy:

- **Envelope** = cái phong bì. Nó không phải nội dung, nó chỉ là cái bọc bên ngoài. Nhưng có nó thì bưu điện mới xử lý được.
- **Header** = những gì bạn **ghi trên bì thư**: "Hoả tốc", "Thư bảo đảm — người nhận phải ký", "Hạn chót 22/06". Người đưa thư và các bưu cục trung chuyển đọc phần này để biết phải đối xử với lá thư ra sao. Người nhận cuối cùng có thể chẳng quan tâm. Phần này **không bắt buộc** — bạn hoàn toàn có thể gửi phong bì trơn.
- **Body** = **tờ giấy bên trong**, nội dung thật sự bạn muốn gửi. Phần này **bắt buộc** — gửi phong bì rỗng thì gửi làm gì.
- **Fault** = tờ giấy báo "không phát được thư" mà bưu điện nhét ngược lại vào phong bì trả về cho bạn. Nó vẫn đi trong cùng cái phong bì đó, vẫn nằm ở vị trí "nội dung", chỉ là nội dung báo lỗi.

Chi tiết "mustUnderstand" cũng khớp với hình ảnh này: một dòng ghi trên bì thư đánh dấu *bắt buộc*, nếu bưu cục trung chuyển không hiểu dòng đó thì không được lặng lẽ bỏ qua — phải trả thư về.

### 4.2 Header

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.2 SOAP Header
> "The SOAP Header element information item provides a mechanism for extending a SOAP message in a decentralized and modular way (see 3. SOAP Extensibility Model and 2.4 Understanding SOAP Header Blocks).
> The Header element information item has:
> A [local name] of Header .
> A [namespace name] of "http://www.w3.org/2003/05/soap-envelope".
> Zero or more namespace-qualified attribute information items in its [attributes] property.
> Zero or more namespace-qualified element information items in its [children] property.
> Each child element information item of the SOAP Header is called a SOAP header block."

🇻🇳 **Dịch**
> "Header element information item của SOAP cung cấp cơ chế để **mở rộng** một SOAP message theo hướng phi tập trung và mô-đun.
> Header element information item có:
> [local name] là Header.
> [namespace name] là "http://www.w3.org/2003/05/soap-envelope".
> Không hoặc nhiều attribute information item có namespace trong [attributes].
> Không hoặc nhiều element information item có namespace trong [children].
> **Mỗi phần tử con của SOAP Header được gọi là một SOAP header block.**"

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.2.3 SOAP mustUnderstand Attribute
> "The SOAP mustUnderstand attribute information item is used to indicate whether the processing of a SOAP header block is mandatory or optional (see 2.4 Understanding SOAP Header Blocks) […] Omitting this attribute information item is defined as being semantically equivalent to including it with a value of "false"."

🇻🇳 **Dịch**
> "Attribute information item `mustUnderstand` của SOAP được dùng để chỉ ra việc xử lý một SOAP header block là **bắt buộc hay tuỳ chọn**. […] Bỏ qua attribute này được định nghĩa là tương đương về ngữ nghĩa với việc ghi nó với giá trị "false"."

Đây là thứ REST không có tương đương chuẩn hoá: một cách để người gửi nói *"nếu anh không hiểu cái header này thì đừng xử lý message, hãy báo lỗi"*.

### 4.3 Body

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.3 SOAP Body
> "A SOAP body provides a mechanism for transmitting information to an ultimate SOAP receiver (see 2.5 Structure and Interpretation of SOAP Bodies).
> The Body element information item has:
> A [local name] of Body .
> A [namespace name] of "http://www.w3.org/2003/05/soap-envelope".
> Zero or more namespace-qualified attribute information items in its [attributes] property.
> Zero or more namespace-qualified element information items in its [children] property."

🇻🇳 **Dịch**
> "SOAP body cung cấp cơ chế truyền thông tin tới **ultimate SOAP receiver** (người nhận cuối cùng).
> Body element information item có:
> [local name] là Body.
> [namespace name] là "http://www.w3.org/2003/05/soap-envelope".
> Không hoặc nhiều attribute information item có namespace trong [attributes].
> Không hoặc nhiều element information item có namespace trong [children]."

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.3.1 SOAP Body child Element
> "SOAP defines one particular direct child of the SOAP body, the SOAP fault, which is used for reporting errors (see 5.4 SOAP Fault)."

🇻🇳 **Dịch**
> "SOAP định nghĩa một phần tử con trực tiếp đặc biệt của SOAP body, đó là **SOAP fault**, được dùng để báo lỗi."

Chú ý sự phân vai giữa Header và Body:

📖 **Nguyên văn** — SOAP 1.2 Part 1, §1.4 Example SOAP Message
> "In general, SOAP header blocks contain information which might be of use to SOAP intermediaries as well as the ultimate destination of the message. In this example an intermediary might prioritize the delivery of the message based on the priority and expiration information in the SOAP header block. The body contains the actual message payload, in this case the alert message."

🇻🇳 **Dịch**
> "Nhìn chung, các SOAP header block chứa thông tin có thể hữu ích cho các **SOAP intermediary** (nút trung gian) cũng như cho đích đến cuối cùng của message. Trong ví dụ này, một nút trung gian có thể ưu tiên việc chuyển message dựa trên thông tin priority và expiration trong SOAP header block. Body chứa **payload thật sự** của message, ở đây là nội dung cảnh báo."

### 4.4 Ví dụ message đầy đủ

📖 **Nguyên văn** — SOAP 1.2 Part 1, Example 1: SOAP message containing a SOAP header block and a SOAP body
> ```xml
> <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
>  <env:Header>
>   <n:alertcontrol xmlns:n="http://example.org/alertcontrol">
>    <n:priority>1</n:priority>
>    <n:expires>2001-06-22T14:00:00-05:00</n:expires>
>   </n:alertcontrol>
>  </env:Header>
>  <env:Body>
>   <m:alert xmlns:m="http://example.org/alert">
>    <m:msg>Pick up Mary at school at 2pm</m:msg>
>   </m:alert>
>  </env:Body>
> </env:Envelope>
> ```

🇻🇳 Message gồm một header block `alertcontrol` (độ ưu tiên + hạn hiệu lực, dành cho các nút trung gian đọc) và một body `alert` chứa nội dung thật: "Đón Mary ở trường lúc 2 giờ chiều". Cả hai đều nằm trong namespace riêng của ứng dụng (`example.org`), không phải namespace của SOAP.

### 4.5 Message đó khi đi qua HTTP

📖 **Nguyên văn** — SOAP 1.2 Part 0, Example 9 (phần HTTP header)
> ```
> POST /Reservations HTTP/1.1
> Host: travelcompany.example.org
> Content-Type: application/soap+xml; charset="utf-8"
> Content-Length: nnnn
> ```

🇻🇳 SOAP trên HTTP luôn là `POST` tới một endpoint duy nhất (ở đây `/Reservations`), với media type `application/soap+xml`. Không có chuyện dùng `GET /reservations/123` theo kiểu resource như REST — URL chỉ trỏ tới *service*, còn "muốn làm gì" nằm trong XML body. Đây là khác biệt kiến trúc lớn nhất so với [[02 - REST]].

---

## 5. SOAP Fault — cách SOAP báo lỗi

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4 SOAP Fault
> "A SOAP fault is used to carry error information within a SOAP message.
> The Fault element information item has:
> A [local name] of Fault .
> A [namespace name] of "http://www.w3.org/2003/05/soap-envelope".
> Two or more child element information items in its [children] property in order as follows:
> A mandatory Code element information item (see 5.4.1 SOAP Code Element).
> A mandatory Reason element information item (see 5.4.2 SOAP Reason Element).
> An optional Node element information item (see 5.4.3 SOAP Node Element).
> An optional Role element information item (see 5.4.4 SOAP Role Element).
> An optional Detail element information item (see 5.4.5 SOAP Detail Element)."

🇻🇳 **Dịch**
> "Một SOAP fault được dùng để chở thông tin lỗi bên trong một SOAP message.
> Fault element information item có:
> [local name] là Fault.
> [namespace name] là "http://www.w3.org/2003/05/soap-envelope".
> Hai hoặc nhiều phần tử con trong [children], **theo thứ tự** như sau:
> Một phần tử `Code` — **bắt buộc**.
> Một phần tử `Reason` — **bắt buộc**.
> Một phần tử `Node` — tuỳ chọn.
> Một phần tử `Role` — tuỳ chọn.
> Một phần tử `Detail` — tuỳ chọn."

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4 (tiếp)
> "To be recognized as carrying SOAP error information, a SOAP message MUST contain a single SOAP Fault element information item as the only child element information item of the SOAP Body .
> When generating a fault, SOAP senders MUST NOT include additional element information items in the SOAP Body ."

🇻🇳 **Dịch**
> "Để được nhận diện là đang chở thông tin lỗi SOAP, một SOAP message **PHẢI** chứa đúng một phần tử `Fault` và đó phải là **phần tử con duy nhất** của SOAP Body.
> Khi sinh ra một fault, người gửi SOAP **KHÔNG ĐƯỢC** đưa thêm phần tử nào khác vào SOAP Body."

### 5.1 Code

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4.1 SOAP Code Element
> "The Code element information item has:
> A [local name] of Code .
> A [namespace name] of http://www.w3.org/2003/05/soap-envelope .
> One or two child element information items in its [children] property, in order, as follows:
> A mandatory Value element information item as described below (see 5.4.1.1 SOAP Value element (with Code parent))
> An optional Subcode element information item as described below (see 5.4.1.2 SOAP Subcode element)."

🇻🇳 **Dịch**
> "Phần tử `Code` có:
> [local name] là Code.
> [namespace name] là http://www.w3.org/2003/05/soap-envelope.
> Một hoặc hai phần tử con trong [children], theo thứ tự:
> Một phần tử `Value` — **bắt buộc**.
> Một phần tử `Subcode` — tuỳ chọn."

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4.6 SOAP Fault Codes
> "SOAP fault codes are XML expanded names, and are intended to provide a means by which faults are classified. A hierarchical list of SOAP codes and associated supporting information is included in every SOAP fault message, with each such code identifying the fault category at an increasing level of detail. […] Additional fault subcodes MAY be created for use by applications or features."

🇻🇳 **Dịch**
> "Các SOAP fault code là các XML expanded name, nhằm cung cấp phương tiện để **phân loại** lỗi. Một danh sách code có **phân cấp** cùng thông tin hỗ trợ đi kèm được đưa vào mọi SOAP fault message, mỗi code xác định phạm trù lỗi ở mức chi tiết tăng dần. […] Có thể tạo thêm fault subcode để ứng dụng hoặc feature sử dụng."

Bảng 5 fault code chuẩn (SOAP 1.2 Part 1, Table 4) — trích nguyên văn phần "Meaning":

📖 **Nguyên văn** — SOAP 1.2 Part 1, Table 4: SOAP Fault Codes

| Local Name | Meaning (nguyên văn) |
|---|---|
| `VersionMismatch` | "The faulting node found an invalid element information item instead of the expected Envelope element information item. The namespace, local name or both did not match the Envelope element information item required by this recommendation" |
| `MustUnderstand` | "An immediate child element information item of the SOAP Header element information item targeted at the faulting node that was not understood by the faulting node contained a SOAP mustUnderstand attribute information item with a value of "true"" |
| `DataEncodingUnknown` | "A SOAP header block or SOAP body child element information item targeted at the faulting SOAP node is scoped […] with a data encoding that the faulting node does not support." |
| `Sender` | "The message was incorrectly formed or did not contain the appropriate information in order to succeed. For example, the message could lack the proper authentication or payment information. It is generally an indication that the message is not to be resent without change" |
| `Receiver` | "The message could not be processed for reasons attributable to the processing of the message rather than to the contents of the message itself. For example, processing could include communicating with an upstream SOAP node, which did not respond. The message could succeed if resent at a later point in time" |

🇻🇳 **Dịch**
> - `VersionMismatch`: nút gặp lỗi tìm thấy một phần tử không hợp lệ ở chỗ đáng ra phải là phần tử `Envelope`. Namespace, local name, hoặc cả hai, không khớp với `Envelope` mà khuyến nghị này yêu cầu.
> - `MustUnderstand`: một phần tử con trực tiếp của `Header` nhắm tới nút gặp lỗi, mà nút đó không hiểu, lại có attribute `mustUnderstand` với giá trị "true".
> - `DataEncodingUnknown`: một SOAP header block hoặc phần tử con của Body nhắm tới nút gặp lỗi được gán một kiểu data encoding mà nút đó không hỗ trợ.
> - `Sender`: message bị tạo sai hoặc thiếu thông tin cần thiết để thành công. Ví dụ, message có thể thiếu thông tin authentication hoặc thanh toán phù hợp. Nhìn chung đây là dấu hiệu **không nên gửi lại message y nguyên**.
> - `Receiver`: message không xử lý được vì lý do thuộc về **quá trình xử lý** chứ không phải nội dung message. Ví dụ, việc xử lý có thể phải liên lạc với một SOAP node phía trên và nút đó không phản hồi. Message **có thể thành công nếu gửi lại sau**.

> [!tip] Sender / Receiver chính là 4xx / 5xx bản SOAP
> Về ý niệm, `env:Sender` ≈ lỗi phía client (đừng gửi lại y nguyên), `env:Receiver` ≈ lỗi phía server (thử lại sau có thể được). Đây là *nhận định đối chiếu*, spec không nói câu đó — nhưng phần "Meaning" trích ở trên mô tả đúng ngữ nghĩa retry/không-retry này.

### 5.2 Reason

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4.2 SOAP Reason Element
> "The Reason element information item is intended to provide a human-readable explanation of the fault.
> The Reason element information item has:
> A [local name] of Reason .
> A [namespace name] of http://www.w3.org/2003/05/soap-envelope .
> One or more Text element information item children (see 5.4.2.1 SOAP Text Element). Each child Text element information item SHOULD have a different value for its xml:lang attribute information item."

🇻🇳 **Dịch**
> "Phần tử `Reason` nhằm cung cấp một lời giải thích **cho người đọc** về fault.
> Phần tử `Reason` có:
> [local name] là Reason.
> [namespace name] là http://www.w3.org/2003/05/soap-envelope.
> Một hoặc nhiều phần tử con `Text`. Mỗi phần tử `Text` con **NÊN** có giá trị `xml:lang` khác nhau."

Tức là Reason được thiết kế sẵn cho **đa ngôn ngữ**: cùng một lỗi có thể kèm bản tiếng Anh, tiếng Việt, tiếng Nhật, phân biệt bằng `xml:lang`.

### 5.3 Detail

📖 **Nguyên văn** — SOAP 1.2 Part 1, §5.4.5 SOAP Detail Element
> "The Detail element information item is intended for carrying application specific error information.
> The Detail element information item has:
> A [local name] of Detail .
> A [namespace name] of http://www.w3.org/2003/05/soap-envelope .
> Zero or more attribute information items in its [attributes] property.
> Zero or more child element information items in its [children] property.
> […] For example, the Detail element information item might contain information about a message not containing the proper credentials, a timeout, etc. The presence of the Detail element information item has no significance as to which parts of the faulty SOAP message were processed.
> All child element information items of the Detail element information item are called detail entries […]"

🇻🇳 **Dịch**
> "Phần tử `Detail` nhằm chở **thông tin lỗi đặc thù của ứng dụng**.
> Phần tử `Detail` có:
> [local name] là Detail.
> [namespace name] là http://www.w3.org/2003/05/soap-envelope.
> Không hoặc nhiều attribute information item trong [attributes].
> Không hoặc nhiều phần tử con trong [children].
> […] Ví dụ, phần tử `Detail` có thể chứa thông tin về việc message không mang đúng credentials, về một timeout, v.v. **Sự có mặt của `Detail` không nói lên điều gì về việc phần nào của message lỗi đã được xử lý.**
> Mọi phần tử con của `Detail` được gọi là **detail entry**."

### 5.4 Ví dụ Fault nguyên văn

📖 **Nguyên văn** — SOAP 1.2 Part 1, Example 4: Sample SOAP fault
> ```xml
> <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"
>               xmlns:m="http://www.example.org/timeouts"
>               xmlns:xml="http://www.w3.org/XML/1998/namespace">
>  <env:Body>
>   <env:Fault>
>    <env:Code>
>      <env:Value>env:Sender</env:Value>
>      <env:Subcode>
>       <env:Value>m:MessageTimeout</env:Value>
>      </env:Subcode>
>    </env:Code>
>    <env:Reason>
>      <env:Text xml:lang="en">Sender Timeout</env:Text>
>    </env:Reason>
>    <env:Detail>
>      <m:MaxTime>P5M</m:MaxTime>
>    </env:Detail>
>   </env:Fault>
>  </env:Body>
> </env:Envelope>
> ```

🇻🇳 Fault này nói: phạm trù lỗi là `env:Sender` (lỗi thuộc về bên gửi), chi tiết hơn là `m:MessageTimeout` do ứng dụng tự định nghĩa, mô tả cho người đọc là "Sender Timeout", và phần `Detail` đặc thù ứng dụng cho biết thời gian tối đa cho phép là `P5M` (5 phút, theo định dạng duration của XML Schema).

📖 **Nguyên văn** — SOAP 1.2 Part 1, Example 7: SOAP fault generated as a result of not understanding Extension1 and Extension2
> ```xml
> <?xml version="1.0" ?>
> <env:Envelope xmlns:env='http://www.w3.org/2003/05/soap-envelope'
>               xmlns:xml='http://www.w3.org/XML/1998/namespace'>
>  <env:Header>
>   <env:NotUnderstood qname='abc:Extension1'
>                    xmlns:abc='http://example.org/2001/06/ext' />
>   <env:NotUnderstood qname='def:Extension2'
>                    xmlns:def='http://example.com/stuff' />
>  </env:Header>
>  <env:Body>
>   <env:Fault>
>    <env:Code><env:Value>env:MustUnderstand</env:Value></env:Code>
>    <env:Reason>
>      <env:Text xml:lang='en'>One or more mandatory
>        SOAP header blocks not understood
>      </env:Text>
>    </env:Reason>
>   </env:Fault>
>  </env:Body>
> </env:Envelope>
> ```

🇻🇳 Đây là fault sinh ra khi node nhận gặp các header block đánh dấu `mustUnderstand="true"` mà nó không hiểu. Chú ý: chính fault này cũng dùng Header — các phần tử `env:NotUnderstood` liệt kê đích danh tên (qname) của những header block gây vấn đề, để bên gửi biết phải bỏ bớt cái gì.

---

## 6. WSDL — bản contract của SOAP

SOAP mô tả *cách đóng gói* message, nhưng không mô tả *dịch vụ có những operation nào, nhận gì, trả gì*. Việc đó là của WSDL.

📖 **Nguyên văn** — WSDL 2.0 Part 1: Core Language, Abstract
> "This document describes the Web Services Description Language Version 2.0 (WSDL 2.0), an XML language for describing Web services. This specification defines the core language which can be used to describe Web services based on an abstract model of what the service offers. It also defines the conformance criteria for documents in this language."

🇻🇳 **Dịch**
> "Tài liệu này mô tả Web Services Description Language Version 2.0 (WSDL 2.0), **một ngôn ngữ XML để mô tả các Web service**. Đặc tả này định nghĩa ngôn ngữ lõi có thể dùng để mô tả Web service dựa trên một mô hình trừu tượng về những gì dịch vụ cung cấp. Nó cũng định nghĩa tiêu chí tuân thủ cho các tài liệu viết bằng ngôn ngữ này."

📖 **Nguyên văn** — WSDL 2.0 Part 1, §1 Introduction
> "Web Services Description Language Version 2.0 (WSDL 2.0) provides a model and an XML format for describing Web services. WSDL 2.0 enables one to separate the description of the abstract functionality offered by a service from concrete details of a service description such as "how" and "where" that functionality is offered."

🇻🇳 **Dịch**
> "WSDL 2.0 cung cấp một mô hình và một định dạng XML để mô tả Web service. WSDL 2.0 cho phép **tách phần mô tả chức năng trừu tượng** mà một dịch vụ cung cấp **khỏi các chi tiết cụ thể** của bản mô tả dịch vụ, chẳng hạn "bằng cách nào" và "ở đâu" chức năng đó được cung cấp."

### Hai tầng: abstract và concrete

📖 **Nguyên văn** — WSDL 2.0 Part 1, §1.1 Service Description
> "WSDL 2.0 describes a Web service in two fundamental stages: one abstract and one concrete. […] At an abstract level, WSDL 2.0 describes a Web service in terms of the messages it sends and receives; messages are described independent of a specific wire format using a type system, typically XML Schema.
> An operation associates a message exchange pattern with one or more messages. A message exchange pattern identifies the sequence and cardinality of messages sent and/or received as well as who they are logically sent to and/or received from. An interface groups together operations without any commitment to transport or wire format.
> At a concrete level, a binding specifies transport and wire format details for one or more interfaces. An endpoint associates a network address with a binding. And finally, a service groups together endpoints that implement a common interface."

🇻🇳 **Dịch**
> "WSDL 2.0 mô tả một Web service theo hai giai đoạn nền tảng: một trừu tượng và một cụ thể. […] Ở mức **trừu tượng**, WSDL 2.0 mô tả Web service theo các message mà nó gửi và nhận; message được mô tả độc lập với một wire format cụ thể, bằng một hệ kiểu (type system), thường là XML Schema.
> Một **operation** gắn một message exchange pattern với một hoặc nhiều message. Một message exchange pattern xác định thứ tự và số lượng các message được gửi và/hoặc nhận, cũng như chúng được gửi tới ai / nhận từ ai về mặt logic. Một **interface** gom các operation lại với nhau mà không cam kết gì về transport hay wire format.
> Ở mức **cụ thể**, một **binding** đặc tả chi tiết transport và wire format cho một hoặc nhiều interface. Một **endpoint** gắn một địa chỉ mạng với một binding. Và cuối cùng, một **service** gom các endpoint cùng hiện thực một interface chung."

📖 **Nguyên văn** — WSDL 2.0 Part 1, §2.1.2 XML Representation of Description Component
> ```xml
> <description
>       targetNamespace="xs:anyURI" >
>   <documentation />*
>   [ <import /> | <include /> ]*
>   <types />?
>   [ <interface /> | <binding /> | <service /> ]*
> </description>
> ```

🇻🇳 Đây là khung xương của một tài liệu WSDL 2.0: gốc là `<description>`, bên trong lần lượt là `<types>` (định nghĩa kiểu dữ liệu, thường bằng XML Schema), rồi các `<interface>` (operation trừu tượng), `<binding>` (gắn với transport, ví dụ SOAP-over-HTTP) và `<service>` (endpoint thật, có địa chỉ mạng).

### WSDL nói gì về ý nghĩa của một contract

📖 **Nguyên văn** — WSDL 2.0 Part 1, §1.2 The Meaning of a Service Description
> "A WSDL 2.0 service description indicates how potential clients are intended to interact with the described service. It represents an assertion that the described service fully implements and conforms to what the WSDL 2.0 document describes."

🇻🇳 **Dịch**
> "Một bản mô tả dịch vụ WSDL 2.0 chỉ ra cách mà các client tiềm năng **được kỳ vọng** sẽ tương tác với dịch vụ được mô tả. Nó thể hiện một **khẳng định** rằng dịch vụ được mô tả hiện thực đầy đủ và tuân thủ đúng những gì tài liệu WSDL 2.0 mô tả."

📖 **Nguyên văn** — WSDL 2.0 Part 1, §1 Introduction
> "The companion specification, Web Services Description Language (WSDL) Version 2.0 Part 2: Adjuncts [WSDL 2.0 Adjuncts] describes extensions for message exchange patterns, operation safety, operation styles and binding extensions (for SOAP [SOAP 1.2 Part 1: Messaging Framework (Second Edition)] and HTTP [IETF RFC 2616])."

🇻🇳 **Dịch**
> "Đặc tả đi kèm, WSDL Version 2.0 Part 2: Adjuncts, mô tả các extension cho message exchange pattern, tính an toàn của operation, kiểu operation, và các binding extension (**cho SOAP** và **cho HTTP**)."

Tức là: WSDL không phải "ngôn ngữ chỉ dành cho SOAP". Nhưng binding SOAP là một trong hai binding được chuẩn hoá kèm, và trên thực tế WSDL gần như luôn đi cùng SOAP.

> [!note] WSDL là tiền thân của ý tưởng OpenAPI
> Cùng một bài toán: *làm sao để client biết trước server có những operation nào, tham số kiểu gì, trả về kiểu gì — mà không cần đọc tài liệu do người viết tay?*
> - Thế giới SOAP giải bằng **WSDL** (XML, do server công bố, tool sinh ra client stub tự động).
> - Thế giới REST sau này giải bằng [[08 - OpenAPI Specification]] (YAML/JSON, cũng sinh được client và server stub).
> Khác biệt lớn: WSDL là **bắt buộc trên thực tế** trong hệ SOAP — không có WSDL thì rất khó gọi được service. Còn OpenAPI với REST là **tuỳ chọn**, thêm vào sau. Đây là nhận định đối chiếu, không phải câu trích từ spec.

---

## 7. Ghi chú về họ WS-\*

Bạn sẽ nghe rất nhiều tên bắt đầu bằng `WS-`. Nguồn gốc của chúng nằm ngay trong thiết kế SOAP: spec cố tình để trống các tính năng "reliability", "security", "correlation", "routing" (xem câu trích ở mục 1) và giao cho các đặc tả khác.

Các nguồn W3C dùng trong bài này chỉ nhắc đích danh **một** thành viên của họ WS-\*:

📖 **Nguyên văn** — WSDL 2.0 Part 1, §2 (mô tả thuộc tính `{address}` của Endpoint component)
> "The {address} property is optional to allow for means other than IRIs to be used, e.g. a WS-Addressing Endpoint Reference [WSA 1.0 Core]. It is also possible that, in certain scenarios, an address will not be required, in which case this property may be absent."

🇻🇳 **Dịch**
> "Thuộc tính `{address}` là tuỳ chọn, để cho phép dùng các cách khác ngoài IRI, ví dụ một **WS-Addressing Endpoint Reference**. Cũng có khả năng trong một số tình huống, địa chỉ là không cần thiết, khi đó thuộc tính này có thể vắng mặt."

> [!warning] Bài này không liệt kê thêm tên WS-* nào khác
> Các đặc tả WS-\* khác mà bạn có thể gặp trong tài liệu của đối tác (ví dụ những thứ liên quan tới security hay reliable messaging) **không được nhắc đích danh** trong ba tài liệu W3C dùng làm nguồn cho bài này, nên ở đây không liệt kê để tránh nói sai. Khi gặp một tên `WS-` cụ thể trong dự án, hãy tra thẳng spec của nó.

Điều chắc chắn có thể nói dựa trên nguồn: **SOAP cố ý không tự làm security và reliability**, và cơ chế để bổ sung chúng là SOAP header block cộng với SOAP modules:

📖 **Nguyên văn** — SOAP 1.2 Part 1, §4.1 Goals of the Binding Framework
> "Two or more bindings can offer a given optional feature, such as reliable delivery, using different means. One binding might exploit an underlying protocol that directly facilitates the feature (e.g., the protocol is reliable), and the other binding might provide the necessary logic itself (e.g., reliability is achieved via logging and retransmission). In such cases, the feature can be made available to applications in a consistent manner, regardless of which binding is used."

🇻🇳 **Dịch**
> "Hai hay nhiều binding có thể cung cấp cùng một feature tuỳ chọn, chẳng hạn **reliable delivery**, bằng những cách khác nhau. Một binding có thể khai thác protocol nền vốn đã hỗ trợ trực tiếp feature đó (ví dụ protocol vốn đã tin cậy), còn binding kia tự cung cấp phần logic cần thiết (ví dụ đạt độ tin cậy bằng cách ghi log và truyền lại). Trong các trường hợp như vậy, feature có thể được cung cấp cho ứng dụng một cách nhất quán, bất kể binding nào đang được dùng."

---

## 8. Vì sao SOAP nặng — và vì sao nó vẫn tồn tại

Từ chính các câu trích ở trên, có thể rút ra bức tranh:

**Nặng ở đâu**
- Mọi message đều là XML có namespace, kể cả khi payload chỉ là một con số. So với JSON thì dài hơn nhiều lần.
- Muốn gọi service phải có WSDL, phải sinh stub, phải có tooling.
- Lỗi không đọc được bằng mắt qua HTTP status — phải parse XML để tìm `env:Fault`.

**Đổi lại được gì**
- **Contract cứng**: WSDL là *"an assertion that the described service fully implements and conforms to what the WSDL 2.0 document describes"* (WSDL 2.0, §1.2). Sinh client stub tự động, sai kiểu là biết ngay lúc build.
- **Mở rộng có kỷ luật**: header block + `mustUnderstand` cho phép thêm tính năng mà vẫn đảm bảo bên nhận không lặng lẽ bỏ qua thứ quan trọng. REST không có cơ chế tương đương được chuẩn hoá.
- **Không phụ thuộc transport**: cùng một message đi được qua HTTP hay email (§4 Part 1, §4.2 Part 0).
- **Lỗi có cấu trúc và đa ngôn ngữ**: `Code` phân cấp cho máy đọc, `Reason` đa `xml:lang` cho người đọc, `Detail` cho dữ liệu riêng của ứng dụng.

Ba thứ cuối chính là lý do các hệ thống ngân hàng, bảo hiểm, ERP, hải quan, logistics vẫn giữ SOAP: họ cần contract cứng và message có thể audit được, hơn là cần nhẹ và nhanh.

> [!tip] Khi bị giao một SOAP endpoint, làm gì trước
> 1. Xin file WSDL (thường là `?wsdl` sau URL service, hoặc đối tác gửi file).
> 2. Đọc `<interface>` để biết có operation nào; đọc `<types>` để biết schema input/output.
> 3. Đọc `<service>`/`<endpoint>` để lấy địa chỉ thật.
> 4. Dùng tool sinh client thay vì tự ghép XML bằng tay — cấu trúc namespace của SOAP rất dễ sai và lỗi sinh ra sẽ là `env:Sender` mơ hồ.

---

## Liên kết

- [[02 - REST]] — đối chiếu trực tiếp: SOAP là protocol, REST là architectural style; SOAP dùng một endpoint + operation trong body, REST dùng resource + HTTP method.
- [[08 - OpenAPI Specification]] — WSDL là tiền thân của ý tưởng "contract máy đọc được"; OpenAPI làm điều tương tự cho REST.
- [[02 - What is HTTP]] — HTTP là binding chuẩn mực duy nhất của SOAP 1.2; SOAP trên HTTP luôn là POST với `Content-Type: application/soap+xml`.
- [[11 - NULL, Hàm String, Date và JSON]] — đối chiếu XML (SOAP) với JSON, định dạng payload phổ biến của API hiện đại.

## Nguồn tham khảo

- SOAP Version 1.2 Part 1: Messaging Framework (W3C Recommendation) : https://www.w3.org/TR/soap12-part1/
- SOAP Version 1.2 Part 0: Primer (W3C Recommendation) : https://www.w3.org/TR/soap12-part0/
- Web Services Description Language (WSDL) Version 2.0 Part 1: Core Language (W3C Recommendation) : https://www.w3.org/TR/wsdl20/
