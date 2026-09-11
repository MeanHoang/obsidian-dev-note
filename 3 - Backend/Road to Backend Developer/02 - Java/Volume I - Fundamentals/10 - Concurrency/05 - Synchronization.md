# 05 — Synchronization

> Chapter 10, Section 10.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.5. Synchronization

> *"In most practical multithreaded applications, two or more threads need to share access to the same data. What happens if two threads have access to the same object and each calls a method that modifies the state of the object? As you might imagine, the threads can step on each other's toes. Depending on the order in which the data were accessed, corrupted objects can result. Such a situation is often called a race condition."*

**Dịch:** Trong hầu hết application multithread thực tế, **hai thread trở lên cần chia sẻ quyền truy cập cùng một dữ liệu**. Chuyện gì xảy ra nếu hai thread cùng truy cập một object và **mỗi thread gọi một method sửa state của object đó**? Như bạn hình dung, **các thread có thể giẫm chân nhau**. Tuỳ vào **thứ tự dữ liệu được truy cập**, có thể **sinh ra object bị hỏng (corrupted)**. Tình huống như vậy thường gọi là **race condition**.

---

## 10.5.1. An Example of a Race Condition

> *"To avoid corruption of shared data by multiple threads, you must learn how to synchronize the access. In this section, you'll see what happens if you do not use synchronization. In the next section, you'll see how to synchronize data access."*

**Dịch:** Để tránh dữ liệu chia sẻ bị hỏng bởi nhiều thread, bạn phải học cách **synchronize việc truy cập**. Phần này cho thấy **chuyện gì xảy ra nếu không dùng synchronization**; phần sau cho thấy **cách synchronize truy cập dữ liệu**.

> *"In the next test program, we continue working with our simulated bank. Unlike the example in Section 10.1, we randomly select the source and destination of the transfer. Since this will cause problems, let us look more carefully at the code for the transfer method of the Bank class."*

```java
public void transfer(int from, int to, double amount)
// CAUTION: unsafe when called from multiple threads
{
    System.out.print(Thread.currentThread());
    accounts[from] -= amount;
    System.out.printf(" %10.2f from %d to %d", amount, from, to);
    accounts[to] += amount;
    System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
}
```

**Dịch:** Ở chương trình thử nghiệm kế tiếp, ta tiếp tục làm việc với **ngân hàng mô phỏng**. Khác với ví dụ ở [[01 - Running Threads|Section 10.1]], ta **chọn ngẫu nhiên tài khoản nguồn và đích của giao dịch chuyển tiền**. Vì việc này **sẽ gây vấn đề**, hãy xem kỹ hơn code của method `transfer` trong class `Bank`.

> *"Here is the code for the Runnable instances. The run method keeps moving money out of a given bank account. In each iteration, the run method picks a random target account and a random amount, calls transfer on the bank object, and then sleeps."*

```java
Runnable r = () ->
{
    try
    {
        while (true)
        {
            int toAccount = (int) (bank.size() * Math.random());
            double amount = MAX_AMOUNT * Math.random();
            bank.transfer(fromAccount, toAccount, amount);
            Thread.sleep((int) (DELAY * Math.random()));
        }
    }
    catch (InterruptedException e)
    {
    }
};
```

**Dịch:** Đây là code của các instance `Runnable`. Method `run` **liên tục chuyển tiền ra khỏi một tài khoản cho trước**. Mỗi vòng lặp, `run` **chọn ngẫu nhiên tài khoản đích và số tiền**, gọi `transfer` lên object bank, **rồi sleep**.

> *"When this simulation runs, we do not know how much money is in any one bank account at any time. But we do know that the total amount of money in all the accounts should remain unchanged because all we do is move money from one account to another."*

**Dịch:** Khi mô phỏng chạy, ta **không biết mỗi tài khoản có bao nhiêu tiền tại thời điểm nào**. Nhưng ta biết chắc **tổng số tiền trong mọi tài khoản phải không đổi**, vì ta **chỉ chuyển tiền từ tài khoản này sang tài khoản khác**.

> *"At the end of each transaction, the transfer method recomputes the total and prints it. This program never finishes. Just press Ctrl+C to kill the program. Here is a typical printout:"*

```
. . .
Thread[Thread-11,5,main]     588.48 from 11 to 44 Total Balance: 100000.00
Thread[Thread-12,5,main]     976.11 from 12 to 22 Total Balance: 100000.00
Thread[Thread-14,5,main]     521.51 from 14 to 22 Total Balance: 100000.00
Thread[Thread-13,5,main]     359.89 from 13 to 81 Total Balance: 100000.00
. . .
Thread[Thread-36,5,main]     401.71 from 36 to 73 Total Balance:  99291.06
Thread[Thread-35,5,main]     691.46 from 35 to 77 Total Balance:  99291.06
Thread[Thread-37,5,main]      78.64 from 37 to  3 Total Balance:  99291.06
Thread[Thread-34,5,main]     197.11 from 34 to 69 Total Balance:  99291.06
Thread[Thread-36,5,main]      85.96 from 36 to  4 Total Balance:  99291.06
. . .
Thread[Thread-4,5,main]Thread[Thread-33,5,main]     7.31 from 31 to 32 Total Balance: 99979.24
     627.50 from 4 to 5 Total Balance: 99979.24
. . .
```

**Dịch:** Cuối mỗi giao dịch, method `transfer` **tính lại tổng và in ra**. Chương trình này **không bao giờ kết thúc** — nhấn Ctrl+C để giết nó.

> *"As you can see, something is very wrong. For a few transactions, the bank balance remains at $100,000, which is the correct total for 100 accounts of $1,000 each. But after some time, the balance changes slightly. When you run this program, errors may happen quickly, or it may take a very long time for the balance to become corrupted. This situation does not inspire confidence, and you would probably not want to deposit your hard-earned money in such a bank."*

**Dịch:** Như bạn thấy, **có gì đó rất sai**. Với một vài giao dịch đầu, số dư ngân hàng vẫn là **$100,000** — đúng bằng tổng của **100 tài khoản mỗi tài khoản $1,000**. Nhưng **sau một thời gian, số dư thay đổi chút ít**. Khi bạn chạy chương trình này, **lỗi có thể xảy ra nhanh, hoặc có thể rất lâu số dư mới bị hỏng**. Tình huống này **không tạo được lòng tin**, và chắc bạn **không muốn gửi tiền mồ hôi nước mắt vào một ngân hàng như vậy**.

> *"See if you can spot the problems with the code in Listing 10.5 and the Bank class in Listing 10.2. We will unravel the mystery in the next section."*

**Dịch:** Thử xem bạn có phát hiện được vấn đề trong code ở Listing 10.5 và class `Bank` ở Listing 10.2 không. **Bí ẩn sẽ được giải ở phần sau.**

### Listing 10.5 — `unsynch/UnsynchBankTest.java`

```java
package unsynch;

/**
 * This program shows data corruption when multiple threads access a data structure.
 * @version 1.33 2023-07-30
 * @author Cay Horstmann
 */
public class UnsynchBankTest
{
    public static final int NACCOUNTS = 100;
    public static final double INITIAL_BALANCE = 1000;
    public static final double MAX_AMOUNT = 1000;
    public static final int DELAY = 10;

    public static void main(String[] args)
    {
        var bank = new Bank(NACCOUNTS, INITIAL_BALANCE);
        for (int i = 0; i < NACCOUNTS; i++)
        {
            int fromAccount = i;
            Runnable r = () ->
            {
                try
                {
                    while (true)
                    {
                        int toAccount = (int) (bank.size() * Math.random());
                        double amount = MAX_AMOUNT * Math.random();
                        bank.transfer(fromAccount, toAccount, amount);
                        Thread.sleep((int) (DELAY * Math.random()));
                    }
                }
                catch (InterruptedException e)
                {
                }
            };
            Thread.ofPlatform().start(r);
        }
    }
}
```

---

## 10.5.2. The Race Condition Explained

> *"In the previous section, we ran a program in which several threads updated bank account balances. After a while, errors crept in and some amount of money was either lost or spontaneously created. This problem occurs when two threads are simultaneously trying to update an account. Suppose two threads simultaneously carry out the instruction"*

```java
accounts[to] += amount;
```

> *"The problem is that these are not atomic operations. The instruction might be processed as follows:"*

**Dịch:** Ở phần trước, ta chạy một chương trình mà **nhiều thread cùng cập nhật số dư tài khoản**. Sau một lúc, **lỗi len vào và một khoản tiền bị mất hoặc tự dưng sinh ra**. Vấn đề xảy ra khi **hai thread đồng thời cố cập nhật một tài khoản**. Mấu chốt là **đây không phải các thao tác atomic**. Chỉ thị có thể được xử lý như sau:

| Bước | Thao tác (dịch từ sách) |
|---|---|
| 1 | **Load `accounts[to]` vào một register.** |
| 2 | **Cộng `amount`.** |
| 3 | **Chuyển kết quả trở lại `accounts[to]`.** |

> *"Now, suppose the first thread executes Steps 1 and 2, and then it is preempted. Suppose the second thread awakens and updates the same entry in the account array. Then, the first thread awakens and completes its Step 3. That action wipes out the modification of the other thread. As a result, the total is no longer correct (see Figure 10.2)."*

**Dịch:** Giả sử thread thứ nhất **thực hiện Bước 1 và 2 rồi bị preempt**. Thread thứ hai **thức dậy và cập nhật cùng entry trong [[09 - Arrays|array]] tài khoản**. Rồi thread thứ nhất **thức dậy và hoàn tất Bước 3 của nó**. Hành động đó **xoá sạch thay đổi của thread kia**. Kết quả là **tổng không còn đúng nữa**.

**Figure 10.2: Simultaneous access by two threads**

```
 TransferThread 1          TransferThread 2            accounts[to]

  thread 1 register        thread 2 register
        ┌────────┐                                      ┌────────┐
 load   │  5000  │ ◄·································   │  5000  │
        └────────┘                                      └────────┘
        ┌────────┐                                      ┌────────┐
 add    │  5500  │                                      │  5000  │
        └────────┘                                      └────────┘
                            ┌────────┐                  ┌────────┐
                     load   │  5000  │ ◄············    │  5000  │
                            └────────┘                  └────────┘
                            ┌────────┐                  ┌────────┐
                     add    │  5900  │                  │  5000  │
                            └────────┘                  └────────┘
                            ┌────────┐                  ┌────────┐
                     store  │  5900  │ ············►    │  5900  │
                            └────────┘                  └────────┘
        ┌────────┐                                      ┌────────┐
 store  │  5500  │ ·······························►     │  5500  │
        └────────┘                                      └────────┘
```

Thread 1 store lại giá trị cũ, xoá sạch thay đổi của Thread 2.

> *"The UnsyncBankTest program demonstrates this corruption. (There is also a slight chance of false alarms during the computation of getTotalBalance.)"*

**Dịch:** Chương trình `UnsyncBankTest` minh hoạ sự hỏng dữ liệu này. (Cũng có **chút khả năng báo động giả** trong lúc tính `getTotalBalance`.)

> **Note (sách):** *"You can actually peek at the virtual machine bytecodes that execute each statement in our class. Run the command"*
>
> ```
> javap -c -v Bank
> ```
>
> *"to decompile the Bank.class file. For example, the line accounts[to] += amount; is translated into the following bytecodes:"*
>
> ```
> aload_0
> getfield  #2; // Field accounts:[D
> iload_2
> dup2
> daload
> dload_3
> dadd
> dastore
> ```
>
> *"What these codes mean does not matter. The point is that the increment command is made up of several instructions, and the thread executing them can be preempted at any instruction."*
>
> **Dịch:** Bạn **xem được bytecode của virtual machine** thực thi từng câu lệnh trong class, bằng cách chạy `javap -c -v Bank` để **decompile file `Bank.class`**. **Ý nghĩa các mã đó không quan trọng.** Điểm mấu chốt là **lệnh tăng giá trị được tạo thành từ vài chỉ thị**, và **thread thực thi chúng có thể bị preempt ở bất kỳ chỉ thị nào**.

> *"What is the chance of this corruption occurring? On a modern processor with multiple cores, the risk of corruption is quite high. I boosted the chance of observing the problem by interleaving the print statements with the statements that update the balance."*

**Dịch:** Khả năng hỏng dữ liệu này xảy ra là bao nhiêu? Trên **processor hiện đại nhiều core, rủi ro khá cao**. Tác giả **tăng cơ hội quan sát được vấn đề** bằng cách **xen kẽ các câu lệnh in với các câu lệnh cập nhật số dư**.

> *"If you run lots of threads on a heavily loaded machine, the program will still fail even after you have eliminated the print statements. The failure may take a few seconds or many hours or to occur. Frankly, there are few things worse in the life of a programmer than an error that only manifests itself irregularly."*

**Dịch:** Nếu bạn chạy nhiều thread trên máy tải nặng, **chương trình vẫn sẽ hỏng ngay cả khi đã bỏ hết câu lệnh in**. Sự cố **có thể mất vài giây hoặc nhiều giờ mới xuất hiện**. Thành thật mà nói, **ít thứ nào tệ hơn trong đời lập trình viên bằng một lỗi chỉ thỉnh thoảng mới biểu lộ**.

> *"The real problem is that the work of the transfer method can be preempted in the middle. If we could ensure that the method runs to completion before the thread loses control, the state of the bank account object would never be corrupted."*

**Dịch:** **Vấn đề thực sự là công việc của method `transfer` có thể bị preempt giữa chừng.** Nếu ta **đảm bảo được method chạy tới hết trước khi thread mất quyền điều khiển**, thì **state của object tài khoản sẽ không bao giờ bị hỏng**.

---

## 10.5.3. Lock Objects

> *"There are two mechanisms for protecting a code block from concurrent access. The Java language provides a synchronized keyword for this purpose, and the java.util.concurrent package provides explicit classes for locking. The synchronized keyword automatically provides a lock as well as an associated "condition," which makes it powerful and convenient for many cases that require explicit locking. However, I believe that it is easier to understand the synchronized keyword after you have seen locks and conditions in isolation. I explain the explicit classes here and in Section 10.5.4. Once you have understood these building blocks, you can read about the synchronized keyword in Section 10.5.6."*

**Dịch:** Có **hai cơ chế bảo vệ một khối code khỏi truy cập concurrent**. Ngôn ngữ Java cung cấp **keyword `synchronized`** cho mục đích này, còn package **`java.util.concurrent` cung cấp các class tường minh để lock**. Keyword `synchronized` **tự động cung cấp một lock cùng một "condition" đi kèm**, khiến nó **mạnh và tiện** cho nhiều trường hợp cần lock tường minh. Tuy nhiên, tác giả cho rằng **dễ hiểu `synchronized` hơn sau khi đã thấy lock và condition tách riêng**.

> *"The basic outline for protecting a code block with a ReentrantLock is:"*

```java
myLock.lock(); // a ReentrantLock object
try
{
    critical section
}
finally
{
    myLock.unlock(); // make sure the lock is unlocked even if an exception is thrown
}
```

**Dịch:** Đây là **khung cơ bản để bảo vệ một khối code bằng `ReentrantLock`**.

> *"This construct guarantees that only one thread at a time can enter the critical section. As soon as one thread locks the lock object, no other thread can get past the lock statement. When other threads call lock, they are deactivated until the first thread unlocks the lock object."*

**Dịch:** Cấu trúc này **đảm bảo mỗi lúc chỉ một thread vào được critical section**. **Ngay khi một thread khoá lock object, không thread nào khác vượt qua được câu lệnh `lock`.** Khi thread khác gọi `lock`, chúng **bị vô hiệu hoá cho tới khi thread đầu tiên unlock lock object**.

> **Caution (sách):** *"It is critically important that the unlock operation is enclosed in a finally clause. If the code in the critical section throws an exception, the lock must be unlocked. Otherwise, the other threads will be blocked forever."*
>
> **Dịch:** **Cực kỳ quan trọng: thao tác `unlock` phải nằm trong mệnh đề `finally`.** Nếu code trong critical section **ném một exception thì lock vẫn phải được mở**, nếu không **các thread khác sẽ bị block mãi mãi**.

> **Note (sách):** *"When you use locks, you cannot use the try-with-resources statement. The unlock method isn't called close. Some programmers proposed to make Lock extend AutoCloseable, with close calling lock. But Java designers felt that lock usage is fairly uncommon and deserves to be noticeable."*
>
> **Dịch:** Khi dùng lock, bạn **không dùng được câu lệnh [[02 - Catching Exceptions|try-with-resources]]**, vì **method `unlock` không tên là `close`**. Một số lập trình viên đề xuất cho `Lock` extend `AutoCloseable` với `close` gọi `lock`. Nhưng người thiết kế Java cho rằng **việc dùng lock khá hiếm và xứng đáng được thấy rõ**.

> *"Let us use a lock to protect the transfer method of the Bank class."*

```java
public class Bank
{
    private final Lock bankLock = new ReentrantLock();
    . . .
    public void transfer(int from, int to, int amount)
    {
        bankLock.lock();
        try
        {
            System.out.print(Thread.currentThread());
            accounts[from] -= amount;
            System.out.printf(" %10.2f from %d to %d", amount, from, to);
            accounts[to] += amount;
            System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
        }
        finally
        {
            bankLock.unlock();
        }
    }
}
```

> *"Suppose one thread calls transfer and gets preempted before it is done. Suppose a second thread also calls transfer. The second thread cannot acquire the lock and is blocked in the call to the lock method. It is deactivated and must wait for the first thread to finish executing the transfer method. When the first thread unlocks the lock, then the second thread can proceed (see Figure 10.3)."*

**Dịch:** Giả sử một thread gọi `transfer` rồi **bị preempt trước khi xong**. Giả sử thread thứ hai cũng gọi `transfer`. Thread thứ hai **không lấy được lock và bị block ở lời gọi `lock`**. Nó bị vô hiệu hoá và **phải chờ thread thứ nhất chạy xong method `transfer`**. Khi thread thứ nhất **unlock, thread thứ hai mới đi tiếp được**.

**Figure 10.3: Comparison of unsynchronized and synchronized threads**

```
        Unsynchronized                    Synchronized

  Thread 1        Thread 2          Thread 1        Thread 2
     │               ╷                 │               ╷
     │               ╷                 │               ╷
     │               ╷                 │ ┐             ╷
     │ ┐             │ ┐               │ ├ transfer    ╷
     │ │             │ │               │ ┘             ╷
     │ ├ transfer    │ ├ transfer      │               │ ┐
     │ │             │ │               ╷               │ ├ transfer
     │ ┘             │ ┘               ╷               │ ┘
     │               ╷                 ╷               │
     ╷               ╷                 ╷               ╷
```

Không synchronized thì hai lần `transfer` chồng lấn nhau; có lock thì chúng chạy nối tiếp.

> *"Try it out. Add the locking code to the transfer method and run the program again. You can run it forever, and the bank balance will not become corrupted."*

**Dịch:** Hãy thử: thêm code lock vào method `transfer` rồi chạy lại. Bạn **chạy mãi mãi cũng được, số dư ngân hàng sẽ không bị hỏng**.

> *"Note that each Bank object has its own ReentrantLock object. If two threads try to access the same Bank object, then the lock serves to serialize the access. However, if two threads access different Bank objects, each thread acquires a different lock and neither thread is blocked. This is as it should be, because the threads cannot interfere with one another when they manipulate different Bank instances."*

**Dịch:** Lưu ý **mỗi object `Bank` có object `ReentrantLock` riêng của nó**. Nếu hai thread truy cập **cùng một object `Bank`** thì lock **tuần tự hoá (serialize) việc truy cập**. Nhưng nếu hai thread truy cập **các object `Bank` khác nhau**, mỗi thread **lấy một lock khác nhau và không thread nào bị block**. Đúng như vậy mới phải, vì **các thread không can thiệp lẫn nhau khi thao tác trên các instance `Bank` khác nhau**.

### Vì sao gọi là "reentrant"

> *"The lock is called reentrant because a thread can repeatedly acquire a lock that it already owns. The lock has a hold count that keeps track of the nested calls to the lock method. The thread has to call unlock for every call to lock in order to relinquish the lock. Because of this feature, code protected by a lock can call another method that uses the same lock."*

**Dịch:** Lock được gọi là **reentrant** vì **một thread có thể lấy đi lấy lại một lock mà nó đã sở hữu**. Lock có một **hold count** theo dõi **các lời gọi `lock` lồng nhau**. Thread phải **gọi `unlock` đúng số lần đã gọi `lock` để nhả lock**. Nhờ tính năng này, **code được lock bảo vệ có thể gọi một method khác dùng chính lock đó**.

> *"For example, the transfer method calls the getTotalBalance method, which also locks the bankLock object, which now has a hold count of 2. When the getTotalBalance method exits, the hold count is back to 1. When the transfer method exits, the hold count is 0, and the thread relinquishes the lock."*

**Dịch:** Ví dụ, `transfer` gọi `getTotalBalance`, method này **cũng lock object `bankLock`**, khiến **hold count thành 2**. Khi `getTotalBalance` thoát, **hold count về 1**. Khi `transfer` thoát, **hold count là 0 và thread nhả lock**.

> *"In general, you will want to use a lock around any block of code that updates or inspects a shared object, so you can be assured that these operations run to completion before another thread can use the same object."*

**Dịch:** Nói chung, bạn muốn **dùng lock quanh bất kỳ khối code nào cập nhật hoặc kiểm tra một object chia sẻ**, để chắc chắn **các thao tác đó chạy tới hết trước khi thread khác dùng được cùng object**.

> **Caution (sách):** *"Be careful to ensure that the code in a critical section is not bypassed by throwing an exception. If an exception is thrown before the end of the section, the finally clause will relinquish the lock, but the object may be in a damaged state."*
>
> **Dịch:** Hãy cẩn thận đảm bảo **code trong critical section không bị bỏ qua do một exception được ném ra**. Nếu exception bị ném **trước khi section kết thúc**, mệnh đề `finally` **sẽ nhả lock**, nhưng **object có thể đang ở trạng thái hỏng**.

## API — `java.util.concurrent.locks.Lock` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void lock()` | **lấy lock này**; **block nếu lock đang do thread khác sở hữu**. |
| `void unlock()` | **nhả lock này**. |

## API — `java.util.concurrent.locks.ReentrantLock` (Java 5.0)

| Constructor | Mô tả (dịch từ sách) |
|---|---|
| `ReentrantLock()` | dựng một **reentrant lock** dùng để bảo vệ một critical section. |
| `ReentrantLock(boolean fair)` | dựng một lock với **fairness policy** cho trước. **Fair lock ưu tiên thread đã chờ lâu nhất.** Tuy nhiên, **đảm bảo công bằng này có thể là gánh nặng lớn cho hiệu năng**. Vì vậy, **mặc định lock không bắt buộc phải công bằng**. |

> **Caution (sách):** *"It sounds nice to be fair, but fair locks can be a lot slower than regular locks. You should only enable fair locking if you truly know what you are doing and have a specific reason to consider fairness essential for your program. Even if you use a fair lock, you have no guarantee that the thread scheduler is fair. If the thread scheduler chooses to neglect a thread that has been waiting a long time for the lock, it doesn't get the chance to be treated fairly by the lock."*
>
> **Dịch:** Nghe thì hay, nhưng **fair lock có thể chậm hơn rất nhiều so với lock thường**. Bạn **chỉ nên bật fair locking nếu thực sự biết mình đang làm gì** và **có lý do cụ thể coi tính công bằng là thiết yếu**. Kể cả khi dùng fair lock, **bạn không có đảm bảo nào rằng thread scheduler là công bằng**. Nếu scheduler **chọn bỏ mặc một thread đã chờ lock rất lâu**, thread đó **không có cơ hội được lock đối xử công bằng**.

---

## 10.5.4. Condition Objects

> *"Often, a thread enters a critical section only to discover that it can't proceed until a condition is fulfilled. Use a condition object to manage threads that have acquired a lock but cannot do useful work. In this section, I introduce the implementation of condition objects in the Java library. (For historical reasons, condition objects are often called condition variables.)"*

**Dịch:** Thường thì một thread **vào critical section rồi mới phát hiện nó không đi tiếp được cho tới khi một điều kiện được thoả**. Hãy dùng **condition object để quản lý các thread đã lấy được lock nhưng không làm được việc gì có ích**. (Vì lý do lịch sử, **condition object thường được gọi là condition variable**.)

> *"Let us refine our simulation of the bank. We do not want to transfer money out of an account that does not have the funds to cover the transfer. Note that we cannot use code like"*

```java
if (bank.getBalance(from) >= amount)
    bank.transfer(from, to, amount);
```

> *"It is entirely possible that the current thread will be deactivated between the successful outcome of the test and the call to transfer."*

```java
if (bank.getBalance(from) >= amount)
    // thread might be deactivated at this point
    bank.transfer(from, to, amount);
```

**Dịch:** Hãy tinh chỉnh mô phỏng ngân hàng: **ta không muốn chuyển tiền ra khỏi tài khoản không đủ tiền**. Lưu ý **không dùng được code như trên**, vì **hoàn toàn có thể thread hiện tại bị vô hiệu hoá giữa lúc kiểm tra thành công và lúc gọi `transfer`**.

> *"By the time the thread is running again, the account balance may have fallen below the withdrawal amount. You must make sure that no other thread can modify the balance between the test and the transfer action. You do so by protecting both the test and the transfer action with a lock:"*

```java
public void transfer(int from, int to, int amount)
{
    bankLock.lock();
    try
    {
        while (accounts[from] < amount)
        {
            // wait
            . . .
        }
        // transfer funds
        . . .
    }
    finally
    {
        bankLock.unlock();
    }
}
```

**Dịch:** Tới lúc thread chạy lại, **số dư tài khoản có thể đã tụt xuống dưới số tiền rút**. Bạn phải đảm bảo **không thread nào sửa được số dư giữa lúc kiểm tra và lúc chuyển tiền** — bằng cách **bảo vệ cả hai bằng một lock**.

> *"Now, what do we do when there is not enough money in the account? We wait until some other thread has added funds. But this thread has just gained exclusive access to the bankLock, so no other thread has a chance to make a deposit. This is where condition objects come in."*

**Dịch:** Vậy làm gì khi **tài khoản không đủ tiền**? Ta **chờ tới khi thread khác nạp thêm tiền**. Nhưng thread này **vừa giành được quyền truy cập độc quyền `bankLock`**, nên **không thread nào khác có cơ hội gửi tiền vào**. **Đây là chỗ condition object xuất hiện.**

> *"A lock object can have one or more associated condition objects. You obtain a condition object with the newCondition method. It is customary to give each condition object a name that evokes the condition that it represents. For example, here we set up a condition object to represent the "sufficient funds" condition."*

```java
class Bank
{
    . . .
    private final Condition sufficientFunds = bankLock.newCondition();
    . . .
}
```

**Dịch:** Một lock object **có thể có một hoặc nhiều condition object đi kèm**. Bạn lấy condition object bằng **`newCondition`**. Theo thông lệ, **đặt cho mỗi condition object một cái tên gợi lên điều kiện mà nó đại diện**.

> *"If the transfer method finds that sufficient funds are not available, it calls"*

```java
sufficientFunds.await();
```

> *"The current thread is now deactivated and gives up the lock. This lets in another thread that can, we hope, increase the account balance."*

**Dịch:** Nếu `transfer` thấy **không đủ tiền**, nó gọi `await`. Thread hiện tại **bị vô hiệu hoá và nhả lock**. Điều này **cho một thread khác vào**, hy vọng thread đó **làm tăng số dư tài khoản**.

> *"There is an essential difference between a thread that is waiting to acquire a lock and a thread that has called await. Once a thread calls the await method, it enters a wait set for that condition. The thread is not made runnable when the lock is available. Instead, it stays deactivated until another thread has called the signalAll method on the same condition."*

**Dịch:** Có **khác biệt cốt yếu giữa một thread đang chờ lấy lock và một thread đã gọi `await`**. Một khi thread gọi `await`, nó **vào wait set của condition đó**. Thread **không được chuyển sang runnable khi lock rảnh**. Thay vào đó, nó **ở trạng thái vô hiệu hoá cho tới khi một thread khác gọi `signalAll` trên cùng condition đó**.

> *"When another thread has transferred money, it should call"*

```java
sufficientFunds.signalAll();
```

> *"This call reactivates all threads waiting for the condition. When the threads are removed from the wait set, they are again runnable and the scheduler will eventually activate them again. At that time, they will attempt to reenter the object. As soon as the lock is available, one of them will acquire the lock and continue where it left off, returning from the call to await."*

**Dịch:** Khi một thread khác đã chuyển tiền xong, nó **nên gọi `signalAll`**. Lời gọi này **kích hoạt lại mọi thread đang chờ condition đó**. Khi các thread **được gỡ khỏi wait set, chúng lại runnable** và scheduler **rốt cuộc sẽ kích hoạt lại chúng**. Khi đó chúng **thử vào lại object**. Ngay khi lock rảnh, **một trong số chúng lấy lock và tiếp tục từ chỗ đang dở**, tức là **return khỏi lời gọi `await`**.

> *"At this time, the thread should test the condition again. There is no guarantee that the condition is now fulfilled—the signalAll method merely signals to the waiting threads that it may be fulfilled at this time and that it is worth checking for the condition again."*

**Dịch:** Lúc này, thread **nên kiểm tra lại điều kiện**. **Không có đảm bảo nào rằng điều kiện đã thoả** — `signalAll` **chỉ báo hiệu cho các thread đang chờ rằng điều kiện có thể đã thoả và đáng để kiểm tra lại**.

> **Note (sách):** *"In general, a call to await should be inside a loop of the form"*
>
> ```java
> while (!(OK to proceed))
>     condition.await();
> ```
>
> **Dịch:** Nói chung, lời gọi `await` **nên nằm trong một vòng lặp có dạng trên**.

> *"It is crucially important that some other thread calls the signalAll method eventually. When a thread calls await, it has no way of reactivating itself. It puts its faith in the other threads. If none of them bother to reactivate the waiting thread, it will never run again. This can lead to unpleasant deadlock situations. If all other threads are blocked and the last active thread calls await without unblocking one of the others, it also blocks. No thread is left to unblock the others, and the program hangs."*

**Dịch:** **Cực kỳ quan trọng là rốt cuộc phải có thread nào đó gọi `signalAll`.** Khi một thread gọi `await`, nó **không có cách nào tự kích hoạt lại mình** — nó **đặt niềm tin vào các thread khác**. Nếu không thread nào buồn kích hoạt lại nó thì **nó sẽ không bao giờ chạy nữa**. Điều này dẫn tới **tình huống deadlock khó chịu**. Nếu **mọi thread khác đều bị block và thread hoạt động cuối cùng gọi `await` mà không mở khoá cho ai**, thì **nó cũng block**. **Không còn thread nào để mở khoá cho những thread khác, và chương trình treo.**

> *"When should you call signalAll? The rule of thumb is to call signalAll whenever the state of an object changes in a way that might be advantageous to waiting threads. For example, whenever an account balance changes, the waiting threads should be given another chance to inspect the balance. In our example, we call signalAll when we have finished the funds transfer."*

```java
public void transfer(int from, int to, int amount)
{
    bankLock.lock();
    try
    {
        while (accounts[from] < amount)
            sufficientFunds.await();
        // transfer funds
        . . .
        sufficientFunds.signalAll();
    }
    finally
    {
        bankLock.unlock();
    }
}
```

**Dịch:** Khi nào nên gọi `signalAll`? Quy tắc chung là **gọi `signalAll` mỗi khi state của một object thay đổi theo hướng có thể có lợi cho các thread đang chờ**. Ví dụ, **mỗi khi số dư tài khoản thay đổi**, các thread đang chờ **nên được cho thêm cơ hội kiểm tra số dư**.

> *"Note that the call to signalAll does not immediately activate a waiting thread. It only unblocks the waiting threads so that they can compete for entry into the object after the current thread has relinquished the lock."*

**Dịch:** Lưu ý lời gọi `signalAll` **không kích hoạt ngay một thread đang chờ**. Nó **chỉ mở block cho các thread đang chờ** để chúng **cạnh tranh vào object sau khi thread hiện tại nhả lock**.

> *"Another method, signal, unblocks only a single thread from the wait set, chosen at random. That is more efficient than unblocking all threads, but there is a danger. If the randomly chosen thread finds that it still cannot proceed, it becomes blocked again. If no other thread calls signal again, the system deadlocks."*

**Dịch:** Một method khác, **`signal`, chỉ mở block cho một thread duy nhất trong wait set, chọn ngẫu nhiên**. Cách này **hiệu quả hơn việc mở block toàn bộ**, nhưng **có nguy hiểm**: nếu thread được chọn ngẫu nhiên **thấy nó vẫn không đi tiếp được, nó lại bị block**. Nếu **không thread nào khác gọi `signal` nữa, hệ thống deadlock**.

> **Caution (sách):** *"A thread can only call await, signalAll, or signal on a condition if it owns the lock of the condition."*
>
> **Dịch:** Một thread **chỉ gọi được `await`, `signalAll`, hoặc `signal` trên một condition nếu nó đang sở hữu lock của condition đó**.

> *"The sample program in the synch package has the same main method as the unsynch version in Listing 10.5, but the Bank class (Listing 10.6) uses locks. You will notice that nothing ever goes wrong. The total balance stays at $100,000 forever. No account ever has a negative balance. (Again, press Ctrl+C to terminate the program.) You may also notice that the program runs a bit slower—that is the price you pay for the added bookkeeping involved in the synchronization mechanism."*

**Dịch:** Chương trình mẫu trong package `synch` có **cùng method `main` với bản `unsynch` ở Listing 10.5**, nhưng class `Bank` (Listing 10.6) **dùng lock**. Bạn sẽ thấy **không bao giờ có gì sai**. **Tổng số dư giữ nguyên $100,000 mãi mãi.** **Không tài khoản nào có số dư âm.** Bạn cũng có thể thấy **chương trình chạy chậm hơn chút** — **đó là cái giá cho việc ghi sổ thêm mà cơ chế synchronization đòi hỏi**.

> *"When reading through the source code, notice that the transfer and getTotalBalance methods are protected by a lock, but the size method is not. In this simulation, the number of accounts never changes after construction, so there is no need for granting exclusive access to the size method."*

**Dịch:** Khi đọc mã nguồn, để ý rằng `transfer` và `getTotalBalance` **được lock bảo vệ, còn `size` thì không**. Trong mô phỏng này, **số tài khoản không bao giờ đổi sau khi dựng**, nên **không cần cấp quyền truy cập độc quyền cho `size`**.

### Listing 10.6 — `synch/Bank.java`

```java
package synch;

import java.util.*;
import java.util.concurrent.locks.*;

/**
 * A bank with a number of bank accounts that uses locks for serializing access.
 */
public class Bank
{
    private final double[] accounts;
    private final Lock bankLock = new ReentrantLock();
    private final Condition sufficientFunds = bankLock.newCondition();

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
    public void transfer(int from, int to, double amount) throws InterruptedException
    {
        bankLock.lock();
        try
        {
            while (accounts[from] < amount)
                sufficientFunds.await();
            System.out.print(Thread.currentThread());
            accounts[from] -= amount;
            System.out.printf(" %10.2f from %d to %d", amount, from, to);
            accounts[to] += amount;
            System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
            sufficientFunds.signalAll();
        }
        finally
        {
            bankLock.unlock();
        }
    }

    /**
     * Gets the sum of all account balances.
     * @return the total balance
     */
    public double getTotalBalance()
    {
        bankLock.lock();
        try
        {
            double sum = 0;

            for (double a : accounts)
                sum += a;

            return sum;
        }
        finally
        {
            bankLock.unlock();
        }
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

## API — `java.util.concurrent.locks.Lock` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Condition newCondition()` | trả về một **condition object gắn với lock này**. |

## API — `java.util.concurrent.locks.Condition` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void await()` | **đưa thread này vào wait set** của condition này. |
| `void signalAll()` | **mở block cho mọi thread trong wait set** của condition này. |
| `void signal()` | **mở block cho một thread được chọn ngẫu nhiên** trong wait set của condition này. |

---

## 10.5.5. Deadlocks

> *"Locks and conditions cannot solve all problems that might arise in multithreading. Consider the following situation:"*

**Dịch:** **Lock và condition không giải quyết được mọi vấn đề** có thể phát sinh trong multithreading. Xét tình huống sau:

| # | Tình huống (dịch từ sách) |
|---|---|
| 1 | Account 1: **$200** |
| 2 | Account 2: **$300** |
| 3 | Thread 1: chuyển **$300** từ Account 1 sang Account 2 |
| 4 | Thread 2: chuyển **$400** từ Account 2 sang Account 1 |

> *"As Figure 10.4 indicates, Threads 1 and 2 are clearly blocked. Neither can proceed because the balances in Accounts 1 and 2 are insufficient."*

**Dịch:** Thread 1 và Thread 2 **rõ ràng đều bị block**. **Không thread nào đi tiếp được vì số dư ở Account 1 và Account 2 đều không đủ.**

**Figure 10.4: A deadlock situation**

```
                                              ┌───┬───────┐
                                          ┌──►│ 1 │  200  │
                                          │   ├───┼───────┤
                                          │   │ 2 │  300  │
                                          │   ├───┴───────┤
                                          │   │           │
                     ┌──────────────┐     │   ├───────────┤
    bank.accounts ───│              │─────┘   │           │
                     └──────────────┘         ├───────────┤
                                              │           │
                                              ├───────────┤
   Thread 1                Thread 2           │           │
      ╷                       ╷               └───────────┘
      │ bank.transfer(1,2,300)╷
      │ bank.wait()           ╷
      ╷                       │ bank.transfer(2,1,400)
      ╷                       │ bank.wait()
      ╷                       ╷
      ╷                       ╷
```

Cả hai thread đều `wait()` vì số dư không đủ — không ai đánh thức ai nữa.

> *"It is possible that all threads get blocked because each is waiting for more money. Such a situation is called a deadlock."*

**Dịch:** **Có khả năng mọi thread đều bị block vì thread nào cũng chờ thêm tiền.** Tình huống đó gọi là **deadlock**.

> *"In our program, a deadlock cannot occur for a simple reason. Each transfer amount is for, at most, $1,000. Since there are 100 accounts and a total of $100,000 in them, at least one of the accounts must have at least $1,000 at any time. The thread moving money out of that account can therefore proceed."*

**Dịch:** Trong chương trình của ta, **deadlock không xảy ra được vì một lý do đơn giản**: mỗi lần chuyển **tối đa $1,000**. Vì có **100 tài khoản với tổng $100,000**, nên **luôn có ít nhất một tài khoản có ít nhất $1,000**. Do đó **thread chuyển tiền ra khỏi tài khoản đó đi tiếp được**.

> *"But if you change the run method of the threads to remove the $1,000 transaction limit, deadlocks will occur quickly. Try it out. Set NACCOUNTS to 10. Construct each transfer runnable with a max value of 2 * INITIAL_BALANCE and run the program. The program will run for a while and then hang."*

**Dịch:** Nhưng nếu bạn **sửa method `run` để bỏ giới hạn $1,000 mỗi giao dịch, deadlock sẽ xảy ra rất nhanh**. Hãy thử: đặt `NACCOUNTS` là **10**, dựng mỗi transfer runnable với **giá trị max là `2 * INITIAL_BALANCE`** rồi chạy. **Chương trình chạy một lúc rồi treo.**

> **Tip (sách):** *"When the program hangs, press Ctrl+\. You will get a thread dump that lists all threads. Each thread has a stack trace, telling you where it is currently blocked. Alternatively, run jconsole, as described in Chapter 7, and consult the Threads panel (see Figure 10.5)."*
>
> **Dịch:** Khi chương trình treo, **nhấn Ctrl+\**. Bạn sẽ nhận được **thread dump liệt kê mọi thread**. Mỗi thread có **stack trace cho biết nó đang block ở đâu**. Hoặc chạy **`jconsole`** như mô tả ở [[05 - Logging|Chapter 7]] rồi **xem panel Threads**.

> *"Another way to create a deadlock is to make the ith thread responsible for putting money into the ith account, rather than for taking it out of the ith account. In this case, there is a chance that all threads will simultaneously try to overdraw the same account, leaving no thread that can replenish it. Try it out. In the SynchBankTest program, turn to the run method of the TransferRunnable class. In the call to transfer, flip fromAccount and toAccount. Run the program and see how it deadlocks almost immediately."*

**Dịch:** Một cách khác tạo deadlock là **cho thread thứ i chịu trách nhiệm nạp tiền vào tài khoản thứ i, thay vì rút ra khỏi tài khoản thứ i**. Khi đó có khả năng **mọi thread cùng lúc cố rút quá số dư của cùng một tài khoản**, **không còn thread nào nạp lại cho nó**. Hãy thử: trong `SynchBankTest`, ở method `run` của class `TransferRunnable`, **đảo `fromAccount` và `toAccount` trong lời gọi `transfer`**. Chạy và xem nó **deadlock gần như ngay lập tức**.

### Deadlock do dùng `signal`

> *"Here is another situation in which a deadlock can occur easily. Change the signalAll method to signal in the SynchBankTest program. You will find that the program eventually hangs. (Again, set NACCOUNTS to 10 to observe the effect more quickly.) Unlike signalAll, which notifies all threads that are waiting for added funds, the signal method unblocks only one thread. If that thread can't proceed, all threads can be blocked. Consider the following sample scenario of a developing deadlock:"*

**Dịch:** Đây là một tình huống khác dễ sinh deadlock: **đổi `signalAll` thành `signal`** trong `SynchBankTest`. Bạn sẽ thấy **chương trình rốt cuộc treo**. Khác với `signalAll` báo cho mọi thread đang chờ tiền, **`signal` chỉ mở block cho một thread**. Nếu **thread đó không đi tiếp được thì mọi thread đều có thể bị block**. Xét kịch bản deadlock hình thành sau:

| # | Trạng thái ban đầu (dịch từ sách) |
|---|---|
| 1 | Account 1: **$1,990** |
| 2 | Mọi tài khoản khác: **$990 mỗi cái** |
| 3 | Thread 1: chuyển **$995** từ Account 1 sang Account 2 |
| 4 | Mọi thread khác: chuyển **$995** từ tài khoản của mình sang tài khoản khác |

> *"Clearly, all threads but Thread 1 are blocked, because there isn't enough money in their accounts. Thread 1 proceeds. Afterward, we have the following situation:"*

**Dịch:** Rõ ràng **mọi thread trừ Thread 1 đều bị block** vì tài khoản của chúng **không đủ tiền**. Thread 1 đi tiếp. Sau đó, ta có tình huống:

| # | Trạng thái sau (dịch từ sách) |
|---|---|
| 1 | Account 1: **$995** |
| 2 | Account 2: **$1,985** |
| 3 | Mọi tài khoản khác: **$990 mỗi cái** |

> *"Then, Thread 1 calls signal. The signal method picks a thread at random to unblock. Suppose it picks Thread 3. That thread is awakened, finds that there isn't enough money in its account, and calls await again. But Thread 1 is still running. A new random transaction is generated, say,"*

**Dịch:** Rồi Thread 1 gọi `signal`. **`signal` chọn ngẫu nhiên một thread để mở block.** Giả sử nó **chọn Thread 3**. Thread đó thức dậy, **thấy tài khoản mình không đủ tiền, và lại gọi `await`**. Nhưng **Thread 1 vẫn đang chạy**, và **một giao dịch ngẫu nhiên mới được sinh ra**, chẳng hạn:

| # | Giao dịch mới |
|---|---|
| 1 | Thread 1: chuyển **$997** từ Account 1 sang Account 2 |

> *"Now, Thread 1 also calls await, and all threads are blocked. The system has deadlocked."*

**Dịch:** Giờ **Thread 1 cũng gọi `await`, và mọi thread đều bị block. Hệ thống đã deadlock.**

> *"The culprit here is the call to signal. It only unblocks one thread, and it may not pick the thread that is essential to make progress. (In our scenario, Thread 2 must proceed to take money out of Account 2.)"*

**Dịch:** **Thủ phạm ở đây là lời gọi `signal`.** Nó **chỉ mở block cho một thread**, và **có thể không chọn đúng thread thiết yếu để tiến triển**. (Trong kịch bản trên, **Thread 2 mới là thread phải đi tiếp để rút tiền ra khỏi Account 2**.)

> *"As you can see, programming with locks and conditions can be quite challenging. You must design your program to ensure that a deadlock situation cannot occur."*

**Dịch:** Như bạn thấy, **lập trình với lock và condition khá thách thức**. Bạn **phải thiết kế chương trình sao cho tình huống deadlock không xảy ra được**.

---

## 10.5.6. The synchronized Keyword

> *"In the preceding sections, you saw how to use Lock and Condition objects. Before going any further, let us summarize the key points about locks and conditions:"*

**Dịch:** Trước khi đi xa hơn, hãy tóm tắt **các điểm then chốt về lock và condition**:

| Điểm | Nội dung (dịch từ sách) |
|---|---|
| 1 | **Lock bảo vệ các đoạn code**, chỉ cho **một thread thực thi code tại một thời điểm**. |
| 2 | **Lock quản lý các thread đang cố vào critical section.** |
| 3 | **Một lock có thể có một hoặc nhiều condition object đi kèm.** |
| 4 | **Mỗi condition object quản lý các thread đã vào critical section nhưng không đi tiếp được.** |

> *"The Lock and Condition interfaces give programmers a high degree of control over locking. However, in most situations, you don't need that control—you can use a mechanism that is built into the Java language. Ever since version 1.0, every object in Java has an intrinsic lock. If a method is declared with the synchronized keyword, the object's lock protects the entire method. That is, to call the method, a thread must acquire the intrinsic object lock."*

**Dịch:** Interface `Lock` và `Condition` cho lập trình viên **mức kiểm soát cao đối với việc lock**. Tuy nhiên, **hầu hết tình huống bạn không cần mức kiểm soát đó** — bạn dùng được **cơ chế xây sẵn trong ngôn ngữ Java**. **Ngay từ phiên bản 1.0, mọi object trong Java đều có một intrinsic lock.** Nếu một method được khai báo với **keyword `synchronized`**, thì **lock của object bảo vệ toàn bộ method**. Tức là **để gọi method, thread phải lấy được intrinsic object lock**.

> *"In other words,"*

```java
public synchronized void method()
{
    method body
}
```

> *"is the equivalent of"*

```java
public void method()
{
    this.intrinsicLock.lock();
    try
    {
        method body
    }
    finally
    {
        this.intrinsicLock.unlock();
    }
}
```

> *"For example, instead of using an explicit lock, we can simply declare the transfer method of the Bank class as synchronized."*

**Dịch:** Nói cách khác, hai dạng trên **tương đương nhau**. Ví dụ, **thay vì dùng lock tường minh**, ta **chỉ cần khai báo method `transfer` của class `Bank` là `synchronized`**.

> *"The intrinsic object lock has a single associated condition. The wait method adds a thread to the wait set, and the notifyAll/notify methods unblock waiting threads. In other words, calling wait or notifyAll is the equivalent of"*

```java
intrinsicCondition.await();
intrinsicCondition.signalAll();
```

**Dịch:** **Intrinsic object lock chỉ có một condition đi kèm.** Method **`wait` thêm thread vào wait set**, còn **`notifyAll`/`notify` mở block cho các thread đang chờ**. Nói cách khác, gọi `wait` hoặc `notifyAll` **tương đương với `await` / `signalAll`** trên condition đó.

> **Note (sách):** *"The wait, notifyAll, and notify methods are final methods of the Object class. The Condition methods had to be named await, signalAll, and signal so that they don't conflict with those methods."*
>
> **Dịch:** `wait`, `notifyAll`, `notify` là **các method `final` của class `Object`**. Các method của `Condition` **buộc phải đặt tên là `await`, `signalAll`, `signal`** để **không xung đột với chúng**.

> *"For example, you can implement the Bank class in Java like this:"*

```java
class Bank
{
    private double[] accounts;

    public synchronized void transfer(int from, int to, int amount)
        throws InterruptedException
    {
        while (accounts[from] < amount)
            wait(); // wait on intrinsic object lock's single condition
        accounts[from] -= amount;
        accounts[to] += amount;
        notifyAll(); // notify all threads waiting on the condition
    }

    public synchronized double getTotalBalance()
    {
        . . .
    }
}
```

> *"As you can see, using the synchronized keyword yields code that is much more concise. Of course, to understand this code, you have to know that each object has an intrinsic lock, and that the lock has an intrinsic condition. The lock manages the threads that try to enter a synchronized method. The condition manages the threads that have called wait."*

**Dịch:** Như bạn thấy, dùng keyword `synchronized` cho ra **code gọn hơn nhiều**. Dĩ nhiên, để hiểu code này bạn phải biết **mỗi object có một intrinsic lock và lock đó có một intrinsic condition**. **Lock quản lý các thread cố vào method `synchronized`. Condition quản lý các thread đã gọi `wait`.**

> *"It is also legal to declare static methods as synchronized. If such a method is called, it acquires the intrinsic lock of the associated class object. For example, if the Bank class has a static synchronized method, then the lock of the Bank.class object is locked when it is called. As a result, no other thread can call this or any other synchronized static method of the same class."*

**Dịch:** Cũng **hợp lệ khi khai báo [[04 - Static Fields and Methods|static method]] là `synchronized`**. Nếu method như vậy được gọi, nó **lấy intrinsic lock của class object tương ứng**. Ví dụ, nếu class `Bank` có một static method `synchronized` thì **lock của object `Bank.class` bị khoá khi method được gọi**. Kết quả là **không thread nào khác gọi được method này hay bất kỳ static method `synchronized` nào khác của cùng class**.

### Hạn chế của intrinsic lock

> *"The intrinsic locks and conditions have some limitations. Among them:"*

**Dịch:** **Intrinsic lock và condition có một số hạn chế**, trong đó:

| Hạn chế (dịch từ sách) |
|---|
| **Virtual thread bị pinned khi lấy một intrinsic lock.** Chúng **không unmount khỏi carrier thread được cho tới khi lock được nhả**. Pinning **không phải vấn đề nếu critical section được thoát ngay**. Nhưng nếu **virtual thread block trong lúc bị pinned**, điều này **có thể làm giảm nghiêm trọng throughput và thậm chí gây đói (starvation) cho carrier thread pool**. |
| **Bạn không interrupt được một thread đang cố lấy intrinsic lock.** Với `ReentrantLock`, bạn **gọi được `lockInterruptibly`**. |
| **Bạn không chỉ định được timeout khi cố lấy một intrinsic lock.** |
| **Việc mỗi lock chỉ có một condition có thể kém hiệu quả.** |

> *"What should you use in your code—Lock and Condition objects or synchronized methods? Here is my recommendation:"*

**Dịch:** Nên dùng gì trong code — object `Lock`/`Condition` hay method `synchronized`? Đây là **khuyến nghị của tác giả**:

| Khuyến nghị (dịch từ sách) |
|---|
| **Tốt nhất là không dùng cả `Lock`/`Condition` lẫn keyword `synchronized`.** Trong nhiều tình huống, bạn dùng được **một trong các cơ chế của package `java.util.concurrent` vốn lo hết việc lock giùm bạn**. Ví dụ, ở Section 10.6.1 bạn sẽ thấy cách dùng **blocking queue** để synchronize các thread cùng làm một công việc chung. |
| **Nếu keyword `synchronized` hợp với tình huống của bạn thì cứ dùng.** Bạn **viết ít code hơn và ít chỗ sai hơn**. Listing 10.7 cho thấy ví dụ bank implement bằng method `synchronized`. Tuy nhiên, hãy nhớ **lock đó là public** — xem phần sau. |
| **Dùng `Lock`/`Condition` nếu bạn dùng virtual thread**, hoặc nếu bạn **thực sự cần thêm sức mạnh mà các cấu trúc này mang lại**. |

> **Tip (sách):** *"To find out whether pinned threads are blocked, start the JVM with one of the options"*
>
> ```
> -Djdk.tracePinnedThreads=short
> -Djdk.tracePinnedThreads=full
> ```
>
> *"You get a stack trace that shows when a pinned thread blocks:"*
>
> ```
> . . .
> org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
> <== monitors:1
> . . .
> ```
>
> *"Note that you get only one warning per pinning location! Alternatively, record with Java Flight Recorder, view with your favorite mission control viewer, and look for VirtualThreadPinned and VirtualThreadSubmitFailed events."*
>
> **Dịch:** Để biết **thread bị pinned có đang block hay không**, khởi động JVM với một trong hai option trên. Bạn nhận được **stack trace cho thấy khi nào một pinned thread block**. Lưu ý **chỉ có một cảnh báo cho mỗi vị trí pinning!** Hoặc **ghi lại bằng Java Flight Recorder**, xem bằng trình mission control ưa thích, và **tìm sự kiện `VirtualThreadPinned` và `VirtualThreadSubmitFailed`**.

### Listing 10.7 — `synch2/Bank.java`

```java
package synch2;

import java.util.*;

/**
 * A bank with a number of bank accounts that uses synchronization primitives.
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
    public synchronized void transfer(int from, int to, double amount)
        throws InterruptedException
    {
        while (accounts[from] < amount)
            wait();
        System.out.print(Thread.currentThread());
        accounts[from] -= amount;
        System.out.printf(" %10.2f from %d to %d", amount, from, to);
        accounts[to] += amount;
        System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
        notifyAll();
    }

    /**
     * Gets the sum of all account balances.
     * @return the total balance
     */
    public synchronized double getTotalBalance()
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

## API — `java.lang.Object` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `void notifyAll()` | **mở block cho các thread đã gọi `wait` lên object này**. Method này **chỉ gọi được từ bên trong một method hoặc block `synchronized`**. Nó **ném `IllegalMonitorStateException` nếu thread hiện tại không phải chủ sở hữu lock của object**. |
| `void notify()` | **mở block cho một thread được chọn ngẫu nhiên** trong số các thread đã gọi `wait` lên object này. Chỉ gọi được từ trong method/block `synchronized`. Ném `IllegalMonitorStateException` nếu thread hiện tại không sở hữu lock của object. |
| `void wait()` | khiến một thread **chờ cho tới khi được notify**. Chỉ gọi được từ trong method/block `synchronized`. Ném `IllegalMonitorStateException` nếu thread hiện tại không sở hữu lock của object. |
| `void wait(long millis)`<br>`void wait(long millis, int nanos)` | khiến một thread chờ **cho tới khi được notify hoặc cho tới khi hết khoảng thời gian đã chỉ định**. Chỉ gọi được từ trong method/block `synchronized`. Ném `IllegalMonitorStateException` nếu thread hiện tại không sở hữu lock của object. **Số nanosecond không được vượt quá 1,000,000.** |

---

## 10.5.7. Synchronized Blocks

> *"As we just discussed, every Java object has a lock. A thread can acquire the lock by calling a synchronized method. There is a second mechanism for acquiring the lock: by entering a synchronized block. When a thread enters a block of the form"*

```java
synchronized (obj) // this is the syntax for a synchronized block
{
    critical section
}
```

> *"then it acquires the lock for obj."*

**Dịch:** Như vừa bàn, **mọi object Java đều có một lock**. Thread lấy được lock bằng cách **gọi một method `synchronized`**. Có **cơ chế thứ hai để lấy lock: vào một synchronized block**. Khi một thread vào block có dạng trên, **nó lấy lock của `obj`**.

> *"You will sometimes find "ad hoc" locks, such as"*

```java
public class Bank
{
    private double[] accounts;
    private final Object lock = new Object();
    . . .
    public void transfer(int from, int to, int amount)
    {
        synchronized (lock) // an ad-hoc lock
        {
            accounts[from] -= amount;
            accounts[to] += amount;
        }
        System.out.println(. . .);
    }
}
```

> *"Here, the lock object is created only to use the lock that every Java object possesses."*

**Dịch:** Đôi khi bạn sẽ gặp các **lock "ad hoc"**. Ở đây, **object `lock` được tạo ra chỉ để dùng cái lock mà mọi object Java đều có**.

> **Caution (sách):** *"With synchronized blocks, be careful about the lock object. For example, this will not work:"*
>
> ```java
> private final String lock = "LOCK";
> . . .
> synchronized (lock) { . . . } // Don't lock on string literal!
> ```
>
> *"If this occurs twice in the same program, the locks are the same object since string literals are shared. This can lead to a deadlock. Also, stay away from using primitive type wrappers as locks:"*
>
> ```java
> private final Integer lock = new Integer(42); // Don't lock on wrappers
> ```
>
> *"The constructor call new Integer(42) is deprecated, and you don't want a maintenance programmer to change the call to Integer.valueOf(42). If done twice with the same magic number, the lock will be accidentally shared."*
>
> **Dịch:** Với synchronized block, **hãy cẩn thận với lock object**. Ví dụ, khoá trên **[[05 - Strings|string literal]] sẽ không hoạt động**: nếu điều này **xảy ra hai lần trong cùng chương trình thì hai lock là cùng một object**, vì **string literal được chia sẻ** — dẫn tới **deadlock**. Cũng **tránh dùng primitive type wrapper làm lock**: lời gọi constructor `new Integer(42)` **đã deprecated**, và bạn **không muốn một lập trình viên bảo trì đổi nó thành `Integer.valueOf(42)`** — nếu làm hai lần với **cùng một con số ma thuật**, **lock sẽ vô tình bị chia sẻ**.

> **Caution (tiếp):** *"If you need to modify a static field, lock on the specific class, not on the value returned by getClass():"*
>
> ```java
> synchronized (MyClass.class) { staticCounter++; } // OK
> synchronized (getClass()) { staticCounter++; } // Don't
> ```
>
> *"If the method containing this code is called from a subclass, then getClass() returns a different Class object! You are no longer guaranteed mutual exclusion! In general, if you must use synchronized blocks, know your lock object! You must use the same lock for all critical sections, and nobody else must use your lock."*
>
> **Dịch:** Nếu cần sửa một static field, **hãy khoá trên class cụ thể, không phải trên giá trị `getClass()` trả về**. Nếu method chứa code này **được gọi từ một subclass thì `getClass()` trả về một object `Class` khác!** Bạn **không còn được đảm bảo loại trừ lẫn nhau (mutual exclusion)**. Nói chung, **nếu buộc phải dùng synchronized block thì hãy biết rõ lock object của mình!** Bạn **phải dùng cùng một lock cho mọi critical section**, và **không ai khác được dùng lock của bạn**.

### Client-side locking

> *"Sometimes, programmers use the lock of an object to implement additional atomic operations—a practice known as client-side locking. Consider, for example, the Vector class, which is a list whose methods are synchronized. Now suppose we stored our bank balances in a Vector\<Double>. Here is a naive implementation of a transfer method:"*

```java
public void transfer(Vector<Double> accounts, int from, int to, int amount) // ERROR
{
    accounts.set(from, accounts.get(from) - amount);
    accounts.set(to, accounts.get(to) + amount);
    System.out.println(. . .);
}
```

**Dịch:** Đôi khi lập trình viên **dùng lock của một object để implement thêm các thao tác atomic** — cách làm gọi là **client-side locking**. Ví dụ, class **`Vector`** là một list có **các method `synchronized`**. Giả sử ta lưu số dư ngân hàng trong một `Vector<Double>`. Trên là một **implementation ngây thơ** của method `transfer`.

> *"The get and set methods of the Vector class are synchronized, but that doesn't help us. It is entirely possible for a thread to be preempted in the transfer method after the first call to get has been completed. Another thread may then store a different value into the same position. However, we can hijack the lock:"*

```java
public void transfer(Vector<Double> accounts, int from, int to, int amount)
{
    synchronized (accounts)
    {
        accounts.set(from, accounts.get(from) - amount);
        accounts.set(to, accounts.get(to) + amount);
    }
    System.out.println(. . .);
}
```

**Dịch:** `get` và `set` của `Vector` **là `synchronized`, nhưng điều đó không giúp gì**. **Hoàn toàn có thể một thread bị preempt trong `transfer` ngay sau khi lời gọi `get` đầu tiên hoàn tất**, rồi **thread khác lưu một giá trị khác vào cùng vị trí đó**. Tuy nhiên, ta **có thể chiếm dụng (hijack) lock**.

> *"This approach works, but it is entirely dependent on the fact that the Vector class uses the intrinsic lock for all of its mutator methods. However, is this really a fact? The documentation of the Vector class makes no such promise. You have to carefully study the source code and hope that future versions do not introduce unsynchronized mutators. As you can see, client-side locking is very fragile and not generally recommended."*

**Dịch:** Cách này **hoạt động, nhưng hoàn toàn phụ thuộc vào việc class `Vector` dùng intrinsic lock cho mọi mutator method của nó**. Nhưng **đó có thực sự là sự thật?** **Tài liệu của `Vector` không hứa hẹn điều đó.** Bạn phải **nghiên cứu kỹ mã nguồn và hy vọng các phiên bản tương lai không đưa vào mutator không synchronized**. Như bạn thấy, **client-side locking rất mong manh và nói chung không được khuyến nghị**.

> **Note (sách):** *"The Java virtual machine has built-in support for synchronized methods. However, synchronized blocks are compiled into a lengthy sequence of bytecodes to manage the intrinsic lock."*
>
> **Dịch:** JVM **có hỗ trợ sẵn cho method `synchronized`**. Tuy nhiên, **synchronized block được biên dịch thành một chuỗi bytecode dài** để quản lý intrinsic lock.

---

## 10.5.8. The Monitor Concept

> *"Locks and conditions are powerful tools for thread synchronization, but they are not very object-oriented. For many years, researchers have looked for ways to make multithreading safe without forcing programmers to think about explicit locks. One of the most successful solutions is the monitor concept that was pioneered by Per Brinch Hansen and Tony Hoare in the 1970s. In the terminology of Java, a monitor has these properties:"*

**Dịch:** Lock và condition là **công cụ mạnh cho thread synchronization, nhưng không mấy hướng đối tượng**. Nhiều năm qua, giới nghiên cứu tìm cách **làm multithreading an toàn mà không bắt lập trình viên phải nghĩ về lock tường minh**. Một trong những giải pháp thành công nhất là **khái niệm monitor**, do **Per Brinch Hansen và Tony Hoare tiên phong vào thập niên 1970**. Theo thuật ngữ Java, **monitor có các property sau**:

| Property của monitor (dịch từ sách) |
|---|
| Monitor là một **class chỉ có field `private`**. |
| **Mỗi object của class đó có một lock đi kèm.** |
| **Mọi method đều bị lock đó khoá.** Nói cách khác, nếu client gọi `obj.method()` thì **lock của `obj` tự động được lấy ở đầu lời gọi method và được nhả khi method return**. |
| Vì **mọi field đều `private`**, cách sắp xếp này **đảm bảo không thread nào truy cập được field trong lúc thread khác thao tác lên chúng**. |
| **Lock có thể có bao nhiêu condition đi kèm cũng được.** |

> *"Earlier versions of monitors had a single condition, with a rather elegant syntax. You can simply call await accounts[from] >= amount without using an explicit condition variable. However, research showed that indiscriminate retesting of conditions can be inefficient. This problem is solved with explicit condition variables, each managing a separate set of threads."*

**Dịch:** Các phiên bản monitor đời đầu **chỉ có một condition, với cú pháp khá thanh lịch**: bạn **chỉ cần gọi `await accounts[from] >= amount` mà không cần condition variable tường minh**. Tuy nhiên, nghiên cứu cho thấy **việc kiểm tra lại điều kiện một cách bừa bãi có thể kém hiệu quả**. Vấn đề này **được giải quyết bằng condition variable tường minh, mỗi cái quản lý một tập thread riêng**.

> *"The Java designers loosely adapted the monitor concept. Every object in Java has an intrinsic lock and an intrinsic condition. If a method is declared with the synchronized keyword, it acts like a monitor method. The condition variable is accessed by calling wait/notifyAll/notify."*

**Dịch:** Người thiết kế Java **phỏng theo khái niệm monitor một cách lỏng lẻo**. **Mọi object trong Java đều có một intrinsic lock và một intrinsic condition.** Nếu một method được khai báo `synchronized`, nó **hành xử như một monitor method**. Condition variable **được truy cập bằng cách gọi `wait`/`notifyAll`/`notify`**.

> *"However, a Java object differs from a monitor in three important ways, compromising thread safety:"*

**Dịch:** Tuy nhiên, một object Java **khác monitor ở ba điểm quan trọng, làm tổn hại thread safety**:

| Khác biệt (dịch từ sách) |
|---|
| **Field không bắt buộc phải `private`.** |
| **Method không bắt buộc phải `synchronized`.** |
| **Intrinsic lock lộ ra cho client.** |

> *"This disrespect for security enraged Per Brinch Hansen. In a scathing review of the multithreading primitives in Java, he wrote: "It is astounding to me that Java's insecure parallelism is taken seriously by the programming community, a quarter of a century after the invention of monitors and Concurrent Pascal. It has no merit" (Java's Insecure Parallelism, ACM SIGPLAN Notices 34:38–45, April 1999)."*

**Dịch:** **Sự coi thường tính an toàn này khiến Per Brinch Hansen nổi giận.** Trong một bài phê bình gay gắt về các primitive multithreading của Java, ông viết: *"Thật kinh ngạc với tôi khi kiểu song song không an toàn của Java lại được cộng đồng lập trình xem trọng, một phần tư thế kỷ sau khi monitor và Concurrent Pascal ra đời. Nó chẳng có giá trị gì."* (*Java's Insecure Parallelism*, ACM SIGPLAN Notices 34:38–45, April 1999).

---

## 10.5.9. Volatile Fields

> *"Sometimes, it seems excessive to pay the cost of synchronization just to read or write an instance field or two. After all, what can go wrong? Unfortunately, with modern processors and compilers, there is plenty of room for error."*

**Dịch:** Đôi khi **trả cái giá của synchronization chỉ để đọc hoặc ghi một hai instance field có vẻ quá đáng**. Rốt cuộc thì **có gì sai được?** Đáng tiếc, với **processor và compiler hiện đại, có rất nhiều chỗ để sai**.

| Nguồn lỗi (dịch từ sách) |
|---|
| **Máy nhiều processor có thể tạm giữ giá trị bộ nhớ trong register hoặc cache cục bộ.** Hệ quả là **thread chạy trên các processor khác nhau có thể thấy giá trị khác nhau cho cùng một vị trí bộ nhớ!** |
| **Compiler có thể sắp xếp lại chỉ thị để tối đa throughput.** Compiler **sẽ không chọn thứ tự làm thay đổi ý nghĩa code**, nhưng chúng **giả định giá trị bộ nhớ chỉ đổi khi có chỉ thị tường minh trong code**. Trong khi đó, **một giá trị bộ nhớ có thể bị thread khác thay đổi!** |

> *"If you use locks to protect code that can be accessed by multiple threads, you won't have these problems. Compilers are required to respect locks by flushing or re-fetching register values, not reordering instructions inappropriately, and issuing memory fence instructions. The details are explained in the Java Memory Model Specification (section 17.4 of the Java Language Specification). Much of the specification is highly complex and technical, but the section also contains a number of clearly explained examples."*

**Dịch:** Nếu bạn **dùng lock để bảo vệ code mà nhiều thread truy cập được thì sẽ không gặp các vấn đề trên**. **Compiler buộc phải tôn trọng lock** bằng cách **flush hoặc nạp lại giá trị register**, **không sắp xếp lại chỉ thị một cách không phù hợp**, và **phát ra chỉ thị memory fence**. Chi tiết được giải thích trong **Java Memory Model Specification** (mục 17.4 của Java Language Specification).

> **Note (sách):** *"Brian Goetz coined the following "synchronization motto": "If you write a variable which may next be read by another thread, or you read a variable which may have last been written by another thread, you must use synchronization.""*
>
> **Dịch:** Brian Goetz đặt ra **"khẩu hiệu synchronization"**: *"Nếu bạn **ghi một biến mà kế đó có thể bị thread khác đọc**, hoặc bạn **đọc một biến mà lần ghi cuối có thể do thread khác thực hiện**, thì **bạn phải dùng synchronization**."*

> *"The volatile keyword offers a lock-free mechanism for synchronizing access to an instance field. If you declare a field as volatile, then the compiler and the virtual machine take into account that the field may be concurrently updated by another thread."*

**Dịch:** Keyword **`volatile` cung cấp một cơ chế không cần lock (lock-free)** để synchronize truy cập vào một instance field. Nếu bạn khai báo một field là `volatile`, thì **compiler và virtual machine tính đến việc field đó có thể bị thread khác cập nhật đồng thời**.

> *"For example, suppose an object has a boolean flag done that is set by one thread and queried by another thread. As we already discussed, you can use a lock:"*

```java
private boolean done;
public synchronized boolean isDone() { return done; }
public synchronized void setDone() { done = true; }
```

> *"Perhaps it is not a good idea to use the intrinsic object lock. The isDone and setDone methods can block if another thread has locked the object. If that is a concern, one can use a separate lock just for this variable. But this is getting to be a lot of trouble. In this case, it is reasonable to declare the field as volatile:"*

```java
private volatile boolean done;
public boolean isDone() { return done; }
public void setDone() { done = true; }
```

> *"The compiler will insert the appropriate code to ensure that a change to the done variable in one thread is visible from any other thread that reads the variable."*

**Dịch:** Ví dụ, giả sử một object có cờ `boolean` tên `done` **được một thread set và một thread khác truy vấn**. Có lẽ **dùng intrinsic object lock không phải ý hay** — `isDone` và `setDone` **có thể block nếu thread khác đã khoá object**. Nếu lo điều đó, có thể **dùng một lock riêng chỉ cho biến này**, nhưng **như thế thì rắc rối quá**. Trong trường hợp này, **khai báo field là `volatile` là hợp lý**. Compiler sẽ **chèn code thích hợp để đảm bảo thay đổi biến `done` ở một thread là nhìn thấy được từ bất kỳ thread nào khác đọc biến đó**.

> **Caution (sách):** *"Volatile variables do not provide any atomicity. For example, the method"*
>
> ```java
> public void flipDone() { done = !done; } // not atomic
> ```
>
> *"is not guaranteed to flip the value of the field. There is no guarantee that the reading, flipping, and writing is uninterrupted."*
>
> **Dịch:** **Biến `volatile` không cung cấp tính atomic nào.** Ví dụ method trên **không được đảm bảo lật được giá trị của field** — **không có đảm bảo nào rằng việc đọc, lật, và ghi là không bị gián đoạn**.

---

## 10.5.10. Final Fields

> *"As you saw in the preceding section, you cannot safely read a field from multiple threads unless you use locks or the volatile modifier. There is one other situation in which it is safe to access a shared field—when it is declared final. Once the constructor has completed, any thread with a reference to the object will see the final fields with their initialized values."*

```java
public class Bank
{
    final HashMap<String, Double> accounts;

    public Bank()
    {
        accounts = new HashMap<>();
    }
}
```

**Dịch:** Như đã thấy ở phần trước, bạn **không đọc an toàn một field từ nhiều thread được trừ khi dùng lock hoặc modifier `volatile`**. Có **một tình huống khác an toàn khi truy cập field chia sẻ — khi nó được khai báo [[03 - Defining Your Own Classes|`final`]]**. **Một khi constructor hoàn tất, mọi thread có reference tới object sẽ thấy các field `final` với giá trị đã khởi tạo của chúng.**

> *"Other threads get to see the initialized accounts variable after the constructor has finished. Without using final, there would be no guarantee that other threads would see the updated value of accounts—they might all see null, not the constructed HashMap."*

**Dịch:** Các thread khác **thấy được biến `accounts` đã khởi tạo sau khi constructor xong**. **Không dùng `final` thì không có đảm bảo nào rằng thread khác thấy được giá trị cập nhật của `accounts`** — chúng **có thể thấy `null` thay vì [[04 - Maps|`HashMap`]] đã được dựng**.

> *"Of course, the operations on the map are not thread-safe. If multiple threads mutate and read the map, you still need synchronization."*

**Dịch:** Dĩ nhiên, **các thao tác trên map không thread-safe**. Nếu nhiều thread **mutate và đọc map thì bạn vẫn cần synchronization**.

> **Caution (sách):** *"The guarantee has an important caveat: the reference to this must not have escaped during construction. The reference escapes if the constructor assigns this to a field of another object or passes this to another method."*
>
> **Dịch:** Đảm bảo này có một **lưu ý quan trọng: reference tới `this` không được thoát ra (escape) trong lúc dựng object**. Reference **escape nếu constructor gán `this` vào field của một object khác hoặc truyền `this` cho một method khác**.

> *"An object is properly constructed if the this reference does not escape during construction. If an object was properly constructed and all fields are final, it can be safely shared without synchronization."*

**Dịch:** Một object được coi là **dựng đúng cách (properly constructed) nếu reference `this` không escape trong lúc dựng**. Nếu object **được dựng đúng cách và mọi field đều `final`**, nó **chia sẻ an toàn được mà không cần synchronization**.

---

## 10.5.11. Atomics

> *"You can declare shared variables as volatile provided you perform no operations other than assignment. There are a number of classes in the java.util.concurrent.atomic package that use efficient machine-level instructions to guarantee atomicity of other operations without using locks. For example, the AtomicInteger class has methods incrementAndGet and decrementAndGet that atomically increment or decrement an integer. For example, you can safely generate a sequence of numbers like this:"*

```java
public static final AtomicLong nextNumber = new AtomicLong();
// in some thread. . .
long id = nextNumber.incrementAndGet();
```

**Dịch:** Bạn **khai báo biến chia sẻ là `volatile` được, miễn là bạn không thực hiện thao tác nào ngoài phép gán**. Có một loạt class trong package **`java.util.concurrent.atomic`** dùng **chỉ thị mức máy hiệu quả để đảm bảo tính atomic của các thao tác khác mà không cần lock**. Ví dụ, class **`AtomicInteger`** có method **`incrementAndGet` và `decrementAndGet`** để **tăng/giảm một số nguyên một cách atomic**.

> *"The incrementAndGet method atomically increments the AtomicLong and returns the post-increment value. That is, the operations of getting the value, adding 1, setting it, and producing the new value cannot be preempted. It is guaranteed that the correct value is computed and returned, even if multiple threads access the same instance concurrently."*

**Dịch:** `incrementAndGet` **tăng `AtomicLong` một cách atomic và trả về giá trị sau khi tăng**. Nghĩa là các thao tác **lấy giá trị, cộng 1, set lại, và cho ra giá trị mới không thể bị preempt**. **Đảm bảo giá trị đúng được tính và trả về**, kể cả khi **nhiều thread truy cập cùng instance đồng thời**.

> *"There are methods for atomically setting, adding, and subtracting values, but if you want to make a more complex update, you have to use the compareAndSet method. For example, suppose you want to keep track of the largest value that is observed by different threads. The following won't work:"*

```java
public static final AtomicLong largest = new AtomicLong();
// in some thread. . .
largest.set(Math.max(largest.get(), observed)); // ERROR--race condition!
```

**Dịch:** Có method để **set, cộng, trừ giá trị một cách atomic**, nhưng nếu muốn **cập nhật phức tạp hơn thì phải dùng `compareAndSet`**. Ví dụ, giả sử bạn muốn **theo dõi giá trị lớn nhất mà các thread khác nhau quan sát được** — code trên **sẽ không hoạt động**.

> *"This update is not atomic. Instead, provide a lambda expression for updating the variable, and the update is done for you. In our example, we can call"*

```java
largest.updateAndGet(x -> Math.max(x, observed));
```

> *"or"*

```java
largest.accumulateAndGet(observed, Math::max);
```

> *"The accumulateAndGet method takes a binary operator that is used to combine the atomic value and the supplied argument. There are also methods getAndUpdate and getAndAccumulate that return the old value."*

**Dịch:** **Cập nhật đó không atomic.** Thay vào đó, hãy **cung cấp một [[02 - Lambda Expressions|lambda expression]] để cập nhật biến**, và **việc cập nhật được làm giùm bạn**. `accumulateAndGet` **nhận một binary operator dùng để kết hợp giá trị atomic với argument được cung cấp**. Cũng có method **`getAndUpdate` và `getAndAccumulate` trả về giá trị cũ**.

> **Note (sách):** *"These methods are also provided for the classes AtomicInteger, AtomicIntegerArray, AtomicIntegerFieldUpdater, AtomicLongArray, AtomicLongFieldUpdater, AtomicReference, AtomicReferenceArray, and AtomicReferenceFieldUpdater."*
>
> **Dịch:** Các method này **cũng có ở các class** `AtomicInteger`, `AtomicIntegerArray`, `AtomicIntegerFieldUpdater`, `AtomicLongArray`, `AtomicLongFieldUpdater`, `AtomicReference`, `AtomicReferenceArray`, và `AtomicReferenceFieldUpdater`.

### LongAdder và LongAccumulator

> *"When you have a very large number of threads accessing the same atomic values, performance suffers because the optimistic updates require too many retries. The LongAdder and LongAccumulator classes solve this problem. A LongAdder is composed of multiple variables whose collective sum is the current value. Multiple threads can update different summands, and new summands are automatically provided when the number of threads increases. This is efficient in the common situation where the value of the sum is not needed until after all work has been done. The performance improvement can be substantial."*

**Dịch:** Khi bạn có **rất nhiều thread truy cập cùng các giá trị atomic, hiệu năng sụt** vì **các cập nhật lạc quan (optimistic) đòi hỏi quá nhiều lần thử lại**. Class **`LongAdder` và `LongAccumulator` giải quyết vấn đề này**. **`LongAdder` gồm nhiều biến mà tổng của chúng là giá trị hiện tại.** Nhiều thread **cập nhật các số hạng khác nhau**, và **số hạng mới được tự động cung cấp khi số thread tăng lên**. Cách này **hiệu quả trong tình huống phổ biến khi giá trị tổng chỉ cần tới sau khi mọi việc đã xong**. **Cải thiện hiệu năng có thể rất đáng kể.**

> *"If you anticipate high contention, you should simply use a LongAdder instead of an AtomicLong. The method names are slightly different. Call increment to increment a counter or add to add a quantity, and sum to retrieve the total."*

```java
final var adder = new LongAdder();
for (. . .)
    executor.submit(() ->
    {
        while (. . .)
        {
            . . .
            if (. . .) adder.increment();
        }
    });
. . .
long total = adder.sum();
```

**Dịch:** Nếu bạn **dự đoán có tranh chấp (contention) cao thì cứ dùng `LongAdder` thay cho `AtomicLong`**. **Tên method hơi khác**: gọi **`increment`** để tăng bộ đếm hoặc **`add`** để cộng một lượng, và **`sum`** để lấy tổng.

> **Note (sách):** *"Of course, the increment method does not return the old value. Doing that would undo the efficiency gain of splitting the sum into multiple summands."*
>
> **Dịch:** Dĩ nhiên `increment` **không trả về giá trị cũ**. Làm vậy sẽ **triệt tiêu lợi ích hiệu năng của việc chia tổng thành nhiều số hạng**.

> *"The LongAccumulator generalizes this idea to an arbitrary accumulation operation. In the constructor, you provide the operation, as well as its neutral element. To incorporate new values, call accumulate. Call get to obtain the current value. The following has the same effect as a LongAdder:"*

```java
final var adder = new LongAccumulator(Long::sum, 0);
// in some thread. . .
adder.accumulate(value);
```

**Dịch:** **`LongAccumulator` tổng quát hoá ý tưởng này cho một thao tác tích luỹ bất kỳ.** Trong constructor, bạn **cung cấp thao tác cùng phần tử trung hoà (neutral element) của nó**. Để **đưa giá trị mới vào, gọi `accumulate`**. Gọi **`get` để lấy giá trị hiện tại**.

> *"Internally, the accumulator has variables a1, a2, . . ., an. Each variable is initialized with the neutral element (0 in our example). When accumulate is called with value v, then one of them is atomically updated as ai = ai op v, where op is the accumulation operation written in infix form. In our example, a call to accumulate computes ai = ai + v for some i. The result of get is a1 op a2 op . . . op an. In our example, that is the sum of the accumulators, a1 + a2 + . . . + an."*

**Dịch:** Bên trong, accumulator có các biến **a₁, a₂, …, aₙ**. Mỗi biến **được khởi tạo bằng phần tử trung hoà** (0 trong ví dụ). Khi `accumulate` được gọi với giá trị **v**, thì **một trong số chúng được cập nhật atomic thành aᵢ = aᵢ op v**, với **op là thao tác tích luỹ viết dạng trung tố**. Kết quả của `get` là **a₁ op a₂ op … op aₙ**.

> *"To compute maximum or minimum, use Math.max or Math.min for the operation. In general, the operation must be associative and commutative. That means that the final result must be independent of the order in which the intermediate values were combined. There are also DoubleAdder and DoubleAccumulator that work in the same way, except with double values."*

**Dịch:** Để tính **max hoặc min, dùng `Math.max` hoặc `Math.min` làm thao tác**. Nói chung, **thao tác phải có tính kết hợp (associative) và giao hoán (commutative)** — nghĩa là **kết quả cuối phải độc lập với thứ tự kết hợp các giá trị trung gian**. Cũng có **`DoubleAdder` và `DoubleAccumulator`** hoạt động tương tự nhưng **với giá trị `double`**.

---

## 10.5.12. On-Demand Initialization

> *"Sometimes, you have a data structure that you only want to initialize when it is first needed. And you want to ensure that initialization happens exactly once. Instead of designing your own mechanism, make use of the fact that the virtual machine executes a static initializer exactly once when the class is first used. The virtual machine ensures this with a lock, so you don't have to program your own."*

```java
public class OnDemandData
{
    // private constructor to ensure only one object is constructed
    private OnDemandData()
    {
        . . .
    }

    public static OnDemandData getInstance()
    {
        return Holder.INSTANCE;
    }

    // only initialized on first use, i.e. in the first call to getInstance
    private static class Holder
    {
        // VM guarantees that this happens lazily and at most once
        static final OnDemandData INSTANCE = new OnDemandData();
    }
}
```

**Dịch:** Đôi khi bạn có một cấu trúc dữ liệu **chỉ muốn khởi tạo khi cần lần đầu**, và muốn **đảm bảo việc khởi tạo xảy ra đúng một lần**. Thay vì tự thiết kế cơ chế riêng, hãy **tận dụng việc virtual machine thực thi một [[06 - Object Construction|static initializer]] đúng một lần khi class được dùng lần đầu**. **Virtual machine đảm bảo điều đó bằng một lock**, nên **bạn không phải tự lập trình**.

> **Caution (sách):** *"To use this idiom, you must ensure that the constructor doesn't throw any exceptions. The virtual machine will not make a second attempt to initialize the holder class."*
>
> **Dịch:** Để dùng idiom này, bạn phải **đảm bảo constructor không ném exception nào**. **Virtual machine sẽ không thử khởi tạo class holder lần thứ hai.**

---

## 10.5.13. Safe Publication

> *"As you saw in Section 10.5.10, the final fields of a properly constructed object will be seen by all threads with their initialized values. What about the non-final fields? The Java language makes no guarantee in general. For example, consider:"*

```java
public class BankAccount
{
    private double balance;
    public BankAccount(double initialBalance) { balance = initialBalance; }
    public double getBalance() { return balance; }
    . . .
}
```

> *"If you construct a new BankAccount(1000) object in one thread, and another thread has a reference to the object, it might see getBalance() return zero."*

**Dịch:** Như đã thấy ở Section 10.5.10, các field `final` của một object dựng đúng cách **sẽ được mọi thread thấy với giá trị đã khởi tạo**. Còn **field không phải `final` thì sao? Ngôn ngữ Java nói chung không đảm bảo gì cả.** Nếu bạn dựng object `new BankAccount(1000)` ở một thread và **thread khác có reference tới object đó, nó có thể thấy `getBalance()` trả về 0**.

> *"Of course, a mutable BankAccount class should have thread-safe methods getBalance, deposit, withdraw that protect the balance field with a lock. Then getBalance will report the correct balance."*

**Dịch:** Dĩ nhiên, một class `BankAccount` mutable **nên có các method thread-safe `getBalance`, `deposit`, `withdraw` bảo vệ field `balance` bằng lock**. Khi đó `getBalance` **sẽ báo đúng số dư**.

> *"Now consider the hopefully uncommon case where you share an object that is neither thread-safe nor immutable. Then you need to ensure that the object is safely published—that is, all fields are visible with the values that were set in the constructor. This is ensured when the object reference is stored:"*

**Dịch:** Giờ xét trường hợp **hy vọng là hiếm gặp**, khi bạn **chia sẻ một object vừa không thread-safe vừa không [[11 - Class Design Hints|immutable]]**. Khi đó bạn phải đảm bảo object **được publish an toàn (safely published)** — nghĩa là **mọi field đều nhìn thấy được với giá trị đã set trong constructor**. Điều này được đảm bảo khi **reference của object được lưu**:

| Vị trí lưu reference (dịch từ sách) |
|---|
| Trong một **static initializer** (như ở phần trước). |
| Trong một **field `volatile` hoặc `AtomicReference`**. |
| Trong **field bất kỳ khi phép gán được một lock bảo vệ**. |
| Trong một **field `final` của một object được dựng đúng cách**. |

> *"The third condition is fulfilled when a Runnable or Callable is an inner class or lambda expression that captures a variable from the enclosing scope. The captured variable is stored in a final field of the inner class."*

**Dịch:** **Điều kiện thứ ba được thoả** khi một `Runnable` hoặc `Callable` là **[[03 - Inner Classes|inner class]] hoặc lambda expression capture một biến từ enclosing scope**. **Biến được capture được lưu trong một field `final` của inner class.**

> *"The last condition is fulfilled when you store the object reference in a thread-safe data structure, for example a BlockingQueue or ConcurrentHashMap. The retrieving thread will see the object in its published state."*

**Dịch:** **Điều kiện cuối được thoả** khi bạn **lưu reference của object trong một cấu trúc dữ liệu thread-safe**, ví dụ **`BlockingQueue` hoặc `ConcurrentHashMap`**. **Thread lấy ra sẽ thấy object ở trạng thái đã publish của nó.**

> *"As you can see, in most reasonable circumstances, nothing evil will happen. If you find yourself in a situation where these details matter, you are on thin ice and may want to rethink your sharing strategy."*

**Dịch:** Như bạn thấy, **trong hầu hết hoàn cảnh hợp lý thì chẳng có gì xấu xảy ra**. Nếu bạn thấy mình **rơi vào tình huống mà các chi tiết này thành quan trọng, bạn đang đứng trên băng mỏng** và có lẽ **nên nghĩ lại chiến lược chia sẻ của mình**.

---

## 10.5.14. Sharing with Thread-Local Variables

> *"In the preceding sections, we discussed the risks of sharing variables between threads. Sometimes, you can avoid sharing by giving each thread its own instance, using the thread-local variables (see Section 10.4.4). For example, the SimpleDateFormat class is not thread-safe. Suppose we have a static variable"*

```java
public static final SimpleDateFormat DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd");
```

> *"If two threads execute an operation such as"*

```java
String DATEFORMAT = dateFormat.format(new Date());
```

> *"then the result can be garbage since the internal data structures used by the dateFormat can be corrupted by concurrent access. You could use synchronization, which is expensive, or you could construct a local SimpleDateFormat object whenever you need it, but that is also wasteful."*

**Dịch:** Đôi khi bạn **tránh được việc chia sẻ bằng cách cho mỗi thread một instance riêng**, dùng [[04 - Coordinating Tasks#10.4.4. Thread-Local Variables|thread-local variable]]. Ví dụ, class **`SimpleDateFormat` không thread-safe**. Nếu hai thread cùng thực hiện thao tác format, **kết quả có thể là rác** vì **cấu trúc dữ liệu nội bộ mà `dateFormat` dùng có thể bị hỏng do truy cập concurrent**. Bạn có thể **dùng synchronization (đắt đỏ)**, hoặc **dựng một object `SimpleDateFormat` cục bộ mỗi khi cần (cũng lãng phí)**.

> *"To construct one instance per thread, use the following code:"*

```java
public static final ThreadLocal<SimpleDateFormat> DATEFORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
```

> *"To access the actual formatter, call"*

```java
String dateStamp = DATEFORMAT.get().format(new Date());
```

> *"The first time you call get in a given thread, the lambda in the constructor is called. From then on, the get method returns the instance belonging to the current thread."*

**Dịch:** Để **dựng một instance cho mỗi thread**, dùng code trên. **Lần đầu bạn gọi `get` trong một thread, lambda trong constructor được gọi.** Từ đó về sau, **`get` trả về instance thuộc về thread hiện tại**.

> **Preview Note (sách):** *"As pointed out in Section 10.4.4, thread-local variables may not be appropriate for large numbers of virtual threads. Extent locals, a preview feature in Java 21, provide a more performant alternative."*
>
> **Dịch:** Như đã chỉ ra ở Section 10.4.4, **thread-local variable có thể không phù hợp khi có số lượng lớn virtual thread**. **Extent local**, một tính năng preview trong **Java 21**, cung cấp **lựa chọn thay thế hiệu năng tốt hơn**.

> *"A related problem is the generation of random numbers in multiple threads. The java.util.Random class is thread-safe. However, the computation that yields a new random value and updates the state of the generator can be inefficient if multiple threads use a single shared generator."*

**Dịch:** Một vấn đề liên quan là **sinh số ngẫu nhiên ở nhiều thread**. Class **`java.util.Random` là thread-safe**. Tuy nhiên, **phép tính sinh giá trị ngẫu nhiên mới và cập nhật state của generator có thể kém hiệu quả nếu nhiều thread dùng chung một generator**.

> *"You could use the ThreadLocal helper to give each thread a separate generator. But there is a convenience class that is optimized for this situation:"*

```java
int random = ThreadLocalRandom.current().nextInt(upperBound);
```

> *"The call ThreadLocalRandom.current() returns a random number generator with a per-thread state. In its current implementation, it stores the generator state in instance variables of the Thread object."*

**Dịch:** Bạn **dùng được helper `ThreadLocal` để cho mỗi thread một generator riêng**. Nhưng có một **class tiện lợi được tối ưu cho tình huống này**. Lời gọi `ThreadLocalRandom.current()` **trả về một random number generator có state riêng cho từng thread**. Trong implementation hiện tại, nó **lưu state của generator trong instance variable của object `Thread`**.

## API — `java.lang.ThreadLocal<T>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier)` (8) | tạo một **thread-local variable mà giá trị ban đầu được sinh ra bằng cách gọi supplier cho trước**. |

## API — `java.util.concurrent.ThreadLocalRandom` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static ThreadLocalRandom current()` | trả về một **random generator class mà state là cục bộ với thread hiện tại**. |

---

## Bài kế tiếp

→ [[06 - Thread-Safe Collections]] — blocking queue, các collection concurrent, `ConcurrentHashMap`, copy-on-write array, parallel array algorithm và các wrapper đồng bộ hoá cũ.
