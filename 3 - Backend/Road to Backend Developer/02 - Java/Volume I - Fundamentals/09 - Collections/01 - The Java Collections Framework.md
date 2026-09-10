# 01 — The Java Collections Framework

> Chapter 9, Section 9.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 9

> *"The data structures that you choose can make a big difference when you try to implement methods in a natural style or are concerned with performance. Do you need to search quickly through thousands (or even millions) of sorted items? Do you need to rapidly insert and remove elements in the middle of an ordered sequence? Do you need to establish associations between keys and values?"*

**Dịch:** **Data structure bạn chọn tạo ra khác biệt rất lớn** khi bạn muốn implement method theo phong cách tự nhiên, hoặc khi bạn quan tâm tới performance. Bạn có cần **tìm nhanh trong hàng nghìn (thậm chí hàng triệu) mục đã sắp xếp**? Có cần **chèn và xoá element nhanh ở giữa một dãy có thứ tự**? Có cần **thiết lập liên kết giữa key và value**?

> *"This chapter shows how the Java Collections Framework can help you accomplish the traditional data structuring needed for serious programming. In college computer science programs, a course called Data Structures usually takes a semester to complete, and there are many, many books devoted to this important topic. Our coverage differs from that of a college course; we will skip the theory and just look at how to use the collection classes in the Java API."*

**Dịch:** Chương này chỉ cách **Java Collections Framework** giúp bạn làm được những việc cấu trúc dữ liệu truyền thống cần cho lập trình nghiêm túc. Ở đại học, môn Data Structures thường mất cả học kỳ, và có rất nhiều sách viết về chủ đề quan trọng này. Cách trình bày ở đây khác với một khoá học đại học: **bỏ qua phần lý thuyết**, chỉ nhìn vào **cách dùng collection class trong Java API**.

---

## 9.1. The Java Collections Framework

> *"The initial release of Java supplied only a small set of classes for the most useful data structures: Vector, Stack, Hashtable, BitSet, and the Enumeration interface that provides an abstract mechanism for visiting elements in an arbitrary container. That was certainly a wise choice—it takes time and skill to come up with a comprehensive collection class library."*

**Dịch:** Bản Java đầu tiên chỉ cung cấp **một nhóm nhỏ class** cho các data structure hữu ích nhất: `Vector`, `Stack`, `Hashtable`, `BitSet`, và interface `Enumeration` — thứ cung cấp **cơ chế trừu tượng để duyệt qua element trong một container bất kỳ**. Đó chắc chắn là lựa chọn khôn ngoan: **cần thời gian và tay nghề** mới ra được một thư viện collection class toàn diện.

> *"With the advent of Java 1.2, the designers felt that the time had come to roll out a full-fledged framework for data structures. They faced a number of conflicting design challenges. They wanted the library to be small and easy to learn. They did not want the complexity of the Standard Template Library (or STL) of C++, but they wanted the benefit of "generic algorithms" that STL pioneered. They wanted the legacy classes to fit into the new framework. As all designers of collections libraries do, they had to make some hard choices, and they came up with a number of idiosyncratic design decisions along the way."*

**Dịch:** Tới **Java 1.2**, các nhà thiết kế thấy đã đến lúc tung ra một **framework đầy đủ** cho data structure. Họ đối mặt với **nhiều thách thức thiết kế mâu thuẫn nhau**: muốn library **nhỏ gọn và dễ học**; **không muốn độ phức tạp** của **Standard Template Library (STL)** của C++, nhưng lại muốn hưởng lợi từ **"generic algorithm"** mà STL đi tiên phong; muốn các **legacy class** vừa khít vào framework mới. Như mọi người thiết kế thư viện collection, họ phải **chọn lựa khó khăn** và trên đường đi đưa ra **một số quyết định thiết kế kỳ quặc**.

---

## 9.1.1. Separating Collection Interfaces and Implementation

> *"As is common with modern data structure libraries, the Java Collections Framework separates interfaces and implementations. Let us look at that separation with a familiar data structure, the queue."*

**Dịch:** Như thường thấy ở các thư viện data structure hiện đại, Java Collections Framework **tách interface khỏi implementation**. Hãy nhìn sự tách bạch đó qua một data structure quen thuộc: **queue**.

> *"A queue interface specifies that you can add elements at the tail end of the queue, remove them at the head, and find out how many elements are in the queue. You use a queue when you need to collect objects and retrieve them in a "first in, first out" fashion (see Figure 9.1)."*

**Dịch:** Một queue interface quy định rằng bạn có thể **thêm element ở đuôi**, **xoá ở đầu**, và **biết được queue đang có bao nhiêu element**. Bạn dùng queue khi cần thu thập object rồi lấy lại theo kiểu **"first in, first out"**.

**Figure 9.1: A queue**

```
   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
   │  ❶  │   │  ❷  │   │  ❸  │   │  ❹  │
   └─────┘   └─────┘   └─────┘   └─────┘
      ▲                              ▲
      │                              │
    first                          last
```

> *"A minimal form of a queue interface might look like this:"*

```java
public interface Queue<E> // a simplified form of the interface in the Java API
{
    void add(E e);
    E remove();
    int size();
}
```

> *"The interface tells you nothing about how the queue is implemented. Of the two common implementations of a queue, one uses a "circular array" and one uses a linked list (see Figure 9.2)."*

**Dịch:** Interface **không nói gì về việc queue được implement thế nào**. Trong hai implementation phổ biến của queue, một cái dùng **"circular array"**, một cái dùng **linked list**.

**Figure 9.2: Queue implementations**

```
        ┌───────────┐
        │     ③     │
        ├───────────┤
        │     ②     │
        ├───────────┤
        │     ①     │◄────── first
        ├───────────┤
        │           │
        ├───────────┤
        │           │
        ├───────────┤
        │           │
        ├───────────┤
        │     ④     │◄────── last
        └───────────┘
         Circular Array


   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │   Node   │    │   Node   │    │   Node   │    │   Node   │
   ├──────────┤    ├──────────┤    ├──────────┤    ├──────────┤
   │ item  ①  │    │ item  ②  │    │ item  ③  │    │ item  ④  │
   ├──────────┤    ├──────────┤    ├──────────┤    ├──────────┤
   │ next  ●──┼───►│ next  ●──┼───►│ next  ●──┼───►│ next     │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
    Linked List                                          ▲
        ▲                                                │
      first                                            last
```

Cùng một `Queue` interface, hai cách chứa dữ liệu khác hẳn nhau bên trong.

> *"Each implementation can be expressed by a class that implements the Queue interface. In the Java API, these classes are called ArrayDeque and LinkedList."*

```java
public class ArrayDeque<E> implements Queue<E> // simplified from the Java API
{
    private int first;
    private int last;
    private E[] elements;

    public ArrayDeque(int numElements) { . . . }
    public void add(E e) { . . . }
    public E remove() { . . . }
    public int size() { . . . }
    . . .
}

public class LinkedList<E> implements Queue<E> // simplified from the Java API
{
    private Node<E> first;
    private Node<E> last;

    public LinkedList() { . . . }
    public void add(E e) { . . . }
    public E remove() { . . . }
    public int size() { . . . }
    . . .
}
```

**Dịch:** Mỗi implementation được diễn đạt bằng một class **implement interface `Queue`**. Trong Java API, hai class đó tên là **`ArrayDeque`** và **`LinkedList`**. (Xem lại khái niệm implement interface ở [[01 - Interfaces]].)

> *"When you use a queue in your program, you don't need to know which implementation is actually used once the collection has been constructed. Therefore, it makes sense to use the concrete class only when you construct the collection object. Use the interface type to hold the collection reference."*

```java
Queue<Customer> expressLane = new ArrayDeque<>(100);
expressLane.add(new Customer("Harry"));
```

**Dịch:** Khi dùng queue trong chương trình, **bạn không cần biết implementation nào đang được dùng** một khi collection đã được dựng xong. Vì vậy hợp lý nhất là **chỉ dùng concrete class lúc dựng object**, còn **giữ reference bằng kiểu interface**.

> *"With this approach, if you change your mind, you can easily use a different implementation. You only need to change your program in one place—in the constructor call. If you decide that a linked list is a better choice after all, your code becomes"*

```java
Queue<Customer> expressLane = new LinkedList<>();
expressLane.add(new Customer("Harry"));
```

**Dịch:** Với cách này, nếu đổi ý, bạn **đổi implementation rất dễ**. Chỉ cần sửa chương trình **ở đúng một chỗ — lời gọi constructor**.

> *"There is another reason to stick with the interface. Both the ArrayDeque and LinkedList classes have methods that are unrelated to queueing. Accidentally using one of them will be reported as a compile-time error, since you can't invoke them on a variable of type Queue."*

**Dịch:** Còn một lý do nữa để bám vào interface. Cả `ArrayDeque` lẫn `LinkedList` đều có **method không liên quan tới việc queue**. Lỡ dùng nhầm một trong số đó sẽ **bị báo lỗi ngay lúc compile**, vì bạn không gọi được chúng trên một biến kiểu `Queue`.

> *"Why would you choose one implementation over another? The interface says nothing about the efficiency of an implementation. A circular array is more memory-efficient. However, the circular array has a finite capacity and needs to be reallocated whenever it fills up. In fact, measurements show that an ArrayDeque generally outperforms a LinkedList because it has less impact on the garbage collector. When the ArrayDeque appeared in Java 6, the programmers who made use of the Queue interface were able to swap out the LinkedList by changing a single line of code."*

**Dịch:** Vì sao chọn implementation này chứ không phải cái kia? **Interface không nói gì về hiệu năng.** Circular array **tiết kiệm memory hơn**. Nhưng circular array có **dung lượng hữu hạn** và phải **cấp phát lại mỗi khi đầy**. Thực tế, đo đạc cho thấy **`ArrayDeque` nhìn chung nhanh hơn `LinkedList`** vì nó **ít gây áp lực lên garbage collector hơn**. Khi `ArrayDeque` xuất hiện ở **Java 6**, các lập trình viên đã dùng interface `Queue` chỉ cần **đổi một dòng code** là thay được `LinkedList`.

---

## 9.1.2. The Collection Interface

> *"The fundamental interface for collection classes in the Java Collections Framework is the Collection interface. The interface has two fundamental methods:"*

```java
public interface Collection<E>
{
    boolean add(E element);
    Iterator<E> iterator();
    . . .
}
```

**Dịch:** Interface **nền tảng** cho các collection class trong Java Collections Framework là **`Collection`**. Interface này có **hai method cốt lõi**.

> *"There are several methods in addition to these two; we will discuss them later."*

> *"The add method adds an element to the collection. The add method returns true if adding the element actually changes the collection, and false if the collection is unchanged. For example, if you try to add an object to a set and the object is already present, the add request has no effect because sets reject duplicates."*

**Dịch:** Method **`add`** thêm một element vào collection. Nó trả về **`true` nếu việc thêm thực sự làm collection thay đổi**, và **`false` nếu collection không đổi**. Ví dụ, nếu bạn thêm một object vào một **set** mà object đó **đã có sẵn**, thì lời gọi `add` **không có tác dụng gì**, vì **set từ chối phần tử trùng lặp**.

> *"The iterator method returns an object that implements the Iterator interface. With that object, you can visit the elements in the collection one by one. We discuss iterators in the next section."*

**Dịch:** Method **`iterator`** trả về một object implement interface **`Iterator`**. Với object đó, bạn **duyệt từng element một** trong collection.

---

## 9.1.3. Iterators

> *"The Iterator interface has four methods:"*

```java
public interface Iterator<E>
{
    boolean hasNext();
    E next();
    default void remove();
    default void forEachRemaining(Consumer<? super E> action);
}
```

**Dịch:** Interface `Iterator` có **bốn method**.

> *"By repeatedly calling the next method, you can visit the elements from the collection one by one. However, if you reach the end of the collection, the next method throws a NoSuchElementException. Therefore, you need to call the hasNext method before calling next. That method returns true if the iterator has not yet reached the end, and there is at least one more element to visit. If you want to inspect all elements in a collection, request an iterator and then keep calling the next method while hasNext returns true. For example:"*

```java
Collection<String> coll = . . .;
Iterator<String> iter = coll.iterator();
while (iter.hasNext())
{
    String element = iter.next();
    do something with element
}
```

**Dịch:** Gọi **`next`** liên tục thì duyệt được từng element. Nhưng nếu **chạm tới cuối collection**, `next` **ném `NoSuchElementException`**. Vì thế **phải gọi `hasNext` trước khi gọi `next`**. Method đó trả về `true` nếu iterator **chưa tới cuối** và **còn ít nhất một element** để duyệt.

> *"You can write such a loop more concisely as the "for each" loop:"*

```java
for (String element : coll)
{
    do something with element
}
```

> *"The compiler simply translates the "for each" loop into a loop with an iterator."*

**Dịch:** Vòng lặp trên viết gọn hơn được bằng **vòng "for each"**. Compiler đơn giản là **dịch vòng "for each" thành vòng lặp có iterator**.

> *"The "for each" loop works with any object that implements the Iterable interface, an interface with an abstract method:"*

```java
public interface Iterable<E>
{
    Iterator<E> iterator();
    . . .
}
```

> *"The Collection interface extends the Iterable interface. Therefore, you can use the "for each" loop with any collection in the Java Collections Framework."*

**Dịch:** Vòng "for each" hoạt động với **mọi object implement interface `Iterable`** — interface có một abstract method. Interface **`Collection` extends `Iterable`**, nên bạn **dùng được vòng "for each" với mọi collection** trong framework.

> *"Instead of writing a loop, you can call the Collection.forEach or Iterator.forEachRemaining methods with a lambda expression that consumes an element. The lambda expression is invoked on all elements of the collection, or the remaining elements that the iterator can visit."*

```java
coll.forEach(element -> do something with element);
iter.forEachRemaining(element -> do something with element);
```

**Dịch:** Thay vì viết vòng lặp, bạn gọi được **`Collection.forEach`** hoặc **`Iterator.forEachRemaining`** với một [[02 - Lambda Expressions|lambda expression]] tiêu thụ một element. Lambda đó được gọi trên **toàn bộ element của collection**, hoặc **những element còn lại** mà iterator duyệt tới được.

> *"The order in which the elements are visited depends on the collection type. If you iterate over an ArrayList, the iterator starts at index 0 and increments the index in each step. However, if you visit the elements in a HashSet, you will get them in an essentially random order. You can be assured that you will encounter all elements of the collection during the course of the iteration, but you cannot make any assumptions about their ordering. This is usually not a problem because the ordering does not matter for computations such as computing totals or counting matches."*

**Dịch:** **Thứ tự duyệt element phụ thuộc vào kiểu collection.** Duyệt [[03 - Generic Array Lists|`ArrayList`]] thì iterator bắt đầu ở **index 0** và tăng dần. Nhưng duyệt `HashSet` thì bạn nhận element theo **thứ tự về cơ bản là ngẫu nhiên**. Bạn **chắc chắn gặp đủ mọi element**, nhưng **không được giả định gì về thứ tự**. Điều này thường không thành vấn đề vì thứ tự không quan trọng với các phép tính như **cộng tổng** hay **đếm số lần khớp**.

> **Note (sách):** *"Old-timers will notice that the next and hasNext methods of the Iterator interface serve the same purpose as the nextElement and hasMoreElements methods of an Enumeration. The designers of the Java Collections Framework could have chosen to make use of the Enumeration interface. But they disliked the cumbersome method names and instead introduced a new interface with shorter method names."*
>
> **Dịch:** Dân kỳ cựu sẽ nhận ra `next` và `hasNext` của `Iterator` **phục vụ đúng mục đích** của `nextElement` và `hasMoreElements` của một `Enumeration`. Những người thiết kế framework **hoàn toàn có thể tận dụng interface `Enumeration`**, nhưng họ **không ưa cái tên method dài dòng** nên giới thiệu interface mới với **tên method ngắn hơn**. (Xem thêm [[07 - Legacy Collections]].)

### Iterator của Java nằm GIỮA các element

> *"There is an important conceptual difference between iterators in the Java collections library and iterators in other libraries. In traditional collections libraries, such as the Standard Template Library of C++, iterators are modeled after array indexes. Given such an iterator, you can look up the element that is stored at that position, much like you can look up an array element a[i] if you have an array index i. Independently of the lookup, you can advance the iterator to the next position. This is the same operation as advancing an array index by calling i++, without performing a lookup."*

**Dịch:** Có một **khác biệt khái niệm quan trọng** giữa iterator của Java và iterator ở các thư viện khác. Ở thư viện truyền thống như STL của C++, iterator được **mô phỏng theo array index**. Với iterator kiểu đó, bạn **tra được element đang nằm ở vị trí đó**, giống như tra `a[i]` khi có index `i`. **Độc lập với việc tra cứu**, bạn đẩy iterator sang vị trí kế tiếp — giống hệt việc tăng array index bằng `i++` **mà không tra cứu gì**.

> *"However, the Java iterators do not work like that. The lookup and position change are tightly coupled. The only way to look up an element is to call next, and that lookup advances the position."*

**Dịch:** **Iterator của Java không hoạt động như vậy.** Việc **tra cứu và đổi vị trí gắn chặt với nhau**. Cách duy nhất để tra một element là **gọi `next`**, và chính lời tra đó **đẩy vị trí đi tiếp**.

> *"Instead, think of Java iterators as being between elements. When you call next, the iterator jumps over the next element, and it returns a reference to the element that it just passed (see Figure 9.3)."*

**Dịch:** Thay vào đó, hãy nghĩ iterator của Java là **nằm giữa các element**. Khi gọi `next`, iterator **nhảy qua element kế tiếp** và **trả về reference tới chính element vừa nhảy qua**.

**Figure 9.3: Advancing an iterator**

```
                ┌────────────────┐
                │   next() nhảy  │
                │    qua element │
                ▼                ▼
        ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
        │     │ │     │ │     │ │     │ │     │
        │     │ │     │ │     │ │     │ │     │
        └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
                   ▲   ▲
                    ╲  │
                     ╲ │
        returned ─────╯ └───── iterator
        element
```

Iterator nằm **giữa** các element; sau `next()` nó đứng ở khe phía sau element vừa trả về.

> **Note (sách):** *"Here is another useful analogy. You can think of Iterator.next as the equivalent of InputStream.read. Reading a byte from a stream automatically "consumes" the byte. The next call to read consumes and returns the next byte from the input. Similarly, repeated calls to next let you read all elements in a collection."*
>
> **Dịch:** Một phép so sánh hữu ích khác: coi **`Iterator.next`** tương đương với **`InputStream.read`**. Đọc một byte từ stream sẽ **tự động "tiêu thụ" byte đó**. Lời gọi `read` kế tiếp tiêu thụ và trả về byte tiếp theo. Tương tự, **gọi `next` lặp đi lặp lại** cho bạn đọc hết mọi element trong collection.

### `remove` của Iterator

> *"The remove method of the Iterator interface removes the element that was returned by the last call to next. In many situations, that makes sense—you need to see the element before you can decide that it is the one that should be removed. But if you want to remove an element in a particular position, you still need to skip past the element. For example, here is how you remove the first element in a collection of strings:"*

```java
Iterator<String> iter = coll.iterator();
iter.next(); // skip over the first element
iter.remove(); // now remove it
```

**Dịch:** Method **`remove`** của `Iterator` xoá **element được trả về bởi lời gọi `next` gần nhất**. Trong nhiều tình huống điều đó hợp lý — bạn **cần nhìn thấy element** rồi mới quyết được có nên xoá nó không. Nhưng nếu muốn xoá element ở một vị trí cụ thể, bạn **vẫn phải nhảy qua nó trước**.

> *"More importantly, there is a dependency between the calls to the next and remove methods. It is illegal to call remove if it wasn't preceded by a call to next. If you try, an IllegalStateException is thrown."*

**Dịch:** Quan trọng hơn, **có sự phụ thuộc giữa `next` và `remove`**. Gọi `remove` mà **trước đó không gọi `next`** là **bất hợp lệ** — sẽ bị ném **`IllegalStateException`**.

> *"If you want to remove two adjacent elements, you cannot simply call"*

```java
iter.remove();
iter.remove(); // ERROR
```

> *"Instead, you must first call next to jump over the element to be removed."*

```java
iter.remove();
iter.next();
iter.remove(); // OK
```

**Dịch:** Muốn xoá **hai element liền kề**, bạn **không gọi `remove` hai lần liên tiếp được**. Thay vào đó phải **gọi `next` trước** để nhảy qua element sắp bị xoá.

---

## 9.1.4. Generic Utility Methods

> *"The Collection and Iterator interfaces are generic, which means you can write utility methods that operate on any kind of collection. For example, here is a generic method that tests whether an arbitrary collection contains a given element:"*

```java
public static <E> boolean contains(Collection<E> c, Object obj)
{
    for (E element : c)
        if (element.equals(obj))
            return true;
    return false;
}
```

**Dịch:** `Collection` và `Iterator` là **generic**, nghĩa là bạn viết được **utility method chạy trên mọi loại collection**.

> *"The designers of the Java Collections Framework decided that some of these utility methods are so useful that the framework should make them available. That way, API users don't have to keep reinventing the wheel. The contains method is one such method."*

**Dịch:** Những người thiết kế framework thấy một số utility method **hữu ích tới mức framework nên cung cấp sẵn**, để người dùng API **khỏi phải phát minh lại bánh xe**. `contains` là một method như vậy.

> *"In fact, the Collection<E> interface declares quite a few useful methods that all implementing classes must supply:"*

```java
int size()
boolean isEmpty()
boolean contains(Object obj)
boolean containsAll(Collection<?> c)
boolean add(E obj)
boolean addAll(Collection<? extends E> from)
boolean remove(Object obj)
boolean removeAll(Collection<?> c)
boolean retainAll(Collection<?> c)
void clear()
Object[] toArray()
T[] toArray(T[] a)
```

**Dịch:** Thực tế, interface `Collection<E>` khai báo **khá nhiều method hữu ích mà mọi class implement đều phải cung cấp**.

> **Note (sách):** *"The Collection interface declares the equals and hashCode methods that are inherited from Object. There is no technical need to include these declarations. It merely provides a good place for adding collection-specific API documentation. The Set and List subinterfaces mandate specific behavior for equals. Other collections can inherit Object.equals, or override it and compare the elements in some way. In the latter case, the hashCode method also needs to be overridden."*
>
> **Dịch:** Interface `Collection` khai báo `equals` và `hashCode` — vốn **thừa hưởng từ [[02 - Object The Cosmic Superclass|`Object`]]**. **Không có nhu cầu kỹ thuật nào** buộc phải khai báo lại; nó chỉ là **chỗ tốt để thêm tài liệu API riêng cho collection**. Các subinterface **`Set` và `List` bắt buộc hành vi cụ thể cho `equals`**. Các collection khác có thể **kế thừa `Object.equals`**, hoặc **override** nó và so sánh element theo cách nào đó — trong trường hợp sau thì **`hashCode` cũng phải được override**.

> **Caution (sách):** *"The Java Collections Framework was designed before generic types were added to Java. For backwards compatibility, the contains and remove methods have a parameter of type Object and not E. The containsAll, removeAll, and retainAll methods have a parameter of type Collection<?> and not Collection<? extends E>."*
>
> *"This means that type errors may not be detected at compile time. As an example, consider this code snippet where accidentally a String is removed from a collection of Path objects:"*
>
> ```java
> Collection<Path> paths = . . .;
> paths.remove("/tmp"); // Compiles, but can have no effect
> ```
>
> **Dịch:** Java Collections Framework được thiết kế **trước khi generic type được thêm vào Java**. Vì **tương thích ngược**, `contains` và `remove` nhận parameter kiểu **`Object` chứ không phải `E`**; `containsAll`, `removeAll`, `retainAll` nhận **`Collection<?>` chứ không phải `Collection<? extends E>`** (xem [[07 - Wildcard Types]]). Hệ quả: **lỗi kiểu có thể không bị phát hiện lúc compile**.

### AbstractCollection

> *"Of course, it is a bother if every class that implements the Collection interface has to supply so many routine methods. To make life easier for implementors, the framework supplies a class AbstractCollection that leaves the fundamental methods size and iterator abstract but implements the routine methods in terms of them. For example:"*

```java
public abstract class AbstractCollection<E>
    implements Collection<E>
{
    . . .
    public abstract Iterator<E> iterator();
    public abstract int size();

    public boolean isEmpty()
    {
        return size() == 0;
    }

    public boolean contains(Object obj)
    {
        Iterator<E> it = iterator();
        if (o == null)
        {
            while (it.hasNext()) if (it.next() == null) return true;
        }
        else
        {
            while (it.hasNext()) if (o.equals(it.next())) return true;
        }
        return false;
    }
    . . .
}
```

**Dịch:** Dĩ nhiên sẽ phiền nếu **mọi class implement `Collection` đều phải viết ngần ấy method thủ tục**. Để nhẹ việc cho người implement, framework cung cấp class **`AbstractCollection`**: để **`size` và `iterator` ở dạng abstract**, còn **implement các method thủ tục dựa trên hai method đó**.

> *"A concrete collection class can now extend the AbstractCollection class. It is up to the concrete collection class to supply iterator and size methods. Mutable collections also need an add method. The other methods have been taken care of by the AbstractCollection superclass. However, if the subclass has a more efficient way of implementing contains, it is free to do so."*

**Dịch:** Một concrete collection class giờ chỉ cần **extend `AbstractCollection`**, và **tự cung cấp `iterator` và `size`**. Collection **mutable** thì cần thêm **`add`**. Các method còn lại đã được **superclass `AbstractCollection` lo**. Tuy nhiên, nếu subclass có **cách implement `contains` hiệu quả hơn**, nó **cứ tự nhiên làm**.

> *"This approach is a bit outdated. It would be nicer if the methods were default methods of the Collection interface, but default methods didn't exist when the Java Collections Framework was designed. However, several default methods have been added. Three of them deal with streams (discussed in Volume II). See Section 9.6.6 for the toArray method. In addition, there is a useful method"*

```java
default boolean removeIf(Predicate<? super E> filter)
```

> *"for removing elements that fulfill a condition."*

**Dịch:** Cách tiếp cận này **hơi lỗi thời**. Sẽ đẹp hơn nếu các method đó là **default method của interface `Collection`**, nhưng **default method chưa tồn tại** khi framework được thiết kế. Dù vậy, **một số default method đã được bổ sung**: ba cái liên quan tới **stream** (bàn ở Volume II), `toArray` xem Section 9.6.6, và thêm một method hữu ích **`removeIf`** để **xoá các element thoả một điều kiện**.

---

## API — `java.util.Collection<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Iterator<E> iterator()` | trả về một iterator dùng để duyệt các element trong collection. |
| `int size()` | trả về số element hiện đang lưu trong collection. |
| `boolean isEmpty()` | trả về `true` nếu collection này không chứa element nào. |
| `boolean contains(Object obj)` | trả về `true` nếu collection này chứa một object bằng `obj`. |
| `boolean containsAll(Collection<?> other)` | trả về `true` nếu collection này chứa mọi element trong collection `other`. |
| `boolean add(E element)` | cố thêm một element vào collection. Trả về `true` nếu collection thay đổi do lời gọi này. |
| `boolean addAll(Collection<? extends E> other)` | thêm mọi element từ collection `other` vào collection này. Trả về `true` nếu collection thay đổi do lời gọi này. |
| `boolean remove(Object obj)` | cố xoá một object bằng `obj` khỏi collection này. Trả về `true` nếu có object khớp bị xoá. |
| `boolean removeAll(Collection<?> other)` | xoá khỏi collection này mọi element có trong collection `other`. Trả về `true` nếu collection thay đổi do lời gọi này. |
| `default boolean removeIf(Predicate<? super E> filter)` **(8)** | xoá mọi element mà `filter` trả về `true`. Trả về `true` nếu collection thay đổi do lời gọi này. |
| `void clear()` | xoá mọi element khỏi collection này. |
| `boolean retainAll(Collection<?> other)` | xoá khỏi collection này mọi element **không** bằng một element nào trong collection `other`. Trả về `true` nếu collection thay đổi do lời gọi này. |
| `Object[] toArray()` | trả về một array các object trong collection. |
| `<T> T[] toArray(IntFunction<T[]> generator)` **(11)** | trả về một array các object trong collection. Array được dựng bằng `generator`, thường là biểu thức constructor `T[]::new`. |

## API — `java.util.Iterator<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean hasNext()` | trả về `true` nếu còn element khác để duyệt. |
| `E next()` | trả về object kế tiếp cần duyệt. Ném `NoSuchElementException` nếu đã tới cuối collection. |
| `void remove()` | xoá object vừa duyệt gần nhất. Method này **phải đi ngay sau** một lần duyệt element. Nếu collection đã bị sửa kể từ lần duyệt gần nhất, method này ném `IllegalStateException`. Iterator **không bắt buộc** phải hỗ trợ thao tác này; implementation mặc định ném `UnsupportedOperationException`. |
| `default void forEachRemaining(Consumer<? super E> action)` **(8)** | duyệt các element và truyền chúng cho `action` cho tới khi không còn element nào hoặc `action` ném exception. |

---

## Bài kế tiếp

→ [[02 - Interfaces in the Collections Framework]] — hai interface nền tảng `Collection` và `Map`, các interface `List`, `Set`, `SortedSet`, `NavigableSet` và `SequencedCollection` của Java 21.
