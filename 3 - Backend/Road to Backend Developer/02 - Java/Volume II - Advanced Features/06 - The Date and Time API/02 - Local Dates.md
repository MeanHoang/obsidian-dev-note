# 02 — Local Dates

> Chapter 6, Section 6.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.2 Local Dates

### Hai loại human time

> *"Now let us turn from absolute time to human time. There are two kinds of human time in the Java API, local date/time and zoned time. Local date/time has a date and/or time of day, but no associated time zone information. An example of a local date is June 14, 1903 (the day on which Alonzo Church, inventor of the lambda calculus, was born). Since that date has neither a time of day nor time zone information, it does not correspond to a precise instant of time. In contrast, July 16, 1969, 09:32:00 EDT (the launch of Apollo 11) is a zoned date/time, representing a precise instant on the time line."*

**Dịch:** Giờ ta chuyển từ **absolute time** sang **human time**. Java API có **hai loại human time**: **local date/time** và **zoned time**. **Local date/time** có ngày và/hoặc giờ trong ngày, **nhưng không kèm thông tin time zone**. Ví dụ một local date là **14 tháng 6, 1903** (ngày Alonzo Church, người phát minh lambda calculus, ra đời). Vì ngày đó **không có giờ trong ngày lẫn thông tin time zone**, nó **không ứng với một instant chính xác nào**. Ngược lại, **16 tháng 7, 1969, 09:32:00 EDT** (thời điểm phóng Apollo 11) là một **zoned date/time**, biểu diễn **một instant chính xác trên time line**.

```
 local date/time                     zoned date/time
 June 14, 1903                       July 16, 1969, 09:32:00 EDT
 (không time zone)                   (có time zone)
        │                                    │
        ▼                                    ▼
 KHÔNG ứng với một                    LÀ một instant chính xác
 instant chính xác                    trên time line
```

### Vì sao nên tránh zoned time

> *"There are many calculations where time zones are not required, and in some cases they can even be a hindrance. Suppose you schedule a meeting every week at 10:00. If you add 7 days (that is, 7 × 24 × 60 × 60 seconds) to the last zoned time, and you happen to cross the daylight savings time boundary, the meeting will be an hour too early or too late!"*

**Dịch:** Có **rất nhiều phép tính không cần time zone**, và đôi khi time zone còn **gây vướng**. Giả sử bạn xếp một cuộc họp **mỗi tuần lúc 10:00**. Nếu bạn **cộng 7 ngày** (tức 7 × 24 × 60 × 60 giây) vào zoned time lần trước, mà lại **vắt qua ranh giới daylight savings time**, thì cuộc họp sẽ **sớm hoặc muộn mất một giờ**!

> *"For that reason, the API designers recommend that you do not use zoned time unless you really want to represent absolute time instances. Birthdays, holidays, schedule times, and so on are usually best represented as local dates or times."*

**Dịch:** Vì lý do đó, **người thiết kế API khuyến nghị đừng dùng zoned time** trừ khi bạn **thực sự muốn biểu diễn absolute time instance**. **Sinh nhật, ngày lễ, giờ theo lịch trình**, v.v. thường **tốt nhất là biểu diễn bằng local date hoặc local time**.

### Dựng LocalDate

> *"A LocalDate is a date with a year, month, and day of the month. To construct one, you can use the now or of static methods:"*

```java
LocalDate today = LocalDate.now(); // Today's date
LocalDate alonzosBirthday = LocalDate.of(1903, 6, 14);
alonzosBirthday = LocalDate.of(1903, Month.JUNE, 14);
    // Uses the Month enumeration
```

**Dịch:** **`LocalDate` là một ngày gồm năm, tháng và ngày trong tháng.** Để dựng một `LocalDate`, dùng static method **`now`** hoặc **`of`**.

> `LocalDate` đã học ở Volume I: [[02 - Using Predefined Classes]]. Về enumeration class như `Month`, xem [[07 - Enumeration Classes]].

> *"Unlike the irregular conventions in UNIX and java.util.Date, where months are zero-based and years are counted from 1900, here you supply the usual numbers for the month of year. Alternatively, you can use the Month enumeration."*

**Dịch:** Khác với các quy ước **bất thường** ở UNIX và `java.util.Date` — nơi **tháng đếm từ 0** và **năm đếm từ 1900** — ở đây bạn đưa vào **các con số thông thường** cho tháng trong năm. Hoặc dùng **enumeration `Month`**.

> *"The API notes at the end of this section show the most useful methods for working with LocalDate objects."*

**Dịch:** Phần API notes cuối section liệt kê các method hữu dụng nhất khi làm việc với object `LocalDate`.

### Programmer's Day

> *"For example, Programmer's Day is the 256th day of the year. Here is how you can easily compute it:"*

```java
LocalDate programmersDay = LocalDate.of(2014, 1, 1).plusDays(255);
    // September 13, but in a leap year it would be September 12
```

**Dịch:** Ví dụ, **Programmer's Day là ngày thứ 256 của năm**. Tính như trên: ra **13 tháng 9**, nhưng **vào năm nhuận thì là 12 tháng 9**.

### Period

> *"Recall that the difference between two time instants is a Duration. The equivalent for local dates is a Period, which expresses a number of elapsed years, months, or days. You can call birthday.plus(Period.ofYears(1)) to get the birthday next year. Of course, you can also just call birthday.plusYears(1). But birthday.plus(Period.ofDays(365)) won't produce the correct result in a leap year."*

**Dịch:** Nhớ lại: chênh lệch giữa hai time instant là một **`Duration`**. Thứ tương đương cho local date là **`Period`**, diễn tả **số năm, tháng, hoặc ngày đã trôi qua**. Gọi `birthday.plus(Period.ofYears(1))` để lấy sinh nhật năm sau. Tất nhiên cũng chỉ cần gọi `birthday.plusYears(1)`. Nhưng `birthday.plus(Period.ofDays(365))` sẽ **không cho kết quả đúng vào năm nhuận**.

| Kiểu chênh lệch | Dùng cho |
|---|---|
| **`Duration`** | giữa hai **`Instant`** (absolute time) |
| **`Period`** | giữa hai **local date** — số năm/tháng/ngày đã trôi qua |

### until

> *"The until method yields the difference between two local dates. For example,"*

```java
independenceDay.until(christmas)
```

> *"yields a period of 5 months and 21 days. That is actually not terribly useful because the number of days per month varies. To find the number of days, use"*

```java
independenceDay.until(christmas, ChronoUnit.DAYS) // 174 days
```

**Dịch:** Method **`until`** cho ra **chênh lệch giữa hai local date**. Ví dụ trên cho ra một period **5 tháng 21 ngày**. Cái đó thực ra **không hữu dụng lắm** vì **số ngày mỗi tháng khác nhau**. Muốn biết **số ngày**, dùng `until` với **`ChronoUnit.DAYS`** → **174 ngày**.

### Cẩn thận: ngày không tồn tại

> **Caution (sách):** *"Some methods in the LocalDate API could potentially create nonexistent dates. For example, adding one month to January 31 should not yield February 31. Instead of throwing an exception, these methods return the last valid day of the month. For example,"*
>
> ```java
> LocalDate.of(2016, 1, 31).plusMonths(1)
> ```
>
> *"and"*
>
> ```java
> LocalDate.of(2016, 3, 31).minusMonths(1)
> ```
>
> *"yield February 29, 2016."*
>
> **Dịch:** Một số method trong API của `LocalDate` **có thể tạo ra ngày không tồn tại**. Ví dụ, cộng một tháng vào **31 tháng 1** thì **không nên** ra 31 tháng 2. Thay vì **ném exception**, các method này **trả về ngày hợp lệ cuối cùng của tháng**. Cả hai ví dụ trên đều cho ra **29 tháng 2, 2016**.

### getDayOfWeek và DayOfWeek

> *"The getDayOfWeek yields the weekday, as a value of the DayOfWeek enumeration. DayOfWeek.MONDAY has the numerical value 1, and DayOfWeek.SUNDAY has the value 7. For example,"*

```java
LocalDate.of(1900, 1, 1).getDayOfWeek().getValue()
```

> *"yields 1. The DayOfWeek enumeration has convenience methods plus and minus to compute weekdays modulo 7. For example, DayOfWeek.SATURDAY.plus(3) yields DayOfWeek.TUESDAY."*

**Dịch:** **`getDayOfWeek`** cho ra **thứ trong tuần**, dưới dạng một giá trị của enumeration **`DayOfWeek`**. **`DayOfWeek.MONDAY` có giá trị số là 1**, và **`DayOfWeek.SUNDAY` là 7**. Ví dụ trên cho ra **1**. Enumeration `DayOfWeek` có các method tiện lợi **`plus` và `minus`** để tính thứ trong tuần **theo modulo 7**. Ví dụ, `DayOfWeek.SATURDAY.plus(3)` cho ra **`DayOfWeek.TUESDAY`**.

> **Note (sách):** *"The weekend days actually come at the end of the week. This is different from java.util.Calendar where Sunday has value 1 and Saturday value 7."*
>
> **Dịch:** **Ngày cuối tuần thực sự nằm ở cuối tuần.** Điều này **khác với `java.util.Calendar`**, nơi **Chủ nhật có giá trị 1** và **Thứ bảy có giá trị 7**.

### datesUntil (Java 9)

> *"Java 9 adds two useful methods datesUntil that yield streams of LocalDate objects."*

```java
LocalDate start = LocalDate.of(2000, 1, 1);
LocalDate endExclusive = LocalDate.now();
Stream<LocalDate> allDays = start.datesUntil(endExclusive);
Stream<LocalDate> firstDaysInMonth = start.datesUntil(endExclusive, Period.ofMonths(1));
```

**Dịch:** **Java 9** thêm hai method hữu dụng tên **`datesUntil`**, cho ra **stream các object `LocalDate`**.

### Partial date

> *"In addition to LocalDate, there are also classes MonthDay, YearMonth, and Year to describe partial dates. For example, December 25 (with the year unspecified) can be represented as a MonthDay."*

**Dịch:** Ngoài `LocalDate`, còn có class **`MonthDay`, `YearMonth`, và `Year`** để mô tả **partial date**. Ví dụ, **25 tháng 12** (không chỉ định năm) biểu diễn được bằng một **`MonthDay`**.

---

### Listing 6.2 — `localdates/LocalDates.java`

> *"The example program in Listing 6.2 shows how to work with the LocalDate class."*

```java
package localdates;

/**
 * @version 1.0 2016-05-10
 * @author Cay Horstmann
 */
import java.time.*;
import java.time.temporal.*;
import java.util.stream.*;

public class LocalDates
{
    public static void main(String[] args)
    {
        LocalDate today = LocalDate.now(); // Today's date
        System.out.println("today: " + today);

        LocalDate alonzosBirthday = LocalDate.of(1903, 6, 14);
        alonzosBirthday = LocalDate.of(1903, Month.JUNE, 14);
            // Uses the Month enumeration
        System.out.println("alonzosBirthday: " + alonzosBirthday);

        LocalDate programmersDay = LocalDate.of(2018, 1, 1).plusDays(255);
            // September 13, but in a leap year it would be September 12
        System.out.println("programmersDay: " + programmersDay);

        LocalDate independenceDay = LocalDate.of(2018, Month.JULY, 4);
        LocalDate christmas = LocalDate.of(2018, Month.DECEMBER, 25);

        System.out.println("Until christmas: " + independenceDay.until(christmas));
        System.out.println("Until christmas: "
            + independenceDay.until(christmas, ChronoUnit.DAYS));

        System.out.println(LocalDate.of(2016, 1, 31).plusMonths(1));
        System.out.println(LocalDate.of(2016, 3, 31).minusMonths(1));

        DayOfWeek startOfLastMillennium = LocalDate.of(1900, 1, 1).getDayOfWeek();
        System.out.println("startOfLastMillennium: " + startOfLastMillennium);
        System.out.println(startOfLastMillennium.getValue());
        System.out.println(DayOfWeek.SATURDAY.plus(3));

        LocalDate start = LocalDate.of(2000, 1, 1);
        LocalDate endExclusive = LocalDate.now();
        Stream<LocalDate> firstDaysInMonth = start.datesUntil(endExclusive, Period.ofMonths(1));
        System.out.println("firstDaysInMonth: "
            + firstDaysInMonth.collect(Collectors.toList()));
    }
}
```

---

## API — `java.time.LocalDate` 8

| Method | Mô tả (sách) |
|---|---|
| `static LocalDate now()` | *"gets the current LocalDate."* — lấy `LocalDate` hiện tại. |
| `static LocalDate of(int year, int month, int dayOfMonth)`<br>`static LocalDate of(int year, Month month, int dayOfMonth)` | *"yields a local date with the given year, month (as integer between 1 and 12 or a value of the Month enumeration), and day of the month (between 1 and 31)."* — cho ra local date với năm, tháng (số nguyên 1–12 hoặc giá trị enumeration `Month`), và ngày trong tháng (1–31). |
| `LocalDate (plus\|minus)(Days\|Weeks\|Months\|Years)(long number)` | *"yields a LocalDate obtained by adding or subtracting the given number of time units."* — cho ra `LocalDate` bằng cách cộng/trừ số đơn vị thời gian cho trước. |
| `LocalDate plus(TemporalAmount amountToAdd)`<br>`LocalDate minus(TemporalAmount amountToSubtract)` | *"yields a LocalDate that is the given amount away from this LocalDate."* — cho ra `LocalDate` cách `LocalDate` này một lượng cho trước. `Duration` và `Period` implement `TemporalAmount`. |
| `LocalDate withDayOfMonth(int dayOfMonth)`<br>`LocalDate withDayOfYear(int dayOfYear)`<br>`LocalDate withMonth(int month)`<br>`LocalDate withYear(int year)` | *"returns a new LocalDate with the day of month, day of year, month, or year changed to the given value."* — trả về `LocalDate` **mới** với ngày trong tháng / ngày trong năm / tháng / năm đổi thành giá trị cho trước. |
| `int getDayOfMonth()` | *"gets the day of the month (between 1 and 31)."* |
| `int getDayOfYear()` | *"gets the day of the year (between 1 and 366)."* |
| `DayOfWeek getDayOfWeek()` | *"gets the day of the week, returning a value of the DayOfWeek enumeration."* |
| `Month getMonth()`<br>`int getMonthValue()` | *"gets the month as a value of the Month enumeration, or as a number between 1 and 12."* |
| `int getYear()` | *"gets the year, between –999,999,999 and 999,999,999."* |
| `Period until(ChronoLocalDate endDateExclusive)` | *"gets the period until the given end date. The ChronoLocalDate interface is implemented by LocalDate and date classes for non-Gregorian calendars."* — lấy period tới ngày kết thúc cho trước. Interface `ChronoLocalDate` được implement bởi `LocalDate` và các class ngày của **lịch không phải Gregorian**. |
| `boolean isBefore(ChronoLocalDate other)`<br>`boolean isAfter(ChronoLocalDate other)` | *"returns true if this date is before or after the given date."* |
| `boolean isLeapYear()` | *"returns true if the year is a leap year—that is, if it is divisible by 4 but not by 100, or divisible by 400. The algorithm is applied for all past years, even though that is historically inaccurate. (Leap years were invented in the year –46, and the rules involving divisibility by 100 and 400 were introduced in the Gregorian calendar reform of 1582. The reform took over 300 years to become universal.)"* — trả về `true` nếu năm là **năm nhuận**: chia hết cho 4 nhưng không chia hết cho 100, hoặc chia hết cho 400. Thuật toán này **áp dụng cho mọi năm trong quá khứ**, dù **không đúng về mặt lịch sử**. |
| `Stream<LocalDate> datesUntil(LocalDate endExclusive)` 9<br>`Stream<LocalDate> datesUntil(LocalDate endExclusive, Period step)` 9 | *"yields a stream of dates from this LocalDate until the end, with step size 1 or the given period."* — cho ra stream các ngày từ `LocalDate` này tới điểm kết thúc, với **bước 1** hoặc **bước bằng period cho trước**. |

## API — `java.time.Period` 8

| Method | Mô tả (sách) |
|---|---|
| `static Period of(int years, int months, int days)`<br>`Period of(Days\|Weeks\|Months\|Years)(int number)` | *"yields a Period with the given number of time units."* — cho ra `Period` với số đơn vị thời gian cho trước. |
| `int get(Days\|Months\|Years)()` | *"gets the days, months, or years of this Period."* |
| `Period (plus\|minus)(Days\|Months\|Years)(long number)` | *"yields a Period obtained by adding or subtracting the given number of time units."* |
| `Period plus(TemporalAmount amountToAdd)`<br>`Period minus(TemporalAmount amountToSubtract)` | *"yields an instant that is the given amount away from this Instant. The classes Duration and Period implement the TemporalAmount interface."* |
| `Period with(Days\|Months\|Years)(int number)` | *"returns a new Period with the days, months, or years changed to the given number."* |

> *(Chép nguyên văn bản in trang 363: mô tả của `Period plus`/`minus(TemporalAmount)` sách in là "yields an instant that is the given amount away from this Instant" dù đang nói về `Period` chứ không phải `Instant` — đây là typo của bản in.)*

---

## Bài kế tiếp

→ [[03 - Date Adjusters]] — `TemporalAdjusters`, method `with`, tự viết `TemporalAdjuster`.
