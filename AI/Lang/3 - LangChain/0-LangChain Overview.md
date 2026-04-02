# ⛓️ LangChain Overview — Framework hay cái bẫy?

> [!quote] 💬
> *"Hiểu abstraction của LangChain, dùng khi nó tiết kiệm thời gian, bỏ khi nó cản đường."*

---
## 🎯 LangChain là gì?
LangChain là **framework Python/TypeScript** giúp build ứng dụng LLM nhanh hơn — wrap sẵn prompt, model, parser, RAG, agent... thành các component lắp ghép được. Thay vì tự viết mọi thứ bằng raw API, bạn dùng abstraction có sẵn.

> [!note] 📝 So sánh dễ hiểu
> Raw API giống **nấu ăn từ nguyên liệu thô** — mua thịt, rau, gia vị, tự chế biến. Hiểu rõ từng bước, kiểm soát hoàn toàn.
> LangChain giống **meal kit** — nguyên liệu đã cắt sẵn, có công thức kèm theo. Nhanh hơn, nhưng nếu muốn thay đổi recipe thì phải hiểu bên trong có gì.
> **Phase 1 + 2 đã dạy bạn nấu từ đầu. Phase 3 cho bạn meal kit — tiện nhưng không phụ thuộc.**

---
## 🏗️ Kiến trúc LangChain 1.0 (2026)

LangChain 1.0 (ra mắt tháng 11/2025) chia thành nhiều package riêng biệt:
```
langchain-core            ← Nền tảng: LCEL, Runnable interface, abstractions
                            KHÔNG có dependency AI provider nào

langchain-openai          ← OpenAI integration
langchain-anthropic       ← Anthropic integration
langchain-google-genai    ← Google integration

langchain-community       ← Community integrations (FAISS, ChromaDB...)
langchain                 ← High-level orchestration (create_agent...)
langgraph                 ← Agent runtime (graph-based, thay AgentExecutor)
langsmith                 ← Observability/tracing (commercial, free tier)
```

**Nguyên tắc:** `langchain-core` định nghĩa abstract interface. Provider packages implement. Bạn code against abstraction → **swap provider** mà không đổi logic.

### Import guide hiện tại (2026)
```python
# ✅ Đúng — import từ provider packages
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# ✅ Đúng — import từ core
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.tools import tool
from langchain_core.output_parsers import StrOutputParser

# ❌ Sai — deprecated, đừng dùng
# from langchain.chains import LLMChain
# from langchain.chat_models import ChatOpenAI
# from langchain.agents import initialize_agent
```

### Lịch sử version (để hiểu khi đọc tutorial cũ)

| Version | Thời điểm | Thay đổi |
|---|---|---|
| **0.0.x** | 2022-2023 | Monolithic, mọi thứ 1 package |
| **0.1.0** | Jan 2024 | Core split, LCEL ra đời, `LLMChain` deprecated |
| **0.2.0** | May 2024 | `AgentExecutor` deprecated → LangGraph |
| **0.3.0** | Sep 2024 | Pydantic v2 bắt buộc |
| **1.0.0** | Nov 2025 | `create_agent`, middleware, stability commitment |

> [!warning] ⚠️
> **Rất nhiều tutorial trên mạng dùng API cũ.** Nếu thấy `LLMChain`, `ConversationBufferMemory`, `initialize_agent` → đó là code deprecated. Đừng copy.

---
## 🧩 4 Concept chính

### 1️⃣ Prompt Template — Template có biến
Giống f-string nhưng **cho LLM** — định nghĩa cấu trúc prompt, điền biến lúc runtime.
```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Basic — biến {role} và {question} được điền khi gọi
prompt = ChatPromptTemplate.from_messages([
    ("system", "Bạn là một {role} giỏi."),
    ("human", "{question}")
])

# Với chat history — MessagesPlaceholder chèn list messages
prompt_with_history = ChatPromptTemplate.from_messages([
    ("system", "Bạn là trợ lý hữu ích."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{user_input}")
])
```

**So sánh với raw API:**
```python
# Raw API — bạn tự format string
messages = [
    {"role": "system", "content": f"Bạn là một {role} giỏi."},
    {"role": "user", "content": question}
]

# LangChain — template + invoke
result = prompt.invoke({"role": "data analyst", "question": "Phân tích data này"})
# → Trả về ChatPromptValue chứa messages đã format
```

> [!tip] 💡
> Prompt Template hữu ích khi bạn có **nhiều prompt phức tạp** cần reuse. Nếu chỉ có 1-2 prompt đơn giản → f-string là đủ.

---
### 2️⃣ Model — Wrapper thống nhất cho mọi LLM

LangChain wrap mọi LLM provider vào **cùng một interface**:
```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# Khởi tạo — API giống nhau
gpt = ChatOpenAI(model="gpt-4o", temperature=0)
claude = ChatAnthropic(model="claude-sonnet-4-6-20250514", temperature=0)

# Gọi — API giống nhau
response = gpt.invoke("Hello")      # AIMessage(content="Hi there!")
response = claude.invoke("Hello")   # AIMessage(content="Hi there!")

# Swap provider = đổi 1 dòng, không đổi logic
```

**Tính năng hữu ích:**
```python
# Fallback — model chính fail thì dùng model phụ
resilient = gpt.with_fallbacks([claude])

# Structured output — Pydantic model, dùng native tool calling
from pydantic import BaseModel, Field

class Review(BaseModel):
    rating: int = Field(ge=1, le=10)
    summary: str

structured = gpt.with_structured_output(Review)
review = structured.invoke("Review MacBook Pro M3")
print(review.rating)  # int, validated
```

**So sánh với raw API:**
```python
# Raw API — mỗi provider 1 cách gọi
# OpenAI
response = openai_client.chat.completions.create(model="gpt-4o", messages=[...])
text = response.choices[0].message.content

# Anthropic
response = anthropic_client.messages.create(model="claude-sonnet-4-6-20250514", messages=[...])
text = response.content[0].text

# LangChain — cùng 1 API cho cả 2
response = model.invoke("Hello")
text = response.content
```

> [!tip] 💡
> **Model wrapper là lợi ích lớn nhất** của LangChain — swap provider chỉ đổi 1 import. Với raw API, bạn phải sửa code ở nhiều chỗ vì mỗi provider API khác nhau.

---
### 3️⃣ Output Parser — Parse output thành data có cấu trúc

**Cách mới (khuyến nghị 2026) — `with_structured_output`:**
```python
from pydantic import BaseModel
from langchain_openai import ChatOpenAI

class Sentiment(BaseModel):
    label: str    # "positive", "negative", "neutral"
    score: float  # 0.0 - 1.0
    reason: str

model = ChatOpenAI(model="gpt-4o")
structured = model.with_structured_output(Sentiment)
result = structured.invoke("Sản phẩm tuyệt vời, giao hàng nhanh!")
# result.label = "positive", result.score = 0.95
```

**Cách cũ (vẫn dùng được) — OutputParser:**
```python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

# StrOutputParser — lấy text thuần
chain = prompt | model | StrOutputParser()
text = chain.invoke({"question": "Hello"})  # str

# JsonOutputParser — parse JSON (không enforce schema)
chain = prompt | model | JsonOutputParser()
data = chain.invoke({"question": "..."})  # dict
```

**So sánh với raw API:**
```python
# Raw API — tự parse
response = client.chat.completions.create(...)
text = response.choices[0].message.content
data = json.loads(text)  # có thể fail nếu LLM trả sai format

# LangChain — with_structured_output dùng tool calling bên dưới
# → Đảm bảo đúng schema, trả Pydantic object validated
```

> [!tip] 💡
> `with_structured_output` bên dưới dùng **tool calling** — chính là trick đã học ở [[1-Structured Output|Phase 1: Structured Output]]. LangChain chỉ wrap lại cho gọn.

---
### 4️⃣ Memory — Nhớ hội thoại (đã chuyển sang LangGraph)

> [!danger] ⛔
> **Tất cả Memory class cũ đã deprecated:**
> - `ConversationBufferMemory` ❌
> - `ConversationSummaryMemory` ❌
> - `ConversationChain` ❌
>
> Nếu tutorial nào dùng những class này → **đừng follow.**

**Cách hiện tại (2026) — LangGraph Checkpointer:**
```python
from langgraph.checkpoint.memory import MemorySaver  # in-memory (dev)
# from langgraph.checkpoint.sqlite import SqliteSaver  # persistent (prod)

memory = MemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[get_weather],
    checkpointer=memory
)

# Mỗi user có thread_id riêng → state tách biệt
config = {"configurable": {"thread_id": "user_456"}}
response1 = agent.invoke("Tôi muốn đi Đà Lạt", config=config)
response2 = agent.invoke("Thời tiết ở đó thế nào?", config=config)
# Agent nhớ "Đà Lạt" từ message trước
```

**So sánh với raw API:**
```python
# Raw API — tự quản lý messages array
messages = []
messages.append({"role": "user", "content": "Tôi muốn đi Đà Lạt"})
response = client.messages.create(model="...", messages=messages)
messages.append({"role": "assistant", "content": response.content[0].text})
messages.append({"role": "user", "content": "Thời tiết ở đó?"})
# Bạn tự quản lý list này — đơn giản nhưng phải tự handle persistence

# LangGraph — checkpointer tự lưu/load state
# MemorySaver: in-memory (mất khi restart)
# SqliteSaver: persistent (lưu disk)
# PostgresSaver: production (lưu DB)
```

> [!note] 📝
> Memory thực chất là **vấn đề state management**, không phải vấn đề LLM. LangGraph xử lý đúng hơn bằng cách tách memory ra khỏi chain → thành checkpointer cho graph.

---
## ⛓️ LCEL — LangChain Expression Language
LCEL là **cách ghép các component** bằng toán tử `|` (pipe). Mỗi component implement `Runnable` interface.
### Cú pháp cơ bản
```python
chain = prompt | model | parser
result = chain.invoke({"question": "Hello"})

# Tương đương với:
prompt_result = prompt.invoke({"question": "Hello"})
model_result = model.invoke(prompt_result)
parser_result = parser.invoke(model_result)
```

### Runnable interface — mỗi component có sẵn
```python
chain.invoke(input)        # Chạy 1 lần
chain.batch([input1, ...]) # Chạy nhiều input song song
chain.stream(input)        # Stream output từng token
await chain.ainvoke(input) # Async
```

### 3 utility quan trọng
**RunnableLambda** — wrap function bất kỳ thành Runnable:
```python
from langchain_core.runnables import RunnableLambda

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

format_step = RunnableLambda(format_docs)
# Giờ dùng được trong chain: retriever | format_step | prompt
```

**RunnableParallel** — chạy nhiều nhánh song song:
```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

# 2 nhánh chạy cùng lúc, kết quả merge thành dict
setup = RunnableParallel({
    "context": retriever | format_docs,   # nhánh 1: tìm tài liệu
    "question": RunnablePassthrough()     # nhánh 2: giữ nguyên input
})

rag_chain = setup | prompt | model | parser
```

**RunnablePassthrough** — truyền input qua không đổi:
```python
# Dùng trong RunnableParallel khi cần giữ nguyên input gốc
# bên cạnh data đã transform
{"question": RunnablePassthrough()}  # input gốc → key "question"
```

---
## 📐 So sánh: Raw API vs LangChain

### Task đơn giản — Raw API thắng
```python
# ❌ LangChain — nhiều import, nhiều abstraction, cùng kết quả
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

chain = (
    ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant."),
        ("human", "{question}")
    ])
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)
print(chain.invoke({"question": "Explain quantum computing"}))
```

```python
# ✅ Raw API — ít code hơn, rõ ràng hơn
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing"}
    ]
)
print(response.choices[0].message.content)
```

### RAG Pipeline — LangChain bắt đầu có lợi
```python
# LangChain — declarative, composable
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader

# Load → chunk → embed → store (LangChain lo hết)
docs = PyPDFLoader("handbook.pdf").load()
chunks = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
).split_documents(docs)
vectorstore = FAISS.from_documents(chunks, OpenAIEmbeddings())
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# Chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)
answer = rag_chain.invoke("Chính sách hoàn tiền?")
```

```python
# Raw API — tự handle từng bước
from openai import OpenAI
import chromadb

client = OpenAI()
collection = chroma.get_collection("docs")

query_embedding = client.embeddings.create(
    model="text-embedding-3-large", input="Chính sách hoàn tiền?"
).data[0].embedding

results = collection.query(query_embeddings=[query_embedding], n_results=4)
context = "\n\n".join(results["documents"][0])

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": f"Trả lời từ context:\n{context}"},
        {"role": "user", "content": "Chính sách hoàn tiền?"}
    ]
)
```

### Bảng tổng hợp

| Scenario | Winner | Lý do |
|---|---|---|
| Prompt → response đơn giản | **Raw API** | Ít code, không dependency, full control |
| Swap provider (OpenAI ↔ Anthropic) | **LangChain** | Đổi 1 import, cùng chain |
| RAG pipeline | **LangChain** (nhỉnh) | Loader, splitter, retriever có sẵn |
| Agent phức tạp, có state | **LangGraph** | State management, conditional routing |
| Debug production issue | **Raw API** | Nhìn thấy mọi thứ, không abstraction layer |
| Prototype nhanh | **LangChain** | Lắp ghép component nhanh |
| Docker image nhỏ | **Raw API** | LangChain kéo nhiều dependency |
| Observability | **LangChain + LangSmith** | Tracing, eval free tier |

---
## ⚠️ Những điều cần biết trước khi dùng
### Ưu điểm thực sự
- **Swap provider dễ** — cùng interface cho OpenAI, Anthropic, Google
- **Ecosystem lớn** — 700+ integrations (loaders, vector stores, tools)
- **Built-in features** — caching, fallback, streaming, batch
- **LangSmith** — tracing/observability miễn phí
### Nhược điểm thực sự
- **Abstraction quá nhiều lớp** — debug khó, stack trace dài
- **Dependency bloat** — Docker image nặng hơn đáng kể
- **Performance overhead** — ~10ms overhead per call (so với ~6ms LlamaIndex)
- **Version churn** — API thay đổi nhiều (đã ổn hơn từ 1.0)
- **Security** — đã có report lỗ hổng deserialization, path traversal (Mar 2026)
- **Overkill cho task đơn giản** — thêm complexity không cần thiết

### Khi nào KHÔNG nên dùng LangChain
- Prompt → response đơn giản (raw API rõ ràng hơn)
- Cần kiểm soát hoàn toàn mọi HTTP call
- Cần Docker image nhỏ / ít dependency
- Team debug khó qua abstraction layers
- Chỉ dùng 1 LLM provider duy nhất
### Alternatives nhẹ hơn
| Tool | Mục đích |
|---|---|
| **`openai` / `anthropic` SDK** | Raw API, full control |
| **`instructor`** | Structured output (Pydantic), hoạt động với mọi provider |
| **`litellm`** | Unified API cho 100+ providers (nhẹ hơn LangChain) |
| **`llamaindex`** | Chuyên RAG (focus hơn LangChain) |

---
## 📐 Deprecated → Current cheat sheet

| Cũ (deprecated) ❌ | Mới (current) ✅ |
|---|---|
| `from langchain.chains import LLMChain` | LCEL pipe syntax |
| `from langchain.chat_models import ChatOpenAI` | `from langchain_openai import ChatOpenAI` |
| `from langchain.schema import HumanMessage` | `from langchain_core.messages import HumanMessage` |
| `from langchain.agents import initialize_agent` | `from langchain.agents import create_agent` |
| `ConversationBufferMemory` | LangGraph checkpointer |
| `AgentExecutor` | LangGraph |

---
## 🔗 Concept liên quan
- [[1-Structured Output]] — LangChain `with_structured_output` wrap trick này
- [[0-Function Calling]] — Agent loop mà LangChain wrap lại
- [[4-RAG]] — RAG pipeline bằng raw API (Phase 2) vs LangChain (Phase 3)
- [[Glossary]] — bảng thuật ngữ

---
## 📚 Tham khảo
- 🔥 [LangChain's Evolution to 1.0 — Complete Guide (Feb 2026)](https://medium.com/@pramod21/the-complete-guide-to-langchains-evolution-why-everything-changed-and-how-to-build-with-1-0-2b582874a893) — Lịch sử từ 0.0.x đến 1.0, migration guide, deprecated patterns. Đọc đầu tiên để hiểu bức tranh tổng.
- 🔥 [LangChain in 2026: 5 Concepts That Handle 90% of Use Cases (Feb 2026)](https://medium.com/@vapbooksfeedback/tech-54-langchain-in-2026-the-5-concepts-that-handle-90-of-real-use-cases-19a96f654ba2) — Tập trung vào 5 concept cốt lõi: LCEL, ChatModel, Tools, Retriever, LangGraph. Thực tế, không lan man.
- [LCEL Explained — Aurelio AI](https://www.aurelio.ai/learn/langchain-lcel) — Deep dive vào LCEL pipe syntax, Runnable interface, RunnableParallel. Có diagram trực quan.
- [Why We No Longer Use LangChain (OctoClaw)](https://octoclaw.ai/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents) — Phân tích thực tế tại sao 1 team bỏ LangChain. Đọc để hiểu trade-off, không phải để sợ framework.
- [LangChain vs LangGraph vs Raw OpenAI (Droptica)](https://www.droptica.com/blog/langchain-vs-langgraph-vs-raw-openai-how-choose-your-rag-stack/) — Benchmark performance: latency, token usage, accuracy. Có số liệu cụ thể.

---
## ✅ Checklist
- [ ] Hiểu kiến trúc: **langchain-core** → provider packages → langchain → langgraph
- [ ] Biết **import đúng** — không dùng deprecated imports
- [ ] Hiểu 4 concept: **Prompt Template, Model, Output Parser, Memory** (→ LangGraph)
- [ ] Hiểu **LCEL** — pipe syntax, Runnable interface, invoke/batch/stream
- [ ] Biết 3 utility: **RunnableLambda, RunnableParallel, RunnablePassthrough**
- [ ] Biết `with_structured_output` thay cho OutputParser cũ
- [ ] Biết Memory class cũ **deprecated** → dùng LangGraph Checkpointer
- [ ] Hiểu **khi nào dùng / không dùng** LangChain — trade-off rõ ràng
- [ ] Biết so sánh **raw API vs LangChain** cho cùng 1 task
