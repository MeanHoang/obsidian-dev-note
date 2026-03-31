# 🔌 API Integration — Gọi LLM API trực tiếp

> [!quote] 💬
> *"Đừng học framework trước khi biết gọi API. Framework che giấu chi tiết — khi lỗi xảy ra, bạn cần hiểu chuyện gì đang xảy ra bên dưới."*

---
## 🎯 API Integration là gì?
Gọi LLM qua **HTTP API** hoặc **SDK** — gửi prompt, nhận response, trả tiền theo [[Glossary#T|token]]. Đây là cách **trực tiếp nhất** để tương tác với LLM, không qua framework nào.

> [!note] 📝 So sánh dễ hiểu
> Gọi API giống **gọi điện cho luật sư**:
> - Bạn gọi (API call) → nói vấn đề (prompt) → luật sư trả lời (response) → trả tiền theo phút (token)
> - Framework (LangChain) giống **thuê thư ký gọi hộ** — tiện nhưng bạn không biết thư ký nói gì với luật sư
> - Học gọi trực tiếp trước → sau này dùng thư ký vẫn kiểm soát được

---
## 🏗️ Cấu trúc 1 API call

Mọi LLM API đều theo pattern giống nhau:
```
Request:
  - Model: chọn model nào (gpt-4o, claude-sonnet...)
  - Messages: mảng các message (system + user + assistant)
  - Config: temperature, max_tokens, top_p...

Response:
  - Content: text trả lời
  - Usage: số token đã dùng (input + output)
  - Stop reason: dừng vì hết câu hay hết token
```

---
## 🔑 Lấy API Key

### OpenAI
1. Vào [platform.openai.com](https://platform.openai.com) → API Keys → Create
2. Lưu vào `.env` — **không commit lên git**

### Anthropic
1. Vào [console.anthropic.com](https://console.anthropic.com) → API Keys → Create
2. Lưu vào `.env`
```bash
# .env
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
```

> [!danger] ⛔
> **Không bao giờ** hardcode API key trong code hoặc commit lên git. Dùng `.env` + `.gitignore`. API key bị leak = người khác xài tiền của bạn.

---
## 📦 Cài đặt SDK
```bash
# OpenAI
pip install openai

# Anthropic
pip install anthropic
```

---
## 💻 Gọi API — Ví dụ thực tế

### 1️⃣ OpenAI (Chat Completions)
```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Bạn là trợ lý hữu ích."},
        {"role": "user", "content": "Python list comprehension là gì?"}
    ],
    temperature=0.7,  # mức sáng tạo
    max_tokens=500    # giới hạn output
)

# Lấy text trả lời
print(response.choices[0].message.content)

# Xem token đã dùng
print(response.usage)
# Usage(prompt_tokens=25, completion_tokens=150, total_tokens=175)
```

### 2️⃣ Anthropic (Messages API)
```python
from anthropic import Anthropic
import os

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=500,
    system="Bạn là trợ lý hữu ích.",  # system prompt tách riêng
    messages=[
        {"role": "user", "content": "Python list comprehension là gì?"}
    ],
    temperature=0.7
)

# Lấy text trả lời
print(response.content[0].text)

# Xem token đã dùng
print(response.usage)
# Usage(input_tokens=22, output_tokens=140)
```

### So sánh 2 API

| | OpenAI | Anthropic |
|---|---|---|
| **System prompt** | Nằm trong `messages` array | Tách riêng param `system` |
| **Response** | `response.choices[0].message.content` | `response.content[0].text` |
| **Token usage** | `prompt_tokens` + `completion_tokens` | `input_tokens` + `output_tokens` |
| **Model format** | `"gpt-4o"` | `"claude-sonnet-4-6-20250514"` |

---
## 💬 Messages — Cách hội thoại hoạt động
LLM **stateless** ([[0-LLM Overview#LLM stateless — không nhớ gì giữa các request|không nhớ gì giữa các request]]). Muốn hội thoại nhiều lượt → gửi lại **toàn bộ lịch sử** mỗi lần.

```python
# ❌ Bad — nghĩ LLM tự nhớ
# Lần 1
messages = [{"role": "user", "content": "Tôi tên Minh"}]
call_api(messages)  # "Xin chào Minh!"

# Lần 2 — LLM KHÔNG biết bạn là ai
messages = [{"role": "user", "content": "Tên tôi là gì?"}]
call_api(messages)  # "Tôi không biết tên bạn"
```

```python
# ✅ Good — gửi lại history
messages = [
    {"role": "user", "content": "Tôi tên Minh"},
    {"role": "assistant", "content": "Xin chào Minh!"},
    {"role": "user", "content": "Tên tôi là gì?"}
]
call_api(messages)  # "Bạn tên là Minh"
```

### 3 loại role trong messages

| Role | Là gì | Khi nào dùng |
|---|---|---|
| `system` | Đặt hành vi cho model | 1 lần ở đầu conversation |
| `user` | Input của người dùng | Mỗi lượt user nói |
| `assistant` | Response của model | Gửi lại response cũ để model "nhớ" |

---
## 🌊 Streaming — Nhận response từng phần

Mặc định API trả **1 cục** sau khi sinh xong toàn bộ. Streaming cho phép nhận **từng chunk** — giống ChatGPT chữ hiện dần.

```python
# OpenAI streaming
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Giải thích Docker"}],
    stream=True  # bật streaming
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)  # in từng phần
```

```python
# Anthropic streaming
with client.messages.stream(
    model="claude-sonnet-4-6-20250514",
    max_tokens=500,
    messages=[{"role": "user", "content": "Giải thích Docker"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

> [!tip] 💡
> Streaming **không giảm tổng thời gian** — model vẫn sinh cùng số token. Nhưng user **thấy chữ ngay** thay vì đợi 5-10 giây trắng màn hình → UX tốt hơn nhiều.

---
## 💰 Token & Chi phí
### Cách tính tiền
```
Chi phí = (input_tokens × giá_input) + (output_tokens × giá_output)
```

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o-mini | $0.15 | $0.60 |
| Claude Sonnet | $3.00 | $15.00 |
| Claude Haiku | $0.25 | $1.25 |

> [!warning] ⚠️
> **Output token đắt hơn input 3-5x**. Nên giới hạn `max_tokens` hợp lý và dùng system prompt để bảo model trả lời ngắn gọn khi không cần dài.
### Ước lượng nhanh
- 1 trang A4 tiếng Anh ~ 500 tokens
- 1 trang A4 tiếng Việt ~ 700-800 tokens (tiếng Việt tốn token hơn)
- Cuộc chat 10 lượt ~ 2,000-5,000 tokens

---
## ⚠️ Error Handling
Các lỗi hay gặp khi gọi API:

```python
from openai import (
    APIError,
    RateLimitError,
    APIConnectionError
)

try:
    response = client.chat.completions.create(...)
except RateLimitError:
    # Gọi quá nhiều request/phút → đợi rồi thử lại
    print("Rate limited — đợi rồi retry")
except APIConnectionError:
    # Mất kết nối
    print("Không kết nối được API")
except APIError as e:
    # Lỗi từ server
    print(f"API error: {e.status_code}")
```

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `401 Unauthorized` | API key sai hoặc hết hạn | Kiểm tra lại key |
| `429 Rate Limit` | Gọi quá nhiều/quá nhanh | Retry với exponential backoff |
| `400 Bad Request` | Prompt quá dài, params sai | Kiểm tra input, giảm token |
| `500/503` | Server provider lỗi | Retry sau vài giây |

> [!tip] 💡
> Cả OpenAI SDK và Anthropic SDK đều có **auto-retry** cho lỗi tạm thời (429, 500, 503). Không cần tự viết retry logic cho những lỗi này.

---
## 🔗 Concept liên quan
- [[0-LLM Overview]] — LLM hoạt động thế nào
- [[2-Prompt Engineering]] — cách viết prompt hiệu quả
- [[Glossary]] — bảng thuật ngữ
- [[1-Structured Output]] — bắt LLM trả JSON đúng format

---
## ✅ Checklist — Bạn đã nắm API Integration chưa?
- [ ] Biết lấy API key và lưu an toàn trong `.env`
- [ ] Gọi được API bằng SDK (OpenAI hoặc Anthropic)
- [ ] Hiểu cấu trúc `messages` — system, user, assistant
- [ ] Biết gửi lại chat history để duy trì hội thoại
- [ ] Biết dùng **streaming** để cải thiện UX
- [ ] Hiểu cách tính **token & chi phí**
- [ ] Xử lý được các lỗi cơ bản (rate limit, auth, connection)
