# 10 — Documentation Comments

> Chapter 4, Section 4.10 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.10. Documentation Comments

> *"The JDK contains a very useful tool, called javadoc, that generates HTML documentation from your source files. In fact, the online API documentation described in Chapter 3 is simply the result of running javadoc on the source code of the standard Java library."*

**Dịch:** JDK có một công cụ rất hữu ích tên **`javadoc`**, sinh ra **tài liệu HTML từ file nguồn** của bạn. Thực tế, tài liệu API trực tuyến nhắc tới ở Chapter 3 **chỉ đơn giản là kết quả chạy `javadoc` trên source code của standard Java library**.

> *"If you add comments that start with the special delimiter /** to your source code, you too can easily produce professional-looking documentation. This is a very nice approach because it lets you keep your code and documentation in one place. If you put your documentation into a separate file, then, as you probably know, the code and comments tend to diverge over time. When documentation comments are in the same file as the source code, it is an easy matter to update both and run javadoc again."*

**Dịch:** Thêm comment bắt đầu bằng dấu phân cách đặc biệt **`/**`** vào source code thì bạn cũng tạo được tài liệu trông chuyên nghiệp. Cách này hay ở chỗ **giữ code và tài liệu ở cùng một chỗ**. Nếu để tài liệu ở file riêng thì **code và comment có xu hướng phân ly theo thời gian**. Khi documentation comment nằm cùng file với source code thì **cập nhật cả hai rồi chạy lại `javadoc` là chuyện dễ**.

---

## 4.10.1. Comment Insertion

> *"The javadoc utility extracts information for the following items:*
> - *Modules*
> - *Packages*
> - *Public classes and interfaces*
> - *Public and protected fields*
> - *Public and protected constructors and methods"*

**Dịch — `javadoc` trích thông tin cho các mục sau:**

| Mục |
|---|
| **Module** |
| **Package** |
| **Class và interface `public`** |
| **Field `public` và `protected`** |
| **Constructor và method `public` và `protected`** |

> *"You can (and should) supply a comment for each of these members. Each comment is placed immediately above the member it describes. A comment starts with a /** and ends with a */."*

**Dịch:** Bạn **có thể (và nên) viết comment cho từng thành viên** trên. Mỗi comment đặt **ngay phía trên** thành viên mà nó mô tả, bắt đầu bằng `/**` và kết thúc bằng `*/`.

> *"Each /** . . . */ documentation comment contains free-form text followed by tags. A tag starts with an @, such as @since or @param."*

> *"The first sentence of the free-form text should be a summary statement. The javadoc utility automatically generates summary pages that extract these sentences."*

**Dịch:** Mỗi documentation comment gồm **văn bản tự do** rồi tới **các tag**. Tag bắt đầu bằng `@`, ví dụ `@since` hay `@param`.

**Câu đầu tiên của phần văn bản tự do nên là câu tóm tắt.** `javadoc` tự sinh ra các trang tóm tắt bằng cách **trích chính những câu này**.

### Block tag và inline tag

> *"The most common javadoc tags are block tags. They must appear at the beginning of a line and start with @, optionally preceded by whitespace, the comment delimiter /**, or leading * which are often used for multi-line comments. In contrast, inline tags are enclosed in braces: {@tagname contents}. The contents may contain braces, but they must be balanced. Examples are the @code and @link tags."*

**Dịch:**

| Loại tag | Vị trí | Cú pháp | Ví dụ |
|---|---|---|---|
| **block tag** | phải ở **đầu dòng**, có thể có khoảng trắng / `/**` / dấu `*` đứng trước | `@tagname ...` | `@param`, `@return`, `@since` |
| **inline tag** | nằm trong **cặp ngoặc nhọn**, đặt ở bất kỳ đâu | `{@tagname contents}` | `{@code ...}`, `{@link ...}` |

Nội dung của inline tag **được chứa dấu ngoặc nhọn**, nhưng chúng **phải cân bằng**.

---

## 4.10.2. Class Comments

> *"The class comment must be placed after any import statements, directly before the class definition. Here is an example of a class comment:"*

```java
/**
 * A {@code Card} object represents a playing card, such
 * as "Queen of Hearts". A card has a suit (Diamond, Heart,
 * Spade or Club) and a value (1 = Ace, 2 . . . 10, 11 = Jack,
 * 12 = Queen, 13 = King).
 */
public class Card
{
    . . .
}
```

**Dịch:** Class comment **phải đặt sau mọi câu lệnh `import`**, và **ngay trước phần định nghĩa class**.

```
package ...;      ← package statement
import ...;       ← import statements
/** ... */        ← class comment ĐẶT Ở ĐÂY
public class Card { ... }
```

> **Note (sách):** *"There is no need to add an * in front of every line. For example, the following comment is equally valid:"*
>
> ```java
> /**
>    A <code>Card</code> object represents a playing card, such
>    as "Queen of Hearts". A card has a suit (Diamond, Heart,
>    Spade or Club) and a value (1 = Ace, 2 . . . 10, 11 = Jack,
>    12 = Queen, 13 = King).
> */
> ```
>
> *"However, most IDEs supply the asterisks automatically and rearrange them when the line breaks change."*
>
> **Dịch:** **Không nhất thiết phải thêm dấu `*` ở đầu mỗi dòng**, comment trên cũng hợp lệ y hệt. Tuy nhiên, đa số IDE **tự thêm dấu sao** và **tự sắp xếp lại** khi ngắt dòng thay đổi.

---

## 4.10.3. Method Comments

> *"Each method comment must immediately precede the method that it describes. In addition to the general-purpose tags, you can use the following tags:"*

**Dịch:** Method comment **phải đứng ngay trước method** mà nó mô tả. Ngoài các tag dùng chung, có thêm các tag sau:

| Tag | Mô tả (dịch từ sách) |
|---|---|
| `@param variable description` | Thêm một mục vào section **"parameters"** của method hiện tại. Phần mô tả **trải nhiều dòng được** và **dùng được HTML tag**. Mọi tag `@param` của một method **phải giữ cạnh nhau** |
| `@return description` | Thêm section **"returns"** vào method hiện tại. Phần mô tả trải nhiều dòng được và dùng được HTML tag |
| `@throws class description` | Thêm ghi chú rằng method này **có thể ném ra exception**. Exception là chủ đề Chapter 7 |

> *"Here is an example of a method comment:"*

```java
/**
 * Raises the salary of an employee.
 * @param byPercent the percentage by which to raise the salary (e.g., 10 means 10%)
 * @return the amount of the raise
 */
public double raiseSalary(double byPercent)
{
    double raise = salary * byPercent / 100;
    salary += raise;
    return raise;
}
```

> **Tip (sách):** *"It can be tedious to write comments for methods whose description and return value are identical, such as:"*
>
> ```java
> /**
>  * Returns the name of the employee.
>  * @return the name of the employee
>  */
> ```
>
> *"In such cases, consider the inline form of @return introduced in Java 16:"*
>
> ```java
> /**
>  * {@return the name of the employee}
>  */
> ```
>
> *"The description section becomes "Returns the name of the employee.", and a "Returns" section with the same contents is added."*
>
> **Dịch:** Viết comment cho method mà **phần mô tả và giá trị trả về giống hệt nhau** thì khá rườm rà. Trường hợp đó, cân nhắc **dạng inline của `@return`** giới thiệu ở **Java 16**. Phần description trở thành "Returns the name of the employee.", và một section "Returns" với **cùng nội dung** được thêm vào.

---

## 4.10.4. Field Comments

> *"You only need to document public fields—generally that means static constants. For example:"*

```java
/**
 * The "Hearts" card suit
 */
public static final int HEARTS = 1;
```

**Dịch:** **Chỉ cần viết tài liệu cho field `public`** — nói chung nghĩa là **static constant**.

---

## 4.10.5. Package Comments

> *"Place the class, method, and variable comments directly into the Java source files, delimited by /** . . . */ documentation comments. However, to generate package comments, you need to add a separate file in each package directory. You have two choices:*
> 1. *Supply a Java file named package-info.java. The file must contain an initial documentation comment, delimited with /** and */, followed by a package statement. It should contain no further code or comments.*
> 2. *Supply an HTML file named package.html. All text between the tags <body>. . .</body> is extracted."*

**Dịch:** Comment cho class, method và biến thì đặt thẳng vào file nguồn Java. Nhưng để sinh **package comment**, phải **thêm một file riêng trong mỗi thư mục package**. Có hai lựa chọn:

| # | File | Yêu cầu |
|---|---|---|
| 1 | `package-info.java` | phải chứa **một documentation comment mở đầu** (`/** ... */`), **theo sau là câu lệnh `package`**. **Không được chứa code hay comment nào khác** |
| 2 | `package.html` | mọi văn bản **giữa cặp thẻ `<body>...</body>`** được trích ra |

---

## 4.10.6. HTML Markup

> *"In the free-form text, you can use HTML modifiers such as <em>. . .</em> for emphasis, <strong>. . .</strong> for strong emphasis, <ul>/<li> for bulleted lists, and <img . . ./> to include an image."*

**Dịch:** Trong phần văn bản tự do, dùng được các HTML modifier:

| Thẻ | Dùng để |
|---|---|
| `<em>...</em>` | nhấn mạnh |
| `<strong>...</strong>` | nhấn mạnh mạnh |
| `<ul>` / `<li>` | danh sách gạch đầu dòng |
| `<img .../>` | chèn ảnh |

> *"To type monospaced code, use {@code . . . } instead of <code>. . .</code>—then you don't have to worry about escaping < and & characters inside the code. If you want to write unescaped < or & in the plain font, use the @literal{ . . .} tag."*

**Dịch:** Để gõ code **font monospaced**, dùng **`{@code ...}`** thay cho `<code>...</code>` — như vậy **khỏi lo escape ký tự `<` và `&`** bên trong code. Muốn viết `<` hoặc `&` không escape ở font thường thì dùng tag **`@literal{ ... }`**.

> *"For multi-line code displays in an HTML pre tag, you can use:"*

```java
/**
 * ...
 * <pre>{@code
 * ...
 * ...
 * }</pre>
 */
```

> *"or, since Java 18:"*

```java
/**
 * ...
 * {@snippet :
 * ...
 * ...
 * }
 */
```

> *"Either way, you don't have to escape < or & characters in the code. However, braces have to match, and you cannot have /* ... */ comments."*

**Dịch:** Cả hai cách đều **khỏi phải escape `<` hay `&`** trong code. Nhưng **dấu ngoặc nhọn phải khớp cặp**, và **không được có comment kiểu `/* ... */`** bên trong.

---

## 4.10.7. Links

> *"You can use hyperlinks to other relevant parts of the javadoc documentation, or to external documents, with the @see and @link tags."*

> *"The tag @see reference adds a hyperlink in the "see also" section. It can be used with both classes and methods. Here, reference can be one of the following:*
> - *package.class#member label*
> - *<a href=". . .">label</a>*
> - *"text""*

**Dịch:** Dùng tag **`@see`** và **`@link`** để tạo hyperlink tới phần khác của tài liệu javadoc, hoặc tới tài liệu bên ngoài. Tag `@see reference` thêm một hyperlink vào section **"see also"**, dùng được cho **cả class lẫn method**. `reference` là một trong ba dạng trên.

### Dạng 1 — tham chiếu tới class / method / biến

> *"The first case is the most useful. You supply the name of a class, method, or variable, and javadoc inserts a hyperlink to the documentation. For example,"*

```java
@see com.horstmann.corejava.Employee#raiseSalary(double)
```

> *"makes a link to the raiseSalary(double) method in the com.horstmann.corejava.Employee class. You can omit the name of the package, or both the package and class names. Then, the member will be located in the current package or class."*

**Dịch:** Dạng này **hữu ích nhất**. **Bỏ được tên package**, hoặc **bỏ cả tên package lẫn tên class** — khi đó thành viên sẽ được tìm trong package hoặc class hiện tại.

> *"Note that you must use a #, not a period, to separate the class from the method or variable name. The Java compiler itself is highly skilled in determining the various meanings of the period character as separator between packages, subpackages, classes, inner classes, and methods and variables. But the javadoc utility isn't quite as clever, so you have to help it along."*

**Dịch:** ⚠️ **Phải dùng dấu `#`, không phải dấu chấm**, để ngăn cách class với tên method hoặc biến. Bản thân Java compiler rất giỏi trong việc xác định các ý nghĩa khác nhau của dấu chấm (ngăn cách package, subpackage, class, inner class, method và biến). Nhưng **`javadoc` không thông minh bằng**, nên bạn **phải giúp nó**.

> *"Constructors have the special name <init>, not the name of the class, such as"*

```java
@see com.horstmann.corejava.Employee#<init>()
```

**Dịch:** Constructor có **tên đặc biệt là `<init>`**, không phải tên class.

> *"You can specify an optional label after the member that will appear as the link anchor. If you omit the label, the user will see the member name."*

**Dịch:** Chỉ định được **label tuỳ chọn** sau tên thành viên, nó sẽ hiện ra làm **anchor của link**. Bỏ label thì người dùng thấy **tên thành viên**.

### Dạng 2 và 3

> *"If the @see tag is followed by a < character, then you need to specify a hyperlink. You can link to any URL you like. For example:"*

```java
@see <a href="horstmann.com/corejava.html">The Core Java home page</a>
```

> *"If the @see tag is followed by a " character, then the text is displayed in the "see also" section. For example:"*

```java
@see "Core Java Volume 2"
```

> *"You can add multiple @see tags for one member, but you must keep them all together."*

**Dịch:** `@see` theo sau bởi ký tự `<` thì phải chỉ định **hyperlink** (link tới URL bất kỳ). `@see` theo sau bởi ký tự `"` thì **văn bản đó được hiển thị** trong section "see also". Thêm được **nhiều tag `@see`** cho một thành viên, nhưng **phải để chúng cạnh nhau**.

### `{@link ...}`

> *"If you like, you can place hyperlinks to other classes or methods anywhere in any of your documentation comments. Insert a tag of the form"*

```java
{@link package.class#member}
```

> *"anywhere in a comment. The member reference follows the same rules as for the @see tag."*

**Dịch:** Đặt hyperlink tới class hoặc method khác **ở bất kỳ đâu** trong documentation comment. Cách tham chiếu thành viên **theo đúng quy tắc của tag `@see`**.

> *"Since Java 20, ids are automatically generated for level 2 and level 3 headings. For example,"*

```html
<h2>General Principles</h2>
```

> *"gets an id general-principles-heading, which you can refer from @see and @link tags. You need two # symbols to link to an id:"*

```java
{@link com.horstmann.corejava.Employee##general-principles-heading}
```

> *"Use @linkplain instead of @link if a link should be displayed in the plain font instead of the code font."*

**Dịch:** **Từ Java 20**, id được **tự sinh cho heading cấp 2 và cấp 3**. Link tới một id thì cần **hai dấu `#`**. Dùng **`@linkplain`** thay cho `@link` nếu muốn link hiển thị ở **font thường** thay vì font code.

> **Note (sách):** *"If your comments contain links to other files, such as images (for example, diagrams or images of user interface components), place those files into a subdirectory, named doc-files, of the directory containing the source file. The javadoc utility will copy the doc-files directories and their contents from the source directory to the documentation directory. You need to use the doc-files directory in your link, for example <img src="doc-files/uml.png" alt="UML diagram"/>."*
>
> **Dịch:** Nếu comment có link tới file khác như ảnh, hãy đặt các file đó vào **thư mục con tên `doc-files`** của thư mục chứa file nguồn. `javadoc` sẽ **copy thư mục `doc-files` và nội dung của nó** từ thư mục nguồn sang thư mục tài liệu. Trong link **phải dùng thư mục `doc-files`**.

---

## 4.10.8. General Comments

> *"The tag @since text makes a "since" entry. The text can be any description of the version that introduced this feature. For example, @since 1.7.1."*

**Dịch:** Tag **`@since text`** tạo một mục "since". Phần text là **mô tả bất kỳ về phiên bản đã giới thiệu tính năng này**.

> *"The following tags can be used in class documentation comments:"*

| Tag | Mô tả (dịch từ sách) |
|---|---|
| `@author name` | Tạo một mục **"author"**. Dùng được **nhiều tag `@author`**, mỗi tác giả một tag. **Đừng cảm thấy bắt buộc phải dùng tag này** — hệ thống version control theo dõi quyền tác giả kỹ hơn nhiều |
| `@version text` | Tạo một mục **"version"**. Phần text là mô tả bất kỳ về phiên bản hiện tại |

> *"The {@value optionalFormat constantFieldReference} inline tag inserts the value of a constant field, with an optional printf-style formatter since Java 20. For example, {@value %X Integer#MAX_VALUE} yields 7FFFFFFF."*

**Dịch:** Inline tag **`{@value ...}`** chèn **giá trị của một constant field**, kèm formatter kiểu printf tuỳ chọn **từ Java 20**. Ví dụ `{@value %X Integer#MAX_VALUE}` cho ra `7FFFFFFF`.

> *"The @deprecated tag is used together with the @Deprecated annotation. It is followed by text that tells the user when and why the deprecation occurred, and to describe alternatives."*

**Dịch:** Tag **`@deprecated`** dùng **cùng với annotation `@Deprecated`**. Theo sau nó là văn bản cho người dùng biết **khi nào và tại sao** việc deprecate xảy ra, và **mô tả các lựa chọn thay thế**.

> *"Finally, you can use the {@index entry} tag to add an entry to the generated index."*

**Dịch:** Cuối cùng, dùng tag **`{@index entry}`** để thêm một mục vào **index được sinh ra**.

---

## 4.10.9. Code Snippets

> *"The purpose of this feature is to allow you to import (presumably well-tested and up-to-date) code from external files. This minimizes the risk of incorrect or stale documentation. Code snippets were introduced in Java 18."*

**Dịch:** Mục đích của tính năng này là cho phép **import code từ file bên ngoài** (được cho là đã test kỹ và luôn cập nhật). Nó **giảm tối đa rủi ro tài liệu sai hoặc cũ**. Code snippet được giới thiệu ở **Java 18**.

> *"You can import an entire file with these tags:"*

```java
{@snippet file=EmployeeTest.java}
{@snippet class=com.horstmann.corejava.EmployeeTest.java}
```

> *"Files should be placed in the snippet-files subdirectory of the current package."*

**Dịch:** Import **cả một file**. File nên đặt trong thư mục con **`snippet-files`** của package hiện tại.

> *"More commonly, you want to copy a region from a file. In the source file, you specify the name and extent of a region as follows:"*

```java
public class EmployeeTest
{
    . . .
    // @start region=default-employee
    var e = new Employee();
    String name = e.getName(); // name is null
    // @end
    . . .
}
```

**Dịch:** Phổ biến hơn là **copy một vùng (region) từ file**. Trong file nguồn, chỉ định **tên và phạm vi của region** bằng `// @start region=...` và `// @end`.

> *"To highlight a part of the snippet, use a comment:"*

```java
var e = new Employee(); // @highlight substring=new
String name = e.getName(); // @highlight regex=get[A-Z][a-z]+
```

> *"Inside a region, you can replace a part with another string, for example to make the documentation more general:"*

```java
var e = new Employee("Fred", 100000); // @replace regex=([^)]+) replacement="(..., ...)"
```

> *"Then the documentation contains:"*

```java
var e = new Employee(..., ...);
```

> *"To add a link, use:"*

```java
var c = new Card(); // @link substring=Card target=com.horstmann.games#Card.<init>()
```

> *"These decorations and transformations are specified as comments, so that your source file compiles and runs."*

**Dịch:**

| Comment | Tác dụng |
|---|---|
| `// @start region=...` / `// @end` | đánh dấu vùng cần copy |
| `// @highlight substring=...` hoặc `regex=...` | **tô sáng** một phần của snippet |
| `// @replace regex=... replacement="..."` | **thay thế** một phần bằng chuỗi khác, ví dụ để tài liệu tổng quát hơn |
| `// @link substring=... target=...` | thêm **link** |

Các trang trí và biến đổi này **được chỉ định dưới dạng comment**, nhờ vậy **file nguồn vẫn compile và chạy được**.

---

## 4.10.10. Comment Extraction

> *"Here, docDirectory is the name of the directory where you want the HTML files to go. Follow these steps:*
> 1. *Change to the directory that contains the source files you want to document. If you have nested packages to document, such as com.horstmann.corejava, you must be working in the directory that contains the subdirectory com. (This is the directory that contains the overview.html file, if you supplied one.)*
> 2. *Run the command"*

```
javadoc -d docDirectory nameOfPackage
```

> *"for a single package. Or, run"*

```
javadoc -d docDirectory nameOfPackage1 nameOfPackage2. . .
```

> *"to document multiple packages. If your files are in the unnamed package, run instead"*

```
javadoc -d docDirectory *.java
```

> *"If you omit the -d docDirectory option, the HTML files are extracted to the current directory. That can get messy, and I don't recommend it."*

**Dịch:** `docDirectory` là **tên thư mục bạn muốn đặt file HTML vào**. Các bước:

1. Chuyển vào **thư mục chứa file nguồn** cần tạo tài liệu. Nếu có package lồng nhau như `com.horstmann.corejava` thì **phải đứng ở thư mục chứa thư mục con `com`** — cũng chính là thư mục chứa file `overview.html` nếu bạn có cấp file đó.
2. Chạy lệnh `javadoc` tương ứng: một package, nhiều package, hoặc unnamed package.

**Bỏ option `-d docDirectory`** thì file HTML được trích ra **thư mục hiện tại** — dễ thành **bừa bộn**, tác giả **không khuyến nghị**.

### Các option hữu ích

> *"The javadoc program can be fine-tuned by numerous command-line options. For example, you can use the -author and -version options to include the @author and @version tags in the documentation. (By default, they are omitted.) Another useful option is -link, to include hyperlinks to standard classes. For example, if you use the command"*

```
javadoc -link https://docs.oracle.com/en/java/javase/21/docs/api *.java
```

> *"all standard library classes are automatically linked to the documentation on the Oracle web site."*

> *"If you use the -linksource option, each source file is converted to HTML (without color coding, but with line numbers), and each class and method name turns into a hyperlink to the source."*

**Dịch:**

| Option | Tác dụng (dịch từ sách) |
|---|---|
| `-d docDirectory` | thư mục đích cho file HTML |
| `-author` | đưa tag `@author` vào tài liệu (**mặc định bị bỏ qua**) |
| `-version` | đưa tag `@version` vào tài liệu (**mặc định bị bỏ qua**) |
| `-link <url>` | tạo hyperlink tới **class chuẩn** — mọi class của standard library **tự động được link** tới tài liệu trên web Oracle |
| `-linksource` | mỗi file nguồn được chuyển thành HTML (**không tô màu, nhưng có số dòng**), và **mỗi tên class, tên method thành hyperlink trỏ tới source** |
| `-overview filename` | cấp comment tổng quan cho mọi file nguồn |

> *"You can also supply an overview comment for all source files. Place it in a file such as overview.html and run the javadoc tool with the command line option -overview filename. All text between the tags <body>. . .</body> is extracted. The content is displayed when the user selects "Overview" from the navigation bar."*

**Dịch:** Đặt comment tổng quan vào một file như `overview.html` rồi chạy `javadoc` với option `-overview filename`. Mọi văn bản **giữa cặp thẻ `<body>...</body>`** được trích ra, và nội dung đó **hiển thị khi người dùng chọn "Overview"** trên thanh điều hướng.

> *"For additional options, refer to the online documentation of the javadoc utility at https://docs.oracle.com/en/java/javase/21/javadoc/index.html."*

---

## Bài kế tiếp

→ [[11 - Class Design Hints]] — bảy lời khuyên thiết kế class khép lại chương 4.
