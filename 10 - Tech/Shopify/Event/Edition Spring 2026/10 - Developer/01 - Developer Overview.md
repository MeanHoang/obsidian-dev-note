# Shopify Editions Spring '26 — Developer Overview

> Section **Developer** là phần quan trọng nhất của Editions Spring 2026 với app developer. Tổng cộng **54 updates** chia thành 2 nhóm: Platform (25) và Apps & Extensions (29).
> Note này là mục lục theo thứ tự đọc, link đến từng file chi tiết.

---

## Thứ tự đọc

1. [[02 - AI Tooling - Dev MCP & Commerce Skills]] — AI Toolkit, MCP server, commerce skills cho Claude/Cursor/Codex
2. [[03 - Shopify CLI]] — GraphQL/bulk operations từ CLI, auto-upgrades semver, safer deployments, automation tokens
3. [[04 - Dev Dashboard & Monitoring]] — Partner stores, App Events API, webhook monitoring, admin performance, role-based access
4. [[05 - APIs - Metafields, Metaobjects, Collections, Inventory]] — Streamlined metafield/metaobject API, ShopifyQL metafields, parallel bulk queries, Collections API, Inventory API idempotency, SKU sharing, webhook field triggers
5. [[06 - Shopify Functions & Discounts]] — Metaobject trong functions, billing address/PO number, prerequisites, discount config UI extensions, bulk editing
6. [[07 - Checkout & Customer Accounts]] — Branding API, AI Toolkit checkout, nested cart lines, customer account web component, login_hint, cartToOrderCopyable, standard events, Customer Account API requirement
7. [[08 - Hydrogen moi]] — Agent-first rebuild, Vercel partnership, Next.js, framework-agnostic toolkit
8. [[09 - App Distribution - Pricing, Submission, Security]] — Shopify App Pricing, streamlined submission, expiring tokens OAuth 2.0
9. [[10 - POS UI Extensions]] — Activation status, offline support, localization, camera API, cash management
10. [[11 - Shop Minis & Sales Channels]] — Minis surfaces/Intents, Sign-in with Shop, multi-channel sales channel, ship+pickup

---

## Highlight cho Joy Loyalty

| Update | Tại sao quan trọng |
|--------|-------------------|
| Expiring tokens + OAuth refresh | Mọi public app PHẢI migrate trước 1/1/2027 |
| Customer Account API requirement | App returns/subscriptions cần integrate trước 1/12/2026 để giữ Built for Shopify |
| Shopify App Pricing | Billing mới — cần evaluate có migrate hay giữ billing hiện tại |
| cartToOrderCopyable | Loyalty data lưu trong cart metafield giờ tự động copy sang order |
| Webhook field triggers | Giảm noise webhook, chỉ trigger khi field cụ thể thay đổi |
| Metaobject trong Functions | Loyalty tier lưu trong metaobject, function đọc để áp discount — không cần redeploy |

---

## Nguồn

- Shopify Editions Spring 2026: https://www.shopify.com/editions/spring2026
- Section: Developer > Platform + Apps & Extensions
