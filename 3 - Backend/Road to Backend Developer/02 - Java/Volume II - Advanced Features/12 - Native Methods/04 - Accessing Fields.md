# 04 — Accessing Fields

> Chapter 12, Section 12.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.4 Accessing Fields

> *"All the native methods you saw so far were static methods with number and string parameters. We'll now consider native methods that operate on objects. As an exercise, we will reimplement as native a method of the Employee class that was introduced in Volume I, Chapter 4. Again, this is not something you would normally want to do, but it does illustrate how to access fields from a native method when you need to do so."*

**Dịch:** Mọi native method thấy đến giờ đều là static method với parameter kiểu số và string. Giờ ta xét native method **thao tác lên object**. Như một bài tập, ta sẽ **viết lại một method của class `Employee`** (giới thiệu ở Volume I, Chapter 4) dưới dạng native. Đây **không phải việc bạn thường muốn làm**, nhưng nó minh hoạ cách truy cập field từ một native method khi cần.

---

## 12.4.1 Accessing Instance Fields

> *"To see how to access instance fields from a native method, we will reimplement the raiseSalary method. Here is the code in Java:"*

```java
public void raiseSalary(double byPercent)
{
    salary *= 1 + byPercent / 100;
}
```

> *"Let us rewrite this as a native method. Unlike the previous examples of native methods, this is not a static method. Running javac -h gives the following prototype:"*

```c
JNIEXPORT void JNICALL Java_Employee_raiseSalary(JNIEnv *, jobject, jdouble);
```

**Dịch:** Viết lại bằng native method. Khác các ví dụ trước, đây **không phải static method**. Chạy `javac -h` cho ra prototype trên.

> *"Note the second argument. It is no longer of type jclass but of type jobject. In fact, it is an equivalent of the this reference. Static methods obtain a reference to the class, whereas nonstatic methods obtain a reference to the implicit this argument object."*

**Dịch:** Chú ý argument thứ hai: nó **không còn kiểu `jclass` mà là `jobject`**. Thực chất nó tương đương với **reference `this`**. **Static method nhận reference tới class**, còn **nonstatic method nhận reference tới object là implicit argument `this`**.

> *"Now we access the salary field of the implicit argument. In the "raw" Java-to-C binding of Java 1.0, this was easy—a programmer could directly access object data fields. However, direct access requires all virtual machines to expose their internal data layout. For that reason, the JNI requires programmers to get and set the values of data fields by calling special JNI functions."*

**Dịch:** Giờ ta truy cập field `salary` của implicit argument. Ở binding Java-sang-C "thô" của Java 1.0, việc này dễ — lập trình viên **truy cập trực tiếp data field của object** được. Nhưng truy cập trực tiếp **buộc mọi virtual machine phải phơi bày data layout nội bộ của nó**. Vì vậy JNI **bắt lập trình viên đọc/ghi giá trị data field bằng cách gọi các JNI function riêng**.

> *"In our case, we need to use the GetDoubleField and SetDoubleField functions because the type of salary is double. There are other functions—GetIntField/SetIntField, GetObjectField/SetObjectField, and so on for other field types. The general syntax is:"*

```c
x = (*env)->GetXxxField(env, this_obj, fieldID);
(*env)->SetXxxField(env, this_obj, fieldID, x);
```

> *"Here, fieldID is a value of a special type, jfieldID, that identifies a field in a structure, and Xxx represents a Java data type (Object, Boolean, Byte, and so on)."*

**Dịch:** Ở đây `fieldID` là giá trị thuộc kiểu đặc biệt **`jfieldID`**, dùng để **định danh một field trong một structure**, còn `Xxx` đại diện cho một kiểu dữ liệu Java (`Object`, `Boolean`, `Byte`, v.v.).

---

### Lấy class reference

> *"To obtain the fieldID, you must first get a value representing the class, which you can do in one of two ways. The GetObjectClass function returns the class of any object. For example:"*

```c
jclass class_Employee = (*env)->GetObjectClass(env, this_obj);
```

> *"The FindClass function lets you specify the class name as a string (curiously, with / characters instead of periods as package name separators)."*

```c
jclass class_String = (*env)->FindClass(env, "java/lang/String");
```

**Dịch:** Để lấy `fieldID`, trước hết **phải lấy một giá trị đại diện cho class** — làm được bằng **hai cách**. **`GetObjectClass`** trả về class của bất kỳ object nào. **`FindClass`** cho phép chỉ định **tên class dưới dạng string** (lạ thay, dùng ký tự **`/` thay cho dấu chấm** làm dấu ngăn tên package).

### Lấy `fieldID`

> *"Use the GetFieldID function to obtain the fieldID. You must supply the name of the field and its signature, an encoding of its type. For example, here is the code to obtain the field ID of the salary field:"*

```c
jfieldID id_salary = (*env)->GetFieldID(env, class_Employee, "salary", "D");
```

> *"The string "D" denotes the type double. You'll learn the complete rules for encoding signatures in the next section."*

**Dịch:** Dùng **`GetFieldID`** để lấy `fieldID`. Bạn phải cung cấp **tên field** và **signature của nó** — tức phần mã hoá kiểu. String **`"D"` biểu thị kiểu `double`**. Quy tắc đầy đủ để encode signature ở [[05 - Encoding Signatures]].

> *"You might be thinking that accessing a data field is quite convoluted. The designers of the JNI did not want to expose the data fields directly, so they had to supply functions for getting and setting field values. To minimize the cost of these functions, computing the field ID from the field name—which is the most expensive step—is factored out into a separate step. That is, if you repeatedly get and set the value of a particular field, you can incur the cost of computing the field identifier only once."*

**Dịch:** Bạn có thể thấy việc truy cập một data field khá vòng vèo. Người thiết kế JNI **không muốn phơi bày data field trực tiếp**, nên phải cung cấp function để get/set giá trị field. Để **giảm chi phí** cho những function này, việc **tính field ID từ tên field — bước tốn kém nhất — được tách ra thành một bước riêng**. Nghĩa là nếu bạn liên tục get/set giá trị của một field cụ thể, bạn **chỉ phải trả chi phí tính field identifier đúng một lần**.

> *"Let us put all the pieces together. The following code reimplements the raiseSalary method as a native method:"*

```c
JNIEXPORT void JNICALL Java_Employee_raiseSalary(JNIEnv* env, jobject this_obj,
      jdouble byPercent)
{
   /* get the class */
   jclass class_Employee = (*env)->GetObjectClass(env, this_obj);
   /* get the field ID */
   jfieldID id_salary = (*env)->GetFieldID(env, class_Employee, "salary", "D");
   /* get the field value */
   jdouble salary = (*env)->GetDoubleField(env, this_obj, id_salary);
   salary *= 1 + byPercent / 100;
   /* set the field value */
   (*env)->SetDoubleField(env, this_obj, id_salary, salary);
}
```

> **Caution (sách):** *"Class references are only valid until the native method returns. You cannot cache the return values of GetObjectClass in your code. Do not store away a class reference for reuse in a later method call. You must call GetObjectClass every time the native method executes. If this is intolerable, you can lock the reference with a call to NewGlobalRef:"*
>
> ```c
> static jclass class_X = 0;
> static jfieldID id_a;
> . . .
> if (class_X == 0)
> {
>    jclass cx = (*env)->GetObjectClass(env, obj);
>    class_X = (*env)->NewGlobalRef(env, cx);
>    id_a = (*env)->GetFieldID(env, cls, "a", ". . .");
> }
> ```
>
> *"Now you can use the class reference and field IDs in subsequent calls. When you are done using the class, make sure to call"*
>
> ```c
> (*env)->DeleteGlobalRef(env, class_X);
> ```
>
> **Dịch:** **Class reference chỉ hợp lệ cho tới khi native method return.** Bạn **không cache được giá trị trả về của `GetObjectClass`**. Đừng cất một class reference đi để dùng lại ở lời gọi method sau. Bạn **phải gọi `GetObjectClass` mỗi lần native method chạy**. Nếu không chịu nổi điều đó, bạn có thể **khoá reference lại bằng `NewGlobalRef`**. Khi dùng xong class, nhớ gọi **`DeleteGlobalRef`**.

> *"Listings 12.11 and 12.12 show the Java code for a test program and the Employee class. Listing 12.13 contains the C code for the native raiseSalary method."*

### Listing 12.11 — `employee/EmployeeTest.java`

```java
/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
public class EmployeeTest
{
    public static void main(String[] args)
    {
        var staff = new Employee[3];

        staff[0] = new Employee("Harry Hacker", 35000);
        staff[1] = new Employee("Carl Cracker", 75000);
        staff[2] = new Employee("Tony Tester", 38000);

        for (Employee e : staff)
            e.raiseSalary(5);
        for (Employee e : staff)
            e.print();
    }
}
```

### Listing 12.12 — `employee/Employee.java`

```java
/**
 * @version 1.10 1999-11-13
 * @author Cay Horstmann
 */
public class Employee
{
    private String name;
    private double salary;

    public native void raiseSalary(double byPercent);

    public Employee(String n, double s)
    {
        name = n;
        salary = s;
    }

    public void print()
    {
        System.out.println(name + " " + salary);
    }

    static
    {
        System.loadLibrary("Employee");
    }
}
```

### Listing 12.13 — `employee/Employee.c`

```c
/**
   @version 1.10 1999-11-13
   @author Cay Horstmann
*/

#include "Employee.h"

#include <stdio.h>

JNIEXPORT void JNICALL Java_Employee_raiseSalary(
   JNIEnv* env, jobject this_obj, jdouble byPercent)
{
   /* get the class */
   jclass class_Employee = (*env)->GetObjectClass(env, this_obj);

   /* get the field ID */
   jfieldID id_salary = (*env)->GetFieldID(env, class_Employee, "salary", "D");

   /* get the field value */
   jdouble salary = (*env)->GetDoubleField(env, this_obj, id_salary);

   salary *= 1 + byPercent / 100;

   /* set the field value */
   (*env)->SetDoubleField(env, this_obj, id_salary, salary);
}
```

---

## 12.4.2 Accessing Static Fields

> *"Accessing static fields is similar to accessing nonstatic fields. Use the GetStaticFieldID and GetStaticXxxField/SetStaticXxxField functions that work almost identically to their nonstatic counterparts, with two differences:"*

> *"• Since you have no object, you must use FindClass instead of GetObjectClass to obtain the class reference."*
>
> *"• You have to supply the class, not the instance object, when accessing the field."*

**Dịch:** Truy cập static field **tương tự** truy cập nonstatic field. Dùng `GetStaticFieldID` và `GetStaticXxxField`/`SetStaticXxxField`, hoạt động gần y hệt các bản nonstatic, với **hai khác biệt**:

| # | Khác biệt |
|---|---|
| 1 | Vì **không có object**, phải dùng **`FindClass`** thay cho `GetObjectClass` để lấy class reference |
| 2 | Phải cung cấp **class**, chứ không phải instance object, khi truy cập field |

> Về static field trong Java: xem [[04 - Static Fields and Methods]].

> *"For example, here is how you can get a reference to System.out:"*

```c
/* get the class */
jclass class_System = (*env)->FindClass(env, "java/lang/System");
/* get the field ID */
jfieldID id_out = (*env)->GetStaticFieldID(env, class_System, "out",
   "Ljava/io/PrintStream;");
/* get the field value */
jobject obj_out = (*env)->GetStaticObjectField(env, class_System, id_out);
```

---

## API — Accessing Fields

| API | Mô tả |
|---|---|
| `jfieldID GetFieldID(JNIEnv *env, jclass cl, const char name[], const char fieldSignature[])` | *"returns the identifier of a field in a class."* — Trả về identifier của một field trong class. |
| `Xxx GetXxxField(JNIEnv *env, jobject obj, jfieldID id)` | *"returns the value of a field. The field type Xxx is one of Object, Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Trả về giá trị của một field. |
| `void SetXxxField(JNIEnv *env, jobject obj, jfieldID id, Xxx value)` | *"sets a field to a new value. The field type Xxx is one of Object, Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Đặt field sang giá trị mới. |
| `jfieldID GetStaticFieldID(JNIEnv *env, jclass cl, const char name[], const char fieldSignature[])` | *"returns the identifier of a static field in a class."* — Trả về identifier của một static field trong class. |
| `Xxx GetStaticXxxField(JNIEnv *env, jclass cl, jfieldID id)` | *"returns the value of a static field. The field type Xxx is one of Object, Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Trả về giá trị của một static field. |
| `void SetStaticXxxField(JNIEnv *env, jclass cl, jfieldID id, Xxx value)` | *"sets a static field to a new value. The field type Xxx is one of Object, Boolean, Byte, Char, Short, Int, Long, Float, or Double."* — Đặt static field sang giá trị mới. |

---

## Bài kế tiếp

→ [[05 - Encoding Signatures]] — bảng mã hoá kiểu (`B`, `C`, `D`, `Lclassname;`...) và cách dựng signature đầy đủ của một method.
