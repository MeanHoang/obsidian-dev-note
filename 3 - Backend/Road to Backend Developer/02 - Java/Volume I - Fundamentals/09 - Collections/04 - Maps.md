# 04 — Maps

> Chapter 9, Section 9.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.4. Maps

> *"A set is a collection that lets you quickly find an existing element. However, to look up an element, you need to have an exact copy of the element to find. That isn't a very common lookup—usually, you have some key information, and you want to look up the associated element. The map data structure serves that purpose. A map stores key/value pairs. You can find a value if you provide the key. For example, you may store a table of employee records, where the keys are the employee IDs and the values are Employee objects. In the following sections, you will learn how to work with maps."*

**Dịch:** **Set** là collection cho phép **tìm nhanh một element có sẵn**. Nhưng để tra một element, bạn **phải có bản sao chính xác của chính element cần tìm** — đó **không phải kiểu tra cứu phổ biến**. Thường thì bạn có **một mẩu thông tin key** và muốn **tra ra element gắn với nó**. Data structure **map** phục vụ đúng mục đích đó: map **lưu các cặp key/value**, và bạn **tìm được value nếu cung cấp key**. Ví dụ, lưu một bảng hồ sơ nhân viên với **key là employee ID** và **value là object `Employee`**.

---

## 9.4.1. Basic Map Operations

> *"The Java Collections Framework supplies two general-purpose implementations for maps: HashMap and TreeMap. Both classes implement the Map interface."*

**Dịch:** Framework cung cấp **hai implementation đa dụng** cho map: **`HashMap`** và **`TreeMap`**. Cả hai đều implement interface **`Map`**.

> *"A hash map hashes the keys, and a tree map uses an ordering on the keys to organize them in a search tree. The hash or comparison function is applied only to the keys. The values associated with the keys are not hashed or compared."*

**Dịch:** Hash map **hash các key**, còn tree map **dùng một thứ tự trên key** để tổ chức chúng trong một **search tree**. **Hash function hay comparison function chỉ áp lên key** — **value gắn với key thì không bị hash cũng không bị so sánh**.

> *"Should you choose a hash map or a tree map? As with sets, hashing is usually a bit faster, and it is the preferred choice if you don't need to visit the keys in sorted order."*

**Dịch:** Chọn hash map hay tree map? Như với set, **hashing thường nhanh hơn một chút**, và là **lựa chọn ưu tiên nếu bạn không cần duyệt key theo thứ tự đã sắp xếp**.

> *"Here is how you set up a hash map for storing employees:"*

```java
var staff = new HashMap<String, Employee>(); // HashMap implements Map
var harry = new Employee("Harry Hacker");
staff.put("987-98-9996", harry);
. . .
```

> *"Whenever you add an object to a map, you must supply a key as well. In our case, the key is a string, and the corresponding value is an Employee object."*

**Dịch:** Mỗi khi thêm một object vào map, bạn **phải cung cấp kèm một key**. Ở đây key là một [[05 - Strings|string]], còn value tương ứng là một object `Employee`.

> *"To retrieve an object, you must use (and, therefore, remember) the key."*

```java
var id = "987-98-9996";
Employee e = staff.get(id); // gets harry
```

**Dịch:** Để lấy object ra, bạn **phải dùng (và do đó phải nhớ) key**.

> **Caution (sách):** *"For historical reasons, the get method is declared with a parameter of type Object, and not the key type. For example, the following code compiles:"*
>
> ```java
> long numericId = . . .
> Employee e = staff.get(numericId); // Compiles but never gets a value
> ```
>
> **Dịch:** Vì **lý do lịch sử**, method `get` được khai báo với **parameter kiểu `Object`**, **không phải kiểu key**. Vì thế đoạn code trên **compile được nhưng không bao giờ lấy ra được value nào**.

> *"If no information is stored in the map with the particular key specified, get returns null."*

**Dịch:** Nếu **không có thông tin nào được lưu trong map với key chỉ định**, `get` **trả về `null`**.

> *"The null return value can be inconvenient. Sometimes, you have a good default that can be used for keys that are not present in the map. Then use the getOrDefault method."*

```java
Map<String, Integer> scores = . . .;
int score = scores.getOrDefault(id, 0); // gets 0 if the id is not present
```

**Dịch:** Giá trị trả về `null` **có thể gây bất tiện**. Đôi khi bạn **có sẵn một giá trị mặc định tốt** cho các key không có trong map — khi đó **dùng `getOrDefault`**.

> *"Keys must be unique. You cannot store two values with the same key. If you call the put method twice with the same key, the second value replaces the first one. In fact, put returns the previous value associated with its key argument."*

**Dịch:** **Key phải là duy nhất.** Bạn **không lưu được hai value với cùng một key**. Gọi `put` hai lần với cùng key thì **value thứ hai thay thế value thứ nhất**. Thực tế, **`put` trả về value trước đó** đang gắn với key đó.

> *"The remove method removes an element with a given key from the map. The size method returns the number of entries in the map."*

**Dịch:** Method **`remove`** xoá element có key cho trước khỏi map. Method **`size`** trả về **số entry trong map**.

> *"The easiest way of iterating over the keys and values of a map is the forEach method. Provide a lambda expression that receives a key and a value. That expression is invoked for each map entry in turn."*

```java
scores.forEach((k, v) ->
    System.out.println("key=" + k + ", value=" + v));
```

**Dịch:** Cách dễ nhất để duyệt key và value của một map là method **`forEach`**. Cung cấp một [[02 - Lambda Expressions|lambda expression]] **nhận một key và một value**; biểu thức đó **được gọi lần lượt cho từng entry của map**.

> *"Listing 9.6 illustrates a map at work. We first add key/value pairs to a map. Then, we remove one key from the map, which removes its associated value as well. Next, we change the value that is associated with a key and call the get method to look up a value. Finally, we iterate through the entry set."*

**Dịch:** Listing 9.6 minh hoạ map hoạt động: **thêm cặp key/value**, **xoá một key** (kéo theo value gắn với nó), **đổi value gắn với một key**, **gọi `get` để tra value**, cuối cùng **duyệt qua entry set**.

### Listing 9.6 — `map/MapTest.java`

```java
package map;

import java.util.*;

/**
 * This program demonstrates the use of a map with key type String and value type Employee.
 * @version 1.12 2015-06-21
 * @author Cay Horstmann
 */
public class MapTest
{
    public static void main(String[] args)
    {
        var staff = new HashMap<String, Employee>();
        staff.put("144-25-5464", new Employee("Amy Lee"));
        staff.put("567-24-2546", new Employee("Harry Hacker"));
        staff.put("157-62-7935", new Employee("Gary Cooper"));
        staff.put("456-62-5527", new Employee("Francesca Cruz"));

        // print all entries

        System.out.println(staff);

        // remove an entry

        staff.remove("567-24-2546");

        // replace an entry

        staff.put("456-62-5527", new Employee("Francesca Miller"));

        // look up a value

        System.out.println(staff.get("157-62-7935"));

        // iterate through all entries

        staff.forEach((k, v) ->
            System.out.println("key=" + k + ", value=" + v));
    }
}
```

## API — `java.util.Map<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `V get(Object key)` | lấy value gắn với key; trả về object gắn với key, hoặc `null` nếu **không tìm thấy key** trong map. Class implement **có thể cấm key `null`**. |
| `default V getOrDefault(Object key, V defaultValue)` | lấy value gắn với key; trả về object gắn với key, hoặc `defaultValue` nếu không tìm thấy key. |
| `V put(K key, V value)` | đưa liên kết key–value vào map. Nếu **key đã có**, object mới **thay thế object cũ**. Method này trả về **value cũ của key**, hoặc `null` nếu key chưa từng có. Class implement **có thể cấm key hoặc value `null`**. |
| `void putAll(Map<? extends K, ? extends V> entries)` | thêm **mọi entry** từ map chỉ định vào map này. |
| `boolean containsKey(Object key)` | trả về `true` nếu **key có mặt** trong map. |
| `boolean containsValue(Object value)` | trả về `true` nếu **value có mặt** trong map. |
| `default void forEach(BiConsumer<? super K,? super V> action)` **(8)** | áp dụng `action` lên **mọi cặp key/value** của map này. |

## API — `java.util.HashMap<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `HashMap()` / `HashMap(int initialCapacity)` / `HashMap(int initialCapacity, float loadFactor)` | dựng một hash map rỗng với capacity và load factor chỉ định (**load factor là số trong khoảng 0.0 tới 1.0**, quyết định **hash table đầy tới mức bao nhiêu phần trăm thì rehash sang table lớn hơn**). Load factor mặc định là **0.75**. |
| `static <K, V> HashMap<K, V> newHashMap(int numMappings)` **(19)** | dựng một hash map rỗng với **initial capacity đủ** chứa số entry kỳ vọng (`numMappings`) mà **không phải rehash**. |

## API — `java.util.TreeMap<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `TreeMap()` | dựng một tree map rỗng cho **key implement interface `Comparable`**. |
| `TreeMap(Comparator<? super K> c)` | dựng một tree map và **dùng comparator chỉ định để sắp xếp key**. |
| `TreeMap(Map<? extends K, ? extends V> entries)` | dựng một tree map và thêm mọi entry từ một map. |
| `TreeMap(SortedMap<? extends K, ? extends V> entries)` | dựng một tree map, thêm mọi entry từ một sorted map, và **dùng cùng element comparator** với sorted map đó. |

## API — `java.util.SortedMap<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Comparator<? super K> comparator()` | trả về comparator dùng để sắp xếp key, hoặc `null` nếu key được so bằng `compareTo` của interface `Comparable`. |
| `K firstKey()` / `K lastKey()` | trả về **key nhỏ nhất** hoặc **key lớn nhất** trong map. |

---

## 9.4.2. Updating Map Entries

> *"A tricky part of dealing with maps is updating an entry. Normally, you get the old value associated with a key, update it, and put back the updated value. But you have to worry about the special case of the first occurrence of a key. Consider using a map for counting how often a word occurs in a file. When we see a word, we'd like to increment a counter like this:"*

```java
counts.put(word, counts.get(word) + 1);
```

> *"That works, except in the case when word is encountered for the first time. Then get returns null, and a NullPointerException occurs."*

**Dịch:** Phần **rắc rối** khi làm việc với map là **cập nhật một entry**. Bình thường bạn **lấy value cũ gắn với key, cập nhật nó, rồi put lại**. Nhưng phải lo **trường hợp đặc biệt: lần đầu tiên gặp key**. Với bài toán **đếm số lần một từ xuất hiện trong file**, đoạn code trên chạy đúng — **trừ khi `word` được gặp lần đầu**: khi đó `get` trả về `null` và **xảy ra `NullPointerException`**.

> *"A simple remedy is to use the getOrDefault method:"*

```java
counts.put(word, counts.getOrDefault(word, 0) + 1);
```

**Dịch:** Cách chữa đơn giản là **dùng `getOrDefault`**.

> *"Another approach is to first call the putIfAbsent method. It only puts a value if the key was previously absent (or mapped to null)."*

```java
counts.putIfAbsent(word, 0);
counts.put(word, counts.get(word) + 1); // now we know that get will succeed
```

**Dịch:** Cách khác là **gọi `putIfAbsent` trước**. Nó **chỉ put value nếu key trước đó vắng mặt** (hoặc đang map tới `null`).

> *"But you can do better than that. The merge method simplifies this common operation. The call"*

```java
counts.merge(word, 1, Integer::sum);
```

> *"associates word with 1 if the key wasn't previously present, and otherwise combines the previous value and 1, using the Integer::sum function."*

**Dịch:** Nhưng còn cách tốt hơn. Method **`merge`** làm gọn thao tác phổ biến này: lời gọi trên **gắn `word` với `1` nếu key chưa từng có**, còn không thì **kết hợp value trước đó với `1`** bằng function **`Integer::sum`**.

> *"Now consider another common situation. We want to associate a set with each key. For example, in a book index, each term has a set of page numbers where the term occurs. Here is how to update the map:"*

```java
var index = new TreeMap<String, TreeSet<Integer>>();
. . .
index.computeIfAbsent(term, k -> new TreeSet<>()).add(pageNumber);
```

**Dịch:** Một tình huống phổ biến khác: **gắn một set với mỗi key**. Ví dụ, trong **index của một cuốn sách**, mỗi thuật ngữ có **một set các số trang** nơi nó xuất hiện.

> *"Here, it is better to use computeIfAbsent because the TreeSet is only constructed when there was no prior set associated with the term. Conveniently, computeIfAbsent returns the new value, so that we can chain the call to add. In contrast, putIfAbsent returns the previous key or null, which is not useful for chaining."*

**Dịch:** Ở đây **dùng `computeIfAbsent` tốt hơn**, vì **`TreeSet` chỉ được dựng khi trước đó chưa có set nào gắn với term**. Tiện lợi là **`computeIfAbsent` trả về value mới**, nên **nối chuỗi được lời gọi `add`**. Ngược lại, `putIfAbsent` **trả về key trước đó hoặc `null`** — **không dùng được để nối chuỗi**.

> **Caution (sách):** *"It is tempting to try changing k -> new TreeSet<>() into TreeSet::new, but that does not work. The function has a parameter k for the given key, which would be passed on to the constructor. Fortunately, there is no TreeSet constructor with a String parameter, and the code does not compile."*
>
> *"It could have been worse. Suppose you have a Map<Integer, ArrayList<String>> and call"*
>
> ```java
> map.computeIfAbsent(n, ArrayList::new)
> ```
>
> *"There is an ArrayList constructor that takes an integer capacity. For large values of n, large array lists would be allocated, which was surely not intended."*
>
> **Dịch:** Rất dễ bị cám dỗ đổi `k -> new TreeSet<>()` thành `TreeSet::new`, **nhưng không được**. Function này có **parameter `k` là key**, và **`k` sẽ được truyền vào constructor**. May thay, **không có constructor `TreeSet` nhận parameter `String`**, nên **code không compile**. Có thể còn tệ hơn: với `Map<Integer, ArrayList<String>>`, **có một constructor `ArrayList` nhận integer capacity** — với **`n` lớn**, những **array list khổng lồ sẽ bị cấp phát**, chắc chắn **không phải điều bạn muốn**.

> **Caution (sách):** *"The map methods are not very consistent about null values. Some methods treat null as a valid value, but others consider it in the same way as a missing key. The getOrDefault method falls in the former camp, and putIfAbsent in the latter:"*
>
> ```java
> counts.put("C++", null);
> counts.getOrDefault("C++", -1) // Yields null without using the default
> counts.putIfAbsent("C++", 1)   // Puts 1, interpreting null as absent
> ```
>
> **Dịch:** Các method của map **không nhất quán lắm về giá trị `null`**. Một số method coi **`null` là value hợp lệ**, số khác coi nó **như key vắng mặt**. **`getOrDefault` thuộc nhóm đầu**, còn **`putIfAbsent` thuộc nhóm sau**.

> *"The API notes describe other methods for updating map entries that are less commonly used."*

## API — `java.util.Map<K, V>` (Java 1.2) — cập nhật entry

| Method | Mô tả (dịch từ sách) |
|---|---|
| `default V merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)` **(8)** | Nếu `key` đang gắn với một value `v` **khác `null`**, áp dụng function lên `v` và `value`, rồi **gắn `key` với kết quả**, hoặc **xoá key nếu kết quả là `null`**. Ngược lại, **gắn `key` với `value`**. Trả về `get(key)`. |
| `default V compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` **(8)** | Áp dụng function lên `key` và `get(key)`. Gắn `key` với kết quả, hoặc **xoá key nếu kết quả là `null`**. Trả về `get(key)`. |
| `default V computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` **(8)** | Nếu `key` đang gắn với value `v` khác `null`, áp dụng function lên `key` và `v`, rồi gắn `key` với kết quả, hoặc xoá key nếu kết quả là `null`. Trả về `get(key)`. |
| `default V computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` **(8)** | Áp dụng function lên `key` **trừ khi `key` đã gắn với một value khác `null`**. Gắn `key` với kết quả, hoặc xoá key nếu kết quả là `null`. Trả về `get(key)`. |
| `default void replaceAll(BiFunction<? super K,? super V,? extends V> function)` **(8)** | Gọi function trên **mọi entry**. **Gắn key với kết quả khác `null`** và **xoá key có kết quả `null`**. |
| `default V putIfAbsent(K key, V value)` **(8)** | Nếu `key` **vắng mặt hoặc đang gắn với `null`**, gắn nó với `value` và **trả về `null`**. Ngược lại **trả về value đang gắn**. |

---

## 9.4.3. Map Views

> *"The Java Collections Framework does not consider a map itself as a collection. (Other frameworks for data structures consider a map as a collection of key/value pairs, or as a collection of values indexed by the keys.) However, you can obtain views of the map—objects that implement the Collection interface or one of its subinterfaces."*

**Dịch:** Java Collections Framework **không coi bản thân map là một collection**. (Các framework data structure khác coi map là **collection các cặp key/value**, hoặc **collection các value được đánh index bằng key**.) Tuy nhiên, bạn lấy được **view của map** — **object implement interface `Collection`** hoặc một subinterface của nó.

> *"There are three views: the set of keys, the collection of values (which is not a set), and the set of key/value pairs. The keys and key/value pairs form a set because there can be only one copy of a key in a map. The methods"*

```java
Set<K> keySet()
Collection<V> values()
Set<Map.Entry<K, V>> entrySet()
```

> *"return these three views. (The elements of the entry set are objects of a class implementing the Map.Entry interface.)"*

**Dịch:** Có **ba view**: **set các key**, **collection các value** (**không phải set**), và **set các cặp key/value**. Key và cặp key/value **tạo thành set vì trong map mỗi key chỉ có một bản**. Element của entry set là **object của một class implement interface `Map.Entry`**.

> *"Note that the keySet is not a HashSet or TreeSet, but an object of some other class that implements the Set interface. The Set interface extends the Collection interface. Therefore, you can use a keySet as you would use any collection."*

**Dịch:** Lưu ý `keySet` **không phải `HashSet` hay `TreeSet`**, mà là **object của một class khác implement interface `Set`**. Vì `Set` extends `Collection` nên bạn **dùng `keySet` y như dùng bất kỳ collection nào**.

> *"For example, you can enumerate all keys of a map:"*

```java
Set<String> keys = map.keySet();
for (String key : keys)
{
    do something with key
}
```

> *"If you want to look at both keys and values, you can avoid value lookups by enumerating the entries. Use the following code skeleton:"*

```java
for (Map.Entry<String, Integer> entry : counts.entrySet())
{
    String k = entry.getKey();
    Integer v = entry.getValue();
    do something with k, v
}
```

**Dịch:** Nếu muốn nhìn **cả key lẫn value**, bạn **tránh được việc tra cứu value** bằng cách **duyệt các entry**.

> *"The Map.Entry instances are connected to the map. You can use an entry object to update a value in the underlying map."*

```java
for (Map.Entry<String, Integer> entry : counts.entrySet())
{
    String k = entry.getKey();
    Integer v = entry.getValue();
    entry.setValue(v + 1); // same as counts.put(k, v + 1);
}
```

**Dịch:** Các instance `Map.Entry` **được nối với map**. Bạn **dùng một entry object để cập nhật value trong map nền**.

> *"Conversely, if you update a value through other means (for example, by calling the map's put method), then the entry is also updated."*

**Dịch:** Ngược lại, nếu bạn cập nhật value **bằng cách khác** (ví dụ gọi `put` của map) thì **entry cũng được cập nhật theo**.

> *"If you want to pass entries to some other method, you should disassociate them from the map by calling Map.Entry.copyOf(entry). You can also create unassociated Map.Entry instances by calling Map.entry(key, value). This is handy whenever you need a pair of values."*

**Dịch:** Nếu muốn **truyền entry sang method khác**, bạn nên **tách nó khỏi map** bằng cách gọi **`Map.Entry.copyOf(entry)`**. Bạn cũng **tạo được instance `Map.Entry` không gắn với map nào** bằng **`Map.entry(key, value)`** — **tiện mỗi khi cần một cặp giá trị**.

> **Tip (sách):** *"You can avoid the cumbersome Map.Entry by using a var declaration."*
>
> ```java
> for (var entry : map.entrySet())
> {
>     do something with entry.getKey(), entry.getValue()
> }
> ```
>
> *"Or simply use the forEach method:"*
>
> ```java
> map.forEach((k, v) ->
> {
>     do something with k, v
> });
> ```
>
> **Dịch:** Bạn **né được kiểu `Map.Entry` cồng kềnh** bằng khai báo **`var`**. Hoặc đơn giản là **dùng method `forEach`**.

> *"If you invoke the remove method of the iterator on the key set view, you actually remove the key and its associated value from the map. However, you cannot add an element to the key set view. It makes no sense to add a key without also adding a value. If you try to invoke the add method, it throws an UnsupportedOperationException. The entry set view has the same restriction, even though it would make conceptual sense to add a new key/value pair."*

**Dịch:** Nếu gọi `remove` của iterator trên **key set view**, bạn thực sự **xoá cả key lẫn value gắn với nó khỏi map**. Nhưng **không thêm được element vào key set view** — **thêm key mà không thêm value là vô nghĩa**. Gọi `add` sẽ **ném `UnsupportedOperationException`**. **Entry set view cũng bị hạn chế y hệt**, dù về mặt khái niệm thì **thêm một cặp key/value mới là hợp lý**.

## API — `java.util.Map<K, V>` (Java 1.2) — view

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Set<Map.Entry<K, V>> entrySet()` | trả về **set view các object `Map.Entry`** — các cặp key/value trong map. Bạn **xoá được element khỏi set này** và chúng **bị xoá khỏi map**, nhưng **không thêm được element nào**. |
| `Set<K> keySet()` | trả về **set view mọi key** trong map. Bạn xoá được element khỏi set này và **key cùng value gắn với nó bị xoá khỏi map**, nhưng **không thêm được element nào**. |
| `Collection<V> values()` | trả về **collection view mọi value** trong map. Bạn xoá được element khỏi collection này và **value bị xoá cùng key của nó bị xoá khỏi map**, nhưng **không thêm được element nào**. |

## API — `java.util.Map.Entry<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `K getKey()` / `V getValue()` | trả về **key** hoặc **value** của entry này. |
| `V setValue(V newValue)` | đổi value trong map gắn với entry thành value mới và **trả về value cũ**. |
| `static <K, V> Map.Entry<K,V> copyOf(Map.Entry<? extends K,? extends V> map)` **(17)** | tạo ra **bản sao của map entry cho trước**. Khác với element của entry set trong map, **bản sao này không "sống"** — gọi `setValue` **không cập nhật map nào cả**. |

---

## 9.4.4. Weak Hash Maps

> *"The Java Collections Framework has several map classes for specialized needs that we briefly discuss in this and the following sections."*

**Dịch:** Framework có **vài map class cho nhu cầu chuyên biệt**.

> *"The WeakHashMap class was designed to solve an interesting problem. What happens with a value whose key is no longer used anywhere in your program? Suppose the last reference to a key has gone away. Then, there is no longer any way to refer to the value object. But, as no part of the program has the key any more, the key/value pair cannot be removed from the map. Why can't the garbage collector remove it? Isn't it the job of the garbage collector to remove unused objects?"*

**Dịch:** Class **`WeakHashMap`** được thiết kế để giải một vấn đề thú vị. **Chuyện gì xảy ra với một value mà key của nó không còn được dùng ở đâu trong chương trình?** Giả sử **reference cuối cùng tới key đã biến mất** — khi đó **không còn cách nào tham chiếu tới object value nữa**. Nhưng vì **không phần nào của chương trình còn giữ key**, **cặp key/value không thể bị xoá khỏi map**. **Sao garbage collector không xoá nó đi?**

> *"Unfortunately, it isn't quite so simple. The garbage collector traces live objects. As long as the map object is live, all buckets in it are live and won't be reclaimed. Thus, your program should take care to remove unused values from long-lived maps. Or, you can use a WeakHashMap instead. This data structure cooperates with the garbage collector to remove key/value pairs when the only reference to the key is the one from the hash table entry."*

**Dịch:** Tiếc là **không đơn giản như vậy**. Garbage collector **lần theo các object còn sống**. **Chừng nào object map còn sống thì mọi bucket trong nó còn sống và không bị thu hồi.** Vì thế chương trình của bạn **phải tự lo xoá các value không dùng khỏi những map sống lâu**. Hoặc **dùng `WeakHashMap`** — data structure này **hợp tác với garbage collector** để **xoá cặp key/value khi reference duy nhất tới key là reference từ chính entry của hash table**.

> *"Here are the inner workings of this mechanism. The WeakHashMap uses weak references to hold keys. A WeakReference object holds a reference to another object—in our case, a hash table key. Objects of this type are treated in a special way by the garbage collector. Normally, if the garbage collector finds that a particular object has no references to it, it simply reclaims the object. However, if the object is reachable only by a WeakReference, the garbage collector still reclaims the object, but places the weak reference that led to it into a queue. The operations of the WeakHashMap periodically check that queue for newly arrived weak references. The arrival of a weak reference in the queue signifies that the key was no longer used by anyone and has been collected. The WeakHashMap then removes the associated entry."*

**Dịch:** Cơ chế bên trong như sau. `WeakHashMap` dùng **weak reference để giữ key**. Một object **`WeakReference`** giữ reference tới một object khác — ở đây là **key của hash table**. Object loại này **được garbage collector đối xử đặc biệt**. Bình thường, nếu garbage collector thấy một object **không còn reference nào trỏ tới**, nó **thu hồi luôn**. Nhưng nếu object **chỉ tới được qua một `WeakReference`**, garbage collector **vẫn thu hồi object**, nhưng **đặt weak reference dẫn tới nó vào một queue**. Các thao tác của `WeakHashMap` **định kỳ kiểm tra queue đó** xem có weak reference mới tới không. **Weak reference xuất hiện trong queue nghĩa là key không còn ai dùng và đã bị thu hồi** — `WeakHashMap` khi đó **xoá entry tương ứng**.

---

## 9.4.5. Linked Hash Sets and Maps

> *"The LinkedHashSet and LinkedHashMap classes remember in which order you inserted items. That way, you can avoid the seemingly random order of items in a hash table. As entries are inserted into the table, they are joined in a doubly linked list (see Figure 9.11)."*

**Dịch:** Class **`LinkedHashSet`** và **`LinkedHashMap`** **nhớ thứ tự bạn chèn các item vào**. Nhờ vậy bạn **tránh được thứ tự trông có vẻ ngẫu nhiên** của item trong hash table. Khi entry được chèn vào table, chúng **được nối lại thành một doubly linked list**.

**Figure 9.11: A linked hash table**

```
   bucket table                entries
   ┌────────┐
   │        │──────────► ┌───┬───┬───┬───┐
   ├────────┤            │ ② │   │   │   │
   │        │            └───┴───┴───┴───┘
   ├────────┤
   │        │──────────► ┌───┬───┬───┬───┐    ┌───┬───┬───┬───┐
   ├────────┤            │ ① │   │   │   │───►│ ③ │   │   │   │
   │        │            └───┴───┴───┴───┘    └───┴───┴───┴───┘
   ├────────┤                (cùng một bucket → chain)
   │        │──────────► ┌───┬───┬───┬───┐
   └────────┘            │ ④ │   │   │   │
                         └───┴───┴───┴───┘

   thứ tự chèn (doubly linked list xuyên qua mọi bucket):

        ① ⇄ ② ⇄ ③ ⇄ ④
```

Bucket table quyết định **vị trí lưu** (thứ tự "ngẫu nhiên"); ngoài ra mọi entry còn được xâu thành một **doubly linked list theo thứ tự chèn** ① → ② → ③ → ④.

> *"For example, consider the following map insertions from Listing 9.6:"*

```java
var staff = new LinkedHashMap<String, Employee>();
staff.put("144-25-5464", new Employee("Amy Lee"));
staff.put("567-24-2546", new Employee("Harry Hacker"));
staff.put("157-62-7935", new Employee("Gary Cooper"));
staff.put("456-62-5527", new Employee("Francesca Cruz"));
```

> *"Then, staff.keySet().iterator() enumerates the keys in this order:"*

```
144-25-5464
567-24-2546
157-62-7935
456-62-5527
```

> *"and staff.values().iterator() enumerates the values in this order:"*

```
Amy Lee
Harry Hacker
Gary Cooper
Francesca Cruz
```

### Access order

> *"A linked hash map can alternatively use access order, not insertion order, to iterate through the map entries. Every time you call get or put, the affected entry is removed from its current position and placed at the end of the linked list of entries. (Only the position in the linked list of entries is affected, not the hash table bucket. An entry always stays in the bucket that corresponds to the hash code of the key.) To construct such a hash map, call"*

```java
LinkedHashMap<K, V>(initialCapacity, loadFactor, true)
```

**Dịch:** Một linked hash map còn có thể dùng **access order** thay vì **insertion order** để duyệt các entry. **Mỗi lần bạn gọi `get` hoặc `put`, entry bị tác động được gỡ khỏi vị trí hiện tại và đặt vào cuối linked list các entry.** (Chỉ **vị trí trong linked list** bị ảnh hưởng, **không phải bucket của hash table** — một entry **luôn nằm trong bucket ứng với hash code của key**.)

> *"Access order is useful for implementing a "least recently used" discipline for a cache. For example, you may want to keep frequently accessed entries in memory and read less frequently accessed objects from a database. When you don't find an entry in the table, and the table is already pretty full, you can get an iterator into the table and remove the first few elements that it enumerates. Those entries were the least recently used ones."*

**Dịch:** Access order hữu ích để implement chiến lược **"least recently used"** cho một **cache**. Ví dụ, bạn muốn **giữ trong memory các entry hay được truy cập**, còn **đọc từ database các object ít được truy cập hơn**. Khi **không tìm thấy entry trong table** mà **table đã khá đầy**, bạn **lấy một iterator vào table và xoá vài element đầu tiên nó liệt kê** — đó chính là **những entry ít được dùng gần đây nhất**.

> *"You can even automate that process. Form a subclass of LinkedHashMap and override the method"*

```java
protected boolean removeEldestEntry(Map.Entry<K, V> eldest)
```

> *"This method is caled after adding a new entry. If the method returns true, the eldest entry is removed. For example, the following cache is kept at a size of at most 100 elements:"*

```java
var cache = new LinkedHashMap<K, V>(128, 0.75F, true)
    {
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest)
        {
            return size() > 100;
        }
    };
```

**Dịch:** Bạn **tự động hoá được quy trình đó**: tạo **subclass của `LinkedHashMap`** và **override method `removeEldestEntry`**. Method này **được gọi sau khi thêm một entry mới**. Nếu nó **trả về `true`** thì **entry già nhất bị xoá**. Ví dụ trên giữ cache **ở kích thước tối đa 100 element**.

> *"You can inspect the eldest entry to decide whether to remove it. For example, you may want to check a time stamp stored with eldest and only ask for removal if it is sufficiently old. This will not automatically remove all old elements since the removeEldestEntry method is only called once for each new entry. You are allowed to modify the map in the removeEldestEntry method, for example by removing the initial elements that are sufficiently old. In that case, you must return false."*

**Dịch:** Bạn **soi được entry già nhất để quyết định có xoá không**. Ví dụ, kiểm tra **time stamp lưu kèm `eldest`** và **chỉ yêu cầu xoá nếu nó đủ cũ**. Cách này **không tự động xoá hết mọi element cũ**, vì **`removeEldestEntry` chỉ được gọi một lần cho mỗi entry mới**. Bạn **được phép sửa map ngay trong `removeEldestEntry`**, ví dụ xoá các element đầu đủ cũ — **khi đó bạn phải trả về `false`**.

> *"If you need a set of least recently used elements instead of a map, see Section 9.5.4."*

**Dịch:** Nếu cần một **set** các element ít dùng gần đây thay vì map, xem [[05 - Copies and Views]].

---

## 9.4.6. Enumeration Sets and Maps

> *"The EnumSet is an efficient set implementation with elements that belong to an enumerated type. Since an enumerated type has a finite number of instances, the EnumSet is internally implemented simply as a sequence of bits. A bit is turned on if the corresponding value is present in the set."*

**Dịch:** **`EnumSet`** là một implementation set **hiệu quả** cho element thuộc **kiểu enumerated**. Vì kiểu enumerated có **số instance hữu hạn**, `EnumSet` được implement bên trong đơn giản là **một dãy bit**: **một bit được bật nếu giá trị tương ứng có trong set**.

> *"The EnumSet class has no public constructors. Use a static factory method to construct the set:"*

```java
enum Weekday { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
EnumSet<Weekday> always = EnumSet.allOf(Weekday.class);
EnumSet<Weekday> never = EnumSet.noneOf(Weekday.class);
EnumSet<Weekday> workday = EnumSet.range(Weekday.MONDAY, Weekday.FRIDAY);
EnumSet<Weekday> mwf = EnumSet.of(Weekday.MONDAY, Weekday.WEDNESDAY, Weekday.FRIDAY);
```

**Dịch:** Class `EnumSet` **không có constructor public**. Dùng **static factory method** để dựng set.

> *"You can use the usual methods of the Set interface to modify an EnumSet."*

**Dịch:** Bạn **dùng các method thường lệ của interface `Set`** để sửa một `EnumSet`.

> *"An EnumMap is a map with keys that belong to an enumerated type. It is simply and efficiently implemented as an array of values. You need to specify the key type in the constructor:"*

```java
var personInCharge = new EnumMap<Weekday, Employee>(Weekday.class);
```

**Dịch:** **`EnumMap`** là map có **key thuộc kiểu enumerated**. Nó được implement **đơn giản và hiệu quả dưới dạng một array các value**. Bạn **phải chỉ định kiểu key trong constructor**.

> **Note (sách):** *"In the API documentation for EnumSet and EnumMap, you will see odd-looking type parameters of the form E extends Enum<E>. This simply means "E is an enumerated type." All enumerated types extend the generic Enum class. For example, Weekday extends Enum<Weekday>."*
>
> **Dịch:** Trong tài liệu API của `EnumSet` và `EnumMap`, bạn sẽ thấy **type parameter trông kỳ quặc dạng `E extends Enum<E>`**. Nó đơn giản nghĩa là **"E là một kiểu enumerated"**. **Mọi kiểu enumerated đều extend class generic `Enum`** — ví dụ `Weekday extends Enum<Weekday>`.

---

## 9.4.7. Identity Hash Maps

> *"The IdentityHashMap has a quite specialized purpose. Here, the hash values for the keys should not be computed by the hashCode method but by the System.identityHashCode method. That's the method that Object.hashCode uses to compute a hash code from the object's memory address. Also, for comparison of objects, the IdentityHashMap uses ==, not equals."*

**Dịch:** **`IdentityHashMap`** có mục đích **khá chuyên biệt**. Ở đây, **giá trị hash của key không được tính bằng `hashCode`** mà bằng **`System.identityHashCode`** — chính method mà **`Object.hashCode` dùng để tính hash code từ địa chỉ memory của object**. Ngoài ra, khi so sánh object, `IdentityHashMap` **dùng `==`, không dùng `equals`**.

> *"In other words, different key objects are considered distinct even if they have equal contents. This class is useful for implementing object traversal algorithms, such as object serialization, in which you want to keep track of which objects have already been traversed."*

**Dịch:** Nói cách khác, **các object key khác nhau được coi là phân biệt kể cả khi nội dung bằng nhau**. Class này **hữu ích để implement thuật toán duyệt object** — ví dụ **object serialization** — nơi bạn muốn **theo dõi những object nào đã được duyệt qua rồi**.

> **Caution (sách):** *"Java 20 fixed a subtle bug with IdentityHashMap that was introduced in Java 8 (https://bugs.openjdk.org/browse/JDK-8284901). Two uncommon methods falsely used equals instead of ==:"*
>
> ```java
> void remove(Object key, Object value)
> void replace(K key, V oldValue, V newValue)
> ```
>
> *"These methods are sometimes used in concurrent algorithms, where a map should only be updated if it hasn't been modified by another thread. One can only imagine the frustration of the first programmer who ran into this bug."*
>
> *"No software system as complex as the Java platform can be completely free from bugs. That is why it is important to regularly update to the latest version."*
>
> **Dịch:** **Java 20 đã sửa một bug tinh vi** của `IdentityHashMap` **xuất hiện từ Java 8**. Hai method ít dùng đã **nhầm lẫn dùng `equals` thay vì `==`**. Chúng **đôi khi được dùng trong thuật toán concurrent**, nơi map **chỉ nên được cập nhật nếu chưa bị thread khác sửa**. **Chỉ có thể tưởng tượng nỗi bực của lập trình viên đầu tiên vấp phải bug này.** Không hệ thống phần mềm nào phức tạp như Java platform mà **hoàn toàn sạch bug** — vì thế **cập nhật lên bản mới nhất là điều quan trọng**.

---

## API — `java.util.WeakHashMap<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `WeakHashMap()` / `WeakHashMap(int initialCapacity)` / `WeakHashMap(int initialCapacity, float loadFactor)` | dựng một hash map rỗng với capacity và load factor chỉ định. |

## API — `java.util.LinkedHashSet<E>` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `LinkedHashSet()` / `LinkedHashSet(int initialCapacity)` / `LinkedHashSet(int initialCapacity, float loadFactor)` | dựng một linked hash set rỗng với capacity và load factor chỉ định. |

## API — `java.util.LinkedHashMap<K, V>` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `LinkedHashMap()` / `LinkedHashMap(int initialCapacity)` / `LinkedHashMap(int initialCapacity, float loadFactor)` / `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)` | dựng một linked hash map rỗng với capacity, load factor và **thứ tự** chỉ định. Parameter `accessOrder` là **`true` cho access order**, **`false` cho insertion order**. |
| `protected boolean removeEldestEntry(Map.Entry<K, V> eldest)` | **nên được override** để trả về `true` nếu bạn muốn **entry già nhất bị xoá**. Parameter `eldest` là entry **đang được cân nhắc xoá**. Method này **được gọi sau khi một entry đã được thêm vào map**. Implementation mặc định **trả về `false`** — mặc định **element cũ không bị xoá**. Bạn có thể định nghĩa lại để **trả về `true` một cách có chọn lọc**, ví dụ nếu entry già nhất **thoả một điều kiện nào đó** hoặc nếu **map vượt quá một kích thước nhất định**. |

## API — `java.util.EnumSet<E extends Enum<E>>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E extends Enum<E>> EnumSet<E> allOf(Class<E> enumType)` | trả về một set **mutable chứa mọi giá trị** của kiểu enumerated cho trước. |
| `static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> enumType)` | trả về một set mutable **ban đầu rỗng**. |
| `static <E extends Enum<E>> EnumSet<E> range(E from, E to)` | trả về một set mutable chứa **mọi giá trị giữa `from` và `to`** (**bao gồm cả hai đầu**). |
| `static <E extends Enum<E>> EnumSet<E> of(E e)` … `of(E e1, E e2, E e3, E e4, E e5)` / `of(E first, E... rest)` | trả về một set mutable chứa các element cho trước — **các element này không được là `null`**. |
| `public static <E extends Enum<E>> EnumSet<E> copyOf(EnumSet<E> s)` / `copyOf(Collection<E> c)` | tạo một set mutable **ban đầu chứa các element cho trước**. Ở method thứ hai, `c` **phải là một `EnumSet`** hoặc **phải không rỗng** (để xác định được kiểu element). |

## API — `java.util.EnumMap<K extends Enum<K>, V>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `EnumMap(Class<K> keyType)` | dựng một map mutable rỗng có **key thuộc kiểu cho trước**. |

## API — `java.util.IdentityHashMap<K, V>` (Java 1.4)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `IdentityHashMap()` / `IdentityHashMap(int expectedMaxSize)` | dựng một identity hash map rỗng có capacity là **luỹ thừa của 2 nhỏ nhất vượt quá `1.5 × expectedMaxSize`**. (Mặc định `expectedMaxSize` là **21**.) |

## API — `java.lang.System` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int identityHashCode(Object obj)` **(1.1)** | trả về **đúng hash code** (suy ra từ **địa chỉ memory của object**) mà `Object.hashCode` tính ra, **kể cả khi class của `obj` đã định nghĩa lại method `hashCode`**. |

---

## Bài kế tiếp

→ [[05 - Copies and Views]] — small collection, unmodifiable view, subrange, synchronized view, checked view và các view khác.
