# Shopify AI Toolkit

**Shopify AI Toolkit** kết nối AI coding agent với Shopify development ecosystem — cung cấp access tới dev docs, API schema, code validation, và store management trực tiếp trong IDE/CLI.

---

## Core Features

- **Developer Resources**: access Shopify API surfaces + schemas, reference current docs thay vì dựa training data
- **Code Validation**: validate GraphQL queries, Liquid templates, Shopify Extensions theo official schemas
- **Store Management**: thực thi supported store-management tasks qua Shopify CLI context
- **UCP Integration**: cài `ucp` skill để gọi Catalog, Cart, Checkout, Order MCP qua natural language

---

## Requirements

- **Node.js 18+**

---

## Installation

### Plugin (recommended)

| Platform | Command |
|---|---|
| Claude Code | `claude plugin install shopify-ai-toolkit@claude-plugins-official` |
| Codex | `codex plugin add shopify@openai-curated` |
| Antigravity CLI | `agy plugin install https://github.com/Shopify/shopify-ai-toolkit` |
| Cursor | `/add-plugin shopify` (trong Chat) |
| VS Code | Command Palette > Install Plugin From Source > `https://github.com/Shopify/shopify-ai-toolkit` |

### Agent Skills

Cài tất cả skills:
```bash
npx skills add Shopify/shopify-ai-toolkit
```

Cài skill riêng lẻ:
```bash
npx skills add Shopify/shopify-ai-toolkit --skill shopify-admin
```

### MCP Server

**Claude Code:**
```bash
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

**Codex** (`~/.codex/config.toml`):
```toml
[mcp_servers.shopify-dev-mcp]
command = "npx"
args = ["-y", "@shopify/dev-mcp@latest"]
```

**Antigravity CLI** (`~/.gemini/config/mcp_config.json`):
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

---

## UCP CLI

Cài global:
```bash
npm install -g @shopify/ucp-cli
```

Init agent profile:
```bash
ucp profile init --name agent
```

Verify setup:
```bash
ucp doctor
```

### Ví dụ workflow

```bash
# Search
ucp catalog search --set /query='wireless headphones' --format md

# Cart
ucp cart create --business https://store.example.com \
  --set /line_items/0/item/id='gid://shopify/ProductVariant/123' \
  --set /line_items/0/quantity=1

# Checkout
ucp checkout create --business https://store.example.com \
  --input '{"cart_id":"gid://shopify/Cart/abc"}'

# Order
ucp order get gid://shopify/Order/789 --business https://store.example.com
```

### CLI Flags

| Flag | Mô tả |
|---|---|
| `--set /path=value` | Set input parameter |
| `--input '{json}'` | JSON payload |
| `--input-schema` | Hiện required fields |
| `--business <url>` | Merchant domain |
| `--view :compact` | Output display mode |
| `--format md\|json` | Output format |

### Browser Escalation

```bash
export UCP_ON_ESCALATION='jq -r .url | xargs open'
```

Tự động mở browser khi checkout cần escalation.

---

## GitHub

- https://github.com/Shopify/shopify-ai-toolkit

---

## Docs gốc

- Shopify AI Toolkit: https://shopify.dev/docs/apps/build/ai-toolkit
- Quickstart: https://shopify.dev/docs/agents/get-started/quickstart
