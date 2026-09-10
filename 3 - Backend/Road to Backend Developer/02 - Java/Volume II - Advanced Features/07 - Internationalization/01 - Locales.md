# 01 — Locales

> Chapter 7, Section 7.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.1. Locales

> *"When you look at an application that is adapted to an international market, the most obvious difference you notice is the language. This observation is actually a bit too limiting for true internationalization, since countries can share a common language, but you might still need to do some work to make computer users of both countries happy. As Oscar Wilde famously said: "We have really everything in common with America nowadays, except, of course, language.""*

**Dịch:** Khi nhìn một ứng dụng được thích ứng cho thị trường quốc tế, khác biệt rõ nhất bạn thấy là **ngôn ngữ**. Nhưng nhận xét đó **hơi hạn hẹp** cho internationalization thực thụ, vì các quốc gia **có thể dùng chung một ngôn ngữ** mà bạn vẫn phải làm thêm việc để người dùng máy tính ở cả hai nước đều hài lòng. Như câu nói nổi tiếng của Oscar Wilde: "Ngày nay chúng ta thực sự có mọi thứ chung với nước Mỹ, tất nhiên trừ ngôn ngữ."

---

## 7.1.1. Why Locales?

> *"When you provide international versions of a program, all program messages need to be translated to the local language. However, simply translating the user interface text is not sufficient. There are many more subtle differences—for example, numbers are formatted quite differently in English and in German."*

**Dịch:** Khi cung cấp các phiên bản quốc tế của một chương trình, mọi thông điệp của chương trình đều cần được **dịch sang ngôn ngữ bản địa**. Tuy nhiên, **chỉ dịch text của user interface là chưa đủ**. Còn nhiều khác biệt tinh vi hơn — ví dụ, số được format **rất khác nhau** giữa tiếng Anh và tiếng Đức.

> *"The number `123,456.78` should be displayed as `123.456,78` for a German user—that is, the roles of the decimal point and the decimal comma separator are reversed."*

**Dịch:** Số `123,456.78` phải được hiển thị thành `123.456,78` với người dùng Đức — tức là **vai trò của dấu chấm thập phân và dấu phẩy phân cách bị đảo ngược**.

> *"There are similar variations in the display of dates. In the United States, dates are (somewhat irrationally) displayed as month/day/year. Germany uses the more sensible order of day/month/year, whereas in China, the usage is year/month/day."*

**Dịch:** Có những biến thể tương tự khi hiển thị date. Ở Mỹ, date được hiển thị (hơi thiếu logic) theo **month/day/year**. Đức dùng thứ tự hợp lý hơn là **day/month/year**, còn ở Trung Quốc thì dùng **year/month/day**.

| Locale | Cách trình bày |
|---|---|
| Mỹ | `3/22/61` |
| Đức | `22.03.1961` |

> *"Of course, if the month names are written out explicitly, the difference in languages becomes apparent."*

**Dịch:** Tất nhiên, nếu **tên tháng được viết ra chữ**, khác biệt về ngôn ngữ trở nên rõ ràng.

| Ngôn ngữ | Cách trình bày |
|---|---|
| English | `March 22, 1961` |
| German | `22. März 1961` |
| Chinese | `1961 3 22` |

> *"A locale captures local preferences such as these. Whenever you present numbers, dates, currency values, and other items whose formatting varies by language or location, you need to use locale-aware APIs."*

**Dịch:** Một **locale nắm bắt các sở thích bản địa** kiểu như vậy. Bất cứ khi nào bạn trình bày số, date, giá trị tiền tệ, và các thứ khác mà cách format **thay đổi theo ngôn ngữ hoặc vị trí**, bạn cần dùng **locale-aware API**.

---

## 7.1.2. Specifying Locales

> *"A locale is made up of up to five components:"*

**Dịch:** Một locale được tạo thành từ **tối đa năm thành phần**:

### 1. Language

> *"A language, specified by two or three lowercase letters, such as en (English), de (German), or zh (Chinese). Table 7.1 shows common codes."*

**Dịch:** Một **language**, chỉ định bằng **hai hoặc ba chữ cái thường**, ví dụ `en` (English), `de` (German), hay `zh` (Chinese).

### 2. Script (tùy chọn)

> *"Optionally, a script, specified by four letters with an initial uppercase, such as Latn (Latin), Cyrl (Cyrillic), or Hant (traditional Chinese characters). This can be useful because some languages, such as Serbian, are written in Latin or Cyrillic, and some Chinese readers prefer the traditional over the simplified characters."*

**Dịch:** Tùy chọn, một **script**, chỉ định bằng **bốn chữ cái với chữ đầu viết hoa**, ví dụ `Latn` (Latin), `Cyrl` (Cyrillic), hay `Hant` (chữ Hán phồn thể). Điều này hữu ích vì một số ngôn ngữ, như tiếng Serbia, được viết bằng **Latin hoặc Cyrillic**, và một số độc giả Trung Quốc **thích chữ phồn thể hơn giản thể**.

### 3. Country hoặc region (tùy chọn)

> *"Optionally, a country or region, specified by two uppercase letters or three digits, such as US (United States) or CH (Switzerland). Table 7.2 shows common codes."*

**Dịch:** Tùy chọn, một **country hoặc region**, chỉ định bằng **hai chữ cái in hoa hoặc ba chữ số**, ví dụ `US` (United States) hay `CH` (Switzerland).

### 4. Variant (tùy chọn)

> *"Optionally, a variant, specifying miscellaneous features such as dialects or spelling rules. Variants are rarely used nowadays. There used to be a "Nynorsk" variant of Norwegian, but it is now expressed with a different language code, nn. What used to be variants for the Japanese imperial calendar and Thai numerals are now expressed as extensions (see the next item)."*

**Dịch:** Tùy chọn, một **variant**, chỉ định các đặc điểm linh tinh như **phương ngữ hoặc quy tắc chính tả**. Variant **ngày nay hiếm khi được dùng**. Trước đây có variant "Nynorsk" của tiếng Na Uy, nhưng nay nó được biểu diễn bằng một language code khác là `nn`. Những gì từng là variant cho **lịch hoàng gia Nhật** và **chữ số Thái** nay được biểu diễn dưới dạng **extension**.

### 5. Extension (tùy chọn)

> *"Optionally, an extension. Extensions describe local preferences for calendars (such as the Japanese calendar), numbers (Thai instead of Western digits), and so on. The Unicode standard specifies some of these extensions. Extensions start with u- and a two-letter code specifying whether the extension deals with the calendar (ca), numbers (nu), and so on. For example, the extension u-nu-thai denotes the use of Thai numerals. Other extensions are entirely arbitrary and start with x-, such as x-java."*

**Dịch:** Tùy chọn, một **extension**. Extension mô tả sở thích bản địa về **lịch** (như lịch Nhật), **số** (chữ số Thái thay cho chữ số phương Tây), v.v. Chuẩn Unicode quy định một số extension này. Extension bắt đầu bằng `u-` cùng một **mã hai chữ cái** cho biết extension xử lý về calendar (`ca`), số (`nu`), v.v. Ví dụ extension `u-nu-thai` biểu thị việc dùng chữ số Thái. Các extension khác **hoàn toàn tùy ý** và bắt đầu bằng `x-`, ví dụ `x-java`.

> *"Rules for locales are formulated in the "Best Current Practices" memo BCP 47 of the Internet Engineering Task Force (http://tools.ietf.org/html/bcp47). You can find a more accessible summary at www.w3.org/International/articles/language-tags."*

**Dịch:** Quy tắc cho locale được quy định trong memo "Best Current Practices" **BCP 47** của Internet Engineering Task Force. Bản tóm tắt dễ đọc hơn có tại `www.w3.org/International/articles/language-tags`.

### Table 7.1 — Common ISO 639-1 Language Codes

| Language | Code | Language | Code |
|---|---|---|---|
| Chinese | `zh` | Italian | `it` |
| Danish | `da` | Japanese | `ja` |
| Dutch | `nl` | Korean | `ko` |
| English | `en` | Norwegian | `no` |
| French | `fr` | Portuguese | `pt` |
| Finnish | `fi` | Spanish | `es` |
| German | `de` | Swedish | `sv` |
| Greek | `el` | Turkish | `tr` |

### Table 7.2 — Common ISO 3166-1 Country Codes

| Country | Code | Country | Code |
|---|---|---|---|
| Austria | `AT` | Japan | `JP` |
| Belgium | `BE` | Korea | `KR` |
| Canada | `CA` | The Netherlands | `NL` |
| China | `CN` | Norway | `NO` |
| Denmark | `DK` | Portugal | `PT` |
| Finland | `FI` | Spain | `ES` |
| Germany | `DE` | Sweden | `SE` |
| Great Britain | `GB` | Switzerland | `CH` |
| Greece | `GR` | Taiwan | `TW` |
| Ireland | `IE` | Turkey | `TR` |
| Italy | `IT` | United States | `US` |

> *"The codes for languages and countries seem a bit random because some of them are derived from local languages. German in German is Deutsch, Chinese in Chinese is zhongwen: hence de and zh. And Switzerland is CH, deriving from the Latin term Confoederatio Helvetica for the Swiss confederation."*

**Dịch:** Mã ngôn ngữ và quốc gia **trông có vẻ tùy tiện** vì một số được lấy từ chính ngôn ngữ bản địa. Tiếng Đức trong tiếng Đức là *Deutsch*, tiếng Trung trong tiếng Trung là *zhongwen*: từ đó có `de` và `zh`. Còn Thụy Sĩ là `CH`, xuất phát từ tên Latin *Confoederatio Helvetica*.

### Locale tag

> *"Locales are described by tags—hyphenated strings of locale elements such as en-US."*

**Dịch:** Locale được mô tả bằng **tag** — chuỗi các phần tử locale **nối bằng dấu gạch nối**, ví dụ `en-US`.

> *"In Germany, you would use a locale de-DE. Switzerland has four official languages (German, French, Italian, and Rhaeto-Romance). A German speaker in Switzerland would want to use a locale de-CH. This locale uses the rules for the German language, but currency values are expressed in Swiss francs, not euros."*

**Dịch:** Ở Đức bạn dùng locale `de-DE`. Thụy Sĩ có **bốn ngôn ngữ chính thức** (Đức, Pháp, Ý và Rhaeto-Romance). Một người nói tiếng Đức ở Thụy Sĩ sẽ muốn dùng locale `de-CH`. Locale này dùng **quy tắc của tiếng Đức**, nhưng giá trị tiền tệ được biểu diễn bằng **franc Thụy Sĩ**, không phải euro.

> *"If you only specify the language, say, de, then the locale cannot be used for country-specific issues such as currencies."*

**Dịch:** Nếu bạn **chỉ chỉ định language**, ví dụ `de`, thì locale đó **không dùng được cho các vấn đề đặc thù quốc gia** như tiền tệ.

> *"You can construct a Locale object from a tag string like this:"*

```java
Locale usEnglish = Locale.forLanguageTag("en-US");
```

> *"The toLanguageTag method yields the language tag for a given locale. For example, Locale.US.toLanguageTag() is the string "en-US"."*

**Dịch:** Method `toLanguageTag` cho ra language tag của một locale. Ví dụ `Locale.US.toLanguageTag()` là chuỗi `"en-US"`.

### Locale định sẵn

> *"For your convenience, there are predefined locale objects for various countries:"*

```java
Locale.CANADA
Locale.CANADA_FRENCH
Locale.CHINA
Locale.FRANCE
Locale.GERMANY
Locale.ITALY
Locale.JAPAN
Locale.KOREA
Locale.PRC
Locale.TAIWAN
Locale.UK
Locale.US
```

> *"A number of predefined locales specify just a language without a location:"*

```java
Locale.CHINESE
Locale.ENGLISH
Locale.FRENCH
Locale.GERMAN
Locale.ITALIAN
Locale.JAPANESE
Locale.KOREAN
Locale.SIMPLIFIED_CHINESE
Locale.TRADITIONAL_CHINESE
```

**Dịch:** Có sẵn các locale object **cho nhiều quốc gia** và một số locale chỉ **chỉ định language mà không có vị trí**.

> *"Finally, the static getAvailableLocales method returns an array of all locales known to the virtual machine."*

**Dịch:** Cuối cùng, static method `getAvailableLocales` trả về **array của mọi locale mà virtual machine biết tới**.

> **Note (sách):** *"You can get all language codes as Locale.getISOLanguages() and all country codes as Locale.getISOCountries()."*
>
> **Dịch:** Lấy được **mọi language code** bằng `Locale.getISOLanguages()` và **mọi country code** bằng `Locale.getISOCountries()`.

---

## 7.1.3. The Default Locale

> *"The static getDefault method of the Locale class initially gets the default locale as stored by the local operating system. You can change the default Java locale by calling the setDefault method with a different locale."*

**Dịch:** Static method `getDefault` của class `Locale` ban đầu lấy **default locale như hệ điều hành lưu trữ**. Bạn đổi được default locale của Java bằng cách gọi `setDefault` với một locale khác.

> *"Some operating systems allow the user to specify different locales for displayed messages and for formatting. For example, a French speaker living in the United States can have French menus but currency values in dollar."*

**Dịch:** Một số hệ điều hành cho phép người dùng chỉ định **locale khác nhau cho thông điệp hiển thị và cho việc format**. Ví dụ một người nói tiếng Pháp sống ở Mỹ có thể có **menu tiếng Pháp** nhưng **giá trị tiền tệ bằng dollar**.

> *"To obtain these preferences, call"*

```java
Locale displayLocale = Locale.getDefault(Locale.Category.DISPLAY);
Locale formatLocale = Locale.getDefault(Locale.Category.FORMAT);
```

> **Note (sách):** *"In UNIX, you can specify separate locales for numbers, currencies, and dates, by setting the LC_NUMERIC, LC_MONETARY, and LC_TIME environment variables. Java does not pay attention to these settings."*
>
> **Dịch:** Trên UNIX, bạn chỉ định được locale riêng cho số, tiền tệ và date bằng biến môi trường `LC_NUMERIC`, `LC_MONETARY`, `LC_TIME`. **Java không quan tâm tới các thiết lập này.**

> **Tip (sách):** *"If you want to test a locale that just has language and country settings, you can supply them on the command line when you launch your program. For example, here we set the default locale to de-CH:"*
>
> ```
> java -Duser.language=de -Duser.region=CH MyProgram
> ```
>
> **Dịch:** Muốn test một locale chỉ có thiết lập language và country, bạn **truyền chúng trên command line** khi khởi chạy chương trình.

---

## 7.1.4. Display Names

> *"Once you have a locale, what can you do with it? Initially, not much, as it turns out. The only useful methods in the Locale class are those for identifying the language and country codes. The most important one is getDisplayName. It returns a string describing the locale. This string does not contain the cryptic two-letter codes, but is in a form that can be presented to a user, such as"*

```
German (Switzerland)
```

**Dịch:** Có locale rồi thì làm được gì? Hóa ra **ban đầu chẳng làm được nhiều**. Các method hữu ích duy nhất trong class `Locale` là những method **nhận diện language code và country code**. Quan trọng nhất là **`getDisplayName`**. Nó trả về một string mô tả locale. String này **không chứa mã hai chữ cái khó hiểu**, mà ở dạng **trình bày được cho người dùng**.

> *"Actually, there is a problem here. The display name is issued in the default locale. That might not be appropriate. If your user already selected German as the preferred language, you probably want to present the string in German. You can do just that by giving the German locale as a parameter. The code"*

```java
var loc = new Locale("de", "CH");
System.out.println(loc.getDisplayName(Locale.GERMAN));
```

> *"prints"*

```
Deutsch (Schweiz)
```

**Dịch:** Thực ra có **một vấn đề**: display name được phát ra **theo default locale**, và điều đó có thể **không phù hợp**. Nếu người dùng đã chọn tiếng Đức làm ngôn ngữ ưa thích, hẳn bạn muốn trình bày string **bằng tiếng Đức**. Làm được điều đó bằng cách **truyền locale tiếng Đức vào làm parameter**.

> *"This example shows why you need Locale objects. You feed them to locale-aware methods that produce text that is presented to users in different locations. You will see many examples of this in the following sections."*

**Dịch:** Ví dụ này cho thấy **tại sao bạn cần `Locale` object**. Bạn đưa chúng vào các **locale-aware method** để sinh ra text trình bày cho người dùng ở các vị trí khác nhau.

> **Caution (sách):** *"Even such mundane operations as turning a string into lowercase or uppercase can be locale-specific. For example, in the Turkish locale, the lowercase of the letter I is a dotless ı. Programs that tried to normalize strings by storing them in lowercase have mysteriously failed for Turkish customers where I and the dotted i don't have the same lowercase version. It is a good idea to always use the variants of toUpperCase and toLowerCase that take a Locale argument. For example, try out:"*
>
> ```java
> String cmd = "QUIT".toLowerCase(Locale.forLanguageTag("tr"));
>    // "quıt" with a dotless ı
> ```
>
> *"Of course, in Turkey, where Locale.getDefault() yields just that locale, "QUIT".toLowerCase() is not the same as "quit". If you want to normalize English language strings to lowercase, you should pass an English locale to the toLowerCase method."*
>
> **Dịch:** Ngay cả những thao tác tầm thường như **chuyển string sang chữ thường hay chữ hoa cũng có thể phụ thuộc locale**. Ví dụ trong locale Thổ Nhĩ Kỳ, chữ thường của chữ `I` là **`ı` không chấm**. Các chương trình cố normalize string bằng cách lưu ở dạng chữ thường **đã thất bại một cách bí ẩn** với khách hàng Thổ Nhĩ Kỳ, nơi `I` và `i` có chấm **không có cùng phiên bản chữ thường**. Nên **luôn dùng biến thể của `toUpperCase` và `toLowerCase` nhận argument `Locale`**. Muốn normalize string tiếng Anh sang chữ thường thì **truyền vào locale tiếng Anh**.

Xem thêm [[05 - Strings]] (Volume I) về thao tác trên `String`.

> **Note (sách):** *"You can explicitly set the locale for input and output operations."*
>
> - *"When reading numbers from a Scanner, you can set its locale with the useLocale method."*
> - *"The String.format and PrintWriter.printf methods optionally take a Locale argument."*
>
> **Dịch:** Bạn **set locale tường minh được** cho thao tác input/output: `Scanner` dùng `useLocale`, còn `String.format` và `PrintWriter.printf` **nhận thêm argument `Locale` tùy chọn**.

Xem [[06 - Formatting and Parsing]] và [[06 - Input and Output]] (Volume I).

---

## API — `java.util.Locale` 1.1

| Method | Mô tả |
|---|---|
| `Locale(String language)`<br>`Locale(String language, String country)`<br>`Locale(String language, String country, String variant)` | dựng locale với language, country, variant cho trước. **Đừng dùng variant trong code mới** — dùng IETF BCP 47 language tag. |
| `static Locale forLanguageTag(String languageTag)` *(7)* | dựng locale tương ứng với language tag cho trước. |
| `static Locale getDefault()` | trả về default locale. |
| `static void setDefault(Locale loc)` | đặt default locale. |
| `String getDisplayName()` | trả về tên mô tả locale, biểu diễn theo **locale hiện tại**. |
| `String getDisplayName(Locale loc)` | trả về tên mô tả locale, biểu diễn theo **locale cho trước**. |
| `String getLanguage()` | trả về language code — mã ISO 639 hai chữ cái thường. |
| `String getDisplayLanguage()` | trả về tên ngôn ngữ, biểu diễn theo locale hiện tại. |
| `String getDisplayLanguage(Locale loc)` | trả về tên ngôn ngữ, biểu diễn theo locale cho trước. |
| `String getCountry()` | trả về country code dạng mã ISO 3166 hai chữ cái in hoa. |
| `static String[] getISOCountries()`<br>`static Set<String> getISOCountries(Locale.IsoCountryCode type)` *(9)* | lấy mọi country code hai chữ cái, hoặc mọi country code 2, 3, 4 chữ cái. `type` là một trong các hằng số enum `PART1_ALPHA2`, `PART1_ALPHA3`, `PART3`. |
| `String getDisplayCountry()` | trả về tên quốc gia, biểu diễn theo locale hiện tại. |
| `String getDisplayCountry(Locale loc)` | trả về tên quốc gia, biểu diễn theo locale cho trước. |
| `String toLanguageTag()` *(7)* | trả về IETF BCP 47 language tag của locale này, ví dụ `"de-CH"`. |
| `String toString()` | trả về mô tả locale, language và country ngăn bằng dấu gạch dưới (ví dụ `"de_CH"`). **Chỉ dùng method này để debug.** |

---

## Bài kế tiếp

→ [[02 - Number Formats]] — format và parse số, tiền tệ, phần trăm theo locale bằng `NumberFormat` và `Currency`.
