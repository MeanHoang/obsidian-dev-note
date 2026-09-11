# 06 — Algorithms

> Chapter 9, Section 9.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.6. Algorithms

> *"In addition to implementing collection classes, the Java Collections Framework also provides a number of useful algorithms. In the following sections, you will see how to use these algorithms and how to write your own algorithms that work well with the framework."*

**Dịch:** Ngoài việc implement các collection class, Java Collections Framework còn cung cấp **một số algorithm hữu ích**. Các phần sau chỉ **cách dùng chúng** và **cách tự viết algorithm hoạt động tốt với framework**.

---

## 9.6.1. Why Generic Algorithms?

> *"Generic collection interfaces have a great advantage—you only need to implement your algorithms once. For example, consider a simple algorithm to compute the maximum element in a collection. Traditionally, programmers would implement such an algorithm as a loop. Here is how you can find the largest element of an array:"*

```java
if (a.length == 0) throw new NoSuchElementException();
T largest = a[0];
for (int i = 1; i < a.length; i++)
    if (largest.compareTo(a[i]) < 0)
        largest = a[i];
```

**Dịch:** Generic collection interface có **lợi thế lớn**: bạn **chỉ cần implement algorithm một lần**. Ví dụ, algorithm đơn giản tính **element lớn nhất trong một collection**. Truyền thống thì lập trình viên viết nó thành **một vòng lặp**.

> *"Of course, to find the maximum of an array list, you would write the code slightly differently."*

```java
if (v.size() == 0) throw new NoSuchElementException();
T largest = v.get(0);
for (int i = 1; i < v.size(); i++)
    if (largest.compareTo(v.get(i)) < 0)
        largest = v.get(i);
```

> *"What about a linked list? You don't have efficient random access in a linked list, but you can use an iterator."*

```java
if (l.isEmpty()) throw new NoSuchElementException();
Iterator<T> iter = l.iterator();
T largest = iter.next();
while (iter.hasNext())
{
    T next = iter.next();
    if (largest.compareTo(next) < 0)
        largest = next;
}
```

**Dịch:** Với **array list** thì code viết **hơi khác một chút**. Còn **linked list**? Bạn **không có random access hiệu quả** trong linked list, nhưng **dùng được iterator**.

> *"These loops are tedious to write, and just a bit error-prone. Is there an off-by-one error? Do the loops work correctly for empty containers? For containers with only one element? You don't want to test and debug this code every time, but you also don't want to implement a whole slew of methods, such as these:"*

```java
static <T extends Comparable> T max(ArrayList<T> v)
static <T extends Comparable> T max(LinkedList<T> l)
```

**Dịch:** Những vòng lặp này **viết mệt** và **hơi dễ sai**. **Có lỗi lệch một đơn vị không? Vòng lặp có chạy đúng với container rỗng không? Với container chỉ một element?** Bạn **không muốn test và debug đoạn code này mỗi lần**, nhưng cũng **không muốn implement cả một mớ method** kiểu trên.

> *"That's where the collection interfaces come in. Think of the minimal collection interface that you need to efficiently carry out the algorithm. Random access with get and set comes higher in the food chain than simple iteration. As you have seen in the computation of the maximum element in a linked list, random access is not required for this task. Computing the maximum can be done simply by iterating through the elements. Therefore, you can implement the max method to take any object that implements the Collection interface."*

```java
public static <T extends Comparable> T max(Collection<T> elements)
{
    if (elements.isEmpty()) throw new NoSuchElementException();
    Iterator<T> iter = elements.iterator();
    T largest = iter.next();
    while (iter.hasNext())
    {
        T next = iter.next();
        if (largest.compareTo(next) < 0)
            largest = next;
    }
    return largest;
}
```

**Dịch:** Đó là chỗ **collection interface phát huy tác dụng**. Hãy nghĩ tới **interface collection tối thiểu mà bạn cần** để thực hiện algorithm một cách hiệu quả. **Random access bằng `get` và `set` đứng cao hơn trong chuỗi thức ăn so với việc duyệt đơn giản.** Như đã thấy khi tính element lớn nhất trong linked list, **task này không cần random access** — chỉ cần **duyệt qua các element**. Vì thế bạn implement được `max` sao cho nó **nhận mọi object implement interface `Collection`**.

> *"Of course, since arrays are not collections, you need to write a separate method for arrays:"*

```java
static <T extends Comparable> T max(T[] a)
```

**Dịch:** Dĩ nhiên, vì [[09 - Arrays|array]] **không phải collection**, bạn **phải viết một method riêng cho array**.

> *"Generic algorithms are a powerful concept. In fact, the standard C++ library has dozens of useful algorithms, each operating on a generic collection. The Java Collections Framework is not quite so rich, but the Collections and Arrays classes provide the basics: sorting, binary search, and some simple utility algorithms."*

**Dịch:** **Generic algorithm là một khái niệm mạnh.** Thư viện chuẩn của C++ có **hàng chục algorithm hữu ích**, mỗi cái chạy trên một generic collection. Java Collections Framework **không phong phú bằng**, nhưng class **`Collections`** và **`Arrays`** cung cấp **những thứ cơ bản**: **sorting**, **binary search**, và **một số utility algorithm đơn giản**.

> **Note (sách):** *"Some useful algorithms are missing from the Java Collections Framework, but you can find them in the streams library that is covered in Volume II. For example, to find the maximum or minimum, turn a collection or array into a stream:"*
>
> ```java
> largest = coll.stream().max(Comparator.naturalOrder()).get();
> ```
>
> **Dịch:** Một số algorithm hữu ích **thiếu vắng trong framework**, nhưng bạn tìm thấy chúng trong **thư viện stream** (Volume II). Ví dụ, để tìm max hoặc min, **biến một collection hoặc array thành stream**.

---

## 9.6.2. Sorting and Shuffling

> *"Computer old-timers will sometimes reminisce about how they had to use punched cards and to actually program, by hand, algorithms for sorting. Nowadays, of course, sorting algorithms are part of the standard library for most programming languages, and the Java programming language is no exception."*

**Dịch:** Dân máy tính kỳ cựu đôi khi hoài niệm chuyện phải **dùng phiếu đục lỗ** và **tự tay lập trình algorithm sắp xếp**. Ngày nay, algorithm sắp xếp **là một phần của thư viện chuẩn** ở hầu hết ngôn ngữ, và Java **không ngoại lệ**.

> *"The sort method in the Collections class sorts a collection that implements the List interface."*

```java
var staff = new ArrayList<String>();
fill collection
Collections.sort(staff);
```

**Dịch:** Method **`sort`** trong class `Collections` sắp xếp một collection **implement interface `List`**.

> *"This method assumes that the list elements implement the Comparable interface. If you want to sort the list in some other way, you can use the sort method of the List interface and pass a Comparator object. Here is how you can sort a list of employees by salary:"*

```java
Collections.sort(staff, Comparator.comparingDouble(Employee::getSalary));
```

**Dịch:** Method này **giả định element của list implement interface `Comparable`**. Muốn sắp theo cách khác, dùng **method `sort` của interface `List`** và **truyền vào một object `Comparator`**.

> *"If you want to sort a list in descending order, use the static convenience method Comparator.reverseOrder(). It returns a comparator that returns b.compareTo(a). For example,"*

```java
Collections.sort(staff, Comparator.reverseOrder());
```

> *"sorts the elements in the list staff in reverse order, according to the ordering given by the compareTo method of the element type. Similarly,"*

```java
Collections.sort(staff, Comparator.comparingDouble(Employee::getSalary).reversed());
```

> *"sorts by descending salary."*

**Dịch:** Muốn sắp **giảm dần**, dùng static method tiện lợi **`Comparator.reverseOrder()`** — nó trả về comparator **trả về `b.compareTo(a)`**.

> *"You may wonder how the sort method sorts a list. Typically, when you look at a sorting algorithm in a book on algorithms, it is presented for arrays and uses random element access. However, random access in a linked list is inefficient. You can actually sort linked lists efficiently by using a form of merge sort. However, the implementation in the Java programming language does not do that. It simply dumps all elements into an array, sorts the array, and then copies the sorted sequence back into the list."*

**Dịch:** Có thể bạn thắc mắc **`sort` sắp xếp một list bằng cách nào**. Trong sách thuật toán, algorithm sắp xếp thường **trình bày cho array** và **dùng random access**. Nhưng **random access trong linked list thì không hiệu quả**. Thực ra **sắp xếp linked list hiệu quả được bằng một dạng merge sort** — nhưng **implementation trong Java không làm vậy**: nó đơn giản **đổ hết element vào một array, sắp xếp array, rồi chép dãy đã sắp xếp trở lại list**.

> *"The sort algorithm used in the Java Collections Framework is a bit slower than QuickSort, the traditional choice for a general-purpose sorting algorithm. However, it has one major advantage: It is stable, that is, it doesn't switch equal elements. Why do you care about the order of equal elements? Here is a common scenario. Suppose you have an employee list that you already sorted by name. Now you sort by salary. What happens to employees with equal salary? With a stable sort, the ordering by name is preserved. In other words, the outcome is a list that is sorted first by salary, then by name."*

**Dịch:** Algorithm sắp xếp mà framework dùng **chậm hơn QuickSort một chút** — QuickSort là lựa chọn truyền thống cho sắp xếp đa dụng. Nhưng nó có **một lợi thế lớn: nó ổn định (stable)**, tức là **không hoán đổi các element bằng nhau**. Vì sao thứ tự của element bằng nhau lại quan trọng? Kịch bản phổ biến: bạn có **danh sách nhân viên đã sắp theo tên**, giờ **sắp theo lương**. Với **stable sort**, **thứ tự theo tên được giữ nguyên** — kết quả là danh sách **sắp theo lương trước, rồi theo tên**.

> *"Collections need not implement all of their "optional" methods, so all methods with collection parameters must describe when it is safe to pass a collection to an algorithm. For example, you clearly cannot pass an unmodifiableList list to the sort algorithm. What kind of list can you pass? According to the documentation, the list must be modifiable but need not be resizable."*

> *"The terms are defined as follows:"*
> - *"A list is modifiable if it supports the set method."*
> - *"A list is resizable if it supports the add and remove operations."*

**Dịch:** Collection **không bắt buộc implement mọi method "optional"** của chúng, nên mọi method có parameter là collection **phải mô tả khi nào truyền một collection vào algorithm là an toàn**. Rõ ràng bạn **không truyền được một list `unmodifiableList` vào algorithm `sort`** (xem [[05 - Copies and Views]]). Theo tài liệu, list phải **modifiable** nhưng **không cần resizable**:
- List là **modifiable** nếu **hỗ trợ method `set`**.
- List là **resizable** nếu **hỗ trợ thao tác `add` và `remove`**.

> **Note (sách):** *"In Chapter 6, you have seen the Arrays.sort method. There are two versions, one for sorting an array of Comparable instances, and another with a comparator:"*
>
> ```java
> String[] staff = . . .;
> Arrays.sort(staff);
> Arrays.sort(staff, Comparator.comparingDouble(Employee::getSalary));
> ```
>
> **Dịch:** Ở Chapter 6 bạn đã thấy method **`Arrays.sort`**. Có **hai phiên bản**: một để **sắp xếp array các instance `Comparable`**, một **nhận comparator**.

### Shuffle

> *"The Collections class has an algorithm shuffle that does the opposite of sorting—it randomly permutes the order of the elements in a list. For example:"*

```java
ArrayList<Card> cards = . . .;
Collections.shuffle(cards, RandomGenerator.getDefault());
```

**Dịch:** Class `Collections` có algorithm **`shuffle`** làm **điều ngược với sắp xếp**: nó **hoán vị ngẫu nhiên thứ tự các element trong một list**.

> *"If you supply a list that does not implement the RandomAccess interface, the shuffle method copies the elements into an array, shuffles the array, and copies the shuffled elements back into the list."*

**Dịch:** Nếu bạn truyền vào một list **không implement interface `RandomAccess`**, `shuffle` sẽ **chép element vào một array, xáo trộn array, rồi chép các element đã xáo trở lại list**.

> *"The program in Listing 9.7 fills an array list with 49 Integer objects containing the numbers 1 through 49. It then randomly shuffles the list and selects the first six values from the shuffled list. Finally, it sorts the selected values and prints them."*

**Dịch:** Chương trình ở Listing 9.7 **đổ đầy một array list bằng 49 object `Integer`** chứa số **1 tới 49**, rồi **xáo trộn ngẫu nhiên** và **chọn sáu giá trị đầu**, cuối cùng **sắp xếp và in ra**.

### Listing 9.7 — `shuffle/ShuffleTest.java`

```java
package shuffle;

import java.util.*;
import java.util.random.*;

/**
 * This program demonstrates the random shuffle and sort algorithms.
 * @version 1.13 2023-09-30
 * @author Cay Horstmann
 */
public class ShuffleTest
{
    public static void main(String[] args)
    {
        var numbers = new ArrayList<Integer>();
        for (int i = 1; i <= 49; i++)
            numbers.add(i);
        Collections.shuffle(numbers, RandomGenerator.getDefault());
        List<Integer> winningCombination = numbers.subList(0, 6);
        Collections.sort(winningCombination);
        System.out.println(winningCombination);
    }
}
```

## API — `java.util.Collections` (Java 1.2) — sort/shuffle

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T extends Comparable<? super T>> void sort(List<T> elements)` | sắp xếp các element trong list bằng một **algorithm sắp xếp ổn định**. Algorithm được **bảo đảm chạy trong thời gian O(n log n)**, với n là độ dài list. |
| `static void shuffle(List<?> elements)` / `shuffle(List<?> elements, Random r)` / `shuffle(List<?> elements, RandomGenerator r)` **(21)** | **xáo trộn ngẫu nhiên** các element trong list. Algorithm này chạy trong thời gian **O(n a(n))**, với n là độ dài list và **a(n) là thời gian trung bình để truy cập một element**. |

## API — `java.util.List<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `default void sort(Comparator<? super T> comparator)` **(8)** | sắp xếp list này **bằng comparator cho trước**. |

## API — `java.util.Comparator<T>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T extends Comparable<? super T>> Comparator<T> reverseOrder()` **(8)** | tạo ra comparator **đảo ngược thứ tự do interface `Comparable` cung cấp**. |
| `default Comparator<T> reversed()` **(8)** | tạo ra comparator **đảo ngược thứ tự do chính comparator này cung cấp**. |

---

## 9.6.3. Binary Search

> *"To find an object in an array, you normally visit all elements until you find a match. However, if the array is sorted, you can look at the middle element and check whether it is larger than the element that you are trying to find. If so, keep looking in the first half of the array; otherwise, look in the second half. That cuts the problem in half, and you keep going in the same way. For example, if the array has 1024 elements, you will locate the match (or confirm that there is none) after 10 steps, whereas a linear search would have taken you an average of 512 steps if the element is present, and 1024 steps to confirm that it is not."*

**Dịch:** Để tìm một object trong array, bình thường bạn **duyệt hết element cho tới khi khớp**. Nhưng nếu **array đã được sắp xếp**, bạn **nhìn element ở giữa** và xem nó **có lớn hơn element cần tìm không**. Nếu có thì **tìm tiếp ở nửa đầu**, nếu không thì **tìm ở nửa sau**. Cách đó **cắt đôi bài toán**, và cứ thế tiếp tục. Ví dụ, array có **1024 element** thì bạn **định vị được kết quả (hoặc xác nhận không có) sau 10 bước**, trong khi **linear search trung bình mất 512 bước** nếu element có mặt, và **1024 bước để xác nhận là không có**.

> *"The binarySearch of the Collections class implements this algorithm. Note that the collection must already be sorted, or the algorithm will return the wrong answer. Supply the collection (which must implement the List interface) and the target to be located. If the collection is not sorted by the compareTo element of the Comparable interface, supply a comparator object as well."*

```java
i = Collections.binarySearch(elements, target);
i = Collections.binarySearch(elements, target, comparator);
```

**Dịch:** Method **`binarySearch`** của class `Collections` implement algorithm này. Lưu ý **collection phải đã được sắp xếp**, nếu không **algorithm sẽ trả về kết quả sai**. Truyền vào collection (**phải implement `List`**) và **target cần định vị**. Nếu collection **không được sắp theo `compareTo` của `Comparable`**, **truyền thêm một object comparator**.

> *"A non-negative return value from the binarySearch method denotes the index of the matching object. That is, elements.get(i) is equal to target under the comparison order. If the value is negative, then there is no matching element. However, you can use the return value to compute the location where you should insert target into the collection to keep it sorted. The insertion location is"*

```java
insertionPoint = -i - 1;
```

> *"It isn't simply -i because then the value of 0 would be ambiguous. In other words, the operation"*

```java
if (i < 0)
    elements.add(-i - 1, target);
```

> *"adds the target in the correct place."*

**Dịch:** Giá trị trả về **không âm** là **index của object khớp** — tức `elements.get(i)` **bằng `target`** theo thứ tự so sánh. Nếu giá trị **âm** thì **không có element khớp**. Nhưng bạn **dùng giá trị trả về để tính vị trí nên chèn `target`** vào collection **để nó vẫn sắp xếp**. Vị trí chèn là **`-i - 1`**. **Không đơn giản là `-i`**, vì khi đó **giá trị 0 sẽ nhập nhằng**.

> *"To be worthwhile, binary search requires random access. If you have to iterate one by one through half of a linked list to find the middle element, you have lost the advantage of the binary search. The binarySearch algorithm reverts to an iterative algorithm of the same efficiency as linear search if you give it a list that does not implement the RandomAccess interface."*

**Dịch:** Để **đáng đồng tiền**, binary search **cần random access**. Nếu phải **duyệt từng element qua nửa linked list** chỉ để tìm element giữa thì bạn **đã mất hết lợi thế của binary search**. Algorithm `binarySearch` **quay về một algorithm lặp có hiệu quả ngang linear search** nếu bạn đưa cho nó **một list không implement interface `RandomAccess`**.

> *"The Arrays class has binary search implementations for arrays of primitive types and objects."*

**Dịch:** Class **`Arrays`** có implementation binary search cho **array kiểu primitive và array object**.

## API — `java.util.Collections` (Java 1.2) — binary search

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T extends Comparable<? super T>> int binarySearch(List<T> elements, T key)` / `static <T> int binarySearch(List<T> elements, T key, Comparator<? super T> c)` | tìm một key trong một list đã sắp xếp, **dùng binary search nếu kiểu element implement interface `RandomAccess`**, và **linear search trong mọi trường hợp khác**. Các method này được **bảo đảm chạy trong thời gian O(a(n) log n)**, với n là độ dài list và a(n) là thời gian trung bình để truy cập một element. Chúng trả về **index của key trong list**, hoặc **một giá trị âm `i`** nếu key không có trong list — khi đó key **nên được chèn ở index `-i - 1`** để list vẫn sắp xếp. |

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static int binarySearch(T[] a, T key)` / `static int binarySearch(T[] a, int start, int end, T key)` **(6)** | dùng algorithm binary search để tìm `key` trong array `a` **đã được sắp xếp**. Nếu tìm thấy thì **trả về index**. Ngược lại trả về **một giá trị âm `r`**; **`–r – 1` là chỗ nên chèn `key`** để `a` vẫn sắp xếp. Kiểu thành phần `T` của array có thể là `Object`, `int`, `long`, `short`, `char`, `byte`, `boolean`, `float`, hoặc `double`. |
| `static <T> T binarySearch(T[] a, T key, Comparator<? super T> c)` / `static <T> T binarySearch(T[] a, int start, int end, T key, Comparator<? super T> c)` **(6)** | dùng algorithm binary search để tìm `key` trong array `a` **đã được sắp xếp bằng comparator cho trước**. |

---

## 9.6.4. Simple Algorithms

> *"The Collections class contains several simple but useful algorithms. Among them is the example from the beginning of this section—finding the maximum value of a collection. Others include copying elements from one list to another, filling a container with a constant value, and reversing a list."*

**Dịch:** Class `Collections` chứa **vài algorithm đơn giản mà hữu ích**. Trong đó có ví dụ ở đầu section — **tìm giá trị lớn nhất của một collection**. Những cái khác gồm **chép element từ list này sang list khác**, **đổ đầy container bằng một giá trị hằng**, và **đảo ngược một list**.

> *"Why supply such simple algorithms in the framework? Surely most programmers could easily implement them with simple loops. I like the algorithms because they make life easier for the programmer reading the code. When you read a loop that was implemented by someone else, you have to decipher the original programmer's intentions. For example, look at this loop:"*

```java
for (int i = 0; i < words.size(); i++)
    if (words.get(i).equals("C++")) words.set(i, "Java");
```

> *"Now compare the loop with the call"*

```java
Collections.replaceAll(words, "C++", "Java");
```

> *"When you see the method call, you know right away what the code does."*

**Dịch:** Sao lại cung cấp những algorithm đơn giản như vậy trong framework? Chắc chắn hầu hết lập trình viên **tự viết được bằng vòng lặp đơn giản**. Tác giả thích chúng vì chúng **làm cuộc sống của người ĐỌC code dễ hơn**. Khi đọc một vòng lặp do người khác viết, bạn **phải giải mã ý định của lập trình viên gốc**. Còn khi **nhìn thấy lời gọi method, bạn biết ngay đoạn code làm gì**.

> *"The default methods Collection.removeIf and List.replaceAll are just a bit more complex. You provide a lambda expression to test or transform elements. For example, here we remove all short words and change the remaining ones to lowercase:"*

```java
words.removeIf(w -> w.length() <= 3);
words.replaceAll(String::toLowerCase);
```

**Dịch:** Các default method **`Collection.removeIf`** và **`List.replaceAll`** thì **phức tạp hơn một chút**: bạn cung cấp một [[02 - Lambda Expressions|lambda expression]] để **test hoặc biến đổi element**.

> **Caution (sách):** *"The predicate of removeIf should only look at the element whose removal is being decided, and not at the collection. If you do the latter, the behavior is implementation-dependent."*
>
> *"The ArrayList version of removeIf method makes two passes over the elements. It first finds the elements that should be removed, and then it removes all of them. With other collections, matching elements are removed as soon as they are found."*
>
> *"This makes a difference if the predicate reads the collection. Consider this example, where words is an ArrayList of length 3:"*
>
> ```java
> var words = new ArrayList<String>(List.of("Ada", "C++", "Java"))
> words.removeIf(w -> w.length() == words.size()); // Now words is ["Java"]
> ```
>
> *"In the first pass, all words of length 3 are marked for removal, and in the second pass, they are removed."*
>
> *"However, if words is a LinkedList or a HashSet, then the same call to removeIf only removes one of the three-letter words. After the first removal, the predicate tests whether the collection has size 2."*
>
> *"Why the difference? A naïve one-pass implementation would have been inefficient for array-backed collections. It didn't immediately occur to the developers that there is an efficient one-pass algorithm. By the time they thought of it, they decided not to use it for compatibility's sake—see https://bugs.openjdk.org/browse/JDK-8143577."*
>
> **Dịch:** Predicate của `removeIf` **chỉ nên nhìn vào element đang được xét xoá**, **không nhìn vào collection**. Nếu làm điều sau, **hành vi phụ thuộc implementation**. Bản `removeIf` của **`ArrayList` duyệt element hai lượt**: **trước tìm element cần xoá**, **sau xoá hết chúng**. Với **collection khác**, **element khớp bị xoá ngay khi được tìm thấy**. Điều đó **tạo khác biệt nếu predicate đọc collection**: ở ví dụ trên, **lượt đầu đánh dấu mọi từ dài 3 để xoá**, **lượt sau xoá chúng**. Nhưng nếu `words` là **`LinkedList` hoặc `HashSet`** thì **cùng lời gọi đó chỉ xoá một trong các từ ba chữ cái** — vì sau lần xoá đầu, **predicate kiểm tra xem collection có size 2 hay không**. Vì sao khác nhau? **Một implementation một lượt ngây thơ sẽ kém hiệu quả với collection dựa trên array.** Các developer **không nghĩ ra ngay** là có algorithm một lượt hiệu quả; **tới lúc nghĩ ra thì họ quyết định không dùng, vì lý do tương thích**.

## API — `java.util.Collections` (Java 1.2) — simple algorithms

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T extends Comparable<? super T>> T min(Collection<T> elements)` / `max(Collection<T> elements)` / `min(Collection<T> elements, Comparator<? super T> c)` / `max(Collection<T> elements, Comparator<? super T> c)` | trả về element **nhỏ nhất** hoặc **lớn nhất** trong collection. (Các ràng buộc parameter được **đơn giản hoá cho dễ hiểu**.) |
| `static <T> void copy(List<? super T> to, List<T> from)` | chép **mọi element từ list nguồn sang đúng vị trí tương ứng trong list đích**. **List đích phải dài ít nhất bằng list nguồn.** |
| `static <T> void fill(List<? super T> l, T value)` | đặt **mọi vị trí của list về cùng một giá trị**. |
| `static <T> boolean addAll(Collection<? super T> c, T... values)` **(5.0)** | thêm mọi giá trị vào collection cho trước và **trả về `true` nếu collection thay đổi** do lời gọi này. |
| `static <T> boolean replaceAll(List<T> l, T oldValue, T newValue)` **(1.4)** | thay **mọi element bằng `oldValue`** bằng `newValue`. |
| `static int indexOfSubList(List<?> l, List<?> s)` / `lastIndexOfSubList(List<?> l, List<?> s)` **(1.4)** | trả về index của **sublist đầu tiên** hoặc **cuối cùng** của `l` bằng `s`, hoặc `-1` nếu không sublist nào của `l` bằng `s`. Ví dụ, `l` là `[s, t, a, r]` và `s` là `[t, a, r]` thì **cả hai method trả về index 1**. |
| `static void swap(List<?> l, int i, int j)` **(1.4)** | **hoán đổi** các element ở hai offset cho trước. |
| `static void reverse(List<?> l)` | **đảo ngược thứ tự** các element trong list. Ví dụ, đảo list `[t, a, r]` cho ra `[r, a, t]`. Method chạy trong **thời gian O(n)**. |
| `static void rotate(List<?> l, int d)` **(1.4)** | **xoay** các element trong list, đưa entry có index `i` về vị trí **`(i + d) % l.size()`**. Ví dụ, xoay list `[t, a, r]` đi 2 cho ra `[a, r, t]`. Method chạy trong **thời gian O(n)**. |
| `static int frequency(Collection<?> c, Object o)` **(5.0)** | trả về **số element trong `c` bằng object `o`**. |
| `boolean disjoint(Collection<?> c1, Collection<?> c2)` **(5.0)** | trả về `true` nếu **hai collection không có element nào chung**. |

## API — `java.util.Collection<T>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `default boolean removeIf(Predicate<? super E> filter)` **(8)** | **xoá mọi element khớp**. |

## API — `java.util.List<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `default void replaceAll(UnaryOperator<E> op)` **(8)** | **áp dụng thao tác lên mọi element** của list này. |

---

## 9.6.5. Bulk Operations

> *"There are several operations that copy or remove elements "in bulk." The call `coll1.removeAll(coll2);` removes all elements from coll1 that are present in coll2. Conversely, `coll1.retainAll(coll2);` removes all elements from coll1 that are not present in coll2. Here is a typical application."*

**Dịch:** Có vài thao tác **chép hoặc xoá element "hàng loạt"**. Lời gọi `coll1.removeAll(coll2)` **xoá khỏi `coll1` mọi element có trong `coll2`**. Ngược lại, `coll1.retainAll(coll2)` **xoá khỏi `coll1` mọi element KHÔNG có trong `coll2`**.

> *"Suppose you want to find the intersection of two sets—the elements that two sets have in common. First, make a new set to hold the result."*

```java
var result = new HashSet<String>(firstSet);
```

> *"Here, we use the fact that every collection has a constructor whose parameter is another collection that holds the initialization values."*

> *"Now, use the retainAll method:"*

```java
result.retainAll(secondSet);
```

> *"It retains all elements that occur in both sets. You have formed the intersection without programming a loop."*

**Dịch:** Giả sử bạn muốn tìm **giao của hai set** — các element **hai set cùng có**. Trước hết tạo một set mới để chứa kết quả; ở đây ta tận dụng việc **mọi collection đều có một constructor nhận parameter là một collection khác chứa giá trị khởi tạo**. Rồi dùng **`retainAll`** — nó **giữ lại mọi element xuất hiện ở cả hai set**. Vậy là bạn **tạo được giao mà không phải viết vòng lặp nào**.

> *"You can carry this idea further and apply a bulk operation to a view. For example, suppose you have a map that maps employee IDs to employee objects, and you have a set of the IDs of all employees that are to be terminated."*

```java
Map<String, Employee> staffMap = . . .;
Set<String> terminatedIDs = . . .;
```

> *"Simply form the key set and remove all IDs of terminated employees."*

```java
staffMap.keySet().removeAll(terminatedIDs);
```

> *"Since the key set is a view into the map, the keys and associated employee names are automatically removed from the map."*

**Dịch:** Bạn **đẩy ý tưởng này xa hơn** bằng cách **áp dụng bulk operation lên một view**. Vì **key set là một view vào map**, các key **và tên nhân viên gắn với chúng tự động bị xoá khỏi map**.

> *"By using a subrange view, you can restrict bulk operations to sublists and subsets. For example, suppose you want to add the first ten elements of a list to another container. Form a sublist to pick out the first ten:"*

```java
relocated.addAll(staff.subList(0, 10));
```

> *"The subrange can also be a target of a mutating operation."*

```java
staff.subList(0, 10).clear();
```

**Dịch:** Dùng **subrange view**, bạn **giới hạn được bulk operation vào sublist và subset**. Subrange **cũng làm được đích của một thao tác thay đổi**.

---

## 9.6.6. Converting between Collections and Arrays

> *"Large portions of the Java API were designed before the Java Collections Framework was created. As a result, you will occasionally need to translate between traditional arrays and the more modern collections."*

**Dịch:** **Phần lớn Java API được thiết kế trước khi framework ra đời.** Vì thế thỉnh thoảng bạn **cần chuyển đổi giữa array truyền thống và collection hiện đại hơn**.

> *"If you have an array that you need to turn into a collection, the List.of method serves this purpose. For example:"*

```java
String[] names = . . .;
List<String> staff = List.of(names);
```

**Dịch:** Có một array cần biến thành collection thì **method `List.of` phục vụ đúng mục đích đó**.

> *"Obtaining an array from a collection is a bit trickier. You can use the toArray method:"*

```java
Object[] names = staff.toArray();
```

> *"But the result is an array of objects. Even if you know that your collection contained objects of a specific type, you cannot use a cast:"*

```java
String[] names = (String[]) staff.toArray(); // ERROR
```

**Dịch:** **Lấy một array từ một collection thì rắc rối hơn.** Bạn dùng được **`toArray`**, nhưng **kết quả là một array các `Object`**. Kể cả khi bạn biết collection chứa object thuộc một kiểu cụ thể, **bạn vẫn không cast được**.

> *"The array returned by the toArray method was created as an Object[] array, and you cannot change its type. Instead, pass an array constructor expression to the toArray method. The constructor is used to create an array of the correct type:"*

```java
String[] values = staff.toArray(String[]::new);
```

**Dịch:** Array mà `toArray` trả về **được tạo ra như một array `Object[]`**, và **bạn không đổi được kiểu của nó**. Thay vào đó, **truyền một array constructor expression vào `toArray`** — constructor đó được dùng để **tạo array đúng kiểu**.

> **Note (sách):** *"Prior to JDK 11, you had to use another form of the toArray method, passing an array of the correct type:"*
>
> ```java
> String[] values = staff.toArray(new String[0]);
> ```
>
> *"This toArray method constructs another array of the same type. Or, if the array has sufficient length, it is reused:"*
>
> ```java
> staff.toArray(new String[staff.size()]);
> ```
>
> *"In this case, no new array is created."*
>
> **Dịch:** **Trước JDK 11**, bạn phải dùng **một dạng khác của `toArray`**: **truyền vào một array đúng kiểu**. Method `toArray` này **dựng một array khác cùng kiểu**. Hoặc, **nếu array đã đủ dài thì nó được tái sử dụng** — khi đó **không có array mới nào được tạo ra**.

---

## 9.6.7. Writing Your Own Algorithms

> *"If you write your own algorithm (or, in fact, any method that has a collection as a parameter), you should work with interfaces, not concrete implementations, whenever possible. For example, suppose you want to process items. Of course, you can implement a method like this:"*

```java
public void processItems(ArrayList<Item> items)
{
    for (Item item : items)
        do something with item
}
```

**Dịch:** Nếu bạn tự viết algorithm (hay thực ra là **bất kỳ method nào có collection làm parameter**), bạn nên **làm việc với interface chứ không phải concrete implementation**, bất cứ khi nào có thể.

> *"However, you now constrained the caller of your method—the caller must supply the items in an ArrayList. If the items happen to be in another collection, they first need to be repackaged. It is much better to accept a more general collection."*

**Dịch:** Cách viết trên **trói buộc người gọi method** — họ **phải cung cấp item trong một `ArrayList`**. Nếu item nằm ở collection khác thì **phải đóng gói lại trước**. **Tốt hơn nhiều là nhận một collection tổng quát hơn.**

> *"You should ask yourself this: What is the most general collection interface that can do the job? Do you care about the order? Then you should accept a List. But if the order doesn't matter, you can accept collections of any kind:"*

```java
public void processItems(Collection<Item> items)
{
    for (Item item : items)
        do something with item
}
```

> *"Now, anyone can call this method with an ArrayList or a LinkedList, or even with an array wrapped in a call to the List.of method."*

**Dịch:** Hãy tự hỏi: **interface collection tổng quát nhất có thể làm được việc này là gì?** **Có quan tâm thứ tự không?** Nếu có thì **nhận một `List`**. Nếu **thứ tự không quan trọng** thì **nhận collection loại nào cũng được**.

> **Tip (sách):** *"In this case, you can do even better by accepting an Iterable\<Item>. The Iterable interface has a single abstract method iterator which the enhanced for loop uses behind the scenes. The Collection interface extends Iterable."*
>
> **Dịch:** Trong trường hợp này bạn còn **làm tốt hơn được nữa** bằng cách **nhận một `Iterable<Item>`**. Interface `Iterable` có **đúng một abstract method `iterator`** — thứ mà **vòng for mở rộng dùng ở hậu trường**. Interface **`Collection` extends `Iterable`** (xem [[01 - The Java Collections Framework]]).

> *"Conversely, if your method returns multiple elements, you don't want to constrain yourself against future improvements. For example, consider"*

```java
public ArrayList<Item> lookupItems(. . .)
{
    var result = new ArrayList<Item>();
    . . .
    return result;
}
```

> *"This method promises to return an ArrayList, even though the caller almost certainly doesn't care what kind of lists it is. If instead you return a List, you can at any time add a branch that returns an empty or singleton list by calling List.of."*

**Dịch:** Ngược lại, nếu method của bạn **trả về nhiều element**, bạn **không nên tự trói mình trước những cải tiến tương lai**. Method trên **hứa trả về một `ArrayList`**, dù người gọi **gần như chắc chắn không quan tâm đó là loại list nào**. Nếu **trả về `List`** thì **bất cứ lúc nào bạn cũng thêm được một nhánh trả về list rỗng hoặc list một phần tử bằng cách gọi `List.of`**.

> **Note (sách):** *"If it is such a good idea to use collection interfaces as parameter and return type, why doesn't the Java API follow this rule consistently? For example, the JComboBox class has two constructors:"*
>
> ```java
> JComboBox(Object[] items)
> JComboBox(Vector<?> items)
> ```
>
> *"The reason is simply timing. The Swing API was created before the Java Collections Framework."*
>
> **Dịch:** Nếu dùng collection interface làm kiểu parameter và kiểu trả về là ý hay như vậy, **sao Java API không tuân theo quy tắc này một cách nhất quán**? Ví dụ, class `JComboBox` có hai constructor như trên. **Lý do đơn giản là thời điểm**: **Swing API được tạo ra trước Java Collections Framework**.

---

## Bài kế tiếp

→ [[07 - Legacy Collections]] — các container class "di sản" có từ bản Java đầu tiên: `Hashtable`, `Enumeration`, `Properties`, `Stack`, `BitSet`.
