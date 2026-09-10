# Glossary — XML

> Thuật ngữ Chapter 3: XML. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Attribute**
Thành phần gắn thêm vào một XML element, dạng `<size unit="pt">36</size>`. Trong XML, **giá trị attribute bắt buộc nằm trong dấu nháy** và **mọi attribute đều phải có value**. Quy tắc ngón tay cái: attribute **chỉ nên dùng để điều chỉnh cách diễn giải một giá trị**, không phải để chỉ định giá trị. Attribute **không có prefix tường minh thì không bao giờ thuộc namespace nào**. Xem [[02 - The Structure of an XML Document#Element hay attribute?]] và [[06 - Using Namespaces]].

**ATTLIST**
Rule DTD mô tả **attribute hợp lệ** của element, cú pháp `<!ATTLIST element attribute type default>`. Type gồm `CDATA`, danh sách liệt kê, `NMTOKEN(S)`, `ID`, `IDREF(S)`, `ENTITY/ENTITIES`. Default gồm `#REQUIRED`, `#IMPLIED`, một giá trị `A`, hoặc `#FIXED A`. Xem [[04 - Validating XML Documents#Rule ATTLIST]].

## C

**CDATA (attribute type)**
Kiểu attribute nhận **chuỗi ký tự bất kỳ**. Giá trị attribute trước hết được **normalize**: parser xử lý character reference và entity reference rồi **thay whitespace bằng dấu cách**. **Không liên quan** tới section `<![CDATA[...]]>`. Xem [[04 - Validating XML Documents#CDATA, NMTOKEN, ID, IDREF, ENTITY]].

**CDATA Section**
Một dạng đặc biệt của character data, phân định bởi `<![CDATA[` và `]]>`. Dùng để nhét chuỗi chứa `< > &` mà **không bị hiểu thành markup**. **Không được chứa chuỗi `]]>`**. Sách cảnh báo: nó **quá thường xuyên bị dùng như cửa sau để buôn lậu legacy data** vào XML document. Xem [[02 - The Structure of an XML Document#CDATA section]].

**Character Reference**
Ký hiệu dạng `&#giáTrịThậpPhân;` hoặc `&#xgiáTrịHex;`. Ví dụ `é` viết được là `&#233;` hoặc `&#xE9;`. Xem [[02 - The Structure of an XML Document#Character reference]].

**Comment**
Phân định bởi `<!--` và `-->`. **Không nên chứa chuỗi `--`**, chỉ nên là thông tin cho người đọc, và **không bao giờ nên chứa lệnh ẩn** — lệnh thì dùng processing instruction. Xem [[02 - The Structure of an XML Document#Comment]].

**Complex Type**
Trong XML Schema: **mọi type không phải simple type**. Element có attribute hoặc có child element thì **phải có complex type**. Ghép bằng `xsd:sequence` (tương đương phép nối trong DTD) hoặc `xsd:choice` (tương đương toán tử `|`). Xem [[04 - Validating XML Documents#Simple type và complex type]].

**ContentHandler**
Interface SAX định nghĩa các **callback method** parser thực thi trong lúc parse: `startElement`/`endElement` (mỗi start tag/end tag), `characters` (mỗi khi gặp character data), `startDocument`/`endDocument` (mỗi cái một lần). Xem [[07 - Streaming Parsers#ContentHandler]].

## D

**DefaultHandler**
Class SAX định nghĩa **method rỗng (do-nothing)** cho bốn interface `ContentHandler`, `DTDHandler`, `EntityResolver`, `ErrorHandler`. Handler của bạn thuộc một **subclass** của nó. Xem [[07 - Streaming Parsers#Lấy SAX parser]].

**DOM (Document Object Model)**
**Tree parser**: đọc trọn vẹn XML document vào một cấu trúc cây trong bộ nhớ. Interface được **W3C chuẩn hoá** trong package `org.w3c.dom`. Object `Document` gồm các object implement interface `Node` và subinterface của nó. **Dễ dùng hơn** streaming parser cho phần lớn mục đích, nhưng **kém hiệu quả với document lớn**. Xem [[03 - Parsing an XML Document]].

**DTD (Document Type Definition)**
Tập rule giải thích **document phải được tạo thành thế nào**, bằng cách chỉ định child element và attribute hợp lệ cho từng element. **Không bắt buộc**, nhưng là cơ chế quan trọng đảm bảo tính đúng đắn. Có thể **nhúng trong document** (trong `DOCTYPE [...]`) hoặc **để bên ngoài** qua khai báo `SYSTEM`/`PUBLIC`. **Lợi ích hữu dụng nhất của validation là bỏ qua whitespace** trong nội dung element. Xem [[04 - Validating XML Documents#3.4.1. Document Type Definitions]].

## E

**ELEMENT (rule)**
Rule DTD chỉ định **element được có những con nào**, dùng regular expression: `E*`, `E+`, `E?`, `E1|E2`, `E1, E2`, `#PCDATA`, `ANY`, `EMPTY`. Xem [[04 - Validating XML Documents#Rule ELEMENT]].

**Element**
Đơn vị cơ bản của XML document, cùng với text là **"cơm ăn nước uống"**. Một element có thể chứa **child element, text, hoặc cả hai** — nhưng sách khuyên **chỉ chứa một trong hai**. Xem [[02 - The Structure of an XML Document#Root element]].

**Entity (DTD)**
**Chữ viết tắt được thay thế trong lúc parsing**, định nghĩa bằng `<!ENTITY back.label "Back">` và dùng qua entity reference `&back.label;`. Firefox dùng cơ chế này cho mô tả user interface — muốn **quốc tế hoá** thì chỉ cần đổi chuỗi trong định nghĩa entity. Xem [[04 - Validating XML Documents#Rule ENTITY]].

**Entity Reference**
Ký hiệu dạng `&name;`. Năm entity reference `&lt; &gt; &amp; &quot; &apos;` có **ý nghĩa định sẵn** (nhỏ hơn, lớn hơn, ampersand, nháy kép, apostrophe). Xem [[02 - The Structure of an XML Document#Entity reference]].

**EntityResolver**
Interface có method `resolveEntity`, dùng để **định vị entity được tham chiếu** trong XML document. Cần khi parse từ input stream, hoặc để **ánh xạ public identifier sang file cục bộ** nhằm tránh chờ tải DTD từ W3C. **Từ Java 9** dùng được **XML catalog** thay thế. Xem [[04 - Validating XML Documents#Entity resolver và XML catalog]].

**ErrorHandler**
Interface có ba method `warning`, `error`, `fatalError` nhận `SAXParseException`. **Nên cài một error handler mỗi khi dùng validation**. Cài bằng `builder.setErrorHandler(handler)`. Xem [[04 - Validating XML Documents#ErrorHandler]].

## H

**Header**
Dòng đầu XML document, dạng `<?xml version="1.0"?>` hoặc kèm `encoding="UTF-8"`. **Về mặt chặt chẽ là tuỳ chọn, nhưng rất được khuyến nghị**. Xem [[02 - The Structure of an XML Document#Header]].

## I

**ID / IDREF / IDREFS**
Kiểu attribute trong DTD. **`ID` là name token phải duy nhất trong document** — **parser kiểm tra tính duy nhất**. `IDREF` là **tham chiếu tới một `ID` tồn tại trong cùng document**, cũng được parser kiểm tra. `IDREFS` là danh sách ID reference cách nhau bằng whitespace. Xem [[04 - Validating XML Documents#CDATA, NMTOKEN, ID, IDREF, ENTITY]].

## J

**JAXP (Java API for XML Processing)**
Thư viện cho phép **cắm vào bất kỳ DOM parser nào** của các nhà cung cấp khác nhau. JDK cũng **kèm sẵn một DOM parser** dẫn xuất từ parser của Apache. Xem [[03 - Parsing an XML Document#Lấy DocumentBuilder]].

## L

**Local Name**
Property của node khi parser là **namespace-aware**: tên **không có prefix và không có namespace**, trả về bởi `getLocalName`. Nếu namespace awareness bị tắt thì trả về `null`. Xem [[06 - Using Namespaces#Bật namespace trong parser]].

**LSSerializer**
Interface dùng để **ghi DOM tree ra output** (cách thay thế cho XSLT). Lấy instance qua `DOMImplementationLS`; set `"format-pretty-print"` để có dấu cách và ngắt dòng; `writeToString(doc)` để chuyển thành chuỗi. Xem [[08 - Generating XML Documents#Cách 2 — LSSerializer]].

## M

**Mixed Content**
Trong XML specification: element chứa **hỗn hợp tag và text**. Sách khuyên **tránh** — tránh mixed content thì **việc parsing đơn giản đi**. Trong DTD, hễ element có thể chứa text thì **chỉ có hai trường hợp hợp lệ**: chỉ chứa text `(#PCDATA)`, hoặc tổ hợp bất kỳ của text và tag `(#PCDATA|E1|E2)*`. Xem [[02 - The Structure of an XML Document#Root element]] và [[04 - Validating XML Documents#Hạn chế với #PCDATA]].

## N

**NamedNodeMap**
Kiểu trả về của `getAttributes()`, chứa các object `Node` mô tả attribute. **Duyệt giống hệt `NodeList`** (`getLength` + `item`). Xem [[03 - Parsing an XML Document#Duyệt attribute]].

**Namespace**
Cơ chế XML **tránh đụng tên** cho element và attribute, tương tự package của Java. Định danh bằng một **URI** — thường là **HTTP URL**, nhưng **chỉ dùng như chuỗi định danh**, không phải để định vị document. Khai báo bằng `xmlns="namespaceURI"` hoặc `xmlns:prefix="namespaceURI"`. Xem [[06 - Using Namespaces]].

**NMTOKEN / NMTOKENS**
Kiểu attribute giống `CDATA`, nhưng **cấm phần lớn ký tự không phải chữ-số và whitespace bên trong**, và parser **cắt bỏ whitespace đầu cuối**. `NMTOKENS` là danh sách name token cách nhau bằng whitespace. Xem [[04 - Validating XML Documents#CDATA, NMTOKEN, ID, IDREF, ENTITY]].

**Node**
Interface gốc của cây DOM trong `org.w3c.dom`. Các method chính: `getChildNodes`, `getFirstChild`/`getLastChild`, `getNextSibling`/`getPreviousSibling`, `getParentNode`, `getAttributes`, `getNodeName`, `getNodeValue`. Xem [[03 - Parsing an XML Document#API]].

**NodeList**
Collection trả về bởi `getChildNodes`. **Được chuẩn hoá trước cả Java collections chuẩn**, nên có **giao thức truy cập khác**: `item(index)` và `getLength()`. Xem [[03 - Parsing an XML Document#getChildNodes và NodeList]].

**Nondeterministic Parsing**
Vấn đề khi DTD rule nhập nhằng, ví dụ `((x,y)|(x,z))` — khi parser thấy `x` nó **không biết chọn nhánh nào**. Viết lại dạng xác định là `(x,(y|z))`, nhưng **một số biểu thức không viết lại được**. Parser Java **không cảnh báo**, chỉ chọn nhánh khớp đầu tiên, khiến nó **từ chối một số input đúng**. Xem [[04 - Validating XML Documents#Hạn chế với #PCDATA]].

## P

**Parser**
Chương trình **đọc file**, **xác nhận file đúng định dạng**, **bẻ nó ra thành các element cấu thành**, và **cho lập trình viên truy cập những element đó**. Xem [[03 - Parsing an XML Document#3.3. Parsing an XML Document]].

**PCDATA**
Viết tắt của **parsed character data**. "Parsed" vì parser **diễn giải chuỗi text**, tìm `<` báo hiệu bắt đầu tag mới và `&` báo hiệu bắt đầu một entity. Xem [[04 - Validating XML Documents#Rule ELEMENT]].

**Prefix**
**Định danh ngắn bạn tự chọn** cho một namespace trong một document cụ thể, khai báo bằng `xmlns:prefix="namespaceURI"`. Ví dụ `xsd:schema` nghĩa là `schema` trong namespace `http://www.w3.org/2001/XMLSchema`. Cơ chế này **không có tương đương trong Java**. Xem [[06 - Using Namespaces#Prefix]].

**Processing Instruction**
Chỉ thị dành cho **application xử lý XML document**, phân định bởi `<?` và `?>`. Mọi XML document đều bắt đầu bằng processing instruction `<?xml version="1.0"?>`. Xem [[02 - The Structure of an XML Document#Processing instruction]].

**Property File**
Định dạng cấu hình cũ chứa **cặp name/value**, đọc được bằng class `Properties`. Hạn chế: **chỉ một hệ phân cấp phẳng** và **key phải duy nhất** — hai vấn đề mà XML giải quyết. Xem [[01 - Introducing XML#Xuất phát điểm: property file]].

**Pull Parser**
Cách gọi StAX parser: thay vì cài event handler, bạn **lặp qua các event** bằng `hasNext()`/`next()`. Xem [[07 - Streaming Parsers#3.7.2. Using the StAX Parser]].

## Q

**Qualified Name**
Property của node: tên **có prefix**, trả về bởi `getNodeName`, `getTagName`. Trong SAX là parameter `qname` dạng `prefix:localname`. Xem [[06 - Using Namespaces#Bật namespace trong parser]].

## R

**Result**
Interface đích của phép biến đổi XSLT. Java library cung cấp **ba class**: `DOMResult`, `SAXResult`, `StreamResult`. Xem [[09 - XSL Transformations#Result]].

**Root Element**
Element bao ngoài cùng trong thân XML document, có thể chứa element khác. Lấy bằng `doc.getDocumentElement()`. Trong DTD, **document type phải khớp tên root element**. Xem [[02 - The Structure of an XML Document#Root element]].

## S

**SAX (Simple API for XML)**
**Streaming parser dùng event callback**. Nó **báo cáo event trong lúc parse nhưng không lưu document** — việc dựng cấu trúc dữ liệu là của event handler. **DOM parser được xây dựng bên trên SAX parser.** Xem [[07 - Streaming Parsers#3.7.1. Using the SAX Parser]].

**SGML (Standard Generalized Markup Language)**
Tổ tiên chung của XML và HTML, có từ **thập niên 1970**. Được dùng thành công ở ngành cần bảo trì tài liệu khổng lồ — đặc biệt là **ngành hàng không**. **Chưa bao giờ phổ biến rộng** vì quá phức tạp, do có **hai mục tiêu xung đột**: đảm bảo document đúng quy tắc, đồng thời cho phép shortcut giảm gõ phím. **XML là phiên bản đơn giản hoá của SGML cho Internet.** Xem [[01 - Introducing XML#Nguồn gốc: SGML]].

**Simple Type**
Trong XML Schema: **một chuỗi**, có thể kèm ràng buộc về nội dung. Element có simple type thì **không được có attribute và không được có child element**. **Attribute thì luôn có simple type.** Built-in gồm `xsd:string`, `xsd:int`, `xsd:boolean`. Xem [[04 - Validating XML Documents#Simple type và complex type]].

**Source**
Interface nguồn của phép biến đổi XSLT. Có **bốn class implement**: `DOMSource`, `SAXSource`, `StAXSource`, `StreamSource`. Xem [[09 - XSL Transformations#Source]].

**StAX**
**Streaming parser** thêm vào **Java 6**, là **pull parser** cung cấp iterator qua các parsing event. **Tiện hơn SAX một chút** vì không phải lo xử lý event. **Mặc định namespace processing được BẬT** (khác DOM và SAX). Cũng dùng để **ghi XML trực tiếp** qua `XMLStreamWriter`. Xem [[07 - Streaming Parsers#3.7.2. Using the StAX Parser]] và [[08 - Generating XML Documents#3.8.4. Writing an XML Document with StAX]].

**SVG (Scalable Vector Graphics)**
**Định dạng XML mô tả đồ hoạ phức tạp theo cách độc lập thiết bị**. Xem bằng bất kỳ trình duyệt hiện đại nào. Sách lưu ý SVG **dùng attribute rất nhiều**, một số attribute khá phức tạp (như `path d="M 100 100 L 300 100 z"`) — dấu hiệu người thiết kế **không mấy tin tưởng vào việc dùng XML cho structured data**. Xem [[08 - Generating XML Documents#3.8.5. An Example: Generating an SVG File]].

**SYSTEM (declaration)**
Cách trỏ tới **DTD nằm ngoài document**, ví dụ `<!DOCTYPE config SYSTEM "config.dtd">`. Nếu dùng **URL tương đối**, phải đưa cho parser object `File` hoặc `URL`, **không phải `InputStream`**. Xem [[04 - Validating XML Documents#Ba cách cung cấp DTD]].

## T

**Text Node**
Node kiểu `Text` chứa chuỗi text bên trong element. Lấy chuỗi bằng `getData()`, và **nên gọi `trim()`** vì parser gộp cả line break lẫn space vào data. Xem [[03 - Parsing an XML Document#Lấy text bên trong element]].

**Transformer**
Object thực hiện phép biến đổi XSLT: `t.transform(source, result)`. `TransformerFactory.newTransformer()` không tham số cho ra **phép biến đổi đồng nhất (identity / do-nothing)** — dùng để **ghi DOM tree ra output**. Xem [[08 - Generating XML Documents#3.8.3. Writing Documents]] và [[09 - XSL Transformations#XSLT trên nền tảng Java]].

## V

**Validation**
Việc parser **tự động kiểm chứng document có cấu trúc đúng hay không**, dựa trên DTD hoặc XML Schema. Bật bằng `factory.setValidating(true)`. **Lợi ích hữu dụng nhất là bỏ qua whitespace** trong nội dung element (`setIgnoringElementContentWhitespace(true)`), nhờ đó **truy cập được con theo index** thay vì viết vòng lặp tẻ nhạt. Xem [[04 - Validating XML Documents#Bật validation]].

## X

**XHTML**
**Công thức hoá XML cho HTML phiên bản 4 và 5** — một phương ngữ HTML **đúng chuẩn XML**. Phần lớn trang do W3C soạn được viết bằng XHTML. Xem [[01 - Introducing XML#Khác biệt giữa XML và HTML]] và [[07 - Streaming Parsers#3.7.1. Using the SAX Parser]].

**XML Catalog**
Cơ chế **từ Java 9** để quản lý ánh xạ **public identifier → file cục bộ**, thay cho việc tự viết `EntityResolver`. Cài bằng `CatalogManager.catalogResolver(...)`, hoặc chỉ định trên command line bằng system property **`javax.xml.catalog.files`** (các file URL tuyệt đối cách nhau bằng dấu chấm phẩy). Xem [[04 - Validating XML Documents#Entity resolver và XML catalog]].

**XML Schema**
Ngôn ngữ mô tả cấu trúc document, **phức tạp hơn kha khá so với DTD**. Diễn tả được **điều kiện validation tinh vi hơn** DTD (ví dụ element `size` phải chứa số nguyên). **Bản thân cú pháp XML Schema dùng XML** — lợi thế nếu cần xử lý chính các file schema. Parse file có schema cần **bật namespace** và **set `JAXP_SCHEMA_LANGUAGE`**. Xem [[04 - Validating XML Documents#3.4.2. XML Schema]].

**XPath**
Ngôn ngữ **định vị node** trong XML document, đơn giản hơn nhiều so với điều hướng DOM thuần. Cú pháp: `/html/head/title/text()`, `[]` chọn element theo index (**bắt đầu từ 1**), `@` lấy giá trị attribute, có function như `count()`, `position()`. Đánh giá bằng `XPathFactory` → `XPath` → `evaluate` / `evaluateExpression`. Xem [[05 - Locating Information with XPath]].

**XPathNodes**
Class kết quả (**Java 9**) giống `NodeList` nhưng **extend interface `Iterable`**, cho phép dùng **enhanced for loop**. Xem [[05 - Locating Information with XPath#Kết quả là nhiều node]].

**XSLT (XSL Transformations)**
Cơ chế **chỉ định rule biến đổi XML document sang định dạng khác** — plain text, XHTML, hoặc định dạng XML khác. Bạn cung cấp một **stylesheet**; một **XSLT processor** đọc document + stylesheet và sinh output. Đổi stylesheet là **đổi hoàn toàn output** mà không đụng tới data. Xem [[09 - XSL Transformations]].

**xsl:template**
Khối rule trong stylesheet, khớp qua **biểu thức XPath** ở attribute `match`. Nếu **không template nào khớp**: **text node** thì mặc định đưa nội dung vào output, **element** thì mặc định không tạo output nhưng vẫn xử lý các con. Xem [[09 - XSL Transformations#Template]].

**xsl:value-of**
Câu lệnh **tính giá trị chuỗi của một node set** được chỉ định bởi XPath ở attribute `select` (tương đối so với node đang xử lý). Giá trị chuỗi: **attribute node** = giá trị của nó · **text node** = nội dung · **element node** = nối giá trị chuỗi các node con (**không gồm attribute**). Xem [[09 - XSL Transformations#xsl:value-of — sao chép giá trị attribute]].
