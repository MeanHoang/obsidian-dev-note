# 08 — Generating XML Documents

> Chapter 3, Section 3.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.8. Generating XML Documents

> *"You now know how to write Java programs that read XML. Let us now turn to the opposite process: producing XML output. Of course, you could write an XML file simply by making a sequence of print calls, printing the elements, attributes, and text content, but that would not be a good idea. The code is rather tedious, and you can easily make mistakes if you don’t pay attention to special symbols (such as " or <) in the attribute values and text content."*

> *"A better approach is to build up a DOM tree with the contents of the document and then write out the tree contents. The following sections discuss the details."*

**Dịch:** Giờ ta chuyển sang **quá trình ngược lại: sinh ra XML output**. Dĩ nhiên bạn có thể viết file XML **chỉ bằng một loạt lời gọi `print`**, in ra element, attribute và text content — nhưng đó **không phải ý hay**. Code khá **tẻ nhạt**, và bạn **dễ mắc lỗi** nếu không để ý các **ký hiệu đặc biệt** (như `"` hay `<`) trong giá trị attribute và text content. **Cách tốt hơn là dựng một DOM tree** với nội dung document rồi **ghi nội dung cây ra**.

---

## 3.8.1. Documents without Namespaces

> *"To build a DOM tree, you start out with an empty document. You can get an empty document by calling the newDocument method of the DocumentBuilder class:"*

```java
Document doc = builder.newDocument();
```

> *"Use the createElement method of the Document class to construct the elements of your document:"*

```java
Element rootElement = doc.createElement(rootName);
Element childElement = doc.createElement(childName);
```

> *"Use the createTextNode method to construct text nodes:"*

```java
Text textNode = doc.createTextNode(textContents);
```

> *"Add the root element to the document, and add the child nodes to their parents:"*

```java
doc.appendChild(rootElement);
rootElement.appendChild(childElement);
childElement.appendChild(textNode);
```

> *"As you build up the DOM tree, you may also need to set element attributes. Simply call the setAttribute method of the Element class:"*

```java
rootElement.setAttribute(name, value);
```

**Dịch:** Để dựng một DOM tree, bạn **bắt đầu bằng một document rỗng** lấy từ `newDocument`. Dùng **`createElement`** của class `Document` để **dựng các element**, và **`createTextNode`** để **dựng text node**. Rồi **thêm root element vào document**, và **thêm các node con vào cha của chúng** bằng `appendChild`. Trong lúc dựng cây, bạn có thể cần **set attribute** — chỉ việc gọi `setAttribute` của class `Element`.

---

## 3.8.2. Documents with Namespaces

> *"If you use namespaces, the procedure for creating a document is slightly different."*

> *"First, set the builder factory to be namespace-aware, then create the builder:"*

```java
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
factory.setNamespaceAware(true);
builder = factory.newDocumentBuilder();
```

> *"Then use createElementNS instead of createElement to create any nodes:"*

```java
String namespace = "http://www.w3.org/2000/svg";
Element rootElement = doc.createElementNS(namespace, "svg");
```

**Dịch:** Nếu bạn dùng **namespace** (xem [[06 - Using Namespaces]]) thì thủ tục tạo document **hơi khác**. Trước hết **set builder factory là namespace-aware**, rồi tạo builder. Sau đó dùng **`createElementNS` thay cho `createElement`** để tạo node.

> *"If your node has a qualified name with a namespace prefix, then any necessary xmlns-prefixed attributes are created automatically. For example, if you need SVG inside XHTML, you can construct an element like this:"*

```java
Element svgElement = doc.createElement(namespace, "svg:svg")
```

> *"When the element is written, it turns into"*

```xml
<svg:svg xmlns:svg="http://www.w3.org/2000/svg">
```

**Dịch:** Nếu node của bạn có **qualified name kèm namespace prefix**, thì **mọi attribute có tiền tố `xmlns` cần thiết đều được tạo tự động**.

> *"If you need to set element attributes whose names are in a namespace, use the setAttributeNS method of the Element class:"*

```java
rootElement.setAttributeNS(namespace, qualifiedName, value);
```

**Dịch:** Nếu cần set attribute mà **tên nằm trong một namespace**, dùng method **`setAttributeNS`** của class `Element`.

---

## 3.8.3. Writing Documents

> *"Somewhat curiously, it is not so easy to write a DOM tree to an output stream. The easiest approach is to use the Extensible Stylesheet Language Transformations (XSLT) API. For more information about XSLT, turn to Section 3.9, “XSL Transformations,” on p. 216. Right now, consider the code that follows a magic incantation to produce XML output."*

> *"We apply the do-nothing transformation to the document and capture its output. To include a DOCTYPE node in the output, we also need to set the SYSTEM and PUBLIC identifiers as output properties."*

```java
// construct the do-nothing transformation
Transformer t = TransformerFactory.newInstance().newTransformer();
// set output properties to get a DOCTYPE node
t.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM, systemIdentifier);
t.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC, publicIdentifier);
// set indentation
t.setOutputProperty(OutputKeys.INDENT, "yes");
t.setOutputProperty(OutputKeys.METHOD, "xml");
t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
// apply the do-nothing transformation and send the output to a file
t.transform(new DOMSource(doc), new StreamResult(new FileOutputStream(file)));
```

**Dịch:** **Hơi lạ là việc ghi một DOM tree ra output stream lại không dễ.** Cách dễ nhất là dùng **API XSLT (Extensible Stylesheet Language Transformations)** — xem [[09 - XSL Transformations]]. Còn ngay lúc này, cứ **coi đoạn code sau như một câu thần chú** để sinh XML output. Ta **áp dụng phép biến đổi không-làm-gì (do-nothing transformation)** lên document và **bắt lấy output của nó**. Để **đưa một node `DOCTYPE` vào output**, ta còn phải **set định danh `SYSTEM` và `PUBLIC` làm output property**.

### Cách 2 — LSSerializer

> *"Another approach is to use the LSSerializer interface. To get an instance, you have to use the following magic incantation:"*

```java
DOMImplementation impl = doc.getImplementation();
var implLS = (DOMImplementationLS) impl.getFeature("LS", "3.0");
LSSerializer ser = implLS.createLSSerializer();
```

> *"If you want spaces and line breaks, set this flag:"*

```java
ser.getDomConfig().setParameter("format-pretty-print", true);
```

> *"Then it’s simple enough to convert a document to a string:"*

```java
String str = ser.writeToString(doc);
```

> *"If you want to write the output directly to a file, you need an LSOutput:"*

```java
LSOutput out = implLS.createLSOutput();
out.setEncoding("UTF-8");
out.setByteStream(Files.newOutputStream(path));
ser.write(doc, out);
```

**Dịch:** Một cách khác là dùng interface **`LSSerializer`**. Muốn lấy một instance thì phải dùng **câu thần chú** trên. Nếu bạn muốn có **dấu cách và ngắt dòng**, set flag **`"format-pretty-print"`**. Rồi việc **chuyển một document thành chuỗi** đủ đơn giản. Nếu muốn **ghi thẳng output ra file**, bạn cần một **`LSOutput`**.

### API (ghi DOM)

#### `javax.xml.parsers.DocumentBuilder` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Document newDocument()` | trả về một **document rỗng**. |

#### `org.w3c.dom.Document` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Element createElement(String name)`<br>`Element createElementNS(String uri, String qname)` | tạo một element với tên đã cho. |
| `Text createTextNode(String data)` | tạo một **text node** với data đã cho. |

#### `org.w3c.dom.Node` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Node appendChild(Node child)` | **thêm một node vào danh sách con** của node này. Trả về node vừa thêm. |

#### `org.w3c.dom.Element` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setAttribute(String name, String value)`<br>`void setAttributeNS(String uri, String qname, String value)` | set attribute có tên đã cho về giá trị đã cho. Nếu qualified name **có alias prefix** thì **`uri` không được là `null`**. |

#### `javax.xml.transform.TransformerFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static TransformerFactory newInstance()` | trả về một instance của class `TransformerFactory`. |
| `Transformer newTransformer()` | trả về một instance của class `Transformer` thực hiện **phép biến đổi đồng nhất (identity / do-nothing)**. |

#### `javax.xml.transform.Transformer` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setOutputProperty(String name, String value)` | set một **output property**. Xem `www.w3.org/TR/xslt#output` để có danh sách output property chuẩn. |
| `void transform(Source from, Result to)` | **biến đổi** một XML document. |

**Các output property hữu dụng nhất** (dịch từ bảng trong sách):

| Property | Ý nghĩa |
|---|---|
| `doctype-public` | **public ID** dùng trong khai báo `DOCTYPE` |
| `doctype-system` | **system ID** dùng trong khai báo `DOCTYPE` |
| `indent` | `"yes"` hoặc `"no"` |
| `method` | `"xml"`, `"html"`, `"text"`, hoặc một chuỗi tuỳ chỉnh |

#### `javax.xml.transform.dom.DOMSource` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `DOMSource(Node n)` | dựng một source từ node đã cho. Thường thì `n` là một **document node**. |

#### `javax.xml.transform.stream.StreamResult` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `StreamResult(File f)`<br>`StreamResult(OutputStream out)`<br>`StreamResult(Writer out)`<br>`StreamResult(String systemID)` | dựng một stream result từ một file, stream, writer, hoặc system ID (thường là **URL tương đối hoặc tuyệt đối**). |

---

## 3.8.4. Writing an XML Document with StAX

> *"In the preceding section, you saw how to produce an XML document by writing a DOM tree. If you have no other use for the DOM tree, that approach is not very efficient."*

> *"The StAX API lets you write an XML tree directly. Construct an XMLStreamWriter from an OutputStream:"*

```java
XMLOutputFactory factory = XMLOutputFactory.newInstance();
XMLStreamWriter writer = factory.createXMLStreamWriter(out);
```

**Dịch:** Nếu bạn **không dùng DOM tree vào việc gì khác** thì cách trên **không hiệu quả lắm**. API **StAX cho phép ghi cây XML trực tiếp**. Dựng một `XMLStreamWriter` từ một `OutputStream`.

> *"To produce the XML header, call"*

```java
writer.writeStartDocument()
```

> *"Then call"*

```java
writer.writeStartElement(name);
```

> *"Add attributes by calling"*

```java
writer.writeAttribute(name, value);
```

> *"Now you can add child elements by calling writeStartElement again, or write characters with"*

```java
writer.writeCharacters(text);
```

> *"When you have written all child nodes, call"*

```java
writer.writeEndElement();
```

> *"This causes the current element to be closed."*

**Dịch:** Để sinh **XML header** thì gọi `writeStartDocument()`. Rồi gọi `writeStartElement(name)`. **Thêm attribute** bằng `writeAttribute`. Giờ bạn **thêm child element** bằng cách gọi lại `writeStartElement`, hoặc **ghi ký tự** bằng `writeCharacters`. Khi đã ghi xong mọi node con thì gọi `writeEndElement()` — **element hiện tại được đóng lại**.

> *"To write an element without children (such as `<img . . ./>`), use the call"*

```java
writer.writeEmptyElement(name);
```

> *"Finally, at the end of the document, call"*

```java
writer.writeEndDocument();
```

> *"This call closes any open elements."*

**Dịch:** Để ghi một **element không có con**, dùng `writeEmptyElement`. Cuối cùng, ở cuối document, gọi `writeEndDocument()` — lời gọi này **đóng mọi element còn mở**.

> *"You still need to close the XMLStreamWriter, and you need to do it manually since the XMLStreamWriter interface does not extend the AutoCloseable interface."*

**Dịch:** Bạn **vẫn phải close `XMLStreamWriter`**, và phải **làm thủ công** vì interface `XMLStreamWriter` **không extend interface `AutoCloseable`**.

> *"As with the DOM/XSLT approach, you don’t have to worry about escaping characters in attribute values and character data. However, it is possible to produce malformed XML, such as a document with multiple root nodes. Also, the current version of StAX has no support for producing indented output."*

**Dịch:** Giống cách DOM/XSLT, bạn **không phải lo escape ký tự** trong giá trị attribute và character data. Tuy nhiên, **có khả năng sinh ra XML dị dạng (malformed)** — ví dụ một document có **nhiều root node**. Ngoài ra, **phiên bản StAX hiện tại không hỗ trợ sinh output có thụt lề**.

---

## 3.8.5. An Example: Generating an SVG File

> *"Listing 3.9 is a typical program that produces XML output. The program draws a modernist painting—a random set of colored rectangles (see Figure 3.3). To save our masterpiece, we use the Scalable Vector Graphics (SVG) format. SVG is an XML format to describe complex graphics in a device-independent fashion. You can find more information about SVG at www.w3.org/Graphics/SVG. To view SVG files, simply use any modern browser."*

**Dịch:** Listing 3.9 là chương trình điển hình sinh XML output. Chương trình vẽ một **bức tranh theo lối hiện đại** — một **tập hình chữ nhật màu ngẫu nhiên**. Để lưu **kiệt tác** đó, ta dùng định dạng **SVG (Scalable Vector Graphics)**. SVG là **một định dạng XML để mô tả đồ hoạ phức tạp theo cách độc lập thiết bị**. Để xem file SVG, chỉ cần **dùng bất kỳ trình duyệt hiện đại nào**.

> *"The program demonstrates two ways of producing XML: by constructing and saving a DOM tree, and by directly writing the XML with the StAX API."*

**Dịch:** Chương trình minh hoạ **hai cách sinh XML**: **dựng và lưu một DOM tree**, và **ghi thẳng XML bằng API StAX**.

> *"We don’t need to go into details about SVG; for our purposes, we just need to know how to express a set of colored rectangles. Here is a sample:"*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20000802//EN"
  "http://www.w3.org/TR/2000/CR-SVG-20000802/DTD/svg-20000802.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
  <rect x="231" y="61" width="9" height="12" fill="#6e4a13"/>
  <rect x="107" y="106" width="56" height="5" fill="#c406be"/>
  . . .
</svg>
```

> *"As you can see, each rectangle is described as a rect node. The position, width, height, and fill color are attributes. The fill color is an RGB value in hexadecimal."*

**Dịch:** Mỗi hình chữ nhật được mô tả bằng một **node `rect`**. **Vị trí, chiều rộng, chiều cao và màu tô là attribute**. **Màu tô là giá trị RGB dạng thập lục phân.**

> **Note (sách):** *"SVG uses attributes heavily. In fact, some attributes are quite complex. For example, here is a path element:"*
>
> ```xml
> <path d="M 100 100 L 300 100 L 200 300 z">
> ```
>
> *"The M denotes a “moveto” command, L is “lineto,” and z is “closepath” (!). Apparently, the designers of this data format didn’t have much confidence in using XML for structured data. In your own XML formats, you might want to use elements instead of complex attributes."*
>
> **Dịch:** **SVG dùng attribute rất nhiều.** Thực tế, một số attribute **khá phức tạp**. Ví dụ với element `path`: `M` ký hiệu lệnh **"moveto"**, `L` là **"lineto"**, và `z` là **"closepath"** (!). Có vẻ như những người thiết kế định dạng data này **không mấy tin tưởng vào việc dùng XML cho structured data**. Trong định dạng XML của riêng bạn, có lẽ nên **dùng element thay cho attribute phức tạp**.

### Listing 3.9 — `write/XMLWriteTest.java`

```java
package write;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.xml.parsers.*;
import javax.xml.stream.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

import org.w3c.dom.*;
/**
 * This program shows how to write an XML file. It produces modern art in SVG
 * format.
 * @version 1.12 2016-04-27
 * @author Cay Horstmann
 */
public class XMLWriteTest
{
    public static void main(String[] args) throws Exception
    {
        Document doc = newDrawing(600, 400);
        writeDocument(doc, "drawing1.svg");
        writeNewDrawing(600, 400, "drawing2.svg");
    }

    private static Random generator = new Random();

    /**
     * Creates a new random drawing.
     * @param drawingWidth the width of the drawing in pixels
     * @param drawingHeight the width of the drawing in pixels
     * @return the DOM tree of the SVG document
     */
    public static Document newDrawing(int drawingWidth, int drawingHeight)
        throws ParserConfigurationException
    {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();;
        var namespace = "http://www.w3.org/2000/svg";
        Document doc = builder.newDocument();
        Element svgElement = doc.createElementNS(namespace, "svg");
        doc.appendChild(svgElement);
        svgElement.setAttribute("width", "" + drawingWidth);
        svgElement.setAttribute("height", "" + drawingHeight);
        int n = 10 + generator.nextInt(20);
        for (int i = 1; i <= n; i++)
        {
            int x = generator.nextInt(drawingWidth);
            int y = generator.nextInt(drawingHeight);
            int width = generator.nextInt(drawingWidth - x);
            int height = generator.nextInt(drawingHeight - y);
            int r = generator.nextInt(256);
            int g = generator.nextInt(256);
            int b = generator.nextInt(256);

            Element rectElement = doc.createElementNS(namespace, "rect");
            rectElement.setAttribute("x", "" + x);
            rectElement.setAttribute("y", "" + y);
            rectElement.setAttribute("width", "" + width);
            rectElement.setAttribute("height", "" + height);
            rectElement.setAttribute("fill", String.format("#%02x%02x%02x", r, g, b));
            svgElement.appendChild(rectElement);
        }
        return doc;
    }

    /**
     * Saves a document using DOM/XSLT
     * @param doc the document to be written
     * @param filename the name of the destination file
     */
    public static void writeDocument(Document doc, String filename)
        throws TransformerException, IOException
    {
        Transformer t = TransformerFactory.newInstance().newTransformer();
        t.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM,
            "http://www.w3.org/TR/2000/CR-SVG-20000802/DTD/svg-20000802.dtd");
        t.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC, "-//W3C//DTD SVG 20000802//EN");
        t.setOutputProperty(OutputKeys.INDENT, "yes");
        t.setOutputProperty(OutputKeys.METHOD, "xml");
        t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        t.transform(new DOMSource(doc), new StreamResult(
            Files.newOutputStream(Paths.get(filename))));
    }

    /**
     * Uses StAX to write an SVG document with a random drawing.
     * @param drawingWidth the width of the drawing in pixels
     * @param drawingHeight the width of the drawing in pixels
     * @param filename the name of the destination file
     */
    public static void writeNewDrawing(int drawingWidth, int drawingHeight,
        String filename) throws XMLStreamException, IOException
    {
        XMLOutputFactory factory = XMLOutputFactory.newInstance();
        XMLStreamWriter writer = factory.createXMLStreamWriter(
            Files.newOutputStream(Paths.get(filename)));
        writer.writeStartDocument();
        writer.writeDTD("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20000802//EN\" "
            + "\"http://www.w3.org/TR/2000/CR-SVG-20000802/DTD/svg-20000802.dtd\">");
        writer.writeStartElement("svg");
        writer.writeDefaultNamespace("http://www.w3.org/2000/svg");
        writer.writeAttribute("width", "" + drawingWidth);
        writer.writeAttribute("height", "" + drawingHeight);
        int n = 10 + generator.nextInt(20);
        for (int i = 1; i <= n; i++)
        {
            int x = generator.nextInt(drawingWidth);
            int y = generator.nextInt(drawingHeight);
            int width = generator.nextInt(drawingWidth - x);
            int height = generator.nextInt(drawingHeight - y);
            int r = generator.nextInt(256);
            int g = generator.nextInt(256);
            int b = generator.nextInt(256);
            writer.writeEmptyElement("rect");
            writer.writeAttribute("x", "" + x);
            writer.writeAttribute("y", "" + y);
            writer.writeAttribute("width", "" + width);
            writer.writeAttribute("height", "" + height);
            writer.writeAttribute("fill", String.format("#%02x%02x%02x", r, g, b));
        }
        writer.writeEndDocument(); // closes svg element
    }
}
```

---

## API (StAX ghi)

### `javax.xml.stream.XMLOutputFactory` 6

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static XMLOutputFactory newInstance()` | trả về một instance của class `XMLOutputFactory`. |
| `XMLStreamWriter createXMLStreamWriter(OutputStream stream)`<br>`XMLStreamWriter createXMLStreamWriter(OutputStream stream, String encoding)`<br>`XMLStreamWriter createXMLStreamWriter(Writer writer)`<br>`XMLStreamWriter createXMLStreamWriter(Result result)` | tạo một writer ghi ra stream, writer, hoặc **JAXP result** đã cho. |

### `javax.xml.stream.XMLStreamWriter` 6

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void writeStartDocument()`<br>`void writeStartDocument(String xmlVersion)`<br>`void writeStartDocument(String encoding, String xmlVersion)` | ghi **processing instruction XML** ở đầu document. Lưu ý parameter `encoding` **chỉ được dùng để ghi attribute**; nó **không set character encoding của output**. |
| `void setDefaultNamespace(String namespaceURI)`<br>`void setPrefix(String prefix, String namespaceURI)` | set **default namespace** hoặc namespace gắn với một prefix. Khai báo có **phạm vi trong element hiện tại**, hoặc nếu chưa element nào được ghi thì **trong document root**. |
| `void writeStartElement(String localName)`<br>`void writeStartElement(String namespaceURI, String localName)` | ghi một **start tag**, thay `namespaceURI` bằng prefix tương ứng. |
| `void writeEndElement()` | **đóng element hiện tại**. |
| `void writeEndDocument()` | **đóng mọi element còn mở**. |
| `void writeEmptyElement(String localName)`<br>`void writeEmptyElement(String namespaceURI, String localName)` | ghi một **tag tự đóng**, thay `namespaceURI` bằng prefix tương ứng. |
| `void writeAttribute(String localName, String value)`<br>`void writeAttribute(String namespaceURI, String localName, String value)` | ghi một **attribute** cho element hiện tại, thay `namespaceURI` bằng prefix tương ứng. |
| `void writeCharacters(String text)` | ghi **character data**. |
| `void writeCData(String text)` | ghi một **block CDATA**. |
| `void writeDTD(String dtd)` | ghi chuỗi `dtd`, được giả định là **chứa một khai báo `DOCTYPE`**. |
| `void writeComment(String comment)` | ghi một **comment**. |
| `void close()` | **close** writer này. |

---

## Bài kế tiếp

→ [[09 - XSL Transformations]] — stylesheet XSLT, template, `xsl:value-of`, `Source`/`Result`, biến legacy data thành XML.
