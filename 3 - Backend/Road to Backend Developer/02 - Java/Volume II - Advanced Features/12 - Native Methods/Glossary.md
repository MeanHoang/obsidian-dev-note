# Glossary — Native Methods

> Thuật ngữ chương 12: Native Methods. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## D

**Direct Buffer**
Buffer được dùng trong package `java.nio` để **hỗ trợ thao tác input/output hiệu quả hơn** và **giảm tối đa việc copy dữ liệu giữa native array và Java array**. Ba function JNI liên quan: `NewDirectByteBuffer`, `GetDirectBufferAddress`, `GetDirectBufferCapacity`. Xem [[07 - Accessing Array Elements#12.7 Accessing Array Elements]].

**DestroyJavaVM**
Function của invocation API dùng để **kết thúc virtual machine**. **Phải gọi thông qua con trỏ virtual machine**: `(*jvm)->DestroyJavaVM(jvm)`. Xem [[09 - Using the Invocation API#API — Invocation API Functions]].

**Dynamically Loaded Library**
Dạng library mà native C code được compile ra, để virtual machine load lên bằng `System.loadLibrary`. Trên Linux là `.so`, trên Windows là `.dll`. Macro `JNIEXPORT` và `JNICALL` biểu thị các specifier **phụ thuộc compiler** dành cho function export ra từ library kiểu này. Xem [[01 - Calling a C Function from a Java Program#Compile thành shared library]].

## E

**env (JNIEnv\*)**
**Argument đầu tiên của mọi native method**, và là **parameter đầu tiên của mọi JNI function**. Nó là **con trỏ trỏ tới một bảng các function pointer**, nên trong C phải viết `(*env)->` trước mỗi lời gọi JNI để dereference. Trong C++, class `JNIEnv` có inline member function lo việc này, và **bỏ được con trỏ `JNIEnv` khỏi danh sách parameter**. Xem [[03 - String Parameters#Con trỏ `env`]].

**ExceptionCheck / ExceptionClear / ExceptionOccurred**
Bộ function kiểm tra và xử lý exception đang chờ trong native code. `ExceptionOccurred` trả về **object exception hoặc `NULL`**; `ExceptionCheck` chỉ trả về `true`/`false`; `ExceptionClear` **xoá mọi exception đang chờ** — phải gọi nếu native method quyết định tự xử lý exception. Xem [[08 - Handling Errors#Bắt exception trong native code]].

## F

**FindClass**
JNI function lấy class reference bằng cách **chỉ định tên class dưới dạng string**, dùng ký tự **`/` thay cho dấu chấm** làm dấu ngăn tên package: `FindClass(env, "java/lang/String")`. Dùng khi **không có sẵn object nào** của class đó (ví dụ khi truy cập static field/method). Xem [[04 - Accessing Fields#Lấy class reference]].

## G

**GetFieldID / GetStaticFieldID**
JNI function lấy `jfieldID` từ **tên field và signature của nó**. Bước tính field ID từ tên field là **bước tốn kém nhất**, nên JNI **tách nó thành bước riêng** để nếu get/set một field nhiều lần thì chỉ trả chi phí đúng một lần. Xem [[04 - Accessing Fields#Lấy `fieldID`]].

**GetMethodID / GetStaticMethodID**
JNI function lấy `jmethodID`, cần **class, tên method, và method signature**. Với constructor thì tên method là **`"<init>"`** và kiểu trả về là `void`. Xem [[06 - Calling Java Methods#12.6.1 Instance Methods]] và [[06 - Calling Java Methods#12.6.3 Constructors]].

**GetObjectClass**
JNI function trả về **class của bất kỳ object nào**. **Class reference chỉ hợp lệ cho tới khi native method return** — không cache được; phải gọi lại mỗi lần native method chạy, trừ khi khoá reference bằng `NewGlobalRef`. Xem [[04 - Accessing Fields#Lấy class reference]].

**GetStringUTFChars**
JNI function **đọc nội dung của một `jstring` đã có**, trả về con trỏ `const jbyte*` tới ký tự "modified UTF-8". Vì Java string là **immutable**, phải **coi trọng chữ `const`, không ghi vào mảng này**. Bắt buộc gọi `ReleaseStringUTFChars` khi dùng xong để VM garbage-collect được. Xem [[03 - String Parameters#Đọc nội dung một `jstring`]].

**GetXxxArrayElements**
JNI function trả về **con trỏ C tới phần tử đầu tiên của một array**, chỉ dùng với **kiểu primitive** (không phải `Object`). Vì con trỏ có thể trỏ tới một **bản copy**, mọi thay đổi **chỉ được đảm bảo phản ánh vào array gốc sau khi gọi `ReleaseXxxArrayElements`**. Xem [[07 - Accessing Array Elements#Lấy con trỏ C vào array]].

## I

**Invocation API**
API cho phép **nhúng Java virtual machine vào một chương trình C hoặc C++** — tình huống ngược với native method. Khởi tạo bằng `JNI_CreateJavaVM`, kết thúc bằng `DestroyJavaVM`. Sách nói **hiện chỉ có bốn function** trong API này. Xem [[09 - Using the Invocation API#12.9 Using the Invocation API]].

**IsAssignableFrom**
JNI function trả về `JNI_TRUE` khi **hai class giống nhau**, hoặc `cl1` là **subclass** của `cl2`, hoặc `cl2` là **interface được `cl1` (hay superclass của nó) implement**. Dùng để xác định kiểu thực của một `Object` trong native code. Xem [[10 - A Complete Example - Accessing the Windows Registry#API — Type Inquiry Functions]].

## J

**javac -h**
Lệnh sinh **header file** chứa khai báo C cho native method, kèm thư mục đích: `javac -h . HelloNative.java`. Sách nói **không ai đặt tên function bằng tay**, luôn dùng lệnh này. Xem [[01 - Calling a C Function from a Java Program#Sinh header file bằng `javac -h`]].

**javap -s**
Lệnh sinh **method signature từ file class**. Ví dụ `javap -s -private Employee` in ra signature của **mọi field và method**. Xem [[05 - Encoding Signatures#Sinh signature bằng `javap -s`]].

**jfieldID**
Kiểu đặc biệt **định danh một field trong một structure**. Lấy bằng `GetFieldID`/`GetStaticFieldID`. Xem [[04 - Accessing Fields#12.4.1 Accessing Instance Fields]].

**jni.h**
Header file khai báo các kiểu `jint`, `jlong`, ... bằng lệnh `typedef` thành kiểu tương đương **trên target platform**. Cũng định nghĩa hai hằng số **`JNI_FALSE = 0`** và **`JNI_TRUE = 1`**, cùng macro `JNIEXPORT` và `JNICALL`. Xem [[02 - Numeric Parameters and Return Values#12.2 Numeric Parameters and Return Values]].

**JNI_CreateJavaVM**
Function của invocation API **khởi tạo Java virtual machine**, điền vào con trỏ `jvm` (virtual machine) và con trỏ `env` (execution environment). Trả về `0` nếu thành công, **`JNI_ERR`** nếu thất bại. Trên Windows việc link động tới function này **đã trở nên khó khăn** do quy tắc linking đổi từ Vista. Xem [[09 - Using the Invocation API#12.9 Using the Invocation API]].

**JNI_OnLoad / JNI_OnUnload**
Method đặt code **khởi tạo** cho shared library (`JNI_OnLoad`) và code chạy khi **VM shut down** (`JNI_OnUnload`). `JNI_OnLoad` cần **trả về phiên bản VM tối thiểu mà nó yêu cầu**, ví dụ `JNI_VERSION_1_2`. Xem [[01 - Calling a C Function from a Java Program#API — `java.lang.System` 1.0]].

**jstring**
Kiểu **opaque** mà native method thực sự nhận vào khi parameter khai báo là `String`; native method trả về `String` thì phải trả về `jstring`. Trong C, `jstring`/`jclass`/array type đều **tương đương kiểu với `jobject`**; trong C++ chúng là con trỏ tới "dummy class" có **đúng hệ thống phân cấp inheritance**. Xem [[03 - String Parameters#Kiểu `jstring`]].

**jvalue**
`union` trong C gom mọi kiểu JNI (`jboolean z`, `jbyte b`, `jchar c`, `jshort s`, `jint i`, `jlong j`, `jfloat f`, `jdouble d`, `jobject l`). Dùng cho bản `CallXxxMethodA` — nhận argument trong **array `jvalue`**. Xem [[06 - Calling Java Methods#`jvalue` — union]].

## M

**Mangling**
Quy tắc **mã hoá tên kiểu dữ liệu và method signature** để JNI dùng. Sách nói **chẳng có lý lẽ nào** biện minh cho việc ép lập trình viên dùng sơ đồ này, nhưng nó "cho bạn nếm trải cái huyền bí của việc lập trình sát virtual machine". Xem [[05 - Encoding Signatures#12.5 Encoding Signatures]].

**"Modified UTF-8"**
Encoding chỉ **khác UTF-8 chuẩn ở ký tự "supplementary"** có mã lớn hơn `0xFFFF`: UTF-8 chuẩn mã hoá thành **4 byte**, còn bản "modified" mã hoá ký tự thành **cặp surrogate UTF-16 rồi mã hoá từng surrogate bằng UTF-8** — tổng cộng **6 byte**. Sách gọi đây là **tai nạn lịch sử**: JVM specification được viết khi Unicode còn giới hạn ở 16 bit. Xem [[03 - String Parameters#12.3 String Parameters]].

## N

**native**
Keyword của Java báo cho compiler biết method sẽ được **định nghĩa ở bên ngoài**. Native method **không chứa code Java nào**, header của method **được nối ngay bằng dấu chấm phẩy**, nên khai báo native method **trông giống khai báo abstract method**. Native method **vừa static vừa nonstatic đều được**. Xem [[01 - Calling a C Function from a Java Program#12.1 Calling a C Function from a Java Program]] và [[04 - Static Fields and Methods]].

**NewGlobalRef / DeleteGlobalRef**
Cặp function **khoá một class reference lại để dùng ở các lời gọi method sau**, khắc phục việc class reference bình thường **chỉ hợp lệ cho tới khi native method return**. Dùng xong phải gọi `DeleteGlobalRef`. Xem [[04 - Accessing Fields#12.4.1 Accessing Instance Fields]].

**NewObject**
JNI function **tạo object Java mới bằng cách gọi constructor của nó**. Method ID lấy từ `GetMethodID` với tên method **`"<init>"`** và **kiểu trả về `void`**. Xem [[06 - Calling Java Methods#12.6.3 Constructors]].

**NewStringUTF**
JNI function **dựng một `jstring` mới** từ mảng `char` chứa ký tự ASCII, hoặc tổng quát hơn là dãy byte mã hoá "modified UTF-8". Xem [[03 - String Parameters#Kiểu `jstring`]].

## R

**ReleaseXxxArrayElements**
JNI function báo VM biết con trỏ lấy từ `GetXxxArrayElements` **không còn cần nữa**. Tham số `mode`: **`0`** = giải phóng buffer sau khi cập nhật phần tử · **`JNI_COMMIT`** = không giải phóng buffer sau khi cập nhật · **`JNI_ABORT`** = giải phóng buffer **mà không** cập nhật phần tử. Xem [[07 - Accessing Array Elements#API — Manipulating Java Arrays]].

## S

**Signature**
Phần **mô tả parameter và kiểu trả về** của một method, mã hoá theo sơ đồ mangling: `B` `byte` · `C` `char` · `D` `double` · `F` `float` · `I` `int` · `J` `long` · `Lclassname;` class type · `S` `short` · `V` `void` · `Z` `boolean` · `[` array. Liệt kê **kiểu parameter trong ngoặc đơn rồi tới kiểu trả về**: `(II)I`. Dấu chấm phẩy cuối biểu thức `L` là **dấu kết thúc kiểu, không phải dấu ngăn parameter**; dùng **`/` thay cho `.`** để ngăn package và class. Constructor **vẫn phải thêm `V`** dù Java không ghi kiểu trả về cho constructor. Xem [[05 - Encoding Signatures#12.5 Encoding Signatures]].

**System.loadLibrary**
Method **load library có tên cho trước**, tìm trong **library search path**; cách định vị library **tuỳ hệ điều hành**. Nên gọi trong **static initialization block** để chắc chắn library được load **trước lần dùng class đầu tiên**. Xem [[01 - Calling a C Function from a Java Program#Load library bằng `System.loadLibrary`]].

## T

**Throw / ThrowNew**
Hai function tạo exception từ native code. `Throw` cần một object subtype của `Throwable` (tạo bằng `NewObject`); `ThrowNew` **tiện hơn**, dựng object exception từ **class và một dãy byte "modified UTF-8"**. Cả hai **chỉ đăng ký exception**, **không ngắt luồng điều khiển** — VM chỉ ném khi method return, nên **mọi lời gọi nên được nối ngay bằng `return`**. Xem [[08 - Handling Errors#`Throw` và `ThrowNew`]] và [[02 - Catching Exceptions]].

## U

**UnsatisfiedLinkError**
Error mà virtual machine báo khi **không tìm thấy** implementation của một native method. Xem [[01 - Calling a C Function from a Java Program#Quy tắc đặt tên C function]].

---

## Bảng ánh xạ kiểu Java ↔ C (Table 12.1)

| Java | C | Bytes |
|---|---|---|
| `boolean` | `jboolean` | 1 |
| `byte` | `jbyte` | 1 |
| `char` | `jchar` | 2 |
| `short` | `jshort` | 2 |
| `int` | `jint` | 4 |
| `long` | `jlong` | 8 |
| `float` | `jfloat` | 4 |
| `double` | `jdouble` | 8 |

Xem [[02 - Numeric Parameters and Return Values#Table 12.1 — Java Types and C Types]].

## Bảng ánh xạ array type (Table 12.2)

| Java | C | Java | C |
|---|---|---|---|
| `boolean[]` | `jbooleanArray` | `long[]` | `jlongArray` |
| `byte[]` | `jbyteArray` | `float[]` | `jfloatArray` |
| `char[]` | `jcharArray` | `double[]` | `jdoubleArray` |
| `int[]` | `jintArray` | `Object[]` | `jobjectArray` |
| `short[]` | `jshortArray` | | |

Xem [[07 - Accessing Array Elements#Table 12.2 — Correspondence between Java Array Types and C Types]].

## 5 bước liên kết native method

| # | Bước |
|---|---|
| 1 | Khai báo một native method trong một Java class |
| 2 | Chạy `javah` để lấy header file chứa khai báo C cho method |
| 3 | Implement native method bằng C |
| 4 | Đặt code vào một shared library |
| 5 | Load library đó trong chương trình Java |

Xem [[01 - Calling a C Function from a Java Program#5 bước liên kết native method vào chương trình Java]].
