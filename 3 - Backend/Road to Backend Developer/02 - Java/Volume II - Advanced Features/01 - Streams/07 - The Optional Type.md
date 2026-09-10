# 07 — The Optional Type

> Chapter 1, Section 1.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.7. The Optional Type

> *"An Optional<T> object is a wrapper for either an object of type T or no object. In the former case, we say that the value is present. The Optional<T> type is intended as a safer alternative for a reference of type T that either refers to an object or is null. But it is only safer if you use it right. The next three sections shows you how."*

**Dịch:** Một object `Optional<T>` là **wrapper** cho **hoặc một object kiểu `T`, hoặc không có object nào**. Ở trường hợp đầu, ta nói **giá trị là present (có mặt)**. Kiểu `Optional<T>` được thiết kế để thay thế **an toàn hơn** cho một reference kiểu `T` mà hoặc trỏ tới object, hoặc là `null`. Nhưng **nó chỉ an toàn hơn nếu bạn dùng đúng**.

---

## 1.7.1. Getting an Optional Value

> *"The key to using Optional effectively is to use a method that either produces an alternative if the value is not present, or consumes the value only if it is present. In this section, we look at the first strategy. Often, there is a default that you want to use when there was no match, perhaps the empty string:"*

```java
String result = optionalString.orElse("");
    // The wrapped string, or "" if none
```

**Dịch:** Chìa khoá để dùng `Optional` hiệu quả là dùng method **hoặc sinh ra một phương án thay thế nếu giá trị không có mặt**, **hoặc chỉ tiêu thụ giá trị khi nó có mặt**. Section này xét **chiến lược thứ nhất**. Thường bạn có sẵn một **giá trị mặc định** muốn dùng khi không có kết quả khớp, chẳng hạn chuỗi rỗng.

> *"You can also invoke code to compute the default:"*

```java
String result = optionalString.orElseGet(() -> System.getProperty("myapp.default"));
    // The function is only called when needed
```

**Dịch:** Bạn cũng **gọi được code để tính ra giá trị mặc định**. Function **chỉ được gọi khi cần**.

> *"Or you can throw an exception if there is no value:"*

```java
String result = optionalString.orElseThrow(IllegalStateException::new);
    // Supply a method that yields an exception object
```

**Dịch:** Hoặc bạn **ném exception** nếu không có giá trị. Cung cấp một method **sinh ra object exception**.

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T orElse(T other)` | sinh ra giá trị của `Optional` này, hoặc **`other` nếu `Optional` này rỗng** |
| `T orElseGet(Supplier<? extends T> other)` | sinh ra giá trị của `Optional` này, hoặc **kết quả của việc gọi `other`** nếu `Optional` này rỗng |
| `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)` | sinh ra giá trị của `Optional` này, hoặc **ném kết quả của việc gọi `exceptionSupplier`** nếu `Optional` này rỗng |

---

## 1.7.2. Consuming an Optional Value

> *"In the preceding section, you saw how to produce an alternative if no value is present. The other strategy for working with optional values is to consume the value only if it is present."*

**Dịch:** Section trước cho thấy cách **sinh ra phương án thay thế** khi không có giá trị. **Chiến lược còn lại** là **chỉ tiêu thụ giá trị khi nó có mặt**.

> *"The ifPresent method accepts a function. If the optional value exists, it is passed to that function. Otherwise, nothing happens."*

```java
optionalValue.ifPresent(v -> Process v);
```

> *"For example, if you want to add the value to a set if it is present, call"*

```java
optionalValue.ifPresent(v -> results.add(v));
```

> *"or simply"*

```java
optionalValue.ifPresent(results::add);
```

**Dịch:** Method `ifPresent` nhận một function. **Nếu giá trị optional tồn tại**, nó được truyền vào function đó. **Ngược lại, không có gì xảy ra**.

> *"If you want to take one action if the Optional has a value and another action if it doesn't, use ifPresentOrElse:"*

```java
optionalValue.ifPresentOrElse(
    v -> System.out.println("Found " + v),
    () -> logger.warning("No match"));
```

**Dịch:** Nếu muốn làm **một việc khi `Optional` có giá trị** và **một việc khác khi không có**, dùng **`ifPresentOrElse`**.

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void ifPresent(Consumer<? super T> action)` | nếu `Optional` này **không rỗng**, truyền giá trị của nó cho `action` |
| `void ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)` (Java 9) | nếu `Optional` này không rỗng, truyền giá trị của nó cho `action`, **ngược lại gọi `emptyAction`** |

---

## 1.7.3. Pipelining Optional Values

> *"In the preceding sections, you saw how to get a value out of an Optional object. Another useful strategy is to keep the Optional intact. You can transform the value inside an Optional by using the map method:"*

```java
Optional<String> transformed = optionalString.map(String::toUpperCase);
```

> *"If optionalString is empty, then transformed is also empty."*

**Dịch:** Các section trước cho thấy cách **lấy giá trị ra khỏi** một object `Optional`. Một chiến lược hữu ích khác là **giữ nguyên `Optional`**. Bạn biến đổi giá trị bên trong một `Optional` bằng method **`map`**. Nếu `optionalString` rỗng thì `transformed` **cũng rỗng**.

> *"Here is another example. We add a result to a list if it is present:"*

```java
optionalValue.map(results::add);
```

> *"If optionalValue is empty, nothing happens."*

**Dịch:** Nếu `optionalValue` rỗng thì **không có gì xảy ra**.

> **Note (sách):** *"This map method is the analog of the map method of the Stream interface that you have seen in Section 1.3, "The filter, map, and flatMap Methods," on p. 11. Simply imagine an optional value as a stream of size zero or one. The result again has size zero or one, and in the latter case, the function has been applied."*
>
> **Dịch:** Method `map` này **tương ứng với method `map` của interface `Stream`** đã thấy ở [[03 - The filter, map, and flatMap Methods]]. Cứ hình dung một **giá trị optional như một stream có kích thước 0 hoặc 1**. Kết quả cũng có kích thước 0 hoặc 1, và ở trường hợp sau thì function **đã được áp vào**.

> *"Similarly, you can use the filter method to only consider Optional values that fulfill a certain property before or after transforming it. If the property is not fulfilled, the pipeline yields an empty result:"*

```java
Optional<String> transformed = optionalString
    .filter(s -> s.length() >= 8)
    .map(String::toUpperCase);
```

**Dịch:** Tương tự, bạn dùng method **`filter`** để **chỉ xét những giá trị `Optional` thoả một tính chất nhất định**, trước hoặc sau khi biến đổi. Nếu tính chất **không được thoả**, pipeline sinh ra **kết quả rỗng**.

> *"You can substitute an alternative Optional for an empty Optional with the or method. The alternative is computed lazily."*

```java
Optional<String> result = optionalString.or(() -> // Supply an Optional
    alternatives.stream().findFirst());
```

> *"If optionalString has a value, then result is optionalString. If not, the lambda expression is evaluated, and its result is used."*

**Dịch:** Bạn **thay một `Optional` rỗng bằng một `Optional` thay thế** với method **`or`**. Phương án thay thế được **tính lazily**. Nếu `optionalString` có giá trị thì `result` chính là `optionalString`. Nếu không, **lambda expression được đánh giá** và kết quả của nó được dùng.

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `<U> Optional<U> map(Function<? super T,? extends U> mapper)` | sinh ra một `Optional` có giá trị là **kết quả của việc áp function đã cho lên giá trị của `Optional` này nếu có mặt**, ngược lại là `Optional` rỗng |
| `Optional<T> filter(Predicate<? super T> predicate)` | sinh ra một `Optional` mang giá trị của `Optional` này **nếu nó thoả predicate**, ngược lại là `Optional` rỗng |
| `Optional<T> or(Supplier<? extends Optional<? extends T>> supplier)` (Java 9) | sinh ra chính `Optional` này nếu nó **không rỗng**, ngược lại sinh ra cái **do supplier tạo ra** |

---

## 1.7.4. How Not to Work with Optional Values

> *"If you don't use Optional values correctly, you have no benefit over the "something or null" approach of the past."*

**Dịch:** Nếu **không dùng đúng** giá trị `Optional`, bạn **chẳng được lợi gì** so với cách tiếp cận **"có gì đó hoặc null"** ngày xưa.

> *"The get method gets the wrapped element of an Optional value if it exists, or throws a NoSuchElementException if it doesn't. Therefore,"*

```java
Optional<T> optionalValue = . . .;
optionalValue.get().someMethod()
```

> *"is no safer than"*

```java
T value = . . .;
value.someMethod();
```

**Dịch:** Method `get` lấy element được bọc trong `Optional` nếu nó tồn tại, hoặc **ném `NoSuchElementException`** nếu không. Do đó cách viết trên **không an toàn hơn chút nào** so với cách viết cũ.

> *"The isPresent method reports whether an Optional<T> object has a value. But"*

```java
if (optionalValue.isPresent()) optionalValue.get().someMethod();
```

> *"is no easier than"*

```java
if (value != null) value.someMethod();
```

**Dịch:** Method `isPresent` cho biết object `Optional<T>` **có giá trị hay không**. Nhưng cách viết đó **chẳng dễ hơn** kiểm tra `null` thông thường.

> **Note (sách):** *"Java 10 introduces a scarier-sounding synonym for the get method. Call optionalValue.orElseThrow() to make explicit that the method will throw a NoSuchElementException if the optionalValue is empty. The hope is that programmers will only call that method when it is absolutely clear that the Optional is never empty."*
>
> **Dịch:** **Java 10** giới thiệu một **từ đồng nghĩa nghe đáng sợ hơn** cho method `get`. Gọi `optionalValue.orElseThrow()` để **nói rõ ra rằng** method sẽ **ném `NoSuchElementException`** nếu `optionalValue` rỗng. Hy vọng là lập trình viên **chỉ gọi method đó khi hoàn toàn rõ ràng rằng `Optional` không bao giờ rỗng**.

### Vài lời khuyên dùng Optional cho đúng

> *"Here are a few more tips for the proper use of the Optional type:"*
>
> *"• A variable of type Optional should never be null."*
> *"• Don't use fields of type Optional. The cost is an additional object. Inside a class, using null for an absent field is manageable."*
> *"• Don't put Optional objects in a set, and don't use them as keys for a map. Collect the values instead."*

**Dịch:**

| # | Lời khuyên |
|---|---|
| 1 | Một biến kiểu `Optional` **không bao giờ được là `null`** |
| 2 | **Đừng dùng field kiểu `Optional`.** Cái giá là **thêm một object**. Bên trong một class, dùng `null` cho field vắng mặt là **quản lý được** |
| 3 | **Đừng cho object `Optional` vào set**, và **đừng dùng chúng làm key cho map**. Hãy **gom các giá trị** thay vì vậy |

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T get()` | sinh ra giá trị của `Optional` này, hoặc **ném `NoSuchElementException` nếu nó rỗng** |
| `T orElseThrow()` (Java 10) | như trên |
| `boolean isPresent()` | trả về `true` nếu `Optional` này **không rỗng** |

---

## 1.7.5. Creating Optional Values

> *"So far, we have discussed how to consume an Optional object someone else created. If you want to write a method that creates an Optional object, there are several static methods for that purpose, including Optional.of(result) and Optional.empty(). For example,"*

```java
public static Optional<Double> inverse(Double x)
{
    return x == 0 ? Optional.empty() : Optional.of(1 / x);
}
```

**Dịch:** Từ đầu tới giờ ta bàn về cách **tiêu thụ** một object `Optional` do người khác tạo. Nếu bạn muốn **viết method tạo ra object `Optional`**, có vài static method phục vụ việc đó, gồm **`Optional.of(result)`** và **`Optional.empty()`**.

> *"The ofNullable method is intended as a bridge from possibly null values to optional values. Optional.ofNullable(obj) returns Optional.of(obj) if obj is not null and Optional.empty() otherwise."*

**Dịch:** Method **`ofNullable`** được thiết kế làm **cầu nối từ các giá trị có thể null sang giá trị optional**. `Optional.ofNullable(obj)` trả về `Optional.of(obj)` nếu `obj` **không null**, ngược lại trả về `Optional.empty()`.

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Optional<T> of(T value)` | sinh ra `Optional` mang giá trị đã cho. Nếu `value` là `null`, method này **ném `NullPointerException`** |
| `static <T> Optional<T> ofNullable(T value)` | sinh ra `Optional` mang giá trị đã cho. Nếu `value` là `null` thì sinh ra **`Optional` rỗng** |
| `static <T> Optional<T> empty()` | sinh ra một **`Optional` rỗng** |

---

## 1.7.6. Composing Optional Value Functions with flatMap

> *"Suppose you have a method f yielding an Optional<T>, and the target type T has a method g yielding an Optional<U>. If they were normal methods, you could compose them by calling s.f().g(). But that composition doesn't work since s.f() has type Optional<T>, not T. Instead, call"*

```java
Optional<U> result = s.f().flatMap(T::g);
```

> *"If s.f() is present, then g is applied to it. Otherwise, an empty Optional<U> is returned."*

**Dịch:** Giả sử bạn có method `f` sinh ra `Optional<T>`, và kiểu đích `T` có method `g` sinh ra `Optional<U>`. Nếu chúng là method thường, bạn **kết hợp chúng bằng `s.f().g()`**. Nhưng cách kết hợp đó **không chạy** vì `s.f()` có kiểu `Optional<T>` **chứ không phải `T`**. Thay vào đó hãy dùng `flatMap`. Nếu `s.f()` có mặt thì `g` được áp lên nó, ngược lại trả về **`Optional<U>` rỗng**.

> *"Clearly, you can repeat that process if you have more methods or lambdas that yield Optional values. You can then build a pipeline of steps, simply by chaining calls to flatMap, that will succeed only when all parts do."*

**Dịch:** Rõ ràng bạn **lặp lại quá trình đó được** nếu có thêm method hoặc lambda sinh ra giá trị `Optional`. Khi đó bạn dựng được một **pipeline các bước**, chỉ đơn giản bằng cách **nối chuỗi các lời gọi `flatMap`**, và pipeline này **chỉ thành công khi mọi phần đều thành công**.

> *"For example, consider the safe inverse method of the preceding section. Suppose we also have a safe square root:"*

```java
public static Optional<Double> squareRoot(Double x)
{
    return x < 0 ? Optional.empty() : Optional.of(Math.sqrt(x));
}
```

> *"Then you can compute the square root of the inverse as"*

```java
Optional<Double> result = inverse(x).flatMap(MyMath::squareRoot);
```

> *"or, if you prefer,"*

```java
Optional<Double> result
    = Optional.of(-4.0).flatMap(Demo::inverse).flatMap(Demo::squareRoot);
```

> *"If either the inverse method or the squareRoot returns Optional.empty(), the result is empty."*

**Dịch:** Nếu **hoặc `inverse` hoặc `squareRoot`** trả về `Optional.empty()` thì **kết quả là rỗng**.

> **Note (sách):** *"You have already seen a flatMap method in the Stream interface (see Section 1.3, "The filter, map, and flatMap Methods," on p. 11). That method was used to compose two methods that yield streams, by flattening out the resulting stream of streams. The Optional.flatMap method works in the same way if you interpret an optional value as having zero or one element."*
>
> **Dịch:** Bạn đã thấy method `flatMap` ở interface `Stream` (xem [[03 - The filter, map, and flatMap Methods]]). Method đó dùng để **kết hợp hai method sinh ra stream**, bằng cách **làm phẳng stream của các stream** thu được. **`Optional.flatMap` hoạt động y hệt** nếu bạn hiểu một giá trị optional là **có 0 hoặc 1 element**.

### API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `<U> Optional<U> flatMap(Function<? super T,? extends Optional<? extends U>> mapper)` | sinh ra **kết quả của việc áp `mapper` lên giá trị trong `Optional` này nếu có mặt**, ngược lại là optional rỗng |

---

## 1.7.7. Turning an Optional into a Stream

> *"The stream method turns an Optional<T> into a Stream<T> with zero or one element. Sure, why not, but why would you ever want that?"*

**Dịch:** Method `stream` biến một `Optional<T>` thành một **`Stream<T>` có 0 hoặc 1 element**. Được thôi, nhưng **để làm gì mới được chứ?**

> *"This becomes useful with methods that return an Optional result. Suppose you have a stream of user IDs and a method"*

```java
Optional<User> lookup(String id)
```

> *"How do you get a stream of users, skipping those IDs that are invalid?"*

> *"Of course, you can filter out the invalid IDs and then apply get to the remaining ones:"*

```java
Stream<String> ids = . . .;
Stream<User> users = ids.map(Users::lookup)
    .filter(Optional::isPresent)
    .map(Optional::get);
```

**Dịch:** Điều này **trở nên hữu ích với những method trả về kết quả `Optional`**. Giả sử bạn có một stream các user ID và một method `lookup`. Làm sao lấy được stream các user, **bỏ qua những ID không hợp lệ**? Tất nhiên bạn **lọc bỏ các ID không hợp lệ** rồi áp `get` lên phần còn lại.

> *"But that uses the isPresent and get methods that we warned about. It is more elegant to call"*

```java
Stream<User> users = ids.map(Users::lookup)
    .flatMap(Optional::stream);
```

> *"Each call to stream returns a stream with zero or one element. The flatMap method combines them all. That means the nonexistent users are simply dropped."*

**Dịch:** Nhưng cách đó dùng `isPresent` và `get` — hai method **ta đã cảnh báo**. **Thanh lịch hơn** là gọi `flatMap(Optional::stream)`. Mỗi lời gọi `stream` trả về stream **0 hoặc 1 element**. `flatMap` **gộp tất cả lại**. Nghĩa là các user **không tồn tại đơn giản bị loại bỏ**.

> **Note (sách):** *"In this section, we consider the happy scenario in which we have a method that returns an Optional value. These days, many methods return null when there is no valid result. Suppose Users.classicLookup(id) returns a User object or null, not an Optional<User>. Then you can of course filter out the null values:"*
>
> ```java
> Stream<User> users = ids.map(Users::classicLookup)
>     .filter(Objects::nonNull);
> ```
>
> *"But if you prefer the flatMap approach, you can use"*
>
> ```java
> Stream<User> users = ids.flatMap(
>     id -> Stream.ofNullable(Users.classicLookup(id)));
> ```
>
> *"or"*
>
> ```java
> Stream<User> users = ids.map(Users::classicLookup)
>     .flatMap(Stream::ofNullable);
> ```
>
> *"The call Stream.ofNullable(obj) yields an empty stream if obj is null or a stream just containing obj otherwise."*
>
> **Dịch:** Section này xét **kịch bản đẹp** khi ta có method trả về giá trị `Optional`. Thời nay **nhiều method trả về `null`** khi không có kết quả hợp lệ. Giả sử `Users.classicLookup(id)` trả về một object `User` **hoặc `null`**, chứ không phải `Optional<User>`. Khi đó tất nhiên bạn **lọc bỏ các giá trị `null`** được. Nhưng nếu thích cách dùng `flatMap` thì dùng **`Stream.ofNullable`**. Lời gọi `Stream.ofNullable(obj)` sinh ra **stream rỗng nếu `obj` là `null`**, ngược lại sinh ra stream **chỉ chứa `obj`**.

> *"The example program in Listing 1.3 demonstrates the Optional API."*

---

### Listing 1.3 — `optional/OptionalTest.java`

```java
package optional;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;

public class OptionalTest
{
    public static void main(String[] args) throws IOException
    {
        var contents = Files.readStr(
            Paths.get("../gutenberg/alice30.txt"));
        List<String> wordList = List.of(contents.split("\\PL+"));

        Optional<String> optionalValue = wordList.stream()
            .filter(s -> s.contains("fred"))
            .findFirst();
        System.out.println(optionalValue.orElse("No word") + " contains fred");

        Optional<String> optionalString = Optional.empty();
        String result = optionalString.orElse("N/A");
        System.out.println("result: " + result);
        result = optionalString.orElseGet(() -> Locale.getDefault().getDisplayName());
        System.out.println("result: " + result);
        try
        {
            result = optionalString.orElseThrow(IllegalStateException::new);
            System.out.println("result: " + result);
        }
        catch (Throwable t)
        {
            t.printStackTrace();
        }

        optionalValue = wordList.stream()
            .filter(s -> s.contains("red"))
            .findFirst();
        optionalValue.ifPresent(s -> System.out.println(s + " contains red"));

        var results = new HashSet<String>();
        optionalValue.ifPresent(results::add);
        Optional<Boolean> added = optionalValue.map(results::add);
        System.out.println(added);

        System.out.println(inverse(4.0).flatMap(OptionalTest::squareRoot));
        System.out.println(inverse(-1.0).flatMap(OptionalTest::squareRoot));
        System.out.println(inverse(0.0).flatMap(OptionalTest::squareRoot));
        Optional<Double> result2 = Optional.of(-4.0)
            .flatMap(OptionalTest::inverse).flatMap(OptionalTest::squareRoot);
        System.out.println(result2);
    }

    public static Optional<Double> inverse(Double x)
    {
        return x == 0 ? Optional.empty() : Optional.of(1 / x);
    }

    public static Optional<Double> squareRoot(Double x)
    {
        return x < 0 ? Optional.empty() : Optional.of(Math.sqrt(x));
    }
}
```

## API — `java.util.Optional` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `<U> Optional<U> flatMap(Function<? super T,Optional<U>> mapper)` (Java 9) | sinh ra kết quả của việc áp `mapper` lên giá trị của `Optional` này, hoặc **`Optional` rỗng nếu `Optional` này rỗng** |

---

## Bài kế tiếp

→ [[08 - Collecting Results]] — `iterator`, `forEach`, `toArray`, và interface `Collector` cùng các factory method của `Collectors`.
