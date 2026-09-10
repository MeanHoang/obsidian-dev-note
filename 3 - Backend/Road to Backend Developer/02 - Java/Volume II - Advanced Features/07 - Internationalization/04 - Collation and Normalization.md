# 04 — Collation and Normalization

> Chapter 7, Section 7.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.4. Collation and Normalization

> *"Most programmers know how to compare strings with the compareTo method of the String class. Unfortunately, when interacting with human users, this method is not very useful. The compareTo method uses the values of the UTF-16 encoding of the string, which leads to absurd results, even in English. For example, the following five strings are ordered according to the compareTo method:"*

```
America
Zulu
able
zebra
Ångström
```

**Dịch:** Đa số lập trình viên biết cách so sánh string bằng method `compareTo` của class `String`. Đáng tiếc là **khi tương tác với người dùng, method này không hữu ích lắm**. Method `compareTo` dùng **giá trị của UTF-16 encoding** của string, dẫn tới **kết quả vô lý, ngay cả với tiếng Anh**.

Xem [[05 - Strings]] và [[02 - Data Types]] (Volume I) về Unicode và UTF-16.

> *"For dictionary ordering, you would want to consider upper case and lower case to be equivalent. To an English speaker, the sample list of words would be ordered as"*

```
able
America
Ångström
zebra
Zulu
```

**Dịch:** Với **thứ tự từ điển**, bạn muốn coi **chữ hoa và chữ thường là tương đương**. Với người nói tiếng Anh, danh sách trên phải được sắp như vậy.

> *"However, that order would not be acceptable to a Swedish user. In Swedish, the letter Å is different from the letter A, and it is collated after the letter Z! That is, a Swedish user would want the words to be sorted as"*

```
able
America
zebra
Zulu
Ångström
```

**Dịch:** Tuy nhiên thứ tự đó **không chấp nhận được với người dùng Thụy Điển**. Trong tiếng Thụy Điển, chữ `Å` **khác** chữ `A`, và nó được collate **sau chữ `Z`**!

### `Collator`

> *"To obtain a locale-sensitive comparator, call the static Collator.getInstance method:"*

```java
Collator coll = Collator.getInstance(locale);
words.sort(coll); // Collator implements Comparator<Object>
```

> *"Since the Collator class implements the Comparator interface, you can pass a Collator object to the List.sort(Comparator) method to sort a list of strings."*

**Dịch:** Để có một **comparator nhạy với locale**, gọi static method **`Collator.getInstance`**. Vì class `Collator` implement interface `Comparator`, bạn **truyền được `Collator` object cho method `List.sort(Comparator)`** để sắp xếp danh sách string.

Xem [[01 - Interfaces]] (Volume I) về `Comparator`.

---

### Strength

> *"There are a couple of advanced settings for collators. You can set a collator's strength to select how selective it should be. Character differences are classified as primary, secondary, or tertiary. For example, in English, the difference between "A" and "Z" is considered primary, the difference between "A" and "Å" is secondary, and between "A" and "a" is tertiary."*

**Dịch:** Có vài thiết lập nâng cao cho collator. Bạn set được **strength** của collator để chọn **mức độ khắt khe** của nó. Khác biệt ký tự được phân loại thành **primary, secondary, tertiary**. Ví dụ trong tiếng Anh, khác biệt giữa `"A"` và `"Z"` là **primary**, giữa `"A"` và `"Å"` là **secondary**, giữa `"A"` và `"a"` là **tertiary**.

> *"By setting the strength of the collator to Collator.PRIMARY, you tell it to pay attention only to primary differences. By setting the strength to Collator.SECONDARY, you instruct the collator to take secondary differences into account. That is, two strings will be more likely to be considered different when the strength is set to "secondary" or "tertiary," as shown in Table 7.6."*

**Dịch:** Đặt strength là `Collator.PRIMARY` là bảo nó **chỉ để ý tới khác biệt primary**. Đặt `Collator.SECONDARY` là bảo collator **tính đến cả khác biệt secondary**. Tức là **hai string càng dễ bị coi là khác nhau** khi strength đặt ở "secondary" hoặc "tertiary".

#### Table 7.6 — Collations with Different Strengths (English Locale)

| Primary | Secondary | Tertiary |
|---|---|---|
| `Angstrom = Ångström` | `Angstrom ≠ Ångström` | `Angstrom ≠ Ångström` |
| `Able = able` | `Able = able` | `Able ≠ able` |

> *"When the strength has been set to Collator.IDENTICAL, no differences are allowed. This setting is mainly useful in conjunction with a rather technical collator setting, the decomposition mode, which we take up next."*

**Dịch:** Khi strength đặt là **`Collator.IDENTICAL`**, **không cho phép bất kỳ khác biệt nào**. Thiết lập này chủ yếu hữu ích khi kết hợp với một thiết lập kỹ thuật hơn của collator: **decomposition mode**.

---

### Normalization forms

> *"Occasionally, a character or sequence of characters can be described in more than one way in Unicode. For example, an "Å" can be Unicode character U+00C5, or it can be expressed as a plain A (U+0065) followed by a ° ("combining ring above"; U+030A). Perhaps more surprisingly, the letter sequence "ffi" can be described with a single character "Latin small ligature ffi" with code U+FB03. (One could argue that this is a presentation issue that should not have resulted in different Unicode characters, but we don't make the rules.)"*

**Dịch:** Đôi khi **một ký tự hay chuỗi ký tự có thể được mô tả theo nhiều cách trong Unicode**. Ví dụ `"Å"` có thể là ký tự Unicode `U+00C5`, hoặc biểu diễn thành chữ `A` thường (`U+0065`) theo sau bởi `°` ("combining ring above"; `U+030A`). Bất ngờ hơn nữa, chuỗi chữ `"ffi"` có thể mô tả bằng **một ký tự duy nhất** "Latin small ligature ffi" mã `U+FB03`.

> *"The Unicode standard defines four normalization forms (D, KD, C, and KC) for strings. In the normalization form C, accented characters are always composed. For example, a sequence of A and a combining ring above ° is combined into a single character Å. In form D, accented characters are always decomposed into their base letters and combining accents: Å is turned into A followed by °. Forms KC and KD also decompose characters such as ligatures or the trademark symbol."*

**Dịch:** Chuẩn Unicode định nghĩa **bốn normalization form (D, KD, C, KC)** cho string:

| Form | Hành vi |
|---|---|
| **C** | ký tự có dấu **luôn được compose**: `A` + `°` gộp thành một ký tự `Å` |
| **D** | ký tự có dấu **luôn được decompose** thành chữ cái gốc và dấu kết hợp: `Å` thành `A` theo sau bởi `°` |
| **KC**, **KD** | **còn decompose cả** các ký tự như ligature hay ký hiệu trademark |

---

### Decomposition mode

> *"You can choose the degree of normalization that you want a collator to use. The value Collator.NO_DECOMPOSITION does not normalize strings at all. This option is faster, but it might not be appropriate for texts that express characters in multiple forms. The default, Collator.CANONICAL_DECOMPOSITION, uses the normalization form D. This is useful for texts that contain accents but not ligatures. Finally, "full decomposition" uses normalization form KD. See Table 7.7 for examples."*

**Dịch:** Bạn chọn được **mức normalization** mà collator dùng:

| Hằng số | Ý nghĩa |
|---|---|
| `Collator.NO_DECOMPOSITION` | **không normalize gì cả**. **Nhanh hơn**, nhưng có thể không phù hợp với text biểu diễn ký tự ở nhiều dạng |
| `Collator.CANONICAL_DECOMPOSITION` | **mặc định**, dùng normalization **form D**. Hữu ích cho text có dấu nhưng không có ligature |
| "full decomposition" | dùng normalization **form KD** |

#### Table 7.7 — Differences between Decomposition Modes

| No Decomposition | Canonical Decomposition | Full Decomposition |
|---|---|---|
| `Å ≠ A°` | `Å = A°` | `Å = A°` |
| `™ ≠ TM` | `™ ≠ TM` | `™ = TM` |

---

### Collation key

> *"It is wasteful to have the collator decompose a string many times. If one string is compared against other strings many times, you can save the decomposition in a collation key object. The getCollationKey method returns a CollationKey object that you can use for further, faster comparisons. Here is an example:"*

```java
String a = . . .;
CollationKey aKey = coll.getCollationKey(a);
if (aKey.compareTo(coll.getCollationKey(b)) == 0) // fast comparison
   . . .
```

**Dịch:** **Lãng phí** nếu để collator decompose một string nhiều lần. Nếu một string được so sánh với nhiều string khác **nhiều lần**, bạn lưu được kết quả decomposition vào một **collation key object**. Method **`getCollationKey`** trả về `CollationKey` object dùng cho **các so sánh về sau nhanh hơn**.

---

### `Normalizer`

> *"Finally, you might want to convert strings into their normalized forms even if you don't do collation—for example, to store strings in a database or communicate with another program. The java.text.Normalizer class carries out the normalization process. For example,"*

```java
String name = "Ångström";
String normalized = Normalizer.normalize(name, Normalizer.Form.NFD); // uses normalization
   // form D
```

> *"The normalized string contains ten characters. The "Å" and "ö" are replaced by "A°" and "o¨" sequences."*

**Dịch:** Cuối cùng, bạn có thể muốn **chuyển string sang dạng normalized ngay cả khi không làm collation** — ví dụ để lưu vào database hoặc giao tiếp với chương trình khác. Class **`java.text.Normalizer`** thực hiện quá trình normalization. String đã normalize chứa **mười ký tự**: `"Å"` và `"ö"` bị thay bằng chuỗi `"A°"` và `"o¨"`.

> *"However, that is not usually the best form for storage and transmission. Normalization form C first applies decomposition and then combines the accents back in a standardized order. According to the W3C, this is the recommended mode for transferring data over the Internet."*

**Dịch:** Tuy nhiên đó **thường không phải dạng tốt nhất để lưu trữ và truyền tải**. Normalization **form C** trước hết áp dụng decomposition rồi **gộp các dấu trở lại theo thứ tự chuẩn hóa**. Theo W3C, đây là **mode được khuyến nghị để truyền dữ liệu qua Internet**.

---

### Chương trình mẫu

> *"The program in Listing 7.4 lets you experiment with collation order. Type a word into the text field and click the Add button to add it to the list of words. Each time you add another word, or change the locale, strength, or decomposition mode, the list of words is sorted again. An = sign indicates words that are considered identical."*

**Dịch:** Chương trình cho phép thử nghiệm thứ tự collation. Gõ một từ vào text field rồi bấm nút **Add**. Mỗi lần thêm từ mới, hoặc đổi locale, strength, decomposition mode, danh sách từ **được sắp xếp lại**. Dấu **`=`** chỉ ra những từ **được coi là giống hệt nhau**.

> *"The locale names in the combo box are displayed in sorted order, using the collator of the default locale. If you run this program with the US English locale, note that "Norwegian (Norway,Nynorsk)" comes before "Norwegian (Norway)", even though the Unicode value of the comma character is greater than the Unicode value of the closing parenthesis."*

**Dịch:** Tên locale trong combo box được hiển thị **theo thứ tự đã sắp**, dùng collator của default locale. Nếu chạy chương trình với locale US English, chú ý rằng `"Norwegian (Norway,Nynorsk)"` **đứng trước** `"Norwegian (Norway)"`, **dù giá trị Unicode của dấu phẩy lớn hơn giá trị Unicode của dấu đóng ngoặc**.

### Listing 7.4 — `collation/CollationTest.java`

```java
package collation;

import java.awt.*;
import java.awt.event.*;
import java.text.*;
import java.util.*;
import java.util.List;

import javax.swing.*;

/**
 * This program demonstrates collating strings under various locales.
 * @version 1.16 2018-05-01
 * @author Cay Horstmann
 */
public class CollationTest
{
   public static void main(String[] args)
   {
      EventQueue.invokeLater(() ->
         {
            var frame = new CollationFrame();
            frame.setTitle("CollationTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
         });
   }
}

/**
 * This frame contains combo boxes to pick a locale, collation strength and decomposition
 * rules, a text field and button to add new strings, and a text area to list the collated
 * strings.
 */
class CollationFrame extends JFrame
{
   private Collator collator = Collator.getInstance(Locale.getDefault());
   private List<String> strings = new ArrayList<>();
   private Collator currentCollator;
   private Locale[] locales;
   private JComboBox<String> localeCombo = new JComboBox<>();
   private JTextField newWord = new JTextField(20);
   private JTextArea sortedWords = new JTextArea(20, 20);
   private JButton addButton = new JButton("Add");
   private EnumCombo<Integer> strengthCombo = new EnumCombo<>(Collator.class, "Primary",
      "Secondary", "Tertiary", "Identical");
   private EnumCombo<Integer> decompositionCombo = new EnumCombo<>(Collator.class,
      "Canonical Decomposition", "Full Decomposition", "No Decomposition");

   public CollationFrame()
   {
      setLayout(new GridBagLayout());
      add(new JLabel("Locale"), new GBC(0, 0).setAnchor(GBC.EAST));
      add(new JLabel("Strength"), new GBC(0, 1).setAnchor(GBC.EAST));
      add(new JLabel("Decomposition"), new GBC(0, 2).setAnchor(GBC.EAST));
      add(addButton, new GBC(0, 3).setAnchor(GBC.EAST));
      add(localeCombo, new GBC(1, 0).setAnchor(GBC.WEST));
      add(strengthCombo, new GBC(1, 1).setAnchor(GBC.WEST));
      add(decompositionCombo, new GBC(1, 2).setAnchor(GBC.WEST));
      add(newWord, new GBC(1, 3).setFill(GBC.HORIZONTAL));
      add(new JScrollPane(sortedWords), new GBC(0, 4, 2, 1).setFill(GBC.BOTH));

      locales = (Locale[]) Collator.getAvailableLocales().clone();
      Arrays.sort(locales,
         (l1, l2) -> collator.compare(l1.getDisplayName(), l2.getDisplayName()));
      for (Locale loc : locales)
         localeCombo.addItem(loc.getDisplayName());
      localeCombo.setSelectedItem(Locale.getDefault().getDisplayName());

      strings.add("America");
      strings.add("able");
      strings.add("Zulu");
      strings.add("zebra");
      strings.add("Ångström");
      strings.add("Ångström");
      strings.add("Angstrom");
      strings.add("Able");
      strings.add("office");
      strings.add("oﬃce");
      strings.add("Java™");
      strings.add("JavaTM");
      updateDisplay();

      addButton.addActionListener(event ->
         {
            strings.add(newWord.getText());
            updateDisplay();
         });

      ActionListener listener = event -> updateDisplay();

      localeCombo.addActionListener(listener);
      strengthCombo.addActionListener(listener);
      decompositionCombo.addActionListener(listener);
      pack();
   }

   /**
    * Updates the display and collates the strings according to the user settings.
    */
   public void updateDisplay()
   {
      Locale currentLocale = locales[localeCombo.getSelectedIndex()];
      localeCombo.setLocale(currentLocale);

      currentCollator = Collator.getInstance(currentLocale);
      currentCollator.setStrength(strengthCombo.getValue());
      currentCollator.setDecomposition(decompositionCombo.getValue());

      strings.sort(currentCollator);

      sortedWords.setText("");
      for (int i = 0; i < strings.size(); i++)
      {
         String s = strings.get(i);
         if (i > 0 && currentCollator.compare(s, strings.get(i - 1)) == 0)
            sortedWords.append("= ");
         sortedWords.append(s + "\n");
      }
      pack();
   }
}
```

---

## API — `java.text.Collator` 1.1

| Method | Mô tả |
|---|---|
| `static Locale[] getAvailableLocales()` | trả về array các `Locale` object mà có sẵn `Collator` object. |
| `static Collator getInstance()`<br>`static Collator getInstance(Locale l)` | trả về collator cho default locale hoặc locale cho trước. |
| `int compare(String a, String b)` | trả về giá trị âm nếu `a` đứng trước `b`, `0` nếu chúng được coi là giống hệt, ngược lại trả về giá trị dương. |
| `boolean equals(String a, String b)` | trả về `true` nếu `a` và `b` được coi là giống hệt, ngược lại `false`. |
| `void setStrength(int strength)`<br>`int getStrength()` | đặt/lấy strength của collator. **Collator mạnh hơn thì phân biệt được nhiều từ hơn.** Giá trị strength là `Collator.PRIMARY`, `Collator.SECONDARY`, `Collator.TERTIARY`. |
| `void setDecomposition(int decomp)`<br>`int getDecompositon()` | đặt/lấy decomposition mode của collator. **Collator decompose string càng nhiều thì càng khắt khe** khi quyết định hai string có được coi là giống hệt hay không. Giá trị là `Collator.NO_DECOMPOSITION`, `Collator.CANONICAL_DECOMPOSITION`, `Collator.FULL_DECOMPOSITION`. |
| `CollationKey getCollationKey(String a)` | trả về một collation key chứa decomposition của các ký tự ở dạng **so sánh nhanh được** với collation key khác. |

## API — `java.text.CollationKey` 1.1

| Method | Mô tả |
|---|---|
| `int compareTo(CollationKey b)` | trả về giá trị âm nếu key này đứng trước `b`, `0` nếu được coi là giống hệt, ngược lại giá trị dương. |

## API — `java.text.Normalizer` 6

| Method | Mô tả |
|---|---|
| `static String normalize(CharSequence str, Normalizer.Form form)` | trả về dạng normalized của `str`. Giá trị `form` là một trong `NFD`, `NFKD`, `NFC`, `NFKC`. |

---

## Bài kế tiếp

→ [[05 - Message Formatting]] — `MessageFormat` với placeholder, type/style, và choice format.
