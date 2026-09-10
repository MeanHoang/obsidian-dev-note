# 06 — Input and Output

> Chapter 3, Section 3.7 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.7. Input and Output

> *"To make our example programs more interesting, we want to accept input and properly format the program output. Of course, modern programs use a GUI for collecting user input. However, programming such an interface requires more tools and techniques than we have at our disposal at this time. Our first order of business is to become more familiar with the Java programming language, so we use the humble console for input and output."*

**Dịch:** Để chương trình ví dụ thú vị hơn, ta muốn **nhận input** và **định dạng output** cho đúng. Tất nhiên chương trình hiện đại dùng GUI để thu thập input của người dùng. Nhưng lập trình một giao diện như vậy đòi hỏi nhiều công cụ và kỹ thuật hơn những gì ta đang có trong tay. Việc trước mắt là **làm quen hơn với ngôn ngữ Java**, nên ta dùng **console khiêm tốn** cho input và output.

---

## 3.7.1. Reading Input

> *"You saw that it is easy to print output to the "standard output stream" (that is, the console window) just by calling System.out.println. Reading from the "standard input stream" System.in isn't quite as simple. To read console input, you first construct a Scanner that is attached to System.in:"*

```java
Scanner in = new Scanner(System.in);
```

> *"(Constructors and the new operator are discussed in detail in Chapter 4.)"*

**Dịch:** In output ra **"standard output stream"** (tức cửa sổ console) thì dễ, chỉ cần gọi `System.out.println`. Đọc từ **"standard input stream"** `System.in` thì **không đơn giản bằng**. Muốn đọc input từ console thì trước hết **dựng một `Scanner` gắn vào `System.in`**. Constructor và toán tử `new` được bàn chi tiết ở [[03 - Defining Your Own Classes|Chapter 4]].

> *"Now you can use the various methods of the Scanner class to read input. For example, the nextLine method reads a line of input."*

```java
System.out.print("What is your name? ");
String name = in.nextLine();
```

> *"Here, we use the nextLine method because the input might contain spaces. To read a single word (delimited by whitespace), call"*

```java
String firstName = in.next();
```

> *"To read an integer, use the nextInt method."*

```java
System.out.print("How old are you? ");
int age = in.nextInt();
```

> *"Similarly, the nextDouble method reads the next floating-point number."*

**Dịch:** Dùng các method của class `Scanner` để đọc input. Method **`nextLine`** đọc **một dòng** input — dùng nó vì input **có thể chứa khoảng trắng**. Đọc **một từ đơn** (ngăn cách bởi whitespace) thì gọi **`next`**. Đọc **số nguyên** thì dùng **`nextInt`**. Tương tự, **`nextDouble`** đọc số thực tiếp theo.

> *"The program in Listing 3.2 asks for the user's name and age and then prints a message like"*

```
Hello, Cay. Next year, you'll be 65.
```

> *"Finally, note the line"*

```java
import java.util.*;
```

> *"at the beginning of the program. The Scanner class is defined in the java.util package. Whenever you use a class that is not defined in the basic java.lang package, you need to use an import directive. Packages and import directives are covered in more detail in Chapter 4."*

**Dịch:** Chú ý dòng `import` ở **đầu chương trình**. Class `Scanner` được định nghĩa trong package **`java.util`**. Mỗi khi dùng một class **không được định nghĩa trong package cơ bản `java.lang`**, bạn cần dùng **directive `import`**. Package và directive `import` được bàn kỹ hơn ở [[08 - Packages|Chapter 4]].

> **Caution (sách):** *"You may run into trouble if you run this program from a terminal (by calling java InputTest), and you use Windows, and your name contains characters other than the 26 Roman upper- and lowercase characters (such as Bérengère or Ὀδυσσεύς). By default, Windows terminals use an archaic character encoding for System.out, but not for the Scanner. The result is garbled output. To fix this, switch the terminal to the UTF-8 encoding, by issuing the following terminal command prior to running the program:"*
>
> ```
> chcp 65001
> ```
>
> *"Then, if you use Java 18 or above, all will be well. With older versions of Java, run the program as:"*
>
> ```
> java -Dfile.encoding=utf-8 InputTest
> ```
>
> *"If you use a development environment, you should not have to worry about this issue."*
>
> **Dịch:** Bạn có thể gặp rắc rối nếu chạy chương trình này **từ terminal** (bằng `java InputTest`), **trên Windows**, và tên bạn **chứa ký tự ngoài 26 chữ cái La Mã** hoa thường (như `Bérengère` hay `Ὀδυσσεύς`). Mặc định, terminal Windows dùng một **character encoding cổ lỗ cho `System.out`**, nhưng **không** dùng cho `Scanner`. Kết quả là **output bị lỗi ký tự**. Sửa bằng cách **chuyển terminal sang encoding UTF-8** với lệnh `chcp 65001` **trước khi** chạy chương trình. Sau đó, nếu dùng **Java 18 trở lên** thì mọi thứ ổn; với phiên bản Java cũ hơn thì chạy kèm cờ `-Dfile.encoding=utf-8`. Dùng môi trường phát triển thì **khỏi phải bận tâm** chuyện này.

### Listing 3.2 — `InputTest/InputTest.java`

```java
import java.util.*;

/**
 * This program demonstrates console input.
 * @version 1.11 2023-08-26
 * @author Cay Horstmann
 */
public class InputTest
{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        // get first input
        System.out.print("What is your name? ");
        String name = in.nextLine();

        // get second input
        System.out.print("How old are you? ");
        int age = in.nextInt();

        // display output on console
        System.out.println("Hello, " + name + ". Next year, you'll be " + (age + 1) + ".");
    }
}
```

> **Note (sách):** *"The Scanner class is not suitable for reading a password from a console since the input is plainly visible to anyone. Use the readPassword method of the Console class to read a password while hiding the user input:"*
>
> ```java
> Console cons = System.console();
> String username = cons.readLine("User name: ");
> char[] passwd = cons.readPassword("Password: ");
> . . .
> Arrays.fill(passwd, '*');
> ```
>
> *"For security reasons, the password is returned in an array of characters rather than a string. After you are done processing the password, you should immediately overwrite the array elements with a filler value."*
>
> *"Input processing with a Console object is not as convenient as with a Scanner. You must read the input a line at a time. There are no methods for reading individual words or numbers."*
>
> **Dịch:** Class `Scanner` **không phù hợp để đọc password** từ console vì input **hiện rõ cho bất kỳ ai nhìn thấy**. Dùng method **`readPassword`** của class **`Console`** để đọc password **mà giấu input của người dùng**.
>
> Vì **lý do bảo mật**, password được trả về trong **một mảng ký tự chứ không phải một string**. Xử lý xong password thì **lập tức ghi đè các phần tử mảng bằng một giá trị độn**.
>
> Xử lý input bằng object `Console` **không tiện bằng `Scanner`**: phải đọc input **từng dòng một**, **không có method** để đọc riêng từng từ hay từng số.

---

## API — `java.util.Scanner` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Scanner(InputStream in)` | dựng object `Scanner` từ input stream cho trước |
| `String nextLine()` | đọc **dòng** input tiếp theo |
| `String next()` | đọc **từ** tiếp theo của input (ngăn cách bởi whitespace) |
| `int nextInt()`<br>`double nextDouble()` | đọc và chuyển đổi **chuỗi ký tự tiếp theo** biểu diễn một số nguyên hoặc số thực |
| `boolean hasNext()` | kiểm tra xem trong input **còn từ nào nữa không** |
| `boolean hasNextInt()`<br>`boolean hasNextDouble()` | kiểm tra xem chuỗi ký tự tiếp theo **có biểu diễn** một số nguyên hoặc số thực không |

## API — `java.lang.System` (Java 1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Console console()` *(Java 6)* | trả về object `Console` để tương tác với người dùng qua cửa sổ console **nếu tương tác đó khả thi**, ngược lại trả về `null`. Object `Console` **luôn có** với chương trình được khởi động trong cửa sổ console; ngoài ra thì **tuỳ hệ thống** |

## API — `java.io.Console` (Java 6)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `char[] readPassword(String prompt, Object... args)`<br>`String readLine(String prompt, Object... args)` | hiển thị prompt rồi đọc input của người dùng **cho tới hết dòng input**. Parameter `args` tuỳ chọn dùng để **cấp các argument định dạng**, như mô tả ở section kế tiếp |

---

## 3.7.2. Formatting Output

> *"You can print a number x to the console with the statement System.out.print(x). That command will print x with the maximum number of nonzero digits for that type. For example,"*

```java
double x = 10000.0 / 3.0;
System.out.print(x);
```

> *"prints"*

```
3333.3333333333335
```

> *"That is a problem if you want to display, for example, dollars and cents. The remedy is the printf method, which follows the venerable conventions from the C library. For example, the call"*

```java
System.out.printf("%8.2f", x);
```

> *"prints x with a field width of 8 characters and a precision of 2 characters. That is, the printout contains a leading space and the seven characters"*

```
 3333.33
```

**Dịch:** Lệnh `System.out.print(x)` in `x` với **số chữ số khác 0 tối đa** cho kiểu đó. Đó là **vấn đề** khi bạn muốn hiển thị, ví dụ, **đô la và xu**. Cách chữa là method **`printf`**, tuân theo các quy ước **lâu đời của thư viện C**. Lời gọi `"%8.2f"` in `x` với **độ rộng trường là 8 ký tự** và **độ chính xác 2 ký tự** — tức phần in ra gồm **một khoảng trắng đứng đầu** và bảy ký tự.

> *"You can supply multiple arguments to printf. For example:"*

```java
System.out.printf("Hello, %s. Next year, you'll be %d.", name, age + 1);
```

> *"Each of the format specifiers that start with a % character is replaced with the corresponding argument. The conversion character that ends a format specifier indicates the type of the value to be formatted: f is a floating-point number, s a string, and d a decimal integer. Table 3.6 shows all conversion characters."*

> *"The uppercase variants produce uppercase letters. For example, "%8.2E" formats 3333.33 as 3.33E+03, with an uppercase E."*

**Dịch:** Đưa được **nhiều argument** vào `printf`. Mỗi **format specifier** bắt đầu bằng ký tự **`%`** được thay bằng **argument tương ứng**. **Conversion character** kết thúc format specifier cho biết **kiểu của giá trị cần định dạng**: `f` là số thực, `s` là string, `d` là số nguyên hệ mười.

Các **biến thể viết hoa cho ra chữ hoa**: `"%8.2E"` định dạng `3333.33` thành `3.33E+03` với chữ `E` hoa.

### Table 3.6: Conversions for printf

| Conversion Character | Type | Example |
|---|---|---|
| `d` | Decimal integer | `159` |
| `x` hoặc `X` | Hexadecimal integer. Muốn kiểm soát định dạng hex kỹ hơn thì dùng class `HexFormat` | `9f` |
| `o` | Octal integer | `237` |
| `f` hoặc `F` | Fixed-point floating-point | `15.9` |
| `e` hoặc `E` | Exponential floating-point | `1.59e+01` |
| `g` hoặc `G` | General floating-point (cái nào **ngắn hơn** giữa `e` và `f`) | — |
| `a` hoặc `A` | Hexadecimal floating-point | `0x1.fccdp3` |
| `s` hoặc `S` | String | `Hello` |
| `c` hoặc `C` | Character | `H` |
| `b` hoặc `B` | boolean | `true` |
| `h` hoặc `H` | Hash code | `42628b2` |
| `tx` hoặc `Tx` | Định dạng date/time **kiểu cũ**. Dùng các class `java.time` thay thế — xem Chapter 6 của Volume II | — |
| `%` | Ký hiệu phần trăm | `%` |
| `n` | Ký tự **xuống dòng phụ thuộc platform** | — |

> **Note (sách):** *"You can use the s conversion to format arbitrary objects. If an arbitrary object implements the Formattable interface, the object's formatTo method is invoked. Otherwise, the toString method is invoked to turn the object into a string. The toString method is discussed in Chapter 5 and interfaces in Chapter 6."*
>
> **Dịch:** Dùng conversion `s` để định dạng **object bất kỳ**. Nếu object đó **implement interface `Formattable`** thì method **`formatTo`** của nó được gọi. Ngược lại, method **`toString`** được gọi để biến object thành string. Method `toString` bàn ở **Chapter 5**, còn interface ở **Chapter 6**.

> *"In addition, you can specify flags that control the appearance of the formatted output. Table 3.7 shows all flags. For example, the comma flag adds group separators. That is,"*

```java
System.out.printf("%,.2f", 10000.0 / 3.0);
```

> *"prints"*

```
3,333.33
```

> *"You can use multiple flags, for example "%,(.2f" to use group separators and enclose negative numbers in parentheses."*

**Dịch:** Ngoài ra, chỉ định được các **flag** điều khiển **hình thức của output đã định dạng**. Ví dụ flag dấu phẩy **thêm dấu ngăn cách nhóm**. Dùng được **nhiều flag** cùng lúc, ví dụ `"%,(.2f"` để vừa dùng dấu ngăn cách nhóm vừa **bọc số âm trong ngoặc đơn**.

### Table 3.7: Flags for printf

| Flag | Purpose (dịch từ sách) | Example |
|---|---|---|
| `+` | In **dấu** cho cả số dương lẫn số âm | `+3333.33` |
| `space` | Thêm một **khoảng trắng trước số dương** | `\| 3333.33\|` |
| `0` | Thêm **số 0 đứng đầu** | `003333.33` |
| `-` | **Căn trái** trường | `\|3333.33 \|` |
| `(` | **Bọc số âm trong ngoặc đơn** | `(3333.33)` |
| `,` | Thêm **dấu ngăn cách nhóm** | `3,333.33` |
| `#` (với format `f`) | **Luôn có dấu thập phân** | `3,333.` |
| `#` (với format `x` hoặc `o`) | Thêm tiền tố `0x` hoặc `0` | `0xcafe` |
| `$` | Chỉ định **chỉ số của argument** cần định dạng. Ví dụ `%1$d %1$x` in argument thứ nhất ở dạng thập phân rồi thập lục phân | `159 9F` |
| `<` | Định dạng **cùng giá trị với specifier trước đó**. Ví dụ `%d %<x` in cùng một số ở dạng thập phân rồi thập lục phân | `159 9F` |

> *"You can use the static String.format method to create a formatted string without printing it:"*

```java
String message = String.format("Hello, %s. Next year, you'll be %d.", name, age + 1);
```

**Dịch:** Dùng static method **`String.format`** để **tạo ra chuỗi đã định dạng mà không in nó ra**.

> **Note (sách):** *"As of Java 15, you can use the formatted method instead, saving you five characters:"*
>
> ```java
> String message = "Hello, %s. Next year, you'll be %d.".formatted(name, age + 1);
> ```
>
> **Dịch:** **Từ Java 15**, dùng method **`formatted`** thay thế, **tiết kiệm được năm ký tự**.

> *"You have now seen all features of the printf method. Figure 3.6 shows a syntax diagram for format specifiers."*

**Figure 3.6: Format specifier syntax**

```
%  [argument_index$]  [flags]  [width]  [.precision]  conversion
   └── tuỳ chọn ──┘   └─ tc ─┘ └─ tc ─┘ └─── tc ───┘  └ bắt buộc ┘
```

> **Note (sách):** *"Formatting is locale-specific. For example, in Germany, the group separator is a period, not a comma. On a computer with a German locale, the call"*
>
> ```java
> double x = 10000.0 / 3.0;
> System.out.printf("%8.2f", x);
> ```
>
> *"yields the output"*
>
> ```
> 3333,33
> ```
>
> *"This locale-specific behavior is normally what you want when you communicate with users. However, if you produce a file that is later consumed by a computer program, you may need to choose a fixed locale for the output. Specify the locale as the first argument to printf:"*
>
> ```java
> System.out.printf(Locale.US, "%8.2f", x);
> ```
>
> **Dịch:** Việc định dạng **phụ thuộc locale**. Ví dụ ở Đức, dấu ngăn cách nhóm là **dấu chấm chứ không phải dấu phẩy** — trên máy có locale Đức, cùng lời gọi đó cho ra `3333,33`.
>
> Hành vi phụ thuộc locale này **thường là thứ bạn muốn** khi giao tiếp với người dùng. Nhưng nếu bạn **tạo ra một file để sau đó một chương trình máy tính đọc**, có thể bạn cần **chọn một locale cố định** cho output — chỉ định locale làm **argument đầu tiên** của `printf`.

---

## 3.7.3. File Input and Output

> *"To read from a file, construct a Scanner object like this:"*

```java
Scanner in = new Scanner(Path.of("myfile.txt"));
```

> *"If the file name contains backslashes, remember to escape each of them with an additional backslash: "c:\\mydirectory\\myfile.txt"."*

> *"Now you can read from the file, using any of the Scanner methods that you already encountered."*

**Dịch:** Muốn đọc từ file thì **dựng một object `Scanner`** như trên. Nếu tên file **chứa dấu gạch chéo ngược** thì nhớ **escape từng dấu bằng một dấu gạch chéo ngược nữa**. Sau đó đọc từ file bằng **bất kỳ method `Scanner` nào đã gặp**.

> **Note (sách):** *"Files store bytes, not Unicode characters. As you have seen in Section 3.3.4, there is more than one way of representing Unicode characters as bytes. By far the most commonly used character encoding is called UTF-8. In this book, all text files are assumed to use UTF-8. As of Java 18, this is the default encoding for all operations that read and write text. In older versions, the "default charset" of the computer running the Java program was used. That is not a good idea—the program might act differently depending on where it is run. If you use an older version of Java, always specify the character encoding:"*
>
> ```java
> Scanner in = new Scanner(Path.of("myfile.txt"), StandardCharsets.UTF_8);
> ```
>
> **Dịch:** File lưu **byte, không phải ký tự Unicode**. Như đã thấy ở [[02 - Data Types#3.3.3 + 3.3.4 The char Type & Unicode|Section 3.3.4]], có **nhiều hơn một cách** biểu diễn ký tự Unicode dưới dạng byte. Character encoding **được dùng phổ biến nhất cho tới nay là UTF-8**. Trong sách này, **mọi file text đều được giả định dùng UTF-8**. **Từ Java 18**, đây là **encoding mặc định** cho mọi thao tác đọc ghi text. Ở phiên bản cũ hơn, **"default charset" của máy đang chạy** chương trình Java được dùng — đó **không phải ý hay**, vì chương trình **có thể hành xử khác nhau tuỳ nơi nó chạy**. Dùng phiên bản Java cũ thì **luôn chỉ định character encoding**.

> **Caution (sách):** *"You can construct a Scanner with a string argument, but the scanner interprets the string as data, not a file name. For example, if you call"*
>
> ```java
> Scanner in = new Scanner("myfile.txt"); // ERROR?
> ```
>
> *"then the scanner will see ten characters of data: 'm', 'y', 'f', and so on. That is probably not what was intended in this case."*
>
> **Dịch:** Dựng được `Scanner` với **argument là string**, nhưng scanner **hiểu string đó là dữ liệu, không phải tên file**. Với lời gọi trên, scanner sẽ thấy **mười ký tự dữ liệu**: `'m'`, `'y'`, `'f'`, v.v. Đó **chắc không phải điều bạn định làm**.

> *"To write to a file, construct a PrintWriter object. In the constructor, supply the file name as a string:"*

```java
PrintWriter out = new PrintWriter("myfile.txt");
```

> *"If the file does not exist, it is created. You can use the print, println, and printf commands as you did when printing to System.out."*

**Dịch:** Muốn ghi ra file thì **dựng một object `PrintWriter`**, đưa **tên file dưới dạng string** vào constructor. **File chưa tồn tại thì nó được tạo ra**. Dùng các lệnh `print`, `println` và `printf` **y như khi in ra `System.out`**.

> **Note (sách):** *"When you specify a relative file name, such as "myfile.txt", "mydirectory/myfile.txt", or "../myfile.txt", the file is located relative to the directory in which the Java virtual machine was started. If you launched your program from a command shell, by executing"*
>
> ```
> java MyProg
> ```
>
> *"then the starting directory is the current directory of the command shell. However, if you use an integrated development environment, it controls the starting directory. You can find the directory location with this call:"*
>
> ```java
> String dir = System.getProperty("user.dir");
> ```
>
> *"If you run into grief with locating files, consider using absolute path names such as "c:\\mydirectory\\myfile.txt" or "/home/me/mydirectory/myfile.txt"."*
>
> **Dịch:** Khi chỉ định **tên file tương đối**, file được định vị **tương đối với thư mục nơi Java virtual machine được khởi động**. Khởi động chương trình từ command shell thì **thư mục khởi đầu là thư mục hiện tại của shell**. Nhưng nếu dùng IDE thì **IDE kiểm soát thư mục khởi đầu** — tìm vị trí thư mục đó bằng lời gọi `System.getProperty("user.dir")`. Nếu **khổ sở với chuyện định vị file** thì cân nhắc dùng **tên đường dẫn tuyệt đối**.

> **Note (sách):** *"Prior to Java 18, you had to set the character encoding explicitly to UTF-8:"*
>
> ```java
> PrintWriter out = new PrintWriter("myfile.txt", StandardCharsets.UTF_8);
> ```
>
> **Dịch:** **Trước Java 18**, bạn phải **đặt character encoding về UTF-8 một cách tường minh**.

### Ngoại lệ khi file không tồn tại

> *"As you saw, you can access files just as easily as you can use System.in and System.out. There is just one catch: If you construct a Scanner with a file that does not exist or a PrintWriter with a file name that cannot be created, an exception occurs. The Java compiler considers these exceptions to be more serious than a "divide by zero" exception, for example. In Chapter 7, you will learn various ways of handling exceptions. For now, you should simply tell the compiler that you are aware of the possibility of an "input/output" exception. You do this by tagging the main method with a throws clause, like this:"*

```java
public static void main(String[] args) throws IOException
{
    Scanner in = new Scanner(Path.of("myfile.txt"));
    . . .
}
```

**Dịch:** Truy cập file **dễ y như dùng `System.in` và `System.out`**. Chỉ có **một điều cần lưu ý**: nếu dựng `Scanner` với **một file không tồn tại**, hoặc `PrintWriter` với **tên file không tạo được**, thì **một exception xảy ra**. Java compiler coi những exception này là **nghiêm trọng hơn** exception kiểu "chia cho 0". Chapter 7 sẽ dạy nhiều cách xử lý exception. Còn bây giờ, **chỉ cần báo cho compiler biết rằng bạn ý thức được khả năng xảy ra exception "input/output"** — làm việc đó bằng cách **gắn mệnh đề `throws` vào method `main`**.

> *"You have now seen how to read and write files that contain textual data. For more advanced topics, such as dealing with different character encodings, processing binary data, reading directories, and writing zip files, turn to Chapter 2 of Volume II."*

**Dịch:** Các chủ đề nâng cao hơn — xử lý các character encoding khác nhau, xử lý dữ liệu nhị phân, đọc thư mục, ghi file zip — nằm ở **Chapter 2 của Volume II**.

> **Note (sách):** *"If you dislike the exception declaration, read from System.in and write to System.out, as in the preceding sections. Then launch your program from a command shell, using the redirection syntax of your shell:"*
>
> ```
> java MyProg < myfile.txt > output.txt
> ```
>
> **Dịch:** Nếu **không thích phần khai báo exception**, hãy đọc từ `System.in` và ghi ra `System.out` như các section trước, rồi **khởi động chương trình từ command shell** bằng **cú pháp chuyển hướng (redirection)** của shell.

---

## API — `java.util.Scanner` (Java 5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Scanner(Path p)` *(Java 7)*<br>`Scanner(Path p, Charset charset)` *(Java 10)* | dựng `Scanner` đọc dữ liệu từ **path cho trước**, dùng character encoding mặc định hoặc encoding được chỉ định |
| `Scanner(String data)` | dựng `Scanner` đọc dữ liệu **từ chính string đó** |

## API — `java.io.PrintWriter` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `PrintWriter(String fileName)`<br>`PrintWriter(String fileName, Charset charset)` *(Java 10)* | dựng `PrintWriter` ghi dữ liệu **ra file có tên cho trước**, dùng character encoding mặc định hoặc encoding được chỉ định |

## API — `java.nio.file.Path` (Java 7)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static Path of(String pathname)` *(Java 11)* | dựng một `Path` từ **tên đường dẫn cho trước** |

---

## Bài kế tiếp

→ [[07 - Control Flow]] — block scope, câu lệnh điều kiện, vòng lặp bất định và xác định, `switch`, và các câu lệnh phá vỡ luồng điều khiển.
