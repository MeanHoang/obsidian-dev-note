# Shopify Editions Spring '26 — AI Tooling: Dev MCP & Commerce Skills

> AI Toolkit biến các agent (Claude Code, Cursor, Codex) thành Shopify-aware developer assistant. MCP server cung cấp API schema, code validation, CLI automation trực tiếp trong IDE.

---

## 1. Commerce Skills for Your Favorite Agent

Build và quản lý storefront, app, theme trực tiếp từ AI tool. Shopify cung cấp **AI Toolkit** — bộ commerce skill dạng MCP server + prompt, cho phép agent hiểu context Shopify.

### Cài đặt

**Claude Code (plugin):**
```bash
claude plugin install shopify-ai-toolkit@claude-plugins-official
```

**Claude Code (MCP server):**
```bash
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

**Codex:**
```bash
codex plugin add shopify@openai-curated
```

**Cursor:** `/add-plugin shopify` trong Chat, hoặc MCP config:
```json
{
  "mcpServers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"]
    }
  }
}
```

**Manual skills:**
```bash
npx skills add Shopify/shopify-ai-toolkit --skill shopify-admin
```

### Capabilities

- Developer docs & API schema lookup
- Code validation (GraphQL queries, Liquid templates, Extensions)
- Store management (CLI tasks với authenticated context)
- Scaffold app, query API, sửa theme mà không rời IDE

### Yêu cầu

- Node.js 18+
- Supported agents: Claude Code, Codex, Antigravity CLI, Cursor, Hermes (plugin), VS Code

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/ai-toolkit

---

## 2. Shopify Dev MCP — Optimized Token Usage

Response từ MCP server dùng **ít token hơn** mà vẫn giữ accuracy. Agent nhận context Shopify hiệu quả hơn về cost.

**Impact:** Giảm chi phí khi dùng AI agent build Shopify app, đặc biệt với context window lớn.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/ai-toolkit#install-with-the-dev-mcp-server

---

## 3. Shopify Dev MCP — All API Versions

MCP cung cấp context chính xác và code validation cho **tất cả supported API version**, không chỉ latest.

**Impact:** Khi maintain app dùng API version cũ, agent sinh code đúng cho version đó — không generate field/mutation chưa có hoặc đã deprecated.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/ai-toolkit#install-with-the-dev-mcp-server

---

## 4. AI Toolkit for Checkout Extension Migration

Dùng AI để migrate checkout extension sang **Polaris web component** tự động.

### Cách dùng

Prompt agent: *"Use the shopify polaris checkout extensions skill to upgrade the `extensions/$extensionFolder`"*

### Migration steps (AI-assisted)

1. Update `shopify.extension.toml` → API version `2026-04`+
2. Replace `useMetafield()` → `shopify.appMetafields`
3. Replace React components → web components (`<Checkbox>` → `<s-checkbox>`, `<Button>` → `<s-button>`)
4. Replace React → Preact `^10.10.x` + `@preact/signals` `^2.3.x`

### Mapping ví dụ

| React (cũ) | Web Component (mới) |
|------------|---------------------|
| `<Checkbox>` | `<s-checkbox>` |
| `<Button>` | `<s-button>` |
| `<InlineStack>` | `<s-stack>` |
| `<TextField>` | `<s-text-field>` |

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/checkout/migrate-to-web-components#migrate-using-ai

---

## 5. AI Toolkit for Checkout Performance Audit

Dùng AI để **audit checkout UI extension** về performance và nhận optimization recommendation.

### Optimization areas

1. **Eliminate external network calls** — dùng metafields/metaobjects thay vì call external API
2. **Bundle size reduction** — audit với esbuild metafile, thay Day.js bằng native `Intl.DateTimeFormat`
3. **Module-scope execution** — tránh network calls, parsing, SDK init ở module scope
4. **Data access patterns** — read Preact Signals ở leaf components, tránh re-render parent

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/checkout/extension-performance

---

## 6. Revamped Polaris Docs

Toàn bộ Polaris reference docs viết lại: nhiều code sample hơn, use case rõ ràng, navigation cải thiện.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/polaris

---

## Nguồn

- https://shopify.dev/docs/apps/build/ai-toolkit
- https://shopify.dev/docs/apps/build/checkout/migrate-to-web-components#migrate-using-ai
- https://shopify.dev/docs/apps/build/checkout/extension-performance
- https://shopify.dev/docs/api/polaris
