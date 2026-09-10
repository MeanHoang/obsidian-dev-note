# 03 — Generic Array Lists

> Chapter 5, Section 5.3 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.3. Generic Array Lists

> *"In some programming languages—in particular, in C and C++—you have to fix the sizes of all arrays at compile time. Programmers hate this because it forces them into uncomfortable tradeoffs. How many employees will be in a department? Surely no more than 100. What if there is a humongous department with 150 employees? Do we want to waste 90 entries for every department with just 10 employees?"*

**Dịch:** Ở một số ngôn ngữ — đặc biệt C và C++ — bạn phải **cố định kích thước mọi mảng lúc compile time**. Lập trình viên **ghét điều này** vì nó ép họ vào **những đánh đổi khó chịu**: một phòng ban có bao nhiêu employee? Chắc không quá 100. Thế nếu có phòng khổng lồ 150 người? Ta có muốn **phí 90 ô cho mỗi phòng chỉ 10 người** không?

> *"In Java, the situation is somewhat better. You can set the size of an array at runtime."*

```java
int actualSize = . . .;
var staff = new Employee[actualSize];
```

**Dịch:** Trong Java, tình hình **khá hơn**: bạn **đặt được kích thước [[09 - Arrays|mảng]] lúc runtime**.

> *"Of course, this code does not completely solve the problem of dynamically modifying arrays at runtime. Once you set the array size, you cannot change it easily. Instead, in Java you can deal with this common situation by using another Java class, called ArrayList. The ArrayList class is similar to an array, but it automatically adjusts its capacity as you add and remove elements, without any additional code."*

**Dịch:** Dĩ nhiên đoạn code này **chưa giải quyết trọn vẹn** vấn đề **sửa mảng động lúc runtime**: đặt kích thước xong thì **không đổi dễ dàng được**. Thay vào đó, Java xử lý tình huống phổ biến này bằng một class khác tên **`ArrayList`** — **giống mảng**, nhưng **tự động điều chỉnh capacity khi bạn thêm và bớt phần tử**, **không cần code thêm gì**.

> *"ArrayList is a generic class with a type parameter. To specify the type of the element objects that the array list holds, you append a class name enclosed in angle brackets, such as ArrayList<Employee>. You will see in Chapter 8 how to define your own generic class, but you don't need to know any of those technicalities to use the ArrayList type."*

**Dịch:** `ArrayList` là một **generic class có type parameter**. Để chỉ rõ **kiểu của các object phần tử** mà array list chứa, bạn **gắn thêm tên class trong ngoặc nhọn**, chẳng hạn `ArrayList<Employee>`. Cách **tự định nghĩa generic class** nằm ở chương 8, nhưng **không cần biết kỹ thuật đó để dùng kiểu `ArrayList`**.

---

## 5.3.1. Declaring Array Lists

> *"Here is how to declare and construct an array list that holds Employee objects:"*

```java
ArrayList<Employee> staff = new ArrayList<Employee>();
```

> *"It is a good idea to use the var keyword to avoid duplicating the class name:"*

```java
var staff = new ArrayList<Employee>();
```

> *"It you don't use the var keyword, you can omit the type argument on the right-hand side:"*

```java
ArrayList<Employee> staff = new ArrayList<>();
```

**Dịch:** Trên là cách khai báo và dựng một array list chứa object `Employee`. Nên dùng keyword [[03 - Defining Your Own Classes|`var`]] để **tránh lặp lại tên class**. Nếu **không dùng `var`**, bạn **bỏ được type argument ở vế phải**.

> *"This is called the "diamond" syntax because the empty brackets <> resemble a diamond. Use the diamond syntax together with the new operator. The compiler checks what happens to the new value. If it is assigned to a variable, passed into a method, or returned from a method, then the compiler checks the generic type of the variable, parameter, or method. It then places that type into the <>. In our example, the new ArrayList<>() is assigned to a variable of type ArrayList<Employee>. Therefore, the generic type is Employee."*

**Dịch:** Đây gọi là **cú pháp "diamond"** vì cặp ngoặc rỗng `<>` **trông giống viên kim cương**. Dùng cú pháp diamond **cùng với toán tử `new`**. Compiler **xem giá trị mới được dùng làm gì**: nếu nó **được gán cho một biến, truyền vào một method, hoặc trả về từ một method** thì compiler **kiểm tra generic type của biến/parameter/method** đó rồi **đặt kiểu đó vào `<>`**.

> **Caution (sách):** *"If you declare an ArrayList with var, do not use the diamond syntax. The declaration"*
>
> ```java
> var elements = new ArrayList<>();
> ```
>
> *"yields an ArrayList<Object>."*
>
> **Dịch:** Nếu khai báo `ArrayList` bằng `var` thì **đừng dùng cú pháp diamond**: khai báo trên **cho ra `ArrayList<Object>`**.

> **Note (sách):** *"Before Java 5, there were no generic classes. Instead, there was a single ArrayList class, a one-size-fits-all collection holding elements of type Object. You can still use ArrayList without a <. . .> suffix. It is considered a "raw" type, with the type parameter erased."*
>
> **Dịch:** **Trước Java 5 không có generic class.** Chỉ có **một class `ArrayList` duy nhất**, một collection **"một cỡ vừa cho tất cả"** chứa phần tử kiểu `Object`. Bạn **vẫn dùng được `ArrayList` không có hậu tố `<...>`** — nó được coi là **kiểu "raw"**, với **type parameter bị xoá đi**.

> **Note (sách):** *"In even older versions of Java, programmers used the Vector class for dynamic arrays. However, the ArrayList class is more efficient, and there is no longer any good reason to use the Vector class."*
>
> **Dịch:** Ở các phiên bản Java **còn cũ hơn nữa**, lập trình viên dùng class **`Vector`** cho mảng động. Nhưng **`ArrayList` hiệu quả hơn**, và **không còn lý do chính đáng nào để dùng `Vector`**.

> *"Use the add method to add new elements to an array list. For example, here is how you populate an array list with Employee objects:"*

```java
staff.add(new Employee("Harry Hacker", . . .));
staff.add(new Employee("Tony Tester", . . .));
```

**Dịch:** Dùng method **`add`** để thêm phần tử mới vào array list.

> *"The array list manages an internal array of object references. Eventually, that array will run out of space. This is where array lists work their magic: If you call add and the internal array is full, the array list automatically creates a bigger array and copies all the objects from the smaller to the bigger array."*

**Dịch:** Array list **quản lý một mảng nội bộ chứa các object reference**. Rốt cuộc mảng đó **sẽ hết chỗ**. Đây là chỗ array list **giở phép màu**: nếu bạn gọi `add` mà mảng nội bộ đã đầy, array list **tự động tạo một mảng lớn hơn** và **copy mọi object từ mảng nhỏ sang mảng lớn**.

> *"If you already know, or have a good guess, how many elements you want to store, call the ensureCapacity method before filling the array list:"*

```java
staff.ensureCapacity(100);
```

> *"That call allocates an internal array of 100 objects. Then, the first 100 calls to add will not involve any costly reallocation."*

> *"You can also pass an initial capacity to the ArrayList constructor:"*

```java
ArrayList<Employee> staff = new ArrayList<>(100);
```

**Dịch:** Nếu bạn **đã biết, hoặc đoán tốt được**, số phần tử cần lưu, hãy gọi **`ensureCapacity`** trước khi đổ dữ liệu. Lời gọi đó **cấp phát mảng nội bộ chứa 100 object**; sau đó **100 lời gọi `add` đầu tiên không phải cấp phát lại tốn kém**. Bạn cũng **truyền được initial capacity vào constructor của `ArrayList`**.

> **Caution (sách):** *"Allocating an array list as"*
>
> ```java
> new ArrayList<>(100) // capacity is 100
> ```
>
> *"is not the same as allocating a new array as"*
>
> ```java
> new Employee[100] // size is 100
> ```
>
> *"There is an important distinction between the capacity of an array list and the size of an array. If you allocate an array with 100 entries, then the array has 100 slots, ready for use. An array list with a capacity of 100 elements has the potential of holding 100 elements (and, in fact, more than 100, at the cost of additional reallocations)—but at the beginning, even after its initial construction, an array list holds no elements at all."*
>
> **Dịch:** Cấp phát array list **không giống** cấp phát mảng. Có **phân biệt quan trọng giữa capacity của array list và size của mảng**: cấp phát một mảng 100 ô thì mảng **có sẵn 100 chỗ, dùng được ngay**. Một array list **capacity 100** thì **có tiềm năng chứa 100 phần tử** (thực ra **hơn 100 cũng được**, đổi lại là **thêm các lần cấp phát lại**) — nhưng **lúc đầu, ngay cả sau khi vừa dựng xong, array list chẳng chứa phần tử nào cả**.

> *"The size method returns the actual number of elements in the array list. For example,"*

```java
staff.size()
```

> *"returns the current number of elements in the staff array list. This is the equivalent of"*

```java
a.length
```

> *"for an array a."*

**Dịch:** Method **`size`** trả về **số phần tử thực tế** trong array list — tương đương **`a.length`** của một mảng `a`.

> *"Once you are reasonably sure that the array list is at its permanent size, you can call the trimToSize method. This method adjusts the size of the memory block to use exactly as much storage space as is required to hold the current number of elements. The garbage collector will reclaim any excess memory."*

**Dịch:** Khi đã **khá chắc rằng array list đã đạt kích thước cố định**, bạn gọi được **`trimToSize`**. Method này **chỉnh kích thước khối bộ nhớ để dùng đúng bằng lượng cần thiết** cho số phần tử hiện tại. **Garbage collector sẽ thu hồi phần bộ nhớ dư.**

> *"Once you trim the size of an array list, adding new elements will move the block again, which takes time. You should only use trimToSize when you are sure you won't add any more elements to the array list."*

**Dịch:** Khi đã trim rồi, **thêm phần tử mới sẽ lại dời khối bộ nhớ**, và việc đó **tốn thời gian**. **Chỉ dùng `trimToSize` khi chắc chắn sẽ không thêm phần tử nào nữa.**

> **C++ Note (sách):** *"The ArrayList class is similar to the C++ vector template. Both ArrayList and vector are generic types. But the C++ vector template overloads the [] operator for convenient element access. Java does not have operator overloading, so it must use explicit method calls instead. Moreover, C++ vectors are copied by value. If a and b are two vectors, then the assignment a = b makes a into a new vector with the same length as b, and all elements are copied from b to a. The same assignment in Java makes both a and b refer to the same array list."*
>
> **Dịch:** `ArrayList` **tương tự template `vector` của C++**; cả hai đều là generic type. Nhưng `vector` của C++ **overload toán tử `[]`** để truy cập phần tử tiện lợi. **Java không có operator overloading**, nên **phải dùng lời gọi method tường minh**. Hơn nữa, **vector C++ được copy theo giá trị**: `a = b` biến `a` thành **vector mới cùng độ dài với `b`** và **copy mọi phần tử**. **Phép gán y hệt trong Java làm cả `a` và `b` trỏ tới cùng một array list.**

## API — `java.util.ArrayList<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `ArrayList<E>()` | Dựng một **array list rỗng**. |
| `ArrayList<E>(int initialCapacity)` | Dựng một **array list rỗng với capacity chỉ định**. |
| `boolean add(E obj)` | **Nối `obj` vào cuối** array list. **Luôn trả về `true`.** |
| `int size()` | Trả về **số phần tử hiện đang lưu** trong array list. (Dĩ nhiên số này **không bao giờ lớn hơn capacity**.) |
| `void ensureCapacity(int capacity)` | Đảm bảo array list **có đủ capacity để lưu số phần tử cho trước mà không phải cấp phát lại** mảng lưu trữ nội bộ. |
| `void trimToSize()` | **Giảm capacity lưu trữ của array list về đúng size hiện tại.** |

---

## 5.3.2. Accessing Array List Elements

> *"Unfortunately, nothing comes for free. The automatic growth convenience of array lists requires a more complicated syntax for accessing the elements. The reason is that the ArrayList class is not a part of the Java programming language; it is just a utility class programmed by someone and supplied in the standard library."*

**Dịch:** Tiếc là **chẳng có gì miễn phí**. Sự tiện lợi **tự động lớn lên** của array list đòi hỏi **cú pháp truy cập phần tử phức tạp hơn**. Lý do: **`ArrayList` không phải một phần của ngôn ngữ Java**; nó chỉ là **một utility class do ai đó lập trình** và cung cấp trong thư viện chuẩn.

> *"Instead of the pleasant [] syntax to access or change the element of an array, you use the get and set methods."*

> *"For example, to set the ith element, use"*

```java
staff.set(i, harry);
```

> *"This is equivalent to"*

```java
a[i] = harry;
```

> *"for an array a. (As with arrays, the index values are zero-based.)"*

**Dịch:** Thay cho **cú pháp `[]` dễ chịu**, bạn dùng method **`get`** và **`set`**. (Cũng như mảng, **chỉ số bắt đầu từ 0**.)

> **Caution (sách):** *"Do not call list.set(i, x) until the size of the array list is larger than i. For example, the following code is wrong:"*
>
> ```java
> var list = new ArrayList<Employee>(100); // capacity 100, size 0
> list.set(0, x); // no element 0 yet
> ```
>
> *"Use the add method instead of set to fill up an array, and use set only to replace a previously added element."*
>
> **Dịch:** **Đừng gọi `list.set(i, x)` chừng nào size của array list chưa lớn hơn `i`.** Dùng **`add` để đổ đầy**, và **chỉ dùng `set` để thay thế một phần tử đã được thêm trước đó**.

> *"To get an array list element, use"*

```java
Employee e = staff.get(i);
```

> *"This is equivalent to"*

```java
Employee e = a[i];
```

> **Note (sách):** *"When there were no generic classes, the get method of the raw ArrayList class had no choice but to return an Object. Consequently, callers of get had to cast the returned value to the desired type:"*
>
> ```java
> Employee e = (Employee) staff.get(i);
> ```
>
> *"The raw ArrayList is also a bit dangerous. Its add and set methods accept objects of any type. A call"*
>
> ```java
> staff.set(i, "Harry Hacker");
> ```
>
> *"compiles without so much as a warning, and you run into grief only when you retrieve the object and try to cast it. If you use an ArrayList<Employee> instead, the compiler will detect this error."*
>
> **Dịch:** Khi chưa có generic class, method `get` của `ArrayList` raw **không còn lựa chọn nào ngoài trả về `Object`**, nên người gọi `get` **phải cast giá trị trả về về kiểu mong muốn**. `ArrayList` raw còn **hơi nguy hiểm**: method `add` và `set` của nó **nhận object thuộc bất kỳ kiểu nào**. Lời gọi trên **biên dịch trót lọt, không một lời cảnh báo**, và bạn **chỉ gặp khổ khi lấy object ra và cố cast**. Dùng `ArrayList<Employee>` thì **compiler phát hiện được lỗi này**.

> *"You can sometimes get the best of both worlds—flexible growth and convenient element access—with the following trick. First, make an array list and add all the elements:"*

```java
var list = new ArrayList<X>();
while (. . .)
{
    x = . . .;
    list.add(x);
}
```

> *"When you are done, use the toArray method to copy the elements into an array:"*

```java
var a = new X[list.size()];
list.toArray(a);
```

**Dịch:** Đôi khi bạn **được cả hai điều tốt nhất** — **lớn lên linh hoạt** và **truy cập phần tử tiện lợi** — bằng mẹo trên: **tạo array list và add hết phần tử**, xong rồi dùng **`toArray`** để **copy các phần tử vào một mảng**.

> *"Sometimes, you need to add elements in the middle of an array list. Use the add method with an index argument:"*

```java
int n = staff.size() / 2;
staff.add(n, e);
```

> *"The elements at locations n and above are shifted up to make room for the new entry. If the new size of the array list after the insertion exceeds the capacity, the array list reallocates its storage array."*

**Dịch:** Đôi khi cần **thêm phần tử vào giữa** array list — dùng `add` **kèm argument chỉ số**. Các phần tử **ở vị trí `n` trở lên bị đẩy lên** để lấy chỗ cho mục mới. Nếu **size mới sau khi chèn vượt quá capacity**, array list **cấp phát lại mảng lưu trữ**.

> *"Similarly, you can remove an element from the middle of an array list:"*

```java
Employee e = staff.remove(n);
```

> *"The elements located above it are copied down, and the size of the array is reduced by one."*

**Dịch:** Tương tự, **gỡ được phần tử ở giữa** array list. Các phần tử **nằm trên nó bị copy dịch xuống**, và **size của mảng giảm đi một**.

> *"Inserting and removing elements is not terribly efficient. It is probably not worth worrying about for small array lists. But if you store many elements and frequently insert and remove in the middle of a collection, consider using a linked list instead. I explain how to program with linked lists in Chapter 9."*

**Dịch:** **Chèn và gỡ phần tử không hiệu quả cho lắm.** Với array list nhỏ thì **chắc chẳng đáng lo**. Nhưng nếu bạn lưu **nhiều phần tử** và **thường xuyên chèn/gỡ ở giữa** collection thì **cân nhắc dùng linked list** — trình bày ở chương 9.

> *"You can use the "for each" loop to traverse the contents of an array list:"*

```java
for (Employee e : staff)
    do something with e
```

> *"This loop has the same effect as"*

```java
for (int i = 0; i < staff.size(); i++)
{
    Employee e = staff.get(i);
    do something with e
}
```

**Dịch:** Bạn dùng được [[07 - Control Flow|vòng lặp "for each"]] để **duyệt nội dung của array list** — hiệu quả giống hệt vòng `for` truyền thống ở trên.

> *"Listing 5.7 is a modification of the EmployeeTest program of Chapter 4. The Employee[] array is replaced by an ArrayList<Employee>. Note the following changes:"*
> *"You don't have to specify the array size."*
> *"You use add to add as many elements as you like."*
> *"You use size() instead of length to count the number of elements."*
> *"You use a.get(i) instead of a[i] to access an element."*

**Dịch:** Listing 5.7 là bản sửa của chương trình `EmployeeTest` ở chương 4: mảng `Employee[]` được thay bằng `ArrayList<Employee>`. Các thay đổi:

| Thay đổi |
|---|
| **Không phải chỉ định kích thước mảng** |
| Dùng **`add`** để thêm **bao nhiêu phần tử tuỳ thích** |
| Dùng **`size()`** thay cho **`length`** để đếm số phần tử |
| Dùng **`a.get(i)`** thay cho **`a[i]`** để truy cập phần tử |

### Listing 5.7 — `arrayList/ArrayListTest.java`

```java
package arrayList;

import java.util.*;

/**
 * This program demonstrates the ArrayList class.
 * @version 1.11 2012-01-26
 * @author Cay Horstmann
 */
public class ArrayListTest
{
    public static void main(String[] args)
    {
        // fill the staff array list with three Employee objects
        var staff = new ArrayList<Employee>();

        staff.add(new Employee("Carl Cracker", 75000, 1987, 12, 15));
        staff.add(new Employee("Harry Hacker", 50000, 1989, 10, 1));
        staff.add(new Employee("Tony Tester", 40000, 1990, 3, 15));

        // raise everyone's salary by 5%
        for (Employee e : staff)
            e.raiseSalary(5);

        // print out information about all Employee objects
        for (Employee e : staff)
            System.out.println("name=" + e.getName() + ",salary=" + e.getSalary() + ",hireDay="
                + e.getHireDay());
    }
}
```

## API — `java.util.ArrayList<E>` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `E set(int index, E obj)` | Đặt giá trị `obj` vào array list **tại index chỉ định**, **trả về nội dung cũ**. |
| `E get(int index)` | Lấy **giá trị lưu tại index chỉ định**. |
| `void add(int index, E obj)` | **Đẩy các phần tử lên** để **chèn `obj` tại index chỉ định**. |
| `E remove(int index)` | **Gỡ phần tử tại index cho trước** và **dịch xuống mọi phần tử nằm trên nó**. **Phần tử bị gỡ được trả về.** |

---

## 5.3.3. Compatibility between Typed and Raw Array Lists

> *"In your own code, you will always want to use type parameters for added safety. In this section, you will see how to interoperate with legacy code that does not use type parameters."*

**Dịch:** Trong code của mình, bạn **luôn muốn dùng type parameter cho an toàn hơn**. Phần này nói cách **làm việc chung với code cũ không dùng type parameter**.

> *"Suppose you have the following legacy class:"*

```java
public class EmployeeDB
{
    public void update(ArrayList list) { . . . }
    public ArrayList find(String query) { . . . }
}
```

> *"You can pass a typed array list to the update method without any casts."*

```java
ArrayList<Employee> staff = . . .;
employeeDB.update(staff);
```

> *"The staff object is simply passed to the update method."*

**Dịch:** Bạn **truyền được một array list có kiểu vào method `update` mà không cần cast nào**. Object `staff` **đơn giản được truyền vào `update`**.

> **Caution (sách):** *"Even though you get no error or warning from the compiler, this call is not completely safe. The update method might add elements into the array list that are not of type Employee. When these elements are retrieved, an exception occurs. This sounds scary, but if you think about it, the behavior is simply as it was before generics were added to Java. The integrity of the virtual machine is never jeopardized. In this situation, you do not lose security, but you also do not benefit from the compile-time checks."*
>
> **Dịch:** Dù **không có lỗi hay cảnh báo nào từ compiler**, lời gọi này **không hoàn toàn an toàn**: `update` **có thể thêm vào array list các phần tử không thuộc kiểu `Employee`**, và **khi lấy chúng ra thì sinh exception**. Nghe đáng sợ, nhưng nghĩ kỹ thì **hành vi đó y như trước khi generic được thêm vào Java**. **Tính toàn vẹn của virtual machine không bao giờ bị đe doạ.** Trong tình huống này bạn **không mất an toàn**, nhưng **cũng không hưởng lợi từ các kiểm tra lúc compile-time**.

> *"Conversely, when you assign a raw ArrayList to a typed one, you get a warning."*

```java
ArrayList<Employee> result = employeeDB.find(query); // yields warning
```

**Dịch:** Ngược lại, khi **gán một `ArrayList` raw cho một array list có kiểu**, bạn **nhận được cảnh báo**.

> **Note (sách):** *"To see the text of the warning, compile with the option -Xlint:unchecked."*
>
> **Dịch:** Để **xem nội dung cảnh báo**, biên dịch với option **`-Xlint:unchecked`**.

> *"Using a cast does not make the warning go away."*

```java
ArrayList<Employee> result = (ArrayList<Employee>) employeeDB.find(query);
    // yields another warning
```

> *"Instead, you get a different warning, telling you that the cast is misleading."*

**Dịch:** **Dùng cast không làm cảnh báo biến mất** — bạn **nhận một cảnh báo khác**, báo rằng **cast đó gây hiểu lầm**.

> *"This is the consequence of a somewhat unfortunate limitation of generic types in Java. For compatibility, the compiler translates all typed array lists into raw ArrayList objects after checking that the type rules were not violated. In a running program, all array lists are the same—there are no type parameters in the virtual machine. Thus, the casts (ArrayList) and (ArrayList<Employee>) carry out identical runtime checks."*

**Dịch:** Đây là **hệ quả của một giới hạn khá đáng tiếc của generic type trong Java**. Vì **khả năng tương thích**, compiler **dịch mọi typed array list thành object `ArrayList` raw** sau khi kiểm tra rằng **quy tắc kiểu không bị vi phạm**. **Trong chương trình đang chạy, mọi array list đều như nhau — không có type parameter nào trong virtual machine.** Vì thế cast `(ArrayList)` và `(ArrayList<Employee>)` **thực hiện các kiểm tra runtime y hệt nhau**.

> *"There isn't much you can do about that situation. When you interact with legacy code, study the compiler warnings and satisfy yourself that the warnings are not serious."*

> *"Once you are satisfied, you can tag the variable that receives the cast with the @SuppressWarnings("unchecked") annotation, like this:"*

```java
@SuppressWarnings("unchecked") ArrayList<Employee> result
    = (ArrayList<Employee>) employeeDB.find(query); // yields another warning
```

**Dịch:** **Chẳng làm được gì nhiều** với tình huống đó. Khi tương tác với code cũ, hãy **nghiên cứu các cảnh báo của compiler** và **tự thoả mãn rằng chúng không nghiêm trọng**. Khi đã yên tâm, bạn **gắn nhãn `@SuppressWarnings("unchecked")`** cho biến nhận kết quả cast.

---

## Bài kế tiếp

→ [[04 - Object Wrappers and Autoboxing]] — class wrapper cho primitive type và cơ chế tự động đóng/mở hộp giá trị.
