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
Nối 10 máy mà đấu dây từng-cặp-với-nhau thì rối tung. Giải pháp: mỗi máy cắm vào một cục nhỏ gọi là **switch**.
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
Router chỉ làm **ĐÚNG 1 việc: nối mạng-của-bạn với một MẠNG KHÁC.**
> MDN ví: *router giống bưu điện* — gói tin tới, nó đọc địa chỉ người nhận và **chuyển tiếp gói sang đúng mạng đích**.

**"Nối mạng với mạng" và "nối ra Internet" là CÙNG một việc, đừng nghĩ là hai việc khác nhau:**
- Nối **LAN nhà bạn ↔ LAN nhà hàng xóm** → mạng-với-mạng ✅
- Nối **LAN nhà bạn ↔ mạng của ISP (Viettel/FPT)** → **cũng là** mạng-với-mạng ✅. Chỉ khác: mạng ISP này lại nối tiếp tới hàng nghìn mạng khác = **Internet**.

→ Nên câu *"router giúp ra Internet"* thực chất = *"router nối mạng nhà bạn với mạng ISP"*. **Ra thế giới chỉ là KẾT QUẢ**, vì mạng ISP đó dẫn tới tất cả mạng còn lại. Router không phân biệt "gần hay xa" — nó chỉ lo đưa gói **ra khỏi mạng của bạn**.

*(Ví đời sống: router = **cửa chính nhà bạn**. Đi sang nhà hàng xóm hay ra phố lớn đi khắp thế giới — đều qua cửa chính đó. Cửa chính chỉ lo "đưa bạn ra khỏi nhà"; đi được tới đâu là nhờ hệ thống đường phố = ISP bên ngoài.)*

> **Đừng lẫn:** Switch nối máy trong *cùng* một mạng; Router nối *các mạng khác nhau*.

### 1.4. Bước 4 — Nối ra cả thế giới → ISP → "mạng của các mạng"
Không thể tự kéo dây tới từng nhà trên Trái Đất. Nên bạn nối mạng của mình vào một **ISP (Internet Service Provider)** — công ty quản một đống router **nối với nhau, và nối tiếp tới router của các ISP khác**.
> MDN: *"message từ mạng của bạn được vận chuyển qua mạng-của-các-ISP tới mạng đích. Internet chính là toàn bộ hạ tầng mạng lưới này."*

**❓ Các ISP có nối với nhau không? → CÓ, bắt buộc. Và đây là điều làm nên Internet.**

Nếu các ISP **không** nối nhau, mỗi ISP là **một ốc đảo tách biệt:**
- ❌ Bạn dùng **FPT** → chỉ với tới người/web cũng dùng FPT. **Không** vào được Facebook, **không** nhắn được cho bạn dùng Viettel, **không** mở web đặt ở nước ngoài. Internet vỡ vụn thành nhiều mảnh rời.
- ✅ Vì ISP **có** nối nhau → gói tin của bạn (FPT) đi xuyên FPT → sang Viettel/Google/... → tới đích. Bạn với tới **bất kỳ ai trên Trái Đất**, dù họ ở nhà mạng nào, nước nào.

**Tác dụng:** biến các mạng rời rạc thành **MỘT Internet thống nhất**. Chữ "of" trong "network **of** networks" chính là **các kết nối giữa ISP**. (Cách nối cụ thể — *peering* & *transit* — xem mục 1.6.)

*Ví dụ 1 dòng:* bạn (FPT) nhắn bạn bè (Viettel): tin đi **FPT → điểm nối FPT–Viettel → Viettel → máy bạn bè**. Không có "điểm nối" đó, tin không bao giờ tới.

→ Đây là lý do gọi Internet là **"network of networks" (mạng của các mạng)**: hàng nghìn mạng độc lập nối lại, **không có trung tâm** (đã bàn ở phần "không phải cây" trước đó).

### 1.5. Vượt đại dương bằng gì?
Không phải vệ tinh (đa số). **Phần lớn lưu lượng liên lục địa đi qua CÁP QUANG NGẦM DƯỚI BIỂN (submarine cables)** — dây cáp thật nằm dưới đáy đại dương nối các châu lục. Việt Nam nối ra thế giới qua vài tuyến cáp biển (AAG, APG...) — tin *"cáp quang biển đứt, mạng quốc tế chậm"* chính là mấy tuyến này.

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

- **Tier 1:** vài "ông lớn" sở hữu cáp xương sống toàn cầu, nối trực tiếp với nhau miễn phí (*peering*).
- **IXP (Internet Exchange Point):** "chợ đầu mối" nơi nhiều ISP cắm chung một chỗ để trao đổi dữ liệu cho gần, nhanh, rẻ.

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

| Đời thực (bưu điện) | Internet |
|---|---|
| Địa chỉ nhà người nhận | **IP address** |
| Số căn hộ cụ thể trong tòa nhà | **Port** |
| Số CMND dán cứng trên thùng hàng | **MAC address** (địa chỉ phần cứng) |
| Chia thư dài thành nhiều phong bì đánh số | **Packets** (gói tin) |
| Quy tắc "ghi địa chỉ góc phải, dán tem" | **Protocol** (TCP/IP) |
| Bưu cục trung chuyển | **Router** |
| Trạm phân loại trong 1 khu phố | **Switch** (trong mạng LAN) |
| Danh bạ "tên người → địa chỉ nhà" | **DNS** |
| Thư bảo đảm, có ký nhận, gửi lại nếu mất | **TCP** |
| Thư thường, gửi đại cho nhanh | **UDP** |

**Ý tưởng lớn nhất — Packet Switching:** dữ liệu **không đi nguyên khối**. Nó bị **cắt thành nhiều gói nhỏ (packets)**, mỗi gói **tự tìm đường riêng** qua các router, rồi được **ráp lại** ở đầu nhận. (Khác điện thoại xưa – *circuit switching* – phải giữ 1 đường dây riêng suốt cuộc gọi. Packet switching hiệu quả hơn vì đường truyền được chia sẻ.)

#### Vì sao phải cắt nhỏ? (không gửi nguyên khối cho khỏe?)
Trực giác "gửi nguyên khối cho khỏi phải ráp" nghe hợp lý nhưng **sai** — cắt nhỏ lợi hơn hẳn:

1. **Đường truyền là DÙNG CHUNG** ⭐ (lý do lớn nhất). Một sợi cáp có hàng nghìn người xài chung. Gửi nguyên khối 1GB = **chiếm trọn** cáp mấy phút, người khác đứng chờ. Cắt nhỏ → gói của bạn và gói người khác **xen kẽ** chạy, ai cũng được phục vụ.
   > *Đời sống:* đường cao tốc. Một xe tải **dài 2km** làm tắc cả đường; chia thành nhiều xe nhỏ → tất cả chạy xen kẽ, thông suốt.
2. **Lỗi thì gửi lại mẩu nhỏ, không phải cả khối.** Khối 1GB hỏng ở 99% → gửi lại **cả 1GB**. Cắt nhỏ → chỉ gửi lại **đúng mẩu vài KB** bị hỏng.
3. **Đi nhiều đường song song + tự né tắc/đứt.** Một tuyến đứt cáp → gói sau **tự đi đường khác**. Gửi nguyên khối = khóa cứng 1 đường, đường chết là chết hết.
4. **Router không cần RAM khổng lồ** để nuốt cả khối — chỉ chứa tạm 1 gói nhỏ rồi đẩy đi.

→ Còn *"ráp lại mất thời gian"*? **Rất rẻ:** mỗi gói có sẵn **số thứ tự**, máy nhận chỉ xếp theo số. Cái giá rẻ mạt để đổi lấy 4 lợi ích trên.

#### Cắt nhỏ theo quy tắc gì? Kích thước bao nhiêu?
- **Giới hạn là MTU (Maximum Transmission Unit)** — kích thước tối đa của **một gói** mà đường truyền cho phép. Với mạng **Ethernet phổ biến, MTU = 1500 byte**. Dữ liệu to hơn → **bắt buộc phải cắt** thành nhiều gói ≤ 1500 byte.
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
- **MAC address:** địa chỉ **phần cứng**, gắn cứng vào card mạng từ nhà máy (vd `A4:B1:C2:...`). Dùng để nói chuyện **trong cùng một mạng nội bộ (LAN)** — router dùng nó để biết đưa gói cho đúng thiết bị trong nhà.
- **IP address:** địa chỉ **logic**, có thể đổi. Dùng để định tuyến **xuyên Internet** (máy này ở mạng nào, nước nào).
- **Port:** số cổng để phân biệt **dịch vụ nào trên cùng một máy**. Vd cùng IP server nhưng port `443` = HTTPS, port `22` = SSH, port `5432` = PostgreSQL.

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

**Cách chạy (quan trọng):** ở máy **gửi**, dữ liệu đi **XUỐNG** tầng 4 → 1, mỗi tầng **bọc thêm một lớp "phong bì" riêng** (gọi là *encapsulation* — tầng Transport thêm số thứ tự, tầng Internet thêm IP...). Truyền qua dây tới máy **nhận**, rồi đi **LÊN** tầng 1 → 4, mỗi tầng **bóc đúng lớp phong bì của mình** ra, cuối cùng tầng 4 nhận lại đúng "lá thư" ban đầu.

> **Ví von cho dễ nhớ:** gửi quà — bạn viết thiệp (tầng 4) → bỏ vào hộp có dán số kiện (tầng 3) → dán nhãn địa chỉ người nhận (tầng 2) → shipper chở đi (tầng 1). Người nhận làm ngược lại: nhận hàng → xé nhãn → mở hộp → đọc thiệp. Mỗi lớp bọc chỉ do đúng "bộ phận" của nó xử lý.

### 3.1. TCP vs UDP (tầng Transport) — điểm cốt lõi
**TCP = thư bảo đảm:**
1. **Bắt tay 3 bước (3-way handshake):** A "gửi được không?" (SYN) → B "được" (SYN-ACK) → A "ok" (ACK). Thiết lập kết nối trước khi gửi.
2. Đầu nhận **báo đã nhận (ACK)** từng phần; mẩu nào mất → **gửi lại**.
3. Ráp gói theo **đúng thứ tự**.
→ **Chậm hơn nhưng đáng tin.** Dùng cho web, email, tải file, API — thứ không được sai 1 byte.

**UDP = thư thường:** bắn đi luôn, không bắt tay, không kiểm tra mất mát → **nhanh, độ trễ thấp, nhưng có thể rớt gói.** Dùng cho video call, game, livestream (mất 1 khung hình chẳng sao, cần real-time).

---

## 4. Client – Server: mô hình chạy trên Internet

Hầu hết Internet hoạt động theo **client–server**:
- **Client** (máy khách): kẻ *hỏi* — trình duyệt, app điện thoại, app Shopify của merchant.
- **Server** (máy chủ): kẻ *trả lời* — máy chạy 24/7, giữ dữ liệu, xử lý và trả kết quả.

Client gửi **request** → Server xử lý → trả **response**. (Còn mô hình **P2P** – peer-to-peer – các máy vừa hỏi vừa trả lời ngang hàng, như BitTorrent, blockchain — nhưng web chủ yếu là client–server.)

> **Backend của bạn = phần "Server".** Học backend = học viết cái kẻ-trả-lời này.

---

## 5. "Dịch vụ chạy trên Internet" là những gì?

Internet là *đường ống*; trên đó chạy **nhiều dịch vụ khác nhau**, mỗi dịch vụ một giao thức riêng (tầng Application):

| Dịch vụ | Giao thức | Port hay dùng | Để làm gì |
|---|---|---|---|
| **Web** (WWW) | HTTP / HTTPS | 80 / 443 | Xem trang web, gọi API |
| **Email** | SMTP, IMAP, POP3 | 25/587, 143, 110 | Gửi/nhận mail |
| **DNS** | DNS | 53 | Dịch tên miền → IP |
| **Truyền file** | FTP / SFTP | 21 / 22 | Upload/download file |
| **Remote shell** | SSH | 22 | Điều khiển server từ xa |
| **Streaming/Game** | thường trên UDP | tùy | Video call, game real-time |

> **Điểm mấu chốt cần khắc:** **Web ≠ Internet.** Web (các trang qua HTTP) chỉ là **MỘT** dịch vụ chạy trên Internet. Email, SSH, game... là các dịch vụ khác cũng dùng chung hạ tầng Internet. Backend dev làm việc nhiều nhất với **HTTP/HTTPS**, nhưng cũng đụng SSH (vào server), DNS (trỏ domain), SMTP (gửi mail xác nhận đơn hàng).

---

## 6. Ráp lại: gõ `google.com` + Enter thì sao? (câu phỏng vấn kinh điển)

1. **DNS lookup:** dịch `google.com` → IP (hỏi DNS resolver → root → TLD `.com` → authoritative server của Google).
2. **Định tuyến:** request đi qua router nhà → ISP → có thể qua cáp biển → tới mạng của Google. Mỗi router chọn chặng kế tiếp gần đích nhất.
3. **TCP handshake:** máy bạn "bắt tay 3 bước" với server Google (thường ở port 443).
4. **TLS handshake (HTTPS):** trao đổi khóa để **mã hóa** → ổ khóa 🔒. Không có bước này, dữ liệu đi trần trên đường, ai chặn cũng đọc được.
5. **HTTP request:** trình duyệt gửi `GET /` — "cho tôi trang chủ".
6. **Server xử lý** → trả **HTTP response** (HTML, CSS, JS).
7. **Trình duyệt render** rồi xin tiếp ảnh/CSS/JS...

Mọi bước, dữ liệu đều bị cắt thành **packet**, mỗi packet được **bọc qua 4 tầng TCP/IP**, đi qua **router**, tới nơi thì **ráp lại**.

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
