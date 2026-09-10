# 01 — Scripting for the Java Platform

> Chapter 8, Section 8.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.1. Scripting for the Java Platform

> *"A scripting language is a language that avoids the usual edit/compile/link/run cycle by interpreting the program text at runtime. Scripting languages have a number of advantages:"*
>
> - *"Rapid turnaround, encouraging experimentation"*
> - *"Changing the behavior of a running program"*
> - *"Enabling customization by program users"*

**Dịch:** **Scripting language** là ngôn ngữ **tránh được chu trình edit/compile/link/run thông thường** bằng cách **thông dịch (interpret) văn bản chương trình lúc runtime**. Scripting language có một số lợi thế:

- **Quay vòng nhanh**, khuyến khích thử nghiệm
- **Đổi hành vi của một chương trình đang chạy**
- **Cho phép người dùng chương trình tuỳ biến**

> *"On the other hand, most scripting languages lack features that are beneficial for programming complex applications, such as strong typing, encapsulation, and modularity."*

**Dịch:** Mặt khác, **phần lớn scripting language thiếu những tính năng có lợi cho việc lập trình ứng dụng phức tạp**, chẳng hạn **strong typing**, **encapsulation**, và **modularity**.

> *"It is therefore tempting to combine the advantages of scripting and traditional languages. The scripting API lets you do just that for the Java platform. It enables you to invoke scripts written in JavaScript, Groovy, Ruby, and even exotic languages such as Scheme and Haskell, from a Java program. For example, the Renjin project (www.renjin.org) provides a Java implementation of the R programming language, which is commonly used for statistical programming, together with an "engine" of the scripting API."*

**Dịch:** Vì vậy rất đáng để **kết hợp lợi thế của scripting và của ngôn ngữ truyền thống**. **Scripting API** cho phép bạn làm đúng điều đó trên Java platform. Nó cho phép bạn **gọi các script viết bằng JavaScript, Groovy, Ruby**, và cả những ngôn ngữ lạ như **Scheme và Haskell**, **từ một chương trình Java**. Ví dụ, dự án **Renjin** (www.renjin.org) cung cấp một implementation bằng Java của ngôn ngữ **R** — vốn hay dùng cho lập trình thống kê — kèm theo một **"engine"** của scripting API.

> *"In the following sections, we'll show you how to select an engine for a particular language, how to execute scripts, and how to make use of advanced features that some scripting engines offer."*

**Dịch:** Các mục sau sẽ chỉ cách **chọn engine cho một ngôn ngữ cụ thể**, cách **thực thi script**, và cách **dùng các tính năng nâng cao** mà một số scripting engine cung cấp.

---

## 8.1.1. Getting a Scripting Engine

> *"A scripting engine is a library that can execute scripts in a particular language. When the virtual machine starts, it discovers the available scripting engines. To enumerate them, construct a ScriptEngineManager and invoke the getEngineFactories method. You can ask each engine factory for the supported engine names, MIME types, and file extensions. Table 8.1 shows typical values."*

**Dịch:** **Scripting engine là một library có khả năng thực thi script bằng một ngôn ngữ cụ thể.** Khi virtual machine khởi động, nó **phát hiện (discover) các scripting engine sẵn có**. Muốn liệt kê chúng thì dựng một `ScriptEngineManager` và gọi method `getEngineFactories`. Bạn có thể hỏi mỗi engine factory về **tên engine, MIME type, và phần mở rộng file** mà nó hỗ trợ.

### Table 8.1 — Properties of Scripting Engine Factories

| Engine | Names | MIME types | Extensions |
|---|---|---|---|
| **Nashorn** (included with the JDK) | `nashorn`, `Nashorn`, `js`, `JS`, `JavaScript`, `javascript`, `ECMAScript`, `ecmascript` | `application/javascript`, `application/ecmascript`, `text/javascript`, `text/ecmascript` | `js` |
| **Groovy** | `groovy` | None | `groovy` |
| **Renjin** | `Renjin` | `text/x-R` | `R`, `r`, `S`, `s` |

> *"Usually, you know which engine you need, and you can simply request it by name, MIME type, or extension. For example:"*

```java
ScriptEngine engine = manager.getEngineByName("nashorn");
```

**Dịch:** Thường thì bạn **đã biết mình cần engine nào**, và chỉ việc **yêu cầu nó theo tên, MIME type, hoặc extension**.

> *"Java 8 introduced Nashorn, a JavaScript interpreter developed by Oracle. You can add more languages by providing the necessary JAR files on the class path."*

**Dịch:** **Java 8** giới thiệu **Nashorn**, một **JavaScript interpreter** do Oracle phát triển. Bạn **thêm được ngôn ngữ khác** bằng cách đưa **các file JAR cần thiết vào class path**.

### API: `javax.script.ScriptEngineManager` 6

| Method | Mô tả (sách) |
|---|---|
| `List<ScriptEngineFactory> getEngineFactories()` | gets a list of all discovered engine factories. |
| `ScriptEngine getEngineByName(String name)`<br>`ScriptEngine getEngineByExtension(String extension)`<br>`ScriptEngine getEngineByMimeType(String mimeType)` | gets the script engine with the given name, script file extension, or MIME type. |

### API: `javax.script.ScriptEngineFactory` 6

| Method | Mô tả (sách) |
|---|---|
| `List<String> getNames()`<br>`List<String> getExtensions()`<br>`List<String> getMimeTypes()` | gets the names, script file extensions, and MIME types under which this factory is known. |

---

## 8.1.2. Script Evaluation and Bindings

> *"Once you have an engine, you can call a script simply by invoking"*

```java
Object result = engine.eval(scriptString);
```

> *"If the script is stored in a file, open a Reader and call"*

```java
Object result = engine.eval(reader);
```

**Dịch:** Có engine rồi thì **gọi script chỉ bằng `eval`**. Nếu script nằm trong file thì mở một `Reader` rồi gọi `eval(reader)`.

> *"You can invoke multiple scripts on the same engine. If one script defines variables, functions, or classes, most scripting engines retain the definitions for later use. For example,"*

```java
engine.eval("n = 1728");
Object result = engine.eval("n + 1");
```

> *"will return 1729."*

**Dịch:** Bạn **gọi được nhiều script trên cùng một engine**. Nếu một script **định nghĩa variable, function, hay class** thì **phần lớn scripting engine giữ lại các định nghĩa đó để dùng về sau**. Ví dụ trên trả về **1729**.

> **Note (sách):** *"To find out whether it is safe to concurrently execute scripts in multiple threads, call"*
>
> ```java
> Object param = factory.getParameter("THREADING");
> ```
>
> *"The returned value is one of the following:"*
>
> - *"`null`: Concurrent execution is not safe."*
> - *"`"MULTITHREADED"`: Concurrent execution is safe. Effects from one thread might be visible from another thread."*
> - *"`"THREAD-ISOLATED"`: In addition to `"MULTITHREADED"`, different variable bindings are maintained for each thread."*
> - *"`"STATELESS"`: In addition to `"THREAD-ISOLATED"`, scripts do not alter variable bindings."*
>
> **Dịch:** Muốn biết **có an toàn khi thực thi script đồng thời trên nhiều thread hay không** thì gọi `factory.getParameter("THREADING")`. Giá trị trả về là một trong:
>
> | Giá trị | Ý nghĩa |
> |---|---|
> | `null` | Thực thi đồng thời **không an toàn** |
> | `"MULTITHREADED"` | Thực thi đồng thời **an toàn**. Tác động từ thread này **có thể nhìn thấy được** từ thread khác |
> | `"THREAD-ISOLATED"` | Ngoài `"MULTITHREADED"`, **mỗi thread giữ bindings riêng** |
> | `"STATELESS"` | Ngoài `"THREAD-ISOLATED"`, **script không làm thay đổi variable bindings** |

### Bindings

> *"You will often want to add variable bindings to the engine. A binding consists of a name and an associated Java object. For example, consider these statements:"*

```java
engine.put("k", 1728);
Object result = engine.eval("k + 1");
```

**Dịch:** Bạn sẽ thường muốn **thêm variable bindings vào engine**. Một **binding gồm một cái tên và một Java object gắn với tên đó**.

> *"The script code reads the definition of k from the bindings in the "engine scope." This is particularly important because most scripting languages can access Java objects, often with a syntax that is simpler than the Java syntax. For example,"*

```java
engine.put("b", new JButton());
engine.eval("b.text = 'Ok'");
```

**Dịch:** Code script **đọc định nghĩa của `k` từ bindings trong "engine scope"**. Điều này đặc biệt quan trọng vì **phần lớn scripting language truy cập được Java object**, thường bằng **cú pháp đơn giản hơn cú pháp Java**.

> *"Conversely, you can retrieve variables that were bound by scripting statements:"*

```java
engine.eval("n = 1728");
Object result = engine.get("n");
```

**Dịch:** Ngược lại, bạn **lấy lại được các variable đã được bind bởi câu lệnh script**.

### Global scope

> *"In addition to the engine scope, there is also a global scope. Any bindings that you add to the ScriptEngineManager are visible to all engines."*

**Dịch:** Ngoài **engine scope** còn có **global scope**. Mọi binding bạn thêm vào `ScriptEngineManager` đều **nhìn thấy được từ mọi engine**.

> *"Instead of adding bindings to the engine or global scope, you can collect them in an object of type Bindings and pass it to the eval method:"*

```java
Bindings scope = engine.createBindings();
scope.put("b", new JButton());
engine.eval(scriptString, scope);
```

> *"This is useful if a set of bindings should not persist for future calls to the eval method."*

**Dịch:** Thay vì thêm bindings vào engine scope hay global scope, bạn **gom chúng vào một object kiểu `Bindings`** rồi truyền vào method `eval`. Cách này hữu ích khi **không muốn một tập bindings tồn tại dai dẳng cho các lần gọi `eval` sau**.

> **Note (sách):** *"You might want to have scopes other than the engine and global scopes. For example, a web container might need request and session scopes. However, then you are on your own. You will need to write a class that implements the ScriptContext interface, managing a collection of scopes. Each scope is identified by an integer number, and scopes with lower numbers should be searched first. (The standard library provides a SimpleScriptContext class, but it only holds global and engine scopes.)"*
>
> **Dịch:** Có thể bạn muốn **scope khác** ngoài engine scope và global scope — ví dụ một web container cần **request scope và session scope**. Nhưng khi đó **bạn tự lo**: phải viết một class **implement interface `ScriptContext`**, quản lý một tập scope. **Mỗi scope được nhận diện bằng một số nguyên**, và **scope có số nhỏ hơn nên được tìm trước**. (Standard library có sẵn class `SimpleScriptContext`, nhưng **nó chỉ giữ global scope và engine scope**.)

### API: `javax.script.ScriptEngine` 6

| Method | Mô tả (sách) |
|---|---|
| `Object eval(String script)`<br>`Object eval(Reader reader)`<br>`Object eval(String script, Bindings bindings)`<br>`Object eval(Reader reader, Bindings bindings)` | evaluates the script given by the string or reader, subject to the given bindings. |
| `Object get(String key)`<br>`void put(String key, Object value)` | gets or puts a binding in the engine scope. |
| `Bindings createBindings()` | creates an empty `Bindings` object suitable for this engine. |

### API: `javax.script.ScriptEngineManager` 6

| Method | Mô tả (sách) |
|---|---|
| `Object get(String key)`<br>`void put(String key, Object value)` | gets or puts a binding in the global scope. |

### API: `javax.script.Bindings` 6

| Method | Mô tả (sách) |
|---|---|
| `Object get(String key)`<br>`void put(String key, Object value)` | gets or puts a binding into the scope represented by this `Bindings` object. |

---

## 8.1.3. Redirecting Input and Output

> *"You can redirect the standard input and output of a script by calling the setReader and setWriter methods of the script context. For example,"*

```java
var writer = new StringWriter();
engine.getContext().setWriter(new PrintWriter(writer, true));
```

> *"Any output written with the JavaScript print or println functions is sent to writer."*

**Dịch:** Bạn **chuyển hướng (redirect) standard input và output của một script** bằng cách gọi method `setReader` và `setWriter` của **script context**. Mọi output ghi bằng function `print` hoặc `println` của JavaScript sẽ được gửi tới `writer`.

> *"The setReader and setWriter methods only affect the scripting engine's standard input and output sources. For example, if you execute the JavaScript code"*

```javascript
println("Hello");
java.lang.System.out.println("World");
```

> *"only the first output is redirected."*

**Dịch:** `setReader` và `setWriter` **chỉ ảnh hưởng tới nguồn standard input/output của scripting engine**. Với đoạn code trên, **chỉ output đầu tiên bị redirect**.

> *"The Nashorn engine does not have the notion of a standard input source. Calling setReader has no effect."*

**Dịch:** Engine **Nashorn không có khái niệm standard input source**. Gọi `setReader` **không có tác dụng gì**.

### API: `javax.script.ScriptEngine` 6

| Method | Mô tả (sách) |
|---|---|
| `ScriptContext getContext()` | gets the default script context for this engine. |

### API: `javax.script.ScriptContext` 6

| Method | Mô tả (sách) |
|---|---|
| `Reader getReader()`<br>`void setReader(Reader reader)`<br>`Writer getWriter()`<br>`void setWriter(Writer writer)`<br>`Writer getErrorWriter()`<br>`void setErrorWriter(Writer writer)` | gets or sets the reader for input or writer for normal or error output. |

---

## 8.1.4. Calling Scripting Functions and Methods

> *"With many script engines, you can invoke a function in the scripting language without having to evaluate the actual script code. This is useful if you allow users to implement a service in a scripting language of their choice."*

**Dịch:** Với nhiều script engine, bạn **gọi được một function trong scripting language mà không cần evaluate chính đoạn code script**. Hữu ích khi bạn cho phép người dùng **implement một service bằng scripting language họ chọn**.

> *"The script engines that offer this functionality implement the Invocable interface. In particular, the Nashorn engine implements Invocable."*

**Dịch:** Các script engine có khả năng này **implement interface `Invocable`**. Cụ thể, **engine Nashorn implement `Invocable`**.

> *"To call a function, call the invokeFunction method with the function name, followed by the function parameters:"*

```java
// Define greet function in JavaScript
engine.eval("function greet(how, whom) { return how + ', ' + whom + '!' }");
// Call the function with arguments "Hello", "World"
result = ((Invocable) engine).invokeFunction("greet", "Hello", "World");
```

**Dịch:** Muốn gọi một function thì gọi method `invokeFunction` với **tên function, theo sau là các parameter của function**.

> *"If the scripting language is object-oriented, call invokeMethod:"*

```java
// Define Greeter class in JavaScript
engine.eval("function Greeter(how) { this.how = how }");
engine.eval("Greeter.prototype.welcome = "
    + " function(whom) { return this.how + ', ' + whom + '!' }");
// Construct an instance
Object yo = engine.eval("new Greeter('Yo')");
// Call the welcome method on the instance
result = ((Invocable) engine).invokeMethod(yo, "welcome", "World");
```

**Dịch:** Nếu scripting language là **object-oriented** thì gọi **`invokeMethod`**.

> **Note (sách):** *"For more information on how to define classes in JavaScript, see JavaScript—The Good Parts by Douglas Crockford (O'Reilly, 2008)."*

> **Note (sách):** *"If the script engine does not implement the Invocable interface, you might still be able to call a method in a language-independent way. The getMethodCallSyntax method of the ScriptEngineFactory interface produces a string that you can pass to the eval method. For this, however, all method parameters must be bound to names, whereas invokeMethod can be called with arbitrary values."*
>
> **Dịch:** Nếu script engine **không implement `Invocable`**, bạn vẫn có thể gọi được method theo cách **độc lập ngôn ngữ**: method `getMethodCallSyntax` của interface `ScriptEngineFactory` **sinh ra một string** để bạn truyền vào method `eval`. Tuy nhiên, cách này đòi hỏi **mọi method parameter phải được bind vào tên**, trong khi **`invokeMethod` gọi được với giá trị tuỳ ý**.

### Cho scripting engine implement một Java interface

> *"You can go a step further and ask the scripting engine to implement a Java interface. Then you can call scripting functions and methods with the Java method call syntax."*

**Dịch:** Bạn **đi xa thêm một bước** được: **yêu cầu scripting engine implement một Java interface**. Khi đó bạn **gọi function và method của script bằng cú pháp gọi method của Java**.

> *"The details depend on the scripting engine, but typically you need to supply a function for each method of the interface. For example, consider a Java interface"*

```java
public interface Greeter
{
    String welcome(String whom);
}
```

> *"If you define a global function with the same name in Nashorn, you can call it through this interface:"*

```java
// Define welcome function in JavaScript
engine.eval("function welcome(whom) { return 'Hello, ' + whom + '!' }");
// Get a Java object and call a Java method
Greeter g = ((Invocable) engine).getInterface(Greeter.class);
result = g.welcome("World");
```

**Dịch:** Chi tiết tuỳ scripting engine, nhưng thường bạn phải **cung cấp một function cho mỗi method của interface**. Nếu bạn định nghĩa một **global function cùng tên** trong Nashorn thì gọi được nó **qua interface đó**. (Xem lại [[01 - Interfaces]] ở Volume I.)

> *"In an object-oriented scripting language, you can access a script class through a matching Java interface. For example, here is how to call an object of the JavaScript Greeter class with Java syntax:"*

```java
Greeter g = ((Invocable) engine).getInterface(yo, Greeter.class);
result = g.welcome("World");
```

**Dịch:** Trong một scripting language object-oriented, bạn **truy cập được một class của script qua một Java interface khớp với nó**.

> *"In summary, the Invocable interface is useful if you want to call scripting code from Java without worrying about the scripting language syntax."*

**Dịch:** Tóm lại, interface **`Invocable` hữu ích khi bạn muốn gọi code script từ Java mà không phải bận tâm tới cú pháp của scripting language**.

### API: `javax.script.Invocable` 6

| Method | Mô tả (sách) |
|---|---|
| `Object invokeFunction(String name, Object... parameters)`<br>`Object invokeMethod(Object implicitParameter, String name, Object... explicitParameters)` | invokes the function or method with the given name, passing the given parameters. |
| `<T> T getInterface(Class<T> iface)` | returns an implementation of the given interface, implementing the methods with functions in the scripting engine. |
| `<T> T getInterface(Object implicitParameter, Class<T> iface)` | returns an implementation of the given interface, implementing the methods with the methods of the given object. |

---

## 8.1.5. Compiling a Script

> *"Some scripting engines can compile scripting code into an intermediate form for efficient execution. Those engines implement the Compilable interface. The following example shows how to compile and evaluate code contained in a script file:"*

```java
var reader = new FileReader("myscript.js");
CompiledScript script = null;
if (engine implements Compilable)
    script = ((Compilable) engine).compile(reader);
```

**Dịch:** Một số scripting engine **compile được code script sang dạng trung gian (intermediate form)** để **thực thi hiệu quả hơn**. Những engine đó **implement interface `Compilable`**.

> *"Once the script is compiled, you can execute it. The following code executes the compiled script if compilation was successful, or the original script if the engine didn't support compilation:"*

```java
if (script != null)
    script.eval();
else
    engine.eval(reader);
```

> *"Of course, it only makes sense to compile a script if you need to execute it repeatedly."*

**Dịch:** Script compile xong thì thực thi được. Đoạn code trên **chạy script đã compile nếu compile thành công**, hoặc **chạy script gốc nếu engine không hỗ trợ compile**. Dĩ nhiên, **chỉ đáng compile một script nếu bạn cần thực thi nó lặp đi lặp lại**.

### API: `javax.script.Compilable` 6

| Method | Mô tả (sách) |
|---|---|
| `CompiledScript compile(String script)`<br>`CompiledScript compile(Reader reader)` | compiles the script given by a string or reader. |

### API: `javax.script.CompiledScript` 6

| Method | Mô tả (sách) |
|---|---|
| `Object eval()`<br>`Object eval(Bindings bindings)` | evaluates this script. |

---

## 8.1.6. An Example: Scripting GUI Events

> *"To illustrate the scripting API, we will write a sample program that allows users to specify event handlers in a scripting language of their choice."*

> *"Have a look at the program in Listing 8.1 that adds scripting to an arbitrary frame class. By default it reads the ButtonFrame class in Listing 8.2, which is similar to the event handling demo in Volume I, with two differences:"*
>
> - *"Each component has its name property set."*
> - *"There are no event handlers."*

**Dịch:** Để minh hoạ scripting API, sách viết một chương trình mẫu cho phép người dùng **chỉ định event handler bằng scripting language họ chọn**. Listing 8.1 **thêm scripting vào một class frame bất kỳ**. Mặc định nó đọc class `ButtonFrame` ở Listing 8.2, tương tự demo event handling ở Volume I, khác hai điểm: **mỗi component đều được set property `name`**, và **không có event handler nào**.

> *"The event handlers are defined in a property file. Each property definition has the form"*

```
componentName.eventName = scriptCode
```

> *"For example, if you choose to use JavaScript, supply the event handlers in a file js.properties, like this:"*

```properties
yellowButton.action=panel.background = java.awt.Color.YELLOW
blueButton.action=panel.background = java.awt.Color.BLUE
redButton.action=panel.background = java.awt.Color.RED
```

> *"The companion code also has files for Groovy and R."*

**Dịch:** Event handler được định nghĩa trong một **property file**, mỗi định nghĩa có dạng `componentName.eventName = scriptCode`. Code kèm sách cũng có file cho **Groovy và R**.

> *"The program starts by loading an engine for the language specified on the command line. If no language is specified, we use JavaScript."*

> *"We then process a script init.language if it is present. This is useful for the R and Scheme languages, which need some initializations that we did not want to include in every event handler script."*

**Dịch:** Chương trình bắt đầu bằng việc **load engine cho ngôn ngữ chỉ định trên command line**; **không chỉ định thì dùng JavaScript**. Sau đó xử lý script `init.language` nếu có — hữu ích cho R và Scheme, những ngôn ngữ cần một số khởi tạo mà ta không muốn nhét vào **mọi** script event handler.

> *"Next, we recursively traverse all child components and add the bindings (name, object) into a map of components. Then we add the bindings to the engine."*

**Dịch:** Kế tiếp, **duyệt đệ quy mọi child component** và thêm binding **(name, object)** vào một map các component, rồi **thêm bindings vào engine**.

> *"Next, we read the file language.properties. For each property, we synthesize an event handler proxy that causes the script code to be executed. The details are a bit technical. You might want to read the section on proxies in Volume I, Chapter 6, if you want to follow the implementation in detail. The essential part, however, is that each event handler calls"*

```java
engine.eval(scriptCode);
```

**Dịch:** Rồi đọc file `language.properties`. Với mỗi property, **tổng hợp (synthesize) một event handler proxy** khiến code script được thực thi. Chi tiết hơi kỹ thuật — nên đọc phần **proxies** ở Volume I, Chapter 6. Điều cốt lõi là **mỗi event handler đều gọi `engine.eval(scriptCode)`**.

> *"Let us look at the yellowButton in more detail. When the line"*
>
> ```
> yellowButton.action=panel.background = java.awt.Color.YELLOW
> ```
>
> *"is processed, we find the JButton component with the name "yellowButton". We then attach an ActionListener with an actionPerformed method that executes the script"*
>
> ```
> panel.background = java.awt.Color.YELLOW
> ```
>
> *"if the scripting is done with Nashorn."*

**Dịch:** Khi dòng property của `yellowButton` được xử lý, ta **tìm component `JButton` có name là `"yellowButton"`**, rồi **gắn một `ActionListener`** mà method `actionPerformed` của nó **thực thi đoạn script** kia (nếu scripting làm bằng Nashorn).

> *"The engine contains a binding that binds the name "panel" to the JPanel object. When the event occurs, the setBackground method of the panel is executed, and the color changes."*

**Dịch:** Engine chứa một binding **gắn tên `"panel"` với object `JPanel`**. Khi event xảy ra, **method `setBackground` của panel được thực thi**, và màu thay đổi.

> *"You can run this program with the JavaScript event handlers simply by executing"*

```
java ScriptTest
```

> *"For the Groovy handlers, use"*

```
java -classpath .:groovy/lib/\* ScriptTest groovy
```

> *"Here, groovy is the directory into which you installed Groovy."*

> *"For the Renjin implementation of R, include the JAR files for Renjin Studio and the Renjin script engine on the classpath. Both are available at www.renjin.org/downloads.html."*

**Dịch:** Chạy chương trình với event handler JavaScript thì chỉ cần `java ScriptTest`. Với handler Groovy thì dùng lệnh trên, trong đó `groovy` là thư mục bạn cài Groovy. Với implementation Renjin của R thì đưa **file JAR của Renjin Studio và Renjin script engine** vào classpath.

> *"This application demonstrates how to use scripting for Java GUI programming. One could go a step further and describe the GUI with an XML file, as you have seen in Chapter 3. Then our program would become an interpreter for GUIs that have their visual presentation defined in XML and behavior defined in a scripting language. Note the similarity to a dynamic HTML page or a dynamic server-side scripting environment."*

**Dịch:** Ứng dụng này minh hoạ cách **dùng scripting cho lập trình GUI Java**. Có thể đi thêm một bước: **mô tả GUI bằng file XML** (Chapter 3). Khi đó chương trình trở thành một **interpreter cho GUI có phần trình bày định nghĩa bằng XML và hành vi định nghĩa bằng scripting language**. Lưu ý sự tương đồng với **trang HTML động** hoặc **môi trường scripting phía server**.

### Listing 8.1 — `script/ScriptTest.java`

```java
package script;

import java.awt.*;
import java.beans.*;
import java.io.*;
import java.lang.reflect.*;
import java.util.*;
import javax.script.*;
import javax.swing.*;

/**
 * @version 1.03 2018-05-01
 * @author Cay Horstmann
 */
public class ScriptTest
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            try
            {
                var manager = new ScriptEngineManager();
                String language;
                if (args.length == 0)
                {
                    System.out.println("Available factories: ");
                    for (ScriptEngineFactory factory : manager.getEngineFactories())
                        System.out.println(factory.getEngineName());

                    language = "nashorn";
                }
                else language = args[0];

                final ScriptEngine engine = manager.getEngineByName(language);
                if (engine == null)
                {
                    System.err.println("No engine for " + language);
                    System.exit(1);
                }

                final String frameClassName
                    = args.length < 2 ? "buttons1.ButtonFrame" : args[1];

                var frame
                    = (JFrame) Class.forName(frameClassName).getConstructor().newInstance();
                InputStream in = frame.getClass().getResourceAsStream("init." + language);
                if (in != null) engine.eval(new InputStreamReader(in));
                var components = new HashMap<String, Component>();
                getComponentBindings(frame, components);
                components.forEach((name, c) -> engine.put(name, c));

                var events = new Properties();
                in = frame.getClass().getResourceAsStream(language + ".properties");
                events.load(in);

                for (Object e : events.keySet())
                {
                    String[] s = ((String) e).split("\\.");
                    addListener(s[0], s[1], (String) events.get(e), engine, components);
                }
                frame.setTitle("ScriptTest");
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setVisible(true);
            }
            catch (ReflectiveOperationException | IOException
                    | ScriptException | IntrospectionException ex)
            {
                ex.printStackTrace();
            }
        });
    }

    /**
     * Gathers all named components in a container.
     * @param c the component
     * @param namedComponents a map into which to enter the component names and components
     */
    private static void getComponentBindings(Component c,
            Map<String, Component> namedComponents)
    {
        String name = c.getName();
        if (name != null) { namedComponents.put(name, c); }
        if (c instanceof Container)
        {
            for (Component child : ((Container) c).getComponents())
                getComponentBindings(child, namedComponents);
        }
    }

    /**
     * Adds a listener to an object whose listener method executes a script.
     * @param beanName the name of the bean to which the listener should be added
     * @param eventName the name of the listener type, such as "action" or "change"
     * @param scriptCode the script code to be executed
     * @param engine the engine that executes the code
     * @param bindings the bindings for the execution
     * @throws IntrospectionException
     */
    private static void addListener(String beanName, String eventName, final String scriptCode,
            ScriptEngine engine, Map<String, Component> components)
            throws ReflectiveOperationException, IntrospectionException
    {
        Object bean = components.get(beanName);
        EventSetDescriptor descriptor = getEventSetDescriptor(bean, eventName);
        if (descriptor == null) return;
        descriptor.getAddListenerMethod().invoke(bean,
            Proxy.newProxyInstance(null, new Class[] { descriptor.getListenerType() },
                (proxy, method, args) ->
                {
                    engine.eval(scriptCode);
                    return null;
                }));
    }

    private static EventSetDescriptor getEventSetDescriptor(Object bean, String eventName)
            throws IntrospectionException
    {
        for (EventSetDescriptor descriptor : Introspector.getBeanInfo(bean.getClass())
                .getEventSetDescriptors())
            if (descriptor.getName().equals(eventName)) return descriptor;
        return null;
    }
}
```

### Listing 8.2 — `buttons1/ButtonFrame.java`

```java
package buttons1;

import javax.swing.*;

/**
 * A frame with a button panel.
 * @version 1.00 2007-11-02
 * @author Cay Horstmann
 */
public class ButtonFrame extends JFrame
{
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 200;

    private JPanel panel;
    private JButton yellowButton;
    private JButton blueButton;
    private JButton redButton;

    public ButtonFrame()
    {
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        panel = new JPanel();
        panel.setName("panel");
        add(panel);

        yellowButton = new JButton("Yellow");
        yellowButton.setName("yellowButton");
        blueButton = new JButton("Blue");
        blueButton.setName("blueButton");
        redButton = new JButton("Red");
        redButton.setName("redButton");

        panel.add(yellowButton);
        panel.add(blueButton);
        panel.add(redButton);
    }
}
```

---

## Bài kế tiếp

→ [[02 - The Compiler API]] — gọi compiler từ chương trình Java, `CompilationTask`, bắt diagnostics, đọc source từ memory và ghi bytecode vào memory.
