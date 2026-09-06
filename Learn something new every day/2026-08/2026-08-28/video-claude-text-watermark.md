# 🎬 Claude đóng dấu chìm vào văn bản — 2026-08-28

**Nguồn:** [[ai-security]] · [bài gốc](https://www.anthropic.com/news/claude-text-watermark)
**Trạng thái:** done
**File:** `Learn something new every day/2026-08/2026-08-28/video/claude-text-watermark.mp4` · 76.6s · 53 dòng sub · 20 clip · 24.7 MB

## Script (đọc)

Từ giờ, mọi thứ Claude viết ra đều có dấu chìm. Và bạn sẽ không bao giờ nhìn thấy nó.

Đây là watermark cho văn bản, không phải cho ảnh. Nó không chèn ký tự ẩn nào hết. Anthropic làm việc này để đáp ứng luật AI của châu Âu. Áp dụng từ đầu tháng Tám.

Thứ nhất, cách nó chạy. Bình thường model chọn từ bằng số ngẫu nhiên. Giờ nó dùng một khoá bí mật cộng vài từ đứng trước để quyết định từ tiếp theo. Không thêm token, không tăng giá, tốc độ gần như không đổi.

Thứ hai, dấu chìm này không nói gì về bạn. Anthropic khẳng định không thể lần ra người dùng, tổ chức hay đoạn chat nào. Còn công cụ kiểm tra thì đang ở bản dùng thử giới hạn. Chỉ cơ quan quản lý, nhà báo và nhà nghiên cứu được dùng.

Thứ ba, và đây là chỗ đáng lo. Viết lại toàn bộ là dấu chìm biến mất. Đoạn quá ngắn thì gần như không đọc được. Văn bản thuần dữ kiện cũng bị thưa dấu.

Nghĩa là đừng bao giờ dùng nó làm bằng chứng ai viết cái gì. Nó chỉ cho biết Claude có thể đã tham gia. Nếu team bạn dùng AI để viết nội dung, đừng phụ thuộc vào công cụ dò. Tự lưu model, prompt và người duyệt là chắc nhất. Mình gom tin dev mỗi ngày, theo dõi nếu thấy hữu ích.

## video_terms

`ai chip closeup` · `person typing document laptop` · `digital code screen` · `european union flag` · `journalist writing notes` · `robot hand keyboard`

## Caption TikTok

Claude giờ đóng dấu chìm vào mọi văn bản nó viết — nhưng đừng dùng nó làm bằng chứng. Đây là lý do.

#devtok #ai #claude #anthropic #laptrinh #congnghe #euaiact #devvietnam

## Fact check

- [ ] Watermark dùng "low-stakes choices" — khoá bí mật + vài từ trước thay cho random number generator ← bài gốc, mục cách hoạt động
- [ ] Không thêm token, không tăng giá, "negligible impact on speed" ← bài gốc
- [ ] Không định danh người dùng / tổ chức / chat ← bài gốc, nguyên văn "không thể phục hồi bất cứ thông tin nào về người dùng"
- [ ] Detection API ở private preview, chỉ mở cho cơ quan quản lý, nhà báo, fact-checker, nhà nghiên cứu, tổ chức giáo dục, nhóm dân sự EU ← bài gốc
- [ ] Viết lại toàn bộ xoá được watermark ← bài gốc, mục giới hạn
- [ ] Hiệu quả thấp trên đoạn ngắn; thưa trên "factual passages" ← bài gốc
- [ ] EU Code of Practice on Transparency of AI-Generated Content, ký 7/2026, áp dụng từ 02/08/2026 ← bài gốc, mốc thời gian
- [ ] "Chỉ cho biết Claude *có thể* đã tham gia" ← vault `ai-security.md` 2026-08-28

**Đã đổi cho hợp TTS tiếng Việt (nghĩa giữ nguyên):**
- "private preview" → "bản dùng thử giới hạn"
- "detector" → "công cụ dò"
- Bỏ số ngày cụ thể 02/08, đọc thành "đầu tháng Tám" cho tự nhiên
