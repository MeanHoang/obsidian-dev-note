# 🎬 Pipeline tự tạo video TikTok từ note

> [!quote] 💬
> "The best tool is the one that's already on your machine."
> — Tự động hoá không có nghĩa là cài thêm một hệ thống lớn. Thường chỉ cần ghép đúng 3 thứ nhỏ.

## 🎯 Đây là gì

Một pipeline chạy **local** biến 1 bài note trong vault thành 1 file `.mp4` dọc 1080×1920 sẵn để up TikTok: có giọng đọc tiếng Việt, phụ đề khớp từng câu, b-roll (video minh hoạ nền) và nhạc nền.

Toàn bộ chỉ dùng 3 thành phần, **không có model AI nào sinh video cả**:

| Thành phần                     | Vai trò                                     | Giá                         |
| ------------------------------ | ------------------------------------------- | --------------------------- |
| **Edge TTS** (`node-edge-tts`) | text → giọng đọc + **timing từng từ**       | miễn phí, không cần API key |
| **ffmpeg**                     | cắt/ghép/crop video, burn phụ đề, mix audio | miễn phí, 1 binary          |
| **Pexels API**                 | tải b-roll stock theo keyword               | miễn phí, 200 req/giờ       |

> [!note] 📝 So sánh dễ hiểu
> Giống như làm phóng sự truyền hình mà không có ekip: **Edge TTS là người đọc lời bình**, **Pexels là kho tư liệu**, còn **ffmpeg là bàn dựng**. AI (Claude) chỉ đóng vai **biên tập viên viết kịch bản** — đọc note, chọn góc, viết lời. Không ai trong dây chuyền này "sáng tạo" hình ảnh cả.

---

## 🔑 Ý tưởng cốt lõi: TTS trả về timing, nên phụ đề là miễn phí

Đây là chỗ ăn tiền nhất của cả pipeline.

Edge TTS không chỉ trả về file audio. Nó phát **WordBoundary event** — mốc thời gian của từng từ, đơn vị 100 nanosecond. `node-edge-tts` gói lại thành file JSON:

```json
[
  { "part": "Từ ",   "start": 100,  "end": 380 },
  { "part": "giờ, ", "start": 380,  "end": 720 },
  { "part": "mọi ",  "start": 720,  "end": 910 }
]
```

Có timing này rồi thì phụ đề **không cần đoán, không cần nhận dạng giọng nói**.

```js
// ❌ Bad — chạy Whisper để lấy phụ đề
// Tốn 2-5 phút/video, tiếng Việt sai chính tả, và... mình đã biết trước text rồi!
const srt = await whisper.transcribe('voice.mp3')

// ✅ Good — lấy timing thẳng từ TTS, độ chính xác tuyệt đối
const words = JSON.parse(fs.readFileSync('voice.json', 'utf8'))
const cues = buildCues(words) // gom từ thành dòng ngắn
```

> [!tip] 💡
> Quy tắc chung: **nếu bạn là người sinh ra text, đừng bao giờ nhận dạng lại text đó.** Speech-to-text chỉ dành cho audio mình không kiểm soát.

### Gom từ thành dòng phụ đề

Word boundary quá vụn để hiển thị. Cần gom lại theo 3 điều kiện, cái nào tới trước thì ngắt:

```js
function buildCues(words, { maxChars = 26, maxDur = 2600 } = {}) {
  const cues = []
  let cur = null
  for (const w of words) {
    if (!cur) { cur = { start: w.start, end: w.end, text: w.part }; continue }
    const merged = (cur.text + w.part).trim()
    // 1) quá dài -> tràn dòng trên màn dọc   2) quá lâu -> mắt mỏi
    if (merged.length > maxChars || w.end - cur.start > maxDur) {
      cues.push(cur)
      cur = { start: w.start, end: w.end, text: w.part }
    } else {
      cur.text += w.part
      cur.end = w.end
    }
    // 3) hết câu -> ngắt luôn, phụ đề bám nhịp nói
    if (/[.!?…:;]\s*$/.test(cur.text)) { cues.push(cur); cur = null }
  }
  if (cur) cues.push(cur)
  return cues
}
```

---

## ⏱️ Cái bẫy lớn nhất: khoảng lặng giữa các câu

Ước lượng thời lượng video ban đầu bị **sai 24%** (dự đoán 62s, thực tế 76.6s). Lý do:

> [!warning] ⚠️ Edge TTS chèn ~0.78 giây im lặng sau **mỗi dấu chấm**, bất kể câu dài hay ngắn.
> Script 20 câu = **15.6 giây** chỉ để nghỉ. Chiếm 1/5 video.

```js
// ❌ Bad — chỉ tính tốc độ đọc
const seconds = syllables / 4.1

// ✅ Good — cộng cả nhịp nghỉ sau mỗi câu
const seconds = syllables / 4.1 + 0.78 * sentenceCount
```

Kiểm chứng trên video thật: 254 âm tiết / 20 câu → dự đoán 77.6s, thực tế 76.6s (**sai số 1%**).

Hệ quả ngược đời cần nhớ khi viết script: **cắt câu ngắn ra làm video DÀI thêm**, dù tổng số chữ không đổi. Câu ngắn tốt cho retention nhưng phải trả giá bằng thời lượng.

---

## 🎞️ Ghép video bằng ffmpeg

Một lệnh `filter_complex` duy nhất làm hết: chuẩn hoá khung → nối clip → burn phụ đề → mix audio.

```js
// N clip b-roll (input 0..N-1) + voice (input N) + bgm (input N+1)
let f = ''
// 1) mỗi clip: phóng to cho phủ kín khung dọc rồi crop, ép cùng fps/pixel format
clips.forEach((_, i) => {
  f += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,` +
       `crop=1080:1920,setsar=1,fps=30,format=yuv420p[v${i}];`
})
// 2) nối lại
f += clips.map((_, i) => `[v${i}]`).join('') + `concat=n=${clips.length}:v=1:a=0[vcat];`
// 3) burn phụ đề vào pixel
f += `[vcat]subtitles=sub.ass[vout]`
// 4) trộn giọng đọc với nhạc nền
f += `;[${bi}:a]volume=0.12[bg];[${vi}:a][bg]amix=inputs=2:duration=first:normalize=0[aout]`
```

### Chuẩn hoá khung hình — sai là ra viền đen

```bash
# ❌ Bad — clip ngang bị bóp méo hoặc thành thư viền đen 2 đầu
scale=1080:1920

# ✅ Good — phóng cho phủ kín (increase) rồi cắt phần thừa
scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1
```

`setsar=1` bắt buộc: clip stock hay có pixel aspect ratio lạ, thiếu dòng này thì `concat` sẽ lỗi hoặc hình bị kéo.

### ASS thay vì SRT

SRT chỉ style được qua `force_style` và áp chung cho toàn bộ. ASS cho phép khai báo style đầy đủ trong file — quan trọng nhất là `MarginV` để **đẩy phụ đề lên khỏi vùng UI của TikTok** (nút like/share/caption chiếm ~15% đáy màn hình).

```
Style: Default,Segoe UI,76,&H00FFFFFF,...,-1,0,0,0,100,100,0,0,1,5,3,2,90,90,520,1
                     │  │                  │                          │      │
                  font  size            bold               outline 5px  MarginV 520
```

> [!warning] ⚠️ Font phải phủ tiếng Việt
> Nhiều pipeline có sẵn (vd MoneyPrinterTurbo) mặc định font Trung như `STHeitiMedium.ttc` → tiếng Việt **mất dấu hoặc ra ô vuông**. Trên Windows dùng `Segoe UI` là an toàn, đã test đủ `ạ ỡ ữ ể đ`.

### Escape đường dẫn Windows trong filtergraph

Đây là chỗ tốn thời gian một cách vô lý. Filter `subtitles=` dùng `:` làm dấu phân cách tham số, mà `C:\` cũng có `:` → phải escape thành `C\\:/Users/...`, lồng thêm dấu nháy nữa thì rối không chịu được.

```js
// ❌ Bad — escape lồng nhau, dễ vỡ, khó debug
`subtitles='C\\:/obsidian/dev-note/work/sub.ass'`

// ✅ Good — đổi cwd, dùng đường dẫn tương đối
execFileSync(ffmpeg, [...args, '-filter_complex', 'subtitles=sub.ass'], { cwd: workDir })
```

---

## 🖼️ B-roll: keyword là thứ quyết định video đẹp hay rác

Pexels search bằng **cảnh quay**, không hiểu khái niệm trừu tượng. Đây là lỗi hay gặp nhất khi tự động hoá.

```js
// ❌ Bad — trả về 0 kết quả hoặc clip lạc đề hoàn toàn
terms: ['Shopify API', 'tax calculation', 'breaking change', 'scalability']

// ✅ Good — mỗi keyword trả lời được "quay cảnh này thì thấy gì?"
terms: ['online shopping phone', 'credit card payment',
        'developer typing laptop', 'warehouse packing']
```

Quy tắc: 4-6 keyword tiếng Anh, mỗi keyword 1-3 từ, **ít nhất 1 cảnh có người** (mặt người giữ retention tốt hơn cảnh vật).

> [!tip] 💡 Cache clip theo term
> Lưu clip đã tải vào `cache/<term-slug>/`. Lần render thứ hai của cùng chủ đề gần như tức thì, và tiết kiệm quota API.

### Chọn đoạn giữa clip

```js
// ❌ Bad — luôn lấy từ giây 0
const offset = 0  // clip stock hay có fade-in hoặc khung tĩnh ở đầu

// ✅ Good — lấy đoạn giữa
const take = Math.min(clipDuration, duration)
const offset = Math.max(0, (duration - take) / 2)
```

---

## 🧭 Vì sao không dùng giải pháp có sẵn

Có sẵn [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) (~121k sao) làm đúng việc này. Nhưng nó kéo theo Docker/Python + Streamlit + FastAPI + LLM key, trong khi **90% giá trị nằm ở script**, không nằm ở phần render.

| | MoneyPrinterTurbo | Pipeline tự dựng |
|---|---|---|
| Cài đặt | Docker ~1GB hoặc Python 3.11 + ffmpeg | ffmpeg + 1 package npm |
| API key | Pexels + LLM | Pexels |
| Sinh script | LLM của repo | Claude đọc thẳng note trong vault |
| Kiểm soát phụ đề | qua config | toàn quyền, tự viết ASS |
| Code phải hiểu | ~30k dòng | ~300 dòng |

> [!tip] 💡 Bài học chung
> Trước khi cài một framework, hỏi: **phần nào của nó mình thực sự dùng?** Ở đây chỉ dùng đúng "tải clip + ghép ffmpeg" — mà cả hai đều là vài chục dòng. Phần LLM của repo thậm chí bị bypass hoàn toàn vì mình truyền script viết sẵn vào.

---

## 🔒 Quản lý API key

```bash
# .gitignore của renderer
node_modules/
cache/     # clip đã tải, vài trăm MB
work/      # file trung gian
out/
.env       # <- key
```

```js
// Tự nạp .env, không cần thư viện: 12 dòng, không thêm dependency
function loadDotEnv() {
  const file = path.join(__dirname, '.env')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!m || line.trim().startsWith('#')) continue
    const val = m[2].trim().replace(/^["']|["']$/g, '')
    if (val && !process.env[m[1]]) process.env[m[1]] = val  // không ghi đè env thật
  }
}
```

> [!danger] ⛔ Vault Obsidian thường là git repo
> Renderer đặt trong `.claude/skills/` — Obsidian bỏ qua folder bắt đầu bằng dấu chấm, nhưng **git thì không**. Luôn `git check-ignore -v .env` để xác nhận thật sự bị loại, đừng tin mắt nhìn `.gitignore`.

---

## 📊 Số liệu thực tế

Video 76.6 giây, 1080×1920:

| Chỉ số | Giá trị |
|---|---|
| Thời gian render | ~90 giây (gồm tải 18 clip) |
| Render lần 2 (cache) | ~35 giây |
| Kích thước file | 24.7 MB (CRF 22, preset veryfast) |
| Số dòng phụ đề | 53 |
| Số clip ghép | 20 (từ 18 nguồn) |
| Chi phí | 0đ |

---

## 📚 Tham khảo

- [rany2/edge-tts — SubMaker](https://github.com/rany2/edge-tts/blob/master/src/edge_tts/submaker.py) — implementation gốc bằng Python, cho thấy WordBoundary/SentenceBoundary event được chuyển thành SRT/VTT thế nào.
- [node-edge-tts (npm)](https://www.npmjs.com/package/node-edge-tts) — port Node.js dùng trong pipeline này; option `saveSubtitles: true` là thứ tạo ra file timing JSON.
- 🔥 [Burn Styled Subtitles with FFmpeg](https://maxime.sh/posts/burn-styled-subtitles-with-ffmpeg/) — giải thích `force_style` và khác biệt giữa hardsub/softsub, kèm ví dụ tham số ASS.
- [FFmpeg subtitles Filter Reference](https://www.ffmpeg-micro.com/blog/ffmpeg-subtitles-filter-guide) — tài liệu chi tiết filter `subtitles`, gồm cả vấn đề escape đường dẫn.
- [FFMPEG Intermediate Guide — subtitle options](https://en.wikibooks.org/wiki/FFMPEG_An_Intermediate_Guide/subtitle_options) — so sánh các cách nhúng phụ đề và khi nào nên dùng cái nào.
- [Pexels API Documentation](https://www.pexels.com/api/documentation/) — endpoint `videos/search`, tham số `orientation=portrait`, cấu trúc `video_files` để chọn đúng độ phân giải.

---

## ✅ Checklist

- [ ] Text mình tự sinh ra → lấy timing từ TTS, **không** chạy speech-to-text lại
- [ ] Ước lượng thời lượng có cộng `0.78s × số câu`, không chỉ tốc độ đọc
- [ ] `scale=...:force_original_aspect_ratio=increase` + `crop` + `setsar=1` cho khung dọc
- [ ] Phụ đề dùng ASS, `MarginV` đủ lớn để tránh UI TikTok
- [ ] Font đã kiểm tra render đủ dấu tiếng Việt
- [ ] Chạy ffmpeg với `cwd` = thư mục làm việc, dùng đường dẫn tương đối trong filtergraph
- [ ] Keyword b-roll là **cảnh quay cụ thể**, không phải khái niệm; có ít nhất 1 cảnh có người
- [ ] Clip lấy từ đoạn giữa, không lấy từ giây 0
- [ ] Cache clip theo term để render lại nhanh
- [ ] `.env`, `node_modules/`, `cache/`, `work/`, `out/` đã trong `.gitignore` — verify bằng `git check-ignore`
