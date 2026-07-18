# 01 — Internet hoạt động như thế nào?

> Bài mở đầu series [Road to Backend Developer](https://roadmap.sh/backend). Nền tảng của mọi thứ backend — Firebase, Cloud Run, Shopify app... đều chạy trên "đường ống" này.
>
> 📖 Thuật ngữ khó tách riêng ở [[Glossary - Networking]].

## 0. Câu hỏi cốt lõi

Khi bạn gõ `google.com` + Enter, **chuyện gì thực sự xảy ra** giữa máy bạn và một máy tính ở nửa vòng trái đất? Đó chính là Internet.

> **Định nghĩa 1 câu:** Internet là **"mạng của các mạng" (network of networks)** — hàng tỷ máy tính nối với nhau bằng dây/sóng, cùng nói chung một "ngôn ngữ" (protocol) để trao đổi dữ liệu.

---

## 1. Internet *thực chất* là cái gì? (xây từ 2 máy tính lên)
> Nguồn: [MDN – How does the Internet work](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work) & [roadmap.sh](https://roadmap.sh/guides/what-is-internet). Cách xây dựng dưới đây bám theo MDN — đi **từ nhỏ đến lớn** để không hiểu lầm.

Internet **không phải "trên mây"** — nó **vật lý, sờ được**: dây cáp và các cục máy tính. Ta xây dần:

### 1.1. Bước 1 — Hai máy tính nối với nhau
Muốn 2 máy "nói chuyện", phải **nối chúng lại**, bằng dây (cáp Ethernet) hoặc không dây (WiFi/Bluetooth). Đó đã là một "mạng" nhỏ nhất rồi. Dữ liệu chạy qua là các **bit** (0 và 1) dưới dạng tín hiệu điện / ánh sáng / sóng.

### 1.2. Bước 2 — Nhiều máy → cần SWITCH
Nối 10 máy mà đấu dây từng-cặp-với-nhau thì rối tung. Giải pháp: mỗi máy cắm vào một cục nhỏ gọi là **[[Glossary - Networking#Switch|switch]]**.
> MDN ví: *switch giống người gác ga xe lửa* — tin nhắn từ máy A gửi đi, switch đảm bảo **chỉ tới đúng máy đích B**, không phun ra cho cả đám.

Một nhóm máy nối qua switch = một **mạng nội bộ (LAN)** (nhà bạn, văn phòng).

> **⚠️ LAN ≠ Internet.** LAN là mạng **khép kín trong nhà**; Internet là **thế giới bên ngoài**. LAN chỉ là *viên gạch* để xây nên Internet.
>
> **Ví dụ siêu đơn giản — bạn có 1 laptop + WiFi:**
> - Trong nhà có 2 thứ: **laptop** + **cục WiFi (router)**.
> - **LAN = laptop + cục WiFi + mọi thiết bị đang nối WiFi đó** (điện thoại, TV, máy in...). Chỉ 1 laptop thôi vẫn là LAN.
> - Đường đi khi vào YouTube:
> ```
> Laptop ──WiFi──> Cục WiFi (router) ──dây nhà mạng──> ISP ──> Internet ──> YouTube
> └──────── LAN (trong nhà) ────────┘ └─────── ra ngoài Internet ───────┘
> ```
> - **Cục WiFi đứng ở cửa ngõ:** một chân trong LAN (nói với laptop), một chân ra ISP (nối Internet).
> - **Bằng chứng LAN khép kín:** nếu có máy in WiFi, bạn **vẫn in được khi mất mạng Internet** — vì laptop → máy in chỉ đi trong LAN, không cần ra ngoài.
>
> 🔑 Một câu: *LAN = mạng nhỏ trong nhà (laptop + cục WiFi). Internet = thế giới bên ngoài mà cục WiFi nối bạn tới.*

### 1.3. Bước 3 — Nối các LAN với nhau → cần ROUTER
**[[Glossary - Networking#Router|Router]]** chỉ làm **ĐÚNG 1 việc: nối mạng-của-bạn với một MẠNG KHÁC.**
> MDN ví: *router giống bưu điện* — gói tin tới, nó đọc địa chỉ người nhận và **chuyển tiếp gói sang đúng mạng đích**.

**"Nối mạng với mạng" và "nối ra Internet" là CÙNG một việc, đừng nghĩ là hai việc khác nhau:**
- Nối **LAN nhà bạn ↔ LAN nhà hàng xóm** → mạng-với-mạng ✅
- Nối **LAN nhà bạn ↔ mạng của ISP (Viettel/FPT)** → **cũng là** mạng-với-mạng ✅. Chỉ khác: mạng ISP này lại nối tiếp tới hàng nghìn mạng khác = **Internet**.

→ Nên câu *"router giúp ra Internet"* thực chất = *"router nối mạng nhà bạn với mạng ISP"*. **Ra thế giới chỉ là KẾT QUẢ**, vì mạng ISP đó dẫn tới tất cả mạng còn lại. Router không phân biệt "gần hay xa" — nó chỉ lo đưa gói **ra khỏi mạng của bạn**.

*(Ví đời sống: router = **cửa chính nhà bạn**. Đi sang nhà hàng xóm hay ra phố lớn đi khắp thế giới — đều qua cửa chính đó. Cửa chính chỉ lo "đưa bạn ra khỏi nhà"; đi được tới đâu là nhờ hệ thống đường phố = ISP bên ngoài.)*

> **Đừng lẫn:** Switch nối máy trong *cùng* một mạng; Router nối *các mạng khác nhau*.

### 1.4. Bước 4 — Nối ra cả thế giới → ISP → "mạng của các mạng"
Không thể tự kéo dây tới từng nhà trên Trái Đất. Nên bạn nối mạng của mình vào một **[[Glossary - Networking#ISP|ISP]] (Internet Service Provider)** — công ty quản một đống router **nối với nhau, và nối tiếp tới router của các ISP khác**.
> MDN: *"message từ mạng của bạn được vận chuyển qua mạng-của-các-ISP tới mạng đích. Internet chính là toàn bộ hạ tầng mạng lưới này."*

**❓ Các ISP có nối với nhau không? → CÓ, bắt buộc. Và đây là điều làm nên Internet.**

Nếu các ISP **không** nối nhau, mỗi ISP là **một ốc đảo tách biệt:**
- ❌ Bạn dùng **FPT** → chỉ với tới người/web cũng dùng FPT. **Không** vào được Facebook, **không** nhắn được cho bạn dùng Viettel, **không** mở web đặt ở nước ngoài. Internet vỡ vụn thành nhiều mảnh rời.
- ✅ Vì ISP **có** nối nhau → gói tin của bạn (FPT) đi xuyên FPT → sang Viettel/Google/... → tới đích. Bạn với tới **bất kỳ ai trên Trái Đất**, dù họ ở nhà mạng nào, nước nào.

**Tác dụng:** biến các mạng rời rạc thành **MỘT Internet thống nhất**. Chữ "of" trong "network **of** networks" chính là **các kết nối giữa ISP**. (Cách nối cụ thể — *peering* & *transit* — xem mục 1.6.)

*Ví dụ 1 dòng:* bạn (FPT) nhắn bạn bè (Viettel): tin đi **FPT → điểm nối FPT–Viettel → Viettel → máy bạn bè**. Không có "điểm nối" đó, tin không bao giờ tới.

→ Đây là lý do gọi Internet là **"network of networks" (mạng của các mạng)**: hàng nghìn mạng độc lập nối lại, **không có trung tâm** (đã bàn ở phần "không phải cây" trước đó).

### 1.5. Vượt đại dương bằng gì?
Không phải vệ tinh (đa số). **Phần lớn lưu lượng liên lục địa đi qua CÁP QUANG NGẦM DƯỚI BIỂN ([[Glossary - Networking#Submarine cable|submarine cables]])** — dây cáp thật nằm dưới đáy đại dương nối các châu lục. Việt Nam nối ra thế giới qua vài tuyến cáp biển (AAG, APG...) — tin *"cáp quang biển đứt, mạng quốc tế chậm"* chính là mấy tuyến này.

**Ba loại "dây" truyền bit:**
- **Cáp đồng (Ethernet):** xung **điện**. Dây RJ45 cắm vào router.
- **Cáp quang (fiber):** xung **ánh sáng** — nhanh, đi xa, ít nhiễu. Là xương sống Internet.
- **Sóng vô tuyến (WiFi, 4G/5G):** **sóng điện từ** — không dây, nhưng chỉ chặng cuối; sau cột sóng vẫn là cáp.

### 1.6. Cấu trúc phân tầng của ISP (Tier 1/2/3)

⚠️ **Hiểu lầm cần tránh ngay:** Internet **KHÔNG phải cái cây** chụm về một "gốc" (Google **không** ở đỉnh). **Bạn và server Google nằm CÙNG một tầng** — đều là "rìa" của mạng (bạn = client, Google = server). Gói tin đi theo **hình chữ V**: leo lên **vừa đủ cao** để tìm đường nối chung, rồi **tụt xuống** phía đích:

```
         Tier 1 (xương sống) ───── Tier 1 khác
               ▲                        │
   (leo LÊN vừa đủ)                     │  (rồi TỤT xuống)
               │                        ▼
     Viettel (Tier 2)          Mạng của Google (Tier 2)
               ▲                        │
               │                        ▼
      Router nhà bạn              Server Google
               ▲                        │
               │                        ▼
         MÁY BẠN ──────(gói tin đi)────► GOOGLE
        (client, rìa)                (server, rìa)
```

**Đọc hình:** đi **LÊN** bên trái (nhà bạn → Viettel → Tier 1), sang ngang, rồi đi **XUỐNG** bên phải (Tier 1 → mạng Google → server). Tier 1 chỉ là **trạm trung chuyển ở giữa để đi nhờ đường dài**, KHÔNG phải nơi chứa Google. Nếu gửi cho người cùng Viettel thì **khỏi leo lên Tier 1** — đi tắt qua IXP nội địa.

> 🔑 Câu thần chú: *"Leo lên chỉ để đi nhờ, không phải để về gốc. Đích đến ở rìa bên kia, ngang hàng với mình."*

- **Tier 1:** vài "ông lớn" sở hữu cáp xương sống toàn cầu, nối trực tiếp với nhau miễn phí (*[[Glossary - Networking#Peering|peering]]*).
- **[[Glossary - Networking#IXP|IXP]] (Internet Exchange Point):** "chợ đầu mối" nơi nhiều ISP cắm chung một chỗ để trao đổi dữ liệu cho gần, nhanh, rẻ.

#### Ví dụ mô hình IXP cho dễ nhìn 🖼️

Tưởng tượng ở Hà Nội có một IXP tên **VNIX**. Các nhà mạng VN đều cắm dây vào đó:

```
        FPT ─────┐
                 │
     Viettel ────┤        ┌─────────────────┐
                 ├────────┤   IXP (VNIX)     │   ← "chợ đầu mối" đặt tại VN
       VNPT ─────┤        │  1 switch to lớn │
                 │        └─────────────────┘
     CMC/... ────┘
```

**Không có IXP — bạn (FPT) gửi mail cho bạn bè (Viettel):**
```
Bạn (FPT) → ra tận ISP Tier 1 ở Singapore/HongKong → vòng ngược về Viettel VN
(đi lòng vòng nửa vòng khu vực dù hai người ở cùng Hà Nội → chậm, tốn tiền)
```

**Có IXP — cùng dữ liệu đó:**
```
Bạn (FPT) → VNIX (ngay tại HN) → Viettel  ✅ nhanh, gần, gần như miễn phí
```

> Ý chính: IXP là **điểm hẹn chung** để các ISP trong cùng khu vực trao dữ liệu **trực tiếp** cho nhau, khỏi phải vòng ra nước ngoài. Càng nhiều ISP cắm vào 1 IXP → traffic nội vùng càng nhanh & rẻ. (VN thật có **VNIX** do VNNIC vận hành; nổi tiếng thế giới có **DE-CIX** ở Frankfurt, **AMS-IX** ở Amsterdam.)

#### Tier 1 / 2 / 3 là ai? Có phải luôn 3 tầng không?

**Quan trọng:** "3 tier" chỉ là **cách vẽ đơn giản cho dễ hiểu**. Thực tế Internet là một **mạng lưới chằng chịt (mesh)**, không phải cầu thang 3 bậc gọn gàng. Cái quyết định một ISP thuộc "tier" nào là **nó lấy đường ra Internet bằng cách nào:**

| | Định nghĩa | Trả tiền cho ai? | Ví dụ thật |
|---|---|---|---|
| **Tier 1** | Với tới **toàn bộ** Internet **chỉ bằng peering** (nối ngang, đổi traffic miễn phí), **không phải mua đường của ai** | Không ai — đỉnh của chuỗi | Lumen (Level 3), AT&T, NTT, Tata, Telia, GTT, Cogent, Zayo, Verizon |
| **Tier 2** | Có peering với một số mạng, **nhưng vẫn phải mua transit** của Tier 1 để với tới phần còn lại | Mua transit của Tier 1 | Đa số ISP lớn quốc gia — **Viettel, VNPT, FPT** (mua đường quốc tế của Tier 1) |
| **Tier 3** | Chỉ **mua transit**, không peering, bán lẻ tới người dùng cuối | Mua của Tier 2/1 | ISP địa phương nhỏ, mạng doanh nghiệp |

**Cách nhớ:**
- **Tier 1** = "ông trùm", ra được cả thế giới mà **không trả tiền cho ai** — chỉ đổi ngang với các ông trùm khác.
- **Tier 2** = "vừa mua vừa bán": mua đường của Tier 1 để ra quốc tế, đồng thời peering nội vùng cho rẻ (đây là lý do họ cắm vào IXP như VNIX).
- **Tier 3** = "chỉ mua": bán Internet tới nhà bạn.

**Có thể nhiều hơn 3 tầng không?** → **Có.** Số "tầng" thực tế **co giãn**: một gói tin có thể đi qua 2 hop hoặc 6-7 mạng trung gian tùy đích. "3 tier" chỉ là khung tư duy. Ngoài ra ranh giới ngày càng mờ vì các hãng nội dung lớn (Google, Netflix, Cloudflare, Meta) **tự xây mạng riêng và peering thẳng** với ISP — không còn khớp mô hình tier cũ nữa.

> Với Việt Nam: **Viettel / VNPT / FPT** thường được xếp **Tier 2** (mua transit quốc tế của các Tier 1, đồng thời peering nội địa qua VNIX). Không có Tier 1 nào của VN.

> **Chốt:** "Internet" = hạ tầng dây cáp + router + ISP + IXP nối tất cả lại. Không có công ty nào "sở hữu Internet" — nó là thỏa thuận kết nối giữa hàng nghìn mạng độc lập.

---

## 2. Máy tính kết nối & "nói chuyện" với nhau như thế nào?

### 2.1. Ví dụ đời sống: Hệ thống bưu điện 📮

| Đời thực (bưu điện)                       | Internet                            |
| ----------------------------------------- | ----------------------------------- |
| Địa chỉ nhà người nhận                    | **[[Glossary - Networking#IP address\|IP address]]**                      |
| Số căn hộ cụ thể trong tòa nhà            | **[[Glossary - Networking#Port\|Port]]**                            |
| Số CMND dán cứng trên thùng hàng          | **[[Glossary - Networking#MAC address\|MAC address]]** (địa chỉ phần cứng) |
| Chia thư dài thành nhiều phong bì đánh số | **[[Glossary - Networking#Packet\|Packets]]** (gói tin)               |
| Quy tắc "ghi địa chỉ góc phải, dán tem"   | **[[Glossary - Networking#Protocol\|Protocol]]** ([[Glossary - Networking#TCP/IP\|TCP/IP]])               |
| Bưu cục trung chuyển                      | **[[Glossary - Networking#Router\|Router]]**                          |
| Trạm phân loại trong 1 khu phố            | **[[Glossary - Networking#Switch\|Switch]]** (trong mạng [[Glossary - Networking#LAN\|LAN]])         |
| Danh bạ "tên người → địa chỉ nhà"         | **[[Glossary - Networking#DNS\|DNS]]**                             |
| Thư bảo đảm, có ký nhận, gửi lại nếu mất  | **[[Glossary - Networking#TCP\|TCP]]**                             |
| Thư thường, gửi đại cho nhanh             | **[[Glossary - Networking#UDP\|UDP]]**                             |

**Ý tưởng lớn nhất — [[Glossary - Networking#Packet switching|Packet Switching]]:** dữ liệu **không đi nguyên khối**. Nó bị **cắt thành nhiều gói nhỏ ([[Glossary - Networking#Packet|packets]])**, mỗi gói **tự tìm đường riêng** qua các router, rồi được **ráp lại** ở đầu nhận. (Khác điện thoại xưa – *[[Glossary - Networking#Circuit switching|circuit switching]]* – phải giữ 1 đường dây riêng suốt cuộc gọi. Packet switching hiệu quả hơn vì đường truyền được chia sẻ.)

#### Vì sao phải cắt nhỏ? (không gửi nguyên khối cho khỏe?)
Trực giác "gửi nguyên khối cho khỏi phải ráp" nghe hợp lý nhưng **sai** — cắt nhỏ lợi hơn hẳn:

1. **Đường truyền là DÙNG CHUNG** ⭐ (lý do lớn nhất). Một sợi cáp có hàng nghìn người xài chung. Gửi nguyên khối 1GB = **chiếm trọn** cáp mấy phút, người khác đứng chờ. Cắt nhỏ → gói của bạn và gói người khác **xen kẽ** chạy, ai cũng được phục vụ.
   > *Đời sống:* đường cao tốc. Một xe tải **dài 2km** làm tắc cả đường; chia thành nhiều xe nhỏ → tất cả chạy xen kẽ, thông suốt.
2. **Lỗi thì gửi lại mẩu nhỏ, không phải cả khối.** Khối 1GB hỏng ở 99% → gửi lại **cả 1GB**. Cắt nhỏ → chỉ gửi lại **đúng mẩu vài KB** bị hỏng.
3. **Đi nhiều đường song song + tự né tắc/đứt.** Một tuyến đứt cáp → gói sau **tự đi đường khác**. Gửi nguyên khối = khóa cứng 1 đường, đường chết là chết hết.
4. **Router không cần RAM khổng lồ** để nuốt cả khối — chỉ chứa tạm 1 gói nhỏ rồi đẩy đi.

→ Còn *"ráp lại mất thời gian"*? **Rất rẻ:** mỗi gói có sẵn **số thứ tự**, máy nhận chỉ xếp theo số. Cái giá rẻ mạt để đổi lấy 4 lợi ích trên.

#### Cắt nhỏ theo quy tắc gì? Kích thước bao nhiêu?
- **Giới hạn là [[Glossary - Networking#MTU|MTU]] (Maximum Transmission Unit)** — kích thước tối đa của **một gói** mà đường truyền cho phép. Với mạng **Ethernet phổ biến, MTU = 1500 byte**. Dữ liệu to hơn → **bắt buộc phải cắt** thành nhiều gói ≤ 1500 byte.
- **Mỗi gói KHÔNG chỉ chứa dữ liệu** — nó gồm 2 phần:
  ```
  ┌──────────────┬───────────────────────────┐
  │  HEADER      │  PAYLOAD (dữ liệu thật)    │
  │ (nhãn điều   │  một mẩu của file/ảnh...   │
  │  hướng)      │                            │
  └──────────────┴───────────────────────────┘
  ```
  - **Header** = "nhãn" dán ngoài: **IP nguồn, IP đích, số thứ tự, checksum** (mã kiểm lỗi)... để router biết đưa đi đâu và máy nhận biết ráp thế nào.
  - **Payload** = mẩu dữ liệu thật.
- **Con số thực tế (Ethernet, TCP/IP):** trong 1500 byte, header IP ~20 byte + header TCP ~20 byte → phần dữ liệu thật (**MSS – Maximum Segment Size**) còn khoảng **~1460 byte/gói**.
- **Ví dụ:** gửi ảnh **1 MB (~1.000.000 byte)** → cắt thành **~700 gói** (mỗi gói ~1460 byte dữ liệu), đánh số 1→700, bắn đi, máy nhận xếp lại theo số.
- **Checksum:** mỗi gói kèm mã kiểm lỗi. Máy nhận tính lại, sai → biết gói hỏng → yêu cầu **gửi lại đúng gói đó** (cơ chế của TCP, xem mục 3.1).

> **Chốt:** cắt theo **MTU (~1500 byte/gói trên Ethernet)**, mỗi gói = **header (nhãn điều hướng) + payload (~1460 byte dữ liệu) + số thứ tự + checksum**. Nhờ số thứ tự nên ráp lại dễ; nhờ checksum nên biết gói nào hỏng để gửi lại.

### 2.2. Ba loại địa chỉ (dễ lẫn nhau)
- **[[Glossary - Networking#MAC address|MAC address]]:** địa chỉ **phần cứng**, gắn cứng vào card mạng từ nhà máy (vd `A4:B1:C2:...`). Dùng để nói chuyện **trong cùng một mạng nội bộ (LAN)** — router dùng nó để biết đưa gói cho đúng thiết bị trong nhà.
- **[[Glossary - Networking#IP address|IP address]]:** địa chỉ **logic**, có thể đổi. Dùng để định tuyến **xuyên Internet** (máy này ở mạng nào, nước nào).
- **[[Glossary - Networking#Port|Port]]:** số cổng để phân biệt **dịch vụ nào trên cùng một máy**. Vd cùng IP server nhưng port `443` = HTTPS, port `22` = SSH, port `5432` = PostgreSQL.

> Ví dụ ghép: `142.250.66.14:443` = "gõ cửa dịch vụ HTTPS (443) trên máy có IP 142.250.66.14". MAC lo chặng trong nhà, IP lo chặng đường dài, Port lo giao đúng cửa.

### 2.3. Router vs Switch vs Modem (cặp Router/Switch dễ lẫn nhất)

**Khác biệt cốt lõi — nhớ 1 dòng này trước:**
> **Switch** lo giao thông **TRONG nhà** (cùng một LAN). **Router** lo giao thông **RA NGOÀI** (giữa các mạng khác nhau).

|              | **Switch**                      | **Router**                        | **Modem**                     |
| ------------ | ------------------------------- | --------------------------------- | ----------------------------- |
| Nối cái gì   | Các máy **trong CÙNG một LAN**  | **Các mạng KHÁC nhau** với nhau   | Nhà mạng ↔ nhà bạn            |
| Ví dụ việc   | Laptop ↔ máy in ↔ TV trong nhà  | Nhà bạn ↔ Internet                | Dịch tín hiệu cáp quang/ADSL  |
| Dùng địa chỉ | **MAC** (phần cứng, nội bộ)     | **IP** (toàn cầu)                 | — (chỉ dịch tín hiệu)         |
| Ví như       | **Người gác ga** trong 1 nhà ga | **Bưu điện** chuyển thư liên tỉnh | **Phiên dịch viên** ở cửa ngõ |

**Ví dụ đời sống 🏠**
- **Switch = người điều phối TRONG nhà.** Chuyển đồ từ phòng khách sang phòng ngủ → lo trong nhà, **không bước ra cửa**.
- **Router = cửa chính + người gác cổng.** Đồ nào cần gửi **ra ngoài phố** (mạng khác) mới phải qua router.
- **Modem = phiên dịch viên** đứng ngay cửa: dịch tín hiệu của nhà mạng thành thứ máy tính hiểu (và ngược lại).

**⚠️ Lưu ý thực tế quan trọng — "combo 3-trong-1":**
Cái **cục WiFi nhà bạn KHÔNG chỉ là router.** Nhà sản xuất gộp **modem + router + switch vào chung 1 hộp** cho gọn. Nên cùng một cục đó làm nhiều vai tùy tình huống:
- Laptop nói chuyện với **máy in trong nhà** → **phần switch** hoạt động (đi trong LAN, không ra ngoài).
- Laptop vào **YouTube** (ra ngoài) → **phần router** hoạt động (nối LAN ↔ Internet).
- Tín hiệu cáp quang nhà mạng vào nhà → **phần modem** dịch trước.

→ Vì thế bạn tưởng "chỉ có 1 cục", nhưng bên trong nó làm cả 3 việc. Về mặt **khái niệm** thì switch / router / modem là 3 vai trò tách biệt; về mặt **thiết bị** thì gia đình thường gộp làm một.

---

## 3. Mô hình phân tầng TCP/IP — "core" của giao tiếp

Gửi dữ liệu qua mạng là việc phức tạp, làm một lúc thì rối. Nên người ta **chia thành 4 tầng, mỗi tầng lo đúng 1 nhiệm vụ** và không quan tâm tầng khác làm gì (như dây chuyền trong công ty: người viết thư, người đóng gói, người ghi địa chỉ, người lái xe — mỗi người 1 việc).

**Giải thích từng tầng bằng lời (từ trên xuống):**

- **Tầng 4 — Application (Ứng dụng):** tầng **gần bạn nhất**. Nó quyết định **NỘI DUNG và ĐỊNH DẠNG dữ liệu mà ứng dụng muốn trao đổi** — ví dụ trình duyệt muốn "xin trang chủ" thì viết ra câu `GET /` theo luật HTTP; app mail viết theo luật SMTP. Nói ngắn: *tầng này lo "gửi CÁI GÌ".*
  → Giao thức: **HTTP, DNS, SMTP, SSH**. Ví như: **lá thư bạn viết** (nội dung).

- **Tầng 3 — Transport (Vận chuyển):** nhận "lá thư" từ tầng 4, **cắt thành các gói nhỏ, đánh số thứ tự**, và chọn cách gửi: **TCP** (bảo đảm, gửi lại nếu mất) hay **UDP** (nhanh, không bảo đảm). Nói ngắn: *lo "gửi ĐÁNG TIN tới đâu".*
  → Giao thức: **TCP, UDP**. Ví như: **đóng gói thư + chọn "thư bảo đảm hay thư thường".**

- **Tầng 2 — Internet (Mạng):** dán **địa chỉ IP nguồn + IP đích** lên mỗi gói và lo **định tuyến** — chọn đường đi qua các router tới đích. Nói ngắn: *lo "gửi ĐI ĐÂU và đi đường nào".*
  → Giao thức: **IP, ICMP**. Ví như: **ghi địa chỉ lên phong bì + chọn tuyến đường.**

- **Tầng 1 — Link (Liên kết vật lý):** thực sự **đẩy các bit (0/1) qua dây cáp / sóng WiFi** tới thiết bị kế tiếp. Nói ngắn: *lo "truyền tín hiệu thật trên đường vật lý".*
  → Công nghệ: **Ethernet, WiFi**. Ví như: **xe tải chở thư chạy trên đường thật.**

| Tầng | Lo việc gì (1 câu) | Ví dụ giao thức | Ví đời sống (gửi thư) |
|---|---|---|---|
| **4. Application** | Gửi **CÁI GÌ** — nội dung & định dạng app cần | HTTP, DNS, SMTP, SSH | Lá thư bạn viết |
| **3. Transport** | Gửi **ĐÁNG TIN** — cắt gói, đánh số, đảm bảo tới nơi | **TCP**, UDP | Đóng gói + chọn "bảo đảm/thường" |
| **2. Internet** | Gửi **ĐI ĐÂU** — dán IP + chọn đường | **IP**, ICMP | Ghi địa chỉ + chọn tuyến |
| **1. Link** | **Truyền thật** — đẩy bit qua dây/sóng | Ethernet, WiFi | Xe tải chở thư trên đường |

**Cách chạy (quan trọng):** ở máy **gửi**, dữ liệu đi **XUỐNG** tầng 4 → 1, mỗi tầng **bọc thêm một lớp "phong bì" riêng** (gọi là *[[Glossary - Networking#Encapsulation|encapsulation]]* — tầng Transport thêm số thứ tự, tầng Internet thêm IP...). Truyền qua dây tới máy **nhận**, rồi đi **LÊN** tầng 1 → 4, mỗi tầng **bóc đúng lớp phong bì của mình** ra, cuối cùng tầng 4 nhận lại đúng "lá thư" ban đầu.

> **Ví von cho dễ nhớ:** gửi quà — bạn viết thiệp (tầng 4) → bỏ vào hộp có dán số kiện (tầng 3) → dán nhãn địa chỉ người nhận (tầng 2) → shipper chở đi (tầng 1). Người nhận làm ngược lại: nhận hàng → xé nhãn → mở hộp → đọc thiệp. Mỗi lớp bọc chỉ do đúng "bộ phận" của nó xử lý.

### 3.0. "Chuẩn" ở mỗi tầng là gì? (TCP chỉ là chuẩn của 1 tầng)

**"Chuẩn" = protocol (giao thức) = bộ luật mà cả 2 máy đồng ý tuân theo để hiểu nhau.** Điểm dễ nhầm: **TCP KHÔNG phải "chuẩn của cả Internet"** — nó chỉ là chuẩn của **tầng 3 (Transport)**. Mỗi tầng có chuẩn riêng, và một lần gửi dữ liệu **dùng nhiều chuẩn cùng lúc, chồng lên nhau.**

| Tầng               | Chuẩn (protocol)                     | Chuẩn đó quy định ĐIỀU GÌ?                                                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **4. Application** | **HTTP, HTTPS, DNS, SMTP, SSH, FTP** | Cú pháp nội dung. Vd HTTP bắt viết `GET /trang HTTP/1.1`, header ra sao, response trả mã `200`/`404` thế nào |
| **3. Transport**   | **TCP**, **UDP**                     | Cách cắt gói, đánh số thứ tự, bắt tay 3 bước, báo nhận (ACK), gửi lại khi mất                                |
| **2. Internet**    | **IP** (IPv4/IPv6), **ICMP**         | Định dạng địa chỉ IP, cách ghi IP nguồn/đích lên gói, cách router đọc để định tuyến (ICMP = dùng cho `ping`) |
| **1. Link**        | **Ethernet, WiFi (802.11)**          | Cách biến bit thành tín hiệu điện/sóng, dùng địa chỉ MAC, đóng khung dữ liệu (frame)                         |

**Protocol stack (chồng giao thức):** khi mở web, dữ liệu dùng **4 chuẩn xếp chồng cùng lúc**, mỗi tầng một chuẩn:
```
HTTP        (tầng 4)  ← chuẩn cho nội dung "xin trang gì"
  ⤷ TCP     (tầng 3)  ← chuẩn cho việc gửi đáng tin
      ⤷ IP  (tầng 2)  ← chuẩn cho địa chỉ + định tuyến
          ⤷ Ethernet/WiFi (tầng 1)  ← chuẩn cho truyền bit thật
```
→ Tên **"TCP/IP"** là gọi tắt theo 2 chuẩn quan trọng nhất (tầng 3 TCP + tầng 2 IP), nhưng thực chất là **cả một bộ chuẩn chồng lên nhau**, không chỉ 2 cái.

> **Ví đời sống — gửi hàng quốc tế, mỗi khâu một "luật" riêng:**
> - Luật viết đơn hàng (tiếng Anh chuẩn) = **HTTP**
> - Luật đóng gói + đánh số kiện = **TCP**
> - Luật ghi địa chỉ quốc tế = **IP**
> - Luật lái xe trên đường = **Ethernet/WiFi**
>
> Hai bên phải theo **cùng bộ luật ở TỪNG khâu** thì hàng mới tới và hiểu được.

> 🔑 **Chốt:** TCP là chuẩn của *riêng* tầng Transport. Mỗi tầng có chuẩn của nó; gộp lại thành **protocol stack**. Đổi chuẩn 1 tầng không ảnh hưởng tầng khác — vd đổi HTTP → HTTPS (tầng 4) mà TCP/IP (tầng 3/2) giữ nguyên.

### 3.1. TCP vs UDP (tầng Transport) — điểm cốt lõi

**Tên đầy đủ (chính cái tên đã nói lên tính cách):**
- **TCP = Transmission Control Protocol** (Giao thức Điều khiển Truyền dẫn). Chữ **"Control" = kiểm soát** → nên mới bắt tay, báo nhận, gửi lại, ráp đúng thứ tự → **cẩn thận, đáng tin**.
- **UDP = User Datagram Protocol** (Giao thức Gói dữ liệu Người dùng). **"Datagram" = gói bắn độc lập**, không "Control" → **bắn thẳng, nhanh, không đảm bảo**.

**TCP = thư bảo đảm:**
1. **Bắt tay 3 bước ([[Glossary - Networking#3-way handshake|3-way handshake]]):** thiết lập kết nối trước khi gửi (xem chi tiết dưới).
2. Đầu nhận **báo đã nhận (ACK)** từng phần; mẩu nào mất → **gửi lại**.
3. Ráp gói theo **đúng thứ tự**.
→ **Chậm hơn nhưng đáng tin.** Dùng cho web, email, tải file, API — thứ không được sai 1 byte.

#### "Handshake" là gì? Vì sao bắt tay 3 bước?

**Handshake = cái BẮT TAY.** Trong máy tính = 2 máy **"chào hỏi + xác nhận" nhau TRƯỚC khi gửi dữ liệu thật** — để chắc rằng bên kia đang bật, sẵn sàng, và **đường truyền 2 chiều đều thông**. Không kiểm tra mà gửi luôn → lỡ bên kia tắt/bận thì dữ liệu mất toi mà không biết.

Gọi A = máy bạn, B = server. Cần đúng **3 câu qua lại:**
```
   A (máy bạn)                          B (server)
      │  ①  "Alô, tôi muốn kết nối!"        │
      │  ───────────  SYN  ──────────────►  │
      │  ②  "Nghe rồi! Tôi cũng sẵn sàng."  │
      │  ◄─────────  SYN + ACK  ──────────  │
      │  ③  "Ok, chốt! Bắt đầu gửi đây."    │
      │  ───────────  ACK  ──────────────►  │
      │  ✅ Kết nối thành lập → gửi dữ liệu thật
```

| Bước | Ai gửi | Nói gì | Cờ |
|---|---|---|---|
| ① | A → B | "Tôi muốn kết nối, nghe không?" | **SYN** |
| ② | B → A | "Nghe rồi! Tôi cũng sẵn sàng." | **SYN + ACK** |
| ③ | A → B | "Ok chốt, bắt đầu!" | **ACK** |

*(SYN = Synchronize = xin kết nối. ACK = Acknowledge = đã nhận/xác nhận.)*

**Vì sao bước ② lại là "SYN + ACK" (gộp 2 tín hiệu)?** Vì ở bước giữa, server B phải làm **2 việc cùng lúc**, nên gói chung vào 1 gói cho đỡ tốn lượt:
```
①  A → B:  SYN          "Tôi muốn kết nối với bạn!"
②  B → A:  SYN + ACK    ┌─ ACK: "Tôi ĐÃ NHẬN được câu của bạn"   (trả lời bước ①)
                        └─ SYN: "VÀ tôi cũng xin kết nối chiều của tôi"
③  A → B:  ACK          "Tôi đã nhận được câu trả lời của bạn"
```
→ Nếu tách riêng thì mất 4 bước (ACK riêng, SYN riêng). Gộp ACK+SYN làm 1 → **chỉ còn 3 bước**. Đó là lý do gọi là *"3-way"* handshake.

**Vì sao đủ 3, không phải 2?** Để xác nhận **CẢ 2 CHIỀU đều thông:**
- Sau ① → B biết chiều **A→B** ok.
- Sau ② → A biết chiều **B→A** ok.
- Nhưng **B chưa biết A có nhận được câu trả lời không** → cần ③ để A báo "nhận rồi" → giờ B mới chắc. Đủ 3 bước = **cả 2 máy đều chắc gửi được VÀ nhận được.**

> **Ví đời sống — gọi điện thoại 📞:** ① bạn gọi "Alô?" → ② người kia "Alô, nghe nè!" → ③ bạn "Ừ nghe rõ, nói nhé...". Sau 3 câu qua lại, cả hai chắc chắn nghe rõ nhau rồi mới vào chuyện chính. Vừa gọi đã nói luôn (không chờ đáp) thì lỡ chưa ai bắt máy — nói cho ai nghe?

→ Chính màn bắt tay này làm TCP **chậm hơn UDP một chút** (UDP bỏ qua, bắn thẳng), đổi lại **chắc chắn** hơn.

#### Mỗi request/API có bắt tay lại không? → KHÔNG (rất hay hiểu lầm)

Bắt tay xảy ra **1 lần cho mỗi KẾT NỐI (connection)**, KHÔNG phải mỗi request. Nhiều request **dùng chung 1 kết nối đã mở**.

- **Connection** = "đường ống" — cần bắt tay 3 bước để **mở**.
- **Request** = mỗi lần xin dữ liệu — chạy **bên trong** đường ống đã mở, **không bắt tay lại**.

> **Ví đời sống 📞:** bắt tay = màn "alô alô" nối máy lúc đầu (làm 1 lần). Nối máy xong → **hỏi bao nhiêu câu cũng được** mà không phải gọi lại. Chỉ khi **cúp máy** (đóng connection) mới phải "alô" lại từ đầu. Tưởng tượng mỗi câu hỏi phải gác máy gọi lại → điên luôn.

**Thực tế web:**
- *Xưa (HTTP/1.0):* mỗi request mở connection mới → bắt tay lại mỗi lần → chậm.
- *Nay (HTTP/1.1+):* **keep-alive** — giữ connection mở, nhiều request đi chung:
```
[Bắt tay 3 bước MỘT LẦN] → mở đường ống
   ├─ Request 1: GET /trang-chu   (không bắt tay lại)
   ├─ Request 2: GET /style.css   (không bắt tay lại)
   └─ Request 3: GET /logo.png    (không bắt tay lại)
[Đóng connection khi xong / hết hạn]
```
→ Mở 1 web có hàng chục file chỉ bắt tay vài lần, không phải mỗi file một lần.

**Với API của bạn (Shopify/backend):** gọi nhiều API liên tiếp tới **cùng server** → thư viện HTTP (axios, fetch, Firebase SDK) thường **tái dùng connection** (*keep-alive / connection pooling*) → không bắt tay lại mỗi call. Gọi sang **server khác (domain khác)** → mới mở connection + bắt tay mới.

> 💡 Bổ sung: **HTTPS** có thêm **TLS handshake** (mã hóa) *sau* TCP handshake — cũng chỉ 1 lần/connection. **HTTP/3** chạy trên UDP (QUIC), bắt tay khác & nhanh hơn, nhưng vẫn "thiết lập 1 lần rồi tái dùng".

> 🔑 **Chốt:** bắt tay 3 bước = **1 lần mỗi connection**, không phải mỗi request. Mở kết nối rồi gửi nhiều request trên đó → web/API không bị chậm vì bắt tay liên tục.

**UDP = thư thường:** bắn đi luôn, không bắt tay, không kiểm tra mất mát → **nhanh, độ trễ thấp, nhưng có thể rớt gói.** Dùng cho video call, game, livestream (mất 1 khung hình chẳng sao, cần real-time).

---

## 4. Client – Server: mô hình chạy trên Internet

Hầu hết Internet hoạt động theo **[[Glossary - Networking#Client – Server|client–server]]**:
- **Client** (máy khách): kẻ *hỏi* — trình duyệt, app điện thoại, app Shopify của merchant.
- **Server** (máy chủ): kẻ *trả lời* — máy chạy 24/7, giữ dữ liệu, xử lý và trả kết quả.

Client gửi **request** → Server xử lý → trả **response**.

> **Backend của bạn = phần "Server".** Học backend = học viết cái kẻ-trả-lời này.

**Đời sống:** client–server giống **ngân hàng** — muốn biết số dư / chuyển tiền, bạn phải hỏi ngân hàng; ngân hàng giữ **cuốn sổ cái duy nhất**, nó nói sao là vậy. Điểm yếu: phụ thuộc 1 chỗ — server sập là tất cả ngừng, và chủ server toàn quyền với dữ liệu.

### 4.1. P2P (Peer-to-Peer) & Blockchain

**[[Glossary - Networking#P2P|P2P]] = KHÔNG có server trung tâm. Mọi máy đều ngang hàng (peer), vừa là client vừa là server** — máy nào cũng vừa xin, vừa đưa dữ liệu cho máy khác.
> *Đời sống:* như **chợ trao đổi trực tiếp** không có ông chủ chợ — ai cần gì hỏi thẳng người bên cạnh, ai có thì đưa. Không qua trung gian.

- **Điểm mạnh:** không có "điểm chết" (một máy tắt, mạng vẫn sống); không ai làm chủ toàn bộ.
- **Điểm yếu:** khó quản lý, đồng bộ dữ liệu phức tạp, thường chậm hơn.
- **Ví dụ:** **BitTorrent** — tải 1 file đồng thời chia sẻ lại phần đã tải; file nằm rải rác ở hàng nghìn máy người dùng, càng đông tải càng nhanh. Và **Blockchain** (dưới đây).

#### Blockchain hiểu qua lăng kính P2P

[[Glossary - Networking#Blockchain|Blockchain]] = **một cuốn sổ cái (ghi các giao dịch) được COPY giống hệt trên hàng nghìn máy P2P**, thay vì để 1 chỗ như ngân hàng.

|               | Ngân hàng (Client–Server) | Blockchain (P2P)                                               |
| ------------- | ------------------------- | -------------------------------------------------------------- |
| Sổ cái để đâu | **1 bản** ở ngân hàng     | **Hàng nghìn bản copy** khắp các máy                           |
| Ai ghi sổ     | Chỉ ngân hàng             | Cả mạng cùng kiểm tra & ghi                                    |
| Sửa lén được? | Ngân hàng sửa được        | **Gần như không** — phải sửa đồng loạt hàng nghìn bản cùng lúc |
| Tin vào ai    | Tin ngân hàng             | Không cần tin ai — **tin số đông + toán học**                  |

**Vì sao gọi "block" + "chain"?** Giao dịch gom thành từng **khối (block)**; mỗi khối mới **móc vào khối trước** bằng một "mã niêm phong" (hash) → thành **chuỗi (chain)**. Muốn sửa 1 giao dịch cũ phải làm lại **toàn bộ khối phía sau, trên hơn nửa số máy, cùng lúc** → gần như bất khả thi → đó là lý do blockchain "chống gian lận".

> **Ví dụ đời sống — cả xóm ghi nợ chung 📒:**
> - *Cách ngân hàng:* chỉ **bác tổ trưởng** giữ sổ nợ → bác sửa lén thì cả xóm chịu.
> - *Cách blockchain:* **mỗi nhà giữ 1 cuốn sổ y hệt**. Ai vay ai → **hô to cho cả xóm cùng ghi**. Một nhà sửa lén sổ mình → **lệch với hàng trăm cuốn kia → bị phát hiện ngay, không ai công nhận**.

> 🔑 **Chốt:** P2P = mạng không trung tâm, các máy ngang hàng tự trao đổi. Blockchain = dùng P2P để giữ **một sổ cái chung, ai cũng có bản copy, không ai sửa lén được** → không cần trung gian (ngân hàng) mà vẫn tin tưởng được. Đây chính là nghĩa của "phi tập trung" (decentralized).

---

## 5. "Dịch vụ chạy trên Internet" là những gì?

Internet là *đường ống*; trên đó chạy **nhiều dịch vụ khác nhau**, mỗi dịch vụ một giao thức riêng (tầng Application):

| Dịch vụ            | Giao thức        | Port hay dùng    | Để làm gì                  |
| ------------------ | ---------------- | ---------------- | -------------------------- |
| **Web** (WWW)      | [[Glossary - Networking#HTTP\|HTTP]] / [[Glossary - Networking#HTTPS\|HTTPS]]     | 80 / 443         | Xem trang web, gọi API     |
| **Email**          | [[Glossary - Networking#SMTP / IMAP / POP3\|SMTP, IMAP, POP3]] | 25/587, 143, 110 | Gửi/nhận mail              |
| **DNS**            | [[Glossary - Networking#DNS\|DNS]]              | 53               | Dịch tên miền → IP         |
| **Truyền file**    | [[Glossary - Networking#FTP / SFTP\|FTP / SFTP]]       | 21 / 22          | Upload/download file       |
| **Remote shell**   | [[Glossary - Networking#SSH\|SSH]]              | 22               | Điều khiển server từ xa    |
| **Streaming/Game** | thường trên [[Glossary - Networking#UDP\|UDP]]  | tùy              | Video call, game real-time |

> **Điểm mấu chốt cần khắc:** **Web ≠ Internet.** Web (các trang qua HTTP) chỉ là **MỘT** dịch vụ chạy trên Internet. Email, SSH, game... là các dịch vụ khác cũng dùng chung hạ tầng Internet. Backend dev làm việc nhiều nhất với **HTTP/HTTPS**, nhưng cũng đụng SSH (vào server), DNS (trỏ domain), SMTP (gửi mail xác nhận đơn hàng).

> **Giao thức (protocol) là gì?** = **bộ LUẬT để 2 máy nói chuyện hiểu nhau** (gửi gì trước, định dạng ra sao, trả lời thế nào). *Đời sống:* như luật gọi điện — "alô → nói → chào → cúp". Hai bên theo cùng luật thì hiểu nhau; khác luật là "ông nói gà bà nói vịt". Mỗi dịch vụ dưới đây có luật riêng.

### 5.1. Web: HTTP vs HTTPS khác gì?

Cả hai đều là luật để trình duyệt xin trang web (client gửi `GET /trang` → server trả về HTML + mã `200`/`404`). Khác nhau **đúng 1 chữ S = Secure (bảo mật):**
TLS = Transport Layer Security (Bảo mật Tầng Vận chuyển).

| | **HTTP** | **HTTPS** |
|---|---|---|
| Tên đầy đủ | HyperText Transfer Protocol | HTTP **+ S**ecure |
| Mã hóa? | ❌ Không — dữ liệu đi **trần** | ✅ Có — mã hóa bằng **[[Glossary - Networking#TLS / SSL\|TLS]]** |
| Ai chặn đường đọc được? | **Đọc được hết** (mật khẩu, thẻ...) | Chỉ thấy **mớ ký tự vô nghĩa** |
| Trên trình duyệt | Cảnh báo "Not secure" | Ổ khóa 🔒 |
| Port | 80 | 443 |

> **Chốt:** HTTPS = HTTP **bọc thêm lớp mã hóa TLS**. Ngày nay gần như mọi web đều dùng HTTPS; Shopify **bắt buộc** HTTPS. (Cùng nội dung HTTP, chỉ khác có/không mã hóa — nhớ lại mục 3.0: đổi tầng 4 mà tầng dưới giữ nguyên.)

### 5.2. Email: SMTP vs IMAP vs POP3 khác gì?

3 giao thức cho 2 việc khác nhau — **GỬI** đi và **NHẬN/ĐỌC** về:

| Giao thức                                   | Việc                                                                | Ví như                                               |
| ------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| **SMTP** (Simple Mail Transfer Protocol)    | **GỬI** mail đi (và chuyển giữa các server)                         | **Bỏ thư vào thùng thư đi** 📤                       |
| **IMAP** (Internet Message Access Protocol) | **ĐỌC** mail — mail **vẫn nằm trên server**, đồng bộ nhiều thiết bị | **Đọc thư ngay tại bưu điện**, đọc xong để lại đó 📥 |
| **POP3** (Post Office Protocol v3)          | **TẢI** mail về máy — thường **xóa khỏi server**                    | **Lấy thư về nhà**, bưu điện hết giữ 📦              |

**Cách nhớ:**
- **SMTP = gửi đi.** IMAP & POP3 = nhận về.
- **IMAP vs POP3:** IMAP để mail **trên server** (mở điện thoại + laptop đều thấy giống nhau — phổ biến ngày nay). POP3 **kéo về 1 máy** rồi xóa server (kiểu cũ, giờ ít dùng).

### 5.3. Domain vs DNS vs IP khác gì? (hay lẫn nhất)

Ba thứ này **liên quan nhau nhưng KHÁC vai trò:**

|                       | Là gì                                       | Ví dụ              | Ví như                          |
| --------------------- | ------------------------------------------- | ------------------ | ------------------------------- |
| **Domain** (tên miền) | Cái **TÊN dễ nhớ** cho con người            | `google.com`       | **Tên người**: "Mẹ"             |
| **IP**                | Cái **ĐỊA CHỈ SỐ** máy tính dùng để kết nối | `142.250.66.14`    | **Số điện thoại thật**: 0901... |
| **DNS**               | **DỊCH VỤ tra cứu** đổi tên miền → IP       | (hệ thống máy chủ) | **Danh bạ** tra "Mẹ → 0901..."  |

**Mối quan hệ (đọc từ trái sang):**
```
Bạn gõ  google.com   →   DNS tra cứu   →   trả về 142.250.66.14   →   máy kết nối tới IP đó
        (domain)          (danh bạ)            (IP)
```
- **Domain** sinh ra vì người **không nhớ nổi dãy số IP**. Bạn nhớ `facebook.com` chứ ai nhớ `157.240.xx.xx`.
- **IP** mới là cái máy tính **thật sự dùng** để tìm nhau.
- **DNS** là **cầu nối** giữa 2 cái trên — không có DNS thì gõ tên miền vô dụng, phải nhớ IP.

> **1 câu:** *Domain = tên (cho người nhớ). IP = địa chỉ số (cho máy dùng). DNS = danh bạ dịch tên → số.*

DNS = công cụ (hệ thống) dịch tên google.com → số IP 142.250.66.14.
### 5.4. Vài giao thức còn lại
- **[[Glossary - Networking#SSH|SSH]]** (Secure Shell): vào **điều khiển server từ xa** qua kết nối mã hóa (gõ lệnh trên máy chủ như đang ngồi trước nó). Vd `gcloud compute ssh`. Port 22.
- **[[Glossary - Networking#FTP / SFTP|FTP / SFTP]]**: **truyền file** lên/xuống server. SFTP = bản mã hóa an toàn (đi qua SSH).

---

## 6. Ráp lại: gõ `google.com` + Enter thì sao? (câu phỏng vấn kinh điển)

**Tổng quan 7 bước** (mỗi bước phân tích kỹ ở mục con bên dưới):

| # | Bước | Lo việc gì | Chi tiết |
|---|---|---|---|
| 1 | **DNS lookup** | Dịch `google.com` → IP | §6.1 |
| 2 | **Định tuyến (routing)** | Đưa packet qua các mạng tới IP đó | §6.2 |
| 3 | **TCP handshake** | Mở kết nối tin cậy (port 443) | §6.3 |
| 4 | **TLS handshake** | Trao khóa để mã hóa (HTTPS 🔒) | §6.4 |
| 5 | **HTTP request** | Gửi `GET /` — "cho tôi trang" | §6.5 |
| 6 | **Server xử lý + response** | Trả HTML/CSS/JS + status code | §6.6 |
| 7 | **Trình duyệt render** | Dựng trang + xin tiếp tài nguyên | §6.7 |

> Mọi bước, dữ liệu đều bị cắt thành **[[Glossary - Networking#Packet|packet]]**, mỗi packet **bọc qua 4 tầng TCP/IP** (§3), đi qua **router**, tới nơi thì **ráp lại**.

### 6.1. Bước 1 — DNS lookup: tìm IP giữa hàng tỷ máy

> Nguồn: [Cloudflare — DNS server types](https://www.cloudflare.com/learning/dns/dns-server-types/).

**Vấn đề:** bạn gõ `google.com`, nhưng để kết nối cần **IP**. Làm sao tìm đúng IP giữa **hàng tỷ máy**? → DNS tổ chức dữ liệu thành **CÂY 3 tầng**, tra bằng cách **đi từ gốc xuống**.

#### Cấu trúc cây DNS — 3 tầng, ĐỪNG lẫn "root" với "đuôi"

```
        TẦNG 1: ROOT  ( . )                     ← 13 server (a→m), là ĐIỂM BẮT ĐẦU
             /        |        \                  (KHÔNG phải "đuôi"! Nó đứng TRÊN mọi đuôi)
        .com        .vn        .org  ...         ← TẦNG 2: TLD = các ĐUÔI (~1500 loại)
        /    \
  google.com  facebook.com  ...                 ← TẦNG 3: authoritative = domain thật (giữ IP)
```

> ⚠️ **Chỗ hay lẫn:** "13" là số **ROOT SERVER** (tầng gốc, điểm bắt đầu) — **KHÔNG phải** 13 cái đuôi phổ biến. **Đuôi (TLD)** như `.com` `.vn` `.org`... có tới **~1500 loại**, nằm ở **tầng DƯỚI root**. Root chỉ có việc: giữ danh sách "đuôi nào thì đi hỏi ai".

#### Gõ `google.com` — DNS dò thế nào (đã kiểm chứng bằng `dig +trace google.com`)

Nút CHA luôn **đưa cho bạn "đi hỏi ai tiếp theo"** — bạn không cần biết trước:

```
① Hỏi ROOT (13 server a→m.root-servers.net):  "google.com ở đâu?"
   → "Tôi không giữ google.com. Đuôi .com do a/c/f...gtld-servers.net quản, tới đó hỏi."

② Hỏi TLD .com (gtld-servers.net — do Verisign vận hành):  "google.com ở đâu?"
   → "Tôi không giữ IP. Authoritative của google.com là ns1→ns4.google.com, tới đó hỏi."

③ Hỏi AUTHORITATIVE của Google (ns1.google.com — do chính Google vận hành):  "google.com IP mấy?"
   → "google.com = 142.250.199.238"  ✅ (câu trả lời THẬT)
```

#### Ví dụ ".vn" — tổ chức DNS theo QUỐC GIA (đã kiểm chứng `dig +trace fpt.vn`)

Đuôi quốc gia (`.vn`) do cơ quan của nước đó quản. Vd tra `fpt.vn`:
```
① ROOT  → "đuôi .vn do a→h.dns-servers.vn quản"
② TLD .vn (do VNNIC — Trung tâm Internet VN — vận hành)  → "fpt.vn hỏi dns-a.fpt.vn"
③ Authoritative dns-a.fpt.vn (do FPT vận hành)  → "fpt.vn = 210.245.86.245" ✅
```
→ **"Phân theo quốc gia" nằm ở tầng 2 (TLD):** `.vn` do **VNNIC** quản, `.com` do **Verisign**, `.jp` do Nhật... mỗi đuôi/mỗi nước một nơi quản riêng. Tầng 3 luôn do **chủ domain** tự quản (Google tự chạy `ns1.google.com`, FPT tự chạy `dns-a.fpt.vn`).

#### 3 vai server — đừng lẫn

| Vai                   | Ví dụ thật (google.com)                  | Làm gì                                                |
| --------------------- | ---------------------------------------- | ----------------------------------------------------- |
| **Root** (13, a→m)    | `a.root-servers.net`                     | Chỉ đường tới TLD. Điểm bắt đầu.                      |
| **TLD** (đuôi, ~1500) | `.com` → `a.gtld-servers.net` (Verisign) | Chỉ đường tới authoritative. Phân theo đuôi/quốc gia. |
| **Authoritative**     | `ns1.google.com` (Google)                | **CẦM câu trả lời thật** (IP). Do chủ domain quản.    |

Cộng thêm 2 nhân vật phụ:
- **Recursive resolver** (`8.8.8.8` hoặc của ISP) = **người đi hỏi hộ** bạn cả 3 bước trên, rồi **cache** lại.
- **Cache local** (máy bạn) = nhớ tạm IP đã tra → khỏi hỏi lại.

> **Authoritative** = **nơi cuối cùng CẦM câu trả lời** (IP), do chủ domain quản. Bạn mua `myshop.com` cấu hình DNS ở Cloudflare → **Cloudflare là authoritative của bạn**. Root/TLD chỉ **chỉ đường**, không giữ IP.

#### DNS "sống" ở đâu? — 2 lớp: router (điều hướng nhẹ) → resolver (tra thật)

Khi máy bạn cần tra, câu hỏi đi qua nhiều chỗ — **thứ tự từ trong ra ngoài:**
```
LỚP ĐẦU (nhẹ, TRONG nhà)              LỚP NẶNG (ngoài, máy lớn)
┌───────────────────────┐            ┌──────────────────────────┐
│ Máy bạn (cache + stub) │            │ Recursive resolver        │
│         ↓              │   đẩy →    │ (ISP / 8.8.8.8)           │
│ Cục WiFi (router)      │            │ - tra THẬT: root→TLD→auth │
│ - điều hướng lớp đầu   │   ← trả    │ - máy mạnh, phục vụ       │
│ - forwarder + cache nhỏ│            │   hàng triệu người        │
│ - KHÔNG tra thật       │            └──────────────────────────┘
└───────────────────────┘
```

- **Cục WiFi nhà bạn = lớp điều hướng ĐẦU** — nhận câu hỏi DNS rồi **đẩy tiếp ra resolver** (forwarder), có cache nhỏ, **không tự đi tra**. (Ô "DNS server" trong cài đặt router chính là chỗ khai resolver để đẩy tới — mặc định của ISP, đổi được thành `8.8.8.8`.)
- **Recursive resolver = máy lớn NGOÀI nhà** (ISP hoặc Google `8.8.8.8`) — nơi **tra thật** (walk cây root→TLD→auth), phục vụ hàng triệu người.
- **`8.8.8.8` KHÔNG nằm trong router.** Router chỉ **chuyển tiếp** tới nó.

> ⚠️ Router làm **2 việc "điều hướng" khác nhau, đừng lẫn:** **DNS forwarding** = đẩy *câu-hỏi-tên-miền* ra resolver; **Routing (§6.2)** = đẩy *packet dữ liệu* tới đúng IP.

> **Stub resolver** (trong máy bạn) chỉ "đá" câu hỏi ra ngoài, không tự tra. **Recursive resolver** (ngoài) mới đi tra. Resolver **luôn chạy 24/7** (dịch vụ sẵn), chỉ **nhận việc** khi cache local miss.

#### Recursive vs Iterative — ai làm việc, ai chỉ chỉ đường?

Câu hỏi tinh: resolver **giao job** cho `a.gtld-servers.net` tìm hộ, hay **lấy chỉ dẫn rồi tự đi hỏi tiếp**? → **Vế 2: resolver TỰ đi hỏi từng bước.** Root/TLD/authoritative chỉ **"chỉ đường" rồi dừng**, KHÔNG làm hộ đến cùng.

| | Máy bạn ↔ Resolver | Resolver ↔ Root/TLD/Auth |
|---|---|---|
| Kiểu | **Recursive** (giao trọn job) | **Iterative** (chỉ lấy chỉ dẫn) |
| Nghĩa | "Tìm giúp đến khi ra IP, tôi chờ" | "Cho biết mày biết gì / hỏi ai tiếp" |
| Ai chạy vòng vòng | **Resolver** ôm hết | **Resolver** tự đi từng bước |

- Root: "biết `.com` ở `a.gtld-servers.net`" → **hết, không hỏi hộ.**
- `a.gtld-servers.net`: "authoritative của google.com là `ns1.google.com`" → **hết, không tự gọi `ns1` giúp.**
- → Chúng **đá bóng về** cho resolver; resolver **cầm chỉ dẫn rồi tự hỏi bước tiếp.** Chỉ có **1 chỗ "giao trọn job"**: bạn → resolver. Đó là nghĩa chữ *recursive* resolver.

> **Vì sao TLD không làm hộ?** `.com` phục vụ hàng trăm triệu domain — nếu phải đi tìm hộ đến cùng thì **gánh không nổi**. Nên nó chỉ làm việc nhẹ nhất (trả 1 chỉ dẫn), đẩy việc "chạy vòng vòng" cho resolver (ít hơn + có cache) → hệ thống nhẹ & scale được.

#### 2 điều cần chốt

**a) Điểm bắt đầu (root) tìm ở đâu?** IP của 13 root server được **GHI CỨNG sẵn** trong mọi phần mềm DNS (*root hints*) → ai cũng biết root từ đầu. Chỉ bước đầu biết trước; các bước sau nút cha "trao chìa".

**b) Resolver KHÔNG nhớ hết** — chỉ **cache tạm** domain vừa hỏi, có hạn **TTL** (vd 300s), hết hạn thì quên. Không server nào ôm cả tỷ domain; dữ liệu **chia ra hàng triệu authoritative** (mỗi chủ domain giữ phần mình).

> 🔑 **Chốt §6.1:** DNS = **cây 3 tầng**: **Root (13, điểm bắt đầu)** → **TLD (đuôi, ~1500, phân theo quốc gia/loại)** → **Authoritative (chủ domain, giữ IP thật)**. Tra = đi từ root xuống, mỗi nút cha đưa IP nút con. Nhanh nhờ **chia cây + cache**, không nhờ server siêu to. Ví dụ: `google.com` → root → `.com` (Verisign) → `ns1.google.com` (Google) → `142.250.199.238`.

→ Kết quả bước 1: có **IP** của google.com.

### 6.2. Bước 2 — Định tuyến (routing): packet tự tìm đường tới IP

> Nguồn: [Fortinet — BGP](https://www.fortinet.com/resources/cyberglossary/bgp-border-gateway-protocol).

**Định tuyến = quá trình các router chuyển packet qua nhiều mạng để tới đúng IP đích.** Nhớ [[01 - How does the internet work?#1.6. Cấu trúc phân tầng của ISP (Tier 1/2/3)|§1.6]] (hình chữ V): packet nhảy qua router nhà → ISP → (Tier 1 / cáp biển) → mạng Google.

**Định tuyến = quá trình các router chuyển packet qua nhiều mạng để tới đúng IP đích.**
IP có thể hiện vị trí thiết bị đúng không
#### Cơ chế cơ bản: mỗi router chỉ biết "chặng kế tiếp"

- Mỗi **router** giữ một **bảng định tuyến (routing table)**: "đi tới vùng IP này → đẩy sang hướng nào (**next hop**)".
- Router **KHÔNG biết cả đường** tới đích — chỉ biết **bước kế tiếp** gần đích hơn. Mỗi router đẩy gần thêm 1 bước → qua nhiều router → tới nơi.
- → Không ai giữ "bản đồ toàn Internet". Giống hỏi đường: mỗi người chỉ "rẽ trái ngã tư kia", không ai vẽ cả bản đồ.

#### Giữa các nhà mạng: giao thức BGP

- Internet chia thành các **AS (Autonomous System)** = 1 nhà mạng/tổ chức, mỗi cái có số **ASN** riêng (vd Viettel, Google mỗi bên 1 ASN).
- Các AS **quảng bá** cho hàng xóm: *"tôi tới được các dải IP này"* — bằng giao thức **BGP (Border Gateway Protocol)**. Nhờ đó cả Internet dần biết "dải IP nào đi hướng nào".
- BGP là kiểu **path-vector**: mỗi tuyến kèm **danh sách AS phải đi qua** (AS-path) → tránh lặp vòng + để so sánh đường.

#### ⭐ Cơ chế CHỌN đường — dựa vào GÌ? (điểm cốt lõi, hay hiểu lầm)

Khi có nhiều đường tới cùng đích, BGP xét theo thứ tự (đơn giản hóa):
1. **Local preference — CHÍNH SÁCH kinh doanh** (quan trọng nhất): nhà mạng ưu tiên đường **rẻ cho họ**. Nhớ §1.6: đi qua **peering (miễn phí)** được ưu tiên, đi qua **transit (trả tiền)** thì né.
2. **AS-path ngắn nhất** — qua **ít AS** hơn (≈ "ít chặng mạng").
3. ...vài tiêu chí kỹ thuật khác (MED, origin...).

**BGP KHÔNG dựa vào:**

| Yếu tố | Dùng? | Vì sao |
|---|---|---|
| Chính sách (policy) | ✅ **Chính** | Nhà mạng chọn đường **rẻ tiền** cho mình |
| Số AS-hops | ✅ Có (sau policy) | Ít chặng thường tốt hơn |
| **Khoảng cách vật lý (km)** | ❌ Không | BGP không biết/không quan tâm địa lý |
| **Độ tắc / số connection real-time** | ❌ Không | BGP **không phản ứng thời gian thực**; đường tắc vẫn chọn nếu policy nói vậy |

→ **Không phải "cả 3"** (node/khoảng cách/độ tắc). Chủ yếu = **policy > AS-hops**. **Policy thường THẮNG cả đường ngắn.**
→ Đây là lý do gói tin từ VN vào 1 web VN đôi khi **vòng qua nước ngoài** — vì hợp đồng/policy giữa các nhà mạng, không phải vì gần.

> *Ví đời sống:* công ty giao hàng chọn tuyến **không theo "ngắn nhất trên bản đồ"**, mà theo **hợp đồng rẻ với đối tác nào** (policy) rồi **qua ít trung gian** (AS-hops) — KHÔNG đo km thật, KHÔNG xem đường đang kẹt xe lúc này (không real-time). Nên hàng HN→HCM có khi vòng qua kho Đà Nẵng vì hợp đồng rẻ.

> **Lưu ý:** trong **NỘI BỘ 1 nhà mạng** thì dùng giao thức khác (**OSPF**...) chọn theo **"cost/băng thông" từng link** — gần với "chất lượng đường" hơn. Nhưng **giữa các nhà mạng** trên Internet thì **BGP + policy** là chính.

→ Kết quả bước 2: packet tới được **mạng chứa server** google.com.

### 6.3. Bước 3 — TCP handshake: mở kết nối tin cậy

Trước khi gửi dữ liệu, máy bạn & server **bắt tay 3 bước** (đã phân tích kỹ ở [[01 - How does the internet work?#3.1. TCP vs UDP (tầng Transport) — điểm cốt lõi|§3.1]]):
```
① Bạn → Server:  SYN          "Tôi muốn kết nối (port 443)!"
② Server → Bạn:  SYN + ACK    "Nghe rồi, tôi cũng sẵn sàng"
③ Bạn → Server:  ACK          "Ok chốt, bắt đầu"
   → kết nối TCP thành lập, đáng tin (mất gói sẽ gửi lại)
```
- **"Thuật toán" ở đây** không phải mã hóa — chỉ là **giao thức bắt tay** dùng 2 cờ **SYN** (xin kết nối) + **ACK** (xác nhận), kèm **số thứ tự (sequence number)** để sau này ráp gói đúng thứ tự & biết gói nào mất.
- Cần đủ 3 bước để **cả 2 chiều đều xác nhận thông** (§3.1). Làm **1 lần/connection**, request sau tái dùng (nhớ [[02 - What is HTTP?#6.1. Multiplexing & Vòng đời Connection (đào sâu)|keep-alive bài 02]]).

→ Kết quả bước 3: có **đường ống TCP tin cậy** tới server.

### 6.4. Bước 4 — TLS handshake: trao đổi khóa (phần quan trọng, phân tích kỹ)

Đây là "ma thuật" của HTTPS. **Bài toán nan giải:** để mã hóa, 2 bên cần **CHUNG một chìa khóa bí mật**. Nhưng muốn có chung chìa thì phải gửi chìa qua mạng → kẻ nghe lén (router/ISP giữa đường, bài 01 §1) **tóm được chìa** → mã hóa vô nghĩa.
> *Ví:* gửi hộp khóa cho tôi, nhưng chìa cũng gửi qua cùng anh shipper → anh shipper copy chìa là mở được hết. Làm sao?

#### Chìa khóa của lời giải: KHÓA BẤT ĐỐI XỨNG (public / private key)
Thay vì 1 chìa dùng chung, mỗi bên có **CẶP khóa gắn liền:**
- **Public key (khóa công khai):** đưa ai cũng được — dùng để **KHÓA**.
- **Private key (khóa riêng):** giữ bí mật tuyệt đối — dùng để **MỞ**.
- **Mấu chốt:** cái gì khóa bằng public key thì **CHỈ** private key tương ứng mới mở. Public key **không mở** được cái nó vừa khóa.

→ Nên server đưa **public key** cho cả thế giới (kể cả kẻ nghe lén) cũng **không sao** — chỉ server có private key để mở.
> *Ví "ổ khóa mở sẵn" 🔒:* tôi gửi bạn một **ổ khóa đang mở** (public key), ai cầm cũng được. Bạn bỏ bí mật vào hộp, **bấm khóa**, gửi về. Kẻ chặn tóm được hộp đã khóa → vô dụng. Chỉ **tôi có chìa riêng** → mở được.

#### "Trao đổi khóa" thực chất trao 3 thứ
| Trao đổi | Là gì | Vai trò |
|---|---|---|
| **1. Certificate + Public key** | Server gửi chứng chỉ + khóa công khai | Client dùng để khóa & **kiểm tra danh tính server** |
| **2. Vật liệu tạo khóa** | Số ngẫu nhiên + tính toán (kiểu Diffie-Hellman) | 2 bên **cùng suy ra 1 chìa chung bí mật** |
| **3. Session key** (kết quả) | Chìa chung vừa thống nhất | Mã hóa **toàn bộ** dữ liệu sau đó |

#### Vì sao 2 bên có chung chìa mà kẻ nghe lén không có? → Ví "pha màu" 🎨 (Diffie-Hellman)
1. Hai bên công khai chọn 1 **màu chung** (vàng) — kẻ nghe lén thấy cũng được.
2. Mỗi bên trộn thêm **màu bí mật riêng** (bạn: đỏ; server: xanh) → gửi hỗn hợp cho nhau.
3. Kẻ nghe lén tóm được 2 hỗn hợp nhưng **không tách ngược ra màu bí mật** (trộn màu dễ, tách cực khó — giống toán học một chiều).
4. Mỗi bên trộn tiếp màu bí mật của mình vào hỗn hợp nhận được → **cả 2 ra CÙNG một màu cuối** = chìa chung. Kẻ nghe lén **không tạo ra** màu đó.

→ Đặc biệt: 2 bên có chung "màu bí mật" **mà chưa hề gửi màu bí mật nào qua mạng.**

#### Sau handshake → CHUYỂN sang khóa đối xứng ⭐
- Khóa **bất đối xứng** (public/private) **chậm** → chỉ dùng ở **handshake** để thống nhất chìa chung.
- Xong → cả phiên dùng **khóa đối xứng** (1 chìa chung, khóa = mở) mã hóa dữ liệu thật → **nhanh**.
- Nên TLS = **kết hợp cả hai:** bất đối xứng (an toàn, để trao chìa) + đối xứng (nhanh, để chạy dữ liệu).

#### Tác dụng — không chỉ mã hóa, mà 3 việc:
| Tác dụng | Nghĩa |
|---|---|
| **1. Bảo mật (Confidentiality)** | Mã hóa → kẻ chặn không đọc được nội dung |
| **2. Xác thực (Authentication)** | **Certificate** (do bên thứ 3 tin cậy — CA — cấp) chứng minh "đúng server `google.com` thật", không phải kẻ giả mạo |
| **3. Toàn vẹn (Integrity)** | Phát hiện nếu dữ liệu bị **sửa** giữa đường |

> ⚠️ Nếu chỉ mã hóa mà không xác thực → bạn có thể đang mã hóa để nói chuyện với... **kẻ giả mạo**. Certificate đảm bảo đúng server. Đó là lý do trình duyệt cảnh báo đỏ khi cert sai/hết hạn.

> 🔑 **Chốt:** TLS handshake đặc biệt ở chỗ dùng **khóa bất đối xứng** để 2 bên **cùng thống nhất 1 chìa chung bí mật MÀ KHÔNG gửi chìa đó qua mạng** (kẻ nghe lén thấy hết vẫn không suy ra — nhờ toán "trộn dễ, tách khó"), rồi chuyển sang **khóa đối xứng** cho nhanh. Làm 1 lần/connection ([[02 - What is HTTP?#6.1. Multiplexing & Vòng đời Connection (đào sâu)|nhớ connection bài 02]]). Tác dụng: **bí mật + xác thực server thật + chống sửa.**
>
> *Một câu khắc cốt:* **cái tài của TLS là cho 2 người lạ thống nhất mật mã chung ngay giữa đám đông đang nghe lén — mà không ai nghe được mật mã đó.**

*(Chi tiết sâu — RSA, Diffie-Hellman, CA, chữ ký số — sẽ có ở bài riêng về Cryptography/SSL-TLS.)*

### 6.5. Bước 5 — HTTP request: gửi yêu cầu

Giờ đường ống đã mở + mã hóa xong, trình duyệt mới gửi **yêu cầu thật** theo luật HTTP (chi tiết [[02 - What is HTTP?|bài 02]]):
```
GET / HTTP/1.1
Host: google.com
Accept: text/html
```
- **Method + path** = "muốn gì": `GET /` = "cho tôi trang chủ".
- Toàn bộ dòng này **đã được mã hóa** bằng session key (§6.4) trước khi rời máy → kẻ chặn chỉ thấy mớ rác.
- Nội dung này nằm ở **tầng 4 (Application)**, được bọc xuống TCP → IP → gửi đi (§3).

→ Kết quả bước 5: server nhận được "khách xin trang chủ".

### 6.6. Bước 6 — Server xử lý & trả response

Server Google nhận request → **xử lý** → trả về **response** (chi tiết [[02 - What is HTTP?#3. Response — server "đáp" cái gì?|bài 02 §3]]):
```
HTTP/1.1 200 OK
Content-Type: text/html
...
<!doctype html> ...(nội dung trang)...
```
- **Status code** (`200` ok, `404` không thấy...) = "phiếu kết quả".
- **Body** = nội dung thật: **HTML** (khung trang), thường kèm link tới CSS/JS/ảnh.
- Với backend bạn viết: đây chính là chỗ **code của bạn chạy** (đọc DB, xử lý logic) rồi trả JSON/HTML.

→ Kết quả bước 6: trình duyệt nhận được HTML + tài nguyên.

### 6.7. Bước 7 — Trình duyệt render (dựng trang)

Server trả **code thô** (HTML/CSS/JS), nhưng bạn thấy **trang đẹp** — ai biến code → hình? **Trình duyệt** (nhớ vai trò client):
1. **HTML** → dựng khung (chữ, nút, cấu trúc).
2. **CSS** → tô màu, bố cục, font.
3. **JavaScript** → chạy code cho trang tương tác được.
4. Thấy cần thêm ảnh/CSS/JS → **quay lại bước 5** xin tiếp (nhiều request, đi chung connection — [[02 - What is HTTP?#6.1. Multiplexing & Vòng đời Connection (đào sâu)|multiplexing bài 02]]).

→ Kết quả: trang google.com hiện ra trước mắt bạn. **Xong toàn bộ hành trình.**

> 🔑 **Chốt cả mục 6:** gõ tên → **DNS** dịch ra IP (hỏi phân cấp root→TLD→authoritative) → **routing** đưa packet qua các router/BGP tới IP đó → **TCP** bắt tay mở ống tin cậy → **TLS** trao khóa mã hóa → **HTTP** xin trang → **server** trả HTML → **trình duyệt render**. Mỗi bước là một tầng/giao thức riêng ghép lại.

---

## 7. Liên hệ công việc: Shopify app + Firebase/GCP

- **App Shopify = một client.** Merchant bấm nút → gửi **HTTP request** tới backend bạn (Cloud Run / Cloud Functions) đúng luồng mục 6.
- **Webhook Shopify** (`orders/create`...): Shopify **chủ động đóng vai client, gửi HTTP POST** tới URL public của bạn. Backend bạn lúc này là **server** phải có **domain/IP công khai + port mở + HTTPS**.
- **DNS thực tế:** deploy Cloud Run được URL `xxx.run.app`. Gắn custom domain → phải **cấu hình bản ghi DNS (A record / CNAME)** trỏ domain → dịch vụ (mục 1.3 + 5).
- **HTTPS bắt buộc:** Shopify chỉ nhận webhook/redirect qua HTTPS → **TLS handshake (mục 6.4)** không phải lý thuyết.
- **SSH:** khi bạn `gcloud compute ssh` vào một VM, đó là dịch vụ SSH (port 22) ở mục 5.
- **TCP:** Firestore, REST/GraphQL Shopify... đều chạy trên **TCP/HTTP** vì cần chính xác tuyệt đối.

---

## 8. Tự kiểm tra

1. Internet ở tầng vật lý thực chất là gì? Dữ liệu vượt Thái Bình Dương bằng đường nào?
2. Phân biệt MAC address, IP address, Port — mỗi cái lo chặng nào?
3. Packet switching khác circuit switching ra sao? Vì sao Internet chọn packet switching?
4. Kể tên 4 tầng của mô hình TCP/IP và nhiệm vụ mỗi tầng.
5. TCP khác UDP ở điểm cốt lõi nào? Cho 1 ví dụ mỗi loại.
6. "Web" và "Internet" khác nhau chỗ nào?
7. Khi Shopify gửi webhook tới backend bạn, ai là client ai là server?

Chạy thử để thấy tận mắt:
```bash
ping google.com          # gửi gói ICMP, xem IP + độ trễ (ms)
traceroute google.com    # xem packet đi qua BAO NHIÊU router tới đích
nslookup google.com      # xem DNS trả về IP nào
curl -v https://google.com   # xem tận mắt handshake + HTTP request/response
```

---

**Bài tiếp theo:** *"What is HTTP?"* — mổ xẻ giao thức mà backend bạn dùng nhiều nhất.

---

## Nguồn tham khảo
- [roadmap.sh — How does the internet work?](https://roadmap.sh/guides/what-is-internet) (bài gốc của series)
- [MDN — How does the Internet work](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work) (nguồn tài liệu bài này trỏ tới; ví dụ switch = người gác ga, router = bưu điện, "network of networks")
- [roadmap.sh — Backend Developer Roadmap](https://roadmap.sh/backend)
