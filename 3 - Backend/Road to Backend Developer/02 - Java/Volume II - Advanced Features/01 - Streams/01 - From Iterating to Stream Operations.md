# 01 — From Iterating to Stream Operations

> Chapter 1, Section 1.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 1

> *"Compared to collections, streams provide a view of data that lets you specify computations at a higher conceptual level. With a stream, you specify what you want to have done, not how to do it. You leave the scheduling of operations to the implementation. For example, suppose you want to compute the average of a certain property. You specify the source of data and the property, and the stream library can then optimize the computation, for example by using multiple threads for computing sums and counts and combining the results."*
>
> *"In this chapter, you will learn how to use the Java stream library, which was introduced in Java 8, to process collections in a "what, not how" style."*

**Dịch:** So với collection, stream cung cấp một **góc nhìn về dữ liệu** cho phép bạn đặc tả phép tính ở **mức khái niệm cao hơn**. Với stream, bạn nói **cái gì cần làm**, chứ không nói **làm như thế nào**. Bạn để việc **lập lịch các operation** cho phần implementation lo. Ví dụ, giả sử bạn muốn tính **giá trị trung bình của một property** nào đó. Bạn chỉ đặc tả **nguồn dữ liệu** và **property**, rồi stream library có thể **tối ưu hoá phép tính**, chẳng hạn bằng cách dùng **nhiều thread** để tính tổng và đếm rồi **gộp kết quả** lại.

Trong chương này, bạn sẽ học cách dùng **Java stream library** — được giới thiệu từ **Java 8** — để xử lý collection theo phong cách **"what, not how"**.

---

## 1.1. From Iterating to Stream Operations

> *"When you process a collection, you usually iterate over its elements and do some work with each of them. For example, suppose we want to count all long words in a book. First, let's put them into a list:"*

```java
var contents = Files.readStr(
    Paths.get("alice.txt")); // Read file into string
List<String> words = List.of(contents.split("\\PL+"));
    // Split into words; nonletters are delimiters
```

**Dịch:** Khi xử lý một collection, thường bạn **iterate qua các element** rồi làm gì đó với từng element. Ví dụ muốn **đếm mọi từ dài** trong một cuốn sách, trước hết cho chúng vào một list.

> *"Now we are ready to iterate:"*

```java
int count = 0;
for (String w : words) {
    if (w.length() > 12) count++;
}
```

> *"With streams, the same operation looks like this:"*

```java
long count = words.stream()
    .filter(w -> w.length() > 12)
    .count();
```

**Dịch:** Với stream, **cùng thao tác đó** trông như trên.

> *"Now you don't have to scan the loop for evidence of filtering and counting. The method names tell you right away what the code intends to do. Moreover, where the loop prescribes the order of operations in complete detail, a stream is able to schedule the operations any way it wants, as long as the result is correct."*

**Dịch:** Bây giờ bạn **không phải dò cả vòng lặp** để tìm dấu vết của việc lọc và đếm. **Tên method nói ngay** code định làm gì. Hơn nữa, trong khi vòng lặp **quy định chi tiết trọn vẹn thứ tự thao tác**, thì stream **được tự do sắp lịch thao tác theo cách nó muốn**, miễn kết quả đúng.

> *"Simply changing stream to parallelStream allows the stream library to do the filtering and counting in parallel."*

```java
long count = words.parallelStream()
    .filter(w -> w.length() > 12)
    .count();
```

**Dịch:** Chỉ cần **đổi `stream` thành `parallelStream`** là stream library có thể **lọc và đếm song song**.

> *"Streams follow the "what, not how" principle. In our stream example, we describe what needs to be done: get the long words and count them. We don't specify in which order, or in which thread, this should happen. In contrast, the loop at the beginning of this section specifies exactly how the computation should work, and thereby forgoes any chances of optimization."*

**Dịch:** Stream theo nguyên tắc **"cái gì, không phải cách nào" (what, not how)**. Trong ví dụ trên, ta **mô tả việc cần làm**: lấy các từ dài và đếm chúng. Ta **không chỉ định thứ tự**, cũng không chỉ định **thread nào**. Ngược lại, vòng lặp ở đầu section quy định **chính xác cách tính toán phải diễn ra**, và vì thế **từ bỏ mọi cơ hội tối ưu hoá**.

---

## Ba khác biệt giữa stream và collection

> *"A stream seems superficially similar to a collection, allowing you to transform and retrieve data. But there are significant differences:"*

**Dịch:** Nhìn bề ngoài stream **có vẻ giống collection** ở chỗ cho phép biến đổi và lấy data ra. Nhưng có những **khác biệt đáng kể**.

> *"1. A stream does not store its elements. They may be stored in an underlying collection or generated on demand."*

**Dịch:** **Stream không lưu trữ element của nó.** Chúng có thể nằm trong một **collection nền bên dưới**, hoặc được **sinh ra khi cần**.

> *"2. Stream operations don't mutate their source. For example, the filter method does not remove elements from a stream but yields a new stream in which they are not present."*

**Dịch:** **Stream operation không mutate nguồn của nó.** Ví dụ method `filter` **không xoá** element khỏi stream, mà **sinh ra một stream mới** trong đó chúng không có mặt.

> *"3. Stream operations are lazy when possible. This means they are not executed until their result is needed. For example, if you only ask for the first five long words instead of all, the filter method will stop filtering after the fifth match. As a consequence, you can even have infinite streams!"*

**Dịch:** **Stream operation là lazy khi có thể.** Nghĩa là chúng **không được thực thi cho tới khi kết quả được cần đến**. Ví dụ nếu bạn chỉ hỏi **năm từ dài đầu tiên** thay vì tất cả, thì `filter` sẽ **ngừng lọc sau kết quả khớp thứ năm**. Hệ quả: bạn **có thể có cả stream vô hạn**!

| # | Khác biệt |
|---|---|
| 1 | Stream **không lưu** element — chúng nằm ở collection nền hoặc được sinh khi cần |
| 2 | Stream operation **không mutate nguồn** — `filter` trả về stream mới |
| 3 | Stream operation **lazy khi có thể** → cho phép **infinite stream** |

---

## Pipeline ba giai đoạn

> *"Let us have another look at the example. The stream and parallelStream methods yield a stream for the words list. The filter method returns another stream that contains only the words of length greater than twelve. The count method reduces that stream to a result."*

**Dịch:** Nhìn lại ví dụ: `stream` và `parallelStream` **sinh ra một stream** cho list `words`. `filter` trả về **một stream khác** chỉ chứa các từ dài hơn mười hai. `count` **reduce stream đó thành một kết quả**.

> *"This workflow is typical when you work with streams. You set up a pipeline of operations in three stages:"*

> *"1. Create a stream."*
> *"2. Specify intermediate operations for transforming the initial stream into others, possibly in multiple steps."*
> *"3. Apply a terminal operation to produce a result. This operation forces the execution of the lazy operations that precede it. Afterwards, the stream can no longer be used."*

**Dịch:** Workflow này là **điển hình** khi làm việc với stream. Bạn dựng một **pipeline** gồm ba giai đoạn:

| Giai đoạn | Nội dung |
|---|---|
| 1 | **Create a stream** — tạo stream |
| 2 | **Intermediate operations** — chỉ định các thao tác biến đổi stream ban đầu thành stream khác, có thể qua nhiều bước |
| 3 | **Terminal operation** — áp một thao tác đầu cuối để sinh kết quả. Nó **buộc các lazy operation phía trước phải thực thi**. Sau đó **stream không dùng lại được nữa** |

> *"In the example in Listing 1.1, the stream is created with the stream or parallelStream method. The filter method transforms it, and count is the terminal operation."*

**Dịch:** Trong Listing 1.1, stream được tạo bằng `stream` hoặc `parallelStream`, `filter` biến đổi nó, và `count` là **terminal operation**.

> *"In the next section, you will see how to create a stream. The subsequent three sections deal with stream transformations. They are followed by five sections on terminal operations."*

**Dịch:** Section kế tiếp nói về **cách tạo stream**. Ba section sau đó bàn về **stream transformation**. Tiếp theo là **năm section về terminal operation**.

---

### Listing 1.1 — `streams/CountLongWords.java`

```java
package streams;

/**
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;

public class CountLongWords
{
    public static void main(String[] args) throws IOException
    {
        var contents = Files.readStr(
            Paths.get("../gutenberg/alice30.txt"));
        List<String> words = List.of(contents.split("\\PL+"));

        long count = 0;
        for (String w : words)
        {
            if (w.length() > 12) count++;
        }
        System.out.println(count);

        count = words.stream().filter(w -> w.length() > 12).count();
        System.out.println(count);

        count = words.parallelStream().filter(w -> w.length() > 12).count();
        System.out.println(count);
    }
}
```

---

## API — `java.util.stream.Stream<T>` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<T> filter(Predicate<? super T> p)` | sinh ra một stream chứa mọi element của stream này **thoả mãn `p`** |
| `long count()` | sinh ra **số element** của stream này. Đây là một **terminal operation** |

## API — `java.util.Collection<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `default Stream<E> stream()` | sinh ra một stream **tuần tự** các element trong collection này |
| `default Stream<E> parallelStream()` | sinh ra một stream **song song** các element trong collection này |

Xem thêm [[01 - The Java Collections Framework]] và [[02 - Lambda Expressions]].

---

## Bài kế tiếp

→ [[02 - Stream Creation]] — các cách tạo stream: `Stream.of`, `empty`, `generate`, `iterate`, `ofNullable`, và các method trong Java API trả về stream.
