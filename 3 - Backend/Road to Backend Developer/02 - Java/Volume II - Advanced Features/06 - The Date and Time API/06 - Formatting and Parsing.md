# 06 — Formatting and Parsing

> Chapter 6, Section 6.6 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.6 Formatting and Parsing

### Ba loại formatter

> *"The DateTimeFormatter class provides three kinds of formatters to print a date/time value:"*
>
> *"• Predefined standard formatters (see Table 6.1)"*
> *"• Locale-specific formatters"*
> *"• Formatters with custom patterns"*

**Dịch:** Class **`DateTimeFormatter`** cung cấp **ba loại formatter** để in ra một giá trị date/time:

| # | Loại formatter |
|---|---|
| 1 | **Predefined standard formatter** (xem Table 6.1) |
| 2 | **Locale-specific formatter** |
| 3 | **Formatter với custom pattern** |

### Standard formatter

> *"To use one of the standard formatters, simply call its format method:"*

```java
String formatted = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(apollo11launch);
// 1969-07-16T09:32:00-04:00"
```

**Dịch:** Để dùng một standard formatter, chỉ cần gọi method **`format`** của nó.

#### Table 6.1 — Predefined Formatters

> *(Chép nguyên văn bản in trang 372: sách in offset `-0500` / `-05:00` trong cột Example, trong khi thân bài và Listing 6.4 dùng `-04:00` cho `America/New_York` ngày 16/07/1969 (EDT) — đây là typo của bản in.)*

| Formatter | Description | Example |
|---|---|---|
| `BASIC_ISO_DATE` | Year, month, day, zone offset **without separators** | `19690716-0500` |
| `ISO_LOCAL_DATE`,<br>`ISO_LOCAL_TIME`,<br>`ISO_LOCAL_DATE_TIME` | Separators `-`, `:`, `T` | `1969-07-16`, `09:32:00`, `1969-07-16T09:32:00` |
| `ISO_OFFSET_DATE`,<br>`ISO_OFFSET_TIME`,<br>`ISO_OFFSET_DATE_TIME` | Like `ISO_LOCAL_XXX`, but with **zone offset** | `1969-07-16-05:00`, `09:32:00-05:00`,<br>`1969-07-16T09:32:00-05:00` |
| `ISO_ZONED_DATE_TIME` | With **zone offset and zone ID** | `1969-07-16T09:32:00-05:00[America/New_York]` |
| `ISO_INSTANT` | In UTC, denoted by the `Z` zone ID | `1969-07-16T14:32:00Z` |
| `ISO_DATE`,<br>`ISO_TIME`,<br>`ISO_DATE_TIME` | Like `ISO_OFFSET_DATE`, `ISO_OFFSET_TIME`, and `ISO_ZONED_DATE_TIME`, but **the zone information is optional** | `1969-07-16-05:00`, `09:32:00-05:00`,<br>`1969-07-16T09:32:00-05:00[America/New_York]` |
| `ISO_ORDINAL_DATE` | The year and **day of year**, for `LocalDate` | `1969-197` |
| `ISO_WEEK_DATE` | The year, **week**, and day of week, for `LocalDate` | `1969-W29-3` |
| `RFC_1123_DATE_TIME` | The standard for **email timestamps**, codified in RFC 822 and updated to four digits for the year in RFC 1123 | `Wed, 16 Jul 1969 09:32:00 -0500` |

### Locale-specific formatter

> *"The standard formatters are mostly intended for machine-readable timestamps. To present dates and times to human readers, use a locale-specific formatter. There are four styles, SHORT, MEDIUM, LONG, and FULL, for both date and time—see Table 6.2."*

**Dịch:** Standard formatter **chủ yếu dành cho timestamp máy đọc**. Muốn trình bày ngày giờ **cho người đọc**, dùng **locale-specific formatter**. Có **bốn style — `SHORT`, `MEDIUM`, `LONG`, `FULL`** — cho **cả date lẫn time**.

#### Table 6.2 — Locale-Specific Formatting Styles

| Style | Date | Time |
|---|---|---|
| `SHORT` | `7/16/69` | `9:32 AM` |
| `MEDIUM` | `Jul 16, 1969` | `9:32:00 AM` |
| `LONG` | `July 16, 1969` | `9:32:00 AM EDT` |
| `FULL` | `Wednesday, July 16, 1969` | `9:32:00 AM EDT` |

> *"The static methods ofLocalizedDate, ofLocalizedTime, and ofLocalizedDateTime create such a formatter. For example:"*

```java
DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG);
String formatted = formatter.format(apollo11launch);
// July 16, 1969 9:32:00 AM EDT
```

**Dịch:** Các static method **`ofLocalizedDate`, `ofLocalizedTime`, và `ofLocalizedDateTime`** tạo ra formatter loại này.

> *"These methods use the default locale. To change to a different locale, simply use the withLocale method."*

```java
formatted = formatter.withLocale(Locale.FRENCH).format(apollo11launch);
// 16 juillet 1969 09:32:00 EDT
```

**Dịch:** Các method này dùng **default locale**. Muốn đổi sang locale khác thì chỉ cần dùng method **`withLocale`**.

### getDisplayName

> *"The DayOfWeek and Month enumerations have methods getDisplayName for giving the names of weekdays and months in different locales and formats."*

```java
for (DayOfWeek w : DayOfWeek.values())
    System.out.print(w.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " ");
// Prints Mon Tue Wed Thu Fri Sat Sun
```

> *"See Chapter 7 for more information about locales."*

**Dịch:** Enumeration **`DayOfWeek` và `Month`** có method **`getDisplayName`** để cho ra **tên thứ và tên tháng** ở **các locale và format khác nhau**. Xem Chapter 7 để biết thêm về locale — [[01 - Locales]].

> Về enumeration class, xem [[07 - Enumeration Classes]].

> **Note (sách):** *"The java.time.format.DateTimeFormatter class is intended as a replacement for java.util.DateFormat. If you need an instance of the latter for backward compatibility, call formatter.toFormat()."*
>
> **Dịch:** Class **`java.time.format.DateTimeFormatter`** được dự định làm **bản thay thế cho `java.util.DateFormat`**. Nếu bạn cần một instance của cái sau để **tương thích ngược**, gọi **`formatter.toFormat()`**.

### Custom pattern

> *"Finally, you can roll your own date format by specifying a pattern. For example,"*

```java
formatter = DateTimeFormatter.ofPattern("E yyyy-MM-dd HH:mm");
```

> *"formats a date in the form Wed 1969-07-16 09:32. Each letter denotes a different time field, and the number of times the letter is repeated selects a particular format, according to rules that are arcane and seem to have organically grown over time. Table 6.3 shows the most useful pattern elements."*

**Dịch:** Cuối cùng, bạn **tự chế được date format của riêng mình** bằng cách chỉ định một **pattern**. Ví dụ trên format một ngày thành dạng **`Wed 1969-07-16 09:32`**. **Mỗi chữ cái ứng với một time field khác nhau**, và **số lần chữ cái đó lặp lại** sẽ **chọn một format cụ thể**, theo những quy tắc **bí hiểm và có vẻ đã mọc lên một cách tự nhiên theo thời gian**. Table 6.3 liệt kê các thành phần pattern hữu dụng nhất.

> Về `String`, xem [[05 - Strings]].

#### Table 6.3 — Commonly Used Formatting Symbols for Date/Time Formats

> *(Chép nguyên văn bản in trang 374: sách in `DAY_OF_MONTH` là `d: 6, dd: 06` và `MINUTE_OF_HOUR` là `mm: 02`, trong khi ví dụ xuyên suốt là ngày 16 và phút 32 — đây là typo của bản in.)*

| ChronoField or Purpose | Examples |
|---|---|
| `ERA` | `G`: AD, `GGGG`: Anno Domini, `GGGGG`: A |
| `YEAR_OF_ERA` | `yy`: 69, `yyyy`: 1969 |
| `MONTH_OF_YEAR` | `M`: 7, `MM`: 07, `MMM`: Jul, `MMMM`: July, `MMMMM`: J |
| `DAY_OF_MONTH` | `d`: 6, `dd`: 06 |
| `DAY_OF_WEEK` | `e`: 3, `E`: Wed, `EEEE`: Wednesday, `EEEEE`: W |
| `HOUR_OF_DAY` | `H`: 9, `HH`: 09 |
| `CLOCK_HOUR_OF_AM_PM` | `K`: 9, `KK`: 09 |
| `AMPM_OF_DAY` | `a`: AM |
| `MINUTE_OF_HOUR` | `mm`: 02 |
| `SECOND_OF_MINUTE` | `ss`: 00 |
| `NANO_OF_SECOND` | `nnnnnn`: 000000 |
| Time zone ID | `VV`: America/New_York |
| Time zone name | `z`: EDT, `zzzz`: Eastern Daylight Time, `v`: ET, `vvvv`: Eastern Time |
| Zone offset | `x`: -04, `xx`: -0400, `xxx`: -04:00, `XXX`: same, but use `Z` for zero |
| Localized zone offset | `O`: GMT-4, `OOOO`: GMT-04:00 |
| Modified Julian Day | `g`: 58243 |

### Parsing

> *"To parse a date/time value from a string, use one of the static parse methods. For example,"*

```java
LocalDate churchsBirthday = LocalDate.parse("1903-06-14");
ZonedDateTime apollo11launch =
    ZonedDateTime.parse("1969-07-16 03:32:00-0400",
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssxx"));
```

> *"The first call uses the standard ISO_LOCAL_DATE formatter, the second one a custom formatter."*

**Dịch:** Để **parse** một giá trị date/time **từ một string**, dùng một trong các static method **`parse`**. Lời gọi thứ nhất dùng **standard formatter `ISO_LOCAL_DATE`**, lời gọi thứ hai dùng **custom formatter**.

---

### Listing 6.4 — `formatting/Formatting.java`

> *"The program in Listing 6.4 shows how to format and parse dates and times."*

```java
package formatting;

/**
 * @version 1.0 2016-05-10
 * @author Cay Horstmann
 */

import java.time.*;
import java.time.format.*;
import java.util.*;

public class Formatting
{
    public static void main(String[] args)
    {
        ZonedDateTime apollo11launch = ZonedDateTime.of(1969, 7, 16, 9, 32, 0, 0,
            ZoneId.of("America/New_York"));

        String formatted = DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(apollo11launch);
        // 1969-07-16T09:32:00-04:00
        System.out.println(formatted);

        DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG);
        formatted = formatter.format(apollo11launch);
        // July 16, 1969 9:32:00 AM EDT
        System.out.println(formatted);
        formatted = formatter.withLocale(Locale.FRENCH).format(apollo11launch);
        // 16 juillet 1969 09:32:00 EDT
        System.out.println(formatted);

        formatter = DateTimeFormatter.ofPattern("E yyyy-MM-dd HH:mm");
        formatted = formatter.format(apollo11launch);
        System.out.println(formatted);

        LocalDate churchsBirthday = LocalDate.parse("1903-06-14");
        System.out.println("churchsBirthday: " + churchsBirthday);
        apollo11launch = ZonedDateTime.parse("1969-07-16 03:32:00-0400",
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssxx"));
        System.out.println("apollo11launch: " + apollo11launch);

        for (DayOfWeek w : DayOfWeek.values())
            System.out.print(w.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " ");
    }
}
```

---

## API — `java.time.format.DateTimeFormatter` 8

| Method | Mô tả (sách) |
|---|---|
| `String format(TemporalAccessor temporal)` | *"formats the given value. The classes Instant, LocalDate, LocalTime, LocalDateTime, and ZonedDateTime, as well as many others, implement the TemporalAccessor interface."* — format giá trị cho trước. Các class `Instant`, `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime` cùng nhiều class khác đều implement interface `TemporalAccessor`. |
| `static DateTimeFormatter ofLocalizedDate(FormatStyle dateStyle)`<br>`static DateTimeFormatter ofLocalizedTime(FormatStyle timeStyle)`<br>`static DateTimeFormatter ofLocalizedDateTime(FormatStyle dateTimeStyle)`<br>`static DateTimeFormatter ofLocalizedDateTime(FormatStyle dateStyle, FormatStyle timeStyle)` | *"yields a formatter for the given styles. The FormatStyle enumeration has values SHORT, MEDIUM, LONG, and FULL."* — cho ra formatter theo style cho trước. Enumeration `FormatStyle` có các giá trị `SHORT`, `MEDIUM`, `LONG`, `FULL`. |
| `DateTimeFormatter withLocale(Locale locale)` | *"yields a formatter equal to this formatter, using the given locale."* |
| `static DateTimeFormatter ofPattern(String pattern)`<br>`static DateTimeFormatter ofPattern(String pattern, Locale locale)` | *"yields a formatter using the given pattern and locale. See Table 6.3 for the pattern syntax."* |

## API — `java.time.LocalDate` 8

| Method | Mô tả (sách) |
|---|---|
| `static LocalDate parse(CharSequence text)`<br>`static LocalDate parse(CharSequence text, DateTimeFormatter formatter)` | *"yields a LocalDate using the default formatter, or the given formatter."* |

## API — `java.time.ZonedDateTime` 8

| Method | Mô tả (sách) |
|---|---|
| `static ZonedDateTime parse(CharSequence text)`<br>`static ZonedDateTime parse(CharSequence text, DateTimeFormatter formatter)` | *"yields a ZonedDateTime using the default formatter, or the given formatter."* |

---

## Bài kế tiếp

→ [[07 - Interoperating with Legacy Code]] — chuyển đổi qua lại với `java.util.Date`, `GregorianCalendar`, `java.sql`.
