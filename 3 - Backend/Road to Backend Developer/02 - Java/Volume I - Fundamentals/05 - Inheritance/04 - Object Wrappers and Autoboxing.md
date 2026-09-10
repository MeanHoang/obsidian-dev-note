# 04 — Object Wrappers and Autoboxing

> Chapter 5, Section 5.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.4. Object Wrappers and Autoboxing

> *"Occasionally, you need to convert a primitive type like int to an object. All primitive types have class counterparts. For example, a class Integer corresponds to the primitive type int. These kinds of classes are usually called wrappers. The wrapper classes have obvious names: Integer, Long, Float, Double, Short, Byte, Character, and Boolean. (The first six inherit from the common superclass Number.) The wrapper classes are immutable—you cannot change a wrapped value after the wrapper has been constructed. They are also final, so you cannot subclass them."*

**Dịch:** Thỉnh thoảng bạn cần **chuyển một [[02 - Data Types|primitive type]] như `int` thành object**. **Mọi primitive type đều có class đối ứng** — ví dụ class `Integer` ứng với primitive type `int`. Loại class này thường được gọi là **wrapper**. Tên các wrapper class **rõ ràng**: `Integer`, `Long`, `Float`, `Double`, `Short`, `Byte`, `Character`, `Boolean`. (**Sáu cái đầu kế thừa từ superclass chung `Number`**.) Wrapper class là **immutable** — **không đổi được giá trị đã gói sau khi wrapper được dựng**. Chúng cũng **`final`**, nên **không tạo subclass được**.

> *"Suppose we want an array list of integers. Unfortunately, the type argument inside the angle brackets cannot be a primitive type. It is not possible to form an ArrayList<int>. Here, the Integer wrapper class comes in. It is OK to declare an array list of Integer objects."*

```java
var list = new ArrayList<Integer>();
```

**Dịch:** Giả sử ta muốn một [[03 - Generic Array Lists|array list]] chứa số nguyên. Tiếc là **type argument trong ngoặc nhọn không được là primitive type** — **không tạo được `ArrayList<int>`**. Đây là chỗ **wrapper class `Integer`** vào cuộc: **khai báo một array list chứa object `Integer` thì được**.

> **Caution (sách):** *"An ArrayList<Integer> is far less efficient than an int[] array because each value is separately wrapped inside an object. You would only want to use this construct for small collections when programmer convenience is more important than efficiency."*
>
> **Dịch:** `ArrayList<Integer>` **kém hiệu quả hơn nhiều so với mảng `int[]`** vì **mỗi giá trị được gói riêng trong một object**. Bạn chỉ nên dùng cấu trúc này cho **collection nhỏ**, khi **sự tiện lợi của lập trình viên quan trọng hơn hiệu năng**.

> *"Fortunately, there is a useful feature that makes it easy to add an element of type int to an ArrayList<Integer>. The call"*

```java
list.add(3);
```

> *"is automatically translated to"*

```java
list.add(Integer.valueOf(3));
```

> *"This conversion is called autoboxing."*

**Dịch:** May thay, có một tính năng hữu ích khiến việc **thêm phần tử kiểu `int` vào `ArrayList<Integer>`** trở nên dễ dàng: lời gọi `list.add(3)` **được tự động dịch thành** `list.add(Integer.valueOf(3))`. Phép chuyển đổi này gọi là **autoboxing**.

> **Note (sách):** *"You might think that autowrapping would be more consistent, but the "boxing" metaphor was taken from C#."*
>
> **Dịch:** Bạn có thể nghĩ **"autowrapping" thì nhất quán hơn**, nhưng **hình ảnh ẩn dụ "boxing" được mượn từ C#**.

> *"Conversely, when you assign an Integer object to an int value, it is automatically unboxed. That is, the compiler translates"*

```java
int n = list.get(i);
```

> *"into"*

```java
int n = list.get(i).intValue();
```

**Dịch:** Ngược lại, khi bạn **gán một object `Integer` cho một giá trị `int`**, nó **tự động được unbox**.

> *"Automatic boxing and unboxing even works with arithmetic expressions. For example, you can apply the increment operator to a wrapper reference:"*

```java
Integer n = 3;
n++;
```

> *"The compiler automatically inserts instructions to unbox the object, increment the resulting value, and box it back."*

**Dịch:** Boxing/unboxing tự động **hoạt động cả với biểu thức số học**: bạn áp dụng được [[04 - Operators|toán tử tăng]] lên một wrapper reference. Compiler **tự chèn các lệnh để unbox object, tăng giá trị thu được, rồi box lại**.

> *"In most cases, you get the illusion that the primitive types and their wrappers are one and the same. There is just one point in which they differ considerably: identity. As you know, the == operator, applied to wrapper objects, only tests whether the objects have identical memory locations. The following comparison would therefore probably fail:"*

```java
Integer a = 1000;
Integer b = 1000;
if (a == b) . . .
```

> *"However, a Java implementation may, if it chooses, wrap commonly occurring values into identical objects, and thus the comparison might succeed. This ambiguity is not what you want. The remedy is to call the equals method when comparing wrapper objects."*

**Dịch:** Phần lớn trường hợp, bạn có **ảo giác rằng primitive type và wrapper của nó là một**. Chỉ có **một điểm khác biệt đáng kể: identity**. Toán tử `==` áp lên wrapper object **chỉ kiểm tra hai object có cùng vị trí bộ nhớ hay không**, nên phép so sánh trên **nhiều khả năng thất bại**. Tuy nhiên một bản cài đặt Java **có thể, nếu muốn, gói các giá trị hay gặp vào cùng object**, và khi đó **phép so sánh lại thành công**. **Sự mập mờ này không phải điều bạn muốn.** Cách chữa: **gọi method [[02 - Object The Cosmic Superclass|`equals`]] khi so sánh wrapper object**.

> **Note (sách):** *"The autoboxing specification requires that boolean, byte, char <= 127, short, and int between -128 and 127 are wrapped into fixed objects. For example, if a and b had been initialized with 100 in the preceding example, then the comparison would have had to succeed."*
>
> **Dịch:** Đặc tả autoboxing **yêu cầu** rằng `boolean`, `byte`, `char <= 127`, `short`, và `int` **trong khoảng -128 đến 127** được **gói vào các object cố định**. Ví dụ nếu `a` và `b` ở trên được khởi tạo bằng **100** thì phép so sánh **buộc phải thành công**.

> **Tip (sách):** *"Never rely on the identity of wrapper objects. Don't compare them with == and don't use them as locks (see Chapter 10)."*
>
> *"Don't use the wrapper class constructors. They are deprecated and scheduled for removal. For example, use Integer.valueOf(1000), never new Integer(1000). Or, simply rely on autoboxing: Integer a = 1000."*
>
> **Dịch:** **Đừng bao giờ dựa vào identity của wrapper object.** **Đừng so sánh chúng bằng `==`** và **đừng dùng chúng làm lock** (xem chương 10). **Đừng dùng constructor của wrapper class** — chúng **đã deprecated và được lên lịch gỡ bỏ**. Hãy dùng `Integer.valueOf(1000)`, **không bao giờ** `new Integer(1000)`. Hoặc **cứ dựa vào autoboxing**: `Integer a = 1000`.

> *"There are a couple of other subtleties about autoboxing. First off, since wrapper class references can be null, it is possible for autounboxing to throw a NullPointerException:"*

```java
Integer n = null;
System.out.println(2 * n); // throws NullPointerException
```

**Dịch:** Còn vài điểm tinh tế khác về autoboxing. Thứ nhất, vì **wrapper class reference có thể là `null`**, việc **auto-unboxing có thể ném [[03 - Defining Your Own Classes|`NullPointerException`]]**.

> *"Also, if you mix Integer and Double types in a conditional expression, then the Integer value is unboxed, promoted to double, and boxed into a Double:"*

```java
Integer n = 1;
Double x = 2.0;
System.out.println(true ? n : x); // prints 1.0
```

**Dịch:** Ngoài ra, nếu bạn **trộn kiểu `Integer` và `Double` trong một biểu thức điều kiện** thì giá trị `Integer` **được unbox, thăng cấp lên `double`, rồi box thành `Double`**.

> *"Finally, let us emphasize that boxing and unboxing is a courtesy of the compiler, not the virtual machine. The compiler inserts the necessary calls when it generates the bytecodes of a class. The virtual machine simply executes those bytecodes."*

**Dịch:** Cuối cùng, cần nhấn mạnh: **boxing và unboxing là "phép lịch sự" của compiler, không phải của virtual machine**. Compiler **chèn các lời gọi cần thiết khi sinh bytecode** của một class; **virtual machine chỉ đơn giản thực thi các bytecode đó**.

> **Preview Note (sách):** *"A future version of Java will allow value types, user-defined types that are like primitive types—with values that are not stored inside objects. For example, a value of a primitive type Point with double fields x and y is simply a 16-byte block in memory, with two adjacent double values. You can copy it, but you can't have a reference to it."*
>
> *"It is planned that at some point, the primitive wrapper classes will become value classes."*
>
> **Dịch:** Một phiên bản Java **trong tương lai sẽ cho phép value type** — kiểu do người dùng định nghĩa **giống primitive type**, với **giá trị không được lưu bên trong object**. Ví dụ giá trị của một primitive type `Point` với hai field `double` là `x` và `y` **đơn giản là một khối 16 byte trong bộ nhớ**, gồm **hai giá trị `double` nằm kề nhau**. Bạn **copy được nó**, nhưng **không có reference tới nó**. Dự kiến tới lúc nào đó, **các wrapper class của primitive sẽ trở thành value class**.

> *"You will often see the number wrappers for another reason. The designers of Java found the wrappers a convenient place to put certain basic methods, such as those for converting strings of digits to numbers."*

> *"To convert a string to an integer, use the following statement:"*

```java
int x = Integer.parseInt(s);
```

> *"This has nothing to do with Integer objects—parseInt is a static method. But the Integer class was a good place to put it."*

**Dịch:** Bạn còn hay gặp các number wrapper **vì một lý do khác**: người thiết kế Java thấy wrapper là **chỗ tiện lợi để đặt một số method cơ bản**, chẳng hạn method **chuyển chuỗi chữ số thành số**. Việc này **chẳng liên quan gì tới object `Integer`** — `parseInt` là một [[04 - Static Fields and Methods|static method]]. Nhưng class `Integer` **là chỗ tốt để đặt nó**.

> **Caution (sách):** *"The parseInt method and its analog parseDouble are not intended for parsing user input. They support a specific format, described in the Java API, that is similar to the format of decimal Java literals, but without embedded underscores. To parse human input, use a Scanner. Its nextInt and nextDouble methods use the current locale, or a locale that you specify, so that users to can enter the digits and separators to which they are accustomed."*
>
> **Dịch:** `parseInt` và người anh em `parseDouble` **không dành để phân tích dữ liệu người dùng nhập**. Chúng hỗ trợ **một định dạng cụ thể** mô tả trong Java API, **giống định dạng của literal thập phân trong Java** nhưng **không có dấu gạch dưới xen giữa**. Để **phân tích dữ liệu con người nhập**, dùng **`Scanner`**: method `nextInt` và `nextDouble` của nó **dùng locale hiện tại** (hoặc locale bạn chỉ định), để người dùng **nhập chữ số và dấu phân cách theo thói quen của họ**.

> *"The API notes show some of the more important methods of the Integer class. The other number classes implement corresponding methods."*

**Dịch:** Phần API dưới đây nêu **một số method quan trọng hơn của class `Integer`**. **Các class số khác cài các method tương ứng.**

> *"The wrapper classes also define constants. For all integral wrapper types, MIN_VALUE and MAX_VALUE are the smallest and largest value of the type. For example, Integer.MIN_VALUE is -2147483648, and Integer.MAX_VALUE is 2147483647. Here is a typical example:"*

```java
int largest = Integer.MIN_VALUE; // Replaced with first input
while (in.hasNextInt()) largest = Math.max(largest, in.nextInt());
```

**Dịch:** Wrapper class cũng **định nghĩa [[03 - Variables and Constants|hằng số]]**. Với mọi wrapper kiểu nguyên, **`MIN_VALUE` và `MAX_VALUE` là giá trị nhỏ nhất và lớn nhất của kiểu đó**. Ví dụ `Integer.MIN_VALUE` là **-2147483648**, `Integer.MAX_VALUE` là **2147483647**.

> **Caution (sách):** *"The MIN_VALUE constant of the Double and Float classes is the smallest positive value. If you want to compute the largest floating-point number and there may be negative inputs, you need to use:"*
>
> ```java
> int largest = -Double.MAX_VALUE; // Do NOT use Double.MIN_VALUE
> while (in.hasNextDouble()) largest = Math.max(largest, in.nextDouble());
> ```
>
> **Dịch:** Hằng `MIN_VALUE` của class `Double` và `Float` là **giá trị dương nhỏ nhất**. Nếu muốn tính **số dấu phẩy động lớn nhất** mà **đầu vào có thể âm**, bạn phải dùng **`-Double.MAX_VALUE`**, **KHÔNG dùng `Double.MIN_VALUE`**.

> **Caution (sách):** *"Some people think that the wrapper classes can be used to implement methods that can modify numeric parameters. However, that is not correct. Recall from Chapter 4 that it is impossible to write a Java method that increments an integer parameter because parameters to Java methods are always passed by value."*
>
> ```java
> public static void triple(int x) // won't work
> {
>     x = 3 * x; // modifies local variable
> }
> ```
>
> *"Could we overcome this by using an Integer instead of an int?"*
>
> ```java
> public static void triple(Integer x) // won't work
> {
>     . . .
> }
> ```
>
> *"The problem is that Integer objects are immutable: The information contained inside the wrapper can't change. You cannot use these wrapper classes to create a method that modifies numeric parameters."*
>
> **Dịch:** Có người nghĩ wrapper class **dùng được để viết method sửa được parameter kiểu số**. **Không đúng.** Nhớ từ chương 4 rằng **không thể viết một method Java tăng giá trị của một parameter số nguyên**, vì [[05 - Method Parameters|parameter của method Java luôn được truyền theo giá trị]]. Dùng `Integer` thay `int` có khắc phục được không? **Không**: vấn đề là **object `Integer` là immutable** — **thông tin bên trong wrapper không đổi được**. **Bạn không dùng các wrapper class này để tạo method sửa parameter kiểu số được.**

## API — `java.lang.Integer` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int intValue()` | Trả về **giá trị của object `Integer` này dưới dạng `int`** (**override method `intValue` trong class `Number`**). |
| `static String toString(int i)` | Trả về **object `String` mới biểu diễn số `i` ở cơ số 10**. |
| `static String toString(int i, int radix)` | Cho phép trả về **biểu diễn của số `i` ở cơ số chỉ định bởi parameter `radix`**. |
| `static int parseInt(String s)`<br>`static int parseInt(String s, int radix)` | Trả về **số nguyên có các chữ số chứa trong chuỗi `s`**. Chuỗi **phải biểu diễn một số nguyên ở cơ số 10** (method thứ nhất) hoặc **ở cơ số cho bởi `radix`** (method thứ hai). |
| `static Integer valueOf(String s)`<br>`static Integer valueOf(String s, int radix)` | Trả về **object `Integer` mới** được khởi tạo bằng số nguyên có các chữ số chứa trong chuỗi `s`. Chuỗi **phải biểu diễn số nguyên ở cơ số 10** (method thứ nhất) hoặc **ở cơ số cho bởi `radix`** (method thứ hai). |

## API — `java.text.NumberFormat` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Number parse(String s)` | Trả về **giá trị số**, giả định rằng **`String` chỉ định biểu diễn một con số**. |

---

## Bài kế tiếp

→ [[05 - Methods with a Variable Number of Arguments]] — method "varargs" nhận số lượng argument tuỳ ý, như `printf`.
