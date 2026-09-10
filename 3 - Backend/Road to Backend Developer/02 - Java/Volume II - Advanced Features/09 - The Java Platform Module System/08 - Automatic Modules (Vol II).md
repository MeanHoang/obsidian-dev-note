# 08 — Automatic Modules

> Chapter 9, Section 9.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 9.8 Automatic Modules

### Vấn đề: thư viện bên thứ ba chưa modular hoá

> *"You now know to put the Java Platform Module System to use. If you start with a brand-new project in which you write all the code yourself, you can design modules, declare module dependencies, and package your application into modular JAR files."*

**Dịch:** Giờ bạn đã biết dùng Java Platform Module System. Nếu **bắt đầu một project hoàn toàn mới mà bạn tự viết toàn bộ code**, bạn **thiết kế module, khai báo dependency, và đóng gói ứng dụng vào modular JAR** được.

> *"However, that is an extremely uncommon scenario. Almost all projects rely on third-party libraries. Of course, you can wait until the providers of all libraries have turned them into modules, and then modularize your own code. But what if you don't want to wait? The Java Platform Module System provides two mechanisms for crossing the chasm that separates today's premodular world and fully modular applications: automatic modules and the unnamed module."*

**Dịch:** Nhưng đó là kịch bản **cực kỳ hiếm**. **Gần như mọi project đều dựa vào thư viện bên thứ ba.** Dĩ nhiên bạn có thể **chờ tới khi mọi nhà cung cấp thư viện biến chúng thành module** rồi mới modular hoá code của mình. Nhưng nếu **không muốn chờ**? Java Platform Module System cung cấp **hai cơ chế bắc qua vực ngăn cách thế giới tiền-module hôm nay với ứng dụng modular hoàn toàn**: **automatic module** và **unnamed module**.

### Định nghĩa automatic module

> *"For migration purposes, you can turn any JAR file into a module simply by placing it onto a directory in the module path instead of the class path. A JAR without a module-info.class on the module path is called an automatic module."*

**Dịch:** Vì mục đích **migration**, bạn **biến bất kỳ file JAR nào thành module** chỉ bằng cách **đặt nó vào một thư mục trên module path thay vì class path**. Một JAR **không có `module-info.class`** mà nằm **trên module path** thì gọi là **automatic module**.

### Bốn tính chất của automatic module

> *"An automatic module has the following properties:"*
>
> 1. *"The module implicitly has a requires clause for all other modules."*
> 2. *"All of its packages are exported and opened."*
> 3. *"If there is an entry with key Automatic-Module-Name in the JAR file manifest META-INF/MANIFEST.MF, its value becomes the module name."*
> 4. *"Otherwise the module name is obtained from the JAR file name, dropping any trailing version number and replacing sequences of non-alphanumeric characters with a dot."*

**Dịch:**

| # | Tính chất |
|---|---|
| 1 | Module **ngầm có mệnh đề `requires` tới mọi module khác** |
| 2 | **Mọi package của nó đều được exported và opened** |
| 3 | Nếu manifest `META-INF/MANIFEST.MF` có entry khoá **`Automatic-Module-Name`** thì **giá trị của nó thành tên module** |
| 4 | Nếu không, **tên module lấy từ tên file JAR**: **bỏ số version ở đuôi** và **thay các chuỗi ký tự không phải chữ-số bằng dấu chấm** |

> *"The first two rules imply that the packages in the automatic module act as if they were on the class path. The reason for using the module path is for the benefit of other modules, allowing them to express dependencies on this module."*

**Dịch:** Hai quy tắc đầu hàm ý rằng package trong automatic module **hành xử như thể chúng nằm trên class path**. Lý do đặt lên module path là **vì lợi ích của các module khác**, cho phép chúng **khai báo được dependency lên module này**.

### Ví dụ Apache Commons CSV

> *"Suppose, for example, that you are implementing a module that processes CSV files and uses the Apache Commons CSV library. You would like to express in your module-info.java file that your module depends on Apache Commons CSV."*

**Dịch:** Giả sử bạn implement một module **xử lý file CSV** và dùng thư viện **Apache Commons CSV**. Bạn muốn **ghi trong `module-info.java` rằng module của mình phụ thuộc Apache Commons CSV**.

> *"If you add commons-csv-1.5.jar onto the module path, then your modules can reference the module. Its name is commons.csv since the trailing version number -1.5 is removed and the non-alphanumeric character - is replaced by a dot."*

**Dịch:** Nếu thêm `commons-csv-1.5.jar` vào module path thì module của bạn **tham chiếu tới nó được**. Tên của nó là **`commons.csv`**, vì **số version đuôi `-1.5` bị bỏ** và **ký tự không phải chữ-số `-` được thay bằng dấu chấm**.

> *"This name might be an acceptable module name because Commons CSV is well known and it is unlikely that someone else will try to use the same name for a different module. But it would be better if the maintainers of this JAR file could quickly agree to reserve a reverse DNS name, preferably the top-level package name org.apache.commons.csv, as the module name. They just need to add a line"*

```
Automatic-Module-Name: org.apache.commons.csv
```

> *"to the META-INF/MANIFEST.MF file inside the JAR. Eventually, hopefully, they will turn the JAR file into a true module by adding module-info.java with the reserved module name—and every other module that refers to the CSV module with that name will just continue to work."*

**Dịch:** Cái tên này **có thể chấp nhận được** vì Commons CSV **nổi tiếng** và **khó ai dùng trùng tên cho module khác**. Nhưng **tốt hơn** là những người bảo trì JAR này **nhanh chóng thống nhất giữ chỗ một tên reverse DNS**, tốt nhất là **tên top-level package `org.apache.commons.csv`**, làm tên module. Họ chỉ cần **thêm một dòng `Automatic-Module-Name`** vào file `META-INF/MANIFEST.MF` bên trong JAR. Rồi hy vọng cuối cùng họ sẽ **biến JAR thành module thật** bằng cách thêm `module-info.java` với **tên module đã giữ chỗ** — và **mọi module khác tham chiếu tới module CSV bằng tên đó vẫn tiếp tục chạy bình thường**.

> **Note (sách):** *"The migration plan to modules is a great social experiment, and nobody knows whether it will end well. Before you put third-party JARs on the module path, check whether they are modular, and if not, whether their manifest has a module name. If not, you can still turn the JAR into an automatic module, but be prepared to update the module name later."*
>
> **Dịch:** Kế hoạch migration sang module là **một thí nghiệm xã hội lớn**, và **chẳng ai biết nó sẽ kết thúc tốt đẹp hay không**. Trước khi đặt JAR bên thứ ba lên module path, **kiểm tra xem chúng đã modular chưa**, nếu chưa thì **manifest có tên module không**. Nếu không có, bạn **vẫn biến JAR thành automatic module được**, nhưng **hãy chuẩn bị tinh thần cập nhật lại tên module về sau**.

### Listing 9.x — `v2ch09.automod/com/horstmann/places/CSVDemo.java`

> *"As this book is being written, version 1.5 of the Commons CSV JAR file does not have a module descriptor or an automatic module name. Nevertheless, it will work fine on the module path. You can download the library from https://commons.apache.org/proper/commons-csv. Uncompress and place the commons-csv-1.5.jar file into the directory of the v2ch9.automod module. That module contains a simple program that reads a CSV file with country data:"*

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

**Dịch:** Lúc sách được viết, JAR Commons CSV bản 1.5 **không có module descriptor cũng không có automatic module name**. Dù vậy nó **vẫn chạy tốt trên module path**.

### Listing 9.x — `v2ch09.automod/module-info.java`

> *"Since we will use commons-csv-1.5.jar as an automatic module, we need to require it:"*

```java
@SuppressWarnings("module")
module v2ch09.automod
{
    requires commons.csv;
}
```

> *"Here are the commands for compiling and running the program:"*

```bash
javac -p v2ch09.automod:commons-csv-1.5.jar \
  v2ch09.automod/com/horstmann/places/CSVDemo.java \
  v2ch09.automod/module-info.java

java -p v2ch09.automod:commons-csv-1.5.jar \
  -m v2ch09.automod/com.horstmann.places.CSVDemo
```

---

## Bài kế tiếp

→ [[09 - The Unnamed Module (Vol II)]] — mọi class không nằm trên module path, và vì sao migration phải đi từ dưới lên.
