# 🏁 Phase 2 Recap — Tổng kết Tools & Function Calling

> [!quote] 💬
> *"Phase 1 dạy LLM nói. Phase 2 dạy LLM làm. Từ chatbot → agent — đây là bước nhảy lớn nhất."*

---
## 🎯 Phase 2 là gì?
Phase 2 là **biến LLM từ "biết nói" thành "biết làm"** — LLM chọn tool để gọi, tự chain nhiều tool, xử lý lỗi, và đọc data riêng qua RAG. **Tất cả bằng API trực tiếp** — chưa dùng framework.

> [!note] 📝 So sánh dễ hiểu
> Phase 1 = dạy LLM **nói** (trả lời câu hỏi, trả JSON).
> Phase 2 = dạy LLM **làm** (gọi API, query database, search web, đọc tài liệu).
> Giống **sếp có thêm nhân viên** — sếp ra quyết định, nhân viên (tools) chạy việc, mang kết quả về cho sếp phân tích.

---
## 🗺️ Bức tranh tổng thể — 5 topic đã học
```
┌─────────────────────────────────────────────────────────────────┐
│                 Phase 2: Tools & Function Calling               │
│                                                                 │
│  ┌───────────────────┐    ┌──────────────┐                      │
│  │ Function Calling  │───→│  Build Tool  │                      │
│  │ LLM chọn tool,    │    │ Tự tạo tool: │                      │
│  │ tạo arguments     │    │ search, DB,  │                      │
│  │                   │    │ API bên ngoài│                      │
│  └───────────────────┘    └──────┬───────┘                      │
│                                  │                              │
│                                  ▼                              │
│  ┌───────────────────┐    ┌──────────────┐                      │
│  │  Error Handling   │←───│Tool Chaining │                      │
│  │ Retry, fallback,  │    │ Chain A→B→C, │                      │
│  │ circuit breaker,  │    │ parallel,    │                      │
│  │ gửi lỗi cho LLM  │    │ conditional  │                      │
│  └───────────────────┘    └──────────────┘                      │
│                                  │                              │
│                                  ▼                              │
│                          ┌──────────────┐                       │
│                          │     RAG      │                       │
│                          │ Chunk → Embed│                       │
│                          │ → Vector DB  │                       │
│                          │ → LLM trả lời│                       │
│                          └──────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---
## 📖 Tóm tắt từng topic

### 1️⃣ [[0-Function Calling]] — LLM gọi hàm, làm việc thật
**Core insight:** LLM **không thực thi function** — nó chỉ trả "tôi muốn gọi hàm X với params Y". App thực thi rồi trả kết quả lại.

| Concept | Một dòng tóm tắt |
|---|---|
| **Tool Use Loop** | Gọi API → nhận tool call → thực thi → gửi result lại → lặp |
| **Tool Definition** | Mô tả tool bằng name + description + input_schema cho LLM đọc |
| **tool_choice** | `auto` (LLM tự quyết), `any` (bắt buộc gọi), force tool cụ thể, `none` |
| **Parallel Tool Calls** | LLM gọi nhiều tool trong 1 response — phải trả tất cả results trong 1 message |
| **Agent Loop** | Function calling + loop + max_turns = agent cơ bản |
| **stop_reason** | `"tool_use"` → tiếp loop, `"end_turn"` → dừng, lấy text response |

> [!tip] 💡
> Agent loop là **pattern cốt lõi** — mọi framework (LangChain, LangGraph) đều wrap pattern này. Hiểu loop = hiểu agent.

---
### 2️⃣ [[1-Build Tool]] — Tự tạo tool cho LLM gọi
**Core insight:** Tool = cầu nối LLM với thế giới bên ngoài. Mỗi tool gồm 3 phần: **definition** (cho LLM đọc) + **implementation** (code thực thi) + **result format** (cho LLM đọc kết quả).

**3 loại tool phổ biến:**

| Loại | Ví dụ | Lưu ý |
|---|---|---|
| **Search Tool** | Tìm kiếm web (Tavily, SerpAPI) | Trả text dễ đọc, không raw JSON |
| **Database Tool** | Query SQL/NoSQL | Chỉ cho SELECT, read-only connection |
| **API Tool** | Gọi API bên ngoài (weather, payment...) | Validate response, handle timeout |

**Best practices:**
- **Description quyết định tất cả** — LLM chọn tool dựa trên description
- **TOOL_MAP pattern** — dictionary dispatch, thêm tool chỉ cần 1 dòng
- **Least privilege** — tool chỉ được phép làm đúng việc cần
- **5-15 tools** là vùng an toàn, 30+ nên dùng tool routing

---
### 3️⃣ [[2-Tool Chaining]] — Nối nhiều tool giải quyết task phức tạp
**Core insight:** Không có code riêng cho chaining — LLM **tự chain** bằng cách gọi tool nhiều lượt trong agent loop. Developer chỉ cung cấp tools.

**4 patterns chaining:**

| Pattern | Mô tả | Ví dụ |
|---|---|---|
| **Linear** | A → B → C lần lượt | Tìm SP → check tồn kho → đặt hàng |
| **Fan-out/Fan-in** | Parallel rồi tổng hợp | Lấy thời tiết + tìm KS cùng lúc |
| **Conditional** | Rẽ nhánh theo kết quả | Còn hàng → đặt, hết → tìm thay thế |
| **Loop** | Gọi lại cùng tool, refine params | Search lại với keyword cụ thể hơn |

**Vấn đề thực tế:**
- **Error propagation** — sai từ đầu → sai cả chuỗi
- **Context window đầy** — chain dài > 5-6 bước → token phình to
- **Latency cộng dồn** — mỗi tool call = 1-5 giây round trip

---
### 4️⃣ [[3-Error Handling]] — Tool fail thì agent xử lý thế nào
**Core insight:** Kết hợp 2 tầng — developer xử lý lỗi **kỹ thuật** (retry, circuit breaker), LLM xử lý lỗi **logic** (chọn tool khác, thay đổi strategy).

**4 patterns, xếp thành layer:**
```
Layer 1: Circuit Breaker   ← tool đang bị ngắt? → skip
Layer 2: Retry + Backoff   ← lỗi tạm thời? → retry (1s → 2s → 4s)
Layer 3: Fallback          ← retry hết? → plan B (tool/model khác)
Layer 4: Gửi error cho LLM ← fallback cũng fail? → LLM tự quyết
Layer 5: Graceful failure  ← tất cả fail? → "Xin lỗi..."
```

**Quy tắc vàng:** Chỉ retry lỗi **transient** (429, 500, timeout). Không retry lỗi **permanent** (401, 400). Luôn thêm **jitter** để tránh retry storm.

---
### 5️⃣ [[4-RAG]] — Cho LLM đọc data của mình
**Core insight:** RAG = tìm tài liệu liên quan → nhét vào prompt → LLM trả lời dựa trên data thật. Giảm hallucination vì LLM có nguồn để dựa vào.

**Pipeline 2 phase:**

| Phase | Khi nào | Làm gì |
|---|---|---|
| **Indexing** | 1 lần (offline) | Documents → Chunk → Embed → Lưu vào Vector DB |
| **Querying** | Mỗi request | Query → Embed → Tìm chunks gần nhất → Nhét vào prompt → LLM trả lời |

**4 thành phần chính:**

| Thành phần | Khuyến nghị |
|---|---|
| **Chunking** | Recursive, 400-512 tokens — 80% RAG failures đến từ chunking tệ |
| **Embedding** | text-embedding-3-small (OpenAI) cho đa số use case |
| **Vector Store** | ChromaDB (dev), Pinecone (prod), pgvector (đã có Postgres) |
| **Retrieval** | Bắt đầu dense search, thêm hybrid (dense + sparse) nếu cần |

> [!warning] ⚠️
> RAG **giảm** hallucination nhưng **không loại bỏ hoàn toàn**. Query và document **phải dùng cùng 1 embedding model**.

---
## 🔑 Mental Model — Tư duy xuyên suốt Phase 2

```
Agent = LLM + Tools + Loop
├── LLM: bộ não — ra quyết định gọi tool nào, với args gì
├── Tools: đôi tay — search, query DB, gọi API, đọc tài liệu
├── Loop: vòng lặp — gọi tool → đọc kết quả → quyết định tiếp
├── Error Handling: tấm khiên — retry, fallback, circuit breaker
└── RAG: bộ nhớ ngoài — cho LLM đọc data riêng qua vector DB
```

**3 nguyên tắc vàng từ Phase 2:**
1. **LLM chọn, app thực thi.** LLM không bao giờ chạy code — nó chỉ trả tool name + arguments. Bạn kiểm soát những gì thực sự xảy ra.
2. **Description là API docs cho LLM.** Tool description quyết định LLM có chọn đúng tool không. Viết description giống viết docs cho đồng nghiệp mới.
3. **Fail gracefully, never crash.** Mọi tool đều sẽ fail — thiết kế cho failure từ đầu: retry → fallback → LLM xử lý → báo user.

---
## 📊 Phase 1 → Phase 2: Đã đi được bao xa?

| Trước Phase 2 | Sau Phase 2 |
|---|---|
| LLM trả text/JSON | LLM **gọi function**, tương tác với thế giới bên ngoài |
| 1 prompt → 1 response | **Agent loop** — gọi tool → đọc kết quả → gọi tiếp |
| Data trong prompt | **RAG** — LLM đọc hàng triệu document qua vector DB |
| Không xử lý lỗi | **Layered error handling** — retry, fallback, circuit breaker |
| Chatbot đơn giản | **Agent cơ bản** — tự quyết định, tự chain, tự xử lý lỗi |

> [!tip] 💡
> Với kiến thức Phase 1 + Phase 2, bạn đã có thể **build agent thật sự** mà không cần framework. Mọi framework chỉ wrap những pattern bạn đã học — agent loop, tool use, error handling, RAG.

---
## 🚀 Sẵn sàng cho Phase 3?

Phase 2 cho bạn **build agent bằng tay**. Phase 3 sẽ cho bạn **framework để build nhanh hơn**:

| Phase 2 (đã học) | Phase 3 (sắp học) |
|---|---|
| Tự viết agent loop | LangChain **wrap** loop sẵn |
| Tự viết tool definition | LangChain **tool decorator** |
| Tự viết RAG pipeline | LangChain **RAG chain** |
| Tự manage messages | LangChain **Memory** tự quản |
| Hiểu bản chất | Dùng **abstraction** để build nhanh |

> [!note] 📝 So sánh dễ hiểu
> Phase 2 = bạn đã biết **lái số sàn thành thạo**.
> Phase 3 = giờ ngồi vào **số tự động** (LangChain) — tiện hơn, nhanh hơn.
> Nhưng vì đã hiểu cơ chế bên dưới → khi "xe hỏng" (framework bug), bạn **debug được**.

---
## ✅ Checklist — Phase 2 hoàn thành?

### Function Calling
- [ ] Hiểu LLM **không thực thi** — chỉ trả tool name + arguments
- [ ] Implement được **tool use loop** (Anthropic hoặc OpenAI)
- [ ] Biết dùng **tool_choice** để kiểm soát behavior
- [ ] Biết xử lý **parallel tool calls**

### Build Tool
- [ ] Build được tool thật: search, database, hoặc API
- [ ] Viết **description** rõ ràng — nói tool làm gì + khi nào dùng
- [ ] Dùng **TOOL_MAP** pattern để dispatch
- [ ] Áp dụng **least privilege** + validate input

### Tool Chaining
- [ ] Hiểu 4 patterns: **linear, fan-out/fan-in, conditional, loop**
- [ ] Biết **error propagation** — validate kết quả mỗi bước
- [ ] Giữ chain **< 5-6 bước**, parallel hóa bước độc lập

### Error Handling
- [ ] Phân biệt lỗi **transient** vs **permanent**
- [ ] Implement **retry + exponential backoff + jitter**
- [ ] Có **fallback** và **circuit breaker**
- [ ] Biết **gửi error cho LLM** để LLM tự xử lý

### RAG
- [ ] Hiểu pipeline: **chunk → embed → store → query → generate**
- [ ] Biết chunking khuyến nghị: **recursive, 400-512 tokens**
- [ ] Biết chọn vector store theo use case
- [ ] Hiểu **dense vs sparse vs hybrid search**
- [ ] Biết RAG **giảm nhưng không loại bỏ** hallucination

> [!tip] 💡
> Nếu tick được hết checklist trên → bạn đã sẵn sàng cho [[Road map#Phase 3 ⛓️ LangChain — biết dùng, đừng phụ thuộc (1-2 tuần)|Phase 3: LangChain]] — nơi bạn dùng framework để build nhanh hơn, nhưng **hiểu bản chất bên dưới** nhờ Phase 1 + 2.
