# 🔵 Sổ tay kênh — Ngẫm Code

> [!quote] 💬
> "Nếu bạn không giải thích được nó đơn giản, tức là bạn chưa hiểu đủ rõ."
> — Kênh này tồn tại để ép mình hiểu đủ rõ.

## 🎯 Nhiệm vụ trong hệ

**Trụ uy tín & doanh thu.** RPM cao nhất trong 4 kênh, hợp Search nhất, và là kênh duy nhất dẫn thẳng tới freelance / tư vấn / cơ hội nghề. Khi bí thời gian, **kênh này được ưu tiên**.

- Nhịp: **2 video/tuần** — gấp đôi các kênh khác, và là **hai loại khác nhau**:
  - **T2 — bài giảng 15–18′** (~3 tiếng): rút từ note có sẵn trong vault, có series để người xem theo
  - **T3 — bài ngắn 6–8′** (~80 phút): bug thật gặp trong tuần, giữ đúng ngách "người đang đi làm"
  - Đệm tụt dưới 3 → bỏ T3 trước, giữ T2. Chi tiết: [[3-Lịch sản xuất hàng tuần]]
- Màu: 🔵 `#2563EB` · Handle: `@ngamcode`
- Đo bằng: **cơ hội inbound** và **% traffic từ Search**

## 📥 Nguồn đề tài

Xếp theo độ tốt giảm dần:

| Nguồn | Vì sao tốt |
|---|---|
| **Bug thật vừa sửa hôm nay** | ⭐ có "chỗ tôi sai" sẵn, AI không bịa được |
| **Quyết định kiến trúc đã chọn — và đã chọn sai** | hiếm, giá trị cao, không ai viết blog về cái này |
| Con số đo được (trước/sau tối ưu) | dẫn chứng cụ thể, tiêu đề tự có căng thẳng |
| Note sẵn trong vault | `10 - Tech`, `3 - Backend`, `8- System Design`, `11 - DB` |
| Tool/tính năng mới thử | ổn, nhưng dễ trượt bộ lọc "cơ chế" |

> [!danger] ⛔ Cái bẫy lớn nhất của kênh này: tutorial nhập môn
> "Học Docker trong 10 phút", "React cho người mới" — view rất nhiều, nhưng: khán giả không có ngân sách (RPM đáy), cạnh tranh khốc liệt nhất nền tảng, và **trượt bộ lọc cơ chế** (chỉ là thông tin, tra được).
> Ngách đúng của bạn: **vấn đề của người đang đi làm**, không phải người đang đi học.

## ✍️ Biến thể khuôn script

Khuôn 5 khối ở [[4-Quy trình biến bài học thành video]], điều chỉnh:

| Khối | Riêng cho Code |
|---|---|
| Hook | **cho thấy kết quả trước** — số đo, màn hình lỗi, benchmark |
| Bối cảnh | ngắn thôi, 30 giây — dev vào thẳng vấn đề |
| Cơ chế | **screen recording là chính**, mặt chỉ xuất hiện ở hook và chốt |
| Chỗ tôi sai | giả thuyết đầu tiên của mình, vì sao nó sai |
| Chốt | một câu quy tắc rút ra, áp dụng được ở chỗ khác |

Tỷ lệ hình: ~70% màn hình code/terminal, ~30% mặt hoặc sơ đồ. **Đây là nội dung gốc thật** — không cần và không nên dùng stock footage.

## 🔍 Tiêu đề: viết đúng câu người ta gõ lúc debug

Đây là kênh Search-first, nên tiêu đề bám sát truy vấn thật:

```
❌ Bad — mô tả, không ai gõ thế
   "Tìm hiểu về database index"
   "Chia sẻ kinh nghiệm tối ưu API"

✅ Good — đúng lúc người ta đang bí + có căng thẳng
   "Vì sao Postgres bỏ qua index của bạn"
   "Query 4 giây xuống 40ms — không phải nhờ index"
   "Firebase hết 12 triệu/tháng vì một dòng listener"
```

Giữ **thuật ngữ tiếng Anh nguyên bản** trong tiêu đề (`index`, `webhook`, `race condition`) — đó là từ dev Việt thực sự gõ.

## 🎨 Thumbnail

Layout chung của hệ, nền xanh `#2563EB`. Riêng kênh này: **cho thấy con số hoặc dòng lỗi**. `4s → 40ms` đọc được ở 210px và tự nó đã là cái hook.

## 💡 Đề tài mở màn (rút từ vault)

- [ ] Vì sao Edge TTS chèn 0.78s im lặng sau mỗi dấu chấm — và cách nó phá vỡ mọi ước lượng thời lượng
- [ ] Đừng chạy speech-to-text lên text do chính mình sinh ra
- [ ] `setsar=1` — dòng ffmpeg mà thiếu nó thì concat vỡ hình
- [ ] Escape đường dẫn Windows trong ffmpeg filtergraph: vì sao đổi `cwd` thắng mọi cách escape
- [ ] Trước khi cài framework, hỏi: mình thực sự dùng phần nào của nó?
- [ ] `.env` trong vault Obsidian — vì sao `git check-ignore` là bước bắt buộc

---

## ✅ Checklist riêng

- [ ] Đề tài là vấn đề của **người đang đi làm**, không phải người đang đi học
- [ ] Có **con số đo được** hoặc **lỗi thật** trong video
- [ ] Hook cho thấy **kết quả trước**, không giải thích trước
- [ ] ≥70% thời lượng là **màn hình thật**, không stock footage
- [ ] Tiêu đề giữ **thuật ngữ tiếng Anh** người ta thực sự gõ
- [ ] Thumbnail có con số hoặc dòng lỗi đọc được ở 210px
- [ ] Upload `.srt` — caption chứa thuật ngữ kỹ thuật, ăn Search rất tốt
