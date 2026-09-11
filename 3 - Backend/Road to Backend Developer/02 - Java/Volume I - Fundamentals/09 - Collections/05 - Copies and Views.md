# 05 — Copies and Views

> Chapter 9, Section 9.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.5. Copies and Views

> *"You might think it is overkill to have lots of interfaces (Figure 9.4) and abstract classes (Figure 9.5) to implement a modest number of concrete collection classes. However, these figures don't tell the whole story. By using views, you can obtain other objects that implement the Collection or Map interfaces. You saw one example of this with the keySet method of the map classes. At first glance, it appears as if the method creates a new set, fills it with all the keys of the map, and returns it. However, that is not the case. Instead, the keySet method returns an object of a class that implements the Set interface and whose methods manipulate the original map. Such a collection is called a view."*

**Dịch:** Có thể bạn thấy **thừa thãi** khi có ngần ấy interface và abstract class chỉ để implement một số ít concrete collection class. Nhưng các hình đó **chưa kể hết câu chuyện**. Bằng cách dùng **view**, bạn lấy được **những object khác implement interface `Collection` hoặc `Map`**. Bạn đã thấy một ví dụ ở **method `keySet`** của các map class. Thoạt nhìn có vẻ như method này **tạo một set mới, đổ hết key vào rồi trả về** — **không phải vậy**. Thực tế, `keySet` trả về **object của một class implement interface `Set`**, và **các method của nó thao tác lên chính map gốc**. Một collection như vậy gọi là **view**.

> *"The technique of views has a number of useful applications in the Java Collections Framework. We will discuss these applications in the following sections."*

**Dịch:** Kỹ thuật view có **nhiều ứng dụng hữu ích** trong framework.

---

## 9.5.1. Small Collections

> *"There are static methods yielding a set or list with given elements, and a map with given key/value pairs. For example,"*

```java
List<String> names = List.of("Peter", "Paul", "Mary");
Set<Integer> numbers = Set.of(2, 3, 5);
```

> *"yield a list and a set with three elements."*

**Dịch:** Có các **static method** tạo ra **set hoặc list với element cho trước**, và **map với cặp key/value cho trước**.

> *"You can also provide an array of objects:"*

```java
String[] namesArray = { "Peter", "Paul", "Mary" };
List<String> names = List.of(namesArray); // A list containing three objects
```

**Dịch:** Bạn cũng **truyền vào được một array các object** (xem [[09 - Arrays]]).

> **Caution (sách):** *"if you provide an array of primitive type values, the result is a list with a single element, namely the array:"*
>
> ```java
> int[] numbersArray = { 2, 3, 5 };
> List<int[]> arrays = List.of(numbersArray);
> // A list containing a single object, an int[] array
> ```
>
> *"There is no convenience method for turning a primitive type array into a list of its wrapped elements."*
>
> **Dịch:** Nếu bạn truyền vào **một array giá trị kiểu primitive**, kết quả là **một list chỉ có đúng một element** — chính là **cái array đó**. **Không có method tiện lợi nào** để biến một array kiểu primitive thành list các element **đã được wrap** (xem [[04 - Object Wrappers and Autoboxing]]).

> *"For a map, you specify the keys and values, like this:"*

```java
Map<String, Integer> scores = Map.of("Peter", 2, "Paul", 3, "Mary", 5);
```

> *"The elements, keys, or values may not be null. Set and map keys may not be duplicated:"*

```java
numbers = Set.of(13, null);              // Error--null element
scores = Map.of("Peter", 4, "Peter", 2); // Error--duplicate key
```

**Dịch:** Element, key hay value **không được là `null`**. Key của set và map **không được trùng lặp**.

> **Caution (sách):** *"No guarantee is made about the iteration order of these sets and maps. In fact, the order is deliberately scrambled with a seed that is randomized at each virtual machine startup. Look at these two jshell runs:"*
>
> ```
> $ jshell -q
> jshell> Set.of("Peter", "Paul", "Mary")
> $1 ==> [Peter, Mary, Paul]
> jshell> /exit
> $ jshell -q
> jshell> Set.of("Peter", "Paul", "Mary")
> $1 ==> [Paul, Mary, Peter]
> ```
>
> *"Some Java programmers write programs whose correctness depends on the assumption that implementation details will never change. That can make it very difficult for the framework implementors to make useful implementation changes. In this case, the message is clear—don't write programs that assume anything about the element order."*
>
> **Dịch:** **Không có bảo đảm nào về thứ tự duyệt** của các set và map này. Thực tế, thứ tự bị **cố tình xáo trộn** bằng một **seed ngẫu nhiên hoá ở mỗi lần khởi động virtual machine**. Một số lập trình viên Java viết chương trình mà **tính đúng đắn phụ thuộc vào giả định rằng chi tiết implementation sẽ không bao giờ đổi** — điều đó khiến người implement framework **rất khó thực hiện những thay đổi hữu ích**. Thông điệp rất rõ: **đừng viết chương trình giả định bất cứ điều gì về thứ tự element**.

> *"The List and Set interfaces have eleven of methods with zero to ten arguments, and an of method with a variable number of arguments. The specializations are provided for efficiency."*

**Dịch:** Interface `List` và `Set` có **mười một method `of`** nhận **từ không tới mười argument**, cùng **một method `of` nhận số argument thay đổi**. Các bản chuyên biệt được cung cấp **vì hiệu năng**.

> *"For the Map interface, it is not possible to provide a version with variable arguments since the argument types alternate between the key and value types. There is a static method ofEntries that accepts an arbitrary number of Map.Entry<K, V> objects, which you can create with the static entry method. For example,"*

```java
import static java.util.Map.*;
. . .
Map<String, Integer> scores = ofEntries(
    entry("Peter", 2),
    entry("Paul", 3),
    entry("Mary", 5));
```

**Dịch:** Với interface `Map` thì **không thể cung cấp bản nhận số argument thay đổi**, vì **kiểu argument xen kẽ giữa kiểu key và kiểu value**. Thay vào đó có static method **`ofEntries`** nhận **số lượng object `Map.Entry<K, V>` tuỳ ý**, và bạn tạo chúng bằng static method **`entry`**.

> *"The of and ofEntries methods produce objects of classes that have an instance variable for each element, or that are backed by an array."*

**Dịch:** Method `of` và `ofEntries` tạo ra object của những class **có một instance variable cho mỗi element**, hoặc **được chống lưng bởi một array**.

> *"These collection objects are unmodifiable. Any attempt to change their contents results in an UnsupportedOperationException."*

**Dịch:** Các collection object này là **unmodifiable**. **Mọi nỗ lực thay đổi nội dung đều dẫn tới `UnsupportedOperationException`**.

> *"If you want a mutable collection, you can pass the unmodifiable collection to the constructor:"*

```java
var names = new ArrayList<>(List.of("Peter", "Paul", "Mary")); // A mutable list of names
```

**Dịch:** Muốn có collection **mutable**, bạn **truyền collection unmodifiable vào constructor**.

> *"The method call `Collections.nCopies(n, anObject)` returns an immutable object that implements the List interface and gives the illusion of having n elements, each of which appears as anObject. For example, the following call creates a List containing 100 strings, all set to "DEFAULT":"*

```java
List<String> settings = Collections.nCopies(100, "DEFAULT");
```

> *"There is very little storage cost—the object is stored only once."*

**Dịch:** Lời gọi `Collections.nCopies(n, anObject)` trả về một **object immutable implement `List`**, **tạo ảo giác rằng nó có n element**, mỗi element hiện ra là `anObject`. **Chi phí lưu trữ rất nhỏ — object chỉ được lưu một lần.**

> **Note (sách):** *"The Collections class contains a number of utility methods with parameters or return values that are collections. Do not confuse it with the Collection interface."*
>
> **Dịch:** Class **`Collections`** chứa **nhiều utility method** có parameter hoặc giá trị trả về là collection. **Đừng nhầm nó với interface `Collection`** (xem [[01 - The Java Collections Framework]]).

> **Tip (sách):** *"Java doesn't have a Pair class, and some programmers use a Map.Entry as a poor man's pair."*
>
> **Dịch:** Java **không có class `Pair`**, và một số lập trình viên **dùng `Map.Entry` như một "pair nhà nghèo"**.

---

## 9.5.2. Unmodifiable Copies and Views

> *"To make an unmodifiable copy of a collection, use the copyOf method of the collection type:"*

```java
ArrayList<String> names = . . .;
Set<String> nameSet = Set.copyOf(names);   // The names as an unmodifiable set
List<String> nameList = List.copyOf(names); // The names as an unmodifiable list
```

**Dịch:** Để tạo **bản sao unmodifiable** của một collection, dùng **method `copyOf` của kiểu collection đó**.

> *"As with the of methods, thecopyOf methods refuse to create collections containing null elements, instead throwing a NullPointerException."*

**Dịch:** Như các method `of`, method `copyOf` **từ chối tạo collection chứa element `null`** — thay vào đó **ném `NullPointerException`**.

> *"Each copyOf method makes a copy of the collection. If the original collection is modified, the copy is not affected."*

**Dịch:** Mỗi method `copyOf` **tạo một bản sao của collection**. Nếu collection gốc bị sửa, **bản sao không bị ảnh hưởng**.

> *"If the original collection happens to be unmodifiable and of the correct type, then copyOf simply returns it:"*

```java
Set<String> names = Set.of("Peter", "Paul", "Mary");
Set<String> nameSet = Set.copyOf(names); // No need to make a copy: names == nameSet
```

**Dịch:** Nếu collection gốc **vốn đã unmodifiable và đúng kiểu**, `copyOf` **trả về luôn chính nó**.

### Unmodifiable view

> *"The Collections class has methods that produce unmodifiable views of collections. These views add a runtime check to an existing collection. If an attempt to modify the unmodifiable collection is detected, an exception is thrown."*

**Dịch:** Class `Collections` có các method tạo ra **unmodifiable view** của collection. View này **thêm một phép kiểm tra lúc runtime** vào collection sẵn có. **Nếu phát hiện nỗ lực sửa đổi collection unmodifiable, một exception được ném ra.**

> *"However, if the original collection changes, the view reflects those changes. That is what makes views different from copies."*

**Dịch:** Tuy nhiên, **nếu collection gốc thay đổi thì view phản ánh những thay đổi đó**. Đó chính là **điểm khác nhau giữa view và bản sao (copy)**.

> *"You obtain unmodifiable views by eight methods:"*

```java
Collections.unmodifiableCollection
Collections.unmodifiableList
Collections.unmodifiableSet
Collections.unmodifiableSortedSet
Collections.unmodifiableNavigableSet
Collections.unmodifiableMap
Collections.unmodifiableSortedMap
Collections.unmodifiableNavigableMap
```

> *"Each method is defined to work on an interface. For example, Collections.unmodifiableList works with an ArrayList, a LinkedList, or any other class that implements the List interface."*

**Dịch:** **Mỗi method được định nghĩa để làm việc trên một interface.** Ví dụ `Collections.unmodifiableList` **dùng được với `ArrayList`, `LinkedList`, hoặc bất kỳ class nào implement `List`**.

> *"For example, suppose you want to let some part of your code look at, but not touch, the contents of a collection. Here is what you could do:"*

```java
var staff = new LinkedList<String>();
. . .
lookAt(Collections.unmodifiableList(staff));
```

**Dịch:** Giả sử bạn muốn cho **một phần code chỉ được nhìn chứ không được đụng** vào nội dung một collection.

> *"The Collections.unmodifiableList method returns an object of a class implementing the List interface. Its accessor methods retrieve values from the staff collection. Of course, the lookAt method can call all methods of the List interface, not just the accessors. But all mutator methods (such as add) have been redefined to throw an UnsupportedOperationException instead of forwarding the call to the underlying collection."*

**Dịch:** `Collections.unmodifiableList` trả về object của một class implement `List`. Các **accessor method** của nó **lấy value từ collection `staff`**. Dĩ nhiên method `lookAt` **gọi được mọi method của `List`**, không chỉ accessor. Nhưng **mọi mutator method (như `add`) đã được định nghĩa lại để ném `UnsupportedOperationException`** thay vì **chuyển tiếp lời gọi tới collection nền**.

> *"The unmodifiable view does not make the collection itself immutable. You can still modify the collection through its original reference (staff, in our case). And you can still call mutator methods on the elements of the collection."*

**Dịch:** Unmodifiable view **không làm cho bản thân collection trở nên immutable**. Bạn **vẫn sửa được collection qua reference gốc** (`staff`), và **vẫn gọi được mutator method lên các element của collection**.

> *"The views wrap the interface and not the actual collection object, so you only have access to those methods that are defined in the interface. For example, the LinkedList class has convenience methods, addFirst and addLast, that are not part of the List interface. These methods are not accessible through the unmodifiable view."*

**Dịch:** View **wrap interface chứ không phải object collection thật**, nên bạn **chỉ truy cập được những method định nghĩa trong interface**. Ví dụ, `LinkedList` có method tiện lợi **`addFirst` và `addLast` không thuộc interface `List`** — **những method này không truy cập được qua unmodifiable view**.

> **Caution (sách):** *"The unmodifiableCollection method (as well as the synchronizedCollection and checkedCollection methods discussed later in this section) returns a collection whose equals method does not invoke the equals method of the underlying collection. Instead, it inherits the equals method of the Object class, which just tests whether the objects are identical. If you turn a set or list into just a collection, you can no longer test for equal contents."*
>
> *"The view acts in this way because equality testing is not well defined at this level of the hierarchy. The views treat the hashCode method in the same way."*
>
> *"Prefer the unmodifiableSet and unmodifiableList wrappers whose equals and hashCode methods are appropriate for sets and lists."*
>
> *"For example:"*
>
> ```java
> var names = Set.of("Peter", "Paul", "Mary");
> Collections.unmodifiableCollection(names).equals(names) // false
> Collections.unmodifiableSet(names).equals(names)        // true
> ```
>
> **Dịch:** Method `unmodifiableCollection` (cũng như `synchronizedCollection` và `checkedCollection` bàn sau) trả về một collection mà **`equals` của nó KHÔNG gọi `equals` của collection nền**. Thay vào đó nó **kế thừa `equals` của class [[02 - Object The Cosmic Superclass|`Object`]]** — thứ **chỉ kiểm tra hai object có phải cùng một object hay không**. Nếu bạn biến một set hoặc list thành chỉ một collection, bạn **không còn kiểm tra được nội dung có bằng nhau hay không**. View hành xử như vậy vì **phép so bằng không được định nghĩa rõ ở mức này của hệ phân cấp**. **`hashCode` cũng được xử lý y hệt.** Nên **ưu tiên wrapper `unmodifiableSet` và `unmodifiableList`** — `equals` và `hashCode` của chúng **phù hợp với set và list**.

---

## 9.5.3. Subranges

> *"You can form subrange views for a number of collections. For example, suppose you have a list staff and want to extract elements 10 to 19. Use the subList method to obtain a view into the subrange of the list:"*

```java
List<Employee> group2 = staff.subList(10, 20);
```

> *"The first index is inclusive, the second exclusive—just like the parameters for the substring operation of the String class."*

**Dịch:** Bạn tạo được **subrange view** cho nhiều collection. Ví dụ, có list `staff` và muốn **rút ra element 10 tới 19** thì dùng **`subList`**. **Index thứ nhất là bao gồm, index thứ hai là loại trừ** — y như parameter của thao tác `substring` trong class [[05 - Strings|`String`]].

> *"You can apply any operations to the subrange, and they automatically reflect the entire list. For example, you can erase the entire subrange:"*

```java
group2.clear(); // staff reduction
```

> *"The elements get automatically cleared from the staff list, and group2 becomes empty."*

**Dịch:** Bạn **áp dụng được mọi thao tác lên subrange**, và chúng **tự động phản ánh lên toàn bộ list**. Ví dụ, xoá sạch cả subrange thì các element **tự động bị xoá khỏi list `staff`**, và `group2` **thành rỗng**.

> *"For sorted sets and maps, you use the sort order, not the element position, to form subranges. The SortedSet interface declares three methods:"*

```java
SortedSet<E> subSet(E from, E to)
SortedSet<E> headSet(E to)
SortedSet<E> tailSet(E from)
```

> *"These return the subsets of all elements that are larger than or equal to from and strictly smaller than to. For sorted maps, the similar methods"*

```java
SortedMap<K, V> subMap(K from, K to)
SortedMap<K, V> headMap(K to)
SortedMap<K, V> tailMap(K from)
```

> *"return views into the maps consisting of all entries in which the keys fall into the specified ranges."*

**Dịch:** Với **sorted set và sorted map**, bạn dùng **thứ tự sắp xếp chứ không phải vị trí element** để tạo subrange. Các method của `SortedSet` trả về **subset gồm mọi element lớn hơn hoặc bằng `from` và nhỏ hơn hẳn `to`**. Với sorted map, các method tương tự trả về **view gồm mọi entry có key nằm trong khoảng chỉ định**.

> *"The NavigableSet interface gives more control over these subrange operations. You can specify whether the bounds are included:"*

```java
NavigableSet<E> subSet(E from, boolean fromInclusive, E to, boolean toInclusive)
NavigableSet<E> headSet(E to, boolean toInclusive)
NavigableSet<E> tailSet(E from, boolean fromInclusive)
```

**Dịch:** Interface **`NavigableSet`** cho **kiểm soát nhiều hơn** với các thao tác subrange: bạn **chỉ định được biên có được bao gồm hay không**.

---

## 9.5.4. Sets From Boolean-Valued Maps

> *"Sometimes, an API provides maps with useful features that you would like in a set. In Section 9.4.5, you saw how you can use a LinkedHashMap to build a cache that discards older elements. The LinkedHashSet class does not have this capability."*

**Dịch:** Đôi khi một API cung cấp **map có tính năng hữu ích mà bạn muốn có ở một set**. Ở [[04 - Maps|Section 9.4.5]] bạn đã thấy cách dùng `LinkedHashMap` để dựng **cache loại bỏ element cũ hơn**. **Class `LinkedHashSet` không có khả năng này.**

> *"If you want to have a set of the 100 least recently inserted strings, make a LinkedHashMap<String, Boolean>, and then call the Collections.newSetFromMap method:"*

```java
Set<String> cache = Collections.newSetFromMap(new LinkedHashMap<String, Boolean>()
    {
        protected boolean removeEldestEntry(Map.Entry<String, Boolean> eldest)
        {
            return size() > 100;
        }
    });
```

**Dịch:** Muốn có một set gồm **100 chuỗi được chèn gần đây nhất**, hãy tạo một `LinkedHashMap<String, Boolean>` rồi gọi **`Collections.newSetFromMap`**.

> *"The set view is backed by the map. When you add an element e, the view puts an entry with key e and value Boolean.TRUE into the map. If that causes the map to have more than 100 entries, the oldest one is removed."*

**Dịch:** **Set view được chống lưng bởi map.** Khi bạn thêm element `e`, view **đặt vào map một entry có key là `e` và value là `Boolean.TRUE`**. Nếu điều đó khiến map **có hơn 100 entry**, **entry cũ nhất bị xoá**.

> *"You should call newSetFromMap with an empty map. Afterwards, do not modify the map, but let all modifications occur through methods of the set view. This is best achieved by passing the map to the newSetFromMap method without retaining a reference to it, as in the preceding example."*

**Dịch:** Bạn **nên gọi `newSetFromMap` với một map rỗng**. Sau đó **đừng sửa map nữa**, mà **để mọi thay đổi diễn ra qua method của set view**. Cách tốt nhất là **truyền map vào `newSetFromMap` mà không giữ lại reference tới nó**, như ví dụ trên.

> *"The newSetFromMap method is also useful with WeakHashMap (see Section 9.4.4). With a ConcurrentHashMap, use the newKeySet method instead (see Chapter 10)."*

**Dịch:** `newSetFromMap` cũng hữu ích với **`WeakHashMap`**. Với **`ConcurrentHashMap`**, dùng **`newKeySet`** thay thế (Chapter 10).

---

## 9.5.5. Reversed Views

> *"The reversed methods of the SequencedCollection and SequencedSet interfaces yield views that view the elements in reverse order. For example, here is how to traverse a list or tree set of strings in reverse:"*

```java
for (String element : collection.reversed())
{
    do something with element
}
```

> *"With SequencedMap, the reversed method views the map with the keys in reverse order."*

**Dịch:** Method **`reversed`** của interface **`SequencedCollection`** và **`SequencedSet`** tạo ra **view nhìn các element theo thứ tự ngược**. Với **`SequencedMap`**, `reversed` **nhìn map với key theo thứ tự ngược**.

---

## 9.5.6. Checked Views

> *"Checked views are intended as debugging support for a problem that can occur with generic types. As explained in Chapter 8, it is actually possible to smuggle elements of the wrong type into a generic collection. For example:"*

```java
var strings = new ArrayList<String>();
ArrayList rawList = strings; // warning only, not an error,
                             // for compatibility with legacy code
rawList.add(new Date());     // now strings contains a Date object!
```

**Dịch:** **Checked view** được thiết kế làm **công cụ hỗ trợ debug** cho một vấn đề có thể xảy ra với **generic type**. Như Chapter 8 giải thích, **thực sự có thể tuồn element sai kiểu vào một generic collection**.

> *"The erroneous add command is not detected at runtime. Instead, a class cast exception will happen later when another part of the code calls get and casts the result to a String."*

**Dịch:** Lệnh `add` sai lầm đó **không bị phát hiện lúc runtime**. Thay vào đó, một **class cast exception sẽ xảy ra muộn hơn**, khi **một phần code khác gọi `get` và cast kết quả sang `String`**.

> *"A checked view can detect this problem. Define a safe list as follows:"*

```java
List<String> safeStrings = Collections.checkedList(strings, String.class);
```

> *"The view's add method checks that the inserted object belongs to the given class and immediately throws a ClassCastException if it does not. The advantage is that the error is reported at the correct location:"*

```java
ArrayList rawList = safeStrings;
rawList.add(new Date()); // checked list throws a ClassCastException
```

**Dịch:** **Checked view phát hiện được vấn đề này.** Method `add` của view **kiểm tra object được chèn có thuộc class cho trước không**, và **ném ngay `ClassCastException` nếu không**. Lợi ích là **lỗi được báo đúng chỗ**.

> **Caution (sách):** *"The checked views are limited by the runtime checks that the virtual machine can carry out. For example, if you have an ArrayList<Pair\<String>>, you cannot protect it from inserting a Pair\<Date> since the virtual machine has a single "raw" Pair class."*
>
> **Dịch:** Checked view **bị giới hạn bởi những phép kiểm tra runtime mà virtual machine thực hiện được**. Ví dụ, với `ArrayList<Pair<String>>`, bạn **không bảo vệ được nó khỏi việc chèn vào một `Pair<Date>`**, vì virtual machine **chỉ có một class `Pair` "raw" duy nhất**.

---

## 9.5.7. Synchronized Views

> *"If you access a collection from multiple threads, you need to ensure that the collection is not accidentally damaged. For example, it would be disastrous if one thread tried to add to a hash table while another thread was rehashing the elements."*

**Dịch:** Nếu truy cập một collection **từ nhiều thread**, bạn phải bảo đảm collection **không bị hỏng do vô ý**. Ví dụ, sẽ là **thảm hoạ** nếu **một thread thêm vào hash table trong khi thread khác đang rehash các element**.

> *"Instead of implementing thread-safe collection classes, the framework designers used the view mechanism to make regular collections thread-safe. For example, the static synchronizedMap method in the Collections class can turn any map into a Map with synchronized access methods:"*

```java
var map = Collections.synchronizedMap(new HashMap<String, Employee>());
```

**Dịch:** Thay vì implement các collection class thread-safe, người thiết kế framework **dùng cơ chế view để làm collection thường trở nên thread-safe**. Ví dụ, static method **`synchronizedMap`** trong class `Collections` **biến map bất kỳ thành một `Map` có access method được `synchronized`**.

> *"You can now access the map object from multiple threads. The methods such as get and put are synchronized—each method call must be finished completely before another thread can call another method. We discuss the issue of synchronized access to data structures in greater detail in Chapter 10."*

**Dịch:** Giờ bạn **truy cập được object map từ nhiều thread**. Các method như `get` và `put` **được `synchronized`** — **mỗi lời gọi method phải kết thúc hoàn toàn trước khi thread khác gọi được method khác**.

---

## 9.5.8. A Note on Optional Operations

> *"A view usually has some restriction—it may be read-only, it may not be able to change the size, or it may support removal but not insertion (as is the case for the key view of a map). A restricted view throws an UnsupportedOperationException if you attempt an inappropriate operation."*

**Dịch:** Một view thường **có ràng buộc nào đó**: có thể **chỉ đọc**, có thể **không đổi được kích thước**, hoặc **hỗ trợ xoá nhưng không hỗ trợ chèn** (như key view của một map). View bị ràng buộc sẽ **ném `UnsupportedOperationException`** nếu bạn **thử một thao tác không phù hợp**.

> *"In the API documentation for the collection and iterator interfaces, many methods are described as "optional operations." This seems to be in conflict with the notion of an interface. After all, isn't the purpose of an interface to lay out the methods that a class must implement? Indeed, this arrangement is unsatisfactory from a theoretical perspective. A better solution might have been to design separate interfaces for read-only views and views that can't change the size of a collection. However, that would have tripled the number of interfaces, which the designers of the framework found unacceptable."*

**Dịch:** Trong tài liệu API của các interface collection và iterator, **nhiều method được mô tả là "optional operation"**. Điều này **có vẻ mâu thuẫn với khái niệm interface** — chẳng phải mục đích của [[01 - Interfaces|interface]] là **quy định những method mà class phải implement** sao? Quả thật, sắp xếp này **không thoả đáng về mặt lý thuyết**. Giải pháp tốt hơn có lẽ là **thiết kế các interface riêng cho view chỉ đọc và view không đổi được kích thước**. Nhưng điều đó **làm số interface tăng gấp ba**, và người thiết kế framework **thấy như vậy không chấp nhận được**.

> *"Should you extend the technique of "optional" methods to your own designs? I think not. Even though collections are used frequently, the coding style for implementing them is not typical for other problem domains. The designers of a collection class library have to resolve a particularly brutal set of conflicting requirements. Users want the library to be easy to learn, convenient to use, completely generic, idiot-proof, and at the same time as efficient as hand-coded algorithms. It is plainly impossible to achieve all these goals simultaneously, or even to come close. But in your own programming problems, you will rarely encounter such an extreme set of constraints. You should be able to find solutions that do not rely on the drastic measure of "optional" interface operations."*

**Dịch:** Bạn có nên **mang kỹ thuật method "optional" vào thiết kế của mình** không? Tác giả nói **không**. Dù collection được dùng thường xuyên, **phong cách code để implement chúng không điển hình cho các lĩnh vực bài toán khác**. Người thiết kế một thư viện collection phải **giải quyết một tập yêu cầu mâu thuẫn đặc biệt tàn bạo**: người dùng muốn library **dễ học, tiện dùng, hoàn toàn generic, chống ngốc**, đồng thời **hiệu quả ngang thuật toán viết tay**. **Rõ ràng không thể đạt hết cùng lúc**, thậm chí không thể tiệm cận. Nhưng trong bài toán lập trình của riêng bạn, bạn **hiếm khi gặp một tập ràng buộc cực đoan như vậy**, nên **tìm được giải pháp không cần tới biện pháp quyết liệt là "optional" interface operation**.

---

## API — `java.util.List` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E> List<E> of()` … `of(E e1, ... E e10)` / `static <E> List<E> of(E... elements)` **(9)** | tạo ra một **list unmodifiable** chứa các element cho trước — **không được là `null`**. |
| `static <E> List<E> copyOf(Collection<? extends E> coll)` **(10)** | tạo ra **bản sao unmodifiable** của collection cho trước. |

## API — `java.util.Set` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E> Set<E> of()` … `of(E e1, ... E e10)` / `static <E> Set<E> of(E... elements)` **(9)** | tạo ra một **set unmodifiable** chứa các element cho trước — **không được là `null`**. |
| `static <E> Set<E> copyOf(Collection<? extends E> coll)` **(10)** | tạo ra **bản sao unmodifiable** của collection cho trước. |

## API — `java.util.Map` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <K, V> Map<K, V> of()` … `of(K k1, V v1, ... K k10, V v10)` **(9)** | tạo ra một **map unmodifiable** gồm các key và value cho trước — **không được là `null`**. |
| `static <K,V> Map.Entry<K,V> entry(K k, V v)` **(9)** | tạo ra một **map entry unmodifiable** từ key và value cho trước — **không được là `null`**. |
| `static <K,V> Map<K,V> ofEntries(Map.Entry<? extends K,? extends V>... entries)` **(9)** | tạo ra một **map unmodifiable** gồm các entry cho trước. |
| `static <K, V> Map<K,V> copyOf(Map<? extends K,? extends V> map)` **(10)** | tạo ra **bản sao unmodifiable** của map cho trước. |

## API — `java.util.Collections` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E> Set<E> newSetFromMap(Map<E, Boolean> map)` **(6)** | tạo ra một **set được chống lưng bởi map cho trước** — map này **nên rỗng lúc đầu** và **sau đó chỉ được truy cập qua view trả về**. |
| `unmodifiableCollection(Collection<E> c)` · `unmodifiableSequencedCollection(SequencedCollection<E> c)` **(21)** · `unmodifiableList(List<E> c)` · `unmodifiableSet(Set<E> c)` · `unmodifiableSequencedSet(SequencedCollection<E> c)` **(21)** · `unmodifiableSortedSet(SortedSet<E> c)` · `unmodifiableNavigableSet(NavigableSet<E> c)` **(8)** · `unmodifiableMap(Map<K, V> c)` · `unmodifiableSortedMap(SortedMap<K, V> c)` · `unmodifiableSequencedMap(SequencedMap<K, V> c)` **(21)** · `unmodifiableNavigableMap(NavigableMap<K, V> c)` **(8)** | dựng một **view của collection**; các **mutator method của view ném `UnsupportedOperationException`**. |
| `synchronizedCollection(Collection<E> c)` · `synchronizedList(List<E> c)` · `synchronizedSet(Set<E> c)` · `synchronizedSortedSet(SortedSet<E> c)` · `synchronizedNavigableSet(NavigableSet<E> c)` **(8)** · `synchronizedMap(Map<K, V> c)` · `synchronizedSortedMap(SortedMap<K, V> c)` · `synchronizedNavigableMap(NavigableMap<K, V> c)` **(8)** | dựng một **view của collection**; các **method của view được `synchronized`**. |
| `checkedCollection(Collection<E> c, Class<E> elementType)` · `checkedList` · `checkedSet` · `checkedSortedSet` · `checkedNavigableSet` **(8)** · `checkedMap(Map<K, V> c, Class<K> keyType, Class<V> valueType)` · `checkedSortedMap` · `checkedNavigableMap` **(8)** · `checkedQueue(Queue<E> queue, Class<E> elementType)` **(8)** | dựng một **view của collection**; các method của view **ném `ClassCastException` nếu một element sai kiểu bị chèn vào**. |
| `static <E> List<E> nCopies(int n, E value)` | tạo ra một **list unmodifiable với n giá trị giống hệt nhau**. |
| `singletonList(E value)` · `singleton(E value)` · `emptyList()` · `emptySet()` · `emptySortedSet()` · `emptyNavigableSet()` · `emptyMap()` · `emptySortedMap()` · `emptyNavigableMap()` · `emptyEnumeration()` · `emptyIterator()` · `emptyListIterator()` | tạo ra một **collection, map, hoặc iterator rỗng**. |

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E> List<E> asList(E... array)` | trả về một **list view các element trong một array** — **sửa được nhưng không đổi được kích thước**. |

## API — `java.util.List<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `List<E> subList(int firstIncluded, int firstExcluded)` | trả về một **list view các element trong một khoảng vị trí**. |

## API — `java.util.SortedSet<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `SortedSet<E> subSet(E firstIncluded, E firstExcluded)` / `headSet(E firstExcluded)` / `tailSet(E firstIncluded)` | trả về một **view các element trong một khoảng**. |

## API — `java.util.NavigableSet<E>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `NavigableSet<E> subSet(E from, boolean fromIncluded, E to, boolean toIncluded)` / `headSet(E to, boolean toIncluded)` / `tailSet(E from, boolean fromIncluded)` | trả về một view các element trong một khoảng. Các **cờ boolean quyết định biên có được bao gồm trong view hay không**. |

## API — `java.util.SortedMap<K, V>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `SortedMap<K, V> subMap(K firstIncluded, K firstExcluded)` / `headMap(K firstExcluded)` / `tailMap(K firstIncluded)` | trả về một **map view các entry có key nằm trong một khoảng**. |

## API — `java.util.NavigableMap<K, V>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `NavigableMap<K, V> subMap(K from, boolean fromIncluded, K to, boolean toIncluded)` / `headMap(K from, boolean fromIncluded)` / `tailMap(K to, boolean toIncluded)` | trả về một map view các entry có key nằm trong một khoảng. Các **cờ boolean quyết định biên có được bao gồm hay không**. |

## API — `java.util.SequencedCollection<E>` / `SequencedSet<E>` / `SequencedMap<E>` (Java 21)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `SequencedCollection<E> reversed()` | tạo ra **view của sequenced collection này với element theo thứ tự ngược**. |
| `SequencedSet<E> reversed()` | tạo ra **view của sequenced set này với element theo thứ tự ngược**. |
| `SequencedMap<E> reversed()` | tạo ra **view của sequenced map này với key theo thứ tự ngược**. |

---

## Bài kế tiếp

→ [[06 - Algorithms]] — các generic algorithm của framework: sắp xếp, xáo trộn, tìm kiếm nhị phân, các thao tác tập hợp lớn và chuyển đổi giữa collection với array.
