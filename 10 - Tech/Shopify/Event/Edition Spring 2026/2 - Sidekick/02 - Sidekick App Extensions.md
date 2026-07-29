# Sidekick App Extensions (Developer)

Day la phan **quan trong nhat** voi Shopify app developer -- cach build Sidekick app extensions de app cua minh tich hop vao Sidekick.

---

## Tong quan

Sidekick app extensions cho phep app ben thu 3 expose data va workflows vao Sidekick. Khi merchant hoi Sidekick, no co the truy cap thong tin tu app va thuc hien thao tac.

> "When a merchant invokes an app extension, Shopify's platform powers the interaction. The app extension is executed in the Shopify sandbox, and has access to the same APIs as your app."

**Gioi han:** toi da **20 apps** cho moi user tren 1 store.

## 2 loai extension

### 1. Data Extensions (`admin.app.tools.data`)

Cho phep Sidekick **tim kiem va hien thi** data tu app. Headless execution -- khong render UI.

- Merchant hoi Sidekick, Sidekick goi tool cua app, tra ve ket qua dang resource links
- Click ket qua navigate thang den trang tuong ung trong app

### 2. Action Extensions (`admin.app.intent.link` hoac `admin.app.intent.render`)

Cho phep Sidekick **thuc hien hanh dong** trong app -- edit email template, tao product review, update support issue...

- **Admin Link** (`admin.app.intent.link`): navigate merchant den URL trong app. Khong yeu cau API version cu the.
- **UI Extension** (`admin.app.intent.render`): render admin UI extension inline. Yeu cau **API version 2026-04** tro len.

Merchant luon giu quyen kiem soat -- Sidekick goi y thay doi nhung khong tu dong commit.

---

## Requirements

- App dung Shopify scaffolding tools
- Latest **App Bridge** version (cho App Home)
- Authentication: **Shopify managed install + token exchange** (khong dung legacy OAuth)
- Them `extensions_summary` vao `shopify.app.toml`
- **Shopify CLI 3.90.0** tro len (cho data extensions)
- CORS allowlist phai bao gom `https://extensions.shopifycdn.com`

## Performance limits

| Metric | Limit |
|--------|-------|
| Query string | 500 characters |
| Response size | 4,000 tokens |
| App data response time | 1 second |
| App actions response time | 3 seconds |
| Tools per app | 20 total |
| Intents per app | 5 |
| Instructions | 2,048 tokens |

## Configuration: `extensions_summary`

Them vao `shopify.app.toml` duoi `[sidekick]`:

```toml
[sidekick]
extensions_summary = "Search, Create, and Edit Email and SMS campaigns"
```

- **Bat buoc** -- bo qua se bi validation error
- Gioi han **256 tokens**
- Mo ta cu the actions va domain/entity types

## Extension `description`

Trong `shopify.extension.toml`, field `description` giup Sidekick xac dinh khi nao nen goi extension:

- Gioi han **256 tokens**
- Phai cu the ve domain (email campaigns, product reviews...)
- Tranh generic nhu "Search extension for your app"

## Tool specifications

- **Name:** toi da 64 characters
- **Description:** toi da 512 characters
- Phai ghi ro purpose va expected input types

---

## Build Data Extension

### 1. Generate extension

```bash
shopify app generate extension --template app_data --name search-campaigns
```

### 2. Cau truc thu muc

```
extensions/search-campaigns/
  ├── shopify.extension.toml
  ├── src/index.js
  ├── tools.json
  ├── instructions.md
  └── package.json
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

### 4. Implement tool handler (`src/index.js`)

```js
export default () => {
  shopify.tools.register('get_campaigns', async (params) => {
    const response = await fetch('/api/campaigns?' + new URLSearchParams(params));
    return response.json();
  });
}
```

**Luu y:**
- Response phai duoi **1 second** va **4,000 tokens**
- Vuot qua se bi reject hoac skip

### 5. Output format: Resource Links

Dung **Model Context Protocol's Resource Links** format:

```json
{
  "results": [
    {
      "type": "resource_link",
      "uri": "gid://application/email/123",
      "name": "Summer Sale Campaign",
      "mimeType": "application/email",
      "_meta": {
        "status": "sent",
        "openRate": "24.5%"
      }
    }
  ]
}
```

| Field | Required | Muc dich |
|-------|----------|----------|
| `type` | Co | Phai la `"resource_link"` |
| `uri` | Co | Stable identifier (VD: `gid://application/email/123`) |
| `name` | Co | Human-readable label |
| `mimeType` | Co | Phai khop voi action extension's `type` |
| `_meta` | Khong | Summary data cho model reasoning -- chi essential fields |

### 6. Authentication

- Tools chay **client-side** trong sandboxed browser environment
- Shopify tu dong attach authorization headers cho requests den app's auth domain
- Voi external domains: goi `auth.idToken()` va attach bearer token thu cong
- Server-side: dung `authenticate.admin(request)` + `cors` helper

---

## Build Action Extension (Admin Link)

### 1. Generate extension

```bash
shopify app generate extension --template app_action_link --name open-email
```

### 2. Cau truc thu muc

```
extensions/open-email/
  ├── email-schema.json
  ├── instructions.md
  ├── shopify.extension.toml
  ├── tools.json
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

- `url` co the chua `{placeholder}` -- duoc thay the khi invocation
- Placeholder can truong tuong ung trong schema voi `mapTo: "param"`

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
- `inputSchema` bat buoc, phai match declared `type`
- **Khong co `required` fields** -- tat ca treated as optional
- Phai giu `$ref` cung voi `type` va `properties` (hop le trong JSON Schema 2020-12)

### 5. Tools (`tools.json`)

```json
[
  {
    "$schema": "https://extensions.shopifycdn.com/shopifycloud/schemas/v1/tool.json",
    "name": "design_email",
    "description": "Update the visual design of the email",
    "inputSchema": {
      "type": "object",
      "properties": {
        "background_color": {
          "type": "string",
          "description": "Background color in hex"
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

- Tools execute **sau khi** page mo, khong phai truoc
- It nhat 1 tool per intent
- Moi tool phai register tai runtime qua `shopify.tools.register`

### 6. Bind tool handlers tai runtime

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
}
```

### 7. Doc intent payload

```js
const request = shopify.intents.request?.value;
if (request) {
  // request.action: 'create' hoac 'edit'
  // request.type: match type trong shopify.extension.toml
  // request.data: fields tu inputSchema.properties
  hydrateForm(request);
}
```

Hoac subscribe:
```js
shopify.intents.request.subscribe(callback);
```

### 8. Resolve intent

```js
// Thanh cong
await shopify.intents.response.ok({campaignId: 'gid://shopify/EmailCampaign/123'});

// Loi
await shopify.intents.response.error('Could not save the campaign.');

// Merchant huy
await shopify.intents.response.closed();
```

---

## Build Action Extension (UI Extension)

Tuong tu Admin Link nhung render inline thay vi navigate:

```bash
shopify app generate extension --template app_action --name open-email
```

Config khac biet:
- `api_version = "2026-04"` (bat buoc)
- `type = "ui_extension"`
- `target = "admin.app.intent.render"`
- Dung `module` thay vi `url`

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

**Navigation constraint quan trong:** intent bind vao **dung 1 pathname**. Navigation thay doi pathname se dong modal. Dung query parameters hoac component state de xu ly nhieu UI states.

---

## URL Parameter Mapping (mapTo)

| Value | Effect | Vi du |
|-------|--------|-------|
| `param` | Thay vao `{placeholder}` trong URL path | `/app/campaigns/{id}` -> `/app/campaigns/4353532` |
| `query_param` | Append vao query string | `/app/campaigns?status=draft` |
| `form_data` | Gui trong request body (default cho inputSchema properties) | |
| `hash` | Append vao URL hash | `/app/campaigns#edit` |

**GID handling:** khi value mapped to `param` la GID (bat dau bang `gid://`), Sidekick extract bare tail identifier sau `/` cuoi cung. VD: `gid://shopify/EmailCampaign/123` -> `123`.

## Supported Intent Types

### Application intents (app-specific):

| Type | Description | Actions |
|------|-------------|---------|
| `application/ad` | Ad campaigns | create, edit |
| `application/campaign` | Marketing campaigns | create, edit |
| `application/email` | Email campaigns | create, edit |
| `application/faq` | FAQ management | create, edit |
| `application/loyalty-program` | Loyalty programs | create, edit |
| `application/return` | Returns management | create, edit |
| `application/review` | Product reviews | create, edit |
| `application/shipment` | Shipment tracking | create, edit |
| `application/ticket` | Support tickets | create, edit |

### Shopify resource intents (import):

| Type | Actions |
|------|---------|
| `shopify/customer` | import, import+bulk |
| `shopify/order` | import, import+bulk |
| `shopify/product` | import, import+bulk |

---

## Content & Safety Policy

### Kiem tra tai 2 thoi diem:
1. **At deployment:** extension descriptions, tool descriptions, instructions, input schemas
2. **At runtime:** response data truoc khi dua vao conversation

### Approved practices:
- Mo ta ro rang, factual
- Return structured data match tool purpose
- Data extensions chi **read-only**; mutations thuoc ve action extensions

### Prohibited practices:
- Override Sidekick's decision-making hoac bypass merchant confirmation
- Dung extensions de ban hang (upsells, plan nudges, false urgency)
- Them promotional content khong lien quan
- Embed credentials hoac unrequested customer data

## App Store requirements (hieu luc 17/06/2026)

**Requirement 2.2.8 -- Functional Alignment:** "Sidekick app extensions must operate within the scope of your app's core functionality." Config, App Store listing, va behavior phai nhat quan.

**Requirement 2.2.9 -- No Promotions:** "Don't use Sidekick app extensions to promote your app, promote related apps, or request reviews."

---

## Testing & Development

- Chay `shopify app dev` de start local dev server
- Install app tren dev store, truy cap Sidekick qua admin preview link
- **Sidekick Events** hien trong app's logs tai Dev Dashboard -- status `OK` hoac `Error`
- Hot reload tu dong rerun scans sau khi fix
- Browser dev console hien execution logs va errors
- **Luu y:** CLI's `p` shortcut khong ho tro cho Sidekick extensions -- mo dev store truc tiep trong browser

## End-to-end workflow

1. Data extension's tool tra ve resource links voi matching `mimeType`
2. Sidekick hien ket qua, user chon 1
3. Sidekick invoke intent voi resource's `uri` lam `value`
4. App navigate den `url` voi substituted parameter
5. Component mount va register tool handlers
6. Merchant yeu cau tool action qua Sidekick
7. Handler execute va tra ve result
8. Merchant confirm/save (Sidekick khong auto-commit)
9. Extension goi `shopify.intents.response.ok()` de resolve

---

## Cac app da ho tro Sidekick extensions

| Category | Apps |
|---|---|
| Marketing | Klaviyo, TikTok, Seguno, Mailchimp, Checkout Links, Bloomreach |
| Customers | Loop Returns, AfterShip Returns, Judge.me, Smile, Yotpo |
| Promotions | Abra Promotions, Discount Kit, Kitenzo Bundle Builder |
| Products | Printful, Syncee Dropshipping |
| Store Operations | Matrixify, Avia POS Traffic Counter |

---

## Nguon

- [Sidekick app extensions - shopify.dev](https://shopify.dev/docs/apps/build/sidekick)
- [Build app data extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-data)
- [Build app action extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-actions)
- [App Store requirements changelog](https://shopify.dev/changelog/sidekick-app-extensions-app-store-requirements)
- [Sidekick app extensions - App Store guide](https://apps.shopify.com/stories/guide-sidekick-app-extensions)
- [Introducing Sidekick app extensions - changelog](https://shopify.dev/changelog/introducing-sidekick-app-extensions)
