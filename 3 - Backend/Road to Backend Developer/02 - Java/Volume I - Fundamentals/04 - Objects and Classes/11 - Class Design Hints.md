# 11 — Class Design Hints

> Chapter 4, Section 4.11 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.11. Class Design Hints

> *"Without trying to be comprehensive or tedious, I want to end this chapter with some hints that will make your classes more acceptable in well-mannered OOP circles."*

**Dịch:** Không cố gắng đầy đủ hay dài dòng, tác giả khép lại chương này bằng vài lời khuyên giúp class của bạn **dễ được chấp nhận hơn trong giới OOP đàng hoàng**.

---

## 1. Always keep data private

> *"This is first and foremost; doing anything else violates encapsulation. You may need to write an accessor or mutator method occasionally, but you are still better off keeping the instance fields private. Bitter experience shows that the data representation may change, but how this data are used will change much less frequently. When data are kept private, changes in their representation will not affect the users of the class, and bugs are easier to detect."*

**Dịch — Luôn giữ data ở dạng private.**

Đây là điều **quan trọng đầu tiên và trên hết**; làm khác đi là **vi phạm encapsulation**. Thỉnh thoảng bạn sẽ cần viết accessor hoặc mutator method, nhưng **vẫn tốt hơn nếu giữ instance field là private**.

**Kinh nghiệm cay đắng** cho thấy: **cách biểu diễn data thì thay đổi**, còn **cách data được dùng thì thay đổi ít hơn nhiều**. Khi data được giữ private, **thay đổi trong cách biểu diễn sẽ không ảnh hưởng người dùng class**, và **bug dễ phát hiện hơn**.

---

## 2. Always initialize data

> *"Java won't initialize local variables for you, but it will initialize instance fields of objects. Don't rely on the defaults, but initialize all variables explicitly, either by supplying a default or by setting defaults in all constructors."*

**Dịch — Luôn khởi tạo data.**

Java **không khởi tạo local variable** giúp bạn, nhưng **có khởi tạo instance field** của object. **Đừng dựa vào giá trị mặc định.** Hãy khởi tạo mọi biến **một cách tường minh**, bằng cách cấp một giá trị mặc định, hoặc **đặt giá trị mặc định trong mọi constructor**.

---

## 3. Don't use too many basic types in a class

> *"The idea is to replace multiple related uses of basic types with other classes. This keeps your classes easier to understand and to change. For example, replace the following instance fields in a Customer class:"*

```java
private String street;
private String city;
private String state;
private int zip;
```

> *"with a new class called Address. This way, you can easily cope with changes to addresses, such as the need to deal with international addresses."*

**Dịch — Đừng dùng quá nhiều kiểu cơ bản trong một class.**

Ý tưởng là **thay nhiều chỗ dùng kiểu cơ bản có liên quan tới nhau bằng những class khác**. Việc này giữ cho class **dễ hiểu và dễ thay đổi hơn**. Ví dụ, thay bốn field trên trong class `Customer` bằng một class mới tên **`Address`**. Nhờ vậy bạn **dễ dàng ứng phó với thay đổi về địa chỉ**, chẳng hạn khi cần xử lý địa chỉ quốc tế.

```
      TRƯỚC                              SAU
  ┌──────────────────┐            ┌──────────────────┐
  │ Customer         │            │ Customer         │
  │   String street  │            │   Address address│───┐
  │   String city    │    →       └──────────────────┘   │
  │   String state   │                                   ▼
  │   int    zip     │                       ┌──────────────────┐
  └──────────────────┘                       │ Address          │
                                             │   street/city/...│
                                             └──────────────────┘
```

---

## 4. Not all fields need individual field accessors and mutators

> *"You may need to get and set an employee's salary. You certainly won't need to change the hiring date once the object is constructed. And, quite often, objects have instance fields that you don't want others to get or set, such as an array of state abbreviations in an Address class."*

**Dịch — Không phải field nào cũng cần accessor và mutator riêng.**

Bạn có thể cần **đọc và ghi lương** của nhân viên. Nhưng **chắc chắn không cần đổi ngày vào làm** sau khi object đã được dựng. Và khá thường xuyên, object có những instance field mà bạn **không muốn người khác đọc hay ghi**, ví dụ **một mảng viết tắt tên bang** trong class `Address`.

---

## 5. Break up classes that have too many responsibilities

> *"This hint is, of course, vague: "too many" is obviously in the eye of the beholder. However, if there is an obvious way to break one complicated class into two classes that are conceptually simpler, seize the opportunity. (On the other hand, don't go overboard; ten classes, each with only one method, are usually an overkill.)"*

**Dịch — Tách những class ôm quá nhiều trách nhiệm.**

Lời khuyên này tất nhiên **mơ hồ**: "quá nhiều" rõ ràng là tuỳ mắt người nhìn. Tuy vậy, nếu có **cách hiển nhiên** để tách một class phức tạp thành hai class **đơn giản hơn về mặt khái niệm** thì **hãy chớp lấy cơ hội đó**. Mặt khác, **đừng làm quá đà**: mười class, mỗi class chỉ có một method, thường là **thái quá**.

> *"Here is an example of a bad design:"*

```java
public class CardDeck // bad design
{
    private int[] value;
    private int[] suit;

    public CardDeck() { . . . }
    public void shuffle() { . . . }
    public int getTopValue() { . . . }
    public int getTopSuit() { . . . }
    public void draw() { . . . }
}
```

> *"This class really implements two separate concepts: a deck of cards, with its shuffle and draw methods, and a card, with the methods to inspect its value and suit. It makes sense to introduce a Card class that represents an individual card. Now you have two classes, each with its own responsibilities. Since the Card class is so simple, it can be implemented as a record. Also, instead of using integer values for the suits, an enumeration is a better choice:"*

```java
public class CardDeck
{
    private Card[] cards;

    public CardDeck() { . . . }
    public void shuffle() { . . . }
    public Card getTop() { . . . }
    public void draw() { . . . }
}

public enum Suit { DIAMONDS, HEARTS, SPADES, CLUBS }

public record Card(int value, Suit suit) {}
```

**Dịch:** Class này thực chất **implement hai khái niệm tách biệt**:

| Khái niệm | Method tương ứng |
|---|---|
| **bộ bài** (deck of cards) | `shuffle`, `draw` |
| **lá bài** (card) | các method xem `value` và `suit` |

Hợp lý hơn là **đưa vào một class `Card`** đại diện cho **một lá bài riêng lẻ**. Giờ bạn có hai class, mỗi class **có trách nhiệm riêng**. Vì class `Card` quá đơn giản nên nó **implement được dưới dạng `record`**. Ngoài ra, thay vì dùng **giá trị số nguyên** cho chất bài, **`enum` là lựa chọn tốt hơn**.

---

## 6. Make the names of your classes and methods reflect their responsibilities

> *"Just as variables should have meaningful names that reflect what they represent, so should classes. (The standard library certainly contains some dubious examples, such as the Date class that describes time.)"*

> *"A good convention is that a class name should be a noun (Order), or a noun preceded by an adjective (RushOrder) or a gerund (an "-ing" word, as in BillingAddress). As for methods, follow the standard convention that accessor methods begin with a lowercase get (getSalary) and mutator methods use a lowercase set (setSalary)."*

**Dịch — Đặt tên class và method sao cho phản ánh đúng trách nhiệm của chúng.**

Biến cần có tên có ý nghĩa phản ánh thứ nó đại diện, **class cũng vậy**. Standard library chắc chắn có **vài ví dụ đáng ngờ**, như class `Date` lại mô tả **thời gian**.

**Quy ước tốt:**

| Loại | Quy ước | Ví dụ |
|---|---|---|
| tên class | một **danh từ** | `Order` |
| | danh từ đứng sau một **tính từ** | `RushOrder` |
| | danh từ đứng sau một **danh động từ** (từ đuôi "-ing") | `BillingAddress` |
| accessor method | bắt đầu bằng **`get`** viết thường | `getSalary` |
| mutator method | bắt đầu bằng **`set`** viết thường | `setSalary` |

---

## 7. Prefer immutable classes

> *"The LocalDate class, and other classes from the java.time package, are immutable—no method can modify the state of an object. Instead of mutating objects, methods such as plusDays return new objects with the modified state."*

**Dịch — Ưu tiên class immutable.**

Class `LocalDate` và các class khác trong package `java.time` đều **immutable** — **không method nào sửa được state của object**. Thay vì mutate object, các method như `plusDays` **trả về object mới với state đã sửa**.

> *"The problem with mutation is that it can happen concurrently when multiple threads try to update an object at the same time. The results are unpredictable. When classes are immutable, it is safe to share their objects among multiple threads."*

**Dịch:** Vấn đề của mutation là nó **có thể xảy ra đồng thời** khi nhiều thread cùng cập nhật một object một lúc. **Kết quả không đoán trước được.** Khi class là immutable thì **chia sẻ object của chúng giữa nhiều thread là an toàn**.

> *"Therefore, it is a good idea to make classes immutable when you can. This is particularly easy with classes that represent values, such as a string or a point in time. Computations can simply yield new values instead of updating existing ones."*

**Dịch:** Vì vậy **nên làm class immutable khi có thể**. Việc này **đặc biệt dễ với class đại diện cho giá trị**, như một chuỗi hay một điểm thời gian. Phép tính chỉ cần **cho ra giá trị mới** thay vì cập nhật giá trị đang có.

> *"Of course, not all classes should be immutable. It would be strange to have the raiseSalary method return a new Employee object when an employee gets a raise."*

**Dịch:** Tất nhiên **không phải class nào cũng nên immutable**. Sẽ **kỳ quặc** nếu method `raiseSalary` trả về **một object `Employee` mới** mỗi khi một nhân viên được tăng lương.

---

## Khép lại chương 4

> *"In this chapter, we covered the fundamentals of objects and classes that make Java an "object-based" language. In order to be truly object-oriented, a programming language must also support inheritance and polymorphism. The Java support for these features is the topic of the next chapter."*

**Dịch:** Chương này bao quát các nền tảng về **object và class**, thứ làm Java thành một ngôn ngữ **"object-based"**. Để thực sự **object-oriented**, một ngôn ngữ còn phải hỗ trợ **inheritance** và **polymorphism**. Cách Java hỗ trợ hai tính năng này là chủ đề của **chương sau**.

---

## Tổng kết 7 lời khuyên

| # | Lời khuyên |
|---|---|
| 1 | **Always keep data private** — luôn giữ data private |
| 2 | **Always initialize data** — luôn khởi tạo data tường minh |
| 3 | **Don't use too many basic types in a class** — gộp các kiểu cơ bản liên quan thành class riêng |
| 4 | **Not all fields need individual field accessors and mutators** — không phải field nào cũng cần getter/setter |
| 5 | **Break up classes that have too many responsibilities** — tách class ôm quá nhiều trách nhiệm |
| 6 | **Make the names of your classes and methods reflect their responsibilities** — đặt tên phản ánh trách nhiệm |
| 7 | **Prefer immutable classes** — ưu tiên class immutable |

---

## Chương kế tiếp

→ Chapter 5: Inheritance — `extends`, superclass/subclass, `Object` là cosmic superclass, `ArrayList`, object wrapper và autoboxing, abstract class, enum, sealed class, pattern matching, reflection.
