# 05 — Source-Level Annotation Processing

> Chapter 11, Section 11.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.5. Source-Level Annotation Processing

> *"In the preceding section, you saw how to analyze annotations in a running program. Another use for annotation is the automatic processing of source files to produce more source code, configuration files, scripts, or whatever else one might want to generate."*

**Dịch:** Ở section trước, bạn đã thấy **cách phân tích annotation trong một chương trình đang chạy** — xem [[04 - Processing Annotations at Runtime]]. Một công dụng khác của annotation là **tự động xử lý file nguồn để sinh ra thêm source code, file cấu hình, script, hay bất cứ thứ gì khác mà ta muốn sinh ra**.

> *"To show you the mechanics, I will repeat the example of generating toString methods. However, this time, let's generate them in Java source. Then the methods will get compiled with the rest of the program, and they will run at full speed instead of using reflection."*

**Dịch:** Để trình bày cơ chế, tác giả **lặp lại ví dụ sinh method `toString`**. Nhưng lần này, ta **sinh chúng ra dưới dạng Java source**. Khi đó các method ấy **được compile cùng phần còn lại của chương trình**, và **chạy hết tốc lực thay vì dùng reflection**.

---

## 11.5.1. Annotation Processors

> *"Annotation processing is integrated into the Java compiler. During compilation, you can invoke annotation processors by running"*

```
javac -processor ProcessorClassName1,ProcessorClassName2,. . . sourceFiles
```

**Dịch:** **Việc xử lý annotation được tích hợp sẵn trong Java compiler.** Trong lúc compile, bạn **gọi các annotation processor** bằng lệnh trên.

> *"The compiler locates the annotations of the source files. Each annotation processor is executed in turn and given the annotations in which it expressed an interest. If an annotation processor creates a new source file, the process is repeated. Once a processing round yields no further source files, all source files are compiled."*

**Dịch:** Compiler **định vị các annotation trong file nguồn**. **Mỗi annotation processor được chạy lần lượt** và được đưa cho **những annotation mà nó bày tỏ quan tâm**. Nếu một annotation processor **tạo ra file nguồn mới**, thì **quá trình lặp lại**. Khi **một round xử lý không sinh thêm file nguồn nào nữa**, **toàn bộ file nguồn được compile**.

> **Note (sách):** *"An annotation processor can only generate new source files. It cannot modify an existing source file."*
> **Dịch:** Một annotation processor **chỉ sinh được file nguồn mới**. Nó **không sửa được file nguồn đã có**.

> *"An annotation processor implements the Processor interface, generally by extending the AbstractProcessor class. You need to specify which annotations your processor supports. In our case:"*

```java
@SupportedAnnotationTypes("annotations.ToString")
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

**Dịch:** Một annotation processor **implement interface `Processor`**, thường là bằng cách **extend class `AbstractProcessor`** — xem [[01 - Interfaces]]. Bạn cần **chỉ rõ processor của mình hỗ trợ những annotation nào**.

> *"A processor can claim specific annotation types, wildcards such as "com.horstmann.*" (all annotations in the com.horstmann package or any subpackage), or even "*" (all annotations)."*

**Dịch:** Một processor có thể **nhận (claim) các annotation type cụ thể**, **wildcard** như `"com.horstmann.*"` (mọi annotation trong package `com.horstmann` **hoặc bất kỳ subpackage nào**) — xem [[08 - Packages]] — hoặc thậm chí `"*"` (**mọi annotation**).

> *"The process method is called once for each round, with the set of all annotations that were found in any files during this round, and a RoundEnvironment reference that contains information about the current processing round."*

**Dịch:** Method `process` **được gọi một lần cho mỗi round**, kèm theo **tập hợp mọi annotation tìm thấy trong bất kỳ file nào ở round này**, và một **reference `RoundEnvironment`** chứa **thông tin về round xử lý hiện tại**.

---

## 11.5.2. The Language Model API

> *"Use the language model API for analyzing source-level annotations. Unlike the reflection API, which presents the virtual machine representation of classes and methods, the language model API lets you analyze a Java program according to the rules of the Java language."*

**Dịch:** Dùng **language model API** để phân tích **annotation ở mức source**. Khác với **reflection API** — thứ trình bày **biểu diễn ở mức virtual machine** của class và method (xem [[10 - Reflection]]) — language model API cho phép bạn **phân tích một chương trình Java theo đúng quy tắc của ngôn ngữ Java**.

> *"The compiler produces a tree whose nodes are instances of classes that implement the javax.lang.model.element.Element interface and its subinterfaces, TypeElement, VariableElement, ExecutableElement, and so on. These are the compile-time analogs to the Class, Field/Parameter, Method/Constructor reflection classes."*

**Dịch:** Compiler **sinh ra một cây (tree)** mà các node là **instance của những class implement interface `javax.lang.model.element.Element`** và các **subinterface** của nó: **`TypeElement`, `VariableElement`, `ExecutableElement`**, v.v. Đây là **những thứ tương ứng ở mức compile-time** với các reflection class **`Class`, `Field`/`Parameter`, `Method`/`Constructor`**.

> *"I do not want to cover the API in detail, but here are the highlights that you need to know for processing annotations."*

**Dịch:** Tác giả **không đi sâu vào API**, chỉ nêu **những điểm chính cần biết để xử lý annotation**.

> *"The RoundEnvironment gives you a set of all elements annotated with a particular annotation, by calling the one of the methods"*

```java
Set<? extends Element> getElementsAnnotatedWith(Class<? extends Annotation> a)
Set<? extends Element> getElementsAnnotatedWithAny(
    Set<Class<? extends Annotation>> annotations)
```

**Dịch:** `RoundEnvironment` trả cho bạn **tập hợp mọi element được annotate bằng một annotation cụ thể**, qua một trong hai method trên.

> *"The second method is useful for repeated annotations."*

**Dịch:** **Method thứ hai hữu ích với repeated annotation** — xem [[02 - Defining Annotations]].

> *"The source-level equivalent of the AnnotatedElement interface is AnnotatedConstruct. Use the methods"*

```java
A getAnnotation(Class<A> annotationType)
A[] getAnnotationsByType(Class<A> annotationType)
```

> *"to get the annotation or repeated annotations for a given annotation class."*

**Dịch:** Thứ **tương đương ở mức source** với interface `AnnotatedElement` là **`AnnotatedConstruct`**. Dùng các method trên để **lấy annotation hoặc các repeated annotation** ứng với một annotation class cho trước. Xem [[09 - Reflection and Generics]].

> *"A TypeElement represents a class or interface. The getEnclosedElements method yields a list of its fields and methods."*

**Dịch:** Một **`TypeElement` đại diện cho một class hoặc interface**. Method **`getEnclosedElements`** trả về **danh sách các field và method của nó**.

> *"Calling getSimpleName on an Element or getQualifiedName on a TypeElement yields a Name object that can be converted to a string with toString."*

**Dịch:** Gọi **`getSimpleName`** trên một `Element`, hoặc **`getQualifiedName`** trên một `TypeElement`, sẽ trả về một **object `Name`**, và object này **chuyển thành string được bằng `toString`**.

---

## 11.5.3. Using Annotations to Generate Source Code

> *"Let us return to our task of automatically generating toString methods. We can't put these methods into the original classes—annotation processors can only produce new classes, not modify existing ones."*

**Dịch:** Quay lại nhiệm vụ **tự động sinh method `toString`**. Ta **không đặt được các method này vào chính các class gốc** — annotation processor **chỉ sinh được class mới, không sửa được class đã có**.

> *"Therefore, we'll add all methods into a utility class ToStrings:"*

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

**Dịch:** Vì vậy, ta **gom mọi method vào một utility class `ToStrings`**.

> *"Since we don't want to use reflection, we annotate accessor methods, not fields:"*

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

**Dịch:** Vì **không muốn dùng reflection**, ta **annotate các accessor method chứ không annotate field**. Xem [[03 - Defining Your Own Classes]].

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

> *"The "boilerplate" code is in gray. Here is an outline of the method that produces the toString method for a class with given TypeElement:"*

**Dịch:** Phần code **"boilerplate" được tô xám** (trong sách in). Dưới đây là **phác thảo của method sinh ra method `toString`** cho một class ứng với một `TypeElement` cho trước.

```java
private void writeToStringMethod(PrintWriter out, TypeElement te)
{
    String className = te.getQualifiedName().toString();
    Print method header and declaration of string builder
    ToString ann = te.getAnnotation(ToString.class);
    if (ann.includeName()) Print code to add class name
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

**Dịch:** Và đây là **phác thảo method `process`** của annotation processor. Nó **tạo một file nguồn cho helper class**, rồi **ghi class header và một method cho mỗi class được annotate**.

```java
public boolean process(Set<? extends TypeElement> annotations,
    RoundEnvironment currentRound)
{
    if (annotations.size() == 0) return true;
    try
    {
        JavaFileObject sourceFile = processingEnv.getFiler().createSourceFile(
            "annotations.ToStrings");
        try (var out = new PrintWriter(sourceFile.openWriter()))
        {
            Print code for package and class
            for (Element e : currentRound.getElementsAnnotatedWith(ToString.class))
                if (e instanceof TypeElement te)
                    writeToStringMethod(out, te);
            Print code for toString(Object)
        }
    }
    catch (IOException ex)
    {
        processingEnv.getMessager().printMessage(Kind.ERROR, ex.getMessage());
    }
    return true;
}
```

> *"Note that the process method is called in subsequent rounds with an empty list of annotations. It then returns immediately so it doesn't create the source file twice."*

**Dịch:** Lưu ý method `process` **được gọi lại ở những round sau với danh sách annotation rỗng**. Khi đó nó **return ngay lập tức** để **không tạo file nguồn hai lần**.

> **Tip (sách):** *"To see the rounds, run the javac command with the -XprintRounds flag:"*

```
Round 1:
        input files: {rect.Point, rect.Rectangle, rect.SourceLevelAnnotationDemo}
        annotations: [sourceAnnotations.ToString]
        last round: false
Round 2:
        input files: {sourceAnnotations.ToStrings}
        annotations: []
        last round: false
Round 3:
        input files: {}
        annotations: []
        last round: true
```

> **Dịch:** Để **xem các round**, chạy lệnh `javac` với **flag `-XprintRounds`**.

> *"To run the example program, first build the annotation processor, then use it to compile the demo:"*

```
javac sourceAnnotations/ToStringAnnotationProcessor.java
javac -XprintRounds -processor sourceAnnotations.ToStringAnnotationProcessor rect/*.java
java rect.SourceLevelAnnotationDemo
```

**Dịch:** Để chạy chương trình ví dụ, **trước hết build annotation processor**, rồi **dùng nó để compile demo**.

> *"This example demonstrates how tools can harvest source file annotations to produce other files. The generated files don't have to be source files. Annotation processors may choose to generate XML descriptors, property files, shell scripts, HTML documentation, and so on."*

**Dịch:** Ví dụ này minh hoạ **cách các tool thu hoạch annotation trong file nguồn để sinh ra file khác**. **File sinh ra không nhất thiết phải là file nguồn.** Annotation processor có thể chọn sinh **XML descriptor, property file, shell script, tài liệu HTML**, v.v.

> **Note (sách):** *"Some people have suggested using annotations to remove an even bigger drudgery. Wouldn't it be nice if trivial getters and setters were generated automatically? For example, the annotation"*

```java
@Property private String title;
```

> *"could produce the methods"*

```java
public String getTitle() { return title; }
public void setTitle(String title) { this = title; }
```

> *"However, those methods need to be added to the same class. This requires editing a source file, not just generating another file, and is beyond the capabilities of annotation processors. It would be possible to build another tool for this purpose, but such a tool would go beyond the mission of annotations. An annotation is intended as a description about a code item, not a directive for adding or changing code."*
>
> *"A popular tool called Project Lombok has found a way around this limitation. By modifying internal compiler data structures during annotation processing, it can produce getter and setter methods. At least for now, it works, but it is not standard Java."*

> **Dịch:** Có người đã đề xuất dùng annotation để **loại bỏ một nỗi cực nhọc còn lớn hơn**: sẽ hay biết mấy nếu **getter và setter tầm thường được sinh tự động**. Tuy nhiên, **các method đó cần được thêm vào chính class ấy**. Việc này đòi hỏi **sửa file nguồn, không chỉ là sinh ra file khác**, và **vượt quá khả năng của annotation processor**. Có thể dựng một tool khác cho mục đích này, nhưng tool ấy sẽ **vượt ra ngoài sứ mệnh của annotation**: **một annotation được thiết kế để mô tả về một code item, không phải để ra chỉ thị thêm hay đổi code**.
>
> Một tool phổ biến tên **Project Lombok** đã **tìm ra cách lách giới hạn này**. Bằng cách **sửa các cấu trúc dữ liệu nội bộ của compiler trong lúc annotation processing**, nó **sinh được getter và setter**. **Ít nhất tới hiện tại thì nó chạy được, nhưng đó không phải Java chuẩn.**

---

### Listing 11.3 — `rect/SourceLevelAnnotationDemo.java`

```java
package rect;

import sourceAnnotations.ToStrings;

public class SourceLevelAnnotationDemo
{
    public static void main(String[] args)
    {
        var rect = new Rectangle(new Point(5, 10), 20, 30);
        System.out.println(ToStrings.toString(rect));
    }
}
```

### Listing 11.4 — `sourceAnnotations/ToStringAnnotationProcessor.java`

```java
package sourceAnnotations;

import java.beans.*;
import java.io.*;
import java.util.*;

import javax.annotation.processing.*;
import javax.lang.model.*;
import javax.lang.model.element.*;
import javax.tools.*;
import javax.tools.Diagnostic.Kind;

@SupportedAnnotationTypes("sourceAnnotations.ToString")
@SupportedSourceVersion(SourceVersion.RELEASE_21)
public class ToStringAnnotationProcessor extends AbstractProcessor
{
    public boolean process(Set<? extends TypeElement> annotations,
            RoundEnvironment currentRound)
    {
        if (annotations.size() == 0) return true;
        try
        {
            JavaFileObject sourceFile
                = processingEnv.getFiler().createSourceFile("sourceAnnotations.ToStrings");
            try (var out = new PrintWriter(sourceFile.openWriter()))
            {
                out.println("// Automatically generated by"
                    + " sourceAnnotations.ToStringAnnotationProcessor");
                out.println("package sourceAnnotations;");
                out.println("public class ToStrings {");

                for (Element e : currentRound.getElementsAnnotatedWith(ToString.class))
                    if (e instanceof TypeElement te)
                        writeToStringMethod(out, te);
                out.println("   public static String toString(Object obj) {");
                out.println("      return java.util.Objects.toString(obj);");
                out.println("   }");
                out.println("}");
            }
        }
        catch (IOException e)
        {
            processingEnv.getMessager().printMessage(Kind.ERROR, e.getMessage());
        }
        return true;
    }

    private void writeToStringMethod(PrintWriter out, TypeElement te)
    {
        String className = te.getQualifiedName().toString();
        out.println("   public static String toString(" + className + " obj) {");
        ToString ann = te.getAnnotation(ToString.class);
        out.println("      var result = new StringBuilder();");
        if (ann.includeName())
            out.println("      result.append(\"" + className + "\");");
        out.println("      result.append(\"[\");");
        boolean first = true;
        for (Element c : te.getEnclosedElements())
        {
            String methodName = c.getSimpleName().toString();
            ann = c.getAnnotation(ToString.class);
            if (ann != null)
            {
                if (first) first = false; else out.println("      result.append(\",\");");
                if (ann.includeName())
                {
                    String fieldName = Introspector.decapitalize(
                        methodName.replaceAll("^(get|is)", ""));
                    // Turn getWidth into width, isDone into done, getURL into URL
                    out.println("      result.append(\"" + fieldName + "=" + "\");");
                }
                out.println("      result.append(toString(obj." + methodName + "()));");
            }
        }
        out.println("      result.append(\"]\");");
        out.println("      return result.toString();");
        out.println("   }");
    }
}
```

---

## Bài kế tiếp

→ [[06 - Bytecode Engineering]] — xử lý annotation ở mức bytecode bằng thư viện ASM, sửa class file và sửa bytecode lúc load time bằng agent.
