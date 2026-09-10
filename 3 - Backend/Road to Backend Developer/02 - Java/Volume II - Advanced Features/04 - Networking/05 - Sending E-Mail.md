# 05 — Sending E-Mail

> Chapter 4, Section 4.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.5. Sending E-Mail

> *"In the past, it was simple to write a program that sends e-mail by making a socket connection to port 25, the SMTP port, of a mail server. The Simple Mail Transport Protocol (SMTP) describes the format for e-mail messages. Once you are connected to the server, send a mail header (in the SMTP format, which is easy to generate), followed by the mail message."*

**Dịch:** Trước đây, viết một chương trình gửi e-mail rất đơn giản: **tạo một socket connection tới port 25**, tức **port SMTP**, của một mail server. **SMTP (Simple Mail Transport Protocol)** mô tả **định dạng cho e-mail message**. Khi đã kết nối tới server, **gửi một mail header** (theo định dạng SMTP, vốn dễ sinh ra), **rồi tới nội dung mail**.

> *"Here are the details:"*
>
> *"1. Open a socket to your host."*

```java
var s = new Socket("mail.yourserver.com", 25); // 25 is SMTP
var out = new PrintWriter(s.getOutputStream(), StandardCharsets.UTF_8);
```

> *"2. Send the following information to the print stream:"*

```
HELO sending host
MAIL FROM: sender e-mail address
RCPT TO: recipient e-mail address
DATA
Subject: subject

(blank line)
mail message (any number of lines)
.
QUIT
```

**Dịch:** Chi tiết gồm hai bước: (1) **mở một socket tới host** của bạn; (2) **gửi các thông tin trên vào print stream**.

> *"The SMTP specification (RFC 821) states that lines must be terminated with \r followed by \n."*

**Dịch:** **SMTP specification (RFC 821)** quy định rằng các dòng **phải kết thúc bằng `\r` rồi tới `\n`**.

> Về socket: xem [[01 - Connecting to a Server#4.1.2. Connecting to a Server with Java]].

### Vì sao không làm thủ công nữa

> *"It used to be that SMTP servers were often willing to route e-mail from anyone. However, in these days of spam floods, most servers have built-in checks and only accept requests from users or IP address ranges that they trust. Authentication usually happens over secure socket connections."*

**Dịch:** Ngày trước, SMTP server thường **sẵn sàng chuyển tiếp e-mail từ bất kỳ ai**. Nhưng thời **ngập tràn spam** này, hầu hết server đều có **cơ chế kiểm tra sẵn** và **chỉ nhận request từ người dùng hoặc dải địa chỉ IP mà chúng tin cậy**. **Authentication thường diễn ra qua secure socket connection.**

> *"Implementing these authentication schemes manually would be very tedious. Instead, we will show you how to use the JavaMail API to send e-mail from a Java program."*

**Dịch:** Tự implement những **authentication scheme** này bằng tay sẽ **rất mệt mỏi**. Thay vào đó, sách chỉ cách dùng **JavaMail API** để gửi e-mail từ một chương trình Java.

---

## Dùng JavaMail API

> *"Download JavaMail from www.oracle.com/technetwork/java/javamail and unzip it somewhere on your hard disk."*

**Dịch:** Tải JavaMail về và **giải nén** ở đâu đó trên ổ cứng.

> *"To use JavaMail, you need to set up some properties that depend on your mail server. For example, with GMail, you use"*

```
mail.transport.protocol=smtps
mail.smtps.auth=true
mail.smtps.host=smtp.gmail.com
mail.smtps.user=accountname@gmail.com
```

> *"Our sample program reads these from a property file."*

**Dịch:** Để dùng JavaMail, bạn phải **set một số property tuỳ theo mail server** của mình. Ví dụ với GMail thì dùng các property trên. Chương trình mẫu **đọc chúng từ một property file**.

> *"For security reasons, we don't put the password into the property file but instead prompt for it."*

**Dịch:** **Vì lý do bảo mật**, ta **không đặt password vào property file** mà **hỏi người dùng nhập vào**.

> *"Read in the property file, then get a mail session like this:"*

```java
Session mailSession = Session.getDefaultInstance(props);
```

> *"Make a message with the desired sender, recipient, subject, and message text:"*

```java
var message = new MimeMessage(mailSession);
message.setFrom(new InternetAddress(from));
message.addRecipient(RecipientType.TO, new InternetAddress(to));
message.setSubject(subject);
message.setText(builder.toString());
```

**Dịch:** Đọc property file, rồi **lấy một mail session**. Sau đó **tạo một message** với **người gửi, người nhận, subject và nội dung** mong muốn.

> *"Then send it off:"*

```java
Transport tr = mailSession.getTransport();
tr.connect(null, password);
tr.sendMessage(message, message.getAllRecipients());
tr.close();
```

**Dịch:** Rồi **gửi nó đi**.

### Chạy chương trình

> *"The program in Listing 4.9 reads the message from a text file of the format"*

```
Sender
Recipient
Subject
Message text (any number of lines)
```

**Dịch:** Chương trình ở Listing 4.9 **đọc message từ một file text** theo định dạng: **người gửi / người nhận / subject / nội dung** (số dòng tuỳ ý).

> *"To run the program, download the JavaMail implementation from https://javaee.github.io/javamail. You also need the JAR file for the Java Activation Framework—get it from http://www.oracle.com/technetwork/java/javase/jaf-135115.html or search on Maven Central. Then run"*

```
java -classpath .:javax.mail.jar:activation-1.1.1.jar path/to/message.txt
```

**Dịch:** Để chạy chương trình, tải **JavaMail implementation** về. Bạn cũng cần **file JAR của Java Activation Framework**, lấy từ trang Oracle hoặc **tìm trên Maven Central**. Rồi chạy lệnh trên.

> *"At the time of this writing, GMail does not check the veracity of the information—you can supply any sender you like. (Keep this in mind the next time you get an e-mail message from president@whitehouse.gov inviting you to a black-tie affair on the front lawn.)"*

**Dịch:** Tại thời điểm viết sách, GMail **không kiểm tra tính xác thực của thông tin** — bạn **điền người gửi nào cũng được**. (Hãy nhớ điều đó lần tới khi bạn nhận được e-mail từ `president@whitehouse.gov` mời dự tiệc trang trọng ở bãi cỏ trước Nhà Trắng.)

> **Tip (sách):** *"If you can't figure out why your mail connection isn't working, call"*
>
> ```java
> mailSession.setDebug(true);
> ```
>
> *"and check out the messages. Also, the JavaMail API FAQ has some useful debugging hints."*
>
> **Dịch:** Nếu không hiểu vì sao mail connection không hoạt động, gọi `mailSession.setDebug(true)` và **xem các message** in ra. Ngoài ra, **JavaMail API FAQ** có vài gợi ý debug hữu ích.

### Listing 4.9 — `mail/MailTest.java`

```java
package mail;

import java.io.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.internet.MimeMessage.RecipientType;

/**
 * This program shows how to use JavaMail to send mail messages.
 * @author Cay Horstmann
 * @version 1.01 2018-03-17
 */
public class MailTest
{
    public static void main(String[] args) throws MessagingException, IOException
    {
        var props = new Properties();
        try (InputStream in = Files.newInputStream(Paths.get("mail", "mail.properties")))
        {
            props.load(in);
        }
        List<String> lines = Files.readAllLines(Paths.get(args[0]), StandardCharsets.UTF_8);

        String from = lines.get(0);
        String to = lines.get(1);
        String subject = lines.get(2);

        var builder = new StringBuilder();
        for (int i = 3; i < lines.size(); i++)
        {
            builder.append(lines.get(i));
            builder.append("\n");
        }

        Console console = System.console();
        var password = new String(console.readPassword("Password: "));

        Session mailSession = Session.getDefaultInstance(props);
        // mailSession.setDebug(true);
        var message = new MimeMessage(mailSession);
        message.setFrom(new InternetAddress(from));
        message.addRecipient(RecipientType.TO, new InternetAddress(to));
        message.setSubject(subject);
        message.setText(builder.toString());
        Transport tr = mailSession.getTransport();
        try
        {
            tr.connect(null, password);
            tr.sendMessage(message, message.getAllRecipients());
        }
        finally
        {
            tr.close();
        }
    }
}
```

> Về `Files.readAllLines`, `Properties` và `Console`: xem [[06 - Input and Output]].

---

## Kết chương

> *"In this chapter, you have seen how to write network clients and servers in Java and how to harvest information from web servers. The next chapter covers database connectivity. You will learn how to work with relational databases in Java, using the JDBC API."*

**Dịch:** Trong chương này, bạn đã thấy cách **viết network client và server trong Java** và cách **thu thập thông tin từ web server**. Chương kế tiếp bàn về **database connectivity**: bạn sẽ học cách làm việc với **relational database** trong Java bằng **JDBC API**.

---

## Chương kế tiếp

→ [[01 - The Design of JDBC]] — thiết kế của JDBC, cách Java kết nối tới relational database bằng SQL.
