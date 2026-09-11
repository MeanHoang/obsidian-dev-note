# 02 — The Compiler API

> Chapter 8, Section 8.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.2. The Compiler API

> *"There are quite a few tools that need to compile Java code. Obviously, development environments and programs that teach Java programming are among them, as well as testing and build automation tools. Another example is the processing of JavaServer Pages—web pages with embedded Java statements."*

**Dịch:** Có **khá nhiều công cụ cần compile code Java**: hiển nhiên là **môi trường phát triển** và các chương trình **dạy lập trình Java**, cùng với **công cụ testing và build automation**. Một ví dụ khác là việc **xử lý JavaServer Pages** — trang web có nhúng câu lệnh Java.

---

## 8.2.1. Invoking the Compiler

> *"It is very easy to invoke the compiler. Here is a sample call:"*

```java
JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
OutputStream outStream = . . .;
OutputStream errStream = . . .;
int result = compiler.run(null, outStream, errStream,
    "-sourcepath", "src", "Test.java");
```

> *"A result value of 0 indicates successful compilation."*

**Dịch:** **Gọi compiler rất dễ.** Giá trị `result` bằng **0** nghĩa là **compile thành công**.

> *"The compiler sends its output and error messages to the provided streams. You can set these parameters to null, in which case System.out and System.err are used. The first parameter of the run method is an input stream. As the compiler takes no console input, you can always leave it as null. (The run method is inherited from a generic Tool interface, which allows for tools that read input.)"*

**Dịch:** Compiler gửi **output và error message** tới các stream bạn cung cấp. Đặt các parameter này là **`null`** thì `System.out` và `System.err` được dùng. **Parameter đầu tiên của method `run` là một input stream** — do compiler **không nhận console input** nên **luôn để `null` được**. (Method `run` được thừa hưởng từ một interface `Tool` tổng quát, dành cho những tool có đọc input.)

> *"The remaining parameters of the run method are the arguments that you would pass to javac if you invoked it on the command line. These can be options or file names."*

**Dịch:** Các parameter còn lại của `run` chính là **những argument bạn sẽ truyền cho `javac` khi gọi trên command line** — có thể là **option hoặc tên file**.

---

## 8.2.2. Launching a Compilation Task

> *"You can have more control over the compilation process with a CompilationTask object. This can be useful if you want to supply source from string, capture class files in memory, or process the error and warning messages."*

**Dịch:** Bạn **kiểm soát quá trình compile nhiều hơn** với một object **`CompilationTask`**. Hữu ích khi muốn **cấp source từ string**, **bắt file class trong memory**, hoặc **xử lý error và warning message**.

> *"To obtain a CompilationTask, start with a compiler object as in the preceding section. Then call"*

```java
JavaCompiler.CompilationTask task = compiler.getTask(
    errorWriter, // Uses System.err if null
    fileManager, // Uses the standard file manager if null
    diagnostics, // Uses System.err if null
    options,     // null if no options
    classes,     // For annotation processing; null if none
    sources);
```

> *"The last three arguments are Iterable instances. For example, a sequence of options might be specified as"*

```java
Iterable<String> options = List.of("-d", "bin");
```

**Dịch:** **Ba argument cuối là các instance `Iterable`.**

> *"The sources parameter is an Iterable of JavaFileObject instances. If you want to compile disk files, get a StandardJavaFileManager and call its getJavaFileObjects method:"*

```java
StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
Iterable<JavaFileObject> sources
    = fileManager.getJavaFileObjectsFromStrings(List.of("File1.java", "File2.java"));
JavaCompiler.CompilationTask task = compiler.getTask(
    null, null, null, options, null, sources);
```

**Dịch:** Parameter `sources` là một **`Iterable` các instance `JavaFileObject`**. Muốn compile **file trên đĩa** thì lấy một `StandardJavaFileManager` rồi gọi method `getJavaFileObjects` của nó.

> **Note (sách):** *"The classes parameter is only used for annotation processing. In that case, you also need to call task.processors(annotationProcessors) with a list of Processor objects. See Section 8.6, "Source-Level Annotation Processing," on p. 484 for an example of annotation processing."*
>
> **Dịch:** Parameter `classes` **chỉ dùng cho annotation processing**. Trong trường hợp đó bạn còn phải gọi `task.processors(annotationProcessors)` với một **danh sách object `Processor`**. Xem [[06 - Source-Level Annotation Processing]].

> *"The getTask method returns the task object but does not yet start the compilation process. The CompilationTask class extends Callable\<Boolean>. You can pass it to an ExecutorService for concurrent execution, or you can just make a synchronous call:"*

```java
Boolean success = task.call();
```

**Dịch:** `getTask` **trả về object task nhưng chưa khởi động quá trình compile**. Class `CompilationTask` **extends `Callable<Boolean>`** — bạn **truyền nó cho một `ExecutorService`** để chạy đồng thời, hoặc **gọi đồng bộ** bằng `task.call()`.

---

## 8.2.3. Capturing Diagnostics

> *"To listen to error messages, install a DiagnosticListener. The listener receives a Diagnostic object whenever the compiler reports a warning or error message. The DiagnosticCollector class implements this interface. It simply collects all diagnostics so that you can iterate through them after the compilation is complete."*

```java
DiagnosticCollector<JavaFileObject> collector = new DiagnosticCollector<>();
compiler.getTask(null, fileManager, collector, null, null, sources).call();
for (Diagnostic<? extends JavaFileObject> d : collector.getDiagnostics())
{
    System.out.println(d);
}
```

**Dịch:** Muốn **lắng nghe error message** thì cài một **`DiagnosticListener`**. Listener nhận một object **`Diagnostic`** mỗi khi compiler báo warning hay error. Class **`DiagnosticCollector`** implement interface này: nó **gom hết mọi diagnostic** để bạn **duyệt qua sau khi compile xong**.

> *"A Diagnostic object contains information about the problem location (including file name, line number, and column number) as well as a human-readable description."*

**Dịch:** Object `Diagnostic` chứa thông tin về **vị trí vấn đề** (gồm **tên file, số dòng, số cột**) cùng một **mô tả người đọc được**.

> *"You can also install a DiagnosticListener to the standard file manager, in case you want to trap messages about missing files:"*

```java
StandardJavaFileManager fileManager
    = compiler.getStandardFileManager(diagnostics, null, null);
```

**Dịch:** Bạn cũng **cài được một `DiagnosticListener` vào standard file manager**, phòng khi muốn **bắt các message về file bị thiếu**.

---

## 8.2.4. Reading Source Files from Memory

> *"If you generate source code on the fly, you can have it compiled from memory, without having to save files to disk. Use this class to hold the code:"*

```java
public class StringSource extends SimpleJavaFileObject
{
    private String code;

    StringSource(String name, String code)
    {
        super(URI.create("string:///" + name.replace('.','/') + ".java"), Kind.SOURCE);
        this.code = code;
    }

    public CharSequence getCharContent(boolean ignoreEncodingErrors)
    {
        return code;
    }
}
```

**Dịch:** Nếu bạn **sinh source code ngay lúc chạy**, bạn **compile được nó từ memory**, **không phải lưu file xuống đĩa**. Dùng class trên để giữ code.

> *"Then generate the code for your classes and give the compiler a list of StringSource objects:"*

```java
List<StringSource> sources = List.of(
    new StringSource(className1, class1CodeString), . . .);
task = compiler.getTask(null, fileManager, diagnostics, null, null, sources);
```

**Dịch:** Rồi sinh code cho các class của bạn và **đưa cho compiler một danh sách object `StringSource`**.

---

## 8.2.5. Writing Byte Codes to Memory

> *"If you compile classes on the fly, there is no need to save the class files to disk. You can save them to memory and load them right away."*

> *"First, here is a class for holding the bytes:"*

```java
public class ByteArrayClass extends SimpleJavaFileObject
{
    private ByteArrayOutputStream out;

    ByteArrayClass(String name)
    {
        super(URI.create("bytes:///" + name.replace('.','/') + ".class"), Kind.CLASS);
    }

    public byte[] getCode()
    {
        return out.toByteArray();
    }

    public OutputStream openOutputStream() throws IOException
    {
        out = new ByteArrayOutputStream();
        return out;
    }
}
```

**Dịch:** Nếu compile class ngay lúc chạy thì **không cần lưu file class xuống đĩa** — **lưu vào memory rồi load ngay** được. Trước hết là một class để **giữ các byte**.

> *"Next, you need to configure the file manager to use these classes for output:"*

```java
List<ByteArrayClass> classes = new ArrayList<>();
StandardJavaFileManager stdFileManager
    = compiler.getStandardFileManager(null, null, null);
JavaFileManager fileManager
    = new ForwardingJavaFileManager<JavaFileManager>(stdFileManager)
    {
        public JavaFileObject getJavaFileForOutput(Location location,
                String className, Kind kind, FileObject sibling)
                throws IOException
        {
            if (kind == Kind.CLASS)
            {
                ByteArrayClass outfile = new ByteArrayClass(className);
                classes.add(outfile);
                return outfile;
            }
            else
                return super.getJavaFileForOutput(location, className, kind, sibling);
        }
    };
```

**Dịch:** Kế đó, **cấu hình file manager để dùng các class này cho output**.

> *"To load the classes, you need a class loader (see Chapter 10):"*

```java
public class ByteArrayClassLoader extends ClassLoader
{
    private Iterable<ByteArrayClass> classes;

    public ByteArrayClassLoader(Iterable<ByteArrayClass> classes)
    {
        this.classes = classes;
    }

    public Class<?> findClass(String name) throws ClassNotFoundException
    {
        for (ByteArrayClass cl : classes)
        {
            if (cl.getName().equals("/" + name.replace('.','/') + ".class"))
            {
                byte[] bytes = cl.getCode();
                return defineClass(name, bytes, 0, bytes.length);
            }
        }
        throw new ClassNotFoundException(name);
    }
}
```

**Dịch:** Muốn **load các class** thì cần một **class loader** (Chapter 10).

> *"After compilation has finished, call the Class.forName method with that class loader:"*

```java
ByteArrayClassLoader loader = new ByteArrayClassLoader(classes);
Class<?> cl = Class.forName(className, true, loader);
```

**Dịch:** Compile xong thì gọi method **`Class.forName` với class loader đó**. (Xem thêm [[10 - Reflection]] ở Volume I.)

---

## 8.2.6. An Example: Dynamic Java Code Generation

> *"In the JSP technology for dynamic web pages, you can mix HTML with snippets of Java code, for example:"*

```html
<p>The current date and time is <b><%= new java.util.Date() %></b>.</p>
```

> *"The JSP engine dynamically compiles the Java code into a servlet. In our sample application, we use a simpler example and generate dynamic Swing code instead. The idea is that you use a GUI builder to lay out the components in a frame and specify the behavior of the components in an external file."*

**Dịch:** Trong công nghệ **JSP** cho trang web động, bạn **trộn HTML với các mẩu code Java**. **JSP engine compile động code Java thành một servlet.** Trong ứng dụng mẫu, sách dùng ví dụ đơn giản hơn: **sinh code Swing động**. Ý tưởng là dùng **GUI builder** để bố trí component trong frame và **chỉ định hành vi của component trong một file bên ngoài**.

> *"Listing 8.4 shows a very simple example of a frame class, and Listing 8.5 shows the code for the button actions. Note that the constructor of the frame class calls an abstract method addEventHandlers. Our code generator will produce a subclass that implements the addEventHandlers method, adding an action listener for each line in the action.properties file. (We leave it as the proverbial exercise to the reader to extend the code generation to other event types.)"*

**Dịch:** Constructor của class frame **gọi một abstract method `addEventHandlers`**. Code generator sẽ **sinh ra một subclass implement `addEventHandlers`**, **thêm một action listener cho mỗi dòng trong file `action.properties`**.

> *"We place the subclass into a package with the name x, which we hope is not used anywhere else in the program. The generated code has the form"*

```java
package x;

public class Frame extends SuperclassName
{
    protected void addEventHandlers()
    {
        componentName1.addActionListener(event ->
        {
            code for event handler1
        });
        // repeat for the other event handlers . . .
    }
}
```

**Dịch:** Subclass được đặt vào một package tên **`x`**, hy vọng **không trùng chỗ nào khác trong chương trình**. (Xem [[08 - Packages]] ở Volume I.)

> *"The buildSource method in the program of Listing 8.3 builds up this code and places it into a StringSource object. That object is passed to the Java compiler. As described in the preceding section, we use a ForwardingJavaFileManager that constructs a ByteArrayClass object for every compiled class. These objects capture the class files generated when the x.Frame class is compiled. The method adds each file object to a list before returning it so that we can locate the bytecodes later."*

**Dịch:** Method `buildSource` **dựng đoạn code này và đặt vào một object `StringSource`**, rồi truyền cho Java compiler. Ta dùng một **`ForwardingJavaFileManager`** tạo một object `ByteArrayClass` **cho mỗi class được compile**. Các object này **bắt lấy file class sinh ra khi compile class `x.Frame`**. Method **thêm mỗi file object vào một list trước khi trả về**, để **định vị được bytecode sau này**.

> *"After compilation, we use the class loader from the preceding section to load the classes stored in this list. Then, we construct and display the application's frame class."*

```java
var loader = new ByteArrayClassLoader(classFileObjects);
var frame = (JFrame) loader.loadClass("x.Frame").getConstructor().newInstance();
frame.setVisible(true);
```

**Dịch:** Sau khi compile, dùng **class loader ở mục trước** để **load các class lưu trong list này**, rồi **dựng và hiển thị class frame của ứng dụng**.

> *"When you click the buttons, the background color changes in the usual way. To see that the actions are dynamically compiled, change one of the lines in action.properties, for example, like this:"*

```properties
yellowButton=panel.setBackground(java.awt.Color.YELLOW); yellowButton.setEnabled(false);
```

> *"Run the program again. Now the Yellow button is disabled after you click it."*

**Dịch:** Đổi một dòng trong `action.properties` rồi chạy lại: giờ **nút Yellow bị disable sau khi click**.

> *"Also, have a look at the code directories. You will not find any source or class files for the classes in the x package. This example demonstrates how you can use dynamic compilation with in-memory source and class files."*

**Dịch:** Nhìn vào các thư mục code, bạn **sẽ không thấy file source hay file class nào cho các class trong package `x`**. Ví dụ này minh hoạ cách **dùng dynamic compilation với source và class file nằm trong memory**.

### Listing 8.3 — `compiler/CompilerTest.java`

```java
package compiler;

import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.List;

import javax.swing.*;
import javax.tools.*;
import javax.tools.JavaFileObject.*;

/**
 * @version 1.10 2018-05-01
 * @author Cay Horstmann
 */
public class CompilerTest
{
    public static void main(final String[] args)
            throws IOException, ReflectiveOperationException
    {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();

        var classFileObjects = new ArrayList<ByteArrayClass>();
        var diagnostics = new DiagnosticCollector<JavaFileObject>();

        JavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, null, null);
        fileManager = new ForwardingJavaFileManager<JavaFileManager>(fileManager)
        {
            public JavaFileObject getJavaFileForOutput(Location location,
                    String className, Kind kind, FileObject sibling) throws IOException
            {
                if (kind == Kind.CLASS)
                {
                    var fileObject = new ByteArrayClass(className);
                    classFileObjects.add(fileObject);
                    return fileObject;
                }
                else return super.getJavaFileForOutput(location, className, kind, sibling);
            }
        };

        String frameClassName = args.length == 0 ? "buttons2.ButtonFrame" : args[0];
        //compiler.run(null, null, null, frameClassName.replace(".", "/") + ".java");

        StandardJavaFileManager fileManager2 = compiler.getStandardFileManager(null, null, null);
        var sources = new ArrayList<JavaFileObject>();
        for (JavaFileObject o : fileManager2.getJavaFileObjectsFromStrings(
                List.of(frameClassName.replace(".", "/") + ".java")))
            sources.add(o);

        JavaFileObject source = buildSource(frameClassName);
        JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnostics,
            null, null, List.of(source));
        Boolean result = task.call();

        for (Diagnostic<? extends JavaFileObject> d : diagnostics.getDiagnostics())
            System.out.println(d.getKind() + ": " + d.getMessage(null));
        fileManager.close();
        if (!result)
        {
            System.out.println("Compilation failed.");
            System.exit(1);
        }

        var loader = new ByteArrayClassLoader(classFileObjects);
        var frame = (JFrame) loader.loadClass("x.Frame").getConstructor().newInstance();

        EventQueue.invokeLater(() ->
        {
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setTitle("CompilerTest");
            frame.setVisible(true);
        });
    }

    /*
     * Builds the source for the subclass that implements the addEventHandlers method.
     * @return a file object containing the source in a string builder
     */
    static JavaFileObject buildSource(String superclassName)
            throws IOException, ClassNotFoundException
    {
        var builder = new StringBuilder();
        builder.append("package x;\n\n");
        builder.append("public class Frame extends " + superclassName + " {\n");
        builder.append("protected void addEventHandlers() {\n");
        var props = new Properties();
        props.load(Files.newInputStream(Paths.get(
            superclassName.replace(".", "/")).getParent().resolve("action.properties")));
        for (Map.Entry<Object, Object> e : props.entrySet())
        {
            var beanName = (String) e.getKey();
            var eventCode = (String) e.getValue();
            builder.append(beanName + ".addActionListener(event -> {\n");
            builder.append(eventCode);
            builder.append("\n} );\n");
        }
        builder.append("} }\n");
        return new StringSource("x.Frame", builder.toString());
    }
}
```

### Listing 8.4 — `buttons2/ButtonFrame.java`

```java
package buttons2;
import javax.swing.*;

/**
 * A frame with a button panel.
 * @version 1.00 2007-11-02
 * @author Cay Horstmann
 */
public abstract class ButtonFrame extends JFrame
{
    public static final int DEFAULT_WIDTH = 300;
    public static final int DEFAULT_HEIGHT = 200;

    protected JPanel panel;
    protected JButton yellowButton;
    protected JButton blueButton;
    protected JButton redButton;

    protected abstract void addEventHandlers();

    public ButtonFrame()
    {
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        panel = new JPanel();
        add(panel);

        yellowButton = new JButton("Yellow");
        blueButton = new JButton("Blue");
        redButton = new JButton("Red");

        panel.add(yellowButton);
        panel.add(blueButton);
        panel.add(redButton);

        addEventHandlers();
    }
}
```

### Listing 8.5 — `buttons2/action.properties`

```properties
yellowButton=panel.setBackground(java.awt.Color.YELLOW);
blueButton=panel.setBackground(java.awt.Color.BLUE);
```

---

## API tham chiếu

### `javax.tools.Tool` 6

| Method | Mô tả (sách) |
|---|---|
| `int run(InputStream in, OutputStream out, OutputStream err, String... arguments)` | runs the tool with the given input, output, and error streams and the given arguments. Returns 0 for success, a nonzero value for failure. |

### `javax.tools.JavaCompiler` 6

| Method | Mô tả (sách) |
|---|---|
| `StandardJavaFileManager getStandardFileManager(DiagnosticListener<? super JavaFileObject> diagnosticListener, Locale locale, Charset charset)` | gets the standard file manager for this compiler. You can supply `null` for default error reporting, locale, and character set. |
| `JavaCompiler.CompilationTask getTask(Writer out, JavaFileManager fileManager, DiagnosticListener<? super JavaFileObject> diagnosticListener, Iterable<String> options, Iterable<String> classesForAnnotationProcessing, Iterable<? extends JavaFileObject> sourceFiles)` | gets a compilation task that, when called, will compile the given source files. |

### `javax.tools.StandardJavaFileManager` 6

| Method | Mô tả (sách) |
|---|---|
| `Iterable<? extends JavaFileObject> getJavaFileObjectsFromStrings(Iterable<String> fileNames)`<br>`Iterable<? extends JavaFileObject> getJavaFileObjectsFromFiles(Iterable<? extends File> files)` | translates a sequence of file names or files into a sequence of `JavaFileObject` instances. |

### `javax.tools.JavaCompiler.CompilationTask` 6

| Method | Mô tả (sách) |
|---|---|
| `Boolean call()` | performs the compilation task. |

### `javax.tools.DiagnosticCollector<S>` 6

| Method | Mô tả (sách) |
|---|---|
| `DiagnosticCollector()` | constructs an empty collector. |
| `List<Diagnostic<? extends S>> getDiagnostics()` | gets the collected diagnostics. |

### `javax.tools.Diagnostic<S>` 6

| Method | Mô tả (sách) |
|---|---|
| `S getSource()` | gets the source object associated with this diagnostic. |
| `Diagnostic.Kind getKind()` | gets the type of this diagnostic—one of `ERROR`, `WARNING`, `MANDATORY_WARNING`, `NOTE`, or `OTHER`. |
| `String getMessage(Locale locale)` | gets the message describing the issue raised in this diagnostic. Pass `null` for the default locale. |
| `long getLineNumber()`<br>`long getColumnNumber()` | gets the position of the issue raised in this diagnostic. |

### `javax.tools.SimpleJavaFileObject` 6

| Method | Mô tả (sách) |
|---|---|
| `CharSequence getCharContent(boolean ignoreEncodingErrors)` | Override this method for a file object that represents a source file and produces the source code. |
| `OutputStream openOutputStream()` | Override this method for a file object that represents a class file and produces a stream to which the bytecodes can be written. |

### `javax.tools.ForwardingJavaFileManager<M extends JavaFileManager>` 6

| Method | Mô tả (sách) |
|---|---|
| `protected ForwardingJavaFileManager(M fileManager)` | constructs a `JavaFileManager` that delegates all calls to the given file manager. |
| `FileObject getFileForOutput(JavaFileManager.Location location, String className, JavaFileObject.Kind kind, FileObject sibling)` | Intercept this call if you want to substitute a file object for writing class files; `kind` is one of `SOURCE`, `CLASS`, `HTML`, or `OTHER`. |

---

## Bài kế tiếp

→ [[03 - Using Annotations]] — annotation là gì, annotation interface, meta-annotation, và ví dụ annotate event handler.
