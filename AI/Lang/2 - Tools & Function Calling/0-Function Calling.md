# 🔧 Function Calling — LLM gọi hàm, làm việc thật

> [!quote] 💬
> *"LLM không chỉ trả lời câu hỏi — nó chọn đúng tool, đúng params, đúng lúc. Đó là lúc chatbot trở thành agent."*

---
## 🎯 Function Calling là gì?
Function Calling (hay **Tool Use**) là khả năng LLM **chọn function/tool để gọi** và tạo ra arguments phù hợp — dựa trên câu hỏi của user và danh sách tools mà developer cung cấp.
**Điểm quan trọng:** LLM **không thực thi function** — nó chỉ trả về "tôi muốn gọi hàm X với params Y". App của bạn thực thi rồi trả kết quả lại cho LLM.

> [!note] 📝 So sánh dễ hiểu
> LLM giống **bác sĩ kê đơn** — bác sĩ không tự đi pha thuốc.
> - Bạn mô tả triệu chứng (user prompt)
> - Bác sĩ chọn thuốc + liều lượng (function name + arguments)
> - Y tá đi lấy thuốc (app thực thi function)
> - Bác sĩ xem kết quả xét nghiệm rồi kê tiếp (LLM đọc result, quyết định tiếp)

---
## 🔄 Luồng hoạt động — The Tool Use Loop

Đây là pattern **cốt lõi** mà mọi agent đều dùng:
```
┌─────────────────────────────────────────────────────┐
│  1. User gửi message + danh sách tools              │
│                    ↓                                │
│  2. LLM phân tích → quyết định gọi tool nào        │
│                    ↓                                │
│  3. LLM trả về: tool_name + arguments (JSON)       │
│                    ↓                                │
│  4. App thực thi function → lấy kết quả             │
│                    ↓                                │
│  5. Gửi kết quả lại cho LLM                        │
│                    ↓                                │
│  6. LLM đọc kết quả → trả lời user                 │
│     (hoặc gọi thêm tool khác → quay lại bước 2)    │
└─────────────────────────────────────────────────────┘
```
> [!warning] ⚠️
> Bước 6 là key — LLM có thể **gọi tiếp tool khác** thay vì trả lời ngay. Đây là nền tảng của tool chaining và agent loop. Nếu không có loop → chỉ là 1 lần gọi function, chưa phải agent.

---
## 💻 Code thực tế — Từng bước

### 1️⃣ Định nghĩa Tool (Tool Definition)
Mô tả cho LLM biết **tool nào có sẵn**, nhận params gì, làm gì.
```python
# Tool definition — giống như viết API docs cho LLM đọc
tools = [
    {
        "name": "get_weather",
        "description": "Lấy thời tiết hiện tại của một thành phố",
        "input_schema": {  # Anthropic dùng input_schema
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "Tên thành phố, ví dụ: 'Ho Chi Minh City'"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Đơn vị nhiệt độ"
                }
            },
            "required": ["city"]
        }
    }
]
```
> [!tip] 💡
> **Description quyết định tất cả.** LLM chọn tool dựa trên description, không phải tên hàm. Viết description rõ ràng, cụ thể — giống viết docs cho đồng nghiệp mới.

---
### 2️⃣ Gọi API với Tools

#### Anthropic (Claude)
```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=1024,
    tools=tools,  # danh sách tools
    messages=[
        {"role": "user", "content": "Thời tiết Hà Nội hôm nay thế nào?"}
    ]
)

# Kiểm tra LLM muốn gọi tool hay trả lời text
print(response.stop_reason)  # "tool_use" nếu muốn gọi tool, "end_turn" nếu trả lời text
```

#### OpenAI (GPT)
```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Lấy thời tiết hiện tại của một thành phố",
            "parameters": {  # OpenAI dùng parameters, không phải input_schema
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "Tên thành phố"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city"]
            }
        }
    }],
    messages=[
        {"role": "user", "content": "Thời tiết Hà Nội hôm nay thế nào?"}
    ]
)
```

### So sánh API giữa 2 provider

| | Anthropic (Claude) | OpenAI (GPT) |
|---|---|---|
| **Schema key** | `input_schema` | `parameters` |
| **Tool wrapper** | Trực tiếp trong array | Wrap trong `{"type": "function", "function": {...}}` |
| **Stop reason** | `stop_reason: "tool_use"` | `finish_reason: "tool_calls"` |
| **Kết quả tool** | `response.content` chứa `tool_use` block | `response.choices[0].message.tool_calls` |
| **Tool result** | `role: "user"` + `tool_result` content | `role: "tool"` + `tool_call_id` |

---
### 3️⃣ Xử lý Tool Call & Trả kết quả lại

Đây là phần **app thực thi** — LLM không chạy code, bạn chạy.
#### Anthropic — Full loop
```python
import json

# Bước 1: Gọi API
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "Thời tiết Sài Gòn?"}]
)

# Bước 2: Kiểm tra có tool call không
if response.stop_reason == "tool_use":
    # Lấy tool call từ response
    tool_block = next(b for b in response.content if b.type == "tool_use")
    tool_name = tool_block.name        # "get_weather"
    tool_args = tool_block.input       # {"city": "Ho Chi Minh City"}
    tool_id = tool_block.id            # "toolu_xxx" — ID để match result

    # Bước 3: App thực thi function (code của mình)
    def get_weather(city, unit="celsius"):
        # Gọi weather API thật, ở đây mock
        return {"temp": 32, "unit": "celsius", "condition": "sunny"}

    result = get_weather(**tool_args)

    # Bước 4: Gửi kết quả lại cho LLM
    final_response = client.messages.create(
        model="claude-sonnet-4-6-20250514",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "Thời tiết Sài Gòn?"},
            {"role": "assistant", "content": response.content},  # tool_use block
            {
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": tool_id,  # match với tool call
                    "content": json.dumps(result)
                }]
            }
        ]
    )

    # Bước 5: LLM trả lời user dựa trên kết quả
    print(final_response.content[0].text)
    # "Thời tiết Sài Gòn hôm nay 32°C, trời nắng."
```

#### OpenAI — Full loop
```python
import json

# Bước 1: Gọi API
response = client.chat.completions.create(
    model="gpt-4o",
    tools=[...],  # tool definitions
    messages=[{"role": "user", "content": "Thời tiết Sài Gòn?"}]
)

message = response.choices[0].message

# Bước 2: Kiểm tra tool call
if message.tool_calls:
    tool_call = message.tool_calls[0]
    tool_name = tool_call.function.name          # "get_weather"
    tool_args = json.loads(tool_call.function.arguments)  # parse JSON string

    # Bước 3: Thực thi
    result = get_weather(**tool_args)

    # Bước 4: Gửi lại
    final_response = client.chat.completions.create(
        model="gpt-4o",
        tools=[...],
        messages=[
            {"role": "user", "content": "Thời tiết Sài Gòn?"},
            message,  # assistant message có tool_calls
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            }
        ]
    )

    print(final_response.choices[0].message.content)
```

> [!note] 📝 So sánh dễ hiểu
> Tool use loop giống **chat nhóm 3 người**:
> 1. User hỏi bạn (LLM) → bạn nói "để tôi hỏi thằng kia đã" (tool call)
> 2. Bạn quay sang hỏi thằng kia (app thực thi function)
> 3. Thằng kia trả lời (tool result)
> 4. Bạn tổng hợp rồi trả lời user

---
## 🎛️ Tool Choice — Kiểm soát LLM gọi tool thế nào

| Giá trị | Ý nghĩa | Khi nào dùng |
|---|---|---|
| `auto` (default) | LLM **tự quyết** gọi tool hay trả lời text | Phần lớn trường hợp |
| `any` | **Bắt buộc** gọi 1 tool nào đó | Khi chắc chắn cần gọi tool |
| `{"name": "get_weather"}` | **Force** gọi tool cụ thể | Structured output hack, test |
| `none` | **Không được** gọi tool | Khi chỉ muốn LLM chat |

```python
# Anthropic — force gọi tool cụ thể
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    tools=tools,
    tool_choice={"type": "tool", "name": "get_weather"},  # force
    messages=[...]
)

# OpenAI — force gọi tool cụ thể
response = client.chat.completions.create(
    model="gpt-4o",
    tools=[...],
    tool_choice={"type": "function", "function": {"name": "get_weather"}},
    messages=[...]
)
```

> [!tip] 💡
> `tool_choice` force vào tool cụ thể chính là trick đã dùng ở [[1-Structured Output]] — ép LLM trả JSON đúng schema.

---
## 🔀 Parallel Tool Calls — Gọi nhiều tool cùng lúc

LLM có thể trả về **nhiều tool calls trong 1 response** khi cần data từ nhiều nguồn.
```python
# User: "So sánh thời tiết Hà Nội và Sài Gòn"
# → LLM trả về 2 tool calls cùng lúc:
#    1. get_weather(city="Hanoi")
#    2. get_weather(city="Ho Chi Minh City")
```

**Xử lý parallel tool calls (Anthropic):**
```python
response = client.messages.create(...)

# Response có thể chứa nhiều tool_use blocks
tool_calls = [b for b in response.content if b.type == "tool_use"]

# Thực thi tất cả
results = []
for tc in tool_calls:
    result = execute_tool(tc.name, tc.input)
    results.append({
        "type": "tool_result",
        "tool_use_id": tc.id,
        "content": json.dumps(result)
    })

# Gửi TẤT CẢ results trong 1 message
final = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    tools=tools,
    messages=[
        {"role": "user", "content": "So sánh thời tiết HN và SG"},
        {"role": "assistant", "content": response.content},
        {"role": "user", "content": results}  # tất cả results cùng lúc
    ]
)
```

> [!warning] ⚠️
> Khi LLM gọi parallel, **phải trả tất cả results trong 1 message**. Không được gửi từng result riêng lẻ — API sẽ lỗi.

---
## 🏗️ The Agent Loop — Từ function calling đến agent

Function calling 1 lần chưa phải agent. **Agent = loop**: gọi tool → đọc kết quả → quyết định gọi tiếp hay dừng.
```python
def agent_loop(user_message, tools, max_turns=10):
    messages = [{"role": "user", "content": user_message}]

    for _ in range(max_turns):
        response = client.messages.create(
            model="claude-sonnet-4-6-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # Nếu LLM trả lời text → xong
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Nếu LLM muốn gọi tool → thực thi rồi loop tiếp
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result)
                })

        messages.append({"role": "user", "content": tool_results})

    return "Đạt giới hạn số lượt — dừng lại."
```

> [!danger] ⛔
> Luôn set **`max_turns`** cho agent loop. Không có giới hạn → LLM có thể gọi tool vô hạn, tốn tiền và treo app.

### Loop dừng khi nào?
LLM **tự quyết định** dừng — mỗi response trả về `stop_reason` cho biết nó muốn gì:

| `stop_reason` | Ý nghĩa | Loop |
|---|---|---|
| `"tool_use"` | LLM muốn gọi tool — chưa đủ info | **Tiếp** → thực thi tool, gửi result lại |
| `"end_turn"` | LLM thấy đủ info → trả lời user | **Dừng** → lấy text response làm kết quả |
| `max_turns` hết | Safety net — loop quá nhiều lần | **Dừng cứng** → trả fallback message |

> [!note] 📝 So sánh dễ hiểu
> Giống bạn nhờ ai tra hộ thông tin — họ tra xong 1 cái, thấy chưa đủ thì tra thêm, thấy đủ rồi thì quay lại trả lời. **Tự họ quyết định "đủ chưa"**, nhưng bạn set giới hạn "tra tối đa 10 lần thôi nhé".

### Lấy kết quả như nào?
Kết quả cuối cùng là **text response ở lượt cuối** — lúc `stop_reason == "end_turn"`:
```python
# Trong agent loop:
if response.stop_reason == "end_turn":
    return response.content[0].text  # ← kết quả cuối cùng ở đây
    # LLM đã đọc hết tool results → tổng hợp → trả lời bằng ngôn ngữ tự nhiên
```
LLM không trả raw data từ tool — nó **tổng hợp** tất cả kết quả tool calls rồi viết thành câu trả lời cho user. Ví dụ: tool trả `{"temp": 32, "condition": "sunny"}` → LLM trả "Sài Gòn hôm nay 32°C, trời nắng."

---
## ✍️ Best Practices — Viết tool definition tốt

### ❌ Bad vs ✅ Good

```python
# ❌ Bad — description mơ hồ, LLM không biết khi nào nên gọi
{
    "name": "search",
    "description": "Tìm kiếm",
    "input_schema": {
        "type": "object",
        "properties": {
            "q": {"type": "string"}
        }
    }
}

# ✅ Good — description rõ ràng, params có giải thích
{
    "name": "search_products",
    "description": "Tìm sản phẩm trong database theo tên, category, hoặc khoảng giá. "
                   "Dùng khi user hỏi về sản phẩm, giá cả, hoặc muốn tìm mua gì đó.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Từ khóa tìm kiếm, ví dụ: 'áo thun nam'"
            },
            "category": {
                "type": "string",
                "enum": ["electronics", "fashion", "food"],
                "description": "Lọc theo danh mục sản phẩm"
            },
            "max_price": {
                "type": "number",
                "description": "Giá tối đa (VND)"
            }
        },
        "required": ["query"]
    }
}
```

**Checklist viết tool definition:**
- **Name**: rõ ràng, dạng `verb_noun` (`get_weather`, `search_products`, `send_email`)
- **Description**: mô tả tool làm gì + **khi nào nên dùng**
- **Properties**: mỗi param có description + type rõ ràng
- **Required**: chỉ bắt buộc params thật sự cần, còn lại optional
- **Enum**: dùng khi params có giá trị cố định

---
## ⚠️ Pitfalls thường gặp

| Lỗi | Nguyên nhân | Fix |
|---|---|---|
| LLM **không gọi tool** dù nên gọi | Description quá mơ hồ | Viết rõ "dùng khi user hỏi về X" |
| LLM **gọi sai tool** | Nhiều tool description giống nhau | Phân biệt rõ scope từng tool |
| Arguments **sai kiểu** | Schema không chặt | Dùng `enum`, `required`, Pydantic validate |
| **Hallucinate** argument | LLM bịa giá trị param không có trong input | Validate trước khi thực thi |
| **Infinite loop** | LLM cứ gọi tool mãi | Set `max_turns`, thêm stop condition |
| **Token cost cao** | Tool definitions tốn token mỗi request | Chỉ gửi tools liên quan, không gửi hết |

---
## 📊 Function Calling vs Structured Output

Cả 2 đều ép LLM trả JSON, nhưng **mục đích khác nhau**:

| | Function Calling | Structured Output |
|---|---|---|
| **Mục đích** | LLM **chọn action** để thực thi | LLM **trả data** theo format |
| **Ai thực thi** | App thực thi function → trả kết quả lại | Không thực thi gì — chỉ lấy data |
| **Có loop** | Có — gọi tool → kết quả → gọi tiếp | Không — 1 request, 1 response |
| **Ví dụ** | "Tìm sản phẩm Nike dưới 2 triệu" | "Phân tích sentiment review này" |
| **tool_choice** | `auto` — LLM tự quyết | Force vào tool cụ thể — hack lấy JSON |

> [!tip] 💡
> Structured Output ở [[1-Structured Output]] dùng tool use trick — force `tool_choice` vào 1 tool, lấy JSON mà không thực thi gì. Function Calling thật sự thì dùng `auto` — LLM tự quyết gọi hay không.

---
## 🔗 Concept liên quan
- [[1-Structured Output]] — dùng tool use trick để lấy JSON (Phase 1)
- [[3-API Integration]] — cách gọi API cơ bản (function calling build trên nền này)
- [[Glossary]] — bảng thuật ngữ
- Build Tool — tự tạo tool thật (search, query DB) — note tiếp theo

---
## 📚 Tham khảo
### Docs chính thức
- 🔥 [Anthropic — Tool Use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) — Docs chính thức của Anthropic, cover từ cơ bản đến parallel tool calls và streaming. Đây là reference chính khi build với Claude.
- [OpenAI — Function Calling](https://platform.openai.com/docs/guides/function-calling) — Docs chính thức OpenAI, cover tool definitions, parallel calls, và best practices cho GPT-4o/o3.

### Tutorial & Guide
- 🔥 [Function Calling & Tool Use: The Complete Guide (2026)](https://ofox.ai/blog/function-calling-tool-use-complete-guide-2026/) — Guide toàn diện cover cả 3 provider (OpenAI, Anthropic, Google) với code examples đầy đủ. So sánh API differences giữa các provider.
- [Martin Fowler — Function Calling using LLMs](https://martinfowler.com/articles/function-call-LLM.html) — Bài phân tích kiến trúc từ Martin Fowler. Giải thích rõ flow hoạt động, khi nào nên/không nên dùng function calling, và production patterns.
- [Prompt Engineering Guide — Function Calling](https://www.promptingguide.ai/applications/function_calling) — Phần function calling trong Prompt Engineering Guide. Ngắn gọn, có ví dụ, phù hợp để ôn nhanh concept.

---
## ✅ Checklist
- [ ] Hiểu function calling là **LLM chọn tool + tạo arguments**, không phải LLM chạy code
- [ ] Biết **tool use loop**: gọi API → nhận tool call → thực thi → gửi result lại → lặp
- [ ] Viết được **tool definition** với name, description, input_schema rõ ràng
- [ ] Implement được full loop với **Anthropic** hoặc **OpenAI** SDK
- [ ] Hiểu **tool_choice**: auto, any, force tool cụ thể, none
- [ ] Biết xử lý **parallel tool calls** — gửi tất cả results trong 1 message
- [ ] Biết viết **agent loop** với `max_turns` để tránh infinite loop
- [ ] Phân biệt được **function calling** (action) vs **structured output** (data extraction)
