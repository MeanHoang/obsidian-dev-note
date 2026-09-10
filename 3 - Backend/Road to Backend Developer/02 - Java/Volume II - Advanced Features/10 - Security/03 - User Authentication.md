# 03 — User Authentication

> Chapter 10, Section 10.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.3. User Authentication

> *"The Java API provides a framework, called the Java Authentication and Authorization Service (JAAS), that integrates platform-provided authentication with permission management. We'll discuss the JAAS framework in the following sections."*

**Dịch:** Java API cung cấp một framework tên **Java Authentication and Authorization Service (JAAS)**, **tích hợp phần authentication do nền tảng cung cấp với việc quản lý permission** (xem [[02 - Security Managers and Permissions]]).

---

## 10.3.1. The JAAS Framework

> *"As you can tell from its name, the JAAS framework has two components. The "authentication" part is concerned with ascertaining the identity of a program user. The "authorization" part maps users to permissions."*

**Dịch:** Như tên gọi, JAAS framework có **hai thành phần**: phần **"authentication"** lo việc **xác định danh tính của người dùng chương trình**; phần **"authorization"** **ánh xạ user sang permission**.

> *"JAAS is a "pluggable" API that isolates Java applications from the particular technology used to implement authentication. It supports, among others, UNIX logins, Windows logins, Kerberos authentication, and certificate-based authentication."*

**Dịch:** JAAS là API **"pluggable"**, **cô lập ứng dụng Java khỏi công nghệ cụ thể dùng để implement authentication**. Nó hỗ trợ (trong số khác) **UNIX login, Windows login, Kerberos authentication, và certificate-based authentication**.

> *"Once a user has been authenticated, you can attach a set of permissions. For example, here we grant Harry a particular set of permissions that other users do not have:"*

```
grant principal com.sun.security.auth.UnixPrincipal "harry"
{
    permission java.util.PropertyPermission "user.*", "read";
    . . .
};
```

> *"The com.sun.security.auth.UnixPrincipal class checks the name of the UNIX user who is running this program. Its getName method returns the UNIX login name, and we check whether that name equals "harry"."*

**Dịch:** Sau khi user được authenticate, bạn **gắn được một tập permission**. Class `com.sun.security.auth.UnixPrincipal` **kiểm tra tên của UNIX user đang chạy chương trình**; method `getName` trả về **UNIX login name**, và ta kiểm tra tên đó có bằng `"harry"` không.

### LoginContext

> *"Use a LoginContext to allow the security manager to check such a grant statement. Here is the basic outline of the login code:"*

```java
try
{
    System.setSecurityManager(new SecurityManager());
    var context = new LoginContext("Login1"); // defined in JAAS configuration file
    context.login();
    // get the authenticated Subject
    Subject subject = context.getSubject();
    . . .
    context.logout();
}
catch (LoginException exception) // thrown if login was not successful
{
    exception.printStackTrace();
}
```

> *"Now the subject denotes the individual who has been authenticated."*

**Dịch:** Dùng **`LoginContext`** để security manager kiểm tra được một `grant` statement như vậy. Khi đó **`subject` chỉ tới cá nhân đã được authenticate**. (`LoginException` — xem [[02 - Catching Exceptions]].)

> *"The string parameter "Login1" in the LoginContext constructor refers to an entry with the same name in the JAAS configuration file. Here is a sample configuration file:"*

```
Login1
{
    com.sun.security.auth.module.UnixLoginModule required;
    com.whizzbang.auth.module.RetinaScanModule sufficient;
};
Login2
{
    . . .
};
```

**Dịch:** Parameter chuỗi `"Login1"` trong constructor của `LoginContext` **trỏ tới một entry cùng tên trong JAAS configuration file**.

> *"Of course, the JDK contains no biometric login modules. The following modules are supplied in the com.sun.security.auth.module package:"*

```
UnixLoginModule
NTLoginModule
Krb5LoginModule
JndiLoginModule
KeyStoreLoginModule
```

**Dịch:** Dĩ nhiên **JDK không chứa login module sinh trắc học nào**. Các module trên được cung cấp trong package `com.sun.security.auth.module`.

> *"A login policy consists of a sequence of login modules, each labeled required, sufficient, requisite, or optional. The meaning of these keywords is given by the following algorithm."*

**Dịch:** Một **login policy** gồm **một dãy login module**, mỗi cái được gán nhãn **`required`, `sufficient`, `requisite`, hoặc `optional`**.

### Subject và principal

> *"A login authenticates a subject, which can have multiple principals. A principal describes some property of the subject, such as the user name, group ID, or role. As you saw in the grant statement, principals govern permissions. The com.sun.security.auth.UnixPrincipal describes the UNIX login name, and the UnixNumericGroupPrincipal can test for membership in a UNIX group."*

**Dịch:** Một lần login **authenticate một subject**, và subject **có thể có nhiều principal**. **Principal mô tả một thuộc tính nào đó của subject**, như user name, group ID, hay role. Như đã thấy trong câu `grant`, **principal chi phối permission**. `com.sun.security.auth.UnixPrincipal` mô tả **UNIX login name**, còn `UnixNumericGroupPrincipal` **kiểm tra được tư cách thành viên trong một UNIX group**.

> *"A grant clause can test for a principal, with the syntax"*

```
grant principalClass "principalName"
```

> *"For example:"*

```
grant com.sun.security.auth.UnixPrincipal "harry"
```

**Dịch:** Mệnh đề `grant` **kiểm tra được một principal** với cú pháp trên.

### doAs và doAsPrivileged

> *"When a user has logged in, you then run, in a separate access control context, the code that requires checking of principals. Use the static doAs or doAsPrivileged method to start a new PrivilegedAction whose run method executes the code. Both of those methods execute an action by calling the run method of an object that implements the PrivilegedAction interface, using the permissions of the subject's principals:"*

```java
PrivilegedAction<T> action = () ->
{
    // run with permissions of subject principals
    . . .
};
T result
    = Subject.doAs(subject, action); // or Subject.doAsPrivileged(subject, action, null)
```

> *"If the actions can throw checked exceptions, you need to implement the PrivilegedExceptionAction interface instead."*

**Dịch:** Sau khi user đã login, bạn chạy phần code cần kiểm tra principal **trong một access control context riêng**. Dùng static method **`doAs`** hoặc **`doAsPrivileged`** để khởi động một `PrivilegedAction` mới, mà method `run` của nó thực thi code đó. Cả hai method **chạy action bằng cách gọi `run` của một object implement interface `PrivilegedAction`, dùng permission của các principal của subject**. Nếu action **ném được checked exception** thì phải implement interface **`PrivilegedExceptionAction`** thay thế.

> *"The difference between the doAs and doAsPrivileged methods is subtle. The doAs method starts out with the current access control context, whereas the doAsPrivileged method starts out with a new context. The latter method allows you to separate the permissions for the login code and the "business logic." In our example application, the login code has permissions"*

```
permission javax.security.auth.AuthPermission "createLoginContext.Login1";
permission javax.security.auth.AuthPermission "doAsPrivileged";
```

> *"The authenticated user has a permission"*

```
permission java.util.PropertyPermission "user.*", "read";
```

> *"If we had used doAs instead of doAsPrivileged, then the login code would have also needed that permission!"*

**Dịch:** Khác biệt giữa `doAs` và `doAsPrivileged` **rất tinh tế**: `doAs` **bắt đầu với access control context hiện tại**, còn `doAsPrivileged` **bắt đầu với một context mới**. Method sau cho phép bạn **tách permission của login code khỏi permission của "business logic"**. Nếu dùng `doAs` thay cho `doAsPrivileged` thì **login code cũng sẽ cần luôn permission đó**.

| Method | Điểm khác |
|---|---|
| `doAs` | Bắt đầu với **access control context hiện tại** |
| `doAsPrivileged` | Bắt đầu với **context mới** → tách được permission của login code khỏi business logic |

### Chạy chương trình ví dụ

> *"The program in Listings 10.6 and 10.7 demonstrates how to restrict permissions to certain users. The AuthTest program authenticates a user and runs a simple action that retrieves a system property."*

> *"To make this example work, package the code for the login and the action into two separate JAR files:"*

```
javac auth/*.java
jar cvf login.jar auth/AuthTest.class
jar cvf action.jar auth/SysPropAction.class
```

**Dịch:** Để ví dụ chạy được, **đóng gói code của phần login và phần action vào hai file JAR riêng biệt** (xem [[09 - JAR Files]]).

> *"If you look at the policy file in Listing 10.8, you will see that the UNIX user with the name harry has the permission to read all files. Change harry to your login name. Then run the command"*

```
java -classpath login.jar:action.jar \
    -Djava.security.policy=auth/AuthTest.policy \
    -Djava.security.auth.login.config=auth/jaas.config \
    auth.AuthTest
```

> *"Listing 10.9 shows the login configuration."*

> *"On Windows, change UnixPrincipal to NTUserPrincipal in AuthTest.policy and UnixLoginModule to NTLoginModule in jaas.config. When running the program, use a semicolon to separate the JAR files:"*

```
java -classpath login.jar;action.jar . . .
```

**Dịch:** Trên Windows, đổi `UnixPrincipal` thành **`NTUserPrincipal`** trong `AuthTest.policy`, và `UnixLoginModule` thành **`NTLoginModule`** trong `jaas.config`. Khi chạy, **dùng dấu chấm phẩy để ngăn các file JAR**.

> *"The AuthTest program should now display the value of the user.home property. However, if you log in with a different name, a security exception should be thrown because you no longer have the required permission."*

**Dịch:** Chương trình `AuthTest` giờ sẽ hiện giá trị của property `user.home`. Nhưng nếu bạn **login bằng tên khác** thì **security exception sẽ được ném ra** vì bạn **không còn permission cần thiết**.

> **Caution (sách):** *"Be careful to follow these instructions exactly. It is very easy to get the setup wrong by making seemingly innocuous changes."*
>
> **Dịch:** Hãy **làm theo hướng dẫn thật chính xác**. **Rất dễ làm hỏng setup** chỉ bằng những thay đổi **trông có vẻ vô hại**.

### Listing 10.6 — `auth/AuthTest.java`

```java
package auth;

import javax.security.auth.*;
import javax.security.auth.login.*;

/**
 * This program authenticates a user via a custom login and then executes the SysPropAction
 * with the user's privileges.
 * @version 1.02 2018-05-01
 * @author Cay Horstmann
 */
public class AuthTest
{
    public static void main(final String[] args)
    {
        System.setSecurityManager(new SecurityManager());
        try
        {
            var context = new LoginContext("Login1");
            context.login();
            System.out.println("Authentication successful.");
            Subject subject = context.getSubject();
            System.out.println("subject=" + subject);
            var action = new SysPropAction("user.home");
            String result = Subject.doAsPrivileged(subject, action, null);
            System.out.println(result);
            context.logout();
        }
        catch (LoginException e)
        {
            e.printStackTrace();
        }
    }
}
```

### Listing 10.7 — `auth/SysPropAction.java`

```java
package auth;

import java.security.*;

/**
 * This action looks up a system property.
 * @version 1.01 2007-10-06
 * @author Cay Horstmann
 */
public class SysPropAction implements PrivilegedAction<String>
{
    private String propertyName;

    /**
       Constructs an action for looking up a given property.
       @param propertyName the property name (such as "user.home")
    */
    public SysPropAction(String propertyName)
    {
        this.propertyName = propertyName;
    }

    public String run()
    {
        return System.getProperty(propertyName);
    }
}
```

### Listing 10.8 — `auth/AuthTest.policy`

```
grant codebase "file:login.jar"
{
    permission javax.security.auth.AuthPermission "createLoginContext.Login1";
    permission javax.security.auth.AuthPermission "doAsPrivileged";
};

grant principal com.sun.security.auth.UnixPrincipal "harry"
{
    permission java.util.PropertyPermission "user.*", "read";
};
```

### Listing 10.9 — `auth/jaas.config`

```
Login1
{
    com.sun.security.auth.module.UnixLoginModule required;
};
```

### API — `javax.security.auth.login.LoginContext` 1.4

| Method | Mô tả |
|---|---|
| `LoginContext(String name)` | Dựng một login context. `name` tương ứng với **login descriptor trong JAAS configuration file**. |
| `void login()` | Thiết lập một lần login, hoặc **ném `LoginException`** nếu login thất bại. Gọi method `login` trên các manager trong JAAS configuration file. |
| `void logout()` | Logout subject. Gọi method `logout` trên các manager trong JAAS configuration file. |
| `Subject getSubject()` | Trả về subject đã được authenticate. |

### API — `javax.security.auth.Subject` 1.4

| Method | Mô tả |
|---|---|
| `Set<Principal> getPrincipals()` | Lấy các principal của subject này. |
| `static Object doAs(Subject subject, PrivilegedAction action)`<br>`static Object doAs(Subject subject, PrivilegedExceptionAction action)`<br>`static Object doAsPrivileged(Subject subject, PrivilegedAction action, AccessControlContext context)`<br>`static Object doAsPrivileged(Subject subject, PrivilegedExceptionAction action, AccessControlContext context)` | Thực thi privileged action **thay mặt subject**. Trả về giá trị trả về của method `run`. Các method `doAsPrivileged` chạy action **trong access control context đã cho**. Bạn cấp được một **"context snapshot"** lấy trước đó bằng static method `AccessController.getContext()`, hoặc cấp **`null`** để chạy code trong **context mới**. |

### API — `java.security.PrivilegedAction` 1.4

| Method | Mô tả |
|---|---|
| `Object run()` | Bạn **phải định nghĩa** method này để thực thi code muốn chạy thay mặt một subject. |

### API — `java.security.PrivilegedExceptionAction` 1.4

| Method | Mô tả |
|---|---|
| `Object run()` | Bạn **phải định nghĩa** method này để thực thi code muốn chạy thay mặt một subject. Method này **ném được checked exception bất kỳ**. |

### API — `java.security.Principal` 1.1

| Method | Mô tả |
|---|---|
| `String getName()` | Trả về **tên định danh** của principal này. |

---

## 10.3.2. JAAS Login Modules

> *"In this section, we'll look at a JAAS example that shows you"*
>
> *"• How to implement your own login module"*
> *"• How to implement role-based authentication"*

**Dịch:** Section này xem ví dụ JAAS cho thấy cách **implement login module của riêng bạn** và cách **implement role-based authentication**.

> *"Supplying your own login module is useful if you store login information in a database. Even if you are happy with the default module, studying a custom module will help you understand the JAAS configuration file options."*

**Dịch:** Tự cung cấp login module **hữu ích khi bạn lưu thông tin login trong database**. Ngay cả khi bạn hài lòng với module mặc định, **nghiên cứu một module tuỳ chỉnh giúp bạn hiểu các option của JAAS configuration file**.

> *"Role-based authentication is essential if you manage a large number of users. It would be impractical to put the names of all legitimate users into a policy file. Instead, the login module should map users to roles such as "admin" or "HR", and the permissions should be based on these roles."*

**Dịch:** **Role-based authentication là thiết yếu khi bạn quản lý số lượng user lớn.** Đưa tên mọi user hợp lệ vào policy file là **bất khả thi**. Thay vào đó, login module nên **ánh xạ user sang role** như `"admin"` hay `"HR"`, và **permission dựa trên các role này**.

### SimplePrincipal

> *"One job of the login module is to populate the principal set of the subject that is being authenticated. If a login module supports roles, it adds Principal objects that describe roles. The Java library does not provide a class for this purpose, so we wrote our own (see Listing 10.10). The class simply stores a description/value pair, such as role=admin. Its getName method returns that pair, so we can add role-based permissions into a policy file:"*

```
grant principal SimplePrincipal "role=admin" { . . . }
```

**Dịch:** Một nhiệm vụ của login module là **điền vào tập principal của subject đang được authenticate**. Nếu login module hỗ trợ role, nó **thêm các object `Principal` mô tả role**. **Java library không cung cấp class cho mục đích này**, nên sách tự viết. Class chỉ đơn giản **lưu một cặp description/value**, chẳng hạn `role=admin`; method `getName` trả về cặp đó.

> *"Our login module looks up users, passwords, and roles in a text file that contains lines like this:"*

```
harry|secret|admin
carl|guessme|HR
```

> *"Of course, in a realistic login module, you would store this information in a database or directory."*

**Dịch:** Login module trong ví dụ **tra user, password và role trong một file text**. Dĩ nhiên trong login module thực tế, bạn sẽ **lưu thông tin này trong database hoặc directory**.

> *"You can find the code for the SimpleLoginModule in Listing 10.11. The checkLogin method checks whether the user name and password match a record in the password file. If so, we add two SimplePrincipal objects to the subject's principal set:"*

```java
Set<Principal> principals = subject.getPrincipals();
principals.add(new SimplePrincipal("username", username));
principals.add(new SimplePrincipal("role", role));
```

**Dịch:** Method `checkLogin` kiểm tra user name và password có khớp một bản ghi trong password file không. Nếu khớp, **thêm hai object `SimplePrincipal` vào tập principal của subject**.

### Method `initialize`

> *"The remainder of SimpleLoginModule is straightforward plumbing. The initialize method receives"*
>
> *"• The Subject that is being authenticated"*
> *"• A handler to retrieve login information"*
> *"• A sharedState map that can be used for communication between login modules"*
> *"• An options map that contains the name/value pairs that are set in the login configuration"*

**Dịch:** Phần còn lại của `SimpleLoginModule` là **đường ống đơn giản**. Method `initialize` nhận:

| # | Tham số |
|---|---|
| 1 | `Subject` đang được authenticate |
| 2 | Một **handler** để lấy thông tin login |
| 3 | Map **`sharedState`** dùng để **giao tiếp giữa các login module** |
| 4 | Map **`options`** chứa các cặp name/value **được set trong login configuration** |

> *"For example, we configure our module as follows:"*

```
SimpleLoginModule required pwfile="password.txt";
```

> *"The login module retrieves the pwfile settings from the options map."*

**Dịch:** Login module **lấy setting `pwfile` từ map `options`**.

### Callback handler

> *"The login module does not gather the user name and password; that is the job of a separate handler. This separation allows you to use the same login module without worrying whether the login information comes from a GUI dialog box, a console prompt, or a configuration file."*

**Dịch:** **Login module không thu thập user name và password** — đó là việc của một **handler riêng**. Sự tách bạch này cho phép **dùng cùng một login module mà không phải bận tâm thông tin login đến từ GUI dialog box, console prompt, hay configuration file**.

> *"The handler is specified when you construct the LoginContext, for example:"*

```java
var context = new LoginContext("Login1",
    new com.sun.security.auth.callback.DialogCallbackHandler());
```

> *"The DialogCallbackHandler pops up a simple GUI dialog box to retrieve the user name and password. The com.sun.security.auth.callback.TextCallbackHandler class gets the information from the console."*

**Dịch:** `DialogCallbackHandler` **bật lên một GUI dialog box đơn giản** để lấy user name và password. Class `TextCallbackHandler` **lấy thông tin từ console**.

> *"However, in our application, we have our own GUI for collecting the user name and password (see Figure 10.8). We produce a simple handler that merely stores and returns that information (see Listing 10.12)."*

> *"The handler has a single method, handle, that processes an array of Callback objects. A number of predefined classes, such as NameCallback and PasswordCallback, implement the Callback interface. You could also add your own class, such as RetinaScanCallback. The handler code is a bit unsightly because it needs to analyze the types of the callback objects:"*

```java
public void handle(Callback[] callbacks)
{
    for (Callback callback : callbacks)
    {
        if (callback instanceof NameCallback) . . .
        else if (callback instanceof PasswordCallback) . . .
        else . . .
    }
}
```

**Dịch:** Handler có **một method duy nhất là `handle`**, xử lý **một mảng object `Callback`**. Một số class định sẵn như **`NameCallback`** và **`PasswordCallback`** implement interface `Callback`. Bạn **thêm được class của riêng mình**, chẳng hạn `RetinaScanCallback`. Code của handler **hơi khó coi** vì nó **phải phân tích kiểu của các callback object**.

> *"The login module prepares an array of the callbacks that it needs for authentication:"*

```java
var nameCall = new NameCallback("username: ");
var passCall = new PasswordCallback("password: ", false);
callbackHandler.handle(new Callback[] { nameCall, passCall });
```

> *"Then it retrieves the information from the callbacks."*

**Dịch:** Login module **chuẩn bị một mảng callback mà nó cần cho authentication**, rồi **lấy thông tin ra từ các callback đó**.

### Chạy chương trình ví dụ

> *"The program in Listing 10.13 displays a form for entering the login information and the name of a system property. If the user is authenticated, the property value is retrieved in a PrivilegedAction. As you can see from the policy file in Listing 10.14, only users with the admin role have permission to read properties."*

**Dịch:** Chương trình hiện một form nhập thông tin login và tên một system property. Nếu user được authenticate, giá trị property được lấy trong một `PrivilegedAction`. Như thấy trong policy file, **chỉ user có role `admin` mới có permission đọc property**.

> *"As in the preceding section, you must separate the login and action code. Create two JAR files:"*

```
javac *.java
jar cvf login.jar JAAS*.class Simple*.class
jar cvf action.jar SysPropAction.class
```

> *"Then run the program as"*

```
java -classpath login.jar:action.jar \
    -Djava.security.policy=JAASTest.policy \
    -Djava.security.auth.login.config=jaas.config \
    JAASTest
```

> **Note (sách):** *"It is possible to support a more complex two-phase protocol, whereby a login is committed if all modules in the login configuration were successful. For more information, see the login module developer's guide at http://docs.oracle.com/javase/8/docs/technotes/guides/security/jaas/JAASLMDevGuide.html."*
>
> **Dịch:** Có thể hỗ trợ một **giao thức two-phase phức tạp hơn**, trong đó **một lần login được commit nếu mọi module trong login configuration đều thành công**.

### Listing 10.10 — `jaas/SimplePrincipal.java`

```java
package jaas;

import java.security.*;
import java.util.*;

/**
 * A principal with a named value (such as "role=HR" or "username=harry").
 */
public class SimplePrincipal implements Principal
{
    private String descr;
    private String value;

    /**
     * Constructs a SimplePrincipal to hold a description and a value.
     * @param descr the description
     * @param value the associated value
     */
    public SimplePrincipal(String descr, String value)
    {
        this.descr = descr;
        this.value = value;
    }

    /**
     * Returns the role name of this principal.
     * @return the role name
     */
    public String getName()
    {
        return descr + "=" + value;
    }

    public boolean equals(Object otherObject)
    {
        if (this == otherObject) return true;
        if (otherObject == null) return false;
        if (getClass() != otherObject.getClass()) return false;
        var other = (SimplePrincipal) otherObject;
        return Objects.equals(getName(), other.getName());
    }

    public int hashCode()
    {
        return Objects.hashCode(getName());
    }
}
```

### Listing 10.11 — `jaas/SimpleLoginModule.java`

```java
package jaas;

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.security.*;
import java.util.*;
import javax.security.auth.*;
import javax.security.auth.callback.*;
import javax.security.auth.login.*;
import javax.security.auth.spi.*;

/**
 * This login module authenticates users by reading usernames, passwords, and roles from
 * a text file.
 */
public class SimpleLoginModule implements LoginModule
{
    private Subject subject;
    private CallbackHandler callbackHandler;
    private Map<String, ?> options;

    public void initialize(Subject subject, CallbackHandler callbackHandler,
        Map<String, ?> sharedState, Map<String, ?> options)
    {
        this.subject = subject;
        this.callbackHandler = callbackHandler;
        this.options = options;
    }

    public boolean login() throws LoginException
    {
        if (callbackHandler == null) throw new LoginException("no handler");

        var nameCall = new NameCallback("username: ");
        var passCall = new PasswordCallback("password: ", false);
        try
        {
            callbackHandler.handle(new Callback[] { nameCall, passCall });
        }
        catch (UnsupportedCallbackException e)
        {
            var e2 = new LoginException("Unsupported callback");
            e2.initCause(e);
            throw e2;
        }
        catch (IOException e)
        {
            var e2 = new LoginException("I/O exception in callback");
            e2.initCause(e);
            throw e2;
        }

        try
        {
            return checkLogin(nameCall.getName(), passCall.getPassword());
        }
        catch (IOException ex)
        {
            var ex2 = new LoginException();
            ex2.initCause(ex);
            throw ex2;
        }
    }

    /**
     * Checks whether the authentication information is valid. If it is, the subject acquires
     * principals for the user name and role.
     * @param username the user name
     * @param password a character array containing the password
     * @return true if the authentication information is valid
     */
    private boolean checkLogin(String username, char[] password)
        throws LoginException, IOException
    {
        try (var in = new Scanner(
            Paths.get("" + options.get("pwfile")), StandardCharsets.UTF_8))
        {
            while (in.hasNextLine())
            {
                String[] inputs = in.nextLine().split("\\|");
                if (inputs[0].equals(username)
                    && Arrays.equals(inputs[1].toCharArray(), password))
                {
                    String role = inputs[2];
                    Set<Principal> principals = subject.getPrincipals();
                    principals.add(new SimplePrincipal("username", username));
                    principals.add(new SimplePrincipal("role", role));
                    return true;
                }
            }
            return false;
        }
    }

    public boolean logout()
    {
        return true;
    }

    public boolean abort()
    {
        return true;
    }

    public boolean commit()
    {
        return true;
    }
}
```

### Listing 10.12 — `jaas/SimpleCallbackHandler.java`

```java
package jaas;

import javax.security.auth.callback.*;

/**
 * This simple callback handler presents the given user name and password.
 */
public class SimpleCallbackHandler implements CallbackHandler
{
    private String username;
    private char[] password;

    /**
     * Constructs the callback handler.
     * @param username the user name
     * @param password a character array containing the password
     */
    public SimpleCallbackHandler(String username, char[] password)
    {
        this.username = username;
        this.password = password;
    }

    public void handle(Callback[] callbacks)
    {
        for (Callback callback : callbacks)
        {
            if (callback instanceof NameCallback)
            {
                ((NameCallback) callback).setName(username);
            }
            else if (callback instanceof PasswordCallback)
            {
                ((PasswordCallback) callback).setPassword(password);
            }
        }
    }
}
```

### Listing 10.13 — `jaas/JAASTest.java`

```java
package jaas;

import java.awt.*;
import javax.swing.*;

/**
 * This program authenticates a user via a custom login and then looks up a system property
 * with the user's privileges.
 * @version 1.03 2018-05-01
 * @author Cay Horstmann
 */
public class JAASTest
{
    public static void main(final String[] args)
    {
        System.setSecurityManager(new SecurityManager());
        EventQueue.invokeLater(() ->
        {
            var frame = new JAASFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setTitle("JAASTest");
            frame.setVisible(true);
        });
    }
}
```

### Listing 10.14 — `jaas/JAASTest.policy`

```
grant codebase "file:login.jar"
{
    permission java.awt.AWTPermission "showWindowWithoutWarningBanner";
    permission java.awt.AWTPermission "accessEventQueue";
    permission javax.security.auth.AuthPermission "createLoginContext.Login1";
    permission javax.security.auth.AuthPermission "doAsPrivileged";
    permission javax.security.auth.AuthPermission "modifyPrincipals";
    permission java.io.FilePermission "jaas/password.txt", "read";
};

grant principal jaas.SimplePrincipal "role=admin"
{
    permission java.util.PropertyPermission "*", "read";
};
```

### Listing 10.15 — `jaas/jaas.config`

```
Login1
{
    jaas.SimpleLoginModule required pwfile="jaas/password.txt" debug=true;
};
```

### API — `javax.security.auth.callback.CallbackHandler` 1.4

| Method | Mô tả |
|---|---|
| `void handle(Callback[] callbacks)` | Xử lý các callback đã cho, tương tác với user nếu muốn, và **lưu thông tin bảo mật vào các callback object**. |

### API — `javax.security.auth.callback.NameCallback` 1.4

| Method | Mô tả |
|---|---|
| `NameCallback(String prompt)`<br>`NameCallback(String prompt, String defaultName)` | Dựng một `NameCallback` với prompt và default name đã cho. |
| `String getName()`<br>`void setName(String name)` | Lấy hoặc đặt tên mà callback này thu thập được. |
| `String getPrompt()` | Lấy prompt dùng khi hỏi tên này. |
| `String getDefaultName()` | Lấy default name dùng khi hỏi tên này. |

### API — `javax.security.auth.callback.PasswordCallback` 1.4

| Method | Mô tả |
|---|---|
| `PasswordCallback(String prompt, boolean echoOn)` | Dựng một `PasswordCallback` với prompt và cờ echo đã cho. |
| `char[] getPassword()`<br>`void setPassword(char[] password)` | Lấy hoặc đặt password mà callback này thu thập được. |
| `String getPrompt()` | Lấy prompt dùng khi hỏi password này. |
| `boolean isEchoOn()` | Lấy cờ echo dùng khi hỏi password này. |

### API — `javax.security.auth.spi.LoginModule` 1.4

| Method | Mô tả |
|---|---|
| `void initialize(Subject subject, CallbackHandler handler, Map<String,?> sharedState, Map<String,?> options)` | Khởi tạo `LoginModule` này để authenticate subject đã cho. Trong quá trình login, dùng `handler` để thu thập thông tin login. Dùng map `sharedState` để **giao tiếp với các login module khác**. Map `options` chứa các cặp name/value được chỉ định trong login configuration cho instance module này. |
| `boolean login()` | Thực hiện quá trình authentication và **điền các principal của subject**. Trả về `true` nếu login thành công. |
| `boolean commit()` | Được gọi **sau khi mọi login module đều thành công**, dành cho kịch bản login cần **two-phase commit**. Trả về `true` nếu thao tác thành công. |
| `boolean abort()` | Được gọi nếu **một login module khác thất bại khiến quá trình login bị huỷ**. Trả về `true` nếu thao tác thành công. |
| `boolean logout()` | Logout subject này. Trả về `true` nếu thao tác thành công. |

---

## Bài kế tiếp

→ [[04 - Digital Signatures]] — message digest, message signing, keystore, certificate, code signing.
