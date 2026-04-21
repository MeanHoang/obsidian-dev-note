# 🧠 Memory & Context — AI ghi nhớ ở đâu?

> [!quote] 💬
> *"LLM về bản chất là stateless — mỗi request là 1 tờ giấy trắng. 'Memory' mà bạn thấy thực ra là app tự nhét lại context cho LLM mỗi lần."*

---
## 🎯 Vấn đề

Mỗi khi bạn chat với ChatGPT/Claude, model **không thực sự nhớ** bạn là ai. Bản thân LLM là **stateless** — gọi API lần 2 nó không biết lần 1 xảy ra gì.
Vậy tại sao ChatGPT nhớ được tên bạn? Claude Projects nhớ được file bạn upload? Claude Code nhớ được bạn thích gì?
→ Đó là vì có **nhiều tầng memory khác nhau** được thiết kế bên ngoài model, app tự quản lý và "feed lại" cho LLM mỗi lần gọi.

---
## 🗂️ 5 tầng memory — từ thấp đến cao
```
┌──────────────────────────────────────────────────┐
│ 5. Product-level     │ ChatGPT Memory, Claude    │ Qua nhiều session,
│    (persistent)      │ Projects, Claude Code     │ qua nhiều ngày/tháng
├──────────────────────┼───────────────────────────┤
│ 4. App-level         │ Vector DB, SQL, file      │ Vô thời hạn
│    (long-term)       │ RAG, LangChain Memory     │ (developer quản lý)
├──────────────────────┼───────────────────────────┤
│ 3. Conversation      │ messages=[...] truyền     │ Hết khi reset
│    (session history) │ lại mỗi turn              │ conversation
├──────────────────────┼───────────────────────────┤
│ 2. Session           │ Context window            │ Đến khi đầy
│    (context window)  │ (200K, 1M tokens...)      │ context
├──────────────────────┼───────────────────────────┤
│ 1. Model-level       │ KV cache trong GPU        │ Trong 1 request
│    (inference)       │ (bạn không thấy)          │ duy nhất
└──────────────────────┴───────────────────────────┘
```
---
## 1️⃣ Model-level — KV Cache

**Ở đâu:** Bên trong quá trình inference, trên GPU.

**Là gì:** Khi LLM sinh từng token, nó cache lại kết quả tính attention của token trước để không phải tính lại. Gọi là **KV cache** (Key-Value cache).

**Bạn có kiểm soát không?** Không — đây là chuyện của hạ tầng. Nhưng nó ảnh hưởng đến:
- **Prompt caching** (Anthropic, OpenAI): tính phí rẻ hơn cho phần prompt đã cache
- **Context length**: càng dài, KV cache càng tốn RAM trên GPU
> [!note] 📝
> Không cần hiểu sâu — chỉ cần biết: **prompt dài giống nhau ở đầu → API tự cache → trả tiền ít hơn**.

---

## 2️⃣ Session-level — Context Window

**Ở đâu:** Là giới hạn token LLM "nhìn thấy" trong 1 lần gọi.

**Là gì:** 
- GPT-4: 128K tokens
- Claude Sonnet: 200K tokens
- Claude 1M context: 1M tokens
- Gemini: 1-2M tokens

Tất cả input (system prompt + history + user message + tool results) phải **nhét vừa** context window. Quá thì bị cắt.

**Trade-off:**
| Context dài | Context ngắn |
|---|---|
| Nhớ được nhiều | Phải chọn lọc |
| Đắt hơn (O(n²) attention) | Rẻ hơn |
| Dễ "lost in the middle" | Tập trung tốt |

> [!tip] 💡
> **"Lost in the middle"**: model thường chú ý đầu + cuối prompt, bỏ qua giữa. Nhét càng nhiều không đồng nghĩa model dùng hết.

---

## 3️⃣ Conversation-level — Message History

**Ở đâu:** Trong app của bạn — list `messages=[...]` gửi kèm mỗi API call.

**Là gì:** App tự lưu toàn bộ lịch sử chat, rồi **gửi lại hết** mỗi lần gọi LLM.
```python
messages = [
  {"role": "user", "content": "Tên tôi là An"},
  {"role": "assistant", "content": "Chào An!"},
  {"role": "user", "content": "Tôi tên gì?"}  # ← LLM đọc được nhờ history
]
```

**Vấn đề:** Chat càng dài → history càng phình → đụng giới hạn context window.

**Cách giải quyết (memory strategies):**
| Strategy | Cách làm | Khi nào dùng |
|---|---|---|
| **Buffer** | Lưu hết | Chat ngắn |
| **Window** | Chỉ giữ N turn gần nhất | Chat dài, context recent đủ |
| **Summary** | Summarize lịch sử cũ, giữ chi tiết gần đây | Chat rất dài |
| **Token limit** | Cắt theo số token | Kiểm soát cost |

> [!note] 📝
> LangChain có sẵn: `ConversationBufferMemory`, `ConversationBufferWindowMemory`, `ConversationSummaryMemory`, `ConversationTokenBufferMemory`.

---

## 4️⃣ App-level — Long-term Memory

**Ở đâu:** Database bên ngoài — Vector DB, SQL, file system.

**Là gì:** Data vượt quá context window → lưu ngoài → khi cần thì **retrieve** phần liên quan rồi nhét vào prompt.

**Các dạng phổ biến:**

### RAG (Retrieval Augmented Generation)
- Document → chunk → embed → vector DB
- Query đến → tìm chunk liên quan → nhét vào prompt
- Đây là **long-term memory** cho knowledge.

### Episodic Memory (nhớ sự kiện)
- Lưu các event đã xảy ra: "user hỏi X vào ngày Y"
- Dùng vector DB hoặc SQL
- Ví dụ: "lần trước bạn bảo thích cafe đen"

### Semantic Memory (nhớ kiến thức)
- Facts về user hoặc world: "An là developer, thích Go"
- Có thể extract bằng LLM rồi lưu key-value
- Đây là cơ chế của **ChatGPT Memory**.

### Working Memory (scratchpad)
- Tạm lưu trong 1 task dài: kế hoạch, todo list
- Agent ghi ra file rồi đọc lại
- Claude Code làm theo kiểu này.

---

## 5️⃣ Product-level — Persistent Memory

**Ở đâu:** Tích hợp trong sản phẩm cuối, qua nhiều session.

**So sánh các sản phẩm:**

| Sản phẩm | Cách lưu | Gì được nhớ | Kiểm soát |
|---|---|---|---|
| **ChatGPT Memory** | Server OpenAI, trích "fact" | Sở thích, thông tin cá nhân | Xem/xóa trong settings |
| **Claude Projects** | File đính kèm + custom instructions | Document, context chung project | Upload/xóa thủ công |
| **Gemini Memory** | Giống ChatGPT | Preferences, facts | Settings |
| **Claude Code** | File `.md` trong local | Code preferences, user info, project context | Xem/sửa file trực tiếp |
| **MemGPT / Letta** | OS-style với "paging" | Hierarchy memory (core + archival) | API |

---

## 🎯 Claude Code Memory — Deep Dive

Claude Code (CLI bạn đang dùng) có hệ thống memory **file-based** rất minh bạch — không như ChatGPT/Claude web (đen). Tất cả đều là file `.md` trong máy bạn.

### 📂 Cấu trúc thư mục
```
~/.claude/projects/<project-slug>/memory/
├── MEMORY.md              ← Index, luôn được load vào context
├── feedback_vocabulary.md ← Memory riêng lẻ
├── user_role.md
├── project_auth.md
└── reference_slack.md
```

Với vault của bạn, đường dẫn là:
```
/Users/avada/.claude/projects/-Users-avada-Documents-Obsidian-Vault-dev-note/memory/
```

### 🔑 2 file cốt lõi

**1. `MEMORY.md` — Cái index (luôn load vào context)**

Đây là file **luôn được nhét vào system prompt** mỗi khi Claude Code khởi động. Nó chứa các dòng ngắn dạng:

```markdown
- [Vocabulary rules](feedback_vocabulary.md) — never auto-add words, only when user requests via /new-word
- [User role](user_role.md) — data scientist, new to React
- [Merge freeze](project_freeze.md) — freeze starts 2026-03-05
```

**Quy tắc:** 
- Giữ dưới 200 dòng (sau đó bị cắt)
- Mỗi dòng < 150 ký tự
- Chỉ là index — không chứa nội dung memory

**2. `<memory_name>.md` — Memory cụ thể (chỉ load khi cần)**

Mỗi memory là 1 file riêng với frontmatter:

```markdown
---
name: Vocabulary rules
description: Rules for adding words to Vocabulary.md
type: feedback
---

Never auto-add words, only when user explicitly requests via /new-word.

**Why:** User wants full control over vocabulary — automation caused noise.
**How to apply:** When user mentions a new word in chat, don't save it unless they invoke /new-word.
```

### 🏷️ 4 loại memory

| Type | Dùng cho | Ví dụ |
|---|---|---|
| **user** | Thông tin về user | "Senior Go dev, mới học React" |
| **feedback** | Rule/correction từ user | "Đừng mock DB trong test" |
| **project** | Context project, decisions | "Merge freeze từ 2026-03-05" |
| **reference** | Pointer đến external system | "Bugs tracked in Linear INGEST" |

### 🔄 Cơ chế hoạt động

```
User chat với Claude Code
        │
        ▼
┌─────────────────────────────┐
│ Mỗi lần khởi động:          │
│ 1. Load MEMORY.md vào prompt│
│ 2. Claude đọc index         │
│ 3. Nếu memory nào relevant: │
│    → Read file riêng        │
└─────────────┬───────────────┘
              │
              ▼
        Apply vào response
              │
              ▼
┌─────────────────────────────┐
│ Khi học được điều mới:      │
│ 1. Write file mới            │
│ 2. Thêm dòng vào MEMORY.md  │
└─────────────────────────────┘
```

### ✅ Tại sao cách này hay?

- **Minh bạch**: bạn đọc được file bất cứ lúc nào
- **Sửa được**: mở bằng editor, sửa thủ công
- **Version control**: có thể git commit
- **Portable**: chuyển máy chỉ cần copy folder
- **Kiểm soát**: xóa file = xóa memory, không cần UI settings

### ⚠️ Khác biệt với ChatGPT Memory

| Claude Code | ChatGPT Memory |
|---|---|
| File `.md` local | Server OpenAI |
| Xem được tất cả | Chỉ thấy tóm tắt |
| Sửa trực tiếp | Chỉ xóa được |
| Theo project | Toàn account |
| Có loại (user/feedback/project/reference) | Flat |

---

## 🗜️ Context Compaction — Khi context sắp "burn"

Khi chat dài, agent chạy lâu, hoặc xử lý nhiều tool results → **context window đầy dần**. Nếu không compact, bạn gặp:
- **Cost nổ** — mỗi request tốn thêm vì prompt phình
- **"Lost in the middle"** — model bỏ qua phần giữa
- **Crash** — vượt limit → API lỗi, phải cắt thô

### 🚨 Khi nào nên compact?

| Tình huống | Trigger | Hành động |
|---|---|---|
| Context > 70% limit | 140K/200K tokens | Summarize các turn cũ |
| Agent chạy > 10 tool calls | Tool results phình | Bỏ tool results cũ, giữ kết quả cuối |
| Cost mỗi request > threshold | Track token usage | Compact proactive |
| "Lost in the middle" xuất hiện | Model quên info giữa | Restructure: đưa info quan trọng ra đầu/cuối |

### 🛠️ 6 chiến lược compact (từ đơn giản đến thông minh)

**1. Truncation — Cắt thô**
- Bỏ N message cũ nhất
- **Ưu:** đơn giản, nhanh
- **Nhược:** mất context quan trọng nếu nằm ở đầu

**2. Sliding Window — Cửa sổ trượt**
- Luôn giữ N turn gần nhất
- **Ưu:** predictable size
- **Nhược:** mất hết context cũ

**3. Summarization — Tóm tắt**
- Dùng LLM summarize các turn cũ → nhét bản tóm tắt vào system prompt
- **Ưu:** giữ được ý chính
- **Nhược:** tốn 1 LLM call, có thể mất chi tiết

**4. Hierarchical Summary — Tóm tắt nhiều tầng**
- Turn cũ: summary ngắn gọn
- Turn gần: summary chi tiết hơn
- Turn mới nhất: giữ nguyên
- **Ưu:** balance giữa size và chi tiết
- **Dùng ở:** MemGPT, agent dài hạn

**5. Selective Retention — Giữ có chọn lọc**
- Đánh dấu message quan trọng (user preferences, decisions) → luôn giữ
- Message tầm phào (greetings, confirmations) → xóa đầu
- **Ưu:** thông minh nhất
- **Nhược:** cần logic phân loại (có thể dùng LLM classify)

**6. External Offload — Đẩy ra ngoài**
- Message cũ → embed → lưu vector DB
- Khi cần lại → retrieve
- **Ưu:** context window luôn gọn
- **Nhược:** phức tạp, cần retrieval đúng

### 🎯 Claude Code `/compact` — Compact tự động

Claude Code có sẵn cơ chế compact khi hội thoại dài:

```
Khi context gần đầy:
1. Detect: token usage > threshold
2. LLM tự summarize hội thoại cũ
3. Replace message history bằng summary
4. Giữ lại file đã đọc, tool results quan trọng gần đây
5. Báo user: "Conversation compacted"
```

**Gọi thủ công:** `/compact` trong prompt.

**Gì được giữ:**
- System prompt + CLAUDE.md + MEMORY.md (luôn load)
- Summary của hội thoại cũ
- Vài turn gần nhất nguyên bản
- File quan trọng đã Read

**Gì bị bỏ:**
- Tool outputs cũ (đã xử lý xong)
- Thinking blocks cũ
- Message tầm phào

### 💡 Best Practices

| Nguyên tắc | Tại sao |
|---|---|
| **Compact proactive, không phản ứng** | Đợi crash mới compact = quá muộn |
| **Giữ system prompt + memory** | Đây là "hiến pháp", mất là sai hành vi |
| **Giữ 2-3 turn gần nhất nguyên bản** | User vừa nói gì quan trọng hơn chi tiết hội thoại xa |
| **Summarize bằng LLM nhỏ/rẻ** | Đừng dùng Opus để summary — phí |
| **Log lại trước khi compact** | Để debug nếu sau này cần trace |
| **Test sau compact** | Hỏi lại model: "nhớ X không?" để verify |

### ⚠️ Sai lầm thường gặp

- **Summarize quá aggressively** → mất chi tiết quan trọng
- **Không giữ tool definitions** → agent "quên" cách dùng tool
- **Compact trong lúc agent đang loop** → agent confused
- **Dùng cùng 1 model lớn để summary** → tốn tiền vô lý

---

## 🧭 Decision Guide — Dùng tầng nào khi nào?

```
Bạn cần LLM nhớ gì?
│
├── Chỉ trong 1 câu hỏi ngắn? 
│   → Tầng 2 (nhét hết vào prompt)
│
├── Trong 1 cuộc hội thoại?
│   → Tầng 3 (message history)
│
├── Data lớn hơn context window?
│   → Tầng 4 (RAG / Vector DB)
│
├── User info/preferences qua nhiều session?
│   → Tầng 5 (Product memory)
│
└── Agent đang làm task dài, cần scratchpad?
    → Tầng 4 (file working memory)
```

---

## 📚 Thuật ngữ cần nhớ

- **Stateless** — Mỗi request là tờ giấy trắng, LLM không tự nhớ gì.
- **Context window** — Giới hạn token 1 lần gọi.
- **KV cache** — Cache attention ở tầng GPU.
- **Prompt caching** — Cache prompt để rẻ hơn.
- **Buffer / Window / Summary memory** — Strategy quản lý history.
- **RAG** — Retrieval cho long-term knowledge.
- **Episodic memory** — Nhớ sự kiện đã xảy ra.
- **Semantic memory** — Nhớ kiến thức, facts.
- **Working memory** — Scratchpad cho task dài.
- **Lost in the middle** — Model bỏ qua phần giữa prompt dài.
- **Context compaction** — Tóm tắt/cắt history khi context sắp đầy.
- **Sliding window** — Chỉ giữ N turn gần nhất.
- **Selective retention** — Giữ có chọn lọc các message quan trọng.

---

## 🎓 Mental Model

```
LLM = người bị mất trí nhớ ngắn hạn
      (không nhớ gì sau mỗi cuộc gặp)

Memory system = người thư ký
      (ghi chép lại, tóm tắt, đưa đúng ghi chú
       cho LLM đọc mỗi lần gặp)

App developer = người thiết kế văn phòng
      (quyết định thư ký ghi gì, lưu ở đâu,
       khi nào lôi ra cho LLM xem)
```

> [!tip] 💡
> Hiểu được mental model này, bạn sẽ thấy: **"AI có memory"** thực ra là **"app nhét context khéo"**. Không có magic — chỉ là kỹ thuật quản lý context cho tốt.
