# 03 — Date Adjusters

> Chapter 6, Section 6.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 6.3 Date Adjusters

### TemporalAdjusters có sẵn

> *"For scheduling applications, you often need to compute dates such as "the first Tuesday of every month." The TemporalAdjusters class provides a number of static methods for common adjustments. You pass the result of an adjustment method to the with method. For example, the first Tuesday of a month can be computed like this:"*

```java
LocalDate firstTuesday = LocalDate.of(year, month, 1).with(
    TemporalAdjusters.nextOrSame(DayOfWeek.TUESDAY));
```

**Dịch:** Với ứng dụng **lập lịch**, bạn thường phải tính những ngày kiểu **"thứ Ba đầu tiên của mỗi tháng"**. Class **`TemporalAdjusters`** cung cấp một loạt **static method** cho các phép chỉnh phổ biến. Bạn **truyền kết quả của một adjustment method vào method `with`**. Ví dụ, thứ Ba đầu tiên của một tháng tính như trên.

> *"As always, the with method returns a new LocalDate object without modifying the original. The API notes at the end of this section show the available adjusters."*

**Dịch:** Như thường lệ, method **`with` trả về một object `LocalDate` mới** mà **không sửa object gốc**. Phần API notes cuối section liệt kê các adjuster có sẵn.

### Tự viết adjuster

> *"You can also make your own adjuster by implementing the TemporalAdjuster interface. Here is an adjuster for computing the next weekday:"*

```java
TemporalAdjuster NEXT_WORKDAY = w ->
{
    var result = (LocalDate) w;
    do
    {
        result = result.plusDays(1);
    }
    while (result.getDayOfWeek().getValue() >= 6);
    return result;
};

LocalDate backToWork = today.with(NEXT_WORKDAY);
```

**Dịch:** Bạn cũng **tự tạo adjuster** được bằng cách **implement interface `TemporalAdjuster`**. Trên là một adjuster tính **ngày làm việc kế tiếp**.

> Về interface xem [[01 - Interfaces]]; về lambda expression xem [[02 - Lambda Expressions]].

### Tránh cast bằng ofDateAdjuster

> *"Note that the parameter of the lambda expression has type Temporal, and it must be cast to LocalDate. You can avoid this cast with the ofDateAdjuster method that expects a lambda of type UnaryOperator\<LocalDate>."*

```java
TemporalAdjuster NEXT_WORKDAY = TemporalAdjusters.ofDateAdjuster(w ->
{
    LocalDate result = w; // No cast
    do
    {
        result = result.plusDays(1);
    }
    while (result.getDayOfWeek().getValue() >= 6);
    return result;
});
```

**Dịch:** Chú ý rằng parameter của lambda expression có **kiểu `Temporal`**, và **phải cast sang `LocalDate`**. Tránh được cú cast này bằng method **`ofDateAdjuster`**, vốn **mong đợi một lambda kiểu `UnaryOperator<LocalDate>`**.

---

## API — `java.time.LocalDate` 9

| Method | Mô tả (sách) |
|---|---|
| `LocalDate with(TemporalAdjuster adjuster)` | *"returns the result of adjusting this date by the given adjuster."* — trả về kết quả của việc chỉnh ngày này bằng adjuster cho trước. |

## API — `java.time.temporal.TemporalAdjusters` 9

| Method | Mô tả (sách) |
|---|---|
| `static TemporalAdjuster next(DayOfWeek dayOfWeek)`<br>`static TemporalAdjuster nextOrSame(DayOfWeek dayOfWeek)`<br>`static TemporalAdjuster previous(DayOfWeek dayOfWeek)`<br>`static TemporalAdjuster previousOrSame(DayOfWeek dayOfWeek)` | *"returns an adjuster that adjusts a date to the given day of the week."* — trả về adjuster chỉnh một ngày về **thứ trong tuần cho trước**. |
| `static TemporalAdjuster dayOfWeekInMonth(int n, DayOfWeek dayOfWeek)`<br>`static TemporalAdjuster lastInMonth(DayOfWeek dayOfWeek)` | *"returns an adjuster that adjusts a date to the nth or last given weekday on the month."* — trả về adjuster chỉnh một ngày về **thứ thứ n** hoặc **thứ cuối cùng** trong tháng. |
| `static TemporalAdjuster firstDayOfMonth()`<br>`static TemporalAdjuster firstDayOfNextMonth()`<br>`static TemporalAdjuster firstDayOfYear()`<br>`static TemporalAdjuster firstDayOfNextYear()`<br>`static TemporalAdjuster lastDayOfMonth()`<br>`static TemporalAdjuster lastDayOfYear()` | *"returns an adjuster that adjusts a date to the given day of the month or year."* — trả về adjuster chỉnh một ngày về **ngày cho trước trong tháng hoặc trong năm**. |

---

## Bài kế tiếp

→ [[04 - Local Time]] — `LocalTime`, phép plus/minus cuộn vòng 24 giờ, `LocalDateTime`.
