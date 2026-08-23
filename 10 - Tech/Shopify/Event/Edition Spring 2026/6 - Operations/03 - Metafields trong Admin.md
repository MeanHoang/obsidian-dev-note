# Operations - Metafields trong Admin

Editions Spring '26 có **2 cập nhật** liên quan đến metafields trong admin: tạo definitions in context và nâng giới hạn pin lên 50.

---

## Metafields in context of workflows

Tạo metafield definitions **trực tiếp từ resource pages** (customers, orders, collections, products...) mà không cần navigate sang Settings > Metafields.

**Cách làm:** Vào trang resource (vd: Products) → tìm section Metafields → click "Add definition" → tạo definition inline.

**So sánh với Settings approach:**
- Cả 2 cách đều cho **cùng configuration options** (type, validation, storefront access...)
- Context-based: tiện khi đang làm việc với resource cụ thể, giảm context-switching
- Settings-based: tập trung quản lý tất cả metafield definitions ở 1 nơi (Settings > Metafields and metaobjects)

**Lưu ý:** Mặc định, values cho custom metafields **không accessible** cho custom storefronts trừ khi bật Storefront API access khi tạo definition. Option "Smart collections" chỉ khả dụng cho product và variant metafields.

**Docs:** [Creating custom metafield definitions](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/creating-custom-metafield-definitions)

---

## More pinned metafields (50)

Nâng giới hạn pin metafield definitions lên **tối đa 50 per store section**.

**Cách pin/unpin:**
1. Trong lúc tạo hoặc edit definition
2. Từ Metafield definitions page dùng icon pin/unpin

**Nơi hiển thị pinned metafields:**
- Pinned definitions hiển thị **đầu danh sách** trên Metafield definitions page
- Tự động hiển thị trên corresponding pages trong Shopify admin (product detail, customer detail...)
- Trên POS: tối đa **20 pinned customer metafields** hiển thị trên POS customer details screen
- Metafields không pin vẫn truy cập được qua "View all"

**Thứ tự:** Thứ tự pin quyết định thứ tự hiển thị trên admin pages. Có thể sắp xếp lại.

**Docs:** [Pinning metafield definitions](https://help.shopify.com/en/manual/custom-data/metafields/pinning-metafield-definitions)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin
