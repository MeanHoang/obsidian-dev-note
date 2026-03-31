# 📚 RAG — Cho LLM đọc data của mình

> [!quote] 💬
> *"LLM biết rất nhiều — nhưng không biết data của bạn. RAG là cách bạn cho nó đọc tài liệu trước khi trả lời."*

---
## 🎯 RAG là gì?
**RAG (Retrieval Augmented Generation)** — tìm tài liệu liên quan → nhét vào prompt → LLM trả lời dựa trên data thật. Giảm hallucination vì LLM có nguồn để dựa vào, thay vì bịa từ kiến thức training.

> [!note] 📝 So sánh dễ hiểu
> LLM không có RAG giống **sinh viên thi không mở tài liệu** — chỉ dựa vào trí nhớ, hay bịa khi không biết.
> LLM có RAG giống **sinh viên thi open-book** — được mở sách, tra đúng đoạn liên quan rồi trả lời. Vẫn có thể sai, nhưng chính xác hơn nhiều.

---
## 🔄 RAG Pipeline — Luồng hoạt động

```
                    INDEXING (1 lần, offline)
┌──────────────────────────────────────────────────┐
│  Documents → Chunk → Embed → Store in Vector DB  │
└──────────────────────────────────────────────────┘

                    QUERYING (mỗi lần user hỏi)
┌──────────────────────────────────────────────────┐
│  User query → Embed → Search Vector DB           │
│      → Top K chunks → Nhét vào prompt → LLM      │
│      → Response dựa trên data thật                │
└──────────────────────────────────────────────────┘
```

**2 phase tách biệt:**

| Phase | Khi nào | Làm gì |
|---|---|---|
| **Indexing** | 1 lần (hoặc khi data thay đổi) | Chia documents → tạo embeddings → lưu vào vector DB |
| **Querying** | Mỗi lần user hỏi | Tìm chunks liên quan → đưa cho LLM → sinh câu trả lời |

---
## 🧩 4 thành phần chính

### 1️⃣ Chunking — Chia document thành đoạn nhỏ
Document quá dài → không nhét hết vào prompt → phải chia nhỏ thành **chunks** vừa đủ.

**Tại sao cần chunk?**
- Context window có giới hạn (128K-200K tokens)
- Chunk nhỏ → tìm chính xác hơn (ít noise)
- Chunk quá lớn → tốn token, LLM bị "lost in the middle"

**Các chiến lược chunking:**

| Strategy           | Cách hoạt động                       | Khi nào dùng                            |
| ------------------ | ------------------------------------ | --------------------------------------- |
| **Fixed-size**     | Cắt đều mỗi N tokens                 | Đơn giản nhất, nhưng hay cắt giữa câu   |
| **Recursive**      | Cắt theo paragraph → sentence → word | **Mặc định nên dùng** — giữ context tốt |
| **Semantic**       | Cắt theo ý nghĩa (dùng embedding)    | Phức tạp, không luôn tốt hơn recursive  |
| **Document-aware** | Cắt theo heading, section, page      | PDF, markdown, code — giữ cấu trúc      |
**Joy** đang Fixed-size chunking (theo token limit) khá basic thông qua Crawl HTML
```js
// ❌ Bad — fixed-size, cắt giữa câu
function naiveChunk(text, size = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
    // "Thời tiết Đà Lạt hôm na" | "y rất lạnh" ← cắt giữa câu!
  }
  return chunks;
}

// ✅ Good — recursive, tách theo paragraph rồi sentence
function recursiveChunk(text, maxTokens = 512) {
  // Thử tách theo paragraph trước
  let chunks = text.split("\n\n");
  // Nếu paragraph vẫn quá dài → tách theo sentence
  chunks = chunks.flatMap(chunk =>
    estimateTokens(chunk) > maxTokens
      ? chunk.split(/(?<=[.!?])\s+/)  // tách theo dấu câu
      : [chunk]
  );
  return chunks.filter(c => c.trim().length > 0);
}
```

**Khuyến nghị 2026:**
- **Bắt đầu với recursive ở 400-512 tokens**
- Overlap 10-20% (hoặc 0 — benchmark gần đây cho thấy overlap ít lợi ích)
- 80% RAG failures đến từ chunking tệ, không phải LLM tệ

> [!tip] 💡
> **Chunk size phụ thuộc use case**: câu hỏi ngắn gọn (FAQ) → chunk nhỏ (256-512). Phân tích sâu → chunk lớn hơn (512-1024). Test với data thật để chọn.

---
### 2️⃣ Embedding — Chuyển text thành vector
**Embedding** = chuyển text thành **mảng số** (vector). Text có ý nghĩa giống nhau → vector gần nhau trong không gian.

```
"Thời tiết Hà Nội"     → [0.12, -0.45, 0.78, ...]  ┐
"Nhiệt độ Hà Nội"      → [0.11, -0.43, 0.76, ...]  ├ gần nhau (similar)
"Weather in Hanoi"      → [0.13, -0.44, 0.77, ...]  ┘

"Giá iPhone 16"         → [0.89, 0.23, -0.56, ...]  ← xa (khác topic)
```

**Embedding models phổ biến 2026:**

| Model | Provider | Đặc điểm |
|---|---|---|
| `text-embedding-3-small` | OpenAI | Rẻ, nhanh, đủ tốt cho đa số use case |
| `text-embedding-3-large` | OpenAI | Chính xác hơn, đắt hơn |
| `embed-v4` | Cohere | Mạnh, hỗ trợ multilingual |
| `voyage-3-large` | Voyage AI | Context 32K tokens — embed document dài không cần chunk |
| `bge-m3` | Open-source | Self-host được, không tốn API cost |

```js
import OpenAI from "openai";
const openai = new OpenAI();

// Embed 1 đoạn text
async function embed(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding; // [0.12, -0.45, 0.78, ...] (1536 dimensions)
}

// Embed tất cả chunks
const chunks = recursiveChunk(document);
const embeddings = await Promise.all(chunks.map(c => embed(c)));
// Lưu vào vector DB: { chunk_text, embedding_vector }
```

> [!warning] ⚠️
> **Query và document phải dùng cùng 1 embedding model.** Embed document bằng model A, query bằng model B → kết quả tìm kiếm sẽ sai hoàn toàn.

---
### 3️⃣ Vector Store — Lưu và tìm kiếm vector
Database đặc biệt lưu embedding vectors + hỗ trợ **similarity search** (tìm vector gần nhất).

**Vector stores phổ biến:**

| Store | Loại | Khi nào dùng |
|---|---|---|
| **ChromaDB** | In-memory / local | Prototype, dev local — zero setup |
| **Pinecone** | Managed cloud | Production, không muốn lo infra |
| **Weaviate** | Self-hosted | Cần kiểm soát, hybrid search tốt |
| **Qdrant** | Self-hosted | Performance cao, Rust-based |
| **pgvector** | PostgreSQL extension | Đã dùng Postgres, không muốn thêm DB mới |

```js
// Ví dụ với ChromaDB (đơn giản nhất)
import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();
const collection = await chroma.getOrCreateCollection({ name: "my_docs" });

// Indexing: lưu chunks + embeddings
await collection.add({
  ids: chunks.map((_, i) => `chunk_${i}`),
  documents: chunks,
  embeddings: embeddings,  // vectors đã embed ở bước trước
  metadatas: chunks.map((_, i) => ({ source: "policy.pdf", page: i }))
});

// Querying: tìm chunks liên quan nhất
const results = await collection.query({
  queryEmbeddings: [await embed("Chính sách nghỉ phép")],
  nResults: 5  // top 5 chunks gần nhất
});
// results.documents = [["Nhân viên được nghỉ 12 ngày phép/năm...", ...]]
```

> [!tip] 💡
> **Metadata rất quan trọng** — lưu source file, page number, date... để sau này filter được ("chỉ tìm trong policy.pdf") và citation cho user biết nguồn.

---
### 4️⃣ Retrieval + Generation — Tìm và trả lời
Kết hợp tất cả: query → tìm chunks → nhét vào prompt → LLM trả lời.
```js
async function ragQuery(question) {
  // 1. Embed câu hỏi
  const queryEmbedding = await embed(question);

  // 2. Tìm top K chunks liên quan
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 5
  });
  const context = results.documents[0].join("\n\n");

  // 3. Nhét vào prompt + gọi LLM
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    system: "Trả lời dựa trên context được cung cấp. "
          + "Nếu context không chứa thông tin cần thiết, nói 'Không tìm thấy thông tin'.",
    messages: [{
      role: "user",
      content: `Context:\n${context}\n\nCâu hỏi: ${question}`
    }]
  });

  return response.content[0].text;
}

// Sử dụng
const answer = await ragQuery("Chính sách nghỉ phép công ty thế nào?");
// "Theo tài liệu, nhân viên được nghỉ 12 ngày phép/năm..."
```

---
## 🔍 Retrieval Strategies — Tìm kiếm hiệu quả

### Dense Search (Vector)
Tìm theo **ý nghĩa** — "chính sách nghỉ phép" tìm được "annual leave policy".
- Ưu: hiểu ngữ nghĩa, multilingual
- Nhược: miss exact keywords

### Sparse Search (BM25/Keyword)
Tìm theo **từ khóa** — "error 404" tìm đúng document chứa "error 404".
- Ưu: chính xác cho keyword, tên riêng, mã lỗi
- Nhược: không hiểu ngữ nghĩa

### Hybrid Search — Best of both worlds
**Kết hợp cả 2** → kết quả tốt nhất. Đây là **production standard 2026**.

```
User query: "lỗi E001 khi đăng nhập"
    │
    ├── Dense search:  tìm docs về "login error" (ngữ nghĩa)
    ├── Sparse search: tìm docs chứa "E001" (exact match)
    │
    └── Merge + re-rank → top K kết quả chính xác nhất
```

> [!tip] 💡
> **Bắt đầu với dense search** (đơn giản). Nếu miss kết quả cho keyword/mã cụ thể → thêm hybrid. Weaviate, Qdrant, Pinecone đều hỗ trợ hybrid search built-in.

---
## ⚠️ Pitfalls thường gặp

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| **LLM bịa dù có RAG** | Context không chứa câu trả lời nhưng LLM vẫn trả lời | System prompt: "Nếu không tìm thấy, nói không biết" |
| **Tìm sai document** | Chunk quá lớn, embedding model yếu | Giảm chunk size, dùng model tốt hơn |
| **Lost in the middle** | Nhét quá nhiều chunks, LLM quên ở giữa | Giảm top K (3-5 thay vì 10), đặt chunk quan trọng ở đầu |
| **Outdated data** | Document cũ nhưng chưa re-index | Automate re-indexing khi data thay đổi |
| **Cross-language fail** | Query tiếng Việt, document tiếng Anh | Dùng multilingual embedding model |
| **Cost tăng nhanh** | Embed quá nhiều documents | Cache embeddings, chỉ re-embed khi document thay đổi |

> [!danger] ⛔
> RAG **giảm** hallucination nhưng **không loại bỏ hoàn toàn**. LLM vẫn có thể bịa thêm hoặc hiểu sai context. Luôn cần validation + citation.

---
## 📐 RAG vs Fine-tuning vs Prompting

| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| **Data cần** | Không | Documents bên ngoài | Training data (instruction + output) |
| **Khi nào** | Task phổ biến, ít data | Cần trả lời từ data cụ thể | Cần style/behavior cụ thể |
| **Data update** | Không cần | Re-index documents | Re-train model |
| **Cost** | Thấp | Trung bình (embedding + vector DB) | Cao (GPU training) |
| **Ví dụ** | Tóm tắt, dịch thuật | Q&A trên docs công ty | Viết code theo style riêng |

> [!tip] 💡
> **Thứ tự thử: prompting → RAG → fine-tuning.** Rẻ → đắt. Đơn giản → phức tạp. Chỉ escalate khi cách trước không đủ.

---
## 🔗 Concept liên quan
- [[0-Function Calling]] — RAG có thể build dưới dạng tool cho agent gọi
- [[1-Build Tool]] — tạo search tool dùng vector DB
- [[3-Error Handling]] — xử lý khi retrieval fail hoặc trả empty
- [[LLM Design Patterns]] — RAG là 1 trong 7 design patterns
- [[Glossary]] — bảng thuật ngữ (Embedding, Vector Store, RAG)

---
## 📚 Tham khảo
- 🔥 [RAG in Production 2026: Chunking Strategies, Embedding Costs, and What Actually Works at Scale](https://www.abhs.in/blog/rag-in-production-chunking-retrieval-cost-developers-2026) — Benchmark chunking strategies 2026 với data thực tế. Kết luận: recursive 512 tokens vẫn thắng semantic chunking. 80% RAG failures đến từ ingestion layer.
- 🔥 [RAG from Scratch: Build a Pipeline (TypeScript + Python)](https://www.chanl.ai/blog/rag-from-scratch-retrieval-augmented-generation-typescript-python) — Tutorial hands-on build RAG từ đầu bằng TypeScript. Không dùng framework — hiểu từng bước.
- [Best Chunking Strategies for RAG in 2026](https://www.firecrawl.dev/blog/best-chunking-strategies-rag) — So sánh chi tiết các chunking strategies với benchmark. Có code examples và recommendations theo use case.
- [All You Need to Know About RAG in 2026](https://aishwaryasrinivasan.substack.com/p/all-you-need-to-know-about-rag-in) — Tổng quan RAG landscape 2026: hybrid search, re-ranking, agentic RAG. Ngắn gọn, dễ hiểu.
- [Building Production-Ready RAG with TypeScript](https://dev.to/glaucia86/building-a-production-ready-rag-system-zero-to-hero-with-typescript-docker-google-gemini--50nh) — Tutorial zero-to-hero bằng TypeScript + Docker + Gemini. Cover cả deployment production.

---
## ✅ Checklist
- [ ] Hiểu RAG = **tìm document liên quan → nhét vào prompt → LLM trả lời dựa trên data thật**
- [ ] Hiểu **2 phase**: indexing (offline, 1 lần) vs querying (mỗi request)
- [ ] Biết **chunking strategies**: recursive (mặc định), fixed-size, semantic, document-aware
- [ ] Biết chunk size khuyến nghị: **400-512 tokens** cho đa số use case
- [ ] Hiểu **embedding** = chuyển text thành vector, text giống ý → vector gần nhau
- [ ] Biết chọn **vector store**: ChromaDB (dev), Pinecone (managed), pgvector (đã có Postgres)
- [ ] Hiểu **hybrid search** = dense + sparse → production standard 2026
- [ ] Biết RAG **giảm** hallucination nhưng **không loại bỏ hoàn toàn**
- [ ] Biết thứ tự: **prompting → RAG → fine-tuning** (rẻ → đắt)
