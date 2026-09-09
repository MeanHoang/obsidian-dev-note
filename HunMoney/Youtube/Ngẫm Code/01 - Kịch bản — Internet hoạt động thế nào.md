# 🔵 Kịch bản #01 — Rút điện cục wifi cắm lại, vì sao lại hết lỗi?

> [!quote] 💬
> "Không ai bấm vào một bài giảng. Người ta bấm vào một câu hỏi mà họ từng thắc mắc."
> — Video mở màn Ngẫm Code. Vẫn là bài giảng đầy đủ, nhưng **vào bằng thắc mắc, không vào bằng định nghĩa**.

| | |
|---|---|
| Kênh | 🔵 Ngẫm Code · `@ngamcode` |
| Định dạng | Bài giảng — nhưng **dẫn bằng câu hỏi**, không dẫn bằng mục lục |
| Thời lượng | **13–14 phút** |
| Nguồn | [[01 - How does the internet work]] §1–3 · [[Glossary - Networking]] |
| Vị trí | Video **đầu tiên** của kênh, mở series 6 bài |

---

## 🧨 Nguyên tắc dựng của cả series: câu hỏi trước, lý thuyết sau

> [!danger] ⛔ Cái giết video giảng bài
> Mở bằng *"Hôm nay chúng ta tìm hiểu về mô hình TCP/IP gồm 4 tầng…"* — không ai bấm, và ai lỡ bấm cũng thoát ở giây 15. Người xem chưa có **lý do** để cần biết 4 tầng đó.
> **Cách sửa:** đặt một hiện tượng đời thường họ đã gặp, để họ tự thấy mình không giải thích nổi. Lúc đó lý thuyết mới trở thành **câu trả lời**, không phải bài học.

**Khuôn dùng cho mọi lớp trong video:**

```
① Thắc mắc đời thường  →  ② "Ơ, tôi không giải thích được"  →  ③ Bóc cơ chế  →  ④ Quay lại trả lời câu hỏi
```

Video này có **4 câu hỏi** rải đều, mỗi câu mở một lớp kiến thức. Đó cũng chính là cách đổi nhịp mỗi 60–90 giây mà [[4-Quy trình biến bài học thành video]] yêu cầu — nhưng đổi bằng **nội dung**, không phải bằng chuyển cảnh.

---

## 🗺️ Series: phần 1 — Internet Fundamentals (6 bài giảng)

Mỗi bài **lấy tên theo câu hỏi**, không lấy tên theo chủ đề.

| # | Câu hỏi dẫn | Bóc ra kiến thức gì | Rút từ |
|---|---|---|---|
| **1** | **Rút điện cục wifi cắm lại là hết lỗi — vì sao?** | mạng nội bộ vs Internet, switch/router/modem/ISP/IXP, packet, TCP/IP | [[01 - How does the internet work]] §1–3 |
| 2 | Bấm Enter xong, 200 mili giây đó máy làm gì? | DNS → routing → TCP → TLS → HTTP → render | [[01 - How does the internet work]] §6 |
| 3 | Vì sao đóng tab rồi mở lại mà web vẫn nhớ mình đã đăng nhập? | HTTP stateless, cookie/token, status code, HTTP/2–3 | [[02 - What is HTTP]] |
| 4 | Đổi DNS rồi mà máy vẫn vào IP cũ — ai đang nói dối? | domain, record, CNAME vs A, TTL, propagation | [[03 - What is Domain Name]] + [[05 - DNS and how it works]] |
| 5 | Máy tôi cũng là máy tính — sao không tự chạy web ở nhà? | IP động, NAT, web server, các loại hosting, anycast | [[04 - What is Hosting]] |
| 6 | Trang trắng một nhịp rồi mới hiện chữ — nhịp đó máy làm gì? | DOM/CSSOM, render blocking, raster hoá | [[06 - Browsers and how they work]] |

> [!tip] ✅ Nhịp đã chốt: giữ 2 video/tuần, hai loại khác nhau
> | Thứ | Loại | Thời lượng | Công |
> |---|---|---|---|
> | **T2** | 🎓 **Bài giảng** — series này | 15–18 phút | ~3 tiếng |
> | **T3** | 🔧 **Bài ngắn** — bug thật gặp trong tuần | 6–8 phút | ~80 phút |
>
> Tổng ~4,5 tiếng/tuần cho riêng Ngẫm Code. Nặng, nhưng hai loại này **không giành nguyên liệu của nhau**: bài giảng rút từ note có sẵn trong vault, bài ngắn rút từ việc đang làm. Bài ngắn cũng là chỗ giữ đúng ngách "vấn đề của người đang đi làm" mà [[0-Sổ tay Ngẫm Code]] yêu cầu — series bài giảng một mình sẽ kéo kênh về tệp người mới học.
>
> **Van xả:** nếu ngân hàng video tụt dưới 3, bỏ **T3** trước, giữ T2. Đừng bỏ bài giảng — nó là cái có series, đứt giữa chừng là mất cả mạch.

---

## ② Đóng gói — chốt trước khi viết dàn ý

**Tiêu đề:**
> `Rút điện cục wifi cắm lại là hết lỗi — vì sao trò này luôn ăn?`

Dự phòng: *"Cục wifi nhà bạn thực ra là 3 thiết bị"* · *"Mất mạng: rút điện cục wifi chữa được đúng 1 trong 3 trường hợp"*

> [!danger] ⛔ Nguyên tắc đặt tiêu đề: chỉ dùng từ người xem ĐANG dùng
> Đây là chỗ tiêu đề trước hỏng. `Wifi đầy vạch mà không vào được mạng` còn ổn, nhưng mọi phương án có chữ **modem** đều chết — **đa số người xem không biết modem là cái gì**, và không ai bấm vào một câu chứa từ mình không hiểu.
> Họ gọi nó là **"cục wifi"**. Vậy tiêu đề gọi nó là cục wifi.
> Ngược lại — chính việc họ không biết modem là gì lại là **cú lật hay nhất của video**: cái "cục wifi" đó thực ra là **ba thiết bị gộp làm một**. Đừng tiêu ở tiêu đề thứ đáng để dành tới phút thứ 2.

**Thumbnail** — nền 🔵 `#2563EB`, sans-serif đậm, kiểm tra ở **210×118px**:
```
Trái:  cục wifi (4 cái râu) — ảnh thật hoặc vẽ, đang bị RÚT DÂY nguồn
Phải:  dấu ? to
Chữ:   VÌ SAO NÓ ĂN?
```
Đọc được ở 210px và tự nó đã là câu hỏi. Không dùng quả địa cầu xanh có mạng lưới sáng.

**Mô tả — 2 câu đầu chứa từ khoá:**
> Mất mạng, rút điện cục wifi cắm lại, tự nhiên chạy — vì sao? Vì cục wifi nhà bạn thực ra là ba thiết bị gộp làm một (modem + router + switch), và động tác rút điện chỉ chữa được đúng một trong ba chỗ có thể đứt.
> Video bóc từ mạng nội bộ, ISP, IXP tới packet và mô hình TCP/IP, rồi chỉ 3 lệnh để tự chẩn mất mạng ở tầng nào. Bài 1 trong series Internet Fundamentals cho backend developer.

---

## ③ Dàn ý — 4 câu hỏi, ~13:40

| Khối | Mốc | Câu hỏi dẫn |
|---|---|---|
| Hook | 0:00–0:25 | ❓1 Rút điện cục wifi vì sao lại ăn? |
| Lớp 1 | 0:25–3:30 | (trả lời ❓1) → cục wifi = 3 thiết bị, LAN vs Internet, ISP |
| Lớp 2 | 3:30–6:30 | ❓2 Nhắn cho người ngồi đối diện, tin đi bao xa? → IXP, Tier, sơ đồ chữ V |
| Lớp 3 | 6:30–9:00 | ❓3 Đang tải file 2GB sao vẫn xem được YouTube? → packet |
| Lớp 4 | 9:00–11:00 | ❓4 Gọi video méo tiếng vs tải file chậm — sao khác nhau? → TCP/IP, TCP vs UDP |
| **Chỗ tôi sai** | 11:00–12:20 | — |
| Chốt + payoff | 12:20–13:40 | 3 lệnh tự chẩn tầng hỏng |

---

### 🎣 Hook — 0:00–0:25 · ❓1

Mặt mình. Không slide, không chào.

> "Mất mạng. Wifi vẫn đầy bốn vạch, máy vẫn báo đã kết nối, mà mở web thì quay mãi.
> Bạn làm cái động tác mà cả nước đều làm: **rút điện cục wifi, đợi mười giây, cắm lại.** Xong. Chạy.
> Không ai dạy bạn trò này. Bạn cũng không biết vì sao nó ăn. Nhưng nó ăn thật.
> Trong mười ba phút tới tôi sẽ nói cho bạn biết lúc đó **thực sự** có chuyện gì xảy ra bên trong cái cục đó. Và bạn sẽ thấy nó chữa được đúng **một** trong ba chỗ có thể đứt — hai chỗ còn lại thì rút cả ngày cũng vô ích."

> [!tip] 💡 Vì sao hook này ăn
> Nó không hứa kiến thức, nó hứa **giải thích một thứ bạn đã sống cùng** và vẫn đang làm theo kiểu mê tín. Người xem ở lại vì tò mò về đời mình, không vì muốn học networking.
> Câu cuối là chỗ cài **căng thẳng**: hoá ra cái trò tủ của mình chỉ đúng một phần ba. Đó là lý do họ xem tiếp thay vì thoả mãn rồi thoát.

### ⚙️ Lớp 1 — 0:25–3:30 · Trả lời ❓1

#### Cú lật: cái "cục wifi" không phải một thiết bị

Đây là chỗ mạnh nhất của cả video — **đa số người xem chưa từng biết điều này**, kể cả dev.

> "Trước khi trả lời, phải nói một chuyện. Cái cục bốn râu nhà bạn — cái mà ai cũng gọi là 'cục wifi' — thực ra **không phải một thiết bị**. Nó là **ba thiết bị nhét chung một cái vỏ**. Nhà mạng gộp lại cho gọn, và vô tình làm cả nước tưởng nó là một thứ."

Mở vỏ ra bằng sơ đồ, giới thiệu từng phần **kèm việc nó làm**, không kèm định nghĩa:

| Gọi là | Việc nó làm | Nếu chỉ phần này hỏng thì |
|---|---|---|
| **Switch** | cho các máy trong nhà nói chuyện với nhau | máy in mạng, TV không thấy nhau |
| **Router** | quyết định gói tin nào đi ra ngoài, đi đường nào | trong nhà vẫn ổn, ra ngoài thì tắc |
| **Modem** | dịch tín hiệu trong nhà ↔ tín hiệu trên dây nhà mạng | mất hẳn đường ra thế giới |

Cộng thêm **cục phát sóng Wifi** — thứ tạo ra bốn vạch kia, và cũng nằm trong cùng cái vỏ đó.

> "Nên bốn vạch sóng chỉ nói đúng một điều: máy bạn nối được tới **cái vỏ**. Nó không nói gì về việc bên trong cái vỏ, ba thằng kia có làm việc hay không — càng không nói gì về nhà mạng ngoài đường."

#### Rồi mới dựng ngược lại: vì sao phải có ba thứ đó

Vẽ dần trên màn hình, mỗi bước sinh ra từ **một vấn đề**, không từ một định nghĩa:

| Bước | Vấn đề | Thứ sinh ra để giải |
|---|---|---|
| 2 máy nối dây | — | dây |
| 10 máy | nối chéo hết = 45 sợi dây | **switch** |
| 2 mạng muốn nói chuyện với nhau | switch không biết gì về mạng bên kia | **router** |
| Ra khỏi nhà | tín hiệu trong nhà ≠ tín hiệu trên dây nhà mạng | **modem** |
| Ra cả thế giới | không ai kéo dây riêng tới từng nhà | **ISP** — nhà mạng |

> [!tip] 💡 Đây là cách trả "modem" về đúng chỗ
> Người xem vào video không biết modem là gì. Ra khỏi video họ biết — **không phải vì bạn định nghĩa nó**, mà vì họ vừa thấy nó sinh ra từ một vấn đề cụ thể. Đó là khác biệt giữa bài giảng và giáo trình.

#### Quay lại trả lời ❓1

> "Vậy rút điện thì chuyện gì xảy ra? Cái modem **xin lại địa chỉ mới** từ nhà mạng và dựng lại phiên kết nối từ đầu. Không phải 'máy nghỉ cho mát'.
> Nghĩa là nó chỉ chữa đúng một loại lỗi: **phiên kết nối giữa nhà bạn và nhà mạng bị treo.**
> Còn nếu đứt trong nhà, hoặc nhà mạng vẫn nối nhưng **DNS chết** — rút cả buổi cũng thế. Ba kiểu đứt, cùng một hiện tượng, và bạn đang chữa cả ba bằng đúng một động tác. Cuối video tôi chỉ ba lệnh để phân biệt."

### 🌍 Lớp 2 — 3:30–6:30 · ❓2

> "Câu hỏi thứ hai. Bạn với người bạn ngồi đối diện trong cùng quán cà phê, cùng dùng Viettel. Bạn nhắn cho họ một tin.
> Tin nhắn đó đi bao xa? Một mét? Hay nửa vòng Trái Đất?"

Để im một nhịp. Rồi bóc:

- Ngày xưa, không có IXP: FPT gửi cho Viettel phải **vòng ra Singapore hoặc Hong Kong rồi quay ngược về** — hai người cách nhau một cái bàn, dữ liệu đi mấy nghìn cây số.
- Có **IXP** (ở VN là VNIX): các nhà mạng cắm chung một chỗ, trao thẳng cho nhau. Nhanh, gần, gần như miễn phí.
- Từ đó dựng **Tier 1/2/3**: Tier 1 ra được cả thế giới mà không trả tiền cho ai; Viettel/VNPT/FPT là Tier 2 (mua transit quốc tế + peering nội địa); VN không có Tier 1 nào.

> [!danger] ⛔ Đính chính bắt buộc: Internet KHÔNG phải cái cây
> **Google không nằm ở đỉnh.** Bạn và server Google **cùng ở rìa**. Gói tin đi hình chữ V — leo lên vừa đủ cao để đi nhờ đường dài, rồi tụt xuống phía đích.
> Câu thần chú đọc nguyên văn lên video: *"Leo lên chỉ để đi nhờ, không phải để về gốc. Đích đến ở rìa bên kia, ngang hàng với mình."*

Vẽ sơ đồ chữ V — tự vẽ trực tiếp, nét đơn giản.

Quay lại trả lời ❓2: *"Nên câu trả lời là: tuỳ. Cùng nhà mạng thì đi vài cây số. Khác nhà mạng mà không qua IXP thì có thể đi vài nghìn. Không ai sở hữu Internet — nó là thoả thuận nối với nhau giữa hàng nghìn mạng độc lập, và các thoả thuận đó quyết định tin nhắn của bạn đi đường nào."*

### 📦 Lớp 3 — 6:30–9:00 · ❓3

> "Câu thứ ba, cái này gần như ai cũng làm mà không để ý. Bạn đang tải một file 2GB. Cùng lúc đó vẫn mở YouTube xem được, vẫn nhắn tin được.
> Nhưng ra khỏi nhà bạn chỉ có **một sợi dây**. Sao ba thứ đó chen nhau trên một sợi dây mà không thứ nào phải xếp hàng đợi thứ kia xong?"

**Ví dụ đời sống — hệ thống bưu điện 📮:**

```
Gửi nguyên một cái tủ → không nhét vừa, và xe hỏng là mất trắng cả tủ
→ Tháo rời, đóng 20 kiện, mỗi kiện dán: gửi từ đâu, tới đâu, kiện số mấy trên 20
→ Các kiện đi các chuyến xe khác nhau, tới nơi lắp lại theo số thứ tự
→ Thiếu kiện số 7? Gửi lại đúng kiện số 7. Không gửi lại cả cái tủ.
```

Ba điều rút ra:
1. **Packet nhỏ** nên không ai chiếm dụng đường cả tiếng — file 2GB của bạn bị cắt thành hàng triệu mảnh, và YouTube chen vào giữa các mảnh đó.
2. **Header** (từ đâu / tới đâu / số thứ tự) là lý do packet tự tìm được đường.
3. Mất một packet chỉ gửi lại packet đó — gốc của mọi cơ chế tin cậy.

Xen luôn **ba loại địa chỉ** ở đây, vì header cần chúng:

| Địa chỉ | Ai cấp | Đổi không | Ví như |
|---|---|---|---|
| **MAC** | nhà sản xuất, gắn chết vào card mạng | không | số khung xe |
| **IP** | ISP / router cấp | có | địa chỉ nhà đang thuê |
| **Domain** | bạn thuê qua registrar | do bạn | biển hiệu |

### 🧱 Lớp 4 — 9:00–11:00 · ❓4

> "Câu cuối. Gọi video cho người thân ở xa — hình vỡ, tiếng méo, nhưng nó **không bao giờ dừng lại đợi**. Còn tải một file thì có thể chậm rề, nhưng file tải xong **không bao giờ thiếu một byte**.
> Cùng chạy trên một đường dây. Vì sao hai thứ hành xử ngược nhau như vậy?"

Vì chúng dùng **hai chuẩn khác nhau ở cùng một tầng** — và đó là lúc giới thiệu mô hình 4 tầng, mỗi tầng giải đúng một việc:

| Tầng | Câu hỏi nó trả lời | Chuẩn tiêu biểu |
|---|---|---|
| Application | dữ liệu này *nghĩa là gì* | HTTP, SMTP, DNS |
| Transport | có tới nơi không, đúng thứ tự không | **TCP** / **UDP** |
| Internet | đi đường nào tới máy kia | IP |
| Link | đẩy bit qua dây / sóng | Ethernet, Wi-Fi |

- **TCP**: bắt tay trước, đánh số, thiếu thì đòi lại → web, mail, tải file. Đổi lại: phải **chờ**.
- **UDP**: bắn đi, không hỏi lại → gọi video, game. *"Trong cuộc gọi, một khung hình đến muộn 2 giây thì đến làm gì nữa."*

> [!warning] ⚠️ Đính chính: "TCP/IP" không phải một chuẩn
> Rất nhiều người tưởng TCP là chuẩn của cả Internet. Không — **TCP chỉ là chuẩn của một tầng**, và ngay tầng đó nó đã có đối thủ là UDP. Nói rõ chỗ này vì nó là nền cho các video sau.

### ⭐ Chỗ tôi sai — 11:00–12:20

Khối bắt buộc, và là đoạn giữ chân tốt nhất. Chọn một, **kể thật, có mốc thời gian cụ thể**:

- Từng vẽ Internet như cái cây, các ông lớn nằm ở đỉnh — đọc tới phần Tier mới thấy mình vẽ ngược: đích đến nằm **ngang hàng**, ở rìa bên kia.
- Từng tưởng "mất mạng" là một tình trạng duy nhất, nên xử lý bằng đúng một động tác là rút điện modem — kể cả những lần vấn đề nằm ở DNS, rút điện chẳng liên quan gì.
- *(Điền mốc thật: hôm nào, đang làm gì, đọc tới đâu thì khựng lại.)*

Giữ lại một chỗ chưa chắc:
> "Phần peering giữa các Tier 1 vì sao lại miễn phí, tới giờ tôi vẫn chưa hiểu hết phần kinh tế đằng sau."

### 🎯 Chốt + payoff — 12:20–13:40

Quay lại đúng câu hỏi mở đầu, và **trả cho người xem một thứ dùng được ngay** — quay terminal thật:

```
① ping 192.168.1.1        ← router nhà bạn. Fail = hỏng trong nhà (lớp 1)
② ping 8.8.8.8            ← IP ngoài. Fail = đứt phía nhà mạng (lớp 2)
③ nslookup google.com     ← ②ok mà ③fail = mạng vẫn sống, DNS chết
```

> "Ba lệnh, ba tầng. Lần sau mất mạng, bạn không đoán nữa — bạn biết nó đứt ở đâu. Và cái trò rút điện cục wifi ăn đúng ở trường hợp số hai. Trường hợp một và ba thì rút cả ngày cũng vô ích."

- Câu rút gọn: **"Internet không phải một cái máy. Nó là các tầng, mỗi tầng giải đúng một việc — nên hỏng ở đâu cũng luôn hỏng ở một tầng cụ thể."**
- Gợi video sau: *"Vậy khi mọi tầng đều ổn, bấm Enter xong 200 mili giây đó máy làm gì? Video sau tôi bóc đủ 7 bước."*
- End screen trỏ sang một video của kênh Ngẫm khác.

---

## 🎬 Ghi chú hình ảnh

~70% màn hình/sơ đồ · ~30% mặt. Mỗi câu hỏi mới **phải cắt về mặt** — đó là chỗ đổi nhịp tự nhiên nhất.

| Mốc | Hình |
|---|---|
| 0:00–0:25 | **mặt**, tay **cầm cục wifi thật** — đạo cụ này gánh cả hook |
| 0:25–3:30 | cận cảnh cục wifi thật → sơ đồ "mở vỏ" thành 3 khối → vẽ dần nhà → ISP |
| 3:30–3:40 | **mặt** (❓2) |
| 3:40–6:30 | sơ đồ IXP + sơ đồ chữ V, vẽ trực tiếp |
| 6:30–6:40 | **mặt** (❓3) |
| 6:40–9:00 | sơ đồ bưu điện tự vẽ + bảng 3 loại địa chỉ |
| 9:00–9:15 | **mặt** (❓4) |
| 9:15–11:00 | sơ đồ 4 tầng, tô sáng dần từng tầng |
| 11:00–12:20 | **mặt** — khối "chỗ tôi sai" phải nhìn thấy người |
| 12:20–13:40 | **terminal thật**, chạy 3 lệnh, để nguyên output |

> [!tip] 💡 Vẽ trực tiếp thay vì chuẩn bị slide
> Slide làm sẵn nghe như đọc bài. Vẽ dần trên màn hình vừa nhanh hơn (khỏi dựng slide), vừa ép nhịp nói chậm lại, vừa là nội dung gốc 100%.

---

## ③½ Lọc giọng AI — 5 phút, không được bỏ

Đọc to cả dàn ý. Chỗ nào ngượng mồm là chỗ giọng AI.

**Ctrl-F xoá:** Tuy nhiên · Bên cạnh đó · Hơn nữa · Ngoài ra · Nhìn chung · Có thể thấy rằng · vô cùng · cực kỳ · đáng kể · "Trong thời đại công nghệ hiện nay" · "Hy vọng video này hữu ích".

**Bẫy riêng của bài giảng — giọng giáo trình.** Dấu hiệu: câu nào cũng đủ chủ–vị, dài đều nhau. Chữa bằng cách chèn câu 3 chữ, và nói với **một đồng nghiệp cụ thể** trong đầu.

```
❌ Giọng giáo trình
   "Switch là thiết bị mạng có chức năng kết nối nhiều thiết bị trong cùng
    một mạng cục bộ. Bên cạnh đó, router đóng vai trò kết nối các mạng khác nhau."

✅ Giọng người
   "Mười cái máy mà nối chéo hết là bốn mươi lăm sợi dây. Không ai làm thế.
    Nên người ta cắm hết vào một cái hộp — cái hộp đó là switch.
    Router thì khác. Nó không nối máy với máy, nó nối MẠNG với MẠNG."
```

---

## 📱 Clip TikTok — 60–90 giây, quay ngay sau bản dài

**Không phải bản rút gọn.** Một câu hỏi, một câu trả lời, trọn vẹn.

```
0–3s   Cầm cục wifi trên tay, chữ to trên hình, đọc luôn:
       "Cục này KHÔNG phải một thiết bị."
3–25s  Nó là BA thứ nhét chung một vỏ:
       switch (máy trong nhà nói với nhau)
       router (quyết định đi ra đường nào)
       modem (dịch tín hiệu ra dây nhà mạng)
25–55s Nên 4 vạch sóng chỉ nói: bạn nối được tới CÁI VỎ.
       Rút điện cắm lại = ép modem xin lại địa chỉ mới từ nhà mạng.
       Chữa được đúng 1 trong 3 chỗ có thể đứt.
55–75s Chốt trọn vẹn: "Hai chỗ còn lại thì rút cả ngày cũng vô ích.
       Lần sau bạn biết mình đang chữa cái nào."
```

Không kết bằng "xem full ở kênh nhé" — người chưa biết bạn là ai xem xong vẫn phải học trọn một thứ.

---

## 🔗 Liên quan

- Quy trình gốc: [[4-Quy trình biến bài học thành video]] · Bộ lọc & lời hứa: [[2-Tầm nhìn và mục tiêu hệ Ngẫm]]
- Sổ tay kênh: [[0-Sổ tay Ngẫm Code]] · Lịch: [[3-Lịch sản xuất hàng tuần]]
- Note nguồn: [[01 - How does the internet work]] · [[00 - Tổng hợp (Internet Fundamentals)]] · [[Glossary - Networking]]

---

## ✅ Checklist trước khi bấm ghi

- [ ] Video mở bằng **hiện tượng**, không mở bằng định nghĩa
- [ ] Tiêu đề + hook **chỉ dùng từ người xem đang dùng** ("cục wifi"), không có từ họ chưa biết
- [ ] Mỗi thuật ngữ (switch/router/modem/ISP) xuất hiện **sau khi** đã thấy vấn đề nó giải, không xuất hiện dưới dạng định nghĩa
- [ ] Có **cục wifi thật** cầm trên tay ở hook
- [ ] Mỗi lớp có **câu hỏi riêng** dẫn vào — kiểm tra đủ 4 câu
- [ ] Mỗi câu hỏi đều được **quay lại trả lời**, không bỏ lửng
- [ ] Tiêu đề + thumbnail **đã chốt**, kiểm tra thumbnail ở **210×118px**
- [ ] Hook 25 giây: **không chào hỏi, không xin đăng ký**
- [ ] Sơ đồ **vẽ trực tiếp**, không paste hình làm sẵn
- [ ] Có khối **"Chỗ tôi sai"** với **một mốc thời gian thật**
- [ ] Giữ ít nhất một chỗ **"tôi vẫn chưa chắc"**
- [ ] Cắt về **mặt** ở mỗi câu hỏi mới
- [ ] Payoff cuối: chạy **3 lệnh thật** trên terminal, để nguyên output
- [ ] Đọc to cả dàn ý, Ctrl-F xoá từ nối trang trọng + tính từ rỗng
- [ ] Lúc ghi: **không cắt sạch chỗ vấp**
- [ ] Quay clip TikTok **ngay sau** bản dài, máy vẫn đang bật
- [ ] Xuất **`.srt` rời** và upload làm caption
- [ ] Mô tả có **2 câu đầu chứa từ khoá**
- [ ] **Hẹn giờ đăng**, không đăng ngay
