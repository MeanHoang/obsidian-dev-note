# 01 — Introduction to Object-Oriented Programming

> Chapter 4, Section 4.1 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Phần bổ sung ngoài sách được đánh dấu rõ bằng callout "Ngoài sách".

---

## 4.1. Introduction to Object-Oriented Programming 

> *"Object-oriented programming, or OOP for short, is the dominant programming paradigm these days, having replaced the "structured" or procedural programming techniques that were developed in the 1970s. Since Java is object-oriented, you have to be familiar with OOP to become productive with Java."*

**Dịch:** OOP là paradigm thống trị hiện nay, thay thế cho kỹ thuật lập trình "structured" hay procedural phát triển từ thập niên 1970. Java là ngôn ngữ object-oriented, nên phải quen với OOP mới làm việc hiệu quả được.

> [!note] Ngoài sách — paradigm là gì?
> Sách dùng chữ "paradigm" mà không định nghĩa. Định nghĩa lấy từ Wikipedia, *Programming paradigm*:
>
> > *"A programming paradigm is a relatively high-level way to conceptualize and structure the implementation of a computer program."*
>
> **Dịch:** Paradigm là một cách **ở mức tương đối cao** để hình dung và tổ chức việc implement một chương trình. Tức nó nói về **cách cấu trúc chương trình**, không phải cú pháp của một ngôn ngữ cụ thể.
>
> Các paradigm phổ biến, mô tả nguyên văn theo cùng trang đó:
>
> | Paradigm | Nguyên văn | Dịch |
> |---|---|---|
> | **Imperative** | *"code directly controls execution flow and state change, explicit statements that change a program state"* | code điều khiển trực tiếp luồng chạy và việc đổi state, bằng các câu lệnh tường minh làm thay đổi state chương trình |
> | **Procedural** | *"organized as procedures that call each other"* | tổ chức thành các procedure gọi lẫn nhau |
> | **Object-oriented** | *"organized as objects that contain both data structure and associated behavior"* | tổ chức thành các object chứa **cả** data structure lẫn behavior đi kèm |
> | **Declarative** | *"code declares properties of the desired result, but not how to compute it"* | code khai báo **tính chất của kết quả mong muốn**, không khai báo cách tính ra nó |
> | **Functional** | *"a desired result is declared as the value of a series of function evaluations"* | kết quả mong muốn được khai báo như giá trị của một chuỗi lời gọi hàm |
>
> Nguồn: [Programming paradigm — Wikipedia](https://en.wikipedia.org/wiki/Programming_paradigm)


> *"An object-oriented program is made of objects. Each object has a specific functionality, exposed to its users, and a hidden implementation. Many objects in your programs will be taken "off-the-shelf" from a library; others will be custom-designed. Whether you build an object or use a pre-built one it might depend on your budget or time. But, basically, as long as an object satisfies your specifications, you don't care how the functionality is implemented."*

**Dịch:** Chương trình OOP được tạo thành từ các object. Mỗi object có một phần chức năng **lộ ra** cho người dùng, và phần **implementation bị giấu đi**. Nhiều object lấy sẵn từ library, một số tự thiết kế. Miễn là object đáp ứng đúng đặc tả, bạn không cần quan tâm chức năng đó được implement thế nào.

### Thứ tự ngược so với procedural

> *"Traditional structured programming consists of designing a set of procedures (or algorithms) to solve a problem. Once the procedures are determined, the traditional next step was to find appropriate ways to store the data. This is why the designer of the Pascal language, Niklaus Wirth, called his famous book on programming Algorithms + Data Structures = Programs (Prentice Hall, 1976). Notice that in Wirth's title, algorithms come first, and data structures second. This reflects the way programmers worked at that time. First, they decided on the procedures for manipulating the data; then, they decided what structure to impose on the data to make the manipulations easier. OOP reverses the order: puts the data first, then looks at the algorithms to operate on the data."*

**Dịch:** Lập trình structured truyền thống là thiết kế một bộ procedure (thuật toán) để giải bài toán. Xong procedure rồi mới tìm cách lưu data. Đó là lý do Niklaus Wirth, cha đẻ Pascal, đặt tên sách là *Algorithms + Data Structures = Programs* (1976) — **algorithm đứng trước, data structure đứng sau**. OOP **đảo ngược thứ tự**: đặt data trước, rồi mới xét thuật toán thao tác trên data đó.

```
Procedural:   Algorithms  →  Data Structures
OOP:          Data        →  Algorithms
```

### Vì sao OOP hợp với bài toán lớn

> *"For small problems, the breakdown into procedures works very well. But objects are more appropriate for larger problems. Consider a simple web browser. It might require 2,000 procedures for its implementation, all of which manipulate a set of global data. In the object-oriented style, there might be 100 classes with an average of 20 methods per class (see Figure 4.1). This structure is much easier for a programmer to grasp. It is also much easier to find bugs in. Suppose the data of a particular object is in an incorrect state. It is far easier to search for the culprit among the 20 methods that had access to that data item than among 2,000 procedures."*

**Dịch:** Bài toán nhỏ thì chia thành procedure vẫn tốt. Bài toán lớn thì object hợp hơn. Ví dụ một web browser đơn giản: kiểu procedural cần khoảng **2.000 procedure**, tất cả cùng thao tác lên một mớ global data. Kiểu OOP thì khoảng **100 class, trung bình 20 method/class**. Cấu trúc này dễ nắm hơn, và **dễ tìm bug hơn**: khi data của một object sai trạng thái, tìm thủ phạm trong 20 method có quyền đụng vào data đó dễ hơn nhiều so với lục 2.000 procedure.

**Figure 4.1: Procedural vs. OO programming**

```
Procedural                          Object-Oriented
┌──────────────────────────┐        ┌─────────┐ ┌─────────┐ ┌─────────┐
│   ~2000 procedures       │        │ Class A │ │ Class B │ │ Class C │
│   ↓  ↓  ↓  ↓  ↓  ↓  ↓    │        │ 20 meth │ │ 20 meth │ │ 20 meth │
│ ┌──────────────────────┐ │        │ + data  │ │ + data  │ │ + data  │
│ │    GLOBAL DATA       │ │        └─────────┘ └─────────┘ └─────────┘
│ └──────────────────────┘ │             ... 100 class, data nằm trong class
└──────────────────────────┘
 Mọi procedure đụng chung data      Chỉ 20 method đụng được data của class đó
```

---

## 4.1.1. Classes

> *"A class specifies how objects are made. Think of classes as cookie cutters; objects are the cookies themselves. When you construct an object from a class, you are said to have created an instance of the class."*

**Dịch:** Class quy định object được tạo ra như thế nào. Sách ví class là **khuôn cắt bánh**, object là **cái bánh**. Dựng một object từ class thì gọi là tạo ra một **instance** của class đó.

> *"As you have seen, all code that you write in Java is inside a class. The standard Java library supplies several thousand classes for such diverse purposes as user interface design, dates and calendars, and network programming. Nonetheless, in Java you still have to create your own classes to describe the objects of your application's problem domain."*

**Dịch:** Mọi code Java bạn viết đều nằm trong một class. Standard library cung cấp vài nghìn class (UI, date/calendar, network...), nhưng vẫn phải tự viết class để mô tả các object thuộc **problem domain** của ứng dụng.

### Encapsulation

> *"Encapsulation (sometimes called information hiding) is a key concept in working with objects. Formally, encapsulation is simply combining data and behavior in one package and hiding the implementation details from the users of the object. The bits of data in an object are called its instance fields, and the procedures that operate on the data are called its methods. A specific object that is an instance of a class will have specific values of its instance fields. The set of those values is the current state of the object. Whenever you invoke a method on an object, its state may change."*

**Dịch:** **Encapsulation** (còn gọi là information hiding) là khái niệm cốt lõi. Định nghĩa chính thức: gộp **data** và **behavior** vào chung một gói, rồi giấu chi tiết implementation khỏi người dùng object.

| Thuật ngữ | Là gì |
|---|---|
| **instance field** | các mẩu data bên trong object |
| **method** | các procedure thao tác lên data đó |
| **state** | tập hợp **giá trị cụ thể** của các instance field tại một thời điểm |

Gọi method lên object thì state của nó **có thể** thay đổi.

> *"The key to making encapsulation work is to have methods never directly access instance fields in a class other than their own. Programs should interact with object data only through the object's methods. Encapsulation is the way to give an object its "black box" behavior, which is the key to reuse and reliability. This means a class may totally change how it stores its data, but as long as it continues to use the same methods to manipulate the data, no other object will know or care."*

**Dịch:** Chìa khoá để encapsulation hoạt động: **method không bao giờ truy cập trực tiếp instance field của class khác**. Chương trình chỉ được đụng vào data của object thông qua method của chính object đó. Encapsulation cho object hành vi **"black box"**, và đó là chìa khoá của reuse với reliability. Hệ quả: class có thể **đổi hoàn toàn cách lưu data**, miễn giữ nguyên bộ method thao tác, thì object khác chả biết mà cũng chả cần quan tâm.

```
        ┌─────────────────────────────┐
        │          Object             │
  gọi   │  ┌───────────────────────┐  │
 ─────► │  │  method (public)      │  │   ← chỉ lối này vào được
        │  └───────────┬───────────┘  │
        │              ▼              │
        │  ┌───────────────────────┐  │
        │  │ instance field (giấu) │  │   ← không ai bên ngoài đụng thẳng
        │  └───────────────────────┘  │
        └─────────────────────────────┘
```

### Inheritance

> *"When you start writing your own classes in Java, another tenet of OOP will make this easier: Classes can be built by extending other classes. Java, in fact, comes with a "cosmic superclass" called Object. All other classes extend this class. You will learn more about the Object class in the next chapter. When you extend an existing class, the new class has all the properties and methods of the class that you extend. You then supply new methods and instance fields that apply to your new class only. The concept of extending a class to obtain another class is called inheritance."*

**Dịch:** Class dựng được bằng cách **extend** class khác. Java có sẵn một **"cosmic superclass"** tên là `Object`, mọi class khác đều extend class này. Khi extend một class có sẵn, class mới có toàn bộ property và method của class được extend; bạn chỉ cần bổ sung thêm method và instance field riêng. Khái niệm extend class để lấy ra class khác gọi là **inheritance**. Chi tiết ở Chapter 5.

---

## 4.1.2. Objects

> *"To work with OOP, you should be able to identify three key characteristics of objects:*
> - *The object's behavior—what can you do with this object, or what methods can you apply to it?*
> - *The object's state—how does the object react when you invoke those methods?*
> - *The object's identity—how is the object distinguished from others that may have the same behavior and state?"*

**Dịch:** Ba đặc điểm cốt lõi của object:

| Đặc điểm | Câu hỏi |
|---|---|
| **behavior** | làm được gì với object này, gọi được method nào lên nó? |
| **state** | object phản ứng ra sao khi gọi những method đó? |
| **identity** | object này phân biệt với object khác bằng gì, kể cả khi cùng behavior và cùng state? |

> *"All objects that are instances of the same class share a family resemblance by supporting the same behavior. The behavior of an object is defined by the methods that you can call."*

**Dịch:** Mọi object là instance của cùng một class thì giống nhau ở chỗ hỗ trợ **cùng behavior**. Behavior được định nghĩa bởi tập method gọi được.

> *"Next, each object stores information about what it currently looks like. This is the object's state. An object's state may change over time, but not spontaneously. A change in the state of an object must be a consequence of method calls. (If an object's state changed without a method call on that object, someone broke encapsulation.)"*

**Dịch:** Mỗi object lưu thông tin về hình dạng hiện tại của nó, đó là **state**. State thay đổi được theo thời gian, nhưng **không tự dưng đổi** — mọi thay đổi state phải là hệ quả của một lời gọi method. Nếu state đổi mà chả có method nào được gọi lên object đó, thì **ai đó đã phá vỡ encapsulation**.

> *"However, the state of an object does not completely describe it, because each object has a distinct identity. For example, in an order processing system, two orders are distinct even if they request identical items. Notice that the individual objects that are instances of a class always differ in their identity and usually differ in their state."*

**Dịch:** State chưa mô tả hết object, vì mỗi object có **identity riêng biệt**. Ví dụ trong hệ thống xử lý đơn hàng, hai order là hai thứ khác nhau kể cả khi đặt y hệt các item giống nhau. Các object cùng class **luôn khác nhau về identity**, và **thường** khác nhau về state.

> *"These key characteristics can influence each other. For example, the state of an object can influence its behavior. (If an order is "shipped" or "paid," it may reject a method call that asks it to add or remove items. Conversely, if an order is "empty"—that is, no items have yet been ordered—it should not allow itself to be shipped.)"*

**Dịch:** Ba đặc điểm này ảnh hưởng lẫn nhau. State ảnh hưởng behavior: order đã `shipped` hoặc `paid` thì có quyền từ chối method thêm/bớt item. Ngược lại, order đang `empty` thì không được cho phép ship.

---

## 4.1.3. Identifying Classes

> *"In a traditional procedural program, you start the process at the top, with the main function. When designing an object-oriented system, there is no "top," and newcomers to OOP often wonder where to begin. The answer is: Identify your classes and then add methods to each class."*

**Dịch:** Chương trình procedural có điểm bắt đầu từ trên xuống, ở hàm `main`. Hệ thống OOP **không có "trên"**, nên người mới hay không biết bắt đầu từ đâu. Câu trả lời: **xác định class trước, rồi thêm method cho từng class**.

> *"A simple rule of thumb in identifying classes is to look for nouns in the problem analysis. Methods, on the other hand, correspond to verbs."*

**Dịch:** Quy tắc kinh nghiệm: tìm **danh từ** trong bản phân tích bài toán → ra class. **Động từ** → ra method.

```
Danh từ  →  class
Động từ  →  method
```

Ví dụ sách đưa, hệ thống xử lý đơn hàng:

| Danh từ (→ class) | Động từ (→ method) |
|---|---|
| Item | add |
| Order | ship |
| Shipping address | cancel |
| Payment | apply |
| Account | |

> *"Next, look for verbs. Items are added to orders. Orders are shipped or canceled. Payments are applied to orders. With each verb, such as "add," "ship," "cancel," or "apply," you identify the object that has the major responsibility for carrying it out. For example, when a new item is added to an order, the order object should be the one in charge because it knows how it stores and sorts items. That is, add should be a method of the Order class that has an Item object as a parameter."*

**Dịch:** Với mỗi động từ, xác định object nào **chịu trách nhiệm chính** thực hiện nó. Ví dụ thêm item mới vào order: object `Order` phải là bên chịu trách nhiệm, vì nó biết cách lưu và sắp xếp item. Tức là `add` phải là **method của class `Order`**, nhận một object `Item` làm parameter.

```java
class Order {
    void add(Item item) { ... }   // add thuộc Order, không thuộc Item
}
```

> *"Of course, the "noun and verb" is but a rule of thumb; only experience can help you decide which nouns and verbs are the important ones when building your classes."*

**Dịch:** "Danh từ và động từ" chỉ là quy tắc kinh nghiệm. Chỉ có trải nghiệm mới giúp quyết định danh từ nào, động từ nào là quan trọng.

---

## 4.1.4. Relationships between Classes

> *"The most common relationships between classes are*
> - *Dependence ("uses–a")*
> - *Aggregation ("has–a")*
> - *Inheritance ("is–a")"*

**Dịch:** Ba quan hệ phổ biến nhất giữa các class:

| Quan hệ | Cách đọc | Nghĩa |
|---|---|---|
| **Dependence** | "uses–a" | class A **dùng** class B |
| **Aggregation** | "has–a" | class A **chứa** object của class B |
| **Inheritance** | "is–a" | class A **là một loại** class B |

### Dependence ("uses–a")

> *"The dependence, or "uses–a" relationship, is the most obvious and also the most general. For example, the Order class uses the Account class because Order objects need to access Account objects to check for credit status. But the Item class does not depend on the Account class, because Item objects never need to worry about customer accounts. Thus, a class depends on another class if its methods use or manipulate objects of that class."*

**Dịch:** Quan hệ dễ thấy nhất và tổng quát nhất. `Order` dùng `Account` vì object `Order` cần truy cập object `Account` để kiểm tra credit status. Còn `Item` **không** phụ thuộc `Account`, vì object `Item` chả bao giờ cần bận tâm tới account của khách. Định nghĩa: **một class phụ thuộc class khác nếu method của nó dùng hoặc thao tác lên object của class kia**.

> *"Try to minimize the number of classes that depend on each other. The point is, if a class A is unaware of the existence of a class B, it is also unconcerned about any changes to B. (And this means that changes to B do not introduce bugs into A.) In software engineering terminology, you want to minimize the coupling between classes."*

**Dịch:** Cố **giảm tối đa** số class phụ thuộc lẫn nhau. Lý do: nếu class A không biết class B tồn tại, thì A cũng chả quan tâm B thay đổi gì, và thay đổi ở B **không sinh bug trong A**. Thuật ngữ software engineering: giảm **coupling** giữa các class.

### Aggregation ("has–a")

> *"The aggregation, or "has–a" relationship, is easy to understand because it is concrete; for example, an Order object contains Item objects. Containment means that objects of class A contain objects of class B."*

**Dịch:** Quan hệ dễ hiểu vì nó cụ thể: object `Order` **chứa** các object `Item`. Containment nghĩa là object của class A chứa object của class B.

> **Note (sách):** *"Some methodologists view the concept of aggregation with disdain and prefer to use a more general "association" relationship. From the point of view of modeling, that is understandable. But for programmers, the "has–a" relationship makes a lot of sense. I like to use aggregation for another reason as well: The standard notation for associations is less clear. See Table 4.1."*
>
> **Dịch:** Một số nhà phương pháp luận coi thường khái niệm aggregation, thích dùng quan hệ **"association"** tổng quát hơn. Đứng từ góc mô hình hoá thì hiểu được. Nhưng với lập trình viên, quan hệ "has–a" rất có nghĩa. Tác giả còn thích aggregation vì ký hiệu chuẩn của association kém rõ ràng hơn.

### Inheritance ("is–a")

> *"The inheritance, or "is–a" relationship, expresses a relationship between a more special and a more general class. For example, a RushOrder class inherits from an Order class. The specialized RushOrder class has special methods for priority handling and a different method for computing shipping charges, but its other methods, such as adding items and billing, are inherited from the Order class. In general, if class D extends class C, class D inherits methods from class C but has more capabilities."*

**Dịch:** Quan hệ giữa một class **chuyên biệt hơn** và một class **tổng quát hơn**. Ví dụ `RushOrder` kế thừa từ `Order`. Class chuyên biệt `RushOrder` có method riêng để xử lý ưu tiên và một method khác để tính phí ship, còn các method khác như thêm item hay lập hoá đơn thì **thừa hưởng** từ `Order`. Tổng quát: nếu class D extend class C, thì D thừa hưởng method từ C nhưng **có nhiều khả năng hơn**.

```
        Order                    ← tổng quát
          ▲
          │ extends  (is–a)
          │
      RushOrder                  ← chuyên biệt: thêm priority handling
```

### UML

> *"Many programmers use the UML (Unified Modeling Language) notation to draw class diagrams that describe the relationships between classes. You can see an example of such a diagram in Figure 4.2. You draw classes as rectangles, and relationships as arrows with various adornments. Table 4.1 shows the UML arrow styles that this book uses."*

**Dịch:** Nhiều lập trình viên dùng ký hiệu **UML** để vẽ class diagram mô tả quan hệ giữa các class. Class vẽ thành **hình chữ nhật**, quan hệ vẽ thành **mũi tên** với các kiểu đầu mũi khác nhau.

**Table 4.1: UML Notation for Class Relationships**

| Relationship | UML Connector |
|---|---|
| Inheritance | `───────▷` (nét liền, đầu tam giác rỗng) |
| Interface implementation | `- - - -▷` (nét đứt, đầu tam giác rỗng) |
| Dependency | `- - - - >` (nét đứt, đầu mũi tên hở) |
| Aggregation | `◇───────` (nét liền, đầu hình thoi rỗng) |

**Figure 4.2: A class diagram** (theo ví dụ order-processing của sách)

```
                    ┌─────────┐
                    │  Order  │
                    └────┬────┘
                     ◇   │  ▲
        aggregation  │   │  │ inheritance
              ┌──────┘   │  └──────────┐
              │          ┆ dependency  │
        ┌─────▼───┐      ┆        ┌────┴──────┐
        │  Item   │      ┆        │ RushOrder │
        └─────────┘      ▼        └───────────┘
                    ┌─────────┐
                    │ Account │
                    └─────────┘
```

---

## Bài kế tiếp

→ [[02 - Using Predefined Classes]] — constructor, `new`, object variable là reference, `LocalDate`, mutator vs accessor.
