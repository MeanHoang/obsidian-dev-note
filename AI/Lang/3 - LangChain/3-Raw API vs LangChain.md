# ⚖️ Raw API vs LangChain — Khi nào dùng gì?

> [!quote] 💬
> *"Không có tool nào tốt nhất — chỉ có tool phù hợp nhất cho bài toán cụ thể."*

---
## 🎯 Note này để làm gì?
Sau khi học cả raw API (Phase 1+2) và LangChain (Phase 3), note này giúp bạn **quyết định nhanh**: dùng gì cho task nào. Không phải chọn 1, bỏ 1 — thực tế production **hay mix cả 2**.

> [!note] 📝 So sánh dễ hiểu
> Raw API giống **đi bộ** — chậm hơn, nhưng biết rõ từng bước, đi đâu cũng được.
> LangChain giống **đi xe buýt** — nhanh hơn, nhưng chỉ đi theo tuyến có sẵn. Muốn rẽ khác phải xuống xe đi bộ.
> **Người giỏi biết khi nào lên xe, khi nào đi bộ.**

---
## 📊 Decision Table — Chọn nhanh

| Scenario | Dùng gì | Lý do |
|---|---|---|
| Prompt → response đơn giản | **Raw API** | 5 dòng code, không cần framework |
| Chỉ dùng 1 provider (chỉ Claude hoặc chỉ GPT) | **Raw API** | LangChain wrapper không thêm giá trị |
| Cần swap provider thường xuyên | **LangChain** | Đổi 1 import, logic giữ nguyên |
| RAG pipeline có nhiều loại document | **LangChain** | 700+ loaders, splitters có sẵn |
| Agent phức tạp, có state | **LangGraph** | State management, persistence built-in |
| Cần batch/stream miễn phí | **LangChain** | Runnable interface cho sẵn |
| Debug chi tiết, kiểm soát HTTP | **Raw API** | Thấy mọi request/response |
| Docker image nhỏ, ít dependency | **Raw API** | LangChain kéo nhiều package |
| Prototype nhanh | **LangChain** | Lắp ghép component nhanh |
| Production, cần tối ưu latency | **Tùy** | Benchmark cụ thể với data thật |

---
## 🏗️ Khi nào mix cả 2?

Thực tế hay gặp nhất: **LangChain cho RAG/retrieval, raw API cho phần LLM call**.

```python
# Mix: LangChain loader + splitter + vector store
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# Dùng LangChain cho indexing — tiện, nhiều loader
docs = PyPDFLoader("handbook.pdf").load()
chunks = RecursiveCharacterTextSplitter(chunk_size=500).split_documents(docs)
vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())

# Dùng raw API cho LLM call — kiểm soát hoàn toàn
from anthropic import Anthropic
client = Anthropic()

query = "Chính sách nghỉ phép?"
results = vectorstore.similarity_search(query, k=4)
context = "\n\n".join(r.page_content for r in results)

response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=1024,
    system=f"Trả lời dựa trên context:\n{context}",
    messages=[{"role": "user", "content": query}]
)
print(response.content[0].text)
```

> [!tip] 💡
> Pattern này lấy **best of both worlds**: LangChain lo phần data pipeline (loader, splitter, vector store), raw API lo phần LLM call (kiểm soát prompt, streaming, cost).

---
## ⚠️ Sai lầm thường gặp

### 1️⃣ Dùng LangChain cho mọi thứ
```python
# ❌ Overkill — LangChain cho 1 câu hỏi đơn giản
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

chain = ChatPromptTemplate.from_messages([("human", "{q}")]) | ChatOpenAI() | StrOutputParser()
chain.invoke({"q": "1+1=?"})

# ✅ Raw API — 3 dòng
from openai import OpenAI
response = OpenAI().chat.completions.create(model="gpt-4o", messages=[{"role":"user","content":"1+1=?"}])
print(response.choices[0].message.content)
```

### 2️⃣ Viết raw API cho mọi thứ
```python
# ❌ Khổ sở — tự viết PDF loader, chunker, embedder, vector store từ đầu
import fitz
# 50+ dòng code xử lý PDF...
# 30+ dòng code chunking...
# 20+ dòng code gọi embedding API...
# 40+ dòng code setup ChromaDB...

# ✅ LangChain — 4 dòng
docs = PyPDFLoader("file.pdf").load()
chunks = RecursiveCharacterTextSplitter(chunk_size=500).split_documents(docs)
vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())
retriever = vectorstore.as_retriever()
```

### 3️⃣ Không hiểu bên dưới framework làm gì
```python
# ❌ Copy-paste LangChain code mà không hiểu
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt | model | parser
)
# Khi retrieval sai → không biết debug ở đâu
# Vì không hiểu retriever = embed query → cosine similarity → top K

# ✅ Hiểu Phase 2 trước → dùng LangChain sau → debug được
# "À retriever tìm sai → có thể chunk quá lớn hoặc embedding model yếu"
```

> [!danger] ⛔
> **Đây là lý do học Phase 1+2 trước Phase 3.** Nếu chỉ biết LangChain mà không hiểu raw API → khi framework lỗi, bạn bó tay. Hiểu bản chất = debug bất kỳ framework nào.

---
## 📐 Tóm tắt

```
Raw API                          LangChain
├── Full control                 ├── Nhanh hơn cho task phức tạp
├── Ít dependency                ├── Swap provider dễ
├── Debug dễ                     ├── 700+ integrations
├── Phải tự viết mọi thứ        ├── Abstraction nhiều lớp
└── Tốt cho: simple tasks,      └── Tốt cho: RAG, prototype,
    single provider,                 multi-provider, batch/stream
    full control needed
```

**Quy tắc ngón tay cái:**
- Task < 20 dòng code → **raw API**
- Task cần nhiều integration (loader, splitter, vector store) → **LangChain**
- Cần cả hai → **mix** (LangChain cho data pipeline, raw API cho LLM call)

---
## 🔗 Concept liên quan
- [[0-LangChain Overview]] — kiến trúc, ưu/nhược điểm LangChain
- [[1-LCEL]] — pipe syntax, Runnable interface
- [[2-LangChain RAG]] — RAG pipeline bằng LangChain
- [[4-RAG]] — RAG bằng raw API (Phase 2)
- [[3-API Integration]] — gọi LLM API trực tiếp (Phase 1)

---
## 📚 Tham khảo
- 🔥 [LangChain vs LangGraph vs Raw OpenAI (Droptica)](https://www.droptica.com/blog/langchain-vs-langgraph-vs-raw-openai-how-choose-your-rag-stack/) — Benchmark thực tế: latency, token usage, accuracy. Kết luận: raw API nhanh nhất, LangChain tiện nhất, LangGraph mạnh nhất cho agent.
- [LangChain vs Vercel AI SDK vs OpenAI SDK (Strapi)](https://strapi.io/blog/langchain-vs-vercel-ai-sdk-vs-openai-sdk-comparison-guide) — So sánh 3 approach phổ biến 2026 với code examples cụ thể.
- [Why We No Longer Use LangChain (OctoClaw)](https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents) — Case study team bỏ LangChain. Đọc để hiểu khi nào framework cản đường.
- [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Quan điểm "simple workflow trước, framework phức tạp sau" từ Anthropic.

---
## ✅ Checklist
- [ ] Biết **khi nào dùng raw API** — task đơn giản, 1 provider, cần control
- [ ] Biết **khi nào dùng LangChain** — RAG, multi-provider, prototype nhanh
- [ ] Biết **mix cả 2** — LangChain cho data pipeline, raw API cho LLM call
- [ ] Hiểu **Phase 1+2 là nền tảng** — debug được framework vì hiểu bản chất
- [ ] Quyết định được **dùng gì** cho project cụ thể dựa trên decision table
