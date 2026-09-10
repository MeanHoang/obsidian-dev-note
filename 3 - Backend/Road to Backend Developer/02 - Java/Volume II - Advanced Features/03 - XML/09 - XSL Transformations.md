# 09 — XSL Transformations

> Chapter 3, Section 3.9 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.9. XSL Transformations

> *"The XSL Transformations (XSLT) mechanism allows you to specify rules for transforming XML documents into other formats, such as plain text, XHTML, or any other XML format. XSLT is commonly used to translate from one machine-readable XML format to another, or to translate XML into a presentation format for human consumption."*

**Dịch:** Cơ chế **XSL Transformations (XSLT)** cho phép bạn **chỉ định rule biến đổi XML document sang định dạng khác**, như **plain text**, **XHTML**, hoặc **bất kỳ định dạng XML nào khác**. XSLT thường được dùng để **dịch từ một định dạng XML máy đọc được sang một định dạng khác**, hoặc để **dịch XML sang định dạng trình bày cho con người xem**.

> *"You need to provide an XSLT stylesheet that describes the conversion of XML documents into some other format. An XSLT processor reads an XML document and the stylesheet and produces the desired output (see Figure 3.4)."*

**Dịch:** Bạn phải cung cấp một **XSLT stylesheet** mô tả việc **chuyển đổi XML document sang định dạng khác**. Một **XSLT processor** đọc **XML document** và **stylesheet** rồi **sinh ra output mong muốn**.

```
   XML document ──┐
                  ├──►  XSLT processor  ──►  output
   stylesheet ────┘
```

> *"The XSLT specification is quite complex, and entire books have been written on the subject. We can’t possibly discuss all the features of XSLT, so we will just work through a representative example. You can find more information in the book Essential XML by Don Box et al. The XSLT specification is available at www.w3.org/TR/xslt."*

**Dịch:** Specification của XSLT **khá phức tạp**, và **cả những cuốn sách trọn vẹn đã được viết về chủ đề này**. Sách **không thể bàn hết mọi tính năng của XSLT**, nên chỉ **đi qua một ví dụ tiêu biểu**.

---

## Ví dụ: XML nhân sự → bảng HTML

> *"Suppose we want to transform XML files with employee records into HTML documents. Consider this input file:"*

```xml
<staff>
  <employee>
    <name>Carl Cracker</name>
    <salary>75000.0</salary>
    <hiredate year="1987" month="12" day="15"/>
  </employee>
  <employee>
    <name>Harry Hacker</name>
    <salary>50000.0</salary>
    <hiredate year="1989" month="10" day="1"/>
  </employee>
  <employee>
    <name>Tony Tester</name>
    <salary>40000.0</salary>
    <hiredate year="1990" month="3" day="15"/>
  </employee>
</staff>
```

> *"The desired output is an HTML table:"*

```html
<table border="1">
  <tr>
    <td>Carl Cracker</td><td>$75000.0</td><td>1987-12-15</td>
  </tr>
  <tr>
    <td>Harry Hacker</td><td>$50000.0</td><td>1989-10-1</td>
  </tr>
  <tr>
    <td>Tony Tester</td><td>$40000.0</td><td>1990-3-15</td>
  </tr>
</table>
```

**Dịch:** Giả sử ta muốn **biến đổi file XML chứa employee record thành HTML document**. Input như trên, **output mong muốn là một bảng HTML**.

### Cấu trúc stylesheet

> *"A stylesheet with transformation templates has this form:"*

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="1.0">

  <xsl:output method="html"/>

  template1
  template2
  . . .
</xsl:stylesheet>
```

> *"In our example, the xsl:output element specifies the method as HTML. Other valid method settings are xml and text."*

**Dịch:** Một stylesheet chứa **transformation template** có dạng trên. Ở ví dụ này, element **`xsl:output`** chỉ định **method là `html`**. Các giá trị method hợp lệ khác là **`xml`** và **`text`**.

### Template

> *"Here is a typical template:"*

```xml
<xsl:template match="/staff/employee">
  <tr><xsl:apply-templates/></tr>
</xsl:template>
```

> *"The value of the match attribute is an XPath expression. The template states: Whenever you see a node in the XPath set /staff/employee, do the following:"*
>
> *"1. Emit the string `<tr>`.*
> *2. Keep applying templates as you process its children.*
> *3. Emit the string `</tr>` after you are done with all children."*
>
> *"In other words, this template generates the HTML table row markers around every employee record."*

**Dịch:** Giá trị của attribute **`match` là một biểu thức XPath** (xem [[05 - Locating Information with XPath]]). Template nói: **hễ thấy một node trong tập XPath `/staff/employee`** thì làm ba việc — **phát ra chuỗi `<tr>`** · **tiếp tục áp dụng template khi xử lý các con của nó** · **phát ra chuỗi `</tr>` sau khi xong hết các con**. Nói cách khác, template này **sinh ra dấu hiệu hàng bảng HTML bao quanh từng employee record**.

> *"The XSLT processor starts processing by examining the root element. Whenever a node matches one of the templates, it applies the template. (If multiple templates match, the best matching one is used; see the specification at www.w3.org/TR/xslt for the gory details.) If no template matches, the processor carries out a default action. For text nodes, the default is to include the contents in the output. For elements, the default action is to create no output but to keep processing the children."*

**Dịch:** XSLT processor **bắt đầu xử lý bằng cách xem xét root element**. Hễ một node **khớp một trong các template** thì nó **áp dụng template đó**. (Nếu **nhiều template cùng khớp** thì **cái khớp tốt nhất được dùng**.) Nếu **không template nào khớp**, processor thực hiện **hành động mặc định**:

| Loại node | Hành động mặc định |
|---|---|
| **text node** | **đưa nội dung vào output** |
| **element** | **không tạo output**, nhưng **tiếp tục xử lý các con** |

> *"Here is a template for transforming name nodes in an employee file:"*

```xml
<xsl:template match="/staff/employee/name">
  <td><xsl:apply-templates/></td>
</xsl:template>
```

> *"As you can see, the template produces the `<td>. . .</td>` delimiters, and it asks the processor to recursively visit the children of the name element. There is just one child—the text node. When the processor visits that node, it emits the text contents (provided, of course, that there is no other matching template)."*

**Dịch:** Template này sinh ra **cặp phân định `<td>. . .</td>`**, và **yêu cầu processor duyệt đệ quy các con** của element `name`. **Chỉ có một con — text node**. Khi processor duyệt node đó, nó **phát ra nội dung text** (tất nhiên là **với điều kiện không có template nào khác khớp**).

### xsl:value-of — sao chép giá trị attribute

> *"You have to work a little harder if you want to copy attribute values into the output. Here is an example:"*

```xml
<xsl:template match="/staff/employee/hiredate">
  <td><xsl:value-of select="@year"/>-<xsl:value-of
    select="@month"/>-<xsl:value-of select="@day"/></td>
</xsl:template>
```

> *"When processing a hiredate node, this template emits"*
>
> *"1. The string `<td>`*
> *2. The value of the year attribute*
> *3. A hyphen*
> *4. The value of the month attribute*
> *5. A hyphen*
> *6. The value of the day attribute*
> *7. The string `</td>`"*

**Dịch:** Bạn phải **làm nhiều hơn một chút** nếu muốn **sao chép giá trị attribute vào output**. Khi xử lý một node `hiredate`, template này phát ra **7 thứ theo thứ tự** trên.

> *"The xsl:value-of statement computes the string value of a node set. The node set is specified by the XPath value of the select attribute. In this case, the path is relative to the currently processed node. The node set is converted to a string by concatenation of the string values of all nodes. The string value of an attribute node is its value. The string value of a text node is its contents. The string value of an element node is the concatenation of the string values of its child nodes (but not its attributes)."*

**Dịch:** Câu lệnh **`xsl:value-of` tính giá trị chuỗi của một node set**. Node set được chỉ định bởi **giá trị XPath của attribute `select`**. Trong trường hợp này, **path là tương đối so với node đang được xử lý**. Node set được **chuyển thành chuỗi bằng cách nối giá trị chuỗi của mọi node**:

| Loại node | Giá trị chuỗi |
|---|---|
| **attribute node** | **giá trị của nó** |
| **text node** | **nội dung của nó** |
| **element node** | **nối giá trị chuỗi của các node con** (**nhưng không gồm attribute** của nó) |

---

## Đổi stylesheet, đổi output

> *"Listing 3.10 contains the stylesheet for turning an XML file with employee records into an HTML table."*

> *"Listing 3.11 shows a different set of transformations. The input is the same XML file, and the output is plain text in the familiar property file format:"*

```
employee.1.name=Carl Cracker
employee.1.salary=75000.0
employee.1.hiredate=1987-12-15
employee.2.name=Harry Hacker
employee.2.salary=50000.0
employee.2.hiredate=1989-10-1
employee.3.name=Tony Tester
employee.3.salary=40000.0
employee.3.hiredate=1990-3-15
```

> *"That example uses the position() function which yields the position of the current node as seen from its parent. We thus get an entirely different output simply by switching the stylesheet. This means you can safely use XML to describe your data; if some applications need the data in another format, just use XSLT to generate the alternative format."*

**Dịch:** Listing 3.11 cho thấy **một bộ biến đổi khác**: **input là cùng file XML**, còn **output là plain text ở định dạng property file quen thuộc** (xem [[01 - Introducing XML]]). Ví dụ đó dùng function **`position()`**, cho ra **vị trí của node hiện tại nhìn từ cha của nó**. Vậy là ta có **output hoàn toàn khác chỉ bằng cách đổi stylesheet**. Nghĩa là bạn **yên tâm dùng XML để mô tả data của mình**; nếu **ứng dụng nào cần data ở định dạng khác** thì **cứ dùng XSLT để sinh định dạng thay thế**.

---

## XSLT trên nền tảng Java

> *"It is simple to generate XSL transformations on the Java platform. Set up a transformer factory for each stylesheet. Then, get a transformer object and tell it to transform a source to a result:"*

```java
var styleSheet = new File(filename);
var styleSource = new StreamSource(styleSheet);
Transformer t = TransformerFactory.newInstance().newTransformer(styleSource);
t.transform(source, result);
```

**Dịch:** Sinh XSL transformation trên nền tảng Java **rất đơn giản**. **Dựng một transformer factory cho mỗi stylesheet**, rồi **lấy một object transformer** và **bảo nó biến đổi một `source` thành một `result`**.

### Source

> *"The parameters of the transform method are objects of classes that implement the Source and Result interfaces. Several classes implement the Source interface:"*

```
DOMSource
SAXSource
StAXSource
StreamSource
```

> *"You can construct a StreamSource from a file, stream, reader, or URL, and a DOMSource from the node of a DOM tree. For example, in the preceding section, we invoked the identity transformation as"*

```java
t.transform(new DOMSource(doc), result);
```

**Dịch:** Parameter của method `transform` là **object của các class implement interface `Source` và `Result`**. Có **bốn class implement `Source`**. Bạn dựng **`StreamSource`** từ một **file, stream, reader, hoặc URL**, và **`DOMSource`** từ một **node của DOM tree**.

### Biến data không phải XML thành XML

> *"In our example program, we do something slightly more interesting. Instead of starting out with an existing XML file, we produce a SAX XML reader that gives the illusion of parsing an XML file by emitting appropriate SAX events. Actually, our XML reader reads a flat file, as described in Chapter 1. The input file looks like this:"*

```
Carl Cracker|75000.0|1987|12|15
Harry Hacker|50000.0|1989|10|1
Tony Tester|40000.0|1990|3|15
```

**Dịch:** Trong chương trình ví dụ, sách làm một việc **thú vị hơn một chút**. Thay vì bắt đầu từ một file XML có sẵn, ta **tạo ra một SAX XML reader gây ảo giác rằng nó đang parse một file XML** bằng cách **phát ra các SAX event thích hợp**. Thực ra XML reader của ta **đọc một flat file**.

> *"Our XML reader generates SAX events as it processes the input. Here is a part of the parse method of the EmployeeReader class that implements the XMLReader interface:"*

```java
var attributes = new AttributesImpl();
handler.startDocument();
handler.startElement("", "staff", "staff", attributes);
while ((line = in.readLine()) != null)
{
    handler.startElement("", "employee", "employee", attributes);
    var tokenizer = new StringTokenizer(line, "|");
    handler.startElement("", "name", "name", attributes);
    String s = tokenizer.nextToken();
    handler.characters(s.toCharArray(), 0, s.length());
    handler.endElement("", "name", "name");
    . . .
    handler.endElement("", "employee", "employee");
}
handler.endElement("", rootElement, rootElement);
handler.endDocument();
```

> *"The SAXSource for the transformer is constructed from the XML reader:"*

```java
t.transform(new SAXSource(new EmployeeReader(),
    new InputSource(new FileInputStream(filename))), result);
```

> *"This is an ingenious trick to convert non-XML legacy data into XML. Of course, most XSLT applications will already have XML input data, and you can simply invoke the transform method on a StreamSource:"*

```java
t.transform(new StreamSource(file), result);
```

**Dịch:** XML reader của ta **sinh SAX event trong lúc xử lý input** (xem [[07 - Streaming Parsers]]). **`SAXSource`** cho transformer được **dựng từ XML reader**. Đây là một **thủ thuật tài tình để chuyển legacy data không phải XML thành XML**. Dĩ nhiên, **phần lớn ứng dụng XSLT vốn đã có sẵn input data là XML**, và bạn chỉ việc **gọi `transform` trên một `StreamSource`**.

### Result

> *"The transformation result is an object of a class that implements the Result interface. The Java library supplies three classes:"*

```
DOMResult
SAXResult
StreamResult
```

> *"To store the result in a DOM tree, use a DocumentBuilder to generate a new document node and wrap it into a DOMResult:"*

```java
Document doc = builder.newDocument();
t.transform(source, new DOMResult(doc));
```

> *"To save the output in a file, use a StreamResult:"*

```java
t.transform(source, new StreamResult(file));
```

**Dịch:** **Kết quả biến đổi là object của một class implement interface `Result`.** Java library cung cấp **ba class**. Để **lưu kết quả vào DOM tree**, dùng một `DocumentBuilder` sinh ra **document node mới** rồi **bọc nó vào một `DOMResult`**. Để **lưu output ra file**, dùng một **`StreamResult`**.

---

## Listing

### Listing 3.10 — `transform/makehtml.xsl`

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="1.0">

<xsl:output method="html"/>

<xsl:template match="/staff">
  <table border="1"><xsl:apply-templates/></table>
</xsl:template>

<xsl:template match="/staff/employee">
  <tr><xsl:apply-templates/></tr>
</xsl:template>

<xsl:template match="/staff/employee/name">
  <td><xsl:apply-templates/></td>
</xsl:template>

<xsl:template match="/staff/employee/salary">
  <td>$<xsl:apply-templates/></td>
</xsl:template>

<xsl:template match="/staff/employee/hiredate">
  <td><xsl:value-of select="@year"/>-<xsl:value-of
    select="@month"/>-<xsl:value-of select="@day"/></td>
</xsl:template>

</xsl:stylesheet>
```

### Listing 3.11 — `transform/makeprop.xsl`

```xml
<?xml version="1.0"?>

<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="1.0">

<xsl:output method="text" omit-xml-declaration="yes"/>

<xsl:template match="/staff/employee">
employee.<xsl:value-of select="position()"
/>.name=<xsl:value-of select="name/text()"/>
employee.<xsl:value-of select="position()"
/>.salary=<xsl:value-of select="salary/text()"/>
employee.<xsl:value-of select="position()"
/>.hiredate=<xsl:value-of select="hiredate/@year"
/>-<xsl:value-of select="hiredate/@month"
/>-<xsl:value-of select="hiredate/@day"/>
</xsl:template>

</xsl:stylesheet>
```

### Listing 3.12 — `transform/TransformTest.java`

```java
package transform;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.xml.transform.*;
import javax.xml.transform.sax.*;
import javax.xml.transform.stream.*;
import org.xml.sax.*;
import org.xml.sax.helpers.*;

/**
 * This program demonstrates XSL transformations. It applies a transformation to a set of
 * employee records. The records are stored in the file employee.dat and turned into XML
 * format. Specify the stylesheet on the command line, e.g.<br>
 *    java transform.TransformTest transform/makeprop.xsl
 * @version 1.04 2018-04-10
 * @author Cay Horstmann
 */
public class TransformTest
{
    public static void main(String[] args) throws Exception
    {
        Path path;
        if (args.length > 0) path = Paths.get(args[0]);
        else path = Paths.get("transform", "makehtml.xsl");
        try (InputStream styleIn = Files.newInputStream(path))
        {
            var styleSource = new StreamSource(styleIn);

            Transformer t = TransformerFactory.newInstance().newTransformer(styleSource);
            t.setOutputProperty(OutputKeys.INDENT, "yes");
            t.setOutputProperty(OutputKeys.METHOD, "xml");
            t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");

            try (InputStream docIn = Files.newInputStream(Paths.get("transform", "employee.dat")))
            {
                t.transform(new SAXSource(new EmployeeReader(), new InputSource(docIn)),
                    new StreamResult(System.out));
            }
        }
    }
}

/**
 * This class reads the flat file employee.dat and reports SAX parser events to act as if it
 * was parsing an XML file.
 */
class EmployeeReader implements XMLReader
{
    private ContentHandler handler;

    public void parse(InputSource source) throws IOException, SAXException
    {
        InputStream stream = source.getByteStream();
        var in = new BufferedReader(new InputStreamReader(stream));
        String rootElement = "staff";
        var atts = new AttributesImpl();

        if (handler == null) throw new SAXException("No content handler");

        handler.startDocument();
        handler.startElement("", rootElement, rootElement, atts);
        String line;
        while ((line = in.readLine()) != null)
        {
            handler.startElement("", "employee", "employee", atts);
            var t = new StringTokenizer(line, "|");

            handler.startElement("", "name", "name", atts);
            String s = t.nextToken();
            handler.characters(s.toCharArray(), 0, s.length());
            handler.endElement("", "name", "name");

            handler.startElement("", "salary", "salary", atts);
            s = t.nextToken();
            handler.characters(s.toCharArray(), 0, s.length());
            handler.endElement("", "salary", "salary");

            atts.addAttribute("", "year", "year", "CDATA", t.nextToken());
            atts.addAttribute("", "month", "month", "CDATA", t.nextToken());
            atts.addAttribute("", "day", "day", "CDATA", t.nextToken());
            handler.startElement("", "hiredate", "hiredate", atts);
            handler.endElement("", "hiredate", "hiredate");
            atts.clear();

            handler.endElement("", "employee", "employee");
        }

        handler.endElement("", rootElement, rootElement);
        handler.endDocument();
    }

    public void setContentHandler(ContentHandler newValue)
    {
        handler = newValue;
    }

    public ContentHandler getContentHandler()
    {
        return handler;
    }

    // the following methods are just do-nothing implementations
    public void parse(String systemId) throws IOException, SAXException {}
    public void setErrorHandler(ErrorHandler handler) {}
    public ErrorHandler getErrorHandler() { return null; }
    public void setDTDHandler(DTDHandler handler) {}
    public DTDHandler getDTDHandler() { return null; }
    public void setEntityResolver(EntityResolver resolver) {}
    public EntityResolver getEntityResolver() { return null; }
    public void setProperty(String name, Object value) {}
    public Object getProperty(String name) { return null; }
    public void setFeature(String name, boolean value) {}
    public boolean getFeature(String name) { return false; }
}
```

---

## API

### `javax.xml.transform.TransformerFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Transformer newTransformer(Source styleSheet)` | trả về một instance của class `Transformer` **đọc một stylesheet từ source đã cho**. |

### `javax.xml.transform.stream.StreamSource` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `StreamSource(File f)`<br>`StreamSource(InputStream in)`<br>`StreamSource(Reader in)`<br>`StreamSource(String systemID)` | dựng một stream source từ một file, stream, reader, hoặc system ID (thường là **URL tương đối hoặc tuyệt đối**). |

### `javax.xml.transform.sax.SAXSource` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `SAXSource(XMLReader reader, InputSource source)` | dựng một **SAX source** lấy data từ input source đã cho và **dùng reader đã cho để parse input**. |

### `org.xml.sax.XMLReader` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setContentHandler(ContentHandler handler)` | set handler **được thông báo các parse event** trong lúc input được parse. |
| `void parse(InputSource source)` | parse input từ input source đã cho và **gửi parse event tới content handler**. |

### `javax.xml.transform.dom.DOMResult` 1.4

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `DOMResult(Node n)` | dựng một source từ node đã cho. Thường thì `n` là một **document node mới**. |

### `org.xml.sax.helpers.AttributesImpl` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void addAttribute(String uri, String lname, String qname, String type, String value)` | **thêm một attribute** vào collection attribute này. Parameter `lname` là **local name không prefix**, `qname` là **qualified name có prefix**. Parameter `type` là một trong `"CDATA"`, `"ID"`, `"IDREF"`, `"IDREFS"`, `"NMTOKEN"`, `"NMTOKENS"`, `"ENTITY"`, `"ENTITIES"`, hoặc `"NOTATION"`. |
| `void clear()` | **xoá mọi attribute** khỏi collection attribute này. |

---

## Kết chương

> *"This example concludes our discussion of XML support in the Java library. You should now have a good perspective on the major strengths of XML—in particular, its automated parsing and validation as well as its powerful transformation mechanism. Of course, all this technology is only going to work for you if you design your XML formats well. You need to make sure that the formats are rich enough to express all your business needs, that they are stable over time, and that your business partners are willing to accept your XML documents. Those issues can be far more challenging than dealing with parsers, DTDs, or transformations."*

**Dịch:** Ví dụ này **khép lại phần bàn về hỗ trợ XML trong Java library**. Giờ bạn hẳn đã có **cái nhìn tốt về những điểm mạnh chính của XML** — cụ thể là **parsing và validation tự động** cũng như **cơ chế transformation mạnh mẽ** của nó. Dĩ nhiên, **mọi công nghệ này chỉ có ích nếu bạn thiết kế định dạng XML của mình cho tốt**. Bạn phải đảm bảo định dạng **đủ giàu để diễn tả mọi nhu cầu nghiệp vụ**, **ổn định theo thời gian**, và **đối tác kinh doanh của bạn sẵn lòng chấp nhận XML document của bạn**. **Những vấn đề đó có thể khó hơn nhiều so với việc xử lý parser, DTD hay transformation.**

> *"In the next chapter, we will discuss network programming on the Java platform, starting with the basics of network sockets and moving on to higher-level protocols for e-mail and the World Wide Web."*

**Dịch:** Chương kế tiếp bàn về **network programming** trên nền tảng Java, bắt đầu từ **những điều cơ bản về network socket** rồi tiến tới các **protocol cấp cao hơn cho e-mail và World Wide Web**.

---

## Chương kế tiếp

→ [[01 - Connecting to a Server]] — Chapter 4: Networking.
