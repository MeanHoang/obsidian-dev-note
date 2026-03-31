Tạo note cho topic: $ARGUMENTS

## Quy tắc viết note

### Ngôn ngữ
- Viết bằng **tiếng Việt** là chính, thuật ngữ kỹ thuật giữ nguyên tiếng Anh
- Giải thích thuật ngữ tiếng Anh bằng tiếng Việt khi lần đầu xuất hiện

### Cấu trúc bắt buộc
1. **Mở đầu** — 1 quote hay liên quan đến topic, dùng callout `> [!quote] 💬`
2. **Định nghĩa** — Topic này là gì? Giải thích ngắn gọn, dễ hiểu
3. **So sánh thực tế** — Dùng callout `> [!note] 📝 So sánh dễ hiểu` để so sánh với đời thường (ví dụ: "giống như gọi 115 rồi cúp máy", "giống như mang vali 3 tuần đi 3 ngày")
4. **Nội dung chính** — Chia thành các phần rõ ràng với heading ##, ###
5. **Ví dụ code** — Luôn có Bad ❌ vs Good ✅ khi so sánh
6. **Checklist** — Kết thúc bằng checklist tóm tắt `- [ ]`

### Format & Style
- Heading dùng emoji: `## 🎯 Tiêu đề`, `### 1️⃣ Bước 1`
- Callout types:
  - `> [!quote] 💬` — Quote hay
  - `> [!note] 📝` — So sánh, giải thích thêm
  - `> [!tip] 💡` — Mẹo, best practice
  - `> [!warning] ⚠️` — Cảnh báo, dễ sai
  - `> [!danger] ⛔` — Tuyệt đối tránh
- Dùng **bảng** cho so sánh nhiều option
- Dùng **code block** với language tag (```js, ```python...)
- **Ưu tiên JavaScript/TypeScript** cho code examples. Chỉ dùng Python khi topic đặc thù Python
- Code comment bằng tiếng Việt
- Dùng `---` ngăn cách giữa các section lớn
- **Không cách dòng thừa** — compact, gọn gàng
- Dùng `[[tên note]]` khi reference đến note khác trong vault

### Giọng văn
- Ngắn gọn, súc tích, đi thẳng vào vấn đề
- Giải thích như đang nói cho bạn đồng nghiệp nghe — không quá formal, không quá casual
- Mỗi ý phải trả lời được: "Cái này giúp gì cho mình khi đi làm?"

### Research & Tham khảo
- **Trước khi viết**, search web để tìm bài viết, blog, video trending/chất lượng liên quan đến topic
- Thêm section `## 📚 Tham khảo` ở cuối note (trước Checklist) với format:
  - Liệt kê 3-5 nguồn tham khảo chất lượng (blog, docs, video, tutorial)
  - Mỗi nguồn gồm: **tiêu đề + link + 1-2 câu tóm tắt nội dung**
  - Ưu tiên: docs chính thức, blog kỹ thuật uy tín, video có nhiều view
  - Nếu có bài viết trending gần đây → đánh dấu `🔥`
- Format:
  ```
  ## 📚 Tham khảo
  - [Tiêu đề bài viết](link) — tóm tắt 1-2 câu
  - 🔥 [Bài trending](link) — tóm tắt 1-2 câu
  ```

### Đánh số file
- Tên file **bắt đầu bằng số thứ tự** để dễ theo dõi thứ tự học: `0-Tên Topic.md`, `1-Tên Topic.md`, `2-Tên Topic.md`...
- Kiểm tra các file đã có trong folder để xác định số tiếp theo
- Ví dụ: folder đã có `0-LLM Overview.md`, `1-Structured Output.md` → file mới sẽ là `2-Tên Mới.md`
- Khi reference bằng wiki link, dùng tên có số: `[[2-Prompt Engineering]]`

### Trước khi viết
1. Hỏi user muốn đặt file ở folder nào (nếu chưa rõ)
2. Kiểm tra đã có file chưa — nếu có thì hỏi user muốn viết thêm hay viết lại
3. **Kiểm tra số thứ tự** — đọc các file trong folder để xác định số tiếp theo cho tên file
4. Nếu topic liên quan đến folder AI/Lang, kiểm tra có thuật ngữ mới nào cần thêm vào [[Glossary]] không
5. **Search web** để tìm nguồn tham khảo & kiến thức trending trước khi viết nội dung
