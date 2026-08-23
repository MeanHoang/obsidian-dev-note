# 02 — Data Types

> Chapter 3, Section 3.3 — Core Java Volume I, 13th Edition (Horstmann).
> Đây là chỗ **khác JS rõ nhất** — Java có 8 kiểu primitive cố định, không phải "number là xong".

---

## Tổng quan: Java là strongly typed

> *"Java is a strongly typed language. This means that every variable must have a declared type. There are eight primitive types in Java."*

**Dịch:** Mọi biến **phải khai kiểu** ([[02 - The Java White Paper Buzzwords#1.2.4 Robust|strongly typed]]). Java có **8 kiểu primitive**: 4 số nguyên + 2 số thực + 1 ký tự + 1 boolean.

> 💡 **JS chỉ có 1 kiểu số:** `number` (64-bit float, tương đương Java `double`). Java chia nhỏ ra 6 kiểu số — vì mỗi kiểu tốn lượng RAM khác nhau, và compiler bắt lỗi nếu dùng sai.

---

## 3.3.1 Integer Types — 4 kiểu số nguyên

> *"The integer types are for numbers without fractional parts."*

| Kiểu      | Kích thước  | Phạm vi                  | Dùng khi                      |
| --------- | ----------- | ------------------------ | ----------------------------- |
| `byte`    | 1 byte      | –128 → 127               | File binary, tiết kiệm bộ nhớ |
| `short`   | 2 bytes     | –32.768 → 32.767         | Hiếm dùng                     |
| **`int`** | **4 bytes** | **–2.1 tỷ → 2.1 tỷ**     | **Mặc định cho số nguyên**    |
| `long`    | 8 bytes     | –9.2 × 10¹⁸ → 9.2 × 10¹⁸ | Dân số thế giới, timestamp    |

> *"In most situations, the int type is the most practical."*

**Tại sao kích thước cố định quan trọng?** Nhớ buzzword **[[02 - The Java White Paper Buzzwords#1.2.7 Portable|Portable]]** (bài 1.2.7):

> *"Under Java, the ranges of the integer types do not depend on the machine on which you will be running the Java code... In contrast, C and C++ programs use the most efficient integer type for each processor."*

**Dịch:** `int` Java **luôn 4 bytes trên mọi máy** — C/C++ thì `int` tuỳ CPU (16-bit, 32-bit...). Cùng code C có thể chạy đúng trên máy này, tràn số trên máy kia. Java chặn vấn đề đó từ gốc.

### Cú pháp literal

```java
int million = 1_000_000;            // underscore cho dễ đọc (Java 7+)
long worldPopulation = 8_000_000_000L;  // hậu tố L cho long
int hex = 0xCAFE;                   // hex (thập lục phân)
int bin = 0b1001;                   // binary = 9 (Java 7+)
```

> *"The underscores are for human eyes only. The Java compiler simply removes them."*

> 💡 **JS cũng có `_` separator** (ES2021): `1_000_000` — cú pháp giống hệt. Nhưng JS không cần hậu tố `L` vì chỉ có 1 kiểu `number`. Muốn số nguyên lớn JS dùng `BigInt` (`8_000_000_000n`).

### ⚠️ Java KHÔNG có unsigned integer

> *"Note that Java does not have any unsigned versions of the int, long, short, or byte types."*

Khác C/C++ — Java chọn đơn giản: tất cả kiểu nguyên đều **có dấu** (có số âm). Cần unsigned? Có utility methods (`Byte.toUnsignedInt(b)`) nhưng ít dùng.

---

## 3.3.2 Floating-Point Types — 2 kiểu số thực

| Kiểu | Kích thước | Độ chính xác | Hậu tố |
|---|---|---|---|
| `float` | 4 bytes | 6–7 chữ số | `3.14F` |
| **`double`** | **8 bytes** | **15 chữ số** | `3.14` hoặc `3.14D` |

> *"The limited precision of float (6-7 significant digits) is simply not sufficient for many situations. Use float values only when you work with a library that requires them."*

**Dịch:** `float` chỉ 6-7 chữ số, **không đủ** cho đa số trường hợp → **mặc định dùng `double`**. Số thực viết thẳng `3.14` tự động là `double`.

> 💡 **JS `number` = Java `double`** — cùng IEEE 754 64-bit. Nên cùng bị lỗi nổi tiếng:

```java
System.out.println(2.0 - 1.1);   // 0.8999999999999999 ← KHÔNG phải 0.9!
```

```js
console.log(2.0 - 1.1);          // 0.8999999999999999 ← GIỐNG HỆT
```

Cùng chuẩn IEEE 754 → cùng lỗi (đã gặp ở [[Glossary]] chương 1).

### 3 giá trị đặc biệt: Infinity và NaN

> *"There are three special floating-point values: Positive infinity, Negative infinity, NaN (not a number)."*

```java
double posInf = 1.0 / 0;          // Double.POSITIVE_INFINITY
double nan = 0.0 / 0;             // Double.NaN
Double.isNaN(nan);                 // true — dùng method, KHÔNG dùng ==
```

> *"You cannot test `if (x == Double.NaN)` — All 'not a number' values are considered distinct."*

```java
if (x == Double.NaN)     // ❌ LUÔN false!
if (Double.isNaN(x))     // ✅ cách đúng
```

> 💡 **JS y hệt:** `NaN === NaN` là `false`, phải dùng `Number.isNaN()`. Cùng chuẩn IEEE 754.

### ⚠️ Số thực KHÔNG dùng cho tiền

> *"Floating-point numbers are not suitable for financial calculations in which roundoff errors cannot be tolerated... use the BigDecimal class."*

```java
// ❌ dùng double cho tiền
double price = 2.0 - 1.1;   // 0.8999999999999999 ← sai 1 xu

// ✅ dùng BigDecimal
BigDecimal price = new BigDecimal("2.0").subtract(new BigDecimal("1.1"));
// → 0.9 chính xác
```

> 💡 **Bạn xử lý tiền ở Joy:** Shopify API trả tiền dạng string ("19.99") chứ không phải float, cũng vì lý do này. Quy tắc vàng: **tiền = integer (đơn vị cent)** hoặc BigDecimal, **không bao giờ float/double**.

---

## 3.3.3 + 3.3.4 The char Type & Unicode

> *"The char type was originally intended to describe individual characters. However, this is no longer the case."*

**Dịch:** `char` ban đầu thiết kế cho **1 ký tự**. Nhưng giờ **không còn đúng** — có ký tự Unicode cần **2 char** mới mô tả được.

### Tóm tắt câu chuyện Unicode trong Java

1. **1991:** Unicode chỉ có 65.536 ký tự → Java (1995) chọn `char` = **16 bit** → tưởng đủ hết
2. **Về sau:** Unicode phình ra (chữ Hán hiếm, emoji...) → vượt 65.536 → `char` 16-bit **không đủ**
3. **Giải pháp:** ký tự "thường" (A-Z, tiếng Việt, CJK cơ bản) = 1 `char`. Emoji và ký tự hiếm = **2 `char`** (surrogate pair)

```java
char c = 'A';                     // 1 char — ok
// Nhưng emoji 🍺 = 2 char values (U+1F37A → \uD83C \uDF7A)
```

Kết luận của sách:

> *"In summary, a visible character or symbol is encoded as a sequence of some number of char values, and there is almost never a need to look at the individual values. Always work with strings and don't worry about their representation as char sequences."*

**Dịch:** **Luôn làm việc với String**, đừng xử lý `char` đơn lẻ — trừ khi thật sự cần. (JS y hệt — `"🍺".length === 2` vì nội bộ dùng UTF-16 như Java.)

### Escape sequences

| Escape | Nghĩa | Giống JS? |
|---|---|---|
| `\n` | Xuống dòng | ✅ |
| `\t` | Tab | ✅ |
| `\\` | Dấu `\` | ✅ |
| `\"` | Dấu `"` | ✅ |
| `\'` | Dấu `'` | ✅ |
| `\uXXXX` | Ký tự Unicode hex | ✅ nhưng Java xử lý **trước khi parse** (xem dưới) |

### ⚠️ Bẫy Unicode escape trong Java

> *"Unicode escape sequences are processed before the code is parsed."*

```java
// ❌ Bẫy 1: comment chứa \u
// \u000A is a newline
// → compiler thay \u000A thành ký tự xuống dòng TRƯỚC khi đọc code → SYNTAX ERROR

// ❌ Bẫy 2: đường dẫn Windows
// look inside c:\users
// → \u không theo đúng 4 hex digits → SYNTAX ERROR
```

JS **không có bẫy này** — `\u` chỉ xử lý bên trong string literal. Java thì thay **trên toàn bộ source** trước cả khi parse. Góc khuất thú vị nhưng thực tế hiếm gặp.

---

## 3.3.5 The boolean Type

> *"The boolean type has two values, false and true. It is used for evaluating logical conditions. You cannot convert between integers and boolean values."*

**Dịch:** `boolean` chỉ có **`true` hoặc `false`**. Và: **KHÔNG thể chuyển đổi giữa số và boolean.**

⭐ Khác biệt quan trọng với JS:

```js
// JS: mọi thứ đều có truthy/falsy
if (0)      // false ← 0 là falsy
if ("")     // false ← chuỗi rỗng là falsy
if (null)   // false
if (1)      // true  ← số khác 0 là truthy
```

```java
// Java: if() CHỈ nhận boolean
if (0)       // ❌ COMPILE ERROR — int không phải boolean
if ("")      // ❌ COMPILE ERROR — String không phải boolean
if (x == 0)  // ✅ phải viết biểu thức so sánh rõ ràng
```

> *"In C++, numbers and even pointers can be used in place of boolean values... This is not the case in Java. Thus, Java programmers are shielded from accidents such as `if (x = 0)` — in C++ this compiles and runs, always evaluating to false. In Java, the test does not compile."*

**Dịch:** Bẫy kinh điển C++: `if (x = 0)` (gán, không phải so sánh) — C++ cho qua, luôn false, debug cả ngày. Java **từ chối compile** — vì `x = 0` trả về `int`, không phải `boolean`. Đây là "[[02 - The Java White Paper Buzzwords#1.2.4 Robust|robust]]" bài 1.2.4 — compile bắt lỗi sớm.

> 💡 **JS:** `if (x = 0)` cũng **chạy bình thường** (gán, rồi kiểm tra truthy/falsy của 0 → false) — đúng bẫy C++. ESLint bắt, nhưng compiler thì không.

---

## Tổng kết: 8 primitive types

| Kiểu         | Kích thước  | Mặc định (field) | JS tương đương                                               |
| ------------ | ----------- | ---------------- | ------------------------------------------------------------ |
| `byte`       | 1 byte      | 0                | —                                                            |
| `short`      | 2 bytes     | 0                | —                                                            |
| **`int`**    | **4 bytes** | **0**            | Gần `number` (nhưng chỉ nguyên, giới hạn ±2.1 tỷ)            |
| `long`       | 8 bytes     | 0L               | `BigInt` (nhưng Java `long` có giới hạn, `BigInt` thì không) |
| `float`      | 4 bytes     | 0.0F             | —                                                            |
| **`double`** | **8 bytes** | **0.0**          | **`number`** (y hệt — IEEE 754 64-bit)                       |
| `char`       | 2 bytes     | '\u0000'         | — (JS không có kiểu ký tự riêng)                             |
| `boolean`    | —           | false            | `boolean` (nhưng JS có truthy/falsy, Java thì KHÔNG)         |

> ⚠️ Cột "Mặc định" chỉ áp dụng cho **field của class** (instance/static variable). Biến **local** (trong method) **KHÔNG** có giá trị mặc định — phải tự gán trước khi dùng, nếu không = compile error.

> **Dùng nhiều nhất:** `int` (số nguyên), `double` (số thực), `boolean` (logic). Còn lại gặp khi cần.

---

## Bài kế tiếp

→ [[03 - Variables and Constants]] — khai báo biến, `var`, `final` (= `const` JS), sự khác biệt `let x = 5` (JS) vs `int x = 5` (Java).
