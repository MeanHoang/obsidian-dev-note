# 06 — Thread-Safe Collections

> Chapter 10, Section 10.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.6. Thread-Safe Collections

> *"If multiple threads concurrently modify a data structure, such as a hash table, it is easy to damage that data structure. (See Chapter 9 for more information on hash tables.) For example, one thread may begin to insert a new element. Suppose it is preempted in the middle of rerouting the links between the hash table's buckets. If another thread starts traversing the same list, it may follow invalid links and create havoc, perhaps throwing exceptions or getting trapped in an infinite loop."*

**Dịch:** Nếu **nhiều thread đồng thời sửa một cấu trúc dữ liệu** như [[04 - Maps|hash table]], **rất dễ làm hỏng cấu trúc đó**. Ví dụ, một thread **bắt đầu chèn phần tử mới** rồi **bị preempt giữa lúc định tuyến lại các link giữa các bucket của hash table**. Nếu **thread khác bắt đầu duyệt cùng list đó**, nó **có thể đi theo link không hợp lệ và gây hỗn loạn** — có thể **ném exception hoặc mắc kẹt trong vòng lặp vô hạn**.

> *"You can protect a shared data structure by supplying a lock, but it is usually easier to choose a thread-safe implementation instead. In the following sections, we discuss the thread-safe collections that the Java library provides."*

**Dịch:** Bạn **bảo vệ được cấu trúc dữ liệu chia sẻ bằng cách cấp một lock**, nhưng thường **chọn một implementation thread-safe thì dễ hơn**. Các phần sau bàn về **các thread-safe collection mà Java library cung cấp**.

---

## 10.6.1. Blocking Queues

> *"Many threading problems can be formulated elegantly and safely by using one or more queues. Producer threads insert items into the queue, and consumer threads retrieve them. The queue lets you safely hand over data from one thread to another. For example, consider our bank transfer program. Instead of accessing the bank object directly, the transfer threads insert transfer instruction objects into a queue. Another thread removes the instructions from the queue and carries out the transfers. Only that thread has access to the internals of the bank object. No synchronization is necessary. (Of course, the implementors of the thread-safe queue classes had to worry about locks and conditions, but that was their problem, not yours.)"*

**Dịch:** Nhiều bài toán threading **có thể được phát biểu thanh lịch và an toàn bằng một hay nhiều queue**. **Producer thread chèn item vào queue, consumer thread lấy chúng ra.** Queue cho phép bạn **chuyển giao dữ liệu an toàn từ thread này sang thread khác**. Ví dụ, với chương trình chuyển tiền ngân hàng: thay vì truy cập object bank trực tiếp, **các transfer thread chèn object lệnh chuyển tiền vào một queue**. **Một thread khác lấy lệnh khỏi queue và thực hiện chuyển tiền.** **Chỉ thread đó truy cập phần nội bộ của object bank. Không cần synchronization gì cả.** (Dĩ nhiên **người implement class queue thread-safe đã phải lo về lock và condition, nhưng đó là vấn đề của họ chứ không phải của bạn.**)

> *"A blocking queue causes a thread to block when you try to add an element when the queue is currently full or to remove an element when the queue is empty. Blocking queues are a useful tool for coordinating the work of multiple threads. Worker threads can periodically deposit intermediate results into a blocking queue. Other worker threads remove the intermediate results and modify them further. The queue automatically balances the workload. If the first set of threads runs slower than the second, the second set blocks while waiting for the results. If the first set of threads runs faster, the queue fills up until the second set catches up. Table 10.2 shows the methods for blocking queues."*

**Dịch:** **Blocking queue khiến một thread block khi bạn thử thêm phần tử lúc queue đang đầy, hoặc gỡ phần tử lúc queue đang rỗng.** Blocking queue là **công cụ hữu ích để điều phối công việc của nhiều thread**. Worker thread **định kỳ gửi kết quả trung gian vào blocking queue**; các worker thread khác **lấy kết quả trung gian ra và xử lý tiếp**. **Queue tự động cân bằng khối lượng công việc**: nếu nhóm thread thứ nhất **chạy chậm hơn nhóm thứ hai thì nhóm thứ hai block để chờ kết quả**; nếu nhóm thứ nhất **chạy nhanh hơn thì queue đầy dần cho tới khi nhóm thứ hai theo kịp**.

### Table 10.2 — Blocking Queue Methods

| Method | Normal Action (dịch từ sách) | Action in Special Circumstances (dịch từ sách) |
|---|---|---|
| `add` | Thêm một phần tử | **Ném `IllegalStateException` nếu queue đầy** |
| `element` | Trả về **phần tử đầu (head)** | **Ném `NoSuchElementException` nếu queue rỗng** |
| `offer` | Thêm một phần tử và **trả về `true`** | **Trả về `false` nếu queue đầy** |
| `peek` | Trả về phần tử đầu | **Trả về `null` nếu queue rỗng** |
| `poll` | **Gỡ và trả về** phần tử đầu | **Trả về `null` nếu queue rỗng** |
| `put` | Thêm một phần tử | **Block nếu queue đầy** |
| `remove` | Gỡ và trả về phần tử đầu | **Ném `NoSuchElementException` nếu queue rỗng** |
| `take` | Gỡ và trả về phần tử đầu | **Block nếu queue rỗng** |

> *"The blocking queue methods fall into three categories that differ by the action they perform when the queue is full or empty. If you use the queue as a thread management tool, use the put and take methods. The add, remove, and element operations throw an exception when you try to add to a full queue or get the head of an empty queue. Of course, in a multithreaded program, the queue might become full or empty at any time, so you will instead want to use the offer, poll, and peek methods. These methods simply return with a failure indicator instead of throwing an exception if they cannot carry out their tasks."*

**Dịch:** Các method của blocking queue **chia làm ba nhóm, khác nhau ở hành động khi queue đầy hoặc rỗng**. Nếu bạn **dùng queue như công cụ quản lý thread thì dùng `put` và `take`**. Các thao tác **`add`, `remove`, `element` ném exception** khi bạn thử thêm vào queue đầy hoặc lấy đầu của queue rỗng. Dĩ nhiên, trong chương trình multithread, **queue có thể đầy hoặc rỗng bất cứ lúc nào**, nên bạn sẽ muốn dùng **`offer`, `poll`, `peek`** — các method này **chỉ đơn giản trả về một chỉ báo thất bại thay vì ném exception** khi không làm được việc.

> **Note (sách):** *"The poll and peek methods return null to indicate failure. Therefore, it is illegal to insert null values into these queues."*
>
> **Dịch:** `poll` và `peek` **trả về `null` để báo thất bại**. Vì vậy **chèn giá trị `null` vào các queue này là bất hợp lệ**.

> *"There are also variants of the offer and poll methods with a timeout. For example, the call"*

```java
boolean success = q.offer(x, 100, TimeUnit.MILLISECONDS);
```

> *"tries for 100 milliseconds to insert an element to the tail of the queue. If it succeeds, it returns true; otherwise, it returns false when it times out. Similarly, the call"*

```java
Object head = q.poll(100, TimeUnit.MILLISECONDS);
```

> *"tries for 100 milliseconds to remove the head of the queue. If it succeeds, it returns the head; otherwise, it returns null when it times out. The put method blocks if the queue is full, and the take method blocks if the queue is empty. These are the equivalents of offer and poll with no timeout."*

**Dịch:** Cũng có **biến thể của `offer` và `poll` kèm timeout**. Lời gọi thứ nhất **cố trong 100 mili giây để chèn một phần tử vào đuôi queue** — thành công thì trả về `true`, ngược lại trả về `false` khi hết giờ. Tương tự, lời gọi thứ hai **cố trong 100 mili giây để gỡ phần tử đầu**. **`put` block nếu queue đầy, `take` block nếu queue rỗng** — chúng **tương đương `offer` và `poll` không có timeout**.

### Các biến thể blocking queue

> *"The java.util.concurrent package supplies several variations of blocking queues. By default, the LinkedBlockingQueue has no upper bound on its capacity, but a maximum capacity can be optionally specified. The LinkedBlockingDeque is a double-ended version. The ArrayBlockingQueue is constructed with a given capacity and an optional parameter to require fairness. If fairness is specified, then the longest-waiting threads are given preferential treatment. As always, fairness exacts a significant performance penalty, and you should only use it if your problem specifically requires it."*

**Dịch:** Package `java.util.concurrent` cung cấp **vài biến thể của blocking queue**. Mặc định, **`LinkedBlockingQueue` không có giới hạn trên về sức chứa**, nhưng **có thể chỉ định sức chứa tối đa**. **`LinkedBlockingDeque` là bản hai đầu.** **`ArrayBlockingQueue` được dựng với sức chứa cho trước và một parameter tuỳ chọn để yêu cầu fairness.** Nếu chỉ định fairness thì **thread chờ lâu nhất được ưu tiên**. Như mọi khi, **fairness đòi một cái giá hiệu năng đáng kể**, và **chỉ nên dùng nếu bài toán thực sự đòi hỏi**.

> *"The PriorityBlockingQueue is a priority queue, not a first-in/first-out queue. Elements are removed in order of their priority. The queue has unbounded capacity, but retrieval will block if the queue is empty. (See Chapter 9 for more information on priority queues.)"*

**Dịch:** **`PriorityBlockingQueue` là một priority queue, không phải queue vào-trước-ra-trước.** Phần tử **được gỡ ra theo thứ tự priority của chúng**. Queue có **sức chứa không giới hạn**, nhưng **việc lấy ra sẽ block nếu queue rỗng**. (Xem [[03 - Concrete Collections|Chapter 9]] để biết thêm về priority queue.)

> *"The TransferQueue interface allows a producer thread to wait until a consumer is ready to take on an item. When a producer calls"*

```java
q.transfer(item);
```

> *"the call blocks until another thread removes it. The LinkedTransferQueue class implements this interface."*

**Dịch:** Interface **`TransferQueue` cho phép producer thread chờ cho tới khi một consumer sẵn sàng nhận item**. Khi producer gọi `transfer`, **lời gọi block cho tới khi một thread khác gỡ item đó ra**. Class **`LinkedTransferQueue` implement interface này**.

### Chương trình ví dụ

> *"The program in Listing 10.8 shows how to use a blocking queue to control a set of threads. The program searches through all files in a directory and its subdirectories, printing lines that contain a given keyword."*

**Dịch:** Chương trình ở Listing 10.8 cho thấy **cách dùng blocking queue để điều khiển một nhóm thread**. Chương trình **tìm qua mọi file trong một thư mục và các thư mục con, in ra các dòng chứa một keyword cho trước**.

> *"A producer thread enumerates all files in all subdirectories and places them in a blocking queue. This operation is fast, and the queue would quickly fill up with all files in the file system if it was not bounded."*

**Dịch:** Một **producer thread liệt kê mọi file trong mọi thư mục con và đặt chúng vào một blocking queue**. Thao tác này **nhanh**, và **queue sẽ nhanh chóng đầy ắp mọi file trong hệ thống file nếu nó không bị giới hạn**.

> *"We also start a large number of search threads. Each search thread takes a file from the queue, opens it, prints all lines containing the keyword, and then takes the next file. We use a trick to terminate the application when no further work is required. In order to signal completion, the enumeration thread places a special termination object into the queue. (This is similar to a dummy suitcase with a label "last bag" in a baggage claim belt.) When a search thread takes the special object, it terminates, after putting the object back for other consumers to see."*

**Dịch:** Ta cũng **start một số lượng lớn search thread**. Mỗi search thread **lấy một file khỏi queue, mở nó, in mọi dòng chứa keyword, rồi lấy file kế tiếp**. Ta dùng **một mẹo để kết thúc application khi không còn việc**: để báo hiệu hoàn tất, **enumeration thread đặt một object kết thúc đặc biệt vào queue**. (Giống như **một cái vali giả gắn nhãn "kiện cuối cùng" trên băng chuyền hành lý**.) Khi một search thread **lấy được object đặc biệt đó, nó kết thúc — sau khi đặt object trở lại cho các consumer khác thấy**.

> **Note (sách):** *"Some programmers use the term "poison pill" for an object that signals termination to the consumers."*
>
> **Dịch:** Một số lập trình viên dùng thuật ngữ **"poison pill"** cho **object báo hiệu kết thúc cho các consumer**.

> *"Note that no explicit thread synchronization is required. In this application, we use the queue data structure as a synchronization mechanism."*

**Dịch:** Lưu ý **không cần thread synchronization tường minh nào cả**. Trong application này, ta **dùng chính cấu trúc dữ liệu queue làm cơ chế synchronization**.

### Listing 10.8 — `blockingQueue/BlockingQueueTest.java`

```java
package blockingQueue;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * @version 1.04 2023-07-30
 * @author Cay Horstmann
 */
public class BlockingQueueTest
{
    private static final int FILE_QUEUE_SIZE = 10;
    private static final int SEARCH_THREADS = 100;
    private static final Path TERMINATION = Path.of("");
    private static BlockingQueue<Path> queue = new ArrayBlockingQueue<>(FILE_QUEUE_SIZE);

    public static void main(String[] args)
    {
        try (var in = new Scanner(System.in))
        {
            System.out.print("Enter base directory (e.g. /tmp/jdk-21-src): ");
            String directory = in.nextLine();
            System.out.print("Enter keyword (e.g. volatile): ");
            String keyword = in.nextLine();

            Runnable enumerator = () ->
            {
                try
                {
                    enumerate(Path.of(directory));
                    queue.put(TERMINATION);
                }
                catch (IOException e)
                {
                    e.printStackTrace();
                }
                catch (InterruptedException e)
                {
                }
            };

            Thread.ofPlatform().start(enumerator);
            for (int i = 1; i <= SEARCH_THREADS; i++)
            {
                Runnable searcher = () ->
                {
                    try
                    {
                        boolean done = false;
                        while (!done)
                        {
                            Path file = queue.take();
                            if (file == TERMINATION)
                            {
                                queue.put(file);
                                done = true;
                            }
                            else search(file, keyword);
                        }
                    }
                    catch (IOException e)
                    {
                        e.printStackTrace();
                    }
                    catch (InterruptedException e)
                    {
                    }
                };
                Thread.ofPlatform().start(searcher);
            }
        }
    }

    /**
     * Recursively enumerates all files in a given directory and its subdirectories.
     * See Chapters 1 and 2 of Volume II for the stream and file operations.
     * @param directory the directory in which to start
     */
    public static void enumerate(Path directory) throws IOException, InterruptedException
    {
        try (Stream<Path> children = Files.list(directory))
        {
            for (Path child : children.toList())
            {
                if (Files.isDirectory(child))
                    enumerate(child);
                else
                    queue.put(child);
            }
        }
    }

    /**
     * Searches a file for a given keyword and prints all matching lines.
     * @param file the file to search
     * @param keyword the keyword to search for
     */
    public static void search(Path file, String keyword) throws IOException
    {
        try (var in = new Scanner(file))
        {
            int lineNumber = 0;
            while (in.hasNextLine())
            {
                lineNumber++;
                String line = in.nextLine();
                if (line.contains(keyword))
                    System.out.printf("%s:%d:%s%n", file, lineNumber, line);
            }
        }
    }
}
```

## API — `java.util.concurrent.ArrayBlockingQueue<E>` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ArrayBlockingQueue(int capacity)`<br>`ArrayBlockingQueue(int capacity, boolean fair)` | dựng một blocking queue với **sức chứa và thiết lập fairness cho trước**. Queue được **implement bằng một [[09 - Arrays|array]] vòng (circular array)**. |

## API — `java.util.concurrent.LinkedBlockingQueue<E>` (Java 5.0) / `LinkedBlockingDeque<E>` (Java 6)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `LinkedBlockingQueue()`<br>`LinkedBlockingDeque()` | dựng một blocking queue hoặc deque **không giới hạn**, implement bằng **linked list**. |
| `LinkedBlockingQueue(int capacity)`<br>`LinkedBlockingDeque(int capacity)` | dựng một blocking queue hoặc deque **có giới hạn với sức chứa cho trước**, implement bằng linked list. |

## API — `java.util.concurrent.PriorityBlockingQueue<E>` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `PriorityBlockingQueue()`<br>`PriorityBlockingQueue(int initialCapacity)`<br>`PriorityBlockingQueue(int initialCapacity, Comparator<? super E> comparator)` | dựng một **blocking priority queue không giới hạn**, implement bằng **heap**. Mặc định **initial capacity là 11**. Nếu **không chỉ định comparator, các phần tử phải implement interface `Comparable`**. |

## API — `java.util.concurrent.BlockingQueue<E>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void put(E element)` | thêm phần tử, **block nếu cần**. |
| `E take()` | **gỡ và trả về phần tử đầu**, block nếu cần. |
| `boolean offer(E element, long time, TimeUnit unit)` | thêm phần tử cho trước và trả về `true` nếu thành công, **block nếu cần cho tới khi phần tử được thêm hoặc hết thời gian**. |
| `E poll(long time, TimeUnit unit)` | gỡ và trả về phần tử đầu, block nếu cần cho tới khi có phần tử hoặc hết thời gian. **Trả về `null` khi thất bại.** |

## API — `java.util.concurrent.BlockingDeque<E>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void putFirst(E element)`<br>`void putLast(E element)` | thêm phần tử, block nếu cần. |
| `E takeFirst()`<br>`E takeLast()` | gỡ và trả về **phần tử đầu hoặc cuối**, block nếu cần. |
| `boolean offerFirst(E element, long time, TimeUnit unit)`<br>`boolean offerLast(E element, long time, TimeUnit unit)` | thêm phần tử cho trước và trả về `true` nếu thành công, block nếu cần cho tới khi phần tử được thêm hoặc hết thời gian. |
| `E pollFirst(long time, TimeUnit unit)`<br>`E pollLast(long time, TimeUnit unit)` | gỡ và trả về phần tử đầu hoặc cuối, block nếu cần cho tới khi có phần tử hoặc hết thời gian. **Trả về `null` khi thất bại.** |

## API — `java.util.concurrent.TransferQueue<E>` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void transfer(E element)`<br>`boolean tryTransfer(E element, long time, TimeUnit unit)` | **chuyển giao một giá trị**, hoặc **thử chuyển giao với timeout cho trước**, **block cho tới khi một thread khác gỡ item đó ra**. Method thứ hai **trả về `true` nếu thành công**. |

---

## 10.6.2. Efficient Maps, Sets, and Queues

> *"The java.util.concurrent package supplies efficient implementations for maps, sorted sets, and queues: ConcurrentHashMap, ConcurrentSkipListMap, ConcurrentSkipListSet, and ConcurrentLinkedQueue."*

**Dịch:** Package `java.util.concurrent` cung cấp **implementation hiệu quả cho map, sorted set và queue**: **`ConcurrentHashMap`, `ConcurrentSkipListMap`, `ConcurrentSkipListSet`, `ConcurrentLinkedQueue`**.

> *"These collections use sophisticated algorithms that minimize contention by allowing concurrent access to different parts of the data structure."*

**Dịch:** Các collection này dùng **thuật toán tinh vi giảm thiểu tranh chấp** bằng cách **cho phép truy cập concurrent vào các phần khác nhau của cấu trúc dữ liệu**.

> *"Unlike most collections, the size method of these classes does not necessarily operate in constant time. Determining the current size of one of these collections usually requires traversal."*

**Dịch:** Khác với hầu hết collection, **method `size` của các class này không nhất thiết chạy trong thời gian hằng số**. Việc **xác định kích thước hiện tại thường đòi hỏi phải duyệt qua**.

> **Note (sách):** *"Some applications use humongous concurrent hash maps, so large that the size method is insufficient because it returns an int. What is one to do with a map that has over two billion entries? The mappingCount method returns the size as a long."*
>
> **Dịch:** Một số application dùng **concurrent hash map cực lớn**, lớn tới mức **`size` không đủ vì nó trả về `int`**. Làm gì với một map có **hơn hai tỷ entry**? Method **`mappingCount` trả về kích thước dưới dạng `long`**.

> *"The collections return weakly consistent iterators. That means that the iterators may or may not reflect all modifications that are made after they were constructed, but they will not return a value twice and they will not throw a ConcurrentModificationException."*

**Dịch:** Các collection này trả về **weakly consistent iterator**. Nghĩa là iterator **có thể phản ánh hoặc không phản ánh mọi thay đổi được thực hiện sau khi nó được dựng**, nhưng chúng **sẽ không trả về một giá trị hai lần** và **sẽ không ném `ConcurrentModificationException`**.

> **Note (sách):** *"In contrast, an iterator of a collection in the java.util package throws a ConcurrentModificationException when the collection has been modified after construction of the iterator."*
>
> **Dịch:** Ngược lại, iterator của một collection trong package `java.util` **ném `ConcurrentModificationException` khi collection bị sửa sau khi iterator được dựng**.

> *"The concurrent hash map can efficiently support a large number of readers and a bounded number of writers."*

**Dịch:** Concurrent hash map **hỗ trợ hiệu quả một số lượng lớn reader và một số lượng writer có giới hạn**.

> **Note (sách):** *"A hash map keeps all entries with the same hash code in the same "bucket." Some applications use poor hash functions, and as a result all entries end up in a small number of buckets, severely degrading performance. Even generally reasonable hash functions, such as that of the String class, can be problematic. For example, an attacker can slow down a program by crafting a large number of strings that hash to the same value. In recent Java versions, the concurrent hash map organizes the buckets as trees, not lists, when the key type implements Comparable, guaranteeing O(log n) performance."*
>
> **Dịch:** Hash map **giữ mọi entry có cùng hash code trong cùng một "bucket"**. Một số application dùng **hàm hash tồi**, khiến **mọi entry dồn vào một số ít bucket, làm hiệu năng giảm nghiêm trọng**. Ngay cả hàm hash nói chung là hợp lý như của class [[05 - Strings|`String`]] **cũng có thể thành vấn đề** — ví dụ **kẻ tấn công làm chậm chương trình bằng cách chế ra một lượng lớn string băm ra cùng một giá trị**. Ở các phiên bản Java gần đây, concurrent hash map **tổ chức bucket dưới dạng cây thay vì list khi kiểu key implement `Comparable`**, **đảm bảo hiệu năng O(log n)**.

## API — `java.util.concurrent.ConcurrentLinkedQueue<E>` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ConcurrentLinkedQueue<E>()` | dựng một queue **không giới hạn, không block**, **truy cập an toàn được bởi nhiều thread**. |

## API — `java.util.concurrent.ConcurrentHashMap<K, V>` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ConcurrentHashMap<K, V>()`<br>`ConcurrentHashMap<K, V>(int initialCapacity)`<br>`ConcurrentHashMap<K, V>(int initialCapacity, float loadFactor, int concurrencyLevel)` | dựng một hash map **truy cập an toàn được bởi nhiều thread**. Mặc định **initial capacity là 16**. Nếu **tải trung bình mỗi bucket vượt load factor thì bảng được thay đổi kích thước** — mặc định là **0.75**. **Concurrency level là số writer thread concurrent ước tính.** |

## API — `java.util.concurrent.ConcurrentSkipListSet<E>` (Java 6)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ConcurrentSkipListSet<E>()`<br>`ConcurrentSkipListSet<E>(Comparator<? super E> comp)` | dựng một **sorted set truy cập an toàn được bởi nhiều thread**. Constructor thứ nhất **đòi hỏi các phần tử implement interface `Comparable`**. |

## API — `java.util.concurrent.ConcurrentSkipListMap<K, V>` (Java 6)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ConcurrentSkipListMap<K, V>()`<br>`ConcurrentSkipListMap<K, V>(Comparator<? super K> comp)` | dựng một **sorted map truy cập an toàn được bởi nhiều thread**. Constructor thứ nhất **đòi hỏi các key implement interface `Comparable`**. |

---

## 10.6.3. Atomic Update of Map Entries

> *"The original version of ConcurrentHashMap only had a few methods for atomic updates, which made for somewhat awkward programming. Suppose we want to count how often certain features are observed. As a simple example, suppose multiple threads encounter words, and we want to count their frequencies. Can we use a ConcurrentHashMap<String, Long>? Consider the code for incrementing a count. Obviously, the following is not thread-safe:"*

```java
Long oldValue = map.get(word);
Long newValue = oldValue == null ? 1 : oldValue + 1;
map.put(word, newValue); // ERROR--might not replace oldValue
```

> *"Another thread might be updating the exact same count at the same time."*

**Dịch:** Phiên bản gốc của `ConcurrentHashMap` **chỉ có vài method cho cập nhật atomic**, khiến việc lập trình **hơi vụng về**. Giả sử ta muốn **đếm tần suất xuất hiện của các từ**. Dùng `ConcurrentHashMap<String, Long>` được không? Xét code tăng bộ đếm: rõ ràng đoạn trên **không thread-safe** — **một thread khác có thể đang cập nhật đúng cùng bộ đếm đó cùng lúc**.

> **Note (sách):** *"Some programmers are surprised that a supposedly thread-safe data structure permits operations that are not thread-safe. But there are two entirely different considerations. If multiple threads modify a plain HashMap, they can destroy the internal structure (an array of linked lists). Some of the links may go missing, or even go in circles, rendering the data structure unusable. That will never happen with a ConcurrentHashMap. In the example above, the code for get and put will never corrupt the data structure. But, since the sequence of operations is not atomic, the result is not predictable."*
>
> **Dịch:** Một số lập trình viên **ngạc nhiên khi một cấu trúc dữ liệu được cho là thread-safe lại cho phép các thao tác không thread-safe**. Nhưng **đó là hai chuyện hoàn toàn khác nhau**. Nếu nhiều thread sửa một `HashMap` thường, chúng **có thể phá huỷ cấu trúc nội bộ** (một array các linked list) — **một số link có thể biến mất hoặc thậm chí đi vòng tròn**, khiến cấu trúc dữ liệu **không dùng được**. **Điều đó không bao giờ xảy ra với `ConcurrentHashMap`.** Trong ví dụ trên, code `get` và `put` **sẽ không bao giờ làm hỏng cấu trúc dữ liệu**. Nhưng vì **chuỗi thao tác không atomic nên kết quả không dự đoán được**.

> *"In old versions of Java, it was necessary to use the replace method, which atomically replaces an old value with a new one, provided that no other thread has come before and replaced the old value with something else. You had to keep doing it until the attempt succeeded:"*

```java
do
{
    oldValue = map.get(word);
    newValue = oldValue == null ? 1 : oldValue + 1;
}
while (!map.replace(word, oldValue, newValue));
```

**Dịch:** Ở các phiên bản Java cũ, **phải dùng method `replace`**, method này **thay giá trị cũ bằng giá trị mới một cách atomic, với điều kiện chưa có thread nào đến trước và thay giá trị cũ bằng thứ khác**. Bạn phải **làm đi làm lại tới khi thành công**.

> *"An alternative was to use a ConcurrentHashMap<String, AtomicLong> and the following update code:"*

```java
map.putIfAbsent(word, new AtomicLong());
map.get(word).incrementAndGet();
```

> *"Unfortunately, in the first line, a new AtomicLong is constructed for each increment, and it will be discarded when it is not needed."*

**Dịch:** Một lựa chọn khác là dùng `ConcurrentHashMap<String, AtomicLong>`. Đáng tiếc, ở dòng đầu, **một `AtomicLong` mới được dựng cho mỗi lần tăng, và bị vứt đi khi không cần**.

### compute và merge

> *"Nowadays, the Java API provides methods that make atomic updates more convenient and performant. The compute method is called with a key and a function to compute the new value. That function receives the key and the associated value, or null if there is none, and it computes the new value. For example, here is how we can update a map of integer counters:"*

```java
map.compute(word, (k, v) -> v == null ? 1 : v + 1);
```

**Dịch:** Ngày nay, Java API cung cấp các method **làm cập nhật atomic tiện lợi và hiệu năng hơn**. **`compute` được gọi với một key và một function tính giá trị mới.** Function đó **nhận key và giá trị tương ứng, hoặc `null` nếu chưa có**, rồi **tính giá trị mới**.

> **Note (sách):** *"You cannot have null values in a ConcurrentHashMap. There are many methods that use a null value as an indication that a given key is not present in the map."*
>
> **Dịch:** Bạn **không thể có giá trị `null` trong `ConcurrentHashMap`**. Có nhiều method **dùng giá trị `null` để báo rằng một key nào đó không có trong map**.

> *"There are also variants computeIfPresent and computeIfAbsent that only compute a new value when there is already an old one, or when there isn't yet one. A map of LongAdder counters can be updated with"*

```java
map.computeIfAbsent(word, k -> new LongAdder()).increment();
```

> *"That is almost like the call to putIfAbsent that you saw before, but the LongAdder constructor is only called when a new counter is actually needed."*

**Dịch:** Cũng có biến thể **`computeIfPresent` và `computeIfAbsent`** chỉ tính giá trị mới **khi đã có giá trị cũ, hoặc khi chưa có giá trị nào**. Cách này **gần giống lời gọi `putIfAbsent` ở trên**, nhưng **constructor `LongAdder` chỉ được gọi khi thực sự cần một bộ đếm mới**.

> *"You often need to do something special when a key is added for the first time. The merge method makes this particularly convenient. It has a parameter for the initial value that is used when the key is not yet present. Otherwise, the function that you supplied is called, combining the existing value and the initial value. (Unlike compute, the function does not process the key.)"*

```java
map.merge(word, 1L, (existingValue, newValue) -> existingValue + newValue);
```

> *"or simply"*

```java
map.merge(word, 1L, Long::sum);
```

> *"It doesn't get more concise than that."*

**Dịch:** Bạn thường cần **làm gì đó đặc biệt khi một key được thêm lần đầu**. Method **`merge` khiến việc này đặc biệt tiện lợi**: nó **có một parameter cho giá trị ban đầu, dùng khi key chưa tồn tại**. Ngược lại, **function bạn cung cấp được gọi để kết hợp giá trị hiện có với giá trị ban đầu**. (**Khác `compute`, function này không xử lý key.**) **Không thể gọn hơn thế nữa.**

> **Note (sách):** *"If the function that is passed to compute or merge returns null, the existing entry is removed from the map."*
>
> **Dịch:** Nếu function truyền cho `compute` hoặc `merge` **trả về `null` thì entry hiện có bị gỡ khỏi map**.

> **Caution (sách):** *"When you use compute or merge, keep in mind that the function that you supply should not do a lot of work. While that function runs, some other updates to the map may be blocked. Of course, that function should also not update other parts of the map."*
>
> **Dịch:** Khi dùng `compute` hoặc `merge`, nhớ rằng **function bạn cung cấp không nên làm nhiều việc**. Trong lúc function chạy, **một số cập nhật khác lên map có thể bị block**. Dĩ nhiên, function đó cũng **không nên cập nhật các phần khác của map**.

> *"The program in Listing 10.9 uses a concurrent hash map to count all words in the Java files of a directory tree."*

**Dịch:** Chương trình ở Listing 10.9 dùng concurrent hash map để **đếm mọi từ trong các file Java của một cây thư mục**.

### Listing 10.9 — `concurrentHashMap/CHMDemo.java`

```java
package concurrentHashMap;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * This program demonstrates concurrent hash maps.
 * @version 1.01 2023-07-30
 * @author Cay Horstmann
 */
public class CHMDemo
{
    public static ConcurrentHashMap<String, Long> map = new ConcurrentHashMap<>();

    /**
     * Adds all words in the given file to the concurrent hash map.
     * @param file a file
     */
    public static void process(Path file)
    {
        try (var in = new Scanner(file))
        {
            while (in.hasNext())
            {
                String word = in.next();
                map.merge(word, 1L, Long::sum);
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    /**
     * Returns all descendants of a given directory--see Chapters 1 and 2 of Volume II
     * @param rootDir the root directory
     * @return a set of all descendants of the root directory
     */
    public static Set<Path> descendants(Path rootDir) throws IOException
    {
        try (Stream<Path> entries = Files.walk(rootDir))
        {
            return entries.collect(Collectors.toSet());
        }
    }

    public static void main(String[] args)
        throws InterruptedException, ExecutionException, IOException
    {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        Path pathToRoot = Path.of(".");
        for (Path p : descendants(pathToRoot))
        {
            if (p.getFileName().toString().endsWith(".java"))
                executor.execute(() -> process(p));
        }
        executor.close();
        map.forEach((k, v) ->
        {
            if (v >= 10)
                System.out.println(k + " occurs " + v + " times");
        });
    }
}
```

---

## 10.6.4. Bulk Operations on Concurrent Hash Maps

> *"The Java API provides bulk operations on concurrent hash maps that can safely execute even while other threads operate on the map. The bulk operations traverse the map and operate on the elements they find as they go along. No effort is made to freeze a snapshot of the map in time. Unless you happen to know that the map is not being modified while a bulk operation runs, you should treat its result as an approximation of the map's state."*

**Dịch:** Java API cung cấp các **bulk operation trên concurrent hash map, chạy an toàn ngay cả khi thread khác đang thao tác trên map**. Bulk operation **duyệt map và thao tác lên các phần tử nó gặp dọc đường**. **Không có nỗ lực nào để đóng băng một snapshot của map tại một thời điểm.** Trừ khi bạn biết chắc **map không bị sửa trong lúc bulk operation chạy**, bạn **nên coi kết quả của nó như một xấp xỉ của state của map**.

> *"There are three kinds of operations:"*

**Dịch:** Có **ba loại thao tác**:

| Thao tác | Mô tả (dịch từ sách) |
|---|---|
| **search** | áp dụng một function lên **từng key và/hoặc value**, **cho tới khi function cho ra kết quả khác `null`**. Khi đó **việc tìm kiếm kết thúc và kết quả của function được trả về**. |
| **reduce** | **kết hợp mọi key và/hoặc value**, dùng một **accumulation function** được cung cấp. |
| **forEach** | áp dụng một function lên **mọi key và/hoặc value**. |

> *"Each operation has four versions:"*

**Dịch:** Mỗi thao tác có **bốn phiên bản**:

| Phiên bản | Mô tả (dịch từ sách) |
|---|---|
| `operationKeys` | thao tác trên **key**. |
| `operationValues` | thao tác trên **value**. |
| `operation` | thao tác trên **cả key lẫn value**. |
| `operationEntries` | thao tác trên **object `Map.Entry`**. |

> *"With each of the operations, you need to specify a parallelism threshold. If the map contains more elements than the threshold, the bulk operation is parallelized. If you want the bulk operation to run in a single thread, use a threshold of Long.MAX_VALUE. If you want the maximum number of threads to be made available for the bulk operation, use a threshold of 1."*

**Dịch:** Với mỗi thao tác, bạn **phải chỉ định một parallelism threshold**. Nếu map **chứa nhiều phần tử hơn threshold thì bulk operation được song song hoá**. Muốn bulk operation **chạy trong một thread duy nhất thì dùng threshold `Long.MAX_VALUE`**. Muốn **số thread tối đa được huy động thì dùng threshold là 1**.

### search

> *"Let's look at the search methods first. Here are the versions:"*

```java
U searchKeys(long threshold, Function<? super K, ? extends U> f)
U searchValues(long threshold, Function<? super V, ? extends U> f)
U search(long threshold, BiFunction<? super K, ? super V, ? extends U> f)
U searchEntries(long threshold, Function<Map.Entry<K, V>, ? extends U> f)
```

> *"For example, suppose we want to find the first word that occurs more than 1,000 times. We need to search keys and values:"*

```java
String result = map.search(threshold, (k, v) -> v > 1000 ? k : null);
```

> *"Then result is set to the first match, or to null if the search function returns null for all inputs."*

**Dịch:** Ví dụ, giả sử ta muốn **tìm từ đầu tiên xuất hiện hơn 1,000 lần** — ta cần **tìm trên cả key lẫn value**. Khi đó `result` được set thành **kết quả khớp đầu tiên**, hoặc **`null` nếu search function trả về `null` với mọi input**.

### forEach

> *"The forEach methods have two variants. The first one simply applies a consumer function for each map entry, for example"*

```java
map.forEach(threshold,
    (k, v) -> System.out.println(k + " -> " + v));
```

> *"The second variant takes an additional transformer function, which is applied first, and its result is passed to the consumer:"*

```java
map.forEach(threshold,
    (k, v) -> k + " -> " + v, // transformer
    System.out::println); // consumer
```

**Dịch:** `forEach` có **hai biến thể**. Biến thể thứ nhất **chỉ áp dụng một consumer function cho mỗi map entry**. Biến thể thứ hai **nhận thêm một transformer function được áp dụng trước**, và **kết quả của nó được truyền cho consumer**.

> *"The transformer can be used as a filter. Whenever the transformer returns null, the value is silently skipped. For example, here we only print the entries with large values:"*

```java
map.forEach(threshold,
    (k, v) -> v > 1000 ? k + " -> " + v : null, // filter and transformer
    System.out::println); // the nulls are not passed to the consumer
```

**Dịch:** **Transformer dùng được như một filter.** Mỗi khi transformer **trả về `null`, giá trị đó bị bỏ qua lặng lẽ**.

### reduce

> *"The reduce operations combine their inputs with an accumulation function. For example, here is how you can compute the sum of all values:"*

```java
Long sum = map.reduceValues(threshold, Long::sum);
```

> *"As with forEach, you can also supply a transformer function. Here we compute the length of the longest key:"*

```java
Integer maxlength = map.reduceKeys(threshold,
    String::length, // transformer
    Integer::max); // accumulator
```

> *"The transformer can act as a filter, by returning null to exclude unwanted inputs. Here, we count how many entries have value > 1000:"*

```java
Long count = map.reduceValues(threshold,
    v -> v > 1000 ? 1L : null,
    Long::sum);
```

**Dịch:** Các thao tác **reduce kết hợp input của chúng bằng một accumulation function**. Như với `forEach`, bạn **cũng cung cấp được transformer function**. Transformer **đóng vai filter bằng cách trả về `null` để loại các input không mong muốn**.

> **Note (sách):** *"If the map is empty, or all entries have been filtered out, the reduce operation returns null. If there is only one element, its transformation is returned, and the accumulator is not applied."*
>
> **Dịch:** Nếu map **rỗng, hoặc mọi entry đã bị lọc bỏ, thao tác reduce trả về `null`**. Nếu **chỉ có một phần tử thì kết quả biến đổi của nó được trả về, và accumulator không được áp dụng**.

> *"There are specializations for int, long, and double outputs with suffixes ToInt, ToLong, and ToDouble. You need to transform the input to a primitive value and specify a default value and an accumulator function. The default value is returned when the map is empty."*

```java
long sum = map.reduceValuesToLong(threshold,
    Long::longValue, // transformer to primitive type
    0, // default value for empty map
    Long::sum); // primitive type accumulator
```

**Dịch:** Có các **bản chuyên biệt cho output `int`, `long`, `double` với hậu tố `ToInt`, `ToLong`, `ToDouble`**. Bạn phải **biến đổi input thành giá trị primitive và chỉ định một giá trị mặc định cùng một accumulator function**. **Giá trị mặc định được trả về khi map rỗng.**

> **Caution (sách):** *"These specializations act differently from the object versions where there is only one element to be considered. Instead of returning the transformed element, it is accumulated with the default. Therefore, the default must be the neutral element of the accumulator."*
>
> **Dịch:** Các bản chuyên biệt này **hành xử khác bản object khi chỉ có một phần tử cần xét**. Thay vì **trả về phần tử đã biến đổi, nó được tích luỹ với giá trị mặc định**. Vì vậy, **giá trị mặc định phải là phần tử trung hoà của accumulator**.

---

## 10.6.5. Concurrent Set Views

> *"Suppose you want a large, thread-safe set instead of a map. There is no ConcurrentHashSet class, and you know better than trying to create your own. Of course, you can use a ConcurrentHashMap with bogus values, but then you get a map, not a set, and you can't apply operations of the Set interface."*

**Dịch:** Giả sử bạn muốn **một set lớn, thread-safe thay vì một map**. **Không có class `ConcurrentHashSet`**, và bạn **đủ khôn để không thử tự tạo lấy một cái**. Dĩ nhiên bạn **dùng được `ConcurrentHashMap` với các giá trị giả**, nhưng khi đó **bạn có một map chứ không phải set**, và **không áp dụng được các thao tác của interface `Set`**.

> *"The static newKeySet method yields a Set\<K> that is actually a wrapper around a ConcurrentHashMap<K, Boolean>. (All map values are Boolean.TRUE, but you don't actually care since you just use it as a set.)"*

```java
Set<String> words = ConcurrentHashMap.<String>newKeySet();
```

**Dịch:** Static method **`newKeySet` cho ra một `Set<K>` mà thực chất là wrapper quanh một `ConcurrentHashMap<K, Boolean>`**. (Mọi giá trị của map là **`Boolean.TRUE`**, nhưng bạn **không quan tâm vì chỉ dùng nó như một set**.)

> *"Of course, if you have an existing map, the keySet method yields the set of keys. That set is mutable. If you remove the set's elements, the keys (and their values) are removed from the map. But it doesn't make sense to add elements to the key set, because there would be no corresponding values to add. There is a second keySet method to ConcurrentHashMap, with a default value, to be used when adding elements to the set:"*

```java
Set<String> words = map.keySet(1L);
words.add("Java");
```

> *"If "Java" wasn't already present in words, it now has a value of one."*

**Dịch:** Dĩ nhiên, nếu bạn **đã có sẵn một map thì `keySet` cho ra tập các key**. **Set đó mutable**: nếu bạn **gỡ phần tử của set thì các key (và value của chúng) bị gỡ khỏi map**. Nhưng **thêm phần tử vào key set thì vô nghĩa** vì **không có value tương ứng để thêm**. Có **một method `keySet` thứ hai của `ConcurrentHashMap`, nhận một giá trị mặc định, dùng khi thêm phần tử vào set**. Nếu `"Java"` **chưa có trong `words` thì giờ nó có giá trị là một**.

> **Note (sách):** *"You could also use the Collections.newSetFromMap method, but newKeySet is simpler and a bit more efficient."*
>
> **Dịch:** Bạn cũng **dùng được `Collections.newSetFromMap`**, nhưng **`newKeySet` đơn giản hơn và hiệu quả hơn chút**.

---

## 10.6.6. Copy on Write Arrays

> *"The CopyOnWriteArrayList and CopyOnWriteArraySet are thread-safe collections in which all mutators make a copy of the underlying array. This arrangement is useful if the threads that iterate over the collection greatly outnumber the threads that mutate it. When you construct an iterator, it contains a reference to the current array. If the array is later mutated, the iterator still has the old array, but the collection's array is replaced. As a consequence, the older iterator has a consistent (but potentially outdated) view that it can access without any synchronization expense."*

**Dịch:** **`CopyOnWriteArrayList` và `CopyOnWriteArraySet` là các thread-safe collection mà mọi mutator đều tạo một bản copy của array bên dưới.** Cách sắp xếp này **hữu ích nếu số thread duyệt collection nhiều hơn hẳn số thread mutate nó**. Khi bạn dựng một iterator, **nó chứa reference tới array hiện tại**. Nếu array **sau đó bị mutate, iterator vẫn giữ array cũ**, còn **array của collection thì bị thay**. Hệ quả là **iterator cũ có một góc nhìn nhất quán (nhưng có thể lỗi thời) mà nó truy cập được mà không tốn chi phí synchronization nào**.

---

## 10.6.7. Parallel Array Algorithms

> *"The Arrays class has a number of parallelized operations. The static Arrays.parallelSort method can sort an array of primitive values or objects. For example,"*

```java
var contents = Files.readString(Path.of("alice.txt"));
String[] words = contents.split("\\PL+"); // split along nonletters
Arrays.parallelSort(words);
```

> *"When you sort objects, you can supply a Comparator."*

```java
Arrays.parallelSort(words, Comparator.comparing(String::length));
```

> *"With all methods, you can supply the bounds of a range, such as"*

```java
Arrays.parallelSort(words, words.length / 2, words.length); // sort the upper half
```

**Dịch:** Class **`Arrays` có một loạt thao tác được song song hoá**. Static method **`Arrays.parallelSort` sắp xếp được một array giá trị primitive hoặc object**. Khi sắp xếp object, bạn **cung cấp được một `Comparator`**. Với mọi method, bạn **cung cấp được biên của một khoảng**.

> **Note (sách):** *"At first glance, it seems a bit odd that these methods have parallel in their name, since the user shouldn't care how the sorting happens. However, the API designers wanted to make it clear that the sorting is parallelized. That way, users are on notice to avoid comparators with side effects."*
>
> **Dịch:** Thoạt nhìn, **hơi lạ khi các method này có chữ `parallel` trong tên**, vì **người dùng lẽ ra không cần quan tâm việc sắp xếp diễn ra thế nào**. Tuy nhiên, người thiết kế API **muốn nói rõ rằng việc sắp xếp được song song hoá** — nhờ vậy **người dùng được cảnh báo để tránh các comparator có side effect**.

> *"The parallelSetAll method fills an array with values that are computed from a function. The function receives the element index and computes the value at that location."*

```java
Arrays.parallelSetAll(values, i -> i % 10);
// fills values with 0 1 2 3 4 5 6 7 8 9 0 1 2 . . .
```

> *"Clearly, this operation benefits from being parallelized. There are versions for all primitive type arrays and for object arrays."*

**Dịch:** **`parallelSetAll` lấp đầy một array bằng các giá trị được tính từ một function.** Function **nhận index của phần tử và tính giá trị ở vị trí đó**. Rõ ràng thao tác này **hưởng lợi từ việc song song hoá**. Có **phiên bản cho mọi array kiểu primitive và cho array object**.

> *"Finally, there is a parallelPrefix method that replaces each array element with the accumulation of the prefix for a given associative operation. Huh? Here is an example. Consider the array [1, 2, 3, 4, . . .] and the × operation. After executing Arrays.parallelPrefix(values, (x, y) -> x * y), the array contains"*

```
[1, 1 × 2, 1 × 2 × 3, 1 × 2 × 3 × 4, . . .]
```

**Dịch:** Cuối cùng, có method **`parallelPrefix` thay mỗi phần tử array bằng kết quả tích luỹ của phần đầu (prefix) với một thao tác kết hợp (associative) cho trước**. Hả? Đây là một ví dụ: xét array `[1, 2, 3, 4, . . .]` và phép **×**.

> *"Perhaps surprisingly, this computation can be parallelized. First, join neighboring elements, as indicated here:"*

```
[1, 1 × 2, 3, 3 × 4, 5, 5 × 6, 7, × 8]
```

> *"The gray values are left alone. Clearly, one can make this computation in parallel in separate regions of the array. In the next step, update the indicated elements by multiplying them with elements that are one or two positions below:"*

```
[1, 1 × 2, 1 × 2 × 3, 1 × 2 × 3 × 4, 5, 5 × 6, 5 × 6 × 7, 5 × 6 × 7 × 8]
```

> *"This, again, can be done in parallel. After log n steps, the process is complete. This is a win over the straightforward linear computation if sufficient processors are available. On special-purpose hardware, this algorithm is commonly used, and users of such hardware are quite ingenious in adapting it to a variety of problems."*

**Dịch:** Có lẽ đáng ngạc nhiên, **phép tính này song song hoá được**. Trước hết, **ghép các phần tử kề nhau**. **Các giá trị màu xám được để nguyên.** Rõ ràng **phép tính này làm song song được ở các vùng riêng biệt của array**. Bước kế tiếp, **cập nhật các phần tử được chỉ ra bằng cách nhân chúng với các phần tử ở một hoặc hai vị trí thấp hơn**. Việc này **cũng làm song song được**. **Sau log n bước, quá trình hoàn tất.** Đây là **thắng lợi so với phép tính tuyến tính đơn giản nếu có đủ processor**. Trên **phần cứng chuyên dụng, thuật toán này được dùng phổ biến**, và **người dùng phần cứng đó khá tài tình trong việc điều chỉnh nó cho nhiều bài toán khác nhau**.

---

## 10.6.8. Older Thread-Safe Collections

> *"Ever since the initial release of Java, the Vector and Hashtable classes provided thread-safe implementations of a dynamic array and a hash table. These classes are now considered obsolete, having been replaced by the ArrayList and HashMap classes. Those classes are not thread-safe. Instead, a different mechanism is supplied in the collections library. Any collection class can be made thread-safe by means of a synchronization wrapper:"*

```java
List<E> synchArrayList = Collections.synchronizedList(new ArrayList<>());
Map<K, V> synchHashMap = Collections.synchronizedMap(new HashMap<>());
```

> *"The methods of the resulting collections use locking to provide thread-safe access."*

**Dịch:** Ngay từ bản phát hành Java đầu tiên, class **`Vector` và `Hashtable` đã cung cấp implementation thread-safe cho mảng động và hash table**. Các class này **nay bị coi là lỗi thời, đã được thay bằng [[03 - Concrete Collections|`ArrayList`]] và `HashMap`** — vốn **không thread-safe**. Thay vào đó, **collections library cung cấp một cơ chế khác**: **bất kỳ class collection nào cũng có thể được làm cho thread-safe bằng một synchronization wrapper**. Các method của collection kết quả **dùng lock để cung cấp truy cập thread-safe**.

> *"You should make sure that no thread accesses the data structure through the original unsynchronized methods. The easiest way to ensure this is not to save any reference to the original object. Simply construct a collection and immediately pass it to the wrapper, as we did in our examples."*

**Dịch:** Bạn phải đảm bảo **không thread nào truy cập cấu trúc dữ liệu qua các method không synchronized ban đầu**. Cách dễ nhất là **không lưu bất kỳ reference nào tới object gốc** — cứ **dựng collection rồi truyền ngay cho wrapper**.

> *"You still need to use "client-side" locking if you want to iterate over the collection while another thread has the opportunity to mutate it:"*

```java
synchronized (synchHashMap)
{
    Iterator<K> iter = synchHashMap.keySet().iterator();
    while (iter.hasNext()) . . .;
}
```

**Dịch:** Bạn **vẫn phải dùng "client-side" locking** nếu muốn **duyệt collection trong lúc thread khác có cơ hội mutate nó**.

> *"You must use the same code if you use a "for each" loop because the loop uses an iterator. Note that the iterator actually fails with a ConcurrentModificationException if another thread mutates the collection while the iteration is in progress. The synchronization is still required so that the concurrent modification can be reliably detected."*

**Dịch:** Bạn **phải dùng chính code đó nếu dùng vòng lặp "for each"**, vì **vòng lặp đó dùng iterator**. Lưu ý iterator **thực sự thất bại với `ConcurrentModificationException` nếu thread khác mutate collection trong lúc đang duyệt**. **Synchronization vẫn cần thiết để việc sửa đổi concurrent được phát hiện một cách đáng tin cậy.**

> *"You are usually better off using the collections defined in the java.util.concurrent package instead of the synchronization wrappers. In particular, the ConcurrentHashMap has been carefully implemented so that multiple threads can access it without blocking each other, provided they access different buckets. One exception is an array list that is frequently mutated. In that case, a synchronized ArrayList can outperform a CopyOnWriteArrayList."*

**Dịch:** Thường thì **dùng các collection định nghĩa trong package `java.util.concurrent` tốt hơn dùng synchronization wrapper**. Đặc biệt, **`ConcurrentHashMap` được implement cẩn thận để nhiều thread truy cập mà không block lẫn nhau**, miễn là **chúng truy cập các bucket khác nhau**. **Một ngoại lệ là array list bị mutate thường xuyên** — khi đó **một `ArrayList` được synchronized có thể chạy tốt hơn `CopyOnWriteArrayList`**.

## API — `java.util.Collections` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <E> Collection<E> synchronizedCollection(Collection<E> c)`<br>`static <E> List synchronizedList(List<E> c)`<br>`static <E> Set synchronizedSet(Set<E> c)`<br>`static <E> SortedSet synchronizedSortedSet(SortedSet<E> c)`<br>`static <K, V> Map<K, V> synchronizedMap(Map<K, V> c)`<br>`static <K, V> SortedMap<K, V> synchronizedSortedMap(SortedMap<K, V> c)` | dựng một **view của collection mà các method của nó là `synchronized`**. |

---

## Bài kế tiếp

→ [[07 - Asynchronous Computations]] — `CompletableFuture`, kết hợp các asynchronous computation, xử lý exception, và các API bất đồng bộ dài hạn.
