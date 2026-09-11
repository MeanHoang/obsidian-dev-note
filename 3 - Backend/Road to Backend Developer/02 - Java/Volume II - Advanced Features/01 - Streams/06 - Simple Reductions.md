# 06 — Simple Reductions

> Chapter 1, Section 1.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.6. Simple Reductions

> *"Now that you have seen how to create and transform streams, we will finally get to the most important point—getting answers from the stream data. The methods covered in this section are called reductions. Reductions are terminal operations. They reduce the stream to a nonstream value that can be used in your program."*

**Dịch:** Giờ khi đã biết cách **tạo** và **biến đổi** stream, ta tới **điểm quan trọng nhất** — **lấy câu trả lời từ data của stream**. Các method trong section này gọi là **reduction**. **Reduction là terminal operation.** Chúng **rút gọn stream thành một giá trị không phải stream** để dùng trong chương trình.

> *"You have already seen a simple reduction: the count method that returns the number of elements of a stream."*

**Dịch:** Bạn đã thấy một reduction đơn giản: method **`count`** trả về **số element của stream**.

---

## max và min

> *"Other simple reductions are max and min that return the largest or smallest value. There is a twist—these methods return an Optional\<T> value that either wraps the answer or indicates that there is none (because the stream happened to be empty). In the olden days, it was common to return null in such a situation. But that can lead to null pointer exceptions when it happens in an incompletely tested program. The Optional type is a better way of indicating a missing return value. We discuss the Optional type in detail in the next section."*

**Dịch:** Các reduction đơn giản khác là **`max`** và **`min`**, trả về **giá trị lớn nhất hoặc nhỏ nhất**. Có một điểm khác thường: các method này trả về **giá trị `Optional<T>`**, hoặc **bọc câu trả lời**, hoặc **báo rằng không có câu trả lời nào** (vì stream tình cờ rỗng). Ngày xưa người ta thường **trả về `null`** trong tình huống đó. Nhưng cách này **dẫn tới null pointer exception** khi xảy ra trong chương trình chưa được test kỹ. **Kiểu `Optional` là cách tốt hơn để báo hiệu một giá trị trả về bị thiếu.**

> *"Here is how you can get the maximum of a stream:"*

```java
Optional<String> largest = words.max(String::compareToIgnoreCase);
System.out.println("largest: " + largest.orElse(""));
```

---

## findFirst và findAny

> *"The findFirst returns the first value in a nonempty collection. It is often useful when combined with filter. For example, here we find the first word that starts with the letter Q, if it exists:"*

```java
Optional<String> startsWithQ
    = words.filter(s -> s.startsWith("Q")).findFirst();
```

**Dịch:** `findFirst` trả về **giá trị đầu tiên trong một collection không rỗng**. Thường hữu ích khi **kết hợp với `filter`**. Ví dụ trên tìm **từ đầu tiên bắt đầu bằng chữ Q**, nếu có.

> *"If you are OK with any match, not just the first one, use the findAny method. This is effective when you parallelize the stream, since the stream can report any match that it finds instead of being constrained to the first one."*

```java
Optional<String> startsWithQ
    = words.parallel().filter(s -> s.startsWith("Q")).findAny();
```

**Dịch:** Nếu bạn **chấp nhận bất kỳ kết quả khớp nào**, không nhất thiết là cái đầu tiên, hãy dùng **`findAny`**. Cách này **hiệu quả khi song song hoá stream**, vì stream **báo được bất kỳ kết quả khớp nào nó tìm thấy** thay vì bị **ràng buộc phải là cái đầu tiên**.

---

## anyMatch, allMatch, noneMatch

> *"If you just want to know if there is a match, use anyMatch. That method takes a predicate argument, so you won't need to use filter."*

```java
boolean aWordStartsWithQ
    = words.parallel().anyMatch(s -> s.startsWith("Q"));
```

**Dịch:** Nếu bạn **chỉ muốn biết có kết quả khớp hay không**, dùng **`anyMatch`**. Method này nhận **argument là predicate**, nên bạn **không cần dùng `filter`**.

> *"There are methods allMatch and noneMatch that return true if all or no elements match a predicate. These methods also benefit from being run in parallel."*

**Dịch:** Còn có **`allMatch`** và **`noneMatch`** trả về `true` nếu **tất cả** hoặc **không element nào** khớp predicate. Các method này cũng **hưởng lợi khi chạy song song**.

---

## API — `java.util.stream.Stream` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Optional<T> max(Comparator<? super T> comparator)` | sinh ra một element **lớn nhất** của stream này theo thứ tự do comparator đã cho định nghĩa, hoặc **`Optional` rỗng nếu stream rỗng**. Đây là **terminal operation** |
| `Optional<T> min(Comparator<? super T> comparator)` | sinh ra một element **nhỏ nhất**, tương tự như trên. **Terminal operation** |
| `Optional<T> findFirst()` | sinh ra element **đầu tiên** của stream này, hoặc `Optional` rỗng nếu stream rỗng. **Terminal operation** |
| `Optional<T> findAny()` | sinh ra **một element bất kỳ** của stream này, hoặc `Optional` rỗng nếu stream rỗng. **Terminal operation** |
| `boolean anyMatch(Predicate<? super T> predicate)` | trả về `true` nếu **bất kỳ** element nào của stream khớp predicate đã cho. **Terminal operation** |
| `boolean allMatch(Predicate<? super T> predicate)` | trả về `true` nếu **mọi** element khớp predicate. **Terminal operation** |
| `boolean noneMatch(Predicate<? super T> predicate)` | trả về `true` nếu **không element nào** khớp predicate. **Terminal operation** |

---

## Bài kế tiếp

→ [[07 - The Optional Type]] — cách dùng `Optional` cho đúng: lấy giá trị, tiêu thụ giá trị, pipeline `Optional`, và những cách dùng sai.
