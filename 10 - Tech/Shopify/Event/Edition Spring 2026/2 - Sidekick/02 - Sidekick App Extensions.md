# Sidekick App Extensions (Developer)

Đây là phần **quan trọng nhất** với Shopify app developer — cách build Sidekick app extensions để app của mình tích hợp vào Sidekick. File này viết KỸ vì liên quan trực tiếp đến công việc tại Joy Loyalty.

---

## Tổng quan

Sidekick app extensions cho phép app bên thứ 3 expose data và workflows vào Sidekick. Khi merchant hỏi Sidekick, nó có thể truy cập thông tin từ app và thực hiện thao tác.

> "When a merchant invokes an app extension, Shopify's platform powers the interaction. The app extension is executed in the Shopify sandbox, and has access to the same APIs as your app."

**Timeline:**
- **13/05/2026:** Early access program bắt đầu với 18 launch partners
- **17/06/2026:** General availability cho tất cả app developers + App Store requirements có hiệu lực
- **18/06/2026:** Smile.io launch Sidekick extension (xem phần Smile analysis bên dưới)

**Giới hạn:** tối đa **20 apps** cho mỗi user trên 1 store.

---

## 2 loại extension

### 1. Data Extensions (`admin.app.tools.data`)

Cho phép Sidekick **tìm kiếm và hiển thị** data từ app. Headless execution — không render UI.

- Merchant hỏi Sidekick, Sidekick gọi tool của app, trả về kết quả dạng resource links
- Click kết quả navigate thẳng đến trang tương ứng trong app
- **Chỉ read-only** — mutations thuộc về action extensions

### 2. Action Extensions

Có 2 sub-types:

**Admin Link** (`admin.app.intent.link`):
- Navigate merchant đến URL trong app
- Không yêu cầu API version cụ thể
- Hỗ trợ App Home và standalone apps

**UI Extension** (`admin.app.intent.render`):
- Render admin UI extension inline (trong modal)
- Yêu cầu **API version 2026-04** trở lên
- Focused UI — merchant không rời khỏi admin

Merchant luôn giữ quyền kiểm soát — Sidekick gợi ý thay đổi nhưng không tự động commit.

---

## Requirements

- App dùng Shopify scaffolding tools (`shopify app scaffold`)
- Latest **App Bridge** version (cho App Home)
- Authentication: **Shopify managed install + token exchange** (không dùng legacy OAuth)
- Thêm `extensions_summary` vào `shopify.app.toml` (bắt buộc)
- **Shopify CLI 3.90.0** trở lên (cho data extensions)
- CORS allowlist phải bao gồm `https://extensions.shopifycdn.com`

## Performance limits

| Metric | Limit |
|--------|-------|
| Extension description | 256 tokens |
| Extensions summary | 256 tokens |
| Instructions | 2,048 tokens |
| Intents per app | 5 |
| Query string | 500 characters |
| Response size | 4,000 tokens |
| App data response time | 1 second |
| App actions response time | 3 seconds |
| Tool name | 64 characters |
| Tool description | 512 characters |
| Tools per app | 20 total (shared across data + action extensions) |

---

## Configuration: `extensions_summary`

Thêm vào `shopify.app.toml` dưới `[sidekick]`:

```toml
[sidekick]
extensions_summary = "Search, Create, and Edit Email and SMS campaigns"
```

- **Bắt buộc** — bỏ qua sẽ bị validation error khi deploy
- Giới hạn **256 tokens**
- Mô tả cụ thể actions và domain/entity types
- Sidekick dùng summary này để route merchant questions đến đúng app

## Extension `description`

Trong `shopify.extension.toml`, field `description` giúp Sidekick xác định khi nào nên gọi extension:

- Giới hạn **256 tokens**
- Phải cụ thể về domain (email campaigns, product reviews, loyalty program...)
- Tránh generic như "Search extension for your app" hoặc "Tools for your app"

**Ví dụ tốt:** "Search and view email campaign performance metrics"
**Ví dụ xấu:** "General tools for managing things in your app"

## Instructions file (`instructions.md`)

Optional nhưng **recommended** — giúp Sidekick hiểu cách dùng tools của app:

- Giới hạn **2,048 tokens**
- Mô tả khi nào dùng tool nào, common workflows, important guidelines
- **Không được** chứa behavioral overrides (chỉ guidance)

Ví dụ:

```md
## When to Use Loyalty Tools

Use these tools when the merchant asks about:
- Loyalty program performance and ROI
- Points activity and redemption rates
- Member vs non-member comparisons
- Referral revenue and conversion

## Important Guidelines

- Always specify date range when returning metrics
- Include currency context in financial data
- Note when program components are inactive
```

---

## Build Data Extension

### 1. Generate extension

```bash
shopify app generate extension --template app_data --name search-campaigns
```

### 2. Cấu trúc thư mục

```
extensions/search-campaigns/
  ├── shopify.extension.toml
  ├── src/index.js
  ├── tools.json
  ├── instructions.md
  ├── package.json
  ├── tsconfig.json (optional)
  └── shopify.d.ts
```

### 3. Configure `shopify.extension.toml`

```toml
[[extensions]]
name = "Search campaigns"
description = "Search and view email campaign performance metrics"
handle = "search-campaigns"
type = "ui_extension"

[[extensions.targeting]]
module = "./src/index.js"
target = "admin.app.tools.data"
tools = "./tools.json"
instructions = "./instructions.md"
```

**Lưu ý:**
- Target `admin.app.tools.data` là headless, không tie vào Shopify resources
- `description` bắt buộc, phải cụ thể về domain và tasks
- `instructions` optional nhưng recommended

### 4. Implement tool handler (`src/index.js`)

```js
export default () => {
  shopify.tools.register('get_campaigns', async ({name, date}) => {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({name, date})
    });
    return response.json();
  });

  shopify.tools.register('campaign_stats', async ({campaign_id}) => {
    const response = await fetch(`/api/campaigns/${campaign_id}/stats`);
    return response.json();
  });
}
```

**Execution context:**
- Chạy **client-side** trong Shopify's sandboxed browser environment
- Tự động invoked khi extension được gọi
- Có access đến Direct API (GraphQL) và App Authentication
- Response phải là **JSON only**
- Response phải dưới **1 second** và **4,000 tokens** — vượt quá sẽ bị reject hoặc skip

### 5. Define `tools.json`

```json
[
  {
    "$schema": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/tool.json",
    "name": "get_campaigns",
    "description": "Search email marketing campaigns by name, status, or date range",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Perform a full text search"
        },
        "marketingActivityStatuses": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["ACTIVE", "CANCELLED", "DELETED", "DRAFT", "FAILED",
                     "INACTIVE", "PAUSED", "PENDING", "SCHEDULED"]
          }
        },
        "sortKey": {
          "type": "string",
          "enum": ["CREATED_AT", "EDITED_AT", "EFFECTIVE_STATUS_DATE",
                   "STATUS_UPDATED_AT", "SUBJECT", "UPDATED_AT"]
        },
        "sortOrder": {
          "type": "string",
          "enum": ["ASC", "DESC"]
        }
      }
    }
  }
]
```

**Schema limits:**
- Tool `name`: max 64 characters
- Tool `description`: max 512 characters
- Max 20 tools per app (shared across data + action)
- Tool schemas **cho phép** `required` fields (khác với intent schemas)

### 6. Output format: Resource Links

Dùng **Model Context Protocol's Resource Links** format để kết nối data extension với action extensions:

```json
{
  "results": [
    {
      "type": "resource_link",
      "uri": "gid://application/email/123",
      "name": "Summer Sale Campaign",
      "mimeType": "application/email",
      "_meta": {
        "status": "ACTIVE",
        "editedAt": "2025-01-27T10:00:00Z",
        "openRate": 0.42
      }
    }
  ]
}
```

| Field | Required | Mục đích |
|-------|----------|----------|
| `type` | Có | Phải là `"resource_link"` |
| `uri` | Có | Stable identifier (VD: `gid://application/email/123`) — required cho GID substitution |
| `name` | Có | Human-readable label |
| `mimeType` | Có | Phải khớp với action extension's `type` (VD: `application/email`) |
| `_meta` | Không | Summary data cho model reasoning — chỉ essential fields (status, dates, key metrics) |

**Best practices cho `_meta`:**
- Giữ concise, chỉ essential fields
- Dùng `uri` cho complete resource details
- Match `mimeType` với intent `type` configuration để link data -> action
- Dùng stable URIs persist across sessions

### Alternative: Embedded App Links

```json
{
  "results": [
    {
      "url": "app://email/123"
    }
  ]
}
```

Sidekick resolve `app://` URLs dựa trên embedded app's base URL.

### 7. Authentication

**Client-side (sandbox context):**
- Shopify tự động attach `Authorization` header cho requests đến app's configured auth domain (và subdomains)
- Với external domains: gọi `auth.idToken()` và attach bearer token thủ công

**Server-side (React Router template):**
```js
const {cors} = await authenticate.admin(request);
return cors(json({...}));
```

- Gọi `authenticate.admin(request)` để validate session tokens
- Cross-origin requests từ sandbox cần CORS helper
- Token exchange thay thế legacy OAuth flow

**CORS config:** thêm `https://extensions.shopifycdn.com` vào allowlist.

---

## Build Action Extension (Admin Link)

### 1. Generate extension

```bash
shopify app generate extension --template app_action_link --name open-email
```

### 2. Cấu trúc thư mục

```
extensions/open-email/
  ├── shopify.extension.toml
  ├── email-schema.json
  ├── tools.json
  ├── instructions.md
  └── README.md
```

### 3. Configure `shopify.extension.toml`

```toml
[[extensions]]
name = "Open email"
description = "Edit an email campaign"
handle = "open-email"
type = "admin_link"

[[extensions.targeting]]
target = "admin.app.intent.link"
url = "/edit/{id}"
tools = "./tools.json"
instructions = "./instructions.md"

[[extensions.targeting.intents]]
type = "application/email"
action = "edit"
schema = "./email-schema.json"
```

- `url` có thể chứa `{placeholder}` — được thay thế khi invocation
- Placeholder cần trường tương ứng trong schema với `mapTo: "param"`

### 4. Intent schema (`email-schema.json`)

```json
{
  "$schema": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/intent.json",
  "value": {
    "type": "string",
    "description": "The GID of the email campaign to edit.",
    "mapTo": "param",
    "fieldName": "id"
  },
  "inputSchema": {
    "$ref": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/application/email.json",
    "type": "object",
    "properties": {
      "recipient": {
        "type": "string",
        "description": "Primary recipient email address",
        "format": "email"
      },
      "subject": {
        "type": "string",
        "description": "Email subject line",
        "minLength": 1,
        "maxLength": 200
      },
      "body": {
        "type": "string",
        "description": "Email message body"
      }
    }
  }
}
```

**Schema rules:**
- `inputSchema` bắt buộc, phải reference schema matching `type`
- **Không có `required` fields** — tất cả treated as optional (cả top level và nested)
- Phải giữ `$ref` cùng với `type` và `properties` (hợp lệ trong JSON Schema 2020-12)
- Declaring unsupported `type` (VD: `application/my-resource`) sẽ bị reject khi deploy: `Intent is invalid: type '<value>' is not supported`

### 5. Tools (`tools.json`)

```json
[
  {
    "$schema": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/tool.json",
    "name": "design_email",
    "description": "Update the visual design of the currently open email campaign, including background color, layout, and styling",
    "inputSchema": {
      "type": "object",
      "properties": {
        "background_color": {
          "type": "string",
          "description": "Background color for the email body (hex code, e.g. #FFFFFF)"
        },
        "layout": {
          "type": "string",
          "enum": ["single-column", "two-column", "hero-image"]
        }
      }
    }
  }
]
```

- Tools execute **sau khi** page mở, không phải trước — "tools declared in this tools.json execute while the intent's destination page is open"
- Ít nhất 1 tool per intent — "Sidekick only supports invoking intents that have tools"
- Mỗi tool phải register tại runtime qua `shopify.tools.register`
- **Không duplicate** intent's action trong tool — tool bổ sung chức năng, không lặp lại

### 6. Bind tool handlers tại runtime

```jsx
import {useEffect} from 'react';
import {useParams} from 'react-router';

export default function CampaignEditor() {
  const {id: campaignId} = useParams();

  useEffect(() => {
    const cleanup = shopify.tools.register('design_email', async (input) => {
      const response = await fetch(`/api/campaigns/${campaignId}/design`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      return response.json();
    });
    return () => cleanup();
  }, [campaignId]);

  // ...render campaign editor UI
}
```

**Lifecycle:**
- Handler chạy khi page mount
- Re-register khi dependencies thay đổi
- Gọi cleanup function khi component unmount
- `shopify.tools.register` trả về cleanup function

### 7. Đọc intent payload

**Synchronous access:**
```js
const request = shopify.intents.request?.value;
if (request) {
  // request.action: 'create' hoặc 'edit'
  // request.type: match type trong shopify.extension.toml
  // request.data: fields từ inputSchema.properties
  // request.value: primary resource identifier (GID)
  hydrateForm(request);
}
```

**Subscribe to updates:**
```js
if (shopify.intents.request) {
  shopify.intents.request.subscribe(callback);
}
```

**Query parameter access:** payload cũng được append dạng `?intent=<URL-encoded JSON>` query parameter — truy cập đồng bộ trước khi App Bridge load.

### 8. Resolve intent

```js
// Thành công — pass any data invoker needs
await shopify.intents.response.ok({campaignId: 'gid://shopify/EmailCampaign/123'});

// Lỗi — trả về error message
await shopify.intents.response.error('Could not save the campaign.');

// Merchant huỷ
await shopify.intents.response.closed();
```

---

## Build Action Extension (UI Extension)

Tương tự Admin Link nhưng render inline (trong modal) thay vì navigate:

```bash
shopify app generate extension --template app_action --name open-email
```

### Config khác biệt

```toml
api_version = "2026-04"

[[extensions]]
name = "Open email"
description = "Edit an email campaign"
handle = "open-email"
type = "ui_extension"

[[extensions.targeting]]
module = "./src/IntentExtension.jsx"
target = "admin.app.intent.render"
tools = "./tools.json"
instructions = "./instructions.md"

[[extensions.targeting.intents]]
type = "application/email"
action = "edit"
schema = "./intent-schema.json"
```

- `api_version = "2026-04"` bắt buộc
- `type = "ui_extension"` thay vì `admin_link`
- `target = "admin.app.intent.render"` thay vì `admin.app.intent.link`
- Dùng `module` thay vì `url`

### UI Extension component example

```jsx
import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

export default async () => {
  render(<OpenEmail />, document.body);
};

function OpenEmail() {
  const {intents} = shopify;
  const {data} = intents.request.value || {};
  const [subject, setSubject] = useState(data?.subject ?? '');
  const [body, setBody] = useState(data?.body ?? '');
  const [submitting, setSubmitting] = useState(false);

  const submit = (event) => {
    setSubmitting(true);
    intents.response.ok({subject, body});
  };

  return (
    <s-form onSubmit={submit}>
      <s-stack direction="block" gap="base">
        <s-text-field
          label="Subject"
          value={subject}
          onChange={(event) => setSubject(event.currentTarget.value)}
        />
        <s-text-area
          label="Body"
          value={body}
          onChange={(event) => setBody(event.currentTarget.value)}
        />
        <s-button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save email'}
        </s-button>
      </s-stack>
    </s-form>
  );
}
```

**Lưu ý UI Extension:**
- "Don't make the callback itself async and don't await shopify.intents.response.ok" — host callbacks không await returned promises
- Nếu cần async work, dùng `event.waitUntil(promise)`

### Navigation constraint quan trọng

> "An intent is bound to exactly one pathname: the url declared on your extension's admin.app.intent.link target."

- Navigation thay đổi pathname sẽ **đóng modal** (silent, không error)
- Query string updates **không** đóng modal
- Hash fragment updates **không** đóng modal
- Dùng query parameters hoặc component state để xử lý nhiều UI states

```jsx
export async function loader({ request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  return {
    id,
    customer: id ? await fetchCustomer(id) : null,
  };
}

export default function Customers() {
  const { id, customer } = useLoaderData();
  return id ? <CustomerForm customer={customer} /> : <CustomerList />;
}
```

---

## URL Parameter Mapping (mapTo)

| Value | Effect | Ví dụ |
|-------|--------|-------|
| `param` | Thay vào `{placeholder}` trong URL path | `/app/campaigns/{id}` -> `/app/campaigns/123` |
| `query_param` | Append vào query string | `/app/campaigns?status=draft` |
| `form_data` | Gửi trong request body (default cho inputSchema properties) | |
| `hash` | Append vào URL hash | `/app/campaigns#edit` |

**fieldName usage:**
- Maps schema property key đến destination parameter name
- Required trên top-level `value` khi dùng `mapTo: "param"` hoặc `"query_param"`
- Optional trên `inputSchema` properties khi key đã match placeholder name

```json
"reviewId": {
  "type": "string",
  "mapTo": "param",
  "fieldName": "id"
}
```
Với `url = "/app/reviews/{id}/edit"` -> `/app/reviews/<reviewId>/edit`

**GID handling:** khi value mapped to `param` là GID (bắt đầu bằng `gid://`), Sidekick extract bare tail identifier sau `/` cuối cùng. VD: `gid://shopify/EmailCampaign/123` -> `123`. Route reads bare identifier từ path params (`useParams()`), không phải full GID.

## matchValue cho Intent Disambiguation

Khi nhiều intents cùng `type:action` pair, dùng `matchValue` để phân biệt:

```json
// edit-sms-campaign/schema.json
"inputSchema": {
  "$ref": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/application/campaign.json",
  "type": "object",
  "properties": {
    "channel": {
      "type": "string",
      "matchValue": "sms"
    }
  }
}
```

Invoke trực tiếp: `intents.invoke("edit:application/campaign", { data: { channel: "sms" } })`

---

## Supported Intent Types

### Application intents (app-specific):

| Type | Description | Actions | Schema Reference |
|------|-------------|---------|------------------|
| `application/ad` | Ad campaigns | create, edit | `.../application/ad.json` |
| `application/campaign` | Marketing campaigns | create, edit | `.../application/campaign.json` |
| `application/email` | Email campaigns | create, edit | `.../application/email.json` |
| `application/faq` | FAQ management | create, edit | `.../application/faq.json` |
| `application/loyalty-program` | Loyalty programs | create, edit | `.../application/loyalty-program.json` |
| `application/return` | Returns management | create, edit | `.../application/return.json` |
| `application/review` | Product reviews | create, edit | `.../application/review.json` |
| `application/shipment` | Shipment tracking | create, edit | `.../application/shipment.json` |
| `application/ticket` | Support tickets | create, edit | `.../application/ticket.json` |

Schema base URL: `https://extensions.shopifycdn.com/shopifycloud/schemas/v1/`

### Shopify resource intents (import):

| Type | Actions | Schema |
|------|---------|--------|
| `shopify/customer` | import, import+bulk | `shopify-intent.json` / `shopify-intent-bulk.json` |
| `shopify/order` | import, import+bulk | `shopify-intent.json` / `shopify-intent-bulk.json` |
| `shopify/product` | import, import+bulk | `shopify-intent.json` / `shopify-intent-bulk.json` |

**Phân biệt:**
- `application/*`: app owns data shape
- `shopify/*`: tạo/import Shopify-native resources
- Single imports (`import`): trả về `id` trong `outputSchema`, dùng meta-schema `shopify-intent.json`
- Bulk imports (`import+bulk`): trả về `ids` array, dùng meta-schema `shopify-intent-bulk.json`

---

## Content & Safety Policy

### Kiểm tra tại 2 thời điểm:
1. **At deployment:** extension descriptions, tool descriptions, instructions, input schemas
2. **At runtime:** response data trước khi đưa vào conversation

### Approved practices:
- Mô tả rõ ràng, factual
- Return structured data match tool purpose
- Data extensions chỉ **read-only**; mutations thuộc về action extensions

### Prohibited practices:
- Override Sidekick's decision-making hoặc bypass merchant confirmation
- Dùng extensions để bán hàng (upsells, plan nudges, false urgency)
- Thêm promotional content không liên quan
- Embed credentials hoặc unrequested customer data

## App Store requirements (hiệu lực 17/06/2026)

**Requirement 2.2.8 — Functional Alignment:** "Sidekick app extensions must operate within the scope of your app's core functionality." Config, App Store listing, và behavior phải nhất quán — "materially consistent."

Developer phải audit 3 thứ:
1. Extension TOML configuration
2. Runtime behavior within Sidekick
3. Public App Store listing descriptions

**Requirement 2.2.9 — No Promotions:** "Don't use Sidekick app extensions to promote your app, promote related apps, or request reviews." Không promotional content, advertisements, cross-sell.

---

## Common Schema Mistakes

1. **Unmapped URL Placeholders:** "If your url contains a placeholder such as {id}, then something in the schema must map to it."
2. **Removing `$ref` from `inputSchema`:** Error: `Intent is invalid: a $ref for the inputSchema matching the intent type must be present`
3. **Adding `required` to Intent Schema:** Error: `Intent is invalid: inputSchema must not have required fields`. Chỉ apply cho intent schemas; tool schemas cho phép `required`.
4. **Wrong Meta-schema cho Shopify Intents:** `import` yêu cầu `shopify-intent.json`; `import+bulk` yêu cầu `shopify-intent-bulk.json`
5. **Missing GID `$ref` trong outputSchema:** Required cho Shopify resource intents
6. **Dùng `application/*` với shopify-intent schemas:** Type mismatch sẽ bị deploy error

---

## Testing & Development

- Chạy `shopify app dev` để start local dev server
- Install app trên dev store, truy cập Sidekick qua admin — **mở dev store trực tiếp trong browser** (CLI's `p` shortcut không hỗ trợ cho Sidekick extensions)
- **Sidekick Events** hiện trong Dev Dashboard — status `OK` hoặc `Error`, scan target (`extensions/security_scan`), timestamp
- Hot reload tự động rerun scans sau khi fix — không cần restart
- Browser dev console hiện execution logs và errors
- Client-side logs/errors hiện trong browser developer console

## End-to-end workflow

1. Data extension's tool trả về resource links với matching `mimeType`
2. Sidekick hiện kết quả, user chọn 1
3. Sidekick invoke intent với resource's `uri` làm `value`
4. App navigate đến `url` với substituted parameter (GID -> bare tail)
5. Component mount và register tool handlers
6. Merchant yêu cầu tool action qua Sidekick
7. Handler execute và trả về result
8. Merchant confirm/save (Sidekick không auto-commit)
9. Extension gọi `shopify.intents.response.ok()` để resolve

---

## Phân tích đối thủ: Smile.io đã tích hợp Sidekick

### Smile's Sidekick App Extension

**Launch date:** 18/06/2026 (1 ngày sau GA)

Smile là một trong 18 launch partners tham gia early access program. Extension của họ là **data extension** (read-only), cho phép merchant query loyalty data qua Sidekick.

### 5 lĩnh vực data Smile expose:

| Lĩnh vực | Ví dụ câu hỏi merchant có thể hỏi |
|----------|-----------------------------------|
| **Business Growth** | "What's my loyalty-driven revenue over the last 30 days?" |
| **Performance Benchmarks** | "What's my points redemption rate, and is it healthy?" |
| **Customer Segments** | "How do my members compare to non-members on customer lifetime value?" |
| **Points Activity** | Monthly points engagement metrics |
| **Referrals** | "What's my referral revenue this month?" |

### Data elements Smile trả về:
- Repeat purchase rate
- Member lifetime value (LTV)
- VIP status
- Point redemption rates
- Referral revenue
- Data freshness timestamps
- Contextual notes khi program components inactive

### Format response:
Sidekick trả về natural language, bao gồm merchant's currency, data freshness timestamps, và contextual notes.

---

## Cơ hội cho Joy Loyalty: Build Sidekick Extension

### Tại sao cần làm ngay

1. **Smile đã có mặt** — đối thủ trực tiếp đã launch, merchant đang quen hỏi Sidekick về loyalty data của Smile
2. **Intent type sẵn có:** `application/loyalty-program` là supported type — Shopify đã design sẵn cho loyalty apps
3. **18 launch partners** đã có — càng chậm càng mất competitive advantage
4. **GA đã mở** từ 17/06/2026 — bất kỳ app developer nào đều có thể build

### Loyalty Program Schema (từ Shopify CDN)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/application/loyalty-program.json",
  "title": "Loyalty Program Schema",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "The loyalty program ID"
    }
  },
  "additionalProperties": true
}
```

Schema đơn giản, `additionalProperties: true` — cho phép app tự định nghĩa thêm properties tuỳ ý.

### Kế hoạch build (gợi ý)

**Phase 1: Data Extension (nhanh nhất, bắt kịp Smile)**

`extensions_summary` gợi ý:

```toml
[sidekick]
extensions_summary = "Search loyalty program performance, member segments, points activity, referral metrics, and VIP tier data"
```

Tools gợi ý:

| Tool | Mục đích | Response time target |
|------|----------|---------------------|
| `get_loyalty_overview` | Tổng quan: revenue, members, redemption rate | < 1s |
| `get_member_segments` | So sánh member vs non-member (AOV, LTV, purchase frequency) | < 1s |
| `get_points_activity` | Points earned/redeemed/expired theo thời gian | < 1s |
| `get_referral_stats` | Referral revenue, conversion rate | < 1s |
| `get_vip_tiers` | VIP tier distribution, tier-specific metrics | < 1s |
| `get_reward_performance` | Reward catalog performance, popular rewards | < 1s |

**Lợi thế hơn Smile có thể khai thác:**
- Joy có VIP tiers chi tiết hơn -> expose tier distribution, tier-specific AOV
- Joy có reward catalog đa dạng hơn -> expose reward performance metrics
- Joy hỗ trợ nhiều loại earning rules -> expose earning breakdown

**Phase 2: Action Extension (tạo lợi thế)**

Dùng `application/loyalty-program` intent type với actions `create` và `edit`:

```toml
[[extensions.targeting.intents]]
type = "application/loyalty-program"
action = "edit"
schema = "./loyalty-schema.json"
```

Merchant có thể nhờ Sidekick: "Edit my loyalty program to add a new VIP tier" -> Sidekick navigate đến Joy app với context.

**Lưu ý:** Smile hiện tại chỉ có data extension (read-only). Nếu Joy launch cả action extension, đó là competitive advantage rõ ràng.

---

## Các app đã hỗ trợ Sidekick extensions (18 launch partners)

| Category | Apps |
|---|---|
| Marketing | Klaviyo, TikTok, Seguno, Mailchimp, Checkout Links, Bloomreach |
| Customers | Loop Returns, AfterShip Returns, Judge.me, **Smile**, Yotpo |
| Promotions | Abra Promotions, Discount Kit, Kitenzo Bundle Builder |
| Products | Printful, Syncee Dropshipping |
| Store Operations | Matrixify, Avia POS Traffic Counter |

**Lưu ý:** Joy Loyalty chưa có trong danh sách này.

---

## Nguồn

- [Sidekick app extensions - shopify.dev](https://shopify.dev/docs/apps/build/sidekick)
- [Build app data extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-data)
- [Build app action extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-actions)
- [App Store requirements changelog](https://shopify.dev/changelog/sidekick-app-extensions-app-store-requirements)
- [Sidekick app extensions available today](https://shopify.dev/changelog/sidekick-app-extensions-available-today)
- [Introducing Sidekick app extensions - changelog](https://shopify.dev/changelog/introducing-sidekick-app-extensions)
- [Apps that work with Sidekick - App Store guide](https://apps.shopify.com/stories/guide-sidekick-app-extensions)
- [Smile launches Sidekick App Extension](https://blog.smile.io/loyalty-data-on-demand-smile-launches-its-sidekick-app-extension-for-shopify/)
- [Loyalty Program Schema](https://extensions.shopifycdn.com/shopifycloud/schemas/v1/application/loyalty-program.json)
