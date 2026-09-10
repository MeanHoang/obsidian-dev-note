# 04 — Coordinating Tasks

> Chapter 10, Section 10.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.4. Coordinating Tasks

> *"It is common to break tasks into subtasks whose results are combined when they are available. In the following sections, you will see the tools that the Java concurrency framework provides for coordinating concurrent tasks."*

**Dịch:** Thường thì ta **chia task thành các subtask** rồi **gộp kết quả lại khi chúng sẵn sàng**. Các phần sau trình bày những công cụ mà **Java concurrency framework** cung cấp để **điều phối các concurrent task**.

---

## 10.4.1. Callables and Futures

> *"A Runnable encapsulates a task that runs asynchronously; you can think of it as an asynchronous method with no parameters and no return value. A Callable is similar to a Runnable, but it returns a value. The Callable interface is a parameterized type, with a single method call."*

```java
public interface Callable<V>
{
    V call() throws Exception;
}
```

**Dịch:** [[01 - Running Threads|`Runnable`]] đóng gói một task chạy **bất đồng bộ**; bạn có thể hình dung nó như một **method bất đồng bộ không có parameter và không có giá trị trả về**. **`Callable` tương tự `Runnable`, nhưng nó trả về một giá trị.** [[01 - Interfaces|Interface]] `Callable` là một **parameterized type** ([[08 - Generic Programming|generic]]), **chỉ có một method là `call`**.

> *"The type parameter is the type of the returned value. For example, a Callable<Integer> represents an asynchronous task that eventually returns an Integer object."*

**Dịch:** **Type parameter chính là kiểu của giá trị trả về.** Ví dụ `Callable<Integer>` đại diện cho một task bất đồng bộ mà **rốt cuộc sẽ trả về một object `Integer`**.

> *"A Future holds the result of an asynchronous task. When you schedule a task for execution, you receive a Future object. Using the Future object, you can obtain the result when it is ready."*

**Dịch:** **`Future` nắm giữ kết quả của một task bất đồng bộ.** Khi bạn lên lịch cho một task chạy, **bạn nhận về một object `Future`**. Dùng object `Future` đó, bạn **lấy được kết quả khi nó sẵn sàng**.

> *"The Future<V> interface has the following methods:"*

```java
V get()
V get(long timeout, TimeUnit unit)
V resultNow()
Throwable exceptionNow()
void cancel(boolean mayInterrupt)
boolean isCancelled()
boolean isDone()
Future.State state()
```

### Các method của `Future`

> *"A call to the first get method blocks until the task is finished. The second get method also blocks, but it throws a TimeoutException if the call timed out before the task finished. If the thread running the task is interrupted, both methods throw an InterruptedException. If the task was terminated with an exception, the get methods throw an ExecutionException whose cause is the terminating exception. If the task has already finished, get returns immediately."*

**Dịch:** Lời gọi tới `get` thứ nhất **block cho tới khi task xong**. `get` thứ hai cũng block, nhưng **ném `TimeoutException` nếu hết thời gian chờ trước khi task xong**. Nếu thread đang chạy task **bị interrupt**, cả hai method đều ném **`InterruptedException`**. Nếu task bị kết thúc bởi một exception, các method `get` ném **`ExecutionException` mà cause chính là exception đã kết thúc task**. Nếu task **đã xong rồi thì `get` trả về ngay**.

> *"The resultNow method is a non-blocking version of get that you should only call if you know that the task has completed successfully. If you know that the task has failed, you can retrieve the terminating exception with the exceptionNow method."*

**Dịch:** `resultNow` là **phiên bản non-blocking của `get`**, chỉ nên gọi khi bạn **biết chắc task đã hoàn tất thành công**. Nếu bạn biết task đã thất bại, lấy exception kết thúc bằng **`exceptionNow`**.

> *"You can attempt to cancel the task with the cancel method. If the task has not yet started, it is canceled and will never start. If the task is currently in progress, it is interrupted if the mayInterrupt parameter is true, and otherwise runs to completion."*

**Dịch:** Bạn **thử huỷ task bằng method `cancel`**. Nếu task **chưa start** thì nó bị huỷ và **sẽ không bao giờ start**. Nếu task **đang chạy dở**, nó **bị interrupt nếu parameter `mayInterrupt` là `true`**, còn không thì **chạy tới hết**.

> **Caution (sách):** *"Task cancelation in Java always requires cooperation from the task implementor. As described in Section 10.3.2, the task needs to monitor the interrupted status of the thread."*
>
> **Dịch:** Việc huỷ task trong Java **luôn cần sự hợp tác từ người viết task**. Như đã mô tả ở [[03 - Thread Properties#10.3.2. Thread Interruption|Section 10.3.2]], **task phải tự theo dõi interrupted status của thread**.

> *"The isDone method returns true if the task has completed (successfully or unsuccessfully), or it has been canceled."*

**Dịch:** `isDone` trả về `true` nếu task **đã hoàn tất (thành công hay không)**, hoặc **đã bị huỷ**.

> *"The state method returns the task state as a value of the Task.State enumeration with four values:"*

**Dịch:** `state` trả về **trạng thái của task** dưới dạng giá trị của enumeration `Task.State` với **bốn giá trị**:

| Giá trị | Ý nghĩa (dịch từ sách) |
|---|---|
| `RUNNING` | Task **chưa hoàn tất** và **chưa bị cancel**. |
| `SUCCESS` | Task đã **hoàn tất thành công**. |
| `FAILED` | Task đã **hoàn tất kèm một exception**. |
| `CANCELLED` | Task **đã bị cancel**. |

> *"You should call the state method before calling resultNow or exceptionNow."*

**Dịch:** Bạn **nên gọi `state` trước khi gọi `resultNow` hoặc `exceptionNow`**.

### FutureTask

> *"One way to execute a Callable is to use a FutureTask, which implements both the Future and Runnable interfaces, so that you can construct a thread for running it:"*

```java
Callable<Integer> task = . . .;
var futureTask = new FutureTask<Integer>(task);
var t = new Thread(futureTask); // futureTask is a Runnable
t.start();
. . .
Integer result = futureTask.get(); // futureTask is a Future
```

**Dịch:** Một cách chạy `Callable` là dùng **`FutureTask`**, class này **implement cả hai interface `Future` và `Runnable`**, nên bạn **dựng được một thread để chạy nó**.

> *"More commonly, you will pass a Callable to an executor. That is the topic of the next section."*

**Dịch:** Phổ biến hơn, bạn sẽ **truyền một `Callable` cho một executor**. Đó là chủ đề của phần sau.

> *"To get a Future for a Runnable, you can call:"*

```java
var futureTask = new FutureTask<Void>(myRunnable, null);
```

**Dịch:** Để lấy một `Future` cho một `Runnable`, gọi như trên.

## API — `java.util.concurrent.Callable<V>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `V call()` | chạy một task **cho ra một kết quả**. |

## API — `java.util.concurrent.Future<V>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `V get()`<br>`V get(long time, TimeUnit unit)` | lấy kết quả, **block cho tới khi có kết quả hoặc hết khoảng thời gian cho trước**. Ném `CancellationException` nếu task bị cancel, ném `ExecutionException` với cause là exception kết thúc nếu task hoàn tất không thành công, và ném `InterruptedException` nếu thread hiện tại bị interrupt. Method thứ hai **ném `TimeoutException` nếu task chưa xong trong thời gian chờ cho trước**. |
| `V resultNow()` (19) | lấy kết quả nếu task **hoàn tất thành công**, ngược lại **ném `IllegalStateException`**. |
| `Throwable exceptionNow()` (19) | lấy **exception kết thúc** nếu task hoàn tất không thành công, ngược lại **ném `IllegalStateException`**. |
| `boolean cancel(boolean mayInterrupt)` | thử **huỷ việc thực thi task này**. Nếu task đã start và `mayInterrupt` là `true` thì nó **bị interrupt**. Trả về `true` nếu huỷ thành công. |
| `boolean isCancelled()` | trả về `true` nếu task **bị cancel trước khi hoàn tất**. |
| `boolean isDone()` | trả về `true` nếu task **đã hoàn tất, thành công hay không, hoặc đã bị cancel**. |
| `Future.State state()` (19) | trả về trạng thái của task này: **`RUNNING`, `SUCCESS`, `FAILED`, hoặc `CANCELLED`**. |

## API — `java.util.concurrent.FutureTask<V>` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `FutureTask(Callable<V> task)` | dựng một object **vừa là `Future<V>` vừa là `Runnable`**. |
| `FutureTask(Runnable task, V result)` | dựng một object mà, **với tư cách `Runnable` thì thực thi task**, và **với tư cách `Future<V>` thì cho ra `result` khi hoàn tất**. |

---

## 10.4.2. Executors

> *"Constructing a new platform thread is somewhat expensive because it involves interaction with the operating system. If your program creates a large number of short-lived platform threads, you should not run each task on a separate thread, but use a thread pool instead. A thread pool contains a number of threads that are ready to execute your tasks. You submit Runnable or Callable tasks to the pool, and one of the threads calls the run or call method. When the method exits, the thread doesn't die but stays around to serve the next request."*

**Dịch:** Dựng một **platform thread** mới thì **khá tốn kém** vì nó **liên quan tới việc tương tác với hệ điều hành**. Nếu chương trình tạo **rất nhiều platform thread sống ngắn**, bạn **không nên chạy mỗi task trên một thread riêng**, mà **dùng thread pool**. **Thread pool chứa một số thread đã sẵn sàng chạy task của bạn.** Bạn **submit task `Runnable` hoặc `Callable` vào pool**, và một trong các thread sẽ gọi method `run` hoặc `call`. **Khi method thoát, thread không chết mà ở lại phục vụ request tiếp theo.**

> *"An executor is an object to which you submit tasks. For platform threads, that is a thread pool. Virtual threads are inexpensive to create and should never be pooled. An executor for virtual threads will simply start a new virtual thread for each submitted task."*

**Dịch:** **Executor là một object mà bạn submit task vào.** Với platform thread thì đó là một **thread pool**. **[[03 - Thread Properties#10.3.1. Virtual Threads|Virtual thread]] tạo ra rất rẻ nên không bao giờ nên pool chúng.** Một executor cho virtual thread đơn giản là **start một virtual thread mới cho mỗi task được submit**.

> *"The Executors class has a number of static factory methods for constructing executors. Table 10.1 lists the most useful ones."*

**Dịch:** Class **`Executors`** có một loạt [[04 - Static Fields and Methods#4.4.4. Factory Methods|static factory method]] để dựng executor. Bảng 10.1 liệt kê những cái hữu dụng nhất.

### Table 10.1 — Common Executors Factory Methods

| Method | Description (dịch từ sách) |
|---|---|
| `newCachedThreadPool` | Thread mới **được tạo khi cần**; thread rảnh **được giữ lại 60 giây**. |
| `newFixedThreadPool` | Pool chứa **một tập thread cố định**; thread rảnh **được giữ vô thời hạn**. |
| `newSingleThreadExecutor` | Một "pool" **chỉ có một thread**, thực thi các task đã submit **tuần tự**. |
| `newVirtualThreadPerTaskExecutor` | Một executor chạy **mỗi task trên một virtual thread mới**. |

> *"The newCachedThreadPool method constructs a thread pool that executes each task immediately, using an existing idle thread when available and creating a new thread otherwise. The newFixedThreadPool method constructs a thread pool with a fixed size. If more tasks are submitted than there are idle threads, the unserved tasks are placed on a queue. They are run when other tasks have completed. The newSingleThreadExecutor is a degenerate pool of size 1 where a single thread executes the submitted tasks, one after another."*

**Dịch:** `newCachedThreadPool` dựng một thread pool **chạy mỗi task ngay lập tức**, dùng thread rảnh có sẵn nếu có, **không thì tạo thread mới**. `newFixedThreadPool` dựng thread pool **có kích thước cố định**. Nếu số task submit **nhiều hơn số thread rảnh**, các task chưa được phục vụ **được xếp vào một queue**, và **chạy khi các task khác đã xong**. `newSingleThreadExecutor` là **pool suy biến kích thước 1**, nơi một thread duy nhất chạy các task **lần lượt từng cái một**.

> *"Use a cached thread pool when you have platform threads that are short-lived or spend a lot of time blocking. However, if you have threads that are working hard without blocking, you don't want to run a large number of them together. For optimum speed, the number of concurrent threads is the number of processor cores. In such a situation, you should use a fixed thread pool that bounds the total number of concurrent platform threads."*

**Dịch:** Dùng **cached thread pool** khi bạn có platform thread **sống ngắn hoặc dành nhiều thời gian block**. Tuy nhiên, nếu thread **làm việc nặng mà không block**, bạn **không muốn chạy một lượng lớn chúng cùng lúc**. Để **tốc độ tối ưu, số thread chạy đồng thời bằng số processor core**. Trong tình huống đó, **hãy dùng fixed thread pool để chặn trên tổng số platform thread đồng thời**.

> *"Another reason for using a fixed thread pool is to throttle the number of concurrent tasks. If many of the tasks access a service that can only handle a limited number of concurrent clients, then you can use the pool size to enforce that limit. This is a rather crude way of tuning an application, but it is surprisingly common because it is easy to do."*

**Dịch:** Một lý do khác để dùng fixed thread pool là **hạn chế (throttle) số task đồng thời**. Nếu nhiều task truy cập một service chỉ chịu được **số client đồng thời hạn chế**, bạn dùng **kích thước pool để ép giới hạn đó**. Đây là cách tinh chỉnh application **khá thô sơ**, nhưng **phổ biến đến bất ngờ vì dễ làm**.

> **Caution (sách):** *"If your application uses virtual threads, you need to come up with alternative mechanisms for throttling concurrent requests, such as a counting semaphore or bounded queue. For example, this code snippet limits the number of concurrent web requests:"*
>
> **Dịch:** Nếu application dùng virtual thread, bạn cần **cơ chế thay thế để throttle request đồng thời**, ví dụ **counting semaphore** hoặc **bounded queue**.

```java
private static final int CONCURRENT_REQUESTS = 200;
private static final Semaphore SEMAPHORE = new Semaphore(CONCURRENT_REQUESTS);
...
public static String get(URI uri) throws InterruptedException, IOException {
    var request = HttpRequest.newBuilder().uri(uri).GET().build();
    SEMAPHORE.acquire();
    try {
        return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
    } finally {
        SEMAPHORE.release();
    }
}
```

> **Caution (tiếp):** *"With a high number of concurrent requests, the acquire method blocks. For virtual threads, that is not a problem. For effective scaling, it is better to move the blocking to the point of pressure instead of the thread pool."*
>
> **Dịch:** Với số request đồng thời cao, **method `acquire` block**. Với virtual thread thì **đó không phải vấn đề**. Để **scale hiệu quả**, tốt hơn là **dời việc block về đúng điểm chịu áp lực thay vì về thread pool**.

> *"The single-thread executor is potentially useful for performance analysis. If you temporarily replace a cached or fixed thread pool with a single-thread pool, you can measure how much slower your application runs without the benefit of concurrency."*

**Dịch:** Single-thread executor **có ích cho việc phân tích hiệu năng**. Nếu bạn **tạm thời thay cached hoặc fixed thread pool bằng single-thread pool**, bạn **đo được application chạy chậm đi bao nhiêu khi không có lợi thế concurrency**.

> *"Most of the Executors factory methods have a version with a ThreadFactory parameter, allowing you to customize the threads that execute the submitted tasks. If you provide your own factory for a thread pool, it should produce platform threads, not virtual threads, since pooling virtual threads is never useful. If you want to customize virtual threads, pass a factory for virtual threads to the newThreadPerTaskExecutor method."*

**Dịch:** Hầu hết factory method của `Executors` **có phiên bản nhận parameter [[03 - Thread Properties#10.3.7. Thread Factories and Builders|`ThreadFactory`]]**, cho phép **tuỳ biến các thread chạy task**. Nếu bạn tự cung cấp factory cho một thread pool, nó **nên sinh ra platform thread chứ không phải virtual thread**, vì **pool virtual thread không bao giờ có ích**. Muốn tuỳ biến virtual thread thì **truyền factory virtual thread cho `newThreadPerTaskExecutor`**.

### Submit task cho ExecutorService

> *"All of the Executors factory methods return objects of classes that implement the ExecutorService interface. Submit a Runnable or Callable to an ExecutorService with one of the following methods:"*

```java
Future<T> submit(Callable<T> task)
Future<?> submit(Runnable task)
Future<T> submit(Runnable task, T result)
```

**Dịch:** Mọi factory method của `Executors` **trả về object của class implement interface `ExecutorService`**. Submit một `Runnable` hoặc `Callable` vào `ExecutorService` bằng một trong các method trên.

> *"When you call submit, the executor will schedule the submitted task. You get back a Future object that you can use to get the result or cancel the task."*

**Dịch:** Khi bạn gọi `submit`, **executor lên lịch cho task**. Bạn **nhận về một object `Future`** để **lấy kết quả hoặc huỷ task**.

> *"The second submit method returns a Future<?>. The get method blocks until completion and then returns null."*

**Dịch:** Method `submit` thứ hai trả về `Future<?>`. Method `get` **block cho tới khi hoàn tất rồi trả về `null`**.

> **Note (sách):** *"Other methods in the java.util.concurrent API return a Future<Void> instead of a Future<?>. For all practical purposes these types have the same function. You can use instances to query the task state and to block until the task completes, but there is no result value."*
>
> **Dịch:** Các method khác trong API `java.util.concurrent` trả về `Future<Void>` thay vì `Future<?>`. **Về mặt thực dụng, hai kiểu này có cùng chức năng.** Bạn dùng instance để **truy vấn trạng thái task và block tới khi task hoàn tất**, nhưng **không có giá trị kết quả**.

> *"The third version of submit yields a Future whose get method returns the given result object upon completion."*

**Dịch:** Phiên bản `submit` thứ ba cho ra một `Future` mà method `get` của nó **trả về object `result` cho trước khi hoàn tất**.

### Đóng executor

> *"When you are done with an executor, call the close method. An executor that is closed down accepts no new tasks. The close method blocks until all submitted tasks are finished. (If the thread calling close is interrupted, then the submitted tasks are canceled.) A convenient way to invoke close is to use a try-with-resources statement:"*

```java
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    . . .
    Future<V> f = submit(myCallable);
    . . .
} // executor.close() called here
```

**Dịch:** Khi xong việc với một executor, **gọi method `close`**. Executor đã đóng **không nhận task mới**. Method `close` **block cho tới khi mọi task đã submit hoàn tất**. (Nếu thread gọi `close` bị interrupt thì **các task đã submit bị cancel**.) Một cách tiện lợi để gọi `close` là dùng câu lệnh [[02 - Catching Exceptions#try-with-resources|try-with-resources]].

> **Note (sách):** *"Some programmers view an executor as a global resource. There are situations where a global executor makes sense, but you should not hesitate to have local executors, submit a few tasks, and then close them. This is particularly useful with virtual threads, where the blocking call to close is not a concern."*
>
> **Dịch:** Một số lập trình viên **xem executor như tài nguyên toàn cục**. Có tình huống một **global executor là hợp lý**, nhưng **đừng ngần ngại dùng executor cục bộ**, submit vài task rồi đóng chúng. Điều này **đặc biệt hữu ích với virtual thread**, nơi **lời gọi block `close` không đáng lo**.

> *"There are other methods to shut down an executor: shutdown, shutdownNow, and awaitTermination. These give you some finer-grained control, and they are needed in legacy code since the close method was only added in Java 19. If you need to run the demo program in this section with an older version of Java, replace the call executor.close() with:"*

```java
executor.shutdown();
executor.awaitTermination(10, TimeUnit.MINUTES);
```

**Dịch:** Còn các method khác để shut down executor: **`shutdown`, `shutdownNow`, `awaitTermination`**. Chúng cho **kiểm soát mịn hơn**, và **cần cho code legacy** vì **`close` chỉ được thêm ở Java 19**.

> *"Here, in summary, is what you do to use an executor:"*

**Dịch:** Tóm lại, đây là những gì bạn làm để dùng một executor:

| Bước | Việc làm (dịch từ sách) |
|---|---|
| 1 | Gọi một trong các static method của class `Executors`, phổ biến nhất là `newCachedThreadPool`, `newFixedThreadPool`, hoặc `newVirtualThreadPerTaskExecutor`. |
| 2 | Gọi `submit` để submit object `Callable` hoặc `Runnable`. |
| 3 | **Giữ lại các object `Future`** trả về để **truy vấn trạng thái task, lấy kết quả, hoặc huỷ task**. |
| 4 | **Shut down executor** khi không còn muốn submit task nào nữa. |

> **Caution (sách):** *"When an executor uses threads from a thread factory, setting the factory's uncaught exception handler has no effect. Thread pools need to install their own handler for catching task exceptions."*
>
> **Dịch:** Khi executor dùng thread từ một thread factory, việc **set uncaught exception handler của factory không có tác dụng**. **Thread pool phải tự cài handler riêng** để bắt exception của task.

## API — `java.util.concurrent.Executors` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static ExecutorService newCachedThreadPool()`<br>`static ExecutorService newCachedThreadPool(ThreadFactory threadFactory)` | trả về một **cached thread pool** tạo thread khi cần và **kết thúc thread đã rảnh 60 giây**. |
| `static ExecutorService newFixedThreadPool(int threads)`<br>`static ExecutorService newFixedThreadPool(int threads, ThreadFactory threadFactory)` | trả về một thread pool dùng **số thread cho trước** để chạy task. |
| `static ExecutorService newSingleThreadExecutor()`<br>`static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory)` | trả về một executor chạy task **tuần tự trong một thread duy nhất**. |
| `static ExecutorService newVirtualThreadPerTaskExecutor()` (21)<br>`static ExecutorService newThreadPerTaskExecutor(ThreadFactory threadFactory)` (21) | trả về một executor chạy **mỗi task trong một virtual thread mới**, hoặc trong một thread do factory cho trước sinh ra. |

## API — `java.util.concurrent.ExecutorService` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Future<T> submit(Callable<T> task)`<br>`Future<T> submit(Runnable task, T result)`<br>`Future<?> submit(Runnable task)` | submit task cho trước để thực thi. |
| `void close()` (19) | đưa executor này vào **shutdown mode**, không nhận submission mới nữa, và **block cho tới khi các task đã submit hoàn tất**. Nếu bị interrupt trong lúc block, **các task đang chạy bị interrupt**. |
| `void shutdown()` | đưa executor vào shutdown mode, không nhận submission mới. Method này **không block chờ task hoàn tất**. |
| `List<Runnable> shutdownNow()` | đưa executor vào shutdown mode, **interrupt các task đã start**, và **gỡ bỏ các task chưa start**. Trả về **danh sách các task đã gỡ**. Method này **không block chờ task hoàn tất**. |
| `boolean awaitTermination(long timeout, TimeUnit unit)` | block cho tới khi **mọi task đã submit hoàn tất**, hết thời gian chờ, hoặc việc block bị interrupt. Trả về `true` nếu mọi task đã hoàn tất. |

---

## 10.4.3. Invoking a Group of Tasks

> *"Often, you want to launch multiple concurrent tasks and get the result of the first successful one, or combine the results of all completed ones."*

**Dịch:** Thường thì bạn muốn **khởi chạy nhiều concurrent task** rồi **lấy kết quả của cái thành công đầu tiên**, hoặc **gộp kết quả của mọi cái đã hoàn tất**.

### invokeAny

> *"The invokeAny method submits all tasks in a collection of Callable objects and blocks until one of them has completed successfully, returning its result. Any tasks that have not completed are canceled. You don't know which task succeeded—presumably, it is the one that finished most quickly. If no task succeeded, an ExecutionException is thrown."*

**Dịch:** `invokeAny` **submit mọi task trong một collection các object `Callable`** và **block cho tới khi một trong số chúng hoàn tất thành công**, rồi **trả về kết quả của nó**. Mọi task chưa hoàn tất **bị cancel**. Bạn **không biết task nào đã thành công** — **đoán chừng là cái xong nhanh nhất**. Nếu **không task nào thành công**, một **`ExecutionException` được ném**.

> *"Use this method for a search problem in which you are willing to accept any solution. For example, suppose that you need to find a factor of a large integer—a computation that is required for breaking the RSA cipher. You could submit a number of tasks, each attempting a factorization with numbers in a different range. As soon as one of these tasks has an answer, your computation can stop."*

**Dịch:** Dùng method này cho **bài toán tìm kiếm mà bạn chấp nhận bất kỳ lời giải nào**. Ví dụ, giả sử bạn cần **tìm một thừa số của số nguyên lớn** — phép tính cần cho việc **phá mã RSA**. Bạn submit một loạt task, **mỗi task thử phân tích thừa số trong một khoảng số khác nhau**. **Ngay khi một task có đáp án, phép tính của bạn dừng được.**

### invokeAll

> *"The invokeAll method submits all tasks in a collection of Callable objects, blocks until all of them complete, and returns a list of Future objects that represent the solutions to all tasks, in the same order as the submitted tasks. You can process the results of the computation like this:"*

```java
List<Callable<T>> tasks = . . .;
List<Future<T>> results = executor.invokeAll(tasks);
for (Future<T> result : results) {
    if (result.state() == Future.State.SUCCESS)
        process result.resultNow();
    else
        handle result.exceptionNow();
}
```

**Dịch:** `invokeAll` submit mọi task trong một collection các `Callable`, **block cho tới khi tất cả hoàn tất**, và trả về **một list các object `Future`** đại diện cho lời giải của mọi task, **theo đúng thứ tự các task đã submit**.

### ExecutorCompletionService

> *"The call to invokeAll blocks until all tasks have completed. If you want to obtain the results in the order in which they are available, use an ExecutorCompletionService."*

**Dịch:** Lời gọi `invokeAll` **block cho tới khi mọi task hoàn tất**. Nếu bạn muốn **lấy kết quả theo thứ tự chúng sẵn sàng**, hãy dùng **`ExecutorCompletionService`**.

> *"Start with an executor, obtained in the usual way. Then construct an ExecutorCompletionService. Submit tasks to the completion service. The service manages a blocking queue of Future objects, containing the results of the submitted tasks as they become available:"*

```java
var service = new ExecutorCompletionService<T>(executor);
for (Callable<T> task : tasks) service.submit(task);
for (int i = 0; i < tasks.size(); i++) {
    Future<T> result = service.take();
}
```

**Dịch:** Bắt đầu bằng một executor lấy theo cách thông thường. Rồi **dựng một `ExecutorCompletionService`**. Submit task vào completion service. Service **quản lý một blocking queue các object `Future`**, chứa kết quả của các task đã submit **khi chúng dần sẵn sàng**.

### Chương trình ví dụ

> *"The program in Listing 10.3 shows how to use callables and executors. In the first computation, we count how many files in a directory tree contain a given word. We make a separate task for each file:"*

```java
Set<Path> files = descendants(Path.of(start));
var tasks = new ArrayList<Callable<Long>>();
for (Path file : files)
{
    Callable<Long> task = () -> occurrences(word, file);
    tasks.add(task);
}
```

**Dịch:** Chương trình ở Listing 10.3 minh hoạ cách dùng callable và executor. Ở phép tính thứ nhất, ta **đếm xem bao nhiêu file trong một cây thư mục chứa một từ cho trước**. Ta **tạo một task riêng cho mỗi file**.

> *"Then we pass the tasks to an executor service:"*

```java
ExecutorService executor = Executors.newCachedThreadPool();
List<Future<Long>> results = executor.invokeAll(tasks);
```

> *"To get the combined count, we add all results, blocking until they are available:"*

```java
long total = 0;
for (Future<Long> result : results)
    total += result.get();
```

**Dịch:** Rồi ta truyền các task cho một executor service. Để có **tổng số đếm gộp lại**, ta **cộng mọi kết quả, block cho tới khi chúng sẵn sàng**.

> *"The program also displays the time spent during the search. Unzip the source code for the JDK somewhere and run the search. Then replace the executor service with a single-thread executor and try again to see whether the concurrent computation was faster. Also try with virtual threads."*

**Dịch:** Chương trình cũng **hiển thị thời gian tìm kiếm**. Hãy giải nén mã nguồn JDK ở đâu đó rồi chạy tìm kiếm. Sau đó **thay executor service bằng single-thread executor** rồi thử lại để xem **phép tính concurrent có nhanh hơn không**. Cũng **thử với virtual thread**.

> *"In the second part of the program, we search for the first file that contains the given word. We use invokeAny to parallelize the search. Here, we have to be more careful about formulating the tasks. The invokeAny method terminates as soon as any task returns. So we cannot have the search tasks return a boolean to indicate success or failure. We don't want to stop searching when a task failed. Instead, a failing task throws a NoSuchElementException. Also, when one task has succeeded, the others are canceled. Therefore, we monitor the interrupted status. If the underlying thread is interrupted, the search task prints a message before terminating, so that you can see that the cancellation is effective."*

```java
public static Callable<Path> searchForTask(String word, Path path)
{
    return () ->
    {
        try (var in = new Scanner(path))
        {
            while (in.hasNext())
            {
                if (in.next().equals(word)) return path;
                if (Thread.currentThread().isInterrupted())
                {
                    System.out.println("Search in " + path + " canceled.");
                    return null;
                }
            }
            throw new NoSuchElementException();
        }
    };
}
```

**Dịch:** Ở phần hai của chương trình, ta **tìm file đầu tiên chứa từ cho trước**, dùng **`invokeAny` để song song hoá việc tìm kiếm**. Ở đây phải **cẩn thận hơn khi hình thành task**. `invokeAny` **kết thúc ngay khi có task nào đó return**. Nên **không thể để search task trả về `boolean` báo thành công hay thất bại** — ta **không muốn dừng tìm kiếm khi một task thất bại**. Thay vào đó, **task thất bại ném `NoSuchElementException`**. Ngoài ra, **khi một task đã thành công, các task khác bị cancel** — vì vậy ta **theo dõi interrupted status**. Nếu thread nền bị interrupt, **search task in ra một thông điệp trước khi kết thúc**, để bạn thấy **việc huỷ có hiệu lực**.

> **Preview Note (sách):** *"Just like structured programming replaced "goto" statements with branches, loops, and functions, structured concurrency is an effort to find programming constructs that make it easier to reason about concurrent programs. Java 21 contains a preview of a structured concurrency API. Tasks are submitted to a StructuredTaskScope. Then the join method blocks until the scope is shut down, according to the scope's shutdown policy. The API provides two simple policies ShutdownOnFailure and ShutdownOnSuccess. Here is a usage example:"*
>
> **Dịch:** Cũng như **structured programming** thay câu lệnh `goto` bằng rẽ nhánh, [[07 - Control Flow|vòng lặp]] và function, **structured concurrency** là nỗ lực tìm ra **các cấu trúc lập trình giúp suy luận về chương trình concurrent dễ hơn**. **Java 21 chứa bản preview của structured concurrency API.** Task được **submit vào một `StructuredTaskScope`**. Rồi **method `join` block cho tới khi scope bị shut down**, theo **shutdown policy của scope**. API cung cấp **hai policy đơn giản: `ShutdownOnFailure` và `ShutdownOnSuccess`**.

```java
// Java 21 preview API
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Supplier<T1> f1 = scope.fork(callable1);
    Supplier<T2> f2 = scope.fork(callable2);
    scope.join();
    scope.throwIfFailed();
    result = combine(f1.get(), f2.get());
}
```

> **Preview Note (tiếp):** *"When the try block ends, we can be sure that all subtasks have completed. If either subtask fails, the scope shuts down, canceling the other task, and the first exception is rethrown. If the current thread is interrupted, the scope is closed and both tasks are canceled. You could have achieved almost the same effect with ExecutorService.invokeAll, except that invokeAll waits for completion of all tasks even if one of them fails. If you prefer that policy, it is easy to implement a scope subclass. The structured programming API is flexible and convenient, and it provides runtime checks and observability features for the nesting of scopes."*
>
> **Dịch:** Khi khối `try` kết thúc, **chắc chắn mọi subtask đã hoàn tất**. Nếu một subtask thất bại, **scope shut down, huỷ task còn lại, và exception đầu tiên được ném lại**. Nếu **thread hiện tại bị interrupt, scope được đóng và cả hai task bị huỷ**. Bạn **gần như đạt được hiệu quả tương tự bằng `ExecutorService.invokeAll`**, chỉ khác là **`invokeAll` chờ mọi task hoàn tất kể cả khi một cái thất bại**. Nếu bạn thích policy đó thì **dễ dàng implement một subclass của scope**. API này **linh hoạt và tiện lợi**, và cung cấp **kiểm tra lúc runtime cùng tính năng quan sát cho việc lồng nhau của các scope**.

### Listing 10.3 — `executors/ExecutorDemo.java`

```java
package executors;

import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * This program demonstrates the Callable interface and executors.
 * @version 1.02 2023-07-27
 * @author Cay Horstmann
 */
public class ExecutorDemo
{
    /**
     * Counts occurrences of a given word in a file.
     * @return the number of times the word occurs in the given word
     */
    public static long occurrences(String word, Path path)
    {
        try (var in = new Scanner(path))
        {
            int count = 0;
            while (in.hasNext())
                if (in.next().equals(word)) count++;
            return count;
        }
        catch (IOException ex)
        {
            return 0;
        }
    }

    /**
     * Returns all descendants of a given directory--see Chapters 1 and 2 of Volume II.
     * @param rootDir the root directory
     * @return a set of all descendants of the root directory
     */
    public static Set<Path> descendants(Path rootDir) throws IOException
    {
        try (Stream<Path> entries = Files.walk(rootDir))
        {
            return entries.filter(Files::isRegularFile)
                .collect(Collectors.toSet());
        }
    }

    /**
     * Yields a task that searches for a word in a file.
     * @param word the word to search
     * @param path the file in which to search
     * @return the search task that yields the path upon success
     */
    public static Callable<Path> searchForTask(String word, Path path)
    {
        return () ->
        {
            try (var in = new Scanner(path))
            {
                while (in.hasNext())
                {
                    if (in.next().equals(word)) return path;
                    if (Thread.currentThread().isInterrupted())
                    {
                        System.out.println("Search in " + path + " canceled.");
                        return null;
                    }
                }
                throw new NoSuchElementException();
            }
        };
    }

    public static void main(String[] args)
        throws InterruptedException, ExecutionException, IOException
    {
        try (var in = new Scanner(System.in))
        {
            System.out.print("Enter base directory (e.g. /opt/jdk-21-src): ");
            String start = in.nextLine();
            System.out.print("Enter keyword (e.g. volatile): ");
            String word = in.nextLine();

            Set<Path> files = descendants(Path.of(start));
            var tasks = new ArrayList<Callable<Long>>();
            for (Path file : files)
            {
                Callable<Long> task = () -> occurrences(word, file);
                tasks.add(task);
            }
            ExecutorService executor = Executors.newCachedThreadPool();
            // use a single thread executor instead to see if multiple threads
            // speed up the search
            // ExecutorService executor = Executors.newSingleThreadExecutor();
            // Or try virtual threads
            // ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
            Instant startTime = Instant.now();
            List<Future<Long>> results = executor.invokeAll(tasks);
            Instant endTime = Instant.now();
            long total = 0;
            for (Future<Long> result : results)
                total += result.get();
            System.out.println("Occurrences of " + word + ": " + total);
            System.out.println("Time elapsed: "
                + Duration.between(startTime, endTime).toMillis() + " ms");

            var searchTasks = new ArrayList<Callable<Path>>();
            for (Path file : files)
                searchTasks.add(searchForTask(word, file));
            startTime = Instant.now();
            Path found = executor.invokeAny(searchTasks);
            endTime = Instant.now();
            System.out.println(word + " occurs in: " + found);
            System.out.println("Time elapsed: "
                + Duration.between(startTime, endTime).toMillis() + " ms");

            executor.close();
        }
    }
}
```

## API — `java.util.concurrent.ExecutorService` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T invokeAny(Collection<Callable<T>> tasks)`<br>`T invokeAny(Collection<Callable<T>> tasks, long timeout, TimeUnit unit)` | chạy các task cho trước và **trả về kết quả của một task hoàn tất thành công**, **huỷ các task còn lại**. Method thứ hai **ném `TimeoutException` nếu quá hạn**. |
| `List<Future<T>> invokeAll(Collection<Callable<T>> tasks)`<br>`List<Future<T>> invokeAll(Collection<Callable<T>> tasks, long timeout, TimeUnit unit)` | chạy các task cho trước và **trả về kết quả khi mọi task đã hoàn tất**. Method thứ hai **ném `TimeoutException` nếu quá hạn**. |

## API — `java.util.concurrent.ExecutorCompletionService<V>` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ExecutorCompletionService(Executor e)` | dựng một **executor completion service** thu thập kết quả của executor cho trước. |
| `Future<V> submit(Callable<V> task)`<br>`Future<V> submit(Runnable task, V result)` | submit một task vào executor bên dưới. |
| `Future<V> take()` | **gỡ ra kết quả hoàn tất kế tiếp**, **block nếu chưa có kết quả nào hoàn tất**. |
| `Future<V> poll()`<br>`Future<V> poll(long time, TimeUnit unit)` | gỡ ra và trả về kết quả hoàn tất kế tiếp, hoặc **trả về `null` nếu không có kết quả hoàn tất nào**. Method thứ hai **chờ trong khoảng thời gian cho trước**. |

---

## 10.4.4. Thread-Local Variables

> *"Sometimes you want to make a task-specific object available to all methods that collaborate on the task, without having to pass the object as a parameter of each method call. You can use a thread-local variable for this purpose. This is not an actual variable, but an object whose get and set methods access a value that depends on the current thread."*

**Dịch:** Đôi khi bạn muốn **một object riêng của task khả dụng cho mọi method cùng làm việc trên task đó**, mà **không phải truyền object đó làm parameter ở mỗi lời gọi method**. Bạn dùng **thread-local variable** cho mục đích này. Đây **không phải một biến thực sự**, mà là **một object mà method `get` và `set` của nó truy cập một giá trị phụ thuộc vào thread hiện tại**.

> *"Suppose, for example, that you want to share a database connection. Declare a variable"*

```java
public static final ThreadLocal<Connection> CONNECTION = new ThreadLocal<>();
```

> *"When the task starts, initialize the connection for this thread:"*

```java
CONNECTION.set(connect(uri, username, password));
```

> *"The task calls some methods, all within the same thread, and eventually one of them needs the connection:"*

```java
Connection connection = CONNECTION.get();
var result = connection.executeQuery(query);
```

> *"Note that the same call may happen on multiple threads. Each of them gets its own connection object."*

**Dịch:** Ví dụ, giả sử bạn muốn **chia sẻ một database connection**. Khi task start, **khởi tạo connection cho thread này**. Task gọi một số method, **tất cả trong cùng một thread**, và rốt cuộc một trong số đó **cần connection**. Lưu ý rằng **cùng lời gọi đó có thể xảy ra trên nhiều thread — mỗi thread nhận object connection của riêng nó**.

> **Caution (sách):** *"When executing tasks with a thread pool, you don't want to make thread-local data available to the other tasks that are scheduled on the same thread. You also want to make sure they get garbage collected when your task is done. It is essential that you call"*
>
> ```java
> CONNECTION.remove();
> ```
>
> *"upon task completion (successfully or with an exception)."*
>
> **Dịch:** Khi chạy task bằng thread pool, bạn **không muốn dữ liệu thread-local lộ ra cho các task khác được lên lịch trên cùng thread đó**. Bạn cũng muốn chắc chắn chúng **được garbage collect khi task xong**. **Bắt buộc phải gọi `CONNECTION.remove()` khi task hoàn tất** (thành công hay kèm exception).

> *"An InheritableThreadLocal is a subclass of ThreadLocal, used to propagate thread-local data to subtasks. When a new thread is started, it receives a copy of the parent's inheritable thread locals. (The copy is necessary because the child thread might mutate the thread-local values.)"*

**Dịch:** **`InheritableThreadLocal` là subclass của `ThreadLocal`**, dùng để **lan truyền dữ liệu thread-local xuống subtask**. Khi một thread mới start, nó **nhận một bản copy các inheritable thread local của parent**. (Bản copy là cần thiết vì **thread con có thể mutate các giá trị thread-local**.)

> **Tip (sách):** *"Sharing resource-intensive objects as thread locals can be a problem when migrating to virtual threads. There will likely be far more of them than threads in a thread pool, and now you have many more instances. In such a situation, you should rethink your sharing strategy. To identify the use of thread-local variables, run with the VM flag jdk.traceVirtualThreadLocals. You will get a stack trace when a virtual thread mutates a thread-local variable."*
>
> **Dịch:** **Chia sẻ các object tốn tài nguyên dưới dạng thread local có thể thành vấn đề khi chuyển sang virtual thread.** Số virtual thread nhiều hơn hẳn số thread trong thread pool, nên **bạn sẽ có rất nhiều instance hơn**. Trong tình huống đó **nên nghĩ lại chiến lược chia sẻ**. Để **phát hiện việc dùng thread-local variable**, chạy với VM flag **`jdk.traceVirtualThreadLocals`** — bạn sẽ **nhận được stack trace khi một virtual thread mutate một thread-local variable**.

> **Preview Note (sách):** *"Scoped values are a preview feature of Java 21 that provide a more performant version of inheritable thread-local variables. Scoped values have per-thread instances, but they are immutable and have a bounded lifetime. Scoped values are inherited in virtual threads created by a StructuredTaskScope. This code snippet shows how to use them:"*
>
> **Dịch:** **Scoped value** là tính năng preview của **Java 21**, cung cấp **phiên bản hiệu năng tốt hơn của inheritable thread-local variable**. Scoped value **có instance riêng cho mỗi thread**, nhưng **immutable và có vòng đời giới hạn**. Scoped value **được kế thừa trong các virtual thread do `StructuredTaskScope` tạo ra**.

```java
public static final ScopedValue<Connection> CONNECTION = ScopedValue.newInstance();
. . .
ScopedValue.where(CONNECTION, connect(uri, username, password)).run(() -> doWork());
. . .
public void doWork() {
    . . .
    Connection connection = CONNECTION.get();
    var result = connection.executeQuery(query);
    . . .
}
```

> **Preview Note (tiếp):** *"When using virtual threads, prefer scoped values over thread-local variables."*
>
> **Dịch:** Khi dùng virtual thread, **hãy ưu tiên scoped value hơn thread-local variable**.

## API — `java.lang.ThreadLocal<T>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T get()` | lấy **giá trị hiện tại của thread này**. Nếu `get` được gọi **lần đầu** mà `set` chưa từng được gọi thì giá trị **được lấy bằng cách gọi `initialize`**. |
| `void set(T t)` | set **giá trị mới cho thread này**. |
| `void remove()` | **gỡ bỏ giá trị của thread này**. |

---

## 10.4.5. The Fork-Join Framework

> *"Some applications use a large number of threads that are mostly idle. An example would be a web server that uses one thread per connection. Other applications use one thread per processor core, in order to carry out computationally intensive tasks, such as image or video processing. The fork-join framework is designed to support the latter. Suppose you have a processing task that naturally decomposes into subtasks, like this:"*

```java
if (problemSize < threshold)
{
    solve problem directly
}
else
{
    break problem into subproblems
    recursively solve each subproblem
    combine the results
}
```

**Dịch:** Một số application dùng **rất nhiều thread mà phần lớn thời gian rảnh** — ví dụ web server dùng **một thread cho mỗi connection**. Các application khác dùng **một thread cho mỗi processor core** để làm **task nặng về tính toán**, như **xử lý ảnh hoặc video**. **Fork-join framework được thiết kế để hỗ trợ loại thứ hai.** Giả sử bạn có một task xử lý **phân rã tự nhiên thành các subtask** như trên.

> *"One example is image processing. To enhance an image, you can transform the top half and the bottom half. If you have enough idle processors, those operations can run in parallel. (You will need to do a bit of extra work along the strip that separates the two halves, but that's a technical detail.)"*

**Dịch:** Một ví dụ là **xử lý ảnh**. Để tăng chất lượng ảnh, bạn **biến đổi nửa trên và nửa dưới**. Nếu có **đủ processor rảnh**, các thao tác đó **chạy song song được**. (Bạn sẽ phải **làm thêm chút việc ở dải phân cách hai nửa**, nhưng đó là chi tiết kỹ thuật.)

> *"Here, we discuss a simpler example. Suppose we want to count how many elements of an array fulfill a particular property. We cut the array in half, compute the counts of each half, and add them up."*

**Dịch:** Ở đây ta bàn một ví dụ đơn giản hơn: **đếm xem bao nhiêu phần tử của một [[09 - Arrays|array]] thoả một tính chất nào đó**. Ta **cắt đôi array, tính số đếm của mỗi nửa, rồi cộng lại**.

> *"To put the recursive computation in a form that is usable by the framework, supply a class that extends RecursiveTask<T> (if the computation produces a result of type T) or RecursiveAction (if it doesn't produce a result). Override the compute method to generate and invoke subtasks and to combine their results."*

```java
class Counter extends RecursiveTask<Integer>
{
    . . .
    protected Integer compute()
    {
        if (to - from < THRESHOLD)
        {
            solve problem directly
        }
        else
        {
            int mid = from + (to - from) / 2;
            var first = new Counter(values, from, mid, filter);
            var second = new Counter(values, mid, to, filter);
            invokeAll(first, second);
            return first.join() + second.join();
        }
    }
}
```

**Dịch:** Để đưa phép tính đệ quy về dạng framework dùng được, hãy cung cấp một class **extends `RecursiveTask<T>`** (nếu phép tính **cho ra kết quả kiểu `T`**) hoặc **`RecursiveAction`** (nếu **không cho ra kết quả**). **Override method `compute`** để **sinh và gọi các subtask, rồi gộp kết quả của chúng**.

> *"The invokeAll method receives a number of tasks and blocks until all of them have completed. The join method yields the result. Here, we apply join to each subtask and return the sum."*

**Dịch:** `invokeAll` **nhận một số task và block cho tới khi tất cả hoàn tất**. **`join` cho ra kết quả.** Ở đây ta **áp dụng `join` cho từng subtask rồi trả về tổng**.

> **Note (sách):** *"There is also a get method for getting the current result, but it is less attractive since it can throw checked exceptions that we are not allowed to throw in the compute method."*
>
> **Dịch:** Cũng có method `get` để lấy kết quả hiện tại, nhưng **kém hấp dẫn hơn vì nó có thể ném checked exception** mà **ta không được phép ném trong method `compute`**.

### Work stealing

> *"Behind the scenes, the fork-join framework uses an effective heuristic, called work stealing, for balancing the workload among available threads. Each worker thread has a deque (double-ended queue) for tasks. A worker thread pushes smaller subtasks onto the head of its own deque. (Only one thread accesses the head, so no locking is required.) When a worker thread is idle, it "steals" a task from the tail of another deque (which requires locking). By stealing larger subtasks, which are at the tail, more time elapses until the next "theft", reducing contention at the tails."*

**Dịch:** Đằng sau hậu trường, fork-join framework dùng một **heuristic hiệu quả gọi là work stealing** để **cân bằng khối lượng công việc giữa các thread khả dụng**. Mỗi **worker thread có một [[03 - Concrete Collections|deque]] (double-ended queue) chứa task**. Worker thread **đẩy các subtask nhỏ hơn vào đầu deque của chính nó** (chỉ **một thread truy cập phần đầu, nên không cần lock**). Khi một worker thread rảnh, nó **"ăn cắp" một task từ đuôi của deque khác** (việc này **cần lock**). Bằng cách **ăn cắp các subtask lớn hơn nằm ở đuôi**, **thời gian tới lần "trộm" kế tiếp dài hơn**, **giảm tranh chấp ở phần đuôi**.

> **Caution (sách):** *"Fork-join pools are optimized for nonblocking workloads. If you add many blocking tasks into a fork-join pool, you can starve it. It is possible to overcome this by having tasks implement the ForkJoinPool.ManagedBlocker interface, but this is an advanced technique that we won't discuss."*
>
> **Dịch:** **Fork-join pool được tối ưu cho workload không block.** Nếu bạn **thêm nhiều blocking task vào một fork-join pool, bạn có thể làm nó bị đói (starve)**. Có thể khắc phục bằng cách cho task **implement interface `ForkJoinPool.ManagedBlocker`**, nhưng đó là **kỹ thuật nâng cao mà sách không bàn**.

### Listing 10.4 — `forkJoin/ForkJoinTest.java`

```java
package forkJoin;

import java.util.concurrent.*;
import java.util.function.*;

/**
 * This program demonstrates the fork-join framework.
 * @version 1.02 2021-06-17
 * @author Cay Horstmann
 */
public class ForkJoinTest
{
    public static void main(String[] args)
    {
        final int SIZE = 10000000;
        var numbers = new double[SIZE];
        for (int i = 0; i < SIZE; i++) numbers[i] = Math.random();
        var counter = new Counter(numbers, 0, numbers.length, x -> x > 0.5);
        var pool = new ForkJoinPool();
        pool.invoke(counter);
        System.out.println(counter.join());
    }
}

class Counter extends RecursiveTask<Integer>
{
    public static final int THRESHOLD = 1000;
    private double[] values;
    private int from;
    private int to;
    private DoublePredicate filter;

    public Counter(double[] values, int from, int to, DoublePredicate filter)
    {
        this.values = values;
        this.from = from;
        this.to = to;
        this.filter = filter;
    }

    protected Integer compute()
    {
        if (to - from < THRESHOLD)
        {
            int count = 0;
            for (int i = from; i < to; i++)
            {
                if (filter.test(values[i])) count++;
            }
            return count;
        }
        else
        {
            int mid = from + (to - from) / 2;
            var first = new Counter(values, from, mid, filter);
            var second = new Counter(values, mid, to, filter);
            invokeAll(first, second);
            return first.join() + second.join();
        }
    }
}
```

---

## Bài kế tiếp

→ [[05 - Synchronization]] — race condition, lock object, condition object, keyword `synchronized`, deadlock, `volatile`, atomic, và các cấu trúc đồng bộ hoá khác.
