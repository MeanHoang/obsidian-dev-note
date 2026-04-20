# MCP (Model Context Protocol)

> [!quote] 💬
> "Trước USB-C, mỗi thiết bị một dây sạc riêng. MCP là USB-C cho AI — một chuẩn kết nối duy nhất cho mọi tool."

---
## 🎯 MCP là gì?
**MCP (Model Context Protocol)** là một **open protocol** do Anthropic tạo ra (11/2024), chuẩn hóa cách LLM app kết nối với tools, data sources và services bên ngoài.
Trước MCP, mỗi lần muốn LLM gọi 1 tool mới → phải viết integration code riêng. Có 5 tool × 3 app = **15 integrations** (M×N problem). Với MCP, tool tạo 1 MCP server, app tạo 1 MCP client → **5 + 3 = 8** (M+N problem).

> [!note] 📝 So sánh dễ hiểu
> Giống ổ cắm điện: trước mỗi nước một kiểu ổ cắm, bạn phải mang adapter riêng cho từng nước. MCP là **chuẩn ổ cắm chung** — cứ đúng chuẩn là cắm được, không cần biết thiết bị gì hay nước nào.

---
## 🏗️ Kiến trúc MCP
MCP dùng mô hình **Host → Client → Server**:
```
┌─────────────────────────────────────────┐
│  Host (Claude Desktop, IDE, App...)     │
│                                         │
│  ┌──────────┐  ┌──────────┐             │
│  │ Client A │  │ Client B │  ...        │
│  └────┬─────┘  └────┬─────┘             │
└───────┼──────────────┼──────────────────┘
        │              │
   ┌────▼─────┐   ┌───▼──────┐
   │ Server A │   │ Server B │
   │ (GitHub) │   │ (Slack)  │
   └──────────┘   └──────────┘
```

| Thành phần | Vai trò                                                                  |
| ---------- | ------------------------------------------------------------------------ |
| **Host**   | App chạy LLM (Claude Desktop, IDE...). Quản lý nhiều Client              |
| **Client** | Duy trì 1 kết nối 1-1 với 1 Server. Host tạo ra nhiều Client             |
| **Server** | Expose tools, resources, prompts cho Client dùng. Chạy như process riêng |
|            |                                                                          |

### Luồng hoạt động
1. Host khởi động → tạo các MCP Client
2. Client **handshake** với Server (trao đổi capabilities, protocol version)
3. Client hỏi Server: "Bạn có những tools/resources/prompts gì?"
4. Server trả về danh sách + mô tả
5. Khi LLM cần gọi tool → Host gửi request qua Client → Server thực thi → trả kết quả

---
## 🧩 3 Primitives cốt lõi
MCP Server expose 3 loại capability:
### 1️⃣ Tools — "LLM làm được việc"
- Giống [[0-Function Calling|Function Calling]] — LLM gọi hàm để thực hiện action
- Ví dụ: tạo issue trên GitHub, gửi email, query database
- LLM **tự quyết định** khi nào gọi tool nào (model-controlled)
```js
// Định nghĩa tool trong MCP Server
server.tool("create-issue", {
  title: z.string(),
  body: z.string(),
  repo: z.string()
}, async ({ title, body, repo }) => {
  // Gọi GitHub API tạo issue
  const issue = await github.createIssue(repo, { title, body });
  return { content: [{ type: "text", text: `Created #${issue.number}` }] };
});
```

### 2️⃣ Resources — "LLM đọc được data"
- Cung cấp **context/data** cho LLM (read-only)
- Ví dụ: nội dung file, database records, API response
- **App-controlled** — app quyết định load resource nào, không phải LLM
```js
// Expose file content làm resource
server.resource("config", "config://app", async () => {
  const config = await fs.readFile("config.json", "utf-8");
  return { contents: [{ uri: "config://app", text: config }] };
});
```

### 3️⃣ Prompts — "Template tái sử dụng"
- Prompt template có sẵn mà user có thể chọn dùng
- Ví dụ: "Review code này", "Tóm tắt PR này"
- **User-controlled** — user chọn prompt nào, không phải LLM tự chọn
```js
// Định nghĩa prompt template
server.prompt("review-code", { code: z.string() }, ({ code }) => ({
  messages: [{
    role: "user",
    content: { type: "text", text: `Review code sau và đề xuất cải thiện:\n${code}` }
  }]
}));
```

> [!tip] 💡
> Dễ nhớ: **Tools** = LLM tự gọi (action), **Resources** = App tự load (context), **Prompts** = User tự chọn (template). Ai kiểm soát là khác biệt chính.

---
## ⚔️ MCP vs Function Calling
Đây là câu hỏi phổ biến nhất — **MCP không thay thế Function Calling, chúng bổ sung cho nhau**

| | Function Calling | MCP |
|---|---|---|
| **Là gì** | LLM chọn function + params | Protocol chuẩn hóa kết nối tool |
| **Scope** | "Tôi muốn gọi hàm X" | "Tìm tool ở đâu, gọi thế nào, kết quả ra sao" |
| **Ai định nghĩa tool** | Dev hardcode trong app | MCP Server expose, Client discover |
| **Vendor lock-in** | Mỗi provider 1 format khác | Provider-agnostic |
| **Reusability** | Tool gắn chặt với app | MCP Server dùng lại cho nhiều app |
| **Khi nào dùng** | MVP, prototype nhanh | Production, nhiều tool, nhiều app |

```
Function Calling:           MCP:
App ←→ LLM                 App (Host) ←→ Client ←→ Server ←→ Tool
(tool nằm trong app)       (tool tách riêng, chuẩn hóa)
```

> [!note] 📝 So sánh dễ hiểu
> **Function Calling** giống bạn tự nấu ăn ở nhà — bạn biết có nguyên liệu gì, nấu món gì, tự làm hết.
> **MCP** giống đặt qua app delivery — bạn chỉ cần biết "quán nào có món gì" (discover), gọi món (invoke), nhận đồ (result). Quán (Server) phục vụ nhiều khách (Client) cùng chuẩn.

---
## 🔌 Transport — Cách Client nói chuyện với Server
MCP dùng **JSON-RPC 2.0** để giao tiếp, qua 2 loại transport:

| Transport | Cách hoạt động | Khi nào dùng |
|-----------|---------------|-------------|
| **stdio** | Server chạy như child process, giao tiếp qua stdin/stdout | Local tools (CLI, file system) |
| **HTTP + SSE** | Server chạy remote, dùng HTTP POST + Server-Sent Events | Remote services, cloud tools |

---
## 🌍 Hệ sinh thái MCP (2026)
MCP đã được adopt rộng rãi:
- **Clients**: Claude Desktop, Cursor, VS Code (GitHub Copilot), Windsurf, Claude Code
- **Servers**: GitHub, Slack, Google Drive, PostgreSQL, Filesystem, và hàng nghìn community servers
- **SDK**: TypeScript SDK, Python SDK — dùng để build server/client

> [!warning] ⚠️
> MCP Server có quyền truy cập tool thật (DB, API, file system). **Chỉ cài MCP Server từ nguồn tin cậy** — một server độc hại có thể đọc file, xóa data, hoặc gọi API thay bạn.

---
## 🔑 Tóm lại — Khi nào cần MCP?
- **Không cần MCP**: app nhỏ, 1-2 tool, chỉ bạn dùng → Function Calling đủ rồi
- **Cần MCP**: nhiều tool, nhiều app cần share tool, team lớn, production system
- **MCP giỏi nhất**: biến tool thành "dịch vụ" — build 1 lần, dùng mọi nơi

---
## 📚 Tham khảo
- [Architecture overview - Model Context Protocol](https://modelcontextprotocol.io/docs/learn/architecture) — docs chính thức, giải thích kiến trúc Host/Client/Server
- [MCP vs Function Calling - Descope](https://www.descope.com/blog/post/mcp-vs-function-calling) — so sánh chi tiết MCP và Function Calling, khi nào dùng gì
- 🔥 [The 2026 MCP Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) — roadmap chính thức 2026: transport, agent communication, enterprise
- [MCP Architecture Deep Dive - Knit](https://www.getknit.dev/blog/mcp-architecture-deep-dive-tools-resources-and-prompts-explained) — deep dive vào Tools, Resources, Prompts
- [GitHub - modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol) — source code, spec, và community servers

---
## ✅ Checklist
- [ ] Hiểu MCP là gì — chuẩn kết nối LLM với tools/data
- [ ] Hiểu kiến trúc Host → Client → Server
- [ ] Phân biệt 3 primitives: Tools (LLM-controlled), Resources (app-controlled), Prompts (user-controlled)
- [ ] Hiểu MCP vs Function Calling — bổ sung, không thay thế
- [ ] Biết 2 transport: stdio (local) vs HTTP+SSE (remote)
- [ ] Biết hệ sinh thái MCP hiện tại (clients, servers, SDKs)
