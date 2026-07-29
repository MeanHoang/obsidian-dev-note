# Operations - Admin UX & Permissions

Editions Spring '26 có **3 cập nhật** liên quan đến trải nghiệm admin và phân quyền.

---

## Filtering and saved views

Giao diện search, filter, và saved views **thống nhất** từ 1 search bar duy nhất across admin.

**Unified search bar:** Consolidate search terms + filters vào **single-line searchbar**, views hiển thị dạng menu.

**Filter logic:**
- **is / is not**: vd `Delivery status is In transit`
- **OR logic**: dùng dấu phẩy, vd `payment-status:Partially paid,Unpaid`
- **AND logic**: dùng dấu cách, vd `payment-status:Unpaid fulfillment-status:Unfulfilled`
- Filters tạo thành **tags trong 1 string** trên search bar — dễ modify/remove

**Saved views:**
- Apply filters → Save → view mới thêm vào view list
- Custom views tự động include newly created items matching filters
- Khả dụng trên **14+ resource pages**: Orders, Products, Discounts, Customers, Collections, Gift Cards...

**Hạn chế:**
- Desktop và mobile đều access được views
- **Quản lý views** (tạo, edit, xoá) chỉ trên desktop
- Docs chưa đề cập khả năng share views giữa team members

**Docs:** [Enhanced search filter](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/searching-filtering-views#enhanced-search-filter)

---

## Visibility for app activity

Theo dõi **app đang làm gì** trong store, tăng transparency cho third-party apps.

**Activity & Permissions tracking:**
- Mỗi app hiển thị section "Activity and permissions" — areas mà app có thể view/edit + ngày activity gần nhất
- Click vào recent activity date → xem số lượng view/edit requests trong **30 ngày qua**
- **Unused access**: permissions mà app chưa dùng trong 30 ngày → hiển thị riêng

**Extensions & Functions visibility:**
- **Extensions**: số lượng active + store areas bị ảnh hưởng (Checkout, Customer accounts, Online Store, POS)
- **Functions**: số lượng active, deployment areas, error warnings
- **Pixels**: connection status, data access settings

**Privacy section:**
- Phân loại personal data mà app access: Customers, Staff...
- Liệt kê sensitive data + device/activity data
- Link trực tiếp tới developer's privacy policy

**Function log sharing:** Chia sẻ **Function activity log 24 giờ gần nhất** với developer để troubleshooting (lưu ý: logs có thể chứa sensitive customer info).

**Lưu ý:** Shopify-made apps hiện **chưa được track** cho activity monitoring.

**Docs:** [Managing apps](https://help.shopify.com/en/manual/apps/managing-apps)

---

## Staff payments permissions

Phân quyền granular cho staff quản lý **payments, payouts, disputes**.

**Permissions liên quan payments:**

| Section | Permissions |
|---|---|
| **Orders** | Charge credit card, Charge vaulted card, Record payments, Capture payments, Refund to original payment method, Refund to store credit |
| **Draft Orders** | Set payment terms, Charge credit card, Charge vaulted card, Mark as paid |
| **Finance** | View Shopify Payments payouts, Manage other payment settings |

**Cách assign:** Gán trong Store role category khi tạo hoặc edit roles.

**Granularity:** Permissions hoạt động ở **store level** — không restrict từng transaction cụ thể. Nhưng có tách riêng: credit card vs vaulted card, capturing vs refunding.

**Dependencies tự động:** Khi chọn 1 permission, các permissions liên quan có thể tự động được chọn. Ví dụ: dispute management tự động chọn Orders > View.

**Docs:** [Store permissions](https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin
