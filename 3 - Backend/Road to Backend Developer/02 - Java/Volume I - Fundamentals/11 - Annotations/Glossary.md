# Glossary — Annotations

> Thuật ngữ chương 11: Annotations. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**@interface**
Cú pháp khai báo một annotation. **Mỗi annotation phải được khai báo bằng một annotation interface**, dùng cú pháp `@interface`. Khai báo này **tạo ra một Java interface thực sự**. Xem [[02 - Defining Annotations#11.2. Defining Annotations]].

**Agent**
**Một library được load để giám sát chương trình theo cách nào đó.** Dùng để cài bytecode transformer **trước khi method `main` được gọi**; code của agent khởi tạo trong method `premain`. Chạy bằng `java -javaagent:AgentJARFile=agentArgument`. Xem [[06 - Bytecode Engineering#11.6.2. Modifying Bytecodes at Load Time]].

**Annotation**
**Các tag bạn chèn vào source code để một công cụ nào đó xử lý chúng.** Công cụ có thể làm việc ở **mức source**, hoặc **xử lý file class** nơi compiler đã đặt annotation vào. **Annotation không làm thay đổi cách chương trình được compile** — Java compiler sinh ra đúng những virtual machine instruction như nhau, có hay không có annotation. Trong Java, annotation **được dùng như một modifier**, tên đứng sau ký hiệu `@`. Xem [[01 - Using Annotations#Mở đầu chương 11 — Annotations]].

**Annotation Element**
**Cặp key/value** của một annotation, ví dụ `@RepeatedTest(value=10, failureThreshold=3)`. Tên và kiểu của các element hợp lệ **do từng annotation định nghĩa**. Element phải là: giá trị **primitive**, một **`String`**, một **`Class` object**, một **instance của enum**, một **annotation**, hoặc **array của các thứ trên** (không phải array của array). Mọi giá trị element **phải là compile-time constant** và **không bao giờ được mang giá trị `null`**. Xem [[01 - Using Annotations#11.1.1. Annotation Elements]].

**Annotation Interface**
Interface khai báo bằng `@interface`; **các method của interface tương ứng với các element của annotation**. Method của annotation interface **không được có parameter, không có mệnh đề `throws`, và không được generic**. **Mọi annotation interface đều ngầm extend `java.lang.annotation.Annotation`.** Bạn **không extend được annotation interface** và **không bao giờ tự cung cấp class implement nó** — tool và virtual machine **sinh ra proxy class/object khi cần**. Xem [[02 - Defining Annotations#Mọi annotation interface đều extend `Annotation`]].

**Annotation Processor**
Thành phần **implement interface `Processor`**, thường bằng cách **extend class `AbstractProcessor`**, được compiler gọi trong lúc compile qua `javac -processor ...`. **Chỉ sinh được file nguồn mới, không sửa được file nguồn đã có.** Xem [[05 - Source-Level Annotation Processing#11.5.1. Annotation Processors]].

**AnnotatedConstruct**
**Thứ tương đương ở mức source với interface `AnnotatedElement`.** Cung cấp `getAnnotation` và `getAnnotationsByType` để lấy annotation ứng với một annotation class cho trước. Xem [[05 - Source-Level Annotation Processing#11.5.2. The Language Model API]].

**AnnotatedElement**
Interface mang **chìa khoá để xử lý annotation lúc runtime**: `getAnnotation`, `getDeclaredAnnotation`, `getAnnotationsByType`, `getAnnotations`, `isAnnotationPresent`... Các reflection class **`Class`, `Field`, `Parameter`, `Method`, `Constructor`, `Package`** đều implement nó. Xem [[04 - Processing Annotations at Runtime#11.4. Processing Annotations at Runtime]].

**ASM**
**Thư viện xử lý class file**, có tại `https://asm.ow2.org`. Cần `asm-9.6.jar` và `asm-commons-9.6.jar`. Định dạng class file **khá phức tạp**, sẽ rất vất vả nếu xử lý mà không có thư viện chuyên dụng như ASM. Xem [[06 - Bytecode Engineering#11.6. Bytecode Engineering]].

## B

**Bytecode Engineering**
**Khả năng thứ ba** để xử lý annotation, sau runtime và source level: **xử lý ở mức bytecode**. Trừ khi annotation bị loại bỏ ở mức source, chúng **có mặt trong các class file**. Ý tưởng: **annotation được dùng để thêm chỉ thị vào chương trình**, và **một tool sửa bytecode nhặt các chỉ thị đó lên rồi sửa instruction của virtual machine**. Xem [[06 - Bytecode Engineering#11.6. Bytecode Engineering]].

## C

**Container Annotation**
Annotation **giữ các annotation lặp lại trong một array**. **Vì lý do lịch sử**, người implement một repeatable annotation **phải cung cấp thêm container annotation**. Hễ người dùng đưa vào hai annotation trở lên, chúng **tự động được gói vào container**. Xem [[03 - Annotations in the Java API#`@Repeatable`]].

## D

**Declaration Annotation**
Nhóm annotation **cung cấp thông tin về chính item được khai báo**. Xuất hiện được ở khai báo của **class/interface, method, constructor, field, local variable, parameter, type parameter, package và module**. Theo thông lệ, declaration annotation **đặt trước** các modifier khác. Xem [[01 - Using Annotations#11.1.3. Annotating Declarations]].

**Default Value (element)**
Giá trị mặc định của một element, khai báo bằng **mệnh đề `default`** sau method định nghĩa element. **Default không được lưu cùng annotation mà được tính động** — đổi default rồi recompile annotation class thì **mọi element đã annotate dùng default mới**, kể cả trong class file compile từ trước. Xem [[02 - Defining Annotations#Giá trị default cho element]].

## E

**Element (language model)**
Interface `javax.lang.model.element.Element` cùng các subinterface **`TypeElement`, `VariableElement`, `ExecutableElement`**. Compiler sinh ra **một cây** mà các node là instance của những class implement chúng. Đây là **những thứ tương ứng ở mức compile-time** với `Class`, `Field`/`Parameter`, `Method`/`Constructor`. Xem [[05 - Source-Level Annotation Processing#11.5.2. The Language Model API]].

**ElementType**
Enum làm giá trị cho meta-annotation `@Target`, chỉ định **những item mà annotation áp được lên**: `ANNOTATION_TYPE`, `MODULE`, `PACKAGE`, `TYPE`, `METHOD`, `CONSTRUCTOR`, `FIELD`, `PARAMETER`, `RECORD_COMPONENT`, `LOCAL_VARIABLE`, `TYPE_PARAMETER`, `TYPE_USE`. Xem [[02 - Defining Annotations#Table 11.1: Element Types for the `@Target` Annotation]].

## I

**Instrumentation API**
API **có một hook để cài đặt bytecode transformer**. Transformer **phải được cài trước khi method `main` của chương trình được gọi**, thông qua một agent. Xem [[06 - Bytecode Engineering#11.6.2. Modifying Bytecodes at Load Time]].

## L

**Language Model API**
API dùng để **phân tích annotation ở mức source**. Khác reflection API — thứ trình bày **biểu diễn ở mức virtual machine** — language model API cho phép **phân tích một chương trình Java theo đúng quy tắc của ngôn ngữ Java**. Xem [[05 - Source-Level Annotation Processing#11.5.2. The Language Model API]].

## M

**Meta-Annotation**
Annotation **annotate cho chính annotation khác**, chỉ ra **nơi annotation đó xuất hiện được** và **nơi nó truy cập được**. Java API có **bốn meta-annotation**: `@Target`, `@Retention`, `@Documented`, `@Inherited` — cùng `@Repeatable`. Xem [[02 - Defining Annotations#Meta-annotation `@Target`]] và [[03 - Annotations in the Java API#11.3.2. Meta-Annotations]].

## P

**premain**
Method `public static void premain(String arg, Instrumentation instr)` của agent, **được gọi khi agent được load**. Agent nhận **một argument command-line duy nhất** qua `arg`; `instr` dùng để **cài các hook khác nhau**. Tên class chứa nó khai báo bằng attribute **`Premain-Class`** trong manifest. Xem [[06 - Bytecode Engineering#11.6.2. Modifying Bytecodes at Load Time]].

**process**
Method của annotation processor, **được gọi một lần cho mỗi round**, kèm **tập hợp mọi annotation tìm thấy ở round này** và một **`RoundEnvironment`**. Ở những round sau nó được gọi với **danh sách annotation rỗng** và **return ngay** để không tạo file nguồn hai lần. Xem [[05 - Source-Level Annotation Processing#11.5.1. Annotation Processors]].

**Project Lombok**
Tool phổ biến **tìm ra cách lách giới hạn "annotation processor không sửa được file nguồn"**. Bằng cách **sửa các cấu trúc dữ liệu nội bộ của compiler trong lúc annotation processing**, nó **sinh được getter và setter**. Sách lưu ý: **ít nhất tới hiện tại thì chạy được, nhưng đó không phải Java chuẩn**. Xem [[05 - Source-Level Annotation Processing#11.5.3. Using Annotations to Generate Source Code]].

## R

**Receiver Parameter**
**Parameter đầu tiên** trong một biến thể cú pháp **rất hiếm dùng**, tồn tại chỉ để có chỗ **annotate cho `this`**. Nó **bắt buộc phải tên là `this`**, và **kiểu của nó là class đang được dựng**. **Chỉ cung cấp được cho method, không cho constructor.** Với inner class, hidden parameter trỏ tới enclosing class object cũng làm tường minh được, đặt tên `EnclosingClass.this`. Xem [[01 - Using Annotations#11.1.5. Making Receivers Explicit]].

**Repeatable Annotation**
Annotation mà tác giả **khai báo là repeatable**, nhờ đó **lặp lại cùng một annotation nhiều lần** trên một item được. Khi xử lý lúc runtime **phải dùng `getAnnotationsByType`** chứ không phải `getAnnotation`, vì các annotation lặp lại **đã bị gói vào container annotation**. Xem [[01 - Using Annotations#11.1.2. Multiple and Repeated Annotations]] và [[04 - Processing Annotations at Runtime#11.4. Processing Annotations at Runtime]].

**Retention Policy**
Giá trị của meta-annotation `@Retention`, chỉ định **nơi annotation truy cập được**. Ba lựa chọn: **`SOURCE`** (dùng được cho source processor, **không vào file class**), **`CLASS`** (**vào file class nhưng virtual machine không load** — **mặc định**), **`RUNTIME`** (**dùng được lúc runtime, truy cập qua reflection API**). Xem [[02 - Defining Annotations#Meta-annotation `@Retention`]].

**Round**
Một **lượt xử lý** của compiler: mỗi annotation processor được chạy lần lượt; **nếu processor tạo ra file nguồn mới thì quá trình lặp lại**; khi **một round không sinh thêm file nguồn nào**, toàn bộ file nguồn được compile. Xem bằng flag **`-XprintRounds`**. Xem [[05 - Source-Level Annotation Processing#11.5.1. Annotation Processors]].

**RoundEnvironment**
Reference chứa **thông tin về round xử lý hiện tại**. Trả về **tập hợp mọi element được annotate bằng một annotation cụ thể** qua `getElementsAnnotatedWith` và `getElementsAnnotatedWithAny` (method thứ hai hữu ích với repeated annotation). Xem [[05 - Source-Level Annotation Processing#11.5.2. The Language Model API]].

## S

**@SupportedAnnotationTypes**
Annotation **chỉ rõ processor hỗ trợ những annotation nào**. Một processor có thể nhận **annotation type cụ thể**, **wildcard** như `"com.horstmann.*"` (mọi annotation trong package đó hoặc bất kỳ subpackage nào), hoặc **`"*"`** (mọi annotation). Xem [[05 - Source-Level Annotation Processing#11.5.1. Annotation Processors]].

## T

**Type Use Annotation**
Nhóm annotation đặt **lên chỗ sử dụng một type**, chẳng hạn `List<@NonNull String>` để diễn đạt rằng mọi string trong list đều non-null. Xuất hiện được với **generic type argument, mọi vị trí của array, superclass và interface được implement, constructor invocation, nested type, cast và `instanceof`, exception specification, wildcard type và type bound, method/constructor reference**. **Không annotate được class literal và câu lệnh `import`.** Theo thông lệ đặt **sau** các modifier khác. Xem [[01 - Using Annotations#11.1.4. Annotating Type Uses]].

**TypeElement**
Element **đại diện cho một class hoặc interface** ở mức source. Method **`getEnclosedElements`** trả về **danh sách các field và method của nó**; **`getQualifiedName`** trả về một object `Name` chuyển được sang string bằng `toString`. Xem [[05 - Source-Level Annotation Processing#11.5.2. The Language Model API]].

---

## Ba mức xử lý annotation

| Mức | Công cụ | Note |
|---|---|---|
| **Runtime** | reflection API (`AnnotatedElement`) | Cần `RetentionPolicy.RUNTIME`. Xem [[04 - Processing Annotations at Runtime]] |
| **Source level** | annotation processor + language model API | Chỉ **sinh file mới**, không sửa file cũ. Xem [[05 - Source-Level Annotation Processing]] |
| **Bytecode** | thư viện ASM, sửa class file hoặc sửa lúc load time bằng agent | Xem [[06 - Bytecode Engineering]] |
