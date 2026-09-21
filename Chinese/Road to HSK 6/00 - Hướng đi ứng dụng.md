# Road to HSK 6 — Hướng đi ứng dụng

> Trạng thái: **khung đã chạy được**, nội dung mới có HSK 1 phần đầu.
>
> Code nằm ngoài vault: `~/WebstormProjects/road-to-hsk-6`. Vault chỉ giữ phần suy nghĩ và quyết định.
>
> Liên quan: [[01 - Yêu cầu tính năng]] · [[02 - Dẫn dắt từng bài - HSK 1]] · [[Sách - mua gì]] · [[Cấu trúc bộ sách - data model cho app]] · [[Roadmap]]

---

## Quan hệ với Road to TOEIC 900

Dự án em của [[00 - Hướng đi ứng dụng|road-to-toeic-900]]. **Y hệt về stack, cấu trúc thư mục và cách deploy** — chỉ khác lớp nội dung.

Hạ tầng bê nguyên: `styles/` (token 3 tầng), `shared/ui`, `shared/lib`, `lib/firebase.js`, `features/auth`, `features/progress`, `CLAUDE.md`, `next.config.mjs`, `jsconfig.json`, `firestore.rules`.

**Stack:** Next.js 15 App Router · React 19 · **JavaScript thuần** · **CSS thuần + design token** (không Tailwind) · Firebase tuỳ chọn · deploy Vercel không cần server.

---

## 5 chỗ phải sửa cấu trúc

Đây là toàn bộ phần khác. Mọi thứ còn lại dùng nguyên.

### 1. Phân cấp 3 tầng thay vì phẳng

TOEIC phẳng: `day-1`, `day-2`. HSK là **cấp → quyển → bài**, và tầng quyển **chỉ tồn tại từ cấp 4** (上/下).

Nếu model `level → lessons` trực tiếp thì vỡ đúng lúc tới cấp 4.

**Cách giải:** nhốt cả 3 tầng vào slug — `hsk1-l01`, `hsk4a-l01`. Route vẫn phẳng như TOEIC (`/lesson/[slug]`), không phải lồng 3 dynamic segment. Thêm một tầng `/level/[slug]` ở trên vì 136 bài không liệt kê phẳng được.

### 2. Tập hợp "phần trong bài" đổi theo cấp

Cấp 1–3 và cấp 4+ **đều đúng 7 板块, nhưng là 7 cái khác nhau**:

| | Cấp 1–3 | Cấp 4+ |
|---|---|---|
| 热身 课文 注释 练习 运用 | ✅ | ✅ |
| 拼音 · 汉字 | ✅ | ❌ |
| 扩展 | ❌ | ✅ |
| 文化 | cách 5 bài | mọi bài |

Số lượng bằng nhau → **cái bẫy là tưởng giống nhau rồi hardcode 7 field**. `features/lesson/activities.js` chọn tập hợp theo `level`.

### 3. Thanh điệu là DỮ LIỆU, không phải chuỗi hiển thị

TOEIC lưu IPA như chuỗi, không bao giờ tính toán trên nó. Tiếng Trung cần lọc/chấm/luyện **theo thanh** → phải tách thanh ra một lần.

`shared/lib/pinyin.js`:
- `splitSyllables('míngzi')` → `['míng', 'zi']`
- `tonesOf('Nǐ hǎo')` → `[3, 3]` — thanh khi **viết**
- `spokenTones([3, 3])` → `[2, 3]` — thanh khi **đọc**, biến điệu thanh 3

Chỗ nhập nhằng duy nhất là **n/ng/r trước nguyên âm**. Luật: chỉ nuốt n/ng/r khi phía sau không phải nguyên âm. Có test ở `scripts/test-pinyin.mjs`, 7 case.

### 4. Không cần whisper — rủi ro lớn nhất của TOEIC biến mất

Dự án TOEIC phải chạy `whisper.cpp` để có transcript rồi soát tay, vì máy chép sai. Đó là rủi ro cao nhất của cả dự án.

HSK **không cần**: sách in sẵn toàn bộ bài khoá, và audio chính thức đánh số `01-1.mp3`, `01-2.mp3` khớp thẳng `lesson.no` + index tình huống. Ghép bằng quy tắc đặt tên, không bằng AI.

→ Kéo theo: bỏ luôn `scripts/transcribe.mjs`, `features/listening/transcript.js`, và toàn bộ vòng soát transcript.

### 5. Font chữ Hán phải khai báo riêng

Để trình duyệt tự chọn thì macOS rơi về font tiếng Nhật, một số chữ ra dạng Kanji sai nét. Khai `--font-zh: 'PingFang SC', …` trong `styles/hsk.css`. Cỡ chữ Hán cũng phải lớn hơn chữ Latinh mới thấy nét.

---

## Đã làm được tới đâu

- [x] Khung project, copy hạ tầng dùng lại được từ TOEIC
- [x] `content/levels.json` — 6 cấp đầy đủ số bài / từ vựng / số tiết / quyển
- [x] HSK 1: 15/15 bài có tiêu đề (chữ Hán + pinyin + nghĩa + số trang)
- [x] HSK 1 bài 1–5: từ vựng thật · bài 3–5: chú thích ngữ pháp
- [x] `shared/lib/pinyin.js` + test 7 case pass
- [x] Màn chủ → cấp → bài → bảng từ vựng (lọc được theo thanh điệu)
- [x] `npm run build` pass, chạy được ở `localhost:3000`
- [ ] **Tầng A — nền ngữ âm** (bảng 声母/韵母/声调 + bốn thanh). ⚠️ Đang thiếu hẳn, và đây là thứ phải có TRƯỚC mọi màn luyện — xem [[01 - Yêu cầu tính năng]] mục 2
- [ ] Các màn 课文 / 注释 / 练习 / 拼音 / 汉字 / 运用 — mới có route tổng quan, chưa có màn chi tiết
- [ ] Thẻ từ vựng + luyện thanh điệu — 💭 **hoãn lại**: chỉ mở cho thứ đã gặp trong 课文 (luật mục 4 của note 01)
- [ ] Nhập nội dung HSK 1 bài 6–15
- [ ] Deploy Vercel

---

## Cần chốt tiếp

| # | Câu hỏi | Ghi chú |
|---|---|---|
| 1 | Nhập nội dung bài 6–15 thế nào? | Gõ tay từ sách, hay bóc từ PDF như TOEIC làm với Drive? |
| 2 | Có làm màn luyện viết chữ Hán không? | Cấp 1 dạy 17 nét + 52 chữ độc thể — cần canvas, tốn công |
| 3 | Bật Firebase ngay hay để localStorage? | TOEIC bắt đầu localStorage rồi thêm sau, làm lại y vậy được |
| 4 | Audio lấy từ đâu? | Nghe online chính chủ ở nhantriviet.com, hoặc file MP3 cá nhân — **không commit vào repo** |

---

## Lưu ý bản quyền

Nội dung sách thuộc BLCU Press và Nhân Trí Việt (bản dịch). App để **học cá nhân**:

- Repo **private**
- Deploy Vercel thì bật bảo vệ truy cập
- `.gitignore` đã chặn `public/assets/**/*.pdf` và `*.mp3` — đừng commit file scan
