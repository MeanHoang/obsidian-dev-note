# 04 — Service Loaders

> Chapter 6, Section 6.4 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.4. Service Loaders

> *"Sometimes, you develop an application with a service architecture. There are platforms that encourage this approach, such as OSGi (https://osgi.org), which are used in development environments, application servers, and other complex applications. Such platforms go well beyond the scope of this book, but the JDK also offers a simple mechanism for loading services, described here. This mechanism is well supported by the Java Platform Module System—see Chapter 12."*

**Dịch:** Đôi khi bạn phát triển ứng dụng theo **kiến trúc service**. Có những nền tảng khuyến khích cách tiếp cận này, chẳng hạn **OSGi** (https://osgi.org), được dùng trong môi trường phát triển, application server và các ứng dụng phức tạp khác. Những nền tảng đó **vượt xa phạm vi cuốn sách**, nhưng **JDK cũng cung cấp một cơ chế đơn giản để nạp service** — được mô tả ở đây. Cơ chế này **được Java Platform Module System hỗ trợ tốt** (xem Chapter 12).

> *"Often, when providing a service, a program wants to give the service designer some freedom of how to implement the service's features. It can also be desirable to have multiple implementations to choose from. The ServiceLoader class makes it easy to load services that conform to a common interface."*

**Dịch:** Khi cung cấp một service, chương trình thường muốn **cho người thiết kế service tự do lựa chọn cách implement các tính năng**. Cũng có thể **cần nhiều implementation để chọn lựa**. Class **`ServiceLoader`** làm cho việc **nạp các service tuân theo một interface chung** trở nên dễ dàng.

> *"Define an interface (or, if you prefer, a superclass) with the methods that each instance of the service should provide. For example, suppose your service provides encryption."*

```java
package serviceLoader;

public interface Cipher
{
    byte[] encrypt(byte[] source, byte[] key);
    byte[] decrypt(byte[] source, byte[] key);
    int strength();
}
```

**Dịch:** Hãy **định nghĩa một [[01 - Interfaces|interface]]** (hoặc nếu thích thì một superclass) chứa các method mà **mỗi instance của service phải cung cấp**. Ví dụ service của bạn cung cấp **mã hoá**.

> *"The service provider supplies one or more classes that implement this service, for example"*

```java
package serviceLoader.impl;

public class CaesarCipher implements Cipher
{
    public byte[] encrypt(byte[] source, byte[] key)
    {
        var result = new byte[source.length];
        for (int i = 0; i < source.length; i++)
            result[i] = (byte)(source[i] + key[0]);
        return result;
    }

    public byte[] decrypt(byte[] source, byte[] key)
    {
        return encrypt(source, new byte[] { (byte) -key[0] });
    }

    public int strength() { return 1; }
}
```

> *"The implementing classes can be in any package, not necessarily the same package as the service interface. Each of them must have a no-argument constructor."*

**Dịch:** **Service provider** cung cấp **một hoặc nhiều class implement service này**. Các class implement **nằm ở package nào cũng được**, **không nhất thiết cùng package với service interface**. Mỗi class **phải có một [[03 - Defining Your Own Classes#4.3.4. First Steps with Constructors|constructor không argument]]**.

> *"Now add the names of the classes to a UTF-8 encoded text file in the META-INF/services directory whose name matches the fully qualified interface name. In our example, the file META-INF/services/serviceLoader.Cipher would contain the line"*

```
serviceLoader.impl.CaesarCipher
```

> *"In this example, we provide a single implementing class. You could also provide multiple classes and later pick among them."*

**Dịch:** Tiếp đó, **thêm tên các class vào một file text mã hoá UTF-8** đặt trong thư mục **`META-INF/services`**, với **tên file khớp [[08 - Packages#4.8.1. Package Names|fully qualified name]] của interface**. Ở ví dụ này ta cung cấp **một class implement duy nhất**; bạn cũng **cung cấp được nhiều class rồi chọn giữa chúng sau**.

> *"With this preparation done, the program initializes a service loader as follows:"*

```java
public static ServiceLoader<Cipher> cipherLoader =
    ServiceLoader.load(Cipher.class);
```

> *"This should be done just once in the program."*

**Dịch:** Chuẩn bị xong, chương trình **khởi tạo một service loader** như trên. Việc này **chỉ nên làm đúng một lần trong chương trình**.

> *"The iterator method of the service loader returns an iterator through all provided implementations of the service. (See Chapter 9 for more information about iterators.) It is easiest to use an enhanced for loop to traverse them. In the loop, pick an appropriate object to carry out the service."*

```java
public static Cipher getCipher(int minStrength)
{
    for (Cipher cipher : cipherLoader) // implicitly calls cipherLoader.iterator()
    {
        if (cipher.strength() >= minStrength) return cipher;
    }
    return null;
}
```

**Dịch:** Method **`iterator`** của service loader trả về **một iterator duyệt qua mọi implementation của service đã được cung cấp** (chi tiết về iterator ở Chapter 9). **Dễ nhất là dùng vòng lặp `for` nâng cao** để duyệt chúng, rồi **chọn ra object phù hợp để thực hiện service**.

> *"Alternatively, you can use streams (see Chapter 1 of Volume II) to locate the desired service. The stream method yields a stream of ServiceLoader.Provider instances. That interface has methods type and get for getting the provider class and the provider instance. If you select a provider by type, then you just call type and no service instances are unnecessarily instantiated."*

```java
public static Optional<Cipher> getCipher2(int minStrength)
{
    return cipherLoader.stream()
        .filter(descr -> descr.type() == serviceLoader.impl.CaesarCipher.class)
        .findFirst()
        .map(ServiceLoader.Provider::get);
}
```

**Dịch:** Cách khác là dùng **stream** (Chapter 1 của Volume II) để tìm service mong muốn. Method **`stream`** sinh ra **một stream các instance `ServiceLoader.Provider`**. Interface đó có method **`type`** và **`get`** để lấy **class của provider** và **instance của provider**. Nếu bạn **chọn provider theo `type`** thì **chỉ cần gọi `type`**, và **không có instance service nào bị tạo ra một cách không cần thiết**.

> *"Finally, if you are willing to take any service instance, simply call findFirst:"*

```java
Optional<Cipher> cipher = cipherLoader.findFirst();
```

> *"The Optional class is explained in Chapter 1 of Volume II."*

**Dịch:** Cuối cùng, nếu bạn **sẵn sàng lấy bất kỳ instance service nào**, chỉ cần gọi **`findFirst`**. Class `Optional` được giải thích ở Chapter 1 của Volume II.

---

## API — `java.util.ServiceLoader<S>` (Java 1.6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <S> ServiceLoader<S> load(Class<S> service)` | Tạo một service loader để **nạp các class implement service interface đã cho**. |
| `Iterator<S> iterator()` | Sinh ra một iterator **nạp các class service một cách lười (lazily)** — tức là **một class chỉ được nạp khi iterator tiến tới nó**. |
| `Stream<ServiceLoader.Provider<S>> stream()` *(Java 9)* | Trả về **một stream các provider descriptor**, để **provider của class mong muốn được nạp một cách lười**. |
| `Optional<S> findFirst()` *(Java 9)* | Tìm **service provider khả dụng đầu tiên**, nếu có. |

## API — `java.util.ServiceLoader.Provider<S>` (Java 9)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Class<? extends S> type()` | Lấy **kiểu của provider này**. |
| `S get()` | Lấy **một instance của provider này**. |

---

## Bài kế tiếp

→ [[05 - Proxies]] — tạo class mới tại runtime implement một tập interface tuỳ ý, thông qua `Proxy` và `InvocationHandler`.
