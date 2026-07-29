# 05 — Strings

> Chapter 3, Section 3.6 — Core Java Volume I, 13th Edition (Horstmann).
> String là nơi JS dev **dễ tự tin thái quá** rồi dính bẫy — vì cú pháp trông giống, nhưng `==` hoạt động **hoàn toàn khác**.

---

## ⚠️ Đầu tiên: String KHÔNG phải primitive

String **trông giống** primitive vì được Java cho 3 đặc quyền (viết literal, dùng `+`, string pool) — nhưng bản chất là **reference type** (class `java.lang.String`). Phân biệt:

```
Primitive (int x = 5):           Reference (String s = "Hello"):
┌─────┐                         ┌──────────┐         ┌────────────────┐
│  5  │  ← giá trị ngay         │ địa chỉ ──────────→│ object "Hello" │
└─────┘    trong biến            └──────────┘         └────────────────┘
                                    biến s                heap memory
```

| | Primitive (`int`, `double`...) | String |
|---|---|---|
| Là gì | Kiểu nguyên thuỷ (8 cái cố định) | **Class** (`java.lang.String`) |
| Lưu gì | Giá trị trực tiếp | Địa chỉ trỏ tới object |
| `==` so sánh | **Giá trị** ✅ | **Địa chỉ** ⚠️ → phải dùng `.equals()` |
| Gọi method | ❌ `5.toString()` lỗi | ✅ `"hi".length()` |
| `null` | ❌ không được | ✅ `String s = null;` |

Đây là gốc rễ bẫy `==` bên dưới — biết String là object thì hiểu ngay tại sao `==` so địa chỉ chứ không so nội dung.

> 💡 **JS:** string là primitive nhưng JS tự bọc thành object ngầm khi gọi method (`"hi".length`). Java thì String **là object từ đầu**. Kết quả dùng giống nhau, cơ chế khác.

---

## Ví dụ đời sống: String = Poster in sẵn

Tưởng tượng mỗi String trong Java là **poster đã in sẵn** — chữ đã in, không thể sửa. Muốn thay 1 từ? Phải **in poster mới**. JS cũng vậy — `"hello"[0] = "H"` không work.

Nhưng Java có thêm 1 twist: hai poster **cùng nội dung** có thể là **cùng 1 tờ** (string pool) hoặc **2 tờ khác nhau** (runtime string). Và `==` kiểm tra "có phải **cùng 1 tờ** không" — chứ **không** kiểm tra "nội dung có giống nhau không". Đây là bẫy lớn nhất.

---

## 3.6.1 Concatenation — Nối chuỗi

> *"When you concatenate a string with a value that is not a string, the latter is converted to a string."*

**Dịch:** Khi nối `+` với giá trị không phải String, Java tự chuyển giá trị đó thành String. Giống JS.

```java
int age = 13;
String rating = "PG" + age;  // → "PG13"
```

### ⚠️ BẪY: `+` tính từ trái sang phải

> *"Beware of string concatenations with expressions that have a + operator... Because the + operators are evaluated from left to right, the result is 'Next year, you'll be 421.'"*

```java
int age = 42;
String output = "Next year, you'll be " + age + 1 + ".";
// → "Next year, you'll be 421."  ← SAI!
// Vì: ("...be " + 42) → "...be 42" → ("...be 42" + 1) → "...be 421"
```

**Fix:** Thêm ngoặc để ép phép cộng số trước:

```java
String output = "Next year, you'll be " + (age + 1) + ".";
// → "Next year, you'll be 43."  ✅
```

> 💡 **JS cũng bị y hệt:** `"age " + 42 + 1` → `"age 421"`. Cùng left-to-right evaluation. Không có gì khác.

### `String.join()` và `.repeat()`

```java
String all = String.join(" / ", "S", "M", "L", "XL");
// → "S / M / L / XL"

String ha = "Java".repeat(3);
// → "JavaJavaJava"
```

> 💡 **JS tương đương:** `["S","M","L","XL"].join(" / ")` (method của Array, không phải String) và `"Java".repeat(3)` (giống hệt).

---

## 3.6.2 Splitting Strings — Tách chuỗi

> *"The argument of the split method is a regular expression, describing where the splits should occur."*

```java
"Hello, World!".split(" ")           // → ["Hello,", "World!"]
"one,two, three".split("\\s*,\\s*")  // → ["one", "two", "three"]
"a.b.c".split("\\.")                 // → ["a", "b", "c"] — phải escape dấu .
```

**Lưu ý:** Argument là **regex**, không phải string thường. Dấu `.` trong regex match **mọi ký tự**, nên `"a.b".split(".")` cho kết quả rỗng — phải escape `"\\."`.

| Pattern | Mô tả |
|---|---|
| `"\\s+"` | Whitespace (1 hoặc nhiều) |
| `"\\s*,\\s*"` | Dấu phẩy + khoảng trắng tuỳ chọn |
| `"\\."` | Dấu chấm (literal) |
| `"\\R"` | Line break |

> 💡 **JS `split` cũng nhận regex:** `"a.b".split(/\./)`. Khác biệt: JS dùng `/regex/` literal, Java dùng String `"\\."` (phải double-escape `\`).

---

## 3.6.3 Indexes and Substrings — Chỉ mục và chuỗi con

> *"The length method yields the number of char values required for a given string."*

```java
String greeting = "Hello, World!";
greeting.length()          // 13 — LƯU Ý: là METHOD có (), không phải property
greeting.charAt(0)         // 'H'
greeting.indexOf(",")      // 5
greeting.substring(0, 5)   // "Hello" — từ 0 đến 4 (5 là exclusive!)
```

### So sánh JS

| Thao tác | Java | JS |
|---|---|---|
| Độ dài | `str.length()` ← method | `str.length` ← property |
| Ký tự tại vị trí | `str.charAt(i)` | `str.charAt(i)` hoặc `str[i]` |
| Tìm vị trí | `str.indexOf("x")` | `str.indexOf("x")` |
| Cắt chuỗi | `str.substring(begin, end)` | `str.substring(begin, end)` |

> *"The second argument of substring is the first position that you do not want to copy."*

**Dịch:** `substring(a, b)` lấy từ `a` đến `b - 1` (b **exclusive**). Độ dài kết quả = `b - a`. JS `substring` cũng exclusive — **giống hệt**.

> ⚠️ **Dễ nhầm:** Java là `str.length()` có **ngoặc tròn** (method call). JS là `str.length` **không ngoặc** (property). Quên `()` trong Java = compile error.

---

## 3.6.4 Strings Are Immutable ⭐⭐

> *"Since you cannot change the individual characters in a Java string, the documentation refers to the objects of the String class as immutable. Just as the number 3 is always 3, the string "Hello" will always contain the code-unit sequence for the characters H, e, l, l, o. You cannot change these values."*

**Dịch:** String trong Java là **immutable** — khi đã tạo, nội dung **không bao giờ thay đổi**. Muốn "sửa" chuỗi? Phải **tạo chuỗi mới**.

```java
String greeting = "Hello";
int n = greeting.indexOf("lo");
greeting = greeting.substring(0, n) + "p!";
// greeting giờ trỏ tới chuỗi MỚI "Help!"
// Chuỗi cũ "Hello" vẫn còn trong bộ nhớ (cho đến khi GC dọn)
```

> *"Yet you can, as you just saw, change the contents of the string variable greeting and make it refer to a different string, just as you can make a numeric variable currently holding the value 3 hold the value 4."*

**Dịch:** Biến `greeting` thay đổi **tham chiếu** (trỏ tới chuỗi khác), chứ **không** thay đổi chuỗi gốc.

### Quay lại analogy poster

- `greeting = "Hello"` → biến `greeting` trỏ tới **poster "Hello"**
- `greeting = greeting.substring(0,3) + "p!"` → **in poster mới "Help!"**, rồi `greeting` trỏ sang poster mới
- Poster cũ "Hello" vẫn tồn tại (có thể được chia sẻ với biến khác)

### String Pool — Chia sẻ chuỗi

> *"The compiler can arrange that strings are shared. To understand how this works, think of the various strings as sitting in a common pool. String variables then point to locations in the pool."*

**Dịch:** Compiler đặt các string literal vào một **pool chung**. Hai biến trỏ tới cùng literal → **chia sẻ cùng 1 object** → tiết kiệm bộ nhớ.

```java
String a = "Hello";
String b = "Hello";
// a và b trỏ tới CÙNG MỘT object trong string pool
```

### ⚠️ JS cũng immutable!

```js
let s = "hello";
s[0] = "H";      // ❌ silent fail — s vẫn là "hello"
s.toUpperCase();  // trả "HELLO" nhưng s VẪN là "hello" (phải gán lại)
```

**Kết luận:** Immutability của String **giống nhau** giữa Java và JS. Điểm khác nằm ở **cách so sánh** (section tiếp theo) — không phải ở immutability.

---

## 3.6.5 Testing Strings for Equality ⭐⭐⭐ — BẪY LỚN NHẤT

> *"Do not use the == operator to test whether two strings are equal! It only determines whether or not the strings are stored in the same location."*

Đây là **khác biệt quan trọng nhất** giữa Java và JS về String. Dính bẫy này = bug rất khó tìm.

### Quy tắc: LUÔN dùng `.equals()`

> *"To test whether two strings are equal, use the equals method."*

```java
String s = "Hello";
String t = "Hello";

s.equals(t)           // ✅ true — so sánh NỘI DUNG
s == t                // true — nhưng CHỈ VÌ cùng literal trong string pool!
```

### Khi nào `==` THẤT BẠI?

> *"But only string literals are shared, not strings that are computed at runtime. Therefore, never use == to compare strings."*

```java
String greeting = "Hello";

greeting == "Hello"                                    // true (cùng pool)
greeting.substring(0, greeting.indexOf("l")) == "He"   // ❌ FALSE!
greeting.substring(0, greeting.indexOf("l")).equals("He") // ✅ true
```

**Giải thích:** `substring(...)` tạo **object mới** trên heap → khác địa chỉ với literal `"He"` trong pool → `==` trả `false` dù nội dung giống nhau.

### ⚠️ SO SÁNH JS — Đây là KHÁC BIỆT LỚN NHẤT

```js
// JS: === so sánh GIÁ TRỊ cho string (primitive)
"Hello" === "Hello"                     // true ✅
"Hello".substring(0, 2) === "He"        // true ✅ — JS so sánh nội dung!
```

```java
// Java: == so sánh ĐỊA CHỈ (reference)
"Hello" == "Hello"                      // true (cùng pool — MAY MẮN)
"Hello".substring(0, 2) == "He"         // FALSE! ← BẪY
"Hello".substring(0, 2).equals("He")    // true ✅
```

| | Java `==` | JS `===` |
|---|---|---|
| So sánh gì? | **Địa chỉ** (reference) | **Giá trị** (content) |
| An toàn cho String? | ❌ KHÔNG | ✅ AN TOÀN |
| Nên dùng? | **KHÔNG BAO GIỜ** cho String | Luôn dùng |

> 🔑 **Quy tắc vàng:** Trong Java, **mọi lúc** so sánh String → dùng `.equals()`. Không ngoại lệ. Thấy `str1 == str2` trong code review → red flag ngay lập tức.

### Case-insensitive comparison

```java
"Hello".equalsIgnoreCase("hello")  // true
```

> 💡 JS: không có method tương đương trực tiếp, phải `str1.toLowerCase() === str2.toLowerCase()`.

---

## 3.6.6 Empty and Null Strings — Chuỗi rỗng vs null

> *"The empty string "" is a string of length 0."*

> *"However, a String variable can also hold a special value, called null, that indicates that no object is currently associated with the variable."*

### Hai khái niệm KHÁC nhau

| | `""` (empty) | `null` |
|---|---|---|
| Có phải object? | ✅ Có — object String với length = 0 | ❌ Không — **không có object** |
| `str.length()` | 0 | ❌ **NullPointerException** → crash! |
| `str.equals("")` | true | ❌ **NullPointerException** |

### Pattern kiểm tra an toàn

> *"If you need to test that a string is neither null nor empty, use `str != null && str.length() != 0`. You need to test that str is not null first."*

```java
// ✅ Thứ tự quan trọng — check null TRƯỚC
if (str != null && str.length() != 0) {
    // str có nội dung, an toàn để dùng
}

// ❌ Sai thứ tự → crash nếu str là null
if (str.length() != 0 && str != null)  // NullPointerException!
```

**Tại sao thứ tự quan trọng?** Vì [[04 - Operators#`&&`, `||` — Short-circuit (giống JS)|short-circuit evaluation]]: `str != null` là `false` → `&&` **bỏ qua** vế phải → không gọi `.length()` → không crash.

Cách gọn hơn (Java 6+):

```java
if (str != null && !str.isEmpty()) { ... }     // isEmpty() = length() == 0
if (str != null && !str.isBlank()) { ... }     // isBlank() = rỗng hoặc chỉ whitespace (Java 11+)
```

### ⚠️ SO SÁNH JS

```js
// JS có 2 "không có gì": undefined và null
let s1 = "";         // empty string — có giá trị, là string
let s2 = null;       // null — không có giá trị
let s3 = undefined;  // undefined — chưa gán

// JS KHÔNG crash khi truy cập property của null/undefined (chỉ TypeError, không JVM crash)
s2.length            // TypeError: Cannot read properties of null
// Nhưng JS có optional chaining:
s2?.length           // undefined — KHÔNG crash
```

**Khác biệt chính:** Java crash cứng (NullPointerException) khi gọi method trên null. JS throw TypeError nhưng có `?.` để tránh. Java chưa có optional chaining cho null (phải check thủ công hoặc dùng `Optional` — Chapter 8).

---

## 3.6.7 The String API — Các method quan trọng

> *"The String class in Java contains close to 100 methods."*

Bảng tóm tắt method hay dùng, kèm JS tương đương:

| Java | JS tương đương | Mô tả |
|---|---|---|
| `str.length()` | `str.length` | Độ dài (Java là method, JS là property) |
| `str.charAt(i)` | `str[i]` hoặc `str.charAt(i)` | Ký tự tại vị trí |
| `str.equals(other)` | `str === other` | So sánh nội dung |
| `str.equalsIgnoreCase(other)` | `str.toLowerCase() === other.toLowerCase()` | So sánh bỏ qua hoa thường |
| `str.compareTo(other)` | `str.localeCompare(other)` | So sánh thứ tự từ điển |
| `str.isEmpty()` | `str.length === 0` | Kiểm tra rỗng |
| `str.isBlank()` (11+) | `str.trim().length === 0` | Rỗng hoặc chỉ whitespace |
| `str.startsWith(prefix)` | `str.startsWith(prefix)` | Bắt đầu bằng |
| `str.endsWith(suffix)` | `str.endsWith(suffix)` | Kết thúc bằng |
| `str.indexOf(sub)` | `str.indexOf(sub)` | Vị trí xuất hiện đầu tiên |
| `str.lastIndexOf(sub)` | `str.lastIndexOf(sub)` | Vị trí xuất hiện cuối cùng |
| `str.substring(a, b)` | `str.substring(a, b)` | Cắt chuỗi (b exclusive) |
| `str.replace(old, new)` | `str.replaceAll(old, new)` | Thay thế **tất cả** |
| `str.toLowerCase()` | `str.toLowerCase()` | Chuyển thường |
| `str.toUpperCase()` | `str.toUpperCase()` | Chuyển hoa |
| `str.strip()` (11+) | `str.trim()` | Xoá whitespace đầu/cuối |
| `str.split(regex)` | `str.split(regex)` | Tách chuỗi |
| `String.join(delim, ...)` (8+) | `[...].join(delim)` | Nối mảng |
| `str.repeat(n)` (11+) | `str.repeat(n)` | Lặp chuỗi |

> ⚠️ **`str.strip()` vs `str.trim()`:** Cả hai xoá whitespace, nhưng `strip()` (Java 11+) xử lý đúng **Unicode whitespace** (full-width space, etc.), còn `trim()` chỉ xoá ký tự `<= U+0020`. **Dùng `strip()`** cho code mới.

---

## 3.6.8 Reading the Online API Documentation

Sách khuyên bookmark API docs:

```
https://docs.oracle.com/en/java/javase/21/docs/api
```

Gõ tên class (ví dụ `String`) vào ô search → xem danh sách method đầy đủ. Không cần thuộc hết — biết cách tra cứu là đủ.

---

## 3.6.9 Building Strings — StringBuilder ⭐

> *"Occasionally, you need to build up strings from shorter strings, such as keystrokes or words from a file. It would be inefficient to use string concatenation for this purpose. Every time you concatenate strings, a new String object is constructed. This is time consuming and wastes memory."*

**Dịch:** Nối String trong vòng lặp = **chậm** — mỗi lần `+` tạo object mới, copy nội dung cũ + thêm phần mới. N lần nối = N object tạm bị bỏ đi.

### Ví dụ đời sống

Nối String trong loop giống như **viết thư bằng cách chép lại toàn bộ mỗi lần thêm 1 câu**: viết "Xin chào" → chép lại + thêm "Tôi là A" → chép lại + thêm "Hẹn gặp" → ... Rất lãng phí giấy.

StringBuilder giống **viết thêm vào cuối tờ giấy** — không cần chép lại phần đã viết.

### Cách dùng

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(", ");
builder.append("World!");
String result = builder.toString();  // → "Hello, World!"
```

### Method chaining

> *"Cleverly, the StringBuilder methods return the builder object, so that you can chain multiple method calls."*

```java
String result = new StringBuilder()
    .append("Hello")
    .append(", ")
    .append("World!")
    .toString();
```

### Reverse string

```java
String reversed = new StringBuilder("Hello").reverse().toString();
// → "olleH"
```

### ⚠️ SO SÁNH JS

JS không có StringBuilder, nhưng có pattern tương tự:

```js
// JS: dùng Array push + join (pattern giống StringBuilder)
const parts = [];
parts.push("Hello");
parts.push(", ");
parts.push("World!");
const result = parts.join("");  // → "Hello, World!"
```

Thực tế JS engine hiện đại tối ưu `+` rất tốt, nên pattern này ít cần trong JS. Nhưng trong Java, StringBuilder **quan trọng hơn** vì String immutable + JVM không luôn tối ưu được concatenation trong loop.

### StringBuffer — Legacy, thread-safe

> *"The legacy StringBuffer class is less efficient than StringBuilder, but it allows multiple threads to add or remove characters."*

**Dịch:** `StringBuffer` = phiên bản cũ, **thread-safe** (synchronized) nhưng **chậm hơn**. API giống hệt StringBuilder. Gặp trong code cũ — code mới **luôn dùng StringBuilder** (trừ khi cần thread-safe, rất hiếm).

---

## 3.6.10 Text Blocks (Java 15+) — Chuỗi nhiều dòng

> *"A text block starts with \"\"\", followed by a line feed. The block ends with another \"\"\"."*

```java
String greeting = """
    Hello
    World
    """;
// Tương đương: "Hello\nWorld\n"
```

### So sánh với JS template literal

| | Java Text Block `"""..."""` | JS Template Literal `` `...` `` |
|---|---|---|
| Nhiều dòng | ✅ | ✅ |
| Interpolation `${}` | ❌ **KHÔNG CÓ** | ✅ `${expr}` |
| Escape `"` | Không cần (trừ 3+ dấu `"` liên tiếp) | Không cần |
| Auto-indent strip | ✅ Tự xoá common indentation | ❌ Giữ nguyên whitespace |

> ⚠️ **Khác biệt lớn nhất:** Java text block **KHÔNG có interpolation**. Không có `${}`. Muốn chèn biến phải nối chuỗi hoặc dùng `String.format()`.

```java
// Java — KHÔNG thể chèn biến trong text block
String name = "Hal";
String prompt = """
    Hello, my name is %s.
    Please enter your name:""".formatted(name);
// Dùng .formatted() (Java 15+) hoặc String.format()
```

```js
// JS — interpolation trực tiếp
const name = "Hal";
const prompt = `Hello, my name is ${name}.
Please enter your name:`;
```

### Trailing newline và whitespace

```java
// Có newline cuối (""" ở dòng riêng)
String a = """
    Hello
    """;
// → "Hello\n"

// KHÔNG có newline cuối (""" ngay sau text)
String b = """
    Hello, my name is Hal.
    Please enter your name:""";
// → "Hello, my name is Hal.\nPlease enter your name:"
```

### Line continuation `\` (chỉ text block)

```java
String prompt = """
    Hello, my name is Hal. \
    Please enter your name:\s""";
// → "Hello, my name is Hal. Please enter your name: "
// \ nối 2 dòng thành 1, \s giữ space cuối
```

### Auto-indent stripping

```java
String html = """
        <div class="Warning">
            Beware of those who say "Hello"
        </div>
        """;
// Common indentation (8 spaces) bị XOÁ tự động
// Kết quả: "<div class=\"Warning\">\n    Beware...\n</div>\n"
```

> 💡 Rất tiện khi chèn SQL, HTML, JSON trong code Java — paste nguyên block, không cần escape `"`, không cần nối `+` từng dòng.

---

## Tổng kết: Bẫy String khi từ JS sang Java

| Bẫy | Java | JS |
|---|---|---|
| So sánh String | `==` so sánh **địa chỉ** → **PHẢI dùng `.equals()`** | `===` so sánh **giá trị** → an toàn |
| `.length` | `str.length()` — **method** có `()` | `str.length` — property không `()` |
| Null safety | `null.method()` → **NullPointerException** crash | `null?.method` → `undefined` (optional chaining) |
| Interpolation | Text block **KHÔNG có `${}`** → dùng `.formatted()` | Template literal có `${}` |
| Nối chuỗi loop | Dùng **StringBuilder** (quan trọng) | `+` OK (engine tối ưu), hoặc Array + join |
| `str.split(".")` | Match **mọi ký tự** (regex!) → phải `"\\."` | Cũng regex, nhưng dùng `/\./` rõ ràng hơn |
| Immutable | ✅ Giống JS | ✅ Giống Java |

---

## Bài kế tiếp

→ [[06 - Input and Output]] — `Scanner`, `System.out.printf`, format string, file I/O cơ bản.
