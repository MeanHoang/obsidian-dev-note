# 📚 LangChain RAG — Build RAG pipeline bằng framework

> [!quote] 💬
> *"RAG bằng raw API bạn đã biết. Giờ dùng LangChain để build nhanh hơn — nhưng hiểu chuyện gì xảy ra bên dưới."*

---
## 🎯 LangChain RAG là gì?
Dùng các component có sẵn của LangChain — **Document Loaders, Text Splitters, Embeddings, Vector Stores, Retrievers** — để build RAG pipeline nhanh hơn so với tự viết từng bước bằng raw API.

> [!note] 📝 So sánh dễ hiểu
> RAG bằng raw API ở [[4-RAG|Phase 2]] giống **tự nấu ăn** — mua nguyên liệu, tự cắt, tự nấu.
> RAG bằng LangChain giống **dùng máy chế biến thực phẩm** — bỏ nguyên liệu vào, bấm nút, ra thành phẩm. Nhanh hơn, nhưng phải biết máy hoạt động thế nào khi cần sửa.

---
## 🔄 Pipeline tổng quan

```
Documents → Loader → Splitter → Embeddings → Vector Store → Retriever → Chain
   │          │          │           │             │            │          │
   │     LangChain   LangChain   LangChain    LangChain    LangChain   LCEL
   │     có sẵn      có sẵn      có sẵn       có sẵn       có sẵn     pipe |
   │
   └── PDF, web, CSV, Notion, GitHub, Slack...
```

**So với raw API:**
- Raw API: tự viết code đọc file, tự chunk, tự gọi embedding API, tự query vector DB
- LangChain: mỗi bước có component sẵn, nối bằng LCEL

---
## 🧩 5 Component chính

### 1️⃣ Document Loaders — Đọc data từ mọi nguồn

LangChain có **700+ loaders** — PDF, web, CSV, Notion, GitHub, Slack, Google Drive...

```python
from langchain_community.document_loaders import (
    PyPDFLoader,
    WebBaseLoader,
    CSVLoader,
    TextLoader
)

# PDF
docs = PyPDFLoader("handbook.pdf").load()

# Website
docs = WebBaseLoader("https://example.com/docs").load()

# CSV
docs = CSVLoader("data.csv").load()

# Mỗi loader trả về list[Document]
# Document = { page_content: str, metadata: dict }
print(docs[0].page_content)  # nội dung text
print(docs[0].metadata)       # {"source": "handbook.pdf", "page": 0}
```

> [!tip] 💡
> **Metadata rất quan trọng** — loader tự gắn source file, page number... Sau này dùng để filter retrieval và citation cho user.

**Raw API thì phải tự viết:**
```python
# ❌ Raw API — tự handle từng loại file
import fitz  # PyMuPDF
pdf = fitz.open("handbook.pdf")
for page in pdf:
    text = page.get_text()
    # Tự xử lý encoding, layout, bảng...
```

---
### 2️⃣ Text Splitters — Chunk documents

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # ~500 ký tự mỗi chunk
    chunk_overlap=50,     # overlap 50 ký tự giữa chunks
    separators=["\n\n", "\n", ". ", " ", ""]  # thử tách theo thứ tự này
)

chunks = splitter.split_documents(docs)
# docs: 1 document dài → chunks: nhiều document ngắn
# Metadata được giữ nguyên cho mỗi chunk
```

**Các splitter có sẵn:**

| Splitter | Khi nào dùng |
|---|---|
| `RecursiveCharacterTextSplitter` | **Mặc định** — tách theo paragraph → sentence → word |
| `TokenTextSplitter` | Cần chunk chính xác theo token count |
| `MarkdownHeaderTextSplitter` | Tách markdown theo heading, giữ cấu trúc |
| `HTMLHeaderTextSplitter` | Tách HTML theo tag |
| `CodeTextSplitter` | Tách code theo function/class |

> [!tip] 💡
> Bắt đầu với `RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)`. Chỉ đổi khi test cho thấy kết quả không tốt. Đây cũng là khuyến nghị ở [[4-RAG]].

---
### 3️⃣ Embeddings — Chuyển text thành vector

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings

# OpenAI (API, trả phí)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# HuggingFace (local, miễn phí)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Dùng giống nhau — cùng interface
vector = embeddings.embed_query("LLM là gì?")
# → [0.12, -0.45, 0.78, ...]  (mảng số)
```

> [!warning] ⚠️
> **Query và document phải dùng cùng 1 embedding model.** Embed document bằng OpenAI, query bằng HuggingFace → kết quả sai hoàn toàn. Đã nhấn mạnh ở [[4-RAG]].

---
### 4️⃣ Vector Store — Lưu và tìm kiếm vector

```python
from langchain_community.vectorstores import FAISS, Chroma
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Tạo vector store từ chunks (embed + lưu 1 bước)
vectorstore = FAISS.from_documents(chunks, embeddings)

# Hoặc dùng Chroma (persistent)
vectorstore = Chroma.from_documents(
    chunks,
    embeddings,
    persist_directory="./chroma_db"  # lưu disk
)

# Tìm kiếm trực tiếp
results = vectorstore.similarity_search("chính sách nghỉ phép", k=4)
# → 4 Document gần nhất
```

**Vector stores có sẵn:**

| Store | Đặc điểm |
|---|---|
| `FAISS` | In-memory, nhanh, Facebook. Tốt cho prototype |
| `Chroma` | Persistent, đơn giản. Tốt cho dev local |
| `Pinecone` | Managed cloud. Tốt cho production |
| `Qdrant` | Self-hosted, performance cao |
| `PGVector` | PostgreSQL extension. Tốt nếu đã có Postgres |

---
### 5️⃣ Retriever — Interface tìm kiếm cho LCEL

Retriever **wrap vector store** thành Runnable — để ghép vào chain bằng `|`.

```python
# Tạo retriever từ vector store
retriever = vectorstore.as_retriever(
    search_type="similarity",   # hoặc "mmr" (diverse results)
    search_kwargs={"k": 4}      # top 4 kết quả
)

# Retriever là Runnable → dùng được trong LCEL
docs = retriever.invoke("chính sách nghỉ phép")
# → [Document, Document, Document, Document]
```

> [!note] 📝
> `similarity` = tìm gần nhất. `mmr` (Maximal Marginal Relevance) = tìm gần nhất **nhưng đa dạng** — tránh trả về 4 chunk nói cùng 1 ý.

---
## 💻 RAG Chain hoàn chỉnh

### Indexing — 1 lần, lưu data vào vector store
```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Load
docs = PyPDFLoader("company_handbook.pdf").load()

# 2. Chunk
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 3. Embed + Store
vectorstore = Chroma.from_documents(
    chunks,
    OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./chroma_db"
)

print(f"Indexed {len(chunks)} chunks")
```

### Querying — Mỗi lần user hỏi
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# Load vector store đã lưu
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-small")
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Trả lời dựa trên context. Nếu không tìm thấy, nói 'Không có thông tin'.\n\nContext:\n{context}"),
    ("human", "{question}")
])

# LCEL chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)

# Chạy
answer = rag_chain.invoke("Chính sách nghỉ phép thế nào?")
print(answer)
```

> [!tip] 💡
> Data flow:
> 1. `"Chính sách nghỉ phép?"` → vào cả 2 nhánh song song
> 2. Nhánh 1: `retriever` tìm 4 chunks → `format_docs` nối thành string → `"context"`
> 3. Nhánh 2: `RunnablePassthrough` giữ nguyên → `"question"`
> 4. `prompt` điền `{context}` + `{question}` → `model` → `parser` → text

---
## 🔍 Retrieval nâng cao

### Multi-query Retriever — Hỏi nhiều cách, tìm nhiều hơn
```python
from langchain.retrievers.multi_query import MultiQueryRetriever

# LLM tự sinh 3 câu hỏi khác nhau từ câu gốc
# → tìm kiếm cả 3 → gộp kết quả → đa dạng hơn
multi_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=ChatOpenAI(model="gpt-4o")
)

# "Chính sách nghỉ phép" → LLM sinh thêm:
# - "Số ngày nghỉ phép hàng năm"
# - "Quy định annual leave"
# → Tìm cả 3 → kết quả phong phú hơn
```

### Contextual Compression — Lọc bớt noise
```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Sau khi retrieve, dùng LLM lọc bớt phần không liên quan
compressor = LLMChainExtractor.from_llm(ChatOpenAI(model="gpt-4o-mini"))
compressed_retriever = ContextualCompressionRetriever(
    base_retriever=retriever,
    base_compressor=compressor
)
# Chunk 500 ký tự → sau compress có thể còn 100 ký tự relevant
```

### Metadata Filtering — Lọc theo nguồn
```python
# Chỉ tìm trong file cụ thể
retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 4,
        "filter": {"source": "policy.pdf"}  # chỉ tìm trong policy.pdf
    }
)
```

---
## ⚠️ Pitfalls

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| Tìm sai document | Chunk quá lớn hoặc quá nhỏ | Thử chunk_size 300-500, test với data thật |
| Trả lời sai dù có document | LLM "lost in the middle" | Giảm k xuống 3-4, đặt chunk quan trọng ở đầu |
| Chậm khi indexing | Embed nhiều chunks | Batch embed, dùng model nhẹ hơn |
| Kết quả trùng lặp | Nhiều chunk nói cùng 1 ý | Dùng `search_type="mmr"` |
| Metadata bị mất | Splitter không giữ metadata | Kiểm tra `split_documents()` thay vì `split_text()` |

---
## 🔗 Concept liên quan
- [[4-RAG]] — RAG bằng raw API (Phase 2) — hiểu bản chất bên dưới
- [[1-LCEL]] — pipe syntax để nối RAG chain
- [[0-LangChain Overview]] — kiến trúc LangChain, component có sẵn
- [[Glossary]] — Chunking, Embedding, Vector Store, RAG, Hybrid Search

---
## 📚 Tham khảo
- 🔥 [LangChain Official — RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) — Tutorial chính thức build RAG từ đầu. Cover loader, splitter, vector store, chain. Đọc đầu tiên.
- 🔥 [LangChain vs LangGraph vs Raw OpenAI — How to Choose Your RAG Stack (Droptica)](https://www.droptica.com/blog/langchain-vs-langgraph-vs-raw-openai-how-choose-your-rag-stack/) — Benchmark performance RAG: latency, token usage, accuracy giữa 3 approach. Có số liệu cụ thể.
- [LangChain — Document Loaders](https://python.langchain.com/docs/integrations/document_loaders/) — Danh sách 700+ loaders. Tra cứu khi cần đọc data từ nguồn cụ thể.
- [LangChain — Text Splitters](https://python.langchain.com/docs/how_to/#text-splitters) — How-to guide cho các chiến lược chunking.
- [LangChain — Retrievers](https://python.langchain.com/docs/how_to/#retrievers) — Multi-query, contextual compression, ensemble retriever và các pattern nâng cao.

---
## ✅ Checklist
- [ ] Biết dùng **Document Loaders** đọc PDF, web, CSV
- [ ] Biết dùng **RecursiveCharacterTextSplitter** chunk documents
- [ ] Biết tạo **vector store** từ chunks (FAISS, Chroma)
- [ ] Biết tạo **retriever** từ vector store + ghép vào LCEL chain
- [ ] Build được **RAG chain hoàn chỉnh**: load → chunk → embed → store → retrieve → generate
- [ ] Biết dùng **metadata filtering** để lọc nguồn
- [ ] Biết `similarity` vs `mmr` search type
- [ ] Hiểu mỗi component LangChain **wrap cái gì** từ Phase 2
