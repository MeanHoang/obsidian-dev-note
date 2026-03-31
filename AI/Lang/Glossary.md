# 📖 Glossary — Định nghĩa & thuật ngữ

> Gặp khái niệm nào khó hiểu thì note vào đây. Mỗi lần quay lại đọc là nhớ thêm 1 chút.

---

## A
**Autoregressive Generation** — Cách LLM tạo văn bản: sinh **từng token một**, mỗi token mới dựa trên tất cả token trước đó. Giống gõ tin nhắn mà bàn phím gợi ý từ tiếp theo — chọn 1 từ, rồi gợi ý tiếp, cứ thế cho đến hết câu.

## B

## C
**Chain-of-Thought (CoT)** — Kỹ thuật bắt LLM suy nghĩ từng bước trước khi đưa ra câu trả lời cuối cùng. Giúp tăng độ chính xác cho task phức tạp.

**Chunking** — Chia document lớn thành đoạn nhỏ (chunks) để embed và tìm kiếm trong RAG. Các strategies: fixed-size, recursive (mặc định), semantic, document-aware. Khuyến nghị 400-512 tokens cho đa số use case.

**Circuit Breaker** — Pattern ngắt mạch: nếu tool fail liên tục N lần → tạm ngắt, không gọi nữa trong X giây. Tránh waste resource khi service đang down. Có 3 state: Closed (bình thường) → Open (ngắt) → Half-Open (thử lại 1 request).

**Context Window** — Giới hạn số token mà LLM có thể "nhìn thấy" trong 1 lần (bao gồm cả prompt + output). Ví dụ: GPT-4 = 128K tokens, Claude = 200K tokens.

## D

## E
**Evals (Evaluation)** — Hệ thống đánh giá chất lượng output của LLM. Có 3 cách: metric-based (BLEU, ROUGE), LLM-as-judge (dùng LLM chấm điểm), human eval (người chấm). Không eval = không biết model đang tốt hay tệ.

**Embedding** — Chuyển text thành vector số (mảng số). Các text có nghĩa giống nhau sẽ có vector gần nhau. Dùng trong RAG để tìm tài liệu liên quan.

## F
**Exponential Backoff** — Kỹ thuật retry: mỗi lần fail thì đợi lâu hơn gấp đôi (1s → 2s → 4s → 8s). Thường kết hợp với jitter (random thêm delay) để tránh retry storm. Dùng cho lỗi transient (429, 500, timeout).

**Fallback** — Phương án dự phòng khi plan A fail. Ví dụ: Claude fail → dùng GPT, search API fail → dùng cache. Trong agent có nhiều cấp: fallback tool → fallback model → fallback response → human escalation.

**Fine-tuning** — Train thêm model trên data cụ thể để nó giỏi hơn ở 1 task. Có full fine-tuning (đắt) và LoRA/QLoRA (rẻ hơn). Chỉ dùng khi prompting + RAG không đủ.

**Few-shot** — Kỹ thuật prompt cho vài ví dụ mẫu để LLM hiểu pattern mình muốn.

**Function Calling / Tool Use** — Khả năng LLM chọn và gọi tool/function bên ngoài. LLM không chạy code trực tiếp — nó trả về "tôi muốn gọi hàm X với params Y", app của mình thực thi rồi trả kết quả lại. "Tool Use" là tên hiện đại hơn, "Function Calling" là tên gốc từ OpenAI.

## G
**Guardrails** — "Rào chắn" kiểm tra input/output của LLM. Input guardrails block prompt injection, nội dung xấu. Output guardrails kiểm tra format (JSON), safety, factuality. Không phải optional — cần có từ sớm.

## H
**Hybrid Search** — Kết hợp dense search (vector, hiểu ngữ nghĩa) + sparse search (keyword, exact match). Cho kết quả tốt nhất — production standard 2026. Hầu hết vector stores hỗ trợ built-in.

**Hallucination** — LLM tự bịa thông tin nghe rất thuyết phục nhưng hoàn toàn sai. Ví dụ: trích dẫn paper không tồn tại, đưa ra API không có thật.

## I

## J
**JSON Mode** — Flag trong API bắt LLM chỉ trả về valid JSON (không trả text tự do). OpenAI hỗ trợ qua `response_format: { type: "json_object" }`. Đảm bảo valid JSON nhưng không đảm bảo đúng schema.

**JSON Schema** — Bản "thiết kế kỹ thuật" mô tả cấu trúc JSON: field nào, kiểu gì, bắt buộc hay không. Dùng để ép LLM trả output đúng cấu trúc mong muốn.

## K

## L
**LLM (Large Language Model)** — Mô hình ngôn ngữ lớn, được train trên lượng text khổng lồ. Ví dụ: GPT-4, Claude, Gemini, Llama.

## M
**Multimodal** — Model có khả năng hiểu nhiều loại input: text, hình ảnh, audio, video. Hầu hết LLM lớn hiện tại (GPT-4o, Claude, Gemini) đều multimodal.

## N

## O
**Open-weights** — Model AI được phát hành công khai weights (trọng số), cho phép tải về chạy trên infra riêng. Ví dụ: LLaMA, Mistral, DeepSeek. Khác với "open-source" hoàn toàn vì training code/data thường không được chia sẻ.

## P
**Parallel** — Làm nhiều việc **cùng lúc**, ngược với sequential (làm lần lượt). Trong LLM: parallel tool calls = gọi nhiều tool trong 1 response. Trong code: parallel requests = gửi nhiều API call cùng lúc. Điều kiện: các task phải độc lập — kết quả task A không phụ thuộc task B.

**Prompt** — Câu lệnh/input bạn đưa cho LLM. Bao gồm system prompt + user prompt.

**Prompt Injection** — Kỹ thuật tấn công LLM bằng cách nhúng instruction độc hại vào input. LLM không phân biệt được instruction của developer vs input của user, nên có thể bị hijack. Hiện chưa có giải pháp hoàn chỉnh — cần thiết kế architecture phòng thủ nhiều lớp.

**Pydantic** — Thư viện Python để validate và parse data bằng type hints. Dùng nhiều trong structured output để đảm bảo LLM trả đúng kiểu dữ liệu. Ví dụ: `class User(BaseModel): name: str; age: int`.

## Q

## R
**Reasoning Model** — Model AI có khả năng "suy nghĩ" (chain-of-thought nội bộ) trước khi trả lời. Tốn nhiều token hơn nhưng chính xác hơn cho task logic, toán, code phức tạp. Ví dụ: OpenAI o1/o3, DeepSeek R1.

**RAG (Retrieval Augmented Generation)** — Kỹ thuật cho LLM truy cập data bên ngoài (database, documents...) trước khi trả lời. Giúp giảm hallucination và trả lời đúng với data của mình.

## S
**Sequential** — Làm từng việc **lần lượt**, xong cái này mới đến cái kia. Ngược với parallel. Dùng khi task B phụ thuộc kết quả task A.

**SDK (Software Development Kit)** — Thư viện code giúp gọi API dễ hơn thay vì tự viết HTTP request. Ví dụ: `openai` (Python), `anthropic` (Python).

**Structured Output** — Kỹ thuật ép LLM trả về data có cấu trúc (JSON) thay vì text tự do. Có 3 cách: prompt-based, JSON mode, schema enforcement. Quan trọng khi build app vì code cần parse được output.

**Stop Reason** — Field trong API response cho biết **tại sao LLM dừng sinh text**. `"end_turn"` = trả lời xong. `"tool_use"` = muốn gọi tool. `"max_tokens"` = hết token cho phép. Dùng trong agent loop để quyết định loop tiếp hay dừng.

**Streaming** — Cách nhận response từ LLM **từng phần** thay vì đợi toàn bộ. Giống ChatGPT chữ hiện dần — không nhanh hơn nhưng UX tốt hơn.

**System Prompt** — Prompt đặt ở đầu conversation để set behavior xuyên suốt. User không thấy nhưng ảnh hưởng mọi câu trả lời.

## T
**Tool Chaining** — Gọi nhiều tool liên tiếp, output tool trước làm input cho tool sau. LLM tự quyết chuỗi tool nào cần gọi. Ví dụ: search → check stock → create order. Giữ chain ngắn (< 5-6 bước) để tránh error propagation và context window overflow.

**Tool Choice** — Tham số kiểm soát cách LLM chọn tool: `auto` (tự quyết), `any` (bắt buộc gọi tool), `none` (không được gọi), hoặc force vào tool cụ thể. Dùng force tool để hack lấy structured output.

**Tool Use Loop** — Pattern cốt lõi của agent: gọi API → nhận tool call → app thực thi → gửi kết quả lại → LLM quyết định tiếp (gọi thêm tool hoặc trả lời user). Loop này là nền tảng của mọi AI agent.

**Temperature** — Tham số kiểm soát mức độ sáng tạo/ngẫu nhiên của output. 0 = deterministic, 1 = sáng tạo.

**Token** — Đơn vị nhỏ nhất mà LLM xử lý. Không phải 1 từ = 1 token. Tiếng Anh: ~1 token = 0.75 từ. Tiếng Việt: tốn nhiều token hơn do encoding.

**Top-p** — Tham số giới hạn LLM chỉ chọn từ các token có tổng xác suất ≤ p. top_p nhỏ = output an toàn, top_p lớn = output đa dạng.

## U

## V
**Vector Store** — Database lưu trữ embedding vectors và hỗ trợ tìm kiếm theo "độ giống nhau" (similarity search). Ví dụ: Pinecone, Chroma, pgvector.

## W

## X

## Y

## Z
**Zero-shot** — Kỹ thuật prompt hỏi thẳng không cho ví dụ. LLM tự suy luận từ kiến thức có sẵn.
