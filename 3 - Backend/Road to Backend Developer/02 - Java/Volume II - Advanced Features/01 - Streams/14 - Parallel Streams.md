# 14 — Parallel Streams

> Chapter 1, Section 1.14 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.14. Parallel Streams

> *"Streams make it easy to parallelize bulk operations. The process is mostly automatic, but you need to follow a few rules. First of all, you must have a parallel stream. You can get a parallel stream from any collection with the Collection.parallelStream() method:"*

```java
Stream<String> parallelWords = words.parallelStream();
```

**Dịch:** Stream làm cho việc **song song hoá các thao tác hàng loạt trở nên dễ dàng**. Quá trình này **hầu như tự động**, nhưng bạn cần **tuân theo vài quy tắc**. Trước hết, bạn **phải có một parallel stream**.

> *"Moreover, the parallel method converts any sequential stream into a parallel one."*

```java
Stream<String> parallelWords = Stream.of(wordArray).parallel();
```

**Dịch:** Hơn nữa, method **`parallel`** chuyển **bất kỳ sequential stream nào thành parallel stream**.

> *"As long as the stream is in parallel mode when the terminal method executes, all intermediate stream operations will be parallelized."*

**Dịch:** **Miễn là stream ở parallel mode khi terminal method thực thi**, thì **mọi intermediate operation sẽ được song song hoá**.

---

## Không được có mutable state — race condition

> *"When stream operations run in parallel, the intent is that the same result is returned as if they had run serially. It is important that the operations are stateless and can be executed in an arbitrary order."*

**Dịch:** Khi stream operation chạy song song, **chủ ý là kết quả trả về phải giống như khi chúng chạy tuần tự**. **Quan trọng là các thao tác phải stateless và thực thi được theo thứ tự tuỳ ý.**

> *"Here is an example of something you cannot do. Suppose you want to count all short words in a stream of strings:"*

```java
var shortWords = new int[12];
words.parallelStream().forEach(
    s -> { if (s.length() < 12) shortWords[s.length()]++; });
    // ERROR--race condition!
System.out.println(Arrays.toString(shortWords));
```

> *"This is very, very bad code. The function passed to forEach runs concurrently in multiple threads, each updating a shared array. As you saw in Chapter 12 of Volume I, that's a classic race condition. If you run this program multiple times, you are quite likely to get a different sequence of counts in each run—each of them wrong."*

**Dịch:** Đây là **code rất, rất tệ**. Function truyền vào `forEach` chạy **concurrent trên nhiều thread**, mỗi thread **cập nhật một array dùng chung**. Như đã thấy ở Chapter 12 của Volume I, đó là một **race condition kinh điển**. Chạy chương trình này nhiều lần, **nhiều khả năng mỗi lần bạn nhận một dãy số đếm khác nhau — và cái nào cũng sai**. Xem [[05 - Synchronization]].

> *"It is your responsibility to ensure that any functions you pass to parallel stream operations are safe to execute in parallel. The best way to do that is to stay away from mutable state. In this example, you can safely parallelize the computation if you group strings by length and count them:"*

```java
Map<Integer, Long> shortWordCounts
    = words.parallelStream()
        .filter(s -> s.length() < 12)
        .collect(groupingBy(
            String::length,
            counting()));
```

**Dịch:** **Trách nhiệm của bạn** là đảm bảo mọi function truyền vào parallel stream operation **an toàn khi chạy song song**. **Cách tốt nhất là tránh xa mutable state.** Trong ví dụ này, bạn song song hoá phép tính một cách an toàn được nếu **nhóm string theo độ dài rồi đếm chúng**.

---

## Ordering và unordered

> *"By default, streams that arise from ordered collections (arrays and lists), from ranges, generators, and iterators, or from calling Stream.sorted, are ordered. Results are accumulated in the order of the original elements, and are entirely predictable. If you run the same operations twice, you will get exactly the same results."*

**Dịch:** Mặc định, stream sinh ra từ **ordered collection (array và list)**, từ **range, generator, iterator**, hoặc từ lời gọi `Stream.sorted` đều là **ordered**. Kết quả được **tích luỹ theo thứ tự của các element gốc** và **hoàn toàn dự đoán được**. Chạy cùng các thao tác đó hai lần, bạn nhận **chính xác cùng kết quả**.

> *"Ordering does not preclude efficient parallelization. For example, when computing stream.map(fun), the stream can be partitioned into n segments, each of which is concurrently processed. Then the results are reassembled in order."*

**Dịch:** **Ordering không loại trừ việc song song hoá hiệu quả.** Ví dụ khi tính `stream.map(fun)`, stream **được chia thành `n` segment**, mỗi segment **được xử lý concurrent**. Sau đó kết quả **được ghép lại theo đúng thứ tự**.

> *"Some operations can be more effectively parallelized when the ordering requirement is dropped. By calling the Stream.unordered method, you indicate that you are not interested in ordering. One operation that can benefit from this is Stream.distinct. On an ordered stream, distinct retains the first of all equal elements. That impedes parallelization—the thread processing a segment can't know which elements to discard until the preceding segment has been processed. If it is acceptable to retain any of the unique elements, all segments can be processed concurrently (using a shared set to track duplicates)."*

**Dịch:** Một số thao tác **được song song hoá hiệu quả hơn khi bỏ yêu cầu về thứ tự**. Bằng cách gọi method **`Stream.unordered`**, bạn báo rằng **bạn không quan tâm tới thứ tự**. Một thao tác hưởng lợi từ điều này là **`Stream.distinct`**. Trên một ordered stream, `distinct` **giữ lại cái đầu tiên trong các element bằng nhau**. Điều đó **cản trở việc song song hoá** — thread xử lý một segment **không thể biết phải bỏ element nào cho tới khi segment liền trước đã được xử lý xong**. Nếu **chấp nhận giữ lại bất kỳ element duy nhất nào**, thì **mọi segment xử lý concurrent được** (dùng một set chung để theo dõi các bản trùng).

> *"You can also speed up the limit method by dropping ordering. If you just want any n elements from a stream and you don't care which ones you get, call"*

```java
Stream<String> sample = words.parallelStream().unordered().limit(n);
```

**Dịch:** Bạn cũng **tăng tốc `limit` được bằng cách bỏ ordering**. Nếu chỉ muốn **`n` element bất kỳ** từ một stream và **không quan tâm là những cái nào**.

---

## groupingByConcurrent

> *"As discussed in Section 1.9, "Collecting into Maps," on p. 30, merging maps is expensive. For that reason, the Collectors.groupingByConcurrent method uses a shared concurrent map. To benefit from parallelism, the order of the map values will not be the same as the stream order."*

```java
Map<Integer, List<String>> result = words.parallelStream().collect(
    Collectors.groupingByConcurrent(String::length));
    // Values aren't collected in stream order
```

**Dịch:** Như đã bàn ở [[09 - Collecting into Maps]], việc **merge map là tốn kém**. Vì lý do đó, method **`Collectors.groupingByConcurrent` dùng một concurrent map dùng chung**. Để **hưởng lợi từ tính song song**, **thứ tự các map value sẽ không giống thứ tự của stream**.

> *"Of course, you won't care if you use a downstream collector that is independent of the ordering, such as"*

```java
Map<Integer, Long> wordCounts
    = words.parallelStream()
        .collect(
            groupingByConcurrent(
                String::length,
                counting()));
```

**Dịch:** Tất nhiên bạn **sẽ không bận tâm** nếu dùng một **downstream collector không phụ thuộc vào thứ tự**. Xem [[11 - Downstream Collectors]].

---

## Đừng biến mọi stream thành parallel stream

> *"Don't turn all your streams into parallel streams in the hope of speeding up operations. Keep these issues in mind:"*

> *"• There is a substantial overhead to parallelization that will only pay off for very large data sets."*
> *"• Parallelizing a stream is only a win if the underlying data source can be effectively split into multiple parts."*
> *"• The thread pool that is used by parallel streams can be starved by blocking operations such as file I/O or network access."*

**Dịch:** **Đừng biến mọi stream thành parallel stream** với hy vọng tăng tốc. Hãy nhớ:

| # | Vấn đề |
|---|---|
| 1 | Việc song song hoá có **overhead đáng kể**, **chỉ bõ công với tập data rất lớn** |
| 2 | Song song hoá một stream **chỉ thắng nếu nguồn data bên dưới chia được hiệu quả thành nhiều phần** |
| 3 | Thread pool mà parallel stream dùng **có thể bị bỏ đói (starved)** bởi các **thao tác blocking** như file I/O hay truy cập mạng |

> *"Parallel streams work best with huge in-memory collections of data and computationally intensive processing."*

**Dịch:** Parallel stream **hoạt động tốt nhất với những collection data khổng lồ nằm trong bộ nhớ** và **việc xử lý nặng về tính toán**.

> **Tip (sách):** *"Prior to Java 9, parallelizing the stream returned by the Files.lines method made no sense. The data was not splittable—you had to read the first half of the file before the second half. Now the method uses a memory-mapped file, and splitting is effective. If you process the lines of a huge file, parallelizing the stream may improve performance."*
>
> **Dịch:** **Trước Java 9**, song song hoá stream do `Files.lines` trả về là **vô nghĩa**. Data **không chia được** — bạn phải đọc **nửa đầu file trước nửa sau**. Nay method này dùng **memory-mapped file**, và **việc chia có hiệu quả**. Nếu xử lý các dòng của **một file khổng lồ**, song song hoá stream **có thể cải thiện hiệu năng**.

> **Note (sách):** *"By default, parallel streams use the global fork-join pool returned by ForkJoinPool.commonPool. That is fine if your operations don't block and you don't share the pool with other tasks. There is a trick to substitute a different pool. Place your operations inside the submit method of a custom pool:"*
>
> ```java
> ForkJoinPool customPool = . . .;
> result = customPool.submit(() ->
>     stream.parallel().map(. . .).collect(. . .)).get();
> ```
>
> *"Or, asynchronously:"*
>
> ```java
> CompletableFuture.supplyAsync(() ->
>     stream.parallel().map(. . .).collect(. . .),
>     customPool).thenAccept(result -> . . .);
> ```
>
> **Dịch:** Mặc định, parallel stream dùng **global fork-join pool** trả về bởi `ForkJoinPool.commonPool`. Điều đó **ổn nếu thao tác của bạn không blocking** và bạn **không chia sẻ pool với task khác**. Có một **mẹo để thay bằng pool khác**: đặt thao tác của bạn **bên trong method `submit` của một pool tuỳ chỉnh**, hoặc làm **bất đồng bộ**. Xem [[04 - Coordinating Tasks]].

> **Note (sách):** *"If you want to parallelize stream computations based on random numbers, don't start out with a stream obtained from the Random.ints, Random.longs, or Random.doubles methods. Those streams don't split. Instead, use the ints, longs, or doubles methods of the SplittableRandom class."*
>
> **Dịch:** Nếu muốn song song hoá phép tính stream dựa trên **số ngẫu nhiên**, **đừng bắt đầu từ stream lấy từ `Random.ints`, `Random.longs`, `Random.doubles`**. Những stream đó **không chia được**. Thay vào đó, dùng method `ints`, `longs`, `doubles` của class **`SplittableRandom`**.

> *"The example program in Listing 1.8 demonstrates how to work with parallel streams."*

---

### Listing 1.8 — `parallel/ParallelStreams.java`

```java
package parallel;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import static java.util.stream.Collectors.*;

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class ParallelStreams
{
    public static void main(String[] args) throws IOException
    {
        var contents = new String(Files.readAllBytes(
            Paths.get("../gutenberg/alice30.txt")), StandardCharsets.UTF_8);
        List<String> wordList = List.of(contents.split("\\PL+"));

        // Very bad code ahead
        var shortWords = new int[10];
        wordList.parallelStream().forEach(s ->
        {
            if (s.length() < 10) shortWords[s.length()]++;
        });
        System.out.println(Arrays.toString(shortWords));

        // Try again--the result will likely be different (and also wrong)
        Arrays.fill(shortWords, 0);
        wordList.parallelStream().forEach(s ->
        {
            if (s.length() < 10) shortWords[s.length()]++;
        });
        System.out.println(Arrays.toString(shortWords));

        // Remedy: Group and count
        Map<Integer, Long> shortWordCounts = wordList.parallelStream()
            .filter(s -> s.length() < 10)
            .collect(groupingBy(String::length, counting()));

        System.out.println(shortWordCounts);

        // Downstream order not deterministic
        Map<Integer, List<String>> result = wordList.parallelStream().collect(
            Collectors.groupingByConcurrent(String::length));

        System.out.println(result.get(14));

        result = wordList.parallelStream().collect(
            Collectors.groupingByConcurrent(String::length));

        System.out.println(result.get(14));

        Map<Integer, Long> wordCounts = wordList.parallelStream().collect(
            groupingByConcurrent(String::length, counting()));

        System.out.println(wordCounts);
    }
}
```

---

## API — `java.util.stream.BaseStream<T,S extends BaseStream<T,S>>` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `S parallel()` | sinh ra một **parallel stream** có cùng element với stream này |
| `S unordered()` | sinh ra một **unordered stream** có cùng element với stream này |

## API — `java.util.Collection<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<E> parallelStream()` (Java 8) | sinh ra một **parallel stream** chứa các element của collection này |

---

> *"In this chapter, you have learned how to put the stream library of Java 8 to use. The next chapter covers another important topic: processing input and output."*

**Dịch:** Trong chương này bạn đã học cách **đưa stream library của Java 8 vào sử dụng**. Chương kế tiếp bàn về một chủ đề quan trọng khác: **xử lý input và output**.

---

## Chương kế tiếp

→ [[01 - Input Output Streams]] — object đọc/ghi dãy byte, các API input/output của Java.
