# Công thức script TikTok news dev — tiếng Việt

## 1. Thời lượng & độ dài

Edge TTS `vi-VN-NamMinhNeural` ở `rate: "+8%"`:

```
thời lượng ≈ âm tiết / 3.3
```

| Thời lượng | Ngân sách |
|---|---|
| 45s (an toàn) | ~150 âm tiết |
| 60s (chuẩn) | ~198 âm tiết |
| 75s (tối đa) | ~248 âm tiết |

**Mặc định nhắm 55-65s: ~190-210 âm tiết.** Đếm âm tiết = đếm tiếng: "Cloud Run" tính 2, "API" tính 3 (a-pi-ai), "Anthropic" tính 3.

Đo trên 2 video thật:

| Video | Âm tiết | Thực tế | Âm tiết/giây |
|---|---|---|---|
| `claude-text-watermark` | 254 | 76.6s | 3.32 |
| `gpt-6-astra` | 197 | 59.4s | 3.32 |

⚠️ **3.3 không phải tốc độ đọc.** Tốc độ đọc thuần là ~3.9 âm tiết/giây; phần chênh là **khoảng lặng ~0.77 giây Edge TTS chèn ở phần lớn ranh giới câu**. Trên 2 video đo được, khoảng lặng chiếm **11-15%** tổng thời lượng.

Đừng tách thành 2 vế `âm tiết/3.9 + 0.77 × số câu`. Đã thử: Edge TTS **không** nghỉ ở mọi dấu chấm (video 1 nghỉ 15/20 câu, video 2 chỉ 11/20), nên đếm câu không dự đoán được. Hệ số gộp 3.3 khớp cả hai video dưới 1% sai số vì với văn phong này số câu tự tỉ lệ với số chữ.

Hệ quả vẫn đúng và vẫn cần nhớ: **cắt câu ngắn ra làm video dài thêm** — chỉ là không lượng hoá được chính xác bao nhiêu.

Sau khi render, ghi thời lượng thật vào file draft. Lệch quá 10% thì chỉnh lại hệ số 3.3 ở đây.

## 2. Cấu trúc 4 khối

### HOOK — 0-3s, tối đa 20 âm tiết
Nêu thẳng **cái người xem mất hoặc được**. Câu đầu tiên quyết định retention.

- ✅ "Code tính điểm loyalty của bạn sắp tính sai, mà không báo lỗi."
- ✅ "Shopify vừa âm thầm đổi một thứ làm hỏng đơn hàng của bạn."
- ❌ "Xin chào các bạn, hôm nay mình sẽ nói về…"
- ❌ "Có một tin mới khá thú vị trong giới lập trình."

Cấm: chào hỏi, giới thiệu kênh, "hãy cùng tìm hiểu", đặt câu hỏi tu từ rỗng.

### NGỮ CẢNH — 3-12s, 2-3 câu
Cái này là gì, cho người chưa biết. Giải thích thuật ngữ ngay khi dùng lần đầu, bằng mệnh đề ngắn chứ không mở ngoặc:
"Cloud Run, tức dịch vụ chạy container của Google, giờ…"

### THÂN — 12-48s, **đúng 3 ý**
Mỗi ý 2-3 câu, có ít nhất 1 dữ kiện thật (số, tên API, version, deadline). Không 2 ý, không 4 ý.

Nối ý bằng từ mốc để người xem bám được: "Thứ nhất… Điểm thứ hai… Và cái đáng lo nhất…"

### CHỐT — 48-60s
1 câu **"nghĩa là gì với bạn"** — hành động cụ thể: cần rà cái gì, trước ngày nào.
Rồi 1 câu CTA nhẹ, đổi cách nói mỗi video, không lặp nguyên văn:
"Mình gom tin dev mỗi ngày, theo dõi nếu thấy hữu ích."

## 3. Luật câu chữ

- **1 câu = 1 ý.** Tối đa 20 âm tiết/câu. Câu dài → tách.
- Xưng **"mình"** – gọi **"bạn"**. Không "chúng ta", không "quý vị".
- Chủ động, hiện tại. "Shopify đổi cách tính thuế" ≠ "cách tính thuế đã được thay đổi bởi Shopify".
- **Giữ nguyên thuật ngữ tiếng Anh** đã quen: API, webhook, deploy, breaking change, checkout, endpoint. Không dịch cứng thành "điểm cuối", "móc web".
- Không so sánh, không "cực kỳ", "siêu", "cách mạng" nếu bài gốc không nói vậy.

## 4. Luật riêng cho TTS (quan trọng — sai là hỏng audio)

Script là văn bản **đọc**, không phải văn bản đọc bằng mắt.

| Cấm | Thay bằng |
|---|---|
| markdown `**`, `#`, `-`, `` ` `` | bỏ hết |
| emoji | bỏ hết |
| URL, `shopify.dev/changelog/...` | "trang changelog của Shopify" |
| ngoặc đơn `( )` | tách thành câu riêng |
| `2026-10` | "bản tháng Mười năm hai nghìn không trăm hai sáu" |
| `v2` / `Functions v2` | "Functions phiên bản hai" |
| `$1.2B`, `20%` | "một tỷ hai trăm triệu đô", "hai mươi phần trăm" |
| `GraphQL API` viết tắt lạ | giữ, nhưng đọc thử — chữ viết tắt lạ thì tách "Gờ-ráp-Quy-Eo" là quá lố, cứ để nguyên |
| gạch đầu dòng liệt kê | viết thành câu có "thứ nhất / thứ hai" |

Dấu chấm câu = nhịp nghỉ và **cũng là ranh giới 1 dòng phụ đề**. Câu dài → phụ đề tràn dòng. Đây là lý do thứ hai để giữ câu ≤20 âm tiết.

## 5. terms — keyword b-roll

Pexels search bằng **cảnh quay**, không hiểu khái niệm. Đây là chỗ hay hỏng nhất.

**Luật:**
- 4-6 keyword, **tiếng Anh**, mỗi keyword 1-3 từ.
- Mỗi keyword phải trả lời được: *"quay cảnh này thì thấy gì?"*
- Ít nhất 1 keyword có **người** (mặt người giữ retention tốt hơn cảnh vật).
- Không dùng: tên riêng công ty (Shopify, Firebase), thuật ngữ (API, webhook, scalability), tính từ trừu tượng.

| Chủ đề bài | terms tốt |
|---|---|
| Shopify / ecommerce | `online shopping phone`, `warehouse packing`, `credit card payment`, `small business owner` |
| Firebase / GCP / infra | `server room`, `data center lights`, `cloud computing`, `network cables` |
| Web dev / frontend | `developer typing laptop`, `code on screen`, `web designer working`, `office night coding` |
| System design / scale | `server racks`, `city traffic aerial`, `engineer whiteboard`, `network visualization` |
| AI | `robot arm`, `ai chip closeup`, `person using laptop ai`, `futuristic interface` |
| Security / CVE | `hacker dark room`, `padlock digital`, `security camera`, `code red screen` |
| Tài chính VN | `gold bars`, `stock market screen`, `trader monitors`, `counting money` |

❌ Ví dụ sai gây "Không tải được clip nào": `["Shopify API", "tax calculation", "breaking change", "order webhook"]`
✅ Sửa: `["online shopping phone", "credit card payment", "developer typing laptop", "warehouse packing"]`

## 6. Checklist trước khi đưa user duyệt

- [ ] Hook ≤20 âm tiết, không chào hỏi
- [ ] Đúng 3 ý trong thân
- [ ] Mọi con số/tên/version đều truy được về vault hoặc bài gốc
- [ ] Không còn markdown / emoji / URL / ngoặc trong script
- [ ] Mọi câu ≤20 âm tiết
- [ ] Tổng 230-270 âm tiết
- [ ] `terms` toàn cảnh quay cụ thể, có ít nhất 1 cảnh có người
- [ ] Chốt có hành động cụ thể, không chỉ "hãy theo dõi"
