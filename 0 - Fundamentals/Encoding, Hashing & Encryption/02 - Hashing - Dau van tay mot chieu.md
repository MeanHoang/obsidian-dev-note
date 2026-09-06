# 02 — Hashing: dấu vân tay một chiều

> **TL;DR:** Hash biến dữ liệu bất kỳ (1 byte hay 10GB) thành một chuỗi **độ dài cố định**, và **không có đường về**. Nó không phải để giấu dữ liệu — nó để **so sánh** và **phát hiện thay đổi**. Đây là note quan trọng nhất series: làm sai chỗ này là lộ mật khẩu của toàn bộ người dùng.

Series: [[00 - Roadmap - Encode, Hash, Encrypt]]
Anh em: [[01 - Encoding - Doi cach bieu dien du lieu]] · [[03 - Encryption - Giau noi dung]]

---

## 🧠 Hash là gì

Một hàm nhận vào **bất cứ thứ gì**, nhả ra một chuỗi **dài cố định**:

```js
sha256("a")                    → ca978112ca1bbdca...  (64 ký tự hex)
sha256("Xin chào Việt Nam")    → 9f2c4a1e88b03d5f...  (64 ký tự hex)
sha256(<file phim 10GB>)       → 3b1a9d7e02cc84af...  (64 ký tự hex)
```

Ẩn dụ chuẩn nhất: **dấu vân tay**.

- Từ người → lấy được vân tay: dễ.
- Từ vân tay → dựng lại con người: **không thể**.
- Hai người khác nhau → vân tay khác nhau.
- Cùng một người → luôn ra đúng vân tay đó.

## 4 tính chất bắt buộc

| Tính chất | Nghĩa là | Vi phạm thì sao |
| --- | --- | --- |
| **Deterministic** | Cùng input → luôn cùng output | Không dùng để so sánh được |
| **Một chiều** (preimage resistance) | Từ hash không suy ngược ra input | Lộ dữ liệu gốc |
| **Chống va chạm** (collision resistance) | Khó tìm 2 input cho cùng 1 hash | Giả mạo được file/chữ ký |
| **Avalanche effect** | Đổi 1 bit input → hash đổi hoàn toàn | Đoán được input từ hash gần giống |

Minh hoạ avalanche — chỉ đổi chữ `a` thành `b`:

```
sha256("hello a") = 8f7a1e...c93b   ┐  hai chuỗi
sha256("hello b") = 2d40f8...17ae   ┘  không liên quan gì nhau
```

Đây là lý do bạn **không thể** "đoán dần" input từ hash.

---

## 🔢 Va chạm (collision) là gì

SHA-256 có `2^256` giá trị đầu ra — nhiều hơn số nguyên tử trong vũ trụ quan sát được. Nhưng input thì **vô hạn**. Nên về lý thuyết chắc chắn tồn tại 2 input khác nhau cho cùng 1 hash.

Vấn đề không phải "có tồn tại không" mà là **"tìm ra có dễ không"**.

| Thuật toán | Độ dài | Tình trạng |
| --- | --- | --- |
| **MD5** | 128 bit (32 hex) | 💀 **Vỡ**. Tìm va chạm trong vài giây trên laptop |
| **SHA-1** | 160 bit (40 hex) | 💀 **Vỡ** (Google "SHAttered" 2017). Đã bị khai tử |
| **SHA-256** | 256 bit (64 hex) | ✅ An toàn, chuẩn hiện tại |
| **SHA-512** | 512 bit (128 hex) | ✅ An toàn |
| **SHA-3** | tuỳ chọn | ✅ An toàn, thiết kế khác hẳn SHA-2 |
| **BLAKE3** | 256 bit | ✅ An toàn, rất nhanh |

> MD5 vẫn dùng được cho việc **không liên quan bảo mật**: checksum file tải về từ nguồn tin cậy, cache key, phát hiện file trùng. Nhưng đừng dùng cho bất cứ thứ gì cần chống kẻ tấn công.

---

## 🔐 Phần quan trọng nhất: mật khẩu

### Vì sao KHÔNG mã hoá mật khẩu

Đây là chỗ sai từ ngữ dẫn tới sai kỹ thuật. Rất nhiều người nói "mã hoá mật khẩu" — sai.

```
Mã hoá (encrypt):  giải ngược được nếu có khoá
                   → hacker lấy được DB + khoá = có sạch mật khẩu người dùng
Băm (hash):        không có đường về
                   → hacker lấy được DB vẫn không biết mật khẩu là gì
```

**Server không cần biết mật khẩu của bạn.** Nó chỉ cần biết *"chuỗi bạn vừa gõ có băm ra đúng cái đã lưu không"*. Vậy nên lưu hash là đủ.

```
Lúc đăng ký:   hash("meomeo123")  →  lưu vào DB
Lúc đăng nhập: hash(chuỗi vừa gõ) →  so với cái trong DB
                                     khớp → cho vào
```

### Vấn đề 1: hash thường quá NHANH

SHA-256 được thiết kế để **nhanh** (băm file 10GB trong vài giây). Với mật khẩu, nhanh là **thảm hoạ**:

```
GPU hiện đại thử SHA-256:  ~10 tỷ mật khẩu / giây
Mật khẩu 8 ký tự thường:   dò hết trong vài giờ
```

👉 Mật khẩu cần hàm **cố tình chậm** và **tốn RAM**:

| Hàm | Ghi chú |
| --- | --- |
| **Argon2id** | ⭐ Khuyến nghị hiện nay (thắng Password Hashing Competition) |
| **scrypt** | Tốt, tốn RAM nên GPU khó song song hoá |
| **bcrypt** | Vẫn ổn, phổ biến nhất, có sẵn ở mọi ngôn ngữ |
| **PBKDF2** | Chấp nhận được, dùng khi bị ràng buộc chuẩn (FIPS) |
| ❌ SHA-256 / MD5 trần | **Không bao giờ** dùng cho mật khẩu |

Các hàm này có **cost factor** — tăng lên là chậm gấp đôi. Máy mạnh lên thì tăng cost, không cần đổi thuật toán.

```js
// bcrypt — cost 12 nghĩa là 2^12 vòng lặp
await bcrypt.hash('meomeo123', 12);
// $2b$12$LQv3c1yqBWVHxkd0LHAkCO...
//  │   │  └─ salt (22 ký tự) + hash (31 ký tự)
//  │   └──── cost factor
//  └──────── phiên bản thuật toán
```

> 💡 Chú ý: chuỗi bcrypt **đã chứa sẵn salt và cost bên trong**. Bạn không cần lưu riêng cột salt.

### Vấn đề 2: rainbow table và mật khẩu trùng

Nếu chỉ `hash(mật khẩu)` trần:

```
User A: "123456"  →  8d969eea6a65...
User B: "123456"  →  8d969eea6a65...   ← giống hệt!
```

Hacker nhìn DB là biết ngay A và B dùng chung mật khẩu. Tệ hơn: có sẵn **rainbow table** — bảng tra hàng tỷ hash đã tính trước. Tra `8d969eea6a65...` ra ngay `123456`.

### Giải pháp: SALT

**Salt** = một chuỗi ngẫu nhiên, **khác nhau cho từng user**, trộn vào trước khi băm.

```
User A: hash("123456" + "x7f2a9b1")  →  a3f9...
User B: hash("123456" + "q0m4z8k3")  →  7c1e...   ← khác hoàn toàn
```

| Câu hỏi hay gặp | Trả lời |
| --- | --- |
| Salt có cần giữ bí mật không? | **Không.** Lưu ngay cạnh hash trong DB là bình thường |
| Vậy salt có tác dụng gì? | Vô hiệu hoá rainbow table, và buộc hacker phải bẻ **từng** mật khẩu riêng lẻ thay vì cả DB một lượt |
| Mỗi user một salt riêng? | **Bắt buộc.** Dùng chung salt là mất gần hết tác dụng |
| Ai tạo salt? | Thư viện tự làm. bcrypt/Argon2 tự sinh và nhúng vào chuỗi kết quả |

### PEPPER (nâng cao)

**Pepper** = một chuỗi bí mật **dùng chung**, nhưng **không lưu trong DB** — để ở biến môi trường / HSM.

```
hash(mật khẩu + salt + PEPPER)
```

Ý nghĩa: hacker dump được DB nhưng không lấy được server config → vẫn không bẻ được. Là lớp phòng thủ bổ sung, **không thay thế** salt.

### Code chuẩn

```js
// Node.js — dùng thư viện, ĐỪNG tự chế
import bcrypt from 'bcrypt';

// Đăng ký
const hash = await bcrypt.hash(password, 12);   // salt tự sinh, nhúng luôn vào hash

// Đăng nhập
const ok = await bcrypt.compare(password, hash); // so sánh constant-time sẵn
```

---

## ✍️ HMAC — hash + khoá bí mật

Hash thường ai cũng tính được. Nếu muốn chứng minh *"tin nhắn này do người biết khoá gửi và chưa bị sửa"* → dùng **HMAC**.

```
HMAC-SHA256(message, secret_key)  →  chữ ký
```

**Ứng dụng thực tế bạn gặp hằng ngày:** webhook của Shopify, Stripe, GitHub đều ký request bằng HMAC. Bên nhận tính lại HMAC bằng shared secret, khớp thì mới tin.

```js
import crypto from 'crypto';

const expected = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(rawBody)                 // ⚠️ body THÔ, không phải object đã parse
  .digest('base64');

// ✅ so sánh constant-time
const ok = crypto.timingSafeEqual(
  Buffer.from(expected),
  Buffer.from(receivedSignature)
);
```

> ⚠️ **Vì sao không dùng `===`?** So sánh chuỗi thường dừng ngay khi gặp ký tự khác nhau → chuỗi càng đúng nhiều ký tự đầu càng tốn thời gian hơn. Kẻ tấn công đo thời gian phản hồi có thể dò ra từng ký tự chữ ký. Gọi là **timing attack**. `timingSafeEqual` luôn chạy hết, thời gian như nhau.

---

## 🧰 Các ứng dụng khác của hash

| Ứng dụng | Thuật toán | Ghi chú |
| --- | --- | --- |
| Checksum file tải về | SHA-256 | Xác minh file không hỏng/không bị tráo |
| Git commit ID | SHA-1 → đang chuyển SHA-256 | Mỗi commit là hash của nội dung |
| Cache key / ETag | MD5, xxHash | Không cần chống tấn công → dùng hàm nhanh |
| Deduplication (tìm file trùng) | SHA-256, BLAKE3 | Cùng hash = cùng nội dung |
| Blockchain | SHA-256 | Liên kết block bằng hash block trước |
| Hash table (`Map`, `dict`) | Hàm hash **không mã hoá** | Khác hoàn toàn với crypto hash — chỉ cần nhanh và phân bố đều |

> ⚠️ Đừng nhầm **hash table** (cấu trúc dữ liệu, tối ưu tốc độ) với **cryptographic hash** (bảo mật). Cùng tên "hash" nhưng mục tiêu ngược nhau.

---

## ⚠️ Bẫy thường gặp

- **Nói "mã hoá mật khẩu"** → tư duy sai dẫn tới lưu mật khẩu giải ngược được.
- **Băm mật khẩu bằng SHA-256/MD5** → GPU dò hàng tỷ/giây. Phải dùng Argon2/bcrypt.
- **Quên salt** hoặc **dùng chung một salt** cho mọi user.
- **Tự chế thuật toán hash** ("SHA-256 ba lần cho chắc") → luôn yếu hơn thư viện chuẩn.
- **So sánh chữ ký bằng `===`** → timing attack.
- **HMAC trên body đã parse** thay vì raw body → chữ ký không bao giờ khớp (thứ tự key JSON đổi).
- **bcrypt cắt input ở 72 byte** — mật khẩu dài hơn bị bỏ phần đuôi. Mật khẩu tiếng Việt có dấu tốn 3 byte/ký tự nên chạm giới hạn sớm hơn tưởng.
- **Dùng MD5 cho việc bảo mật** — kể cả "chỉ là hash file thôi mà", nếu có kẻ tấn công thì vẫn hỏng.

---

## ✅ Nhớ 5 điều

1. Hash = **dấu vân tay một chiều**, độ dài cố định, không có đường về.
2. Mật khẩu phải **băm**, không phải mã hoá. Và phải bằng hàm **cố tình chậm**: Argon2/bcrypt.
3. **Salt** khác nhau cho từng user, không cần bí mật, chống rainbow table.
4. MD5 và SHA-1 đã **vỡ** — đừng dùng cho bảo mật.
5. So sánh giá trị bí mật luôn dùng **constant-time compare**, không dùng `===`.

---

## 📚 Nguồn

- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) ⭐ đọc cái này trước khi làm login
- [RFC 9106 — Argon2](https://datatracker.ietf.org/doc/html/rfc9106)
- [SHAttered — va chạm SHA-1 đầu tiên](https://shattered.io/)
- [Node.js — `crypto.timingSafeEqual()`](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b)
- [MDN — `SubtleCrypto.digest()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [Shopify — Verify webhook HMAC](https://shopify.dev/docs/apps/build/webhooks/subscribe/https)
