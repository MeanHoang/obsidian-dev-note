# ⛓️ Tool Chaining — Nối nhiều tool giải quyết task phức tạp

> [!quote] 💬
> *"1 tool = 1 hành động. Chain nhiều tool lại = giải quyết được vấn đề thật sự."*

---
## 🎯 Tool Chaining là gì?
Tool Chaining là khi LLM **gọi nhiều tool liên tiếp**, output của tool trước làm input cho tool sau. Đây là cách LLM giải quyết task phức tạp mà **1 tool không làm nổi**.

> [!note] 📝 So sánh dễ hiểu
> Giống **đặt hàng online**:
> 1. Tìm sản phẩm (search) → 2. Kiểm tra tồn kho (query DB) → 3. Tính phí ship (gọi API) → 4. Đặt hàng (create order)
> Mỗi bước phụ thuộc bước trước — không biết sản phẩm thì không kiểm tra tồn kho được.
> LLM **tự quyết** chuỗi bước nào cần gọi — bạn chỉ cung cấp tools.

---
## 🔀 Tool Chaining vs Parallel Tool Calls

| | Tool Chaining | Parallel Tool Calls |
|---|---|---|
| **Kiểu** | Sequential — lần lượt | Parallel — cùng lúc |
| **Phụ thuộc** | Tool B cần kết quả tool A | Các tool độc lập nhau |
| **Ví dụ** | Tìm SP → check tồn kho → đặt hàng | Lấy thời tiết HN + SG cùng lúc |
| **Ai quyết định** | LLM tự chọn tool tiếp theo mỗi lượt | LLM gọi nhiều tool trong 1 response |
| **Số API calls** | Nhiều (mỗi tool = 1 round trip) | Ít hơn (nhiều tool = 1 round trip) |

> [!tip] 💡
> LLM có thể **kết hợp cả 2**: trong 1 chain, có bước gọi parallel (lấy data từ 2 nguồn cùng lúc) rồi bước sau dùng cả 2 kết quả.

---
## 💻 Ví dụ thực tế — Travel Assistant

User: *"Tôi muốn đi Đà Lạt cuối tuần này, thời tiết thế nào và có khách sạn nào dưới 1 triệu không?"*
### LLM tự chain 3 tool calls:
```
Lượt 1: LLM gọi get_weather("Da Lat")
         → Kết quả: 18°C, mưa nhẹ

Lượt 2: LLM đọc kết quả thời tiết → gọi search_hotels("Da Lat", max_price=1000000)
         → Kết quả: 3 khách sạn phù hợp

Lượt 3: LLM tổng hợp cả 2 kết quả → trả lời user:
         "Đà Lạt cuối tuần 18°C, mưa nhẹ. Có 3 KS dưới 1 triệu:
          1. Dream Hotel — 800k/đêm
          2. Pine Villa — 650k/đêm
          3. Cozy Stay — 900k/đêm
          Nhớ mang áo khoác vì trời lạnh!"
```

### Code hoàn chỉnh:
```python
from anthropic import Anthropic
import json

client = Anthropic()

# Tools
tools = [
    {
        "name": "get_weather",
        "description": "Lấy thời tiết của thành phố. Dùng khi user hỏi về thời tiết hoặc cần biết thời tiết để gợi ý.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "Tên thành phố"}
            },
            "required": ["city"]
        }
    },
    {
        "name": "search_hotels",
        "description": "Tìm khách sạn theo thành phố và giá tối đa. Dùng khi user muốn tìm chỗ ở.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string"},
                "max_price": {"type": "number", "description": "Giá tối đa (VND/đêm)"}
            },
            "required": ["city"]
        }
    }
]

# Tool implementations
TOOL_MAP = {
    "get_weather": lambda city: json.dumps({"temp": 18, "condition": "light rain"}),
    "search_hotels": lambda city, max_price=None: json.dumps([
        {"name": "Dream Hotel", "price": 800000},
        {"name": "Pine Villa", "price": 650000},
        {"name": "Cozy Stay", "price": 900000}
    ])
}

def execute_tool(name, args):
    return TOOL_MAP[name](**args)

# Agent loop — chạy đến khi LLM trả lời text
def run(user_msg):
    messages = [{"role": "user", "content": user_msg}]

    for turn in range(10):
        response = client.messages.create(
            model="claude-sonnet-4-6-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # LLM trả lời text → chain kết thúc
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # LLM muốn gọi tool → thực thi rồi loop
        messages.append({"role": "assistant", "content": response.content})
        results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })
                print(f"  [Turn {turn+1}] {block.name}({block.input}) → {result}")
        messages.append({"role": "user", "content": results})

    return "Quá nhiều bước — dừng lại."

answer = run("Đi Đà Lạt cuối tuần, thời tiết sao? KS dưới 1 triệu?")
print(answer)
```

**Output log:**
```
  [Turn 1] get_weather({"city": "Da Lat"}) → {"temp": 18, "condition": "light rain"}
  [Turn 2] search_hotels({"city": "Da Lat", "max_price": 1000000}) → [...]
  Đà Lạt cuối tuần 18°C, mưa nhẹ. Có 3 KS dưới 1 triệu...
```

> [!tip] 💡
> Cùng 1 agent loop ở [[0-Function Calling]] — không có code riêng cho "chaining". LLM tự chain bằng cách **gọi tool nhiều lượt**. Developer chỉ cần cung cấp tools + chạy loop.

---
## 📐 Các pattern chaining phổ biến

### 1️⃣ Linear Chain — A → B → C
Tool gọi lần lượt, mỗi bước dùng kết quả bước trước.
```
search_product("Nike") → check_stock(product_id) → create_order(product_id, qty)
```
**Đặc điểm:** Đơn giản, dễ debug, nhưng chậm (mỗi tool = 1 round trip API).

### 2️⃣ Fan-out / Fan-in — Parallel rồi tổng hợp
Gọi nhiều tool song song → lấy tất cả kết quả → tổng hợp.
```
                  ┌→ get_weather("Da Lat")  ──┐
User question  ───┤                            ├→ LLM tổng hợp
                  └→ search_hotels("Da Lat") ──┘
```
**Đặc điểm:** Nhanh hơn linear (parallel), nhưng LLM phải biết 2 tool độc lập → gọi cùng lúc.

### 3️⃣ Conditional Chain — Rẽ nhánh
LLM quyết định gọi tool nào tiếp **tùy theo kết quả**.
```
check_stock(product_id)
    ├── Còn hàng → create_order(...)
    └── Hết hàng → search_alternatives(...)
```
**Đặc điểm:** Linh hoạt nhất, LLM "suy nghĩ" rồi quyết định — đây là behavior gần agent nhất.

### 4️⃣ Loop Chain — Lặp đến khi đạt điều kiện
LLM gọi cùng 1 tool nhiều lần, mỗi lần điều chỉnh params.
```
search("áo thun nam") → kết quả không phù hợp
search("áo thun nam cotton trắng size L") → kết quả ok → dừng
```
**Đặc điểm:** LLM tự refine — giống cách người dùng search nhiều lần.

---
## ⚠️ Vấn đề thực tế khi chaining

### 1️⃣ Error Propagation — Sai từ đầu, sai cả chuỗi
```
Tool A trả kết quả sai → Tool B dùng kết quả sai → Output cuối sai hoàn toàn
```
```python
# ❌ Bad — không validate giữa các bước
result_a = execute_tool("search", {"query": "Nike"})
# result_a có thể rỗng hoặc sai → tool B vẫn chạy

# ✅ Good — validate kết quả mỗi bước
result_a = execute_tool("search", {"query": "Nike"})
if "error" in result_a or result_a == "[]":
    return "Không tìm thấy sản phẩm. Bạn thử từ khóa khác?"
# Chỉ tiếp tục nếu result_a hợp lệ
```

### 2️⃣ Context Window bị đầy
Mỗi tool call + result **tốn token**. Chain dài → messages array phình to → đẩy prompt gốc ra khỏi context window.

| Chain length | Ước lượng token overhead |
|---|---|
| 1-3 tools | ~500-1500 tokens — ổn |
| 4-6 tools | ~2000-4000 tokens — cẩn thận |
| 7+ tools | ~5000+ tokens — nên tách thành sub-chains |

> [!warning] ⚠️
> Giữ chain **ngắn nhất có thể** — nếu cần 7+ bước, xem xét tách thành nhiều agent nhỏ hoặc parallel hóa các bước độc lập.

### 3️⃣ Latency cộng dồn
Mỗi tool call = 1 round trip đến LLM API (1-5 giây) + thời gian thực thi tool. Chain 5 bước = 10-25 giây.

**Giảm latency:**
- Parallel hóa tool calls độc lập
- Dùng model nhanh hơn (Haiku, GPT-4o-mini) cho planning step
- Cache kết quả tool hay gọi lặp

### 4️⃣ LLM chọn sai tool hoặc sai thứ tự
```python
# ❌ Bad — description không nói rõ dependency
"description": "Tạo đơn hàng"  # LLM có thể gọi trước khi check tồn kho

# ✅ Good — nói rõ khi nào dùng
"description": "Tạo đơn hàng. CHỈ gọi sau khi đã check tồn kho "
               "bằng tool check_stock và xác nhận còn hàng."
```

> [!tip] 💡
> **Description là chỗ bạn "dạy" LLM thứ tự.** Nếu tool B phải gọi sau tool A, viết rõ trong description của tool B.

---
## 🏗️ Best Practices

### Chain ngắn, tool rõ ràng
```python
# ❌ Bad — 1 tool làm quá nhiều, chain không cần thiết
tools = [{"name": "do_everything", "description": "Tìm, check, đặt hàng"}]

# ✅ Good — mỗi tool 1 việc, LLM tự chain
tools = [
    {"name": "search_products", ...},   # bước 1
    {"name": "check_stock", ...},        # bước 2
    {"name": "create_order", ...}        # bước 3
]
```

### Log mỗi bước
```python
for block in response.content:
    if block.type == "tool_use":
        print(f"[Step {step}] Calling {block.name}({block.input})")
        result = execute_tool(block.name, block.input)
        print(f"[Step {step}] Result: {result[:200]}")  # cắt ngắn
```
Debug tool chaining **rất khó** nếu không log. Luôn log: tool nào được gọi, args gì, kết quả gì, bao nhiêu lượt.

### System prompt hướng dẫn strategy
```python
system = """Bạn là shopping assistant. Khi user muốn mua hàng:
1. Tìm sản phẩm trước (search_products)
2. Kiểm tra tồn kho (check_stock)
3. Chỉ tạo đơn khi còn hàng (create_order)
Nếu bước nào fail, giải thích cho user và gợi ý alternative."""
```

> [!tip] 💡
> System prompt giúp LLM **plan trước khi chain** — giảm khả năng gọi sai thứ tự hoặc bỏ qua bước.

---
## 🔗 Concept liên quan
- [[0-Function Calling]] — tool use loop (chaining chạy trên loop này)
- [[1-Build Tool]] — tạo tool cho LLM gọi
- [[Glossary]] — bảng thuật ngữ
- Error Handling — xử lý khi tool trong chain fail (note tiếp theo)

---
## 📚 Tham khảo
- 🔥 [How Tool Chaining Fails in Production LLM Agents](https://futureagi.substack.com/p/how-tool-chaining-fails-in-production) — Phân tích chi tiết tại sao tool chaining fail ở production: error propagation, context window overflow, LLM chọn sai tool. Có giải pháp cụ thể cho từng vấn đề.
- [Multi-Step LLM Chains: Best Practices for Complex Workflows](https://deepchecks.com/orchestrating-multi-step-llm-chains-best-practices/) — Best practices cho multi-step chains: plan-then-execute, circuit breakers, giữ chain ngắn. Có ví dụ kiến trúc thực tế.
- [What Is Tool Chaining in LLMs? Why It Breaks and How to Think About Orchestration](https://dev.to/jay_singh_e5b5ee6be59c0e0/what-is-tool-chaining-in-llms-why-it-breaks-and-how-to-think-about-orchestration-2j3m) — Giải thích rõ tool chaining là gì, tại sao break, và cách nghĩ về orchestration. Bài viết ngắn gọn, phù hợp để hiểu concept nhanh.
- [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Cover chaining trong context agent design. Quan điểm "workflow đơn giản trước, agent phức tạp sau" giúp quyết định khi nào cần chaining vs khi nào hardcode flow.

---
## ✅ Checklist
- [ ] Hiểu tool chaining = **gọi nhiều tool liên tiếp**, output trước → input sau
- [ ] Phân biệt **chaining** (sequential, phụ thuộc) vs **parallel** (cùng lúc, độc lập)
- [ ] Biết 4 patterns: **linear**, **fan-out/fan-in**, **conditional**, **loop**
- [ ] Hiểu **error propagation** — sai từ đầu → sai cả chuỗi, cần validate mỗi bước
- [ ] Biết **context window** bị đầy khi chain dài → giữ chain ngắn (< 5-6 bước)
- [ ] **Log mỗi bước** — tool nào, args gì, kết quả gì
- [ ] Dùng **system prompt** hướng dẫn LLM chain theo thứ tự đúng
- [ ] Dùng **description** nói rõ dependency giữa các tool
