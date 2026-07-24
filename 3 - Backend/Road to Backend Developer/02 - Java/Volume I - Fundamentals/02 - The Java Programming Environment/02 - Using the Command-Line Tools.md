# 02 — Using the Command-Line Tools

> Chapter 2, Section 2.2 — Core Java Volume I, 13th Edition (Horstmann).
> **Chương trình Java đầu tiên** — compile và chạy bằng tay trong terminal, chưa dùng IDE.

---

## Vì sao phải học "cách khổ" trước?

> *"The JDK contains nothing even remotely similar [to an IDE]. You do everything by typing in commands in a terminal window. This may sound cumbersome, but it is nevertheless an essential skill. When you first install Java, you will want to troubleshoot your installation before you install a development environment. Moreover, by executing the basic steps yourself, you gain a better understanding of what a development environment does behind your back."*

**Dịch:** JDK **không có** editor, không menu, không nút Run — mọi thứ gõ tay trong terminal. Nghe cực nhưng là **kỹ năng thiết yếu**, vì 2 lý do:
1. Vừa cài Java xong cần **kiểm tra cài đặt** trước khi lắp IDE lên
2. Tự tay làm từng bước → hiểu IDE **làm gì sau lưng mình** khi bấm nút Run

> *"Let's get started the hard way: compiling and launching a Java program from the command line."*

(Đúng tinh thần mục tiêu của bạn — hiểu bản chất, không bấm nút mù.)

---

## Nghi thức 2 lệnh

```bash
cd corejava/v1ch02/Welcome    # thư mục code ví dụ của sách (bài 01 đã tải)

javac Welcome.java            # ① COMPILE
java Welcome                  # ② RUN
```

> *"What happened? The javac program is the Java compiler. It compiles the file Welcome.java into the file Welcome.class. The java program launches the Java virtual machine. It executes the bytecodes that the compiler placed in the class file."*

**Dịch:** `javac` = compiler — dịch `Welcome.java` thành `Welcome.class`. `java` = **khởi động JVM** — thực thi bytecode trong file class.

Đây là toàn bộ pipeline đã học suốt Chapter 1, giờ chạy thật dưới tay bạn:

```
Welcome.java ──javac──► Welcome.class ──java──► JVM (interpret + HotSpot JIT) ──► output
(source, người đọc)     (bytecode, JVM đọc)
     COMPILE TIME              │                        RUNTIME
                     file mới xuất hiện trên đĩa!
```

> 💡 **So với JS:** `node app.js` = 1 lệnh làm tất (V8 tự compile ngầm trong RAM). Java tách làm 2 lệnh **nhìn thấy được** — và để lại "bằng chứng" là file `.class` trên đĩa. Chính file này là thứ đem deploy lên server (bài "đưa code lên server" đã học).

---

## Chương trình đầu tiên — Welcome.java (Listing 2.1)

```java
/**
 * This program displays a greeting for the reader.
 * @version 1.30 2014-02-27
 * @author Cay Horstmann
 */
public class Welcome
{
   public static void main(String[] args)
   {
      String greeting = "Welcome to Core Java!";
      System.out.println(greeting);
      for (int i = 0; i < greeting.length(); i++)
         System.out.print("=");
      System.out.println();
   }
}
```

Output:

```
Welcome to Core Java!
=====================
```

Sách nói *"You will see how it works in the next chapter"* — Chapter 3 mới mổ xẻ cú pháp. Nhưng liếc nhanh bằng mắt JS:

| Java | JS tương đương | Ghi chú |
|---|---|---|
| `public class Welcome { }` | — | **Mọi code phải nằm trong class** (bài OOP 1.2.2) — JS không bắt |
| `public static void main(String[] args)` | Điểm vào — như phần code top-level của file `.js` | JVM tìm đúng method tên `main` này để bắt đầu. `args` = `process.argv` |
| `String greeting = "..."` | `const greeting = "..."` | Khai **kiểu rõ ràng** — static typing đã học |
| `System.out.println(...)` | `console.log(...)` | In + xuống dòng; `print` = không xuống dòng |
| `/** ... @author */` | JSDoc `/** ... */` | Comment kiểu **javadoc** — tool javadoc đọc được (Chapter 4) |

---

## Những cú ngã kinh điển (sách liệt kê — đọc trước đỡ mất 1 buổi debug)

> *"Any number of things can go wrong, leading to frustrating results. Pay attention to the following points..."*

**1. Hoa thường phải chuẩn** — class là `Welcome`, không phải `welcome` hay `WELCOME`. *"As always, case matters in Java."*

**2. Lệnh nào đuôi nấy** — quy tắc dễ nhầm nhất:

```bash
javac Welcome.java   # compiler cần TÊN FILE (có .java)
java  Welcome        # launcher cần TÊN CLASS (KHÔNG đuôi gì cả!)

java Welcome.java    # ❌ sai kiểu cổ điển → lỗi than về "Welcome/java"
```

**3. "javac: command not found"** → PATH chưa đúng, quay lại bài 01.

**4. Không tìm thấy Welcome.java** → kiểm tra đúng thư mục; và bẫy Windows huyền thoại: **Notepad lén thêm đuôi `.txt`** (`Welcome.java.txt`) rồi Explorer **giấu** cái đuôi đó đi — file nhìn đúng mà không phải. Cách né: save với tên trong ngoặc kép `"Welcome.java"`.

**5. `NoClassDefFoundError`** → soi kỹ tên class trong thông báo: than về `welcome` = gõ sai hoa thường; than về `Welcome/java` = dính lỗi số 2.

---

## Note: từ Java 11 — chạy tắt 1 file được

> *"As of Java 11, you can skip the javac command if you have a single source file... Once your programs get more complex, you need to use javac."*

```bash
java Welcome.java     # Java 11+: compile NGẦM trong RAM rồi chạy luôn — không tạo .class
```

Trải nghiệm giống `node app.js`! Nhưng chỉ cho **1 file đơn** — dành cho script/bài tập. Dự án thật nhiều file vẫn phải `javac`. (Trớ trêu: lệnh "sai kinh điển" ở mục 2 giờ lại... chạy được trên Java 11+ 😄 — nhưng nên hiểu rõ mình đang dùng chế độ nào.)

---

## Demo thứ 2 — ImageViewer (GUI)

Sách cho chạy thêm app **có cửa sổ đồ hoạ** (chọn File → Open xem ảnh) để thấy Java làm được nhiều hơn in chữ:

```bash
cd corejava/v1ch02/ImageViewer
javac ImageViewer.java
java ImageViewer          # → cửa sổ desktop app hiện lên!
```

> *"...it is not too complex if you consider how much code it would take in C or C++ to write a similar application. Of course, nowadays it is not common to write desktop applications with graphical user interfaces."*

**Dịch:** So với C/C++ thì đoạn code này ngắn đáng kinh ngạc (nhờ thư viện Swing có sẵn — đúng luận điểm "vast library" bài 01). Nhưng Horstmann thừa nhận: **thời nay chẳng ai viết desktop GUI nữa** — chỉ demo cho vui, ai thích thì đọc Vol II Ch10.

(Điểm nhìn của bạn: "GUI của thời nay" chính là web — phần đó JS lo; Java lo phần server như đã học.)

---

## Tóm tắt section 2.2

> 2 lệnh nghi thức: **`javac Tên.java`** (compile → sinh `.class`) rồi **`java Tên`** (JVM chạy bytecode — chú ý **không** đuôi). Sai hoa thường, nhầm đuôi, PATH hỏng, Notepad thêm `.txt` — là 4 cú ngã kinh điển. Java 11+ chạy tắt được 1 file đơn kiểu `node app.js`. Tự tay làm để hiểu IDE bấm Run là làm gì sau lưng.

---

## Bài kế tiếp

→ [[03 - Using an Integrated Development Environment]] — cài IDE thật (Eclipse/IntelliJ), tạo project, và hiểu nút Run = javac + java đóng gói lại.
