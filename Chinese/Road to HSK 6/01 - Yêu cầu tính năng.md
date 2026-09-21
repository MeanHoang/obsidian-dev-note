# Road to HSK 6 — Đường học & tính năng

> **Viết lại toàn bộ.** Bản trước xếp theo *tính năng kỹ thuật* (F1 Tone Trainer, F5 thẻ từ vựng) — đó là cách người làm app nghĩ, không phải cách người học từ số 0 đi.
> Bản này xếp theo **thứ tự học**, lấy thẳng từ mục 本册说明 (Hướng dẫn sử dụng sách) trang 6–7 và 目录 trang 8–13 của 《HSK标准教程1》.
>
> Xem trước: [[00 - Hướng đi ứng dụng]] · [[Cấu trúc bộ sách - data model cho app]] · [[_Template - Bài học]]
> Nội dung học chi tiết từng bài: **[[02 - Dẫn dắt từng bài - HSK 1]]**

📖 = trích nguồn, có link/số trang · 💭 = nhận định của mình

---

## 0. Bản trước sai ở đâu

💭 Bản trước mở đầu bằng **F1 Tone Trainer** và **F5 thẻ từ vựng**, coi đó là hai thứ "chạy được ngay hôm nay vì đã đủ dữ liệu". Đủ dữ liệu — nhưng người học chưa đủ nền.

Cụ thể ba chỗ vô lý:

| Bản trước | Vô lý ở đâu |
|---|---|
| F1 "Nghe → chọn thanh `1-2`, `2-4`" là việc làm đầu tiên | Người chưa học gì thì **chưa biết thanh 1, thanh 2 là gì** để mà chọn. Ký hiệu `2-4` là vô nghĩa |
| F5 thẻ từ vựng bật lên từ đầu | 📖 Sách gắn 生词 **ngay cạnh từng 场景** trong 课文 (xem trang 14, 26) — từ được gặp **trong câu trước**, thẻ chỉ là ôn lại sau |
| F1 có dạng "biến điệu `nǐ + hǎo`" | 📖 Biến điệu thanh 3 là nội dung 拼音 **bài 1**, còn tổ hợp thanh 2 âm tiết là 拼音 **bài 6–15**. Gộp chung thành một màn là nhảy cóc 6 bài |

💭 Gốc của lỗi: **coi tính năng là màn hình độc lập**. Thực ra 拼音 và 汉字 là **hai phần nằm trong mỗi bài** và **nội dung đổi theo từng bài**, không phải một màn "luyện thanh điệu" chung chung.

---

## 1. Sách tự nói cách học — đây là nguồn chuẩn

📖 《HSK标准教程1》trang 6, mục 本册说明:

> *"《HSK标准教程1》适合未系统学习过汉语的**零起点**学习者以及准备参加HSK（一级）考试的汉语学习者使用。"*
> → Dành cho người **bắt đầu từ số 0**, chưa học tiếng Trung có hệ thống bao giờ.

📖 trang 6:

> *"全书共15课，**除第1课、第2课以语音为主外**，从第3课开始每课围绕一个主题，分3个场景，每个场景1~2个话轮安排对话，每课10~15个生词，3~4个语言点注释。"*
> → Cả sách 15 bài. **Trừ bài 1 và bài 2 lấy ngữ âm làm chính**, từ bài 3 mỗi bài xoay quanh một chủ đề, chia 3 场景, mỗi 场景 1–2 lượt hội thoại, mỗi bài 10–15 từ mới, 3–4 điểm chú thích ngữ pháp.

📖 trang 6:

> *"第1课、第2课是**语音学习的入门阶段**，系统介绍汉语的声母、韵母、声调、音节结构等语音基本知识，目的在于使学习者全面了解并掌握汉语的基本语音面貌，**为后面进一步学习打下良好的语音基础**。"*
> → Bài 1–2 là **giai đoạn nhập môn ngữ âm**, giới thiệu có hệ thống thanh mẫu, vận mẫu, thanh điệu, kết cấu âm tiết — để **đặt nền ngữ âm cho toàn bộ phần sau**.

💭 **Đây chính là câu trả lời cho "học gì trước".** Sách không bắt đầu bằng từ vựng, cũng không bắt đầu bằng bài tập. Nó bắt đầu bằng **hệ thống âm**. App bỏ hẳn tầng này — đó là lý do mở app lên thấy toàn thẻ.

📖 trang 6, về 注释:

> *"本教程**弱化语法**，语言点讲解采用注释的方式，多用表格形式展示，力求简洁、清楚、易学易懂。每个语言点的解释**只涉及本课课文中的用法**…采用注释的方式处理语言点，一方面希望减少零起点汉语初学者的学习压力和畏难情绪，另一方面也贯彻了本教材**以练代讲、多练少讲**的原则。"*
> → Sách **làm nhẹ ngữ pháp**. Mỗi điểm chỉ giải thích **đúng cách dùng trong bài này**, không mở rộng. Nguyên tắc: **lấy luyện thay giảng, luyện nhiều giảng ít**.

💭 Quan trọng cho app: **đừng dựng màn "ngữ pháp" kiểu bách khoa**. Điểm ngữ pháp là chú thích gắn vào câu trong bài, không phải bài giảng riêng.

📖 trang 6, về 课文:

> *"本教材以大纲中的词语为重点，将词语与HSK（一级）考试真题句编入课文对话中，并**在不同情景下进行复现**。"*
> → Từ được **lặp lại ở các tình huống khác nhau**.

💭 Sách đã tự làm spaced repetition trong nội dung rồi. SRS của app là **lớp bù thêm**, không phải cơ chế học chính.

---

## 2. Bốn chặng — trả lời "học gì, đọc gì, rồi đến gì"

📖 Rút từ 目录 trang 8–13, cột 拼音 và 汉字 của từng bài.

### Chặng 0 — Ngữ âm (bài 1–2) · **chưa học chữ nào**

📖 Nội dung 拼音 hai bài này:

| Bài | 拼音 |
|---|---|
| 1 | 声母和韵母(1): `b p m f d t n l g k h j q x` · `i u ü er a ia ua o uo e ie üe ai uai ei uei(ui) ao iao` · **声调(四声)** · **音节结构** · 两个三声音节的连读变调 |
| 2 | 声母和韵母(2): `zh ch sh r z c s` · `ou iou(iu) an ian uan üan en in uen(un) ün ang iang uang eng ing ueng ong iong` · **轻声** · 拼音规则(1): 标调法和省写 |

📖 Song song, 课文 bài 1–2 dạy giao tiếp tối giản: trang 6 ghi *"课文部分还给出了打招呼、告别、致谢、道歉等常用的简短表达方式"* — chào hỏi, tạm biệt, cảm ơn, xin lỗi.
📖 Cụ thể (目录 trang 8): bài 1 có 你、好、*您、你们、对不起、没关系; bài 2 có 谢谢、不、不客气、再见.

📖 汉字 bài 1–2: nét `一 丨 丿 丶 ㇏` rồi `𠃌 ㇀ 亅`; chữ độc thể `一 二 三 十 八 六` rồi `口 见 山 小 不`.

💭 **Chặng này là thứ app đang thiếu hoàn toàn.** Nó không có thẻ, không có SRS, không có chấm điểm. Nó là **đọc + nghe + nhại**. Ra khỏi chặng 0 thì mới hiểu được ký hiệu `nǐ hǎo = 3-3`.

⚠️ Bài 1–2 **không có 热身** — mở sách trang 14 là vào thẳng 课文. Cấu trúc 7 phần chỉ áp dụng từ bài 3.

### Chặng 1 — Âm khó + nét chữ (bài 3–5)

📖 拼音 chuyển sang 发音辨析 (phân biệt âm):

| Bài | 发音辨析 | Biến điệu | 拼音规则 |
|---|---|---|---|
| 3 | `j q x` ↔ `z c s` · `i u ü` | **不** | ü với j q x |
| 4 | `zh ch sh r` · **`n` ↔ `ng`** | **一 (yī)** | cách dùng `y`, `w` |
| 5 | 儿化 · vận mẫu mở đầu `i u ü` · **bật hơi ↔ không bật hơi** | — | 隔音符号 |

📖 trang 7 dặn rõ cách học phần này: *"第3到第5课主要介绍声母、韵母重点和难点音的发音辨析，教学时**建议以语音训练为主，不必逐词讲解词义**，学习者能够掌握正确的发音即可。"*
→ Phần 拼音 bài 3–5 **luyện âm là chính, không cần hiểu nghĩa từng từ**, đọc đúng là đủ.

💭 Rất đáng chú ý: sách **cho phép đọc từ chưa biết nghĩa** ở phần này. App không được ép tra nghĩa ở đây — làm thế là chống lại sách.

📖 汉字 bài 3–5: hết 17 nét (`乛 丷 丄 乚 乁 ㇈ ㇆`), chữ độc thể `月 心 中 人 / 七 儿 几 九 / 水 女 了 大`, và **6 quy tắc bút thuận** (ngang trước sổ sau, phẩy trước mác sau · trên xuống dưới, trái sang phải · ngoài trước trong sau…).

📖 trang 7: *"一级汉字主要进行**认读**的训练，**只对17个基本笔画和52个独体字有书写要求**。"*
→ Cấp 1 chủ yếu **nhận mặt chữ**; chỉ bắt buộc **viết được** 17 nét và 52 chữ độc thể.

💭 Đây là ranh giới cho tính năng viết chữ: **canvas viết chỉ bật cho 17 nét + 52 chữ độc thể**. Mọi chữ khác chỉ cần nhận ra. Bản trước định làm quiz "hiện nghĩa → viết chữ" cho mọi từ — vượt yêu cầu của sách, và làm người học nản.

### Chặng 2 — Tổ hợp thanh điệu + bộ thủ (bài 6–15)

📖 trang 7: *"第6课到第15课主要介绍**双音节词语、三音节词语以及含有轻声音节词语的声调搭配**，其中，**双音节词语的声调搭配是教学重点**。每个双音节词语的声调模式都给出了**一个标准词并配图片**作为学习者模仿记忆的范本。"*

| Bài | 拼音 |
|---|---|
| 6 | 双音节: thanh **1** + 1/2/3/4 |
| 7 | 双音节: thanh **2** + 1/2/3/4 |
| 8 | 双音节: thanh **3** + 1/2/3/4 |
| 9 | 双音节: thanh **4** + 1/2/3/4 |
| 10 | 轻声音节的读法 · 叠音词 · hậu tố `-们 -子 -头` |
| 11 | 轻声的功能 |
| 12–15 | 三音节: mở đầu bằng thanh 1 / 2 / 3 / 4 |

📖 汉字 từ bài 7 trở đi: *"从第7课开始进行偏旁教学，每课介绍两个易学、常见、构字能力强的偏旁，并给出两个例字"* — mỗi bài **2 bộ thủ + 2 chữ ví dụ**.
📖 Kèm 7 kết cấu chữ, rải bài 6–10: 独体/合体 · 左右/左中右 · 上下/上中下 · 半包围 · 全包围.
📖 Bộ thủ cụ thể: bài 7 `氵 讠` · 8 `钅 口` · 9 `辶 门` · 10 `囗 衤` · 11 `阝 亻` · 12 `扌 忄` · 13 `日 目` · 14 `月 扌`(bài 14: `刂 扌`) · 15 `艹 宀`.

📖 Vì sao đúng 52 chữ độc thể — trang 7: *"通过对前三级的600个词进行统计，选出其中**最常用、构字能力最强**的52个独体字进入一级教学中"* → chọn lọc từ 600 từ của 3 cấp đầu, lấy chữ hay gặp nhất và **ghép ra được nhiều chữ khác nhất**.

💭 Nghĩa là 52 chữ độc thể + 18 bộ thủ là **bộ lắp ghép**. Dạy đúng thứ tự này thì lên HSK 2–3 chữ mới tự tách ra được. Đây là lý do phải bám thứ tự sách chứ không tự sắp.

### Chặng 3 — Đóng cấp

📖 Cuối sách (目录 trang 12) có 词语总表 tr.132 · 汉字总表 tr.140 · 偏旁总表 tr.141.
📖 文化 ở **bài 5, 10, 15**: cách hỏi tuổi (tr.51) · đặc điểm họ tên người TQ (tr.93) · công cụ liên lạc (tr.131).

💭 Ba bảng tổng ở cuối sách chính là **màn ôn cả cấp**, sách đã tự chia sẵn. Không cần nghĩ ra cấu trúc mới.

---

## 3. Một buổi học = 7 bước, theo đúng thứ tự sách

📖 trang 6: *"第3课到第15课每课设置**热身、课文（含生词）、注释、练习、拼音、汉字、运用**七个部分；每5课设置一个文化板块。"*

Thứ tự này **là thứ tự in trong sách**, và app phải đi đúng như vậy:

| # | Phần | 📖 Sách nói | Màn trong app |
|---|---|---|---|
| 1 | 热身 Khởi động | *"主要使用图片进行本课重点词语、短语的导入…以直观的形式帮助学习者进行新知识的学习"* — dẫn nhập bằng **hình ảnh**, có thể **học trước ở nhà** (*可以…提前预习*) | Ảnh cắt từ trang sách, nối hình ↔ từ. **Không chấm điểm** |
| 2 | 课文 Bài khoá | 3 场景, mỗi cái 1–2 lượt; 生词 in **ngay cạnh 场景** (xem tr.14, 26) | 3 công tắc chữ/pinyin/nghĩa · 🔊 `03-1.mp3` · từ mới hiện **theo 场景**, không dồn một cục |
| 3 | 注释 Chú thích | 3–4 điểm · *"只涉及本课课文中的用法"* · *"**变颜色的例句**为该语言点在课文中的原句"* | Card nhỏ. **Highlight đúng câu gốc trong 课文** như sách tô màu — bấm là nhảy về câu đó |
| 4 | 练习 Luyện tập | Đặt **sau 注释**; *"与HSK初级口语考试题型相吻合"*. Nhưng *"这个环节教师可以**灵活安排**"* — có thể dùng sau 课文, sau 注释, hoặc cuối bài để kiểm tra | Chấm bằng PDF đáp án chính chủ. 💭 Cho **chọn vị trí**, vì sách cho phép |
| 5 | 拼音 Phiên âm | Bài 3–5 phân biệt âm (không cần nghĩa) · bài 6–15 tổ hợp thanh, **có từ chuẩn + hình làm mẫu để nhại** | Nội dung **đổi theo bài** (mục 2). Đây là chỗ Tone Trainer thật sự thuộc về |
| 6 | 汉字 Chữ Hán | Bài 1–6 nét · bài 7+ 2 bộ thủ + 2 chữ ví dụ · **chỉ 17 nét + 52 chữ độc thể bắt buộc viết** | Xem thứ tự nét mọi chữ; **canvas viết chỉ bật** cho nét và chữ độc thể |
| 7 | 运用 Vận dụng | *"互动性强的**双人活动**和交际性的**小组活动**"* | ⚠️ Học một mình thì không có bạn. 💭 Thay bằng: tự ghi âm hai vai, app phát lại xen kẽ |
| ✦ | 文化 | Bài 5, 10, 15 | Trang đọc thuần, không bài tập |

💭 Bước 7 là chỗ **sách và người học một mình lệch nhau rõ nhất** — phải ghi ra chứ không lờ đi.

---

## 4. Luật vàng: không có thẻ cho thứ chưa gặp

💭 Một câu luật, và nó xoá được toàn bộ cảm giác "khó hiểu" của bản trước:

> **Mọi thẻ, mọi bài luyện, mọi mục SRS chỉ tồn tại sau khi thứ đó đã xuất hiện trong một 课文 đã đọc.**

Hệ quả cụ thể:

| Thứ | Mở khi |
|---|---|
| Thẻ từ 你 | Đã đọc xong 场景 1 bài 1 |
| Luyện 4 thanh đơn | Xong 拼音 bài 1 |
| Luyện tổ hợp 2 âm tiết | Xong 拼音 bài 6 |
| Luyện tổ hợp 3 âm tiết | Xong 拼音 bài 12 |
| Canvas viết chữ 水 | Xong 汉字 bài 5 (`水` là chữ độc thể bài 5) |
| Tách bộ thủ 氵 | Xong 汉字 bài 7 |
| Ôn cả cấp | Xong bài 15 (hoặc bật tay) |

💭 Màn chính của app **không phải danh sách tính năng** — nó là **"bài tiếp theo của bạn"** + một dòng ôn tập đến hạn. Mọi thứ khác nằm bên trong bài.

---

## 5. Tính năng — xếp lại theo 3 tầng

### Tầng A — Nền ngữ âm *(dựng trước, dùng một lần)*

**A1. Bảng ngữ âm tương tác** — 声母 · 韵母 · 声调 · 音节结构, đúng danh sách bài 1–2 ở mục 2.
- Bấm ô nào nghe ô đó
- 音节结构: tách `hǎo` = `h` + `ao` + thanh 3 — 💭 hiểu được cái này thì mới đọc được pinyin bất kỳ
- 标调法和省写 (📖 拼音规则(1), bài 2): dấu thanh đặt ở đâu, `iou→iu`, `uei→ui`, `uen→un`

**A2. Bốn thanh + thanh nhẹ**
- 📖 Sách bài 6–15 dùng *"一个标准词并配图片作为模仿记忆的范本"* — 💭 bê nguyên ý: mỗi thanh một **từ mỏ neo** có hình
- Đường cong thanh vẽ SVG (cao đều / lên / xuống-lên / xuống gắt)
- Biến điệu thanh 3 (📖 bài 1) · 不 (bài 3) · 一 (bài 4) — dùng `spokenTones()` đã có

💭 Tầng A **không chấm điểm, không SRS**. Nó là phần "đọc trước". Qua rồi vẫn mở lại được bất cứ lúc nào — người học sẽ quay lại nó liên tục trong 5 bài đầu.

### Tầng B — Đi qua một bài *(7 bước mục 3)*

**B1 热身** · **B2 课文** · **B3 注释** · **B4 练习** · **B5 拼音** · **B6 汉字** · **B7 运用**

💭 Ba chỗ dễ làm sai nhất:
- **B2**: 生词 gắn theo 场景, không phải bảng cuối bài. Đây là nơi từ **được gặp lần đầu** — quyết định toàn bộ luật ở mục 4.
- **B3**: highlight câu gốc trong 课文 như sách tô màu. 💭 Đây là chi tiết nhỏ mà làm đúng thì ngữ pháp tự nhiên dễ hiểu, vì nó luôn neo vào câu thật.
- **B5/B6**: nội dung khác nhau từng bài → là **dữ liệu trong `lesson`**, không phải màn dùng chung.

### Tầng C — Ôn *(chỉ chứa thứ đã gặp)*

**C1. Thẻ từ 3 chế độ** — đọc (汉字→?) · nghe (🔊→?) · viết (nghĩa→汉字). Tiến độ **tách riêng 3 chế độ**; gộp một cờ `known` là tự lừa mình.
**C2. SRS SM-2 theo CẤP** — 📖 sách cấp 2 ghi *"二级教程编写严格遵循HSK（二级）大纲规定的300词，**包括一级的150词**"* → từ vựng lũy kế, nên khoá tiến độ theo `hsk1` chứ không theo bài; bài chỉ là `firstSeenIn`.
**C3. Luyện thanh** — rút từ đúng vốn từ đã học, dạng bài mở dần theo mục 4.
**C4. Bảng tiến độ** — x/150 từ (tách 3 chế độ) · x/52 chữ độc thể viết được · x/18 bộ thủ · thanh nào hay sai · 📖 đề thi thử trong sách bài tập.

---

## 6. Thứ tự build

```
A1 bảng ngữ âm ──┐
A2 bốn thanh   ──┴─► dùng được ngay, không cần nhập thêm dữ liệu

B2 课文 + 生词 ──► B3 注释 ──► B5 拼音 ──► B6 汉字 ──► B1 热身 ──► B4 练习 ──► B7 运用

C2 SRS (quyết định hình dạng lưu) ──► C1 thẻ ──► C3 luyện thanh ──► C4 tiến độ
```

**Đề xuất: A1 → A2 → B2 → C2 → B3 → C1 → B5 → B6 → B1 → B4 → C3 → B7 → C4.**

💭 Vì sao đổi so với bản trước:
- **A1/A2 lên đầu** thay cho Tone Trainer — cùng dùng `pinyin.js` đã có, nhưng đây là *cái đọc*, còn Tone Trainer là *cái luyện*. Phải có cái đọc trước.
- **B2 ngay sau A** — vì đây là màn duy nhất khiến app hơn quyển sách giấy ngay lập tức (3 công tắc + audio). Bài 1–5 đã nhập đủ từ vựng.
- **C2 vẫn sớm** (lý do cũ còn đúng): nó quyết định hình dạng `localStorage`, đổi sau là mất sạch tiến độ. Nhưng giờ nó xuống sau B2, vì phải biết "gặp từ" trông thế nào rồi mới thiết kế được chỗ lưu.
- **B4 练习 xuống muộn** — cần bóc đáp án từ PDF, tốn công nhất mà giá trị thấp hơn B2/B3.

---

## 7. Trạng thái lưu

```json
{
  "phonetics": { "a1Done": true, "a2Done": true },
  "hsk1": {
    "lessons": {
      "hsk1-l03": { "scenesRead": [1, 2], "notesRead": true,
                    "pinyinDone": false, "hanziDone": false,
                    "exercisesDone": false, "applyDone": false }
    },
    "vocab": {
      "h1l03-v01": {
        "read":   { "due": "2026-09-25", "interval": 3, "ease": 2.5 },
        "listen": { "due": "2026-09-22", "interval": 1, "ease": 2.3 },
        "write":  null,
        "firstSeenIn": "hsk1-l03", "firstSeenScene": 1
      }
    },
    "tones": { "h1l03-v01": { "right": 4, "wrong": 1 } },
    "hanzi": { "水": { "recognize": true, "strokesOk": true } },
    "updatedAt": "2026-09-21T10:00:00Z"
  }
}
```

Bốn điểm cố ý:
1. **`phonetics` nằm ngoài `hsk1`** — nền ngữ âm học một lần, dùng cho cả 6 cấp.
2. **`lessons[].scenesRead` là mảng** — mở khoá theo 场景, không theo bài. Luật mục 4 dựa vào đây.
3. **3 lịch SRS riêng** cho đọc/nghe/viết.
4. **`hanzi` tách `recognize` và `strokesOk`** — 📖 sách chỉ bắt viết 17 nét + 52 chữ độc thể, còn lại chỉ nhận mặt chữ. Một cờ chung là hiểu sai yêu cầu của sách.

---

## 8. Khảo sát app tiếng Trung — giữ nguyên, nhưng đọc lại cho đúng

| App | 📖 Cơ chế | 💭 Chặng nào dùng |
|---|---|---|
| **HelloChinese** | 📖 Giải thích ngữ pháp trong mọi bài, luyện thanh **có phản hồi trực quan**, luyện viết theo thứ tự nét | A2 (đường cong thanh), B6 |
| **Dong Chinese** | 📖 **Tone Trainer** — tách *nghe phân biệt* thanh và *nói* thanh | A2 rồi C3 |
| **Skritter** | 📖 Phản hồi **từng nét**, phân rã bộ thủ + từ nguyên | B6 (từ bài 7 trở đi) |
| **Du Chinese** | 📖 Graded reader theo cấp HSK, **bật/tắt pinyin và bản dịch**, audio bản xứ | B2 — 3 công tắc lấy thẳng từ đây |
| **Pleco** | 📖 Từ điển + flashcard, OCR, viết tay | ❌ không làm, cứ dùng Pleco |
| **Anki** | 📖 Thuật toán **SM-2** | C2 |
| **HSKLord** | 📖 SRS, audio mọi từ, tích hợp mẫu ngữ pháp, luyện đúng dạng đề, tiến độ theo cấp | C2, C4, B4 |
| **Duolingo** ❌ | 📖 Dừng ở ~HSK 4, **phản hồi thanh điệu rất ít**, **không có phần viết chữ** | Ví dụ phản diện |

📖 *"đa số người học thành công dùng kết hợp 2–3 app chứ không dựa vào một cái"*.

💭 **Đọc lại khảo sát sau khi xem sách:** những app trên mạnh ở *luyện*, và bản trước đã bắt chước đúng phần đó — nên mới thành "toàn thẻ". Cái không app nào trong bảng có, mà sách có, là **trình tự**: ngữ âm trước, rồi chủ đề, rồi ghép chữ. Giá trị riêng của app này nằm ở trình tự, không nằm ở thẻ.

---

## 9. Cố ý KHÔNG làm

| Bỏ | Lý do |
|---|---|
| Chấm phát âm bằng mic | 📖 Nguồn khảo sát: pinyin + thanh *"không đánh giá được đầy đủ thanh điệu, nhịp và lời nói nối"*. 💭 Nửa vời hại hơn không có — nó cho cảm giác sai là mình đọc đúng |
| Quiz "viết chữ" cho mọi từ | 📖 Sách tr.7: *"只对17个基本笔画和52个独体字有书写要求"*. 💭 Vượt yêu cầu là làm người học nản |
| Màn ngữ pháp kiểu bách khoa | 📖 Sách **弱化语法**, *"只涉及本课课文中的用法"* |
| OCR / nhập viết tay | 📖 Pleco làm rồi |
| Graded reader ngoài giáo trình | 📖 Du Chinese đã có theo cấp HSK |
| Gamification kiểu Duolingo | 📖 Duolingo đủ streak/điểm mà vẫn bị chê vì thiếu thanh điệu và chữ viết |
| Import từ Drive | Không còn nguồn nào để crawl |

---

## 10. Phụ lục kỹ thuật — ảnh 热身

📖 Máy đã có `pdfimages`, `pdftoppm` (poppler 26.07.0).
📖 PDF giáo trình HSK 1: **147 trang, A4, 455 MB** — mỗi trang là **một ảnh scan**, không phải nhiều ảnh rời. `pdfimages` chỉ trả về nguyên trang.

📖 Render thử: **100 dpi = 108 KB** · **150 dpi = 208 KB** · **200 dpi = 348 KB**.
💭 150 dpi cân bằng — cả quyển ~30 MB.

💭 Không cần thư viện xử lý ảnh: lưu **một ảnh trang + toạ độ vùng cắt trong JSON**, để CSS cắt lúc render.

```json
{ "id": "h1l03-w01", "page": 26, "crop": { "x": 120, "y": 340, "w": 260, "h": 200 }, "answer": "C" }
```

```css
.crop { overflow: hidden; position: relative; }
.crop img { position: absolute; object-fit: none; }
/* object-position: -120px -340px  ←  đặt inline từ crop.x / crop.y */
```

Sửa toạ độ lệch không phải cắt lại ảnh · một ảnh trang phục vụ mọi vùng cắt của trang · không cần build step.
📖 Muốn cắt ra file thật thì `sips` của macOS làm được — đã test `sips -c 700 900 --cropOffset 300 400`.

⚠️ Ảnh trang là **scan sách có bản quyền** → để local, `.gitignore` đã chặn.

---

## 11. Cần chốt

| # | Câu hỏi | Đề xuất |
|---|---|---|
| 1 | 运用 (B7) học một mình thì làm gì? | Tự ghi âm hai vai, app phát xen kẽ — chưa có cơ chế nào tốt hơn |
| 2 | Tầng A có bắt buộc xong mới mở bài 3 không? | 💭 **Gợi ý mạnh, không khoá cứng** — khoá cứng thì người quay lại học tiếp bị chặn vô lý |
| 3 | Ảnh: cắt bằng CSS hay cắt ra file bằng `sips`? | **CSS** — sửa toạ độ không phải cắt lại |
| 4 | SM-2 tự viết hay tìm package? | **Tự viết** ~40 dòng |
| 5 | Phân rã bộ thủ (B6) lấy dữ liệu đâu? | Make Me a Hanzi — ⚠️ **chưa verify** hanzi-writer có expose không |
| 6 | Repo private hay public? | ⚠️ [[00 - Hướng đi ứng dụng]] ghi *private*, bản trước note này ghi *đang public*. **Mâu thuẫn, phải kiểm tra** — trong repo có scan sách bản quyền |

---

## Nguồn

**Sách (nguồn chuẩn, đọc trực tiếp):**
- 《HSK标准教程1》— 本册说明 tr.6–7 · 目录 tr.8–13 · bài 1 tr.14 · bài 3 tr.26
- 词语总表 tr.132 · 汉字总表 tr.140 · 偏旁总表 tr.141

**Khảo sát app:**
- [Best Chinese Learning Apps 2026 — HSKLord](https://hsklord.com/blog/best-chinese-learning-apps-2026)
- [Dong Chinese Review — Flexi Classes](https://flexiclasses.com/mandarin/dong-chinese/) · [LanguaVibe](https://languavibe.com/dong-chinese-review/)
- [Best Apps to Learn Chinese — Clozemaster](https://www.clozemaster.com/blog/best-apps-to-learn-chinese/)
- [Duolingo Chinese Review vs Alternatives — Migaku](https://migaku.com/blog/chinese/duolingo-chinese-review-vs-alternatives)
- [TonePerfect — best apps to learn Chinese tones](https://toneperfect.app/blog/best-app-to-learn-chinese-tones-2026)

**Công cụ:**
- [Hanzi Writer](https://hanziwriter.org/) · [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) — MIT, >9.000 chữ
- [Chinese Grammar Wiki](https://resources.allsetlearning.com/chinese/grammar/A1_grammar_points)
- [Đáp án miễn phí — Nhân Trí Việt](https://www.nhantriviet.com/GiaoTrinhChuanHSK)
