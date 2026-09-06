# 💰 Cách YouTube tính tiền và thuật toán giới thiệu video

> [!quote] 💬
> "You don't get paid for views. You get paid for the advertiser who wanted that viewer."
> — Số view chỉ là mẫu số. Tử số nằm ở chỗ người xem đó đáng giá bao nhiêu với nhà quảng cáo.

## 🎯 Đây là gì

Thu nhập YouTube là tích của **hai hệ thống hoàn toàn độc lập**, do hai đội khác nhau ở Google vận hành:

```js
// Toàn bộ bài toán kiếm tiền YouTube gói trong 1 dòng
const revenue = views * (rpm / 1000)
//              ↑                ↑
//     hệ thống ĐỀ XUẤT    hệ thống ĐẤU GIÁ QUẢNG CÁO
//     (quyết định có view)  (quyết định 1 view đáng bao nhiêu)
```

Hầu hết người mới chỉ tối ưu vế trái (cày view) và bỏ mặc vế phải. Nhưng vế phải chênh nhau tới **50 lần** giữa các lựa chọn, trong khi cày view gấp 50 lần thì gần như bất khả thi. **Chọn đúng ngách + đúng khán giả có đòn bẩy lớn hơn chăm chỉ rất nhiều.**

> [!note] 📝 So sánh dễ hiểu
> Giống mở quán ăn. **Thuật toán đề xuất** là vị trí mặt bằng — quyết định bao nhiêu người đi ngang qua. **RPM** là giá trung bình mỗi khách gọi món — quyết định mỗi người đi ngang đáng bao nhiêu tiền. Quán phở vỉa hè ở khu đông người và nhà hàng vắng khách ở khu nhà giàu có thể ra cùng doanh thu. Sai lầm phổ biến là cắm đầu kéo khách mà quên rằng mình đang bán trà đá.

---

# PHẦN 1 — Cách tính tiền

## 💵 Chuỗi tiền đi từ nhà quảng cáo về túi bạn

```
Nhà quảng cáo đấu giá   →   CPM   →   YouTube giữ 45%   →   bạn nhận 55%   →   RPM   →   AdSense
   (bid theo khán giả)                  (long-form)                            (chia cho MỌI view)
```

Có **4 chỗ hao hụt** giữa "1000 view" và "tiền thật", và đây là lý do người mới luôn sốc khi thấy con số đầu tiên:

| Bước | Hao hụt vì | Còn lại |
|---|---|---|
| 1000 view | — | 1000 |
| Video có bật quảng cáo | video bị giới hạn (nhạc bản quyền, chủ đề nhạy cảm) không chạy ad | ~800 |
| **Monetized playback** | người dùng Premium, ad blocker, không có advertiser nào bid cho khán giả đó | ~400–600 |
| **Revenue share** | YouTube giữ **45%** | ×0.55 |
| Thuế | Mỹ khấu trừ theo hiệp định thuế (VN có hiệp định, khai W-8BEN để giảm) | ×0.9 |

## 📐 CPM vs RPM — hai số bị nhầm nhiều nhất

Đây là định nghĩa chính thức của YouTube, khác nhau ở **3 điểm** chứ không phải 1:

```js
// ❌ Bad — nghĩ RPM là CPM sau khi trừ % của YouTube
const rpm = cpm * 0.55  // sai: bỏ sót việc mẫu số khác nhau

// ✅ Good — mẫu số hoàn toàn khác nhau
const cpm = adSpend / adImpressions * 1000   // TRƯỚC chia sẻ, chia cho số LẦN HIỆN AD
const rpm = totalRevenue / views * 1000      // SAU chia sẻ, chia cho TỔNG VIEW
```

| | CPM | RPM |
|---|---|---|
| Góc nhìn | nhà quảng cáo **chi** bao nhiêu | creator **nhận** bao nhiêu |
| Mẫu số | số lần hiện quảng cáo | **tổng view**, kể cả view không có ad |
| Thời điểm | trước khi YouTube chia | sau khi YouTube chia |
| Bao gồm | chỉ ad + Premium | ad + Premium + membership + Super Chat + Super Thanks |

> [!tip] 💡 Chỉ nhìn RPM
> CPM cao nhưng RPM thấp là chuyện bình thường và vô nghĩa để khoe. **RPM là con số duy nhất trả lời được "kênh mình đáng giá bao nhiêu"**, vì nó đã gộp mọi nguồn thu và chia cho mọi view. RPM luôn thấp hơn CPM, thường chỉ bằng 1/3 đến 1/2.

## 🌍 RPM phụ thuộc vào 2 thứ — và không thứ nào là "chăm chỉ"

**1. Quốc gia người xem** (không phải quốc gia của bạn):

| Khán giả | Hệ số so với Mỹ |
|---|---|
| Mỹ, Úc, Bắc Âu | 1.0× |
| Tây Âu, Nhật, Hàn | 0.5–0.8× |
| Đông Âu, Brazil | 0.2–0.3× |
| **Việt Nam, Đông Nam Á** | **0.15–0.30×** |
| Ấn Độ | 0.1–0.15× |

**2. Ngách nội dung** (advertiser trong ngách đó chịu chi bao nhiêu):

| Ngách | CPM 2026 | RPM thực nhận |
|---|---|---|
| Finance, B2B SaaS, Legal | $25–50 | $10–20+ |
| **Tech, software, review** | **$12–30** | **$5–13** (khán giả Mỹ) |
| Education, How-to | $8–15 | $3–7 |
| Vlog, Entertainment | $4–8 | $1–3 |
| Gaming | $1–4 | $0.5–1.5 |

> [!warning] ⚠️ Ngách tech + khán giả Việt Nam = $1–5 RPM
> Cùng một video kỹ thuật: khán giả Mỹ ~**$18 RPM**, khán giả Ấn ~**$2.70**, khán giả VN rơi vào khoảng **$1–5**. Nội dung y hệt, công sức y hệt, chênh **5–15 lần**. Với nội dung kỹ thuật thì rào cản ngôn ngữ thấp — đây là đòn bẩy dễ kéo nhất trong toàn bộ bài toán.

## 📺 Long-form vs Shorts — chênh 50 lần

```js
// Long-form: ad gắn TRỰC TIẾP vào video của bạn
creatorShare = adRevenueOfThisVideo * 0.55

// Shorts: KHÔNG có ad riêng. Gộp chung 1 quỹ rồi chia theo tỷ lệ view
const pool = shortsAdRevenue - musicLicensingCost   // trừ tiền bản quyền nhạc TRƯỚC
creatorShare = pool * (myShortsViews / allShortsViews) * 0.45
```

| | Long-form | Shorts |
|---|---|---|
| Tỷ lệ chia | **55%** | **45%** của quỹ |
| Cơ chế | ad gắn vào video của bạn | chia quỹ theo tỷ trọng view |
| Trừ tiền nhạc | không | **có**, trừ trước khi chia |
| RPM điển hình | $1–20 | **$0.01–0.06** |
| 1 triệu view ≈ | $1.000–20.000 | **$10–60** |

Đây là con số cần khắc vào đầu: **1 triệu view Shorts ≈ 1 nghìn view long-form Mỹ.** Shorts là kênh khám phá, không phải kênh doanh thu.

## 🚪 Điều kiện vào YPP — và cái deadline không ai nói

| Mốc | Yêu cầu | Mở khoá |
|---|---|---|
| Tier 1 | 500 sub + 3 video public/90 ngày + (3.000 giờ xem **hoặc** 3 triệu view Shorts/90 ngày) | Super Thanks, membership, Shopping — **chưa có tiền ad** |
| Tier 2 (hiện tại) | 1.000 sub + (**4.000 giờ xem**/12 tháng **hoặc** 10 triệu view Shorts/90 ngày) | **Tiền quảng cáo** |

> [!danger] ⛔ Từ 1/2/2027 ngưỡng tăng GẤP ĐÔI
> YouTube đã thông báo chính thức: người nộp đơn **mới** sẽ cần **8.000 giờ xem/365 ngày** (thay vì 4.000), hoặc **20 triệu view Shorts/90 ngày** (thay vì 10 triệu). Ai đã vào YPP trước ngày đó **không bị áp dụng**.
> Hôm nay là **tháng 9/2026** — còn khoảng **5 tháng**. Sau mốc đó, chi phí để bắt đầu đắt gấp đôi.

Cùng lúc, từ 1/2/2027 Shorts cần **10 triệu view/90 ngày** mới được ăn tiền ad — dưới ngưỡng vẫn giữ YPP cho long-form. Thêm một lý do nữa để bỏ Shorts khỏi kế hoạch doanh thu.

## 🧮 Bài toán ngược: cần bao nhiêu view?

```js
// Ngưỡng vào YPP tính bằng GIỜ XEM, không phải view
const targetHours = 4000                         // 8000 nếu nộp sau 1/2/2027
const videoLength = 10                           // phút
const retention   = 0.5                          // 50% — mức khá cho video 10 phút
const minutesPerView = videoLength * retention   // 5 phút

const viewsNeeded = targetHours * 60 / minutesPerView
// → 48.000 view  (hoặc 96.000 nếu nộp sau 1/2/2027)
```

Và mục tiêu **$500/tháng**:

| Kịch bản                            | RPM  | View/tháng cần |
| ----------------------------------- | ---- | -------------- |
| Tech, khán giả VN, tiếng Việt       | $1.5 | **333.000**    |
| Tech, khán giả VN + quốc tế lẫn lộn | $4   | 125.000        |
| Tech, khán giả Mỹ/Âu, tiếng Anh     | $10  | **50.000**     |

> [!tip] 💡 Đọc bảng này cho kỹ
> Chênh lệch **6,7 lần** ở cột phải không đến từ việc làm nhiều video hơn hay chăm hơn. Nó đến từ **một quyết định duy nhất lúc bắt đầu**: viết script bằng ngôn ngữ nào. Quyết định sai thì phải cày gấp 7 lần để bù.

---

# PHẦN 2 — Thuật toán giới thiệu video

## 🧠 Không có "thuật toán YouTube"

Có **nhiều hệ thống đề xuất**, mỗi bề mặt một hệ thống riêng với tín hiệu ưu tiên khác nhau:

| Bề mặt | Chạy bằng gì | Ý nghĩa với nội dung dev |
|---|---|---|
| **Search** | từ khoá trong tiêu đề, mô tả, **transcript/caption** | traffic bền, sống 2–3 năm — mỏ vàng của tutorial |
| **Suggested** (cột phải) | video nào hay được xem nối tiếp video nào | phụ thuộc việc bạn có series liên quan |
| **Home** | lịch sử xem cá nhân của từng người | cần tệp người xem trung thành, khó với kênh mới |
| **Shorts feed** | swipe rate, xem hết, xem lại | tách biệt hoàn toàn khỏi long-form |

Hệ quả thực tế: **kênh dev mới nên nhắm Search trước.** Search không cần bạn nổi tiếng, chỉ cần bạn trả lời đúng câu người ta đang gõ. Home và Suggested đến sau, khi đã có tệp người xem.

## 🔄 Vòng đời một video mới upload

```
Upload
  ↓
Phát cho một nhóm nhỏ (test)  ← YouTube "thử nước"
  ↓
Đo CTR: bao nhiêu % người THẤY thumbnail thì BẤM?
  ↓ (đạt)
Đo AVD/AVP: bấm vào rồi thì XEM ĐƯỢC BAO LÂU?
  ↓ (đạt)
Đo satisfaction: like, comment, share, KHÔNG bấm "Không quan tâm",
                 có quay lại YouTube hôm sau không
  ↓ (đạt)
Mở rộng cho nhóm lớn hơn → lặp lại vòng trên
```

Điểm mấu chốt: đây là **vòng lặp nhân lên**, không phải cộng vào. Trượt ở bước nào thì dừng ở đó.

## ✖️ Vì sao CTR và AVD phải nhân nhau

```js
// ❌ Bad — nghĩ chỉ cần thumbnail giật gân là xong
// CTR 12%, nhưng nội dung không đúng như hứa → xem 20% rồi thoát
const score = 0.12 * 0.20   // = 0.024

// ✅ Good — tiêu đề hứa vừa phải, nội dung trả đúng lời hứa
const score = 0.06 * 0.55   // = 0.033  ← cao hơn, dù CTR chỉ bằng MỘT NỬA
```

> [!warning] ⚠️ Clickbait tự huỷ trong 48 giờ
> Thumbnail giật gân kéo CTR lên ở vòng test đầu, nhưng retention sụp ở vòng sau. YouTube ghi nhận **"video này làm người xem rời nền tảng"** — tín hiệu tiêu cực mạnh hơn CTR cao rất nhiều. Kết quả: video chết nhanh hơn cả khi làm tử tế. Quy tắc an toàn: **tiêu đề được phép hứa hấp dẫn, nhưng 30 giây đầu phải trả đúng lời hứa đó.**

## 📡 Ba nhóm tín hiệu

| Nhóm | Gồm | Bạn kiểm soát bằng cách |
|---|---|---|
| **Engagement** | CTR, watch time, AVD, comment, share | thumbnail, tiêu đề, 30 giây mở đầu, nhịp cắt |
| **Satisfaction** | khảo sát sau video, tỷ lệ quay lại, nút "Không quan tâm", like/dislike | trả đúng lời hứa, không kéo dài lê thê |
| **Relevance** | tiêu đề, mô tả, **transcript**, chữ trên hình | dùng đúng từ khoá người ta gõ, upload caption |

> [!tip] 💡 Caption là tín hiệu relevance MIỄN PHÍ
> YouTube index nội dung transcript. Pipeline TTS ở [[0-Pipeline tự tạo video TikTok từ note]] đã có timing từng từ → xuất `.srt` gần như không tốn gì, upload làm caption track. Vừa được điểm accessibility, vừa nạp thẳng từ khoá kỹ thuật (`ffmpeg`, `filter_complex`, `Shopify webhook`) vào chỉ mục Search. Đa số kênh Việt bỏ qua bước này.

## 🎯 Sai lầm nhận thức lớn nhất: sub không phải tài nguyên

```js
// ❌ Bad — mô hình sai trong đầu hầu hết người mới
views = subscribers * someRate

// ✅ Good — mô hình đúng
views = impressions * ctr * (1 - dropOff)
// impressions do THUẬT TOÁN cấp, dựa trên hiệu suất video TRƯỚC
```

**Impression mới là tài nguyên bị phân bổ.** Sub chỉ là một tín hiệu đầu vào yếu để tính impression. Kênh 5.000 sub với retention tốt thường ăn đứt kênh 50.000 sub với retention rác — vì thuật toán cấp impression theo **hiệu suất gần đây**, không theo tài sản tích luỹ.

Hệ quả rất thực tế: **video mới nhất quyết định số phận video kế tiếp.** Đăng đều mà nội dung loãng còn hại hơn đăng thưa mà chắc.

## 🔮 Predictive retention (2025–2026)

Thay đổi lớn của 2 năm gần đây: YouTube dịch chuyển từ tối ưu **watch time thô** sang **dự đoán mức độ hài lòng dài hạn**. Nghĩa là:

- Kéo dài video vô nghĩa để ăn watch time → **phản tác dụng**, vì retention curve tụt.
- Hệ thống đo cả việc người xem **có quay lại YouTube hôm sau không**.
- Nội dung sản xuất hàng loạt, lặp khuôn → xếp vào **inauthentic content**, bị chặn kiếm tiền và giảm phân phối.

> [!danger] ⛔ Cảnh báo cho pipeline tự động
> Format "stock footage + giọng TTS + phụ đề tự động, sản xuất hàng loạt" là mục tiêu trực diện của chính sách inauthentic content (siết từ 7/2025). Không bị ban, nhưng **không được bật kiếm tiền** và bị bóp phân phối.
> Ranh giới YouTube vạch ra: *"có giá trị gốc đáng kể do bạn tạo ra không?"*. TTS không bị cấm — TTS đọc trên clip stock chung chung mà không thêm gì mới thì bị. Với nội dung dev, cách vượt qua rõ ràng: **screen recording code/terminal thật** vốn đã là nội dung gốc, và còn đúng thứ khán giả muốn xem.

---

# PHẦN 3 — Ghép hai vế lại

```js
const monthlyRevenue =
    videosPerMonth
  * impressionsPerVideo   // ← thuật toán cấp, dựa trên hiệu suất video trước
  * ctr                   // ← thumbnail + tiêu đề
  * (rpm / 1000)          // ← NGÁCH + QUỐC GIA KHÁN GIẢ
```

Xếp hạng đòn bẩy theo **mức tác động ÷ công sức bỏ ra**:

| Hạng | Đòn bẩy | Biên độ | Chi phí để kéo |
|---|---|---|---|
| 🥇 | **Ngôn ngữ / quốc gia khán giả** | **5–15×** | quyết định 1 lần lúc bắt đầu |
| 🥈 | **Chọn ngách** (tech/B2B thay vì vlog) | 3–10× | quyết định 1 lần lúc bắt đầu |
| 🥉 | **Long-form thay vì Shorts** | 20–50× | đổi format render |
| 4 | Thumbnail + tiêu đề (CTR 3% → 9%) | 3× | mỗi video, học được |
| 5 | Retention (30 giây đầu + nhịp cắt) | 2× | mỗi video, khó nhất |
| 6 | Số lượng video | tuyến tính | tốn nhiều công nhất |

Ba đòn bẩy mạnh nhất đều là **quyết định chiến lược lúc bắt đầu, không phải nỗ lực hàng ngày**. Đây là lý do đáng dừng lại lên kế hoạch trước khi làm video đầu tiên — sửa sau tốn hơn nhiều lần.

---

## 📚 Tham khảo

- 🔥 [New opportunities to earn and changes to the YouTube Partner Program — YouTube Blog](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/) — thông báo chính thức: từ 1/2/2027 ngưỡng lên 8.000 giờ xem / 20 triệu view Shorts cho người nộp mới, Shorts cần 10 triệu view/90 ngày mới ăn tiền ad.
- [RPM vs CPM — YouTube Help](https://support.google.com/youtube/answer/9314357) — định nghĩa chính thức hai chỉ số, cái nào tính trước/sau chia sẻ doanh thu và gồm những nguồn thu nào.
- [YouTube partner earnings overview — YouTube Help](https://support.google.com/youtube/answer/72902) — tỷ lệ chia theo từng module (ad, membership, Super Chat, Premium), lịch thanh toán và ngưỡng $100 của AdSense.
- [YouTube Revenue Sharing: How the 55/45 Split Really Works](https://ytmoneycalculator.com/blog/youtube-revenue-sharing/) — giải thích cơ chế quỹ chung của Shorts và vì sao trừ tiền bản quyền nhạc trước khi chia.
- [YouTube CPM and RPM Rates by Country (2026)](https://www.ytface.com/cpm-rates-by-country) — bảng hệ số RPM theo quốc gia người xem, Đông Nam Á ở mức 0.15–0.30× so với Mỹ.
- 🔥 [How the YouTube Algorithm Works in 2026 — vidIQ](https://vidiq.com/blog/post/understanding-youtube-algorithm/) — ba nhóm tín hiệu engagement/satisfaction/relevance và cơ chế test trên nhóm nhỏ trước khi mở rộng.
- [Tech YouTube CPM Rate 2026 — CheckTheWorth](https://checktheworth.com/blog/technology-youtube-cpm-rate) — số liệu riêng ngách công nghệ: CPM $12–30, RPM $5–13 với khán giả Mỹ.

---

## ✅ Checklist

- [ ] Hiểu **RPM ≠ CPM × 0.55** — mẫu số khác nhau, RPM chia cho **tổng view** kể cả view không có ad
- [ ] Chốt **ngôn ngữ + quốc gia khán giả** trước khi quay video đầu tiên — đòn bẩy 5–15×, sửa sau rất đắt
- [ ] Chốt ngách có advertiser chịu chi (tech/B2B/finance), không phải ngách mình thích nhất
- [ ] **Long-form 16:9** cho doanh thu; Shorts chỉ làm phễu, RPM chênh 20–50 lần
- [ ] Nhắm **Search** trước Home/Suggested — kênh mới không có tệp người xem để Home hoạt động
- [ ] Upload **caption/transcript** mỗi video — tín hiệu relevance miễn phí, đa số kênh Việt bỏ qua
- [ ] Tiêu đề hứa hấp dẫn nhưng **30 giây đầu trả đúng lời hứa** — CTR × AVD nhân nhau, không cộng
- [ ] Đừng kéo dài video để ăn watch time — predictive retention phạt ngược
- [ ] Nội dung phải có **giá trị gốc** (screen recording thật), tránh dính inauthentic content
- [ ] ⛔ Nếu định vào YPP: nhắm **4.000 giờ xem trước 1/2/2027**, sau mốc đó ngưỡng gấp đôi lên 8.000
- [ ] Tính ngược từ mục tiêu tiền → RPM → view cần, trước khi cam kết lịch đăng
