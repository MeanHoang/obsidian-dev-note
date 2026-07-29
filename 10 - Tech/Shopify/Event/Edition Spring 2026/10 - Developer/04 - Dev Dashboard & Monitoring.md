# Shopify Editions Spring '26 — Dev Dashboard & Monitoring

> Dev Dashboard trở thành trung tâm quản lý: tất cả partner stores, App Events API, webhook monitoring nâng cao, admin performance tracking, role-based access, và localization.

---

## 1. All Partner Stores in Dev Dashboard

Dev store, client transfer store, và collaborator store giờ đều nằm trong **Dev Dashboard** — một nơi duy nhất quản lý mọi store liên quan development.

**Impact:** Không cần switch giữa Partner Dashboard và admin từng store.

**Availability:** GA
**Docs:** https://www.shopify.com/partners/blog/improved-building-for-partners

---

## 2. App Events API

Gửi **custom event** từ app về Shopify, monitor và quản lý performance trong Dev Dashboard.

### Endpoint

```
POST https://api.shopify.com/app/unstable/event
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {BEARER_TOKEN}
```

### Request format

```json
{
  "shop_id": 23423423,
  "event_handle": "bulk_import_failed",
  "timestamp": "2026-05-08T14:30:00Z",
  "idempotency_key": "evt_88012345",
  "attributes": {
    "item_count": 340,
    "error_type": "csv_parse_error"
  }
}
```

### Event handle — tự define

Không có danh sách fixed. Một số gợi ý:

| Category | Ví dụ |
|----------|-------|
| Feature usage | `bulk_edit_completed`, `report_generated` |
| Workflows | `onboarding_completed`, `campaign_sent` |
| Performance | `sync_failed`, `api_timeout`, `rate_limit_hit` |
| Conversion | `limit_hit`, `premium_viewed`, `milestone_achieved` |
| Billable | `order_processed`, `email_sent`, `label_printed` |

### Tích hợp billing

Event powering usage-based charges không cần integration riêng — define meters trong Partner Dashboard match `event_handle`, Shopify handle invoicing tự động (xem [[09 - App Distribution - Pricing, Submission, Security]]).

### Dashboard

Events hiện trong **Dev Dashboard Logs** cùng với webhooks, Functions, GraphQL/REST requests. Filter theo `event_handle` và timeline.

**Availability:** GA
**Docs:** https://www.shopify.com/partners/blog/app-events

---

## 3. Improved Webhook Monitoring

Webhook monitoring trong Dev Dashboard hỗ trợ:

| Feature | Mô tả |
|---------|--------|
| Multi-select filter | Filter theo nhiều webhook topic cùng lúc |
| Faceted event count | Xem count theo facet (topic, status) |
| Custom time range | Chọn time range tuỳ ý, không chỉ last 24h |

**Impact:** Debug webhook issue nhanh hơn đáng kể — filter → identify pattern → fix.

**Availability:** GA
**Docs:** https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs

---

## 4. Admin Performance Monitoring

Monitor **admin web vitals** của app và trạng thái **Built for Shopify** trực tiếp trong Dev Dashboard.

### Core Web Vitals tracked

| Metric | Đo gì |
|--------|--------|
| **LCP** (Largest Contentful Paint) | Loading performance |
| **INP** (Interaction to Next Paint) | Interactivity (thay thế FID) |
| **CLS** (Cumulative Layout Shift) | Visual stability |

- Data hiển thị dạng **daily và 28-day P75 rollups** với pass/fail status
- Thresholds dùng để đánh giá **Built for Shopify** — cùng metrics App Store dùng
- Dashboard chuyển từ Partner Dashboard sang Dev Dashboard (legacy URLs tự redirect)
- Không cần code changes — telemetry collection giữ nguyên

**Impact:** Developer biết ngay app có đạt chuẩn Built for Shopify hay không, và cần optimize ở đâu.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/monitor-admin-web-vitals-in-the-dev-dashboard

---

## 5. Role-based Access for Partners

Quản lý team thông qua **7 system role** có sẵn + **custom role** tuỳ nhu cầu.

### System roles (7 built-in)

Phân quyền chi tiết — developer chỉ thấy code/deploy, business chỉ thấy analytics, support chỉ thấy store. Trước đây chỉ có owner/staff.

**Impact:** Partner organization lớn có thể phân quyền an toàn hơn.

**Availability:** GA
**Docs:** https://www.shopify.com/partners/blog/improved-building-for-partners

---

## 6. Localized Dev Dashboard

Dev Dashboard hỗ trợ **đa ngôn ngữ** — toàn bộ UI text và navigation được dịch.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/the-dev-dashboard-is-now-multi-lingual

---

## 7. No Backend Required for Lightweight Apps (App Home)

Build **App Home** trực tiếp trong admin mà **không cần backend server**. App Home UI extension render ngay trong admin dashboard.

**Impact:** App đơn giản (dashboard, settings page, info panel) không cần server — giảm cost hosting. Phù hợp cho app nhẹ chỉ cần hiển thị UI.

**Availability:** GA
**Docs:** https://shopify.dev/docs/api/app-home-ui-extension/latest

---

## Nguồn

- https://www.shopify.com/partners/blog/improved-building-for-partners
- https://www.shopify.com/partners/blog/app-events
- https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs
- https://shopify.dev/changelog/monitor-admin-web-vitals-in-the-dev-dashboard
- https://shopify.dev/changelog/the-dev-dashboard-is-now-multi-lingual
- https://shopify.dev/docs/api/app-home-ui-extension/latest
