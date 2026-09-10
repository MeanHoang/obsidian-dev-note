# 08 — Collecting Results

> Chapter 1, Section 1.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.8. Collecting Results

> *"When you are done with a stream, you will often want to look at the results. You can call the iterator method, which yields an old-fashioned iterator that you can use to visit the elements."*

**Dịch:** Khi xong việc với một stream, thường bạn muốn **xem kết quả**. Bạn gọi method **`iterator`**, nó sinh ra một **iterator kiểu cũ** để duyệt qua các element.

> *"Alternatively, you can call the forEach method to apply a function to each element:"*

```java
stream.forEach(System.out::println);
```

**Dịch:** Hoặc bạn gọi method **`forEach`** để **áp một function lên từng element**.

> *"On a parallel stream, the forEach method traverses elements in arbitrary order. If you want to process them in stream order, call forEachOrdered instead. Of course, you might then give up some or all of the benefits of parallelism."*

**Dịch:** Trên **parallel stream**, `forEach` duyệt element theo **thứ tự tuỳ ý**. Nếu muốn xử lý theo **thứ tự của stream**, hãy gọi **`forEachOrdered`**. Tất nhiên khi đó bạn có thể **từ bỏ một phần hoặc toàn bộ lợi ích của việc song song hoá**.

---

## toArray

> *"But more often than not, you will want to collect the result in a data structure. Call toArray to get an array of the stream elements."*

> *"Since it is not possible to create a generic array at runtime, the expression stream.toArray() returns an Object[] array. If you want an array of the correct type, pass in the array constructor:"*

```java
String[] result = stream.toArray(String[]::new);
    // stream.toArray() has type Object[]
```

**Dịch:** Nhưng thường thì bạn muốn **gom kết quả vào một cấu trúc dữ liệu**. Gọi **`toArray`** để lấy array các element của stream. Vì **không thể tạo generic array lúc runtime**, biểu thức `stream.toArray()` trả về array **`Object[]`**. Nếu muốn array **đúng kiểu**, hãy truyền vào **array constructor**.

---

## collect và Collector

> *"For collecting stream elements to another target, there is a convenient collect method that takes an instance of the Collector interface. A collector is an object that accumulates elements and produces a result. The Collectors class provides a large number of factory methods for common collectors. To collect stream elements into a list, use the collector produced by Collectors.toList():"*

```java
List<String> result = stream.collect(Collectors.toList());
```

**Dịch:** Để gom element của stream vào **một đích khác**, có method tiện lợi **`collect`** nhận một instance của interface **`Collector`**. **Một collector là một object tích luỹ element và sinh ra kết quả.** Class **`Collectors`** cung cấp **rất nhiều factory method** cho các collector thông dụng.

> *"Similarly, here is how you can collect stream elements into a set:"*

```java
Set<String> result = stream.collect(Collectors.toSet());
```

> *"If you want to control which kind of set you get, use the following call instead:"*

```java
TreeSet<String> result = stream.collect(Collectors.toCollection(TreeSet::new));
```

**Dịch:** Nếu muốn **kiểm soát loại set bạn nhận được**, dùng `Collectors.toCollection`. Xem [[03 - Concrete Collections]].

---

## joining

> *"Suppose you want to collect all strings in a stream by concatenating them. You can call"*

```java
String result = stream.collect(Collectors.joining());
```

> *"If you want a delimiter between elements, pass it to the joining method:"*

```java
String result = stream.collect(Collectors.joining(", "));
```

> *"If your stream contains objects other than strings, you need to first convert them to strings, like this:"*

```java
String result = stream.map(Object::toString).collect(Collectors.joining(", "));
```

**Dịch:** Giả sử bạn muốn gom mọi string trong một stream bằng cách **nối chúng lại**. Nếu muốn có **dấu ngăn cách giữa các element**, truyền nó vào method `joining`. Nếu stream chứa object **không phải string**, bạn phải **chuyển chúng sang string trước**.

---

## summarizing(Int|Long|Double)

> *"If you want to reduce the stream results to a sum, count, average, maximum, or minimum, use one of the summarizing(Int|Long|Double) methods. These methods take a function that maps the stream objects to numbers and yield a result of type (Int|Long|Double)SummaryStatistics, simultaneously computing the sum, count, average, maximum, and minimum."*

```java
IntSummaryStatistics summary = stream.collect(
    Collectors.summarizingInt(String::length));
double averageWordLength = summary.getAverage();
double maxWordLength = summary.getMax();
```

**Dịch:** Nếu muốn rút gọn kết quả stream thành **tổng, đếm, trung bình, lớn nhất hoặc nhỏ nhất**, dùng một trong các method **`summarizingInt` / `summarizingLong` / `summarizingDouble`**. Các method này nhận một function **ánh xạ object của stream sang số** và sinh ra kết quả kiểu **`IntSummaryStatistics` / `LongSummaryStatistics` / `DoubleSummaryStatistics`**, **tính đồng thời** tổng, số lượng, trung bình, lớn nhất và nhỏ nhất.

> *"The example program in Listing 1.4 shows how to collect elements from a stream."*

---

### Listing 1.4 — `collecting/CollectingResults.java`

```java
package collecting;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class CollectingResults
{
    public static Stream<String> noVowels() throws IOException
    {
        var contents = Files.readStr(
            Paths.get("../gutenberg/alice30.txt"));

        List<String> wordList = List.of(contents.split("\\PL+"));
        Stream<String> words = wordList.stream();
        return words.map(s -> s.replaceAll("[aeiouAEIOU]", ""));
    }

    public static <T> void show(String label, Set<T> set)
    {
        System.out.print(label + ": " + set.getClass().getName());
        System.out.println("["
            + set.stream().limit(10).map(Object::toString).collect(Collectors.joining(", "))
            + "]");
    }

    public static void main(String[] args) throws IOException
    {
        Iterator<Integer> iter = Stream.iterate(0, n -> n + 1).limit(10).iterator();
        while (iter.hasNext())
            System.out.println(iter.next());

        Object[] numbers = Stream.iterate(0, n -> n + 1).limit(10).toArray();
        System.out.println("Object array:" + numbers);
            // Note it's an Object[] array

        try
        {
            var number = (Integer) numbers[0]; // OK
            System.out.println("number: " + number);
            System.out.println("The following statement throws an exception:");
            var numbers2 = (Integer[]) numbers; // Throws exception
        }
        catch (ClassCastException ex)
        {
            System.out.println(ex);
        }

        Integer[] numbers3 = Stream.iterate(0, n -> n + 1)
            .limit(10)
            .toArray(Integer[]::new);
        System.out.println("Integer array: " + numbers3);
            // Note it's an Integer[] array

        Set<String> noVowelSet = noVowels().collect(Collectors.toSet());
        show("noVowelSet", noVowelSet);

        TreeSet<String> noVowelTreeSet = noVowels().collect(
            Collectors.toCollection(TreeSet::new));
        show("noVowelTreeSet", noVowelTreeSet);

        String result = noVowels().limit(10).collect(Collectors.joining());
        System.out.println("Joining: " + result);
        result = noVowels().limit(10)
            .collect(Collectors.joining(", "));
        System.out.println("Joining with commas: " + result);

        IntSummaryStatistics summary = noVowels().collect(
            Collectors.summarizingInt(String::length));
        double averageWordLength = summary.getAverage();
        double maxWordLength = summary.getMax();
        System.out.println("Average word length: " + averageWordLength);
        System.out.println("Max word length: " + maxWordLength);
        System.out.println("forEach:");
        noVowels().limit(10).forEach(System.out::println);
    }
}
```

---

## API — `java.util.stream.BaseStream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Iterator<T> iterator()` | sinh ra một iterator để lấy các element của stream này. Đây là **terminal operation** |

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void forEach(Consumer<? super T> action)` | gọi `action` lên **từng element** của stream. **Terminal operation** |
| `Object[] toArray()` | sinh ra một array các object. **Terminal operation** |
| `<A> A[] toArray(IntFunction<A[]> generator)` | sinh ra array **kiểu `A`** khi được truyền vào constructor reference `A[]::new`. **Terminal operation** |
| `<R,A> R collect(Collector<? super T,A,R> collector)` | gom các element trong stream này bằng **collector đã cho**. Class `Collectors` có factory method cho **nhiều collector** |

## API — `java.util.stream.Collectors` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Collector<T,?,List<T>> toList()` | sinh ra collector gom element vào một **list** |
| `static <T> Collector<T,?,List<T>> toUnmodifiableList()` (Java 10) | gom element vào một **list không sửa được** |
| `static <T> Collector<T,?,Set<T>> toSet()` | sinh ra collector gom element vào một **set** |
| `static <T> Collector<T,?,Set<T>> toUnmodifiableSet()` (Java 10) | gom element vào một **set không sửa được** |
| `static <T,C extends Collection<T>> Collector<T,?,C> toCollection(Supplier<C> collectionFactory)` | sinh ra collector gom element vào một **collection tuỳ ý**. Truyền vào một constructor reference như `TreeSet::new` |
| `static Collector<CharSequence,?,String> joining()` | sinh ra collector **nối các string** |
| `static Collector<CharSequence,?,String> joining(CharSequence delimiter)` | như trên, `delimiter` được **đặt giữa các string** |
| `static Collector<CharSequence,?,String> joining(CharSequence delimiter, CharSequence prefix, CharSequence suffix)` | như trên, thêm `prefix` **trước string đầu** và `suffix` **sau string cuối**. Khi không chỉ định, các phần này **rỗng** |
| `static <T> Collector<T,?,IntSummaryStatistics> summarizingInt(ToIntFunction<? super T> mapper)` | sinh ra collector tạo object `IntSummaryStatistics`, từ đó lấy được **count, sum, average, maximum và minimum** của kết quả áp `mapper` lên từng element |
| `static <T> Collector<T,?,LongSummaryStatistics> summarizingLong(ToLongFunction<? super T> mapper)` | tương tự, với `LongSummaryStatistics` |
| `static <T> Collector<T,?,DoubleSummaryStatistics> summarizingDouble(ToDoubleFunction<? super T> mapper)` | tương tự, với `DoubleSummaryStatistics` |

## API — `IntSummaryStatistics` / `LongSummaryStatistics` / `DoubleSummaryStatistics` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `long getCount()` | sinh ra **số lượng** element được tổng kết |
| `(int\|long\|double) getSum()` | sinh ra **tổng** của các element được tổng kết, hoặc **0 nếu không có element nào** |
| `double getAverage()` | sinh ra **trung bình** của các element được tổng kết, hoặc **0 nếu không có element nào** |
| `(int\|long\|double) getMax()` | sinh ra **giá trị lớn nhất**, hoặc `(Integer\|Long\|Double).MAX_VALUE` nếu không có element nào |
| `(int\|long\|double) getMin()` | sinh ra **giá trị nhỏ nhất**, hoặc `(Integer\|Long\|Double).MIN_VALUE` nếu không có element nào |

---

## Bài kế tiếp

→ [[09 - Collecting into Maps]] — `Collectors.toMap` với key mapper, value mapper, merge function và map supplier.
