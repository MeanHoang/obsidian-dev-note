# 03 — The filter, map, and flatMap Methods

> Chapter 1, Section 1.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.3. The filter, map, and flatMap Methods

> *"A stream transformation produces a stream whose elements are derived from those of another stream. You have already seen the filter transformation that yields a new stream with those elements that match a certain condition. Here, we transform a stream of strings into another stream containing only long words:"*

```java
List<String> words = . . .;
Stream<String> longWords = words.stream().filter(w -> w.length() > 12);
```

**Dịch:** Một **stream transformation** sinh ra stream mà element **được dẫn xuất từ element của một stream khác**. Bạn đã thấy phép biến đổi `filter` cho ra stream mới **chỉ chứa các element khớp một điều kiện**.

> *"The argument of filter is a Predicate\<T>—that is, a function from T to boolean."*

**Dịch:** Argument của `filter` là một **`Predicate<T>`** — tức một **function từ `T` sang `boolean`**.

---

## map

> *"Often, you want to transform the values in a stream in some way. Use the map method and pass the function that carries out the transformation. For example, you can transform all words to lowercase like this:"*

```java
Stream<String> lowercaseWords = words.stream().map(String::toLowerCase);
```

**Dịch:** Thường bạn muốn **biến đổi các giá trị** trong một stream theo cách nào đó. Dùng method **`map`** và truyền vào **function thực hiện phép biến đổi**.

> *"Here, we used map with a method reference. Often, you will use a lambda expression instead:"*

```java
Stream<String> firstLetters = words.stream().map(s -> s.substring(0, 1));
```

> *"The resulting stream contains the first letter of each word."*

**Dịch:** Ở đây ta dùng `map` với một **method reference**. Thường thì bạn sẽ dùng **lambda expression** thay thế. Stream kết quả chứa **chữ cái đầu tiên của mỗi từ**. Xem [[02 - Lambda Expressions]].

---

## flatMap

> *"When you use map, a function is applied to each element, and the result is a new stream with the results. Now, suppose you have a function that returns not just one value but a stream of values. Here is an example—a method that turns a string into a stream of strings, namely the individual code points:"*

```java
public static Stream<String> codePoints(String s)
{
    var result = new ArrayList<String>();
    int i = 0;
    while (i < s.length())
    {
        int j = s.offsetByCodePoints(i, 1);
        result.add(s.substring(i, j));
        i = j;
    }
    return result.stream();
}
```

**Dịch:** Khi dùng `map`, một function được **áp lên từng element**, và kết quả là **một stream mới chứa các kết quả đó**. Giờ giả sử bạn có function trả về **không chỉ một giá trị mà cả một stream giá trị**. Ví dụ trên là một method biến một string thành **stream các string**, cụ thể là **các code point riêng lẻ**.

> *"This method correctly handles Unicode characters that require two char values because that's the right thing to do. But you don't have to dwell on that. For example, codePoints("boat") is the stream ["b", "o", "a", "t"]."*

**Dịch:** Method này **xử lý đúng các ký tự Unicode cần tới hai giá trị `char`**, vì đó là điều nên làm. Nhưng không cần bận tâm chuyện đó. Ví dụ `codePoints("boat")` là stream `["b", "o", "a", "t"]`.

> *"Now let's map the codePoints method on a stream of strings:"*

```java
Stream<Stream<String>> result = words.stream().map(w -> codePoints(w));
```

> *"You will get a stream of streams, like [. . . ["y", "o", "u", "r"], ["b", "o", "a", "t"], . . .]. To flatten it out to a single stream [. . . "y", "o", "u", "r", "b", "o", "a", "t", . . .], use the flatMap method instead of map:"*

```java
Stream<String> flatResult = words.stream().flatMap(w -> codePoints(w));
    // Calls codePoints on each word and flattens the results
```

**Dịch:** Bạn sẽ nhận được một **stream của các stream**, kiểu `[... ["y","o","u","r"], ["b","o","a","t"], ...]`. Để **làm phẳng (flatten)** nó thành một stream duy nhất `[... "y","o","u","r","b","o","a","t", ...]`, hãy dùng **`flatMap`** thay cho `map`.

```
map      : "your" ─► ["y","o","u","r"]   ─┐
           "boat" ─► ["b","o","a","t"]   ─┴► Stream<Stream<String>>

flatMap  : "your" ─► ["y","o","u","r"]   ─┐
           "boat" ─► ["b","o","a","t"]   ─┴► Stream<String>
                                             "y","o","u","r","b","o","a","t"
```

> **Note (sách):** *"You will find a flatMap method in classes other than streams. It is a general concept in computer science. Suppose you have a generic type G (such as Stream) and functions f from some type T to G<U> and g from U to G\<V>. Then you can compose them—that is, first apply f and then g, by using flatMap. This is a key idea in the theory of monads. But don't worry—you can use flatMap without knowing anything about monads."*
>
> **Dịch:** Bạn sẽ gặp method `flatMap` ở **cả những class khác ngoài stream**. Nó là một **khái niệm tổng quát trong khoa học máy tính**. Giả sử bạn có một generic type `G` (như `Stream`) cùng function `f` từ kiểu `T` sang `G<U>` và `g` từ `U` sang `G<V>`. Khi đó bạn **kết hợp (compose) chúng được** — tức áp `f` trước rồi `g` — bằng cách dùng `flatMap`. Đây là **ý tưởng then chốt trong lý thuyết monad**. Nhưng đừng lo — bạn **dùng được `flatMap` mà không cần biết gì về monad**.

---

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Stream<T> filter(Predicate<? super T> predicate)` | sinh ra stream chứa **các element của stream này thoả mãn predicate** |
| `<R> Stream<R> map(Function<? super T,? extends R> mapper)` | sinh ra stream chứa **kết quả của việc áp `mapper` lên các element** của stream này |
| `<R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)` | sinh ra stream có được bằng cách **nối (concatenate) các kết quả** của việc áp `mapper` lên các element của stream này. (Lưu ý mỗi kết quả **bản thân là một stream**.) |

Xem thêm [[07 - Wildcard Types]] về ký hiệu `? super T` / `? extends R`.

---

## Bài kế tiếp

→ [[04 - Extracting Substreams and Combining Streams]] — `limit`, `skip`, `takeWhile`, `dropWhile` và `Stream.concat`.
