# 🛠️ Build Tool — Tự tạo tool cho LLM gọi

> [!quote] 💬
> *"LLM là bộ não, tool là đôi tay. Không có tool, LLM chỉ biết nói — không biết làm."*

---
## 🎯 Build Tool là gì?
Tự viết function/tool để LLM gọi qua [[0-Function Calling]]. Tool là **cầu nối giữa LLM và thế giới bên ngoài** — search web, query database, gọi API, đọc file, gửi email...

> [!note] 📝 So sánh dễ hiểu
> LLM giống **sếp ngồi trong phòng** — rất giỏi ra quyết định nhưng không ra ngoài được.
> Tool giống **nhân viên chạy việc** — sếp bảo "tra doanh thu Q1" thì nhân viên vào database lấy số, mang về cho sếp phân tích.
> Build tool = **tuyển nhân viên** cho sếp.

---
## 🏗️ Anatomy of a Tool — Tool gồm những gì?

Mỗi tool có 3 phần:
```
┌─────────────────────────────────────────────┐
│  1. DEFINITION  — Mô tả cho LLM biết       │
│     (name, description, input_schema)       │
│                                             │
│  2. IMPLEMENTATION  — Code thực thi         │
│     (Python function thật sự chạy)          │
│                                             │
│  3. RESULT FORMAT  — Trả kết quả về LLM    │
│     (string/JSON mà LLM đọc được)          │
└─────────────────────────────────────────────┘
```
> [!tip] 💡
> **Definition** quyết định LLM có chọn đúng tool không. **Implementation** quyết định tool có chạy đúng không. Cả 2 đều quan trọng.

---
## 💻 3 loại tool phổ biến — Ví dụ thực tế

### 1️⃣ Search Tool — Tìm kiếm thông tin

```python
import httpx

# === IMPLEMENTATION ===
def search_web(query: str, max_results: int = 5) -> str:
    """Tìm kiếm web bằng API (ví dụ: Tavily, SerpAPI, Brave)"""
    response = httpx.get(
        "https://api.tavily.com/search",
        params={"query": query, "max_results": max_results},
        headers={"Authorization": f"Bearer {TAVILY_API_KEY}"}
    )
    results = response.json()["results"]
    # Format kết quả cho LLM đọc
    return "\n".join(
        f"- {r['title']}: {r['content'][:200]}" for r in results
    )

# === DEFINITION ===
search_tool = {
    "name": "search_web",
    "description": "Tìm kiếm thông tin trên internet. "
                   "Dùng khi user hỏi về tin tức, sự kiện, "
                   "hoặc thông tin mà bạn không chắc chắn.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Từ khóa tìm kiếm, nên viết bằng tiếng Anh"
            },
            "max_results": {
                "type": "integer",
                "description": "Số kết quả tối đa (mặc định 5)"
            }
        },
        "required": ["query"]
    }
}
```

---
### 2️⃣ Database Tool — Query database
```python
import sqlite3

# === IMPLEMENTATION ===
def query_database(sql: str) -> str:
    """Chạy SQL query trên database sản phẩm"""
    conn = sqlite3.connect("products.db")
    try:
        cursor = conn.execute(sql)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        # Format thành bảng cho LLM đọc
        result = " | ".join(columns) + "\n"
        for row in rows:
            result += " | ".join(str(v) for v in row) + "\n"
        return result if rows else "Không tìm thấy kết quả."
    except Exception as e:
        return f"Lỗi SQL: {e}"
    finally:
        conn.close()

# === DEFINITION ===
db_tool = {
    "name": "query_database",
    "description": "Chạy SQL query trên database sản phẩm. "
                   "Database có bảng: products(id, name, price, category, stock). "
                   "Dùng khi user hỏi về sản phẩm, giá cả, tồn kho.",
    "input_schema": {
        "type": "object",
        "properties": {
            "sql": {
                "type": "string",
                "description": "SQL SELECT query. CHỈ được SELECT, không INSERT/UPDATE/DELETE."
            }
        },
        "required": ["sql"]
    }
}
```

> [!danger] ⛔
> LLM sinh SQL = **rủi ro SQL injection**. Luôn:
> - Chỉ cho phép SELECT (block INSERT/UPDATE/DELETE)
> - Dùng read-only database connection
> - Validate SQL trước khi chạy
> - Set timeout để tránh query chạy mãi

---
### 3️⃣ API Tool — Gọi API bên ngoài
```python
import httpx

# === IMPLEMENTATION ===
def get_weather(city: str, unit: str = "celsius") -> str:
    """Lấy thời tiết từ OpenWeatherMap API"""
    response = httpx.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={
            "q": city,
            "appid": WEATHER_API_KEY,
            "units": "metric" if unit == "celsius" else "imperial"
        }
    )
    if response.status_code != 200:
        return f"Không lấy được thời tiết cho {city}"

    data = response.json()
    return (
        f"Thành phố: {data['name']}\n"
        f"Nhiệt độ: {data['main']['temp']}°{'C' if unit == 'celsius' else 'F'}\n"
        f"Thời tiết: {data['weather'][0]['description']}\n"
        f"Độ ẩm: {data['main']['humidity']}%"
    )

# === DEFINITION ===
weather_tool = {
    "name": "get_weather",
    "description": "Lấy thời tiết hiện tại của một thành phố. "
                   "Dùng khi user hỏi về thời tiết, nhiệt độ, "
                   "hoặc điều kiện thời tiết ngoài trời.",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "Tên thành phố bằng tiếng Anh, ví dụ: 'Hanoi', 'Ho Chi Minh City'"
            },
            "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Đơn vị nhiệt độ (mặc định celsius)"
            }
        },
        "required": ["city"]
    }
}
```

---
## 🔧 Tool Dispatcher — Kết nối definition với implementation

Khi LLM trả về tool call, cần **map tên tool → function thật**:
```python
# ❌ Bad — if/elif dài dòng, khó mở rộng
if tool_name == "search_web":
    result = search_web(**args)
elif tool_name == "get_weather":
    result = get_weather(**args)
elif tool_name == "query_database":
    result = query_database(**args)

# ✅ Good — dùng dictionary, thêm tool chỉ cần 1 dòng
TOOL_MAP = {
    "search_web": search_web,
    "get_weather": get_weather,
    "query_database": query_database,
}

def execute_tool(tool_name: str, tool_args: dict) -> str:
    """Dispatch tool call đến function tương ứng"""
    if tool_name not in TOOL_MAP:
        return f"Tool '{tool_name}' không tồn tại."
    try:
        return TOOL_MAP[tool_name](**tool_args)
    except Exception as e:
        return f"Lỗi khi chạy {tool_name}: {e}"
```

> [!tip] 💡
> Pattern **TOOL_MAP** (dictionary dispatch) là cách phổ biến nhất. Thêm tool mới chỉ cần: viết function + thêm 1 dòng vào dict + thêm definition vào tools list.

---
## ✍️ Best Practices — Thiết kế tool tốt

### Description quyết định tất cả
```python
# ❌ Bad — LLM không biết khi nào nên dùng
"description": "Tìm kiếm"

# ✅ Good — nói rõ LÀM GÌ + KHI NÀO DÙNG + DATA GÌ
"description": "Tìm sản phẩm trong database theo tên hoặc category. "
               "Database có bảng products(name, price, category). "
               "Dùng khi user hỏi về sản phẩm, giá, hoặc so sánh sản phẩm."
```

### Kết quả tool phải LLM-readable
```python
# ❌ Bad — trả raw JSON phức tạp, LLM phải parse
return json.dumps({"data": {"items": [{"id": 1, "name": "...", "meta": {...}}]}})

# ✅ Good — trả text dễ đọc, chỉ giữ info cần thiết
return "Tìm thấy 3 sản phẩm:\n- Áo thun nam: 150,000đ\n- Áo polo: 250,000đ\n- Áo khoác: 500,000đ"
```

> [!tip] 💡
> LLM đọc text tốt hơn JSON lồng nhau. Trả **vừa đủ thông tin** — quá nhiều = tốn token + LLM bị overwhelm. Quá ít = LLM không đủ info trả lời.

### Mỗi tool làm 1 việc
```python
# ❌ Bad — 1 tool làm quá nhiều
"name": "do_everything",
"description": "Tìm sản phẩm, đặt hàng, gửi email, tra vận đơn"

# ✅ Good — chia nhỏ, mỗi tool 1 việc
"name": "search_products"    # tìm sản phẩm
"name": "create_order"       # đặt hàng
"name": "send_email"         # gửi email
"name": "track_shipment"     # tra vận đơn
```

### Số lượng tool vừa phải

| Số tool | Đánh giá |
|---|---|
| 1-5 | Tốt — LLM chọn chính xác |
| 5-15 | Ổn — cần description rõ ràng |
| 15-30 | Cẩn thận — LLM bắt đầu chọn sai, tốn token |
| 30+ | Nên chia thành nhóm hoặc dùng tool routing |

> [!warning] ⚠️
> Mỗi tool definition **tốn token** — gửi 20 tool definitions mỗi request sẽ tốn ~2000-3000 tokens chỉ riêng phần tools. Chỉ gửi tools **liên quan đến context hiện tại**.

---
## 🔒 Security — Tool an toàn

### Nguyên tắc Least Privilege
Tool chỉ được phép làm **đúng những gì cần thiết**, không hơn.
```python
# ❌ Bad — cho LLM full database access
def query_database(sql: str) -> str:
    conn.execute(sql)  # LLM có thể DROP TABLE!

# ✅ Good — chỉ cho SELECT, validate trước
def query_database(sql: str) -> str:
    sql_upper = sql.strip().upper()
    if not sql_upper.startswith("SELECT"):
        return "Chỉ được phép SELECT."
    if any(kw in sql_upper for kw in ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER"]):
        return "Không được phép thay đổi data."
    # Dùng read-only connection
    conn = sqlite3.connect("file:products.db?mode=ro", uri=True)
    ...
```

### Sensitive actions cần confirmation
```python
def send_email(to: str, subject: str, body: str) -> str:
    """Tool gửi email — CẦN user confirm trước khi gửi thật"""
    # Trả preview cho LLM, không gửi ngay
    return (
        f"📧 PREVIEW (chưa gửi):\n"
        f"To: {to}\nSubject: {subject}\nBody: {body}\n\n"
        f"Hỏi user: 'Bạn muốn gửi email này không?'"
    )
    # Gửi thật chỉ khi user confirm → cần human-in-the-loop
```

> [!danger] ⛔
> **Không bao giờ** cho LLM tool có khả năng: xóa data, gửi tiền, gửi message, sửa production — mà không có bước confirm từ người dùng. LLM có thể hallucinate arguments.

---
## 📐 Pattern hoàn chỉnh — Kết hợp tất cả

```python
from anthropic import Anthropic
import json

client = Anthropic()

# 1. Định nghĩa tools
tools = [search_tool, db_tool, weather_tool]

# 2. Map tool name → function
TOOL_MAP = {
    "search_web": search_web,
    "query_database": query_database,
    "get_weather": get_weather,
}

# 3. Agent loop
def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    for _ in range(10):  # max 10 turns
        response = client.messages.create(
            model="claude-sonnet-4-6-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Xử lý tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })
        messages.append({"role": "user", "content": tool_results})

    return "Đạt giới hạn — dừng lại."

# 4. Chạy
answer = run_agent("Tìm sản phẩm áo thun dưới 200k, đang còn hàng")
print(answer)
```

---
## 🔗 Concept liên quan
- [[0-Function Calling]] — cách LLM gọi tool (học trước note này)
- [[Glossary]] — bảng thuật ngữ
- Tool Chaining — gọi tool A → lấy kết quả → gọi tool B (note tiếp theo)

---
## 📚 Tham khảo
- 🔥 [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Blog chính thức từ Anthropic về cách thiết kế agent hiệu quả. Cover tool design patterns, khi nào nên dùng agent vs workflow đơn giản, và best practices cho production.
- [Anthropic — How to Implement Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use) — Docs chính thức hướng dẫn implement tool use với Claude API. Có code examples đầy đủ.
- [Eugene Yan — Patterns for Building LLM-based Systems](https://eugeneyan.com/writing/llm-patterns/) — Tổng hợp design patterns cho LLM app từ applied scientist tại Amazon. Cover tool use, guardrails, evaluation, và nhiều pattern production khác.
- [Real Python — Pydantic AI: Build Type-Safe LLM Agents](https://realpython.com/pydantic-ai/) — Tutorial hands-on build agent type-safe bằng Pydantic AI. Approach khác so với raw API — đáng học để so sánh.

---
## ✅ Checklist
- [ ] Hiểu tool gồm 3 phần: **definition** + **implementation** + **result format**
- [ ] Build được ít nhất 1 tool thật: search, database, hoặc API bên ngoài
- [ ] Viết **description** rõ ràng — nói rõ tool làm gì + khi nào dùng
- [ ] Dùng **TOOL_MAP** pattern để dispatch tool calls
- [ ] Trả kết quả **LLM-readable** — text dễ đọc, vừa đủ info
- [ ] Áp dụng **least privilege** — tool chỉ được phép làm đúng việc cần thiết
- [ ] **Validate input** trước khi thực thi (đặc biệt SQL, command)
- [ ] Sensitive actions cần **human-in-the-loop** confirmation
