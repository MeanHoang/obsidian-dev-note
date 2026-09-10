# 04 — The HTTP Client

> Chapter 4, Section 4.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 4.4. The HTTP Client

> *"The URLConnection class was designed before HTTP was the universal protocol of the Web. It provides support for a number of protocols, but its HTTP support is somewhat cumbersome. When the decision was made to support HTTP/2, it became clear that it would be best to provide a modern client interface instead of reworking the existing API. The HttpClient provides a more convenient API and HTTP/2 support. In Java 9 and 10, the API classes are located in the jdk.incubator.http package, to give the API a chance to evolve as a result of user feedback. As of Java 11, the HttpClient is in the java.net.http package."*

**Dịch:** Class **`URLConnection`** được thiết kế **trước khi HTTP trở thành protocol phổ quát của Web**. Nó hỗ trợ **nhiều protocol**, nhưng phần **hỗ trợ HTTP thì hơi cồng kềnh**. Khi có quyết định hỗ trợ **HTTP/2**, rõ ràng là **tốt nhất nên cung cấp một client interface hiện đại** thay vì sửa lại API cũ. **`HttpClient`** cung cấp một **API tiện lợi hơn** và **hỗ trợ HTTP/2**. Ở **Java 9 và 10**, các class của API này nằm trong package **`jdk.incubator.http`**, để API có cơ hội **tiến hoá theo phản hồi người dùng**. **Từ Java 11**, `HttpClient` nằm trong package **`java.net.http`**.

> Về giao thức HTTP: xem [[02 - What is HTTP]].

> **Note (sách):** *"With Java 9 and 10, you need to run your program with the command-line option"*
>
> ```
> --add-modules jdk.incubator.httpclient
> ```
>
> **Dịch:** Với **Java 9 và 10**, bạn phải chạy chương trình kèm command-line option trên.

> *"The HTTP client API provides a simpler mechanism for connecting to a web server than the URLConnection class with its rather fussy set of stages."*

**Dịch:** HTTP client API cung cấp một **cơ chế đơn giản hơn** để kết nối tới web server, so với class `URLConnection` cùng **bộ giai đoạn khá cầu kỳ** của nó.

> Bộ năm bước cầu kỳ của `URLConnection`: xem [[03 - Getting Web Data#4.3.2. Using a URLConnection to Retrieve Information]].

### Tạo client bằng builder

> *"An HttpClient can issue requests and receive responses. You get a client by calling"*

```java
HttpClient client = HttpClient.newHttpClient()
```

> *"Alternatively, if you need to configure the client, you use a builder API, like this:"*

```java
HttpClient client = HttpClient.newBuilder()
    .followRedirects(HttpClient.Redirect.ALWAYS)
    .build();
```

> *"That is, you get a builder, call methods to customize the item that is going to be built, and then call the build method to finalize the building process. This is a common pattern for constructing immutable objects."*

**Dịch:** Một `HttpClient` **gửi được request và nhận được response**. Lấy một client bằng `HttpClient.newHttpClient()`. Nếu cần **cấu hình client**, bạn dùng **builder API**: lấy một **builder**, gọi các method để **tuỳ chỉnh thứ sắp được dựng**, rồi gọi method **`build`** để **hoàn tất quá trình dựng**. Đây là một **pattern phổ biến để dựng object immutable**.

### Dựng request

> *"You also follow the builder pattern for formulating requests. Here is a GET request:"*

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(new URI("http://horstmann.com"))
    .GET()
    .build();
```

> *"The URI is the "uniform resource identifier" which is, when using HTTP, the same as a URL. However, in Java, the URL class has methods for actually opening a connection to a URL, whereas the URI class is only concerned with the syntax (scheme, host, port, path, query, fragment, and so on)."*

**Dịch:** Bạn cũng **theo builder pattern để soạn request**. `URI` là *"uniform resource identifier"*, và **khi dùng HTTP thì nó giống hệt một URL**. Nhưng trong Java, class **`URL` có method để thực sự mở connection** tới một URL, còn class **`URI` chỉ quan tâm tới cú pháp** (scheme, host, port, path, query, fragment, v.v.).

> Xem thêm [[03 - Getting Web Data#4.3.1. URLs and URIs]].

### Body publisher

> *"With a POST request, you need a "body publisher" that turns the request data into the data that is being posted. There are body publishers for strings, byte arrays, and files. For example, if your request is in JSON, you just provide the JSON string to a string body publisher."*

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(new URI(url))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(jsonString))
    .build();
```

**Dịch:** Với một **`POST` request**, bạn cần một **"body publisher"** để **biến request data thành data được post đi**. Có body publisher cho **string, byte array và file**. Ví dụ nếu request của bạn ở dạng JSON, bạn chỉ việc **đưa chuỗi JSON cho một string body publisher**.

> *"It is unfortunate that the API does not support the required formatting for common content types. The sample program in Listing 4.8 provides body publishers for form data and file uploads."*

**Dịch:** **Đáng tiếc là API không hỗ trợ sẵn việc định dạng cần thiết cho các content type thông dụng.** Chương trình mẫu ở Listing 4.8 tự cung cấp body publisher cho **form data** và **upload file**.

### Body handler

> *"When sending the request, you have to tell the client how to handle the response. If you just want the body as a string, send the request with a HttpResponse.BodyHandlers.ofString(), like this:"*

```java
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

> *"The HttpResponse class is a generic type whose type parameter denotes the type of the body. You get the response body string simply as"*

```java
String bodyString = response.body();
```

**Dịch:** Khi gửi request, bạn phải **báo cho client biết cách xử lý response**. Nếu chỉ muốn **body dưới dạng string**, gửi request kèm `HttpResponse.BodyHandlers.ofString()`. Class **`HttpResponse` là một generic type** với **type parameter biểu thị kiểu của body**.

> *"There are other response body handlers that get the response as a byte array or input stream. BodyHandlers.ofFile(filePath) yields a handler that saves the response to the given file, and BodyHandlers.ofFileDownload(directoryPath) saves the response in the given directory, using the file name from the Content-Disposition header. Finally, the handler obtained from BodyHandlers.discarding() simply discards the response."*

**Dịch:** Còn có các response body handler khác lấy response dưới dạng **byte array** hoặc **input stream**.

| Body handler | Tác dụng |
|---|---|
| `BodyHandlers.ofString()` | lấy body dưới dạng **string** |
| `BodyHandlers.ofFile(filePath)` | **lưu response vào file** cho trước |
| `BodyHandlers.ofFileDownload(directoryPath)` | lưu response vào **thư mục** cho trước, lấy **tên file từ header `Content-Disposition`** |
| `BodyHandlers.discarding()` | **vứt bỏ** response |

> *"Processing the contents of the response is not considered part of the API. For example, if you receive JSON data, you need a JSON library to parse the contents."*

**Dịch:** **Việc xử lý nội dung của response không được coi là một phần của API.** Ví dụ nếu bạn nhận data JSON, bạn **cần một JSON library để parse nội dung**.

### Status code và header

> *"The HttpResponse object also yields the status code and the response headers."*

```java
int status = response.statusCode();
HttpHeaders responseHeaders = response.headers();
```

> *"You can turn the HttpHeaders object into a map:"*

```java
Map<String, List<String>> headerMap = responseHeaders.map();
```

> *"The map values are lists since in HTTP, each key can have multiple values."*

**Dịch:** Object `HttpResponse` cũng cho ra **status code** và **response header**. Bạn **biến object `HttpHeaders` thành một map** được. **Value của map là list**, vì trong HTTP **mỗi key có thể có nhiều value**.

> *"If you just want the value of a particular key, and you know that there won't be multiple values, call the firstValue method:"*

```java
Optional<String> lastModified = headerMap.firstValue("Last-Modified");
```

> *"You get the response value or an empty optional if none was supplied."*

**Dịch:** Nếu chỉ muốn value của **một key cụ thể** và bạn biết **sẽ không có nhiều value**, gọi method **`firstValue`**. Bạn nhận về **value đó, hoặc một optional rỗng** nếu không có value nào.

### Xử lý bất đồng bộ

> *"You can process the response asynchronously. When building the client, provide an executor:"*

```java
ExecutorService executor = Executors.newCachedThreadPool();
HttpClient client = HttpClient.newBuilder().executor(executor).build();
```

> *"Build a request and then invoke the sendAsync method on the client. You receive a CompletableFuture<HttpResponse<T>>, where T is the type of the body handler. Use the CompletableFuture API as described in Chapter 12 of Volume I:"*

```java
HttpRequest request = HttpRequest.newBuilder().uri(uri).GET().build();
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    thenAccept(response -> . . .);
```

**Dịch:** Bạn **xử lý response bất đồng bộ** được. Khi build client, **cung cấp một executor**. Dựng một request rồi gọi method **`sendAsync`** trên client. Bạn nhận về một **`CompletableFuture<HttpResponse<T>>`**, trong đó `T` là **kiểu của body handler**.

> Về executor và `CompletableFuture`: xem [[04 - Coordinating Tasks]].

> **Lưu ý về bản trích:** dòng `thenAccept(response -> . . .);` trong bản text **thiếu dấu chấm** ở đầu (`.thenAccept`) — giữ nguyên như bản in.

> **Tip (sách):** *"To enable logging for the HttpClient, add this line to net.properties in your JDK:"*
>
> ```
> jdk.httpclient.HttpClient.log=all
> ```
>
> *"Instead of all, you can specify a comma-separated list of headers, requests, content, errors, ssl, trace, and frames, optionally followed by :control, :data, :window, or :all. Don't use any spaces."*
>
> *"Then, set the logging level for the logger with name jdk.httpclient.HttpClient to INFO, for example by adding this line to the logging.properties file in your JDK:"*
>
> ```
> jdk.httpclient.HttpClient.level=INFO
> ```
>
> **Dịch:** Để **bật logging cho `HttpClient`**, thêm dòng trên vào file **`net.properties`** trong JDK của bạn. Thay cho `all`, bạn chỉ định được một **danh sách ngăn bằng dấu phẩy** gồm `headers`, `requests`, `content`, `errors`, `ssl`, `trace`, `frames`, tuỳ chọn theo sau bởi `:control`, `:data`, `:window` hoặc `:all`. **Không dùng dấu cách.** Sau đó **set logging level** cho logger tên `jdk.httpclient.HttpClient` thành **`INFO`**, ví dụ thêm dòng tương ứng vào file **`logging.properties`** trong JDK.

### Listing 4.8 — `client/HttpClientTest.java`

```java
package client;

import java.io.*;
import java.math.*;
import java.net.*;
import java.nio.charset.*;
import java.nio.file.*;
import java.util.*;

import java.net.http.*;
import java.net.http.HttpRequest.*;

class MoreBodyPublishers
{
    public static BodyPublisher ofFormData(Map<Object, Object> data)
    {
        var first = true;
        var builder = new StringBuilder();
        for (Map.Entry<Object, Object> entry : data.entrySet())
        {
            if (first) first = false;
            else builder.append("&");
            builder.append(URLEncoder.encode(entry.getKey().toString(),
                StandardCharsets.UTF_8));
            builder.append("=");
            builder.append(URLEncoder.encode(entry.getValue().toString(),
                StandardCharsets.UTF_8));
        }
        return BodyPublishers.ofString(builder.toString());
    }

    private static byte[] bytes(String s) { return s.getBytes(StandardCharsets.UTF_8); }

    public static BodyPublisher ofMimeMultipartData(Map<Object, Object> data, String boundary)
        throws IOException
    {
        var byteArrays = new ArrayList<byte[]>();
        byte[] separator = bytes("--" + boundary + "\nContent-Disposition: form-data; name=");
        for (Map.Entry<Object, Object> entry : data.entrySet())
        {
            byteArrays.add(separator);

            if (entry.getValue() instanceof Path)
            {
                var path = (Path) entry.getValue();
                String mimeType = Files.probeContentType(path);
                byteArrays.add(bytes("\"" + entry.getKey() + "\"; filename=\"" + path.getFileName()
                    + "\"\nContent-Type: " + mimeType + "\n\n"));
                byteArrays.add(Files.readAllBytes(path));
            }
            else
                byteArrays.add(bytes("\"" + entry.getKey() + "\"\n\n" + entry.getValue() + "\n"));
        }
        byteArrays.add(bytes("--" + boundary + "--"));
        return BodyPublishers.ofByteArrays(byteArrays);
    }

    public static BodyPublisher ofSimpleJSON(Map<Object, Object> data)
    {
        var builder = new StringBuilder();
        builder.append("{");
        var first = true;
        for (Map.Entry<Object, Object> entry : data.entrySet())
        {
            if (first) first = false;
            else
                builder.append(",");
            builder.append(jsonEscape(entry.getKey().toString())).append(": ")
                .append(jsonEscape(entry.getValue().toString()));
        }
        builder.append("}");
        return BodyPublishers.ofString(builder.toString());
    }

    private static Map<Character, String> replacements = Map.of('\b', "\\b", '\f', "\\f",
        '\n', "\\n", '\r', "\\r", '\t', "\\t", '"', "\\\"", '\\', "\\\\");

    private static StringBuilder jsonEscape(String str)
    {
        var result = new StringBuilder("\"");
        for (int i = 0; i < str.length(); i++)
        {
            char ch = str.charAt(i);
            String replacement = replacements.get(ch);
            if (replacement == null) result.append(ch);
            else result.append(replacement);
        }
        result.append("\"");
        return result;
    }
}

public class HttpClientTest
{
    public static void main(String[] args)
        throws IOException, URISyntaxException, InterruptedException
    {
        System.setProperty("jdk.httpclient.HttpClient.log", "headers,errors");
        String propsFilename = args.length > 0 ? args[0] : "client/post.properties";
        Path propsPath = Paths.get(propsFilename);
        var props = new Properties();
        try (InputStream in = Files.newInputStream(propsPath))
        {
            props.load(in);
        }
        String urlString = "" + props.remove("url");
        String contentType = "" + props.remove("Content-Type");
        if (contentType.equals("multipart/form-data"))
        {
            var generator = new Random();
            String boundary = new BigInteger(256, generator).toString();
            contentType += ";boundary=" + boundary;
            props.replaceAll((k, v) ->
                v.toString().startsWith("file://")
                    ? propsPath.getParent().resolve(Paths.get(v.toString().substring(7)))
                    : v);
        }
        String result = doPost(urlString, contentType, props);
        System.out.println(result);
    }

    public static String doPost(String url, String contentType, Map<Object, Object> data)
        throws IOException, URISyntaxException, InterruptedException
    {
        HttpClient client = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.ALWAYS).build();

        BodyPublisher publisher = null;
        if (contentType.startsWith("multipart/form-data"))
        {
            String boundary = contentType.substring(contentType.lastIndexOf("=") + 1);
            publisher = MoreBodyPublishers.ofMimeMultipartData(data, boundary);
        }
        else if (contentType.equals("application/x-www-form-urlencoded"))
            publisher = MoreBodyPublishers.ofFormData(data);
        else
        {
            contentType = "application/json";
            publisher = MoreBodyPublishers.ofSimpleJSON(data);
        }

        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI(url))
            .header("Content-Type", contentType)
            .POST(publisher)
            .build();
        HttpResponse<String> response
            = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
```

---

## API

### `java.net.http.HttpClient` 11

| Method | Mô tả |
|---|---|
| `static HttpClient newHttpClient()` | cho ra một `HttpClient` với **cấu hình mặc định** |
| `static HttpClient.Builder newBuilder()` | cho ra một **builder** để dựng một `HttpClient` |
| `<T> HttpResponse<T> send(HttpRequest request, HttpResponse.BodyHandler<T> responseBodyHandler)`<br>`<T> CompletableFuture<HttpResponse<T>> sendAsync(HttpRequest request, HttpResponse.BodyHandler<T> responseBodyHandler)` | gửi request **đồng bộ hoặc bất đồng bộ** và **xử lý response body bằng handler cho trước** |

### `java.net.http.HttpClient.Builder` 11

| Method | Mô tả |
|---|---|
| `HttpClient build()` | cho ra một `HttpClient` với các property đã cấu hình bởi builder này |
| `HttpClient.Builder followRedirects(HttpClient.Redirect policy)` | set **redirect policy** thành một trong các giá trị **`ALWAYS`**, **`NEVER`**, hoặc **`NORMAL`** (chỉ từ chối redirect từ HTTPS sang HTTP) của enumeration `HttpClient.Redirect` |
| `HttpClient.Builder executor(Executor executor)` | set **executor cho request bất đồng bộ** |

### `java.net.http.HttpRequest` 11

| Method | Mô tả |
|---|---|
| `HttpRequest.Builder newBuilder()` | cho ra một builder để dựng một `HttpRequest` |

### `java.net.http.HttpRequest.Builder` 11

| Method | Mô tả |
|---|---|
| `HttpRequest build()` | cho ra một `HttpRequest` với các property đã cấu hình bởi builder này |
| `HttpRequest.Builder uri(URI uri)` | set **URI** cho request này |
| `HttpRequest.Builder header(String name, String value)` | set một **request header** cho request này |
| `HttpRequest.Builder GET()`<br>`HttpRequest.Builder DELETE()`<br>`HttpRequest.Builder POST(HttpRequest.BodyPublisher bodyPublisher)`<br>`HttpRequest.Builder PUT(HttpRequest.BodyPublisher bodyPublisher)` | set **request method và body** cho request này |

### `java.net.http.HttpResponse<T>` 11

| Method | Mô tả |
|---|---|
| `T body()` | cho ra **body** của response này |
| `int statusCode()` | cho ra **status code** của response này |
| `HttpHeaders headers()` | cho ra **response header** |

### `java.net.http.HttpHeaders` 11

| Method | Mô tả |
|---|---|
| `Map<String,List<String>> map()` | cho ra một **`Map`** của các header này |
| `Optional<String> firstValue(String name)` | **value đầu tiên** với name cho trước trong các header này, nếu có |

---

## Bài kế tiếp

→ [[05 - Sending E-Mail]] — SMTP, gửi mail bằng socket và bằng JavaMail API.
