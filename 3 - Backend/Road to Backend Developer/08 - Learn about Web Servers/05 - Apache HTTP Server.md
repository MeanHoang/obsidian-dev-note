# 05 — Apache HTTP Server

> **Nguồn chính:** Apache HTTP Server Version 2.4 Documentation (httpd.apache.org) — năm trang:
> - *Getting Started* — https://httpd.apache.org/docs/2.4/getting-started.html
> - *Configuration Files* — https://httpd.apache.org/docs/2.4/configuring.html
> - *Multi-Processing Modules (MPMs)* — https://httpd.apache.org/docs/2.4/mpm.html
> - *Configuration Sections* — https://httpd.apache.org/docs/2.4/sections.html
> - *Name-based Virtual Host Support* — https://httpd.apache.org/docs/2.4/vhosts/name-based.html

**Apache HTTP Server là gì:** web server mã nguồn mở của Apache Software Foundation, tên tiến trình là `httpd`. Nó ra trước nginx và dùng một **kiến trúc module** khác hẳn — kể cả phần "nhận connection" cũng là một module thay được. Đọc [[03 - Nginx - Kiến trúc và xử lý request]] trước rồi đọc bài này sẽ thấy rõ hai triết lý khác nhau.

---

## 1. Mô hình cơ bản: client, server, URL

📖 **Nguyên văn** (httpd docs — *Getting Started*, mục "Clients, Servers, and URLs")
> "Addresses on the Web are expressed with URLs - Uniform Resource Locators - which specify a protocol (e.g. http), a servername (e.g. www.apache.org), a URL-path (e.g. /docs/current/getting-started.html), and possibly a query string (e.g. ?arg=value) used to pass additional arguments to the server.
>
> A client (e.g., a web browser) connects to a server (e.g., your Apache HTTP Server), with the specified protocol, and makes a request for a resource using the URL-path."

🇻🇳 **Dịch**
> "Địa chỉ trên Web được biểu diễn bằng URL — Uniform Resource Locator — chỉ định một protocol (ví dụ `http`), một **servername** (ví dụ `www.apache.org`), một **URL-path** (ví dụ `/docs/current/getting-started.html`), và có thể cả một **query string** (ví dụ `?arg=value`) dùng để truyền thêm tham số cho server.
>
> Một client (ví dụ web browser) kết nối tới một server (ví dụ Apache HTTP Server của bạn) bằng protocol đã chỉ định, và tạo một request cho một resource bằng URL-path."

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "The URL-path may represent any number of things on the server. It may be a file (like getting-started.html) a handler (like server-status) or some kind of program file (like index.php)."

🇻🇳 **Dịch**
> "URL-path có thể đại diện cho **rất nhiều thứ khác nhau** trên server. Nó có thể là một **file** (như `getting-started.html`), một **handler** (như `server-status`), hoặc một dạng file chương trình nào đó (như `index.php`)."

> [!note] "handler" — một khái niệm riêng của Apache
> Đây là điểm khác nginx. Ở Apache, một URL-path có thể được gán cho một **handler** nội bộ của module, và **không cần có file nào tồn tại trên đĩa**. Mục 4.2 dưới đây có ví dụ chính thức: `<Location "/server-status">` + `SetHandler server-status`.

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "The server will send a response consisting of a status code and, optionally, a response body. The status code indicates whether the request was successful, and, if not, what kind of error condition there was. This tells the client what it should do with the response."

🇻🇳 **Dịch**
> "Server sẽ gửi một response gồm một **status code** và, tuỳ trường hợp, một **response body**. Status code cho biết request có thành công hay không, và nếu không thì là loại lỗi nào. Điều này nói cho client biết nó nên làm gì với response."

📖 **Nguyên văn** (httpd docs — *Getting Started*, mục "Hostnames and DNS")
> "More than one hostname may point to the same IP address, and more than one IP address can be attached to the same physical server. Thus, you can run more than one web site on the same physical server, using a feature called virtual hosts."

🇻🇳 **Dịch**
> "Nhiều hostname có thể trỏ tới **cùng một địa chỉ IP**, và nhiều địa chỉ IP có thể gắn vào **cùng một server vật lý**. Vì vậy, bạn có thể chạy nhiều hơn một website trên cùng một server vật lý, dùng tính năng gọi là **virtual hosts**."

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "If you are testing a server that is not Internet-accessible, you can put host names in your hosts file in order to do local resolution. For example, you might want to put a record in your hosts file to map a request for www.example.com to your local system, for testing purposes. This entry would look like:
>
> ```
> 127.0.0.1 www.example.com
> ```
>
> A hosts file will probably be located at /etc/hosts or C:\Windows\system32\drivers\etc\hosts."

🇻🇳 **Dịch**
> "Nếu bạn đang test một server không truy cập được từ Internet, bạn có thể đặt hostname vào **file hosts** để phân giải cục bộ. Ví dụ, để map request cho `www.example.com` về máy của bạn cho mục đích test, mục đó sẽ trông như `127.0.0.1 www.example.com`. File hosts thường nằm ở `/etc/hosts` hoặc `C:\Windows\system32\drivers\etc\hosts`."

Xem thêm [[05 - DNS and how it works]] cho phần phân giải tên.

---

## 2. MPM — module hoá cả việc nhận connection

Đây là đặc trưng kiến trúc lớn nhất của Apache.

📖 **Nguyên văn** (httpd docs — *MPMs*, mục "Introduction")
> "The Apache HTTP Server is designed to be a powerful and flexible web server that can work on a very wide variety of platforms in a range of different environments. Different platforms and different environments often require different features, or may have different ways of implementing the same feature most efficiently. Apache httpd has always accommodated a wide variety of environments through its modular design. This design allows the webmaster to choose which features will be included in the server by selecting which modules to load either at compile-time or at run-time."

🇻🇳 **Dịch**
> "Apache HTTP Server được thiết kế để là một web server mạnh và linh hoạt, có thể hoạt động trên rất nhiều nền tảng trong nhiều môi trường khác nhau. Các nền tảng và môi trường khác nhau thường cần những tính năng khác nhau, hoặc có những cách khác nhau để cài đặt cùng một tính năng một cách hiệu quả nhất. Apache httpd luôn thích ứng với nhiều loại môi trường thông qua **thiết kế module** của nó. Thiết kế này cho phép webmaster chọn những tính năng nào sẽ được đưa vào server, bằng cách chọn module nào được nạp — **ở thời điểm compile hoặc ở thời điểm chạy**."

📖 **Nguyên văn** (httpd docs — *MPMs*)
> "Apache HTTP Server 2.0 extends this modular design to the most basic functions of a web server. The server ships with a selection of Multi-Processing Modules (MPMs) which are responsible for binding to network ports on the machine, accepting requests, and dispatching children to handle the requests."

🇻🇳 **Dịch**
> "Apache HTTP Server 2.0 mở rộng thiết kế module này **xuống tới những chức năng cơ bản nhất** của một web server. Server đi kèm một tập các **Multi-Processing Module (MPM)**, chịu trách nhiệm **bind vào các network port trên máy, nhận request, và điều phối các tiến trình con để xử lý request**."

> [!note] So sánh trực tiếp với nginx
> Ở nginx, mô hình "một master + nhiều worker event-based" là **cố định**, viết trong chính kiến trúc sản phẩm ([[03 - Nginx - Kiến trúc và xử lý request]] mục 1). Ở Apache, mô hình đó là **một module thay được** — bạn chọn prefork / worker / event / winnt. Đây là hai triết lý khác nhau: nginx chọn một mô hình và tối ưu sâu; Apache để mô hình thành lựa chọn cấu hình.

📖 **Nguyên văn** (httpd docs — *MPMs*)
> "Extending the modular design to this level of the server allows two important benefits:
>
> - Apache httpd can more cleanly and efficiently support a wide variety of operating systems. In particular, the Windows version of the server is now much more efficient, since mpm_winnt can use native networking features in place of the POSIX layer used in Apache httpd 1.3. This benefit also extends to other operating systems that implement specialized MPMs.
> - The server can be better customized for the needs of the particular site. For example, sites that need a great deal of scalability can choose to use a threaded MPM like worker or event, while sites requiring stability or compatibility with older software can use a prefork."

🇻🇳 **Dịch**
> "Việc mở rộng thiết kế module xuống mức này của server mang lại hai lợi ích quan trọng:
>
> - Apache httpd có thể hỗ trợ nhiều hệ điều hành một cách **gọn gàng và hiệu quả hơn**. Đặc biệt, bản Windows của server giờ hiệu quả hơn nhiều, vì `mpm_winnt` có thể dùng các tính năng mạng **native** thay cho tầng POSIX mà Apache httpd 1.3 dùng.
> - Server có thể được **tuỳ biến tốt hơn** theo nhu cầu của từng site cụ thể. Ví dụ, những site cần khả năng mở rộng lớn có thể chọn một MPM dùng thread như `worker` hay `event`, trong khi những site cần **sự ổn định hoặc tương thích với phần mềm cũ** có thể dùng `prefork`."

📖 **Nguyên văn** (httpd docs — *MPMs*)
> "At the user level, MPMs appear much like other Apache httpd modules. The main difference is that one and only one MPM must be loaded into the server at any time."

🇻🇳 **Dịch**
> "Ở mức người dùng, MPM trông khá giống các module Apache httpd khác. **Khác biệt chính là tại mỗi thời điểm, phải có một và chỉ một MPM được nạp vào server.**"

### 2.1. MPM mặc định theo hệ điều hành

📖 **Nguyên văn** (httpd docs — *MPMs*, mục "MPM Defaults")
> "The following table lists the default MPMs for various operating systems. This will be the MPM selected if you do not make another choice at compile-time.
>
> | | |
> |---|---|
> | Netware | mpm_netware |
> | OS/2 | mpmt_os2 |
> | Unix | prefork, worker, or event, depending on platform capabilities |
> | Windows | mpm_winnt |
>
> Here, 'Unix' is used to mean Unix-like operating systems, such as Linux, BSD, Solaris, Mac OS X, etc."

🇻🇳 **Dịch**
> "Bảng trên liệt kê MPM mặc định cho các hệ điều hành. Đây sẽ là MPM được chọn nếu bạn không chọn khác ở thời điểm compile. Ở đây 'Unix' được dùng với nghĩa các hệ điều hành kiểu Unix, như Linux, BSD, Solaris, Mac OS X, v.v."

📖 **Nguyên văn** (httpd docs — *MPMs*)
> "In the case of Unix, the decision as to which MPM is installed is based on two questions:
>
> 1. Does the system support threads?
> 2. Does the system support thread-safe polling (Specifically, the kqueue and epoll functions)?
>
> If the answer to both questions is 'yes', the default MPM is event.
>
> If The answer to #1 is 'yes', but the answer to #2 is 'no', the default will be worker.
>
> If the answer to both questions is 'no', then the default MPM will be prefork.
>
> In practical terms, this means that the default will almost always be event, as all modern operating systems support these two features."

🇻🇳 **Dịch**
> "Với Unix, quyết định MPM nào được cài dựa trên hai câu hỏi:
>
> 1. Hệ thống có hỗ trợ **thread** không?
> 2. Hệ thống có hỗ trợ **thread-safe polling** không (cụ thể là các hàm `kqueue` và `epoll`)?
>
> - Cả hai 'có' → MPM mặc định là **event**.
> - Câu 1 'có', câu 2 'không' → mặc định là **worker**.
> - Cả hai 'không' → mặc định là **prefork**.
>
> **Về mặt thực tế, điều này nghĩa là mặc định gần như luôn là `event`, vì mọi hệ điều hành hiện đại đều hỗ trợ hai tính năng này.**"

> [!warning] "Apache là prefork, chậm" là một định kiến đã lỗi thời
> Docs 2.4 nói thẳng: mặc định trên hệ điều hành hiện đại là **event**, không phải prefork. `epoll` (Linux) và `kqueue` (BSD/macOS) chính là những cơ chế mà nginx cũng dùng ([[03 - Nginx - Kiến trúc và xử lý request]] trích *"OS-dependent mechanisms"*). Nếu so sánh Apache với nginx, phải nói rõ **MPM nào**.

💡 **Ví dụ đời sống — prefork vs worker vs event**
Một phòng khám nhận bệnh.
- **prefork** = mỗi bệnh nhân được **một bác sĩ riêng ngồi hẳn một phòng riêng**. Cực kỳ an toàn (một ca hỏng không ảnh hưởng ca khác) nhưng tốn phòng nhất.
- **worker** = mỗi phòng có **nhiều bác sĩ dùng chung phòng** (nhiều thread trong một process). Tiết kiệm phòng hơn, nhưng nếu một bác sĩ làm đổ hoá chất thì cả phòng bị ảnh hưởng.
- **event** = bác sĩ **không ngồi chờ** khi bệnh nhân đi chụp X-quang; họ đi tiếp bệnh nhân khác và quay lại khi có kết quả. Cùng số bác sĩ, phục vụ nhiều người hơn.
- Phần "chờ" kia trong web chính là **connection đang mở nhưng không có dữ liệu** — đúng cái persistent connection ở [[02 - Message Parsing, Connection và Keep-alive]] mục 4.2.

### 2.2. MPM: static hay DSO

📖 **Nguyên văn** (httpd docs — *MPMs*, mục "Building an MPM as a static module")
> "MPMs can be built as static modules on all platforms. A single MPM is chosen at build time and linked into the server. The server must be rebuilt in order to change the MPM.
>
> To override the default MPM choice, use the --with-mpm=NAME option of the configure script. NAME is the name of the desired MPM.
>
> Once the server has been compiled, it is possible to determine which MPM was chosen by using ./httpd -l. This command will list every module that is compiled into the server, including the MPM."

🇻🇳 **Dịch**
> "MPM có thể được build thành **static module** trên mọi nền tảng. Một MPM duy nhất được chọn ở thời điểm build và link vào server. **Phải build lại server để đổi MPM.**
>
> Để ghi đè lựa chọn MPM mặc định, dùng tuỳ chọn `--with-mpm=NAME` của script `configure`.
>
> Sau khi server đã được compile, có thể xác định MPM nào được chọn bằng `./httpd -l`. Lệnh này liệt kê mọi module được compile vào server, kể cả MPM."

📖 **Nguyên văn** (httpd docs — *MPMs*, mục "Building an MPM as a DSO module")
> "On Unix and similar platforms, MPMs can be built as DSO modules and dynamically loaded into the server in the same manner as other DSO modules. Building MPMs as DSO modules allows the MPM to be changed by updating the LoadModule directive for the MPM instead of by rebuilding the server.
>
> ```
> LoadModule mpm_event_module modules/mod_mpm_event.so
> ```
>
> Attempting to LoadModule more than one MPM will result in a startup failure"

🇻🇳 **Dịch**
> "Trên Unix và các nền tảng tương tự, MPM có thể được build thành **DSO module** (Dynamic Shared Object) và nạp động vào server giống như các DSO module khác. Build MPM thành DSO cho phép **đổi MPM bằng cách sửa directive `LoadModule`** thay vì phải build lại server.
>
> Cố `LoadModule` nhiều hơn một MPM sẽ dẫn tới **lỗi khi khởi động**."

---

## 3. File cấu hình và module

📖 **Nguyên văn** (httpd docs — *Getting Started*, mục "Configuration Files and Directives")
> "The Apache HTTP Server is configured via simple text files. These files may be located any of a variety of places, depending on how exactly you installed the server. ... If you installed httpd from source, the default location of the configuration files is /usr/local/apache2/conf. The default configuration file is usually called httpd.conf. This, too, can vary in third-party distributions of the server."

🇻🇳 **Dịch**
> "Apache HTTP Server được cấu hình qua các **file text đơn giản**. Những file này có thể nằm ở nhiều chỗ khác nhau, tuỳ vào bạn đã cài server như thế nào. Nếu bạn cài httpd từ source, vị trí mặc định của file cấu hình là `/usr/local/apache2/conf`. File cấu hình mặc định thường có tên `httpd.conf`. Điều này cũng có thể khác nhau ở các bản phân phối của bên thứ ba."

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "The configuration is frequently broken into multiple smaller files, for ease of management. These files are loaded via the Include directive. The names or locations of these sub-files are not magical, and may vary greatly from one installation to another. Arrange and subdivide these files as makes the most sense to you."

🇻🇳 **Dịch**
> "Cấu hình thường được chia thành nhiều file nhỏ hơn cho dễ quản lý. Những file này được nạp qua directive `Include`. **Tên hay vị trí của các file con này không có gì thần thánh**, và có thể khác nhau rất nhiều giữa các bản cài. Hãy sắp xếp và chia nhỏ các file này theo cách hợp lý nhất với bạn."

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "The server is configured by placing configuration directives in these configuration files. A directive is a keyword followed by one or more arguments that set its value."

🇻🇳 **Dịch**
> "Server được cấu hình bằng cách đặt các **configuration directive** vào những file cấu hình này. Một directive là một **từ khoá đi kèm một hoặc nhiều argument** đặt giá trị cho nó."

### 3.1. Cú pháp

📖 **Nguyên văn** (httpd docs — *Configuration Files*, mục "Syntax of the Configuration Files")
> "httpd configuration files contain one directive per line. The backslash "\" may be used as the last character on a line to indicate that the directive continues onto the next line. To be interpreted as such a continuation, there must be no other characters or white space between the backslash and the end of the line."

🇻🇳 **Dịch**
> "File cấu hình httpd chứa **một directive mỗi dòng**. Dấu backslash `\` có thể dùng làm ký tự cuối dòng để báo rằng directive tiếp tục sang dòng sau. Để được hiểu là nối dòng như vậy, **không được có ký tự hay khoảng trắng nào khác** giữa backslash và cuối dòng."

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "Lines that begin with the hash character "#" are considered comments, and are ignored. Comments may not be included on the same line as a configuration directive, including at the start of a line that has been continued as described in the preceding paragraph."

🇻🇳 **Dịch**
> "Các dòng bắt đầu bằng ký tự `#` được coi là comment và bị bỏ qua. **Comment không được đặt trên cùng dòng với một configuration directive** — kể cả ở đầu một dòng đã được nối tiếp như đoạn trên."

> [!warning] Khác nginx ở đúng điểm này
> nginx cho phép `# comment` ở cuối dòng ([[03 - Nginx - Kiến trúc và xử lý request]] mục 3: *"The rest of a line after the # sign is considered a comment"*). Apache **không**. Viết `ServerName example.com  # site chính` trong httpd.conf là sai cú pháp.

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "White space occurring before a directive is ignored, so you may indent directives for clarity. Blank lines are also ignored. Arguments to directives are separated by whitespace. If an argument contains spaces, you must enclose that argument in quotes."

🇻🇳 **Dịch**
> "Khoảng trắng xuất hiện trước một directive bị bỏ qua, nên bạn có thể thụt lề directive cho rõ ràng. Dòng trống cũng bị bỏ qua. Các argument của directive phân tách bằng khoảng trắng. **Nếu một argument chứa khoảng trắng, bạn phải bọc nó trong dấu nháy.**"

📖 **Nguyên văn** (httpd docs — *Configuration Files*, mục "Quoting and Escaping")
> "Inside a quoted string, only two escape sequences are recognized: \\ produces a literal backslash, and \" (or \' if the string is single-quoted) produces a literal quote character without ending the string. All other backslash sequences are passed through unchanged — for example, \n is the literal two characters \n, not a newline."

🇻🇳 **Dịch**
> "Bên trong một chuỗi có nháy, **chỉ hai escape sequence được nhận diện**: `\\` cho ra một backslash thật, và `\"` (hoặc `\'` nếu chuỗi dùng nháy đơn) cho ra một ký tự nháy thật mà không kết thúc chuỗi. **Mọi dãy backslash khác được truyền qua nguyên vẹn** — ví dụ `\n` là **hai ký tự** `\n` thật, không phải một dòng mới."

### 3.2. Module

📖 **Nguyên văn** (httpd docs — *Configuration Files*, mục "Modules")
> "httpd is a modular server. This implies that only the most basic functionality is included in the core server. Extended features are available through modules which can be loaded into httpd. By default, a base set of modules is included in the server at compile-time. If the server is compiled to use dynamically loaded modules, then modules can be compiled separately and added at any time using the LoadModule directive. Otherwise, httpd must be recompiled to add or remove modules."

🇻🇳 **Dịch**
> "httpd là một server **module hoá**. Điều này hàm ý rằng **chỉ chức năng cơ bản nhất nằm trong core server**. Các tính năng mở rộng có sẵn thông qua module có thể nạp vào httpd. Theo mặc định, một tập module nền tảng được đưa vào server ở thời điểm compile. Nếu server được compile để dùng module nạp động, thì module có thể được compile riêng và thêm vào bất cứ lúc nào bằng directive `LoadModule`. Ngược lại, phải recompile httpd để thêm hay bớt module."

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "Configuration directives may be included conditional on a presence of a particular module by enclosing them in an <IfModule> block. However, <IfModule> blocks are not required, and in some cases may mask the fact that you're missing an important module."

🇻🇳 **Dịch**
> "Các configuration directive có thể được đưa vào **có điều kiện** dựa trên sự hiện diện của một module cụ thể, bằng cách bọc chúng trong một block `<IfModule>`. Tuy nhiên, block `<IfModule>` **không bắt buộc**, và trong một số trường hợp **có thể che mất sự thật là bạn đang thiếu một module quan trọng**."

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "To see which modules are currently compiled into the server, you can use the -l command line option. You can also see what modules are loaded dynamically using the -M command line option."

🇻🇳 **Dịch**
> "Để xem những module nào hiện đang được compile vào server, dùng tuỳ chọn dòng lệnh `-l`. Cũng có thể xem những module nào được nạp động bằng tuỳ chọn `-M`."

---

## 4. Configuration Sections: filesystem vs webspace

Đây là khái niệm trung tâm để đọc được một `httpd.conf`.

📖 **Nguyên văn** (httpd docs — *Configuration Sections*, mục "Filesystem, Webspace, and Boolean Expressions")
> "The most commonly used configuration section containers are the ones that change the configuration of particular places in the filesystem or webspace. First, it is important to understand the difference between the two. The filesystem is the view of your disks as seen by your operating system. For example, in a default install, Apache httpd resides at /usr/local/apache2 in the Unix filesystem or "c:/Program Files/Apache Group/Apache2" in the Windows filesystem. (Note that forward slashes should always be used as the path separator in Apache httpd configuration files, even for Windows.) In contrast, the webspace is the view of your site as delivered by the web server and seen by the client. So the path /dir/ in the webspace corresponds to the path /usr/local/apache2/htdocs/dir/ in the filesystem of a default Apache httpd install on Unix. The webspace need not map directly to the filesystem, since webpages may be generated dynamically from databases or other locations."

🇻🇳 **Dịch**
> "Những container section cấu hình được dùng nhiều nhất là những cái thay đổi cấu hình cho những **chỗ cụ thể trong filesystem hoặc webspace**. Trước tiên cần hiểu sự khác nhau giữa hai thứ đó. **Filesystem** là góc nhìn về các ổ đĩa của bạn như hệ điều hành thấy. Ví dụ, ở bản cài mặc định, Apache httpd nằm ở `/usr/local/apache2` trong filesystem Unix hoặc `c:/Program Files/Apache Group/Apache2` trong filesystem Windows. (Lưu ý rằng **luôn phải dùng dấu gạch chéo xuôi `/` làm ký tự phân tách đường dẫn** trong file cấu hình Apache httpd, kể cả trên Windows.) Ngược lại, **webspace** là góc nhìn về site của bạn như web server giao ra và client thấy. Vậy nên đường dẫn `/dir/` trong webspace tương ứng với đường dẫn `/usr/local/apache2/htdocs/dir/` trong filesystem của một bản cài Apache httpd mặc định trên Unix. **Webspace không nhất thiết map trực tiếp tới filesystem**, vì trang web có thể được sinh động từ database hay các nguồn khác."

### 4.1. Filesystem container: `<Directory>`, `<Files>`

📖 **Nguyên văn** (httpd docs — *Configuration Sections*, mục "Filesystem Containers")
> "The <Directory> and <Files> directives, along with their regex counterparts, apply directives to parts of the filesystem. Directives enclosed in a <Directory> section apply to the named filesystem directory and all subdirectories of that directory (as well as the files in those directories). The same effect can be obtained using .htaccess files. For example, in the following configuration, directory indexes will be enabled for the /var/web/dir1 directory and all subdirectories.
>
> ```
> <Directory "/var/web/dir1">
>     Options +Indexes
> </Directory>
> ```
> "

🇻🇳 **Dịch**
> "Các directive `<Directory>` và `<Files>`, cùng các bản regex tương ứng, áp dụng directive cho **các phần của filesystem**. Directive nằm trong một section `<Directory>` áp dụng cho **thư mục filesystem được nêu tên và mọi thư mục con** của nó (cũng như các file trong những thư mục đó). **Cùng tác dụng đó có thể đạt được bằng file `.htaccess`.**"

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "Directives enclosed in a <Files> section apply to any file with the specified name, regardless of what directory it lies in. So for example, the following configuration directives will, when placed in the main section of the configuration file, deny access to any file named private.html regardless of where it is found.
>
> ```
> <Files "private.html">
>     Require all denied
> </Files>
> ```
> "

🇻🇳 **Dịch**
> "Directive nằm trong section `<Files>` áp dụng cho **bất kỳ file có tên đã chỉ định, bất kể nó nằm ở thư mục nào**. Ví dụ, các directive trên khi đặt ở section chính của file cấu hình sẽ **từ chối truy cập mọi file tên `private.html` bất kể tìm thấy ở đâu**."

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "To address files found in a particular part of the filesystem, the <Files> and <Directory> sections can be combined. For example, the following configuration will deny access to /var/web/dir1/private.html, /var/web/dir1/subdir2/private.html, /var/web/dir1/subdir3/private.html, and any other instance of private.html found under the /var/web/dir1/ directory.
>
> ```
> <Directory "/var/web/dir1">
>     <Files "private.html">
>         Require all denied
>     </Files>
> </Directory>
> ```
> "

🇻🇳 **Dịch**
> "Để nhắm vào các file nằm trong một phần cụ thể của filesystem, có thể **kết hợp** `<Files>` và `<Directory>`. Cấu hình trên sẽ từ chối truy cập `/var/web/dir1/private.html`, `/var/web/dir1/subdir2/private.html`, `/var/web/dir1/subdir3/private.html`, và **mọi instance khác của `private.html` nằm dưới thư mục `/var/web/dir1/`**."

### 4.2. Webspace container: `<Location>`

📖 **Nguyên văn** (httpd docs — *Configuration Sections*, mục "Webspace Containers")
> "The <Location> directive and its regex counterpart, on the other hand, change the configuration for content in the webspace. For example, the following configuration prevents access to any URL-path that begins in /private. In particular, it will apply to requests for http://yoursite.example.com/private, http://yoursite.example.com/private123, and http://yoursite.example.com/private/dir/file.html as well as any other requests starting with the /private string.
>
> ```
> <LocationMatch "^/private">
>     Require all denied
> </LocationMatch>
> ```
> "

🇻🇳 **Dịch**
> "Ngược lại, directive `<Location>` và bản regex của nó thay đổi cấu hình cho **nội dung trong webspace**. Ví dụ, cấu hình trên ngăn truy cập mọi URL-path bắt đầu bằng `/private`. Cụ thể, nó sẽ áp dụng cho request tới `http://yoursite.example.com/private`, `http://yoursite.example.com/private123`, và `http://yoursite.example.com/private/dir/file.html` cũng như mọi request khác bắt đầu bằng chuỗi `/private`."

> [!warning] `^/private` khớp cả `/private123`
> Docs cố tình nêu ví dụ này. Regex `^/private` **không có neo kết thúc**, nên `/private123` cũng khớp. Cùng một lớp bẫy mà docs nginx cảnh báo về `^`/`$` ([[03 - Nginx - Kiến trúc và xử lý request]] mục 4.3).

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "The <Location> directive need not have anything to do with the filesystem. For example, the following example shows how to map a particular URL to an internal handler provided by mod_status. No file called server-status needs to exist on the filesystem.
>
> ```
> # Map a URL to a built-in handler:
> <Location "/server-status">
>     SetHandler server-status
> </Location>
> ```
> "

🇻🇳 **Dịch**
> "Directive `<Location>` **không nhất thiết liên quan gì tới filesystem**. Ví dụ trên cho thấy cách map một URL cụ thể tới một **handler nội bộ** do `mod_status` cung cấp. **Không cần tồn tại file nào tên `server-status` trên filesystem.**"

### 4.3. Thứ tự merge các section — luật quan trọng nhất

📖 **Nguyên văn** (httpd docs — *Configuration Sections*, mục "How the sections are merged")
> "The configuration sections are applied in a very particular order. Since this can have important effects on how configuration directives are interpreted, it is important to understand how this works.
>
> The order of merging is:
>
> 1. <Directory> (except regular expressions) and .htaccess done simultaneously (with .htaccess, if allowed, overriding <Directory>)
> 2. <DirectoryMatch> (and <Directory "~">)
> 3. <Files> and <FilesMatch> done simultaneously
> 4. <Location> and <LocationMatch> done simultaneously
> 5. <If> sections, even when they are enclosed in any of the preceding contexts."

🇻🇳 **Dịch**
> "Các section cấu hình được áp dụng theo **một thứ tự rất cụ thể**. Vì điều này có ảnh hưởng quan trọng tới cách các directive được hiểu, cần hiểu nó hoạt động thế nào.
>
> Thứ tự merge là:
>
> 1. `<Directory>` (trừ regular expression) **và `.htaccess` làm đồng thời** (với `.htaccess`, nếu được cho phép, **ghi đè** `<Directory>`)
> 2. `<DirectoryMatch>` (và `<Directory "~">`)
> 3. `<Files>` và `<FilesMatch>` làm đồng thời
> 4. `<Location>` và `<LocationMatch>` làm đồng thời
> 5. Các section `<If>`, **kể cả khi** chúng được bọc trong bất kỳ context nào ở trên."

> [!note] `<Location>` merge SAU `<Directory>`
> Vì webspace merge sau filesystem, `<Location>` sẽ **ghi đè** `<Directory>` khi cùng áp vào một request. Nhớ thứ tự 5 bước này là đọc được mọi `httpd.conf` phức tạp.

📖 **Nguyên văn** (httpd docs — *Configuration Sections*, "Some important remarks")
> "Apart from <Directory>, within each group the sections are processed in the order they appear in the configuration files. For example, a request for /foo/bar will match <Location "/foo/bar"> and <Location "/foo"> (group 4 in this case): both sections will be evaluated but in the order they appear in the configuration files."

🇻🇳 **Dịch**
> "**Ngoại trừ `<Directory>`**, trong mỗi nhóm thì các section được xử lý **theo thứ tự chúng xuất hiện trong file cấu hình**. Ví dụ, một request cho `/foo/bar` sẽ khớp **cả** `<Location "/foo/bar">` **và** `<Location "/foo">` (nhóm 4 trong trường hợp này): **cả hai section sẽ được đánh giá**, nhưng theo thứ tự chúng xuất hiện trong file cấu hình."

> [!warning] Đây là khác biệt lớn nhất với nginx
> nginx chọn **đúng một** `location` để phục vụ request ([[03 - Nginx - Kiến trúc và xử lý request]] mục 5). Apache **đánh giá và merge tất cả** section khớp. Hai `<Location>` cùng khớp thì cả hai đều có hiệu lực — không có "cái nào thắng". Đây là lý do config Apache có thể khó truy nguyên hơn: hiệu quả cuối cùng là **tổng hợp nhiều tầng**.

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "<Directory> (group 1 above) is processed in the order shortest directory component to longest (regardless of the order in which they appear in the configuration file). For example, <Directory "/var/web/dir"> will be processed before <Directory "/var/web/dir/subdir">."

🇻🇳 **Dịch**
> "`<Directory>` (nhóm 1 ở trên) được xử lý theo thứ tự **từ thành phần thư mục ngắn nhất tới dài nhất**, **bất kể thứ tự chúng xuất hiện trong file cấu hình**. Ví dụ, `<Directory "/var/web/dir">` sẽ được xử lý **trước** `<Directory "/var/web/dir/subdir">`."

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "If multiple <Directory> sections apply to the same directory they are processed in the configuration file order. The same applies when multiple <DirectoryMatch>, <Files>, <FilesMatch>, <Location>, or <LocationMatch> sections match the same resource."

🇻🇳 **Dịch**
> "Nếu nhiều section `<Directory>` áp dụng cho **cùng một thư mục**, chúng được xử lý theo thứ tự trong file cấu hình. Điều tương tự áp dụng khi nhiều section `<DirectoryMatch>`, `<Files>`, `<FilesMatch>`, `<Location>`, hay `<LocationMatch>` khớp **cùng một resource**."

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "Configurations included via the Include directive will be treated as if they were inside the including file at the location of the Include directive."

🇻🇳 **Dịch**
> "Cấu hình được đưa vào qua directive `Include` sẽ được xử lý **như thể chúng nằm ngay trong file gọi Include, tại đúng vị trí của directive `Include`** đó."

📖 **Nguyên văn** (httpd docs — *Configuration Sections*)
> "Sections inside <VirtualHost> sections are applied after the corresponding sections outside the virtual host definition. This allows virtual hosts to override the main server configuration. Note that unlike the other section types, only one <VirtualHost> is selected per request — directives from multiple matching vhosts are never merged."

🇻🇳 **Dịch**
> "Các section bên trong `<VirtualHost>` được áp dụng **sau** các section tương ứng nằm ngoài định nghĩa virtual host. Điều này cho phép virtual host **ghi đè** cấu hình server chính. Lưu ý rằng **khác với các loại section khác, chỉ MỘT `<VirtualHost>` được chọn cho mỗi request — directive từ nhiều vhost khớp KHÔNG BAO GIỜ được merge.**"

> [!tip] Một ngoại lệ đáng nhớ
> Mọi section khác thì merge cộng dồn; riêng `<VirtualHost>` thì **chọn một, loại phần còn lại**. Cơ chế chọn đó là mục 5 dưới đây.

---

## 5. Scope của directive và `.htaccess`

📖 **Nguyên văn** (httpd docs — *Configuration Files*, mục "Scope of Directives")
> "Directives placed in the main configuration files apply to the entire server. If you wish to change the configuration for only a part of the server, you can scope your directives by placing them in <Directory>, <DirectoryMatch>, <Files>, <FilesMatch>, <Location>, and <LocationMatch> sections. These sections limit the application of the directives which they enclose to particular filesystem locations or URLs. They can also be nested, allowing for very fine grained configuration."

🇻🇳 **Dịch**
> "Directive đặt trong các file cấu hình chính áp dụng cho **toàn bộ server**. Nếu muốn đổi cấu hình cho chỉ một phần của server, có thể **giới hạn phạm vi (scope)** directive bằng cách đặt chúng vào các section `<Directory>`, `<DirectoryMatch>`, `<Files>`, `<FilesMatch>`, `<Location>`, `<LocationMatch>`. Những section này giới hạn việc áp dụng các directive mà chúng bao bọc vào những vị trí filesystem hay URL cụ thể. Chúng cũng có thể **lồng nhau**, cho phép cấu hình rất chi tiết."

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "Although most directives can be placed in any of these sections, some directives do not make sense in some contexts. For example, directives controlling process creation can only be placed in the main server context. To find which directives can be placed in which sections, check the Context of the directive."

🇻🇳 **Dịch**
> "Mặc dù phần lớn directive có thể đặt trong bất kỳ section nào trong số này, **một số directive không có nghĩa trong một số context**. Ví dụ, các directive điều khiển việc tạo process **chỉ có thể đặt ở main server context**. Để biết directive nào đặt được ở section nào, xem phần **Context** của directive đó."

📖 **Nguyên văn** (httpd docs — *Configuration Files*, mục ".htaccess Files")
> "httpd allows for decentralized management of configuration via special files placed inside the web tree. The special files are usually called .htaccess, but any name can be specified in the AccessFileName directive. Directives placed in .htaccess files apply to the directory where you place the file, and all sub-directories. The .htaccess files follow the same syntax as the main configuration files. Since .htaccess files are read on every request, changes made in these files take immediate effect."

🇻🇳 **Dịch**
> "httpd cho phép **quản lý cấu hình phi tập trung** qua các file đặc biệt đặt bên trong web tree. Các file đặc biệt này thường có tên `.htaccess`, nhưng có thể chỉ định tên nào cũng được bằng directive `AccessFileName`. Directive đặt trong file `.htaccess` áp dụng cho thư mục bạn đặt file đó **và mọi thư mục con**. File `.htaccess` theo **cùng cú pháp** với file cấu hình chính. **Vì file `.htaccess` được đọc ở MỌI request, thay đổi trong những file này có hiệu lực ngay lập tức.**"

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> ".htaccess files are primarily for people who do not have access to the main server configuration file(s)."

🇻🇳 **Dịch**
> "File `.htaccess` chủ yếu dành cho những người **không có quyền truy cập** (các) file cấu hình chính của server."

📖 **Nguyên văn** (httpd docs — *Configuration Files*)
> "The server administrator further controls what directives may be placed in .htaccess files by configuring the AllowOverride directive in the main configuration files."

🇻🇳 **Dịch**
> "Người quản trị server kiểm soát thêm việc directive nào được phép đặt trong file `.htaccess`, bằng cách cấu hình directive `AllowOverride` trong các file cấu hình chính."

> [!warning] `.htaccess` được đọc ở MỌI request
> Hai câu docs kết hợp lại cho ra một đánh đổi rõ ràng: `.htaccess` **có hiệu lực ngay, không cần reload** — nhưng giá của nó là **đọc file trên mỗi request**. Đây là tính năng Apache có mà nginx **không có** tính năng tương đương; nó là lý do chính hosting chia sẻ (shared hosting) chọn Apache, và cũng là lý do người vận hành site lớn thường tắt nó.

---

## 6. Name-based virtual host

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, mục "Name-based vs. IP-based Virtual Hosts")
> "IP-based virtual hosts use the IP address of the connection to determine the correct virtual host to serve. Therefore you need to have a separate IP address for each host.
>
> With name-based virtual hosting, the server relies on the client to report the hostname as part of the HTTP headers. Using this technique, many different hosts can share the same IP address."

🇻🇳 **Dịch**
> "**IP-based virtual host** dùng địa chỉ IP của connection để xác định virtual host đúng cần phục vụ. Do đó bạn cần **một địa chỉ IP riêng cho mỗi host**.
>
> Với **name-based virtual hosting**, server **dựa vào client báo hostname trong các HTTP header**. Dùng kỹ thuật này, nhiều host khác nhau có thể **dùng chung một địa chỉ IP**."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "Name-based virtual hosting is usually simpler, since you need only configure your DNS server to map each hostname to the correct IP address and then configure the Apache HTTP Server to recognize the different hostnames. Name-based virtual hosting also eases the demand for scarce IP addresses. Therefore you should use name-based virtual hosting unless you are using equipment that explicitly demands IP-based hosting. Historical reasons for IP-based virtual hosting based on client support are no longer applicable to a general-purpose web server."

🇻🇳 **Dịch**
> "Name-based virtual hosting thường **đơn giản hơn**, vì bạn chỉ cần cấu hình DNS server map mỗi hostname tới địa chỉ IP đúng, rồi cấu hình Apache HTTP Server nhận diện các hostname khác nhau. Nó cũng **giảm nhu cầu về địa chỉ IP đang khan hiếm**. Vì vậy **bạn nên dùng name-based virtual hosting trừ khi đang dùng thiết bị đòi hỏi rõ ràng phải IP-based hosting**. Những lý do lịch sử để chọn IP-based (do khả năng hỗ trợ của client) **không còn áp dụng** cho một web server đa dụng ngày nay."

### 6.1. Thuật toán chọn vhost: IP trước, tên sau

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "Name-based virtual hosting builds off of the IP-based virtual host selection algorithm, meaning that searches for the proper server name occur only between virtual hosts that have the best IP-based address."

🇻🇳 **Dịch**
> "Name-based virtual hosting **được xây trên nền thuật toán chọn IP-based virtual host**, nghĩa là việc tìm server name đúng **chỉ diễn ra giữa những virtual host có địa chỉ IP khớp tốt nhất**."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, mục "How the server selects the proper name-based virtual host")
> "It is important to recognize that the first step in name-based virtual host resolution is IP-based resolution. Name-based virtual host resolution only chooses the most appropriate name-based virtual host after narrowing down the candidates to the best IP-based match. Using a wildcard (*) for the IP address in all of the VirtualHost directives makes this IP-based mapping irrelevant.
>
> When a request arrives, the server will find the best (most specific) matching <VirtualHost> argument based on the IP address and port used by the request. If there is more than one virtual host containing this best-match address and port combination, Apache will further compare the ServerName and ServerAlias directives to the server name present in the request."

🇻🇳 **Dịch**
> "Cần nhận ra rằng **bước đầu tiên** trong việc phân giải name-based virtual host là **phân giải theo IP**. Việc phân giải name-based chỉ chọn virtual host phù hợp nhất **sau khi** đã thu hẹp các ứng viên xuống nhóm khớp IP tốt nhất. Dùng wildcard `*` cho địa chỉ IP ở tất cả directive `VirtualHost` làm cho việc map theo IP này **trở nên không còn ý nghĩa**.
>
> Khi một request tới, server sẽ tìm argument `<VirtualHost>` khớp **tốt nhất (cụ thể nhất)** dựa trên **địa chỉ IP và port** mà request dùng. Nếu có nhiều hơn một virtual host chứa tổ hợp địa chỉ + port khớp tốt nhất đó, Apache sẽ **so tiếp** các directive `ServerName` và `ServerAlias` với server name có trong request."

> [!note] Cùng thuật toán với nginx, khác tên directive
> nginx: kiểm IP+port qua `listen` trước, rồi `Host` qua `server_name`. Apache: kiểm IP+port qua argument của `<VirtualHost>`, rồi so `ServerName`/`ServerAlias`. **Cùng một thuật toán hai bước**, vì cả hai đều đang cài đặt RFC 9110 §7.2 ([[01 - Web Server là gì]]).

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, "The default name-based vhost for an IP and port combination")
> "If no matching ServerName or ServerAlias is found in the set of virtual hosts containing the most specific matching IP address and port combination, then the first listed virtual host that matches that will be used."

🇻🇳 **Dịch**
> "Nếu không tìm thấy `ServerName` hay `ServerAlias` nào khớp trong tập virtual host chứa tổ hợp địa chỉ IP + port khớp cụ thể nhất, thì **virtual host được liệt kê đầu tiên** khớp tổ hợp đó sẽ được dùng."

> [!warning] "Cái đầu tiên là default" — giống nginx, và cùng một rủi ro
> nginx cũng vậy ([[03 - Nginx - Kiến trúc và xử lý request]] mục 4). Hệ quả: một `Host` lạ, hoặc không có `Host`, sẽ rơi vào vhost đầu tiên trong file. Nếu vhost đầu tiên tình cờ là trang admin nội bộ thì đó là một lỗ hổng cấu hình.

### 6.2. `ServerName` — nên luôn ghi rõ

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "If you omit the ServerName directive from any name-based virtual host, the server will default to a fully qualified domain name (FQDN) derived from the system hostname. This implicitly set server name can lead to counter-intuitive virtual host matching and is discouraged."

🇻🇳 **Dịch**
> "Nếu bạn **bỏ** directive `ServerName` ở một name-based virtual host nào, server sẽ mặc định lấy một **fully qualified domain name (FQDN) suy ra từ hostname của hệ thống**. Server name được đặt ngầm như vậy có thể dẫn tới việc **khớp virtual host phản trực giác**, và **không được khuyến khích**."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, "ServerName inheritance")
> "It is best to always explicitly list a ServerName in every name-based virtual host.
>
> If a VirtualHost doesn't specify a ServerName, a server name will be inherited from the base server configuration. If no server name was specified globally, one is detected at startup through reverse DNS resolution of the first listening address. In either case, this inherited server name will influence name-based virtual host resolution, so it is best to always explicitly list a ServerName in every name-based virtual host."

🇻🇳 **Dịch**
> "Tốt nhất là **luôn ghi rõ `ServerName` trong mọi name-based virtual host**.
>
> Nếu một `VirtualHost` không chỉ định `ServerName`, một server name sẽ được **kế thừa từ cấu hình base server**. Nếu không có server name nào được chỉ định ở mức toàn cục, thì một cái sẽ được **phát hiện lúc khởi động thông qua phân giải reverse DNS của địa chỉ listen đầu tiên**. Trong cả hai trường hợp, server name kế thừa này **sẽ ảnh hưởng tới việc phân giải name-based virtual host**."

### 6.3. Ví dụ cấu hình và `ServerAlias`

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, mục "Using Name-based Virtual Hosts")
> "The first step is to create a <VirtualHost> block for each different host that you would like to serve. Inside each <VirtualHost> block, you will need at minimum a ServerName directive to designate which host is served and a DocumentRoot directive to show where in the filesystem the content for that host lives."

🇻🇳 **Dịch**
> "Bước đầu tiên là tạo một block `<VirtualHost>` cho mỗi host khác nhau bạn muốn phục vụ. Bên trong mỗi block `<VirtualHost>`, **tối thiểu** bạn cần một directive `ServerName` để chỉ định host nào được phục vụ, và một directive `DocumentRoot` để chỉ ra nội dung của host đó nằm ở đâu trong filesystem."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "For example, suppose that you are serving the domain www.example.com and you wish to add the virtual host other.example.com, which points at the same IP address. Then you simply add the following to httpd.conf:
>
> ```
> <VirtualHost *:80>
>     # This first-listed virtual host is also the default for *:80
>     ServerName www.example.com
>     ServerAlias example.com
>     DocumentRoot "/www/domain"
> </VirtualHost>
>
> <VirtualHost *:80>
>     ServerName other.example.com
>     DocumentRoot "/www/otherdomain"
> </VirtualHost>
> ```
> "

🇻🇳 **Dịch**
> "Ví dụ, giả sử bạn đang phục vụ domain `www.example.com` và muốn thêm virtual host `other.example.com` trỏ tới cùng địa chỉ IP, thì chỉ cần thêm đoạn trên vào `httpd.conf`." — Chú ý chính comment trong docs: *"This first-listed virtual host is also the default for *:80"* (🇻🇳 "virtual host được liệt kê đầu tiên này cũng là default cho `*:80`").

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "Many servers want to be accessible by more than one name. This is possible with the ServerAlias directive, placed inside the <VirtualHost> section. ...
>
> ```
> ServerAlias example.com *.example.com
> ```
>
> then requests for all hosts in the example.com domain will be served by the www.example.com virtual host. The wildcard characters * and ? can be used to match names. Of course, you can't just make up names and place them in ServerName or ServerAlias. You must first have your DNS server properly configured to map those names to an IP address associated with your server."

🇻🇳 **Dịch**
> "Nhiều server muốn truy cập được bằng nhiều hơn một tên. Điều này làm được bằng directive `ServerAlias` đặt trong section `<VirtualHost>`. Với ví dụ trên, request cho mọi host trong domain `example.com` sẽ được phục vụ bởi virtual host `www.example.com`. Có thể dùng các ký tự wildcard `*` và `?` để khớp tên. Tất nhiên, **bạn không thể tự nghĩ ra tên rồi đặt vào `ServerName` hay `ServerAlias`** — trước hết phải cấu hình DNS server đúng để map những tên đó tới một địa chỉ IP gắn với server của bạn."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "Name-based virtual hosts for the best-matching set of <VirtualHost>s are processed in the order they appear in the configuration. The first matching ServerName or ServerAlias is used, with no different precedence for wildcards (nor for ServerName vs. ServerAlias)."

🇻🇳 **Dịch**
> "Các name-based virtual host thuộc tập `<VirtualHost>` khớp tốt nhất được xử lý **theo thứ tự chúng xuất hiện trong cấu hình**. `ServerName` hoặc `ServerAlias` **khớp đầu tiên** được dùng, **không có ưu tiên khác nhau cho wildcard** (cũng không có ưu tiên giữa `ServerName` và `ServerAlias`)."

> [!warning] Khác nginx một cách quan trọng
> nginx có **thứ tự ưu tiên rõ ràng**: exact name → wildcard đầu → wildcard cuối → regex ([[03 - Nginx - Kiến trúc và xử lý request]] mục 4.3). Apache thì **không**: *"no different precedence for wildcards"* — cái nào viết trước trong file thì thắng. Nghĩa là ở Apache, **thứ tự trong file quyết định**, và một `ServerAlias *.example.com` đặt sớm có thể chặn mất một `ServerName sub.example.com` đặt muộn hơn.

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*, "Main host goes away")
> "Any request that doesn't match an existing <VirtualHost> is handled by the global server configuration, regardless of the hostname or ServerName.
>
> When you add a name-based virtual host to an existing server, and the virtual host arguments match preexisting IP and port combinations, requests will now be handled by an explicit virtual host. In this case, it's usually wise to create a default virtual host with a ServerName matching that of the base server."

🇻🇳 **Dịch**
> "Mọi request **không khớp** một `<VirtualHost>` nào đang tồn tại thì được xử lý bởi **cấu hình server toàn cục**, bất kể hostname hay `ServerName`.
>
> Khi bạn thêm một name-based virtual host vào một server đang chạy, và argument của virtual host đó khớp với tổ hợp IP + port đã có, thì các request **từ nay sẽ được xử lý bởi một virtual host tường minh**. Trong trường hợp này, thường nên tạo một **default virtual host** với `ServerName` khớp với server nền."

📖 **Nguyên văn** (httpd docs — *Name-based Virtual Host Support*)
> "Configuration directives set in the main server context (outside any <VirtualHost> container) will be used only if they are not overridden by the virtual host settings."

🇻🇳 **Dịch**
> "Các configuration directive đặt ở main server context (ngoài mọi container `<VirtualHost>`) **chỉ được dùng nếu chúng không bị thiết lập của virtual host ghi đè**."

---

## 7. Nội dung tĩnh, động và log

📖 **Nguyên văn** (httpd docs — *Getting Started*, mục "Web Site Content")
> "Static content is things like HTML files, image files, CSS files, and other files that reside in the filesystem. The DocumentRoot directive specifies where in your filesystem you should place these files. This directive is either set globally, or per virtual host."

🇻🇳 **Dịch**
> "**Nội dung tĩnh** là những thứ như file HTML, file ảnh, file CSS, và các file khác nằm trong filesystem. Directive `DocumentRoot` chỉ định bạn nên đặt các file này ở đâu trong filesystem. Directive này được đặt **hoặc ở mức toàn cục, hoặc theo từng virtual host**."

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "Typically, a document called index.html will be served when a directory is requested without a file name being specified. For example, if DocumentRoot is set to /var/www/html and a request is made for http://www.example.com/work/, the file /var/www/html/work/index.html will be served to the client."

🇻🇳 **Dịch**
> "Thông thường, một document tên `index.html` sẽ được phục vụ khi một thư mục được yêu cầu mà không chỉ định tên file. Ví dụ, nếu `DocumentRoot` đặt là `/var/www/html` và có request tới `http://www.example.com/work/`, thì file `/var/www/html/work/index.html` sẽ được phục vụ cho client."

> [!note] `DocumentRoot` của Apache = `root` của nginx
> Cùng một cơ chế cộng URL-path vào một gốc filesystem ([[04 - Nginx - Serving, Proxy và Load Balancing]] mục 1). Khác tên directive, giống bản chất.

📖 **Nguyên văn** (httpd docs — *Getting Started*)
> "Dynamic content is anything that is generated at request time, and may change from one request to another. There are numerous ways that dynamic content may be generated. Various handlers are available to generate content. CGI programs may be written to generate content for your site.
>
> Third-party modules like mod_php may be used to write code that does a variety of things."

🇻🇳 **Dịch**
> "**Nội dung động** là bất cứ thứ gì được sinh ra **ở thời điểm request**, và có thể khác nhau giữa các request. Có rất nhiều cách sinh nội dung động. Nhiều **handler** khác nhau có sẵn để sinh nội dung. Có thể viết **chương trình CGI** để sinh nội dung cho site của bạn. Các module của bên thứ ba như `mod_php` có thể dùng để viết code làm nhiều việc khác nhau."

> [!tip] Đây là khác biệt kiến trúc thật giữa Apache và nginx
> Apache có thể **nhúng interpreter vào chính tiến trình web server** (`mod_php`). nginx **không** — nó luôn đẩy sang một process khác qua FastCGI (`fastcgi_pass`, xem [[04 - Nginx - Serving, Proxy và Load Balancing]] mục 3). Hai cách khác nhau về đánh đổi: nhúng thì ít một chặng mạng, tách thì cô lập tốt hơn và scale riêng được.

📖 **Nguyên văn** (httpd docs — *Getting Started*, mục "Log Files and Troubleshooting")
> "As an Apache HTTP Server administrator, your most valuable assets are the log files, and, in particular, the error log. Troubleshooting any problem without the error log is like driving with your eyes closed.
>
> The location of the error log is defined by the ErrorLog directive, which may be set globally, or per virtual host. Entries in the error log tell you what went wrong, and when. They often also tell you how to fix it. Each error log message contains an error code, which you can search for online for even more detailed descriptions of how to address the problem. You can also configure your error log to contain a log ID which you can then correlate to an access log entry, so that you can determine what request caused the error condition."

🇻🇳 **Dịch**
> "Với vai trò người quản trị Apache HTTP Server, **tài sản giá trị nhất của bạn là các file log, đặc biệt là error log. Xử lý bất kỳ vấn đề nào mà không có error log thì như lái xe nhắm mắt.**
>
> Vị trí của error log được định nghĩa bởi directive `ErrorLog`, có thể đặt ở mức toàn cục hoặc theo từng virtual host. Các mục trong error log cho bạn biết **cái gì đã sai và sai khi nào**. Chúng thường còn cho biết cách sửa. Mỗi thông điệp error log chứa một **error code** mà bạn có thể tra trên mạng để có mô tả chi tiết hơn. Bạn cũng có thể cấu hình error log chứa một **log ID** để **đối chiếu với một mục trong access log**, nhờ đó xác định được request nào đã gây ra tình trạng lỗi."

---

## 8. Những chỗ docs KHÔNG nói

- **Năm trang docs được trích ở đây không có con số hiệu năng nào** — không request/giây, không so sánh với nginx. Bài này vì vậy không có benchmark.
- **Trang MPM không nói prefork/worker/event khác nhau cụ thể thế nào về thread và process** — nó chỉ nêu tên và nói `worker`/`event` là "threaded MPM". Chi tiết nằm ở trang riêng của từng MPM (`mod_mpm_prefork`, `mod_mpm_worker`, `mod_mpm_event`), nên phần giải thích chi tiết ba mô hình không được trích ở đây.
- **Không có hướng dẫn `mod_proxy` / reverse proxy** trong năm trang này (có trang riêng `mod_proxy`). Nên bài này **không** so sánh khả năng proxy của Apache với `proxy_pass` của nginx.
- **Không có cấu hình TLS/HTTPS** (trang riêng SSL/TLS).
- **Không có hướng dẫn start/stop/reload** — trang *Getting Started* chỉ trỏ sang trang "Start" khác. Do đó bài này **không** đối chiếu cơ chế graceful reload của Apache với `nginx -s reload` ở [[03 - Nginx - Kiến trúc và xử lý request]].
- **Con số phiên bản Apache mới nhất** không có trong các trang này (chúng là docs "Version 2.4"), nên bài không ghi phiên bản cụ thể.

---

## Nguồn tham khảo
- Apache HTTP Server — *Getting Started*: <https://httpd.apache.org/docs/2.4/getting-started.html>
- Apache HTTP Server — *Configuration Files*: <https://httpd.apache.org/docs/2.4/configuring.html>
- Apache HTTP Server — *Multi-Processing Modules (MPMs)*: <https://httpd.apache.org/docs/2.4/mpm.html>
- Apache HTTP Server — *Configuration Sections*: <https://httpd.apache.org/docs/2.4/sections.html>
- Apache HTTP Server — *Name-based Virtual Host Support*: <https://httpd.apache.org/docs/2.4/vhosts/name-based.html>
- Apache HTTP Server 2.4 Documentation: <https://httpd.apache.org/docs/2.4/>
