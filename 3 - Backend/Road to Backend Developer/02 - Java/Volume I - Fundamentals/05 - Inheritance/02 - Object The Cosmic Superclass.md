# 02 — Object: The Cosmic Superclass

> Chapter 5, Section 5.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.2. Object: The Cosmic Superclass

> *"The Object class is the ultimate ancestor—every class in Java extends Object. However, you never have to write"*

```java
public class Employee extends Object
```

> *"The ultimate superclass Object is taken for granted if no superclass is explicitly mentioned. Since every class in Java extends Object, it is important to be familiar with the services provided by the Object class. I go over the basic ones in this chapter; consult the later chapters or view the online documentation for what is not covered here. (Several methods of Object come up only when dealing with concurrency—see Chapter 10.)"*

**Dịch:** Class `Object` là **tổ tiên tối thượng** — **mọi class trong Java đều extend `Object`**. Nhưng bạn **không bao giờ phải viết** dòng trên: superclass tối thượng `Object` **được mặc định** nếu không nhắc tường minh superclass nào. Vì mọi class Java đều extend `Object`, cần **quen thuộc với các dịch vụ mà `Object` cung cấp**. (Vài method của `Object` chỉ xuất hiện khi làm việc với concurrency — xem chương 10.)

---

## 5.2.1. Variables of Type Object

> *"You can use a variable of type Object to refer to objects of any type:"*

```java
Object obj = new Employee("Harry Hacker", 35000);
```

> *"Of course, a variable of type Object is only useful as a generic holder for arbitrary values. To do anything specific with the value, you need to have some knowledge about the original type and apply a cast:"*

```java
Employee e = (Employee) obj;
```

**Dịch:** Bạn dùng được **biến kiểu `Object` để trỏ tới object của bất kỳ kiểu nào**. Dĩ nhiên biến kiểu `Object` **chỉ hữu ích như một cái hộp chung** chứa giá trị tuỳ ý. Muốn **làm gì cụ thể** với giá trị đó, bạn cần **biết chút ít về kiểu gốc** và áp dụng một [[01 - Classes, Superclasses, and Subclasses|cast]].

> *"In Java, only the values of primitive types (numbers, characters, and boolean values) are not objects."*

**Dịch:** Trong Java, **chỉ giá trị của [[02 - Data Types|primitive type]]** (số, ký tự, giá trị boolean) là **không phải object**.

> *"All array types, no matter whether they are arrays of objects or arrays of primitive types, are class types that extend the Object class."*

```java
Employee[] staff = new Employee[10];
obj = staff; // OK
obj = new int[10]; // OK
```

**Dịch:** **Mọi kiểu [[09 - Arrays|array]]** — dù là mảng object hay mảng primitive type — đều là **class type extend `Object`**.

> **C++ Note (sách):** *"In C++, there is no cosmic root class. However, every pointer can be converted to a void* pointer."*
>
> **Dịch:** C++ **không có class gốc vũ trụ**. Nhưng **mọi pointer chuyển được thành pointer `void*`**.

---

## 5.2.2. The equals Method

> *"The equals method in the Object class tests whether one object is considered equal to another. The equals method, as implemented in the Object class, determines whether two object references are identical. This is a pretty reasonable default—if two objects are identical, they should certainly be equal. For quite a few classes, nothing else is required. For example, it makes little sense to compare two PrintStream objects for equality. However, you will often want to implement state-based equality testing, in which two objects are considered equal when they have the same state."*

**Dịch:** Method `equals` trong class `Object` **kiểm tra một object có được coi là bằng một object khác không**. Bản `equals` cài trong `Object` xác định **hai object reference có đồng nhất (identical) hay không**. Đây là **mặc định khá hợp lý**: nếu hai object đồng nhất thì chắc chắn chúng bằng nhau. Với **khá nhiều class thì thế là đủ** — chẳng hạn so sánh bằng nhau giữa hai object `PrintStream` **chẳng mấy ý nghĩa**. Nhưng bạn thường sẽ muốn cài **kiểm tra bằng nhau dựa trên state**: hai object được coi là bằng nhau **khi chúng có cùng state**.

> *"For example, let us consider two employees equal if they have the same name, salary, and hire date. (In an actual employee database, it would be more sensible to compare IDs instead. I use this example to demonstrate the mechanics of implementing the equals method.)"*

```java
public class Employee
{
    . . .
    public boolean equals(Object otherObject)
    {
        // a quick test to see if the objects are identical
        if (this == otherObject) return true;

        // must return false if the explicit parameter is null
        if (otherObject == null) return false;

        // if the classes don't match, they can't be equal
        if (getClass() != otherObject.getClass()) return false;

        // now we know otherObject is a non-null Employee
        Employee other = (Employee) otherObject;

        // test whether the fields have identical values
        return name.equals(other.name)
            && salary == other.salary
            && hireDay.equals(other.hireDay);
    }
}
```

**Dịch:** Ví dụ: coi hai employee bằng nhau nếu **cùng name, salary và hire date**. (Trong một cơ sở dữ liệu nhân sự thật thì **so sánh ID hợp lý hơn**; ví dụ này chỉ để minh hoạ **cơ chế cài `equals`**.)

> *"The getClass method returns the class of an object—we discuss this method in detail later in this chapter. In our test, two objects can only be equal when they belong to the same class."*

**Dịch:** Method `getClass` **trả về class của một object** — bàn kỹ ở [[10 - Reflection|phần sau chương này]]. Trong phép kiểm tra trên, **hai object chỉ bằng nhau khi chúng thuộc cùng một class**.

> **Tip (sách):** *"To guard against the possibility that name or hireDay are null, use the Objects.equals method. The value of Objects.equals(a, b) is true if both arguments are null, false if only one is null, and a.equals(b) otherwise. With that method, the last statement of the Employee.equals method becomes"*
>
> ```java
> return Objects.equals(name, other.name)
>     && salary == other.salary
>     && Objects.equals(hireDay, other.hireDay);
> ```
>
> **Dịch:** Để **phòng khả năng `name` hoặc `hireDay` là `null`**, dùng method `Objects.equals`. Giá trị của `Objects.equals(a, b)` là **`true` nếu cả hai argument đều `null`**, **`false` nếu chỉ một cái `null`**, và **`a.equals(b)` trong các trường hợp còn lại**.

> *"When you define the equals method for a subclass, first call equals on the superclass. If that test doesn't pass, then the objects can't be equal. If the superclass fields are equal, you are ready to compare the instance fields of the subclass."*

```java
public class Manager extends Employee
{
    . . .
    public boolean equals(Object otherObject)
    {
        if (!super.equals(otherObject)) return false;
        // super.equals checked that this and otherObject belong to the same class
        Manager other = (Manager) otherObject;
        return bonus == other.bonus;
    }
}
```

**Dịch:** Khi định nghĩa `equals` cho một subclass, **trước hết gọi `equals` của superclass**. Nếu phép kiểm tra đó **không qua** thì hai object **không thể bằng nhau**. Nếu các field của superclass bằng nhau, bạn **sẵn sàng so sánh instance field của subclass**.

> **Note (sách):** *"Recall from Chapter 4 that a record is a special form of an immutable class whose state is entirely defined by the fields set in a "canonical" constructor. Records automatically define an equals method that compares the fields. Two record instances are equal when the corresponding field values are equal."*
>
> **Dịch:** Nhớ từ chương 4 rằng [[07 - Records|record]] là dạng đặc biệt của class **immutable**, state được định nghĩa hoàn toàn bởi các field set trong **canonical constructor**. Record **tự động định nghĩa method `equals` so sánh các field**. Hai instance record bằng nhau khi **các giá trị field tương ứng bằng nhau**.

---

## 5.2.3. Equality Testing and Inheritance

> *"How should the equals method behave if the implicit and explicit parameters don't belong to the same class? This has been an area of some controversy. In the preceding example, the equals method returns false if the classes don't match exactly. But many programmers use an instanceof test instead:"*

```java
if (!(otherObject instanceof Employee)) return false;
```

> *"This leaves open the possibility that otherObject can belong to a subclass. However, this approach can get you into trouble. Here is why. The Java Language Specification requires that the equals method has the following properties:"*

**Dịch:** `equals` nên xử sự thế nào nếu **implicit parameter và explicit parameter không thuộc cùng một class**? Đây là **vùng gây tranh cãi**. Ví dụ trước trả về `false` nếu **class không khớp chính xác**. Nhưng nhiều lập trình viên dùng **phép kiểm tra `instanceof`** thay thế — cách này **để ngỏ khả năng `otherObject` thuộc một subclass**, và **có thể gây rắc rối**. Lý do: Java Language Specification **yêu cầu `equals` có các tính chất sau**.

> *"1. It is reflexive: For any non-null reference x, x.equals(x) should return true."*
> *"2. It is symmetric: For any references x and y, x.equals(y) should return true if and only if y.equals(x) returns true."*
> *"3. It is transitive: For any references x, y, and z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) should return true."*
> *"4. It is consistent: If the objects to which x and y refer haven't changed, then repeated calls to x.equals(y) return the same value."*
> *"5. For any non-null reference x, x.equals(null) should return false."*

**Dịch:**

| # | Tính chất | Nội dung |
|---|---|---|
| 1 | **reflexive** (phản xạ) | Với mọi reference `x` khác null, `x.equals(x)` phải trả về `true` |
| 2 | **symmetric** (đối xứng) | Với mọi reference `x`, `y`: `x.equals(y)` trả về `true` **khi và chỉ khi** `y.equals(x)` trả về `true` |
| 3 | **transitive** (bắc cầu) | Nếu `x.equals(y)` là `true` và `y.equals(z)` là `true` thì `x.equals(z)` phải là `true` |
| 4 | **consistent** (nhất quán) | Nếu object mà `x` và `y` trỏ tới **không đổi** thì gọi `x.equals(y)` nhiều lần đều **trả về cùng giá trị** |
| 5 | — | Với mọi reference `x` khác null, `x.equals(null)` phải trả về `false` |

> *"These rules are certainly reasonable. You wouldn't want a library implementor to ponder whether to call x.equals(y) or y.equals(x) when locating an element in a data structure."*

**Dịch:** Các quy tắc này **chắc chắn hợp lý**. Bạn **không muốn người viết library phải đắn đo** nên gọi `x.equals(y)` hay `y.equals(x)` khi định vị một phần tử trong cấu trúc dữ liệu.

> *"However, the symmetry rule has subtle consequences when the parameters belong to different classes. Consider a call"*

```java
e.equals(m)
```

> *"where e is an Employee object and m is a Manager object, both of which happen to have the same name, salary, and hire date. If Employee.equals uses an instanceof test, the call returns true. But that means that the reverse call"*

```java
m.equals(e)
```

> *"also needs to return true—the symmetry rule does not allow it to return false or to throw an exception."*

**Dịch:** Nhưng **quy tắc đối xứng có hệ quả tinh vi** khi parameter thuộc các class khác nhau. Xét `e.equals(m)` với `e` là object `Employee`, `m` là object `Manager`, cả hai tình cờ **cùng name, salary, hire date**. Nếu `Employee.equals` dùng `instanceof` thì lời gọi trả về `true`. Nhưng thế nghĩa là **lời gọi ngược `m.equals(e)` cũng phải trả về `true`** — quy tắc đối xứng **không cho phép** nó trả về `false` hay ném exception.

> *"That leaves the Manager class in a bind. Its equals method must be willing to compare itself to any Employee, without taking manager-specific information into account! All of a sudden, the instanceof test looks less attractive."*

**Dịch:** Điều đó **đẩy class `Manager` vào thế kẹt**: method `equals` của nó **phải sẵn sàng so sánh mình với bất kỳ `Employee` nào**, **không tính đến thông tin riêng của manager**! Đột nhiên phép kiểm tra `instanceof` **trông kém hấp dẫn hẳn**.

> *"Some authors have gone on record that the getClass test is wrong because it violates the substitution principle. A commonly cited example is the equals method in the AbstractSet class that tests whether two sets have the same elements. The AbstractSet class has two concrete subclasses, TreeSet and HashSet, that use different algorithms for locating set elements. You really want to be able to compare any two sets, no matter how they are implemented."*

**Dịch:** Một số tác giả **công khai cho rằng phép kiểm tra `getClass` là sai** vì nó **vi phạm [[01 - Classes, Superclasses, and Subclasses|substitution principle]]**. Ví dụ hay được nêu là `equals` của class `AbstractSet` — kiểm tra **hai set có cùng phần tử hay không**. `AbstractSet` có **hai subclass cụ thể là `TreeSet` và `HashSet`**, dùng **thuật toán khác nhau** để định vị phần tử. Bạn thực sự muốn **so sánh được hai set bất kỳ, bất kể chúng được cài đặt thế nào**.

> *"However, the set example is rather specialized. It would make sense to declare AbstractSet.equals as final, because nobody should redefine the semantics of set equality. (The method is not actually final. This allows a subclass to implement a more efficient algorithm for the equality test.)"*

**Dịch:** Nhưng ví dụ set **khá đặc thù**. Sẽ hợp lý nếu khai báo `AbstractSet.equals` là **`final`**, vì **không ai nên định nghĩa lại ngữ nghĩa "hai set bằng nhau"**. (Thực tế method đó **không phải `final`** — để subclass **cài thuật toán hiệu quả hơn** cho phép kiểm tra bằng nhau.)

> *"The way I see it, there are two distinct scenarios:"*
> *"If subclasses can have their own notion of equality, then the symmetry requirement forces you to use the getClass test."*
> *"If the notion of equality is fixed in the superclass, then you can use the instanceof test and allow objects of different subclasses to be equal to one another."*

**Dịch:** Theo tác giả, có **hai kịch bản khác biệt**:

| Kịch bản | Cách làm |
|---|---|
| Subclass **có quan niệm riêng** về sự bằng nhau | Yêu cầu **đối xứng buộc bạn dùng phép kiểm tra `getClass`** |
| Quan niệm bằng nhau **cố định ở superclass** | Dùng được **`instanceof`**, và **cho phép object của các subclass khác nhau bằng nhau** |

> *"In the example with employees and managers, we consider two objects to be equal when they have matching fields. If we have two Manager objects with the same name, salary, and hire date, but with different bonuses, we want them to be different. Therefore, we use the getClass test."*

**Dịch:** Trong ví dụ employee/manager, ta coi hai object bằng nhau khi **các field khớp nhau**. Hai object `Manager` cùng name, salary, hire date **nhưng khác bonus** thì ta **muốn chúng khác nhau**. Vì vậy **dùng `getClass`**.

> *"But suppose we used an employee ID for equality testing. This notion of equality makes sense for all subclasses. Then we could use the instanceof test, and we should have declared Employee.equals as final."*

**Dịch:** Nhưng giả sử dùng **employee ID** để kiểm tra bằng nhau — quan niệm này **hợp lý cho mọi subclass**. Khi đó **dùng được `instanceof`**, và **nên khai báo `Employee.equals` là `final`**.

> **Note (sách):** *"The standard Java library contains over 150 implementations of equals methods, with a mishmash of using instanceof, calling getClass, catching a ClassCastException, or doing nothing at all. Check out the API documentation of the java.sql.Timestamp class, where the implementors note with some embarrassment that they have painted themselves in a corner. The Timestamp class inherits from java.util.Date, whose equals method uses an instanceof test, and it is impossible to override equals to be both symmetric and accurate."*
>
> **Dịch:** Thư viện Java chuẩn chứa **hơn 150 bản cài `equals`**, **hổ lốn**: chỗ dùng `instanceof`, chỗ gọi `getClass`, chỗ bắt `ClassCastException`, chỗ **chẳng làm gì cả**. Xem tài liệu API của class `java.sql.Timestamp`, nơi người cài đặt **ghi chú có phần ngượng ngùng rằng họ đã tự dồn mình vào chân tường**: `Timestamp` kế thừa từ `java.util.Date` mà `equals` của `Date` dùng `instanceof`, nên **không thể override `equals` vừa đối xứng vừa chính xác**.

> **Caution (sách):** *"The commonly cited example of set equality is a cautionary tale, showing just how difficult it is to provide symmetric equality across subclasses. Consider these two sets:"*
>
> ```java
> Set<String> x = new HashSet<>();
> x.add("Hello");
> x.add("World");
> Set<String> y = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
> y.add("Hello");
> y.add("WORLD");
> ```
>
> *"With these sets, equals is not symmetric:"*
>
> ```java
> x.equals(y) // false
> y.equals(x) // true
> ```
>
> *"TreeSet uses the sort order, and not equals, to compare elements. With case-insensitive order, the strings "World" and "WORLD" are deemed equal."*
>
> **Dịch:** Ví dụ set equality hay được nhắc là một **bài học cảnh giác**, cho thấy **cung cấp equality đối xứng xuyên subclass khó tới mức nào**. Với hai set trên, **`equals` không đối xứng**. `TreeSet` dùng **thứ tự sắp xếp**, chứ **không dùng `equals`**, để so sánh phần tử. Với thứ tự **không phân biệt hoa thường**, chuỗi `"World"` và `"WORLD"` **bị coi là bằng nhau**.

### Công thức viết method equals hoàn hảo

> *"Here is a recipe for writing the perfect equals method:"*

> *"1. Name the explicit parameter otherObject—later, you will need to cast it to another variable that you should call other."*

**Dịch:** Đặt tên explicit parameter là **`otherObject`** — sau đó bạn sẽ cần cast nó sang một biến khác nên gọi là **`other`**.

> *"2. Test whether this happens to be identical to otherObject:"*
>
> ```java
> if (this == otherObject) return true;
> ```
>
> *"This statement is just an optimization. In practice, this is a common case. It is much cheaper to check for identity than to compare the fields."*

**Dịch:** Kiểm tra xem `this` có **tình cờ đồng nhất với `otherObject`** không. Câu lệnh này **chỉ là tối ưu hoá**; thực tế đây là **trường hợp phổ biến**, và **kiểm tra identity rẻ hơn nhiều so với so sánh các field**.

> *"3. Test whether otherObject is null and return false if it is. This test is required."*
>
> ```java
> if (otherObject == null) return false;
> ```

**Dịch:** Kiểm tra `otherObject` có `null` không, nếu có thì trả về `false`. **Phép kiểm tra này là bắt buộc.**

> *"4. Compare the classes of this and otherObject. If the semantics of equals can change in subclasses, use the getClass test:"*
>
> ```java
> if (getClass() != otherObject.getClass()) return false;
> ClassName other = (ClassName) otherObject;
> ```
>
> *"If the same semantics holds for all subclasses, you can use an instanceof test:"*
>
> ```java
> if (!(otherObject instanceof ClassName other)) return false;
> ```
>
> *"Note that the instanceof test sets other to otherObject if it succeeds. No cast is necessary."*

**Dịch:** So sánh class của `this` và `otherObject`. Nếu **ngữ nghĩa của `equals` có thể đổi ở subclass** thì dùng **`getClass`**. Nếu **ngữ nghĩa giữ nguyên cho mọi subclass** thì dùng **`instanceof`**. Lưu ý: phép kiểm tra `instanceof` **gán `other` bằng `otherObject` nếu thành công** — **không cần cast**.

> *"5. Now compare the fields, as required by your notion of equality. Use == for primitive type fields, Objects.equals for object fields. Return true if all fields match, false otherwise."*
>
> ```java
> return field1 == other.field1
>     && Objects.equals(field2, other.field2)
>     && . . .;
> ```
>
> *"If you redefine equals in a subclass, include a call to super.equals(other)."*

**Dịch:** So sánh các field theo quan niệm bằng nhau của bạn: dùng **`==` cho field kiểu primitive**, **`Objects.equals` cho field kiểu object**. Trả về `true` nếu **mọi field khớp**, ngược lại `false`. Nếu **định nghĩa lại `equals` ở subclass**, hãy **kèm lời gọi `super.equals(other)`**.

> **Tip (sách):** *"If you have fields of array type, you can use the static Arrays.equals method to check that the corresponding array elements are equal. Use the Arrays.deepEquals method for multidimensional arrays."*
>
> **Dịch:** Nếu có field kiểu [[09 - Arrays|array]], dùng static method **`Arrays.equals`** để kiểm tra các phần tử tương ứng bằng nhau. Dùng **`Arrays.deepEquals`** cho **mảng nhiều chiều**.

> **Caution (sách):** *"Here is a common mistake when implementing the equals method. Can you spot the problem?"*
>
> ```java
> public class Employee
> {
>     public boolean equals(Employee other)
>     {
>         return other != null
>             && getClass() == other.getClass()
>             && Objects.equals(name, other.name)
>             && salary == other.salary
>             && Objects.equals(hireDay, other.hireDay);
>     }
>     . . .
> }
> ```
>
> *"This method declares the explicit parameter type as Employee. As a result, it does not override the equals method of the Object class but defines a completely unrelated method."*
>
> *"You can protect yourself against this type of error by tagging methods that are intended to override superclass methods with @Override:"*
>
> ```java
> @Override public boolean equals(Object other)
> ```
>
> *"If you made a mistake and are defining a new method, the compiler reports an error. For example, suppose you add the following declaration to the Employee class:"*
>
> ```java
> @Override public boolean equals(Employee other)
> ```
>
> *"An error is reported because this method doesn't override any method from the Object superclass."*
>
> **Dịch:** Đây là **lỗi thường gặp** khi cài `equals`. Method này khai báo **kiểu của explicit parameter là `Employee`**. Kết quả: nó **không override method `equals` của `Object`** mà **định nghĩa một method hoàn toàn không liên quan**. Bạn tự bảo vệ khỏi loại lỗi này bằng cách **gắn nhãn `@Override`** cho các method định override method của superclass. Nếu bạn **lỡ định nghĩa method mới**, compiler **báo lỗi** vì method đó **không override method nào từ superclass `Object`**.

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static boolean equals(xxx[] a, xxx[] b)` *(5.0)* | Trả về `true` nếu hai mảng **có độ dài bằng nhau và các phần tử ở vị trí tương ứng bằng nhau**. Kiểu phần tử `xxx` có thể là `Object`, `int`, `long`, `short`, `char`, `byte`, `boolean`, `float`, hoặc `double`. |

## API — `java.util.Objects` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static boolean equals(Object a, Object b)` | Trả về `true` nếu **`a` và `b` đều `null`**, `false` nếu **đúng một trong hai là `null`**, và `a.equals(b)` trong các trường hợp còn lại. |

---

## 5.2.4. The hashCode Method

> *"A hash code is an integer that is derived from an object. Hash codes should be scrambled—if x and y are two distinct objects, there should be a high probability that x.hashCode() and y.hashCode() are different. Table 5.1 lists a few examples of hash codes that result from the hashCode method of the String class."*

**Dịch:** **Hash code là một số nguyên được dẫn xuất từ một object.** Hash code nên được **xáo trộn**: nếu `x` và `y` là hai object khác biệt thì **xác suất `x.hashCode()` khác `y.hashCode()` phải cao**.

### Table 5.1 — Hash Codes Resulting from the hashCode Method

| String | Hash Code |
|---|---|
| `Hello` | 69609650 |
| `Harry` | 69496448 |
| `Hacker` | -2141031506 |

> *"The String class uses the following algorithm to compute the hash code:"*

```java
int hash = 0;
for (int i = 0; i < length(); i++)
    hash = 31 * hash + charAt(i);
```

**Dịch:** Class [[05 - Strings|`String`]] dùng thuật toán trên để tính hash code.

> *"The hashCode method is defined in the Object class. Therefore, every object has a default hash code. That hash code is derived from the object's memory address. Consider this example:"*

```java
var s = "Ok";
var sb = new StringBuilder(s);
System.out.println(s.hashCode() + " " + sb.hashCode());
var t = new String("Ok");
var tb = new StringBuilder(t);
System.out.println(t.hashCode() + " " + tb.hashCode());
```

**Dịch:** `hashCode` **được định nghĩa trong class `Object`**, nên **mọi object đều có hash code mặc định**, dẫn xuất từ **địa chỉ bộ nhớ của object**.

### Table 5.2 — Hash Codes of Strings and String Builders

| Object | Hash Code | Object | Hash Code |
|---|---|---|---|
| `s` | 2556 | `t` | 2556 |
| `sb` | 20526976 | `tb` | 20527144 |

> *"Note that the strings s and t have the same hash code because, for strings, the hash codes are derived from their contents. The string builders sb and tb have different hash codes because no hashCode method has been defined for the StringBuilder class and the default hashCode method in the Object class derives the hash code from the object's memory address."*

**Dịch:** Chuỗi `s` và `t` **có cùng hash code** vì với string, hash code **dẫn xuất từ nội dung**. Hai string builder `sb` và `tb` **có hash code khác nhau** vì **`StringBuilder` không định nghĩa method `hashCode`**, và bản `hashCode` mặc định trong `Object` **dẫn xuất hash code từ địa chỉ bộ nhớ**.

> *"If you redefine the equals method, you will also need to redefine the hashCode method for objects that users might insert into a hash table. (I discuss hash tables in Chapter 9.)"*

**Dịch:** Nếu **định nghĩa lại `equals`**, bạn cũng **cần định nghĩa lại `hashCode`** cho các object mà người dùng có thể **chèn vào hash table**. (Hash table bàn ở chương 9.)

> *"The hashCode method should return an integer (which can be negative). Just combine the hash codes of the instance fields so that the hash codes for different objects are likely to be widely scattered."*

**Dịch:** `hashCode` **trả về một số nguyên (có thể âm)**. Chỉ cần **kết hợp hash code của các instance field** sao cho hash code của các object khác nhau **nhiều khả năng phân tán rộng**.

> *"For example, here is a hashCode method for the Employee class:"*

```java
public class Employee
{
    public int hashCode()
    {
        return 7 * name.hashCode()
            + 11 * Double.valueOf(salary).hashCode()
            + 13 * hireDay.hashCode();
    }
    . . .
}
```

> *"However, you can do better. First, use the null-safe method Objects.hashCode. It returns 0 if its argument is null and the result of calling hashCode on the argument otherwise. Also, use the static Double.hashCode method to avoid creating a Double object:"*

```java
public int hashCode()
{
    return 7 * Objects.hashCode(name)
        + 11 * Double.hashCode(salary)
        + 13 * Objects.hashCode(hireDay);
}
```

**Dịch:** Bạn **làm tốt hơn được**. Thứ nhất, dùng method **null-safe `Objects.hashCode`**: trả về **`0` nếu argument là `null`**, ngược lại là kết quả gọi `hashCode` trên argument. Thứ hai, dùng static method **`Double.hashCode`** để **tránh tạo object `Double`**.

> **Caution (sách):** *"If the instance variables have small ranges of possible values, you need to achieve as many distinct hash codes as possible. Consider hashing calendar dates. Computing 7 * year + 11 * month + 13 * day yields many collisions. In contrast, 31 * 12 * year + 31 * month + day is a "perfect hash function." Assuming a reasonable year range, no two dates have the same hash code. (The actual hashCode method of the LocalDate class, which supports a range of ±999,999,999 years, is a bit more complex.)"*
>
> **Dịch:** Nếu instance variable có **dải giá trị khả dĩ nhỏ**, bạn cần **tạo ra càng nhiều hash code khác biệt càng tốt**. Xét việc hash ngày tháng: tính `7 * year + 11 * month + 13 * day` **cho ra nhiều va chạm**. Ngược lại, `31 * 12 * year + 31 * month + day` là một **"perfect hash function"** — giả sử dải năm hợp lý thì **không có hai ngày nào cùng hash code**. (Bản `hashCode` thật của class `LocalDate`, hỗ trợ dải **±999.999.999 năm**, **phức tạp hơn một chút**.)

> *"Combining multiple hash values can be tedious. In many cases, you can simply call Objects.hash with all fields. It will combine the hash codes of its arguments. Then the Employee.hashCode method is simply"*

```java
public int hashCode()
{
    return Objects.hash(name, salary, hireDay);
}
```

**Dịch:** **Kết hợp nhiều giá trị hash có thể nhàm chán.** Nhiều trường hợp bạn chỉ cần gọi **`Objects.hash` với tất cả field** — nó sẽ **kết hợp hash code của các argument**.

> *"However, you need to be careful with fields that are arrays. The hash code of an array is computed with Object.hashCode and does not depend on its elements. Instead, use the static Arrays.hashCode method which combines the hash codes of the array elements. There are overloads for primitive type arrays and arrays of objects. For multi-dimensional arrays, use Arrays.deepHashCode."*

**Dịch:** Nhưng **phải cẩn thận với field kiểu array**: hash code của một mảng được tính bằng **`Object.hashCode`** và **không phụ thuộc các phần tử của nó**. Thay vào đó dùng static method **`Arrays.hashCode`** — kết hợp hash code của các phần tử mảng. Có **overload cho mảng primitive và mảng object**. Với **mảng nhiều chiều** dùng **`Arrays.deepHashCode`**.

> **Note (sách):** *"The Arrays.hashCode(Object[]) method works almost like String.hashCode, using the "multiply with 31 and add" operation to combine element hash codes. But there is a twist. A zero-length array has hash code 1, to distinguish it from null. Here is the implementation:"*
>
> ```java
> public static int hashCode(Object[] a)
> {
>     if (a == null) return 0;
>     int result = 1; // Starting at 1, not 0
>     for (Object element : a)
>         result = 31 * result + (element == null ? 0 : element.hashCode());
>     return result;
> }
> ```
>
> *"The Objects.hash method calls Arrays.hashCode. As a consequence, Objects.hash(x) equals 31 + x.hashCode()."*
>
> **Dịch:** `Arrays.hashCode(Object[])` hoạt động **gần giống `String.hashCode`**, dùng phép **"nhân 31 rồi cộng"** để kết hợp hash code của phần tử. Nhưng có một **điểm khác**: **mảng độ dài 0 có hash code là `1`**, để **phân biệt với `null`**. Method `Objects.hash` **gọi `Arrays.hashCode`**, nên **`Objects.hash(x)` bằng `31 + x.hashCode()`**.

> *"A record type automatically provides a hashCode method that derives a hash code from the hash codes of the component values. Its exact behavior is left open in the Java Language Specification. In OpenJDK 21, the component hashes are simply combined with the "multiply with 31 and add" operation, starting with zero."*

**Dịch:** Kiểu [[07 - Records|record]] **tự động cung cấp method `hashCode`** dẫn xuất hash code từ hash code của các **component**. **Hành vi chính xác được để ngỏ** trong Java Language Specification. Ở **OpenJDK 21**, hash của các component **đơn giản được kết hợp bằng phép "nhân 31 rồi cộng", bắt đầu từ 0**.

> *"Your definitions of equals and hashCode must be compatible: If x.equals(y) is true, then x.hashCode() must return the same value as y.hashCode(). For example, if you define Employee.equals to compare employee IDs, then the hashCode method needs to hash the IDs, not employee names or memory addresses."*

**Dịch:** Định nghĩa `equals` và `hashCode` của bạn **phải tương thích**: nếu `x.equals(y)` là `true` thì **`x.hashCode()` phải trả về cùng giá trị với `y.hashCode()`**. Ví dụ nếu `Employee.equals` so sánh employee ID thì **`hashCode` phải hash ID**, chứ **không phải tên hay địa chỉ bộ nhớ**.

## API — `java.lang.Object` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int hashCode()` | Trả về **hash code cho object này**. Hash code có thể là **số nguyên bất kỳ, dương hoặc âm**. **Object bằng nhau phải trả về hash code đồng nhất.** |

## API — `java.util.Objects` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int hash(Object... objects)` | Trả về hash code được **kết hợp từ hash code của mọi object truyền vào**. |
| `static int hashCode(Object a)` | Trả về **`0` nếu `a` là `null`**, ngược lại trả về `a.hashCode()`. |

## API — `java.lang.(Integer|Long|Short|Byte|Double|Float|Character|Boolean)` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int hashCode(xxx value)` *(8)* | Trả về **hash code của giá trị truyền vào**. `xxx` là **primitive type tương ứng với wrapper type** đó. |

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int hashCode(xxx[] a)` *(5.0)* | Tính **hash code của mảng `a`**. Kiểu phần tử `xxx` có thể là `Object`, `int`, `long`, `short`, `char`, `byte`, `boolean`, `float`, hoặc `double`. |

---

## 5.2.5. The toString Method

> *"Another important method in Object is the toString method that returns a string representing the value of this object. Here is a typical example. The toString method of the Point class returns a string like this:"*

```
java.awt.Point[x=10,y=20]
```

> *"Most (but not all) toString methods follow this format: the name of the class, then the field values enclosed in square brackets. Here is an implementation of the toString method for the Employee class:"*

```java
public String toString()
{
    return "Employee[name=" + name
        + ",salary=" + salary
        + ",hireDay=" + hireDay
        + "]";
}
```

**Dịch:** Một method quan trọng khác của `Object` là **`toString`**, trả về **một string biểu diễn giá trị của object này**. **Đa số (không phải tất cả)** method `toString` theo định dạng: **tên class, rồi các giá trị field trong ngoặc vuông**.

> *"Actually, you can do a little better. Instead of hardwiring the class name into the toString method, call getClass().getName() to obtain a string with the class name."*

```java
public String toString()
{
    return getClass().getName()
        + "[name=" + name
        + ",salary=" + salary
        + ",hireDay=" + hireDay
        + "]";
}
```

> *"Such toString method will also work for subclasses."*

**Dịch:** Thực ra **làm tốt hơn được một chút**: thay vì **gắn cứng tên class** vào `toString`, gọi **`getClass().getName()`** để lấy string chứa tên class. Method `toString` như vậy **cũng hoạt động cho subclass**.

> *"Of course, the subclass programmer should define its own toString method and add the subclass fields. If the superclass uses getClass().getName(), then the subclass can simply call super.toString(). For example, here is a toString method for the Manager class:"*

```java
public class Manager extends Employee
{
    . . .
    public String toString()
    {
        return super.toString()
            + "[bonus=" + bonus
            + "]";
    }
}
```

> *"Now a Manager object is printed as"*

```
Manager[name=. . .,salary=. . .,hireDay=. . .][bonus=. . .]
```

**Dịch:** Dĩ nhiên người viết subclass **nên định nghĩa `toString` riêng** và **thêm các field của subclass**. Nếu superclass dùng `getClass().getName()` thì subclass **chỉ cần gọi `super.toString()`**.

> *"The toString method is ubiquitous for an important reason: Whenever an object is concatenated with a string by the "+" operator, the Java compiler automatically invokes the toString method to obtain a string representation of the object. For example:"*

```java
var p = new Point(10, 20);
String message = "The current position is " + p;
    // automatically invokes p.toString()
```

**Dịch:** `toString` **có mặt khắp nơi vì một lý do quan trọng**: mỗi khi một object **được nối với string bằng [[04 - Operators|toán tử `+`]]**, compiler Java **tự động gọi `toString`** để lấy biểu diễn string của object.

> **Tip (sách):** *"Instead of writing x.toString(), you can write "" + x. This statement concatenates the empty string with the string representation of x that is exactly x.toString(). Unlike toString, this statement even works if x is of primitive type."*
>
> **Dịch:** Thay vì viết `x.toString()`, bạn viết được **`"" + x`** — nối **chuỗi rỗng** với biểu diễn string của `x`, đúng bằng `x.toString()`. Khác `toString`, câu lệnh này **hoạt động cả khi `x` là primitive type**.

> *"If x is any object and you call"*

```java
System.out.println(x);
```

> *"then the println method simply calls x.toString() and prints the resulting string."*

**Dịch:** Nếu `x` là object bất kỳ và bạn gọi `System.out.println(x)` thì `println` **đơn giản gọi `x.toString()`** rồi in string thu được.

> *"The Object class defines the toString method to print the class name and the hash code of the object. For example, the call"*

```java
System.out.println(System.out)
```

> *"produces an output that looks like this:"*

```
java.io.PrintStream@2f6684
```

> *"The reason is that the implementor of the PrintStream class didn't bother to override the toString method."*

**Dịch:** Class `Object` định nghĩa `toString` để in **tên class và hash code của object**. Lý do output trên: **người cài class `PrintStream` không buồn override `toString`**.

> **Caution (sách):** *"Annoyingly, arrays inherit the toString method from Object, with the added twist that the array type is printed in an archaic format. For example,"*
>
> ```java
> int[] luckyNumbers = { 2, 3, 5, 7, 11, 13 };
> String s = "" + luckyNumbers;
> ```
>
> *"yields the string "[I@1a46e30". (The prefix [I denotes an array of integers.) The remedy is to call the static Arrays.toString method instead. The code"*
>
> ```java
> String s = Arrays.toString(luckyNumbers);
> ```
>
> *"yields the string "[2, 3, 5, 7, 11, 13]". To correctly print multidimensional arrays (that is, arrays of arrays), use Arrays.deepToString."*
>
> **Dịch:** **Phiền một nỗi**, [[09 - Arrays|array]] **kế thừa `toString` từ `Object`**, kèm điểm oái oăm là **kiểu mảng được in ở định dạng cổ lỗ**. Đoạn trên cho ra chuỗi `"[I@1a46e30"` (tiền tố `[I` chỉ **mảng số nguyên**). **Cách chữa: gọi static method `Arrays.toString`** — cho ra `"[2, 3, 5, 7, 11, 13]"`. Để in đúng **mảng nhiều chiều** (mảng của mảng), dùng **`Arrays.deepToString`**.

> *"The toString method is a great tool for logging. Many classes in the standard class library define the toString method so that you can get useful information about the state of an object. This is particularly useful in logging messages like this:"*

```java
System.out.println("Current position = " + position);
```

> *"As explained in Chapter 7, an even better solution is to use a logger object and call"*

```java
logger.log(INFO, "Current position = " + position);
```

**Dịch:** `toString` là **công cụ tuyệt vời cho logging**. Nhiều class trong thư viện chuẩn định nghĩa `toString` để bạn **lấy được thông tin hữu ích về state của object**. Như trình bày ở chương 7, giải pháp **còn tốt hơn** là **dùng một logger object**.

> **Tip (sách):** *"I strongly recommend that you add a toString method to each class that you write. You, as well as other programmers who use your classes, will be grateful for the logging support."*
>
> *"However, for record types, a toString method is already provided. It simply lists the class name and the names and stringified values of the fields."*
>
> **Dịch:** Tác giả **rất khuyến nghị thêm method `toString` vào mọi class bạn viết**. Bạn — và những lập trình viên khác dùng class của bạn — **sẽ biết ơn phần hỗ trợ logging này**. Tuy nhiên với kiểu [[07 - Records|record]] thì **`toString` đã có sẵn**: nó chỉ **liệt kê tên class cùng tên và giá trị đã đổi thành chuỗi của các field**.

> **Note (sách):** *"In the preceding sections, you learned how to override the equals, hashCode, and toString methods. In the perhaps unlikely case that you need access to the unmodified behavior, do this: Compare with == instead of equals. Call System.indentityHashCode(obj) or Objects.identityToString(obj) to get what would have been returned if you had not overriden hashCode or toString"*
>
> **Dịch:** Các phần trên đã dạy cách override `equals`, `hashCode`, `toString`. Trong trường hợp **có lẽ hiếm hoi** mà bạn cần **truy cập hành vi chưa bị sửa**: **so sánh bằng `==` thay cho `equals`**; gọi **`System.identityHashCode(obj)`** hoặc **`Objects.identityToString(obj)`** để lấy thứ **lẽ ra đã được trả về nếu bạn không override `hashCode` hay `toString`**.

> *"The program in Listing 5.4 tests the equals, hashCode, and toString methods for the classes Employee (Listing 5.5) and Manager (Listing 5.6)."*

### Listing 5.4 — `equals/EqualsTest.java`

```java
package equals;

/**
 * This program demonstrates the equals method.
 * @version 1.12 2012-01-26
 * @author Cay Horstmann
 */
public class EqualsTest
{
    public static void main(String[] args)
    {
        var alice1 = new Employee("Alice Adams", 75000, 1987, 12, 15);
        var alice2 = alice1;
        var alice3 = new Employee("Alice Adams", 75000, 1987, 12, 15);
        var bob = new Employee("Bob Brandson", 50000, 1989, 10, 1);

        System.out.println("alice1 == alice2: " + (alice1 == alice2));

        System.out.println("alice1 == alice3: " + (alice1 == alice3));

        System.out.println("alice1.equals(alice3): " + alice1.equals(alice3));

        System.out.println("alice1.equals(bob): " + alice1.equals(bob));

        System.out.println("bob.toString(): " + bob);

        var carl = new Manager("Carl Cracker", 80000, 1987, 12, 15);
        var boss = new Manager("Carl Cracker", 80000, 1987, 12, 15);
        boss.setBonus(5000);
        System.out.println("boss.toString(): " + boss);
        System.out.println("carl.equals(boss): " + carl.equals(boss));
        System.out.println("alice1.hashCode(): " + alice1.hashCode());
        System.out.println("alice3.hashCode(): " + alice3.hashCode());
        System.out.println("bob.hashCode(): " + bob.hashCode());
        System.out.println("carl.hashCode(): " + carl.hashCode());
    }
}
```

### Listing 5.5 — `equals/Employee.java`

```java
package equals;

import java.time.*;
import java.util.Objects;

public class Employee
{
    private String name;
    private double salary;
    private LocalDate hireDay;

    public Employee(String name, double salary, int year, int month, int day)
    {
        this.name = name;
        this.salary = salary;
        hireDay = LocalDate.of(year, month, day);
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public LocalDate getHireDay()
    {
        return hireDay;
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }

    public boolean equals(Object otherObject)
    {
        // a quick test to see if the objects are identical
        if (this == otherObject) return true;

        // must return false if the explicit parameter is null
        if (otherObject == null) return false;

        // if the classes don't match, they can't be equal
        if (getClass() != otherObject.getClass()) return false;

        // now we know otherObject is a non-null Employee
        var other = (Employee) otherObject;

        // test whether the fields have identical values
        return Objects.equals(name, other.name)
            && salary == other.salary && Objects.equals(hireDay, other.hireDay);
    }

    public int hashCode()
    {
        return Objects.hash(name, salary, hireDay);
    }

    public String toString()
    {
        return getClass().getName() + "[name=" + name + ",salary=" + salary + ",hireDay="
            + hireDay + "]";
    }
}
```

### Listing 5.6 — `equals/Manager.java`

```java
package equals;

public class Manager extends Employee
{
    private double bonus;

    public Manager(String name, double salary, int year, int month, int day)
    {
        super(name, salary, year, month, day);
        bonus = 0;
    }

    public double getSalary()
    {
        double baseSalary = super.getSalary();
        return baseSalary + bonus;
    }

    public void setBonus(double bonus)
    {
        this.bonus = bonus;
    }

    public boolean equals(Object otherObject)
    {
        if (!super.equals(otherObject)) return false;
        var other = (Manager) otherObject;
        // super.equals checked that this and other belong to the same class
        return bonus == other.bonus;
    }

    public int hashCode()
    {
        return java.util.Objects.hash(super.hashCode(), bonus);
    }

    public String toString()
    {
        return super.toString() + "[bonus=" + bonus + "]";
    }
}
```

## API — `java.lang.Object` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Class getClass()` | Trả về một **class object chứa thông tin về object này**. Java có một **biểu diễn runtime cho class**, được đóng gói trong class `Class`. |
| `boolean equals(Object otherObject)` | So sánh **hai object có bằng nhau không**; trả về `true` nếu **hai object trỏ tới cùng vùng nhớ**, ngược lại `false`. **Bạn nên override method này trong class của mình.** |
| `String toString()` | Trả về **một string biểu diễn giá trị của object này**. **Bạn nên override method này trong class của mình.** |

## API — `java.lang.Class` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getName()` | Trả về **tên của class này**. |
| `Class getSuperclass()` | Trả về **superclass của class này** dưới dạng một object `Class`. |

## API — `java.lang.System` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int identityHashCode(Object x)` *(1.1)* | Trả về hash code mà **`Object.hashCode` sẽ trả về cho `x` nếu không bị override**, hoặc **`0` nếu `x` là `null`**. |

## API — `java.util.Objects` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static String identityToString(Object o)` *(19)* | Trả về string mà **`Object.toString` sẽ trả về cho `o` nếu không bị override**. **Ném `NullPointerException` nếu `o` là `null`.** |

---

## Bài kế tiếp

→ [[03 - Generic Array Lists]] — class `ArrayList` với kích thước tự co giãn, thay thế cho mảng có kích thước cố định.
