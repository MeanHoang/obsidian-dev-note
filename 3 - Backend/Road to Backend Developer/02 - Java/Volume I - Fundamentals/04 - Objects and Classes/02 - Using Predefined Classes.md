# 02 — Using Predefined Classes

> Chapter 4, Section 4.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.2. Using Predefined Classes

> *"You can't do anything in Java without classes, and you have already seen several classes at work. However, not all of these show off the typical features of object orientation. Take, for example, the Math class. You have seen that you can use methods of the Math class, such as Math.random, without needing to know how they are implemented—all you need to know is the name and parameter types (if any). That's the point of encapsulation, and it will certainly be true of all classes. But the Math class only encapsulates functionality; it neither needs nor hides data. Since there is no data, you do not need to worry about making objects and initializing their instance fields—there aren't any!"*

**Dịch:** Không có class thì chả làm được gì trong Java. Nhưng không phải class nào cũng thể hiện đủ đặc trưng của object orientation. Ví dụ class `Math`: dùng được `Math.random` mà chả cần biết nó implement ra sao, chỉ cần biết tên và kiểu parameter. Đó chính là điểm của encapsulation. Nhưng `Math` **chỉ đóng gói chức năng**, nó không cần và cũng không giấu data nào. Vì không có data nên khỏi bận tâm chuyện tạo object hay khởi tạo instance field — chả có cái nào cả.

> *"In the next section, we will look at a more typical class, the Date class. You will see how to construct objects and call methods of this class."*

**Dịch:** Phần sau xét một class điển hình hơn là `Date`, để thấy cách dựng object và gọi method.

---

## 4.2.1. Objects and Object Variables

> *"To work with objects, you first construct them and specify their initial state. Then you apply methods to the objects."*

**Dịch:** Làm việc với object thì trước hết **dựng** nó lên và chỉ định **state ban đầu**. Sau đó mới gọi method lên object.

> *"In the Java programming language, you use constructors to construct new instances. A constructor is a special method whose purpose is to construct and initialize objects. Let us look at an example. The standard Java library contains a Date class. Its objects describe points in time, such as December 31, 1999, 23:59:59 GMT."*

**Dịch:** Java dùng **constructor** để dựng instance mới. Constructor là một **method đặc biệt** với nhiệm vụ dựng và khởi tạo object. Standard library có class `Date`, object của nó mô tả một **điểm thời gian**, ví dụ 31/12/1999, 23:59:59 GMT.

> **Note (sách):** *"You may be wondering: Why use a class to represent dates rather than (as in some languages) a built-in type? For example, Visual Basic has a built-in date type, and programmers can specify dates in the format #12/31/1999#. On the surface, this sounds convenient—programmers can simply use the built-in date type without worrying about classes. But actually, how suitable is the Visual Basic design? In some locales, dates are specified as month/day/year, in others as day/month/year. Are the language designers really equipped to foresee these kinds of issues? If they do a poor job, the language becomes an unpleasant muddle, but unhappy programmers are powerless to do anything about it. With classes, the design task is offloaded to a library designer. If the class is not perfect, other programmers can easily write their own classes to enhance or replace the system classes. (To prove the point: The Java date library started out a bit muddled, and it has been redesigned twice.)"*
>
> **Dịch:** Vì sao dùng class biểu diễn ngày thay vì làm kiểu built-in như một số ngôn ngữ khác? Visual Basic có kiểu date built-in, viết được `#12/31/1999#`. Nhìn thì tiện, nhưng thiết kế đó có ổn không? Có locale ghi month/day/year, locale khác ghi day/month/year. Người thiết kế ngôn ngữ liệu đủ sức lường trước những chuyện này? Nếu họ làm dở thì ngôn ngữ thành mớ hỗn độn, mà lập trình viên **bất lực không sửa được**. Dùng class thì nhiệm vụ thiết kế đẩy sang người viết library. Class chưa hoàn hảo thì lập trình viên khác dễ dàng tự viết class riêng để cải thiện hoặc thay thế class hệ thống. Bằng chứng: date library của Java lúc đầu khá lộn xộn, và **đã bị thiết kế lại hai lần**.

### Constructor và `new`

> *"Constructors always have the same name as the class name. Thus, the constructor for the Date class is called Date. To construct a Date object, combine the constructor with the new operator, as follows:"*

**Dịch:** Constructor **luôn trùng tên với class**. Nên constructor của class `Date` tên là `Date`. Muốn dựng object `Date`, ghép constructor với toán tử `new`:

```java
new Date()
```

> *"This expression constructs a new object. The object is initialized to the current date and time."*

**Dịch:** Biểu thức này dựng một object mới, được khởi tạo với ngày giờ hiện tại.

> *"If you like, you can pass the object to a method:"*

```java
System.out.println(new Date());
```

> *"Alternatively, you can apply a method to the object that you just constructed. One of the methods of the Date class is the toString method. That method yields a string representation of the date. Here is how you would apply the toString method to a newly constructed Date object:"*

**Dịch:** Hoặc gọi luôn method lên object vừa dựng. `Date` có method `toString` trả về biểu diễn chuỗi của ngày:

```java
String s = new Date().toString();
```

> *"In these two examples, the constructed object is used only once. Usually, you will want to hang on to the objects that you construct so that you can keep using them. Simply store the object in a variable:"*

**Dịch:** Hai ví dụ trên dùng object **đúng một lần**. Thường thì bạn muốn giữ object lại để còn dùng tiếp, nên lưu nó vào biến:

```java
Date rightNow = new Date();
```

**Figure 4.3: Creating a new object**

```
   rightNow                      heap
  ┌──────────┐            ┌────────────────────┐
  │ địa chỉ ─┼───────────►│   Date object      │
  └──────────┘            │  (ngày giờ hiện tại)│
   object variable        └────────────────────┘
```

### Object variable KHÁC object

> *"There is an important difference between objects and object variables. For example, the statement"*

```java
Date startTime; // startTime doesn't refer to any object
```

> *"defines an object variable, startTime, that can refer to objects of type Date. It is important to realize that the variable startTime is not an object and, in fact, does not even refer to an object yet. You cannot use any Date methods on this variable at this time. The statement"*

```java
s = startTime.toString(); // not yet
```

> *"would cause a compile-time error."*

**Dịch:** Có khác biệt quan trọng giữa **object** và **object variable**. Câu lệnh trên định nghĩa một object variable tên `startTime`, **có thể** trỏ tới object kiểu `Date`. Phải hiểu rõ: `startTime` **không phải object**, và lúc này **còn chưa trỏ tới object nào cả**. Chưa gọi được method `Date` nào lên biến này. Viết `startTime.toString()` lúc này là **lỗi compile-time**.

> *"You must first initialize the startTime variable. You have two choices. Of course, you can initialize the variable so that it refers to a newly constructed object:"*

```java
startTime = new Date();
```

> *"Or you can set the variable to refer to an existing object:"*

```java
startTime = rightNow;
```

> *"Now both variables refer to the same object (see Figure 4.4)."*

**Dịch:** Phải khởi tạo `startTime` trước, có hai lựa chọn: trỏ tới object **mới dựng**, hoặc trỏ tới object **đã có sẵn**. Cách thứ hai làm cả hai biến trỏ tới **cùng một object**.

**Figure 4.4: Object variables that refer to the same object**

```
   rightNow                      heap
  ┌──────────┐            ┌────────────────────┐
  │ địa chỉ ─┼───────────►│                    │
  └──────────┘            │    Date object     │
   startTime              │                    │
  ┌──────────┐            │                    │
  │ địa chỉ ─┼───────────►│                    │
  └──────────┘            └────────────────────┘
     hai biến, MỘT object
```

### Giá trị của object variable là một reference

> *"It is important to realize that an object variable doesn't actually contain an object. It only refers to an object."*

**Dịch:** Object variable **không chứa object**. Nó chỉ **trỏ tới** object.

> *"In Java, the value of any object variable is a reference to an object that is stored elsewhere. The return value of the new operator is also a reference. A statement such as"*

```java
Date startTime = new Date();
```

> *"has two parts. The expression new Date() makes an object of type Date, and its value is a reference to that newly created object. That reference is then stored in the startTime variable."*

**Dịch:** Trong Java, **giá trị của mọi object variable là một reference** trỏ tới object nằm ở chỗ khác. Giá trị trả về của toán tử `new` cũng là một reference. Câu lệnh trên có **hai phần**: biểu thức `new Date()` tạo object kiểu `Date` và cho ra giá trị là **reference** tới object vừa tạo; reference đó rồi được lưu vào biến `startTime`.

```
Date startTime = new Date();
                 └────┬────┘
                      │ tạo object trên heap, trả về reference
        └─────┬───────┘
              │ reference được lưu vào biến
```

> *"You can explicitly set an object variable to null to indicate that it currently refers to no object."*

```java
startTime = null;
. . .
if (startTime != null)
    System.out.println(startTime);
```

**Dịch:** Gán tường minh `null` cho object variable để báo rằng nó **hiện không trỏ tới object nào**. Chi tiết `null` ở [[03 - Defining Your Own Classes]] (Section 4.3.6).

> **C++ Note (sách):** *"Some people mistakenly believe that Java object variables behave like C++ references. But in C++ there are no null references, and references cannot be assigned. You should think of Java object variables as analogous to object pointers in C++."*
>
> **Dịch:** Nhiều người tưởng nhầm object variable của Java hành xử như **reference của C++**. Nhưng C++ không có null reference, và reference không gán lại được. Nên hình dung object variable của Java giống **pointer** trong C++ hơn. `Date rightNow;` (Java) thực chất giống `Date* rightNow;` (C++). Java `null` tương đương C++ `NULL` pointer. **Mọi object Java sống trên heap**; khi một object chứa object variable khác thì nó chỉ chứa pointer tới object khác trên heap. Trong C++ pointer dễ gây lỗi, còn Java thì runtime báo lỗi tin cậy thay vì cho ra kết quả ngẫu nhiên, và **garbage collector** lo chuyện quản lý bộ nhớ. Muốn copy hoàn chỉnh một object trong Java thì phải dùng method `clone`.

---

## 4.2.2. The LocalDate Class of the Java Library

> *"In the preceding examples, we used the Date class that is a part of the standard Java library. An instance of the Date class has a state—namely, a particular point in time."*

**Dịch:** Instance của `Date` có state là **một điểm thời gian cụ thể**.

> *"Although you don't need to know this when you use the Date class, the time is represented by the number of milliseconds (positive or negative) from a fixed point, the so-called epoch, which is 00:00:00 UTC, January 1, 1970. UTC is the Coordinated Universal Time, the scientific time standard which is, for practical purposes, the same as the more familiar GMT, or Greenwich Mean Time."*

**Dịch:** Thời gian được biểu diễn bằng **số millisecond** (dương hoặc âm) tính từ một mốc cố định gọi là **epoch**: `00:00:00 UTC, 1/1/1970`. UTC là Coordinated Universal Time, về mặt thực hành thì giống GMT.

> *"But as it turns out, the Date class is not very useful for manipulating the kind of calendar information that humans use for dates, such as "December 31, 1999." This particular description of a day follows the Gregorian calendar, which is the calendar used in most countries of the world. The same point in time would be described quite differently in the Chinese or Hebrew lunar calendars, not to mention the calendar used by your customers from Mars."*

**Dịch:** Class `Date` **không hữu ích lắm** để thao tác thông tin lịch mà con người dùng, kiểu "December 31, 1999". Cách mô tả đó theo **lịch Gregorian**, lịch dùng ở phần lớn các nước. Cùng một điểm thời gian sẽ được mô tả khác hẳn trong âm lịch Trung Quốc hay lịch Do Thái.

> *"The library designers decided to separate the concerns of keeping time and attaching names to points in time. Therefore, the standard Java library contains two separate classes: the Date class, which represents a point in time, and the LocalDate class, which expresses days in the familiar calendar notation. Nowadays there is a much more robust set of classes for manipulating various aspects of date and time—see Chapter 6 of Volume II."*

**Dịch:** Người thiết kế library quyết định **tách hai mối bận tâm**: giữ thời gian, và gắn tên cho điểm thời gian. Nên có **hai class riêng**:

| Class | Biểu diễn gì |
|---|---|
| `Date` | một **điểm thời gian** |
| `LocalDate` | **ngày** theo ký hiệu lịch quen thuộc |

> *"Separating time measurement from calendars is good object-oriented design. In general, it is a good idea to use different classes to express different concepts."*

**Dịch:** Tách phép đo thời gian khỏi lịch là **thiết kế OO tốt**. Nói chung, nên **dùng class khác nhau để diễn đạt khái niệm khác nhau**.

### Static factory method

> *"You do not use a constructor to construct objects of the LocalDate class. Instead, use static factory methods that call constructors on your behalf. The expression"*

```java
LocalDate.now()
```

> *"constructs a new object that represents the date at which the object was constructed."*

**Dịch:** `LocalDate` **không dùng constructor** để dựng object. Thay vào đó dùng **static factory method**, chúng gọi constructor thay cho bạn. `LocalDate.now()` dựng object biểu diễn ngày tại thời điểm object được tạo.

> *"You can construct an object for a specific date by supplying year, month, and day:"*

```java
LocalDate.of(1999, 12, 31)
```

> *"Of course, you will usually want to store the constructed object in an object variable:"*

```java
LocalDate newYearsEve = LocalDate.of(1999, 12, 31);
```

> *"Once you have a LocalDate object, you can find out the year, month, and day with the methods getYear, getMonthValue, and getDayOfMonth:"*

```java
int year = newYearsEve.getYear();          // 1999
int month = newYearsEve.getMonthValue();   // 12
int day = newYearsEve.getDayOfMonth();     // 31
```

> *"This may seem pointless because they are the very same values that you just used to construct the object. But sometimes, you have a date that has been computed, and then you will want to invoke those methods to find out more about it. For example, the plusDays method yields a new LocalDate that is a given number of days away from the object to which you apply it:"*

```java
LocalDate aThousandDaysLater = newYearsEve.plusDays(1000);
year = aThousandDaysLater.getYear();        // 2002
month = aThousandDaysLater.getMonthValue(); // 09
day = aThousandDaysLater.getDayOfMonth();   // 26
```

**Dịch:** Nhìn thì có vẻ vô nghĩa vì đó đúng là các giá trị vừa dùng để dựng object. Nhưng đôi khi bạn có một ngày **được tính ra**, lúc đó mới cần gọi các method này để biết thêm về nó. Ví dụ `plusDays` cho ra một `LocalDate` **mới**, cách object gốc số ngày cho trước.

> *"The LocalDate class has encapsulated instance fields to maintain the date to which it is set. Without looking at the source code, it is impossible to know the representation that the class uses internally. But, of course, the point of encapsulation is that this doesn't matter. What matters are the methods that a class exposes."*

**Dịch:** `LocalDate` có instance field được encapsulate để giữ ngày. Không đọc source thì không thể biết class biểu diễn nội bộ ra sao. Nhưng điểm của encapsulation chính là **chuyện đó không quan trọng**. Cái quan trọng là **bộ method mà class lộ ra**.

> **Note (sách):** *"Actually, the Date class also has methods to get the day, month, and year, called getDay, getMonth, and getYear, but these methods are deprecated. A method is deprecated when a library designer realizes that the method should have never been introduced in the first place."*
>
> **Dịch:** `Date` cũng có `getDay`, `getMonth`, `getYear`, nhưng chúng **deprecated**. Một method bị đánh dấu deprecated khi người thiết kế library nhận ra **lẽ ra không nên đưa method đó vào ngay từ đầu**. Các method này có từ trước khi họ nhận ra nên tách class riêng để xử lý lịch. Khi bộ class calendar cũ hơn được đưa vào ở Java 1.1, các method của `Date` bị gắn deprecated. Vẫn dùng được nhưng sẽ có **compiler warning** khó coi. Nên tránh dùng method deprecated vì chúng **có thể bị gỡ** ở phiên bản library sau.

> **Tip (sách):** *"The JDK provides the jdeprscan tool for checking whether your code uses deprecated features of the Java API."* — https://docs.oracle.com/en/java/javase/21/docs/specs/man/jdeprscan.html

---

## 4.2.3. Mutator and Accessor Methods

> *"Have another look at the plusDays method call that you saw in the preceding section:"*

```java
LocalDate aThousandDaysLater = newYearsEve.plusDays(1000);
```

> *"What happens to newYearsEve after the call? Has it been changed to be a thousand days later? As it turns out, it has not. The plusDays method yields a new LocalDate object, which is then assigned to the aThousandDaysLater variable. The original object remains unchanged. We say that the plusDays method does not mutate the object on which it is invoked. (This is similar to the toUpperCase method of the String class that you saw in Chapter 3. When you call toUpperCase on a string, that string stays the same, and a new string with uppercase characters is returned.)"*

**Dịch:** Sau lời gọi trên, `newYearsEve` có bị đổi thành ngày sau đó 1000 ngày không? **Không**. `plusDays` cho ra một object `LocalDate` **mới**, gán vào biến `aThousandDaysLater`. Object gốc **giữ nguyên**. Ta nói `plusDays` **không mutate** object mà nó được gọi lên. Tương tự `toUpperCase` của `String` ở [[05 - Strings#3.6.4 Strings Are Immutable ⭐⭐|Chapter 3]]: gọi `toUpperCase` lên một string thì string đó giữ nguyên, và một string mới viết hoa được trả về.

### Đối chiếu với `GregorianCalendar`

> *"An earlier version of the Java library had a different class for dealing with calendars, called GregorianCalendar. This code snippet adds a thousand days to a date represented by that class:"*

```java
GregorianCalendar someDay = new GregorianCalendar(1999, 11, 31);
// odd feature of that class: month numbers go from 0 to 11
someDay.add(Calendar.DAY_OF_MONTH, 1000);
```

> *"Unlike the LocalDate.plusDays method, the GregorianCalendar.add method is a mutator method. After invoking it, the state of the someDay object has changed. Here is how you can find out the new state:"*

```java
year = someDay.get(Calendar.YEAR);          // 2002
month = someDay.get(Calendar.MONTH) + 1;    // 09
day = someDay.get(Calendar.DAY_OF_MONTH);   // 26
```

> *"That's why the variable is called someDay and not newYearsEve—it no longer is new year's eve after calling the mutator method."*

**Dịch:** Khác với `LocalDate.plusDays`, method `GregorianCalendar.add` là **mutator method**. Gọi xong thì **state của object `someDay` đã thay đổi**. Đó là lý do biến được đặt tên `someDay` chứ không phải `newYearsEve` — sau khi gọi mutator method thì nó **không còn là đêm giao thừa nữa**.

> Lưu ý sách ghi trong comment: class đó có đặc điểm kỳ quặc là **số tháng chạy từ 0 đến 11**.

> *"In contrast, methods that only access objects without modifying them are sometimes called accessor methods. For example, LocalDate.getYear and GregorianCalendar.get are accessor methods."*

**Dịch:** Ngược lại, method chỉ **đọc** object mà không sửa gì thì gọi là **accessor method**. Ví dụ `LocalDate.getYear` và `GregorianCalendar.get`.

| Loại method | Có sửa state không | Ví dụ |
|---|---|---|
| **mutator** | ✅ có | `GregorianCalendar.add` |
| **accessor** | ❌ không | `LocalDate.getYear`, `GregorianCalendar.get`, `LocalDate.plusDays` |

> **C++ Note (sách):** *"In C++, the const suffix denotes accessor methods. A method that is not declared as const is assumed to be a mutator. However, in the Java programming language, no special syntax distinguishes accessors from mutators."*
>
> **Dịch:** C++ dùng hậu tố `const` để đánh dấu accessor method; method không khai báo `const` thì mặc định coi là mutator. Java **không có cú pháp riêng** nào phân biệt accessor với mutator.

---

## Chương trình ví dụ: in lịch tháng hiện tại

> *"I finish this section with a program that puts the LocalDate class to work. The program displays a calendar for the current month, like this:"*

```
Mon Tue Wed Thu Fri Sat Sun
                          1
  2   3   4   5   6   7   8
  9  10  11  12  13  14  15
 16  17  18  19  20  21  22
 23  24  25  26*  27  28  29
 30
```

> *"The current day is marked with an asterisk (*). As you can see, the program needs to know how to compute the length of a month and the weekday of a given day."*

**Dịch:** Ngày hiện tại được đánh dấu bằng dấu `*`. Chương trình cần biết cách tính **độ dài của tháng** và **thứ trong tuần** của một ngày.

### Các bước chính

> *"Let us go through the key steps of the program. First, we construct an object that is initialized with the current date."*

```java
LocalDate date = LocalDate.now();
```

> *"We capture the current month and day."*

```java
int month = date.getMonthValue();
int today = date.getDayOfMonth();
```

> *"Then we set date to the first of the month and get the weekday of that date."*

```java
date = date.minusDays(today - 1); // set to start of month
DayOfWeek weekday = date.getDayOfWeek();
int value = weekday.getValue();   // 1 = Monday, . . . , 7 = Sunday
```

> *"The variable weekday is set to an object of type DayOfWeek. We call the getValue method of that object to get a numerical value for the weekday. This yields an integer that follows the international convention where the weekend comes at the end of the week, returning 1 for Monday, 2 for Tuesday, and so on. Sunday has value 7."*

**Dịch:** Biến `weekday` là object kiểu `DayOfWeek`. Gọi `getValue` lên object đó để lấy giá trị số của thứ. Kết quả theo **quy ước quốc tế**: cuối tuần nằm ở cuối tuần lễ, `1` = Monday, `2` = Tuesday, ..., `7` = Sunday.

> *"Note that the first line of the calendar is indented, so that the first day of the month falls on the appropriate weekday. Here is the code to print the header and the indentation for the first line:"*

```java
System.out.println("Mon Tue Wed Thu Fri Sat Sun");
for (int i = 1; i < value; i++)
    System.out.print("    ");
```

> *"Now, we are ready to print the body of the calendar. We enter a loop in which date traverses the days of the month. In each iteration, we print the date value. If date is today, the date is marked with an *. Then, we advance date to the next day. When we reach the beginning of each new week, we print a new line:"*

```java
while (date.getMonthValue() == month)
{
    System.out.printf("%3d", date.getDayOfMonth());
    if (date.getDayOfMonth() == today)
        System.out.print("*");
    else
        System.out.print(" ");
    date = date.plusDays(1);
    if (date.getDayOfWeek().getValue() == 1) System.out.println();
}
```

> *"When do we stop? We don't know whether the month has 31, 30, 29, or 28 days. Instead, we keep iterating while date is still in the current month."*

**Dịch:** Dừng lúc nào? Ta **không biết** tháng có 31, 30, 29 hay 28 ngày. Thay vào đó cứ lặp **chừng nào `date` còn nằm trong tháng hiện tại**.

### Listing 4.1 — `CalendarTest/CalendarTest.java`

```java
import java.time.*;

/**
 * @version 1.5 2015-05-08
 * @author Cay Horstmann
 */
public class CalendarTest
{
    public static void main(String[] args)
    {
        LocalDate date = LocalDate.now();
        int month = date.getMonthValue();
        int today = date.getDayOfMonth();

        date = date.minusDays(today - 1); // set to start of month
        DayOfWeek weekday = date.getDayOfWeek();
        int value = weekday.getValue();   // 1 = Monday, . . . , 7 = Sunday

        System.out.println("Mon Tue Wed Thu Fri Sat Sun");
        for (int i = 1; i < value; i++)
            System.out.print("    ");
        while (date.getMonthValue() == month)
        {
            System.out.printf("%3d", date.getDayOfMonth());
            if (date.getDayOfMonth() == today)
                System.out.print("*");
            else
                System.out.print(" ");
            date = date.plusDays(1);
            if (date.getDayOfWeek().getValue() == 1) System.out.println();
        }
        if (date.getDayOfWeek().getValue() != 1) System.out.println();
    }
}
```

> *"As you can see, the LocalDate class makes it possible to write a calendar program that takes care of complexities such as weekdays and the varying month lengths. You don't need to know how the LocalDate class computes months and weekdays. You just use the interface of the class—the methods such as plusDays and getDayOfWeek."*

**Dịch:** `LocalDate` cho phép viết chương trình lịch xử lý được các phức tạp như thứ trong tuần và độ dài tháng thay đổi. Bạn **không cần biết** `LocalDate` tính tháng và thứ ra sao, chỉ dùng **interface của class** — các method như `plusDays`, `getDayOfWeek`.

> *"The point of this example program is to show you how you can use the interface of a class to carry out fairly sophisticated tasks without having to know the implementation details."*

**Dịch:** Điểm của chương trình ví dụ này là cho thấy cách **dùng interface của một class để làm việc khá phức tạp mà không cần biết chi tiết implementation**.

---

## API — `java.time.LocalDate` (Java 8)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static LocalDate now()` | dựng object biểu diễn ngày hiện tại |
| `static LocalDate of(int year, int month, int day)` | dựng object biểu diễn ngày cho trước |
| `int getYear()` | lấy năm của ngày này |
| `int getMonthValue()` | lấy tháng của ngày này |
| `int getDayOfMonth()` | lấy ngày trong tháng |
| `DayOfWeek getDayOfWeek()` | lấy thứ trong tuần dưới dạng instance của class `DayOfWeek`. Gọi `getValue` lên instance đó để ra số từ 1 (Monday) tới 7 (Sunday) |
| `LocalDate plusDays(int n)` | cho ra ngày **sau** ngày này `n` ngày |
| `LocalDate minusDays(int n)` | cho ra ngày **trước** ngày này `n` ngày |

---

## Bài kế tiếp

→ [[03 - Defining Your Own Classes]] — class `Employee`, constructor, `var`, `null`, implicit/explicit parameter, encapsulation, `private` method, `final` instance field.
