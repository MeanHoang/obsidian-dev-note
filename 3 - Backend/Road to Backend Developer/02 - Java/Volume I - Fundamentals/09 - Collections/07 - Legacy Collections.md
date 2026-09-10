# 07 — Legacy Collections

> Chapter 9, Section 9.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.7. Legacy Collections

> *"A number of "legacy" container classes have been present since the first release of Java, before there was a collections framework."*

> *"They have been integrated into the Java Collections Framework—see Figure 9.12. I will briefly introduce them in the following sections."*

**Dịch:** Một số container class **"di sản" (legacy)** đã có mặt **từ bản Java đầu tiên**, **trước khi có collections framework**. Chúng **đã được tích hợp vào Java Collections Framework**.

**Figure 9.12: Legacy classes in the Java Collections Framework**

```
       ┌──────────────┐                      ┌──────────────┐
       │     List     │                      │     Map      │
       └──────△───────┘                      └──────△───────┘
              ┊                                     ┊
              ┊                                     ┊
       ┌──────┴───────┐                      ┌──────┴───────┐
       │ AbstractList │                      │  Hashtable   │
       └──────△───────┘                      └──────△───────┘
              │            ┌───────────────┐        │
              │            │ RandomAccess  │        │
              │            └───────△───────┘        │
              │                    ┊                │
       ┌──────┴───────┐┈┈┈┈┈┈┈┈┈┈┈┈┘         ┌──────┴───────┐
       │    Vector    │                      │  Properties  │
       └──────△───────┘                      └──────────────┘
              │
       ┌──────┴───────┐
       │    Stack     │
       └──────────────┘
```

`△` + nét liền = extends; `△` + nét đứt (`┈`) = implements. `List`, `Map`, `RandomAccess` là interface.

---

## 9.7.1. The Hashtable Class

> *"The classic Hashtable class serves the same purpose as the HashMap class and has essentially the same interface. Just like methods of the Vector class, the Hashtable methods are synchronized. If you do not require compatibility with legacy code, you should use a HashMap instead. If you need concurrent access, use a ConcurrentHashMap—see Chapter 10."*

**Dịch:** Class **`Hashtable`** cổ điển **phục vụ cùng mục đích với `HashMap`** và có **về cơ bản là cùng interface**. Giống method của class `Vector`, **method của `Hashtable` được `synchronized`**. Nếu bạn **không cần tương thích với legacy code**, **nên dùng `HashMap`**. Nếu cần **truy cập concurrent**, dùng **`ConcurrentHashMap`** (Chapter 10).

---

## 9.7.2. Enumerations

> *"The legacy collections use the Enumeration interface for traversing sequences of elements. The Enumeration interface has two methods, hasMoreElements and nextElement. These are entirely analogous to the hasNext and next methods of the Iterator interface."*

**Dịch:** Các legacy collection dùng interface **`Enumeration`** để **duyệt dãy element**. Interface này có **hai method: `hasMoreElements` và `nextElement`** — **hoàn toàn tương tự `hasNext` và `next`** của interface `Iterator` (xem [[01 - The Java Collections Framework]]).

> *"If you find this interface with legacy classes, you can use Collections.list to collect the elements in an ArrayList. For example, the LogManager class is only willing to reveal logger names as an Enumeration. Here is how you can get them all:"*

```java
ArrayList<String> loggerNames = Collections.list(LogManager.getLoggerNames());
```

**Dịch:** Nếu gặp interface này ở các legacy class, bạn dùng **`Collections.list`** để **gom element vào một `ArrayList`**. Ví dụ, class `LogManager` **chỉ chịu tiết lộ tên logger dưới dạng `Enumeration`**.

> *"Alternatively, you can turn an enumeration into an iterator:"*

```java
LogManager.getLoggerNames().asIterator().forEachRemaining(n -> { . . . });
```

**Dịch:** Cách khác: **biến một enumeration thành iterator**.

> *"You will occasionally encounter a legacy method with an enumeration parameter. The static method Collections.enumeration yields an enumeration object that enumerates the elements in the collection. For example:"*

```java
List<InputStream> streams = . . .;
var in = new SequenceInputStream(Collections.enumeration(streams));
    // the SequenceInputStream constructor expects an enumeration
```

**Dịch:** Thỉnh thoảng bạn gặp **legacy method có parameter là enumeration**. Static method **`Collections.enumeration`** tạo ra **object enumeration liệt kê các element trong collection**.

> **Note (sách):** *"In C++, it is quite common to use iterators as parameters. Fortunately, on the Java platform, very few programmers use this idiom. It is much smarter to pass around the collection than to pass an iterator. The collection object is more useful. The recipients can always obtain the iterator from the collection when they need to do so, plus they have all the collection methods at their disposal. However, you may find enumerations in some legacy code because they were the only available mechanism for generic collections until the Java Collections Framework appeared in Java 1.2."*
>
> **Dịch:** Trong C++, **dùng iterator làm parameter là chuyện khá phổ biến**. May thay, trên Java **rất ít lập trình viên dùng lối này**. **Truyền collection đi thông minh hơn nhiều so với truyền iterator** — object collection **hữu dụng hơn**: người nhận **luôn lấy được iterator từ collection khi cần**, lại còn **có sẵn mọi method của collection**. Tuy vậy, bạn **có thể gặp enumeration trong một số legacy code**, vì chúng là **cơ chế duy nhất có sẵn cho generic collection cho tới khi framework xuất hiện ở Java 1.2**.

## API — `java.util.Enumeration<E>` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `boolean hasMoreElements()` | trả về `true` nếu **còn element chưa được xem xét**. |
| `E nextElement()` | trả về **element kế tiếp cần xem xét**. **Đừng gọi method này nếu `hasMoreElements()` đã trả về `false`.** |
| `default Iterator<E> asIterator()` **(9)** | tạo ra một **iterator duyệt qua các element được liệt kê**. |

## API — `java.util.Collections` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static <T> Enumeration<T> enumeration(Collection<T> c)` | trả về một **enumeration liệt kê các element của `c`**. |
| `public static <T> ArrayList<T> list(Enumeration<T> e)` | trả về một **array list chứa các element được `e` liệt kê**. |

---

## 9.7.3. Property Maps

> *"A property map is a map structure of a special type. It has three particular characteristics:"*
> - *"The keys and values are strings."*
> - *"The map can easily be saved to a file and loaded from a file."*
> - *"There is a secondary table for default values."*

**Dịch:** **Property map** là một cấu trúc map **kiểu đặc biệt**, có **ba đặc điểm**:
- **Key và value đều là string.**
- Map **lưu ra file và nạp lại từ file rất dễ dàng.**
- Có **một bảng phụ chứa giá trị mặc định.**

> *"The Java platform class that implements a property map is called Properties. Property maps are useful in specifying configuration options for programs. For example:"*

```java
var settings = new Properties();
settings.setProperty("width", "600.0");
settings.setProperty("filename", "/home/cay/books/corejava/code/v1ch09/raven.html");
```

> *"Use the getProperty method to look up the value for a key:"*

```java
String filename = settings.getProperty("filename");
```

**Dịch:** Class implement property map trên Java platform tên là **`Properties`**. Property map **hữu ích khi chỉ định option cấu hình cho chương trình**. Dùng **`getProperty`** để tra value theo key.

> **Caution (sách):** *"For historical reasons, the Properties class implements Map<Object, Object>. Therefore, you can use the get and put methods of the Map interface. But the get method returns the type Object, and the put method allows you to insert any object. It is best to stick with the getProperty and setProperty methods that work with strings, not objects."*
>
> **Dịch:** Vì **lý do lịch sử**, class `Properties` implement **`Map<Object, Object>`**. Do đó bạn **dùng được `get` và `put` của interface `Map`**. Nhưng `get` **trả về kiểu `Object`**, và `put` **cho phép chèn object bất kỳ**. **Tốt nhất là bám vào `getProperty` và `setProperty`** — hai method làm việc với **string chứ không phải object**.

> *"Use the store method to save the properties to a file. The second argument is a comment that is included in the file."*

```java
var out = new FileWriter("program.properties");
settings.store(out, "Program Properties");
```

> *"The sample set gives the following output:"*

```
#Program Properties
#Sun Dec 31 12:54:19 PST 2023
top=227.0
left=1286.0
width=423.0
height=547.0
filename=/home/cay/books/corejava/code/v1ch09/raven.html
```

**Dịch:** Dùng **`store`** để **lưu properties ra file**. **Argument thứ hai là một comment được đưa vào file.**

> *"To load the properties from a file, use"*

```java
var in = new FileReader("program.properties");
settings.load(in);
```

**Dịch:** Để **nạp properties từ file**, dùng **`load`**.

> **Caution (sách):** *"If you use the load and store methods with input/output streams, then the archaic ISO 8859-1 character encoding is used, and characters > U+00FF are saved as Unicode escapes. For UTF-8, use readers/writers, as in the code snippets above. Prior to Java 18, set the character encoding explicitly to StandardCharsets.UTF_8."*
>
> **Dịch:** Nếu dùng `load` và `store` với **input/output stream**, thì **character encoding cổ lỗ ISO 8859-1 được dùng**, và **ký tự > U+00FF bị lưu dưới dạng Unicode escape**. Muốn **UTF-8** thì **dùng reader/writer** như các đoạn code trên. **Trước Java 18**, phải **đặt character encoding tường minh thành `StandardCharsets.UTF_8`**.

### Giá trị mặc định

> *"The Properties class has two mechanisms for providing defaults. First, whenever you look up the value of a string, you can specify a default that should be used automatically when the key is not present."*

```java
String filename = settings.getProperty("filename", "");
```

> *"If there is a "filename" property in the property map, filename is set to that string. Otherwise, filename is set to the empty string."*

**Dịch:** Class `Properties` có **hai cơ chế cung cấp giá trị mặc định**. Thứ nhất, mỗi khi tra value của một string, bạn **chỉ định được một giá trị mặc định** sẽ **tự động được dùng khi key không có mặt**.

> *"If you find it too tedious to specify the default in every call to getProperty, you can pack all the defaults into a secondary property map and supply that map in the constructor of your primary property map."*

```java
var defaultSettings = new Properties();
defaultSettings.setProperty("width", "600");
defaultSettings.setProperty("height", "400");
defaultSettings.setProperty("filename", "");
. . .
var settings = new Properties(defaultSettings);
```

> *"Yes, you can even specify defaults to defaults if you give another property map argument to the defaultSettings constructor, but it is not something one would normally do."*

**Dịch:** Nếu thấy **phiền vì phải chỉ định mặc định ở mọi lời gọi `getProperty`**, bạn **gói hết mặc định vào một property map phụ** và **truyền map đó vào constructor của property map chính**. Đúng vậy, bạn thậm chí **chỉ định được mặc định cho mặc định** nếu đưa thêm một property map vào constructor của `defaultSettings` — **nhưng bình thường không ai làm thế**.

> *"The companion code has a sample program that shows how you can use properties for storing and loading program state. The program uses the ImageViewer program from Chapter 2 and remembers the frame position, size, and last loaded file. Run the program, load a file, and move and resize the window. Then close the program and reopen it to see that it remembers your file and your favorite window placement. You can also manually edit the file .corejava/ImageViewer.properties in your home directory."*

**Dịch:** Code đi kèm sách có chương trình mẫu cho thấy cách **dùng properties để lưu và nạp state của chương trình**: nó **nhớ vị trí frame, kích thước và file nạp gần nhất**.

> *"Properties are simple tables without a hierarchical structure. It is common to introduce a fake hierarchy with key names such as window.main.color, window.main.title, and so on. But the Properties class has no methods that help organize such a hierarchy. If you store complex configuration information, you should use the Preferences class instead—see Chapter 10 of Volume II."*

**Dịch:** Properties là **bảng đơn giản, không có cấu trúc phân cấp**. Người ta thường **tạo ra một phân cấp giả** bằng tên key kiểu `window.main.color`, `window.main.title`… Nhưng class `Properties` **không có method nào giúp tổ chức phân cấp như vậy**. Nếu lưu **thông tin cấu hình phức tạp**, **nên dùng class `Preferences`** (Volume II, Chapter 10).

## API — `java.util.Properties` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Properties()` | tạo một **property map rỗng**. |
| `Properties(Properties defaults)` | tạo một property map rỗng **với một map các giá trị mặc định**. |
| `String getProperty(String key)` | lấy một property. Trả về **string gắn với key**, hoặc **string gắn với key trong bảng mặc định** nếu key không có trong bảng chính, hoặc **`null` nếu key cũng không có trong bảng mặc định**. |
| `String getProperty(String key, String defaultValue)` | lấy một property **với giá trị mặc định nếu không tìm thấy key**. Trả về string gắn với key, hoặc **string mặc định** nếu key không có trong bảng. |
| `Object setProperty(String key, String value)` | đặt một property. Trả về **giá trị đã đặt trước đó của key**. |
| `Set<String> stringPropertyNames()` **(6)** | trả về **set mọi key**, **kể cả key từ map mặc định**. |
| `void load(Reader in) throws IOException` **(6)** | **nạp một property map từ một reader**. |
| `void store(Writer out, String header)` **(6)** | **lưu một property map ra một writer**. **`header` nằm ở dòng đầu của file được lưu.** |

---

## 9.7.4. System Properties

> *"The System.getProperties method yields a Properties object to describe system information. For example, the home directory has the key "user.home"."*

> *"You can read it with the getProperty method that yields the key as a string:"*

```java
String userDir = System.getProperty("user.home");
```

**Dịch:** Method **`System.getProperties`** tạo ra một object `Properties` **mô tả thông tin hệ thống**. Ví dụ, **home directory có key `"user.home"`**.

> *"To get the Java version of the virtual machine, look up the "java.version" property. You get a string such as "21.0.1" (but "1.8.0" up to Java 8.)"*

**Dịch:** Để lấy **phiên bản Java của virtual machine**, tra property **`"java.version"`**. Bạn nhận về chuỗi kiểu **`"21.0.1"`** (nhưng **`"1.8.0"` với Java 8 trở về trước**).

> **Tip (sách):** *"As you can see, the version numbering changed in Java 9. This seemingly small change broke a good number of tools that had relied on the old format. If you parse the version string, be sure to read JEP 322 at https://openjdk.org/jeps/322 to see how version strings will be formatted in the future—or at least, until the numbering scheme changes again."*
>
> **Dịch:** **Cách đánh số phiên bản đã đổi ở Java 9.** Thay đổi tưởng nhỏ này **đã làm hỏng kha khá công cụ dựa vào định dạng cũ**. Nếu bạn **parse chuỗi version**, hãy đọc **JEP 322** để biết chuỗi version **sẽ được định dạng thế nào trong tương lai** — hoặc ít nhất là **cho tới khi cách đánh số lại đổi lần nữa**.

> **Tip (sách):** *"To print out all system properties, run:"*
>
> ```
> java -XshowSettings:properties
> ```
>
> **Dịch:** Để **in ra mọi system property**, chạy lệnh trên.

> *"The java.version system property is set by the virtual machine and should not be changed. Other system properties can be set with the -D command line option:"*

```
java -Duser.language=fr -Duser.country=CA MyProg
```

> *"To make properties available in jshell, use the -R option like this:"*

```
jshell -R-Duser.language=fr -R-Duser.country=CA
```

**Dịch:** System property `java.version` **do virtual machine đặt** và **không nên bị thay đổi**. Các system property khác **đặt được bằng option dòng lệnh `-D`**. Để **dùng được property trong `jshell`**, dùng **option `-R`**.

> *"To get a numeric or Boolean system property value, use the static methods Boolean.getBoolean(), Integer.getInteger, and Long.getLong:"*

```java
Integer version = Integer.getInteger("java.specification.version");
```

**Dịch:** Để lấy **giá trị system property kiểu số hoặc Boolean**, dùng static method **`Boolean.getBoolean()`**, **`Integer.getInteger`** và **`Long.getLong`**.

## API — `java.lang.System` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Properties getProperties()` | lấy **mọi system property**. Ứng dụng **phải có quyền lấy mọi property**, nếu không sẽ **ném security exception**. |
| `String getProperty(String key)` | lấy system property theo tên key cho trước. **Các property sau luôn có mặt** (xem danh sách bên dưới). |

Danh sách các system property **luôn có mặt**:

```
java.version                     java.vm.specification.version
java.version.date                java.vm.specification.vendor
java.vendor                      java.vm.specification.name
java.vendor.url                  java.vm.version
java.home                        java.vm.vendor
java.class.path                  java.vm.name
java.library.path                os.name
java.class.version               os.version
java.specification.version       os.arch
java.specification.vendor        file.separator
java.specification.name          path.separator
line.separator                   java.io.tmpdir
user.name                        user.home
user.dir                         native.encoding
stdout.encoding                  stderr.encoding
```

## API — `java.lang.Boolean` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static boolean getBoolean(String name)` | Trả về `true` nếu system property có tên cho trước **mang giá trị `"true"`** (**không phân biệt chữ hoa/thường**), ngược lại trả về `false`. |

## API — `java.lang.Integer` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Integer getInteger(String nm)` / `getInteger(String nm, int val)` / `getInteger(String nm, Integer val)` | Trả về kết quả của việc gọi **`Integer.decode`** trên system property có tên cho trước. Nếu **không có system property đó**, hoặc **giá trị của nó không decode được**, method trả về **giá trị mặc định**, hoặc **`null`** nếu không cung cấp giá trị mặc định. |

## API — `java.lang.Long` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Long getLong(String nm)` / `getLong(String nm, int val)` / `getLong(String nm, Long val)` | Trả về kết quả của việc gọi **`Long.decode`** trên system property có tên cho trước. Nếu không có system property đó, hoặc giá trị của nó không decode được, method trả về **giá trị mặc định**, hoặc **`null`** nếu không cung cấp. |

---

## 9.7.5. Stacks

> *"Since version 1.0, the Java API had a Stack class with the familiar push and pop methods. However, the Stack class extends the Vector class, which is not satisfactory from a theoretical perspective—you can apply such un-stack-like operations as insert and remove to insert and remove values anywhere, not just at the top of the stack."*

**Dịch:** Từ **bản 1.0**, Java API đã có class **`Stack`** với các method quen thuộc **`push`** và **`pop`**. Nhưng class `Stack` **extends class `Vector`** — điều này **không thoả đáng về mặt lý thuyết**: bạn **áp dụng được cả những thao tác chẳng-giống-stack chút nào** như `insert` và `remove` để **thêm/xoá giá trị ở bất kỳ đâu**, **không riêng đỉnh stack**.

## API — `java.util.Stack<E>` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `E push(E item)` | **đẩy `item` lên stack** và trả về `item`. |
| `E pop()` | **lấy ra và trả về item ở đỉnh stack**. **Đừng gọi method này nếu stack rỗng.** |
| `E peek()` | trả về **đỉnh stack mà không lấy nó ra**. **Đừng gọi method này nếu stack rỗng.** |

---

## 9.7.6. Bit Sets

> *"The Java platform's BitSet class stores a sequence of bits, packed into implementation-specific "words", which are currently long values. That is much more efficient than using an array of boolean values."*

**Dịch:** Class **`BitSet`** của Java platform **lưu một dãy bit**, **đóng gói vào các "word" tuỳ implementation** — hiện tại là **giá trị `long`**. Cách đó **hiệu quả hơn nhiều so với dùng một array giá trị `boolean`**.

> *"The BitSet class gives you a convenient interface for reading, setting, and resetting individual bits. Using this interface avoids the masking and other bit-fiddling operations that are necessary if you store bits in int or long variables."*

**Dịch:** `BitSet` cho bạn **một interface tiện lợi để đọc, bật và tắt từng bit**. Dùng interface này **tránh được các thao tác masking và vọc bit** vốn cần thiết nếu bạn **lưu bit trong biến `int` hoặc `long`**.

> *"For example, for a BitSet named bucketOfBits,"*

```java
bucketOfBits.get(i)
```

> *"returns true if the ith bit is on, and false otherwise. Similarly,"*

```java
bucketOfBits.set(i)
```

> *"turns the ith bit on. Finally,"*

```java
bucketOfBits.clear(i)
```

> *"turns the ith bit off."*

**Dịch:** `get(i)` trả về `true` nếu **bit thứ i đang bật**; `set(i)` **bật bit thứ i**; `clear(i)` **tắt bit thứ i**.

> *"You can use a BitSet to represent a set of nonnegative integers with an upper bound. Set the ith bit to indicate that the integer i is in the set. This is more efficient than using a Set<Integer> if the upper bound is not too large and the set has many elements."*

**Dịch:** Bạn dùng `BitSet` để **biểu diễn một set các số nguyên không âm có cận trên**. **Bật bit thứ i để báo rằng số nguyên i nằm trong set.** Cách này **hiệu quả hơn dùng `Set<Integer>`** nếu **cận trên không quá lớn** và **set có nhiều element**.

> **C++ Note (sách):** *"The C++ bitset template has the same functionality as the Java platform BitSet."*
>
> **Dịch:** Template **`bitset` của C++** có **cùng chức năng** với `BitSet` của Java platform.

## API — `java.util.BitSet` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `BitSet(int initialCapacity)` | dựng một bit set. |
| `int cardinality()` **(1.4)** | trả về **số bit đang được bật**, hay — khi coi nó như một set các số nguyên — **số element**. |
| `int length()` **(1.2)** | trả về **"độ dài logic"** (**1 cộng với index của bit được bật cao nhất**). Hữu ích để **duyệt qua các element**. |
| `int size()` | trả về **số bit hiện có sẵn trong data structure bên trong**, **không phải số element được bật**. |
| `boolean get(int bit)` | **lấy** một bit. |
| `void set(int bit)` | **bật** một bit. |
| `void clear(int bit)` | **tắt** một bit. |
| `void and(BitSet set)` | **AND logic** bit set này với một bit set khác. |
| `void or(BitSet set)` | **OR logic** bit set này với một bit set khác. |
| `void xor(BitSet set)` | **XOR logic** bit set này với một bit set khác. |
| `void andNot(BitSet set)` | **tắt mọi bit trong bit set này mà đang bật ở bit set kia**. |
| `IntStream stream()` **(8)** | tạo ra một **stream các giá trị index của những bit đang bật**, hay — khi coi như một set các số nguyên — **stream các element**. |

### Sieve of Eratosthenes

> *"As an example of using bit sets, I want to show you an implementation of the "sieve of Eratosthenes" algorithm for finding prime numbers. (A prime number is a number like 2, 3, or 5 that is divisible only by itself and 1, and the sieve of Eratosthenes was one of the first methods discovered to enumerate these fundamental building blocks.) This isn't a terribly good algorithm for finding the primes, but for some reason it has become a popular benchmark for compiler performance. (It isn't a good benchmark either, because it mainly tests bit operations.)"*

**Dịch:** Làm ví dụ dùng bit set, sách trình bày implementation của algorithm **"sàng Eratosthenes"** để **tìm số nguyên tố**. (**Số nguyên tố** là số như 2, 3, 5 — **chỉ chia hết cho chính nó và 1**; sàng Eratosthenes là **một trong những phương pháp đầu tiên được tìm ra** để liệt kê các viên gạch nền tảng này.) Đây **không phải algorithm tìm số nguyên tố tốt cho lắm**, nhưng vì lý do nào đó **đã thành một benchmark phổ biến cho performance của compiler** — mà **cũng chẳng phải benchmark tốt**, vì nó **chủ yếu test các thao tác bit**.

> *"Oh well, I bow to tradition and present an implementation. This program counts all prime numbers between 2 and 2,000,000. (There are 148,933 primes in this interval, so you probably don't want to print them all out.)"*

**Dịch:** Chương trình này **đếm mọi số nguyên tố từ 2 tới 2.000.000**. (Có **148.933 số nguyên tố** trong khoảng này, nên **chắc bạn không muốn in hết ra**.)

> *"Without going into too many details of this program, the idea is to march through a bit set with 2 million bits. First, we turn on all the bits. After that, we turn off the bits that are multiples of numbers known to be prime. The positions of the bits that remain after this process are themselves prime numbers. Listing 9.8 lists this program in the Java programming language, and Listing 9.9 is the C++ code."*

**Dịch:** Ý tưởng là **đi qua một bit set 2 triệu bit**. **Đầu tiên bật hết mọi bit.** Sau đó **tắt những bit là bội của các số đã biết là nguyên tố**. **Vị trí của các bit còn lại sau quá trình đó chính là số nguyên tố.**

> **Note (sách):** *"Even though the sieve isn't a good benchmark, I couldn't resist timing the two implementations of the algorithm. Here are the timing results with an Intel i7-1165G7 processor and 32 GB of RAM, running Ubuntu 22.04:"*
>
> - *"C++ (g++ 11.4.0): 70 milliseconds"*
> - *"Java (Java 21): 20 milliseconds"*
>
> *"I have run this test for thirteen editions of Core Java, and in the last nine editions, Java easily beat C++. In all fairness, if one cranks up the optimization level in the C++ compiler, it beats Java with a time of 16 milliseconds. Java could only match that if the program ran long enough to trigger the Hotspot just-in-time compiler."*
>
> **Dịch:** Dù sàng không phải benchmark tốt, tác giả **không nhịn được việc đo giờ hai implementation**. Kết quả trên **Intel i7-1165G7, 32 GB RAM, Ubuntu 22.04**: **C++ (g++ 11.4.0) 70 mili giây**, **Java (Java 21) 20 mili giây**. Tác giả đã chạy test này **suốt mười ba lần tái bản Core Java**, và **chín lần gần nhất Java thắng C++ dễ dàng**. Công bằng mà nói, **nếu vặn mức tối ưu của compiler C++ lên** thì **C++ thắng với 16 mili giây** — Java **chỉ theo kịp nếu chương trình chạy đủ lâu để kích hoạt Hotspot just-in-time compiler**.

### Listing 9.8 — `sieve/Sieve.java`

```java
package sieve;

import java.util.*;

/**
 * This program runs the Sieve of Erathostenes benchmark. It computes all primes
 * up to 2,000,000.
 * @version 1.22 2021-06-17
 * @author Cay Horstmann
 */
public class Sieve
{
    public static void main(String[] s)
    {
        int n = 2000000;
        long start = System.nanoTime();
        var bitSet = new BitSet(n + 1);
        int i;
        for (i = 2; i <= n; i++)
            bitSet.set(i);
        i = 2;
        while (i * i <= n)
        {
            if (bitSet.get(i))
            {
                int k = i * i;
                while (k <= n)
                {
                    bitSet.clear(k);
                    k += i;
                }
            }
            i++;
        }
        long end = System.nanoTime();
        System.out.println(bitSet.cardinality() + " primes");
        System.out.println((end - start) / 1000 + " milliseconds");
    }
}
```

### Listing 9.9 — `sieve/sieve.cpp`

```cpp
/**
 * @version 1.22 2021-06-17
 * @author Cay Horstmann
 */

#include <bitset>
#include <iostream>
#include <ctime>

using namespace std;

int main()
{
    const int N = 2000000;
    clock_t cstart = clock();

    bitset<N + 1> b;
    int i;
    for (i = 2; i <= N; i++)
        b.set(i);
    i = 2;
    while (i * i <= N)
    {
        if (b.test(i))
        {
            int k = i * i;
            while (k <= N)
            {
                b.reset(k);
                k += i;
            }
        }
        i++;
    }

    clock_t cend = clock();
    double millis = 1000.0 * (cend - cstart) / CLOCKS_PER_SEC;
    cout << b.count() << " primes\n" << millis << " milliseconds\n";
    return 0;
}
```

---

## Kết chương

> *"This completes our tour through the Java Collections Framework. As you have seen, the framework offers a wide variety of collection classes for your programming needs."*

**Dịch:** Đến đây **kết thúc chuyến tham quan Java Collections Framework**. Như bạn đã thấy, framework cung cấp **rất nhiều loại collection class** cho các nhu cầu lập trình.

---

## Chương kế tiếp

→ [[01 - Running Threads]] — Chapter 10 Concurrency: multitasking, thread, và cách chương trình chạy nhiều tác vụ cùng lúc.
