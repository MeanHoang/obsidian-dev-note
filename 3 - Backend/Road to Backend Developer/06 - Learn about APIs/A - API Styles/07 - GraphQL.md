# 07 — GraphQL

> **Nguồn chính:** GraphQL Specification, October 2021 Edition — https://spec.graphql.org/October2021/
> Bài này bám các mục §1 Overview, §2 Language, §3 Type System, §4 Introspection, §6 Execution của spec; phần học thêm lấy từ tài liệu chính thức graphql.org/learn; phần bảo mật lấy từ OWASP GraphQL Cheat Sheet.

---

## 1. GraphQL là gì

📖 **Nguyên văn** — spec.graphql.org/October2021, Introduction

> "This is the specification for GraphQL, a query language and execution engine originally created at Facebook in 2012 for describing the capabilities and requirements of data models for client-server applications."

🇻🇳 **Dịch**

> "Đây là specification của GraphQL, một query language và execution engine được tạo ra ban đầu tại Facebook năm 2012 để mô tả năng lực và yêu cầu của các mô hình dữ liệu cho ứng dụng client-server."

📖 **Nguyên văn** — §1 Overview

> "GraphQL is a query language designed to build client applications by providing an intuitive and flexible syntax and system for describing their data requirements and interactions."

🇻🇳 **Dịch**

> "GraphQL là một query language được thiết kế để xây dựng client application, bằng cách cung cấp một cú pháp và một hệ thống trực quan, linh hoạt để mô tả các yêu cầu dữ liệu và các tương tác của chúng."

Điểm quan trọng nhất, và cũng là chỗ hay bị hiểu nhầm nhất: **GraphQL không phải là ngôn ngữ truy vấn database, và không gắn với bất kỳ storage nào.**

📖 **Nguyên văn** — §1 Overview

> "GraphQL is not a programming language capable of arbitrary computation, but is instead a language used to make requests to application services that have capabilities defined in this specification. GraphQL does not mandate a particular programming language or storage system for application services that implement it. Instead, application services take their capabilities and map them to a uniform language, type system, and philosophy that GraphQL encodes."

🇻🇳 **Dịch**

> "GraphQL không phải là một ngôn ngữ lập trình có khả năng tính toán tùy ý, mà là một ngôn ngữ dùng để gửi request tới các application service có năng lực được định nghĩa trong specification này. GraphQL không bắt buộc một ngôn ngữ lập trình hay một hệ thống lưu trữ cụ thể nào cho các application service triển khai nó. Thay vào đó, các application service lấy năng lực của mình và ánh xạ chúng sang một ngôn ngữ, một type system và một triết lý thống nhất mà GraphQL mã hóa."

> [!note] Hai vai trò trong một cái tên
> Chữ "GraphQL" đồng thời chỉ **query language** (cú pháp client viết ra để mô tả dữ liệu mình cần) và **execution engine / runtime** (phần server đọc query đó, chạy resolver, trả response). Đằng sau runtime đó có thể là PostgreSQL, là REST API nội bộ, là Firestore, là file CSV — spec không quan tâm.

💡 **Ví dụ đời sống**

Hình dung bạn vào quán ăn. **REST** là quán bán theo set: gọi "set cơm gà" là được đúng một khay cố định — có món bạn không ăn (over-fetching), thiếu món bạn muốn thì phải gọi thêm set khác (under-fetching). **GraphQL** là quán cho bạn ghi phiếu: bạn viết ra đúng danh sách món và số lượng mình muốn, bếp trả về đúng từng đó. Cái phiếu (query language) không nói gì về việc bếp lấy nguyên liệu từ tủ lạnh nào — đó là chuyện của bếp (runtime + resolver).

Xem thêm bản mô tả của OWASP về vị trí của GraphQL trong hệ sinh thái API:

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, Introduction

> "GraphQL is an open source query language originally developed by Facebook that can be used to build APIs as an alternative to REST and SOAP."

🇻🇳 **Dịch**

> "GraphQL là một query language mã nguồn mở, ban đầu do Facebook phát triển, có thể dùng để xây dựng API như một lựa chọn thay thế cho REST và SOAP."

---

## 2. Năm nguyên tắc thiết kế của GraphQL

📖 **Nguyên văn** — §1 Overview

> "Product-centric: GraphQL is unapologetically driven by the requirements of views and the front-end engineers that write them. GraphQL starts with their way of thinking and requirements and builds the language and runtime necessary to enable that.
>
> Hierarchical: Most product development today involves the creation and manipulation of view hierarchies. To achieve congruence with the structure of these applications, a GraphQL request itself is structured hierarchically. The request is shaped just like the data in its response. It is a natural way for clients to describe data requirements.
>
> Strong-typing: Every GraphQL service defines an application-specific type system. Requests are executed within the context of that type system. Given a GraphQL operation, tools can ensure that it is both syntactically correct and valid within that type system before execution, i.e. at development time, and the service can make certain guarantees about the shape and nature of the response.
>
> Client-specified response: Through its type system, a GraphQL service publishes the capabilities that its clients are allowed to consume. It is the client that is responsible for specifying exactly how it will consume those published capabilities. These requests are specified at field-level granularity. In the majority of client-server applications written without GraphQL, the service determines the shape of data returned from its various endpoints. A GraphQL response, on the other hand, contains exactly what a client asks for and no more.
>
> Introspective: GraphQL is introspective. A GraphQL service's type system can be queryable by the GraphQL language itself, as will be described in this specification. GraphQL introspection serves as a powerful platform for building common tools and client software libraries."

🇻🇳 **Dịch**

> "**Product-centric (lấy sản phẩm làm trung tâm):** GraphQL được dẫn dắt một cách không hề ngại ngùng bởi yêu cầu của các view và của các kỹ sư front-end viết ra chúng. GraphQL khởi đi từ cách nghĩ và yêu cầu của họ rồi xây dựng ngôn ngữ và runtime cần thiết để phục vụ điều đó.
>
> **Hierarchical (phân cấp):** Phần lớn việc phát triển sản phẩm ngày nay liên quan tới việc tạo ra và thao tác trên các cây phân cấp view. Để tương hợp với cấu trúc của các ứng dụng đó, bản thân một GraphQL request cũng được cấu trúc phân cấp. Request có hình dạng đúng như dữ liệu trong response của nó. Đây là một cách tự nhiên để client mô tả yêu cầu dữ liệu.
>
> **Strong-typing (định kiểu mạnh):** Mỗi GraphQL service định nghĩa một type system riêng cho ứng dụng đó. Request được thực thi trong ngữ cảnh của type system đó. Cho trước một GraphQL operation, các công cụ có thể đảm bảo rằng nó vừa đúng cú pháp vừa hợp lệ trong type system đó trước khi thực thi, tức là ngay lúc phát triển, và service có thể đưa ra một số bảo đảm nhất định về hình dạng và bản chất của response.
>
> **Client-specified response (response do client chỉ định):** Thông qua type system của mình, một GraphQL service công bố những năng lực mà client được phép tiêu thụ. Chính client mới là bên chịu trách nhiệm chỉ định chính xác nó sẽ tiêu thụ những năng lực đã công bố đó như thế nào. Các request này được chỉ định ở mức độ chi tiết tới từng field. Trong đa số ứng dụng client-server viết không dùng GraphQL, chính service quyết định hình dạng dữ liệu trả về từ các endpoint của nó. Ngược lại, một GraphQL response chứa đúng những gì client hỏi và không hơn.
>
> **Introspective (tự soi):** GraphQL có khả năng tự soi. Type system của một GraphQL service có thể được truy vấn bằng chính ngôn ngữ GraphQL, như sẽ được mô tả trong specification này. GraphQL introspection là một nền tảng mạnh mẽ để xây dựng các công cụ và thư viện client phổ biến."

---

## 3. Vấn đề GraphQL giải quyết: over-fetching và under-fetching

Spec nói thẳng điều này trong mục về selection set:

📖 **Nguyên văn** — §2.4 Selection Sets

> "An operation selects the set of information it needs, and will receive exactly that information and nothing more, avoiding over-fetching and under-fetching data."

🇻🇳 **Dịch**

> "Một operation chọn ra tập thông tin nó cần, và sẽ nhận về chính xác thông tin đó, không hơn, nhờ vậy tránh được over-fetching và under-fetching dữ liệu."

> [!note] Ghi chú — đây là giải thích chung, không trích từ spec
> Spec chỉ nêu tên hai vấn đề chứ không định nghĩa chúng. Hiểu thông thường trong ngành:
> - **Over-fetching**: endpoint trả về nhiều field hơn client cần. Gọi `GET /users/4` để lấy mỗi cái tên nhưng nhận về cả địa chỉ, ngày sinh, avatar, settings.
> - **Under-fetching**: một endpoint không đủ, client phải gọi nhiều vòng. Lấy user → rồi lấy đơn hàng của user → rồi lấy sản phẩm trong từng đơn. Ba round-trip mạng nối tiếp nhau.

Với GraphQL, cả ba tầng dữ liệu ở ví dụ trên nằm trong **một** request duy nhất, vì request được cấu trúc phân cấp giống hệt hình dạng response.

📖 **Nguyên văn** — §2.5 Fields, Example № 8

```
{
  me {
    id
    firstName
    lastName
    birthday {
      month
      day
    }
    friends {
      name
    }
  }
}
```

🇻🇳 Một query duy nhất đi xuống nhiều tầng: `me` → `birthday` → `month`/`day`, và `me` → `friends` → `name`. Nếu làm bằng REST thì đây thường là ít nhất 2–3 lượt gọi.

---

## 4. GraphQL và N+1 Problem — con dao hai lưỡi

Đây là phần liên hệ trực tiếp với [[07 - N+1 Problem]], và là chỗ dễ hiểu sai nhất khi mới học GraphQL.

### 4.1. Phía client: GraphQL **dập** được N+1 của network

Kịch bản N+1 kinh điển ở tầng client với REST: gọi `GET /heroes/1` để lấy hero, rồi lặp qua N người bạn để gọi `GET /friends/{id}` N lần. Tổng cộng N+1 HTTP request. Với GraphQL, client mô tả toàn bộ cây dữ liệu trong một document duy nhất → **một** HTTP request. Đây chính là hệ quả trực tiếp của nguyên tắc "Hierarchical" và câu "avoiding over-fetching and under-fetching data" ở trên.

### 4.2. Phía server: GraphQL lại **đẻ ra** N+1 ở tầng data source

Tài liệu chính thức của GraphQL Foundation nói rất rõ điều này:

📖 **Nguyên văn** — graphql.org/learn/performance/, mục "The N+1 Problem"

> "GraphQL is designed in a way that allows you to write clean code on the server, where every field on every type has a focused single-purpose function for resolving that value. However, without additional consideration, a naive GraphQL service could be very "chatty" or repeatedly load data from your databases."

🇻🇳 **Dịch**

> "GraphQL được thiết kế theo hướng cho phép bạn viết code sạch ở phía server, nơi mỗi field trên mỗi type có một hàm chuyên trách một mục đích duy nhất để resolve giá trị đó. Tuy nhiên, nếu không cân nhắc thêm, một GraphQL service ngây thơ có thể rất "lắm mồm", hoặc lặp đi lặp lại việc nạp dữ liệu từ database của bạn."

📖 **Nguyên văn** — graphql.org/learn/performance/

> "This is known as the N+1 problem, where an initial request to an underlying data source (for a hero's friends) leads to N subsequent requests to resolve the data for all of the requested fields (for the friends' starship data)."

🇻🇳 **Dịch**

> "Đây chính là cái gọi là N+1 problem, khi một request ban đầu tới data source bên dưới (để lấy danh sách bạn của một hero) dẫn tới N request tiếp theo để resolve dữ liệu cho tất cả các field được yêu cầu (dữ liệu starship của từng người bạn)."

Vì sao? Vì mỗi field có resolver riêng. Client gửi một query, nhưng execution engine gọi resolver cho **từng** phần tử trong list. List 100 người bạn → resolver `starships` chạy 100 lần → 100 truy vấn database. Cùng một cái bẫy N+1 trong [[07 - N+1 Problem]], chỉ là nó dời từ tầng ORM sang tầng resolver.

### 4.3. Cách chữa: batching

📖 **Nguyên văn** — graphql.org/learn/performance/

> "This is commonly solved by a batching technique, where multiple requests for data from a backend are collected over a short period and then dispatched in a single request to an underlying database or microservice by using a tool like Facebook's DataLoader. Additionally, certain GraphQL implementations may have built-in capabilities that allow you to translate operation selection sets into optimized queries to underlying data sources."

🇻🇳 **Dịch**

> "Vấn đề này thường được giải quyết bằng kỹ thuật batching, trong đó nhiều request lấy dữ liệu từ backend được gom lại trong một khoảng thời gian ngắn rồi gửi đi trong một request duy nhất tới database hoặc microservice bên dưới, bằng một công cụ như DataLoader của Facebook. Ngoài ra, một số triển khai GraphQL có thể có sẵn khả năng cho phép bạn dịch selection set của operation thành các truy vấn tối ưu tới các data source bên dưới."

> [!warning] Tóm lại cho gọn
> GraphQL **chuyển** N+1 chứ không **xóa** N+1. Nó xóa N+1 ở tầng HTTP (client), rồi đẩy nguy cơ N+1 xuống tầng resolver (server). Nếu bạn chỉ viết resolver ngây thơ và không batch, bạn đã đổi N+1 request mạng lấy N+1 query database — và cái sau thường còn đắt hơn. Đây là lý do DataLoader gần như bắt buộc trong mọi GraphQL server nghiêm túc. Xem lại [[03 - Queries - SELECT, JOIN, Aggregate]] để hiểu vì sao gom N truy vấn thành một `IN (...)` lại rẻ hơn nhiều.

---

## 5. Ba loại operation: query, mutation, subscription

📖 **Nguyên văn** — §2.3 Operations

> "There are three types of operations that GraphQL models:
>
> query – a read-only fetch.
>
> mutation – a write followed by a fetch.
>
> subscription – a long-lived request that fetches data in response to source events.
>
> Each operation is represented by an optional operation name and a selection set."

🇻🇳 **Dịch**

> "Có ba loại operation mà GraphQL mô hình hóa:
>
> **query** – một thao tác fetch chỉ đọc.
>
> **mutation** – một thao tác ghi, theo sau là một thao tác fetch.
>
> **subscription** – một request sống lâu, fetch dữ liệu để đáp lại các source event.
>
> Mỗi operation được biểu diễn bằng một tên operation tùy chọn và một selection set."

📖 **Nguyên văn** — §2.3 Operations, Example № 5

```
mutation {
  likeStory(storyID: 12345) {
    story {
      likeCount
    }
  }
}
```

🇻🇳 Một mutation "like" một story rồi lấy lại số like mới — đúng nghĩa "a write followed by a fetch": ghi xong thì đọc luôn kết quả trong cùng một lượt.

### Query shorthand

📖 **Nguyên văn** — §2.3 Operations

> "If a document contains only one operation and that operation is a query which defines no variables and contains no directives then that operation may be represented in a short-hand form which omits the query keyword and operation name."

🇻🇳 **Dịch**

> "Nếu một document chỉ chứa một operation duy nhất và operation đó là một query không định nghĩa variable nào và không chứa directive nào, thì operation đó có thể được biểu diễn ở dạng rút gọn, bỏ đi từ khóa `query` và tên operation."

📖 **Nguyên văn** — §2.3, Example № 6

```
{
  field
}
```

🇻🇳 Dạng rút gọn: chỉ còn selection set trần, ngầm hiểu là một `query`.

### Mutation chạy tuần tự

📖 **Nguyên văn** — §6.2.2 Mutation

> "If the operation is a mutation, the result of the operation is the result of executing the operation's top level selection set on the mutation root object type. This selection set should be executed serially.
>
> It is expected that the top level fields in a mutation operation perform side-effects on the underlying data system. Serial execution of the provided mutations ensures against race conditions during these side-effects."

🇻🇳 **Dịch**

> "Nếu operation là một mutation, kết quả của operation là kết quả của việc thực thi selection set ở tầng cao nhất của operation trên mutation root object type. Selection set này **nên được thực thi tuần tự**.
>
> Người ta kỳ vọng rằng các field ở tầng cao nhất trong một mutation operation sẽ gây side-effect lên hệ thống dữ liệu bên dưới. Việc thực thi tuần tự các mutation được cung cấp giúp ngăn ngừa race condition trong lúc xảy ra các side-effect này."

> [!tip] Mẹo thực dụng
> Query ở top level được phép chạy **song song** (spec §6.2.1: "normally (allowing parallelization)"), còn mutation top level chạy **tuần tự**. Nếu bạn gửi ba mutation trong một document, chúng chạy lần lượt theo đúng thứ tự bạn viết — có thể dựa vào điều này. Nhưng đừng dựa vào thứ tự với query.

### Subscription

📖 **Nguyên văn** — §6.2.3 Subscription

> "If the operation is a subscription, the result is an event stream called the "Response Stream" where each event in the event stream is the result of executing the operation for each new event on an underlying "Source Stream".
>
> Executing a subscription operation creates a persistent function on the service that maps an underlying Source Stream to a returned Response Stream."

🇻🇳 **Dịch**

> "Nếu operation là một subscription, kết quả là một event stream gọi là "Response Stream", trong đó mỗi event trong event stream là kết quả của việc thực thi operation cho mỗi event mới trên một "Source Stream" bên dưới.
>
> Việc thực thi một subscription operation tạo ra một hàm tồn tại lâu dài trên service, ánh xạ một Source Stream bên dưới thành một Response Stream được trả về."

💡 **Ví dụ đời sống**

Query giống như bạn ra bưu điện hỏi "có thư cho tôi không?" — hỏi một lần, trả lời một lần. Subscription giống như bạn đăng ký báo dài hạn: bạn khai báo một lần, rồi mỗi khi có số báo mới (source event), người ta tự mang tới cửa nhà bạn (response stream).

---

## 6. Type system và Schema

📖 **Nguyên văn** — §3 Type System

> "The GraphQL Type system describes the capabilities of a GraphQL service and is used to determine if a requested operation is valid, to guarantee the type of response results, and describes the input types of variables to determine if values provided at request time are valid."

🇻🇳 **Dịch**

> "Type system của GraphQL mô tả năng lực của một GraphQL service, và được dùng để xác định một operation được yêu cầu có hợp lệ hay không, để bảo đảm kiểu của kết quả response, và mô tả input type của các variable nhằm xác định các giá trị được cung cấp lúc request có hợp lệ hay không."

### 6.1. Scalar types

📖 **Nguyên văn** — §3.5 Scalars

> "Scalar types represent primitive leaf values in a GraphQL type system. GraphQL responses take the form of a hierarchical tree; the leaves of this tree are typically GraphQL Scalar types (but may also be Enum types or null values).
>
> GraphQL provides a number of built-in scalars which are fully defined in the sections below, however type systems may also add additional custom scalars to introduce additional semantic meaning."

🇻🇳 **Dịch**

> "Scalar type biểu diễn các giá trị lá nguyên thủy trong type system của GraphQL. GraphQL response có dạng một cây phân cấp; lá của cây này thường là các Scalar type của GraphQL (nhưng cũng có thể là Enum type hoặc giá trị null).
>
> GraphQL cung cấp một số scalar dựng sẵn được định nghĩa đầy đủ ở các mục bên dưới, tuy nhiên type system cũng có thể thêm các custom scalar để đưa vào thêm ý nghĩa ngữ nghĩa."

📖 **Nguyên văn** — §3.5 Scalars, Built-in Scalars

> "GraphQL specifies a basic set of well-defined Scalar types: Int, Float, String, Boolean, and ID. A GraphQL framework should support all of these types, and a GraphQL service which provides a type by these names must adhere to the behavior described for them in this document. As an example, a service must not include a type called Int and use it to represent 64-bit numbers, internationalization information, or anything other than what is defined in this document."

🇻🇳 **Dịch**

> "GraphQL quy định một tập cơ bản các Scalar type được định nghĩa rõ ràng: `Int`, `Float`, `String`, `Boolean`, và `ID`. Một GraphQL framework nên hỗ trợ tất cả các type này, và một GraphQL service cung cấp một type mang những tên này phải tuân thủ hành vi được mô tả cho chúng trong tài liệu này. Ví dụ, một service không được tạo ra type tên `Int` rồi dùng nó để biểu diễn số 64-bit, thông tin quốc tế hóa, hay bất cứ thứ gì khác với những gì được định nghĩa trong tài liệu này."

📖 **Nguyên văn** — §3.5 Scalars, Custom Scalars

> "GraphQL services may use custom scalar types in addition to the built-in scalars. For example, a GraphQL service could define a scalar called UUID which, while serialized as a string, conforms to RFC 4122. When querying a field of type UUID, you can then rely on the ability to parse the result with a RFC 4122 compliant parser."

🇻🇳 **Dịch**

> "Các GraphQL service có thể dùng custom scalar type bên cạnh các scalar dựng sẵn. Ví dụ, một GraphQL service có thể định nghĩa một scalar tên `UUID` mà tuy được serialize thành string nhưng tuân thủ RFC 4122. Khi query một field kiểu `UUID`, bạn có thể tin cậy vào khả năng parse kết quả bằng một parser tuân thủ RFC 4122."

### 6.2. Object types

📖 **Nguyên văn** — §3.6 Objects

> "GraphQL operations are hierarchical and composed, describing a tree of information. While Scalar types describe the leaf values of these hierarchical operations, Objects describe the intermediate levels.
>
> GraphQL Objects represent a list of named fields, each of which yield a value of a specific type. Object values should be serialized as ordered maps, where the selected field names (or aliases) are the keys and the result of evaluating the field is the value, ordered by the order in which they appear in the selection set.
>
> All fields defined within an Object type must not have a name which begins with "__" (two underscores), as this is used exclusively by GraphQL's introspection system."

🇻🇳 **Dịch**

> "Các GraphQL operation mang tính phân cấp và kết hợp, mô tả một cây thông tin. Trong khi Scalar type mô tả các giá trị lá của những operation phân cấp này, thì Object mô tả các tầng trung gian.
>
> GraphQL Object biểu diễn một danh sách các field có tên, mỗi field sinh ra một giá trị thuộc một type cụ thể. Giá trị Object nên được serialize thành các ordered map, trong đó tên field được chọn (hoặc alias) là key và kết quả đánh giá field đó là value, sắp xếp theo thứ tự chúng xuất hiện trong selection set.
>
> Mọi field được định nghĩa bên trong một Object type **không được** có tên bắt đầu bằng `__` (hai dấu gạch dưới), vì tiền tố này được dành riêng cho introspection system của GraphQL."

📖 **Nguyên văn** — §3.6 Objects, Example № 43

```
type Person {
  name: String
  age: Int
  picture: Url
}
```

🇻🇳 Object type `Person` với ba field; spec giải thích ngay sau đó: "name is a field that will yield a String value, and age is a field that will yield an Int value, and picture is a field that will yield a Url value."

### 6.3. Non-Null `!`

📖 **Nguyên văn** — §3.12 Non-Null

> "By default, all types in GraphQL are nullable; the null value is a valid response for all of the above types. To declare a type that disallows null, the GraphQL Non-Null type can be used. This type wraps an underlying type, and this type acts identically to that wrapped type, with the exception that null is not a valid response for the wrapping type. A trailing exclamation mark is used to denote a field that uses a Non-Null type like this: name: String!."

🇻🇳 **Dịch**

> "Mặc định, mọi type trong GraphQL đều nullable; giá trị `null` là một response hợp lệ cho tất cả các type nói trên. Để khai báo một type không cho phép `null`, có thể dùng Non-Null type của GraphQL. Type này bọc quanh một type bên dưới, và nó hành xử y hệt type bị bọc, chỉ khác là `null` không còn là response hợp lệ cho type bọc ngoài. Một dấu chấm than ở cuối được dùng để đánh dấu một field sử dụng Non-Null type, như thế này: `name: String!`."

📖 **Nguyên văn** — §3.12, Nullable vs. Optional

> "Fields are always optional within the context of a selection set, a field may be omitted and the selection set is still valid. However fields that return Non-Null types will never return the value null if queried.
>
> Inputs (such as field arguments), are always optional by default. However a non-null input type is required. In addition to not accepting the value null, it also does not accept omission. For the sake of simplicity nullable types are always optional and non-null types are always required."

🇻🇳 **Dịch**

> "Field luôn là tùy chọn trong ngữ cảnh một selection set — có thể bỏ một field đi mà selection set vẫn hợp lệ. Tuy nhiên, các field trả về Non-Null type sẽ không bao giờ trả về giá trị `null` nếu được query.
>
> Input (ví dụ field argument) thì mặc định luôn là tùy chọn. Nhưng một input type non-null là bắt buộc. Ngoài việc không chấp nhận giá trị `null`, nó còn không chấp nhận việc bị bỏ qua. Cho gọn: nullable type thì luôn optional, còn non-null type thì luôn required."

> [!warning] `!` không chỉ là ràng buộc — nó lan lỗi lên trên
> §3.12 Result Coercion nói: "To coerce the result of a Non-Null type, the coercion of the wrapped type should be performed. If that result was not null, then the result of coercing the Non-Null type is that result. If that result was null, then a field error must be raised." Và trong ghi chú kèm theo: "When a field error is raised on a non-null value, the error propagates to the parent field."
> 🇻🇳 Nghĩa là: một resolver trả `null` cho field khai `String!` không chỉ làm hỏng field đó — lỗi **lan lên field cha**, và có thể kéo theo cả nhánh response thành `null`. Đừng gắn `!` một cách hào phóng.

### 6.4. List `[]`

📖 **Nguyên văn** — §3.11 List

> "A GraphQL list is a special collection type which declares the type of each item in the List (referred to as the item type of the list). List values are serialized as ordered lists, where each item in the list is serialized as per the item type.
>
> To denote that a field uses a List type the item type is wrapped in square brackets like this: `pets: [Pet]`. Nesting lists is allowed: `matrix: [[Int]]`."

🇻🇳 **Dịch**

> "Một GraphQL list là một collection type đặc biệt, khai báo type của từng phần tử trong List (gọi là item type của list). Giá trị list được serialize thành danh sách có thứ tự, mỗi phần tử được serialize theo item type của nó.
>
> Để đánh dấu một field dùng List type, item type được bọc trong ngoặc vuông như thế này: `pets: [Pet]`. Cho phép lồng list: `matrix: [[Int]]`."

📖 **Nguyên văn** — §3.11 List, Result Coercion

> "If a list's item type is nullable, then errors occurring during preparation or coercion of an individual item in the list must result in a the value null at that position in the list along with a field error added to the response. If a list's item type is non-null, a field error occurring at an individual item in the list must result in a field error for the entire list."

🇻🇳 **Dịch**

> "Nếu item type của list là nullable, thì lỗi xảy ra khi chuẩn bị hoặc ép kiểu một phần tử riêng lẻ trong list phải cho ra giá trị `null` ở đúng vị trí đó trong list, kèm theo một field error được thêm vào response. Nếu item type của list là non-null, thì một field error xảy ra ở một phần tử riêng lẻ phải dẫn tới field error cho **toàn bộ** list."

### 6.5. Enum

📖 **Nguyên văn** — §3.9 Enums

> "GraphQL Enum types, like Scalar types, also represent leaf values in a GraphQL type system. However Enum types describe the set of possible values.
>
> Enums are not references for a numeric value, but are unique values in their own right. They may serialize as a string: the name of the represented value."

🇻🇳 **Dịch**

> "Enum type của GraphQL, cũng như Scalar type, biểu diễn các giá trị lá trong type system. Tuy nhiên Enum type mô tả **tập các giá trị khả dĩ**.
>
> Enum không phải là tham chiếu tới một giá trị số, mà tự thân là các giá trị duy nhất. Chúng có thể được serialize thành chuỗi: chính là tên của giá trị được biểu diễn."

📖 **Nguyên văn** — §3.9 Enums, Example № 78

```
enum Direction {
  NORTH
  EAST
  SOUTH
  WEST
}
```

🇻🇳 Enum `Direction` chỉ nhận đúng bốn giá trị. Client gửi `SOUTHEAST` là fail ở bước validation, chưa cần chạm tới resolver.

### 6.6. Interface

📖 **Nguyên văn** — §3.7 Interfaces

> "GraphQL interfaces represent a list of named fields and their arguments. GraphQL objects and interfaces can then implement these interfaces which requires that the implementing type will define all fields defined by those interfaces.
>
> Fields on a GraphQL interface have the same rules as fields on a GraphQL object; their type can be Scalar, Object, Enum, Interface, or Union, or any wrapping type whose base type is one of those five."

🇻🇳 **Dịch**

> "GraphQL interface biểu diễn một danh sách các field có tên cùng các argument của chúng. Các GraphQL object và interface sau đó có thể implement các interface này, và điều đó đòi hỏi type implement phải định nghĩa tất cả các field mà interface đó định nghĩa.
>
> Field trên một GraphQL interface tuân theo cùng quy tắc như field trên một GraphQL object; type của chúng có thể là Scalar, Object, Enum, Interface, hoặc Union, hoặc bất kỳ wrapping type nào có base type là một trong năm loại đó."

📖 **Nguyên văn** — §3.7 Interfaces, Example № 64 (trích phần đầu)

```
interface NamedEntity {
  name: String
}

interface ValuedEntity {
  value: Int
}

type Person implements NamedEntity {
  name: String
  age: Int
}
```

🇻🇳 `Person` implement `NamedEntity` nên bắt buộc phải có field `name: String`. Spec ghi rõ: "Types may also implement multiple interfaces" — một type có thể implement nhiều interface, viết bằng dấu `&`, ví dụ `type Business implements NamedEntity & ValuedEntity`.

### 6.7. Union

📖 **Nguyên văn** — §3.8 Unions

> "GraphQL Unions represent an object that could be one of a list of GraphQL Object types, but provides for no guaranteed fields between those types. They also differ from interfaces in that Object types declare what interfaces they implement, but are not aware of what unions contain them.
>
> With interfaces and objects, only those fields defined on the type can be queried directly; to query other fields on an interface, typed fragments must be used. This is the same as for unions, but unions do not define any fields, so no fields may be queried on this type without the use of type refining fragments or inline fragments (with the exception of the meta-field __typename)."

🇻🇳 **Dịch**

> "GraphQL Union biểu diễn một object có thể là một trong một danh sách các GraphQL Object type, nhưng không bảo đảm có field chung nào giữa các type đó. Chúng cũng khác interface ở chỗ: Object type khai báo nó implement interface nào, nhưng không hề biết union nào chứa nó.
>
> Với interface và object, chỉ những field được định nghĩa trên chính type đó mới query trực tiếp được; muốn query các field khác trên một interface thì phải dùng typed fragment. Với union cũng vậy, nhưng union không định nghĩa field nào cả, nên không field nào có thể được query trên type này nếu không dùng type refining fragment hoặc inline fragment (ngoại trừ meta-field `__typename`)."

📖 **Nguyên văn** — §3.8 Unions, Example № 74

```
union SearchResult = Photo | Person

type Person {
  name: String
  age: Int
}

type Photo {
  height: Int
  width: Int
}

type SearchQuery {
  firstSearchResult: SearchResult
}
```

🇻🇳 `SearchResult` là `Photo` hoặc `Person` — không có field chung. Spec đưa kèm một Counter Example № 75 là query `{ firstSearchResult { name height } }` và nói rõ nó **không hợp lệ** vì "a union itself defines no fields, this could be ambiguous and is invalid".

💡 **Ví dụ đời sống**

**Interface** giống như "mọi giấy tờ tùy thân đều phải có mục Họ tên" — ai làm giấy tờ gì cũng phải có field đó. **Union** giống như hộp "Đồ thất lạc" ở sân bay: trong đó có thể là cái ô, có thể là cái điện thoại — chẳng có thuộc tính chung nào, muốn xử lý thì phải mở ra xem nó **là cái gì** trước đã (`... on Photo`).

### 6.8. Input type

📖 **Nguyên văn** — §3.10 Input Objects

> "Fields may accept arguments to configure their behavior. These inputs are often scalars or enums, but they sometimes need to represent more complex values.
>
> A GraphQL Input Object defines a set of input fields; the input fields are either scalars, enums, or other input objects. This allows arguments to accept arbitrarily complex structs."

🇻🇳 **Dịch**

> "Field có thể nhận argument để cấu hình hành vi của chúng. Các input này thường là scalar hoặc enum, nhưng đôi khi cần biểu diễn những giá trị phức tạp hơn.
>
> Một GraphQL Input Object định nghĩa một tập các input field; các input field này là scalar, enum, hoặc các input object khác. Điều này cho phép argument nhận các struct phức tạp tùy ý."

📖 **Nguyên văn** — §3.10 Input Objects, Example № 79

```
input Point2D {
  x: Float
  y: Float
}
```

🇻🇳 `input` là từ khóa riêng, khác `type`. Không thể tái sử dụng Object type làm argument.

📖 **Nguyên văn** — §3.10 Input Objects, Note

> "The GraphQL Object type (ObjectTypeDefinition) defined above is inappropriate for re-use here, because Object types can contain fields that define arguments or contain references to interfaces and unions, neither of which is appropriate for use as an input argument. For this reason, input objects have a separate type in the system."

🇻🇳 **Dịch**

> "GraphQL Object type (ObjectTypeDefinition) định nghĩa ở trên không phù hợp để tái sử dụng ở đây, vì Object type có thể chứa các field định nghĩa argument hoặc chứa tham chiếu tới interface và union, mà cả hai đều không phù hợp để dùng làm input argument. Vì lý do đó, input object có một type riêng trong hệ thống."

---

## 7. Fields, arguments, aliases, fragments, variables, directives

### 7.1. Fields

📖 **Nguyên văn** — §2.5 Fields

> "A selection set is primarily composed of fields. A field describes one discrete piece of information available to request within a selection set.
>
> Some fields describe complex data or relationships to other data. In order to further explore this data, a field may itself contain a selection set, allowing for deeply nested requests. All GraphQL operations must specify their selections down to fields which return scalar values to ensure an unambiguously shaped response."

🇻🇳 **Dịch**

> "Một selection set chủ yếu được cấu thành từ các field. Một field mô tả một mẩu thông tin rời rạc có thể được yêu cầu bên trong một selection set.
>
> Một số field mô tả dữ liệu phức tạp hoặc các quan hệ tới dữ liệu khác. Để khám phá sâu hơn dữ liệu đó, bản thân một field có thể chứa một selection set, cho phép các request lồng sâu. Mọi GraphQL operation phải chỉ định selection của mình xuống tới các field trả về giá trị scalar, để bảo đảm response có hình dạng không mơ hồ."

### 7.2. Arguments

📖 **Nguyên văn** — §2.6 Arguments

> "Fields are conceptually functions which return values, and occasionally accept arguments which alter their behavior. These arguments often map directly to function arguments within a GraphQL service's implementation."

🇻🇳 **Dịch**

> "Về mặt khái niệm, field là các hàm trả về giá trị, và đôi khi nhận argument làm thay đổi hành vi của chúng. Các argument này thường ánh xạ trực tiếp tới argument của hàm bên trong phần triển khai của một GraphQL service."

📖 **Nguyên văn** — §2.6 Arguments, Example № 11

```
{
  user(id: 4) {
    id
    name
    profilePic(width: 100, height: 50)
  }
}
```

🇻🇳 Argument không chỉ có ở field gốc (`user(id: 4)`) mà có ở **mọi tầng** — `profilePic` nhận `width` và `height`. Đây là điểm REST không có: một endpoint REST chỉ nhận tham số ở một chỗ.

📖 **Nguyên văn** — §2.6, Arguments are unordered

> "Arguments may be provided in any syntactic order and maintain identical semantic meaning."

🇻🇳 **Dịch**

> "Argument có thể được cung cấp theo bất kỳ thứ tự cú pháp nào mà vẫn giữ nguyên ý nghĩa ngữ nghĩa."

### 7.3. Aliases

📖 **Nguyên văn** — §2.7 Field Alias

> "By default a field's response key in the response object will use that field's name. However, you can define a different response key by specifying an alias."

🇻🇳 **Dịch**

> "Mặc định, response key của một field trong response object sẽ dùng chính tên field đó. Tuy nhiên, bạn có thể định nghĩa một response key khác bằng cách chỉ định một alias."

📖 **Nguyên văn** — §2.7, Example № 14 và Example № 15

```
{
  user(id: 4) {
    id
    name
    smallPic: profilePic(size: 64)
    bigPic: profilePic(size: 1024)
  }
}
```

```
{
  "user": {
    "id": 4,
    "name": "Mark Zuckerberg",
    "smallPic": "https://cdn.site.io/pic-4-64.jpg",
    "bigPic": "https://cdn.site.io/pic-4-1024.jpg"
  }
}
```

🇻🇳 Không có alias thì hai lần gọi `profilePic` sẽ trùng key trong JSON. Alias `smallPic:` và `bigPic:` giải quyết chuyện đó — giống `AS` trong SQL, xem [[03 - Queries - SELECT, JOIN, Aggregate]].

> [!warning] Alias cũng là vũ khí tấn công
> Chính cơ chế alias này cho phép gọi cùng một field N lần trong **một** request — nền tảng của batching attack ở mục 10 bên dưới.

### 7.4. Fragments

📖 **Nguyên văn** — §2.8 Fragments

> "Fragments are the primary unit of composition in GraphQL.
>
> Fragments allow for the reuse of common repeated selections of fields, reducing duplicated text in the document. Inline Fragments can be used directly within a selection to condition upon a type condition when querying against an interface or union."

🇻🇳 **Dịch**

> "Fragment là đơn vị kết hợp chính yếu trong GraphQL.
>
> Fragment cho phép tái sử dụng những selection field lặp đi lặp lại, giảm text trùng lặp trong document. Inline Fragment có thể được dùng trực tiếp bên trong một selection để đặt điều kiện theo type condition khi query trên một interface hoặc union."

📖 **Nguyên văn** — §2.8 Fragments, Example № 19

```
query withFragments {
  user(id: 4) {
    friends(first: 10) {
      ...friendFields
    }
    mutualFriends(first: 10) {
      ...friendFields
    }
  }
}

fragment friendFields on User {
  id
  name
  profilePic(size: 50)
}
```

🇻🇳 Ba field `id`, `name`, `profilePic` được tách ra thành fragment `friendFields` và spread bằng `...` vào hai chỗ. Spec ghi: "Fragments are consumed by using the spread operator (...). All fields selected by the fragment will be added to the field selection at the same level as the fragment invocation."

📖 **Nguyên văn** — §2.8.1 Type Conditions

> "Fragments must specify the type they apply to. In this example, friendFields can be used in the context of querying a User.
>
> Fragments cannot be specified on any input value (scalar, enumeration, or input object).
>
> Fragments can be specified on object types, interfaces, and unions.
>
> Selections within fragments only return values when the concrete type of the object it is operating on matches the type of the fragment."

🇻🇳 **Dịch**

> "Fragment phải chỉ rõ type mà nó áp dụng lên. Trong ví dụ này, `friendFields` có thể dùng trong ngữ cảnh query một `User`.
>
> Fragment không thể được chỉ định trên bất kỳ input value nào (scalar, enumeration, hoặc input object).
>
> Fragment có thể được chỉ định trên object type, interface, và union.
>
> Các selection bên trong fragment chỉ trả về giá trị khi concrete type của object mà nó đang thao tác khớp với type của fragment."

### 7.5. Variables

📖 **Nguyên văn** — §2.10 Variables

> "A GraphQL operation can be parameterized with variables, maximizing reuse, and avoiding costly string building in clients at runtime.
>
> Variables must be defined at the top of an operation and are in scope throughout the execution of that operation. Values for those variables are provided to a GraphQL service as part of a request so they may be substituted in during execution."

🇻🇳 **Dịch**

> "Một GraphQL operation có thể được tham số hóa bằng variable, giúp tối đa hóa khả năng tái sử dụng và tránh việc nối chuỗi tốn kém ở phía client lúc runtime.
>
> Variable phải được định nghĩa ở đầu một operation và có phạm vi hiệu lực trong suốt quá trình thực thi operation đó. Giá trị cho các variable này được cung cấp cho GraphQL service như một phần của request, để chúng được thay thế vào trong lúc thực thi."

📖 **Nguyên văn** — §2.10 Variables, Example № 32 và Example № 33

```
query getZuckProfile($devicePicSize: Int) {
  user(id: 4) {
    id
    name
    profilePic(size: $devicePicSize)
  }
}
```

```
{
  "devicePicSize": 60
}
```

🇻🇳 Query được khai báo một lần với tham số `$devicePicSize`, giá trị thật đi riêng ở khối JSON variables.

> [!tip] Liên hệ với parameterized query
> Cơ chế này giống hệt tư tưởng của prepared statement trong SQL ở [[13 - SQL Injection và Parameterized Query]]: **cấu trúc truy vấn tách rời khỏi dữ liệu người dùng**. Spec nói rõ lợi ích là "avoiding costly string building in clients at runtime". Đừng bao giờ nối chuỗi giá trị người dùng trực tiếp vào GraphQL document — hãy dùng variables.

### 7.6. Directives

📖 **Nguyên văn** — §2.12 Directives

> "Directives provide a way to describe alternate runtime execution and type validation behavior in a GraphQL document.
>
> In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.
>
> Directives have a name along with a list of arguments which may accept values of any input type."

🇻🇳 **Dịch**

> "Directive cung cấp một cách để mô tả hành vi thực thi runtime và hành vi kiểm tra type thay thế trong một GraphQL document.
>
> Trong một số trường hợp, bạn cần cung cấp các tùy chọn để thay đổi hành vi thực thi của GraphQL theo cách mà field argument không làm được, chẳng hạn như đưa vào hay bỏ qua một field một cách có điều kiện. Directive làm được điều đó bằng cách mô tả thêm thông tin cho executor.
>
> Directive có một tên cùng một danh sách argument có thể nhận giá trị thuộc bất kỳ input type nào."

Hai directive dựng sẵn — spec §3.13 ghi: "GraphQL implementations should provide the @skip and @include directives."

📖 **Nguyên văn** — §3.13.1 @skip

> "directive @skip(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT"
>
> "The @skip built-in directive may be provided for fields, fragment spreads, and inline fragments, and allows for conditional exclusion during execution as described by the if argument."

🇻🇳 **Dịch**

> "`directive @skip(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT`"
>
> "Directive dựng sẵn `@skip` có thể được cung cấp cho field, fragment spread và inline fragment, cho phép loại trừ có điều kiện trong lúc thực thi theo như argument `if` mô tả."

📖 **Nguyên văn** — §3.13.1, Example № 93

```
query myQuery($someTest: Boolean!) {
  experimentalField @skip(if: $someTest)
}
```

🇻🇳 `experimentalField` chỉ được query khi `$someTest` có giá trị `false`.

📖 **Nguyên văn** — §3.13.2 @include

> "The @include built-in directive may be provided for fields, fragment spreads, and inline fragments, and allows for conditional inclusion during execution as described by the if argument."

🇻🇳 **Dịch**

> "Directive dựng sẵn `@include` có thể được cung cấp cho field, fragment spread và inline fragment, cho phép đưa vào có điều kiện trong lúc thực thi theo như argument `if` mô tả."

📖 **Nguyên văn** — §3.13.2

> "Neither @skip nor @include has precedence over the other. In the case that both the @skip and @include directives are provided on the same field or fragment, it must be queried only if the @skip condition is false and the @include condition is true. Stated conversely, the field or fragment must not be queried if either the @skip condition is true or the @include condition is false."

🇻🇳 **Dịch**

> "Không cái nào trong `@skip` và `@include` có quyền ưu tiên hơn cái kia. Trong trường hợp cả hai directive `@skip` và `@include` cùng được đặt trên một field hoặc fragment, field/fragment đó chỉ được query khi điều kiện `@skip` là `false` **và** điều kiện `@include` là `true`. Nói ngược lại, field hoặc fragment đó không được query nếu điều kiện `@skip` là `true` **hoặc** điều kiện `@include` là `false`."

---

## 8. Execution và resolver

📖 **Nguyên văn** — §6 Execution

> "GraphQL generates a response from a request via execution.
>
> A request for execution consists of a few pieces of information:
>
> The schema to use, typically solely provided by the GraphQL service.
>
> A Document which must contain GraphQL OperationDefinition and may contain FragmentDefinition.
>
> Optionally: The name of the Operation in the Document to execute.
>
> Optionally: Values for any Variables defined by the Operation.
>
> An initial value corresponding to the root type being executed. Conceptually, an initial value represents the "universe" of data available via a GraphQL Service. It is common for a GraphQL Service to always use the same initial value for every request."

🇻🇳 **Dịch**

> "GraphQL sinh ra response từ một request thông qua quá trình execution.
>
> Một request để thực thi gồm vài mẩu thông tin:
>
> - Schema sẽ dùng, thường chỉ do GraphQL service cung cấp.
> - Một Document bắt buộc phải chứa GraphQL OperationDefinition và có thể chứa FragmentDefinition.
> - Tùy chọn: tên của Operation trong Document cần thực thi.
> - Tùy chọn: giá trị cho các Variable mà Operation định nghĩa.
> - Một giá trị khởi đầu tương ứng với root type đang được thực thi. Về mặt khái niệm, giá trị khởi đầu biểu diễn "vũ trụ" dữ liệu có thể truy cập qua một GraphQL Service. Thông thường một GraphQL Service luôn dùng cùng một giá trị khởi đầu cho mọi request."

📖 **Nguyên văn** — §6.4 Executing Fields

> "Each field requested in the grouped field set that is defined on the selected objectType will result in an entry in the response map. Field execution first coerces any provided argument values, then resolves a value for the field, and finally completes that value either by recursively executing another selection set or coercing a scalar value."

🇻🇳 **Dịch**

> "Mỗi field được yêu cầu trong grouped field set và được định nghĩa trên objectType đã chọn sẽ sinh ra một entry trong response map. Việc thực thi field trước tiên ép kiểu mọi giá trị argument được cung cấp, sau đó resolve một giá trị cho field, và cuối cùng hoàn tất giá trị đó bằng cách hoặc thực thi đệ quy một selection set khác, hoặc ép kiểu một giá trị scalar."

📖 **Nguyên văn** — §6.4.2 Value Resolution

> "While nearly all of GraphQL execution can be described generically, ultimately the internal system exposing the GraphQL interface must provide values. This is exposed via ResolveFieldValue, which produces a value for a given field on a type for a real value.
>
> As an example, this might accept the objectType Person, the field "soulMate", and the objectValue representing John Lennon. It would be expected to yield the value representing Yoko Ono."

🇻🇳 **Dịch**

> "Trong khi gần như toàn bộ quá trình execution của GraphQL có thể được mô tả một cách tổng quát, thì rốt cuộc hệ thống nội bộ đang phơi ra interface GraphQL vẫn phải cung cấp các giá trị. Điều này được phơi ra qua `ResolveFieldValue`, hàm sinh ra một giá trị cho một field cho trước trên một type, ứng với một giá trị thật.
>
> Ví dụ, nó có thể nhận objectType `Person`, field `"soulMate"`, và objectValue biểu diễn John Lennon. Kỳ vọng là nó sẽ cho ra giá trị biểu diễn Yoko Ono."

📖 **Nguyên văn** — §6.4.2, Note

> "It is common for resolver to be asynchronous due to relying on reading an underlying database or networked service to produce a value. This necessitates the rest of a GraphQL executor to handle an asynchronous execution flow."

🇻🇳 **Dịch**

> "Resolver thường là bất đồng bộ, vì nó phải đọc từ một database hay một dịch vụ qua mạng bên dưới để sinh ra giá trị. Điều này buộc phần còn lại của GraphQL executor phải xử lý một luồng thực thi bất đồng bộ."

### Resolver trông như thế nào

📖 **Nguyên văn** — graphql.org/learn/execution/, mục "Field resolvers"

> "You can think of each field in a GraphQL query as a function or method of the previous type which returns the next type. This is exactly how GraphQL works—each field on each type is backed by a resolver function that is written by the GraphQL server developer. When a field is executed, the corresponding resolver is called to produce the next value.
>
> If a field produces a scalar value like a string or number, then the execution completes. However, if a field produces an object value then the query will contain another selection of fields that apply to that object. This continues until the leaf values are reached. GraphQL queries always end at Scalar or Enum types."

🇻🇳 **Dịch**

> "Bạn có thể hình dung mỗi field trong một GraphQL query như một hàm hoặc method của type trước đó, trả về type kế tiếp. Đó đúng là cách GraphQL hoạt động — mỗi field trên mỗi type được chống lưng bởi một hàm resolver do lập trình viên GraphQL server viết ra. Khi một field được thực thi, resolver tương ứng được gọi để sinh ra giá trị kế tiếp.
>
> Nếu một field sinh ra một giá trị scalar như string hay number, thì việc thực thi kết thúc. Tuy nhiên, nếu một field sinh ra một giá trị object thì query sẽ chứa thêm một tập field áp dụng lên object đó. Quá trình này tiếp tục cho tới khi chạm tới các giá trị lá. GraphQL query luôn kết thúc ở Scalar hoặc Enum type."

📖 **Nguyên văn** — graphql.org/learn/execution/, ví dụ resolver bằng JavaScript

```
function resolveHuman(obj, args, context, info) {
  return context.db.loadHumanByID(args.id).then(userData => new Human(userData));
}
```

🇻🇳 Resolver của field `human`: đọc từ database qua `context.db`, trả về một Promise. Chú ý bốn tham số — tài liệu giải thích ngay bên dưới.

📖 **Nguyên văn** — graphql.org/learn/execution/

> "obj: The previous object (for a field on the root Query type, this argument is often not used).
>
> args: The arguments provided to the field in the GraphQL operation.
>
> context: A value provided to every resolver that may hold important contextual information like the currently logged in user, or access to a database.
>
> info: generally only used in advanced use-cases, this is a value holding field-specific information relevant to the current operation as well as the schema details"

🇻🇳 **Dịch**

> "**obj**: object ở tầng trước (với một field trên root Query type, argument này thường không được dùng).
>
> **args**: các argument được cung cấp cho field trong GraphQL operation.
>
> **context**: một giá trị được cung cấp cho mọi resolver, có thể chứa thông tin ngữ cảnh quan trọng như người dùng đang đăng nhập, hoặc quyền truy cập vào database.
>
> **info**: thường chỉ dùng trong các trường hợp nâng cao, đây là giá trị chứa thông tin riêng của field liên quan tới operation hiện tại cũng như chi tiết schema."

📖 **Nguyên văn** — graphql.org/learn/execution/, mục "Trivial resolvers"

```
function resolveHumanName(obj, args, context, info) {
  return obj.name;
}
```

🇻🇳 Resolver "tầm thường": chỉ đọc property cùng tên từ object cha. Tài liệu ghi: "Many GraphQL libraries let you omit resolvers this simple, assuming that if a resolver isn't provided for a field, a property of the same name should be read and returned."

> [!tip] `context` là nơi đặt danh tính người dùng
> Tài liệu chính thức nói `context` "may hold important contextual information like the currently logged in user". Đây chính là móc nối giữa execution và authorization ở mục 10 — kiểm tra quyền phải đọc danh tính từ `context` **trong từng resolver**.

---

## 9. Introspection

📖 **Nguyên văn** — §4 Introspection

> "A GraphQL service supports introspection over its schema. This schema is queried using GraphQL itself, creating a powerful platform for tool-building."

🇻🇳 **Dịch**

> "Một GraphQL service hỗ trợ introspection trên schema của chính nó. Schema này được truy vấn bằng chính GraphQL, tạo ra một nền tảng mạnh mẽ để xây dựng công cụ."

📖 **Nguyên văn** — §4 Introspection, Example № 97 và Example № 98

```
type User {
  id: String
  name: String
  birthday: Date
}
```

```
{
  __type(name: "User") {
    name
    fields {
      name
      type {
        name
      }
    }
  }
}
```

🇻🇳 Cho một type `User`, ta query meta-field `__type` để hỏi ngược lại chính schema: type này có những field nào, mỗi field kiểu gì.

📖 **Nguyên văn** — graphql.org/learn/introspection/, mục "Schema introspection"

> "Introspection can do more than provide type names in a query. If you designed the type system for a GraphQL API, then you'll likely already know what types are available. But if you didn't design it, you can ask GraphQL by querying the __schema field, which is always available on the query root operation type."

🇻🇳 **Dịch**

> "Introspection làm được nhiều hơn là chỉ cung cấp tên type trong một query. Nếu bạn là người thiết kế type system cho một GraphQL API thì hẳn bạn đã biết có những type nào. Nhưng nếu bạn không thiết kế nó, bạn có thể hỏi GraphQL bằng cách query field `__schema`, field này luôn có sẵn trên query root operation type."

📖 **Nguyên văn** — graphql.org/learn/introspection/

> "As demonstrated above, we can access the documentation about the type system using introspection and create documentation browsers or rich IDE experiences."

🇻🇳 **Dịch**

> "Như đã minh họa ở trên, ta có thể truy cập tài liệu về type system bằng introspection và tạo ra các trình duyệt tài liệu hoặc trải nghiệm IDE phong phú."

### Vì sao introspection lại đẻ ra GraphiQL và code generation

> [!note] Ghi chú — đây là giải thích, không trích nguyên văn
> Ghép hai điều spec đã nói lại: (1) schema là **strong-typed** và (2) schema **tự truy vấn được bằng chính GraphQL**. Hệ quả là bất kỳ công cụ nào cũng có thể, chỉ bằng một HTTP request, tải về toàn bộ bản đồ API: mọi type, mọi field, mọi argument, mọi description.
> - **GraphiQL / playground**: có bản đồ đó thì tự dựng được autocomplete, tooltip tài liệu, và báo lỗi khi bạn gõ sai field — mà không cần ai viết tay file cấu hình nào.
> - **Code generation**: cũng từ bản đồ đó, công cụ sinh ra type/class phía client khớp chính xác với server.
> Với REST, muốn có ngần ấy thứ bạn phải tự viết và tự bảo trì một file OpenAPI song song với code. Với GraphQL, nguồn sự thật là chính runtime.
>
> Đổi lại: **cùng cái bản đồ đó cũng phục vụ kẻ tấn công**. Xem mục 10.

---

## 10. Bảo mật

> Toàn bộ mục này trích từ **OWASP GraphQL Cheat Sheet** — https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html

> [!danger] GraphQL mở ra một bề mặt tấn công mà REST không có
> Sức mạnh "client-specified response" là con dao hai lưỡi: client tự soạn hình dạng truy vấn, nên client cũng tự soạn được truy vấn đủ nặng để giết server.

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, Common Attacks

> "Injection - this usually includes but is not limited to:
>
> SQL and NoSQL injection
>
> OS Command injection
>
> SSRF and CRLF injection/Request Smuggling
>
> DoS (Denial of Service)
>
> Abuse of broken authorization: either improper or excessive access, including IDOR
>
> Batching Attacks, a GraphQL-specific method of brute force attack
>
> Abuse of insecure default configurations"

🇻🇳 **Dịch**

> "**Injection** — thường bao gồm nhưng không giới hạn ở: SQL và NoSQL injection; OS Command injection; SSRF và CRLF injection / Request Smuggling.
>
> **DoS (Denial of Service).**
>
> **Lạm dụng authorization bị hỏng**: truy cập không đúng hoặc quá mức, bao gồm cả IDOR.
>
> **Batching Attack**, một phương pháp brute force đặc thù của GraphQL.
>
> **Lạm dụng các cấu hình mặc định không an toàn.**"

### 10.1. Giới hạn độ sâu và số lượng (query depth / amount limiting)

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Query Limiting (Depth & Amount)"

> "In GraphQL each query has a depth (e.g. nested objects) and each object requested in a query can have an amount specified (e.g. 99999999 of an object). By default these can both be unlimited which may lead to a DoS. You should set limits on depth and amount to prevent DoS, but this usually requires a small custom implementation as it is not natively supported by GraphQL."

🇻🇳 **Dịch**

> "Trong GraphQL, mỗi query có một độ sâu (ví dụ các object lồng nhau) và mỗi object được yêu cầu trong query có thể được chỉ định một số lượng (ví dụ 99999999 phần tử của một object). Mặc định cả hai đều có thể không giới hạn, điều này có thể dẫn tới DoS. Bạn nên đặt giới hạn cho độ sâu và số lượng để ngăn DoS, nhưng việc này thường đòi hỏi một phần triển khai tùy chỉnh nho nhỏ vì GraphQL không hỗ trợ sẵn."

📖 **Nguyên văn** — OWASP, ví dụ query có độ sâu N

```
query evil {            # Depth: 0
  album(id: 42) {       # Depth: 1
    songs {             # Depth: 2
      album {           # Depth: 3
        ...             # Depth: ...
        album {id: N}   # Depth: N
      }
    }
  }
}
```

🇻🇳 Vì `album` có `songs`, và `songs` lại có `album`, kẻ tấn công lồng vòng tròn vô hạn. Một request nhỏ xíu nhưng bắt server duyệt cây dữ liệu bùng nổ theo cấp số nhân.

📖 **Nguyên văn** — OWASP, ví dụ query yêu cầu số lượng lớn

```
query {
  author(id: "abc") {
    posts(first: 99999999) {
      title
    }
  }
}
```

🇻🇳 Không giới hạn amount thì `first: 99999999` là hợp lệ về mặt schema — server sẽ ngoan ngoãn cố lấy ngần ấy bản ghi.

### 10.2. Query cost analysis

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Query Cost Analysis"

> "Query cost analysis involves assigning costs to the resolution of fields or types in incoming queries so that the server can reject queries that cost too much to run or will consume too many resources. This is not easy to implement and may not always be necessary but it is the most thorough approach to preventing DoS."

🇻🇳 **Dịch**

> "Query cost analysis là việc gán chi phí cho việc resolve các field hoặc type trong query đi vào, để server có thể từ chối những query quá đắt để chạy hoặc sẽ ngốn quá nhiều tài nguyên. Việc này không dễ triển khai và không phải lúc nào cũng cần thiết, nhưng đây là cách triệt để nhất để ngăn DoS."

### 10.3. Batching attack

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Batching Attacks"

> "GraphQL supports batching requests, also known as query batching. This lets callers to either batch multiple queries or batch requests for multiple object instances in a single network call, which allows for what is called a batching attack. This is a form of brute force attack, specific to GraphQL, that usually allows for faster and less detectable exploits."

🇻🇳 **Dịch**

> "GraphQL hỗ trợ gộp request, còn gọi là query batching. Điều này cho phép bên gọi gộp nhiều query, hoặc gộp các request cho nhiều instance object, vào một lượt gọi mạng duy nhất — và chính đó là cái gọi là batching attack. Đây là một dạng tấn công brute force đặc thù của GraphQL, thường cho phép khai thác nhanh hơn và khó bị phát hiện hơn."

📖 **Nguyên văn** — OWASP, ví dụ batched query bằng alias

```
query {
  droid(id: "2000") {
    name
  }
  second:droid(id: "2001") {
    name
  }
  third:droid(id: "2002") {
    name
  }
}
```

🇻🇳 Nhờ alias (`second:`, `third:`), một HTTP request duy nhất dò được nhiều ID. Nhân lên hàng nghìn alias là có brute force OTP / session token trong một lượt gọi.

📖 **Nguyên văn** — OWASP, hệ quả của batching attack

> "WAFs, RASPs, IDS/IPS, SIEMs, or other security tooling will likely not detect these attacks since they only appear to be one single request rather than an a massive amount of network traffic.
>
> This attack will likely bypass existing rate limits in tools like Nginx or other proxies/gateways since they rely on looking at the raw number of requests."

🇻🇳 **Dịch**

> "WAF, RASP, IDS/IPS, SIEM hay các công cụ bảo mật khác nhiều khả năng sẽ không phát hiện được những tấn công này, vì chúng chỉ trông như một request đơn lẻ chứ không phải một lượng lớn lưu lượng mạng.
>
> Tấn công này nhiều khả năng sẽ đi vòng qua các rate limit hiện có trong những công cụ như Nginx hay các proxy/gateway khác, vì chúng chỉ dựa vào việc đếm số lượng request thô."

📖 **Nguyên văn** — OWASP, "Mitigating Batching Attacks"

> "In order to mitigate this type of attack you should put limits on incoming requests at the code level so that they can be applied per request. There are 3 main options:
>
> Add object request rate limiting in code
>
> Prevent batching for sensitive objects
>
> Limit the number of queries that can run at one time"

🇻🇳 **Dịch**

> "Để giảm thiểu loại tấn công này, bạn nên đặt giới hạn cho request đi vào ở **tầng code**, để chúng có thể được áp dụng theo từng request. Có 3 lựa chọn chính:
>
> - Thêm rate limit theo số object được yêu cầu, ngay trong code.
> - Cấm batching với các object nhạy cảm.
> - Giới hạn số query có thể chạy cùng lúc."

> [!danger] Rate limit ở tầng hạ tầng là KHÔNG ĐỦ cho GraphQL
> Với REST, "1000 request/phút/IP" ở Nginx là một phòng tuyến có nghĩa. Với GraphQL, một request duy nhất có thể chứa 10.000 alias. OWASP nói thẳng: các công cụ đó "rely on looking at the raw number of requests" — chúng đếm số gói tin, không đếm số object bị đụng tới. Phòng tuyến thật phải nằm **trong code**, ở tầng resolver.

### 10.4. Tắt introspection ở production

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Access Control"

> "Disable introspection queries system-wide in any production or publicly accessible environments.
>
> Disable GraphiQL and other similar schema exploration tools in production or publicly accessible environments."

🇻🇳 **Dịch**

> "Tắt introspection query trên toàn hệ thống ở mọi môi trường production hoặc môi trường truy cập được công khai.
>
> Tắt GraphiQL và các công cụ khám phá schema tương tự ở môi trường production hoặc truy cập được công khai."

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Introspection + GraphiQL"

> "This might be an intended configuration if your API is designed to be consumed by external clients, but can also be an issue if the API was designed to be used internally only. Although security by obscurity is not recommended, it might be a good idea to consider removing the Introspection to avoid any leak."

🇻🇳 **Dịch**

> "Đây có thể là một cấu hình có chủ đích nếu API của bạn được thiết kế để client bên ngoài tiêu thụ, nhưng cũng có thể là một vấn đề nếu API vốn chỉ được thiết kế để dùng nội bộ. Mặc dù security by obscurity không được khuyến nghị, việc cân nhắc gỡ bỏ Introspection để tránh rò rỉ có thể là một ý hay."

Tài liệu chính thức của GraphQL Foundation cũng nói tương tự:

📖 **Nguyên văn** — graphql.org/learn/introspection/, mục "Introspection in production"

> "Disabling introspection in production is common in order to reduce the API's attack surface. This is often part of a broader API security strategy, which may also include authentication and authorization, operation safe-listing (or a range of alternative protections, such as depth-limiting, breadth-limiting, alias limits, cycle rejection, cost analysis, etc.), execution timeouts, and more."

🇻🇳 **Dịch**

> "Tắt introspection ở production là chuyện phổ biến, nhằm giảm bề mặt tấn công của API. Đây thường là một phần của chiến lược bảo mật API rộng hơn, có thể còn bao gồm authentication và authorization, danh sách trắng operation (hoặc một loạt biện pháp thay thế như giới hạn độ sâu, giới hạn độ rộng, giới hạn alias, từ chối chu trình, phân tích chi phí, v.v.), timeout thực thi, và nhiều thứ khác."

### 10.5. Authorization phải nằm ở tầng resolver

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Access Control"

> "Always validate that the requester is authorized to view or mutate/modify the data they are requesting. This can be done with RBAC or other access control mechanisms.
>
> This will prevent IDOR issues, including both BOLA and BFLA.
>
> Enforce authorization checks on both edges and nodes (see example bug report where nodes did not have authorization checks but edges did).
>
> Use Interfaces and Unions to create structured, hierarchical data types which can be used to return more or fewer object properties, according to requester permissions.
>
> Query and Mutation Resolvers can be used to perform access control validation, possibly using some RBAC middleware."

🇻🇳 **Dịch**

> "Luôn kiểm tra rằng bên gửi request có quyền xem hoặc mutate/sửa đổi dữ liệu mà họ đang yêu cầu. Việc này có thể làm bằng RBAC hoặc các cơ chế kiểm soát truy cập khác.
>
> Điều này sẽ ngăn được các vấn đề IDOR, gồm cả BOLA lẫn BFLA.
>
> Áp dụng kiểm tra authorization trên **cả edge lẫn node** (xem báo cáo lỗi ví dụ, trong đó node không có kiểm tra authorization còn edge thì có).
>
> Dùng Interface và Union để tạo các kiểu dữ liệu có cấu trúc, phân cấp, nhằm trả về nhiều hay ít thuộc tính object tùy theo quyền của người gửi request.
>
> Có thể dùng Query Resolver và Mutation Resolver để thực hiện kiểm tra kiểm soát truy cập, có thể kèm theo một middleware RBAC nào đó."

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "General Data Access"

> "It's commonplace for GraphQL requests to include one or more direct IDs of objects in order to fetch or modify them. For example, a request for a certain picture may include the ID that is actually the primary key in the database for that picture. As with any request, the server must verify that the caller has access to the object they are requesting. But sometimes developers make the mistake of assuming that possession of the object's ID means the caller should have access. Failure to verify the requester's access in this case is called Broken Object Level Authentication, also known as IDOR."

🇻🇳 **Dịch**

> "Việc GraphQL request chứa một hoặc nhiều ID trực tiếp của object để lấy hoặc sửa chúng là chuyện rất thường gặp. Ví dụ, một request lấy một tấm ảnh nào đó có thể chứa ID vốn chính là primary key của tấm ảnh đó trong database. Như với mọi request, server phải xác minh rằng bên gọi có quyền truy cập object họ đang yêu cầu. Nhưng đôi khi lập trình viên mắc sai lầm là mặc định rằng việc nắm được ID của object nghĩa là bên gọi đáng được truy cập. Việc không xác minh quyền truy cập của bên gửi request trong trường hợp này được gọi là Broken Object Level Authentication, còn gọi là IDOR."

> [!danger] Vì sao GraphQL dễ hổng authorization hơn REST
> Đây là **nhận định** (không phải câu trích), nhưng theo thẳng từ kiến trúc spec: với REST, mỗi endpoint là một cửa, bạn đặt một chốt kiểm tra ở cửa là xong. Với GraphQL, chỉ có **một** cửa HTTP nhưng bên trong là một đồ thị — client có thể đi tới cùng một object qua rất nhiều đường (`user.orders.customer`, `order.customer`, `node(id:)`). Đặt chốt ở cửa HTTP là vô nghĩa. OWASP vì thế chỉ ra đúng nơi phải đặt chốt: **resolver**, và nhấn mạnh "on both edges and nodes" — vì rất nhiều lỗ hổng thật đến từ việc quên khóa một trong hai.

### 10.6. Input validation

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "Input Validation"

> "Adding strict input validation can help prevent against injection and DoS. The main design for GraphQL is that the user supplies one or more identifiers and the backend has a number of data fetchers making HTTP, DB, or other calls using the given identifiers. This means that user input will be included in HTTP requests, DB queries, or other requests/calls which provides opportunity for injection that could lead to various injection attacks or DoS."

🇻🇳 **Dịch**

> "Thêm input validation nghiêm ngặt có thể giúp ngăn injection và DoS. Thiết kế chính của GraphQL là người dùng cung cấp một hoặc nhiều định danh, còn backend có một loạt data fetcher thực hiện các lời gọi HTTP, DB hoặc lời gọi khác bằng các định danh đó. Điều này có nghĩa là input của người dùng sẽ được đưa vào HTTP request, DB query, hoặc các request/lời gọi khác — và đó chính là cơ hội cho injection, có thể dẫn tới nhiều dạng tấn công injection hoặc DoS."

📖 **Nguyên văn** — OWASP GraphQL Cheat Sheet, "General Practices"

> "Validate all incoming data to only allow valid values (i.e. allowlist).
>
> Use specific GraphQL data types such as scalars or enums. Write custom GraphQL validators for more complex validations. Custom scalars may also come in handy.
>
> Define schemas for mutations input."

🇻🇳 **Dịch**

> "Kiểm tra mọi dữ liệu đi vào để chỉ cho phép các giá trị hợp lệ (tức là dùng allowlist).
>
> Dùng các kiểu dữ liệu GraphQL cụ thể như scalar hoặc enum. Viết custom validator của GraphQL cho các phép kiểm tra phức tạp hơn. Custom scalar cũng có thể rất hữu ích.
>
> Định nghĩa schema cho input của mutation."

> [!danger] Type system KHÔNG phải là hàng rào chống SQL injection
> Schema bảo đảm `id` là một `String`, nó không bảo đảm `id` không chứa `' OR 1=1 --`. Resolver vẫn phải dùng parameterized query — xem [[13 - SQL Injection và Parameterized Query]]. GraphQL chỉ dời chỗ nhận input, chứ không khử độc input.

---

## 11. Bảng so sánh GraphQL vs REST

> Cột "truy nguồn" cho biết mỗi ô đến từ đâu. Ô ghi *nhận định* là suy luận của người viết note, không phải câu trích.

| Khía cạnh | GraphQL | REST | Truy nguồn |
|---|---|---|---|
| Hình dạng response do ai quyết định | Client. "A GraphQL response, on the other hand, contains exactly what a client asks for and no more." | Server. "the service determines the shape of data returned from its various endpoints" | Cả hai vế đều trích spec §1 Overview, mục Client-specified response |
| Over/under-fetching | Tránh được: "An operation selects the set of information it needs, and will receive exactly that information and nothing more, avoiding over-fetching and under-fetching data." | — | Trích spec §2.4; vế REST spec không nói, để trống |
| Số endpoint | Thường là một endpoint duy nhất | Nhiều endpoint theo resource | *Nhận định*. Spec không quy định về HTTP endpoint; đây là thực hành phổ biến |
| Type system | Bắt buộc. "Every GraphQL service defines an application-specific type system." | Không bắt buộc; cần OpenAPI/JSON Schema bổ sung | Vế GraphQL trích spec §1 Overview; vế REST là *nhận định* |
| Validate trước khi chạy | Có. "tools can ensure that it is both syntactically correct and valid within that type system before execution, i.e. at development time" | — | Trích spec §1 Overview, mục Strong-typing |
| Khám phá API | Introspection dựng sẵn: "A GraphQL service supports introspection over its schema. This schema is queried using GraphQL itself" | Cần tài liệu ngoài | Vế GraphQL trích spec §4; vế REST là *nhận định* |
| N+1 ở tầng network (client) | Giảm — một document mô tả cả cây dữ liệu | Dễ mắc — phải gọi lặp | *Nhận định*, suy ra từ nguyên tắc "Hierarchical" trong spec §1 |
| N+1 ở tầng data source (server) | Nguy cơ cao: "a naive GraphQL service could be very “chatty” or repeatedly load data from your databases" | Thấp hơn, vì mỗi endpoint thường có một truy vấn được tối ưu tay | Vế GraphQL trích graphql.org/learn/performance/; vế REST là *nhận định* |
| Rate limiting theo số request | Không đủ: "This attack will likely bypass existing rate limits in tools like Nginx or other proxies/gateways since they rely on looking at the raw number of requests." | Hiệu quả hơn | Trích OWASP GraphQL Cheat Sheet, Batching Attacks; vế REST là *nhận định* |
| Nơi đặt authorization | Resolver: "Query and Mutation Resolvers can be used to perform access control validation" | Có thể đặt ở tầng route/middleware | Vế GraphQL trích OWASP, mục Access Control; vế REST là *nhận định* |
| Thứ tự thực thi nhiều thao tác ghi | Tuần tự theo spec: mutation "should be executed serially" | Không có khái niệm tương đương trong một request | Vế GraphQL trích spec §6.2.2; vế REST là *nhận định* |

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

Shopify Admin API dùng GraphQL, nên mọi thứ trong bài này áp thẳng vào công việc hằng ngày. Ba chỗ đáng để ý nhất — **đều là suy luận từ spec, không phải mô tả API của Shopify**, hãy kiểm tra lại trên tài liệu chính thức của Shopify trước khi dựa vào bất cứ con số hay tên gọi cụ thể nào:

1. **Chỉ xin field mình dùng.** Đây là hệ quả trực tiếp của nguyên tắc "Client-specified response". Query càng gọn thì response càng nhỏ, và với những API tính chi phí theo độ phức tạp truy vấn thì query gọn cũng thường rẻ hơn — nhưng cách tính cụ thể là do từng nhà cung cấp quy định, phải tra tài liệu của họ.

2. **Nếu bạn tự viết GraphQL server** (ví dụ một API nội bộ cho app chạy trên Cloud Run, đọc dữ liệu từ Firestore), thì mục 4 là thứ phải xử lý ngay từ ngày đầu: mỗi field một resolver, mỗi resolver một lần đọc Firestore, một list 200 phần tử là 200 lượt đọc. Batching (DataLoader hoặc cơ chế tương đương) không phải tối ưu hóa muộn — nó là kiến trúc.

3. **Authorization ở resolver, không phải ở middleware HTTP.** Nếu app của bạn phơi GraphQL cho nhiều shop, thì việc lọc theo shop phải nằm trong từng resolver, đọc danh tính từ `context`. Một endpoint duy nhất nghĩa là một chốt kiểm tra duy nhất ở tầng HTTP là không đủ.

---

## Liên kết

- Bài trước: [[06 - gRPC và Protocol Buffers]]
- Bài kế: [[08 - OpenAPI Specification]]
- [[07 - N+1 Problem]] — GraphQL giải quyết N+1 ở tầng client nhưng tạo ra nguy cơ N+1 ở tầng resolver; đọc cùng mục 4 của bài này
- [[03 - Queries - SELECT, JOIN, Aggregate]] — alias trong GraphQL tương ứng `AS` trong SQL; batching resolver nghĩa là gom N truy vấn thành một `IN (...)`
- [[13 - SQL Injection và Parameterized Query]] — variables của GraphQL cùng tư tưởng tách cấu trúc khỏi dữ liệu; nhưng type system không thay thế được parameterized query
- [[11 - NULL, Hàm String, Date và JSON]] — GraphQL response được serialize thành JSON; khái niệm nullable/non-null (`!`) đối chiếu với `NULL` trong SQL
- [[02 - What is HTTP]] — GraphQL thường chạy trên HTTP, nhưng spec không bắt buộc transport nào

## Nguồn tham khảo

- GraphQL Specification, October 2021 Edition : https://spec.graphql.org/October2021/
- GraphQL — Learn (GraphQL Foundation) : https://graphql.org/learn/
- GraphQL — Learn / Execution : https://graphql.org/learn/execution/
- GraphQL — Learn / Introspection : https://graphql.org/learn/introspection/
- GraphQL — Learn / Performance : https://graphql.org/learn/performance/
- GraphQL — Learn / Queries : https://graphql.org/learn/queries/
- GraphQL — Learn / Schemas and Types : https://graphql.org/learn/schema/
- OWASP GraphQL Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
