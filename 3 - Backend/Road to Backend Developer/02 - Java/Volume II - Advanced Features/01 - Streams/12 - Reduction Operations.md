# 12 — Reduction Operations

> Chapter 1, Section 1.12 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.12. Reduction Operations

> *"The reduce method is a general mechanism for computing a value from a stream. The simplest form takes a binary function and keeps applying it, starting with the first two elements. It's easy to explain this if the function is the sum:"*

```java
List<Integer> values = . . .;
Optional<Integer> sum = values.stream().reduce((x, y) -> x + y);
```

> *"In this case, the reduce method computes v0 + v1 + v2 + . . . , where vi are the stream elements. The method returns an Optional because there is no valid result if the stream is empty."*

**Dịch:** Method **`reduce`** là **cơ chế tổng quát để tính ra một giá trị từ một stream**. Dạng đơn giản nhất nhận một **binary function** và **áp nó lặp đi lặp lại**, bắt đầu từ **hai element đầu tiên**. Ở đây `reduce` tính `v0 + v1 + v2 + ...`, với `vi` là các element của stream. Method trả về **`Optional`** vì **không có kết quả hợp lệ nếu stream rỗng**.

> **Note (sách):** *"In this case, you can write reduce(Integer::sum) instead of reduce((x, y) -> x + y)."*
>
> **Dịch:** Trong trường hợp này bạn viết được **`reduce(Integer::sum)`** thay cho `reduce((x, y) -> x + y)`.

> *"More generally, you can use any operation that combines a partial result x with the next value y to yield a new partial result."*

**Dịch:** Tổng quát hơn, bạn dùng được **bất kỳ phép toán nào kết hợp một kết quả bộ phận `x` với giá trị kế tiếp `y`** để cho ra một **kết quả bộ phận mới**.

> *"Here is another way of looking at reductions. Given a reduction operation op, the reduction yields v0 op v1 op v2 op . . . , where vi op vi + 1 denotes the function call op(vi, vi + 1). There are many operations that might be useful in practice—such as sum, product, string concatenation, maximum and minimum, set union or intersection."*

**Dịch:** Một cách nhìn khác về reduction: cho một **reduction operation `op`**, phép reduction cho ra `v0 op v1 op v2 op ...`, trong đó `vi op vi+1` ký hiệu lời gọi `op(vi, vi+1)`. Có **nhiều phép toán hữu ích trong thực tế** — như **tổng, tích, nối chuỗi, lớn nhất và nhỏ nhất, hợp hoặc giao của set**.

---

## Tính associative và identity

> *"If you want to use reduction with parallel streams, the operation must be associative: It shouldn't matter in which order you combine the elements. In math notation, (x op y) op z must be equal to x op (y op z). An example of an operation that is not associative is subtraction. For example, (6 − 3) − 2 ≠ 6 − (3 − 2)."*

**Dịch:** Nếu muốn dùng reduction với **parallel stream**, phép toán **bắt buộc phải associative (kết hợp)**: **thứ tự kết hợp các element phải không quan trọng**. Theo ký hiệu toán học, `(x op y) op z` phải **bằng** `x op (y op z)`. Một ví dụ về phép toán **không associative** là **phép trừ**: `(6 − 3) − 2 ≠ 6 − (3 − 2)`.

> *"Often, there is an identity e such that e op x = x, and that element can be used as the start of the computation. For example, 0 is the identity for addition, and you can use the second form of reduce:"*

```java
List<Integer> values = . . .;
Integer sum = values.stream().reduce(0, (x, y) -> x + y);
    // Computes 0 + v0 + v1 + v2 + . . .
```

> *"The identity value is returned if the stream is empty, and you no longer need to deal with the Optional class."*

**Dịch:** Thường có một **identity `e`** sao cho `e op x = x`, và element đó dùng được làm **điểm khởi đầu của phép tính**. Ví dụ **`0` là identity của phép cộng**. **Giá trị identity được trả về nếu stream rỗng**, và bạn **không còn phải xử lý class `Optional`** nữa.

---

## Dạng ba tham số của reduce

> *"Now suppose you have a stream of objects and want to form the sum of some property, such as lengths in a stream of strings. You can't use the simple form of reduce. It requires a function (T, T) -> T, with the same types for the arguments and the result, but in this situation you have two types: The stream elements have type String, and the accumulated result is an integer. There is a form of reduce that can deal with this situation."*

**Dịch:** Giả sử bạn có một stream các object và muốn **tính tổng của một property nào đó**, chẳng hạn **độ dài** trong một stream các string. Bạn **không dùng được dạng đơn giản của `reduce`** — nó đòi hỏi một function `(T, T) -> T` với **cùng kiểu cho argument và kết quả**, nhưng tình huống này có **hai kiểu**: element của stream kiểu `String`, còn kết quả tích luỹ là **một số nguyên**. Có một **dạng `reduce` xử lý được tình huống này**.

> *"First, you supply an "accumulator" function (total, word) -> total + word.length(). That function is called repeatedly, forming the cumulative total. But when the computation is parallelized, there will be multiple computations of this kind, and you need to combine their results. You supply a second function for that purpose. The complete call is"*

```java
int result = words.reduce(0,
    (total, word) -> total + word.length(),
    (total1, total2) -> total1 + total2);
```

**Dịch:** Trước hết bạn cung cấp một **function "accumulator"** `(total, word) -> total + word.length()`. Function đó **được gọi lặp đi lặp lại**, tạo thành **tổng tích luỹ**. Nhưng khi phép tính được **song song hoá**, sẽ có **nhiều phép tính kiểu này**, và bạn cần **kết hợp kết quả của chúng**. Bạn cung cấp một **function thứ hai** cho mục đích đó.

> **Note (sách):** *"In practice, you probably won't use the reduce method a lot. It is usually easier to map to a stream of numbers and use one of its methods to compute sum, maximum, or minimum. (We discuss streams of numbers in Section 1.13, "Primitive Type Streams," on p. 43.) In this particular example, you could have called words.mapToInt(String::length).sum(), which is both simpler and more efficient since it doesn't involve boxing."*
>
> **Dịch:** Trên thực tế bạn **có lẽ sẽ không dùng `reduce` nhiều lắm**. Thường **dễ hơn** là **map sang một stream các số** rồi dùng một method của nó để tính tổng, lớn nhất hoặc nhỏ nhất (xem [[13 - Primitive Type Streams]]). Trong ví dụ cụ thể này, bạn có thể đã gọi `words.mapToInt(String::length).sum()`, **vừa đơn giản hơn vừa hiệu quả hơn** vì **không dính tới boxing**.

---

## Khi reduce không đủ tổng quát: collect ba tham số

> **Note (sách):** *"There are times when reduce is not general enough. For example, suppose you want to collect the results in a BitSet. If the collection is parallelized, you can't put the elements directly into a single BitSet because a BitSet object is not thread-safe. For that reason, you can't use reduce. Each segment needs to start out with its own empty set, and reduce only lets you supply one identity value. Instead, use collect. It takes three arguments:"*
>
> *"1. A supplier to make new instances of the target object—for example, a constructor for a hash set"*
> *"2. An accumulator that adds an element to the target, such as an add method"*
> *"3. A combiner that merges two objects into one, such as addAll"*
>
> *"Here is how the collect method works for a bit set:"*
>
> ```java
> BitSet result = stream.collect(BitSet::new, BitSet::set, BitSet::or);
> ```
>
> **Dịch:** Có những lúc **`reduce` không đủ tổng quát**. Ví dụ bạn muốn gom kết quả vào một **`BitSet`**. Nếu việc gom được **song song hoá**, bạn **không đưa element thẳng vào một `BitSet` duy nhất được** vì object `BitSet` **không thread-safe**. Vì lý do đó bạn **không dùng `reduce` được**: **mỗi segment cần bắt đầu bằng set rỗng của riêng nó**, mà `reduce` **chỉ cho bạn cung cấp một giá trị identity**. Thay vào đó hãy dùng **`collect`**, nhận **ba argument**:

| # | Argument |
|---|---|
| 1 | **supplier** — tạo instance mới của object đích, ví dụ constructor của một hash set |
| 2 | **accumulator** — thêm một element vào object đích, ví dụ method `add` |
| 3 | **combiner** — merge hai object thành một, ví dụ `addAll` |

Xem [[04 - Coordinating Tasks]].

---

## API — `java.util.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Optional<T> reduce(BinaryOperator<T> accumulator)` | tạo **tổng tích luỹ** các element của stream bằng function accumulator đã cho |
| `T reduce(T identity, BinaryOperator<T> accumulator)` | như trên; nếu có `identity` thì đó là **giá trị đầu tiên được tích luỹ** |
| `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)` | như trên; nếu có `combiner` thì nó dùng để **kết hợp các tổng của những segment được tích luỹ riêng rẽ** |
| `<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)` | gom element vào một kết quả kiểu `R`. Trên **mỗi segment**, `supplier` được gọi để cung cấp một **kết quả khởi đầu**, `accumulator` được gọi để **thêm element vào đó theo kiểu mutable**, và `combiner` được gọi để **kết hợp hai kết quả** |

---

## Bài kế tiếp

→ [[13 - Primitive Type Streams]] — `IntStream`, `LongStream`, `DoubleStream` và cách chuyển qua lại với object stream.
