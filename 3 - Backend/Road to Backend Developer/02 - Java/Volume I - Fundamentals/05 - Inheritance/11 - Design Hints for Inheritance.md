# 11 — Design Hints for Inheritance

> Chapter 5, Section 5.11 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.11. Design Hints for Inheritance

> *"I want to end this chapter with some hints that I have found useful when using inheritance."*

**Dịch:** Tác giả muốn **kết chương này bằng vài lời khuyên** mà ông thấy hữu ích khi dùng inheritance.

---

### 1. Place common operations and fields in the superclass.

> *"1. Place common operations and fields in the superclass."*
>
> *"This is why we put the name field into the Person class instead of replicating it in the Employee and Student classes."*

**Dịch:** **Đặt các thao tác và field chung vào superclass.** Đó là lý do ta đưa field `name` vào class `Person` thay vì **nhân bản nó ở cả `Employee` lẫn `Student`**. (Xem [[06 - Abstract Classes]].)

---

### 2. Don't use protected fields.

> *"2. Don't use protected fields."*
>
> *"Some programmers think it is a good idea to define most instance fields as protected, "just in case," so that subclasses can access these fields if they need to. However, the protected mechanism doesn't give much protection, for two reasons. First, the set of subclasses is unbounded—anyone can form a subclass of your classes and then write code that directly accesses protected instance fields, thereby breaking encapsulation. And second, in Java, all classes in the same package have access to protected fields, whether or not they are subclasses."*
>
> *"However, protected methods can be useful to indicate methods that are not ready for general use and should be redefined in subclasses."*

**Dịch:** **Đừng dùng protected field.** Một số lập trình viên nghĩ nên khai báo hầu hết instance field là `protected` **"phòng khi cần"**, để subclass truy cập được. Nhưng **cơ chế `protected` chẳng bảo vệ được bao nhiêu**, vì **hai lý do**: thứ nhất, **tập subclass là vô hạn** — **ai cũng tạo được subclass** từ class của bạn rồi **viết code truy cập thẳng protected instance field**, qua đó **phá vỡ [[01 - Introduction to Object-Oriented Programming|encapsulation]]**; thứ hai, trong Java **mọi class cùng [[08 - Packages|package]] đều truy cập được protected field**, **dù có phải subclass hay không**. Tuy nhiên **protected method thì hữu ích** để **báo hiệu những method chưa sẵn sàng dùng đại trà** và **nên được định nghĩa lại ở subclass**. (Xem [[01 - Classes, Superclasses, and Subclasses]].)

---

### 3. Use inheritance to model the "is–a" relationship.

> *"3. Use inheritance to model the "is–a" relationship."*
>
> *"Inheritance is a handy code-saver, but sometimes people overuse it. For example, suppose we need a Contractor class. Contractors have names and hire dates, but they do not have salaries. Instead, they are paid by the hour, and they do not stay around long enough to get a raise. There is the temptation to form a subclass Contractor from Employee and add an hourlyWage field."*
>
> ```java
> public class Contractor extends Employee
> {
>     private double hourlyWage;
>     . . .
> }
> ```
>
> *"This is not a good idea, however, because now each contractor object has both a salary and hourly wage field. It will cause you no end of grief when you implement methods for printing paychecks or tax forms. You will end up writing more code than you would have written by not inheriting in the first place."*
>
> *"The contractor-employee relationship fails the "is–a" test. A contractor is not a special case of an employee."*

**Dịch:** **Dùng inheritance để mô hình hoá quan hệ "is–a".** Inheritance là **cách tiết kiệm code tiện lợi**, nhưng đôi khi người ta **lạm dụng**. Ví dụ cần class `Contractor`: contractor có **tên và ngày thuê**, nhưng **không có salary** — họ **được trả theo giờ** và **không ở lại đủ lâu để được tăng lương**. Có **cám dỗ** tạo subclass `Contractor` từ `Employee` rồi thêm field `hourlyWage`. **Đây không phải ý hay**, vì giờ **mỗi object contractor có cả field salary lẫn hourly wage**. Nó sẽ **gây khổ sở triền miên** khi bạn cài method in phiếu lương hay biểu mẫu thuế — **rốt cuộc bạn viết nhiều code hơn là nếu ngay từ đầu không kế thừa**. Quan hệ contractor–employee **trượt bài kiểm tra "is–a"**: **một contractor không phải trường hợp đặc biệt của một employee**.

---

### 4. Don't use inheritance unless all inherited methods make sense.

> *"4. Don't use inheritance unless all inherited methods make sense."*
>
> *"Suppose we want to write a Holiday class. Surely every holiday is a day, and days can be expressed as instances of the GregorianCalendar class, so we can use inheritance."*
>
> ```java
> class Holiday extends GregorianCalendar { . . . }
> ```
>
> *"Unfortunately, the set of holidays is not closed under the inherited operations. One of the public methods of GregorianCalendar is add. And add can turn holidays into nonholidays:"*
>
> ```java
> Holiday christmas;
> christmas.add(Calendar.DAY_OF_MONTH, 12);
> ```
>
> *"Therefore, inheritance is not appropriate in this example."*
>
> *"Note that this problem does not arise if you extend an immutable class. Suppose you have an immutable date class, similar to LocalDate but not final. If you form a Holiday subclass, there is no method that can turn a holiday into a nonholiday."*

**Dịch:** **Đừng dùng inheritance trừ khi mọi method kế thừa đều hợp lý.** Giả sử ta muốn viết class `Holiday`. Chắc chắn **mọi ngày lễ đều là một ngày**, và ngày biểu diễn được bằng instance của `GregorianCalendar`, nên **dùng inheritance được**. Tiếc là **tập ngày lễ không đóng dưới các thao tác được kế thừa**: một trong các public method của `GregorianCalendar` là **`add`**, và **`add` biến ngày lễ thành ngày không lễ**. Vì vậy **inheritance không phù hợp** trong ví dụ này. Lưu ý **vấn đề này không phát sinh nếu bạn extend một class immutable**: nếu có một class date immutable, tương tự `LocalDate` nhưng **không `final`**, thì khi tạo subclass `Holiday` sẽ **không có method nào biến được một ngày lễ thành ngày không lễ**.

---

### 5. Don't change the expected behavior when you override a method.

> *"5. Don't change the expected behavior when you override a method."*
>
> *"The substitution principle applies not just to syntax but, more importantly, to behavior. When you override a method, you should not unreasonably change its behavior. The compiler can't help you—it cannot check whether your redefinitions make sense. For example, you can "fix" the issue of the add method in the Holiday class by redefining add, perhaps to do nothing, or to throw an exception, or to move on to the next holiday."*
>
> *"However, such a fix violates the substitution principle. The sequence of statements"*
>
> ```java
> int d1 = x.get(Calendar.DAY_OF_MONTH);
> x.add(Calendar.DAY_OF_MONTH, 1);
> int d2 = x.get(Calendar.DAY_OF_MONTH);
> System.out.println(d2 - d1);
> ```
>
> *"should have the expected behavior, no matter whether x is of type GregorianCalendar or Holiday."*
>
> *"Of course, therein lies the rub. Reasonable and unreasonable people can argue at length about what the expected behavior is. For example, some authors argue that the substitution principle requires Manager.equals to ignore the bonus field because Employee.equals ignores it. These discussions are pointless if they occur in a vacuum. Ultimately, what matters is that you do not circumvent the intent of the original design when you override methods in subclasses."*

**Dịch:** **Đừng thay đổi hành vi được kỳ vọng khi override một method.** [[01 - Classes, Superclasses, and Subclasses|Substitution principle]] áp dụng **không chỉ cho cú pháp mà — quan trọng hơn — cho hành vi**. Khi override, bạn **không nên đổi hành vi một cách vô lý**. **Compiler không giúp được bạn** — nó **không kiểm tra được các định nghĩa lại của bạn có hợp lý không**. Chẳng hạn bạn có thể **"chữa"** vấn đề `add` ở class `Holiday` bằng cách định nghĩa lại `add`: **chẳng làm gì cả**, hoặc **ném exception**, hoặc **nhảy tới ngày lễ kế tiếp**. Nhưng **cách chữa đó vi phạm substitution principle**: chuỗi câu lệnh trên **phải có hành vi như kỳ vọng**, bất kể `x` là kiểu `GregorianCalendar` hay `Holiday`. Dĩ nhiên **cái khó nằm ở đó**: **người hợp lý lẫn người vô lý đều tranh cãi dài dòng được về "hành vi được kỳ vọng" là gì**. Ví dụ một số tác giả lập luận rằng substitution principle **đòi hỏi `Manager.equals` phải bỏ qua field `bonus`** vì `Employee.equals` bỏ qua nó (xem [[02 - Object The Cosmic Superclass]]). **Các tranh luận này vô nghĩa nếu diễn ra trong chân không.** Rốt cuộc, điều quan trọng là bạn **không đi vòng qua ý định của thiết kế gốc** khi override method ở subclass.

---

### 6. Use polymorphism, not type information.

> *"6. Use polymorphism, not type information."*
>
> *"Whenever you find code of the form"*
>
> ```java
> if (x is of type 1)
>     action1(x);
> else if (x is of type 2)
>     action2(x);
> ```
>
> *"think polymorphism."*
>
> *"Do action1 and action2 represent a common concept? If so, make the concept a method of a common superclass or interface of both types. Then, you can simply call"*
>
> ```java
> x.action();
> ```
>
> *"and have the dynamic dispatch mechanism inherent in polymorphism launch the correct action."*
>
> *"Code that uses polymorphic methods or interface implementations is much easier to maintain and extend than code using multiple type tests."*

**Dịch:** **Dùng polymorphism, đừng dùng thông tin kiểu.** Mỗi khi thấy code dạng trên, **hãy nghĩ tới polymorphism**. `action1` và `action2` **có đại diện cho một khái niệm chung không**? Nếu có, hãy **biến khái niệm đó thành một method của superclass hoặc interface chung của cả hai kiểu**. Khi đó bạn **chỉ cần gọi `x.action()`** và để **cơ chế dynamic dispatch vốn có trong polymorphism khởi động đúng hành động**. Code dùng **polymorphic method hoặc interface implementation dễ bảo trì và mở rộng hơn nhiều** so với code dùng **nhiều phép kiểm tra kiểu**.

---

### 7. Don't overuse reflection.

> *"7. Don't overuse reflection."*
>
> *"The reflection mechanism lets you write programs with amazing generality, by detecting fields and methods at runtime. This capability can be extremely useful for systems programming, but it is usually not appropriate in applications. Reflection is fragile—with it, the compiler cannot help you find programming errors. Any errors are found at runtime and result in exceptions."*

**Dịch:** **Đừng lạm dụng [[10 - Reflection|reflection]].** Cơ chế reflection cho bạn viết chương trình với **độ tổng quát đáng kinh ngạc**, bằng cách **phát hiện field và method lúc runtime**. Khả năng này **cực kỳ hữu ích cho lập trình hệ thống**, nhưng **thường không phù hợp trong ứng dụng**. **Reflection mong manh**: với nó, **compiler không giúp bạn tìm lỗi lập trình được**. **Mọi lỗi chỉ lộ ra lúc runtime và sinh ra exception.**

---

## Kết chương

> *"You have now seen how Java supports the fundamentals of object-oriented programming: classes, inheritance, and polymorphism. In the next chapter, I will tackle two advanced topics that are very important for using Java effectively: interfaces and lambda expressions."*

**Dịch:** Bạn đã thấy Java hỗ trợ **các nền tảng của object-oriented programming** ra sao: **class, inheritance, và polymorphism**. Chương sau sẽ xử lý **hai chủ đề nâng cao rất quan trọng để dùng Java hiệu quả**: **interface** và **lambda expression**.

---

## Chương kế tiếp

→ [[01 - Interfaces]] — cách mô tả class phải làm gì mà không quy định làm thế nào.
