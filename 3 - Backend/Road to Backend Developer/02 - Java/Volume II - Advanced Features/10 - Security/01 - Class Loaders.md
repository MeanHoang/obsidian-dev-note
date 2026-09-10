# 01 — Class Loaders

> Chapter 10, Section 10.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.1. Class Loaders

> *"A Java compiler converts source instructions into code for the Java virtual machine. The virtual machine code is stored in a class file with a .class extension. Each class file contains the definition and implementation code for one class or interface. In the following section, you will see how the virtual machine loads these class files."*

**Dịch:** Java compiler chuyển lệnh nguồn thành code cho Java virtual machine. Code của virtual machine được lưu trong một **class file** đuôi `.class`. **Mỗi class file chứa phần định nghĩa và code implementation của đúng một class hoặc một interface.** Section sau cho thấy virtual machine load các class file này thế nào.

---

## 10.1.1. The Class-Loading Process

> *"The virtual machine loads only those class files that are needed for the execution of a program. For example, suppose program execution starts with MyProgram.class. Here are the steps that the virtual machine carries out:"*

**Dịch:** Virtual machine **chỉ load những class file cần cho việc chạy chương trình**. Giả sử chương trình bắt đầu bằng `MyProgram.class`, virtual machine làm các bước sau.

> *"1. The virtual machine has a mechanism for loading class files—for example, by reading the files from disk or by requesting them from the Web; it uses this mechanism to load the contents of the MyProgram class file."*

> *"2. If the MyProgram class has fields or superclasses of another class type, their class files are loaded as well. (The process of loading all the classes that a given class depends on is called resolving the class.)"*

> *"3. The virtual machine then executes the main method in MyProgram (which is static, so no instance of a class needs to be created)."*

> *"4. If the main method or a method that main calls requires additional classes, these are loaded next."*

**Dịch:**

| Bước | Nội dung |
|---|---|
| 1 | Virtual machine có cơ chế load class file — ví dụ đọc file từ disk hoặc yêu cầu từ Web; nó dùng cơ chế này để load nội dung của class file `MyProgram`. |
| 2 | Nếu class `MyProgram` có field hoặc superclass thuộc kiểu class khác, class file của chúng **cũng được load**. Quá trình load mọi class mà một class phụ thuộc vào gọi là **resolving the class**. |
| 3 | Virtual machine chạy method `main` trong `MyProgram` (là `static`, nên **không cần tạo instance** của class nào). |
| 4 | Nếu `main` hoặc method mà `main` gọi cần thêm class, những class đó được load tiếp. |

### Ba class loader

> *"The class loading mechanism doesn't just use a single class loader, however. Every Java program has at least three class loaders:"*
>
> *"• The bootstrap class loader"*
> *"• The platform class loader"*
> *"• The system class loader (sometimes called the application class loader)"*

**Dịch:** Cơ chế load class **không chỉ dùng một class loader duy nhất**. Mọi chương trình Java đều có **ít nhất ba class loader**: bootstrap class loader, platform class loader, và system class loader (đôi khi gọi là **application class loader**).

> *"The bootstrap class loader loads the platform classes contained in the modules"*

```
java.base
java.datatransfer
java.desktop
java.instrument
java.logging
java.management
java.management.rmi
java.naming
java.prefs
java.rmi
java.security.sasl
java.xml
```

> *"as well as a number of JDK-internal modules."*

**Dịch:** **Bootstrap class loader** load các platform class nằm trong các module kể trên, cùng với một số module nội bộ của JDK. (Về module xem [[12 - The Java Platform Module System]].)

> *"There is no ClassLoader object corresponding to the bootstrap class loader. For example,"*

```java
StringBuilder.class.getClassLoader()
```

> *"returns null."*

**Dịch:** **Không có object `ClassLoader` nào tương ứng với bootstrap class loader.** Ví dụ lời gọi trên trả về `null`.

> *"Prior to Java 9, the Java platform classes were located in a file rt.jar. Nowadays, the Java platform is modular, and each platform module is contained in a JMOD file (see Chapter 9). The platform class loader loads all classes of the Java platform that are not loaded by the bootstrap class loader."*

**Dịch:** Trước Java 9, các platform class nằm trong file `rt.jar`. Ngày nay Java platform là **modular**, mỗi platform module nằm trong một **file JMOD**. **Platform class loader** load mọi class của Java platform **mà bootstrap class loader không load**.

> *"The system class loader loads application classes from the module path and class path."*

**Dịch:** **System class loader** load các application class từ **module path và class path**.

> **Note (sách):** *"Prior to Java 9, an "extension class loader" loaded "standard extensions" from the jre/lib/ext directory, and an "endorsed standards override" mechanism provided a way of overriding certain platform classes (including the CORBA and XML implementations) with newer versions. Both of these mechanisms have been removed."*
>
> **Dịch:** Trước Java 9, một **"extension class loader"** load các "standard extension" từ thư mục `jre/lib/ext`, và cơ chế **"endorsed standards override"** cho phép ghi đè một số platform class (gồm cả implementation CORBA và XML) bằng phiên bản mới hơn. **Cả hai cơ chế này đã bị gỡ bỏ.**

---

## 10.1.2. The Class Loader Hierarchy

> *"Class loaders have a parent/child relationship. Every class loader except for the bootstrap one has a parent class loader. A class loader will give its parent a chance to load any given class and will only load it if the parent has failed."*

**Dịch:** Class loader có **quan hệ parent/child**. Mọi class loader **trừ bootstrap** đều có một parent class loader. Một class loader sẽ **nhường cho parent cơ hội load class trước**, và **chỉ tự load nếu parent thất bại**.

> *"For example, when the system class loader is asked to load a system class (say, java.lang.StringBuilder), it first asks the platform class loader. That class loader first asks the bootstrap class loader. The bootstrap class loader finds and loads the class, so neither of the other class loaders searches any further."*

**Dịch:** Ví dụ khi system class loader được yêu cầu load một system class (chẳng hạn `java.lang.StringBuilder`), nó **hỏi platform class loader trước**. Class loader đó lại **hỏi bootstrap class loader**. Bootstrap class loader tìm thấy và load class, nên **hai class loader kia không tìm thêm nữa**.

> *"Some programs have a plugin architecture in which certain parts of the code are packaged as optional plugins. If the plugins are packaged as JAR files, you can simply load the plugin classes with an instance of URLClassLoader."*

```java
var url = new URL("file:///path/to/plugin.jar");
var pluginLoader = new URLClassLoader(new URL[] { url });
Class<?> cl = pluginLoader.loadClass("mypackage.MyClass");
```

**Dịch:** Một số chương trình có **kiến trúc plugin**, trong đó vài phần code được đóng gói thành plugin tuỳ chọn. Nếu plugin đóng gói dạng **file JAR** (xem [[09 - JAR Files]]), bạn load class plugin đơn giản bằng một instance của `URLClassLoader`.

> *"Since no parent was specified in the URLClassLoader constructor, the parent of the pluginLoader is the system class loader. Figure 10.1 shows the hierarchy."*

**Dịch:** Vì không chỉ định parent trong constructor của `URLClassLoader`, **parent của `pluginLoader` là system class loader**.

```
              bootstrap class loader
                       │  (không có object ClassLoader)
                       ▼
              platform class loader
                       │
                       ▼
               system class loader
                       │
                       ▼
                  pluginLoader          ← URLClassLoader
```

> **Caution (sách):** *"Prior to Java 9, the system class loader was an instance of URLClassLoader. Some programmers used a cast to access the getURLs method, or added JAR files to the class path by calling the protected addURLs method through reflection. This is no longer possible."*
>
> **Dịch:** Trước Java 9, system class loader **là một instance của `URLClassLoader`**. Một số lập trình viên **cast** để dùng method `getURLs`, hoặc thêm file JAR vào class path bằng cách gọi method `protected addURLs` **qua reflection** (xem [[10 - Reflection]]). **Nay không làm được nữa.**

### Classloader inversion

> *"Most of the time, you don't have to worry about the class loader hierarchy. Generally, classes are loaded because they are required by other classes, and that process is transparent to you."*

**Dịch:** **Phần lớn thời gian bạn không phải bận tâm** về class loader hierarchy. Thông thường class được load vì class khác cần tới, và quá trình đó **trong suốt** với bạn.

> *"Occasionally, however, you need to intervene and specify a class loader. Consider this example:"*
>
> *"• Your application code contains a helper method that calls Class.forName(classNameString)."*
> *"• That method is called from a plugin class."*
> *"• The classNameString specifies a class that is contained in the plugin JAR."*

> *"The author of the plugin wants the class to be loaded. However, the helper method's class was loaded by the system class loader, and that is the class loader used by Class.forName. The classes in the plugin JAR are not visible. This phenomenon is called classloader inversion."*

**Dịch:** Đôi khi bạn **phải can thiệp và chỉ định class loader**. Xét ví dụ: code ứng dụng có một helper method gọi `Class.forName(classNameString)`; method đó được gọi từ một class plugin; `classNameString` chỉ tới một class nằm trong **plugin JAR**.

Tác giả plugin muốn class đó được load. Nhưng class của helper method **được load bởi system class loader**, và đó chính là class loader mà `Class.forName` dùng. **Các class trong plugin JAR không nhìn thấy được.** Hiện tượng này gọi là **classloader inversion**.

### Context class loader

> *"To overcome this problem, the helper method needs to use the correct class loader. It can require the class loader as a parameter. Alternatively, it can require that the correct class loader is set as the context class loader of the current thread. This strategy is used by many frameworks (such as JAXP and JNDI)."*

**Dịch:** Để khắc phục, helper method **phải dùng đúng class loader**. Nó có thể **nhận class loader làm parameter**. Hoặc nó yêu cầu class loader đúng được đặt làm **context class loader của thread hiện tại**. Chiến lược này được nhiều framework dùng (như JAXP và JNDI).

> *"Each thread has a reference to a class loader, called the context class loader. The main thread's context class loader is the system class loader. When a new thread is created, its context class loader is set to the creating thread's context class loader. Thus, if you don't do anything, all threads will have their context class loaders set to the system class loader."*

**Dịch:** Mỗi thread giữ một reference tới class loader, gọi là **context class loader**. Context class loader của **main thread là system class loader**. Khi thread mới được tạo, context class loader của nó được đặt bằng context class loader của **thread tạo ra nó**. Vậy nên nếu bạn không làm gì, **mọi thread đều có context class loader là system class loader**.

> *"However, you can set any class loader by calling"*

```java
Thread t = Thread.currentThread();
t.setContextClassLoader(loader);
```

> *"The helper method can then retrieve the context class loader:"*

```java
Thread t = Thread.currentThread();
ClassLoader loader = t.getContextClassLoader();
Class<?> cl = loader.loadClass(className);
```

**Dịch:** Bạn **đặt được class loader bất kỳ** bằng `setContextClassLoader`. Helper method sau đó **lấy lại context class loader** để load class.

> **Tip (sách):** *"If you write a method that loads a class by name, it is a good idea to offer the caller the choice between passing an explicit class loader and using the context class loader. Don't simply use the class loader of the method's class."*
>
> **Dịch:** Nếu bạn viết một method load class theo tên, **nên cho người gọi lựa chọn** giữa truyền class loader tường minh và dùng context class loader. **Đừng chỉ dùng class loader của chính class chứa method đó.**

---

## 10.1.3. Using Class Loaders as Namespaces

> *"Every Java programmer knows that package names are used to eliminate name conflicts. There are two classes called Date in the standard library, but of course their real names are java.util.Date and java.sql.Date. The simple name is only a programmer convenience and requires the inclusion of appropriate import statements. In a running program, all class names contain their package names."*

**Dịch:** Ai cũng biết **tên package dùng để triệt tiêu xung đột tên** (xem [[08 - Packages]]). Standard library có hai class tên `Date`, nhưng tên thật của chúng là `java.util.Date` và `java.sql.Date`. **Tên đơn giản chỉ là tiện lợi cho lập trình viên** và cần các câu lệnh `import` phù hợp. Trong chương trình đang chạy, **mọi tên class đều chứa tên package**.

> *"It might surprise you, however, that you can have two classes in the same virtual machine that have the same class and package name. A class is determined by its full name and the class loader. This technique is useful for loading code from multiple sources. For example, an application server uses separate class loaders for each application. This allows the virtual machine to separate classes from different applications, no matter what they are named."*

**Dịch:** Có thể bạn bất ngờ: **trong cùng một virtual machine vẫn có được hai class trùng cả tên class lẫn tên package**. Một class **được xác định bởi tên đầy đủ VÀ class loader**. Kỹ thuật này hữu ích khi load code từ nhiều nguồn. Ví dụ application server dùng **class loader riêng cho từng application**, nhờ đó virtual machine tách được class của các application khác nhau, **bất kể chúng tên gì**.

> *"Figure 10.2 shows an example. Suppose an application server loads two different applications, and each has a class called Util. Since each class is loaded by a separate class loader, these classes are entirely distinct and do not conflict with each other."*

**Dịch:** Giả sử application server load hai application khác nhau, mỗi cái đều có class tên `Util`. Vì **mỗi class được load bởi một class loader riêng**, hai class này **hoàn toàn tách biệt và không xung đột**.

```
  class loader A                 class loader B
        │                              │
        ▼                              ▼
    Util (app 1)                   Util (app 2)
        └──── cùng tên, KHÁC class ────┘
```

---

## 10.1.4. Writing Your Own Class Loader

> *"You can write your own class loader for specialized purposes. That lets you carry out custom checks before you pass the bytecodes to the virtual machine. For example, your class loader may refuse to load a class that has not been marked as "paid for.""*

**Dịch:** Bạn **viết được class loader của riêng mình** cho mục đích chuyên biệt. Nhờ đó bạn **kiểm tra tuỳ ý trước khi đưa bytecode cho virtual machine**. Ví dụ class loader của bạn có thể **từ chối load class chưa được đánh dấu là "đã trả tiền"**.

> *"To write your own class loader, simply extend the ClassLoader class and override the method"*

```java
findClass(String className)
```

> *"The loadClass method of the ClassLoader superclass takes care of the delegation to the parent and calls findClass only if the class hasn't already been loaded and if the parent class loader was unable to load the class."*

**Dịch:** Chỉ cần `extend` class `ClassLoader` và **override method `findClass`**. Method `loadClass` của superclass `ClassLoader` **lo phần uỷ thác cho parent**, và **chỉ gọi `findClass`** nếu class **chưa được load** và parent class loader **không load được**.

> *"Your implementation of this method must do the following:"*
>
> *"1. Load the bytecodes for the class from the local file system or some other source."*
> *"2. Call the defineClass method of the ClassLoader superclass to present the bytecodes to the virtual machine."*

**Dịch:** Implementation của method này phải: (1) **load bytecode** của class từ local file system hoặc nguồn khác; (2) gọi method **`defineClass`** của superclass `ClassLoader` để **trình bytecode cho virtual machine**.

### Ví dụ trong sách: class loader giải mã class file

> *"In the program of Listing 10.1, we implement a class loader that loads encrypted class files. The program asks the user for the name of the first class to load (that is, the class containing main) and the decryption key. It then uses a special class loader to load the specified class and calls the main method. The class loader decrypts the specified class and all nonsystem classes that are referenced by it. Finally, the program calls the main method of the loaded class (see Figure 10.3)."*

**Dịch:** Trong Listing 10.1, sách implement một class loader **load class file đã mã hoá**. Chương trình hỏi người dùng **tên class đầu tiên cần load** (class chứa `main`) và **decryption key**. Sau đó dùng class loader đặc biệt để load class đó rồi gọi method `main`. Class loader **giải mã class chỉ định cùng mọi class không phải system class mà nó tham chiếu tới**.

> *"For simplicity, we ignore the 2,000 years of progress in the field of cryptography and use the venerable Caesar cipher for encrypting the class files."*

**Dịch:** Cho đơn giản, sách **bỏ qua 2.000 năm tiến bộ của ngành mật mã** và dùng **Caesar cipher** lâu đời để mã hoá class file.

> **Note (sách):** *"David Kahn's wonderful book The Codebreakers (Macmillan, 1967, p. 84) refers to Suetonius as a historical source for the Caesar cipher. Caesar shifted the 24 letters of the Roman alphabet by 3 letters, which at the time baffled his adversaries."*
>
> *"When this chapter was first written, the U.S. government restricted the export of strong encryption methods. Therefore, we used Caesar's method for our example because it was clearly legal for export."*
>
> **Dịch:** Sách *The Codebreakers* của David Kahn (Macmillan, 1967, tr. 84) dẫn Suetonius làm nguồn sử liệu cho Caesar cipher. **Caesar dịch 24 chữ cái của bảng chữ La Mã đi 3 chữ**, thời đó đủ làm đối thủ bối rối. Khi chương này được viết lần đầu, chính phủ Mỹ **hạn chế xuất khẩu các phương pháp mã hoá mạnh**, nên sách dùng phương pháp của Caesar cho ví dụ vì nó **rõ ràng hợp pháp để xuất khẩu**.

> *"Our version of the Caesar cipher has as a key a number between 1 and 255. To decrypt, simply add that key to every byte and reduce modulo 256. The Caesar.java program of Listing 10.2 carries out the encryption."*

**Dịch:** Phiên bản Caesar cipher ở đây có **key là một số từ 1 tới 255**. Để giải mã, chỉ cần **cộng key vào mỗi byte rồi lấy modulo 256**.

> *"To not confuse the regular class loader, we use a different extension, .caesar, for the encrypted class files."*

**Dịch:** Để không làm class loader thường bị nhầm, sách dùng **đuôi khác là `.caesar`** cho class file đã mã hoá.

> *"To decrypt, the class loader simply subtracts the key from every byte. In the companion code for this book, you will find four class files, encrypted with a key value of 3—the traditional choice. To run the encrypted program, you'll need the custom class loader defined in our ClassLoaderTest program."*

**Dịch:** Để giải mã, class loader chỉ việc **trừ key khỏi mỗi byte**. Code kèm sách có bốn class file mã hoá với **key bằng 3** — lựa chọn truyền thống.

> *"Encrypting class files has a number of practical uses (provided, of course, that you use something stronger than the Caesar cipher). Without the decryption key, the class files are useless. They can neither be executed by a standard virtual machine nor readily disassembled."*

**Dịch:** Mã hoá class file có **nhiều ứng dụng thực tế** (dĩ nhiên với điều kiện dùng thứ mạnh hơn Caesar cipher). Không có decryption key thì class file **vô dụng**: **không chạy được bằng virtual machine chuẩn, cũng không dễ disassemble**.

> *"This means that you can use a custom class loader to authenticate the user of the class or to ensure that a program has been paid for before it will be allowed to run. Of course, encryption is only one application of a custom class loader. You can use other types of class loaders to solve other problems—for example, storing class files in a database."*

**Dịch:** Nghĩa là bạn dùng được custom class loader để **xác thực người dùng class** hoặc **đảm bảo chương trình đã được trả tiền trước khi cho chạy**. Mã hoá chỉ là **một** ứng dụng; class loader kiểu khác giải quyết vấn đề khác — ví dụ **lưu class file trong database**.

### Listing 10.1 — `classLoader/ClassLoaderTest.java`

```java
package classLoader;

import java.io.*;
import java.lang.reflect.*;
import java.nio.file.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

/**
 * This program demonstrates a custom class loader that decrypts class files.
 * @version 1.25 2018-05-01
 * @author Cay Horstmann
 */
public class ClassLoaderTest
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new ClassLoaderFrame();
            frame.setTitle("ClassLoaderTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * This frame contains two text fields for the name of the class to load and the decryption
 * key.
 */
class ClassLoaderFrame extends JFrame
{
    private JTextField keyField = new JTextField("3", 4);
    private JTextField nameField = new JTextField("Calculator", 30);
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 200;

    public ClassLoaderFrame()
    {
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        setLayout(new GridBagLayout());
        add(new JLabel("Class"), new GBC(0, 0).setAnchor(GBC.EAST));
        add(nameField, new GBC(1, 0).setWeight(100, 0).setAnchor(GBC.WEST));
        add(new JLabel("Key"), new GBC(0, 1).setAnchor(GBC.EAST));
        add(keyField, new GBC(1, 1).setWeight(100, 0).setAnchor(GBC.WEST));
        var loadButton = new JButton("Load");
        add(loadButton, new GBC(0, 2, 2, 1));
        loadButton.addActionListener(event -> runClass(nameField.getText(), keyField.getText()));
        pack();
    }

    /**
     * Runs the main method of a given class.
     * @param name the class name
     * @param key the decryption key for the class files
     */
    public void runClass(String name, String key)
    {
        try
        {
            var loader = new CryptoClassLoader(Integer.parseInt(key));
            Class<?> c = loader.loadClass(name);
            Method m = c.getMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
        }
        catch (Throwable t)
        {
            JOptionPane.showMessageDialog(this, t);
        }
    }
}

/**
 * This class loader loads encrypted class files.
 */
class CryptoClassLoader extends ClassLoader
{
    private int key;

    /**
     * Constructs a crypto class loader.
     * @param k the decryption key
     */
    public CryptoClassLoader(int k)
    {
        key = k;
    }

    protected Class<?> findClass(String name) throws ClassNotFoundException
    {
        try
        {
            byte[] classBytes = null;
            classBytes = loadClassBytes(name);
            Class<?> cl = defineClass(name, classBytes, 0, classBytes.length);
            if (cl == null) throw new ClassNotFoundException(name);
            return cl;
        }
        catch (IOException e)
        {
            throw new ClassNotFoundException(name);
        }
    }

    /**
     * Loads and decrypt the class file bytes.
     * @param name the class name
     * @return an array with the class file bytes
     */
    private byte[] loadClassBytes(String name) throws IOException
    {
        String cname = name.replace('.', '/') + ".caesar";
        byte[] bytes = Files.readAllBytes(Paths.get(cname));
        for (int i = 0; i < bytes.length; i++)
            bytes[i] = (byte) (bytes[i] - key);
        return bytes;
    }
}
```

### Listing 10.2 — `classLoader/Caesar.java`

```java
package classLoader;

import java.io.*;

/**
 * Encrypts a file using the Caesar cipher.
 * @version 1.02 2018-05-01
 * @author Cay Horstmann
 */
public class Caesar
{
    public static void main(String[] args) throws Exception
    {
        if (args.length != 3)
        {
            System.out.println("USAGE: java classLoader.Caesar in out key");
            return;
        }

        try (var in = new FileInputStream(args[0]);
            var out = new FileOutputStream(args[1]))
        {
            int key = Integer.parseInt(args[2]);
            int ch;
            while ((ch = in.read()) != -1)
            {
                byte c = (byte) (ch + key);
                out.write(c);
            }
        }
    }
}
```

### API — `java.lang.Class` 1.0

| Method | Mô tả |
|---|---|
| `ClassLoader getClassLoader()` | Lấy class loader đã load class này. |

### API — `java.lang.ClassLoader` 1.0

| Method | Mô tả |
|---|---|
| `ClassLoader getParent()` 1.2 | Trả về parent class loader, hoặc `null` nếu parent là bootstrap class loader. |
| `static ClassLoader getSystemClassLoader()` 1.2 | Lấy system class loader — tức class loader đã được dùng để load **application class đầu tiên**. |
| `protected Class findClass(String name)` 1.2 | Nên được override bởi class loader để tìm bytecode của một class và trình chúng cho virtual machine bằng cách gọi `defineClass`. Trong tên class, dùng `.` làm dấu ngăn package, và **không dùng hậu tố `.class`**. |
| `Class defineClass(String name, byte[] byteCodeData, int offset, int length)` | Thêm một class mới vào virtual machine với bytecode nằm trong khoảng dữ liệu đã cho. |

### API — `java.net.URLClassLoader` 1.2

| Method | Mô tả |
|---|---|
| `URLClassLoader(URL[] urls)`<br>`URLClassLoader(URL[] urls, ClassLoader parent)` | Dựng class loader load class từ các URL đã cho. Nếu URL **kết thúc bằng `/`** thì được coi là **directory**, ngược lại được coi là **file JAR**. |

### API — `java.lang.Thread` 1.0

| Method | Mô tả |
|---|---|
| `ClassLoader getContextClassLoader()` 1.2 | Lấy class loader mà người tạo thread này đã chỉ định là class loader hợp lý nhất để dùng khi chạy thread này. |
| `void setContextClassLoader(ClassLoader loader)` 1.2 | Đặt class loader cho code trong thread này lấy ra để load class. Nếu không đặt tường minh khi thread khởi động, **context class loader của parent được dùng**. |

---

## 10.1.5. Bytecode Verification

> *"When a class loader presents the bytecodes of a newly loaded Java platform class to the virtual machine, these bytecodes are first inspected by a verifier. The verifier checks that the instructions cannot perform actions that are obviously damaging. All classes except for system classes are verified."*

**Dịch:** Khi class loader trình bytecode của một class Java platform mới load cho virtual machine, bytecode đó **trước hết được một verifier soi xét**. Verifier kiểm tra rằng các lệnh **không thể thực hiện hành động rõ ràng gây hại**. **Mọi class trừ system class đều được verify.** (Xem thêm [[02 - The Java White Paper Buzzwords]], phần Secure.)

> *"Here are some of the checks that the verifier carries out:"*
>
> *"• Variables are initialized before they are used."*
> *"• Method calls match the types of object references."*
> *"• Rules for accessing private data and methods are not violated."*
> *"• Local variable accesses fall within the runtime stack."*
> *"• The runtime stack does not overflow."*

**Dịch:** Một số kiểm tra mà **bytecode verifier** thực hiện:

| # | Kiểm tra |
|---|---|
| 1 | Biến **được khởi tạo trước khi dùng**. |
| 2 | Lời gọi method **khớp kiểu của object reference**. |
| 3 | Quy tắc truy cập **private data và private method không bị vi phạm**. |
| 4 | Truy cập local variable **nằm trong phạm vi runtime stack**. |
| 5 | Runtime stack **không bị overflow**. |

> *"If any of these checks fails, the class is considered corrupted and will not be loaded."*

**Dịch:** Nếu **bất kỳ kiểm tra nào thất bại**, class bị coi là **hỏng và sẽ không được load**.

> **Note (sách):** *"If you are familiar with Gödel's theorem, you might wonder how the verifier can prove that a class file is free from type mismatches, uninitialized variables, and stack overflows. Gödel's theorem states that it is impossible to design algorithms that process a program and decide whether it has a particular property (such as being free from stack overflows). Is this a conflict between the public relations department at Oracle and the laws of logic? No—in fact, the verifier is not a decision algorithm in the sense of Gödel. If the verifier accepts a program, it is indeed safe. However, the verifier might reject virtual machine instructions even though they would actually be safe. (You might have run into this issue when you were forced to initialize a variable with a dummy value because the verifier couldn't see that it was going to be properly initialized.)"*
>
> **Dịch:** Nếu bạn quen định lý Gödel, hẳn sẽ thắc mắc verifier chứng minh kiểu vậy bằng cách nào. Định lý Gödel nói **không thể thiết kế thuật toán nhận vào một chương trình rồi quyết định nó có một tính chất nào đó hay không** (chẳng hạn có bị stack overflow không). Đây có phải mâu thuẫn giữa bộ phận PR của Oracle và các định luật logic? **Không** — thực ra **verifier không phải một thuật toán quyết định theo nghĩa của Gödel**. Nếu verifier **chấp nhận** một chương trình thì chương trình đó **quả thực an toàn**. Nhưng verifier **có thể từ chối** những lệnh virtual machine dù chúng thực sự an toàn. (Bạn có thể đã gặp chuyện này khi bị buộc khởi tạo một biến bằng giá trị giả vì verifier không thấy được rằng nó sẽ được khởi tạo đúng cách.)

> *"This strict verification is an important security consideration. Accidental errors, such as uninitialized variables, can easily wreak havoc if they are not caught. More importantly, in the wide open world of the Internet, you must be protected against malicious programmers who create evil effects on purpose. For example, by modifying values on the runtime stack or by writing to the private data fields of system objects, a program can break through the security system of a browser."*

**Dịch:** Việc verify nghiêm ngặt này là **cân nhắc bảo mật quan trọng**. Lỗi vô ý như biến chưa khởi tạo **dễ gây tai hoạ nếu không bị bắt**. Quan trọng hơn, trong thế giới mở của Internet, bạn phải **được bảo vệ trước những lập trình viên ác ý cố tình gây hại**. Ví dụ bằng cách **sửa giá trị trên runtime stack** hoặc **ghi vào private data field của system object**, một chương trình có thể **chọc thủng hệ thống bảo mật của browser**.

> *"You might wonder, however, why a special verifier is needed to check all these features. After all, the compiler would never allow you to generate a class file in which an uninitialized variable is used or in which a private data field is accessed from another class. Indeed, a class file generated by a compiler for the Java programming language always passes verification. However, the bytecode format used in the class files is well documented, and it is an easy matter for someone with experience in assembly programming and a hex editor to manually produce a class file containing valid but unsafe instructions for the Java virtual machine. The verifier is always guarding against maliciously altered class files—not just checking the class files produced by a compiler."*

**Dịch:** Có thể bạn hỏi **tại sao cần một verifier riêng**. Compiler đâu bao giờ cho bạn sinh ra class file dùng biến chưa khởi tạo hay truy cập private data field từ class khác. Đúng vậy: **class file do compiler Java sinh ra luôn qua được verification**. Nhưng **định dạng bytecode trong class file được tài liệu hoá đầy đủ**, và với người có kinh nghiệm lập trình assembly cùng một hex editor thì **tạo tay một class file chứa lệnh hợp lệ nhưng không an toàn là chuyện dễ**. Verifier **luôn canh chừng class file bị sửa đổi ác ý**, chứ không chỉ kiểm tra class file do compiler sinh ra.

### Ví dụ trong sách: sửa bytecode bằng hex editor

> *"Here's an example of how to construct such an altered class file. We start with the program VerifierTest.java of Listing 10.3. This is a simple program that calls a method and displays the method's result. The program can be run both as a console program and as an applet. The fun method itself just computes 1 + 2."*

```java
static int fun()
{
    int m;
    int n;
    m = 1;
    n = 2;
    int r = m + n;
    return r;
}
```

**Dịch:** Bắt đầu từ chương trình `VerifierTest.java`. Method `fun` chỉ tính `1 + 2`.

> *"As an experiment, try to compile the following modification of this program:"*

```java
static int fun()
{
    int m = 1;
    int n;
    m = 1;
    m = 2;
    int r = m + n;
    return r;
}
```

> *"Here, n is not initialized, so it could have any random value. Of course, the compiler detects that problem and refuses to compile the program. To create a bad class file, we have to work a little harder. First, run the javap program to find out how the compiler translates the fun method. The command"*

```
javap -c verifier.VerifierTest
```

> *"shows the bytecodes in the class file in mnemonic form."*

```
Method int fun()
0 iconst_1
1 istore_0
2 iconst_2
3 istore_1
4 iload_0
5 iload_1
6 iadd
7 istore_2
8 iload_2
9 ireturn
```

**Dịch:** Ở bản sửa, `n` **không được khởi tạo** nên có thể mang giá trị ngẫu nhiên bất kỳ. Compiler dĩ nhiên phát hiện và **từ chối biên dịch**. Muốn tạo class file xấu thì phải làm khó hơn: chạy `javap -c` để xem compiler dịch method `fun` ra sao — lệnh này **hiện bytecode trong class file dưới dạng mnemonic**.

> *"Use a hex editor to change instruction 3 from istore_1 to istore_0. That is, local variable 0 (which is m) is initialized twice, and local variable 1 (which is n) is not initialized at all. We need to know the hexadecimal values for these instructions; these values are readily available from the Java Virtual Machine specification (https://docs.oracle.com/javase/specs/jvms/se11/html/index.html)."*

```
0 iconst_1 04
1 istore_0 3B
2 iconst_2 05
3 istore_1 3C
4 iload_0  1A
5 iload_1  1B
6 iadd     60
7 istore_2 3D
8 iload_2  1C
9 ireturn  AC
```

**Dịch:** Dùng hex editor **đổi lệnh 3 từ `istore_1` thành `istore_0`**. Tức là local variable 0 (`m`) **được khởi tạo hai lần**, còn local variable 1 (`n`) **hoàn toàn không được khởi tạo**. Giá trị hex của các lệnh này có sẵn trong **Java Virtual Machine specification**.

> *"You can use any hex editor to carry out the modification. In Figure 10.4, you see the class file VerifierTest.class loaded into the Gnome hex editor, with the bytecodes of the fun method highlighted."*

> *"Change 3C to 3B and save the class file. Then try running the VerifierTest program. You get an error message:"*

```
Exception in thread "main" java.lang.VerifyError: (class: VerifierTest, method:fun signature:
()I) Accessing value from uninitialized register 1
```

> *"That is good—the virtual machine detected our modification."*

**Dịch:** **Đổi `3C` thành `3B`** rồi lưu class file. Chạy `VerifierTest` sẽ nhận thông báo lỗi `VerifyError`. **Tốt — virtual machine đã phát hiện ra thay đổi.**

> *"Now run the program with the -noverify (or -Xverify:none) option:"*

```
java -noverify verifier.VerifierTest
```

> *"The fun method returns a seemingly random value. This is actually 2 plus the value that happened to be stored in the variable n, which was never initialized. Here is a typical printout:"*

```
1 + 2 == 15102330
```

**Dịch:** Chạy với option **`-noverify`** (hoặc `-Xverify:none`) thì method `fun` **trả về một giá trị trông như ngẫu nhiên**. Thực chất đó là **2 cộng với giá trị tình cờ nằm trong biến `n`** — biến chưa bao giờ được khởi tạo.

### Listing 10.3 — `verifier/VerifierTest.java`

```java
package verifier;

import java.awt.*;

/**
 * This application demonstrates the bytecode verifier of the virtual machine. If you use a
 * hex editor to modify the class file, then the virtual machine should detect the tampering.
 * @version 1.10 2018-05-05
 * @author Cay Horstmann
 */
public class VerifierTest
{
    public static void main(String[] args)
    {
        System.out.println("1 + 2 == " + fun());
    }

    /**
     * A function that computes 1 + 2.
     * @return 3, if the code has not been corrupted
     */
    public static int fun()
    {
        int m;
        int n;
        m = 1;
        n = 2;
        // use hex editor to change to "m = 2" in class file
        int r = m + n;
        return r;
    }
}
```

---

## Bài kế tiếp

→ [[02 - Security Managers and Permissions]] — permission checking, Java platform security, policy file, custom permission.
