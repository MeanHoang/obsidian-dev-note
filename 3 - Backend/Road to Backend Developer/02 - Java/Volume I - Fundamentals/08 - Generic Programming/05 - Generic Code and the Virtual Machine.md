# 05 — Generic Code and the Virtual Machine

> Chapter 8, Section 8.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.5. Generic Code and the Virtual Machine

> *"The virtual machine does not have objects of generic types—all objects belong to ordinary classes. An earlier version of the generics implementation was even able to compile a program that used generics into class files that executed on 1.0 virtual machines! In the following sections, you will see how the compiler "erases" type parameters, and what implication that process has for Java programmers."*

**Dịch:** **Virtual machine không có object của generic type** — mọi object đều thuộc về **class thường**. Một phiên bản đời đầu của phần implement generic thậm chí còn compile được chương trình dùng generic thành file class **chạy được trên virtual machine 1.0**! Các section sau cho thấy compiler **"xoá" (erase) type parameter** như thế nào, và quá trình đó **có hệ quả gì** với lập trình viên Java.

---

## 8.5.1. Type Erasure

> *"Whenever you define a generic type, a corresponding raw type is automatically provided. The name of the raw type is simply the name of the generic type, with the type parameters removed. The type variables are erased and replaced by their bounding types (or Object for variables without bounds)."*

**Dịch:** Mỗi khi bạn định nghĩa một generic type, **một raw type tương ứng được tự động cung cấp**. Tên của raw type đơn giản là **tên generic type đã bỏ đi type parameter**. Các type variable **bị xoá và thay bằng bounding type của chúng** (hoặc bằng **`Object`** với biến **không có bound**).

> *"For example, the raw type for Pair\<T> looks like this:"*

```java
public class Pair
{
    private Object first;
    private Object second;

    public Pair(Object first, Object second)
    {
        this.first = first;
        this.second = second;
    }

    public Object getFirst() { return first; }
    public Object getSecond() { return second; }

    public void setFirst(Object newValue) { first = newValue; }
    public void setSecond(Object newValue) { second = newValue; }
}
```

> *"Since T is an unbounded type variable, it is simply replaced by Object. The result is an ordinary class, just as you might have implemented it before generics were added to Java."*

> *"Your programs may contain different kinds of Pair, such as Pair\<String> or Pair\<LocalDate>, but erasure turns them all into raw Pair types."*

**Dịch:** Vì `T` là **type variable không có bound**, nó đơn giản **được thay bằng `Object`**. Kết quả là một **class thường**, đúng như bạn hẳn đã implement trước khi generic được thêm vào Java. Chương trình của bạn có thể chứa nhiều loại `Pair` khác nhau như `Pair<String>` hay `Pair<LocalDate>`, nhưng **erasure biến tất cả chúng thành raw type `Pair`**.

```
Pair<String>  ─┐
Pair<LocalDate>├──  erasure  ──►  Pair   (raw type, dùng Object)
Pair<Employee>─┘
```

> **C++ Note (sách):** *"In this regard, Java generics are very different from C++ templates. C++ produces different types for each template instantiation—a phenomenon called "template code bloat." Java does not suffer from this problem."*
>
> **Dịch:** Ở khía cạnh này, generic của Java **rất khác template của C++**. C++ **sinh ra type khác nhau cho mỗi lần instantiate template** — hiện tượng gọi là **"template code bloat"**. Java **không mắc phải vấn đề này**.

### Raw type khi có bound

> *"The raw type replaces type variables with the first bound, or Object if no bounds are given. For example, the type variable in the class Pair\<T> has no explicit bounds, hence the raw type replaces T with Object. Suppose we declare a slightly different type:"*

```java
public class Interval<T extends Comparable & Serializable> implements Serializable
{
    private T lower;
    private T upper;
    . . .

    public Interval(T first, T second)
    {
        if (first.compareTo(second) <= 0) { lower = first; upper = second; }
        else { lower = second; upper = first; }
    }
}
```

> *"The raw type Interval looks like this:"*

```java
public class Interval implements Serializable
{
    private Comparable lower;
    private Comparable upper;
    . . .

    public Interval(Comparable first, Comparable second) { . . . }
}
```

**Dịch:** Raw type **thay type variable bằng bound đầu tiên**, hoặc bằng `Object` nếu **không có bound nào**. Ví dụ, type variable trong class `Pair<T>` **không có bound tường minh**, nên raw type thay `T` bằng `Object`. Với `Interval<T extends Comparable & Serializable>` thì raw type thay `T` bằng **`Comparable`** — tức **bound đầu tiên**.

> **Note (sách):** *"You may wonder what happens if you switch the bounds: class Interval<T extends Serializable & Comparable>. In that case, the raw type replaces T with Serializable, and the compiler inserts casts to Comparable when necessary. For efficiency, you should therefore put tagging interfaces (that is, interfaces without methods) at the end of the bounds list."*
>
> **Dịch:** Bạn có thể thắc mắc điều gì xảy ra nếu **đảo thứ tự bound**: `class Interval<T extends Serializable & Comparable>`. Khi đó raw type **thay `T` bằng `Serializable`**, và compiler **chèn cast sang `Comparable`** khi cần. Vì lý do **hiệu năng**, bạn nên đặt **tagging interface** (tức interface **không có method**) ở **cuối danh sách bound**.

---

## 8.5.2. Translating Generic Expressions

> *"When you program a call to a generic method, the compiler inserts casts when the return type has been erased. For example, consider the sequence of statements"*

```java
Pair<Employee> buddies = . . .;
Employee buddy = buddies.getFirst();
```

> *"The erasure of getFirst has return type Object. The compiler automatically inserts the cast to Employee. That is, the compiler translates the method call into two virtual machine instructions:"*

> *"A call to the raw method Pair.getFirst"*
> *"A cast of the returned Object to the type Employee"*

**Dịch:** Khi bạn viết một lời gọi tới generic method, **compiler chèn cast** vào chỗ **return type đã bị erase**. Erasure của `getFirst` có return type là **`Object`**. Compiler **tự động chèn cast sang `Employee`**. Tức là compiler dịch lời gọi method thành **hai lệnh của virtual machine**:

| # | Lệnh |
|---|---|
| 1 | Gọi **raw method** `Pair.getFirst` |
| 2 | **Cast** `Object` trả về sang type `Employee` |

> *"Casts are also inserted when you access a generic field. Suppose the first and second fields of the Pair class were public. (Not a good programming style, perhaps, but it is legal Java.) Then the expression"*

```java
Employee buddy = buddies.first;
```

> *"also has a cast inserted in the resulting bytecodes."*

**Dịch:** Cast **cũng được chèn khi bạn truy cập một generic field**. Giả sử field `first` và `second` của class `Pair` là `public` (có lẽ **không phải phong cách lập trình tốt**, nhưng **là Java hợp lệ**). Khi đó biểu thức trên **cũng có một cast được chèn vào bytecode kết quả**.

---

## 8.5.3. Translating Generic Methods

> *"Type erasure also happens for generic methods. Programmers usually think of a generic method such as"*

```java
public static <T extends Comparable> T min(T[] a)
```

> *"as a whole family of methods, but after erasure, only a single method is left:"*

```java
public static Comparable min(Comparable[] a)
```

> *"Note that the type parameter T has been erased, leaving only its bounding type Comparable."*

**Dịch:** Type erasure **cũng xảy ra với generic method**. Lập trình viên thường nghĩ về một generic method như trên là **cả một họ method**, nhưng **sau erasure chỉ còn lại một method duy nhất**. Type parameter `T` **đã bị xoá**, **chỉ còn lại bounding type `Comparable`**.

### Bridge method

> *"Erasure of methods brings up a couple of complexities. Consider this example:"*

```java
class DateInterval extends Pair<LocalDate>
{
    public void setSecond(LocalDate second)
    {
        if (second.compareTo(getFirst()) >= 0)
            super.setSecond(second);
    }
    . . .
}
```

> *"A date interval is a pair of LocalDate objects, and we'll want to override the methods to ensure that the second value is never smaller than the first. This class is erased to"*

```java
class DateInterval extends Pair // after erasure
{
    public void setSecond(LocalDate second) { . . . }
    . . .
}
```

**Dịch:** Erasure của method **sinh ra vài chỗ rắc rối**. Một `DateInterval` là một cặp object `LocalDate`, và ta muốn **override method để đảm bảo giá trị thứ hai không bao giờ nhỏ hơn giá trị thứ nhất**. Class này bị **erase** thành dạng trên.

> *"Perhaps surprisingly, there is another setSecond method, inherited from Pair, namely"*

```java
public void setSecond(Object second)
```

> *"This is clearly a different method because it has a parameter of a different type—Object instead of LocalDate. But it shouldn't be different. Consider this sequence of statements:"*

```java
var interval = new DateInterval(. . .);
Pair<LocalDate> pair = interval; // OK--assignment to superclass
pair.setSecond(aDate);
```

**Dịch:** Có lẽ hơi bất ngờ: **còn một method `setSecond` khác nữa**, thừa hưởng từ `Pair`, đó là `setSecond(Object)`. Rõ ràng đây là **một method khác**, vì parameter có type khác — `Object` thay vì `LocalDate`. **Nhưng lẽ ra nó không nên khác.**

> *"Our expectation is that the call to setSecond is polymorphic and that the appropriate method is called. Since pair refers to a DateInterval object, that should be DateInterval.setSecond. The problem is that the type erasure interferes with polymorphism. To fix this problem, the compiler generates a bridge method in the DateInterval class:"*

```java
public void setSecond(Object second) { setSecond((LocalDate) second); }
```

**Dịch:** Ta mong lời gọi `setSecond` là **polymorphic** và method phù hợp được gọi. Vì `pair` trỏ tới một object `DateInterval`, method đó phải là `DateInterval.setSecond`. Vấn đề là **type erasure cản trở polymorphism**. Để sửa, **compiler sinh ra một bridge method** trong class `DateInterval`.

> *"To see why this works, let us carefully follow the execution of the statement"*

```java
pair.setSecond(aDate)
```

> *"The variable pair has declared type Pair\<LocalDate>, and that type only has a single method called setSecond, namely setSecond(Object). The virtual machine calls that method on the object to which pair refers. That object is of type DateInterval. Therefore, the method DateInterval.setSecond(Object) is called. That method is the synthesized bridge method. It calls DateInterval.setSecond(LocalDate), which is what we want."*

**Dịch:** Biến `pair` có type khai báo là `Pair<LocalDate>`, và type đó **chỉ có một method tên `setSecond`**, tức `setSecond(Object)`. Virtual machine gọi method đó lên object mà `pair` trỏ tới. Object đó có type `DateInterval`. Do đó method **`DateInterval.setSecond(Object)`** được gọi — đó chính là **bridge method được sinh ra**. Nó gọi tiếp **`DateInterval.setSecond(LocalDate)`**, đúng thứ ta muốn.

```
pair.setSecond(aDate)
      │  pair khai báo Pair<LocalDate> → chỉ thấy setSecond(Object)
      ▼
DateInterval.setSecond(Object)      ← bridge method (compiler sinh)
      │  setSecond((LocalDate) second)
      ▼
DateInterval.setSecond(LocalDate)   ← method ta viết
```

### Bridge method còn lạ hơn nữa

> *"Bridge methods can get even stranger. Suppose the DateInterval class also overrides the getSecond method:"*

```java
class DateInterval extends Pair<LocalDate>
{
    public LocalDate getSecond() { return (LocalDate) super.getSecond(); }
    . . .
}
```

> *"In the DateInterval class, there are two getSecond methods:"*

```java
LocalDate getSecond() // defined in DateInterval
Object getSecond() // overrides the method defined in Pair to call the first method
```

> *"You could not write Java code like that; it would be illegal to have two methods with the same parameter types—here, with no parameters. However, in the virtual machine, the parameter types and the return type specify a method. Therefore, the compiler can produce bytecodes for two methods that differ only in their return type, and the virtual machine will handle this situation correctly."*

**Dịch:** Bridge method **còn có thể lạ hơn nữa**. Trong class `DateInterval` khi đó **có hai method `getSecond`**. Bạn **không viết được code Java như vậy**: có hai method **cùng kiểu parameter** (ở đây là **không có parameter**) là **bất hợp lệ**. Tuy nhiên, **trong virtual machine, một method được xác định bởi kiểu parameter VÀ return type**. Do đó compiler **sinh được bytecode cho hai method chỉ khác nhau ở return type**, và virtual machine **xử lý đúng tình huống này**.

> **Note (sách):** *"Bridge methods are not limited to generic types. You already saw in Chapter 5 that it is legal for a method to specify a more restrictive return type when overriding another method. For example:"*
>
> ```java
> public class Employee implements Cloneable
> {
>     public Employee clone() throws CloneNotSupportedException { . . . }
> }
> ```
>
> *"The Object.clone and Employee.clone methods are said to have covariant return types."*
>
> *"Actually, the Employee class has two clone methods:"*
>
> ```java
> Employee clone() // defined above
> Object clone() // synthesized bridge method, overrides Object.clone
> ```
>
> *"The synthesized bridge method calls the newly defined method."*
>
> **Dịch:** Bridge method **không chỉ giới hạn ở generic type**. Ở Chapter 5 bạn đã thấy rằng một method **được phép chỉ định return type hạn chế hơn** khi override method khác. `Object.clone` và `Employee.clone` được nói là có **covariant return type**. Thật ra class `Employee` có **hai method `clone`**, và **bridge method được sinh ra sẽ gọi method mới định nghĩa**.

Xem [[02 - Object The Cosmic Superclass]].

### Tóm tắt cách Java dịch generic

> *"In summary, you need to remember these facts about translation of Java generics:"*

> *"There are no generics in the virtual machine, only ordinary classes and methods."*
> *"All type parameters are replaced by their bounds."*
> *"Bridge methods are synthesized to preserve polymorphism."*
> *"Casts are inserted as necessary to preserve type safety."*

**Dịch:**

| # | Sự thật cần nhớ |
|---|---|
| 1 | **Không có generic trong virtual machine**, chỉ có class và method thường |
| 2 | **Mọi type parameter được thay bằng bound của chúng** |
| 3 | **Bridge method được sinh ra để giữ polymorphism** |
| 4 | **Cast được chèn vào khi cần để giữ type safety** |

---

## 8.5.4. Calling Legacy Code

> *"When Java generics were designed, a major goal was to allow interoperability between generics and legacy code. Let us look at a concrete example of such legacy. The Swing user interface toolkit provides a JSlider class whose "ticks" can be customized with labels that contain text or images. The labels are set with the call"*

```java
void setLabelTable(Dictionary table)
```

> *"The Dictionary class maps integers to labels. Before Java 5, that class was implemented as a map of Object instances. Java 5 made Dictionary into a generic class, but JSlider was never updated. At this point, Dictionary without type parameters is a raw type. This is where compatibility comes in."*

**Dịch:** Khi generic của Java được thiết kế, một mục tiêu lớn là cho phép **generic và legacy code phối hợp được với nhau**. Toolkit giao diện Swing cung cấp class `JSlider` mà các "tick" của nó có thể tuỳ biến bằng label chứa text hoặc ảnh. Class `Dictionary` **ánh xạ số nguyên tới label**. Trước Java 5, class đó được implement như một map các instance `Object`. **Java 5 biến `Dictionary` thành generic class, nhưng `JSlider` chưa bao giờ được cập nhật.** Tới đây, `Dictionary` **không có type parameter là một raw type**. Đây chính là chỗ **tính tương thích** phát huy vai trò.

> *"When you populate the dictionary, you can use the generic type."*

```java
Dictionary<Integer, Component> labelTable = new Hashtable<>();
labelTable.put(0, new JLabel(new ImageIcon("nine.png")));
labelTable.put(20, new JLabel(new ImageIcon("ten.png")));
. . .
```

> *"When you pass the Dictionary<Integer, Component> object to setLabelTable, the compiler issues a warning."*

```java
slider.setLabelTable(labelTable); // warning
```

> *"After all, the compiler has no assurance about what the setLabelTable might do to the Dictionary object. That method might replace all the keys with strings. That breaks the guarantee that the keys have type Integer, and future operations may cause class cast exceptions."*

**Dịch:** Khi bạn đổ dữ liệu vào dictionary, bạn **dùng được generic type**. Khi bạn truyền object `Dictionary<Integer, Component>` cho `setLabelTable`, compiler **phát ra warning**. Dù sao thì compiler **không có gì đảm bảo về việc `setLabelTable` sẽ làm gì** với object `Dictionary`. Method đó **có thể thay hết key bằng string**. Điều đó **phá vỡ bảo đảm rằng key có type `Integer`**, và các thao tác sau này **có thể gây class cast exception**.

> *"You should ponder it and ask what the JSlider is actually going to do with this Dictionary object. In our case, it is pretty clear that the JSlider only reads the information, so you can ignore the warning."*

**Dịch:** Bạn nên **cân nhắc và tự hỏi `JSlider` thực sự sẽ làm gì** với object `Dictionary` này. Trong trường hợp của ta, khá rõ ràng là `JSlider` **chỉ đọc thông tin**, nên **bỏ qua warning được**.

> *"Now consider the opposite case, in which you get an object of a raw type from a legacy class. You can assign it to a variable whose type uses generics, but of course you will get a warning. For example:"*

```java
Dictionary<Integer, Components> labelTable = slider.getLabelTable(); // warning
```

> *"That's OK—review the warning and make sure that the label table really contains Integer and Component objects. Of course, there never is an absolute guarantee. A malicious coder might have installed a different Dictionary in the slider. But again, the situation is no worse than it was before generics. In the worst case, your program will throw an exception."*

**Dịch:** Giờ xét **trường hợp ngược lại**: bạn nhận về một object thuộc **raw type** từ một legacy class. Bạn **gán được nó vào một biến có type dùng generic**, nhưng dĩ nhiên sẽ **nhận warning**. Thế cũng ổn — **hãy xem lại warning và chắc chắn rằng label table thực sự chứa object `Integer` và `Component`**. Dĩ nhiên **không bao giờ có bảo đảm tuyệt đối**: một kẻ viết code ác ý có thể đã cài một `Dictionary` khác vào slider. Nhưng một lần nữa, **tình hình không tệ hơn thời trước khi có generic**. **Tệ nhất thì chương trình ném ra exception.**

Xem [[02 - Catching Exceptions]].

### `@SuppressWarnings`

> *"After you are done pondering the warning, you can use an annotation to make it disappear. You can annotate a local variable:"*

```java
@SuppressWarnings("unchecked")
Dictionary<Integer, Components> labelTable = slider.getLabelTable(); // no warning
```

> *"Or you can annotate an entire method, like this:"*

```java
@SuppressWarnings("unchecked")
public void configureSlider() { . . . }
```

> *"This annotation turns off checking for all code inside the method."*

**Dịch:** Sau khi cân nhắc xong warning, bạn dùng được một **annotation để làm nó biến mất**. Bạn **annotate được một local variable**, hoặc **annotate cả một method**. Annotation này **tắt việc kiểm tra cho toàn bộ code bên trong method**.

---

## 8.5.5. Generic Record Patterns

> *"Let us make our Pair class into a record:"*

```java
record Pair<T>(T first, T second) {}
```

> *"Now you can form a record pattern with the generic record:"*

```java
var p = new Pair<String>("Hello", "World");
if (p instanceof Pair(var a, var b)) System.out.println(a + " " + b.toUpperCase());
```

> *"In the pattern, the type argument is inferred—here, as Pair\<String>. You can also specify it explicitly:"*

```java
p instanceof Pair<String>(var a, var b)
```

> *"or"*

```java
p instanceof Pair<String>(String a, String b)
```

**Dịch:** Hãy biến class `Pair` thành một **record** — xem [[07 - Records]]. Giờ bạn **tạo được record pattern với generic record**. Trong pattern, **type argument được suy ra** — ở đây là `Pair<String>`. Bạn cũng **chỉ định tường minh được**.

> *"In this example, the generic record pattern is used in an instanceof expression. You can also use them inside switch. See Section 8.8.12 for an example."*

**Dịch:** Trong ví dụ này, generic record pattern được dùng trong một **biểu thức `instanceof`**. Bạn cũng **dùng được chúng bên trong `switch`**. Xem ví dụ ở Section 8.8.12 — [[08 - Restrictions and Limitations]].

---

## Bài kế tiếp

→ [[06 - Inheritance Rules for Generic Types]] — vì sao `Pair<Manager>` không phải subtype của `Pair<Employee>`, và khác biệt với array.
