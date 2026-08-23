# Glossary — Fundamental Programming Structures

> Thuật ngữ chương 3: Fundamental Programming Structures in Java.

## A

**Access Modifier**
Từ khoá điều khiển mức truy cập (`public`, `private`, `protected`) — phần khác của chương trình được đụng vào code này tới đâu. Chi tiết Chapter 4.

## B

**BigDecimal**
Class cho phép tính toán số thực **chính xác tuyệt đối** — dùng khi xử lý **tiền** (double/float bị lỗi làm tròn). Ví dụ: `new BigDecimal("2.0").subtract(new BigDecimal("1.1"))` → đúng 0.9.

**Block**
Đoạn code giữa cặp ngoặc `{ }`. Body của method, class đều là block.

**boolean**
Kiểu chỉ có `true`/`false`. Khác JS: `if()` chỉ nhận boolean, **không có truthy/falsy** — `if (0)` là compile error.

## C

**Cast**
Ép kiểu tường minh (explicit conversion) — dùng khi chuyển từ kiểu lớn sang kiểu nhỏ (narrowing), ví dụ `(int) 9.997` → 9. Cắt phần thập phân, **không làm tròn**. Bẫy: `(byte) 300` = 44 (chỉ lấy 8 bit cuối). Java **không cho phép** cast giữa `boolean` và số — khác JS nơi `Number(true)` = 1. Xem [[04 - Operators#3.5.4 Casts — Ép kiểu (narrowing)]].

**`const` (keyword)**
Reserved word trong Java nhưng **không có chức năng** — không dùng được. Java dùng `final` thay cho `const`. Đừng nhầm với `const` của JS.

**CamelCase**
Convention đặt tên: viết hoa chữ đầu mỗi từ. Class dùng UpperCamelCase (`FirstSample`), method/biến dùng lowerCamelCase (`myMethod`). Giống JS.

**Case Sensitive**
Phân biệt hoa thường — `main` ≠ `Main`. Sai là không chạy.

## E

**`equals`** (method)
Method so sánh **nội dung** hai String (hoặc object). **PHẢI dùng thay `==`** khi so sánh String — vì `==` so sánh địa chỉ (reference), không phải nội dung. Ví dụ: `"Hello".equals(greeting)` → `true` nếu nội dung giống. Có phiên bản `equalsIgnoreCase()` bỏ qua hoa thường. Khác JS: `===` so sánh giá trị cho string → an toàn, không cần method riêng. Xem [[05 - Strings#3.6.5 Testing Strings for Equality ⭐⭐⭐ — BẪY LỚN NHẤT]].

**`enum`** (Enumerated Type)
Kiểu dữ liệu chứa **tập giá trị cố định có tên** — ví dụ `enum Size { SMALL, MEDIUM, LARGE }`. Biến kiểu enum chỉ nhận giá trị trong danh sách hoặc `null`, gán ngoài = compile error (**type-safe**). JS không có enum native, pattern gần nhất là `Object.freeze({...})` nhưng không type-safe. Chi tiết Chapter 5.

## F

**`final`**
Keyword đánh dấu **hằng số** — gán giá trị 1 lần, sau đó không đổi được. Tương đương `const` trong JS. Quy ước đặt tên ALL_UPPERCASE (`final double CM_PER_INCH = 2.54`). Lưu ý: `final` chặn reassign nhưng **không chặn mutation** bên trong object (giống `const` JS).

## J

**JEP** (Java Enhancement Proposal)
Đề xuất cải tiến Java — như TC39 proposal bên JS. Ví dụ JEP 445: rút gọn `void main()` (preview trong Java 21).

## I

**Immutable**
Object mà nội dung **không thể thay đổi** sau khi tạo. String trong Java là immutable — mọi "thay đổi" tạo object mới. JS string cũng immutable (`"hello"[0] = "H"` không work). Ưu điểm: an toàn chia sẻ giữa nhiều biến (string pool), thread-safe, dùng làm key HashMap an toàn. Xem [[05 - Strings#3.6.4 Strings Are Immutable ⭐⭐]].

**IEEE 754**
Chuẩn quốc tế cho số thực dấu phẩy động. Java `double` và JS `number` đều tuân theo → cùng bị `2.0 - 1.1 = 0.8999...`. Dùng BigDecimal khi cần chính xác.

## N

**`null`**
Giá trị đặc biệt biểu thị **không có object nào** gắn với biến. Gọi method trên null → **NullPointerException** (crash). Phải check `str != null` trước khi dùng — thứ tự quan trọng nhờ short-circuit: `str != null && str.length() != 0`. Khác JS: JS có cả `null` và `undefined`, và có optional chaining `?.` để tránh crash. Xem [[05 - Strings#3.6.6 Empty and Null Strings — Chuỗi rỗng vs null]].

## M

**Math class**
Class chứa các hàm toán học static: `Math.sqrt`, `Math.pow`, `Math.round`, `Math.clamp` (Java 21+), các hằng số `Math.PI`, `Math.E`, `Math.TAU`. Có thể dùng `import static java.lang.Math.*` để bỏ tiền tố. Cũng chứa các method an toàn chống overflow: `Math.multiplyExact`, `Math.addExact`... Xem [[04 - Operators#3.5.2 Mathematical Functions and Constants — Hàm toán và hằng số]].

**main** (method)
Cửa ngõ chương trình — JVM luôn bắt đầu chạy từ `public static void main(String[] args)`. Không có = không chạy. JS không có khái niệm này (file chạy từ trên xuống).

**Method**
Cách Java gọi "function" — vì mọi function đều phải thuộc 1 class. Cú pháp gọi: `object.method(arguments)`.

## O

**Operator Precedence**
Thứ tự ưu tiên của các toán tử — quyết định phép nào tính trước khi không có ngoặc. Ví dụ: `&&` ưu tiên hơn `||` nên `a && b || c` = `(a && b) || c`. Assignment (`=`, `+=`...) là right-associative: `a += b += c` = `a += (b += c)`. Bảng đầy đủ tại [[04 - Operators#3.5.11 Parentheses and Operator Hierarchy — Thứ tự ưu tiên]]. Gần giống JS (cùng gốc C).

## P

**Primitive Type**
8 kiểu cơ bản của Java (`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`) — lưu **giá trị trực tiếp**, không phải object. Kích thước cố định trên mọi máy (portable). Khác reference type (String, ArrayList... = object trên heap).

## R

**Reserved Word**
Từ khoá ngôn ngữ giữ riêng (`public`, `class`, `static`, `void`...) — không dùng đặt tên class/biến được.

## S

**String**
Class đại diện chuỗi ký tự trong Java — là **object** (không phải primitive), **immutable** (không thể sửa nội dung). So sánh bằng `.equals()`, **KHÔNG dùng `==`** (so sánh địa chỉ). Nối chuỗi nhiều lần trong loop → dùng StringBuilder thay vì `+`. Có gần 100 method: `length()`, `charAt()`, `indexOf()`, `substring()`, `split()`, `replace()`, `strip()`, `join()`, `repeat()`... Xem [[05 - Strings]].

**String Pool**
Vùng bộ nhớ đặc biệt nơi JVM lưu các **string literal**. Hai literal cùng nội dung → **chia sẻ cùng 1 object** → tiết kiệm bộ nhớ. Đây là lý do `"Hello" == "Hello"` → `true` (cùng địa chỉ trong pool). Nhưng string tạo bằng `substring()`, `+` runtime → **KHÔNG nằm trong pool** → `==` trả `false` dù nội dung giống. Luôn dùng `.equals()`. Xem [[05 - Strings#3.6.5 Testing Strings for Equality ⭐⭐⭐ — BẪY LỚN NHẤT]].

**StringBuilder**
Class tạo chuỗi **mutable** — dùng khi cần nối nhiều chuỗi (đặc biệt trong loop). Method chính: `.append()`, `.toString()`, `.reverse()`. Hỗ trợ method chaining. Nhanh hơn nối String bằng `+` trong loop vì không tạo object trung gian. Legacy: `StringBuffer` = thread-safe nhưng chậm hơn, API giống hệt. JS tương đương: `Array.push()` + `.join("")`. Xem [[05 - Strings#3.6.9 Building Strings — StringBuilder ⭐]].

**Short-circuit Evaluation**
Cách `&&` và `||` đánh giá biểu thức: nếu vế trái đã quyết định kết quả thì **bỏ qua vế phải**. `false && X` → không tính X. `true || X` → không tính X. Ứng dụng: `x != 0 && 1/x > y` tránh chia cho 0. Giống hệt JS. Lưu ý: `&` và `|` (bitwise) thì **không** short-circuit — cả hai vế luôn được tính. Xem [[04 - Operators#3.5.7 Relational and boolean Operators — So sánh và logic]].

**`strictfp`**
Keyword đánh dấu method/class phải dùng floating-point 64-bit nghiêm ngặt, đảm bảo kết quả giống nhau trên mọi máy (một số CPU dùng 80-bit register cho phép tính trung gian). **Đã lỗi thời từ Java 17** — VM giờ luôn dùng 64-bit arithmetic. Xem [[04 - Operators#`strictfp` — Đã lỗi thời]].

**Switch Expression** (Java 14+)
Dạng `switch` mới dùng `->` thay vì `:`, **trả về giá trị** (là expression, không chỉ statement). Không cần `break`, không bị fall-through. Hỗ trợ multiple labels (`case "a", "b" ->`), `case null` (Java 21+). Khác JS switch (dùng `:`, cần `break`, không trả giá trị). Xem [[04 - Operators#3.5.9 Switch Expressions — `switch` kiểu mới (Java 14+)]].

**`static final`**
Khai báo **class constant** — hằng số dùng chung cho mọi method trong class. Ví dụ `public static final double CM_PER_INCH = 2.54`. Nếu thêm `public`, class khác cũng truy cập được qua `ClassName.CONSTANT_NAME`. JS tương đương gần nhất: `export const` ở module level.

**Statement**
"Câu" của ngôn ngữ — mỗi statement **phải kết thúc bằng `;`**. Xuống dòng không kết thúc statement (khác JS có ASI).

**System.out**
Object đại diện console output. `println` = in + xuống dòng, `print` = in không xuống dòng. Tương đương `console.log` bên JS.

## T

**Text Block** (Java 15+)
Chuỗi nhiều dòng viết giữa `"""..."""`. Tự xoá common indentation, không cần escape dấu `"`. **KHÔNG có interpolation `${}`** — khác JS template literal. Dùng `.formatted()` hoặc `String.format()` để chèn biến. Escape đặc biệt: `\` cuối dòng = nối dòng, `\s` = giữ space. Rất tiện cho SQL, HTML, JSON trong code. Xem [[05 - Strings#3.6.10 Text Blocks (Java 15+) — Chuỗi nhiều dòng]].

## V

**`var`** (Java 10+)
Keyword cho **type inference** — compiler tự suy kiểu từ giá trị khởi tạo. Ví dụ `var x = 12` → compiler suy ra `int`. **Hoàn toàn khác `var` JS**: Java `var` là block scope + type cố định, JS `var` là function scope + type dynamic. Chỉ dùng cho local variable, phải khởi tạo ngay.
