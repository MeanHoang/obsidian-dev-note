# 08 — OpenAPI Specification

> **Nguồn chính:** OpenAPI Specification v3.2.0 — https://spec.openapis.org/oas/latest.html
> Bài này bám mục 2 (Introduction), 3 (Format) và 4 (Objects and Fields) của spec: cấu trúc một OpenAPI document và các Object cốt lõi.

> [!note] Phiên bản đang đọc
> Trang `latest.html` tại thời điểm viết bài trỏ tới **OpenAPI Specification v3.2.0**, ngày **19 September 2025**, bản quyền *Copyright © 2025 the Linux Foundation*.

---

## Swagger hay OpenAPI? Gọi cho đúng

> [!warning] Hai cái tên, một thứ hay bị lẫn
> - **OpenAPI Specification (OAS)** là tên của **chuẩn**, do **OpenAPI Initiative (OAI)** — một dự án thuộc **Linux Foundation** — xuất bản tại `spec.openapis.org`. Bản quyền ghi trên trang spec: *"Copyright © 2025 the Linux Foundation"*.
> - **Swagger** là tên **bộ công cụ** của **SmartBear**: Swagger Editor, Swagger UI, Swagger Codegen. Trang `swagger.io/specification/` đăng lại nội dung spec nhưng đó là bản render của SmartBear, **không phải** bản chính thức của OAI.
> - Bản thân trang spec v3.2.0 ghi rõ nơi đặt bản chính thức, xem trích dẫn ngay dưới đây.
>
> Ghi chú về lịch sử đổi tên (Swagger Specification → OpenAPI Specification) **không xuất hiện trong văn bản spec v3.2.0**, nên ở đây mình không trích — chỉ ghi nhận quy ước gọi tên hiện nay như trên.

📖 **Nguyên văn** (OAS v3.2.0, §2 Introduction)
> "For extension registries and other specifications published by the OpenAPI Initiative, as well as the authoritative rendering of this specification, please visit spec.openapis.org."

🇻🇳 **Dịch**
> "Để xem các registry mở rộng và các specification khác do OpenAPI Initiative xuất bản, cũng như **bản render có thẩm quyền** của specification này, vui lòng truy cập spec.openapis.org."

📖 **Nguyên văn** (OAS v3.2.0, mục "Status of This Document")
> "The source-of-truth for this specification is the HTML file referenced above as This version."

🇻🇳 **Dịch**
> "Nguồn chân lý (source-of-truth) của specification này là file HTML được tham chiếu ở trên dưới nhãn *This version*."

---

## OpenAPI Specification là gì

📖 **Nguyên văn** (OAS v3.2.0, §2 Introduction)
> "The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to HTTP APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined, a consumer can understand and interact with the remote service by parsing and serializing HTTP messages to and from a data model with a minimal amount of implementation logic."

🇻🇳 **Dịch**
> "OpenAPI Specification (OAS) định nghĩa một interface chuẩn, độc lập ngôn ngữ lập trình, dành cho các HTTP API; nó cho phép **cả con người lẫn máy tính** khám phá và hiểu được khả năng của một service mà **không cần truy cập source code, tài liệu, hay soi lưu lượng mạng**. Khi được định nghĩa đúng cách, phía consumer có thể hiểu và tương tác với remote service bằng cách parse và serialize các HTTP message ra/vào một data model, với lượng logic cài đặt tối thiểu."

💡 **Ví dụ đời sống**
Nghĩ tới **bản vẽ kỹ thuật của một ổ cắm điện**. Bạn không cần tháo tường ra xem dây đi thế nào, cũng không cần hỏi thợ điện: bản vẽ ghi rõ lỗ cắm loại gì, điện áp bao nhiêu, dòng tối đa bao nhiêu. Bất kỳ hãng nào trên thế giới cũng tự sản xuất được phích cắm khớp. OpenAPI đúng là bản vẽ đó, nhưng cho HTTP API — và quan trọng hơn: **máy đọc được bản vẽ**, nên máy tự chế ra "phích cắm" (client code) giúp bạn.

---

## Ý tưởng cốt lõi: một contract máy đọc được

Đây là điểm phân biệt OpenAPI với tài liệu API viết tay: file spec không chỉ để người đọc, mà là **đầu vào cho công cụ**.

📖 **Nguyên văn** (OAS v3.2.0, §2 Introduction)
> "An OpenAPI Description (OAD) can then be used by documentation generation tools to display the API, code generation tools to generate servers and clients in various programming languages, testing tools, and many other use cases."

🇻🇳 **Dịch**
> "Một OpenAPI Description (OAD) sau đó có thể được dùng bởi các công cụ sinh tài liệu để hiển thị API, các công cụ sinh code để sinh ra **server và client bằng nhiều ngôn ngữ lập trình khác nhau**, các công cụ testing, và nhiều trường hợp sử dụng khác."

📖 **Nguyên văn** (trang chủ OpenAPI Initiative, mục "What is OpenAPI?")
> "The OpenAPI Specifications provide a formal standard for describing HTTP APIs.
> This allows people to understand how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, and much, much more."

🇻🇳 **Dịch**
> "Các OpenAPI Specification cung cấp một chuẩn hình thức (formal standard) để mô tả HTTP API.
> Nhờ đó, người ta hiểu được một API hoạt động ra sao, một chuỗi API phối hợp với nhau thế nào, **sinh client code, tạo test, áp dụng chuẩn thiết kế**, và nhiều thứ khác nữa."

📖 **Nguyên văn** (OAS v3.2.0, mục "What is the OpenAPI Specification?" ở đầu trang)
> "Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service."

🇻🇳 **Dịch**
> "Tương tự như những gì các interface description đã làm cho lập trình ở tầng thấp hơn, OpenAPI Specification **loại bỏ việc phải đoán mò khi gọi một service**."

> [!tip] Vì sao "máy đọc được" lại là cả một thay đổi về chất
> Tài liệu Markdown mô tả API chỉ có một người tiêu thụ: lập trình viên. Một file OpenAPI thì có nhiều: trình sinh tài liệu, trình sinh SDK, trình sinh server stub, trình validate request/response, trình sinh test. Sửa contract một chỗ → tất cả các đầu ra kia cùng cập nhật. Spec chỉ liệt kê "documentation generation tools, code generation tools, testing tools, and many other use cases" — mock server nằm trong nhóm "many other use cases" và **không được spec gọi tên**, nên đừng trích spec cho ý đó.

---

## Liên hệ với SOAP/WSDL

Ý tưởng "contract máy đọc được" không mới. Thế giới SOAP đã có sẵn nó từ đầu dưới dạng **WSDL** — xem [[05 - SOAP]]: mỗi SOAP service đi kèm một file WSDL mô tả operation, kiểu dữ liệu, endpoint, và từ WSDL người ta sinh ra client stub tự động.

REST thì không: [[02 - REST]] / kiến trúc REST không quy định bất kỳ định dạng contract nào, nên suốt nhiều năm tài liệu REST API là văn bản viết tay. **OpenAPI lấp đúng khoảng trống đó** — đóng vai trò của WSDL, nhưng cho HTTP API kiểu REST, và viết bằng JSON/YAML thay vì XML.

| | SOAP | REST + OpenAPI |
|---|---|---|
| File contract | WSDL | OpenAPI Description (OAD) |
| Định dạng | XML | JSON hoặc YAML |
| Bắt buộc? | Gắn liền với SOAP | Tuỳ chọn, thêm vào ngoài API |
| Sinh client/server | Có | Có |

> [!note] Đây là phần đối chiếu do mình rút ra
> Bảng so sánh trên là ghi chú học tập, **không trích từ spec OAS** — spec v3.2.0 không nhắc tới WSDL. Phần trích nguyên văn về WSDL nằm ở bài [[05 - SOAP]].

---

## Format: JSON hay YAML?

📖 **Nguyên văn** (OAS v3.2.0, §3 Format)
> "An OpenAPI document that conforms to the OpenAPI Specification is itself a JSON object, which may be represented either in JSON or YAML format.
> Examples in this specification will be shown in YAML for brevity.
>
> All field names in the specification are case-sensitive."

🇻🇳 **Dịch**
> "Một OpenAPI document tuân thủ OpenAPI Specification **bản thân nó là một JSON object**, và có thể được biểu diễn ở định dạng JSON hoặc YAML.
> Các ví dụ trong specification này sẽ được trình bày bằng YAML cho ngắn gọn.
>
> Mọi tên field trong specification đều **phân biệt hoa thường** (case-sensitive)."

---

## Cấu trúc document — OpenAPI Object (root)

📖 **Nguyên văn** (OAS v3.2.0, §4.1 OpenAPI Object)
> "This is the root object of the OpenAPI Description."
>
> "In addition to the required fields, at least one of the components, paths, or webhooks fields MUST be present."

🇻🇳 **Dịch**
> "Đây là object gốc của OpenAPI Description."
>
> "Ngoài các field bắt buộc, **ít nhất một trong ba field `components`, `paths`, hoặc `webhooks` MUST có mặt**."

Dưới đây là định nghĩa nguyên văn từng field gốc mà roadmap yêu cầu nắm.

### `openapi`

📖 **Nguyên văn**
> "openapi | string | REQUIRED. This string MUST be the version number of the OpenAPI Specification that the OpenAPI document uses. The openapi field SHOULD be used by tooling to interpret the OpenAPI document. This is not related to the info.version string, which describes the OpenAPI document's version."

🇻🇳 **Dịch**
> "`openapi` | string | **REQUIRED**. Chuỗi này MUST là số phiên bản của OpenAPI Specification mà OpenAPI document này dùng. Field `openapi` SHOULD được tooling dùng để diễn giải OpenAPI document. Nó **không liên quan** tới chuỗi `info.version` — chuỗi đó mô tả phiên bản của chính OpenAPI document."

### `info`

📖 **Nguyên văn**
> "info | Info Object | REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required."

🇻🇳 **Dịch**
> "`info` | Info Object | **REQUIRED**. Cung cấp metadata về API. Metadata MAY được tooling sử dụng tuỳ nhu cầu."

📖 **Nguyên văn** (§4.2 Info Object — fixed fields)
> "The object provides metadata about the API.
> The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience."
>
> "title | string | REQUIRED. The title of the API."
> "summary | string | A short summary of the API."
> "description | string | A description of the API. [CommonMark] syntax MAY be used for rich text representation."
> "termsOfService | string | A URI for the Terms of Service for the API. This MUST be in the form of a URI."
> "contact | Contact Object | The contact information for the exposed API."
> "license | License Object | The license information for the exposed API."
> "version | string | REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the version of the API being described or the version of the OpenAPI Description)."

🇻🇳 **Dịch**
> "Object này cung cấp metadata về API.
> Metadata MAY được client dùng nếu cần, và MAY được hiển thị trong các công cụ soạn thảo hoặc sinh tài liệu cho tiện."
>
> "`title` | string | **REQUIRED**. Tiêu đề của API."
> "`summary` | string | Tóm tắt ngắn về API."
> "`description` | string | Mô tả về API. Cú pháp [CommonMark] MAY được dùng để biểu diễn rich text."
> "`termsOfService` | string | URI tới Điều khoản dịch vụ của API. Cái này MUST ở dạng URI."
> "`contact` | Contact Object | Thông tin liên hệ của API được công bố."
> "`license` | License Object | Thông tin license của API được công bố."
> "`version` | string | **REQUIRED**. Phiên bản của OpenAPI document (khác với phiên bản của OpenAPI Specification, khác với phiên bản của API đang được mô tả, và khác với phiên bản của OpenAPI Description)."

📖 **Nguyên văn** (§4.2.2 Info Object Example)
> ```yaml
> title: Example Pet Store App
> summary: A pet store manager.
> description: This is an example server for a pet store.
> termsOfService: https://example.com/terms/
> contact:
>   name: API Support
>   url: https://www.example.com/support
>   email: support@example.com
> license:
>   name: Apache 2.0
>   url: https://www.apache.org/licenses/LICENSE-2.0.html
> version: 1.0.1
> ```

🇻🇳 Khối YAML trên là ví dụ `info` nguyên văn trong spec: tiêu đề, mô tả, liên hệ, license và `version: 1.0.1` — là phiên bản của **document**, không phải của OAS.

### `servers`

📖 **Nguyên văn**
> "servers | [Server Object] | An array of Server Objects, which provide connectivity information to a target server. If the servers field is not provided, or is an empty array, the default value would be an array consisting of a single Server Object with a url value of /."

🇻🇳 **Dịch**
> "`servers` | [Server Object] | Một mảng các Server Object, cung cấp thông tin kết nối tới server đích. Nếu field `servers` không được cung cấp, hoặc là mảng rỗng, thì giá trị mặc định sẽ là mảng gồm **một Server Object duy nhất với `url` bằng `/`**."

📖 **Nguyên văn** (§4.5 Server Object — fixed fields)
> "url | string | REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the document containing the Server Object is being served. Query and fragment MUST NOT be part of this URL. Variable substitutions will be made when a variable is named in {braces}."
> "description | string | An optional string describing the host designated by the URL. [CommonMark] syntax MAY be used for rich text representation."
> "name | string | An optional unique string to refer to the host designated by the URL."
> "variables | Map[string, Server Variable Object] | A map between a variable name and its value. The value is used for substitution in the server's URL template."

🇻🇳 **Dịch**
> "`url` | string | **REQUIRED**. URL tới host đích. URL này hỗ trợ Server Variables và MAY là URL tương đối, để chỉ ra rằng vị trí host là tương đối so với nơi document chứa Server Object đang được phục vụ. Query và fragment MUST NOT nằm trong URL này. Việc thay thế biến sẽ diễn ra khi một biến được đặt tên trong `{ngoặc nhọn}`."
> "`description` | string | Chuỗi tuỳ chọn mô tả host mà URL trỏ tới. Cú pháp [CommonMark] MAY được dùng."
> "`name` | string | Chuỗi duy nhất tuỳ chọn để tham chiếu tới host mà URL trỏ tới."
> "`variables` | Map[string, Server Variable Object] | Map giữa tên biến và giá trị của nó. Giá trị dùng để thay thế trong URL template của server."

📖 **Nguyên văn** (§4.5.3 Server Object Example)
> ```yaml
> servers:
>   - url: https://development.gigantic-server.com/v1
>     description: Development server
>     name: dev
>   - url: https://staging.gigantic-server.com/v1
>     description: Staging server
>     name: staging
>   - url: https://api.gigantic-server.com/v1
>     description: Production server
>     name: prod
> ```

🇻🇳 Ví dụ nguyên văn: cùng một API nhưng ba môi trường dev / staging / production, mỗi cái một base URL.

### `paths`

📖 **Nguyên văn**
> "paths | Paths Object | The available paths and operations for the API."

🇻🇳 **Dịch**
> "`paths` | Paths Object | Các path và operation sẵn có của API."

### `components`

📖 **Nguyên văn**
> "components | Components Object | An element to hold various Objects for the OpenAPI Description."

🇻🇳 **Dịch**
> "`components` | Components Object | Một phần tử để chứa các Object khác nhau của OpenAPI Description."

### `security`

📖 **Nguyên văn**
> "security | [Security Requirement Object] | A declaration of which security mechanisms can be used across the API. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. Individual operations can override this definition. The list can be incomplete, up to being empty or absent. To make security explicitly optional, an empty security requirement ({}) can be included in the array."

🇻🇳 **Dịch**
> "`security` | [Security Requirement Object] | Khai báo các cơ chế security có thể dùng trên toàn API. Danh sách giá trị bao gồm các Security Requirement Object **thay thế lẫn nhau**. Chỉ cần **một** trong các Security Requirement Object được thoả mãn là request được authorize. Từng operation riêng lẻ có thể override khai báo này. Danh sách có thể không đầy đủ, thậm chí rỗng hoặc vắng mặt. Để làm cho security **rõ ràng là tuỳ chọn**, có thể đưa một security requirement rỗng (`{}`) vào mảng."

### `tags`

📖 **Nguyên văn**
> "tags | [Tag Object] | A list of tags used by the OpenAPI Description with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique."

🇻🇳 **Dịch**
> "`tags` | [Tag Object] | Danh sách các tag được OpenAPI Description sử dụng, kèm metadata bổ sung. Thứ tự các tag có thể được công cụ parse dùng để phản ánh thứ tự hiển thị. **Không bắt buộc phải khai báo mọi tag** mà Operation Object dùng. Những tag không được khai báo MAY được sắp xếp ngẫu nhiên hoặc theo logic của tool. Mỗi tên tag trong danh sách MUST là duy nhất."

📖 **Nguyên văn** (§4.22 Tag Object)
> "Adds metadata to a single tag that is used by the Operation Object.
> It is not mandatory to have a Tag Object per tag defined in the Operation Object instances."
>
> "name | string | REQUIRED. The name of the tag. Use this value in the tags array of an Operation."
> "summary | string | A short summary of the tag, used for display purposes."
> "parent | string | The name of a tag that this tag is nested under. The named tag MUST exist in the API description, and circular references between parent and child tags MUST NOT be used."
> "kind | string | A machine-readable string to categorize what sort of tag it is. Any string value can be used; common uses are nav for Navigation, badge for visible badges, audience for APIs used by different groups. A registry of the most commonly used values is available."

🇻🇳 **Dịch**
> "Thêm metadata cho một tag được Operation Object sử dụng.
> Không bắt buộc phải có một Tag Object cho mỗi tag đã khai trong các Operation Object."
>
> "`name` | string | **REQUIRED**. Tên của tag. Dùng giá trị này trong mảng `tags` của một Operation."
> "`summary` | string | Tóm tắt ngắn về tag, dùng cho mục đích hiển thị."
> "`parent` | string | Tên của tag mà tag này lồng bên dưới. Tag được đặt tên MUST tồn tại trong API description, và MUST NOT dùng tham chiếu vòng giữa tag cha và tag con."
> "`kind` | string | Chuỗi máy đọc được để phân loại tag thuộc dạng nào. Có thể dùng bất kỳ chuỗi nào; các cách dùng phổ biến là `nav` cho Navigation, `badge` cho các badge hiển thị, `audience` cho API dùng bởi các nhóm khác nhau. Có sẵn một registry các giá trị hay dùng nhất."

### `externalDocs`

📖 **Nguyên văn**
> "externalDocs | External Documentation Object | Additional external documentation."
>
> (§4.11 External Documentation Object) "Allows referencing an external resource for extended documentation."
> "description | string | A description of the target documentation. [CommonMark] syntax MAY be used for rich text representation."
> "url | string | REQUIRED. The URI for the target documentation. This MUST be in the form of a URI."

🇻🇳 **Dịch**
> "`externalDocs` | External Documentation Object | Tài liệu bên ngoài bổ sung."
>
> (§4.11 External Documentation Object) "Cho phép tham chiếu tới một tài nguyên bên ngoài để mở rộng tài liệu."
> "`description` | string | Mô tả về tài liệu đích. Cú pháp [CommonMark] MAY được dùng."
> "`url` | string | **REQUIRED**. URI tới tài liệu đích. Cái này MUST ở dạng URI."

---

## Paths Object và Path Templating

📖 **Nguyên văn** (§4.8 Paths Object)
> "Holds the relative paths to the individual endpoints and their operations.
> The path is appended to the URL from the Server Object in order to construct the full URL. The Paths Object MAY be empty, due to Access Control List (ACL) constraints."

🇻🇳 **Dịch**
> "Chứa các path tương đối tới từng endpoint và các operation của chúng.
> Path được **nối vào URL lấy từ Server Object** để tạo thành URL đầy đủ. Paths Object MAY rỗng, do các ràng buộc Access Control List (ACL)."

📖 **Nguyên văn** (§4.8.1 Patterned Fields)
> "/{path} | Path Item Object | A relative path to an individual endpoint. The field name MUST begin with a forward slash (/). The URL from the Server Object's url field, resolved and with template variables substituted, has the path appended (no relative URL resolution) to it in order to construct the full URL. Path templating is allowed. When matching URLs, concrete (non-templated) paths would be matched before their templated counterparts. Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical. In case of ambiguous matching, it's up to the tooling to decide which one to use."

🇻🇳 **Dịch**
> "`/{path}` | Path Item Object | Path tương đối tới một endpoint. Tên field MUST bắt đầu bằng dấu gạch chéo (`/`). URL lấy từ field `url` của Server Object — sau khi resolve và thay thế biến template — sẽ được nối thêm path này (không dùng resolve URL tương đối) để tạo URL đầy đủ. Được phép dùng path templating. Khi so khớp URL, các path **cụ thể (không template)** sẽ được khớp trước các path template tương ứng. MUST NOT tồn tại hai path template cùng cấu trúc nhưng khác tên biến vì chúng là **giống hệt nhau**. Trong trường hợp khớp mơ hồ, tuỳ tooling quyết định dùng cái nào."

📖 **Nguyên văn** (§4.8.2 Path Templating)
> "Path templating refers to the usage of template expressions, delimited by curly braces ({}), to mark a section of a URL path as replaceable using path parameters."

🇻🇳 **Dịch**
> "Path templating là việc dùng các biểu thức template, phân định bằng cặp ngoặc nhọn `{}`, để đánh dấu một phần của URL path là **có thể thay thế** bằng path parameter."

📖 **Nguyên văn** (§4.8.2.1 Path Templating Matching)
> "Assuming the following paths, the concrete definition, /pets/mine, will be matched first if used:"
> ```yaml
>   /pets/{petId}
>   /pets/mine
> ```
> "The following paths are considered identical and invalid:"
> ```yaml
>   /pets/{petId}
>   /pets/{name}
> ```

🇻🇳 **Dịch**
> "Giả sử có các path sau, định nghĩa cụ thể `/pets/mine` sẽ được khớp trước nếu được dùng:" (khối 1)
> "Các path sau được coi là **giống hệt nhau và không hợp lệ**:" (khối 2 — đổi tên biến `{petId}` → `{name}` không tạo ra path khác)

📖 **Nguyên văn** (§4.8.3 Paths Object Example)
> ```yaml
> /pets:
>   get:
>     description: Returns all pets from the system that the user has access to
>     responses:
>       '200':
>         description: A list of pets.
>         content:
>           application/json:
>             schema:
>               type: array
>               items:
>                 $ref: '#/components/schemas/pet'
> ```

🇻🇳 Ví dụ nguyên văn: path `/pets`, operation `get`, response `200` trả về `application/json` là một array các `pet` — nội dung `pet` được `$ref` sang `components/schemas`.

---

## Path Item Object

📖 **Nguyên văn** (§4.9 Path Item Object)
> "Describes the operations available on a single path.
> A Path Item MAY be empty, due to ACL constraints.
> The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available."

🇻🇳 **Dịch**
> "Mô tả các operation khả dụng trên **một path duy nhất**.
> Một Path Item MAY rỗng, do các ràng buộc ACL.
> Bản thân path vẫn hiện ra với người xem tài liệu nhưng họ sẽ không biết những operation và parameter nào là khả dụng."

📖 **Nguyên văn** (§4.9.1 Fixed Fields — trích các field chính)
> "get | Operation Object | A definition of a GET operation on this path."
> "post | Operation Object | A definition of a POST operation on this path."
> "delete | Operation Object | A definition of a DELETE operation on this path."
> "patch | Operation Object | A definition of a PATCH operation on this path."
> (tương tự cho `put`, `options`, `head`, `trace`)
> "servers | [Server Object] | An alternative servers array to service all operations in this path. If a servers array is specified at the OpenAPI Object level, it will be overridden by this value."
> "parameters | [Parameter Object | Reference Object] | A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined in the OpenAPI Object's components.parameters."

🇻🇳 **Dịch**
> "`get` | Operation Object | Định nghĩa một operation GET trên path này."
> "`post` | Operation Object | Định nghĩa một operation POST trên path này."
> "`delete` | Operation Object | Định nghĩa một operation DELETE trên path này."
> "`patch` | Operation Object | Định nghĩa một operation PATCH trên path này."
> (tương tự cho `put`, `options`, `head`, `trace` — mỗi HTTP method là một field riêng)
> "`servers` | [Server Object] | Mảng `servers` thay thế, phục vụ cho mọi operation trong path này. Nếu có mảng `servers` ở cấp OpenAPI Object thì nó sẽ **bị giá trị này override**."
> "`parameters` | [Parameter Object | Reference Object] | Danh sách parameter áp dụng cho **mọi operation** mô tả dưới path này. Các parameter này có thể bị override ở cấp operation, nhưng **không thể bị gỡ bỏ** ở đó. Danh sách MUST NOT chứa parameter trùng lặp. Một parameter là duy nhất theo tổ hợp **name + location**. Danh sách có thể dùng Reference Object để trỏ tới parameter định nghĩa trong `components.parameters` của OpenAPI Object."

> [!note] `query` và `additionalOperations` — mới trong OAS 3.2
> 📖 **Nguyên văn**
> > "query | Operation Object | A definition of a QUERY operation, as defined in the most recent IETF draft (draft-ietf-httpbis-safe-method-w-body-08 as of this writing) or its RFC successor, on this path."
> > "additionalOperations | Map[string, Operation Object] | A map of additional operations on this path. The map key is the HTTP method with the same capitalization that is to be sent in the request. This map MUST NOT contain any entry for the methods that can be defined by other fixed fields with Operation Object values (e.g. no POST entry, as the post field is used for this method)."
>
> 🇻🇳 **Dịch**
> > "`query` | Operation Object | Định nghĩa một operation QUERY trên path này, theo IETF draft mới nhất (`draft-ietf-httpbis-safe-method-w-body-08` tại thời điểm viết) hoặc RFC kế thừa nó."
> > "`additionalOperations` | Map[string, Operation Object] | Map các operation bổ sung trên path này. Key của map là HTTP method viết đúng hoa/thường như sẽ gửi trong request. Map này MUST NOT chứa entry cho các method đã có thể định nghĩa bằng fixed field khác (ví dụ không có entry `POST`, vì field `post` đã dùng cho method này)."

---

## Operation Object

📖 **Nguyên văn** (§4.10 Operation Object)
> "Describes a single API operation on a path."

🇻🇳 **Dịch**
> "Mô tả **một** API operation trên một path."

📖 **Nguyên văn** (§4.10.1 Fixed Fields — trích phần cốt lõi)
> "tags | [string] | A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier."
> "summary | string | A short summary of what the operation does."
> "description | string | A verbose explanation of the operation behavior. [CommonMark] syntax MAY be used for rich text representation."
> "operationId | string | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is case-sensitive. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions."
> "deprecated | boolean | Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false."

🇻🇳 **Dịch**
> "`tags` | [string] | Danh sách tag để điều khiển tài liệu API. Tag dùng để nhóm logic các operation theo resource hoặc theo tiêu chí bất kỳ."
> "`summary` | string | Tóm tắt ngắn operation này làm gì."
> "`description` | string | Giải thích chi tiết hành vi của operation. Cú pháp [CommonMark] MAY được dùng."
> "`operationId` | string | Chuỗi duy nhất để định danh operation. Id này MUST duy nhất trong toàn bộ các operation mô tả trong API. Giá trị `operationId` phân biệt hoa thường. Tool và thư viện MAY dùng `operationId` để định danh duy nhất một operation, vì vậy **RECOMMENDED đặt tên theo quy ước đặt tên lập trình thông dụng**."
> "`deprecated` | boolean | Khai báo operation này là deprecated. Consumer SHOULD tránh dùng operation đã khai báo như vậy. Giá trị mặc định là `false`."

> [!tip] `operationId` là thứ quyết định tên hàm trong SDK sinh ra
> Spec nói tool "MAY use the operationId to uniquely identify an operation" và khuyên theo quy ước đặt tên lập trình — đó chính là lý do `operationId: updatePetWithForm` sẽ trở thành `client.updatePetWithForm(...)` khi sinh client code.

### `parameters`

📖 **Nguyên văn**
> "parameters | [Parameter Object | Reference Object] | A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location."

🇻🇳 **Dịch**
> "`parameters` | [Parameter Object | Reference Object] | Danh sách parameter áp dụng cho operation này. Nếu một parameter đã được định nghĩa ở Path Item, định nghĩa mới sẽ **override** nó nhưng **không bao giờ gỡ bỏ được** nó. Danh sách MUST NOT chứa parameter trùng lặp. Một parameter là duy nhất theo tổ hợp **name + location**."

📖 **Nguyên văn** (§4.12.1 Parameter Locations)
> "There are five possible parameter locations specified by the in field:
>
> path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
>
> query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id; MUST NOT appear in the same operation (or in the operation's path-item) as an in: "querystring" parameter.
>
> querystring - A parameter that treats the entire URL query string as a value which MUST be specified using the content field, most often with media type application/x-www-form-urlencoded using Encoding Objects in the same way as with request bodies of that media type; MUST NOT appear more than once, and MUST NOT appear in the same operation (or in the operation's path-item) as any in: "query" parameters.
>
> header - Custom headers that are expected as part of the request. Note that [RFC9110] Section 5.1 states header names are case-insensitive.
>
> cookie - Used to pass a specific cookie value to the API."

🇻🇳 **Dịch**
> "Có **năm** vị trí parameter khả dĩ, chỉ định bằng field `in`:
>
> `path` — Dùng kèm Path Templating, khi giá trị parameter thực sự là một phần của URL của operation. Không bao gồm host hay base path của API. Ví dụ, trong `/items/{itemId}`, path parameter là `itemId`.
>
> `query` — Parameter được nối vào URL. Ví dụ, trong `/items?id=###`, query parameter là `id`; MUST NOT xuất hiện chung trong một operation (hoặc trong path-item của operation đó) với parameter `in: "querystring"`.
>
> `querystring` — Parameter coi **toàn bộ query string** của URL là một giá trị, và MUST được chỉ định bằng field `content`, thường nhất là với media type `application/x-www-form-urlencoded` dùng Encoding Object y như với request body của media type đó; MUST NOT xuất hiện quá một lần, và MUST NOT xuất hiện chung trong một operation (hoặc path-item của nó) với bất kỳ parameter `in: "query"` nào.
>
> `header` — Các header tuỳ biến được mong đợi trong request. Lưu ý [RFC9110] Section 5.1 nói rằng tên header **không phân biệt hoa thường**.
>
> `cookie` — Dùng để truyền một giá trị cookie cụ thể vào API."

📖 **Nguyên văn** (§4.12.2.1 Common Fixed Fields — trích)
> "Parameter Objects MUST include either a content field or a schema field, but not both."
>
> "name | string | REQUIRED. The name of the parameter. Parameter names are case-sensitive."
> "in | string | REQUIRED. The location of the parameter. Possible values are "query", "querystring", "header", "path" or "cookie"."
> "description | string | A brief description of the parameter. This could contain examples of use. [CommonMark] syntax MAY be used for rich text representation."
> "required | boolean | Determines whether this parameter is mandatory. If the parameter location is "path", this field is REQUIRED and its value MUST be true. Otherwise, the field MAY be included and its default value is false."

🇻🇳 **Dịch**
> "Parameter Object MUST có **hoặc** field `content` **hoặc** field `schema`, nhưng **không được có cả hai**."
>
> "`name` | string | **REQUIRED**. Tên của parameter. Tên parameter phân biệt hoa thường."
> "`in` | string | **REQUIRED**. Vị trí của parameter. Các giá trị khả dĩ là `"query"`, `"querystring"`, `"header"`, `"path"` hoặc `"cookie"`."
> "`description` | string | Mô tả ngắn về parameter. Có thể chứa ví dụ sử dụng. Cú pháp [CommonMark] MAY được dùng."
> "`required` | boolean | Xác định parameter này có bắt buộc không. Nếu vị trí parameter là `"path"` thì field này là **REQUIRED và giá trị MUST là `true`**. Ngược lại, field MAY có mặt và mặc định là `false`."

### `requestBody`

📖 **Nguyên văn** (Operation Object)
> "requestBody | Request Body Object | Reference Object | The request body applicable for this operation. The requestBody is fully supported in HTTP methods where the HTTP specification [RFC9110] Section 9.3 has explicitly defined semantics for request bodies. In other cases where the HTTP spec discourages message content (such as GET and DELETE), requestBody is permitted but does not have well-defined semantics and SHOULD be avoided if possible."

🇻🇳 **Dịch**
> "`requestBody` | Request Body Object | Reference Object | Request body áp dụng cho operation này. `requestBody` được hỗ trợ đầy đủ với các HTTP method mà HTTP specification [RFC9110] Section 9.3 đã định nghĩa rõ ngữ nghĩa cho request body. Trong các trường hợp khác, nơi HTTP spec không khuyến khích gửi nội dung (như GET và DELETE), `requestBody` **được phép nhưng không có ngữ nghĩa rõ ràng và SHOULD tránh dùng nếu có thể**."

📖 **Nguyên văn** (§4.13 Request Body Object)
> "Describes a single request body."
>
> "description | string | A brief description of the request body. This could contain examples of use. [CommonMark] syntax MAY be used for rich text representation."
> "content | Map[string, Media Type Object | Reference Object] | REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. The map SHOULD have at least one entry; if it does not, the behavior is implementation-defined. For requests that match multiple keys, only the most specific key is applicable. e.g. "text/plain" overrides "text/*""
> "required | boolean | Determines if the request body is required in the request. Defaults to false."

🇻🇳 **Dịch**
> "Mô tả một request body."
>
> "`description` | string | Mô tả ngắn về request body. Có thể chứa ví dụ sử dụng. Cú pháp [CommonMark] MAY được dùng."
> "`content` | Map[string, Media Type Object | Reference Object] | **REQUIRED**. Nội dung của request body. Key là một media type hoặc dải media type, còn value mô tả nó. Map SHOULD có ít nhất một entry; nếu không, hành vi là implementation-defined. Với request khớp nhiều key, **chỉ key cụ thể nhất được áp dụng**, ví dụ `"text/plain"` thắng `"text/*"`."
> "`required` | boolean | Xác định request body có bắt buộc trong request hay không. Mặc định `false`."

### `responses`

📖 **Nguyên văn** (Operation Object)
> "responses | Responses Object | The list of possible responses as they are returned from executing this operation."

🇻🇳 **Dịch**
> "`responses` | Responses Object | Danh sách các response khả dĩ khi thực thi operation này."

📖 **Nguyên văn** (§4.16 Responses Object)
> "A container for the expected responses of an operation.
> The container maps a HTTP response code to the expected response.
>
> The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance.
> However, documentation is expected to cover a successful operation response and any known errors.
>
> The default MAY be used as a default Response Object for all HTTP codes that are not covered individually by the Responses Object.
>
> The Responses Object MUST contain at least one response code, and if only one response code is provided it SHOULD be the response for a successful operation call."

🇻🇳 **Dịch**
> "Một container cho các response được mong đợi của một operation.
> Container này ánh xạ **HTTP response code → response mong đợi**.
>
> Tài liệu không nhất thiết phải bao phủ mọi HTTP response code khả dĩ vì có thể không biết trước được.
> Tuy nhiên, tài liệu được kỳ vọng bao phủ response thành công và mọi lỗi đã biết.
>
> `default` MAY được dùng làm Response Object mặc định cho tất cả các mã HTTP không được Responses Object liệt kê riêng.
>
> Responses Object MUST chứa **ít nhất một** response code, và nếu chỉ có một thì nó SHOULD là response của lời gọi operation thành công."

📖 **Nguyên văn** (§4.16.2 Patterned Fields)
> "HTTP Status Code | Response Object | Reference Object | Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between 200 and 299. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code."

🇻🇳 **Dịch**
> "HTTP Status Code | Response Object | Reference Object | Bất kỳ HTTP status code nào cũng có thể làm tên property, nhưng **mỗi mã chỉ một property**, để mô tả response mong đợi cho mã đó. Field này MUST được đặt trong **dấu nháy** (ví dụ `"200"`) để tương thích giữa JSON và YAML. Để định nghĩa một dải mã, field này MAY chứa ký tự wildcard hoa `X`. Ví dụ `2XX` đại diện cho mọi mã từ 200 đến 299. Chỉ các dải sau được phép: `1XX`, `2XX`, `3XX`, `4XX`, `5XX`. Nếu một response được định nghĩa bằng mã tường minh, **định nghĩa tường minh thắng** định nghĩa dải cho mã đó."

📖 **Nguyên văn** (§4.16.4 Responses Object Example)
> ```yaml
> '200':
>   description: a pet to be returned
>   content:
>     application/json:
>       schema:
>         $ref: '#/components/schemas/Pet'
> default:
>   description: Unexpected error
>   content:
>     application/json:
>       schema:
>         $ref: '#/components/schemas/ErrorModel'
> ```

🇻🇳 Ví dụ nguyên văn: `'200'` trả về `Pet`, còn mọi mã khác rơi vào `default` trả về `ErrorModel`.

### Ví dụ Operation Object đầy đủ

📖 **Nguyên văn** (§4.10.2 Operation Object Example)
> ```yaml
> tags:
>   - pet
> summary: Updates a pet in the store with form data
> operationId: updatePetWithForm
> parameters:
>   - name: petId
>     in: path
>     description: ID of pet that needs to be updated
>     required: true
>     schema:
>       type: string
> requestBody:
>   content:
>     application/x-www-form-urlencoded:
>       schema:
>         type: object
>         properties:
>           name:
>             description: Updated name of the pet
>             type: string
>           status:
>             description: Updated status of the pet
>             type: string
>         required:
>           - status
> responses:
>   '200':
>     description: Pet updated.
>     content:
>       application/json: {}
>       application/xml: {}
>   '405':
>     description: Method Not Allowed
>     content:
>       application/json: {}
>       application/xml: {}
> security:
>   - petstore_auth:
>       - write:pets
>       - read:pets
> ```

🇻🇳 Đây là ví dụ nguyên văn gom đủ mọi mảnh của một operation: `tags` để nhóm, `operationId` để sinh code, `parameters` với path parameter `petId` (`required: true` — bắt buộc vì `in: path`), `requestBody` dạng form-urlencoded, `responses` cho `200` và `405`, và `security` yêu cầu scope `write:pets` + `read:pets`.

---

## Schema Object và quan hệ với JSON Schema

📖 **Nguyên văn** (§4.24 Schema Object)
> "The Schema Object allows the definition of input and output data types.
> These types can be objects, but also primitives and arrays. This object is a superset of the JSON Schema Specification Draft 2020-12. The empty schema (which allows any instance to validate) MAY be represented by the boolean value true and a schema which allows no instance to validate MAY be represented by the boolean value false."
>
> "Unless stated otherwise, the keyword definitions follow those of JSON Schema and do not add any additional semantics; this includes keywords such as $schema, $id, $ref, and $dynamicRef being URIs rather than URLs."

🇻🇳 **Dịch**
> "Schema Object cho phép định nghĩa các kiểu dữ liệu đầu vào và đầu ra.
> Các kiểu này có thể là object, nhưng cũng có thể là kiểu nguyên thuỷ và array. Object này là **một superset (tập cha) của JSON Schema Specification Draft 2020-12**. Schema rỗng (cho phép mọi instance hợp lệ) MAY được biểu diễn bằng giá trị boolean `true`, và schema không cho instance nào hợp lệ MAY được biểu diễn bằng `false`."
>
> "Trừ khi có nói khác, các định nghĩa keyword **tuân theo JSON Schema và không thêm ngữ nghĩa gì**; điều này bao gồm việc các keyword như `$schema`, `$id`, `$ref`, `$dynamicRef` là URI chứ không phải URL."

📖 **Nguyên văn** (§4.24.1 JSON Schema Keywords)
> "The OpenAPI Schema Object dialect is defined as requiring the OAS base vocabulary, in addition to the vocabularies as specified in the JSON Schema Specification Draft 2020-12 general purpose meta-schema.
>
> The OpenAPI Schema Object dialect for this version of the specification is identified by the URI https://spec.openapis.org/oas/3.1/dialect/base (the "OAS dialect schema id")."

🇻🇳 **Dịch**
> "Dialect của OpenAPI Schema Object được định nghĩa là **yêu cầu OAS base vocabulary**, bên cạnh các vocabulary được quy định trong meta-schema đa dụng của JSON Schema Specification Draft 2020-12.
>
> Dialect của OpenAPI Schema Object cho phiên bản specification này được định danh bằng URI `https://spec.openapis.org/oas/3.1/dialect/base` (gọi là *"OAS dialect schema id"*)."

📖 **Nguyên văn** (§4.24.3 Data Types)
> "Data types in the OAS are based on the types defined by the JSON Schema Validation Specification Draft 2020-12:
> "null", "boolean", "object", "array", "number", "string", or "integer".
> Models are defined using the Schema Object, which is a superset of the JSON Schema Specification Draft 2020-12."

🇻🇳 **Dịch**
> "Các kiểu dữ liệu trong OAS dựa trên các kiểu được định nghĩa bởi JSON Schema Validation Specification Draft 2020-12:
> `"null"`, `"boolean"`, `"object"`, `"array"`, `"number"`, `"string"`, hoặc `"integer"`.
> Model được định nghĩa bằng Schema Object, vốn là superset của JSON Schema Specification Draft 2020-12."

📖 **Nguyên văn** (§4.24.8.2 Simple Model)
> ```yaml
> type: object
> required:
>   - name
> properties:
>   name:
>     type: string
>   address:
>     $ref: '#/components/schemas/Address'
>   age:
>     type: integer
>     format: int32
>     minimum: 0
> ```

🇻🇳 Model đơn giản nguyên văn từ spec: object có `name` bắt buộc, `address` trỏ sang schema khác bằng `$ref`, `age` là `integer` `int32` không âm.

📖 **Nguyên văn** (§4.24.8.6 Models with Composition)
> ```yaml
> components:
>   schemas:
>     ErrorModel:
>       type: object
>       required:
>         - message
>         - code
>       properties:
>         message:
>           type: string
>         code:
>           type: integer
>           minimum: 100
>           maximum: 600
>     ExtendedErrorModel:
>       allOf:
>         - $ref: '#/components/schemas/ErrorModel'
>         - type: object
>           required:
>             - rootCause
>           properties:
>             rootCause:
>               type: string
> ```

🇻🇳 Ví dụ nguyên văn về composition: `ExtendedErrorModel` dùng `allOf` để "kế thừa" `ErrorModel` rồi thêm field `rootCause`.

> [!tip] Vì sao quan hệ với JSON Schema lại đáng giá
> Vì Schema Object **là** JSON Schema Draft 2020-12 (cộng thêm vài field), bạn có thể lấy phần `components.schemas` trong file OpenAPI đem thẳng qua một thư viện validate JSON Schema bất kỳ để kiểm tra payload — không cần thư viện riêng cho OpenAPI. Xem thêm về kiểu JSON trong database ở [[11 - NULL, Hàm String, Date và JSON]].

---

## Components và `$ref` — tái sử dụng định nghĩa

📖 **Nguyên văn** (§4.7 Components Object)
> "Holds a set of reusable objects for different aspects of the OAS.
> All objects defined within the Components Object will have no effect on the API unless they are explicitly referenced from outside the Components Object."

🇻🇳 **Dịch**
> "Chứa một tập các object **tái sử dụng được** cho các khía cạnh khác nhau của OAS.
> Mọi object định nghĩa bên trong Components Object sẽ **không có tác dụng gì** lên API trừ khi chúng được tham chiếu tường minh từ bên ngoài Components Object."

📖 **Nguyên văn** (§4.7.1 Fixed Fields)
> "schemas | Map[string, Schema Object] | An object to hold reusable Schema Objects."
> "responses | Map[string, Response Object | Reference Object] | An object to hold reusable Response Objects."
> "parameters | Map[string, Parameter Object | Reference Object] | An object to hold reusable Parameter Objects."
> "examples | Map[string, Example Object | Reference Object] | An object to hold reusable Example Objects."
> "requestBodies | Map[string, Request Body Object | Reference Object] | An object to hold reusable Request Body Objects."
> "headers | Map[string, Header Object | Reference Object] | An object to hold reusable Header Objects."
> "securitySchemes | Map[string, Security Scheme Object | Reference Object] | An object to hold reusable Security Scheme Objects."
> "links | Map[string, Link Object | Reference Object] | An object to hold reusable Link Objects."
> "callbacks | Map[string, Callback Object | Reference Object] | An object to hold reusable Callback Objects."
> "pathItems | Map[string, Path Item Object] | An object to hold reusable Path Item Objects."
> "mediaTypes | Map[string, Media Type Object | Reference Object] | An object to hold reusable Media Type Objects."
>
> "All the fixed fields declared above are objects that MUST use keys that match the regular expression: ^[a-zA-Z0-9\.\-_]+$."

🇻🇳 **Dịch**
> "`schemas` — object chứa các Schema Object tái sử dụng được."
> "`responses` — object chứa các Response Object tái sử dụng được."
> "`parameters` — object chứa các Parameter Object tái sử dụng được."
> "`examples` — object chứa các Example Object tái sử dụng được."
> "`requestBodies` — object chứa các Request Body Object tái sử dụng được."
> "`headers` — object chứa các Header Object tái sử dụng được."
> "`securitySchemes` — object chứa các Security Scheme Object tái sử dụng được."
> "`links` — object chứa các Link Object tái sử dụng được."
> "`callbacks` — object chứa các Callback Object tái sử dụng được."
> "`pathItems` — object chứa các Path Item Object tái sử dụng được."
> "`mediaTypes` — object chứa các Media Type Object tái sử dụng được."
>
> "Mọi fixed field khai báo ở trên đều là object mà key MUST khớp biểu thức chính quy `^[a-zA-Z0-9\.\-_]+$`."

📖 **Nguyên văn** (§4.23 Reference Object)
> "A simple object to allow referencing other components in the OpenAPI Description, internally and externally.
>
> The $ref string value contains a URI [RFC3986], which identifies the value being referenced."
>
> "$ref | string | REQUIRED. The reference identifier. This MUST be in the form of a URI."
> "summary | string | A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a summary field, then this field has no effect."
> "description | string | A description which by default SHOULD override that of the referenced component. [CommonMark] syntax MAY be used for rich text representation. If the referenced object-type does not allow a description field, then this field has no effect."
>
> "This object cannot be extended with additional properties, and any properties added SHALL be ignored."

🇻🇳 **Dịch**
> "Một object đơn giản cho phép tham chiếu tới các component khác trong OpenAPI Description, **cả bên trong lẫn bên ngoài** document.
>
> Giá trị chuỗi `$ref` chứa một URI [RFC3986], định danh giá trị đang được tham chiếu."
>
> "`$ref` | string | **REQUIRED**. Định danh tham chiếu. Cái này MUST ở dạng URI."
> "`summary` | string | Tóm tắt ngắn, mặc định SHOULD ghi đè tóm tắt của component được tham chiếu. Nếu loại object được tham chiếu không cho phép field `summary` thì field này vô tác dụng."
> "`description` | string | Mô tả, mặc định SHOULD ghi đè mô tả của component được tham chiếu. Cú pháp [CommonMark] MAY được dùng. Nếu loại object được tham chiếu không cho phép field `description` thì field này vô tác dụng."
>
> "Object này **không thể mở rộng thêm property**, và mọi property thêm vào SHALL bị bỏ qua."

📖 **Nguyên văn** (§4.23.2 – §4.23.4 Reference Object Examples)
> ```yaml
> $ref: '#/components/schemas/Pet'
> ```
> ```yaml
> $ref: Pet.yaml
> ```
> ```yaml
> $ref: definitions.yaml#/Pet
> ```

🇻🇳 Ba dạng `$ref` nguyên văn: trỏ trong cùng document (`#/components/schemas/Pet`), trỏ sang một file schema riêng (`Pet.yaml`), và trỏ vào một phần bên trong file khác (`definitions.yaml#/Pet`).

📖 **Nguyên văn** (§4.7.2 Components Object Example — trích phần đầu)
> ```yaml
> components:
>   schemas:
>     GeneralError:
>       type: object
>       properties:
>         code:
>           type: integer
>           format: int32
>         message:
>           type: string
>   parameters:
>     skipParam:
>       name: skip
>       in: query
>       description: number of items to skip
>       required: true
>       schema:
>         type: integer
>         format: int32
>     limitParam:
>       name: limit
>       in: query
>       description: max records to return
>       required: true
>       schema:
>         type: integer
>         format: int32
>   responses:
>     NotFound:
>       description: Entity not found.
>     IllegalInput:
>       description: Illegal input for operation.
>     GeneralError:
>       description: General Error
>       content:
>         application/json:
>           schema:
>             $ref: '#/components/schemas/GeneralError'
> ```

🇻🇳 Ví dụ nguyên văn: `skipParam` / `limitParam` khai một lần rồi mọi endpoint phân trang đều `$ref` tới; response `NotFound` cũng vậy. Đây chính là cách tránh copy-paste trong file spec.

💡 **Ví dụ đời sống**
Giống **bản vẽ nhà có mục "chú thích ký hiệu"**: thay vì vẽ lại chi tiết cái cửa sổ ở 40 vị trí, bản vẽ định nghĩa "cửa sổ loại A" một lần rồi các phòng chỉ ghi "A". Sửa loại A một chỗ, cả 40 phòng cùng đổi. `components` + `$ref` chính là mục chú thích đó.

---

## Security Scheme Object — cầu nối sang Authentication

📖 **Nguyên văn** (§4.27 Security Scheme Object)
> "Defines a security scheme that can be used by the operations.
>
> Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), mutual TLS (use of a client certificate), OAuth2's common flows (implicit, password, client credentials and authorization code) as defined in [RFC6749], OAuth2 device authorization flow as defined in [RFC8628], and [OpenID-Connect-Core].
> Please note that as of 2020, the implicit flow is about to be deprecated by OAuth 2.0 Security Best Current Practice. Recommended for most use cases is Authorization Code Grant flow with PKCE."

🇻🇳 **Dịch**
> "Định nghĩa một security scheme mà các operation có thể dùng.
>
> Các scheme được hỗ trợ gồm: HTTP authentication, API key (đặt ở header, cookie parameter, hoặc query parameter), mutual TLS (dùng client certificate), các flow phổ biến của OAuth2 (implicit, password, client credentials và authorization code) như định nghĩa trong [RFC6749], OAuth2 device authorization flow như định nghĩa trong [RFC8628], và [OpenID-Connect-Core].
> Xin lưu ý rằng tính từ năm 2020, **implicit flow sắp bị deprecate** theo OAuth 2.0 Security Best Current Practice. Khuyến nghị cho hầu hết trường hợp là **Authorization Code Grant flow kèm PKCE**."

📖 **Nguyên văn** (§4.27.1 Fixed Fields)
> "type | string | Any | REQUIRED. The type of the security scheme. Valid values are "apiKey", "http", "mutualTLS", "oauth2", "openIdConnect"."
> "description | string | Any | A description for security scheme. [CommonMark] syntax MAY be used for rich text representation."
> "name | string | apiKey | REQUIRED. The name of the header, query or cookie parameter to be used."
> "in | string | apiKey | REQUIRED. The location of the API key. Valid values are "query", "header", or "cookie"."
> "scheme | string | http | REQUIRED. The name of the HTTP Authentication scheme to be used in the Authorization header as defined in [RFC9110] Section 16.4.1. The values used SHOULD be registered in the IANA Authentication Scheme registry. The value is case-insensitive, as defined in [RFC9110] Section 11.1."
> "bearerFormat | string | http ("bearer") | A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes."
> "flows | OAuth Flows Object | oauth2 | REQUIRED. An object containing configuration information for the flow types supported."
> "openIdConnectUrl | string | openIdConnect | REQUIRED. Well-known URL to discover the [OpenID-Connect-Discovery] provider metadata."
> "oauth2MetadataUrl | string | oauth2 | URL to the OAuth2 authorization server metadata [RFC8414]. TLS is required."

🇻🇳 **Dịch**
> "`type` | string | mọi loại | **REQUIRED**. Loại của security scheme. Giá trị hợp lệ: `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`."
> "`description` | string | mọi loại | Mô tả cho security scheme. Cú pháp [CommonMark] MAY được dùng."
> "`name` | string | apiKey | **REQUIRED**. Tên của header, query hoặc cookie parameter sẽ dùng."
> "`in` | string | apiKey | **REQUIRED**. Vị trí của API key. Giá trị hợp lệ: `"query"`, `"header"`, hoặc `"cookie"`."
> "`scheme` | string | http | **REQUIRED**. Tên của HTTP Authentication scheme dùng trong header `Authorization` như định nghĩa ở [RFC9110] Section 16.4.1. Giá trị dùng SHOULD được đăng ký trong IANA Authentication Scheme registry. Giá trị không phân biệt hoa thường, theo [RFC9110] Section 11.1."
> "`bearerFormat` | string | http (`"bearer"`) | Gợi ý cho client biết bearer token được định dạng thế nào. Bearer token thường do authorization server sinh ra, nên thông tin này **chủ yếu phục vụ mục đích tài liệu**."
> "`flows` | OAuth Flows Object | oauth2 | **REQUIRED**. Object chứa thông tin cấu hình cho các loại flow được hỗ trợ."
> "`openIdConnectUrl` | string | openIdConnect | **REQUIRED**. URL well-known để khám phá metadata của provider [OpenID-Connect-Discovery]."
> "`oauth2MetadataUrl` | string | oauth2 | URL tới metadata của OAuth2 authorization server [RFC8414]. Bắt buộc dùng TLS."

📖 **Nguyên văn** (§4.27.2 Security Scheme Object Examples)
> *4.27.2.1 Basic Authentication Example*
> ```yaml
> type: http
> scheme: basic
> ```
> *4.27.2.2 API Key Example*
> ```yaml
> type: apiKey
> name: api-key
> in: header
> ```
> *4.27.2.3 JWT Bearer Example*
> ```yaml
> type: http
> scheme: bearer
> bearerFormat: JWT
> ```
> *4.27.2.4 MutualTLS Example*
> ```yaml
> type: mutualTLS
> description: Cert must be signed by example.com CA
> ```
> *4.27.2.5 Implicit OAuth2 Example*
> ```yaml
> type: oauth2
> flows:
>   implicit:
>     authorizationUrl: https://example.com/api/oauth/dialog
>     scopes:
>       write:pets: modify pets in your account
>       read:pets: read your pets
> ```

🇻🇳 Năm ví dụ nguyên văn tương ứng năm kiểu: HTTP Basic, API key đặt ở header, JWT bearer token, mutual TLS bằng client certificate, và OAuth2 implicit flow kèm danh sách scope.

### OAuth Flows Object

📖 **Nguyên văn** (§4.28 OAuth Flows Object)
> "Allows configuration of the supported OAuth Flows."
>
> "implicit | OAuth Flow Object | Configuration for the OAuth Implicit flow"
> "password | OAuth Flow Object | Configuration for the OAuth Resource Owner Password flow"
> "clientCredentials | OAuth Flow Object | Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0."
> "authorizationCode | OAuth Flow Object | Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0."
> "deviceAuthorization | OAuth Flow Object | Configuration for the OAuth Device Authorization flow."

🇻🇳 **Dịch**
> "Cho phép cấu hình các OAuth Flow được hỗ trợ."
>
> "`implicit` | OAuth Flow Object | Cấu hình cho OAuth Implicit flow"
> "`password` | OAuth Flow Object | Cấu hình cho OAuth Resource Owner Password flow"
> "`clientCredentials` | OAuth Flow Object | Cấu hình cho OAuth Client Credentials flow. Trước đây gọi là `application` trong OpenAPI 2.0."
> "`authorizationCode` | OAuth Flow Object | Cấu hình cho OAuth Authorization Code flow. Trước đây gọi là `accessCode` trong OpenAPI 2.0."
> "`deviceAuthorization` | OAuth Flow Object | Cấu hình cho OAuth Device Authorization flow."

📖 **Nguyên văn** (§4.29.1 OAuth Flow Object — field `scopes`)
> "scopes | Map[string, string] | oauth2 | REQUIRED. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty."

🇻🇳 **Dịch**
> "`scopes` | Map[string, string] | oauth2 | **REQUIRED**. Các scope khả dụng của security scheme OAuth2. Là map giữa tên scope và mô tả ngắn cho nó. Map MAY rỗng."

### Security Requirement Object — nối scheme vào operation

📖 **Nguyên văn** (§4.30 Security Requirement Object)
> "Lists the required security schemes to execute this operation.
>
> The name used for each property MUST either correspond to a security scheme declared in the Security Schemes under the Components Object, or be the URI of a Security Scheme Object."
>
> "A Security Requirement Object MAY refer to multiple security schemes in which case all schemes MUST be satisfied for a request to be authorized.
> This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.
>
> When the security field is defined on the OpenAPI Object or Operation Object and contains multiple Security Requirement Objects, only one of the entries in the list needs to be satisfied to authorize the request.
> This enables support for scenarios where the API allows multiple, independent security schemes.
>
> An empty Security Requirement Object ({}) indicates anonymous access is supported."

🇻🇳 **Dịch**
> "Liệt kê các security scheme bắt buộc để thực thi operation này.
>
> Tên dùng cho mỗi property MUST hoặc khớp với một security scheme khai báo trong `securitySchemes` dưới Components Object, hoặc là URI của một Security Scheme Object."
>
> "Một Security Requirement Object MAY trỏ tới **nhiều** security scheme, trong trường hợp đó **TẤT CẢ các scheme MUST được thoả mãn** thì request mới được authorize.
> Điều này hỗ trợ các tình huống cần nhiều query parameter hoặc nhiều HTTP header để truyền thông tin bảo mật.
>
> Khi field `security` được định nghĩa trên OpenAPI Object hoặc Operation Object và chứa **nhiều** Security Requirement Object, thì **chỉ cần một** entry trong danh sách được thoả mãn là request được authorize.
> Điều này hỗ trợ các tình huống API cho phép nhiều security scheme độc lập nhau.
>
> Một Security Requirement Object rỗng (`{}`) nghĩa là **hỗ trợ truy cập ẩn danh**."

> [!warning] Hai tầng logic AND / OR rất dễ nhầm
> - Nhiều scheme **trong cùng một** Security Requirement Object → **AND** (phải thoả tất cả).
> - Nhiều Security Requirement Object **trong mảng `security`** → **OR** (chỉ cần thoả một).
>
> Nhớ sai chỗ này là mô tả sai hoàn toàn mô hình xác thực của API.

📖 **Nguyên văn** (§4.30.2 Security Requirement Object Examples)
> *4.30.2.1 Non-OAuth2 Security Requirement*
> ```yaml
> api_key: []
> ```
> *4.30.2.2 OAuth2 Security Requirement*
> ```yaml
> petstore_auth:
>   - write:pets
>   - read:pets
> ```
> *4.30.2.3 Optional OAuth2 Security*
> ```yaml
> security:
>   - {}
>   - petstore_auth:
>       - write:pets
>       - read:pets
> ```

🇻🇳 Ba ví dụ nguyên văn: scheme không phải OAuth2 thì mảng scope rỗng `[]`; OAuth2 thì liệt kê scope cần có; và mẫu cuối — `{}` đứng cùng `petstore_auth` — nghĩa là security **tuỳ chọn** (không có token vẫn gọi được).

> [!note] Đây là cửa ngõ sang phần Authentication
> Security Scheme Object chỉ **mô tả** cơ chế xác thực chứ không thực thi nó. Các khái niệm `apiKey`, HTTP Basic / Bearer, JWT, OAuth2 flow, OpenID Connect sẽ được học kỹ ở đợt B (Authentication) — ở đây chỉ cần nhận ra chúng xuất hiện trong contract dưới dạng nào.

---

## Design-first vs code-first

> [!note] Phần này là nhận định thực hành, KHÔNG trích từ spec
> Spec OAS v3.2.0 **không dùng** cặp thuật ngữ "design-first" / "code-first" và không khuyến nghị quy trình nào. Những gì spec nói chỉ là: OAD "can then be used by documentation generation tools... code generation tools... testing tools". Do đó phần dưới đây là tóm tắt hai lối làm việc phổ biến trong thực tế, ghi lại để bạn định vị, không phải nội dung chuẩn hoá.

- **Design-first**: viết file OpenAPI trước, thống nhất contract với các bên, rồi mới code server và client dựa trên nó.
- **Code-first**: viết code server trước, dùng annotation/decorator hoặc công cụ nội suy để **sinh ra** file OpenAPI từ code.

Điểm chung: chỉ nên có **một nguồn chân lý**. Nếu file spec được viết tay mà code lại sửa riêng, contract sẽ trôi khỏi thực tế và mọi thứ sinh ra từ nó (SDK, test, tài liệu) đều sai theo.

---

## 🔌 Liên hệ stack thực tế

> Phần này là ghi chú riêng, KHÔNG trích từ tài liệu spec.

- Một API viết bằng JavaScript thuần trên Cloud Run hay Cloud Functions vẫn có thể đi kèm một file `openapi.yaml` — spec ghi rõ nó là "language-agnostic interface", nên không phụ thuộc runtime nào.
- Spec khuyến nghị đặt tên file entry document: *"It is RECOMMENDED that the entry document of an OAD be named openapi.json or openapi.yaml."* — cứ theo đúng quy ước này để tool tự nhận ra.
- Vì `components.schemas` là JSON Schema Draft 2020-12, bạn có thể dùng cùng một schema cho hai việc: validate request body ở tầng API và validate document trước khi ghi vào Firestore — không cần định nghĩa hai lần.

---

## Liên kết

- Bài trước: [[07 - GraphQL]]
- Bài kế: [[09 - So sánh API Styles và REST Security]]
- [[05 - SOAP]] — WSDL: contract máy đọc được của thế giới SOAP, ý tưởng mà OpenAPI mang sang cho HTTP API
- [[02 - REST]] — kiến trúc REST không quy định định dạng contract; OpenAPI là lớp bổ sung nằm ngoài
- [[02 - What is HTTP]] — các HTTP method (`get`, `post`, `put`, `delete`...) mà Path Item Object dùng làm tên field, và HTTP status code trong Responses Object
- [[11 - NULL, Hàm String, Date và JSON]] — JSON là định dạng dữ liệu nền cho cả OpenAPI document lẫn Schema Object
- [[13 - SQL Injection và Parameterized Query]] — validate input theo schema là một lớp phòng thủ, nhưng không thay thế parameterized query

## Nguồn tham khảo

- OpenAPI Specification v3.2.0 (OpenAPI Initiative / The Linux Foundation) : https://spec.openapis.org/oas/latest.html
- Bản cố định phiên bản 3.2.0 : https://spec.openapis.org/oas/v3.2.0.html
- OpenAPI Initiative — trang chủ, mục "What is OpenAPI?" : https://www.openapis.org/
- OpenAPI Specification — bản render của Swagger/SmartBear (tài liệu bên thứ ba, không phải OAI) : https://swagger.io/specification/
