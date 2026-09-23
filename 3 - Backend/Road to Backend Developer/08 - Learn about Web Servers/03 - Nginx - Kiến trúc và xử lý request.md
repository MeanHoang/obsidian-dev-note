# 03 — Nginx: Kiến trúc và xử lý request

> **Nguồn chính:** nginx documentation (nginx.org) — bốn trang:
> - *Beginner's Guide* — https://nginx.org/en/docs/beginners_guide.html
> - *Controlling nginx* — https://nginx.org/en/docs/control.html
> - *How nginx processes a request* — https://nginx.org/en/docs/http/request_processing.html
> - *Server names* — https://nginx.org/en/docs/http/server_names.html

**Nginx là gì:** một web server mã nguồn mở, đồng thời làm được reverse proxy, load balancer và cache. Theo thuật ngữ RFC 9110 ở [[01 - Web Server là gì]], nó có thể đóng vai origin server (serve file) hoặc gateway (proxy về backend) tuỳ cấu hình.

Bài này chỉ nói **kiến trúc tiến trình** và **cách nginx quyết định request này thuộc về đâu**. Phần cấu hình serve file / proxy / load balancing nằm ở [[04 - Nginx - Serving, Proxy và Load Balancing]].

---

## 1. Kiến trúc: một master, nhiều worker

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "nginx has one master process and several worker processes. The main purpose of the master process is to read and evaluate configuration, and maintain worker processes. Worker processes do actual processing of requests. nginx employs event-based model and OS-dependent mechanisms to efficiently distribute requests among worker processes. The number of worker processes is defined in the configuration file and may be fixed for a given configuration or automatically adjusted to the number of available CPU cores (see worker_processes)."

🇻🇳 **Dịch**
> "nginx có **một master process và vài worker process**. Mục đích chính của master process là đọc và đánh giá cấu hình, cùng việc duy trì các worker process. **Các worker process mới là bên thực sự xử lý request.** nginx dùng mô hình dựa trên event (event-based model) và các cơ chế tuỳ theo hệ điều hành để phân phối request giữa các worker process một cách hiệu quả. Số worker process được định nghĩa trong file cấu hình, và có thể cố định cho một cấu hình cho trước hoặc **tự động điều chỉnh theo số CPU core khả dụng** (xem `worker_processes`)."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "The way nginx and its modules work is determined in the configuration file. By default, the configuration file is named nginx.conf and placed in the directory /usr/local/nginx/conf, /etc/nginx, or /usr/local/etc/nginx."

🇻🇳 **Dịch**
> "Cách nginx và các module của nó hoạt động được quyết định trong file cấu hình. Theo mặc định, file cấu hình có tên `nginx.conf` và nằm ở thư mục `/usr/local/nginx/conf`, `/etc/nginx`, hoặc `/usr/local/etc/nginx`."

📖 **Nguyên văn** (nginx.org — *Controlling nginx*, ví dụ output `ps`)
> ```
>   PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
> 33126     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
> 33127 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
> 33128 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
> 33129 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
> ```

🇻🇳 **Giải thích bảng trên (chỉ đọc từ chính bảng)**
> Master chạy dưới user `root` (PID 33126, cha là PID 1). Ba worker có `PPID` = 33126 tức con của master, và chạy dưới user `nobody` — **không phải root**.

> [!note] Vì sao master là root mà worker là nobody
> Master cần quyền root để mở listen socket ở port thấp (80/443) và mở log file. Worker — bên thực sự đọc dữ liệu từ Internet — thì hạ quyền. Đây là mô hình privilege separation; đọc chính bảng `ps` của docs là thấy ngay.

💡 **Ví dụ đời sống — master và worker**
Một quán ăn.
- **Master** = chủ quán: đọc thực đơn mới, thuê/cho nghỉ nhân viên, giữ chìa khoá cửa. Chủ **không trực tiếp chạy bàn**.
- **Worker** = nhân viên chạy bàn: người thực sự nhận order và mang đồ ra.
- Đổi thực đơn (reload config) → chủ **không** bắt nhân viên đang bưng đĩa dừng tay. Chủ gọi ca mới vào theo thực đơn mới, còn ca cũ phục vụ xong nốt bàn của mình rồi mới ra về. Mục 2 dưới đây là chính xác cơ chế này.

---

## 2. Điều khiển nginx bằng signal

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "To start nginx, run the executable file. Once nginx is started, it can be controlled by invoking the executable with the -s parameter. Use the following syntax:
>
> ```
> nginx -s signal
> ```
>
> Where signal may be one of the following:
>
> - stop — fast shutdown
> - quit — graceful shutdown
> - reload — reloading the configuration file
> - reopen — reopening the log files"

🇻🇳 **Dịch**
> "Để khởi động nginx, chạy file thực thi. Khi nginx đã chạy, có thể điều khiển nó bằng cách gọi file thực thi với tham số `-s`, cú pháp `nginx -s signal`, trong đó `signal` là một trong:
> - `stop` — **fast shutdown** (tắt nhanh)
> - `quit` — **graceful shutdown** (tắt nhẹ nhàng)
> - `reload` — nạp lại file cấu hình
> - `reopen` — mở lại các log file"

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "For example, to stop nginx processes with waiting for the worker processes to finish serving current requests, the following command can be executed:
>
> ```
> nginx -s quit
> ```
>
> This command should be executed under the same user that started nginx."

🇻🇳 **Dịch**
> "Ví dụ, để dừng các tiến trình nginx **có chờ** các worker process phục vụ xong những request hiện tại, có thể chạy `nginx -s quit`. Lệnh này phải được chạy dưới **cùng user đã khởi động nginx**."

### 2.1. Danh sách signal mà master hỗ trợ

📖 **Nguyên văn** (nginx.org — *Controlling nginx*)
> "nginx can be controlled with signals. The process ID of the master process is written to the file /usr/local/nginx/logs/nginx.pid by default. This name may be changed at configuration time, or in nginx.conf using the pid directive. The master process supports the following signals:
>
> - TERM, INT — fast shutdown
> - QUIT — graceful shutdown
> - HUP — changing configuration, keeping up with a changed time zone (only for FreeBSD and Linux), starting new worker processes with a new configuration, graceful shutdown of old worker processes
> - USR1 — re-opening log files
> - USR2 — upgrading an executable file
> - WINCH — graceful shutdown of worker processes"

🇻🇳 **Dịch**
> "nginx có thể được điều khiển bằng signal. Process ID của master process được ghi vào file `/usr/local/nginx/logs/nginx.pid` theo mặc định. Tên này có thể đổi ở thời điểm configure, hoặc trong `nginx.conf` bằng directive `pid`. Master process hỗ trợ các signal sau:
> - `TERM`, `INT` — tắt nhanh
> - `QUIT` — tắt nhẹ nhàng
> - `HUP` — đổi cấu hình; bắt kịp thay đổi time zone (chỉ trên FreeBSD và Linux); khởi động worker process mới với cấu hình mới; tắt nhẹ nhàng các worker cũ
> - `USR1` — mở lại log file
> - `USR2` — nâng cấp file thực thi
> - `WINCH` — tắt nhẹ nhàng các worker process"

📖 **Nguyên văn** (nginx.org — *Controlling nginx*)
> "Individual worker processes can be controlled with signals as well, though it is not required. The supported signals are:
>
> - TERM, INT — fast shutdown
> - QUIT — graceful shutdown
> - USR1 — re-opening log files
> - WINCH — abnormal termination for debugging (requires debug_points to be enabled)"

🇻🇳 **Dịch**
> "Từng worker process riêng lẻ cũng có thể điều khiển bằng signal, **tuy không cần thiết**. Các signal được hỗ trợ: `TERM`/`INT` tắt nhanh, `QUIT` tắt nhẹ nhàng, `USR1` mở lại log file, `WINCH` kết thúc bất thường để debug (cần bật `debug_points`)."

### 2.2. Reload cấu hình: cơ chế chính xác

📖 **Nguyên văn** (nginx.org — *Controlling nginx*, mục "Changing Configuration")
> "In order for nginx to re-read the configuration file, a HUP signal should be sent to the master process. The master process first checks the syntax validity, then tries to apply new configuration, that is, to open log files and new listen sockets. If this fails, it rolls back changes and continues to work with old configuration. If this succeeds, it starts new worker processes, and sends messages to old worker processes requesting them to shut down gracefully. Old worker processes close listen sockets and continue to service old clients. After all clients are serviced, old worker processes are shut down."

🇻🇳 **Dịch**
> "Để nginx đọc lại file cấu hình, cần gửi signal `HUP` tới master process. Master process **trước tiên kiểm tra tính hợp lệ của syntax**, sau đó thử áp dụng cấu hình mới — tức là mở các log file và các listen socket mới. **Nếu thất bại, nó hoàn tác các thay đổi và tiếp tục làm việc với cấu hình cũ.** Nếu thành công, nó khởi động các worker process mới, và gửi thông điệp tới các worker cũ yêu cầu chúng tắt nhẹ nhàng. Các worker cũ **đóng listen socket và tiếp tục phục vụ những client cũ**. Sau khi mọi client đã được phục vụ xong, các worker cũ mới bị tắt."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, cùng cơ chế diễn đạt cách khác)
> "Changes made in the configuration file will not be applied until the command to reload configuration is sent to nginx or it is restarted. ... Once the master process receives the signal to reload configuration, it checks the syntax validity of the new configuration file and tries to apply the configuration provided in it. If this is a success, the master process starts new worker processes and sends messages to old worker processes, requesting them to shut down. Otherwise, the master process rolls back the changes and continues to work with the old configuration. Old worker processes, receiving a command to shut down, stop accepting new connections and continue to service current requests until all such requests are serviced. After that, the old worker processes exit."

🇻🇳 **Dịch**
> "Những thay đổi trong file cấu hình **sẽ không được áp dụng** cho tới khi lệnh reload cấu hình được gửi tới nginx, hoặc nginx được restart. ... Khi master process nhận signal reload cấu hình, nó kiểm tra tính hợp lệ syntax của file cấu hình mới và thử áp dụng cấu hình trong đó. Nếu thành công, master khởi động worker mới và gửi thông điệp cho các worker cũ yêu cầu tắt. Ngược lại, master **hoàn tác** các thay đổi và tiếp tục với cấu hình cũ. Các worker cũ, khi nhận lệnh tắt, **ngừng nhận connection mới** và tiếp tục phục vụ những request hiện tại cho tới khi mọi request như vậy được phục vụ xong. Sau đó các worker cũ thoát."

> [!tip] Đây là zero-downtime reload — và nó có điều kiện
> Docs nói rõ hai điều: (1) syntax sai thì **rollback**, cấu hình cũ vẫn chạy → nên `reload` an toàn hơn `restart` rất nhiều; (2) worker cũ **vẫn sống** đến khi phục vụ xong request đang dở. Nghĩa là sau reload, trong một khoảng thời gian có **cả hai thế hệ worker** cùng chạy, với hai cấu hình khác nhau. Đúng như ví dụ `ps` mà docs đưa ra:

📖 **Nguyên văn** (nginx.org — *Controlling nginx*, sau khi gửi HUP)
> ```
>   PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
> 33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
> 33129 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
> 33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
> 33135 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
> 33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
> ```
> "One of the old worker processes with PID 33129 still continues to work. After some time it exits"

🇻🇳 **Dịch**
> "Một trong các worker cũ, PID 33129, vẫn tiếp tục làm việc. Sau một thời gian nó thoát." — chú ý dòng của nó ghi `worker process is shutting down`, khác với ba worker mới ghi `worker process`.

### 2.3. Xoay log file

📖 **Nguyên văn** (nginx.org — *Controlling nginx*, mục "Rotating Log-files")
> "In order to rotate log files, they need to be renamed first. After that USR1 signal should be sent to the master process. The master process will then re-open all currently open log files and assign them an unprivileged user under which the worker processes are running, as an owner. After successful re-opening, the master process closes all open files and sends the message to worker process to ask them to re-open files. Worker processes also open new files and close old files right away. As a result, old files are almost immediately available for post processing, such as compression."

🇻🇳 **Dịch**
> "Để xoay (rotate) log file, **trước tiên phải đổi tên chúng**. Sau đó gửi signal `USR1` tới master process. Master process sẽ mở lại tất cả log file đang mở và gán quyền sở hữu cho user không đặc quyền — user mà các worker process đang chạy dưới. Sau khi mở lại thành công, master đóng mọi file đang mở và gửi thông điệp cho worker process yêu cầu chúng mở lại file. Các worker cũng mở file mới và đóng file cũ ngay lập tức. Kết quả là **các file cũ gần như lập tức sẵn sàng để xử lý hậu kỳ**, chẳng hạn nén lại."

> [!warning] Thứ tự quan trọng: rename TRƯỚC, signal SAU
> Docs viết rõ *"they need to be renamed first"*. Nếu xoá file log thay vì đổi tên, worker vẫn đang giữ file descriptor trỏ tới inode đã bị unlink → log tiếp tục ghi vào chỗ không ai đọc được, và dung lượng đĩa không được giải phóng. Đây là lý do `logrotate` dùng `copytruncate` hoặc `postrotate` gửi `USR1`.

### 2.4. Nâng cấp file thực thi khi đang chạy

📖 **Nguyên văn** (nginx.org — *Controlling nginx*, mục "Upgrading Executable on the Fly")
> "In order to upgrade the server executable, the new executable file should be put in place of an old file first. After that USR2 signal should be sent to the master process. The master process first renames its file with the process ID to a new file with the .oldbin suffix, e.g. /usr/local/nginx/logs/nginx.pid.oldbin, then starts a new executable file that in turn starts new worker processes"

🇻🇳 **Dịch**
> "Để nâng cấp file thực thi của server, **trước tiên đặt file thực thi mới vào đúng chỗ của file cũ**. Sau đó gửi signal `USR2` tới master process. Master process đầu tiên đổi tên file chứa process ID của nó thành file mới với hậu tố `.oldbin` (ví dụ `/usr/local/nginx/logs/nginx.pid.oldbin`), rồi khởi động file thực thi mới — file này lần lượt khởi động các worker process mới."

📖 **Nguyên văn** (nginx.org — *Controlling nginx*)
> "After that all worker processes (old and new ones) continue to accept requests. If the WINCH signal is sent to the first master process, it will send messages to its worker processes, requesting them to shut down gracefully, and they will start to exit"

🇻🇳 **Dịch**
> "Sau đó **tất cả worker process (cả cũ lẫn mới) tiếp tục nhận request**. Nếu gửi signal `WINCH` tới master process đầu tiên, nó sẽ gửi thông điệp cho các worker của mình yêu cầu tắt nhẹ nhàng, và chúng bắt đầu thoát."

📖 **Nguyên văn** (nginx.org — *Controlling nginx*)
> "It should be noted that the old master process does not close its listen sockets, and it can be managed to start its worker processes again if needed. If for some reason the new executable file works unacceptably, one of the following can be done:
>
> - Send the HUP signal to the old master process. The old master process will start new worker processes without re-reading the configuration. After that, all new processes can be shut down gracefully, by sending the QUIT signal to the new master process.
> - Send the TERM signal to the new master process. It will then send a message to its worker processes requesting them to exit immediately, and they will all exit almost immediately. (If new processes do not exit for some reason, the KILL signal should be sent to them to force them to exit.) When the new master process exits, the old master process will start new worker processes automatically."

🇻🇳 **Dịch**
> "Cần lưu ý rằng **master process cũ không đóng các listen socket của nó**, và có thể điều khiển nó khởi động lại các worker process của mình nếu cần. Nếu vì lý do nào đó file thực thi mới hoạt động không chấp nhận được, có thể làm một trong hai cách:
> - Gửi `HUP` tới master cũ. Master cũ sẽ khởi động worker mới **mà không đọc lại cấu hình**. Sau đó tắt nhẹ nhàng toàn bộ tiến trình mới bằng cách gửi `QUIT` tới master mới.
> - Gửi `TERM` tới master mới. Nó sẽ yêu cầu các worker của mình thoát ngay, và chúng thoát gần như lập tức. (Nếu vì lý do nào đó các tiến trình mới không thoát, gửi `KILL` để buộc thoát.) Khi master mới thoát, **master cũ sẽ tự động khởi động lại các worker process**."

📖 **Nguyên văn** (nginx.org — *Controlling nginx*)
> "If the new master process exits then the old master process discards the .oldbin suffix from the file name with the process ID.
>
> If upgrade was successful, then the QUIT signal should be sent to the old master process, and only new processes will stay"

🇻🇳 **Dịch**
> "Nếu master process mới thoát, master cũ **bỏ hậu tố `.oldbin`** khỏi tên file chứa process ID.
>
> Nếu nâng cấp thành công, gửi `QUIT` tới master cũ, và chỉ các tiến trình mới còn lại."

> [!note] Đây là rollback binary không mất một request nào
> Cả binary cũ và mới cùng accept request trong giai đoạn chuyển tiếp, và listen socket **không bao giờ bị đóng**. Vì vậy hỏng thì lùi được, tốt thì `QUIT` master cũ. So sánh: nếu deploy bằng `restart`, listen socket bị đóng — mọi connection đang tới trong khoảnh khắc đó bị mất.

---

## 3. Cấu trúc file cấu hình: directive và context

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, mục "Configuration File's Structure")
> "nginx consists of modules which are controlled by directives specified in the configuration file. Directives are divided into simple directives and block directives. A simple directive consists of the name and parameters separated by spaces and ends with a semicolon (;). A block directive has the same structure as a simple directive, but instead of the semicolon it ends with a set of additional instructions surrounded by braces ({ and }). If a block directive can have other directives inside braces, it is called a context (examples: events, http, server, and location)."

🇻🇳 **Dịch**
> "nginx gồm các **module** được điều khiển bởi các **directive** ghi trong file cấu hình. Directive chia thành **simple directive** và **block directive**. Một simple directive gồm tên và các tham số phân tách bằng khoảng trắng, kết thúc bằng dấu chấm phẩy (`;`). Một block directive có cùng cấu trúc như simple directive, nhưng thay vì dấu chấm phẩy thì kết thúc bằng một tập chỉ thị bổ sung nằm trong dấu ngoặc nhọn (`{` và `}`). Nếu một block directive có thể chứa các directive khác trong ngoặc nhọn, nó được gọi là một **context** (ví dụ: `events`, `http`, `server`, và `location`)."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Directives placed in the configuration file outside of any contexts are considered to be in the main context. The events and http directives reside in the main context, server in http, and location in server.
>
> The rest of a line after the # sign is considered a comment."

🇻🇳 **Dịch**
> "Các directive đặt trong file cấu hình mà **nằm ngoài mọi context** được coi là thuộc **main context**. Directive `events` và `http` nằm ở main context; `server` nằm trong `http`; và `location` nằm trong `server`.
>
> Phần còn lại của một dòng sau dấu `#` được coi là comment."

Tóm lại thứ tự lồng nhau, lấy đúng từ đoạn trên:

```
main context
├── events { ... }
└── http { ... }
    └── server { ... }
        └── location { ... }
```

---

## 4. Bước 1 — nginx chọn `server` block nào

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*, mục "Name-based virtual servers")
> "nginx first decides which server should process the request. Let's start with a simple configuration where all three virtual servers listen on port *:80:
>
> ```
> server {
>     listen      80;
>     server_name example.org www.example.org;
>     ...
> }
>
> server {
>     listen      80;
>     server_name example.net www.example.net;
>     ...
> }
>
> server {
>     listen      80;
>     server_name example.com www.example.com;
>     ...
> }
> ```
>
> In this configuration nginx tests only the request's header field "Host" to determine which server the request should be routed to. If its value does not match any server name, or the request does not contain this header field at all, then nginx will route the request to the default server for this port. In the configuration above, the default server is the first one — which is nginx's standard default behaviour."

🇻🇳 **Dịch**
> "nginx **trước tiên quyết định server nào nên xử lý request**. Với cấu hình đơn giản mà cả ba virtual server cùng listen port `*:80` như trên: nginx **chỉ kiểm tra header field "Host"** của request để xác định request nên được định tuyến tới server nào. Nếu giá trị của nó **không khớp** server name nào, hoặc request **không có** header field này, thì nginx định tuyến request tới **default server** của port đó. Trong cấu hình trên, default server là server **đầu tiên** — đó là hành vi mặc định chuẩn của nginx."

> [!note] Đây là §7.2 của RFC 9110 được cài đặt
> [[01 - Web Server là gì]] có câu spec: `Host` là *"application-level routing mechanism"*. Đoạn docs trên là chính xác cơ chế đó ở mức sản phẩm: `server_name` khớp với `Host`.

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*)
> "It can also be set explicitly which server should be default, with the default_server parameter in the listen directive:
>
> ```
> server {
>     listen      80 default_server;
>     server_name example.net www.example.net;
>     ...
> }
> ```
>
> The default_server parameter has been available since version 0.8.21. In earlier versions the default parameter should be used instead.
>
> Note that the default server is a property of the listen port and not of the server name."

🇻🇳 **Dịch**
> "Cũng có thể đặt tường minh server nào là default, bằng tham số `default_server` trong directive `listen`. Tham số `default_server` có từ phiên bản 0.8.21; ở các phiên bản cũ hơn thì dùng tham số `default`.
>
> **Lưu ý rằng default server là một thuộc tính của listen port, chứ không phải của server name.**"

### 4.1. Chặn request không có `Host`

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*, mục "How to prevent processing requests with undefined server names")
> "If requests without the "Host" header field should not be allowed, a server that just drops the requests can be defined:
>
> ```
> server {
>     listen      80;
>     server_name "";
>     return      444;
> }
> ```
>
> Here, the server name is set to an empty string that will match requests without the "Host" header field, and a special nginx's non-standard code 444 is returned that closes the connection."

🇻🇳 **Dịch**
> "Nếu không muốn cho phép các request thiếu header field "Host", có thể định nghĩa một server chỉ để **drop** những request đó (xem config trên). Ở đây server name được đặt bằng **chuỗi rỗng**, sẽ khớp với các request không có header field "Host", và một mã **không chuẩn riêng của nginx là 444** được trả về, mã này **đóng connection**."

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*)
> "Since version 0.8.48, this is the default setting for the server name, so the server_name "" can be omitted. In earlier versions, the machine's hostname was used as a default server name."

🇻🇳 **Dịch**
> "Từ phiên bản 0.8.48, đây là thiết lập mặc định cho server name, nên có thể bỏ `server_name ""`. Ở các phiên bản cũ hơn, **hostname của máy** được dùng làm server name mặc định."

> [!tip] 444 không phải status code HTTP
> Docs gọi thẳng nó là *"nginx's non-standard code"*. Nó không nằm trong RFC 9110 §15 — tác dụng của nó là **đóng connection mà không trả response nào**. Đừng tìm 444 trong [[04 - HTTP Status Code và thiết kế lỗi]]; nó là quy ước nội bộ của nginx.

### 4.2. Khi có nhiều địa chỉ IP: IP+port trước, `Host` sau

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*, mục "Mixed name-based and IP-based virtual servers")
> "In this configuration, nginx first tests the IP address and port of the request against the listen directives of the server blocks. It then tests the "Host" header field of the request against the server_name entries of the server blocks that matched the IP address and port. If the server name is not found, the request will be processed by the default server. For example, a request for www.example.com received on the 192.168.1.1:80 port will be handled by the default server of the 192.168.1.1:80 port, i.e., by the first server, since there is no www.example.com defined for this port."

🇻🇳 **Dịch**
> "Trong cấu hình này, nginx **trước tiên** kiểm tra địa chỉ IP và port của request đối chiếu với các directive `listen` của các block `server`. **Sau đó** nó kiểm tra header field "Host" của request đối chiếu với các mục `server_name` của những block `server` **đã khớp IP và port**. Nếu không tìm thấy server name, request sẽ được xử lý bởi default server. Ví dụ, một request cho `www.example.com` nhận trên port `192.168.1.1:80` sẽ được xử lý bởi default server của port `192.168.1.1:80` — tức là server đầu tiên — vì không có `www.example.com` nào được định nghĩa cho port này."

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*)
> "As already stated, a default server is a property of the listen port, and different default servers may be defined for different ports"

🇻🇳 **Dịch**
> "Như đã nêu, default server là thuộc tính của **listen port**, và **có thể định nghĩa default server khác nhau cho các port khác nhau**."

### 4.3. Thứ tự ưu tiên khi khớp `server_name`

📖 **Nguyên văn** (nginx.org — *Server names*)
> "Server names are defined using the server_name directive and determine which server block is used for a given request. ... They may be defined using exact names, wildcard names, or regular expressions"

🇻🇳 **Dịch**
> "Server name được định nghĩa bằng directive `server_name` và quyết định block `server` nào được dùng cho một request cho trước. Chúng có thể được định nghĩa bằng **exact name**, **wildcard name**, hoặc **regular expression**."

📖 **Nguyên văn** (nginx.org — *Server names*)
> "The search is performed in the following order of priority and terminates on the first matching variant:
>
> - the exact name
> - the longest wildcard name starting with an asterisk, e.g. "*.example.org"
> - the longest wildcard name ending with an asterisk, e.g. "mail.*"
> - the first matching regular expression (in order of appearance in the configuration file)"

🇻🇳 **Dịch**
> "Việc tìm kiếm được thực hiện theo thứ tự ưu tiên sau và **dừng ngay ở biến thể khớp đầu tiên**:
>
> 1. **exact name** (tên chính xác)
> 2. **wildcard name dài nhất bắt đầu bằng dấu sao**, ví dụ `*.example.org`
> 3. **wildcard name dài nhất kết thúc bằng dấu sao**, ví dụ `mail.*`
> 4. **regular expression khớp đầu tiên** (theo thứ tự xuất hiện trong file cấu hình)"

📖 **Nguyên văn** (nginx.org — *Server names*, mục "Wildcard names")
> "A wildcard name may contain an asterisk only on the name's start or end, and only on a dot border. The names "www.*.example.org" and "w*.example.org" are invalid. However, these names can be specified using regular expressions, for example, "~^www\..+\.example\.org$" and "~^w.*\.example\.org$". An asterisk can match several name parts. The name "*.example.org" matches not only www.example.org but www.sub.example.org as well.
>
> A special wildcard name in the form ".example.org" can be used to match both the exact name "example.org" and the wildcard name "*.example.org"."

🇻🇳 **Dịch**
> "Một wildcard name chỉ được chứa dấu sao ở **đầu hoặc cuối** tên, và **chỉ tại biên của dấu chấm**. Các tên `www.*.example.org` và `w*.example.org` là **không hợp lệ**. Tuy nhiên có thể diễn đạt chúng bằng regular expression, ví dụ `~^www\..+\.example\.org$` và `~^w.*\.example\.org$`. Một dấu sao **có thể khớp nhiều phần tên**: tên `*.example.org` khớp không chỉ `www.example.org` mà còn `www.sub.example.org`.
>
> Một wildcard name đặc biệt dạng `.example.org` có thể dùng để khớp **cả** tên chính xác `example.org` **và** wildcard name `*.example.org`."

📖 **Nguyên văn** (nginx.org — *Server names*, mục "Regular expressions names")
> "The regular expressions used by nginx are compatible with those used by the Perl programming language (PCRE). To use a regular expression, the server name must start with the tilde character:
>
> ```
> server_name  ~^www\d+\.example\.net$;
> ```
>
> otherwise it will be treated as an exact name, or if the expression contains an asterisk, as a wildcard name (and most likely as an invalid one). Do not forget to set "^" and "$" anchors. They are not required syntactically, but logically. Also note that domain name dots should be escaped with a backslash."

🇻🇳 **Dịch**
> "Các regular expression mà nginx dùng tương thích với của Perl (PCRE). Để dùng regular expression, server name **phải bắt đầu bằng dấu ngã `~`**; nếu không nó sẽ bị coi là exact name, hoặc nếu biểu thức chứa dấu sao thì bị coi là wildcard name (và rất có thể là một wildcard không hợp lệ). **Đừng quên đặt neo `^` và `$`** — chúng không bắt buộc về syntax, nhưng bắt buộc về logic. Cũng lưu ý rằng **dấu chấm trong tên domain phải được escape bằng backslash**."

> [!warning] Hai cái bẫy trong đoạn trên
> - Thiếu `~` → regex của bạn bị hiểu thành **exact name** và sẽ không bao giờ khớp. Không có cảnh báo.
> - Thiếu `^`/`$` → docs nói "không bắt buộc về syntax nhưng bắt buộc về logic": `~example\.net` sẽ khớp cả `evil-example.net.attacker.com`.

---

## 5. Bước 2 — nginx chọn `location` nào

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*)
> "Once nginx decides which server processes a request, it tests the URI specified in the request's header against the parameters of the location directives defined inside the server block."

🇻🇳 **Dịch**
> "Khi nginx đã quyết định server nào xử lý một request, nó kiểm tra **URI** ghi trong header của request đối chiếu với các tham số của những directive `location` được định nghĩa bên trong block `server` đó."

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*, mục "A simple PHP site configuration")
> "nginx first searches for the most specific prefix location given by literal strings regardless of the listed order. In the configuration above the only prefix location is "/" and since it matches any request it will be used as a last resort. Then nginx checks locations given by regular expression in the order listed in the configuration file. The first matching expression stops the search and nginx will use this location. If no regular expression matches a request, then nginx uses the most specific prefix location found earlier."

🇻🇳 **Dịch**
> "nginx **trước tiên tìm prefix location cụ thể nhất** cho bởi các chuỗi ký tự thuần (literal string), **bất kể thứ tự liệt kê**. Trong cấu hình trên, prefix location duy nhất là `/`, và vì nó khớp mọi request nên sẽ được dùng như phương án cuối. **Sau đó** nginx kiểm tra các location cho bởi regular expression **theo đúng thứ tự liệt kê trong file cấu hình**. **Biểu thức khớp đầu tiên sẽ dừng việc tìm kiếm** và nginx dùng location đó. Nếu không regular expression nào khớp request, nginx dùng prefix location cụ thể nhất đã tìm được trước đó."

📖 **Nguyên văn** (nginx.org — *Beginner's Guide*, cùng luật diễn đạt gọn hơn)
> "When nginx selects a location block to serve a request it first checks location directives that specify prefixes, remembering location with the longest prefix, and then checks regular expressions. If there is a match with a regular expression, nginx picks this location or, otherwise, it picks the one remembered earlier."

🇻🇳 **Dịch**
> "Khi nginx chọn một block `location` để phục vụ một request, nó **trước tiên** kiểm tra các directive `location` chỉ định prefix, **ghi nhớ** location có prefix dài nhất, **rồi sau đó** kiểm tra các regular expression. Nếu có khớp với một regular expression, nginx chọn location đó; **nếu không**, nó chọn cái đã ghi nhớ trước đó."

**Tóm lại luật chọn location, đúng theo hai đoạn trên:**

| Bước | Việc nginx làm | Thứ tự trong file có quan trọng? |
|---|---|---|
| 1 | Tìm **prefix** khớp dài nhất → ghi nhớ | ❌ Không |
| 2 | Duyệt các **regex** từ trên xuống, khớp cái đầu tiên thì dừng | ✅ Có |
| 3 | Có regex khớp → dùng regex. Không có → dùng prefix đã nhớ | — |

> [!warning] Regex thắng prefix, bất kể prefix dài hơn
> Đây là chỗ hay gây bất ngờ nhất. `location /images/deep/path/` (prefix rất cụ thể) vẫn **bị** `location ~ \.png$` (regex) giành mất nếu URI kết thúc `.png`. Muốn prefix thắng thì phải dùng modifier khác — nhưng bốn trang docs được trích trong bài này **không mô tả** các modifier `=` và `^~`, nên bài không bàn tới (xem docs directive `location` để biết thêm).

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*)
> "Note that locations of all types test only a URI part of request line without arguments. This is done because arguments in the query string may be given in several ways, for example:
>
> ```
> /index.php?user=john&page=1
> /index.php?page=1&user=john
> ```
>
> Besides, anyone may request anything in the query string:
>
> ```
> /index.php?page=1&something+else&user=john
> ```
> "

🇻🇳 **Dịch**
> "Lưu ý rằng location của **mọi loại** chỉ kiểm tra **phần URI của request line, không gồm arguments**. Lý do là arguments trong query string có thể được cho theo nhiều cách khác nhau (ví dụ `/index.php?user=john&page=1` và `/index.php?page=1&user=john`). Ngoài ra, **ai cũng có thể yêu cầu bất cứ thứ gì trong query string** (ví dụ `/index.php?page=1&something+else&user=john`)."

> [!note] Hệ quả: không định tuyến theo query string ở tầng location
> Docs đưa lý do thẳng thắn: query string không có thứ tự chuẩn và ai cũng nhét được gì vào đó. Nếu cần rẽ nhánh theo query, phải làm ở tầng khác (biến `$arg_*`, `if`, hoặc trong app), chứ `location` sẽ không bao giờ thấy nó.

### 5.1. Ví dụ docs tự chạy qua từng request

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*, với cấu hình PHP site ở trên)
> "A request "/logo.gif" is matched by the prefix location "/" first and then by the regular expression "\.(gif|jpg|png)$", therefore, it is handled by the latter location. Using the directive "root /data/www" the request is mapped to the file /data/www/logo.gif, and the file is sent to the client.
>
> A request "/index.php" is also matched by the prefix location "/" first and then by the regular expression "\.(php)$". Therefore, it is handled by the latter location and the request is passed to a FastCGI server listening on localhost:9000. ...
>
> A request "/about.html" is matched by the prefix location "/" only, therefore, it is handled in this location. Using the directive "root /data/www" the request is mapped to the file /data/www/about.html, and the file is sent to the client."

🇻🇳 **Dịch**
> "Request `/logo.gif` khớp prefix location `/` trước, rồi khớp regular expression `\.(gif|jpg|png)$`; **do đó nó được xử lý bởi location sau**. Nhờ directive `root /data/www`, request được map tới file `/data/www/logo.gif`, và file được gửi cho client.
>
> Request `/index.php` cũng khớp prefix location `/` trước rồi khớp regular expression `\.(php)$`. Do đó nó được xử lý bởi location sau và request **được chuyển tới một FastCGI server** đang lắng nghe ở `localhost:9000`.
>
> Request `/about.html` **chỉ** khớp prefix location `/`, nên được xử lý ở location này. Nhờ `root /data/www`, request được map tới file `/data/www/about.html` và file được gửi cho client."

📖 **Nguyên văn** (nginx.org — *How nginx processes a request*)
> "Handling a request "/" is more complex. It is matched by the prefix location "/" only, therefore, it is handled by this location."

🇻🇳 **Dịch**
> "Việc xử lý request `/` **phức tạp hơn**. Nó chỉ khớp prefix location `/`, nên được xử lý bởi location này." (phần tiếp theo của docs bàn tới directive `index`, không thuộc phạm vi bài này)

---

## 6. Những chỗ docs KHÔNG nói

- **Bốn trang docs được trích ở đây không có một con số hiệu năng nào** — không request/giây, không so sánh với Apache. Bài này vì vậy không có benchmark.
- **Docs không giải thích chi tiết cơ chế event bên dưới** (`epoll`, `kqueue`). Chỉ có câu *"employs event-based model and OS-dependent mechanisms"* ở Beginner's Guide. `kqread` trong ví dụ `ps` là vì docs chạy ví dụ trên FreeBSD, không phải mô tả cơ chế.
- **`worker_connections`, `worker_processes auto`, các modifier `=` / `^~` của `location`** — nằm ở trang directive riêng, không có trong bốn trang này, nên bài không trích.
- **Nginx Plus (bản thương mại)** có thêm tính năng (vd reload qua API); bài này chỉ dùng docs của nginx mã nguồn mở trên nginx.org.

---

## Nguồn tham khảo
- nginx — *Beginner's Guide*: <https://nginx.org/en/docs/beginners_guide.html>
- nginx — *Controlling nginx*: <https://nginx.org/en/docs/control.html>
- nginx — *How nginx processes a request*: <https://nginx.org/en/docs/http/request_processing.html>
- nginx — *Server names*: <https://nginx.org/en/docs/http/server_names.html>
- nginx documentation (trang chủ tài liệu): <https://nginx.org/en/docs/>
