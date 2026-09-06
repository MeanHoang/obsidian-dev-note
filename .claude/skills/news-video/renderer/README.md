# news-video renderer

1 job JSON → 1 file mp4 dọc 1080x1920, sẵn để up TikTok.

```bash
node render.js work/<slug>/job.json
```

Không server, không Docker. Chỉ cần Node 18+ và ffmpeg (có libass).

## Pipeline

```
script tiếng Việt
   ├─ Edge TTS (node-edge-tts) ──> voice.mp3 + timing từng từ (voice.json)
   ├─ gom từ thành cue ngắn ─────> sub.ass  (ngắt theo dấu câu / 26 ký tự / 2.6s)
   ├─ b-roll: Pexels API hoặc folder local ──> cache/<term>/*.mp4
   └─ ffmpeg: scale+crop 1080x1920 → concat → burn sub → mix voice+bgm → out/<slug>.mp4
```

Phụ đề lấy timing trực tiếp từ Edge TTS nên khớp tuyệt đối — không dùng Whisper, không đoán.

## Job

Bắt buộc: `slug`, `script`. Cần `terms` (nếu dùng Pexels) hoặc `broll` (folder local).

| Field | Mặc định | Ghi chú |
|---|---|---|
| `slug` | — | kebab-case ascii, thành tên file mp4 |
| `script` | — | lời đọc thuần, không markdown/emoji/URL |
| `terms` | — | 4-6 keyword tiếng Anh mô tả **cảnh quay** để search Pexels |
| `broll` | — | folder clip local; có field này thì bỏ qua Pexels |
| `outDir` | `./out` | nên trỏ vào folder ngày trong vault |
| `voice` | `vi-VN-NamMinhNeural` | hoặc `vi-VN-HoaiMyNeural` |
| `rate` | `+8%` | tốc độ đọc |
| `pitch` / `volume` | `default` | |
| `clipDuration` | `4` | giây mỗi clip b-roll |
| `perTerm` | `3` | số clip tải về mỗi term |
| `font` | `Segoe UI` | phải là font đã cài trong Windows |
| `fontSize` | `76` | tính trên khung 1080x1920 |
| `subtitleMarginV` | `520` | đẩy sub lên khỏi UI TikTok |
| `maxChars` | `26` | tối đa ký tự 1 dòng sub |
| `maxCueDur` | `2600` | ms tối đa 1 dòng sub |
| `bgm` | tự chọn trong `bgm/` | `false` = tắt, hoặc đường dẫn 1 file |
| `bgmVolume` | `0.12` | |
| `crf` / `preset` | `22` / `veryfast` | chất lượng vs tốc độ x264 |

`PEXELS_API_KEY` đọc từ env, hoặc đặt `pexelsKey` trong job.

## Output

Dòng cuối stdout:
```
RESULT {"file":"...","duration":58.2,"cues":24,"clips":15,"sizeMB":18.4,"bgm":null}
```

## Thư mục

| | |
|---|---|
| `work/<slug>/` | voice.mp3, voice.json, sub.ass, job.json — giữ lại để debug |
| `cache/<term>/` | clip Pexels đã tải, **tái dùng** giữa các lần render |
| `out/` | mp4 (nếu job không đặt `outDir`) |
| `bgm/` | nhạc nền tự bỏ vào |

Tất cả đều trong `.gitignore` — không lọt vào commit của vault.

## Ghi chú kỹ thuật

- ffmpeg chạy với `cwd = work/<slug>` để filter `subtitles=sub.ass` dùng đường dẫn tương đối — tránh phải escape `C:\` trong filtergraph của Windows.
- Clip lấy từ **đoạn giữa** mỗi file (đầu clip stock thường có fade/khung tĩnh).
- Cắt thẳng, không transition — hợp nhịp TikTok hơn crossfade, và rẻ hơn nhiều khi encode.
- Clip nguồn ít hơn số clip cần thì tự lặp lại; muốn đỡ lặp thì tăng `perTerm` hoặc thêm `terms`.
