# 13 — Service Loading

> Chapter 12, Section 12.13 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.13. Service Loading

> *"The ServiceLoader class (see Chapter 6) provides a lightweight mechanism for matching up service interfaces with implementations. The Java Platform Module System makes this mechanism easier to use."*

**Dịch:** Class `ServiceLoader` (xem Chapter 6) cung cấp một **cơ chế nhẹ để khớp service interface với implementation**. Java Platform Module System **làm cho cơ chế này dễ dùng hơn**. → Xem [[04 - Service Loaders]].

### Nhắc lại service loading

> *"Here is a quick reminder of service loading. A service has an interface and one or more possible implementations. Here is a simple example of an interface:"*

```java
public interface GreeterService
{
    String greet(String subject);
    Locale getLocale();
}
```

**Dịch:** Nhắc nhanh về service loading: một **service có một interface và một hoặc nhiều implementation khả dĩ**. Trên là ví dụ đơn giản về một interface.

> *"One or more modules provide implementations, such as"*

```java
public class FrenchGreeter implements GreeterService
{
    public String greet(String subject) { return "Bonjour " + subject; }
    public Locale getLocale() { return Locale.FRENCH; }
}
```

**Dịch:** **Một hoặc nhiều module cung cấp implementation**, chẳng hạn như trên.

> *"The service consumer must pick an implementation among all offered implementations, based on whatever criteria it deems appropriate."*

```java
ServiceLoader<GreeterService> greeterLoader = ServiceLoader.load(GreeterService.class);
GreeterService chosenGreeter;
for (GreeterService greeter : greeterLoader)
{
    if (. . .)
    {
        chosenGreeter = greeter;
    }
}
```

**Dịch:** **Service consumer phải chọn một implementation** trong số tất cả implementation được cung cấp, **dựa trên bất kỳ tiêu chí nào nó thấy phù hợp**.

### `provides` và `uses`

> *"In the past, implementations were offered by placing text files into the META-INF/services directory of the JAR file containing the implementation classes. The module system provides a better approach. Instead of text files, you can add statements to the module descriptors."*

**Dịch:** Trước đây, implementation được cung cấp bằng cách **đặt các file text vào thư mục `META-INF/services`** của file JAR chứa class implementation. Module system đưa ra **cách tiếp cận tốt hơn**: thay vì file text, bạn **thêm statement vào module descriptor**. → Xem [[09 - JAR Files]].

> *"A module providing an implementation of a service adds a provides statement that lists the service interface (which may be defined in any module) and the implementing classes (which must be a part of this module). Here is an example from the jdk.security.auth module:"*

```java
module jdk.security.auth
{
    . . .
    provides javax.security.auth.spi.LoginModule with
        com.sun.security.auth.module.Krb5LoginModule,
        com.sun.security.auth.module.UnixLoginModule,
        com.sun.security.auth.module.JndiLoginModule,
        com.sun.security.auth.module.KeyStoreLoginModule,
        com.sun.security.auth.module.LdapLoginModule,
        com.sun.security.auth.module.NTLoginModule;
}
```

**Dịch:** Module cung cấp implementation cho một service thì **thêm statement `provides`** liệt kê **service interface** (có thể được định nghĩa ở **bất kỳ module nào**) và **các class implement** (**phải là một phần của chính module này**).

> *"A consuming module contains a uses statement."*

```java
module java.base
{
    . . .
    uses javax.security.auth.spi.LoginModule;
}
```

**Dịch:** Module tiêu thụ service thì **chứa một statement `uses`**.

> *"When code in a consuming module calls ServiceLoader.load(ServiceInterface.class), the matching provider classes will be loaded, even though they may not be in accessible packages."*

**Dịch:** Khi code trong module tiêu thụ gọi `ServiceLoader.load(ServiceInterface.class)`, **các provider class khớp sẽ được load**, **kể cả khi chúng không nằm trong package truy cập được**.

### Ví dụ hoàn chỉnh

> *"In our code example, we provide implementations for a German and French greeter in the package com.horstmann.greetsvc.internal. The service module exports the com.horstmann.greetsvc package, but not the package with the implementations. The provides statement declares the service and its implementing classes in the unexported package:"*

```java
module com.horstmann.greetsvc
{
    exports com.horstmann.greetsvc;
    provides com.horstmann.greetsvc.GreeterService with
        com.horstmann.greetsvc.internal.FrenchGreeter,
        com.horstmann.greetsvc.internal.GermanGreeterFactory;
}
```

**Dịch:** Trong ví dụ code, ta cung cấp implementation cho greeter **tiếng Đức và tiếng Pháp** trong package `com.horstmann.greetsvc.internal`. Module service **export package `com.horstmann.greetsvc`, nhưng không export package chứa implementation**. Statement `provides` **khai báo service và các class implement nằm trong package không được export**.

> *"The v1ch12.useservice module consumes the service. Using the ServiceLoader facility, we iterate over the provided services and pick the one matching the desired language:"*

```java
package com.horstmann.hello;

import java.util.*;
import com.horstmann.greetsvc.*;

public class HelloWorld
{
    public static void main(String[] args)
    {
        ServiceLoader<GreeterService> greeterLoader
            = ServiceLoader.load(GreeterService.class);
        String desiredLanguage = args.length > 0 ? args[0] : "de";
        GreeterService chosenGreeter = null;
        for (GreeterService greeter : greeterLoader)
        {
            if (greeter.getLocale().getLanguage().equals(desiredLanguage))
                chosenGreeter = greeter;
        }
        if (chosenGreeter == null)
            System.out.println("No suitable greeter.");
        else
            System.out.println(chosenGreeter.greet("Modular World"));
    }
}
```

**Dịch:** Module `v1ch12.useservice` **tiêu thụ service**. Dùng tiện ích `ServiceLoader`, ta **duyệt qua các service được cung cấp và chọn cái khớp với ngôn ngữ mong muốn**.

> *"The module declaration requires the service module and declares that the GreeterService is being used."*

```java
module v1ch12.useservice
{
    requires com.horstmann.greetsvc;
    uses com.horstmann.greetsvc.GreeterService;
}
```

**Dịch:** Khai báo module này **require module service** và **khai báo rằng `GreeterService` đang được dùng**.

> *"As a result of the provides and uses declarations, the module that consumes the service is allowed access to the module-private implementation classes."*

**Dịch:** Nhờ các khai báo **`provides` và `uses`**, module tiêu thụ service **được phép truy cập các class implementation vốn là module-private**.

### Build và chạy

> *"To build and run the program, first compile the service:"*

```bash
javac com.horstmann.greetsvc/module-info.java \
  com.horstmann.greetsvc/com/horstmann/greetsvc/GreeterService.java \
  com.horstmann.greetsvc/com/horstmann/greetsvc/internal/*.java
```

> *"Then compile and run the consuming module:"*

```bash
javac -p com.horstmann.greetsvc \
  v1ch12.useservice/com/horstmann/hello/HelloWorld.java \
  v1ch12.useservice/module-info.java

java -p com.horstmann.greetsvc:v1ch12.useservice \
  -m v1ch12.useservice/com.horstmann.hello.HelloWorld
```

**Dịch:** Để build và chạy chương trình, **trước hết biên dịch service**. Sau đó **biên dịch và chạy module tiêu thụ**.

| Statement | Vai trò |
|---|---|
| `provides I with C1, C2;` | Module **cung cấp** implementation `C1`, `C2` cho service interface `I` |
| `uses I;` | Module **tiêu thụ** service interface `I` |

---

## Bài kế tiếp

→ [[14 - Tools for Working with Modules]] — ba công cụ `jdeps`, `jlink`, `jmod` của JDK.
