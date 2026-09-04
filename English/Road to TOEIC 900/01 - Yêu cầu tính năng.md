# Road to TOEIC 900 — Yêu cầu tính năng

> Phân tích 4 tính năng yêu cầu. Trạng thái: **chờ duyệt mockup UI** rồi mới code.
> Xem trước: [[00 - Hướng đi ứng dụng]]

---

## ⚡ Phát hiện quan trọng: Drive CÓ sẵn đáp án

File `IMG_0292.PNG` nằm trong `AUDIO DAY 1 / 2. HOMEWORK` — lúc import đầu tiên bị **bỏ qua** vì tưởng ảnh rác. Mở ra thì đó là **bảng đáp án**:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **HOMEWORK 1** | C | D | A | D | C | A | A | B | A | B |
| **HOMEWORK 2** | C | C | B | A | D | B | A | B | C | D |

**Hệ quả — rủi ro lớn nhất của tính năng 3 bị xoá bỏ.** Trước đó phải để AI nhìn ảnh đoán đáp án rồi soát tay 20 câu. Giờ 20 câu homework có đáp án **chính thức từ tài liệu gốc**, không cần đoán, không cần soát.

Còn thiếu đáp án của: Practice 1.2 (3 câu) và Practice 2.2 (4 câu) — phần làm trên lớp. 7 câu này vẫn cần AI nhìn ảnh + soát tay, nhưng 7 dễ hơn 27 rất nhiều.

**Bài học cho importer:** đừng bỏ qua file ảnh lẻ trong folder audio. Sửa `import-day.mjs` để giữ lại mọi ảnh và cho agent xem nội dung, thay vì lọc theo đuôi file.

---

## Bài tập ngữ pháp — có sẵn, nằm trong PDF

Không có file bài tập ngữ pháp riêng trong Drive (đã crawl hết 11 folder, 46 file). Nhưng bài tập ngữ pháp **nằm trong `DAY 1.pdf`** và bản mockup đầu tiên bỏ sót:

**1. TRANSLATION (trang 22) — 10 câu, đây chính là bài tập ngữ pháp.**

Yêu cầu: *"Gạch câu thành từng phần S/V/O, rồi dịch các câu sang tiếng Việt."*

Ví dụ: `The whole company is planning to go on vacation next Friday`

Đây là bài luyện **nhận diện thành phần câu** — nền tảng để làm Part 5/6 sau này, và để hiểu 6 grammar corner ở đầu buổi. Hai bước rõ rệt: gạch S/V/O trước, dịch sau.

**2. `Picture for Part 1.pdf` — 3 bài tập từ vựng qua hình, 51 ảnh.**

- Trang 1: *Types of clothes* — 20 ảnh, tự điền tên
- Trang 2–3: *Positions / Locations* — điền giới từ và địa điểm
- Trang 4: tổng hợp

Bài này khớp thẳng với **bảng giới từ** trong phần lý thuyết. Nó biến bảng chữ chi chít thành bài tập nhìn hình chọn giới từ — đúng chỗ app hơn hẳn PDF.

→ Cả 2 bài này thêm thành **màn riêng** trong app.

---

## Trước hết: 2 lỗ hổng dữ liệu phải xử lý

Cả 4 tính năng đều đụng phải 2 chỗ này. Không giải quyết thì không tính năng nào chạy được đủ.

### Lỗ hổng 1 — Bảng từ vựng KHÔNG có nghĩa tiếng Việt

Trang 24–25 của `DAY 1.pdf` có bảng 46 từ, nhưng cột **"Nghĩa" bỏ trống** — thiết kế để học viên tự điền trên lớp.

Cái đang có:

| STT | Từ | IPA Anh-Anh | IPA Anh-Mỹ | Nghĩa |
|---|---|---|---|---|
| 1 | type | /taɪp/ | /taɪp/ | *(trống)* |
| 2 | keyboard | /ˈkiːbɔːd/ | /ˈkiːbɔːrd/ | *(trống)* |

Nghĩa là app **không có sẵn** nghĩa tiếng Việt. Mà tính năng 1 (thẻ từ vựng) và tính năng 2 (game chọn đáp án) đều cần nghĩa.

**Cách giải quyết:** để AI gen nghĩa tiếng Việt một lần lúc import, ghi vào `content/day-1.json`, rồi **soát lại bằng mắt**. 46 từ soát mất 5 phút. Sau đó nó là dữ liệu tĩnh, không gen lại nữa.

### Lỗ hổng 2 — 46 từ vựng KHÔNG có ảnh

Bạn muốn "thẻ hình ảnh". Nhưng ảnh trong PDF là **ảnh đề bài Part 1** (người đang đánh máy, người đang photocopy...), không phải ảnh minh hoạ cho từ.

Ảnh có sẵn thật sự dùng được:

- `Picture for Part 1.pdf` trang 1 → **20 ảnh quần áo**, khớp thẳng với nhóm từ *clothes*
- trang 2–4 → ảnh **positions / locations**, khớp với nhóm giới từ chỉ vị trí

Nhưng các từ như `assembly line`, `microscope`, `refreshments` thì không có ảnh nào.

**Chốt: phương án B — thẻ lai.** Từ nào có ảnh thì mặt sau hiện ảnh, từ nào không có thì mặt sau chỉ có nghĩa. Vì ảnh nằm ở mặt sau nên mặt trước mọi thẻ đều giống nhau, không có chuyện lệch giao diện.

### Agent chuẩn bị ảnh được tới đâu

Có, nhưng phải tách rõ **2 việc khác nhau**:

**Việc 1 — Gán nhãn 95 ảnh đang có. Agent làm được, làm tốt.**

95 ảnh đã bóc ra từ 2 file PDF. Agent nhìn từng ảnh rồi map vào từ tương ứng:

- `Picture for Part 1.pdf` trang 1 → 20 ảnh quần áo → map vào nhóm *clothes*
- trang 2–4 → ảnh positions / locations → map vào nhóm giới từ vị trí
- `DAY 1.pdf` → ảnh đề bài, dùng cho tính năng 3 chứ không dùng làm thẻ

Ưu điểm: ảnh **đã nằm sẵn trong tài liệu**, không phải đi xin ở đâu, không phát sinh vấn đề bản quyền mới. Chạy 1 lần lúc import, ghi vào `content/day-1.json`, soát lại bằng mắt.

**Việc 2 — Kiếm ảnh mới cho từ chưa có. Đây mới là chỗ vướng.**

Agent **không tự vẽ được ảnh** (không có công cụ sinh ảnh trong luồng này). Chỉ còn cách tải từ Internet, mà tải ảnh về commit vào repo thì:

- Vướng bản quyền ảnh — đúng cái đang cố tránh
- Chất lượng lung tung, nền không đồng nhất, thẻ trông xấu

Mà thật ra **phần lớn từ còn thiếu cũng không cần ảnh**: `relax`, `adjust`, `sort out`, `direction`, `kind` — đây là động từ và danh từ trừu tượng, vẽ ra cũng không rõ nghĩa hơn chữ. Ảnh chỉ thật sự có ích với danh từ cụ thể (`microscope`, `glove`, `guitar`).

**Đề xuất:** agent gán nhãn hết ảnh có sẵn trước. Xong rồi nhìn danh sách từ còn thiếu ảnh, nếu thấy ít và toàn từ cụ thể thì lúc đó tính tiếp — đừng quyết trước khi biết còn thiếu bao nhiêu.

---

## Tính năng 1 — Thẻ từ vựng (flashcard)

**Bạn muốn:** thẻ có hình + cách phát âm, bấm vào là phát âm luôn, kéo thẻ để đánh dấu *đã biết* / *chưa học*. Lần sau mở lại chỉ hiện từ **chưa học**.

### Phân tích

**Phát âm — không cần file audio.** Dùng `speechSynthesis` có sẵn trong trình duyệt. Ưu điểm: 0 byte tải về, phát ngay tức thì (đúng ý "click là phát luôn"), chọn được giọng UK hay US khớp với 2 cột IPA trong tài liệu. Nhược: giọng máy, không hay bằng người thật — nhưng để nhớ từ thì đủ.

**Kéo thẻ.** Kéo phải = đã biết, kéo trái = chưa học. Trên máy tính phải có thêm **2 nút bấm** và **phím tắt ←/→**, vì kéo bằng chuột rất khó chịu. Trên điện thoại thì kéo là chính.

**"Refresh là chỉ còn từ chưa học".** Đây là điểm cần cẩn thận. Nếu *đã biết* = xoá vĩnh viễn khỏi bộ thẻ thì học một lần là mất từ đó mãi mãi — **sai bản chất học từ vựng**, vì trí nhớ có phai.

→ Đề xuất: *đã biết* nghĩa là **ẩn khỏi phiên học hiện tại**, không phải xoá. Có nút **"Học lại tất cả"** để reset. Và tính năng 2 sẽ tự đẩy từ nào làm sai quay lại nhóm *chưa học* — đúng như bạn mô tả ở mục 2.

**Lưu ở đâu.** `localStorage`, key theo từng DAY. Không cần backend, không cần đăng nhập. Nhược: đổi máy là mất tiến độ — chấp nhận được ở giai đoạn này.

### Ảnh phải nằm ở MẶT SAU

Sửa sau khi duyệt mockup lần 1. Ban đầu đặt ảnh ở mặt trước — **sai**.

Ảnh chính là nghĩa của từ được vẽ ra. Để ảnh ở mặt trước thì nhìn cái mũ là biết ngay `cap`, không cần nhớ gì cả. Thành ra không phải học từ vựng mà là đoán hình — thẻ mất tác dụng.

Đúng phải là:

| | Nội dung |
|---|---|
| **Mặt trước** | Từ tiếng Anh + IPA UK/US + 2 nút loa 🔊. **Không có ảnh.** Buộc phải tự nhớ nghĩa |
| **Mặt sau** | Ảnh (nếu có) + nghĩa tiếng Việt + loại từ + câu ví dụ |

Hệ quả tốt: mặt trước của **mọi thẻ đều giống nhau**, dù từ đó có ảnh hay không. Nên không còn chuyện "giao diện không đồng đều" như lo ở lỗ hổng 2 — phương án B hết nhược điểm.

### Chốt phạm vi

- Mặt trước: từ tiếng Anh, IPA UK + US, 2 nút loa 🔊 UK / US — **không ảnh**
- Mặt sau: ảnh (nếu có), nghĩa tiếng Việt, loại từ (n/v/adj), câu ví dụ
- Bấm thẻ = lật. Kéo hoặc bấm nút = đánh dấu
- Thanh tiến độ: `đã biết / tổng`
- Nút "Học lại tất cả"

---

## Tính năng 2 — Game từ vựng trắc nghiệm

**Bạn muốn:** chọn đáp án đúng cho từ, Anh→Việt hoặc Việt→Anh, 4 lựa chọn bên dưới. Bộ câu hỏi để AI gen. Chọn sai thì từ đó bị đẩy lại vào nhóm *chưa biết* ở bảng từ vựng.

### Phân tích

**Bộ câu hỏi có thật sự cần AI gen không? Phần lớn là không.**

Câu hỏi trắc nghiệm sinh **tự động từ chính bảng 46 từ**:

- Câu hỏi: từ `keyboard`
- Đáp án đúng: nghĩa của nó
- 3 đáp án nhiễu: bốc ngẫu nhiên nghĩa của 3 từ khác trong cùng bộ

Cách này **tốt hơn** để AI gen, vì: luôn đúng, không bao giờ bịa, đảo thứ tự mỗi lần chơi nên không học vẹt vị trí đáp án, và không tốn gì cả.

**AI chỉ cần cho đúng 1 việc: gen nghĩa tiếng Việt** (lỗ hổng 1). Có nghĩa rồi thì game tự sinh câu hỏi vô hạn.

Chỗ AI *có thể* thêm giá trị về sau: câu hỏi dạng điền từ vào câu ví dụ (`She is ___ on a jacket`). Cái này **để sau**, không làm ở bản đầu.

**Liên kết ngược với tính năng 1 — đây là ý hay nhất trong yêu cầu của bạn.** Sai từ nào → từ đó tự động quay lại nhóm *chưa học* của flashcard. Nghĩa là 2 tính năng dùng **chung một trạng thái**, không phải 2 thứ rời rạc. Về mặt kỹ thuật: cả 2 đọc/ghi cùng một object trong `localStorage`.

### Chốt phạm vi

- 2 chế độ: Anh→Việt và Việt→Anh
- 4 đáp án, xáo trộn mỗi lần
- Sai → hiện đáp án đúng + đẩy từ về nhóm *chưa học*
- Đúng → hiệu ứng ngắn rồi qua câu tiếp
- Hết lượt: bảng tổng kết đúng/sai + nút "Ôn lại các từ sai"

---

## Tính năng 3 — Nghe audio có phụ đề

**Bạn muốn:** nghe audio, bật được **English sub** để follow, hoặc tắt đi nghe chay. Chọn đáp án, sai thì có 2 lựa chọn: (1) nghe lại, (2) xem **Vietsub**. Phải làm đúng mới qua bài tiếp.

### Phân tích

Đây là **tính năng khó nhất và giá trị nhất**. Nó phụ thuộc dữ liệu mà tài liệu gốc không có:

| Cần gì | Lấy từ đâu | Rủi ro |
|---|---|---|
| Transcript tiếng Anh | `whisper.cpp` chạy local | Sai từ hiếm, giọng nhanh → **phải soát tay** |
| Đáp án đúng (A/B/C/D) | Suy ra từ transcript + đối chiếu tranh | **Whisper không nói cho biết đáp án nào đúng** |
| Vietsub | AI dịch từ transcript | Dịch máy, cần soát |

**Vấn đề nghiêm trọng nhất: không biết đáp án đúng là gì.**

Audio Part 1 đọc cả 4 phương án (A)(B)(C)(D). Whisper chép lại được cả 4, nhưng **không biết phương án nào mô tả đúng bức tranh** — chuyện đó nằm ở bức ảnh, không nằm trong âm thanh.

3 cách xử lý:

| Cách | Cách làm | Đánh giá |
|---|---|---|
| **A. AI nhìn ảnh** — đưa ảnh đề bài + 4 transcript cho AI, hỏi phương án nào đúng | Tự động hoàn toàn | AI có thể sai, **phải soát lại** |
| **B. Bạn tự điền đáp án** cho 20 câu homework | Chắc chắn đúng | Mất công, mà bạn chưa học nên cũng chưa biết đáp án |
| **C. Không chấm điểm** — chỉ cho nghe + hiện transcript, tự đối chiếu | Không sai được | **Mất hẳn tính năng "đúng mới qua bài"** bạn yêu cầu |

→ **Đề xuất A, kèm soát tay.** Ảnh Part 1 rất rõ ràng (người đang đánh máy / đang photocopy), AI nhìn ảnh chọn đáp án cho Part 1 độ chính xác cao. Soát 20 câu mất khoảng 10 phút, làm 1 lần.

**Cơ chế "đúng mới qua bài".** Đúng ý, nhưng cần một lối thoát: sau **3 lần sai** thì mở nút "Bỏ qua câu này" — nếu không sẽ có lúc bị kẹt cứng ở một câu và bỏ luôn cả app.

**Thứ tự hiển thị đúng theo yêu cầu:** nghe chay trước → chọn đáp án → sai thì mới mở 2 nút *Nghe lại* / *Xem Vietsub*. English sub mặc định **tắt**, có toggle bật.

### Chốt phạm vi

- Player: play/pause, tua, chỉnh tốc độ (0.75× / 1× — nghe TOEIC chậm lại rất có ích)
- Toggle **English sub** — mặc định tắt
- Chọn A/B/C/D → chấm ngay
- Sai → 2 nút: *Nghe lại* / *Xem Vietsub*. Sai 3 lần → thêm nút *Bỏ qua*
- Đúng → mở khoá bài tiếp theo
- Cả 4 transcript hiện ra sau khi trả lời đúng, có đánh dấu phương án đúng

---

## Tính năng 4 — Lý thuyết

**Bạn muốn:** một phần riêng cho lý thuyết, UI dễ học, có ví dụ và bài tập.

### Phân tích

Phần này **có sẵn dữ liệu đầy đủ**, không thiếu gì — dễ làm nhất trong 4 tính năng.

Nội dung lý thuyết của DAY 1:

1. **Grammar corner 1–6** — 6 cấu trúc, mỗi cái có công thức + 1 ví dụ.
   → Render thành **card công thức**: công thức nổi bật ở giữa, ví dụ bên dưới, có nút 🔊 đọc ví dụ.
   → 3 chủ động / 3 bị động → chia 2 nhóm màu khác nhau cho dễ phân biệt.

2. **4 yếu tố tả tranh người** — chủ thể / hành động / vị trí / trang phục.
   → 4 khối, mỗi khối một màu, dùng lại xuyên suốt app (ví dụ trong bài tập tô màu từ theo yếu tố).

3. **Bảng giới từ chỉ vị trí** — cái này trong PDF là bảng 3 cột chữ chi chít, khó nhớ.
   → Đây là chỗ app **hơn hẳn PDF**: các cặp đối lập (`in front of` ↔ `behind`, `above` ↔ `under`) hiển thị thành **cặp đối xứng**, ghép được với ảnh vị trí từ `Picture for Part 1.pdf`.

4. **`wear` vs `put on`** — PDF đã có 2 ảnh so sánh sẵn.
   → Khối so sánh 2 cột, ảnh trái ảnh phải. Kèm câu chốt của tài liệu: *"Phải có hành động put on xong mới có trạng thái wear."*

5. **Translation** — 10 câu gạch S/V/O rồi dịch.
   → Bài tập: bấm vào từ để gán nhãn S / V / O, xong thì so với đáp án. Có ô nhập bản dịch, đối chiếu bản dịch mẫu.

### Chốt phạm vi

- Trang lý thuyết cuộn dọc, có mục lục dính bên trái
- Card công thức có nút phát âm ví dụ
- Bảng giới từ dạng cặp đối lập
- Khối so sánh `wear` vs `put on`
- Bài tập gạch S/V/O cuối trang

---

## Bản đồ phụ thuộc

Cái nào chặn cái nào:

```
whisper.cpp transcribe  ──────►  TÍNH NĂNG 3 (nghe + sub)
AI chọn đáp án từ ảnh   ──────►  TÍNH NĂNG 3 (chấm điểm)
AI dịch transcript      ──────►  TÍNH NĂNG 3 (vietsub)

AI gen nghĩa tiếng Việt ──┬───►  TÍNH NĂNG 1 (mặt sau thẻ)
                          └───►  TÍNH NĂNG 2 (đáp án + nhiễu)

(không cần gì thêm)     ──────►  TÍNH NĂNG 4 (lý thuyết)
```

**Thứ tự làm đề xuất:** 4 → 1 → 2 → 3.
Lý do: tính năng 4 không chặn bởi gì cả, làm xong là có ngay thứ để dùng. Tính năng 3 phụ thuộc nhiều nhất và rủi ro cao nhất (transcript sai, đáp án sai) nên để cuối, lúc đó khung app đã chắc.

---

## Trạng thái chung

Mọi tính năng dùng **chung một object trạng thái** trong `localStorage`, không tách rời:

```
{
  "day-1": {
    "vocab": { "keyboard": "known", "assembly line": "unknown", ... },
    "answers": { "hw1-5": { "picked": "B", "correct": true, "tries": 2 }, ... },
    "unlocked": ["hw1-1", "hw1-2", ...]
  }
}
```

Nhờ vậy: game sai → flashcard biết ngay. Đúng ý bạn nói ở mục 2.

---

## Việc tiếp theo

- [ ] Duyệt **mockup UI** (bản HTML tĩnh, chưa có logic thật)
- [ ] Chốt lựa chọn A/B/C ở lỗ hổng 2 (ảnh cho thẻ từ vựng)
- [ ] Chốt cách xử lý đáp án ở tính năng 3
- [ ] `brew install whisper-cpp ffmpeg`
