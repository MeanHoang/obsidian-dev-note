# ⛓️ LCEL — LangChain Expression Language

> [!quote] 💬
> *"LCEL là cách bạn nói cho LangChain biết: lấy cái này, đưa qua cái kia, rồi trả kết quả. Chỉ bằng dấu `|`."*

---
## 🎯 LCEL là gì?
LCEL là **cú pháp ghép nối component** trong LangChain bằng toán tử pipe `|`. Thay vì gọi từng bước thủ công, bạn khai báo **dòng chảy dữ liệu** — data vào từ đầu, chạy qua từng component, ra kết quả cuối.

> [!note] 📝 So sánh dễ hiểu
> LCEL giống **dây chuyền sản xuất trong nhà máy**:
> - Nguyên liệu (input) đặt lên băng chuyền
> - Qua trạm 1 (Prompt Template) → qua trạm 2 (Model) → qua trạm 3 (Parser)
> - Sản phẩm (output) ra ở cuối
> Bạn chỉ cần **nối các trạm bằng `|`** — LCEL lo vận chuyển data giữa các trạm.

---
## 💻 Cú pháp cơ bản — Pipe `|`

### Chain đơn giản nhất
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

# 3 component nối bằng |
chain = ChatPromptTemplate.from_messages([
    ("system", "Bạn là trợ lý hữu ích."),
    ("human", "{question}")
]) | ChatOpenAI(model="gpt-4o") | StrOutputParser()

# Chạy
result = chain.invoke({"question": "LLM là gì?"})
# → "LLM (Large Language Model) là..."
```

### Tách ra cho dễ đọc
```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "Bạn là trợ lý hữu ích."),
    ("human", "{question}")
])
model = ChatOpenAI(model="gpt-4o")
parser = StrOutputParser()

chain = prompt | model | parser
```

### Bên dưới nó hoạt động thế nào?
```python
# chain = prompt | model | parser
# Tương đương với:
prompt_result = prompt.invoke({"question": "LLM là gì?"})  # → ChatPromptValue
model_result = model.invoke(prompt_result)                   # → AIMessage
parser_result = parser.invoke(model_result)                  # → str

# LCEL tự động truyền output của bước trước làm input cho bước sau
```

> [!tip] 💡
> `|` dùng Python `__or__` method. Mỗi component implement [[Glossary#R|Runnable]] interface nên ghép được với nhau — giống USB cắm vào nhau.

---
## 🔄 Runnable Interface — Mỗi component tự động có gì?

Khi nối bằng `|`, chain tự động có **4 cách chạy**:
```python
chain = prompt | model | parser

# 1. invoke — chạy 1 input
result = chain.invoke({"question": "LLM là gì?"})

# 2. batch — chạy nhiều input song song
results = chain.batch([
    {"question": "LLM là gì?"},
    {"question": "RAG là gì?"},
    {"question": "Agent là gì?"}
])
# → ["LLM là...", "RAG là...", "Agent là..."]

# 3. stream — stream output từng token
for chunk in chain.stream({"question": "LLM là gì?"}):
    print(chunk, end="")  # chữ hiện dần như ChatGPT

# 4. ainvoke — async
result = await chain.ainvoke({"question": "LLM là gì?"})
```
> [!warning] ⚠️
> **Bạn không cần viết code batch/stream riêng.** Cứ nối component → LCEL cho miễn phí cả 4 method. Đây là lợi ích lớn nhất so với tự viết bằng raw API.

**So sánh với raw API:**
```python
# ❌ Raw API — muốn stream phải tự viết
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    stream=True  # phải bật flag
)
for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")  # tự xử lý chunk

# ✅ LCEL — stream miễn phí
for chunk in chain.stream({"question": "LLM là gì?"}):
    print(chunk, end="")  # đã format sẵn
```

---
## 🧩 3 Utility quan trọng

### 1️⃣ RunnableLambda — Wrap function bất kỳ thành Runnable

Khi cần chèn **logic custom** vào giữa chain — RunnableLambda biến function thường thành component ghép được.

```python
from langchain_core.runnables import RunnableLambda

# Function thường
def to_uppercase(text: str) -> str:
    return text.upper()

# Wrap thành Runnable → ghép được vào chain
chain = prompt | model | StrOutputParser() | RunnableLambda(to_uppercase)
result = chain.invoke({"question": "Hello"})
# → "LLM LÀ MÔ HÌNH NGÔN NGỮ LỚN..."
```
**Ví dụ thực tế — format document cho RAG:**
```python
def format_docs(docs):
    """Nối các document thành 1 string cho LLM đọc"""
    return "\n\n".join(doc.page_content for doc in docs)

format_step = RunnableLambda(format_docs)
# Dùng trong chain: retriever | format_step | prompt | model
```
> [!tip] 💡
> Cũng có thể dùng **decorator** thay vì wrap thủ công:
> ```python
> from langchain_core.runnables import chain as runnable_chain
>
> @runnable_chain
> def format_docs(docs):
>     return "\n\n".join(doc.page_content for doc in docs)
> # Giờ format_docs đã là Runnable
> ```

---
### 2️⃣ RunnableParallel — Chạy nhiều nhánh song song

Khi cần **nhiều data cùng lúc** — RunnableParallel fork execution rồi gom kết quả thành dict.
```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

# 2 nhánh chạy cùng lúc
setup = RunnableParallel({
    "context": retriever | format_docs,   # nhánh 1: tìm tài liệu
    "question": RunnablePassthrough()     # nhánh 2: giữ nguyên input
})

# Input "LLM là gì?" đi vào cả 2 nhánh cùng lúc
# → Output: {"context": "tài liệu...", "question": "LLM là gì?"}
```

**Hình dung:**
```
                    ┌→ retriever | format_docs → "context"  ─┐
Input "LLM là gì?" ┤                                         ├→ {"context": ..., "question": ...}
                    └→ RunnablePassthrough()  → "question" ─┘
```

**Ví dụ thực tế — RAG chain hoàn chỉnh:**
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages([
    ("system", "Trả lời dựa trên context:\n{context}"),
    ("human", "{question}")
])

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)

answer = rag_chain.invoke("Chính sách nghỉ phép?")
```

> [!note] 📝 Giải thích dòng chảy data
> 1. Input `"Chính sách nghỉ phép?"` đi vào `RunnableParallel`
> 2. Nhánh 1: `retriever` tìm tài liệu → `format_docs` nối thành string → gán vào key `"context"`
> 3. Nhánh 2: `RunnablePassthrough()` giữ nguyên input → gán vào key `"question"`
> 4. Kết quả: `{"context": "Nhân viên được nghỉ 12 ngày...", "question": "Chính sách nghỉ phép?"}`
> 5. Dict này đi vào `prompt` → điền vào `{context}` và `{question}`
> 6. Prompt đi vào `model` → `parser` → text trả lời

---
### 3️⃣ RunnablePassthrough — Truyền input qua không đổi

Dùng khi cần **giữ nguyên data gốc** bên cạnh data đã transform.
```python
from langchain_core.runnables import RunnablePassthrough

# Trong RunnableParallel — giữ question gốc
{"question": RunnablePassthrough()}
# Input "Hello" → Output {"question": "Hello"}

# assign — thêm key mới vào dict hiện có
chain = RunnablePassthrough.assign(
    context=retriever | format_docs
)
# Input {"question": "Hello"}
# → Output {"question": "Hello", "context": "tài liệu..."}
# question giữ nguyên, thêm context
```
> [!tip] 💡
> `RunnablePassthrough.assign()` tiện hơn `RunnableParallel` khi input đã là dict — nó **giữ nguyên tất cả key** và chỉ thêm key mới.

---
## 📐 Patterns thực tế

### Pattern 1: Chain đơn giản — Prompt → Model → Parser
```python
# Task: phân tích sentiment
chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Phân tích sentiment: positive, negative, neutral."),
        ("human", "{text}")
    ])
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)

chain.invoke({"text": "Sản phẩm tuyệt vời!"})
# → "positive"
```

### Pattern 2: Structured Output — Trả Pydantic object
```python
from pydantic import BaseModel, Field

class Sentiment(BaseModel):
    label: str = Field(description="positive, negative, hoặc neutral")
    score: float = Field(ge=0, le=1, description="Độ tin cậy")
    reason: str

chain = (
    ChatPromptTemplate.from_messages([
        ("system", "Phân tích sentiment của text."),
        ("human", "{text}")
    ])
    | ChatOpenAI(model="gpt-4o").with_structured_output(Sentiment)
)

result = chain.invoke({"text": "Giao hàng chậm quá!"})
# result.label = "negative", result.score = 0.9
```

### Pattern 3: Multiple chains — Output chain A → Input chain B
```python
# Chain A: tạo outline
outline_chain = (
    ChatPromptTemplate.from_messages([
        ("human", "Tạo outline 3 ý cho bài viết về: {topic}")
    ])
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)

# Chain B: viết bài từ outline
write_chain = (
    ChatPromptTemplate.from_messages([
        ("human", "Viết bài dựa trên outline:\n{outline}")
    ])
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)

# Nối 2 chain — output chain A thành input chain B
full_chain = (
    {"outline": outline_chain}    # chạy chain A, gán vào key "outline"
    | write_chain                  # chain B nhận {"outline": "..."}
)

article = full_chain.invoke({"topic": "AI Agent"})
```

### Pattern 4: Fallback — Model chính fail thì dùng model phụ
```python
from langchain_anthropic import ChatAnthropic

gpt = ChatOpenAI(model="gpt-4o")
claude = ChatAnthropic(model="claude-sonnet-4-6-20250514")

# GPT fail → tự chuyển sang Claude
resilient_model = gpt.with_fallbacks([claude])

chain = prompt | resilient_model | parser
# Không cần try/catch — LangChain tự retry với fallback
```

### Pattern 5: Conditional — Rẽ nhánh theo điều kiện
```python
from langchain_core.runnables import RunnableLambda, RunnableBranch

# Rẽ nhánh: câu hỏi tiếng Việt → model A, tiếng Anh → model B
chain = RunnableBranch(
    (lambda x: "tiếng việt" in x["question"].lower(), vi_chain),  # điều kiện → chain
    (lambda x: "english" in x["question"].lower(), en_chain),
    default_chain  # không match điều kiện nào → default
)
```

---
## ⚠️ Pitfalls & Anti-patterns

### 1️⃣ Dùng LCEL cho task đơn giản
```python
# ❌ Overkill — LCEL cho 1 lần gọi API
chain = (
    ChatPromptTemplate.from_messages([("human", "{q}")])
    | ChatOpenAI(model="gpt-4o")
    | StrOutputParser()
)
result = chain.invoke({"q": "Hello"})

# ✅ Raw API đơn giản hơn
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)
result = response.choices[0].message.content
```

> [!warning] ⚠️
> LCEL có lợi khi chain **nhiều bước**, cần **batch/stream**, hoặc cần **swap component**. Nếu chỉ gọi 1 API → raw API rõ ràng hơn.

### 2️⃣ Debug khó — stack trace dài
```python
# LCEL wrap nhiều lớp → khi lỗi, stack trace rất dài
# Tip: dùng .invoke() từng bước để debug

# Thay vì chạy cả chain:
# result = chain.invoke(input)

# Debug từng bước:
step1 = prompt.invoke(input)
print("Prompt:", step1)          # xem prompt đã format đúng chưa

step2 = model.invoke(step1)
print("Model:", step2)           # xem model trả gì

step3 = parser.invoke(step2)
print("Parsed:", step3)          # xem parser hoạt động đúng chưa
```

### 3️⃣ Quên xử lý error trong chain
```python
# ❌ Bad — nếu retriever fail → cả chain crash
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt | model | parser
)

# ✅ Good — thêm fallback cho retriever
safe_retriever = retriever.with_fallbacks([
    RunnableLambda(lambda _: [])  # fallback: trả empty list
])

rag_chain = (
    {"context": safe_retriever | format_docs, "question": RunnablePassthrough()}
    | prompt | model | parser
)
```

### 4️⃣ Chain quá dài, khó đọc
```python
# ❌ Bad — 1 chain dài ngoằng
result = (input_parser | validator | preprocessor | prompt | model | parser | postprocessor | formatter).invoke(data)

# ✅ Good — tách thành sub-chains có tên
preprocess = input_parser | validator | preprocessor
llm_step = prompt | model | parser
postprocess = postprocessor | formatter

full_chain = preprocess | llm_step | postprocess
```

---
## 📊 Khi nào dùng LCEL vs Raw API?

| Scenario | Dùng gì | Lý do |
|---|---|---|
| 1 lần gọi API | Raw API | Ít code, rõ ràng |
| Chain 3+ bước | LCEL | Compose dễ, stream/batch miễn phí |
| Cần swap model thường xuyên | LCEL | Đổi 1 component, chain giữ nguyên |
| RAG pipeline | LCEL | RunnableParallel + retriever tiện |
| Prototype nhanh | LCEL | Lắp ghép component nhanh |
| Cần debug chi tiết | Raw API | Nhìn thấy mọi HTTP call |
| Production, cần tối ưu | Tùy | LCEL cho cấu trúc, raw API cho performance |

---
## 🔗 Concept liên quan
- [[0-LangChain Overview]] — kiến trúc LangChain, 4 concept chính
- [[0-Function Calling]] — agent loop mà LCEL wrap lại
- [[4-RAG]] — RAG bằng raw API (Phase 2) vs LCEL (Phase 3)
- [[Glossary]] — Runnable, LCEL

---
## 📚 Tham khảo
- 🔥 [LCEL Explained — Aurelio AI](https://www.aurelio.ai/learn/langchain-lcel) — Deep dive vào pipe syntax, Runnable interface, RunnableParallel. Có diagram trực quan giúp hiểu data flow.
- 🔥 [LCEL Explained — Pinecone Learn](https://www.pinecone.io/learn/series/langchain/langchain-expression-language/) — Tutorial từ Pinecone, step-by-step từ chain đơn giản đến RAG chain phức tạp. Nhiều code examples.
- [LangChain Official — LCEL How-to Guides](https://python.langchain.com/docs/how_to/#langchain-expression-language-lcel) — Docs chính thức, cover mọi pattern: chaining, parallel, fallback, routing. Reference khi cần tra cú pháp.
- [LangChain in 2026: 5 Concepts for 90% of Use Cases](https://medium.com/@vapbooksfeedback/tech-54-langchain-in-2026-the-5-concepts-that-handle-90-of-real-use-cases-19a96f654ba2) — LCEL là 1 trong 5 concepts cốt lõi. Giải thích ngắn gọn, thực tế.
- [LangChain Architecture Deep Dive](https://medium.com/@gaurang063/langchain-architecture-deep-dive-9dfe600c8dff) — Phân tích Runnable interface chi tiết — hiểu tại sao `|` hoạt động được.

---
## ✅ Checklist
- [ ] Hiểu LCEL = **pipe syntax** nối component bằng `|`
- [ ] Biết mỗi component trong chain là **Runnable** → tự có invoke/batch/stream/ainvoke
- [ ] Dùng được **RunnableLambda** để wrap function custom vào chain
- [ ] Dùng được **RunnableParallel** để fork nhiều nhánh song song
- [ ] Dùng được **RunnablePassthrough** và `.assign()` để giữ/thêm data
- [ ] Biết **debug** chain bằng cách invoke từng bước
- [ ] Biết **khi nào dùng LCEL** (chain nhiều bước) vs **raw API** (task đơn giản)
- [ ] Build được **RAG chain** hoàn chỉnh bằng LCEL
