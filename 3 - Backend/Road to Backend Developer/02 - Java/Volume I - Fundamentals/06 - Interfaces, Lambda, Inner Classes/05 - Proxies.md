# 05 — Proxies

> Chapter 6, Section 6.5 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.5. Proxies

> *"In the final section of this chapter, we discuss proxies. You can use a proxy to create, at runtime, new classes that implement a given set of interfaces. Proxies are only necessary when you don’t yet know at compile time which interfaces you need to implement. This is not a common situation for application programmers, so feel free to skip this section if you are not interested in advanced wizardry. However, for certain systems programming applications, the flexibility that proxies offer can be very important."*

**Dịch:** Mục cuối chương bàn về **proxy**. Bạn dùng proxy để **tạo ra, ngay lúc runtime, các class mới implement một tập interface cho trước**. Proxy **chỉ cần thiết khi tới lúc compile bạn vẫn chưa biết mình cần implement interface nào**. Đây **không phải tình huống thường gặp với lập trình viên ứng dụng**, nên **cứ bỏ qua mục này** nếu bạn không hứng thú với **ma thuật cao cấp**. Tuy nhiên, với một số ứng dụng **lập trình hệ thống**, **sự linh hoạt mà proxy mang lại có thể rất quan trọng**.

---

## 6.5.1. When to Use Proxies

> *"Suppose you want to construct an object of a class that implements one or more interfaces whose exact nature you may not know at compile time. This is a difficult problem. To construct an actual class, you can simply use the newInstance method or use reflection to find a constructor. But you can’t instantiate an interface. You need to define a new class in a running program."*

**Dịch:** Giả sử bạn muốn dựng object của một class implement **một hoặc nhiều interface mà bản chất chính xác của chúng bạn chưa biết lúc compile**. Đây là **bài toán khó**. Muốn dựng một class thật thì cứ dùng method `newInstance` hoặc dùng [[10 - Reflection|reflection]] để tìm constructor. **Nhưng bạn không tạo được instance của một interface** — bạn **cần định nghĩa một class mới ngay trong chương trình đang chạy**.

> *"To overcome this problem, some programs generate code, place it into a file, invoke the compiler, and then load the resulting class file. Naturally, this is slow, and it also requires deployment of the compiler together with the program. The proxy mechanism is a better solution. The proxy class can create brand-new classes at runtime. Such a proxy class implements the interfaces that you specify. In particular, the proxy class has the following methods:"*
>
> *"All methods required by the specified interfaces; and"*
>
> *"All methods defined in the Object class (toString, equals, and so on)."*

**Dịch:** Để vượt qua vấn đề này, một số chương trình **sinh ra code, ghi vào file, gọi compiler, rồi nạp file class kết quả**. Đương nhiên cách đó **chậm**, và còn **đòi hỏi triển khai cả compiler kèm chương trình**. **Cơ chế proxy là giải pháp tốt hơn**: class proxy **tạo được class hoàn toàn mới lúc runtime**, và class proxy đó **implement các interface bạn chỉ định**. Cụ thể, class proxy có:

| Nhóm method |
|---|
| **Mọi method mà các interface được chỉ định đòi hỏi** |
| **Mọi method định nghĩa trong class `Object`** (`toString`, `equals`, v.v.) |

> *"However, you cannot define new code for these methods at runtime. Instead, you must supply an invocation handler. An invocation handler is an object of any class that implements the InvocationHandler interface. That interface has a single method:"*

```java
Object invoke(Object proxy, Method method, Object[] args)
```

> *"Whenever a method is called on the proxy object, the invoke method of the invocation handler gets called, with the Method object and arguments of the original call. The invocation handler must then figure out how to handle the call."*

**Dịch:** Tuy nhiên bạn **không định nghĩa được code mới cho những method này lúc runtime**. Thay vào đó, bạn **phải cung cấp một invocation handler** — là **object của bất kỳ class nào implement interface `InvocationHandler`**. Interface đó có **đúng một method**.

Mỗi khi một method được gọi lên object proxy, **method `invoke` của invocation handler được gọi**, kèm theo **object `Method` và các argument của lời gọi gốc**. Invocation handler khi đó **phải tự quyết định xử lý lời gọi ra sao**.

---

## 6.5.2. Creating Proxy Objects

> *"To create a proxy object, use the newProxyInstance method of the Proxy class. The method has three parameters:"*
>
> *"A class loader. As part of the Java security model, different class loaders can be used for platform and application classes, classes that are downloaded from the Internet, and so on. We will discuss class loaders in Chapter 9 of Volume II. In this example, we specify the "system class loader" that loads platform and application classes."*
>
> *"An array of Class objects, one for each interface to be implemented."*
>
> *"An invocation handler."*

**Dịch:** Để tạo object proxy, dùng method **`newProxyInstance`** của class **`Proxy`**. Method này có **ba parameter**:

| # | Parameter |
|---|---|
| 1 | **Một class loader.** Trong mô hình bảo mật của Java, **các class loader khác nhau** được dùng cho class nền tảng và class ứng dụng, class tải từ Internet, v.v. (Class loader bàn ở Chapter 9 của Volume II.) Ví dụ này chỉ định **"system class loader"** — cái nạp class nền tảng và class ứng dụng |
| 2 | **Một [[09 - Arrays\|array]] các object `Class`**, mỗi cái cho một interface cần implement |
| 3 | **Một invocation handler** |

> *"There are two remaining questions. How do we define the handler? And what can we do with the resulting proxy object? The answers depend, of course, on the problem that we want to solve with the proxy mechanism. Proxies can be used for many purposes, such as"*
>
> *"Routing method calls to remote servers"*
>
> *"Associating user interface events with actions in a running program"*
>
> *"Tracing method calls for debugging purposes"*

**Dịch:** Còn **hai câu hỏi**: **định nghĩa handler thế nào**, và **làm được gì với object proxy thu được**? Câu trả lời tất nhiên **tuỳ vào bài toán** bạn muốn giải bằng cơ chế proxy. Proxy dùng được cho **nhiều mục đích**:

| Mục đích |
|---|
| **Định tuyến lời gọi method tới server ở xa** |
| **Gắn sự kiện giao diện người dùng với hành động** trong chương trình đang chạy |
| **Truy vết (trace) lời gọi method** để debug |

> *"In our example program, we use proxies and invocation handlers to trace method calls. We define a TraceHandler wrapper class that stores a wrapped object. Its invoke method simply prints the name and arguments of the method to be called and then calls the method with the wrapped object as the implicit argument."*

```java
class TraceHandler implements InvocationHandler
{
    private Object target;

    public TraceHandler(Object t)
    {
        target = t;
    }

    public Object invoke(Object proxy, Method m, Object[] args)
        throws Throwable
    {
        // print method name and arguments
        . . .
        // invoke actual method
        return m.invoke(target, args);
    }
}
```

**Dịch:** Chương trình ví dụ dùng proxy và invocation handler để **truy vết lời gọi method**. Ta định nghĩa class bọc **`TraceHandler`** lưu **object được bọc**. Method `invoke` của nó **in ra tên và argument của method sắp được gọi**, rồi **gọi method đó với object được bọc làm [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters|implicit argument]]**.

> *"Here is how you construct a proxy object that causes the tracing behavior whenever one of its methods is called:"*

```java
Object value = . . .;
// construct wrapper
var handler = new TraceHandler(value);
// construct proxy for one or more interfaces
var interfaces = new Class[] { Comparable.class };
Object proxy = Proxy.newProxyInstance(
    ClassLoader.getSystemClassLoader(),
    new Class[] { Comparable.class }, handler);
```

> *"Now, whenever a method from one of the interfaces is called on proxy, the method name and arguments are printed out and the method is then invoked on value."*

**Dịch:** Từ nay, mỗi khi một method thuộc một trong các interface được gọi lên `proxy`, **tên method và các argument được in ra**, rồi **method được gọi lên `value`**.

> *"In the program shown in Listing 6.10, we use proxy objects to trace a binary search. We fill an array with proxies to the integers 1 . . . 1000. Then we invoke the binarySearch method of the Arrays class to search for a random integer in the array. Finally, we print the matching element."*

```java
var elements = new Object[1000];
// fill elements with proxies for the integers 1 . . . 1000
for (int i = 0; i < elements.length; i++)
{
    Integer value = i + 1;
    elements[i] = Proxy.newProxyInstance(. . .); // proxy for value;
}
// construct a random integer
Integer key = (int) (Math.random() * elements.length) + 1;
// search for the key
int result = Arrays.binarySearch(elements, key);
// print match if found
if (result >= 0) System.out.println(elements[result]);
```

**Dịch:** Ở Listing 6.10, ta dùng object proxy để **truy vết một phép tìm kiếm nhị phân**: **điền vào array các proxy cho những số nguyên 1 . . . 1000**, rồi gọi method `binarySearch` của class `Arrays` để **tìm một số nguyên ngẫu nhiên trong array**, cuối cùng **in ra phần tử khớp**.

> *"The Integer class implements the Comparable interface. The proxy objects belong to a class that is defined at runtime. (It has a name such as $Proxy0.) That class also implements the Comparable interface. However, its compareTo method calls the invoke method of the proxy object’s handler."*

**Dịch:** Class `Integer` implement interface `Comparable`. Các object proxy **thuộc về một class được định nghĩa lúc runtime** (tên kiểu như **`$Proxy0`**). Class đó **cũng implement `Comparable`**, nhưng **method `compareTo` của nó gọi method `invoke` của handler thuộc object proxy**.

> **Note (sách):** *"As you saw earlier in this chapter, the Integer class actually implements Comparable\<Integer>. However, at runtime, all generic types are erased and the proxy is constructed with the class object for the raw Comparable class."*
>
> **Dịch:** Như đã thấy ở đầu chương, class `Integer` **thực ra implement `Comparable<Integer>`**. Tuy nhiên **lúc runtime mọi generic type đều bị xoá (erased)**, và proxy **được dựng với object class của `Comparable` dạng "raw"**.

> *"The binarySearch method makes calls like this:"*

```java
if (elements[i].compareTo(key) < 0) . . .
```

> *"Since we filled the array with proxy objects, the compareTo calls the invoke method of the TraceHandler class. That method prints the method name and arguments and then invokes compareTo on the wrapped Integer object."*

> *"Finally, at the end of the sample program, we call"*

```java
System.out.println(elements[result]);
```

> *"The println method calls toString on the proxy object, and that call is also redirected to the invocation handler."*

**Dịch:** Vì ta **điền array bằng object proxy**, nên `compareTo` **gọi method `invoke` của class `TraceHandler`** — method này in tên method cùng các argument rồi **gọi `compareTo` lên object `Integer` được bọc**. Cuối chương trình mẫu, `println` **gọi `toString` lên object proxy**, và **lời gọi đó cũng bị chuyển hướng tới invocation handler**.

> *"Here is the complete trace of a program run:"*

```
500.compareTo(288)
250.compareTo(288)
375.compareTo(288)
312.compareTo(288)
281.compareTo(288)
296.compareTo(288)
288.compareTo(288)
288.toString()
```

> *"You can see how the binary search algorithm homes in on the key by cutting the search interval in half in every step. Note that the toString method is proxied even though it does not belong to the Comparable interface—as you will see in the next section, certain Object methods are always proxied."*

**Dịch:** Thấy rõ **thuật toán tìm kiếm nhị phân dồn dần về key bằng cách cắt đôi khoảng tìm kiếm ở mỗi bước**. Chú ý **method `toString` cũng bị proxy dù nó không thuộc interface `Comparable`** — như mục sau sẽ thấy, **một số method của `Object` luôn luôn bị proxy**.

### Listing 6.10 — `proxy/ProxyTest.java`

```java
package proxy;

import java.lang.reflect.*;
import java.util.*;

/**
 * This program demonstrates the use of proxies.
 * @version 1.02 2021-06-16
 * @author Cay Horstmann
 */
public class ProxyTest
{
    public static void main(String[] args)
    {
        var elements = new Object[1000];

        // fill elements with proxies for the integers 1 . . . 1000
        for (int i = 0; i < elements.length; i++)
        {
            Integer value = i + 1;
            var handler = new TraceHandler(value);
            Object proxy = Proxy.newProxyInstance(
                ClassLoader.getSystemClassLoader(),
                new Class[] { Comparable.class }, handler);
            elements[i] = proxy;
        }

        // construct a random integer
        Integer key = (int) (Math.random() * elements.length) + 1;

        // search for the key
        int result = Arrays.binarySearch(elements, key);

        // print match if found
        if (result >= 0) System.out.println(elements[result]);
    }
}

/**
 * An invocation handler that prints out the method name and parameters, then
 * invokes the original method.
 */
class TraceHandler implements InvocationHandler
{
    private Object target;

    /**
     * Constructs a TraceHandler.
     * @param t the implicit parameter of the method call
     */
    public TraceHandler(Object t)
    {
        target = t;
    }

    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable
    {
        // print implicit argument
        System.out.print(target);
        // print method name
        System.out.print("." + m.getName() + "(");
        // print explicit arguments
        if (args != null)
        {
            for (int i = 0; i < args.length; i++)
            {
                System.out.print(args[i]);
                if (i < args.length - 1) System.out.print(", ");
            }
        }
        System.out.println(")");

        // invoke actual method
        return m.invoke(target, args);
    }
}
```

---

## 6.5.3. Properties of Proxy Classes

> *"Now that you have seen proxy classes in action, let's go over some of their properties. Remember that proxy classes are created on the fly in a running program. However, once they are created, they are regular classes, just like any other classes in the virtual machine."*

**Dịch:** Nhớ rằng **class proxy được tạo ra ngay tức thời trong chương trình đang chạy**. Tuy nhiên **một khi đã được tạo, chúng là class bình thường**, y như mọi class khác trong virtual machine.

> *"All proxy classes extend the class Proxy. A proxy class has only one instance field—the invocation handler, which is defined in the Proxy superclass. Any additional data required to carry out the proxy objects’ tasks must be stored in the invocation handler. For example, when we proxied Comparable objects in the program shown in Listing 6.10, the TraceHandler wrapped the actual objects."*

**Dịch:** **Mọi class proxy đều [[01 - Classes, Superclasses, and Subclasses|extend]] class `Proxy`.** Class proxy **chỉ có đúng một instance field** — chính là **invocation handler**, được định nghĩa ở superclass `Proxy`. **Mọi dữ liệu bổ sung** cần cho công việc của object proxy **phải được lưu trong invocation handler**.

> *"All proxy classes override the toString, equals, and hashCode methods of the Object class. Like all proxy methods, these methods simply call invoke on the invocation handler. The other methods of the Object class (such as clone and getClass) are not redefined."*

**Dịch:** **Mọi class proxy đều override `toString`, `equals` và `hashCode` của class `Object`.** Giống mọi method proxy khác, các method này **chỉ đơn giản gọi `invoke` lên invocation handler**. **Các method còn lại của `Object`** (như `clone` và `getClass`) **không bị định nghĩa lại**.

> *"The names of proxy classes are not defined. The Proxy class in Oracle’s virtual machine generates class names that begin with the string $Proxy."*

**Dịch:** **Tên của class proxy không được quy định.** Class `Proxy` trong virtual machine của Oracle **sinh ra tên class bắt đầu bằng chuỗi `$Proxy`**.

> *"There is only one proxy class for a particular class loader and ordered set of interfaces. That is, if you call the newProxyInstance method twice with the same class loader and interface array, you get two objects of the same class. You can also obtain that class with the getProxyClass method:"*

```java
Class proxyClass = Proxy.getProxyClass(null, interfaces);
```

**Dịch:** **Chỉ có duy nhất một class proxy cho một class loader và một tập interface có thứ tự cho trước.** Nghĩa là gọi `newProxyInstance` **hai lần với cùng class loader và cùng array interface** thì bạn **nhận về hai object của cùng một class**. Bạn cũng **lấy được class đó bằng method `getProxyClass`**.

> *"A proxy class is always public and final. If all interfaces that the proxy class implements are public, the proxy class does not belong to any particular package. Otherwise, all non-public interfaces must belong to the same package, and the proxy class will also belong to that package."*

> *"You can test whether a particular Class object represents a proxy class by calling the isProxyClass method of the Proxy class."*

**Dịch:** **Class proxy luôn là `public` và `final`.** Nếu **mọi interface** mà class proxy implement **đều `public`** thì class proxy **không thuộc package cụ thể nào**. Ngược lại, **mọi interface không public phải thuộc cùng một package**, và **class proxy cũng sẽ thuộc package đó**.

Kiểm tra xem một object `Class` có đại diện cho class proxy hay không bằng method **`isProxyClass`** của class `Proxy`.

> **Note (sách):** *"Calling a default method of a proxy triggers the invocation handler. To actually invoke the method, use the static invokeDefault method of the InvocationHandler interface. For example, here is an invocation handler that calls the default methods and passes the abstract methods to another target:"*
>
> ```java
> InvocationHandler handler = (proxy, method, args) ->
> {
>     if (method.isDefault())
>         return InvocationHandler.invokeDefault(proxy, method, args)
>     else
>         return method.invoke(target, args);
> }
> ```
>
> **Dịch:** Gọi một [[01 - Interfaces#6.1.5. Default Methods|default method]] của proxy sẽ **kích hoạt invocation handler**. Muốn **thực sự gọi method đó**, dùng **static method `invokeDefault`** của interface `InvocationHandler`. Ví dụ trên là một invocation handler **gọi các default method** và **chuyển các abstract method sang một target khác**.

---

## API — `java.lang.reflect.InvocationHandler` (Java 1.3)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Object invoke(Object proxy, Method method, Object[] args)` | Định nghĩa method này để chứa **hành động bạn muốn thực hiện mỗi khi một method được gọi lên object proxy**. |
| `static Object invokeDefault(Object proxy, Method method, Object... args)` *(Java 16)* | **Gọi một default method của instance proxy** với các argument đã cho, **bỏ qua invocation handler**. |

## API — `java.lang.reflect.Proxy` (Java 1.3)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Class<?> getProxyClass(ClassLoader loader, Class<?>... interfaces)` | Trả về **class proxy implement các interface đã cho**. |
| `static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler handler)` | Dựng **một instance mới của class proxy implement các interface đã cho**. **Mọi method đều gọi method `invoke` của object handler đã cho.** |
| `static boolean isProxyClass(Class<?> cl)` | Trả về **`true` nếu `cl` là một class proxy**. |

---

## Kết chương 6

> *"This ends the final chapter on the object-oriented features of the Java programming language. Interfaces, lambda expressions, and inner classes are concepts that you will encounter frequently, whereas cloning, service loaders, and proxies are advanced techniques that are of interest mainly to library designers and tool builders, not application programmers. You are now ready to learn how to deal with exceptional situations in your programs in Chapter 7."*

**Dịch:** Đây là **chương cuối về các tính năng object-oriented** của Java. **Interface, lambda expression và inner class** là những khái niệm bạn sẽ **gặp thường xuyên**; còn **cloning, service loader và proxy** là **kỹ thuật nâng cao**, chủ yếu dành cho **người thiết kế thư viện và người làm công cụ**, chứ không phải lập trình viên ứng dụng. Giờ bạn **đã sẵn sàng học cách xử lý các tình huống ngoại lệ** ở Chapter 7.

---

## Chương kế tiếp

→ [[01 - Dealing with Errors]] — cơ chế của Java để đối phó với dữ liệu xấu và code lỗi: exception, assertion và logging.
