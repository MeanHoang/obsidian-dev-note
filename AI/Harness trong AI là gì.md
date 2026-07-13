# Harness trong AI là gì?

> **TL;DR**: Model AI (LLM) chỉ là một hàm nhận text → trả text. Nó không tự đọc được file, không tự chạy được lệnh, không tự nhớ được gì. **Harness là toàn bộ phần mềm bao quanh model** để biến nó từ "bộ não trong lọ" thành một agent làm được việc thật. Claude Code, Cursor Agent, OpenAI Codex CLI... đều là harness.

---

## 1. Vấn đề gốc: LLM tự nó rất "bất lực"

Bản chất một LLM chỉ làm đúng một việc:

```
input tokens  →  [model]  →  output tokens
```

Tức là:
- ❌ Không đọc/ghi được file
- ❌ Không chạy được lệnh terminal
- ❌ Không gọi được API, không search web
- ❌ Không có bộ nhớ giữa các lần gọi (stateless)
- ❌ Không tự biết khi nào nên dừng, khi nào lặp lại

Model chỉ có thể **nói** "tôi muốn đọc file X" — nhưng phải có ai đó thực sự đi đọc file X rồi đưa nội dung lại cho nó. "Ai đó" chính là **harness**.

## 2. Sơ đồ tổng quan

![[ai-agent-architecture.svg]]

## 3. Harness làm những gì?

Harness là vòng lặp (agent loop) + hạ tầng xung quanh model:

```
┌────────────────────── HARNESS ──────────────────────┐
│                                                     │
│  User input ──► ghép system prompt + context        │
│                        │                            │
│                        ▼                            │
│                   gọi LLM API ◄────────────┐        │
│                        │                   │        │
│                        ▼                   │        │
│              model trả lời / gọi tool      │        │
│                        │                   │        │
│         ┌──────────────┴──────────┐        │        │
│         ▼                         ▼        │        │
│   text → hiển thị cho user   tool call     │        │
│                                   │        │        │
│                                   ▼        │        │
│                     harness THỰC THI tool  │        │
│                     (đọc file, chạy bash…) │        │
│                                   │        │        │
│                                   └── kết quả trả về│
│                                       cho model ────┘
└─────────────────────────────────────────────────────┘
```

Cụ thể harness chịu trách nhiệm:

| Việc | Giải thích |
|---|---|
| **Agent loop** | Vòng lặp: gọi model → model xin dùng tool → thực thi tool → đưa kết quả lại → gọi model tiếp... đến khi xong task |
| **Tool execution** | Model chỉ *xin* chạy `Read`, `Bash`, `Edit`... — harness mới là thứ thực sự đụng vào filesystem/terminal |
| **System prompt** | Harness nhét sẵn chỉ dẫn, quy tắc, thông tin môi trường (OS, thư mục, ngày tháng...) vào trước tin nhắn của user |
| **Context management** | Quyết định nhét gì vào context window: file nào, lịch sử nào; khi hội thoại dài quá thì tóm tắt (compact) |
| **Permission / safety** | Hỏi user trước khi chạy lệnh nguy hiểm, sandbox, allowlist/denylist |
| **Memory** | LLM stateless → harness lưu hội thoại, lưu memory ra file để phiên sau đọc lại |
| **UI/UX** | Render markdown ra terminal, hiển thị diff, progress, cho user interrupt |
| **Retry / error handling** | API lỗi thì retry, tool fail thì đưa error message về cho model tự sửa |

## 3. Ví dụ cụ thể

Khi mình gõ trong Claude Code: *"sửa bug trong file app.js"*

1. **Harness** ghép: system prompt + nội dung CLAUDE.md + memory + câu hỏi của mình → gửi lên API
2. **Model** trả về: "tôi muốn gọi tool `Read` với path `app.js`"
3. **Harness** thực sự đọc file, gửi nội dung lại cho model
4. **Model**: "tôi muốn gọi tool `Edit` sửa dòng 42"
5. **Harness** hỏi mình cho phép không → sửa file thật → báo kết quả cho model
6. **Model** trả lời text: "đã sửa xong" → **harness** render ra terminal

👉 Model không hề "chạm" vào máy mình. Mọi tác động thật đều do harness làm.

## 4. Vì sao dạo này nghe từ này nhiều?

- **Cùng 1 model, harness khác nhau → chất lượng khác hẳn.** Claude trong claude.ai (chat) vs Claude trong Claude Code (coding agent) là cùng model nhưng khả năng làm việc khác nhau một trời một vực — khác biệt nằm ở harness.
- Các benchmark agent (SWE-bench...) giờ ghi rõ "model X + harness Y" vì harness ảnh hưởng lớn đến điểm số.
- Cuộc đua AI coding hiện tại thực chất là **cuộc đua harness**: Claude Code vs Cursor vs Codex vs Copilot — nhiều khi dùng chung model, chỉ khác harness.
- Trong hệ thống prompt của các tool, chữ "harness" được dùng để chỉ chính cái CLI/app đang chạy model (vd: "the harness executes hooks", "harness tracks file state").

## 5. Các từ liên quan (dễ nhầm)

| Từ | Nghĩa |
|---|---|
| **Model / LLM** | Bộ não thuần: token in → token out |
| **Harness** | Toàn bộ khung vận hành quanh model (loop + tools + context + UI) |
| **Agent** | Model + harness hoạt động cùng nhau để tự hoàn thành task nhiều bước |
| **Scaffold(ing)** | Từ gần nghĩa với harness, hay dùng thay thế nhau |
| **Runtime** | Cũng gần nghĩa — môi trường thực thi agent |
| **Test harness** | Nghĩa gốc trong software: framework chạy test (Jest, Vitest). "AI harness" mượn ý tưởng này: khung để "chạy" model |

## 6. Ghi nhớ nhanh

> **Model là bộ não, harness là cơ thể + môi trường sống.**
> Não giỏi mấy mà không có tay chân (tools), trí nhớ (memory), giác quan (context) thì cũng không làm được việc gì. Harness cung cấp tất cả những thứ đó.

---

## 7. Đọc tiếp (nâng cao)

- [[Harness design cho app chạy dài (Anthropic)]] — thiết kế harness thế nào cho agent chạy nhiều giờ: chia vai Planner/Generator/Evaluator, và nghịch lý "model càng giỏi càng gỡ bớt harness".
