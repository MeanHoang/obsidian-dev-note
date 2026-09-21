# 🧱 Cấu trúc bộ 标准教程 — data model cho app

> Mục đích: hiểu cấu trúc chuẩn của bộ sách để dựng app học tiếng Trung riêng.
> Liên quan: [[Sách - mua gì]] · [[Roadmap]] · [[_Template - Bài học]]

📖 = trích nguồn, có link · 💭 = nhận định của mình

---

## 1. Cây phân cấp

```
Bộ 标准教程 (6 cấp · 18 quyển)
└── Cấp (level 1-6)
    └── Quyển (volume — 1 quyển, hoặc 上/下)
        ├── Giáo trình (textbook)
        │   └── Bài (lesson)
        │       └── Phần (section × 7)
        └── Sách bài tập (workbook)
            └── Bài luyện (khớp 1-1 với bài giáo trình)
```

💭 Điểm mấu chốt cho data model: **`Cấp` không map 1-1 với `Quyển`**. Từ cấp 4 trở lên 1 cấp = 2 quyển. Nếu model `level → lessons` trực tiếp là sai ngay khi tới cấp 4.

---

## 2. Bảng cấp / quyển

| Cấp | Giáo trình | Sách bài tập | Tổng cuốn |
|---|---|---|---|
| 1 | 教程1 | 1 | **2** |
| 2 | 教程2 | 1 | **2** |
| 3 | 教程3 | 1 | **2** |
| 4 | 教程4 **上 + 下** | 2 | **4** |
| 5 | 教程5 **上 + 下** | 2 | **4** |
| 6 | 教程6 **上 + 下** | 2 | **4** |
| | **9 giáo trình** | **9 sách bài tập** | **18** |

📖 Khớp với [danh sách 18 sản phẩm của Nhân Trí Việt](https://www.nhantriviet.com/GiaoTrinhChuanHSK) và bảng 总计 9册 trong phần giới thiệu của chính sách ([phân tích của ĐH Lan Châu](https://chinese.lzu.edu.cn/chinese/upload/files/20201117/dc404f71120a4a87b438ec82f194e5a3.pdf)).

---

## 3. Số liệu từng cấp

| Cấp | Số bài | Từ vựng (lũy kế) | Số tiết | Nguồn số bài |
|---|---|---|---|---|
| 1 | **15** | 150 | 30–34 | 📖 mục lục sách |
| 2 | **10** | 300 | 30–36 | 📖 web |
| 3 | **20** | 600 | 35–40 | 📖 web |
| 4 | **20** (上 10 + 下 10) | 1.200 | 75–80 | 📖 [Học Bá](https://hoc-ba.edu.vn/cam-nang-hsk-hskk/hsk4-co-bao-nhieu-bai) |
| 5 | **36** (上 18 + 下 18) | 2.500 | 170–180 | 📖 [BLCUP](https://www.blcup.com/PInfo/index/8212) |
| 6 | 上 **20** · 下 ⚠️ chưa rõ | 5.000+ | 170–180 | 📖 web (下 chưa xác minh) |
| | | | **510–550** | |

⚠️ 💭 Số bài của **教程6下 chưa verify** — để `null` trong data, đừng đoán.
⚠️ 💭 Số tiết là **giờ lên lớp có giáo viên**, không phải tổng thời gian tự học. Mốc tự học xem [[Roadmap]] mục 1.

---

## 4. Cấu trúc một bài — và nó KHÔNG cố định theo cấp

### Cấp 1–3: **7 phần**

📖 热身 (khởi động) → 课文 (bài khoá + 生词) → 注释 (chú thích ngữ pháp) → 练习 (luyện tập) → 拼音 (phiên âm) → 汉字 (chữ Hán) → 运用 (vận dụng)

📖 Thêm mục **文化 (văn hoá) cứ 5 bài một lần** — cấp 1 ở bài 5, 10, 15.

### Cấp 4: cũng **7 板块**, nhưng là 7 cái KHÁC

📖 Nguyên văn: *"每课分为七大板块：热身、课文（含生词）、注释（含"比一比"）、练习、扩展（同字词）、运用（交际练习）、以及文化。"*

### So sánh trực tiếp

| Phần | Cấp 1–3 | Cấp 4 |
|---|---|---|
| 热身 Khởi động | ✅ | ✅ |
| 课文 Bài khoá + 生词 | ✅ | ✅ |
| 注释 Chú thích | ✅ | ✅ (+ mục 比一比 so sánh) |
| 练习 Luyện tập | ✅ | ✅ |
| 运用 Vận dụng | ✅ | ✅ |
| **拼音** Phiên âm | ✅ | ❌ **bỏ** |
| **汉字** Chữ Hán | ✅ | ❌ **bỏ** |
| **扩展** Mở rộng (同字词) | ❌ | ✅ **thêm** |
| **文化** Văn hoá | cách **5 bài** 1 lần | ✅ **mọi bài** |

💭 Tóm lại: **5 phần lõi giữ nguyên xuyên suốt**; 2 phần vỡ lòng (拼音 + 汉字) bị thay bằng 2 phần nâng cao (扩展 + 文化 thường trực).

👉 **Hệ quả cho schema:** `sections` phải là **mảng động**. Số lượng tình cờ bằng nhau (7 vs 7) nên đừng để bị đánh lừa mà hardcode — **tập hợp phần khác nhau**, và `文化` đổi từ "có điều kiện" thành "luôn có".

### Số liệu mỗi bài cấp 4

📖 *"每课生词平均30~35个，语言点注释5个，每课建议授课时间为4~6学时"* — trung bình **30–35 từ mới/bài**, **5 điểm ngữ pháp/bài**, **4–6 tiết/bài**.

⚠️ 💭 **Sửa so với bản trước của note này:** tôi từng ghi "~15 từ/bài" cho cấp 4 theo [Học Bá](https://hoc-ba.edu.vn/cam-nang-hsk-hskk/hsk4-co-bao-nhieu-bai) — sai. Kiểm tra chéo: 20 bài × 30–35 từ = **600–700 từ mới**, đúng bằng mức nhảy 600 → 1.200 của cấp 3 lên cấp 4. Con số 15 không khớp phép tính này.

---

## 5. Số liệu mỗi bài

| | Cấp 1 | Cấp 4 |
|---|---|---|
| Tình huống hội thoại | 📖 **3** (mỗi cái 1–2 lượt) | 📖 1 bài khoá |
| Từ mới / bài | 📖 **10–15** | 📖 **30–35** |
| Điểm ngữ pháp / bài | 📖 **3–4** | 📖 **5** |
| Số tiết / bài | 📖 2–3 | 📖 4–6 |

### Phạm vi chữ Hán cấp 1
📖 **17 nét cơ bản · 6 quy tắc bút thuận · 7 kết cấu chữ · 52 chữ độc thể · 18 bộ thủ**
📖 Bài 1–6 dạy nét; từ bài 7 mỗi bài **2 bộ thủ + 2 chữ ví dụ**.
📖 Chỉ yêu cầu **viết được** 17 nét và 52 chữ độc thể; còn lại chỉ **nhận mặt chữ**.

---

## 6. 💭 Data model gợi ý (JS + Firestore)

```js
// levels/{levelId}            vd: "hsk1"
{
  level: 1,
  vocabCumulative: 150,        // lũy kế, không phải số từ mới
  classHours: [30, 34],        // khoảng
  volumeCount: 1,              // 1 với cấp 1-3, 2 với cấp 4-6
  lessonCount: 15,
}

// levels/{levelId}/volumes/{volumeId}   vd: "hsk4-shang"
{
  label: '上',                  // null nếu cấp chỉ có 1 quyển
  order: 1,
  lessonCount: 10,
  hasWorkbook: true,
}

// levels/{levelId}/lessons/{lessonId}   vd: "l01"
{
  no: 1,
  volumeId: 'hsk1',
  titleZh: '你好',
  titlePinyin: 'Nǐ hǎo',
  titleVi: 'Chào anh!',
  page: 14,
  // mảng động — cấp 1-3 và cấp 4+ khác nhau
  sections: ['warmup', 'text', 'notes', 'exercises', 'pinyin', 'hanzi', 'apply'],
  hasCulture: false,           // cấp 1: chỉ bài 5,10,15 · cấp 4+: mọi bài
}

// levels/{levelId}/lessons/{lessonId}/vocab/{wordId}
{
  hanzi: '你',
  pinyin: 'nǐ',
  tones: [3],                  // tách riêng để query/luyện thanh điệu
  pos: 'đại từ',
  meaningVi: 'bạn, anh, chị',
  isOverSyllabus: false,       // sách đánh dấu * cho từ vượt đại cương
}

// levels/{levelId}/lessons/{lessonId}/grammar/{pointId}
{
  no: 1,
  titleZh: '疑问代词"什么"',
  titleVi: 'Đại từ nghi vấn 什么',
  pattern: 'S + 叫 + 什么 + N?',
  examples: [{ zh: '', pinyin: '', vi: '' }],
}
```

### 💭 Quyết định thiết kế đáng lưu ý

1. **`sections` là mảng, không phải field cứng** — vì cấu trúc đổi ở cấp 4 (mục 4).
2. **`tones` tách khỏi `pinyin`** — muốn làm bài luyện thanh điệu (kiểu "nghe và chọn thanh") thì phải query được theo thanh, không parse chuỗi mỗi lần.
3. **`vocabCumulative` ghi rõ là lũy kế** — 150/300/600 là tổng tích luỹ, không phải số từ mới của cấp đó. Dễ sai chỗ này khi tính progress bar.
4. **`isOverSyllabus`** — sách đánh dấu `*` cho từ vượt đại cương HSK (cấp 1 có 10 từ như vậy). Nên giữ cờ này để lọc khi ôn thi.
5. **Audio khớp theo bài** — file MP3 của bộ đánh số dạng `01-1.mp3`, `01-2.mp3` → map thẳng `lesson.no` + index tình huống, không cần bảng ánh xạ riêng.

💭 Về hosting: Firestore hợp với phần metadata/từ vựng/ngữ pháp (đọc nhiều, ghi ít). File MP3 để **Cloud Storage**, không nhét vào Firestore.

---

## 7. ⚠️ Nếu app không chỉ dùng cá nhân

💭 Nội dung sách (bài khoá, bài tập, audio) thuộc bản quyền BLCUP + Nhân Trí Việt — trang bản quyền in ngay đầu sách ghi rõ không được sao chép hay đưa vào hệ thống truy cập. Làm app **cho riêng mình học** thì không vấn đề; nhưng nếu tính公开 hay chia sẻ thì phần nội dung phải tự soạn hoặc dùng nguồn mở (vd [Chinese Grammar Wiki](https://resources.allsetlearning.com/chinese/grammar/Main_Page), danh sách từ HSK là dữ liệu đại cương công khai), giữ lại **cấu trúc** chứ không bê nội dung.

---

## Nguồn

- [Danh sách 18 quyển — Nhân Trí Việt](https://www.nhantriviet.com/GiaoTrinhChuanHSK)
- [《HSK标准教程1》分析 — ĐH Lan Châu (PDF)](https://chinese.lzu.edu.cn/chinese/upload/files/20201117/dc404f71120a4a87b438ec82f194e5a3.pdf) — cấu trúc 7 phần, bảng số tiết
- [Giáo trình HSK 1 tiêu chuẩn — Mochi Demy](https://mochidemy.com/blog/giao-trinh-hsk-1-tieu-chuan-pdf-kem-file-mp3-luyen-nghe-tieng-trung/) — mô tả từng phần bằng tiếng Việt
- [HSK 4 có bao nhiêu bài — Học Bá](https://hoc-ba.edu.vn/cam-nang-hsk-hskk/hsk4-co-bao-nhieu-bai) — 20 bài, cấu trúc bài cấp 4
- [HSK标准教程5下 — BLCUP](https://www.blcup.com/PInfo/index/8212) — số bài cấp 5
- [Mục lục HSK 1 — tiengtrungtruonggiang.com](https://tiengtrungtruonggiang.com/tien-ich/giao-trinh-chuan-hsk-1) — tên 15 bài
