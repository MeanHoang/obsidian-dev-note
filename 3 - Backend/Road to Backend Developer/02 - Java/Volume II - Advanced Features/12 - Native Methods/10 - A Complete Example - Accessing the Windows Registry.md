# 10 — A Complete Example: Accessing the Windows Registry

> Chapter 12, Section 12.10 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.10 A Complete Example: Accessing the Windows Registry

> *"In this section, we describe a full, working example that covers everything we discussed in this chapter: using native methods with strings, arrays, objects, constructor calls, and error handling. We'll show you how to put a Java platform wrapper around a subset of the ordinary C-based APIs used to work with the Windows registry. Of course, the Windows registry being a Windows-specific feature, such a program is inherently nonportable. For that reason, the standard Java library has no support for the registry, and it makes sense to use native methods to gain access to it."*

**Dịch:** Mục này mô tả **một ví dụ đầy đủ, chạy được**, bao trùm mọi thứ đã bàn trong chương: dùng native method với **string, array, object, lời gọi constructor và xử lý lỗi**. Ta sẽ **bọc một Java platform wrapper quanh một tập con các API C thông thường** dùng để làm việc với Windows registry. Đương nhiên registry của Windows là **tính năng đặc thù Windows**, nên chương trình như vậy **vốn dĩ không portable**. Vì lý do đó, **thư viện Java chuẩn không hỗ trợ registry**, và việc dùng native method để truy cập nó là hợp lý.

---

## 12.10.1 Overview of the Windows Registry

> *"The Windows registry is a data depository that holds configuration information for the Windows operating system and application programs. It provides a single point for administration and backup of system and application preferences. On the downside, the registry is also a single point of failure—if you mess up the registry, your computer could malfunction or even fail to boot!"*

**Dịch:** Windows registry là **kho dữ liệu chứa thông tin cấu hình** cho hệ điều hành Windows và các chương trình ứng dụng. Nó cung cấp **một điểm duy nhất để quản trị và backup** preference của hệ thống và ứng dụng. Mặt trái: registry cũng là **một điểm hỏng duy nhất (single point of failure)** — nếu bạn làm hỏng registry, máy tính có thể trục trặc hoặc **thậm chí không boot được**!

> *"We don't suggest that you use the registry to store configuration parameters for your Java programs. The Java preferences API is a better solution (see Volume I, Chapter 10 for more information). We'll simply use the registry to demonstrate how to wrap a nontrivial native API into a Java class."*

**Dịch:** Sách **không khuyên** bạn dùng registry để lưu tham số cấu hình cho chương trình Java. **Java preferences API là giải pháp tốt hơn.** Ở đây registry chỉ được dùng để minh hoạ cách **bọc một native API không tầm thường vào một Java class**.

> *"The principal tool for inspecting the registry is the registry editor. Because of the potential for error by naive but enthusiastic users, there is no icon for launching the registry editor. Instead, start a DOS shell (or open the Start → Run dialog box) and type regedit."*

**Dịch:** Công cụ chính để xem registry là **registry editor**. Vì nguy cơ người dùng ngây thơ mà nhiệt tình gây ra lỗi, **không có icon để khởi động registry editor**. Thay vào đó, mở DOS shell (hoặc hộp thoại Start → Run) và gõ **`regedit`**.

> *"The left side shows the keys, which are arranged in a tree structure. Note that each key starts with one of the HKEY nodes like"*

```
HKEY_CLASSES_ROOT
HKEY_CURRENT_USER
HKEY_LOCAL_MACHINE
. . .
```

> *"The right side shows the name/value pairs associated with a particular key. For example, if you installed Java 11, the key"*

```
HKEY_LOCAL_MACHINE\Software\JavaSoft\Java Runtime Environment
```

> *"contains a name/value pair such as"*

```
CurrentVersion="11.0_10"
```

> *"In this case, the value is a string. The values can also be integers or arrays of bytes."*

**Dịch:** Bên trái hiển thị các **key**, sắp theo **cấu trúc cây**. Mỗi key bắt đầu bằng một trong các **node `HKEY`**. Bên phải hiển thị các **cặp name/value** gắn với một key cụ thể. Ở đây value là một string; **value cũng có thể là integer hoặc array của byte**.

---

## 12.10.2 A Java Platform Interface for Accessing the Registry

> *"We create a simple interface to access the registry from Java code, and then implement this interface with native code. Our interface allows only a few registry operations; to keep the code size down, we omitted some important operations such as adding, deleting, and enumerating keys. (It should be easy to add the remaining registry API functions.)"*

**Dịch:** Ta tạo một interface đơn giản để truy cập registry từ code Java, rồi implement interface đó bằng native code. Interface này **chỉ cho phép vài thao tác registry**; để giữ code ngắn, sách **lược bỏ vài thao tác quan trọng** như thêm, xoá và liệt kê key.

> *"Even with the limited subset that we supply, you can"*
>
> *"• Enumerate all names stored in a key"*
> *"• Read the value stored with a name"*
> *"• Set the value stored with a name"*

**Dịch:** Ngay với tập con giới hạn này, bạn vẫn có thể: **liệt kê mọi name lưu trong một key** · **đọc value lưu cùng một name** · **đặt value lưu cùng một name**.

> *"Here is the Java class that encapsulates a registry key:"*

```java
public class Win32RegKey
{
    public Win32RegKey(int theRoot, String thePath) { . . . }
    public Enumeration names() { . . . }
    public native Object getValue(String name);
    public native void setValue(String name, Object value);
    public static final int HKEY_CLASSES_ROOT = 0x80000000;
    public static final int HKEY_CURRENT_USER = 0x80000001;
    public static final int HKEY_LOCAL_MACHINE = 0x80000002;
    . . .
}
```

> *"The names method returns an enumeration that holds all the names stored with the key. You can get at them with the familiar hasMoreElements/nextElement methods. The getValue method returns an object that is either a string, an Integer object, or a byte array. The value parameter of the setValue method must also be of one of these three types."*

**Dịch:** Method `names` trả về một **enumeration chứa mọi name lưu cùng key**. Lấy chúng ra bằng cặp method quen thuộc `hasMoreElements`/`nextElement`. Method `getValue` trả về một object là **string, object `Integer`, hoặc byte array**. Parameter `value` của `setValue` cũng **phải thuộc một trong ba kiểu đó**.

---

## 12.10.3 Implementation of Registry Access Functions as Native Methods

> *"We need to implement three actions:"*
>
> *"• Get the value of a name"*
> *"• Set the value of a name"*
> *"• Iterate through the names of a key"*

**Dịch:** Cần implement ba hành động: **lấy value của một name** · **đặt value của một name** · **duyệt qua các name của một key**.

> *"In this chapter, you have seen essentially all the tools that are required, such as the conversion between Java strings and arrays and those of C. You also saw how to raise a Java exception in case something goes wrong."*

**Dịch:** Trong chương này bạn đã thấy về cơ bản **mọi công cụ cần thiết**: chuyển đổi giữa string/array của Java và của C (xem [[03 - String Parameters]], [[07 - Accessing Array Elements]]), và cách **dựng một Java exception** khi có chuyện sai (xem [[08 - Handling Errors]]).

> *"Two issues make these native methods more complex than the preceding examples. The getValue and setValue methods deal with the type Object, which can be one of String, Integer, or byte[]. The enumeration object stores the state between successive calls to hasMoreElements and nextElement."*

**Dịch:** **Hai vấn đề** làm các native method này phức tạp hơn ví dụ trước: (1) `getValue` và `setValue` làm việc với kiểu **`Object`**, có thể là `String`, `Integer`, hoặc `byte[]`; (2) object enumeration phải **lưu state giữa các lời gọi liên tiếp** tới `hasMoreElements` và `nextElement`.

### Các bước của `getValue`

> *"Let us first look at the getValue method. The method (shown in Listing 12.22) goes through the following steps:"*

| # | Bước |
|---|---|
| 1 | *"Opens the registry key. To read their values, the registry API requires that keys be open."* — **Mở registry key.** Để đọc value, registry API yêu cầu key phải đang mở. |
| 2 | *"Queries the type and size of the value associated with the name."* — **Truy vấn kiểu và kích thước** của value gắn với name. |
| 3 | *"Reads the data into a buffer."* — **Đọc data vào một buffer.** |
| 4 | *"Calls NewStringUTF to create a new string with the value data if the type is REG_SZ (a string)."* — Gọi `NewStringUTF` tạo string mới nếu kiểu là **`REG_SZ`** (string). |
| 5 | *"Invokes the Integer constructor if the type is REG_DWORD (a 32-bit integer)."* — Gọi constructor của `Integer` nếu kiểu là **`REG_DWORD`** (integer 32-bit). |
| 6 | *"Calls NewByteArray to create a new byte array, then SetByteArrayRegion to copy the value data into the byte array, if the type is REG_BINARY."* — Gọi `NewByteArray` rồi `SetByteArrayRegion` nếu kiểu là **`REG_BINARY`**. |
| 7 | *"If the type is none of these or if an error occurred when an API function was called, throws an exception and releases all resources that had been acquired up to that point."* — Nếu kiểu không thuộc các loại trên, hoặc có lỗi khi gọi API function, thì **ném exception và giải phóng mọi tài nguyên đã chiếm** tới thời điểm đó. |
| 8 | *"Closes the key and returns the object (String, Integer, or byte[]) that had been created."* — **Đóng key** và trả về object (`String`, `Integer`, hoặc `byte[]`) đã tạo. |

> *"As you can see, this example illustrates quite nicely how to generate Java objects of different types."*

**Dịch:** Ví dụ này **minh hoạ khá đẹp cách sinh ra Java object thuộc nhiều kiểu khác nhau**.

### `IsAssignableFrom` — xác định kiểu của value

> *"In this native method, coping with the generic return type is not difficult. The jstring, jobject, or jarray reference is simply returned as a jobject. However, the setValue method receives a reference to an Object and must determine the Object's exact type to save the Object as a string, integer, or byte array. We can make this determination by querying the class of the value object, finding the class references for java.lang.String, java.lang.Integer, and byte[], and comparing them with the IsAssignableFrom function."*

**Dịch:** Trong native method này, xử lý kiểu trả về tổng quát **không khó** — reference `jstring`, `jobject` hay `jarray` **đơn giản là được trả về dưới dạng `jobject`**. Nhưng `setValue` nhận vào reference tới một `Object` và **phải xác định đúng kiểu của `Object` đó**. Ta xác định bằng cách **truy vấn class của object value**, tìm class reference cho `java.lang.String`, `java.lang.Integer` và `byte[]`, rồi **so sánh bằng function `IsAssignableFrom`**.

> *"If class1 and class2 are two class references, then the call"*
>
> ```c
> (*env)->IsAssignableFrom(env, class1, class2)
> ```
>
> *"returns JNI_TRUE when class1 and class2 are the same class or when class1 is a subclass of class2. In either case, references to objects of class1 can be cast to class2. For example, when"*

```c
(*env)->IsAssignableFrom(env, (*env)->GetObjectClass(env, value),
   (*env)->FindClass(env, "[B"))
```

> *"is true, we know that value is a byte array."*

**Dịch:** Lời gọi trên trả về **`JNI_TRUE` khi `class1` và `class2` là cùng một class, hoặc khi `class1` là subclass của `class2`**. Trong cả hai trường hợp, reference tới object của `class1` **cast được sang `class2`**. Ví dụ khi biểu thức trên đúng, ta biết `value` là một **byte array** (`"[B"`).

### Các bước của `setValue`

> *"Here is an overview of the steps in the setValue method:"*

| # | Bước |
|---|---|
| 1 | *"Open the registry key for writing."* — **Mở registry key để ghi.** |
| 2 | *"Find the type of the value to write."* — Tìm **kiểu của value** cần ghi. |
| 3 | *"Call GetStringUTFChars to get a pointer to the characters if the type is String."* — Gọi `GetStringUTFChars` lấy con trỏ tới các ký tự nếu kiểu là `String`. |
| 4 | *"Call the intValue method to get the integer stored in the wrapper object if the type is Integer."* — Gọi method `intValue` lấy số nguyên trong wrapper object nếu kiểu là `Integer`. |
| 5 | *"Call GetByteArrayElements to get a pointer to the bytes if the type is byte[]."* — Gọi `GetByteArrayElements` lấy con trỏ tới các byte nếu kiểu là `byte[]`. |
| 6 | *"Pass the data and length to the registry."* — **Truyền data và length cho registry.** |
| 7 | *"Close the key."* — **Đóng key.** |
| 8 | *"Release the pointer to the data if the type is String or byte[]."* — **Giải phóng con trỏ tới data** nếu kiểu là `String` hoặc `byte[]`. |

### Enumeration

> *"Finally, let us turn to the native methods that enumerate keys. These are methods of the Win32RegKeyNameEnumeration class (see Listing 12.21). When the enumeration process starts, we must open the key. For the duration of the enumeration, we must retain the key handle—that is, the key handle must be stored with the enumeration object. The key handle is of type DWORD (a 32-bit quantity), so it can be stored in a Java integer. We store it in the hkey field of the enumeration class. When the enumeration starts, the field is initialized with SetIntField. Subsequent calls read the value with GetIntField."*

**Dịch:** Khi quá trình enumeration bắt đầu, ta **phải mở key**. Trong suốt quá trình enumeration, ta **phải giữ lại key handle** — tức key handle **phải được lưu cùng object enumeration**. Key handle thuộc kiểu **`DWORD`** (đại lượng 32-bit), nên **lưu được trong một Java integer**. Ta lưu nó vào field **`hkey`**. Khi enumeration bắt đầu, field được khởi tạo bằng **`SetIntField`**; các lời gọi sau đọc giá trị bằng **`GetIntField`**.

> *"In this example, we store three other data items with the enumeration object. When the enumeration first starts, we can query the registry for the count of name/value pairs and the length of the longest name, which we need so we can allocate C character arrays to hold the names. These values are stored in the count and maxsize fields of the enumeration object. Finally, the index field, initialized with -1 to indicate the start of the enumeration, is set to 0 once the other instance fields are initialized, and is incremented after every enumeration step."*

**Dịch:** Ta lưu **ba mục data khác** cùng object enumeration. Khi enumeration khởi động lần đầu, ta truy vấn registry để lấy **số lượng cặp name/value** và **độ dài của name dài nhất** — cần để cấp phát mảng ký tự C chứa các name. Chúng được lưu vào field **`count`** và **`maxsize`**. Cuối cùng, field **`index`**, khởi tạo bằng **`-1`** để đánh dấu điểm bắt đầu enumeration, được **đặt về `0`** khi các instance field khác đã khởi tạo xong, và **tăng lên sau mỗi bước enumeration**.

> *"Let's walk through the native methods that support the enumeration. The hasMoreElements method is simple:"*

| # | `hasMoreElements` |
|---|---|
| 1 | *"Retrieve the index and count fields."* — Lấy field `index` và `count`. |
| 2 | *"If the index is -1, call the startNameEnumeration function which opens the key, queries the count and maximum length, and initializes the hkey, count, maxsize, and index fields."* — Nếu `index` là `-1`, gọi `startNameEnumeration` (mở key, truy vấn count và độ dài tối đa, khởi tạo `hkey`, `count`, `maxsize`, `index`). |
| 3 | *"Return JNI_TRUE if index is less than count, and JNI_FALSE otherwise."* — Trả về `JNI_TRUE` nếu `index < count`, ngược lại `JNI_FALSE`. |

> *"The nextElement method needs to work a little harder:"*

| # | `nextElement` |
|---|---|
| 1 | *"Retrieve the index and count fields."* — Lấy field `index` và `count`. |
| 2 | *"If the index is -1, call the startNameEnumeration function, which opens the key, queries the count and maximum length, and initializes the hkey, count, maxsize, and index fields."* — Nếu `index` là `-1`, gọi `startNameEnumeration`. |
| 3 | *"If index equals count, throw a NoSuchElementException."* — Nếu `index == count`, **ném `NoSuchElementException`**. |
| 4 | *"Read the next name from the registry."* — Đọc name kế tiếp từ registry. |
| 5 | *"Increment index."* — Tăng `index`. |
| 6 | *"If index equals count, close the key."* — Nếu `index == count`, **đóng key**. |

---

## Compile

> *"Before compiling, remember to run javac -h on both Win32RegKey and Win32RegKeyNameEnumeration. The complete command line for the Microsoft compiler is"*

```
cl -I jdk\include -I jdk\include\win32 -LD Win32RegKey.c advapi32.lib -FeWin32RegKey.dll
```

> *"With Cygwin, use"*

```
gcc -mno-cygwin -D __int64="long long" -I jdk\include -I jdk\include\win32 \
  -I c:\cygwin\usr\include\w32api -shared -Wl,--add-stdcall-alias -o Win32RegKey.dll
  Win32RegKey.c
```

> *"As the registry API is specific to Windows, this program will not work on other operating systems."*

**Dịch:** Trước khi compile, **nhớ chạy `javac -h` trên cả `Win32RegKey` lẫn `Win32RegKeyNameEnumeration`**. Vì registry API là đặc thù Windows, **chương trình này không chạy trên hệ điều hành khác**.

> *"Listing 12.23 shows a program to test our new registry functions. We add three name/value pairs, a string, an integer, and a byte array to the key"*
>
> ```
> HKEY_CURRENT_USER\Software\JavaSoft\Java Runtime Environment
> ```
>
> *"We then enumerate all names of that key and retrieve their values. The program will print"*
>
> ```
> Default user=Harry Hacker
> Lucky number=13
> Small primes=2 3 5 7 11 13
> ```
>
> *"Although adding these name/value pairs to that key probably does no harm, you might want to use the registry editor to remove them after running this program."*

**Dịch:** Chương trình test thêm ba cặp name/value — một string, một integer và một byte array — vào key trên, rồi **liệt kê mọi name của key đó và lấy value**. Dù việc thêm các cặp này chắc không hại gì, **bạn có thể muốn dùng registry editor xoá chúng đi sau khi chạy chương trình**.

---

### Listing 12.21 — `win32reg/Win32RegKey.java`

```java
import java.util.*;

/**
 * A Win32RegKey object can be used to get and set values of a registry key in the Windows
 * registry.
 * @version 1.00 1997-07-01
 * @author Cay Horstmann
 */
public class Win32RegKey
{
    public static final int HKEY_CLASSES_ROOT = 0x80000000;
    public static final int HKEY_CURRENT_USER = 0x80000001;
    public static final int HKEY_LOCAL_MACHINE = 0x80000002;
    public static final int HKEY_USERS = 0x80000003;
    public static final int HKEY_CURRENT_CONFIG = 0x80000005;
    public static final int HKEY_DYN_DATA = 0x80000006;

    private int root;
    private String path;

    /**
     * Gets the value of a registry entry.
     * @param name the entry name
     * @return the associated value
     */
    public native Object getValue(String name);

    /**
     * Sets the value of a registry entry.
     * @param name the entry name
     * @param value the new value
     */
    public native void setValue(String name, Object value);

    /**
     * Construct a registry key object.
     * @param theRoot one of HKEY_CLASSES_ROOT, HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE,
     * HKEY_USERS, HKEY_CURRENT_CONFIG, HKEY_DYN_DATA
     * @param thePath the registry key path
     */
    public Win32RegKey(int theRoot, String thePath)
    {
        root = theRoot;
        path = thePath;
    }

    /**
     * Enumerates all names of registry entries under the path that this object describes.
     * @return an enumeration listing all entry names
     */
    public Enumeration<String> names()
    {
        return new Win32RegKeyNameEnumeration(root, path);
    }

    static
    {
        System.loadLibrary("Win32RegKey");
    }
}

class Win32RegKeyNameEnumeration implements Enumeration<String>
{
    public native String nextElement();
    public native boolean hasMoreElements();
    private int root;
    private String path;
    private int index = -1;
    private int hkey = 0;
    private int maxsize;
    private int count;

    Win32RegKeyNameEnumeration(int theRoot, String thePath)
    {
        root = theRoot;
        path = thePath;
    }
}

class Win32RegKeyException extends RuntimeException
{
    public Win32RegKeyException()
    {
    }

    public Win32RegKeyException(String why)
    {
        super(why);
    }
}
```

### Listing 12.22 — `win32reg/Win32RegKey.c`

```c
/**
   @version 1.00 1997-07-01
   @author Cay Horstmann
*/

#include "Win32RegKey.h"
#include "Win32RegKeyNameEnumeration.h"
#include <string.h>
#include <stdlib.h>
#include <windows.h>

JNIEXPORT jobject JNICALL Java_Win32RegKey_getValue(
   JNIEnv* env, jobject this_obj, jobject name)
{
   const char* cname;
   jstring path;
   const char* cpath;
   HKEY hkey;
   DWORD type;
   DWORD size;
   jclass this_class;
   jfieldID id_root;
   jfieldID id_path;
   HKEY root;
   jobject ret;
   char* cret;

   /* get the class */
   this_class = (*env)->GetObjectClass(env, this_obj);

   /* get the field IDs */
   id_root = (*env)->GetFieldID(env, this_class, "root", "I");
   id_path = (*env)->GetFieldID(env, this_class, "path", "Ljava/lang/String;");

   /* get the fields */
   root = (HKEY) (*env)->GetIntField(env, this_obj, id_root);
   path = (jstring)(*env)->GetObjectField(env, this_obj, id_path);
   cpath = (*env)->GetStringUTFChars(env, path, NULL);

   /* open the registry key */
   if (RegOpenKeyEx(root, cpath, 0, KEY_READ, &hkey) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Open key failed");
      (*env)->ReleaseStringUTFChars(env, path, cpath);
      return NULL;
   }

   (*env)->ReleaseStringUTFChars(env, path, cpath);
   cname = (*env)->GetStringUTFChars(env, name, NULL);

   /* find the type and size of the value */
   if (RegQueryValueEx(hkey, cname, NULL, &type, NULL, &size) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Query value key failed");
      RegCloseKey(hkey);
      (*env)->ReleaseStringUTFChars(env, name, cname);
      return NULL;
   }

   /* get memory to hold the value */
   cret = (char*)malloc(size);

   /* read the value */
   if (RegQueryValueEx(hkey, cname, NULL, &type, cret, &size) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Query value key failed");
      free(cret);
      RegCloseKey(hkey);
      (*env)->ReleaseStringUTFChars(env, name, cname);
      return NULL;
   }

   /* depending on the type, store the value in a string,
      integer, or byte array */
   if (type == REG_SZ)
   {
      ret = (*env)->NewStringUTF(env, cret);
   }
   else if (type == REG_DWORD)
   {
      jclass class_Integer = (*env)->FindClass(env, "java/lang/Integer");
      /* get the method ID of the constructor */
      jmethodID id_Integer = (*env)->GetMethodID(env, class_Integer, "<init>", "(I)V");
      int value = *(int*) cret;
      /* invoke the constructor */
      ret = (*env)->NewObject(env, class_Integer, id_Integer, value);
   }
   else if (type == REG_BINARY)
   {
      ret = (*env)->NewByteArray(env, size);
      (*env)->SetByteArrayRegion(env, (jarray) ret, 0, size, cret);
   }
   else
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Unsupported value type");
      ret = NULL;
   }

   free(cret);
   RegCloseKey(hkey);
   (*env)->ReleaseStringUTFChars(env, name, cname);

   return ret;
}

JNIEXPORT void JNICALL Java_Win32RegKey_setValue(JNIEnv* env, jobject this_obj,
      jstring name, jobject value)
{
   const char* cname;
   jstring path;
   const char* cpath;
   HKEY hkey;
   DWORD type;
   DWORD size;
   jclass this_class;
   jclass class_value;
   jclass class_Integer;
   jfieldID id_root;
   jfieldID id_path;
   HKEY root;
   const char* cvalue;
   int ivalue;

   /* get the class */
   this_class = (*env)->GetObjectClass(env, this_obj);

   /* get the field IDs */
   id_root = (*env)->GetFieldID(env, this_class, "root", "I");
   id_path = (*env)->GetFieldID(env, this_class, "path", "Ljava/lang/String;");

   /* get the fields */
   root = (HKEY)(*env)->GetIntField(env, this_obj, id_root);
   path = (jstring)(*env)->GetObjectField(env, this_obj, id_path);
   cpath = (*env)->GetStringUTFChars(env, path, NULL);

   /* open the registry key */
   if (RegOpenKeyEx(root, cpath, 0, KEY_WRITE, &hkey) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Open key failed");
      (*env)->ReleaseStringUTFChars(env, path, cpath);
      return;
   }

   (*env)->ReleaseStringUTFChars(env, path, cpath);
   cname = (*env)->GetStringUTFChars(env, name, NULL);

   class_value = (*env)->GetObjectClass(env, value);
   class_Integer = (*env)->FindClass(env, "java/lang/Integer");
   /* determine the type of the value object */
   if ((*env)->IsAssignableFrom(env, class_value, (*env)->FindClass(env, "java/lang/String")))
   {
      /* it is a string--get a pointer to the characters */
      cvalue = (*env)->GetStringUTFChars(env, (jstring) value, NULL);
      type = REG_SZ;
      size = (*env)->GetStringLength(env, (jstring) value) + 1;
   }
   else if ((*env)->IsAssignableFrom(env, class_value, class_Integer))
   {
      /* it is an integer--call intValue to get the value */
      jmethodID id_intValue = (*env)->GetMethodID(env, class_Integer, "intValue", "()I");
      ivalue = (*env)->CallIntMethod(env, value, id_intValue);
      type = REG_DWORD;
      cvalue = (char*)&ivalue;
      size = 4;
   }
   else if ((*env)->IsAssignableFrom(env, class_value, (*env)->FindClass(env, "[B")))
   {
      /* it is a byte array--get a pointer to the bytes */
      type = REG_BINARY;
      cvalue = (char*)(*env)->GetByteArrayElements(env, (jarray) value, NULL);
      size = (*env)->GetArrayLength(env, (jarray) value);
   }
   else
   {
      /* we don't know how to handle this type */
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Unsupported value type");
      RegCloseKey(hkey);
      (*env)->ReleaseStringUTFChars(env, name, cname);
      return;
   }

   /* set the value */
   if (RegSetValueEx(hkey, cname, 0, type, cvalue, size) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Set value failed");
   }

   RegCloseKey(hkey);
   (*env)->ReleaseStringUTFChars(env, name, cname);

   /* if the value was a string or byte array, release the pointer */
   if (type == REG_SZ)
   {
      (*env)->ReleaseStringUTFChars(env, (jstring) value, cvalue);
   }
   else if (type == REG_BINARY)
   {
      (*env)->ReleaseByteArrayElements(env, (jarray) value, (jbyte*) cvalue, 0);
   }
}

/* helper function to start enumeration of names */
static int startNameEnumeration(JNIEnv* env, jobject this_obj, jclass this_class)
{
   jfieldID id_index;
   jfieldID id_count;
   jfieldID id_root;
   jfieldID id_path;
   jfieldID id_hkey;
   jfieldID id_maxsize;

   HKEY root;
   jstring path;
   const char* cpath;
   HKEY hkey;
   DWORD maxsize = 0;
   DWORD count = 0;

   /* get the field IDs */
   id_root = (*env)->GetFieldID(env, this_class, "root", "I");
   id_path = (*env)->GetFieldID(env, this_class, "path", "Ljava/lang/String;");
   id_hkey = (*env)->GetFieldID(env, this_class, "hkey", "I");
   id_maxsize = (*env)->GetFieldID(env, this_class, "maxsize", "I");
   id_index = (*env)->GetFieldID(env, this_class, "index", "I");
   id_count = (*env)->GetFieldID(env, this_class, "count", "I");

   /* get the field values */
   root = (HKEY)(*env)->GetIntField(env, this_obj, id_root);
   path = (jstring)(*env)->GetObjectField(env, this_obj, id_path);
   cpath = (*env)->GetStringUTFChars(env, path, NULL);

   /* open the registry key */
   if (RegOpenKeyEx(root, cpath, 0, KEY_READ, &hkey) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Open key failed");
      (*env)->ReleaseStringUTFChars(env, path, cpath);
      return -1;
   }
   (*env)->ReleaseStringUTFChars(env, path, cpath);

   /* query count and max length of names */
   if (RegQueryInfoKey(hkey, NULL, NULL, NULL, NULL, NULL, NULL, &count, &maxsize,
         NULL, NULL, NULL) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Query info key failed");
      RegCloseKey(hkey);
      return -1;
   }

   /* set the field values */
   (*env)->SetIntField(env, this_obj, id_hkey, (DWORD) hkey);
   (*env)->SetIntField(env, this_obj, id_maxsize, maxsize + 1);
   (*env)->SetIntField(env, this_obj, id_index, 0);
   (*env)->SetIntField(env, this_obj, id_count, count);
   return count;
}

JNIEXPORT jboolean JNICALL Java_Win32RegKeyNameEnumeration_hasMoreElements(JNIEnv* env,
      jobject this_obj)
{
   jclass this_class;
   jfieldID id_index;
   jfieldID id_count;
   int index;
   int count;
   /* get the class */
   this_class = (*env)->GetObjectClass(env, this_obj);

   /* get the field IDs */
   id_index = (*env)->GetFieldID(env, this_class, "index", "I");
   id_count = (*env)->GetFieldID(env, this_class, "count", "I");

   index = (*env)->GetIntField(env, this_obj, id_index);
   if (index == -1) /* first time */
   {
      count = startNameEnumeration(env, this_obj, this_class);
      index = 0;
   }
   else
      count = (*env)->GetIntField(env, this_obj, id_count);
   return index < count;
}

JNIEXPORT jobject JNICALL Java_Win32RegKeyNameEnumeration_nextElement(JNIEnv* env,
      jobject this_obj)
{
   jclass this_class;
   jfieldID id_index;
   jfieldID id_hkey;
   jfieldID id_count;
   jfieldID id_maxsize;

   HKEY hkey;
   int index;
   int count;
   DWORD maxsize;

   char* cret;
   jstring ret;

   /* get the class */
   this_class = (*env)->GetObjectClass(env, this_obj);

   /* get the field IDs */
   id_index = (*env)->GetFieldID(env, this_class, "index", "I");
   id_count = (*env)->GetFieldID(env, this_class, "count", "I");
   id_hkey = (*env)->GetFieldID(env, this_class, "hkey", "I");
   id_maxsize = (*env)->GetFieldID(env, this_class, "maxsize", "I");

   index = (*env)->GetIntField(env, this_obj, id_index);
   if (index == -1) /* first time */
   {
      count = startNameEnumeration(env, this_obj, this_class);
      index = 0;
   }
   else
      count = (*env)->GetIntField(env, this_obj, id_count);

   if (index >= count) /* already at end */
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "java/util/NoSuchElementException"),
         "past end of enumeration");
      return NULL;
   }

   maxsize = (*env)->GetIntField(env, this_obj, id_maxsize);
   hkey = (HKEY)(*env)->GetIntField(env, this_obj, id_hkey);
   cret = (char*)malloc(maxsize);

   /* find the next name */
   if (RegEnumValue(hkey, index, cret, &maxsize, NULL, NULL, NULL, NULL) != ERROR_SUCCESS)
   {
      (*env)->ThrowNew(env, (*env)->FindClass(env, "Win32RegKeyException"),
         "Enum value failed");
      free(cret);
      RegCloseKey(hkey);
      (*env)->SetIntField(env, this_obj, id_index, count);
      return NULL;
   }

   ret = (*env)->NewStringUTF(env, cret);
   free(cret);

   /* increment index */
   index++;
   (*env)->SetIntField(env, this_obj, id_index, index);

   if (index == count) /* at end */
   {
      RegCloseKey(hkey);
   }

   return ret;
}
```

### Listing 12.23 — `win32reg/Win32RegKeyTest.java`

```java
import java.util.*;

/**
   @version 1.03 2018-05-01
   @author Cay Horstmann
*/
public class Win32RegKeyTest
{
    public static void main(String[] args)
    {
        var key = new Win32RegKey(
            Win32RegKey.HKEY_CURRENT_USER, "Software\\JavaSoft\\Java Runtime Environment");

        key.setValue("Default user", "Harry Hacker");
        key.setValue("Lucky number", new Integer(13));
        key.setValue("Small primes", new byte[] { 2, 3, 5, 7, 11 });

        Enumeration<String> e = key.names();

        while (e.hasMoreElements())
        {
            String name = e.nextElement();
            System.out.print(name + "=");

            Object value = key.getValue(name);

            if (value instanceof byte[])
                for (byte b : (byte[]) value) System.out.print((b & 0xFF) + " ");
            else
                System.out.print(value);

            System.out.println();
        }
    }
}
```

---

## API — Type Inquiry Functions

| API | Mô tả |
|---|---|
| `jboolean IsAssignableFrom(JNIEnv *env, jclass cl1, jclass cl2)` | *"returns JNI_TRUE if objects of the first class can be assigned to objects of the second class, and JNI_FALSE otherwise. This tests if the classes are the same, or cl1 is a subclass of cl2, or cl2 represents an interface implemented by cl1 or one of its superclasses."* — Trả về `JNI_TRUE` nếu object của class thứ nhất **gán được** cho object của class thứ hai. Nó kiểm tra: hai class **giống nhau**, hoặc `cl1` là **subclass** của `cl2`, hoặc `cl2` biểu thị một **interface được `cl1` (hoặc một superclass của nó) implement**. |
| `jclass GetSuperclass(JNIEnv *env, jclass cl)` | *"returns the superclass of a class. If cl represents the class Object or an interface, returns NULL."* — Trả về **superclass** của một class. Nếu `cl` biểu thị class `Object` hoặc một interface thì trả về `NULL`. |

---

## Hết Volume II

> *"You have now reached the end of the second volume of Core Java, completing a long journey in which you encountered many advanced APIs. We started out with topics that every Java programmer needs to know: streams, XML, networking, databases, and internationalization. We concluded with very technical chapters on security, annotation processing, advanced graphics, and native methods. We hope that you enjoyed your tour through the vast breadth of the Java APIs, and that you will be able to apply your newly gained knowledge in your projects."*

**Dịch:** Bạn đã tới **cuối tập hai của Core Java**, hoàn tất một hành trình dài qua nhiều API nâng cao. Ta khởi đầu với những chủ đề **mọi lập trình viên Java đều cần biết**: streams, XML, networking, databases, và internationalization. Ta kết thúc bằng những chương **rất kỹ thuật** về security, annotation processing, advanced graphics, và native methods. Hy vọng bạn đã tận hưởng chuyến tham quan qua **bề rộng mênh mông của các Java API**, và sẽ **áp dụng được kiến thức vừa thu được vào dự án của mình**.

→ [[00 - Lộ trình Java (roadmap)]]
