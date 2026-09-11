# 07 — Accessing Array Elements

> Chapter 12, Section 12.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.7 Accessing Array Elements

> *"All array types of the Java programming language have corresponding C types, as shown in Table 12.2."*

**Dịch:** **Mọi array type của Java đều có kiểu C tương ứng.**

> Về array trong Java: xem [[09 - Arrays]].

### Table 12.2 — Correspondence between Java Array Types and C Types

| Java Type | C Type | Java Type | C Type |
|---|---|---|---|
| `boolean[]` | `jbooleanArray` | `long[]` | `jlongArray` |
| `byte[]` | `jbyteArray` | `float[]` | `jfloatArray` |
| `char[]` | `jcharArray` | `double[]` | `jdoubleArray` |
| `int[]` | `jintArray` | `Object[]` | `jobjectArray` |
| `short[]` | `jshortArray` | | |

> **C++ Note (sách):** *"In C, all these array types are actually type synonyms of jobject. In C++, however, they are arranged in the inheritance hierarchy shown in Figure 12.3. The type jarray denotes a generic array."*
>
> **Dịch:** Trong C, **mọi array type này thực chất là từ đồng nghĩa kiểu của `jobject`**. Nhưng trong C++, chúng được **sắp thành một hệ thống phân cấp inheritance**. Kiểu **`jarray` biểu thị một array tổng quát**.

**Figure 12.3: Inheritance hierarchy of array types**

```
   ┌──────────────┐
   │   jobject    │
   └──────────────┘
          △
          │
   ┌──────────────┐
   │    jarray    │
   └──────────────┘
          △
          ├──────────▶ ┌────────────────┐
          │            │  jobjectArray  │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │ jbooleanArray  │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │   jbyteArray   │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │   jcharArray   │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │  jshortArray   │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │   jintArray    │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │   jlongArray   │
          │            └────────────────┘
          ├──────────▶ ┌────────────────┐
          │            │  jfloatArray   │
          │            └────────────────┘
          └──────────▶ ┌────────────────┐
                       │  jdoubleArray  │
                       └────────────────┘
```

*Bản in vẽ △ (tam giác rỗng, nét liền) = quan hệ extends: `jarray` extends `jobject`, và cả 9 array type cụ thể đều extends `jarray` qua cùng một trục dọc.*

---

## Độ dài array

> *"The GetArrayLength function returns the length of an array."*

```c
jarray array = . . .;
jsize length = (*env)->GetArrayLength(env, array);
```

---

## Truy cập phần tử: object array vs primitive array

> *"How you access elements in an array depends on whether the array stores objects or values of a primitive type (bool, char, or a numeric type). To access elements in an object array, use the GetObjectArrayElement and SetObjectArrayElement methods."*

```c
jobjectArray array = . . .;
int i, j;
jobject x = (*env)->GetObjectArrayElement(env, array, i);
(*env)->SetObjectArrayElement(env, array, j, x);
```

**Dịch:** Cách truy cập phần tử **tuỳ vào array lưu object hay lưu giá trị kiểu primitive** (`bool`, `char`, hoặc kiểu số). Với **object array**, dùng `GetObjectArrayElement` và `SetObjectArrayElement`.

> *"Although simple, this approach is also clearly inefficient; you want to be able to access array elements directly, especially when doing vector and matrix computations."*

**Dịch:** Cách này tuy đơn giản nhưng **rõ ràng kém hiệu quả**; bạn muốn **truy cập phần tử array trực tiếp**, nhất là khi làm tính toán vector và matrix.

---

## Lấy con trỏ C vào array

> *"The GetXxxArrayElements function returns a C pointer to the starting element of an array. As with ordinary strings, you must remember to call the corresponding ReleaseXxxArrayElements function to tell the virtual machine when you no longer need that pointer. Here, the type Xxx must be a primitive type—that is, not Object. You can then read and write the array elements directly. However, since the pointer might point to a copy, any changes that you make are guaranteed to be reflected in the original array only after you call the corresponding ReleaseXxxArrayElements function!"*

**Dịch:** **`GetXxxArrayElements`** trả về **con trỏ C tới phần tử đầu tiên của array**. Cũng như với string thường, bạn **phải nhớ gọi `ReleaseXxxArrayElements` tương ứng** để báo VM biết khi nào không cần con trỏ đó nữa. Ở đây kiểu `Xxx` **phải là kiểu primitive** — tức không phải `Object`. Bạn có thể đọc/ghi phần tử array trực tiếp. Tuy nhiên, vì **con trỏ có thể trỏ tới một bản copy**, mọi thay đổi bạn thực hiện **chỉ được đảm bảo phản ánh vào array gốc SAU KHI bạn gọi `ReleaseXxxArrayElements`**!

> **Note (sách):** *"You can find out if an array is a copy by passing a pointer to a jboolean variable as the third parameter to a GetXxxArrayElements method. The variable is filled with JNI_TRUE if the array is a copy. If you aren't interested in that information, just pass a NULL pointer."*
>
> **Dịch:** Bạn **biết được array có phải bản copy hay không** bằng cách truyền con trỏ tới một biến `jboolean` làm **parameter thứ ba**. Biến đó được điền `JNI_TRUE` nếu array là bản copy. Nếu không quan tâm, **cứ truyền con trỏ `NULL`**.

> *"Here is an example that multiplies all elements in an array of double values by a constant. We obtain a C pointer a into the Java array and then access individual elements as a[i]."*

```c
jdoubleArray array_a = . . .;
double scaleFactor = . . .;
double* a = (*env)->GetDoubleArrayElements(env, array_a, NULL);
for (i = 0; i < (*env)->GetArrayLength(env, array_a); i++)
   a[i] = a[i] * scaleFactor;
(*env)->ReleaseDoubleArrayElements(env, array_a, a, 0);
```

> *"Whether the virtual machine actually copies the array depends on how it allocates arrays and does its garbage collection. Some "copying" garbage collectors routinely move objects around and update object references. That strategy is not compatible with "pinning" an array to a particular location, because the collector cannot update the pointer values in native code."*

**Dịch:** Việc VM **có thực sự copy array hay không** tuỳ vào cách nó cấp phát array và làm garbage collection. Một số garbage collector kiểu "copying" **thường xuyên di chuyển object và cập nhật object reference**. Chiến lược đó **không tương thích với việc "ghim" (pinning) một array vào một vị trí cố định**, vì collector **không cập nhật được giá trị con trỏ nằm trong native code**.

> **Note (sách):** *"In the Oracle JVM implementation, boolean arrays are represented as packed arrays of 32-bit words. The GetBooleanArrayElements method copies them into unpacked arrays of jboolean values."*
>
> **Dịch:** Trong implementation JVM của Oracle, **boolean array được biểu diễn dưới dạng packed array của các word 32-bit**. `GetBooleanArrayElements` **copy chúng sang unpacked array của giá trị `jboolean`**.

> *"To access just a few elements of a large array, use the GetXxxArrayRegion and SetXxxArrayRegion methods that copy a range of elements from the Java array into a C array and back."*

**Dịch:** Muốn truy cập **chỉ vài phần tử của một array lớn**, dùng `GetXxxArrayRegion` và `SetXxxArrayRegion` — copy một **dải phần tử** từ Java array sang C array và ngược lại.

---

## Tạo array mới trong native method

> *"You can create new Java arrays in native methods with the NewXxxArray function. To create a new array of objects, specify the length, the type of the array elements, and an initial element for all entries (typically, NULL). Here is an example:"*

```c
jclass class_Employee = (*env)->FindClass(env, "Employee");
jobjectArray array_e = (*env)->NewObjectArray(env, 100, class_Employee, NULL);
```

> *"Arrays of primitive types are simpler: Just supply the length of the array."*

```c
jdoubleArray array_d = (*env)->NewDoubleArray(env, 100);
```

> *"The array is then filled with zeroes."*

**Dịch:** Tạo Java array mới trong native method bằng **`NewXxxArray`**. Với **array của object**, chỉ định **độ dài, kiểu phần tử, và một phần tử khởi tạo cho mọi entry** (thường là `NULL`). Với **array kiểu primitive** thì đơn giản hơn: **chỉ cần cấp độ dài**. Array khi đó **được lấp đầy bằng số 0**.

> **Note (sách):** *"The following methods are used for working with "direct buffers":"*
>
> ```c
> jobject NewDirectByteBuffer(JNIEnv* env, void* address, jlong capacity)
> void* GetDirectBufferAddress(JNIEnv* env, jobject buf)
> jlong GetDirectBufferCapacity(JNIEnv* env, jobject buf)
> ```
>
> *"Direct buffers are used in the java.nio package to support more efficient input/output operations and to minimize the copying of data between native and Java arrays."*
>
> **Dịch:** Các method trên dùng để làm việc với **"direct buffer"**. Direct buffer được dùng trong package **`java.nio`** để **hỗ trợ thao tác input/output hiệu quả hơn** và **giảm tối đa việc copy dữ liệu giữa native array và Java array**.

---

## API — Manipulating Java Arrays

| API | Mô tả |
|---|---|
| `jsize GetArrayLength(JNIEnv *env, jarray array)` | *"returns the number of elements in the array."* — Trả về số phần tử trong array. |
| `jobject GetObjectArrayElement(JNIEnv *env, jobjectArray array, jsize index)` | *"returns the value of an array element."* — Trả về giá trị của một phần tử array. |
| `void SetObjectArrayElement(JNIEnv *env, jobjectArray array, jsize index, jobject value)` | *"sets an array element to a new value."* — Đặt một phần tử array sang giá trị mới. |
| `Xxx* GetXxxArrayElements(JNIEnv *env, jarray array, jboolean* isCopy)` | *"yields a C pointer to the elements of a Java array. The field type Xxx is one of Boolean, Byte, Char, Short, Int, Long, Float, or Double. The pointer must be passed to ReleaseXxxArrayElements when it is no longer needed. isCopy is either NULL or points to a jboolean that is filled with JNI_TRUE if a copy is made, with JNI_FALSE otherwise."* — Cho ra con trỏ C tới các phần tử của một Java array. Con trỏ **phải được truyền cho `ReleaseXxxArrayElements`** khi không cần nữa. |
| `void ReleaseXxxArrayElements(JNIEnv *env, jarray array, Xxx elems[], jint mode)` | *"notifies the virtual machine that a pointer obtained by GetXxxArrayElements is no longer needed. mode is one of 0 (free the elems buffer after updating the array elements), JNI_COMMIT (do not free the elems buffer after updating the array elements), or JNI_ABORT (free the elems buffer without updating the array elements)."* — Báo VM biết con trỏ lấy từ `GetXxxArrayElements` không còn cần. **`mode`**: `0` = giải phóng buffer `elems` **sau khi** cập nhật phần tử array · `JNI_COMMIT` = **không** giải phóng buffer sau khi cập nhật · `JNI_ABORT` = giải phóng buffer **mà không** cập nhật phần tử array. |
| `void GetXxxArrayRegion(JNIEnv *env, jarray array, jint start, jint length, Xxx elems[])` | *"copies elements from a Java array to a C array. The field type Xxx is one of Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Copy phần tử **từ Java array sang C array**. |
| `void SetXxxArrayRegion(JNIEnv *env, jarray array, jint start, jint length, Xxx elems[])` | *"copies elements from a C array to a Java array. The field type Xxx is one of Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Copy phần tử **từ C array sang Java array**. |

---

## Bài kế tiếp

→ [[08 - Handling Errors]] — ném exception từ native method bằng `Throw`/`ThrowNew`, và kiểm tra exception đang chờ.
