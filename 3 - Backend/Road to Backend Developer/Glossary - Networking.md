# Glossary — Networking (Road to Backend)

> File thuật ngữ dùng chung cho cả series. Mỗi từ: **định nghĩa ngắn + ví dụ đời sống**. Link ngược từ các bài, vd [[01 - How does the internet work?]].

## Hạ tầng vật lý

**Protocol (giao thức)**
Bộ quy tắc chung để hai máy hiểu nhau. *Đời sống:* như luật giao thông — ai cũng phải theo thì đường mới chạy được.

**ISP (Internet Service Provider)**
Nhà cung cấp dịch vụ Internet (Viettel, FPT, VNPT). Bán cho bạn "đường ra" Internet. Xếp tầng: Tier 3 (nội địa) → Tier 2 (vùng) → Tier 1 (xương sống toàn cầu).

**Backbone (xương sống)**
Các tuyến cáp quang dung lượng cực lớn nối các vùng/châu lục — "đường cao tốc" của Internet.

**Submarine cable (cáp quang biển)**
Cáp quang đặt dưới đáy đại dương nối các châu lục. Mang ~99% lưu lượng liên lục địa. VN nối qua AAG, APG... — đứt cáp = mạng quốc tế chậm.

**IXP (Internet Exchange Point)**
"Chợ đầu mối" nơi nhiều ISP cắm chung để trao đổi dữ liệu trực tiếp cho gần/nhanh/rẻ, khỏi vòng ra nước ngoài.

**Peering**
Hai mạng thỏa thuận nối trực tiếp và trao đổi lưu lượng cho nhau (thường miễn phí).

## Thiết bị mạng

**Modem**
Dịch tín hiệu nhà mạng (cáp quang/ADSL) ↔ tín hiệu máy tính hiểu. Cửa ngõ ra Internet.

**Router (bộ định tuyến)**
Định tuyến gói tin **giữa các mạng khác nhau** (nhà bạn ↔ Internet). Quyết định gói đi hướng nào tới đích.

**Switch**
Nối các thiết bị **trong cùng một LAN**, chuyển gói tới đúng máy bằng MAC address. (Router gia đình thường gộp modem + router + switch làm một.)

**LAN (Local Area Network)**
Mạng nội bộ nhỏ (nhà, văn phòng) — các máy nối nhau qua switch/WiFi.

## Địa chỉ

**IP address**
Địa chỉ **logic** của máy trên mạng, có thể đổi. IPv4 = `142.250.66.14` (gần cạn), IPv6 = dạng dài hơn (gần vô hạn). *Đời sống:* số nhà. Dùng để định tuyến xuyên Internet.

**MAC address**
Địa chỉ **phần cứng**, gắn cứng vào card mạng từ nhà máy. Dùng nói chuyện trong cùng LAN. *Đời sống:* số CMND dán cứng trên món hàng.

**Port**
Số cổng phân biệt **dịch vụ nào trên cùng một máy**. 443=HTTPS, 80=HTTP, 22=SSH, 53=DNS, 5432=PostgreSQL. *Đời sống:* số căn hộ trong 1 tòa nhà (cùng địa chỉ, khác cửa).

## Truyền dữ liệu

**Packet (gói tin)**
Mẩu nhỏ dữ liệu bị cắt ra để gửi. Mỗi packet có: dữ liệu + địa chỉ đích + số thứ tự. Đầu nhận ráp lại theo thứ tự.

**Packet switching**
Cách Internet truyền: cắt dữ liệu thành packet, mỗi packet tự tìm đường, ráp lại ở đích. Đường truyền được **chia sẻ** → hiệu quả.

**Circuit switching**
Cách cũ (điện thoại xưa): giữ **một đường dây riêng** suốt phiên. Lãng phí hơn packet switching.

**Encapsulation (đóng gói)**
Mỗi tầng TCP/IP bọc thêm một lớp "phong bì" (header) quanh dữ liệu khi đi xuống; đầu nhận bóc ngược từng lớp.

## Giao thức cốt lõi

**TCP/IP**
Bộ giao thức nền tảng của Internet. IP lo địa chỉ + định tuyến; TCP lo đảm bảo dữ liệu tới nơi đầy đủ, đúng thứ tự.

**TCP (Transmission Control Protocol)**
"Thư bảo đảm": bắt tay 3 bước trước, báo nhận (ACK) từng phần, mất thì gửi lại, ráp đúng thứ tự. Chậm hơn nhưng đáng tin. Dùng cho web, email, API.

**UDP (User Datagram Protocol)**
"Thư thường": bắn đi luôn, không kiểm tra mất mát. Nhanh, độ trễ thấp, có thể rớt gói. Dùng cho video call, game, streaming.

**3-way handshake**
TCP thiết lập kết nối 3 bước: SYN → SYN-ACK → ACK. *Đời sống:* gọi điện xác nhận trước khi giao hàng.

**ICMP**
Giao thức "chẩn đoán" mạng, dùng bởi `ping` và `traceroute` để kiểm tra máy có sống không / đường đi ra sao.

## Tầng ứng dụng & dịch vụ

**HTTP / HTTPS**
Giao thức của Web. Client gửi request (GET/POST...), server trả response. HTTPS = HTTP + mã hóa TLS. Backend dùng nhiều nhất.

**TLS / SSL**
Lớp mã hóa biến HTTP → HTTPS. Handshake trao đổi khóa để dữ liệu đi trên đường không ai đọc trộm được → ổ khóa 🔒.

**DNS (Domain Name System)**
"Danh bạ" Internet: dịch tên miền (`google.com`) → IP. Phân cấp: Root → TLD (`.com`) → Authoritative server.

**A record / CNAME**
Bản ghi DNS. **A record** trỏ domain → một IP cụ thể. **CNAME** trỏ domain → một domain khác (bí danh). Dùng khi gắn custom domain cho Cloud Run.

**SMTP / IMAP / POP3**
Giao thức email. SMTP để **gửi**; IMAP/POP3 để **nhận/đọc**.

**SSH (Secure Shell)**
Giao thức điều khiển server từ xa qua kết nối mã hóa (port 22). Vd `gcloud compute ssh` vào VM.

**FTP / SFTP**
Truyền file giữa máy và server. SFTP = bản mã hóa an toàn (đi qua SSH).

## Mô hình

**Client – Server**
Client *hỏi* (trình duyệt, app), Server *trả lời* (máy chạy 24/7). Backend = phần server.

**P2P (Peer-to-peer)**
Các máy ngang hàng vừa hỏi vừa trả lời, không cần server trung tâm. Vd BitTorrent, blockchain.

**Request / Response**
Một chu trình: client gửi yêu cầu (request) → server trả kết quả (response). Đơn vị giao tiếp cơ bản của web.
