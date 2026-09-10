# 01 — Running Threads

> Chapter 10, Section 10.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 10 — Concurrency

> *"You are probably familiar with multitasking—your operating system's ability to have more than one program working at what seems like the same time. For example, you can print while editing or downloading your email. Nowadays, you are likely to have a computer with more than one CPU, but the number of concurrently executing processes is not limited by the number of CPUs. The operating system assigns CPU time slices to each process, giving the impression of parallel activity."*

**Dịch:** Bạn hẳn đã quen với **multitasking** — khả năng của hệ điều hành cho **nhiều chương trình chạy trông như cùng lúc**. Ví dụ, bạn in tài liệu trong lúc đang soạn thảo hoặc tải email. Ngày nay máy tính thường có nhiều CPU, nhưng **số process chạy đồng thời không bị giới hạn bởi số CPU**. Hệ điều hành **cấp cho mỗi process một lát cắt thời gian CPU (time slice)**, tạo ra ấn tượng về hoạt động song song.

> *"Multithreaded programs extend the idea of multitasking by taking it one level lower: Individual programs will appear to do multiple tasks at the same time. Each task is executed in a thread, which is short for thread of control. Programs that can run more than one thread at once are said to be multithreaded."*

**Dịch:** Chương trình **multithreaded** mở rộng ý tưởng multitasking xuống **một tầng thấp hơn**: từng chương trình riêng lẻ trông như đang làm **nhiều task cùng lúc**. Mỗi task được thực thi trong một **thread** — viết tắt của **thread of control**. Chương trình chạy được nhiều hơn một thread cùng lúc thì gọi là **multithreaded**.

> *"So, what is the difference between multiple processes and multiple threads? The essential difference is that while each process has a complete set of its own variables, threads share the same data. This sounds somewhat risky, and indeed it can be, as you will see later in this chapter. However, shared variables make communication between threads more efficient and easier to program than interprocess communication. Moreover, on some operating systems, threads are more "lightweight" than processes—it takes less overhead to create and destroy individual threads than it does to launch new processes."*

**Dịch:** Vậy **khác nhau giữa nhiều process và nhiều thread** là gì? Khác biệt cốt lõi: mỗi **process có một bộ biến riêng hoàn chỉnh**, còn **thread thì dùng chung cùng một data**. Nghe có vẻ rủi ro, và đúng là có thể rủi ro thật, như bạn sẽ thấy ở phần sau chương này. Tuy nhiên, **biến dùng chung khiến việc giao tiếp giữa các thread hiệu quả hơn và dễ lập trình hơn** so với interprocess communication. Hơn nữa, trên một số hệ điều hành, thread **"nhẹ" hơn process** — tốn ít overhead hơn để tạo và huỷ một thread so với khởi chạy một process mới.

> *"Multithreading is extremely useful in practice. For example, a browser should be able to simultaneously download multiple images. A web server needs to be able to serve concurrent requests. Graphical user interface (GUI) programs have a separate thread for gathering user-interface events from the host operating environment. This chapter shows you how to add multithreading capability to your Java applications."*

**Dịch:** Multithreading **cực kỳ hữu ích trong thực tế**. Ví dụ, một browser cần tải **nhiều ảnh cùng lúc**. Một web server cần **phục vụ các request đồng thời**. Chương trình GUI có **một thread riêng để thu thập sự kiện giao diện** từ môi trường hệ điều hành.

> *"Fair warning: Concurrent programming can get very complex. In this chapter, I cover all the tools that an application programmer is likely to need. However, for more intricate system-level programming, I suggest that you turn to a more advanced reference, such as Java Concurrency in Practice by Brian Goetz et al. (Addison-Wesley Professional, 2006)."*

**Dịch:** **Cảnh báo trước:** lập trình concurrent **có thể rất phức tạp**. Trong chương này tác giả trình bày mọi công cụ mà một application programmer nhiều khả năng sẽ cần. Còn với lập trình system-level phức tạp hơn, hãy tìm tới tài liệu chuyên sâu hơn, chẳng hạn **Java Concurrency in Practice** của Brian Goetz và cộng sự (Addison-Wesley Professional, 2006).

---

## 10.1. Running Threads

> *"Here is a simple procedure for running a task in a separate thread:"*

**Dịch:** Đây là quy trình đơn giản để chạy một task trong một thread riêng.

> *"1. Place the code for the task into the run method of a class that implements the Runnable interface. That interface is very simple, with a single method:"*

```java
public interface Runnable
{
    void run();
}
```

**Dịch:** **Bước 1.** Đặt code của task vào method `run` của một class **implement [[01 - Interfaces|interface]] `Runnable`**. Interface này rất đơn giản, chỉ có **một method**.

> *"Since Runnable is a functional interface, you can make an instance with a lambda expression:"*

```java
Runnable r = () ->
{
    task code
};
```

**Dịch:** Vì `Runnable` là một **functional interface**, bạn tạo instance được bằng một [[02 - Lambda Expressions|lambda expression]].

> *"2. Construct a Thread object from the Runnable:"*

```java
var t = new Thread(r);
```

**Dịch:** **Bước 2.** Dựng một object `Thread` từ `Runnable`.

> *"3. Start the thread:"*

```java
t.start();
```

**Dịch:** **Bước 3.** Khởi động thread.

```
Runnable r = () -> { ... }      ← 1. code của task
        │
        ▼
var t = new Thread(r)           ← 2. dựng Thread object
        │
        ▼
t.start()                       ← 3. start (KHÔNG gọi run trực tiếp)
```

### Ví dụ chuyển tiền giữa các bank account

> *"Let us look at a simple program that uses threads to move money between bank accounts. We make use of a Bank class that stores the balances of a given number of accounts. The transfer method transfers an amount from one account to another. See Listing 10.2 for the implementation."*

**Dịch:** Hãy xem một chương trình đơn giản dùng thread để **chuyển tiền giữa các bank account**. Ta dùng class `Bank` lưu số dư của một số lượng account cho trước. Method `transfer` **chuyển một khoản tiền từ account này sang account khác**.

> *"In the first thread, we will move money from account 0 to account 1:"*

```java
Runnable r = () ->
{
    try
    {
        for (int i = 0; i < STEPS; i++)
        {
            double amount = MAX_AMOUNT * Math.random();
            bank.transfer(0, 1, amount);
            Thread.sleep((int) (DELAY * Math.random()));
        }
    }
    catch (InterruptedException e)
    {
    }
};
var t = new Thread(r);
t.start();
```

> *"For a given number of steps, this thread transfers a random amount, and then sleeps for a random delay."*

**Dịch:** Với một số bước cho trước, thread này **chuyển một khoản ngẫu nhiên**, rồi **sleep một khoảng trễ ngẫu nhiên**.

> *"We need to catch an InterruptedException that the sleep method threatens to throw. We will discuss this exception in Section 10.3.2. Typically, interruption is used to request that a thread terminates. Accordingly, our run method exits when an InterruptedException occurs."*

**Dịch:** Ta cần [[02 - Catching Exceptions|catch]] một `InterruptedException` mà method `sleep` **có nguy cơ ném ra**. Thông thường, **interruption được dùng để yêu cầu một thread kết thúc**. Theo đó, method `run` của ta **thoát ra khi `InterruptedException` xảy ra**.

> **Note (sách):** *"Calling Math.random() from a large number of different threads is slightly inefficient. For this and the following demonstration programs, we do not care. But see Section 10.5.14 for a more performant approach."*
>
> **Dịch:** Gọi `Math.random()` từ **rất nhiều thread khác nhau** thì **hơi kém hiệu quả**. Với chương trình minh hoạ này và các chương trình sau, ta không bận tâm. Nhưng xem Section 10.5.14 để biết cách làm **hiệu năng tốt hơn**.

> *"Our program starts a second thread as well that moves money from account 2 to account 3. When you run this program, you get a printout like this:"*

```
Thread[Thread-1,5,main]      606.77 from 2 to 3 Total Balance: 400000.00
Thread[Thread-0,5,main]       98.99 from 0 to 1 Total Balance: 400000.00
Thread[Thread-1,5,main]      476.78 from 2 to 3 Total Balance: 400000.00
Thread[Thread-0,5,main]      653.64 from 0 to 1 Total Balance: 400000.00
. . .
```

**Dịch:** Chương trình cũng khởi động một **thread thứ hai** chuyển tiền từ account 2 sang account 3.

> *"As you can see, the output of the two threads is interleaved, showing that they run concurrently. In fact, sometimes the output is a little messier when two output lines are interleaved."*

**Dịch:** Như bạn thấy, output của hai thread **đan xen nhau (interleaved)**, cho thấy chúng **chạy đồng thời**. Thực tế, đôi khi output còn **lộn xộn hơn** khi hai dòng output bị đan vào nhau.

> *"That's all there is to it! You now know how to run tasks concurrently. The remainder of this chapter tells you how to control the interaction between threads."*

**Dịch:** Chỉ có vậy thôi! Giờ bạn đã biết cách **chạy các task đồng thời**. Phần còn lại của chương này nói về cách **kiểm soát tương tác giữa các thread**.

> **Caution (sách):** *"Do not call the run method of the Thread class or the Runnable object. Calling the run method directly merely executes the task in the same thread—no new thread is started. Instead, call the Thread.start method. It creates a new thread that executes the run method."*
>
> **Dịch:** **Đừng gọi method `run`** của class `Thread` hay của object `Runnable`. Gọi thẳng `run` **chỉ thực thi task trong cùng thread hiện tại** — **không có thread mới nào được khởi động**. Thay vào đó hãy gọi **`Thread.start`**: nó **tạo thread mới** để chạy method `run`.

> **Note (sách):** *"You can also define a thread by forming a subclass of the Thread class, like this:"*
>
> ```java
> class MyThread extends Thread
> {
>     public void run()
>     {
>         task code
>     }
> }
> ```
>
> *"Then you construct an object of the subclass and call its start method. However, this approach is no longer recommended. You should decouple the task that is to be run in parallel from the mechanism of running it. As you will see throughout this chapter, there are many ways of scheduling the execution of a task."*
>
> **Dịch:** Bạn cũng **định nghĩa thread bằng cách tạo subclass của `Thread`** được, rồi dựng object của subclass đó và gọi method `start` của nó. Tuy nhiên, **cách này không còn được khuyến nghị**. Bạn nên **tách rời task cần chạy song song khỏi cơ chế chạy nó**. Như bạn sẽ thấy xuyên suốt chương này, **có rất nhiều cách để lên lịch thực thi một task**.

---

### Listing 10.1 — `threads/ThreadTest.java`

```java
package threads;

/**
 * @version 1.30 2004-08-01
 * @author Cay Horstmann
 */
public class ThreadTest
{
    public static final int DELAY = 10;
    public static final int STEPS = 100;
    public static final double MAX_AMOUNT = 1000;

    public static void main(String[] args)
    {
        var bank = new Bank(4, 100000);
        Runnable task1 = () ->
        {
            try
            {
                for (int i = 0; i < STEPS; i++)
                {
                    double amount = MAX_AMOUNT * Math.random();
                    bank.transfer(0, 1, amount);
                    Thread.sleep((int) (DELAY * Math.random()));
                }
            }
            catch (InterruptedException e)
            {
            }
        };

        Runnable task2 = () ->
        {
            try
            {
                for (int i = 0; i < STEPS; i++)
                {
                    double amount = MAX_AMOUNT * Math.random();
                    bank.transfer(2, 3, amount);
                    Thread.sleep((int) (DELAY * Math.random()));
                }
            }
            catch (InterruptedException e)
            {
            }
        };

        new Thread(task1).start();
        new Thread(task2).start();
    }
}
```

### Listing 10.2 — `threads/Bank.java`

```java
package threads;

import java.util.*;

/**
 * A bank with a number of bank accounts.
 */
public class Bank
{
    private final double[] accounts;

    /**
     * Constructs the bank.
     * @param n the number of accounts
     * @param initialBalance the initial balance for each account
     */
    public Bank(int n, double initialBalance)
    {
        accounts = new double[n];
        Arrays.fill(accounts, initialBalance);
    }

    /**
     * Transfers money from one account to another.
     * @param from the account to transfer from
     * @param to the account to transfer to
     * @param amount the amount to transfer
     */
    public void transfer(int from, int to, double amount)
    {
        if (accounts[from] < amount) return;
        System.out.print(Thread.currentThread());
        accounts[from] -= amount;
        System.out.printf(" %10.2f from %d to %d", amount, from, to);
        accounts[to] += amount;
        System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
    }

    /**
     * Gets the sum of all account balances.
     * @return the total balance
     */
    public double getTotalBalance()
    {
        double sum = 0;

        for (double a : accounts)
            sum += a;

        return sum;
    }

    /**
     * Gets the number of accounts in the bank.
     * @return the number of accounts
     */
    public int size()
    {
        return accounts.length;
    }
}
```

---

## API — `java.lang.Thread` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Thread(Runnable target)` | dựng một thread mới gọi method `run()` của `target` được chỉ định. |
| `void start()` | khởi động thread này, khiến method `run()` được gọi. Method này **trả về ngay lập tức**. Thread mới **chạy đồng thời**. |
| `void run()` | gọi method `run` của `Runnable` gắn với nó. |
| `static void sleep(long millis)`<br>`static void sleep(Duration duration)` (19) | sleep trong số millisecond cho trước. |

## API — `java.lang.Runnable` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void run()` | **phải được override** và cung cấp các chỉ thị cho task mà bạn muốn thực thi. |

---

## Bài kế tiếp

→ [[02 - Thread States]] — sáu trạng thái của một thread: new, runnable, blocked, waiting, timed waiting, terminated.
