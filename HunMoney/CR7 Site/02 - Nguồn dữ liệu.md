---
tags: [project, cr7, data, api]
created: 2026-09-08
---

# 02 - Nguồn dữ liệu — lấy thông tin ở đâu

Câu hỏi: 978 bàn thắng, mỗi bàn cần ngày/đối thủ/phút/kiểu ghi bàn/kiến tạo — moi ở đâu ra?

Chia làm 2 bài toán khác nhau:
- **Backfill lịch sử** (2002→nay): làm một lần, chấp nhận tốn công.
- **Cập nhật live** (mỗi trận mới): phải tự động.

---

## A. Backfill lịch sử — nguồn miễn phí

| Nguồn | Được gì | Vấn đề |
|---|---|---|
| **Wikipedia** — trang "List of career goals scored by Cristiano Ronaldo" (chưa verify URL chính xác, cần check ở GĐ 0) | Bảng đầy đủ ngày, đối thủ, giải, tỉ số | HTML table, phải parse; đôi khi thiếu phút/kiểu ghi bàn |
| **FBref** — [fbref.com](https://fbref.com/) | Số liệu nâng cao (xG, shot map) từ ~2017 trở đi | Dữ liệu cũ (Sporting/MU 2003) không có; ToS hạn chế scrape |
| **Transfermarkt** | Từng bàn có phút + kiểu ghi bàn + assist, đủ từ 2002 | Chống bot mạnh, cần đi chậm |
| **Sofascore / FotMob** — [sofascore](https://www.sofascore.com/football/player/cristiano-ronaldo/750), [fotmob](https://www.fotmob.com/players/30893/cristiano-ronaldo) | JSON nội bộ khá đẹp | API nội bộ, không có giấy phép — dùng để **đối chiếu**, đừng phụ thuộc |

**Cách làm thực tế:** dựng dataset gốc từ Wikipedia (dễ parse, license CC BY-SA — nhớ ghi nguồn), rồi làm giàu (enrich) bằng Transfermarkt cho phút/assist, cuối cùng đối chiếu tổng số với các site đếm công khai. Nếu tổng khớp 978 thì dataset sạch.

> Ghi chú license: Wikipedia là CC BY-SA → nếu copy nguyên bảng thì **phải ghi nguồn và giữ cùng license**. Nếu chỉ lấy *sự kiện* (ngày, tỉ số, tên cầu thủ) thì đó là **fact**, không có bản quyền. → An toàn hơn: lấy fact, tự viết lại phần mô tả.

---

## B. Cập nhật live — API trả phí

### API-Football (api-sports.io) — lựa chọn mặc định
- Free: **100 request/ngày**, mở đủ mọi endpoint (không khoá tính năng theo gói)
- Pro: **$19/tháng**, 7.500 request/ngày
- Mega: **$39/tháng**, 150.000 request/ngày
- Khác biệt giữa các gói chỉ là **số lượng request + độ sâu lịch sử**, không phải tính năng
- Nguồn: [api-football.com/pricing](https://www.api-football.com/pricing)

Site đối thủ [cr1000goals.com](https://cr1000goals.com/) tự khai là lấy dữ liệu live từ API-Football → tức là đường này đã được chứng minh chạy được.

**Với use case của mình, gói FREE là đủ.** Lý do: chỉ theo dõi 1 cầu thủ, ~2 trận/tuần. Cron chạy 4 lần/ngày = 4 request/ngày, còn thừa chỗ.

### Các API khác để dự phòng
- **Sportmonks** — có [trang so sánh 9 API bóng đá 2026](https://www.sportmonks.com/football-api/alternatives/), gói rẻ nhưng giới hạn giải
- **TheStatsAPI**, **Highlightly** — nổi lên gần đây, [Highlightly có bài so sánh](https://highlightly.net/blogs/best-football-apis-in-2026)

---

## C. Kiến trúc dữ liệu đề xuất

**Nguyên tắc: không gọi API từ browser.** Không phải vì bảo mật key (dù cũng đúng), mà vì kinh tế — 10.000 khách/ngày × 1 request = vượt quota ngay. Ngược lại, cron ghi vào DB rồi cho khách đọc DB = 4 request/ngày bất kể bao nhiêu khách.

```
Cron (mỗi 6h)  →  gọi API-Football  →  so với DB
                                       ↓ có bàn mới?
                                    ghi Firestore
                                       ↓
                              client đọc Firestore (cache dài)
```

Schema một bàn thắng:

```js
// collection: goals, doc id = số thứ tự bàn thắng ("978")
{
  number: 978,              // bàn thứ mấy trong sự nghiệp
  date: "2026-08-28",
  club: "al-nassr",         // sporting | man-utd | real-madrid | juventus | al-nassr
  competition: "Saudi Pro League",
  opponent: "Al-Taawoun",
  venue: "home",            // home | away | neutral
  minute: 61,
  bodyPart: "right-foot",   // right-foot | left-foot | header | other
  situation: "open-play",   // open-play | penalty | free-kick | counter
  assistBy: "Sadio Mané",
  goalkeeper: null,
  scoreAfter: "2-1",
  videoId: null,            // YouTube video id, xem note 03
  videoStart: null,         // giây bắt đầu trong video
  sources: ["wikipedia", "api-football"]
}
```

Vì sao dùng số thứ tự bàn thắng làm doc id: nó là khoá tự nhiên, duy nhất, và cho phép URL đẹp `/goal/978` — vừa tốt cho SEO vừa tránh ghi trùng khi cron chạy lại.

---

## D. Vấn đề khó: "978 bàn" là con số của ai?

Các nguồn **không thống nhất** về tổng số bàn của Ronaldo, vì bất đồng ở chỗ:
- Có tính trận giao hữu CLB không?
- Có tính Ronaldo thời đội trẻ Sporting không?
- Trận đấu bị huỷ/đá lại thì tính sao?

→ Phải **chọn một chuẩn và ghi rõ trên site** (ví dụ: "theo chuẩn FIFA/RSSSF, chỉ tính trận chính thức đội một"). Đây vừa là sự trung thực, vừa là điểm khác biệt — đối thủ hiếm khi giải thích. Nên có hẳn một trang `/methodology`.
