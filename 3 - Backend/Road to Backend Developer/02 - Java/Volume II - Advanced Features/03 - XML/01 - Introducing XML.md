# 01 — Introducing XML

> Chapter 3, Section 3.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.1. Introducing XML

### Xuất phát điểm: property file

> *"In Chapter 13 of Volume I, you have seen the use of property files to describe the configuration of a program. A property file contains a set of name/value pairs, such as"*

```
fontname=Times Roman
fontsize=12
windowsize=400 200
color=0 50 100
```

**Dịch:** Ở Chapter 13 của Volume I, bạn đã thấy cách dùng **property file** để mô tả **configuration** của chương trình. Một property file chứa một tập **cặp name/value**, như trên.

> *"You can use the Properties class to read in such a file with a single method call. That’s a nice feature, but it doesn’t really go far enough. In many cases, the information you want to describe has more structure than the property file format can comfortably handle. Consider the fontname/fontsize entries in the example. It would be more object-oriented to have a single entry:"*

```
font=Times Roman 12
```

> *"But then, parsing the font description gets ugly as you have to figure out when the font name ends and the font size starts."*

**Dịch:** Dùng class `Properties` để đọc file đó chỉ bằng **một lời gọi method**. Đó là tính năng hay, nhưng **chưa đi đủ xa**. Trong nhiều trường hợp, thông tin bạn muốn mô tả **có cấu trúc phức tạp hơn** mức mà định dạng property file xử lý thoải mái. Xét hai entry `fontname`/`fontsize`: sẽ **object-oriented hơn** nếu gộp thành một entry duy nhất. Nhưng khi đó việc **parse** phần mô tả font trở nên **xấu xí**, vì bạn phải tự đoán chỗ nào tên font kết thúc và kích thước font bắt đầu.

### Hạn chế 1 — chỉ có một hệ phân cấp phẳng

> *"Property files have a single flat hierarchy. You can often see programmers work around that limitation with key names like"*

```
title.fontname=Helvetica
title.fontsize=36
body.fontname=Times Roman
body.fontsize=12
```

**Dịch:** Property file chỉ có **một hệ phân cấp phẳng (flat hierarchy)**. Bạn thường thấy lập trình viên **lách** hạn chế đó bằng cách đặt tên key như trên.

### Hạn chế 2 — key phải là duy nhất

> *"Another shortcoming of the property file format is the requirement that keys must be unique. To store a sequence of values, you need another workaround, such as"*

```
menu.item.1=Times Roman
menu.item.2=Helvetica
menu.item.3=Goudy Old Style
```

**Dịch:** Một khiếm khuyết nữa của định dạng property file là **key bắt buộc phải duy nhất**. Muốn lưu một **dãy giá trị**, bạn lại cần một cách lách khác, như trên.

### XML giải quyết cả hai

> *"The XML format solves these problems. It can express hierarchical structures and is thus more flexible than the flat table structure of a property file."*

> *"An XML file for describing a program configuration might look like this:"*

```xml
<config>
  <entry id="title">
    <font>
      <name>Helvetica</name>
      <size>36</size>
    </font>
  </entry>
  <entry id="body">
    <font>
      <name>Times Roman</name>
      <size>12</size>
    </font>
  </entry>
  <entry id="background">
    <color>
      <red>0</red>
      <green>50</green>
      <blue>100</blue>
    </color>
  </entry>
</config>
```

> *"The XML format allows you to express the hierarchy and record repeated elements without contortions."*

**Dịch:** Định dạng **XML** giải quyết những vấn đề này. Nó **biểu diễn được cấu trúc phân cấp**, nên **linh hoạt hơn** cấu trúc bảng phẳng của property file. XML cho phép bạn diễn tả **hệ phân cấp** và ghi lại **element lặp lại** mà **không phải vặn vẹo** gì.

---

## Nguồn gốc: SGML

> *"The format of an XML file is straightforward. It looks similar to an HTML file. There is a good reason for that—both XML and HTML are descendants of the venerable Standard Generalized Markup Language (SGML)."*

**Dịch:** Định dạng của file XML rất **thẳng thắn**. Nó **trông giống file HTML**. Có lý do rõ ràng: cả **XML lẫn HTML đều là hậu duệ** của **Standard Generalized Markup Language (SGML)** đáng kính.

> *"SGML has been around since the 1970s for describing the structure of complex documents. It has been used with success in some industries that require ongoing maintenance of massive documentation—in particular, the aircraft industry. However, SGML is quite complex, so it has never caught on in a big way. Much of that complexity arises because SGML has two conflicting goals. SGML wants to make sure that documents are formed according to the rules for their document type, but it also wants to make data entry easy by allowing shortcuts that reduce typing. XML was designed as a simplified version of SGML for use on the Internet. As is often true, simpler is better, and XML has enjoyed the immediate and enthusiastic reception that has eluded SGML for so long."*

**Dịch:** SGML có từ **thập niên 1970** để mô tả cấu trúc của các tài liệu phức tạp. Nó được dùng **thành công** ở một số ngành cần **bảo trì liên tục khối tài liệu khổng lồ** — đặc biệt là **ngành hàng không**. Tuy nhiên SGML **khá phức tạp**, nên **chưa bao giờ phổ biến rộng**. Phần lớn sự phức tạp đó đến từ việc SGML có **hai mục tiêu xung đột nhau**: SGML vừa muốn đảm bảo tài liệu được tạo **đúng theo quy tắc của document type**, vừa muốn **nhập liệu dễ dàng** bằng cách cho phép các **shortcut** giảm bớt gõ phím. **XML được thiết kế như một phiên bản đơn giản hoá của SGML** để dùng trên **Internet**. Như thường lệ, **đơn giản hơn thì tốt hơn**, và XML đã được đón nhận **ngay lập tức và nhiệt tình** — điều mà SGML mãi không có được.

> **Note (sách):** *"You can find a very nice version of the XML standard, with annotations by Tim Bray, at www.xml.com/axml/axml.html."*
>
> **Dịch:** Bạn tìm được một bản XML standard rất hay, có chú giải của **Tim Bray**, tại `www.xml.com/axml/axml.html`.

---

## Khác biệt giữa XML và HTML

> *"Even though XML and HTML have common roots, there are important differences between the two."*

**Dịch:** Dù XML và HTML **chung gốc**, giữa hai bên có những **khác biệt quan trọng**.

> *"• Unlike HTML, XML is case-sensitive. For example, `<H1>` and `<h1>` are different XML tags.*
> *• In HTML, you can omit end tags, such as `</p>` or `</li>`, if it is clear from the context where a paragraph or list item ends. In XML, you can never omit an end tag.*
> *• In XML, elements that have a single tag without a matching end tag must end in a `/`, as in `<img src="coffeecup.png"/>`. That way, the parser knows not to look for a `</img>` tag.*
> *• In XML, attribute values must be enclosed in quotation marks. In HTML, quotation marks are optional. For example, `<applet code="MyApplet.class" width=300 height=300>` is legal HTML but not legal XML. In XML, you have to use quotation marks: `width="300"`.*
> *• In HTML, you can have attribute names without values, such as `<input type="radio" name="language" value="Java" checked>`. In XML, all attributes must have values, such as `checked="true"` or (ugh) `checked="checked"`.*
> *• There are XML formulations for HTML versions 4 and 5 that are known as XHTML."*

**Dịch:**

| # | Khác biệt |
|---|---|
| 1 | Khác HTML, **XML phân biệt hoa thường (case-sensitive)**. Ví dụ `<H1>` và `<h1>` là **hai XML tag khác nhau**. |
| 2 | Trong HTML, bạn **bỏ được end tag** như `</p>` hay `</li>` nếu ngữ cảnh đã rõ chỗ kết thúc. Trong XML, **không bao giờ được bỏ end tag**. |
| 3 | Trong XML, element chỉ có **một tag** mà không có end tag khớp thì **phải kết thúc bằng `/`**, như `<img src="coffeecup.png"/>`. Nhờ vậy **parser biết là không phải đi tìm tag `</img>`**. |
| 4 | Trong XML, **giá trị attribute bắt buộc nằm trong dấu nháy**. Trong HTML thì nháy là tuỳ chọn. Ví dụ `<applet code="MyApplet.class" width=300 height=300>` là HTML hợp lệ nhưng **không phải XML hợp lệ**. XML phải viết `width="300"`. |
| 5 | Trong HTML có **attribute name không kèm value**, như `checked` trong `<input type="radio" name="language" value="Java" checked>`. Trong XML, **mọi attribute đều phải có value**, kiểu `checked="true"` hoặc (ối) `checked="checked"`. |
| 6 | Có các **công thức hoá XML cho HTML phiên bản 4 và 5**, gọi là **XHTML**. |

---

## Bài kế tiếp

→ [[02 - The Structure of an XML Document]] — header, DTD, root element, child element, attribute, character reference, entity reference, CDATA, processing instruction, comment.
