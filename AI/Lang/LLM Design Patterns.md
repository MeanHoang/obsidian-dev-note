# 🧩 LLM Design Patterns — 7 patterns khi build LLM app thật

> [!quote] 💬
> *"Đừng chỉ làm cho LLM chạy được — hãy làm cho nó chạy đúng, chạy nhanh, chạy rẻ, và chạy an toàn."*

---
## 🎯 LLM Design Patterns là gì?
Tập hợp **7 patterns** (mẫu thiết kế) được đúc kết từ thực tế build LLM app ở production. Không phải lý thuyết — đây là những bài học từ các team đã ship sản phẩm AI thật.

> [!note] 📝 So sánh dễ hiểu
> Giống **7 bước kiểm tra trước khi mở nhà hàng**:
> Nấu ngon (LLM giỏi) chưa đủ — còn phải: đo chất lượng món ăn (Evals), có nguồn nguyên liệu tươi (RAG), đầu bếp chuyên món (Fine-tuning), phục vụ nhanh (Caching), không để khách bị ngộ độc (Guardrails), menu rõ ràng (Defensive UX), và lắng nghe feedback khách (User Feedback).

---
## 🗺️ Bức tranh tổng thể

```
┌─────────────────────────────────────────────────┐
│              LLM App Production                 │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌──────────────┐    │
│  │  Evals  │  │   RAG   │  │ Fine-tuning  │    │
│  │  đo     │  │  thêm   │  │ train thêm   │    │
│  │  chất   │  │  data   │  │ cho giỏi hơn │    │
│  │  lượng  │  │  ngoài  │  │              │    │
│  └─────────┘  └─────────┘  └──────────────┘    │
│                                                 │
│  ┌─────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Caching │  │  Guardrails  │  │ Defensive │  │
│  │ nhanh   │  │  kiểm tra    │  │    UX     │  │
│  │ + rẻ    │  │  output      │  │ UI thông  │  │
│  │         │  │  an toàn     │  │ minh      │  │
│  └─────────┘  └──────────────┘  └───────────┘  │
│                                                 │
│          ┌────────────────────┐                  │
│          │  User Feedback     │                  │
│          │  thu feedback →    │                  │
│          │  cải thiện liên tục│                  │
│          └────────────────────┘                  │
└─────────────────────────────────────────────────┘
```

---
## 📖 7 Patterns chi tiết

### 1️⃣ Evals — Đo chất lượng output
**Vấn đề:** Làm sao biết LLM đang trả lời tốt hay tệ? Không có unit test truyền thống cho AI.
**Giải pháp:** Xây hệ thống đánh giá (evaluation) cho từng task cụ thể.

**3 cách eval phổ biến:**

| Cách | Ví dụ | Khi nào dùng |
|---|---|---|
| **Metric-based** | BLEU, ROUGE, BERTScore | So sánh output với đáp án chuẩn |
| **LLM-as-judge** | Dùng GPT-4 chấm điểm output | Không có đáp án chuẩn, cần đánh giá chất lượng |
| **Human eval** | Người đọc và chấm | Task chủ quan, cần độ chính xác cao |

```python
# ❌ Bad — không eval, "chạy được là xong"
response = call_llm("Tóm tắt bài viết này")
save_to_db(response)  # không biết tóm tắt tốt hay tệ

# ✅ Good — eval trước khi ship
response = call_llm("Tóm tắt bài viết này")
score = eval_summary(response, original_text)  # đo chất lượng
if score < threshold:
    log_for_review(response)  # flag để review
```

> [!tip] 💡
> Eval nên chạy **từ sớm và liên tục** — không phải cuối project. Mỗi khi đổi prompt, đổi model → chạy eval lại. Xem thêm [[Road map#Phase 5 📊 Evaluation & Testing|Phase 5]].

---
### 2️⃣ RAG — Cho LLM đọc data của mình
**Vấn đề:** LLM chỉ biết data training — không biết data riêng của công ty bạn.
**Giải pháp:** **Retrieval Augmented Generation** — tìm document liên quan → nhét vào prompt → LLM trả lời dựa trên data thật.

```
User: "Chính sách nghỉ phép công ty mình thế nào?"
         │
         ▼
    Search vector DB → tìm document "HR Policy v3.2"
         │
         ▼
    Prompt: "Dựa trên tài liệu sau, trả lời câu hỏi: {document} + {question}"
         │
         ▼
    LLM trả lời chính xác dựa trên document thật
```

**Thành phần chính:**
- **Embedding** — chuyển text thành vector số
- **Vector Store** — lưu và tìm kiếm vector (Pinecone, Chroma, pgvector)
- **Chunking** — chia document lớn thành đoạn nhỏ vừa đủ
- **Retrieval** — tìm đúng đoạn liên quan nhất

> [!warning] ⚠️
> RAG giảm hallucination nhưng **không loại bỏ hoàn toàn**. LLM vẫn có thể bịa thêm hoặc hiểu sai document. Luôn cần validation layer phía sau.

---
### 3️⃣ Fine-tuning — Train thêm cho task cụ thể
**Vấn đề:** Prompt engineering có giới hạn — một số task cần model "hiểu sâu" hơn.
**Giải pháp:** Train thêm model trên data của mình (instruction + output mẫu).

| Kỹ thuật | Ý nghĩa | Cost |
|---|---|---|
| **Full fine-tuning** | Train lại toàn bộ model | Rất đắt (nhiều GPU) |
| **LoRA / QLoRA** | Chỉ train thêm một phần nhỏ params | Rẻ hơn nhiều |
| **Instruction tuning** | Train trên cặp instruction → output | Phổ biến nhất |

**Khi nào dùng fine-tuning vs RAG vs prompting?**

| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| **Khi nào** | Task phổ biến, ít data | Cần data mới, cập nhật thường xuyên | Cần style/format rất cụ thể |
| **Cost** | Thấp | Trung bình (vector DB) | Cao (training) |
| **Ví dụ** | Tóm tắt, dịch thuật | Q&A trên docs công ty | Viết code theo style riêng |

> [!tip] 💡
> **Thử prompting → RAG → fine-tuning** — theo thứ tự từ rẻ đến đắt. Chỉ fine-tune khi 2 cách kia không đủ.

---
### 4️⃣ Caching — Nhanh hơn, rẻ hơn
**Vấn đề:** Gọi LLM chậm (2-10 giây) và tốn tiền. Nhiều user hỏi câu giống nhau.
**Giải pháp:** Lưu response cũ, câu hỏi giống → trả kết quả cache, không gọi LLM lại.

**2 loại cache:**

| Loại | Cách hoạt động | Ví dụ |
|---|---|---|
| **Exact match** | Cùng input y chang → trả cache | FAQ, câu hỏi lặp lại |
| **Semantic cache** | Input *giống ý* → trả cache | "thời tiết HN" ≈ "HN hôm nay bao nhiêu độ" |

```python
# ❌ Bad — gọi LLM mỗi lần, kể cả câu hỏi lặp
response = call_llm(user_question)

# ✅ Good — check cache trước
cached = cache.get(user_question)  # exact hoặc semantic match
if cached:
    return cached  # 0 token cost, ~0ms latency
response = call_llm(user_question)
cache.set(user_question, response, ttl=3600)  # cache 1 giờ
return response
```

> [!tip] 💡
> **Prompt caching** của OpenAI/Anthropic là cache khác — cache ở tầng provider, tự động cache prefix giống nhau giữa các request, giảm 50-90% input cost. Không cần code gì thêm.

---
### 5️⃣ Guardrails — Kiểm tra output an toàn
**Vấn đề:** LLM có thể trả output sai format, chứa nội dung độc hại, hoặc bịa thông tin.
**Giải pháp:** Đặt "rào chắn" kiểm tra cả input và output.

```
User input → [Input Guardrail] → LLM → [Output Guardrail] → User
                 │                              │
                 ├── Block prompt injection      ├── Valid JSON?
                 ├── Filter nội dung xấu         ├── Có nội dung harmful?
                 └── Kiểm tra độ dài             └── Có hallucination?
```

**Các loại guardrail:**

| Loại | Kiểm tra gì | Ví dụ tool |
|---|---|---|
| **Structural** | Output đúng format (JSON, SQL...) | JSON Schema, Pydantic |
| **Content safety** | Không có nội dung độc hại | Moderation API, keyword filter |
| **Factuality** | Không bịa thông tin | LLM-based fact check, citation check |
| **Input filter** | Block prompt injection, nội dung xấu | Regex filter, classifier |

```python
# ❌ Bad — trust LLM hoàn toàn
response = call_llm(user_input)
return response  # có thể chứa nội dung xấu hoặc sai format

# ✅ Good — guardrails cả input lẫn output
if is_prompt_injection(user_input):  # input guardrail
    return "Không thể xử lý yêu cầu này."
response = call_llm(user_input)
if not is_valid_json(response):       # structural guardrail
    response = call_llm(user_input, retry=True)
if contains_harmful_content(response): # safety guardrail
    return "Xin lỗi, không thể trả lời."
return response
```

---
### 6️⃣ Defensive UX — UI biết AI có thể sai
**Vấn đề:** User nghĩ AI luôn đúng → tin mù quáng → hậu quả.
**Giải pháp:** Thiết kế UI **thừa nhận AI có giới hạn** — set expectation đúng.

**Nguyên tắc chính:**

| Nguyên tắc | Cách làm | Ví dụ |
|---|---|---|
| **Disclaimer** | Nói rõ AI có thể sai | "Kết quả chỉ mang tính tham khảo" |
| **Citation** | Trích nguồn để user verify | "Theo tài liệu X, trang Y..." |
| **Confidence** | Hiển thị độ tự tin | "Độ chính xác ước tính: 85%" |
| **Easy dismiss** | Dễ bỏ qua kết quả sai | Nút "Không chính xác" / regenerate |
| **Familiar UX** | Dựa trên pattern quen thuộc | Autocomplete thay vì chat cho task đơn giản |

> [!tip] 💡
> **Không phải mọi thứ cần chat interface.** Autocomplete, dropdown gợi ý, hay fill-in-the-blank có thể hiệu quả hơn chatbot cho nhiều use case.

---
### 7️⃣ User Feedback — Thu feedback để cải thiện
**Vấn đề:** Làm sao biết user hài lòng không? Model có đang tốt lên không?
**Giải pháp:** Thu feedback → dùng để improve model, prompt, guardrails.

| Loại | Cách thu | Ví dụ |
|---|---|---|
| **Explicit** | User chủ động đánh giá | 👍👎, rating, "Không chính xác" |
| **Implicit** | Đo behavior | Accept rate, regenerate rate, thời gian đọc |

```
User feedback → Cải thiện gì?
     │
     ├── Feedback xấu nhiều → sửa prompt / đổi model
     ├── Regenerate nhiều → output chưa tốt → thêm guardrails
     ├── Accept rate cao → model đang ổn, giữ nguyên
     └── Tích lũy data → fine-tune hoặc cải thiện RAG
```

> [!warning] ⚠️
> **Phải dễ feedback.** Nếu user phải bấm 5 bước để báo sai → không ai báo → bạn nghĩ model đang tốt nhưng thật ra không. 1 nút 👎 là đủ.

---
## 🔄 7 patterns kết nối thế nào?

```
                    ┌──── Evals ────┐
                    │  (đo liên tục) │
                    └───────┬───────┘
                            │
User Input ─→ Guardrails ─→ LLM ─→ Guardrails ─→ Output
                  │          │          │
              RAG ┘    Fine-tuning   Caching
                           │
                    User Feedback
                    (cải thiện loop)
```

> [!note] 📝 So sánh dễ hiểu
> 7 patterns này giống **hệ thống chất lượng trong nhà máy**:
> - RAG + Fine-tuning = nguyên liệu tốt + thợ giỏi
> - Guardrails = QC kiểm tra sản phẩm
> - Caching = kho hàng sẵn, giao nhanh
> - Evals = KPI đo hiệu suất
> - Defensive UX = nhãn mác rõ ràng
> - Feedback = hòm thư góp ý khách hàng

---
## 📐 Áp dụng theo từng giai đoạn

| Giai đoạn | Cần pattern nào | Chưa cần |
|---|---|---|
| **Prototype** | Evals (cơ bản), Guardrails (structural) | Caching, Fine-tuning |
| **MVP** | + RAG, Defensive UX, User Feedback | Fine-tuning |
| **Production** | + Caching, Guardrails (full), Evals (tự động) | — |
| **Scale** | + Fine-tuning, Semantic Cache, A/B test | — |

> [!tip] 💡
> **Không cần tất cả 7 patterns ngay từ đầu.** Bắt đầu với Evals + Guardrails, thêm dần khi scale. Nhưng luôn **biết chúng tồn tại** để thiết kế architecture có chỗ gắn vào sau.

---
## 🔗 Concept liên quan
- [[Road map]] — các pattern này nằm ở đâu trong lộ trình học
- [[4-LLM Limitations]] — hiểu giới hạn → hiểu tại sao cần guardrails
- [[0-Function Calling]] — tool use là nền tảng của nhiều pattern (RAG, evals)
- [[Glossary]] — bảng thuật ngữ

---
## 📚 Tham khảo
- 🔥 [Eugene Yan — Patterns for Building LLM-based Systems & Products](https://eugeneyan.com/writing/llm-patterns/) — Bài gốc truyền cảm hứng cho note này. Cover 7 patterns chi tiết với ví dụ từ production thật. Đây là bài blog về LLM patterns được trích dẫn nhiều nhất.
- 🔥 [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Từ Anthropic, cover khi nào nên/không nên dùng agent, tool design, và workflow patterns. Quan điểm "đơn giản trước, phức tạp sau" rất thực tế.
- [Martin Fowler — Emerging Patterns in Building GenAI Products](https://martinfowler.com/articles/gen-ai-patterns/) — Góc nhìn software architecture cho GenAI. Cover eval-driven development, human-in-the-loop, và cách tích hợp LLM vào hệ thống có sẵn.
- [a16z — Emerging Architectures for LLM Applications](https://a16z.com/emerging-architectures-for-llm-applications/) — Bức tranh kiến trúc tổng thể từ Andreessen Horowitz. Tổng hợp tech stack phổ biến: embedding, vector DB, orchestration, caching, guardrails.
- [Andrii Furmanets — AI Agents 2026: Tools, Memory, Evals, and Guardrails](https://andriifurmanets.com/blogs/ai-agents-2026-practical-architecture-tools-memory-evals-guardrails) — Bài mới 2026, cover kiến trúc agent thực tế với đầy đủ tools, memory, evals, guardrails. Có code examples.

---
## ✅ Checklist
- [ ] Biết **7 patterns**: Evals, RAG, Fine-tuning, Caching, Guardrails, Defensive UX, User Feedback
- [ ] Hiểu **thứ tự ưu tiên**: prompting → RAG → fine-tuning (rẻ → đắt)
- [ ] Hiểu **Evals** là bắt buộc — không đo = không biết model tốt hay tệ
- [ ] Hiểu **RAG** giảm hallucination bằng cách cho LLM đọc data thật
- [ ] Hiểu **Guardrails** kiểm tra cả input (prompt injection) lẫn output (format, safety)
- [ ] Hiểu **Caching** giảm latency + cost cho câu hỏi lặp
- [ ] Hiểu **Defensive UX** — UI phải thừa nhận AI có thể sai
- [ ] Biết áp dụng pattern **theo giai đoạn** — prototype → MVP → production → scale
