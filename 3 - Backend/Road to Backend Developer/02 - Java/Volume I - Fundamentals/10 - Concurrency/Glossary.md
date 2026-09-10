# Glossary — Concurrency

> Thuật ngữ chương 10: Concurrency. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**Atomic**
Thuộc tính của thao tác **không thể bị preempt giữa chừng**. Lệnh `accounts[to] += amount;` **không atomic** vì nó gồm ba bước: load vào register, cộng, ghi trở lại. Package `java.util.concurrent.atomic` chứa các class **dùng chỉ thị mức máy hiệu quả để đảm bảo tính atomic mà không cần lock**, ví dụ `AtomicInteger`, `AtomicLong`. Xem [[05 - Synchronization#10.5.2. The Race Condition Explained]] và [[05 - Synchronization#10.5.11. Atomics]].

## B

**Blocking Queue**
Queue **khiến một thread block khi thử thêm phần tử lúc queue đầy, hoặc gỡ phần tử lúc queue rỗng**. Công cụ hữu ích để **điều phối công việc của nhiều thread** — queue **tự động cân bằng khối lượng công việc**. Dùng `put`/`take` khi dùng queue như công cụ quản lý thread. Các biến thể: `LinkedBlockingQueue`, `LinkedBlockingDeque`, `ArrayBlockingQueue`, `PriorityBlockingQueue`, `LinkedTransferQueue`. Xem [[06 - Thread-Safe Collections#10.6.1. Blocking Queues]].

**Blocked (thread state)**
Trạng thái khi một thread **cố lấy một intrinsic object lock đang do thread khác nắm giữ**. Thread bị blocked **không hoạt động** và **không thực thi code nào**, **tiêu tốn rất ít tài nguyên**. Xem [[02 - Thread States#10.2.3. Blocked and Waiting Threads]].

## C

**Callable**
Interface tương tự `Runnable` **nhưng trả về một giá trị**. Là **parameterized type với một method duy nhất `call`**; type parameter là **kiểu của giá trị trả về**. Khác `Supplier`, `Callable` **ném được checked exception**. Xem [[04 - Coordinating Tasks#10.4.1. Callables and Futures]].

**Carrier Thread**
Các **platform thread mà virtual thread được mount lên**. Mặc định scheduler dùng **một carrier thread cho mỗi processor**, tinh chỉnh được bằng VM option `jdk.virtualThreadScheduler.parallelism`. Xem [[03 - Thread Properties#10.3.1. Virtual Threads]].

**Client-Side Locking**
Cách làm **dùng lock của một object để implement thêm các thao tác atomic**, ví dụ `synchronized (accounts) { … }` quanh các lời gọi `get`/`set` của một `Vector`. Cách này **hoàn toàn phụ thuộc vào việc class đó dùng intrinsic lock cho mọi mutator** — điều mà **tài liệu không hứa hẹn**. Sách nói nó **rất mong manh và nói chung không được khuyến nghị**. Xem [[05 - Synchronization#10.5.7. Synchronized Blocks]] và [[06 - Thread-Safe Collections#10.6.8. Older Thread-Safe Collections]].

**CompletableFuture**
Class implement interface `Future`, cung cấp **cơ chế thứ hai để lấy kết quả**: bạn **đăng ký một callback được gọi với kết quả ngay khi nó sẵn sàng**, không phải block. Gọi là **"completable" vì người ta có thể set một completion value** — ở thư viện khác thực thể này gọi là **promise**. Hoàn tất **hoặc với một kết quả, hoặc với một uncaught exception**. Xem [[07 - Asynchronous Computations#10.7.1. Completable Futures]].

**Condition Object** (condition variable)
Object dùng để **quản lý các thread đã lấy được lock nhưng không làm được việc gì có ích**. Lấy bằng `lock.newCondition()`. Thread gọi `await` thì **vào wait set** và **nhả lock**; nó **không tự kích hoạt lại được**, phải chờ thread khác gọi **`signalAll`** (hoặc `signal`). Lời gọi `await` **nên nằm trong vòng lặp `while (!(OK to proceed))`**. Xem [[05 - Synchronization#10.5.4. Condition Objects]].

**Copy on Write Array**
`CopyOnWriteArrayList` và `CopyOnWriteArraySet` — thread-safe collection mà **mọi mutator đều tạo bản copy của array bên dưới**. Hữu ích khi **số thread duyệt nhiều hơn hẳn số thread mutate**. Iterator cũ giữ **góc nhìn nhất quán (nhưng có thể lỗi thời)** mà **không tốn chi phí synchronization**. Xem [[06 - Thread-Safe Collections#10.6.6. Copy on Write Arrays]].

## D

**Daemon Thread**
Thread **không có vai trò gì khác ngoài phục vụ những thread khác** — ví dụ timer thread, thread dọn cache cũ. **Khi chỉ còn lại daemon thread, virtual machine thoát.** **Mọi virtual thread đều là daemon thread**; gọi `setDaemon(false)` lên virtual thread **không có tác dụng**. Xem [[03 - Thread Properties#10.3.3. Daemon Threads]].

**Deadlock**
Tình huống **mọi thread đều bị block vì thread nào cũng chờ điều kiện mà thread khác phải tạo ra**. Ví dụ sách: Account 1 có $200, Account 2 có $300, Thread 1 chờ chuyển $300 từ 1 sang 2, Thread 2 chờ chuyển $400 từ 2 sang 1 — **cả hai chờ nhau vĩnh viễn**. Dùng `signal` thay `signalAll` cũng dễ sinh deadlock vì **nó chỉ mở block cho một thread và có thể không chọn đúng thread thiết yếu**. Xem [[05 - Synchronization#10.5.5. Deadlocks]].

## E

**Executor**
**Object mà bạn submit task vào.** Với platform thread thì đó là **thread pool**; với virtual thread thì executor **đơn giản start một virtual thread mới cho mỗi task**. Dựng bằng các static factory method của class `Executors`. Khi xong việc thì **gọi `close`** (Java 19), hoặc `shutdown`/`shutdownNow`/`awaitTermination` cho code legacy. Xem [[04 - Coordinating Tasks#10.4.2. Executors]].

**ExecutorCompletionService**
Service **quản lý một blocking queue các object `Future`**, chứa kết quả của các task đã submit **khi chúng dần sẵn sàng**. Dùng khi bạn muốn **lấy kết quả theo thứ tự chúng sẵn sàng** thay vì theo thứ tự submit như `invokeAll`. Xem [[04 - Coordinating Tasks#10.4.3. Invoking a Group of Tasks]].

## F

**Fair Lock**
Lock **ưu tiên thread đã chờ lâu nhất**, dựng bằng `new ReentrantLock(true)`. Đảm bảo công bằng này **là gánh nặng lớn cho hiệu năng**, nên **mặc định lock không bắt buộc công bằng**. Kể cả dùng fair lock, **không có đảm bảo nào rằng thread scheduler là công bằng**. Xem [[05 - Synchronization#10.5.3. Lock Objects]].

**Fork-Join Framework**
Framework hỗ trợ các application dùng **một thread cho mỗi processor core để làm task nặng về tính toán**. Cung cấp class **`RecursiveTask<T>`** (có kết quả) và **`RecursiveAction`** (không kết quả); override **`compute`** để sinh và gọi subtask rồi gộp kết quả bằng `invokeAll` và `join`. **Được tối ưu cho workload không block** — nhiều blocking task sẽ **làm pool bị đói**. Xem [[04 - Coordinating Tasks#10.4.5. The Fork-Join Framework]].

**Future**
Object **nắm giữ kết quả của một task bất đồng bộ**. Method `get` **block cho tới khi task xong**; `resultNow`/`exceptionNow` là **bản non-blocking**; `state` trả về **`RUNNING`, `SUCCESS`, `FAILED`, hoặc `CANCELLED`**. Việc **cancel task luôn cần sự hợp tác từ người viết task**. Xem [[04 - Coordinating Tasks#10.4.1. Callables and Futures]].

**FutureTask**
Class **implement cả `Future` lẫn `Runnable`**, nên bạn **dựng được một thread để chạy một `Callable`**. Xem [[04 - Coordinating Tasks#10.4.1. Callables and Futures]].

## I

**InheritableThreadLocal**
Subclass của `ThreadLocal`, dùng để **lan truyền dữ liệu thread-local xuống subtask**. Thread mới **nhận một bản copy các inheritable thread local của parent** — bản copy là cần thiết vì **thread con có thể mutate các giá trị đó**. Xem [[04 - Coordinating Tasks#10.4.4. Thread-Local Variables]].

**Interrupted Status**
**Cờ boolean có trong mọi thread**, được set khi `interrupt` được gọi lên thread đó. **Không có cách nào ép một thread terminate** — `interrupt` chỉ **gây sự chú ý của nó**. Nếu thread đang block ở `sleep`/`wait` thì **lời gọi đang block bị kết thúc bằng `InterruptedException`**. Lưu ý `sleep` **xoá status rồi ném exception**. Xem [[03 - Thread Properties#10.3.2. Thread Interruption]].

**Intrinsic Lock**
Lock mà **mọi object trong Java đều có, ngay từ phiên bản 1.0**. Method khai báo `synchronized` thì **lock của object bảo vệ toàn bộ method**. Intrinsic lock **chỉ có một condition đi kèm**, truy cập bằng `wait`/`notifyAll`/`notify`. Hạn chế: **virtual thread bị pinned**, **không interrupt được**, **không đặt timeout được**, và **một condition mỗi lock có thể kém hiệu quả**. Xem [[05 - Synchronization#10.5.6. The synchronized Keyword]].

## L

**Lock**
Cơ chế **bảo vệ các đoạn code, chỉ cho một thread thực thi code tại một thời điểm**, và **quản lý các thread đang cố vào critical section**. Khung cơ bản là `lock()` rồi `try { … } finally { unlock(); }` — **thao tác `unlock` bắt buộc phải nằm trong `finally`**. Không dùng được try-with-resources vì **`unlock` không tên là `close`**. Xem [[05 - Synchronization#10.5.3. Lock Objects]].

**LongAdder / LongAccumulator**
Class giải quyết vấn đề **hiệu năng sụt khi rất nhiều thread truy cập cùng một giá trị atomic**. `LongAdder` **gồm nhiều biến mà tổng của chúng là giá trị hiện tại**; nhiều thread **cập nhật các số hạng khác nhau**. `LongAccumulator` **tổng quát hoá cho một thao tác tích luỹ bất kỳ** — thao tác đó **phải có tính kết hợp và giao hoán**. Cũng có `DoubleAdder` và `DoubleAccumulator`. Xem [[05 - Synchronization#10.5.11. Atomics]].

## M

**Monitor**
Khái niệm do **Per Brinch Hansen và Tony Hoare tiên phong vào thập niên 1970**: một class **chỉ có field `private`**, **mỗi object có một lock đi kèm**, **mọi method đều bị lock đó khoá**, và **lock có thể có bao nhiêu condition cũng được**. Java **phỏng theo một cách lỏng lẻo** và **khác monitor ở ba điểm làm tổn hại thread safety**: field không bắt buộc `private`, method không bắt buộc `synchronized`, **intrinsic lock lộ ra cho client**. Xem [[05 - Synchronization#10.5.8. The Monitor Concept]].

## N

**New (thread state)**
Trạng thái của thread **vừa được tạo bằng `new Thread(r)` nhưng chưa chạy code nào**. Xem [[02 - Thread States#10.2.1. New Threads]].

## P

**Parallelism Threshold**
Tham số phải chỉ định cho **mọi bulk operation trên concurrent hash map**. Nếu map **chứa nhiều phần tử hơn threshold thì thao tác được song song hoá**. Dùng **`Long.MAX_VALUE` để chạy trong một thread duy nhất**, dùng **1 để huy động số thread tối đa**. Xem [[06 - Thread-Safe Collections#10.6.4. Bulk Operations on Concurrent Hash Maps]].

**Pinning**
Hiện tượng **virtual thread không unmount khỏi carrier thread được cho tới khi intrinsic lock được nhả**. **Không phải vấn đề nếu critical section được thoát ngay**, nhưng nếu **virtual thread block trong lúc bị pinned** thì có thể **giảm nghiêm trọng throughput và gây đói carrier thread pool**. Phát hiện bằng `-Djdk.tracePinnedThreads=short|full`. Xem [[05 - Synchronization#10.5.6. The synchronized Keyword]].

**Platform Thread**
Thread **do hệ điều hành cung cấp** — mặc định mọi Java thread chạy trên một platform thread. **Không nhẹ**: cần **vài nghìn chỉ thị CPU để khởi động** và **tiêu tốn một lượng bộ nhớ đáng kể**, nên **số lượng bị giới hạn**. Xem [[03 - Thread Properties#10.3.1. Virtual Threads]].

**Poison Pill**
Thuật ngữ một số lập trình viên dùng cho **object báo hiệu kết thúc cho các consumer**. Trong ví dụ của sách, enumeration thread **đặt một object kết thúc đặc biệt vào queue**, ví như **"một cái vali giả gắn nhãn 'kiện cuối cùng' trên băng chuyền hành lý"**. Xem [[06 - Thread-Safe Collections#10.6.1. Blocking Queues]].

## R

**Race Condition**
Tình huống **hai thread trở lên cùng truy cập một object và mỗi thread gọi method sửa state của nó**, khiến **tuỳ thứ tự truy cập mà sinh ra object bị hỏng**. Nguyên nhân gốc: **công việc của method có thể bị preempt giữa chừng**. Xem [[05 - Synchronization#10.5. Synchronization]] và [[05 - Synchronization#10.5.2. The Race Condition Explained]].

**Reentrant Lock**
Lock mà **một thread có thể lấy đi lấy lại nếu nó đã sở hữu**. Lock có một **hold count** theo dõi **các lời gọi `lock` lồng nhau**; thread phải **gọi `unlock` đúng số lần đã gọi `lock`**. Nhờ vậy **code được lock bảo vệ có thể gọi method khác dùng cùng lock đó**. Xem [[05 - Synchronization#10.5.3. Lock Objects]].

**Runnable**
Interface đóng gói **một task chạy bất đồng bộ** — có thể hình dung như một **method bất đồng bộ không có parameter và không có giá trị trả về**. Xem [[01 - Running Threads#10.1. Running Threads]] và [[04 - Coordinating Tasks#10.4.1. Callables and Futures]].

**Runnable (thread state)**
Trạng thái sau khi gọi `start`. Thread runnable **có thể đang chạy hoặc không** — tuỳ vào việc **hệ điều hành có cấp thời gian chạy cho nó hay chưa**. Xem [[02 - Thread States#10.2.2. Runnable Threads]].

## S

**Safe Publication**
Việc đảm bảo **mọi field của một object đều nhìn thấy được với giá trị đã set trong constructor**. Được đảm bảo khi reference của object được lưu: trong một **static initializer**, trong một **field `volatile` hoặc `AtomicReference`**, trong **field bất kỳ khi phép gán được lock bảo vệ**, hoặc trong một **field `final` của object dựng đúng cách**. Xem [[05 - Synchronization#10.5.13. Safe Publication]].

**Scoped Value**
Tính năng preview của **Java 21**, cung cấp **phiên bản hiệu năng tốt hơn của inheritable thread-local variable**. Scoped value **có instance riêng cho mỗi thread**, nhưng **immutable và có vòng đời giới hạn**, và **được kế thừa trong các virtual thread do `StructuredTaskScope` tạo**. Khi dùng virtual thread thì **nên ưu tiên scoped value hơn thread-local variable**. Xem [[04 - Coordinating Tasks#10.4.4. Thread-Local Variables]].

**Structured Concurrency**
Nỗ lực **tìm ra các cấu trúc lập trình giúp suy luận về chương trình concurrent dễ hơn** — cũng như structured programming từng thay `goto` bằng rẽ nhánh, vòng lặp và function. **Java 21 chứa bản preview** của API này: task được **submit vào một `StructuredTaskScope`**, `join` **block cho tới khi scope shut down** theo policy **`ShutdownOnFailure`** hoặc **`ShutdownOnSuccess`**. Xem [[04 - Coordinating Tasks#10.4.3. Invoking a Group of Tasks]].

**synchronized**
Keyword khiến **lock của object bảo vệ toàn bộ method** — thread phải **lấy được intrinsic object lock để gọi method**. Tương đương `intrinsicLock.lock()` + `try`/`finally` + `unlock()`. **Static method cũng khai báo `synchronized` được**, khi đó nó **lấy intrinsic lock của class object**. Khuyến nghị của sách: **tốt nhất là không dùng cả `Lock`/`Condition` lẫn `synchronized`**, mà dùng cơ chế của `java.util.concurrent`. Xem [[05 - Synchronization#10.5.6. The synchronized Keyword]].

**Synchronized Block**
Cơ chế thứ hai để lấy lock của một object: `synchronized (obj) { … }`. Đôi khi gặp **lock "ad hoc"** — object tạo ra **chỉ để dùng cái lock mà mọi object Java đều có**. Cẩn thận: **đừng khoá trên string literal** (bị chia sẻ), **đừng khoá trên primitive type wrapper**, và **khoá trên `MyClass.class` chứ không phải `getClass()`**. Xem [[05 - Synchronization#10.5.7. Synchronized Blocks]].

**Synchronization Wrapper**
Cách làm **bất kỳ class collection nào cũng thành thread-safe**, ví dụ `Collections.synchronizedList(new ArrayList<>())`. Phải đảm bảo **không thread nào truy cập qua các method không synchronized ban đầu**. Thường thì **dùng collection trong `java.util.concurrent` tốt hơn** — ngoại lệ là **array list bị mutate thường xuyên**. Xem [[06 - Thread-Safe Collections#10.6.8. Older Thread-Safe Collections]].

## T

**Terminated (thread state)**
Trạng thái thread sau khi **method `run` return bình thường**, hoặc sau khi **một exception không được catch kết thúc method `run`**. Xem [[02 - Thread States#10.2.4. Terminated Threads]].

**Thread Factory**
Interface **`ThreadFactory` chỉ có một method `newThread(Runnable r)`**, sinh ra một instance thread mới sẽ thực thi `Runnable` cho trước. Từ **Java 21** có **cú pháp builder**: `Thread.ofPlatform()` / `Thread.ofVirtual()`. Xem [[03 - Thread Properties#10.3.7. Thread Factories and Builders]].

**Thread Group**
**Tập hợp các thread quản lý được cùng nhau**, về mặt kỹ thuật là nơi **định nghĩa uncaught exception handler**. Mặc định **mọi thread bạn tạo đều thuộc cùng một thread group**. Tác giả **khuyến nghị đừng dùng thread group** vì đã có tính năng tốt hơn. Xem [[03 - Thread Properties#10.3.5. Handlers for Uncaught Exceptions]].

**Thread-Local Variable**
**Không phải một biến thực sự**, mà là **object mà method `get`/`set` truy cập một giá trị phụ thuộc vào thread hiện tại**. Dùng để **cho một object riêng của task khả dụng cho mọi method mà không phải truyền làm parameter**. **Bắt buộc gọi `remove()` khi task hoàn tất** nếu chạy trên thread pool. Xem [[04 - Coordinating Tasks#10.4.4. Thread-Local Variables]] và [[05 - Synchronization#10.5.14. Sharing with Thread-Local Variables]].

**Thread Pool**
Tập hợp **các thread đã sẵn sàng chạy task của bạn**. Bạn **submit task `Runnable` hoặc `Callable` vào pool**, một thread gọi `run`/`call`, và **khi method thoát thì thread không chết mà ở lại phục vụ request tiếp theo**. **Virtual thread không bao giờ nên pool.** Xem [[04 - Coordinating Tasks#10.4.2. Executors]].

**Thread Priority**
Giá trị từ **`MIN_PRIORITY` (1)** tới **`MAX_PRIORITY` (10)**, mặc định **`NORM_PRIORITY` (5)**; thread **kế thừa priority của thread đã dựng ra nó**. **Phụ thuộc rất nhiều vào hệ thống** — trên **OpenJDK VM cho Linux, thread priority bị bỏ qua hoàn toàn**. **Ngày nay không nên dùng.** Xem [[03 - Thread Properties#10.3.6. Thread Priorities]].

**Timed Waiting (thread state)**
Trạng thái khi thread gọi method **có tham số timeout** như `Thread.sleep`, `Object.wait`, `Thread.join`, `Lock.tryLock`, `Condition.await` có timeout. Xem [[02 - Thread States#10.2.3. Blocked and Waiting Threads]].

## U

**Uncaught Exception Handler**
Handler nhận exception **ngay trước khi thread chết**, khi method `run` **bị kết thúc bởi một unchecked exception** mà **không có mệnh đề `catch` nào để exception lan tới**. Phải thuộc class implement **`Thread.UncaughtExceptionHandler`** với method duy nhất `uncaughtException`. Nếu không cài handler thì mặc định **in tên thread và stack trace ra `System.err`**. Xem [[03 - Thread Properties#10.3.5. Handlers for Uncaught Exceptions]].

## V

**Virtual Thread**
Thread có từ **Java 21**, **được mount lên một platform thread** và **unmount khi gặp blocking operation**, rồi **remount khi có platform thread rảnh**. Tên gọi **tương tự virtual memory**: nhiều virtual thread **được mount lên một số ít carrier thread**. **Có cùng API với platform thread**; `isVirtual` trả về `true`. **Mọi virtual thread đều là daemon và đều có priority `NORM_PRIORITY`.** Xem [[03 - Thread Properties#10.3.1. Virtual Threads]].

**volatile**
Keyword cung cấp **cơ chế lock-free để synchronize truy cập vào một instance field**. Compiler và virtual machine **tính đến việc field có thể bị thread khác cập nhật đồng thời**, và **chèn code đảm bảo thay đổi ở một thread là nhìn thấy được từ thread khác**. **Không cung cấp tính atomic nào** — `done = !done;` **vẫn không an toàn**. Xem [[05 - Synchronization#10.5.9. Volatile Fields]].

## W

**Waiting (thread state)**
Trạng thái khi thread **chờ một thread khác thông báo về sự thay đổi trạng thái**, ví dụ sau khi gọi `Object.wait`, `Thread.join`, hoặc chờ một `Lock`/`Condition` của `java.util.concurrent`. Xem [[02 - Thread States#10.2.3. Blocked and Waiting Threads]].

**Weakly Consistent Iterator**
Iterator do các concurrent collection trả về: **có thể phản ánh hoặc không phản ánh mọi thay đổi sau khi nó được dựng**, nhưng **không trả về một giá trị hai lần** và **không ném `ConcurrentModificationException`**. Ngược lại, iterator của collection trong `java.util` **ném `ConcurrentModificationException`** khi collection bị sửa sau khi iterator được dựng. Xem [[06 - Thread-Safe Collections#10.6.2. Efficient Maps, Sets, and Queues]].

**Work Stealing**
Heuristic mà **fork-join framework dùng để cân bằng khối lượng công việc**. Mỗi worker thread có một **deque chứa task**; nó **đẩy subtask nhỏ hơn vào đầu deque của mình** (không cần lock vì chỉ một thread truy cập phần đầu). Khi rảnh, nó **"ăn cắp" một task từ đuôi deque khác** (cần lock). Ăn cắp **subtask lớn ở đuôi** làm **giảm tranh chấp**. Xem [[04 - Coordinating Tasks#10.4.5. The Fork-Join Framework]].

---

## Khẩu hiệu synchronization (Brian Goetz)

> *"If you write a variable which may next be read by another thread, or you read a variable which may have last been written by another thread, you must use synchronization."*

**Dịch:** Nếu bạn **ghi một biến mà kế đó có thể bị thread khác đọc**, hoặc **đọc một biến mà lần ghi cuối có thể do thread khác thực hiện**, thì **bạn phải dùng synchronization**.

Xem [[05 - Synchronization#10.5.9. Volatile Fields]].
