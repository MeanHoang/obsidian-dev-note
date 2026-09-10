# 06 — Using Namespaces

> Chapter 3, Section 3.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.6. Using Namespaces

> *"The Java language uses packages to avoid name clashes. Programmers can use the same name for different classes as long as they aren’t in the same package. XML has a similar namespace mechanism for element and attribute names."*

**Dịch:** Ngôn ngữ Java dùng **package** để **tránh đụng tên**. Lập trình viên dùng được **cùng một tên cho các class khác nhau** miễn là chúng **không ở cùng package**. XML có **cơ chế namespace tương tự** cho **tên element và attribute**.

> *"A namespace is identified by a Uniform Resource Identifier (URI), such as"*

```
http://www.w3.org/2001/XMLSchema
uuid:1c759aed-b748-475c-ab68-10679700c4f2
urn:com:books-r-us
```

> *"The HTTP URL form is the most common. Note that the URL is just used as an identifier string, not as a locator for a document. For example, the namespace identifiers"*

```
http://www.horstmann.com/corejava
http://www.horstmann.com/corejava/index.html
```

> *"denote different namespaces, even though a web server would serve the same document for both URLs."*

**Dịch:** Một **namespace được định danh bằng một URI (Uniform Resource Identifier)**. Dạng **HTTP URL là phổ biến nhất**. Lưu ý URL ở đây **chỉ được dùng như một chuỗi định danh**, **không phải để định vị một document**. Ví dụ hai namespace identifier trên **chỉ hai namespace khác nhau**, dù một web server sẽ **phục vụ cùng một document cho cả hai URL**.

> *"There need not be any document at a namespace URL—the XML parser doesn’t attempt to find anything at that location. However, as a help to programmers who encounter a possibly unfamiliar namespace, it is customary to place a document explaining the purpose of the namespace at the URL location. For example, if you point your browser to the namespace URL for the XML Schema namespace (http://www.w3.org/2001/XMLSchema), you will find a document describing the XML Schema standard."*

**Dịch:** **Không nhất thiết phải có document nào** tại một namespace URL — **XML parser không hề đi tìm gì** ở vị trí đó. Tuy nhiên, để **giúp lập trình viên** gặp phải một namespace lạ, người ta **theo thông lệ đặt một document giải thích mục đích của namespace** tại vị trí URL đó.

> *"Why use HTTP URLs for namespace identifiers? It is easy to ensure that they are unique. If you choose a real URL, the host part’s uniqueness is guaranteed by the domain name system. Your organization can then arrange for the uniqueness of the remainder of the URL. This is the same rationale that underlies the use of reversed domain names in Java package names."*

**Dịch:** Tại sao dùng **HTTP URL** làm namespace identifier? Vì **dễ đảm bảo chúng là duy nhất**. Nếu bạn chọn một URL thật, **tính duy nhất của phần host được domain name system bảo đảm**. Tổ chức của bạn tự lo **tính duy nhất của phần còn lại** trong URL. **Đây chính là lý lẽ nằm sau việc dùng tên miền viết ngược trong tên package của Java.**

---

## Khai báo namespace

> *"Of course, although long namespace identifiers are good for uniqueness, you don’t want to deal with long identifiers any more than you have to. In the Java programming language, you use the import mechanism to specify the long names of packages, and then use just the short class names. In XML, there is a similar mechanism:"*

```xml
<element xmlns="namespaceURI">
  children
</element>
```

> *"The element and its children are now part of the given namespace."*

**Dịch:** Dĩ nhiên, dù namespace identifier dài thì tốt cho tính duy nhất, bạn **không muốn phải xử lý identifier dài hơn mức cần thiết**. Trong Java, bạn dùng **cơ chế `import`** để chỉ định tên dài của package, rồi **chỉ dùng tên class ngắn**. XML có **cơ chế tương tự**: element **và các con của nó** giờ **thuộc namespace đã cho**.

> *"A child can provide its own namespace, for example:"*

```xml
<element xmlns="namespaceURI1">
  <child xmlns="namespaceURI2">
    grandchildren
  </child>
  more children
</element>
```

> *"Then the first child and the grandchildren are part of the second namespace."*

**Dịch:** Một **con có thể cung cấp namespace riêng**. Khi đó **con đầu tiên và các cháu** thuộc **namespace thứ hai**.

### Prefix

> *"This simple mechanism works well if you need only a single namespace or if the namespaces are naturally nested. Otherwise, you will want to use a second mechanism that has no analog in Java. You can have a prefix for a namespace—a short identifier that you choose for a particular document. Here is a typical example—the xsd prefix in an XML Schema file:"*

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:element name="config"/>
  . . .
</xsd:schema>
```

> *"The attribute"*

```
xmlns:prefix="namespaceURI"
```

> *"defines a namespace and a prefix. In our example, the prefix is the string xsd. Thus, xsd:schema really means schema in the namespace http://www.w3.org/2001/XMLSchema."*

**Dịch:** Cơ chế đơn giản đó chạy tốt nếu bạn **chỉ cần một namespace duy nhất** hoặc nếu **các namespace lồng nhau một cách tự nhiên**. Nếu không, bạn sẽ muốn dùng **cơ chế thứ hai — thứ không có tương đương trong Java**. Bạn có thể đặt một **prefix cho một namespace** — một **định danh ngắn** bạn tự chọn cho một document cụ thể. Attribute `xmlns:prefix="namespaceURI"` **định nghĩa một namespace và một prefix**. Ở ví dụ trên prefix là chuỗi `xsd`. Vậy **`xsd:schema` thực ra nghĩa là `schema` trong namespace `http://www.w3.org/2001/XMLSchema`**.

> **Note (sách):** *"Only child elements inherit the namespace of their parent. Attributes without an explicit prefix are never part of a namespace. Consider this contrived example:"*
>
> ```xml
> <configuration xmlns="http://www.horstmann.com/corejava"
>                xmlns:si="http://www.bipm.fr/enus/3_SI/si.html">
>   <size value="210" si:unit="mm"/>
>   . . .
> </configuration>
> ```
>
> *"In this example, the elements configuration and size are part of the namespace with URI http://www.horstmann.com/corejava. The attribute si:unit is part of the namespace with URI http://www.bipm.fr/enus/3_SI/si.html. However, the attribute value is not part of any namespace."*
>
> **Dịch:** **Chỉ child element mới thừa hưởng namespace của cha.** **Attribute không có prefix tường minh thì không bao giờ thuộc một namespace nào.** Ở ví dụ (dàn dựng) trên: element `configuration` và `size` **thuộc namespace** có URI `http://www.horstmann.com/corejava`. Attribute `si:unit` **thuộc namespace** có URI `http://www.bipm.fr/enus/3_SI/si.html`. Còn attribute **`value` thì không thuộc namespace nào cả**.

---

## Bật namespace trong parser

> *"You can control how the parser deals with namespaces. By default, the DOM parser of the Java XML library is not namespace-aware."*

> *"To turn on namespace handling, call the setNamespaceAware method of the DocumentBuilderFactory:"*

```java
factory.setNamespaceAware(true);
```

**Dịch:** Bạn **điều khiển được cách parser xử lý namespace**. **Mặc định, DOM parser của Java XML library KHÔNG namespace-aware.** Để bật xử lý namespace, gọi method `setNamespaceAware` của `DocumentBuilderFactory`.

> *"Now, all builders the factory produces support namespaces. Each node has three properties:"*
>
> *"• The qualified name, with a prefix, returned by getNodeName, getTagName, and so on*
> *• The namespace URI, returned by the getNamespaceURI method*
> *• The local name, without a prefix or a namespace, returned by the getLocalName method"*

**Dịch:** Giờ **mọi builder do factory tạo ra đều hỗ trợ namespace**. Mỗi node có **ba property**:

| Property | Trả về bởi | Nghĩa |
|---|---|---|
| **qualified name** | `getNodeName`, `getTagName`, … | tên **có prefix** |
| **namespace URI** | `getNamespaceURI` | URI của namespace |
| **local name** | `getLocalName` | tên **không có prefix và không có namespace** |

> *"Here is an example. Suppose the parser sees the following element:"*

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
```

> *"It then reports the following:"*
>
> *"• Qualified name = xsd:schema*
> *• Namespace URI = http://www.w3.org/2001/XMLSchema*
> *• Local name = schema"*

**Dịch:** Ví dụ: khi parser thấy element trên, nó báo cáo **qualified name = `xsd:schema`**, **namespace URI = `http://www.w3.org/2001/XMLSchema`**, **local name = `schema`**.

> **Note (sách):** *"If namespace awareness is turned off, getNamespaceURI and getLocalName return null."*
>
> **Dịch:** Nếu **namespace awareness bị tắt**, `getNamespaceURI` và `getLocalName` **trả về `null`**.

---

## API

### `org.w3c.dom.Node` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getLocalName()` | trả về **local name** (không có prefix), hoặc `null` nếu parser **không namespace-aware**. |
| `String getNamespaceURI()` | trả về **namespace URI**, hoặc `null` nếu node **không thuộc namespace nào** hoặc nếu parser **không namespace-aware**. |

### `javax.xml.parsers.DocumentBuilderFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isNamespaceAware()`<br>`void setNamespaceAware(boolean value)` | lấy hoặc set property **`namespaceAware`** của factory. Nếu đặt `true`, các parser factory này sinh ra sẽ là **namespace-aware**. |

---

## Bài kế tiếp

→ [[07 - Streaming Parsers]] — SAX parser (event callback) và StAX parser (pull parser).
