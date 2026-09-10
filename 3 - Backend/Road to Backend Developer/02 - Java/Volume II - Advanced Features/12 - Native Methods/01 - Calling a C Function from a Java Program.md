# 01 — Calling a C Function from a Java Program

> Chapter 12, Section 12.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.1 Calling a C Function from a Java Program

> *"Suppose you have a C function that does something you like and, for one reason or another, you don't want to bother reimplementing it in Java. For the sake of illustration, we'll start with a simple C function that prints a greeting."*

**Dịch:** Giả sử bạn có một C function làm được việc bạn thích, và vì lý do nào đó bạn **không muốn mất công viết lại nó bằng Java**. Để minh hoạ, ta bắt đầu bằng một C function đơn giản in ra lời chào.

> *"The Java programming language uses the keyword native for a native method, and you will obviously need to place a method in a class."*

**Dịch:** Java dùng keyword **`native`** cho một native method, và tất nhiên bạn phải đặt method đó vào trong một class.

> *"The native keyword alerts the compiler that the method will be defined externally. Of course, native methods will contain no Java code, and the method header is followed immediately by a terminating semicolon. Therefore, native method declarations look similar to abstract method declarations."*

**Dịch:** Keyword `native` **báo cho compiler biết method sẽ được định nghĩa ở bên ngoài**. Đương nhiên native method **không chứa code Java nào**, và phần header của method được nối ngay bằng dấu chấm phẩy kết thúc. Vì vậy khai báo native method **trông giống khai báo abstract method**.

> Xem thêm về native method ở Volume I: [[04 - Static Fields and Methods]].

### Listing 12.1 — `helloNative/HelloNative.java`

```java
/**
 * @version 1.11 2007-10-26
 * @author Cay Horstmann
 */
class HelloNative
{
    public static native void greeting();
}
```

> **Note (sách):** *"As in the previous chapter, we do not use packages here to keep examples simple."*
>
> **Dịch:** Cũng như chương trước, ở đây **không dùng package** để giữ ví dụ đơn giản.

> *"In this particular example, the native method is also declared as static. Native methods can be both static and nonstatic. We'll start with a static method because we do not yet want to deal with parameter passing."*

**Dịch:** Trong ví dụ này, native method còn được khai báo là `static`. Native method **có thể vừa static vừa nonstatic**. Ta bắt đầu bằng static method vì chưa muốn dính tới chuyện truyền parameter.

---

## Quy tắc đặt tên C function

> *"You can actually compile this class, but if you try to use it in a program, the virtual machine will tell you it doesn't know how to find greeting—reporting an UnsatisfiedLinkError. To implement the native code, write a corresponding C function. You must name that function exactly the way the Java virtual machine expects. Here are the rules:"*

**Dịch:** Bạn compile class này được, nhưng nếu đem dùng trong chương trình, virtual machine sẽ báo **không tìm thấy `greeting`** — ném ra **`UnsatisfiedLinkError`**. Để implement native code, viết một C function tương ứng. Bạn **phải đặt tên function đúng y như virtual machine mong đợi**. Đây là các quy tắc:

> *"1. Use the full Java method name, such as HelloNative.greeting. If the class is in a package, prepend the package name, such as com.horstmann.HelloNative.greeting."*
>
> *"2. Replace every period with an underscore, and append the prefix Java_. For example, Java_HelloNative_greeting or Java_com_horstmann_HelloNative_greeting."*
>
> *"3. If the class name contains characters that are not ASCII letters or digits—that is, '_', '$', or Unicode characters with codes greater than \u007F—replace them with _0xxxx, where xxxx is the sequence of four hexadecimal digits of the character's Unicode value."*

| # | Quy tắc |
|---|---|
| 1 | Dùng **tên Java method đầy đủ**, ví dụ `HelloNative.greeting`. Nếu class nằm trong package thì thêm tên package vào trước: `com.horstmann.HelloNative.greeting` |
| 2 | **Thay mọi dấu chấm bằng underscore**, và thêm **prefix `Java_`** → `Java_HelloNative_greeting` hoặc `Java_com_horstmann_HelloNative_greeting` |
| 3 | Nếu tên class chứa ký tự **không phải chữ/số ASCII** — tức `_`, `$`, hoặc ký tự Unicode có mã lớn hơn `\u007F` — thì thay bằng `_0xxxx`, với `xxxx` là **bốn chữ số hexadecimal** của giá trị Unicode của ký tự đó |

> **Note (sách):** *"If you overload native methods—that is, if you provide multiple native methods with the same name—you must append a double underscore followed by the encoded argument types. (We'll describe the encoding of the argument types later in this chapter.) For example, if you have a native method greeting and another native method greeting(int repeat), then the first one is called Java_HelloNative_greeting__ and the second, Java_HelloNative_greeting__I."*
>
> **Dịch:** Nếu bạn **overload native method** — tức có nhiều native method trùng tên — bạn phải nối thêm **hai underscore** rồi tới **kiểu argument đã được mã hoá**. (Cách mã hoá kiểu argument được nói tới ở phần sau của chương — xem [[05 - Encoding Signatures]].) Ví dụ nếu có native method `greeting` và một native method `greeting(int repeat)`, thì cái đầu tên là `Java_HelloNative_greeting__` và cái sau là `Java_HelloNative_greeting__I`.

---

## Sinh header file bằng `javac -h`

> *"Actually, nobody does this by hand; instead, run javac with the -h flag, providing the directory in which the header files should be placed:"*

```
javac -h . HelloNative.java
```

> *"This command creates a header file HelloNative.h in the current directory, as shown in Listing 12.2."*

**Dịch:** Thực tế **không ai làm tay chuyện này**; thay vào đó chạy `javac` với flag `-h`, kèm thư mục sẽ chứa các header file. Lệnh trên tạo ra header file `HelloNative.h` trong thư mục hiện tại.

### Listing 12.2 — `helloNative/HelloNative.h`

```c
/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
/* Header for class HelloNative */

#ifndef _Included_HelloNative
#define _Included_HelloNative
#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     HelloNative
 * Method:    greeting
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_HelloNative_greeting
  (JNIEnv *, jclass);

#ifdef __cplusplus
}
#endif
#endif
```

> *"As you can see, this file contains the declaration of a function Java_HelloNative_greeting. (The macros JNIEXPORT and JNICALL are defined in the header file jni.h. They denote compiler-dependent specifiers for exported functions that come from a dynamically loaded library.)"*

**Dịch:** File này chứa khai báo của function `Java_HelloNative_greeting`. Hai macro **`JNIEXPORT`** và **`JNICALL`** được định nghĩa trong header file **`jni.h`**. Chúng biểu thị các specifier **phụ thuộc compiler** dành cho function được export ra từ một **dynamically loaded library**.

> *"Now, simply copy the function prototype from the header file into a source file and give the implementation code for the function, as shown in Listing 12.3."*
>
> *"In this simple function, ignore the env and cl arguments. You'll see their use later."*

**Dịch:** Giờ chỉ việc **copy function prototype từ header file sang một source file** rồi viết code implementation. Trong function đơn giản này, **bỏ qua hai argument `env` và `cl`** — cách dùng chúng sẽ thấy sau.

### Listing 12.3 — `helloNative/HelloNative.c`

```c
/*
   @version 1.10 1997-07-01
   @author Cay Horstmann
*/

#include "HelloNative.h"
#include <stdio.h>

JNIEXPORT void JNICALL Java_HelloNative_greeting(JNIEnv* env, jclass cl)
{
   printf("Hello Native World!\n");
}
```

> **C++ Note (sách):** *"You can use C++ to implement native methods. However, you must then declare the functions that implement the native methods as extern "C". (This stops the C++ compiler from "mangling" the method name.) For example,"*
>
> ```cpp
> extern "C"
> JNIEXPORT void JNICALL Java_HelloNative_greeting(JNIEnv* env, jclass cl)
> {
>    cout << "Hello, Native World!" << endl;
> }
> ```
>
> **Dịch:** Bạn dùng C++ để implement native method được. Nhưng khi đó phải khai báo các function implement native method là **`extern "C"`** — điều này **ngăn C++ compiler "mangling" tên method**.

---

## Compile thành shared library

> *"Compile the native C code into a dynamically loaded library. The details depend on your compiler."*

**Dịch:** Compile native C code thành một **dynamically loaded library**. Chi tiết tuỳ vào compiler của bạn.

> *"For example, with the GNU C compiler on Linux, use these commands:"*

```
gcc -fPIC -I jdk/include -I jdk/include/linux -shared -o libHelloNative.so HelloNative.c
```

> *"With the Microsoft compiler under Windows, the command is"*

```
cl -I jdk\include -I jdk\include\win32 -LD HelloNative.c -FeHelloNative.dll
```

> *"Here, jdk is the directory that contains the JDK."*

**Dịch:** Ở đây `jdk` là thư mục chứa JDK.

> **Tip (sách):** *"If you use the Microsoft compiler from a command shell, first run a batch file such as vsvars32.bat or vcvarsall.bat. That batch file sets up the path and the environment variables needed by the compiler. You can find it in the directory c:\Program Files\Microsoft Visual Studio 14.0\Common7\Tools or a similar monstrosity. Check the Visual Studio documentation for details."*
>
> **Dịch:** Nếu dùng Microsoft compiler từ command shell, hãy **chạy trước một batch file** kiểu `vsvars32.bat` hoặc `vcvarsall.bat`. Batch file đó **thiết lập path và biến môi trường** compiler cần.

> *"You can also use the freely available Cygwin programming environment from www.cygwin.com. It contains the GNU C compiler and libraries for UNIX-style programming on Windows. With Cygwin, use the command"*

```
gcc -mno-cygwin -D __int64="long long" -I jdk/include/ -I jdk/include/win32 \
  -shared -Wl,--add-stdcall-alias -o HelloNative.dll HelloNative.c
```

**Dịch:** Bạn cũng dùng được môi trường lập trình **Cygwin** miễn phí tại `www.cygwin.com`. Nó chứa GNU C compiler và library để lập trình kiểu UNIX trên Windows.

> **Note (sách):** *"The Windows version of the header file jni_md.h contains the type declaration"*
>
> ```c
> typedef __int64 jlong;
> ```
>
> *"which is specific to the Microsoft compiler. If you use the GNU compiler, you might want to edit that file, for example,"*
>
> ```c
> #ifdef __GNUC__
>    typedef long long jlong;
> #else
>    typedef __int64 jlong;
> #endif
> ```
>
> *"Alternatively, compile with -D __int64="long long", as shown in the sample compiler invocation."*
>
> **Dịch:** Bản Windows của header file `jni_md.h` chứa khai báo kiểu **đặc thù cho Microsoft compiler**. Nếu dùng GNU compiler, bạn có thể muốn **sửa file đó**, hoặc thay vào đó compile với `-D __int64="long long"`.

---

## Load library bằng `System.loadLibrary`

> *"Finally, add a call to the System.loadLibrary method in your program. To ensure that the virtual machine will load the library before the first use of the class, use a static initialization block, as in Listing 12.4."*

**Dịch:** Cuối cùng, thêm lời gọi tới method **`System.loadLibrary`** trong chương trình. Để chắc chắn virtual machine **load library trước lần dùng class đầu tiên**, hãy dùng một **static initialization block**.

### Listing 12.4 — `helloNative/HelloNativeTest.java`

```java
/**
 * @version 1.11 2007-10-26
 * @author Cay Horstmann
 */
class HelloNativeTest
{
    public static void main(String[] args)
    {
        HelloNative.greeting();
    }

    static
    {
        System.loadLibrary("HelloNative");
    }
}
```

> *"Figure 12.1 gives a summary of the native code processing."*
>
> *"After you compile and run this program, the message "Hello, Native World!" is displayed in a terminal window."*

**Dịch:** Figure 12.1 tóm tắt quá trình xử lý native code. Sau khi compile và chạy chương trình, dòng chữ "Hello, Native World!" hiện ra trong cửa sổ terminal.

> **Note (sách):** *"If you run Linux, you must add the current directory to the library path. Either set the LD_LIBRARY_PATH environment variable:"*
>
> ```
> export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
> ```
>
> *"or set the java.library.path system property:"*
>
> ```
> java -Djava.library.path=. HelloNativeTest
> ```
>
> **Dịch:** Nếu chạy Linux, bạn **phải thêm thư mục hiện tại vào library path** — set biến môi trường `LD_LIBRARY_PATH` hoặc set system property `java.library.path`.

> *"Of course, this is not particularly impressive by itself. Keep in mind, however, that this message is generated by the C printf command and not by any Java code. We have taken the first step toward bridging the gap between the two languages!"*

**Dịch:** Bản thân chuyện này chẳng có gì ghê gớm. Nhưng nhớ rằng thông điệp đó được sinh ra bởi **lệnh `printf` của C**, chứ không phải bởi code Java nào. Ta đã đi bước đầu tiên trong việc **bắc cầu giữa hai ngôn ngữ**!

---

## 5 bước liên kết native method vào chương trình Java

> *"In summary, follow these steps to link a native method to a Java program:"*

| # | Bước |
|---|---|
| 1 | *"Declare a native method in a Java class."* — Khai báo một native method trong một Java class |
| 2 | *"Run javah to get a header file with a C declaration for the method."* — Chạy `javah` để lấy header file chứa khai báo C cho method |
| 3 | *"Implement the native method in C."* — Implement native method bằng C |
| 4 | *"Place the code in a shared library."* — Đặt code vào một shared library |
| 5 | *"Load that library in your Java program."* — Load library đó trong chương trình Java |

---

## API — `java.lang.System` 1.0

| API | Mô tả |
|---|---|
| `void loadLibrary(String libname)` | *"loads the library with the given name. The library is located in the library search path. The exact method for locating the library depends on the operating system."* — Load library có tên cho trước. Library nằm trong **library search path**. Cách định vị library chính xác **tuỳ hệ điều hành**. |

> **Note (sách):** *"Some shared libraries for native code must execute certain initializations. You can place any initialization code into a JNI_OnLoad method. Similarly, when the virtual machine (VM) shuts down, it will call the JNI_OnUnload method if you provide it. The prototypes are"*
>
> ```c
> jint JNI_OnLoad(JavaVM* vm, void* reserved);
> void JNI_OnUnload(JavaVM* vm, void* reserved);
> ```
>
> *"The JNI_OnLoad method needs to return the minimum version of the VM it requires, such as JNI_VERSION_1_2."*
>
> **Dịch:** Một số shared library cho native code **phải thực hiện vài bước khởi tạo**. Bạn đặt code khởi tạo vào method **`JNI_OnLoad`**. Tương tự, khi VM tắt, nó sẽ gọi method **`JNI_OnUnload`** nếu bạn cung cấp. `JNI_OnLoad` cần **trả về phiên bản VM tối thiểu mà nó yêu cầu**, ví dụ `JNI_VERSION_1_2`.

---

## Bài kế tiếp

→ [[02 - Numeric Parameters and Return Values]] — bảng ánh xạ kiểu Java ↔ kiểu C (`jint`, `jdouble`...) và ví dụ gọi `printf` từ native method.
