# HTML vs Markdown cho AI Coding Docs

> Source nguồn gốc: **["The Unreasonable Effectiveness of HTML"](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/)** — tác giả **Thariq Shihipar** (engineering lead Claude Code team @ Anthropic), Simon Willison cover lại 08/05/2026.

## TL;DR

Không có "format duy nhất tốt nhất". Chọn theo **hướng đi của data flow**:

| Use case | Format thắng | Lý do |
|---|---|---|
| Doc **INPUT** cho AI đọc (CLAUDE.md, llms.txt, README, docs/) | **Markdown** | HTML đốt 3x–10x token cho cùng content |
| AI **OUTPUT** cho human đọc (PR review, dashboard, code explain) | **HTML artifact** | Layout + density + interactivity > token cost |
| Prompt structure gửi **Claude API** | **XML tags** (`<instructions>`, `<context>`) | Anthropic train Claude với XML-style → parse cleaner |

## Lập luận của Thariq (HTML output)

Khi bảo Claude xuất output cho **người đọc**, request HTML thay MD vì HTML cho:
- **SVG diagram inline** (vẽ kiến trúc, flow chart trực tiếp)
- **Interactive widget** (collapse/expand, tabs, anchor nav)
- **In-page navigation** (TOC sidebar, jump-to-section)
- **Color-coded annotation** (vd PR review: highlight diff theo severity)

Prompt example:
> Help me review this PR by creating an **HTML artifact** that describes it. Render the actual diff with inline margin annotations, color-code findings by severity.

Output đẹp + dày thông tin hơn hẳn markdown plain text trong terminal.

## ⚠️ Caveat — HTML KHÔNG dành cho doc input

Đây là điểm dễ nhầm:

- HTML có CSS/JS thực tế đốt **8-10x token** so MD ([Beam.ai benchmark 2026](https://beam.ai/agentic-insights/html-vs-markdown-which-format-actually-makes-ai-agents-more-useful))
- Convert HTML → MD giảm tới **~90% token** ([ReleasePad](https://www.releasepad.io/blog/html-vs-markdown-the-optimal-format-for-llm-content-ingestion/))
- Heading: MD ~3 token vs HTML ~12-15 token
- 1 doc đầy đủ: ~2,800 token MD vs ~8,000 token HTML

Cloudflare cũng vừa launch **["Markdown for Agents"](https://blog.cloudflare.com/markdown-for-agents/)** — chuẩn hoá serve doc cho AI agent dưới dạng MD (qua `Accept: text/markdown` content negotiation), không phải HTML.

## XML cho prompt structure (Claude-specific)

Anthropic train Claude với XML-style tags → Claude parse XML cleaner hơn markdown headers ([Claude API docs](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)).

```xml
<instructions>
Review the following PR and flag security issues.
</instructions>

<context>
{{repo_summary}}
</context>

<diff>
{{pr_diff}}
</diff>
```

Tag dùng phổ biến: `<instructions>`, `<context>`, `<example>`, `<formatting>`, `<thinking>`.

Tradeoff: XML đốt token nhiều hơn MD ~15% (do có closing tag) nhưng đổi lại structural clarity.

## Áp dụng cho Joy Loyalty workflow

- **CLAUDE.md + `docs/` + prompt cache files** → giữ `.md`. KHÔNG đổi.
- **Output Claude Code** khi review PR Shopify app / debug Firestore query / giải thích Cloud Functions phức tạp → thử thêm vào prompt:
  > "output as HTML artifact with collapsible sections + color-coded diff + SVG architecture diagram"
  
  Mở artifact trong browser thay vì đọc terminal text.
- **Prompt template gửi Claude API** (nếu Joy có service backend gọi Claude cho auto-reply / classification) → cấu trúc bằng **XML tags**, không phải markdown.

## Quick decision tree

```
Bạn đang viết gì?
├── File để AI đọc làm context
│   └── → Markdown (.md)
├── Output Claude tạo ra cho mình review
│   └── → HTML artifact (richer UI)
└── Prompt template cho Claude API call
    └── → XML tags structure
```

## Refs

- [Simon Willison — Unreasonable Effectiveness of HTML (08/05/2026)](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/)
- [Cloudflare — Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/)
- [Beam.ai — HTML vs Markdown 2026 benchmark](https://beam.ai/agentic-insights/html-vs-markdown-which-format-actually-makes-ai-agents-more-useful)
- [ReleasePad — HTML vs MD for LLM ingestion](https://www.releasepad.io/blog/html-vs-markdown-the-optimal-format-for-llm-content-ingestion/)
- [Claude API docs — Use XML tags](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)
- [Medium — HTML vs MD for LLMs (token analysis)](https://medium.com/@dhsoni2510/html-vs-markdown-for-llms-when-each-one-wins-and-what-it-costs-you-21c1c4020f75)
