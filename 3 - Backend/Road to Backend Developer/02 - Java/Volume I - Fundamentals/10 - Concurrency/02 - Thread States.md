# 02 — Thread States

> Chapter 10, Section 10.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.2. Thread States

> *"Threads can be in one of six states:"*
>
> *"New / Runnable / Blocked / Waiting / Timed waiting / Terminated"*

**Dịch:** Thread có thể ở **một trong sáu trạng thái**: **New**, **Runnable**, **Blocked**, **Waiting**, **Timed waiting**, **Terminated**.

> *"Each of these states is explained in the sections that follow. To determine the current state of a thread, simply call the getState method."*

**Dịch:** Để xác định trạng thái hiện tại của một thread, chỉ cần gọi method **`getState`**.

---

## 10.2.1. New Threads

> *"When you create a thread with the new operator—for example, new Thread(r)—the thread is not yet running. This means that it is in the new state. When a thread is in the new state, the program has not started executing code inside of it. A certain amount of bookkeeping needs to be done before a thread can run."*

**Dịch:** Khi bạn tạo một thread bằng toán tử `new` — ví dụ `new Thread(r)` — thread **chưa chạy**. Nghĩa là nó đang ở trạng thái **new**. Khi thread ở trạng thái new, chương trình **chưa bắt đầu thực thi code bên trong nó**. Cần thực hiện **một lượng công việc sổ sách (bookkeeping) nhất định** trước khi một thread chạy được.

---

## 10.2.2. Runnable Threads

> *"Once you invoke the start method, the thread is in the runnable state. A runnable thread may or may not actually be running. It is up to the thread scheduler to give the thread time to run. (The Java specification does not call this a separate state, though. A running thread is still in the runnable state.)"*

**Dịch:** Ngay khi bạn gọi method `start`, thread ở trạng thái **runnable**. Một thread runnable **có thể đang thực sự chạy hoặc không**. Việc cấp thời gian chạy cho thread là **do thread scheduler quyết định**. (Tuy nhiên Java specification **không coi đây là một trạng thái riêng** — một thread đang chạy vẫn ở trạng thái runnable.)

> *"Once a thread is running, it doesn't necessarily keep running. In fact, it is desirable that running threads occasionally pause so that other threads have a chance to run. The details of thread scheduling depend on the services that the operating system provides, and on the nature of the thread."*

**Dịch:** Khi một thread đang chạy, **không nhất thiết nó cứ chạy mãi**. Thực tế, **nên có việc thread đang chạy thỉnh thoảng tạm dừng** để các thread khác có cơ hội chạy. Chi tiết của thread scheduling phụ thuộc vào **dịch vụ mà hệ điều hành cung cấp** và vào **bản chất của thread**.

### Platform thread và virtual thread

> *"As of Java 21, there are two kinds of threads: platform threads and virtual threads. A Java platform thread corresponds to a thread provided by the operating system, which schedules its execution. Virtual threads run on platform threads and are scheduled by the Java runtime. As you will see in Section 10.3.1, virtual threads are used in applications with many more concurrent tasks than available platform threads."*

**Dịch:** Từ **Java 21**, có **hai loại thread**: **platform thread** và **virtual thread**. Một **platform thread** của Java tương ứng với một thread do hệ điều hành cung cấp, và **hệ điều hành lên lịch thực thi cho nó**. **Virtual thread chạy trên platform thread** và **được Java runtime lên lịch**. Virtual thread được dùng trong các application có **số task đồng thời nhiều hơn hẳn số platform thread khả dụng**.

> *"Each processor can run one platform thread at a time. On a machine with multiple processors, you can have multiple threads run in parallel. If there are more runnable threads than available processors, some of them are not actually running. They need to be scheduled for execution."*

**Dịch:** Mỗi processor **chạy được một platform thread tại một thời điểm**. Trên máy nhiều processor, bạn có thể cho **nhiều thread chạy song song**. Nếu **số thread runnable nhiều hơn số processor**, một số trong đó **thực ra không chạy** — chúng phải **chờ được lên lịch thực thi**.

### Preemptive vs cooperative scheduling

> *"Platform threads use preemptive scheduling. Each running thread is given a slice of time to perform its task. When that slice of time is exhausted, the operating system preempts the thread and gives another thread an opportunity to work. When selecting the next platform thread, the operating system takes into account the thread priorities—see Section 10.3.6 for more information."*

**Dịch:** Platform thread dùng **preemptive scheduling**. Mỗi thread đang chạy được cấp **một lát thời gian** để làm task. Khi lát thời gian đó hết, hệ điều hành **preempt (giành lại quyền)** khỏi thread đó và cho thread khác cơ hội làm việc. Khi chọn platform thread kế tiếp, hệ điều hành **cân nhắc thread priority**.

> *"Virtual threads use cooperative scheduling. A virtual thread loses control only when it calls the yield method, or when it is blocked."*

**Dịch:** Virtual thread dùng **cooperative scheduling**. Một virtual thread **chỉ mất quyền điều khiển khi nó gọi method `yield`, hoặc khi nó bị blocked**.

| Loại thread | Scheduling | Ai lên lịch |
|---|---|---|
| **platform thread** | **preemptive** — bị hệ điều hành giành lại khi hết time slice | hệ điều hành |
| **virtual thread** | **cooperative** — chỉ nhường khi gọi `yield` hoặc bị block | Java runtime |

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static void yield()` | báo hiệu cho scheduler rằng thread này **sẵn sàng nhường quyền thực thi** cho thread khác. Lưu ý đây là **static method**. |

---

## 10.2.3. Blocked and Waiting Threads

> *"When a thread is blocked or waiting, it is temporarily inactive. It doesn't execute any code and consumes minimal resources. It is up to the thread scheduler to reactivate it. The details depend on how the inactive state was reached."*

**Dịch:** Khi một thread **blocked** hoặc **waiting**, nó **tạm thời không hoạt động**. Nó **không thực thi code nào** và **tiêu tốn rất ít tài nguyên**. Việc kích hoạt lại nó là **do thread scheduler**. Chi tiết phụ thuộc vào **cách nó rơi vào trạng thái không hoạt động**.

> *"When the thread tries to acquire an intrinsic object lock (but not a Lock in the java.util.concurrent library) that is currently held by another thread, it becomes blocked. (We discuss java.util.concurrent locks in Section 10.5.3 and intrinsic object locks in Section 10.5.6.) The thread becomes unblocked when all other threads have relinquished the lock and the thread scheduler has allowed this thread to hold it."*

**Dịch:** Khi thread cố **acquire một intrinsic object lock** (không phải `Lock` trong thư viện `java.util.concurrent`) đang bị thread khác giữ, nó trở thành **blocked**. Thread được **unblock** khi mọi thread khác đã **nhả lock** và **thread scheduler cho phép thread này giữ lock**.

> *"When the thread waits for another thread to notify the scheduler of a condition, it enters the waiting state. We discuss conditions in Section 10.5.4. This happens by calling the Object.wait or Thread.join methods, or by waiting for a Lock or Condition in the java.util.concurrent library."*

**Dịch:** Khi thread **chờ một thread khác báo cho scheduler về một condition**, nó vào trạng thái **waiting**. Điều này xảy ra khi gọi `Object.wait` hoặc `Thread.join`, hoặc khi chờ một `Lock` / `Condition` trong `java.util.concurrent`.

> *"Several methods have a timeout parameter. Calling them causes the thread to enter the timed waiting state. This state persists either until the timeout expires or the appropriate notification has been received. Methods with timeout include Thread.sleep and the timed versions of Object.wait, Thread.join, Lock.tryLock, and Condition.await."*

**Dịch:** Một số method có **parameter timeout**. Gọi chúng làm thread vào trạng thái **timed waiting**. Trạng thái này kéo dài **cho tới khi timeout hết hạn hoặc nhận được notification thích hợp**. Các method có timeout gồm `Thread.sleep` và các phiên bản có timeout của `Object.wait`, `Thread.join`, `Lock.tryLock`, `Condition.await`.

> *"Figure 10.1 shows the states that a thread can have and the possible transitions from one state to another."*

**Figure 10.1: Thread states**

```
    ┌───────┐
    │  new  │
    └───┬───┘
        │                                        ┌───────────┐
        │ start                                  │  blocked  │
        │                                        └───────────┘
        │                              waiting for lock  ▲ │
        │                            ┌────────────────────┘ │
        │                            │  ┌───────────────────┘
        ▼                            │  ▼   lock acquired
    ┌────────────┐   waiting for notification    ┌───────────┐
    │            │ ────────────────────────────► │           │
    │  runnable  │                               │  waiting  │
    │            │ ◄──────────────────────────── │           │
    └────────────┘    notification occurred      └───────────┘
        │   │  ▲   waiting for timeout or notification
        │   │  └──────────────────────────────┐  ┌───────────────┐
        │   └─────────────────────────────────┼─►│               │
        │       timeout or notification       └──│ timed waiting │
        │            occurred                    └───────────────┘
        │ run
        │ method
        │ exits
        ▼
    ┌──────────────┐
    │  terminated  │
    └──────────────┘
```

Sáu state của thread và các transition giữa chúng.

Sáu state của thread và các transition giữa chúng.

> *"In practice, the difference between the blocked and waiting states is not usually significant. We will often say that a thread is blocked when it is in the blocked, waiting, or timed waiting state. When a thread is blocked or waiting (or, of course, when it terminates), another thread will be scheduled to run."*

**Dịch:** Trong thực tế, **khác biệt giữa blocked và waiting thường không quan trọng**. Ta sẽ hay nói là thread **"bị blocked"** khi nó ở một trong ba trạng thái blocked, waiting hoặc timed waiting. Khi một thread blocked hoặc waiting (hoặc dĩ nhiên khi nó terminate), **một thread khác sẽ được lên lịch chạy**.

> *"When a thread is reactivated (for example, because its timeout has expired or it has succeeded in acquiring a lock), it becomes runnable and is eligible for being scheduled."*

**Dịch:** Khi một thread **được kích hoạt lại** (ví dụ vì timeout đã hết hoặc nó đã acquire được lock), nó trở lại **runnable** và **đủ điều kiện được lên lịch**.

---

## 10.2.4. Terminated Threads

> *"A thread is terminated for one of two reasons:"*
>
> *"It dies a natural death because the run method exits normally."*
>
> *"It dies abruptly because an uncaught exception terminates the run method."*

**Dịch:** Một thread **terminated** vì **một trong hai lý do**:

| # | Lý do |
|---|---|
| 1 | **Chết tự nhiên** vì method `run` **thoát ra bình thường**. |
| 2 | **Chết đột ngột** vì **một uncaught exception** kết thúc method `run`. |

---

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void join()` | chờ thread được chỉ định **terminate**. |
| `void join(long millis)`<br>`void join(Duration duration)` (19) | chờ thread được chỉ định terminate, hoặc chờ hết số millisecond / duration cho trước. |
| `Thread.State getState()` (5.0) | lấy trạng thái của thread này: một trong `NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, `TERMINATED`. |
| `void stop()`<br>`void suspend()`<br>`void resume()` | Các method này **deprecated để gỡ bỏ** và, từ **Java 21**, **ném `UnsupportedOperationException`**. |

---

## Bài kế tiếp

→ [[03 - Thread Properties]] — virtual thread, interruption, daemon thread, tên và id, handler cho uncaught exception, priority, thread factory và builder.
