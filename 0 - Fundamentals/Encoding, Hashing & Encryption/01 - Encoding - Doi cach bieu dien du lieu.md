# 01 — Encoding: đổi cách biểu diễn dữ liệu

> **TL;DR:** Encoding là **đổi áo cho dữ liệu**, không phải giấu nó. Cùng một nội dung, mặc bộ áo khác để đi qua được một "cánh cổng" hẹp nào đó (URL không cho phép dấu cách, JSON không chứa được byte thô, email chỉ nuốt được text). **Ai cũng đảo ngược được, không cần khoá.** Đó là điểm phân biệt duy nhất so với encryption.

Series: [[00 - Roadmap - Encode, Hash, Encrypt]]
Anh em: [[02 - Hashing - Dau van tay mot chieu]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

---

## 🎯 Vì sao cần encoding

Máy tính chỉ lưu **bytes** (số từ 0 đến 255). Nhưng nhiều "đường ống" trên đời lại chỉ cho phép một tập ký tự hẹp đi qua:

| Đường ống | Giới hạn | Hệ quả |
| --- | --- | --- |
| URL | Không cho dấu cách, `?`, `#`, `&` trong giá trị | Phải URL-encode |
| JSON | Chỉ chứa text, không chứa byte thô | Ảnh phải Base64 |
| Email (SMTP cũ) | Chỉ 7-bit ASCII | Phải Base64 |
| HTML | `<`, `>`, `&` là ký tự điều khiển | Phải HTML entity |
| Terminal / log | Byte không in được sẽ vỡ màn hình | Phải Hex |

Encoding = **cái phễu** để nhét dữ liệu qua những cánh cổng hẹp đó, rồi đầu bên kia đổ ngược lại nguyên vẹn.

```
Dữ liệu gốc ──[encode]──▶ dạng an toàn ──[qua đường ống]──▶ ──[decode]──▶ Dữ liệu gốc
                                                                            (y hệt, không mất gì)
```

---

## 1️⃣ Character encoding (charset) — byte ↔ ký tự

Đây là loại encoding cơ bản nhất, đã nói ở [[01 - Tu URL den Pixel - Vong doi mot trang web]].

```
Chữ  "A"  →  1 byte:   41
Chữ  "ế"  →  3 byte:   e1 ba bf      (UTF-8)
```

| Bảng mã | Byte/ký tự | Ghi chú |
| --- | --- | --- |
| ASCII | 1 | 128 ký tự, không có tiếng Việt |
| windows-1252 | 1 | Tây Âu |
| **UTF-8** | 1–4 | ⭐ Chuẩn của web. Tương thích ngược ASCII |
| UTF-16 | 2 hoặc 4 | JS dùng nội bộ cho string |

Sai bảng mã → **mojibake**: `Tiếng Việt` thành `Tiáº¿ng Viá»t`.

```js
// Chuyển chữ ↔ byte trong JS
const bytes = new TextEncoder().encode('ế');   // Uint8Array [225, 186, 191]
new TextDecoder().decode(bytes);               // 'ế'
```

> ⚠️ `'😀'.length === 2` — JS đếm **code unit UTF-16**, không đếm ký tự. Muốn đếm đúng: `[...'😀'].length === 1`.

---

## 2️⃣ Base64 — byte thô → text an toàn

**Vấn đề nó giải:** bạn có một tấm ảnh (bytes lung tung, nhiều byte không in được) và cần nhét nó vào JSON / HTML / email — những nơi chỉ nuốt được text.

**Cách hoạt động:** gom **3 byte (24 bit)** → cắt thành **4 nhóm 6 bit** → mỗi nhóm tra bảng 64 ký tự `A-Z a-z 0-9 + /`.

```
Byte:    01001101   01100001   01101110      ("Man")
Gộp:     010011 010110 000101 101110
Tra:       19     22      5      46
Bảng:      T      W      F       u          → "TWFu"
```

Vì sao 64 ký tự? Vì `2^6 = 64` — vừa đúng 6 bit.

**Hệ quả cần nhớ:**

| Đặc điểm | Chi tiết |
| --- | --- |
| Phình to | 3 byte → 4 ký tự = **tăng ~33%** dung lượng |
| Padding | Thiếu byte thì chèn `=` cuối chuỗi (0, 1 hoặc 2 dấu) |
| Độ dài | Luôn chia hết cho 4 |
| Bảo mật | **Bằng không.** Ai cũng decode được |

```js
// Node.js
Buffer.from('Xin chào').toString('base64');        // 'WGluIGNow6Bv'
Buffer.from('WGluIGNow6Bv', 'base64').toString();  // 'Xin chào'

// Browser — chú ý btoa() chỉ nuốt được ASCII
btoa('Hello');                                      // 'SGVsbG8='
// btoa('Xin chào')  → ném lỗi InvalidCharacterError
btoa(String.fromCharCode(...new TextEncoder().encode('Xin chào')));  // cách đúng
```

### Base64url — biến thể cho URL

`+` và `/` có ý nghĩa đặc biệt trong URL, nên biến thể **base64url** đổi thành `-` và `_`, và bỏ luôn dấu `=`.

```
Base64:     rqXH+3/9abc=
Base64url:  rqXH-3_9abc
```

👉 **JWT dùng base64url.** Thấy chuỗi có `-` và `_` mà không có `+`, `/`, `=` → nhiều khả năng là base64url.

### Khi nào dùng Base64

| ✅ Nên | ❌ Không nên |
| --- | --- |
| Nhúng ảnh nhỏ vào CSS/HTML (data URI) | Nhúng ảnh lớn (phình 33%, không cache được riêng) |
| Gửi file qua JSON API | "Giấu" token, mật khẩu, API key |
| Basic Auth header | Thay cho mã hoá |
| Nhúng SVG vào `background-image` | Lưu file lớn trong DB |

---

## 3️⃣ Hex (Base16) — byte → 2 ký tự

Mỗi byte thành đúng **2 ký tự** `0-9 a-f`. Đơn giản, dễ đọc bằng mắt, nhưng phình **gấp đôi**.

```
Byte:  01001101  →  4d
"Man" →  4d 61 6e
```

| So sánh | Base64 | Hex |
| --- | --- | --- |
| Phình | +33% | +100% |
| Người đọc được không | Khó | **Dễ** |
| Độ dài cố định/byte | Không | **Có (2 ký tự)** |
| Dùng ở đâu | Truyền dữ liệu | Hiển thị hash, màu CSS, MAC address, debug |

👉 Vì thế **hash thường in ra dạng hex** — SHA-256 luôn ra đúng 64 ký tự hex, nhìn là nhận ra ngay.

```js
crypto.createHash('sha256').update('abc').digest('hex');
// 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'  ← 64 ký tự
```

---

## 4️⃣ URL encoding (percent-encoding)

Ký tự không an toàn → `%` + mã hex của byte.

```
dấu cách  →  %20
"ế"       →  %E1%BA%BF     (3 byte UTF-8 → 3 nhóm %)
&         →  %26
```

```js
encodeURIComponent('tìm kiếm & lọc');  // 'ti%CC%80m%20ki%E1%BA%BFm%20%26%20l%E1%BB%8Dc'
decodeURIComponent(...)                 // về nguyên bản
```

**Phân biệt 2 hàm — hay nhầm:**

| Hàm | Mã hoá gì | Dùng khi |
| --- | --- | --- |
| `encodeURIComponent()` | Mã hoá cả `&`, `=`, `?`, `/` | ⭐ Mã hoá **một giá trị** trong query string |
| `encodeURI()` | Giữ nguyên `&`, `=`, `?`, `/` | Mã hoá **cả một URL** hoàn chỉnh |

```js
// SAI — dấu & trong giá trị làm vỡ query string
`/search?q=${encodeURI('áo & quần')}`        // ?q=%C3%A1o%20&%20qu%E1%BA%A7n  ← vỡ

// ĐÚNG
`/search?q=${encodeURIComponent('áo & quần')}`  // ?q=%C3%A1o%20%26%20qu%E1%BA%A7n
```

---

## 5️⃣ HTML entities

`<`, `>`, `&` là ký tự điều khiển của HTML → phải thay thế nếu muốn hiện ra như chữ thường.

| Ký tự | Entity |
| --- | --- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |

Đây chính là cơ chế **chống XSS**: nội dung người dùng nhập vào phải được escape trước khi nhét vào HTML.

```js
el.textContent = userInput;   // ✅ browser tự escape
el.innerHTML   = userInput;   // ❌ <script> hoặc <img onerror=...> sẽ chạy
```

> Liên hệ [[02 - DOM la gi - Cay, Node va API]] — phần `textContent` vs `innerHTML`.

---

## 📊 Bảng tổng hợp

| Encoding | Biến gì → gì | Phình | Dùng để |
| --- | --- | --- | --- |
| UTF-8 | ký tự → byte | 1–4 byte/ký tự | Lưu & truyền chữ |
| Base64 | byte → text | +33% | Nhét binary vào text |
| Base64url | byte → text URL-safe | +33% | JWT, token trong URL |
| Hex | byte → text | +100% | Hiển thị hash, debug |
| URL-encode | ký tự đặc biệt → `%XX` | thay đổi | Query string, path |
| HTML entity | `<>&` → `&lt;` … | thay đổi | Chống XSS |

---

## ⚠️ Bẫy thường gặp

- **Coi Base64 là mã hoá** — lỗi số 1. Nó chỉ là đổi áo, không phải khoá cửa.
- **`btoa()` với tiếng Việt** → `InvalidCharacterError`. Phải qua `TextEncoder` trước.
- **Dùng `encodeURI()` cho giá trị query** → dấu `&` trong giá trị làm vỡ URL.
- **Encode 2 lần** — `%2520` là dấu `%` đã bị encode lại. Thường do đi qua 2 tầng proxy/framework cùng encode.
- **Base64 ảnh lớn nhúng vào HTML** → HTML phình to, không cache riêng được, chặn cả trang render.
- **Nhầm Base64 với Base64url** — sai bảng ký tự thì decode ra rác. JWT dùng base64url.
- **`innerHTML` với nội dung người dùng** → XSS. Dùng `textContent`.

---

## ✅ Nhớ 5 điều

1. Encoding = **đổi áo**, không giấu gì. Ai cũng cởi ra được.
2. Base64 = nhét **byte thô vào chỗ chỉ chứa text**, phình 33%.
3. Hex = 1 byte → 2 ký tự, dễ đọc → dùng để **hiển thị hash**.
4. `encodeURIComponent()` cho **giá trị**, `encodeURI()` cho **cả URL**.
5. Thấy ai đó "bảo mật bằng Base64" → đó là bug, không phải tính năng.

---

## 📚 Nguồn

- [MDN — `TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) · [`btoa()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa) · [Base64 trên MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [RFC 4648 — Base16, Base32, Base64](https://datatracker.ietf.org/doc/html/rfc4648) (mục 5 là base64url)
- [MDN — `encodeURIComponent()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [RFC 3986 — URI Generic Syntax](https://datatracker.ietf.org/doc/html/rfc3986) (percent-encoding)
- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
