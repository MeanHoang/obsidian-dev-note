# 06 — Caddy

> **Nguồn chính:** Caddy Documentation (caddyserver.com/docs) — ba trang:
> - *Welcome to Caddy* (trang chủ docs) — https://caddyserver.com/docs/
> - *Caddyfile Concepts* — https://caddyserver.com/docs/caddyfile/concepts
> - *Automatic HTTPS* — https://caddyserver.com/docs/automatic-https

**Caddy là gì:** một web server viết bằng Go, nổi bật vì **tự động lấy và gia hạn certificate HTTPS** mà không cần cấu hình gì thêm. Đọc [[03 - Nginx - Kiến trúc và xử lý request]] và [[05 - Apache HTTP Server]] trước rồi đọc bài này để thấy triết lý thứ ba: **mặc định an toàn, cấu hình tối thiểu**.

---

## 1. Caddy tự định vị mình là gì

📖 **Nguyên văn** (Caddy docs — *Welcome to Caddy*)
> "Caddy is a powerful, extensible platform to serve your sites, services, and apps, written in Go. If you're new to Caddy, the way you serve the Web is about to change."

🇻🇳 **Dịch**
> "Caddy là một **nền tảng** mạnh và có khả năng mở rộng để phục vụ các site, service và app của bạn, **viết bằng Go**. Nếu bạn mới dùng Caddy, cách bạn phục vụ Web sắp thay đổi."

📖 **Nguyên văn** (Caddy docs — *Welcome to Caddy*, mục "Introduction")
> "Most people use Caddy as a web server or proxy, but at its core, Caddy is a server of servers. With the requisite modules, it can take on the role of any long-running process!"

🇻🇳 **Dịch**
> "Phần lớn mọi người dùng Caddy như một web server hoặc proxy, nhưng ở cốt lõi, Caddy là **một server của các server** (server of servers). Với các module cần thiết, nó có thể đảm nhận vai trò của **bất kỳ tiến trình chạy dài nào**!"

📖 **Nguyên văn** (Caddy docs — *Welcome to Caddy*)
> "Configuration is both dynamic and exportable with Caddy's API. Although no config files required, you can still use them; most people's favorite way of configuring Caddy is using the Caddyfile. The format of the config document takes many forms with config adapters, but Caddy's native config language is JSON.
>
> Caddy compiles for all major platforms and has no runtime dependencies."

🇻🇳 **Dịch**
> "Cấu hình vừa **động** vừa **xuất ra được** thông qua API của Caddy. Mặc dù **không cần file cấu hình nào**, bạn vẫn có thể dùng chúng; cách cấu hình Caddy mà phần lớn mọi người thích nhất là dùng **Caddyfile**. Định dạng của document cấu hình có nhiều dạng nhờ các **config adapter**, nhưng **ngôn ngữ cấu hình gốc của Caddy là JSON**.
>
> Caddy compile được cho mọi nền tảng lớn và **không có runtime dependency** nào."

> [!note] Ba điều khác biệt về kiến trúc, nêu ngay ở đoạn mở đầu
> 1. **Ngôn ngữ cấu hình gốc là JSON**, còn Caddyfile chỉ là một "config adapter" dịch sang JSON. nginx và Apache đều không có tầng này — file cấu hình của chúng *là* cấu hình.
> 2. **Cấu hình được qua API, không bắt buộc có file.** Nhớ lại [[04 - Nginx - Serving, Proxy và Load Balancing]] mục 4.8: đổi server group khi đang chạy là tính năng **có phí** của NGINX Plus. Caddy đặt nó ở mặc định.
> 3. **Không có runtime dependency** — hệ quả của việc build bằng Go thành một binary tĩnh.

📖 **Nguyên văn** (Caddy docs — *Welcome to Caddy*)
> "We recommend sticking to these official resources to install, configure, and run Caddy, rather than running commands or copying config snippets from random blogs and Q&A boards. You will find that our material is generally more accurate and up-to-date. We also encourage you to craft your own configurations to ensure that you understand how your server works so you'll be more able to fix problems if they arise later on."

🇻🇳 **Dịch**
> "Chúng tôi khuyên bạn **giữ đúng các nguồn chính thức này** để cài, cấu hình và chạy Caddy, hơn là chạy các lệnh hay copy đoạn cấu hình từ những blog và diễn đàn hỏi đáp ngẫu nhiên. Bạn sẽ thấy tài liệu của chúng tôi thường chính xác và cập nhật hơn. Chúng tôi cũng khuyến khích bạn **tự tay soạn cấu hình của mình** để bảo đảm bạn hiểu server của mình hoạt động thế nào, nhờ đó sẽ có khả năng sửa lỗi hơn nếu sau này phát sinh vấn đề."

---

## 2. Automatic HTTPS — đặc trưng lớn nhất của Caddy

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Overview")
> "By default, Caddy serves all sites over HTTPS.
>
> Caddy serves IP addresses and local/internal hostnames over HTTPS using self-signed certificates that are automatically trusted locally (if permitted).
>
> Examples: localhost, 127.0.0.1
>
> Caddy serves public DNS names over HTTPS using certificates from a public ACME CA such as Let's Encrypt or ZeroSSL.
>
> Examples: example.com, sub.example.com, *.example.com
>
> Caddy keeps all managed certificates renewed and redirects HTTP (default port 80) to HTTPS (default port 443) automatically."

🇻🇳 **Dịch**
> "**Theo mặc định, Caddy phục vụ mọi site qua HTTPS.**
>
> Caddy phục vụ các **địa chỉ IP và hostname cục bộ/nội bộ** qua HTTPS bằng certificate **tự ký** được tự động tin cậy ở máy cục bộ (nếu được phép). Ví dụ: `localhost`, `127.0.0.1`.
>
> Caddy phục vụ các **tên DNS công khai** qua HTTPS bằng certificate từ một **public ACME CA** như Let's Encrypt hay ZeroSSL. Ví dụ: `example.com`, `sub.example.com`, `*.example.com`.
>
> Caddy **giữ mọi certificate được quản lý luôn được gia hạn**, và **tự động redirect HTTP (port 80 mặc định) sang HTTPS (port 443 mặc định)**."

> [!note] Đây là điểm mà ba web server khác nhau rõ nhất
> Với nginx và Apache, HTTPS là việc bạn phải **chủ động cấu hình** (xin cert, trỏ đường dẫn cert, viết redirect 80→443, đặt cron gia hạn). Với Caddy, cả bốn việc đó là **hành vi mặc định**. Đổi lại, bạn nhận một phụ thuộc mới: server phải **gọi ra ngoài Internet** để lấy cert.

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, điều kiện cho domain công khai)
> "If your domain's A/AAAA records point to your server,
>
> - ports 80 and 443 are open externally,
> - Caddy can bind to those ports (or those ports are forwarded to Caddy),
> - your data directory is writeable and persistent,
> - and your domain name appears somewhere relevant in the config,
>
> then sites will be served over HTTPS automatically. You won't have to do anything else about it. It just works!"

🇻🇳 **Dịch**
> "Nếu bản ghi A/AAAA của domain trỏ tới server của bạn, **và**:
>
> - port 80 và 443 mở ra bên ngoài,
> - Caddy bind được vào những port đó (hoặc những port đó được forward tới Caddy),
> - **data directory của bạn ghi được và bền (persistent)**,
> - và tên domain của bạn xuất hiện ở đâu đó phù hợp trong cấu hình,
>
> thì các site sẽ được phục vụ qua HTTPS **một cách tự động**. Bạn sẽ không phải làm gì thêm. Nó chỉ đơn giản là chạy!"

> [!warning] "data directory ghi được và bền" là điều kiện dễ bị bỏ sót nhất
> Đây là cái bẫy thực tế khi chạy Caddy trong container: nếu data directory nằm trong layer ephemeral, **mỗi lần container khởi động lại là Caddy xin cert mới**. Làm vài lần là chạm rate limit của Let's Encrypt — đúng cái docs cảnh báo ở mục 2.4 dưới đây.

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "These are common requirements for any basic production website, not just Caddy. The main difference is to set your DNS records properly before running Caddy so it can provision certificates."

🇻🇳 **Dịch**
> "Đây là những yêu cầu thông thường cho bất kỳ website production cơ bản nào, không chỉ riêng Caddy. Khác biệt chính là **phải đặt bản ghi DNS đúng TRƯỚC KHI chạy Caddy**, để nó có thể cấp certificate."

> [!tip] Thứ tự bị đảo so với nginx
> Với nginx, bạn có thể dựng server trước rồi trỏ DNS sau. Với Caddy, **DNS phải đúng trước**, vì Caddy cần chứng minh quyền sở hữu domain với CA ngay lúc khởi động. Xem [[05 - DNS and how it works]].

### 2.1. Khi nào automatic HTTPS được kích hoạt

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Activation")
> "Caddy implicitly activates automatic HTTPS when it knows a domain name (i.e. hostname) or IP address it is serving. There are various ways to tell Caddy your domain/IP, depending on how you run or configure Caddy:
>
> - A site address in the Caddyfile
> - A host matcher at the top-level in the JSON routes
> - Command line flags like --domain or --from
> - The automate certificate loader"

🇻🇳 **Dịch**
> "Caddy **kích hoạt ngầm** automatic HTTPS khi nó **biết một tên domain (hostname) hay địa chỉ IP** mà nó đang phục vụ. Có nhiều cách để nói cho Caddy biết domain/IP của bạn, tuỳ vào cách bạn chạy hay cấu hình Caddy:
>
> - Một **site address** trong Caddyfile
> - Một **host matcher** ở mức top-level trong các route JSON
> - Các cờ dòng lệnh như `--domain` hoặc `--from`
> - Certificate loader `automate`"

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "Any of the following will prevent automatic HTTPS from being activated, either in whole or in part:
>
> - Explicitly disabling it via JSON or via Caddyfile
> - Not providing any hostnames or IP addresses in the config
> - Listening exclusively on the HTTP port
> - Prefixing the site address with http:// in the Caddyfile
> - Manually loading certificates (unless ignore_loaded_certificates is set)"

🇻🇳 **Dịch**
> "Bất kỳ điều nào sau đây sẽ **ngăn** automatic HTTPS được kích hoạt, toàn bộ hoặc một phần:
>
> - Tắt nó tường minh qua JSON hay qua Caddyfile
> - **Không cung cấp hostname hay địa chỉ IP nào** trong cấu hình
> - Chỉ lắng nghe **duy nhất** trên HTTP port
> - **Thêm tiền tố `http://`** vào site address trong Caddyfile
> - Nạp certificate thủ công (trừ khi `ignore_loaded_certificates` được đặt)"

### 2.2. Automatic HTTPS làm gì

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Effects")
> "When automatic HTTPS is activated, the following occurs:
>
> - Certificates are obtained and renewed for all qualifying domain names
> - HTTP is redirected to HTTPS (this uses HTTP port 80)
>
> Automatic HTTPS never overrides explicit configuration, it only augments it.
>
> If you already have a server listening on the HTTP port, the HTTP->HTTPS redirect routes will be inserted after your routes with a host matcher, but before a user-defined catch-all route."

🇻🇳 **Dịch**
> "Khi automatic HTTPS được kích hoạt, những điều sau xảy ra:
>
> - Certificate được **lấy về và gia hạn** cho mọi tên domain đủ điều kiện
> - **HTTP được redirect sang HTTPS** (việc này dùng HTTP port 80)
>
> **Automatic HTTPS không bao giờ ghi đè cấu hình tường minh, nó chỉ bổ sung thêm.**
>
> Nếu bạn đã có một server lắng nghe trên HTTP port, các route redirect HTTP→HTTPS sẽ được **chèn vào sau** các route có host matcher của bạn, nhưng **trước** một route catch-all do người dùng định nghĩa."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "You can customize or disable automatic HTTPS if necessary; for example, you can skip certain domain names or disable redirects (for Caddyfile, do this with global options)."

🇻🇳 **Dịch**
> "Bạn có thể tuỳ biến hoặc tắt automatic HTTPS nếu cần; ví dụ bạn có thể **bỏ qua một số tên domain nhất định** hoặc **tắt redirect** (với Caddyfile, làm điều này bằng global options)."

### 2.3. Điều kiện của hostname

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Hostname requirements")
> "All hostnames (domain names) qualify for fully-managed certificates if they:
>
> - are non-empty
> - consist only of alphanumerics, hyphens, dots, and wildcard (*)
> - do not start or end with a dot (RFC 1034)
>
> In addition, hostnames qualify for publicly-trusted certificates if they:
>
> - are not localhost (including .localhost, .local, .internal and .home.arpa TLDs)
> - are not an IP address
> - have only a single wildcard * as the left-most label"

🇻🇳 **Dịch**
> "Mọi hostname (tên domain) **đủ điều kiện để được quản lý certificate hoàn toàn** nếu chúng:
>
> - không rỗng
> - chỉ gồm chữ-số, dấu gạch ngang, dấu chấm, và wildcard (`*`)
> - không bắt đầu hay kết thúc bằng dấu chấm (RFC 1034)
>
> Ngoài ra, hostname **đủ điều kiện nhận certificate được tin cậy công khai** nếu chúng:
>
> - **không phải** `localhost` (bao gồm các TLD `.localhost`, `.local`, `.internal` và `.home.arpa`)
> - **không phải** một địa chỉ IP
> - chỉ có **một wildcard `*` duy nhất làm label ngoài cùng bên trái**"

> [!note] Hai mức điều kiện, đừng nhầm
> Mức 1 = được Caddy quản lý cert (kể cả cert tự ký). Mức 2 = được cert **công khai tin cậy** từ CA thật. `localhost` thoả mức 1 nhưng không thoả mức 2 → Caddy dùng CA nội bộ của chính nó, đó là mục 2.4 ngay dưới.

### 2.4. Local HTTPS — Caddy tự làm CA riêng

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Local HTTPS")
> "Caddy uses HTTPS automatically for all sites with a host (domain, IP, or hostname) specified, including internal and local hosts. Some hosts are either not public (e.g. 127.0.0.1, localhost) or do not generally qualify for publicly-trusted certificates (e.g. IP addresses -- you can get certificates for them, but only from some CAs). These are still served over HTTPS unless disabled.
>
> To serve non-public sites over HTTPS, Caddy generates its own certificate authority (CA) and uses it to sign certificates. The trust chain consists of a root and intermediate certificate. Leaf certificates are signed by the intermediate. They are stored in Caddy's data directory at pki/authorities/local."

🇻🇳 **Dịch**
> "Caddy dùng HTTPS tự động cho **mọi** site có host (domain, IP, hay hostname) được chỉ định, **kể cả các host nội bộ và cục bộ**. Một số host hoặc không công khai (vd `127.0.0.1`, `localhost`), hoặc thường không đủ điều kiện nhận certificate tin cậy công khai (vd địa chỉ IP — bạn có thể lấy cert cho chúng, nhưng chỉ từ một số CA). Những host này **vẫn được phục vụ qua HTTPS** trừ khi bị tắt.
>
> Để phục vụ các site không công khai qua HTTPS, **Caddy tự sinh ra certificate authority (CA) của riêng nó** và dùng CA đó để ký certificate. Chuỗi tin cậy gồm một **root** và một **intermediate** certificate. Các **leaf certificate** (cho từng site) được ký bởi intermediate. Chúng được lưu trong data directory của Caddy tại `pki/authorities/local`."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "Local HTTPS does not use ACME nor does it perform any DNS validation. It works only on the local machine and is trusted only where the CA's root certificate is installed."

🇻🇳 **Dịch**
> "Local HTTPS **không dùng ACME** và cũng **không thực hiện xác thực DNS** nào. Nó chỉ hoạt động trên máy cục bộ và **chỉ được tin cậy ở nơi root certificate của CA đó đã được cài**."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "CA Root")
> "The root's private key is uniquely generated using a cryptographically-secure pseudorandom source and persisted to storage with limited permissions. It is loaded into memory only to perform signing tasks, after which it leaves scope to be garbage-collected.
>
> Although Caddy can be configured to sign with the root directly (to support non-compliant clients), this is disabled by default, and the root key is only used to sign intermediates."

🇻🇳 **Dịch**
> "Private key của root được sinh **duy nhất** bằng một nguồn giả-ngẫu-nhiên an toàn về mật mã (cryptographically-secure pseudorandom source) và được lưu bền vào storage với quyền hạn chế. Nó chỉ được nạp vào bộ nhớ để thực hiện các tác vụ ký, sau đó **ra khỏi scope để được garbage-collect**.
>
> Mặc dù Caddy có thể được cấu hình để **ký trực tiếp bằng root** (nhằm hỗ trợ các client không tuân thủ chuẩn), điều này **bị tắt theo mặc định**, và root key **chỉ dùng để ký intermediate**."

Xem thêm [[Encoding, Hashing & Encryption]] và [[14 - HTTPS]] cho phần chuỗi tin cậy.

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "The first time a root key is used, Caddy will try to install it into the system's local trust store(s). If it does not have permission to do so, it will prompt for a password. This behavior can be disabled with skip_install_trust in a caddyfile or "install_trust": false in a json config. If this fails due to being run as an unprivileged user, you may run caddy trust to retry installation as a privileged user."

🇻🇳 **Dịch**
> "**Lần đầu** một root key được dùng, Caddy sẽ cố cài nó vào (các) local trust store của hệ thống. Nếu không có quyền làm vậy, nó sẽ **hỏi password**. Hành vi này có thể tắt bằng `skip_install_trust` trong caddyfile hoặc `"install_trust": false` trong cấu hình json. Nếu việc này thất bại vì đang chạy dưới user không đặc quyền, bạn có thể chạy `caddy trust` để thử cài lại dưới user có đặc quyền."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "It is safe to trust Caddy's root certificate on your own machine as long as your computer is not compromised and your unique root key is not leaked."

🇻🇳 **Dịch**
> "**An toàn** khi tin cậy root certificate của Caddy trên máy của chính bạn, **miễn là** máy tính của bạn không bị xâm nhập và root key duy nhất của bạn không bị lộ."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "After Caddy's root CA is installed, you will see it in your local trust store as "Caddy Local Authority" (unless you've configured a different name). You can uninstall it any time if you wish (the caddy untrust command makes this easy)."

🇻🇳 **Dịch**
> "Sau khi root CA của Caddy được cài, bạn sẽ thấy nó trong local trust store dưới tên **"Caddy Local Authority"** (trừ khi bạn đã cấu hình tên khác). Bạn có thể **bỏ cài đặt nó bất cứ lúc nào** nếu muốn (lệnh `caddy untrust` làm việc này dễ dàng)."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*)
> "Note that automatically installing the certificate into the local trust stores is for convenience only and isn't guaranteed to work, especially if containers are being used or if Caddy is being run as an unprivileged system service. Ultimately, if you are relying on internal PKI, it is the system administrator's responsibility to ensure Caddy's root CA is properly added to the necessary trust stores (this is outside the scope of the web server)."

🇻🇳 **Dịch**
> "Lưu ý rằng việc tự động cài certificate vào local trust store **chỉ để tiện lợi và không được bảo đảm là sẽ hoạt động**, đặc biệt nếu đang dùng container hoặc nếu Caddy đang chạy như một system service không đặc quyền. Cuối cùng, nếu bạn đang dựa vào PKI nội bộ, **trách nhiệm của người quản trị hệ thống** là bảo đảm root CA của Caddy được thêm đúng cách vào các trust store cần thiết (việc này nằm ngoài phạm vi của web server)."

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "CA Intermediates")
> "An intermediate certificate and key will also be generated, which will be used for signing leaf (individual site) certificates.
>
> Unlike the root certificate, intermediate certificates have a much shorter lifetime and will automatically be renewed as needed."

🇻🇳 **Dịch**
> "Một intermediate certificate và key cũng sẽ được sinh ra, dùng để ký các leaf certificate (cho từng site riêng).
>
> Khác với root certificate, **intermediate certificate có thời hạn ngắn hơn nhiều** và sẽ được **tự động gia hạn khi cần**."

### 2.5. Test thì phải đổi ACME endpoint

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, mục "Testing")
> "To test or experiment with your Caddy configuration, make sure you change the ACME endpoint to a staging or development URL, otherwise you are likely to hit rate limits which can block your access to HTTPS for up to a week, depending on which rate limit you hit.
>
> One of Caddy's default CAs is Let's Encrypt, which has a staging endpoint that is not subject to the same rate limits"

🇻🇳 **Dịch**
> "Để test hay thử nghiệm cấu hình Caddy của bạn, **hãy chắc chắn đổi ACME endpoint sang một URL staging hoặc development**; nếu không, bạn rất có thể **chạm rate limit — điều có thể chặn quyền truy cập HTTPS của bạn tới một tuần**, tuỳ vào rate limit nào bị chạm.
>
> Một trong các CA mặc định của Caddy là Let's Encrypt, vốn có một **staging endpoint** không chịu cùng các rate limit đó."

> [!warning] Đây là rủi ro vận hành thật, không phải chi tiết nhỏ
> "Chặn tới một tuần" là con số docs tự đưa ra. Nghĩa là: đừng thử nghiệm cấu hình Caddy trên domain production với ACME endpoint mặc định. Kết hợp với cảnh báo "data directory phải bền" ở mục 2 — hai điều này là nguồn gốc của phần lớn sự cố Caddy trong container.

### 2.6. Ngoại lệ: `.ts.net`

📖 **Nguyên văn** (Caddy docs — *Automatic HTTPS*, "Special cases")
> "Domains ending in .ts.net will not be managed by Caddy. Instead, Caddy will automatically attempt to get these certificates at handshake-time from the locally-running Tailscale instance. This requires that HTTPS is enabled in your Tailscale account and the Caddy process must either be running as root, or you must configure tailscaled to give your Caddy user permission to fetch certificates."

🇻🇳 **Dịch**
> "Các domain kết thúc bằng `.ts.net` **sẽ không** được Caddy quản lý. Thay vào đó, Caddy sẽ tự động cố lấy những certificate này **ở thời điểm handshake** từ instance Tailscale đang chạy cục bộ. Việc này cần HTTPS được bật trong tài khoản Tailscale của bạn, và tiến trình Caddy phải **hoặc chạy dưới quyền root, hoặc** bạn phải cấu hình `tailscaled` để cấp cho user Caddy quyền lấy certificate."

---

## 3. Caddyfile: cấu trúc

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, "Structure" — cấu hình mẫu đầy đủ)
> ```
> {
> 	email you@yours.com
> 	servers {
> 		trusted_proxies static private_ranges
> 	}
> }
>
> (snippet) {
> 	# this is a reusable snippet
> 	log {
> 		output file /var/log/access.log
> 	}
> }
>
> example.com {
> 	@post {
> 		method POST
> 	}
> 	reverse_proxy @post localhost:9001 localhost:9002 {
> 		lb_policy first
> 	}
> 	file_server /static
> 	import snippet
> }
>
> www.example.com {
> 	redir https://example.com{uri}
> 	import snippet
> }
> ```
> Legend: Global options block · Snippet · Site block · Matcher definition · Option name · Option value · Comment · Site address · Directive

🇻🇳 **Giải thích theo đúng legend của docs**
> - Khối `{ ... }` **không có key** ở đầu file = **global options block**.
> - `(snippet) { ... }` = **snippet** (đoạn cấu hình tái dùng được).
> - `example.com { ... }` = **site block**, trong đó `example.com` là **site address**.
> - `@post { ... }` = **matcher definition**.
> - `reverse_proxy`, `file_server`, `redir`, `import` = **directive**.

### 3.1. Block

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, mục "Blocks")
> "Opening and closing a block is done with curly braces:
>
> ```
> ... {
> 	...
> }
> ```
>
> The open curly brace { must be at the end of its line and preceded by a space.
>
> The close curly brace } must be on its own line."

🇻🇳 **Dịch**
> "Mở và đóng một block bằng dấu ngoặc nhọn.
>
> **Dấu `{` mở phải nằm ở cuối dòng của nó và có một khoảng trắng đứng trước.**
>
> **Dấu `}` đóng phải nằm trên một dòng riêng của nó.**"

> [!warning] Cú pháp này khắt khe hơn nginx và Apache
> Đây là quy tắc cứng, không phải quy ước thẩm mỹ. `{` phải cuối dòng, `}` phải một mình một dòng. nginx thì thoải mái hơn nhiều về chỗ đặt ngoặc.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "When there is only one site block, the curly braces (and indentation) are optional. This is for convenience to quickly define a single site, for example, this:
>
> ```
> localhost
>
> reverse_proxy /api/* localhost:9001
> file_server
> ```
>
> is equivalent to:
>
> ```
> localhost {
> 	reverse_proxy /api/* localhost:9001
> 	file_server
> }
> ```
>
> when you have only a single site block; it's a matter of preference."

🇻🇳 **Dịch**
> "Khi **chỉ có một site block**, dấu ngoặc nhọn (và thụt lề) là **tuỳ chọn**. Điều này để tiện định nghĩa nhanh một site duy nhất — hai đoạn trên là **tương đương** khi bạn chỉ có một site block; đó là vấn đề sở thích."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "To configure multiple sites with the same Caddyfile, you must use curly braces around each one to separate their configurations:
>
> ```
> example1.com {
> 	root /www/example.com
> 	file_server
> }
>
> example2.com {
> 	reverse_proxy localhost:9000
> }
> ```
>
> If a request matches multiple site blocks, the site block with the most specific matching address is chosen. Requests don't cascade into to other site blocks."

🇻🇳 **Dịch**
> "Để cấu hình nhiều site trong cùng một Caddyfile, bạn **phải** dùng ngoặc nhọn quanh từng cái để tách cấu hình của chúng.
>
> Nếu một request khớp nhiều site block, **site block có address khớp cụ thể nhất được chọn. Request KHÔNG lan (cascade) sang các site block khác.**"

> [!note] Ba web server, ba luật khác nhau khi nhiều khối cùng khớp
> - **nginx**: chọn **một** `location` duy nhất theo luật prefix/regex ([[03 - Nginx - Kiến trúc và xử lý request]] mục 5).
> - **Apache**: **merge tất cả** section khớp theo 5 nhóm ([[05 - Apache HTTP Server]] mục 4.3) — trừ `<VirtualHost>` thì chọn một.
> - **Caddy**: chọn site block **cụ thể nhất**, và docs nói thẳng *"Requests don't cascade"* — không merge.

### 3.2. Directive và subdirective

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, mục "Directives")
> "Directives are functional keywords which customize how the site is served. They must appear within site blocks. For example, a complete file server config might look like this:
>
> ```
> localhost {
> 	file_server
> }
> ```
>
> Or a reverse proxy:
>
> ```
> localhost {
> 	reverse_proxy localhost:9000
> }
> ```
>
> In these examples, file_server and reverse_proxy are directives. Directives are the first word on a line in a site block."

🇻🇳 **Dịch**
> "Directive là các **từ khoá chức năng** tuỳ biến cách site được phục vụ. Chúng **phải xuất hiện bên trong site block**. Ví dụ, một cấu hình file server **hoàn chỉnh** có thể trông như trên. Hoặc một reverse proxy như trên.
>
> Trong các ví dụ này, `file_server` và `reverse_proxy` là directive. **Directive là từ đầu tiên trên một dòng trong site block.**"

> [!tip] Chú ý chữ "a complete file server config"
> Docs gọi ba dòng `localhost { file_server }` là một cấu hình file server **hoàn chỉnh** — và theo mục 2, nó đã bao gồm HTTPS. So với cấu hình nginx tương đương ở [[04 - Nginx - Serving, Proxy và Load Balancing]] mục 1 (cần `listen`, `server_name`, `root`, `location`, chưa tính TLS), đây là khác biệt lớn về lượng cấu hình phải viết.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "In the second example, localhost:9000 is an argument because it appears on the same line after the directive.
>
> Sometimes directives can open their own blocks. Subdirectives appear on the beginning of each line within directive blocks:
>
> ```
> localhost {
> 	reverse_proxy localhost:9000 localhost:9001 {
> 		lb_policy first
> 	}
> }
> ```
>
> Here, lb_policy is a subdirective to reverse_proxy (it sets the load balancing policy to use between backends)."

🇻🇳 **Dịch**
> "Trong ví dụ thứ hai, `localhost:9000` là một **argument** vì nó xuất hiện trên cùng dòng, sau directive.
>
> Đôi khi directive có thể mở block riêng của chúng. **Subdirective** xuất hiện ở đầu mỗi dòng bên trong các directive block. Ở đây `lb_policy` là một subdirective của `reverse_proxy` (nó đặt chính sách load balancing dùng giữa các backend)."

> [!note] Load balancing của Caddy là subdirective, không phải khối riêng
> nginx cần một khối `upstream` riêng rồi trỏ `proxy_pass` tới nó ([[04 - Nginx - Serving, Proxy và Load Balancing]] mục 4.2). Caddy liệt kê backend **ngay trên dòng `reverse_proxy`**, và policy là subdirective. Ít khái niệm hơn, nhưng cũng ít khả năng tái dùng một nhóm backend ở nhiều chỗ.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Unless otherwise documented, directives cannot be used within other directive blocks. For example, basic_auth cannot be used within file_server because the file server does not know how to do authentication; but you can use directives within route, handle, and handle_path blocks because they are specifically designed to group directives together."

🇻🇳 **Dịch**
> "Trừ khi có tài liệu nói khác, **directive không thể dùng bên trong block của directive khác**. Ví dụ, `basic_auth` không thể dùng trong `file_server` vì file server **không biết cách làm authentication**; nhưng bạn **có thể** dùng directive bên trong các block `route`, `handle`, và `handle_path`, vì chúng được thiết kế riêng để nhóm các directive lại với nhau."

### 3.3. Thứ tự directive được sắp lại tự động

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Note that when the HTTP Caddyfile is adapted, HTTP handler directives are sorted according to a specific default directive order unless in a route block, so the order of appearance of the directives does not matter except in route blocks."

🇻🇳 **Dịch**
> "Lưu ý rằng khi HTTP Caddyfile được **adapt** (chuyển sang JSON), các HTTP handler directive được **sắp xếp theo một thứ tự directive mặc định cụ thể** — trừ khi nằm trong một block `route`. Vì vậy **thứ tự xuất hiện của directive không quan trọng**, ngoại trừ trong các block `route`."

> [!warning] Đây là khác biệt triết lý đáng chú ý nhất
> Ở nginx, **thứ tự regex trong file quyết định** ([[03 - Nginx - Kiến trúc và xử lý request]] mục 5). Ở Apache, **thứ tự trong file quyết định** với các section cùng nhóm ([[05 - Apache HTTP Server]] mục 4.3, 6.3). Ở Caddy, **thứ tự bạn viết bị bỏ qua** — Caddy tự sắp lại theo một thứ tự mặc định của nó. Đây là con dao hai lưỡi: bớt lỗi do sắp sai, nhưng cấu hình **không đọc được theo thứ tự trên xuống** nữa; muốn kiểm soát thứ tự thì phải dùng `route`.

### 3.4. Token, dấu nháy và heredoc

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, mục "Tokens and quotes")
> "The Caddyfile is lexed into tokens before being parsed. Whitespace is significant in the Caddyfile, because tokens are separated by whitespace.
>
> Often, directives expect a certain number of arguments; if a single argument has a value with whitespace, it would be lexed as two separate tokens:
>
> ```
> directive abc def
> ```
>
> This could be problematic and return errors or unexpected behavior.
>
> If abc def is supposed to be the value of a single argument, it needs to be quoted:
>
> ```
> directive "abc def"
> ```
> "

🇻🇳 **Dịch**
> "Caddyfile được **lex thành token** trước khi được parse. **Khoảng trắng có ý nghĩa** trong Caddyfile, vì các token được phân tách bằng khoảng trắng.
>
> Directive thường mong đợi một số lượng argument nhất định; nếu một argument đơn lẻ có giá trị chứa khoảng trắng, nó sẽ bị lex thành **hai token riêng biệt** — điều này có thể gây vấn đề và trả về lỗi hoặc hành vi bất ngờ. Nếu `abc def` phải là giá trị của một argument duy nhất, nó **cần được bọc trong dấu nháy**."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Quotes can be escaped if you need to use quotes in quoted tokens, too:
>
> ```
> directive "\"abc def\""
> ```
>
> To avoid escaping quotes, you can instead use backticks ` ` to enclose tokens; for example:
>
> ```
> directive `{"foo": "bar"}`
> ```
>
> Inside quoted tokens, all other characters are treated literally, including spaces, tabs, and newlines. Multi-line tokens are thus possible"

🇻🇳 **Dịch**
> "Dấu nháy có thể được escape nếu bạn cần dùng dấu nháy trong token đã bọc nháy. Để **tránh phải escape**, bạn có thể dùng **backtick** `` ` `` để bọc token; ví dụ `` directive `{"foo": "bar"}` ``.
>
> Bên trong token đã bọc nháy, **mọi ký tự khác được xử lý nguyên văn**, kể cả khoảng trắng, tab, và ký tự dòng mới. Nhờ vậy **token nhiều dòng** là khả thi."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Heredocs are also supported:
>
> ```
> example.com {
> 	respond <<HTML
> 		<html>
> 		  <head><title>Foo</title></head>
> 		  <body>Foo</body>
> 		</html>
> 		HTML 200
> }
> ```
>
> The opening heredoc marker must start with <<, followed by any text (uppercase letters recommended). The closing heredoc marker must be the same text (in the above example, HTML)."

🇻🇳 **Dịch**
> "**Heredoc** cũng được hỗ trợ. Marker heredoc mở phải bắt đầu bằng `<<`, theo sau là bất kỳ đoạn text nào (khuyến nghị dùng chữ in hoa). Marker heredoc đóng **phải là cùng đoạn text đó** (ở ví dụ trên là `HTML`)."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "The closing marker can be indented, which causes every line of text to have that much indentation stripped (inspired by PHP) which is nice for readability inside blocks while giving great control of the whitespace in the token text. The trailing newline is also stripped, but can be retained by adding an extra blank line before the closing marker.
>
> Additional tokens may follow the closing marker as arguments to the directive (such as in the example above, the status code 200)."

🇻🇳 **Dịch**
> "Marker đóng **có thể được thụt lề**, điều này làm mỗi dòng text bị **cắt bỏ đúng lượng thụt lề đó** (lấy cảm hứng từ PHP) — tiện cho khả năng đọc bên trong các block, đồng thời vẫn kiểm soát tốt khoảng trắng trong text của token. **Dòng mới ở cuối cũng bị cắt**, nhưng có thể giữ lại bằng cách thêm một dòng trống trước marker đóng.
>
> Có thể có thêm token đứng sau marker đóng, đóng vai argument cho directive (như trong ví dụ trên là status code `200`)."

---

## 4. Site address — mọi hành vi bắt đầu từ đây

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, mục "Addresses")
> "An address always appears at the top of the site block, and is usually the first thing in the Caddyfile."

🇻🇳 **Dịch**
> "Một address **luôn xuất hiện ở đầu site block**, và thường là thứ đầu tiên trong Caddyfile."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, bảng "These are examples of valid addresses")
> | Address | Effect |
> |---|---|
> | example.com | HTTPS with managed publicly-trusted certificate |
> | *.example.com | HTTPS with managed wildcard publicly-trusted certificate |
> | localhost | HTTPS with managed locally-trusted certificate |
> | http:// | HTTP catch-all, affected by http_port |
> | https:// | HTTPS catch-all, affected by https_port |
> | http://example.com | HTTP explicitly, with a Host matcher |
> | example.com:443 | HTTPS due to matching the https_port default |
> | :443 | HTTPS catch-all due to matching the https_port default |
> | :8080 | HTTP on non-standard port, no Host matcher |
> | localhost:8080 | HTTPS on non-standard port, due to having a valid domain |
> | https://example.com:443 | HTTPS, but having both https:// and :443 is redundant |
> | 127.0.0.1 | HTTPS, with a locally-trusted IP certificate |
> | http://127.0.0.1 | HTTP, with an IP address Host matcher (rejects localhost) |

🇻🇳 **Dịch bảng**
> | Address | Tác dụng |
> |---|---|
> | `example.com` | HTTPS với certificate công khai tin cậy được quản lý |
> | `*.example.com` | HTTPS với certificate wildcard công khai tin cậy được quản lý |
> | `localhost` | HTTPS với certificate tin cậy **cục bộ** được quản lý |
> | `http://` | HTTP catch-all, bị ảnh hưởng bởi `http_port` |
> | `https://` | HTTPS catch-all, bị ảnh hưởng bởi `https_port` |
> | `http://example.com` | HTTP tường minh, kèm một Host matcher |
> | `example.com:443` | HTTPS do khớp giá trị mặc định của `https_port` |
> | `:443` | HTTPS catch-all do khớp giá trị mặc định của `https_port` |
> | `:8080` | HTTP trên port không chuẩn, **không có** Host matcher |
> | `localhost:8080` | HTTPS trên port không chuẩn, do có một domain hợp lệ |
> | `https://example.com:443` | HTTPS, nhưng có cả `https://` lẫn `:443` là **dư** |
> | `127.0.0.1` | HTTPS, với certificate IP tin cậy cục bộ |
> | `http://127.0.0.1` | HTTP, với Host matcher là địa chỉ IP (**từ chối** `localhost`) |

> [!warning] Bảng này nói rằng `:8080` và `localhost:8080` KHÁC nhau
> `:8080` → HTTP thường, không có Host matcher. `localhost:8080` → **HTTPS**, vì có một domain hợp lệ. Cùng một port mà một cái HTTP một cái HTTPS — hoàn toàn do phần host trong address. Đây là hệ quả trực tiếp của "implicit activation" ở mục 2.1.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Automatic HTTPS is enabled if your site's address contains a hostname or IP address. This behavior is purely implicit, however, so it never overrides any explicit configuration.
>
> For example, if the site's address is http://example.com, auto-HTTPS will not activate because the scheme is explicitly http://."

🇻🇳 **Dịch**
> "Automatic HTTPS được bật nếu address của site **chứa một hostname hay địa chỉ IP**. Tuy nhiên hành vi này **hoàn toàn là ngầm định**, nên nó **không bao giờ ghi đè bất kỳ cấu hình tường minh nào**.
>
> Ví dụ, nếu address của site là `http://example.com`, auto-HTTPS **sẽ không** được kích hoạt, vì scheme đã được ghi tường minh là `http://`."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "From the address, Caddy can potentially infer the scheme, host and port of your site. If the address is without a port, the Caddyfile will choose the port matching the scheme if specified, or the default port of 443 will be assumed.
>
> If you specify a hostname, only requests with a matching Host header will be honored. In other words, if the site address is localhost, then Caddy will not match requests to 127.0.0.1."

🇻🇳 **Dịch**
> "Từ address, Caddy có thể **suy ra** scheme, host và port của site. Nếu address không có port, Caddyfile sẽ chọn port khớp với scheme nếu scheme được ghi, hoặc **giả định port mặc định 443**.
>
> Nếu bạn chỉ định một hostname, **chỉ những request có header `Host` khớp mới được phục vụ**. Nói cách khác, nếu site address là `localhost`, thì Caddy **sẽ không** khớp các request tới `127.0.0.1`."

> [!note] Lại là `Host` header
> Vẫn đúng một cơ chế RFC 9110 §7.2 ([[01 - Web Server là gì]]): `server_name` của nginx, `ServerName` của Apache, và **site address** của Caddy đều đang khớp `Host`.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Wildcards (*) may be used, but only to represent precisely one label of the hostname. For example, *.example.com matches foo.example.com but not foo.bar.example.com, and * matches localhost but not example.com."

🇻🇳 **Dịch**
> "Có thể dùng wildcard (`*`), nhưng **chỉ để đại diện cho đúng MỘT label** của hostname. Ví dụ, `*.example.com` khớp `foo.example.com` nhưng **không** khớp `foo.bar.example.com`; và `*` khớp `localhost` nhưng **không** khớp `example.com`."

> [!warning] Khác nginx ở đúng điểm này
> nginx: *"An asterisk can match several name parts. The name `*.example.org` matches not only www.example.org but www.sub.example.org as well"* ([[03 - Nginx - Kiến trúc và xử lý request]] mục 4.3). Caddy: **đúng một label**. Cùng ký hiệu `*`, hai ngữ nghĩa khác nhau — chỗ này rất dễ sai khi chuyển cấu hình giữa hai server.

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "To catch all hosts, omit the host portion of the address, for example, simply https://. This is useful when using On-Demand TLS, when you don't know the domains ahead of time."

🇻🇳 **Dịch**
> "Để bắt **mọi** host, hãy bỏ phần host của address — ví dụ chỉ viết `https://`. Điều này hữu ích khi dùng **On-Demand TLS**, lúc bạn **không biết trước các domain**."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "If multiple sites share the same definition, you can list all of them together, separated with spaces and commas (at least one space is necessary). The following three examples are equivalent:
>
> ```
> # Comma separated site addresses
> localhost:8080, example.com, www.example.com {
> 	...
> }
> ```
> ```
> # Space separated site addresses
> localhost:8080 example.com www.example.com {
> 	...
> }
> ```
> ```
> # Comma and new-line separated site addresses
> localhost:8080,
> example.com,
> www.example.com {
> 	...
> }
> ```
> "

🇻🇳 **Dịch**
> "Nếu nhiều site dùng chung cùng một định nghĩa, bạn có thể liệt kê tất cả chúng cùng nhau, phân tách bằng khoảng trắng và dấu phẩy (**cần ít nhất một khoảng trắng**). Ba ví dụ trên là **tương đương**."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "An address must be unique; you cannot specify the same address more than once."

🇻🇳 **Dịch**
> "Một address **phải là duy nhất**; bạn không thể chỉ định cùng một address nhiều hơn một lần."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "Placeholders cannot be used in addresses, but you may use Caddyfile-style environment variables in them:
>
> ```
> {$DOMAIN:localhost} {
> 	...
> }
> ```
> "

🇻🇳 **Dịch**
> "**Placeholder không dùng được** trong address, nhưng bạn **có thể** dùng environment variable kiểu Caddyfile trong đó — ví dụ `{$DOMAIN:localhost}` (biến `DOMAIN`, mặc định `localhost` nếu không đặt)."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "By default, sites bind on all network interfaces. If you wish to override this, use the bind directive or the default_bind global option to do so."

🇻🇳 **Dịch**
> "Theo mặc định, các site **bind trên mọi network interface**. Nếu muốn ghi đè điều này, dùng directive `bind` hoặc global option `default_bind`."

---

## 5. Matcher — chọn request nào thì directive áp dụng

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*, mục "Matchers")
> "HTTP handler directives apply to all requests by default (unless otherwise documented).
>
> Request matchers can be used to classify requests by a given criteria. With matchers, you can specify exactly which requests a certain directive applies to."

🇻🇳 **Dịch**
> "HTTP handler directive **áp dụng cho mọi request theo mặc định** (trừ khi có tài liệu nói khác).
>
> **Request matcher** có thể dùng để phân loại request theo một tiêu chí cho trước. Với matcher, bạn có thể chỉ định **chính xác** những request nào mà một directive nhất định áp dụng cho."

📖 **Nguyên văn** (Caddy docs — *Caddyfile Concepts*)
> "For directives that support matchers, the first argument after the directive is the matcher token. Here are some examples:
>
> ```
> root *           /var/www  # matcher token: *
> root /index.html /var/www  # matcher token: /index.html
> root @post       /var/www  # matcher token: @post
> ```
>
> Matcher tokens can be omitted entirely to match all requests; for example, * does not need to be given if the next argument does not look like a path matcher."

🇻🇳 **Dịch**
> "Với các directive hỗ trợ matcher, **argument đầu tiên sau directive là matcher token**. Ba dạng token trong ví dụ: `*` (khớp mọi request), `/index.html` (path matcher), `@post` (matcher đã định nghĩa sẵn, xem mục 3 — `@post { method POST }`).
>
> **Matcher token có thể bỏ hẳn** để khớp mọi request; ví dụ `*` không cần ghi nếu argument tiếp theo **không trông giống một path matcher**."

> [!note] Mô hình khác hẳn hai server kia
> nginx và Apache đều **nhóm directive vào trong một khối** (`location { ... }`, `<Location> ... </Location>`). Caddy thì gắn điều kiện **trực tiếp lên từng directive** qua matcher token. Cùng giải một bài toán ("directive này áp cho request nào"), nhưng một bên tổ chức theo khối, một bên theo dòng.

---

## 6. Những chỗ docs KHÔNG nói

- **Ba trang docs được trích ở đây không có con số hiệu năng nào** — không so sánh với nginx hay Apache, không request/giây. Từ "powerful" là mô tả định tính của docs.
- **Không có mô hình process/thread của Caddy.** Ba trang này không nói Caddy chạy mấy process, mấy goroutine, hay dùng cơ chế I/O nào. Vì vậy bài này **không** đối chiếu kiến trúc tiến trình của Caddy với master/worker của nginx ([[03 - Nginx - Kiến trúc và xử lý request]] mục 1) hay MPM của Apache ([[05 - Apache HTTP Server]] mục 2) — sẽ là suy diễn.
- **Không có cơ chế reload/graceful restart** trong ba trang này. Docs chỉ nói cấu hình "dynamic and exportable with Caddy's API", nhưng không mô tả API đó hoạt động ra sao (có trang *API* riêng).
- **Chi tiết `reverse_proxy`** (health check, các `lb_policy` cụ thể, header truyền đi) nằm ở trang directive riêng, không có trong ba trang này. Nên bài **không** so sánh khả năng load balancing của Caddy với `upstream` của nginx ngoài phần cú pháp.
- **Phiên bản Caddy hiện tại** không xuất hiện trong ba trang này, nên bài không ghi số phiên bản.
- **Danh sách đầy đủ matcher** (`Read the Request Matchers page to learn more`) và **danh sách placeholder** nằm ở trang riêng.

---

## Nguồn tham khảo
- Caddy — *Welcome to Caddy*: <https://caddyserver.com/docs/>
- Caddy — *Caddyfile Concepts*: <https://caddyserver.com/docs/caddyfile/concepts>
- Caddy — *Automatic HTTPS*: <https://caddyserver.com/docs/automatic-https>
