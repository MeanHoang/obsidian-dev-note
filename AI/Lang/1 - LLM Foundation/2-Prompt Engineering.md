# 🎯 Prompt Engineering

> [!quote] 💬
> *"The prompt is the new programming language."*
> Prompt chính là cách bạn **lập trình cho AI** — viết prompt tốt = ra output tốt, viết prompt tệ = ra rác.

---
## 🧠 Prompt Engineering là gì?
Prompt Engineering là kỹ thuật **thiết kế câu lệnh (prompt)** để LLM trả về kết quả chính xác, đúng format, đúng ý mình muốn.
Không phải chỉ "hỏi cho đúng" — mà là hiểu **LLM nghĩ thế nào** để viết prompt **dẫn dắt nó đi đúng hướng**.

> [!note] 📝 So sánh dễ hiểu
> LLM giống như **nhân viên mới cực kỳ giỏi nhưng không biết gì về công ty bạn**.
> Prompt = bản brief bạn đưa cho nhân viên đó.
> Brief mù mờ → output mù mờ. Brief rõ ràng → output chất lượng.

---
## 🏗️ Cấu trúc 1 prompt tốt
Một prompt đầy đủ thường có 4 phần:
```
┌─────────────────────────────────────┐
│  1. ROLE      — Bạn là ai           │
│  2. CONTEXT   — Bối cảnh là gì      │
│  3. TASK      — Cần làm gì          │
│  4. FORMAT    — Output trông thế nào │
└─────────────────────────────────────┘
```
### Ví dụ áp dụng:
```
// ❌ Bad — không có context, không có format
"Viết email cho khách hàng"

// ✅ Good — đủ 4 phần
"Bạn là customer support lead của 1 công ty SaaS (ROLE).
Khách hàng vừa gặp lỗi không login được và đã gửi ticket 2 lần (CONTEXT).
Viết email xin lỗi và hướng dẫn cách fix (TASK).
Giọng văn chuyên nghiệp nhưng thân thiện, dưới 150 từ (FORMAT)."
```
> [!tip] 💡
> Không phải lúc nào cũng cần đủ 4 phần. Câu hỏi đơn giản thì TASK là đủ. Nhưng khi output không như ý → thêm dần ROLE, CONTEXT, FORMAT.

---
## 📚 Các kỹ thuật Prompt chính

### 1️⃣ Zero-shot Prompting
Hỏi thẳng, **không cho ví dụ**. LLM tự suy luận từ kiến thức có sẵn.
Sentiment = người ta **cảm thấy thế nào**
```
Phân loại sentiment của câu sau: "Sản phẩm tệ quá, không bao giờ mua lại"
→ Negative
```

**Khi nào dùng:** Task đơn giản, phổ biến mà LLM đã biết (dịch, tóm tắt, phân loại cơ bản...)
**Hạn chế:** Task phức tạp hoặc đặc thù → LLM dễ hiểu sai ý mình.

### 2️⃣ Few-shot Prompting
Cho **vài ví dụ mẫu** để LLM hiểu pattern mình muốn.
```
Chuyển tên sản phẩm thành slug:
- "Áo Thun Nam Trắng" → "ao-thun-nam-trang"
- "Giày Chạy Bộ Nike" → "giay-chay-bo-nike"
- "Túi Xách Da Nữ" → ?
```

LLM sẽ trả: `"tui-xach-da-nu"` — vì nó **học được pattern** từ 2 ví dụ trên.
**Khi nào dùng:** Khi muốn LLM follow 1 format/pattern cụ thể mà chỉ mô tả bằng lời khó chính xác.
**Mẹo:**
- 2-5 ví dụ thường là đủ
- Ví dụ phải **đa dạng** (cover các edge case)
- Ví dụ sai format → LLM cũng sẽ sai theo

> [!note] 📝 So sánh dễ hiểu
> Zero-shot = nói nhân viên "làm báo cáo đi" — tự hiểu.
> Few-shot = đưa 2-3 bản báo cáo mẫu rồi nói "làm giống vậy" — chính xác hơn nhiều.

### 3️⃣ Chain-of-Thought (CoT) Prompting
Bắt LLM **suy nghĩ từng bước** trước khi đưa ra câu trả lời cuối.
```
// ❌ Không có CoT — LLM hay sai với bài toán logic
"Một cửa hàng có 23 quả táo, bán 8 quả, nhập thêm 15 quả. Hỏi còn bao nhiêu?"

// ✅ Có CoT — bắt nghĩ từng bước
"Một cửa hàng có 23 quả táo, bán 8 quả, nhập thêm 15 quả. Hỏi còn bao nhiêu?
Hãy suy nghĩ từng bước."
```
LLM sẽ trả:
```
Bước 1: Ban đầu có 23 quả
Bước 2: Bán 8 quả → 23 - 8 = 15 quả
Bước 3: Nhập thêm 15 → 15 + 15 = 30 quả
→ Còn 30 quả táo.
```
**Khi nào dùng:** Toán, logic, phân tích phức tạp, so sánh nhiều option, debug code.
**Cách trigger đơn giản:** Thêm `"Hãy suy nghĩ từng bước"` hoặc `"Let's think step by step"` vào cuối prompt.

> [!tip] 💡
> CoT tốn nhiều token hơn nhưng **chính xác hơn đáng kể** cho task phức tạp. Đánh đổi token lấy quality.

### 4️⃣ System Prompt
Prompt **đặt ở đầu conversation**, định nghĩa "nhân cách" và quy tắc xuyên suốt cho LLM.
```
// System prompt
"Bạn là 1 senior backend engineer chuyên Node.js.
Khi trả lời:
- Luôn kèm code example
- Giải thích ngắn gọn, không dài dòng
- Nếu có nhiều cách, nêu trade-off
- Dùng TypeScript, không dùng JavaScript"

// User prompt
"Làm sao để handle error trong Express?"
```

**System prompt khác user prompt thế nào?**

| | System Prompt | User Prompt |
|---|---|---|
| **Vị trí** | Đầu conversation, set 1 lần | Mỗi tin nhắn của user |
| **Mục đích** | Định nghĩa behavior xuyên suốt | Yêu cầu cụ thể từng lần |
| **Ví dụ** | "Bạn là chuyên gia Python" | "Viết hàm sort list" |
| **Thay đổi** | Ít thay đổi | Thay đổi mỗi lượt |

> [!note] 📝 So sánh dễ hiểu
> System prompt = **bản mô tả công việc (JD)** — set expectation từ đầu.
> User prompt = **task hàng ngày** được giao — thay đổi liên tục.

### 5️⃣ Role Prompting
Gán **vai trò cụ thể** cho LLM để nó trả lời từ góc nhìn chuyên gia.
```
// Cùng 1 câu hỏi, vai trò khác → output khác

"Bạn là security engineer. Review đoạn code này."
→ Focus vào lỗ hổng bảo mật, injection, authentication...

"Bạn là performance engineer. Review đoạn code này."
→ Focus vào bottleneck, memory leak, query optimization...

"Bạn là junior dev mới học. Giải thích đoạn code này."
→ Giải thích đơn giản, từ cơ bản, không dùng thuật ngữ phức tạp
```
**Khi nào dùng:** Khi cần output từ 1 góc nhìn chuyên môn cụ thể.

---
## 🎛️ Các tham số quan trọng
### 🌡️ Temperature
Kiểm soát **mức độ "sáng tạo"** (độ ngẫu nhiên) của LLM. Giá trị từ **0 → 2** (tùy provider).

> [!note] 📝 So sánh dễ hiểu
> Tưởng tượng hỏi đầu bếp "nấu phở cho tôi":
> - **Temperature 0** = nấu đúng công thức, lần nào cũng y chang
> - **Temperature 0.5** = nấu theo công thức nhưng thỉnh thoảng thêm chút gia vị riêng
> - **Temperature 1.0+** = sáng tạo lung tung — có khi cho phở vào blender làm smoothie 🍜

#### Cách hoạt động
LLM chọn token (từ) tiếp theo dựa trên **xác suất**. Temperature quyết định cách chọn:
- **Thấp (0 - 0.3):** Luôn chọn token xác suất cao nhất → kết quả ổn định, lặp lại được
- **Cao (0.8+):** Cho token xác suất thấp cơ hội được chọn → đa dạng, nhưng dễ lan man hoặc "ảo"
#### Bảng chọn Temperature theo use case

| Giá trị       | Behavior                                          | Dùng khi                                      |
| ------------- | ------------------------------------------------- | --------------------------------------------- |
| **0**         | Deterministic — luôn chọn từ có xác suất cao nhất | Code generation, factual Q&A, data extraction |
| **0.3 - 0.7** | Cân bằng — có chút sáng tạo nhưng vẫn ổn định     | Viết email, tóm tắt, chat thông thường        |
| **0.8 - 1.0** | Sáng tạo — output đa dạng, ít dự đoán được        | Brainstorming, viết truyện, tạo ý tưởng       |
| **1.0+**      | Rất ngẫu nhiên — output khó kiểm soát             | Thí nghiệm, test edge case                    |

#### Ví dụ code khi gọi API
```python
# ✅ Good — Temperature thấp cho coding task
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    temperature=0.2,        # thấp → code chính xác, ít lan man
    max_tokens=1024,
    messages=[{"role": "user", "content": "Viết hàm binary search"}]
)

# ❌ Bad — Temperature cao cho coding task
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    temperature=1.5,        # cao → AI "sáng tạo" thêm code không cần thiết
    max_tokens=4096,
    messages=[{"role": "user", "content": "Viết hàm binary search"}]
)
```
#### Mặc định của các tool phổ biến

| Tool | Default temperature | User chỉnh được? |
|---|---|---|
| ChatGPT web | ~1.0 | Không |
| Claude web | Tự chọn phù hợp | Không |
| OpenAI API | 1.0 | Có (0 - 2) |
| Anthropic API | 1.0 | Có (0 - 1) |
| GitHub Copilot | ~0.2 | Không |

> [!warning] ⚠️ AI coding trả lời lan man?
> Không chỉ do temperature — còn vì:
> 1. **`max_tokens` quá cao** — cho phép viết dài, nó sẽ viết dài
> 2. **Prompt không rõ** — không nói "chỉ code, không giải thích" thì AI sẽ giải thích
> 3. **Không có system prompt** — không đặt luật "ngắn gọn" thì AI mặc định nói nhiều
>
> **Fix:** Thêm system prompt: *"Trả lời ngắn gọn. Chỉ đưa code, không giải thích trừ khi được hỏi."*

> [!tip] 💡
> **Không cần set temperature trước khi dùng AI tool.** Mỗi tool đã có default phù hợp. Chỉ cần chỉnh khi dùng API và muốn kiểm soát chặt output.

### 🎯 Top-p (Nucleus Sampling)
Giới hạn LLM chỉ chọn từ các token có **tổng xác suất ≤ p**.
- `top_p = 0.1` → chỉ chọn từ top 10% token có xác suất cao nhất → output an toàn
- `top_p = 0.9` → chọn từ top 90% → output đa dạng hơn

> [!tip] 💡
> Thường chỉnh **1 trong 2**: temperature HOẶC top_p. Chỉnh cả 2 cùng lúc dễ ra output khó kiểm soát.

### 📏 Max Tokens
Giới hạn **độ dài output**. Không ảnh hưởng chất lượng, chỉ cắt output khi đạt limit.

### 🚫 Stop Sequences
Bảo LLM **dừng lại** khi gặp chuỗi ký tự nhất định. Hữu ích khi muốn kiểm soát output chặt.

---

## ⚡ Kỹ thuật nâng cao
### 🔗 Prompt Chaining
Chia task lớn thành **nhiều prompt nhỏ**, output prompt trước = input prompt sau.
```
Prompt 1: "Phân tích requirements từ đoạn text này → trả ra JSON"
     ↓ output
Prompt 2: "Từ requirements này, thiết kế database schema"
     ↓ output
Prompt 3: "Từ schema này, viết migration SQL"
```
**Khi nào dùng:** Task quá phức tạp cho 1 prompt duy nhất. Chia nhỏ = kiểm soát tốt hơn, dễ debug hơn.

### 🧩 Self-Consistency
Chạy **cùng 1 prompt nhiều lần**, lấy kết quả xuất hiện nhiều nhất (majority vote).
```
Chạy 5 lần → 3 lần ra "A", 2 lần ra "B" → chọn "A"
```
**Khi nào dùng:** Task quan trọng cần độ chính xác cao (phân loại, tính toán...).
**Trade-off:** Tốn gấp N lần token/tiền.

### 🌳 Tree of Thought (ToT)
Mở rộng CoT — thay vì 1 đường suy nghĩ, LLM **explore nhiều hướng**, đánh giá từng hướng, chọn hướng tốt nhất.
```
Vấn đề: "Thiết kế database cho e-commerce"

Hướng 1: Normalized schema → đánh giá: query phức tạp nhưng data integrity tốt
Hướng 2: Denormalized schema → đánh giá: query nhanh nhưng data có thể inconsistent
Hướng 3: Hybrid → đánh giá: cân bằng cả 2 ✅

→ Chọn hướng 3 và đi sâu
```

### 📐 Output Formatting
Bắt LLM trả output theo **format cụ thể** — rất quan trọng khi build app.
```
"Phân tích sentiment của review sau. Trả về JSON với format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0 - 1.0,
  "keywords": ["từ khóa chính"]
}

Review: 'Sản phẩm đẹp nhưng giao hàng chậm quá'"
```

> [!tip] 💡
> Luôn cho **ví dụ output mẫu** khi yêu cầu format cụ thể. LLM follow example tốt hơn follow mô tả.

---
## 🚫 Anti-patterns — những lỗi thường gặp

| Lỗi                        | Ví dụ                               | Fix                                                                  |
| -------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| 🙅 **Quá mơ hồ**           | "Viết code cho tốt"                 | Cụ thể: "Viết REST API endpoint tạo order bằng Express + TypeScript" |
| 📖 **Quá dài dòng**        | Prompt 2000 từ cho task đơn giản    | Ngắn gọn, chỉ giữ thông tin cần thiết                                |
| 🤯 **Nhồi quá nhiều task** | "Viết code, test, deploy, viết doc" | Chia ra, mỗi prompt 1 task                                           |
| 🚫 **Chỉ nói "đừng"**      | "Đừng viết code dở"                 | Nói rõ mình muốn gì: "Viết code có error handling, có type"          |
| 📋 **Không cho ví dụ**     | "Trả về đúng format"                | Cho 1-2 ví dụ output mẫu                                             |
| 🔄 **Không iterate**       | Prompt đầu tiên không ổn → bỏ luôn  | Sửa prompt, thêm context, thử lại                                    |

---

## 🔄 Quy trình iterate prompt

```
Viết prompt v1 → Test → Output chưa ổn?
                          ↓ Có
              Phân tích: sai ở đâu?
              ├── Thiếu context → thêm CONTEXT
              ├── Sai format → thêm ví dụ FORMAT
              ├── Hiểu sai ý → thêm ROLE hoặc rephrase TASK
              └── Quá chung → thêm constraints
                          ↓
              Viết prompt v2 → Test lại → ...
```

> [!tip] 💡
> **Prompt engineering là iterative, không phải one-shot.**
> Prompt đầu tiên hiếm khi hoàn hảo. Mỗi lần sửa, ghi lại cái gì improve để lần sau không lặp lại.

---

## ✅ Checklist viết prompt
- [ ] Có rõ **TASK** — mình muốn LLM làm gì?
- [ ] Có đủ **CONTEXT** — LLM có đủ thông tin để trả lời đúng không?
- [ ] Có **FORMAT** mong muốn — mình muốn output trông thế nào?
- [ ] Đã cho **ví dụ** chưa — nếu task đặc thù?
- [ ] **Temperature** có phù hợp — creative task hay precise task?
- [ ] Đã **test và iterate** chưa — output đã đúng ý chưa?
