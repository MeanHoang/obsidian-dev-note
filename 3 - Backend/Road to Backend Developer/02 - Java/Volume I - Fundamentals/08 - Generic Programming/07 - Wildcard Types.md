# 07 — Wildcard Types

> Chapter 8, Section 8.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.7. Wildcard Types

> *"It was known for some time among researchers of type systems that a rigid system of generic types is quite unpleasant to use. The Java designers invented an ingenious (but nevertheless safe) "escape hatch": the wildcard type. The following sections show you how to work with wildcards."*

**Dịch:** Giới nghiên cứu type system đã biết từ lâu rằng **một hệ generic type cứng nhắc thì rất khó chịu khi dùng**. Các nhà thiết kế Java nghĩ ra một **"cửa thoát hiểm" tài tình (mà vẫn an toàn)**: **wildcard type**. Các section sau cho thấy cách làm việc với wildcard.

---

## 8.7.1. The Wildcard Concept

> *"In a wildcard type, a type parameter is allowed to vary. For example, the wildcard type"*

```java
Pair<? extends Employee>
```

> *"denotes any generic Pair type whose type parameter is a subclass of Employee, such as Pair<Manager>, but not Pair<String>."*

**Dịch:** Trong một wildcard type, **type parameter được phép biến thiên**. Ví dụ wildcard type trên **chỉ bất kỳ generic type `Pair` nào có type parameter là subclass của `Employee`**, chẳng hạn `Pair<Manager>`, **nhưng không phải `Pair<String>`**.

> *"Let's say you want to write a method that prints out pairs of employees, like this:"*

```java
public static void printBuddies(Pair<Employee> p)
{
    Employee first = p.getFirst();
    Employee second = p.getSecond();
    System.out.println(first.getName() + " and " + second.getName() + " are buddies.");
}
```

> *"As you saw in the preceding section, you cannot pass a Pair<Manager> to that method, which is rather limiting. But the solution is simple—use a wildcard type:"*

```java
public static void printBuddies(Pair<? extends Employee> p)
```

> *"The type Pair<Manager> is a subtype of Pair<? extends Employee> (see Figure 8.3)."*

**Dịch:** Như đã thấy ở section trước — [[06 - Inheritance Rules for Generic Types]] — bạn **không truyền được `Pair<Manager>` vào method đó**, khá là gò bó. Nhưng cách giải quyết rất đơn giản: **dùng một wildcard type**. Type `Pair<Manager>` **là subtype của `Pair<? extends Employee>`**.

```
        Pair<? extends Employee>
                  ▲
                  │  (subtype)
            Pair<Manager>
```

> *"Can we use wildcards to corrupt a Pair<Manager> through a Pair<? extends Employee> reference?"*

```java
var managerBuddies = new Pair<Manager>(ceo, cfo);
Pair<? extends Employee> wildcardBuddies = managerBuddies; // OK
wildcardBuddies.setFirst(lowlyEmployee); // compile-time error
```

> *"No corruption is possible. The call to setFirst is a type error. To see why, let us have a closer look at the type Pair<? extends Employee>. Its methods look like this:"*

```java
? extends Employee getFirst()
void setFirst(? extends Employee)
```

**Dịch:** Ta có **dùng wildcard để làm hỏng một `Pair<Manager>`** thông qua reference `Pair<? extends Employee>` được không? **Không thể làm hỏng được.** Lời gọi `setFirst` là **một type error**. Để hiểu vì sao, hãy nhìn kỹ type `Pair<? extends Employee>` — các method của nó có dạng như trên.

> *"It is impossible to call the setFirst method! Consider the call wildcardBuddies.setFirst(lowlyEmployee) The compiler knows that the parameter of setFirst has some specific type, which extends Employee. Is that specific type Employee? Is it Manager, or some other subclass? There is no way for the compiler to know. Therefore, the compiler cannot accept lowlyEmployee. For the same reason, the call wildcardBuddies.setFirst(cio), where cio is a Manager instance, also fails. The compiler must reject all arguments to setFirst other than null."*

**Dịch:** **Không thể gọi method `setFirst`!** Xét lời gọi `wildcardBuddies.setFirst(lowlyEmployee)`: compiler biết parameter của `setFirst` **có một type cụ thể nào đó, extends `Employee`**. Type cụ thể đó là `Employee`? Là `Manager`? Hay một subclass nào khác? **Compiler không có cách nào biết được.** Do đó compiler **không chấp nhận `lowlyEmployee`**. Cũng vì lý do đó, lời gọi `wildcardBuddies.setFirst(cio)` với `cio` là một instance `Manager` **cũng thất bại**. Compiler **phải từ chối mọi argument của `setFirst` trừ `null`**.

> *"The getFirst method continues to work. The return value of getFirst is an instance of some specific type, which is a subtype of Employee. The compiler doesn't know what that specific type is, but it can guarantee that the assignment to an Employee reference is safe."*

> *"This is the key idea behind bounded wildcards. We now have a way of distinguishing between the safe accessor methods and the unsafe mutator methods."*

**Dịch:** Method `getFirst` **vẫn hoạt động bình thường**. Giá trị trả về của `getFirst` là instance của **một type cụ thể nào đó, là subtype của `Employee`**. Compiler không biết type cụ thể đó là gì, nhưng **bảo đảm được rằng gán vào một reference `Employee` là an toàn**. Đây chính là **ý tưởng cốt lõi phía sau bounded wildcard**: ta có cách **phân biệt giữa accessor method an toàn và mutator method không an toàn**.

---

## 8.7.2. Supertype Bounds for Wildcards

> *"Wildcard bounds are similar to type variable bounds, but they have an added capability—you can specify a supertype bound, like this:"*

```java
? super Manager
```

> *"This wildcard is restricted to all supertypes of Manager. (It was a stroke of good luck that the existing super keyword describes the relationship so accurately.)"*

**Dịch:** Bound của wildcard **tương tự bound của type variable** — xem [[04 - Bounds for Type Variables]] — nhưng có thêm một khả năng: bạn **chỉ định được supertype bound**. Wildcard này **bị giới hạn ở mọi supertype của `Manager`**. (Thật may mắn là keyword `super` sẵn có **mô tả quan hệ này chính xác đến vậy**.)

> *"Why would you want to do this? A wildcard with a supertype bound gives you a behavior that is opposite to that of the wildcards described in Section 8.7.1. You can supply arguments to methods, but you can't use the return values. For example, Pair<? super Manager> has methods that can be described as follows:"*

```java
void setFirst(? super Manager)
? super Manager getFirst()
```

**Dịch:** Vì sao lại muốn làm vậy? Một wildcard có **supertype bound** cho bạn hành vi **ngược lại** với wildcard mô tả ở Section 8.7.1: bạn **truyền được argument vào method, nhưng không dùng được giá trị trả về**.

> *"This is not the actual Java syntax, but it shows what the compiler knows. The setFirst parameter type, denoted as ? super Manager, is some specific type T, and Manager is a subtype of T. There are exactly three choices for T: Object, Employee, or Manager. (There would have been more choices if Manager or Employee had implemented interfaces.) However, the compiler cannot know which of these choices applies. Therefore, the compiler cannot accept a call with an argument of type Employee or Object. After all, T might have been Manager. It is only possible to pass an object of type Manager or a subtype such as Executive."*

**Dịch:** Đây **không phải cú pháp Java thật**, nhưng cho thấy **compiler biết những gì**. Type parameter của `setFirst`, ký hiệu `? super Manager`, là **một type cụ thể `T` nào đó**, và **`Manager` là subtype của `T`**. Có **đúng ba lựa chọn cho `T`**: `Object`, `Employee`, hoặc `Manager`. (Sẽ có nhiều lựa chọn hơn nếu `Manager` hay `Employee` có implement interface nào đó.) Tuy nhiên compiler **không biết lựa chọn nào đang áp dụng**. Do đó compiler **không chấp nhận lời gọi với argument type `Employee` hay `Object`** — vì biết đâu `T` chính là `Manager`. **Chỉ truyền được object type `Manager` hoặc subtype của nó** như `Executive`.

> *"Conversely, if you call getFirst, there is no guarantee about the type of the returned object. You can only assign it to an Object."*

**Dịch:** Ngược lại, nếu gọi `getFirst` thì **không có bảo đảm nào về type của object trả về**. Bạn **chỉ gán được nó vào một `Object`**.

> *"Here is a typical example. We have an array of managers and want to put the manager with the lowest and highest bonus into a Pair object. What kind of Pair? A Pair<Manager> is the obvious choice, but there are other possibilities. A Pair<Employee> should be fair game or, for that matter, a Pair<Object> (see Figure 8.4). The following method will accept any appropriate Pair:"*

```java
public static void minmaxBonus(Manager[] a, Pair<? super Manager> result)
{
    if (a.length == 0) return;
    Manager min = a[0];
    Manager max = a[0];
    for (int i = 1; i < a.length; i++)
    {
        if (min.getBonus() > a[i].getBonus()) min = a[i];
        if (max.getBonus() < a[i].getBonus()) max = a[i];
    }
    result.setFirst(min);
    result.setSecond(max);
}
```

**Dịch:** Một ví dụ điển hình: ta có một array manager và muốn **đặt manager có bonus thấp nhất và cao nhất vào một object `Pair`**. `Pair` loại nào? `Pair<Manager>` là lựa chọn hiển nhiên, nhưng **còn khả năng khác**: `Pair<Employee>` cũng hợp lệ, mà `Pair<Object>` cũng vậy. Method trên **chấp nhận mọi `Pair` phù hợp**.

```
Pair<Object>    ─┐
Pair<Employee>  ─┼──  đều là  Pair<? super Manager>
Pair<Manager>   ─┘
```

> *"Intuitively speaking, wildcards with supertype bounds let you write to a generic object, while wildcards with subtype bounds let you read from a generic object."*

**Dịch:** Nói một cách trực giác: **wildcard có supertype bound cho bạn GHI vào một generic object**, còn **wildcard có subtype bound cho bạn ĐỌC từ một generic object**.

| Wildcard | Bound | Làm được gì |
|---|---|---|
| `Pair<? extends Employee>` | subtype bound | **Đọc** (`getFirst` được, `setFirst` không) |
| `Pair<? super Manager>` | supertype bound | **Ghi** (`setFirst` được, giá trị `getFirst` chỉ gán được vào `Object`) |

### Supertype bound với `Comparable`

> *"Here is another use for supertype bounds. The Comparable interface is itself a generic type. It is declared as follows:"*

```java
public interface Comparable<T>
{
    public int compareTo(T other);
}
```

> *"Here, the type variable indicates the type of the other parameter. For example, the String class implements Comparable<String>, and its compareTo method is declared as"*

```java
public int compareTo(String other)
```

> *"This is nice—the explicit parameter has the correct type. Before the interface was generic, other was an Object, and a cast was necessary in the implementation of the method."*

**Dịch:** Một công dụng khác của supertype bound. Interface `Comparable` **bản thân nó là một generic type** — xem [[01 - Interfaces]]. Ở đây type variable **chỉ ra type của parameter `other`**. Ví dụ class `String` implement `Comparable<String>`, và method `compareTo` của nó được khai báo như trên. Thế là tốt — **explicit parameter có đúng type**. Trước khi interface này thành generic, `other` là một `Object`, và **cần một cast trong phần implement method**.

> *"Now that Comparable is a generic type, perhaps we should have done a better job with the minmax method of the ArrayAlg class? We could have declared it as"*

```java
public static <T extends Comparable<T>> Pair<T> minmax(T[] a)
```

> *"This looks more thorough than just using T extends Comparable, and it would work fine for many classes. For example, if you compute the minimum of a String array, then T is the type String, and String is a subtype of Comparable<String>. But we run into a problem when processing an array of LocalDate objects. As it happens, LocalDate implements ChronoLocalDate, and ChronoLocalDate extends Comparable<ChronoLocalDate>. Thus, LocalDate implements Comparable<ChronoLocalDate> but not Comparable<LocalDate>."*

**Dịch:** Giờ `Comparable` là generic type, có lẽ **ta nên làm tốt hơn với method `minmax` của class `ArrayAlg`**? Ta có thể khai báo nó như trên. Cách này **trông chỉn chu hơn** so với chỉ viết `T extends Comparable`, và **chạy tốt với nhiều class**. Ví dụ khi tính minimum của một array `String` thì `T` là type `String`, và `String` là subtype của `Comparable<String>`. Nhưng ta **gặp vấn đề khi xử lý array các object `LocalDate`**. Sự thể là `LocalDate` implement `ChronoLocalDate`, mà `ChronoLocalDate` extends `Comparable<ChronoLocalDate>`. Vậy nên **`LocalDate` implement `Comparable<ChronoLocalDate>` chứ không phải `Comparable<LocalDate>`**.

> *"In a situation such as this one, supertypes come to the rescue:"*

```java
public static <T extends Comparable<? super T>> Pair<T> minmax(T[] a)
```

> *"Now the compareTo method has the form"*

```java
int compareTo(? super T)
```

> *"Maybe it is declared to take an object of type T, or—for example, when T is LocalDate—a supertype of T. At any rate, it is safe to pass an object of type T to the compareTo method."*

**Dịch:** Trong tình huống như thế này, **supertype đến giải cứu**. Giờ method `compareTo` có dạng `int compareTo(? super T)`. Có thể nó được khai báo nhận object type `T`, hoặc — ví dụ khi `T` là `LocalDate` — **một supertype của `T`**. Dù thế nào thì **truyền một object type `T` vào method `compareTo` là an toàn**.

> *"To the uninitiated, a declaration such as <T extends Comparable<? super T>> is bound to look intimidating. This is unfortunate, because the intent of this declaration is to help application programmers by removing unnecessary restrictions on the call arguments. Application programmers with no interest in generics will probably learn quickly to gloss over these declarations and just take for granted that library programmers will do the right thing. If you are a library programmer, you'll need to get used to wildcards, or your users will curse you and throw random casts at their code until it compiles."*

**Dịch:** Với người chưa quen, một khai báo như `<T extends Comparable<? super T>>` **chắc chắn trông đáng sợ**. Đáng tiếc, vì mục đích của khai báo này là **giúp lập trình viên ứng dụng bằng cách gỡ bỏ những hạn chế không cần thiết lên argument của lời gọi**. Lập trình viên ứng dụng không quan tâm tới generic **rồi sẽ nhanh chóng học cách lướt qua các khai báo này** và mặc định rằng lập trình viên library sẽ làm điều đúng đắn. Còn **nếu bạn là lập trình viên library, bạn phải làm quen với wildcard**, không thì **người dùng sẽ nguyền rủa bạn và ném cast bừa bãi vào code của họ cho tới khi nó compile được**.

> **Note (sách):** *"Another common use for supertype bounds is a parameter type of a functional interface. For example, the Collection interface has a method"*
>
> ```java
> default boolean removeIf(Predicate<? super E> filter)
> ```
>
> *"The method removes all elements that fulfill the given predicate. For example, if you hate employees with odd hash codes, you can remove them like this:"*
>
> ```java
> ArrayList<Employee> staff = . . .;
> Predicate<Object> oddHashCode = obj -> obj.hashCode() % 2 != 0;
> staff.removeIf(oddHashCode);
> ```
>
> *"You want to be able to pass a Predicate<Object>, not just a Predicate<Employee>. The super wildcard makes that possible."*
>
> **Dịch:** Một công dụng phổ biến khác của supertype bound là **kiểu parameter của một functional interface** — xem [[02 - Lambda Expressions]]. Ví dụ interface `Collection` có method `removeIf`. Method này **xoá mọi phần tử thoả predicate đã cho**. Bạn muốn **truyền được cả `Predicate<Object>` chứ không chỉ `Predicate<Employee>`**. **Wildcard `super` làm điều đó khả thi.**

---

## 8.7.3. Unbounded Wildcards

> *"You can even use wildcards with no bounds at all—for example, Pair<?>. At first glance, this looks identical to the raw Pair type. Actually, the types are very different. The type Pair<?> has methods such as"*

```java
? getFirst()
void setFirst(?)
```

> *"The return value of getFirst can only be assigned to an Object. The setFirst method can never be called, not even with an Object. That's the essential difference between Pair<?> and Pair: you can call the setFirst method of the raw Pair class with any Object."*

**Dịch:** Bạn thậm chí **dùng được wildcard hoàn toàn không có bound** — ví dụ `Pair<?>`. Thoạt nhìn, cái này **trông y hệt raw type `Pair`**. Thực ra **hai type rất khác nhau**. Giá trị trả về của `getFirst` **chỉ gán được vào một `Object`**. Method `setFirst` **không bao giờ gọi được, kể cả với một `Object`**. Đó là **khác biệt cốt yếu giữa `Pair<?>` và `Pair`**: với raw class `Pair` thì bạn **gọi được `setFirst` với bất kỳ `Object` nào**.

> **Note (sách):** *"You can call setFirst(null)."*
>
> **Dịch:** Bạn **gọi được `setFirst(null)`**.

> *"Why would you ever want such a wimpy type? It is useful for very simple operations. For example, the following method tests whether a pair contains a null reference. It never needs the actual type."*

```java
public static boolean hasNulls(Pair<?> p)
{
    return p.getFirst() == null || p.getSecond() == null;
}
```

> *"You could have avoided the wildcard type by turning hasNulls into a generic method:"*

```java
public static <T> boolean hasNulls(Pair<T> p)
```

> *"However, the version with the wildcard type seems easier to read."*

**Dịch:** Tại sao lại muốn một type **yếu ớt** như vậy? Nó **hữu ích cho các thao tác rất đơn giản**. Ví dụ method trên kiểm tra xem một pair **có chứa reference `null`** không — nó **không bao giờ cần type thật**. Bạn có thể tránh wildcard type bằng cách **biến `hasNulls` thành một generic method** — xem [[03 - Generic Methods]]. Tuy nhiên **bản dùng wildcard type có vẻ dễ đọc hơn**.

---

## 8.7.4. Wildcard Capture

> *"Let us write a method that swaps the elements of a pair:"*

```java
public static void swap(Pair<?> p)
```

> *"A wildcard is not a type variable, so we can't write code that uses ? as a type. In other words, the following would be illegal:"*

```java
? t = p.getFirst(); // ERROR
p.setFirst(p.getSecond());
p.setSecond(t);
```

**Dịch:** Hãy viết một method **hoán đổi các phần tử của một pair**. **Wildcard không phải type variable**, nên ta **không viết được code dùng `?` như một type**. Nói cách khác, đoạn trên là **bất hợp lệ**.

> *"That's a problem because we need to temporarily hold the first element when we do the swapping. Fortunately, there is an interesting solution to this problem. We can write a helper method, swapHelper, like this:"*

```java
public static <T> void swapHelper(Pair<T> p)
{
    T t = p.getFirst();
    p.setFirst(p.getSecond());
    p.setSecond(t);
}
```

> *"Note that swapHelper is a generic method, whereas swap is not—it has a fixed parameter of type Pair<?>."*

> *"Now we can call swapHelper from swap:"*

```java
public static void swap(Pair<?> p) { swapHelper(p); }
```

**Dịch:** Đó là vấn đề, vì ta cần **giữ tạm phần tử thứ nhất** khi hoán đổi. May thay, **có một cách giải quyết thú vị**: viết một **helper method** tên `swapHelper`. Lưu ý `swapHelper` **là generic method**, còn `swap` **thì không** — nó có **parameter cố định type `Pair<?>`**. Giờ ta **gọi được `swapHelper` từ `swap`**.

> *"In this case, the parameter T of the swapHelper method captures the wildcard. It isn't known what type the wildcard denotes, but it is a definite type, and the definition of <T>swapHelper makes perfect sense when T denotes that type."*

**Dịch:** Trong trường hợp này, **parameter `T` của method `swapHelper` "bắt" (capture) wildcard**. **Không biết wildcard chỉ type nào**, nhưng **nó là một type xác định**, và định nghĩa `<T> swapHelper` **hoàn toàn hợp lý khi `T` chỉ chính type đó**.

> *"Of course, in this case, we were not compelled to use a wildcard. We could have directly implemented <T> void swap(Pair<T> p) as a generic method without wildcards. However, consider this example in which a wildcard type occurs naturally in the middle of a computation:"*

```java
public static void maxminBonus(Manager[] a, Pair<? super Manager> result)
{
    minmaxBonus(a, result);
    PairAlg.swapHelper(result); // OK--swapHelper captures wildcard type
}
```

> *"Here, the wildcard capture mechanism cannot be avoided."*

**Dịch:** Dĩ nhiên trong trường hợp này **ta không bị buộc phải dùng wildcard** — có thể implement thẳng `<T> void swap(Pair<T> p)` như một generic method không wildcard. Tuy nhiên hãy xét ví dụ trên, nơi một **wildcard type xuất hiện một cách tự nhiên ở giữa quá trình tính toán**. Ở đây, **cơ chế wildcard capture là không thể tránh khỏi**.

> *"Wildcard capture is only legal in very limited circumstances. The compiler must be able to guarantee that the wildcard represents a single definite type. For example, the T in ArrayList<Pair<T>> can never capture the wildcard in ArrayList<Pair<?>>. The array list might hold two Pair<?>, each of which has a different type for ?."*

**Dịch:** **Wildcard capture chỉ hợp lệ trong hoàn cảnh rất hạn chế.** Compiler **phải bảo đảm được rằng wildcard đại diện cho một type xác định duy nhất**. Ví dụ, `T` trong `ArrayList<Pair<T>>` **không bao giờ capture được wildcard trong `ArrayList<Pair<?>>`** — array list đó có thể chứa **hai `Pair<?>`, mỗi cái có một type khác nhau cho `?`**. Xem [[03 - Generic Array Lists]].

> *"The test program in Listing 8.3 gathers up the various methods discussed in the preceding sections so you can see them in context."*

**Dịch:** Chương trình thử nghiệm ở Listing 8.3 **gom lại các method đã bàn ở những section trước** để bạn thấy chúng **trong ngữ cảnh**.

### Listing 8.3 — `pair3/PairTest3.java`

```java
package pair3;

/**
 * @version 1.01 2012-01-26
 * @author Cay Horstmann
 */
public class PairTest3
{
    public static void main(String[] args)
    {
        var ceo = new Manager("Gus Greedy", 800000, 2003, 12, 15);
        var cfo = new Manager("Sid Sneaky", 600000, 2003, 12, 15);
        var buddies = new Pair<Manager>(ceo, cfo);
        printBuddies(buddies);

        ceo.setBonus(1000000);
        cfo.setBonus(500000);
        Manager[] managers = { ceo, cfo };

        var result = new Pair<Employee>();
        minmaxBonus(managers, result);
        System.out.println("first: " + result.getFirst().getName()
            + ", second: " + result.getSecond().getName());
        maxminBonus(managers, result);
        System.out.println("first: " + result.getFirst().getName()
            + ", second: " + result.getSecond().getName());
    }

    public static void printBuddies(Pair<? extends Employee> p)
    {
        Employee first = p.getFirst();
        Employee second = p.getSecond();
        System.out.println(first.getName() + " and " + second.getName() + " are buddies.");
    }

    public static void minmaxBonus(Manager[] a, Pair<? super Manager> result)
    {
        if (a.length == 0) return;
        Manager min = a[0];
        Manager max = a[0];
        for (int i = 1; i < a.length; i++)
        {
            if (min.getBonus() > a[i].getBonus()) min = a[i];
            if (max.getBonus() < a[i].getBonus()) max = a[i];
        }
        result.setFirst(min);
        result.setSecond(max);
    }

    public static void maxminBonus(Manager[] a, Pair<? super Manager> result)
    {
        minmaxBonus(a, result);
        PairAlg.swapHelper(result); // OK--swapHelper captures wildcard type
    }
    // can't write public static <T super manager> . . .
}

class PairAlg
{
    public static boolean hasNulls(Pair<?> p)
    {
        return p.getFirst() == null || p.getSecond() == null;
    }

    public static void swap(Pair<?> p) { swapHelper(p); }

    public static <T> void swapHelper(Pair<T> p)
    {
        T t = p.getFirst();
        p.setFirst(p.getSecond());
        p.setSecond(t);
    }
}
```

---

## Bài kế tiếp

→ [[08 - Restrictions and Limitations]] — những hạn chế của generic trong Java, hầu hết là hệ quả của type erasure.
