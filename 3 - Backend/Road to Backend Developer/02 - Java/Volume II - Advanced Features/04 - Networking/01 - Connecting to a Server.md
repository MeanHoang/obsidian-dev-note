# 01 — Connecting to a Server

> Chapter 4, Section 4.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.1. Connecting to a Server

> *"In the following sections, you will connect to a server, first by hand and with telnet, and then with a Java program."*

**Dịch:** Trong các phần tiếp theo, bạn sẽ kết nối tới một **server**, đầu tiên là bằng tay với **telnet**, rồi sau đó bằng một chương trình Java.

---

## 4.1.1. Using Telnet

> *"The telnet program is a great debugging tool for network programming. You should be able to launch it by typing telnet from a command shell."*

**Dịch:** Chương trình **telnet** là một công cụ debug rất tốt cho lập trình network. Bạn khởi động nó bằng cách gõ `telnet` từ một command shell.

> **Note (sách):** *"In Windows, you need to activate telnet. Go to the Control Panel, select Programs, click Turn Windows Features On or Off, and select the Telnet client checkbox. The Windows firewall also blocks quite a few network ports that we use in this chapter; you might need an administrator account to unblock them."*
>
> **Dịch:** Trên Windows, bạn phải **bật telnet**: vào Control Panel → Programs → *Turn Windows Features On or Off* → tick ô **Telnet client**. Firewall của Windows cũng **chặn khá nhiều network port** mà chương này dùng; có thể bạn cần tài khoản administrator để mở chúng.

> *"You may have used telnet to connect to a remote computer, but you can use it to communicate with other services provided by Internet hosts as well. Here is an example of what you can do. Type"*

```
telnet time-a.nist.gov 13
```

> *"As Figure 4.1 shows, you should get back a line like this:"*

```
57488 16-04-10 04:23:00 50 0 0 610.5 UTC(NIST) *
```

**Dịch:** Bạn có thể đã dùng telnet để kết nối tới một máy tính từ xa, nhưng cũng dùng nó để **giao tiếp với các service khác** do các Internet host cung cấp được. Ví dụ như trên, kết quả trả về là một dòng dữ liệu.

> *"What is going on? You have connected to the "time of day" service that most UNIX machines constantly run. The particular server that you connected to is operated by the National Institute of Standards and Technology and gives the measurement of a Cesium atomic clock. (Of course, the reported time is not completely accurate due to network delays.)"*

**Dịch:** Chuyện gì đang xảy ra? Bạn đã kết nối tới service **"time of day"** mà hầu hết máy UNIX chạy liên tục. Server cụ thể bạn kết nối tới do **National Institute of Standards and Technology** vận hành và đưa ra số đo của một **đồng hồ nguyên tử Cesium**. (Tất nhiên thời gian báo về **không hoàn toàn chính xác** vì có độ trễ mạng.)

> *"By convention, the "time of day" service is always attached to "port" number 13."*

**Dịch:** Theo quy ước, service "time of day" **luôn gắn với port số 13**.

> **Note (sách):** *"In network parlance, a port is not a physical device, but an abstraction facilitating communication between a server and a client (see Figure 4.2)."*
>
> **Dịch:** Trong thuật ngữ mạng, **port không phải một thiết bị vật lý**, mà là một **abstraction** giúp việc giao tiếp giữa server và client dễ dàng hơn.

> *"The server software is continuously running on the remote machine, waiting for any network traffic that wants to chat with port 13. When the operating system on the remote computer receives a network package that contains a request to connect to port number 13, it wakes up the listening server process and establishes the connection. The connection stays up until it is terminated by one of the parties."*

**Dịch:** Phần mềm server **chạy liên tục** trên máy từ xa, **chờ** bất kỳ network traffic nào muốn nói chuyện với port 13. Khi hệ điều hành trên máy từ xa nhận được một network package chứa yêu cầu kết nối tới port số 13, nó **đánh thức server process đang lắng nghe** và **thiết lập connection**. Connection **duy trì cho tới khi một trong hai bên kết thúc nó**.

> *"When you began the telnet session with time-a.nist.gov at port 13, a piece of network software knew enough to convert the string "time-a.nist.gov" to its correct Internet Protocol (IP) address, 129.6.15.28. The telnet software then sent a connection request to that address, asking for a connection to port 13. Once the connection was established, the remote program sent back a line of data and closed the connection. In general, of course, clients and servers engage in a more extensive dialog before one or the other closes the connection."*

**Dịch:** Khi bạn bắt đầu phiên telnet với `time-a.nist.gov` ở port 13, một phần mềm mạng đã biết cách **chuyển chuỗi `"time-a.nist.gov"` sang đúng địa chỉ Internet Protocol (IP)** của nó là `129.6.15.28`. Phần mềm telnet sau đó gửi một **connection request** tới địa chỉ đó, xin kết nối tới port 13. Khi connection được thiết lập, chương trình từ xa gửi trả một dòng dữ liệu rồi **đóng connection**. Nói chung, client và server thường **đối thoại nhiều hơn** trước khi một bên đóng connection.

> Việc chuyển tên host thành địa chỉ IP: xem thêm [[05 - DNS and how it works]].

### Dùng telnet gọi thẳng vào port HTTP

> *"Here is another experiment along the same lines—but a bit more interesting. Type"*

```
telnet horstmann.com 80
```

> *"Then type very carefully the following:"*

```
GET / HTTP/1.1
Host: horstmann.com

blank line
```

> *"That is, hit the Enter key twice at the end."*

**Dịch:** Một thí nghiệm khác cùng kiểu nhưng thú vị hơn: gõ lệnh trên, rồi gõ **thật cẩn thận** phần request; nghĩa là **nhấn Enter hai lần** ở cuối.

> *"Figure 4.3 shows the response. It should look eerily familiar—you got a page of HTML-formatted text, namely Cay Horstmann's home page."*

**Dịch:** Phản hồi trông **quen thuộc đến lạ** — bạn nhận được một trang **text định dạng HTML**, chính là trang chủ của Cay Horstmann.

> *"This is exactly the same process that your web browser goes through to get a web page. It uses HTTP to request web pages from servers. Of course, the browser displays the HTML code more nicely."*

**Dịch:** Đây **chính xác là quá trình mà web browser của bạn thực hiện** để lấy một trang web. Nó dùng **HTTP** để request trang web từ server. Tất nhiên browser hiển thị code HTML **đẹp hơn**.

> Về giao thức HTTP: xem [[02 - What is HTTP]].

> **Note (sách):** *"The Host key/value pair is required when you connect to a web server that hosts multiple domains at the same IP address. You can omit it if the server hosts a single domain."*
>
> **Dịch:** Cặp key/value **`Host`** là **bắt buộc** khi bạn kết nối tới một web server host **nhiều domain trên cùng một địa chỉ IP**. Bỏ được nó nếu server chỉ host **một domain**.

---

## 4.1.2. Connecting to a Server with Java

> *"Our first network program in Listing 4.1 will do the same thing we did using telnet—connect to a port and print out what it finds."*

**Dịch:** Chương trình network đầu tiên (Listing 4.1) làm **đúng việc ta vừa làm bằng telnet** — kết nối tới một port và in ra thứ nó thấy.

> *"The key statements of this simple program are these:"*

```java
var s = new Socket("time-a.nist.gov", 13);
InputStream inStream = s.getInputStream();
```

### Listing 4.1 — `socket/SocketTest.java`

```java
package socket;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.*;

/**
 * This program makes a socket connection to the atomic clock in Boulder, Colorado, and prints
 * the time that the server sends.
 * @version 1.22 2018-03-17
 * @author Cay Horstmann
 */
public class SocketTest
{
    public static void main(String[] args) throws IOException
    {
        try (var s = new Socket("time-a.nist.gov", 13);
                var in = new Scanner(s.getInputStream(), StandardCharsets.UTF_8))
        {
            while (in.hasNextLine())
            {
                String line = in.nextLine();
                System.out.println(line);
            }
        }
    }
}
```

> *"The first line opens a socket, which is a network software abstraction that enables communication out of and into this program. We pass the remote address and the port number to the socket constructor. If the connection fails, an UnknownHostException is thrown. If there is another problem, an IOException occurs. Since UnknownHostException is a subclass of IOException and this is a sample program, we just catch the superclass."*

**Dịch:** Dòng đầu **mở một socket** — một **abstraction phần mềm mạng** cho phép giao tiếp ra và vào chương trình này. Ta truyền **địa chỉ remote** và **số port** cho constructor của socket. Nếu connection thất bại, một **`UnknownHostException`** được ném ra. Nếu có vấn đề khác thì xảy ra **`IOException`**. Vì `UnknownHostException` là **subclass của `IOException`** và đây là chương trình mẫu, ta chỉ **catch superclass**.

> Về bắt exception và quan hệ subclass/superclass của exception: xem [[02 - Catching Exceptions]].

> *"Once the socket is open, the getInputStream method in java.net.Socket returns an InputStream object that you can use just like any other stream. Once you have grabbed the stream, this program simply prints each input line to standard output. This process continues until the stream is finished and the server disconnects."*

**Dịch:** Khi socket đã mở, method **`getInputStream`** trong `java.net.Socket` trả về một object **`InputStream`** mà bạn dùng **y như mọi stream khác**. Chương trình này chỉ in mỗi dòng input ra standard output. Quá trình tiếp tục **cho tới khi stream kết thúc và server ngắt kết nối**.

> Về stream: xem [[06 - Input and Output]].

> *"This program works only with very simple servers, such as a "time of day" service. In more complex networking programs, the client sends request data to the server, and the server might not immediately disconnect at the end of a response. You will see how to implement that behavior in several examples throughout this chapter."*

**Dịch:** Chương trình này **chỉ hoạt động với server rất đơn giản**, kiểu service "time of day". Trong các chương trình networking phức tạp hơn, client **gửi request data** tới server, và server **có thể không ngắt kết nối ngay** khi kết thúc một response.

> *"The Socket class is pleasant and easy to use because the Java library hides the complexities of establishing a networking connection and sending data across it. The java.net package essentially gives you the same programming interface you would use to work with a file."*

**Dịch:** Class **`Socket`** dễ chịu và dễ dùng vì Java library **giấu đi sự phức tạp** của việc thiết lập network connection và gửi data qua đó. Package **`java.net`** về cơ bản cho bạn **cùng một programming interface** như khi làm việc với một file.

> **Note (sách):** *"In this book, we cover only the Transmission Control Protocol (TCP). The Java platform also supports the User Datagram Protocol (UDP), which can be used to send packets (also called datagrams) with much less overhead than TCP. The drawback is that packets need not be delivered in sequential order to the receiving application and can even be dropped altogether. It is up to the recipient to put the packets in order and to request retransmission of missing packets. UDP is well suited for applications in which missing packets can be tolerated—for example, for audio or video streams or continuous measurements."*
>
> **Dịch:** Trong sách này, tác giả **chỉ nói về TCP (Transmission Control Protocol)**. Java platform cũng hỗ trợ **UDP (User Datagram Protocol)**, dùng để gửi **packet** (còn gọi là **datagram**) với **overhead thấp hơn TCP nhiều**. Nhược điểm: packet **không nhất thiết đến theo đúng thứ tự** và **thậm chí có thể bị mất hoàn toàn**. **Bên nhận** phải tự sắp lại thứ tự packet và **yêu cầu gửi lại** packet bị thiếu. UDP **hợp với ứng dụng chấp nhận được việc mất packet** — ví dụ audio/video stream hoặc đo đạc liên tục.

### API — `java.net.Socket` 1.0

| Method | Mô tả |
|---|---|
| `Socket(String host, int port)` | dựng một socket để kết nối tới host và port cho trước |
| `InputStream getInputStream()`<br>`OutputStream getOutputStream()` | lấy stream để đọc data từ socket hoặc ghi data vào socket |

---

## 4.1.3. Socket Timeouts

> *"Reading from a socket blocks until data are available. If the host is unreachable, your application waits for a long time and you are at the mercy of the underlying operating system to eventually time out."*

**Dịch:** Đọc từ một socket sẽ **block cho tới khi có data**. Nếu host **không tới được**, ứng dụng của bạn **chờ rất lâu** và bạn **phó mặc cho hệ điều hành bên dưới** tự quyết định lúc nào thì time out.

> *"You can decide what timeout value is reasonable for your particular application. Then, call the setSoTimeout method to set a timeout value (in milliseconds)."*

```java
var s = new Socket(. . .);
s.setSoTimeout(10000); // time out after 10 seconds
```

**Dịch:** Bạn **tự quyết định giá trị timeout hợp lý** cho ứng dụng của mình, rồi gọi **`setSoTimeout`** để set timeout (tính bằng **millisecond**).

> *"If the timeout value has been set for a socket, all subsequent read operations throw a SocketTimeoutException when the timeout has been reached before the operation has completed its work. You can catch that exception and react to the timeout."*

```java
try
{
    InputStream in = s.getInputStream(); // read from in
    . . .
}
catch (SocketTimeoutException e)
{
    react to timeout
}
```

**Dịch:** Nếu đã set timeout cho một socket, **mọi read operation sau đó** sẽ ném **`SocketTimeoutException`** khi hết timeout mà operation chưa xong. Bạn **catch exception đó và phản ứng lại**.

> *"There is no timeout for write operations."*

**Dịch:** **Không có timeout cho write operation.**

### Timeout khi thiết lập connection ban đầu

> *"There is one additional timeout issue that you need to address. The constructor"*

```java
Socket(String host, int port)
```

> *"can block indefinitely until an initial connection to the host is established. You can overcome this problem by first constructing an unconnected socket and then connecting it with a timeout:"*

```java
var s = new Socket();
s.connect(new InetSocketAddress(host, port), timeout);
```

**Dịch:** Có thêm một vấn đề timeout nữa: constructor `Socket(String host, int port)` **có thể block vô hạn** cho tới khi connection ban đầu tới host được thiết lập. Khắc phục bằng cách **trước tiên dựng một socket chưa connect**, rồi **connect nó kèm timeout**.

> *"See Section 4.2.4, "Interruptible Sockets," on p. 244 for how to allow users to interrupt a socket connection at any time."*

**Dịch:** Xem [[02 - Implementing Servers#4.2.4. Interruptible Sockets]] để biết cách cho phép người dùng **interrupt một socket connection bất cứ lúc nào**.

### API — `java.net.Socket` 1.0

| Method | Mô tả |
|---|---|
| `Socket()` *(1.1)* | tạo một socket **chưa được connect** |
| `void connect(SocketAddress address)` *(1.4)* | connect socket này tới address cho trước |
| `void connect(SocketAddress address, int timeoutInMilliseconds)` *(1.4)* | connect socket này tới address cho trước, hoặc **trả về nếu hết khoảng thời gian** |
| `void setSoTimeout(int timeoutInMilliseconds)` *(1.1)* | set thời gian block cho **read request** trên socket này. Hết timeout thì **`SocketTimeoutException`** được ném ra |
| `boolean isConnected()` *(1.4)* | trả về `true` nếu socket đang được connect |
| `boolean isClosed()` *(1.4)* | trả về `true` nếu socket đã đóng |

---

## 4.1.4. Internet Addresses

> *"Usually, you don't have to worry too much about Internet addresses—the numerical host addresses that consist of 4 bytes (or, with IPv6, 16 bytes) such as 129.6.15.28. However, you can use the InetAddress class if you need to convert between host names and Internet addresses."*

**Dịch:** Thường bạn **không phải bận tâm nhiều** tới Internet address — địa chỉ host dạng số gồm **4 byte** (hoặc **16 byte với IPv6**), ví dụ `129.6.15.28`. Nhưng bạn dùng được class **`InetAddress`** nếu cần **chuyển đổi qua lại giữa host name và Internet address**.

> *"The java.net package supports IPv6 Internet addresses, provided the host operating system does."*

**Dịch:** Package `java.net` **hỗ trợ địa chỉ IPv6**, với điều kiện **hệ điều hành host cũng hỗ trợ**.

> *"The static getByName method returns an InetAddress object of a host. For example,"*

```java
InetAddress address = InetAddress.getByName("time-a.nist.gov");
```

> *"returns an InetAddress object that encapsulates the sequence of four bytes 129.6.15.28. You can access the bytes with the getAddress method."*

```java
byte[] addressBytes = address.getAddress();
```

**Dịch:** Static method **`getByName`** trả về một object `InetAddress` của một host. Ví dụ trên trả về object `InetAddress` **đóng gói dãy bốn byte** `129.6.15.28`. Truy cập các byte đó bằng method **`getAddress`**.

> *"Some host names with a lot of traffic correspond to multiple Internet addresses, to facilitate load balancing. For example, at the time of this writing, the host name google.com corresponds to twelve different Internet addresses. One of them is picked at random when the host is accessed. You can get all hosts with the getAllByName method."*

```java
InetAddress[] addresses = InetAddress.getAllByName(host);
```

**Dịch:** Một số host name có **lượng traffic lớn** ứng với **nhiều Internet address**, để phục vụ **load balancing**. Ví dụ, tại thời điểm viết sách, host name `google.com` ứng với **mười hai địa chỉ Internet khác nhau**. **Một trong số đó được chọn ngẫu nhiên** khi host được truy cập. Lấy hết bằng method **`getAllByName`**.

> *"Finally, you sometimes need the address of the local host. If you simply ask for the address of localhost, you always get the local loopback address 127.0.0.1, which cannot be used by others to connect to your computer. Instead, use the static getLocalHost method to get the address of your local host."*

```java
InetAddress address = InetAddress.getLocalHost();
```

**Dịch:** Đôi khi bạn cần địa chỉ của **local host**. Nếu chỉ hỏi địa chỉ của `localhost` thì **luôn nhận về local loopback address `127.0.0.1`**, mà địa chỉ này **người khác không dùng để kết nối tới máy bạn được**. Thay vào đó, dùng static method **`getLocalHost`**.

> *"Listing 4.2 is a simple program that prints the Internet address of your local host if you do not specify any command-line parameters, or all Internet addresses of another host if you specify the host name on the command line, such as"*

```
java inetAddress/InetAddressTest www.horstmann.com
```

### Listing 4.2 — `inetAddress/InetAddressTest.java`

```java
package inetAddress;

import java.io.*;
import java.net.*;

/**
 * This program demonstrates the InetAddress class. Supply a host name as command-line
 * argument, or run without command-line arguments to see the address of the local host.
 * @version 1.02 2012-06-05
 * @author Cay Horstmann
 */
public class InetAddressTest
{
    public static void main(String[] args) throws IOException
    {
        if (args.length > 0)
        {
            String host = args[0];
            InetAddress[] addresses = InetAddress.getAllByName(host);
            for (InetAddress a : addresses)
                System.out.println(a);
        }
        else
        {
            InetAddress localHostAddress = InetAddress.getLocalHost();
            System.out.println(localHostAddress);
        }
    }
}
```

### API — `java.net.InetAddress` 1.0

| Method | Mô tả |
|---|---|
| `static InetAddress getByName(String host)`<br>`static InetAddress[] getAllByName(String host)` | dựng một `InetAddress`, hoặc một array chứa **mọi Internet address**, cho host name cho trước |
| `static InetAddress getLocalHost()` | dựng một `InetAddress` cho **local host** |
| `byte[] getAddress()` | trả về array byte chứa **địa chỉ dạng số** |
| `String getHostAddress()` | trả về một string gồm các số thập phân ngăn nhau bằng dấu chấm, ví dụ `"129.6.15.28"` |
| `String getHostName()` | trả về **host name** |

---

## Bài kế tiếp

→ [[02 - Implementing Servers]] — server socket, phục vụ nhiều client bằng thread, half-close, interruptible socket.
