# 02 — Interfaces in the Collections Framework

> Chapter 9, Section 9.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.2. Interfaces in the Collections Framework

> *"The Java Collections Framework defines a number of interfaces for different types of collections. These are shown in Figure 9.4, except for interfaces for concurrent programming, which are covered in Chapter 10."*

**Dịch:** Java Collections Framework định nghĩa **một loạt interface cho các kiểu collection khác nhau**. Chúng được thể hiện trong Figure 9.4, **trừ các interface cho concurrent programming** — phần đó nằm ở Chapter 10.

### Hai interface nền tảng: `Collection` và `Map`

> *"There are two fundamental interfaces for collections: Collection and Map. As you already saw, you insert elements into a collection with a method"*

```java
boolean add(E element)
```

> *"However, maps hold key/value pairs, and you use the put method to insert them:"*

```java
V put(K key, V value)
```

> *"To read elements from a collection, visit them with an iterator. However, you can read values from a map with the get method:"*

```java
V get(Object key)
```

**Dịch:** Có **hai interface nền tảng** cho collection: **`Collection`** và **`Map`**. Với collection, bạn **chèn element bằng `add`**; còn **map giữ cặp key/value**, và bạn **chèn bằng `put`**. Để đọc element từ collection thì **duyệt bằng iterator**; còn với map thì **đọc value bằng `get`**.

```
   Collection  ─ add(E)        ─ đọc: iterator
   Map         ─ put(K, V)     ─ đọc: get(key)
```

---

### `List` — ordered collection

> *"A List is an ordered collection. Elements are added into a particular position in the container. An element can be accessed in two ways: by an iterator or by an integer index. The latter is called random access because elements can be visited in any order. In contrast, when using an iterator, one must visit them sequentially."*

**Dịch:** **`List` là một ordered collection.** Element được thêm vào **một vị trí cụ thể** trong container. Truy cập element theo **hai cách**: bằng **iterator**, hoặc bằng **integer index**. Cách sau gọi là **random access**, vì element **duyệt được theo thứ tự bất kỳ**. Ngược lại, khi dùng iterator thì **phải duyệt tuần tự**.

> *"The List interface defines several methods for random access:"*

```java
void add(int index, E element)
E remove(int index)
E get(int index)
E set(int index, E element)
```

**Dịch:** Interface `List` định nghĩa **vài method cho random access**.

> **Caution (sách):** *"With a List<Integer, there are two remove methods:"*
>
> ```java
> boolean remove(int index) // Removes the element with the given index
> boolean remove(Integer o) // Removes the element equal to o
> ```
>
> *"When calling remove with a parameter of type int, the first method is chosen. No boxing is considered, and there is no warning. This may not be what you want:"*
>
> ```java
> List<Integer> ids = . . .;
> int id = . . .;
> if (id == 0) ids.remove(id); // Removes index 0, not the element with value 0
> ```
>
> **Dịch:** Với một `List<Integer>` có **hai method `remove`**: một nhận **index**, một nhận **`Integer` o**. Khi gọi `remove` với parameter kiểu **`int`**, **method thứ nhất được chọn** — **không xét tới boxing** (xem [[04 - Object Wrappers and Autoboxing]]) và **không có warning nào**. Đây có thể **không phải điều bạn muốn**: `ids.remove(id)` **xoá index 0**, chứ không xoá element có giá trị 0.

> **Note (sách):** *"The API documentation for the List interface defines the behavior of the equals method for lists. For a list to be equal to another object, the other object must also be a list of some kind. Both lists must have the same size. When iterating over each list, corresponding elements must be equal."*
>
> **Dịch:** Tài liệu API của interface `List` định nghĩa **hành vi của `equals` cho list**: để một list **bằng** một object khác thì object kia **cũng phải là một list nào đó**, **cùng size**, và khi duyệt song song hai list thì **các element tương ứng phải bằng nhau**.

### Vấn đề của interface `List`

> *"Frankly, there is a problem with the List interface in the Java Collections Framework. There are two kinds of ordered collections, with very different performance tradeoffs. An ordered collection that is backed by an array has fast random access, and it makes sense to use the List methods with an integer index. In contrast, a linked list, while also ordered, has slow random access, and it is best traversed sequentially with an iterator. It would have been better to provide two interfaces."*

**Dịch:** Thẳng thắn mà nói, **interface `List` có vấn đề**. Có **hai loại ordered collection** với **đánh đổi hiệu năng rất khác nhau**. Ordered collection **dựa trên array** thì **random access nhanh**, dùng method `List` với integer index là hợp lý. Ngược lại, **linked list** tuy cũng ordered nhưng **random access chậm**, và **tốt nhất là duyệt tuần tự bằng iterator**. **Lẽ ra nên có hai interface** thì hơn.

> **Note (sách):** *"To avoid carrying out random access operations for linked lists, Java 1.4 introduced a tagging interface, RandomAccess. That interface has no methods, but you can use it to test whether a particular collection supports efficient random access:"*
>
> ```java
> if (c instanceof RandomAccess)
> {
>     random traversal
> }
> else
> {
>     sequential traversal
> }
> ```
>
> **Dịch:** Để tránh thực hiện thao tác random access trên linked list, **Java 1.4** giới thiệu một **tagging interface** tên **`RandomAccess`**. Interface này **không có method nào**, nhưng bạn dùng nó để **kiểm tra xem một collection có hỗ trợ random access hiệu quả hay không**.

---

### `Set`

> *"The Set interface has the same instance methods as the Collection interface, but the behavior of the methods is more tightly defined. The add method of a set should reject duplicates. The equals method of a set should be defined so that two sets are identical if they have the same elements, but not necessarily in the same order. The hashCode method should be defined so that two sets with the same elements yield the same hash code."*

**Dịch:** Interface **`Set` có cùng bộ instance method với `Collection`**, nhưng **hành vi của method được định nghĩa chặt hơn**. `add` của set **phải từ chối phần tử trùng**. `equals` của set phải được định nghĩa sao cho **hai set là như nhau nếu có cùng các element, không nhất thiết cùng thứ tự**. `hashCode` phải được định nghĩa sao cho **hai set có cùng element cho ra cùng hash code**.

> *"Why make a separate interface if the method signatures are the same? Conceptually, not all collections are sets. Making a Set interface enables programmers to write methods that accept only sets."*

**Dịch:** Sao lại tách ra một interface riêng nếu signature method giống hệt? Về mặt khái niệm, **không phải collection nào cũng là set**. Có interface `Set` cho phép lập trình viên **viết method chỉ nhận set**.

> *"To see why this distinction matters, consider equality testing. Two lists are equal if they have the same elements in the same order. Two sets are equal if they have the same elements in some order. The equals method for a class implementing the Set interface needs to ensure that the argument is also a Set and not just any Collection."*

**Dịch:** Để thấy vì sao sự phân biệt này quan trọng, hãy xét **phép kiểm tra bằng nhau**. **Hai list bằng nhau nếu có cùng element theo cùng thứ tự.** **Hai set bằng nhau nếu có cùng element theo một thứ tự nào đó.** Method `equals` của class implement `Set` phải **đảm bảo argument cũng là một `Set`**, chứ không phải một `Collection` bất kỳ.

---

### `SortedSet`, `SortedMap`, `NavigableSet`, `NavigableMap`

> *"The SortedSet and SortedMap interfaces expose the comparator object used for sorting, and they define methods to obtain views of subsets of the collections. We discuss these in Section 9.5.3."*

**Dịch:** **`SortedSet` và `SortedMap`** phơi ra **object comparator dùng để sắp xếp**, và định nghĩa method để **lấy view của các tập con** của collection. (Xem [[05 - Copies and Views]].)

> *"The interfaces NavigableSet and NavigableMap contain additional methods for finding the next or previous element in sorted sets and maps. The TreeSet and TreeMap classes implement these interfaces. The navigation operations can be efficiently implemented in tree-based data structures."*

**Dịch:** **`NavigableSet` và `NavigableMap`** chứa **các method bổ sung để tìm element kế tiếp hoặc trước đó** trong sorted set và sorted map. **`TreeSet` và `TreeMap` implement các interface này.** Các thao tác điều hướng **implement hiệu quả được trên cấu trúc dữ liệu dạng cây**.

---

### `SequencedCollection` (Java 21)

> *"Java 21 introduces the SequencedCollection<E> interface that provides uniform access to the first and last element of a collection and reverse traversal."*

```java
E getFirst()
E getLast()
void addFirst(E e)
void addLast(E e)
E removeFirst()
E removeLast()
SequencedCollection<E> reversed()
```

**Dịch:** **Java 21** giới thiệu interface **`SequencedCollection<E>`**, cung cấp **cách truy cập thống nhất tới element đầu và cuối** của một collection, cùng **duyệt ngược**.

> *"Previously, these operations were carried out by different methods in lists, sets, and deques. The SequencedSet subinterface sharpens the return type of the reversed method to SequencedSet. The SequencedMap interface has analogous methods for maps."*

**Dịch:** Trước đây, các thao tác này được thực hiện bằng **những method khác nhau ở list, set và deque**. Subinterface **`SequencedSet`** **thu hẹp kiểu trả về** của `reversed` thành `SequencedSet`. Interface **`SequencedMap`** có **các method tương tự cho map**.

---

## Quan hệ giữa các interface (dựng lại từ phần chữ)

> Figure 9.4 là ảnh, bản trích text không có. Sơ đồ dưới đây **chỉ gồm những quan hệ được nêu thành lời trong sách** (Section 9.1.3, 9.2 và 9.3.5).

```
        Iterable
           │  (Collection extends Iterable — §9.1.3)
       Collection                              Map
        │      │                                │
      List    Set                            SortedMap
                │                                │
            SortedSet                      NavigableMap
                │
          NavigableSet

  SequencedCollection (21)  ──► List, Set cũng extend (§9.3.5)
        └── SequencedSet (21) — thu hẹp kiểu trả về của reversed()
  SequencedMap (21) — các method tương tự cho map
```

---

## Bài kế tiếp

→ [[03 - Concrete Collections]] — bảng các concrete collection, linked list, array list, hash set, tree set, queue/deque và priority queue.
