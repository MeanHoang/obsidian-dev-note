# Road to TOEIC 900 — Hướng đi ứng dụng

> Doc chốt **làm cái gì / không làm cái gì** trước khi code. Trạng thái: **bản nháp chờ duyệt** — chưa code app.
>
> Code nằm ngoài vault: `~/Documents/road-to-toeic-900`. Vault chỉ giữ phần suy nghĩ và quyết định.

---

## Vấn đề đang giải

Tài liệu học nằm trên Google Drive dưới dạng PDF + folder audio lồng nhau. Cụ thể DAY 1:

- `DAY 1.pdf` — 25 trang, 44 ảnh
- `Picture for Part 1.pdf` — 5 trang, 51 ảnh
- `AUDIO DAY 1/` — 43 file mp3, lồng 3 tầng folder

Dùng trực tiếp trên Drive thì:

- Muốn nghe audio bài 5 của HOMEWORK 1 → mở tab khác, lặn qua 3 tầng folder, tìm file `5.mp3`.
- Chỗ trống trong PDF là để **viết tay**. Xem trên máy thì không điền được, không lưu được.
- Không tra được. Từ vựng nằm ở trang 24–25, muốn tra `assembly line` phải cuộn thủ công.
- Không biết mình đã làm bài nào, sai bài nào.

**Mục tiêu: một web app đọc tài liệu này cho tử tế.** Không phải app dạy TOEIC, không phải lộ trình học.

---

## Cấu trúc thật của tài liệu

Đã verify bằng cách bóc PDF, không phải phỏng đoán.

`DAY 1.pdf` chia làm 6 khối:

| Khối | Trang | Nội dung |
|---|---|---|
| Grammar corner 1–6 | 1 | 3 cấu trúc chủ động + 3 bị động, mỗi cái 1 công thức + 1 ví dụ |
| Photos of people | 2–3 | 4 yếu tố (chủ thể / hành động / vị trí / trang phục), bảng giới từ, phân biệt `wear` vs `put on` |
| Practice 1 | 4–6 | Tranh 1 người. File 1.1 dictation 6 tranh, File 1.2 chọn đáp án + điền từ 3 tranh |
| Practice 2 | 7–9 | Tranh nhiều người. File 2.1 dictation 6 tranh, File 2.2 chọn + điền 4 tranh |
| Homework 1 & 2 | 10–21 | Mỗi bài 10 tranh: nghe 1 lần chọn (A)(B)(C)(D) → nghe lại điền chỗ trống |
| Translation + Phiên âm | 22–25 | 10 câu gạch S/V/O; 24 + 22 từ vựng có IPA Anh-Anh/Anh-Mỹ |

`Picture for Part 1.pdf` — flashcard hình để tự điền: Types of clothes / Positions / Locations.

Audio map **1-1** với bài tập, không cần đoán:

```
1. PRACTICE - PART 1 / PRACTICE 1 / File 1.1  →  1..6.mp3
1. PRACTICE - PART 1 / PRACTICE 1 / File 1.2  →  1..3.mp3
1. PRACTICE - PART 1 / PRACTICE 2 / File 2.1  →  Audio 1..6.mp3
1. PRACTICE - PART 1 / PRACTICE 2 / File 2.2  →  Audio 1..6.mp3
2. HOMEWORK / HOMEWORK 1  →  0 - Full.mp3 + 1..10.mp3
2. HOMEWORK / HOMEWORK 2  →  0 - Full.mp3 + 1..10.mp3
```

Đây là điểm mấu chốt: **tên folder audio khớp đúng tên section trong PDF**, nên ghép tự động được.

---

## Vấn đề lớn nhất: PDF không có đáp án

Đáp án của Part 1 **nằm trong audio**, không nằm trong PDF. PDF chỉ có chỗ trống.

Nghĩa là nếu chỉ bóc PDF, app sẽ là "chỗ trống đẹp hơn" — vẫn không tự kiểm tra được. Muốn app có giá trị thật thì phải có **transcript của audio**.

---

## Transcribe audio bằng AI ở local

**Có làm được, chạy hoàn toàn offline trên máy.** Cách chuẩn: `whisper.cpp` — bản C++ của Whisper, chạy native trên Apple Silicon, không gọi API, không tốn tiền, không cần mạng.

Máy hiện **chưa có** `whisper` / `whisper-cpp` / `ffmpeg` (đã kiểm tra). Cần cài:

```bash
brew install whisper-cpp ffmpeg
```

Một script duyệt 43 file mp3 → xuất transcript ra JSON. Với model `small.en`, audio Part 1 rất ngắn (mỗi file ~10–30 giây, tổng ~20 MB) nên chạy vài phút là xong.

### Đây là build step, không phải tính năng của app

- Transcribe **chạy 1 lần lúc import**, kết quả commit vào repo dưới dạng JSON.
- App deploy lên Vercel chỉ đọc file JSON tĩnh. Vercel **không** chạy whisper, không cần GPU, không cần server.
- Mỗi khi có DAY mới → chạy script ở local → commit → deploy.

### Có cần đóng gói thành skill không? Không bắt buộc

| Cách | Khi nào hợp lý |
|---|---|
| Script trần: `node scripts/import-day.mjs <link>` | Tự chạy lệnh. Đơn giản nhất, ít thứ phải bảo trì. **Đề xuất chọn cái này** |
| Claude Code skill: `/toeic-import <link>` | Chỉ đáng làm nếu muốn gõ tự nhiên trong Claude Code và để AI lo phần sửa transcript sai, đặt tên section, ghép audio ↔ bài tập |

**Làm script trước.** Skill chỉ là lớp vỏ gọi script đó — thêm sau lúc nào cũng được, không phải làm lại gì.

Lưu ý thẳng: Whisper **sẽ sai một số chỗ** — tên riêng, từ hiếm, giọng nhanh. Transcript nên coi là **bản nháp cần soát lại**, không phải đáp án chính thức. Vì vậy transcript lưu ở file JSON riêng, sửa tay được, không nhúng cứng vào code.

---

## Kiến trúc đề xuất

Ba lớp tách bạch, không dính nhau:

```
Drive folder (link)
      │
      │  [1] IMPORT — chạy ở local, thủ công, 1 lần mỗi DAY
      ▼
  scripts/import-day.mjs      crawl Drive → tải PDF + mp3
  scripts/transcribe.mjs      whisper.cpp → transcript JSON
      │
      ▼
  content/day-1.json          ← nguồn sự thật, người đọc được, sửa tay được
  public/assets/day-1/        ← ảnh bóc từ PDF + audio
      │
      │  [2] BUILD — Next.js đọc file tĩnh
      ▼
  [3] Web app trên Vercel     ← không server, không DB, không API key
```

**Vì sao tách:** bước import **chậm và bẩn** (crawl HTML Drive, whisper sai chính tả). Bước render phải **nhanh và sạch**. Nhốt hết phần bẩn vào 1 file JSON review được thì app không bao giờ phải quan tâm Drive nữa.

**Stack:** Next.js App Router, JavaScript thuần (không TypeScript), Tailwind. Nội dung là file tĩnh trong repo → deploy Vercel không cần biến môi trường, không cần database.

---

## App sẽ có gì

Ưu tiên theo đúng thứ tự, làm xong cái trên mới xuống cái dưới.

**Bắt buộc — thiếu thì app không hơn gì Drive:**

1. **Trang bài học** — grammar/lý thuyết render thành HTML thật (chữ chọn được, tra được), không phải ảnh chụp PDF.
2. **Bài tập có audio gắn kèm** — mỗi câu có ảnh + nút play ngay tại chỗ. Không phải mở tab Drive.
3. **Ô điền chữ được** — chỗ trống trong PDF thành `<input>`. Gõ được, tự lưu vào `localStorage` để refresh không mất bài.
4. **Hiện đáp án** — nút "Xem đáp án" lấy từ transcript. **Đây là thứ Drive không có.**

**Nên có:**

5. **Bảng từ vựng tra được** — 46 từ, có IPA UK/US, ô search, phát âm bằng `speechSynthesis` của trình duyệt (không cần file audio).
6. **Đánh dấu đã làm** — checkbox lưu local, biết mình đang ở đâu.

**Để sau, không làm vội:**

7. Flashcard từ vựng có spaced repetition.
8. Thống kê sai/đúng theo dạng câu.
9. Đồng bộ tiến độ nhiều thiết bị — cần backend, phá vỡ "không server", cân nhắc kỹ.

---

## Cần chốt trước khi code

| # | Câu hỏi | Đề xuất |
|---|---|---|
| 1 | Có cài `whisper-cpp` + `ffmpeg` để có đáp án không? | **Nên.** Không có nó thì app mất tính năng giá trị nhất |
| 2 | Script trần hay Claude Code skill? | Script trước, skill thêm sau nếu thích |
| 3 | Repo public hay private trên GitHub? | Private — tài liệu là của trung tâm |
| 4 | Tài liệu chỉ có DAY 1 hay còn DAY 2, 3...? | Cần biết để thiết kế trang index |

---

## Đã làm được tới đâu

- [x] Crawl được Drive folder public không cần API key (parse HTML)
- [x] Tải đủ 43 mp3 + 2 PDF
- [x] Bóc 95 ảnh và toàn bộ text từ PDF
- [x] `scripts/drive.mjs`, `scripts/import-day.mjs` chạy được
- [ ] Transcribe audio — **chờ duyệt**
- [ ] Chuẩn hoá `content/day-1.json`
- [ ] Web app
- [ ] Deploy Vercel

---

## Lưu ý bản quyền

Tài liệu ghi footer **"MS. THU LINH LE – TOEIC THAY LONG"** — là tài liệu có tác giả. App này để **học cá nhân**, nên:

- Repo để **private**.
- Nếu deploy Vercel thì bật bảo vệ truy cập, đừng để index công khai.
- Đừng phát tán link.
