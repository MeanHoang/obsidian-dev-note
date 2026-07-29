# Shopify Editions Spring '26 — Developer: Platform

> Section **Platform** trong nhóm Developer của Shopify Editions Spring 2026.
> Tổng cộng **25 updates** tập trung vào developer experience: CLI, API, webhook, MCP, AI Toolkit, Dev Dashboard, Shopify Functions, và Polaris.

---

## Commerce skills for your favorite agent

Build và quản lý storefront, app, theme trực tiếp từ các AI tool như **Claude Code, Codex, Cursor, Hermes** và các agent khác.

Shopify cung cấp **AI Toolkit** — bộ commerce skill dạng MCP server + prompt, cho phép agent hiểu context Shopify (API schema, best practice, component) và sinh code chính xác. Developer không cần rời IDE, chỉ cần prompt agent là có thể scaffold app, query API, hay sửa theme.

**Impact:** Giảm đáng kể thời gian tra cứu docs khi build app/theme. Agent có context Shopify sẵn, output code đúng convention.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/ai-toolkit

---

## More control over events

Cấu hình **webhook field triggers** — webhook chỉ fire khi một field cụ thể thay đổi (ví dụ: chỉ trigger khi `order.status` đổi, bỏ qua thay đổi note). Đồng thời dùng **custom GraphQL query** để chọn chính xác data trả về trong webhook payload, thay vì nhận toàn bộ resource.

**Impact:** Giảm noise webhook đáng kể, tiết kiệm compute xử lý event. App chỉ nhận đúng event + data cần thiết, giảm bandwidth và processing cost.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/events

---

## GraphQL and bulk operations from the CLI

Chạy **GraphQL query** và **bulk operations** trực tiếp từ terminal hoặc agent thông qua Shopify CLI, với auto authentication và built-in status tracking cho bulk job.

**Impact:** Không cần viết script riêng hay dùng Postman để test query. Đặc biệt hữu ích khi debug hoặc chạy data migration — CLI handle auth và poll status tự động.

- Availability: GA
- Docs: https://shopify.dev/changelog/use-the-admin-api-and-bulk-operations-in-shopify-cli

---

## All partner stores in Dev Dashboard

Dev store, client transfer store, và collaborator store giờ đều nằm trong **Dev Dashboard** — một nơi duy nhất để quản lý mọi store liên quan đến development.

**Impact:** Không cần switch qua lại giữa Partner Dashboard và admin của từng store. Tất cả store phục vụ build/test đều tập trung một chỗ.

- Availability: GA
- Docs: https://www.shopify.com/partners/blog/improved-building-for-partners

---

## App Events API

Gửi **custom event** từ app về Shopify, sau đó monitor và quản lý performance của app trong Dev Dashboard.

**Impact:** Developer có thể track business-level event (ví dụ: user click CTA, widget render thành công) rồi xem dashboard tổng hợp, thay vì phải build monitoring riêng.

- Availability: GA
- Docs: https://www.shopify.com/partners/blog/app-events

---

## Localized Dev Dashboard

Dev Dashboard hỗ trợ **đa ngôn ngữ** — toàn bộ UI text và navigation được dịch sang ngôn ngữ developer chọn.

**Impact:** Developer không nói tiếng Anh bản ngữ có trải nghiệm tốt hơn khi navigate Dev Dashboard.

- Availability: GA
- Docs: https://shopify.dev/changelog/the-dev-dashboard-is-now-multi-lingual

---

## Revamped Polaris docs

Toàn bộ **Polaris reference docs** được viết lại với nhiều code sample hơn, use case rõ ràng hơn, mô tả chi tiết hơn và navigation cải thiện.

**Impact:** Dễ tìm component phù hợp và copy-paste code sample khi build admin UI extension. Giảm thời gian tra cứu.

- Availability: GA
- Docs: https://shopify.dev/docs/api/polaris

---

## Metafields in ShopifyQL

ShopifyQL hỗ trợ **metafield** làm dimension và filter, sử dụng **dot-syntax** trong Analytics API và online editor.

**Impact:** Merchant và app có thể query analytics dựa trên custom data (metafield) mà không cần export ra hệ thống ngoài. Ví dụ: filter revenue theo metafield `product.custom.tier`.

- Availability: GA
- Docs: https://shopify.dev/docs/api/shopifyql#metafields

---

## Auto-upgrades and semantic versioning in Shopify CLI

Shopify CLI tự động upgrade cho **minor và patch release**. Major version yêu cầu opt-in, tuân theo **semantic versioning** mới.

**Impact:** Developer luôn có bản CLI mới nhất với bug fix + tính năng nhỏ mà không cần chạy update thủ công. Breaking change (major) vẫn cần xác nhận rõ ràng — an toàn cho CI/CD pipeline.

- Availability: GA
- Docs: https://shopify.dev/changelog/shopify-cli-40-semver-auto-updates-removing-deprecated-flags-and-commands

---

## Safer app deployments

Cấu hình **CI/CD pipeline** deploy extension mới và cập nhật extension hiện có mà **không vô tình xóa** extension đang chạy trên live store.

**Impact:** Trước đây, `shopify app deploy` có thể xóa extension không có trong source — gây incident trên production. Giờ có cơ chế bảo vệ, deploy chỉ thêm/sửa, không xóa trừ khi chủ động.

- Availability: GA
- Docs: https://shopify.dev/changelog/more-control-over-app-deploys-in-cicd-pipelines

---

## Streamlined Metafields and Metaobjects API

Read và write **metafield/metaobject** dễ hơn với GraphQL API đơn giản hóa — ít boilerplate, mutation gọn hơn.

**Impact:** Giảm code cần viết khi làm việc với custom data layer. Đặc biệt có lợi cho app cần CRUD metaobject phức tạp (loyalty tier, custom entity...).

- Availability: GA
- Docs: https://shopify.dev/changelog/streamlined-metaobject-api

---

## No backend required for lightweight apps (App Home)

Build **App Home** trực tiếp trong admin mà **không cần setup hay maintain backend server**. App Home UI extension render ngay trong admin dashboard.

**Impact:** App đơn giản (dashboard, settings page, info panel) không cần server — giảm cost hosting và complexity. Phù hợp cho app nhẹ chỉ cần hiển thị UI trong admin.

- Availability: GA
- Docs: https://shopify.dev/docs/api/app-home-ui-extension/latest

---

## Discount configuration with admin UI extensions

Admin UI extension có thể quản lý **discount class** và render **conditional UI** trong admin dựa trên discount method (code, automatic...).

**Impact:** App discount có thể build UI configuration phong phú hơn trong admin, thay vì chỉ dùng form cơ bản. Merchant có trải nghiệm tạo discount tương đương native.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/discounts/build-ui-extension

---

## Accelerated checkout support for add-ons (nested cart lines)

**Shop Pay, Apple Pay** và các accelerated checkout khác hỗ trợ **nested cart line** — customer có thể mua add-on trực tiếp từ product page mà vẫn dùng express checkout.

**Impact:** App bán add-on/upsell không còn bị block bởi accelerated checkout. Conversion rate tăng vì customer không bị redirect ra checkout thường.

- Availability: GA
- Docs: https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout/multiple-product-checkout

---

## Declarative metaobjects don't require scopes

App-owned metaobject **không cần khai báo scope** nữa. Data migrate tự động khi app được install.

**Impact:** Đơn giản hóa app setup — không cần request thêm scope cho metaobject mà app tự quản lý. Giảm friction khi merchant install app.

- Availability: GA
- Docs: https://shopify.dev/changelog/metaobject-scopes-not-required-for-app-metaobjects

---

## Metaobject data in checkout functions

Sử dụng **metaobject entry** trong checkout function để power custom discount, product rule, và personalized checkout logic.

**Impact:** Function có thể đọc data từ metaobject thay vì hardcode logic. Ví dụ: loyalty tier lưu trong metaobject, function đọc tier để áp discount — thay đổi tier không cần redeploy function.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/metaobjects#use-in-shopify-functions

---

## Billing address and PO number in Shopify Functions

Query **billing address** và **PO number** trong cart/checkout validation function để enforce compliance rule và yêu cầu B2B.

**Impact:** App B2B có thể validate đơn hàng dựa trên billing address (ví dụ: block shipping đến quốc gia bị cấm) hoặc require PO number — trước đây không có data này trong function input.

- Availability: GA
- Docs: https://shopify.dev/docs/api/functions/latest/cart-and-checkout-validation#supported-checkout-field-targets

---

## Shopify AI Toolkit for Polaris web components

Upgrade checkout và customer account extension sang **Polaris web component** bằng AI agent thông qua Shopify AI Toolkit. Agent hỗ trợ migrate code tự động.

**Impact:** Migration từ React component sang web component (yêu cầu mới của Shopify cho checkout extension) được accelerate bởi AI — giảm effort thủ công đáng kể.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/checkout/migrate-to-web-components#migrate-using-ai

---

## Role-based access for partners

Quản lý team thông qua **7 system role** có sẵn, và tạo **custom role** cho nhu cầu riêng.

**Impact:** Partner organization lớn có thể phân quyền chi tiết — developer chỉ thấy code/deploy, business chỉ thấy analytics, support chỉ thấy store. Trước đây chỉ có owner/staff.

- Availability: GA
- Docs: https://www.shopify.com/partners/blog/improved-building-for-partners

---

## Improved webhook monitoring

Webhook monitoring trong Dev Dashboard hỗ trợ **multi-select filter**, **faceted event count**, và **custom time range**.

**Impact:** Debug webhook issue nhanh hơn — filter theo nhiều topic cùng lúc, xem count theo facet, chọn time range tùy ý thay vì chỉ last 24h.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/dev-dashboard/monitoring-and-logs

---

## App automation tokens

Tạo **app automation token** trực tiếp trong Dev Dashboard để automate app release trong CI/CD workflow.

**Impact:** Không cần dùng personal token hay workaround để deploy từ CI. Token chuyên dụng cho automation, có thể revoke independently.

- Availability: GA
- Docs: https://shopify.dev/changelog/app-deployment-in-cicd-is-now-available-for-all-apps

---

## Admin performance monitoring

Monitor **admin web vitals** của app và trạng thái **Built for Shopify** trực tiếp trong Dev Dashboard.

**Impact:** Developer thấy ngay app load time, interaction delay trong admin — biết app có đạt chuẩn Built for Shopify hay không, và cần optimize ở đâu.

- Availability: GA
- Docs: https://shopify.dev/changelog/monitor-admin-web-vitals-in-the-dev-dashboard

---

## Parallel reads for bulk queries (4x faster)

Chạy Admin API bulk query **nhanh gấp 4 lần** nhờ cơ chế **parallel read** — nhiều read operation chạy đồng thời thay vì tuần tự.

**Impact:** Data sync và export lớn (product catalog, order history) hoàn thành nhanh hơn đáng kể. App sync/migration giảm thời gian chờ từ phút xuống giây.

- Availability: GA
- Docs: https://shopify.dev/changelog/bulk-queries-now-execute-faster

---

## Shopify Dev MCP — optimized token usage

Response từ Shopify Dev MCP **dùng ít token hơn** mà vẫn giữ nguyên accuracy. Agent nhận context Shopify hiệu quả hơn về mặt cost.

**Impact:** Chạy MCP trong Claude Code hay Cursor tốn ít token hơn — giảm chi phí khi dùng AI agent để build Shopify app, đặc biệt với context window lớn.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/ai-toolkit#install-with-the-dev-mcp-server

---

## Shopify Dev MCP — all API versions

Shopify Dev MCP cung cấp **context chính xác và code validation** cho **tất cả supported API version**, không chỉ latest.

**Impact:** Khi maintain app dùng API version cũ, agent vẫn sinh code đúng cho version đó. Không bị generate code dùng field/mutation chưa có hoặc đã deprecated.

- Availability: GA
- Docs: https://shopify.dev/docs/apps/build/ai-toolkit#install-with-the-dev-mcp-server

---

## Nguồn

- Shopify Editions Spring 2026: https://www.shopify.com/editions/spring2026
- Section: Developer > Platform
