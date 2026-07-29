# 04 — Operators

> Chapter 3, Section 3.5 — Core Java Volume I, 13th Edition (Horstmann).
> Phép toán, chuyển kiểu, toán tử logic — nơi bạn gặp **bẫy đầu tiên** khi từ JS sang Java: `15/2` không ra `7.5`.

---

## Ví dụ đời sống: Operator = Máy tính bỏ túi có kiểu

JS là máy tính bỏ túi **bình thường** — bấm `15 ÷ 2` luôn ra `7.5`, không cần nghĩ. Java là máy tính **công nghiệp** — nó hỏi: "Bạn đang chia **số nguyên** hay **số thực**?" Nếu cả hai đều nguyên → kết quả nguyên (bỏ phần thập phân). Muốn số thực? Phải "nói rõ" bằng cách dùng `15.0`.

---

## 3.5.1 Arithmetic Operators — Phép toán số học

> *"The / operator denotes integer division if both operands are integers, and floating-point division otherwise. Integer division by 0 raises an exception, whereas floating-point division by 0 yields an infinite or NaN result."*

**Dịch:** Phép `/` là **integer division** nếu cả hai toán hạng đều là integer → **bỏ phần thập phân**. Chỉ 1 trong 2 là floating-point → chia bình thường.

```java
15 / 2      // → 7   ← integer division, BỎ phần thập phân!
15 % 2      // → 1   ← phần dư
15.0 / 2    // → 7.5 ← floating-point division (1 bên là double)
```

> *"Integer remainder (sometimes called modulus) is denoted by %. For example, 15 / 2 is 7, 15 % 2 is 1, and 15.0 / 2 is 7.5."*

### ⚠️ SO SÁNH JS — Đây là khác biệt LỚN

```js
// JS: / LUÔN là floating-point division
15 / 2      // → 7.5 ← JS không có integer division
15 % 2      // → 1   ← giống Java

// Muốn integer division trong JS phải tự làm:
Math.trunc(15 / 2)  // → 7
```

**Bẫy thực tế:** Code JS `totalPages = items / pageSize` chạy đúng (7.5 rồi ceil). Code Java `totalPages = items / pageSize` (cả hai `int`) → 7, mất nửa trang cuối. Phải viết `(items + pageSize - 1) / pageSize` hoặc ép kiểu.

### `%` với số âm — `Math.floorMod`

> *"When one of the operands of % is negative, so is the result."*

> *"Consider this problem. You compute the position of the hour hand of a clock. An adjustment is applied, and you want to normalize to a number between 0 and 11. That is easy: `(position + adjustment) % 12`. But what if the adjustment is negative? Then you might get a negative number."*

**Dịch:** Bài toán kim đồng hồ — muốn kết quả luôn trong [0, 11]. Nếu adjustment âm, `%` trả kết quả âm → sai.

```java
(-1) % 12        // → -1  ← Java (và JS đều vậy)

// Giải pháp sạch:
Math.floorMod(-1, 12)  // → 11 ✅ luôn dương
```

> 💡 **JS cũng bị:** `(-1) % 12` → `-1`. JS không có `Math.floorMod`, phải tự viết `((n % m) + m) % m`.

### `Math.xxxExact` — Chống tràn số (overflow)

> *"The mathematical operators quietly return wrong results when a computation overflows. For example, one billion times three (1000000000 * 3) evaluates to -1294967296 because the largest int value is just over two billion. If you call Math.multiplyExact(1000000000, 3) instead, an exception is generated."*

**Dịch:** Phép nhân thông thường **tràn số im lặng** → kết quả sai mà không biết. Dùng `Math.multiplyExact` → ném exception thay vì sai ngầm.

```java
1000000000 * 3                      // → -1294967296 ← SAI, tràn int
Math.multiplyExact(1000000000, 3)   // → ArithmeticException ✅ báo lỗi
```

Các method tương tự: `addExact`, `subtractExact`, `incrementExact`, `decrementExact`, `negateExact`, `absExact` — đều có phiên bản `int` và `long`.

> 💡 **JS không bị tràn int** kiểu này vì `number` là float 64-bit (phạm vi rất lớn). Nhưng JS mất chính xác ở số nguyên lớn hơn `2^53` — khác kiểu bẫy nhưng cùng bản chất.

Xem thêm: [[02 - Data Types#3.3.1 Integer Types — 4 kiểu số nguyên|integer range]] và [[02 - Data Types#3.3.2 Floating-Point Types — 2 kiểu số thực|floating-point precision]].

### `strictfp` — Đã lỗi thời

> *"Methods tagged with the strictfp keyword had to use strict floating-point operations that yield reproducible results... As of Java 17, the virtual machine is again required to carry out strict 64-bit arithmetic, and the strictfp keyword is now obsolete."*

**Dịch:** Trước Java 17, một số CPU dùng 80-bit register cho phép tính trung gian → kết quả khác nhau giữa các máy. `strictfp` ép dùng 64-bit nghiêm ngặt. Từ Java 17, VM luôn dùng 64-bit → `strictfp` **không cần nữa**.

---

## 3.5.2 Mathematical Functions and Constants — Hàm toán và hằng số

> *"The Math class contains an assortment of mathematical functions that you may occasionally need."*

### Các hàm thường dùng

```java
double y = Math.sqrt(4);        // → 2.0 (căn bậc hai)
double z = Math.pow(2, 10);     // → 1024.0 (luỹ thừa — 2^10)
```

> *"There is a subtle difference between the println method and the sqrt method. The println method operates on the System.out object. But the sqrt method in the Math class does not operate on any object. Such a method is called a static method."*

**Dịch:** `Math.sqrt` là **static method** — không cần object, gọi trực tiếp qua tên class. Chi tiết Chapter 4.

### `Math.clamp` (Java 21+) — Giới hạn giá trị

```java
Math.clamp(-1, 0, 10)   // → 0   (quá nhỏ → trả lower bound)
Math.clamp(11, 0, 10)   // → 10  (quá lớn → trả upper bound)
Math.clamp(3, 0, 10)    // → 3   (trong khoảng → giữ nguyên)
```

> 💡 **JS:** `Math.clamp` không có sẵn (proposal Stage 1, 2024). Phải tự viết `Math.min(Math.max(value, min), max)`.

### Hằng số và lượng giác

```java
Math.PI    // 3.141592653589793
Math.TAU   // 6.283185307179586 (= 2π)
Math.E     // 2.718281828459045

Math.sin(Math.PI / 6)   // sin(30°)
Math.log(Math.E)         // → 1.0 (ln)
Math.log10(1000)         // → 3.0
```

### Trick: `static import` để bỏ tiền tố `Math`

> *"You can avoid the Math prefix for the mathematical methods and constants by adding the following line to the top of your source file:"*

```java
import static java.lang.Math.*;

// Giờ viết gọn:
System.out.println("The square root of π is " + sqrt(PI));
```

---

## 3.5.3 Conversions between Numeric Types — Chuyển đổi tự động

> *"The six solid arrows in Figure 3.1 denote conversions without information loss. The three dotted arrows denote conversions that may lose precision."*

### Hệ thống thứ bậc chuyển đổi (auto-widening)

```
        ──── không mất gì (solid arrow) ────
        byte → short → int → long
                         │      │
                         ↓      ↓
                       float → double

        ···· có thể mất chính xác (dotted arrow) ····
        int ···→ float      (9 chữ số → 6-7 chữ số)
        long ···→ float     (19 chữ số → 6-7 chữ số)
        long ···→ double    (19 chữ số → 15 chữ số)
```

**Quy tắc:** Kiểu **nhỏ hơn** tự động chuyển sang kiểu **lớn hơn** (widening) — không cần viết gì. Nhưng 3 đường **int/long → float** và **long → double** tuy tự động nhưng **có thể mất chính xác** (vì float/double lưu số theo kiểu xấp xỉ, không chứa đủ chữ số).

```java
int n = 42;
double d = n;       // ✅ auto-widening: int → double, không mất gì
```

### ⚠️ Bẫy: `int` → `float` mất precision

> *"For example, a large integer such as 123456789 has more digits than the float type can represent. When the integer is converted to a float, the resulting value has the correct magnitude but loses some precision."*

```java
int n = 123456789;
float f = n;         // f = 1.23456792E8 ← sai chữ số cuối!
```

`float` chỉ chứa 6-7 chữ số có nghĩa, mà `123456789` có 9 chữ số → **mất precision** dù là widening.

### Quy tắc khi 2 toán hạng khác kiểu

> *"When two values are combined with a binary operator (such as n + f where n is an integer and f is a floating-point value), both operands are converted to a common type before the operation is carried out."*

Thứ tự ưu tiên:
1. Nếu có `double` → cả hai thành `double`
2. Nếu có `float` → cả hai thành `float`
3. Nếu có `long` → cả hai thành `long`
4. Còn lại → cả hai thành `int`

```java
int n = 5;
double d = 2.5;
double result = n + d;   // n tự chuyển thành 5.0, kết quả = 7.5
```

> 💡 **JS:** Không có vấn đề này — `number` chỉ có 1 kiểu (double 64-bit). Mọi phép tính đều là floating-point.

---

## 3.5.4 Casts — Ép kiểu (narrowing)

> *"Conversions in which loss of information is possible are done by means of casts. The syntax for casting is to give the target type in parentheses, followed by the variable name."*

**Dịch:** Chuyển từ kiểu **lớn hơn** sang kiểu **nhỏ hơn** (narrowing) phải viết rõ bằng cast `(targetType)` — vì có thể mất dữ liệu.

```java
double x = 9.997;
int nx = (int) x;        // nx = 9 ← CẮT phần thập phân, KHÔNG làm tròn!
```

### Muốn làm tròn → `Math.round`

> *"If you want to round a floating-point number to the nearest integer (which in most cases is a more useful operation), use the Math.round method."*

```java
double x = 9.997;
int nx = (int) Math.round(x);   // nx = 10 ✅
```

> *"You still need to use the cast (int) when you call round. The reason is that the return value of the round method is a long."*

**Dịch:** `Math.round` trả về `long` (không phải `int`) → vẫn phải cast `(int)` vì `long` → `int` là narrowing.

### ⚠️ Bẫy: `(byte) 300` = 44

> *"If you try to cast a number of one type to another that is out of range for the target type, the result will be a truncated number that has a different value. For example, (byte) 300 is actually 44."*

Giải thích: `byte` chỉ chứa -128 → 127. Số 300 = `0b100101100` → lấy 8 bit cuối = `0b00101100` = 44. **Không báo lỗi, chỉ sai thầm lặng.**

### Không thể cast `boolean` ↔ số

> *"You cannot cast between boolean values and any numeric type. This convention prevents common errors."*

```java
boolean b = true;
int n = (int) b;       // ❌ COMPILE ERROR — không cast được
int n = b ? 1 : 0;     // ✅ phải dùng ternary
```

> 💡 **JS:** `Number(true)` → `1`, `Boolean(0)` → `false` — chuyển thoải mái. Java **cấm hoàn toàn** — đây là triết lý [[02 - The Java White Paper Buzzwords#1.2.4 Robust|Robust]]: chặn kiểu chuyển đổi ngầm dễ gây lỗi.

---

## 3.5.5 Assignment — Gán và compound operator

> *"There is a convenient shortcut for using binary operators in an assignment."*

```java
x += 4;    // tương đương x = x + 4;
x *= 2;    // tương đương x = x * 2;
x %= 3;    // tương đương x = x % 3;
```

### ⚠️ Bẫy: `+=` tự ép kiểu

> *"If a compound assignment operator yields a value whose type is different from that of the left-hand side, then it is coerced to fit. For example, if x is an int, then the statement `x += 3.5;` is valid. It sets x to (int)(x + 3.5), that is, x + 3, with no warning!"*

```java
int x = 10;
x += 3.5;      // ✅ compiles! x = (int)(10 + 3.5) = (int)(13.5) = 13
                // KHÔNG có warning (trước Java 20)
```

**Dịch:** `x += 3.5` với `x` là `int` → compiler tự cast `(int)(x + 3.5)` → **mất 0.5** mà không báo. Từ Java 20, compile với `-Xlint` sẽ có warning.

> 💡 **JS:** Không có vấn đề này — `x += 3.5` luôn ra số thực vì JS chỉ có 1 kiểu `number`.

### Assignment là expression

> *"In Java, an assignment is an expression. That is, it has a value—namely, the value that is being assigned."*

```java
int x = 1;
int y = x += 4;   // x = 5, y = 5 — hợp lệ nhưng khó đọc
```

Sách khuyên viết rõ ràng:

```java
int x = 1;
x += 4;
int y = x;   // ✅ dễ đọc hơn
```

---

## 3.5.6 Increment and Decrement — `++` và `--`

> *"Both change the value of the variable by 1. The difference between the two appears only when they are used inside expressions. The prefix form does the addition first; the postfix form evaluates to the old value of the variable."*

```java
int m = 7;
int n = 7;
int a = 2 * ++m;   // a = 16, m = 8  ← prefix: tăng TRƯỚC rồi nhân
int b = 2 * n++;   // b = 14, n = 8  ← postfix: nhân TRƯỚC (dùng giá trị cũ 7) rồi tăng
```

> *"Many programmers find this behavior confusing. In Java, using ++ inside expressions is uncommon."*

**Dịch:** Sách khuyên **tránh dùng `++`/`--` bên trong expression** — dễ nhầm, khó đọc. Chỉ dùng `n++;` đứng riêng 1 dòng.

> 💡 **JS y hệt:** `++n` vs `n++` hoạt động giống Java. Nhiều linter (ESLint `no-plusplus`) cũng khuyên tránh.

---

## 3.5.7 Relational and boolean Operators — So sánh và logic

> *"Java has the full complement of relational operators. To test for equality, use a double equal sign, ==."*

```java
3 == 7    // false
3 != 7    // true
x < y     // less than
x <= y    // less than or equal
x > y     // greater than
x >= y    // greater than or equal
```

### `&&`, `||` — Short-circuit (giống JS)

> *"The && and || operators are evaluated in 'short circuit' fashion: The second operand is not evaluated if the first operand already determines the value."*

```java
x != 0 && 1 / x > x + y   // nếu x == 0, vế sau KHÔNG chạy → tránh chia cho 0
```

**Dịch:** Nếu vế trái `&&` là `false` → bỏ qua vế phải. Nếu vế trái `||` là `true` → bỏ qua vế phải. **Giống hệt JS.**

### ⚠️ SO SÁNH JS — Không có `===`

Java **không có** `===` (strict equality) vì **không có loose equality**. Trong JS, `==` chuyển kiểu ngầm (`"5" == 5` → `true`), nên cần `===`. Java không bao giờ chuyển kiểu ngầm trong `==` (trừ widening number) → chỉ cần `==`.

```js
// JS:
"5" == 5    // true  ← loose equality, chuyển kiểu
"5" === 5   // false ← strict equality
```

```java
// Java:
// "5" == 5  ← COMPILE ERROR — String và int không so sánh được
```

> 💡 Quy tắc: `==` Java cho primitive hoạt động như `===` JS. Cho object thì khác — sẽ học ở Chapter 4 (so sánh reference vs value).

---

## 3.5.8 The Conditional Operator — Ternary `? :`

> *"Java provides the conditional ?: operator that selects a value, depending on a Boolean expression."*

```java
x < y ? x : y    // trả giá trị nhỏ hơn giữa x và y
```

**Giống hệt JS.** Không có gì khác.

---

## 3.5.9 Switch Expressions — `switch` kiểu mới (Java 14+)

> *"If you need to choose among more than two values, then you can use a switch expression, which was introduced in Java 14."*

```java
String seasonName = switch (seasonCode)
{
    case 0 -> "Spring";
    case 1 -> "Summer";
    case 2 -> "Fall";
    case 3 -> "Winter";
    default -> "???";
};
```

> *"The switch expression, like every expression, has a value. Note the -> arrow preceding the value in each branch."*

**Dịch:** Switch **expression** (có `->`) trả về giá trị — khác switch **statement** truyền thống (có `:` và `break`). Cú pháp `->` tự kết thúc, **không cần `break`**, không bị fall-through.

### Nhiều label cho 1 case

```java
int numLetters = switch (seasonName)
{
    case "Spring", "Summer", "Winter" -> 6;
    case "Fall" -> 4;
    default -> -1;
};
```

### Switch với enum — không cần prefix

```java
enum Size { SMALL, MEDIUM, LARGE, EXTRA_LARGE };

String label = switch (itemSize)
{
    case SMALL -> "S";       // không cần Size.SMALL
    case MEDIUM -> "M";
    case LARGE -> "L";
    case EXTRA_LARGE -> "XL";
};
// Nếu bao phủ hết enum → không cần default
```

### `case null` (Java 21+)

> *"If the selector is null, a NullPointerException is thrown. If you want to avoid this possibility, add a case null."*

```java
String label = switch (itemSize)
{
    // ...
    case null -> "???";   // Java 21+, tránh NullPointerException
};
// Lưu ý: default KHÔNG match null!
```

### ⚠️ SO SÁNH JS

```js
// JS switch — dùng : và PHẢI break, không break = fall-through
switch (seasonCode) {
    case 0: result = "Spring"; break;   // quên break → chạy tiếp case 1
    case 1: result = "Summer"; break;
    default: result = "???";
}
```

```java
// Java switch expression — dùng ->, TỰ ĐỘNG kết thúc, không cần break
String result = switch (seasonCode)
{
    case 0 -> "Spring";   // không fall-through
    case 1 -> "Summer";
    default -> "???";
};
```

| | JS `switch` | Java switch expression (`->`) |
|---|---|---|
| Cần `break`? | ✅ quên = fall-through | ❌ tự kết thúc |
| Trả giá trị? | ❌ (phải gán biến trong từng case) | ✅ expression có giá trị |
| Nhiều label? | Xếp case chồng (fall-through trick) | `case "a", "b" ->` |

---

## 3.5.10 Bitwise Operators — Toán tử bitwise

> *"For any of the integer types, you have operators that can work directly with the bits that make up the integers."*

| Operator | Tên | Ví dụ |
|---|---|---|
| `&` | AND | `n & 0b1000` → kiểm tra bit thứ 4 |
| `\|` | OR | |
| `^` | XOR | |
| `~` | NOT (đảo bit) | |
| `<<` | Left shift | `1 << 3` = 8 |
| `>>` | Right shift (giữ dấu) | arithmetic shift |
| `>>>` | Right shift (điền 0) | logical shift |

```java
int fourthBitFromRight = (n & (1 << 3)) >> 3;
```

> *"When applied to boolean values, the & and | operators yield a boolean value. These operators are similar to the && and || operators, except that the & and | operators are not evaluated in 'short circuit' fashion."*

**Dịch:** `&` và `|` với boolean → **không short-circuit** (cả hai vế đều được đánh giá). Khác `&&` và `||`.

> 💡 **JS cũng có `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`** — cú pháp và ý nghĩa giống hệt. Nhưng JS ép toán hạng về 32-bit integer trước khi tính, Java thì kiểu đã rõ ràng.

### ⚠️ Bẫy shift

> *"The right-hand operand of the shift operators is reduced modulo 32 (unless the left-hand operand is a long, in which case the right-hand operand is reduced modulo 64). For example, the value of 1 << 35 is the same as 1 << 3 or 8."*

```java
1 << 35   // = 1 << (35 % 32) = 1 << 3 = 8
```

Bitwise sẽ gặp lại ở các chương sau khi cần xử lý flags, permissions, encoding.

---

## 3.5.11 Parentheses and Operator Hierarchy — Thứ tự ưu tiên

> *"If no parentheses are used, operations are performed in the hierarchical order indicated. Operators on the same level are processed from left to right, except for those that are right-associative."*

### Bảng operator precedence (cao → thấp)

| Thứ tự | Operators | Kết hợp |
|---|---|---|
| 1 | `[]` `.` `()` (method call) | Trái → Phải |
| 2 | `!` `~` `++` `--` `+`/`-` (unary) `()` (cast) `new` | Phải → Trái |
| 3 | `*` `/` `%` | Trái → Phải |
| 4 | `+` `-` | Trái → Phải |
| 5 | `<<` `>>` `>>>` | Trái → Phải |
| 6 | `<` `<=` `>` `>=` `instanceof` | Trái → Phải |
| 7 | `==` `!=` | Trái → Phải |
| 8 | `&` | Trái → Phải |
| 9 | `^` | Trái → Phải |
| 10 | `\|` | Trái → Phải |
| 11 | `&&` | Trái → Phải |
| 12 | `\|\|` | Trái → Phải |
| 13 | `? :` | Phải → Trái |
| 14 | `=` `+=` `-=` `*=` `/=` `%=` ... | Phải → Trái |

```java
a && b || c     // → (a && b) || c     ← && ưu tiên hơn ||
a += b += c     // → a += (b += c)     ← = là right-associative
```

> 💡 **JS gần giống hệt** bảng này. Thứ tự ưu tiên operator giữa Java và JS gần như không khác — cùng gốc C.

**Quy tắc thực tế:** Không cần thuộc bảng — khi nghi ngờ, **thêm ngoặc `()`** cho rõ ý đồ. Code dễ đọc quan trọng hơn code ngắn.

---

## Tổng kết: Bẫy chính khi từ JS sang Java

| Bẫy | Java | JS |
|---|---|---|
| Integer division | `15/2` = **7** | `15/2` = **7.5** |
| `%` với số âm | `-1 % 12` = -1, dùng `Math.floorMod` | Giống, phải tự xử lý |
| Cast boolean | **Không thể** cast boolean ↔ số | `Number(true)` = 1, truthy/falsy |
| `===` | **Không có** — `==` đã strict | `===` vs `==` (loose) |
| Compound assign | `x += 3.5` **ép kiểu ngầm** (int) | Không vấn đề (1 kiểu number) |
| Switch | `->` expression, không fall-through | `:` statement, cần `break` |
| Overflow | Im lặng sai → dùng `Math.xxxExact` | Không tràn int (float 64-bit) |

---

## Bài kế tiếp

→ [[05 - Strings]] — String trong Java, so sánh chuỗi (`equals` chứ không phải `==`), text blocks, và StringBuilder.
