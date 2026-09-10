# 02 — Security Managers and Permissions

> Chapter 10, Section 10.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.
> Sách viết cho Java 11. Cơ chế security manager mô tả trong section này đã bị deprecate ở các bản Java sau — đọc để hiểu lịch sử, không áp dụng cho code mới.

---

## 10.2. Security Managers and Permissions

> *"Once a class has been loaded into the virtual machine and checked by the verifier, the second security mechanism of the Java platform springs into action: the security manager. This is the topic of the following sections."*

**Dịch:** Sau khi một class đã được load vào virtual machine và được **verifier** kiểm tra (xem [[01 - Class Loaders#10.1.5. Bytecode Verification]]), **cơ chế bảo mật thứ hai** của Java platform vào cuộc: **security manager**.

---

## 10.2.1. Permission Checking

> *"The security manager controls whether a specific operation is permitted. Operations checked by the security manager include the following:"*
>
> *"• Creating a new class loader"*
> *"• Exiting the virtual machine"*
> *"• Accessing a field of another class by using reflection"*
> *"• Accessing a file"*
> *"• Opening a socket connection"*
> *"• Starting a print job"*
> *"• Accessing the system clipboard"*
> *"• Accessing the AWT event queue"*
> *"• Bringing up a top-level window"*
>
> *"There are many other checks throughout the Java library."*

**Dịch:** Security manager **kiểm soát xem một thao tác cụ thể có được phép hay không**. Các thao tác được security manager kiểm tra gồm:

| # | Thao tác |
|---|---|
| 1 | Tạo một class loader mới |
| 2 | Thoát khỏi virtual machine |
| 3 | Truy cập field của class khác **bằng reflection** (xem [[10 - Reflection]]) |
| 4 | Truy cập một file |
| 5 | Mở một socket connection |
| 6 | Khởi động một print job |
| 7 | Truy cập system clipboard |
| 8 | Truy cập AWT event queue |
| 9 | Dựng lên một top-level window |

Còn **rất nhiều kiểm tra khác** rải khắp Java library.

> *"The default behavior when running Java applications is to install no security manager, so all these operations are permitted. In contrast, applets relied on a very restrictive security policy. Stricter security also makes sense in other situations."*

**Dịch:** Hành vi **mặc định** khi chạy ứng dụng Java là **không cài security manager nào**, nên mọi thao tác trên đều được phép. Ngược lại, applet dựa vào một **security policy rất hạn chế**. Bảo mật chặt hơn cũng hợp lý trong những tình huống khác.

> *"For example, suppose you run a Tomcat instance and allow collaborators or students to install servlets. You would not want any of them to call System.exit since this would terminate the Tomcat instance. You can set a security policy that causes calls to System.exit to throw a security exception instead of actually closing down the virtual machine. Here is what happens in detail. The exit method of the Runtime class calls the checkExit method of the security manager. Here is the entire code of the exit method:"*

```java
public void exit(int status)
{
    SecurityManager security = System.getSecurityManager();
    if (security != null)
        security.checkExit(status);
    exitInternal(status);
}
```

**Dịch:** Ví dụ bạn chạy một instance Tomcat và cho cộng tác viên hoặc sinh viên cài servlet. Bạn **không muốn ai gọi `System.exit`** vì việc đó sẽ **kết liễu instance Tomcat**. Bạn đặt được security policy khiến lời gọi `System.exit` **ném security exception** thay vì thực sự đóng virtual machine. Method `exit` của class `Runtime` gọi method **`checkExit`** của security manager.

> *"The security manager now checks if the exit request came from the browser or an individual applet. If the security manager agrees with the exit request, the checkExit method simply returns and normal processing continues. However, if the security manager doesn't want to grant the request, the checkExit method throws a SecurityException."*

**Dịch:** Security manager kiểm tra xem yêu cầu exit đến từ browser hay từ một applet riêng lẻ. Nếu security manager **đồng ý**, `checkExit` **chỉ đơn giản return** và xử lý tiếp tục bình thường. Nếu **không muốn cấp phép**, `checkExit` **ném `SecurityException`** (xem [[02 - Catching Exceptions]]).

> *"The exit method continues only if no exception occurred. It then calls the private native exitInternal method that actually terminates the virtual machine. There is no other way to terminate the virtual machine, and since the exitInternal method is private, it cannot be called from any other class. Thus, any code that attempts to exit the virtual machine must go through the exit method and thus through the checkExit security check without triggering a security exception."*

**Dịch:** Method `exit` **chỉ đi tiếp nếu không có exception**. Rồi nó gọi method `private native exitInternal` — thứ thực sự kết thúc virtual machine. **Không còn cách nào khác để kết thúc virtual machine**, và vì `exitInternal` là `private` nên **không class nào khác gọi được**. Do đó, mọi code muốn thoát virtual machine **buộc phải đi qua `exit`** và qua kiểm tra bảo mật `checkExit` **mà không kích hoạt security exception**.

> *"Clearly, the integrity of the security policy depends on careful coding. The providers of system services in the standard library must always consult the security manager before attempting any sensitive operation."*

**Dịch:** Rõ ràng **tính toàn vẹn của security policy phụ thuộc vào việc viết code cẩn thận**. Bên cung cấp system service trong standard library **luôn phải hỏi ý security manager trước khi thực hiện bất kỳ thao tác nhạy cảm nào**.

> *"The security manager of the Java platform allows both programmers and system administrators fine-grained control over individual security permissions. We will describe these features in the following section. First, we'll summarize the Java 2 platform security model. We'll then show how you can control permissions with policy files. Finally, we'll explain how you can define your own permission types."*

**Dịch:** Security manager của Java platform cho phép **cả lập trình viên lẫn system administrator kiểm soát chi tiết từng security permission**.

---

## 10.2.2. Java Platform Security

> *"JDK 1.0 had a very simple security model: Local classes had full permissions, and remote classes were confined to the sandbox. Just like a child that can only play in a sandbox, remote code was only allowed to paint on the screen and interact with the user. The applet security manager denied all access to local resources. JDK 1.1 implemented a slight modification: Remote code that was signed by a trusted entity was granted the same permissions as local classes. However, both versions of the JDK used an all-or-nothing approach. Programs either had full access or they had to play in the sandbox."*

**Dịch:** JDK 1.0 có mô hình bảo mật **rất đơn giản**: class local có **toàn quyền**, class remote bị **nhốt trong sandbox**. Như đứa trẻ chỉ được chơi trong hố cát, remote code chỉ được **vẽ lên màn hình và tương tác với người dùng**. Applet security manager **chặn mọi truy cập tới tài nguyên local**. JDK 1.1 sửa nhẹ: remote code **được ký bởi một thực thể đáng tin cậy** thì có cùng permission như class local. Nhưng cả hai bản JDK đều theo lối **được ăn cả ngã về không** — hoặc toàn quyền, hoặc chơi trong sandbox.

> *"Starting with Java 1.2, the Java platform has a much more flexible mechanism. A security policy maps code sources to permission sets (see Figure 10.5)."*

**Dịch:** **Từ Java 1.2**, Java platform có cơ chế **linh hoạt hơn nhiều**. Một **security policy ánh xạ code source sang tập permission**.

```
   code source  ──────►  permission set
   (code base
    + certificates)
```

> *"A code source is specified by a code base and a set of certificates. The code base specifies the origin of the code. For example, the code base of remote applet code is the HTTP URL from which the applet was loaded. The code base of code in a JAR file is the file's URL. A certificate, if present, is an assurance by some party that the code has not been tampered with. We'll cover certificates later in this chapter."*

**Dịch:** Một **code source** được xác định bởi **code base** và **một tập certificate**. **Code base chỉ ra nguồn gốc của code**: ví dụ code base của remote applet code là **HTTP URL nơi applet được load về**; code base của code trong file JAR là **URL của file đó** (xem [[09 - JAR Files]]). **Certificate**, nếu có, là **sự đảm bảo của một bên nào đó rằng code chưa bị can thiệp**.

> *"A permission is any property that is checked by a security manager. The Java platform supports a number of permission classes, each encapsulating the details of a particular permission. For example, the following instance of the FilePermission class states that it is OK to read and write any file in the /tmp directory:"*

```java
var p = new FilePermission("/tmp/*", "read,write");
```

**Dịch:** **Permission là bất kỳ thuộc tính nào được security manager kiểm tra.** Java platform hỗ trợ **nhiều permission class**, mỗi class đóng gói chi tiết của một permission cụ thể. Ví dụ instance trên của `FilePermission` nói rằng **được phép đọc và ghi mọi file trong thư mục `/tmp`**.

> *"More importantly, the default implementation of the Policy class reads permissions from a permission file. Inside a permission file, the same read permission is expressed as"*

```
permission java.io.FilePermission "/tmp/*", "read,write";
```

**Dịch:** Quan trọng hơn, implementation mặc định của class `Policy` **đọc permission từ một permission file**. Trong permission file, cùng permission đó được viết như trên.

> *"Figure 10.6 shows the hierarchy of the permission classes that were supplied with Java 1.2. Many more permission classes have been added in subsequent Java releases."*

**Dịch:** Nhiều permission class nữa đã được thêm vào ở các bản Java sau.

### Security check method chỉ là tiện lợi

> *"In the preceding section, you saw that the SecurityManager class has security check methods such as checkExit. These methods exist only for the convenience of the programmer and for backward compatibility. They all map to standard permission checks. For example, here is the source code for the checkExit method:"*

```java
public void checkExit()
{
    checkPermission(new RuntimePermission("exitVM"));
}
```

**Dịch:** Class `SecurityManager` có các security check method như `checkExit`. Những method này **chỉ tồn tại cho tiện với lập trình viên và để tương thích ngược**. **Tất cả đều quy về kiểm tra permission chuẩn.**

### Protection domain và call stack

> *"Each class has a protection domain—an object that encapsulates both the code source and the collection of permissions of the class. When the SecurityManager needs to check a permission, it looks at the classes of all methods currently on the call stack. It then gets the protection domains of all classes and asks each protection domain if its permission collection allows the operation currently being checked. If all domains agree, the check passes. Otherwise, a SecurityException is thrown."*

**Dịch:** Mỗi class có một **protection domain** — object đóng gói **cả code source lẫn tập permission** của class. Khi `SecurityManager` cần kiểm tra một permission, nó **nhìn vào class của mọi method đang nằm trên call stack**. Rồi nó lấy protection domain của mọi class đó và **hỏi từng protection domain xem tập permission của nó có cho phép thao tác đang bị kiểm tra không**. **Nếu mọi domain đều đồng ý thì kiểm tra qua**, ngược lại **`SecurityException` được ném ra**.

> *"Why do all methods on the call stack need to allow a particular operation? Let us work through an example. Suppose the init method of a servlet wants to open a file. It might call"*

```java
var in = new FileReader(name);
```

> *"The FileReader constructor calls the FileInputStream constructor, which calls the checkRead method of the security manager, which finally calls checkPermission with a FilePermission(name, "read") object. Table 10.1 shows the call stack."*

**Dịch:** Tại sao **mọi method trên call stack** đều phải cho phép thao tác đó? Giả sử method `init` của một servlet muốn mở file (xem [[06 - Input and Output]]). Constructor của `FileReader` gọi constructor của `FileInputStream`, cái này gọi `checkRead` của security manager, cuối cùng gọi `checkPermission` với object `FilePermission(name, "read")`.

### Table 10.1 — Call Stack During Permission Checking

| Class | Method | Code Source | Permissions |
|---|---|---|---|
| `SecurityManager` | `checkPermission` | `null` | `AllPermission` |
| `SecurityManager` | `checkRead` | `null` | `AllPermission` |
| `FileInputStream` | Constructor | `null` | `AllPermission` |
| `FileReader` | Constructor | `null` | `AllPermission` |
| `Servlet` | `init` | Servlet code source | Tomcat web app permissions |
| ... | | | |

> *"The FileInputStream and SecurityManager classes are system classes for which CodeSource is null and the permissions consist of an instance of the AllPermission class, which allows all operations. Clearly, their permissions alone can't determine the outcome of the check. As you can see, the checkPermission method must take into account the restricted permissions of the applet class. By checking the entire call stack, the security mechanism ensures that one class can never ask another class to carry out a sensitive operation on its behalf."*

**Dịch:** `FileInputStream` và `SecurityManager` là **system class**, với `CodeSource` là `null` và permission là một instance của `AllPermission` — **cho phép mọi thao tác**. Rõ ràng **permission của riêng chúng không thể quyết định kết quả kiểm tra**. `checkPermission` **phải tính đến permission bị hạn chế của class applet**. Bằng cách **kiểm tra toàn bộ call stack**, cơ chế bảo mật đảm bảo **một class không bao giờ nhờ được class khác thực hiện thao tác nhạy cảm thay mình**.

> **Note (sách):** *"This brief discussion of permission checking explains the basic concepts. However, we omit a number of technical details here. With security, the devil lies in the details, and we encourage you to read the book by Li Gong for more information. For a more critical view of the Java platform's security model, see the book Securing Java: Getting Down to Business with Mobile Code, Second Edition, by Gary McGraw and Ed W. Felten (Wiley, 1999). You can find an online version of that book at www.securingjava.com."*
>
> **Dịch:** Phần trình bày ngắn này chỉ giải thích **khái niệm cơ bản** và **bỏ qua nhiều chi tiết kỹ thuật**. Với bảo mật thì **ma quỷ nằm ở chi tiết**; sách khuyến khích đọc thêm cuốn của Li Gong. Góc nhìn phê phán hơn về mô hình bảo mật của Java platform có trong *Securing Java: Getting Down to Business with Mobile Code, Second Edition* của Gary McGraw và Ed W. Felten (Wiley, 1999).

### API — `java.lang.SecurityManager` 1.0

| Method | Mô tả |
|---|---|
| `void checkPermission(Permission p)` 1.2 | Kiểm tra xem security manager này có cấp permission đã cho không. Method **ném `SecurityException`** nếu permission không được cấp. |

### API — `java.lang.Class` 1.0

| Method | Mô tả |
|---|---|
| `ProtectionDomain getProtectionDomain()` 1.2 | Lấy protection domain của class này, hoặc `null` nếu class được load mà không có protection domain. |

### API — `java.security.ProtectionDomain` 1.2

| Method | Mô tả |
|---|---|
| `ProtectionDomain(CodeSource source, PermissionCollection permissions)` | Dựng một protection domain với code source và permission đã cho. |
| `CodeSource getCodeSource()` | Lấy code source của protection domain này. |
| `boolean implies(Permission p)` | Trả về `true` nếu permission đã cho được protection domain này cho phép. |

### API — `java.security.CodeSource` 1.2

| Method | Mô tả |
|---|---|
| `Certificate[] getCertificates()` | Lấy chuỗi certificate cho các chữ ký class file gắn với code source này. |
| `URL getLocation()` | Lấy code base của các class file gắn với code source này. |

---

## 10.2.3. Security Policy Files

> *"The policy manager reads policy files that contain instructions for mapping code sources to permissions. Here is a typical policy file:"*

```
grant codeBase "http://www.horstmann.com/classes"
{
    permission java.io.FilePermission "/tmp/*", "read,write";
};
```

> *"This file grants permission to read and write files in the /tmp directory to all code that was downloaded from www.horstmann.com/classes."*

**Dịch:** **Policy manager đọc các policy file** chứa chỉ dẫn ánh xạ code source sang permission. File trên **cấp quyền đọc và ghi file trong thư mục `/tmp`** cho mọi code tải về từ `www.horstmann.com/classes`.

### Vị trí chuẩn của policy file

> *"You can install policy files in standard locations. By default, there are two locations:"*
>
> *"• The file java.policy in the Java platform's home directory"*
> *"• The file .java.policy (notice the period at the beginning of the file name) in the user's home directory"*

**Dịch:** Mặc định có **hai vị trí**: file `java.policy` trong **home directory của Java platform**, và file `.java.policy` (chú ý **dấu chấm ở đầu tên file**) trong **home directory của user**.

> **Note (sách):** *"You can change the locations of these files in the java.security configuration file in the jdk/conf/security directory. The defaults are specified as"*
>
> ```
> policy.url.1=file:${java.home}/lib/security/java.policy
> policy.url.2=file:${user.home}/.java.policy
> ```
>
> *"A system administrator can modify the java.security file and specify policy URLs that reside on another server and cannot be edited by users. There can be any number of policy URLs (with consecutive numbers) in the policy file. The permissions of all files are combined."*
>
> *"If you want to store policies outside the file system, you can implement a subclass of the Policy class that gathers the permissions. Then change the line"*
>
> ```
> policy.provider=sun.security.provider.PolicyFile
> ```
>
> *"in the java.security configuration file."*
>
> **Dịch:** Bạn đổi được vị trí các file này trong file cấu hình **`java.security`** ở thư mục `jdk/conf/security`. System administrator **sửa được `java.security` và chỉ định policy URL nằm trên server khác mà user không sửa được**. Có thể có **bao nhiêu policy URL cũng được** (đánh số liên tiếp); **permission của mọi file được gộp lại**. Nếu muốn lưu policy **ngoài file system**, implement một subclass của class `Policy` để gom permission, rồi đổi dòng `policy.provider`.

### Chỉ định policy file cho từng ứng dụng

> *"During testing, we don't like to constantly modify the standard policy files. Therefore, we prefer to explicitly name the policy file required for each application. Place the permissions into a separate file—say, MyApp.policy. To apply the policy, you have two choices. You can set a system property inside your application's main method:"*

```java
System.setProperty("java.security.policy", "MyApp.policy");
```

> *"Alternatively, you can start the virtual machine as"*

```
java -Djava.security.policy=MyApp.policy MyApp
```

> *"In these examples, the MyApp.policy file is added to the other policies in effect. If you add a second equal sign, for example:"*

```
java -Djava.security.policy==MyApp.policy MyApp
```

> *"then your application will use only the specified policy file, and the standard policy files will be ignored."*

**Dịch:** Khi test, sách không thích liên tục sửa policy file chuẩn, nên **đặt tên policy file riêng cho từng ứng dụng**. Có hai cách áp dụng: **set system property** trong `main`, hoặc **khởi động virtual machine với `-Djava.security.policy=...`**. Trong các ví dụ này, `MyApp.policy` **được cộng thêm vào các policy khác đang hiệu lực**. Nếu thêm **dấu bằng thứ hai (`==`)** thì ứng dụng **chỉ dùng policy file chỉ định**, và **policy file chuẩn bị bỏ qua**.

> **Caution (sách):** *"An easy mistake during testing is to accidentally leave a .java.policy file that grants a lot of permissions, perhaps even AllPermission, in the home directory. If you find that your application doesn't seem to pay attention to the restrictions in your policy file, check for a left-behind .java.policy file in your home directory. If you use a UNIX system, this is a particularly easy mistake to make because files with names that start with a period are not displayed by default."*
>
> **Dịch:** Một lỗi dễ mắc khi test là **vô tình để sót file `.java.policy`** cấp rất nhiều permission — thậm chí `AllPermission` — trong home directory. Nếu thấy ứng dụng **có vẻ không thèm để ý tới các hạn chế** trong policy file của bạn, hãy **kiểm tra file `.java.policy` bị bỏ quên**. Trên UNIX lỗi này **đặc biệt dễ mắc** vì file có tên bắt đầu bằng dấu chấm **không hiện ra theo mặc định**.

### Cài security manager

> *"As you saw previously, Java applications by default do not install a security manager. Therefore, you won't see the effect of policy files until you install one. You can, of course, add a line"*

```java
System.setSecurityManager(new SecurityManager());
```

> *"into your main method. Or you can add the command-line option -Djava.security.manager when starting the virtual machine."*

```
java -Djava.security.manager -Djava.security.policy=MyApp.policy MyApp
```

**Dịch:** Ứng dụng Java **mặc định không cài security manager**, nên bạn **không thấy tác dụng của policy file cho tới khi cài một cái**. Cách 1: thêm dòng `System.setSecurityManager(...)` vào `main`. Cách 2: thêm option dòng lệnh **`-Djava.security.manager`** khi khởi động virtual machine.

### Cấu trúc grant entry

> *"A policy file contains a sequence of grant entries. Each entry has the following form:"*

```
grant codesource
{
    permission1;
    permission2;
    . . .
};
```

> *"The code source contains a code base (which can be omitted if the entry applies to code from all sources) and the names of trusted principals and certificate signers (which can be omitted if signatures are not required for this entry). The code base is specified as"*

```
codeBase "url"
```

**Dịch:** Policy file chứa **một dãy grant entry**. Code source gồm **code base** (bỏ được nếu entry áp dụng cho code từ mọi nguồn) và **tên các trusted principal cùng certificate signer** (bỏ được nếu entry này không đòi chữ ký).

> *"If the URL ends in a /, it refers to a directory. Otherwise, it is taken to be the name of a JAR file. For example,"*

```
grant codeBase "www.horstmann.com/classes/" { . . . };
grant codeBase "www.horstmann.com/classes/MyApp.jar" { . . . };
```

> *"The code base is a URL and should always contain forward slashes as file separators, even for file URLs in Windows. For example,"*

```
grant codeBase "file:C:/myapps/classes/" { . . . };
```

**Dịch:** URL **kết thúc bằng `/`** thì trỏ tới **directory**, ngược lại là **tên file JAR**. Code base là URL và **luôn phải dùng dấu gạch chéo xuôi làm dấu ngăn file**, kể cả với file URL trên Windows.

> **Note (sách):** *"Everyone knows that http URLs start with two slashes (http://). But there is enough confusion about file URLs, so the policy file reader accepts two forms of file URLs—namely, file://localFile and file:localFile. Furthermore, a slash before a Windows drive letter is optional. That is, all of the following are acceptable:"*
>
> ```
> file:C:/dir/filename.ext
> file:/C:/dir/filename.ext
> file://C:/dir/filename.ext
> file:///C:/dir/filename.ext
> ```
>
> *"Actually, in our tests, the file:////C:/dir/filename.ext is acceptable as well, and we have no explanation for that."*
>
> **Dịch:** Ai cũng biết http URL bắt đầu bằng hai gạch chéo. Nhưng vì **file URL gây khá nhiều nhầm lẫn**, policy file reader **chấp nhận hai dạng file URL**: `file://localFile` và `file:localFile`. Ngoài ra **dấu gạch chéo trước ký tự ổ đĩa Windows là tuỳ chọn**. Trong các bài test của sách thì `file:////C:/dir/filename.ext` **cũng được chấp nhận**, và sách **không có lời giải thích nào cho chuyện đó**.

> **Note (sách):** *"Consider an application that compiles some Java code, which requires a large number of permissions. Prior to JDK 9, you could have granted all permissions to the code in the tools.jar file. This JAR file doesn't exist anymore. Instead, give permissions to the appropriate module, like this:"*
>
> ```
> grant codeBase "jrt:/jdk.compiler"
> {
>     permission java.security.AllPermission;
> };
> ```
>
> **Dịch:** Xét ứng dụng biên dịch code Java — việc này cần **rất nhiều permission**. Trước JDK 9 bạn cấp mọi permission cho code trong file `tools.jar`. **File JAR này không còn tồn tại nữa.** Thay vào đó, hãy **cấp permission cho module tương ứng**.

### Cấu trúc permission

> *"The permissions have the following structure:"*

```
permission className targetName, actionList;
```

> *"The className is the fully qualified class name of the permission class (such as java.io.FilePermission). The targetName is a permission-specific value—for example, a file or directory name for the file permission, or a host and port for a socket permission. The actionList is also permission-specific. It is a list of actions, such as read or connect, separated by commas. Some permission classes don't need target names and action lists. Table 10.2 lists the commonly used permission classes and their actions."*

**Dịch:** `className` là **fully qualified class name** của permission class (như `java.io.FilePermission`). `targetName` là **giá trị riêng theo từng permission** — ví dụ tên file/directory cho file permission, hoặc host và port cho socket permission. `actionList` cũng riêng theo permission: **danh sách action ngăn nhau bằng dấu phẩy**, như `read` hay `connect`. **Một số permission class không cần target name và action list.**

### Table 10.2 — Permissions and Their Associated Targets and Actions

| Permission | Target | Action |
|---|---|---|
| `java.io.FilePermission` | File target (xem phần dưới) | `read`, `write`, `execute`, `delete` |
| `java.net.SocketPermission` | Socket target (xem phần dưới) | `accept`, `connect`, `listen`, `resolve` |
| `java.util.PropertyPermission` | Property target (xem phần dưới) | `read`, `write` |
| `java.lang.RuntimePermission` | `createClassLoader`<br>`getClassLoader`<br>`setContextClassLoader`<br>`enableContextClassLoaderOverride`<br>`createSecurityManager`<br>`setSecurityManager`<br>`exitVM`<br>`getenv.variableName`<br>`shutdownHooks`<br>`setFactory`<br>`setIO`<br>`modifyThread`<br>`stopThread`<br>`modifyThreadGroup`<br>`getProtectionDomain`<br>`readFileDescriptor`<br>`writeFileDescriptor`<br>`loadLibrary.libraryName`<br>`accessClassInPackage.packageName`<br>`defineClassInPackage.packageName`<br>`accessDeclaredMembers.className`<br>`queuePrintJob`<br>`getStackTrace`<br>`setDefaultUncaughtExceptionHandler`<br>`preferences`<br>`usePolicy` | None |
| `java.awt.AWTPermission` | `showWindowWithoutWarningBanner`<br>`accessClipboard`<br>`accessEventQueue`<br>`createRobot`<br>`fullScreenExclusive`<br>`listenToAllAWTEvents`<br>`readDisplayPixels`<br>`replaceKeyboardFocusManager`<br>`watchMousePointer`<br>`setWindowAlwaysOnTop`<br>`setAppletStub` | None |
| `java.net.NetPermission` | `setDefaultAuthenticator`<br>`specifyStreamHandler`<br>`requestPasswordAuthentication`<br>`setProxySelector`<br>`getProxySelector`<br>`setCookieHandler`<br>`getCookieHandler`<br>`setResponseCache`<br>`getResponseCache` | None |
| `java.lang.reflect.ReflectPermission` | `suppressAccessChecks` | None |
| `java.io.SerializablePermission` | `enableSubclassImplementation`<br>`enableSubstitution` | None |
| `java.security.SecurityPermission` | `createAccessControlContext`<br>`getDomainCombiner`<br>`getPolicy`<br>`setPolicy`<br>`getProperty.keyName`<br>`setProperty.keyName`<br>`insertProvider.providerName`<br>`removeProvider.providerName`<br>`setSystemScope`<br>`setIdentityPublicKey`<br>`setIdentityInfo`<br>`addIdentityCertificate`<br>`removeIdentityCertificate`<br>`printIdentity`<br>`clearProviderProperties.providerName`<br>`putProviderProperty.providerName`<br>`removeProviderProperty.providerName`<br>`getSignerPrivateKey`<br>`setSignerKeyPair` | None |
| `java.security.AllPermission` | None | None |
| `javax.audio.AudioPermission` | `play`, `record` | None |
| `javax.security.auth.AuthPermission` | `doAs`<br>`doAsPrivileged`<br>`getSubject`<br>`getSubjectFromDomainCombiner`<br>`setReadOnly`<br>`modifyPrincipals`<br>`modifyPublicCredentials`<br>`modifyPrivateCredentials`<br>`refreshCredential`<br>`destroyCredential`<br>`createLoginContext.contextName`<br>`getLoginConfiguration`<br>`setLoginConfiguration`<br>`refreshLoginConfiguration` | None |
| `java.util.logging.LoggingPermission` | `control` | None |
| `java.sql.SQLPermission` | `setLog` | None |

> *"As you can see from Table 10.2, most permissions simply permit a particular operation. You can think of the operation as the target with an implied action "permit". These permission classes all extend the BasicPermission class (see Figure 10.6). However, the targets for the file, socket, and property permissions are more complex, and we need to investigate them in detail."*

**Dịch:** Phần lớn permission **chỉ đơn giản cho phép một thao tác cụ thể**. Có thể coi thao tác đó là **target với action ngầm định là "permit"**. Những permission class này **đều extend class `BasicPermission`**. Nhưng target của **file, socket và property permission thì phức tạp hơn**.

### File permission target

> *"File permission targets can have the following form:"*

| Target | Ý nghĩa |
|---|---|
| `file` | A file — một file |
| `directory/` | A directory — một directory |
| `directory/*` | All files in the directory — mọi file trong directory |
| `*` | All files in the current directory — mọi file trong directory hiện tại |
| `directory/-` | All files in the directory or one of its subdirectories — mọi file trong directory hoặc trong một subdirectory của nó |
| `-` | All files in the current directory or one of its subdirectories — mọi file trong directory hiện tại hoặc subdirectory của nó |
| `<<ALL FILES>>` | All files in the file system — mọi file trong file system |

> *"For example, the following permission entry gives access to all files in the directory /myapp and any of its subdirectories:"*

```
permission java.io.FilePermission "/myapp/-", "read,write,delete";
```

> *"You must use the \\ escape sequence to denote a backslash in a Windows file name."*

```
permission java.io.FilePermission "c:\\myapp\\-", "read,write,delete";
```

**Dịch:** Phải dùng **escape sequence `\\`** để biểu diễn dấu gạch chéo ngược trong tên file Windows.

### Socket permission target

> *"Socket permission targets consist of a host and a port range. Host specifications have the following form:"*

| Host | Ý nghĩa |
|---|---|
| `hostname` hoặc `IPaddress` | A single host — một host duy nhất |
| `localhost` hoặc chuỗi rỗng | The local host |
| `*.domainSuffix` | Any host whose domain ends with the given suffix — mọi host có domain kết thúc bằng hậu tố đã cho |
| `*` | All hosts — mọi host |

> *"Port ranges are optional and have the form:"*

| Port range | Ý nghĩa |
|---|---|
| `:n` | A single port — một port duy nhất |
| `:n-` | All ports numbered n and above — mọi port từ n trở lên |
| `:-n` | All ports numbered n and below — mọi port từ n trở xuống |
| `:n1-n2` | All ports in the given range — mọi port trong khoảng đã cho |

> *"Here is an example:"*

```
permission java.net.SocketPermission "*.horstmann.com:8000-8999", "connect";
```

### Property permission target

> *"Finally, property permission targets can have one of two forms:"*

| Target | Ý nghĩa |
|---|---|
| `property` | A specific property — một property cụ thể |
| `propertyPrefix.*` | All properties with the given prefix — mọi property có tiền tố đã cho |

> *"Examples are "java.home" and "java.vm.*"."*

> *"For example, the following permission entry allows a program to read all properties that start with java.vm:"*

```
permission java.util.PropertyPermission "java.vm.*", "read";
```

### System property trong policy file

> *"You can use system properties in policy files. The token ${property} is replaced by the property value. For example, ${user.home} is replaced by the home directory of the user. Here is a typical use of this system property in a permission entry:"*

```
permission java.io.FilePermission "${user.home}", "read,write";
```

> *"To create platform-independent policy files, it is a good idea to use the file.separator property instead of explicit / or \\ separators. To make this simpler, the special notation ${/} is a shortcut for ${file.separator}. For example,"*

```
permission java.io.FilePermission "${user.home}${/}-", "read,write";
```

> *"is a portable entry for granting permission to read and write in the user's home directory and any of its subdirectories."*

**Dịch:** Bạn **dùng được system property trong policy file**: token `${property}` **được thay bằng giá trị của property**. Để tạo policy file **độc lập nền tảng**, nên dùng property **`file.separator`** thay vì viết thẳng `/` hay `\\`. Ký hiệu đặc biệt **`${/}` là lối tắt cho `${file.separator}`**.

---

## 10.2.4. Custom Permissions

> *"In this section, you'll see how you can supply your own permission class that users can refer to in their policy files."*

> *"To implement your permission class, extend the Permission class and supply the following methods:"*
>
> *"• A constructor with two String parameters, for the target and the action list"*
> *"• String getActions()"*
> *"• boolean equals(Object other)"*
> *"• int hashCode()"*
> *"• boolean implies(Permission other)"*

**Dịch:** Để implement permission class của riêng bạn, **extend class `Permission`** và cung cấp:

| # | Thành phần |
|---|---|
| 1 | Một constructor với **hai parameter `String`**, cho **target** và **action list** |
| 2 | `String getActions()` |
| 3 | `boolean equals(Object other)` |
| 4 | `int hashCode()` |
| 5 | `boolean implies(Permission other)` |

### Method `implies`

> *"The last method is the most important. Permissions have an ordering, in which more general permissions imply more specific ones. Consider the file permission"*

```java
p1 = new FilePermission("/tmp/-", "read, write");
```

> *"This permission allows reading and writing of any file in the /tmp directory and any of its subdirectories."*

> *"This permission implies other, more specific permissions:"*

```java
p2 = new FilePermission("/tmp/-", "read");
p3 = new FilePermission("/tmp/aFile", "read, write");
p4 = new FilePermission("/tmp/aDirectory/-", "write");
```

**Dịch:** Method cuối là **quan trọng nhất**. Permission **có thứ tự**, trong đó **permission tổng quát hơn imply permission cụ thể hơn**.

> *"In other words, a file permission p1 implies another file permission p2 if"*
>
> *"1. The target file set of p1 contains the target file set of p2."*
> *"2. The action set of p1 contains the action set of p2."*

**Dịch:** Nói cách khác, file permission `p1` **implies** file permission `p2` nếu: (1) **tập file target của `p1` chứa tập file target của `p2`**; và (2) **tập action của `p1` chứa tập action của `p2`**.

> *"Consider the following example of the use of the implies method. When the FileInputStream constructor wants to open a file for reading, it checks whether it has permission to do so. For that check, a specific file permission object is passed to the checkPermission method:"*

```java
checkPermission(new FilePermission(fileName, "read"));
```

> *"The security manager now asks all applicable permissions whether they imply this permission. If any one of them implies it, the check passes."*

> *"In particular, the AllPermission implies all other permissions."*

**Dịch:** Security manager **hỏi mọi permission áp dụng được xem chúng có imply permission này không**. **Chỉ cần một cái imply là kiểm tra qua.** Đặc biệt, **`AllPermission` implies mọi permission khác**.

> *"If you define your own permission classes, you need to define a suitable notion of implication for your permission objects. Suppose, for example, that you define a TVPermission for a set-top box powered by Java technology. A permission"*

```java
new TVPermission("Tommy:2-12:1900-2200", "watch,record")
```

> *"might allow Tommy to watch and record television channels 2–12 between 19:00 and 22:00. You need to implement the implies method so that this permission implies a more specific one, such as"*

```java
new TVPermission("Tommy:4:2000-2100", "watch")
```

**Dịch:** Nếu bạn định nghĩa permission class riêng, bạn phải **định nghĩa khái niệm implication phù hợp** cho permission object của mình. Ví dụ `TVPermission` cho một set-top box chạy công nghệ Java: permission trên cho Tommy **xem và ghi kênh 2–12 trong khoảng 19:00–22:00**. Phải implement `implies` sao cho permission này **imply một permission cụ thể hơn**.

---

## 10.2.5. Implementation of a Permission Class

> *"In the next sample program, we implement a new permission for monitoring the insertion of text into a text area. The program ensures that you cannot add bad words such as sex, drugs, and C++ into a text area. We use a custom permission class so that the list of bad words can be supplied in a policy file."*

> *"The following subclass of JTextArea asks the security manager whether it is OK to add new text:"*

```java
class WordCheckTextArea extends JTextArea
{
    public void append(String text)
    {
        var p = new WordCheckPermission(text, "insert");
        SecurityManager manager = System.getSecurityManager();
        if (manager != null) manager.checkPermission(p);
        super.append(text);
    }
}
```

> *"If the security manager grants the WordCheckPermission, the text is appended. Otherwise, the checkPermission method throws an exception."*

**Dịch:** Chương trình mẫu implement một permission mới **giám sát việc chèn text vào text area**, đảm bảo **không thêm được các từ xấu** như *sex*, *drugs*, *C++*. Dùng custom permission class để **danh sách từ xấu cấp được trong policy file**. Nếu security manager **cấp `WordCheckPermission`** thì text được append, ngược lại `checkPermission` **ném exception**.

> *"Word check permissions have two possible actions: insert (the permission to insert a specific text) and avoid (the permission to add any text that avoids certain bad words). You should run this program with the following policy file:"*

```
grant
{
    permission permissions.WordCheckPermission "sex,drugs,C++", "avoid";
};
```

> *"This policy file grants the permission to insert any text that avoids the bad words sex, drugs, and C++."*

**Dịch:** Word check permission có **hai action**: **`insert`** (quyền chèn một text cụ thể) và **`avoid`** (quyền thêm bất kỳ text nào **tránh được** một số từ xấu).

### Quy tắc implication của `WordCheckPermission`

> *"When designing the WordCheckPermission class, we must pay particular attention to the implies method. Here are the rules that control whether permission p1 implies permission p2:"*

> *"• If p1 has action avoid and p2 has action insert, then the target of p2 must avoid all words in p1. For example, the permission"*

```
permissions.WordCheckPermission "sex,drugs,C++", "avoid"
```

> *"implies the permission"*

```
permissions.WordCheckPermission "Mary had a little lamb", "insert"
```

> *"• If p1 and p2 both have action avoid, then the word set of p2 must contain all words in the word set of p1. For example, the permission"*

```
permissions.WordCheckPermission "sex,drugs", "avoid"
```

> *"implies the permission"*

```
permissions.WordCheckPermission "sex,drugs,C++", "avoid"
```

> *"• If p1 and p2 both have action insert, then the text of p1 must contain the text of p2. For example, the permission"*

```
permissions.WordCheckPermission "Mary had a little lamb", "insert"
```

> *"implies the permission"*

```
permissions.WordCheckPermission "a little lamb", "insert"
```

**Dịch:**

| Trường hợp | Quy tắc để `p1` implies `p2` |
|---|---|
| `p1` = `avoid`, `p2` = `insert` | **Target của `p2` phải tránh mọi từ trong `p1`** |
| `p1`, `p2` đều `avoid` | **Tập từ của `p2` phải chứa mọi từ trong tập từ của `p1`** |
| `p1`, `p2` đều `insert` | **Text của `p1` phải chứa text của `p2`** |

> *"Note that to retrieve the permission target, you need to use the confusingly named getName method of the Permission class."*

**Dịch:** Để lấy target của permission, bạn phải dùng method **`getName`** của class `Permission` — **cái tên gây nhầm lẫn**.

> *"Since permissions are described by a pair of strings in policy files, permission classes need to be prepared to parse these strings. In particular, we use the following method to transform the comma-separated list of bad words of an avoid permission into a genuine Set:"*

```java
public Set<String> badWordSet()
{
    var set = new HashSet<String>();
    set.addAll(List.of(getName().split(",")));
    return set;
}
```

> *"This code allows us to use the equals and containsAll methods to compare sets. As you saw in Chapter 9 of Volume I, the equals method of a set class finds two sets to be equal if they contain the same elements in any order. For example, the sets resulting from "sex,drugs,C++" and "C++,drugs,sex" are equal."*

**Dịch:** Vì permission được mô tả bằng **một cặp string** trong policy file, permission class **phải sẵn sàng parse các string này**. Code trên cho phép dùng `equals` và `containsAll` để so sánh set. Như đã thấy ở [[09 - Collections]] của Volume I, method `equals` của một set class coi **hai set bằng nhau nếu chúng chứa cùng các phần tử, theo thứ tự bất kỳ**.

> **Caution (sách):** *"Make sure that your permission class is a public class. The policy file loader cannot load classes with package visibility, and it silently ignores any classes it cannot find."*
>
> **Dịch:** Nhớ để permission class của bạn là **class `public`**. Policy file loader **không load được class có package visibility** (xem [[08 - Packages]]), và nó **âm thầm bỏ qua mọi class nó không tìm thấy**.

> *"The program in Listing 10.5 shows how the WordCheckPermission class works. Type any text into the text field and click the Insert button. If the security check passes, the text is appended to the text area. If not, an error message is displayed (see Figure 10.7)."*

> *"You have now seen how to configure Java platform security. Most commonly, you will simply tweak the standard permissions. For additional control, you can define custom permissions that can be configured in the same way as the standard permissions."*

**Dịch:** Bạn đã thấy cách cấu hình bảo mật Java platform. Thường thì bạn chỉ **chỉnh sửa các permission chuẩn**. Muốn kiểm soát thêm thì **định nghĩa custom permission**, cấu hình y hệt cách cấu hình permission chuẩn.

### Listing 10.4 — `permissions/WordCheckPermission.java`

```java
package permissions;

import java.security.*;
import java.util.*;

/**
 * A permission that checks for bad words.
 */
public class WordCheckPermission extends Permission
{
    private String action;

    /**
     * Constructs a word check permission.
     * @param target a comma separated word list
     * @param anAction "insert" or "avoid"
     */
    public WordCheckPermission(String target, String anAction)
    {
        super(target);
        action = anAction;
    }

    public String getActions()
    {
        return action;
    }

    public boolean equals(Object other)
    {
        if (other == null) return false;
        if (!getClass().equals(other.getClass())) return false;
        var b = (WordCheckPermission) other;
        if (!Objects.equals(action, b.action)) return false;
        if ("insert".equals(action)) return Objects.equals(getName(), b.getName());
        else if ("avoid".equals(action)) return badWordSet().equals(b.badWordSet());
        else return false;
    }

    public int hashCode()
    {
        return Objects.hash(getName(), action);
    }

    public boolean implies(Permission other)
    {
        if (!(other instanceof WordCheckPermission)) return false;
        var b = (WordCheckPermission) other;
        if (action.equals("insert"))
        {
            return b.action.equals("insert") && getName().indexOf(b.getName()) >= 0;
        }
        else if (action.equals("avoid"))
        {
            if (b.action.equals("avoid")) return b.badWordSet().containsAll(badWordSet());
            else if (b.action.equals("insert"))
            {
                for (String badWord : badWordSet())
                    if (b.getName().indexOf(badWord) >= 0) return false;
                return true;
            }
            else return false;
        }
        else return false;
    }

    /**
     * Gets the bad words that this permission rule describes.
     * @return a set of the bad words
     */
    public Set<String> badWordSet()
    {
        var set = new HashSet<String>();
        set.addAll(List.of(getName().split(",")));
        return set;
    }
}
```

### Listing 10.5 — `permissions/PermissionTest.java`

```java
package permissions;

import java.awt.*;

import javax.swing.*;

/**
 * This class demonstrates the custom WordCheckPermission.
 * @version 1.05 2018-05-01
 * @author Cay Horstmann
 */
public class PermissionTest
{
    public static void main(String[] args)
    {
        System.setProperty("java.security.policy", "permissions/PermissionTest.policy");
        System.setSecurityManager(new SecurityManager());
        EventQueue.invokeLater(() ->
        {
            var frame = new PermissionTestFrame();
            frame.setTitle("PermissionTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * This frame contains a text field for inserting words into a text area that is protected
 * from "bad words".
 */
class PermissionTestFrame extends JFrame
{
    private JTextField textField;
    private WordCheckTextArea textArea;
    private static final int TEXT_ROWS = 20;
    private static final int TEXT_COLUMNS = 60;

    public PermissionTestFrame()
    {
        textField = new JTextField(20);
        var panel = new JPanel();
        panel.add(textField);
        var openButton = new JButton("Insert");
        panel.add(openButton);
        openButton.addActionListener(event -> insertWords(textField.getText()));

        add(panel, BorderLayout.NORTH);

        textArea = new WordCheckTextArea();
        textArea.setRows(TEXT_ROWS);
        textArea.setColumns(TEXT_COLUMNS);
        add(new JScrollPane(textArea), BorderLayout.CENTER);
        pack();
    }

    /**
     * Tries to insert words into the text area. Displays a dialog if the attempt fails.
     * @param words the words to insert
     */
    public void insertWords(String words)
    {
        try
        {
            textArea.append(words + "\n");
        }
        catch (SecurityException ex)
        {
            JOptionPane.showMessageDialog(this, "I am sorry, but I cannot do that.");
            ex.printStackTrace();
        }
    }
}

/**
 * A text area whose append method makes a security check to see that no bad words are added.
 */
class WordCheckTextArea extends JTextArea
{
    public void append(String text)
    {
        var p = new WordCheckPermission(text, "insert");
        SecurityManager manager = System.getSecurityManager();
        if (manager != null) manager.checkPermission(p);
        super.append(text);
    }
}
```

### API — `java.security.Permission` 1.2

| Method | Mô tả |
|---|---|
| `Permission(String name)` | Dựng một permission với target name đã cho. |
| `String getName()` | Trả về target name của permission này. |
| `boolean implies(Permission other)` | Kiểm tra xem permission này có imply permission kia không. Điều đó đúng khi permission kia **mô tả một điều kiện cụ thể hơn, là hệ quả của điều kiện mà permission này mô tả**. |

---

## Bài kế tiếp

→ [[03 - User Authentication]] — JAAS framework, login module, principal, role-based authentication.
