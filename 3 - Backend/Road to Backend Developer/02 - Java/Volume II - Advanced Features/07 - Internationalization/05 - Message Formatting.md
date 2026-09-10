# 05 — Message Formatting

> Chapter 7, Section 7.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.5. Message Formatting

> *"The Java library has a MessageFormat class that formats text with variable parts. It is similar to formatting with the printf method, but it supports locales and formats for numbers and dates. We will examine that mechanism in the following sections."*

**Dịch:** Java library có class **`MessageFormat`** để format text **có phần thay đổi được**. Nó tương tự việc format bằng method `printf`, nhưng **hỗ trợ locale** và format cho số và date.

Xem [[06 - Formatting and Parsing]] và [[06 - Input and Output]] (Volume I) về `printf`.

---

## 7.5.1. Formatting Numbers and Dates

> *"Here is a typical message format string:"*

```
"On {2}, a {0} destroyed {1} houses and caused {3} of damage."
```

> *"The numbers in braces are placeholders for actual names and values. The static method MessageFormat.format lets you substitute values for the variables. It is a "varargs" method, so you can simply supply the parameters as follows:"*

```java
String msg
   = MessageFormat.format("On {2}, a {0} destroyed {1} houses and caused {3} of damage.",
      "hurricane", 99, new GregorianCalendar(1999, 0, 1).getTime(), 10.0E8);
```

**Dịch:** **Các số trong ngoặc nhọn là placeholder** cho tên và giá trị thật. Static method **`MessageFormat.format`** cho phép thế giá trị vào các biến đó. Nó là **method "varargs"**, nên cứ truyền thẳng parameter vào.

> *"In this example, the placeholder {0} is replaced with "hurricane", {1} is replaced with 99, and so on. The result of our example is the string"*

```
On 1/1/99 12:00 AM, a hurricane destroyed 99 houses and caused 100,000,000 of damage.
```

**Dịch:** Placeholder `{0}` được thay bằng `"hurricane"`, `{1}` thay bằng `99`, v.v.

### Thêm type và style

> *"That is a start, but it is not perfect. We don't want to display the time "12:00 AM," and we want the damage amount printed as a currency value. The way we do this is by supplying an optional format for some of the placeholders:"*

```
"On {2,date,long}, a {0} destroyed {1} houses and caused {3,number,currency} of damage."
```

> *"This example code prints:"*

```
On January 1, 1999, a hurricane destroyed 99 houses and caused $100,000,000 of damage.
```

**Dịch:** Đó mới là bước đầu, **chưa hoàn hảo**. Ta không muốn hiển thị giờ "12:00 AM", và muốn số tiền thiệt hại in ra **dưới dạng giá trị tiền tệ**. Cách làm là **cung cấp một format tùy chọn** cho một số placeholder.

> *"In general, the placeholder index can be followed by a type and a style. Separate the index, type, and style by commas. The type can be any of"*

```
number
time
date
choice
```

**Dịch:** Nói chung, **index của placeholder có thể theo sau bởi một type và một style**. Ngăn cách index, type, style bằng **dấu phẩy**.

> *"If the type is number, then the style can be"*

```
integer
currency
percent
```

> *"or it can be a number format pattern such as $,##0. (See the documentation of the DecimalFormat class for more information about the possible formats.)"*

**Dịch:** Nếu type là `number` thì style có thể là `integer`, `currency`, `percent`, hoặc một **number format pattern** như `$,##0`. (Xem tài liệu class `DecimalFormat`.)

> *"If the type is either time or date, then the style can be"*

```
short
medium
long
full
```

> *"or a date format pattern such as yyyy-MM-dd. (See the documentation of the SimpleDateFormat class for more information about the possible formats.)"*

**Dịch:** Nếu type là `time` hoặc `date` thì style có thể là `short`, `medium`, `long`, `full`, hoặc một **date format pattern** như `yyyy-MM-dd`. (Xem tài liệu class `SimpleDateFormat`.)

```
{ index , type , style }
   │       │      │
   │       │      └─ number → integer | currency | percent | pattern ($,##0)
   │       │         time/date → short | medium | long | full | pattern (yyyy-MM-dd)
   │       └──────── number | time | date | choice
   └──────────────── vị trí trong danh sách argument
```

> **Caution (sách):** *"The static MessageFormat.format method uses the current locale to format the values. To format with an arbitrary locale, you have to work a bit harder because there is no "varargs" method that you can use. You need to place the values to be formatted into an Object[] array, like this:"*
>
> ```java
> var mf = new MessageFormat(pattern, loc);
> String msg = mf.format(new Object[] { values });
> ```
>
> **Dịch:** Static method `MessageFormat.format` **dùng locale hiện tại** để format giá trị. Muốn format theo một locale bất kỳ thì **phải làm thêm chút việc** vì **không có method "varargs"** để dùng. Bạn phải đặt các giá trị cần format vào một **array `Object[]`**.

---

## API — `java.text.MessageFormat` 1.1

| Method | Mô tả |
|---|---|
| `MessageFormat(String pattern)`<br>`MessageFormat(String pattern, Locale loc)` | dựng một message format object với pattern và locale chỉ định. |
| `void applyPattern(String pattern)` | đặt pattern của message format object thành pattern chỉ định. |
| `void setLocale(Locale loc)`<br>`Locale getLocale()` | đặt/lấy locale dùng cho các placeholder trong message. **Locale chỉ được dùng cho các pattern set về sau** bằng cách gọi `applyPattern`. |
| `static String format(String pattern, Object... args)` | format pattern string, dùng `args[i]` làm input cho placeholder `{i}`. |
| `StringBuffer format(Object args, StringBuffer result, FieldPosition pos)` | format pattern của `MessageFormat` này. Parameter `args` **phải là một array các object**. String đã format được **nối vào `result`**, và `result` được trả về. Nếu `pos` bằng `new FieldPosition(MessageFormat.Field.ARGUMENT)`, property `beginIndex` và `endIndex` của nó được đặt về vị trí của text thay cho placeholder `{1}`. Truyền `null` nếu không quan tâm thông tin vị trí. |

## API — `java.text.Format` 1.1

| Method | Mô tả |
|---|---|
| `String format(Object obj)` | format object cho trước theo quy tắc của formatter này. Method này gọi `format(obj, new StringBuffer(), new FieldPosition(1)).toString()`. |

---

## 7.5.2. Choice Formats

> *"Let's look closer at the pattern of the preceding section:"*

```
"On {2}, a {0} destroyed {1} houses and caused {3} of damage."
```

> *"If we replace the disaster placeholder {0} with "earthquake", the sentence is not grammatically correct in English:"*

```
On January 1, 1999, a earthquake destroyed . . .
```

> *"What we really want to do is integrate the article "a" into the placeholder:"*

```
"On {2}, {0} destroyed {1} houses and caused {3} of damage."
```

> *"The {0} would then be replaced with "a hurricane" or "an earthquake". That is especially appropriate if this message needs to be translated into a language where the gender of a word affects the article. For example, in German, the pattern would be"*

```
"{0} zerstörte am {2} {1} Häuser und richtete einen Schaden von {3} an."
```

> *"The placeholder would then be replaced with the grammatically correct combination of article and noun, such as "Ein Wirbelsturm" or "Eine Naturkatastrophe"."*

**Dịch:** Nếu thay placeholder thảm họa `{0}` bằng `"earthquake"` thì câu **sai ngữ pháp tiếng Anh**. Cái ta thực sự muốn là **gộp mạo từ "a" vào trong placeholder**. Khi đó `{0}` sẽ được thay bằng `"a hurricane"` hoặc `"an earthquake"`. Điều đó **đặc biệt phù hợp** nếu message cần được dịch sang một ngôn ngữ mà **giống của từ ảnh hưởng tới mạo từ**, như tiếng Đức.

### Vấn đề số nhiều

> *"Now let us turn to the {1} parameter. If the disaster wasn't all that catastrophic, {1} might be replaced with the number 1, and the message would read:"*

```
On January 1, 1999, a mudslide destroyed 1 houses and . . .
```

> *"Ideally, we would like the message to vary according to the placeholder value, so it would read"*

```
no houses
one house
2 houses
. . .
```

> *"depending on the placeholder value. The choice formatting option was designed for this purpose."*

**Dịch:** Giờ tới parameter `{1}`. Nếu thảm họa không quá khủng khiếp, `{1}` có thể được thay bằng số `1`, và message thành sai ngữ pháp. Lý tưởng thì ta muốn **message thay đổi theo giá trị của placeholder**. Tùy chọn **choice formatting** được thiết kế cho mục đích này.

### Cú pháp choice format

> *"A choice format is a sequence of pairs, each containing"*
> - *"A lower limit"*
> - *"A format string"*
>
> *"The lower limit and format string are separated by a # character, and the pairs are separated by | characters. For example,"*

```
{1,choice,0#no houses|1#one house|2#{1} houses}
```

**Dịch:** Một choice format là **một dãy các cặp**, mỗi cặp gồm **một lower limit** và **một format string**. Lower limit và format string ngăn nhau bằng ký tự **`#`**, còn các cặp ngăn nhau bằng ký tự **`|`**.

#### Table 7.8 — String Formatted by Choice Format

| `{1}` | Result | `{1}` | Result |
|---|---|---|---|
| 0 | `"no houses"` | 3 | `"3 houses"` |
| 1 | `"one house"` | -1 | `"no houses"` |

> *"Why do we use {1} twice in the format string? When the message format applies the choice format to the {1} placeholder and the value is 2, the choice format returns "{1} houses". That string is then formatted again by the message format, and the answer is spliced into the result."*

**Dịch:** Tại sao ta dùng `{1}` **hai lần** trong format string? Khi message format áp dụng choice format lên placeholder `{1}` và giá trị là `2`, **choice format trả về `"{1} houses"`**. String đó rồi **được message format format lại lần nữa**, và kết quả được ghép vào.

> **Note (sách):** *"This example shows that the designer of the choice format was a bit muddleheaded. If you have three format strings, you need two limits to separate them. In general, you need one fewer limit than you have format strings. As you saw in Table 7.8, the MessageFormat class ignores the first limit. The syntax would have been a lot clearer if the designer of this class realized that the limits belong between the choices, such as"*
>
> ```
> no houses|1|one house|2|{1} houses // not the actual format
> ```
>
> **Dịch:** Ví dụ này cho thấy người thiết kế choice format **hơi lú lẫn**. Nếu bạn có ba format string thì bạn cần **hai limit** để ngăn chúng. Nói chung bạn cần **ít hơn một limit so với số format string**. `MessageFormat` **bỏ qua limit đầu tiên**. Cú pháp lẽ ra đã rõ ràng hơn nhiều nếu người thiết kế nhận ra rằng **limit thuộc về khoảng giữa các lựa chọn**.

### Các ký hiệu khác

> *"You can use the < symbol to denote that a choice should be selected if the lower bound is strictly less than the value. You can also use the ≤ symbol (expressed as the Unicode character code ≤) as a synonym for #. If you like, you can even specify a lower bound of –∞ as -∞ for the first value. For example,"*

```
-∞<no houses|0<one house|2≤{1} houses
```

> *"or, using Unicode escapes,"*

```
-∞<no houses|0<one house|2≤{1} houses
```

**Dịch:** Dùng được ký hiệu **`<`** để biểu thị rằng một lựa chọn nên được chọn nếu **lower bound nhỏ hơn thực sự** so với giá trị. Cũng dùng được ký hiệu **`≤`** (mã Unicode `≤`) như **từ đồng nghĩa của `#`**. Nếu muốn, còn chỉ định được lower bound là **`–∞`** dạng `-∞` cho giá trị đầu tiên.

### Ghép lại

> *"Let's finish our natural disaster scenario. If we put the choice string inside the original message string, we get the following format instruction:"*

```java
String pattern = "On {2,date,long}, {0} destroyed {1,choice,0#no houses|1#one house|2#{1} "
   + "houses} and caused {3,number,currency} of damage.";
```

> *"Or, in German,"*

```java
String pattern
   = "{0} zerstörte am {2,date,long} {1,choice,0#kein Haus|1#ein Haus|2#{1} Häuser}"
   + "und richtete einen Schaden von {3,number,currency} an.";
```

> *"Note that the ordering of the words is different in German, but the array of objects you pass to the format method is the same. The order of the placeholders in the format string takes care of the changes in the word ordering."*

**Dịch:** Chú ý **thứ tự các từ khác nhau trong tiếng Đức**, nhưng **array object bạn truyền cho method `format` là như nhau**. **Thứ tự của placeholder trong format string** lo phần thay đổi trật tự từ.

---

## Bài kế tiếp

→ [[06 - Text Input and Output]] — charset của file text, line ending, console, log file, byte order mark, và encoding của source file.
