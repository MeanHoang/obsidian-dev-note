# 04 — Nhận diện chuỗi lạ: nhìn là biết

> **TL;DR:** Mở DB hoặc log thấy một chuỗi loằng ngoằng, làm sao biết nó là Base64, hash, JWT hay UUID? Có 3 manh mối: **độ dài**, **bảng ký tự**, và **tiền tố**. Note này là bảng tra thực dụng nhất series.

Series: [[00 - Roadmap - Encode, Hash, Encrypt]]
Anh em: [[01 - Encoding - Doi cach bieu dien du lieu]] · [[02 - Hashing - Dau van tay mot chieu]] · [[03 - Encryption - Giau noi dung]]

---

## 🔍 Quy trình nhận diện 3 bước

```
Bước 1 — Có dấu hiệu đặc biệt không?
   ├─ Có 2 dấu chấm  "xxx.yyy.zzz"       → JWT
   ├─ Bắt đầu bằng  $2b$ / $2a$          → bcrypt hash
   ├─ Bắt đầu bằng  $argon2id$           → Argon2 hash
   ├─ Có 4 dấu gạch ngang, 36 ký tự      → UUID
   ├─ Bắt đầu bằng  sk_ / pk_ / ghp_     → API key có tiền tố
   └─ Kết thúc bằng  =  hoặc  ==         → Base64
   
Bước 2 — Bảng ký tự nào?
   ├─ Chỉ 0-9 a-f                        → Hex (thường là hash)
   ├─ Có cả A-Z a-z 0-9 + /              → Base64
   ├─ Có cả A-Z a-z 0-9 - _              → Base64url
   └─ Có %XX                             → URL-encoded
   
Bước 3 — Độ dài bao nhiêu? → tra bảng bên dưới
```

---

## 📏 Bảng tra theo độ dài (hex)

Chuỗi chỉ chứa `0-9 a-f` gần như chắc chắn là **hash in ra dạng hex**:

| Độ dài | Là gì | Ví dụ |
| --- | --- | --- |
| **32** | MD5 💀 | `5d41402abc4b2a76b9719d911017c592` |
| **40** | SHA-1 💀 (hoặc Git commit) | `aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d` |
| **56** | SHA-224 | |
| **64** | **SHA-256** ⭐ (hoặc SHA3-256, BLAKE2s) | `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824` |
| **96** | SHA-384 | |
| **128** | SHA-512 | |

> ⚠️ Độ dài chỉ cho biết **kích thước output**, không cho biết chắc thuật toán. 64 ký tự hex có thể là SHA-256, SHA3-256, BLAKE2s — nhìn thôi không phân biệt được. Phải xem code.

---

## 🏷 Bảng tra theo tiền tố

| Tiền tố | Là gì |
| --- | --- |
| `$2a$` `$2b$` `$2y$` | **bcrypt** hash (60 ký tự tổng) |
| `$argon2id$` `$argon2i$` | **Argon2** hash |
| `$scrypt$` | scrypt hash |
| `$6$` | SHA-512-crypt (Linux `/etc/shadow`) |
| `eyJ` | **JWT** hoặc JSON đã Base64 (`eyJ` = `{"` đã encode) |
| `-----BEGIN` | Khoá / chứng chỉ dạng **PEM** |
| `data:image/png;base64,` | **Data URI** — ảnh nhúng |
| `sk_live_` `sk_test_` | Stripe **secret key** 🚨 |
| `pk_live_` | Stripe publishable key (công khai, an toàn) |
| `ghp_` `gho_` `github_pat_` | GitHub token 🚨 |
| `shpat_` `shpss_` | Shopify access token 🚨 |
| `AKIA` | AWS access key ID 🚨 |
| `xoxb-` `xoxp-` | Slack token 🚨 |

> 💡 Mẹo: `eyJ` xuất hiện vì mọi JSON đều bắt đầu bằng `{"`, mà `{"` encode Base64 luôn ra `eyJ`. Thấy `eyJ` = "bên trong là JSON".

---

## 🧬 Nhận diện từng loại

### Base64

```
SGVsbG8gVmnhu4d0IE5hbQ==
```

| Dấu hiệu | Chi tiết |
| --- | --- |
| Bảng ký tự | `A-Z a-z 0-9 + /` |
| Padding | Kết thúc bằng `=` hoặc `==` (không bắt buộc có) |
| Độ dài | Chia hết cho 4 |
| Cảm giác | Có cả hoa lẫn thường, "đọc gần ra chữ" |

**Thử ngay:** `atob('SGVsbG8=')` trong console. Ra chữ có nghĩa → đúng là Base64.

### Base64url

Như trên nhưng `+` → `-`, `/` → `_`, thường **không có** `=`.

```
rqXH-3_9abcDEF
```

Thấy `-` và `_` trong chuỗi mà không có `+` `/` → base64url. Dùng trong JWT, URL, tên file.

### Hex

```
4d616e
```

Chỉ `0-9 a-f`, độ dài **luôn chẵn** (2 ký tự = 1 byte). Nếu độ dài khớp bảng ở trên → hash.

### UUID

```
550e8400-e29b-41d4-a716-446655440000
                └ số này là VERSION
```

36 ký tự, 5 nhóm `8-4-4-4-12` ngăn bởi `-`.

| Version | Đặc điểm |
| --- | --- |
| **v4** | Ngẫu nhiên hoàn toàn. Ký tự đầu nhóm 3 là `4` |
| **v7** | ⭐ Có timestamp ở đầu → sắp xếp được theo thời gian, tốt cho index DB |
| v1 | Cũ, chứa MAC address (rò rỉ thông tin máy) |

> UUID **không phải** hash, **không phải** bảo mật. Nó chỉ là ID ngẫu nhiên đủ dài để gần như không trùng.

### JWT

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

**Đúng 2 dấu chấm**, bắt đầu bằng `eyJ`. Hai phần đầu decode ra JSON đọc được ngay.

```js
JSON.parse(atob('eyJ1c2VySWQiOjQyfQ'));   // { userId: 42 }
```

> 🚨 Nhắc lại từ [[03 - Encryption - Giau noi dung]]: payload JWT **không được mã hoá**. Nhìn thấy JWT trong log = coi như đã lộ toàn bộ nội dung bên trong.

### bcrypt hash

```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyDN2sVvCFqIWi
 │  │  └──────────────────── salt (22) + hash (31) ─────────┘
 │  └─ cost factor = 12
 └──── phiên bản
```

Tổng đúng **60 ký tự**. Thấy chuỗi bắt đầu `$2` trong cột `password` của DB → đúng chuẩn, yên tâm.

Thấy cột `password` chứa **32 ký tự hex** (MD5) → 🚨 báo động, cần migrate gấp.

---

## 🧪 Thử nhanh trong console

```js
// Base64?
try { console.log(atob(s)); } catch { console.log('không phải base64'); }

// Hex?
/^[0-9a-f]+$/i.test(s) && s.length % 2 === 0

// UUID?
/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)

// JWT? — đọc payload
s.split('.').length === 3 && JSON.parse(atob(s.split('.')[1]))
```

```powershell
# Băm nhanh một chuỗi để đối chiếu (PowerShell)
$s = "hello"
$bytes = [Text.Encoding]::UTF8.GetBytes($s)
[BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($bytes)).Replace("-","").ToLower()
```

---

## 🚨 Thấy cái này trong code là có vấn đề

| Thấy gì | Vấn đề | Sửa thế nào |
| --- | --- | --- |
| Cột `password` chứa 32 hex | MD5 — vỡ hoàn toàn | Migrate sang bcrypt/Argon2 khi user đăng nhập lần tới |
| Cột `password` chứa 64 hex | SHA-256 trần — quá nhanh | Như trên |
| `btoa(password)` gửi lên server | Base64 ≠ bảo mật | Dùng HTTPS, gửi thẳng, băm ở server |
| `sk_live_...` trong file `.js` phía client | Lộ secret key | Chuyển về server, rotate key ngay |
| API key trong Git history | Đã lộ vĩnh viễn | Rotate key, không chỉ xoá commit |
| JWT chứa email/CMND | Payload đọc được | Chỉ để `userId`, tra DB |
| `if (sig === expected)` | Timing attack | `crypto.timingSafeEqual()` |

---

## ✅ Nhớ 5 điều

1. **64 ký tự hex** = SHA-256. **32 hex** = MD5 (báo động nếu ở cột password).
2. **`eyJ`** ở đầu = JSON đã Base64 → gần như chắc chắn là JWT.
3. **`$2b$`** = bcrypt, đúng chuẩn lưu mật khẩu.
4. **`-` và `_`** trong chuỗi Base64 = base64url (dùng cho URL/JWT).
5. Thấy `=` hoặc `==` ở cuối = Base64 → decode được ngay, **không phải bảo mật**.

---

## 📚 Nguồn

- [RFC 4648 — Base16/32/64](https://datatracker.ietf.org/doc/html/rfc4648)
- [RFC 9562 — UUID (v4, v7)](https://datatracker.ietf.org/doc/html/rfc9562)
- [jwt.io — decode JWT](https://jwt.io/) (⚠️ đừng dán token thật của production)
- [GitHub — Secret scanning patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
