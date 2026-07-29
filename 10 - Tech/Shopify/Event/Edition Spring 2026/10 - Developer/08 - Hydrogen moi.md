# Shopify Editions Spring '26 — Hydrogen moi

> Hydrogen viết lại từ đầu: từ opinionated Remix framework thành modular toolkit framework-agnostic. Agent-first, Vercel partnership, hỗ trợ Next.js + bất kỳ framework nào.

---

## Tổng quan: Framework to Toolkit

| Aspect | Hydrogen cũ | Hydrogen mới |
|--------|-------------|--------------|
| Architecture | Full opinionated framework trên Remix | Modular toolkit, framework-agnostic |
| Framework | Bắt buộc Remix | Next.js, React Router, SvelteKit, Astro, SolidStart, Nuxt |
| Language | React + TypeScript | **Plain JavaScript**, không framework dependency |
| Deployment | Oxygen (Shopify hosting) | Oxygen, Vercel, Cloudflare Workers, Node, Deno |
| AI | Docs-based | Agent-first với embedded skills |
| Status | **Fully supported, giữ nguyên** | **Developer Preview** |

---

## Core Technical Design

### Framework-agnostic core

- Written in plain JavaScript, no framework dependencies
- React bindings ship trong preview
- **Planned:** Vue, Svelte, Remix 3 bindings
- Framework-specific adapters khiến primitives "feel native to your framework"

### Runtime flexibility

Chạy "anywhere you can call fetch" — server-side request handlers manage cart operations, analytics, checkout **trước khi** client-side JavaScript loads.

---

## Agent-First Architecture

Hydrogen ship kèm **agent skills** — framework-aware guides versioned theo exact package installed, copy vào project khi setup.

### Skills coverage

- Storefront API client configuration
- Request handler wiring
- Cart và cart drawer implementation
- Collection/search browsing
- Product pages và variant selection
- Money formatting và Shop Pay integration
- Market localization
- Analytics với consent handling

### Standard Events Integration

Implement Shopify's **standard events and actions** — cùng commerce contract mà Liquid storefronts dùng (xem [[07 - Checkout & Customer Accounts#7. Standard Storefront Events and Actions]]).

---

## SDK & API Surface

### Typed Storefront Client

```javascript
import {
  createStorefrontClient,
  createStorefrontRequestContext,
  gql,
} from "@shopify/hydrogen";

const storefront = createStorefrontClient({
  type: "private",
  config: {
    storeDomain: process.env.PUBLIC_STORE_DOMAIN,
    privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
  },
});

const { data } = await storefront.graphql(gql(`query Home { ... }`));
```

- `gql()` cung cấp automatic schema typing — editor biết shape mọi field, flag errors inline
- CI validation: `gql.tada check` ngăn renamed fields đến production

### Reactive Primitives (Signals-style)

**React version:**
```javascript
import { createCartComponents } from "@shopify/hydrogen/react";

export const { CartProvider, useCart, useCartForm } =
  createCartComponents();

function CartCount() {
  const totalQuantity = useCart((cart) => cart.data.totalQuantity);
  return <span>{totalQuantity}</span>;
}
```

**Framework-agnostic version:**
```javascript
import { createCartStore } from "@shopify/hydrogen";

const cart = createCartStore({ initialData });
cart.subscribe((state) => {
  document.querySelector("#cart-count").textContent =
    String(state.data.totalQuantity);
});
```

Dùng "signals-style reactive model" — code chỉ chạy khi slice thay đổi.

### Request Handlers

```javascript
handleShopifyRoutes();     // before router
// your framework router
handleShopifyRedirects();  // after 404
```

Handle: Storefront API proxy, cart endpoints, checkout/cart permalinks, MCP/agent proxies.

---

## Installation & Setup

### Three-step initialization

```bash
# 1. Scaffold với framework CLI
npx create-next-app@latest

# 2. Install Hydrogen
npx @shopify/hydrogen@preview setup

# 3. Prompt coding agent
# "Can you set up my store with Shopify?"
```

Setup command install `@shopify/hydrogen` và copy agent skills vào project, matched to installed version.

---

## Features in Developer Preview

### Included

- Typed Storefront API client (no code generation)
- Cart, product, collection primitives
- Money formatting utilities
- Shop Pay integration
- First-party analytics với consent handling
- Server-driven cart operations
- Optimistic UI updates

### Planned (chưa có)

- Customer accounts
- Predictive search
- Additional framework bindings (Vue, Svelte, Remix 3)

---

## Migration

**Current Hydrogen vẫn fully supported.** Storefronts đang chạy giữ nguyên. Migration guidance sẽ đến khi APIs stabilize.

---

## Vercel Partnership

Development pressure-test core against **real Next.js App Router storefront** với Next.js team. Kết quả: primitives "feel native" thay vì "bolted on", respect framework conventions.

---

## Nguồn

- https://hydrogen.shopify.dev/update/hydrogen-developer-preview
