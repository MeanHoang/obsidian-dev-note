# 06 — File Locking

> Chapter 2, Section 2.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.6. File Locking

> *"When multiple simultaneously executing programs need to modify the same file, they need to communicate in some way, or the file can easily become damaged. File locks can solve this problem. A file lock controls access to a file or a range of bytes within a file."*

**Dịch:** Khi **nhiều chương trình chạy đồng thời cần sửa cùng một file**, chúng **phải giao tiếp với nhau bằng cách nào đó**, nếu không **file rất dễ hỏng**. **File lock** giải quyết vấn đề này: file lock **kiểm soát việc truy cập vào một file hoặc một dải byte bên trong file**.

> *"Suppose your application saves a configuration file with user preferences. If a user invokes two instances of the application, it could happen that both of them want to write the configuration file at the same time. In that situation, the first instance should lock the file. When the second instance finds the file locked, it can decide to wait until the file is unlocked or simply skip the writing process."*

**Dịch:** Giả sử ứng dụng lưu một **file cấu hình chứa preference của user**. Nếu user **chạy hai instance** của ứng dụng, có thể **cả hai đều muốn ghi file cấu hình cùng lúc**. Khi đó **instance thứ nhất nên khoá file**. Instance thứ hai thấy file bị khoá thì **quyết định chờ tới khi file được mở khoá, hoặc đơn giản là bỏ qua việc ghi**.

### lock và tryLock

> *"To lock a file, call either the lock or tryLock methods of the FileChannel class."*

```java
FileChannel = FileChannel.open(path);
FileLock lock = channel.lock();
```

> *"or"*

```java
FileLock lock = channel.tryLock();
```

> *"The first call blocks until the lock becomes available. The second call returns immediately, either with the lock or with null if the lock is not available. The file remains locked until the channel is closed or the release method is invoked on the lock."*

**Dịch:** Để khoá một file, gọi method **`lock`** hoặc **`tryLock`** của class **`FileChannel`**. Lời gọi thứ nhất **block cho tới khi lock khả dụng**. Lời gọi thứ hai **trả về ngay lập tức**, hoặc **kèm lock**, hoặc **kèm `null` nếu lock không khả dụng**. **File vẫn bị khoá cho tới khi channel được đóng** hoặc **method `release` được gọi lên lock**.

### Khoá một phần file

> *"You can also lock a portion of the file with the call"*

```java
FileLock lock(long start, long size, boolean shared)
```

> *"or"*

```java
FileLock tryLock(long start, long size, boolean shared)
```

> *"The shared flag is false to lock the file for both reading and writing. It is true for a shared lock, which allows multiple processes to read from the file, while preventing any process from acquiring an exclusive lock. Not all operating systems support shared locks. You may get an exclusive lock even if you just asked for a shared one. Call the isShared method of the FileLock class to find out which kind you have."*

**Dịch:** Cũng **khoá được một phần của file**. Flag **`shared` là `false`** để khoá file **cho cả đọc lẫn ghi**; **`true`** cho **shared lock**, vốn cho phép **nhiều process đọc từ file** trong khi **ngăn mọi process giành được exclusive lock**. **Không phải hệ điều hành nào cũng hỗ trợ shared lock** — bạn **có thể nhận được exclusive lock ngay cả khi chỉ xin shared lock**. Gọi method **`isShared`** của class `FileLock` để biết mình đang có loại nào.

> **Note (sách):** *"If you lock the tail portion of a file and the file subsequently grows beyond the locked portion, the additional area is not locked. To lock all bytes, use a size of Long.MAX_VALUE."*
>
> **Dịch:** Nếu bạn **khoá phần đuôi của một file** rồi **file lớn thêm vượt quá phần bị khoá**, thì **vùng thêm vào KHÔNG bị khoá**. Muốn **khoá mọi byte**, dùng **`size` là `Long.MAX_VALUE`**.

> *"Be sure to unlock the lock when you are done. As always, this is best done with a try-with-resources statement:"*

```java
try (FileLock lock = channel.lock())
{
    access the locked file or segment
}
```

**Dịch:** **Nhớ mở khoá khi xong việc.** Như thường lệ, làm việc này tốt nhất bằng **câu lệnh try-with-resources** (xem [[02 - Catching Exceptions]]).

### Những điểm phụ thuộc hệ thống

> *"Keep in mind that file locking is system-dependent. Here are some points to watch for:"*
>
> - *"On some systems, file locking is merely advisory. If an application fails to get a lock, it may still write to a file that another application has currently locked."*
> - *"On some systems, you cannot simultaneously lock a file and map it into memory."*
> - *"File locks are held by the entire Java virtual machine. If two programs are launched by the same virtual machine (such as an applet or application launcher), they can’t each acquire a lock on the same file. The lock and tryLock methods will throw an OverlappingFileLockException if the virtual machine already holds another overlapping lock on the same file."*
> - *"On some systems, closing a channel releases all locks on the underlying file held by the Java virtual machine. You should therefore avoid multiple channels on the same locked file."*
> - *"Locking files on a networked file system is highly system-dependent and should probably be avoided."*

**Dịch:** Nhớ rằng **file locking phụ thuộc hệ thống**. Vài điểm cần đề phòng:

| # | Điểm cần đề phòng |
|---|---|
| 1 | Trên **một số hệ thống**, file locking **chỉ mang tính khuyến nghị (advisory)**. Nếu một ứng dụng **không lấy được lock**, nó **vẫn có thể ghi vào file mà ứng dụng khác đang khoá**. |
| 2 | Trên một số hệ thống, **không thể vừa khoá một file vừa map nó vào memory cùng lúc**. |
| 3 | **File lock được nắm giữ bởi cả Java virtual machine.** Nếu **hai chương trình được khởi chạy bởi cùng một virtual machine** (như applet hay application launcher) thì chúng **không thể mỗi bên giành một lock trên cùng file**. Method `lock` và `tryLock` sẽ **ném `OverlappingFileLockException`** nếu virtual machine **đã giữ một lock chồng lấn khác trên cùng file**. |
| 4 | Trên một số hệ thống, **đóng một channel sẽ giải phóng mọi lock** mà Java virtual machine đang giữ trên file bên dưới. Vì vậy **nên tránh dùng nhiều channel trên cùng một file đã khoá**. |
| 5 | **Khoá file trên networked file system phụ thuộc hệ thống rất nặng** và **có lẽ nên tránh**. |

## API — `java.nio.channels.FileChannel` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `FileLock lock()` | Giành **exclusive lock trên toàn bộ file**. Method này **block cho tới khi giành được lock**. |
| `FileLock tryLock()` | Giành exclusive lock trên toàn bộ file, hoặc **trả về `null` nếu không giành được lock**. |
| `FileLock lock(long position, long size, boolean shared)`<br>`FileLock tryLock(long position, long size, boolean shared)` | Giành **lock trên một vùng của file**. Method thứ nhất **block cho tới khi giành được lock**; method thứ hai **trả về `null` nếu không giành được**. Parameter **`shared` là `true` cho shared lock**, **`false` cho exclusive lock**. |

## API — `java.nio.channels.FileLock` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `void close()` *(1.7)* | **Giải phóng lock này.** |

---

## Bài kế tiếp

→ [[07 - Regular Expressions]] — cú pháp regular expression, khớp chuỗi, tách và thay thế.
