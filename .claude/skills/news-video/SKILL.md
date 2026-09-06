---
name: news-video
description: Biến ĐÚNG MỘT bài trong news-daily thành 1 video TikTok dọc (script tiếng Việt + voice Edge TTS + phụ đề + b-roll) bằng renderer Node local. Dùng khi user muốn "làm video từ tin này", "lên video TikTok cho bài X", hoặc gõ /news-video.
argument-hint: [số Top 1-5 | tiêu đề bài | url | để trống để chọn]
allowed-tools: Read, Grep, Glob, Write, Edit, WebFetch, AskUserQuestion, Bash(node:*), Bash(npm:*), Bash(find:*), Bash(cat:*), Bash(ls:*), Bash(head:*), Bash(sed:*), Bash(grep:*), Bash(mkdir:*)
---

**Mục tiêu:** 1 lần chạy = **1 bài = 1 video**. Không bao giờ batch nhiều bài, không tự chọn thay user.

**Context:** user là Shopify app dev (Joy Loyalty), làm kênh TikTok news dev/tech tiếng Việt. Giọng kênh: đồng nghiệp kể tin cho nhau nghe, không phải MC bản tin.

**Renderer:** `renderer/render.js` — Node + Edge TTS + ffmpeg, chạy local, không cần Docker/Python/server. Chi tiết: [renderer/README.md](renderer/README.md).

Vault news: `Learn something new every day/YYYY-MM/YYYY-MM-DD/`

---

## Bước 0 — Preflight (không chặn phần viết script)

```bash
cd .claude/skills/news-video/renderer && ls node_modules/node-edge-tts >/dev/null 2>&1 && echo deps-ok || echo deps-missing
node -e "console.log(process.env.PEXELS_API_KEY ? 'pexels-ok' : 'pexels-missing')"
```

- `deps-missing` → chạy `npm install` trong `renderer/`.
- `pexels-missing` **và** user không đưa folder b-roll local → **vẫn làm tiếp tới bước 4**, nhưng báo trước ở bước 4 là chưa render được, kèm cách lấy key (xem [setup.md](setup.md)). Chỉ chặn ở bước 5.
- ffmpeg do renderer tự dò (PATH, winget Links, thư mục package của winget). Thiếu thì nó báo lệnh cài.

---

## Bước 1 — Xác định bài (chỉ 1 bài)

Folder ngày mới nhất:
```bash
ls -d "Learn something new every day"/*/*/ | sort | tail -1
```

| `$ARGUMENTS` | Hành động |
|---|---|
| **trống** | Đọc `*-summary.md` ngày mới nhất → **AskUserQuestion** liệt kê Top 5 (tiêu đề rút gọn + 1 câu vì sao) cho user chọn. Đợi chọn xong mới đi tiếp. |
| **số 1-5** | Item thứ N trong "Top 5 đáng đọc nhất hôm nay". |
| **url** | `grep -rn "<url>"` trong folder ngày mới nhất; không thấy thì grep cả `Learn something new every day`. |
| **text / cả dòng heading dán vào** | `grep -rni` theo cụm keyword đặc trưng (hoặc phần url trong dòng đó). ≥2 kết quả ở các ngày khác nhau → AskUserQuestion cho user chốt bản nào. |
| **đường dẫn .md** | Đọc file, AskUserQuestion liệt kê các item trong đó. |

Không tìm thấy → **báo và dừng**. Không tự thay bài khác, không tự bịa nội dung ngoài vault.

---

## Bước 2 — Thu thập nội dung thật

Đọc nguyên block item trong file topic (`Đây là gì` / `Chi tiết` / `Vì sao đáng đọc`).

- Có `**Chi tiết:**` ≥3 bullet → đủ dùng.
- Không có / dưới 3 bullet → **WebFetch URL gốc** lấy 3-5 fact thật (số liệu, tên API, version, deadline, kết luận).
- WebFetch fail/404 → báo user, hỏi có làm video chỉ dựa nội dung vault không. Không tự bịa bù.

**Cấm tuyệt đối:** thêm số liệu, ngày, tên tính năng, so sánh "nhanh hơn X lần" không có trong vault hoặc bài gốc. Video đã publish thì không sửa được.

---

## Bước 3 — Viết script

Theo **toàn bộ** [script-rules.md](script-rules.md). Sinh 4 thứ:

1. `script` — lời đọc thuần: không markdown, emoji, URL, ngoặc đơn.
2. `terms` — 4-6 keyword tiếng Anh mô tả **cảnh quay** (đây là thứ quyết định b-roll đẹp hay rác).
3. `slug` — kebab-case ascii, dùng đặt tên file mp4.
4. Caption TikTok + 5-8 hashtag.

Ghi draft cạnh file topic:
`Learn something new every day/YYYY-MM/YYYY-MM-DD/video-<slug>.md`

```markdown
# 🎬 <tiêu đề video> — YYYY-MM-DD

**Nguồn:** [[<file topic>]] · [bài gốc](<url>)
**Trạng thái:** draft
**File:** —

## Script (đọc)
<script>

## video_terms
`keyword 1` · `keyword 2` · …

## Caption TikTok
<caption>

<hashtags>

## Fact check
- [ ] <mỗi con số / claim trong script> ← <trích từ đâu>
```

---

## Bước 4 — Duyệt (KHÔNG BỎ QUA)

In ra chat: script đầy đủ + `terms` + ước lượng thời lượng (âm tiết ÷ 4.2 giây) + checklist fact check.

Hỏi: **"Render luôn, hay sửa gì trước?"**

**Chỉ render sau khi user đồng ý.** User muốn sửa → sửa, cập nhật file draft, hỏi lại. Đây là chốt chặn duy nhất trước khi ra file publish.

---

## Bước 5 — Render

Ghi job bằng **Write** (không dùng heredoc — dễ vỡ escape tiếng Việt):
`renderer/work/<slug>/job.json`

```json
{
  "slug": "<slug>",
  "title": "<tiêu đề>",
  "script": "<script>",
  "terms": ["...", "..."],
  "outDir": "D:/obsidian/dev-note/Learn something new every day/YYYY-MM/YYYY-MM-DD/video"
}
```

Field tuỳ chọn (chỉ thêm khi cần lệch mặc định): `voice` `rate` `clipDuration` `perTerm` `font` `fontSize` `subtitleMarginV` `maxChars` `bgm` `bgmVolume` `crf` `broll`.

Chạy **background** (render 60s mất ~1-3 phút):

```bash
cd .claude/skills/news-video/renderer && node render.js work/<slug>/job.json
```

Dòng cuối stdout là `RESULT {json}` — parse lấy `file`, `duration`, `cues`, `clips`.

**Lỗi hay gặp:**
| Lỗi | Xử lý |
|---|---|
| `Chưa có b-roll` | thiếu `PEXELS_API_KEY` → xem setup.md, hoặc thêm `"broll"` trỏ folder clip local |
| `Không tải được clip nào` | `terms` quá trừu tượng → sửa theo bảng map trong script-rules.md rồi chạy lại |
| `không có clip dọc cho "<term>"` (warning) | term đó bị bỏ, các term khác vẫn chạy — sửa term nếu cảnh bị nghèo |
| `Không tìm thấy ffmpeg` | `winget install Gyan.FFmpeg` |
| Edge TTS timeout | chạy lại, thường do mạng |

Clip đã tải nằm trong `renderer/cache/<term-slug>/` và được tái dùng — chạy lại lần hai nhanh hơn nhiều.

---

## Bước 6 — Chốt

Cập nhật file draft: `Trạng thái: done`, `File: <đường dẫn mp4>`.

Báo gọn:
```
✅ Video xong — <tiêu đề>
   📁 <đường dẫn mp4>  (XXs · N dòng sub · M clip)
   📝 draft: Learn something new every day/YYYY-MM/YYYY-MM-DD/video-<slug>.md
   Caption + hashtag trong draft.
```

**Nhắc 1 lần:** xem lại video trước khi up — b-roll Pexels đôi khi lệch nội dung, xem thấy clip nào lạc thì đổi `terms` và render lại. Không tự upload TikTok.
