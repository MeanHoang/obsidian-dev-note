# 07 — Resource Bundles

> Chapter 7, Section 7.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.7. Resource Bundles

> *"When localizing an application, you'll probably have a dauntingly large number of message strings, button labels, and so on, that all need to be translated. To make this task feasible, you'll want to define the message strings in an external location, usually called a resource. The person carrying out the translation can then simply edit the resource files without having to touch the source code of the program."*

**Dịch:** Khi localize một ứng dụng, hẳn bạn sẽ có **một lượng lớn đến choáng ngợp** các message string, nhãn button, v.v. cần được dịch. Để việc này khả thi, bạn muốn **định nghĩa message string ở một vị trí bên ngoài**, thường gọi là **resource**. Người dịch khi đó **chỉ cần sửa file resource** mà **không phải động vào source code**.

> *"In Java, you can use property files to specify string resources, and you can implement classes for resources of other types."*

**Dịch:** Trong Java, bạn dùng **property file** để chỉ định resource dạng string, và **implement class** cho resource thuộc kiểu khác.

> **Note (sách):** *"Java technology resources are not the same as Windows or Macintosh resources. A Macintosh or Windows executable program stores resources, such as menus, dialog boxes, icons, and messages, in a section separate from the program code. A resource editor can inspect and update these resources without affecting the program code."*
>
> **Dịch:** Resource của công nghệ Java **không giống resource của Windows hay Macintosh**. Chương trình thực thi trên Macintosh/Windows lưu resource (menu, dialog box, icon, message) **trong một phần tách riêng khỏi code chương trình**, và resource editor xem/cập nhật được chúng mà không ảnh hưởng code.

> **Note (sách):** *"Volume I, Chapter 5 describes a concept of JAR file resources, whereby data files, sounds, and images can be placed in a JAR file. The getResource method of the class Class finds the file, opens it, and returns a URL to the resource. By placing your files into the JAR file, you leave the job of finding the files to the class loader—which already knows how to locate items in a JAR file. However, that mechanism has no locale support."*
>
> **Dịch:** Volume I, Chapter 5 mô tả khái niệm **JAR file resource**: file dữ liệu, âm thanh, ảnh đặt được vào file JAR. Method `getResource` của class `Class` tìm file, mở nó, trả về một `URL` tới resource. Đặt file vào JAR là **giao việc tìm file cho class loader**. Tuy nhiên **cơ chế đó không hỗ trợ locale**.

---

## 7.7.1. Locating Resource Bundles

> *"When localizing an application, you produce a set of resource bundles. Each bundle is a property file or a class that describes locale-specific items (such as messages, labels, and so on). For each bundle, you have to provide versions for all locales that you want to support."*

**Dịch:** Khi localize một ứng dụng, bạn tạo ra **một tập resource bundle**. Mỗi bundle là **một property file hoặc một class** mô tả các mục đặc thù locale. Với mỗi bundle, bạn phải **cung cấp phiên bản cho mọi locale muốn hỗ trợ**.

> *"You need to use a specific naming convention for these bundles. For example, resources specific to Germany go into a file baseName_de_DE, whereas those shared by all German-speaking countries go into baseName_de. In general, use"*

```
baseName_language_country
```

> *"for all country-specific resources, and"*

```
baseName_language
```

> *"for all language-specific resources. Finally, as a fallback, you can put defaults into a file without any suffix."*

**Dịch:** Phải dùng **một quy ước đặt tên cụ thể** cho các bundle này:

| Dạng tên | Dùng cho |
|---|---|
| `baseName_language_country` | mọi resource **đặc thù quốc gia** (vd. `baseName_de_DE`) |
| `baseName_language` | mọi resource **đặc thù ngôn ngữ** (vd. `baseName_de`) |
| `baseName` | **default, làm fallback** — không có hậu tố nào |

> *"To load a bundle, use the command"*

```java
ResourceBundle currentResources = ResourceBundle.getBundle(baseName, currentLocale);
```

### Thứ tự tìm kiếm

> *"The getBundle method attempts to load the bundle that matches the current locale by language and country. If it is not successful, the country and the language are dropped in turn. Then the same search is applied to the default locale, and, finally, the default bundle file is consulted. If even that attempt fails, the method throws a MissingResourceException."*

**Dịch:** Method `getBundle` **thử nạp bundle khớp với locale hiện tại theo language và country**. Nếu không thành công thì **country rồi language lần lượt bị bỏ đi**. Sau đó **cùng cách tìm ấy được áp dụng cho default locale**, và cuối cùng **default bundle file** được tra. Nếu cả nỗ lực đó cũng thất bại, method ném **`MissingResourceException`**.

> *"That is, the getBundle method tries to load the following bundles:"*

```
baseName_currentLocaleLanguage_currentLocaleCountry
baseName_currentLocaleLanguage
baseName_currentLocaleLanguage_defaultLocaleCountry
baseName_defaultLocaleLanguage
baseName
```

### Resource hierarchy

> *"Once the getBundle method has located a bundle (say, baseName_de_DE), it will still keep looking for baseName_de and baseName. If these bundles exist, they become the parents of the baseName_de_DE bundle in a resource hierarchy. Later, when looking up a resource, the parents are searched if a lookup was not successful in the current bundle. That is, if a particular resource was not found in baseName_de_DE, then the baseName_de and baseName will be queried as well."*

**Dịch:** Khi `getBundle` đã định vị được một bundle (ví dụ `baseName_de_DE`), nó **vẫn tiếp tục tìm `baseName_de` và `baseName`**. Nếu các bundle đó tồn tại, chúng **trở thành parent** của bundle `baseName_de_DE` trong một **resource hierarchy**. Về sau, khi tra một resource, **parent sẽ được tìm nếu tra trong bundle hiện tại không thành công**.

```
       baseName            ← parent trên cùng (fallback)
          ▲
      baseName_de          ← parent
          ▲
    baseName_de_DE         ← bundle được định vị
```

> *"This is clearly a very useful service—and one that would be tedious to program by hand. The resource bundle mechanism of the Java programming language automatically locates the items that are the best match for a given locale. It is easy to add more and more localizations to an existing program—all you have to do is create additional resource bundles."*

**Dịch:** Đây rõ ràng là **một dịch vụ rất hữu ích** — và **tự lập trình bằng tay thì rất mệt**. Cơ chế resource bundle của Java **tự động định vị các mục khớp nhất với một locale cho trước**. Thêm ngày càng nhiều localization vào chương trình có sẵn thì **dễ** — chỉ cần **tạo thêm resource bundle**.

> **Note (sách):** *"We simplified the discussion of resource bundle lookup. If a locale has a script or variant, the lookup is quite a bit more complex. See the documentation of the method ResourceBundle.Control.getCandidateLocales for the gory details."*
>
> **Dịch:** Sách **đã đơn giản hóa** phần bàn về việc tra resource bundle. Nếu một locale có **script hoặc variant** thì việc tra **phức tạp hơn khá nhiều**. Xem tài liệu của `ResourceBundle.Control.getCandidateLocales`.

> **Tip (sách):** *"You need not place all resources for your application into a single bundle. You could have one bundle for button labels, one for error messages, and so on."*
>
> **Dịch:** **Không cần đặt mọi resource của ứng dụng vào một bundle duy nhất.** Có thể có một bundle cho nhãn button, một bundle cho error message, v.v.

---

## 7.7.2. Property Files

> *"Internationalizing strings is quite straightforward. You place all your strings into a property file such as MyProgramStrings.properties. This is simply a text file with one key/value pair per line. A typical file would look like this:"*

```properties
computeButton=Rechnen
colorName=black
defaultPaperSize=210×297
```

**Dịch:** Internationalize string thì **khá đơn giản**. Bạn đặt mọi string vào một **property file** như `MyProgramStrings.properties`. Đây đơn giản là **file text với một cặp key/value mỗi dòng**.

> *"Then you name your property files as described in the preceding section, for example:"*

```
MyProgramStrings.properties
MyProgramStrings_en.properties
MyProgramStrings_de_DE.properties
```

> *"You can load the bundle simply as"*

```java
ResourceBundle bundle = ResourceBundle.getBundle("MyProgramStrings", locale);
```

> *"To look up a specific string, call"*

```java
String computeButtonLabel = bundle.getString("computeButton");
```

> **Caution (sách):** *"Before Java 9, files for storing properties had to be ASCII files. If you are using an old Java version and need to place a Unicode character into a property file, encode it using the \uxxxx encoding. For example, to specify "colorName=Grün", use"*
>
> ```properties
> colorName=Grün
> ```
>
> *"You can use the native2ascii tool to generate these encodings."*
>
> **Dịch:** **Trước Java 9**, file lưu property **phải là file ASCII**. Nếu dùng phiên bản Java cũ và cần đặt một ký tự Unicode vào property file, **encode nó bằng dạng `\uxxxx`**. Dùng được công cụ **`native2ascii`** để sinh ra các encoding này.

---

## 7.7.3. Bundle Classes

> *"To provide resources that are not strings, define classes that extend the ResourceBundle class. Use the standard naming convention to name your classes, for example"*

```
MyProgramResources.java
MyProgramResources_en.java
MyProgramResources_de_DE.java
```

> *"Load the class with the same getBundle method that you use to load a property file:"*

```java
ResourceBundle bundle = ResourceBundle.getBundle("MyProgramResources", locale);
```

**Dịch:** Để cung cấp **resource không phải string**, định nghĩa class **extend class `ResourceBundle`**. Dùng **quy ước đặt tên chuẩn** cho class. Nạp class bằng **chính method `getBundle`** dùng để nạp property file.

> **Caution (sách):** *"When searching for bundles, a bundle in a class is given preference over a property file when the two bundles have the same base names."*
>
> **Dịch:** Khi tìm bundle, **bundle nằm trong một class được ưu tiên hơn property file** khi hai bundle có **cùng base name**.

> *"Each resource bundle class implements a lookup table. You need to provide a key string for each setting you want to localize, and use that key string to retrieve the setting. For example,"*

```java
var backgroundColor = (Color) bundle.getObject("backgroundColor");
double[] paperSize = (double[]) bundle.getObject("defaultPaperSize");
```

**Dịch:** Mỗi resource bundle class **implement một lookup table**. Bạn phải cung cấp **một key string cho mỗi thiết lập** muốn localize, rồi dùng key string đó để lấy thiết lập ra.

### `ListResourceBundle`

> *"The simplest way to implement resource bundle classes is to extend the ListResourceBundle class. The ListResourceBundle lets you place all your resources into an object array and then does the lookup for you. Follow this code outline:"*

```java
public class baseName_language_country extends ListResourceBundle
{
   private static final Object[][] contents =
   {
      { key1, value2 },
      { key2, value2 },
      . . .
   }
   public Object[][] getContents() { return contents; }
}
```

**Dịch:** Cách **đơn giản nhất** để implement resource bundle class là **extend class `ListResourceBundle`**. `ListResourceBundle` cho phép bạn đặt mọi resource vào **một object array** rồi **tự làm việc tra cứu** cho bạn.

> *"For example,"*

```java
public class ProgramResources_de extends ListResourceBundle
{
   private static final Object[][] contents =
   {
      { "backgroundColor", Color.black },
      { "defaultPaperSize", new double[] { 210, 297 } }
   }
   public Object[][] getContents() { return contents; }
}

public class ProgramResources_en_US extends ListResourceBundle
{
   private static final Object[][] contents =
   {
      { "backgroundColor", Color.blue },
      { "defaultPaperSize", new double[] { 216, 279 } }
   }
   public Object[][] getContents() { return contents; }
}
```

> **Note (sách):** *"The paper sizes are given in millimeters. Everyone on the planet, with the exception of the United States and Canada, uses ISO 216 paper sizes."*
>
> **Dịch:** Kích thước giấy tính bằng **millimeter**. Mọi người trên hành tinh, **trừ Mỹ và Canada**, đều dùng kích thước giấy **ISO 216**.

### Extend trực tiếp `ResourceBundle`

> *"Alternatively, your resource bundle classes can extend the ResourceBundle class. Then you need to implement two methods, to enumerate all keys and to look up the value for a given key:"*

```java
Enumeration<String> getKeys()
Object handleGetObject(String key)
```

> *"The getObject method of the ResourceBundle class calls the handleGetObject method that you supply."*

**Dịch:** Ngoài ra, resource bundle class của bạn **extend thẳng class `ResourceBundle`** được. Khi đó phải **implement hai method**: liệt kê mọi key, và tra giá trị cho một key cho trước. Method `getObject` của `ResourceBundle` **gọi tới method `handleGetObject` mà bạn cung cấp**.

---

## API — `java.util.ResourceBundle` 1.1

| Method | Mô tả |
|---|---|
| `static ResourceBundle getBundle(String baseName, Locale loc)`<br>`static ResourceBundle getBundle(String baseName)` | nạp resource bundle class có tên cho trước, cho locale cho trước hoặc default locale, **cùng các parent class của nó**. Nếu resource bundle class nằm trong một package thì base name **phải chứa full package name**, ví dụ `"intl.ProgramResources"`. Resource bundle class **phải là `public`** để `getBundle` truy cập được. |
| `Object getObject(String name)` | tra một object từ resource bundle **hoặc parent của nó**. |
| `String getString(String name)` | tra một object từ resource bundle hoặc parent của nó và **cast nó thành string**. |
| `String[] getStringArray(String name)` | tra một object từ resource bundle hoặc parent của nó và **cast nó thành string array**. |
| `Enumeration<String> getKeys()` | trả về một enumeration object để liệt kê các key của resource bundle này. **Nó liệt kê cả key trong các parent bundle.** |
| `Object handleGetObject(String key)` | **nên được override** để tra giá trị resource ứng với key cho trước, nếu bạn định nghĩa cơ chế tra resource của riêng mình. |

---

## Bài kế tiếp

→ [[08 - A Complete Example]] — máy tính hưu trí được localize sang tiếng Anh, Đức, Trung.
