# 02 — HTTP là gì?

> Bài 2 series [Road to Backend Developer](https://roadmap.sh/backend). Tiếp nối [[01 - How does the internet work?]] — giờ mổ xẻ **giao thức mà backend bạn dùng NHIỀU NHẤT**.
>
> 📖 Thuật ngữ: [[Glossary - Networking]].

## 0. Một câu để nhớ

> **HTTP (HyperText Transfer Protocol)** = **bộ LUẬT để trình duyệt (client) "hỏi" và server "trả lời"** khi trao đổi dữ liệu trên web. Client gửi **request**, server trả **response**. Hết.

**Tách nghĩa cái tên (nói lên đúng chức năng):**

| Chữ | Nghĩa | Trong HTTP |
|---|---|---|
| **HyperText** | Siêu văn bản | Văn bản có **link** bấm nhảy được (= trang web HTML) |
| **Transfer** | Chuyển / truyền | **Vận chuyển** dữ liệu đó qua mạng (server ↔ client) |
| **Protocol** | Bộ quy tắc / nghi thức | Theo **luật chung** để 2 máy hiểu nhau |

→ Ghép lại: HTTP = *"bộ quy tắc để **chuyển** siêu văn bản (trang web) qua mạng"*. (Ngày nay chuyển cả ảnh, video, JSON... chứ không chỉ HTML, nhưng tên giữ từ thời đầu 1991.)

Nhớ bài 01: HTTP là một **[[Glossary - Networking#Protocol|giao thức]]** ở **tầng 4 (Application)**, chạy **trên TCP** (hoặc TCP mã hóa TLS = HTTPS). Nó lo "gửi CÁI GÌ", còn TCP/IP lo "gửi tới đâu, có đáng tin không".

---

## 1. Ví dụ đời sống: gọi món ở nhà hàng 🍽️

| Nhà hàng                            | HTTP                                  |
| ----------------------------------- | ------------------------------------- |
| Khách gọi món ("cho tôi phở")       | **Request** (client hỏi)              |
| Tờ order (ghi rõ món gì, bàn nào)   | **Request** (method + path + headers) |
| Bếp nấu xong bưng ra                | **Response** (server trả về)          |
| Món ăn trên đĩa                     | **Body** (nội dung: HTML/JSON...)     |
| Phiếu "đã xong / hết món / sai bàn" | **Status code** (200 / 404...)        |

**Ý chính:** HTTP là **một chu trình HỎI–ĐÁP (request–response)**. Client hỏi 1 câu → server đáp 1 câu → xong. Muốn thêm thì hỏi câu mới.

---

## 2. Request — client "hỏi" cái gì?

Một HTTP **request** gồm 4 phần (nguồn: [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)):

```
GET /products/123 HTTP/1.1        ← ① method + ② path + ③ version
Host: shop.example.com            ┐
Accept: application/json          ├─ ④ headers (thông tin thêm)
Authorization: Bearer abc123      ┘
                                  ← (dòng trống)
{ "note": "..." }                 ← ⑤ body (chỉ POST/PUT... mới có)
```

| Phần | Là gì | Ví dụ |
|---|---|---|
| **① Method** | Động từ — muốn LÀM GÌ | `GET`, `POST`, `PUT`, `DELETE` |
| **② Path** | Đường dẫn tới tài nguyên | `/products/123` |
| **③ Version** | Phiên bản HTTP | `HTTP/1.1` |
| **④ Headers** | Thông tin kèm theo (metadata) | `Host`, `Accept`, `Authorization` |
| **⑤ Body** | Dữ liệu gửi lên (nếu có) | JSON của form, file... |

### 2.1. HTTP Methods (động từ) — muốn làm gì với tài nguyên

Nguồn: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) + [roadmap.sh](https://roadmap.sh/backend).

| Method | Việc | Ví như (nhà hàng / CRUD) | An toàn? | Idempotent? |
|---|---|---|---|---|
| **GET** | **Lấy** dữ liệu (Read) | Xem thực đơn | ✅ | ✅ |
| **POST** | **Tạo** mới (Create) | Gọi thêm 1 món | ❌ | ❌ |
| **PUT** | **Thay** toàn bộ (Update/replace) | Đổi cả order | ❌ | ✅ |
| **PATCH** | **Sửa 1 phần** (Update partial) | Sửa 1 dòng order | ❌ | ❌ |
| **DELETE** | **Xóa** (Delete) | Hủy món | ❌ | ✅ |
| **HEAD** | Như GET nhưng **không lấy body** (chỉ headers) | Hỏi "còn món không" khỏi bưng ra | ✅ | ✅ |
| **OPTIONS** | Hỏi "server hỗ trợ gì" | Hỏi quán nhận thẻ hay tiền mặt | ✅ | ✅ |

- **An toàn (safe)** = **không đổi** dữ liệu trên server (chỉ đọc). GET/HEAD an toàn.
- **Idempotent** = làm **1 lần hay 10 lần kết quả như nhau**. DELETE 1 sản phẩm 10 lần → vẫn "đã xóa" (idempotent). Nhưng POST 10 lần → tạo 10 đơn (KHÔNG idempotent) → đây là lý do bấm "Đặt hàng" 2 lần dễ tạo 2 đơn.

> **CRUD ↔ HTTP:** Create=POST, Read=GET, Update=PUT/PATCH, Delete=DELETE. Đây là nền tảng của **REST API** (học ở bài sau).

---

## 3. Response — server "đáp" cái gì?

```
HTTP/1.1 200 OK                   ← ① version + ② status code + message
Content-Type: application/json    ┐
Content-Length: 245               ├─ ③ headers
Cache-Control: max-age=3600       ┘
                                  ← (dòng trống)
{ "id": 123, "name": "Áo thun" }  ← ④ body (nội dung trả về)
```

### 3.1. Status Code — "phiếu kết quả" 3 chữ số

Chữ số **đầu tiên** cho biết nhóm kết quả (nguồn: [MDN Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)):

| Nhóm | Nghĩa | Ví như |
|---|---|---|
| **1xx** | Thông tin (hiếm gặp) | "Đang xử lý..." |
| **2xx** | ✅ **Thành công** | "Xong rồi đây!" |
| **3xx** | ↪️ **Chuyển hướng** | "Món đó chuyển sang chỗ khác" |
| **4xx** | ❌ **Lỗi phía CLIENT** (bạn hỏi sai) | "Bạn gọi món không có / thiếu tiền" |
| **5xx** | 💥 **Lỗi phía SERVER** (bếp cháy) | "Bếp gặp sự cố, không phải lỗi bạn" |

**Các mã hay gặp (phải thuộc):**

| Mã | Ý nghĩa | Khi nào |
|---|---|---|
| **200 OK** | Thành công | GET/PUT ok |
| **201 Created** | Đã tạo mới | POST tạo xong |
| **204 No Content** | Ok nhưng không có body | DELETE xong |
| **301 Moved Permanently** | Chuyển hẳn sang URL mới | Đổi domain |
| **302 Found** | Chuyển tạm | Redirect login |
| **304 Not Modified** | Chưa đổi, dùng cache đi | Tiết kiệm băng thông |
| **400 Bad Request** | Request sai cú pháp/thiếu field | Client gửi ẩu |
| **401 Unauthorized** | Chưa đăng nhập/thiếu token | Cần auth |
| **403 Forbidden** | Đã đăng nhập nhưng **không có quyền** | Không đủ quyền |
| **404 Not Found** | Không tìm thấy tài nguyên | URL sai |
| **429 Too Many Requests** | Gọi quá nhiều (rate limit) | Spam API |
| **500 Internal Server Error** | Server crash / bug | Code backend lỗi |
| **502 Bad Gateway** | Server trung gian nhận response lỗi | Proxy/upstream hỏng |
| **503 Service Unavailable** | Server quá tải / bảo trì | Down tạm |

> **Mẹo nhớ 401 vs 403:** 401 = *"bạn là AI?"* (chưa đăng nhập). 403 = *"biết bạn rồi, nhưng KHÔNG cho"* (thiếu quyền).

---

## 4. Headers — "ghi chú kèm theo" 📋

Headers = các dòng `Key: Value` mang **thông tin phụ** về request/response (không phải nội dung chính). Ví như **ghi chú trên tờ order**: "ít cay, mang về, bàn số 5".

Vài header hay gặp:

| Header | Ở đâu | Để làm gì |
|---|---|---|
| `Host` | request | Web nào (1 server chứa nhiều web) |
| `Content-Type` | cả 2 | Kiểu dữ liệu body: `application/json`, `text/html` |
| `Authorization` | request | Token xác thực (`Bearer ...`) |
| `Accept` | request | Client muốn nhận kiểu gì |
| `Cache-Control` | response | Cache bao lâu |
| `Set-Cookie` | response | Server gắn cookie vào máy client |
| `User-Agent` | request | Client là trình duyệt/thiết bị nào |

> **Extensible:** HTTP mạnh vì **headers mở rộng được** — client & server chỉ cần "thỏa thuận" một header mới là thêm được tính năng, không phải đổi cả giao thức.

---

## 5. HTTP là STATELESS (không nhớ) — điểm CỐT LÕI ⭐

> MDN: *"HTTP is stateless: there is no link between two requests"* — **mỗi request là độc lập, server KHÔNG nhớ gì về request trước.**

**Ví dụ:** bạn gửi request 1 "đăng nhập", rồi request 2 "xem giỏ hàng". Với HTTP thuần, server ở request 2 **không hề biết bạn là ai** — nó quên sạch bạn vừa đăng nhập ở request 1.

*Ví đời sống:* như nói chuyện với **người mất trí nhớ tức thời** — mỗi câu hỏi phải giới thiệu lại từ đầu "tôi là Minh, tôi vừa đăng nhập...".

### Vậy sao web vẫn "nhớ" bạn đã đăng nhập? → Cookie / Token

HTTP **stateless nhưng KHÔNG sessionless.** Giải bằng cách: mỗi request **tự đính kèm bằng chứng "tôi là ai"**:
- **Cookie:** server gửi `Set-Cookie` → trình duyệt lưu → **mỗi request sau tự động gửi cookie kèm** → server đọc cookie biết bạn là ai.
- **Token (JWT...):** client gắn `Authorization: Bearer <token>` vào **mỗi** request.

→ Không phải server "nhớ", mà là **client nhắc lại danh tính ở mỗi lần hỏi.** Đây là nền tảng của **đăng nhập, giỏ hàng, session** (rất hợp cho e-commerce như Shopify — MDN nhắc thẳng "shopping baskets").

### ⚠️ "Stateless" vs "keep-alive" — nghe mâu thuẫn nhưng KHÔNG

Thắc mắc hay: bài 01 nói TCP **keep-alive** giữ connection mở, request sau khỏi bắt tay lại → vậy sao lại bảo HTTP **không nhớ gì**? → Vì đây là **2 loại "nhớ" ở 2 TẦNG khác nhau:**

| | TCP keep-alive (tầng 3) | HTTP stateless (tầng 4) |
|---|---|---|
| Nhớ **"đường ống còn mở"** | ✅ Có | — |
| Nhớ **"bạn là ai, đã login chưa, giỏ có gì"** | ❌ Không | ❌ Không |

**"Connection mở" ≠ "nhớ bạn là ai".** TCP giữ ống mở chỉ nghĩa *"cái ống vật lý chưa đóng, khỏi bắt tay lại"* — nó KHÔNG chứa thông tin bạn là ai. HTTP stateless nghĩa *"server xử xong mỗi request là quên sạch danh tính bạn"*. Hai cái độc lập: **ống vẫn mở, nhưng server vẫn quên bạn.**

> **Ví đời sống 📞:** gọi tới tổng đài mà nhân viên **mất trí nhớ tức thời**:
> - *Đường dây chưa cúp (khỏi quay số lại)* = **TCP keep-alive**. ✅
> - *Nhưng nhân viên quên sạch sau mỗi câu* = **HTTP stateless**. Câu 1 bạn nói "tôi là Minh", câu 2 (cùng cuộc gọi, chưa cúp!) nhân viên vẫn hỏi lại *"anh là ai?"*.
> → Dây chưa cúp KHÔNG có nghĩa nhân viên nhớ bạn → nên **mỗi câu vẫn phải tự xưng tên** (= mỗi request tự mang cookie/token).

> 🔑 **Một câu khắc cốt:** *Keep-alive tiết kiệm việc "gọi lại"; stateless bắt bạn "giới thiệu lại" mỗi câu. Hai việc khác tầng, không đụng nhau.*

### Vì sao stateless lại TỐT? (nghe như nhược điểm nhưng là lựa chọn thiên tài)

Thoạt nhìn "server không nhớ gì" giống nhược điểm. Thực ra đây là **đánh đổi cực lời** — chính nó cho phép web phục vụ hàng tỷ người. Nếu làm ngược lại (**stateful** — server tự nhớ) sẽ vướng 4 vấn đề chí mạng:

**1. Không scale nổi ⭐ (lý do số 1).** Web lớn chạy **nhiều server giống nhau** (Cloud Run bật 50 bản sao). Nếu server tự nhớ:
```
Request 1 (login)    → rơi vào Server A → A nhớ "Minh đã login"
Request 2 (giỏ hàng) → rơi vào Server B → B ngơ ngác "Minh là ai???"
```
→ request 2 có thể rơi vào server khác (chưa từng thấy bạn). Muốn chạy phải **ép bạn luôn về đúng Server A** (*sticky session*) → rối, mất cân bằng tải.
→ **Stateless:** danh tính nằm trong **token/cookie của chính request** → **server nào xử cũng được**, thêm bao nhiêu server cũng chạy.

**2. Server chết → không mất gì.** Stateful: A giữ state trong RAM, **A crash → bay sạch** ai đang login/giỏ hàng. Stateless: A chết thì request nhảy sang B, chẳng mất gì (state không nằm ở A) → **chịu lỗi tốt**.

**3. Nhẹ RAM.** Stateful: 1 triệu người online → giữ **1 triệu "hồ sơ" trong RAM** cùng lúc → phình, đắt. Stateless: server **không giữ gì** giữa các request → nhẹ tênh.

**4. Đơn giản, ít bug.** Stateful phải đồng bộ state giữa các server, xử lý xóa/lệch state... → cả núi bug. Stateless bỏ hết.

> **Ví đời sống 🏪:**
> - *Stateful = quán quen có ông chủ nhớ mặt khách:* tiện, nhưng **ông chủ nghỉ 1 hôm → cả quán tê liệt**; mở chi nhánh 2 → nhân viên mới không nhớ khách chi nhánh 1; đông quá → nhớ không xuể.
> - *Stateless = quán bất kỳ, khách cầm **THẺ THÀNH VIÊN**:* chìa thẻ mỗi lần mua (= token/cookie mỗi request) → **bất kỳ nhân viên, bất kỳ chi nhánh** đọc thẻ là phục vụ được. Mở 1000 chi nhánh vẫn ngon, nhân viên nghỉ cũng chẳng sao.

**Cái giá phải trả (nhỏ, đã có cách xử):**
- Mỗi request phải **mang lại token/cookie** → tốn vài trăm byte → không đáng gì.
- Cần lưu **state thật** (giỏ hàng, session dài) → để ở **kho dùng chung** mọi server đọc được: **database / Redis / Firestore** — KHÔNG nhét vào RAM 1 server.

> 🔑 **Chốt:** Stateless = "server nào cũng phục vụ được bạn" → thêm server thoải mái, chết 1 con không sao, nhẹ, đơn giản. Đây chính là thứ cho web scale tới tỷ người. Cần nhớ state → để ở **kho chung (DB/Redis/Firestore)**, không để trong 1 server. Đúng mô hình **Cloud Run auto-scale**.

---

## 6. Các phiên bản HTTP (tiến hóa qua thời gian)

Nhớ bài 01 (keep-alive, connection): đây là lý do các version ra đời.

| Version             | Điểm chính                                                   | Vấn đề giải quyết                                                                                                                   |
| ------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **HTTP/0.9** (1991) | Chỉ có `GET`, trả HTML trần                                  | Sơ khai                                                                                                                             |
| **HTTP/1.0** (1996) | Thêm **headers**, status code, method khác                   | Mở rộng được                                                                                                                        |
| **HTTP/1.1** (1997) | **Keep-alive** (giữ connection), pipelining                  | Khỏi bắt tay TCP lại mỗi request ([[01 - How does the internet work?#3.1. TCP vs UDP (tầng Transport) — điểm cốt lõi\|nhớ bài 01]]) |
| **HTTP/2** (2015)   | **Multiplexing** — nhiều request song song trên 1 connection | Hết cảnh xếp hàng (head-of-line)                                                                                                    |
| **HTTP/3** (2022)   | Chạy trên **UDP (QUIC)** thay TCP                            | Nhanh hơn, ít trễ khi mạng chập chờn                                                                                                |

> Xu hướng: mỗi đời đều nhắm **giảm độ trễ + tái dùng kết nối tốt hơn**. Bản chất request/response, method, status code **vẫn giữ nguyên** qua mọi version — nên học kỹ mục 2–5 là dùng được hết.

### 6.1. Multiplexing & Vòng đời Connection (đào sâu)

> Nguồn: [Cloudflare – connection coalescing](https://blog.cloudflare.com/connection-coalescing-experiments/), [daniel.haxx.se – HTTP/2 coalescing](https://daniel.haxx.se/blog/2016/08/18/http2-connection-coalescing/), [chromium-dev](https://groups.google.com/a/chromium.org/g/chromium-dev/c/S3TEvmRWcNE).

### Multiplexing hoạt động thế nào?

**HTTP/1.1:** trên 1 connection, request đi **tuần tự** — request 2 phải chờ request 1 xong (*head-of-line blocking*). Nên trình duyệt phải **mở ~6 connection/origin** cho đỡ chờ → tốn.

**HTTP/2 — multiplexing:** cắt mỗi request/response thành các **frame nhị phân** nhỏ, mỗi frame **dán nhãn "thuộc stream nào"** (1 stream = 1 cặp request-response). Frame của nhiều stream **đan xen** chạy trên **CÙNG 1 connection**, đầu kia ráp lại theo nhãn.
```
1 connection TCP:
 ...[R1][R3][R1][R2][R3][R2]...   ← nhiều request đan xen, KHÔNG xếp hàng chờ nhau
```
> *Đời sống:* HTTP/1.1 = đường **1 làn** (xe trước chậm → cả đoàn kẹt). HTTP/2 = **nhiều làn trên 1 con đường** — request chạy song song. Chìa khóa: mỗi gói **dán nhãn số đơn** nên trộn chung vẫn phân loại lại được ở đích.

### Mở 2 tab cùng web (vd 2 tab Facebook) → 1 hay 2 connection?

**→ Chung 1 connection (với HTTP/2).** Trình duyệt dùng **1 connection cho mỗi ORIGIN**; origin = **scheme + host + port** (vd `https://facebook.com:443`).
- 2 tab FB = **cùng origin** → **dùng chung đúng 1 connection HTTP/2**; request từ cả 2 tab ghép luồng (multiplex) trên đó.
- HTTP/1.1: trình duyệt giữ **1 "hồ bơi" ~6 connection/origin**, và **nhiều tab xài chung hồ bơi** (không phải mỗi tab 6 cái riêng).

→ Đúng trực giác: **cùng nguồn (origin) thì request từ nhiều tab dùng chung connection.** (Chrome/Firefox làm vậy; cửa sổ ẩn danh thì tách riêng.)

### Vòng đời 1 connection: mở & đóng khi nào?

| Giai đoạn | Khi nào |
|---|---|
| **MỞ** | Có request đầu tiên tới origin mà **chưa có connection sẵn** (hoặc pool đầy/bận) → mở mới: DNS → TCP → TLS |
| **GIỮ (tái dùng)** | Còn request qua lại, hoặc còn trong *keep-alive idle timeout* (rảnh nhưng chưa hết giờ thì giữ lại để dùng tiếp) |
| **ĐÓNG** | (bất kỳ điều nào) • **Idle timeout** — rảnh quá lâu (server/browser tự đóng) • Server gửi **`Connection: close`** (HTTP/1.1) hoặc khung **`GOAWAY`** (HTTP/2) • **Đóng tab/thoát trình duyệt** (thường không tức thì) • **Lỗi mạng / đổi mạng** (WiFi→4G) • Hết đời tối đa / server restart |

> 🔑 **Chốt:** Multiplexing = nhiều request đan xen (qua "stream" có nhãn) trên **1 connection** → hết xếp hàng. **Nhiều tab cùng origin → chung 1 connection** (HTTP/2). Connection **mở** khi cần lần đầu → **giữ** để tái dùng → **đóng** khi rảnh quá lâu / server bảo đóng / đổi mạng / thoát.

### 6.2. Connection dùng chung được giữa nhiều MÁY không? → KHÔNG

Hiểu lầm phổ biến: "cùng mạng/cùng đường đi thì nhiều máy xài chung connection?" → **KHÔNG.** Cái "tái dùng connection" (6.1) chỉ áp dụng **trong nội bộ 1 máy**.

**Vì sao?** Một connection được định danh **duy nhất** bởi bộ 4 (*4-tuple*): `(IP nguồn, Port nguồn, IP đích, Port đích)`.
```
Máy bạn → FB:  (42.1.1.5 : 54321 , 157.240.1.1 : 443)   ← connection của BẠN
Máy vợ → FB:   (42.1.1.8 : 60111 , 157.240.1.1 : 443)   ← connection KHÁC (IP nguồn khác)
```
→ **IP nguồn khác → 2 connection khác hẳn.** Server nhìn 2 bộ 4-tuple → coi là 2 kết nối riêng, không trộn.

**Đừng lẫn "connection" với "đường đi vật lý":**

| | Chung được? | Là gì |
|---|---|---|
| **Đường đi vật lý** (dây cáp, router, ISP) | ✅ Có — cả xóm chung tuyến cáp/router | Con đường packet chạy qua |
| **Connection** (kết nối logic end-to-end) | ❌ Không — mỗi máy 1 cái riêng | "Cuộc hội thoại" riêng 1 máy ↔ server |

> **Ví đời sống 📞:** nhiều nhà chung 1 bó **cáp** ra tổng đài (chung đường ✅), nhưng nhà A gọi FB và nhà B gọi FB là **2 cuộc gọi riêng** (connection riêng), người này không nghe được cuộc của người kia. → *Chung "đường" ≠ chung "cuộc gọi".* Packet nhiều máy đan xen chung dây (bài 01 — đường truyền dùng chung), nhưng mỗi máy vẫn có connection riêng nhờ 4-tuple khác nhau.

> 🔑 **Chốt:** Mỗi máy = connection riêng (theo 4-tuple), **không chia sẻ sang máy khác** dù chung mạng/đường. Tái dùng connection chỉ trong **1 máy** (nhiều tab/request). Nhiều máy chung **đường vật lý** được, chung **connection** thì không.

---

## 7. HTTP vs HTTPS (nhắc lại từ bài 01)

- **HTTP** = đi **trần**, ai chặn đọc được.
- **HTTPS** = HTTP + mã hóa **[[Glossary - Networking#TLS / SSL|TLS]]** → 🔒. (Chi tiết: [[01 - How does the internet work?#5.1. Web: HTTP vs HTTPS khác gì?\|bài 01 mục 5.1]].)

Ngày nay **luôn dùng HTTPS**. Shopify bắt buộc HTTPS cho webhook/redirect.

---

## 8. Liên hệ công việc: Shopify app + Firebase/GCP 💼

- **Mọi API bạn viết = một HTTP endpoint.** Merchant/app gọi `GET /api/points`, `POST /api/redeem`... → backend bạn (Cloud Run / Cloud Functions) đọc **method + path + body**, xử lý, trả **status code + JSON**.
- **Chọn đúng method & status code** là chuẩn nghề: tạo đơn → `POST` trả `201`; không tìm thấy → `404`; thiếu token → `401`; hết quyền → `403`; lỗi server → `500`. Trả sai mã → client/đối tác tích hợp sai theo.
- **Webhook Shopify** = Shopify gửi `POST` (HTTP request) tới URL bạn, body là JSON đơn hàng. Bạn phải trả **`200`** nhanh, không thì Shopify **retry** (gửi lại nhiều lần).
- **Stateless + Cloud Run:** vì HTTP stateless, Cloud Run auto-scale nhiều instance thoải mái — đừng lưu trạng thái người dùng trong RAM 1 instance, hãy để trong **token/cookie hoặc Firestore**.
- **Rate limit:** gọi API Shopify quá nhiều → nhận **`429`** → phải retry có backoff.
- **`Content-Type: application/json`**, **`Authorization: Bearer`** là 2 header bạn set/đọc hằng ngày.

---

## 9. Tự kiểm tra

1. Một HTTP request gồm những phần nào? Response gồm gì?
2. GET vs POST khác gì? "Idempotent" nghĩa là gì, DELETE có idempotent không?
3. Phân biệt 4xx và 5xx. 401 vs 403 khác gì?
4. "HTTP stateless" nghĩa là sao? Vậy web nhớ bạn đăng nhập bằng cách nào?
5. Vì sao stateless giúp dễ scale (liên hệ Cloud Run)?
6. HTTP/1.1 thêm gì so với 1.0? (gợi ý: connection)

Xem tận mắt (terminal):
```bash
curl -v https://api.github.com        # xem request + response + headers + status
curl -I https://google.com            # chỉ xem headers (method HEAD)
curl -X POST https://httpbin.org/post -d '{"a":1}' -H "Content-Type: application/json"
```

---

**Bài tiếp theo:** *"What is Domain Name / DNS / Hosting"* — mấy thứ quanh việc đưa web lên mạng.

---

## Nguồn tham khảo
- [MDN — An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) (nguồn chính)
- [MDN — HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [roadmap.sh — Backend Developer Roadmap](https://roadmap.sh/backend)
