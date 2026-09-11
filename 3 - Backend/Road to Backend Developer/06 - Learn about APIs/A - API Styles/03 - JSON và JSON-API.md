# 03 — JSON và JSON:API

> **Nguồn chính:** JSON:API — Latest Specification (v1.1) — https://jsonapi.org/format/
> Bài này bám sát spec JSON:API v1.1 (Document Structure, Fetching Data, Errors), cộng với mô tả chính thức của JSON tại json.org và RFC 8259 làm nền.

---

## Ba thứ tên na ná nhau — đừng nhầm

> [!warning] Ba khái niệm khác nhau, tên gần giống nhau
> - **JSON** — một **định dạng dữ liệu** (data-interchange format). Chuẩn hoá bởi [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.txt) và ECMA-404. Nó chỉ nói "dữ liệu viết ra dạng text trông thế nào", không nói gì về API.
> - **"JSON API"** (viết thường, nghĩa chung) — cách gọi bất kỳ API nào trả về payload dạng JSON. Đây **không phải một spec**, chỉ là cách nói. Một REST API trả JSON, một RPC endpoint trả JSON — đều bị gọi là "JSON API".
> - **JSON:API** (có dấu hai chấm) — một **spec cụ thể** ở https://jsonapi.org, quy định chính xác cấu trúc của request/response: phải có key `data`, resource phải có `type` và `id`, quan hệ để trong `relationships`, media type là `application/vnd.api+json`...
>
> Nói "tôi làm JSON API" ≠ "tôi tuân thủ JSON:API". Cái thứ hai là một contract chặt, có thể validate được.

💡 **Ví dụ đời sống**
- **JSON** = tiếng Việt (một ngôn ngữ để viết).
- **"JSON API"** = "tôi viết đơn bằng tiếng Việt" — đúng ngôn ngữ, nhưng bố cục tuỳ hứng.
- **JSON:API** = mẫu đơn xin nghỉ phép có sẵn ô "Họ tên", "Lý do", "Từ ngày", "Đến ngày". Cũng là tiếng Việt, nhưng ai cũng biết trước ô nào nằm ở đâu, nên máy quét đơn tự động đọc được.

---

# PHẦN A — JSON là gì

## Định nghĩa chính thức (json.org)

📖 **Nguyên văn**
> "JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. It is based on a subset of the JavaScript Programming Language Standard ECMA-262 3rd Edition - December 1999. JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the C-family of languages, including C, C++, C#, Java, JavaScript, Perl, Python, and many others. These properties make JSON an ideal data-interchange language."

🇻🇳 **Dịch**
> "JSON (JavaScript Object Notation) là một data-interchange format nhẹ. Nó dễ cho con người đọc và viết. Nó dễ cho máy parse và sinh ra. Nó dựa trên một tập con của chuẩn ngôn ngữ lập trình JavaScript ECMA-262 phiên bản 3 - tháng 12 năm 1999. JSON là một định dạng text hoàn toàn độc lập với ngôn ngữ lập trình, nhưng dùng các quy ước quen thuộc với lập trình viên của họ ngôn ngữ C, bao gồm C, C++, C#, Java, JavaScript, Perl, Python và nhiều ngôn ngữ khác. Những tính chất này khiến JSON trở thành một ngôn ngữ trao đổi dữ liệu lý tưởng."

## Hai cấu trúc nền tảng

📖 **Nguyên văn**
> "JSON is built on two structures:
> A collection of name/value pairs. In various languages, this is realized as an object, record, struct, dictionary, hash table, keyed list, or associative array.
> An ordered list of values. In most languages, this is realized as an array, vector, list, or sequence.
> These are universal data structures. Virtually all modern programming languages support them in one form or another. It makes sense that a data format that is interchangeable with programming languages also be based on these structures."

🇻🇳 **Dịch**
> "JSON được xây trên hai cấu trúc:
> Một tập hợp các cặp name/value. Trong nhiều ngôn ngữ, cái này được hiện thực hoá thành object, record, struct, dictionary, hash table, keyed list, hoặc associative array.
> Một danh sách có thứ tự các value. Trong hầu hết ngôn ngữ, cái này được hiện thực hoá thành array, vector, list, hoặc sequence.
> Đây là các cấu trúc dữ liệu phổ quát. Gần như mọi ngôn ngữ lập trình hiện đại đều hỗ trợ chúng dưới dạng này hay dạng khác. Hợp lý khi một định dạng dữ liệu có thể trao đổi được với các ngôn ngữ lập trình cũng được xây trên các cấu trúc này."

💡 **Ví dụ đời sống**
Hai cấu trúc này chính là hai kiểu ghi chép mà ai cũng dùng: **tờ khai** (mỗi dòng có nhãn: "Họ tên: ...", "Tuổi: ...") và **danh sách xếp hàng** (số 1, số 2, số 3 — thứ tự có ý nghĩa). Mọi dữ liệu phức tạp đều dựng được từ hai kiểu này lồng vào nhau.

## Các kiểu value trong JSON

📖 **Nguyên văn**
> "An object is an unordered set of name/value pairs. An object begins with { left brace and ends with } right brace. Each name is followed by : colon and the name/value pairs are separated by , comma.
> An array is an ordered collection of values. An array begins with [ left bracket and ends with ] right bracket. Values are separated by , comma.
> A value can be a string in double quotes, or a number, or true or false or null, or an object or an array. These structures can be nested.
> A string is a sequence of zero or more Unicode characters, wrapped in double quotes, using backslash escapes. A character is represented as a single character string. A string is very much like a C or Java string.
> A number is very much like a C or Java number, except that the octal and hexadecimal formats are not used.
> Whitespace can be inserted between any pair of tokens. Excepting a few encoding details, that completely describes the language."

🇻🇳 **Dịch**
> "Một object là một tập không có thứ tự các cặp name/value. Một object bắt đầu bằng { dấu ngoặc nhọn trái và kết thúc bằng } dấu ngoặc nhọn phải. Mỗi name được theo sau bởi : dấu hai chấm, và các cặp name/value được ngăn cách bởi , dấu phẩy.
> Một array là một tập hợp có thứ tự các value. Một array bắt đầu bằng [ dấu ngoặc vuông trái và kết thúc bằng ] dấu ngoặc vuông phải. Các value được ngăn cách bởi , dấu phẩy.
> Một value có thể là một string trong dấu nháy kép, hoặc một number, hoặc true hoặc false hoặc null, hoặc một object hoặc một array. Các cấu trúc này có thể lồng nhau.
> Một string là một chuỗi gồm không hoặc nhiều ký tự Unicode, bọc trong dấu nháy kép, dùng backslash để escape. Một character được biểu diễn như một string một ký tự. String của JSON rất giống string của C hay Java.
> Một number rất giống number của C hay Java, ngoại trừ việc không dùng định dạng bát phân (octal) và thập lục phân (hexadecimal).
> Whitespace có thể được chèn vào giữa bất kỳ cặp token nào. Trừ một vài chi tiết về encoding, chừng đó mô tả trọn vẹn ngôn ngữ này."

Tóm lại **6 kiểu value**: `object`, `array`, `string`, `number`, và ba literal `true` / `false` / `null`.

RFC 8259 nói đúng điều đó bằng ngôn ngữ ABNF:

📖 **Nguyên văn** (RFC 8259, §3 Values)
> "A JSON value MUST be an object, array, number, or string, or one of the following three literal names:
>
> ```
>       false
>       null
>       true
> ```
>
> The literal names MUST be lowercase.  No other literal names are allowed.
>
> ```
>       value = false / null / true / object / array / number / string
> ```"

🇻🇳 **Dịch**
> "Một JSON value PHẢI là một object, array, number, hoặc string, hoặc một trong ba literal name sau: `false`, `null`, `true`. Các literal name PHẢI viết thường. Không literal name nào khác được cho phép."

## Whitespace hợp lệ — và vì sao JSON không có comment

📖 **Nguyên văn** (RFC 8259, §2)
> "Insignificant whitespace is allowed before or after any of the six structural characters.
>
> ```
>       ws = *(
>               %x20 /              ; Space
>               %x09 /              ; Horizontal tab
>               %x0A /              ; Line feed or New line
>               %x0D )              ; Carriage return
> ```"

🇻🇳 **Dịch**
> "Whitespace không mang ý nghĩa được phép đặt trước hoặc sau bất kỳ ký tự nào trong sáu ký tự cấu trúc." — Và whitespace ở đây **chỉ gồm 4 ký tự**: space, tab ngang, line feed, carriage return.

> [!note] Suy ra từ grammar
> Vì `ws` chỉ gồm 4 ký tự trên, và `value` chỉ gồm 7 dạng đã liệt kê, nên **không có chỗ nào trong grammar cho comment** (`//` hay `/* */`). Tương tự, `object = begin-object [ member *( value-separator member ) ] end-object` — dấu phẩy chỉ xuất hiện **giữa** hai member, nên **trailing comma là không hợp lệ**. Đây là suy luận trực tiếp từ ABNF của RFC 8259, không phải quy ước truyền miệng.

## JSON không có kiểu ngày tháng

Grammar ở trên không hề có `date`, `datetime`, hay `timestamp`. Ngày tháng trong JSON chỉ là **string** (hoặc number), và ý nghĩa của nó do tầng ứng dụng tự quy ước. Chính JSON:API cũng phải nói riêng chuyện này ở trang Recommendations:

📖 **Nguyên văn** (JSON:API Recommendations — Formatting Date and Time Fields)
> "Although JSON:API does not specify the format of date and time fields, it is recommended that servers align with ISO 8601. This W3C NOTE provides an overview of the recommended formats."

🇻🇳 **Dịch**
> "Mặc dù JSON:API không quy định định dạng của các field ngày và giờ, khuyến nghị là các server nên theo ISO 8601. Tài liệu W3C NOTE này cung cấp tổng quan về các định dạng được khuyến nghị."

## Số lớn: JSON không hứa hẹn độ chính xác

📖 **Nguyên văn** (RFC 8259, §6 Numbers)
> "This specification allows implementations to set limits on the range and precision of numbers accepted.  Since software that implements IEEE 754 binary64 (double precision) numbers [IEEE754] is generally available and widely used, good interoperability can be achieved by implementations that expect no more precision or range than these provide, in the sense that implementations will approximate JSON numbers within the expected precision.  A JSON number such as 1E400 or 3.141592653589793238462643383279 may indicate potential interoperability problems, since it suggests that the software that created it expects receiving software to have greater capabilities for numeric magnitude and precision than is widely available.
>
> Note that when such software is used, numbers that are integers and are in the range [-(2**53)+1, (2**53)-1] are interoperable in the sense that implementations will agree exactly on their numeric values."

🇻🇳 **Dịch**
> "Spec này cho phép các implementation đặt giới hạn về khoảng giá trị và độ chính xác của number mà chúng chấp nhận. Vì phần mềm hiện thực số IEEE 754 binary64 (double precision) là phổ biến và được dùng rộng rãi, có thể đạt được khả năng interoperability tốt bằng cách các implementation không kỳ vọng độ chính xác hay khoảng giá trị vượt quá mức đó, theo nghĩa là các implementation sẽ xấp xỉ number của JSON trong phạm vi độ chính xác kỳ vọng. Một JSON number như `1E400` hay `3.141592653589793238462643383279` có thể báo hiệu vấn đề interoperability tiềm tàng, vì nó gợi ý rằng phần mềm tạo ra nó kỳ vọng phần mềm nhận có khả năng về độ lớn và độ chính xác số học cao hơn mức phổ biến.
> Lưu ý rằng khi dùng phần mềm như vậy, các number là số nguyên và nằm trong khoảng [-(2^53)+1, (2^53)-1] là interoperable theo nghĩa các implementation sẽ thống nhất chính xác về giá trị số của chúng."

> [!danger] Bẫy số nguyên lớn
> ID 64-bit (kiểu `bigint` của database, hay ID của nhiều hệ thống bên ngoài) vượt khỏi khoảng an toàn `±(2^53 − 1)`. Nếu server serialize chúng như JSON **number**, client JavaScript sẽ làm tròn sai âm thầm — không có lỗi nào được ném ra. Giải pháp chuẩn: serialize ID thành **string**.
> Đây chính là một trong những lý do JSON:API bắt buộc `id`/`type`/`lid` phải là string (xem phần Identification bên dưới).

## JSON trong PostgreSQL

Database quan hệ cũng lưu trực tiếp được JSON. Xem lại [[11 - NULL, Hàm String, Date và JSON]] về kiểu `json` / `jsonb` trong PostgreSQL: `json` giữ nguyên text gốc (kể cả whitespace và thứ tự key), `jsonb` lưu dạng nhị phân đã phân rã. Khi API của bạn nhận payload JSON rồi đẩy thẳng vào cột `jsonb`, các ràng buộc của RFC 8259 ở trên (không comment, không trailing comma, giới hạn độ chính xác number) vẫn áp dụng ở tầng parse trước khi chạm tới database.

---

# PHẦN B — JSON:API spec

## Vấn đề mà spec muốn giải quyết

📖 **Nguyên văn** (jsonapi.org, trang chủ)
> "If you've ever argued with your team about the way your JSON responses should be formatted, JSON:API can help you stop the bikeshedding and focus on what matters: your application.
>
> By following shared conventions, you can increase productivity, take advantage of generalized tooling and best practices. Clients built around JSON:API are able to take advantage of its features around efficiently caching responses, sometimes eliminating network requests entirely."

🇻🇳 **Dịch**
> "Nếu bạn từng tranh cãi với team về cách format các response JSON của mình, JSON:API có thể giúp bạn dừng việc bikeshedding lại và tập trung vào thứ thực sự quan trọng: ứng dụng của bạn.
> Bằng cách theo các quy ước chung, bạn có thể tăng năng suất, tận dụng được tooling tổng quát và các best practice. Các client được xây dựng quanh JSON:API có thể tận dụng những tính năng của nó về việc cache response hiệu quả, đôi khi loại bỏ hoàn toàn các network request."

💡 **Ví dụ đời sống**
"Bikeshedding" (chuyện nhà kho xe đạp) là hiện tượng cả hội đồng bỏ ba phút duyệt bản thiết kế lò phản ứng hạt nhân rồi cãi nhau ba tiếng về màu sơn nhà để xe đạp — vì ai cũng có ý kiến về thứ dễ hiểu. Tranh cãi "response bọc trong `data` hay `result`, key `camelCase` hay `snake_case`" chính là màu sơn nhà để xe đạp của backend team.

📖 **Nguyên văn** (JSON:API v1.1 — Introduction)
> "JSON:API is a specification for how a client should request that resources be fetched or modified, and how a server should respond to those requests. JSON:API can be easily extended with extensions and profiles.
>
> JSON:API is designed to minimize both the number of requests and the amount of data transmitted between clients and servers. This efficiency is achieved without compromising readability, flexibility, or discoverability.
>
> JSON:API requires use of the JSON:API media type (application/vnd.api+json) for exchanging data."

🇻🇳 **Dịch**
> "JSON:API là một spec quy định client nên request việc fetch hay sửa đổi resource như thế nào, và server nên respond các request đó ra sao. JSON:API có thể được mở rộng dễ dàng bằng extension và profile.
> JSON:API được thiết kế để tối thiểu hoá cả số lượng request lẫn lượng dữ liệu truyền giữa client và server. Hiệu quả này đạt được mà không hy sinh tính dễ đọc, tính linh hoạt, hay khả năng khám phá (discoverability).
> JSON:API yêu cầu dùng media type của JSON:API (`application/vnd.api+json`) để trao đổi dữ liệu."

## Media type

📖 **Nguyên văn** (JSON:API v1.1 — The JSON:API Media Type)
> "The JSON:API media type is application/vnd.api+json."
>
> "The JSON:API specification supports two media type parameters: ext and profile, which are used to specify extensions and profiles, respectively."
>
> "The JSON:API media type MUST NOT be specified with any media type parameters other than ext and profile."

🇻🇳 **Dịch**
> "Media type của JSON:API là `application/vnd.api+json`."
> "Spec JSON:API hỗ trợ hai media type parameter: `ext` và `profile`, lần lượt dùng để chỉ định các extension và profile."
> "Media type của JSON:API KHÔNG ĐƯỢC chỉ định kèm bất kỳ media type parameter nào khác ngoài `ext` và `profile`."

📖 **Nguyên văn** (Universal Responsibilities)
> "Clients and servers MUST send all JSON:API payloads using the JSON:API media type in the Content-Type header."

🇻🇳 **Dịch**
> "Client và server PHẢI gửi mọi payload JSON:API bằng media type của JSON:API trong header `Content-Type`."

> [!tip] Hai status code cần nhớ
> Spec quy định rõ: nếu `Content-Type` của request là media type JSON:API mà kèm parameter lạ (không phải `ext`/`profile`), server **MUST** trả `415 Unsupported Media Type`. Nếu mọi instance của media type đó trong header `Accept` đều bị sửa bởi parameter lạ, server **MUST** trả `406 Not Acceptable`.

---

## Document Structure — Top Level

📖 **Nguyên văn** (Top Level)
> "A JSON object MUST be at the root of every JSON:API request and response document containing data. This object defines a document's "top level".
>
> A document MUST contain at least one of the following top-level members:
> - data: the document's "primary data".
> - errors: an array of error objects.
> - meta: a meta object that contains non-standard meta-information.
> - a member defined by an applied extension.
>
> The members data and errors MUST NOT coexist in the same document.
>
> A document MAY contain any of these top-level members:
> - jsonapi: an object describing the server's implementation.
> - links: a links object related to the document as a whole.
> - included: an array of resource objects that are related to the primary data and/or each other ("included resources").
>
> If a document does not contain a top-level data key, the included member MUST NOT be present either."

🇻🇳 **Dịch**
> "Một JSON object PHẢI nằm ở gốc của mọi JSON:API request và response document có chứa dữ liệu. Object này định nghĩa "top level" của document.
> Một document PHẢI chứa ít nhất một trong các top-level member sau:
> - `data`: "primary data" của document.
> - `errors`: một array các error object.
> - `meta`: một meta object chứa các meta-information phi tiêu chuẩn.
> - một member được định nghĩa bởi một extension đang áp dụng.
>
> Hai member `data` và `errors` KHÔNG ĐƯỢC cùng tồn tại trong cùng một document.
>
> Một document CÓ THỂ chứa bất kỳ member top-level nào sau đây:
> - `jsonapi`: một object mô tả implementation của server.
> - `links`: một links object liên quan tới toàn bộ document.
> - `included`: một array các resource object có liên quan tới primary data và/hoặc liên quan lẫn nhau ("included resources").
>
> Nếu một document không chứa key `data` ở top level, thì member `included` cũng KHÔNG ĐƯỢC có mặt."

> [!warning] `data` và `errors` loại trừ nhau
> Không có chuyện "trả một nửa dữ liệu kèm một nửa lỗi" trong JSON:API. Một response hoặc là thành công (`data`), hoặc là thất bại (`errors`). Đây là khác biệt lớn so với GraphQL, nơi `data` và `errors` **được phép** cùng xuất hiện.

### Top-level `links`

📖 **Nguyên văn**
> "The top-level links object MAY contain the following members:
> - self: the link that generated the current response document. If a document has extensions or profiles applied to it, this link SHOULD be represented by a link object with the type target attribute specifying the JSON:API media type with all applicable parameters.
> - related: a related resource link when the primary data represents a resource relationship.
> - describedby: a link to a description document (e.g. OpenAPI or JSON Schema) for the current document.
> - pagination links for the primary data."

🇻🇳 **Dịch**
> "Links object ở top level CÓ THỂ chứa các member sau:
> - `self`: link đã sinh ra response document hiện tại. Nếu document có extension hoặc profile được áp dụng, link này NÊN được biểu diễn bằng một link object với thuộc tính target `type` chỉ định media type của JSON:API kèm mọi parameter áp dụng.
> - `related`: một related resource link, khi primary data biểu diễn một resource relationship.
> - `describedby`: một link tới description document (ví dụ OpenAPI hoặc JSON Schema) cho document hiện tại.
> - các pagination link cho primary data."

### Primary data

📖 **Nguyên văn**
> "The document's "primary data" is a representation of the resource or collection of resources targeted by a request.
>
> Primary data MUST be either:
> - a single resource object, a single resource identifier object, or null, for requests that target single resources
> - an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections"
>
> "A logical collection of resources MUST be represented as an array, even if it only contains one item or is empty."

🇻🇳 **Dịch**
> ""Primary data" của document là một representation của resource hoặc collection resource mà request nhắm tới.
> Primary data PHẢI là một trong các dạng:
> - một resource object đơn lẻ, một resource identifier object đơn lẻ, hoặc `null`, với các request nhắm tới một resource đơn
> - một array các resource object, một array các resource identifier object, hoặc một array rỗng (`[]`), với các request nhắm tới collection resource"
> "Một collection resource về mặt logic PHẢI được biểu diễn bằng array, kể cả khi nó chỉ có một phần tử hoặc rỗng."

📖 **Nguyên văn** — ví dụ primary data là một resource object đơn
```
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      // ... this article's attributes
    },
    "relationships": {
      // ... this article's relationships
    }
  }
}
```

🇻🇳 Payload gốc bọc trong `data`; bên trong là một resource object gồm `type`, `id`, `attributes`, `relationships`.

📖 **Nguyên văn** — ví dụ primary data là một resource identifier object trỏ tới cùng resource đó
```
{
  "data": {
    "type": "articles",
    "id": "1"
  }
}
```

🇻🇳 Resource identifier object chỉ gồm `type` + `id` — đủ để định danh, không mang dữ liệu.

---

## Resource Objects

📖 **Nguyên văn**
> ""Resource objects" appear in a JSON:API document to represent resources.
>
> A resource object MUST contain at least the following top-level members:
> - id
> - type
>
> Exception: The id member is not required when the resource object originates at the client and represents a new resource to be created on the server. In that case, a client MAY include a lid member to uniquely identify the resource by type locally within the document.
>
> In addition, a resource object MAY contain any of these top-level members:
> - attributes: an attributes object representing some of the resource's data.
> - relationships: a relationships object describing relationships between the resource and other JSON:API resources.
> - links: a links object containing links related to the resource.
> - meta: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship."

🇻🇳 **Dịch**
> ""Resource object" xuất hiện trong một JSON:API document để biểu diễn các resource.
> Một resource object PHẢI chứa ít nhất các top-level member sau: `id`, `type`.
> Ngoại lệ: member `id` không bắt buộc khi resource object xuất phát từ phía client và biểu diễn một resource mới sắp được tạo trên server. Trong trường hợp đó, client CÓ THỂ kèm theo một member `lid` để định danh duy nhất resource theo `type`, cục bộ trong phạm vi document.
> Ngoài ra, một resource object CÓ THỂ chứa bất kỳ top-level member nào sau đây:
> - `attributes`: một attributes object biểu diễn một phần dữ liệu của resource.
> - `relationships`: một relationships object mô tả các quan hệ giữa resource này và các resource JSON:API khác.
> - `links`: một links object chứa các link liên quan tới resource.
> - `meta`: một meta object chứa meta-information phi tiêu chuẩn về resource mà không thể biểu diễn được dưới dạng attribute hay relationship."

📖 **Nguyên văn** — "Here's how an article (i.e. a resource of type "articles") might appear in a document:"
```
// ...
{
  "type": "articles",
  "id": "1",
  "attributes": {
    "title": "Rails is Omakase"
  },
  "relationships": {
    "author": {
      "links": {
        "self": "/articles/1/relationships/author",
        "related": "/articles/1/author"
      },
      "data": { "type": "people", "id": "9" }
    }
  }
}
// ...
```

🇻🇳 Một article: dữ liệu thuần (`title`) nằm trong `attributes`; quan hệ với tác giả nằm trong `relationships.author`, gồm hai link (`self` để thao tác trên chính quan hệ, `related` để lấy resource tác giả) và `data` là linkage trỏ tới `people` id `9`.

### Identification

📖 **Nguyên văn**
> "The values of the id, type, and lid members MUST be strings.
>
> Within a given API, each resource object's type and id pair MUST identify a single, unique resource. (The set of URIs controlled by a server, or multiple servers acting as one, constitute an API.)
>
> The type member is used to describe resource objects that share common attributes and relationships."
>
> "Note: This spec is agnostic about inflection rules, so the value of type can be either plural or singular. However, the same value should be used consistently throughout an implementation."

🇻🇳 **Dịch**
> "Giá trị của các member `id`, `type`, và `lid` PHẢI là string.
> Trong phạm vi một API, cặp `type` và `id` của mỗi resource object PHẢI định danh một resource duy nhất. (Tập các URI do một server, hoặc nhiều server hoạt động như một, kiểm soát, tạo thành một API.)
> Member `type` được dùng để mô tả các resource object chia sẻ chung attribute và relationship."
> "Lưu ý: Spec này trung lập với các quy tắc biến đổi số ít/số nhiều, nên giá trị của `type` có thể là số nhiều hoặc số ít. Tuy nhiên, cùng một giá trị nên được dùng nhất quán xuyên suốt một implementation."

> [!tip] "id PHẢI là string" giải quyết đúng cái bẫy ở Phần A
> Vì `id` luôn là string, một ID 64-bit như `"9007199254740993"` đi qua `JSON.parse` mà không bị double-precision làm tròn. Đây là ví dụ điển hình cho việc một spec ở tầng API vá được một hạn chế ở tầng data format.

### Fields, Attributes

📖 **Nguyên văn**
> "A resource object's attributes and its relationships are collectively called its "fields".
>
> Fields for a resource object MUST share a common namespace with each other and with type and id. In other words, a resource can not have an attribute and relationship with the same name, nor can it have an attribute or relationship named type or id."
>
> "The value of the attributes key MUST be an object (an "attributes object"). Members of the attributes object ("attributes") represent information about the resource object in which it's defined.
>
> Attributes may contain any valid JSON value, including complex data structures involving JSON objects and arrays.
>
> Keys that reference related resources (e.g. author_id) SHOULD NOT appear as attributes. Instead, relationships SHOULD be used."

🇻🇳 **Dịch**
> "Các `attributes` và các `relationships` của một resource object được gọi chung là các "field" của nó.
> Các field của một resource object PHẢI dùng chung một namespace với nhau và với `type` và `id`. Nói cách khác, một resource không thể có một attribute và một relationship trùng tên, cũng không thể có một attribute hay relationship tên là `type` hoặc `id`."
> "Giá trị của key `attributes` PHẢI là một object (một "attributes object"). Các member của attributes object ("các attribute") biểu diễn thông tin về resource object chứa nó.
> Attribute có thể chứa bất kỳ JSON value hợp lệ nào, kể cả các cấu trúc dữ liệu phức tạp gồm object và array JSON.
> Các key tham chiếu tới resource liên quan (ví dụ `author_id`) KHÔNG NÊN xuất hiện như attribute. Thay vào đó, NÊN dùng relationship."

> [!warning] Quy tắc hay bị vi phạm nhất
> Không được để `customer_id` trong `attributes`. Khoá ngoại là **quan hệ**, phải nằm trong `relationships` dưới dạng resource linkage `{ "type": "customers", "id": "9" }`. Đây là khác biệt cốt lõi giữa "serialize thẳng một row database ra JSON" và "làm JSON:API thật".

### Relationships

📖 **Nguyên văn**
> "The value of the relationships key MUST be an object (a "relationships object"). Each member of a relationships object represents a "relationship" from the resource object in which it has been defined to other resource objects.
>
> Relationships may be to-one or to-many.
>
> A relationship's name is given by its key. The value at that key MUST be an object ("relationship object").
> A "relationship object" MUST contain at least one of the following:
> - links: a links object containing at least one of the following:
>   - self: a link for the relationship itself (a "relationship link"). This link allows the client to directly manipulate the relationship. For example, removing an author through an article's relationship URL would disconnect the person from the article without deleting the people resource itself. When fetched successfully, this link returns the linkage for the related resources as its primary data.
>   - related: a related resource link
> - data: resource linkage
> - meta: a meta object that contains non-standard meta-information about the relationship."

🇻🇳 **Dịch**
> "Giá trị của key `relationships` PHẢI là một object (một "relationships object"). Mỗi member của relationships object biểu diễn một "relationship" từ resource object chứa nó tới các resource object khác.
> Relationship có thể là to-one hoặc to-many.
> Tên của một relationship chính là key của nó. Giá trị tại key đó PHẢI là một object ("relationship object").
> Một "relationship object" PHẢI chứa ít nhất một trong các thứ sau:
> - `links`: một links object chứa ít nhất một trong:
>   - `self`: một link cho chính relationship đó (một "relationship link"). Link này cho phép client thao tác trực tiếp lên relationship. Ví dụ, gỡ một author thông qua relationship URL của một article sẽ ngắt kết nối người đó khỏi article mà không xoá resource `people`. Khi fetch thành công, link này trả về linkage của các resource liên quan làm primary data của nó.
>   - `related`: một related resource link
> - `data`: resource linkage
> - `meta`: một meta object chứa meta-information phi tiêu chuẩn về relationship."

💡 **Ví dụ đời sống**
`self` của relationship là "tờ giấy ghi ai là tác giả bài này" — xé tờ giấy đi thì bài vẫn còn, người vẫn còn, chỉ mất mối liên hệ. `related` là "đường đi tới hồ sơ của chính người đó". Hai thứ khác nhau, và JSON:API cho bạn cả hai.

### Resource Linkage

📖 **Nguyên văn**
> "Resource linkage in a compound document allows a client to link together all of the included resource objects without having to GET any URLs via links.
>
> Resource linkage MUST be represented as one of the following:
> - null for empty to-one relationships.
> - an empty array ([]) for empty to-many relationships.
> - a single resource identifier object for non-empty to-one relationships.
> - an array of resource identifier objects for non-empty to-many relationships."

🇻🇳 **Dịch**
> "Resource linkage trong một compound document cho phép client nối tất cả các included resource object lại với nhau mà không phải GET bất kỳ URL nào qua `links`.
> Resource linkage PHẢI được biểu diễn dưới một trong các dạng:
> - `null` cho quan hệ to-one rỗng.
> - một array rỗng (`[]`) cho quan hệ to-many rỗng.
> - một resource identifier object đơn cho quan hệ to-one không rỗng.
> - một array các resource identifier object cho quan hệ to-many không rỗng."

### Resource Identifier Objects

📖 **Nguyên văn**
> "A "resource identifier object" is an object that identifies an individual resource.
>
> A "resource identifier object" MUST contain a type member. It MUST also contain an id member, except when it represents a new resource to be created on the server. In this case, a lid member MUST be included that identifies the new resource."

🇻🇳 **Dịch**
> "Một "resource identifier object" là một object định danh một resource riêng lẻ.
> Một "resource identifier object" PHẢI chứa member `type`. Nó cũng PHẢI chứa member `id`, ngoại trừ khi nó biểu diễn một resource mới sắp được tạo trên server. Trong trường hợp đó, PHẢI kèm theo một member `lid` để định danh resource mới."

---

## Compound Documents — cách JSON:API chặn N+1 ở tầng API

📖 **Nguyên văn**
> "Servers MAY allow responses that include related resources along with the requested primary resources. Such responses are called "compound documents".
>
> In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member.
>
> Every included resource object MUST be identified via a chain of relationships originating in a document's primary data. This means that compound documents require "full linkage" and that no resource object can be included without a direct or indirect relationship to the document's primary data.
>
> The only exception to the full linkage requirement is when relationship fields that would otherwise contain linkage data are excluded due to sparse fieldsets requested by the client."
>
> "A compound document MUST NOT include more than one resource object for each type and id pair."
>
> "Note: This approach ensures that a single canonical resource object is returned with each response, even when the same resource is referenced multiple times."

🇻🇳 **Dịch**
> "Server CÓ THỂ cho phép các response kèm theo các resource liên quan cùng với các primary resource được yêu cầu. Những response như vậy được gọi là "compound document".
> Trong một compound document, tất cả các included resource PHẢI được biểu diễn như một array các resource object trong member `included` ở top level.
> Mọi included resource object PHẢI được định danh thông qua một chuỗi các relationship bắt nguồn từ primary data của document. Điều này nghĩa là compound document đòi hỏi "full linkage", và không resource object nào được include nếu không có quan hệ trực tiếp hay gián tiếp với primary data của document.
> Ngoại lệ duy nhất của yêu cầu full linkage là khi các relationship field lẽ ra chứa linkage data bị loại bỏ do client yêu cầu sparse fieldsets."
> "Một compound document KHÔNG ĐƯỢC chứa nhiều hơn một resource object cho mỗi cặp `type` và `id`."
> "Lưu ý: Cách tiếp cận này đảm bảo rằng mỗi response chỉ trả về một resource object chuẩn tắc duy nhất, ngay cả khi cùng một resource được tham chiếu nhiều lần."

📖 **Nguyên văn** — "A complete example document with multiple included relationships:"
```
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "links": {
      "self": "http://example.com/articles/1"
    },
    "relationships": {
      "author": {
        "links": {
          "self": "http://example.com/articles/1/relationships/author",
          "related": "http://example.com/articles/1/author"
        },
        "data": { "type": "people", "id": "9" }
      },
      "comments": {
        "links": {
          "self": "http://example.com/articles/1/relationships/comments",
          "related": "http://example.com/articles/1/comments"
        },
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    }
  }],
  "included": [{
    "type": "people",
    "id": "9",
    "attributes": {
      "firstName": "Dan",
      "lastName": "Gebhardt",
      "twitter": "dgeb"
    },
    "links": {
      "self": "http://example.com/people/9"
    }
  }, {
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "2" }
      }
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}
```

🇻🇳 Một response duy nhất mang cả article (trong `data`), tác giả và hai comment (trong `included`). Client dựng lại đồ thị quan hệ bằng cách khớp cặp `type`+`id` trong `relationships[...].data` với các phần tử trong `included` — không cần gọi thêm request nào.

### Liên hệ với N+1 Problem

Xem lại [[07 - N+1 Problem]]: ở tầng database, N+1 là việc chạy 1 query lấy danh sách rồi chạy thêm N query lấy chi tiết từng dòng, thay vì 1 `JOIN`.

Ở **tầng API**, đúng hình dạng đó lặp lại — chỉ khác là mỗi "query" giờ là một HTTP round-trip:

| | Tầng database | Tầng API |
|---|---|---|
| Bệnh | `SELECT * FROM articles` rồi N lần `SELECT * FROM people WHERE id = ?` | `GET /articles` rồi N lần `GET /people/{id}` |
| Chi phí mỗi lần | 1 round-trip tới DB | 1 round-trip qua mạng (đắt hơn nhiều) |
| Thuốc | `JOIN` / eager loading | **compound document** + `include` |

Chính vì vậy Introduction của spec mới viết "designed to minimize both the number of requests and the amount of data transmitted" (tối thiểu hoá cả số request lẫn lượng dữ liệu truyền).

> [!danger] `included` chữa N+1 phía client, không tự chữa N+1 phía server
> Một server trả đúng compound document nhưng bên trong vẫn lặp `SELECT author WHERE id = ?` cho từng article thì **N+1 ở tầng database vẫn còn nguyên** — chỉ là client không nhìn thấy. Phải xử lý cả hai tầng: `include` ở tầng API, và eager loading / `JOIN` / DataLoader-style batching ở tầng database.
>
> Ngược lại, quy tắc "MUST NOT include more than one resource object for each type and id pair" giúp cắt trùng lặp trên đường truyền: 100 article cùng một tác giả thì tác giả đó chỉ xuất hiện **một lần** trong `included`.

---

## Inclusion of Related Resources — `include`

📖 **Nguyên văn**
> "An endpoint MAY return resources related to the primary data by default.
>
> An endpoint MAY also support an include query parameter to allow the client to customize which related resources should be returned.
>
> If an endpoint does not support the include parameter, it MUST respond with 400 Bad Request to any requests that include it.
>
> If an endpoint supports the include parameter and a client supplies it:
> - The server's response MUST be a compound document with an included key — even if that included key holds an empty array (because the requested relationships are empty).
> - The server MUST NOT include unrequested resource objects in the included section of the compound document.
>
> The value of the include parameter MUST be a comma-separated (U+002C COMMA, ",") list of relationship paths. A relationship path is a dot-separated (U+002E FULL-STOP, ".") list of relationship names. An empty value indicates that no related resources should be returned.
>
> If a server is unable to identify a relationship path or does not support inclusion of resources from a path, it MUST respond with 400 Bad Request."

🇻🇳 **Dịch**
> "Một endpoint CÓ THỂ trả về các resource liên quan tới primary data theo mặc định.
> Một endpoint CŨNG CÓ THỂ hỗ trợ query parameter `include` để cho phép client tuỳ biến những resource liên quan nào nên được trả về.
> Nếu một endpoint không hỗ trợ parameter `include`, nó PHẢI trả về `400 Bad Request` cho mọi request có chứa parameter đó.
> Nếu một endpoint hỗ trợ parameter `include` và client cung cấp nó:
> - Response của server PHẢI là một compound document có key `included` — kể cả khi key `included` đó chứa một array rỗng (vì các relationship được yêu cầu đang rỗng).
> - Server KHÔNG ĐƯỢC đưa các resource object không được yêu cầu vào phần `included` của compound document.
>
> Giá trị của parameter `include` PHẢI là một danh sách các relationship path ngăn cách bởi dấu phẩy (U+002C COMMA, ","). Một relationship path là một danh sách các tên relationship ngăn cách bởi dấu chấm (U+002E FULL-STOP, "."). Giá trị rỗng nghĩa là không trả về resource liên quan nào.
> Nếu server không nhận diện được một relationship path hoặc không hỗ trợ việc include resource từ path đó, nó PHẢI trả về `400 Bad Request`."

📖 **Nguyên văn** — "For instance, comments could be requested with an article:"
```
GET /articles/1?include=comments HTTP/1.1
Accept: application/vnd.api+json
```

🇻🇳 Lấy article số 1, kèm luôn các comment của nó trong `included`.

📖 **Nguyên văn** — "In order to request resources related to other resources, a dot-separated path for each relationship name can be specified:"
```
GET /articles/1?include=comments.author HTTP/1.1
Accept: application/vnd.api+json
```

🇻🇳 Đi sâu hai tầng: comment của article, và tác giả của từng comment đó.

📖 **Nguyên văn** — "Multiple related resources can be requested in a comma-separated list:"
```
GET /articles/1?include=comments.author,ratings HTTP/1.1
Accept: application/vnd.api+json
```

🇻🇳 Nhiều nhánh quan hệ cùng lúc, ngăn bằng dấu phẩy.

📖 **Nguyên văn** (Note về full linkage)
> "Note: Because compound documents require full linkage (except when relationship linkage is excluded by sparse fieldsets), intermediate resources in a multi-part path must be returned along with the leaf nodes. For example, a response to a request for comments.author should include comments as well as the author of each of those comments."

🇻🇳 **Dịch**
> "Lưu ý: Vì compound document đòi hỏi full linkage (trừ khi linkage của relationship bị loại bỏ bởi sparse fieldsets), các resource trung gian trong một path nhiều phần phải được trả về cùng với các node lá. Ví dụ, response cho một request `comments.author` nên bao gồm cả các `comments` lẫn author của từng comment đó."

---

## Sparse Fieldsets — `fields[TYPE]`

📖 **Nguyên văn**
> "A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] query parameter.
>
> The value of any fields[TYPE] parameter MUST be a comma-separated (U+002C COMMA, ",") list that refers to the name(s) of the fields to be returned. An empty value indicates that no fields should be returned.
>
> If a client requests a restricted set of fields for a given resource type, an endpoint MUST NOT include additional fields in resource objects of that type in its response.
>
> If a client does not specify the set of fields for a given resource type, the server MAY send all fields, a subset of fields, or no fields for that resource type."

🇻🇳 **Dịch**
> "Client CÓ THỂ yêu cầu một endpoint chỉ trả về những field cụ thể trong response, theo từng resource type, bằng cách kèm query parameter `fields[TYPE]`.
> Giá trị của bất kỳ parameter `fields[TYPE]` nào PHẢI là một danh sách ngăn cách bởi dấu phẩy (U+002C COMMA, ",") liệt kê tên các field cần trả về. Giá trị rỗng nghĩa là không trả về field nào.
> Nếu client yêu cầu một tập field giới hạn cho một resource type nào đó, endpoint KHÔNG ĐƯỢC đưa thêm field nào khác vào các resource object thuộc type đó trong response.
> Nếu client không chỉ định tập field cho một resource type nào đó, server CÓ THỂ gửi tất cả field, một tập con field, hoặc không field nào cho type đó."

📖 **Nguyên văn**
```
GET /articles?include=author&fields[articles]=title,body&fields[people]=name HTTP/1.1
Accept: application/vnd.api+json
```

🇻🇳 Lấy danh sách article kèm tác giả, nhưng article chỉ trả `title` + `body`, còn people chỉ trả `name`. Cắt băng thông ngay tại nguồn.

📖 **Nguyên văn**
> "Note: The above example URI shows unencoded [ and ] characters simply for readability. In practice, these characters should be percent-encoded. See "Square Brackets in Parameter Names"."

🇻🇳 **Dịch**
> "Lưu ý: URI ví dụ ở trên hiển thị ký tự `[` và `]` chưa được encode đơn thuần là cho dễ đọc. Trong thực tế, các ký tự này nên được percent-encode."

> [!tip] `include` + `fields` là bộ đôi
> `include` giảm **số request**. `fields` giảm **kích thước payload**. Dùng riêng `include` mà không dùng `fields` thì đổi N+1 lấy một response phình to — chưa chắc đã lợi.

---

## Sorting — `sort`

📖 **Nguyên văn**
> "A server MAY choose to support requests to sort resource collections according to one or more criteria ("sort fields")."
>
> "An endpoint MAY support requests to sort the primary data with a sort query parameter. The value for sort MUST represent sort fields."
>
> "An endpoint MAY support multiple sort fields by allowing comma-separated (U+002C COMMA, ",") sort fields. Sort fields SHOULD be applied in the order specified."
>
> "The sort order for each sort field MUST be ascending unless it is prefixed with a minus (U+002D HYPHEN-MINUS, "-"), in which case it MUST be descending."
>
> "If the server does not support sorting as specified in the query parameter sort, it MUST return 400 Bad Request."

🇻🇳 **Dịch**
> "Server CÓ THỂ chọn hỗ trợ các request sắp xếp collection resource theo một hoặc nhiều tiêu chí ("sort field")."
> "Một endpoint CÓ THỂ hỗ trợ các request sắp xếp primary data bằng query parameter `sort`. Giá trị của `sort` PHẢI biểu diễn các sort field."
> "Một endpoint CÓ THỂ hỗ trợ nhiều sort field bằng cách cho phép các sort field ngăn cách bởi dấu phẩy (U+002C COMMA, ","). Các sort field NÊN được áp dụng theo thứ tự đã chỉ định."
> "Thứ tự sắp xếp cho mỗi sort field PHẢI là tăng dần, trừ khi nó được thêm tiền tố dấu trừ (U+002D HYPHEN-MINUS, "-"), trong trường hợp đó nó PHẢI là giảm dần."
> "Nếu server không hỗ trợ việc sắp xếp như được chỉ định trong query parameter `sort`, nó PHẢI trả về `400 Bad Request`."

📖 **Nguyên văn**
```
GET /people?sort=age HTTP/1.1
Accept: application/vnd.api+json
```
```
GET /people?sort=age,name HTTP/1.1
Accept: application/vnd.api+json
```
```
GET /articles?sort=-created,title HTTP/1.1
Accept: application/vnd.api+json
```

🇻🇳 Ba mức: sắp theo một field; sắp theo hai field theo thứ tự ưu tiên; và dấu `-` để đảo chiều. Ví dụ cuối được spec giải thích ngay sau đó.

📖 **Nguyên văn**
> "The above example should return the newest articles first. Any articles created on the same date will then be sorted by their title in ascending alphabetical order."
>
> "Note: It is recommended that dot-separated (U+002E FULL-STOP, ".") sort fields be used to request sorting based upon relationship attributes. For example, a sort field of author.name could be used to request that the primary data be sorted based upon the name attribute of the author relationship."

🇻🇳 **Dịch**
> "Ví dụ trên sẽ trả về các article mới nhất trước. Những article được tạo cùng ngày sau đó sẽ được sắp theo `title` theo thứ tự chữ cái tăng dần."
> "Lưu ý: Khuyến nghị dùng các sort field ngăn cách bởi dấu chấm (U+002E FULL-STOP, ".") để yêu cầu sắp xếp dựa trên attribute của relationship. Ví dụ, sort field `author.name` có thể được dùng để yêu cầu primary data được sắp theo attribute `name` của relationship `author`."

---

## Pagination — họ parameter `page`

📖 **Nguyên văn**
> "A server MAY choose to limit the number of resources returned in a response to a subset ("page") of the whole set available.
>
> A server MAY provide links to traverse a paginated data set ("pagination links").
>
> Pagination links MUST appear in the links object that corresponds to a collection. To paginate the primary data, supply pagination links in the top-level links object. To paginate an included collection returned in a compound document, supply pagination links in the corresponding links object.
>
> The following keys MUST be used for pagination links:
> - first: the first page of data
> - last: the last page of data
> - prev: the previous page of data
> - next: the next page of data
>
> Keys MUST either be omitted or have a null value to indicate that a particular link is unavailable."
>
> "The page query parameter family is reserved for pagination. Servers and clients SHOULD use these parameters for pagination operations."

🇻🇳 **Dịch**
> "Server CÓ THỂ chọn giới hạn số resource trả về trong một response xuống còn một tập con ("page") của toàn bộ tập có sẵn.
> Server CÓ THỂ cung cấp các link để duyệt qua một tập dữ liệu đã phân trang ("pagination link").
> Các pagination link PHẢI xuất hiện trong links object tương ứng với collection đó. Để phân trang primary data, đặt pagination link trong links object ở top level. Để phân trang một included collection trả về trong một compound document, đặt pagination link trong links object tương ứng.
> Các key sau PHẢI được dùng cho pagination link:
> - `first`: trang dữ liệu đầu tiên
> - `last`: trang dữ liệu cuối cùng
> - `prev`: trang dữ liệu trước đó
> - `next`: trang dữ liệu kế tiếp
>
> Các key PHẢI hoặc bị bỏ đi, hoặc có giá trị `null`, để báo rằng một link cụ thể không khả dụng."
> "Họ query parameter `page` được dành riêng cho việc phân trang. Server và client NÊN dùng các parameter này cho các thao tác phân trang."

📖 **Nguyên văn**
> "Note: JSON API is agnostic about the pagination strategy used by a server, but the page query parameter family can be used regardless of the strategy employed. For example, a page-based strategy might use query parameters such as page[number] and page[size], while a cursor-based strategy might use page[cursor]."

🇻🇳 **Dịch**
> "Lưu ý: JSON API trung lập với chiến lược phân trang mà server sử dụng, nhưng họ query parameter `page` có thể được dùng bất kể chiến lược nào được áp dụng. Ví dụ, chiến lược dựa trên trang có thể dùng các query parameter như `page[number]` và `page[size]`, trong khi chiến lược dựa trên cursor có thể dùng `page[cursor]`."

Ví dụ pagination link thật, trích nguyên văn từ response mẫu ở trang chủ jsonapi.org:

📖 **Nguyên văn**
```
  "links": {
    "self": "http://example.com/articles",
    "next": "http://example.com/articles?page[offset]=2",
    "last": "http://example.com/articles?page[offset]=10"
  },
```

🇻🇳 Top-level `links` chứa `self` (chính response này), `next` và `last`. Không có `first`/`prev` vì đang ở trang đầu — đúng quy tắc "MUST either be omitted or have a null value".

---

## Filtering — họ parameter `filter`

📖 **Nguyên văn** (JSON:API v1.1 — Filtering)
> "The filter query parameter family is reserved for filtering data. Servers and clients SHOULD use these parameters for filtering operations.
>
> Note: JSON API is agnostic about the strategies supported by a server."

🇻🇳 **Dịch**
> "Họ query parameter `filter` được dành riêng cho việc lọc dữ liệu. Server và client NÊN dùng các parameter này cho các thao tác lọc.
> Lưu ý: JSON API trung lập với các chiến lược mà server hỗ trợ."

Base spec cố tình để trống phần này. Trang **Recommendations** mới đưa ra gợi ý cụ thể:

📖 **Nguyên văn** (JSON:API Recommendations — Filtering)
> "The base specification is agnostic about filtering strategies supported by a server. The filter query parameter family is reserved to be used as the basis for any filtering strategy.
>
> It's recommended that servers that wish to support filtering of a resource collection based upon associations do so by allowing query parameters that combine filter with the association name."

🇻🇳 **Dịch**
> "Base specification trung lập với các chiến lược lọc mà server hỗ trợ. Họ query parameter `filter` được dành riêng để làm nền cho bất kỳ chiến lược lọc nào.
> Khuyến nghị là các server muốn hỗ trợ lọc một collection resource dựa trên các association nên làm điều đó bằng cách cho phép các query parameter kết hợp `filter` với tên association."

📖 **Nguyên văn** — "For example, the following is a request for all comments associated with a particular post:"
```
GET /comments?filter[post]=1 HTTP/1.1
```
```
GET /comments?filter[post]=1,2 HTTP/1.1
```
```
GET /comments?filter[post]=1,2&filter[author]=12 HTTP/1.1
```

🇻🇳 Lần lượt: lọc theo một post; nhiều giá trị ngăn bằng dấu phẩy; và nhiều filter kết hợp trong một request.

> [!note] Vì sao spec để trống filtering?
> Vì filter là chỗ khác biệt nhiều nhất giữa các domain (range, full-text, boolean phức tạp...). Spec chỉ **giữ chỗ** tên `filter` để sau này chuẩn hoá được mà không vỡ các implementation hiện có — cùng logic với quy tắc query parameter của implementation phải chứa ít nhất một ký tự ngoài `a-z`.

---

## JSON:API Object — `jsonapi`

📖 **Nguyên văn**
> "A JSON:API document MAY include information about its implementation under a top level jsonapi member. If present, the value of the jsonapi member MUST be an object (a "jsonapi object").
>
> The jsonapi object MAY contain any of the following members:
> - version - whose value is a string indicating the highest JSON:API version supported.
> - ext - an array of URIs for all applied extensions.
> - profile - an array of URIs for all applied profiles.
> - meta - a meta object that contains non-standard meta-information."
>
> "If the version member is not present, clients should assume the server implements at least version 1.0 of the specification."

🇻🇳 **Dịch**
> "Một JSON:API document CÓ THỂ chứa thông tin về implementation của nó dưới một member `jsonapi` ở top level. Nếu có, giá trị của member `jsonapi` PHẢI là một object (một "jsonapi object").
> Jsonapi object CÓ THỂ chứa bất kỳ member nào sau đây:
> - `version` — giá trị là một string chỉ ra phiên bản JSON:API cao nhất được hỗ trợ.
> - `ext` — một array các URI của mọi extension đang được áp dụng.
> - `profile` — một array các URI của mọi profile đang được áp dụng.
> - `meta` — một meta object chứa meta-information phi tiêu chuẩn."
> "Nếu member `version` không có mặt, client nên giả định server hiện thực ít nhất phiên bản 1.0 của spec."

📖 **Nguyên văn** — "A simple example appears below:"
```
{
  "jsonapi": {
    "version": "1.1",
    "ext": [
      "https://jsonapi.org/ext/atomic"
    ],
    "profile": [
      "http://example.com/profiles/flexible-pagination",
      "http://example.com/profiles/resource-versioning"
    ]
  }
}
```

🇻🇳 Document tự khai báo nó nói phiên bản 1.1, có bật extension `atomic`, và đang áp dụng hai profile.

---

## Error Objects

📖 **Nguyên văn** (Processing Errors)
> "A server MAY choose to stop processing as soon as a problem is encountered, or it MAY continue processing and encounter multiple problems. For instance, a server might process multiple attributes and then return multiple validation problems in a single response.
>
> When a server encounters multiple problems for a single request, the most generally applicable HTTP error code SHOULD be used in the response. For instance, 400 Bad Request might be appropriate for multiple 4xx errors or 500 Internal Server Error might be appropriate for multiple 5xx errors."

🇻🇳 **Dịch**
> "Server CÓ THỂ chọn dừng xử lý ngay khi gặp một vấn đề, hoặc CÓ THỂ tiếp tục xử lý và gặp nhiều vấn đề. Ví dụ, một server có thể xử lý nhiều attribute rồi trả về nhiều vấn đề validation trong một response duy nhất.
> Khi server gặp nhiều vấn đề cho một request, HTTP error code tổng quát phù hợp nhất NÊN được dùng trong response. Ví dụ, `400 Bad Request` có thể phù hợp cho nhiều lỗi 4xx, hoặc `500 Internal Server Error` có thể phù hợp cho nhiều lỗi 5xx."

📖 **Nguyên văn** (Error Objects)
> "Error objects provide additional information about problems encountered while performing an operation. Error objects MUST be returned as an array keyed by errors in the top level of a JSON:API document.
>
> An error object MAY have the following members, and MUST contain at least one of:
> - id: a unique identifier for this particular occurrence of the problem.
> - links: a links object that MAY contain the following members:
>   - about: a link that leads to further details about this particular occurrence of the problem. When dereferenced, this URI SHOULD return a human-readable description of the error.
>   - type: a link that identifies the type of error that this particular error is an instance of. This URI SHOULD be dereferenceable to a human-readable explanation of the general error.
> - status: the HTTP status code applicable to this problem, expressed as a string value. This SHOULD be provided.
> - code: an application-specific error code, expressed as a string value.
> - title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
> - detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field's value can be localized.
> - source: an object containing references to the primary source of the error. It SHOULD include one of the following members or be omitted:
>   - pointer: a JSON Pointer [RFC6901] to the value in the request document that caused the error [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. This MUST point to a value in the request document that exists; if it doesn't, the client SHOULD simply ignore the pointer.
>   - parameter: a string indicating which URI query parameter caused the error.
>   - header: a string indicating the name of a single request header which caused the error.
> - meta: a meta object containing non-standard meta-information about the error."

🇻🇳 **Dịch**
> "Error object cung cấp thông tin bổ sung về các vấn đề gặp phải khi thực hiện một operation. Error object PHẢI được trả về dưới dạng một array đặt tại key `errors` ở top level của một JSON:API document.
> Một error object CÓ THỂ có các member sau, và PHẢI chứa ít nhất một trong số đó:
> - `id`: một định danh duy nhất cho lần xảy ra cụ thể này của vấn đề.
> - `links`: một links object CÓ THỂ chứa các member sau:
>   - `about`: một link dẫn tới chi tiết sâu hơn về lần xảy ra cụ thể này của vấn đề. Khi truy cập, URI này NÊN trả về một mô tả lỗi mà người đọc hiểu được.
>   - `type`: một link định danh loại lỗi mà lỗi cụ thể này là một thể hiện. URI này NÊN truy cập được tới một giải thích cho người đọc về loại lỗi chung đó.
> - `status`: HTTP status code áp dụng cho vấn đề này, biểu diễn dưới dạng giá trị string. Cái này NÊN được cung cấp.
> - `code`: một mã lỗi riêng của ứng dụng, biểu diễn dưới dạng giá trị string.
> - `title`: một tóm tắt ngắn, người đọc hiểu được, về vấn đề; nó KHÔNG NÊN thay đổi giữa các lần xảy ra của cùng vấn đề, trừ mục đích bản địa hoá.
> - `detail`: một giải thích cho người đọc, riêng cho lần xảy ra cụ thể này của vấn đề. Giống `title`, giá trị của field này có thể được bản địa hoá.
> - `source`: một object chứa các tham chiếu tới nguồn gốc chính của lỗi. Nó NÊN chứa một trong các member sau, hoặc bị bỏ đi:
>   - `pointer`: một JSON Pointer [RFC6901] trỏ tới giá trị trong request document đã gây ra lỗi [ví dụ `"/data"` cho một primary data object, hoặc `"/data/attributes/title"` cho một attribute cụ thể]. Nó PHẢI trỏ tới một giá trị thực sự tồn tại trong request document; nếu không, client NÊN đơn giản là bỏ qua pointer đó.
>   - `parameter`: một string chỉ ra query parameter nào của URI đã gây ra lỗi.
>   - `header`: một string chỉ ra tên của một request header đã gây ra lỗi.
> - `meta`: một meta object chứa meta-information phi tiêu chuẩn về lỗi."

> [!tip] `status` là **string**, không phải number
> Spec ghi rõ "expressed as a string value" — tức `"status": "422"`, không phải `"status": 422`. Cùng triết lý với `id`: mọi thứ định danh đều là string để tránh nhập nhằng kiểu dữ liệu.

💡 **Ví dụ đời sống**
Bộ ba `title` / `detail` / `source.pointer` giống hệt cách một nhân viên tiếp nhận hồ sơ trả đơn: `title` = "Thiếu thông tin bắt buộc" (câu in sẵn, hồ sơ nào cũng dùng), `detail` = "Ô ngày sinh bỏ trống" (riêng hồ sơ này), `source.pointer` = khoanh đỏ đúng cái ô đó trên tờ giấy.

---

## Vài khuyến nghị đáng nhớ (trang Recommendations)

📖 **Nguyên văn**
> "This section contains recommendations for JSON:API implementations. These recommendations are intended to establish a level of consistency in areas that are beyond the scope of the base JSON:API specification."
>
> "Member names SHOULD be camel-cased (i.e., wordWordWord)"
>
> "It is recommended that the URL for a collection of resources be formed from the resource type."
>
> "It is recommended that a relationship URL be formed by appending /relationships/ and the name of the relationship to the resource's URL."

🇻🇳 **Dịch**
> "Phần này chứa các khuyến nghị cho các implementation JSON:API. Những khuyến nghị này nhằm thiết lập một mức độ nhất quán ở những vùng nằm ngoài phạm vi của base JSON:API specification."
> "Tên member NÊN viết kiểu camelCase (tức `wordWordWord`)."
> "Khuyến nghị là URL cho một collection resource nên được tạo từ resource `type`."
> "Khuyến nghị là relationship URL nên được tạo bằng cách nối thêm `/relationships/` và tên của relationship vào URL của resource."

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

- **Không phải API JSON nào cũng nên là JSON:API.** JSON:API trả giá bằng độ dài payload (`type`/`id`/`attributes`/`relationships` lồng nhiều tầng) để đổi lấy tính nhất quán và tooling. Với một webhook handler hay một endpoint nội bộ đơn giản, cái giá đó không đáng.
- **Điểm đáng mang về dù không theo spec:** quy ước `id` luôn là string; `data` và `errors` không cùng tồn tại; `status` trong error là string; khoá ngoại nằm ở quan hệ chứ không nằm trong `attributes`. Bốn quy ước này áp dụng được vào bất kỳ JSON API viết tay nào.
- **`included` không miễn phí ở backend.** Như đã nói ở phần N+1: nếu handler của bạn vẫn lặp query cho từng phần tử, `include` chỉ giấu vấn đề khỏi client. Kiểm tra số query thực tế, đừng chỉ nhìn số HTTP request.

---

## Liên kết
- [[11 - NULL, Hàm String, Date và JSON]] — kiểu `json` / `jsonb` trong PostgreSQL, nơi payload JSON được lưu trữ.
- [[07 - N+1 Problem]] — N+1 ở tầng database; compound document + `include` là hình chiếu của cùng vấn đề đó lên tầng API.
- [[02 - What is HTTP]] — `Content-Type`, `Accept`, content negotiation, các status code `400` / `406` / `415` mà JSON:API viện dẫn.
- [[13 - SQL Injection và Parameterized Query]] — các query parameter `filter[...]` là input từ client; đừng ghép thẳng vào SQL.

## Nguồn tham khảo
- Introducing JSON (json.org) : https://www.json.org/json-en.html
- RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format : https://www.rfc-editor.org/rfc/rfc8259.txt
- JSON:API — Latest Specification (v1.1) : https://jsonapi.org/format/
- JSON:API — Recommendations : https://jsonapi.org/recommendations/
- JSON:API — trang chủ (phần giới thiệu và ví dụ response) : https://jsonapi.org/
