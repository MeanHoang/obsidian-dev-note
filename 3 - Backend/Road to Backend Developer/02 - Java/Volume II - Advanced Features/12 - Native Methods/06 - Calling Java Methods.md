# 06 — Calling Java Methods

> Chapter 12, Section 12.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.6 Calling Java Methods

> *"Of course, Java programming language functions can call C functions—that is what native methods are for. Can we go the other way? Why would we want to do this anyway? It often happens that a native method needs to request a service from an object that was passed to it. We'll first show you how to do it for instance methods, then for static methods."*

**Dịch:** Đương nhiên function Java gọi được C function — native method sinh ra là để làm việc đó. Nhưng **ngược lại thì sao**? Tại sao lại muốn làm vậy? Thường xảy ra chuyện một native method cần **yêu cầu một dịch vụ từ object được truyền vào cho nó**. Trước hết ta xem cách làm với **instance method**, rồi tới **static method**.

---

## 12.6.1 Instance Methods

> *"As an example of calling a Java method from native code, let's enhance the Printf class and add a method that works similarly to the C function fprintf. That is, it should be able to print a string on an arbitrary PrintWriter object. Here is the definition of the method in Java:"*

```java
class Printf3
{
    public native static void fprint(PrintWriter out, String s, double x);
    . . .
}
```

**Dịch:** Làm ví dụ gọi một Java method từ native code, ta nâng cấp class `Printf` và thêm một method hoạt động **tương tự function `fprintf` của C** — tức nó **in được một string lên một object `PrintWriter` bất kỳ**.

> *"We'll first assemble the string to be printed into a String object str, as in the sprint method that we already implemented. Then, from the C function that implements the native method, we'll call the print method of the PrintWriter class."*

**Dịch:** Trước hết ta **ráp string cần in vào một object `String` tên `str`**, giống method `sprint` đã implement. Rồi từ C function implement native method, ta **gọi method `print` của class `PrintWriter`**.

> *"You can call any Java method from C by using the function call"*

```c
(*env)->CallXxxMethod(env, implicit parameter, methodID, explicit parameters)
```

> *"Replace Xxx with Void, Int, Object, and so on, depending on the return type of the method. Just as you need a fieldID to access a field of an object, you need a method ID to call a method. To obtain a method ID, call the JNI function GetMethodID and supply the class, the name of the method, and the method signature."*

**Dịch:** Thay `Xxx` bằng `Void`, `Int`, `Object`, v.v. **tuỳ kiểu trả về của method**. Giống như cần `fieldID` để truy cập field của object, bạn **cần một method ID để gọi method**. Để lấy method ID, gọi JNI function **`GetMethodID`** và cung cấp **class, tên method, và method signature**.

> *"In our example, we want to obtain the ID of the print method of the PrintWriter class. The PrintWriter class has several overloaded methods called print. For that reason, you must also supply a string describing the parameters and the return value of the specific function that you want to use. For example, we want to use void print(java.lang.String). As described in the preceding section, we must now "mangle" the signature into the string "(Ljava/lang/String;)V"."*

**Dịch:** Class `PrintWriter` có **nhiều method `print` bị overload**. Vì vậy bạn **còn phải cung cấp một string mô tả parameter và giá trị trả về** của đúng function bạn muốn dùng. Ở đây ta muốn dùng `void print(java.lang.String)`, nên phải mangle signature thành `"(Ljava/lang/String;)V"` — xem [[05 - Encoding Signatures]].

> *"Here is the complete code to make the method call:"*

```c
/* get the class of the implicit parameter */
class_PrintWriter = (*env)->GetObjectClass(env, out);
/* get the method ID */
id_print = (*env)->GetMethodID(env, class_PrintWriter, "print", "(Ljava/lang/String;)V");
/* call the method */
(*env)->CallVoidMethod(env, out, id_print, str);
```

> *"Listings 12.14 and 12.15 show the Java code for a test program and the Printf3 class. Listing 12.16 contains the C code for the native fprint method."*

> **Note (sách):** *"The numerical method IDs and field IDs are conceptually similar to Method and Field objects in the reflection API. You can convert between them with the following functions:"*
>
> ```c
> jobject ToReflectedMethod(JNIEnv* env, jclass class, jmethodID methodID);
>    // returns Method object
> methodID FromReflectedMethod(JNIEnv* env, jobject method);
> jobject ToReflectedField(JNIEnv* env, jclass class, jfieldID fieldID);
>    // returns Field object
> fieldID FromReflectedField(JNIEnv* env, jobject field);
> ```
>
> **Dịch:** Method ID và field ID dạng số **về mặt khái niệm tương tự object `Method` và `Field` trong reflection API** (xem [[10 - Reflection]]). Bạn **chuyển đổi qua lại giữa chúng** bằng các function trên.

---

## 12.6.2 Static Methods

> *"Calling static methods from native methods is similar to calling instance methods. There are two differences:"*

> *"• Use the GetStaticMethodID and CallStaticXxxMethod functions"*
>
> *"• Supply a class object, not an implicit parameter object, when invoking the method"*

**Dịch:** Gọi static method từ native method **tương tự** gọi instance method, với **hai khác biệt**:

| # | Khác biệt |
|---|---|
| 1 | Dùng function **`GetStaticMethodID`** và **`CallStaticXxxMethod`** |
| 2 | Cung cấp một **class object**, không phải object implicit parameter, khi gọi method |

> *"As an example of this, let's make the call to the static method"*
>
> ```java
> System.getProperty("java.class.path")
> ```
>
> *"from a native method. The return value of this call is a string that gives the current class path."*

**Dịch:** Giá trị trả về của lời gọi này là một string cho biết **class path hiện tại**.

> *"First, we have to find the class to use. As we have no object of the class System readily available, we use FindClass rather than GetObjectClass."*

```c
jclass class_System = (*env)->FindClass(env, "java/lang/System");
```

**Dịch:** Trước hết phải tìm class cần dùng. Vì **không sẵn có object nào của class `System`**, ta dùng `FindClass` chứ không phải `GetObjectClass`.

> *"Next, we need the ID of the static getProperty method. The encoded signature of that method is"*
>
> ```
> "(Ljava/lang/String;)Ljava/lang/String;"
> ```
>
> *"because both the parameter and the return value are strings. Hence, we obtain the method ID as follows:"*

```c
jmethodID id_getProperty = (*env)->GetStaticMethodID(env, class_System, "getProperty",
   "(Ljava/lang/String;)Ljava/lang/String;");
```

**Dịch:** Signature như trên vì **cả parameter lẫn giá trị trả về đều là string**.

> *"Finally, we can make the call. Note that the class object is passed to the CallStaticObjectMethod function."*

```c
jobject obj_ret = (*env)->CallStaticObjectMethod(env, class_System, id_getProperty,
   (*env)->NewStringUTF(env, "java.class.path"));
```

> *"The return value of this method is of type jobject. If we want to manipulate it as a string, we must cast it to jstring:"*

```c
jstring str_ret = (jstring) obj_ret;
```

**Dịch:** Giá trị trả về của method này **thuộc kiểu `jobject`**. Muốn thao tác nó như một string thì **phải cast sang `jstring`**.

> **C++ Note (sách):** *"In C, the types jstring and jclass, as well as the array types to be introduced later, are all type-equivalent to jobject. The cast of the preceding example is therefore not strictly necessary in C. But in C++, these types are defined as pointers to "dummy classes" that have the correct inheritance hierarchy. For example, assigning a jstring to a jobject is legal without a cast in C++, but an assignment from a jobject to a jstring requires a cast."*
>
> **Dịch:** Trong C, các kiểu `jstring` và `jclass`, cũng như các array type sẽ giới thiệu sau, **đều tương đương kiểu với `jobject`**. Nên trong C, phép cast ở ví dụ trên **không thực sự bắt buộc**. Nhưng trong C++, các kiểu này được định nghĩa là **con trỏ tới các "dummy class"** có **đúng hệ thống phân cấp inheritance**. Ví dụ gán một `jstring` cho một `jobject` là hợp lệ mà không cần cast trong C++, nhưng **gán từ `jobject` sang `jstring` thì cần cast**.

---

## 12.6.3 Constructors

> *"A native method can create a new Java object by invoking its constructor. Invoke the constructor by calling the NewObject function."*

```c
jobject obj_new = (*env)->NewObject(env, class, methodID, construction parameters);
```

**Dịch:** Một native method **tạo được object Java mới bằng cách gọi constructor của nó**. Gọi constructor bằng function **`NewObject`**.

> *"You can obtain the method ID needed for this call from the GetMethodID function by specifying the method name as "\<init>" and the encoded signature of the constructor (with return type void). For example, here is how a native method can create a FileOutputStream object:"*

```c
const char[] fileName = ". . .";
jstring str_fileName = (*env)->NewStringUTF(env, fileName);
jclass class_FileOutputStream = (*env)->FindClass(env, "java/io/FileOutputStream");
jmethodID id_FileOutputStream
   = (*env)->GetMethodID(env, class_FileOutputStream, "<init>", "(Ljava/lang/String;)V");
jobject obj_stream
   = (*env)->NewObject(env, class_FileOutputStream, id_FileOutputStream, str_fileName);
```

> *"Note that the signature of the constructor takes a parameter of type java.lang.String and has a return type of void."*

**Dịch:** Lấy method ID cần cho lời gọi này từ `GetMethodID`, với **tên method là `"<init>"`** và signature đã mã hoá của constructor (**kiểu trả về `void`**).

---

## 12.6.4 Alternative Method Invocations

> *"Several variants of the JNI functions can be used to call a Java method from native code. These are not as important as the functions that we already discussed, but they are occasionally useful."*

**Dịch:** Có **vài biến thể** của JNI function để gọi một Java method từ native code. Chúng **không quan trọng bằng** những function đã bàn, nhưng **thỉnh thoảng hữu ích**.

> *"The CallNonvirtualXxxMethod functions receive an implicit argument, a method ID, a class object (which must correspond to a superclass of the implicit argument), and explicit arguments. The function calls the version of the method in the specified class, bypassing the normal dynamic dispatch mechanism."*

**Dịch:** Các function **`CallNonvirtualXxxMethod`** nhận một implicit argument, một method ID, một class object (**phải tương ứng với superclass của implicit argument**), và các explicit argument. Function này **gọi bản method nằm trong class được chỉ định, bỏ qua cơ chế dynamic dispatch thông thường**.

> *"All call functions have versions with suffixes "A" and "V" that receive the explicit parameters in an array or a va_list (as defined in the C header stdarg.h)."*

**Dịch:** **Mọi call function đều có bản với hậu tố `A` và `V`**, nhận explicit parameter trong một **array** hoặc một **`va_list`** (định nghĩa trong header C `stdarg.h`).

---

### Listing 12.14 — `printf3/Printf3Test.java`

```java
import java.io.*;

/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
class Printf3Test
{
    public static void main(String[] args)
    {
        double price = 44.95;
        double tax = 7.75;
        double amountDue = price * (1 + tax / 100);
        var out = new PrintWriter(System.out);
        Printf3.fprint(out, "Amount due = %8.2f\n", amountDue);
        out.flush();
    }
}
```

### Listing 12.15 — `printf3/Printf3.java`

```java
import java.io.*;

/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf3
{
    public static native void fprint(PrintWriter out, String format, double x);

    static
    {
        System.loadLibrary("Printf3");
    }
}
```

### Listing 12.16 — `printf3/Printf3.c`

```c
/**
   @version 1.10 1997-07-01
   @author Cay Horstmann
*/

#include "Printf3.h"
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

JNIEXPORT void JNICALL Java_Printf3_fprint(JNIEnv* env, jclass cl,
      jobject out, jstring format, jdouble x)
{
   const char* cformat;
   char* fmt;
   jstring str;
   jclass class_PrintWriter;
   jmethodID id_print;

   cformat = (*env)->GetStringUTFChars(env, format, NULL);
   fmt = find_format(cformat);
   if (fmt == NULL)
      str = format;
   else
   {
      char* cstr;
      int width = atoi(fmt);
      if (width == 0) width = DBL_DIG + 10;
      cstr = (char*) malloc(strlen(cformat) + width);
      sprintf(cstr, cformat, x);
      str = (*env)->NewStringUTF(env, cstr);
      free(cstr);
   }
   (*env)->ReleaseStringUTFChars(env, format, cformat);

   /* now call ps.print(str) */

   /* get the class */
   class_PrintWriter = (*env)->GetObjectClass(env, out);

   /* get the method ID */
   id_print = (*env)->GetMethodID(env, class_PrintWriter, "print", "(Ljava/lang/String;)V");

   /* call the method */
   (*env)->CallVoidMethod(env, out, id_print, str);
}
```

---

## API — Executing Java Methods

| API | Mô tả |
|---|---|
| `jmethodID GetMethodID(JNIEnv *env, jclass cl, const char name[], const char methodSignature[])` | *"returns the identifier of a method in a class."* — Trả về identifier của một method trong class. |
| `Xxx CallXxxMethod(JNIEnv *env, jobject obj, jmethodID id, args)`<br>`Xxx CallXxxMethodA(JNIEnv *env, jobject obj, jmethodID id, jvalue args[])`<br>`Xxx CallXxxMethodV(JNIEnv *env, jobject obj, jmethodID id, va_list args)` | *"calls a method. The return type Xxx is one of Object, Boolean, Byte, Char, Short, Int, Long, Float, or Double. The first function has a variable number of arguments—simply append the method parameters after the method ID. The second function receives the method arguments in an array of jvalue... The third function receives the method parameters in a va_list, as defined in the C header stdarg.h."* — Gọi một method. Bản thứ nhất có **số argument thay đổi** (nối parameter sau method ID); bản thứ hai nhận argument trong **array `jvalue`**; bản thứ ba nhận trong **`va_list`**. |
| `Xxx CallNonvirtualXxxMethod(JNIEnv *env, jobject obj, jclass cl, jmethodID id, args)`<br>`Xxx CallNonvirtualXxxMethodA(...jvalue args[])`<br>`Xxx CallNonvirtualXxxMethodV(...va_list args)` | *"calls a method, bypassing dynamic dispatch."* — Gọi một method, **bỏ qua dynamic dispatch**. |
| `jmethodID GetStaticMethodID(JNIEnv *env, jclass cl, const char name[], const char methodSignature[])` | *"returns the identifier of a static method in a class."* — Trả về identifier của một static method trong class. |
| `Xxx CallStaticXxxMethod(JNIEnv *env, jclass cl, jmethodID id, args)`<br>`Xxx CallStaticXxxMethodA(...jvalue args[])`<br>`Xxx CallStaticXxxMethodV(...va_list args)` | *"calls a static method."* — Gọi một static method. |
| `jobject NewObject(JNIEnv *env, jclass cl, jmethodID id, args)`<br>`jobject NewObjectA(...jvalue args[])`<br>`jobject NewObjectV(...va_list args)` | *"calls a constructor. The method ID is obtained from GetMethodID with a method name of "\<init>" and a return type of void."* — Gọi một constructor. Method ID lấy từ `GetMethodID` với **tên method `"<init>"`** và **kiểu trả về `void`**. |

### `jvalue` — union

> *"The second function receives the method arguments in an array of jvalue, where jvalue is a union defined as"*

```c
typedef union jvalue
{
   jboolean z;
   jbyte b;
   jchar c;
   jshort s;
   jint i;
   jlong j;
   jfloat f;
   jdouble d;
   jobject l;
} jvalue;
```

---

## Bài kế tiếp

→ [[07 - Accessing Array Elements]] — bảng ánh xạ array type Java ↔ C, lấy con trỏ vào mảng, và các function `GetXxxArrayElements`.
