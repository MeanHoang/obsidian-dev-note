# 10 — Grouping and Partitioning

> Chapter 1, Section 1.10 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.10. Grouping and Partitioning

> *"In the preceding section, you saw how to collect all languages in a given country. But the process was a bit tedious. You had to generate a singleton set for each map value and then specify how to merge the existing and new values. Forming groups of values with the same characteristic is very common, so the groupingBy method supports it directly."*

**Dịch:** Section trước cho thấy cách gom mọi ngôn ngữ trong một quốc gia. Nhưng quá trình đó **hơi lằng nhằng**: bạn phải **sinh một singleton set cho mỗi map value** rồi **chỉ định cách merge** giá trị cũ và mới. Việc **tạo nhóm các giá trị cùng đặc tính là rất phổ biến**, nên method **`groupingBy` hỗ trợ trực tiếp**.

> *"Let's look at the problem of grouping locales by country. First, form this map:"*

```java
Map<String, List<Locale>> countryToLocales = locales.collect(
    Collectors.groupingBy(Locale::getCountry));
```

> *"The function Locale::getCountry is the classifier function of the grouping. You can now look up all locales for a given country code, for example"*

```java
List<Locale> swissLocales = countryToLocales.get("CH");
    // Yields locales de_CH, fr_CH, it_CH and maybe more
```

**Dịch:** Xét bài toán **nhóm locale theo quốc gia**. Function `Locale::getCountry` là **classifier function** của phép nhóm. Giờ bạn **tra cứu được mọi locale cho một mã quốc gia** cho trước.

> **Note (sách):** *"A quick refresher on locales: Each locale has a language code (such as en for English) and a country code (such as US for the United States). The locale en_US describes English in the United States, and en_IE is English in Ireland. Some countries have multiple locales. For example, ga_IE is Gaelic in Ireland, and, as the preceding example shows, the JDK knows at least three locales in Switzerland."*
>
> **Dịch:** Ôn nhanh về locale: mỗi locale có một **language code** (như `en` cho tiếng Anh) và một **country code** (như `US` cho Hoa Kỳ). Locale `en_US` mô tả tiếng Anh ở Hoa Kỳ, còn `en_IE` là tiếng Anh ở Ireland. **Một số quốc gia có nhiều locale.** Ví dụ `ga_IE` là tiếng Gaelic ở Ireland, và như ví dụ trên cho thấy, **JDK biết ít nhất ba locale ở Thuỵ Sĩ**.

---

## partitioningBy

> *"When the classifier function is a predicate function (that is, a function returning a boolean value), the stream elements are partitioned into two lists: those where the function returns true and the complement. In this case, it is more efficient to use partitioningBy instead of groupingBy. For example, here we split all locales into those that use English and all others:"*

```java
Map<Boolean, List<Locale>> englishAndOtherLocales = locales.collect(
    Collectors.partitioningBy(l -> l.getLanguage().equals("en")));
List<Locale> englishLocales = englishAndOtherLocales.get(true);
```

**Dịch:** Khi classifier function là một **predicate function** (tức function trả về giá trị `boolean`), các element của stream được **phân hoạch thành hai list**: những cái mà function trả về `true`, và **phần bù**. Trong trường hợp này, dùng **`partitioningBy` hiệu quả hơn `groupingBy`**.

> **Note (sách):** *"If you call the groupingByConcurrent method, you get a concurrent map that, when used with a parallel stream, is concurrently populated. This is entirely analogous to the toConcurrentMap method."*
>
> **Dịch:** Nếu gọi method **`groupingByConcurrent`**, bạn nhận được một **concurrent map** mà khi dùng với **parallel stream** sẽ được **điền vào một cách concurrent**. Điều này **hoàn toàn tương tự method `toConcurrentMap`**.

---

## API — `java.util.stream.Collectors` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T,K> Collector<T,?,Map<K,List<T>>> groupingBy(Function<? super T,? extends K> classifier)` | sinh ra collector tạo ra một **map** mà **key là kết quả áp `classifier` lên mọi element được gom**, và **value là list các element cùng key** |
| `static <T,K> Collector<T,?,ConcurrentMap<K,List<T>>> groupingByConcurrent(Function<? super T,? extends K> classifier)` | như trên, nhưng tạo ra một **concurrent map** |
| `static <T> Collector<T,?,Map<Boolean,List<T>>> partitioningBy(Predicate<? super T> predicate)` | sinh ra collector tạo ra một map mà **key là `true`/`false`**, và value là **list các element thoả / không thoả predicate** |

---

## Bài kế tiếp

→ [[11 - Downstream Collectors]] — `counting`, `summing*`, `maxBy`/`minBy`, `collectingAndThen`, `mapping`, `flatMapping`, `filtering`.
