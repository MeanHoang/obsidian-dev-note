# 📦 Structured Output — Bắt LLM trả đúng format

> [!quote] 💬
> *"LLM giỏi nói, nhưng tệ ở việc nói đúng format. Structured Output là cách bạn dạy nó kỷ luật."*

---
## 🎯 Structured Output là gì?
Structured Output là kỹ thuật **ép LLM trả về data có cấu trúc** (JSON, XML...) thay vì text tự do. Quan trọng vì app của bạn cần **parse được output** — text tự do thì máy không hiểu.

> [!note] 📝 So sánh dễ hiểu
> LLM mặc định giống **bác sĩ viết tay** — nội dung đúng nhưng đọc không ra.
> Structured Output giống **bắt bác sĩ điền vào form có sẵn** — đúng ô, đúng format, máy đọc được.

---
## 🤔 Tại sao cần Structured Output?
Khi build app thật, bạn **không đọc output bằng mắt** — code đọc. Mà code cần JSON, không cần văn xuôi.

```python
# ❌ Bad — LLM trả text tự do, parse kiểu gì?
"""
Sản phẩm này khá tốt, tôi đánh giá 4/5 sao.
Ưu điểm là giao hàng nhanh, nhược điểm là đóng gói hơi cẩu thả.
"""

# ✅ Good — JSON, code parse được ngay
{
  "rating": 4,
  "sentiment": "positive",
  "pros": ["giao hàng nhanh"],
  "cons": ["đóng gói cẩu thả"]
}
```

**Use case thực tế:**
- Extract data từ text (tên, email, địa chỉ...)
- Phân loại + gắn label (sentiment, category, priority...)
- LLM ra quyết định → app thực thi (chọn tool nào, gọi API nào)
- Chuyển natural language → database query

---
## 🛠️ 3 cách lấy Structured Output

### 1️⃣ Prompt-based — Chỉ dùng prompt để ép format
Cách đơn giản nhất: **mô tả format trong prompt**, cho ví dụ mẫu.

```python
prompt = """Phân tích review sau và trả về JSON:
{
  "sentiment": "positive" | "negative" | "neutral",
  "rating": 1-5,
  "keywords": ["từ khóa"]
}

Review: "Điện thoại đẹp, pin trâu, nhưng camera hơi tệ"
Chỉ trả JSON, không giải thích."""

response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0,  # giảm ngẫu nhiên → output ổn định hơn
    messages=[{"role": "user", "content": prompt}]
)
```

| Ưu | Nhược |
|---|---|
| Đơn giản, không cần API đặc biệt | LLM **có thể** trả sai format |
| Dùng được với mọi LLM | Hay thêm text thừa (giải thích, markdown) |
| Nhanh prototype | Không đảm bảo 100% valid JSON |

> [!warning] ⚠️
> Cách này **không tin cậy cho production**. LLM có thể: thêm ```json wrapper, thiếu dấu phẩy, thêm text giải thích trước/sau JSON. Chỉ dùng khi prototype hoặc task không critical.

---
### 2️⃣ JSON Mode — Bật flag ở API level
Provider hỗ trợ flag **bắt model chỉ trả JSON hợp lệ**.
#### OpenAI — `response_format`
```python
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={"type": "json_object"},  # bật JSON mode
    messages=[
        {"role": "system", "content": "Trả về JSON phân tích sentiment."},
        {"role": "user", "content": "Review: 'Sản phẩm tuyệt vời!'"}
    ]
)
import json
data = json.loads(response.choices[0].message.content)
# Luôn là valid JSON — nhưng KHÔNG đảm bảo đúng schema
```

> [!warning] ⚠️
> JSON mode đảm bảo **valid JSON**, nhưng **không đảm bảo đúng schema**. LLM có thể trả `{"answer": "positive"}` thay vì `{"sentiment": "positive"}`. Muốn đúng schema → dùng cách 3.

---
### 3️⃣ Schema Enforcement — Đảm bảo đúng cấu trúc (recommended)
Cách **tin cậy nhất**: định nghĩa JSON Schema (bản thiết kế cấu trúc JSON), API đảm bảo output tuân thủ 100%.
#### OpenAI — Structured Outputs với `json_schema`
```python
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "review_analysis",
            "strict": True,  # bật strict mode → đảm bảo 100% đúng schema
            "schema": {
                "type": "object",
                "properties": {
                    "sentiment": {
                        "type": "string",
                        "enum": ["positive", "negative", "neutral"]
                    },
                    "rating": {"type": "integer"},
                    "keywords": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["sentiment", "rating", "keywords"],
                "additionalProperties": False
            }
        }
    },
    messages=[
        {"role": "user", "content": "Phân tích: 'Giao hàng nhanh, hàng đẹp, 10 điểm'"}
    ]
)
import json
data = json.loads(response.choices[0].message.content)
# data["sentiment"] luôn là 1 trong 3 giá trị, data["rating"] luôn là số
```

#### Anthropic — Dùng Tool Use làm "structured output hack"
Anthropic không có JSON mode riêng, nhưng có trick: **định nghĩa 1 tool rồi force model gọi nó**.

```python
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=1024,
    tools=[{
        "name": "analyze_review",
        "description": "Phân tích sentiment của review",
        "input_schema": {  # schema mình muốn
            "type": "object",
            "properties": {
                "sentiment": {
                    "type": "string",
                    "enum": ["positive", "negative", "neutral"]
                },
                "rating": {"type": "integer"},
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["sentiment", "rating", "keywords"]
        }
    }],
    tool_choice={"type": "tool", "name": "analyze_review"},  # force gọi tool này
    messages=[
        {"role": "user", "content": "Phân tích: 'Giao hàng nhanh, hàng đẹp'"}
    ]
)

# Lấy structured data từ tool call
data = response.content[0].input  # đã là dict, không cần json.loads
# {"sentiment": "positive", "rating": 9, "keywords": ["giao hàng nhanh", "hàng đẹp"]}
```

> [!tip] 💡
> Trick này hoạt động vì khi model "gọi tool", nó **buộc phải trả JSON đúng schema** của tool đó. Mình không cần thực sự chạy tool — chỉ lấy data từ `tool_choice`.

---
## 📊 So sánh 3 cách

| | Prompt-based | JSON Mode | Schema Enforcement |
|---|---|---|---|
| **Độ tin cậy** | Thấp | Trung bình | Cao |
| **Valid JSON** | Không đảm bảo | Đảm bảo | Đảm bảo |
| **Đúng schema** | Không đảm bảo | Không đảm bảo | Đảm bảo |
| **Dùng khi** | Prototype, test nhanh | Cần JSON nhưng schema linh hoạt | Production, data pipeline |
| **Provider** | Mọi LLM | OpenAI | OpenAI (json_schema), Anthropic (tool use) |

---
## 🔧 Validation — Luôn kiểm tra output
Dù dùng cách nào, **luôn validate phía app**. LLM có thể trả đúng format nhưng sai logic (rating = 999, sentiment = "positive" cho review tiêu cực).

```python
import json

# ❌ Bad — trust LLM hoàn toàn
data = json.loads(response)
save_to_db(data)

# ✅ Good — validate trước khi dùng
data = json.loads(response)
if data["rating"] < 1 or data["rating"] > 5:
    raise ValueError(f"Rating không hợp lệ: {data['rating']}")
if data["sentiment"] not in ["positive", "negative", "neutral"]:
    raise ValueError(f"Sentiment không hợp lệ: {data['sentiment']}")
save_to_db(data)
```

### Dùng Pydantic cho validation nhanh
```python
from pydantic import BaseModel, Field
from typing import Literal

class ReviewAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    rating: int = Field(ge=1, le=5)  # 1 ≤ rating ≤ 5
    keywords: list[str]

# Parse + validate 1 dòng
data = ReviewAnalysis.model_validate_json(response_text)
# Tự raise lỗi nếu sai format/giá trị
```

> [!tip] 💡
> **Pydantic** (thư viện Python để validate data) là best practice khi làm structured output. Thư viện [Instructor](https://github.com/jxnl/instructor) wrap Pydantic + LLM API lại, tự retry khi output sai — rất tiện cho production.

---
## ⚠️ Pitfalls thường gặp

| Lỗi | Nguyên nhân | Fix |
|---|---|---|
| JSON có thêm ` ```json ` wrapper | LLM format markdown | Thêm "Chỉ trả JSON thuần, không markdown" vào prompt |
| Thiếu field | Schema phức tạp, LLM quên | Dùng `required` trong schema + validation |
| Giá trị sai kiểu | Trả string thay vì number | Dùng schema enforcement hoặc Pydantic |
| Nested object quá sâu | Schema quá phức tạp | Giữ schema flat, tối đa 2-3 level |
| Hallucinate giá trị | LLM bịa data không có trong input | Thêm prompt: "Chỉ extract từ text, không tự thêm" |

---
## 🔗 Concept liên quan
- [[3-API Integration]] — gọi API cơ bản (structured output build trên nền này)
- [[2-Prompt Engineering]] — prompt-based structured output dùng kỹ thuật few-shot
- [[Glossary]] — bảng thuật ngữ
- Function Calling — bước tiếp theo, LLM chọn tool để gọi (Phase 2)

---
## 📚 Tham khảo

### 🔥 OpenAI Structured Outputs
OpenAI hỗ trợ 2 cách: **JSON mode** (`response_format: json_object`) chỉ đảm bảo valid JSON, và **Structured Outputs** (`json_schema` + `strict: true`) đảm bảo đúng schema 100%. Khi bật `strict`, model bị constrain ở tầng generation — không phải post-processing. Hạn chế: không hỗ trợ một số JSON Schema features như `minLength`, `pattern`, recursive types phải dùng workaround. Schema lần đầu chậm hơn vì OpenAI cần compile, các lần sau cache lại.
→ [Docs](https://platform.openai.com/docs/guides/structured-outputs)

### 🔥 Anthropic Tool Use trick
Anthropic không có JSON mode riêng. Cách làm: tạo 1 tool với `input_schema` là schema mình muốn, set `tool_choice: {"type": "tool", "name": "..."}` để force model gọi tool đó. Output nằm trong `response.content[0].input` — đã là dict, không cần `json.loads`. Hoạt động vì Claude buộc phải trả valid JSON khi gọi tool. Nhược điểm: tốn thêm token cho tool definition, và không phải "native" structured output.
→ [Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#json-mode)

### 🔥 Instructor — thư viện production-ready
Wrap Pydantic + LLM API. Flow: định nghĩa Pydantic model → Instructor tự chuyển thành schema → gọi API → validate response → nếu sai thì **tự retry** (gửi lại error message cho LLM sửa). Hỗ trợ OpenAI, Anthropic, Google, Mistral, local models. Điểm mạnh nhất: retry logic thông minh — không chỉ retry mù mà gửi validation error cho LLM biết sai chỗ nào để sửa. 10k+ GitHub stars, dùng nhiều trong production.
→ [GitHub](https://github.com/jxnl/instructor)

### Outlines — cho local LLM
Khác hoàn toàn với 3 cách trên. Outlines can thiệp **ở tầng token sampling** — khi model đang generate, chỉ cho phép chọn token mà vẫn tạo ra valid JSON theo schema. Kết quả: **100% đảm bảo output hợp lệ**, không cần retry. Chỉ dùng được với local/open-source models (Llama, Mistral...), không dùng được qua API.
→ [GitHub](https://github.com/dottxt-ai/outlines)

---
## ✅ Checklist
- [ ] Hiểu tại sao cần structured output (code cần parse, không đọc text)
- [ ] Biết 3 cách: prompt-based, JSON mode, schema enforcement
- [ ] Dùng được **OpenAI Structured Outputs** (`json_schema` + `strict`)
- [ ] Dùng được **Anthropic tool use trick** để lấy structured data
- [ ] Biết **validate output** bằng Pydantic
- [ ] Hiểu khi nào dùng cách nào (prototype vs production)
