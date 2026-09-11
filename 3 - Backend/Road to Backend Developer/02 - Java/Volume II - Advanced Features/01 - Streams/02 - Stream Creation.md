# 02 — Stream Creation

> Chapter 1, Section 1.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.2. Stream Creation

> *"You have already seen that you can turn any collection into a stream with the stream method of the Collection interface. If you have an array, use the static Stream.of method instead."*

```java
Stream<String> words = Stream.of(contents.split("\\PL+"));
    // split returns a String[] array
```

**Dịch:** Bạn đã thấy có thể biến **bất kỳ collection nào** thành stream bằng method `stream` của interface `Collection`. Nếu bạn có một **array**, hãy dùng static method **`Stream.of`**.

> *"The of method has a varargs parameter, so you can construct a stream from any number of arguments:"*

```java
Stream<String> song = Stream.of("gently", "down", "the", "stream");
```

**Dịch:** Method `of` có **parameter varargs**, nên bạn dựng được stream từ **số lượng argument tuỳ ý**.

> *"Use Arrays.stream(array, from, to) to make a stream from a part of an array."*

**Dịch:** Dùng `Arrays.stream(array, from, to)` để tạo stream từ **một phần của array**. Xem [[09 - Arrays]].

> *"To make a stream with no elements, use the static Stream.empty method:"*

```java
Stream<String> silence = Stream.empty();
    // Generic type <String> is inferred; same as Stream.<String>empty()
```

**Dịch:** Để tạo stream **không có element nào**, dùng static method `Stream.empty`. Generic type `<String>` được **suy ra**, tương đương `Stream.<String>empty()`.

---

## Infinite stream: `generate` và `iterate`

> *"The Stream interface has two static methods for making infinite streams. The generate method takes a function with no arguments (or, technically, an object of the Supplier\<T> interface). Whenever a stream value is needed, that function is called to produce a value. You can get a stream of constant values as"*

```java
Stream<String> echos = Stream.generate(() -> "Echo");
```

> *"or a stream of random numbers as"*

```java
Stream<Double> randoms = Stream.generate(Math::random);
```

**Dịch:** Interface `Stream` có **hai static method để tạo stream vô hạn**. Method `generate` nhận **một function không có argument** (chính xác hơn là một object của interface `Supplier<T>`). **Mỗi khi cần một giá trị của stream**, function đó được gọi để sinh ra giá trị. Bạn có được stream các **giá trị hằng**, hoặc stream các **số ngẫu nhiên** như trên.

> *"To produce sequences such as 0 1 2 3 . . ., use the iterate method instead. It takes a "seed" value and a function (technically, a UnaryOperator\<T>) and repeatedly applies the function to the previous result. For example,"*

```java
Stream<BigInteger> integers
    = Stream.iterate(BigInteger.ZERO, n -> n.add(BigInteger.ONE));
```

**Dịch:** Để sinh dãy kiểu `0 1 2 3 ...`, dùng method **`iterate`**. Nó nhận một **giá trị "seed"** và một **function** (chính xác là `UnaryOperator<T>`), rồi **áp function đó lặp đi lặp lại lên kết quả trước đó**.

> *"The first element in the sequence is the seed BigInteger.ZERO. The second element is f(seed) which yields 1 (as a big integer). The next element is f(f(seed)) which yields 2, and so on."*

**Dịch:** Element đầu tiên của dãy là **seed** `BigInteger.ZERO`. Element thứ hai là **`f(seed)`** cho ra `1` (dạng big integer). Element kế là **`f(f(seed))`** cho ra `2`, và cứ thế.

> *"To produce a finite stream instead, add a predicate that specifies when the iteration should finish:"*

```java
var limit = new BigInteger("10000000");
Stream<BigInteger> integers
    = Stream.iterate(BigInteger.ZERO,
        n -> n.compareTo(limit) < 0,
        n -> n.add(BigInteger.ONE));
```

**Dịch:** Muốn có **stream hữu hạn**, thêm một **predicate** chỉ định khi nào việc lặp phải kết thúc.

> *"As soon as the predicate rejects an iteratively generated value, the stream ends."*

**Dịch:** **Ngay khi predicate từ chối** một giá trị được sinh ra, **stream kết thúc**.

> *"Finally, the Stream.ofNullable method makes a really short stream from an object. The stream has length 0 if the object is null or length 1 otherwise, containing just the object. This is mostly useful in conjunction with flatMap—see Section 1.7.7, "Turning an Optional into a Stream," on p. 22 for an example."*

**Dịch:** Cuối cùng, method **`Stream.ofNullable`** tạo một stream **rất ngắn** từ một object. Stream có **độ dài 0 nếu object là `null`**, ngược lại **độ dài 1**, chỉ chứa object đó. Chủ yếu hữu ích khi **kết hợp với `flatMap`** — xem [[07 - The Optional Type#1.7.7. Turning an Optional into a Stream]].

---

## Các method khác trong Java API trả về stream

> **Note (sách):** *"A number of methods in the Java API yield streams. For example, the Pattern class has a method splitAsStream that splits a CharSequence by a regular expression. You can use the following statement to split a string into words:"*
>
> ```java
> Stream<String> words = Pattern.compile("\\PL+").splitAsStream(contents);
> ```
>
> *"The Scanner.tokens method yields a stream of tokens of a scanner. Another way to get a stream of words from a string is"*
>
> ```java
> Stream<String> words = new Scanner(contents).tokens();
> ```
>
> *"The static Files.lines method returns a Stream of all lines in a file:"*
>
> ```java
> try (Stream<String> lines = Files.lines(path)) {
>     Process lines
> }
> ```
>
> **Dịch:** **Nhiều method trong Java API sinh ra stream.** Ví dụ class `Pattern` có method **`splitAsStream`** tách một `CharSequence` theo một regular expression. Method **`Scanner.tokens`** sinh ra stream các token của một scanner. Static method **`Files.lines`** trả về `Stream` **mọi dòng trong một file**. Xem [[05 - Strings]].

> **Note (sách):** *"If you have an Iterable that is not a collection, you can turn it into a stream by calling"*
>
> ```java
> StreamSupport.stream(iterable.spliterator(), false);
> ```
>
> *"If you have an Iterator and want a stream of its results, use"*
>
> ```java
> StreamSupport.stream(Spliterators.spliteratorUnknownSize(
>     iterator, Spliterator.ORDERED), false);
> ```
>
> **Dịch:** Nếu bạn có một **`Iterable` không phải collection**, biến nó thành stream bằng lời gọi trên. Nếu bạn có một **`Iterator`** và muốn stream các kết quả của nó thì dùng cách thứ hai.

---

## Noninterference — đừng sửa collection nền

> **Caution (sách):** *"It is very important that you don't modify the collection backing a stream while carrying out a stream operation. Remember that streams don't collect their data—the data is always in a separate collection. If you modify that collection, the outcome of the stream operations becomes undefined. The JDK documentation refers to this requirement as noninterference."*
>
> *"To be exact, since intermediate stream operations are lazy, it is possible to mutate the collection up to the point where the terminal operation executes. For example, the following, while certainly not recommended, will work:"*
>
> ```java
> List<String> wordList = . . .;
> Stream<String> words = wordList.stream();
> wordList.add("END");
> long n = words.distinct().count();
> ```
>
> *"But this code is wrong:"*
>
> ```java
> Stream<String> words = wordList.stream();
> words.forEach(s -> if (s.length() < 12) wordList.remove(s));
>     // ERROR--interference
> ```
>
> **Dịch:** **Rất quan trọng**: đừng sửa collection **đứng sau** một stream trong lúc đang thực hiện stream operation. Nhớ rằng **stream không gom data của nó** — data **luôn nằm ở một collection riêng**. Nếu bạn sửa collection đó, **kết quả của stream operation trở nên không xác định**. Tài liệu JDK gọi yêu cầu này là **noninterference**.
>
> Chính xác hơn: vì **intermediate operation là lazy**, ta **vẫn mutate được collection cho tới thời điểm terminal operation thực thi**. Ví dụ đầu tuy **chắc chắn không được khuyến nghị** nhưng **vẫn chạy được**. Còn ví dụ thứ hai là **sai**.

> *"The example program in Listing 1.2 shows the various ways of creating a stream."*

**Dịch:** Chương trình ví dụ ở Listing 1.2 minh hoạ **các cách khác nhau để tạo stream**.

---

### Listing 1.2 — `streams/CreatingStreams.java`

```java
package streams;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.*;

public class CreatingStreams
{
    public static <T> void show(String title, Stream<T> stream)
    {
        final int SIZE = 10;
        List<T> firstElements = stream
            .limit(SIZE + 1)
            .collect(Collectors.toList());
        System.out.print(title + ": ");
        for (int i = 0; i < firstElements.size(); i++)
        {
            if (i > 0) System.out.print(", ");
            if (i < SIZE) System.out.print(firstElements.get(i));
            else System.out.print("...");
        }
        System.out.println();
    }

    public static void main(String[] args) throws IOException
    {
        Path path = Paths.get("../gutenberg/alice30.txt");
        var contents = Files.readStr(path);

        Stream<String> words = Stream.of(contents.split("\\PL+"));
        show("words", words);
        Stream<String> song = Stream.of("gently", "down", "the", "stream");
        show("song", song);
        Stream<String> silence = Stream.empty();
        show("silence", silence);

        Stream<String> echos = Stream.generate(() -> "Echo");
        show("echos", echos);

        Stream<Double> randoms = Stream.generate(Math::random);
        show("randoms", randoms);

        Stream<BigInteger> integers = Stream.iterate(BigInteger.ONE,
            n -> n.add(BigInteger.ONE));
        show("integers", integers);

        Stream<String> wordsAnotherWay = Pattern.compile("\\PL+").splitAsStream(contents);
        show("wordsAnotherWay", wordsAnotherWay);

        try (Stream<String> lines = Files.lines(path, StandardCharsets.UTF_8))
        {
            show("lines", lines);
        }

        Iterable<Path> iterable = FileSystems.getDefault().getRootDirectories();
        Stream<Path> rootDirectories = StreamSupport.stream(iterable.spliterator(), false);
        show("rootDirectories", rootDirectories);

        Iterator<Path> iterator = Paths.get("/usr/share/dict/words").iterator();
        Stream<Path> pathComponents = StreamSupport.stream(Spliterators.spliteratorUnknownSize(
            iterator, Spliterator.ORDERED), false);
        show("pathComponents", pathComponents);
    }
}
```

---

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Stream<T> of(T... values)` | sinh ra một stream có element là **các giá trị đã cho** |
| `static <T> Stream<T> empty()` | sinh ra một stream **không có element nào** |
| `static <T> Stream<T> generate(Supplier<T> s)` | sinh ra một **stream vô hạn** mà element được dựng bằng cách **gọi function `s` lặp đi lặp lại** |
| `static <T> Stream<T> iterate(T seed, UnaryOperator<T> f)` | sinh ra stream gồm `seed`, `f` áp lên `seed`, `f` áp lên element liền trước, và cứ thế. Method này cho **stream vô hạn** |
| `static <T> Stream<T> iterate(T seed, Predicate<? super T> hasNext, UnaryOperator<T> f)` | như trên, nhưng stream **kết thúc ngay trước element đầu tiên không thoả predicate `hasNext`** |
| `static <T> Stream<T> ofNullable(T t)` (Java 9) | trả về **stream rỗng nếu `t` là `null`**, ngược lại trả về stream **chứa `t`** |

## API — `java.util.Spliterators` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Spliterator<T> spliteratorUnknownSize(Iterator<? extends T> iterator, int characteristics)` | biến một iterator thành **splittable iterator không biết kích thước**, với các characteristics đã cho (một **bit pattern** chứa các hằng như `Spliterator.ORDERED`) |

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Stream<T> stream(T[] array, int startInclusive, int endExclusive)` (Java 8) | sinh ra stream có element là **khoảng đã chỉ định của array** |

## API — `java.util.regex.Pattern` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<String> splitAsStream(CharSequence input)` (Java 8) | sinh ra stream mà element là **các phần của input được ngăn cách bởi pattern này** |

## API — `java.nio.file.Files` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Stream<String> lines(Path path)` (Java 8) | sinh ra stream mà element là **các dòng của file đã chỉ định**, với charset **UTF-8** |
| `static Stream<String> lines(Path path, Charset cs)` (Java 8) | như trên, với **charset đã cho** |

## API — `java.util.stream.StreamSupport` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Stream<T> stream(Spliterator<T> spliterator, boolean parallel)` | sinh ra stream chứa các giá trị được sinh bởi **splittable iterator đã cho** |

## API — `java.lang.Iterable` (Java 5)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Spliterator<T> spliterator()` (Java 8) | sinh ra một **splittable iterator** cho `Iterable` này. Implementation mặc định **không split và không báo kích thước** |

## API — `java.util.Scanner` (Java 5)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `public Stream<String> tokens()` (Java 9) | sinh ra stream các string trả về từ việc gọi method `next` của scanner này |

## API — `java.util.function.Supplier<T>` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T get()` | cung cấp một giá trị |

---

## Bài kế tiếp

→ [[03 - The filter, map, and flatMap Methods]] — ba phép biến đổi stream cơ bản, và vì sao `flatMap` "làm phẳng" stream của stream.
