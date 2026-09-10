# 08 — Automatic Modules

> Chapter 12, Section 12.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.8. Automatic Modules

> *"You now know to put the Java Platform Module System to use. If you start with a brand-new project in which you write all the code yourself, you can design modules, declare module dependencies, and package your application into modular JAR files."*

**Dịch:** Giờ bạn đã biết cách dùng Java Platform Module System. Nếu bắt đầu một **project hoàn toàn mới** mà bạn tự viết toàn bộ code, bạn có thể thiết kế module, khai báo module dependency, và đóng gói application thành **modular JAR file**. → Xem [[06 - Modular JARs]].

> *"However, that is an extremely uncommon scenario. Almost all projects rely on third-party libraries. Of course, you can wait until the providers of all libraries have turned them into modules, and then modularize your own code."*

**Dịch:** Tuy nhiên, đó là **kịch bản cực kỳ hiếm gặp**. Gần như mọi project đều dựa vào **thư viện bên thứ ba**. Dĩ nhiên bạn có thể **chờ** cho tới khi tất cả nhà cung cấp thư viện biến chúng thành module, rồi mới modular hoá code của mình.

> *"But what if you don't want to wait? The Java Platform Module System provides two mechanisms for crossing the chasm that separates today's premodular world and fully modular applications: automatic modules and the unnamed module."*

**Dịch:** Nhưng nếu bạn **không muốn chờ**? Java Platform Module System cung cấp **hai cơ chế** để bắc cầu qua vực ngăn cách thế giới **tiền-module** hôm nay với **application modular hoàn toàn**: **automatic module** và **unnamed module**.

### Automatic module là gì

> *"For migration purposes, you can turn any JAR file into a module simply by placing it onto a directory in the module path instead of the class path. A JAR without a module-info.class on the module path is called an automatic module. An automatic module has the following properties:"*

**Dịch:** Vì mục đích **migration**, bạn có thể biến **bất kỳ file JAR nào** thành module chỉ bằng cách đặt nó vào một thư mục trên **module path** thay vì **class path**. Một JAR **không có `module-info.class`** nằm trên module path được gọi là **automatic module**. Automatic module có các tính chất sau:

> *"1. The module implicitly has a requires clause for all other modules.
> 2. All of its packages are exported and opened.
> 3. If there is an entry with key Automatic-Module-Name in the JAR file manifest META-INF/MANIFEST.MF, its value becomes the module name.
> 4. Otherwise the module name is obtained from the JAR file name, dropping any trailing version number and replacing sequences of nonalphanumeric characters with a dot."*

**Dịch:**

| # | Tính chất của automatic module |
|---|---|
| 1 | Module **ngầm có một mệnh đề `requires` tới mọi module khác** |
| 2 | **Toàn bộ package của nó được export và opened** |
| 3 | Nếu manifest `META-INF/MANIFEST.MF` của JAR có entry khoá **`Automatic-Module-Name`**, thì **giá trị của nó thành tên module** |
| 4 | Ngược lại, **tên module lấy từ tên file JAR**: bỏ **số version ở đuôi**, và thay các **chuỗi ký tự không phải chữ-số bằng dấu chấm** |

→ Xem thêm [[09 - JAR Files]] về manifest, và [[07 - Modules and Reflective Access]] về `opens`.

> *"The first two rules imply that the packages in the automatic module act as if they were on the class path. The reason for using the module path is for the benefit of other modules, allowing them to express dependencies on this module."*

**Dịch:** Hai quy tắc đầu ngụ ý rằng package trong automatic module **hành xử y như thể chúng nằm trên class path**. Lý do đặt lên module path là **vì lợi ích của các module khác** — để chúng **diễn đạt được dependency lên module này**.

### Ví dụ: Apache Commons CSV

> *"Suppose, for example, that you are implementing a module that processes CSV files and uses the Apache Commons CSV library. You would like to express in your module-info.java file that your module depends on Apache Commons CSV."*

**Dịch:** Giả sử bạn đang viết một module xử lý file CSV và dùng thư viện **Apache Commons CSV**. Bạn muốn ghi trong file `module-info.java` rằng module của mình **phụ thuộc vào Apache Commons CSV**.

> *"If you add commons-csv-1.9.0.jar onto the module path, then your modules can reference the module. Its name is commons.csv since the trailing version number -1.9.0 is removed and the non-alphanumeric character - is replaced by a dot."*

**Dịch:** Nếu bạn thêm `commons-csv-1.9.0.jar` vào module path, module của bạn **tham chiếu được tới module đó**. Tên của nó là **`commons.csv`** vì **số version đuôi `-1.9.0` bị bỏ đi** và **ký tự không phải chữ-số `-` được thay bằng dấu chấm**.

```
commons-csv-1.9.0.jar
      ↓ bỏ "-1.9.0"
commons-csv
      ↓ "-" → "."
commons.csv
```

> *"This name might be an acceptable module name because Commons CSV is well known and it is unlikely that someone else will try to use the same name for a different module. But it would be better if the maintainers of this JAR file could use a name that they control, preferably the top-level package name org.apache.commons.csv, as the module name. They just need to add a line"*

```
Automatic-Module-Name: org.apache.commons.csv
```

> *"to the META-INF/MANIFEST.MF file inside the JAR. In fact, they did just that with commons-csv-1.10.0.jar."*

**Dịch:** Tên này **có thể chấp nhận được** vì Commons CSV nổi tiếng và khó có ai dùng cùng tên đó cho một module khác. Nhưng sẽ **tốt hơn nếu người bảo trì file JAR dùng một cái tên do chính họ kiểm soát**, tốt nhất là **top-level package name** `org.apache.commons.csv`, làm tên module. Họ chỉ cần thêm một dòng vào file `META-INF/MANIFEST.MF` bên trong JAR. Thực tế họ **đã làm đúng như vậy** với `commons-csv-1.10.0.jar`. → Xem [[02 - Naming Modules]].

> *"Eventually, hopefully, they will turn the JAR file into a true module by adding module-info.java with that module name. Every other module that refers to the CSV module with that name will just continue to work."*

**Dịch:** Rồi hy vọng cuối cùng họ sẽ **biến file JAR thành module thực thụ** bằng cách thêm `module-info.java` với đúng tên module đó. Mọi module khác tham chiếu tới module CSV bằng tên ấy **vẫn tiếp tục chạy bình thường**.

> **Note (sách):** *"The migration plan to modules is a great social experiment, and nobody knows whether it will end well. Before you put third-party JARs on the module path, check whether they are modular, and if not, whether their manifest has a module name. If not, you can still turn the JAR into an automatic module, but be prepared to update the module name later."*
>
> **Dịch:** Kế hoạch migration sang module là **một thí nghiệm xã hội lớn**, và **chẳng ai biết nó có kết thúc tốt đẹp không**. Trước khi đặt JAR bên thứ ba lên module path, hãy **kiểm tra xem chúng đã modular chưa**, và nếu chưa thì **manifest có tên module không**. Nếu không có, bạn **vẫn biến JAR thành automatic module được**, nhưng hãy **sẵn sàng cập nhật tên module về sau**.

### Chương trình ví dụ

> *"To experiment with automatic JARs, download versions 1.9.0 and 1.10.0 of the Commons CSV library from https://commons.apache.org/proper/commons-csv. The v2ch9.automod module in the companion code contains a simple program that reads a CSV file with country data:"*

```java
package com.horstmann.places;

import java.io.*;
import org.apache.commons.csv.*;

public class CSVDemo
{
    public static void main(String[] args) throws IOException
    {
        var in = new FileReader("countries.csv");
        Iterable<CSVRecord> records = CSVFormat.EXCEL.withDelimiter(';')
            .withHeader().parse(in);
        for (CSVRecord record : records)
        {
            String name = record.get("Name");
            double area = Double.parseDouble(record.get("Area"));
            System.out.println(name + " has area " + area);
        }
    }
}
```

**Dịch:** Để thử nghiệm với automatic JAR, tải **version 1.9.0 và 1.10.0** của thư viện Commons CSV. Module `v2ch9.automod` trong companion code chứa một chương trình đơn giản **đọc file CSV dữ liệu quốc gia**.

> *"To use commons-csv-1.9.0.jar as an automatic module, we need to require it using its file name:"*

```java
@SuppressWarnings("module")
module v1ch12.automod
{
    requires commons.csv;
}
```

**Dịch:** Để dùng `commons-csv-1.9.0.jar` làm automatic module, ta phải `requires` nó **bằng tên file**. → Xem [[01 - Using Annotations]] về `@SuppressWarnings`.

> *"For commons-csv-1.10.0.jar, use the Automatic-Module-Name from the manifest:"*

```java
requires org.apache.commons.csv
```

**Dịch:** Còn với `commons-csv-1.10.0.jar`, dùng **`Automatic-Module-Name` lấy từ manifest**.

> *"Here are the commands for compiling and running the program:"*

```bash
javac -p v1ch12.automod:commons-csv-1.10.0.jar \
  v1ch12.automod/com/horstmann/places/CSVDemo.java \
  v1ch12.automod/module-info.java

java -p v1ch12.automod:commons-csv-1.10.0.jar \
  -m v1ch12.automod/com.horstmann.places.CSVDemo
```

**Dịch:** Đây là các lệnh **biên dịch và chạy** chương trình.

---

## Bài kế tiếp

→ [[09 - The Unnamed Module]] — cơ chế thứ hai để bắc cầu migration: mọi class không nằm trên module path đều thuộc unnamed module.
