# 06 — Source-Level Annotation Processing

> Chapter 8, Section 8.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

> Chủ đề này Volume I cũng có, viết ở bản khác: xem [[05 - Source-Level Annotation Processing]] (Vol I).

---

## 8.6. Source-Level Annotation Processing

> *"In the preceding section, you saw how to analyze annotations in a running program. Another use for annotation is the automatic processing of source files to produce more source code, configuration files, scripts, or whatever else one might want to generate."*

**Dịch:** Ở mục trước, bạn đã thấy cách **phân tích annotation trong một chương trình đang chạy**. Một công dụng khác của annotation là **tự động xử lý file source để sinh thêm source code, file cấu hình, script, hay bất cứ thứ gì khác mà ta muốn sinh ra**.

---

## 8.6.1. Annotation Processors

> *"Annotation processing is integrated into the Java compiler. During compilation, you can invoke annotation processors by running"*

```
javac -processor ProcessorClassName1,ProcessorClassName2,. . . sourceFiles
```

**Dịch:** **Annotation processing được tích hợp vào Java compiler.** Trong lúc compile, bạn **gọi annotation processor** bằng lệnh trên.

> *"The compiler locates the annotations of the source files. Each annotation processor is executed in turn and given the annotations in which it expressed an interest. If an annotation processor creates a new source file, the process is repeated. Once a processing round yields no further source files, all source files are compiled."*

**Dịch:** Compiler **định vị các annotation của các file source**. **Mỗi annotation processor được thực thi lần lượt** và **được đưa những annotation mà nó bày tỏ quan tâm**. Nếu một annotation processor **tạo ra file source mới** thì **quá trình lặp lại**. Khi **một vòng xử lý (round) không sinh ra thêm file source nào nữa**, thì **mọi file source được compile**.

> **Note (sách):** *"An annotation processor can only generate new source files. It cannot modify an existing source file."*
>
> **Dịch:** **Annotation processor chỉ sinh được file source mới. Nó không sửa được file source đã có.**

> *"An annotation processor implements the Processor interface, generally by extending the AbstractProcessor class. You need to specify which annotations your processor supports. In our case:"*

```java
@SupportedAnnotationTypes("com.horstmann.annotations.ToString")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class ToStringAnnotationProcessor extends AbstractProcessor
{
    public boolean process(Set<? extends TypeElement> annotations,
            RoundEnvironment currentRound)
    {
        . . .
    }
}
```

**Dịch:** Một annotation processor **implement interface `Processor`**, thường bằng cách **extend class `AbstractProcessor`**. Bạn phải **chỉ định processor của mình hỗ trợ những annotation nào**.

> *"A processor can claim specific annotation types, wildcards such as "com.horstmann.*" (all annotations in the com.horstmann package or any subpackage), or even "*" (all annotations)."*

**Dịch:** Một processor **nhận (claim) được các annotation type cụ thể**, **wildcard** như `"com.horstmann.*"` (**mọi annotation trong package `com.horstmann` hoặc bất kỳ subpackage nào**), hoặc thậm chí `"*"` (**mọi annotation**). (Xem [[08 - Packages]] ở Volume I.)

> *"The process method is called once for each round, with the set of all annotations that were found in any files during this round, and a RoundEnvironment reference that contains information about the current processing round."*

**Dịch:** Method **`process` được gọi một lần cho mỗi round**, với **tập tất cả annotation tìm thấy trong bất kỳ file nào trong round đó**, và một **reference `RoundEnvironment`** chứa **thông tin về round xử lý hiện tại**.

---

## 8.6.2. The Language Model API

> *"Use the language model API for analyzing source-level annotations. Unlike the reflection API, which presents the virtual machine representation of classes and methods, the language model API lets you analyze a Java program according to the rules of the Java language."*

**Dịch:** Dùng **language model API để phân tích source-level annotation**. Khác với **reflection API** — thứ trình bày **cách virtual machine biểu diễn class và method** — **language model API cho phép bạn phân tích một chương trình Java theo đúng luật của ngôn ngữ Java**. (So sánh với [[10 - Reflection]] ở Volume I.)

> *"The compiler produces a tree whose nodes are instances of classes that implement the javax.lang.model.element.Element interface and its subinterfaces: TypeElement, VariableElement, ExecutableElement, and so on. These are the compile-time analogs to the Class, Field/Parameter, Method/Constructor reflection classes."*

**Dịch:** Compiler **sinh ra một cây** mà các node là instance của những class **implement interface `javax.lang.model.element.Element`** và các subinterface của nó: **`TypeElement`, `VariableElement`, `ExecutableElement`**, v.v. Đây là **những thứ tương đương ở mức compile-time** với các reflection class **`Class`, `Field`/`Parameter`, `Method`/`Constructor`**.

> *"I do not want to cover the API in detail, but here are the highlights that you need to know for processing annotations:"*
>
> - *"The RoundEnvironment gives you a set of all elements annotated with a particular annotation. Call the method"*
>
> ```java
> Set<? extends Element> getElementsAnnotatedWith(Class<? extends Annotation> a)
> ```
>
> - *"The source-level equivalent of the AnnotateElement interface is AnnotatedConstruct. Use the methods"*
>
> ```java
> A getAnnotation(Class<A> annotationType)
> A[] getAnnotationsByType(Class<A> annotationType)
> ```
>
> *"to get the annotation or repeated annotations for a given annotation class."*
>
> - *"A TypeElement represents a class or interface. The getEnclosedElements method yields a list of its fields and methods."*
> - *"Calling getSimpleName on an Element or getQualifiedName on a TypeElement yields a Name object that can be converted to a string with toString."*

**Dịch:** Sách không đi sâu vào API, nhưng đây là **những điểm chính cần biết để xử lý annotation**:

| Điểm chính | Nội dung |
|---|---|
| **`RoundEnvironment`** | cho bạn **tập mọi element được annotate bởi một annotation cụ thể**, qua method `getElementsAnnotatedWith` |
| **`AnnotatedConstruct`** | **bản tương đương ở mức source của interface `AnnotatedElement`**; dùng `getAnnotation` / `getAnnotationsByType` để lấy annotation hoặc các annotation lặp lại của một annotation class |
| **`TypeElement`** | biểu diễn **một class hoặc interface**; method **`getEnclosedElements`** cho ra **danh sách field và method của nó** |
| **`getSimpleName` / `getQualifiedName`** | gọi `getSimpleName` trên một `Element` hoặc `getQualifiedName` trên một `TypeElement` cho ra một **object `Name`**, **chuyển sang string được bằng `toString`** |

---

## 8.6.3. Using Annotations to Generate Source Code

> *"As an example, we will use annotations to reduce the tedium of implementing toString methods. We can't put these methods into the original classes—annotation processors can only produce new classes, not modify existing ones. Therefore, we'll add all methods into a utility class ToStrings:"*

```java
public class ToStrings
{
    public static String toString(Point obj)
    {
        Generated code
    }

    public static String toString(Rectangle obj)
    {
        Generated code
    }
    . . .
    public static String toString(Object obj)
    {
        return Objects.toString(obj);
    }
}
```

**Dịch:** Làm ví dụ, sách dùng annotation để **giảm sự nhàm chán của việc implement method `toString`**. **Không đặt được các method này vào chính các class gốc** — **annotation processor chỉ sinh được class mới, không sửa được class đã có**. Vì vậy **gom mọi method vào một utility class `ToStrings`**.

> *"We don't want to use reflection, so we annotate accessor methods, not fields:"*

```java
@ToString
public class Rectangle
{
    . . .
    @ToString(includeName=false) public Point getTopLeft() { return topLeft; }
    @ToString public int getWidth() { return width; }
    @ToString public int getHeight() { return height; }
}
```

**Dịch:** Ta **không muốn dùng reflection**, nên **annotate các accessor method chứ không annotate field**.

> *"The annotation processor should then generate the following source code:"*

```java
public static String toString(Rectangle obj)
{
    var result = new StringBuilder();
    result.append("Rectangle");
    result.append("[");
    result.append(toString(obj.getTopLeft()));
    result.append(",");
    result.append("width=");
    result.append(toString(obj.getWidth()));
    result.append(",");
    result.append("height=");
    result.append(toString(obj.getHeight()));
    result.append("]");
    return result.toString();
}
```

> *"The "boilerplate" code is in gray. Here is an outline of the method that produces the toString method for a class with a given TypeElement:"*

**Dịch:** Phần code **"boilerplate" được in xám** trong sách. *(Bản trích văn bản không giữ lại màu chữ, nên không phân biệt được phần xám.)* Dưới đây là **phác thảo method sinh ra method `toString`** cho một class ứng với một `TypeElement` cho trước.

```java
private void writeToStringMethod(PrintWriter out, TypeElement te)
{
    String className = te.getQualifiedName().toString();

    Print method header and declaration of string builder

    ToString ann = te.getAnnotation(ToString.class);
    if (ann.includeName())
        Print code to add class name
    for (Element c : te.getEnclosedElements())
    {
        ann = c.getAnnotation(ToString.class);
        if (ann != null)
        {
            if (ann.includeName()) Print code to add field name
            Print code to append toString(obj.methodName())
        }
    }

    Print code to return string
}
```

> *"And here is an outline of the process method of the annotation processor. It creates a source file for the helper class and writes the class header and one method for each annotated class."*

```java
public boolean process(Set<? extends TypeElement> annotations,
        RoundEnvironment currentRound)
{
    if (annotations.size() == 0) return true;
    try
    {
        JavaFileObject sourceFile = processingEnv.getFiler().createSourceFile(
            "com.horstmann.annotations.ToStrings");
        try (var out = new PrintWriter(sourceFile.openWriter()))
        {
            Print code for package and class
            for (Element e : currentRound.getElementsAnnotatedWith(ToString.class))
            {
                if (e instanceof TypeElement)
                {
                    TypeElement te = (TypeElement) e;
                    writeToStringMethod(out, te);
                }
            }
            Print code for toString(Object)
        }
        catch (IOException ex)
        {
            processingEnv.getMessager().printMessage(
                Kind.ERROR, ex.getMessage());
        }
    }
    return true;
}
```

**Dịch:** Đây là **phác thảo method `process` của annotation processor**. Nó **tạo một file source cho helper class**, rồi **ghi class header và một method cho mỗi class được annotate**.

> *"For the tedious details, check the book's companion code."*

> *"Note that the process method is called in subsequent rounds with an empty list of annotations. It then returns immediately so it doesn't create the source file twice."*

**Dịch:** Lưu ý method `process` **được gọi ở các round tiếp theo với danh sách annotation rỗng**. Khi đó nó **trả về ngay lập tức** để **không tạo file source hai lần**.

> *"First, compile the annotation processor, and then compile and run the test program as follows:"*

```
javac sourceAnnotations/ToStringAnnotationProcessor.java
javac -processor sourceAnnotations.ToStringAnnotationProcessor rect/*.java
java rect.SourceLevelAnnotationDemo
```

**Dịch:** Trước hết **compile annotation processor**, sau đó **compile và chạy chương trình test** như trên.

> **Tip (sách):** *"To see the rounds, run the javac command with the -XprintRounds flag:"*
>
> ```
> Round 1:
>         input files: {rect.Point, rect.Rectangle,
>                 rect.SourceLevelAnnotationDemo}
>         annotations: [sourceAnnotations.ToString]
>         last round: false
> Round 2:
>         input files: {sourceAnnotations.ToStrings}
>         annotations: []
>         last round: false
> Round 3:
>         input files: {}
>         annotations: []
>         last round: true
> ```
>
> **Dịch:** Muốn **thấy các round** thì chạy lệnh `javac` với cờ **`-XprintRounds`**.

> *"This example demonstrates how tools can harvest source file annotations to produce other files. The generated files don't have to be source files. Annotation processors may choose to generate XML descriptors, property files, shell scripts, HTML documentation, and so on."*

**Dịch:** Ví dụ này minh hoạ cách **các công cụ thu hoạch annotation trong file source để sinh ra file khác**. **File được sinh không nhất thiết phải là file source** — annotation processor có thể chọn sinh **XML descriptor, property file, shell script, tài liệu HTML**, v.v.

> **Note (sách):** *"Some people have suggested using annotations to remove an even bigger drudgery. Wouldn't it be nice if trivial getters and setters were generated automatically? For example, the annotation"*
>
> ```java
> @Property private String title;
> ```
>
> *"could produce the methods"*
>
> ```java
> public String getTitle() { return title; }
> public void setTitle(String title) { this = title; }
> ```
>
> *"However, those methods need to be added to the same class. This requires editing a source file, not just generating another file, and is beyond the capabilities of annotation processors. It would be possible to build another tool for this purpose, but such a tool would go beyond the mission of annotations. An annotation is intended as a description about a code item, not a directive for adding or changing code."*
>
> **Dịch:** Có người đề xuất dùng annotation để **loại bỏ một sự cực nhọc còn lớn hơn**: sẽ hay biết mấy nếu **getter và setter tầm thường được sinh tự động**. Tuy nhiên, **những method đó cần được thêm vào chính class đó**. Việc này đòi hỏi **sửa một file source, chứ không chỉ sinh ra một file khác**, và **vượt quá khả năng của annotation processor**. Có thể dựng một công cụ khác cho mục đích này, nhưng **công cụ như vậy sẽ đi quá sứ mệnh của annotation**. **Annotation vốn được thiết kế như một mô tả về một item code, không phải một chỉ thị để thêm hay sửa code.**

---

## Bài kế tiếp

→ [[07 - Bytecode Engineering]] — xử lý annotation ở mức bytecode bằng thư viện ASM, sửa file class và tiêm bytecode lúc load.
