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
- Code comment bằng tiếng Việt
- Dùng `---` ngăn cách giữa các section lớn
- **Không cách dòng thừa** — compact, gọn gàng
- Dùng `[[tên note]]` khi reference đến note khác trong vault

### Giọng văn
- Ngắn gọn, súc tích, đi thẳng vào vấn đề
- Giải thích như đang nói cho bạn đồng nghiệp nghe — không quá formal, không quá casual
- Mỗi ý phải trả lời được: "Cái này giúp gì cho mình khi đi làm?"

### Trước khi viết
1. Hỏi user muốn đặt file ở folder nào (nếu chưa rõ)
2. Kiểm tra đã có file chưa — nếu có thì hỏi user muốn viết thêm hay viết lại
3. Nếu topic liên quan đến folder AI/Lang, kiểm tra có thuật ngữ mới nào cần thêm vào [[Glossary]] không
