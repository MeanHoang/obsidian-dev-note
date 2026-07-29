# Operations - Shopify Flow

Editions Spring '26 có **5 cập nhật** cho Shopify Flow: code editor, version history, workflow notes, automatic shipping labels, và ShopifyQL + Admin API fields.

---

## Code editor in Shopify Flow

Editor cho Liquid variables trong Flow được nâng cấp với **syntax highlighting, autocomplete, formatting**.

**Cách dùng Liquid trong Flow:**
- Click "Add a variable" để insert Liquid variable đã format sẵn
- Hoặc viết Liquid trực tiếp trong text field
- Syntax: camelCase variables, vd `{{ order.name }}`
- Hỗ trợ Liquid tags: `if`, `unless`, `for` loops
- Filters: standard Liquid filters + custom date và cryptographic filters

> Docs hiện tại chưa mô tả chi tiết giao diện code editor mới (syntax highlighting, autocomplete). Thông tin trên lấy từ Editions announcement.

**Docs:** [Flow variables](https://help.shopify.com/en/manual/shopify-flow/getting-started/concepts/variables)

---

## Version history

Xem **ai đã update workflow** và **khi nào** để track changes.

**Những gì được track:**
- Edits, activations, deactivations, exports
- Mỗi entry ghi: tên editor, timestamp, status changes
- Modifications vào draft được log **tự động** — không cần manual save
- Hệ thống cũng identify changes từ **Sidekick hoặc Shopify** (migrations, automated processes)

**Cách xem:** Apps > Flow → chọn workflow → tab **Version history**

**Hạn chế:**
- **Không thể revert** về version cũ — chỉ xem, không restore
- Chỉ hiển thị **7 changes gần nhất** per user cho workflows được edit nhiều
- Event data retention: chỉ **1 năm**
- Historical data chỉ available **từ April 2026 trở đi**
- Bất kỳ staff member nào cũng có thể xem version history của bất kỳ workflow

**Docs:** [Version history](https://help.shopify.com/manual/shopify-flow/manage/version-history)

---

## Workflow notes

Thêm **notes/ghi chú** vào workflow để collaborators hiểu logic.

**Cách thêm:** Apps > Flow → chọn workflow → Edit → More actions > Add note → nhập nội dung vào box "About this workflow" → Done

**Specs:**
- Tối đa **1,500 ký tự**, **20 dòng**
- **1 note duy nhất** per workflow
- Yêu cầu workflow phải có trigger trước khi thêm note
- Note hiển thị dạng expanded text box bên cạnh trigger

**Use cases:**
- Document decisions về workflow structure
- Ghi requirements và dependencies
- Để instructions cho collaborators sẽ edit workflow
- Metadata: tác giả, ngày tạo

**Xoá note:** More actions > Remove note

**Docs:** [Manage workflows - Add note](https://help.shopify.com/manual/shopify-flow/manage/manage#add-note)

---

## Automatic shipping label purchasing

Tạo rules trong Flow để **tự động mua shipping labels** khi triggers xảy ra.

**Configuration:**
- **Shipping service**: chọn option rẻ nhất hoặc specify carrier/service cụ thể
- **Saved package**: dùng recommended package hoặc chọn từ saved dimensions
- **Total weight**: dùng assigned line item weights hoặc set custom weight
- **Shipping confirmation**: timing gửi notification, default "Same day"

**Compatible triggers** (9 triggers):
- Fulfillment order ready to fulfill
- Fulfillment order moved
- Fulfillment order hold released
- Fulfillment service failure scenarios
- Cancellation request events

**Hạn chế quan trọng:**
- Chỉ hoạt động với **Shopify fulfillment** — không apply cho third-party fulfillment services
- Nếu store dùng hybrid (Shopify + 3PL), phải thêm **conditions filter** theo fulfillment location/service trước action purchase label
- Action xử lý **1 label cho 1 fulfillment** — cần dùng **For each** action cho bulk
- `fulfillmentOrder.id` tự động populate từ trigger, không thể modify
- Carrier/service availability phụ thuộc package weight, destination, active locations

**Docs:** [Purchase shipping label action](https://help.shopify.com/en/manual/shopify-flow/reference/actions/purchase-shipping-label)

---

## ShopifyQL + Admin API fields in automations

Truy cập **analytics data (ShopifyQL)** và **Admin API fields** trong Flow automations.

**Admin API trong Flow:**
- Actions sử dụng **GraphQL Admin API** để thay đổi store data
- Mỗi action map tới GraphQL mutation tương ứng (vd: Add order tags → `tagsAdd` mutation)
- Action **"Send Admin API request"** cho phép dùng hầu hết mutations, kể cả những mutation chưa có sẵn dạng action trong Flow

**Data access trong workflows:**
- **Triggers**: cung cấp initial data (vd: "Customer created" trigger → customer info)
- **Get data actions**: 40+ actions lấy data cụ thể — customer, order, product, company, subscription, inventory...
- Nếu action cần data mà trigger hoặc Get data action không cung cấp → workflow **không chạy** và hiển thị error

> Docs hiện tại chưa mô tả chi tiết cách ShopifyQL được dùng trực tiếp trong Flow automations. Thông tin về ShopifyQL integration lấy từ Editions announcement.

**Docs:** [Flow actions reference](https://help.shopify.com/en/manual/shopify-flow/reference/actions)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin
