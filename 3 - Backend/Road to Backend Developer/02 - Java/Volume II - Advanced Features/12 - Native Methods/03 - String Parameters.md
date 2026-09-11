# 03 — String Parameters

> Chapter 12, Section 12.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.3 String Parameters

> *"Next, let's look at how to transfer strings to and from native methods. Strings are quite different in the two languages: In Java, they are sequences of UTF-16 code points, whereas C strings are null-terminated sequences of bytes. JNI has two sets of functions for manipulating strings: One converts Java strings to "modified UTF-8" byte sequences and another converts them to arrays of UTF-16 values—that is, to jchar arrays."*

**Dịch:** Tiếp theo, xem cách chuyển string qua lại với native method. **String rất khác nhau ở hai ngôn ngữ**: trong Java chúng là **dãy UTF-16 code point**, còn string của C là **dãy byte kết thúc bằng null**. JNI có **hai bộ function** thao tác string: một bộ chuyển Java string sang **dãy byte "modified UTF-8"**, bộ kia chuyển sang **mảng giá trị UTF-16** — tức mảng `jchar`.

> *"(The UTF-8, "modified UTF-8," and UTF-16 formats were discussed in Chapter 2. Recall that the UTF-8 and "modified UTF-8" encodings leave ASCII characters unchanged, but all other Unicode characters are encoded as multibyte sequences.)"*

**Dịch:** Các định dạng UTF-8, "modified UTF-8" và UTF-16 đã bàn ở Chapter 2. Nhớ rằng encoding UTF-8 và "modified UTF-8" **giữ nguyên ký tự ASCII**, còn mọi ký tự Unicode khác được mã hoá thành **dãy nhiều byte**.

> Về class `String` của Java: xem [[05 - Strings]].

> **Note (sách):** *"The standard UTF-8 encoding and the "modified UTF-8" encoding differ only for "supplementary" characters with codes higher than 0xFFFF. In the standard UTF-8 encoding, these characters are encoded as 4-byte sequences. In the "modified" encoding, each such character is first encoded as a pair of "surrogates" in the UTF-16 encoding, and then each surrogate is encoded with UTF-8, yielding a total of 6 bytes. This is clumsy, but it is a historical accident—the JVM specification was written when Unicode was still limited to 16 bits."*
>
> **Dịch:** Encoding UTF-8 chuẩn và "modified UTF-8" **chỉ khác nhau ở các ký tự "supplementary"** có mã lớn hơn `0xFFFF`. Ở UTF-8 chuẩn, chúng được mã hoá thành **dãy 4 byte**. Ở bản "modified", mỗi ký tự như vậy **trước hết được mã hoá thành một cặp "surrogate" trong UTF-16**, rồi từng surrogate lại được mã hoá bằng UTF-8, cho ra **tổng cộng 6 byte**. Cách này vụng về, nhưng đó là **tai nạn lịch sử** — JVM specification được viết khi Unicode còn giới hạn ở 16 bit.

> *"If your C code already uses Unicode, you'll want to use the second set of conversion functions. On the other hand, if all your strings are restricted to ASCII characters, you can use the "modified UTF-8" conversion functions."*

**Dịch:** Nếu code C của bạn **đã dùng Unicode**, hãy dùng **bộ function chuyển đổi thứ hai**. Ngược lại, nếu mọi string của bạn **chỉ gồm ký tự ASCII** thì dùng bộ function "modified UTF-8".

---

## Kiểu `jstring`

> *"A native method with a String parameter actually receives a value of an opaque type called jstring. A native method with a return value of type String must return a value of type jstring. JNI functions read and construct these jstring objects. For example, the NewStringUTF function makes a new jstring object out of a char array that contains ASCII characters or, more generally, "modified UTF-8"-encoded byte sequences."*

**Dịch:** Một native method có parameter kiểu `String` thực ra **nhận vào giá trị của một kiểu mờ (opaque type) gọi là `jstring`**. Native method trả về `String` thì **phải trả về giá trị kiểu `jstring`**. Các JNI function đọc và dựng những object `jstring` này. Ví dụ function **`NewStringUTF`** tạo object `jstring` mới từ một mảng `char` chứa ký tự ASCII, hoặc tổng quát hơn là dãy byte mã hoá "modified UTF-8".

> *"JNI functions have a somewhat odd calling convention. Here is a call to the NewStringUTF function:"*

```c
JNIEXPORT jstring JNICALL Java_HelloNative_getGreeting(JNIEnv* env, jclass cl)
{
   jstring jstr;
   char greeting[] = "Hello, Native World\n";
   jstr = (*env)->NewStringUTF(env, greeting);
   return jstr;
}
```

**Dịch:** JNI function có **quy ước gọi hơi lạ**.

> **Note (sách):** *"Unless explicitly mentioned otherwise, all code in this chapter is C code."*
>
> **Dịch:** Trừ khi nói rõ khác đi, **mọi code trong chương này là code C**.

---

## Con trỏ `env`

> *"All calls to JNI functions use the env pointer that is the first argument of every native method. The env pointer is a pointer to a table of function pointers (see Figure 12.2). Therefore, you must prefix every JNI call with (*env)-> to actually dereference the function pointer. Furthermore, env is the first parameter of every JNI function."*

**Dịch:** Mọi lời gọi tới JNI function đều dùng **con trỏ `env`** — argument đầu tiên của mọi native method. `env` là **con trỏ trỏ tới một bảng các function pointer**. Do đó bạn **phải thêm tiền tố `(*env)->` vào mọi lời gọi JNI** để thực sự dereference function pointer đó. Hơn nữa, **`env` là parameter đầu tiên của mọi JNI function**.

**Figure 12.2: The env pointer**

```
                                              ┌──────────────┐
   env ┌──────────────┐    ┌──────────┐       │   reserved   │
   ───▶│      ●───────┼───▶│    ●─────┼──────▶├──────────────┤
       └──────────────┘    │          │       │   reserved   │
                           │    ⋮     │       ├──────────────┤
                           │          │       │   reserved   │
                           └──────────┘       ├──────────────┤
                                              │   reserved   │
                                              ├──────────────┤
                                              │  GetVersion  │ ───▶
                                              ├──────────────┤
                                              │ DefineClass  │ ───▶
                                              ├──────────────┤
                                              │  FindClass   │ ───▶
                                              ├──────────────┤
                                              │      ⋮       │
                                              └──────────────┘
```

*`env` trỏ tới một con trỏ, con trỏ đó trỏ tới bảng function pointer. Bốn ô đầu bảng là `reserved`, sau đó là các entry `GetVersion`, `DefineClass`, `FindClass`, … mỗi entry lại trỏ ra hàm thật.*

> **C++ Note (sách):** *"It is simpler to access JNI functions in C++. The C++ version of the JNIEnv class has inline member functions that take care of the function pointer lookup for you. For example, you can call the NewStringUTF function as"*
>
> ```cpp
> jstr = env->NewStringUTF(greeting);
> ```
>
> *"Note that you omit the JNIEnv pointer from the parameter list of the call."*
>
> **Dịch:** Truy cập JNI function **trong C++ đơn giản hơn**. Bản C++ của class `JNIEnv` có **inline member function** tự lo việc tra function pointer. Lưu ý là bạn **bỏ con trỏ `JNIEnv` khỏi danh sách parameter** của lời gọi.

---

## Đọc nội dung một `jstring`

> *"The NewStringUTF function lets you construct a new jstring. To read the contents of an existing jstring object, use the GetStringUTFChars function. This function returns a const jbyte* pointer to the "modified UTF-8" characters that describe the character string."*

**Dịch:** `NewStringUTF` cho phép **dựng một `jstring` mới**. Muốn **đọc nội dung của một object `jstring` đã có** thì dùng **`GetStringUTFChars`**. Function này trả về con trỏ `const jbyte*` tới các ký tự "modified UTF-8" mô tả chuỗi ký tự đó.

> *"Note that a specific virtual machine is free to choose this character encoding for its internal string representation, so you might get a character pointer into the actual Java string. Since Java strings are meant to be immutable, it is very important that you treat the const seriously and do not try to write into this character array. On the other hand, if the virtual machine uses UTF-16 or UTF-32 characters for its internal string representation, this function call allocates a new memory block that will be filled with the "modified UTF-8" equivalents."*

**Dịch:** Một virtual machine cụ thể **có quyền chọn encoding này làm cách biểu diễn string bên trong**, nên bạn có thể nhận được **con trỏ trỏ thẳng vào Java string thật**. Vì Java string vốn là **immutable**, cực kỳ quan trọng là bạn **coi trọng chữ `const` và đừng ghi vào mảng ký tự này**. Ngược lại, nếu VM dùng ký tự UTF-16 hay UTF-32 cho biểu diễn nội bộ, thì lời gọi này **cấp phát một khối bộ nhớ mới** rồi lấp đầy bằng phần "modified UTF-8" tương đương.

> *"The virtual machine must know when you are finished using the string so that it can garbage-collect it. (The garbage collector runs in a separate thread, and it can interrupt the execution of native methods.) For that reason, you must call the ReleaseStringUTFChars function."*

**Dịch:** Virtual machine **phải biết khi nào bạn dùng xong string** để có thể garbage-collect nó. (Garbage collector chạy **trong một thread riêng**, và nó **có thể ngắt việc thực thi của native method**.) Vì vậy bạn **phải gọi function `ReleaseStringUTFChars`**.

> *"Alternatively, you can supply your own buffer to hold the string characters by calling the GetStringRegion or GetStringUTFRegion methods."*
>
> *"Finally, the GetStringUTFLength function returns the number of characters needed for the "modified UTF-8" encoding of the string."*

**Dịch:** Ngoài ra, bạn **tự cấp buffer** để chứa ký tự của string bằng cách gọi `GetStringRegion` hoặc `GetStringUTFRegion`. Cuối cùng, `GetStringUTFLength` trả về **số ký tự cần cho encoding "modified UTF-8"** của string.

> **Note (sách):** *"You can find the JNI API at http://docs.oracle.com/javase/7/docs/technotes/guides/jni."*

---

## API — Accessing Java Strings from C Code

| API | Mô tả |
|---|---|
| `jstring NewStringUTF(JNIEnv* env, const char bytes[])` | *"returns a new Java string object from a zero byte-terminated "modified UTF-8" byte sequence, or NULL if the string cannot be constructed."* — Trả về Java string object mới từ dãy byte "modified UTF-8" kết thúc bằng byte 0, hoặc `NULL` nếu không dựng được. |
| `jsize GetStringUTFLength(JNIEnv* env, jstring string)` | *"returns the number of bytes required for the "modified UTF-8" encoding (not counting the zero byte terminator)."* — Trả về số byte cần cho encoding "modified UTF-8" (**không tính byte 0 kết thúc**). |
| `const jbyte* GetStringUTFChars(JNIEnv* env, jstring string, jboolean* isCopy)` | *"returns a pointer to the "modified UTF-8" encoding of a string, or NULL if the character array cannot be constructed. The pointer is valid until ReleaseStringUTFChars is called. isCopy points to a jboolean filled with JNI_TRUE if a copy is made, or with JNI_FALSE otherwise."* — Trả về con trỏ tới encoding "modified UTF-8" của string. Con trỏ **hợp lệ cho tới khi `ReleaseStringUTFChars` được gọi**. `isCopy` trỏ tới một `jboolean` được điền `JNI_TRUE` nếu có tạo bản copy. |
| `void ReleaseStringUTFChars(JNIEnv* env, jstring string, const jbyte bytes[])` | *"informs the virtual machine that the native code no longer needs access to the Java string through bytes (a pointer returned by GetStringUTFChars)."* — Báo cho VM biết native code **không còn cần truy cập** Java string qua `bytes`. |
| `void GetStringRegion(JNIEnv *env, jstring string, jsize start, jsize length, jchar *buffer)` | *"copies a sequence of UTF-16 double bytes from a string to a user-supplied buffer of size at least 2 × length."* — Copy một dãy UTF-16 double byte từ string vào buffer do người dùng cấp, **kích thước ít nhất 2 × length**. |
| `void GetStringUTFRegion(JNIEnv *env, jstring string, jsize start, jsize length, jbyte *buffer)` | *"copies a sequence of "modified UTF-8" bytes from a string to a user-supplied buffer. The buffer must be long enough to hold the bytes. In the worst case, 3 × length bytes are copied."* — Copy dãy byte "modified UTF-8" vào buffer do người dùng cấp. Buffer phải đủ dài; **trường hợp xấu nhất copy 3 × length byte**. |
| `jstring NewString(JNIEnv* env, const jchar chars[], jsize length)` | *"returns a new Java string object from a Unicode string, or NULL if the string cannot be constructed."* — Trả về Java string object mới từ một Unicode string. |
| `jsize GetStringLength(JNIEnv* env, jstring string)` | *"returns the number of characters in the string."* — Trả về **số ký tự** trong string. |
| `const jchar* GetStringChars(JNIEnv* env, jstring string, jboolean* isCopy)` | *"returns a pointer to the Unicode encoding of a string, or NULL if the character array cannot be constructed. The pointer is valid until ReleaseStringChars is called. isCopy is either NULL or points to a jboolean filled with JNI_TRUE if a copy is made, or with JNI_FALSE otherwise."* — Trả về con trỏ tới encoding Unicode của string; hợp lệ tới khi gọi `ReleaseStringChars`. |
| `void ReleaseStringChars(JNIEnv* env, jstring string, const jchar chars[])` | *"informs the virtual machine that the native code no longer needs access to the Java string through chars (a pointer returned by GetStringChars)."* — Báo VM biết native code không còn cần truy cập string qua `chars`. |

---

## Ví dụ: gọi `sprintf` của C

> *"Let us put these functions to work and write a class that calls the C function sprintf. We would like to call the function as shown in Listing 12.8."*

**Dịch:** Đem các function này ra dùng và viết một class gọi function `sprintf` của C.

### Listing 12.8 — `printf2/Printf2Test.java`

```java
/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf2Test
{
    public static void main(String[] args)
    {
        double price = 44.95;
        double tax = 7.75;
        double amountDue = price * (1 + tax / 100);

        String s = Printf2.sprint("Amount due = %8.2f", amountDue);
        System.out.println(s);
    }
}
```

### Listing 12.9 — `printf2/Printf2.java`

```java
/**
 * @version 1.10 1997-07-01
 * @author Cay Horstmann
 */
class Printf2
{
    public static native String sprint(String format, double x);

    static
    {
        System.loadLibrary("Printf2");
    }
}
```

> *"Therefore, the C function that formats a floating-point number has the prototype"*

```c
JNIEXPORT jstring JNICALL Java_Printf2_sprint(JNIEnv* env, jclass cl,
      jstring format, jdouble x)
```

> *"Listing 12.10 shows the code for the C implementation. Note the calls to GetStringUTFChars to read the format argument, NewStringUTF to generate the return value, and ReleaseStringUTFChars to inform the virtual machine that access to the string is no longer required."*

**Dịch:** Chú ý các lời gọi: **`GetStringUTFChars`** để đọc argument `format`, **`NewStringUTF`** để sinh giá trị trả về, và **`ReleaseStringUTFChars`** để báo VM rằng không cần truy cập string nữa.

### Listing 12.10 — `printf2/Printf2.c`

```c
/**
   @version 1.10 1997-07-01
   @author Cay Horstmann
*/

#include "Printf2.h"
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

JNIEXPORT jstring JNICALL Java_Printf2_sprint(JNIEnv* env, jclass cl,
      jstring format, jdouble x)
{
   const char* cformat;
   char* fmt;
   jstring ret;

   cformat = (*env)->GetStringUTFChars(env, format, NULL);
   fmt = find_format(cformat);
   if (fmt == NULL)
      ret = format;
   else
   {
      char* cret;
      int width = atoi(fmt);
      if (width == 0) width = DBL_DIG + 10;
      cret = (char*) malloc(strlen(cformat) + width);
      sprintf(cret, cformat, x);
      ret = (*env)->NewStringUTF(env, cret);
      free(cret);
   }
   (*env)->ReleaseStringUTFChars(env, format, cformat);
   return ret;
}
```

> *"In this function, we chose to keep error handling simple. If the format code to print a floating-point number is not of the form %w.pc, where c is one of the characters e, E, f, g, or G, then we simply do not format the number. We'll show you later how to make a native method throw an exception."*

**Dịch:** Trong function này ta **giữ phần xử lý lỗi cho đơn giản**. Nếu format code để in số floating-point không có dạng `%w.pc` (với `c` là một trong các ký tự `e`, `E`, `f`, `g`, `G`) thì ta **đơn giản là không format số đó**. Cách làm native method ném exception sẽ nói sau — xem [[08 - Handling Errors]].

---

## Bài kế tiếp

→ [[04 - Accessing Fields]] — truy cập instance field và static field của object Java từ native method bằng `jfieldID`.
