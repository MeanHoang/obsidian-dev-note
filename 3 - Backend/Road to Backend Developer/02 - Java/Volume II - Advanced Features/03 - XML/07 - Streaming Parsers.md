# 07 — Streaming Parsers

> Chapter 3, Section 3.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.7. Streaming Parsers

> *"The DOM parser reads an XML document in its entirety into a tree data structure. For most practical applications, DOM works fine. However, it can be inefficient if the document is large and if your processing algorithm is simple enough that you can analyze nodes on the fly, without having to see all of the tree structure. In these cases, you should use a streaming parser."*

**Dịch:** **DOM parser đọc trọn vẹn** một XML document vào một **cấu trúc dữ liệu cây**. Với phần lớn ứng dụng thực tế, DOM **chạy tốt**. Tuy nhiên nó có thể **kém hiệu quả** nếu document **lớn** và nếu thuật toán xử lý của bạn **đủ đơn giản để phân tích node ngay khi lướt qua**, mà **không cần nhìn toàn bộ cấu trúc cây**. Trong những trường hợp đó, bạn **nên dùng streaming parser**.

> *"In the following sections, we discuss the streaming parsers supplied by the Java library: the venerable SAX parser and the more modern StAX parser that was added to Java 6. The SAX parser uses event callbacks, and the StAX parser provides an iterator through the parsing events. The latter is usually a bit more convenient."*

**Dịch:** Java library cung cấp hai streaming parser: **SAX parser** đáng kính và **StAX parser** hiện đại hơn, được **thêm vào Java 6**. **SAX parser dùng event callback**, còn **StAX parser cung cấp một iterator** đi qua các parsing event. **Cái sau thường tiện hơn một chút.**

| Parser | Cơ chế |
|---|---|
| **SAX** | **event callback** |
| **StAX** | **iterator** qua các parsing event ("pull parser") |

---

## 3.7.1. Using the SAX Parser

> *"The SAX parser reports events as it parses the components of the XML input, but it does not store the document in any way—it is up to the event handlers to build a data structure. In fact, the DOM parser is built on top of the SAX parser. It builds the DOM tree as it receives the parser events."*

**Dịch:** SAX parser **báo cáo event** trong lúc parse các thành phần của XML input, nhưng nó **không lưu document theo bất kỳ cách nào** — **việc dựng cấu trúc dữ liệu là của event handler**. Thực tế, **DOM parser được xây dựng bên trên SAX parser**: nó **dựng DOM tree ngay khi nhận được parser event**.

### ContentHandler

> *"Whenever you use a SAX parser, you need a handler that defines the event actions for the various parse events. The ContentHandler interface defines several callback methods that the parser executes as it parses the document. Here are the most important ones:"*
>
> *"• startElement and endElement are called each time a start tag or end tag is encountered.*
> *• characters is called whenever character data are encountered.*
> *• startDocument and endDocument are called once each, at the start and the end of the document."*

**Dịch:** Mỗi khi dùng SAX parser, bạn cần một **handler định nghĩa hành động** cho các parse event khác nhau. Interface **`ContentHandler`** định nghĩa vài **callback method** mà parser **thực thi trong lúc parse document**. Quan trọng nhất:

| Callback | Khi nào được gọi |
|---|---|
| `startElement` / `endElement` | mỗi lần gặp một **start tag** hoặc **end tag** |
| `characters` | mỗi khi gặp **character data** |
| `startDocument` / `endDocument` | **mỗi cái một lần**, ở **đầu** và **cuối** document |

> *"For example, when parsing the fragment"*

```xml
<font>
  <name>Helvetica</name>
  <size units="pt">36</size>
</font>
```

> *"the parser makes the following callbacks:"*
>
> *"1. startElement, element name: font*
> *2. startElement, element name: name*
> *3. characters, content: Helvetica*
> *4. endElement, element name: name*
> *5. startElement, element name: size, attributes: units="pt"*
> *6. characters, content: 36*
> *7. endElement, element name: size*
> *8. endElement, element name: font"*

**Dịch:** Với đoạn XML trên, parser thực hiện **8 callback** theo đúng thứ tự trên.

> *"Your handler needs to override these methods and have them carry out whatever action you want to carry out as you parse the file. The program at the end of this section prints all links `<a href=". . .">` in an HTML file. It simply overrides the startElement method of the handler to check for links with name a and an attribute with name href. This is potentially useful for implementing a “web crawler”—a program that reaches more and more web pages by following links."*

**Dịch:** Handler của bạn cần **override các method này** và cho chúng làm bất cứ hành động nào bạn muốn trong lúc parse file. Chương trình cuối section này **in ra mọi link `<a href=". . .">`** trong một file HTML. Nó **chỉ override method `startElement`** để tìm link có tên `a` và attribute tên `href`. Cái này có thể hữu ích để **hiện thực một "web crawler"** — chương trình **đi tới ngày càng nhiều trang web bằng cách lần theo link**.

> **Note (sách):** *"HTML doesn’t have to be valid XML, and many web pages deviate so much from proper XML that the example programs will not be able to parse them. However, most pages authored by the W3C are written in XHTML (an HTML dialect that is proper XML). You can use those pages to test the example program. For example, if you run"*
>
> ```
> java SAXTest http://www.w3c.org/MarkUp
> ```
>
> *"you will see a list of the URLs of all links on that page."*
>
> **Dịch:** **HTML không bắt buộc phải là XML hợp lệ**, và nhiều trang web **lệch khỏi XML chuẩn nhiều đến mức chương trình ví dụ không parse nổi**. Tuy nhiên, phần lớn trang do **W3C soạn được viết bằng XHTML** (một phương ngữ HTML **đúng chuẩn XML**). Bạn dùng các trang đó để **test chương trình ví dụ**.

> *"The sample program is a good example for the use of SAX. We don’t care at all in which context the a elements occur, and there is no need to store a tree structure."*

**Dịch:** Chương trình mẫu là **ví dụ tốt cho việc dùng SAX**: ta **hoàn toàn không quan tâm element `a` xuất hiện trong ngữ cảnh nào**, và **không cần lưu cấu trúc cây**.

### Lấy SAX parser

> *"Here is how you get a SAX parser:"*

```java
SAXParserFactory factory = SAXParserFactory.newInstance();
SAXParser parser = factory.newSAXParser();
```

> *"You can now process a document:"*

```java
parser.parse(source, handler);
```

> *"Here, source can be a file, URL string, or input stream. The handler belongs to a subclass of DefaultHandler. The DefaultHandler class defines do-nothing methods for the four interfaces:"*

```
ContentHandler
DTDHandler
EntityResolver
ErrorHandler
```

**Dịch:** `source` có thể là **file, chuỗi URL, hoặc input stream**. `handler` thuộc một **subclass của `DefaultHandler`**. Class **`DefaultHandler` định nghĩa các method rỗng (do-nothing)** cho **bốn interface** trên.

> *"The example program defines a handler that overrides the startElement method of the ContentHandler interface to watch out for a elements with an href attribute:"*

```java
var handler = new DefaultHandler()
{
    public void startElement(String namespaceURI, String lname, String qname,
        Attributes attrs) throws SAXException
    {
        if (lname.equalsIgnoreCase("a") && attrs != null)
        {
            for (int i = 0; i < attrs.getLength(); i++)
            {
                String aname = attrs.getLocalName(i);
                if (aname.equalsIgnoreCase("href"))
                    System.out.println(attrs.getValue(i));
            }
        }
    }
};
```

**Dịch:** Chương trình ví dụ định nghĩa một handler **override `startElement`** của interface `ContentHandler` để **canh chừng element `a` có attribute `href`**.

> *"The startElement method has three parameters that describe the element name. The qname parameter reports the qualified name of the form prefix:localname. If namespace processing is turned on, then the namespaceURI and lname parameters provide the namespace and local (unqualified) name."*

**Dịch:** Method `startElement` có **ba parameter mô tả tên element**. Parameter **`qname`** báo cáo **qualified name** dạng `prefix:localname`. Nếu **xử lý namespace được bật**, thì parameter **`namespaceURI`** và **`lname`** cung cấp **namespace** và **local name (không qualified)**. Xem [[06 - Using Namespaces]].

> *"As with the DOM parser, namespace processing is turned off by default. To activate namespace processing, call the setNamespaceAware method of the factory class:"*

```java
SAXParserFactory factory = SAXParserFactory.newInstance();
factory.setNamespaceAware(true);
SAXParser saxParser = factory.newSAXParser();
```

**Dịch:** Giống DOM parser, **xử lý namespace mặc định bị tắt**. Để kích hoạt, gọi `setNamespaceAware` của class factory.

### Tránh tải DTD

> *"In this program, we cope with another common issue. An XHTML file starts with a tag that contains a DTD reference, and the parser will want to load it. Understandably, the W3C isn’t too happy to serve billions of copies of files such as www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd. At one point, they refused altogether, but at the time of this writing, they serve the DTD at a glacial pace. If you don’t need to validate the document, just call"*

```java
factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
```

**Dịch:** Chương trình này còn phải đối phó với **một vấn đề phổ biến khác**: file XHTML bắt đầu bằng một tag **chứa tham chiếu DTD**, và parser sẽ **muốn tải nó về**. Dễ hiểu là **W3C chẳng vui gì khi phải phục vụ hàng tỉ bản sao** của những file như vậy. **Có lúc họ từ chối hẳn**, còn tại thời điểm viết sách thì họ **phục vụ DTD với tốc độ băng hà**. Nếu bạn **không cần validate document**, chỉ việc gọi `setFeature` như trên.

> *"Listing 3.7 contains the code for the web crawler program. Later in this chapter, you will see another interesting use of SAX. An easy way of turning a non-XML data source into XML is to report the SAX events that an XML parser would report."*

**Dịch:** Listing 3.7 chứa code cho chương trình web crawler. Sau này bạn sẽ thấy **một cách dùng SAX thú vị khác**: một cách dễ dàng để **biến một nguồn data không phải XML thành XML** là **báo cáo đúng những SAX event mà một XML parser sẽ báo cáo**. Xem [[09 - XSL Transformations]].

### Listing 3.7 — `sax/SAXTest.java`

```java
package sax;

import java.io.*;
import java.net.*;
import javax.xml.parsers.*;
import org.xml.sax.*;
import org.xml.sax.helpers.*;

/**
 * This program demonstrates how to use a SAX parser. The program prints all
 * hyperlinks of an XHTML web page. <br>
 * Usage: java sax.SAXTest URL
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */
public class SAXTest
{
    public static void main(String[] args) throws Exception
    {
        String url;
        if (args.length == 0)
        {
            url = "http://www.w3c.org";
            System.out.println("Using " + url);
        }
        else url = args[0];

        var handler = new DefaultHandler()
            {
                public void startElement(String namespaceURI, String lname,
                    String qname, Attributes attrs)
                {
                    if (lname.equals("a") && attrs != null)
                    {
                        for (int i = 0; i < attrs.getLength(); i++)
                        {
                            String aname = attrs.getLocalName(i);
                            if (aname.equals("href"))
                                System.out.println(attrs.getValue(i));
                        }
                    }
                }
            };

        SAXParserFactory factory = SAXParserFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setFeature(
            "http://apache.org/xml/features/nonvalidating/load-external-dtd",
            false);
        SAXParser saxParser = factory.newSAXParser();
        InputStream in = new URL(url).openStream();
        saxParser.parse(in, handler);
    }
}
```

### API (SAX)

#### `javax.xml.parsers.SAXParserFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static SAXParserFactory newInstance()` | trả về một instance của class `SAXParserFactory`. |
| `SAXParser newSAXParser()` | trả về một instance của class `SAXParser`. |
| `boolean isNamespaceAware()`<br>`void setNamespaceAware(boolean value)` | lấy hoặc set property **`namespaceAware`** của factory. Nếu đặt `true`, các parser factory này sinh ra là **namespace-aware**. |
| `boolean isValidating()`<br>`void setValidating(boolean value)` | lấy hoặc set property **`validating`** của factory. Nếu đặt `true`, các parser factory này sinh ra sẽ **validate input**. |

#### `javax.xml.parsers.SAXParser` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void parse(File f, DefaultHandler handler)`<br>`void parse(String url, DefaultHandler handler)`<br>`void parse(InputStream in, DefaultHandler handler)` | parse một XML document từ file, URL, hoặc input stream đã cho và **báo cáo parse event cho handler đã cho**. |

#### `org.xml.sax.ContentHandler` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void startDocument()`<br>`void endDocument()` | được gọi ở **đầu** hoặc **cuối** document. |
| `void startElement(String uri, String lname, String qname, Attributes attr)`<br>`void endElement(String uri, String lname, String qname)` | được gọi ở **đầu** hoặc **cuối** một element. Nếu parser là namespace-aware, nó báo cáo **URI của namespace**, **local name không prefix**, và **qualified name có prefix**. |
| `void characters(char[] data, int start, int length)` | được gọi khi parser **báo cáo character data**. |

#### `org.xml.sax.Attributes` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int getLength()` | trả về **số attribute** lưu trong collection attribute này. |
| `String getLocalName(int index)` | trả về **local name** (không prefix) của attribute tại index đã cho, hoặc **chuỗi rỗng** nếu parser không namespace-aware. |
| `String getURI(int index)` | trả về **namespace URI** của attribute tại index đã cho, hoặc **chuỗi rỗng** nếu node không thuộc namespace nào hoặc parser không namespace-aware. |
| `String getQName(int index)` | trả về **qualified name** (có prefix) của attribute tại index đã cho, hoặc **chuỗi rỗng** nếu qualified name không được parser báo cáo. |
| `String getValue(int index)`<br>`String getValue(String qname)`<br>`String getValue(String uri, String lname)` | trả về **giá trị attribute** theo index, qualified name, hoặc namespace URI + local name. Trả về **`null`** nếu giá trị không tồn tại. |

---

## 3.7.2. Using the StAX Parser

> *"The StAX parser is a “pull parser.” Instead of installing an event handler, you simply iterate through the events, using this basic loop:"*

```java
InputStream in = url.openStream();
XMLInputFactory factory = XMLInputFactory.newInstance();
XMLStreamReader parser = factory.createXMLStreamReader(in);
while (parser.hasNext())
{
    int event = parser.next();
    // Call parser methods to obtain event details
}
```

**Dịch:** StAX parser là một **"pull parser"**. Thay vì **cài một event handler**, bạn chỉ việc **lặp qua các event** bằng vòng lặp cơ bản trên.

> *"For example, when parsing the fragment"*

```xml
<font>
  <name>Helvetica</name>
  <size units="pt">36</size>
</font>
```

> *"the parser yields the following events:"*
>
> *"1. START_ELEMENT, element name: font*
> *2. CHARACTERS, content: white space*
> *3. START_ELEMENT, element name: name*
> *4. CHARACTERS, content: Helvetica*
> *5. END_ELEMENT, element name: name*
> *6. CHARACTERS, content: white space*
> *7. START_ELEMENT, element name: size*
> *8. CHARACTERS, content: 36*
> *9. END_ELEMENT, element name: size*
> *10. CHARACTERS, content: white space*
> *11. END_ELEMENT, element name: font"*

**Dịch:** Với đoạn XML trên, parser cho ra **11 event** theo thứ tự trên. Chú ý là **khác với SAX**, ở đây **whitespace cũng sinh ra event `CHARACTERS`**.

> *"To analyze the attribute values, call the appropriate methods of the XMLStreamReader class. For example,"*

```java
String units = parser.getAttributeValue(null, "units");
```

> *"gets the units attribute of the current element."*

**Dịch:** Để phân tích **giá trị attribute**, gọi method thích hợp của class `XMLStreamReader`. Ví dụ trên lấy attribute `units` của **element hiện tại**.

> *"By default, namespace processing is enabled. You can deactivate it by modifying the factory:"*

```java
XMLInputFactory factory = XMLInputFactory.newInstance();
factory.setProperty(XMLInputFactory.IS_NAMESPACE_AWARE, false);
```

**Dịch:** **Mặc định, xử lý namespace được BẬT** (khác với DOM và SAX). Bạn **tắt** nó bằng cách sửa factory.

> *"Listing 3.8 contains the code for the web crawler program implemented with the StAX parser. As you can see, the code is simpler than the equivalent SAX code because you don’t have to worry about event handling."*

**Dịch:** Listing 3.8 chứa code web crawler hiện thực bằng StAX parser. Như bạn thấy, code **đơn giản hơn** code SAX tương đương vì bạn **không phải lo chuyện xử lý event**.

### Listing 3.8 — `stax/StAXTest.java`

```java
package stax;

import java.io.*;
import java.net.*;
import javax.xml.stream.*;

/**
 * This program demonstrates how to use a StAX parser. The program prints all
 * hyperlinks of an XHTML web page. <br>
 * Usage: java stax.StAXTest URL
 * @author Cay Horstmann
 * @version 1.1 2018-05-01
 */
public class StAXTest
{
    public static void main(String[] args) throws Exception
    {
        String urlString;
        if (args.length == 0)
        {
            urlString = "http://www.w3c.org";
            System.out.println("Using " + urlString);
        }
        else urlString = args[0];
        var url = new URL(urlString);
        InputStream in = url.openStream();
        XMLInputFactory factory = XMLInputFactory.newInstance();
        XMLStreamReader parser = factory.createXMLStreamReader(in);
        while (parser.hasNext())
        {
            int event = parser.next();
            if (event == XMLStreamConstants.START_ELEMENT)
            {
                if (parser.getLocalName().equals("a"))
                {
                    String href = parser.getAttributeValue(null, "href");
                    if (href != null)
                        System.out.println(href);
                }
            }
        }
    }
}
```

### API (StAX đọc)

#### `javax.xml.stream.XMLInputFactory` 6

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static XMLInputFactory newInstance()` | trả về một instance của class `XMLInputFactory`. |
| `void setProperty(String name, Object value)` | set một property cho factory này, hoặc **throw `IllegalArgumentException`** nếu property không được hỗ trợ hoặc không set được về giá trị đã cho. |
| `XMLStreamReader createXMLStreamReader(InputStream in)`<br>`XMLStreamReader createXMLStreamReader(InputStream in, String characterEncoding)`<br>`XMLStreamReader createXMLStreamReader(Reader in)`<br>`XMLStreamReader createXMLStreamReader(Source in)` | tạo một parser đọc từ stream, reader, hoặc **JAXP source** đã cho. |

**Các property Boolean mà bản JDK hỗ trợ** (dịch từ bảng trong sách):

| Property | Ý nghĩa |
|---|---|
| `"javax.xml.stream.isValidating"` | Khi **`false` (mặc định)**, document **không được validate**. Không bắt buộc theo specification. |
| `"javax.xml.stream.isNamespaceAware"` | Khi **`true` (mặc định)**, **namespace được xử lý**. Không bắt buộc theo specification. |
| `"javax.xml.stream.isCoalescing"` | Khi **`false` (mặc định)**, character data **liền kề không được gộp lại**. |
| `"javax.xml.stream.isReplacingEntityReferences"` | Khi **`true` (mặc định)**, **entity reference được thay thế** và báo cáo dưới dạng character data. |
| `"javax.xml.stream.isSupportingExternalEntities"` | Khi **`true` (mặc định)**, **external entity được resolve**. Specification **không quy định mặc định** cho property này. |
| `"javax.xml.stream.supportDTD"` | Khi **`true` (mặc định)**, **DTD được báo cáo dưới dạng event**. |

#### `javax.xml.stream.XMLStreamReader` 6

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean hasNext()` | trả về `true` nếu **còn parse event khác**. |
| `int next()` | đặt trạng thái parser sang **parse event kế tiếp** và trả về một trong các hằng số: `START_ELEMENT`, `END_ELEMENT`, `CHARACTERS`, `START_DOCUMENT`, `END_DOCUMENT`, `CDATA`, `COMMENT`, `SPACE` (whitespace bỏ qua được), `PROCESSING_INSTRUCTION`, `ENTITY_REFERENCE`, `DTD`. |
| `boolean isStartElement()`<br>`boolean isEndElement()`<br>`boolean isCharacters()`<br>`boolean isWhiteSpace()` | trả về `true` nếu event hiện tại là **start element, end element, character data, hoặc whitespace**. |
| `QName getName()`<br>`String getLocalName()` | lấy **tên element** trong event `START_ELEMENT` hoặc `END_ELEMENT`. |
| `String getText()` | trả về **các ký tự** của event `CHARACTERS`, `COMMENT`, hoặc `CDATA`; **giá trị thay thế** cho một `ENTITY_REFERENCE`; hoặc **internal subset** của một `DTD`. |
| `int getAttributeCount()`<br>`QName getAttributeName(int index)`<br>`String getAttributeLocalName(int index)`<br>`String getAttributeValue(int index)` | lấy **số attribute** cùng **tên và giá trị** của các attribute, với điều kiện event hiện tại là `START_ELEMENT`. |
| `String getAttributeValue(String namespaceURI, String name)` | lấy giá trị của attribute có tên đã cho, với điều kiện event hiện tại là `START_ELEMENT`. Nếu `namespaceURI` là **`null`** thì **namespace không bị kiểm tra**. |

---

## Bài kế tiếp

→ [[08 - Generating XML Documents]] — dựng DOM tree, ghi document bằng XSLT/`LSSerializer`, ghi bằng StAX, ví dụ sinh file SVG.
