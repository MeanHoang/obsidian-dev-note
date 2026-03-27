# 🗺️ Roadmap học LLM & AI Agent

> [!quote] 💬
> Hiểu bản chất trước, dùng framework sau. Framework thay đổi liên tục — kiến thức nền tảng thì không.

---
## Phase 1: 🧠 Nền tảng LLM (1-2 tuần)
Mục tiêu: **gọi API trực tiếp, hiểu LLM hoạt động thế nào** — chưa dùng framework nào.
- [ ] Hiểu token, context window, temperature, top-p
- [ ] Gọi API trực tiếp (OpenAI / Anthropic) — không qua LangChain
- [ ] Prompt engineering: zero-shot, few-shot, chain-of-thought, system prompt
- [ ] Structured output — bắt LLM trả JSON đúng format
- [ ] Hiểu giới hạn: hallucination, context limit, latency, cost

> [!tip] 💡
> Phase này là quan trọng nhất về lâu dài. Framework đổi mỗi tháng, prompt engineering thì dùng mãi.

---
## Phase 2: 🔧 Tools & Function Calling (2 tuần) ← Quan trọng nhất
Mục tiêu: **LLM không chỉ chat — mà làm được việc thật.**
- [ ] Function calling — LLM chọn tool nào để gọi, với params gì
- [ ] Tự build tool đơn giản: search, query database, gọi API bên ngoài
- [ ] Tool chaining — LLM gọi tool A, lấy kết quả, gọi tiếp tool B
- [ ] Error handling — tool fail thì agent xử lý thế nào
- [ ] RAG (Retrieval Augmented Generation) — cho LLM đọc data của mình
  - Embedding, vector store (Pinecone, Chroma, pgvector)
  - Chunking strategy — chia document thế nào cho hiệu quả

> [!note] 📝
> Nếu hiểu rõ function calling, bạn có thể build agent **không cần LangChain**. Đây là skill chuyển được sang bất kỳ framework nào.

---
## Phase 3: ⛓️ LangChain — biết dùng, đừng phụ thuộc (1-2 tuần)
Mục tiêu: **hiểu abstraction của LangChain**, dùng khi nó tiết kiệm thời gian, bỏ khi nó cản đường.
- [ ] Concept chính: Chain, Prompt Template, Output Parser, Memory
- [ ] LCEL (LangChain Expression Language) — cách compose chain
- [ ] Dùng LangChain cho RAG pipeline
- [ ] So sánh: cùng 1 task, build bằng API trực tiếp vs LangChain → hiểu trade-off

> [!warning] ⚠️
> LangChain có nhiều abstraction layer gây khó debug. Học concept, nhưng **đừng để framework nghĩ thay mình**. Khi gặp lỗi, phải hiểu chuyện gì xảy ra bên dưới.

---
## Phase 4: 🕸️ LangGraph — Agent & Multi-Agent (2-3 tuần) ← Core
Mục tiêu: **build agent phức tạp** — loop, branching, multi-agent, human-in-the-loop.
**Tuần 1-2: Single Agent**
- [ ] Graph concept: node, edge, state, conditional edge
- [ ] Build agent đơn giản: nhận task → gọi tool → kiểm tra → lặp lại nếu cần
- [ ] State management — truyền data giữa các node
- [ ] Human-in-the-loop — dừng chờ người duyệt rồi chạy tiếp
- [ ] Persistence — lưu state để resume sau

**Tuần 3+: Multi-Agent**
- [ ] Nhiều agent phối hợp: planner + executor + reviewer
- [ ] Agent delegation — agent giao việc cho agent khác
- [ ] Shared state vs isolated state giữa các agent

---
## Phase 5: 📊 Evaluation & Testing (xen vào từ Phase 2)
Mục tiêu: **biết output đúng hay sai**, không chỉ "chạy được là xong".
- [ ] Cách đánh giá output của LLM — không có unit test truyền thống
- [ ] LLM-as-judge — dùng LLM khác để đánh giá
- [ ] Benchmark cho RAG: retrieval accuracy, answer relevance
- [ ] Tracing & observability — LangSmith, Langfuse — xem agent đang làm gì
- [ ] Cost tracking — mỗi request tốn bao nhiêu token/tiền

> [!tip] 💡
> Đừng để đến cuối mới test. **Từ phase 2 trở đi, mỗi khi build xong 1 feature → eval ngay.** Không eval = không biết agent đang tốt hay đang hallucinate.

---

## 📐 Tổng thời gian: ~8-10 tuần

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
(LLM)       (Tools)     (LangChain)  (LangGraph)
                ↕            ↕           ↕
             Phase 5: Evaluation (chạy song song)
```
