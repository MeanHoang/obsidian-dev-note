# 03 — Encryption: giấu nội dung

> **TL;DR:** Encryption biến dữ liệu thành thứ vô nghĩa, và **chỉ người có khoá mới đọc ngược được**. Có 2 loại: **đối xứng** (một khoá, nhanh) và **bất đối xứng** (cặp khoá công khai/bí mật, chậm). HTTPS dùng **cả hai**: bất đối xứng để trao khoá, đối xứng để truyền dữ liệu.

Series: [[00 - Roadmap - Encode, Hash, Encrypt]]
Anh em: [[02 - Hashing - Dau van tay mot chieu]] · [[01 - Encoding - Doi cach bieu dien du lieu]]

---

## 🎯 Khác hash chỗ nào

```
Hash:        dữ liệu ──▶ hash           (KHÔNG có đường về)
Encryption:  dữ liệu ──▶ ciphertext ──▶ dữ liệu   (có đường về, cần khoá)
```

| | Hash | Encryption |
| --- | --- | --- |
| Đảo ngược | Không bao giờ | Có, nếu có khoá |
| Độ dài output | Cố định | ≈ độ dài input |
| Dùng để | So sánh, phát hiện sửa đổi | Giấu nội dung |
| Ví dụ dùng | Mật khẩu, checksum | Tin nhắn, file, HTTPS |

---

## 1️⃣ Mã hoá đối xứng (symmetric)

**Một khoá duy nhất** dùng cho cả khoá và mở.

```
       khoá K                    khoá K
         │                          │
"Xin chào" ──[encrypt]──▶ a7f29c41 ──[decrypt]──▶ "Xin chào"
```

Giống **ổ khoá cửa nhà**: cùng một chìa để khoá và mở. Ai có chìa thì vào được.

| Thuật toán | Ghi chú |
| --- | --- |
| **AES-256-GCM** | ⭐ Chuẩn hiện nay. GCM còn kèm luôn kiểm tra toàn vẹn |
| **ChaCha20-Poly1305** | Nhanh trên thiết bị không có tăng tốc phần cứng (mobile) |
| ❌ DES, 3DES, RC4 | Đã lỗi thời, đừng dùng |

**Ưu:** rất nhanh — mã hoá được gigabyte dữ liệu.
**Nhược:** **làm sao đưa khoá cho người kia?** Gửi qua mạng thì hacker chặn được luôn cả khoá. Đây gọi là **bài toán trao khoá** — và nó dẫn tới loại thứ hai.

```js
// Node.js — AES-256-GCM
const iv = crypto.randomBytes(12);                       // số dùng một lần
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();                         // kiểm tra toàn vẹn
// Muốn giải mã cần đủ: key + iv + tag
```

> ⚠️ **IV (initialization vector)** phải **khác nhau mỗi lần mã hoá**, nếu không cùng một nội dung sẽ ra cùng ciphertext → lộ thông tin. IV không cần bí mật, lưu chung với ciphertext được.

---

## 2️⃣ Mã hoá bất đối xứng (asymmetric / public key)

**Hai khoá thành một cặp**, sinh ra cùng lúc, liên kết toán học với nhau:

- **Public key** — đưa cho cả thế giới
- **Private key** — giữ chết, không đưa ai

Điểm thần kỳ: **khoá này khoá thì chỉ khoá kia mở được.**

```
Ai đó muốn gửi bí mật CHO BẠN:
   "Xin chào" ──[khoá bằng PUBLIC của bạn]──▶ a7f29c41
   a7f29c41   ──[mở bằng PRIVATE của bạn]───▶ "Xin chào"
   → cả thế giới gửi được cho bạn, chỉ mình bạn đọc được
```

Ẩn dụ: **hòm thư có khe bỏ thư**. Ai cũng bỏ thư vào được (public key), chỉ người có chìa hòm mới lấy ra được (private key).

| Thuật toán | Ghi chú |
| --- | --- |
| **RSA** | Cổ điển, khoá dài (2048–4096 bit) |
| **ECC** (ECDSA, Ed25519, X25519) | ⭐ Khoá ngắn hơn nhiều mà an toàn tương đương → nhanh hơn |

**Ưu:** giải quyết bài toán trao khoá.
**Nhược:** **chậm** — chậm hơn AES hàng trăm lần. Không ai mã hoá cả file video bằng RSA.

---

## 3️⃣ Chữ ký số — dùng cặp khoá theo chiều ngược lại

Đảo vai hai khoá thì được một thứ khác hẳn:

```
BẠN muốn chứng minh "đúng là tôi viết":
   hash(tài liệu) ──[ký bằng PRIVATE của bạn]──▶ chữ ký
   
Người khác kiểm tra:
   chữ ký ──[mở bằng PUBLIC của bạn]──▶ hash  ⟷ so với hash tài liệu họ tự tính
   khớp → đúng là bạn viết, và tài liệu chưa bị sửa
```

| | Mã hoá | Chữ ký số |
| --- | --- | --- |
| Ký bằng | Public key người nhận | **Private key** người gửi |
| Mở bằng | Private key người nhận | **Public key** người gửi |
| Mục đích | Giấu nội dung | Chứng minh danh tính + toàn vẹn |

**So với HMAC** ([[02 - Hashing - Dau van tay mot chieu]]):

| | HMAC | Chữ ký số |
| --- | --- | --- |
| Khoá | 1 secret dùng chung | Cặp public/private |
| Ai xác minh được | Chỉ người biết secret | **Bất kỳ ai** (có public key) |
| Chống chối bỏ | Không (2 bên đều ký được) | **Có** (chỉ 1 người có private key) |
| Tốc độ | Rất nhanh | Chậm hơn |

👉 Webhook nội bộ 2 bên → HMAC đủ. Cần bên thứ ba xác minh → chữ ký số.

---

## 4️⃣ HTTPS / TLS — ghép cả hai lại

Đây là chỗ mọi thứ ráp vào nhau, và là câu trả lời cho *"TLS làm gì"* ở [[01 - Tu URL den Pixel - Vong doi mot trang web]].

**Vấn đề:** đối xứng thì nhanh nhưng không trao khoá được. Bất đối xứng trao khoá được nhưng chậm.
**Lời giải:** dùng bất đối xứng **chỉ để thoả thuận một khoá đối xứng**, rồi dùng khoá đó cho toàn bộ phần còn lại.

```
┌─ BẮT TAY (handshake) — dùng BẤT ĐỐI XỨNG, vài chục ms ────────┐
│ 1. Client: "chào, tôi hỗ trợ các thuật toán A, B, C"          │
│ 2. Server: gửi CHỨNG CHỈ (chứa public key + chữ ký của CA)    │
│ 3. Client: kiểm tra chứng chỉ có hợp lệ không                 │
│ 4. Hai bên trao đổi (ECDHE) → cùng tính ra MỘT KHOÁ CHUNG     │
│    ⚠️ khoá này KHÔNG hề đi qua mạng — mỗi bên tự tính ra      │
└───────────────────────────────────────────────────────────────┘
┌─ TRUYỀN DỮ LIỆU — dùng ĐỐI XỨNG (AES), nhanh ─────────────────┐
│ 5. Mọi HTTP request/response từ đây mã hoá bằng khoá chung    │
└───────────────────────────────────────────────────────────────┘
```

### Chứng chỉ (certificate) giải quyết chuyện gì

Có khoá rồi thì vẫn còn một lỗ hổng: **làm sao biết public key này đúng là của `shopify.com`, không phải của hacker giả mạo?**

→ **Certificate Authority (CA)** — bên thứ ba mà browser tin sẵn (Let's Encrypt, DigiCert…). CA **ký** vào chứng chỉ của website bằng private key của CA. Browser có sẵn public key của các CA nên kiểm tra được chữ ký đó.

```
Browser tin CA  →  CA ký cho shopify.com  →  Browser tin shopify.com
```

Đó là lý do trang dùng chứng chỉ tự ký (self-signed) bị báo đỏ: chữ ký có đấy, nhưng không ai browser tin đứng ra bảo lãnh.

### Forward secrecy

TLS hiện đại dùng **ECDHE** — khoá phiên được sinh mới cho **từng phiên** rồi vứt đi. Hacker ghi lại toàn bộ traffic hôm nay, mai lấy được private key của server thì vẫn **không giải mã được traffic cũ**. Gọi là *forward secrecy*.

---

## 5️⃣ JWT — chỗ hay bị hiểu nhầm nhất

JWT trông như thế này:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
└────── header ─────┘ └───── payload ───┘ └───────────── signature ─────────────┘
```

Ba phần nối bằng dấu `.`, hai phần đầu là **base64url** ([[01 - Encoding - Doi cach bieu dien du lieu]]).

> 🚨 **JWT thông thường KHÔNG mã hoá.** Nó chỉ được **ký**. Payload ai cũng decode đọc được — dán vào jwt.io là thấy hết.

```js
atob('eyJ1c2VySWQiOjQyfQ')   // '{"userId":42}'   ← đọc được ngay, không cần khoá
```

| JWT làm được | JWT KHÔNG làm được |
| --- | --- |
| Chứng minh token do server phát ra | Giấu nội dung bên trong |
| Phát hiện token bị sửa | Bảo mật dữ liệu nhạy cảm |

👉 **Đừng bỏ số CMND, số thẻ, mật khẩu vào payload JWT.** Cần giấu thật thì dùng **JWE** (JWT có mã hoá) hoặc đơn giản là chỉ để `userId` rồi tra DB.

| Thuật toán ký | Loại | Ai xác minh được |
| --- | --- | --- |
| `HS256` | HMAC (secret dùng chung) | Chỉ người biết secret |
| `RS256` / `ES256` | Chữ ký số | Bất kỳ ai có public key |

> ⚠️ Lỗ hổng kinh điển: thư viện chấp nhận `alg: "none"` hoặc để client chọn thuật toán. Luôn **cố định thuật toán** ở phía server khi verify.

---

## 📊 Bảng tổng hợp

| | Đối xứng | Bất đối xứng | Hash |
| --- | --- | --- | --- |
| Số khoá | 1 | 2 (cặp) | 0 |
| Tốc độ | Rất nhanh | Chậm | Rất nhanh |
| Đảo ngược | Có (cần khoá) | Có (cần private) | **Không** |
| Ví dụ | AES-256-GCM | RSA, Ed25519 | SHA-256, Argon2 |
| Dùng ở | Dữ liệu lớn, DB, file | Trao khoá, chữ ký | Mật khẩu, checksum |
| Trong TLS | Truyền dữ liệu | Bắt tay + chứng chỉ | Kiểm tra toàn vẹn |

---

## ⚠️ Bẫy thường gặp

- **Tự cài đặt thuật toán mã hoá** — quy tắc số 1 của ngành: *đừng tự viết crypto*. Dùng thư viện đã được kiểm định.
- **Tái sử dụng IV/nonce** với AES-GCM → mất hoàn toàn tính bảo mật.
- **Nghĩ JWT là mã hoá** → nhét dữ liệu nhạy cảm vào payload.
- **Chấp nhận `alg` từ token** khi verify JWT → giả mạo được token.
- **Hardcode khoá trong source code** → lên Git là lộ vĩnh viễn (kể cả xoá commit sau).
- **Dùng ECB mode** cho AES → khối giống nhau ra ciphertext giống nhau, lộ cấu trúc dữ liệu.
- **Mã hoá mật khẩu thay vì băm** → xem [[02 - Hashing - Dau van tay mot chieu]].
- **Tin chứng chỉ self-signed trong production** hoặc tắt verify TLS "cho đỡ lỗi" → mở cửa cho man-in-the-middle.

---

## ✅ Nhớ 5 điều

1. **Đối xứng** = một khoá, nhanh. **Bất đối xứng** = cặp khoá, chậm, giải bài toán trao khoá.
2. **HTTPS dùng cả hai**: bất đối xứng để bắt tay, đối xứng để truyền dữ liệu.
3. **Chữ ký số** = ký bằng private, ai cũng xác minh bằng public. Ngược chiều với mã hoá.
4. **JWT chỉ được ký, không được mã hoá** — payload ai cũng đọc được.
5. **Đừng tự viết crypto.** Dùng thư viện chuẩn, cấu hình đúng.

---

## 📚 Nguồn

- [MDN — Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Cloudflare — How does TLS work / TLS handshake](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
- [RFC 8446 — TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [RFC 7519 — JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Node.js — `crypto`](https://nodejs.org/api/crypto.html)
