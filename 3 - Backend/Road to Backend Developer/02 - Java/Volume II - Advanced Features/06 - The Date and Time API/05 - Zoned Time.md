# 05 — Zoned Time

> Chapter 6, Section 6.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.5 Zoned Time

### Time zone là chuyện của con người

> *"Time zones, perhaps because they are an entirely human creation, are even messier than the complications caused by the earth's irregular rotation. In a rational world, we'd all follow the clock in Greenwich, and some of us would eat our lunch at 02:00, others at 22:00. Our stomachs would figure it out. This is actually done in China, which spans four conventional time zones. Elsewhere, we have time zones with irregular and shifting boundaries and, to make matters worse, the daylight savings time."*

**Dịch:** **Time zone**, có lẽ vì **hoàn toàn do con người tạo ra**, còn **lộn xộn hơn** cả những rắc rối do vòng quay bất thường của Trái Đất. Trong một thế giới duy lý, tất cả chúng ta sẽ theo **đồng hồ ở Greenwich**, và một số người ăn trưa lúc **02:00**, số khác lúc **22:00**. Dạ dày chúng ta rồi sẽ quen thôi. Chuyện này **thực sự đang được làm ở Trung Quốc**, nước trải dài qua **bốn time zone quy ước**. Ở nơi khác, ta có các time zone với **biên giới bất thường và dịch chuyển**, và **tệ hơn nữa** là **daylight savings time**.

> *"As capricious as the time zones may appear to the enlightened, they are a fact of life. When you implement a calendar application, it needs to work for people who fly from one country to another. When you have a conference call at 10:00 in New York, but happen to be in Berlin, you expect to be alerted at the correct local time."*

**Dịch:** Dù time zone có vẻ **tuỳ tiện** trong mắt người sáng suốt, chúng vẫn là **một thực tế của đời sống**. Khi bạn implement một ứng dụng lịch, nó phải **chạy được cho người bay từ nước này sang nước khác**. Khi bạn có conference call lúc **10:00 ở New York** nhưng đang ở **Berlin**, bạn mong được **nhắc đúng giờ local**.

### IANA database và ZoneId

> *"The Internet Assigned Numbers Authority (IANA) keeps a database of all known time zones around the world (www.iana.org/time-zones), which is updated several times per year. The bulk of the updates deals with the changing rules for daylight savings time. Java uses the IANA database."*

**Dịch:** **IANA (Internet Assigned Numbers Authority)** duy trì một **database mọi time zone** đã biết trên thế giới (`www.iana.org/time-zones`), được **cập nhật vài lần mỗi năm**. **Phần lớn các cập nhật** liên quan tới **quy tắc daylight savings time thay đổi**. **Java dùng database của IANA.**

> *"Each time zone has an ID, such as America/New_York or Europe/Berlin. To find out all available time zones, call ZoneId.getAvailableZoneIds. At the time of this writing, there are almost 600 IDs."*

**Dịch:** Mỗi time zone có một **ID**, ví dụ `America/New_York` hay `Europe/Berlin`. Muốn biết **tất cả time zone có sẵn**, gọi **`ZoneId.getAvailableZoneIds`**. Tại thời điểm viết sách, có **gần 600 ID**.

### Dựng ZonedDateTime

> *"Given a time zone ID, the static method ZoneId.of(id) yields a ZoneId object. You can use that object to turn a LocalDateTime object into a ZonedDateTime object by calling local.atZone(zoneId), or you can construct a ZonedDateTime by calling the static method ZonedDateTime.of(year, month, day, hour, minute, second, nano, zoneId). For example,"*

```java
ZonedDateTime apollo11launch = ZonedDateTime.of(1969, 7, 16, 9, 32, 0, 0,
    ZoneId.of("America/New_York"));
    // 1969-07-16T09:32-04:00[America/New_York]
```

**Dịch:** Cho một time zone ID, static method **`ZoneId.of(id)`** cho ra một object **`ZoneId`**. Dùng object đó để **biến một `LocalDateTime` thành `ZonedDateTime`** bằng cách gọi **`local.atZone(zoneId)`**, hoặc **dựng thẳng một `ZonedDateTime`** bằng static method **`ZonedDateTime.of(...)`**.

> *"This is a specific instant in time. Call apollo11launch.toInstant to get the Instant. Conversely, if you have an instant in time, call instant.atZone(ZoneId.of("UTC")) to get the ZonedDateTime at the Greenwich Royal Observatory, or use another ZoneId to get it elsewhere on the planet."*

**Dịch:** Đây là **một instant cụ thể trong thời gian**. Gọi **`apollo11launch.toInstant`** để lấy **`Instant`**. Ngược lại, nếu bạn có một instant, gọi **`instant.atZone(ZoneId.of("UTC"))`** để lấy `ZonedDateTime` tại **Greenwich Royal Observatory**, hoặc dùng một **`ZoneId`** khác để lấy nó ở nơi khác trên hành tinh.

```
   LocalDateTime ──── local.atZone(zoneId) ────►  ZonedDateTime
                                                       │
                                            toInstant  │  ▲  instant.atZone(zoneId)
                                                       ▼  │
                                                    Instant
                                             (điểm trên time line)
```

> **Note (sách):** *"UTC stands for "Coordinated Universal Time," and the acronym is a compromise between the aforementioned English and the French "Temps Universel Coordiné," having the distinction of being incorrect in either language. UTC is the time at the Greenwich Royal Observatory, without daylight savings time."*
>
> **Dịch:** **UTC** viết tắt cho **"Coordinated Universal Time"**, và cụm viết tắt này là một **thoả hiệp** giữa tên tiếng Anh nói trên và tên tiếng Pháp **"Temps Universel Coordiné"**, mang cái **đặc điểm là sai trong cả hai ngôn ngữ**. **UTC là giờ tại Greenwich Royal Observatory, không có daylight savings time.**

### Rắc rối do daylight savings time

> *"Many of the methods of ZonedDateTime are the same as those of LocalDateTime (see the API notes at the end of this section). Most are straightforward, but daylight savings time introduces some complications."*

**Dịch:** Nhiều method của **`ZonedDateTime` giống hệt** của `LocalDateTime` (xem API notes cuối section). Hầu hết đều đơn giản, nhưng **daylight savings time gây ra vài rắc rối**.

#### Giờ bị nhảy qua

> *"When daylight savings time starts, clocks advance by an hour. What happens when you construct a time that falls into the skipped hour? For example, in 2013, Central Europe switched to daylight savings time on March 31 at 2:00. If you try to construct nonexistent time March 31 2:30, you actually get 3:30."*

```java
ZonedDateTime skipped = ZonedDateTime.of(
    LocalDate.of(2013, 3, 31),
    LocalTime.of(2, 30),
    ZoneId.of("Europe/Berlin"));
    // Constructs March 31 3:30
```

**Dịch:** Khi daylight savings time **bắt đầu**, đồng hồ **nhảy tới một giờ**. Chuyện gì xảy ra khi bạn dựng một thời điểm **rơi vào giờ bị bỏ qua**? Ví dụ, năm 2013, Trung Âu chuyển sang daylight savings time vào **31 tháng 3 lúc 2:00**. Nếu bạn thử dựng thời điểm **không tồn tại 31/3 2:30**, thực tế bạn **nhận được 3:30**.

#### Giờ bị lặp lại

> *"Conversely, when daylight time ends, clocks are set back by an hour, and there are two instants with the same local time! When you construct a time within that span, you get the earlier of the two."*

```java
ZonedDateTime ambiguous = ZonedDateTime.of(
    LocalDate.of(2013, 10, 27), // End of daylight savings time
    LocalTime.of(2, 30),
    ZoneId.of("Europe/Berlin"));
    // 2013-10-27T02:30+02:00[Europe/Berlin]
ZonedDateTime anHourLater = ambiguous.plusHours(1);
    // 2013-10-27T02:30+01:00[Europe/Berlin]
```

> *"An hour later, the time has the same hours and minutes, but the zone offset has changed."*

**Dịch:** Ngược lại, khi daylight time **kết thúc**, đồng hồ bị **vặn lùi một giờ**, và có **hai instant mang cùng một local time**! Khi bạn dựng một thời điểm nằm trong khoảng đó, bạn nhận được **cái sớm hơn trong hai cái**. **Một giờ sau, thời điểm vẫn có cùng giờ và phút, nhưng zone offset đã thay đổi.**

#### Cộng ngày qua ranh giới DST

> *"You also need to pay attention when adjusting a date across daylight savings time boundaries. For example, if you set a meeting for next week, don't add a duration of seven days:"*

```java
ZonedDateTime nextMeeting = meeting.plus(Duration.ofDays(7));
    // Caution! Won't work with daylight savings time
```

> *"Instead, use the Period class."*

```java
ZonedDateTime nextMeeting = meeting.plus(Period.ofDays(7)); // OK
```

**Dịch:** Bạn cũng cần **chú ý khi chỉnh một ngày vắt qua ranh giới daylight savings time**. Ví dụ, khi đặt một cuộc họp cho tuần sau, **đừng cộng một duration bảy ngày**. Thay vào đó, **dùng class `Period`**.

| Cách viết | Kết quả |
|---|---|
| `meeting.plus(Duration.ofDays(7))` | **Cẩn thận!** Không chạy đúng với daylight savings time |
| `meeting.plus(Period.ofDays(7))` | **OK** |

> **Caution (sách):** *"There is also an OffsetDateTime class that represents times with an offset from UTC, but without time zone rules. That class is intended for specialized applications that specifically require the absence of those rules, such as certain network protocols. For human time, use ZonedDateTime."*
>
> **Dịch:** Còn có class **`OffsetDateTime`** biểu diễn thời điểm với **một offset so với UTC**, nhưng **không có time zone rule**. Class đó dành cho **các ứng dụng chuyên biệt đòi hỏi đúng việc vắng mặt các rule đó**, chẳng hạn **một số network protocol**. **Với human time, dùng `ZonedDateTime`.**

---

### Listing 6.3 — `zonedtimes/ZonedTimes.java`

> *"The example program in Listing 6.3 demonstrates the ZonedDateTime class."*

```java
package zonedtimes;

/**
 * @version 1.0 2016-05-10
 * @author Cay Horstmann
 */

import java.time.*;

public class ZonedTimes
{
    public static void main(String[] args)
    {
        ZonedDateTime apollo11launch = ZonedDateTime.of(1969, 7, 16, 9, 32, 0, 0,
            ZoneId.of("America/New_York")); // 1969-07-16T09:32-04:00[America/New_York]
        System.out.println("apollo11launch: " + apollo11launch);

        Instant instant = apollo11launch.toInstant();
        System.out.println("instant: " + instant);

        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("UTC"));
        System.out.println("zonedDateTime: " + zonedDateTime);

        ZonedDateTime skipped = ZonedDateTime.of(LocalDate.of(2013, 3, 31),
            LocalTime.of(2, 30), ZoneId.of("Europe/Berlin")); // Constructs March 31 3:30
        System.out.println("skipped: " + skipped);

        ZonedDateTime ambiguous = ZonedDateTime.of(
            LocalDate.of(2013, 10, 27), // End of daylight savings time
            LocalTime.of(2, 30), ZoneId.of("Europe/Berlin"));
            // 2013-10-27T02:30+02:00[Europe/Berlin]
        ZonedDateTime anHourLater = ambiguous.plusHours(1);
            // 2013-10-27T02:30+01:00[Europe/Berlin]
        System.out.println("ambiguous: " + ambiguous);
        System.out.println("anHourLater: " + anHourLater);

        ZonedDateTime meeting = ZonedDateTime.of(LocalDate.of(2013, 10, 31),
            LocalTime.of(14, 30), ZoneId.of("America/Los_Angeles"));
        System.out.println("meeting: " + meeting);
        ZonedDateTime nextMeeting = meeting.plus(Duration.ofDays(7));
            // Caution! Won't work with daylight savings time
        System.out.println("nextMeeting: " + nextMeeting);
        nextMeeting = meeting.plus(Period.ofDays(7)); // OK
        System.out.println("nextMeeting: " + nextMeeting);
    }
}
```

---

## API — `java.time.ZonedDateTime` 8

| Method | Mô tả (sách) |
|---|---|
| `static ZonedDateTime now()` | *"gets the current ZonedDateTime."* |
| `static ZonedDateTime of(int year, int month, int dayOfMonth, int hour, int minute, int second, int nanoOfSecond, ZoneId zone)`<br>`static ZonedDateTime of(LocalDate date, LocalTime time, ZoneId zone)`<br>`static ZonedDateTime of(LocalDateTime localDateTime, ZoneId zone)`<br>`static ZonedDateTime ofInstant(Instant instant, ZoneId zone)` | *"yields a ZonedDateTime with the given parameters and time zone."* |
| `ZonedDateTime (plus\|minus)(Days\|Weeks\|Months\|Years\|Hours\|Minutes\|Seconds\|Nanos)(long number)` | *"yields a ZonedDateTime obtained by adding or subtracting the given number of time units."* |
| `ZonedDateTime plus(TemporalAmount amountToAdd)`<br>`ZonedDateTime minus(TemporalAmount amountToSubtract)` | *"yields a ZonedDateTime that is the given amount away from this ZonedDateTime."* |
| `ZonedDateTime with(DayOfMonth\|DayOfYear\|Month\|Year\|Hour\|Minute\|Second\|Nano)(int value)` | *"returns a new ZonedDateTime with the given temporal unit replaced by the given value."* |
| `ZonedDateTime withZoneSameInstant(ZoneId zone)`<br>`ZonedDateTime withZoneSameLocal(ZoneId zone)` | *"returns a new ZonedDateTime in the given time zone, either representing the same instant or the same local time."* — trả về `ZonedDateTime` mới ở time zone cho trước, biểu diễn **cùng instant** hoặc **cùng local time**. |
| `int getDayOfMonth()` | *"gets the day of the month (between 1 and 31)."* |
| `int getDayOfYear()` | *"gets the day of the year (between 1 and 366)."* |
| `DayOfWeek getDayOfWeek()` | *"gets the day of the week, returning a value of the DayOfWeek enumeration."* |
| `Month getMonth()`<br>`int getMonthValue()` | *"gets the month as a value of the Month enumeration, or as a number between 1 and 12."* |
| `int getYear()` | *"gets the year, between –999,999,999 and 999,999,999."* |
| `int getHour()` | *"gets the hour (between 0 and 23)."* |
| `int getMinute()`<br>`int getSecond()` | *"gets the minute or second (between 0 and 59)."* |
| `int getNano()` | *"gets the nanoseconds (between 0 and 999,999,999)."* |
| `public ZoneOffset getOffset()` | *"gets the offset from UTC. Offsets can vary from –12:00 to +14:00. Some time zones have fractional offsets. Offsets change with daylight savings time."* — lấy offset so với UTC. Offset dao động từ **–12:00 tới +14:00**. Một số time zone có **offset lẻ**. Offset **đổi theo daylight savings time**. |
| `LocalDate toLocalDate()`<br>`LocalTime toLocalTime()`<br>`LocalDateTime toLocalDateTime()`<br>`Instant toInstant()` | *"yields the local date, time, or date/time, or the corresponding instant."* |
| `boolean isBefore(ChronoZonedDateTime other)`<br>`boolean isAfter(ChronoZonedDateTime other)` | *"returns true if this zoned date/time is before or after the given zoned date/time."* |

---

## Bài kế tiếp

→ [[06 - Formatting and Parsing]] — `DateTimeFormatter`, standard formatter, locale-specific formatter, custom pattern, `parse`.
