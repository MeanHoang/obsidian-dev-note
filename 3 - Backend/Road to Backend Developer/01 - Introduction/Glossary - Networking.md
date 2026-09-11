# Glossary — Networking (Road to Backend)

> File thuật ngữ dùng chung cho cả series. Mỗi từ: **định nghĩa ngắn + ví dụ đời sống**. Link ngược từ các bài, vd [[01 - How does the internet work]].
>
> 💡 Trong các note, thuật ngữ được link dạng `[[Glossary - Networking#DNS|DNS]]` → bấm vào là nhảy thẳng tới định nghĩa ở đây.

## Hạ tầng vật lý

### Protocol
**Protocol (giao thức)** — Bộ quy tắc chung để hai máy hiểu nhau (gửi gì trước, định dạng ra sao, trả lời thế nào). *Đời sống:* như luật gọi điện "alô → nói → chào → cúp", hoặc luật giao thông — ai cũng theo thì mới chạy được.

### ISP
**ISP (Internet Service Provider)** — Nhà cung cấp dịch vụ Internet (Viettel, FPT, VNPT). Bán cho bạn "đường ra" Internet. Xếp tầng: Tier 3 (nội địa) → Tier 2 (vùng) → Tier 1 (xương sống toàn cầu).

### Backbone
**Backbone (xương sống)** — Các tuyến cáp quang dung lượng cực lớn nối các vùng/châu lục — "đường cao tốc" của Internet.

### Submarine cable
**Submarine cable (cáp quang biển)** — Cáp quang đặt dưới đáy đại dương nối các châu lục. Mang phần lớn lưu lượng liên lục địa. VN nối qua AAG, APG... — đứt cáp = mạng quốc tế chậm.

### IXP
**IXP (Internet Exchange Point)** — "Chợ đầu mối" nơi nhiều [[Glossary - Networking#ISP|ISP]] cắm chung để trao đổi dữ liệu trực tiếp cho gần/nhanh/rẻ, khỏi vòng ra nước ngoài. VN có VNIX.

### Peering
**Peering** — Hai mạng thỏa thuận nối trực tiếp (nối ngang, cùng cấp) và trao đổi lưu lượng cho nhau, thường miễn phí.

### Transit
**Transit** — ISP nhỏ **trả tiền** mua đường của ISP lớn hơn (Tier 1) để với tới toàn bộ Internet. Ngược với [[Glossary - Networking#Peering|peering]] (miễn phí, ngang hàng).

## Thiết bị mạng

### Modem
**Modem** — Dịch tín hiệu nhà mạng (cáp quang/ADSL) ↔ tín hiệu máy tính hiểu. Cửa ngõ ra Internet. Ví như *phiên dịch viên* ở cửa.

### Router
**Router (bộ định tuyến)** — Nối **các mạng KHÁC nhau** với nhau (nhà bạn ↔ Internet), quyết định gói đi hướng nào tới đích. Ví như *bưu điện / cửa chính nhà bạn*. Khác [[Glossary - Networking#Switch|switch]].

### Switch
**Switch** — Nối các thiết bị **trong CÙNG một [[Glossary - Networking#LAN|LAN]]**, chuyển gói tới đúng máy bằng [[Glossary - Networking#MAC address|MAC address]]. Ví như *người gác ga*. (Router gia đình thường gộp modem + router + switch làm một.)

### LAN
**LAN (Local Area Network)** — Mạng nội bộ khép kín (nhà, văn phòng) — các máy nối nhau qua switch/WiFi. LAN ≠ Internet; LAN là *viên gạch* xây nên Internet.

## Địa chỉ

### IP address
**IP address** — Địa chỉ **logic** của máy trên mạng, có thể đổi. IPv4 = `142.250.66.14` (gần cạn), IPv6 = dạng dài hơn (gần vô hạn). *Đời sống:* số nhà. Dùng để định tuyến xuyên Internet. (**IP = Internet Protocol**.)

### MAC address
**MAC address (Media Access Control)** — Địa chỉ **phần cứng**, gắn cứng vào card mạng từ nhà máy. Dùng nói chuyện trong cùng [[Glossary - Networking#LAN|LAN]]. *Đời sống:* số CMND dán cứng trên món hàng. (Không liên quan máy Mac của Apple.)

### Port
**Port** — Số cổng phân biệt **dịch vụ nào trên cùng một máy**. 443=HTTPS, 80=HTTP, 22=SSH, 53=DNS, 5432=PostgreSQL. *Đời sống:* số căn hộ trong 1 tòa nhà (cùng địa chỉ, khác cửa).

### Domain
**Domain (tên miền)** — Cái **TÊN dễ nhớ** cho con người (`google.com`), thay cho dãy số [[Glossary - Networking#IP address|IP]] khó nhớ. [[Glossary - Networking#DNS|DNS]] dịch domain → IP.

## Truyền dữ liệu

### Packet
**Packet (gói tin)** — Mẩu nhỏ dữ liệu bị cắt ra để gửi. Mỗi packet có: **header** (IP nguồn/đích, số thứ tự, checksum) + **payload** (dữ liệu thật). Đầu nhận ráp lại theo số thứ tự.

### Packet switching
**Packet switching** — Cách Internet truyền: cắt dữ liệu thành packet, mỗi packet tự tìm đường, ráp lại ở đích. Đường truyền được **chia sẻ** → hiệu quả. Ngược với [[Glossary - Networking#Circuit switching|circuit switching]].

### Circuit switching
**Circuit switching** — Cách cũ (điện thoại xưa): giữ **một đường dây riêng** suốt phiên. Lãng phí hơn packet switching.

### MTU
**MTU (Maximum Transmission Unit)** — Kích thước tối đa của **một gói** mà đường truyền cho phép. Ethernet phổ biến = **1500 byte**. Dữ liệu to hơn phải cắt nhỏ.

### Encapsulation
**Encapsulation (đóng gói)** — Mỗi tầng TCP/IP bọc thêm một lớp "phong bì" (header) quanh dữ liệu khi đi xuống; đầu nhận bóc ngược từng lớp.

## Giao thức cốt lõi

### TCP/IP
**TCP/IP** — Bộ giao thức nền tảng của Internet, thực chất là cả một **protocol stack** (chồng giao thức). Gọi tắt theo 2 chuẩn chính: IP (tầng Internet) lo địa chỉ + định tuyến; TCP (tầng Transport) lo đảm bảo dữ liệu tới đủ, đúng thứ tự.

### TCP
**TCP (Transmission Control Protocol — Giao thức Điều khiển Truyền dẫn)** — Chữ **"Control" = kiểm soát** → "thư bảo đảm": [[Glossary - Networking#3-way handshake|bắt tay 3 bước]] trước, báo nhận (ACK) từng phần, mất thì gửi lại, ráp đúng thứ tự. Chậm hơn nhưng đáng tin. Dùng cho web, email, API.

### UDP
**UDP (User Datagram Protocol — Giao thức Gói dữ liệu Người dùng)** — **"Datagram" = gói bắn độc lập**, không "Control" → "thư thường": bắn đi luôn, không kiểm tra mất mát. Nhanh, độ trễ thấp, có thể rớt gói. Dùng cho video call, game, streaming.

### 3-way handshake
**3-way handshake (bắt tay 3 bước)** — Màn "bắt tay" 2 máy xác nhận nhau TRƯỚC khi [[Glossary - Networking#TCP|TCP]] gửi dữ liệu thật, đảm bảo cả 2 chiều đều thông. 3 bước: **① A→B: SYN** ("xin kết nối") → **② B→A: SYN+ACK** ("nghe rồi, sẵn sàng") → **③ A→B: ACK** ("ok chốt"). Cần đủ 3 (không phải 2) để cả 2 máy đều chắc *gửi được VÀ nhận được*. *Đời sống:* gọi điện — "Alô?" → "Alô nghe nè!" → "Ừ nói nhé". (SYN = Synchronize; ACK = Acknowledge.)

### ICMP
**ICMP** — Giao thức "chẩn đoán" mạng, dùng bởi `ping` và `traceroute` để kiểm tra máy có sống không / đường đi ra sao.

## Tầng ứng dụng & dịch vụ

### HTTP
**HTTP (HyperText Transfer Protocol)** — Giao thức của Web. Client gửi request (`GET /...`), server trả response kèm mã (`200` ok, `404` không thấy). Đi **trần** (không mã hóa). Backend dùng nhiều nhất.

### HTTPS
**HTTPS (HTTP Secure)** — = HTTP + mã hóa [[Glossary - Networking#TLS / SSL|TLS]]. Dữ liệu bị khóa trên đường, kẻ chặn chỉ thấy ký tự vô nghĩa → ổ khóa 🔒. Port 443. Shopify bắt buộc HTTPS.

### TLS / SSL
**TLS (Transport Layer Security)** — Lớp mã hóa biến HTTP → HTTPS. Handshake trao đổi khóa (dùng cặp khóa công khai/bí mật) để dữ liệu đi trên đường không ai đọc trộm. **SSL** = bản cũ đã lỗi thời; TLS thay thế (nhưng nhiều người quen miệng gọi "SSL").

### DNS
**DNS (Domain Name System)** — "Danh bạ" Internet: **công cụ dịch tên miền (`google.com`) → IP (`142.250.66.14`)**. Là "cầu nối" giữa TÊN (người nhớ) ↔ SỐ IP (máy cần). Phân cấp: Root → TLD (`.com`) → Authoritative server. Xem `nslookup google.com`.

### A record / CNAME
**A record / CNAME** — Bản ghi DNS. **A record** trỏ domain → một IP cụ thể. **CNAME** trỏ domain → một domain khác (bí danh). Dùng khi gắn custom domain cho Cloud Run.

### SMTP / IMAP / POP3
**SMTP / IMAP / POP3** — Giao thức email. **SMTP** (Simple Mail Transfer Protocol) = **gửi** đi + chuyển mail giữa các server. **IMAP** = đọc mail để **trên** server (đồng bộ nhiều máy). **POP3** = tải mail **về** máy rồi xóa server.

### SSH
**SSH (Secure Shell)** — Giao thức điều khiển server từ xa qua kết nối mã hóa (port 22). Vd `gcloud compute ssh` vào VM.

### FTP / SFTP
**FTP / SFTP** — Truyền file giữa máy và server. SFTP = bản mã hóa an toàn (đi qua [[Glossary - Networking#SSH|SSH]]).

## Mô hình

### Client – Server
**Client – Server** — Client *hỏi* (trình duyệt, app), Server *trả lời* (máy chạy 24/7 giữ dữ liệu). Backend = phần server. Ví như *ngân hàng* giữ sổ cái duy nhất.

### P2P
**P2P (Peer-to-Peer)** — Các máy ngang hàng vừa hỏi vừa trả lời, **không có server trung tâm**. Vd BitTorrent, blockchain. Ví như *chợ trao đổi trực tiếp* không ông chủ.

### Blockchain
**Blockchain** — Dùng [[Glossary - Networking#P2P|P2P]] để giữ **một sổ cái chung, mỗi node có bản copy y hệt, không ai sửa lén** → giao dịch không cần trung gian. Dữ liệu lưu thành file thật trên các node (Bitcoin: `blocks/` + `chainstate/`).

### Request / Response
**Request / Response** — Một chu trình: client gửi yêu cầu (request) → server trả kết quả (response). Đơn vị giao tiếp cơ bản của web.
