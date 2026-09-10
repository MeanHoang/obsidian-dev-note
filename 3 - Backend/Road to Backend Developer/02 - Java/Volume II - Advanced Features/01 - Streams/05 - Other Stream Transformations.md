# 05 — Other Stream Transformations

> Chapter 1, Section 1.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.5. Other Stream Transformations

> *"The distinct method returns a stream that yields elements from the original stream, in the same order, except that duplicates are suppressed. The duplicates need not be adjacent."*

```java
Stream<String> uniqueWords
    = Stream.of("merrily", "merrily", "merrily", "gently").distinct();
    // Only one "merrily" is retained
```

**Dịch:** Method `distinct` trả về stream sinh ra các element của stream gốc, **giữ nguyên thứ tự**, ngoại trừ **các bản trùng bị loại bỏ**. Các bản trùng **không cần phải nằm liền kề nhau**.

---

## sorted

> *"For sorting a stream, there are several variations of the sorted method. One works for streams of Comparable elements, and another accepts a Comparator. Here, we sort strings so that the longest ones come first:"*

```java
Stream<String> longestFirst
    = words.stream().sorted(Comparator.comparing(String::length).reversed());
```

**Dịch:** Để **sắp xếp một stream** có **vài biến thể** của method `sorted`. Một biến thể dùng cho stream các element **`Comparable`**, biến thể kia nhận một **`Comparator`**. Ở đây ta sắp string sao cho **cái dài nhất đứng trước**.

> *"As with all stream transformations, the sorted method yields a new stream whose elements are the elements of the original stream in sorted order."*

**Dịch:** Như **mọi stream transformation**, `sorted` sinh ra **một stream mới** mà element là element của stream gốc **theo thứ tự đã sắp**.

> *"Of course, you can sort a collection without using streams. The sorted method is useful when the sorting process is part of a stream pipeline."*

**Dịch:** Tất nhiên bạn **sắp xếp collection được mà không cần stream**. Method `sorted` hữu ích khi **việc sắp xếp là một phần của stream pipeline**. Xem [[06 - Algorithms]].

---

## peek

> *"Finally, the peek method yields another stream with the same elements as the original, but a function is invoked every time an element is retrieved. That is handy for debugging:"*

```java
Object[] powers = Stream.iterate(1.0, p -> p * 2)
    .peek(e -> System.out.println("Fetching " + e))
    .limit(20).toArray();
```

**Dịch:** Cuối cùng, method `peek` sinh ra **một stream khác có cùng element với stream gốc**, nhưng **một function được gọi mỗi khi một element được lấy ra**. Rất tiện để **debug**.

> *"When an element is actually accessed, a message is printed. This way you can verify that the infinite stream returned by iterate is processed lazily."*

**Dịch:** Khi một element **thực sự được truy cập**, một thông điệp được in ra. Nhờ vậy bạn **kiểm chứng được rằng stream vô hạn do `iterate` trả về được xử lý một cách lazy**.

> **Tip (sách):** *"When you use a debugger to debug a stream computation, you can set a breakpoint in a method that is called from one of the transformations. With most IDEs, you can also set breakpoints in lambda expressions. If you just want to know what happens at a particular point in the stream pipeline, add"*
>
> ```java
> .peek(x -> { return; })
> ```
>
> *"and set a breakpoint on the second line."*
>
> **Dịch:** Khi dùng debugger để debug một phép tính trên stream, bạn **đặt được breakpoint trong một method được gọi từ một trong các transformation**. Với **hầu hết IDE**, bạn cũng **đặt được breakpoint trong lambda expression**. Nếu chỉ muốn biết **chuyện gì xảy ra ở một điểm cụ thể trong pipeline**, hãy thêm đoạn `.peek` trên và **đặt breakpoint ở dòng thứ hai**.

---

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<T> distinct()` | sinh ra stream gồm **các element phân biệt** của stream này |
| `Stream<T> sorted()` | sinh ra stream gồm các element của stream này **theo thứ tự đã sắp**. Method này **đòi hỏi element là instance của class implement `Comparable`** |
| `Stream<T> sorted(Comparator<? super T> comparator)` | sinh ra stream gồm các element của stream này theo thứ tự đã sắp, dùng comparator đã cho |
| `Stream<T> peek(Consumer<? super T> action)` | sinh ra stream **có cùng element với stream này**, đồng thời **truyền từng element cho `action` khi element đó được tiêu thụ** |

---

## Bài kế tiếp

→ [[06 - Simple Reductions]] — `count`, `max`, `min`, `findFirst`, `findAny`, `anyMatch`, `allMatch`, `noneMatch`.
