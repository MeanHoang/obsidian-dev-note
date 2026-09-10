# 05 — Encoding Signatures

> Chapter 12, Section 12.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.5 Encoding Signatures

> *"To access instance fields and call methods defined in the Java programming language, you need to learn the rules for "mangling" the names of data types and method signatures. (A method signature describes the parameters and return type of the method.) Here is the encoding scheme:"*

**Dịch:** Để truy cập instance field và gọi method định nghĩa trong Java, bạn cần học **quy tắc "mangling" tên kiểu dữ liệu và method signature**. (Một **method signature** mô tả **parameter và kiểu trả về** của method.) Sơ đồ mã hoá như sau:

### Bảng mã hoá kiểu

| Mã | Kiểu |
|---|---|
| `B` | `byte` |
| `C` | `char` |
| `D` | `double` |
| `F` | `float` |
| `I` | `int` |
| `J` | `long` |
| `Lclassname;` | *"a class type"* — một class type |
| `S` | `short` |
| `V` | `void` |
| `Z` | `boolean` |

---

## Kiểu array

> *"To describe an array type, use a [. For example, an array of strings is"*

```
[Ljava/lang/String;
```

> *"A float[][] is mangled into"*

```
[[F
```

**Dịch:** Mô tả một array type thì **dùng `[`**. Ví dụ array của string là `[Ljava/lang/String;`; `float[][]` được mangle thành `[[F`.

> Về array trong Java: xem [[09 - Arrays]].

---

## Signature đầy đủ của method

> *"For the complete signature of a method, list the parameter types inside a pair of parentheses and then list the return type. For example, a method receiving two integers and returning an integer is encoded as"*

```
(II)I
```

**Dịch:** Với **signature đầy đủ của một method**, liệt kê **các kiểu parameter trong cặp ngoặc đơn**, rồi liệt kê **kiểu trả về**. Ví dụ method nhận hai integer và trả về một integer được mã hoá là `(II)I`.

> *"The sprint method in Section 12.3, "String Parameters," on p. 819 has a mangled signature of"*

```
(Ljava/lang/String;D)Ljava/lang/String;
```

> *"That is, the method receives a String and a double and returns a String."*

**Dịch:** Method `sprint` ở [[03 - String Parameters]] có signature đã mangle như trên — tức method **nhận một `String` và một `double`, trả về một `String`**.

> *"Note that the semicolon at the end of the L expression is the terminator of the type expression, not a separator between parameters. For example, the constructor"*

```java
Employee(java.lang.String, double, java.util.Date)
```

> *"has a signature"*

```
"(Ljava/lang/String;DLjava/util/Date;)V"
```

**Dịch:** Chú ý rằng dấu chấm phẩy cuối biểu thức `L` là **dấu kết thúc của biểu thức kiểu**, **không phải dấu ngăn giữa các parameter**.

> *"Note that there is no separator between the D and Ljava/util/Date;. Also note that in this encoding scheme, you must use / instead of . to separate the package and class names. The V at the end denotes a return type of void. Even though you don't specify a return type for constructors in Java, you need to add a V to the virtual machine signature."*

**Dịch:** Chú ý **không có dấu ngăn giữa `D` và `Ljava/util/Date;`**. Cũng chú ý là trong sơ đồ mã hoá này bạn **phải dùng `/` thay cho `.`** để ngăn tên package và tên class. Chữ **`V` ở cuối biểu thị kiểu trả về `void`**. Dù trong Java bạn không ghi kiểu trả về cho constructor, bạn **vẫn phải thêm `V`** vào virtual machine signature.

---

## Sinh signature bằng `javap -s`

> **Tip (sách):** *"You can use the javap command with option -s to generate the method signatures from class files. For example, run"*
>
> ```
> javap -s -private Employee
> ```
>
> *"You will get the following output, displaying the signatures of all fields and methods:"*
>
> ```
> Compiled from "Employee.java"
> public class Employee extends java.lang.Object{
> private java.lang.String name;
>   Signature: Ljava/lang/String;
> private double salary;
>   Signature: D
> public Employee(java.lang.String, double);
>   Signature: (Ljava/lang/String;D)V
> public native void raiseSalary(double);
>   Signature: (D)V
> public void print();
>   Signature: ()V
> static {};
>   Signature: ()V
> }
> ```
>
> **Dịch:** Bạn dùng được lệnh **`javap` với option `-s`** để sinh method signature từ file class. Output hiển thị signature của **mọi field và method**.

> **Note (sách):** *"There is no rationale whatsoever for forcing programmers to use this mangling scheme for signatures. The designers of the native calling mechanism could have just as easily written a function that reads signatures in the Java programming language style, such as void(int,java.lang.String), and encodes them into whatever internal representation they prefer. Then again, using the mangled signatures lets you partake in the mystique of programming close to the virtual machine."*
>
> **Dịch:** **Chẳng có lý lẽ nào** biện minh cho việc ép lập trình viên dùng sơ đồ mangling này cho signature. Người thiết kế cơ chế gọi native **hoàn toàn có thể viết một function đọc signature theo phong cách Java**, kiểu `void(int,java.lang.String)`, rồi mã hoá thành bất cứ biểu diễn nội bộ nào họ thích. Nhưng nói đi thì cũng phải nói lại, **dùng signature đã mangle cho bạn nếm trải cái huyền bí của việc lập trình sát virtual machine**.

---

## Bài kế tiếp

→ [[06 - Calling Java Methods]] — gọi ngược instance method, static method và constructor của Java từ native code.
