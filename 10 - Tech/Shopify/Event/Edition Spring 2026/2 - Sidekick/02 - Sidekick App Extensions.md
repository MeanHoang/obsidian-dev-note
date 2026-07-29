# Sidekick App Extensions (Developer)

Day la phan **quan trong nhat** voi Shopify app developer -- cach build Sidekick app extensions de app cua minh tich hop vao Sidekick. File nay viet KY vi lien quan truc tiep den cong viec tai Joy Loyalty.

---

## Tong quan

Sidekick app extensions cho phep app ben thu 3 expose data va workflows vao Sidekick. Khi merchant hoi Sidekick, no co the truy cap thong tin tu app va thuc hien thao tac.

> "When a merchant invokes an app extension, Shopify's platform powers the interaction. The app extension is executed in the Shopify sandbox, and has access to the same APIs as your app."

**Timeline:**
- **13/05/2026:** Early access program bat dau voi 18 launch partners
- **17/06/2026:** General availability cho tat ca app developers + App Store requirements co hieu luc
- **18/06/2026:** Smile.io launch Sidekick extension (xem phan Smile analysis ben duoi)

**Gioi han:** toi da **20 apps** cho moi user tren 1 store.

---

## 2 loai extension

### 1. Data Extensions (`admin.app.tools.data`)

Cho phep Sidekick **tim kiem va hien thi** data tu app. Headless execution -- khong render UI.

- Merchant hoi Sidekick, Sidekick goi tool cua app, tra ve ket qua dang resource links
- Click ket qua navigate thang den trang tuong ung trong app
- **Chi read-only** -- mutations thuoc ve action extensions

### 2. Action Extensions

Co 2 sub-types:

**Admin Link** (`admin.app.intent.link`):
- Navigate merchant den URL trong app
- Khong yeu cau API version cu the
- Ho tro App Home va standalone apps

**UI Extension** (`admin.app.intent.render`):
- Render admin UI extension inline (trong modal)
- Yeu cau **API version 2026-04** tro len
- Focused UI -- merchant khong roi khoi admin

Merchant luon giu quyen kiem soat -- Sidekick goi y thay doi nhung khong tu dong commit.

---

## Requirements

- App dung Shopify scaffolding tools (`shopify app scaffold`)
- Latest **App Bridge** version (cho App Home)
- Authentication: **Shopify managed install + token exchange** (khong dung legacy OAuth)
- Them `extensions_summary` vao `shopify.app.toml` (bat buoc)
- **Shopify CLI 3.90.0** tro len (cho data extensions)
- CORS allowlist phai bao gom `https://extensions.shopifycdn.com`

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

Them vao `shopify.app.toml` duoi `[sidekick]`:

```toml
[sidekick]
extensions_summary = "Search, Create, and Edit Email and SMS campaigns"
```

- **Bat buoc** -- bo qua se bi validation error khi deploy
- Gioi han **256 tokens**
- Mo ta cu the actions va domain/entity types
- Sidekick dung summary nay de route merchant questions den dung app

## Extension `description`

Trong `shopify.extension.toml`, field `description` giup Sidekick xac dinh khi nao nen goi extension:

- Gioi han **256 tokens**
- Phai cu the ve domain (email campaigns, product reviews, loyalty program...)
- Tranh generic nhu "Search extension for your app" hoac "Tools for your app"

**Vi du tot:** "Search and view email campaign performance metrics"
**Vi du xau:** "General tools for managing things in your app"

## Instructions file (`instructions.md`)

Optional nhung **recommended** -- giup Sidekick hieu cach dung tools cua app:

- Gioi han **2,048 tokens**
- Mo ta khi nao dung tool nao, common workflows, important guidelines
- **Khong duoc** chua behavioral overrides (chi guidance)

Vi du:

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

### 2. Cau truc thu muc

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

**Luu y:**
- Target `admin.app.tools.data` la headless, khong tie vao Shopify resources
- `description` bat buoc, phai cu the ve domain va tasks
- `instructions` optional nhung recommended

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
- Chay **client-side** trong Shopify's sandboxed browser environment
- Tu dong invoked khi extension duoc goi
- Co access den Direct API (GraphQL) va App Authentication
- Response phai la **JSON only**
- Response phai duoi **1 second** va **4,000 tokens** -- vuot qua se bi reject hoac skip

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
- Tool schemas **cho phep** `required` fields (khac voi intent schemas)

### 6. Output format: Resource Links

Dung **Model Context Protocol's Resource Links** format de ket noi data extension voi action extensions:

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

| Field | Required | Muc dich |
|-------|----------|----------|
| `type` | Co | Phai la `"resource_link"` |
| `uri` | Co | Stable identifier (VD: `gid://application/email/123`) -- required cho GID substitution |
| `name` | Co | Human-readable label |
| `mimeType` | Co | Phai khop voi action extension's `type` (VD: `application/email`) |
| `_meta` | Khong | Summary data cho model reasoning -- chi essential fields (status, dates, key metrics) |

**Best practices cho `_meta`:**
- Giu concise, chi essential fields
- Dung `uri` cho complete resource details
- Match `mimeType` voi intent `type` configuration de link data -> action
- Dung stable URIs persist across sessions

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

Sidekick resolve `app://` URLs dua tren embedded app's base URL.

### 7. Authentication

**Client-side (sandbox context):**
- Shopify tu dong attach `Authorization` header cho requests den app's configured auth domain (va subdomains)
- Voi external domains: goi `auth.idToken()` va attach bearer token thu cong

**Server-side (React Router template):**
```js
const {cors} = await authenticate.admin(request);
return cors(json({...}));
```

- Goi `authenticate.admin(request)` de validate session tokens
- Cross-origin requests tu sandbox can CORS helper
- Token exchange thay the legacy OAuth flow

**CORS config:** them `https://extensions.shopifycdn.com` vao allowlist.

---

## Build Action Extension (Admin Link)

### 1. Generate extension

```bash
shopify app generate extension --template app_action_link --name open-email
```

### 2. Cau truc thu muc

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
- `inputSchema` bat buoc, phai reference schema matching `type`
- **Khong co `required` fields** -- tat ca treated as optional (ca top level va nested)
- Phai giu `$ref` cung voi `type` va `properties` (hop le trong JSON Schema 2020-12)
- Declaring unsupported `type` (VD: `application/my-resource`) se bi reject khi deploy: `Intent is invalid: type '<value>' is not supported`

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

- Tools execute **sau khi** page mo, khong phai truoc -- "tools declared in this tools.json execute while the intent's destination page is open"
- It nhat 1 tool per intent -- "Sidekick only supports invoking intents that have tools"
- Moi tool phai register tai runtime qua `shopify.tools.register`
- **Khong duplicate** intent's action trong tool -- tool bo sung chuc nang, khong lap lai

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

  // ...render campaign editor UI
}
```

**Lifecycle:**
- Handler chay khi page mount
- Re-register khi dependencies thay doi
- Goi cleanup function khi component unmount
- `shopify.tools.register` tra ve cleanup function

### 7. Doc intent payload

**Synchronous access:**
```js
const request = shopify.intents.request?.value;
if (request) {
  // request.action: 'create' hoac 'edit'
  // request.type: match type trong shopify.extension.toml
  // request.data: fields tu inputSchema.properties
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

**Query parameter access:** payload cung duoc append dang `?intent=<URL-encoded JSON>` query parameter -- truy cap dong bo truoc khi App Bridge load.

### 8. Resolve intent

```js
// Thanh cong -- pass any data invoker needs
await shopify.intents.response.ok({campaignId: 'gid://shopify/EmailCampaign/123'});

// Loi -- tra ve error message
await shopify.intents.response.error('Could not save the campaign.');

// Merchant huy
await shopify.intents.response.closed();
```

---

## Build Action Extension (UI Extension)

Tuong tu Admin Link nhung render inline (trong modal) thay vi navigate:

```bash
shopify app generate extension --template app_action --name open-email
```

### Config khac biet

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

- `api_version = "2026-04"` bat buoc
- `type = "ui_extension"` thay vi `admin_link`
- `target = "admin.app.intent.render"` thay vi `admin.app.intent.link`
- Dung `module` thay vi `url`

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

**Luu y UI Extension:**
- "Don't make the callback itself async and don't await shopify.intents.response.ok" -- host callbacks khong await returned promises
- Neu can async work, dung `event.waitUntil(promise)`

### Navigation constraint quan trong

> "An intent is bound to exactly one pathname: the url declared on your extension's admin.app.intent.link target."

- Navigation thay doi pathname se **dong modal** (silent, khong error)
- Query string updates **khong** dong modal
- Hash fragment updates **khong** dong modal
- Dung query parameters hoac component state de xu ly nhieu UI states

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

| Value | Effect | Vi du |
|-------|--------|-------|
| `param` | Thay vao `{placeholder}` trong URL path | `/app/campaigns/{id}` -> `/app/campaigns/123` |
| `query_param` | Append vao query string | `/app/campaigns?status=draft` |
| `form_data` | Gui trong request body (default cho inputSchema properties) | |
| `hash` | Append vao URL hash | `/app/campaigns#edit` |

**fieldName usage:**
- Maps schema property key den destination parameter name
- Required tren top-level `value` khi dung `mapTo: "param"` hoac `"query_param"`
- Optional tren `inputSchema` properties khi key da match placeholder name

```json
"reviewId": {
  "type": "string",
  "mapTo": "param",
  "fieldName": "id"
}
```
Voi `url = "/app/reviews/{id}/edit"` -> `/app/reviews/<reviewId>/edit`

**GID handling:** khi value mapped to `param` la GID (bat dau bang `gid://`), Sidekick extract bare tail identifier sau `/` cuoi cung. VD: `gid://shopify/EmailCampaign/123` -> `123`. Route reads bare identifier tu path params (`useParams()`), khong phai full GID.

## matchValue cho Intent Disambiguation

Khi nhieu intents cung `type:action` pair, dung `matchValue` de phan biet:

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

Invoke truc tiep: `intents.invoke("edit:application/campaign", { data: { channel: "sms" } })`

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

**Phan biet:**
- `application/*`: app owns data shape
- `shopify/*`: tao/import Shopify-native resources
- Single imports (`import`): tra ve `id` trong `outputSchema`, dung meta-schema `shopify-intent.json`
- Bulk imports (`import+bulk`): tra ve `ids` array, dung meta-schema `shopify-intent-bulk.json`

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

**Requirement 2.2.8 -- Functional Alignment:** "Sidekick app extensions must operate within the scope of your app's core functionality." Config, App Store listing, va behavior phai nhat quan -- "materially consistent."

Developer phai audit 3 thu:
1. Extension TOML configuration
2. Runtime behavior within Sidekick
3. Public App Store listing descriptions

**Requirement 2.2.9 -- No Promotions:** "Don't use Sidekick app extensions to promote your app, promote related apps, or request reviews." Khong promotional content, advertisements, cross-sell.

---

## Common Schema Mistakes

1. **Unmapped URL Placeholders:** "If your url contains a placeholder such as {id}, then something in the schema must map to it."
2. **Removing `$ref` from `inputSchema`:** Error: `Intent is invalid: a $ref for the inputSchema matching the intent type must be present`
3. **Adding `required` to Intent Schema:** Error: `Intent is invalid: inputSchema must not have required fields`. Chi apply cho intent schemas; tool schemas cho phep `required`.
4. **Wrong Meta-schema cho Shopify Intents:** `import` yeu cau `shopify-intent.json`; `import+bulk` yeu cau `shopify-intent-bulk.json`
5. **Missing GID `$ref` trong outputSchema:** Required cho Shopify resource intents
6. **Dung `application/*` voi shopify-intent schemas:** Type mismatch se bi deploy error

---

## Testing & Development

- Chay `shopify app dev` de start local dev server
- Install app tren dev store, truy cap Sidekick qua admin -- **mo dev store truc tiep trong browser** (CLI's `p` shortcut khong ho tro cho Sidekick extensions)
- **Sidekick Events** hien trong Dev Dashboard -- status `OK` hoac `Error`, scan target (`extensions/security_scan`), timestamp
- Hot reload tu dong rerun scans sau khi fix -- khong can restart
- Browser dev console hien execution logs va errors
- Client-side logs/errors hien trong browser developer console

## End-to-end workflow

1. Data extension's tool tra ve resource links voi matching `mimeType`
2. Sidekick hien ket qua, user chon 1
3. Sidekick invoke intent voi resource's `uri` lam `value`
4. App navigate den `url` voi substituted parameter (GID -> bare tail)
5. Component mount va register tool handlers
6. Merchant yeu cau tool action qua Sidekick
7. Handler execute va tra ve result
8. Merchant confirm/save (Sidekick khong auto-commit)
9. Extension goi `shopify.intents.response.ok()` de resolve

---

## Phan tich doi thu: Smile.io da tich hop Sidekick

### Smile's Sidekick App Extension

**Launch date:** 18/06/2026 (1 ngay sau GA)

Smile la mot trong 18 launch partners tham gia early access program. Extension cua ho la **data extension** (read-only), cho phep merchant query loyalty data qua Sidekick.

### 5 linh vuc data Smile expose:

| Linh vuc | Vi du cau hoi merchant co the hoi |
|----------|-----------------------------------|
| **Business Growth** | "What's my loyalty-driven revenue over the last 30 days?" |
| **Performance Benchmarks** | "What's my points redemption rate, and is it healthy?" |
| **Customer Segments** | "How do my members compare to non-members on customer lifetime value?" |
| **Points Activity** | Monthly points engagement metrics |
| **Referrals** | "What's my referral revenue this month?" |

### Data elements Smile tra ve:
- Repeat purchase rate
- Member lifetime value (LTV)
- VIP status
- Point redemption rates
- Referral revenue
- Data freshness timestamps
- Contextual notes khi program components inactive

### Format response:
Sidekick tra ve natural language, bao gom merchant's currency, data freshness timestamps, va contextual notes.

---

## Co hoi cho Joy Loyalty: Build Sidekick Extension

### Tai sao can lam ngay

1. **Smile da co mat** -- doi thu truc tiep da launch, merchant dang quen hoi Sidekick ve loyalty data cua Smile
2. **Intent type san co:** `application/loyalty-program` la supported type -- Shopify da design san cho loyalty apps
3. **18 launch partners** da co -- cang cham cang mat competitive advantage
4. **GA da mo** tu 17/06/2026 -- bat ky app developer nao deu co the build

### Loyalty Program Schema (tu Shopify CDN)

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

Schema don gian, `additionalProperties: true` -- cho phep app tu dinh nghia them properties tuy y.

### Ke hoach build (goi y)

**Phase 1: Data Extension (nhanh nhat, bat kip Smile)**

`extensions_summary` goi y:

```toml
[sidekick]
extensions_summary = "Search loyalty program performance, member segments, points activity, referral metrics, and VIP tier data"
```

Tools goi y:

| Tool | Muc dich | Response time target |
|------|----------|---------------------|
| `get_loyalty_overview` | Tong quan: revenue, members, redemption rate | < 1s |
| `get_member_segments` | So sanh member vs non-member (AOV, LTV, purchase frequency) | < 1s |
| `get_points_activity` | Points earned/redeemed/expired theo thoi gian | < 1s |
| `get_referral_stats` | Referral revenue, conversion rate | < 1s |
| `get_vip_tiers` | VIP tier distribution, tier-specific metrics | < 1s |
| `get_reward_performance` | Reward catalog performance, popular rewards | < 1s |

**Loi the hon Smile co the khai thac:**
- Joy co VIP tiers chi tiet hon -> expose tier distribution, tier-specific AOV
- Joy co reward catalog da dang hon -> expose reward performance metrics
- Joy ho tro nhieu loai earning rules -> expose earning breakdown

**Phase 2: Action Extension (tao loi the)**

Dung `application/loyalty-program` intent type voi actions `create` va `edit`:

```toml
[[extensions.targeting.intents]]
type = "application/loyalty-program"
action = "edit"
schema = "./loyalty-schema.json"
```

Merchant co the nho Sidekick: "Edit my loyalty program to add a new VIP tier" -> Sidekick navigate den Joy app voi context.

**Luu y:** Smile hien tai chi co data extension (read-only). Neu Joy launch ca action extension, do la competitive advantage ro rang.

---

## Cac app da ho tro Sidekick extensions (18 launch partners)

| Category | Apps |
|---|---|
| Marketing | Klaviyo, TikTok, Seguno, Mailchimp, Checkout Links, Bloomreach |
| Customers | Loop Returns, AfterShip Returns, Judge.me, **Smile**, Yotpo |
| Promotions | Abra Promotions, Discount Kit, Kitenzo Bundle Builder |
| Products | Printful, Syncee Dropshipping |
| Store Operations | Matrixify, Avia POS Traffic Counter |

**Luu y:** Joy Loyalty chua co trong danh sach nay.

---

## Nguon

- [Sidekick app extensions - shopify.dev](https://shopify.dev/docs/apps/build/sidekick)
- [Build app data extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-data)
- [Build app action extensions](https://shopify.dev/docs/apps/build/sidekick/build-app-actions)
- [App Store requirements changelog](https://shopify.dev/changelog/sidekick-app-extensions-app-store-requirements)
- [Sidekick app extensions available today](https://shopify.dev/changelog/sidekick-app-extensions-available-today)
- [Introducing Sidekick app extensions - changelog](https://shopify.dev/changelog/introducing-sidekick-app-extensions)
- [Apps that work with Sidekick - App Store guide](https://apps.shopify.com/stories/guide-sidekick-app-extensions)
- [Smile launches Sidekick App Extension](https://blog.smile.io/loyalty-data-on-demand-smile-launches-its-sidekick-app-extension-for-shopify/)
- [Loyalty Program Schema](https://extensions.shopifycdn.com/shopifycloud/schemas/v1/application/loyalty-program.json)
