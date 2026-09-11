# 03 — Concrete Collections

> Chapter 9, Section 9.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.3. Concrete Collections

> *"Table 9.1 shows the collections in the Java Collections Framework and briefly describes the purpose of each collection class. (For simplicity, I omit the thread-safe collections that will be discussed in Chapter 10.)"*

**Dịch:** Bảng 9.1 liệt kê các collection trong Java Collections Framework và **mô tả ngắn gọn mục đích của từng collection class**. (Cho gọn, sách **bỏ qua các collection thread-safe** — sẽ bàn ở Chapter 10.)

> *"All classes in Table 9.1 implement the Collection interface, with the exception of the classes with names ending in Map. Those classes implement the Map interface instead. We will discuss maps in Section 9.4."*

**Dịch:** **Mọi class trong Bảng 9.1 đều implement interface `Collection`**, **trừ** các class có tên **kết thúc bằng `Map`** — những class đó implement interface **`Map`**.

### Table 9.1 — Concrete Collections in the Java Collections Framework

| Collection Type | Description | See |
|---|---|---|
| `ArrayList` | An indexed sequence that grows and shrinks dynamically | Section 9.3.2 |
| `LinkedList` | An ordered sequence that allows efficient insertion and removal at any location | Section 9.3.1 |
| `ArrayDeque` | A double-ended queue that is implemented as a circular array | Section 9.3.5 |
| `HashSet` | An unordered collection that rejects duplicates | Section 9.3.3 |
| `TreeSet` | A sorted set | Section 9.4.5 |
| `EnumSet` | A set of enumerated type values | Section 9.4.6 |
| `LinkedHashSet` | A set that remembers the order in which elements were inserted | Section 9.4.5 |
| `PriorityQueue` | A collection that allows efficient removal of the smallest element | Section 9.3.6 |
| `HashMap` | A data structure that stores key/value associations | Section 9.4.1 |
| `TreeMap` | A map in which the keys are sorted | Section 9.4.1 |
| `EnumMap` | A map in which the keys belong to an enumerated type | Section 9.4.6 |
| `LinkedHashMap` | A map that remembers the order in which entries were added | Section 9.4.5 |
| `WeakHashMap` | A map with values that can be reclaimed by the garbage collector if they are not used elsewhere | Section 9.4.4 |
| `IdentityHashMap` | A map with keys that are compared by `==`, not `equals` | Section 9.4.7 |

**Dịch bảng:**

| Collection Type | Mô tả |
|---|---|
| `ArrayList` | Một **dãy có index**, **lớn lên và co lại động** |
| `LinkedList` | Một **dãy có thứ tự**, cho phép **chèn và xoá hiệu quả ở bất kỳ vị trí nào** |
| `ArrayDeque` | Một **double-ended queue** được implement bằng **circular array** |
| `HashSet` | Một collection **không có thứ tự**, **từ chối phần tử trùng** |
| `TreeSet` | Một **set đã sắp xếp** |
| `EnumSet` | Một set chứa **giá trị của kiểu enumerated** |
| `LinkedHashSet` | Một set **nhớ thứ tự các element được chèn vào** |
| `PriorityQueue` | Một collection cho phép **xoá element nhỏ nhất một cách hiệu quả** |
| `HashMap` | Data structure lưu **liên kết key/value** |
| `TreeMap` | Một map trong đó **key được sắp xếp** |
| `EnumMap` | Một map trong đó **key thuộc một kiểu enumerated** |
| `LinkedHashMap` | Một map **nhớ thứ tự các entry được thêm vào** |
| `WeakHashMap` | Một map có **value có thể bị garbage collector thu hồi** nếu không còn chỗ nào khác dùng |
| `IdentityHashMap` | Một map có **key được so sánh bằng `==` chứ không phải `equals`** |

> *"Figure 9.5 shows the relationships between these classes."*

**Dịch:** Figure 9.5 cho thấy **quan hệ giữa các class này**.

**Figure 9.5: Classes in the Java Collections Framework**

```
                          AbstractCollection
                        △        △        △        △
            ┌───────────┘        │        │        └──────────┐
       AbstractList         AbstractSet  AbstractQueue     ArrayDeque
         △        △          △    △   △        △
    ┌────┘        │      ┌───┘    │   └───┐    │
AbstractSequentialList ArrayList  │       │  PriorityQueue
         △                        │       │
         │                HashSet EnumSet TreeSet
    LinkedList                △
                              │
                       LinkedHashSet


                            AbstractMap
                    △     △      △       △        △
             ┌──────┘     │      │       │        └────────┐
          HashMap     TreeMap EnumMap WeakHashMap   IdentityHashMap
             △
             │
       LinkedHashMap
```

---

## 9.3.1. Linked Lists

> *"We already used arrays and their dynamic cousin, the ArrayList class, for many examples in this book. However, arrays and array lists suffer from a major drawback. Removing an element from the middle of an array is expensive since all array elements beyond the removed one must be moved toward the beginning of the array (see Figure 9.6). The same is true for inserting elements in the middle."*

**Dịch:** Ta đã dùng [[09 - Arrays|array]] và người anh em động của nó là [[03 - Generic Array Lists|`ArrayList`]] ở nhiều ví dụ. Nhưng array và array list có **một nhược điểm lớn**: **xoá một element ở giữa array rất đắt**, vì **mọi element phía sau phải dịch về đầu array**. **Chèn element ở giữa cũng vậy.**

**Figure 9.6: Removing an element from an array**

```
                  ┌─────────┐
                  │         │
                  ├─────────┤
 removed element  │/////////│ ←┐
                  ├─────────┤  │
                  │         │ ─┘  mọi element phía sau
                  ├─────────┤     phải dịch lên một ô
                  │         │ ─┐
                  ├─────────┤  │
                  │         │ ─┘
                  ├─────────┤
                  │         │
                  └─────────┘
```

> *"Another well-known data structure, the linked list, solves this problem. Where an array stores object references in consecutive memory locations, a linked list stores each object in a separate link. Each link also stores a reference to the next link in the sequence. In the Java Collections Framework, all linked lists are actually doubly linked; that is, each link also stores a reference to its predecessor (see Figure 9.7)."*

**Dịch:** Một data structure nổi tiếng khác — **linked list** — giải quyết vấn đề này. Trong khi array lưu object reference ở **các ô nhớ liên tiếp**, linked list lưu **mỗi object trong một link riêng**. Mỗi link còn lưu **reference tới link kế tiếp**. Trong Java Collections Framework, **mọi linked list thực chất là doubly linked**: mỗi link **lưu thêm reference tới link đứng trước**.

**Figure 9.7: A doubly linked list**

```
  ┌──────────────┐
  │  LinkedList  │
  │  first  ─────┼───────────┐
  │  last   ─────┼───────────┼───────────────────────────────┐
  └──────────────┘           ▼                               ▼
                    ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
                    │      Node      │   │      Node      │   │      Node      │
                    │ item  [░░░░░]  │   │ item  [░░░░░]  │   │ item  [░░░░░]  │
                    │ next     ──────┼──►│ next     ──────┼──►│ next   (null)  │
                    │ previous(null) │◄──┼── previous     │◄──┼── previous     │
                    └────────────────┘   └────────────────┘   └────────────────┘
```

> *"Removing an element from the middle of a linked list is an inexpensive operation—only the links around the element to be removed need to be updated (see Figure 9.8)."*

**Dịch:** Xoá một element ở giữa linked list là thao tác **rẻ** — **chỉ cần cập nhật các link xung quanh** element bị xoá.

**Figure 9.8: Removing an element from a linked list**

```
  ┌──────────────┐
  │  LinkedList  │
  │  first  ─────┼───────────┐
  │  last   ─────┼───────────┼───────────────────────────────────────┐
  └──────────────┘           ▼                                       ▼
                    ┌────────────────┐  ┌////////////////┐  ┌────────────────┐
                    │      Node      │  │//// Node //////│  │      Node      │
                    │ item  [ Amy ]  │  │// item [Bob] //│  │ item  [ Carl ] │
                    │ next     ──────┼──┼────────────────┼─►│ next   (null)  │
                    │ previous(null) │◄─┼────────────────┼──┼── previous     │
                    └────────────────┘  └////////////////┘  └────────────────┘
                                          (đã bị gỡ khỏi
                                             chuỗi link)
```

Node "Bob" bị gạch bỏ: chỉ `next` của Amy và `previous` của Carl được nối lại với nhau.

> *"Perhaps you once took a data structures course in which you learned how to implement linked lists. You may have bad memories of tangling up the links when removing or adding elements in the linked list. If so, you will be pleased to learn that the Java Collections Framework supplies a class LinkedList ready for you to use."*

**Dịch:** Có thể bạn từng học môn data structure và có **kỷ niệm xấu vì rối link** khi thêm/xoá element. Nếu vậy thì tin vui: framework **cung cấp sẵn class `LinkedList`**.

> *"The following code example adds three elements and then removes the second one:"*

```java
var staff = new LinkedList<String>();
staff.add("Amy");
staff.add("Bob");
staff.add("Carl");
Iterator<String> iter = staff.iterator();
String first = iter.next();  // visit first element (Amy)
String second = iter.next(); // visit second element (Bob)
iter.remove();               // remove last visited element (Bob)
```

### `ListIterator` — iterator biết thêm element

> *"There is, however, an important difference between linked lists and generic collections. A linked list is an ordered collection in which the position of the objects matters. The LinkedList.add method adds the object to the end of the list. But you will often want to add objects somewhere in the middle of a list. This position-dependent add method is the responsibility of an iterator, since iterators describe positions in collections. Using iterators to add elements makes sense only for collections that have a natural ordering. For example, the set data type that we discuss in the next section does not impose any ordering on its elements. Therefore, there is no add method in the Iterator interface. Instead, the Java Collections Framework supplies a subinterface ListIterator that contains an add method:"*

```java
interface ListIterator<E> extends Iterator<E>
{
    void add(E element);
    . . .
}
```

**Dịch:** Có một **khác biệt quan trọng** giữa linked list và collection tổng quát. Linked list là **collection có thứ tự**, **vị trí object có ý nghĩa**. `LinkedList.add` thêm object **vào cuối list**. Nhưng ta thường muốn thêm object **ở đâu đó giữa list**. Method `add` phụ thuộc vị trí này là **trách nhiệm của iterator**, vì **iterator mô tả vị trí trong collection**. Dùng iterator để thêm element **chỉ có nghĩa với collection có thứ tự tự nhiên** — ví dụ **set không áp đặt thứ tự nào** lên element của nó. Vì thế **interface `Iterator` không có method `add`**; thay vào đó framework cung cấp **subinterface `ListIterator`** có method `add`.

> *"Unlike Collection.add, this method does not return a boolean—it is assumed that the add operation always modifies the list."*

**Dịch:** Khác `Collection.add`, method này **không trả về `boolean`** — mặc định coi rằng **thao tác `add` luôn làm list thay đổi**.

> *"In addition, the ListIterator interface has two methods that you can use for traversing a list backwards."*

```java
boolean hasPrevious()
E previous()
```

> *"Like the next method, the previous method returns the object that it skipped over."*

**Dịch:** Ngoài ra `ListIterator` có **hai method để duyệt list ngược**. Giống `next`, method `previous` **trả về object mà nó vừa nhảy qua**.

> *"The listIterator method of the LinkedList class returns an iterator object that implements the ListIterator interface."*

```java
ListIterator<String> iter = staff.listIterator();
```

> *"The add method adds the new element before the iterator position. For example, the following code skips past the first element in the linked list and adds "Juliet" before the second element (see Figure 9.9):"*

```java
var staff = new LinkedList<String>();
staff.add("Amy");
staff.add("Bob");
staff.add("Carl");
ListIterator<String> iter = staff.listIterator();
iter.next(); // skip past first element
iter.add("Juliet");
```

**Dịch:** Method `add` thêm element mới **trước vị trí iterator**. Đoạn code trên **nhảy qua element đầu** rồi **thêm `"Juliet"` trước element thứ hai**.

**Figure 9.9: Adding an element to a linked list**

```
  ┌──────────────┐
  │  LinkedList  │
  │  first  ─────┼───────────┐
  │  last   ─────┼───────────┼───────────────────────────────────────┐
  └──────────────┘           ▼                                       ▼
                    ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
                    │      Node      │   │      Node      │   │      Node      │
                    │ item  [ Amy ]  │   │ item  [ Bob ]  │   │ item  [ Carl ] │
                    │ next  → Juliet │   │ next     ──────┼──►│ next   (null)  │
                    │ previous(null) │   │ prev  → Juliet │◄──┼── previous     │
                    └────────┬───────┘   └───────▲────────┘   └────────────────┘
                             │                   │
                             │  ┌────────────────┴───┐
                             └─►│        Node        │
                                │ item   [ Juliet ]  │
                                │ next     → Bob     │
                                │ previous → Amy     │
                                └────────────────────┘
```

Thứ tự sau khi thêm: **Amy → Juliet → Bob → Carl**; chỉ các link quanh vị trí chèn bị đổi.

> *"If you call the add method multiple times, the elements are simply added in the order in which you supplied them. They are all added in turn before the current iterator position."*

**Dịch:** Gọi `add` nhiều lần thì các element được thêm **đúng theo thứ tự bạn cung cấp**, **lần lượt trước vị trí iterator hiện tại**.

> *"When you use the add operation with an iterator that was freshly returned from the listIterator method and that points to the first element of the list, the newly added element becomes the first element. When the iterator has passed the last element of the list (that is, when hasNext returns false), the added element becomes the new tail of the list. If the linked list has n elements, there are n + 1 spots for adding a new element. These spots correspond to the n + 1 possible positions of the iterator. For example, if a linked list contains three elements, A, B, and C, there are four possible positions (marked as |) for inserting a new element:"*

```
|ABC
A|BC
AB|C
ABC|
```

**Dịch:** Nếu dùng `add` với iterator **vừa lấy ra từ `listIterator`** (đang trỏ trước element đầu), element mới **trở thành element đầu tiên**. Nếu iterator **đã qua element cuối** (tức `hasNext` trả về `false`), element mới **trở thành đuôi mới của list**. Linked list có **n element** thì có **n + 1 chỗ** để chèn — ứng với **n + 1 vị trí khả dĩ của iterator**.

> **Note (sách):** *"Be careful with the "cursor" analogy. The remove operation does not work exactly like the Backspace key. Immediately after a call to next, the remove method indeed removes the element to the left of the iterator, just like the Backspace key would. However, if you have just called previous, the element to the right will be removed. And you can't call remove twice in a row. Unlike the add method, which depends only on the iterator position, the remove method depends on the iterator state."*
>
> **Dịch:** Cẩn thận với phép ví iterator như **"con trỏ soạn thảo"**. `remove` **không hoạt động đúng như phím Backspace**. Ngay sau khi gọi `next`, `remove` đúng là xoá element **bên trái** iterator, y như Backspace. Nhưng nếu bạn **vừa gọi `previous`** thì element **bên phải** mới bị xoá. Và **không gọi `remove` hai lần liên tiếp được**. Khác với `add` — chỉ phụ thuộc **vị trí** iterator — `remove` phụ thuộc **state** của iterator.

> *"Finally, a set method replaces the last element, returned by a call to next or previous, with a new element. For example, the following code replaces the first element of a list with a new value:"*

```java
ListIterator<String> iter = list.listIterator();
String oldValue = iter.next(); // returns first element
iter.set(newValue);            // sets first element to newValue
```

**Dịch:** Cuối cùng, method **`set`** thay **element gần nhất được trả về bởi `next` hoặc `previous`** bằng một element mới.

### `ConcurrentModificationException`

> *"As you might imagine, if an iterator traverses a collection while another iterator is modifying it, confusing situations can occur. For example, suppose an iterator points before an element that another iterator has just removed. The iterator is now invalid and should no longer be used. The linked list iterators have been designed to detect such modifications. If an iterator finds that its collection has been modified by another iterator or by a method of the collection itself, it throws a ConcurrentModificationException. For example, consider the following code:"*

```java
List<String> list = . . .;
ListIterator<String> iter1 = list.listIterator();
ListIterator<String> iter2 = list.listIterator();
iter1.next();
iter1.remove();
iter2.next(); // throws ConcurrentModificationException
```

**Dịch:** Nếu một iterator đang duyệt collection **trong khi một iterator khác sửa nó**, sẽ sinh ra tình huống rối rắm. Ví dụ, iterator đang trỏ trước một element mà **iterator khác vừa xoá** — iterator đó **giờ không hợp lệ nữa** và **không nên dùng tiếp**. Iterator của linked list được thiết kế để **phát hiện những thay đổi như vậy**: nếu thấy collection **bị sửa bởi iterator khác hoặc bởi chính method của collection**, nó **ném `ConcurrentModificationException`**.

> *"The call to iter2.next throws a ConcurrentModificationException since iter2 detects that the list was modified externally."*

> *"To avoid concurrent modification exceptions, follow this simple rule: You can attach as many iterators to a collection as you like, provided that all of them are only readers. Alternatively, you can attach a single iterator that can both read and write."*

**Dịch:** Để tránh concurrent modification exception, theo **một quy tắc đơn giản**: bạn **gắn bao nhiêu iterator vào collection cũng được, miễn là tất cả chỉ đọc**. Hoặc, **gắn đúng một iterator vừa đọc vừa ghi**.

> *"Concurrent modification detection is done in a simple way. The collection keeps track of the number of mutating operations (such as adding and removing elements). Each iterator keeps a separate count of the number of mutating operations that it was responsible for. At the beginning of each iterator method, the iterator simply checks whether its own mutation count equals that of the collection. If not, it throws a ConcurrentModificationException."*

**Dịch:** Cơ chế phát hiện rất đơn giản. Collection **đếm số thao tác làm thay đổi nó** (thêm, xoá element). Mỗi iterator **giữ bộ đếm riêng** cho số thao tác thay đổi **do chính nó gây ra**. Ở **đầu mỗi method của iterator**, iterator **so bộ đếm của mình với bộ đếm của collection**. **Không khớp thì ném `ConcurrentModificationException`**.

> **Note (sách):** *"There is, however, a curious exception to the detection of concurrent modifications. The linked list only keeps track of structural modifications to the list, such as adding and removing links. The set method does not count as a structural modification. You can attach multiple iterators to a linked list, all of which call set to change the contents of existing links. This capability is required for a number of algorithms in the Collections class that we discuss later in this chapter."*
>
> **Dịch:** Có một **ngoại lệ thú vị**: linked list **chỉ theo dõi thay đổi mang tính cấu trúc** (thêm/xoá link). **`set` không được tính là thay đổi cấu trúc.** Bạn **gắn được nhiều iterator vào một linked list**, tất cả cùng gọi `set` để đổi nội dung các link sẵn có. Khả năng này **cần thiết cho một số algorithm trong class `Collections`** (xem [[06 - Algorithms]]).

### Random access trên linked list — nên tránh

> *"Now you have seen the fundamental methods of the LinkedList class. Use a ListIterator to traverse the elements of the linked list in either direction and to add and remove elements."*

**Dịch:** Dùng **`ListIterator`** để duyệt element theo **cả hai chiều** và để **thêm/xoá element**.

> *"As you saw in Section 9.2, many other useful methods for operating on linked lists are declared in the Collection interface. These are, for the most part, implemented in the AbstractCollection superclass of the LinkedList class. For example, the toString method invokes toString on all elements and produces one long string of the format [A, B, C]. This is handy for debugging. Use the contains method to check whether an element is present in a linked list. For example, the call staff.contains("Harry") returns true if the linked list already contains a string equal to the string "Harry"."*

**Dịch:** Như đã thấy ở [[02 - Interfaces in the Collections Framework|Section 9.2]], nhiều method hữu ích khác được khai báo ở interface `Collection`, và **phần lớn được implement trong superclass `AbstractCollection`** của `LinkedList`. Ví dụ, `toString` gọi `toString` trên mọi element và sinh ra **một chuỗi dài dạng `[A, B, C]`** — **tiện cho debug**. Dùng **`contains`** để kiểm tra element có trong linked list không.

> *"The Java Collections Framework also supplies a number of methods that are, from a theoretical perspective, somewhat dubious. Linked lists do not support fast random access. If you want to see the nth element of a linked list, you have to start at the beginning and skip past the first n – 1 elements. There is no shortcut. For that reason, programmers don't usually use linked lists in situations where elements need to be accessed by an integer index. Nevertheless, the LinkedList class supplies a get method that lets you access a particular element:"*

```java
LinkedList<String> list = . . .;
String obj = list.get(n);
```

**Dịch:** Framework còn cung cấp vài method mà **xét về lý thuyết là hơi đáng ngờ**. Linked list **không hỗ trợ random access nhanh**. Muốn xem element thứ n, phải **bắt đầu từ đầu và nhảy qua n – 1 element**. **Không có đường tắt.** Vì thế lập trình viên **thường không dùng linked list** khi cần truy cập element bằng integer index. Dù vậy `LinkedList` **vẫn cung cấp `get`**.

> *"Of course, this method is not very efficient. If you find yourself using it, you are probably using a wrong data structure for your problem."*

**Dịch:** Method này **không hiệu quả**. Nếu thấy mình đang dùng nó, **có lẽ bạn chọn sai data structure** cho bài toán.

> *"You should never use this illusory random access method to step through a linked list. The code"*

```java
for (int i = 0; i < list.size(); i++)
    do something with list.get(i);
```

> *"is staggeringly inefficient. Each time you look up another element, the search starts again from the beginning of the list. The LinkedList object makes no effort to cache the position information."*

**Dịch:** **Đừng bao giờ** dùng cái random access ảo tưởng này để duyệt linked list. Đoạn code trên **kém hiệu quả kinh khủng**: mỗi lần tra một element, **việc tìm lại bắt đầu từ đầu list**. Object `LinkedList` **không hề cache thông tin vị trí**.

> **Note (sách):** *"The get method has one slight optimization: If the index is at least size() / 2, the search for the element starts at the end of the list."*
>
> **Dịch:** `get` có **một tối ưu nhỏ**: nếu index **từ `size() / 2` trở lên**, việc tìm **bắt đầu từ cuối list**.

> *"The list iterator interface also has a method to tell you the index of the current position. In fact, since Java iterators conceptually point between elements, it has two of them: The nextIndex method returns the integer index of the element that would be returned by the next call to next; the previousIndex method returns the index of the element that would be returned by the next call to previous. Of course, that is simply one less than nextIndex. These methods are efficient for LinkedList iterators—each iterator keeps a count of its current position. Finally, if you have an integer index n, then list.listIterator(n) returns an iterator that points just before the element with index n. That is, calling next yields the same element as list.get(n); obtaining that iterator is inefficient."*

**Dịch:** `ListIterator` có method cho biết **index của vị trí hiện tại**. Thực ra vì iterator của Java **nằm giữa các element** nên có **hai method**: **`nextIndex`** trả về index của element mà **lời gọi `next` kế tiếp** sẽ trả về; **`previousIndex`** trả về index của element mà **lời gọi `previous` kế tiếp** sẽ trả về — đơn giản là **nhỏ hơn `nextIndex` một đơn vị**. Hai method này **hiệu quả với iterator của `LinkedList`** vì **mỗi iterator giữ bộ đếm vị trí hiện tại**. Cuối cùng, `list.listIterator(n)` trả về iterator **trỏ ngay trước element có index n** — gọi `next` cho ra đúng element như `list.get(n)`; nhưng **việc lấy iterator đó thì không hiệu quả**.

> *"If you have a linked list with only a handful of elements, you don't have to be overly paranoid about the cost of the get and set methods. But then, why use a linked list in the first place? The only reason to use a linked list is to minimize the cost of insertion and removal in the middle of the list. If you have only a few elements, you can just use an ArrayList."*

**Dịch:** Nếu linked list chỉ có **dăm ba element** thì **không cần hoang tưởng** về chi phí của `get` và `set`. Nhưng khi đó, **sao lại dùng linked list ngay từ đầu**? **Lý do duy nhất** dùng linked list là **giảm chi phí chèn/xoá ở giữa list**. Ít element thì cứ **dùng `ArrayList`**.

> *"I recommend that you simply stay away from all methods that use an integer index to denote a position in a linked list. If you want random access into a collection, use an array or ArrayList, not a linked list."*

**Dịch:** Sách khuyên: **tránh xa mọi method dùng integer index** để chỉ vị trí trong linked list. Cần random access thì **dùng array hoặc `ArrayList`, không dùng linked list**.

> *"The program in Listing 9.1 puts linked lists to work. It simply creates two lists, merges them, then removes every second element from the second list, and finally tests the removeAll method. I recommend that you trace the program flow and pay special attention to the iterators. You may find it helpful to draw diagrams of the iterator positions, like this:"*

```
|ACE  |BDFG
A|CE  |BDFG
AB|CE B|DFG
. . .
```

**Dịch:** Chương trình ở Listing 9.1 tạo **hai list**, **trộn chúng lại**, rồi **xoá mỗi element thứ hai của list thứ hai**, cuối cùng **thử method `removeAll`**. Nên **lần theo luồng chương trình** và **chú ý đặc biệt tới các iterator**; vẽ sơ đồ vị trí iterator sẽ giúp ích.

> *"Note that the call `System.out.println(a);` prints all elements in the linked list a by invoking the toString method in AbstractCollection."*

**Dịch:** Lưu ý `System.out.println(a)` in mọi element của linked list `a` bằng cách gọi **`toString` trong `AbstractCollection`**.

### Listing 9.1 — `linkedList/LinkedListTest.java`

```java
package linkedList;

import java.util.*;

/**
 * This program demonstrates operations on linked lists.
 * @version 1.13 2023-12-05
 * @author Cay Horstmann
 */
public class LinkedListTest
{
    public static void main(String[] args)
    {
        var a = new LinkedList<String>();
        a.add("Amy");
        a.add("Carl");
        a.add("Erica");

        var b = new LinkedList<String>();
        b.add("Bob");
        b.add("Doug");
        b.add("Frances");
        b.add("Gloria");

        // merge the elements from b into a
        ListIterator<String> aIter = a.listIterator();
        Iterator<String> bIter = b.iterator();

        while (bIter.hasNext())
        {
            if (aIter.hasNext()) aIter.next();
            aIter.add(bIter.next());
        }

        System.out.println(a);

        // remove every second element from b
        bIter = b.iterator();
        while (bIter.hasNext())
        {
            bIter.next(); // skip one element
            if (bIter.hasNext())
            {
                bIter.next(); // skip next element
                bIter.remove(); // remove that element
            }
        }

        System.out.println(b);

        // bulk operation: remove all elements in b from a
        a.removeAll(b);

        System.out.println(a);
    }
}
```

---

## API — `java.util.List<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ListIterator<E> listIterator()` | trả về một list iterator để duyệt các element của list. |
| `ListIterator<E> listIterator(int index)` | trả về một list iterator để duyệt các element của list, mà **lời gọi `next` đầu tiên sẽ trả về element ở index cho trước**. |
| `void add(int i, E element)` | thêm một element vào vị trí chỉ định. |
| `boolean addAll(int i, Collection<? extends E> elements)` | thêm mọi element từ một collection vào vị trí chỉ định. |
| `E remove(int i)` | xoá và trả về element ở vị trí chỉ định. |
| `E get(int i)` | lấy element ở vị trí chỉ định. |
| `E set(int i, E element)` | thay element ở vị trí chỉ định bằng element mới và **trả về element cũ**. |
| `int indexOf(Object element)` | trả về vị trí **xuất hiện đầu tiên** của element bằng element chỉ định, hoặc `-1` nếu không tìm thấy. |
| `int lastIndexOf(Object element)` | trả về vị trí **xuất hiện cuối cùng** của element bằng element chỉ định, hoặc `-1` nếu không tìm thấy. |

## API — `java.util.ListIterator<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void add(E newElement)` | thêm một element **trước vị trí hiện tại**. |
| `void set(E newElement)` | thay element gần nhất được duyệt bởi `next` hoặc `previous` bằng element mới. Ném `IllegalStateException` nếu cấu trúc list đã bị sửa kể từ lời gọi `next`/`previous` gần nhất. |
| `boolean hasPrevious()` | trả về `true` nếu còn element khác để duyệt khi đi **ngược** trong list. |
| `E previous()` | trả về object đứng trước. Ném `NoSuchElementException` nếu đã tới **đầu list**. |
| `int nextIndex()` | trả về index của element mà lời gọi `next` kế tiếp sẽ trả về, hoặc **size của list** nếu iterator đã qua element cuối. |
| `int previousIndex()` | trả về index của element mà lời gọi `previous` kế tiếp sẽ trả về, hoặc `-1` nếu iterator đang ở trước element đầu. |

## API — `java.util.LinkedList<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `LinkedList()` | dựng một linked list rỗng. |
| `LinkedList(Collection<? extends E> elements)` | dựng một linked list và thêm mọi element từ một collection. |
| `void addFirst(E element)` / `void addLast(E element)` | thêm một element vào **đầu** hoặc **cuối** list. |
| `E getFirst()` / `E getLast()` | trả về element ở **đầu** hoặc **cuối** list. |
| `E removeFirst()` / `E removeLast()` | xoá và trả về element ở **đầu** hoặc **cuối** list. |

---

## 9.3.2. Array Lists

> *"In the preceding section, you saw the List interface and the LinkedList class that implements it. The List interface describes an ordered collection in which the position of elements matters. There are two protocols for visiting the elements: through an iterator and by random access with methods get and set. The latter is not appropriate for linked lists, but of course get and set make a lot of sense for arrays. The Java Collections Framework supplies the familiar ArrayList class that also implements the List interface. An ArrayList encapsulates a dynamically reallocated array of objects."*

**Dịch:** Interface **`List`** mô tả một **collection có thứ tự**, trong đó **vị trí element có ý nghĩa**. Có **hai giao thức duyệt element**: **qua iterator** và **random access bằng `get`/`set`**. Cách sau **không hợp với linked list**, nhưng **rất hợp với array**. Framework cung cấp class quen thuộc **`ArrayList`** cũng implement `List`. Một `ArrayList` **đóng gói một array object được cấp phát lại một cách động**.

> **Note (sách):** *"Java 1.0 came with a different array-based collection, the Vector class. All methods of the Vector class are synchronized. It is safe to access a Vector object from two threads. But if you access a vector from only a single thread—by far the more common case—the synchronization is wasteful. In contrast, the ArrayList methods are not synchronized. As you will see in Chapter 10, there are now better threadsafe choices as well. There is no reason to use Vector nowadays unless you need to interface with an ancient API."*
>
> **Dịch:** Java 1.0 có một collection dựa trên array khác là class **`Vector`**. **Mọi method của `Vector` đều `synchronized`** — truy cập một `Vector` từ hai thread là **an toàn**. Nhưng nếu chỉ truy cập từ **một thread** (trường hợp phổ biến hơn nhiều) thì **việc đồng bộ là lãng phí**. Ngược lại, **method của `ArrayList` không `synchronized`**. Ngày nay còn có **những lựa chọn threadsafe tốt hơn** (Chapter 10). **Không có lý do gì để dùng `Vector`** trừ khi phải làm việc với **một API cổ lỗ**.

---

## 9.3.3. Hash Sets

> *"Linked lists and arrays let you specify the order in which you want to arrange the elements. However, if you are looking for a particular element and don't remember its position, you need to visit all elements until you find a match. That can be time consuming if the collection contains many elements. If you don't care about the ordering of the elements, there are data structures that let you find elements much faster. The drawback is that those data structures give you no control over the order in which the elements appear. These data structures organize the elements in an order that is convenient for their own purposes."*

**Dịch:** Linked list và array cho bạn **chỉ định thứ tự sắp xếp element**. Nhưng nếu tìm một element cụ thể mà **không nhớ vị trí**, bạn phải **duyệt hết mọi element cho tới khi khớp** — **rất tốn thời gian** nếu collection nhiều element. Nếu **không quan tâm thứ tự**, có những data structure **tìm element nhanh hơn nhiều**. Nhược điểm: chúng **không cho bạn kiểm soát thứ tự element xuất hiện** — chúng **tổ chức element theo thứ tự tiện cho mục đích riêng của chúng**.

> *"A well-known data structure for finding objects quickly is the hash table. A hash table computes an integer, called the hash code, for each object. A hash code is somehow derived from the instance fields of an object, preferably in such a way that objects with different data yield different codes. Table 9.2 lists a few examples of hash codes that result from the hashCode method of the String class."*

**Dịch:** Một data structure nổi tiếng để **tìm object nhanh** là **hash table**. Hash table **tính ra một số nguyên gọi là hash code** cho mỗi object. Hash code được **suy ra từ instance field của object**, tốt nhất là theo cách mà **object có dữ liệu khác nhau sẽ cho code khác nhau**.

### Table 9.2 — Hash Codes Resulting from the `hashCode` Method

| String | Hash Code |
|---|---|
| `"Lee"` | 76268 |
| `"lee"` | 107020 |
| `"eel"` | 100300 |

> *"If you define your own classes, you are responsible for implementing your own hashCode method—see Chapter 5 for more information. Your implementation needs to be compatible with the equals method: If a.equals(b), then a and b must have the same hash code."*

**Dịch:** Khi tự định nghĩa class, **bạn chịu trách nhiệm implement `hashCode` của riêng mình**. Implementation phải **tương thích với `equals`**: nếu `a.equals(b)` thì **`a` và `b` phải có cùng hash code**. (Xem [[02 - Object The Cosmic Superclass]].)

> *"What's important for now is that hash codes can be computed quickly and that the computation depends only on the state of the object that needs to be hashed, not on the other objects in the hash table."*

**Dịch:** Điều quan trọng lúc này: hash code **tính được nhanh**, và phép tính **chỉ phụ thuộc vào state của object cần hash**, **không phụ thuộc các object khác trong hash table**.

### Bucket và hash collision

> *"In Java, hash tables are implemented as arrays of linked lists. Each list is called a bucket (see Figure 9.10). To find the place of an object in the table, compute its hash code and reduce it modulo the total number of buckets. The resulting number is the index of the bucket that holds the element. For example, if an object has hash code 76268 and there are 128 buckets, then the object is placed in bucket 108 (because the remainder 76268 % 128 is 108). Perhaps you are lucky and there is no other element in that bucket. Then, you simply insert the element into that bucket. Of course, sometimes you will hit a nonempty bucket. This is called a hash collision. Then, compare the new object with all objects in that bucket to see if it is already present. If the hash codes are reasonably randomly distributed and the number of buckets is large enough, only a few comparisons should be necessary."*

**Dịch:** Trong Java, hash table được implement thành **array các linked list**. Mỗi list gọi là một **bucket**. Để tìm chỗ của một object trong table, **tính hash code rồi lấy modulo tổng số bucket**. Số thu được là **index của bucket chứa element**. Ví dụ, object có hash code **76268** và có **128 bucket** thì object nằm ở **bucket 108** (vì `76268 % 128` bằng 108). Có thể may mắn là **bucket đó rỗng** — cứ chèn element vào. Nhưng đôi khi **trúng bucket không rỗng** — gọi là **hash collision**. Khi đó **so object mới với mọi object trong bucket** xem đã có chưa. Nếu hash code **phân bố ngẫu nhiên tương đối tốt** và **số bucket đủ lớn** thì **chỉ cần vài phép so sánh**.

**Figure 9.10: A hash table**

```
   ┌────────┐
   │        ├────────►┌────┬───┐    ┌────┬───┐
   ├────────┤         │ ░░ │ ──┼───►│ ░░ │   │
   │        ├────────►┌────┬───┐    └────┴───┘
   ├────────┤         │ ░░ │   │
   │        ├────────►┌────┬───┐    ┌────┬───┐
   ├────────┤         │ ░░ │ ──┼───►│ ░░ │   │
   ┊        ┊         └────┴───┘    └────┴───┘
   ├────────┤
   │        ├────────►┌────┬───┐
   └────────┘         │ ░░ │   │
                      └────┴───┘
    array các          bucket = linked list
    bucket             (nhiều phần tử ⇒ hash collision)
```

> **Note (sách):** *"In the HashMap implementation, a bucket changes from a linked list into a balanced binary tree when its size exceeds a threshold. This improves performance if a hash function was poorly chosen and yields many collisions, or if malicious code tries to flood a hash table with many values that have identical hash codes."*
>
> **Dịch:** Trong implementation của `HashMap`, một bucket **biến từ linked list thành balanced binary tree** khi **kích thước vượt một ngưỡng**. Điều này **cải thiện performance** nếu hash function **chọn kém và sinh nhiều collision**, hoặc nếu **code độc hại cố dội vào hash table nhiều giá trị có hash code giống hệt nhau**.

> **Tip (sách):** *"If at all possible, the keys of a hash table should belong to a class that implements the Comparable interface. Then you are guaranteed not to suffer poor performance due to poorly distributed hash codes."*
>
> **Dịch:** Nếu có thể, **key của hash table nên thuộc class implement interface `Comparable`**. Khi đó bạn được **bảo đảm không bị tụt performance vì hash code phân bố kém**.

### Load factor và rehash

> *"If the hash table gets too full, it needs to be rehashed. To rehash the table, a table with more buckets is created, all elements are inserted into the new table, and the original table is discarded. The load factor determines when a hash table is rehashed. For example, if the load factor is 0.75 (which is the default) and the table is more than 75% full, it is automatically rehashed with twice as many buckets. For most applications, it is reasonable to leave the load factor at 0.75."*

**Dịch:** Nếu hash table **quá đầy**, nó cần được **rehash**. Rehash nghĩa là **tạo một table có nhiều bucket hơn**, **chèn hết element vào table mới**, rồi **bỏ table cũ**. **Load factor quyết định khi nào rehash**. Ví dụ, load factor là **0.75** (mặc định) và table **đầy hơn 75%** thì nó **tự động rehash với số bucket gấp đôi**. Với hầu hết ứng dụng, **để load factor ở 0.75 là hợp lý**.

> *"If you want more control over the performance of the hash table, you can specify the initial bucket count. You should set it to the expected element count, divided by the load factor. Or, as of Java 19, you can use the static newHashSet convenience method that does this computation for you:"*

```java
HashSet<String> strings = HashSet.newHashSet(expectedElementCount);
```

**Dịch:** Muốn kiểm soát performance nhiều hơn, bạn **chỉ định số bucket ban đầu**. Nên đặt bằng **số element kỳ vọng chia cho load factor**. Hoặc, **từ Java 19**, dùng static method tiện lợi **`newHashSet`** — nó **tự tính giúp bạn**.

> **Note (sách):** *"Some researchers believe that it is a good idea to make the bucket count a prime number to prevent a clustering of keys. The evidence for this isn't conclusive, however. The Java Collections Framework uses bucket counts that are powers of 2, with a default of 16. (Any value you supply for the bucket count is automatically rounded to the next power of 2.)"*
>
> **Dịch:** Một số nhà nghiên cứu tin rằng **để số bucket là số nguyên tố** sẽ **ngăn key bị dồn cụm**. Nhưng **bằng chứng chưa dứt khoát**. Java Collections Framework **dùng số bucket là luỹ thừa của 2**, **mặc định 16**. (Giá trị bạn cung cấp sẽ **tự động làm tròn lên luỹ thừa của 2 kế tiếp**.)

### `HashSet`

> *"Hash tables can be used to implement several important data structures. The simplest among them is the set type. A set is a collection of elements without duplicates. The add method of a set first tries to find the object to be added, and adds it only if it is not yet present."*

**Dịch:** Hash table dùng để implement được **nhiều data structure quan trọng**. Đơn giản nhất là **kiểu set** — **collection các element không trùng lặp**. Method `add` của set **trước hết tìm object cần thêm**, và **chỉ thêm nếu nó chưa có**.

> *"The Java Collections Framework supplies a HashSet class that implements a set based on a hash table. You add elements with the add method. The contains method is redefined to make a fast lookup to see if an element is already present in the set. It checks only the elements in one bucket and not all elements in the collection."*

**Dịch:** Framework cung cấp class **`HashSet`** implement set **dựa trên hash table**. Bạn thêm element bằng `add`. Method **`contains` được định nghĩa lại để tra cứu nhanh**: nó **chỉ kiểm tra element trong một bucket**, **không kiểm tra toàn bộ collection**.

> *"The hash set iterator visits all buckets in turn. Since hashing scatters the elements around in the table, they are visited in a seemingly random order. You would only use a HashSet if you don't care about the ordering of the elements in the collection."*

**Dịch:** Iterator của hash set **duyệt lần lượt mọi bucket**. Vì việc hash **rải element khắp table** nên chúng được duyệt theo **thứ tự trông có vẻ ngẫu nhiên**. Chỉ dùng `HashSet` khi **không quan tâm thứ tự element**.

> *"The sample program at the end of this section (Listing 9.2) reads words from a file, adds them to a set, and prints out the first twenty words in the set. For example, you can feed the program the text from Alice in Wonderland by launching it from a command shell as"*

```
java set.SetTest ../gutenberg/alice30.txt
```

> *"Alice in Wonderland has 28,195 words, of which 5,909 are unique, including the copyright notice at the beginning. The words appear in random order. The same words are then inserted into a tree set, which, as you will see in the following section, keeps the elements in sorted order."*

**Dịch:** Chương trình mẫu **đọc từ trong một file**, **thêm vào một set**, và **in ra hai mươi từ đầu tiên** trong set. *Alice in Wonderland* có **28.195 từ**, trong đó **5.909 từ là duy nhất** (kể cả phần copyright ở đầu). Các từ **xuất hiện theo thứ tự ngẫu nhiên**. Cũng những từ đó sau đó được chèn vào một **tree set** — thứ **giữ element theo thứ tự đã sắp xếp**.

> **Caution (sách):** *"Be careful when you mutate set elements. If the hash code of an element were to change, the element would no longer be in the correct position in the data structure."*
>
> ```java
> var rects = new HashSet<Rectangle>();
> var rect = new Rectangle(5, 10, 20, 30);
> rects.add(rect);
> rect.setLocation(0, 0);
> // rects is now [java.awt.Rectangle[x=0,y=0,width=20,height=30]]
> rects.remove(new Rectangle(0, 0, 20, 30)); // Returns false, doesn't remove
> ```
>
> **Dịch:** **Cẩn thận khi mutate element của set.** Nếu hash code của một element **thay đổi**, element đó **không còn nằm đúng vị trí trong data structure nữa**.

### Listing 9.2 — `set/SetTest.java`

```java
package set;

import java.io.IOException;
import java.nio.file.Path;
import java.util.*;

/**
 * This program compares insertion into a hash set and a tree set.
 * Run the program as
 * java set.SetTest ../gutenberg/alice30.txt
 * java set.SetTest ../gutenberg/crsto10.txt 100
 * @version 1.2 2023-12-07
 * @author Cay Horstmann
 */
public class SetTest
{
    public static void time(Set<String> wordSet, List<String> wordList, int repetitions)
    {
        long totalTime = 0;
        for (int i = 1; i <= repetitions; i++)
        {
            for (String word : wordList)
            {
                long start = System.nanoTime();
                wordSet.add(word);
                long end = System.nanoTime();
                totalTime += end - start;
            }
        }
        Iterator<String> iter = wordSet.iterator();
        for (int i = 1; i <= 20 && iter.hasNext(); i++)
            System.out.print(iter.next() + " ");
        System.out.println("...");
        System.out.printf("%s: %d words, %d distinct, %.3f seconds.%n",
            wordSet.getClass().getSimpleName(), wordList.size(), wordSet.size(),
            totalTime * 1E-9);
    }

    public static void main(String[] args) throws IOException
    {
        List<String> words = new ArrayList<>();
        String filename = args.length > 0 ? args[0] : "../gutenberg/crsto10.txt";
        int repetitions = args.length > 1 ? Integer.parseInt(args[1]) : 1;
        try (var in = new Scanner(Path.of(filename))) {
            while (in.hasNext()) {
                String word = in.next();
                words.add(word);
            }
        }
        time(new HashSet<>(), words, repetitions);
        time(new TreeSet<>(), words, repetitions);
    }
}
```

## API — `java.util.HashSet<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `HashSet()` | dựng một hash set rỗng. |
| `HashSet(Collection<? extends E> elements)` | dựng một hash set và thêm mọi element từ một collection. |
| `HashSet(int initialCapacity)` / `HashSet(int initialCapacity, float loadFactor)` | dựng một hash set rỗng với capacity chỉ định và load factor chỉ định, hoặc load factor `0.75`. Nếu tỷ lệ `size/capacity` vượt load factor, hash table sẽ được **rehash sang một table lớn hơn**. |
| `static <E> HashSet<E> newHashSet(int numMappings)` **(19)** | dựng một hash set rỗng với **initial capacity đủ** để chứa số element kỳ vọng (`numMappings`) mà **không phải rehash**. |

## API — `java.lang.Object` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `int hashCode()` | trả về hash code của object này. Hash code có thể là **số nguyên bất kỳ, dương hay âm**. Định nghĩa của `equals` và `hashCode` **phải tương thích**: nếu `x.equals(y)` là `true` thì `x.hashCode()` **phải bằng** `y.hashCode()`. |

---

## 9.3.4. Tree Sets

> *"The TreeSet class is similar to the hash set, with one added improvement. A tree set is a sorted collection. You insert elements into the collection in any order. When you iterate through the collection, the values are automatically presented in sorted order. For example, suppose you insert three strings and then visit all elements that you added."*

```java
var sorter = new TreeSet<String>();
sorter.add("Bob");
sorter.add("Amy");
sorter.add("Carl");
for (String s : sorter) System.out.println(s);
```

**Dịch:** Class **`TreeSet`** giống hash set, nhưng có **một cải tiến**: tree set là **collection đã sắp xếp**. Bạn **chèn element theo thứ tự bất kỳ**, nhưng khi duyệt thì **giá trị tự động hiện ra theo thứ tự đã sắp xếp**.

> *"Then, the values are printed in sorted order: Amy Bob Carl. As the name of the class suggests, the sorting is accomplished by a tree data structure. (The current implementation uses a red-black tree. For a detailed description of red-black trees see, for example, Introduction to Algorithms by Thomas Cormen, Charles Leiserson, Ronald Rivest, and Clifford Stein, The MIT Press, 2022.) Every time an element is added to a tree, it is placed into its proper sorting position. Therefore, the iterator always visits the elements in sorted order."*

**Dịch:** Kết quả in ra theo thứ tự **Amy Bob Carl**. Đúng như tên class, việc sắp xếp được thực hiện bởi **data structure dạng tree**. (Implementation hiện tại dùng **red-black tree**; xem mô tả chi tiết trong *Introduction to Algorithms* của Cormen, Leiserson, Rivest, Stein, The MIT Press, 2022.) **Mỗi lần thêm element vào tree, nó được đặt đúng vào vị trí sắp xếp của mình**, nên **iterator luôn duyệt element theo thứ tự đã sắp xếp**.

> *"Adding an element to a tree is slower than adding it to a hash table. But it is still much faster than checking for duplicates in an array or linked list. If the tree contains n elements, then an average of log2 n comparisons are required to find the correct position for the new element. For example, if the tree already contains 1,000 elements, adding a new element requires about 10 comparisons."*

**Dịch:** Thêm element vào tree **chậm hơn** thêm vào hash table. Nhưng vẫn **nhanh hơn nhiều so với việc kiểm tra trùng lặp trong array hoặc linked list**. Nếu tree có **n element** thì **trung bình cần log₂ n phép so sánh** để tìm đúng vị trí cho element mới. Ví dụ, tree đã có **1.000 element** thì thêm element mới cần **khoảng 10 phép so sánh**.

> **Note (sách):** *"In order to use a tree set, you must be able to compare the elements. The elements must implement the Comparable interface, or you must supply a Comparator when constructing the set. (The Comparable and Comparator interfaces were introduced in Chapter 6.)"*
>
> **Dịch:** Để dùng tree set, bạn **phải so sánh được các element**. Element **phải implement interface `Comparable`**, hoặc bạn **phải cung cấp một `Comparator` khi dựng set**. (Xem [[01 - Interfaces]].)

> *"How much slower is a tree set? Run the program in Listing 9.2 as `java set.SetTest ../gutenberg/crsto10.txt 100`. The Count of Monte Cristo has 466.300 words, each of which is inserted 100 times. On my test machine, the TreeSet is almost 4 times slower. If you don't need the data sorted, there is no reason to pay for the sorting overhead. More important, with some data it is much more difficult to come up with a sort order than a hash function. A hash function only needs to do a reasonably good job of scrambling the objects, whereas a comparison function must tell objects apart with complete precision."*

**Dịch:** Tree set chậm hơn bao nhiêu? *The Count of Monte Cristo* có **466.300 từ**, mỗi từ được chèn **100 lần**. Trên máy test của tác giả, **`TreeSet` chậm gần 4 lần**. Nếu **không cần dữ liệu đã sắp xếp** thì **không có lý do gì trả giá cho overhead sắp xếp**. Quan trọng hơn: với một số dữ liệu, **nghĩ ra được một sort order khó hơn nhiều so với một hash function**. Hash function **chỉ cần xáo trộn object tương đối tốt**, còn **comparison function phải phân biệt object với độ chính xác tuyệt đối**.

> *"To make this distinction more concrete, consider the task of collecting a set of rectangles. If you use a TreeSet, you need to supply a Comparator\<Rectangle>. How do you compare two rectangles? By area? That doesn't work. You can have two different rectangles with different coordinates but the same area, and you want to keep both. The comparator must be compatible with equals; that is, the comparison can only be zero if the elements are equal. There is such a sort order for rectangles (the lexicographic ordering on its coordinates), but it is cumbersome to compute. In contrast, a hash function is already defined for the Rectangle class. It simply hashes the coordinates."*

**Dịch:** Cụ thể hơn: xét việc thu thập một set các rectangle. Dùng `TreeSet` thì phải cung cấp một `Comparator<Rectangle>`. **So hai rectangle thế nào? Theo diện tích? Không được** — hai rectangle **khác toạ độ nhưng cùng diện tích** vẫn phải giữ cả hai. **Comparator phải tương thích với `equals`**: phép so sánh **chỉ được trả về 0 khi các element bằng nhau**. Có một sort order như vậy cho rectangle (**thứ tự từ điển trên toạ độ**) nhưng **tính toán rườm rà**. Ngược lại, **hash function đã có sẵn cho class `Rectangle`** — nó đơn giản là **hash các toạ độ**.

> **Caution (sách):** *"If the comparator is not compatible with the equals method of the element type, set equality can give inconsistent results. Here is a typical example:"*
>
> ```java
> var words = new TreeSet<String>(String.CASE_INSENSITIVE_ORDER);
> ```
>
> *"The intent is not to collect elements that only differ in letter case:"*
>
> ```java
> commands.add("QUIT");
> commands.add("quit"); // Not added
> ```
>
> *"However, now equals is no longer symmetric:"*
>
> ```java
> commands.equals(Set.of("quit")) // true
> Set.of("quit").equals(commands) // false
> ```
>
> *"The TreeSet considers two elements equal when the comparator returns zero. But the other set uses String.equals. A better approach is to use the String.compare ordering and only insert lowercase strings into the set."*
>
> **Dịch:** Nếu comparator **không tương thích với `equals`** của kiểu element, **phép so bằng của set có thể cho kết quả mâu thuẫn**. Ý định ở đây là **không thu thập các element chỉ khác nhau ở chữ hoa/chữ thường**. Nhưng giờ **`equals` không còn đối xứng**: `TreeSet` coi hai element bằng nhau **khi comparator trả về 0**, còn set kia dùng **`String.equals`**. Cách tốt hơn: **dùng thứ tự `String.compare` và chỉ chèn chuỗi chữ thường vào set**. (Xem [[05 - Strings]].)

> **Note (sách):** *"The TreeSet class implements the NavigableSet interface. That interface adds several convenient methods for locating adjacent elements. See the API notes for details."*
>
> **Dịch:** Class `TreeSet` **implement interface `NavigableSet`**. Interface đó **bổ sung vài method tiện lợi để định vị các element lân cận**. (Xem [[02 - Interfaces in the Collections Framework]].)

> *"The program in Listing 9.3 builds two tree sets of Item objects. The first one is sorted by part number, the default sort order of Item objects. The second set is sorted by description, using a custom comparator."*

**Dịch:** Chương trình ở Listing 9.3 dựng **hai tree set các object `Item`**. Cái thứ nhất **sắp theo part number** — sort order mặc định của `Item`. Cái thứ hai **sắp theo description**, dùng **comparator tuỳ biến**.

### Listing 9.3 — `treeSet/TreeSetTest.java`

```java
package treeSet;

import java.util.*;

/**
 * This program sorts a set of Item objects by comparing their descriptions.
 * @version 1.2 2024-12-05
 * @author Cay Horstmann
 */
public class TreeSetTest
{
    public static void main(String[] args)
    {
        var parts = new TreeSet<Item>();
        parts.add(new Item("Toaster", 1234));
        parts.add(new Item("Widget", 4562));
        parts.add(new Item("Router", 9912));
        System.out.println(parts);

        var sortByDescription = new TreeSet<Item>(Comparator.comparing(Item::description));

        sortByDescription.addAll(parts);
        System.out.println(sortByDescription);
    }
}
```

### Listing 9.4 — `treeSet/Item.java`

```java
package treeSet;

/**
 * An item with a description and a part number.
 */
public record Item(String description, int partNumber) implements Comparable<Item>
{
    public int compareTo(Item other)
    {
        int diff = Integer.compare(partNumber, other.partNumber);
        return diff != 0 ? diff : description.compareTo(other.description);
    }
}
```

(Về `record`, xem [[07 - Records]].)

## API — `java.util.TreeSet<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `TreeSet()` / `TreeSet(Comparator<? super E> comparator)` | dựng một tree set rỗng. |
| `TreeSet(Collection<? extends E> elements)` / `TreeSet(SortedSet<E> s)` | dựng một tree set và thêm mọi element từ một collection hoặc một sorted set (trường hợp sau **dùng cùng thứ tự**). |

## API — `java.util.SortedSet<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Comparator<? super E> comparator()` | trả về comparator dùng để sắp xếp element, hoặc `null` nếu element được so bằng method `compareTo` của interface `Comparable`. |
| `E first()` / `E last()` | trả về element **nhỏ nhất** hoặc **lớn nhất** trong sorted set. |

## API — `java.util.NavigableSet<E>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `E higher(E value)` / `E lower(E value)` | trả về element **nhỏ nhất > `value`** hoặc **lớn nhất < `value`**, hoặc `null` nếu không có. |
| `E ceiling(E value)` / `E floor(E value)` | trả về element **nhỏ nhất >= `value`** hoặc **lớn nhất <= `value`**, hoặc `null` nếu không có. |
| `E pollFirst()` / `E pollLast()` | xoá và trả về element **nhỏ nhất** hoặc **lớn nhất** trong set này, hoặc `null` nếu set rỗng. |

---

## 9.3.5. Queues and Deques

> *"As we already discussed, a queue lets you efficiently add an element after the last and remove the first element. A double-ended queue, or deque, lets you efficiently add or remove elements at both ends. Adding elements in the middle is not supported. The Deque interface is implemented by the ArrayDeque and LinkedList classes, both of which provide deques whose size grows as needed. In Chapter 10, you will see bounded queues and deques."*

**Dịch:** Một **queue** cho phép **thêm element sau element cuối** và **xoá element đầu** một cách hiệu quả. Một **double-ended queue** (**deque**) cho phép **thêm hoặc xoá element ở cả hai đầu** một cách hiệu quả. **Thêm element ở giữa thì không được hỗ trợ.** Interface **`Deque`** được implement bởi **`ArrayDeque`** và **`LinkedList`**, cả hai đều cung cấp deque có **kích thước lớn lên khi cần**. Chapter 10 sẽ có **bounded queue và deque**.

> *"In Java 21, the methods"*

```java
E getFirst()
E getLast()
void addFirst(E e)
void addLast(E e)
E removeFirst()
E removeLast()
```

> *"were moved from the Deque interface to the SequencedCollection interface, which the List and Set interfaces also extend. This provides uniform methods for accessing the first and last element of a collection."*

**Dịch:** Ở **Java 21**, các method trên **được chuyển từ interface `Deque` sang interface `SequencedCollection`** — interface mà **`List` và `Set` cũng extend**. Điều này tạo ra **bộ method thống nhất để truy cập element đầu và cuối của một collection**.

## API — `java.util.Queue<E>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean add(E e)` / `boolean offer(E e)` | thêm element cho trước **sau element cuối** của queue này và trả về `true`, với điều kiện queue **chưa đầy**. Nếu queue đầy, method thứ nhất **ném `IllegalStateException`**, còn method thứ hai **trả về `false`**. |
| `E remove()` / `E poll()` | xoá và trả về **element đầu tiên** của queue này, với điều kiện queue **không rỗng**. Nếu queue rỗng, method thứ nhất **ném `NoSuchElementException`**, còn method thứ hai **trả về `null`**. |
| `E element()` / `E peek()` | trả về element **ở đầu queue mà không xoá nó**, với điều kiện queue không rỗng. Nếu queue rỗng, method thứ nhất **ném `NoSuchElementException`**, còn method thứ hai **trả về `null`**. |

## API — `java.util.SequencedCollection<E>` (Java 21)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void addFirst(E element)` / `void addLast(E element)` | thêm element cho trước **trước element đầu** hoặc **sau element cuối** của collection này. Nếu collection đầy, ném `IllegalStateException`. |
| `E removeFirst()` / `E removeLast()` | xoá và trả về element **đầu** hoặc **cuối** của collection này, với điều kiện collection không rỗng. Nếu collection rỗng, ném `NoSuchElementException`. |
| `E getFirst()` / `E getLast()` | trả về element **đầu** hoặc **cuối** của collection này **mà không xoá nó**, với điều kiện collection không rỗng. Nếu collection rỗng, ném `NoSuchElementException`. |

## API — `java.util.Deque<E>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean offerFirst(E element)` / `boolean offerLast(E element)` | thêm element cho trước **trước element đầu** hoặc **sau element cuối** của deque này. Nếu deque đầy, **trả về `false`**. |
| `E pollFirst()` / `E pollLast()` | xoá và trả về element **trước element đầu** hoặc **sau element cuối** của deque này, với điều kiện deque không rỗng. Nếu deque rỗng, **trả về `null`**. |
| `E peekFirst()` / `E peekLast()` | trả về element **đầu** hoặc **cuối** của deque này **mà không xoá nó**, với điều kiện deque không rỗng. Nếu deque rỗng, **trả về `null`**. |

## API — `java.util.ArrayDeque<E>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ArrayDeque()` / `ArrayDeque(int initialCapacity)` | dựng một deque **không giới hạn** với initial capacity là **16** hoặc bằng giá trị cho trước. |

---

## 9.3.6. Priority Queues

> *"A priority queue retrieves elements in sorted order after they were inserted in arbitrary order. That is, whenever you call the remove method, you get the smallest element currently in the priority queue. However, the priority queue does not sort all its elements. If you iterate over the elements, they are not necessarily sorted. The priority queue makes use of an elegant and efficient data structure called a heap. A heap is a self-organizing binary tree in which the add and remove operations cause the smallest element to gravitate to the root, without wasting time on sorting all elements."*

**Dịch:** Một **priority queue** **lấy element ra theo thứ tự đã sắp xếp**, dù chúng được **chèn vào theo thứ tự tuỳ ý**. Tức là, mỗi lần gọi `remove`, bạn **nhận được element nhỏ nhất hiện có** trong priority queue. Tuy nhiên, **priority queue không sắp xếp toàn bộ element** — **duyệt element thì chúng không nhất thiết đã sắp xếp**. Priority queue dùng một data structure **thanh lịch và hiệu quả gọi là heap**. Heap là một **binary tree tự tổ chức**, trong đó thao tác `add` và `remove` **khiến element nhỏ nhất trôi dần lên root**, **mà không mất thời gian sắp xếp mọi element**.

```
            [ nhỏ nhất ]        <- root
             /        \
        [    ]        [    ]
        /    \        /    \
     [  ]  [  ]    [  ]  [  ]
```

> *"Just like a TreeSet, a priority queue can either hold elements of a class that implements the Comparable interface or a Comparator object you supply in the constructor."*

**Dịch:** Giống `TreeSet`, priority queue có thể **giữ element của class implement `Comparable`**, hoặc dùng **object `Comparator` bạn cung cấp trong constructor**.

> *"A typical use for a priority queue is job scheduling. Each job has a priority. Jobs are added in random order. Whenever a new job can be started, the highest priority job is removed from the queue. (Since it is traditional for priority 1 to be the "highest" priority, the remove operation yields the minimum element.)"*

**Dịch:** Một ứng dụng điển hình của priority queue là **lập lịch công việc (job scheduling)**. Mỗi job có một **priority**. Job được thêm vào **theo thứ tự ngẫu nhiên**. Khi một job mới có thể bắt đầu, **job có priority cao nhất được lấy khỏi queue**. (Vì theo truyền thống **priority 1 là "cao nhất"**, nên thao tác `remove` **cho ra element nhỏ nhất**.)

> *"Listing 9.5 shows a priority queue in action. Unlike iteration in a TreeSet, the iteration here does not visit the elements in sorted order. However, removal always yields the smallest remaining element."*

**Dịch:** Khác với việc duyệt trong `TreeSet`, **duyệt ở đây không đi theo thứ tự đã sắp xếp**. Nhưng **việc xoá luôn cho ra element nhỏ nhất còn lại**.

### Listing 9.5 — `priorityQueue/PriorityQueueTest.java`

```java
package priorityQueue;

import java.util.*;
import java.time.*;

/**
 * This program demonstrates the use of a priority queue.
 * @version 1.02 2015-06-20
 * @author Cay Horstmann
 */
public class PriorityQueueTest
{
    public static void main(String[] args)
    {
        var pq = new PriorityQueue<LocalDate>();
        pq.add(LocalDate.of(1906, 12, 9));  // G. Hopper
        pq.add(LocalDate.of(1815, 12, 10)); // A. Lovelace
        pq.add(LocalDate.of(1903, 12, 3));  // J. von Neumann
        pq.add(LocalDate.of(1910, 6, 22));  // K. Zuse

        System.out.println("Iterating over elements . . .");
        for (LocalDate date : pq)
            System.out.println(date);
        System.out.println("Removing elements . . .");
        while (!pq.isEmpty())
            System.out.println(pq.remove());
    }
}
```

## API — `java.util.PriorityQueue` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `PriorityQueue()` / `PriorityQueue(int initialCapacity)` | dựng một priority queue để lưu các object `Comparable`. |
| `PriorityQueue(int initialCapacity, Comparator<? super E> c)` | dựng một priority queue và **dùng comparator chỉ định** để sắp xếp element. |

---

## Bài kế tiếp

→ [[04 - Maps]] — data structure lưu cặp key/value: `HashMap`, `TreeMap`, các view của map, `WeakHashMap`, `LinkedHashMap`, `EnumSet`/`EnumMap` và `IdentityHashMap`.
