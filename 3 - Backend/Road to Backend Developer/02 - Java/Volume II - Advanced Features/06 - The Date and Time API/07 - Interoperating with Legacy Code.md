# 07 — Interoperating with Legacy Code

> Chapter 6, Section 6.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.7 Interoperating with Legacy Code

> *"As a new creation, the Java Date and Time API will have to interoperate with existing classes—in particular, the ubiquitous java.util.Date, java.util.GregorianCalendar, and java.sql.Date/Time/Timestamp."*

**Dịch:** Là một **sáng tạo mới**, Java Date and Time API **phải phối hợp được với các class đã tồn tại** — cụ thể là **`java.util.Date`** (có mặt khắp nơi), **`java.util.GregorianCalendar`**, và **`java.sql.Date`/`Time`/`Timestamp`**.

### Instant ↔ java.util.Date

> *"The Instant class is a close analog to java.util.Date. In Java 8, that class has two added methods: the toInstant method that converts a Date to an Instant, and the static from method that converts in the other direction."*

**Dịch:** Class **`Instant` là bản tương ứng sát nhất với `java.util.Date`**. Ở **Java 8**, class đó **được thêm hai method**: method **`toInstant`** chuyển một `Date` thành một `Instant`, và **static method `from`** chuyển **theo chiều ngược lại**.

### ZonedDateTime ↔ GregorianCalendar

> *"Similarly, ZonedDateTime is a close analog to java.util.GregorianCalendar, and that class has gained conversion methods in Java 8. The toZonedDateTime method converts a GregorianCalendar to a ZonedDateTime, and the static from method does the opposite conversion."*

**Dịch:** Tương tự, **`ZonedDateTime` là bản tương ứng sát nhất với `java.util.GregorianCalendar`**, và class đó **đã có thêm các method chuyển đổi ở Java 8**. Method **`toZonedDateTime`** chuyển một `GregorianCalendar` thành một `ZonedDateTime`, và **static method `from`** làm phép chuyển ngược lại.

### java.sql và java.text

> *"Another set of conversions is available for the date and time classes in the java.sql package. You can also pass a DateTimeFormatter to legacy code that uses java.text.Format. Table 6.4 summarizes these conversions."*

**Dịch:** **Một bộ chuyển đổi khác** có sẵn cho các class date và time trong package **`java.sql`**. Bạn cũng **truyền được một `DateTimeFormatter` vào legacy code dùng `java.text.Format`**. Table 6.4 tóm tắt các phép chuyển đổi này.

#### Table 6.4 — Conversions between `java.time` Classes and Legacy Classes

| Classes | To Legacy Class | From Legacy Class |
|---|---|---|
| `Instant` ↔ `java.util.Date` | `Date.from(instant)` | `date.toInstant()` |
| `ZonedDateTime` ↔ `java.util.GregorianCalendar` | `GregorianCalendar.from(zonedDateTime)` | `cal.toZonedDateTime()` |
| `Instant` ↔ `java.sql.Timestamp` | `Timestamp.from(instant)` | `timestamp.toInstant()` |
| `LocalDateTime` ↔ `java.sql.Timestamp` | `Timestamp.valueOf(localDateTime)` | `timestamp.toLocalDateTime()` |
| `LocalDate` ↔ `java.sql.Date` | `Date.valueOf(localDate)` | `date.toLocalDate()` |
| `LocalTime` ↔ `java.sql.Time` | `Time.valueOf(localTime)` | `time.toLocalTime()` |
| `DateTimeFormatter` → `java.text.DateFormat` | `formatter.toFormat()` | **None** |
| `java.util.TimeZone` ↔ `ZoneId` | `TimeZone.getTimeZone(id)` | `timeZone.toZoneId()` |
| `java.nio.file.attribute.FileTime` ↔ `Instant` | `FileTime.from(instant)` | `fileTime.toInstant()` |

### Kết chương

> *"You now know how to use the Java 8 date and time library to work with date and time values around the world. The next chapter takes the discussion of programming for an international audience further. You will see how to format program messages, numbers, and currencies in the way that makes sense for your customers, wherever they may be."*

**Dịch:** Giờ bạn đã biết dùng **thư viện date and time của Java 8** để làm việc với các giá trị ngày giờ **trên khắp thế giới**. **Chương kế tiếp** đẩy xa hơn phần bàn luận về lập trình cho **khán giả quốc tế**. Bạn sẽ thấy cách format **thông điệp chương trình, số, và tiền tệ** theo cách **có ý nghĩa với khách hàng của bạn, dù họ ở đâu**.

---

## Chương kế tiếp

→ [[01 - Locales]] — Chapter 7: Internationalization.
