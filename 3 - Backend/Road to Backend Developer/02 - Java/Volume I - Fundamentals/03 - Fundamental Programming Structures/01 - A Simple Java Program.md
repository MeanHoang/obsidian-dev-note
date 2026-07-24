# 01 — A Simple Java Program

> Chapter 3, Section 3.1 (+ 3.2 Comments) — Core Java Volume I, 13th Edition (Horstmann).
> **Bắt đầu học ngôn ngữ thật sự** — mổ xẻ từng chữ của chương trình Java nhỏ nhất.

---

## Chương trình mẫu

> *"Let's look more closely at one of the simplest Java programs you can have—one that merely prints a message to console."*

```java
public class FirstSample
{
   public static void main(String[] args)
   {
      System.out.println("We will not use 'Hello, World!'");
   }
}
```

> *"It is worth spending all the time you need to become comfortable with the framework of this sample; the pieces will recur in all applications."*

**Dịch:** Đáng bỏ **bao nhiêu thời gian cũng được** để quen với khung sườn này — vì các mảnh của nó **lặp lại trong mọi ứng dụng** Java. Giờ mổ xẻ từng chữ.

---

## Chữ thứ 1: Java là case sensitive

> *"First and foremost, Java is case sensitive. If you made any mistakes in capitalization (such as typing Main instead of main), the program will not run."*

**Dịch:** Trước tiên và trên hết: Java **phân biệt hoa thường**. Gõ `Main` thay vì `main` = **không chạy**. (Đã nếm ở bài Chapter 2 — `Welcome` vs `welcome`. JS cũng case sensitive nên bạn quen rồi.)

## Chữ thứ 2: `public` — access modifier

> *"The keyword public is called an access modifier; these modifiers control the level of access other parts of a program have to this code."*

**Dịch:** `public` là **access modifier** — điều khiển mức độ các phần khác của chương trình được **truy cập** vào code này. Chi tiết ở Chapter 4. (Đây chính là họ hàng `private` đã gặp ở bài encapsulation — máy bán nước: public = interface lộ ra, private = ruột giấu đi.)

## Chữ thứ 3: `class` — mọi thứ sống trong class

> *"The keyword class reminds you that everything in a Java program lives inside a class... For now, think of a class as a container for the program logic that defines the behavior of an application. Classes are the building blocks with which all Java applications are built. Everything in a Java program must be inside a class."*

**Dịch:** **Mọi thứ trong Java sống trong class.** Tạm hiểu class = **container chứa logic**. Class là **viên gạch** xây mọi ứng dụng Java.

> 💡 **Khác JS lớn nhất về cấu trúc file:** JS cho code "trần" ở top-level (`console.log("hi")` một dòng là 1 file hợp lệ). Java **không có code trần** — hàm lẻ, biến lẻ đều không được phép đứng ngoài class. Đây là cam kết OOP triệt để từ bài 1.2.2.

## Quy tắc đặt tên class + tên file

> *"Names must begin with a letter, and after that, they can have any combination of letters and digits... You cannot use a Java reserved word... The standard naming convention is that class names are nouns that start with an uppercase letter... This use of uppercase letters in the middle of a name is sometimes called 'camel case.'"*

**Dịch:** Tên class: bắt đầu bằng **chữ cái**, sau đó chữ + số tuỳ ý, không trùng **reserved word** (`public`, `class`...). Convention: **danh từ, viết hoa chữ đầu mỗi từ** — `FirstSample`, `ImageViewer` — gọi là **CamelCase**.

> *"You need to make the file name for the source code the same as the name of the public class, with the extension .java appended."*

**Dịch:** ⚠️ **Tên file BẮT BUỘC = tên public class** + `.java` → class `FirstSample` phải nằm trong file `FirstSample.java`. (JS không có luật này — file tên gì cũng được. Java thì compiler **từ chối** nếu lệch tên.)

So chuẩn đặt tên 2 thế giới:

| | Java | JS |
|---|---|---|
| Class | `FirstSample` (UpperCamelCase) | Giống — `class MyComponent` |
| Method/biến | `myMethod` (lowerCamelCase) | Giống — `myFunction` |
| Tên file | **Bắt buộc** theo class | Tự do (thường kebab-case) |

## Chữ thứ 4: `main` — cửa ngõ chương trình

> *"When you use `java ClassName` to run a compiled program, the Java virtual machine always starts execution with the code in the main method in the class you indicate. (The term 'method' is Java-speak for a function.) Thus, you must have a main method in the source of your class for your code to execute."*

**Dịch:** JVM **luôn bắt đầu** từ method `main` của class bạn chỉ định. Không có `main` = không chạy được. Và thuật ngữ: Java gọi function là **"method"** (vì mọi function đều thuộc class nào đó).

```
java FirstSample
     │
     ▼
JVM tìm đúng chữ ký: public static void main(String[] args)
     │
     ▼
chạy từ dòng đầu của main → hết main → chương trình kết thúc
```

> 💡 **JS:** không có main — file chạy **từ trên xuống dưới**, code top-level chính là "main ngầm". Node: `node app.js` = chạy cả file. Java tường minh hơn: điểm vào có tên, có địa chỉ.

### Khung bắt buộc phải thuộc

> *"The point to remember for now is that every Java application must have a main method that is declared in the following way:"*

```java
public class ClassName
{
   public static void main(String[] args)
   {
      program statements
   }
}
```

> *"For now, don't worry about the keywords static void—just think of them as part of what you need to get a Java program to compile. By the end of Chapter 4, you will understand this incantation completely."*

**Dịch:** Tạm thời **đừng lo** `static void` là gì — coi như **câu thần chú** (incantation) để chương trình compile. Hết Chapter 4 sẽ hiểu trọn. (Tạm dịch nhanh cho đỡ ngứa: `static` = thuộc class không thuộc object, `void` = không trả về gì, `String[] args` = tham số dòng lệnh — như `process.argv`.)

### Chuyện bên lề: bug report "main không cần public" (1999)

> *"A programmer filed a bug report... In 1999, that bug was marked as 'closed, will not be fixed.'... Fortunately, sanity prevailed. The Java launcher in Java 1.4 and beyond enforces that the main method is public."*

Sách kể: từng có bug là JVM **vẫn chạy** dù `main` không public (sai spec). Bug report bị đóng "will not be fixed" năm 1999, nhưng cuối cùng **lẽ phải thắng** — Java 1.4+ bắt buộc `main` phải public. Điểm Horstmann khen: **bug reports của Java công khai cho mọi người soi** từ trước cả khi Java open source.

## Preview Note: `void main()` — tương lai gọn hơn (JEP 445)

> *"The byzantine complexity of public static void main is about to give way to something simpler. Java 21 has a preview feature... That is nicer. No public, no static, no String[] args."*

```java
// Java 21 preview — thần chú rút gọn:
void main()
{
   System.out.println("We will not use 'Hello, World!'");
}
// chạy: java --enable-preview --source 21 FirstSample.java
```

**Dịch:** Sự phức tạp "byzantine" của `public static void main` sắp nhường chỗ cho thứ đơn giản hơn — thậm chí **bỏ luôn class** với chương trình 1 file. Nhưng vì còn **preview** nên sách không dùng. (Nối bài LTS: production tránh preview features. Và để ý — Java đang tiến dần về phía... trải nghiệm JS: ít nghi lễ hơn cho người mới.)

## Dấu ngoặc `{}` và dấu chấm phẩy `;`

> *"In Java, as in C/C++, braces delineate the parts (usually called blocks) in your program... Brace styles have inspired an inordinate amount of useless controversy... As whitespace is irrelevant to the Java compiler, you can use whatever brace style you like."*

**Dịch:** `{}` phân định **block**. Tranh cãi về style đặt ngoặc là **"cuộc tranh cãi vô ích"** 😄 — whitespace không có ý nghĩa với compiler, thích style nào dùng style đó. (Sách xếp `{` xuống dòng riêng; JS quen `{` cùng dòng — cả 2 đều hợp lệ.)

> *"In Java, every statement must end with a semicolon. In particular, carriage returns do not mark the end of a statement."*

**Dịch:** ⚠️ Mọi statement **phải kết thúc bằng `;`** — xuống dòng **không** kết thúc statement. Khác JS: ASI (tự chèn chấm phẩy) cho phép bỏ `;` — Java **không tha**, thiếu là compile error. (Đúng cú lẫn số 1 đã cảnh báo ở bài "code song song JS + Java".)

## `System.out.println` — giải phẫu

> *"Here, we are using the System.out object and calling its println method. Notice the periods used to invoke a method. Java uses the general syntax object.method(arguments) as its equivalent of a function call."*

```
System.out.println("...")
└──┬───┘ └──┬───┘
  object    method      →  cú pháp chung: object.method(arguments)
```

- `System.out` = object đại diện **console output**
- `.println(...)` = method của object đó — in + **xuống dòng**; `print(...)` = in **không** xuống dòng
- Method không tham số vẫn phải có ngoặc rỗng: `System.out.println()` → in dòng trống

(JS y hệt về cú pháp: `console.log(...)` cũng là `object.method(args)` — chỉ khác tên.)

---

## Section 3.2 — Comments (ngắn gọn)

> *"Java has three ways of marking comments."*

| Kiểu | Cú pháp | Dùng cho | JS có? |
|---|---|---|---|
| 1 dòng | `// ...` | Ghi chú nhanh cuối dòng | ✅ Giống hệt |
| Nhiều dòng | `/* ... */` | Block dài | ✅ Giống hệt |
| **Documentation** | `/** ... */` | Tool **javadoc** đọc để sinh docs tự động (Chapter 4) | Tương đương JSDoc |

> *"Comments in Java... do not show up in the executable program."* — comment không vào bytecode, viết bao nhiêu cũng không nặng chương trình.

---

## Tóm tắt section 3.1 + 3.2

> Khung mọi chương trình Java: **file `X.java` = public class `X`** → trong có **`public static void main(String[] args)`** — cửa ngõ JVM khởi chạy. Case sensitive, mọi statement kết thúc `;`, mọi code nằm trong class, function gọi là **method**, cú pháp gọi: `object.method(args)`. `static void` tạm coi là thần chú — Chapter 4 giải. Comment: `//`, `/* */`, `/** */` (javadoc).

---

## Bài kế tiếp

→ [[02 - Data Types]] — 8 kiểu dữ liệu primitive của Java: `int`, `long`, `double`, `char`, `boolean`... — nơi dân JS lần đầu thấy "1 con số không chỉ là number".
