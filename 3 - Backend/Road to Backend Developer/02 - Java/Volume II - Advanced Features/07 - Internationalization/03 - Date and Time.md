# 03 — Date and Time

> Chapter 7, Section 7.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.3. Date and Time

> *"When you are formatting date and time, you should be concerned with four locale-dependent issues:"*
> - *"The names of months and weekdays should be presented in the local language."*
> - *"There will be local preferences for the order of year, month, and day."*
> - *"The Gregorian calendar might not be the local preference for expressing dates."*
> - *"The time zone of the location must be taken into account."*

**Dịch:** Khi format date và time, phải quan tâm **bốn vấn đề phụ thuộc locale**:

1. **Tên tháng và tên thứ trong tuần** phải được trình bày bằng **ngôn ngữ bản địa**.
2. Có **sở thích bản địa về thứ tự** year, month, day.
3. **Lịch Gregorian có thể không phải lựa chọn bản địa** để biểu diễn date.
4. **Time zone của địa điểm** phải được tính đến.

> *"The DateTimeFormatter class from the java.time package handles these issues. Pick one of the formatting styles shown in Tables 7.4. Then, get a formatter:"*

```java
FormatStyle style = . . .; // One of FormatStyle.SHORT, FormatStyle.MEDIUM, . . .
DateTimeFormatter dateFormatter = DateTimeFormatter.ofLocalizedDate(style);
DateTimeFormatter timeFormatter = DateTimeFormatter.ofLocalizedTime(style);
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofLocalizedDateTime(style);
   // or DateTimeFormatter.ofLocalizedDateTime(style1, style2)
```

**Dịch:** Class **`DateTimeFormatter`** trong package `java.time` xử lý các vấn đề này. Chọn một trong các **formatting style**, rồi lấy formatter.

> *"These formatters use the current locale. To use a different locale, use the withLocale method:"*

```java
DateTimeFormatter dateFormatter =
   DateTimeFormatter.ofLocalizedDate(style).withLocale(locale);
```

**Dịch:** Các formatter này dùng **locale hiện tại**. Muốn dùng locale khác thì dùng method **`withLocale`**.

> *"Now you can format a LocalDate, LocalDateTime, LocalTime, or ZonedDateTime:"*

```java
ZonedDateTime appointment = . . .;
String formatted = formatter.format(appointment);
```

**Dịch:** Giờ format được `LocalDate`, `LocalDateTime`, `LocalTime`, hay `ZonedDateTime`.

### Table 7.4 — Date and Time Formatting Styles

| Style | Date | Time |
|---|---|---|
| `SHORT` | `7/16/69` | `9:32 AM` |
| `MEDIUM` | `Jul 16, 1969` | `9:32:00 AM` |
| `LONG` | `July 16, 1969` | `9:32:00 AM EDT` trong `en-US`, `9:32:00 MSZ` trong `de-DE` (**chỉ dành cho `ZonedDateTime`**) |
| `FULL` | `Wednesday, July 16, 1969` | `9:32:00 AM EDT` trong `en-US`, `9:32 Uhr MSZ` trong `de-DE` (**chỉ dành cho `ZonedDateTime`**) |

> **Note (sách):** *"Here we use the DateTimeFormatter class from the java.time package. There is also a legacy java.text.DateFormatter class from Java 1.1 that works with Date and Calendar objects."*
>
> **Dịch:** Ở đây ta dùng class `DateTimeFormatter` của package `java.time`. Còn có class **legacy `java.text.DateFormatter`** từ Java 1.1 làm việc với object `Date` và `Calendar`.

### Parse

> *"You can use one of the static parse methods of LocalDate, LocalDateTime, LocalTime, or ZonedDateTime to parse a date or time in a string:"*

```java
LocalTime time = LocalTime.parse("9:32 AM", formatter);
```

> *"These methods are not suitable for parsing human input, at least not without preprocessing. For example, the short time formatter for the United States will parse "9:32 AM" but not "9:32AM" or "9:32 am"."*

**Dịch:** Dùng được một trong các **static method `parse`** của `LocalDate`, `LocalDateTime`, `LocalTime`, `ZonedDateTime` để parse date hoặc time trong một string. Các method này **không phù hợp để parse input của con người**, ít nhất là không phù hợp nếu không tiền xử lý. Ví dụ short time formatter cho Mỹ sẽ parse được `"9:32 AM"` nhưng **không parse được** `"9:32AM"` hay `"9:32 am"`.

> **Caution (sách):** *"Date formatters parse nonexistent dates, such as November 31, and adjust them to the last date in the given month."*
>
> **Dịch:** Date formatter **vẫn parse các date không tồn tại**, ví dụ 31 tháng Mười Một, và **điều chỉnh chúng về ngày cuối cùng của tháng đó**.

### Tên thứ và tên tháng

> *"Sometimes, you need to display just the names of weekdays and months, for example, in a calendar application. Call the getDisplayName method of the DayOfWeek and Month enumerations."*

```java
for (Month m : Month.values())
   System.out.println(m.getDisplayName(textStyle, locale) + " ");
```

**Dịch:** Đôi khi bạn chỉ cần hiển thị **tên thứ trong tuần và tên tháng**, ví dụ trong ứng dụng lịch. Gọi method **`getDisplayName`** của enumeration `DayOfWeek` và `Month`.

> *"Tables 7.5 shows the text styles. The STANDALONE versions are for display outside a formatted date. For example, in Finnish, January is "tammikuuta" inside a date, but "tammikuu" standalone."*

**Dịch:** Các phiên bản **`STANDALONE`** dùng để hiển thị **bên ngoài một date đã được format**. Ví dụ trong tiếng Phần Lan, tháng Một là *"tammikuuta"* **bên trong một date**, nhưng là *"tammikuu"* khi **đứng độc lập**.

### Table 7.5 — Values of the `java.time.format.TextStyle` Enumeration

| Style | Example |
|---|---|
| `FULL` / `FULL_STANDALONE` | `January` |
| `SHORT` / `SHORT_STANDALONE` | `Jan` |
| `NARROW` / `NARROW_STANDALONE` | `J` |

> **Note (sách):** *"The first day of the week can be Saturday, Sunday, or Monday, depending on the locale. You can obtain it like this:"*
>
> ```java
> DayOfWeek first = WeekFields.of(locale).getFirstDayOfWeek();
> ```
>
> **Dịch:** **Ngày đầu tuần có thể là thứ Bảy, Chủ Nhật, hoặc thứ Hai**, tùy locale.

### Chương trình mẫu

> *"Listing 7.2 shows the DateFormat class in action. You can select a locale and see how the date and time are formatted in different places around the world. Figure 7.2 shows the program (after Chinese fonts were installed). As you can see, it correctly displays the output. You can also experiment with parsing. Enter a date, time, or date/time and click the Parse button."*

**Dịch:** Listing 7.2 cho thấy class `DateFormat` hoạt động. Chọn được locale và xem date/time được format ra sao ở các nơi trên thế giới. Cũng thử nghiệm parse được: nhập date, time, hoặc date/time rồi bấm nút Parse.

> *"We use a helper class EnumCombo to solve a technical problem (see Listing 7.3). We wanted to fill a combo with values such as Short, Medium, and Long and then automatically convert the user's selection to values FormatStyle.SHORT, FormatStyle.MEDIUM, and FormatStyle.LONG. Instead of writing repetitive code, we use reflection: We convert the user's choice to upper case, replace all spaces with underscores, and then find the value of the static field with that name. (See Volume I, Chapter 5 for more details about reflection.)"*

**Dịch:** Ta dùng helper class **`EnumCombo`** để giải một vấn đề kỹ thuật. Ta muốn điền vào combo các giá trị như `Short`, `Medium`, `Long` rồi **tự động chuyển lựa chọn của người dùng** thành `FormatStyle.SHORT`, `FormatStyle.MEDIUM`, `FormatStyle.LONG`. Thay vì viết code lặp đi lặp lại, ta dùng **reflection**: chuyển lựa chọn sang chữ hoa, thay mọi khoảng trắng bằng dấu gạch dưới, rồi **tìm giá trị của static field có tên đó**. (Xem Volume I, Chapter 5 về reflection.)

### Listing 7.2 — `dateFormat/DateTimeFormatterTest.java`

```java
package dateFormat;

import java.awt.*;
import java.awt.event.*;
import java.time.*;
import java.time.format.*;
import java.util.*;

import javax.swing.*;

/**
 * This program demonstrates formatting dates under various locales.
 * @version 1.01 2018-05-01
 * @author Cay Horstmann
 */
public class DateTimeFormatterTest
{
   public static void main(String[] args)
   {
      EventQueue.invokeLater(() ->
         {
            var frame = new DateTimeFormatterFrame();
            frame.setTitle("DateFormatTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
         });
   }
}

/**
 * This frame contains combo boxes to pick a locale, date and time formats,
 * text fields to display formatted date and time, and
 * buttons to parse the text field contents.
 */
class DateTimeFormatterFrame extends JFrame
{
   private Locale[] locales;
   private LocalDate currentDate;
   private LocalTime currentTime;
   private ZonedDateTime currentDateTime;
   private DateTimeFormatter currentDateFormat;
   private DateTimeFormatter currentTimeFormat;
   private DateTimeFormatter currentDateTimeFormat;
   private JComboBox<String> localeCombo = new JComboBox<>();
   private JButton dateParseButton = new JButton("Parse");
   private JButton timeParseButton = new JButton("Parse");
   private JButton dateTimeParseButton = new JButton("Parse");
   private JTextField dateText = new JTextField(30);
   private JTextField timeText = new JTextField(30);
   private JTextField dateTimeText = new JTextField(30);
   private EnumCombo<FormatStyle> dateStyleCombo = new EnumCombo<>(FormatStyle.class,
      "Short", "Medium", "Long", "Full");
   private EnumCombo<FormatStyle> timeStyleCombo = new EnumCombo<>(FormatStyle.class,
      "Short", "Medium");
   private EnumCombo<FormatStyle> dateTimeStyleCombo = new EnumCombo<>(FormatStyle.class,
      "Short", "Medium", "Long", "Full");

   public DateTimeFormatterFrame()
   {
      setLayout(new GridBagLayout());
      add(new JLabel("Locale"), new GBC(0, 0).setAnchor(GBC.EAST));
      add(localeCombo, new GBC(1, 0, 2, 1).setAnchor(GBC.WEST));

      add(new JLabel("Date"), new GBC(0, 1).setAnchor(GBC.EAST));
      add(dateStyleCombo, new GBC(1, 1).setAnchor(GBC.WEST));
      add(dateText, new GBC(2, 1, 2, 1).setFill(GBC.HORIZONTAL));
      add(dateParseButton, new GBC(4, 1).setAnchor(GBC.WEST));

      add(new JLabel("Time"), new GBC(0, 2).setAnchor(GBC.EAST));
      add(timeStyleCombo, new GBC(1, 2).setAnchor(GBC.WEST));
      add(timeText, new GBC(2, 2, 2, 1).setFill(GBC.HORIZONTAL));
      add(timeParseButton, new GBC(4, 2).setAnchor(GBC.WEST));

      add(new JLabel("Date and time"), new GBC(0, 3).setAnchor(GBC.EAST));
      add(dateTimeStyleCombo, new GBC(1, 3).setAnchor(GBC.WEST));
      add(dateTimeText, new GBC(2, 3, 2, 1).setFill(GBC.HORIZONTAL));
      add(dateTimeParseButton, new GBC(4, 3).setAnchor(GBC.WEST));

      locales = (Locale[]) Locale.getAvailableLocales().clone();
      Arrays.sort(locales, Comparator.comparing(Locale::getDisplayName));
      for (Locale loc : locales)
         localeCombo.addItem(loc.getDisplayName());
      localeCombo.setSelectedItem(Locale.getDefault().getDisplayName());
      currentDate = LocalDate.now();
      currentTime = LocalTime.now();
      currentDateTime = ZonedDateTime.now();
      updateDisplay();

      ActionListener listener = event -> updateDisplay();
      localeCombo.addActionListener(listener);
      dateStyleCombo.addActionListener(listener);
      timeStyleCombo.addActionListener(listener);
      dateTimeStyleCombo.addActionListener(listener);

      addAction(dateParseButton, () ->
         {
            currentDate = LocalDate.parse(dateText.getText().trim(), currentDateFormat);
         });
      addAction(timeParseButton, () ->
         {
            currentTime = LocalTime.parse(timeText.getText().trim(), currentTimeFormat);
         });
      addAction(dateTimeParseButton, () ->
         {
            currentDateTime = ZonedDateTime.parse(
               dateTimeText.getText().trim(), currentDateTimeFormat);
         });

      pack();
   }

   /**
    * Adds the given action to the button and updates the display upon completion.
    * @param button the button to which to add the action
    * @param action the action to carry out when the button is clicked
    */
   public void addAction(JButton button, Runnable action)
   {
      button.addActionListener(event ->
         {
            try
            {
               action.run();
               updateDisplay();
            }
            catch (Exception e)
            {
               JOptionPane.showMessageDialog(null, e.getMessage());
            }
         });
   }

   /**
    * Updates the display and formats the date according to the user settings.
    */
   public void updateDisplay()
   {
      Locale currentLocale = locales[localeCombo.getSelectedIndex()];
      FormatStyle dateStyle = dateStyleCombo.getValue();
      currentDateFormat = DateTimeFormatter.ofLocalizedDate(
         dateStyle).withLocale(currentLocale);
      dateText.setText(currentDateFormat.format(currentDate));
      FormatStyle timeStyle = timeStyleCombo.getValue();
      currentTimeFormat = DateTimeFormatter.ofLocalizedTime(
         timeStyle).withLocale(currentLocale);
      timeText.setText(currentTimeFormat.format(currentTime));
      FormatStyle dateTimeStyle = dateTimeStyleCombo.getValue();
      currentDateTimeFormat = DateTimeFormatter.ofLocalizedDateTime(
         dateTimeStyle).withLocale(currentLocale);
      dateTimeText.setText(currentDateTimeFormat.format(currentDateTime));
   }
}
```

### Listing 7.3 — `dateFormat/EnumCombo.java`

```java
package dateFormat;

import java.util.*;
import javax.swing.*;

/**
 * A combo box that lets users choose from among static field
 * values whose names are given in the constructor.
 * @version 1.15 2016-05-06
 * @author Cay Horstmann
 */
public class EnumCombo<T> extends JComboBox<String>
{
   private Map<String, T> table = new TreeMap<>();

   /**
    * Constructs an EnumCombo yielding values of type T.
    * @param cl a class
    * @param labels an array of strings describing static field names
    * of cl that have type T
    */
   public EnumCombo(Class<?> cl, String... labels)
   {
      for (String label : labels)
      {
         String name = label.toUpperCase().replace(' ', '_');
         try
         {
            java.lang.reflect.Field f = cl.getField(name);
            @SuppressWarnings("unchecked") T value = (T) f.get(cl);
            table.put(label, value);
         }
         catch (Exception e)
         {
            label = "(" + label + ")";
            table.put(label, null);
         }
         addItem(label);
      }
      setSelectedItem(labels[0]);
   }

   /**
    * Returns the value of the field that the user selected.
    * @return the static field value
    */
   public T getValue()
   {
      return table.get(getSelectedItem());
   }
}
```

---

## Bài kế tiếp

→ [[04 - Collation and Normalization]] — so sánh và sắp xếp string theo locale bằng `Collator`, cùng bốn dạng normalization của Unicode.
