# Setup — chạy 1 lần

Pipeline chạy local bằng Node + ffmpeg. **Không cần Docker, không cần Python, không cần server.**

## 1. ffmpeg — ĐÃ CÀI ✅

```powershell
winget install Gyan.FFmpeg
```

Đã cài `ffmpeg 9.0.1-full_build` (có libass để burn phụ đề). Winget thêm vào PATH của **shell mới** — shell đang mở lúc cài sẽ không thấy. Renderer tự dò nên không sao.

Kiểm tra:
```bash
ffmpeg -version
```

## 2. Node deps — ĐÃ CÀI ✅

```bash
cd .claude/skills/news-video/renderer
npm install
```

Dùng `node-edge-tts` — Edge TTS miễn phí, không cần key, và trả về **timing từng từ** để dựng phụ đề.

## 3. Pexels API key — CẦN LÀM ⬜

Đây là thứ duy nhất còn thiếu. Free, không giới hạn thực tế (200 request/giờ).

1. Vào https://www.pexels.com/api/ → đăng ký → copy API key
2. Set biến môi trường cho user (PowerShell):

```powershell
[Environment]::SetEnvironmentVariable('PEXELS_API_KEY', '<key của bạn>', 'User')
```

3. **Mở terminal mới** (kể cả Claude Code) để biến có hiệu lực.

Kiểm tra:
```bash
node -e "console.log(process.env.PEXELS_API_KEY ? 'ok' : 'chưa có')"
```

**Không muốn dùng Pexels?** Bỏ clip vào 1 folder rồi thêm `"broll": "D:/đường/dẫn/folder"` vào job — renderer sẽ dùng clip local, bỏ qua Pexels hoàn toàn.

## 4. Nhạc nền — tuỳ chọn ⬜

Bỏ file mp3 vào `renderer/bgm/`. Mỗi lần render nó chọn ngẫu nhiên 1 bài, volume mặc định `0.12`.

Không có folder đó → video không nhạc nền, vẫn chạy bình thường. Tắt hẳn bằng `"bgm": false` trong job.

⚠️ Dùng nhạc có bản quyền sẽ bị TikTok gắn cờ. Lấy nhạc no-copyright, hoặc **bỏ trống và thêm nhạc trending ngay trong app TikTok lúc đăng** — cách này còn tốt cho reach hơn.

## 5. Font phụ đề

Mặc định `Segoe UI` — có sẵn trên Windows, phủ đủ tiếng Việt. Đã test render đúng dấu (`ạ ỡ ữ ể đ`).

Muốn đậm kiểu TikTok hơn thì đổi trong job:
```json
{ "font": "Segoe UI Black", "fontSize": 84 }
```
Font khác thì phải cài vào Windows trước (double-click file .ttf → Install).

## 6. Giọng đọc

Edge TTS có 2 giọng tiếng Việt:

| `voice` | Giọng |
|---|---|
| `vi-VN-NamMinhNeural` *(mặc định)* | Nam, trầm — hợp tin tech/dev |
| `vi-VN-HoaiMyNeural` | Nữ, sáng — hợp tin tài chính/tổng hợp |

`rate` mặc định `"+8%"`. Chậm hơn thì `"+0%"`, nhanh hơn `"+15%"` (quá `+20%` bắt đầu líu).

**Chọn 1 giọng cố định cho cả kênh** — đổi giữa chừng làm mất nhận diện.

## 7. Đăng bài

Renderer chỉ xuất file mp4. Không auto-upload — kênh mới mà up bằng script/cookie dễ bị hạn chế. Xem lại video rồi đăng tay qua app.
