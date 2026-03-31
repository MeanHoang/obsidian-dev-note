# 🏁 Phase 1 Recap — Tổng kết nền tảng LLM

> [!quote] 💬
> *"Frameworks thay đổi mỗi tháng — kiến thức nền tảng thì không. Hiểu bản chất trước, dùng tool sau."*

---
## 🎯 Phase 1 là gì?
Phase 1 là **nền tảng của mọi thứ** — hiểu LLM hoạt động thế nào, gọi API trực tiếp, viết prompt hiệu quả, ép output đúng format, và biết giới hạn để không mù quáng tin AI. **Không dùng framework nào** — tất cả bằng tay.

> [!note] 📝 So sánh dễ hiểu
> Phase 1 giống **học lái số sàn trước khi lái số tự động**.
> Số tự động (framework) tiện hơn, nhưng nếu không hiểu côn/số/ga → khi xe hỏng giữa đường thì bó tay.
> Hiểu nền tảng = debug được mọi thứ ở các phase sau.

---
## 🗺️ Bức tranh tổng thể — 5 topic đã học

```
┌─────────────────────────────────────────────────────────────┐
│                    Phase 1: LLM Foundation                  │
│                                                             │
│  ┌──────────────┐    ┌───────────────────┐                  │
│  │ LLM Overview │───→│ Prompt Engineering│                  │
│  │ LLM là gì,   │    │ Viết prompt sao   │                  │
│  │ hoạt động     │    │ cho LLM hiểu đúng │                  │
│  │ thế nào       │    └────────┬──────────┘                  │
│  └──────────────┘             │                             │
│                               ▼                             │
│  ┌──────────────┐    ┌───────────────────┐                  │
│  │ LLM          │←───│ API Integration   │                  │
│  │ Limitations  │    │ Gọi API trực tiếp  │                  │
│  │ Giới hạn &   │    │ OpenAI / Anthropic │                  │
│  │ rủi ro       │    └────────┬──────────┘                  │
│  └──────────────┘             │                             │
│                               ▼                             │
│                      ┌───────────────────┐                  │
│                      │ Structured Output │                  │
│                      │ Ép LLM trả JSON   │                  │
│                      │ đúng format        │                  │
│                      └───────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---
## 📖 Tóm tắt từng topic

### 1️⃣ [[0-LLM Overview]] — LLM là gì & hoạt động thế nào
**Core insight:** LLM **không hiểu** — nó **dự đoán token tiếp theo** dựa trên pattern thống kê. Đúng vì pattern đúng, không phải vì nó "biết".

| Concept | Một dòng tóm tắt |
|---|---|
| **Token** | Đơn vị text nhỏ nhất LLM xử lý — tiếng Việt tốn token hơn tiếng Anh |
| **Context window** | Bộ nhớ ngắn hạn — mọi thứ LLM "nhìn thấy" mỗi lần gọi |
| **Stateless** | Không nhớ gì giữa các request — phải gửi lại history mỗi lần |
| **Autoregressive** | Sinh text từng token một, token sau phụ thuộc token trước |
| **Closed vs Open** | Closed (Claude, GPT) = mạnh, qua API. Open (LLaMA, Mistral) = chạy local |

> [!tip] 💡
> Thiết kế app để **dễ swap model** — model mới ra liên tục, đừng "cưới" 1 model.

---
### 2️⃣ [[2-Prompt Engineering]] — Viết prompt hiệu quả
**Core insight:** Prompt = cách lập trình cho AI. Prompt tốt = output tốt. Prompt tệ = rác.

**4 thành phần của prompt tốt:**
```
ROLE    → Bạn là ai (senior engineer, data analyst...)
CONTEXT → Bối cảnh là gì
TASK    → Cần làm gì
FORMAT  → Output trông thế nào
```

**5 kỹ thuật chính:**

| Kỹ thuật | Khi nào dùng | Ví dụ trigger |
|---|---|---|
| **Zero-shot** | Task đơn giản, phổ biến | Hỏi thẳng, không ví dụ |
| **Few-shot** | Cần LLM follow pattern cụ thể | Cho 2-3 ví dụ mẫu |
| **Chain-of-Thought** | Toán, logic, phân tích phức tạp | "Hãy suy nghĩ từng bước" |
| **System Prompt** | Set behavior xuyên suốt conversation | Đặt 1 lần ở đầu |
| **Role Prompting** | Cần output từ góc nhìn chuyên gia | "Bạn là security engineer" |

**Tham số quan trọng:**
- **Temperature** — mức ngẫu nhiên: 0 = chính xác, 0.7 = cân bằng, 1.0+ = sáng tạo
- **Top-p** — giới hạn pool token. Chỉ chỉnh 1 trong 2 (temperature hoặc top-p)
- **Max tokens** — giới hạn độ dài output

> [!warning] ⚠️
> Prompt engineering là **iterative** — prompt đầu tiên hiếm khi hoàn hảo. Test → phân tích sai ở đâu → sửa → test lại.

---
### 3️⃣ [[3-API Integration]] — Gọi LLM API trực tiếp
**Core insight:** Hiểu cách gọi API = hiểu chuyện gì xảy ra bên dưới. Framework chỉ là wrapper.

**Pattern chung mọi LLM API:**
```python
# Gửi
request = {
    "model": "tên model",
    "messages": [system + user + assistant],  # hội thoại
    "temperature": 0.7,
    "max_tokens": 500
}

# Nhận
response = {
    "content": "text trả lời",
    "usage": {"input_tokens": X, "output_tokens": Y},  # tính tiền
    "stop_reason": "end_turn"
}
```

**Những điều quan trọng:**
- **Messages array** = cách duy trì hội thoại (LLM stateless, phải gửi lại history)
- **Streaming** = nhận response từng chunk → UX tốt hơn (không giảm tổng thời gian)
- **Cost** = `(input_tokens × giá) + (output_tokens × giá)` — output đắt hơn input 3-5x
- **Error handling** = rate limit (429), auth (401), server error (500) — SDK đã có auto-retry

---
### 4️⃣ [[1-Structured Output]] — Bắt LLM trả đúng format
**Core insight:** App cần JSON, không cần văn xuôi. Structured Output = ép LLM trả data có cấu trúc mà code parse được.

**3 cách, từ đơn giản → tin cậy:**

| Cách | Độ tin cậy | Khi nào dùng |
|---|---|---|
| **Prompt-based** — mô tả format trong prompt | Thấp | Prototype, test nhanh |
| **JSON Mode** — bật flag `response_format` | Trung bình | Cần valid JSON, schema linh hoạt |
| **Schema Enforcement** — định nghĩa JSON Schema | Cao | **Production** — đảm bảo đúng schema 100% |

**Anthropic trick:** Dùng tool use — định nghĩa tool với `input_schema` + `tool_choice` force gọi → LLM buộc trả JSON đúng schema.

> [!tip] 💡
> Dù dùng cách nào, **luôn validate phía app** bằng Pydantic. LLM có thể trả đúng format nhưng sai logic (rating = 999).

---
### 5️⃣ [[4-LLM Limitations]] — Giới hạn cần biết
**Core insight:** LLM rất giỏi nhưng **không hoàn hảo**. Biết giới hạn = thiết kế hệ thống đúng cách.

| Giới hạn | Vấn đề | Cách giảm thiểu |
|---|---|---|
| **Hallucination** | Bịa rất tự tin | RAG, temperature thấp, "nếu không biết thì nói không biết" |
| **Context window** | Bộ nhớ có giới hạn | Chunk + chỉ gửi phần liên quan, tránh "lost in the middle" |
| **Latency** | Chậm hơn code truyền thống | Streaming, model nhỏ, cache, parallel calls |
| **Cost** | Token cộng dồn nhanh | Model routing, prompt caching, batch API |
| **Non-determinism** | Cùng input, khác output | Test thuộc tính (không test exact text), structured output |
| **Security** | Prompt injection | Least privilege, input sanitize, human-in-the-loop |

> [!danger] ⛔
> Prompt injection hiện tại là **bài toán chưa giải được hoàn toàn**. Không có prompt nào chống injection 100% — phải thiết kế defense in depth.

---
## 🔑 Mental Model — Tư duy xuyên suốt Phase 1

```
LLM = calculator siêu giỏi cho ngôn ngữ
├── Input: text (prompt + context + history)
├── Process: dự đoán token tiếp theo (xác suất)
├── Output: text (có thể ép thành JSON)
├── Giới hạn: bịa, chậm, tốn tiền, không nhớ
└── Developer job: điều khiển input/output để ra kết quả mong muốn
```

**3 nguyên tắc vàng từ Phase 1:**
1. **LLM không hiểu — nó dự đoán.** Đừng anthropomorphize (gán tính người cho AI). Nó đúng vì pattern, không phải vì "biết".
2. **Prompt là code.** Viết prompt = lập trình. Cần iterate, test, version control như code thật.
3. **Trust but verify.** Dùng LLM cho draft, nhưng luôn validate output trước khi đưa vào production.

---
## 🚀 Sẵn sàng cho Phase 2?

Phase 1 cho bạn **hiểu LLM và điều khiển nó**. Phase 2 sẽ cho LLM **làm được việc thật**:

| Phase 1 (đã học) | Phase 2 (sắp học) |
|---|---|
| LLM trả text/JSON | LLM **gọi function**, chọn tool |
| Bạn gọi API → nhận response | LLM tự quyết định gọi API nào |
| 1 prompt → 1 response | Tool chaining: gọi tool A → lấy kết quả → gọi tool B |
| Data trong prompt | RAG: LLM đọc data bên ngoài (vector DB) |

> [!note] 📝 So sánh dễ hiểu
> Phase 1 = dạy LLM **nói** (trả lời câu hỏi, trả JSON).
> Phase 2 = dạy LLM **làm** (gọi API, query database, search web).
> Từ "chatbot" → "agent" — đây là bước nhảy lớn nhất.

---
## 📚 Tham khảo
### Tổng hợp kiến thức nền tảng
- 🔥 [The Realistic Guide to Mastering AI Agents in 2026](https://www.decodingai.com/p/realistic-guide-to-ai-agents-in-2026) — Roadmap thực tế cho developer muốn build AI agent, nhấn mạnh việc nắm vững fundamentals trước khi dùng framework. Nếu hiểu rõ Phase 1, bạn đã đi đúng hướng.
- [Everything You Need to Know Before Building AI Agents](https://bigdataboutique.com/blog/everything-you-need-to-know-before-building-ai-agents) — Tổng hợp các building block cốt lõi (memory, planning, tools) mà mọi agent đều cần. Giúp thấy Phase 1 connect thế nào với các phase sau.
- [The Prompt Engineering Playbook for Programmers](https://addyo.substack.com/p/the-prompt-engineering-playbook-for) — Tập hợp kỹ thuật prompt engineering thực chiến cho developer, từ Addy Osmani (Google). Nhiều ví dụ code thực tế.

### Đào sâu từng topic
- [Prompt Engineering Guide](https://www.promptingguide.ai/) — Tài liệu tham khảo toàn diện nhất về prompt engineering, cover từ cơ bản đến nâng cao (CoT, ToT, self-consistency). Cộng đồng đông, cập nhật thường xuyên.
- [Real Python — Practical Prompt Engineering](https://realpython.com/practical-prompt-engineering/) — Tutorial hands-on bằng Python, đi từ basic prompting đến structured output. Phù hợp nếu muốn ôn lại bằng code thực hành.

---
## ✅ Checklist — Phase 1 hoàn thành?

### LLM Overview
- [ ] Hiểu LLM sinh text bằng **dự đoán token tiếp theo** (autoregressive)
- [ ] Hiểu **stateless** — phải gửi lại history mỗi request
- [ ] Biết phân biệt closed-source vs open-weights vs reasoning model

### Prompt Engineering
- [ ] Viết được prompt có đủ ROLE + CONTEXT + TASK + FORMAT
- [ ] Dùng được zero-shot, few-shot, chain-of-thought tùy tình huống
- [ ] Biết chỉnh temperature / top-p cho đúng use case

### API Integration
- [ ] Gọi được API bằng SDK (OpenAI hoặc Anthropic) — không qua framework
- [ ] Hiểu messages array (system/user/assistant) và cách duy trì hội thoại
- [ ] Biết dùng streaming và tính toán chi phí token

### Structured Output
- [ ] Biết 3 cách: prompt-based → JSON mode → schema enforcement
- [ ] Dùng được Anthropic tool use trick hoặc OpenAI json_schema
- [ ] Biết validate output bằng Pydantic

### LLM Limitations
- [ ] Hiểu hallucination và cách giảm thiểu (RAG, verify, "nói không biết")
- [ ] Hiểu prompt injection là **chưa giải được hoàn toàn**
- [ ] Biết khi nào **nên và không nên** dùng LLM

> [!tip] 💡
> Nếu tick được hết checklist trên → bạn đã sẵn sàng cho [[Road map#Phase 2 🔧 Tools & Function Calling (2 tuần) ← Quan trọng nhất|Phase 2: Tools & Function Calling]] — nơi LLM bắt đầu **làm việc thật**, không chỉ chat.
