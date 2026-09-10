# 06 — Bytecode Engineering

> Chapter 11, Section 11.6 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.6. Bytecode Engineering

> *"You have seen how annotations can be processed at runtime or at the source code level. There is a third possibility: processing at the bytecode level."*

**Dịch:** Bạn đã thấy annotation được xử lý **lúc runtime** ([[04 - Processing Annotations at Runtime]]) hoặc **ở mức source code** ([[05 - Source-Level Annotation Processing]]). Còn **khả năng thứ ba: xử lý ở mức bytecode**.

> *"Unless annotations are removed at the source level, they are present in the class files. The class file format is documented (see https://docs.oracle.com/javase/specs/jvms/se21/html). The format is rather complex, and it would be challenging to process class files without special libraries. One such library is the ASM library, available at https://asm.ow2.org. Download asm-9.6.jar and asm-commons-9.6.jar and place them in a directory of your choice, called asm in the instructions."*

**Dịch:** Trừ khi annotation **bị loại bỏ ở mức source** (xem retention policy trong [[02 - Defining Annotations]]), chúng **có mặt trong các class file**. **Định dạng class file có tài liệu** (xem `https://docs.oracle.com/javase/specs/jvms/se21/html`). Định dạng này **khá phức tạp**, và **sẽ rất vất vả nếu xử lý class file mà không có thư viện chuyên dụng**. Một thư viện như vậy là **ASM**, có tại `https://asm.ow2.org`. Tải **`asm-9.6.jar`** và **`asm-commons-9.6.jar`** rồi đặt vào một thư mục tuỳ chọn, trong hướng dẫn gọi là **`asm`**.

---

## 11.6.1. Modifying Class Files

> *"In this section, we use ASM to add logging messages to annotated methods. If a method is annotated with"*

```java
@LogEntry(logger=loggerName)
```

> *"then we add the bytecodes for the following statement at the beginning of the method:"*

```java
System.getLogger(loggerName).log(System.Logger.Level.TRACE,
    "Entering {0}.{1}", className, methodName);
```

**Dịch:** Trong section này, ta dùng **ASM để thêm thông điệp logging vào những method được annotate**. Nếu một method được annotate bằng `@LogEntry(logger=loggerName)`, thì ta **thêm bytecode của câu lệnh trên vào đầu method**.

> *"For example, if you annotate the hashCode method of the Item class as"*

```java
@LogEntry(logger="com.horstmann") public int hashCode()
```

> *"then a message similar to the following is printed whenever the method is called:"*

```
Dec 03, 2023 5:58:44 PM set.Item hashCode
INFO: Entering set.Item.hashCode
```

**Dịch:** Ví dụ, nếu bạn annotate method `hashCode` của class `Item` như trên, thì **một thông điệp tương tự sẽ được in ra mỗi khi method được gọi**.

> *"To achieve this, we do the following:"*
>
> *"1. Load the bytecodes in the class file."*
> *"2. Locate all methods."*
> *"3. For each method, check whether it has a LogEntry annotation."*
> *"4. If it does, add the bytecodes for the following instructions at the beginning of the method:"*

**Dịch:** Để làm được điều đó, ta thực hiện:

1. **Load bytecode trong class file.**
2. **Định vị mọi method.**
3. **Với mỗi method, kiểm tra xem nó có annotation `LogEntry` hay không.**
4. **Nếu có, thêm bytecode của các instruction sau vào đầu method:**

```
ldc loggerName
invokestatic System.getLogger(String)
getstatic System.Logger.Level.INFO
ldc "Entering {0}.{1}"
iconst_2
anewarray
dup
iconst_0
ldc className
aastore
dup
iconst_1
ldc methodName
aastore
invokeinterface System.Logger.log(System.Logger.Level, String, Object[])
```

> *"Inserting these bytecodes sounds tricky, but the ASM library makes it fairly straightforward. I won't describe the process of analyzing and inserting bytecodes in detail. The important point is that the program in Listing 11.5 edits a class file and inserts a logging call at the beginning of the methods annotated with the LogEntry annotation."*

**Dịch:** Việc **chèn những bytecode này nghe có vẻ rắc rối, nhưng thư viện ASM khiến nó khá đơn giản**. Tác giả **không mô tả chi tiết quá trình phân tích và chèn bytecode**. Điểm quan trọng là **chương trình ở Listing 11.5 sửa một class file và chèn một lời gọi logging vào đầu những method được annotate bằng `LogEntry`**.

> *"For example, here is how you add the logging instructions to Item.java in Listing 11.6, where asm is the directory into which you installed the ASM library:"*

```
javac set/Item.java
javac -classpath .:asm/\* bytecodeAnnotations/EntryLogger.java
java -classpath .:asm/\* bytecodeAnnotations.EntryLogger set/Item.class
```

**Dịch:** Ví dụ, đây là cách **thêm các instruction logging vào `Item.java`** ở Listing 11.6, trong đó `asm` là **thư mục bạn đã cài thư viện ASM vào**.

> *"As always, with Windows, you use \ instead of / as file separator and ; instead of : as path separator, and you do not escape the *."*

**Dịch:** Như thường lệ, trên **Windows** bạn dùng **`\` thay cho `/`** làm file separator, **`;` thay cho `:`** làm path separator, và **không escape dấu `*`**. Xem [[08 - Packages]].

> *"Try running"*

```
javap -c set.Item
```

> *"before and after modifying the Item class file. You can see the inserted instructions at the beginning of the hashCode, equals, and compareTo methods."*

**Dịch:** Thử chạy lệnh trên **trước và sau khi sửa class file `Item`**. Bạn sẽ **thấy các instruction được chèn vào đầu các method `hashCode`, `equals` và `compareTo`**.

```
public int hashCode();
    Code:
        0: ldc           #42                 // String com.horstmann
        2: invokestatic  #48
            // Method java/lang/System.getLogger:(Ljava/lang/String;)Ljava/lang/System$Logger;
        5: getstatic     #54
            // Field java/lang/System$Logger$Level.INFO:Ljava/lang/System$Logger$Level;
        8: ldc           #56                 // String Entering {0}.{1}
       10: iconst_2
       11: anewarray     #4                  // class java/lang/Object
       14: dup
       15: iconst_0
       16: ldc           #58                 // String set.Item
       18: aastore
       19: dup
       20: iconst_1
       21: ldc           #77                 // String hashCode
       23: aastore
       24: invokeinterface #65,  4           // InterfaceMethod java/lang/System$Logger.log:
            // (Ljava/lang/System$Logger$Level;Ljava/lang/String;[Ljava/lang/Object;)V
. . .
```

> *"The index values into the constant pool may be different when you try this."*

**Dịch:** **Các giá trị index vào constant pool có thể khác** khi bạn thử.

> *"The SetTest program in Listing 11.7 inserts Item objects into a hash set. When you run it with the modified class file, you will see the logging messages."*

**Dịch:** Chương trình `SetTest` ở Listing 11.7 **chèn các object `Item` vào một hash set**. Khi chạy nó **với class file đã sửa**, bạn sẽ **thấy các thông điệp logging**.

```
Dec 03, 2023 5:58:44 PM set.Item hashCode
INFO: Entering set.Item.hashCode
Dec 03, 2023 5:58:44 PM set.Item hashCode
INFO: Entering set.Item.hashCode
Dec 03, 2023 5:58:44 PM set.Item hashCode
INFO: Entering set.Item.hashCode
Dec 03, 2023 5:58:44 PM set.Item equals
INFO: Entering set.Item.equals
[[description=Microwave, partNumber=4104], [description=Toaster, partNumber=1279]]
```

> *"Note the call to equals when we insert the same item twice."*

**Dịch:** Lưu ý **lời gọi `equals` khi ta chèn cùng một item hai lần**.

> *"This example shows the power of bytecode engineering. Annotations are used to add directives to a program, and a bytecode editing tool picks up the directives and modifies the virtual machine instructions."*

**Dịch:** Ví dụ này cho thấy **sức mạnh của bytecode engineering**: **annotation được dùng để thêm chỉ thị vào chương trình**, và **một tool sửa bytecode nhặt các chỉ thị đó lên rồi sửa các instruction của virtual machine**.

---

### Listing 11.5 — `bytecodeAnnotations/EntryLogger.java`

```java
package bytecodeAnnotations;

import java.io.*;
import java.nio.file.*;

import org.objectweb.asm.*;
import org.objectweb.asm.commons.*;

/**
 * Adds "entering" logs to all methods of a class that have the LogEntry annotation.
 * @version 1.22 2023-12-01
 * @author Cay Horstmann
 */
public class EntryLogger extends ClassVisitor
{
    private String className;

    /**
     * Constructs an EntryLogger that inserts logging into annotated methods of a given class.
     */
    public EntryLogger(ClassWriter writer, String className)
    {
        super(Opcodes.ASM8, writer);
        this.className = className;
    }

    public MethodVisitor visitMethod(int access, String methodName, String desc,
            String signature, String[] exceptions)
    {
        MethodVisitor mv = cv.visitMethod(access, methodName, desc, signature, exceptions);
        return new AdviceAdapter(Opcodes.ASM8, mv, access, methodName, desc)
        {
            private String loggerName;

            public AnnotationVisitor visitAnnotation(String desc, boolean visible)
            {
                return new AnnotationVisitor(Opcodes.ASM8)
                {
                    public void visit(String name, Object value)
                    {
                        if (desc.equals("LbytecodeAnnotations/LogEntry;")
                                && name.equals("logger"))
                            loggerName = value.toString();
                    }
                };
            }

            public void onMethodEnter()
            {
                if (loggerName != null)
                {
                    /*
                    visitLdcInsn(loggerName);
                    visitMethodInsn(INVOKESTATIC, "java/util/logging/Logger", "getLogger",
                        "(Ljava/lang/String;)Ljava/util/logging/Logger;", false);
                    visitLdcInsn(className);
                    visitLdcInsn(methodName);
                    visitMethodInsn(INVOKEVIRTUAL, "java/util/logging/Logger", "entering",
                        "(Ljava/lang/String;Ljava/lang/String;)V", false);
                    */
                    visitLdcInsn(loggerName);
                    visitMethodInsn(INVOKESTATIC, "java/lang/System", "getLogger",
                        "(Ljava/lang/String;)Ljava/lang/System$Logger;", false);
                    visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System$Logger$Level", "INFO",
                        "Ljava/lang/System$Logger$Level;");
                    visitLdcInsn("Entering {0}.{1}");

                    // Create an array of Objects with a length of 2
                    mv.visitInsn(Opcodes.ICONST_2); // array length
                    mv.visitTypeInsn(Opcodes.ANEWARRAY, "java/lang/Object"); // array type

                    // Add two objects to the array
                    mv.visitInsn(Opcodes.DUP); // duplicate array reference
                    mv.visitInsn(Opcodes.ICONST_0); // index 0
                    visitLdcInsn(className);
                    mv.visitInsn(Opcodes.AASTORE); // store in array

                    mv.visitInsn(Opcodes.DUP); // duplicate array reference
                    mv.visitInsn(Opcodes.ICONST_1); // index 1
                    visitLdcInsn(methodName);
                    mv.visitInsn(Opcodes.AASTORE); // store in array

                    visitMethodInsn(INVOKEINTERFACE, "java/lang/System$Logger", "log",
                        "(Ljava/lang/System$Logger$Level;Ljava/lang/String;[Ljava/lang/Object;)V",
                        true);
                    loggerName = null;
                }
            }
        };
    }

    /**
     * Adds entry logging code to the given class.
     * @param args the name of the class file to patch
     */
    public static void main(String[] args) throws IOException
    {
        if (args.length == 0)
        {
            System.out.println("USAGE: java bytecodeAnnotations.EntryLogger classfile");
            System.exit(1);
        }
        Path path = Path.of(args[0]);
        var reader = new ClassReader(Files.newInputStream(path));
        var writer = new ClassWriter(
            ClassWriter.COMPUTE_MAXS | ClassWriter.COMPUTE_FRAMES);
        var entryLogger = new EntryLogger(writer,
            path.toString().replace(".class", "").replaceAll("[/\\\\]", "."));
        reader.accept(entryLogger, ClassReader.EXPAND_FRAMES);
        Files.write(Path.of(args[0]), writer.toByteArray());
    }
}
```

### Listing 11.6 — `set/Item.java`

```java
package set;

import java.util.*;
import bytecodeAnnotations.*;

/**
 * An item with a description and a part number.
 * @version 1.01 2012-01-26
 * @author Cay Horstmann
 */
public class Item
{
    private String description;
    private int partNumber;

    /**
     * Constructs an item.
     * @param aDescription the item's description
     * @param aPartNumber the item's part number
     */
    public Item(String aDescription, int aPartNumber)
    {
        description = aDescription;
        partNumber = aPartNumber;
    }

    /**
     * Gets the description of this item.
     * @return the description
     */
    public String getDescription()
    {
        return description;
    }

    public String toString()
    {
        return "[description=" + description + ", partNumber=" + partNumber + "]";
    }

    @LogEntry(logger = "com.horstmann")
    public boolean equals(Object otherObject)
    {
        if (this == otherObject) return true;
        if (otherObject == null) return false;
        if (getClass() != otherObject.getClass()) return false;
        var other = (Item) otherObject;
        return Objects.equals(description, other.description) && partNumber == other.partNumber;
    }

    @LogEntry(logger = "com.horstmann")
    public int hashCode()
    {
        return Objects.hash(description, partNumber);
    }
}
```

### Listing 11.7 — `set/SetTest.java`

```java
package set;

import java.util.*;
import java.util.logging.*;

/**
 * @version 1.03 2018-05-01
 * @author Cay Horstmann
 */
public class SetTest
{
    public static void main(String[] args)
    {
        Logger.getLogger("com.horstmann").setLevel(Level.FINEST);
        var handler = new ConsoleHandler();
        handler.setLevel(Level.FINEST);
        Logger.getLogger("com.horstmann").addHandler(handler);
        var parts = new HashSet<Item>();
        parts.add(new Item("Toaster", 1279));
        parts.add(new Item("Microwave", 4104));
        parts.add(new Item("Toaster", 1279));
        System.out.println(parts);
    }
}
```

---

## 11.6.2. Modifying Bytecodes at Load Time

> *"In the last section, you saw a tool that edits class files. However, it can be cumbersome to add yet another tool into the build process. An attractive alternative is to defer the bytecode engineering until load time, when the class loader loads the class."*

**Dịch:** Ở section trước, bạn đã thấy **một tool sửa class file**. Tuy nhiên, **thêm một tool nữa vào build process có thể phiền phức**. Một **lựa chọn hấp dẫn hơn** là **hoãn việc bytecode engineering tới lúc load time**, khi **class loader load class**.

> *"The instrumentation API has a hook for installing a bytecode transformer. The transformer must be installed before the main method of the program is called. You can meet this requirement by defining an agent, a library that is loaded to monitor a program in some way. The agent code can carry out initializations in a premain method."*

**Dịch:** **Instrumentation API có một hook để cài đặt một bytecode transformer.** Transformer **phải được cài trước khi method `main` của chương trình được gọi**. Bạn đáp ứng yêu cầu này bằng cách **định nghĩa một agent** — **một library được load để giám sát chương trình theo cách nào đó**. Code của agent **thực hiện việc khởi tạo trong method `premain`**.

> *"Here are the steps required to build an agent:"*
>
> *"1. Implement a class with a method"*

```java
public static void premain(String arg, Instrumentation instr)
```

> *"This method is called when the agent is loaded. The agent can get a single command-line argument, which is passed in the arg parameter. The instr parameter can be used to install various hooks."*

**Dịch:** Các bước để dựng một agent:

**1.** Implement một class có method `premain` như trên. Method này **được gọi khi agent được load**. Agent nhận được **một argument command-line duy nhất**, truyền vào **parameter `arg`**. Parameter **`instr`** dùng để **cài các hook khác nhau**.

> *"2. Make a manifest file EntryLoggingAgent.mf that sets the Premain-Class attribute, for example:"*

```
Premain-Class: bytecodeAnnotations.EntryLoggingAgent
```

**Dịch:** **2.** Tạo một **manifest file `EntryLoggingAgent.mf`** đặt **attribute `Premain-Class`**. Xem [[09 - JAR Files]].

> *"3. Package the agent code and the manifest into a JAR file:"*

```
javac -classpath .:asm/\* bytecodeAnnotations/EntryLoggingAgent.java
jar cvfm EntryLoggingAgent.jar bytecodeAnnotations/EntryLoggingAgent.mf \
    bytecodeAnnotations/Entry*.class
```

**Dịch:** **3.** **Đóng gói code của agent và manifest vào một file JAR.**

> *"To launch a Java program together with the agent, use the following command-line options:"*

```
java -javaagent:AgentJARFile=agentArgument . . .
```

**Dịch:** Để **khởi chạy một chương trình Java cùng với agent**, dùng các option command-line trên.

> *"For example, to run the SetTest program with the entry logging agent, call"*

```
javac set/*.java
java -javaagent:EntryLoggingAgent.jar=set.Item -classpath .:asm/\* set.SetTest
```

> *"The Item argument is the name of the class that the agent should modify."*

**Dịch:** **Argument `Item` là tên của class mà agent phải sửa.**

> *"Listing 11.8 shows the agent code. The agent installs a class file transformer. The transformer first checks whether the class name matches the agent argument. If so, it uses the EntryLogger class from the preceding section to modify the bytecodes. However, the modified bytecodes are not saved to a file. Instead, the transformer returns them for loading into the virtual machine (see Figure 11.3). In other words, this technique carries out "just in time" modification of the bytecodes."*

**Dịch:** Listing 11.8 cho thấy code của agent. Agent **cài đặt một class file transformer**. Transformer **trước hết kiểm tra xem tên class có khớp với argument của agent hay không**. Nếu khớp, nó **dùng class `EntryLogger` ở section trước để sửa bytecode**. Tuy nhiên, **bytecode đã sửa không được lưu ra file**. Thay vào đó, transformer **trả chúng về để load vào virtual machine** (xem Figure 11.3). Nói cách khác, kỹ thuật này **thực hiện việc sửa bytecode "just in time"**.

---

### Listing 11.8 — `bytecodeAnnotations/EntryLoggingAgent.java`

```java
package bytecodeAnnotations;

import java.lang.instrument.*;
import java.security.*;
import org.objectweb.asm.*;

/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
public class EntryLoggingAgent
{
    public static void premain(final String arg, Instrumentation instr)
    {
        instr.addTransformer(new ClassFileTransformer() {
            public byte[] transform(ClassLoader loader, String className, Class<?> cl,
                    ProtectionDomain pd, byte[] data) throws IllegalClassFormatException
            {
                if (!className.replace("/", ".").equals(arg)) return null;
                var reader = new ClassReader(data);
                var writer = new ClassWriter(
                    ClassWriter.COMPUTE_MAXS | ClassWriter.COMPUTE_FRAMES);
                var el = new EntryLogger(writer, className);
                reader.accept(el, ClassReader.EXPAND_FRAMES);
                return writer.toByteArray();
            }});
    }
}
```

---

## Tổng kết chương

> *"In this chapter, you have learned how to"*
>
> *"Add annotations to Java programs"*
> *"Design your own annotation interfaces"*
> *"Implement tools that make use of the annotations"*

**Dịch:** Trong chương này, bạn đã học cách:

- **Thêm annotation vào chương trình Java** — [[01 - Using Annotations]]
- **Thiết kế annotation interface của riêng mình** — [[02 - Defining Annotations]]
- **Implement các tool sử dụng annotation** — [[04 - Processing Annotations at Runtime]], [[05 - Source-Level Annotation Processing]]

> *"You have seen three technologies for processing code: scripting, compiling Java programs, and processing annotations. The first two were quite straightforward. On the other hand, building annotation tools is undeniably complex and not something that most developers will need to tackle. This chapter gave you the background for understanding the inner workings of the annotation tools you will encounter, and perhaps piqued your interest in developing your own tools."*

**Dịch:** Bạn đã thấy **ba công nghệ xử lý code**: **scripting**, **compile chương trình Java**, và **xử lý annotation**. **Hai cái đầu khá đơn giản.** Ngược lại, **dựng annotation tool thì phức tạp không thể chối cãi**, và **không phải việc mà đa số developer sẽ phải đụng tới**. Chương này **cung cấp nền tảng để hiểu cơ chế bên trong của những annotation tool bạn sẽ gặp**, và biết đâu **khơi lên hứng thú tự phát triển tool của riêng bạn**.

> *"The following chapter discusses the Java Platform Module System, a key feature for insuring the integrity of the Java platform."*

**Dịch:** Chương kế tiếp bàn về **Java Platform Module System**, một **tính năng then chốt để bảo đảm tính toàn vẹn của nền tảng Java**.

---

## Chương kế tiếp

→ [[01 - The Module Concept]] — module system mang lợi ích của encapsulation lên quy mô lập trình lớn, cho phép class và package được công khai một cách có chọn lọc.
