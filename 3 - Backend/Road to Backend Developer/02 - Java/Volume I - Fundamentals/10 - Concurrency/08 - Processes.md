# 08 — Processes

> Chapter 10, Section 10.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.8. Processes

> *"Up to now, you have seen how to execute Java code in separate threads within the same program. Sometimes, you need to execute another program. For this, use the ProcessBuilder and Process classes. The Process class executes a command in a separate operating system process and lets you interact with its standard input, output, and error streams. The ProcessBuilder class lets you configure a Process object."*

**Dịch:** Cho tới giờ, bạn đã thấy cách **chạy code Java trong các thread riêng bên trong cùng một chương trình**. Đôi khi bạn cần **chạy một chương trình khác** — dùng class **`ProcessBuilder` và `Process`**. Class **`Process` chạy một lệnh trong một process riêng của hệ điều hành** và cho phép bạn **tương tác với standard input, output, và error stream của nó**. Class **`ProcessBuilder` cho phép bạn cấu hình một object `Process`**.

> **Note (sách):** *"The ProcessBuilder class is a more flexible replacement for the Runtime.exec calls."*
>
> **Dịch:** Class `ProcessBuilder` là **bản thay thế linh hoạt hơn cho các lời gọi `Runtime.exec`**.

---

## 10.8.1. Building a Process

> *"Start by specifying the command that you want to execute. You can supply a List<String> or simply the strings that make up the command."*

```java
var builder = new ProcessBuilder("gcc", "myapp.c");
```

**Dịch:** Bắt đầu bằng việc **nêu rõ lệnh bạn muốn chạy**. Bạn **cung cấp được một `List<String>` hoặc đơn giản là các [[05 - Strings|string]] tạo nên lệnh đó**.

> **Caution (sách):** *"The first string must be an executable command, not a shell builtin. For example, to run the dir command in Windows, you need to build a process with strings "cmd.exe", "/C", and "dir"."*
>
> **Dịch:** **String đầu tiên phải là một lệnh thực thi được, không phải một shell builtin.** Ví dụ, để chạy lệnh `dir` trên Windows, bạn phải **dựng process với các string `"cmd.exe"`, `"/C"`, và `"dir"`**.

### Thư mục làm việc

> *"Each process has a working directory, which is used to resolve relative directory names. By default, a process has the same working directory as the virtual machine, which is typically the directory from which you launched the java program. You can change it with the directory method:"*

```java
builder = builder.directory(path.toFile());
```

**Dịch:** Mỗi process có một **working directory**, dùng để **phân giải các tên thư mục tương đối**. Mặc định, process **có cùng working directory với virtual machine**, thường là **thư mục nơi bạn khởi chạy chương trình `java`**. Bạn **đổi nó bằng method `directory`**.

> **Note (sách):** *"Each of the methods for configuring a ProcessBuilder returns itself, so that you can chain commands. Ultimately, you will call"*
>
> ```java
> Process p = new ProcessBuilder(command).directory(file).…start();
> ```
>
> **Dịch:** Mỗi method cấu hình `ProcessBuilder` **trả về chính nó**, để bạn **nối chuỗi lệnh (chain) được**. Rốt cuộc bạn sẽ gọi như trên.

### Standard input, output, error

> *"Next, you will want to specify what should happen to the standard input, output, and error streams of the process. By default, each of them is a pipe that you can access with"*

```java
OutputStream processIn = p.getOutputStream();
InputStream processOut = p.getInputStream();
InputStream processErr = p.getErrorStream();
```

> *"or, for text input and output"*

```java
BufferedWriter processIn = p.outputWriter();
BufferedReader processOut = p.inputReader();
BufferedReader processErr = p.errorReader();
```

**Dịch:** Tiếp theo, bạn sẽ muốn **nêu rõ điều gì xảy ra với standard input, output, và error stream của process**. Mặc định, **mỗi cái là một pipe** mà bạn truy cập được như trên, hoặc **cho input/output dạng text** thì dùng reader/writer.

> *"Note that the input stream of the process is an output stream in the JVM! You write to that stream, and whatever you write becomes the input of the process. Conversely, you read what the process writes to the output and error streams. For you, they are input streams. The same holds for readers and writers."*

**Dịch:** Lưu ý **input stream của process lại là output stream trong JVM!** Bạn **ghi vào stream đó, và những gì bạn ghi trở thành input của process**. Ngược lại, bạn **đọc những gì process ghi ra output và error stream** — **với bạn, chúng là input stream**. **Điều tương tự áp dụng cho reader và writer.**

> *"You can specify that the input, output, and error streams of the new process should be the same as the JVM. If the user runs the JVM in a console, any user input is forwarded to the process, and the process output shows up in the console. Call"*

```java
builder.inheritIO();
```

> *"to make this setting for all three streams. If you only want to inherit some of the streams, pass the value"*

```java
ProcessBuilder.Redirect.INHERIT
```

> *"to the redirectInput, redirectOutput, or redirectError methods. For example,"*

```java
builder.redirectOutput(ProcessBuilder.Redirect.INHERIT);
```

**Dịch:** Bạn **chỉ định được rằng input, output, error stream của process mới giống hệt của JVM**. Nếu người dùng chạy JVM trong console, **mọi input của người dùng được chuyển tiếp tới process, và output của process hiện ra ở console**. Gọi `inheritIO()` để **đặt thiết lập này cho cả ba stream**. Nếu **chỉ muốn kế thừa một số stream**, hãy **truyền giá trị `ProcessBuilder.Redirect.INHERIT` cho `redirectInput`, `redirectOutput`, hoặc `redirectError`**.

> *"You can redirect the process streams to files by supplying File objects:"*

```java
builder.redirectInput(inputFile)
    .redirectOutput(outputFile)
    .redirectError(errorFile);
```

> *"The files for output and error are created or truncated when the process starts. To append to existing files, use"*

```java
builder.redirectOutput(ProcessBuilder.Redirect.appendTo(outputFile));
```

**Dịch:** Bạn **chuyển hướng (redirect) các stream của process vào file** bằng cách **cung cấp object `File`**. **File cho output và error được tạo mới hoặc bị cắt cụt (truncate) khi process start.** Để **nối thêm vào file có sẵn**, dùng `Redirect.appendTo`.

> *"It is often useful to merge the output and error streams, so you can see the outputs and error messages in the sequence in which the process generates them. Call"*

```java
builder.redirectErrorStream(true);
```

> *"to activate the merging. If you do that, you can no longer call redirectError on the ProcessBuilder or getErrorStream on the Process."*

**Dịch:** Thường thì **gộp output và error stream lại là hữu ích**, để bạn **thấy output và thông báo lỗi theo đúng thứ tự process sinh ra chúng**. Nếu làm vậy, bạn **không còn gọi được `redirectError` trên `ProcessBuilder` hay `getErrorStream` trên `Process`** nữa.

### Biến môi trường

> *"You may also want to modify the environment variables of the process. Here, the builder chain syntax breaks down. You need to get the builder's environment (which is initialized by the environment variables of the process running the JVM), then put or remove entries."*

```java
Map<String, String> env = builder.environment();
env.put("LANG", "fr_FR");
env.remove("JAVA_HOME");
Process p = builder.start();
```

**Dịch:** Bạn cũng có thể muốn **sửa biến môi trường của process**. Ở đây **cú pháp chain của builder bị đứt đoạn**: bạn phải **lấy environment của builder** (được khởi tạo từ **biến môi trường của process đang chạy JVM**), rồi **`put` hoặc `remove` các entry**.

### Pipeline

> *"If you want to pipe the output of one process into the input of another (as with the | operator in a shell), use the startPipeline method. Pass a list of process builders and read the result from the last process. Here is an example, enumerating the unique extensions in a directory tree:"*

```java
List<Process> processes = ProcessBuilder.startPipeline(List.of(
    new ProcessBuilder("find", "/opt/jdk-21"),
    new ProcessBuilder("grep", "-o", "\\.[^./]*$"),
    new ProcessBuilder("sort"),
    new ProcessBuilder("uniq")
));
Process last = processes.getLast();
var result = new String(last.getInputStream().readAllBytes());
```

**Dịch:** Nếu bạn muốn **nối output của process này vào input của process khác** (như toán tử `|` trong shell), hãy dùng **`startPipeline`**. **Truyền một list các process builder và đọc kết quả từ process cuối cùng.**

> *"Of course, this particular task would be more efficiently solved by making the directory walk in Java instead of running four processes. Chapter 2 of Volume II will show you how to do that."*

**Dịch:** Dĩ nhiên, **riêng tác vụ này sẽ được giải hiệu quả hơn bằng cách duyệt thư mục trong Java thay vì chạy bốn process**.

---

## 10.8.2. Running a Process

> *"After you have configured the builder, invoke its start method to start the process. If you configured the input, output, and error streams as pipes, you can now write to the input stream and read the output and error streams. For example,"*

```java
Process process = new ProcessBuilder("/bin/ls", "-l")
    .directory(Path.of("/tmp").toFile())
    .start();
try (var in = new Scanner(process.getInputStream()))
{
    while (in.hasNextLine())
        System.out.println(in.nextLine());
}
```

**Dịch:** Sau khi cấu hình xong builder, **gọi method `start` của nó để khởi động process**. Nếu bạn **cấu hình input, output, error stream dưới dạng pipe**, giờ bạn **ghi vào input stream và đọc output cùng error stream được**.

> **Caution (sách):** *"There is limited buffer space for the process streams. You should not flood the input, and you should read the output promptly. If there is a lot of input and output, you may need to produce and consume it in separate threads."*
>
> **Dịch:** **Không gian buffer cho các stream của process là có hạn.** Bạn **không nên làm ngập input**, và **nên đọc output kịp thời**. Nếu **có nhiều input và output**, bạn **có thể phải sản xuất và tiêu thụ chúng ở các thread riêng**.

### Chờ process kết thúc

> *"To wait for the process to finish, call"*

```java
int result = process.waitFor();
```

> *"or, if you don't want to wait indefinitely,"*

```java
long delay = . . .;
if (process.waitFor(delay, TimeUnit.SECONDS))
{
    int result = process.exitValue();
    . . .
}
else
{
    process.destroyForcibly();
}
```

> *"The first call to waitFor returns the exit value of the process (by convention, 0 for success or a nonzero error code). The second call returns true if the process didn't time out. Then you need to retrieve the exit value by calling the exitValue method."*

**Dịch:** Để **chờ process kết thúc, gọi `waitFor`**, hoặc **nếu không muốn chờ vô hạn** thì dùng bản có timeout. Lời gọi `waitFor` thứ nhất **trả về exit value của process** (theo quy ước, **0 là thành công, khác 0 là mã lỗi**). Lời gọi thứ hai **trả về `true` nếu process không bị quá hạn** — khi đó bạn phải **lấy exit value bằng cách gọi `exitValue`**.

> *"Instead of waiting for the process to finish, you can just leave it running and occasionally call isAlive to see whether it is still alive. To kill the process, call destroy or destroyForcibly. The difference between these calls is platform-dependent. On UNIX, the former terminates the process with SIGTERM, the latter with SIGKILL. (The supportsNormalTermination method returns true if the destroy method can terminate the process normally.)"*

**Dịch:** Thay vì chờ process kết thúc, bạn **cứ để nó chạy và thỉnh thoảng gọi `isAlive` để xem nó còn sống không**. Để **giết process, gọi `destroy` hoặc `destroyForcibly`**. **Khác biệt giữa hai lời gọi này phụ thuộc nền tảng**: trên **UNIX, cái trước kết thúc process bằng `SIGTERM`, cái sau bằng `SIGKILL`**. (**`supportsNormalTermination` trả về `true` nếu `destroy` kết thúc process bình thường được.**)

> *"Finally, you can receive an asynchronous notification when the process has completed. The call process.onExit() yields a CompletableFuture<Process> that you can use to schedule any action."*

```java
process.onExit().thenAccept(
    p -> System.out.println("Exit value: " + p.exitValue()));
```

**Dịch:** Cuối cùng, bạn **nhận được thông báo bất đồng bộ khi process hoàn tất**. Lời gọi `process.onExit()` **cho ra một [[07 - Asynchronous Computations#10.7.1. Completable Futures|`CompletableFuture<Process>`]]** mà bạn **dùng để lên lịch bất kỳ hành động nào**.

> **Note (sách):** *"Since Java 21, the logger with name java.lang.ProcessBuilder logs processes executed by Runtime.exec and ProcessBuilder at the logging levels DEBUG and TRACE. The command arguments are only included at the TRACE level. Both levels log the process id, directory, command, and stack trace."*
>
> **Dịch:** Từ **Java 21**, [[05 - Logging|logger]] tên **`java.lang.ProcessBuilder`** ghi log các process được `Runtime.exec` và `ProcessBuilder` chạy ở **mức `DEBUG` và `TRACE`**. **Argument của lệnh chỉ được đưa vào ở mức `TRACE`.** **Cả hai mức đều log process id, thư mục, lệnh, và stack trace.**

---

## 10.8.3. Process Handles

> *"To get more information about a process that your program started, or any other process that is currently running on your machine, use the ProcessHandle interface. You can obtain a ProcessHandle in four ways:"*

**Dịch:** Để **lấy thêm thông tin về một process mà chương trình bạn đã khởi động, hoặc bất kỳ process nào khác đang chạy trên máy**, hãy dùng interface **`ProcessHandle`**. Bạn lấy được một `ProcessHandle` theo **bốn cách**:

| # | Cách (dịch từ sách) |
|---|---|
| 1 | Với một object `Process` là `p`, **`p.toHandle()` cho ra `ProcessHandle` của nó**. |
| 2 | Với một **operating system process ID kiểu `long`**, **`ProcessHandle.of(id)` cho ra handle của process đó**. |
| 3 | **`ProcessHandle.current()` là handle của process đang chạy Java virtual machine này.** |
| 4 | **`ProcessHandle.allProcesses()` cho ra một `Stream<ProcessHandle>` gồm mọi process của hệ điều hành mà process hiện tại thấy được.** |

> *"Given a process handle, you can get its process ID, its parent process, its children, and its descendants:"*

```java
long pid = handle.pid();
Optional<ProcessHandle> parent = handle.parent();
Stream<ProcessHandle> children = handle.children();
Stream<ProcessHandle> descendants = handle.descendants();
```

**Dịch:** Với một process handle, bạn lấy được **process ID, process cha, các process con, và các process hậu duệ** của nó.

> **Note (sách):** *"The Stream<ProcessHandle> instances that are returned by the allProcesses, children, and descendants methods are just snapshots in time. Any of the processes in the stream might be terminated by the time you get around to seeing them, and other processes may have started that are not in the stream."*
>
> **Dịch:** Các instance `Stream<ProcessHandle>` mà `allProcesses`, `children`, `descendants` trả về **chỉ là ảnh chụp tại một thời điểm**. **Bất kỳ process nào trong stream đều có thể đã kết thúc vào lúc bạn kịp nhìn tới nó**, và **các process khác có thể đã start mà không có trong stream**.

> *"The info method yields a ProcessHandle.Info object with methods for obtaining information about the process."*

```java
Optional<String[]> arguments()
Optional<String> command()
Optional<String> commandLine()
Optional<Instant> startInstant()
Optional<Duration> totalCpuDuration()
Optional<String> user()
```

> *"All of these methods return Optional values since it is possible that a particular operating system may not be able to report the information."*

**Dịch:** Method **`info` cho ra một object `ProcessHandle.Info`** với các method **lấy thông tin về process**. **Mọi method này trả về giá trị `Optional`** vì **có thể một hệ điều hành cụ thể không báo được thông tin đó**.

> *"For monitoring or forcing process termination, the ProcessHandle interface has the same isAlive, supportsNormalTermination, destroy, destroyForcibly, and onExit methods as the Process class. However, there is no equivalent to the waitFor method."*

**Dịch:** Để **theo dõi hoặc ép kết thúc process**, interface `ProcessHandle` **có cùng các method `isAlive`, `supportsNormalTermination`, `destroy`, `destroyForcibly`, `onExit` như class `Process`**. Tuy nhiên, **không có method nào tương đương `waitFor`**.

> *"Listing 10.12 shows how to start a process and read its output, and how to list all Java processes."*

**Dịch:** Listing 10.12 cho thấy cách **start một process và đọc output của nó**, cùng cách **liệt kê mọi process Java**.

### Listing 10.12 — `process/ProcessDemo.java`

```java
package process;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Scanner;

/**
 * This program demonstrates running a process and reading its output, and listing all Java
 * processes
 * @version 1.1 2023-10-11
 * @author Cay Horstmann
 */
public class ProcessDemo
{
    public static void main(String[] args) throws IOException, InterruptedException
    {
        Process p = new ProcessBuilder("/bin/ls", "-l")
            .directory(Path.of("/tmp").toFile())
            .start();
        try (var in = new Scanner(p.getInputStream()))
        {
            while (in.hasNextLine())
                System.out.println(in.nextLine());
        }
        System.out.println("pid: " + p.toHandle().pid());
        int result = p.waitFor();
        System.out.println("Exit value: " + result);

        ProcessHandle.allProcesses()
            .map(ProcessHandle::info)
            .filter(info -> info.command().filter(s -> s.contains("java")).isPresent())
            .forEach(info -> info.commandLine().ifPresent(System.out::println));
    }
}
```

## API — `java.lang.ProcessBuilder` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ProcessBuilder(String... command)`<br>`ProcessBuilder(List<String> command)` | dựng một process builder với **lệnh và argument cho trước**. |
| `ProcessBuilder directory(File directory)` | set **working directory cho process**. |
| `ProcessBuilder inheritIO()` (9) | khiến process **dùng standard input, output, error của virtual machine**. |
| `ProcessBuilder redirectErrorStream(boolean redirectErrorStream)` | Nếu `redirectErrorStream` là `true` thì **standard error của process được gộp vào standard output**. |
| `ProcessBuilder redirectInput(File file)` (7)<br>`ProcessBuilder redirectOutput(File file)` (7)<br>`ProcessBuilder redirectError(File file)` (7) | **chuyển hướng standard input, output, hoặc error của process vào file cho trước**. |
| `ProcessBuilder redirectInput(ProcessBuilder.Redirect source)` (7)<br>`ProcessBuilder redirectOutput(ProcessBuilder.Redirect destination)` (7)<br>`ProcessBuilder redirectError(ProcessBuilder.Redirect destination)` (7) | chuyển hướng standard input, output, hoặc error của process, trong đó `destination` là một trong: **`Redirect.PIPE`** (hành vi mặc định, truy cập qua object `Process`), **`Redirect.INHERIT`** (stream từ virtual machine), **`Redirect.DISCARD`**, **`Redirect.from(file)`**, **`Redirect.to(file)`**, **`Redirect.appendTo(file)`**. |
| `Map<String, String> environment()` | cho ra một **map mutable để set biến môi trường cho process**. |
| `Process start()` | **start process và cho ra object `Process` của nó**. |
| `static List<Process> startPipeline(List<ProcessBuilder> builders)` (9) | **start một pipeline các process**, **nối standard output của mỗi process vào standard input của process kế tiếp**. |

## API — `java.lang.Process` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `abstract OutputStream getOutputStream()` | lấy một stream để **ghi vào input stream của process**. |
| `abstract InputStream getInputStream()`<br>`abstract InputStream getErrorStream()` | lấy một input stream để **đọc output stream hoặc error stream của process**. |
| `abstract int waitFor()` | **chờ process kết thúc và cho ra exit value**. |
| `boolean waitFor(long timeout, TimeUnit unit)` (8) | chờ process kết thúc, **nhưng không lâu hơn thời gian chờ cho trước**. **Trả về `true` nếu process đã thoát.** |
| `abstract int exitValue()` | trả về **exit value của process**. Theo quy ước, **exit value khác 0 báo hiệu một lỗi**. |
| `boolean isAlive()` (8) | kiểm tra xem **process này còn sống không**. |
| `abstract void destroy()`<br>`Process destroyForcibly()` (8) | **kết thúc process này, bình thường hoặc cưỡng bức**. |
| `boolean supportsNormalTermination()` (9) | kiểm tra xem process này **kết thúc bình thường được hay phải huỷ cưỡng bức**. |
| `ProcessHandle toHandle()` (9) | cho ra **`ProcessHandle` mô tả process này**. |
| `CompletableFuture<Process> onExit()` (9) | cho ra một **`CompletableFuture` được thực thi khi process này thoát**. |

## API — `java.lang.ProcessHandle` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Optional<ProcessHandle> of(long pid)`<br>`static Stream<ProcessHandle> allProcesses()`<br>`static ProcessHandle current()` | cho ra **process handle của process có PID cho trước**, **của mọi process**, hoặc **của process chạy virtual machine**. |
| `Stream<ProcessHandle> children()`<br>`Stream<ProcessHandle> descendants()` | cho ra **process handle của các process con hoặc hậu duệ** của process này. |
| `long pid()` | cho ra **PID của process này**. |
| `ProcessHandle.Info info()` | cho ra **thông tin chi tiết về process này**. |

## API — `java.lang.ProcessHandle.Info` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Optional<String[]> arguments()`<br>`Optional<String> command()`<br>`Optional<String> commandLine()`<br>`Optional<Instant> startInstant()`<br>`Optional<Duration> totalCpuDuration()`<br>`Optional<String> user()` | cho ra **thông tin chi tiết tương ứng nếu có sẵn**. |

---

## Chương kế tiếp

→ [[01 - Using Annotations]] — annotation là các tag chèn vào mã nguồn để công cụ xử lý; chúng không làm thay đổi cách chương trình được biên dịch.
