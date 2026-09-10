# 07 — Asynchronous Computations

> Chapter 10, Section 10.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.7. Asynchronous Computations

> *"So far, our approach to concurrent computation has been to break up a task, and then wait until all pieces have completed. Waiting works well with virtual threads, but with platform threads, a wait-free, or asynchronous, programming style provides higher throughput. The following sections are devoted to asynchronous computations."*

**Dịch:** Cho tới giờ, cách tiếp cận của ta với tính toán concurrent là **chia nhỏ một task rồi chờ cho tới khi mọi mảnh hoàn tất**. **Việc chờ hoạt động tốt với [[03 - Thread Properties#10.3.1. Virtual Threads|virtual thread]]**, nhưng với **platform thread**, một **phong cách lập trình không chờ (wait-free), hay bất đồng bộ (asynchronous), cho throughput cao hơn**.

---

## 10.7.1. Completable Futures

> *"When you have a Future object, you need to call get to obtain the value, blocking until the value is available. The CompletableFuture class implements the Future interface, and it provides a second mechanism for obtaining the result. You register a callback that will be invoked (in some thread) with the result once it is available."*

```java
CompletableFuture<String> f = . . .;
f.thenAccept(s -> Process the result string s);
```

> *"In this way, you can process the result without blocking once it is available."*

**Dịch:** Khi bạn có một object [[04 - Coordinating Tasks#10.4.1. Callables and Futures|`Future`]], bạn phải **gọi `get` để lấy giá trị, block cho tới khi giá trị sẵn sàng**. Class **`CompletableFuture` implement interface `Future`** và **cung cấp một cơ chế thứ hai để lấy kết quả**: bạn **đăng ký một callback sẽ được gọi (trong một thread nào đó) với kết quả ngay khi nó sẵn sàng**. Bằng cách này, bạn **xử lý được kết quả mà không phải block**.

> *"There are a few API methods that return CompletableFuture objects. For example, you can fetch a web page asynchronously with the HttpClient class that you will encounter in Chapter 4 of Volume II:"*

```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder(URI.create(urlString)).GET().build();
CompletableFuture<HttpResponse<String>> f = client.sendAsync(
    request, BodyHandlers.ofString());
```

**Dịch:** Có **một số method trong API trả về object `CompletableFuture`**. Ví dụ, bạn **tải một trang web bất đồng bộ bằng class `HttpClient`**.

> *"It is nice if there is a method that produces a ready-made CompletableFuture, but most of the time, you need to make your own. To run a task asynchronously and obtain a CompletableFuture, you don't submit it directly to an executor service. Instead, you call the static method CompletableFuture.supplyAsync. Here is how to read the web page without the benefit of the HttpClient class:"*

```java
public CompletableFuture<String> readPage(URI uri)
{
    return CompletableFuture.supplyAsync(() ->
    {
        try
        {
            return new String(uri.toURL().openStream().readAllBytes());
        }
        catch (IOException e)
        {
            throw new UncheckedIOException(e);
        }
    }, executor);
}
```

> *"If you omit the executor, the task is run on a default executor (namely the executor returned by ForkJoinPool.commonPool()). You usually don't want to do that."*

**Dịch:** Có sẵn method cho ra `CompletableFuture` thì tốt, nhưng **phần lớn thời gian bạn phải tự làm lấy**. Để **chạy một task bất đồng bộ và lấy về một `CompletableFuture`**, bạn **không submit nó thẳng vào một executor service** — thay vào đó, **gọi static method `CompletableFuture.supplyAsync`**. Nếu **bỏ qua executor thì task chạy trên một executor mặc định** (chính là executor mà **`ForkJoinPool.commonPool()`** trả về). **Thường thì bạn không muốn làm vậy.**

> **Caution (sách):** *"Note that the first parameter of the supplyAsync method is a Supplier<T>, not a Callable<T>. Both interfaces describe functions with no parameters and return type T, but a Supplier function cannot throw a checked exception. As you can see from the code above, that was not an inspired choice."*
>
> **Dịch:** Lưu ý parameter đầu tiên của `supplyAsync` là **`Supplier<T>`, không phải `Callable<T>`**. Cả hai [[01 - Interfaces|interface]] đều mô tả **function không có parameter và trả về kiểu `T`**, nhưng **function `Supplier` không ném được checked exception**. Như thấy ở code trên, **đó không phải một lựa chọn xuất sắc**.

### Hoàn tất với kết quả hoặc với exception

> *"A CompletableFuture can complete in two ways: either with a result, or with an uncaught exception. In order to handle both cases, use the whenComplete method. The supplied function is called with the result (or null if none) and the exception (or null if none)."*

```java
f.whenComplete((s, t) ->
{
    if (t == null)
    {
        Process the result s;
    }
    else
    {
        Process the Throwable t;
    }
});
```

**Dịch:** Một `CompletableFuture` **hoàn tất theo hai cách: hoặc với một kết quả, hoặc với một [[02 - Catching Exceptions|uncaught exception]]**. Để xử lý cả hai trường hợp, dùng **`whenComplete`**. Function được cung cấp **được gọi với kết quả (hoặc `null` nếu không có) và exception (hoặc `null` nếu không có)**.

> *"The CompletableFuture is called completable because one can set a completion value. (In other concurrency libraries, such an entity is called a promise, and the act of completion is called "fulfilling the promise".) As a consumer of the Future, you don't care how the value is set. That is the job of the producer of the promise. The supplyAsync method produces a CompletableFuture, and it sets the completion value when the task has finished. Other producers can use a more complex approach. For example, this example produces a future where two tasks work simultaneously on completing it:"*

```java
var f = new CompletableFuture<Integer>();
executor.execute(() ->
{
    int n = workHard(arg);
    f.complete(n);
});
executor.execute(() ->
{
    int n = workSmart(arg);
    f.complete(n);
});
executor.execute(() ->
{
    try
    {
        Thread.sleep(timeout);
        f.completeExceptionally(new TimeoutException());
    }
    catch (InterruptedException e)
    {
        f.completeExceptionally(e);
    }
});
```

**Dịch:** `CompletableFuture` được gọi là **"completable" vì người ta có thể set một completion value**. (Ở các thư viện concurrency khác, thực thể như vậy gọi là **promise**, và hành động hoàn tất gọi là **"fulfilling the promise"**.) **Với tư cách consumer của `Future`, bạn không quan tâm giá trị được set thế nào** — **đó là việc của producer của promise**. `supplyAsync` **tạo ra một `CompletableFuture` và set completion value khi task xong**. **Các producer khác có thể dùng cách tiếp cận phức tạp hơn** — ví dụ trên tạo ra một future mà **hai task cùng lúc làm việc để hoàn tất nó**.

> *"It is safe to call complete or completeExceptionally on the same instance in multiple threads. If the future is already completed, these calls have no effect."*

**Dịch:** **Gọi `complete` hoặc `completeExceptionally` trên cùng một instance từ nhiều thread là an toàn.** Nếu **future đã hoàn tất thì các lời gọi đó không có tác dụng gì**.

> **Caution (sách):** *"Unlike a plain Future, the computation of a CompletableFuture is not interrupted when you invoke its cancel method. Canceling simply completes the future exceptionally, with a CancellationException. In general, this makes sense since a CompletableFuture may not have a single thread that is responsible for its completion. However, this restriction also applies to CompletableFuture instances returned by methods such as supplyAsync, which could in principle be interrupted."*
>
> **Dịch:** Khác với `Future` thường, **phép tính của một `CompletableFuture` không bị interrupt khi bạn gọi method `cancel` của nó**. Việc cancel **chỉ đơn giản làm future hoàn tất với exception `CancellationException`**. Nói chung điều này hợp lý, vì **một `CompletableFuture` có thể không có một thread duy nhất chịu trách nhiệm hoàn tất nó**. Tuy nhiên, **hạn chế này cũng áp dụng cho các instance `CompletableFuture` trả về từ những method như `supplyAsync`**, vốn **về nguyên tắc là interrupt được**.

---

## 10.7.2. Composing Completable Futures

> *"Nonblocking calls are implemented through callbacks. The programmer registers a callback for the action that should occur after a task completes. Of course, if the next action is also asynchronous, the next action after that is in a different callback. Even though the programmer thinks in terms of "first do step 1, then step 2, then step 3," the program logic can become dispersed in "callback hell." It gets even worse when one has to add error handling. Suppose step 2 is "the user logs in." You may need to repeat that step since the user can mistype the credentials. Trying to implement such a control flow in a set of callbacks, or to understand it once it has been implemented, can be quite challenging."*

**Dịch:** **Lời gọi non-blocking được implement qua callback.** Lập trình viên **đăng ký một callback cho hành động cần xảy ra sau khi task hoàn tất**. Dĩ nhiên, nếu **hành động kế tiếp cũng bất đồng bộ thì hành động sau đó lại nằm trong một callback khác**. Dù lập trình viên nghĩ theo kiểu **"trước làm bước 1, rồi bước 2, rồi bước 3"**, **logic chương trình có thể phân tán trong "callback hell"**. Còn tệ hơn khi **phải thêm xử lý lỗi**. Giả sử bước 2 là **"người dùng đăng nhập"** — bạn có thể **phải lặp lại bước đó vì người dùng gõ sai thông tin**. Việc **implement một control flow như vậy bằng một mớ callback, hoặc hiểu nó sau khi đã implement, khá là thách thức**.

> *"The CompletableFuture class addresses this problem by providing a mechanism for composing asynchronous tasks into a processing pipeline."*

**Dịch:** Class `CompletableFuture` **giải quyết vấn đề này bằng cách cung cấp cơ chế ghép (compose) các task bất đồng bộ thành một processing pipeline**.

> *"For example, suppose we want to extract all images from a web page. Let's say we have a method"*

```java
public CompletableFuture<String> readPage(URI uri)
```

> *"that yields the text of a web page when it becomes available. If the method"*

```java
public List<URI> getImageLinks(String page)
```

> *"yields the links of images in an HTML page, you can schedule it to be called when the page is available:"*

```java
CompletableFuture<String> contents = readPage(uri);
CompletableFuture<List<URI>> imageLinks = contents.thenApply(this::getImageLinks);
```

**Dịch:** Ví dụ, giả sử ta muốn **trích mọi ảnh từ một trang web**. Nói rằng ta có method `readPage` **cho ra text của trang web khi nó sẵn sàng**, và method `getImageLinks` **cho ra các link ảnh trong một trang HTML** — bạn **lên lịch để nó được gọi khi trang đã sẵn sàng**.

> *"The thenApply method doesn't block either. It returns another future. When the first future has completed, its result is fed to the getImageLinks method, and the return value of that method becomes the final result."*

**Dịch:** **`thenApply` cũng không block.** Nó **trả về một future khác**. Khi **future đầu tiên hoàn tất, kết quả của nó được đưa vào method `getImageLinks`**, và **giá trị trả về của method đó trở thành kết quả cuối cùng**.

> *"With completable futures, you just specify what you want to have done and in which order. It won't all happen right away, of course, but what is important is that all the code is in one place."*

**Dịch:** Với completable future, bạn **chỉ cần nêu rõ bạn muốn làm gì và theo thứ tự nào**. Dĩ nhiên **không phải mọi thứ xảy ra ngay lập tức**, nhưng **điều quan trọng là toàn bộ code nằm ở một chỗ**.

> *"Conceptually, CompletableFuture is a simple API, but there are many variants of methods for composing completable futures. Let us first look at those that add an action to a single future (see Table 10.3). In the table, I use a shorthand notation for the ponderous functional interfaces, writing T -> U instead of Function<? super T, ? extends U>. These aren't actual Java types, of course."*

**Dịch:** Về mặt khái niệm, `CompletableFuture` là **một API đơn giản**, nhưng **có rất nhiều biến thể method để ghép completable future**. Trước hết, xét các method **thêm một hành động vào một future duy nhất** (Bảng 10.3). Trong bảng, tác giả dùng **ký hiệu viết tắt cho các functional interface dài dòng**, viết **`T -> U` thay cho `Function<? super T, ? extends U>`**. Dĩ nhiên **đó không phải kiểu Java thực sự**.

> *"You have already seen the thenApply method. Suppose f is a T -> U function. The call"*

```java
CompletableFuture<U> future.thenApply(f);
```

> *"returns a future that applies the function f to the result of future when it is available."*

**Dịch:** Bạn đã thấy `thenApply`. Giả sử **`f` là một function `T -> U`**, lời gọi trên **trả về một future áp dụng function `f` lên kết quả của `future` khi kết quả sẵn sàng**.

> *"The thenCompose method, instead of taking a T -> U function, receives a function mapping T to CompletableFuture<U>. That sounds rather abstract, but it can be quite natural. It is a function that eventually yields a U. The call"*

```java
CompletableFuture<U> future.thenCompose(f);
```

> *"works exactly like thenApply, applying f to the result of future. However, the result of f is not immediately available. When it arrives, the composition completes."*

**Dịch:** Method **`thenCompose`**, thay vì nhận function `T -> U`, **nhận một function map `T` sang `CompletableFuture<U>`**. Nghe khá trừu tượng, nhưng **có thể rất tự nhiên: đó là một function rốt cuộc cho ra một `U`**. Lời gọi này **hoạt động y hệt `thenApply`, áp dụng `f` lên kết quả của `future`**. Tuy nhiên, **kết quả của `f` không sẵn sàng ngay** — **khi nó đến thì composition hoàn tất**.

> *"In the preceding section, you saw the whenComplete method for handling exceptions. There is also a handle method that requires a function processing the result or exception and computing a new result. In many cases, it is simpler to call the exceptionally method instead. That method computes a dummy value when an exception occurs:"*

```java
CompletableFuture<List<URI>> imageLinks = readPage(uri)
    .exceptionally(ex -> "<html></html>")
    .thenApply(this::getImageLinks);
```

**Dịch:** Ở phần trước, bạn đã thấy `whenComplete` để **xử lý exception**. Cũng có method **`handle` đòi hỏi một function xử lý kết quả hoặc exception và tính ra một kết quả mới**. Trong nhiều trường hợp, **gọi `exceptionally` thì đơn giản hơn** — method đó **tính ra một giá trị giả khi exception xảy ra**.

> *"You can handle a timeout in the same way:"*

```java
CompletableFuture<List<URI>> imageLinks = readPage(uri)
    .completeOnTimeout("<html></html>", 30, TimeUnit.SECONDS)
    .thenApply(this::getImageLinks);
```

> *"Alternatively, you can throw an exception on timeout:"*

```java
CompletableFuture<String> = readPage(uri).orTimeout(30, TimeUnit.SECONDS);
```

> *"The methods in Table 10.3 with void result are normally used at the end of a processing pipeline."*

**Dịch:** Bạn **xử lý timeout theo cách tương tự**. Hoặc bạn **ném một exception khi timeout**. Các method trong Bảng 10.3 có **kết quả `void` thường được dùng ở cuối một processing pipeline**.

### Table 10.3 — Adding an Action to a `CompletableFuture<T>` Object

| Method | Parameter | Description (dịch từ sách) |
|---|---|---|
| `thenApply` | `T -> U` | **Áp dụng một function lên kết quả.** |
| `thenAccept` | `T -> void` | Như `thenApply`, nhưng **kết quả `void`**. |
| `thenCompose` | `T -> CompletableFuture<U>` | **Gọi function lên kết quả và thực thi future trả về.** |
| `thenRun` | `Runnable` | **Thực thi `Runnable` với kết quả `void`.** |
| `handle` | `(T, Throwable) -> U` | **Xử lý kết quả hoặc lỗi và cho ra một kết quả mới.** |
| `whenComplete` | `(T, Throwable) -> void` | Như `handle`, nhưng **kết quả `void`**. |
| `exceptionally` | `Throwable -> U` | **Tính một kết quả từ lỗi.** |
| `exceptionallyCompose` | `Throwable -> CompletableFuture<U>` | **Gọi function lên exception và thực thi future trả về.** |
| `completeOnTimeout` | `T, long, TimeUnit` | **Cho ra giá trị đã cho làm kết quả trong trường hợp timeout.** |
| `orTimeout` | `long, TimeUnit` | **Cho ra một `TimeoutException` trong trường hợp timeout.** |

### Kết hợp nhiều future

> *"Now let us turn to methods that combine multiple futures (see Table 10.4). The first three methods run a CompletableFuture<T> and a CompletableFuture<U> action concurrently and combine the results. The next three methods run two CompletableFuture<T> actions concurrently. As soon as one of them finishes, its result is passed on, and the other result is ignored."*

**Dịch:** Giờ xét các method **kết hợp nhiều future** (Bảng 10.4). **Ba method đầu chạy đồng thời một hành động `CompletableFuture<T>` và một `CompletableFuture<U>` rồi kết hợp kết quả.** **Ba method tiếp theo chạy đồng thời hai hành động `CompletableFuture<T>`** — **ngay khi một trong hai xong, kết quả của nó được truyền tiếp, còn kết quả kia bị bỏ qua**.

> *"Finally, the static allOf and anyOf methods shown in Table 10.5 take a variable number of completable futures and yield a CompletableFuture<Void> that completes when all of them, or any one of them, completes. The allOf method does not yield a result. The anyOf method does not terminate the remaining tasks."*

**Dịch:** Cuối cùng, các static method **`allOf` và `anyOf`** ở Bảng 10.5 **nhận một số lượng completable future biến thiên** và **cho ra một `CompletableFuture<Void>` hoàn tất khi tất cả chúng, hoặc bất kỳ cái nào trong chúng, hoàn tất**. **`allOf` không cho ra kết quả. `anyOf` không kết thúc các task còn lại.**

> **Caution (sách):** *"The anyOf may yield a future that completed exceptionally even if others completed successfully."*
>
> **Dịch:** `anyOf` **có thể cho ra một future đã hoàn tất bằng exception, ngay cả khi các future khác hoàn tất thành công**.

### Table 10.4 — Combining Another Future with a `CompletableFuture<T>`

| Method | Parameters | Description (dịch từ sách) |
|---|---|---|
| `thenCombine` | `CompletableFuture<U>`, `(T, U) -> V` | **Thực thi cả hai và kết hợp kết quả bằng function cho trước.** |
| `thenAcceptBoth` | `CompletableFuture<U>`, `(T, U) -> void` | Như `thenCombine`, nhưng **kết quả `void`**. |
| `runAfterBoth` | `CompletableFuture<?>`, `Runnable` | **Thực thi runnable sau khi cả hai hoàn tất.** |
| `applyToEither` | `CompletableFuture<T>`, `T -> V` | **Khi một kết quả sẵn sàng từ cái này hoặc cái kia, truyền nó cho function cho trước.** |
| `acceptEither` | `CompletableFuture<T>`, `T -> void` | Như `applyToEither`, nhưng **kết quả `void`**. |
| `runAfterEither` | `CompletableFuture<?>`, `Runnable` | **Thực thi runnable sau khi một trong hai hoàn tất.** |

### Table 10.5 — Combining Multiple Futures

| Method | Parameter | Description (dịch từ sách) |
|---|---|---|
| `static allOf` | `CompletableFuture<?>...` | **Hoàn tất với kết quả `void` sau khi mọi future cho trước hoàn tất** (một số có thể kèm exception). |
| `static anyOf` | `CompletableFuture<?>...` | **Hoàn tất sau khi bất kỳ future nào cho trước hoàn tất**, cho ra **kết quả hoặc exception của nó**. |

> **Note (sách):** *"For each method shown, there are also two Async variants for specifying the executor of the "dependent completion" (that is, the action to be executed upon completion of the future) executor. One of the variants uses a default executor (not recommended), and the other has an Executor parameter. For a pipeline of actions, start off with an Async variant to set the desired executor, and then use the non-Async methods to continue with the same executor."*
>
> **Dịch:** Với mỗi method được nêu, còn có **hai biến thể `Async`** để **chỉ định executor cho "dependent completion"** (tức **hành động sẽ được thực thi khi future hoàn tất**). Một biến thể **dùng executor mặc định (không khuyến nghị)**, biến thể kia **có parameter `Executor`**. Với một **pipeline các hành động**, hãy **bắt đầu bằng một biến thể `Async` để set executor mong muốn**, rồi **dùng các method không `Async` để tiếp tục với cùng executor đó**.

> **Note (sách):** *"Technically speaking, the methods in this section have parameters of type CompletionStage, not CompletableFuture. The CompletionStage interface describes how to compose asynchronous computations, whereas the Future interface focuses on the result of a computation. A CompletableFuture is both a CompletionStage and a Future."*
>
> **Dịch:** Về mặt kỹ thuật, các method ở phần này **có parameter kiểu `CompletionStage`, không phải `CompletableFuture`**. Interface **`CompletionStage` mô tả cách ghép các phép tính bất đồng bộ**, còn interface **`Future` tập trung vào kết quả của một phép tính**. **`CompletableFuture` vừa là `CompletionStage` vừa là `Future`.**

### Chương trình ví dụ

> *"Listing 10.10 shows a complete program that reads a web page, scans it for images, loads the images and saves them locally. Note how all asynchronous methods return a CompletableFuture. To kick off the computation, we use a little trick. Rather than calling the readPage method in a lambda expression passed to supplyAsync, a completed future provides the URI argument, which is then composed with this::readPage. That way, the pipeline has a very uniform appearance:"*

```java
CompletableFuture.completedFuture(uri)
    .thenComposeAsync(this::readPage, executor)
    .thenApply(this::getImageLinks)
    .thenCompose(this::getImages)
    .thenAccept(this::saveImages);
```

**Dịch:** Listing 10.10 là một chương trình hoàn chỉnh **đọc một trang web, quét tìm ảnh, tải ảnh và lưu về máy**. Để ý rằng **mọi method bất đồng bộ đều trả về một `CompletableFuture`**. Để **khởi động phép tính, ta dùng một mẹo nhỏ**: thay vì gọi `readPage` trong một [[02 - Lambda Expressions|lambda expression]] truyền cho `supplyAsync`, **một future đã hoàn tất cung cấp argument `URI`**, rồi **được ghép với `this::readPage`**. Nhờ vậy **pipeline có hình dạng rất đồng nhất**.

> **Tip (sách):** *"This example shows the ideal form of an asynchronous pipeline. Each step is a function of one of the following three types:"*
>
> **Dịch:** Ví dụ này cho thấy **dạng lý tưởng của một asynchronous pipeline**. **Mỗi bước là một function thuộc một trong ba loại sau:**
>
> | Loại | Mô tả (dịch từ sách) |
> |---|---|
> | 1 | Một **asynchronous function `T -> CompletableFuture<U>`** cho ra kết quả trong tương lai, **truyền cho `thenCompose`**. |
> | 2 | Một **synchronous function `T -> U`** trả về kết quả ngay, **truyền cho `thenApply`**. |
> | 3 | Một **consumer cuối cùng không trả về kết quả**, **truyền cho `thenAccept`**. |
>
> **Tip (tiếp):** *"The initial completedFuture provides the argument for the first function. The first asynchronous step uses composeAsync to supply an executor."*
>
> **Dịch:** **`completedFuture` ban đầu cung cấp argument cho function đầu tiên.** Bước bất đồng bộ đầu tiên **dùng `composeAsync` để cung cấp một executor**.

### Listing 10.10 — `completableFutures/CompletableFutureDemo.java`

```java
package completableFutures;

import java.awt.image.*;
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.*;

import javax.imageio.*;

/**
 * @version 1.02 2023-07-30
 * @author Cay Horstmann
 */
public class CompletableFutureDemo
{
    private static final Pattern IMG_PATTERN = Pattern.compile(
        "[<]\\s*[iI][mM][gG]\\s*[^>]*[sS][rR][cC]\\s*[=]\\s*['\"]([^'\"]*)['\"][^>]*[>]");
    private ExecutorService executor = Executors.newCachedThreadPool();
    private URI uriToProcess;

    public CompletableFuture<String> readPage(URI uri)
    {
        return CompletableFuture.supplyAsync(() -> {
            try
            {
                var contents = new String(uri.toURL().openStream().readAllBytes());
                System.out.println("Read page from " + uri);
                return contents;
            }
            catch (IOException e)
            {
                throw new UncheckedIOException(e);
            }
        }, executor);
    }

    public List<URI> getImageLinks(String webpage) // not blocking
    {
        var result = new ArrayList<URI>();
        Matcher matcher = IMG_PATTERN.matcher(webpage);
        while (matcher.find())
        {
            URI uri = URI.create(uriToProcess + "/" + matcher.group(1));
            result.add(uri);
        }
        System.out.println("Found links: " + result);
        return result;
    }

    public CompletableFuture<List<BufferedImage>> getImages(List<URI> uris)
    {
        return CompletableFuture.supplyAsync(() -> {
            try
            {
                var result = new ArrayList<BufferedImage>();
                for (URI uri : uris)
                {
                    result.add(ImageIO.read(uri.toURL()));
                    System.out.println("Loaded " + uri);
                }
                return result;
            }
            catch (IOException e)
            {
                throw new UncheckedIOException(e);
            }
        }, executor);
    }

    public void saveImages(List<BufferedImage> images)
    {
        System.out.println("Saving " + images.size() + " images");
        try
        {
            for (int i = 0; i < images.size(); i++)
            {
                String filename = "/tmp/image" + (i + 1) + ".png";
                ImageIO.write(images.get(i), "PNG", new File(filename));
            }
        }
        catch (IOException e)
        {
            throw new UncheckedIOException(e);
        }
        executor.shutdown();
    }

    public CompletableFutureDemo(URI uri)
    {
        uriToProcess = uri;
    }

    public void run() throws IOException, InterruptedException
    {
        CompletableFuture.completedFuture(uriToProcess)
            .thenComposeAsync(this::readPage, executor)
            .thenApply(this::getImageLinks)
            .thenCompose(this::getImages)
            .thenAccept(this::saveImages);

        // or use the HTTP client:
        /*
        HttpClient client = HttpClient.newBuilder().build();
        HttpRequest request = HttpRequest.newBuilder(uriToProcess).GET().build();
        client.sendAsync(request, BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenApply(this::getImageLinks)
            .thenCompose(this::getImages)
            .thenAccept(this::saveImages);
        */
    }

    public static void main(String[] args)
        throws IOException, InterruptedException
    {
        new CompletableFutureDemo(URI.create("http://horstmann.com/index.html")).run();
    }
}
```

---

## 10.7.3. Long-Running Tasks in User-Interface Callbacks

> *"One of the reasons to use threads is to make your programs more responsive. This is particularly important in an application with a user interface. With Swing, JavaFX, and Android, user-interface components are not thread-safe, and all user-interface actions run in a single thread. When your program needs to do something time-consuming, you cannot do the work in the user-interface thread, or the user interface will be frozen. Instead, fire up another worker thread."*

**Dịch:** Một trong những lý do dùng thread là **làm chương trình phản hồi tốt hơn**. Điều này **đặc biệt quan trọng với application có user interface**. Với **Swing, JavaFX, và Android**, **component giao diện không thread-safe**, và **mọi hành động giao diện chạy trong một thread duy nhất**. Khi chương trình cần **làm việc gì tốn thời gian, bạn không thể làm việc đó trong UI thread**, nếu không **giao diện sẽ đóng băng**. Thay vào đó, **hãy khởi động một worker thread khác**.

> *"For example, if you want to read a file when the user clicks a button, don't do this:"*

```java
var open = new JButton("Open");
open.addActionListener(event ->
{ // BAD--long-running action is executed on UI thread
    var in = new Scanner(file);
    while (in.hasNextLine())
    {
        String line = in.nextLine();
        . . .
    }
});
```

> *"Instead, do the work in a separate thread."*

```java
open.addActionListener(event ->
{ // GOOD--long-running action in separate thread
    Runnable task = () ->
    {
        var in = new Scanner(file);
        while (in.hasNextLine())
        {
            String line = in.nextLine();
            . . .
        }
    };
    executor.execute(task);
});
```

**Dịch:** Ví dụ, nếu bạn muốn **đọc một file khi người dùng bấm nút, đừng làm như trên (BAD)** — thay vào đó, **làm việc đó trong một thread riêng (GOOD)**.

> *"However, you cannot directly update the user interface from the worker thread that executes the long-running task. Since Swing, JavaFX, and Android are not thread-safe, you cannot manipulate user-interface elements from multiple threads, or they risk becoming corrupted. In fact, JavaFX and Android check for this, and throw an exception if you try to access the user interface from a thread other than the UI thread."*

**Dịch:** Tuy nhiên, bạn **không cập nhật giao diện trực tiếp từ worker thread được**. Vì Swing, JavaFX và Android **không thread-safe**, bạn **không thao tác lên phần tử giao diện từ nhiều thread được**, nếu không **chúng có nguy cơ bị hỏng**. Thực tế, **JavaFX và Android kiểm tra điều này và ném exception nếu bạn cố truy cập giao diện từ một thread khác UI thread**.

> *"Therefore, you need to schedule any UI updates to happen on the UI thread. Each user-interface library provides some mechanism to schedule a Runnable for execution on the UI thread. For example, in Swing, you call"*

```java
EventQueue.invokeLater(() -> label.setText(percentage + "% complete"));
```

**Dịch:** Vì thế, bạn phải **lên lịch cho mọi cập nhật UI diễn ra trên UI thread**. **Mỗi thư viện giao diện đều cung cấp cơ chế lên lịch một `Runnable` để chạy trên UI thread.**

> *"It is tedious to implement user feedback in a worker thread, so each user-interface library provides some kind of helper class for managing the details, such as SwingWorker in Swing, Task in JavaFX, and AsyncTask in Android. You specify actions for the long-running task (which is run on a separate thread) as well as progress updates and the final disposition (which are run on the UI thread)."*

**Dịch:** Việc **implement phản hồi cho người dùng trong một worker thread khá nhọc**, nên **mỗi thư viện giao diện cung cấp một dạng helper class để quản lý chi tiết**: **`SwingWorker` trong Swing, `Task` trong JavaFX, và `AsyncTask` trong Android**. Bạn **chỉ định hành động cho task dài hạn (chạy trên thread riêng)** cùng với **cập nhật tiến độ và xử lý cuối cùng (chạy trên UI thread)**.

> *"The program in Listing 10.11 has commands for loading a text file and for canceling the file loading process. You should try the program with a long file, such as the full text of The Count of Monte Cristo, supplied in the gutenberg directory of the book's companion code. The file is loaded in a separate thread. While the file is being read, the Open menu item is disabled and the Cancel item is enabled (see Figure 10.6). After each line is read, a line counter in the status bar is updated. After the reading process is complete, the Open menu item is reenabled, the Cancel item is disabled, and the status line text is set to Done."*

**Dịch:** Chương trình ở Listing 10.11 có **lệnh load một file text và lệnh huỷ quá trình load**. Bạn nên **thử với một file dài**, chẳng hạn toàn văn *The Count of Monte Cristo* trong thư mục `gutenberg` của code đi kèm sách. **File được load trong một thread riêng.** Trong lúc đọc file, **mục menu Open bị vô hiệu hoá còn Cancel được kích hoạt**. **Sau mỗi dòng được đọc, bộ đếm dòng ở thanh trạng thái được cập nhật.** Sau khi đọc xong, **Open được bật lại, Cancel bị tắt, và dòng trạng thái được đặt thành `Done`**.

> *"This example shows the typical UI activities of a background task:"*

**Dịch:** Ví dụ này cho thấy **các hoạt động UI điển hình của một background task**:

| Hoạt động (dịch từ sách) |
|---|
| Sau **mỗi đơn vị công việc, cập nhật UI để thể hiện tiến độ**. |
| Sau khi **công việc hoàn tất, thực hiện một thay đổi cuối cùng lên UI**. |

> *"The SwingWorker class makes it easy to implement such a task. Override the doInBackground method to do the time-consuming work and occasionally call publish to communicate work progress. This method is executed in a worker thread. The publish method causes a process method to execute in the event dispatch thread to deal with the progress data. When the work is complete, the done method is called in the event dispatch thread so that you can finish updating the UI."*

**Dịch:** Class **`SwingWorker` khiến việc implement task như vậy trở nên dễ dàng**. **Override `doInBackground` để làm việc tốn thời gian**, và **thỉnh thoảng gọi `publish` để truyền đạt tiến độ**. Method này **chạy trong một worker thread**. **`publish` khiến method `process` chạy trong event dispatch thread để xử lý dữ liệu tiến độ.** Khi công việc hoàn tất, **`done` được gọi trong event dispatch thread** để bạn **hoàn tất việc cập nhật UI**.

> *"Whenever you want to do some work in the worker thread, construct a new worker. (Each worker object is meant to be used only once.) Then call the execute method. You will typically call execute on the event dispatch thread, but that is not a requirement."*

**Dịch:** Mỗi khi muốn làm việc gì đó trong worker thread, **hãy dựng một worker mới**. (**Mỗi object worker chỉ dành để dùng một lần.**) Rồi **gọi method `execute`**. Bạn thường gọi `execute` trên event dispatch thread, nhưng **đó không phải yêu cầu bắt buộc**.

> *"It is assumed that a worker produces a result of some kind; therefore, SwingWorker<T, V> implements Future<T>. This result can be obtained by the get method of the Future interface. Since the get method blocks until the result is available, you don't want to call it immediately after calling execute. It is a good idea to call it only when you know that the work has been completed. Typically, you call get from the done method. (There is no requirement to call get. Sometimes, processing the progress data is all you need.)"*

**Dịch:** Người ta **giả định một worker cho ra một kết quả nào đó**; vì vậy **`SwingWorker<T, V>` implement `Future<T>`**. Kết quả này **lấy được bằng method `get` của interface `Future`**. Vì `get` **block cho tới khi có kết quả**, bạn **không nên gọi nó ngay sau khi gọi `execute`** — **nên gọi nó chỉ khi bạn biết công việc đã hoàn tất**. Thường thì **bạn gọi `get` từ trong method `done`**. (**Không bắt buộc phải gọi `get`** — đôi khi **xử lý dữ liệu tiến độ là đủ**.)

> *"Both the intermediate progress data and the final result can have arbitrary types. The SwingWorker class has these types as type parameters. A SwingWorker<T, V> produces a result of type T and progress data of type V."*

**Dịch:** **Cả dữ liệu tiến độ trung gian lẫn kết quả cuối cùng đều có kiểu tuỳ ý.** Class `SwingWorker` **có các kiểu này làm [[02 - Defining a Simple Generic Class|type parameter]]**: **`SwingWorker<T, V>` cho ra kết quả kiểu `T` và dữ liệu tiến độ kiểu `V`**.

> *"To cancel the work in progress, use the cancel method of the Future interface. When the work is canceled, the get method throws a CancellationException."*

**Dịch:** Để **huỷ công việc đang chạy, dùng method `cancel` của interface `Future`**. Khi công việc bị huỷ, **`get` ném `CancellationException`**.

> *"As already mentioned, the worker thread's call to publish will cause calls to process on the event dispatch thread. For efficiency, the results of several calls to publish may be batched up in a single call to process. The process method receives a List<V> containing all intermediate results."*

**Dịch:** Như đã nói, **lời gọi `publish` của worker thread sẽ gây ra các lời gọi `process` trên event dispatch thread**. **Vì hiệu năng, kết quả của nhiều lời gọi `publish` có thể được gom lại vào một lời gọi `process` duy nhất.** `process` **nhận một `List<V>` chứa mọi kết quả trung gian**.

> *"Let us put this mechanism to work for reading in a text file. As it turns out, a JTextArea is quite slow. Appending lines from a long text file (such as all lines in The Count of Monte Cristo) takes considerable time. To show the user that progress is being made, we want to display the number of lines read in a status line. Thus, the progress data consist of the current line number and the current line of text. We package these into a record:"*

```java
private record ProgressData(int number, String line) {}
```

> *"The final result is the text that has been read into a StringBuilder. Thus, we need a SwingWorker<StringBuilder, ProgressData>."*

**Dịch:** Hãy áp dụng cơ chế này cho việc đọc một file text. Hoá ra **`JTextArea` khá chậm** — **thêm dòng từ một file text dài mất kha khá thời gian**. Để **cho người dùng thấy tiến độ**, ta muốn **hiển thị số dòng đã đọc ở dòng trạng thái**. Vậy **dữ liệu tiến độ gồm số dòng hiện tại và nội dung dòng hiện tại**, ta **gói chúng vào một `record`**. **Kết quả cuối là text đã đọc vào một `StringBuilder`** — vậy ta cần **`SwingWorker<StringBuilder, ProgressData>`**.

> *"In the doInBackground method, we read a file, a line at a time. After each line, we call publish to publish the line number and the text of the current line."*

```java
@Override public StringBuilder doInBackground() throws IOException, InterruptedException
{
    int lineNumber = 0;
    var in = new Scanner(new FileInputStream(file));
    while (in.hasNextLine())
    {
        String line = in.nextLine();
        lineNumber++;
        text.append(line).append("\n");
        var data = new ProgressData(lineNumber, line);
        publish(data);
        Thread.sleep(1); // to test cancellation; no need to do this in your programs
    }
    return text;
}
```

**Dịch:** Trong `doInBackground`, ta **đọc file từng dòng một**. **Sau mỗi dòng, gọi `publish` để công bố số dòng và nội dung dòng hiện tại.**

> *"We also sleep for a millisecond after every line so that you can test cancellation without getting stressed out, but you wouldn't want to slow down your own programs by sleeping. If you comment out this line, you will find that The Count of Monte Cristo loads quite quickly, with only a few batched user-interface updates."*

**Dịch:** Ta cũng **sleep một mili giây sau mỗi dòng để bạn thử tính năng huỷ mà không phát điên**, nhưng **bạn sẽ không muốn làm chậm chương trình của mình bằng cách sleep**. Nếu **comment dòng đó lại**, bạn sẽ thấy *The Count of Monte Cristo* **load khá nhanh, chỉ với vài lần cập nhật giao diện được gom lô**.

> *"In the process method, we ignore all line numbers but the last one, and we concatenate all lines for a single update of the text area."*

```java
@Override public void process(List<ProgressData> data)
{
    if (isCancelled()) return;
    var b = new StringBuilder();
    statusLine.setText("" + data.getLast().number());
    for (ProgressData d : data) b.append(d.line()).append("\n");
    textArea.append(b.toString());
}
```

**Dịch:** Trong `process`, ta **bỏ qua mọi số dòng trừ số cuối cùng**, và **nối mọi dòng lại để cập nhật text area một lần duy nhất**.

> *"In the done method, the text area is updated with the complete text, and the Cancel menu item is disabled. Note how the worker is started in the event listener for the Open menu item. This simple technique allows you to execute time-consuming tasks while keeping the user interface responsive."*

**Dịch:** Trong `done`, **text area được cập nhật với toàn bộ text, và mục menu Cancel bị vô hiệu hoá**. Để ý **worker được start trong event listener của mục menu Open**. **Kỹ thuật đơn giản này cho phép bạn chạy các task tốn thời gian mà vẫn giữ giao diện phản hồi tốt.**

### Listing 10.11 — `swingWorker/SwingWorkerTest.java`

```java
package swingWorker;

import java.awt.*;
import java.io.*;
import java.util.*;
import java.util.List;
import java.util.concurrent.*;

import javax.swing.*;

/**
 * This program demonstrates a worker thread that runs a potentially time-consuming task.
 * @version 1.13 2023-10-11
 * @author Cay Horstmann
 */
public class SwingWorkerTest
{
    public static void main(String[] args) throws Exception
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new SwingWorkerFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * This frame has a text area to show the contents of a text file, a menu to open a file and
 * cancel the opening process, and a status line to show the file loading progress.
 */
class SwingWorkerFrame extends JFrame
{
    private JFileChooser chooser;
    private JTextArea textArea;
    private JLabel statusLine;
    private JMenuItem openItem;
    private JMenuItem cancelItem;
    private SwingWorker<StringBuilder, ProgressData> textReader;
    public static final int TEXT_ROWS = 20;
    public static final int TEXT_COLUMNS = 60;

    public SwingWorkerFrame()
    {
        chooser = new JFileChooser();
        chooser.setCurrentDirectory(new File("."));

        textArea = new JTextArea(TEXT_ROWS, TEXT_COLUMNS);
        add(new JScrollPane(textArea));

        statusLine = new JLabel(" ");
        add(statusLine, BorderLayout.SOUTH);

        var menuBar = new JMenuBar();
        setJMenuBar(menuBar);

        var menu = new JMenu("File");
        menuBar.add(menu);

        openItem = new JMenuItem("Open");
        menu.add(openItem);
        openItem.addActionListener(event ->
        {
            // show file chooser dialog
            int result = chooser.showOpenDialog(null);

            // if file selected, set it as icon of the label
            if (result == JFileChooser.APPROVE_OPTION)
            {
                textArea.setText("");
                openItem.setEnabled(false);
                textReader = new TextReader(chooser.getSelectedFile());
                textReader.execute();
                cancelItem.setEnabled(true);
            }
        });

        cancelItem = new JMenuItem("Cancel");
        menu.add(cancelItem);
        cancelItem.setEnabled(false);
        cancelItem.addActionListener(event -> textReader.cancel(true));
        pack();
    }

    private record ProgressData(int number, String line) {}

    private class TextReader extends SwingWorker<StringBuilder, ProgressData>
    {
        private File file;
        private StringBuilder text = new StringBuilder();

        public TextReader(File file)
        {
            this.file = file;
        }

        // the following method executes in the worker thread; it doesn't touch Swing components

        public StringBuilder doInBackground() throws IOException, InterruptedException
        {
            int lineNumber = 0;
            try (var in = new Scanner(new FileInputStream(file)))
            {
                while (in.hasNextLine())
                {
                    String line = in.nextLine();
                    lineNumber++;
                    text.append(line).append("\n");
                    var data = new ProgressData(lineNumber, line);
                    publish(data);
                    Thread.sleep(1); // to test cancellation; no need to do this in your programs
                }
            }
            return text;
        }

        // the following methods execute in the event dispatch thread

        public void process(List<ProgressData> data)
        {
            if (isCancelled()) return;
            var builder = new StringBuilder();
            statusLine.setText("" + data.getLast().number());
            for (ProgressData d : data) builder.append(d.line()).append("\n");
            textArea.append(builder.toString());
        }

        public void done()
        {
            try
            {
                StringBuilder result = get();
                textArea.setText(result.toString());
                statusLine.setText("Done");
            }
            catch (InterruptedException ex)
            {
            }
            catch (CancellationException ex)
            {
                textArea.setText("");
                statusLine.setText("Cancelled");
            }
            catch (ExecutionException ex)
            {
                statusLine.setText("" + ex.getCause());
            }
            cancelItem.setEnabled(false);
            openItem.setEnabled(true);
        }
    }
}
```

## API — `javax.swing.SwingWorker<T, V>` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `abstract T doInBackground()` | là method **cần override để thực hiện background task và trả về kết quả của công việc**. |
| `void process(List<V> data)` | là method **cần override để xử lý dữ liệu tiến độ trung gian trong event dispatch thread**. |
| `void publish(V... data)` | **chuyển tiếp dữ liệu tiến độ trung gian tới event dispatch thread**. **Gọi method này từ `doInBackground`.** |
| `void execute()` | **lên lịch cho worker này chạy trên một worker thread**. |
| `SwingWorker.StateValue getState()` | lấy **state của worker này** — một trong **`PENDING`, `STARTED`, hoặc `DONE`**. |

---

## Bài kế tiếp

→ [[08 - Processes]] — `ProcessBuilder` và `Process`: chạy một chương trình khác trong process riêng của hệ điều hành, điều khiển stream và process handle.
