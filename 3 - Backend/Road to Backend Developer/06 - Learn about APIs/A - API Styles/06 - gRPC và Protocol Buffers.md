# 06 — gRPC và Protocol Buffers

> **Nguồn chính:** gRPC Documentation — https://grpc.io/docs/what-is-grpc/introduction/ và https://grpc.io/docs/what-is-grpc/core-concepts/ · Protocol Buffers Documentation — https://protobuf.dev/overview/
> Bài này bám các mục: *Introduction to gRPC*, *Core concepts, architecture and lifecycle* (4 loại service method, RPC life cycle, Deadlines, Cancellation, Metadata, Channels), *Protocol Buffers Overview* và *FAQ*.

---

## 1. gRPC là gì?

📖 **Nguyên văn** — gRPC FAQ
> "gRPC is a modern, open source remote procedure call (RPC) framework that can run anywhere. It enables client and server applications to communicate transparently, and makes it easier to build connected systems."

🇻🇳 **Dịch**
> "gRPC là một framework remote procedure call (RPC) hiện đại, mã nguồn mở, có thể chạy ở bất cứ đâu. Nó cho phép các ứng dụng client và server giao tiếp với nhau một cách trong suốt (transparently), và giúp việc xây dựng các hệ thống kết nối trở nên dễ dàng hơn."

📖 **Nguyên văn** — gRPC FAQ, "What does gRPC stand for?"
> "gRPC Remote Procedure Calls, of course!"

🇻🇳 **Dịch**
> "gRPC Remote Procedure Calls, tất nhiên rồi!" (tên viết tắt đệ quy — chữ g trong gRPC lại chính là gRPC)

---

## 2. RPC — gọi hàm ở máy khác như gọi hàm local

Đây là tư tưởng cốt lõi. Tài liệu nói thẳng:

📖 **Nguyên văn** — Introduction to gRPC, mục *Overview*
> "In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. On the server side, the server implements this interface and runs a gRPC server to handle client calls. On the client side, the client has a stub (referred to as just a client in some languages) that provides the same methods as the server."

🇻🇳 **Dịch**
> "Trong gRPC, một ứng dụng client có thể gọi trực tiếp một method trên một ứng dụng server nằm ở máy khác *như thể nó là một local object*, khiến việc tạo ra các ứng dụng và service phân tán trở nên dễ hơn. Giống như nhiều hệ thống RPC khác, gRPC xoay quanh ý tưởng định nghĩa một service, chỉ rõ những method nào có thể được gọi từ xa cùng với parameter và kiểu trả về của chúng. Ở phía server, server implement interface này và chạy một gRPC server để xử lý các lời gọi từ client. Ở phía client, client có một stub (ở một số ngôn ngữ chỉ gọi đơn giản là client) cung cấp đúng những method giống như server."

💡 **Ví dụ đời sống**
Bạn ở nhà và muốn pha cà phê. Nếu tự pha — đó là **gọi hàm local**. Nếu bạn bấm một nút trên bộ đàm, và ở quán bên kia đường có người pha rồi mang sang — đó là **RPC**: bạn vẫn chỉ làm đúng một thao tác "bấm nút `phaCaPhe(loại, đường)`", còn chuyện ai pha, pha ở đâu, đi đường nào là do hạ tầng lo. Cái stub chính là cái bộ đàm: nó *trông giống hệt* cái nút bấm ở nhà bạn.

### 2.1. Khác biệt tư duy so với REST

> [!note] Mục này là nhận định tổng hợp, không phải trích nguyên văn.
> [[02 - REST]] xoay quanh **resource**: bạn định danh một tài nguyên bằng URL rồi tác động lên nó bằng các method chung của HTTP (`GET /users/42`, `DELETE /orders/7`). gRPC xoay quanh **procedure/method**: bạn định nghĩa danh sách hàm gọi được (`SayHello`, `LotsOfReplies`) rồi gọi đúng tên hàm đó. Câu hỏi đầu tiên khi thiết kế REST là "hệ thống của tôi có những *danh từ* nào?"; câu hỏi đầu tiên khi thiết kế gRPC là "hệ thống của tôi có những *động từ* nào?".

Bản thân tài liệu gRPC cũng thừa nhận sự khác biệt này:

📖 **Nguyên văn** — gRPC FAQ, "Why is gRPC better/worse than REST?"
> "gRPC largely follows HTTP semantics over HTTP/2 but we explicitly allow for full-duplex streaming. We diverge from typical REST conventions as we use static paths for performance reasons during call dispatch as parsing call parameters from paths, query parameters and payload body adds latency and complexity. We have also formalized a set of errors that we believe are more directly applicable to API use cases than the HTTP status codes."

🇻🇳 **Dịch**
> "gRPC phần lớn tuân theo ngữ nghĩa HTTP chạy trên HTTP/2 nhưng chúng tôi cho phép một cách tường minh việc streaming song công hoàn toàn (full-duplex). Chúng tôi đi chệch khỏi các quy ước REST thông thường ở chỗ dùng các đường dẫn tĩnh (static paths) vì lý do hiệu năng khi điều phối lời gọi, bởi việc phân tích parameter của lời gọi từ đường dẫn, query parameter và phần thân payload làm tăng độ trễ và độ phức tạp. Chúng tôi cũng đã chuẩn hoá một tập lỗi mà chúng tôi tin là áp dụng trực tiếp hơn cho các trường hợp dùng API so với các HTTP status code."

---

## 3. Protocol Buffers

📖 **Nguyên văn** — Protocol Buffers Overview
> "Protocol Buffers are a language-neutral, platform-neutral extensible mechanism for serializing structured data."

🇻🇳 **Dịch**
> "Protocol Buffers là một cơ chế trung lập về ngôn ngữ, trung lập về nền tảng, có thể mở rộng, dùng để serialize dữ liệu có cấu trúc."

📖 **Nguyên văn** — Protocol Buffers Overview
> "It’s like JSON, except it’s smaller and faster, and it generates native language bindings. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages."

🇻🇳 **Dịch**
> "Nó giống JSON, chỉ khác là nhỏ hơn và nhanh hơn, và nó sinh ra các binding native cho từng ngôn ngữ. Bạn định nghĩa dữ liệu của mình có cấu trúc thế nào *một lần duy nhất*, sau đó bạn có thể dùng phần source code được sinh ra để dễ dàng ghi và đọc dữ liệu có cấu trúc đó từ/ra nhiều loại luồng dữ liệu khác nhau và bằng nhiều ngôn ngữ khác nhau."

### 3.1. Ba vai trò trong một cái tên

Tài liệu định nghĩa protobuf không phải là *một* thứ mà là một tổ hợp:

📖 **Nguyên văn** — Protocol Buffers Overview
> "Protocol buffers are a combination of the definition language (created in .proto files), the code that the proto compiler generates to interface with data, language-specific runtime libraries, the serialization format for data that is written to a file (or sent across a network connection), and the serialized data."

🇻🇳 **Dịch**
> "Protocol buffers là sự kết hợp của: ngôn ngữ định nghĩa (viết trong các file .proto), phần code mà proto compiler sinh ra để làm việc với dữ liệu, các thư viện runtime riêng cho từng ngôn ngữ, định dạng serialization cho dữ liệu được ghi ra file (hoặc gửi qua kết nối mạng), và bản thân dữ liệu đã được serialize."

Từ định nghĩa trên, ta tách ra 3 vai trò để dễ nhớ:

| Vai trò | Là gì | Tương ứng trong trích dẫn |
|---|---|---|
| **IDL** (Interface Definition Language) | Ngôn ngữ để mô tả contract: service có method nào, message có field nào | "the definition language (created in .proto files)" |
| **Wire format** (định dạng nhị phân) | Cách dữ liệu được mã hoá thành bytes để lưu file hoặc gửi qua mạng | "the serialization format for data that is written to a file (or sent across a network connection)" |
| **Code generator** | proto compiler đọc `.proto` và sinh class/hàm cho ngôn ngữ của bạn | "the code that the proto compiler generates to interface with data" |

Vai trò IDL được gRPC nói rõ:

📖 **Nguyên văn** — gRPC Core concepts, mục *Service definition*
> "By default, gRPC uses protocol buffers as the Interface Definition Language (IDL) for describing both the service interface and the structure of the payload messages. It is possible to use other alternatives if desired."

🇻🇳 **Dịch**
> "Mặc định, gRPC dùng protocol buffers làm Interface Definition Language (IDL) để mô tả cả interface của service lẫn cấu trúc của các payload message. Có thể dùng các lựa chọn thay thế khác nếu muốn."

💡 **Ví dụ đời sống**
Nghĩ tới một tờ **hợp đồng mẫu có sẵn ô điền**. Ngôn ngữ pháp lý dùng để soạn mẫu = IDL. Tờ hợp đồng đã điền và được nén lại thành mã vạch để máy quét đọc = wire format. Cái máy in ra sẵn biểu mẫu bằng tiếng Việt cho bên A và tiếng Nhật cho bên B, từ *cùng một* bản mẫu = code generator.

### 3.2. Vì sao nhỏ và nhanh — và cái giá phải trả

📖 **Nguyên văn** — Protocol Buffers Overview, mục *What are the Benefits of Using Protocol Buffers?*
> "Some of the advantages of using protocol buffers include:
>
> - Compact data storage
> - Fast parsing
> - Availability in many programming languages
> - Optimized functionality through automatically-generated classes"

🇻🇳 **Dịch**
> "Một số ưu điểm của việc dùng protocol buffers gồm:
>
> - Lưu trữ dữ liệu gọn nhẹ
> - Phân tích (parse) nhanh
> - Có sẵn ở nhiều ngôn ngữ lập trình
> - Chức năng được tối ưu thông qua các class sinh tự động"

> [!warning] Protobuf không tự mô tả chính nó
> 📖 **Nguyên văn** — Protocol Buffers Overview, mục *When are Protocol Buffers not a Good Fit?*
> > "Protocol buffer messages don’t inherently self-describe their data, but they have a fully reflective schema that you can use to implement self-description. That is, you cannot fully interpret one without access to its corresponding .proto file."
>
> 🇻🇳 **Dịch**
> > "Các protocol buffer message về bản chất không tự mô tả dữ liệu của chúng, nhưng chúng có một schema phản chiếu (reflective) đầy đủ mà bạn có thể dùng để hiện thực khả năng tự mô tả. Nghĩa là, bạn không thể diễn giải trọn vẹn một message nếu không có file .proto tương ứng."
>
> Khác hẳn JSON: mở một file JSON bằng text editor là đọc được ngay. Mở một payload protobuf thì chỉ thấy bytes.

Một hạn chế khác cần biết:

📖 **Nguyên văn** — Protocol Buffers Overview
> "Protocol buffers tend to assume that entire messages can be loaded into memory at once and are not larger than an object graph. For data that exceeds a few megabytes, consider a different solution; when working with larger data, you may effectively end up with several copies of the data due to serialized copies, which can cause surprising spikes in memory usage."

🇻🇳 **Dịch**
> "Protocol buffers có xu hướng giả định rằng toàn bộ message có thể được nạp vào bộ nhớ cùng một lúc và không lớn hơn một object graph. Với dữ liệu vượt quá vài megabyte, hãy cân nhắc một giải pháp khác; khi làm việc với dữ liệu lớn hơn, thực tế bạn có thể kết thúc với vài bản sao của dữ liệu do các bản copy đã serialize, điều này có thể gây ra những đợt tăng vọt bộ nhớ bất ngờ."

---

## 4. File `.proto` — contract viết ở đâu

📖 **Nguyên văn** — Introduction to gRPC, mục *Working with Protocol Buffers*
> "The first step when working with protocol buffers is to define the structure for the data you want to serialize in a proto file: this is an ordinary text file with a .proto extension. Protocol buffer data is structured as messages, where each message is a small logical record of information containing a series of name-value pairs called fields."

🇻🇳 **Dịch**
> "Bước đầu tiên khi làm việc với protocol buffers là định nghĩa cấu trúc cho dữ liệu bạn muốn serialize trong một file proto: đây là một file văn bản thông thường với phần mở rộng .proto. Dữ liệu protocol buffer được cấu trúc thành các *message*, trong đó mỗi message là một bản ghi logic nhỏ chứa một loạt cặp tên-giá trị gọi là *field*."

📖 **Nguyên văn** — Introduction to gRPC (ví dụ message gốc trong tài liệu)
> ```proto
> message Person {
>   string name = 1;
>   int32 id = 2;
>   bool has_ponycopter = 3;
> }
> ```

🇻🇳 Một message `Person` với 3 field; các số `1`, `2`, `3` là *field number* — định danh của field trong wire format nhị phân, không phải giá trị.

Còn đây là ví dụ **định nghĩa service** nguyên văn trong tài liệu:

📖 **Nguyên văn** — Introduction to gRPC
> "You define gRPC services in ordinary proto files, with RPC method parameters and return types specified as protocol buffer messages:"
> ```proto
> // The greeter service definition.
> service Greeter {
>   // Sends a greeting
>   rpc SayHello (HelloRequest) returns (HelloReply) {}
> }
>
> // The request message containing the user's name.
> message HelloRequest {
>   string name = 1;
> }
>
> // The response message containing the greetings
> message HelloReply {
>   string message = 1;
> }
> ```

🇻🇳 **Dịch**
> "Bạn định nghĩa các gRPC service trong những file proto thông thường, với parameter và kiểu trả về của RPC method được chỉ định dưới dạng các protocol buffer message:" — khối code: service `Greeter` có đúng một method `SayHello`, nhận vào message `HelloRequest`, trả về message `HelloReply`.

Tài liệu Core concepts đưa thêm một ví dụ service khác, cũng nguyên văn:

📖 **Nguyên văn** — gRPC Core concepts, mục *Service definition*
> ```proto
> service HelloService {
>   rpc SayHello (HelloRequest) returns (HelloResponse);
> }
>
> message HelloRequest {
>   string greeting = 1;
> }
>
> message HelloResponse {
>   string reply = 1;
> }
> ```

🇻🇳 Cùng một cấu trúc: một `service` chứa các `rpc`, và các `message` mô tả request/response của chúng.

Phía tài liệu Protocol Buffers cũng nhắc lại cách định nghĩa service:

📖 **Nguyên văn** — Protocol Buffers, *Language Guide (proto 3)*, mục *Defining Services*
> "If you want to use your message types with an RPC (Remote Procedure Call) system, you can define an RPC service interface in a .proto file and the protocol buffer compiler will generate service interface code and stubs in your chosen language."
> ```proto
> service SearchService {
>   rpc Search(SearchRequest) returns (SearchResponse);
> }
> ```

🇻🇳 **Dịch**
> "Nếu bạn muốn dùng các kiểu message của mình với một hệ thống RPC (Remote Procedure Call), bạn có thể định nghĩa một RPC service interface trong file .proto và protocol buffer compiler sẽ sinh ra code interface của service cùng các *stub* trong ngôn ngữ bạn chọn." — khối code: service `SearchService` với method `Search`.

---

## 5. Code generation và stub

📖 **Nguyên văn** — Introduction to gRPC
> "Then, once you’ve specified your data structures, you use the protocol buffer compiler protoc to generate data access classes in your preferred language(s) from your proto definition. These provide simple accessors for each field, like name() and set_name(), as well as methods to serialize/parse the whole structure to/from raw bytes."

🇻🇳 **Dịch**
> "Sau đó, một khi đã đặc tả xong cấu trúc dữ liệu, bạn dùng protocol buffer compiler `protoc` để sinh ra các class truy cập dữ liệu trong (những) ngôn ngữ bạn thích từ định nghĩa proto của mình. Chúng cung cấp các accessor đơn giản cho từng field, như `name()` và `set_name()`, cũng như các method để serialize/parse toàn bộ cấu trúc thành/từ raw bytes."

📖 **Nguyên văn** — Introduction to gRPC
> "gRPC uses protoc with a special gRPC plugin to generate code from your proto file: you get generated gRPC client and server code, as well as the regular protocol buffer code for populating, serializing, and retrieving your message types."

🇻🇳 **Dịch**
> "gRPC dùng `protoc` với một plugin gRPC đặc biệt để sinh code từ file proto của bạn: bạn nhận được code gRPC client và server được sinh ra, cùng với code protocol buffer thông thường để điền dữ liệu, serialize và lấy lại các kiểu message của bạn."

📖 **Nguyên văn** — gRPC Core concepts, mục *Using the API*
> "Starting from a service definition in a .proto file, gRPC provides protocol buffer compiler plugins that generate client- and server-side code. gRPC users typically call these APIs on the client side and implement the corresponding API on the server side.
>
> - On the server side, the server implements the methods declared by the service and runs a gRPC server to handle client calls. The gRPC infrastructure decodes incoming requests, executes service methods, and encodes service responses.
> - On the client side, the client has a local object known as stub (for some languages, the preferred term is client) that implements the same methods as the service. The client can then just call those methods on the local object, and the methods wrap the parameters for the call in the appropriate protocol buffer message type, send the requests to the server, and return the server’s protocol buffer responses."

🇻🇳 **Dịch**
> "Bắt đầu từ một định nghĩa service trong file .proto, gRPC cung cấp các plugin cho protocol buffer compiler để sinh code phía client và phía server. Người dùng gRPC thường gọi các API này ở phía client và implement API tương ứng ở phía server.
>
> - Ở phía server, server implement các method mà service đã khai báo và chạy một gRPC server để xử lý các lời gọi từ client. Hạ tầng gRPC giải mã (decode) các request đến, thực thi các service method, và mã hoá (encode) các response của service.
> - Ở phía client, client có một local object gọi là **stub** (ở một số ngôn ngữ thuật ngữ ưa dùng là *client*) implement đúng những method giống như service. Client khi đó chỉ việc gọi các method đó trên local object, và các method này sẽ gói parameter của lời gọi vào đúng kiểu protocol buffer message, gửi request tới server, rồi trả về các protocol buffer response của server."

💡 **Ví dụ đời sống**
Stub giống **người phiên dịch ngồi cạnh bạn**. Bạn nói tiếng Việt ("cho tôi thông tin khách hàng 42"), anh ta dịch sang tiếng của đối tác, gửi đi, nhận lại, dịch ngược về tiếng Việt rồi đưa cho bạn. Bạn có cảm giác mình đang nói chuyện trực tiếp — đó chính là chữ "transparently" trong định nghĩa gRPC.

> [!tip] Contract-first, không phải code-first
> Với REST bạn có thể viết endpoint trước rồi mới viết tài liệu. Với gRPC thì ngược lại: file `.proto` **phải** có trước, vì cả client lẫn server đều được sinh ra từ nó. Đây là điểm mạnh lớn nhất — client và server không thể lệch contract mà vẫn compile được.

---

## 6. Bốn loại service method — phần trọng tâm

📖 **Nguyên văn** — gRPC Core concepts
> "gRPC lets you define four kinds of service method:"

🇻🇳 **Dịch**
> "gRPC cho phép bạn định nghĩa bốn loại service method:"

### 6.1. Unary RPC

📖 **Nguyên văn**
> "Unary RPCs where the client sends a single request to the server and gets a single response back, just like a normal function call."
> ```proto
> rpc SayHello(HelloRequest) returns (HelloResponse);
> ```

🇻🇳 **Dịch**
> "Unary RPC: client gửi một request đơn lẻ tới server và nhận lại một response đơn lẻ, hệt như một lời gọi hàm bình thường." — khối code: không có từ khoá `stream` ở đâu cả.

💡 **Ví dụ đời sống**
Một câu hỏi — một câu trả lời. Bạn hỏi lễ tân "phòng 502 ở tầng mấy?", lễ tân đáp "tầng 5". Xong, hết lượt.

### 6.2. Server streaming RPC

📖 **Nguyên văn**
> "Server streaming RPCs where the client sends a request to the server and gets a stream to read a sequence of messages back. The client reads from the returned stream until there are no more messages. gRPC guarantees message ordering within an individual RPC call."
> ```proto
> rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
> ```

🇻🇳 **Dịch**
> "Server streaming RPC: client gửi một request tới server và nhận lại một stream để đọc một chuỗi message. Client đọc từ stream được trả về cho tới khi không còn message nào nữa. gRPC bảo đảm thứ tự message trong phạm vi một lời gọi RPC." — khối code: `stream` nằm ở vế `returns`.

💡 **Ví dụ đời sống**
**Đài phát thanh.** Bạn bật đài đúng một lần (một request), rồi ngồi nghe hết bản tin này tới bản tin khác chảy về. Bạn không nói gì thêm; bên kia cứ phát cho tới khi hết chương trình.

### 6.3. Client streaming RPC

📖 **Nguyên văn**
> "Client streaming RPCs where the client writes a sequence of messages and sends them to the server, again using a provided stream. Once the client has finished writing the messages, it waits for the server to read them and return its response. Again gRPC guarantees message ordering within an individual RPC call."
> ```proto
> rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
> ```

🇻🇳 **Dịch**
> "Client streaming RPC: client ghi một chuỗi message và gửi chúng tới server, cũng qua một stream được cung cấp sẵn. Một khi client ghi xong các message, nó chờ server đọc hết và trả về response của mình. Một lần nữa, gRPC bảo đảm thứ tự message trong phạm vi một lời gọi RPC." — khối code: `stream` nằm ở vế parameter.

💡 **Ví dụ đời sống**
**Gửi bưu kiện cồng kềnh thành nhiều thùng.** Bạn chuyển từng thùng một sang kho, thùng 1, thùng 2, thùng 3… Khi bạn báo "hết rồi", bên kho mới kiểm đếm và đưa lại cho bạn *một* biên nhận tổng.

### 6.4. Bidirectional streaming RPC

📖 **Nguyên văn**
> "Bidirectional streaming RPCs where both sides send a sequence of messages using a read-write stream. The two streams operate independently, so clients and servers can read and write in whatever order they like: for example, the server could wait to receive all the client messages before writing its responses, or it could alternately read a message then write a message, or some other combination of reads and writes. The order of messages in each stream is preserved."
> ```proto
> rpc BidiHello(stream HelloRequest) returns (stream HelloResponse);
> ```

🇻🇳 **Dịch**
> "Bidirectional streaming RPC: cả hai phía đều gửi một chuỗi message qua một stream đọc-ghi. Hai stream hoạt động độc lập, nên client và server có thể đọc và ghi theo bất kỳ thứ tự nào họ muốn: ví dụ, server có thể chờ nhận hết mọi message của client rồi mới ghi các response của mình, hoặc có thể luân phiên đọc một message rồi ghi một message, hoặc một tổ hợp đọc-ghi nào khác. Thứ tự message trong *mỗi* stream đều được giữ nguyên." — khối code: `stream` ở cả hai vế.

💡 **Ví dụ đời sống**
**Cuộc gọi video hai chiều.** Cả hai đều nói và nghe cùng lúc, ai muốn nói khi nào thì nói, không cần chờ lượt. Hai luồng âm thanh độc lập nhau nhưng mỗi luồng vẫn giữ đúng thứ tự lời nói của người đó.

### 6.5. Bảng so sánh 4 loại

| Loại | `stream` ở đâu trong `.proto` | Client gửi | Server trả | Ví dụ đời sống |
|---|---|---|---|---|
| **Unary** | không có | 1 message | 1 message | Một câu hỏi — một câu trả lời |
| **Server streaming** | vế `returns` | 1 message | nhiều message | Đài phát thanh |
| **Client streaming** | vế parameter | nhiều message | 1 message | Gửi nhiều thùng hàng, nhận 1 biên nhận |
| **Bidirectional** | cả hai vế | nhiều message | nhiều message | Cuộc gọi video hai chiều |

Cột "Client gửi / Server trả" lấy từ chính các câu trích ở 6.1–6.4 ("a single request… a single response back", "a stream to read a sequence of messages back", "writes a sequence of messages", "both sides send a sequence of messages"). Cột `stream` là quan sát trực tiếp trên các khối code nguyên văn.

---

## 7. Vòng đời một lời gọi (RPC life cycle)

### 7.1. Unary RPC

📖 **Nguyên văn** — gRPC Core concepts, mục *Unary RPC*
> "First consider the simplest type of RPC where the client sends a single request and gets back a single response.
>
> - Once the client calls a stub method, the server is notified that the RPC has been invoked with the client’s metadata for this call, the method name, and the specified deadline if applicable.
> - The server can then either send back its own initial metadata (which must be sent before any response) straight away, or wait for the client’s request message. Which happens first, is application-specific.
> - Once the server has the client’s request message, it does whatever work is necessary to create and populate a response. The response is then returned (if successful) to the client together with status details (status code and optional status message) and optional trailing metadata.
> - If the response status is OK, then the client gets the response, which completes the call on the client side."

🇻🇳 **Dịch**
> "Trước tiên hãy xét loại RPC đơn giản nhất, nơi client gửi một request đơn lẻ và nhận lại một response đơn lẻ.
>
> - Ngay khi client gọi một method của stub, server được thông báo rằng RPC đã được khởi động, kèm theo metadata của client cho lời gọi này, tên method, và deadline được chỉ định nếu có.
> - Server khi đó có thể gửi ngay initial metadata của chính nó (bắt buộc phải gửi trước bất kỳ response nào), hoặc chờ request message của client. Cái nào xảy ra trước là tuỳ vào từng ứng dụng.
> - Một khi server có request message của client, nó làm mọi việc cần thiết để tạo và điền dữ liệu cho một response. Response sau đó được trả về (nếu thành công) cho client cùng với các chi tiết trạng thái (status code và status message tuỳ chọn) và trailing metadata tuỳ chọn.
> - Nếu status của response là OK, client nhận được response, và điều đó kết thúc lời gọi ở phía client."

### 7.2. Server streaming / Client streaming / Bidirectional

📖 **Nguyên văn** — mục *Server streaming RPC*
> "A server-streaming RPC is similar to a unary RPC, except that the server returns a stream of messages in response to a client’s request. After sending all its messages, the server’s status details (status code and optional status message) and optional trailing metadata are sent to the client. This completes processing on the server side. The client completes once it has all the server’s messages."

🇻🇳 **Dịch**
> "Một server-streaming RPC tương tự unary RPC, chỉ khác ở chỗ server trả về một stream các message để đáp lại request của client. Sau khi gửi hết mọi message của mình, các chi tiết trạng thái của server (status code và status message tuỳ chọn) cùng trailing metadata tuỳ chọn được gửi tới client. Việc này kết thúc xử lý ở phía server. Client kết thúc khi nó đã có đủ mọi message của server."

📖 **Nguyên văn** — mục *Client streaming RPC*
> "A client-streaming RPC is similar to a unary RPC, except that the client sends a stream of messages to the server instead of a single message. The server responds with a single message (along with its status details and optional trailing metadata), typically but not necessarily after it has received all the client’s messages."

🇻🇳 **Dịch**
> "Một client-streaming RPC tương tự unary RPC, chỉ khác ở chỗ client gửi một stream các message tới server thay vì một message đơn lẻ. Server đáp lại bằng một message đơn lẻ (kèm các chi tiết trạng thái và trailing metadata tuỳ chọn), thường — nhưng không nhất thiết — sau khi nó đã nhận hết mọi message của client."

📖 **Nguyên văn** — mục *Bidirectional streaming RPC*
> "In a bidirectional streaming RPC, the call is initiated by the client invoking the method and the server receiving the client metadata, method name, and deadline. The server can choose to send back its initial metadata or wait for the client to start streaming messages.
> Client- and server-side stream processing is application specific. Since the two streams are independent, the client and server can read and write messages in any order. For example, a server can wait until it has received all of a client’s messages before writing its messages, or the server and client can play “ping-pong” – the server gets a request, then sends back a response, then the client sends another request based on the response, and so on."

🇻🇳 **Dịch**
> "Trong một bidirectional streaming RPC, lời gọi được khởi tạo bởi client khi gọi method, và server nhận được metadata của client, tên method và deadline. Server có thể chọn gửi lại initial metadata của mình hoặc chờ client bắt đầu stream các message.
> Cách xử lý stream ở phía client và phía server là tuỳ từng ứng dụng. Vì hai stream độc lập nhau, client và server có thể đọc và ghi message theo bất kỳ thứ tự nào. Ví dụ, server có thể chờ tới khi nhận hết mọi message của client rồi mới ghi các message của mình, hoặc server và client có thể chơi kiểu “ping-pong” — server nhận một request, rồi gửi lại một response, rồi client gửi tiếp một request khác dựa trên response đó, và cứ thế."

---

## 8. Deadlines / Timeouts

📖 **Nguyên văn** — gRPC Core concepts, mục *Deadlines/Timeouts*
> "gRPC allows clients to specify how long they are willing to wait for an RPC to complete before the RPC is terminated with a DEADLINE_EXCEEDED error. On the server side, the server can query to see if a particular RPC has timed out, or how much time is left to complete the RPC.
> Specifying a deadline or timeout is language specific: some language APIs work in terms of timeouts (durations of time), and some language APIs work in terms of a deadline (a fixed point in time) and may or may not have a default deadline."

🇻🇳 **Dịch**
> "gRPC cho phép client chỉ định họ sẵn sàng chờ bao lâu để một RPC hoàn tất, trước khi RPC bị chấm dứt với lỗi `DEADLINE_EXCEEDED`. Ở phía server, server có thể truy vấn xem một RPC cụ thể đã quá hạn chưa, hoặc còn lại bao nhiêu thời gian để hoàn thành RPC.
> Việc chỉ định deadline hay timeout là tuỳ theo từng ngôn ngữ: một số API ngôn ngữ làm việc theo *timeout* (khoảng thời gian), một số API ngôn ngữ làm việc theo *deadline* (một mốc thời gian cố định) và có thể có hoặc không có deadline mặc định."

💡 **Ví dụ đời sống**
Timeout = "tôi chờ tối đa 30 phút". Deadline = "tôi chờ tới đúng 9h00". Hai cách nói khác nhau, nhưng deadline là thứ truyền được qua nhiều chặng: nếu service A đặt deadline 9h00 rồi gọi B, B gọi C, cả chuỗi đều biết mốc 9h00 — điều mà "30 phút" tính lại từ đầu ở mỗi chặng không làm được.

---

## 9. RPC termination — hai phía có thể kết luận khác nhau

📖 **Nguyên văn** — gRPC Core concepts, mục *RPC termination*
> "In gRPC, both the client and server make independent and local determinations of the success of the call, and their conclusions may not match. This means that, for example, you could have an RPC that finishes successfully on the server side (“I have sent all my responses!”) but fails on the client side (“The responses arrived after my deadline!”). It’s also possible for a server to decide to complete before a client has sent all its requests."

🇻🇳 **Dịch**
> "Trong gRPC, cả client lẫn server đều tự đưa ra phán quyết độc lập và cục bộ về việc lời gọi có thành công hay không, và kết luận của chúng có thể không khớp nhau. Điều này nghĩa là, ví dụ, bạn có thể có một RPC kết thúc thành công ở phía server (“Tôi đã gửi hết mọi response rồi!”) nhưng thất bại ở phía client (“Các response đến sau deadline của tôi mất rồi!”). Cũng có thể server quyết định hoàn tất trước khi client gửi xong mọi request của nó."

> [!warning] Hệ quả thực tế
> Đây chính là lý do các thao tác ghi qua gRPC nên **idempotent**. Server ghi DB thành công nhưng client coi là lỗi và retry → ghi hai lần. Câu trích ở trên nói thẳng rằng hai phía có thể kết luận trái ngược, nên đừng giả định "client thấy lỗi = server chưa làm gì".

---

## 10. Cancelling an RPC

📖 **Nguyên văn** — gRPC Core concepts, mục *Cancelling an RPC*
> "Either the client or the server can cancel an RPC at any time. A cancellation terminates the RPC immediately so that no further work is done."

🇻🇳 **Dịch**
> "Hoặc client hoặc server đều có thể huỷ một RPC vào bất cứ lúc nào. Việc huỷ sẽ chấm dứt RPC ngay lập tức để không còn công việc nào được thực hiện nữa."

> [!danger] Huỷ không phải rollback
> 📖 **Nguyên văn** — gRPC Core concepts, khối *Warning* ngay dưới mục Cancelling an RPC
> > "Changes made before a cancellation are not rolled back."
>
> 🇻🇳 **Dịch**
> > "Những thay đổi đã thực hiện trước khi huỷ sẽ *không* được rollback."
>
> Nghĩa là nếu server đã ghi 3 record rồi RPC bị huỷ, 3 record đó vẫn nằm đó. Muốn nguyên tử thì phải tự lo bằng transaction ở tầng database — xem [[03 - Queries - SELECT, JOIN, Aggregate]] về cách DB xử lý các thao tác.

---

## 11. Metadata

📖 **Nguyên văn** — gRPC Core concepts, mục *Metadata*
> "Metadata is information about a particular RPC call (such as authentication details) in the form of a list of key-value pairs, where the keys are strings and the values are typically strings, but can be binary data. Keys are case insensitive and consist of ASCII letters, digits, and special characters -, _, . and must not start with grpc- (which is reserved for gRPC itself). Binary-valued keys end in -bin while ASCII-valued keys do not. User-defined metadata is not used by gRPC, which allows the client to provide information associated with the call to the server and vice versa. Access to metadata is language dependent."

🇻🇳 **Dịch**
> "Metadata là thông tin *về* một lời gọi RPC cụ thể (chẳng hạn chi tiết xác thực), dưới dạng một danh sách các cặp key-value, trong đó key là string còn value thường là string nhưng có thể là dữ liệu nhị phân. Key không phân biệt hoa thường và gồm các chữ cái ASCII, chữ số, cùng các ký tự đặc biệt `-`, `_`, `.`; và *không được* bắt đầu bằng `grpc-` (tiền tố này được dành riêng cho chính gRPC). Key có value nhị phân thì kết thúc bằng `-bin`, còn key có value ASCII thì không. Metadata do người dùng tự định nghĩa không được gRPC sử dụng — điều này cho phép client cung cấp cho server những thông tin gắn với lời gọi, và ngược lại. Cách truy cập metadata tuỳ thuộc từng ngôn ngữ."

💡 **Ví dụ đời sống**
Metadata là **cái phong bì**, còn protobuf message là **lá thư bên trong**. Địa chỉ người gửi, tem, dấu bưu điện — đó là thông tin *về* việc gửi thư, không phải nội dung thư. Trong gRPC, token xác thực thường nằm trên phong bì chứ không nằm trong thư. Vai trò này tương đương header trong HTTP — xem [[02 - What is HTTP]].

---

## 12. Channels

📖 **Nguyên văn** — gRPC Core concepts, mục *Channels*
> "A gRPC channel provides a connection to a gRPC server on a specified host and port. It is used when creating a client stub. Clients can specify channel arguments to modify gRPC’s default behavior, such as switching message compression on or off. A channel has state, including connected and idle. How gRPC deals with closing a channel is language dependent. Some languages also permit querying channel state."

🇻🇳 **Dịch**
> "Một gRPC channel cung cấp một kết nối tới một gRPC server tại host và port đã chỉ định. Nó được dùng khi tạo một client stub. Client có thể chỉ định các channel argument để thay đổi hành vi mặc định của gRPC, chẳng hạn bật hoặc tắt việc nén message. Một channel có *trạng thái*, bao gồm `connected` và `idle`. Cách gRPC xử lý việc đóng một channel là tuỳ theo từng ngôn ngữ. Một số ngôn ngữ còn cho phép truy vấn trạng thái của channel."

💡 **Ví dụ đời sống**
Channel là **đường dây điện thoại đã nối sẵn giữa hai văn phòng**; stub là **cái máy điện thoại** cắm vào đường dây đó. Một đường dây có thể phục vụ nhiều máy, và bạn không dựng lại đường dây mỗi lần gọi — đó là lý do channel nên được tạo một lần rồi dùng lại, chứ không tạo mới cho từng request.

> [!tip] Channel ≠ stub
> Tạo channel là việc tốn kém (thiết lập kết nối); tạo stub thì rẻ. Pattern chuẩn: một channel dùng chung, nhiều stub tạo từ nó.

---

## 13. gRPC và HTTP/2

📖 **Nguyên văn** — gRPC FAQ, "Why is gRPC better/worse than REST?"
> "gRPC largely follows HTTP semantics over HTTP/2 but we explicitly allow for full-duplex streaming."

🇻🇳 **Dịch**
> "gRPC phần lớn tuân theo ngữ nghĩa HTTP chạy trên HTTP/2 nhưng chúng tôi cho phép một cách tường minh việc streaming song công hoàn toàn."

📖 **Nguyên văn** — gRPC FAQ, "Why is gRPC better than any binary blob over HTTP/2?"
> "This is largely what gRPC is on the wire. However gRPC is also a set of libraries that will provide higher-level features consistently across platforms that common HTTP libraries typically do not. Examples of such features include:
>
> - interaction with flow-control at the application layer
> - cascading call-cancellation
> - load balancing & failover"

🇻🇳 **Dịch**
> "Trên đường truyền thì gRPC về cơ bản đúng là như vậy [một khối nhị phân chạy trên HTTP/2]. Tuy nhiên gRPC còn là một tập thư viện cung cấp nhất quán trên mọi nền tảng những tính năng ở tầng cao hơn, thứ mà các thư viện HTTP thông thường không có. Ví dụ về những tính năng đó gồm:
>
> - tương tác với flow-control ở tầng ứng dụng
> - huỷ lời gọi theo kiểu lan truyền (cascading call-cancellation)
> - cân bằng tải và failover"

> [!note] Vì sao HTTP/2 mới cho phép streaming — đây là nhận định, không trích spec
> HTTP/1.1 xử lý mỗi kết nối theo kiểu một request rồi một response, nối đuôi nhau. HTTP/2 chia một kết nối TCP thành nhiều **stream** độc lập chạy song song, và mỗi stream mang các **frame** có thể đi theo cả hai chiều bất cứ lúc nào. Chính đặc tính đó là thứ ánh xạ thẳng thành 4 loại service method ở mục 6: bidirectional streaming chỉ khả thi khi tầng vận chuyển cho phép hai chiều gửi frame đồng thời trên cùng một stream. Xem lại [[02 - What is HTTP]] về mô hình request-response của HTTP.

---

## 14. Hạn chế: trình duyệt không gọi thẳng gRPC

📖 **Nguyên văn** — gRPC FAQ, "Can I use it in the browser?"
> "The gRPC-Web project is Generally Available."

🇻🇳 **Dịch**
> "Dự án gRPC-Web đã ở trạng thái Generally Available (phát hành rộng rãi)."

> [!note] Đọc câu trả lời này thế nào
> Tài liệu chính thức không trả lời "được" hay "không được" mà trỏ sang **gRPC-Web** — tức là để gọi từ browser, bạn cần một dự án riêng chứ không phải gRPC thuần. Mọi giải thích chi tiết hơn (browser không cho JS điều khiển frame HTTP/2, cần proxy chuyển đổi…) *không* nằm trong tài liệu đã fetch, nên bài này không khẳng định.

---

## 15. Bảng so sánh gRPC vs REST

Mỗi ô dưới đây hoặc truy được về một câu trích trong bài, hoặc được ghi rõ là **nhận định**.

| Tiêu chí | gRPC | REST | Truy nguồn |
|---|---|---|---|
| Đơn vị tư duy | Method/procedure — "defining a service, specifying the methods that can be called remotely" | Resource + representation | Trích mục 2 (gRPC) · [[02 - REST]] (REST) |
| Contract | Bắt buộc, viết trong `.proto` — "protocol buffers as the Interface Definition Language (IDL)" | Không bắt buộc bởi kiến trúc | Trích mục 3.1 · phần REST là **nhận định** |
| Định dạng dữ liệu | Protocol Buffers mặc định — "By default, gRPC uses Protocol Buffers"; "can be used with other data formats such as JSON" | Thường JSON | Trích mục 3 · phần REST là **nhận định** |
| Đọc bằng mắt được không | Không — "you cannot fully interpret one without access to its corresponding .proto file" | Được (JSON là text) | Trích mục 3.2 · phần REST là **nhận định** |
| Kích thước / tốc độ | "smaller and faster" so với JSON; "Compact data storage", "Fast parsing" | — | Trích mục 3 và 3.2 |
| Streaming | 4 loại, kể cả "full-duplex streaming" | Không có trong mô hình request-response cơ bản | Trích mục 6 và 13 · phần REST là **nhận định** |
| Đường dẫn | "we use static paths for performance reasons during call dispatch" | Đường dẫn mang tham số, query param | Trích mục 2.1 (FAQ) |
| Mã lỗi | "a set of errors that we believe are more directly applicable to API use cases than the HTTP status codes" | HTTP status code | Trích mục 2.1 (FAQ) |
| Deadline có sẵn ở protocol | Có — `DEADLINE_EXCEEDED` | Do client tự đặt, không thuộc mô hình REST | Trích mục 8 · phần REST là **nhận định** |
| Gọi từ trình duyệt | Cần gRPC-Web | Gọi thẳng bằng `fetch` | Trích mục 14 · phần REST là **nhận định** |
| Transport | "HTTP semantics over HTTP/2" | HTTP nói chung | Trích mục 13 · phần REST là **nhận định** |

### Khi nào tài liệu khuyên dùng gRPC

📖 **Nguyên văn** — gRPC FAQ, "Why would I want to use gRPC?"
> "The main usage scenarios:
>
> - Low latency, highly scalable, distributed systems.
> - Developing mobile clients which are communicating to a cloud server.
> - Designing a new protocol that needs to be accurate, efficient and language independent.
> - Layered design to enable extension eg. authentication, load balancing, logging and monitoring etc."

🇻🇳 **Dịch**
> "Các kịch bản sử dụng chính:
>
> - Hệ thống phân tán có độ trễ thấp, khả năng mở rộng cao.
> - Phát triển các mobile client giao tiếp với một cloud server.
> - Thiết kế một protocol mới cần chính xác, hiệu quả và độc lập ngôn ngữ.
> - Thiết kế phân tầng để cho phép mở rộng, ví dụ authentication, load balancing, logging và monitoring."

📖 **Nguyên văn** — Protocol Buffers Overview
> "They are most often used for defining communications protocols (together with gRPC) and for data storage."

🇻🇳 **Dịch**
> "Chúng [protocol buffers] thường được dùng nhất để định nghĩa các protocol giao tiếp (cùng với gRPC) và để lưu trữ dữ liệu."

---

## 16. Phiên bản proto3

📖 **Nguyên văn** — Introduction to gRPC, mục *Protocol buffer versions*
> "In general, while you can use proto2 (the current default protocol buffers version), we recommend that you use proto3 with gRPC as it lets you use the full range of gRPC-supported languages, as well as avoiding compatibility issues with proto2 clients talking to proto3 servers and vice versa."

🇻🇳 **Dịch**
> "Nói chung, dù bạn có thể dùng proto2 (phiên bản protocol buffers mặc định hiện tại), chúng tôi khuyến nghị bạn dùng proto3 với gRPC vì nó cho phép bạn dùng toàn bộ dải ngôn ngữ mà gRPC hỗ trợ, đồng thời tránh được các vấn đề tương thích khi client proto2 nói chuyện với server proto3 và ngược lại."

### Tương thích ngược / tương thích tiến

📖 **Nguyên văn** — Protocol Buffers Overview, mục *Updating Proto Definitions Without Updating Code*
> "It’s standard for software products to be backward compatible, but it is less common for them to be forward compatible. As long as you follow some simple practices when updating .proto definitions, old code will read new messages without issues, ignoring any newly added fields. To the old code, fields that were deleted will have their default value, and deleted repeated fields will be empty. […] New code will also transparently read old messages. New fields will not be present in old messages; in these cases protocol buffers provide a reasonable default value."

🇻🇳 **Dịch**
> "Việc một sản phẩm phần mềm tương thích ngược (backward compatible) là chuyện thường, nhưng tương thích tiến (forward compatible) thì ít gặp hơn. Miễn là bạn tuân theo vài thực hành đơn giản khi cập nhật định nghĩa .proto, code cũ sẽ đọc được các message mới mà không gặp vấn đề gì, đơn giản bỏ qua mọi field mới thêm vào. Đối với code cũ, các field đã bị xoá sẽ mang giá trị mặc định của chúng, và các repeated field đã xoá sẽ rỗng. […] Code mới cũng sẽ đọc được các message cũ một cách trong suốt. Các field mới sẽ không có mặt trong message cũ; trong những trường hợp đó protocol buffers cung cấp một giá trị mặc định hợp lý."

> [!tip] Đây là lý do field number quan trọng
> Số `= 1`, `= 2` trong `.proto` là danh tính thật sự của field trên đường truyền, không phải tên field. Đổi tên field thì vẫn tương thích; đổi *số* thì hỏng dữ liệu cũ. Cũng vì thế không bao giờ được tái sử dụng một số đã từng dùng rồi xoá.

---

## Liên kết
- [[02 - REST]] — style đối lập: xoay quanh resource thay vì method; xem mục 2.1 và bảng so sánh mục 15
- [[02 - What is HTTP]] — nền tảng HTTP; metadata của gRPC đóng vai trò tương tự header, và mục 13 nói về HTTP/2
- [[07 - N+1 Problem]] — vấn đề nhiều round-trip nhỏ; streaming của gRPC là một hướng tiếp cận khác cho cùng nỗi đau
- [[03 - Queries - SELECT, JOIN, Aggregate]] — khi RPC bị huỷ giữa chừng, tính nguyên tử phải do transaction ở tầng DB đảm bảo (mục 10)
- [[11 - NULL, Hàm String, Date và JSON]] — đối chiếu với JSON, định dạng mà protobuf được so sánh trực tiếp ("It's like JSON, except…")

## Nguồn tham khảo
- gRPC — *Introduction to gRPC* : https://grpc.io/docs/what-is-grpc/introduction/
- gRPC — *Core concepts, architecture and lifecycle* : https://grpc.io/docs/what-is-grpc/core-concepts/
- gRPC — *FAQ* : https://grpc.io/docs/what-is-grpc/faq/
- gRPC — *Guides* : https://grpc.io/docs/guides/
- Protocol Buffers — *Overview* : https://protobuf.dev/overview/
- Protocol Buffers — *Language Guide (proto 3)* : https://protobuf.dev/programming-guides/proto3/
