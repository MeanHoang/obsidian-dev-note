# 02 — The Structure of an XML Document

> Chapter 3, Section 3.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.2. The Structure of an XML Document

### Header

> *"An XML document should start with a header such as"*

```xml
<?xml version="1.0"?>
```

> *"or"*

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

> *"Strictly speaking, a header is optional, but it is highly recommended."*

**Dịch:** Một XML document **nên bắt đầu bằng một header** như trên. Nói chặt chẽ thì header là **tuỳ chọn**, nhưng **rất được khuyến nghị**.

> **Note (sách):** *"Since SGML was created for processing of real documents, XML files are called documents even though many of them describe data sets that one would not normally call documents."*
>
> **Dịch:** Vì SGML được tạo ra để xử lý **tài liệu thật**, nên file XML được gọi là **document** dù nhiều file trong số đó mô tả **tập dữ liệu** mà bình thường ta chẳng gọi là tài liệu.

### DTD

> *"The header can be followed by a document type definition (DTD), such as"*

```xml
<!DOCTYPE web-app PUBLIC
  "-//Sun Microsystems, Inc.//DTD Web Application 2.2//EN"
  "http://java.sun.com/j2ee/dtds/web-app_2_2.dtd">
```

> *"DTDs are an important mechanism to ensure the correctness of a document, but they are not required. We will discuss them later in this chapter."*

**Dịch:** Sau header có thể là một **document type definition (DTD)**. DTD là **cơ chế quan trọng để đảm bảo tính đúng đắn** của document, nhưng **không bắt buộc**. Chi tiết ở [[04 - Validating XML Documents]].

### Root element

> *"Finally, the body of the XML document contains the root element, which can contain other elements. For example,"*

```xml
<?xml version="1.0"?>
<!DOCTYPE config . . .>
<config>
  <entry id="title">
    <font>
      <name>Helvetica</name>
      <size>36</size>
    </font>
  </entry>
  . . .
</config>
```

**Dịch:** Cuối cùng, **thân** của XML document chứa **root element**, và root element có thể chứa các element khác.

> *"An element can contain child elements, text, or both. In the preceding example, the font element has two child elements, name and size. The name element contains the text "Helvetica"."*

**Dịch:** Một element có thể chứa **child element**, **text**, hoặc **cả hai**. Ở ví dụ trên, element `font` có hai child element là `name` và `size`. Element `name` chứa text `"Helvetica"`.

> **Tip (sách):** *"It is best to structure your XML documents so that an element contains either child elements or text. Here’s an example of what you should avoid:"*
>
> ```xml
> <font>
>   Helvetica
>   <size>36</size>
> </font>
> ```
>
> *"This is called mixed content in the XML specification. As you will see later in this chapter, you can simplify parsing if you avoid mixed content."*
>
> **Dịch:** Tốt nhất nên cấu trúc XML document sao cho **một element chứa hoặc child element, hoặc text** — chứ không lẫn lộn. Ví dụ trên là thứ **nên tránh**. Trong XML specification, cái này gọi là **mixed content**. Tránh mixed content thì **việc parsing đơn giản đi**.

---

## Element hay attribute?

> *"XML elements can contain attributes, such as"*

```xml
<size unit="pt">36</size>
```

**Dịch:** XML element có thể chứa **attribute**.

> *"There is some disagreement among XML designers about when to use elements and when to use attributes. For example, it would seem easier to describe a font as"*

```xml
<font name="Helvetica" size="36"/>
```

> *"compared to"*

```xml
<font>
  <name>Helvetica</name>
  <size>36</size>
</font>
```

**Dịch:** Giới thiết kế XML **không thống nhất** về chuyện khi nào dùng element, khi nào dùng attribute. Ví dụ, mô tả một font bằng attribute **trông có vẻ dễ hơn** so với dùng element.

> *"However, attributes are much less flexible. Suppose you want to add units to the size value. If you use attributes, you will have to add the unit to the attribute value:"*

```xml
<font name="Helvetica" size="36 pt"/>
```

> *"Ugh! Now you have to parse the string "36 pt", just the kind of hassle that XML was designed to avoid. Adding an attribute to the size element is much cleaner:"*

```xml
<font>
  <name>Helvetica</name>
  <size unit="pt">36</size>
</font>
```

**Dịch:** Tuy nhiên, attribute **kém linh hoạt hơn nhiều**. Giả sử bạn muốn thêm **đơn vị** vào giá trị size. Nếu dùng attribute, bạn phải nhét đơn vị vào **trong giá trị attribute**. Ối! Giờ bạn lại phải **parse chuỗi `"36 pt"`** — đúng cái phiền toái mà XML sinh ra để tránh. Thêm attribute **vào element `size`** thì **sạch sẽ hơn nhiều**.

> *"A commonly used rule of thumb is that attributes should be used only to modify the interpretation of a value, not to specify values. If you find yourself engaged in a metaphysical discussion about whether a particular setting is a modification of the interpretation of a value or not, just say “no” to attributes and use elements throughout. Many useful XML documents don’t use attributes at all."*

**Dịch:** **Quy tắc ngón tay cái** thường dùng: attribute chỉ nên dùng để **điều chỉnh cách diễn giải một giá trị**, **không phải để chỉ định giá trị**. Nếu bạn thấy mình đang sa vào tranh luận siêu hình xem một setting cụ thể có phải là "điều chỉnh cách diễn giải giá trị" hay không, thì cứ **nói "không" với attribute** và **dùng element cho tất cả**. **Nhiều XML document hữu ích chẳng dùng attribute chút nào.**

> **Note (sách):** *"In HTML, the rule for attribute usage is simple: If it isn’t displayed on the web page, it’s an attribute. For example, consider the hyperlink"*
>
> ```html
> <a href="http://java.sun.com">Java Technology</a>
> ```
>
> *"The string Java Technology is displayed on the web page, but the URL of the link is not a part of the displayed page. However, the rule isn’t all that helpful for most XML files because the data in an XML file aren’t normally meant to be viewed by humans."*
>
> **Dịch:** Trong HTML, quy tắc dùng attribute rất đơn giản: **nếu nó không hiển thị trên trang web thì nó là attribute**. Chuỗi `Java Technology` được hiển thị, còn **URL của link thì không** thuộc phần hiển thị. Tuy nhiên quy tắc này **không mấy hữu ích** với phần lớn file XML, vì **data trong file XML thường không nhằm để con người xem**.

---

## Các markup instruction khác

> *"Elements and text are the “bread and butter” of XML documents. Here are a few other markup instructions that you might encounter:"*

**Dịch:** **Element và text là "cơm ăn nước uống"** của XML document. Dưới đây là vài **markup instruction** khác bạn có thể gặp.

### Character reference

> *"• Character references have the form `&#decimalValue;` or `&#xhexValue;`. For example, the é character can be denoted with either of the following:"*

```
&#233;   &#xE9;
```

**Dịch:** **Character reference** có dạng `&#giáTrịThậpPhân;` hoặc `&#xgiáTrịHex;`. Ví dụ ký tự `é` biểu diễn được bằng một trong hai cách trên.

### Entity reference

> *"• Entity references have the form `&name;`. The entity references"*

```
&lt; &gt; &amp; &quot; &apos;
```

> *"have predefined meanings: the less-than, greater-than, ampersand, quotation mark, and apostrophe characters. You can define other entity references in a DTD."*

**Dịch:** **Entity reference** có dạng `&tên;`. Năm entity reference trên có **ý nghĩa định sẵn**: ký tự **nhỏ hơn**, **lớn hơn**, **và (ampersand)**, **dấu nháy kép**, **dấu nháy đơn (apostrophe)**. Bạn **định nghĩa được entity reference khác trong một DTD**.

### CDATA section

> *"• CDATA sections are delimited by `<![CDATA[` and `]]>`. They are a special form of character data. You can use them to include strings that contain characters such as `< > &` without having them interpreted as markup, for example:"*

```xml
<![CDATA[< & > are my favorite delimiters]]>
```

> *"CDATA sections cannot contain the string `]]>`. Use this feature with caution! It is too often used as a back door for smuggling legacy data into XML documents."*

**Dịch:** **CDATA section** được phân định bởi `<![CDATA[` và `]]>`. Đây là **một dạng đặc biệt của character data**. Dùng nó để nhét vào những chuỗi chứa ký tự như `< > &` mà **không bị hiểu thành markup**. CDATA section **không được chứa chuỗi `]]>`**. **Dùng tính năng này một cách thận trọng!** Nó **quá thường xuyên bị dùng như cửa sau** để **buôn lậu legacy data** vào XML document.

### Processing instruction

> *"• Processing instructions are instructions for applications that process XML documents. They are delimited by `<?` and `?>`, for example"*

```xml
<?xml-stylesheet href="mystyle.css" type="text/css"?>
```

> *"Every XML document starts with a processing instruction"*

```xml
<?xml version="1.0"?>
```

**Dịch:** **Processing instruction** là chỉ thị dành cho **các application xử lý XML document**. Chúng được phân định bởi `<?` và `?>`. **Mọi XML document đều bắt đầu bằng một processing instruction** `<?xml version="1.0"?>`.

### Comment

> *"• Comments are delimited by `<!--` and `-->`, for example"*

```xml
<!-- This is a comment. -->
```

> *"Comments should not contain the string `--`. Comments should only be information for human readers. They should never contain hidden commands; use processing instructions for commands."*

**Dịch:** **Comment** được phân định bởi `<!--` và `-->`. Comment **không nên chứa chuỗi `--`**. Comment **chỉ nên là thông tin cho người đọc**. Chúng **không bao giờ nên chứa lệnh ẩn** — muốn ra lệnh thì **dùng processing instruction**.

---

## Bài kế tiếp

→ [[03 - Parsing an XML Document]] — DOM parser, `DocumentBuilderFactory`, duyệt cây `Node`, `NodeList`, `NamedNodeMap`.
