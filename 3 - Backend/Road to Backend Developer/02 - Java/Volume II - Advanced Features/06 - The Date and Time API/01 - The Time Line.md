# 01 — The Time Line

> Chapter 6, Section 6.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## Mở đầu chương 6

> *"Time flies like an arrow, and we can easily set a starting point and count forward and backward in seconds. So why is it so hard to deal with time? The problem is humans. All would be easy if we could just tell each other: "Meet me at 1523793600, and don't be late!" But we want time to relate to daylight and the seasons. That's where things get complicated."*

**Dịch:** Thời gian trôi như một mũi tên, và ta dễ dàng đặt một mốc bắt đầu rồi **đếm tới đếm lui theo giây**. Vậy tại sao xử lý thời gian lại khó đến thế? **Vấn đề nằm ở con người.** Mọi thứ sẽ đơn giản nếu ta chỉ cần bảo nhau: *"Gặp tôi lúc 1523793600, đừng trễ nhé!"* Nhưng ta lại muốn thời gian **gắn với ánh sáng ban ngày và các mùa**. Đó là lúc mọi thứ trở nên phức tạp.

> *"Java 1.0 had a Date class that was, in hindsight, naïve, and had most of its methods deprecated in Java 1.1 when a Calendar class was introduced. Its API wasn't stellar, its instances were mutable, and it didn't deal with issues such as leap seconds. The third time is a charm, and the java.time API introduced in Java 8 has remedied the flaws of the past and should serve us for quite some time. In this chapter, you will learn what makes time computations so vexing, and how the Date and Time API solves these issues."*

**Dịch:** Java 1.0 có class `Date` mà nhìn lại thì khá **ngây thơ**, và phần lớn method của nó bị **deprecated ở Java 1.1** khi class `Calendar` ra đời. API của `Calendar` **không xuất sắc**, instance của nó **mutable**, và nó **không xử lý được các vấn đề như leap second**. Lần thứ ba mới là lần may mắn: **`java.time` API giới thiệu ở Java 8** đã khắc phục các khiếm khuyết trong quá khứ và sẽ phục vụ ta được khá lâu. Trong chương này, bạn sẽ học **điều gì khiến các phép tính thời gian phiền phức đến vậy**, và **Date and Time API giải quyết chúng ra sao**.

---

## 6.1 The Time Line

### Giây được định nghĩa thế nào

> *"Historically, the fundamental time unit—the second—was derived from Earth's rotation around its axis. There are 24 hours or 24 × 60 × 60 = 86400 seconds in a full revolution, so it seems just a question of astronomical measurements to precisely define a second. Unfortunately, Earth wobbles slightly, and a more precise definition was needed. In 1967, a new precise definition of a second, matching the historical definition, was derived from an intrinsic property of atoms of caesium-133. Since then, a network of atomic clocks keeps the official time."*

**Dịch:** Về mặt lịch sử, đơn vị thời gian cơ bản — **giây** — được suy ra từ việc Trái Đất **quay quanh trục của nó**. Một vòng quay đầy đủ có 24 giờ, tức 24 × 60 × 60 = **86400 giây**, nên tưởng chừng chỉ cần đo đạc thiên văn là định nghĩa chính xác được một giây. Đáng tiếc, **Trái Đất lắc nhẹ**, nên cần một định nghĩa chính xác hơn. Năm **1967**, một định nghĩa mới chính xác về giây — khớp với định nghĩa lịch sử — được suy ra từ **một tính chất nội tại của nguyên tử caesium-133**. Từ đó, một **mạng lưới đồng hồ nguyên tử** giữ giờ chính thức.

### Leap second

> *"Ever so often, the official time keepers synchronize the absolute time with the rotation of Earth. At first, the official seconds were slightly adjusted, but starting in 1972, "leap seconds" were occasionally inserted. (In theory, a second might need to be removed once in a while, but that has not yet happened.)"*

**Dịch:** Thỉnh thoảng, những người giữ giờ chính thức **đồng bộ thời gian tuyệt đối với vòng quay của Trái Đất**. Ban đầu, giây chính thức được điều chỉnh nhẹ, nhưng **từ năm 1972**, thỉnh thoảng người ta **chèn thêm "leap second"**. (Về lý thuyết, đôi khi có thể cần **bỏ bớt** một giây, nhưng chuyện đó **chưa từng xảy ra**.)

> *"There is talk of changing the system again. Clearly, leap seconds are a pain, and many computer systems instead use "smoothing" where time is artificially slowed down or sped up just before the leap second, keeping 86,400 seconds per day. This works because the local time on a computer isn't all that precise, and computers are used to synchronizing themselves with an external time service."*

**Dịch:** Người ta đang bàn tới việc **đổi hệ thống lần nữa**. Rõ ràng leap second là **của nợ**, nên nhiều hệ thống máy tính thay vào đó dùng **"smoothing"**: thời gian bị **làm chậm lại hoặc tăng tốc một cách nhân tạo** ngay trước leap second, giữ nguyên **86.400 giây mỗi ngày**. Cách này chạy được vì **giờ local trên máy tính vốn không chính xác lắm**, và máy tính đã quen với việc **tự đồng bộ với một dịch vụ thời gian bên ngoài**.

### Yêu cầu của Java Date and Time API

> *"The Java Date and Time API specification requires that Java uses a time scale that"*
>
> *"• Has 86,400 seconds per day"*
> *"• Exactly matches the official time at noon each day"*
> *"• Closely matches it elsewhere, in a precisely defined way"*
>
> *"That gives Java the flexibility to adjust to future changes in the official time."*

**Dịch:** Đặc tả Java Date and Time API **yêu cầu** Java dùng một thang thời gian:

| # | Yêu cầu |
|---|---|
| 1 | Có **86.400 giây mỗi ngày** |
| 2 | **Khớp chính xác** giờ chính thức vào **buổi trưa mỗi ngày** |
| 3 | **Khớp sát** giờ chính thức ở các thời điểm khác, theo một cách được định nghĩa chính xác |

Điều đó cho Java **sự linh hoạt để thích ứng với các thay đổi trong tương lai** của giờ chính thức.

### Instant và epoch

> *"In Java, an Instant represents a point on the time line. An origin, called the epoch, is arbitrarily set at midnight of January 1, 1970 at the prime meridian that passes through the Greenwich Royal Observatory in London. This is the same convention used in the UNIX/POSIX time. Starting from that origin, time is measured in 86,400 seconds per day, forward and backward, to nanosecond precision."*

**Dịch:** Trong Java, một **`Instant` biểu diễn một điểm trên time line**. Gốc toạ độ, gọi là **epoch**, được đặt **tuỳ ý** ở **nửa đêm ngày 1 tháng 1 năm 1970** tại **kinh tuyến gốc** đi qua **Greenwich Royal Observatory** ở London. Đây cũng chính là quy ước **UNIX/POSIX time** dùng. Tính từ gốc đó, thời gian được đo theo **86.400 giây mỗi ngày**, **tiến và lùi**, với **độ chính xác nanosecond**.

> Khái niệm **epoch** đã gặp ở Volume I: [[02 - Using Predefined Classes]].

```
                      epoch
                        │
 ...◄───────────────────┼───────────────────►...
   Instant.MIN     1970-01-01T00:00Z      Instant.MAX
 (≈ 1 tỷ năm trước)   (prime meridian)   (31/12 năm 1.000.000.000)

        đo bằng 86.400 giây/ngày, độ chính xác nanosecond
```

> *"The Instant values go back as far as a billion years (Instant.MIN). That's not quite enough to express the age of the universe (around 13.5 billion years) but it should be enough for all practical purposes. After all, a billion years ago, the earth was covered in ice and populated by microscopic ancestors of today's plants and animals. The largest value, Instant.MAX, is December 31 of the year 1,000,000,000."*

**Dịch:** Giá trị `Instant` lùi được xa tới **một tỷ năm** (`Instant.MIN`). Chừng đó **chưa đủ** để biểu diễn tuổi của vũ trụ (khoảng 13,5 tỷ năm) nhưng **đủ cho mọi mục đích thực tế**. Xét cho cùng, một tỷ năm trước, Trái Đất còn phủ băng và chỉ có tổ tiên **cỡ hiển vi** của cây cỏ và động vật ngày nay. Giá trị lớn nhất, **`Instant.MAX`, là ngày 31 tháng 12 năm 1.000.000.000**.

### Instant.now và so sánh

> *"The static method call Instant.now() gives the current instant. You can compare two instants with the equals and compareTo methods in the usual way, so you can use instants as timestamps."*

**Dịch:** Lời gọi static method **`Instant.now()`** cho ra **instant hiện tại**. So sánh hai instant bằng method **`equals` và `compareTo`** theo cách thông thường, nên **dùng instant làm timestamp được**.

### Duration

> *"To find out the difference between two instants, use the static method Duration.between. For example, here is how you can measure the running time of an algorithm:"*

```java
Instant start = Instant.now();
runAlgorithm();
Instant end = Instant.now();
Duration timeElapsed = Duration.between(start, end);
long millis = timeElapsed.toMillis();
```

**Dịch:** Muốn biết **khoảng chênh giữa hai instant**, dùng static method **`Duration.between`**. Ví dụ trên đo **thời gian chạy của một thuật toán**.

> *"A Duration is the amount of time between two instants. You can get the length of a Duration in conventional units by calling toNanos, toMillis, toSeconds, toMinutes, toHours, or toDays."*

**Dịch:** **`Duration` là lượng thời gian giữa hai instant.** Lấy độ dài của một `Duration` theo đơn vị thông thường bằng cách gọi `toNanos`, `toMillis`, `toSeconds`, `toMinutes`, `toHours`, hoặc `toDays`.

> **Note (sách):** *"In Java 8, you had to call getSeconds instead of toSeconds."*
>
> **Dịch:** Ở **Java 8**, phải gọi **`getSeconds`** thay vì `toSeconds`.

### Cẩn thận overflow với nanosecond

> *"If you need nanosecond precision, be aware of overflow. A long value can hold almost 300 years of nanoseconds. If your durations are shorter than that, simply convert them to nanoseconds. You can use longer durations—a Duration object stores the number of seconds in a long, and the number of nanoseconds in an additional int. The Duration API has a number of methods, shown at the end of this section, for carrying out arithmetic."*

**Dịch:** Nếu cần độ chính xác nanosecond thì **coi chừng overflow**. Một giá trị `long` chứa được **gần 300 năm** nanosecond. Nếu duration của bạn ngắn hơn chừng đó thì cứ việc **đổi sang nanosecond**. Duration dài hơn vẫn dùng được — một object `Duration` lưu **số giây trong một `long`**, và **số nanosecond trong một `int` bổ sung**. API của `Duration` có một loạt method (xem cuối section) để **làm số học**.

> *"For example, if you want to check whether an algorithm is at least ten times faster than another, you can compute"*

```java
Duration timeElapsed2 = Duration.between(start2, end2);
boolean overTenTimesFaster
    = timeElapsed.multipliedBy(10).minus(timeElapsed2).isNegative();
```

> *"This is just to show the syntax. Since the algorithms aren't going to run for hundreds of years, you can simply use"*

```java
boolean overTenTimesFaster = timeElapsed.toNanos() * 10 < timeElapsed2.toNanos();
```

**Dịch:** Ví dụ, muốn kiểm tra một thuật toán có **nhanh hơn ít nhất mười lần** thuật toán kia không thì tính như trên. Đó **chỉ để minh hoạ cú pháp**. Vì các thuật toán này **sẽ không chạy hàng trăm năm**, nên cứ dùng cách thứ hai cho gọn.

> **Note (sách):** *"The Instant and Duration classes are immutable, and all methods, such as multipliedBy or minus, return a new instance."*
>
> **Dịch:** Class **`Instant` và `Duration` là immutable**, và **mọi method** — như `multipliedBy` hay `minus` — **đều trả về một instance mới**.

---

### Listing 6.1 — `timeline/TimeLine.java`

> *"In the example program in Listing 6.1, you can see how to use the Instant and Duration classes for timing two algorithms."*

```java
package timeline;

/**
 * @version 1.0 2016-05-10
 * @author Cay Horstmann
 */

import java.time.*;
import java.util.*;
import java.util.stream.*;

public class Timeline
{
    public static void main(String[] args)
    {
        Instant start = Instant.now();
        runAlgorithm();
        Instant end = Instant.now();
        Duration timeElapsed = Duration.between(start, end);
        long millis = timeElapsed.toMillis();
        System.out.printf("%d milliseconds\n", millis);

        Instant start2 = Instant.now();
        runAlgorithm2();
        Instant end2 = Instant.now();
        Duration timeElapsed2 = Duration.between(start2, end2);
        System.out.printf("%d milliseconds\n", timeElapsed2.toMillis());
        boolean overTenTimesFaster = timeElapsed.multipliedBy(10)
            .minus(timeElapsed2).isNegative();
        System.out.printf("The first algorithm is %smore than ten times faster",
            overTenTimesFaster ? "" : "not ");
    }

    public static void runAlgorithm()
    {
        int size = 10;
        List<Integer> list = new Random().ints().map(i -> i % 100).limit(size)
            .boxed().collect(Collectors.toList());
        Collections.sort(list);
        System.out.println(list);
    }

    public static void runAlgorithm2()
    {
        int size = 10;
        List<Integer> list = new Random().ints().map(i -> i % 100).limit(size)
            .boxed().collect(Collectors.toList());
        while (!IntStream.range(1, list.size())
                .allMatch(i -> list.get(i - 1).compareTo(list.get(i)) <= 0))
            Collections.shuffle(list);
        System.out.println(list);
    }
}
```

---

## API — `java.time.Instant` 8

| Method | Mô tả (sách) |
|---|---|
| `static Instant now()` | *"gets the current instant from the best available system clock."* — lấy instant hiện tại từ system clock tốt nhất có được. |
| `Instant plus(TemporalAmount amountToAdd)`<br>`Instant minus(TemporalAmount amountToSubtract)` | *"yields an instant that is the given amount away from this Instant."* — cho ra instant cách `Instant` này một lượng cho trước. Class `Duration` và `Period` (xem [[02 - Local Dates]]) implement interface `TemporalAmount`. |
| `Instant (plus\|minus)(Nanos\|Millis\|Seconds)(long number)` | *"yields an Instant that is the given number of nanoseconds, milliseconds, or seconds away from this Instant."* — cho ra `Instant` cách instant này số nanosecond / millisecond / giây cho trước. |

## API — `java.time.Duration` 8

| Method | Mô tả (sách) |
|---|---|
| `static Duration of(Nanos\|Millis\|Seconds\|Minutes\|Hours\|Days)(long number)` | *"yields a duration of the given number of time units."* — cho ra duration bằng số đơn vị thời gian cho trước. |
| `static Duration between(Temporal startInclusive, Temporal endExclusive)` | *"yields a duration between the given points in time."* — cho ra duration giữa hai điểm thời gian. Interface `Temporal` được implement bởi `Instant` cũng như `LocalDate`/`LocalDateTime`/`LocalTime` (xem [[04 - Local Time]]) và `ZonedDateTime` (xem [[05 - Zoned Time]]). |
| `long toNanos()`<br>`long toMillis()`<br>`long toSeconds()` 9<br>`long toMinutes()`<br>`long toHours()`<br>`long toDays()` | *"gets the number of the time units in the method name for this Duration."* — lấy số đơn vị thời gian ghi trong tên method của `Duration` này. |
| `int to(Nanos\|Millis\|Seconds\|Minutes\|Hours)Part()` 9<br>`long toDaysPart()` 9 | *"the part of the given time unit in this Duration. For example, in a duration of 100 seconds, the minutes part is 1 and the seconds part is 40."* — **phần** của đơn vị thời gian đó trong `Duration`. Ví dụ với duration 100 giây, **phần phút là 1** và **phần giây là 40**. |
| `Duration plus(TemporalAmount amountToAdd)`<br>`Duration minus(TemporalAmount amountToSubtract)` | *"yields a duration that is the given amount away from this Duration."* — cho ra duration cách `Duration` này một lượng cho trước. `Duration` và `Period` implement `TemporalAmount`. |
| `Duration multipliedBy(long multiplicand)`<br>`Duration dividedBy(long divisor)`<br>`Duration negated()` | *"yields a duration that is obtained by multiplying or dividing this Duration by the given amount, or by –1."* — cho ra duration bằng cách **nhân/chia** `Duration` này với lượng cho trước, hoặc **nhân với –1**. |
| `boolean isZero()`<br>`boolean isNegative()` | *"returns true if this Duration is zero or negative."* — trả về `true` nếu `Duration` này bằng 0 hoặc âm. |
| `Duration (plus\|minus)(Nanos\|Millis\|Seconds\|Minutes\|Hours\|Days)(long number)` | *"yields a Duration obtained by adding or subtracting the given number of time units."* — cho ra `Duration` có được bằng cách cộng/trừ số đơn vị thời gian cho trước. |

---

## Bài kế tiếp

→ [[02 - Local Dates]] — human time, `LocalDate`, `Period`, `until`, `DayOfWeek`, `datesUntil`.
