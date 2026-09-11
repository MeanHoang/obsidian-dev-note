# 06 — Inheritance Rules for Generic Types

> Chapter 8, Section 8.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.6. Inheritance Rules for Generic Types

> *"When you work with generic classes, you need to learn a few rules about inheritance and subtypes. Let's start with a situation which many programmers find unintuitive. Consider a class and a subclass, such as Employee and Manager. Is Pair\<Manager> a subtype of Pair\<Employee>? Perhaps surprisingly, the answer is "no." For example, the following code will not compile:"*

```java
Pair<Employee> buddies = new Pair<Manager>(ceo, cfo); // illegal
```

> *"In general, there is no relationship between Pair\<S> and Pair\<T>, no matter how S and T are related (see Figure 8.1)."*

**Dịch:** Khi làm việc với generic class, bạn cần học vài quy tắc về **inheritance và subtype**. Hãy bắt đầu bằng một tình huống mà **nhiều lập trình viên thấy phản trực giác**. Xét một class và một subclass, ví dụ `Employee` và `Manager`. **`Pair<Manager>` có phải subtype của `Pair<Employee>` không?** Có lẽ hơi bất ngờ: câu trả lời là **"không"**. Nói chung, **không có quan hệ nào giữa `Pair<S>` và `Pair<T>`, bất kể `S` và `T` liên hệ với nhau ra sao**.

**Figure 8.1: No inheritance relationship between `Pair` classes**

```
    Employee            Pair<Employee> ┐
       △                               │
       │ extends                       ├─▷ no relationship!
       │                               │
    Manager             Pair<Manager>  ┘
```

> *"This seems like a cruel restriction, but it is necessary for type safety. Suppose we were allowed to convert a Pair\<Manager> to a Pair\<Employee>. Consider this code:"*

```java
var managerBuddies = new Pair<Manager>(ceo, cfo);
Pair<Employee> employeeBuddies = managerBuddies; // illegal, but suppose it wasn't
employeeBuddies.setFirst(lowlyEmployee);
```

> *"Clearly, the last statement is legal. But employeeBuddies and managerBuddies refer to the same object. We now managed to pair up the CFO with a lowly employee, which should not be possible for a Pair\<Manager>."*

**Dịch:** Đây có vẻ là một hạn chế **hà khắc**, nhưng nó **cần thiết cho type safety**. Giả sử ta được phép chuyển một `Pair<Manager>` thành `Pair<Employee>`. Rõ ràng câu lệnh cuối là hợp lệ. Nhưng `employeeBuddies` và `managerBuddies` **trỏ tới cùng một object**. Vậy là ta đã **ghép CFO với một nhân viên quèn**, điều **lẽ ra không thể xảy ra với một `Pair<Manager>`**.

> **Note (sách):** *"You just saw an important difference between generic types and Java arrays. You can assign a Manager[] array to a variable of type Employee[]:"*
>
> ```java
> Manager[] managerBuddies = { ceo, cfo };
> Employee[] employeeBuddies = managerBuddies; // OK
> ```
>
> *"However, arrays come with special protection. If you try to store a lowly employee into employeeBuddies[0], the virtual machine throws an ArrayStoreException."*
>
> **Dịch:** Bạn vừa thấy một **khác biệt quan trọng giữa generic type và array của Java**. Bạn **gán được** một array `Manager[]` vào biến kiểu `Employee[]`. Tuy nhiên, **array có cơ chế bảo vệ riêng**: nếu bạn thử lưu một nhân viên quèn vào `employeeBuddies[0]`, **virtual machine ném ra `ArrayStoreException`**.

Xem [[09 - Arrays]].

| | Chuyển `X<Manager>` → `X<Employee>` | Cơ chế chặn |
|---|---|---|
| **Generic type** (`Pair<T>`) | **không được phép** | **compile time** |
| **Array** (`Manager[]`) | **được phép** | **runtime** — `ArrayStoreException` |

### Chuyển sang raw type

> *"You can always convert a parameterized type to a raw type. For example, Pair\<Employee> is a subtype of the raw type Pair. This conversion is necessary for interfacing with legacy code."*

**Dịch:** Bạn **luôn chuyển được một parameterized type thành raw type**. Ví dụ, `Pair<Employee>` là **subtype của raw type `Pair`**. Việc chuyển đổi này **cần thiết để giao tiếp với legacy code**.

> *"Can you convert to the raw type and then cause a type error? Unfortunately, you can. Consider this example:"*

```java
var managerBuddies = new Pair<Manager>(ceo, cfo);
Pair rawBuddies = managerBuddies; // OK
rawBuddies.setFirst(new File(". . .")); // only a compile-time warning
```

> *"This sounds scary. However, keep in mind that you are no worse off than you were with older versions of Java. The security of the virtual machine is not at stake. When the foreign object is retrieved with getFirst and assigned to a Manager variable, a ClassCastException is thrown, just as in the good old days. You merely lose the added safety that generic programming normally provides."*

**Dịch:** Vậy chuyển sang raw type rồi **gây được lỗi type** không? Đáng tiếc là **có**. Nghe thì đáng sợ. Tuy nhiên, hãy nhớ rằng bạn **không tệ hơn so với các phiên bản Java cũ**. **An ninh của virtual machine không bị đe doạ.** Khi object lạ đó được lấy ra bằng `getFirst` và gán vào một biến `Manager`, một **`ClassCastException` được ném ra**, y hệt thời xưa. Bạn **chỉ mất đi phần an toàn tăng thêm mà generic programming thường mang lại**.

### Generic class extend/implement generic class khác

> *"Finally, generic classes can extend or implement other generic classes. In this regard, they are no different from ordinary classes. For example, the class ArrayList\<T> implements the interface List\<T>. That means an ArrayList\<Manager> can be converted to a List\<Manager>. However, as you just saw, an ArrayList\<Manager> is not an ArrayList\<Employee> or List\<Employee>. Figure 8.2 shows these relationships."*

**Dịch:** Cuối cùng, generic class **extend hoặc implement được generic class khác**. Ở khía cạnh này, chúng **không khác gì class thường**. Ví dụ, class `ArrayList<T>` implement interface `List<T>`. Nghĩa là một `ArrayList<Manager>` **chuyển được thành `List<Manager>`**. Tuy nhiên, như vừa thấy, một `ArrayList<Manager>` **không phải là `ArrayList<Employee>` cũng không phải `List<Employee>`**.

**Figure 8.2: Subtype relationships among generic list types**

```
                        «interface»
                         List (raw)
                        ▲    △    ▲
             ───────────┘    │    └───────────
             │                                │
      «interface»                       «interface»
      List<Manager>                    List<Employee>
             △                                △
             ┊ implements                     ┊ implements
             ┊         ArrayList (raw)        ┊
             ┊            ▲     ▲             ┊
             ┊     ┌──────┘     └──────┐      ┊
             ┊     │                   │      ┊
      ArrayList<Manager>  ┐      ArrayList<Employee>
                          └─▷ no relationship! ◁─┘

   ──▶ chuyển sang raw type      ┈▷ implements
```

---

## Bài kế tiếp

→ [[07 - Wildcard Types]] — `? extends`, `? super`, unbounded wildcard và wildcard capture.
