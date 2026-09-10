# 05 — Locating Information with XPath

> Chapter 3, Section 3.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.5. Locating Information with XPath

> *"If you want to locate a specific piece of information in an XML document, it can be a bit of a hassle to navigate the nodes of the DOM tree. The XPath language makes it simple to access tree nodes. For example, suppose you have this XHTML document:"*

```xml
<html>
  <head>
    . . .
    <title>. . .</title>
    . . .
  </head>
  . . .
</html>
```

> *"You can get the title text by evaluating the XPath expression"*

```
/html/head/title/text()
```

> *"That’s a lot simpler than the plain DOM approach:"*
>
> *"1. Get the document root.*
> *2. Get the first child and cast is as an Element.*
> *3. Locate the title element among its children.*
> *4. Get its first child and cast it as a CharacterData node.*
> *5. Get its data."*

**Dịch:** Nếu bạn muốn **định vị một mẩu thông tin cụ thể** trong XML document, việc **điều hướng qua các node của DOM tree** hơi phiền. **Ngôn ngữ XPath** làm cho việc **truy cập node của cây** trở nên đơn giản. Cách trên **đơn giản hơn nhiều** so với cách DOM thuần, vốn phải: lấy document root · lấy con đầu tiên và **cast thành `Element`** · định vị element `title` trong các con · lấy con đầu tiên của nó và **cast thành node `CharacterData`** · lấy data.

---

## Cú pháp XPath

> *"An XPath can describe a set of nodes in an XML document. For example, the XPath"*

```
/html/body/form
```

> *"describes the set of all form elements that are children of the body element in an XHTML file. You can select a particular element with the [] operator:"*

```
/html/body/form[1]
```

> *"is the first form. (The index values start at 1.)"*

**Dịch:** Một XPath **mô tả một tập node** trong XML document. XPath `/html/body/form` mô tả **tập mọi element `form` là con của element `body`** trong file XHTML. Bạn **chọn một element cụ thể** bằng toán tử **`[]`**: `/html/body/form[1]` là **form đầu tiên**. (**Giá trị index bắt đầu từ 1.**)

> *"Use the @ operator to get attribute values. The XPath expression"*

```
/html/body/form[1]/@action
```

> *"describes the action attribute of the first table. The XPath expression"*

```
/html/body/form/@action
```

> *"describes all action attribute nodes of all form elements that are children of the body element."*

**Dịch:** Dùng toán tử **`@`** để lấy **giá trị attribute**. Biểu thức đầu mô tả **attribute `action` của bảng đầu tiên**. Biểu thức sau mô tả **mọi node attribute `action` của mọi element `form`** là con của element `body`.

> *"There are a number of useful XPath functions. For example,"*

```
count(/html/body/form)
```

> *"returns the number of form children of the body element. There are many more elaborate XPath expressions; see the specification at www.w3c.org/TR/xpath or the online tutorial at www.zvon.org/xxl/XPathTutorial/General/examples.html."*

**Dịch:** Có một số **XPath function** hữu ích. Ví dụ `count(...)` trả về **số con `form`** của element `body`. Còn nhiều biểu thức XPath **công phu hơn**.

---

## Đánh giá XPath trong Java

> *"To evaluate XPath expressions, first create an XPath object from an XPathFactory:"*

```java
XPathFactory xpfactory = XPathFactory.newInstance();
path = xpfactory.newXPath();
```

> *"Then, call the evaluate method to evaluate XPath expressions:"*

```java
String username = path.evaluate("/html/head/title/text()", doc);
```

> *"You can use the same XPath object to evaluate multiple expressions."*

> *"This form of the evaluate method returns a string result. It is suitable for retrieving text, such as the text child of the title element in the preceding example."*

**Dịch:** Để **đánh giá (evaluate)** biểu thức XPath, trước hết tạo một object `XPath` từ một `XPathFactory`. Rồi gọi method `evaluate`. Bạn **dùng lại cùng một object `XPath`** để đánh giá **nhiều biểu thức**. Dạng `evaluate` này trả về **kết quả kiểu chuỗi**, phù hợp để **lấy text** — như text con của element `title` ở ví dụ trên.

### Kết quả là nhiều node

> *"If an XPath expression yields multiple nodes, make a call such as the following:"*

```java
XPathNodes result = path.evaluateExpression("/html/body/form", doc, XPathNodes.class);
```

> *"The XPathNodes class is similar to a NodeList, but it extends the Iterable interface, allowing you to use an enhanced for loop."*

> *"This method was added in Java 9. In older releases, use the following call instead:"*

```java
var nodes = (NodeList) path.evaluate("/html/body/form", doc, XPathConstants.NODESET);
```

**Dịch:** Nếu biểu thức XPath cho ra **nhiều node**, gọi như trên. Class **`XPathNodes`** giống `NodeList`, nhưng nó **extend interface `Iterable`**, cho phép bạn dùng **enhanced for loop**. Method này **được thêm ở Java 9**; ở bản cũ hơn thì dùng lời gọi thứ hai.

### Kết quả là một node

> *"If the result is a single node, use one of the following calls:"*

```java
Node node = path.evaluateExpression("/html/body/form[1]", doc, Node.class);
node = (Node) path.evaluate("/html/body/form[1]", doc, XPathConstants.NODE);
```

**Dịch:** Nếu kết quả là **một node duy nhất**, dùng một trong hai lời gọi trên.

### Kết quả là số

> *"If the result is a number, use:"*

```java
int count = path.evaluateExpression("count(/html/body/form)", doc, Integer.class);
count = ((Number) path.evaluate("count(/html/body/form)",
    doc, XPathConstants.NUMBER)).intValue();
```

**Dịch:** Nếu kết quả là **số**, dùng như trên.

### Bắt đầu từ node bất kỳ

> *"You don’t have to start the search at the document root; you can start at any node or node list. For example, if you have a node from a previous evaluation, you can call"*

```java
String result = path.evaluate(expression, node);
```

**Dịch:** Bạn **không bắt buộc phải bắt đầu tìm từ document root**; bạn bắt đầu từ **node hoặc node list bất kỳ** được. Ví dụ nếu bạn có một node từ **lần evaluate trước**, gọi như trên.

### Khi chưa biết kiểu kết quả

> *"If you do not know the result of evaluating an XPath expression (perhaps because it comes from a user), then call"*

```java
XPathEvaluationResult<?> result = path.evaluateExpression(expression, doc);
```

> *"The expression result.type() is one of the constants"*

```
STRING
NODESET
NODE
NUMBER
BOOLEAN
```

> *"of the XPathEvaluationResult.XPathResultType enumeration. Call result.value() to get the value."*

**Dịch:** Nếu bạn **không biết trước kết quả** của việc đánh giá một biểu thức XPath (có thể vì biểu thức **đến từ user**), thì gọi `evaluateExpression`. Biểu thức `result.type()` là **một trong năm hằng số** của enumeration **`XPathEvaluationResult.XPathResultType`**. Gọi **`result.value()`** để lấy giá trị.

---

## Chương trình ví dụ

> *"The program in Listing 3.6 demonstrates evaluation of arbitrary XPath expressions. Load an XML file and type an expression. The result of the expression is displayed."*

**Dịch:** Chương trình ở Listing 3.6 minh hoạ việc **đánh giá biểu thức XPath tuỳ ý**. Nạp một file XML rồi gõ một biểu thức; **kết quả của biểu thức được hiển thị**.

### Listing 3.6 — `xpath/XPathTest.java`

```java
package xpath;

import java.io.*;
import java.nio.file.*;
import java.util.*;

import javax.xml.catalog.*;
import javax.xml.parsers.*;
import javax.xml.xpath.*;

import org.w3c.dom.*;
import org.xml.sax.*;

/**
 * This program evaluates XPath expressions.
 * @version 1.1 2018-04-06
 * @author Cay Horstmann
 */
public class XPathTest
{
    public static void main(String[] args) throws Exception
    {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        // Avoid a delay in parsing an XHTML file--see the first note in
        // Section 3.3.1
        builder.setEntityResolver(CatalogManager.catalogResolver(
            CatalogFeatures.defaults(),
            Paths.get("xpath/catalog.xml").toAbsolutePath().toUri()));

        XPathFactory xpfactory = XPathFactory.newInstance();
        XPath path = xpfactory.newXPath();
        try (var in = new Scanner(System.in))
        {
            String filename;
            if (args.length == 0)
            {
                System.out.print("Input file: ");
                filename = in.nextLine();
            }
            else
                filename = args[0];

            Document doc = builder.parse(filename);
            var done = false;
            while (!done)
            {
                System.out.print("XPath expression (empty line to exit): " );
                String expression = in.nextLine();
                if (expression.trim().isEmpty()) done = true;
                else
                {
                    try
                    {
                        XPathEvaluationResult<?> result
                            = path.evaluateExpression(expression, doc);
                        if (result.type() == XPathEvaluationResult.XPathResultType.NODESET)
                        {
                            for (Node n : (XPathNodes) result.value())
                                System.out.println(description(n));
                        }
                        else if (result.type() == XPathEvaluationResult.XPathResultType.NODE)
                            System.out.println((Node) result.value());
                        else
                            System.out.println(result.value());
                    }
                    catch (XPathExpressionException e)
                    {
                        System.out.println(e.getMessage());
                    }
                }
            }
        }
    }

    public static String description(Node n)
    {
        if (n instanceof Element) return "Element " + n.getNodeName();
        else if (n instanceof Attr) return "Attribute " + n;
        else return n.toString();
    }
}
```

---

## API

### `javax.xml.xpath.XPathFactory` 5.0

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static XPathFactory newInstance()` | trả về một instance `XPathFactory` để tạo các object `XPath`. |
| `XPath newXPath()` | dựng một object `XPath` để **đánh giá biểu thức XPath**. |

### `javax.xml.xpath.XPath` 5.0

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String evaluate(String expression, Object startingPoint)` | đánh giá một biểu thức, **bắt đầu từ điểm xuất phát đã cho**. Điểm xuất phát có thể là một **node hoặc node list**. Nếu kết quả là node hoặc node set, chuỗi trả về gồm **data của mọi text node con**. |
| `Object evaluate(String expression, Object startingPoint, QName resultType)` | đánh giá một biểu thức, bắt đầu từ điểm xuất phát đã cho. `resultType` là một trong các hằng số **`STRING`, `NODE`, `NODESET`, `NUMBER`, `BOOLEAN`** trong class `XPathConstants`. Giá trị trả về là `String`, `Node`, `NodeList`, `Number`, hoặc `Boolean`. |
| `<T> T evaluateExpression(String expression, Object item, Class<T> type)` **9** | đánh giá biểu thức đã cho và **cho ra kết quả dưới dạng giá trị của type đã cho**. |
| `XPathEvaluationResult<?> evaluateExpression(String expression, InputSource source)` **9** | đánh giá biểu thức đã cho. |

### `javax.xml.xpath.XPathEvaluationResult<T>` 9

| Method | Mô tả (dịch từ sách) |
|---|---|
| `XPathEvaluationResult.XPathResultType type()` | trả về **một trong các hằng số** enumeration `STRING`, `NODESET`, `NODE`, `NUMBER`, `BOOLEAN`. |
| `T value()` | trả về **giá trị kết quả**. |

---

## Bài kế tiếp

→ [[06 - Using Namespaces]] — namespace URI, prefix, `setNamespaceAware`, qualified name và local name.
