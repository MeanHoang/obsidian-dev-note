# 04 — Nginx: Serving, Proxy và Load Balancing

> **Nguồn chính:** nginx documentation (nginx.org) — hai trang:
> - *Beginner's Guide* — https://nginx.org/en/docs/beginners_guide.html (các mục "Serving Static Content", "Setting Up a Simple Proxy Server", "Setting Up FastCGI Proxying")
> - *Using nginx as HTTP load balancer* — https://nginx.org/en/docs/http/load_balancing.html

[[03 - Nginx - Kiến trúc và xử lý request]] trả lời "nginx chọn `server` và `location` nào". Bài này trả lời câu tiếp theo: **chọn xong rồi thì làm gì với request** — đọc file từ đĩa, đẩy sang backend, hay chia cho nhiều backend.

---

## 1. Serve file tĩnh: `root` + `location`

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, mục "Serving Static Content")
> "An important web server task is serving out files (such as images or static HTML pages). You will implement an example where, depending on the request, files will be served from different local directories: /data/www (which may contain HTML files) and /data/images (containing images). This will require editing of the configuration file and setting up of a server block inside the http block with two location blocks."

🇻🇳 **Dịch**
> "Một nhiệm vụ quan trọng của web server là **phục vụ file** (chẳng hạn ảnh hoặc trang HTML tĩnh). Bạn sẽ làm một ví dụ mà tuỳ theo request, file sẽ được phục vụ từ các thư mục cục bộ khác nhau: `/data/www` (có thể chứa file HTML) và `/data/images` (chứa ảnh). Việc này cần sửa file cấu hình và thiết lập một block `server` bên trong block `http` với hai block `location`."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Add the following location block to the server block:
>
> ```
> location / {
>     root /data/www;
> }
> ```
>
> This location block specifies the "/" prefix compared with the URI from the request. For matching requests, the URI will be added to the path specified in the root directive, that is, to /data/www, to form the path to the requested file on the local file system. If there are several matching location blocks nginx selects the one with the longest prefix. The location block above provides the shortest prefix, of length one, and so only if all other location blocks fail to provide a match, this block will be used."

🇻🇳 **Dịch**
> "Với các request khớp, **URI sẽ được cộng thêm vào đường dẫn ghi trong directive `root`** — tức là vào `/data/www` — để tạo thành đường dẫn tới file được yêu cầu trên file system cục bộ. Nếu có nhiều block `location` khớp, nginx chọn cái có **prefix dài nhất**. Block `location` ở trên cho prefix ngắn nhất, dài một ký tự, nên nó chỉ được dùng khi mọi block `location` khác đều không khớp."

> [!note] `root` là phép CỘNG, không phải phép THAY
> Đây là điểm dễ nhầm nhất khi mới cấu hình nginx: `root /data/www` + URI `/some/example.html` → `/data/www/some/example.html`. URI **không bị cắt** đi. Ví dụ ở mục 1.1 dưới đây cho thấy hệ quả rõ nhất.

### 1.1. Ví dụ hai `location`, và cái bẫy của `root`

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Next, add the second location block:
>
> ```
> location /images/ {
>     root /data;
> }
> ```
>
> It will be a match for requests starting with /images/ (location / also matches such requests, but has shorter prefix)."

🇻🇳 **Dịch**
> "Nó sẽ khớp với các request bắt đầu bằng `/images/` (`location /` cũng khớp những request như vậy, nhưng có prefix ngắn hơn)."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, cấu hình hoàn chỉnh)
> ```
> server {
>     location / {
>         root /data/www;
>     }
>
>     location /images/ {
>         root /data;
>     }
> }
> ```
>
> "This is already a working configuration of a server that listens on the standard port 80 and is accessible on the local machine at http://localhost/. In response to requests with URIs starting with /images/, the server will send files from the /data/images directory. For example, in response to the http://localhost/images/example.png request nginx will send the /data/images/example.png file. If such file does not exist, nginx will send a response indicating the 404 error. Requests with URIs not starting with /images/ will be mapped onto the /data/www directory. For example, in response to the http://localhost/some/example.html request nginx will send the /data/www/some/example.html file."

🇻🇳 **Dịch**
> "Đây đã là một cấu hình hoạt động được của một server lắng nghe port 80 chuẩn và truy cập được trên máy cục bộ tại `http://localhost/`. Đáp lại các request có URI bắt đầu bằng `/images/`, server sẽ gửi file từ thư mục `/data/images`. Ví dụ, với request `http://localhost/images/example.png`, nginx sẽ gửi file `/data/images/example.png`. **Nếu file đó không tồn tại, nginx sẽ gửi response báo lỗi 404.** Các request có URI không bắt đầu bằng `/images/` sẽ được map vào thư mục `/data/www`. Ví dụ, với request `http://localhost/some/example.html`, nginx sẽ gửi file `/data/www/some/example.html`."

> [!tip] Đọc kỹ vì sao `root /data` chứ không phải `root /data/images`
> `location /images/` + `root /data` → `/data` + `/images/example.png` = `/data/images/example.png`. Nếu viết `root /data/images` thì kết quả sẽ là `/data/images/images/example.png` — thư mục `images` bị lặp hai lần. Đây là hệ quả trực tiếp của việc `root` **cộng URI vào**.

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "To apply the new configuration, start nginx if it is not yet started or send the reload signal to the nginx's master process, by executing:
>
> ```
> nginx -s reload
> ```
>
> In case something does not work as expected, you may try to find out the reason in access.log and error.log files in the directory /usr/local/nginx/logs or /var/log/nginx."

🇻🇳 **Dịch**
> "Để áp dụng cấu hình mới, khởi động nginx nếu chưa chạy, hoặc gửi signal reload tới master process bằng `nginx -s reload`.
>
> Trong trường hợp có gì không hoạt động như mong đợi, bạn có thể tìm nguyên nhân trong các file `access.log` và `error.log` ở thư mục `/usr/local/nginx/logs` hoặc `/var/log/nginx`."

💡 **Ví dụ đời sống — `root` là gốc kệ, URI là chỉ dẫn còn lại**
Thư viện có nhiều kệ. `root /data/www` = "đi tới kệ `/data/www`". URI `/some/example.html` = "rồi lần theo bảng chỉ dẫn `some`, lấy quyển `example.html`".
- Bạn **không** nói "quyển example.html ở đâu đó trong thư viện, tự tìm đi".
- Bạn nói "gốc là kệ này" và phần còn lại của địa chỉ là **đường đi tiếp** từ kệ đó.
- Nếu ai đó đưa gốc kệ sai (`root /data/images` cho `location /images/`), người tìm sách sẽ đi vào `images/images/` — một hành lang không tồn tại → 404.

---

## 2. Reverse proxy: `proxy_pass`

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, mục "Setting Up a Simple Proxy Server")
> "One of the frequent uses of nginx is setting it up as a proxy server, which means a server that receives requests, passes them to the proxied servers, retrieves responses from them, and sends them to the clients."

🇻🇳 **Dịch**
> "Một trong những cách dùng nginx thường gặp là thiết lập nó làm **proxy server** — nghĩa là một server nhận request, chuyển chúng tới các proxied server, lấy response từ đó, và gửi lại cho client."

> [!note] Đúng định nghĩa "gateway" của RFC 9110
> [[01 - Web Server là gì]] đã trích RFC 9110 §3.7: *"A "gateway" (a.k.a. "reverse proxy") is an intermediary that acts as an origin server for the outbound connection but translates received requests and forwards them inbound to another server or servers."* Câu docs nginx ở trên là cùng một thứ, diễn đạt ở mức vận hành. (Lưu ý: docs nginx gọi đây là "proxy server", nhưng theo spec nó là **gateway/reverse proxy** vì client không chọn nó.)

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "We will configure a basic proxy server, which serves requests of images with files from the local directory and sends all other requests to a proxied server. In this example, both servers will be defined on a single nginx instance.
>
> First, define the proxied server by adding one more server block to the nginx's configuration file with the following contents:
>
> ```
> server {
>     listen 8080;
>     root /data/up1;
>
>     location / {
>     }
> }
> ```
>
> This will be a simple server that listens on the port 8080 (previously, the listen directive has not been specified since the standard port 80 was used) and maps all requests to the /data/up1 directory on the local file system."

🇻🇳 **Dịch**
> "Ta sẽ cấu hình một proxy server cơ bản: phục vụ các request ảnh bằng file từ thư mục cục bộ, và gửi mọi request khác tới một proxied server. Trong ví dụ này **cả hai server đều được định nghĩa trên cùng một instance nginx**.
>
> Trước tiên định nghĩa proxied server bằng cách thêm một block `server` nữa: server đơn giản lắng nghe port 8080 (trước đó directive `listen` chưa được ghi vì đang dùng port 80 chuẩn) và map mọi request vào thư mục `/data/up1`."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Note that the root directive is placed in the server context. Such root directive is used when the location block selected for serving a request does not include its own root directive."

🇻🇳 **Dịch**
> "Lưu ý rằng directive `root` được đặt trong **context `server`**. Một directive `root` như vậy được dùng khi block `location` được chọn để phục vụ request **không có `root` riêng của nó**."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Next, use the server configuration from the previous section and modify it to make it a proxy server configuration. In the first location block, put the proxy_pass directive with the protocol, name and port of the proxied server specified in the parameter (in our case, it is http://localhost:8080):
>
> ```
> server {
>     location / {
>         proxy_pass http://localhost:8080;
>     }
>
>     location /images/ {
>         root /data;
>     }
> }
> ```
> "

🇻🇳 **Dịch**
> "Tiếp theo, dùng cấu hình server ở mục trước và sửa nó thành cấu hình proxy server. Trong block `location` đầu tiên, đặt directive `proxy_pass` với **protocol, tên và port** của proxied server ghi trong tham số (ở đây là `http://localhost:8080`)."

### 2.1. Phối hợp: ảnh serve tại chỗ, còn lại đẩy sang backend

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "We will modify the second location block, which currently maps requests with the /images/ prefix to the files under the /data/images directory, to make it match the requests of images with typical file extensions. The modified location block looks like this:
>
> ```
> location ~ \.(gif|jpg|png)$ {
>     root /data/images;
> }
> ```
>
> The parameter is a regular expression matching all URIs ending with .gif, .jpg, or .png. A regular expression should be preceded with ~. The corresponding requests will be mapped to the /data/images directory."

🇻🇳 **Dịch**
> "Ta sẽ sửa block `location` thứ hai — hiện đang map các request có prefix `/images/` tới file trong `/data/images` — để nó khớp với các request ảnh theo **phần mở rộng file** thông dụng. Tham số là một regular expression khớp mọi URI kết thúc bằng `.gif`, `.jpg`, hoặc `.png`. **Regular expression phải có dấu `~` đứng trước.** Các request tương ứng sẽ được map tới thư mục `/data/images`."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, cấu hình cuối)
> ```
> server {
>     location / {
>         proxy_pass http://localhost:8080/;
>     }
>
>     location ~ \.(gif|jpg|png)$ {
>         root /data/images;
>     }
> }
> ```
>
> "This server will filter requests ending with .gif, .jpg, or .png and map them to the /data/images directory (by adding URI to the root directive's parameter) and pass all other requests to the proxied server configured above."

🇻🇳 **Dịch**
> "Server này sẽ **lọc** các request kết thúc bằng `.gif`, `.jpg`, hoặc `.png` và map chúng tới thư mục `/data/images` (bằng cách cộng URI vào tham số của directive `root`), và **chuyển mọi request khác** tới proxied server đã cấu hình ở trên."

> [!tip] Đây là pattern kiến trúc, không chỉ là một đoạn config
> Một tiến trình nginx duy nhất đồng thời là **origin server** (ở location regex, đọc file từ đĩa) và **gateway** (ở `location /`, đẩy sang backend). Chính là câu RFC 9110 §3.7 mà [[01 - Web Server là gì]] đã trích: *"a single intermediary might act as an origin server, proxy, gateway, or tunnel, switching behavior based on the nature of each request."*

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "There are many more directives that may be used to further configure a proxy connection."

🇻🇳 **Dịch**
> "Còn nhiều directive khác có thể dùng để cấu hình sâu hơn một proxy connection." — Beginner's Guide **không** liệt kê chúng; bài này vì vậy cũng không bàn `proxy_set_header`, `proxy_read_timeout`, v.v.

---

## 3. FastCGI: `fastcgi_pass`

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, mục "Setting Up FastCGI Proxying")
> "nginx can be used to route requests to FastCGI servers which run applications built with various frameworks and programming languages such as PHP.
>
> The most basic nginx configuration to work with a FastCGI server includes using the fastcgi_pass directive instead of the proxy_pass directive, and fastcgi_param directives to set parameters passed to a FastCGI server."

🇻🇳 **Dịch**
> "nginx có thể được dùng để định tuyến request tới các **FastCGI server** — những server chạy ứng dụng được xây bằng nhiều framework và ngôn ngữ khác nhau, chẳng hạn PHP.
>
> Cấu hình nginx cơ bản nhất để làm việc với một FastCGI server gồm: dùng directive `fastcgi_pass` **thay cho** `proxy_pass`, và các directive `fastcgi_param` để đặt các tham số truyền cho FastCGI server."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Suppose the FastCGI server is accessible on localhost:9000. Taking the proxy configuration from the previous section as a basis, replace the proxy_pass directive with the fastcgi_pass directive and change the parameter to localhost:9000. In PHP, the SCRIPT_FILENAME parameter is used for determining the script name, and the QUERY_STRING parameter is used to pass request parameters. The resulting configuration would be:
>
> ```
> server {
>     location / {
>         fastcgi_pass  localhost:9000;
>         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
>         fastcgi_param QUERY_STRING    $query_string;
>     }
>
>     location ~ \.(gif|jpg|png)$ {
>         root /data/images;
>     }
> }
> ```
>
> This will set up a server that will route all requests except for requests for static images to the proxied server operating on localhost:9000 through the FastCGI protocol."

🇻🇳 **Dịch**
> "Giả sử FastCGI server truy cập được ở `localhost:9000`. Lấy cấu hình proxy ở mục trước làm nền, thay directive `proxy_pass` bằng `fastcgi_pass` và đổi tham số thành `localhost:9000`. Trong PHP, tham số `SCRIPT_FILENAME` được dùng để xác định tên script, và tham số `QUERY_STRING` được dùng để truyền các tham số của request.
>
> Cấu hình này sẽ tạo ra một server định tuyến **mọi request trừ request ảnh tĩnh** tới proxied server đang chạy ở `localhost:9000` **qua protocol FastCGI**."

> [!note] `proxy_pass` và `fastcgi_pass` khác nhau ở protocol phía sau
> `proxy_pass http://...` → nginx nói **HTTP** với backend. `fastcgi_pass host:port` → nginx nói **FastCGI**, một protocol binary khác, nên phải truyền tham số tường minh bằng `fastcgi_param` thay vì để nguyên header HTTP. Đây đúng là câu RFC 9110 §3.7 về gateway: *"A gateway communicates with inbound servers using any protocol that it desires."*

---

## 4. Load balancing

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Introduction")
> "Load balancing across multiple application instances is a commonly used technique for optimizing resource utilization, maximizing throughput, reducing latency, and ensuring fault-tolerant configurations.
>
> It is possible to use nginx as a very efficient HTTP load balancer to distribute traffic to several application servers and to improve performance, scalability and reliability of web applications with nginx."

🇻🇳 **Dịch**
> "**Load balancing** trên nhiều instance ứng dụng là một kỹ thuật thường dùng để tối ưu việc sử dụng tài nguyên, tối đa hoá throughput, giảm latency, và bảo đảm cấu hình chịu lỗi (fault-tolerant).
>
> Có thể dùng nginx như một HTTP load balancer rất hiệu quả để phân phối traffic tới nhiều application server, và để cải thiện hiệu năng, khả năng mở rộng và độ tin cậy của web application."

### 4.1. Ba phương pháp cơ bản

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Load balancing methods")
> "The following load balancing mechanisms (or methods) are supported in nginx:
>
> - round-robin — requests to the application servers are distributed in a round-robin fashion,
> - least-connected — next request is assigned to the server with the least number of active connections,
> - ip-hash — a hash-function is used to determine what server should be selected for the next request (based on the client's IP address)."

🇻🇳 **Dịch**
> "Các cơ chế (hay phương pháp) load balancing sau được nginx hỗ trợ:
>
> - **round-robin** — request tới các application server được phân phối theo kiểu vòng tròn,
> - **least-connected** — request tiếp theo được gán cho server có **ít connection đang hoạt động nhất**,
> - **ip-hash** — một hàm hash được dùng để xác định server nào nên được chọn cho request tiếp theo (**dựa trên địa chỉ IP của client**)."

### 4.2. Cấu hình mặc định: `upstream` + `proxy_pass`

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Default load balancing configuration")
> "The simplest configuration for load balancing with nginx may look like the following:
>
> ```
> http {
>     upstream myapp1 {
>         server srv1.example.com;
>         server srv2.example.com;
>         server srv3.example.com;
>     }
>
>     server {
>         listen 80;
>
>         location / {
>             proxy_pass http://myapp1;
>         }
>     }
> }
> ```
>
> In the example above, there are 3 instances of the same application running on srv1-srv3. When the load balancing method is not specifically configured, it defaults to round-robin. All requests are proxied to the server group myapp1, and nginx applies HTTP load balancing to distribute the requests."

🇻🇳 **Dịch**
> "Cấu hình đơn giản nhất để load balancing với nginx có thể trông như trên. Trong ví dụ đó, có 3 instance của cùng một ứng dụng chạy trên `srv1`–`srv3`. **Khi phương pháp load balancing không được cấu hình cụ thể, nó mặc định là round-robin.** Mọi request được proxy tới **server group** `myapp1`, và nginx áp dụng HTTP load balancing để phân phối các request."

> [!note] `upstream` — đúng cái từ RFC 9110 §3.7
> [[01 - Web Server là gì]] đã trích: *"all messages flow from upstream to downstream"*. Khối `upstream myapp1 { ... }` là tên nhóm **các server ở phía trên dòng chảy**. Và chú ý cú pháp: `proxy_pass http://myapp1` — `myapp1` không phải hostname DNS, mà là **tên của server group** vừa khai báo.

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*)
> "Reverse proxy implementation in nginx includes load balancing for HTTP, HTTPS, FastCGI, uwsgi, SCGI, memcached, and gRPC.
>
> To configure load balancing for HTTPS instead of HTTP, just use "https" as the protocol.
>
> When setting up load balancing for FastCGI, uwsgi, SCGI, memcached, or gRPC, use fastcgi_pass, uwsgi_pass, scgi_pass, memcached_pass, and grpc_pass directives respectively."

🇻🇳 **Dịch**
> "Cài đặt reverse proxy trong nginx bao gồm load balancing cho **HTTP, HTTPS, FastCGI, uwsgi, SCGI, memcached, và gRPC**.
>
> Để cấu hình load balancing cho HTTPS thay vì HTTP, chỉ cần dùng `https` làm protocol.
>
> Khi thiết lập load balancing cho FastCGI, uwsgi, SCGI, memcached, hay gRPC, dùng lần lượt các directive `fastcgi_pass`, `uwsgi_pass`, `scgi_pass`, `memcached_pass`, và `grpc_pass`."

> [!tip] Liên hệ với phần Caching và API
> `memcached_pass` nghĩa là nginx **tự nói protocol Memcached** với cache server, không cần qua app — liên quan [[05 - Memcached]]. `grpc_pass` thì liên quan [[06 - gRPC và Protocol Buffers]].

### 4.3. `least_conn` — khi request dài ngắn không đều

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Least connected load balancing")
> "Another load balancing discipline is least-connected. Least-connected allows controlling the load on application instances more fairly in a situation when some of the requests take longer to complete.
>
> With the least-connected load balancing, nginx will try not to overload a busy application server with excessive requests, distributing the new requests to a less busy server instead.
>
> Least-connected load balancing in nginx is activated when the least_conn directive is used as part of the server group configuration:
>
> ```
>     upstream myapp1 {
>         least_conn;
>         server srv1.example.com;
>         server srv2.example.com;
>         server srv3.example.com;
>     }
> ```
> "

🇻🇳 **Dịch**
> "Một nguyên tắc load balancing khác là **least-connected**. Least-connected cho phép điều tiết tải trên các instance ứng dụng **công bằng hơn trong tình huống một số request cần lâu hơn để hoàn thành**.
>
> Với least-connected, nginx sẽ **cố không làm quá tải** một application server đang bận bằng quá nhiều request, mà thay vào đó phân phối request mới tới server ít bận hơn.
>
> Kích hoạt bằng cách dùng directive `least_conn` trong phần cấu hình server group."

> [!note] Vì sao round-robin không đủ
> Round-robin chia **số lượng request** đều nhau, không chia **thời gian xử lý**. Nếu một số request nặng (export báo cáo, tính toán lớn), server nhận request nặng sẽ ùn lại trong khi vẫn tiếp tục bị giao lượt. `least_conn` dùng số connection đang mở làm proxy cho "đang bận bao nhiêu".

### 4.4. `least_time` — theo thời gian phản hồi

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Least time load balancing")
> "Another load balancing discipline is least-time. Least-time selects the server with the lowest average response time and the lowest number of active connections, taking into account inflight requests.
>
> With the least-time load balancing, nginx selects the server based on which of the following parameters is specified in the least_time directive:
>
> - header — time to receive the first byte from the server,
> - last_byte — time to receive the full response from the server,
> - last_byte inflight — time to receive the full response from the server, taking into account incomplete requests."

🇻🇳 **Dịch**
> "Một nguyên tắc nữa là **least-time**. Least-time chọn server có **thời gian phản hồi trung bình thấp nhất** và **số connection đang hoạt động thấp nhất**, có tính tới các request đang trên đường (inflight).
>
> Với least-time, nginx chọn server dựa trên tham số nào được ghi trong directive `least_time`:
>
> - `header` — thời gian để nhận **byte đầu tiên** từ server,
> - `last_byte` — thời gian để nhận **toàn bộ response** từ server,
> - `last_byte inflight` — thời gian nhận toàn bộ response từ server, **có tính tới các request chưa hoàn thành**."

### 4.5. `ip_hash` và bài toán session persistence

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Session persistence")
> "Please note that with round-robin or least-connected load balancing, each subsequent client's request can be potentially distributed to a different server. There is no guarantee that the same client will be always directed to the same server.
>
> If there is the need to tie a client to a particular application server — in other words, make the client's session "sticky" or "persistent" in terms of always trying to select a particular server — the ip-hash load balancing mechanism can be used."

🇻🇳 **Dịch**
> "Xin lưu ý rằng với round-robin hay least-connected, **mỗi request tiếp theo của client đều có thể bị phân phối tới một server khác**. **Không có bảo đảm** rằng cùng một client sẽ luôn được đưa tới cùng một server.
>
> Nếu cần gắn một client với một application server cụ thể — nói cách khác là làm cho session của client trở nên **"sticky"** hay **"persistent"** theo nghĩa luôn cố chọn một server nhất định — thì có thể dùng cơ chế **ip-hash**."

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*)
> "With ip-hash, the client's IP address is used as a hashing key to determine what server in a server group should be selected for the client's requests. This method ensures that the requests from the same client will always be directed to the same server except when this server is unavailable.
>
> To configure ip-hash load balancing, just add the ip_hash directive to the server (upstream) group configuration:
>
> ```
> upstream myapp1 {
>     ip_hash;
>     server srv1.example.com;
>     server srv2.example.com;
>     server srv3.example.com;
> }
> ```
> "

🇻🇳 **Dịch**
> "Với ip-hash, **địa chỉ IP của client được dùng làm hashing key** để xác định server nào trong server group nên được chọn cho các request của client đó. Phương pháp này bảo đảm rằng các request từ cùng một client sẽ **luôn** được đưa tới cùng một server — **trừ khi server đó không khả dụng**."

> [!warning] "Sticky session" là cách giải quyết triệu chứng
> Đọc đúng câu docs: ip-hash **không** đảm bảo tuyệt đối — *"except when this server is unavailable"*. Tức là khi server rơi, client sẽ bị đẩy sang server khác và **session ở bộ nhớ server cũ mất**. Đó là lý do lưu session ở nơi dùng chung (Redis, DB) là cách giải gốc, còn `ip_hash` là giải pháp khi không sửa được app. Xem [[12 - Cookie và Session based Authentication]] và [[03 - Redis - Kiểu dữ liệu và lệnh cơ bản]].

### 4.6. `weight` — server mạnh nhận nhiều hơn

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Weighted load balancing")
> "It is also possible to influence nginx load balancing algorithms even further by using server weights.
>
> In the examples above, the server weights are not configured which means that all specified servers are treated as equally qualified for a particular load balancing method.
>
> With the round-robin in particular it also means a more or less equal distribution of requests across the servers — provided there are enough requests, and when the requests are processed in a uniform manner and completed fast enough."

🇻🇳 **Dịch**
> "Cũng có thể tác động sâu hơn vào các thuật toán load balancing của nginx bằng cách dùng **server weight** (trọng số server).
>
> Trong các ví dụ trên, weight không được cấu hình, nghĩa là mọi server được chỉ định đều được coi là **ngang nhau** đối với một phương pháp load balancing cụ thể.
>
> Với round-robin nói riêng, điều đó cũng có nghĩa là request được phân phối **gần như đều** trên các server — **miễn là** có đủ nhiều request, và khi các request được xử lý một cách đồng đều và hoàn thành đủ nhanh."

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*)
> "When the weight parameter is specified for a server, the weight is accounted as part of the load balancing decision.
>
> ```
>     upstream myapp1 {
>         server srv1.example.com weight=3;
>         server srv2.example.com;
>         server srv3.example.com;
>     }
> ```
>
> With this configuration, every 5 new requests will be distributed across the application instances as the following: 3 requests will be directed to srv1, one request will go to srv2, and another one — to srv3.
>
> It is similarly possible to use weights with the least-connected and ip-hash load balancing in the recent versions of nginx."

🇻🇳 **Dịch**
> "Khi tham số `weight` được ghi cho một server, weight được tính vào quyết định load balancing.
>
> Với cấu hình trên, **cứ 5 request mới** sẽ được phân phối như sau: 3 request tới `srv1`, một request tới `srv2`, và một nữa tới `srv3`.
>
> Tương tự, có thể dùng weight với least-connected và ip-hash **ở các phiên bản nginx gần đây**."

### 4.7. Health check thụ động: `max_fails` và `fail_timeout`

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Health checks")
> "Reverse proxy implementation in nginx includes in-band (or passive) server health checks. If the response from a particular server fails with an error, nginx will mark this server as failed, and will try to avoid selecting this server for subsequent inbound requests for a while."

🇻🇳 **Dịch**
> "Cài đặt reverse proxy trong nginx bao gồm **health check server kiểu in-band (hay thụ động — passive)**. Nếu response từ một server nào đó thất bại với lỗi, nginx sẽ **đánh dấu server đó là failed**, và sẽ cố tránh chọn server này cho các request inbound tiếp theo **trong một thời gian**."

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*)
> "The max_fails directive sets the number of consecutive unsuccessful attempts to communicate with the server that should happen during fail_timeout. By default, max_fails is set to 1. When it is set to 0, health checks are disabled for this server. The fail_timeout parameter also defines how long the server will be marked as failed. After fail_timeout interval following the server failure, nginx will start to gracefully probe the server with the live client's requests. If the probes have been successful, the server is marked as a live one."

🇻🇳 **Dịch**
> "Directive `max_fails` đặt **số lần thử liên tiếp không thành công** khi giao tiếp với server, cần xảy ra trong khoảng `fail_timeout`. **Theo mặc định `max_fails` bằng 1.** Khi đặt bằng 0, health check bị **tắt** cho server này. Tham số `fail_timeout` cũng định nghĩa **server sẽ bị đánh dấu là failed trong bao lâu**. Sau khoảng `fail_timeout` tính từ lúc server lỗi, nginx sẽ bắt đầu **thăm dò server một cách nhẹ nhàng bằng chính request của client thật**. Nếu các lần thăm dò thành công, server được đánh dấu là còn sống."

> [!warning] "Passive" nghĩa là dò bằng request của người dùng thật
> Docs viết rõ: *"probe the server with the live client's requests"*. Không có endpoint `/health` nào được gọi riêng ở bản mã nguồn mở. Nghĩa là **một số người dùng thật sẽ là người hứng lỗi** cho mỗi lần dò lại. Và `max_fails=1` mặc định nghĩa là **một lỗi đơn lẻ** cũng đủ loại server khỏi vòng — điều cần biết khi backend có lỗi 5xx lác đác.

### 4.8. Những gì docs nói là nằm ngoài trang này

📖 **Nguyên văn** (nginx.org — *Using nginx as HTTP load balancer*, mục "Further reading")
> "In addition, there are more directives and parameters that control server load balancing in nginx, e.g. proxy_next_upstream, backup, down, and keepalive. For more information please check our reference documentation.
>
> Last but not least, application load balancing, application health checks, activity monitoring and on-the-fly reconfiguration of server groups are available as part of our paid NGINX Plus subscriptions."

🇻🇳 **Dịch**
> "Ngoài ra còn có thêm các directive và tham số điều khiển việc load balancing server trong nginx, ví dụ `proxy_next_upstream`, `backup`, `down`, và `keepalive`. Xem tài liệu tham chiếu để biết thêm.
>
> Cuối cùng, **application load balancing, application health check, activity monitoring và cấu hình lại server group khi đang chạy** là các tính năng thuộc **gói NGINX Plus có phí**."

> [!note] Ranh giới mã nguồn mở / thương mại
> Docs nói thẳng: **active health check** (chủ động gọi endpoint kiểm tra) và **đổi server group không cần reload** là tính năng của NGINX Plus. Bản mã nguồn mở chỉ có passive health check ở mục 4.7, và muốn đổi danh sách server thì phải sửa config rồi `nginx -s reload` ([[03 - Nginx - Kiến trúc và xử lý request]] mục 2.2).

---

## 5. Những chỗ docs KHÔNG nói

- **Hai trang docs được trích không có con số hiệu năng nào.** Từ "very efficient" là mô tả định tính của docs, không kèm benchmark.
- **Không có hướng dẫn `proxy_set_header`** (truyền `Host`, `X-Forwarded-For`) trong Beginner's Guide. Đây là điều quan trọng trong thực tế (liên quan "trusted gateway" của RFC 9110 §7.4 ở [[01 - Web Server là gì]]) nhưng nằm ở trang directive `proxy_*`, nên bài không trích.
- **Không có TLS/HTTPS setup** trong hai trang này (có trang riêng *Configuring HTTPS servers*).
- **Không có caching** (`proxy_cache`) — trang riêng; phần khái niệm đã học ở [[02 - HTTP Caching]].
- **`least_time` thuộc bản nào** — trang load balancing giới thiệu nó cùng các method khác mà không nói rõ nó là tính năng của NGINX Plus hay mã nguồn mở, nên bài không kết luận điều đó.

---

## Nguồn tham khảo
- nginx — *Beginner's Guide*: <https://nginx.org/en/docs/beginners_guide.html>
- nginx — *Using nginx as HTTP load balancer*: <https://nginx.org/en/docs/http/load_balancing.html>
- nginx documentation: <https://nginx.org/en/docs/>
