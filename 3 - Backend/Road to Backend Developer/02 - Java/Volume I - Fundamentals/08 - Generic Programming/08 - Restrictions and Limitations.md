# 08 — Restrictions and Limitations

> Chapter 8, Section 8.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.8. Restrictions and Limitations

> *"In the following sections, I discuss a number of restrictions that you need to consider when working with Java generics. Most of these restrictions are a consequence of type erasure."*

**Dịch:** Các section sau bàn về **một loạt hạn chế** bạn cần cân nhắc khi làm việc với generic của Java. **Phần lớn các hạn chế này là hệ quả của type erasure** — xem [[05 - Generic Code and the Virtual Machine]].

### Bảng tóm tắt các hạn chế (theo đầu đề section của sách)

| Section | Hạn chế |
|---|---|
| 8.8.1 | **Type parameter không instantiate được bằng primitive type** |
| 8.8.2 | **Truy vấn type lúc runtime chỉ hoạt động với raw type** |
| 8.8.3 | **Không tạo được array của parameterized type** |
| 8.8.4 | **Cảnh báo varargs** |
| 8.8.5 | **Generic varargs không trải (spread) array primitive** |
| 8.8.6 | **Không instantiate được type variable** |
| 8.8.7 | **Không dựng được generic array** |
| 8.8.8 | **Type variable không hợp lệ trong static context của generic class** |
| 8.8.9 | **Không throw cũng không catch được instance của generic class** |
| 8.8.10 | **Có thể vô hiệu hoá việc kiểm tra checked exception** |
| 8.8.11 | **Coi chừng đụng độ (clash) sau erasure** |
| 8.8.12 | **Type inference trong generic record pattern bị hạn chế** |

---

## 8.8.1. Type Parameters Cannot Be Instantiated with Primitive Types

> *"You cannot substitute a primitive type for a type parameter. Thus, there is no Pair<double>, only Pair<Double>. The reason is, of course, type erasure. After erasure, the Pair class has fields of type Object, and you can't use them to store double values."*

**Dịch:** Bạn **không thay được một primitive type vào chỗ type parameter**. Do đó **không có `Pair<double>`, chỉ có `Pair<Double>`**. Lý do dĩ nhiên là **type erasure**: sau erasure, class `Pair` có các field type `Object`, và **không dùng chúng để lưu giá trị `double` được**. Xem [[02 - Data Types]] và [[04 - Object Wrappers and Autoboxing]].

> *"This is an annoyance, to be sure, but it is consistent with the separate status of primitive types in the Java language. It is not a fatal flaw—there are only eight primitive types, and you can always handle them with separate classes and methods when wrapper types are not an acceptable substitute."*

**Dịch:** Đây đúng là **phiền toái**, nhưng **nhất quán với vị thế tách biệt của primitive type trong ngôn ngữ Java**. Nó **không phải khiếm khuyết chí mạng** — **chỉ có tám primitive type**, và bạn luôn có thể **xử lý chúng bằng class và method riêng** khi wrapper type không phải phương án thay thế chấp nhận được.

---

## 8.8.2. Runtime Type Inquiry Only Works with Raw Types

> *"Objects in the virtual machine always have a specific nongeneric type. Therefore, all type inquiries yield only the raw type. For example,"*

```java
if (a instanceof Pair<String>) // ERROR
```

> *"could only test whether a is a Pair of any type. The same is true for the test"*

```java
if (a instanceof Pair<T>) // ERROR
```

> *"or the cast"*

```java
Pair<String> p = (Pair<String>) a; // warning--can only test that a is a Pair
```

> *"To remind you of the risk, you will get a compiler error (with instanceof) or warning (with casts) when you try to inquire whether an object belongs to a generic type."*

**Dịch:** Object trong virtual machine **luôn có một type cụ thể, không generic**. Do đó **mọi truy vấn type chỉ cho ra raw type**. Ví dụ dòng trên **chỉ kiểm tra được `a` có phải một `Pair` thuộc type bất kỳ hay không**. Tương tự với phép test `instanceof Pair<T>` hay với cast. Để nhắc bạn về rủi ro, bạn **nhận compiler error (với `instanceof`)** hoặc **warning (với cast)** khi cố truy vấn xem một object có thuộc về một generic type hay không.

> *"In the same spirit, the getClass method always returns the raw type. For example:"*

```java
Pair<String> stringPair = . . .;
Pair<Employee> employeePair = . . .;
if (stringPair.getClass() == employeePair.getClass()) // they are equal
```

> *"The comparison yields true because both calls to getClass return Pair.class."*

**Dịch:** Cùng tinh thần đó, method `getClass` **luôn trả về raw type**. Phép so sánh trên **cho ra `true`**, vì **cả hai lời gọi `getClass` đều trả về `Pair.class`**. Xem [[10 - Reflection]].

---

## 8.8.3. You Cannot Create Arrays of Parameterized Types

> *"You cannot instantiate arrays of parameterized types, such as"*

```java
var table = new Pair<String>[10]; // ERROR
```

> *"What's wrong with that? After erasure, the type of table is Pair[]. You can convert it to Object[]:"*

```java
Object[] objarray = table;
```

> *"An array remembers its component type and throws an ArrayStoreException if you try to store an element of the wrong type:"*

```java
objarray[0] = "Hello"; // ERROR--component type is Pair
```

> *"But erasure renders this mechanism ineffective for generic types. The assignment"*

```java
objarray[0] = new Pair<Employee>();
```

> *"would pass the array store check but still result in a type error. For this reason, arrays of parameterized types are outlawed."*

**Dịch:** Bạn **không instantiate được array của parameterized type**. Vấn đề ở đâu? **Sau erasure, type của `table` là `Pair[]`**, và bạn **chuyển được nó thành `Object[]`**. Một array **nhớ component type của nó** và **ném `ArrayStoreException`** nếu bạn cố lưu phần tử sai type. **Nhưng erasure làm cơ chế này mất tác dụng với generic type**: phép gán `objarray[0] = new Pair<Employee>()` **qua được kiểm tra array store nhưng vẫn dẫn tới type error**. Vì lý do đó, **array của parameterized type bị cấm**. Xem [[09 - Arrays]].

> *"Note that only the creation of these arrays is outlawed. You can declare a variable of type Pair<String>[]. But you can't initialize it with a new Pair<String>[10]."*

**Dịch:** Lưu ý rằng **chỉ việc TẠO các array này bị cấm**. Bạn **khai báo được một biến type `Pair<String>[]`**, nhưng **không khởi tạo nó bằng `new Pair<String>[10]` được**.

> **Note (sách):** *"You can declare arrays of wildcard types and then cast them:"*
>
> ```java
> var table = (Pair<String>[]) new Pair<?>[10];
> ```
>
> *"The result is not safe. If you store a Pair<Employee> in table[0] and then call a String method on table[0].getFirst(), you get a ClassCastException."*
>
> **Dịch:** Bạn **khai báo được array của wildcard type rồi cast chúng**. Kết quả **không an toàn**: nếu bạn lưu một `Pair<Employee>` vào `table[0]` rồi gọi một method của `String` lên `table[0].getFirst()`, bạn **nhận `ClassCastException`**.

> **Tip (sách):** *"If you need to collect parameterized type objects, simply use an ArrayList: ArrayList<Pair<String>> is safe and effective."*
>
> **Dịch:** Nếu bạn cần **gom các object thuộc parameterized type**, đơn giản là **dùng `ArrayList`**: `ArrayList<Pair<String>>` **an toàn và hiệu quả**. Xem [[03 - Generic Array Lists]].

---

## 8.8.4. Varargs Warnings

> *"In the preceding section, you saw that Java doesn't support arrays of generic types. In this section, I discuss a related issue: passing instances of a generic type to a method with a variable number of arguments."*

> *"Consider this simple method with variable arguments:"*

```java
public static <E> void addAll(Collection<E> coll, E... elements)
{
    for (E element : elements) coll.add(element);
}
```

> *"Recall that the parameter elements is actually an array that holds all supplied arguments."*

> *"Now consider this call:"*

```java
Collection<Pair<String>> table = . . .;
Pair<String> pair1 = . . .;
Pair<String> pair2 = . . .;
addAll(table, pair1, pair2);
```

**Dịch:** Section trước cho thấy Java **không hỗ trợ array của generic type**. Section này bàn vấn đề liên quan: **truyền instance của một generic type vào method có số lượng argument thay đổi**. Nhắc lại rằng parameter `elements` **thực chất là một array chứa mọi argument được cung cấp**.

> *"In order to call this method, the Java virtual machine must make an array of Pair<String>, which is against the rules. However, the rules have been relaxed for this situation, and you only get a warning at the call site, not an error. You can suppress that warning by adding the annotation @SuppressWarnings("unchecked") to the method containing the call to addAll. However, this is an annoying burden for the callers of the addAll method. For that reason, there is another warning about "possible heap pollution" at the declaration site."*

**Dịch:** Để gọi method này, Java virtual machine **phải tạo một array của `Pair<String>`** — điều **trái quy tắc**. Tuy nhiên **quy tắc đã được nới lỏng cho tình huống này**: bạn **chỉ nhận warning tại chỗ gọi, không phải error**. Bạn **dập được warning đó** bằng cách thêm annotation `@SuppressWarnings("unchecked")` vào method chứa lời gọi `addAll`. Nhưng đó là **gánh nặng phiền phức cho người gọi `addAll`**. Vì thế **có thêm một warning nữa về "possible heap pollution" tại chỗ khai báo**.

> *"To avoid both warnings, annotate the addAll method itself with @SafeVarargs:"*

```java
@SafeVarargs
public static <E> void addAll(Collection<E> coll, E... elements)
```

> *"This method can now be called with generic types. By using the annotation, you promise that your method doesn't write to the parameter array, and doesn't pass the array to others who might do that. See the note below for an example of abuse."*

> *"The @SafeVarargs annotation can only be used with constructors and methods that are static, final, or private. Any other method could be overridden, making the annotation meaningless."*

**Dịch:** Để **tránh cả hai warning**, hãy annotate chính method `addAll` bằng **`@SafeVarargs`**. Giờ method này **gọi được với generic type**. Bằng việc dùng annotation, bạn **hứa rằng method của mình không ghi vào array parameter, và không truyền array đó cho ai khác có thể làm vậy**. Annotation `@SafeVarargs` **chỉ dùng được với constructor và method `static`, `final`, hoặc `private`** — mọi method khác **có thể bị override**, khiến annotation **trở nên vô nghĩa**.

> **Caution (sách):** *"You can use the @SafeVarargs annotation to defeat the restriction against generic array creation, using this method:"*
>
> ```java
> @SafeVarargs static <E> E[] array(E... array) { return array; }
> ```
>
> *"Now you can call"*
>
> ```java
> Pair<String>[] table = array(pair1, pair2);
> ```
>
> *"This seems convenient, but there is a hidden danger. The code"*
>
> ```java
> Object[] objarray = table;
> objarray[0] = new Pair<Employee>();
> ```
>
> *"will run without an ArrayStoreException because the array store only checks the erased type. You'll get an exception elsewhere when you work with table[0]."*
>
> **Dịch:** Bạn **dùng được `@SafeVarargs` để phá vỡ hạn chế cấm tạo generic array**. Trông thì **tiện lợi, nhưng có mối nguy ẩn**: đoạn code trên **sẽ chạy mà không có `ArrayStoreException`**, vì **array store chỉ kiểm tra type đã bị erase**. Bạn sẽ **nhận exception ở chỗ khác** khi làm việc với `table[0]`.

---

## 8.8.5. Generic Varargs Do Not Spread Primitive Arrays

> *"Recall that you can pass an array to a varargs parameter. For example, consider the addAll method of the preceding section. When the items to be added happen to be in an array, you just pass the array. The call behaves as if the elements had been "spread out":"*

```java
Collection<String> strings = . . .;
String[] moreStrings = new String[] { "Mary", "had", "a", "little", "lamb" };
addAll(strings, moreStrings);
// OK, same as addAll(strings, "Mary", "had", "a", "little", "lamb")
```

> *"Of course, the elements are not actually spread out. In fact, the converse is true. If the arguments had been individually specified, they would be gathered in an array, which would then be passed to the method. If you supply an array, it is passed directly."*

**Dịch:** Nhắc lại rằng bạn **truyền được một array vào parameter varargs**. Khi các phần tử cần thêm tình cờ đã nằm trong một array, bạn **cứ truyền thẳng array đó**. Lời gọi **hành xử như thể các phần tử đã được "trải ra" (spread out)**. Dĩ nhiên **thực tế các phần tử không hề được trải ra** — đúng ra là **ngược lại**: nếu các argument được ghi riêng lẻ thì chúng **sẽ được gom lại vào một array** rồi array đó mới được truyền vào method. Còn nếu bạn **đưa sẵn một array thì nó được truyền thẳng**.

> *"Now consider a collection of numbers:"*

```java
Collection<Integer> numbers = . . .;
int[] moreNumbers = new int[] { 11, 12, 13, 14, 15 };
addAll(numbers, moreNumbers); // ERROR
```

> *"This does not work. There is no valid match for the type variable E. An int[] cannot be converted to an Integer[]."*

**Dịch:** Đoạn này **không chạy được**. **Không có giá trị hợp lệ nào khớp cho type variable `E`** — một **`int[]` không chuyển được thành `Integer[]`**.

> *"Here is a more insidious example. The List interface has a static of method:"*

```java
public static <E> List<E> of(E... elements)
```

> *"The call"*

```java
List.of(moreStrings) // ["Mary", "had", "a", "little", "lamb"]
```

> *"yields a list of 5 elements. But"*

```java
List.of(moreNumbers)
```

> *"yields a List<int[]> of a single element, the array of five int values. The type parameter E cannot match the primitive type int, so the moreNumbers elements are not spread. Instead, the type parameter E machtes the array type int[]."*

**Dịch:** Đây là một ví dụ **hiểm hóc hơn**. Interface `List` có static method `of`. Lời gọi `List.of(moreStrings)` **cho ra một list 5 phần tử**. Nhưng `List.of(moreNumbers)` **cho ra một `List<int[]>` chỉ có một phần tử duy nhất** — chính là array chứa năm giá trị `int`. **Type parameter `E` không khớp được với primitive type `int`**, nên các phần tử của `moreNumbers` **không được trải ra**; thay vào đó **type parameter `E` khớp với array type `int[]`**.

---

## 8.8.6. You Cannot Instantiate Type Variables

> *"You cannot use type variables in an expression such as new T(. . .). For example, the following Pair<T> constructor is illegal:"*

```java
public Pair() { first = new T(); second = new T(); } // ERROR
```

> *"Type erasure would change T to Object, and surely you don't want to call new Object()."*

**Dịch:** Bạn **không dùng được type variable trong biểu thức kiểu `new T(. . .)`**. Constructor `Pair<T>` trên là **bất hợp lệ**. **Type erasure sẽ đổi `T` thành `Object`**, và chắc chắn bạn **không muốn gọi `new Object()`**.

> *"The best workaround is to make the caller provide a constructor expression. For example:"*

```java
Pair<String> p = Pair.makePair(String::new);
```

> *"The makePair method receives a Supplier<T>, the functional interface for a function with no parameters and a result of type T:"*

```java
public static <T> Pair<T> makePair(Supplier<T> constr)
{
    return new Pair<>(constr.get(), constr.get());
}
```

**Dịch:** **Cách khắc phục tốt nhất là để người gọi cung cấp một constructor expression.** Method `makePair` nhận một **`Supplier<T>`** — functional interface cho một hàm **không có parameter và trả về kết quả type `T`**. Xem [[02 - Lambda Expressions]].

> *"A more traditional workaround is to construct generic objects through reflection, by calling the Constructor.newInstance method. Unfortunately, the details are a bit complex. You cannot call"*

```java
first = T.class.getConstructor().newInstance(); // ERROR
```

> *"The expression T.class is not legal because it would erase to Object.class. Instead, you must design the API so that you are handed a Class object, like this:"*

```java
public static <T> Pair<T> makePair(Class<T> cl) throws ReflectiveOperationException
{
    Constructor<T> constr = cl.getConstructor();
    return new Pair<>(constr.newInstance(), constr.newInstance());
}
```

> *"The method is declared to throw a ReflectiveOperationException because the class might not have a no-argument constructor."*

**Dịch:** Một cách khắc phục **truyền thống hơn** là **dựng generic object qua reflection**, bằng cách gọi method `Constructor.newInstance`. Đáng tiếc, **chi tiết hơi phức tạp**. Biểu thức **`T.class` là bất hợp lệ** vì nó **sẽ erase thành `Object.class`**. Thay vào đó bạn **phải thiết kế API sao cho nhận vào một object `Class`**. Method này được khai báo **ném `ReflectiveOperationException`** vì **class có thể không có constructor không tham số**. Xem [[10 - Reflection]].

> *"When calling the method, provide a class literal as follows:"*

```java
Pair<String> p = Pair.makePair(String.class);
```

> *"Note that the Class class is itself generic. For example, String.class is an instance (indeed, the sole instance) of Class<String>. Therefore, the makePair method can infer the type of the pair that it is making."*

**Dịch:** Khi gọi method, hãy **cung cấp một class literal**. Lưu ý **class `Class` bản thân nó là generic**: `String.class` là **một instance (thực ra là instance duy nhất) của `Class<String>`**. Do đó method `makePair` **suy ra được type của pair mà nó đang tạo**.

---

## 8.8.7. You Cannot Construct a Generic Array

> *"Just as you cannot instantiate a single generic instance, you cannot instantiate an array. The reasons are different—an array is, after all, filled with null values, which would seem safe to construct. But an array also carries a type, which is used to monitor array stores in the virtual machine. That type is erased. For example, consider"*

```java
public static <T extends Comparable> T[] minmax(T... a)
{
    T[] mm = new T[2]; // ERROR
    . . .
}
```

> *"Type erasure would cause this method to always construct an array Comparable[2]."*

**Dịch:** Cũng như **không instantiate được một generic instance đơn lẻ**, bạn **không instantiate được một array**. **Lý do thì khác**: dù sao thì array **được lấp đầy bằng giá trị `null`**, nghe có vẻ dựng lên là an toàn. Nhưng array **còn mang theo một type**, dùng để **giám sát các thao tác lưu vào array trong virtual machine**. **Type đó bị erase.** Type erasure **khiến method trên luôn dựng ra một array `Comparable[2]`**.

> *"If the array is only used as a private instance field of a class, you can declare the element type of the array to be the erased type and use casts. For example, the ArrayList class can be implemented as follows:"*

```java
public class ArrayList<E>
{
    private Object[] elements;
    . . .
    @SuppressWarnings("unchecked") public E get(int n) { return (E) elements[n]; }
    public void set(int n, E e) { elements[n] = e; } // no cast needed
}
```

**Dịch:** Nếu array **chỉ được dùng làm private instance field của một class**, bạn **khai báo element type của array là type đã erase rồi dùng cast**. Ví dụ class `ArrayList` **implement được như trên**.

> *"This technique does not work for our minmax method since we are returning a T[] array, and a runtime error results if we lie about its type. Suppose we implement"*

```java
public static <T extends Comparable> T[] minmax(T... a)
{
    var result = new Comparable[2]; // array of erased type
    . . .
    return (T[]) result; // compiles with warning
}
```

> *"The call"*

```java
String[] names = ArrayAlg.minmax("Tom", "Dick", "Harry");
```

> *"compiles without any warning. A ClassCastException occurs when the Comparable[] reference is cast to String[] after the method returns."*

**Dịch:** Kỹ thuật này **không dùng được cho method `minmax`** của ta, vì ta **đang trả về một array `T[]`**, và **nếu nói dối về type của nó thì sinh ra runtime error**. Lời gọi trên **compile không hề có warning**. Một **`ClassCastException` xảy ra khi reference `Comparable[]` bị cast sang `String[]`** sau khi method trả về.

> *"In this situation, it is best to ask the user to provide an array constructor expression:"*

```java
String[] names = ArrayAlg.minmax(String[]::new, "Tom", "Dick", "Harry");
```

> *"The constructor expression String[]::new denotes a function that, given the desired length, constructs a String array of that length."*

> *"The method uses that parameter to produce an array of the correct type:"*

```java
public static <T extends Comparable> T[] minmax(IntFunction<T[]> constr, T... a)
{
    T[] result = constr.apply(2);
    . . .
}
```

**Dịch:** Trong tình huống này, **tốt nhất là yêu cầu người dùng cung cấp một array constructor expression**. Constructor expression `String[]::new` **chỉ một hàm mà khi cho độ dài mong muốn thì dựng ra một array `String` có độ dài đó**. Method **dùng parameter đó để tạo ra array đúng type**.

> *"A more old-fashioned approach is to use reflection and call Array.newInstance:"*

```java
public static <T extends Comparable> T[] minmax(T... a)
{
    var result = (T[]) Array.newInstance(a.getClass().getComponentType(), 2);
    . . .
}
```

**Dịch:** Một cách **cổ điển hơn** là **dùng reflection và gọi `Array.newInstance`**.

> *"The toArray method of the ArrayList class is not so lucky. It needs to produce a T[] array, but it doesn't have the component type. Therefore, there are two variants:"*

```java
Object[] toArray()
T[] toArray(T[] result)
```

> *"The second method receives an array argument. If the array is large enough, it is used. Otherwise, a new array of sufficient size is created, using the component type of result."*

**Dịch:** Method `toArray` của class `ArrayList` **không may mắn như vậy**: nó cần **tạo ra một array `T[]`** nhưng **không có component type**. Vì thế **có hai biến thể**. Method thứ hai **nhận một argument là array**: nếu array **đủ lớn thì nó được dùng luôn**; nếu không, **một array mới đủ kích thước được tạo**, dùng **component type của `result`**.

---

## 8.8.8. Type Variables Are Not Valid in Static Contexts of Generic Classes

> *"You cannot reference type variables in static fields or methods. For example, the following clever idea won't work:"*

```java
public class Singleton<T>
{
    private static T singleInstance; // ERROR

    public static T getSingleInstance() // ERROR
    {
        if (singleInstance == null) construct new instance of T
        return singleInstance;
    }
}
```

> *"If this could be done, then a program could declare a Singleton<Random> to share a random number generator and a Singleton<JFileChooser> to share a file chooser dialog. But it can't work. After type erasure there is only one Singleton class, and only one singleInstance field. For that reason, static fields and methods with type variables are simply outlawed."*

**Dịch:** Bạn **không tham chiếu được type variable trong static field hoặc static method**. **Ý tưởng thông minh** ở trên **không chạy được**. Nếu làm được, một chương trình có thể khai báo `Singleton<Random>` để chia sẻ một bộ sinh số ngẫu nhiên, và `Singleton<JFileChooser>` để chia sẻ một hộp thoại chọn file. **Nhưng không thể được**: sau type erasure **chỉ còn một class `Singleton` duy nhất, và chỉ một field `singleInstance` duy nhất**. Vì lý do đó, **static field và static method có type variable đơn giản là bị cấm**. Xem [[04 - Static Fields and Methods]].

---

## 8.8.9. You Cannot Throw or Catch Instances of a Generic Class

> *"You can neither throw nor catch objects of a generic class. In fact, it is not even legal for a generic class to extend Throwable. For example, the following definition will not compile:"*

```java
public class Problem<T> extends Exception { /* . . . */ }
// ERROR--can't extend Throwable
```

> *"However, it is OK to use type variables in exception specifications. The following is legal:"*

```java
interface CheckedConsumer<T, E extends Exception>
{
    void accept(T t) throws E;
}
```

> *"You cannot use a type variable in a catch clause. For example, the following method will not compile:"*

```java
public static <T, E extends Exception> void doWork(CheckedConsumer<T, E> c, T t)
{
    try
    {
        c.accept(t);
    }
    catch (E e) // ERROR--can't catch type variable
    {
        logger.log(ERROR, ". . .", e);
    }
}
```

**Dịch:** Bạn **không throw cũng không catch được object của một generic class**. Thực ra **một generic class thậm chí không được phép extend `Throwable`**. Tuy nhiên, **dùng type variable trong exception specification thì được** — định nghĩa `CheckedConsumer` ở trên là **hợp lệ**. Bạn **không dùng được type variable trong mệnh đề `catch`**. Xem [[02 - Catching Exceptions]].

---

## 8.8.10. You Can Defeat Checked Exception Checking

> *"A bedrock principle of Java exception handling is that you must provide a handler for all checked exceptions. You can use generics to defeat this scheme. The key ingredient is this method:"*

```java
@SuppressWarnings("unchecked")
static <T extends Throwable> void throwAs(Throwable t) throws T
{
    throw (T) t;
}
```

> *"Suppose this method is contained in an interface Task. When you have a checked exception e and call"*

```java
Task.<RuntimeException>throwAs(e);
```

> *"then the compiler will believe that e becomes an unchecked exception. The following turns all exceptions into those that the compiler believes to be unchecked:"*

```java
try
{
    do work
}
catch (Throwable t)
{
    Task.<RuntimeException>throwAs(t);
}
```

**Dịch:** Một **nguyên tắc nền tảng** của việc xử lý exception trong Java là **bạn phải cung cấp handler cho mọi checked exception**. Bạn **dùng được generic để vô hiệu hoá cơ chế này**. **Thành phần mấu chốt** là method `throwAs` ở trên. Giả sử method này nằm trong một interface `Task`. Khi bạn có một **checked exception `e`** và gọi `Task.<RuntimeException>throwAs(e)` thì **compiler sẽ tin rằng `e` trở thành một unchecked exception**. Đoạn code sau đó **biến mọi exception thành thứ mà compiler tin là unchecked**.

> *"Let's use this to solve a vexing problem. To run code in a thread, you have to place it into the run method of a class that implements the Runnable interface. But that method is not allowed to throw checked exceptions. We will provide an adaptor from a Task, whose run method is allowed to throw arbitrary exceptions, to a Runnable:"*

```java
interface Task
{
    void run() throws Exception;

    @SuppressWarnings("unchecked")
    static <T extends Throwable> void throwAs(Throwable t) throws T
    {
        throw (T) t;
    }

    static Runnable asRunnable(Task task)
    {
        return () ->
        {
            try
            {
                task.run();
            }
            catch (Exception e)
            {
                Task.<RuntimeException>throwAs(e);
            }
        };
    }
}
```

**Dịch:** Hãy dùng thủ thuật này để giải một **vấn đề gây bực bội**. Để chạy code trong một thread, bạn **phải đặt nó vào method `run` của một class implement interface `Runnable`**. Nhưng method đó **không được phép ném checked exception**. Ta sẽ cung cấp một **adaptor** từ một `Task` — mà method `run` của nó **được phép ném exception tuỳ ý** — sang một `Runnable`. Xem [[01 - Interfaces]].

> *"For example, this program runs a thread that will throw a checked exception:"*

```java
public class Test
{
    public static void main(String[] args)
    {
        var thread = new Thread(Task.asRunnable(() ->
        {
            Thread.sleep(1000);
            System.out.println("Hello, World!");
            throw new Exception("Check this out!");
        }));
        thread.start();
    }
}
```

> *"The Thread.sleep method is declared to throw an InterruptedException, and we no longer have to catch it. Since we don't interrupt the thread, that exception won't be thrown. However, the program throws a checked exception. When you run the program, you will get a stack trace."*

**Dịch:** Method `Thread.sleep` được khai báo là **ném `InterruptedException`**, và ta **không còn phải catch nó nữa**. Vì ta **không interrupt thread**, exception đó **sẽ không bị ném**. Tuy nhiên **chương trình có ném một checked exception**. Khi chạy chương trình, bạn **sẽ nhận được một stack trace**.

> *"What's so remarkable about that? Normally, you have to catch all checked exceptions inside the run method of a Runnable and wrap them into unchecked exceptions—the run method is declared to throw no checked exceptions."*

> *"But here, we don't wrap. We simply throw the exception, tricking the compiler into believing that it is not a checked exception."*

> *"Using generic classes, erasure, and the @SuppressWarnings annotation, we were able to defeat an essential part of the Java type system."*

**Dịch:** Điều đó có gì đáng chú ý? **Bình thường bạn phải catch mọi checked exception bên trong method `run` của một `Runnable` và bọc chúng vào unchecked exception** — vì method `run` được khai báo **không ném checked exception nào**. Nhưng ở đây **ta không bọc**: ta **chỉ đơn giản ném exception ra, lừa compiler tin rằng nó không phải checked exception**. Bằng cách dùng **generic class, erasure, và annotation `@SuppressWarnings`**, ta **đã vô hiệu hoá được một phần thiết yếu của hệ thống type trong Java**.

---

## 8.8.11. Beware of Clashes after Erasure

> *"It is illegal to create conditions that cause clashes when generic types are erased. Here is an example. Suppose we add an equals method to the Pair class, like this:"*

```java
public class Pair<T>
{
    public boolean equals(T value) { return first.equals(value) && second.equals(value); }
    . . .
}
```

> *"Consider a Pair<String>. Conceptually, it has two equals methods:"*

```java
boolean equals(String) // defined in Pair<T>
boolean equals(Object) // inherited from Object
```

> *"But the intuition leads us astray. The erasure of the method"*

```java
boolean equals(T)
```

> *"is"*

```java
boolean equals(Object)
```

> *"which clashes with the Object.equals method."*

> *"The remedy is, of course, to rename the offending method."*

**Dịch:** **Tạo ra tình huống gây đụng độ khi generic type bị erase là bất hợp lệ.** Xét một `Pair<String>`: **về mặt khái niệm** nó có **hai method `equals`**. Nhưng **trực giác dẫn ta đi lạc**: erasure của method `boolean equals(T)` là **`boolean equals(Object)`**, và cái đó **đụng độ với method `Object.equals`**. **Cách chữa dĩ nhiên là đổi tên method gây rắc rối.** Xem [[02 - Object The Cosmic Superclass]].

> *"The generics specification cites another rule: "To support translation by erasure, we impose the restriction that a class or type variable may not at the same time be a subtype of two interface types which are different parameterizations of the same interface." For example, the following is illegal:"*

```java
class Employee implements Comparable<Employee> { . . . }
class Manager extends Employee implements Comparable<Manager> { . . . } // ERROR
```

> *"Manager would then implement both Comparable<Employee> and Comparable<Manager>, which are different parameterizations of the same interface."*

**Dịch:** Bản đặc tả generic **nêu thêm một quy tắc nữa**: *"Để hỗ trợ việc dịch bằng erasure, chúng tôi áp đặt hạn chế rằng **một class hay type variable không được đồng thời là subtype của hai interface type vốn là hai parameterization khác nhau của cùng một interface**."* Ví dụ đoạn trên là **bất hợp lệ**: khi đó `Manager` **implement cả `Comparable<Employee>` lẫn `Comparable<Manager>`**, vốn là **hai parameterization khác nhau của cùng một interface**.

> *"It is not obvious what this restriction has to do with type erasure. After all, the nongeneric version"*

```java
class Employee implements Comparable { . . . }
class Manager extends Employee implements Comparable { . . . }
```

> *"is legal. The reason is far more subtle. There would be a conflict with the synthesized bridge methods. A class that implements Comparable<X> gets a bridge method"*

```java
public int compareTo(Object other) { return compareTo((X) other); }
```

> *"You cannot have two such methods for different types X."*

**Dịch:** **Không rõ ràng lắm** việc hạn chế này liên quan gì tới type erasure — dù sao thì **bản không generic ở trên là hợp lệ**. Lý do **tinh vi hơn nhiều**: **sẽ có xung đột với các bridge method được sinh ra**. Một class implement `Comparable<X>` **nhận được một bridge method** như trên, và bạn **không thể có hai method như vậy cho hai type `X` khác nhau**.

---

## 8.8.12. Type Inference in Generic Record Patterns is Limited

> *"When generic types are involved, the compiler may need to work pretty hard to verify exhaustiveness. Consider this incomplete hierarchy of JSON types:"*

```java
sealed interface JSONPrimitive<T> {}
record JSONNumber(double value) implements JSONPrimitive<Double> {}
record JSONBoolean(boolean value) implements JSONPrimitive<Boolean> {}
record JSONString(String value) implements JSONPrimitive<String> {}
```

> *"The switch in the following method is exhaustive:"*

```java
public static <T> double toNumber(JSONPrimitive<T> v)
{
    return switch (v)
    {
        case JSONNumber(var n) -> n;
        case JSONBoolean(var b) -> b ? 1 : 0;
        case JSONString(var s) -> {
            try
            {
                yield Double.parseDouble(s);
            }
            catch (NumberFormatException ex)
            {
                yield Double.NaN;
            }
        }
    };
}
```

> *"At first glance, it appears as if there might be an unbounded number of classes implementing JSONPrimitive<T>, but the compiler can track that there are only three of them."*

**Dịch:** Khi có generic type tham gia, **compiler có thể phải làm việc khá vất vả để xác minh tính bao phủ hết trường hợp (exhaustiveness)**. Trong ví dụ trên, `switch` là **exhaustive**. Thoạt nhìn **có vẻ như có thể có vô số class implement `JSONPrimitive<T>`**, nhưng **compiler theo dõi được rằng chỉ có ba class**. Xem [[07 - Records]].

> *"Now we want to form the sum of two JSON primitives:"*

```java
record Pair<T>(T first, T second)
{
    public static <U> Pair<U> of(U first, U second) { return new Pair<U>(first, second); }
}

public static Object sum(Pair<? extends JSONPrimitive<?>> pair)
{
    return switch (pair)
    {
        case Pair(JSONNumber(var left), JSONNumber(var right)) -> left + right;
        case Pair(JSONBoolean(var left), JSONBoolean(var right)) -> left | right;
        case Pair(JSONString(var left), JSONString(var right)) -> left.concat(right);
        // ERROR--not exhaustive
    };
}
```

> *"This switch is not exhaustive. After all, it would be possible to call sum1 as"*

```java
sum(Pair.of(new JSONNumber(42), new JSONString("Fred")))
```

> *"You can make the switch exhaustive by adding the other six combinations of JSON primitives and throwing an exception in each case. But that is a runtime check. It would be nicer to reject mixed pairs at compile time."*

**Dịch:** `switch` này **không exhaustive**. Dù sao thì **vẫn gọi được `sum` với một pair hỗn hợp** như trên. Bạn **làm cho `switch` thành exhaustive được** bằng cách **thêm sáu tổ hợp còn lại của các JSON primitive và ném exception trong mỗi case**. Nhưng đó là **kiểm tra lúc runtime** — **sẽ hay hơn nếu từ chối các pair hỗn hợp ngay lúc compile**.

> *"Here is how to only accept homogeneous pairs:"*

```java
public static <T extends JSONPrimitive<U>, U> Object sum(Pair<T> pair)
{
    return switch (pair)
    {
        case Pair(JSONNumber(var left), JSONNumber(var right)) -> left + right;
        case Pair(JSONBoolean(var left), JSONBoolean(var right)) -> left | right;
        case Pair(JSONString(var left), JSONString(var right)) -> left.concat(right);
        default -> throw new AssertionError(); // Sadly Java can't tell this won't happen
    };
}
```

> *"Now the call"*

```java
sum(Pair.of(new JSONNumber(42), new JSONString("Fred")))
```

> *"no longer compiles, since there are no matching types for T and U. Unfortunately, the default clause is necessary to make the switch exhaustive. In theory, there is enough information to determine that the pair components must be instances of the same type, but the Java type system can't prove it."*

**Dịch:** Đây là cách **chỉ chấp nhận pair đồng nhất (homogeneous)**. Giờ lời gọi trên **không compile được nữa**, vì **không có type nào khớp cho `T` và `U`**. Đáng tiếc, **mệnh đề `default` vẫn cần thiết để `switch` trở thành exhaustive**. Về lý thuyết **đã đủ thông tin để xác định rằng các thành phần của pair phải là instance của cùng một type**, nhưng **hệ thống type của Java không chứng minh được điều đó**.

> **Caution (sách):** *"Trying to use explicit type arguments does not work:"*
>
> ```java
> public static <T extends JSONPrimitive<U>, U> Object sum(Pair<T> pair)
> {
>     return switch (pair)
>     {
>         // ERROR—unsafe casts
>         case Pair<JSONNumber>(JSONNumber(var left), JSONNumber(var right))
>             -> left + right;
>         case Pair<JSONBoolean>(JSONBoolean(var left), JSONBoolean(var right))
>             -> left | right;
>         case Pair<JSONString>(JSONString(var left), JSONString(var right))
>             -> left.concat(right);
>     };
> }
> ```
>
> *"The Java compiler does not know how to prove that the cast from Pair<T> to Pair<JSONNumber> is safe when the components have type JSONNumber."*
>
> **Dịch:** **Thử dùng type argument tường minh cũng không được.** Compiler Java **không biết cách chứng minh rằng cast từ `Pair<T>` sang `Pair<JSONNumber>` là an toàn** khi các thành phần có type `JSONNumber`.

---

## Bài kế tiếp

→ [[09 - Reflection and Generics]] — reflection cho ta biết được gì về generic class khi type parameter đã bị erase.
