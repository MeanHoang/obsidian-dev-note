# 08 — Packages

> Chapter 4, Section 4.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.8. Packages

> *"Java allows you to group classes in a collection called a package. Packages are convenient for organizing your work and for separating your work from code libraries provided by others. In the following sections, you will learn how to use and create packages."*

**Dịch:** Java cho phép gom các class vào một tập hợp gọi là **package**. Package tiện để **tổ chức công việc** và **tách công việc của bạn khỏi các thư viện code của người khác**.

---

## 4.8.1. Package Names

> *"The main reason for using packages is to guarantee the uniqueness of class names. Suppose two programmers come up with the bright idea of supplying an Employee class. As long as both of them place their class into different packages, there is no conflict. In fact, to absolutely guarantee a unique package name, use an Internet domain name (which is known to be unique) written in reverse. You then use subpackages for different projects. For example, consider the domain horstmann.com. When written in reverse order, it turns into the package name com.horstmann. You can then append a project name, such as com.horstmann.corejava. If you then place the Employee class into that package, the "fully qualified" name becomes com.horstmann.corejava.Employee."*

**Dịch:** **Lý do chính** dùng package là để **đảm bảo tên class là duy nhất**. Giả sử hai lập trình viên cùng nảy ra ý tưởng viết class `Employee`. Chừng nào cả hai đặt class của mình vào **package khác nhau** thì **không có xung đột**.

Muốn **chắc chắn tuyệt đối** tên package là duy nhất thì dùng **tên miền Internet viết ngược** (vốn đã là duy nhất), rồi thêm subpackage cho từng dự án.

```
horstmann.com                       ← domain
      │ viết ngược
      ▼
com.horstmann                       ← tên package
      │ + tên project
      ▼
com.horstmann.corejava
      │ + tên class
      ▼
com.horstmann.corejava.Employee     ← "fully qualified" name
```

> **Note (sách):** *"From the point of view of the compiler, there is absolutely no relationship between nested packages. For example, the packages java.util and java.util.jar have nothing to do with each other. Each is its own independent collection of classes."*
>
> **Dịch:** Đứng từ góc nhìn compiler, **hoàn toàn không có quan hệ nào giữa các package lồng nhau**. Ví dụ `java.util` và `java.util.jar` **chả liên quan gì tới nhau**. Mỗi cái là **một tập hợp class độc lập của riêng nó**.

---

## 4.8.2. Class Importation

> *"A class can use all classes from its own package and all public classes from other packages."*

**Dịch:** Một class dùng được **mọi class trong package của chính nó**, và **mọi class `public` từ package khác**.

> *"You can access the public classes in another package in two ways. The first is simply to use the fully qualified name; that is, the package name followed by the class name. For example:"*

```java
java.time.LocalDate today = java.time.LocalDate.now();
```

> *"That is obviously tedious. A simpler, and more common, approach is to use the import statement. The point of the import statement is to give you a shorthand to refer to the classes in the package. Once you add an import, you no longer have to give the classes their full names."*

**Dịch:** Cách một: dùng **fully qualified name** — tên package rồi tới tên class. Rõ ràng là **rườm rà**. Cách đơn giản và phổ biến hơn là dùng câu lệnh **`import`**. Điểm của `import` là cho bạn **cách viết tắt** để tham chiếu tới class trong package.

> *"You can import a specific class or the whole package. You place import statements at the top of your source files (but below any package statements). For example, you can import all classes in the java.time package with the statement"*

```java
import java.time.*;
```

> *"Then you can use"*

```java
LocalDate today = LocalDate.now();
```

> *"without a package prefix. You can also import a specific class inside a package:"*

```java
import java.time.LocalDate;
```

**Dịch:** Import được **một class cụ thể** hoặc **cả package**. Đặt câu lệnh `import` **ở đầu file nguồn**, nhưng **bên dưới câu lệnh `package`** nếu có.

```
package com.horstmann.corejava;   ← package statement (nếu có), đứng ĐẦU TIÊN
import java.time.*;               ← import statement, đứng SAU package
public class Employee { ... }
```

> *"The java.time.* syntax is less tedious. It has no negative effect on code size. However, if you import classes explicitly, the reader of your code knows exactly which classes you use."*

**Dịch:** Cú pháp `java.time.*` **đỡ rườm rà hơn** và **không ảnh hưởng xấu tới kích thước code**. Nhưng nếu import từng class tường minh thì **người đọc code biết chính xác bạn dùng class nào**.

> *"However, note that you can only use the * notation to import a single package. You cannot use import java.* or import java.*.* to import all packages with the java prefix."*

**Dịch:** Ký hiệu `*` **chỉ import được một package**. **Không** dùng được `import java.*` hay `import java.*.*` để import mọi package có tiền tố `java`.

> **Note (sách):** *"You never need to import classes from the java.lang package."*
>
> **Dịch:** **Không bao giờ cần import** class từ package `java.lang`.

> **Tip (sách):** *"Integrated development environments have commands to organize imports. Package statements such as import java.util.*; are automatically expanded into a list of specific imports such as"*
>
> ```java
> import java.util.ArrayList;
> import java.util.Date;
> ```
>
> *"Unused import statements are removed. This is an extremely convenient feature, and it is a good idea to find out how to accomplish it with your IDE."*
>
> **Dịch:** IDE có lệnh **organize imports**: tự bung `import java.util.*;` thành danh sách import cụ thể, và **xoá các import không dùng**. Rất tiện, nên tìm hiểu cách làm việc này trên IDE của bạn.

### Xung đột tên

> *"Most of the time, you just import the packages that you need, without worrying too much about them. The only time that you need to pay attention to packages is when you have a name conflict. For example, both the java.util and java.sql packages have a Date class. Suppose you write a program that imports both packages."*

```java
import java.util.*;
import java.sql.*;
```

> *"If you now use the Date class, you get a compile-time error:"*

```java
Date today; // ERROR--java.util.Date or java.sql.Date?
```

> *"The compiler cannot figure out which Date class you want. You can solve this problem by adding a specific import statement:"*

```java
import java.util.*;
import java.sql.*;
import java.util.Date;
```

> *"What if you really need both Date classes? Then use the full package name with every class name:"*

```java
var startTime = new java.util.Date();
var today = new java.sql.Date(. . .);
```

**Dịch:** Lúc **duy nhất** cần để ý tới package là khi có **xung đột tên**. Cả `java.util` lẫn `java.sql` đều có class `Date`. Import cả hai package rồi dùng `Date` thì **lỗi compile-time** vì compiler **không biết bạn muốn class `Date` nào**.

| Tình huống | Cách giải |
|---|---|
| chỉ cần **một** trong hai | thêm **import cụ thể** cho class đó |
| cần **cả hai** | dùng **full package name** ở mọi chỗ |

> *"Locating classes in packages is an activity of the compiler. The bytecodes in class files always use full package names to refer to other classes."*

**Dịch:** Việc **định vị class trong package là hoạt động của compiler**. Bytecode trong file class **luôn dùng full package name** để tham chiếu tới class khác.

> **C++ Note (sách):** *"C++ programmers sometimes confuse import with #include. The two have nothing in common. In C++, you must use #include to include the declarations of external features because the C++ compiler does not look inside any files except the one that it is compiling and its explicitly included header files. The Java compiler will happily look inside other files provided you tell it where to look."*
>
> *"In Java, you can entirely avoid the import mechanism by explicitly naming all classes, such as java.util.Date. In C++, you cannot avoid the #include directives."*
>
> *"The only benefit of the import statement is convenience."*
>
> **Dịch:** Dân C++ đôi khi nhầm `import` với `#include`. **Hai thứ chả liên quan gì nhau.** C++ **bắt buộc** dùng `#include` vì compiler C++ không nhìn vào file nào ngoài file đang compile và các header được include tường minh. Java compiler thì **sẵn sàng nhìn vào file khác** miễn bạn chỉ chỗ cho nó.
>
> Trong Java, bạn **hoàn toàn né được cơ chế `import`** bằng cách gọi tên đầy đủ mọi class. Trong C++ thì **không né được `#include`**. **Lợi ích duy nhất của `import` là sự tiện lợi.** Trong C++, thứ tương đương cơ chế package là **namespace**; `package` và `import` của Java tương ứng với `namespace` và `using` của C++.

---

## 4.8.3. Static Imports

> *"A form of the import statement permits the importing of static methods and fields, not just classes. For example, if you add the directive"*

```java
import static java.lang.System.*;
```

> *"to the top of your source file, then you can use the static methods and fields of the System class without the class name prefix:"*

```java
out.println("Goodbye, World!"); // i.e., System.out
exit(0);                        // i.e., System.exit
```

> *"You can also import a specific method or field:"*

```java
import static java.lang.System.out;
```

**Dịch:** Có một dạng của câu lệnh `import` cho phép import **static method và static field**, chứ không chỉ class. Sau khi import static, dùng được chúng **không cần tiền tố tên class**.

> *"In practice, it seems doubtful that many programmers will want to abbreviate System.out or System.exit. The resulting code seems less clear. On the other hand,"*

```java
sqrt(pow(x, 2) + pow(y, 2))
```

> *"seems much clearer than"*

```java
Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
```

**Dịch:** Thực tế thì **khó tin là nhiều lập trình viên muốn viết tắt `System.out` hay `System.exit`** — code kết quả trông **kém rõ ràng hơn**. Nhưng ngược lại, dạng viết tắt của `Math.sqrt`/`Math.pow` thì **rõ ràng hơn hẳn**.

> *"You can import enumerated constants:"*

```java
import java.time.DayOfWeek;
import static java.time.DayOfWeek.*;

DayOfWeek w = FRIDAY; // Same as DayOfWeek.FRIDAY
```

**Dịch:** Import được cả **hằng số enum**.

> **Preview Note (sách):** *"The STR interpolator is a preview feature of Java 21. It is used to form strings with embedded expressions, such as:"*
>
> ```java
> STR."Hello, \{name}! Next year, you'll be \{age + 1}."
> ```
>
> *"The identifier STR is always imported, as if there had been a statement:"*
>
> ```java
> import static java.lang.StringTemplate.STR;
> ```
>
> **Dịch:** **STR interpolator** là preview feature của **Java 21**, dùng để tạo chuỗi có **biểu thức nhúng bên trong**. Định danh `STR` **luôn được import sẵn**, như thể đã có câu lệnh import static ở trên.

---

## 4.8.4. Addition of a Class into a Package

> *"To place classes inside a package, put the name of the package at the top of your source file, before the code that defines the classes in the package. For example, the file Employee.java in Listing 4.8 starts out like this:"*

```java
package com.horstmann.corejava;

public class Employee
{
    . . .
}
```

**Dịch:** Muốn đặt class vào một package thì ghi **tên package ở đầu file nguồn**, trước phần code định nghĩa class.

> *"If you don't put a package statement in the source file, then the classes in that source file belong to the unnamed package. The unnamed package has no package name. Up to now, all our example classes were located in the unnamed package."*

**Dịch:** Không ghi câu lệnh `package` thì các class trong file đó thuộc về **unnamed package** — package **không có tên**. Từ đầu sách tới giờ, mọi class ví dụ đều nằm trong unnamed package.

> *"Place source files into a subdirectory that matches the full package name. For example, all source files in the com.horstmann.corejava package should be in a subdirectory com/horstmann/corejava (com\horstmann\corejava on Windows). The compiler places the class files into the same directory structure."*

**Dịch:** Đặt file nguồn vào **thư mục con khớp với full package name**. Compiler đặt file class vào **cùng cấu trúc thư mục đó**.

### Ví dụ có unnamed package

> *"Here is a sample program that is distributed over two packages: The PackageTest class belongs to the unnamed package—see Listing 4.7. The Employee class, shown in Listing 4.8, belongs to the com.horstmann.corejava package. Therefore, the Employee.java file must be in a subdirectory com/horstmann/corejava. In other words, the directory structure is as follows:"*

```
. (base directory)
├─ PackageTest.java
├─ PackageTest.class
└─ com/
   └─ horstmann/
      └─ corejava/
         ├─ Employee.java
         └─ Employee.class
```

> *"To compile this program, simply change to the base directory and run the command"*

```
javac PackageTest.java
```

> *"The compiler automatically finds the file com/horstmann/corejava/Employee.java and compiles it."*

**Dịch:** Compile thì **chuyển vào base directory** rồi chạy lệnh trên. Compiler **tự tìm thấy** file `com/horstmann/corejava/Employee.java` và compile nó.

> **Note (sách):** *"When you use an IDE or a build tool, the class files are typically placed in a separate directory tree."*
>
> **Dịch:** Khi dùng IDE hoặc build tool, file class thường được đặt vào **một cây thư mục riêng**.

### Ví dụ thực tế hơn — không dùng unnamed package

> *"Let's look at a more realistic example, in which we don't use the unnamed package but have classes distributed over several packages (com.horstmann.corejava and com.mycompany)."*

```
. (base directory)
└─ com/
   ├─ horstmann/
   │  └─ corejava/
   │     ├─ Employee.java
   │     └─ Employee.class
   └─ mycompany/
      ├─ PayrollApp.java
      └─ PayrollApp.class
```

> *"In this situation, you still must compile and run classes from the base directory—that is, the directory containing the com directory:"*

```
javac com/mycompany/PayrollApp.java
java com.mycompany.PayrollApp
```

> *"Note again that the compiler operates on files (with file separators and an extension .java), whereas the Java interpreter loads a class (with dot separators)."*

**Dịch:** Vẫn phải **compile và chạy từ base directory** — thư mục chứa thư mục `com`. Chú ý lần nữa:

| Công cụ | Thao tác trên | Ký hiệu ngăn cách | Đuôi file |
|---|---|---|---|
| **compiler** (`javac`) | **file** | dấu `/` | có `.java` |
| **interpreter** (`java`) | **class** | dấu `.` | không có |

> **Tip (sách):** *"Starting with the next chapter, we will use packages for the source code. That way, you can make an IDE project for each chapter instead of each section."*

> **Caution (sách):** *"The compiler does not check the directory structure when it compiles source files. For example, suppose you have a source file that starts with the directive"*
>
> ```java
> package com.mycompany;
> ```
>
> *"You can compile the file even if it is not contained in a subdirectory com/mycompany. The source file will compile without errors if it doesn't depend on other packages. However, the resulting program will not run unless you first move all class files to the right place. The virtual machine won't find the classes if the packages don't match the directories."*
>
> **Dịch:** **Compiler KHÔNG kiểm tra cấu trúc thư mục** khi compile file nguồn. File vẫn compile được dù không nằm trong thư mục con `com/mycompany`, miễn nó không phụ thuộc package khác. Nhưng **chương trình kết quả sẽ không chạy** trừ khi bạn chuyển mọi file class về đúng chỗ. **Virtual machine sẽ không tìm ra class nếu package không khớp thư mục.**

### Listing 4.7 — `PackageTest/PackageTest.java`

```java
import com.horstmann.corejava.*;
// the Employee class is defined in that package

import static java.lang.System.*;

/**
 * This program demonstrates the use of packages.
 * @version 1.11 2004-02-19
 * @author Cay Horstmann
 */
public class PackageTest
{
    public static void main(String[] args)
    {
        // because of the import statement, we don't have to use
        // com.horstmann.corejava.Employee here
        var harry = new Employee("Harry Hacker", 50000, 1989, 10, 1);

        harry.raiseSalary(5);

        // because of the static import statement, we don't have to use System.out here
        out.println("name=" + harry.getName() + ",salary=" + harry.getSalary());
    }
}
```

### Listing 4.8 — `PackageTest/com/horstmann/corejava/Employee.java`

```java
package com.horstmann.corejava;
// the classes in this file are part of this package

import java.time.*;
// import statements come after the package statement

/**
 * @version 1.11 2015-05-08
 * @author Cay Horstmann
 */
public class Employee
{
    private String name;
    private double salary;
    private LocalDate hireDay;

    public Employee(String name, double salary, int year, int month, int day)
    {
        this.name = name;
        this.salary = salary;
        hireDay = LocalDate.of(year, month, day);
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public LocalDate getHireDay()
    {
        return hireDay;
    }

    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }
}
```

---

## 4.8.5. Package Access

> *"You have already encountered the access modifiers public and private. Features tagged as public can be used by any class. Private features can be used only by the class that defines them. If you don't specify either public or private, the feature (that is, the class, method, or variable) can be accessed by all methods in the same package."*

**Dịch:** Không ghi `public` cũng không ghi `private` thì thành phần đó (class, method hoặc biến) **truy cập được bởi mọi method trong CÙNG package**.

| Modifier | Ai truy cập được |
|---|---|
| `public` | **mọi class** |
| `private` | **chỉ class định nghĩa nó** |
| *(không ghi gì)* | **mọi method trong cùng package** ← **package access** |

> *"Consider the program in Listing 4.2. The Employee class was not defined as a public class. Therefore, only the other classes (such as EmployeeTest) in the same package—the unnamed package in this case—can access it. For classes, this is a reasonable default. However, for variables, this was an unfortunate choice. Variables must explicitly be marked private, or they will default to having package access. This, of course, breaks encapsulation. The problem is that it is awfully easy to forget to type the private keyword."*

**Dịch:** Với **class** thì mặc định này **hợp lý**. Nhưng với **biến** thì đó là **lựa chọn đáng tiếc**: biến **phải được đánh dấu `private` tường minh**, không thì mặc định thành package access — và điều đó **phá vỡ encapsulation**. Vấn đề nằm ở chỗ **cực kỳ dễ quên gõ keyword `private`**.

### Ví dụ có thật trong JDK

> *"Here is an example from the Window class in the java.awt package, which is part of the source code supplied with the JDK:"*

```java
public class Window extends Container
{
    String warningString;
    . . .
}
```

> *"Note that the warningString variable is not private! That means the methods of all classes in the java.awt package can access this variable and set it to whatever they like (such as "Trust me!"). Actually, the only methods that access this variable are in the Window class, so it would have been entirely appropriate to make the variable private. Perhaps the programmer typed the code in a hurry and simply forgot the private modifier? Perhaps nobody cared? After more than twenty years, that variable is still not private. Not only that—new fields have been added to the class over time, and about half of them aren't private either."*

**Dịch:** Biến `warningString` **không phải `private`**. Nghĩa là method của **mọi class trong package `java.awt`** đọc và đặt được biến này thành bất cứ gì họ thích (kiểu `"Trust me!"`). Thực tế chỉ có method trong class `Window` truy cập biến này, nên **để `private` mới hoàn toàn hợp lý**. Có lẽ lập trình viên gõ vội rồi quên modifier `private`? Có lẽ chả ai quan tâm? **Sau hơn hai mươi năm, biến đó vẫn không phải `private`**. Chưa hết — nhiều field mới đã được thêm vào class theo thời gian, và **khoảng một nửa trong số đó cũng không `private`**.

### Package không phải thực thể đóng

> *"This can be a problem. By default, packages are not closed entities. That is, anyone can add more classes to a package. Of course, hostile or clueless programmers can then add code that modifies variables with package access. For example, in early versions of Java, it was an easy matter to smuggle another class into the java.awt package. Simply start out the class with"*

```java
package java.awt;
```

> *"Then, place the resulting class file inside a subdirectory java/awt somewhere on the class path, and you have gained access to the internals of the java.awt package. Through this subterfuge, it was possible to modify warning strings."*

**Dịch:** Đây có thể là vấn đề. Mặc định, **package không phải là thực thể đóng** — **bất kỳ ai cũng thêm class vào một package được**. Lập trình viên có ác ý hoặc thiếu hiểu biết có thể thêm code sửa các biến có package access. Ở các phiên bản Java đầu, việc **lén đưa một class vào package `java.awt`** là chuyện dễ: chỉ cần bắt đầu class bằng `package java.awt;` rồi đặt file class vào thư mục con `java/awt` nằm đâu đó trên class path.

> *"Starting with version 1.2, the JDK implementors rigged the class loader to explicitly disallow loading of user-defined classes whose package name starts with "java.". Of course, your own classes don't benefit from that protection. Another mechanism, now obsolete, lets a JAR file declare packages as sealed, preventing third parties from augmenting them. Nowadays, you should use modules to encapsulate packages. Modules are discussed in detail in Chapter 12."*

**Dịch:** Từ **phiên bản 1.2**, người viết JDK chỉnh class loader để **cấm tường minh việc load class do người dùng định nghĩa mà tên package bắt đầu bằng `"java."`**. Tất nhiên **class của riêng bạn không được bảo vệ như vậy**. Một cơ chế khác, nay đã lỗi thời, cho phép file JAR khai báo package là **sealed** để chặn bên thứ ba bổ sung vào. **Ngày nay nên dùng module để encapsulate package** — chi tiết ở Chapter 12.

---

## 4.8.6. The Class Path

> *"As you have seen, classes are stored in subdirectories of the file system. The path to the class must match the package name."*

> *"Class files can also be stored in a JAR (Java archive) file. A JAR file contains multiple class files and subdirectories in a compressed format, saving space and improving performance. When you use a third-party library in your programs, you will usually be given one or more JAR files to include."*

**Dịch:** Class được lưu trong thư mục con của file system, và **đường dẫn tới class phải khớp tên package**. File class cũng lưu được trong **file JAR** — chứa nhiều file class và thư mục con ở **định dạng nén**, tiết kiệm chỗ và cải thiện hiệu năng.

> **Tip (sách):** *"JAR files use the ZIP format to organize files and subdirectories. You can use any ZIP utility to peek inside JAR files."*
>
> **Dịch:** File JAR dùng **định dạng ZIP**. Dùng công cụ ZIP bất kỳ là **ngó vào bên trong file JAR** được.

### Ba bước để chia sẻ class giữa các chương trình

> *"To share classes among programs, you need to do the following:*
> 1. *Place your class files inside a directory—for example, /home/user/classdir. Note that this directory is the base directory for the package tree. If you add the class com.horstmann.corejava.Employee, then the Employee.class file must be located in the subdirectory /home/user/classdir/com/horstmann/corejava.*
> 2. *Place any JAR files inside a directory—for example, /home/user/archives.*
> 3. *Set the class path. The class path is the collection of all locations that can contain class files."*

**Dịch:**

1. Đặt file class vào một thư mục, ví dụ `/home/user/classdir`. Thư mục này là **base directory của cây package**.
2. Đặt các file JAR vào một thư mục, ví dụ `/home/user/archives`.
3. **Đặt class path.** Class path là **tập hợp mọi vị trí có thể chứa file class**.

> *"In UNIX, the elements on the class path are separated by colons:"*

```
/home/user/classdir:.:/home/user/archives/archive.jar
```

> *"In Windows, they are separated by semicolons:"*

```
c:\classdir;.;c:\archives\archive.jar
```

> *"In both cases, the period denotes the current directory."*

**Dịch:** UNIX ngăn cách bằng **dấu hai chấm `:`**, Windows bằng **dấu chấm phẩy `;`**. Cả hai trường hợp, **dấu chấm `.` chỉ thư mục hiện tại**.

> *"This class path contains*
> - *The base directory /home/user/classdir or c:\classdir;*
> - *The current directory (.); and*
> - *The JAR file /home/user/archives/archive.jar or c:\archives\archive.jar."*

> *"You can specify a wildcard for a JAR file directory, like this:"*

```
/home/user/classdir:.:/home/user/archives/'*'
```

> *"or"*

```
c:\classdir;.;c:\archives\*
```

> *"In UNIX, the * must be escaped to prevent shell expansion. All JAR files (but not .class files) in the archives directory are included in this class path."*

**Dịch:** Chỉ định **wildcard** cho một thư mục JAR được. Trên UNIX, **`*` phải được escape** để chặn shell bung nó ra. Mọi **file JAR** (nhưng **không phải file `.class`**) trong thư mục `archives` sẽ được đưa vào class path.

> *"The Java API is always searched for classes; don't include it explicitly in the class path."*

**Dịch:** **Java API luôn được tìm tới**, **đừng đưa nó vào class path tường minh**.

> **Caution (sách):** *"The javac compiler always looks for files in the current directory, but the java virtual machine launcher only looks into the current directory if the "." directory is on the class path. If you have no class path set, it's not a problem—the default class path consists of the "." directory. But if you have set the class path and forgot to include the "." directory, your programs will compile without error, but they won't run."*
>
> **Dịch:** `javac` **luôn** tìm file trong thư mục hiện tại, nhưng launcher `java` **chỉ** nhìn vào thư mục hiện tại **nếu thư mục `.` có trong class path**. Không set class path thì không sao, vì class path mặc định gồm thư mục `.`. Nhưng nếu bạn **đã set class path mà quên đưa `.` vào**, thì chương trình **compile không lỗi nhưng không chạy được**.

### VM tìm class như thế nào

> *"The class path lists all directories and archive files that are starting points for locating classes. Let's consider our sample class path:"*

```
/home/user/classdir:.:/home/user/archives/archive.jar
```

> *"Suppose the virtual machine searches for the class file of the com.horstmann.corejava.Employee class. It first looks in the Java API classes. It won't find the class file there, so it turns to the class path. It then looks for the following files:"*

```
/home/user/classdir/com/horstmann/corejava/Employee.class
com/horstmann/corejava/Employee.class  (bắt đầu từ thư mục hiện tại)
com/horstmann/corejava/Employee.class  (bên trong /home/user/archives/archive.jar)
```

**Dịch:** Class path liệt kê **mọi thư mục và file archive là điểm khởi đầu để định vị class**. VM **tìm trong class của Java API trước**, không thấy thì **chuyển sang class path** và lần lượt tìm ba chỗ trên.

### Compiler tìm khó hơn VM

> *"The compiler has a harder time locating files than does the virtual machine. If you refer to a class without specifying its package, the compiler first needs to find out the package that contains the class. It consults all import directives as possible sources for the class. For example, suppose the source file contains directives"*

```java
import java.util.*;
import com.horstmann.corejava.*;
```

> *"and the source code refers to a class Employee. The compiler then tries to find java.lang.Employee (because the java.lang package is always imported by default), java.util.Employee, com.horstmann.corejava.Employee, and Employee in the current package. It searches for each of these classes in all of the locations of the class path. It is a compile-time error if more than one class is found. (Fully qualified class names must be unique, so the order of the import statements doesn't matter.)"*

**Dịch:** Compiler **định vị file khó hơn VM**. Khi bạn tham chiếu tới một class mà không nêu package, compiler phải **tìm xem package nào chứa class đó**, bằng cách **tra mọi directive `import`**. Với ví dụ trên, compiler thử tìm:

```
java.lang.Employee                  ← vì java.lang luôn được import mặc định
java.util.Employee
com.horstmann.corejava.Employee
Employee                            ← trong package hiện tại
```

Nó tìm từng class trong **mọi vị trí của class path**. **Tìm ra nhiều hơn một class là lỗi compile-time.** Fully qualified class name phải là duy nhất, nên **thứ tự các câu lệnh `import` không quan trọng**.

> *"The compiler goes one step further. It looks at the source files to see if the source is newer than the class file. If so, the source file is recompiled automatically. Recall that you can import only public classes from other packages. A source file can only contain one public class, and the names of the file and the public class must match. Therefore, the compiler can easily locate source files for public classes. However, you can import nonpublic classes from the current package. These classes may be defined in source files with different names. If you import a class from the current package, the compiler searches all source files of the current package to see which one defines the class."*

**Dịch:** Compiler còn đi thêm một bước: **xem file nguồn có mới hơn file class không**, có thì **tự recompile**. Nhớ rằng chỉ import được **class `public`** từ package khác; một file nguồn chỉ chứa được một class public, và **tên file phải khớp tên class public** — nhờ vậy compiler dễ định vị file nguồn. Nhưng bạn **import được class không public từ package hiện tại**; những class đó có thể nằm trong file nguồn có tên khác, nên compiler phải **quét mọi file nguồn của package hiện tại** để xem file nào định nghĩa class đó.

---

## 4.8.7. Setting the Class Path

> *"IDEs and build tools have their own mechanisms for managing the class path. But it is a good idea to know how to set it by hand so you can troubleshoot any configuration issues."*

> *"It is best to specify the class path with the option -classpath (or -cp or the more modern variant, --class-path):"*

```
java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg
```

> *"or"*

```
java -classpath c:\classdir;.;c:\archives\archive.jar MyProg
```

> *"The entire command must be typed onto a single line. It is a good idea to place such a long command line into a shell script or a batch file."*

**Dịch:** IDE và build tool có cơ chế riêng để quản lý class path, nhưng **nên biết cách set thủ công** để còn xử lý sự cố cấu hình. **Cách tốt nhất** là dùng option `-classpath` (hoặc `-cp`, hoặc biến thể hiện đại hơn `--class-path`). **Toàn bộ lệnh phải gõ trên một dòng**, nên đặt lệnh dài như vậy vào **shell script hoặc batch file**.

> *"Using the -classpath option is the preferred approach for setting the class path. An alternate approach is the CLASSPATH environment variable. The details depend on your shell. With the Bourne Again shell (bash), use the command"*

```
export CLASSPATH=/home/user/classdir:.:/home/user/archives/archive.jar
```

> *"With the Windows shell, use"*

```
set CLASSPATH=c:\classdir;.;c:\archives\archive.jar
```

> *"The class path is set until the shell exits."*

**Dịch:** Cách thay thế là **biến môi trường `CLASSPATH`**. Class path được set **cho tới khi thoát shell**.

> **Caution (sách):** *"Some people recommend to set the CLASSPATH environment variable permanently. This is generally a bad idea. People forget the global setting, and are surprised when their classes are not loaded properly. A particularly reprehensible example was Apple's QuickTime installer in Windows. For several years, it globally set CLASSPATH to point to a JAR file it needed, but did not include the current directory in the classpath. As a result, countless Java programmers were driven to distraction when their programs compiled but failed to run."*
>
> **Dịch:** Một số người khuyên **set `CLASSPATH` vĩnh viễn**. Nói chung đó là **ý tồi**: người ta quên mất thiết lập global đó rồi ngạc nhiên khi class không được load đúng. Ví dụ đáng trách là **installer QuickTime của Apple trên Windows**: suốt nhiều năm nó set `CLASSPATH` global trỏ tới file JAR nó cần **mà không đưa thư mục hiện tại vào**. Kết quả là **vô số lập trình viên Java phát điên** khi chương trình compile được mà không chạy được.

> **Caution (sách):** *"In the past, some people recommended to bypass the class path altogether, by dropping all JAR files into the jre/lib/ext directory. That mechanism is obsolete with Java 9, but it was always bad advice. It was easy to get confused when long-forgotten classes were loaded from the extension directory."*
>
> **Dịch:** Trước đây có người khuyên **bỏ qua class path hoàn toàn** bằng cách ném mọi file JAR vào thư mục `jre/lib/ext`. Cơ chế đó **lỗi thời từ Java 9**, và **vốn dĩ luôn là lời khuyên tồi** — dễ rối khi những class bị quên lãng từ lâu lại được load từ thư mục extension.

> **Note (sách):** *"Classes can also be loaded from the module path. Modules and the module path are discussed in Chapter 12."*
>
> **Dịch:** Class cũng load được từ **module path**. Module và module path bàn ở Chapter 12.

---

## Bài kế tiếp

→ [[09 - JAR Files]] — công cụ `jar`, manifest, executable JAR, multi-release JAR, tuỳ chọn dòng lệnh.
