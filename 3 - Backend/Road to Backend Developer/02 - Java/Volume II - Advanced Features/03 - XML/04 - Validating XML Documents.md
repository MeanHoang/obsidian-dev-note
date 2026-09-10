# 04 — Validating XML Documents

> Chapter 3, Section 3.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.4. Validating XML Documents

> *"In the previous section, you saw how to traverse the tree structure of a DOM document. However, with that approach, you’ll have to do quite a bit of tedious programming and error checking. It’s not just having to deal with whitespace between elements; you will also need to check whether the document contains the nodes that you expect. For example, suppose you are reading this element:"*

```xml
<font>
  <name>Helvetica</name>
  <size>36</size>
</font>
```

> *"You get the first child. Oops . . . it is a text node containing whitespace "\n ". You skip text nodes and find the first element node. Then, you need to check that its tag name is "name" and that it has one child node of type Text. You move on to the next nonwhitespace child and make the same check. What if the author of the document switched the order of the children or added another child element? It is tedious to code all this error checking—but reckless to skip the checks."*

**Dịch:** Ở [[03 - Parsing an XML Document]] bạn đã thấy cách duyệt cấu trúc cây của một DOM document. Nhưng với cách đó bạn phải viết **khá nhiều code tẻ nhạt và kiểm tra lỗi**. Không chỉ là chuyện xử lý **whitespace giữa các element**; bạn còn phải kiểm tra document **có chứa đúng các node bạn mong đợi hay không**. Lấy con đầu tiên — ối, nó là **text node chứa whitespace `"\n "`**. Bạn bỏ qua text node và tìm được element node đầu tiên. Rồi bạn phải kiểm tra tag name của nó là `"name"` và nó có **một node con kiểu `Text`**. Rồi chuyển sang con kế tiếp không phải whitespace và kiểm tra y như vậy. Nếu tác giả document **đổi thứ tự các con** hoặc **thêm một child element** khác thì sao? Code hết đống kiểm tra lỗi này thì **tẻ nhạt** — mà **bỏ qua kiểm tra thì liều lĩnh**.

> *"Fortunately, one of the major benefits of an XML parser is that it can automatically verify that a document has the correct structure. That makes parsing much simpler. For example, if you know that the font fragment has passed validation, you can simply get the two grandchildren, cast them as Text nodes, and get the text data, without any further checking."*

**Dịch:** May thay, **một trong những lợi ích lớn nhất của XML parser** là nó **tự động kiểm chứng document có cấu trúc đúng hay không**. Điều đó làm việc parsing **đơn giản hơn nhiều**. Nếu bạn biết đoạn `font` đã **qua được validation**, bạn chỉ việc lấy hai node cháu, **cast thành `Text` node**, rồi lấy text data — **không phải kiểm tra gì thêm**.

### DTD hay XML Schema

> *"To specify the document structure, you can supply a DTD or an XML Schema definition. A DTD or schema contains rules that explain how a document should be formed, by specifying the legal child elements and attributes for each element. For example, a DTD might contain a rule:"*

```
<!ELEMENT font (name,size)>
```

> *"This rule expresses that a font element must always have two children, which are name and size elements. The XML Schema language expresses the same constraint as"*

```xml
<xsd:element name="font">
  <xsd:sequence>
    <xsd:element name="name" type="xsd:string"/>
    <xsd:element name="size" type="xsd:int"/>
  </xsd:sequence>
</xsd:element>
```

**Dịch:** Để **chỉ định cấu trúc document**, bạn cung cấp một **DTD** hoặc một **XML Schema definition**. DTD hay schema chứa **các rule giải thích document phải được tạo thành thế nào**, bằng cách chỉ định **child element và attribute hợp lệ** cho từng element. Rule DTD trên nói rằng element `font` **luôn phải có hai con** là element `name` và `size`. Ngôn ngữ XML Schema diễn tả **cùng ràng buộc đó** như đoạn dưới.

> *"XML Schema can express more sophisticated validation conditions (such as the fact that the size element must contain an integer) than can DTDs. Unlike the DTD syntax, the XML Schema syntax itself uses XML, which is a benefit if you need to process schema files."*

**Dịch:** XML Schema diễn tả được **điều kiện validation tinh vi hơn** DTD (ví dụ **element `size` phải chứa một số nguyên**). Khác với cú pháp DTD, **bản thân cú pháp XML Schema dùng XML** — đó là lợi thế nếu bạn cần **xử lý chính các file schema**.

---

## 3.4.1. Document Type Definitions

### Ba cách cung cấp DTD

> *"There are several methods for supplying a DTD. You can include a DTD in an XML document like this:"*

```xml
<?xml version="1.0"?>
<!DOCTYPE config [
  <!ELEMENT config . . .>
  more rules
  . . .
]>
<config>
  . . .
</config>
```

> *"As you can see, the rules are included inside a DOCTYPE declaration, in a block delimited by [. . .]. The document type must match the name of the root element, such as config in our example."*

**Dịch:** Có vài cách cung cấp DTD. Bạn **nhúng DTD ngay trong XML document**: các rule nằm trong khai báo `DOCTYPE`, trong một block phân định bởi `[. . .]`. **Document type phải khớp với tên root element** — ở ví dụ này là `config`.

> *"Supplying a DTD inside an XML document is somewhat uncommon because DTDs can grow lengthy. It makes more sense to store the DTD externally. The SYSTEM declaration can be used for that purpose. Specify a URL that contains the DTD, for example:"*

```xml
<!DOCTYPE config SYSTEM "config.dtd">
```

> *"or"*

```xml
<!DOCTYPE config SYSTEM "http://myserver.com/config.dtd">
```

**Dịch:** Nhúng DTD trong XML document là chuyện **khá hiếm** vì DTD có thể **dài ra**. Hợp lý hơn là **lưu DTD bên ngoài**. Khai báo **`SYSTEM`** dùng cho mục đích đó: chỉ định một **URL chứa DTD**.

> **Caution (sách):** *"If you use a relative URL for the DTD (such as "config.dtd"), give the parser a File or URL object, not an InputStream. If you must parse from an input stream, supply an entity resolver (see the following note)."*
>
> **Dịch:** Nếu bạn dùng **URL tương đối** cho DTD (như `"config.dtd"`), hãy đưa cho parser một object **`File` hoặc `URL`**, **không phải `InputStream`**. Nếu buộc phải parse từ input stream thì **cung cấp một entity resolver**.

> *"The mechanism for identifying well-known DTDs has its origin in SGML. Here is an example:"*

```xml
<!DOCTYPE web-app
  PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.2//EN"
  "http://java.sun.com/j2ee/dtds/web-app_2_2.dtd">
```

> *"If an XML processor knows how to locate the DTD with the public identifier, it need not go to the URL."*

**Dịch:** Cơ chế **định danh các DTD nổi tiếng** có nguồn gốc từ SGML. Nếu một XML processor **biết cách định vị DTD bằng public identifier**, nó **không cần đi tới URL**.

### Entity resolver và XML catalog

> **Note (sách):** *"The system identifier URL of a DTD may not actually be working, or be purposefully slowed down. An example for the latter is the system identifier of the XHTML 1.0 Strict DTD, http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd. If you parse an XHTML file, it may take a minute or two for the DTD to be served. The remedy is to use an entity resolver that maps public identifiers to local files. Prior to Java 9, you had to provide an object of a class that implements the EntityResolver interface and provides a resolveEntity method."*
>
> *"Nowadays, you can use XML catalogs to manage the mapping. Provide one or more catalog files of the form"*
>
> ```xml
> <?xml version="1.0"?>
> <!DOCTYPE catalog PUBLIC "-//OASIS//DTD XML Catalogs V1.0//EN"
>   "http://www.oasis-open.org/committees/entity/release/1.0/catalog.dtd">
> <catalog xmlns="urn:oasis:names:tc:entity:xmlns:xml:catalog" prefer="public">
>   <public publicId=". . ." uri=". . ."/>
>   . . .
> </catalog>
> ```
>
> *"Then construct and install a resolver like this:"*
>
> ```java
> builder.setEntityResolver(CatalogManager.catalogResolver(
>     CatalogFeatures.defaults(),
>     Paths.get("catalog.xml").toAbsolutePath().toUri()));
> ```
>
> *"See Listing 3.6 for a complete example."*
>
> *"Instead of setting the catalog file locations in your program, you can specify them on the command line with the javax.xml.catalog.files system property. Provide absolute file URLs separated by semicolons."*
>
> **Dịch:** URL system identifier của một DTD **có thể không chạy được**, hoặc **bị cố tình làm chậm**. Ví dụ cho trường hợp sau là system identifier của **XHTML 1.0 Strict DTD**. Nếu bạn parse một file XHTML, có khi **mất một hai phút** DTD mới được phục vụ. Cách chữa là dùng **entity resolver ánh xạ public identifier sang file cục bộ**. **Trước Java 9**, bạn phải cung cấp object của một class **implement interface `EntityResolver`** và có method `resolveEntity`. **Ngày nay** bạn dùng được **XML catalog** để quản lý ánh xạ. Thay vì set vị trí file catalog trong chương trình, bạn chỉ định chúng **trên command line** bằng system property **`javax.xml.catalog.files`**, đưa vào các **file URL tuyệt đối cách nhau bằng dấu chấm phẩy**.

---

### Rule ELEMENT

> *"Now that you have seen how the parser locates the DTD, let us consider the various kinds of rules."*

> *"The ELEMENT rule specifies what children an element can have. Use a regular expression, made up of the components shown in Table 3.1."*

**Dịch:** Rule **`ELEMENT`** chỉ định **element được có những con nào**. Dùng một **regular expression** gồm các thành phần ở Table 3.1.

**Table 3.1 — Rules for Element Content**

| Rule | Meaning | Dịch |
|---|---|---|
| `E*` | 0 or more occurrences of E | 0 hoặc nhiều lần xuất hiện của E |
| `E+` | 1 or more occurrences of E | 1 hoặc nhiều lần xuất hiện của E |
| `E?` | 0 or 1 occurrences of E | 0 hoặc 1 lần xuất hiện của E |
| `E1\|E2\|. . .\|En` | One of E1, E2, . . ., En | **Một trong** E1, E2, …, En |
| `E1, E2, . . ., En` | E1 followed by E2, . . ., En | E1 **theo sau bởi** E2, …, En |
| `#PCDATA` | Text | Text |
| `(#PCDATA\|E1\|E2\|. . .\|En)*` | 0 or more occurrences of text and E1, E2, . . ., En in any order (mixed content) | 0 hoặc nhiều lần xuất hiện của text và E1, E2, …, En **theo thứ tự bất kỳ** (mixed content) |
| `ANY` | Any children allowed | Cho phép **mọi con** |
| `EMPTY` | No children allowed | **Không cho con nào** |

> *"Here are several simple but typical examples. The following rule states that a menu element contains 0 or more item elements:"*

```
<!ELEMENT menu (item)*>
```

> *"This set of rules states that a font is described by a name followed by a size, each of which contain text:"*

```
<!ELEMENT font (name,size)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT size (#PCDATA)>
```

**Dịch:** Rule đầu nói element `menu` chứa **0 hoặc nhiều element `item`**. Bộ rule sau nói một `font` được mô tả bởi một `name` **theo sau bởi** một `size`, **mỗi cái đều chứa text**.

> *"The abbreviation PCDATA denotes parsed character data. It is “parsed” because the parser interprets the text string, looking for < characters that denote the start of a new tag, or & characters that denote the start of an entity."*

**Dịch:** Viết tắt **`PCDATA`** nghĩa là **parsed character data**. Nó "parsed" vì parser **diễn giải chuỗi text**, tìm ký tự `<` báo hiệu **bắt đầu một tag mới**, hoặc ký tự `&` báo hiệu **bắt đầu một entity**.

> *"An element specification can contain regular expressions that are nested and complex. For example, here is a rule that describes the makeup of a chapter in a book:"*

```
<!ELEMENT chapter (intro,(heading,(para|image|table|note)+)+)
```

> *"Each chapter starts with an introduction, which is followed by one or more sections consisting of a heading and one or more paragraphs, images, tables, or notes."*

**Dịch:** Đặc tả element có thể chứa **regular expression lồng nhau và phức tạp**. Rule trên: mỗi `chapter` bắt đầu bằng một `intro`, theo sau là **một hoặc nhiều section** gồm một `heading` và **một hoặc nhiều** `para`, `image`, `table` hoặc `note`.

### Hạn chế với #PCDATA

> *"However, in one common case you can’t define the rules to be as flexible as you might like. Whenever an element can contain text, there are only two valid cases. Either the element contains nothing but text, such as"*

```
<!ELEMENT name (#PCDATA)>
```

> *"or the element contains any combination of text and tags in any order, such as"*

```
<!ELEMENT para (#PCDATA|em|strong|code)*>
```

> *"It is not legal to specify any other types of rules that contain #PCDATA. For example, the following is illegal:"*

```
<!ELEMENT captionedImage (image,#PCDATA)>
```

> *"You have to rewrite such a rule, either by introducing another caption element or by allowing any combination of image elements and text."*

**Dịch:** Có **một trường hợp phổ biến** mà bạn **không định nghĩa rule linh hoạt như ý được**. Hễ element **có thể chứa text**, chỉ có **hai trường hợp hợp lệ**: hoặc element **chỉ chứa text**, hoặc element chứa **tổ hợp bất kỳ của text và tag theo thứ tự bất kỳ**. **Không hợp lệ** khi chỉ định bất kỳ dạng rule nào khác có chứa `#PCDATA`. Ví dụ `<!ELEMENT captionedImage (image,#PCDATA)>` là **bất hợp lệ**. Bạn phải viết lại rule đó, hoặc bằng cách **giới thiệu thêm element `caption`**, hoặc bằng cách cho phép **tổ hợp bất kỳ giữa element `image` và text**.

> *"This restriction simplifies the job of the XML parser when parsing mixed content (a mixture of tags and text). Since you lose some control by allowing mixed content, it is best to design DTDs so that all elements contain either other elements or nothing but text."*

**Dịch:** Hạn chế này **làm nhẹ việc của XML parser** khi parse **mixed content** (hỗn hợp tag và text). Vì cho phép mixed content thì **bạn mất một phần kiểm soát**, nên tốt nhất là **thiết kế DTD sao cho mọi element chỉ chứa element khác, hoặc chỉ chứa text**.

> **Note (sách):** *"Actually, it isn’t quite true that you can specify arbitrary regular expressions of elements in a DTD rule. An XML parser may reject certain complex rule sets that lead to nondeterministic parsing. For example, a regular expression ((x,y)|(x,z)) is nondeterministic. When the parser sees x, it doesn’t know which of the two alternatives to take. This expression can be rewritten in a deterministic form as (x,(y|z)). However, some expressions can’t be reformulated, such as ((x,y)*|x?). The parser in the Java XML library gives no warnings when presented with an ambiguous DTD; it simply picks the first matching alternative when parsing, which causes it to reject some correct inputs. The parser is well within its rights to do so because the XML standard allows a parser to assume that the DTD is unambiguous."*
>
> **Dịch:** Thực ra **không hoàn toàn đúng** rằng bạn chỉ định được regular expression tuỳ ý trong một DTD rule. XML parser **có thể từ chối** một số bộ rule phức tạp dẫn tới **parsing bất định (nondeterministic)**. Ví dụ `((x,y)|(x,z))` là bất định: khi parser thấy `x`, nó **không biết chọn nhánh nào**. Biểu thức này viết lại được ở dạng **xác định** là `(x,(y|z))`. Tuy nhiên **một số biểu thức không viết lại được**, như `((x,y)*|x?)`. Parser trong Java XML library **không cảnh báo gì** khi gặp DTD nhập nhằng; nó **chỉ đơn giản chọn nhánh khớp đầu tiên** khi parse, khiến nó **từ chối một số input đúng**. Parser hoàn toàn có quyền làm vậy vì **XML standard cho phép parser giả định DTD là không nhập nhằng**.

---

### Rule ATTLIST

> *"You can also specify rules to describe the legal attributes of elements. The general syntax is"*

```
<!ATTLIST element attribute type default>
```

**Dịch:** Bạn cũng chỉ định được rule mô tả **attribute hợp lệ** của element, theo cú pháp tổng quát trên.

**Table 3.2 — Attribute Types**

| Type | Meaning | Dịch |
|---|---|---|
| `CDATA` | Any character string | Chuỗi ký tự bất kỳ |
| `(A1\|A2\| . . . \|An)` | One of the string attributes A1, A2, . . ., An | **Một trong** các string attribute A1, A2, …, An |
| `NMTOKEN`, `NMTOKENS` | One or more name tokens | Một hoặc nhiều **name token** |
| `ID` | A unique ID | Một **ID duy nhất** |
| `IDREF`, `IDREFS` | One or more references to a unique ID | Một hoặc nhiều **tham chiếu** tới một ID duy nhất |
| `ENTITY`, `ENTITIES` | One or more unparsed entities | Một hoặc nhiều **unparsed entity** |

**Table 3.3 — Attribute Defaults**

| Default | Meaning | Dịch |
|---|---|---|
| `#REQUIRED` | Attribute is required. | Attribute là **bắt buộc**. |
| `#IMPLIED` | Attribute is optional. | Attribute là **tuỳ chọn**. |
| `A` | Attribute is optional; the parser reports it to be A if it is not specified. | Attribute là tuỳ chọn; nếu không chỉ định thì parser **báo giá trị là `A`**. |
| `#FIXED A` | The attribute must either be unspecified or A; in either case, the parser reports it to be A. | Attribute **hoặc không được chỉ định, hoặc phải là `A`**; trong cả hai trường hợp parser **báo giá trị là `A`**. |

> *"Here are two typical attribute specifications:"*

```
<!ATTLIST font style (plain|bold|italic|bold-italic) "plain">
<!ATTLIST size unit CDATA #IMPLIED>
```

> *"The first specification describes the style attribute of a font element. There are four legal attribute values, and the default value is plain. The second specification expresses that the unit attribute of the size element can contain any character data sequence."*

**Dịch:** Đặc tả đầu mô tả attribute `style` của element `font`: có **bốn giá trị hợp lệ**, giá trị **mặc định là `plain`**. Đặc tả sau nói attribute `unit` của element `size` chứa được **chuỗi character data bất kỳ**.

> **Note (sách):** *"We generally recommend the use of elements, not attributes, to describe data. Thus, the font style should be a separate element, such as `<font><style>plain</style>. . .</font>`. However, attributes have an undeniable advantage for enumerated types because the parser can verify that the values are legal. For example, if the font style is an attribute, the parser checks that it is one of the four allowed values, and supplies a default if no value was given."*
>
> **Dịch:** Sách nhìn chung **khuyến nghị dùng element chứ không phải attribute** để mô tả data. Nhưng attribute có **một lợi thế không chối cãi được với kiểu liệt kê (enumerated type)**, vì **parser kiểm chứng được giá trị có hợp lệ hay không**. Ví dụ, nếu font style là attribute, parser sẽ **kiểm tra nó là một trong bốn giá trị được phép**, và **cấp giá trị mặc định** nếu không có giá trị nào được đưa vào.

### CDATA, NMTOKEN, ID, IDREF, ENTITY

> *"The handling of a CDATA attribute value is subtly different from the processing of #PCDATA that you have seen before, and quite unrelated to the `<![CDATA[. . .]]>` sections. The attribute value is first normalized—that is, the parser processes character and entity references (such as &#233; or &lt;) and replaces whitespace with spaces."*

**Dịch:** Cách xử lý giá trị attribute **`CDATA`** **hơi khác một cách tinh tế** so với xử lý `#PCDATA` bạn đã thấy, và **hoàn toàn không liên quan** tới các section `<![CDATA[. . .]]>`. Giá trị attribute trước hết được **normalize** — nghĩa là parser **xử lý character reference và entity reference** (như `&#233;` hay `&lt;`) và **thay whitespace bằng dấu cách**.

> *"An NMTOKEN (or name token) is similar to CDATA, but most nonalphanumeric characters and internal whitespace are disallowed, and the parser removes leading and trailing whitespace. NMTOKENS is a whitespace-separated list of name tokens."*

**Dịch:** **`NMTOKEN`** (name token) giống `CDATA`, nhưng **phần lớn ký tự không phải chữ-số và whitespace bên trong đều bị cấm**, và parser **cắt bỏ whitespace đầu và cuối**. **`NMTOKENS`** là **danh sách name token cách nhau bằng whitespace**.

> *"The ID construct is quite useful. An ID is a name token that must be unique in the document—the parser checks the uniqueness. You will see an application in the next sample program. An IDREF is a reference to an ID that exists in the same document, which the parser also checks. IDREFS is a whitespace-separated list of ID references."*

**Dịch:** Cấu trúc **`ID`** khá hữu ích. Một `ID` là **name token phải duy nhất trong document** — **parser kiểm tra tính duy nhất**. **`IDREF`** là **tham chiếu tới một `ID` tồn tại trong cùng document**, cũng được parser kiểm tra. **`IDREFS`** là danh sách ID reference cách nhau bằng whitespace.

> *"An ENTITY attribute value refers to an “unparsed external entity.” That is a holdover from SGML that is rarely used in practice. The annotated XML specification at www.xml.com/axml/axml.html has an example."*

**Dịch:** Giá trị attribute **`ENTITY`** trỏ tới một **"unparsed external entity"**. Đó là **di sản từ SGML**, **hiếm khi dùng trong thực tế**.

### Rule ENTITY

> *"A DTD can also define entities, or abbreviations that are replaced during parsing. You can find a good example for the use of entities in the user interface descriptions of the Firefox browser. Those descriptions are formatted in XML and contain entity definitions such as"*

```
<!ENTITY back.label "Back">
```

> *"Elsewhere, text can contain an entity reference, for example:"*

```xml
<menuitem label="&back.label;"/>
```

> *"The parser replaces the entity reference with the replacement string. To internationalize the application, only the string in the entity definition needs to be changed. Other uses of entities are more complex and less common; look at the XML specification for details."*

**Dịch:** DTD cũng định nghĩa được **entity** — các **chữ viết tắt được thay thế trong lúc parsing**. Một ví dụ hay là các mô tả **user interface của trình duyệt Firefox**: chúng được định dạng bằng XML và chứa định nghĩa entity như trên. Ở chỗ khác, text chứa được **entity reference**. Parser **thay entity reference bằng chuỗi thay thế**. Muốn **quốc tế hoá** application thì **chỉ cần đổi chuỗi trong định nghĩa entity**. Các cách dùng entity khác **phức tạp hơn và ít phổ biến hơn**.

---

### Bật validation

> *"This concludes the introduction to DTDs. Now that you have seen how to use DTDs, you can configure your parser to take advantage of them."*

> *"First, tell the document builder factory to turn on validation:"*

```java
factory.setValidating(true);
```

> *"All builders produced by this factory validate their input against a DTD. The most useful benefit of validation is ignoring whitespace in element content. For example, consider the XML fragment"*

```xml
<font>
  <name>Helvetica</name>
  <size>36</size>
</font>
```

> *"A nonvalidating parser reports the whitespace between the font, name, and size elements because it has no way of knowing if the children of font are"*

```
(name,size)
(#PCDATA,name,size)*
```

> *"or perhaps"*

```
ANY
```

> *"Once the DTD specifies that the children are (name,size), the parser knows that the whitespace between them is not text. Call"*

```java
factory.setIgnoringElementContentWhitespace(true);
```

> *"and the builder will stop reporting the whitespace in text nodes."*

**Dịch:** Trước tiên, **bảo document builder factory bật validation**. Mọi builder do factory này tạo ra sẽ **validate input của chúng theo một DTD**. **Lợi ích hữu dụng nhất của validation là bỏ qua whitespace trong nội dung element.** Một parser **không validating** sẽ **báo cáo whitespace** giữa các element `font`, `name`, `size`, vì nó **không có cách nào biết** các con của `font` là `(name,size)`, hay `(#PCDATA,name,size)*`, hay có khi là `ANY`. Một khi DTD chỉ định các con là `(name,size)`, parser **biết whitespace giữa chúng không phải text**. Gọi `setIgnoringElementContentWhitespace(true)` thì builder **ngừng báo cáo whitespace trong text node**.

> *"That means you can now rely on the fact that a font node has two children. You no longer need to program a tedious loop:"*

```java
for (int i = 0; i < children.getLength(); i++)
{
    Node child = children.item(i);
    if (child instanceof Element)
    {
        var childElement = (Element) child;
        if (childElement.getTagName().equals("name")) . . .;
        else if (childElement.getTagName().equals("size")) . . .;
    }
}
```

> *"Instead, you can simply access the first and second child:"*

```java
var nameElement = (Element) children.item(0);
var sizeElement = (Element) children.item(1);
```

> *"That is why DTDs are so useful. You don’t overload your program with rule-checking code—the parser has already done that work by the time you get the document."*

**Dịch:** Nghĩa là giờ bạn **tin cậy được rằng node `font` có đúng hai con**. Bạn **không còn phải viết vòng lặp tẻ nhạt**; chỉ việc **truy cập con thứ nhất và thứ hai**. **Đó là lý do DTD hữu ích tới vậy**: bạn **không nhồi chương trình đầy code kiểm tra rule** — parser **đã làm xong việc đó** trước khi bạn nhận được document.

### ErrorHandler

> *"When the parser reports an error, your application will want to do something about it—log it, show it to the user, or throw an exception to abandon the parsing. Therefore, you should install an error handler whenever you use validation. Supply an object that implements the ErrorHandler interface. That interface has three methods:"*

```java
void warning(SAXParseException exception)
void error(SAXParseException exception)
void fatalError(SAXParseException exception)
```

> *"Install the error handler with the setErrorHandler method of the DocumentBuilder class:"*

```java
builder.setErrorHandler(handler);
```

**Dịch:** Khi parser báo lỗi, application của bạn sẽ muốn **làm gì đó** với nó — **log lại**, **hiện cho user**, hoặc **throw exception để bỏ dở việc parsing** (xem [[02 - Catching Exceptions]]). Vì vậy bạn **nên cài một error handler mỗi khi dùng validation**: cung cấp một object **implement interface `ErrorHandler`** (xem [[01 - Interfaces]]). Interface đó có **ba method** như trên.

---

## API (validation)

### `javax.xml.parsers.DocumentBuilder` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setEntityResolver(EntityResolver resolver)` | set resolver để **định vị các entity** được tham chiếu trong XML document đang được parse. |
| `void setErrorHandler(ErrorHandler handler)` | set handler để **báo cáo error và warning** xảy ra trong lúc parsing. |

### `org.xml.sax.EntityResolver` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `public InputSource resolveEntity(String publicID, String systemID)` | trả về một input source chứa data được tham chiếu bởi (các) ID đã cho, hoặc `null` để báo rằng resolver này **không biết cách resolve** tên đó. Parameter `publicID` **có thể là `null`** nếu không có public ID nào được cung cấp. |

### `org.xml.sax.InputSource` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `InputSource(InputStream in)`<br>`InputSource(Reader in)`<br>`InputSource(String systemID)` | dựng một input source từ một stream, reader, hoặc system ID (thường là **URL tương đối hoặc tuyệt đối**). |

### `org.xml.sax.ErrorHandler` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void fatalError(SAXParseException exception)`<br>`void error(SAXParseException exception)`<br>`void warning(SAXParseException exception)` | **Override** các method này để cung cấp handler cho **fatal error**, **error không fatal**, và **warning**. |

### `org.xml.sax.SAXParseException` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int getLineNumber()`<br>`int getColumnNumber()` | trả về **số dòng và số cột** của **cuối phần input đã xử lý** gây ra exception. |

### `javax.xml.catalog.CatalogManager` 9

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static CatalogResolver catalogResolver(CatalogFeatures features, URI... uris)` | sinh ra một resolver dùng các **file catalog** đặt tại các URI được cung cấp. Class này **implement `EntityResolver`** cũng như các class resolver dùng bởi **StAX**, **schema validation**, và **XSL transform**. |

### `javax.xml.catalog.CatalogFeatures` 9

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static CatalogFeatures defaults()` | cho ra một instance với **thiết lập mặc định**. |

### `javax.xml.parsers.DocumentBuilderFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isValidating()`<br>`void setValidating(boolean value)` | lấy hoặc set property **`validating`** của factory. Nếu đặt `true`, các parser factory này sinh ra sẽ **validate input của chúng**. |
| `boolean isIgnoringElementContentWhitespace()`<br>`void setIgnoringElementContentWhitespace(boolean value)` | lấy hoặc set property **`ignoringElementContentWhitespace`**. Nếu đặt `true`, các parser factory này sinh ra sẽ **bỏ qua whitespace giữa các element node không có mixed content** (tức hỗn hợp element và `#PCDATA`). |

---

## 3.4.2. XML Schema

> *"XML Schema is quite a bit more complex than the DTD syntax, so we will only cover the basics. For more information, we recommend the tutorial at www.w3.org/TR/xmlschema-0."*

**Dịch:** XML Schema **phức tạp hơn kha khá** so với cú pháp DTD, nên sách **chỉ nói phần cơ bản**.

> *"To reference a schema file in a document, add attributes to the root element, for example:"*

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="config.xsd">
  . . .
</config>
```

> *"This declaration states that the schema file config.xsd should be used to validate the document. If your document uses namespaces, the syntax is a bit more complex—see the XML Schema tutorial for details. (The prefix xsi is a namespace alias; see Section 3.6, “Using Namespaces,” on p. 193 for more information.)"*

**Dịch:** Để **tham chiếu một file schema** trong document, thêm attribute vào **root element**. Khai báo này nói rằng file schema **`config.xsd`** nên được dùng để **validate document**. Nếu document dùng **namespace** thì cú pháp phức tạp hơn chút. (Prefix `xsi` là một **namespace alias**; xem [[06 - Using Namespaces]].)

### Simple type và complex type

> *"A schema defines a type for each element and attribute. A simple type is a string, perhaps with restrictions on its contents. Everything else is a complex type. An element with a simple type can have no attributes and no child elements. Otherwise, it must have a complex type. Conversely, attributes always have a simple type."*

**Dịch:** Một schema định nghĩa **một type cho mỗi element và attribute**. **Simple type** là một **chuỗi**, có thể kèm **ràng buộc về nội dung**. **Mọi thứ còn lại là complex type**. Element có **simple type** thì **không được có attribute và không được có child element**. Ngược lại thì nó **phải có complex type**. Còn **attribute thì luôn có simple type**.

> *"Some simple types are built into XML Schema, including"*

```
xsd:string
xsd:int
xsd:boolean
```

**Dịch:** Một số simple type **được xây dựng sẵn** trong XML Schema, gồm `xsd:string`, `xsd:int`, `xsd:boolean`.

> **Note (sách):** *"We use the prefix xsd: to denote the XML Schema Definition namespace. Some authors use the prefix xs: instead."*
>
> **Dịch:** Sách dùng prefix **`xsd:`** để chỉ **XML Schema Definition namespace**. Một số tác giả khác dùng prefix **`xs:`**.

> *"You can define your own simple types. For example, here is an enumerated type:"*

```xml
<xsd:simpleType name="StyleType">
  <xsd:restriction base="xsd:string">
    <xsd:enumeration value="PLAIN" />
    <xsd:enumeration value="BOLD" />
    <xsd:enumeration value="ITALIC" />
    <xsd:enumeration value="BOLD_ITALIC" />
  </xsd:restriction>
</xsd:simpleType>
```

> *"When you define an element, you specify its type:"*

```xml
<xsd:element name="name" type="xsd:string"/>
<xsd:element name="size" type="xsd:int"/>
<xsd:element name="style" type="StyleType"/>
```

> *"The type constrains the element content. For example, the elements"*

```xml
<size>10</size>
<style>PLAIN</style>
```

> *"will validate correctly, but the elements"*

```xml
<size>default</size>
<style>SLANTED</style>
```

> *"will be rejected by the parser."*

**Dịch:** Bạn **định nghĩa được simple type của riêng mình**, ví dụ một **enumerated type**. Khi định nghĩa một element thì **chỉ định type của nó**. **Type ràng buộc nội dung element**: `<size>10</size>` và `<style>PLAIN</style>` sẽ **validate đúng**, còn `<size>default</size>` và `<style>SLANTED</style>` sẽ **bị parser từ chối**.

### Ghép thành complex type

> *"You can compose types into complex types, for example:"*

```xml
<xsd:complexType name="FontType">
  <xsd:sequence>
    <xsd:element ref="name"/>
    <xsd:element ref="size"/>
    <xsd:element ref="style"/>
  </xsd:sequence>
</xsd:complexType>
```

> *"A FontType is a sequence of name, size, and style elements. In this type definition, we use the ref attribute and refer to definitions that are located elsewhere in the schema. You can also nest definitions, like this:"*

```xml
<xsd:complexType name="FontType">
  <xsd:sequence>
    <xsd:element name="name" type="xsd:string"/>
    <xsd:element name="size" type="xsd:int"/>
    <xsd:element name="style">
      <xsd:simpleType>
        <xsd:restriction base="xsd:string">
          <xsd:enumeration value="PLAIN" />
          <xsd:enumeration value="BOLD" />
          <xsd:enumeration value="ITALIC" />
          <xsd:enumeration value="BOLD_ITALIC" />
        </xsd:restriction>
      </xsd:simpleType>
    </xsd:element>
  </xsd:sequence>
</xsd:complexType>
```

> *"Note the anonymous type definition of the style element."*

**Dịch:** Bạn **ghép các type thành complex type**. Một `FontType` là một **sequence** gồm element `name`, `size`, `style`. Trong định nghĩa type này, ta dùng attribute **`ref`** và trỏ tới các định nghĩa **nằm ở chỗ khác trong schema**. Bạn cũng **lồng định nghĩa** được. Chú ý **định nghĩa type vô danh (anonymous)** của element `style`.

### sequence, choice, minoccurs/maxoccurs, attribute

> *"The xsd:sequence construct is the equivalent of the concatenation notation in DTDs. The xsd:choice construct is the equivalent of the | operator. For example,"*

```xml
<xsd:complexType name="contactinfo">
  <xsd:choice>
    <xsd:element ref="email"/>
    <xsd:element ref="phone"/>
  </xsd:choice>
</xsd:complexType>
```

> *"This is the equivalent of the DTD type email|phone."*

**Dịch:** Cấu trúc **`xsd:sequence`** tương đương **ký hiệu nối (concatenation)** trong DTD. Cấu trúc **`xsd:choice`** tương đương **toán tử `|`**. Ví dụ trên tương đương DTD type `email|phone`.

> *"To allow repeated elements, use the minoccurs and maxoccurs attributes. For example, the equivalent of the DTD type item* is"*

```xml
<xsd:element name="item" type=". . ." minoccurs="0" maxoccurs="unbounded">
```

**Dịch:** Để cho phép **element lặp lại**, dùng attribute **`minoccurs`** và **`maxoccurs`**. Ví dụ tương đương DTD type `item*` như trên.

> *"To specify attributes, add xsd:attribute elements to complexType definitions:"*

```xml
<xsd:element name="size">
  <xsd:complexType>
    . . .
    <xsd:attribute name="unit" type="xsd:string" use="optional" default="cm"/>
  </xsd:complexType>
</xsd:element>
```

> *"This is the equivalent of the DTD statement"*

```
<!ATTLIST size unit CDATA #IMPLIED "cm">
```

**Dịch:** Để **chỉ định attribute**, thêm element **`xsd:attribute`** vào định nghĩa `complexType`. Đoạn trên tương đương câu lệnh DTD ở dưới.

> *"Enclose element and type definitions of your schema inside an xsd:schema element:"*

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  . . .
</xsd:schema>
```

**Dịch:** Bao các định nghĩa element và type của schema **bên trong một element `xsd:schema`**.

### Parse file có schema

> *"Parsing an XML file with a schema is similar to parsing a file with a DTD, but with two differences:"*
>
> *"1. You need to turn on support for namespaces, even if you don’t use them in your XML files."*
>
> ```java
> factory.setNamespaceAware(true);
> ```
>
> *"2. You need to prepare the factory for handling schemas, with the following magic incantation:"*
>
> ```java
> final String JAXP_SCHEMA_LANGUAGE =
>     "http://java.sun.com/xml/jaxp/properties/schemaLanguage";
> final String W3C_XML_SCHEMA = "http://www.w3.org/2001/XMLSchema";
> factory.setAttribute(JAXP_SCHEMA_LANGUAGE, W3C_XML_SCHEMA);
> ```

**Dịch:** Parse file XML **có schema** thì giống parse file có DTD, nhưng khác **hai điểm**: (1) phải **bật hỗ trợ namespace**, **kể cả khi bạn không dùng namespace** trong file XML; (2) phải **chuẩn bị factory để xử lý schema** bằng **"câu thần chú"** trên.

---

## 3.4.3. A Practical Example

> *"In this section, we work through a practical example that shows the use of XML in a realistic setting."*

> *"Suppose an application needs configuration data that specifies arbitrary objects, not just text strings. We provide two mechanisms for instantiating the object: with a constructor, and with a factory method. Here is how to make a Color object using a constructor:"*

```xml
<construct class="java.awt.Color">
  <int>55</int>
  <int>200</int>
  <int>100</int>
</construct>
```

> *"Here is an example with a factory method:"*

```xml
<factory class="java.util.logging.Logger" method="getLogger">
  <string>com.horstmann.corejava</string>
</factory>
```

> *"If the factory method name is omitted, it defaults to getInstance."*

**Dịch:** Giả sử một application cần **configuration data chỉ định object bất kỳ**, chứ không chỉ chuỗi text. Sách cung cấp **hai cơ chế để tạo instance của object**: bằng **constructor**, và bằng **factory method**. Nếu **bỏ trống tên factory method** thì nó **mặc định là `getInstance`**.

> *"As you can see, there are elements for describing strings and integers. We also support the boolean type, and other primitive types can be added in the same way."*

> *"Just to show off the syntax, there is a second mechanism for primitive types:"*

```xml
<value type="int">30</value>
```

**Dịch:** Có element để mô tả **string** và **integer**. Sách cũng hỗ trợ kiểu **boolean**, và **các kiểu primitive khác thêm vào theo cùng cách**. Chỉ để **khoe cú pháp**, có **cơ chế thứ hai** cho kiểu primitive như trên.

> *"A configuration is a sequence of entries. Each entry has an ID and an object:"*

```xml
<config>
  <entry id="background">
    <construct class="java.awt.Color">
      <value type="int">55</value>
      <value type="int">200</value>
      <value type="int">100</value>
    </construct>
  </entry>
  . . .
</config>
```

> *"The parser checks that IDs are unique."*

**Dịch:** Một **configuration là một dãy entry**. Mỗi entry có **một ID và một object**. **Parser kiểm tra ID là duy nhất.**

> *"The DTD, shown in Listing 3.4, is straightforward."*

> *"Listing 3.5 contains the equivalent schema. In the schema, we can provide additional checking: an int or boolean element can only contain integer or boolean content. Note the use of the xsd:group construct to define parts of complex types that are used repeatedly."*

**Dịch:** DTD (Listing 3.4) **rất thẳng thắn**. Listing 3.5 chứa **schema tương đương**. Trong schema, ta cung cấp được **kiểm tra bổ sung**: element `int` hay `boolean` **chỉ được chứa nội dung integer hoặc boolean**. Chú ý cách dùng cấu trúc **`xsd:group`** để định nghĩa **các phần của complex type được dùng lặp lại**.

> *"The program in Listing 3.2 shows how to parse a configuration file. A sample configuration is defined in Listing 3.3."*

> *"The program uses the schema instead of the DTD if you choose a file that contains the string -schema."*

> *"This example is a typical use of XML. The XML format is robust enough to express complex relationships. The XML parser adds value by taking over the routine job of validity checking and supplying defaults."*

**Dịch:** Chương trình dùng **schema thay cho DTD** nếu bạn chọn file có chứa chuỗi **`-schema`**. Ví dụ này là **cách dùng XML điển hình**. Định dạng XML **đủ mạnh để diễn tả quan hệ phức tạp**. XML parser **tạo giá trị gia tăng** bằng cách **gánh lấy công việc thường lệ là kiểm tra tính hợp lệ và cấp giá trị mặc định**.

### Listing 3.2 — `read/XMLReadTest.java`

```java
package read;

import java.io.*;
import java.lang.reflect.*;
import java.util.*;

import javax.xml.parsers.*;

import org.w3c.dom.*;
import org.xml.sax.*;

/**
 * This program shows how to use an XML file to describe Java objects
 * @version 1.0 2018-04-03
 * @author Cay Horstmann
 */
public class XMLReadTest
{
    public static void main(String[] args) throws ParserConfigurationException,
        SAXException, IOException, ReflectiveOperationException
    {
        String filename;
        if (args.length == 0)
        {
            try (var in = new Scanner(System.in))
            {
                System.out.print("Input file: ");
                filename = in.nextLine();
            }
        }
        else
            filename = args[0];

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setValidating(true);

        if (filename.contains("-schema"))
        {
            factory.setNamespaceAware(true);
            final String JAXP_SCHEMA_LANGUAGE =
                "http://java.sun.com/xml/jaxp/properties/schemaLanguage";
            final String W3C_XML_SCHEMA = "http://www.w3.org/2001/XMLSchema";
            factory.setAttribute(JAXP_SCHEMA_LANGUAGE, W3C_XML_SCHEMA);
        }

        factory.setIgnoringElementContentWhitespace(true);

        DocumentBuilder builder = factory.newDocumentBuilder();

        builder.setErrorHandler(new ErrorHandler()
            {
                public void warning(SAXParseException e) throws SAXException
                {
                    System.err.println("Warning: " + e.getMessage());
                }

                public void error(SAXParseException e) throws SAXException
                {
                    System.err.println("Error: " + e.getMessage());
                    System.exit(0);
                }

                public void fatalError(SAXParseException e) throws SAXException
                {
                    System.err.println("Fatal error: " + e.getMessage());
                    System.exit(0);
                }
            });

        Document doc = builder.parse(filename);
        Map<String, Object> config = parseConfig(doc.getDocumentElement());
        System.out.println(config);
    }

    private static Map<String, Object> parseConfig(Element e)
        throws ReflectiveOperationException
    {
        var result = new HashMap<String, Object>();
        NodeList children = e.getChildNodes();
        for (int i = 0; i < children.getLength(); i++)
        {
            var child = (Element) children.item(i);
            String name = child.getAttribute("id");
            Object value = parseObject((Element) child.getFirstChild());
            result.put(name, value);
        }
        return result;
    }

    private static Object parseObject(Element e)
        throws ReflectiveOperationException
    {
        String tagName = e.getTagName();
        if (tagName.equals("factory")) return parseFactory(e);
        else if (tagName.equals("construct")) return parseConstruct(e);
        else
        {
            String childData = ((CharacterData) e.getFirstChild()).getData();
            if (tagName.equals("int"))
                return Integer.valueOf(childData);
            else if (tagName.equals("boolean"))
                return Boolean.valueOf(childData);
            else
                return childData;
        }
    }

    private static Object parseFactory(Element e)
        throws ReflectiveOperationException
    {
        String className = e.getAttribute("class");
        String methodName = e.getAttribute("method");
        Object[] args = parseArgs(e.getChildNodes());
        Class<?>[] parameterTypes = getParameterTypes(args);
        Method method = Class.forName(className).getMethod(methodName, parameterTypes);
        return method.invoke(null, args);
    }

    private static Object parseConstruct(Element e)
        throws ReflectiveOperationException
    {
        String className = e.getAttribute("class");
        Object[] args = parseArgs(e.getChildNodes());
        Class<?>[] parameterTypes = getParameterTypes(args);
        Constructor<?> constructor = Class.forName(className).getConstructor(parameterTypes);
        return constructor.newInstance(args);
    }

    private static Object[] parseArgs(NodeList elements)
        throws ReflectiveOperationException
    {
        var result = new Object[elements.getLength()];
        for (int i = 0; i < result.length; i++)
            result[i] = parseObject((Element) elements.item(i));
        return result;
    }

    private static Map<Class<?>, Class<?>> toPrimitive = Map.of(
        Integer.class, int.class,
        Boolean.class, boolean.class);

    private static Class<?>[] getParameterTypes(Object[] args)
    {
        var result = new Class<?>[args.length];
        for (int i = 0; i < result.length; i++)
        {
            Class<?> cl = args[i].getClass();
            result[i] = toPrimitive.get(cl);
            if (result[i] == null) result[i] = cl;
        }
        return result;
    }
}
```

### Listing 3.3 — `read/config.xml`

```xml
<?xml version="1.0"?>
<!DOCTYPE config SYSTEM "config.dtd">
<config>
  <entry id="background">
    <construct class="java.awt.Color">
      <int>55</int>
      <int>200</int>
      <int>100</int>
    </construct>
  </entry>
  <entry id="currency">
    <factory class="java.util.Currency">
      <string>USD</string>
    </factory>
  </entry>
</config>
```

### Listing 3.4 — `read/config.dtd`

```
<!ELEMENT config (entry)*>

<!ELEMENT entry (string|int|boolean|construct|factory)>
<!ATTLIST entry id ID #IMPLIED>

<!ELEMENT construct (string|int|boolean|construct|factory)*>
<!ATTLIST construct class CDATA #IMPLIED>

<!ELEMENT factory (string|int|boolean|construct|factory)*>
<!ATTLIST factory class CDATA #IMPLIED>
<!ATTLIST factory method CDATA "getInstance">

<!ELEMENT string (#PCDATA)>
<!ELEMENT int (#PCDATA)>
<!ELEMENT boolean (#PCDATA)>
```

### Listing 3.5 — `read/config.xsd`

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:element name="config">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element name="entry" minOccurs="0" maxOccurs="unbounded">
          <xsd:complexType>
            <xsd:group ref="Object"/>
            <xsd:attribute name="id" type="xsd:ID"/>
          </xsd:complexType>
        </xsd:element>
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>

  <xsd:element name="construct">
    <xsd:complexType>
      <xsd:group ref="Arguments"/>
      <xsd:attribute name="class" type="xsd:string"/>
    </xsd:complexType>
  </xsd:element>

  <xsd:element name="factory">
    <xsd:complexType>
      <xsd:group ref="Arguments"/>
      <xsd:attribute name="class" type="xsd:string"/>
      <xsd:attribute name="method" type="xsd:string" default="getInstance"/>
    </xsd:complexType>
  </xsd:element>

  <xsd:group name="Object">
    <xsd:choice>
      <xsd:element ref="construct"/>
      <xsd:element ref="factory"/>
      <xsd:element name="string" type="xsd:string"/>
      <xsd:element name="int" type="xsd:int"/>
      <xsd:element name="boolean" type="xsd:boolean"/>
    </xsd:choice>
  </xsd:group>

  <xsd:group name="Arguments">
    <xsd:sequence>
      <xsd:group ref="Object" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
  </xsd:group>
</xsd:schema>
```

---

## Bài kế tiếp

→ [[05 - Locating Information with XPath]] — XPath expression, `XPathFactory`, `evaluate`, `evaluateExpression`.
