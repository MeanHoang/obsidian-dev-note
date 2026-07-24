# 04 — JShell

> Chapter 2, Section 2.4 — Core Java Volume I, 13th Edition (Horstmann).
> Bài cuối chương 2: **REPL của Java** — món "trả nợ" sau 22 năm (bài 1.2.8: Horstmann mỉa buzzword "Interpreted" vì thiếu đúng thứ này).

---

## JShell là gì?

> *"The JShell program provides a 'read-evaluate-print loop,' or REPL. You type a Java expression; JShell evaluates your input, prints the result, and waits for your next input. This is an excellent way to experiment—much faster than writing a complete program in an integrated development environment."*

**Dịch:** JShell = **REPL** (read-evaluate-print loop): gõ biểu thức Java → JShell **tính → in kết quả → chờ lệnh tiếp**. Cách tuyệt vời để **thử nghiệm** — nhanh hơn nhiều so với viết chương trình hoàn chỉnh trong IDE.

Chính là **exploratory programming** đã học kỹ: DevTools Console của bạn, phiên bản Java. Có từ **Java 9 (2017)**.

## Khởi động + phép thử đầu tiên

```
$ jshell
|  Welcome to JShell -- Version 21.0.4
|  For an introduction type: /help intro

jshell> "Core Java".length()
$1 ==> 9
```

> *"Note that you do not type System.out.println. JShell automatically prints the value of every expression that you enter."*

**Dịch:** **Không cần** `System.out.println` — JShell **tự in** giá trị mọi biểu thức. (Y hệt Console: gõ `"Core Java".length` là thấy `9`, chẳng ai gõ `console.log` trong REPL.)

So sánh cho thấm — cùng 1 phép thử:

```java
// Cách "nghi lễ" (bài 02):  tạo file → class → main → javac → java
public class Test {
    public static void main(String[] args) {
        System.out.println("Core Java".length());
    }
}

// JShell:  1 dòng, 0 nghi lễ
jshell> "Core Java".length()
```

Không class, không main, không compile tay — đúng lời sách kết bài: *"without fussing with a program and a main method."*

## Biến tự động `$1, $2...` và biến tự đặt

> *"The $1 in the output indicates that the result is available in further calculations."*

```
jshell> 5 * $1 - 3          // dùng lại kết quả trước qua $1
$2 ==> 42

jshell> var answer = 6 * 7  // cần dùng nhiều → tự đặt tên
answer ==> 42
```

Mọi kết quả được **tự gán vào `$n`** để xài tiếp — (Console cũng có trò tương tự: `$_` = kết quả gần nhất). Chú ý `var` — khai báo không cần ghi kiểu (Java 10+), sẽ học ở Chapter 3.

## Tab completion — khám phá thư viện ngay tại chỗ

> *"Another useful feature is tab completion."*

```
jshell> Math.<Tab>          → liệt kê TOÀN BỘ method của Math (abs, pow, sqrt, log...)
jshell> Math.l<Tab>         → thu hẹp: log( log10( log1p(
jshell> Math.log10(0.001)
$4 ==> -3.0
```

⭐ Đây là cách **tự khám phá Standard Library** (~4000 class!) mà không cần mở docs — gõ tên class, chấm, Tab, xem nó có gì. Kèm phím **↑** để gọi lại/sửa lệnh cũ (như mọi shell).

Thoát: `/exit`

## Vì sao bài này "có ý nghĩa lịch sử" — nối 2 bài cũ

> *"JShell makes it easy and fun to learn the Java language and library without having to launch a heavy-duty development environment and without fussing with a program and a main method."*

Nhớ chuỗi đã học:
- **Bài 1.2.8:** white paper 1995 khoe Java "rapid and exploratory" → Horstmann bắn: *"a real stretch"* — thiếu REPL suốt 20 năm trong khi Lisp có từ thập niên 60
- **Bài này:** JShell (Java 9, 2017) chính là lời trả nợ đó — Java **cuối cùng** cũng có trải nghiệm "gõ là thấy"

## Cách dùng thực dụng khi học sách này

JShell là **bạn đồng hành lý tưởng** cho các chương tới:

```
Chapter 3 (cú pháp):    thử ngay data types, toán tử, String methods
jshell> 2_000_000_000 * 2        // int tràn số? thử là biết!
jshell> "abc".substring(1)

Chapter 5-9 (thư viện):  nghịch ArrayList, HashMap ngay tại chỗ
jshell> var list = new ArrayList<String>()
jshell> list.add("hi")
```

Đọc sách tới đâu, mở JShell nghịch tới đó — đúng workflow bạn vẫn làm với DevTools Console khi học JS API mới.

---

## Tóm tắt section 2.4 + đóng Chapter 2

> **JShell = REPL của Java** (Java 9+): gõ biểu thức → tự tính tự in, không cần class/main/compile. Kết quả tự lưu vào `$n`, Tab completion để khám phá thư viện. Món Java nợ 22 năm so với Lisp/Python — giờ là công cụ học sách tốt nhất.
>
> **Chapter 2 xong** — bạn đã có đủ 3 chế độ làm việc: **terminal** (hiểu bản chất), **IDE** (làm việc thật), **JShell** (thử nghiệm nhanh).

---

## Bài kế tiếp

→ Chapter 3: [[02 - Java/Volume I - Fundamentals/03 - Fundamental Programming Structures/01 - A Simple Java Program|Fundamental Programming Structures in Java]] — **bắt đầu học ngôn ngữ thật sự**: mổ xẻ từng dòng chương trình, data types, biến, toán tử, String, control flow, mảng. Từ đây dân JS bắt đầu thấy khác biệt thật.
