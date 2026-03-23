## Skills trong Claude Code

Skills là các prompt-based capabilities. Khi bạn gọi một skill, nó load một tập instructions (file markdown) vào context của Claude, và Claude thực thi chúng. Skills có thể spawn subagents, nhận arguments, dùng specific tools, và orchestrate các multi-step workflows phức tạp.[](https://batsov.com/articles/2026/03/11/essential-claude-code-skills-and-commands/)

---
### 2 loại gọi skill:

| Loại         | Cách dùng                                          | Ví dụ                                               |
| ------------ | -------------------------------------------------- | --------------------------------------------------- |
| **Thủ công** | Gõ `/tên-skill`                                    | `/review`, `/plan`, `/debug`                        |
| **Tự động**  | Claude tự kích hoạt khi nhận thấy ngữ cảnh phù hợp | Hỏi về Firestore → Claude tự load skill `firestore` |

---
## **Có 2 vị trí đặt skill:**
- **Global** (`~/.claude/skills/`) — dùng được cho tất cả projects
- **Project** (`.claude/skills/`) — chỉ dùng trong project đó
---
### Cấu trúc file:****
```
.claude/skills/my-skill/
└── SKILL.md        # File chính, chứa frontmatter + hướng dẫn
```
```
---
name: my-skill
description: Mô tả khi nào dùng skill này
---

Hướng dẫn chi tiết cho Claude...
```

---
## Cách viết file SKILL.md

Mỗi skill cần một file `SKILL.md` với hai phần: YAML frontmatter (giữa các dấu `---`) để cho Claude biết khi nào dùng skill, và markdown content chứa instructions. [Claude](https://code.claude.com/docs/en/skills)
**Ví dụ cơ bản:**
```
---
name: explain-code
description: Giải thích code bằng sơ đồ và ví dụ thực tế. Dùng khi user hỏi "cái này hoạt động thế nào?"
---

Khi giải thích code, luôn làm theo các bước:

1. **Bắt đầu bằng analogy**: So sánh với vật trong cuộc sống thực
2. **Vẽ sơ đồ**: Dùng ASCII art để minh họa flow
3. **Walk-through từng bước**: Giải thích step-by-step
4. **Highlight gotcha**: Lỗi phổ biến cần tránh
```
---
## Frontmatter options
Hai frontmatter fields đặc biệt để kiểm soát quyền gọi skill:
- `disable-model-invocation: true` — Chỉ bạn mới có thể gọi skill (dùng cho /deploy, /commit,... để tránh Claude tự ý gọi)
- `user-invocable: false` — Chỉ Claude có thể gọi (dùng cho background knowledge)
---
## Dùng $ARGUMENTS để nhận tham số
```
---
name: fix-issue
description: Fix một GitHub issue cụ thể
---

Fix issue số $ARGUMENTS theo coding standards của project.
Đọc file liên quan, phân tích lỗi, và đề xuất fix.
```
Gọi bằng: `/fix-issue 123`

---
## Thêm supporting files

Các file khác là tùy chọn và giúp xây dựng skills mạnh hơn: templates để Claude fill in, example outputs thể hiện format mong muốn, scripts Claude có thể thực thi, hoặc tài liệu reference chi tiết. Hãy reference các file này từ `SKILL.md` để Claude biết chúng chứa gì và khi nào load chúng. [Claude](https://code.claude.com/docs/en/skills)
```
---
name: analyze-data
description: Phân tích file CSV và tạo báo cáo
---

Dùng script `analyze.py` trong thư mục này để phân tích dữ liệu:

    python3 analyze.py <input_file>

Sau đó tổng hợp kết quả theo template trong `templates/report.md`.
```

---
## Tips hay

- Giữ `SKILL.md` dưới 500 dòng. Chuyển tài liệu reference chi tiết sang các file riêng. [Claude](https://code.claude.com/docs/en/skills)
- **Description** phải rõ ràng — đây là thứ Claude dùng để quyết định có invoke skill hay không.
- Với workflows có side effects (deploy, send message...) nên dùng `disable-model-invocation: true` để tự kiểm soát timing.
---
### Project Joy hiện có ~40 skills, ví dụ:
- `/plan` — Lập kế hoạch implementation
- `/review` — Code review theo chuẩn Avada
- `/debug` — Điều tra lỗi
- `/firestore` — Patterns cho Firestore
- `/shopify-api` — Shopify API best practices
- `/commit` — Tạo commit message
---
### Khi nào nên tạo skill mới:
- Có workflow lặp đi lặp lại
- Muốn Claude hiểu pattern/convention riêng của project
- Cần tự động hóa quy trình nhiều bước