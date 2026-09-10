# Glossary — The Date and Time API

> Thuật ngữ Chapter 6: The Date and Time API. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Absolute Time**
Thời gian tuyệt đối, đối lập với **human time**. Được biểu diễn bằng `Instant` — một điểm trên time line. Xem [[02 - Local Dates#6.2 Local Dates]].

## C

**ChronoUnit**
Đơn vị thời gian truyền vào `until` để lấy chênh lệch theo một đơn vị cụ thể, ví dụ `independenceDay.until(christmas, ChronoUnit.DAYS)` cho ra 174 ngày. Xem [[02 - Local Dates#until]].

## D

**Date Adjuster**
Cơ chế tính các ngày kiểu *"thứ Ba đầu tiên của mỗi tháng"*. Class `TemporalAdjusters` cung cấp nhiều static method cho các phép chỉnh phổ biến; kết quả được truyền vào method `with`. Tự viết adjuster được bằng cách implement interface `TemporalAdjuster`. Xem [[03 - Date Adjusters#6.3 Date Adjusters]].

**DayOfWeek**
Enumeration cho thứ trong tuần. **`MONDAY` có giá trị số 1**, **`SUNDAY` có giá trị 7** — khác `java.util.Calendar` (Chủ nhật = 1, Thứ bảy = 7). Có method tiện lợi `plus`/`minus` tính modulo 7 và `getDisplayName`. Xem [[02 - Local Dates#getDayOfWeek và DayOfWeek]].

**Daylight Savings Time**
Nguồn gây rắc rối chính khi làm việc với zoned time. Khi DST bắt đầu, đồng hồ nhảy tới một giờ → dựng thời điểm trong giờ bị bỏ qua sẽ ra giờ sau đó. Khi DST kết thúc, đồng hồ lùi một giờ → có **hai instant cùng local time**, và bạn nhận được cái **sớm hơn**. Cộng ngày qua ranh giới DST phải dùng `Period`, **không dùng `Duration`**. Xem [[05 - Zoned Time#Rắc rối do daylight savings time]].

**DateTimeFormatter**
Class cung cấp **ba loại formatter**: predefined standard formatter, locale-specific formatter, và formatter với custom pattern. Được dự định làm bản thay thế cho `java.util.DateFormat`; gọi `formatter.toFormat()` nếu cần instance của cái cũ. Xem [[06 - Formatting and Parsing#6.6 Formatting and Parsing]].

**Duration**
**Lượng thời gian giữa hai instant.** Lấy bằng `Duration.between`. Lưu số giây trong một `long` và số nanosecond trong một `int` bổ sung. **Immutable** — mọi method trả về instance mới. Xem [[01 - The Time Line#Duration]].

## E

**Epoch**
Gốc toạ độ của time line, đặt **tuỳ ý** ở **nửa đêm 1/1/1970** tại **kinh tuyến gốc** qua Greenwich Royal Observatory ở London — cùng quy ước với UNIX/POSIX time. Xem [[01 - The Time Line#Instant và epoch]].

## F

**FormatStyle**
Enumeration với các giá trị **`SHORT`, `MEDIUM`, `LONG`, `FULL`**, dùng cho locale-specific formatter (`ofLocalizedDate`, `ofLocalizedTime`, `ofLocalizedDateTime`). Xem [[06 - Formatting and Parsing#Locale-specific formatter]].

## H

**Human Time**
Thời gian theo cách con người dùng. Java API có **hai loại**: **local date/time** (không kèm time zone) và **zoned time** (kèm time zone, ứng với một instant chính xác). Xem [[02 - Local Dates#Hai loại human time]].

## I

**IANA Time Zone Database**
Database mọi time zone đã biết trên thế giới (`www.iana.org/time-zones`), cập nhật vài lần mỗi năm, phần lớn cập nhật liên quan tới quy tắc daylight savings time. **Java dùng database này.** Xem [[05 - Zoned Time#IANA database và ZoneId]].

**Instant**
Class biểu diễn **một điểm trên time line**. `Instant.MIN` lùi tới khoảng một tỷ năm; `Instant.MAX` là 31/12 năm 1.000.000.000. **Immutable**. Dùng làm timestamp được vì so sánh được bằng `equals` và `compareTo`. Xem [[01 - The Time Line#Instant và epoch]].

## L

**Leap Second**
Giây được **chèn thêm** thỉnh thoảng, bắt đầu từ **1972**, để đồng bộ thời gian tuyệt đối với vòng quay Trái Đất. Về lý thuyết đôi khi cần **bỏ bớt** một giây nhưng **chưa từng xảy ra**. Nhiều hệ thống máy tính dùng **"smoothing"** thay vì leap second. Xem [[01 - The Time Line#Leap second]].

**Leap Year**
Năm nhuận: **chia hết cho 4 nhưng không chia hết cho 100, hoặc chia hết cho 400**. Java áp dụng thuật toán này cho **mọi năm trong quá khứ**, dù **không đúng về mặt lịch sử**. Kiểm tra bằng `isLeapYear()`. Xem [[02 - Local Dates#API — `java.time.LocalDate` 8]].

**LocalDate**
Một ngày gồm **năm, tháng, ngày trong tháng**, **không có time zone**. Dựng bằng `now` hoặc `of`. Tháng đánh số **thông thường (1–12)**, không zero-based như `java.util.Date`. Xem [[02 - Local Dates#Dựng LocalDate]].

**LocalDateTime**
Class biểu diễn **một ngày kèm giờ**. Phù hợp để lưu điểm thời gian trong **một time zone cố định** (lịch học, lịch sự kiện). Nếu cần tính toán vắt qua DST hoặc người dùng nhiều time zone thì dùng `ZonedDateTime`. Xem [[04 - Local Time#LocalDateTime]].

**LocalTime**
Class biểu diễn **một giờ trong ngày**, ví dụ `15:30:00`. Phép `plus`/`minus` **cuộn vòng quanh ngày 24 giờ**. **Không bận tâm tới AM/PM** — chuyện đó để cho formatter. Xem [[04 - Local Time#6.4 Local Time]].

**Locale-Specific Formatter**
Formatter dùng để trình bày ngày giờ **cho người đọc**, tạo bằng `ofLocalizedDate`/`ofLocalizedTime`/`ofLocalizedDateTime`, đổi locale bằng `withLocale`. Xem [[06 - Formatting and Parsing#Locale-specific formatter]].

## M

**Month**
Enumeration cho tháng, dùng thay cho số nguyên trong `LocalDate.of(1903, Month.JUNE, 14)`. Có method `getDisplayName`. Xem [[02 - Local Dates#Dựng LocalDate]].

**MonthDay / YearMonth / Year**
Các class mô tả **partial date**. Ví dụ 25 tháng 12 (không chỉ định năm) biểu diễn bằng một `MonthDay`. Xem [[02 - Local Dates#Partial date]].

## O

**OffsetDateTime**
Class biểu diễn thời điểm với **một offset so với UTC nhưng không có time zone rule**. Dành cho **ứng dụng chuyên biệt** đòi hỏi đúng việc vắng mặt các rule đó, ví dụ một số network protocol. **Với human time thì dùng `ZonedDateTime`.** Xem [[05 - Zoned Time#Cộng ngày qua ranh giới DST]].

## P

**Parse**
Đọc một giá trị date/time **từ một string** bằng các static method `parse`. Không truyền formatter thì dùng standard formatter mặc định (ví dụ `ISO_LOCAL_DATE`). Xem [[06 - Formatting and Parsing#Parsing]].

**Period**
Thứ **tương đương `Duration` nhưng cho local date**: diễn tả **số năm, tháng, hoặc ngày đã trôi qua**. Dùng `Period.ofDays(7)` chứ **không dùng `Duration.ofDays(7)`** khi cộng ngày qua ranh giới daylight savings time. Xem [[02 - Local Dates#Period]].

**Pattern**
Chuỗi định dạng tự chế truyền vào `DateTimeFormatter.ofPattern`. **Mỗi chữ cái ứng với một time field**, và **số lần lặp của chữ cái chọn một format cụ thể**, theo các quy tắc mà sách gọi là **"arcane"**. Xem [[06 - Formatting and Parsing#Table 6.3 — Commonly Used Formatting Symbols for Date/Time Formats]].

**Predefined Standard Formatter**
Các formatter có sẵn của `DateTimeFormatter` (`BASIC_ISO_DATE`, `ISO_LOCAL_DATE`, `ISO_OFFSET_DATE_TIME`, `ISO_INSTANT`, `RFC_1123_DATE_TIME`...). **Chủ yếu dành cho timestamp máy đọc.** Xem [[06 - Formatting and Parsing#Table 6.1 — Predefined Formatters]].

## S

**Smoothing**
Cách nhiều hệ thống máy tính né leap second: thời gian bị **làm chậm hoặc tăng tốc một cách nhân tạo** ngay trước leap second, giữ đúng **86.400 giây mỗi ngày**. Xem [[01 - The Time Line#Leap second]].

## T

**Temporal**
Interface được implement bởi `Instant` cũng như `LocalDate`/`LocalDateTime`/`LocalTime` và `ZonedDateTime`; là kiểu parameter của `Duration.between`. Xem [[01 - The Time Line#API — `java.time.Duration` 8]].

**TemporalAccessor**
Interface được implement bởi `Instant`, `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime` cùng nhiều class khác; là kiểu parameter của `DateTimeFormatter.format`. Xem [[06 - Formatting and Parsing#API — `java.time.format.DateTimeFormatter` 8]].

**TemporalAdjuster**
Interface để tự tạo date adjuster. Parameter của lambda có kiểu `Temporal` nên **phải cast sang `LocalDate`**; tránh cast bằng `TemporalAdjusters.ofDateAdjuster`, vốn nhận lambda kiểu `UnaryOperator<LocalDate>`. Xem [[03 - Date Adjusters#Tự viết adjuster]].

**TemporalAmount**
Interface được implement bởi class **`Duration` và `Period`**; là kiểu parameter của các method `plus`/`minus` tổng quát. Xem [[01 - The Time Line#API — `java.time.Instant` 8]].

**Time Line**
Trục thời gian mà `Instant` là các điểm trên đó, đo từ epoch theo **86.400 giây mỗi ngày**, tiến và lùi, với **độ chính xác nanosecond**. Xem [[01 - The Time Line#6.1 The Time Line]].

**Time Zone**
Sản phẩm **hoàn toàn do con người tạo ra**, có **biên giới bất thường và dịch chuyển**, cộng thêm daylight savings time. Mỗi time zone có một **ID** kiểu `America/New_York`. Xem [[05 - Zoned Time#6.5 Zoned Time]].

## U

**UTC**
**"Coordinated Universal Time"** — cụm viết tắt là **thoả hiệp** giữa tên tiếng Anh và tên tiếng Pháp *"Temps Universel Coordiné"*, mang đặc điểm là **sai trong cả hai ngôn ngữ**. Là **giờ tại Greenwich Royal Observatory, không có daylight savings time**. Xem [[05 - Zoned Time#Dựng ZonedDateTime]].

## Z

**ZoneId**
Object đại diện một time zone, lấy bằng `ZoneId.of(id)`. Liệt kê mọi ID bằng `ZoneId.getAvailableZoneIds` — thời điểm viết sách có **gần 600 ID**. Xem [[05 - Zoned Time#IANA database và ZoneId]].

**ZoneOffset**
Offset so với UTC, lấy bằng `getOffset()`. Dao động từ **–12:00 tới +14:00**; một số time zone có **offset lẻ**; offset **đổi theo daylight savings time**. Xem [[05 - Zoned Time#API — `java.time.ZonedDateTime` 8]].

**ZonedDateTime**
Class biểu diễn **một ngày giờ kèm time zone** — tức **một instant chính xác** trên time line. Dựng bằng `local.atZone(zoneId)` hoặc `ZonedDateTime.of(...)`. Là bản tương ứng sát nhất với `java.util.GregorianCalendar`. Xem [[05 - Zoned Time#Dựng ZonedDateTime]].
