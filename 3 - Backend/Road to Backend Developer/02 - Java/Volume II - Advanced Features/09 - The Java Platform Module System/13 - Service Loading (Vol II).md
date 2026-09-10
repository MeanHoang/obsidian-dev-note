# 13 — Service Loading

> Chapter 9, Section 9.13 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.13 Service Loading

### Nhắc lại service loading

> *"The ServiceLoader class (see Chapter 6 of Volume I) provides a lightweight mechanism for matching up service interfaces with implementations. The Java Platform Module System makes this mechanism easier to use."*

**Dịch:** Class **`ServiceLoader`** (xem [[04 - Service Loaders]]) cung cấp một **cơ chế nhẹ để ghép service interface với implementation**. Java Platform Module System **làm cơ chế này dễ dùng hơn**.

> *"Here is a quick reminder of service loading. A service has an interface and one or more possible implementations. Here is a simple example of an interface:"*

```java
public interface GreeterService
{
    String greet(String subject);
    Locale getLocale();
}
```

> *"One or more modules provide implementations, such as"*

```java
public class FrenchGreeter implements GreeterService
{
    public String greet(String subject) { return "Bonjour " + subject; }
    public Locale getLocale() { return Locale.FRENCH; }
}
```

**Dịch:** Nhắc nhanh về service loading: một **service có một interface và một hoặc nhiều implementation khả dĩ**. **Một hoặc nhiều module cung cấp implementation.**

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

**Dịch:** **Bên tiêu thụ service phải chọn một implementation** trong số các implementation được cung cấp, **theo tiêu chí nào mà nó thấy phù hợp**.

### `provides` thay cho file `META-INF/services`

> *"In the past, implementations were offered by placing text files into the META-INF/services directory of the JAR file containing the implementation classes. The module system provides a better approach. Instead of text files, you can add statements to the module descriptors."*

**Dịch:** Trước kia, implementation được cung cấp bằng cách **đặt file text vào thư mục `META-INF/services`** của file JAR chứa class implementation. Module system cho **cách tốt hơn**: thay vì file text, **thêm statement vào module descriptor**.

> *"A module providing an implementation of a service adds a provides statement that lists the service interface (which may be defined in any module) and the implementing class (which must be a part of this module). Here is an example from the jdk.security.auth module:"*

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

> *"This is the equivalent of the META-INF/services file."*

**Dịch:** Module cung cấp implementation của một service thì **thêm một statement `provides`** liệt kê **service interface** (interface này **được định nghĩa ở module bất kỳ**) và **class implement** (class này **phải thuộc module hiện tại**). Đây là **thứ tương đương với file `META-INF/services`**.

### `uses` ở phía tiêu thụ

> *"A consuming module contains a uses statement."*

```java
module java.base
{
    . . .
    uses javax.security.auth.spi.LoginModule;
}
```

> *"When code in a consuming module calls ServiceLoader.load(ServiceInterface.class), the matching provider classes will be loaded, even though they may not be in accessible packages."*

**Dịch:** **Module tiêu thụ chứa statement `uses`**. Khi code trong module tiêu thụ gọi `ServiceLoader.load(ServiceInterface.class)`, các **class provider khớp sẽ được load**, **kể cả khi chúng không nằm trong package truy cập được**.

### Ví dụ trong sách

> *"In our code example, we provide implementations for a German and French greeter in the package com.horstmann.greetsvc.internal. The service module exports the com.horstmann.greetsvc package, but not the package with the implementations. The provides statement declares the service and its implementing classes in the unexported package:"*

### `com.horstmann.greetsvc/module-info.java`

```java
module com.horstmann.greetsvc
{
    exports com.horstmann.greetsvc;
    provides com.horstmann.greetsvc.GreeterService with
        com.horstmann.greetsvc.internal.FrenchGreeter,
        com.horstmann.greetsvc.internal.GermanGreeterFactory;
}
```

**Dịch:** Trong ví dụ, ta cung cấp implementation cho **greeter tiếng Đức và tiếng Pháp** trong package `com.horstmann.greetsvc.internal`. Module service **export package `com.horstmann.greetsvc`** nhưng **không export package chứa implementation**. Statement `provides` **khai báo service và các class implement nằm trong package không được export**.

### `v2ch09.useservice/com/horstmann/hello/HelloWorld.java`

> *"The v2ch09.useservice module consumes the service. Using the ServiceLoader facility, we iterate over the provided services and pick the one matching the desired language:"*

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

### `v2ch09.useservice/module-info.java`

> *"The module declaration requires the service module and declares that the GreeterService is being used."*

```java
module v2ch09.useservice
{
    requires com.horstmann.greetsvc;
    uses com.horstmann.greetsvc.GreeterService;
}
```

> *"As a result of the provides and uses declarations, the module that consumes the service is allowed access to the private implementation classes."*

**Dịch:** Nhờ **các khai báo `provides` và `uses`**, module tiêu thụ service **được phép truy cập các class implementation riêng tư**.

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
  v2ch09.useservice/com/horstmann/hello/HelloWorld.java \
  v2ch09.useservice/module-info.java

java -p com.horstmann.greetsvc:v2ch09.useservice \
  -m v2ch09.useservice/com.horstmann.hello.HelloWorld
```

| Statement | Phía nào | Nội dung |
|---|---|---|
| `provides I with C1, C2` | module **cung cấp** | interface `I` (ở module bất kỳ) + class implement (**phải thuộc module này**) |
| `uses I` | module **tiêu thụ** | khai báo đang dùng service interface `I` |

---

## Bài kế tiếp

→ [[14 - Tools for Working with Modules (Vol II)]] — `jdeps`, `jlink`, `jimage`, `jmod`.
