# 07 — Bytecode Engineering

> Chapter 8, Section 8.7 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

> Chủ đề này Volume I cũng có, viết ở bản khác: xem [[06 - Bytecode Engineering]] (Vol I).

---

## 8.7. Bytecode Engineering

> *"You have seen how annotations can be processed at runtime or at the source code level. There is a third possibility: processing at the bytecode level. Unless annotations are removed at the source level, they are present in the class files. The class file format is documented (see http://docs.oracle.com/javase/specs/jvms/se10/html). The format is rather complex, and it would be challenging to process class files without special libraries. One such library is the ASM library, available at http://asm.ow2.org."*

**Dịch:** Bạn đã thấy annotation được xử lý **lúc runtime** hoặc **ở mức source code**. Còn **khả năng thứ ba: xử lý ở mức bytecode**. **Trừ khi annotation bị gỡ ở mức source, chúng có mặt trong các file class.** **Định dạng file class có tài liệu chính thức.** Định dạng này **khá phức tạp**, và **sẽ rất khó xử lý file class nếu không có library chuyên dụng**. Một library như vậy là **ASM library**.

---

## 8.7.1. Modifying Class Files

> *"In this section, we use ASM to add logging messages to annotated methods. If a method is annotated with"*

```java
@LogEntry(logger=loggerName)
```

> *"then we add the bytecodes for the following statement at the beginning of the method:"*

```java
Logger.getLogger(loggerName).entering(className, methodName);
```

**Dịch:** Ở mục này sách dùng **ASM để thêm logging message vào các method được annotate**. Nếu một method được annotate bằng `@LogEntry(logger=loggerName)` thì ta **thêm bytecode cho câu lệnh trên vào đầu method**.

> *"For example, if you annotate the hashCode method of the Item class as"*

```java
@LogEntry(logger="global") public int hashCode()
```

> *"then a message similar to the following is printed whenever the method is called:"*

```
May 17, 2016 10:57:59 AM Item hashCode
FINER: ENTRY
```

**Dịch:** Ví dụ, annotate method `hashCode` của class `Item` như trên thì **mỗi lần method được gọi** sẽ in ra một message tương tự.

> *"To achieve this, we do the following:"*
>
> 1. *"Load the bytecodes in the class file."*
> 2. *"Locate all methods."*
> 3. *"For each method, check whether it has a LogEntry annotation."*
> 4. *"If it does, add the bytecodes for the following instructions at the beginning of the method:"*
>
> ```
> ldc loggerName
> invokestatic
>     java/util/logging/Logger.getLogger:(Ljava/lang/String;)Ljava/util/logging/Logger;
> ldc className
> ldc methodName
> invokevirtual
>     java/util/logging/Logger.entering:(Ljava/lang/String;Ljava/lang/String;)V
> ```

**Dịch:** Bốn bước:

| # | Bước |
|---|---|
| 1 | **Load bytecode trong file class** |
| 2 | **Định vị mọi method** |
| 3 | Với mỗi method, **kiểm tra xem nó có annotation `LogEntry` hay không** |
| 4 | Nếu có, **thêm bytecode cho các instruction trên vào đầu method** |

> *"Inserting these bytecodes sounds tricky, but ASM makes it fairly straightforward. We don't describe the process of analyzing and inserting bytecodes in detail. The important point is that the program in Listing 8.9 edits a class file and inserts a logging call at the beginning of the methods annotated with the LogEntry annotation."*

**Dịch:** Chèn những bytecode này nghe có vẻ hóc búa, nhưng **ASM làm nó khá đơn giản**. Điểm quan trọng là chương trình ở Listing 8.9 **sửa một file class và chèn một lời gọi logging vào đầu những method được annotate bằng `LogEntry`**.

> *"For example, here is how you add the logging instructions to Item.java in Listing 8.10, where asm is the directory into which you installed the ASM library:"*

```
javac set/Item.java
javac -classpath .:asm/lib/\* bytecodeAnnotations/EntryLogger.java
java -classpath .:asm/lib/\* bytecodeAnnotations.EntryLogger set.Item
```

**Dịch:** `asm` là **thư mục bạn cài ASM library**.

> *"Try running"*
>
> ```
> javap -c set.Item
> ```
>
> *"before and after modifying the Item class file. You can see the inserted instructions at the beginning of the hashCode, equals, and compareTo methods."*

```
public int hashCode();
  Code:
   0:   ldc #85; // String global
   2:   invokestatic    #80;
        // Method
        // java/util/logging/Logger.getLogger:(Ljava/lang/String;)Ljava/util/logging/Logger;
   5:   ldc             #86; //String Item
   7:   ldc             #88; //String hashCode
   9:   invokevirtual   #84;
        // Method java/util/logging/Logger.entering:(Ljava/lang/String;Ljava/lang/String;)V
   12:  bipush 13
   14:  aload_0
   15:  getfield        #2; // Field description:Ljava/lang/String;
   18:  invokevirtual   #15; // Method java/lang/String.hashCode:()I
   21:  imul
   22:  bipush 17
   24:  aload_0
   25:  getfield        #3; // Field partNumber:I
   28:  imul
   29:  iadd
   30:  ireturn
```

**Dịch:** Thử chạy `javap -c set.Item` **trước và sau khi sửa file class `Item`** — bạn **thấy được các instruction đã chèn vào đầu các method `hashCode`, `equals`, và `compareTo`**.

> *"The SetTest program in Listing 8.11 inserts Item objects into a hash set. When you run it with the modified class file, you will see the logging messages."*

```
May 17, 2016 10:57:59 AM Item hashCode
FINER: ENTRY
May 17, 2016 10:57:59 AM Item hashCode
FINER: ENTRY
May 17, 2016 10:57:59 AM Item hashCode
FINER: ENTRY
May 17, 2016 10:57:59 AM Item equals
FINER: ENTRY
[[description=Toaster, partNumber=1729], [description=Microwave, partNumber=4104]]
```

> *"Note the call to equals when we insert the same item twice."*

**Dịch:** Chương trình `SetTest` **chèn các object `Item` vào một hash set**. Chạy nó với file class đã sửa thì **thấy các logging message**. Chú ý **lời gọi `equals` khi ta chèn cùng một item hai lần**.

> *"This example shows the power of bytecode engineering. Annotations are used to add directives to a program, and a bytecode editing tool picks up the directives and modifies the virtual machine instructions."*

**Dịch:** Ví dụ này cho thấy **sức mạnh của bytecode engineering**: **annotation được dùng để thêm chỉ thị vào một chương trình**, và một **công cụ sửa bytecode nhặt các chỉ thị đó lên rồi sửa các virtual machine instruction**.

### Listing 8.9 — `bytecodeAnnotations/EntryLogger.java`

```java
package bytecodeAnnotations;

import java.io.*;
import java.nio.file.*;

import org.objectweb.asm.*;
import org.objectweb.asm.commons.*;

/**
 * Adds "entering" logs to all methods of a class that have the LogEntry annotation.
 * @version 1.21 2018-05-01
 * @author Cay Horstmann
 */
public class EntryLogger extends ClassVisitor
{
    private String className;

    /**
     * Constructs an EntryLogger that inserts logging into annotated methods of a given class.
     * @param cg the class
     */
    public EntryLogger(ClassWriter writer, String className)
    {
        super(Opcodes.ASM5, writer);
        this.className = className;
    }

    public MethodVisitor visitMethod(int access, String methodName, String desc,
            String signature, String[] exceptions)
    {
        MethodVisitor mv = cv.visitMethod(access, methodName, desc, signature, exceptions);
        return new AdviceAdapter(Opcodes.ASM5, mv, access, methodName, desc)
        {
            private String loggerName;

            public AnnotationVisitor visitAnnotation(String desc, boolean visible)
            {
                return new AnnotationVisitor(Opcodes.ASM5)
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
                    visitLdcInsn(loggerName);
                    visitMethodInsn(INVOKESTATIC, "java/util/logging/Logger", "getLogger",
                        "(Ljava/lang/String;)Ljava/util/logging/Logger;", false);
                    visitLdcInsn(className);
                    visitLdcInsn(methodName);
                    visitMethodInsn(INVOKEVIRTUAL, "java/util/logging/Logger", "entering",
                        "(Ljava/lang/String;Ljava/lang/String;)V", false);
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
        Path path = Paths.get(args[0]);
        var reader = new ClassReader(Files.newInputStream(path));
        var writer = new ClassWriter(
            ClassWriter.COMPUTE_MAXS | ClassWriter.COMPUTE_FRAMES);
        var entryLogger = new EntryLogger(writer,
            path.toString().replace(".class", "").replaceAll("[/\\\\]", "."));
        reader.accept(entryLogger, ClassReader.EXPAND_FRAMES);
        Files.write(Paths.get(args[0]), writer.toByteArray());
    }
}
```

### Listing 8.10 — `set/Item.java`

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

### Listing 8.11 — `set/SetTest.java`

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

## 8.7.2. Modifying Bytecodes at Load Time

> *"In the last section, you saw a tool that edits class files. However, it can be cumbersome to add yet another tool into the build process. An attractive alternative is to defer the bytecode engineering until load time, when the class loader loads the class."*

**Dịch:** Mục trước bạn thấy một công cụ **sửa file class**. Tuy nhiên **thêm một công cụ nữa vào quy trình build có thể rườm rà**. Một lựa chọn hấp dẫn là **hoãn việc bytecode engineering tới lúc load**, khi **class loader load class**.

> *"The instrumentation API has a hook for installing a bytecode transformer. The transformer must be installed before the main method of the program is called. You can meet this requirement by defining an agent, a library that is loaded to monitor a program in some way. The agent code can carry out initializations in a premain method."*

**Dịch:** **Instrumentation API có một hook để cài một bytecode transformer.** **Transformer phải được cài trước khi method `main` của chương trình được gọi.** Bạn đáp ứng yêu cầu này bằng cách **định nghĩa một agent** — **một library được load để theo dõi một chương trình theo cách nào đó**. Code của agent **thực hiện các khởi tạo trong một method `premain`**.

> *"Here are the steps required to build an agent:"*
>
> 1. *"Implement a class with a method"*
>
> ```java
> public static void premain(String arg, Instrumentation instr)
> ```
>
> *"This method is called when the agent is loaded. The agent can get a single command-line argument, which is passed in the arg parameter. The instr parameter can be used to install various hooks."*
>
> 2. *"Make a manifest file EntryLoggingAgent.mf that sets the Premain-Class attribute, for example:"*
>
> ```
> Premain-Class: bytecodeAnnotations.EntryLoggingAgent
> ```
>
> 3. *"Package the agent code and the manifest into a JAR file:"*
>
> ```
> javac -classpath .:asm/lib/\* bytecodeAnnotations/EntryLoggingAgent.java
> jar cvfm EntryLoggingAgent.jar bytecodeAnnotations/EntryLoggingAgent.mf \
>     bytecodeAnnotations/Entry*.class
> ```

**Dịch:** Các bước dựng một agent:

| # | Bước |
|---|---|
| 1 | Implement một class có method `public static void premain(String arg, Instrumentation instr)`. Method này **được gọi khi agent được load**. Agent **nhận được một command-line argument duy nhất**, truyền qua parameter `arg`. Parameter `instr` dùng để **cài các hook khác nhau** |
| 2 | Tạo **manifest file `EntryLoggingAgent.mf`** đặt attribute **`Premain-Class`** |
| 3 | **Đóng gói code agent và manifest vào một file JAR** |

> *"To launch a Java program together with the agent, use the following command-line options:"*

```
java -javaagent:AgentJARFile=agentArgument . . .
```

> *"For example, to run the SetTest program with the entry logging agent, call"*

```
javac set/SetTest.java
java -javaagent:EntryLoggingAgent.jar=set.Item -classpath .:asm/lib/\* set.SetTest
```

> *"The Item argument is the name of the class that the agent should modify."*

**Dịch:** Để **khởi chạy một chương trình Java cùng với agent**, dùng option command-line trên. Argument `Item` là **tên class mà agent nên sửa**.

> *"Listing 8.12 shows the agent code. The agent installs a class file transformer. The transformer first checks whether the class name matches the agent argument. If so, it uses the EntryLogger class from the preceding section to modify the bytecodes. However, the modified bytecodes are not saved to a file. Instead, the transformer returns them for loading into the virtual machine (see Figure 8.3). In other words, this technique carries out "just in time" modification of the bytecodes."*

**Dịch:** Agent **cài một class file transformer**. Transformer **trước hết kiểm tra tên class có khớp với argument của agent không**. Nếu khớp, nó **dùng class `EntryLogger` ở mục trước để sửa bytecode**. Tuy nhiên **bytecode đã sửa không được lưu ra file**; thay vào đó **transformer trả chúng về để load vào virtual machine**. Nói cách khác, kỹ thuật này thực hiện **sửa bytecode "just in time"**.

**Figure 8.3: Modifying classes at load time**

```
                                                        ┌───────────────────────┐
                                                        │        Java           │
                                                        │   Virtual Machine     │
                                                        └───┬───────────────┬───┘
                                                            │               │
                                                   launches ┊               ┊ loads
                                                            ▼               ▼
 ┌───────────┐    ┌────────────────┐    ┌───────────┐    ┌───────────┐   ┌──────────────────┐
 │ @LogEntry │───▶│ Java Compiler  │───▶│ @LogEntry │───▶│   Agent   │──▶│ (no annotations) │
 └───────────┘    └────────────────┘    └───────────┘    └───────────┘   └──────────────────┘
   Source File                            Class File                       Edited Class File
```

### Listing 8.12 — `bytecodeAnnotations/EntryLoggingAgent.java`

```java
package bytecodeAnnotations;

import java.lang.instrument.*;

import org.objectweb.asm.*;

/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
public class EntryLoggingAgent
{
    public static void premain(final String arg, Instrumentation instr)
    {
        instr.addTransformer((loader, className, cl, pd, data) ->
        {
            if (!className.replace("/", ".").equals(arg)) return null;
            var reader = new ClassReader(data);
            var writer = new ClassWriter(
                ClassWriter.COMPUTE_MAXS | ClassWriter.COMPUTE_FRAMES);
            var el = new EntryLogger(writer, className);
            reader.accept(el, ClassReader.EXPAND_FRAMES);
            return writer.toByteArray();
        });
    }
}
```

---

## Tổng kết chương (sách)

> *"In this chapter, you have learned how to"*
>
> - *"Add annotations to Java programs"*
> - *"Design your own annotation interfaces"*
> - *"Implement tools that make use of the annotations"*

**Dịch:** Trong chương này bạn đã học cách **thêm annotation vào chương trình Java**, **thiết kế annotation interface của riêng mình**, và **implement công cụ tận dụng các annotation đó**.

> *"You have seen three technologies for processing code: scripting, compiling Java programs, and processing annotations. The first two were quite straightforward. On the other hand, building annotation tools is undeniably complex and not something that most developers will need to tackle. This chapter gave you the background for understanding the inner workings of the annotation tools you will encounter, and perhaps piqued your interest in developing your own tools."*

**Dịch:** Bạn đã thấy **ba công nghệ xử lý code**: **scripting**, **compile chương trình Java**, và **xử lý annotation**. Hai cái đầu **khá đơn giản**. Ngược lại, **dựng công cụ annotation thì phức tạp không thể chối cãi** và **không phải việc mà đa số lập trình viên cần đụng tới**. Chương này cho bạn **nền tảng để hiểu cơ chế bên trong của các công cụ annotation bạn sẽ gặp**.

> *"The following chapter discusses the Java Platform Module System, the key feature of Java 9 that is important for moving the Java platform forward."*

**Dịch:** Chương sau bàn về **Java Platform Module System**, **tính năng then chốt của Java 9** quan trọng cho việc **đưa Java platform tiến lên phía trước**.

---

## Chương kế tiếp

→ [[01 - The Module Concept (Vol II)]] — Chapter 9: The Java Platform Module System.
