# 07 — Regular Expressions

> Chapter 2, Section 2.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.7. Regular Expressions

> *"Regular expressions are used to specify string patterns. You can use regular expressions whenever you need to locate strings that match a particular pattern. For example, one of our sample programs locates all hyperlinks in an HTML file by looking for strings of the pattern <a href=". . .">."*

**Dịch:** **Regular expression** dùng để **chỉ định pattern của string**. Dùng regular expression **bất cứ khi nào cần định vị các string khớp một pattern nhất định**. Ví dụ, một chương trình mẫu của sách **tìm mọi hyperlink trong file HTML** bằng cách tìm string theo pattern `<a href=". . .">`.

> *"Of course, when specifying a pattern, the . . . notation is not precise enough. You need to specify exactly what sequence of characters is a legal match, using a special syntax to describe a pattern."*

**Dịch:** Dĩ nhiên khi chỉ định pattern, ký hiệu `. . .` **không đủ chính xác**. Bạn phải chỉ định **chính xác chuỗi character nào là một match hợp lệ**, bằng **một cú pháp riêng để mô tả pattern**.

---

## 2.7.1. The Regular Expression Syntax

> *"Let us start with a simple example. The regular expression"*

```
[Jj]ava.+
```

> *"matches any string of the following form:"*
>
> - *"The first letter is a J or j."*
> - *"The next three letters are ava."*
> - *"The remainder of the string consists of one or more arbitrary characters."*

> *"For example, the string "javanese" matches this particular regular expression, but the string "Core Java" does not."*

**Dịch:** Regular expression trên khớp mọi string dạng: **chữ đầu là `J` hoặc `j`** · **ba chữ tiếp theo là `ava`** · **phần còn lại gồm một hoặc nhiều character bất kỳ**. Ví dụ string `"javanese"` **khớp**, nhưng `"Core Java"` **không khớp**.

> *"As you can see, you need to know a bit of syntax to understand the meaning of a regular expression. Fortunately, for most purposes, a few straightforward constructs are sufficient."*
>
> - *"A character class is a set of character alternatives, enclosed in brackets, such as [Jj], [0-9], [A-Za-z], or [^0-9]. Here the - denotes a range (all characters whose Unicode values fall between the two bounds), and ^ denotes the complement (all characters except those specified)."*
> - *"To include a - inside a character class, make it the first or last item. To include a ], make it the first item. To include a ^, put it anywhere but the beginning. You only need to escape [ and \."*
> - *"There are many predefined character classes such as \d (digits) or \p{Sc} (Unicode currency symbol). See Tables 2.6 and 2.7."*

**Dịch:** May thay, với **hầu hết mục đích thì vài cấu trúc đơn giản là đủ**:

- **Character class** là **một tập các character thay thế nhau, bọc trong ngoặc vuông**, như `[Jj]`, `[0-9]`, `[A-Za-z]`, hay `[^0-9]`. Ở đây **`-` chỉ một khoảng** (mọi character có giá trị Unicode nằm giữa hai biên), và **`^` chỉ phần bù** (mọi character **trừ** những cái được chỉ định).
- Muốn **đưa `-` vào trong character class** thì **để nó ở vị trí đầu hoặc cuối**. Muốn đưa **`]`** vào thì **để nó ở vị trí đầu**. Muốn đưa **`^`** vào thì **đặt nó ở đâu cũng được trừ vị trí đầu**. Bạn **chỉ cần escape `[` và `\`**.
- Có **nhiều predefined character class** như **`\d`** (digit) hay **`\p{Sc}`** (ký hiệu tiền tệ Unicode).

### Table 2.6 — Regular Expression Syntax

**Characters**

| Expression | Description (dịch) | Example |
|---|---|---|
| `c`, không thuộc `. * + ? { \| ( ) [ \ ^ $` | **Chính character `c`** | `J` |
| `.` | **Bất kỳ character nào trừ line terminator**, hoặc **bất kỳ character nào nếu flag `DOTALL` được bật** | |
| `\x{p}` | **Unicode code point** có mã hex `p` | `\x{1D546}` |
| `\uhhhh`, `\xhh`, `\0o`, `\0oo`, `\0ooo` | **UTF-16 code unit** với giá trị hex hoặc octal đã cho | `\uFEFF` |
| `\a`, `\e`, `\f`, `\n`, `\r`, `\t` | Alert (`\x{7}`), escape (`\x{1B}`), form feed (`\x{B}`), newline (`\x{A}`), carriage return (`\x{D}`), tab (`\x{9}`) | `\n` |
| `\cc`, với `c` thuộc `[A-Z]` hoặc một trong `@ [ \ ] ^ _ ?` | **Control character** ứng với character `c` | `\cH` là backspace (`\x{8}`) |
| `\c`, với `c` **không** thuộc `[A-Za-z0-9]` | Chính character `c` | `\\` |
| `\Q. . .\E` | **Mọi thứ giữa điểm mở và điểm đóng của quotation** | `\Q(. . .)\E` khớp string `(. . .)` |

**Character Classes**

| Expression | Description (dịch) | Example |
|---|---|---|
| `[C1C2. . .]`, với `Ci` là character, khoảng `c-d`, hoặc character class | **Bất kỳ character nào** được biểu diễn bởi `C1`, `C2`, ... | `[0-9+-]` |
| `[^. . .]` | **Phần bù** của một character class | `[^\d\s]` |
| `[. . .&&. . .]` | **Giao** của các character class | `[\p{L}&&[^A-Za-z]]` |
| `\p{. . .}`, `\P{. . .}` | Một **predefined character class** (xem Table 2.7); và **phần bù** của nó | `\p{L}` khớp một chữ cái Unicode, `\pL` cũng vậy — **bỏ được cặp ngoặc nhọn quanh một chữ cái đơn** |
| `\d`, `\D` | **Chữ số** (`[0-9]`, hoặc `\p{Digit}` khi flag `UNICODE_CHARACTER_CLASS` được bật); và phần bù | `\d+` là một chuỗi chữ số |
| `\w`, `\W` | **Word character** (`[a-zA-Z0-9_]`, hoặc Unicode word character khi flag `UNICODE_CHARACTER_CLASS` được bật); và phần bù | |
| `\s`, `\S` | **Khoảng trắng** (`[ \n\r\t\f\x{B}]`, hoặc `\p{IsWhite_Space}` khi flag `UNICODE_CHARACTER_CLASS` được bật); và phần bù | `\s*,\s*` là **một dấu phẩy được bao bởi khoảng trắng tuỳ chọn** |
| `\h`, `\v`, `\H`, `\V` | **Khoảng trắng ngang, khoảng trắng dọc**, và phần bù của chúng | |

**Sequences and Alternatives**

| Expression | Description (dịch) | Example |
|---|---|---|
| `XY` | **Bất kỳ string nào từ `X`, theo sau bởi bất kỳ string nào từ `Y`** | `[1-9][0-9]*` là **số dương không có số 0 đứng đầu** |
| `X\|Y` | Bất kỳ string nào **từ `X` hoặc `Y`** | `http\|ftp` |

**Grouping**

| Expression | Description (dịch) | Example |
|---|---|---|
| `(X)` | **Capture** phần khớp của `X` | `'([^']*)'` capture phần text trong dấu nháy |
| `\n` | **Group thứ n** | `(['"]).*\1` khớp `'Fred'` hoặc `"Fred"` nhưng **không khớp `"Fred'`** |
| `(?<name>X)` | Capture phần khớp của `X` **với tên đã cho** | `'(?<id>[A-Za-z0-9]+)'` capture phần khớp với tên `id` |
| `\k<name>` | **Group mang tên đã cho** | `\k<id>` khớp group tên `id` |
| `(?:X)` | **Dùng ngoặc mà không capture `X`** | Trong `(?:http\|ftp)://(.*)`, phần khớp sau `://` là `\1` |
| `(?f1f2. . .:X)`, `(?f1. . .-fk. . .:X)`, với `fi` thuộc `[dimsuUx]` | **Khớp nhưng không capture** `X`, với các flag đã cho **bật hoặc tắt (sau dấu `-`)** | `(?i:jpe?g)` là một phép khớp **không phân biệt hoa thường** |
| `(?. . .)` khác | Xem tài liệu API của class `Pattern` | |

**Quantifiers**

| Expression | Description (dịch) | Example |
|---|---|---|
| `X?` | **`X` tuỳ chọn** | `\+?` là dấu `+` tuỳ chọn |
| `X*`, `X+` | **0 hoặc nhiều `X`**, **1 hoặc nhiều `X`** | `[1-9][0-9]+` là số nguyên **≥ 10** |
| `X{n}`, `X{n,}`, `X{m,n}` | **`n` lần `X`**, **ít nhất `n` lần `X`**, **từ `m` tới `n` lần `X`** | `[0-7]{1,3}` là **một tới ba chữ số octal** |
| `Q?`, với `Q` là một biểu thức có quantifier | **Reluctant quantifier** — thử **phần khớp ngắn nhất trước** rồi mới thử dài hơn | `.*(<.+?>).*` capture **chuỗi ngắn nhất nằm trong ngoặc nhọn** |
| `Q+`, với `Q` là một biểu thức có quantifier | **Possessive quantifier** — lấy **phần khớp dài nhất, không backtracking** | `'[^']*+'` khớp string nằm trong dấu nháy đơn và **thất bại nhanh với string không có dấu nháy đóng** |

**Boundary Matches**

| Expression | Description (dịch) | Example |
|---|---|---|
| `^`, `$` | **Đầu, cuối của input** (hoặc **đầu, cuối của dòng** trong multiline mode) | `^Java$` khớp input hoặc dòng `Java` |
| `\A`, `\Z`, `\z` | **Đầu input**, **cuối input**, **cuối input tuyệt đối** (**không đổi trong multiline mode**) | |
| `\b`, `\B` | **Word boundary**, **nonword boundary** | `\bJava\b` khớp **từ `Java`** |
| `\R` | Một **Unicode line break** | |
| `\G` | **Điểm kết thúc của lần khớp trước** | |

### Table 2.7 — Predefined Character Class Names Used with `\p`

| Character Class Name | Explanation (dịch) |
|---|---|
| `posixClass` | `posixClass` là một trong **`Lower`, `Upper`, `Alpha`, `Digit`, `Alnum`, `Punct`, `Graph`, `Print`, `Cntrl`, `XDigit`, `Space`, `Blank`, `ASCII`**, được hiểu là **class POSIX hay Unicode tuỳ flag `UNICODE_CHARACTER_CLASS`** |
| `IsScript`, `sc=Script`, `script=Script` | Một **script** được `Character.UnicodeScript.forName` chấp nhận |
| `InBlock`, `blk=Block`, `block=Block` | Một **block** được `Character.UnicodeBlock.forName` chấp nhận |
| `Category`, `InCategory`, `gc=Category`, `general_category=Category` | Một tên **một hoặc hai chữ cái** cho một **Unicode general category** |
| `IsProperty` | `Property` là một trong **`Alphabetic`, `Ideographic`, `Letter`, `Lowercase`, `Uppercase`, `Titlecase`, `Punctuation`, `Control`, `White_Space`, `Digit`, `Hex_Digit`, `Join_Control`, `Noncharacter_Code_Point`, `Assigned`** |
| `javaMethod` | Gọi method **`Character.isMethod`** (**không được deprecated**) |

### Tóm tắt các cấu trúc chính

> - *"Most characters match themselves, such as the ava characters in the preceding example."*
> - *"The . symbol matches any character (except possibly line terminators, depending on flag settings)."*
> - *"Use \ as an escape character. For example, \. matches a period and \\ matches a backslash."*
> - *"^ and $ match the beginning and end of a line, respectively."*
> - *"If X and Y are regular expressions, then XY means “any match for X followed by a match for Y.” X | Y means “any match for X or Y.”"*
> - *"You can apply quantifiers X+ (1 or more), X* (0 or more), and X? (0 or 1) to an expression X."*

**Dịch:** **Hầu hết character khớp chính nó**. Ký hiệu **`.` khớp bất kỳ character nào** (có thể trừ line terminator, tuỳ thiết lập flag). Dùng **`\` làm escape character**: `\.` khớp dấu chấm, `\\` khớp một backslash. **`^` và `$` khớp đầu và cuối một dòng.** Nếu `X` và `Y` là regular expression thì **`XY` nghĩa là "khớp `X` rồi khớp `Y`"**, còn **`X | Y` nghĩa là "khớp `X` hoặc `Y`"**. Áp dụng được **quantifier `X+` (1 hoặc nhiều), `X*` (0 hoặc nhiều), `X?` (0 hoặc 1)** lên một biểu thức `X`.

> *"By default, a quantifier matches the largest possible repetition that makes the overall match succeed. You can modify that behavior with suffixes ? (reluctant, or stingy, match: match the smallest repetition count) and + (possessive, or greedy, match: match the largest count even if that makes the overall match fail)."*

**Dịch:** **Mặc định, quantifier khớp số lần lặp lớn nhất có thể mà vẫn khiến toàn bộ phép khớp thành công.** Sửa hành vi đó bằng **hậu tố `?`** (**reluctant** hay **stingy** — khớp **số lần lặp nhỏ nhất**) và **`+`** (**possessive** hay **greedy** — khớp **số lần lặp lớn nhất, kể cả khi điều đó làm toàn bộ phép khớp thất bại**).

> *"For example, the string cab matches [a-z]*ab but not [a-z]*+ab. In the first case, the expression [a-z]* only matches the character c, so that the characters ab match the remainder of the pattern. But the greedy version [a-z]*+ matches the characters cab, leaving the remainder of the pattern unmatched."*

**Dịch:** Ví dụ string **`cab` khớp `[a-z]*ab` nhưng không khớp `[a-z]*+ab`**. Trường hợp đầu, biểu thức `[a-z]*` **chỉ khớp character `c`**, để `ab` khớp phần còn lại của pattern. Nhưng bản greedy `[a-z]*+` **khớp luôn `cab`**, khiến **phần còn lại của pattern không khớp được gì**.

> *"You can use groups to define subexpressions. Enclose the groups in ( ), for example, ([+-]?)([0-9]+). You can then ask the pattern matcher to return the match of each group or to refer back to a group with \n where n is the group number, starting with \1."*

**Dịch:** Dùng **group để định nghĩa subexpression**, bọc trong `( )`. Rồi **yêu cầu pattern matcher trả về phần khớp của từng group**, hoặc **trỏ ngược về một group bằng `\n`** với `n` là **số hiệu group, bắt đầu từ `\1`**.

> *"For example, here is a somewhat complex but potentially useful regular expression that describes decimal or hexadecimal integers:"*

```
[+-]?[0-9]+|0[Xx][0-9A-Fa-f]+
```

**Dịch:** Ví dụ một regular expression **hơi phức tạp nhưng có thể hữu ích**, mô tả **số nguyên thập phân hoặc thập lục phân**.

> *"Unfortunately, the regular expression syntax is not completely standardized between various programs and libraries; there is a consensus on the basic constructs but many maddening differences in the details. The Java regular expression classes use a syntax that is similar to, but not quite the same as, the one used in the Perl language. Table 2.6 shows all constructs of the Java syntax. For more information on the regular expression syntax, consult the API documentation for the Pattern class or the book Mastering Regular Expressions by Jeffrey E. F. Friedl (O’Reilly and Associates, 2006)."*

**Dịch:** Đáng tiếc là **cú pháp regular expression không được chuẩn hoá hoàn toàn** giữa các chương trình và thư viện; **có đồng thuận về các cấu trúc cơ bản** nhưng **vô số khác biệt phát điên ở chi tiết**. Các class regular expression của Java dùng cú pháp **giống, nhưng không hẳn giống**, cú pháp của **Perl**.

---

## 2.7.2. Matching a String

> *"The simplest use for a regular expression is to test whether a particular string matches it. Here is how you program that test in Java. First, construct a Pattern object from a string containing the regular expression. Then, get a Matcher object from the pattern and call its matches method:"*

```java
Pattern pattern = Pattern.compile(patternString);
Matcher matcher = pattern.matcher(input);
if (matcher.matches()) . . .
```

> *"The input of the matcher is an object of any class that implements the CharSequence interface, such as a String, StringBuilder, or CharBuffer."*

**Dịch:** Cách dùng **đơn giản nhất** của regular expression là **kiểm tra xem một string có khớp nó không**. Trước hết **dựng một object `Pattern`** từ string chứa regular expression. Rồi **lấy một object `Matcher`** từ pattern đó và gọi method **`matches`**. **Input của matcher** là object thuộc **bất kỳ class nào implement interface `CharSequence`**, như `String`, `StringBuilder`, hay `CharBuffer`.

### Flag

> *"When compiling the pattern, you can set one or more flags, for example:"*

```java
Pattern pattern = Pattern.compile(expression,
    Pattern.CASE_INSENSITIVE + Pattern.UNICODE_CASE);
```

> *"Or you can specify them inside the pattern:"*

```java
String regex = "(?iU:expression)";
```

> *"Here are the flags:"*

**Dịch:** Khi **compile pattern**, đặt được **một hoặc nhiều flag**; hoặc **chỉ định chúng ngay bên trong pattern**. Các flag:

| Flag | Ý nghĩa (dịch) |
|---|---|
| `Pattern.CASE_INSENSITIVE` hoặc `i` | Khớp character **không phân biệt hoa thường**. Mặc định flag này **chỉ tính tới character US ASCII**. |
| `Pattern.UNICODE_CASE` hoặc `u` | Khi **dùng chung với `CASE_INSENSITIVE`**, dùng **quy tắc hoa thường của Unicode** để khớp. |
| `Pattern.UNICODE_CHARACTER_CLASS` hoặc `U` | Chọn **character class Unicode thay vì POSIX**. **Kéo theo `UNICODE_CASE`.** |
| `Pattern.MULTILINE` hoặc `m` | Làm **`^` và `$` khớp đầu và cuối một dòng**, chứ không phải toàn bộ input. |
| `Pattern.UNIX_LINES` hoặc `d` | **Chỉ `'\n'` là line terminator** khi khớp `^` và `$` trong multiline mode. |
| `Pattern.DOTALL` hoặc `s` | Làm ký hiệu **`.` khớp mọi character, kể cả line terminator**. |
| `Pattern.COMMENTS` hoặc `x` | **Khoảng trắng và comment** (từ `#` tới cuối dòng) **bị bỏ qua**. |
| `Pattern.LITERAL` | Pattern **được hiểu theo nghĩa đen** và **phải khớp chính xác**, có thể trừ chuyện hoa thường. |
| `Pattern.CANON_EQ` | Tính tới **canonical equivalence của Unicode character**. Ví dụ `u` theo sau bởi `¨` (diaeresis) **khớp `ü`**. |

> *"The last two flags cannot be specified inside a regular expression."*

**Dịch:** **Hai flag cuối không chỉ định được bên trong regular expression.**

> *"If you want to match elements in a collection or stream, turn the pattern into a predicate:"*

```java
Stream<String> strings = . . .;
Stream<String> result = strings.filter(pattern.asPredicate());
```

> *"The result contains all strings that match the regular expression."*

**Dịch:** Muốn khớp phần tử trong **một collection hay stream** thì **biến pattern thành một predicate**. Kết quả chứa **mọi string khớp regular expression**.

### Group

> *"If the regular expression contains groups, the Matcher object can reveal the group boundaries. The methods"*

```java
int start(int groupIndex)
int end(int groupIndex)
```

> *"yield the starting index and the past-the-end index of a particular group. You can simply extract the matched string by calling"*

```java
String group(int groupIndex)
```

> *"Group 0 is the entire input; the group index for the first actual group is 1. Call the groupCount method to get the total group count. For named groups, use the methods"*

```java
int start(String groupName)
int end(String groupName)
String group(String groupName)
```

**Dịch:** Nếu regular expression **chứa group**, object `Matcher` **cho biết được ranh giới group**. Hai method trên cho ra **index bắt đầu** và **index ngay sau khi kết thúc** của một group. **Trích thẳng string đã khớp** bằng `group(int groupIndex)`. **Group 0 là toàn bộ input**; **group thật đầu tiên có index là 1**. Gọi **`groupCount`** để lấy **tổng số group**. Với **named group**, dùng ba method nhận `String`.

> *"Nested groups are ordered by the opening parentheses. For example, given the pattern"*

```
(([1-9]|1[0-2]):([0-5][0-9]))[ap]m
```

> *"and the input"*

```
11:59am
```

> *"the matcher reports the following groups"*

| Group Index | Start | End | String |
|---|---|---|---|
| 0 | 0 | 7 | `11:59am` |
| 1 | 0 | 5 | `11:59` |
| 2 | 0 | 2 | `11` |
| 3 | 3 | 5 | `59` |

**Dịch:** **Group lồng nhau được đánh thứ tự theo dấu ngoặc mở.**

> *"Listing 2.6 prompts for a pattern, then for strings to match. It prints out whether or not the input matches the pattern. If the input matches and the pattern contains groups, the program prints the group boundaries as parentheses, for example:"*

```
((11):(59))am
```

**Dịch:** Listing 2.6 hỏi một pattern, rồi hỏi các string để khớp. Nó in ra **input có khớp pattern hay không**. Nếu khớp và pattern có group thì chương trình **in ranh giới group dưới dạng dấu ngoặc**.

### Listing 2.6 — `regex/RegexTest.java`

```java
package regex;

import java.util.*;
import java.util.regex.*;

/**
 * This program tests regular expression matching. Enter a pattern and strings to match,
 * or hit Cancel to exit. If the pattern contains groups, the group boundaries are displayed
 * in the match.
 * @version 1.03 2018-05-01
 * @author Cay Horstmann
 */
public class RegexTest
{
    public static void main(String[] args) throws PatternSyntaxException
    {
        var in = new Scanner(System.in);
        System.out.println("Enter pattern: ");
        String patternString = in.nextLine();

        Pattern pattern = Pattern.compile(patternString);

        while (true)
        {
            System.out.println("Enter string to match: ");
            String input = in.nextLine();
            if (input == null || input.equals("")) return;
            Matcher matcher = pattern.matcher(input);
            if (matcher.matches())
            {
                System.out.println("Match");
                int g = matcher.groupCount();
                if (g > 0)
                {
                    for (int i = 0; i < input.length(); i++)
                    {
                        // Print any empty groups
                        for (int j = 1; j <= g; j++)
                            if (i == matcher.start(j) && i == matcher.end(j))
                                System.out.print("()");
                        // Print ( for non-empty groups starting here
                        for (int j = 1; j <= g; j++)
                            if (i == matcher.start(j) && i != matcher.end(j))
                                System.out.print('(');
                        System.out.print(input.charAt(i));
                        // Print ) for non-empty groups ending here
                        for (int j = 1; j <= g; j++)
                            if (i + 1 != matcher.start(j) && i + 1 == matcher.end(j))
                                System.out.print(')');
                    }
                    System.out.println();
                }
            }
            else
                System.out.println("No match");
        }
    }
}
```

---

## 2.7.3. Finding Multiple Matches

> *"Usually, you don’t want to match the entire input against a regular expression, but to find one or more matching substrings in the input. Use the find method of the Matcher class to find the next match. If it returns true, use the start and end methods to find the extent of the match or the group method without an argument to get the matched string."*

```java
while (matcher.find())
{
    int start = matcher.start();
    int end = matcher.end();
    String match = matcher.group();
    . . .
}
```

> *"In this way, you can process each match in turn. As shown in the code fragment, you can get the matched string as well as its position in the input string."*

**Dịch:** Thường bạn **không muốn khớp toàn bộ input** với một regular expression, mà muốn **tìm một hoặc nhiều substring khớp trong input**. Dùng method **`find`** của class `Matcher` để **tìm phần khớp kế tiếp**. Nếu nó trả về `true` thì dùng **`start`/`end`** để biết **phạm vi phần khớp**, hoặc **`group` không tham số** để lấy **string đã khớp**. Cách này cho phép **xử lý lần lượt từng phần khớp**.

> *"More elegantly, you can call the results method to get a Stream\<MatchResult>. The MatchResult interface has methods group, start, and end, just like Matcher. (In fact, the Matcher class implements this interface.) Here is how you get a list of all matches:"*

```java
List<String> matches = pattern.matcher(input)
    .results()
    .map(Matcher::group)
    .collect(Collectors.toList());
```

**Dịch:** **Thanh lịch hơn**, gọi method **`results`** để lấy một **`Stream<MatchResult>`**. Interface `MatchResult` có method **`group`, `start`, `end`** y như `Matcher` (thực tế **`Matcher` implement interface này**).

> *"If you have the data in a file, you can use the Scanner.findAll method to get a Stream\<MatchResult>, without first having to read the contents into a string. You can pass a Pattern or a pattern string:"*

```java
var in = new Scanner(path, StandardCharsets.UTF_8);
Stream<String> words = in.findAll("\\pL+")
    .map(MatchResult::group);
```

**Dịch:** Nếu data nằm **trong một file**, dùng method **`Scanner.findAll`** để lấy `Stream<MatchResult>` mà **không phải đọc nội dung vào một string trước**. Truyền vào **một `Pattern` hoặc một pattern string** đều được.

> *"Listing 2.7 puts this mechanism to work. It locates all hypertext references in a web page and prints them. To run the program, supply a URL on the command line, such as"*

```
java match.HrefMatch http://horstmann.com
```

**Dịch:** Listing 2.7 dùng cơ chế này để **định vị mọi hypertext reference trong một trang web và in chúng ra**.

### Listing 2.7 — `match/HrefMatch.java`

```java
package match;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.regex.*;

/**
 * This program displays all URLs in a web page by matching a regular expression that
 * describes the <a href=...> HTML tag. Start the program as <br>
 * java match.HrefMatch URL
 * @version 1.03 2018-03-19
 * @author Cay Horstmann
 */
public class HrefMatch
{
    public static void main(String[] args)
    {
        try
        {
            // get URL string from command line or use default
            String urlString;
            if (args.length > 0) urlString = args[0];
            else urlString = "http://openjdk.java.net/";

            // read contents of URL
            InputStream in = new URL(urlString).openStream();
            var input = new String(in.readAllBytes(), StandardCharsets.UTF_8);

            // search for all occurrences of pattern
            var patternString = "<a\\s+href\\s*=\\s*(\"[^\"]*\"|[^\\s>]*)\\s*>";
            Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
            pattern.matcher(input)
                .results()
                .map(MatchResult::group)
                .forEach(System.out::println);
        }
        catch (IOException | PatternSyntaxException e)
        {
            e.printStackTrace();
        }
    }
}
```

---

## 2.7.4. Splitting along Delimiters

> *"Sometimes, you want to break an input along matched delimiters and keep everything else. The Pattern.split method automates this task. You obtain an array of strings, with the delimiters removed:"*

```java
String input = . . .;
Pattern commas = Pattern.compile("\\s*,\\s*");
String[] tokens = commas.split(input);
// "1, 2, 3" turns into ["1", "2", "3"]
```

> *"If there are many tokens, you can fetch them lazily:"*

```java
Stream<String> tokens = commas.splitAsStream(input);
```

**Dịch:** Đôi khi bạn muốn **cắt một input theo các delimiter đã khớp và giữ lại mọi thứ khác**. Method **`Pattern.split`** tự động hoá việc này: bạn nhận được **một array string, đã bỏ delimiter đi**. Nếu **có nhiều token** thì **lấy chúng một cách lười (lazily)** bằng `splitAsStream`.

> *"If you don’t care about precompiling the pattern or lazy fetching, you can just use the String.split method:"*

```java
String[] tokens = input.split("\\s*,\\s*");
```

> *"If the input is in a file, use a scanner:"*

```java
var in = new Scanner(path, StandardCharsets.UTF_8);
in.useDelimiter("\\s*,\\s*");
Stream<String> tokens = in.tokens();
```

**Dịch:** Nếu bạn **không quan tâm tới việc precompile pattern hay lấy lười**, cứ dùng method **`String.split`** (xem [[05 - Strings]]). Nếu input **nằm trong file** thì dùng **scanner**.

---

## 2.7.5. Replacing Matches

> *"The replaceAll method of the Matcher class replaces all occurrences of a regular expression with a replacement string. For example, the following instructions replace all sequences of digits with a # character:"*

```java
Pattern pattern = Pattern.compile("[0-9]+");
Matcher matcher = pattern.matcher(input);
String output = matcher.replaceAll("#");
```

**Dịch:** Method **`replaceAll`** của class `Matcher` **thay mọi lần xuất hiện của một regular expression bằng một replacement string**.

> *"The replacement string can contain references to the groups in the pattern: $n is replaced with the nth group, and ${name} is replaced with the group that has the given name. Use \$ to include a $ character in the replacement text. If you have a string that may contain $ and \, and you don’t want them to be interpreted as group replacements, call matcher.replaceAll(Matcher.quoteReplacement(str))."*

**Dịch:** Replacement string **chứa được reference tới các group** trong pattern: **`$n`** được thay bằng **group thứ n**, và **`${name}`** được thay bằng **group mang tên đã cho**. Dùng **`\$`** để đưa ký tự `$` vào text thay thế. Nếu có một string **có thể chứa `$` và `\`** mà bạn **không muốn chúng bị hiểu là group replacement** thì gọi **`matcher.replaceAll(Matcher.quoteReplacement(str))`**.

> *"If you want to carry out a more complex operation than splicing in group matches, you can provide a replacement function instead of a replacement string. The function accepts a MatchResult and yields a string. For example, here we replace all words with at least four letters with their uppercase version:"*

```java
String result = Pattern.compile("\\pL{4,}")
    .matcher("Mary had a little lamb")
    .replaceAll(m -> m.group().toUpperCase());
// Yields "MARY had a LITTLE LAMB"
```

> *"The replaceFirst method replaces only the first occurrence of the pattern."*

**Dịch:** Muốn làm **thao tác phức tạp hơn việc ghép các group match vào**, đưa vào một **replacement function thay cho replacement string**. Function này **nhận một `MatchResult` và cho ra một string**. Method **`replaceFirst`** **chỉ thay lần xuất hiện đầu tiên** của pattern.

## API — `java.util.regex.Pattern` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `static Pattern compile(String expression)`<br>`static Pattern compile(String expression, int flags)` | **Compile string regular expression thành một object pattern** để **xử lý phần khớp nhanh**. Parameter `flags` có một hoặc nhiều bit **`CASE_INSENSITIVE`, `UNICODE_CASE`, `MULTILINE`, `UNIX_LINES`, `DOTALL`, `CANON_EQ`** được bật. |
| `Matcher matcher(CharSequence input)` | Trả về một **object matcher** dùng để **định vị các phần khớp của pattern trong input**. |
| `String[] split(CharSequence input)`<br>`String[] split(CharSequence input, int limit)`<br>`Stream<String> splitAsStream(CharSequence input)` *(8)* | **Tách input string thành các token**, với pattern **quy định hình dạng của delimiter**. Trả về **array hoặc stream các token**. **Delimiter không nằm trong token.** Dạng thứ hai có parameter **`limit`** chỉ **số string tối đa được sinh ra**: nếu đã tìm thấy **`limit - 1` delimiter khớp** thì **entry cuối của array trả về chứa phần input chưa tách còn lại**. Nếu **`limit` ≤ 0** thì **toàn bộ input được tách**. Nếu **`limit` bằng 0** thì **các string rỗng ở cuối không được đặt vào array trả về**. |

## API — `java.util.regex.Matcher` (Java 1.4)

| Method | Mô tả (dịch) |
|---|---|
| `boolean matches()` | Trả về `true` nếu **input khớp pattern**. |
| `boolean lookingAt()` | Trả về `true` nếu **phần đầu của input khớp pattern**. |
| `boolean find()`<br>`boolean find(int start)` | **Cố tìm phần khớp kế tiếp**, trả về `true` nếu tìm được thêm một phần khớp. |
| `int start()`<br>`int end()` | Trả về **vị trí bắt đầu** hoặc **vị trí ngay sau khi kết thúc** của phần khớp hiện tại. |
| `String group()` | Trả về **phần khớp hiện tại**. |
| `int groupCount()` | Trả về **số group trong pattern input**. |
| `int start(int groupIndex)`<br>`int start(String name)` *(8)*<br>`int end(int groupIndex)`<br>`int end(String name)` *(8)* | Trả về vị trí bắt đầu hoặc vị trí ngay sau khi kết thúc **của một group trong phần khớp hiện tại**. Group được chỉ định bằng **index bắt đầu từ 1**, hoặc **0 để chỉ toàn bộ phần khớp**, hoặc bằng **string định danh một named group**. |
| `String group(int groupIndex)`<br>`String group(String name)` *(7)* | Trả về **string khớp một group** đã cho, chỉ định bằng index bắt đầu từ 1, hoặc 0 để chỉ toàn bộ phần khớp, hoặc bằng string định danh một named group. |
| `String replaceAll(String replacement)`<br>`String replaceFirst(String replacement)` | Trả về string thu được từ input của matcher bằng cách **thay mọi phần khớp, hoặc phần khớp đầu tiên**, bằng replacement string. Replacement string chứa được **reference tới group của pattern dạng `$n`**. Dùng **`\$`** để đưa ký hiệu `$` vào. |
| `static String quoteReplacement(String str)` *(5.0)* | **Quote mọi `\` và `$`** trong `str`. |
| `String replaceAll(Function<MatchResult,String> replacer)` *(9)* | **Thay mọi phần khớp bằng kết quả của function `replacer`** áp lên `MatchResult`. |
| `Stream<MatchResult> results()` *(9)* | Cho ra **stream mọi match result**. |

## API — `java.util.regex.MatchResult` (Java 5)

| Method | Mô tả (dịch) |
|---|---|
| `String group()`<br>`String group(int group)` | Cho ra **string đã khớp**, hoặc string được **group đã cho** khớp. |
| `int start()`<br>`int end()`<br>`int start(int group)`<br>`int end(int group)` | Cho ra **offset bắt đầu và kết thúc** của string đã khớp, hoặc của string được group đã cho khớp. |

## API — `java.util.Scanner` (Java 5.0)

| Method | Mô tả (dịch) |
|---|---|
| `Stream<MatchResult> findAll(Pattern pattern)` *(9)* | Cho ra **stream mọi phần khớp của pattern đã cho** trong input do scanner này sinh ra. |

---

> *"You have now seen how to carry out input and output operations in Java, and had an overview of the regular expression package that was a part of the “new I/O” specification. In the next chapter, we turn to the processing of XML data."*

**Dịch:** Tới đây bạn đã thấy **cách thực hiện thao tác input và output trong Java**, và có cái nhìn tổng quan về **package regular expression** vốn là **một phần của đặc tả "new I/O"**. Chương kế tiếp chuyển sang **xử lý data XML**.

---

## Chương kế tiếp

→ [[01 - Introducing XML]] — XML thay cho property file, cấu trúc tài liệu XML, parse và validate.
