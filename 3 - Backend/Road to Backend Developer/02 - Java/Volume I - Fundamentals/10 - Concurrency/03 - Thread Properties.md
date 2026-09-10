# 03 — Thread Properties

> Chapter 10, Section 10.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.3. Thread Properties

> *"In the following sections, we discuss the various properties of threads: platform and virtual threads, the interrupted status, daemon threads, handlers for uncaught exceptions, as well as some legacy features that you should not use."*

**Dịch:** Các phần sau bàn về các **property của thread**: platform thread và virtual thread, **interrupted status**, **daemon thread**, **handler cho uncaught exception**, cùng một số **tính năng legacy mà bạn không nên dùng**.

---

## 10.3.1. Virtual Threads

> *"By default, a Java thread runs on a platform thread provided by the operating system in which the Java virtual machine executes. For many workloads, this is a good arrangement since operating systems have evolved to do a good job of thread scheduling."*

**Dịch:** Mặc định, một Java thread **chạy trên một platform thread do hệ điều hành cung cấp**. Với nhiều loại workload thì đây là sắp xếp tốt, vì hệ điều hành đã tiến hoá để **làm tốt việc thread scheduling**.

> *"However, platform threads are not lightweight. They require a few thousand CPU instructions to start, and they consume (or at least reserve) a significant amount of memory. This limits the number of platform threads that the CPU can handle."*

**Dịch:** Tuy nhiên, **platform thread không nhẹ**. Chúng cần **vài nghìn chỉ thị CPU để khởi động**, và **tiêu tốn (hoặc ít nhất là giữ chỗ) một lượng bộ nhớ đáng kể**. Điều này **giới hạn số platform thread mà CPU xử lý được**.

> *"This is a problem for some classes of applications. A typical web application would like to serve a very large number of concurrent requests, many more than there are platform threads. The application can handle the workload because the tasks don't do CPU-intensive work. Each task spends most of its time blocking on database queries or other external requests."*

**Dịch:** Đây là vấn đề với một số loại application. Một web application điển hình muốn phục vụ **rất nhiều request đồng thời**, nhiều hơn hẳn số platform thread. Application vẫn kham nổi workload vì **task không làm việc nặng về CPU** — mỗi task **dành phần lớn thời gian block trên truy vấn database hoặc request bên ngoài**.

### Giải pháp non-blocking API và cái giá của nó

> *"One solution is to use a non-blocking API for the requests. Instead of a synchronous call"*

```java
response = service.request(parameters);
process(response);
```

> *"pass the processing code as a callback:"*

```java
service.request(parameters, response -> process(response));
```

> *"Then the call to request returns immediately without blocking, freeing its thread to serve additional requests. The callback is invoked when the response is available."*

**Dịch:** Một giải pháp là dùng **non-blocking API** cho các request. Thay vì gọi **đồng bộ**, hãy **truyền code xử lý vào dưới dạng callback**. Khi đó lời gọi `request` **trả về ngay lập tức không block**, giải phóng thread của nó để phục vụ thêm request. **Callback được gọi khi response sẵn sàng**.

> *"Non-blocking APIs provide high throughput, but at a steep cost for the programmer. Instead of using familiar programming constructs for sequences, branches, loops, and exception handling, all program logic must be placed into callback code."*

**Dịch:** Non-blocking API cho **throughput cao**, nhưng **cái giá với lập trình viên là rất đắt**. Thay vì dùng những cấu trúc lập trình quen thuộc cho tuần tự, rẽ nhánh, [[07 - Control Flow|vòng lặp]] và xử lý exception, **toàn bộ logic chương trình phải nhét vào code callback**.

### Virtual thread

> *"Virtual threads, available in Java 21, are an attractive alternative. A virtual thread is mounted on a platform thread and unmounted when it encounters a blocking operation. When the result of the operation becomes available, the virtual thread can again be scheduled, and it is remounted when a platform thread becomes available."*

**Dịch:** **Virtual thread**, có từ **Java 21**, là một lựa chọn thay thế hấp dẫn. Một virtual thread được **mount lên một platform thread**, và **unmount khi nó gặp một blocking operation**. Khi kết quả của thao tác đó sẵn sàng, virtual thread **lại được lên lịch**, và nó **được remount khi có platform thread rảnh**.

> *"The term "virtual thread" is meant to be analogous to virtual memory. Just like virtual memory is mapped to a smaller amount of actual RAM, virtual threads are mounted on a smaller number of platform threads. These platform threads are called the carrier threads. By default, the scheduler uses one carrier thread per processor. This can be tuned with the jdk.virtualThreadScheduler.parallelism VM option."*

**Dịch:** Thuật ngữ **"virtual thread"** được đặt để **tương tự virtual memory**. Cũng như virtual memory được map vào một lượng RAM thật nhỏ hơn, **virtual thread được mount lên một số lượng platform thread nhỏ hơn**. Các platform thread đó gọi là **carrier thread**. Mặc định, scheduler dùng **một carrier thread cho mỗi processor**. Có thể tinh chỉnh bằng VM option `jdk.virtualThreadScheduler.parallelism`.

```
  virtual threads (rất nhiều)
  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐ . . .
  └─┬─┘└─┬─┘└─┬─┘└─┬─┘└─┬─┘└─┬─┘└─┬─┘
    │ mount / unmount khi gặp blocking operation
    ▼
  ┌──────────────┐  ┌──────────────┐
  │ carrier      │  │ carrier      │   ← platform threads (ít, mặc định 1/processor)
  │ thread       │  │ thread       │
  └──────────────┘  └──────────────┘
```

> *"Virtual threads have the same API as platform threads. A simple way to create and start a virtual thread is:"*

```java
Thread t = Thread.startVirtualThread(myRunnable);
```

> *"The isVirtual method of the Thread class returns true when a thread is virtual."*

**Dịch:** Virtual thread có **cùng API với platform thread**. Method `isVirtual` của class `Thread` **trả về `true` khi thread là virtual**.

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean isVirtual()` (21) | trả về `true` khi thread này là **virtual**. |
| `static Thread startVirtualThread(Runnable task)` (21) | **khởi động và trả về** một virtual thread chạy task cho trước. |

---

## 10.3.2. Thread Interruption

> *"A thread terminates when its run method returns—by executing a return statement, after executing the last statement in the method body, or if an exception occurs that is not caught in the method."*

**Dịch:** Một thread **terminate khi method `run` của nó return** — bằng câu lệnh `return`, sau khi thực thi câu lệnh cuối trong thân method, hoặc khi **một exception xảy ra mà không được catch trong method**.

> **Caution (sách):** *"In the initial release of Java, there also was a stop method that another thread could call to terminate a thread. However, that method was soon recognized to be unsafe and now throws an UnsupportedOperationException instead of stopping the thread."*
>
> **Dịch:** Ở bản Java đầu tiên còn có method `stop` để một thread khác gọi nhằm kết thúc một thread. Tuy nhiên, method đó **sớm bị nhận ra là không an toàn** và giờ **ném `UnsupportedOperationException`** thay vì dừng thread.

> *"There is no way to force a thread to terminate. However, the interrupt method can be used to request termination of a thread."*

**Dịch:** **Không có cách nào ép một thread terminate.** Tuy nhiên, method **`interrupt`** dùng được để **yêu cầu một thread kết thúc**.

> *"When the interrupt method is called on a thread, the interrupted status of the thread is set. This is a boolean flag that is present in every thread. Each thread should occasionally check whether it has been interrupted."*

**Dịch:** Khi method `interrupt` được gọi lên một thread, **interrupted status của thread được set**. Đây là một **cờ boolean có trong mọi thread**. Mỗi thread **nên thỉnh thoảng kiểm tra xem nó đã bị interrupt chưa**.

> *"To find out whether the interrupted status was set, first call the static Thread.currentThread method to get the current thread, and then call the isInterrupted method:"*

```java
while (!Thread.currentThread().isInterrupted() && more work to do)
{
    do more work
}
```

**Dịch:** Để biết interrupted status đã được set chưa, trước hết gọi static method **`Thread.currentThread`** để lấy thread hiện tại, rồi gọi **`isInterrupted`**.

> *"However, if a thread is blocked, it cannot check the interrupted status. This is where the InterruptedException comes in. When the interrupt method is called on a thread that blocks on a call such as sleep or wait, the blocking call is terminated by an InterruptedException. There are blocking I/O calls that cannot be interrupted. Then the InterruptedException is thrown when the I/O operation has completed."*

**Dịch:** Tuy nhiên, **nếu thread đang bị blocked thì nó không kiểm tra được interrupted status**. Đây là chỗ **`InterruptedException`** xuất hiện. Khi `interrupt` được gọi lên một thread đang block ở lời gọi như `sleep` hay `wait`, **lời gọi đang block bị kết thúc bằng một `InterruptedException`**. Có những **lời gọi blocking I/O không interrupt được** — khi đó `InterruptedException` **được ném sau khi thao tác I/O hoàn tất**.

> *"There is no language requirement that a thread which is interrupted should terminate. Interrupting a thread simply grabs its attention. The interrupted thread can decide how to react to the interruption. Some threads are so important that they should handle the exception and continue. But far more often, a thread will simply want to interpret an interruption as a request for termination. The run method of such a thread has the following form:"*

```java
Runnable r = () ->
{
    try
    {
        . . .
        while (!Thread.currentThread().isInterrupted() && more work to do)
        {
            do more work
        }
    }
    catch (InterruptedException e)
    {
        // thread was interrupted
    }
    finally
    {
        cleanup, if required
    }
    // exiting the run method terminates the thread
};
```

**Dịch:** **Ngôn ngữ không quy định** rằng một thread bị interrupt thì phải terminate. **Interrupt một thread chỉ đơn giản là gây sự chú ý của nó.** Thread bị interrupt **tự quyết định phản ứng thế nào**. Một số thread quan trọng tới mức nên **xử lý exception rồi tiếp tục**. Nhưng thường xuyên hơn nhiều, thread sẽ muốn **hiểu interruption là một yêu cầu kết thúc**.

> *"The isInterrupted check is neither necessary nor useful if you call the sleep method (or another interruptible method) after every work iteration. If you call the sleep method when the interrupted status is set, it doesn't sleep. Instead, it clears the status (!) and throws an InterruptedException. Therefore, if your loop calls sleep, don't check the interrupted status. Instead, catch the InterruptedException, like this:"*

```java
Runnable r = () ->
{
    try
    {
        . . .
        while (more work to do)
        {
            do more work
            Thread.sleep(delay);
        }
    }
    catch (InterruptedException e)
    {
        // thread was interrupted during sleep
    }
    finally
    {
        cleanup, if required
    }
    // exiting the run method terminates the thread
};
```

**Dịch:** Việc kiểm tra `isInterrupted` là **không cần thiết cũng không hữu ích** nếu bạn gọi `sleep` (hoặc method interrupt được khác) sau **mỗi vòng làm việc**. Nếu bạn gọi `sleep` **khi interrupted status đang được set**, nó **không sleep**. Thay vào đó nó **xoá status (!)** và **ném `InterruptedException`**. Vậy nên, **nếu vòng lặp có gọi `sleep` thì đừng kiểm tra interrupted status** — hãy catch `InterruptedException`.

> **Note (sách):** *"There are two very similar methods, interrupted and isInterrupted. The interrupted method is a static method that checks whether the current thread has been interrupted. Furthermore, calling the interrupted method clears the interrupted status of the thread. On the other hand, the isInterrupted method is an instance method that you can use to check whether any thread has been interrupted. Calling it does not change the interrupted status."*
>
> **Dịch:** Có **hai method rất giống nhau**: `interrupted` và `isInterrupted`.
>
> | Method | Loại | Tác dụng phụ |
> |---|---|---|
> | `interrupted` | **static** — kiểm tra **thread hiện tại** | **xoá interrupted status** của thread |
> | `isInterrupted` | **instance** — kiểm tra **thread bất kỳ** | **không đổi** interrupted status |

### Đừng nuốt InterruptedException

> *"You'll find lots of published code in which the InterruptedException is squelched at a subtask level, like this:"*

```java
void mySubTask()
{
    . . .
    try
    {
        sleep(delay);
    }
    catch (InterruptedException e)
    {
        // Nothing here--BAD
    }
    . . .
}
```

> *"Don't do that! If you do, the task cannot be interrupted while it is sleeping. You have two reasonable choices:"*

**Dịch:** Bạn sẽ thấy rất nhiều code công bố ngoài kia **nuốt (squelch) `InterruptedException` ở mức subtask**. **Đừng làm thế!** Nếu làm vậy, **task không thể bị interrupt trong lúc đang sleep**. Bạn có **hai lựa chọn hợp lý**.

> *"Tag your method with throws InterruptedException and drop the try block. Then the caller (or, ultimately, the run method) can catch it."*

```java
void mySubTask() throws InterruptedException
{
    . . .
    sleep(delay);
    . . .
}
```

**Dịch:** **Cách 1:** gắn `throws InterruptedException` cho method và **bỏ khối `try`**. Khi đó **caller** (hoặc rốt cuộc là method `run`) **catch được nó**.

> *"If you cannot do that, set the interrupted status in the catch clause. Then the caller can test it."*

```java
void mySubTask()
{
    . . .
    try
    {
        sleep(delay);
    }
    catch (InterruptedException e)
    {
        Thread.currentThread().interrupt();
    }
    . . .
}
```

**Dịch:** **Cách 2:** nếu không làm được như trên, hãy **set lại interrupted status trong mệnh đề `catch`**. Khi đó caller **kiểm tra được nó**.

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void interrupt()` | gửi **interrupt request** tới một thread. Interrupted status của thread được set thành `true`. Nếu thread đang blocked thì **`InterruptedException` được ném**. |
| `static boolean interrupted()` | kiểm tra xem **thread hiện tại** (thread đang thực thi chỉ thị này) đã bị interrupt chưa. Đây là **static method**. Lời gọi có **tác dụng phụ**: nó **reset interrupted status của thread hiện tại về `false`**. |
| `boolean isInterrupted()` | kiểm tra xem một thread đã bị interrupt chưa. Khác với static `interrupted`, lời gọi này **không đổi interrupted status của thread**. |
| `static Thread currentThread()` | trả về object `Thread` đại diện cho **thread đang thực thi hiện tại**. |

---

## 10.3.3. Daemon Threads

> *"You can turn a thread into a daemon thread by calling"*

```java
t.setDaemon(true);
```

> *"There is nothing demonic about such a thread. A daemon is simply a thread that has no other role in life than to serve others. Examples are timer threads that send regular "timer ticks" to other threads or threads that clean up stale cache entries."*

**Dịch:** **Chẳng có gì "ma quỷ"** ở thread như vậy cả. **Daemon đơn giản là một thread không có vai trò gì khác ngoài phục vụ những thread khác.** Ví dụ: timer thread gửi "timer tick" đều đặn cho các thread khác, hoặc thread dọn dẹp các cache entry cũ.

> *"When only daemon threads remain, the virtual machine exits. There is no point in keeping the program running if all remaining threads are daemons."*

**Dịch:** **Khi chỉ còn lại daemon thread, virtual machine thoát.** Chẳng có lý do gì giữ chương trình chạy nếu **mọi thread còn lại đều là daemon**.

> *"All virtual threads are daemon threads. Calling setDaemon(false) has no effect on a virtual thread."*

**Dịch:** **Mọi virtual thread đều là daemon thread.** Gọi `setDaemon(false)` lên một virtual thread **không có tác dụng gì**.

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setDaemon(boolean isDaemon)` | đánh dấu thread này là **daemon thread** hay **user thread**. Method này **phải được gọi trước khi thread được start**. |

---

## 10.3.4. Thread Names and Ids

> *"By default, threads have catchy names such as Thread-2. You can set any name with the setName method:"*

```java
var t = new Thread(runnable);
t.setName("Web crawler");
```

> *"That can be useful in thread dumps."*

**Dịch:** Mặc định thread có những **cái tên "kêu"** kiểu `Thread-2`. Bạn đặt tên tuỳ ý được bằng method `setName`. Điều đó **hữu ích khi xem thread dump**.

> *"Each thread also has a positive ID number that you can retrieve as"*

```java
long id = t.threadId();
```

**Dịch:** Mỗi thread cũng có **một số ID dương** mà bạn lấy được như trên.

> **Caution (sách):** *"There is also a getId method. It is deprecated because it was not defined as final. Someone might override it to return something other than the thread ID. Call the final threadId method instead."*
>
> **Dịch:** Cũng có method `getId`. Nó **deprecated vì không được định nghĩa là `final`** — ai đó có thể **override nó để trả về thứ khác thay vì thread ID**. Hãy gọi method `final` là **`threadId`** thay thế.

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void setName(String name)`<br>`String getName()` | set hoặc lấy **tên** của thread này. |
| `long threadId()` (19) | trả về **ID duy nhất** của thread này. |

---

## 10.3.5. Handlers for Uncaught Exceptions

> *"The run method of a thread cannot throw any checked exceptions, but it can be terminated by an unchecked exception. In that case, the thread terminates. However, there is no catch clause to which the exception can be propagated. Instead, just before the thread dies, the exception is passed to a handler for uncaught exceptions."*

**Dịch:** Method `run` của một thread **không ném được checked exception nào**, nhưng **có thể bị kết thúc bởi một unchecked exception**. Trong trường hợp đó thread terminate. Tuy nhiên, **không có mệnh đề `catch` nào để exception lan tới**. Thay vào đó, **ngay trước khi thread chết, exception được chuyển cho một handler for uncaught exceptions**.

> *"The handler must belong to a class that implements the Thread.UncaughtExceptionHandler interface. That interface has a single method,"*

```java
void uncaughtException(Thread t, Throwable e)
```

**Dịch:** Handler **phải thuộc một class implement interface `Thread.UncaughtExceptionHandler`**. Interface đó **chỉ có một method**.

> *"You can install a handler into any thread with the setUncaughtExceptionHandler method. You can also install a default handler for all threads with the static method setDefaultUncaughtExceptionHandler of the Thread class. A replacement handler might use the logging API to send reports of uncaught exceptions into a log file. If you don't install a default handler, the default handler is null."*

**Dịch:** Bạn **cài handler vào bất kỳ thread nào** bằng `setUncaughtExceptionHandler`. Bạn cũng **cài được default handler cho mọi thread** bằng static method `setDefaultUncaughtExceptionHandler` của class `Thread`. Một handler thay thế có thể dùng [[05 - Logging|logging API]] để gửi báo cáo về uncaught exception vào file log. Nếu bạn không cài default handler thì **default handler là `null`**.

> *"If you don't install an uncaught exception handler for a thread, it uses a handler that takes the following actions:"*

**Dịch:** Nếu bạn không cài uncaught exception handler cho một thread, nó dùng một handler thực hiện **các hành động sau**:

| Thứ tự | Hành động (dịch từ sách) |
|---|---|
| 1 | Nếu thread group của thread có **parent**, thì method `uncaughtException` của **parent group** được gọi. (Điều này không phổ biến.) |
| 2 | Ngược lại, nếu `Thread.getDefaultUncaughtExceptionHandler` trả về một handler **khác `null`** thì handler đó được gọi. |
| 3 | Ngược lại, nếu `Throwable` là instance của class **deprecated `ThreadDeath`** (từng được dùng để stop một thread) thì **không có gì xảy ra**. |
| 4 | Ngược lại, **tên thread và stack trace** của `Throwable` được in ra **`System.err`**. |

> *"That is the stack trace that you have undoubtedly seen many times in your programs."*

**Dịch:** Đó chính là **stack trace mà chắc chắn bạn đã thấy rất nhiều lần** trong chương trình của mình.

> **Note (sách):** *"Technically, the uncaught exception handler is defined by a thread's thread group. A thread group is a collection of threads that can be managed together. By default, all threads that you create belong to the same thread group, but it is possible to establish other groupings. Since there are now better features for operating on collections of threads, I recommend that you do not use thread groups in your programs."*
>
> **Dịch:** Về mặt kỹ thuật, uncaught exception handler **được định nghĩa bởi thread group của thread**. **Thread group là một tập hợp các thread quản lý được cùng nhau.** Mặc định, mọi thread bạn tạo đều **thuộc cùng một thread group**, nhưng vẫn lập được các nhóm khác. Vì hiện đã có **những tính năng tốt hơn** để thao tác trên tập hợp thread, tác giả **khuyến nghị đừng dùng thread group** trong chương trình.

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static void setDefaultUncaughtExceptionHandler(Thread.UncaughtExceptionHandler handler)` (5.0)<br>`static Thread.UncaughtExceptionHandler getDefaultUncaughtExceptionHandler()` (5.0) | set hoặc lấy **default handler** cho uncaught exception. |
| `void setUncaughtExceptionHandler(Thread.UncaughtExceptionHandler handler)` (5.0)<br>`Thread.UncaughtExceptionHandler getUncaughtExceptionHandler()` (5.0) | set hoặc lấy handler cho uncaught exception. **Nếu không có handler nào được cài, object thread group chính là handler.** |

## API — `java.lang.Thread.UncaughtExceptionHandler` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void uncaughtException(Thread t, Throwable e)` | được định nghĩa để **log một báo cáo tuỳ chỉnh** khi một thread bị kết thúc bởi uncaught exception. |

## API — `java.lang.ThreadGroup` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void uncaughtException(Thread t, Throwable e)` | gọi method này của **parent thread group** nếu có parent, hoặc gọi **default handler** của class `Thread` nếu có default handler, hoặc nếu không thì **in stack trace ra standard error stream**. |

---

## 10.3.6. Thread Priorities

> *"Every thread has a priority. By default, a thread inherits the priority of the thread that constructed it. You can increase or decrease the priority of any platform thread with the setPriority method. You can set the priority to any value between MIN_PRIORITY (defined as 1 in the Thread class) and MAX_PRIORITY (defined as 10). NORM_PRIORITY is defined as 5."*

**Dịch:** **Mọi thread đều có một priority.** Mặc định, thread **kế thừa priority của thread đã dựng ra nó**. Bạn tăng hoặc giảm priority của **platform thread** bất kỳ bằng `setPriority`. Đặt được giá trị **từ `MIN_PRIORITY` (định nghĩa là 1) tới `MAX_PRIORITY` (định nghĩa là 10)**. `NORM_PRIORITY` được định nghĩa là **5**.

> *"Whenever the platform thread scheduler has a chance to pick a new thread, it prefers threads with higher priority. However, thread priorities are highly system-dependent. Since the Java virtual machine relies on the thread implementation of the host platform, the Java thread priorities are mapped to the priority levels of the host platform, which may have more or fewer thread priority levels."*

**Dịch:** Mỗi khi platform thread scheduler có cơ hội chọn thread mới, nó **ưu tiên thread có priority cao hơn**. Tuy nhiên, **thread priority phụ thuộc rất nhiều vào hệ thống**. Vì JVM dựa vào implementation thread của host platform, **Java thread priority được map vào các mức priority của host platform**, mà nền tảng đó có thể có **nhiều hoặc ít mức priority hơn**.

> *"For example, Windows has seven priority levels. Some of the Java priorities will map to the same operating system level. In the OpenJDK VM for Linux, thread priorities are ignored altogether—all threads have the same priority."*

**Dịch:** Ví dụ, **Windows có bảy mức priority**. Một số Java priority sẽ **map vào cùng một mức của hệ điều hành**. Trong **OpenJDK VM cho Linux, thread priority bị bỏ qua hoàn toàn** — mọi thread có **cùng priority**.

> *"Thread priorities may have been useful in early versions of Java that didn't use operating systems threads. You should not use them nowadays."*

**Dịch:** Thread priority có thể từng hữu ích ở các phiên bản Java đầu chưa dùng thread của hệ điều hành. **Ngày nay bạn không nên dùng chúng.**

> *"For backwards compatibility, all virtual threads have priority NORM_PRIORITY. Attempting to change the priority has no effect."*

**Dịch:** Vì lý do tương thích ngược, **mọi virtual thread đều có priority `NORM_PRIORITY`**. Cố đổi priority thì **không có tác dụng gì**.

## API — `java.lang.Thread` (Java 1.0)

| Method / Field | Mô tả (dịch từ sách) |
|---|---|
| `void setPriority(int newPriority)` | set priority của thread này. Priority phải **nằm giữa `Thread.MIN_PRIORITY` và `Thread.MAX_PRIORITY`**. Dùng `Thread.NORM_PRIORITY` cho priority thường. |
| `static int MIN_PRIORITY` | là priority **nhỏ nhất** một `Thread` có thể có. Giá trị **1**. |
| `static int NORM_PRIORITY` | là priority **mặc định** của một `Thread`. Giá trị **5**. |
| `static int MAX_PRIORITY` | là priority **lớn nhất** một `Thread` có thể có. Giá trị **10**. |

---

## 10.3.7. Thread Factories and Builders

> *"You often want to produce multiple threads with the same properties. The ThreadFactory interface has a single method"*

```java
Thread newThread(Runnable r)
```

> *"that produces a new thread instance which, when started, will execute the given Runnable."*

**Dịch:** Bạn thường muốn **tạo ra nhiều thread có cùng property**. Interface `ThreadFactory` **chỉ có một method**, sinh ra một **instance thread mới**, khi start sẽ **thực thi `Runnable` cho trước**.

> *"You can provide your own class that implements this interface, or, since Java 21, use a convenient builder syntax."*

**Dịch:** Bạn **tự cung cấp class implement interface này** được, hoặc từ **Java 21** dùng **cú pháp builder** tiện lợi.

> *"The static methods Thread.ofPlatform() and Thread.ofVirtual() yield builders for platform or virtual threads. You can customize the threads to be built:"*

```java
Thread.Builder builder = Thread.ofVirtual().name("request-", 1);
```

> *"See the API notes for additional customization methods."*

**Dịch:** Các static method **`Thread.ofPlatform()`** và **`Thread.ofVirtual()`** cho ra **builder** cho platform thread hoặc virtual thread. Bạn **tuỳ biến được các thread sẽ được dựng**.

> *"Then call either unstarted or start to get a single thread, or factory to get a thread factory:"*

```java
Thread t = builder.unstarted(myRunnable);
builder.start(myRunnable);
ThreadFactory factory = builder.factory();
t = factory.newThread(myRunnable);
```

**Dịch:** Sau đó gọi **`unstarted`** hoặc **`start`** để lấy **một thread**, hoặc **`factory`** để lấy một **thread factory**.

## API — `java.util.concurrent.ThreadFactory` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Thread newThread(Runnable r)` | tạo một thread mà khi start sẽ gọi method `run` của `Runnable` cho trước. |

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Thread.Builder.OfPlatform ofPlatform()` (21)<br>`Thread.Builder.OfVirtual ofVirtual()` (21) | tạo một **builder** cho platform thread hoặc virtual thread. |

## API — `java.lang.Thread.Builder` (Java 21)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Thread.Builder name(String prefix, long start)`<br>`Thread.Builder name(String name)` | khiến các thread được dựng **được đặt tên bằng prefix cho trước cộng một bộ đếm** bắt đầu từ giá trị `start`, hoặc bằng tên cho trước. |
| `ThreadFactory factory()` | cho ra một **factory** dựng thread theo cấu hình của builder này. |
| `Thread unstarted(Runnable task)`<br>`Thread start(Runnable task)` | dựng một thread thực thi task cho trước. **Method thứ hai start thread luôn.** |
| `Thread.Builder uncaughtExceptionHandler(Thread.UncaughtExceptionHandler ueh)` | khiến các thread được dựng **dùng uncaught exception handler cho trước**. |

## API — `java.lang.Thread.Builder.OfPlatform` (Java 21)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Thread.Builder.OfPlatform daemon()`<br>`Thread.Builder.OfPlatform daemon(boolean on)` | khiến các thread được dựng là **daemon thread**, trừ khi `on` là `false`. |
| `Thread.Builder.OfPlatform stackSize(long stackSize)`<br>`Thread.Builder.OfPlatform group(ThreadGroup group)`<br>`Thread.Builder.OfPlatform priority(int priority)` | khiến các thread được dựng có **stack size gợi ý**, **group**, hoặc **priority** cho trước (**không khuyến nghị**). |

---

## Bài kế tiếp

→ [[04 - Coordinating Tasks]] — `Callable` và `Future`, executor, gọi một nhóm task, thread-local variable, fork-join framework.
