# 11 — Downstream Collectors

> Chapter 1, Section 1.11 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 1.11. Downstream Collectors

> *"The groupingBy method yields a map whose values are lists. If you want to process those lists in some way, supply a downstream collector. For example, if you want sets instead of lists, you can use the Collectors.toSet collector that you saw in the preceding section:"*

```java
Map<String, Set<Locale>> countryToLocaleSet = locales.collect(
    groupingBy(Locale::getCountry, toSet()));
```

**Dịch:** Method `groupingBy` sinh ra một map mà **value là các list**. Nếu muốn **xử lý các list đó theo cách nào đó**, hãy cung cấp một **downstream collector**. Ví dụ nếu muốn **set thay vì list**, dùng collector `Collectors.toSet`.

> **Note (sách):** *"In this example, as well as the remaining examples of this section, I assume a static import of java.util.stream.Collectors.* to make the expressions easier to read."*
>
> **Dịch:** Trong ví dụ này cũng như các ví dụ còn lại của section, tác giả **giả định có static import `java.util.stream.Collectors.*`** để biểu thức **dễ đọc hơn**.

---

## Rút gọn về số: counting, summing*, maxBy/minBy

> *"Several collectors are provided for reducing collected elements to numbers:"*

**Dịch:** Có sẵn **vài collector để rút gọn các element được gom thành số**.

> *"• counting produces a count of the collected elements. For example,"*

```java
Map<String, Long> countryToLocaleCounts = locales.collect(
    groupingBy(Locale::getCountry, counting()));
```

> *"counts how many locales there are for each country."*

**Dịch:** **`counting`** sinh ra **số lượng element được gom**. Ví dụ trên đếm **mỗi quốc gia có bao nhiêu locale**.

> *"• summing(Int|Long|Double) takes a function argument, applies the function to the downstream elements, and produces their sum. For example,"*

```java
Map<String, Integer> stateToCityPopulation = cities.collect(
    groupingBy(City::getState, summingInt(City::getPopulation)));
```

> *"computes the sum of populations per state in a stream of cities."*

**Dịch:** **`summingInt` / `summingLong` / `summingDouble`** nhận một function argument, **áp function đó lên các downstream element**, và sinh ra **tổng** của chúng. Ví dụ trên tính **tổng dân số theo từng bang** trong một stream các thành phố.

> *"• maxBy and minBy take a comparator and produce maximum and minimum of the downstream elements. For example,"*

```java
Map<String, Optional<City>> stateToLargestCity = cities.collect(
    groupingBy(City::getState,
        maxBy(Comparator.comparing(City::getPopulation))));
```

> *"produces the largest city per state."*

**Dịch:** **`maxBy` và `minBy`** nhận một **comparator** và sinh ra **giá trị lớn nhất / nhỏ nhất** của các downstream element. Ví dụ trên cho ra **thành phố lớn nhất của mỗi bang**.

---

## collectingAndThen

> *"The collectingAndThen collector adds a final processing step behind a collector. For example, if you want to know how many distinct results there are, collect them into a set and then compute the size:"*

```java
Map<Character, Integer> stringCountsByStartingLetter = strings.collect(
    groupingBy(s -> s.charAt(0),
        collectingAndThen(toSet(), Set::size)));
```

**Dịch:** Collector **`collectingAndThen`** thêm **một bước xử lý cuối cùng phía sau một collector**. Ví dụ nếu muốn biết **có bao nhiêu kết quả phân biệt**, hãy gom chúng vào một set rồi **tính kích thước**.

---

## mapping và flatMapping

> *"The mapping collector does the opposite. It applies a function to each collected element and passes the results to a downstream collector."*

```java
Map<Character, Set<Integer>> stringLengthsByStartingLetter = strings.collect(
    groupingBy(s -> s.charAt(0),
        mapping(String::length, toSet())));
```

> *"Here, we group strings by their first character. Within each group, we produce the lengths and collect them in a set."*

**Dịch:** Collector **`mapping`** làm **điều ngược lại**: nó **áp một function lên từng element được gom** rồi **truyền kết quả cho một downstream collector**. Ở đây ta nhóm string theo **ký tự đầu tiên**; trong mỗi nhóm ta sinh ra **độ dài** và gom chúng vào một set.

> *"The mapping method also yields a nicer solution to a problem from the preceding section—gathering a set of all languages in a country."*

```java
Map<String, Set<String>> countryToLanguages = locales.collect(
    groupingBy(Locale::getDisplayCountry,
        mapping(Locale::getDisplayLanguage,
            toSet())));
```

**Dịch:** Method `mapping` cũng cho ra **lời giải đẹp hơn** cho bài toán ở section trước — **gom tập mọi ngôn ngữ trong một quốc gia**. Xem [[09 - Collecting into Maps]].

> *"There is a flatMapping method as well, for use with functions that return streams."*

**Dịch:** Còn có method **`flatMapping`**, dùng với **những function trả về stream**.

---

## summarizing* làm downstream collector

> *"If the grouping or mapping function has return type int, long, or double, you can collect elements into a summary statistics object, as discussed in Section 1.8, "Collecting Results," on p. 25. For example,"*

```java
Map<String, IntSummaryStatistics> stateToCityPopulationSummary = cities.collect(
    groupingBy(City::getState,
        summarizingInt(City::getPopulation)));
```

> *"Then you can get the sum, count, average, minimum, and maximum of the function values from the summary statistics objects of each group."*

**Dịch:** Nếu function grouping hoặc mapping có **kiểu trả về `int`, `long` hoặc `double`**, bạn gom được element vào một **summary statistics object**, như đã bàn ở [[08 - Collecting Results]]. Khi đó bạn lấy được **tổng, số lượng, trung bình, nhỏ nhất và lớn nhất** của các giá trị function từ summary statistics object của **từng nhóm**.

---

## filtering

> *"The filtering collector applies a filter to each group, for example:"*

```java
Map<String, Set<City>> largeCitiesByState
    = cities.collect(
        groupingBy(City::getState,
            filtering(c -> c.getPopulation() > 500000,
                toSet()))); // States without large cities have empty sets
```

**Dịch:** Collector **`filtering`** áp một **bộ lọc lên từng nhóm**. Các bang **không có thành phố lớn** sẽ có **set rỗng**.

> **Note (sách):** *"There are also three versions of a reducing method that apply general reductions, as described in the next section."*
>
> **Dịch:** Còn có **ba phiên bản của method `reducing`** thực hiện các **reduction tổng quát**, được mô tả ở [[12 - Reduction Operations]].

---

## Lời cảnh báo về việc kết hợp collector

> *"Composing collectors is powerful, but it can lead to very convoluted expressions. The best use is with groupingBy or partitioningBy to process the "downstream" map values. Otherwise, simply apply methods such as map, reduce, count, max, or min directly on streams."*

**Dịch:** Việc **kết hợp (compose) collector rất mạnh**, nhưng nó **dẫn tới những biểu thức cực kỳ rối rắm**. **Cách dùng tốt nhất là với `groupingBy` hoặc `partitioningBy`** để xử lý các map value "downstream". **Ngoài ra thì cứ áp thẳng các method như `map`, `reduce`, `count`, `max`, `min` lên stream.**

> *"The example program in Listing 1.6 demonstrates downstream collectors."*

---

### Listing 1.6 — `collecting/DownstreamCollectors.java`

```java
package collecting;

/**
 * @version 1.00 2016-05-10
 * @author Cay Horstmann
 */

import static java.util.stream.Collectors.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class DownstreamCollectors
{
    public static class City
    {
        private String name;
        private String state;
        private int population;

        public City(String name, String state, int population)
        {
            this.name = name;
            this.state = state;
            this.population = population;
        }

        public String getName()
        {
            return name;
        }

        public String getState()
        {
            return state;
        }

        public int getPopulation()
        {
            return population;
        }
    }

    public static Stream<City> readCities(String filename) throws IOException
    {
        return Files.lines(Paths.get(filename))
            .map(l -> l.split(", "))
            .map(a -> new City(a[0], a[1], Integer.parseInt(a[2])));
    }

    public static void main(String[] args) throws IOException
    {
        Stream<Locale> locales = Stream.of(Locale.getAvailableLocales());

        Map<String, Set<Locale>> countryToLocaleSet = locales.collect(groupingBy(
            Locale::getCountry, toSet()));
        System.out.println("countryToLocaleSet: " + countryToLocaleSet);

        locales = Stream.of(Locale.getAvailableLocales());
        Map<String, Long> countryToLocaleCounts = locales.collect(groupingBy(
            Locale::getCountry, counting()));
        System.out.println("countryToLocaleCounts: " + countryToLocaleCounts);

        Stream<City> cities = readCities("cities.txt");
        Map<String, Integer> stateToCityPopulation = cities.collect(groupingBy(
            City::getState, summingInt(City::getPopulation)));
        System.out.println("stateToCityPopulation: " + stateToCityPopulation);

        cities = readCities("cities.txt");
        Map<String, Optional<String>> stateToLongestCityName = cities
            .collect(groupingBy(City::getState,
                mapping(City::getName, maxBy(Comparator.comparing(String::length)))));
        System.out.println("stateToLongestCityName: " + stateToLongestCityName);

        locales = Stream.of(Locale.getAvailableLocales());
        Map<String, Set<String>> countryToLanguages = locales.collect(groupingBy(
            Locale::getDisplayCountry, mapping(Locale::getDisplayLanguage, toSet())));
        System.out.println("countryToLanguages: " + countryToLanguages);

        cities = readCities("cities.txt");
        Map<String, IntSummaryStatistics> stateToCityPopulationSummary = cities
            .collect(groupingBy(City::getState, summarizingInt(City::getPopulation)));
        System.out.println(stateToCityPopulationSummary.get("NY"));

        cities = readCities("cities.txt");
        Map<String, String> stateToCityNames = cities.collect(groupingBy(
            City::getState,
            reducing("", City::getName, (s, t) -> s.length() == 0 ? t : s + ", " + t)));

        cities = readCities("cities.txt");
        stateToCityNames = cities.collect(groupingBy(City::getState,
            mapping(City::getName, joining(", "))));
        System.out.println("stateToCityNames: " + stateToCityNames);
    }
}
```

---

## API — `java.util.stream.Collectors` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `public static <T,K,A,D> Collector<T,?,Map<K,D>> groupingBy(Function<? super T,? extends K> classifier, Collector<? super T,A,D> downstream)` | sinh ra collector tạo ra một map. **Key là kết quả áp `classifier`** lên mọi element được gom. **Value là kết quả gom các element cùng key bằng downstream collector** |
| `static <T> Collector<T,?,Long> counting()` | sinh ra collector **đếm các element được gom** |
| `static <T> Collector<T,?,Integer> summingInt(ToIntFunction<? super T> mapper)` | sinh ra collector tính **tổng kết quả áp `mapper`** lên các element được gom |
| `static <T> Collector<T,?,Long> summingLong(ToLongFunction<? super T> mapper)` | tương tự, kiểu `Long` |
| `static <T> Collector<T,?,Double> summingDouble(ToDoubleFunction<? super T> mapper)` | tương tự, kiểu `Double` |
| `static <T> Collector<T,?,Optional<T>> maxBy(Comparator<? super T> comparator)` | sinh ra collector tính **giá trị lớn nhất** của các element được gom, theo thứ tự do comparator chỉ định |
| `static <T> Collector<T,?,Optional<T>> minBy(Comparator<? super T> comparator)` | tương tự, **giá trị nhỏ nhất** |
| `static <T,A,R,RR> Collector<T,A,RR> collectingAndThen(Collector<T,A,R> downstream, Function<R,RR> finisher)` | sinh ra collector **đẩy element tới downstream collector rồi áp function `finisher` lên kết quả của nó** |
| `static <T,U,A,R> Collector<T,?,R> mapping(Function<? super T,? extends U> mapper, Collector<? super U,A,R> downstream)` | sinh ra collector **gọi `mapper` lên từng element và truyền kết quả cho downstream collector** |
| `static <T,U,A,R> Collector<T,?,R> flatMapping(Function<? super T,? extends Stream<? extends U>> mapper, Collector<? super U,A,R> downstream)` | sinh ra collector gọi `mapper` lên từng element và truyền **các element của kết quả** cho downstream collector |
| `static <T,A,R> Collector<T,?,R> filtering(Predicate<? super T> predicate, Collector<? super T,A,R> downstream)` | sinh ra collector **chỉ truyền các element thoả predicate** cho downstream collector |

---

## Bài kế tiếp

→ [[12 - Reduction Operations]] — method `reduce` tổng quát, tính associative, identity, và `collect` ba tham số.
