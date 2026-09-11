# 01 — Why Generic Programming?

> Chapter 8, Section 8.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 8

> *"Generic classes and methods have type parameters. This allows them to describe precisely how the types should be used in the implementation. Prior to generic classes, programmers had to use the Object class for writing code that works with multiple types. This was both cumbersome and unsafe."*

**Dịch:** **Generic class** và **generic method** có **type parameter**. Nhờ đó chúng mô tả được **chính xác** cách các type nên được dùng trong phần implementation. Trước khi có generic class, lập trình viên phải dùng class `Object` để viết code chạy được với nhiều type — cách này vừa **cồng kềnh** vừa **không an toàn**.

> *"With the introduction of generics, Java has an expressive type system that allows designers to describe in detail how types of variables and methods should vary. In straightforward situations, you will find it simple to implement generic code. In more advanced cases, it can get quite complex—for implemetors. The goal is to provide classes and methods that other programmers can use without surprises."*

**Dịch:** Với sự ra đời của generic, Java có một **type system giàu khả năng biểu đạt**, cho phép người thiết kế mô tả chi tiết cách type của biến và method **biến thiên**. Trong tình huống đơn giản, viết generic code rất dễ. Trong tình huống cao cấp hơn, nó có thể **khá phức tạp — với người implement**. Mục tiêu là cung cấp class và method mà lập trình viên khác **dùng được mà không gặp bất ngờ**.

> *"The introduction of generics in Java 5 was a significant change in the Java programming language. A major design goal was to be backward compatible with earlier releases. As a result, Java generics have some uncomfortable limitations. You will learn about the benefits and challenges of generic programming in this chapter."*

**Dịch:** Việc đưa generic vào **Java 5** là một thay đổi lớn của ngôn ngữ Java. Một mục tiêu thiết kế quan trọng là **tương thích ngược** với các release trước. Hệ quả là generic của Java mang một số **hạn chế khó chịu**. Chương này nói về lợi ích lẫn thách thức của generic programming.

---

## 8.1. Why Generic Programming?

> *"Generic programming means writing code that can be reused for objects of many different types. For example, you don't want to program separate classes to collect String and File objects. And you don't have to—the single class ArrayList collects objects of any class. This is one example of generic programming."*

**Dịch:** **Generic programming** nghĩa là **viết code tái dùng được cho object thuộc nhiều type khác nhau**. Ví dụ, bạn không muốn viết hai class riêng để gom object `String` và object `File`. Và bạn **không cần phải làm thế** — chỉ một class `ArrayList` gom được object của bất kỳ class nào. Đó là **một ví dụ của generic programming**.

> *"Actually, Java had an ArrayList class before it had generic classes. Let us investigate how the mechanism for generic programming has evolved, and what that means for users and implementors."*

**Dịch:** Thật ra Java **đã có class `ArrayList` trước khi có generic class**. Hãy xem cơ chế generic programming đã tiến hoá thế nào, và điều đó có nghĩa gì với người dùng lẫn người implement.

Xem thêm [[03 - Generic Array Lists]].

---

## 8.1.1. The Advantage of Type Parameters

> *"Before generic classes were added to Java, generic programming was achieved with inheritance. The ArrayList class simply maintained an array of Object references:"*

```java
public class ArrayList // before generic classes
{
    private Object[] elementData;
    . . .
    public Object get(int i) { . . . }
    public void add(Object o) { . . . }
}
```

**Dịch:** Trước khi generic class được thêm vào Java, generic programming được thực hiện bằng **inheritance**. Class `ArrayList` đơn giản là **giữ một array các reference kiểu `Object`**.

Xem [[09 - Arrays]] và [[02 - Object The Cosmic Superclass]].

> *"This approach has two problems. A cast is necessary whenever you retrieve a value:"*

```java
ArrayList files = new ArrayList();
. . .
String filename = (String) files.get(0);
```

> *"Moreover, there is no error checking. You can add values of any class:"*

```java
files.add(new File(". . ."));
```

> *"This call compiles and runs without error. Elsewhere, casting the result of get to a String will cause an error."*

**Dịch:** Cách này có **hai vấn đề**. Thứ nhất, **luôn phải cast** mỗi khi lấy giá trị ra. Thứ hai, **không có kiểm tra lỗi** — bạn thêm được giá trị của bất kỳ class nào. Lời gọi đó **compile và chạy không báo lỗi**; nhưng ở chỗ khác, việc cast kết quả của `get` sang `String` sẽ **gây lỗi**.

> *"Generics offer a better solution: type parameters. The ArrayList class now has a type parameter that indicates the element type:"*

```java
var files = new ArrayList<String>();
```

> *"This makes your code easier to read. You can tell right away that this particular array list contains String objects."*

**Dịch:** Generic đưa ra giải pháp tốt hơn: **type parameter**. Class `ArrayList` giờ có một type parameter **cho biết element type**. Điều này khiến code **dễ đọc hơn**: nhìn phát biết ngay array list này chứa object `String`.

> **Note (sách):** *"If you declare a variable with an explicit type instead of var, you can omit the type parameter in the constructor by using the "diamond" syntax:"*
>
> ```java
> ArrayList<String> files = new ArrayList<>();
> ```
>
> *"The omitted type is inferred from the type of the variable."*
>
> *"You can use diamonds with anonymous subclasses:"*
>
> ```java
> ArrayList<String> passwords = new ArrayList<>()
> {
>     public String get(int n) { return super.get(n).replaceAll(".", "*"); }
> };
> ```
>
> **Dịch:** Nếu bạn khai báo biến với **type tường minh** thay vì `var`, bạn **bỏ được type parameter trong constructor** bằng cú pháp **"diamond"**. Type bị bỏ đi được **suy ra (infer)** từ type của biến. Dùng được diamond với **anonymous subclass**.

> *"The compiler can make good use of the type information too. No cast is required for calling get. The compiler knows that the return type is String, not Object:"*

```java
String filename = files.get(0);
```

**Dịch:** Compiler cũng **tận dụng tốt thông tin type**. **Không cần cast** khi gọi `get`. Compiler biết return type là `String`, **không phải `Object`**.

> *"The compiler also knows that the add method of an ArrayList\<String> has a parameter of type String. That is a lot safer than having an Object parameter. Now the compiler can check that you don't insert objects of the wrong type. For example, the statement"*

```java
files.add(new File(". . .")); // can only add String objects to an ArrayList<String>
```

> *"will not compile. A compiler error is much better than a class cast exception at runtime."*

**Dịch:** Compiler cũng biết method `add` của `ArrayList<String>` có parameter kiểu `String`. Như vậy **an toàn hơn nhiều** so với parameter kiểu `Object`. Giờ compiler kiểm tra được rằng bạn **không chèn object sai type**. Câu lệnh trên **sẽ không compile**. Một **lỗi compiler tốt hơn nhiều** so với một **class cast exception lúc runtime**.

> *"This is the appeal of type parameters: They make your programs easier to read and safer."*

**Dịch:** Đó chính là sức hấp dẫn của type parameter: khiến chương trình **dễ đọc hơn** và **an toàn hơn**.

| Cách làm | Cast khi `get` | Kiểm tra type khi `add` | Lỗi lộ ra lúc nào |
|---|---|---|---|
| `ArrayList` (trước generic, dùng `Object`) | **bắt buộc** | **không có** | **runtime** (class cast exception) |
| `ArrayList<String>` (type parameter) | **không cần** | **có** | **compile time** |

---

## 8.1.2. Who Wants to Be a Generic Programmer?

> *"It is easy to use a generic class such as ArrayList. Most Java programmers will simply use types such as ArrayList\<String> as if they had been built into the language, just like String[] arrays. (Of course, array lists are better than arrays because they can expand automatically.)"*

**Dịch:** **Dùng** một generic class như `ArrayList` thì dễ. Đa số lập trình viên Java cứ dùng type kiểu `ArrayList<String>` **như thể nó có sẵn trong ngôn ngữ**, giống array `String[]` vậy. (Dĩ nhiên array list tốt hơn array vì **tự động nở ra được**.)

> *"However, it is not so easy to implement a generic class. The programmers who use your code will want to plug in all sorts of classes for your type parameters. They will expect everything to work without onerous restrictions and confusing error messages. Your job as a generic programmer, therefore, is to anticipate all the potential future uses of your class."*

**Dịch:** Tuy nhiên, **implement** một generic class thì **không dễ chút nào**. Lập trình viên dùng code của bạn sẽ muốn cắm **đủ loại class** vào type parameter của bạn. Họ mong mọi thứ chạy được mà **không kèm hạn chế nặng nề hay thông báo lỗi khó hiểu**. Nhiệm vụ của bạn với tư cách generic programmer là **lường trước mọi cách dùng có thể có trong tương lai** cho class của mình.

> *"How hard can this get? Here is a typical issue that the designers of the standard class library had to grapple with. The ArrayList class has a method addAll to add all elements of another collection. A programmer may want to add all elements from an ArrayList\<Manager> to an ArrayList\<Employee>. But, of course, doing it the other way round should not be legal. How do you allow one call and disallow the other? The Java language designers invented an ingenious new concept, the wildcard type, to solve this problem. Wildcard types are rather abstract, but they allow a library builder to make methods as flexible as possible."*

**Dịch:** Khó tới mức nào? Đây là một vấn đề điển hình mà người thiết kế thư viện chuẩn phải vật lộn. Class `ArrayList` có method `addAll` để thêm mọi element của một collection khác. Một lập trình viên có thể muốn thêm mọi element từ `ArrayList<Manager>` vào `ArrayList<Employee>`. Nhưng dĩ nhiên **chiều ngược lại thì không được phép**. Làm sao **cho phép lời gọi này mà cấm lời gọi kia**? Người thiết kế ngôn ngữ Java đã phát minh một khái niệm mới rất tài tình — **wildcard type** — để giải quyết. Wildcard type khá **trừu tượng**, nhưng nó cho phép người xây thư viện làm method **linh hoạt nhất có thể**.

### Ba mức kỹ năng của generic programming

> *"Generic programming falls into three skill levels. At a basic level, you just use generic classes—typically, collections such as ArrayList—without thinking how and why they work. Most application programmers will want to stay at that level until something goes wrong. You may, however, encounter a confusing error message when mixing different generic classes, or when interfacing with legacy code that knows nothing about type parameters; at that point, you'll need to learn enough about Java generics to solve problems systematically rather than through random tinkering. Finally, of course, you may want to implement your own generic classes and methods."*

**Dịch:**

| Mức | Nội dung |
|---|---|
| **Cơ bản** | Chỉ **dùng** generic class — thường là collection như `ArrayList` — mà không nghĩ chúng chạy thế nào và vì sao. Đa số application programmer muốn dừng ở mức này **cho tới khi có chuyện** |
| **Trung gian** | Gặp **thông báo lỗi khó hiểu** khi trộn các generic class khác nhau, hoặc khi giao tiếp với **legacy code** vốn không biết gì về type parameter. Lúc đó phải học đủ về generic của Java để **giải quyết vấn đề một cách hệ thống**, thay vì mò mẫm ngẫu nhiên |
| **Cao** | **Tự implement** generic class và generic method của mình |

> *"Application programmers probably won't write lots of generic code. The JDK developers have already done the heavy lifting and supplied type parameters for all the collection classes. As a rule of thumb, only code that traditionally involved lots of casts from very general types (such as Object or the Comparable interface) will benefit from using type parameters."*

**Dịch:** Application programmer **chắc sẽ không viết nhiều generic code**. Người phát triển JDK đã làm phần nặng nhọc và cung cấp type parameter cho **mọi collection class**. Nguyên tắc chung: **chỉ code vốn dĩ phải cast nhiều từ các type rất tổng quát** (như `Object` hay interface `Comparable`) mới hưởng lợi từ type parameter.

> *"In this chapter, I will show you everything you need to know to implement your own generic code. However, I expect that most readers will use this knowledge primarily for help with troubleshooting and to satisfy their curiosity about the inner workings of the parameterized collection classes."*

**Dịch:** Chương này chỉ ra mọi thứ cần biết để tự implement generic code. Tuy nhiên tác giả **dự đoán đa số độc giả sẽ dùng kiến thức này chủ yếu để gỡ rối** và để **thoả mãn tò mò** về cách hoạt động bên trong của các collection class có parameter.

---

## Bài kế tiếp

→ [[02 - Defining a Simple Generic Class]] — định nghĩa generic class `Pair<T>` với type variable, và cách generic class hoạt động như một factory sinh ra class thường.
