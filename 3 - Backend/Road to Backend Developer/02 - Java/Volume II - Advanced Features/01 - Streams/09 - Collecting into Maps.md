# 09 — Collecting into Maps

> Chapter 1, Section 1.9 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.9. Collecting into Maps

> *"Suppose you have a Stream<Person> and want to collect the elements into a map so that later you can look up people by their ID. The Collectors.toMap method has two function arguments that produce the map's keys and values. For example,"*

```java
Map<Integer, String> idToName = people.collect(
    Collectors.toMap(Person::getId, Person::getName));
```

**Dịch:** Giả sử bạn có một `Stream<Person>` và muốn gom các element **vào một map** để sau này **tra cứu người theo ID**. Method **`Collectors.toMap`** có **hai function argument** sinh ra **key và value** của map. Xem [[04 - Maps]].

> *"In the common case when the values should be the actual elements, use Function.identity() for the second function."*

```java
Map<Integer, Person> idToPerson = people.collect(
    Collectors.toMap(Person::getId, Function.identity()));
```

**Dịch:** Trong trường hợp phổ biến là **value chính là element**, dùng **`Function.identity()`** cho function thứ hai.

---

## Xử lý xung đột key: merge function

> *"If there is more than one element with the same key, there is a conflict, and the collector will throw an IllegalStateException. You can override that behavior by supplying a third function argument that resolves the conflict and determines the value for the key, given the existing and the new value. Your function could return the existing value, the new value, or a combination of them."*

**Dịch:** Nếu có **nhiều hơn một element cùng key** thì xảy ra **xung đột**, và collector sẽ **ném `IllegalStateException`**. Bạn **ghi đè hành vi đó** bằng cách cung cấp **function argument thứ ba** giải quyết xung đột và **quyết định value cho key**, dựa trên **giá trị hiện có và giá trị mới**. Function của bạn có thể trả về **giá trị hiện có**, **giá trị mới**, hoặc **một kết hợp của cả hai**.

> *"Here, we construct a map that contains, for each language in the available locales, as key its name in your default locale (such as "German"), and as value its localized name (such as "Deutsch")."*

```java
Stream<Locale> locales = Stream.of(Locale.getAvailableLocales());
Map<String, String> languageNames = locales.collect(
    Collectors.toMap(
        Locale::getDisplayLanguage,
        loc -> loc.getDisplayLanguage(loc),
        (existingValue, newValue) -> existingValue));
```

**Dịch:** Ở đây ta dựng một map chứa, với mỗi ngôn ngữ trong các locale khả dụng: **key là tên của nó trong locale mặc định** của bạn (chẳng hạn `"German"`), và **value là tên bản địa hoá** của nó (chẳng hạn `"Deutsch"`).

> *"We don't care that the same language might occur twice (for example, German in Germany and in Switzerland), so we just keep the first entry."*

**Dịch:** Ta **không quan tâm** việc cùng một ngôn ngữ có thể xuất hiện hai lần (ví dụ tiếng Đức ở Đức và ở Thuỵ Sĩ), nên ta **chỉ giữ entry đầu tiên**.

> **Note (sách):** *"In this chapter, I use the Locale class as a source of an interesting data set. See Chapter 7 for more information on working with locales."*
>
> **Dịch:** Trong chương này, tác giả dùng class `Locale` làm **nguồn của một tập data thú vị**. Xem **Chapter 7** để biết thêm về việc làm việc với locale.

---

## Gom vào `Map<String, Set<String>>`

> *"Now suppose we want to know all languages in a given country. Then we need a Map<String, Set<String>>. For example, the value for "Switzerland" is the set [French, German, Italian]. At first, we store a singleton set for each language. Whenever a new language is found for a given country, we form the union of the existing and the new set."*

```java
Map<String, Set<String>> countryLanguageSets = locales.collect(
    Collectors.toMap(
        Locale::getDisplayCountry,
        l -> Collections.singleton(l.getDisplayLanguage()),
        (a, b) -> { // Union of a and b
            var union = new HashSet<String>(a);
            union.addAll(b);
            return union; }));
```

**Dịch:** Giờ giả sử ta muốn biết **mọi ngôn ngữ trong một quốc gia**. Khi đó ta cần một `Map<String, Set<String>>`. Ví dụ value cho `"Switzerland"` là set `[French, German, Italian]`. Đầu tiên ta **lưu một singleton set cho mỗi ngôn ngữ**. Mỗi khi tìm thấy **một ngôn ngữ mới** cho một quốc gia, ta **hợp (union)** set hiện có với set mới.

> *"You will see a simpler way of obtaining this map in the next section."*

**Dịch:** Bạn sẽ thấy **cách đơn giản hơn** để có map này ở [[10 - Grouping and Partitioning]].

---

## Chọn loại map: map supplier

> *"If you want a TreeMap, supply the constructor as the fourth argument. You must provide a merge function. Here is one of the examples from the beginning of the section, now yielding a TreeMap:"*

```java
Map<Integer, Person> idToPerson = people.collect(
    Collectors.toMap(
        Person::getId,
        Function.identity(),
        (existingValue, newValue) -> { throw new IllegalStateException(); },
        TreeMap::new));
```

**Dịch:** Nếu muốn một **`TreeMap`**, hãy đưa constructor vào làm **argument thứ tư**. Bạn **bắt buộc phải cung cấp merge function**.

> **Note (sách):** *"For each of the toMap methods, there is an equivalent toConcurrentMap method that yields a concurrent map. A single concurrent map is used in the parallel collection process. When used with a parallel stream, a shared map is more efficient than merging maps. Note that elements are no longer collected in stream order, but that doesn't usually make a difference."*
>
> **Dịch:** Với **mỗi method `toMap`** đều có một method **`toConcurrentMap`** tương ứng sinh ra một **concurrent map**. **Một concurrent map duy nhất** được dùng trong quá trình gom song song. Khi dùng với **parallel stream**, **một map dùng chung hiệu quả hơn việc merge nhiều map**. Lưu ý element **không còn được gom theo thứ tự stream**, nhưng thường thì điều đó **không tạo khác biệt**. Xem [[05 - Synchronization]].

> *"The program in Listing 1.5 gives examples of collecting stream results into maps."*

---

### Listing 1.5 — `collecting/CollectingIntoMaps.java`

```java
package collecting;

/**
 * @version 1.00 2016-05-10
 * @author Cay Horstmann
 */

import java.io.*;
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class CollectingIntoMaps
{
    public static class Person
    {
        private int id;
        private String name;

        public Person(int id, String name)
        {
            this.id = id;
            this.name = name;
        }

        public int getId()
        {
            return id;
        }

        public String getName()
        {
            return name;
        }

        public String toString()
        {
            return getClass().getName() + "[id=" + id + ",name=" + name + "]";
        }
    }

    public static Stream<Person> people()
    {
        return Stream.of(new Person(1001, "Peter"), new Person(1002, "Paul"),
            new Person(1003, "Mary"));
    }

    public static void main(String[] args) throws IOException
    {
        Map<Integer, String> idToName = people().collect(
            Collectors.toMap(Person::getId, Person::getName));
        System.out.println("idToName: " + idToName);

        Map<Integer, Person> idToPerson = people().collect(
            Collectors.toMap(Person::getId, Function.identity()));
        System.out.println("idToPerson: " + idToPerson.getClass().getName()
            + idToPerson);

        idToPerson = people().collect(
            Collectors.toMap(Person::getId, Function.identity(),
                (existingValue, newValue) -> { throw new IllegalStateException(); },
                TreeMap::new));
        System.out.println("idToPerson: " + idToPerson.getClass().getName()
            + idToPerson);

        Stream<Locale> locales = Stream.of(Locale.getAvailableLocales());
        Map<String, String> languageNames = locales.collect(
            Collectors.toMap(
                Locale::getDisplayLanguage,
                l -> l.getDisplayLanguage(l),
                (existingValue, newValue) -> existingValue));
        System.out.println("languageNames: " + languageNames);

        locales = Stream.of(Locale.getAvailableLocales());
        Map<String, Set<String>> countryLanguageSets = locales.collect(
            Collectors.toMap(
                Locale::getDisplayCountry,
                l -> Set.of(l.getDisplayLanguage()),
                (a, b) ->
                { // union of a and b
                    Set<String> union = new HashSet<>(a);
                    union.addAll(b);
                    return union;
                }));
        System.out.println("countryLanguageSets: " + countryLanguageSets);
    }
}
```

---

## API — `java.util.stream.Collectors` (Java 8)

> *"yields a collector that produces a map, unmodifiable map, or concurrent map. The keyMapper and valueMapper functions are applied to each collected element, yielding a key/value entry of the resulting map. By default, an IllegalStateException is thrown when two elements give rise to the same key. You can instead supply a mergeFunction that merges values with the same key. By default, the result is a HashMap or ConcurrentHashMap. You can instead supply a mapSupplier that yields the desired map instance."*

**Dịch (mô tả chung cho cả nhóm method dưới):** sinh ra collector tạo ra **một map, một map không sửa được, hoặc một concurrent map**. Function `keyMapper` và `valueMapper` được áp lên **từng element được gom**, sinh ra một **entry key/value** của map kết quả. Mặc định, **`IllegalStateException` được ném ra khi hai element cho ra cùng một key**. Bạn có thể thay vào đó cung cấp một **`mergeFunction`** để **merge các value cùng key**. Mặc định kết quả là **`HashMap` hoặc `ConcurrentHashMap`**. Bạn có thể thay vào đó cung cấp **`mapSupplier`** sinh ra **instance map mong muốn**.

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T,K,U> Collector<T,?,Map<K,U>> toMap(Function<? super T,? extends K> keyMapper, Function<? super T,? extends U> valueMapper)` | gom vào một `Map` |
| `static <T,K,U> Collector<T,?,Map<K,U>> toMap(keyMapper, valueMapper, BinaryOperator<U> mergeFunction)` | thêm **merge function** giải quyết xung đột key |
| `static <T,K,U,M extends Map<K,U>> Collector<T,?,M> toMap(keyMapper, valueMapper, mergeFunction, Supplier<M> mapSupplier)` | thêm **map supplier** chọn loại map |
| `static <T,K,U> Collector<T,?,Map<K,U>> toUnmodifiableMap(keyMapper, valueMapper)` (Java 10) | gom vào một **map không sửa được** |
| `static <T,K,U> Collector<T,?,Map<K,U>> toUnmodifiableMap(keyMapper, valueMapper, mergeFunction)` (Java 10) | như trên, có merge function |
| `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(keyMapper, valueMapper)` | gom vào một **concurrent map** |
| `static <T,K,U> Collector<T,?,ConcurrentMap<K,U>> toConcurrentMap(keyMapper, valueMapper, mergeFunction)` | như trên, có merge function |
| `static <T,K,U,M extends ConcurrentMap<K,U>> Collector<T,?,M> toConcurrentMap(keyMapper, valueMapper, mergeFunction, Supplier<M> mapSupplier)` | như trên, có map supplier |

---

## Bài kế tiếp

→ [[10 - Grouping and Partitioning]] — `groupingBy`, `partitioningBy` và `groupingByConcurrent`.
