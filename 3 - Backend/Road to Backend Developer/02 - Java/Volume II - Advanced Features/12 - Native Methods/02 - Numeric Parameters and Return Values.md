# 02 — Numeric Parameters and Return Values

> Chapter 12, Section 12.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.2 Numeric Parameters and Return Values

> *"When passing numbers between C and Java, you should understand which types correspond to each other. For example, although C does have data types called int and long, their implementation is platform-dependent. On some platforms, an int is a 16-bit quantity, on others it is a 32-bit quantity. On the Java platform, of course, an int is always a 32-bit integer. For that reason, JNI defines types jint, jlong, and so on."*

**Dịch:** Khi truyền số qua lại giữa C và Java, bạn cần hiểu **kiểu nào tương ứng với kiểu nào**. Ví dụ, C có kiểu tên là `int` và `long`, nhưng implementation của chúng **phụ thuộc platform**. Trên một số platform `int` là đại lượng **16-bit**, trên platform khác lại là **32-bit**. Còn trên Java platform, `int` **luôn là số nguyên 32-bit**. Vì vậy **JNI định nghĩa các kiểu `jint`, `jlong`, v.v.**

> Kiểu primitive của Java: xem [[02 - Data Types]].

> *"Table 12.1 shows the correspondence between Java types and C types."*

### Table 12.1 — Java Types and C Types

| Java Programming Language | C Programming Language | Bytes |
|---|---|---|
| `boolean` | `jboolean` | 1 |
| `byte` | `jbyte` | 1 |
| `char` | `jchar` | 2 |
| `short` | `jshort` | 2 |
| `int` | `jint` | 4 |
| `long` | `jlong` | 8 |
| `float` | `jfloat` | 4 |
| `double` | `jdouble` | 8 |

> *"In the header file jni.h, these types are declared with typedef statements as the equivalent types on the target platform. That header file also defines the constants JNI_FALSE = 0 and JNI_TRUE = 1."*

**Dịch:** Trong header file **`jni.h`**, các kiểu này được khai báo bằng lệnh `typedef` thành kiểu tương đương trên target platform. Header file đó cũng định nghĩa hai hằng số **`JNI_FALSE = 0`** và **`JNI_TRUE = 1`**.

---

## Ví dụ: gọi `printf` của C

> *"Until Java 5, Java had no direct analog of the C printf function. In the following examples, we will suppose you are stuck with an ancient JDK release and decide to implement the same functionality by calling the C printf function in a native method."*

**Dịch:** Tới tận Java 5, Java **chưa có thứ tương đương trực tiếp với function `printf` của C**. Trong các ví dụ sau, giả sử bạn đang kẹt với một bản JDK cổ lỗ và quyết định implement chức năng đó bằng cách **gọi function `printf` của C trong một native method**.

> *"Listing 12.5 shows a class called Printf1 that uses a native method to print a floating-point number with a given field width and precision."*
>
> *"Notice that when the method is implemented in C, all int and double parameters are changed to jint and jdouble, as shown in Listing 12.6."*

**Dịch:** `Printf1` dùng một native method để in một số floating-point với **field width và precision** cho trước. Chú ý rằng khi method được implement bằng C, **mọi parameter `int` và `double` đều đổi thành `jint` và `jdouble`**.

### Listing 12.5 — `printf1/Printf1.java`

```java
/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf1
{
    public static native int print(int width, int precision, double x);

    static
    {
        System.loadLibrary("Printf1");
    }
}
```

### Listing 12.6 — `printf1/Printf1.c`

```c
/**
   @version 1.10 1997-07-01
   @author Cay Horstmann
*/

#include "Printf1.h"
#include <stdio.h>

JNIEXPORT jint JNICALL Java_Printf1_print(JNIEnv* env, jclass cl,
      jint width, jint precision, jdouble x)
{
   char fmt[30];
   jint ret;
   sprintf(fmt, "%%%d.%df", width, precision);
   ret = printf(fmt, x);
   fflush(stdout);
   return ret;
}
```

> *"The function simply assembles a format string "%w.pf" in the variable fmt, then calls printf. It returns the number of characters printed."*

**Dịch:** Function này chỉ đơn giản **ráp một format string `"%w.pf"`** vào biến `fmt`, rồi gọi `printf`. Nó **trả về số ký tự đã in**.

> *"Listing 12.7 shows the test program that demonstrates the Printf1 class."*

### Listing 12.7 — `printf1/Printf1Test.java`

```java
/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf1Test
{
    public static void main(String[] args)
    {
        int count = Printf1.print(8, 4, 3.14);
        count += Printf1.print(8, 4, count);
        System.out.println();
        for (int i = 0; i < count; i++)
            System.out.print("-");
        System.out.println();
    }
}
```

---

## Bài kế tiếp

→ [[03 - String Parameters]] — chuyển String qua lại giữa Java và C, "modified UTF-8", con trỏ `env` và bộ hàm JNI thao tác chuỗi.
