# Glossary — Encode, Hash, Encrypt

> Tra nhanh thuật ngữ của series. Không cần học thuộc — gặp từ lạ thì nhảy vào đây, đọc 3 câu rồi quay lại.

Series: [[00 - Roadmap - Encode, Hash, Encrypt]]

---

## Mục lục nhanh

**🔤 Nhóm Encoding**

| Thuật ngữ | Một câu |
|---|---|
| [[#Encoding]] | Đổi cách biểu diễn dữ liệu, ai cũng đảo ngược được. |
| [[#Charset (Character encoding)]] | Bảng tra byte ↔ ký tự. |
| [[#Unicode]] | Danh mục đánh số cho mọi ký tự của mọi ngôn ngữ. |
| [[#Code point]] | Số thứ tự của một ký tự trong Unicode. |
| [[#UTF-8]] | Cách gói code point thành 1–4 byte, chuẩn của web. |
| [[#Mojibake]] | Chữ ra bậy vì giải mã sai bảng mã. |
| [[#BOM (Byte Order Mark)]] | 3 byte vô hình đầu file báo bảng mã. |
| [[#Base64]] | Nhét byte thô vào chỗ chỉ chứa text, phình 33%. |
| [[#Base64url]] | Base64 đổi `+/` thành `-_` để đi được trong URL. |
| [[#Padding]] | Dấu `=` chèn cuối Base64 cho đủ bội số 4. |
| [[#Hex (Base16)]] | 1 byte → 2 ký tự `0-9a-f`, dễ đọc bằng mắt. |
| [[#Percent-encoding (URL encoding)]] | Ký tự không an toàn thành `%XX` trong URL. |
| [[#HTML entity]] | `<` `>` `&` thành `&lt;` `&gt;` `&amp;` để khỏi vỡ HTML. |
| [[#Data URI]] | Nhúng thẳng file vào HTML/CSS dưới dạng Base64. |
| [[#Serialization]] | Biến object trong RAM thành chuỗi/byte để lưu hoặc gửi. |

**🔒 Nhóm Hashing**

| Thuật ngữ | Một câu |
|---|---|
| [[#Hash function]] | Biến dữ liệu bất kỳ thành chuỗi độ dài cố định, không có đường về. |
| [[#Digest]] | Chính là kết quả của hàm hash. |
| [[#Deterministic]] | Cùng input luôn ra cùng output. |
| [[#One-way (một chiều)]] | Từ hash không dựng lại được dữ liệu gốc. |
| [[#Collision (va chạm)]] | Hai input khác nhau ra cùng một hash. |
| [[#Avalanche effect]] | Đổi 1 bit input thì hash đổi hoàn toàn. |
| [[#MD5]] | Hash 128-bit đã vỡ, chỉ còn dùng làm checksum không bảo mật. |
| [[#SHA-1]] | Hash 160-bit đã vỡ năm 2017, đừng dùng. |
| [[#SHA-256]] | Hash 256-bit, chuẩn an toàn hiện nay. |
| [[#Checksum]] | Hash dùng để kiểm tra dữ liệu có nguyên vẹn không. |
| [[#Rainbow table]] | Bảng tra hash đã tính sẵn để dò ngược mật khẩu. |
| [[#Salt]] | Chuỗi ngẫu nhiên riêng từng user, trộn vào trước khi băm. |
| [[#Pepper]] | Bí mật dùng chung, để ngoài DB, thêm một lớp phòng thủ. |
| [[#Key stretching]] | Cố tình băm chậm đi để kẻ dò mật khẩu hết hơi. |
| [[#Cost factor (work factor)]] | Nút vặn độ chậm của bcrypt/Argon2. |
| [[#bcrypt]] | Hàm băm mật khẩu phổ biến nhất, tự nhúng salt vào kết quả. |
| [[#Argon2]] | Hàm băm mật khẩu được khuyến nghị hiện nay. |
| [[#PBKDF2]] | Hàm băm mật khẩu đời cũ, vẫn chấp nhận được. |
| [[#HMAC]] | Hash cộng thêm khoá bí mật, để ký và xác thực tin nhắn. |
| [[#Timing attack]] | Dò bí mật bằng cách đo thời gian phản hồi. |
| [[#Constant-time comparison]] | So sánh luôn tốn thời gian như nhau, chống timing attack. |
| [[#Hash table]] | Cấu trúc dữ liệu — cùng tên "hash" nhưng khác mục đích hoàn toàn. |

**🔐 Nhóm Encryption**

| Thuật ngữ | Một câu |
|---|---|
| [[#Encryption]] | Giấu nội dung, chỉ người có khoá mở lại được. |
| [[#Plaintext / Ciphertext]] | Bản rõ trước khi mã hoá / bản mã sau khi mã hoá. |
| [[#Key (khoá)]] | Chuỗi bí mật quyết định ai đọc được. |
| [[#Symmetric (đối xứng)]] | Một khoá dùng cho cả khoá lẫn mở, rất nhanh. |
| [[#Asymmetric (bất đối xứng)]] | Cặp public/private, chậm, giải bài toán trao khoá. |
| [[#Public key / Private key]] | Khoá đưa cho cả thế giới / khoá giữ chết một mình. |
| [[#AES]] | Thuật toán đối xứng chuẩn hiện nay. |
| [[#IV / Nonce]] | Số dùng một lần, bắt buộc khác nhau mỗi lần mã hoá. |
| [[#AEAD]] | Mã hoá kèm luôn kiểm tra toàn vẹn (như AES-GCM). |
| [[#RSA]] | Thuật toán bất đối xứng cổ điển, khoá dài. |
| [[#ECC (Elliptic Curve)]] | Bất đối xứng khoá ngắn mà an toàn tương đương, nhanh hơn RSA. |
| [[#Key exchange]] | Cách hai bên thoả thuận khoá chung mà không gửi khoá qua mạng. |
| [[#Forward secrecy]] | Lộ khoá server hôm nay cũng không giải được traffic hôm qua. |
| [[#Digital signature (chữ ký số)]] | Ký bằng private, cả thế giới xác minh bằng public. |
| [[#Certificate (chứng chỉ)]] | Giấy tờ chứng minh public key này đúng là của website đó. |
| [[#CA (Certificate Authority)]] | Bên thứ ba mà browser tin sẵn, đứng ra bảo lãnh chứng chỉ. |
| [[#PEM]] | Định dạng text để lưu khoá và chứng chỉ. |
| [[#TLS]] | Lớp bọc mã hoá biến HTTP thành HTTPS. |
| [[#MITM (Man-in-the-middle)]] | Kẻ đứng giữa chặn và đọc/sửa dữ liệu đang truyền. |
| [[#JWT]] | Token ba phần, được **ký** chứ không được mã hoá. |
| [[#JWS / JWE]] | JWS là ký (mặc định), JWE mới là mã hoá thật. |
| [[#Entropy]] | Độ ngẫu nhiên thật sự — nền của mọi khoá an toàn. |
| [[#CSPRNG]] | Bộ sinh số ngẫu nhiên đủ an toàn cho mã hoá. |
| [[#Key rotation]] | Đổi khoá định kỳ để giới hạn thiệt hại khi lộ. |

---

## 🔤 Nhóm Encoding

### Encoding

**Dịch thô:** mã hoá biểu diễn · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Đổi cách **biểu diễn** dữ liệu để nó đi qua được một đường ống hẹp nào đó — URL không cho dấu cách, JSON không chứa byte thô. Nội dung không đổi, chỉ đổi hình thức. Điểm phân biệt với mã hoá thật: **không cần khoá, ai cũng đảo ngược được**.

> 💡 **Nhớ nhanh:** đổi áo, không phải khoá cửa.

### Charset (Character encoding)

**Dịch thô:** bảng mã ký tự · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Quy tắc tra **byte ↔ ký tự**. Cùng một dãy byte, tra bằng hai bảng khác nhau ra hai chuỗi chữ khác nhau. Đây là lý do `<meta charset="utf-8">` phải nằm ngay đầu `<head>`.

> 💡 **Nhớ nhanh:** cuốn từ điển dịch số sang chữ.

### Unicode

**Dịch thô:** bộ mã hợp nhất · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Danh mục khổng lồ đánh số cho **mọi ký tự của mọi ngôn ngữ** trên đời, kể cả emoji. Unicode chỉ nói "ký tự `ế` mang số 7871", nó **không** nói lưu số đó xuống ổ cứng bằng mấy byte — việc đó là của UTF-8/UTF-16.

> 💡 **Nhớ nhanh:** Unicode là danh bạ, UTF-8 là cách gói hàng.

### Code point

**Dịch thô:** điểm mã · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Số thứ tự của một ký tự trong Unicode, viết dạng `U+XXXX`. Ví dụ `A` là `U+0041`, `ế` là `U+1EBF`.

```js
'ế'.codePointAt(0).toString(16);   // '1ebf'
```

> 💡 **Nhớ nhanh:** số căn cước của ký tự.

### UTF-8

**Dịch thô:** — · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Cách gói code point thành byte, dùng **1 đến 4 byte** tuỳ ký tự. Thắng thế vì tương thích ngược ASCII: chữ tiếng Anh vẫn đúng 1 byte, không phình. Tiếng Việt có dấu tốn 3 byte mỗi ký tự.

> 💡 **Nhớ nhanh:** co giãn theo ký tự — tiếng Anh rẻ, tiếng Việt đắt hơn.

### Mojibake

**Dịch thô:** chữ vỡ (tiếng Nhật: 文字化け) · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Hiện tượng chữ ra bậy vì **giải mã sai bảng mã**: `Tiếng Việt` thành `Tiáº¿ng Viá»t`. Không phải lỗi font — font vô can, chỉ là byte bị tra nhầm bảng.

> 💡 **Nhớ nhanh:** đọc sách tiếng Việt bằng từ điển tiếng Pháp.

### BOM (Byte Order Mark)

**Dịch thô:** dấu thứ tự byte · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Ba byte vô hình (`ef bb bf`) đặt đầu file để báo "đây là UTF-8". Nghe thì tiện nhưng hay gây hoạ: file PHP/JS có BOM sẽ in ra ký tự lạ trước `<!doctype>`, làm vỡ header hoặc layout. Luôn lưu **UTF-8 without BOM**.

> 💡 **Nhớ nhanh:** ba byte tàng hình chuyên phá đám.

### Base64

**Dịch thô:** — · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

Gom 3 byte thành 4 ký tự thuộc bảng `A-Z a-z 0-9 + /`. Dùng để nhét **byte thô vào chỗ chỉ chứa text** (JSON, email, HTML). Phình khoảng **33%**. Tuyệt đối **không phải bảo mật** — ai cũng decode được.

> 💡 **Nhớ nhanh:** cái phễu, không phải cái két sắt.

### Base64url

**Dịch thô:** Base64 an toàn cho URL · **Gặp ở:** [[04 - Nhan dien chuoi la - Nhin la biet]]

Biến thể đổi `+` → `-` và `/` → `_`, thường bỏ luôn `=`, vì mấy ký tự kia có ý nghĩa riêng trong URL. **JWT dùng base64url.**

> 💡 **Nhớ nhanh:** thấy `-` và `_` mà không thấy `+` `/` → base64url.

### Padding

**Dịch thô:** phần đệm · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Base64 gom theo cụm 3 byte; thiếu byte thì chèn dấu `=` cuối chuỗi (1 hoặc 2 dấu) cho đủ bội số 4.

> 💡 **Nhớ nhanh:** `=` cuối chuỗi là dấu hiệu nhận dạng Base64.

### Hex (Base16)

**Dịch thô:** hệ 16 · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Mỗi byte thành đúng 2 ký tự `0-9 a-f`. Phình gấp đôi nhưng **người đọc được bằng mắt** và độ dài đoán được ngay — nên hash luôn in ra dạng hex.

> 💡 **Nhớ nhanh:** 2 ký tự = 1 byte, đếm độ dài là đoán ra thuật toán.

### Percent-encoding (URL encoding)

**Dịch thô:** mã hoá phần trăm · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Ký tự không an toàn trong URL thành `%` + mã hex: dấu cách thành `%20`, `ế` thành `%E1%BA%BF`. Dùng `encodeURIComponent()` cho **một giá trị**, `encodeURI()` cho **cả URL**.

> 💡 **Nhớ nhanh:** thấy `%20` là biết URL đã được encode.

### HTML entity

**Dịch thô:** thực thể HTML · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

`<` `>` `&` là ký tự điều khiển của HTML nên phải đổi thành `&lt;` `&gt;` `&amp;` khi muốn hiện ra như chữ thường. Đây chính là cơ chế **chống XSS** — dùng `textContent` thay `innerHTML` là browser tự làm hộ.

> 💡 **Nhớ nhanh:** escape để chữ là chữ, đừng thành lệnh.

### Data URI

**Dịch thô:** URI chứa dữ liệu · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Nhúng thẳng file vào HTML/CSS thay vì trỏ tới một URL: `data:image/png;base64,iVBORw0KG...`. Tiện cho icon nhỏ (đỡ một request), tệ cho file lớn (phình 33%, không cache riêng được).

> 💡 **Nhớ nhanh:** file "chui" vào trong code luôn.

### Serialization

**Dịch thô:** tuần tự hoá · **Gặp ở:** [[01 - Encoding - Doi cach bieu dien du lieu]]

Biến object đang sống trong RAM thành chuỗi/byte để lưu hoặc gửi đi — `JSON.stringify()` là ví dụ quen nhất. Khác encoding ở chỗ nó đổi **cấu trúc**, không chỉ đổi cách biểu diễn byte.

> 💡 **Nhớ nhanh:** gấp đồ cho vào vali để mang đi.

---

## 🔒 Nhóm Hashing

### Hash function

**Dịch thô:** hàm băm · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hàm nhận vào dữ liệu **bất kỳ độ dài nào**, nhả ra chuỗi **độ dài cố định**, và không có đường về. Dùng để **so sánh** và **phát hiện thay đổi**, không phải để giấu.

> 💡 **Nhớ nhanh:** dấu vân tay — lấy thì dễ, dựng lại người thì không.

### Digest

**Dịch thô:** bản tóm lược · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Chính là kết quả đầu ra của hàm hash. Trong code hay thấy `.digest('hex')` — nghĩa là "cho tôi kết quả, in ra dạng hex".

> 💡 **Nhớ nhanh:** digest = hash, hai tên một thứ.

### Deterministic

**Dịch thô:** tất định · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Cùng input thì **luôn luôn** ra cùng output, hôm nay hay mười năm sau, máy nào cũng vậy. Không có tính chất này thì không dùng hash để so sánh được.

> 💡 **Nhớ nhanh:** không có yếu tố hên xui.

### One-way (một chiều)

**Dịch thô:** một chiều · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Từ hash **không** tính ngược ra dữ liệu gốc. Tên kỹ thuật là *preimage resistance*. Đây là lý do lưu hash mật khẩu an toàn hơn lưu mật khẩu đã mã hoá.

> 💡 **Nhớ nhanh:** đường một chiều, không có lối quay đầu.

### Collision (va chạm)

**Dịch thô:** đụng độ · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hai dữ liệu **khác nhau** nhưng ra **cùng một hash**. Về lý thuyết luôn tồn tại (input vô hạn, output hữu hạn); vấn đề là **tìm ra có dễ không**. MD5 và SHA-1 đã bị tìm ra va chạm → coi như vỡ.

> 💡 **Nhớ nhanh:** hai người khác nhau mà cùng vân tay — hỏng cả hệ thống.

### Avalanche effect

**Dịch thô:** hiệu ứng tuyết lở · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Đổi **1 bit** trong input thì hash đổi **hoàn toàn**, không còn chút liên hệ nào. Nhờ vậy không ai "đoán dần" input từ hash được.

> 💡 **Nhớ nhanh:** hòn sỏi rơi kéo cả quả núi đổ.

### MD5

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

Hash 128-bit → **32 ký tự hex**. Đã bị bẻ hoàn toàn: tìm va chạm trong vài giây trên laptop. Chỉ còn dùng được cho việc không liên quan bảo mật (cache key, tìm file trùng). Thấy MD5 ở cột `password` là báo động đỏ.

> 💡 **Nhớ nhanh:** 32 hex = MD5 = đừng dùng cho bảo mật.

### SHA-1

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hash 160-bit → **40 ký tự hex**. Google công bố va chạm thật năm 2017 (dự án "SHAttered") → khai tử. Git vẫn dùng SHA-1 cho commit ID nhưng đang chuyển dần sang SHA-256.

> 💡 **Nhớ nhanh:** 40 hex = SHA-1 = đã vỡ từ 2017.

### SHA-256

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

Hash 256-bit → **64 ký tự hex**. Chuẩn an toàn hiện nay cho checksum, chữ ký, blockchain. Nhưng **quá nhanh** nên **không** dùng trực tiếp cho mật khẩu.

> 💡 **Nhớ nhanh:** 64 hex — an toàn cho file, sai cho mật khẩu.

### Checksum

**Dịch thô:** tổng kiểm tra · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hash dùng để kiểm tra dữ liệu có **nguyên vẹn** không. Trang tải phần mềm hay đăng kèm chuỗi SHA-256 để bạn tự băm file vừa tải và đối chiếu.

> 💡 **Nhớ nhanh:** niêm phong hàng — rách niêm là biết bị mở.

### Rainbow table

**Dịch thô:** bảng cầu vồng · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Bảng tra khổng lồ chứa sẵn hash của hàng tỷ mật khẩu phổ biến. Có hash trong tay là tra ngược ra mật khẩu ngay. **Salt** sinh ra để vô hiệu hoá đúng thứ này.

> 💡 **Nhớ nhanh:** từ điển tra ngược hash → mật khẩu.

### Salt

**Dịch thô:** muối · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Chuỗi ngẫu nhiên **riêng cho từng user**, trộn vào mật khẩu trước khi băm. Nhờ đó hai người cùng mật khẩu vẫn ra hai hash khác nhau, và rainbow table vô dụng. Salt **không cần bí mật** — lưu ngay cạnh hash là bình thường.

> 💡 **Nhớ nhanh:** mỗi nồi một loại muối riêng, không ai nấu sẵn được.

### Pepper

**Dịch thô:** tiêu · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Bí mật **dùng chung cho cả hệ thống**, nhưng **không lưu trong DB** — để ở biến môi trường hoặc HSM. Hacker dump được DB mà không lấy được server config thì vẫn bó tay. Là lớp bổ sung, **không thay thế** salt.

> 💡 **Nhớ nhanh:** muối để trong bếp, tiêu cất trong két.

### Key stretching

**Dịch thô:** kéo giãn khoá · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Cố tình băm **chậm** đi (lặp hàng nghìn vòng, tốn RAM) để kẻ dò mật khẩu không thử được hàng tỷ lần mỗi giây. Người dùng chờ thêm 200ms lúc đăng nhập, hacker mất thêm vài trăm năm.

> 💡 **Nhớ nhanh:** chậm có chủ đích — đây là tính năng, không phải bug.

### Cost factor (work factor)

**Dịch thô:** hệ số chi phí · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Nút vặn độ chậm. Với bcrypt, cost 12 nghĩa là `2^12` vòng lặp; tăng lên 13 là **chậm gấp đôi**. Máy tính mạnh lên thì tăng cost, không cần đổi thuật toán.

> 💡 **Nhớ nhanh:** một nút vặn, chỉnh theo thời đại.

### bcrypt

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

Hàm băm mật khẩu phổ biến nhất, có ở mọi ngôn ngữ. Kết quả 60 ký tự bắt đầu bằng `$2b$` và **đã nhúng sẵn salt + cost** bên trong nên không cần lưu cột riêng. Lưu ý: cắt input ở **72 byte**.

> 💡 **Nhớ nhanh:** thấy `$2b$` trong cột password là yên tâm.

### Argon2

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hàm băm mật khẩu **được khuyến nghị hiện nay** (thắng Password Hashing Competition 2015). Biến thể nên dùng là **Argon2id**. Chỉnh được cả 3 chiều: thời gian, RAM, số luồng — tốn RAM nên GPU khó song song hoá.

> 💡 **Nhớ nhanh:** lựa chọn mặc định cho dự án mới.

### PBKDF2

**Dịch thô:** — · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hàm băm mật khẩu đời cũ, chỉ lặp lại hash nhiều lần. Yếu hơn Argon2/bcrypt vì **không tốn RAM** → GPU dò nhanh hơn. Vẫn dùng khi bị ràng buộc chuẩn (FIPS) hoặc chỉ có Web Crypto API.

> 💡 **Nhớ nhanh:** chấp nhận được, nhưng không phải lựa chọn đầu.

### HMAC

**Dịch thô:** mã xác thực tin nhắn dựa trên hash · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hash **cộng thêm một khoá bí mật**. Hash thường ai cũng tính được; HMAC thì chỉ người biết khoá mới tạo và kiểm tra được. Webhook của Shopify, Stripe, GitHub đều ký bằng HMAC-SHA256.

```js
crypto.createHmac('sha256', SECRET).update(rawBody).digest('base64');
```

> 💡 **Nhớ nhanh:** hash có ổ khoá — chứng minh "đúng người gửi".

### Timing attack

**Dịch thô:** tấn công dựa vào thời gian · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

So sánh chuỗi bằng `===` sẽ **dừng ngay** khi gặp ký tự khác nhau → chuỗi đoán đúng nhiều ký tự đầu sẽ tốn thời gian hơn một chút. Kẻ tấn công đo hàng nghìn lần là dò ra từng ký tự chữ ký.

> 💡 **Nhớ nhanh:** rò rỉ bí mật qua đồng hồ bấm giây.

### Constant-time comparison

**Dịch thô:** so sánh thời gian hằng · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Hàm so sánh **luôn chạy hết** mọi ký tự, thời gian như nhau dù đúng hay sai. Dùng `crypto.timingSafeEqual()` cho mọi so sánh liên quan chữ ký, token, secret.

> 💡 **Nhớ nhanh:** đọc hết bài rồi mới chấm điểm, không bỏ ngang.

### Hash table

**Dịch thô:** bảng băm · **Gặp ở:** [[02 - Hashing - Dau van tay mot chieu]]

Cấu trúc dữ liệu (`Map` trong JS, `dict` trong Python) dùng hàm hash để tra cứu nhanh. **Cùng tên "hash" nhưng mục tiêu ngược nhau**: ở đây chỉ cần nhanh và phân bố đều, không cần chống kẻ tấn công.

> 💡 **Nhớ nhanh:** trùng tên, khác nghề.

---

## 🔐 Nhóm Encryption

### Encryption

**Dịch thô:** mã hoá · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Biến dữ liệu thành thứ vô nghĩa, và **chỉ người có khoá mở lại được**. Khác hash ở chỗ **có đường về**; khác encoding ở chỗ **cần khoá**.

> 💡 **Nhớ nhanh:** két sắt — có chìa thì mở, không có thì chịu.

### Plaintext / Ciphertext

**Dịch thô:** bản rõ / bản mã · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Plaintext là dữ liệu trước khi mã hoá (đọc được), ciphertext là sau khi mã hoá (vô nghĩa). "Plaintext" không có nghĩa là "văn bản" — ảnh hay video chưa mã hoá cũng gọi là plaintext.

> 💡 **Nhớ nhanh:** trước và sau khi vào két.

### Key (khoá)

**Dịch thô:** khoá · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Chuỗi bí mật quyết định ai đọc được. Thuật toán thì **công khai** cho cả thế giới soi (đó là điểm mạnh, không phải điểm yếu) — chỉ khoá là bí mật.

> 💡 **Nhớ nhanh:** ổ khoá ai cũng biết cấu tạo, chìa mới là thứ phải giữ.

### Symmetric (đối xứng)

**Dịch thô:** đối xứng · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

**Một khoá duy nhất** dùng cho cả khoá lẫn mở. Rất nhanh, mã hoá được file lớn. Nhược điểm chí mạng: **làm sao đưa khoá cho người kia** mà không bị chặn giữa đường.

> 💡 **Nhớ nhanh:** khoá cửa nhà — một chìa cho cả khoá lẫn mở.

### Asymmetric (bất đối xứng)

**Dịch thô:** bất đối xứng · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

**Cặp hai khoá** sinh ra cùng lúc: khoá này khoá thì chỉ khoá kia mở được. Giải được bài toán trao khoá, nhưng **chậm hơn hàng trăm lần** nên không dùng cho dữ liệu lớn.

> 💡 **Nhớ nhanh:** hòm thư — ai cũng bỏ thư vào được, chỉ chủ mới lấy ra.

### Public key / Private key

**Dịch thô:** khoá công khai / khoá bí mật · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Public key đưa cho cả thế giới, private key giữ chết không đưa ai. Dùng theo **hai chiều khác nhau**: mã hoá thì khoá bằng public của người nhận; ký thì ký bằng private của người gửi.

> 💡 **Nhớ nhanh:** public để nhận, private để chứng minh.

### AES

**Dịch thô:** chuẩn mã hoá tiên tiến · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Thuật toán **đối xứng** chuẩn hiện nay. Dùng chế độ **AES-256-GCM** (kèm luôn kiểm tra toàn vẹn). Tuyệt đối tránh chế độ **ECB** — khối giống nhau ra ciphertext giống nhau, lộ cả cấu trúc dữ liệu.

> 💡 **Nhớ nhanh:** AES-256-GCM là mặc định, ECB là bẫy.

### IV / Nonce

**Dịch thô:** vector khởi tạo / số dùng một lần · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Giá trị ngẫu nhiên **bắt buộc khác nhau mỗi lần mã hoá**, để cùng một nội dung không ra cùng một ciphertext. Không cần bí mật — lưu chung với ciphertext là bình thường. Dùng lại IV với AES-GCM là **mất sạch tính bảo mật**.

> 💡 **Nhớ nhanh:** dùng một lần rồi vứt, như vé số.

### AEAD

**Dịch thô:** mã hoá có xác thực kèm dữ liệu · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Chế độ mã hoá làm **hai việc cùng lúc**: giấu nội dung **và** phát hiện nếu ciphertext bị sửa (qua *auth tag*). AES-GCM và ChaCha20-Poly1305 là AEAD. Không có nó thì hacker sửa được ciphertext mà bạn không biết.

> 💡 **Nhớ nhanh:** vừa khoá két vừa dán niêm phong.

### RSA

**Dịch thô:** — · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Thuật toán **bất đối xứng** cổ điển, dựa trên độ khó phân tích thừa số nguyên tố. Khoá dài (2048–4096 bit) nên chậm và tốn băng thông. Vẫn dùng rộng rãi nhưng dự án mới nên cân nhắc ECC.

> 💡 **Nhớ nhanh:** cụ tổ của mã hoá công khai — vẫn chạy, nhưng nặng.

### ECC (Elliptic Curve)

**Dịch thô:** mật mã đường cong elliptic · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Bất đối xứng dùng toán đường cong elliptic. Khoá **256 bit** của ECC an toàn tương đương RSA **3072 bit** → nhanh hơn, nhẹ hơn. Hay gặp: `Ed25519` (ký), `X25519` (trao khoá), `ECDSA`.

> 💡 **Nhớ nhanh:** cùng độ an toàn, khoá ngắn hơn cả chục lần.

### Key exchange

**Dịch thô:** trao đổi khoá · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Cách hai bên **cùng tính ra một khoá chung** mà khoá đó **không hề đi qua mạng**. Diffie-Hellman (và bản đường cong elliptic **ECDHE**) làm được điều tưởng như vô lý này. Đây là bước cốt lõi của bắt tay TLS.

> 💡 **Nhớ nhanh:** hai người pha ra cùng một màu sơn mà không ai gửi sơn đi.

### Forward secrecy

**Dịch thô:** bí mật chuyển tiếp · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Khoá phiên được sinh mới cho **từng phiên** rồi vứt. Hacker ghi lại traffic hôm nay, mai lấy được private key của server thì vẫn **không giải mã được** phần đã ghi.

> 💡 **Nhớ nhanh:** mỗi cuộc trò chuyện một chìa, xong là đốt.

### Digital signature (chữ ký số)

**Dịch thô:** chữ ký số · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Ký bằng **private key**, cả thế giới xác minh bằng **public key** — ngược chiều với mã hoá. Chứng minh hai việc: **đúng người này gửi** và **nội dung chưa bị sửa**. Khác HMAC ở chỗ bên thứ ba cũng xác minh được.

> 💡 **Nhớ nhanh:** chỉ mình bạn ký được, ai cũng kiểm tra được.

### Certificate (chứng chỉ)

**Dịch thô:** chứng chỉ · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Tệp chứa public key của website + thông tin danh tính + **chữ ký của CA**. Nó trả lời câu hỏi: *"làm sao biết public key này đúng là của `shopify.com`?"*

> 💡 **Nhớ nhanh:** căn cước của website, có dấu của bên bảo lãnh.

### CA (Certificate Authority)

**Dịch thô:** tổ chức phát hành chứng chỉ · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Bên thứ ba mà browser **tin sẵn** (Let's Encrypt, DigiCert…). Browser có sẵn public key của các CA nên kiểm tra được chữ ký trên chứng chỉ. Chứng chỉ tự ký bị báo đỏ vì không có ai đứng ra bảo lãnh.

> 💡 **Nhớ nhanh:** công an cấp căn cước — không phải ai tự in cũng được tin.

### PEM

**Dịch thô:** — · **Gặp ở:** [[04 - Nhan dien chuoi la - Nhin la biet]]

Định dạng text để lưu khoá và chứng chỉ: Base64 kẹp giữa hai dòng `-----BEGIN ...-----` và `-----END ...-----`. Thấy `-----BEGIN PRIVATE KEY-----` trong repo là sự cố bảo mật.

> 💡 **Nhớ nhanh:** thấy `-----BEGIN` là biết đang cầm khoá hoặc chứng chỉ.

### TLS

**Dịch thô:** bảo mật tầng truyền tải · **Gặp ở:** [[03 - Encryption - Giau noi dung]] · [[01 - Tu URL den Pixel - Vong doi mot trang web]]

Lớp bọc mã hoá biến HTTP thành HTTPS. Dùng **bất đối xứng để bắt tay** (trao khoá + kiểm chứng chỉ) rồi **đối xứng để truyền dữ liệu**. Tầng HTTP hoàn toàn không biết bên dưới có TLS hay không. SSL là tên cũ, đã bị thay thế.

> 💡 **Nhớ nhanh:** HTTPS = HTTP + một lớp áo giáp, không phải giao thức khác.

### MITM (Man-in-the-middle)

**Dịch thô:** kẻ đứng giữa · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Kẻ tấn công chen vào giữa client và server để đọc hoặc sửa dữ liệu. TLS + chứng chỉ sinh ra để chặn đúng kiểu tấn công này — nên **tắt verify TLS "cho đỡ lỗi" là mở toang cửa**.

> 💡 **Nhớ nhanh:** người đưa thư bóc trộm rồi dán lại.

### JWT

**Dịch thô:** token web dạng JSON · **Gặp ở:** [[03 - Encryption - Giau noi dung]] · [[04 - Nhan dien chuoi la - Nhin la biet]]

Ba phần `header.payload.signature` nối bằng dấu chấm, hai phần đầu là **base64url**. 🚨 **Được ký chứ không được mã hoá** — payload ai cũng decode đọc được. Đừng bỏ dữ liệu nhạy cảm vào đó.

> 💡 **Nhớ nhanh:** phong bì trong suốt có dấu niêm — chống sửa, không chống nhìn.

### JWS / JWE

**Dịch thô:** JSON đã ký / JSON đã mã hoá · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

**JWS** = chỉ ký (đây là cái mọi người gọi tắt là "JWT"). **JWE** = có mã hoá thật, payload không đọc được. Cần giấu nội dung thì phải dùng JWE, hoặc đơn giản hơn: chỉ để `userId` trong token rồi tra DB.

> 💡 **Nhớ nhanh:** JWT bạn đang dùng gần như chắc chắn là JWS.

### Entropy

**Dịch thô:** độ ngẫu nhiên · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Mức "khó đoán" thật sự của một giá trị. Khoá sinh từ nguồn ngẫu nhiên kém thì dài bao nhiêu cũng vô dụng. Đây là lý do **không bao giờ** dùng `Math.random()` để sinh token hay khoá.

> 💡 **Nhớ nhanh:** khoá mạnh bắt đầu từ ngẫu nhiên thật.

### CSPRNG

**Dịch thô:** bộ sinh số ngẫu nhiên an toàn cho mật mã · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Bộ sinh ngẫu nhiên đủ tốt để làm khoá: `crypto.randomBytes()` (Node), `crypto.getRandomValues()` (browser). `Math.random()` **không** thuộc loại này — đoán trước được.

> 💡 **Nhớ nhanh:** cứ thấy `Math.random()` trong code bảo mật là bug.

### Key rotation

**Dịch thô:** xoay vòng khoá · **Gặp ở:** [[03 - Encryption - Giau noi dung]]

Đổi khoá/secret định kỳ để giới hạn thiệt hại khi lộ. Quan trọng hơn: khi secret đã lên Git thì **phải rotate**, xoá commit là vô ích vì lịch sử đã bị clone đi khắp nơi.

> 💡 **Nhớ nhanh:** lộ rồi thì đổi khoá, đừng chỉ xoá dấu vết.

---

## 📚 Nguồn

- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [MDN — Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Node.js — `crypto`](https://nodejs.org/api/crypto.html)
- [RFC 4648 — Base64](https://datatracker.ietf.org/doc/html/rfc4648) · [RFC 7519 — JWT](https://datatracker.ietf.org/doc/html/rfc7519) · [RFC 8446 — TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [Cloudflare Learning — SSL/TLS](https://www.cloudflare.com/learning/ssl/what-is-ssl/)
