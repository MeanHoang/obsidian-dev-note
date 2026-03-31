# 🚨 Error Handling — Tool fail thì agent xử lý thế nào

> [!quote] 💬
> *"Trong production, không phải 'nếu' tool fail — mà là 'khi nào' tool fail. Agent giỏi là agent biết xử lý khi mọi thứ đi sai."*

---
## 🎯 Error Handling trong LLM Agent là gì?
Kỹ thuật xử lý khi **tool gọi bị lỗi** — API timeout, database down, LLM trả sai format, rate limit... Khác với error handling thông thường vì agent có thể **tự retry, tự chọn cách khác, hoặc báo lại cho LLM** để LLM quyết định.

> [!note] 📝 So sánh dễ hiểu
> Giống **bạn nhờ ai đi mua đồ**:
> - Cửa hàng đóng cửa → **retry** — đi lại lần nữa sau 10 phút
> - Hết hàng → **fallback** — sang cửa hàng khác mua
> - Không tìm được đường → **báo lại** — gọi bạn hỏi "giờ tính sao?"
> - Đi 3 cửa hàng đều đóng → **dừng lại** — "hôm nay không mua được rồi"

---
## 📊 Các loại lỗi thường gặp

| Loại | HTTP Code | Ví dụ | Retry được? |
|---|---|---|---|
| **Rate limit** | 429 | Gọi API quá nhanh | Có — đợi rồi retry |
| **Server error** | 500, 502, 503 | Provider đang lỗi | Có — retry sau vài giây |
| **Timeout** | — | API response quá chậm | Có — retry với timeout dài hơn |
| **Auth error** | 401, 403 | API key sai/hết hạn | Không — fix key rồi mới chạy |
| **Bad request** | 400 | Prompt quá dài, params sai | Không — sửa input |
| **Tool logic error** | — | SQL sai, API trả empty | Tùy — gửi lỗi cho LLM xử lý |

> [!tip] 💡
> **Chỉ retry lỗi transient** (tạm thời: 429, 500, 503, timeout). Không retry lỗi permanent (401, 400) — retry cũng sẽ fail y vậy.

---
## 🛠️ 4 Patterns xử lý lỗi

### 1️⃣ Retry with Exponential Backoff
Lỗi tạm thời → đợi rồi thử lại, mỗi lần **đợi lâu hơn gấp đôi**.
```
Lần 1: đợi 1 giây → retry
Lần 2: đợi 2 giây → retry
Lần 3: đợi 4 giây → retry
Lần 4: đợi 8 giây → retry
Lần 5: → cho up, báo lỗi
```

```js
// ✅ Good — exponential backoff với jitter
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Chỉ retry lỗi transient
      if (error.status === 401 || error.status === 400) throw error;

      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff + jitter (tránh retry storm)
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      const jitter = delay * 0.5 * Math.random(); // thêm random
      console.log(`Retry ${attempt + 1}/${maxRetries} sau ${Math.round(delay + jitter)}ms`);
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}

// Sử dụng
const response = await retryWithBackoff(() =>
  anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello" }]
  })
);
```

> [!warning] ⚠️
> **Jitter** (random thêm thời gian) rất quan trọng — nếu 100 request cùng retry sau đúng 2 giây → tạo "retry storm" làm server quá tải thêm.

---
### 2️⃣ Fallback — Chuyển sang plan B
Tool chính fail → dùng tool/model dự phòng.
```js
// ✅ Fallback model — model chính fail thì dùng model phụ
async function callWithFallback(messages) {
  try {
    // Thử model chính trước
    return await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      messages
    });
  } catch (error) {
    console.warn("Claude fail, fallback sang OpenAI");
    // Fallback sang model khác
    return await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });
  }
}
```

```js
// ✅ Fallback tool — search API fail thì dùng cache
async function searchWithFallback(query) {
  try {
    return await searchAPI(query);      // tool chính
  } catch {
    const cached = await cache.get(query); // fallback: cache cũ
    if (cached) return cached;
    return "Không tìm được kết quả. Vui lòng thử lại sau."; // fallback cuối
  }
}
```

**Các cấp fallback:**

| Cấp | Ví dụ |
|---|---|
| **Fallback tool** | Search API fail → dùng cache |
| **Fallback model** | Claude fail → dùng GPT |
| **Fallback response** | Tất cả fail → trả message tĩnh "Xin lỗi, hệ thống đang bận" |
| **Human escalation** | Lỗi nghiêm trọng → chuyển cho người xử lý |

---
### 3️⃣ Circuit Breaker — Ngắt mạch khi fail liên tục
Nếu 1 tool **fail liên tục** → tạm **ngắt** luôn, không gọi nữa → tránh waste time + resource.

```
            ┌─────────┐
   OK ←──── │ CLOSED  │ ←── bình thường, gọi tool
            │ (đóng)  │
            └────┬────┘
                 │ fail N lần liên tiếp
                 ▼
            ┌─────────┐
  FAIL ←─── │  OPEN   │ ←── ngắt mạch, skip tool, trả lỗi ngay
  (ngay)    │ (mở)    │
            └────┬────┘
                 │ sau X giây
                 ▼
            ┌──────────┐
            │HALF-OPEN │ ←── thử 1 request
            │(nửa mở) │
            └────┬─────┘
                 │
          ┌──────┴──────┐
          │             │
        OK → CLOSED   FAIL → OPEN
```

```js
class CircuitBreaker {
  constructor(threshold = 3, resetTimeout = 30000) {
    this.failures = 0;
    this.threshold = threshold;       // fail 3 lần → mở
    this.resetTimeout = resetTimeout; // 30 giây sau thử lại
    this.state = "CLOSED";
    this.lastFailTime = null;
  }

  async call(fn) {
    // OPEN — skip luôn, không gọi
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailTime > this.resetTimeout) {
        this.state = "HALF-OPEN"; // thử 1 request
      } else {
        throw new Error("Circuit breaker OPEN — tool tạm ngắt");
      }
    }

    try {
      const result = await fn();
      this.failures = 0;
      this.state = "CLOSED"; // ok → đóng lại
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailTime = Date.now();
      if (this.failures >= this.threshold) {
        this.state = "OPEN"; // quá nhiều lỗi → mở
        console.warn("Circuit breaker OPENED — ngắt tool");
      }
      throw error;
    }
  }
}

// Sử dụng
const weatherBreaker = new CircuitBreaker(3, 30000);
try {
  const weather = await weatherBreaker.call(() => getWeather("Hanoi"));
} catch {
  // Circuit open → dùng fallback
  return "Không lấy được thời tiết lúc này.";
}
```

> [!tip] 💡
> Circuit breaker **rất quan trọng cho tool chaining** — nếu tool A luôn fail mà vẫn gọi, cả chain bị chậm vô nghĩa.

---
### 4️⃣ Gửi lỗi cho LLM — Để LLM tự xử lý
Pattern đặc biệt của LLM agent: **gửi error message lại cho LLM** → LLM tự quyết định: retry, chọn tool khác, hoặc trả lời user.
```js
// ❌ Bad — tool fail thì crash cả agent
function executeTool(name, args) {
  return TOOL_MAP[name](args); // throw error → agent chết
}

// ✅ Good — bắt lỗi, gửi error cho LLM
function executeTool(name, args) {
  try {
    return TOOL_MAP[name](args);
  } catch (error) {
    // Trả error message cho LLM thay vì crash
    return `ERROR: Tool ${name} failed — ${error.message}. ` +
           `Hãy thử cách khác hoặc báo user.`;
  }
}
```

**LLM nhận error message → có thể:**
- Gọi lại tool với params khác
- Chọn tool khác (fallback)
- Trả lời user "Xin lỗi, không lấy được dữ liệu"to
```js
// Ví dụ thực tế trong agent loop
for (const block of response.content) {
  if (block.type === "tool_use") {
    const result = executeTool(block.name, block.input);
    toolResults.push({
      type: "tool_result",
      tool_use_id: block.id,
      content: result,
      // Nếu lỗi, đánh dấu is_error để LLM biết
      ...(result.startsWith("ERROR") && { is_error: true })
    });
  }
}
// LLM đọc error → tự quyết định bước tiếp theo
```

> [!note] 📝 So sánh dễ hiểu
> Pattern 1-3 là **bạn** (developer) xử lý lỗi.
> Pattern 4 là **để LLM** xử lý lỗi — vì LLM biết context cuộc hội thoại, có thể quyết định thông minh hơn.
> **Kết hợp cả 2** là best practice: bạn xử lý lỗi kỹ thuật (retry, circuit breaker), LLM xử lý lỗi logic (chọn tool khác, thay đổi strategy).

---
## 📐 Kết hợp tất cả — Layered Error Handling

```
User request
    │
    ▼
┌─────────────────────────────────────┐
│  Layer 1: Circuit Breaker           │ ← tool đang bị ngắt? → skip
│  Layer 2: Retry + Backoff           │ ← lỗi tạm thời? → retry
│  Layer 3: Fallback                  │ ← retry hết? → plan B
│  Layer 4: Gửi error cho LLM        │ ← fallback cũng fail? → LLM quyết
│  Layer 5: Graceful failure          │ ← LLM cũng bó tay? → "Xin lỗi..."
└─────────────────────────────────────┘
```

```js
async function executeToolSafe(name, args) {
  const breaker = circuitBreakers[name];

  try {
    // Layer 1: Circuit breaker
    return await breaker.call(async () => {
      // Layer 2: Retry
      return await retryWithBackoff(() => TOOL_MAP[name](args), 3);
    });
  } catch (error) {
    // Layer 3: Fallback
    const fallbackResult = await tryFallback(name, args);
    if (fallbackResult) return fallbackResult;

    // Layer 4: Gửi error cho LLM
    return `ERROR: ${name} không khả dụng — ${error.message}. Hãy thử cách khác.`;
  }
  // Layer 5: Agent loop sẽ trả "Xin lỗi" nếu max_turns hết
}
```

> [!danger] ⛔
> **Không bao giờ** để tool error crash cả agent. Luôn bắt lỗi và xử lý gracefully — dù là retry, fallback, hay báo lỗi cho user.

---
## ⚠️ Anti-patterns

| Anti-pattern | Vấn đề | Fix |
|---|---|---|
| **Retry mù** | Retry lỗi 401 (auth) mãi không fix | Phân loại lỗi: chỉ retry transient |
| **Retry storm** | 1000 request retry cùng lúc | Thêm jitter (random delay) |
| **Silent failure** | Tool fail nhưng trả `null` | Trả error message rõ ràng |
| **Infinite retry** | Retry mãi không dừng | Set max retries + circuit breaker |
| **Không log** | Tool fail nhưng không biết | Log mỗi error + retry attempt |

---
## 🔗 Concept liên quan
- [[2-Tool Chaining]] — error propagation trong chain (error handling fix vấn đề này)
- [[0-Function Calling]] — agent loop (error handling nằm trong loop)
- [[1-Build Tool]] — validation tool input/output
- [[LLM Design Patterns]] — Guardrails pattern liên quan đến error handling
- [[Glossary]] — bảng thuật ngữ

---
## 📚 Tham khảo
- 🔥 [4 Fault Tolerance Patterns Every AI Agent Needs in Production](https://dev.to/klement_gunndu/4-fault-tolerance-patterns-every-ai-agent-needs-in-production-jih) — Cover 4 patterns chính (retry, fallback, circuit breaker, checkpointing). Claim giảm unrecoverable failures từ 23% xuống dưới 2%.
- 🔥 [Retries, Fallbacks, and Circuit Breakers in LLM Apps](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/) — Từ Portkey (LLM gateway). So sánh khi nào dùng retry vs fallback vs circuit breaker. Có decision flowchart rất trực quan.
- [Error Handling & Retries: Making LLM Calls Reliable](https://medium.com/@sonitanishk2003/error-handling-retries-making-llm-calls-reliable-ee7722fc2ea9) — Tutorial hands-on exponential backoff + jitter cho LLM API calls. Code examples bằng JavaScript.
- [Error Recovery and Fallback Strategies in AI Agent Development](https://www.gocodeo.com/post/error-recovery-and-fallback-strategies-in-ai-agent-development) — Tổng quan error recovery strategies cho AI agent. Cover từ basic retry đến human escalation.

---
## ✅ Checklist
- [ ] Phân biệt **lỗi transient** (retry được: 429, 500, timeout) vs **permanent** (không retry: 401, 400)
- [ ] Implement **exponential backoff + jitter** cho retry
- [ ] Có **fallback** cho tool và model — plan B khi plan A fail
- [ ] Implement **circuit breaker** — ngắt tool fail liên tục, tránh waste resource
- [ ] **Gửi error cho LLM** — để LLM tự quyết (retry, chọn tool khác, báo user)
- [ ] **Kết hợp layered** — circuit breaker → retry → fallback → LLM → graceful failure
- [ ] **Không bao giờ** để tool error crash cả agent
- [ ] **Log mọi error** — tool nào, lỗi gì, retry mấy lần, kết quả cuối
