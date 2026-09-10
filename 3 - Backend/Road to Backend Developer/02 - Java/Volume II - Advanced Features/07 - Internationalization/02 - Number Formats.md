# 02 — Number Formats

> Chapter 7, Section 7.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.2. Number Formats

> *"We already mentioned how number and currency formatting is highly locale-dependent. The Java library supplies a collection of formatter objects that can format and parse numeric values in the java.text package."*

**Dịch:** Ta đã nhắc tới việc format số và tiền tệ **phụ thuộc rất nhiều vào locale**. Java library cung cấp một tập các **formatter object** có thể format và parse giá trị số, nằm trong package `java.text`.

---

## 7.2.1. Formatting Numeric Values

> *"Go through the following steps to format a number for a particular locale:"*
> 1. *"Get the locale object, as described in the preceding section."*
> 2. *"Use a "factory method" to obtain a formatter object."*
> 3. *"Use the formatter object for formatting and parsing."*

**Dịch:** Ba bước để format một số cho một locale cụ thể:

1. Lấy **locale object** (xem [[01 - Locales]]).
2. Dùng một **factory method** để lấy **formatter object**.
3. Dùng formatter object đó để **format và parse**.

```
Locale  ──►  NumberFormat.getXxxInstance(locale)  ──►  formatter
                                                          │
                                        format(x) ────────┤
                                        parse(s)  ────────┘
```

> *"The factory methods are static methods of the NumberFormat class that take a Locale argument. There are three factory methods: getNumberInstance, getCurrencyInstance, and getPercentInstance. These methods return objects that can format and parse numbers, currency amounts, and percentages, respectively."*

**Dịch:** Các factory method là **static method của class `NumberFormat`** nhận argument `Locale`. Có **ba factory method**: `getNumberInstance`, `getCurrencyInstance`, `getPercentInstance`. Chúng trả về object format và parse được lần lượt **số**, **số tiền**, và **phần trăm**.

> *"For example, here is how you can format a currency value in German:"*

```java
Locale loc = Locale.GERMAN;
NumberFormat currFmt = NumberFormat.getCurrencyInstance(loc);
double amt = 123456.78;
String result = currFmt.format(amt);
```

> *"The result is `123.456,78 €`. Note that the currency symbol is € and that it is placed at the end of the string. Also, note the reversal of decimal points and decimal commas."*

**Dịch:** Kết quả là `123.456,78 €`. Chú ý ký hiệu tiền tệ là `€` và nó **đặt ở cuối chuỗi**. Cũng chú ý **dấu chấm và dấu phẩy thập phân bị đảo vai trò**.

### Parse

> *"Conversely, to read in a number that was entered or stored with the conventions of a certain locale, use the parse method. For example, the following code parses the value that the user typed into a text field. The parse method can deal with decimal points and commas, as well as digits in other languages."*

```java
TextField inputField;
. . .
NumberFormat fmt = NumberFormat.getNumberInstance();
   // get the number formatter for default locale
Number input = fmt.parse(inputField.getText().trim());
double x = input.doubleValue();
```

**Dịch:** Ngược lại, để **đọc vào một số** được nhập hoặc lưu theo quy ước của một locale nhất định, dùng method **`parse`**. Method `parse` xử lý được **dấu chấm và dấu phẩy thập phân**, cũng như **chữ số của các ngôn ngữ khác**.

> *"The return type of parse is the abstract type Number. The returned object is either a Double or a Long wrapper object, depending on whether the parsed number was a floating-point number. If you don't care about the distinction, you can simply use the doubleValue method of the Number class to retrieve the wrapped number."*

**Dịch:** Kiểu trả về của `parse` là kiểu abstract **`Number`**. Object trả về là **`Double`** hoặc **`Long`** wrapper object, tùy vào số được parse có phải số dấu chấm động hay không. Nếu không quan tâm phân biệt, cứ dùng method `doubleValue` của class `Number`.

> **Caution (sách):** *"Objects of type Number are not automatically unboxed—you cannot simply assign a Number object to a primitive type. Instead, use the doubleValue or intValue method."*
>
> **Dịch:** Object kiểu `Number` **không được tự động unbox** — bạn không thể chỉ gán một `Number` object cho kiểu primitive. Thay vào đó dùng method `doubleValue` hoặc `intValue`.

Xem [[02 - Data Types]] (Volume I) về wrapper và primitive.

> *"If the text for the number is not in the correct form, the method throws a ParseException. For example, leading whitespace in the string is not allowed. (Call trim to remove it.) However, any characters that follow the number in the string are simply ignored, so no exception is thrown."*

**Dịch:** Nếu text của số **không đúng dạng**, method ném **`ParseException`**. Ví dụ **khoảng trắng đứng đầu không được phép** (gọi `trim` để bỏ đi). Tuy nhiên, **mọi ký tự đứng sau số thì bị bỏ qua**, nên không có exception nào được ném.

> *"Note that the classes returned by the getXxxInstance factory methods are not actually of type NumberFormat. The NumberFormat type is an abstract class, and the actual formatters belong to one of its subclasses. The factory methods merely know how to locate the object that belongs to a particular locale."*

**Dịch:** Chú ý các class được trả về bởi factory method `getXxxInstance` **thực ra không phải kiểu `NumberFormat`**. `NumberFormat` là **abstract class**, còn formatter thật thuộc về **một trong các subclass của nó**. Factory method chỉ **biết cách định vị object thuộc về một locale cụ thể**.

> *"You can get a list of the currently supported locales with the static getAvailableLocales method. That method returns an array of the locales for which number formatter objects can be obtained."*

**Dịch:** Lấy được danh sách locale hiện được hỗ trợ bằng static method **`getAvailableLocales`**. Method đó trả về array các locale mà **lấy được number formatter object**.

### Chương trình mẫu

> *"The sample program for this section lets you experiment with number formatters (see Figure 7.1). The combo box at the top of the figure contains all locales with number formatters. You can choose between number, currency, and percentage formatters. Each time you make another choice, the number in the text field is reformatted. If you go through a few locales, you can get a good impression of the many ways that a number or currency value can be formatted. You can also type a different number and click the Parse button to call the parse method, which tries to parse what you entered. If your input is successfully parsed, it is passed to format and the result is displayed. If parsing fails, a "Parse error" message is displayed in the text field."*

**Dịch:** Chương trình mẫu cho phép thử nghiệm với number formatter. Combo box chứa **mọi locale có number formatter**. Chọn được giữa formatter number, currency, percentage. Mỗi lần chọn khác đi, số trong text field **được format lại**. Cũng gõ được số khác rồi bấm nút **Parse** để gọi method `parse`. Nếu parse thành công, kết quả được đưa qua `format` và hiển thị; nếu thất bại, thông báo "Parse error" hiện ra trong text field.

> *"The code, shown in Listing 7.1, is fairly straightforward. In the constructor, we call NumberFormat.getAvailableLocales. For each locale, we call getDisplayName and fill a combo box with the strings that the getDisplayName method returns. (The strings are not sorted; we tackle this issue in Section 7.4, "Collation and Normalization.") Whenever the user selects another locale or clicks one of the radio buttons, we create a new formatter object and update the text field. When the user clicks the Parse button, we call the parse method to do the actual parsing, based on the locale selected."*

**Dịch:** Trong constructor, gọi `NumberFormat.getAvailableLocales`. Với mỗi locale, gọi `getDisplayName` và điền vào combo box. (**Các string không được sắp xếp**; vấn đề này được xử lý ở [[04 - Collation and Normalization]].) Mỗi khi người dùng chọn locale khác hay bấm radio button, ta **tạo formatter object mới** và cập nhật text field.

> **Note (sách):** *"You can use a Scanner to read localized integers and floating-point numbers. Call the useLocale method to set the locale."*
>
> **Dịch:** Dùng được `Scanner` để đọc số nguyên và số dấu chấm động đã localize. Gọi method **`useLocale`** để đặt locale.

### Listing 7.1 — `numberFormat/NumberFormatTest.java`

```java
package numberFormat;

import java.awt.*;
import java.awt.event.*;
import java.text.*;
import java.util.*;

import javax.swing.*;

/**
 * This program demonstrates formatting numbers under various locales.
 * @version 1.15 2018-05-01
 * @author Cay Horstmann
 */
public class NumberFormatTest
{
   public static void main(String[] args)
   {
      EventQueue.invokeLater(() ->
         {
            var frame = new NumberFormatFrame();
            frame.setTitle("NumberFormatTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
         });
   }
}

/**
 * This frame contains radio buttons to select a number format, a combo box to pick a locale,
 * a text field to display a formatted number, and a button to parse the text field contents.
 */
class NumberFormatFrame extends JFrame
{
   private Locale[] locales;
   private double currentNumber;
   private JComboBox<String> localeCombo = new JComboBox<>();
   private JButton parseButton = new JButton("Parse");
   private JTextField numberText = new JTextField(30);
   private JRadioButton numberRadioButton = new JRadioButton("Number");
   private JRadioButton currencyRadioButton = new JRadioButton("Currency");
   private JRadioButton percentRadioButton = new JRadioButton("Percent");
   private ButtonGroup rbGroup = new ButtonGroup();
   private NumberFormat currentNumberFormat;

   public NumberFormatFrame()
   {
      setLayout(new GridBagLayout());

      ActionListener listener = event -> updateDisplay();

      var p = new JPanel();
      addRadioButton(p, numberRadioButton, rbGroup, listener);
      addRadioButton(p, currencyRadioButton, rbGroup, listener);
      addRadioButton(p, percentRadioButton, rbGroup, listener);

      add(new JLabel("Locale:"), new GBC(0, 0).setAnchor(GBC.EAST));
      add(p, new GBC(1, 1));
      add(parseButton, new GBC(0, 2).setInsets(2));
      add(localeCombo, new GBC(1, 0).setAnchor(GBC.WEST));
      add(numberText, new GBC(1, 2).setFill(GBC.HORIZONTAL));
      locales = (Locale[]) NumberFormat.getAvailableLocales().clone();
      Arrays.sort(locales, Comparator.comparing(Locale::getDisplayName));
      for (Locale loc : locales)
         localeCombo.addItem(loc.getDisplayName());
      localeCombo.setSelectedItem(Locale.getDefault().getDisplayName());
      currentNumber = 123456.78;
      updateDisplay();

      localeCombo.addActionListener(listener);

      parseButton.addActionListener(event ->
         {
            String s = numberText.getText().trim();
            try
            {
               Number n = currentNumberFormat.parse(s);
               currentNumber = n.doubleValue();
               updateDisplay();
            }
            catch (ParseException e)
            {
               numberText.setText(e.getMessage());
            }
         });
      pack();
   }

   /**
    * Adds a radio button to a container.
    * @param p the container into which to place the button
    * @param b the button
    * @param g the button group
    * @param listener the button listener
    */
   public void addRadioButton(Container p, JRadioButton b, ButtonGroup g,
         ActionListener listener)
   {
      b.setSelected(g.getButtonCount() == 0);
      b.addActionListener(listener);
      g.add(b);
      p.add(b);
   }

   /**
    * Updates the display and formats the number according to the user settings.
    */
   public void updateDisplay()
   {
      Locale currentLocale = locales[localeCombo.getSelectedIndex()];
      currentNumberFormat = null;
      if (numberRadioButton.isSelected())
         currentNumberFormat = NumberFormat.getNumberInstance(currentLocale);
      else if (currencyRadioButton.isSelected())
         currentNumberFormat = NumberFormat.getCurrencyInstance(currentLocale);
      else if (percentRadioButton.isSelected())
         currentNumberFormat = NumberFormat.getPercentInstance(currentLocale);
      String formatted = currentNumberFormat.format(currentNumber);
      numberText.setText(formatted);
   }
}
```

---

## API — `java.text.NumberFormat` 1.1

| Method | Mô tả |
|---|---|
| `static Locale[] getAvailableLocales()` | trả về array các `Locale` object mà có sẵn formatter `NumberFormat`. |
| `static NumberFormat getNumberInstance()`<br>`static NumberFormat getNumberInstance(Locale l)`<br>`static NumberFormat getCurrencyInstance()`<br>`static NumberFormat getCurrencyInstance(Locale l)`<br>`static NumberFormat getPercentInstance()`<br>`static NumberFormat getPercentInstance(Locale l)` | trả về formatter cho số, số tiền, hoặc giá trị phần trăm, theo locale hiện tại hoặc locale cho trước. |
| `String format(double x)`<br>`String format(long x)` | trả về string là kết quả format số dấu chấm động hoặc số nguyên cho trước. |
| `Number parse(String s)` | parse string cho trước và trả về giá trị số, là `Double` nếu input mô tả số dấu chấm động, ngược lại là `Long`. **Đầu string phải chứa một số; không cho phép khoảng trắng đứng đầu.** Số có thể theo sau bởi ký tự khác, chúng bị bỏ qua. Ném `ParseException` nếu parse không thành công. |
| `void setParseIntegerOnly(boolean b)`<br>`boolean isParseIntegerOnly()` | đặt/lấy cờ cho biết formatter này có **chỉ parse giá trị nguyên** hay không. |
| `void setGroupingUsed(boolean b)`<br>`boolean isGroupingUsed()` | đặt/lấy cờ cho biết formatter này có **phát ra và nhận diện dấu phân cách** (như `100,000`) hay không. |
| `void setMinimumIntegerDigits(int n)`<br>`int getMinimumIntegerDigits()`<br>`void setMaximumIntegerDigits(int n)`<br>`int getMaximumIntegerDigits()`<br>`void setMinimumFractionDigits(int n)`<br>`int getMinimumFractionDigits()`<br>`void setMaximumFractionDigits(int n)`<br>`int getMaximumFractionDigits()` | đặt/lấy **số chữ số tối đa hoặc tối thiểu** cho phép ở phần nguyên hoặc phần thập phân của một số. |

---

## 7.2.2. Currencies

> *"To format a currency value, you can use the NumberFormat.getCurrencyInstance method. However, that method is not very flexible—it returns a formatter for a single currency. Suppose you prepare an invoice for an American customer in which some amounts are in dollars and others are in euros. You can't just use two formatters:"*

```java
NumberFormat dollarFormatter = NumberFormat.getCurrencyInstance(Locale.US);
NumberFormat euroFormatter = NumberFormat.getCurrencyInstance(Locale.GERMANY);
```

> *"Your invoice would look very strange, with some values shown as $100,000 and others as 100.000 €. (Note that the euro value uses a decimal point, not a comma.)"*

**Dịch:** Để format một giá trị tiền tệ, dùng được `NumberFormat.getCurrencyInstance`. Tuy nhiên method đó **không linh hoạt lắm** — nó trả về formatter cho **một loại tiền tệ duy nhất**. Giả sử bạn lập hóa đơn cho khách Mỹ trong đó **một số khoản bằng dollar, số khác bằng euro**. Bạn **không thể chỉ dùng hai formatter**: hóa đơn sẽ **trông rất kỳ quặc**, chỗ thì `$100,000`, chỗ thì `100.000 €`.

> *"Instead, use the Currency class to control the currency used by the formatters. You can get a Currency object by passing a currency identifier to the static Currency.getInstance method. Then call the setCurrency method for each formatter. Here is how you would set up the euro formatter for your American customer:"*

```java
NumberFormat euroFormatter = NumberFormat.getCurrencyInstance(Locale.US);
euroFormatter.setCurrency(Currency.getInstance("EUR"));
```

**Dịch:** Thay vào đó, dùng class **`Currency`** để kiểm soát loại tiền tệ mà formatter dùng. Lấy được `Currency` object bằng cách truyền **currency identifier** cho static method `Currency.getInstance`. Rồi gọi method **`setCurrency`** cho từng formatter.

> *"The currency identifiers are defined by ISO 4217."*

**Dịch:** Currency identifier được định nghĩa bởi **ISO 4217**.

### Table 7.3 — Currency Identifiers

| Currency Value | Identifier | Numeric Code |
|---|---|---|
| U.S. Dollar | `USD` | 840 |
| Euro | `EUR` | 978 |
| British Pound | `GBP` | 826 |
| Japanese Yen | `JPY` | 392 |
| Chinese Renminbi (Yuan) | `CNY` | 156 |
| Indian Rupee | `INR` | 356 |
| Russian Ruble | `RUB` | 643 |

---

## API — `java.util.Currency` 1.4

| Method | Mô tả |
|---|---|
| `static Currency getInstance(String currencyCode)`<br>`static Currency getInstance(Locale locale)` | trả về instance `Currency` cho ISO 4217 currency code cho trước, hoặc cho quốc gia của locale cho trước. |
| `String toString()`<br>`String getCurrencyCode()`<br>`String getNumericCode()` *(7)*<br>`String getNumericCodeAsString()` *(9)* | lấy ISO 4217 currency code dạng chữ hoặc dạng số của currency này. |
| `String getSymbol()`<br>`String getSymbol(Locale locale)` | lấy ký hiệu format của currency này theo default locale hoặc locale cho trước. Ví dụ ký hiệu cho `USD` có thể là `"$"` hoặc `"US$"`, tùy locale. |
| `int getDefaultFractionDigits()` | lấy số chữ số phần thập phân mặc định của currency này. |
| `static Set<Currency> getAvailableCurrencies()` *(7)* | lấy mọi currency có sẵn. |

---

## Bài kế tiếp

→ [[03 - Date and Time]] — `DateTimeFormatter`, `FormatStyle`, `TextStyle`, và các vấn đề locale khi format date/time.
