# 04 — Local Time

> Chapter 6, Section 6.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.4 Local Time

### Dựng LocalTime

> *"A LocalTime represents a time of day, such as 15:30:00. You can create an instance with the now or of methods:"*

```java
LocalTime rightNow = LocalTime.now();
LocalTime bedtime = LocalTime.of(22, 30); // or LocalTime.of(22, 30, 0)
```

**Dịch:** **`LocalTime` biểu diễn một giờ trong ngày**, ví dụ `15:30:00`. Tạo instance bằng method **`now`** hoặc **`of`**.

### plus/minus cuộn vòng 24 giờ

> *"The API notes show common operations with local times. The plus and minus operations wrap around a 24-hour day. For example,"*

```java
LocalTime wakeup = bedtime.plusHours(8); // wakeup is 6:30:00
```

**Dịch:** Phần API notes cho thấy các thao tác thông dụng với local time. Phép **`plus` và `minus` cuộn vòng quanh một ngày 24 giờ**. Ví dụ trên: `22:30` cộng 8 giờ ra **`6:30:00`**.

> **Note (sách):** *"LocalTime doesn't concern itself with AM/PM. That silliness is left to a formatter—see Section 6.6, "Formatting and Parsing," on p. 371."*
>
> **Dịch:** **`LocalTime` không bận tâm tới AM/PM.** Cái **trò ngớ ngẩn** đó được để lại cho **formatter** — xem [[06 - Formatting and Parsing]].

### LocalDateTime

> *"There is a LocalDateTime class representing a date and time. That class is suitable for storing points in time in a fixed time zone—for example, for a schedule of classes or events. However, if you need to make calculations that span the daylight savings time, or if you need to deal with users in different time zones, you should use the ZonedDateTime class that we discuss next."*

**Dịch:** Có class **`LocalDateTime`** biểu diễn **một ngày kèm giờ**. Class đó **phù hợp để lưu các điểm thời gian trong một time zone cố định** — ví dụ lịch học hoặc lịch sự kiện. Tuy nhiên, nếu bạn cần **tính toán vắt qua daylight savings time**, hoặc phải **xử lý người dùng ở các time zone khác nhau**, thì nên dùng class **`ZonedDateTime`** bàn ở phần kế tiếp.

| Class | Dùng khi |
|---|---|
| **`LocalDateTime`** | lưu điểm thời gian trong **một time zone cố định** (lịch học, lịch sự kiện) |
| **`ZonedDateTime`** | tính toán **vắt qua daylight savings time**, hoặc người dùng ở **nhiều time zone** |

---

## API — `java.time.LocalTime` 8

| Method | Mô tả (sách) |
|---|---|
| `static LocalTime now()` | *"gets the current LocalTime."* |
| `static LocalTime of(int hour, int minute)`<br>`static LocalTime of(int hour, int minute, int second)`<br>`static LocalTime of(int hour, int minute, int second, int nanoOfSecond)` | *"yields a local time with the given hour (between 0 and 23), minute, second (between 0 and 59), and nanosecond (between 0 and 999,999,999)."* — cho ra local time với giờ (0–23), phút, giây (0–59), và nanosecond (0–999.999.999). |
| `LocalTime (plus\|minus)(Hours\|Minutes\|Seconds\|Nanos)(long number)` | *"yields a LocalTime obtained by adding or subtracting the given number of time units."* |
| `LocalTime plus(TemporalAmount amountToAdd)`<br>`LocalTime minus(TemporalAmount amountToSubtract)` | *"yields a LocalTime that is the given amount away from this LocalTime."* |
| `LocalTime with(Hour\|Minute\|Second\|Nano)(int value)` | *"returns a new LocalTime with the hour, minute, second, or nanosecond changed to the given value."* |
| `int getHour()` | *"gets the hour (between 0 and 23)."* |
| `int getMinute()`<br>`int getSecond()` | *"gets the minute or second (between 0 and 59)."* |
| `int getNano()` | *"gets the nanoseconds (between 0 and 999,999,999)."* |
| `int toSecondOfDay()`<br>`long toNanoOfDay()` | *"yields the seconds or nanoseconds since midnight."* — cho ra số giây hoặc nanosecond **kể từ nửa đêm**. |
| `boolean isBefore(LocalTime other)`<br>`boolean isAfter(LocalTime other)` | *"returns true if this date is before or after the given date."* |

---

## Bài kế tiếp

→ [[05 - Zoned Time]] — `ZoneId`, `ZonedDateTime`, daylight savings time, `OffsetDateTime`.
