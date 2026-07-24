# Glossary — Fundamental Programming Structures

> Thuật ngữ chương 3: Fundamental Programming Structures in Java.

## A

**Access Modifier**
Từ khoá điều khiển mức truy cập (`public`, `private`, `protected`) — phần khác của chương trình được đụng vào code này tới đâu. Chi tiết Chapter 4.

## B

**Block**
Đoạn code giữa cặp ngoặc `{ }`. Body của method, class đều là block.

## C

**CamelCase**
Convention đặt tên: viết hoa chữ đầu mỗi từ. Class dùng UpperCamelCase (`FirstSample`), method/biến dùng lowerCamelCase (`myMethod`). Giống JS.

**Case Sensitive**
Phân biệt hoa thường — `main` ≠ `Main`. Sai là không chạy.

## J

**JEP** (Java Enhancement Proposal)
Đề xuất cải tiến Java — như TC39 proposal bên JS. Ví dụ JEP 445: rút gọn `void main()` (preview trong Java 21).

## M

**main** (method)
Cửa ngõ chương trình — JVM luôn bắt đầu chạy từ `public static void main(String[] args)`. Không có = không chạy. JS không có khái niệm này (file chạy từ trên xuống).

**Method**
Cách Java gọi "function" — vì mọi function đều phải thuộc 1 class. Cú pháp gọi: `object.method(arguments)`.

## R

**Reserved Word**
Từ khoá ngôn ngữ giữ riêng (`public`, `class`, `static`, `void`...) — không dùng đặt tên class/biến được.

## S

**Statement**
"Câu" của ngôn ngữ — mỗi statement **phải kết thúc bằng `;`**. Xuống dòng không kết thúc statement (khác JS có ASI).

**System.out**
Object đại diện console output. `println` = in + xuống dòng, `print` = in không xuống dòng. Tương đương `console.log` bên JS.
