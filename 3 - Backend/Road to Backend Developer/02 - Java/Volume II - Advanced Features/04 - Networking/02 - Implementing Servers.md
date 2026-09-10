# 02 — Implementing Servers

> Chapter 4, Section 4.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.2. Implementing Servers

> *"Now that we have implemented a basic network client that receives data from the Internet, let's program a simple server that can send information to clients."*

**Dịch:** Sau khi đã implement một network **client** cơ bản nhận data từ Internet, giờ ta lập trình một **server đơn giản** có thể gửi thông tin tới client.

---

## 4.2.1. Server Sockets

> *"A server program, when started, waits for a client to attach to its port. For our example program, we chose port number 8189, which is not used by any of the standard services. The ServerSocket class establishes a socket. In our case, the command"*

```java
var s = new ServerSocket(8189);
```

> *"establishes a server that monitors port 8189. The command"*

```java
Socket incoming = s.accept();
```

> *"tells the program to wait indefinitely until a client connects to that port. Once someone connects to this port by sending the correct request over the network, this method returns a Socket object that represents the connection that was made. You can use this object to get input and output streams, as is shown in the following code:"*

```java
InputStream inStream = incoming.getInputStream();
OutputStream outStream = incoming.getOutputStream();
```

**Dịch:** Một chương trình server, khi khởi động, **chờ một client gắn vào port của nó**. Chương trình ví dụ chọn **port 8189**, port này **không bị service chuẩn nào dùng**. Class **`ServerSocket`** thiết lập một socket; lệnh trên lập một server **theo dõi port 8189**. Lệnh `s.accept()` bảo chương trình **chờ vô hạn cho tới khi một client connect** tới port đó. Khi có ai đó connect bằng cách gửi đúng request qua mạng, method này **trả về một object `Socket` đại diện cho connection vừa được tạo**. Dùng object đó để lấy input stream và output stream.

> *"Everything that the server sends to the server output stream becomes the input of the client program, and all the output from the client program ends up in the server input stream."*

**Dịch:** **Mọi thứ server gửi vào server output stream đều trở thành input của chương trình client**, và **mọi output từ chương trình client đều đổ vào server input stream**.

> *"In all the examples in this chapter, we transmit text through sockets. We therefore turn the streams into scanners and writers."*

```java
var in = new Scanner(inStream, StandardCharsets.UTF_8);
var out = new PrintWriter(new OutputStreamWriter(outStream, StandardCharsets.UTF_8),
    true /* autoFlush */);
```

**Dịch:** Trong mọi ví dụ của chương này, ta **truyền text qua socket**. Vì thế ta **biến các stream thành scanner và writer**.

> Về `Scanner`, `PrintWriter`, `OutputStreamWriter` và character encoding: xem [[06 - Input and Output]].

> *"Let's send the client a greeting:"*

```java
out.println("Hello! Enter BYE to exit.");
```

> *"When you use telnet to connect to this server program at port 8189, you will see this greeting on the terminal screen."*

**Dịch:** Gửi cho client một lời chào. Khi bạn dùng telnet kết nối tới chương trình server này ở port 8189, bạn sẽ **thấy lời chào đó trên màn hình terminal**.

> *"In this simple server, we just read the client's input, a line at a time, and echo it. This demonstrates that the program receives the input. An actual server would obviously compute and return an answer depending on the input."*

```java
String line = in.nextLine();
out.println("Echo: " + line);
if (line.trim().equals("BYE")) done = true;
```

**Dịch:** Trong server đơn giản này, ta chỉ **đọc input của client từng dòng một rồi echo lại**. Việc đó chứng minh chương trình nhận được input. Một server thực sự thì hiển nhiên sẽ **tính toán và trả về câu trả lời tuỳ theo input**.

> *"In the end, we close the incoming socket."*

```java
incoming.close();
```

### Vòng lặp của mọi chương trình server

> *"That is all there is to it. Every server program, such as an HTTP web server, continues performing this loop:"*
>
> 1. *"It receives a command from the client ("get me this information") through an incoming data stream."*
> 2. *"It decodes the client command."*
> 3. *"It gathers the information that the client requested."*
> 4. *"It sends the information to the client through the outgoing data stream."*

**Dịch:** Mọi chương trình server, ví dụ một **HTTP web server**, đều lặp đi lặp lại vòng lặp này:

| # | Bước |
|---|---|
| 1 | Nhận một **command từ client** ("lấy cho tôi thông tin này") qua **incoming data stream** |
| 2 | **Giải mã** command của client |
| 3 | **Thu thập thông tin** client yêu cầu |
| 4 | **Gửi thông tin** tới client qua **outgoing data stream** |

### Listing 4.3 — `server/EchoServer.java`

```java
package server;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.*;

/**
 * This program implements a simple server that listens to port 8189 and echoes back all
 * client input.
 * @version 1.22 2018-03-17
 * @author Cay Horstmann
 */
public class EchoServer
{
    public static void main(String[] args) throws IOException
    {
        // establish server socket
        try (var s = new ServerSocket(8189))
        {
            // wait for client connection
            try (Socket incoming = s.accept())
            {
                InputStream inStream = incoming.getInputStream();
                OutputStream outStream = incoming.getOutputStream();

                try (var in = new Scanner(inStream, StandardCharsets.UTF_8))
                {
                    var out = new PrintWriter(
                        new OutputStreamWriter(outStream, StandardCharsets.UTF_8),
                        true /* autoFlush */);

                    out.println("Hello! Enter BYE to exit.");

                    // echo client input
                    var done = false;
                    while (!done && in.hasNextLine())
                    {
                        String line = in.nextLine();
                        out.println("Echo: " + line);
                        if (line.trim().equals("BYE")) done = true;
                    }
                }
            }
        }
    }
}
```

> *"To try it out, compile and run the program. Then use telnet to connect to the server localhost (or IP address 127.0.0.1) and port 8189."*

**Dịch:** Để thử: compile và chạy chương trình, rồi dùng telnet kết nối tới server `localhost` (hoặc IP `127.0.0.1`) và port 8189.

> *"If you are connected directly to the Internet, anyone in the world can access your echo server, provided they know your IP address and the magic port number."*

**Dịch:** Nếu bạn kết nối trực tiếp với Internet, **bất kỳ ai trên thế giới cũng truy cập được echo server của bạn**, miễn là họ biết địa chỉ IP và **con số port thần kỳ** kia.

> *"When you connect to the port, you will see the message shown in Figure 4.4:"*

```
Hello! Enter BYE to exit.
```

> *"Type anything and watch the input echo on your screen. Type BYE (all uppercase letters) to disconnect. The server program will terminate as well."*

**Dịch:** Gõ bất cứ thứ gì và xem input được echo lại trên màn hình. Gõ **`BYE`** (**toàn chữ hoa**) để ngắt kết nối. Chương trình server **cũng sẽ kết thúc theo**.

### API — `java.net.ServerSocket` 1.0

| Method | Mô tả |
|---|---|
| `ServerSocket(int port)` | tạo một server socket **theo dõi một port** |
| `Socket accept()` | chờ một connection. Method này **block (làm nhàn rỗi) thread hiện tại** cho tới khi connection được tạo. Trả về một object `Socket` để chương trình giao tiếp với client đang kết nối tới |
| `void close()` | đóng server socket |

---

## 4.2.2. Serving Multiple Clients

> *"There is one problem with the simple server in the preceding example. Suppose we want to allow multiple clients to connect to our server at the same time. Typically, a server runs constantly on a server computer, and clients from all over the Internet might want to use it at the same time. Without support for multiple connections, any one client can monopolize the service by connecting to it for a long time. We can do much better through the magic of threads."*

**Dịch:** Server đơn giản ở ví dụ trước có **một vấn đề**: nếu ta muốn cho **nhiều client kết nối cùng lúc** thì sao? Thường một server **chạy liên tục** trên máy server, và client **khắp Internet** có thể muốn dùng nó **cùng lúc**. Không hỗ trợ nhiều connection thì **một client bất kỳ có thể độc chiếm service** bằng cách kết nối thật lâu. Ta làm tốt hơn nhiều nhờ **phép màu của thread**.

> Về thread: xem [[01 - Running Threads]].

> *"Every time we know the program has established a new socket connection—that is, every time the call to accept() returns a socket—we will launch a new thread to take care of the connection between the server and that client. The main program will just go back and wait for the next connection. For this to happen, the main loop of the server should look like this:"*

```java
while (true)
{
    Socket incoming = s.accept();
    var r = new ThreadedEchoHandler(incoming);
    var t = new Thread(r);
    t.start();
}
```

**Dịch:** **Mỗi lần** chương trình thiết lập được một socket connection mới — tức mỗi lần lời gọi `accept()` trả về một socket — ta **khởi chạy một thread mới** để lo connection giữa server và client đó. **Chương trình chính chỉ quay lại chờ connection kế tiếp.**

> *"The ThreadedEchoHandler class implements Runnable and contains the communication loop with the client in its run method."*

```java
class ThreadedEchoHandler implements Runnable
{
    . . .
    public void run()
    {
        try (InputStream inStream = incoming.getInputStream();
                OutputStream outStream = incoming.getOutputStream())
        {
            Process input and send response
        }
        catch(IOException e)
        {
            Handle exception
        }
    }
}
```

**Dịch:** Class `ThreadedEchoHandler` **implement `Runnable`** và chứa **vòng lặp giao tiếp với client** trong method `run` của nó.

> Về `Runnable` và interface: xem [[01 - Interfaces]].

> *"When each connection starts a new thread, multiple clients can connect to the server at the same time. You can easily check this out."*
>
> 1. *"Compile and run the server program (Listing 4.4)."*
> 2. *"Open several telnet windows as we have in Figure 4.5."*
> 3. *"Switch between windows and type commands. Note that you can communicate through all of them simultaneously."*
> 4. *"When done, switch to the window from which you launched the server program and press Ctrl+C to kill it."*

**Dịch:** Khi **mỗi connection khởi chạy một thread mới**, nhiều client kết nối tới server **cùng lúc** được. Cách kiểm chứng: (1) compile và chạy chương trình server; (2) mở **nhiều cửa sổ telnet**; (3) chuyển qua lại giữa các cửa sổ và gõ lệnh — bạn **giao tiếp qua tất cả chúng đồng thời** được; (4) xong thì chuyển về cửa sổ đã khởi chạy server và nhấn **Ctrl+C** để kết thúc nó.

> **Note (sách):** *"In this program, we spawn a separate thread for each connection. This approach is not satisfactory for high-performance servers. You can achieve greater server throughput by using features of the java.nio package. See www.ibm.com/developerworks/java/library/j-javaio for more information."*
>
> **Dịch:** Trong chương trình này, ta **sinh một thread riêng cho mỗi connection**. Cách này **không thoả đáng với server hiệu năng cao**. Bạn đạt được **throughput lớn hơn** bằng cách dùng các tính năng của package **`java.nio`**.

### Listing 4.4 — `threaded/ThreadedEchoServer.java`

```java
package threaded;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.*;

/**
 * This program implements a multithreaded server that listens to port 8189 and echoes back
 * all client input.
 * @author Cay Horstmann
 * @version 1.23 2018-03-17
 */
public class ThreadedEchoServer
{
    public static void main(String[] args )
    {
        try (var s = new ServerSocket(8189))
        {
            int i = 1;

            while (true)
            {
                Socket incoming = s.accept();
                System.out.println("Spawning " + i);
                Runnable r = new ThreadedEchoHandler(incoming);
                var t = new Thread(r);
                t.start();
                i++;
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}

/**
 * This class handles the client input for one server socket connection.
 */
class ThreadedEchoHandler implements Runnable
{
    private Socket incoming;

    /**
       Constructs a handler.
       @param incomingSocket the incoming socket
    */
    public ThreadedEchoHandler(Socket incomingSocket)
    {
        incoming = incomingSocket;
    }

    public void run()
    {
        try (InputStream inStream = incoming.getInputStream();
                OutputStream outStream = incoming.getOutputStream();
                var in = new Scanner(inStream, StandardCharsets.UTF_8);
                var out = new PrintWriter(
                    new OutputStreamWriter(outStream, StandardCharsets.UTF_8),
                    true /* autoFlush */))
        {
            out.println( "Hello! Enter BYE to exit." );

            // echo client input
            var done = false;
            while (!done && in.hasNextLine())
            {
                String line = in.nextLine();
                out.println("Echo: " + line);
                if (line.trim().equals("BYE"))
                    done = true;
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
```

---

## 4.2.3. Half-Close

> *"The half-close allows one end of a socket connection to terminate its output while still receiving data from the other end."*

**Dịch:** **Half-close** cho phép **một đầu** của socket connection **kết thúc output của mình** mà **vẫn tiếp tục nhận data từ đầu kia**.

> *"Here is a typical situation. Suppose you transmit data to the server but you don't know at the outset how much data you have. With a file, you'd just close the file at the end of the data. However, if you close a socket, you immediately disconnect from the server and cannot read the response."*

**Dịch:** Tình huống điển hình: bạn truyền data tới server nhưng **ngay từ đầu không biết mình có bao nhiêu data**. Với một file thì bạn **chỉ việc đóng file** khi hết data. Nhưng nếu bạn **đóng một socket**, bạn **ngắt kết nối khỏi server ngay lập tức** và **không đọc được response**.

> *"The half-close solves this problem. You can close the output stream of a socket, thereby indicating to the server the end of the requested data, but keep the input stream open."*

**Dịch:** Half-close giải quyết vấn đề này: bạn **đóng output stream của socket** để **báo cho server biết đã hết data yêu cầu**, nhưng **giữ input stream mở**.

> *"The client side looks like this:"*

```java
try (var socket = new Socket(host, port))
{
    var in = new Scanner(socket.getInputStream(), StandardCharsets.UTF_8);
    var writer = new PrintWriter(socket.getOutputStream());
    // send request data
    writer.print(. . .);
    writer.flush();
    socket.shutdownOutput();
    // now socket is half-closed
    // read response data
    while (in.hasNextLine() != null)
    {
        String line = in.nextLine();
        . . .
    }
}
```

> *"The server side simply reads input until the end of the input stream is reached. Then it sends the response."*

**Dịch:** Phía server **chỉ việc đọc input cho tới khi tới cuối input stream**, rồi **gửi response**.

> *"Of course, this protocol is only useful for one-shot services such as HTTP where the client connects, issues a request, catches the response, and then disconnects."*

**Dịch:** Tất nhiên, protocol này **chỉ hữu ích cho service "một phát" (one-shot)** như HTTP, trong đó client **connect → gửi request → nhận response → ngắt kết nối**.

### API — `java.net.Socket` 1.0

| Method | Mô tả |
|---|---|
| `void shutdownOutput()` *(1.3)* | đặt output stream về trạng thái **"end of stream"** |
| `void shutdownInput()` *(1.3)* | đặt input stream về trạng thái **"end of stream"** |
| `boolean isOutputShutdown()` *(1.4)* | trả về `true` nếu output đã bị shut down |
| `boolean isInputShutdown()` *(1.4)* | trả về `true` nếu input đã bị shut down |

---

## 4.2.4. Interruptible Sockets

> *"When you connect to a socket, the current thread blocks until the connection has been established or a timeout has elapsed. Similarly, when you read data through a socket, the current thread blocks until the operation is successful or has timed out. (There is no timeout for writing data.)"*

**Dịch:** Khi bạn connect tới một socket, **thread hiện tại block** cho tới khi connection được thiết lập hoặc **hết timeout**. Tương tự, khi bạn đọc data qua socket, thread hiện tại block cho tới khi operation thành công hoặc hết timeout. (**Không có timeout cho việc ghi data.**)

> *"In interactive applications, you would like to give users an option to simply cancel a socket connection that does not appear to produce results. However, if a thread blocks on an unresponsive socket, you cannot unblock it by calling interrupt."*

**Dịch:** Trong ứng dụng tương tác, bạn muốn cho người dùng **tuỳ chọn huỷ một socket connection** có vẻ không cho ra kết quả. Nhưng nếu một thread **block trên một socket không phản hồi**, bạn **không unblock nó bằng cách gọi `interrupt` được**.

> Về `interrupt` và điều phối thread: xem [[01 - Running Threads]] và [[04 - Coordinating Tasks]].

> *"To interrupt a socket operation, use a SocketChannel, a feature of the java.nio package. Open the SocketChannel like this:"*

```java
SocketChannel channel = SocketChannel.open(new InetSocketAddress(host, port));
```

**Dịch:** Để **interrupt được một socket operation**, dùng **`SocketChannel`** — một tính năng của package **`java.nio`**.

> *"A channel does not have associated streams. Instead, it has read and write methods that make use of Buffer objects. (See Chapter 1 for more information about NIO buffers.) These methods are declared in the interfaces ReadableByteChannel and WritableByteChannel."*

**Dịch:** Một **channel không có stream đi kèm**. Thay vào đó nó có method **`read` và `write` dùng object `Buffer`**. Các method này được khai báo trong interface **`ReadableByteChannel`** và **`WritableByteChannel`**.

> *"If you don't want to deal with buffers, you can use the Scanner class to read from a SocketChannel because Scanner has a constructor with a ReadableByteChannel parameter:"*

```java
var in = new Scanner(channel, StandardCharsets.UTF_8);
```

**Dịch:** Nếu bạn **không muốn đụng tới buffer**, dùng class **`Scanner`** để đọc từ một `SocketChannel`, vì `Scanner` có **constructor nhận parameter `ReadableByteChannel`**.

> *"To turn a channel into an output stream, use the static Channels.newOutputStream method."*

```java
OutputStream outStream = Channels.newOutputStream(channel);
```

**Dịch:** Để **biến một channel thành output stream**, dùng static method **`Channels.newOutputStream`**.

> *"That's all you need to do. Whenever a thread is interrupted during an open, read, or write operation, the operation does not block, but is terminated with an exception."*

**Dịch:** Chỉ cần vậy thôi. **Mỗi khi một thread bị interrupt** trong lúc thực hiện operation **open, read hay write**, operation đó **không block nữa mà bị kết thúc bằng một exception**.

> *"The program in Listing 4.5 contrasts interruptible and blocking sockets. A server sends numbers and pretends to be stuck after the tenth number. Click on either button, and a thread is started that connects to the server and prints the output. The first thread uses an interruptible socket; the second thread uses a blocking socket. If you click the Cancel button within the first ten numbers, you can interrupt either thread."*

**Dịch:** Chương trình ở Listing 4.5 **đối chiếu socket interruptible với socket blocking**. Một server gửi các con số và **giả vờ bị treo sau con số thứ mười**. Bấm vào một trong hai nút thì một thread khởi chạy, connect tới server và in output ra. Thread thứ nhất dùng **interruptible socket**; thread thứ hai dùng **blocking socket**. Nếu bạn bấm nút **Cancel trong khoảng mười con số đầu**, bạn **interrupt được cả hai thread**.

> *"However, after the first ten numbers, you can only interrupt the first thread. The second thread keeps blocking until the server finally closes the connection (see Figure 4.6)."*

**Dịch:** Nhưng **sau mười con số đầu**, bạn **chỉ interrupt được thread thứ nhất**. Thread thứ hai **cứ block mãi cho tới khi server cuối cùng đóng connection**.

### Listing 4.5 — `interruptible/InterruptibleSocketTest.java`

```java
package interruptible;

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.net.*;
import java.io.*;
import java.nio.charset.*;
import java.nio.channels.*;
import javax.swing.*;

/**
 * This program shows how to interrupt a socket channel.
 * @author Cay Horstmann
 * @version 1.05 2018-03-17
 */
public class InterruptibleSocketTest
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new InterruptibleSocketFrame();
            frame.setTitle("InterruptibleSocketTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

class InterruptibleSocketFrame extends JFrame
{
    private Scanner in;
    private JButton interruptibleButton;
    private JButton blockingButton;
    private JButton cancelButton;
    private JTextArea messages;
    private TestServer server;
    private Thread connectThread;

    public InterruptibleSocketFrame()
    {
        var northPanel = new JPanel();
        add(northPanel, BorderLayout.NORTH);

        final int TEXT_ROWS = 20;
        final int TEXT_COLUMNS = 60;
        messages = new JTextArea(TEXT_ROWS, TEXT_COLUMNS);
        add(new JScrollPane(messages));

        interruptibleButton = new JButton("Interruptible");
        blockingButton = new JButton("Blocking");

        northPanel.add(interruptibleButton);
        northPanel.add(blockingButton);

        interruptibleButton.addActionListener(event ->
        {
            interruptibleButton.setEnabled(false);
            blockingButton.setEnabled(false);
            cancelButton.setEnabled(true);
            connectThread = new Thread(() ->
            {
                try
                {
                    connectInterruptibly();
                }
                catch (IOException e)
                {
                    messages.append("\nInterruptibleSocketTest.connectInterruptibly: " + e);
                }
            });
            connectThread.start();
        });

        blockingButton.addActionListener(event ->
        {
            interruptibleButton.setEnabled(false);
            blockingButton.setEnabled(false);
            cancelButton.setEnabled(true);
            connectThread = new Thread(() ->
            {
                try
                {
                    connectBlocking();
                }
                catch (IOException e)
                {
                    messages.append("\nInterruptibleSocketTest.connectBlocking: " + e);
                }
            });
            connectThread.start();
        });

        cancelButton = new JButton("Cancel");
        cancelButton.setEnabled(false);
        northPanel.add(cancelButton);
        cancelButton.addActionListener(event ->
        {
            connectThread.interrupt();
            cancelButton.setEnabled(false);
        });
        server = new TestServer();
        new Thread(server).start();
        pack();
    }

    /**
     * Connects to the test server, using interruptible I/O
     */
    public void connectInterruptibly() throws IOException
    {
        messages.append("Interruptible:\n");
        try (SocketChannel channel
            = SocketChannel.open(new InetSocketAddress("localhost", 8189)))
        {
            in = new Scanner(channel, StandardCharsets.UTF_8);
            while (!Thread.currentThread().isInterrupted())
            {
                messages.append("Reading ");
                if (in.hasNextLine())
                {
                    String line = in.nextLine();
                    messages.append(line);
                    messages.append("\n");
                }
            }
        }
        finally
        {
            EventQueue.invokeLater(() ->
            {
                messages.append("Channel closed\n");
                interruptibleButton.setEnabled(true);
                blockingButton.setEnabled(true);
            });
        }
    }

    /**
     * Connects to the test server, using blocking I/O
     */
    public void connectBlocking() throws IOException
    {
        messages.append("Blocking:\n");
        try (var sock = new Socket("localhost", 8189))
        {
            in = new Scanner(sock.getInputStream(), StandardCharsets.UTF_8);
            while (!Thread.currentThread().isInterrupted())
            {
                messages.append("Reading ");
                if (in.hasNextLine())
                {
                    String line = in.nextLine();
                    messages.append(line);
                    messages.append("\n");
                }
            }
        }
        finally
        {
            EventQueue.invokeLater(() ->
            {
                messages.append("Socket closed\n");
                interruptibleButton.setEnabled(true);
                blockingButton.setEnabled(true);
            });
        }
    }

    /**
     * A multithreaded server that listens to port 8189 and sends numbers to the client,
     * simulating a hanging server after 10 numbers.
     */
    class TestServer implements Runnable
    {
        public void run()
        {
            try (var s = new ServerSocket(8189))
            {
                while (true)
                {
                    Socket incoming = s.accept();
                    Runnable r = new TestServerHandler(incoming);
                    new Thread(r).start();
                }
            }
            catch (IOException e)
            {
                messages.append("\nTestServer.run: " + e);
            }
        }
    }

    /**
     * This class handles the client input for one server socket connection.
     */
    class TestServerHandler implements Runnable
    {
        private Socket incoming;
        private int counter;

        /**
         * Constructs a handler.
         * @param i the incoming socket
         */
        public TestServerHandler(Socket i)
        {
            incoming = i;
        }

        public void run()
        {
            try
            {
                try
                {
                    OutputStream outStream = incoming.getOutputStream();
                    var out = new PrintWriter(
                        new OutputStreamWriter(outStream, StandardCharsets.UTF_8),
                        true /* autoFlush */);
                    while (counter < 100)
                    {
                        counter++;
                        if (counter <= 10) out.println(counter);
                        Thread.sleep(100);
                    }
                }
                finally
                {
                    incoming.close();
                    messages.append("Closing server\n");
                }
            }
            catch (Exception e)
            {
                messages.append("\nTestServerHandler.run: " + e);
            }
        }
    }
}
```

> **Lưu ý về bản trích:** phần đánh số dòng của Listing 4.5 trong bản text bị xáo trộn nặng ở đoạn cuối (dòng `241 }` đứng trước `}`), nên **mức lồng nhau của hai class `TestServer` và `TestServerHandler`** (inner class của `InterruptibleSocketFrame` hay top-level class) **không xác định chắc chắn được** từ bản trích. Ở trên trình bày chúng như inner class vì chúng truy cập field `messages`.

### API — `java.net.InetSocketAddress` 1.4

| Method | Mô tả |
|---|---|
| `InetSocketAddress(String hostname, int port)` | dựng một address object với host và port cho trước, **phân giải host name ngay lúc dựng**. Nếu không phân giải được host name, property `unresolved` của address object được đặt thành `true` |
| `boolean isUnresolved()` | trả về `true` nếu address object này **không phân giải được** |

### API — `java.nio.channels.SocketChannel` 1.4

| Method | Mô tả |
|---|---|
| `static SocketChannel open(SocketAddress address)` | mở một socket channel và connect nó tới một remote address |

### API — `java.nio.channels.Channels` 1.4

| Method | Mô tả |
|---|---|
| `static InputStream newInputStream(ReadableByteChannel channel)` | dựng một input stream đọc từ channel cho trước |
| `static OutputStream newOutputStream(WritableByteChannel channel)` | dựng một output stream ghi vào channel cho trước |

---

## Bài kế tiếp

→ [[03 - Getting Web Data]] — URL và URI, `URLConnection`, request/response header, post form data.
