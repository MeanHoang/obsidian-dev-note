# 🧠 LLM Overview — Large Language Model là gì?

> [!quote] 💬
> *"LLM không hiểu ngôn ngữ — nó dự đoán từ tiếp theo giỏi đến mức trông như hiểu."*

---
## 🎯 LLM là gì?
**LLM (Large Language Model)** — mô hình ngôn ngữ lớn — là **bộ não AI** được train trên hàng tỷ văn bản. Nó nhận text đầu vào (prompt) và sinh text đầu ra (response) bằng cách **dự đoán từ tiếp theo**.
- **Large** = rất lớn (hàng trăm tỷ parameters — tham số)
- **Language** = xử lý ngôn ngữ (text)
- **Model** = mô hình toán học đã được huấn luyện

> [!note] 📝 So sánh dễ hiểu
> LLM giống **luật sư giỏi nhất thành phố**:
> - Bạn không mời luật sư về nhà (không chạy model trên máy mình)
> - Bạn gọi điện hỏi (gọi API) → luật sư trả lời → trả tiền theo phút (token)
> - Luật sư = bộ não, số điện thoại = API, hóa đơn = token cost

---
## 🏗️ Bức tranh tổng thể

```
Bạn (developer)
    │
    │  gọi API (gửi prompt + config)
    ▼
Provider (công ty vận hành)
    │
    │  chạy model trên server
    ▼
LLM (bộ não AI)
    │
    │  sinh response từng token một
    ▼
Trả về qua API → tính tiền theo token
```

| Thành phần | Là gì | Ví dụ |
|---|---|---|
| **LLM** | Bộ não — model AI đã train | GPT-4, Claude, Gemini, Llama |
| **Provider** | Công ty sở hữu & vận hành model | OpenAI, Anthropic, Google, Meta |
| **API** | Cách giao tiếp với model | `api.openai.com`, `api.anthropic.com` |
| **App/UI** | Giao diện cho người dùng cuối | ChatGPT web, Claude web |

---
## ⚙️ LLM hoạt động thế nào?

### 1️⃣ Training — Huấn luyện
LLM được "đọc" hàng tỷ trang web, sách, code, Wikipedia... và học **pattern thống kê** của ngôn ngữ.
- Không "ghi nhớ" từng câu — mà học **xác suất**: sau cụm từ X thì từ Y hay xuất hiện
- Quá trình training tốn **hàng triệu đô** và mất **vài tháng** trên hàng nghìn GPU
- Sau training, model được đóng gói thành file weights (trọng số) — đây chính là "bộ não"

> [!warning] ⚠️
> LLM không "biết" sự thật — nó chỉ biết **pattern ngôn ngữ**. Đó là lý do nó có thể nói rất tự tin về thông tin sai ([[Glossary#H|hallucination]]).

### 2️⃣ Inference — Suy luận (khi bạn dùng)
Khi bạn gửi prompt, LLM sinh response bằng **autoregressive generation** — tạo từng token một:
```
Input: "Thủ đô Việt Nam là"

Bước 1: tính xác suất → chọn "Hà"
Bước 2: "...là Hà" → chọn " Nội"
Bước 3: "...Hà Nội" → chọn "."
→ Kết quả: "Thủ đô Việt Nam là Hà Nội."
```
Mỗi bước, LLM nhìn **tất cả token trước đó** → tính xác suất → chọn token tiếp theo.
Các tham số ảnh hưởng đến cách chọn:
- [[Prompt Engineering#🌡️ Temperature|Temperature]] — mức độ ngẫu nhiên khi chọn token
- [[Prompt Engineering#🎯 Top-p (Nucleus Sampling)|Top-p]] — giới hạn pool token được chọn
- **Max tokens** — giới hạn độ dài output

### 3️⃣ Context Window — Bộ nhớ ngắn hạn
LLM **không có bộ nhớ dài hạn**. Mỗi lần gọi API, nó chỉ "nhìn thấy" những gì nằm trong context window.

```
┌──────────────── Context Window (VD: 200K tokens) ────────────────┐
│  System prompt + lịch sử chat + prompt mới + response đang sinh  │
└──────────────────────────────────────────────────────────────────┘
```

| Model | Context Window |
|---|---|
| GPT-4o | 128K tokens |
| Claude Sonnet/Opus | 200K tokens |
| Gemini Pro | 1M+ tokens |

> [!tip] 💡
> Context window càng lớn = nhét được càng nhiều thông tin. Nhưng **nhiều token = tốn tiền + chậm hơn**. Không nên nhét hết mọi thứ vào prompt chỉ vì context cho phép.

---
## 🔑 Những điều quan trọng cần nhớ
### LLM không "hiểu" — nó "dự đoán"
```
// LLM KHÔNG làm thế này:
"Hà Nội là thủ đô" → tra database → trả kết quả ✗

// LLM làm thế này:
"Hà Nội là thủ đô của ___" → xác suất "Việt Nam" = 92% → chọn "Việt Nam" ✓
```
Nó đúng vì pattern thống kê đúng, không phải vì nó "biết" địa lý.

### LLM stateless — không nhớ gì giữa các request
Mỗi API call là **độc lập**. Muốn LLM "nhớ" cuộc hội thoại → phải gửi lại toàn bộ lịch sử chat mỗi lần.
```python
# ❌ Bad — nghĩ LLM tự nhớ
request_1: "Tôi tên là Minh"
request_2: "Tên tôi là gì?"  # LLM không biết!

# ✅ Good — gửi lại lịch sử
request_2: [
    {"role": "user", "content": "Tôi tên là Minh"},
    {"role": "assistant", "content": "Xin chào Minh!"},
    {"role": "user", "content": "Tên tôi là gì?"}
]
# LLM đọc lại lịch sử → trả lời đúng
```

> [!note] 📝 So sánh dễ hiểu
> LLM giống **người mất trí nhớ ngắn hạn** — mỗi lần gặp bạn đều quên hết. Muốn nó nhớ, bạn phải **kể lại từ đầu** mỗi lần (gửi lại chat history).

### Multimodal — không chỉ text
Các model mới (GPT-4o, Claude 3.5+) đã **multimodal** — hiểu cả hình ảnh, audio. Nhưng tên gọi "LLM" vẫn được giữ theo thói quen.

---
## 🌍 Các LLM phổ biến hiện nay

### 1️⃣ Theo nhà phát triển (Provider)

| Provider | Model | Đặc điểm | Loại |
|---|---|---|---|
| **Anthropic** | Claude (Haiku, Sonnet, Opus) | Reasoning & coding mạnh, context 200K+ | Closed-source |
| **OpenAI** | GPT-4o, GPT-4.1, o1, o3 | Phổ biến nhất, hệ sinh thái lớn | Closed-source |
| **Google** | Gemini (Flash, Pro, Ultra) | Multimodal mạnh, context 1M+ | Closed-source |
| **Meta** | LLaMA 3, 4 | Open-source hàng đầu, cộng đồng lớn | Open-weights |
| **Mistral** | Mistral, Mixtral | Châu Âu, nhẹ mà chất lượng cao | Open-weights |
| **DeepSeek** | DeepSeek-V3, R1 | Mạnh reasoning & code, giá rẻ | Open-weights |
| **xAI** | Grok | Tích hợp X (Twitter), real-time data | Closed-source |
| **Cohere** | Command R+ | Tập trung enterprise, tối ưu cho [[Glossary#R|RAG]] | Closed-source |

### 2️⃣ Phân loại theo cách truy cập
**Closed-source** (đóng) — chỉ dùng qua API, không xem được model weights:
- Ưu: mạnh nhất, không cần lo infra, provider lo bảo trì
- Nhược: phụ thuộc provider, data gửi ra ngoài, tốn phí API
**Open-source / Open-weights** (mở) — tải weights về chạy trên máy riêng:
- Ưu: kiểm soát hoàn toàn, data không ra ngoài, chạy offline được
- Nhược: cần GPU mạnh, tự lo vận hành, thường yếu hơn closed-source top tier

> [!note] 📝 So sánh dễ hiểu
> **Closed-source** = thuê đầu bếp 5 sao nấu cho mình — ngon nhưng tốn tiền, phải đến nhà hàng
> **Open-source** = lấy công thức nấu ở nhà — rẻ hơn, tùy chỉnh được, nhưng phải tự mua bếp (GPU)

### 3️⃣ Phân loại theo khả năng
**Standard LLM** — nhận prompt → trả lời ngay:
- GPT-4o, Claude Sonnet, Gemini Pro, LLaMA
**Reasoning Model** — "suy nghĩ" trước khi trả lời (chain-of-thought nội bộ):
- OpenAI o1, o3 — tạo "thinking" trace trước khi output
- DeepSeek R1 — reasoning mạnh, open-source
- Claude Opus — extended thinking có thể bật/tắt

> [!tip] 💡
> Reasoning model tốn **nhiều token hơn** (vì phải "suy nghĩ") nhưng chính xác hơn cho các task logic, toán, code phức tạp. Không cần dùng reasoning model cho task đơn giản như tóm tắt hay dịch thuật.

**Multimodal Model** — hiểu nhiều loại input (text + ảnh + audio + video):
- GPT-4o, Claude 3.5+, Gemini — hiểu ảnh & text
- Gemini — hiểu cả video & audio
**Embedding Model** — chuyển text thành vector, dùng cho search & [[Glossary#R|RAG]]:
- OpenAI `text-embedding-3-small/large`
- Cohere `embed-v3`
- Không sinh text — chỉ tạo [[Glossary#E|embedding]]

### 4️⃣ Chọn model nào cho use case nào?

| Use case | Model gợi ý | Lý do |
|---|---|---|
| **Code & reasoning phức tạp** | Claude Opus, o3, DeepSeek R1 | Reasoning sâu |
| **Đa năng, cân bằng giá/chất lượng** | Claude Sonnet, GPT-4o, Gemini Pro | Tốt mọi thứ, giá hợp lý |
| **Nhanh & rẻ (chatbot, classify)** | Claude Haiku, GPT-4o-mini, Gemini Flash | Latency thấp, cost thấp |
| **Chạy local / privacy** | LLaMA, Mistral, DeepSeek | Không gửi data ra ngoài |
| **Xử lý document/ảnh lớn** | Gemini Pro (1M context), Claude (200K) | Context window lớn |
| **Search & RAG** | Embedding model + LLM | Embedding tìm, LLM trả lời |

> [!warning] ⚠️
> Bảng xếp hạng model thay đổi liên tục — mỗi vài tháng lại có model mới vượt mặt. Đừng "cưới" 1 model, hãy thiết kế app để **dễ swap model** khi cần.

---
## 🔗 Concept liên quan
- [[Prompt Engineering]] — cách viết prompt để LLM trả lời đúng ý
- [[Glossary]] — bảng thuật ngữ AI/LLM
- API Integration — cách gọi API để tương tác với LLM (note tiếp theo)

---
## ✅ Checklist — Bạn đã hiểu LLM chưa?
- [ ] LLM là **model AI** (bộ não), không phải app hay ngôn ngữ
- [ ] LLM sinh text bằng cách **dự đoán token tiếp theo** (autoregressive)
- [ ] LLM **không hiểu** — chỉ dự đoán dựa trên pattern thống kê
- [ ] LLM **stateless** — không nhớ gì giữa các request, phải gửi lại history
- [ ] **Context window** giới hạn lượng text LLM nhìn thấy mỗi lần
- [ ] Tương tác với LLM qua **API** — trả tiền theo **token**
- [ ] Temperature, top-p, max_tokens ảnh hưởng cách LLM sinh output
- [ ] **Closed-source** (Claude, GPT, Gemini) = mạnh, dùng qua API
- [ ] **Open-weights** (LLaMA, Mistral, DeepSeek) = chạy local, kiểm soát data
- [ ] **Reasoning model** (o1, o3, R1) = "suy nghĩ" trước khi trả lời, tốn token hơn
- [ ] Chọn model theo use case — không có model "tốt nhất" cho mọi thứ
