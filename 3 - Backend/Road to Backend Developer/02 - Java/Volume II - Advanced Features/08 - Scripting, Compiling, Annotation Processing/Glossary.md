# Glossary — Scripting, Compiling, and Annotation Processing

> Thuật ngữ chương 8: Scripting, Compiling, and Annotation Processing. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Agent**
Một **library được load để theo dõi một chương trình** theo cách nào đó. Code của agent thực hiện khởi tạo trong method **`premain`**, được gọi khi agent được load. Cài bằng option `java -javaagent:AgentJARFile=agentArgument`, và manifest phải đặt attribute **`Premain-Class`**. Xem [[07 - Bytecode Engineering#8.7.2. Modifying Bytecodes at Load Time]].

**Annotation**
**Tag bạn chèn vào source code để một công cụ nào đó xử lý.** Annotation **không làm thay đổi cách chương trình được compile** — compiler sinh ra cùng những virtual machine instruction dù có hay không có annotation. Dùng **như một modifier**, đặt **trước item được annotate, không có dấu chấm phẩy**, tên có **`@`** đứng trước. Xem [[03 - Using Annotations#8.3. Using Annotations]].

**Annotation Interface**
Interface định nghĩa một annotation, khai báo bằng **`@interface`**. **Các method của interface tương ứng với các element của annotation.** Mọi annotation interface **ngầm extend `java.lang.annotation.Annotation`** và **không extend được annotation interface khác**. Method của nó **không có parameter, không có `throws`, không được là default/static, không có type parameter**. Xem [[04 - Annotation Syntax#8.4.1. Annotation Interfaces]].

**Annotation Processor**
Class **implement interface `Processor`**, thường bằng cách **extend `AbstractProcessor`**, được gọi bởi `javac -processor ...`. **Chỉ sinh được file source mới, không sửa được file source đã có.** Xem [[06 - Source-Level Annotation Processing#8.6.1. Annotation Processors]].

**ASM**
Library xử lý file class ở mức bytecode, tại http://asm.ow2.org. Xem [[07 - Bytecode Engineering#8.7. Bytecode Engineering]].

## B

**Binding**
Cặp gồm **một cái tên và một Java object gắn với tên đó**, thêm vào scripting engine bằng `engine.put(...)`. Script đọc định nghĩa từ bindings trong **engine scope**. Xem [[01 - Scripting for the Java Platform#8.1.2. Script Evaluation and Bindings]].

**Bytecode Engineering**
Cách thứ ba xử lý annotation (sau runtime và source level): **xử lý ở mức bytecode**. Trừ khi annotation bị gỡ ở mức source, **chúng có mặt trong file class**. Xem [[07 - Bytecode Engineering#8.7. Bytecode Engineering]].

## C

**CompilationTask**
Object cho phép **kiểm soát quá trình compile nhiều hơn** so với `compiler.run`: cấp source từ string, bắt file class trong memory, xử lý error/warning. **Extends `Callable<Boolean>`** — truyền cho `ExecutorService` hoặc gọi `task.call()` đồng bộ. Xem [[02 - The Compiler API#8.2.2. Launching a Compilation Task]].

**Container Annotation**
Annotation **giữ các annotation lặp lại trong một array**, phải được cung cấp khi implement một **repeatable annotation** (để tương thích ngược). Xem [[05 - Standard Annotations#8.5.3. Meta-Annotations]].

## D

**Declaration Annotation**
Một trong **hai loại vị trí** annotation xuất hiện được (loại kia là type use). Áp lên khai báo của **package, class, interface, method, constructor, instance field, local variable, parameter variable, type parameter**. Xem [[04 - Annotation Syntax#8.4.3. Annotating Declarations]].

**Diagnostic**
Object compiler gửi tới một **`DiagnosticListener`** mỗi khi báo warning hay error, chứa **tên file, số dòng, số cột** cùng mô tả người đọc được. Class **`DiagnosticCollector`** gom hết để duyệt sau khi compile xong. Xem [[02 - The Compiler API#8.2.3. Capturing Diagnostics]].

## E

**Element (của annotation)**
Thành phần của một annotation, ví dụ `@Test(timeout="10000")`. Kiểu hợp lệ: **primitive, `String`, `Class`, enum type, annotation type, array của các kiểu đó** (**array của array không hợp lệ**). Giá trị **phải là compile-time constant** và **không bao giờ được là `null`**. Xem [[04 - Annotation Syntax#8.4.1. Annotation Interfaces]].

**Engine Scope**
Phạm vi chứa bindings của một scripting engine. Đối lập với **global scope** — bindings thêm vào `ScriptEngineManager` **nhìn thấy được từ mọi engine**. Xem [[01 - Scripting for the Java Platform#8.1.2. Script Evaluation and Bindings]].

## L

**Language Model API**
API để **phân tích source-level annotation**. Khác reflection API (biểu diễn của virtual machine), language model API cho phép **phân tích chương trình Java theo luật của ngôn ngữ Java**. Node là instance của `javax.lang.model.element.Element` và subinterface: **`TypeElement`, `VariableElement`, `ExecutableElement`**. Xem [[06 - Source-Level Annotation Processing#8.6.2. The Language Model API]].

## M

**Marker Annotation**
Annotation **không chỉ định element nào** — vì nó không có element nào, hoặc mọi element đều dùng giá trị default — nên **không cần ngoặc đơn**, ví dụ `@BugReport`. Xem [[04 - Annotation Syntax#8.4.2. Annotations]].

**Meta-Annotation**
Annotation **annotate chính một annotation khác**. Bốn meta-annotation chuẩn: **`@Target`** (giới hạn item áp được lên), **`@Retention`** (annotation giữ lại bao lâu), **`@Documented`** (đưa vào tài liệu), **`@Inherited`** (subclass tự động thừa hưởng), cùng **`@Repeatable`**. Xem [[05 - Standard Annotations#8.5.3. Meta-Annotations]].

## N

**Nashorn**
**JavaScript interpreter do Oracle phát triển**, giới thiệu ở **Java 8**, đi kèm JDK. Implement interface **`Invocable`**. **Không có khái niệm standard input source** — gọi `setReader` không có tác dụng. Xem [[01 - Scripting for the Java Platform#8.1.1. Getting a Scripting Engine]].

## R

**Receiver Parameter**
Parameter đầu tiên khai báo tường minh bằng **biến thể cú pháp hiếm dùng**, chỉ để **thêm annotation cho `this`**. **Bắt buộc tên là `this`**, kiểu là class đang được dựng. **Chỉ cung cấp được cho method, không cho constructor.** Xem [[04 - Annotation Syntax#8.4.5. Annotating this]].

**Repeatable Annotation**
Từ **Java 8**, cùng một annotation type **áp được nhiều lần lên một item**, khai báo bằng **`@Repeatable(Container.class)`**. Cẩn thận: gọi **`getAnnotation`** lên một annotation thật sự bị lặp thì **nhận `null`** — phải gọi **`getAnnotationsByType`**. Xem [[05 - Standard Annotations#8.5.3. Meta-Annotations]].

**Retention Policy**
Giá trị của meta-annotation `@Retention`, **mặc định là `CLASS`**: **`SOURCE`** (không vào file class) · **`CLASS`** (vào file class nhưng VM không nhất thiết load) · **`RUNTIME`** (vào file class, VM load, truy cập được qua reflection API). Xem [[05 - Standard Annotations#8.5.3. Meta-Annotations]].

**Round**
Một vòng của quá trình annotation processing. Nếu một processor **tạo file source mới thì quá trình lặp lại**; khi một round **không sinh thêm file source nào**, mọi file source được compile. Xem bằng cờ **`-XprintRounds`**. Xem [[06 - Source-Level Annotation Processing#8.6.1. Annotation Processors]].

## S

**Script Engine Factory**
Object cho biết **tên engine, MIME type, và phần mở rộng file** mà một scripting engine hỗ trợ. Liệt kê bằng `ScriptEngineManager.getEngineFactories()`. Cũng dùng để hỏi tham số **`"THREADING"`** xem có an toàn chạy script đồng thời không. Xem [[01 - Scripting for the Java Platform#8.1.1. Getting a Scripting Engine]].

**Scripting Engine**
**Library có khả năng thực thi script bằng một ngôn ngữ cụ thể.** Virtual machine **phát hiện các scripting engine sẵn có khi khởi động**. Xem [[01 - Scripting for the Java Platform#8.1.1. Getting a Scripting Engine]].

**Scripting Language**
Ngôn ngữ **tránh chu trình edit/compile/link/run** bằng cách **thông dịch văn bản chương trình lúc runtime**. Lợi thế: **quay vòng nhanh**, **đổi hành vi chương trình đang chạy**, **cho người dùng tuỳ biến**. Nhược: **thiếu strong typing, encapsulation, modularity**. Xem [[01 - Scripting for the Java Platform#8.1. Scripting for the Java Platform]].

**Single-Value Annotation**
Lối viết tắt khi một element có **tên đặc biệt `value`** và **không element nào khác được chỉ định**: bỏ được **tên element và dấu `=`**, ví dụ `@ActionListenerFor("yellowButton")`. Xem [[04 - Annotation Syntax#8.4.2. Annotations]].

## T

**THREADING**
Tham số hỏi qua `factory.getParameter("THREADING")` để biết có an toàn chạy script đồng thời không. Giá trị: **`null`** (không an toàn) · **`"MULTITHREADED"`** · **`"THREAD-ISOLATED"`** · **`"STATELESS"`**. Xem [[01 - Scripting for the Java Platform#8.1.2. Script Evaluation and Bindings]].

**Type Use Annotation**
Loại annotation thứ hai (cùng với declaration annotation), đặt **trước type argument**, ví dụ `List<@NonNull String>`. Xuất hiện được ở generic type argument, mọi vị trí của array, superclass/interface, lời gọi constructor, cast và `instanceof`, exception specification, wildcard và type bound, method/constructor reference. **Không annotate được class literal và import.** Xem [[04 - Annotation Syntax#8.4.4. Annotating Type Uses]].

---

## Ba cách xử lý annotation

| Mức | Cơ chế | Ví dụ trong chương |
|---|---|---|
| **Runtime** | reflection API đọc annotation từ class đã load | `ActionListenerInstaller` — [[03 - Using Annotations]] |
| **Source level** | annotation processor chạy trong `javac`, **chỉ sinh được file mới** | `ToStringAnnotationProcessor` — [[06 - Source-Level Annotation Processing]] |
| **Bytecode level** | library kiểu ASM sửa file class, hoặc agent sửa lúc load | `EntryLogger` / `EntryLoggingAgent` — [[07 - Bytecode Engineering]] |
