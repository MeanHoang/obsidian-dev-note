# 03 — Getting Web Data

> Chapter 4, Section 4.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.3. Getting Web Data

> *"To access web servers in a Java program, you will want to work at a higher level than socket connections and HTTP requests. In the following sections, we discuss the classes that the Java library provides for this purpose."*

**Dịch:** Để truy cập web server trong một chương trình Java, bạn sẽ muốn làm việc ở **mức cao hơn socket connection và HTTP request**. Các phần sau bàn về những class mà Java library cung cấp cho mục đích này.

---

## 4.3.1. URLs and URIs

> *"The URL and URLConnection classes encapsulate much of the complexity of retrieving information from a remote site. You can construct a URL object from a string:"*

```java
var url = new URL(urlString);
```

**Dịch:** Class **`URL`** và **`URLConnection`** đóng gói phần lớn sự phức tạp của việc **lấy thông tin từ một site từ xa**. Bạn dựng một object `URL` từ một string.

> *"If you simply want to fetch the contents of the resource, use the openStream method of the URL class. This method yields an InputStream object. Use it in the usual way—for example, to construct a Scanner:"*

```java
InputStream inStream = url.openStream();
var in = new Scanner(inStream, StandardCharsets.UTF_8);
```

**Dịch:** Nếu bạn chỉ muốn **lấy nội dung của resource**, dùng method **`openStream`** của class `URL`. Method này cho ra một object **`InputStream`**. Dùng nó **theo cách thông thường** — ví dụ để dựng một `Scanner`.

### URL, URI, URN

> *"The java.net package makes a useful distinction between URLs (uniform resource locators) and URIs (uniform resource identifiers)."*

**Dịch:** Package `java.net` **phân biệt hữu ích** giữa **URL** (*uniform resource locator*) và **URI** (*uniform resource identifier*).

> *"A URI is a purely syntactical construct that contains the various parts of the string specifying a web resource. A URL is a special kind of URI, namely, one with sufficient information to locate a resource. Other URIs, such as"*

```
mailto:cay@horstmann.com
```

> *"are not locators—there is no data to locate from this identifier. Such a URI is called a URN (uniform resource name)."*

**Dịch:** Một **URI** là một cấu trúc **thuần tuý về cú pháp**, chứa các phần khác nhau của string chỉ định một web resource. Một **URL** là **một dạng URI đặc biệt**, cụ thể là loại có **đủ thông tin để định vị (locate) một resource**. Những URI khác, như `mailto:cay@horstmann.com`, **không phải locator** — **không có data nào để định vị** từ identifier này. URI kiểu đó gọi là **URN** (*uniform resource name*).

> *"In the Java library, the URI class has no methods for accessing the resource that the identifier specifies—its sole purpose is parsing. In contrast, the URL class can open a stream to the resource. For that reason, the URL class only works with schemes that the Java library knows how to handle, such as http:, https:, ftp:, the local file system (file:), and JAR files (jar:)."*

**Dịch:** Trong Java library, class **`URI` không có method nào để truy cập resource** mà identifier chỉ định — **mục đích duy nhất của nó là parsing**. Ngược lại, class **`URL` mở được stream tới resource**. Vì vậy, class `URL` **chỉ làm việc với các scheme mà Java library biết cách xử lý**: `http:`, `https:`, `ftp:`, local file system (`file:`), và file JAR (`jar:`).

> *"To see why parsing is not trivial, consider how complex URIs can be. For example,"*

```
http:/google.com?q=Beach+Chalet
ftp://username:password@ftp.yourserver.com/pub/file.txt
```

**Dịch:** Để thấy vì sao parsing **không hề tầm thường**, hãy xem URI **có thể phức tạp tới đâu**.

### Cú pháp của URI

> *"The URI specification gives the rules for the makeup of these identifiers. A URI has the syntax"*

```
[scheme:]schemeSpecificPart[#fragment]
```

> *"Here, the [. . .] denotes an optional part, and the : and # are included literally in the identifier."*

**Dịch:** **URI specification** đưa ra quy tắc cấu tạo các identifier này. Ở đây `[. . .]` biểu thị **phần tuỳ chọn**, còn `:` và `#` **được đưa vào identifier đúng như chữ**.

> *"If the scheme: part is present, the URI is called absolute. Otherwise, it is called relative."*

**Dịch:** Nếu có phần `scheme:` thì URI gọi là **absolute**. Ngược lại gọi là **relative**.

> *"An absolute URI is opaque if the schemeSpecificPart does not begin with a / such as"*

```
mailto:cay@horstmann.com
```

**Dịch:** Một absolute URI là **opaque** nếu `schemeSpecificPart` **không bắt đầu bằng dấu `/`**.

> *"All absolute nonopaque URIs and all relative URIs are hierarchical. Examples are"*

```
http://horstmann.com/index.html
../../java/net/Socket.html#Socket()
```

**Dịch:** **Mọi absolute URI không opaque và mọi relative URI đều là hierarchical.**

> *"The schemeSpecificPart of a hierarchical URI has the structure"*

```
[//authority][path][?query]
```

> *"where, again, [. . .] denotes optional parts."*

> *"For server-based URIs, the authority part has the form"*

```
[user-info@]host[:port]
```

> *"The port must be an integer."*

**Dịch:** `schemeSpecificPart` của một hierarchical URI có cấu trúc `[//authority][path][?query]`. Với **URI dựa trên server**, phần **authority** có dạng `[user-info@]host[:port]`, trong đó **port phải là số nguyên**.

> *"RFC 2396, which standardizes URIs, also supports a registry-based mechanism in which the authority has a different format, but this is not in common use."*

**Dịch:** **RFC 2396**, tài liệu chuẩn hoá URI, cũng hỗ trợ **cơ chế dựa trên registry** trong đó authority có định dạng khác, nhưng **cách này không thông dụng**.

| Phân loại URI | Điều kiện |
|---|---|
| **absolute** | có phần `scheme:` |
| **relative** | không có phần `scheme:` |
| **opaque** | absolute và `schemeSpecificPart` **không** bắt đầu bằng `/` |
| **hierarchical** | mọi absolute URI không opaque + mọi relative URI |

### Hai mục đích của class URI

> *"One of the purposes of the URI class is to parse an identifier and break it up into its components. You can retrieve them with the methods"*

```
getScheme
getSchemeSpecificPart
getAuthority
getUserInfo
getHost
getPort
getPath
getQuery
getFragment
```

**Dịch:** Một trong các mục đích của class `URI` là **parse một identifier và tách nó ra thành các thành phần**. Lấy chúng ra bằng các method trên.

> *"The other purpose of the URI class is the handling of absolute and relative identifiers. If you have an absolute URI such as"*

```
http://docs.mycompany.com/api/java/net/ServerSocket.html
```

> *"and a relative URI such as"*

```
../../java/net/Socket.html#Socket()
```

> *"then you can combine the two into an absolute URI."*

```
http://docs.mycompany.com/api/java/net/Socket.html#Socket()
```

> *"This process is called resolving a relative URL."*

**Dịch:** Mục đích còn lại của class `URI` là **xử lý identifier absolute và relative**. Có một absolute URI và một relative URI thì **gộp hai cái thành một absolute URI** được. Quá trình này gọi là **resolving** một relative URL.

> *"The opposite process is called relativization. For example, suppose you have a base URI"*

```
http://docs.mycompany.com/api
```

> *"and a URI"*

```
http://docs.mycompany.com/api/java/lang/String.html
```

> *"Then the relativized URI is"*

```
java/lang/String.html
```

**Dịch:** Quá trình ngược lại gọi là **relativization**.

> *"The URI class supports both of these operations:"*

```java
relative = base.relativize(combined);
combined = base.resolve(relative);
```

---

## 4.3.2. Using a URLConnection to Retrieve Information

> *"If you want additional information about a web resource, you should use the URLConnection class, which gives you much more control than the basic URL class. When working with a URLConnection object, you must carefully schedule your steps."*

**Dịch:** Nếu bạn muốn **thông tin bổ sung** về một web resource, hãy dùng class **`URLConnection`**, class này cho bạn **quyền kiểm soát nhiều hơn hẳn** class `URL` cơ bản. Khi làm việc với object `URLConnection`, bạn phải **sắp xếp các bước thật cẩn thận**.

### Năm bước

> *"1. Call the openConnection method of the URL class to obtain the URLConnection object:"*

```java
URLConnection connection = url.openConnection();
```

**Dịch:** **Bước 1** — gọi method `openConnection` của class `URL` để lấy object `URLConnection`.

> *"2. Set any request properties, using the methods"*

```
setDoInput
setDoOutput
setIfModifiedSince
setUseCaches
setAllowUserInteraction
setRequestProperty
setConnectTimeout
setReadTimeout
```

> *"We discuss these methods later in this section and in the API notes."*

**Dịch:** **Bước 2** — set các **request property** bằng các method trên.

> *"3. Connect to the remote resource by calling the connect method:"*

```java
connection.connect();
```

> *"Besides making a socket connection to the server, this method also queries the server for header information."*

**Dịch:** **Bước 3** — connect tới remote resource bằng cách gọi `connect`. Ngoài việc tạo một **socket connection** tới server, method này còn **hỏi server thông tin header**.

> *"4. After connecting to the server, you can query the header information. Two methods, getHeaderFieldKey and getHeaderField, enumerate all fields of the header. The method getHeaderFields gets a standard Map object containing the header fields. For your convenience, the following methods query standard fields:"*

```
getContentType
getContentLength
getContentEncoding
getDate
getExpiration
getLastModified
```

**Dịch:** **Bước 4** — sau khi connect tới server, bạn **truy vấn thông tin header** được. Hai method `getHeaderFieldKey` và `getHeaderField` **liệt kê mọi field của header**. Method `getHeaderFields` lấy một object **`Map` chuẩn** chứa các header field. Cho tiện, các method liệt kê trên truy vấn **các field chuẩn**.

> *"5. Finally, you can access the resource data. Use the getInputStream method to obtain an input stream for reading the information. (This is the same input stream that the openStream method of the URL class returns.) The other method, getContent, isn't very useful in practice. The objects that are returned by standard content types such as text/plain and image/gif require classes in the com.sun hierarchy for processing. You could register your own content handlers, but we do not discuss this technique in our book."*

**Dịch:** **Bước 5** — cuối cùng bạn **truy cập data của resource**. Dùng method **`getInputStream`** để lấy input stream đọc thông tin. (Đây **chính là input stream mà `openStream` của class `URL` trả về**.) Method còn lại, **`getContent`**, **không hữu ích lắm trong thực tế**: các object trả về cho content type chuẩn như `text/plain` và `image/gif` **cần các class trong hệ thống `com.sun`** để xử lý. Bạn đăng ký content handler của riêng mình được, nhưng sách không bàn kỹ thuật này.

> **Caution (sách):** *"Some programmers form a wrong mental image when using the URLConnection class, thinking that the getInputStream and getOutputStream methods are similar to those of the Socket class. But that isn't quite true. The URLConnection class does quite a bit of magic behind the scenes—in particular, the handling of request and response headers. For that reason, it is important that you follow the setup steps for the connection."*
>
> **Dịch:** Một số lập trình viên **hình dung sai** khi dùng class `URLConnection`, nghĩ rằng method `getInputStream` và `getOutputStream` **giống như của class `Socket`**. Điều đó **không hẳn đúng**. Class `URLConnection` **làm khá nhiều phép màu ở hậu trường** — đặc biệt là **xử lý request header và response header**. Vì vậy, **việc tuân theo đúng các bước setup connection là quan trọng**.

### setDoInput và setDoOutput

> *"Let us now look at some of the URLConnection methods in detail. Several methods set properties of the connection before connecting to the server. The most important ones are setDoInput and setDoOutput. By default, the connection yields an input stream for reading from the server but no output stream for writing. If you want an output stream (for example, for posting data to a web server), you need to call"*

```java
connection.setDoOutput(true);
```

**Dịch:** Nhiều method **set property của connection trước khi connect tới server**. Quan trọng nhất là **`setDoInput`** và **`setDoOutput`**. **Mặc định**, connection cho ra **input stream để đọc từ server** nhưng **không có output stream để ghi**. Muốn có output stream (ví dụ để **post data** tới web server), bạn phải gọi `connection.setDoOutput(true)`.

### Request header

> *"Next, you may want to set some of the request headers. The request headers are sent together with the request command to the server. Here is an example:"*

```
GET www.server.com/index.html HTTP/1.0
Referer: http://www.somewhere.com/links.html
Proxy-Connection: Keep-Alive
User-Agent: Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.4)
Host: www.server.com
Accept: text/html, image/gif, image/jpeg, image/png, */*
Accept-Language: en
Accept-Charset: iso-8859-1,*,utf-8
Cookie: orangemilano=192218887821987
```

**Dịch:** Kế đó, bạn có thể muốn set một số **request header**. Request header được **gửi kèm với request command** tới server.

> *"The setIfModifiedSince method tells the connection that you are only interested in data modified since a certain date."*

**Dịch:** Method **`setIfModifiedSince`** báo cho connection rằng bạn **chỉ quan tâm tới data được sửa từ một ngày nào đó trở đi**.

> *"Finally, you can use the catch-all setRequestProperty method to set any name/value pair that is meaningful for the particular protocol. For the format of the HTTP request headers, see RFC 2616. Some of these parameters are not well documented and are passed around by word of mouth from one programmer to the next. For example, if you want to access a password-protected web page, you must do the following:"*

**Dịch:** Cuối cùng, dùng method **"gom hết" `setRequestProperty`** để set **bất kỳ cặp name/value** nào có ý nghĩa với protocol đó. Định dạng của HTTP request header xem **RFC 2616**. Một số parameter **không được tài liệu hoá tốt** và được **truyền miệng** từ lập trình viên này sang lập trình viên khác. Ví dụ, để truy cập một trang web **được bảo vệ bằng mật khẩu**:

> *"1. Concatenate the user name, a colon, and the password."*

```java
String input = username + ":" + password;
```

> *"2. Compute the Base64 encoding of the resulting string. (The Base64 encoding encodes a sequence of bytes into a sequence of printable ASCII characters.)"*

```java
Base64.Encoder encoder = Base64.getEncoder();
String encoding = encoder.encodeToString(input.getBytes(StandardCharsets.UTF_8));
```

> *"3. Call the setRequestProperty method with a name of "Authorization" and the value "Basic " + encoding."*

```java
connection.setRequestProperty("Authorization", "Basic " + encoding);
```

**Dịch:** (1) **Nối** user name, dấu hai chấm, và password. (2) Tính **Base64 encoding** của string kết quả — Base64 encoding **mã hoá một dãy byte thành một dãy ký tự ASCII in được**. (3) Gọi `setRequestProperty` với name là **`"Authorization"`** và value là **`"Basic " + encoding`**.

> Về thao tác trên `String`: xem [[05 - Strings]].

> **Tip (sách):** *"You just saw how to access a password-protected web page. To access a password-protected file by FTP, use an entirely different method: Construct a URL of the form"*
>
> ```
> ftp://username:password@ftp.yourserver.com/pub/file.txt
> ```
>
> **Dịch:** Bạn vừa thấy cách truy cập trang web được bảo vệ bằng mật khẩu. Để truy cập một **file được bảo vệ bằng mật khẩu qua FTP**, dùng **cách hoàn toàn khác**: dựng một URL theo dạng trên.

### Response header

> *"Once you call the connect method, you can query the response header information. First, let's see how to enumerate all response header fields. The implementors of this class felt a need to express their individuality by introducing yet another iteration protocol. The call"*

```java
String key = connection.getHeaderFieldKey(n);
```

> *"gets the nth key from the response header, where n starts from 1! It returns null if n is zero or greater than the total number of header fields. There is no method to return the number of fields; you simply keep calling getHeaderFieldKey until you get null. Similarly, the call"*

```java
String value = connection.getHeaderField(n);
```

> *"returns the nth value."*

**Dịch:** Sau khi gọi `connect`, bạn **truy vấn được thông tin response header**. Trước hết là cách **liệt kê mọi response header field**. Những người implement class này **thấy cần thể hiện cá tính bằng cách đưa ra thêm một iteration protocol nữa**. Lời gọi `getHeaderFieldKey(n)` lấy **key thứ n** từ response header, trong đó **`n` bắt đầu từ 1**! Nó trả về **`null`** nếu `n` bằng 0 hoặc lớn hơn tổng số header field. **Không có method trả về số lượng field**; bạn cứ **gọi `getHeaderFieldKey` cho tới khi nhận `null`**. Tương tự, `getHeaderField(n)` trả về **value thứ n**.

> *"The method getHeaderFields returns a Map of response header fields."*

```java
Map<String,List<String>> headerFields = connection.getHeaderFields();
```

> *"Here is a set of response header fields from a typical HTTP request:"*

```
Date: Wed, 27 Aug 2008 00:15:48 GMT
Server: Apache/2.2.2 (Unix)
Last-Modified: Sun, 22 Jun 2008 20:53:38 GMT
Accept-Ranges: bytes
Content-Length: 4813
Connection: close
Content-Type: text/html
```

> **Note (sách):** *"You can obtain the response status line (such as "HTTP/1.1 200 OK") as connection.getHeaderField(0) or headerFields.get(null)."*
>
> **Dịch:** Lấy **response status line** (ví dụ `"HTTP/1.1 200 OK"`) bằng `connection.getHeaderField(0)` hoặc `headerFields.get(null)`.

> *"As a convenience, six methods query the values of the most common header types and convert them to numeric types when appropriate. Table 4.1 shows these convenience methods. The methods with return type long return the number of seconds since January 1, 1970 GMT."*

**Dịch:** Cho tiện, **sáu method** truy vấn value của các loại header thông dụng nhất và **chuyển chúng sang kiểu số** khi thích hợp. Các method có kiểu trả về **`long`** trả về **số giây kể từ ngày 1/1/1970 GMT**.

### Table 4.1 — Convenience Methods for Response Header Values

| Key Name | Method Name | Return Type |
|---|---|---|
| `Date` | `getDate` | `long` |
| `Expires` | `getExpiration` | `long` |
| `Last-Modified` | `getLastModified` | `long` |
| `Content-Length` | `getContentLength` | `int` |
| `Content-Type` | `getContentType` | `String` |
| `Content-Encoding` | `getContentEncoding` | `String` |

> *"The program in Listing 4.6 lets you experiment with URL connections. Supply a URL and an optional user name and password on the command line when running the program, for example:"*

```
java urlConnection.URLConnectionTest http://www.yourserver.com user password
```

> *"The program prints"*
> - *"All keys and values of the header"*
> - *"The return values of the six convenience methods in Table 4.1"*
> - *"The first ten lines of the requested resource"*

**Dịch:** Chương trình in ra: **mọi key và value của header**; **giá trị trả về của sáu convenience method** ở Table 4.1; và **mười dòng đầu của resource được request**.

### Listing 4.6 — `urlConnection/URLConnectionTest.java`

```java
package urlConnection;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.*;

/**
 * This program connects to an URL and displays the response header data and the first
 * 10 lines of the requested data.
 *
 * Supply the URL and an optional username and password (for HTTP basic authentication) on the
 * command line.
 * @version 1.12 2018-03-17
 * @author Cay Horstmann
 */
public class URLConnectionTest
{
    public static void main(String[] args)
    {
        try
        {
            String urlName;
            if (args.length > 0) urlName = args[0];
            else urlName = "http://horstmann.com";

            var url = new URL(urlName);
            URLConnection connection = url.openConnection();

            // set username, password if specified on command line

            if (args.length > 2)
            {
                String username = args[1];
                String password = args[2];
                String input = username + ":" + password;
                Base64.Encoder encoder = Base64.getEncoder();
                String encoding = encoder.encodeToString(input.getBytes(StandardCharsets.UTF_8));
                connection.setRequestProperty("Authorization", "Basic " + encoding);
            }

            connection.connect();

            // print header fields

            Map<String, List<String>> headers = connection.getHeaderFields();
            for (Map.Entry<String, List<String>> entry : headers.entrySet())
            {
                String key = entry.getKey();
                for (String value : entry.getValue())
                    System.out.println(key + ": " + value);
            }

            // print convenience functions

            System.out.println("----------");
            System.out.println("getContentType: " + connection.getContentType());
            System.out.println("getContentLength: " + connection.getContentLength());
            System.out.println("getContentEncoding: " + connection.getContentEncoding());
            System.out.println("getDate: " + connection.getDate());
            System.out.println("getExpiration: " + connection.getExpiration());
            System.out.println("getLastModifed: " + connection.getLastModified());
            System.out.println("----------");

            String encoding = connection.getContentEncoding();
            if (encoding == null) encoding = "UTF-8";
            try (var in = new Scanner(connection.getInputStream(), encoding))
            {
                // print first ten lines of contents

                for (int n = 1; in.hasNextLine() && n <= 10; n++)
                    System.out.println(in.nextLine());
                if (in.hasNextLine()) System.out.println(". . .");
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
```

### API — `java.net.URL` 1.0

| Method | Mô tả |
|---|---|
| `InputStream openStream()` | mở một input stream để **đọc data của resource** |
| `URLConnection openConnection()` | trả về một object `URLConnection` **quản lý connection tới resource** |

### API — `java.net.URLConnection` 1.0

| Method | Mô tả |
|---|---|
| `void setDoInput(boolean doInput)`<br>`boolean getDoInput()` | nếu `doInput` là `true`, người dùng **nhận được input** từ `URLConnection` này |
| `void setDoOutput(boolean doOutput)`<br>`boolean getDoOutput()` | nếu `doOutput` là `true`, người dùng **gửi được output** tới `URLConnection` này |
| `void setIfModifiedSince(long time)`<br>`long getIfModifiedSince()` | property `ifModifiedSince` cấu hình `URLConnection` này **chỉ lấy data được sửa từ một thời điểm cho trước**. Thời gian tính bằng **giây kể từ nửa đêm GMT ngày 1/1/1970** |
| `void setConnectTimeout(int timeout)` *(5.0)*<br>`int getConnectTimeout()` *(5.0)* | set/lấy **timeout cho connection** (millisecond). Hết timeout mà chưa thiết lập được connection thì method `connect` của input stream liên quan ném **`SocketTimeoutException`** |
| `void setReadTimeout(int timeout)` *(5.0)*<br>`int getReadTimeout()` *(5.0)* | set/lấy **timeout cho việc đọc data** (millisecond). Hết timeout mà read operation chưa thành công thì method `read` ném **`SocketTimeoutException`** |
| `void setRequestProperty(String key, String value)` | set một **request header field** |
| `Map<String,List<String>> getRequestProperties()` *(1.4)* | trả về map các request property. **Mọi value cùng key được đặt trong một list** |
| `void connect()` | connect tới remote resource và **lấy thông tin response header** |
| `Map<String,List<String>> getHeaderFields()` *(1.4)* | trả về map các response header. Mọi value cùng key được đặt trong một list |
| `String getHeaderFieldKey(int n)` | lấy **key của response header field thứ n**, hoặc `null` nếu `n ≤ 0` hoặc lớn hơn số field |
| `String getHeaderField(int n)` | lấy **value của response header field thứ n**, hoặc `null` nếu `n ≤ 0` hoặc lớn hơn số field |
| `int getContentLength()` | lấy **content length** nếu có, hoặc **`-1`** nếu không biết |
| `String getContentType()` | lấy **content type**, ví dụ `text/plain` hay `image/gif` |
| `String getContentEncoding()` | lấy **content encoding**, ví dụ `gzip`. Value này **không thông dụng**, vì **identity encoding mặc định lẽ ra không nên được chỉ định bằng header `Content-Encoding`** |
| `long getDate()`<br>`long getExpiration()`<br>`long getLastModifed()` | lấy ngày **tạo, hết hạn và sửa lần cuối** của resource. Ngày tính bằng **giây kể từ nửa đêm GMT ngày 1/1/1970** |
| `InputStream getInputStream()`<br>`OutputStream getOutputStream()` | trả về stream để **đọc từ / ghi vào** resource |
| `Object getContent()` | chọn **content handler thích hợp** để đọc data của resource và chuyển nó thành một object. Method này **không hữu ích** với kiểu chuẩn như `text/plain` hay `image/gif` trừ khi bạn tự cài content handler của mình |

---

## 4.3.3. Posting Form Data

> *"In the preceding section, you saw how to read data from a web server. Now we will show you how your programs can send data back to a web server and to programs that the web server invokes."*

**Dịch:** Phần trước cho thấy cách **đọc data từ web server**. Phần này chỉ cách chương trình của bạn **gửi data trở lại web server** và tới các chương trình mà web server gọi.

> *"To send information from a web browser to the web server, a user fills out a form, like the one in Figure 4.7. When the user clicks the Submit button, the text in the text fields and the settings of any checkboxes, radio buttons, and other input elements are sent back to the web server. The web server invokes a program that processes the user input."*

**Dịch:** Để gửi thông tin từ web browser tới web server, người dùng **điền vào một form**. Khi bấm nút **Submit**, text trong các text field và **thiết lập của mọi checkbox, radio button, cùng các input element khác** được gửi ngược về web server. Web server **gọi một chương trình xử lý input của người dùng**.

> *"Many technologies enable web servers to invoke programs. Among the best known ones are Java servlets, JavaServer Faces, Microsoft Active Server Pages (ASP), and Common Gateway Interface (CGI) scripts."*

**Dịch:** Nhiều công nghệ cho phép web server gọi chương trình. Nổi tiếng nhất gồm **Java servlet**, **JavaServer Faces**, **Microsoft Active Server Pages (ASP)**, và **Common Gateway Interface (CGI) script**.

> *"The server-side program processes the form data and produces another HTML page that the web server sends back to the browser. This sequence is illustrated in Figure 4.8. The response page can contain new information (for example, in an information-search program) or just an acknowledgment. The web browser then displays the response page."*

**Dịch:** Chương trình **phía server** xử lý form data và **sinh ra một trang HTML khác** mà web server gửi trả về browser. Trang response có thể chứa **thông tin mới** (ví dụ trong chương trình tìm kiếm thông tin) hoặc **chỉ là một lời xác nhận**. Web browser sau đó **hiển thị trang response**.

**Figure 4.8: Data flow during execution of a server-side program**

```
                                ┌────────────────────────────────────────────┐
                                │                              ❹ program     │
  ┌──────────┐   ┌──────────┐   │  ┌──────────┐                  produces    │
  │  Form    │   │  Form    │   │  │  Reply   │◄────────┐          reply     │
  │  page    │   │  data    │   │  │  page    │         │                    │
  └────┬─────┘   └────┬─────┘   │  └────┬─────┘    ┌────┴────────┐           │
       │              │         │       │          │ Server-side │           │
  ❶ user         ❷ client       │       ▼          │  Program    │           │
    clicks         sends        │  ┌──────────┐    └─────────────┘           │
    Submit         form data    │  │   HTTP   │───►  ❸ server                │
       │              │         │  │  server  │        starts                │
       ▼              ▼         │  └────┬─────┘        program               │
  ┌─────────────────────┐       │       │            ┌─────────────┐         │
  │ Client web browser  │◄──────┴───────┘            │ Server-side │         │
  └─────────────────────┘  ❺ server returns reply    │  Program    │         │
       │                                             └─────────────┘         │
  ❻ client displays reply                                                    │
                                                     ┌─────────────┐         │
                                                     │ Server-side │         │
                                                     │  Program    │         │
                                                     └─────────────┘  Server │
                                └────────────────────────────────────────────┘
```

> *"We do not discuss the implementation of server-side programs in this book. Our interest is merely in writing client programs that interact with existing server-side programs."*

**Dịch:** Sách **không bàn về việc implement chương trình phía server**. Mối quan tâm ở đây chỉ là **viết chương trình client tương tác với các chương trình phía server có sẵn**.

> *"When form data are sent to a web server, it does not matter whether the data are interpreted by a servlet, a CGI script, or some other server-side technology. The client sends the data to the web server in a standard format, and the web server takes care of passing it on to the program that generates the response."*

**Dịch:** Khi form data được gửi tới web server, **không quan trọng data được diễn giải bởi servlet, CGI script hay công nghệ phía server nào khác**. Client gửi data tới web server theo **một định dạng chuẩn**, còn web server lo việc **chuyển tiếp nó cho chương trình sinh ra response**.

> *"Two commands, called GET and POST, are commonly used to send information to a web server."*

**Dịch:** Hai command **`GET`** và **`POST`** thường được dùng để gửi thông tin tới web server.

### GET và URL encoding

> *"In the GET command, you simply attach query parameters to the end of the URL. The URL has the form"*

```
http://host/path?query
```

> *"Each parameter has the form name=value. Parameters are separated by & characters. Parameter values are encoded using the URL encoding scheme, following these rules:"*
>
> - *"Leave the characters A through Z, a through z, 0 through 9, and . - ~ _ unchanged."*
> - *"Replace all spaces with + characters."*
> - *"Encode all other characters into UTF-8 and encode each byte by a %, followed by a two-digit hexadecimal number."*

**Dịch:** Với command `GET`, bạn chỉ việc **gắn query parameter vào cuối URL**. Mỗi parameter có dạng `name=value`, các parameter **ngăn nhau bằng ký tự `&`**. Value của parameter được mã hoá theo **URL encoding scheme**, theo các quy tắc:

| Quy tắc URL encoding |
|---|
| Giữ nguyên các ký tự **A–Z, a–z, 0–9**, và **`. - ~ _`** |
| Thay **mọi dấu cách** bằng ký tự **`+`** |
| Mã hoá **mọi ký tự khác sang UTF-8**, rồi mã hoá **mỗi byte** thành **`%` + số hexa hai chữ số** |

> *"For example, to transmit San Francisco, CA, you use San+Francisco%2c+CA, as the hexadecimal number 2c is the UTF-8 code of the ',' character."*

**Dịch:** Ví dụ, để truyền `San Francisco, CA` bạn dùng **`San+Francisco%2c+CA`**, vì số hexa `2c` là **mã UTF-8 của ký tự `,`**.

> *"This encoding keeps any intermediate programs from messing with spaces and other special characters."*

**Dịch:** Cách mã hoá này **ngăn các chương trình trung gian làm hỏng dấu cách và các ký tự đặc biệt khác**.

> *"At the time of this writing, the Google Maps site (www.google.com/maps) accepts query parameters with names q and hl whose values are the location query and the human language of the response. To get a map of 1 Market Street in San Francisco, with a response in German, use the following URL:"*

```
http://www.google.com/maps?q=1+Market+Street+San+Francisco&hl=de
```

### POST

> *"Very long query strings can look unattractive in browsers, and older browsers and proxies have a limit on the number of characters that you can include in a GET request. For that reason, a POST request is often used for forms with a lot of data. In a POST request, you do not attach parameters to a URL; instead, you get an output stream from the URLConnection and write name/value pairs to the output stream. You still have to URL-encode the values and separate them with & characters."*

**Dịch:** **Query string rất dài trông xấu** trên browser, và **browser cùng proxy đời cũ có giới hạn số ký tự** đưa vào được một `GET` request. Vì thế **`POST` request thường được dùng cho form có nhiều data**. Trong `POST` request, bạn **không gắn parameter vào URL**; thay vào đó bạn **lấy output stream từ `URLConnection`** và **ghi các cặp name/value vào output stream**. Bạn **vẫn phải URL-encode các value** và **ngăn chúng bằng ký tự `&`**.

> *"Let us look at this process in detail. To post data to a server-side program, first establish a URLConnection:"*

```java
var url = new URL("http://host/path");
URLConnection connection = url.openConnection();
```

> *"Then, call the setDoOutput method to set up the connection for output:"*

```java
connection.setDoOutput(true);
```

> *"Next, call getOutputStream to get a stream through which you can send data to the server. If you are sending text to the server, it is convenient to wrap that stream into a PrintWriter."*

```java
var out = new PrintWriter(connection.getOutputStream(), StandardCharsets.UTF_8);
```

> *"Now you are ready to send data to the server:"*

```java
out.print(name1 + "=" + URLEncoder.encode(value1, StandardCharsets.UTF_8) + "&");
out.print(name2 + "=" + URLEncoder.encode(value2, StandardCharsets.UTF_8));
```

> *"Close the output stream:"*

```java
out.close();
```

> *"Finally, call getInputStream and read the server response."*

**Dịch:** Quy trình chi tiết: dựng `URLConnection` → gọi **`setDoOutput(true)`** để chuẩn bị connection cho output → gọi **`getOutputStream`** lấy stream gửi data tới server (nếu gửi text thì **bọc stream đó vào một `PrintWriter`** cho tiện) → **gửi data** → **đóng output stream** → cuối cùng gọi **`getInputStream`** và **đọc response của server**.

### Ví dụ thực tế: tra zip code

> *"Let's run through a practical example. The web site at https://tools.usps.com/zip-code-lookup.htm?byaddress contains a form to find the zip code for a street address (see Figure 4.7). To use this form in a Java program, you need to know the URL and the parameters of the POST request."*

**Dịch:** Trang web `https://tools.usps.com/zip-code-lookup.htm?byaddress` có một form **tra zip code theo địa chỉ đường phố**. Để dùng form này trong chương trình Java, bạn cần biết **URL và các parameter của `POST` request**.

> *"You could get that information by looking at the HTML code of the form, but it is usually easier to "spy" on a request with a network monitor. Most browsers have a network monitor as part of their development toolkit. For example, Figure 4.9 shows a screen capture of the Firefox network monitor when submitting data to our example web site. You can find out the submission URL as well as the parameter names and values."*

**Dịch:** Bạn lấy được thông tin đó bằng cách xem **code HTML của form**, nhưng thường **dễ hơn là "rình" request bằng một network monitor**. Hầu hết browser đều có network monitor trong bộ công cụ phát triển. Bạn tìm ra được **URL submit cùng tên và value của các parameter**.

> *"When posting form data, the HTTP header includes the content type:"*

```
Content-Type: application/x-www-form-urlencoded
```

> *"You can also post data in other formats. For example, when sending data in JavaScript Object Notation (JSON), set the content type to application/json."*

**Dịch:** Khi post form data, **HTTP header có content type** như trên. Bạn cũng post data theo **định dạng khác** được: ví dụ khi gửi data ở dạng **JSON**, đặt content type là **`application/json`**.

> *"The header for a POST must also include the content length, for example"*

```
Content-Length: 124
```

**Dịch:** Header của `POST` **cũng phải kèm content length**.

> *"The program in Listing 4.7 sends POST form data to any server-side program. Place the data into a .properties file such as the following:"*

```
url=https://tools.usps.com/tools/app/ziplookup/zipByAddress
User-Agent=HTTPie/0.9.2
address1=1 Market Street
address2=
city=San Francisco
state=CA
companyName=
. . .
```

> *"The program removes the url and User-Agent entries and sends all others to the doPost method."*

**Dịch:** Chương trình **gỡ bỏ entry `url` và `User-Agent`** rồi gửi mọi entry còn lại cho method `doPost`.

> *"In the doPost method, we first open the connection and set the user agent. (The zip code service does not work with the default User-Agent request parameter which contains the string Java, perhaps because the postal service doesn't want to serve programmatic requests.)"*

**Dịch:** Trong method `doPost`, trước hết ta **mở connection và set user agent**. (Service zip code **không hoạt động với request parameter `User-Agent` mặc định** vì nó chứa chuỗi `Java`, có lẽ vì **bưu điện không muốn phục vụ request tự động**.)

> *"Then we call setDoOutput(true), and open the output stream. We then enumerate all keys and values. For each of them, we send the key, = character, value, and & separator character:"*

```java
out.print(key);
out.print('=');
out.print(URLEncoder.encode(value, StandardCharsets.UTF_8));
if (more pairs) out.print('&');
```

> *"When switching from writing to reading any part of the response, the actual interaction with the server happens. The Content-Length header is set to the size of the output. The Content-Type header is set to application/x-www-form-urlencoded unless a different content type was specified. The headers and data are sent to the server. Then the response headers and server response are read and can be queried. In our example program, this switch happens in the call to connection.getContentEncoding()."*

**Dịch:** **Khi chuyển từ việc ghi sang việc đọc bất kỳ phần nào của response**, **tương tác thực sự với server mới xảy ra**. Header **`Content-Length` được đặt bằng kích thước của output**. Header **`Content-Type` được đặt là `application/x-www-form-urlencoded`** trừ khi có content type khác được chỉ định. Header và data **được gửi tới server**. Sau đó response header và response của server **được đọc và truy vấn được**. Trong chương trình ví dụ, **bước chuyển này xảy ra ở lời gọi `connection.getContentEncoding()`**.

### Đọc trang lỗi từ server

> *"There is one twist with reading the response. If a server-side error occurs, the call to connection.getInputStream() throws a FileNotFoundException. However, the server still sends an error page back to the browser (such as the ubiquitous "Error 404—page not found"). To capture this error page, call the getErrorStream method:"*

```java
InputStream err = connection.getErrorStream();
```

**Dịch:** Có **một điểm rắc rối** khi đọc response: nếu **xảy ra lỗi phía server**, lời gọi `connection.getInputStream()` **ném `FileNotFoundException`**. Nhưng server **vẫn gửi một trang lỗi về browser** (kiểu "Error 404—page not found" quen thuộc). Để **bắt lấy trang lỗi này**, gọi method **`getErrorStream`**.

> **Note (sách):** *"The getErrorStream method, as well as several other methods in this program, belong to the HttpURLConnection subclass of URLConnection. If you make a request to an URL that starts with http:// or https://, you can cast the resulting connection object to HttpURLConnection."*
>
> **Dịch:** Method `getErrorStream`, cũng như vài method khác trong chương trình này, **thuộc về subclass `HttpURLConnection` của `URLConnection`**. Nếu bạn request tới một URL bắt đầu bằng `http://` hoặc `https://`, bạn **cast được object connection kết quả sang `HttpURLConnection`**.

### Redirect

> *"When you send POST data to a server, it can happen that the server-side program responds with a redirect: a different URL that should be called to get the actual information. The server could do that because the information is available elsewhere, or to provide a bookmarkable URL. The HttpURLConnection class can handle redirects in most cases."*

**Dịch:** Khi bạn gửi `POST` data tới server, có thể **chương trình phía server trả lời bằng một redirect**: một **URL khác cần được gọi** để lấy thông tin thực sự. Server làm vậy vì thông tin nằm ở **chỗ khác**, hoặc để cung cấp một **URL bookmark được**. Class `HttpURLConnection` **xử lý được redirect trong hầu hết trường hợp**.

> **Note (sách):** *"If cookies need to be sent from one site to another in a redirect, you can configure the global cookie handler like this:"*
>
> ```java
> CookieHandler.setDefault(new CookieManager(null, CookiePolicy.ACCEPT_ALL));
> ```
>
> *"Then cookies will be properly included in the redirect."*
>
> **Dịch:** Nếu **cookie cần được gửi từ site này sang site khác trong một redirect**, bạn cấu hình **global cookie handler** như trên. Khi đó cookie **được đưa vào redirect đúng cách**.

> *"Even though redirects are usually automatically handled, there are some situations where you need to do them yourself. Automatic redirects between HTTP and HTTPS are not supported for security reasons. Redirects can also fail for more subtle reasons. For example, an earlier version of the zip code service used a redirect. Recall that we set the User-Agent request parameter so that the post office didn't think we made a request via the Java API. While it is possible to set the user agent to a different string in the initial request, that setting is not used in automatic redirects. Instead, automatic redirects always send a generic user agent string that contains the word Java."*

**Dịch:** Dù redirect thường được xử lý tự động, có những tình huống **bạn phải tự làm**. **Redirect tự động giữa HTTP và HTTPS không được hỗ trợ vì lý do bảo mật.** Redirect cũng thất bại vì **những lý do tinh vi hơn**. Ví dụ, một phiên bản trước của service zip code dùng redirect: ta đã set parameter `User-Agent` để bưu điện không nghĩ ta request qua Java API — nhưng dù set được user agent thành chuỗi khác **trong request ban đầu**, **thiết lập đó không được dùng trong redirect tự động**. Thay vào đó, **redirect tự động luôn gửi một chuỗi user agent chung chung có chứa từ `Java`**.

> *"In such situations, you can manually carry out the redirects. Before connecting the server, turn off automatic redirects:"*

```java
connection.setInstanceFollowRedirects(false);
```

> *"After making the request, get the response code:"*

```java
int responseCode = connection.getResponseCode();
```

> *"Check if it is one of"*

```
HttpURLConnection.HTTP_MOVED_PERM
HttpURLConnection.HTTP_MOVED_TEMP
HttpURLConnection.HTTP_SEE_OTHER
```

> *"In that case, get the Location response header to obtain the URL for the redirect. Then disconnect and make another connection to the new URL:"*

```java
String location = connection.getHeaderField("Location");
if (location != null)
{
    URL base = connection.getURL();
    connection.disconnect();
    connection = (HttpURLConnection) new URL(base, location).openConnection();
    . . .
}
```

**Dịch:** Trong những tình huống đó, bạn **tự thực hiện redirect bằng tay**: trước khi connect tới server, **tắt redirect tự động**; sau khi gửi request, **lấy response code**; kiểm tra xem nó có phải một trong ba hằng số trên không; nếu đúng thì **lấy response header `Location`** để có URL redirect, rồi **disconnect và tạo connection mới tới URL đó**.

> *"The techniques that this program illustrates can be useful whenever you need to query information from an existing web site. Simply find out the parameters that you need to send, and then strip out the HTML tags and other unnecessary information from the reply."*

**Dịch:** Các kỹ thuật chương trình này minh hoạ **hữu ích mỗi khi bạn cần truy vấn thông tin từ một web site có sẵn**: chỉ cần tìm ra **các parameter cần gửi**, rồi **lọc bỏ HTML tag và thông tin thừa** khỏi phần trả lời.

### Listing 4.7 — `post/PostTest.java`

```java
package post;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;

/**
 * This program demonstrates how to use the URLConnection class for a POST request.
 * @version 1.42 2018-03-17
 * @author Cay Horstmann
 */
public class PostTest
{
    public static void main(String[] args) throws IOException
    {
        String propsFilename = args.length > 0 ? args[0] : "post/post.properties";
        var props = new Properties();
        try (InputStream in = Files.newInputStream(Paths.get(propsFilename)))
        {
            props.load(in);
        }
        String urlString = props.remove("url").toString();
        Object userAgent = props.remove("User-Agent");
        Object redirects = props.remove("redirects");
        CookieHandler.setDefault(new CookieManager(null, CookiePolicy.ACCEPT_ALL));
        String result = doPost(new URL(urlString), props,
            userAgent == null ? null : userAgent.toString(),
            redirects == null ? -1 : Integer.parseInt(redirects.toString()));
        System.out.println(result);
    }

    /**
     * Do an HTTP POST.
     * @param url the URL to post to
     * @param nameValuePairs the query parameters
     * @param userAgent the user agent to use, or null for the default user agent
     * @param redirects the number of redirects to follow manually, or -1 for automatic
     * redirects
     * @return the data returned from the server
     */
    public static String doPost(URL url, Map<Object, Object> nameValuePairs, String userAgent,
        int redirects) throws IOException
    {
        var connection = (HttpURLConnection) url.openConnection();
        if (userAgent != null)
            connection.setRequestProperty("User-Agent", userAgent);

        if (redirects >= 0)
            connection.setInstanceFollowRedirects(false);

        connection.setDoOutput(true);

        try (var out = new PrintWriter(connection.getOutputStream()))
        {
            var first = true;
            for (Map.Entry<Object, Object> pair : nameValuePairs.entrySet())
            {
                if (first) first = false;
                else out.print('&');
                String name = pair.getKey().toString();
                String value = pair.getValue().toString();
                out.print(name);
                out.print('=');
                out.print(URLEncoder.encode(value, StandardCharsets.UTF_8));
            }
        }
        String encoding = connection.getContentEncoding();
        if (encoding == null) encoding = "UTF-8";

        if (redirects > 0)
        {
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_MOVED_PERM
                || responseCode == HttpURLConnection.HTTP_MOVED_TEMP
                || responseCode == HttpURLConnection.HTTP_SEE_OTHER)
            {
                String location = connection.getHeaderField("Location");
                if (location != null)
                {
                    URL base = connection.getURL();
                    connection.disconnect();
                    return doPost(new URL(base, location), nameValuePairs, userAgent,
                        redirects - 1);
                }
            }
        }
        else if (redirects == 0)
        {
            throw new IOException("Too many redirects");
        }

        var response = new StringBuilder();
        try (var in = new Scanner(connection.getInputStream(), encoding))
        {
            while (in.hasNextLine())
            {
                response.append(in.nextLine());
                response.append("\n");
            }
        }
        catch (IOException e)
        {
            InputStream err = connection.getErrorStream();
            if (err == null) throw e;
            try (var in = new Scanner(err))
            {
                response.append(in.nextLine());
                response.append("\n");
            }
        }

        return response.toString();
    }
}
```

### API — `java.net.HttpURLConnection` 1.0

| Method | Mô tả |
|---|---|
| `InputStream getErrorStream()` | trả về một stream để **đọc thông báo lỗi từ web server** |

### API — `java.net.URLEncoder` 1.0

| Method | Mô tả |
|---|---|
| `static String encode(String s, String encoding)` *(1.4)* | trả về **dạng URL-encoded của string `s`**, dùng character encoding scheme cho trước (khuyến nghị `"UTF-8"`). Các ký tự **A–Z, a–z, 0–9, `- _ . ~`** giữ nguyên; **dấu cách** thành **`+`**; mọi ký tự khác thành dãy byte dạng **`%XY`** với `0xXY` là giá trị hexa của byte |

### API — `java.net.URLDecoder` 1.2

| Method | Mô tả |
|---|---|
| `static string decode(String s, String encoding)` *(1.4)* | trả về **kết quả giải mã** của string đã URL-encode `s` theo character encoding scheme cho trước |

> **Lưu ý về bản trích:** signature `static string decode(...)` trong bản text viết `string` chữ thường — giữ nguyên như sách in.

---

## Bài kế tiếp

→ [[04 - The HTTP Client]] — API `HttpClient` mới của Java 11, builder pattern, body publisher và body handler.
