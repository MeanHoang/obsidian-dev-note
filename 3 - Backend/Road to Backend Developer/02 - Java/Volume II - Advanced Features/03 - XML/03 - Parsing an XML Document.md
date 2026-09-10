# 03 — Parsing an XML Document

> Chapter 3, Section 3.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.3. Parsing an XML Document

> *"To process an XML document, you need to parse it. A parser is a program that reads a file, confirms that the file has the correct format, breaks it up into the constituent elements, and lets a programmer access those elements."*

**Dịch:** Muốn xử lý một XML document thì phải **parse** nó. **Parser** là một chương trình **đọc file**, **xác nhận file đúng định dạng**, **bẻ nó ra thành các element cấu thành**, và **cho lập trình viên truy cập những element đó**.

> *"The Java library supplies two kinds of XML parsers:"*
>
> *"• Tree parsers, such as a Document Object Model (DOM) parser, that read an XML document into a tree structure.*
> *• Streaming parsers, such as a Simple API for XML (SAX) parser, that generate events as they read an XML document."*

**Dịch:** Java library cung cấp **hai loại XML parser**:

| Loại | Mô tả |
|---|---|
| **Tree parser** | ví dụ **DOM (Document Object Model) parser** — đọc XML document **vào một cấu trúc cây** |
| **Streaming parser** | ví dụ **SAX (Simple API for XML) parser** — **sinh ra event** trong lúc đọc XML document |

> *"DOM parsers are easier to use for most purposes, so we explain them first. You may consider a streaming parser if you process very long documents whose tree structures would use up a lot of memory, or if you are only interested in a few elements and don’t care about their context."*

**Dịch:** **DOM parser dễ dùng hơn** cho phần lớn mục đích, nên sách nói về nó trước. Bạn nên cân nhắc **streaming parser** nếu xử lý **document rất dài** mà cấu trúc cây sẽ **ngốn nhiều memory**, hoặc nếu bạn **chỉ quan tâm vài element** và **không cần ngữ cảnh** của chúng. Xem [[07 - Streaming Parsers]].

---

## Lấy DocumentBuilder

> *"The DOM parser interface is standardized by the World Wide Web Consortium (W3C). The org.w3c.dom package contains the definitions of interface types such as Document and Element. Different suppliers, such as the Apache Organization and IBM, have written DOM parsers whose classes implement these interfaces. The Java API for XML Processing (JAXP) library actually makes it possible to plug in any of these parsers. But the JDK also comes with a DOM parser that is derived from the Apache parser."*

**Dịch:** **DOM parser interface** được **W3C chuẩn hoá**. Package `org.w3c.dom` chứa định nghĩa của các **interface** type như `Document` và `Element`. Nhiều nhà cung cấp khác nhau — Apache Organization, IBM… — đã viết DOM parser với các class **implement** những interface này. Thư viện **JAXP (Java API for XML Processing)** cho phép **cắm vào bất kỳ parser nào** trong số đó. Nhưng JDK cũng **kèm sẵn một DOM parser** dẫn xuất từ parser của Apache.

> *"To read an XML document, you need a DocumentBuilder object that you get from a DocumentBuilderFactory like this:"*

```java
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
```

> *"You can now read a document from a file:"*

```java
File f = . . .;
Document doc = builder.parse(f);
```

> *"Alternatively, you can use a URL:"*

```java
URL u = . . .;
Document doc = builder.parse(u.toString());
```

> *"You can even specify an arbitrary input stream:"*

```java
InputStream in = . . .;
Document doc = builder.parse(in);
```

**Dịch:** Để đọc một XML document, bạn cần một object `DocumentBuilder`, lấy từ một `DocumentBuilderFactory`. Sau đó đọc document từ **file**, từ **URL**, hoặc thậm chí từ một **input stream** bất kỳ (xem [[06 - Input and Output]]).

> **Note (sách):** *"If you use an input stream as an input source, the parser will not be able to locate other files that are referenced relative to the location of the document, such as a DTD in the same directory. You can install an “entity resolver” to overcome that problem. See www.xml.com/pub/a/2004/03/03/catalogs.html or www.ibm.com/developerworks/xml/library/x-mxd3.html for more information."*
>
> **Dịch:** Nếu bạn dùng **input stream** làm input source, parser sẽ **không định vị được các file khác được tham chiếu tương đối** so với vị trí document — ví dụ **một DTD nằm cùng thư mục**. Bạn cài một **"entity resolver"** để khắc phục.

---

## Duyệt cây DOM

> *"A Document object is an in-memory representation of the tree structure of an XML document. It is composed of objects whose classes implement the Node interface and its various subinterfaces. Figure 3.1 shows the inheritance hierarchy of the subinterfaces."*

**Dịch:** Một object `Document` là **biểu diễn trong bộ nhớ của cấu trúc cây** của một XML document. Nó gồm các object mà class của chúng **implement interface `Node`** và các **subinterface** khác nhau của nó.

> *"Start analyzing the contents of a document by calling the getDocumentElement method. It returns the root element."*

```java
Element root = doc.getDocumentElement();
```

> *"For example, if you are processing a document"*

```xml
<?xml version="1.0"?>
<font>
  . . .
</font>
```

> *"then calling getDocumentElement returns the font element."*

**Dịch:** Bắt đầu phân tích nội dung document bằng cách gọi method `getDocumentElement`. Nó **trả về root element** — ở ví dụ này là element `font`.

> *"The getTagName method returns the tag name of an element. In the preceding example, root.getTagName() returns the string "font"."*

**Dịch:** Method `getTagName` trả về **tag name** của một element. Ở ví dụ trên, `root.getTagName()` trả về chuỗi `"font"`.

### getChildNodes và NodeList

> *"To get an element’s children (which may be subelements, text, comments, or other nodes), use the getChildNodes method. That method returns a collection of type NodeList. That type was standardized before the standard Java collections, so it has a different access protocol. The item method gets the item with a given index, and the getLength method gives the total count of the items. You can enumerate all children like this:"*

```java
NodeList children = root.getChildNodes();
for (int i = 0; i < children.getLength(); i++)
{
    Node child = children.item(i);
    . . .
}
```

**Dịch:** Muốn lấy **các con** của một element (có thể là **subelement**, **text**, **comment**, hoặc node khác), dùng method `getChildNodes`. Method này trả về một collection kiểu **`NodeList`**. Kiểu này **được chuẩn hoá trước cả Java collections chuẩn**, nên nó có **giao thức truy cập khác** (xem [[03 - Concrete Collections]]). Method `item` lấy phần tử theo **index**, method `getLength` cho **tổng số phần tử**.

### Cẩn thận với whitespace

> *"Be careful when analyzing children. Suppose, for example, that you are processing the document"*

```xml
<font>
  <name>Helvetica</name>
  <size>36</size>
</font>
```

> *"You would expect the font element to have two children, but the parser reports five:"*
>
> *"• The whitespace between `<font>` and `<name>`*
> *• The name element*
> *• The whitespace between `</name>` and `<size>`*
> *• The size element*
> *• The whitespace between `</size>` and `</font>`"*

**Dịch:** **Cẩn thận khi phân tích các con.** Bạn tưởng element `font` có **hai con**, nhưng parser báo là **năm**:

```
font
 ├── whitespace   (giữa <font> và <name>)
 ├── name
 ├── whitespace   (giữa </name> và <size>)
 ├── size
 └── whitespace   (giữa </size> và </font>)
```

> *"If you expect only subelements, you can ignore the whitespace:"*

```java
for (int i = 0; i < children.getLength(); i++)
{
    Node child = children.item(i);
    if (child instanceof Element)
    {
        var childElement = (Element) child;
        . . .
    }
}
```

> *"Now you look at only two elements, with tag names name and size."*

**Dịch:** Nếu bạn chỉ mong đợi subelement thì có thể **bỏ qua whitespace** bằng kiểm tra `instanceof Element`. Giờ bạn chỉ nhìn thấy **hai element**, tag name là `name` và `size`.

> *"As you will see in the next section, you can do even better if your document has a DTD. Then the parser knows which elements don’t have text nodes as children, and it can suppress the whitespace for you."*

**Dịch:** Bạn còn làm tốt hơn nữa được **nếu document của bạn có DTD**. Khi đó parser **biết element nào không có text node làm con**, và nó **tự dập whitespace** giúp bạn. Xem [[04 - Validating XML Documents]].

### Lấy text bên trong element

> *"When analyzing the name and size elements, you want to retrieve the text strings that they contain. Those text strings are themselves contained in child nodes of type Text. You know that these Text nodes are the only children, so you can use the getFirstChild method without having to traverse another NodeList. Then, use the getData method to retrieve the string stored in a Text node:"*

```java
for (int i = 0; i < children.getLength(); i++)
{
    Node child = children.item(i);
    if (child instanceof Element)
    {
        var childElement = (Element) child;
        var textNode = (Text) childElement.getFirstChild();
        String text = textNode.getData().trim();
        if (childElement.getTagName().equals("name"))
            name = text;
        else if (childElement.getTagName().equals("size"))
            size = Integer.parseInt(text);
    }
}
```

**Dịch:** Khi phân tích element `name` và `size`, bạn muốn lấy ra **chuỗi text** mà chúng chứa. Bản thân các chuỗi text đó nằm trong **child node kiểu `Text`**. Bạn biết các `Text` node này là **con duy nhất**, nên dùng được `getFirstChild` mà **không phải duyệt thêm một `NodeList`** nữa. Rồi dùng `getData` để lấy chuỗi lưu trong `Text` node.

> **Tip (sách):** *"It is a good idea to call trim on the return value of the getData method. If the author of an XML file puts the beginning and the ending tags on separate lines, such as"*
>
> ```xml
> <size>
> 36
> </size>
> ```
>
> *"then the parser will include all line breaks and spaces in the text node data. Calling the trim method removes the whitespace surrounding the actual data."*
>
> **Dịch:** Nên gọi **`trim`** lên giá trị trả về của `getData` (xem [[05 - Strings]]). Nếu tác giả file XML đặt tag mở và tag đóng **trên các dòng riêng**, parser sẽ **gộp cả line break lẫn space** vào data của text node. Gọi `trim` **cắt bỏ whitespace** bao quanh data thật.

### Cách duyệt khác: getFirstChild + getNextSibling

> *"You can also get the last child with the getLastChild method, and the next sibling of a node with getNextSibling. Therefore, another way of traversing a node’s children is"*

```java
for (Node childNode = element.getFirstChild();
     childNode != null;
     childNode = childNode.getNextSibling())
{
    . . .
}
```

**Dịch:** Bạn cũng lấy được **con cuối** bằng `getLastChild`, và **anh em kế tiếp** của một node bằng `getNextSibling`. Vậy nên có **một cách khác để duyệt các con** như trên.

### Duyệt attribute

> *"To enumerate the attributes of a node, call the getAttributes method. It returns a NamedNodeMap object that contains Node objects describing the attributes. You can traverse the nodes in a NamedNodeMap the same way as in a NodeList. Then, call the getNodeName and getNodeValue methods to get the attribute names and values."*

```java
NamedNodeMap attributes = element.getAttributes();
for (int i = 0; i < attributes.getLength(); i++)
{
    Node attribute = attributes.item(i);
    String name = attribute.getNodeName();
    String value = attribute.getNodeValue();
    . . .
}
```

> *"Alternatively, if you know the name of an attribute, you can retrieve the corresponding value directly:"*

```java
String unit = element.getAttribute("unit");
```

**Dịch:** Muốn **liệt kê attribute** của một node thì gọi `getAttributes`. Nó trả về một object **`NamedNodeMap`** chứa các object `Node` mô tả attribute. Duyệt node trong `NamedNodeMap` **giống hệt** cách duyệt `NodeList`. Rồi gọi `getNodeName` và `getNodeValue` để lấy **tên** và **giá trị** attribute. Còn nếu **đã biết tên attribute**, lấy giá trị **trực tiếp** bằng `getAttribute`.

---

## Chương trình ví dụ

> *"You have now seen how to analyze a DOM tree. The program in Listing 3.1 puts these techniques to work by converting an XML document to JSON format."*

> *"The tree display clearly shows how child elements are surrounded by text containing whitespace and comments. You can clearly see the newline and return characters as \n."*

> *"You don’t have to be familiar with JSON to understand how the program works with the DOM tree. Simply observe the following:"*
>
> *"• We use a DocumentBuilder to read a Document from a file.*
> *• For each element, we print the tag name, attributes, and elements.*
> *• For character data, we produce a string with the data. If the data comes from a comment, we add a "Comment: " prefix."*

**Dịch:** Chương trình ở Listing 3.1 áp dụng các kỹ thuật trên bằng cách **chuyển một XML document sang định dạng JSON**. Phần hiển thị cây cho thấy rõ **child element bị bao quanh bởi text chứa whitespace và comment**; bạn thấy rõ ký tự newline và return dưới dạng `\n`. Bạn **không cần biết JSON** để hiểu chương trình làm việc với DOM tree ra sao, chỉ cần để ý: dùng `DocumentBuilder` đọc `Document` từ file · với mỗi element thì in **tag name, attribute và element** · với character data thì tạo chuỗi chứa data, và nếu data đến từ **comment** thì thêm tiền tố `"Comment: "`.

### Listing 3.1 — `dom/JSONConverter.java`

```java
package dom;

import java.io.*;
import java.util.*;

import javax.xml.parsers.*;

import org.w3c.dom.*;
import org.w3c.dom.CharacterData;
import org.xml.sax.*;

/**
 * This program displays an XML document as a tree in JSON format.
 * @version 1.2 2018-04-02
 * @author Cay Horstmann
 */
public class JSONConverter
{
    public static void main(String[] args)
        throws SAXException, IOException, ParserConfigurationException
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
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document doc = builder.parse(filename);
        Element root = doc.getDocumentElement();
        System.out.println(convert(root, 0));
    }

    public static StringBuilder convert(Node node, int level)
    {
        if (node instanceof Element)
        {
            return elementObject((Element) node, level);
        }
        else if (node instanceof CharacterData)
        {
            return characterString((CharacterData) node, level);
        }
        else
        {
            return pad(new StringBuilder(), level).append(
                jsonEscape(node.getClass().getName()));
        }
    }

    private static Map<Character, String> replacements = Map.of('\b', "\\b", '\f', "\\f",
        '\n', "\\n", '\r', "\\r", '\t', "\\t", '"', "\\\"", '\\', "\\\\");

    private static StringBuilder jsonEscape(String str)
    {
        var result = new StringBuilder("\"");
        for (int i = 0; i < str.length(); i++)
        {
            char ch = str.charAt(i);
            String replacement = replacements.get(ch);
            if (replacement == null) result.append(ch);
            else result.append(replacement);
        }
        result.append("\"");
        return result;
    }

    private static StringBuilder characterString(CharacterData node, int level)
    {
        var result = new StringBuilder();
        StringBuilder data = jsonEscape(node.getData());
        if (node instanceof Comment) data.insert(1, "Comment: ");
        pad(result, level).append(data);
        return result;
    }

    private static StringBuilder elementObject(Element elem, int level)
    {
        var result = new StringBuilder();
        pad(result, level).append("{\n");
        pad(result, level + 1).append("\"name\": ");
        result.append(jsonEscape(elem.getTagName()));
        NamedNodeMap attrs = elem.getAttributes();
        if (attrs.getLength() > 0)
        {
            pad(result.append(",\n"), level + 1).append("\"attributes\": ");
            result.append(attributeObject(attrs));
        }
        NodeList children = elem.getChildNodes();
        if (children.getLength() > 0)
        {
            pad(result.append(",\n"), level + 1).append("\"children\": [\n");
            for (int i = 0; i < children.getLength(); i++)
            {
                if (i > 0) result.append(",\n");
                result.append(convert(children.item(i), level + 2));
            }
            result.append("\n");
            pad(result, level + 1).append("]\n");
        }
        pad(result, level).append("}");
        return result;
    }

    private static StringBuilder pad(StringBuilder builder, int level)
    {
        for (int i = 0; i < level; i++) builder.append(" ");
        return builder;
    }

    private static StringBuilder attributeObject(NamedNodeMap attrs)
    {
        var result = new StringBuilder("{");
        for (int i = 0; i < attrs.getLength(); i++)
        {
            if (i > 0) result.append(", ");
            result.append(jsonEscape(attrs.item(i).getNodeName()));
            result.append(": ");
            result.append(jsonEscape(attrs.item(i).getNodeValue()));
        }
        result.append("}");
        return result;
    }
}
```

---

## API

### `javax.xml.parsers.DocumentBuilderFactory` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static DocumentBuilderFactory newInstance()` | trả về một instance của class `DocumentBuilderFactory`. |
| `DocumentBuilder newDocumentBuilder()` | trả về một instance của class `DocumentBuilder`. |

### `javax.xml.parsers.DocumentBuilder` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Document parse(File f)`<br>`Document parse(String url)`<br>`Document parse(InputStream in)` | parse một XML document từ file, URL hoặc input stream đã cho và trả về document đã parse. |

### `org.w3c.dom.Document` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Element getDocumentElement()` | trả về **root element** của document. |

### `org.w3c.dom.Element` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getTagName()` | trả về tên của element. |
| `String getAttribute(String name)` | trả về giá trị của attribute có tên đã cho, hoặc **chuỗi rỗng** nếu không có attribute đó. |

### `org.w3c.dom.Node` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `NodeList getChildNodes()` | trả về một node list chứa **mọi con** của node này. |
| `Node getFirstChild()`<br>`Node getLastChild()` | lấy node con **đầu** hoặc **cuối** của node này, hoặc `null` nếu node này không có con. |
| `Node getNextSibling()`<br>`Node getPreviousSibling()` | lấy **anh em kế tiếp** hoặc **anh em trước đó** của node này, hoặc `null` nếu node này không có anh em. |
| `Node getParentNode()` | lấy **cha** của node này, hoặc `null` nếu node này là document node. |
| `NamedNodeMap getAttributes()` | trả về một node map chứa các node `Attr` mô tả **mọi attribute** của node này. |
| `String getNodeName()` | trả về tên của node này. Nếu node là node `Attr` thì tên là **tên attribute**. |
| `String getNodeValue()` | trả về giá trị của node này. Nếu node là node `Attr` thì giá trị là **giá trị attribute**. |

### `org.w3c.dom.CharacterData` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getData()` | trả về **text** lưu trong node này. |

### `org.w3c.dom.NodeList` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int getLength()` | trả về số node trong list này. |
| `Node item(int index)` | trả về node với index đã cho. Index nằm giữa `0` và `getLength() - 1`. |

### `org.w3c.dom.NamedNodeMap` 1.4

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int getLength()` | trả về số node trong map này. |
| `Node item(int index)` | trả về node với index đã cho. Index nằm giữa `0` và `getLength() - 1`. |

---

## Bài kế tiếp

→ [[04 - Validating XML Documents]] — DTD, XML Schema, `setValidating`, `ErrorHandler`, ví dụ thực tế.
