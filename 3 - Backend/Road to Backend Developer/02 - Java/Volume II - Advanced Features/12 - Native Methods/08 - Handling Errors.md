# 08 — Handling Errors

> Chapter 12, Section 12.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.8 Handling Errors

> *"Native methods are a significant security risk to Java programs. The C runtime system has no protection against array bounds errors, indirection through bad pointers, and so on. It is particularly important that programmers of native methods handle all error conditions to preserve the integrity of the Java platform. In particular, when your native method diagnoses a problem it cannot handle, it should report this problem to the Java virtual machine."*

**Dịch:** Native method là **rủi ro bảo mật đáng kể** với chương trình Java. C runtime system **không có cơ chế bảo vệ** trước lỗi vượt biên array, dereference con trỏ hỏng, v.v. Đặc biệt quan trọng là lập trình viên native method **phải xử lý mọi tình huống lỗi để giữ toàn vẹn cho Java platform**. Cụ thể, khi native method phát hiện một vấn đề mà nó **không xử lý nổi**, nó **nên báo vấn đề đó cho Java virtual machine**.

> *"Normally, you would throw an exception in this situation. However, C has no exceptions. Instead, you must call the Throw or ThrowNew function to create a new exception object. When the native method exits, the Java virtual machine throws that exception."*

**Dịch:** Bình thường bạn sẽ ném một exception trong tình huống này. Nhưng **C không có exception**. Thay vào đó, bạn **phải gọi function `Throw` hoặc `ThrowNew`** để tạo một object exception mới. **Khi native method thoát ra, Java virtual machine sẽ ném exception đó.**

> Về exception trong Java: xem [[02 - Catching Exceptions]].

---

## `Throw` và `ThrowNew`

> *"To use the Throw function, call NewObject to create an object of a subtype of Throwable. For example, here we allocate an EOFException object and throw it:"*

```c
jclass class_EOFException = (*env)->FindClass(env, "java/io/EOFException");
jmethodID id_EOFException = (*env)->GetMethodID(env, class_EOFException, "<init>", "()V");
   /* ID of no-argument constructor */
jthrowable obj_exc = (*env)->NewObject(env, class_EOFException, id_EOFException);
(*env)->Throw(env, obj_exc);
```

**Dịch:** Để dùng `Throw`, gọi `NewObject` tạo **một object thuộc subtype của `Throwable`**.

> *"It is usually more convenient to call ThrowNew, which constructs an exception object, given a class and a "modified UTF-8" byte sequence."*

```c
(*env)->ThrowNew(env, (*env)->FindClass(env, "java/io/EOFException"),
   "Unexpected end of file");
```

**Dịch:** Thường **tiện hơn là gọi `ThrowNew`** — nó dựng object exception từ một **class** và một **dãy byte "modified UTF-8"**.

> *"Both Throw and ThrowNew merely post the exception; they do not interrupt the control flow of the native method. Only when the method returns does the Java virtual machine throw the exception. Therefore, every call to Throw and ThrowNew should be immediately followed by a return statement."*

**Dịch:** Cả `Throw` lẫn `ThrowNew` **chỉ đăng ký (post) exception**; chúng **không ngắt luồng điều khiển của native method**. **Chỉ khi method return thì JVM mới ném exception đó.** Vì vậy **mọi lời gọi `Throw` và `ThrowNew` đều nên được nối ngay bằng một câu lệnh `return`**.

> **C++ Note (sách):** *"If you implement native methods in C++, you cannot throw a Java exception object in your C++ code. In a C++ binding, it would be possible to implement a translation between exceptions in C++ and Java; however, this is not currently done. Use Throw or ThrowNew to throw a Java exception in a native C++ method, and make sure your native methods throw no C++ exceptions."*
>
> **Dịch:** Nếu implement native method bằng C++, bạn **không ném được object exception Java trong code C++**. Về lý thuyết một C++ binding có thể implement việc dịch qua lại giữa exception C++ và Java; **nhưng hiện tại chưa làm**. Hãy dùng `Throw` hoặc `ThrowNew` để ném Java exception trong native method C++, và **đảm bảo native method của bạn không ném exception C++ nào**.

---

## Bắt exception trong native code

> *"Normally, native code need not be concerned with catching Java exceptions. However, when a native method calls a Java method, that method might throw an exception. Moreover, a number of the JNI functions throw exceptions as well. For example, SetObjectArrayElement throws an ArrayIndexOutOfBoundsException if the index is out of bounds, and an ArrayStoreException if the class of the stored object is not a subclass of the element class of the array."*

**Dịch:** Bình thường native code **không phải bận tâm chuyện bắt Java exception**. Nhưng khi native method **gọi một Java method**, method đó **có thể ném exception**. Hơn nữa, **một số JNI function cũng ném exception**. Ví dụ `SetObjectArrayElement` ném `ArrayIndexOutOfBoundsException` nếu index vượt biên, và `ArrayStoreException` nếu class của object được lưu không phải subclass của class phần tử của array.

> *"In situations like these, a native method should call the ExceptionOccurred method to determine whether an exception has been thrown. The call"*

```c
jthrowable obj_exc = (*env)->ExceptionOccurred(env);
```

> *"returns NULL if no exception is pending, or a reference to the current exception object. If you just want to check whether an exception has been thrown, without obtaining a reference to the exception object, use"*

```c
jboolean occurred = (*env)->ExceptionCheck(env);
```

**Dịch:** Trong những tình huống như vậy, native method **nên gọi `ExceptionOccurred`** để xác định đã có exception nào bị ném chưa. Nó trả về **`NULL` nếu không có exception đang chờ**, hoặc **reference tới object exception hiện tại**. Nếu chỉ muốn **kiểm tra xem có exception hay không** mà không cần lấy reference, dùng **`ExceptionCheck`**.

> *"Normally, a native method should simply return when an exception has occurred so that the virtual machine can propagate it to the Java code. However, a native method may analyze the exception object to determine if it can handle the exception. If it can, then the function"*

```c
(*env)->ExceptionClear(env);
```

> *"must be called to turn off the exception."*

**Dịch:** Bình thường native method **chỉ nên return khi có exception xảy ra**, để VM lan truyền nó tới code Java. Nhưng native method **có thể phân tích object exception** để xác định xem nó có xử lý được hay không. Nếu xử lý được thì **phải gọi `ExceptionClear` để tắt exception đi**.

---

## Ví dụ: `fprint` với xử lý lỗi đầy đủ

> *"In our next example, we implement the fprint native method with all the paranoia appropriate for a native method. Here are the exceptions that we throw:"*

| Exception | Khi nào ném |
|---|---|
| `NullPointerException` | *"if the format string is NULL"* — nếu format string là `NULL` |
| `IllegalArgumentException` | *"if the format string doesn't contain a % specifier that is appropriate for printing a double"* — nếu format string **không chứa specifier `%` phù hợp để in một `double`** |
| `OutOfMemoryError` | *"if the call to malloc fails"* — nếu lời gọi `malloc` thất bại |

> *"Finally, to demonstrate how to check for an exception when calling a Java method from a native method, we send the string to the stream, a character at a time, and call ExceptionOccurred after each call."*

**Dịch:** Cuối cùng, để minh hoạ cách kiểm tra exception khi gọi Java method từ native method, ta **gửi string tới stream từng ký tự một**, và **gọi `ExceptionOccurred` sau mỗi lời gọi**.

> *"Notice that the native method does not immediately terminate when an exception occurs in the call to PrintWriter.print—it first frees the cstr buffer. When the native method returns, the virtual machine again raises the exception. The test program in Listing 12.19 demonstrates how the native method throws an exception when the formatting string is not valid."*

**Dịch:** Chú ý native method **không kết thúc ngay lập tức** khi exception xảy ra ở lời gọi `PrintWriter.print` — nó **giải phóng buffer `cstr` trước đã**. Khi native method return, **VM lại dựng exception lên**.

### Listing 12.17 — `printf4/Printf4.c`

```c
/**
   @version 1.10 1997-07-01
   @author Cay Horstmann
*/

#include "Printf4.h"
#include <string.h>
#include <stdlib.h>
#include <float.h>

/**
   @param format a string containing a printf format specifier
   (such as "%8.2f"). Substrings "%%" are skipped.
   @return a pointer to the format specifier (skipping the '%')
   or NULL if there wasn't a unique format specifier
*/
char* find_format(const char format[])
{
   char* p;
   char* q;

   p = strchr(format, '%');
   while (p != NULL && *(p + 1) == '%') /* skip %% */
      p = strchr(p + 2, '%');
   if (p == NULL) return NULL;
   /* now check that % is unique */
   p++;
   q = strchr(p, '%');
   while (q != NULL && *(q + 1) == '%') /* skip %% */
      q = strchr(q + 2, '%');
   if (q != NULL) return NULL; /* % not unique */
   q = p + strspn(p, " -0+#"); /* skip past flags */
   q += strspn(q, "0123456789"); /* skip past field width */
   if (*q == '.') { q++; q += strspn(q, "0123456789"); }
      /* skip past precision */
   if (strchr("eEfFgG", *q) == NULL) return NULL;
      /* not a floating-point format */
   return p;
}

JNIEXPORT void JNICALL Java_Printf4_fprint(JNIEnv* env, jclass cl,
      jobject out, jstring format, jdouble x)
{
   const char* cformat;
   char* fmt;
   jclass class_PrintWriter;
   jmethodID id_print;
   char* cstr;
   int width;
   int i;

   if (format == NULL)
   {
      (*env)->ThrowNew(env,
         (*env)->FindClass(env,
            "java/lang/NullPointerException"),
         "Printf4.fprint: format is null");
      return;
   }

   cformat = (*env)->GetStringUTFChars(env, format, NULL);
   fmt = find_format(cformat);

   if (fmt == NULL)
   {
      (*env)->ThrowNew(env,
         (*env)->FindClass(env,
            "java/lang/IllegalArgumentException"),
         "Printf4.fprint: format is invalid");
      return;
   }

   width = atoi(fmt);
   if (width == 0) width = DBL_DIG + 10;
   cstr = (char*)malloc(strlen(cformat) + width);

   if (cstr == NULL)
   {
      (*env)->ThrowNew(env,
         (*env)->FindClass(env, "java/lang/OutOfMemoryError"),
         "Printf4.fprint: malloc failed");
      return;
   }

   sprintf(cstr, cformat, x);

   (*env)->ReleaseStringUTFChars(env, format, cformat);

   /* now call ps.print(str) */

   /* get the class */
   class_PrintWriter = (*env)->GetObjectClass(env, out);

   /* get the method ID */
   id_print = (*env)->GetMethodID(env, class_PrintWriter, "print", "(C)V");

   /* call the method */
   for (i = 0; cstr[i] != 0 && !(*env)->ExceptionOccurred(env); i++)
      (*env)->CallVoidMethod(env, out, id_print, cstr[i]);

   free(cstr);
}
```

### Listing 12.18 — `printf4/Printf4.java`

```java
import java.io.*;

/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf4
{
    public static native void fprint(PrintWriter ps, String format, double x);

    static
    {
        System.loadLibrary("Printf4");
    }
}
```

### Listing 12.19 — `printf4/Printf4Test.java`

```java
import java.io.*;

/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
class Printf4Test
{
    public static void main(String[] args)
    {
        double price = 44.95;
        double tax = 7.75;
        double amountDue = price * (1 + tax / 100);
        var out = new PrintWriter(System.out);
        /* This call will throw an exception--note the %% */
        Printf4.fprint(out, "Amount due = %%8.2f\n", amountDue);
        out.flush();
    }
}
```

---

## API — Handling Java Exceptions

| API | Mô tả |
|---|---|
| `jint Throw(JNIEnv *env, jthrowable obj)` | *"prepares an exception to be thrown upon exiting from the native code. Returns 0 on success, a negative value on failure."* — Chuẩn bị một exception **để được ném khi thoát khỏi native code**. Trả về `0` nếu thành công, giá trị âm nếu thất bại. |
| `jint ThrowNew(JNIEnv *env, jclass cl, const char msg[])` | *"prepares an exception of type cl to be thrown upon exiting from the native code. Returns 0 on success, a negative value on failure. msg is a "modified UTF-8" byte sequence denoting the String construction argument of the exception object."* — Chuẩn bị exception kiểu `cl` để ném khi thoát native code. `msg` là dãy byte "modified UTF-8" đóng vai trò **argument `String` của constructor** object exception. |
| `jthrowable ExceptionOccurred(JNIEnv *env)` | *"returns the exception object if an exception is pending, or NULL otherwise."* — Trả về object exception nếu có exception đang chờ, ngược lại `NULL`. |
| `jboolean ExceptionCheck(JNIEnv *env)` | *"returns true if an exception is pending."* — Trả về `true` nếu có exception đang chờ. |
| `void ExceptionClear(JNIEnv *env)` | *"clears any pending exceptions."* — Xoá mọi exception đang chờ. |

---

## Bài kế tiếp

→ [[09 - Using the Invocation API]] — nhúng Java virtual machine vào một chương trình C/C++.
