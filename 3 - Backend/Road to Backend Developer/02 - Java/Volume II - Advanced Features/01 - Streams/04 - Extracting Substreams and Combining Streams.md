# 04 — Extracting Substreams and Combining Streams

> Chapter 1, Section 1.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.4. Extracting Substreams and Combining Streams

> *"The call stream.limit(n) returns a new stream that ends after n elements (or when the original stream ends if it is shorter). This method is particularly useful for cutting infinite streams down to size. For example,"*

```java
Stream<Double> randoms = Stream.generate(Math::random).limit(100);
```

> *"yields a stream with 100 random numbers."*

**Dịch:** Lời gọi `stream.limit(n)` trả về stream mới **kết thúc sau `n` element** (hoặc khi stream gốc kết thúc nếu nó ngắn hơn). Method này **đặc biệt hữu ích để cắt stream vô hạn về kích thước vừa phải**. Ví dụ trên cho ra stream **100 số ngẫu nhiên**.

> *"The call stream.skip(n) does the exact opposite. It discards the first n elements. This is handy in our book reading example where, due to the way the split method works, the first element is an unwanted empty string. We can make it go away by calling skip:"*

```java
Stream<String> words = Stream.of(contents.split("\\PL+")).skip(1);
```

**Dịch:** Lời gọi `stream.skip(n)` làm **điều ngược lại hoàn toàn**: nó **bỏ đi `n` element đầu tiên**. Rất tiện trong ví dụ đọc sách của ta, nơi mà **do cách method `split` hoạt động**, element đầu tiên là **một chuỗi rỗng không mong muốn**. Ta loại nó bằng `skip`.

---

## takeWhile và dropWhile

> *"The stream.takeWhile(predicate) call takes all elements from the stream while the predicate is true, and then stops."*

> *"For example, suppose we use the codePoints method of the preceding section to split a string into characters, and we want to collect all initial digits. The takeWhile method can do this:"*

```java
Stream<String> initialDigits = codePoints(str).takeWhile(
    s -> "0123456789".contains(s));
```

**Dịch:** Lời gọi `stream.takeWhile(predicate)` **lấy mọi element khỏi stream chừng nào predicate còn đúng**, rồi **dừng lại**. Ví dụ: dùng method `codePoints` ở section trước để tách một string thành các ký tự, và ta muốn **gom mọi chữ số ở đầu**.

> *"The dropWhile method does the opposite, dropping elements while a condition is true and yielding a stream of all elements starting with the first one for which the condition was false. For example,"*

```java
Stream<String> withoutInitialWhiteSpace = codePoints(str).dropWhile(
    s -> s.trim().length() == 0);
```

**Dịch:** Method `dropWhile` làm **ngược lại**: **bỏ các element chừng nào điều kiện còn đúng**, và sinh ra stream **mọi element bắt đầu từ element đầu tiên mà điều kiện sai**.

---

## concat

> *"You can concatenate two streams with the static concat method of the Stream class:"*

```java
Stream<String> combined = Stream.concat(
    codePoints("Hello"), codePoints("World"));
    // Yields the stream ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"]
```

**Dịch:** Bạn **nối hai stream** bằng static method **`concat`** của class `Stream`.

> *"Of course, the first stream should not be infinite—otherwise the second one wouldn't ever get a chance."*

**Dịch:** Tất nhiên **stream thứ nhất không được là vô hạn** — nếu không thì **stream thứ hai chẳng bao giờ có cơ hội**.

---

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<T> limit(long maxSize)` | sinh ra stream gồm **tối đa `maxSize` element đầu** của stream này |
| `Stream<T> skip(long n)` | sinh ra stream gồm **mọi element trừ `n` element đầu** của stream này |
| `Stream<T> takeWhile(Predicate<? super T> predicate)` (Java 9) | sinh ra stream gồm **các element đầu của stream này thoả predicate** |
| `Stream<T> dropWhile(Predicate<? super T> predicate)` (Java 9) | sinh ra stream gồm các element của stream này **trừ những element đầu không thoả predicate** |
| `static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)` | sinh ra stream có element là **các element của `a` rồi tới các element của `b`** |

---

## Bài kế tiếp

→ [[05 - Other Stream Transformations]] — `distinct`, `sorted`, `peek` và mẹo debug stream pipeline.
