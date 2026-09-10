# Glossary — Internationalization

> Thuật ngữ chương 7: Internationalization. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## B

**BCP 47**
Memo "Best Current Practices" của Internet Engineering Task Force, nơi **quy định quy tắc cho locale**. Locale tag dạng `en-US` tuân theo chuẩn này; `Locale.forLanguageTag` và `toLanguageTag` làm việc với tag BCP 47. Xem [[01 - Locales#7.1.2. Specifying Locales]].

**Byte Order Mark**
Ký tự **`U+FEFF`** đặt làm ký tự đầu tiên của file. Trong UTF-16 nó cho reader biết file dùng thứ tự byte **big-endian hay little-endian**. UTF-8 là single-byte encoding nên không cần thứ tự byte, nhưng file bắt đầu bằng `0xEF 0xBB 0xBF` là **dấu hiệu mạnh** rằng file dùng UTF-8. Chuẩn Unicode nói reader phải loại bỏ nó, nhưng **implementation Java của Oracle từ chối làm vậy** — `javac` còn báo lỗi `illegal character: \65279`. Xem [[06 - Text Input and Output#7.6.5. The UTF-8 Byte Order Mark]].

**Bundle Class**
Class extend `ResourceBundle` (hoặc `ListResourceBundle`), dùng để **cung cấp resource không phải string**. Khi tìm bundle, **bundle trong class được ưu tiên hơn property file** nếu cùng base name. Xem [[07 - Resource Bundles#7.7.3. Bundle Classes]].

## C

**Choice Format**
Tùy chọn format của `MessageFormat` cho phép **message thay đổi theo giá trị của placeholder** (`no houses` / `one house` / `2 houses`). Là **một dãy các cặp** gồm **lower limit** và **format string**, ngăn nhau bằng `#`, các cặp ngăn nhau bằng `|`. Cần **ít hơn một limit so với số format string** — `MessageFormat` **bỏ qua limit đầu tiên**. Dùng được `<` (nhỏ hơn thực sự), `≤` (đồng nghĩa `#`), và `-∞`. Xem [[05 - Message Formatting#7.5.2. Choice Formats]].

**Collation Key**
Object `CollationKey` do `getCollationKey` trả về, **lưu sẵn kết quả decomposition** của một string để **so sánh về sau nhanh hơn**. Hữu ích khi một string được so sánh với nhiều string khác nhiều lần. Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

**Collator**
Comparator **nhạy với locale** để so sánh string, lấy bằng `Collator.getInstance(locale)`. Vì `Collator` implement `Comparator` nên truyền được cho `List.sort(Comparator)`. Cần thiết vì `String.compareTo` dùng **giá trị UTF-16 encoding**, cho ra kết quả vô lý ngay cả với tiếng Anh, và thứ tự đúng còn khác nhau giữa các ngôn ngữ (tiếng Thụy Điển xếp `Å` **sau `Z`**). Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

**Currency**
Class `java.util.Currency` dùng để **kiểm soát loại tiền tệ mà formatter dùng**, giải quyết việc `getCurrencyInstance` chỉ trả về formatter cho **một loại tiền tệ duy nhất**. Lấy instance bằng `Currency.getInstance` với **ISO 4217 currency code** (`USD`, `EUR`, `GBP`...), rồi gọi `setCurrency` trên formatter. Xem [[02 - Number Formats#7.2.2. Currencies]].

## D

**Decomposition Mode**
Thiết lập của collator quyết định **mức normalization** áp dụng lên string. Ba giá trị: `NO_DECOMPOSITION` (không normalize, **nhanh hơn**), `CANONICAL_DECOMPOSITION` (**mặc định**, form D), `FULL_DECOMPOSITION` (form KD). Collator decompose càng nhiều thì **càng khắt khe** khi quyết định hai string có giống hệt nhau. Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

## E

**Extension**
Thành phần **tùy chọn thứ năm** của locale, mô tả sở thích bản địa về calendar, số, v.v. Extension Unicode bắt đầu bằng `u-` cùng mã hai chữ cái (`ca` cho calendar, `nu` cho số), ví dụ `u-nu-thai`. Extension tùy ý bắt đầu bằng `x-`, ví dụ `x-java`. Xem [[01 - Locales#7.1.2. Specifying Locales]].

## F

**FormatStyle**
Enumeration chọn kiểu format date/time cho `DateTimeFormatter`: `SHORT`, `MEDIUM`, `LONG`, `FULL`. `LONG` và `FULL` cho time **chỉ dành cho `ZonedDateTime`**. Xem [[03 - Date and Time#7.3. Date and Time]].

## I

**ISO 4217**
Chuẩn định nghĩa **currency identifier** (`USD`/840, `EUR`/978, `GBP`/826, `JPY`/392, `CNY`/156, `INR`/356, `RUB`/643). Xem [[02 - Number Formats#7.2.2. Currencies]].

**ISO 639-1**
Chuẩn **language code** hai chữ cái thường (`en`, `de`, `zh`...). Mã trông tùy tiện vì một số lấy từ chính ngôn ngữ bản địa: *Deutsch* → `de`, *zhongwen* → `zh`. Xem [[01 - Locales#7.1.2. Specifying Locales]].

**ISO 3166-1**
Chuẩn **country code** hai chữ cái in hoa (`US`, `DE`, `CH`...). `CH` cho Thụy Sĩ lấy từ tên Latin *Confoederatio Helvetica*. Xem [[01 - Locales#7.1.2. Specifying Locales]].

## L

**ListResourceBundle**
Cách **đơn giản nhất** để implement resource bundle class: đặt mọi resource vào **một object array hai chiều** trả về bởi `getContents()`, còn việc tra cứu thì class lo. Xem [[07 - Resource Bundles#7.7.3. Bundle Classes]].

**Locale**
Object **nắm bắt các sở thích bản địa** về ngôn ngữ và vị trí. Gồm **tối đa năm thành phần**: language, script, country/region, variant, extension. Truyền vào các **locale-aware method** để sinh ra text trình bày cho người dùng ở các nơi khác nhau. Nếu **chỉ chỉ định language** thì locale **không dùng được cho vấn đề đặc thù quốc gia** như tiền tệ. Xem [[01 - Locales]].

**Locale Tag**
Chuỗi các phần tử locale **nối bằng dấu gạch nối**, ví dụ `en-US`, `de-CH`. Dựng locale từ tag bằng `Locale.forLanguageTag`, lấy tag ra bằng `toLanguageTag`. Xem [[01 - Locales#7.1.2. Specifying Locales]].

## M

**MessageFormat**
Class format text **có phần thay đổi được**, tương tự `printf` nhưng **hỗ trợ locale** và format cho số và date. Placeholder dạng `{index,type,style}`; type là `number`, `time`, `date`, `choice`. Static method `format` dùng **locale hiện tại**; muốn locale bất kỳ thì phải dựng object với `new MessageFormat(pattern, loc)` và truyền **array `Object[]`**. Xem [[05 - Message Formatting]].

**Modified UTF-8**
Encoding mà **file class** dùng cho identifier và string. Khi một chương trình biên dịch và chạy có **ba encoding tham gia**: source file dùng platform encoding, class file dùng modified UTF-8, virtual machine dùng UTF-16. Xem [[06 - Text Input and Output#7.6.6. Character Encoding of Source Files]].

## N

**Normalization Form**
Bốn dạng chuẩn hóa string của Unicode: **C** (ký tự có dấu luôn được compose), **D** (luôn được decompose thành chữ cái gốc + dấu kết hợp), **KC** và **KD** (còn decompose cả ligature và ký hiệu trademark). Form **C** được W3C khuyến nghị để **truyền dữ liệu qua Internet**. Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

**Normalizer**
Class `java.text.Normalizer` thực hiện normalization **ngay cả khi không làm collation** — ví dụ để lưu string vào database hoặc giao tiếp với chương trình khác. Method `normalize(str, form)` với form là `NFD`, `NFKD`, `NFC`, `NFKC`. Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

**NumberFormat**
**Abstract class** trong `java.text` cung cấp formatter để format và parse số. Ba factory method: `getNumberInstance`, `getCurrencyInstance`, `getPercentInstance`. Object trả về **thực ra thuộc subclass** của nó — factory method chỉ biết cách định vị object thuộc về một locale cụ thể. Xem [[02 - Number Formats#7.2.1. Formatting Numeric Values]].

## P

**Platform Encoding**
Character encoding mặc định của hệ thống, lấy bằng `Charset.defaultCharset()`. Dùng làm **phỏng đoán** encoding tốt nhất cho file text; cũng là encoding mặc định của `FileHandler` trong logging. **Console có thể dùng encoding khác platform encoding** (cmd shell Windows 10 bản Mỹ vẫn dùng IBM437 trong khi `defaultCharset()` trả về Windows-1252). Xem [[06 - Text Input and Output#7.6.1. Text Files]] và [[06 - Text Input and Output#7.6.3. The Console]].

**Property File**
File text với **một cặp key/value mỗi dòng**, dùng để chỉ định string resource. Đặt tên theo quy ước `baseName_language_country.properties`. **Trước Java 9 phải là file ASCII**, ký tự Unicode phải encode dạng `\uxxxx` (công cụ `native2ascii`). Xem [[07 - Resource Bundles#7.7.2. Property Files]].

## R

**Resource**
Vị trí **bên ngoài source code** để định nghĩa message string, giúp người dịch **sửa file resource mà không phải động vào code**. Resource của Java **không giống resource của Windows/Macintosh**. Xem [[07 - Resource Bundles#7.7. Resource Bundles]].

**Resource Bundle**
Một **property file hoặc một class** mô tả các mục đặc thù locale. Nạp bằng `ResourceBundle.getBundle(baseName, locale)`. Nếu không tìm thấy bundle nào, method ném **`MissingResourceException`**. Xem [[07 - Resource Bundles#7.7.1. Locating Resource Bundles]].

**Resource Hierarchy**
Quan hệ **parent** giữa các bundle: khi `getBundle` định vị được `baseName_de_DE`, nó **vẫn tìm tiếp** `baseName_de` và `baseName`, và chúng trở thành parent. Khi tra một resource không thấy trong bundle hiện tại, **parent sẽ được tra tiếp**. Xem [[07 - Resource Bundles#7.7.1. Locating Resource Bundles]].

## S

**Script**
Thành phần **tùy chọn thứ hai** của locale, **bốn chữ cái với chữ đầu viết hoa**: `Latn` (Latin), `Cyrl` (Cyrillic), `Hant` (chữ Hán phồn thể). Hữu ích vì một số ngôn ngữ như tiếng Serbia viết được bằng cả Latin lẫn Cyrillic. Xem [[01 - Locales#7.1.2. Specifying Locales]].

**Strength**
Thiết lập của collator chọn **mức độ khắt khe**. Khác biệt ký tự phân loại thành **primary** (`A` vs `Z`), **secondary** (`A` vs `Å`), **tertiary** (`A` vs `a`). Còn có `Collator.IDENTICAL` — **không cho phép khác biệt nào**. **Collator mạnh hơn phân biệt được nhiều từ hơn.** Xem [[04 - Collation and Normalization#7.4. Collation and Normalization]].

## T

**TextStyle**
Enumeration `java.time.format.TextStyle` chọn kiểu hiển thị tên tháng/thứ qua `getDisplayName`: `FULL` (`January`), `SHORT` (`Jan`), `NARROW` (`J`), mỗi loại có bản **`_STANDALONE`** dùng khi hiển thị **bên ngoài một date đã format** (tiếng Phần Lan: *tammikuuta* trong date, *tammikuu* độc lập). Xem [[03 - Date and Time#7.3. Date and Time]].

## V

**Variant**
Thành phần **tùy chọn thứ tư** của locale, chỉ định phương ngữ hoặc quy tắc chính tả. **Ngày nay hiếm khi dùng** — sách khuyên **đừng dùng variant trong code mới**, hãy dùng BCP 47 language tag. Variant "Nynorsk" của tiếng Na Uy nay là language code `nn`; variant cho lịch Nhật và chữ số Thái nay là **extension**. Xem [[01 - Locales#7.1.2. Specifying Locales]].

---

## Ba encoding khi biên dịch và chạy

| Thành phần | Encoding |
|---|---|
| Source files | platform encoding |
| Class files | modified UTF-8 |
| Virtual machine | UTF-16 |

Xem [[06 - Text Input and Output#7.6.6. Character Encoding of Source Files]].

## Thứ tự `getBundle` thử nạp bundle

```
baseName_currentLocaleLanguage_currentLocaleCountry
baseName_currentLocaleLanguage
baseName_currentLocaleLanguage_defaultLocaleCountry
baseName_defaultLocaleLanguage
baseName
```

Xem [[07 - Resource Bundles#7.7.1. Locating Resource Bundles]].
