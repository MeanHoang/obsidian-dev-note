# Review Rocket - Integration API Documentation

## Overview

This document addresses the integration requirements outlined in your specification. Review Rocket provides webhook-based integration for the `review.approved` event and APIs for managing webhook subscriptions.

---

## 1. Information You Requested

### API Base URL
```
https://reviewrocket.qressy.com
```

### Authentication Method
**Token-Based Authentication**
- Each merchant receives a unique **Webhook API Token**
- Token required for all webhook subscription operations
- Token passed in request body (for POST) or query parameters (for GET)

### How Merchants Obtain API Credentials

Merchants obtain their API credentials through the Review Rocket app:

1. Merchant logs into Review Rocket Shopify app
2. Navigates to webhook/integration settings
3. Generates Webhook API Token via app interface
4. Token displayed and can be regenerated if needed

**Credentials Required:**
- `shopName`: Merchant's Shopify store domain (e.g., `store-name.myshopify.com`)
- `apiToken`: Webhook API Token (UUID format)

Merchant provides these credentials to integration partners.

---

## 2. Webhook Event

| Event             | Trigger                                 |
| ----------------- | --------------------------------------- |
| `review.approved` | When a review is approved and published |

---

## 3. Webhook Payload

When a review is approved, Review Rocket sends a POST request to your registered webhook endpoint with the following payload:

### Payload Structure

```json
{
  "id": "12345",
  "title": "Great product!",
  "content": "I love this product. Quality is amazing...",
  "rating": 5,
  "email": "customer@example.com",
  "verified_buyer": true,
  "images": ["https://cdn.example.com/image1.jpg", "https://cdn.example.com/image2.jpg"],
  "has_videos": true,
  "shop_domain": "store-name.myshopify.com"
}
```

### Field Specification

| Field            | Type     | Required | Description                                    |
| ---------------- | -------- | -------- | ---------------------------------------------- |
| `id`             | string   | Yes      | Unique review identifier                       |
| `content`        | string   | Yes      | Review body text                               |
| `rating`         | number   | Yes      | Star rating (1-5)                              |
| `email`          | string   | Yes      | Reviewer's email address                       |
| `images`         | string[] | Yes      | Array of image URLs (empty array if no images) |
| `has_videos`     | boolean  | Yes      | `true` if review contains video, `false` otherwise |
| `shop_domain`    | string   | Yes      | Shopify store domain                           |
| `title`          | string   | No       | Review title (optional)                        |
| `verified_buyer` | boolean  | No       | Indicates verified purchase                    |

---

## 4. API Endpoints

### 4.1 Create Webhook Subscription

**Endpoint:** `POST /api/webhooks`

**Description:** Create a new webhook subscription or update existing one.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "shopName": "store-name.myshopify.com",
  "apiToken": "your-webhook-api-token",
  "topic": "review.approved",
  "apiEndpoint": "https://your-domain.com/webhook/endpoint"
}
```

**Parameters:**

| Parameter     | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| `shopName`    | string | Yes      | Merchant's Shopify store domain      |
| `apiToken`    | string | Yes      | Webhook API token from merchant      |
| `topic`       | string | Yes      | Event topic: `"review.approved"`     |
| `apiEndpoint` | string | Yes      | Your webhook receiver endpoint URL   |

**Success Response (200):**
```json
{
  "message": "Webhook subscription created successfully",
  "subscription": {
    "id": "sub_abc123",
    "shopName": "store-name.myshopify.com",
    "topic": "review.approved",
    "apiEndpoint": "https://your-domain.com/webhook/endpoint",
    "createdAt": "2025-12-29T10:00:00.000Z"
  }
}
```

**Example Request:**
```bash
curl -X POST https://reviewrocket.qressy.com/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "store-name.myshopify.com",
    "apiToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "topic": "review.approved",
    "apiEndpoint": "https://your-domain.com/webhook/endpoint"
  }'
```

---

### 4.2 List Webhook Subscriptions

**Endpoint:** `GET /api/webhooks`

**Description:** Retrieve all webhook subscriptions for a shop.

**Query Body:**

| Parameter  | Type   | Required | Description                     |
| ---------- | ------ | -------- | ------------------------------- |
| `shopName` | string | Yes      | Merchant's Shopify store domain |
| `apiToken` | string | Yes      | Webhook API token               |

**Success Response (200):**
```json
{
  "subscriptions": [
    {
      "id": "sub_abc123",
      "shopName": "store-name.myshopify.com",
      "topic": "review.approved",
      "apiEndpoint": "https://your-domain.com/webhook/endpoint",
      "createdAt": "2025-12-29T10:00:00.000Z",
      "updatedAt": "2025-12-29T10:00:00.000Z"
    }
  ]
}
```

**Example Request:**
```bash
curl -X GET "https://reviewrocket.qressy.com/api/webhooks?shopName=store-name.myshopify.com&apiToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

### 4.3 Delete Webhook Subscription

**Endpoint:** `POST /api/webhooks`

**Description:** Delete an existing webhook subscription.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "sub_abc123",
  "shopName": "store-name.myshopify.com",
  "apiToken": "your-webhook-api-token",
  "topic": "review.approved"
}
```

**Parameters:**

| Parameter  | Type   | Required | Description                        |
| ---------- | ------ | -------- | ---------------------------------- |
| `id`       | string | Yes      | Subscription ID to delete          |
| `shopName` | string | Yes      | Merchant's Shopify store domain    |
| `apiToken` | string | Yes      | Webhook API token                  |
| `topic`    | string | Yes      | Topic: `"review.approved"`         |

**Success Response (200):**
```json
{
  "message": "Webhook subscription deleted successfully"
}
```

**Example Request:**
```bash
curl -X POST https://reviewrocket.qressy.com/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "id": "sub_abc123",
    "shopName": "store-name.myshopify.com",
    "apiToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "topic": "review.approved"
  }'
```

---

### 4.4 Verify Webhook Configuration

**Endpoint:** `POST /api/verifyWebhook`

**Description:** Verify that webhook subscription is correctly configured.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "apiEndpoint": "https://your-domain.com/webhook/endpoint",
  "apiToken": "your-webhook-api-token",
  "topic": "review.approved"
}
```

**Parameters:**

| Parameter     | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `apiEndpoint` | string | Yes      | Your webhook endpoint URL          |
| `apiToken`    | string | Yes      | Webhook API token                  |
| `topic`       | string | Yes      | Topic: `"review.approved"`         |

**Success Response (200):**
```json
{
  "verified": true,
  "message": "Webhook is correctly configured"
}
```

**Error Response (400):**
```json
{
  "verified": false,
  "message": "Webhook is not correctly configured"
}
```

**Example Request:**
```bash
curl -X POST https://reviewrocket.qressy.com/api/verifyWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "apiEndpoint": "https://your-domain.com/webhook/endpoint",
    "apiToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "topic": "review.approved"
  }'
```

---

## 5. Integration Workflow

### Step-by-Step Integration Process

1. **Merchant Setup**
   - Merchant installs Review Rocket app on their Shopify store
   - Merchant generates Webhook API Token in app settings
   - Merchant provides you with: `shopName` and `apiToken`

2. **Partner Subscription**
   - Use POST `/api/webhooks` to create subscription
   - Provide your webhook endpoint URL where you'll receive events

3. **Verification** (Optional but Recommended)
   - Use POST `/api/verifyWebhook` to confirm subscription is active

4. **Webhook Delivery**
   - When merchant approves a review, webhook sent to your endpoint
   - POST request with JSON payload (see section 3)

5. **Management**
   - List subscriptions: GET `/api/webhooks`
   - Delete subscription: POST `/api/webhooks` with `id`

---

## 6. Error Responses

### Common Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| `400`       | Bad Request - Missing required fields or invalid data |
| `401`       | Unauthorized - Invalid API token     |
| `404`       | Not Found - Subscription not found   |
| `500`       | Internal Server Error                |

### Example Errors

**Missing Required Fields (400):**
```json
{
  "error": "Missing required fields: shopName, topic, apiEndpoint, and apiToken are required"
}
```

**Invalid API Token (401):**
```json
{
  "error": "Invalid API token."
}
```

**Invalid Topic (400):**
```json
{
  "error": "Invalid topic. Please provide a valid topic."
}
```

---

## 7. Technical Notes

- **CORS:** All API endpoints support CORS for cross-origin requests
- **Content-Type:** All POST requests require `Content-Type: application/json`
- **Webhook Delivery:** Webhooks sent as POST with `Content-Type: application/json`
- **Currently Supported Topics:** Only `review.approved` is available
- **Shop Name Format:** Can be provided with or without `.myshopify.com` suffix

Debug payload bắn về 
```js
console.log('🚀 [ReviewRocket] ===== WEBHOOK PAYLOAD DEBUG =====');

console.log('🚀 [ReviewRocket] URL Path:', ctx.request?.url || ctx.req?.url);

console.log('🚀 [ReviewRocket] Method:', ctx.method || ctx.req?.method);

console.log('🚀 [ReviewRocket] Query Params:', ctx.query || ctx.req?.query);

console.log('🚀 [ReviewRocket] All Headers:', ctx.headers || ctx.req?.headers);

console.log('🚀 [ReviewRocket] Payload Keys:', Object.keys(ctx.req?.body || {}));

console.log('🚀 [ReviewRocket] Full Payload:', JSON.stringify(ctx.req?.body || {}, null, 2));

console.log('🚀 [ReviewRocket] ctx.state:', ctx.state || {});

console.log('🚀 [ReviewRocket] ===== END DEBUG =====');
```
```js
🚀 [ReviewRocket] ===== WEBHOOK PAYLOAD DEBUG =====
>  🚀 [ReviewRocket] URL Path: /app/api/v1/review/approve
>  🚀 [ReviewRocket] Method: POST
>  🚀 [ReviewRocket] Query Params: {}
>  🚀 [ReviewRocket] All Headers: {
>    'x-forwarded-host': 'began-lindsay-election-andrea.trycloudflare.com',
>    'x-original-url': '/app/api/v1/review/approve',
>    pragma: 'no-cache',
>    'cache-control': 'no-cache, no-store',
>    cookie: '',
>    'user-agent': 'node-fetch',
>    'content-length': '173',
>    accept: '*/*',
>    'accept-encoding': 'gzip',
>    'cdn-loop': 'cloudflare; loops=1; subreqs=1',
>    'cf-connecting-ip': '3.6.18.15',
>    'cf-ew-via': '15',
>    'cf-ipcountry': 'IN',
>    'cf-ray': '9beb922cb0f247ce-BOM',
>    'cf-visitor': '{"scheme":"https"}',
>    'cf-warp-tag-id': '9c1d175e-0409-4e61-80a7-5366944e937f',
>    'cf-worker': 'trycloudflare.com',
>    connection: 'close',
>    'content-type': 'application/json',
>    'x-forwarded-for': '3.6.18.15',
>    'x-forwarded-proto': 'https',
>    'x-client-version': 'FirebaseCLI/13.35.1',
>    host: '127.0.0.1:5011'
>  }
>  🚀 [ReviewRocket] Payload Keys: [
>    'id',
>    'content',
>    'rating',
>    'email',
>    'verified_buyer',
>    'images',
>    'has_videos',
>    'shop_domain',
>    'title'
>  ]
>  🚀 [ReviewRocket] Full Payload: {
>    "id": "9390",
>    "content": "213213",
>    "rating": 5,
>    "email": "hoangtm@avadagroup.com",
>    "verified_buyer": false,
>    "images": [],
>    "has_videos": false,
>    "shop_domain": "ag-mh-shop2",
>    "title": "2313"
>  }
>  🚀 [ReviewRocket] ctx.state: {}
>  🚀 [ReviewRocket] ===== END DEBUG =====
```


