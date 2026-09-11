# 13 — Primitive Type Streams

> Chapter 1, Section 1.13 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.13. Primitive Type Streams

> *"So far, we have collected integers in a Stream<Integer>, even though it is clearly inefficient to wrap each integer into a wrapper object. The same is true for the other primitive types—double, float, long, short, char, byte, and boolean. The stream library has specialized types IntStream, LongStream, and DoubleStream that store primitive values directly, without using wrappers. If you want to store short, char, byte, and boolean, use an IntStream; for float, use a DoubleStream."*

**Dịch:** Từ đầu tới giờ ta gom số nguyên vào một `Stream<Integer>`, dù rõ ràng là **kém hiệu quả khi phải bọc mỗi số nguyên vào một wrapper object**. Tương tự với các primitive type khác — `double`, `float`, `long`, `short`, `char`, `byte`, `boolean`. Stream library có các **kiểu chuyên biệt `IntStream`, `LongStream`, `DoubleStream`** lưu **giá trị primitive trực tiếp, không dùng wrapper**. Nếu muốn lưu `short`, `char`, `byte`, `boolean` thì dùng **`IntStream`**; với `float` thì dùng **`DoubleStream`**.

> *"To create an IntStream, call the IntStream.of and Arrays.stream methods:"*

```java
IntStream stream = IntStream.of(1, 1, 2, 3, 5);
stream = Arrays.stream(values, from, to); // values is an int[] array
```

**Dịch:** Để tạo một `IntStream`, gọi method **`IntStream.of`** và **`Arrays.stream`**.

> *"As with object streams, you can also use the static generate and iterate methods. In addition, IntStream and LongStream have static methods range and rangeClosed that generate integer ranges with step size one:"*

```java
IntStream zeroToNinetyNine = IntStream.range(0, 100); // Upper bound is excluded
IntStream zeroToHundred = IntStream.rangeClosed(0, 100); // Upper bound is included
```

**Dịch:** Như với object stream, bạn cũng dùng được static method **`generate` và `iterate`**. Ngoài ra `IntStream` và `LongStream` có các static method **`range`** và **`rangeClosed`** sinh ra **khoảng số nguyên với bước nhảy bằng một**. `range` **loại trừ cận trên**, `rangeClosed` **bao gồm cận trên**.

---

## codePoints và chars

> *"The CharSequence interface has methods codePoints and chars that yield an IntStream of the Unicode codes of the characters or of the code units in the UTF-16 encoding. (See Chapter 1 for the sordid details.)"*

```java
String sentence = "𝕆 is the set of octonions.";
    // 𝕆 is the UTF-16 encoding of the letter 𝕆, unicode U+1D546
IntStream codes = sentence.codePoints();
    // The stream with hex values 1D546 20 69 73 20 . . .
```

**Dịch:** Interface `CharSequence` có method **`codePoints`** và **`chars`** sinh ra một **`IntStream` các mã Unicode của ký tự**, hoặc **các code unit trong encoding UTF-16**. Xem [[05 - Strings]].

---

## Chuyển qua lại: mapToInt và boxed

> *"When you have a stream of objects, you can transform it to a primitive type stream with the mapToInt, mapToLong, or mapToDouble methods. For example, if you have a stream of strings and want to process their lengths as integers, you might as well do it in an IntStream:"*

```java
Stream<String> words = . . .;
IntStream lengths = words.mapToInt(String::length);
```

**Dịch:** Khi có một stream các object, bạn biến đổi nó sang **primitive type stream** bằng **`mapToInt`, `mapToLong`, `mapToDouble`**.

> *"To convert a primitive type stream to an object stream, use the boxed method:"*

```java
Stream<Integer> integers = IntStream.range(0, 100).boxed();
```

**Dịch:** Để chuyển một primitive type stream **thành object stream**, dùng method **`boxed`**.

---

## Bốn khác biệt đáng chú ý

> *"Generally, the methods on primitive type streams are analogous to those on object streams. Here are the most notable differences:"*

**Dịch:** Nhìn chung, các method trên primitive type stream **tương ứng với** method trên object stream. Sau đây là **những khác biệt đáng chú ý nhất**.

> *"• The toArray methods return primitive type arrays."*

**Dịch:** Các method `toArray` trả về **array kiểu primitive**.

> *"• Methods that yield an optional result return an OptionalInt, OptionalLong, or OptionalDouble. These classes are analogous to the Optional class, but they have methods getAsInt, getAsLong, and getAsDouble instead of the get method."*

**Dịch:** Method sinh ra kết quả optional trả về **`OptionalInt`, `OptionalLong`, `OptionalDouble`**. Các class này **tương tự class `Optional`**, nhưng có method **`getAsInt`, `getAsLong`, `getAsDouble`** thay cho method `get`. Xem [[07 - The Optional Type]].

> *"• There are methods sum, average, max, and min that return the sum, average, maximum, and minimum. These methods are not defined for object streams."*

**Dịch:** Có các method **`sum`, `average`, `max`, `min`**. Các method này **không được định nghĩa cho object stream**.

> *"• The summaryStatistics method yields an object of type IntSummaryStatistics, LongSummaryStatistics, or DoubleSummaryStatistics that can simultaneously report the sum, count, average, maximum, and minimum of the stream."*

**Dịch:** Method **`summaryStatistics`** sinh ra object kiểu `IntSummaryStatistics` / `LongSummaryStatistics` / `DoubleSummaryStatistics`, **báo cáo đồng thời** tổng, số lượng, trung bình, lớn nhất và nhỏ nhất của stream.

> **Note (sách):** *"The Random class has methods ints, longs, and doubles that return primitive type streams of random numbers. If you need random numbers in parallel streams, use the SplittableRandom class instead."*
>
> **Dịch:** Class `Random` có method **`ints`, `longs`, `doubles`** trả về **primitive type stream các số ngẫu nhiên**. Nếu cần số ngẫu nhiên trong **parallel stream**, hãy dùng class **`SplittableRandom`**.

> *"The program in Listing 1.7 gives examples for the API of primitive type streams."*

---

### Listing 1.7 — `streams/PrimitiveTypeStreams.java`

```java
package streams;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class PrimitiveTypeStreams
{
    public static void show(String title, IntStream stream)
    {
        final int SIZE = 10;
        int[] firstElements = stream.limit(SIZE + 1).toArray();
        System.out.print(title + ": ");
        for (int i = 0; i < firstElements.length; i++)
        {
            if (i > 0) System.out.print(", ");
            if (i < SIZE) System.out.print(firstElements[i]);
            else System.out.print("...");
        }
        System.out.println();
    }

    public static void main(String[] args) throws IOException
    {
        IntStream is1 = IntStream.generate(() -> (int) (Math.random() * 100));
        show("is1", is1);
        IntStream is2 = IntStream.range(5, 10);
        show("is2", is2);
        IntStream is3 = IntStream.rangeClosed(5, 10);
        show("is3", is3);

        Path path = Paths.get("../gutenberg/alice30.txt");
        var contents = Files.readStr(path);

        Stream<String> words = Stream.of(contents.split("\\PL+"));
        IntStream is4 = words.mapToInt(String::length);
        show("is4", is4);
        var sentence = "𝕆 is the set of octonions.";
        System.out.println(sentence);
        IntStream codes = sentence.codePoints();
        System.out.println(codes.mapToObj(c -> String.format("%X ", c)).collect(
            Collectors.joining()));

        Stream<Integer> integers = IntStream.range(0, 100).boxed();
        IntStream is5 = integers.mapToInt(Integer::intValue);
        show("is5", is5);
    }
}
```

---

## API — `java.util.stream.IntStream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static IntStream range(int startInclusive, int endExclusive)` | sinh ra `IntStream` chứa các số nguyên trong khoảng đã cho (**loại trừ cận trên**) |
| `static IntStream rangeClosed(int startInclusive, int endInclusive)` | như trên, **bao gồm cận trên** |
| `static IntStream of(int... values)` | sinh ra `IntStream` với các element đã cho |
| `int[] toArray()` | sinh ra một array chứa các element của stream này |
| `int sum()` | sinh ra **tổng** các element |
| `OptionalDouble average()` | sinh ra **trung bình** các element |
| `OptionalInt max()` | sinh ra **giá trị lớn nhất** |
| `OptionalInt min()` | sinh ra **giá trị nhỏ nhất** |
| `IntSummaryStatistics summaryStatistics()` | sinh ra object mà **từ đó lấy được cả bốn giá trị trên** |
| `Stream<Integer> boxed()` | sinh ra stream các **wrapper object** cho các element của stream này |

## API — `java.util.stream.LongStream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static LongStream range(long startInclusive, long endExclusive)` | sinh ra `LongStream` chứa các số nguyên trong khoảng đã cho |
| `static LongStream rangeClosed(long startInclusive, long endInclusive)` | như trên, bao gồm cận trên |
| `static LongStream of(long... values)` | sinh ra `LongStream` với các element đã cho |
| `long[] toArray()` | sinh ra array chứa các element của stream này |
| `long sum()` | tổng các element |
| `OptionalDouble average()` | trung bình các element |
| `OptionalLong max()` | giá trị lớn nhất |
| `OptionalLong min()` | giá trị nhỏ nhất |
| `LongSummaryStatistics summaryStatistics()` | object lấy được cả bốn giá trị trên |
| `Stream<Long> boxed()` | stream các wrapper object |

## API — `java.util.stream.DoubleStream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static DoubleStream of(double... values)` | sinh ra `DoubleStream` với các element đã cho |
| `double[] toArray()` | sinh ra array chứa các element của stream này |
| `double sum()` | tổng các element |
| `OptionalDouble average()` | trung bình các element |
| `OptionalDouble max()` | giá trị lớn nhất |
| `OptionalDouble min()` | giá trị nhỏ nhất |
| `DoubleSummaryStatistics summaryStatistics()` | object lấy được cả bốn giá trị trên |
| `Stream<Double> boxed()` | stream các wrapper object |

## API — `java.lang.CharSequence` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `IntStream codePoints()` (Java 8) | sinh ra stream **mọi Unicode code point** của string này |

## API — `java.util.Random` (Java 1.0)

> *"yields streams of random numbers. If streamSize is provided, the stream is finite with the given number of elements. When bounds are provided, the elements are between randomNumberOrigin (inclusive) and randomNumberBound (exclusive)."*

**Dịch (mô tả chung):** sinh ra **stream các số ngẫu nhiên**. Nếu có `streamSize` thì stream là **hữu hạn** với số element đã cho. Khi có các cận, element nằm giữa `randomNumberOrigin` (**bao gồm**) và `randomNumberBound` (**loại trừ**).

| Method | Mô tả (dịch từ sách) |
|---|---|
| `IntStream ints()` | stream `int` ngẫu nhiên vô hạn |
| `IntStream ints(int randomNumberOrigin, int randomNumberBound)` (Java 8) | có cận |
| `IntStream ints(long streamSize)` (Java 8) | hữu hạn |
| `IntStream ints(long streamSize, int randomNumberOrigin, int randomNumberBound)` (Java 8) | hữu hạn và có cận |
| `LongStream longs()` (Java 8) | stream `long` ngẫu nhiên |
| `LongStream longs(long randomNumberOrigin, long randomNumberBound)` (Java 8) | có cận |
| `LongStream longs(long streamSize)` (Java 8) | hữu hạn |
| `LongStream longs(long streamSize, long randomNumberOrigin, long randomNumberBound)` (Java 8) | hữu hạn và có cận |
| `DoubleStream doubles()` (Java 8) | stream `double` ngẫu nhiên |
| `DoubleStream doubles(double randomNumberOrigin, double randomNumberBound)` (Java 8) | có cận |
| `DoubleStream doubles(long streamSize)` (Java 8) | hữu hạn |
| `DoubleStream doubles(long streamSize, double randomNumberOrigin, double randomNumberBound)` (Java 8) | hữu hạn và có cận |

## API — `java.util.OptionalInt` / `OptionalLong` / `OptionalDouble` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Optional(Int\|Long\|Double) of((int\|long\|double) value)` | sinh ra object optional mang **giá trị primitive** được cung cấp |
| `(int\|long\|double) getAs(Int\|Long\|Double)()` | sinh ra giá trị của object optional này, hoặc **ném `NoSuchElementException` nếu nó rỗng** |
| `(int\|long\|double) orElse((int\|long\|double) other)` | sinh ra giá trị của object optional này, hoặc **giá trị thay thế** nếu object này rỗng |
| `(int\|long\|double) orElseGet((Int\|Long\|Double)Supplier other)` | như trên, giá trị thay thế lấy từ supplier |
| `void ifPresent((Int\|Long\|Double)Consumer consumer)` | nếu object optional này **không rỗng**, truyền giá trị của nó cho `consumer` |

## API — `java.util.(Int|Long|Double)SummaryStatistics` (Java 8)

> *"yields the count, sum, average, maximum, and minimum of the collected elements."*

**Dịch:** sinh ra **số lượng, tổng, trung bình, lớn nhất và nhỏ nhất** của các element được gom.

| Method |
|---|
| `long getCount()` |
| `(int\|long\|double) getSum()` |
| `double getAverage()` |
| `(int\|long\|double) getMax()` |
| `(int\|long\|double) getMin()` |

---

## Bài kế tiếp

→ [[14 - Parallel Streams]] — cách song song hoá stream cho đúng, race condition, ordering, và khi nào parallel stream thực sự có lợi.
