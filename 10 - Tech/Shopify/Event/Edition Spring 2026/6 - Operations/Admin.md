# Operations - Admin

Shopify Editions Spring '26 mang đến **20 cập nhật** trong nhóm Admin thuộc mục Operations, tập trung vào 3 mảng chính: nâng cấp analytics (visualizations, insights, annotations, targets), mở rộng khả năng metafields, và cải thiện workflow tự động hóa với Shopify Flow.

---

## New data visualizations in analytics

Analytics reporting giờ hỗ trợ thêm các loại chart nâng cao ngoài line/bar truyền thống: **scatter plots, radar charts, bubble charts, sunburst visualizations**. Giúp merchant phân tích dữ liệu store ở nhiều góc nhìn đa chiều hơn.

**Docs:** [Read article](https://www.shopify.com/blog/new-ways-to-see-your-data)

---

## Daily insights

Shopify tự động phân tích data và hiển thị những **trend quan trọng nhất** trực tiếp trên analytics overview dashboard. Merchant không cần tự đào bới report mà được gợi ý insight hàng ngày.

**Docs:** [Help doc](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard/using-the-overview-dashboard#insights)

---

## Annotations in charts

Visual markers (đánh dấu) trên analytics charts giải thích **tại sao metric thay đổi**. Ví dụ: một đợt sale, campaign mới, hay sự kiện nào đó được gắn annotation để nhìn chart là hiểu ngay nguyên nhân biến động.

**Docs:** [Help doc](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/annotations)

---

## Metric targets

Cho phép **đặt target** (mục tiêu) cho các metric chính và theo dõi tiến độ trực quan trên chart. Merchant set goal rồi nhìn thấy luôn đang đạt bao nhiêu phần trăm so với target.

**Docs:** [Help doc](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/targets)

---

## Multi-metric visualizations

Vẽ **nhiều metric cùng lúc** trên 1 chart (line hoặc bar + line) để phát hiện pattern, tương quan giữa các chỉ số. Ví dụ: plot revenue cùng sessions trên 1 biểu đồ để thấy conversion trend.

**Docs:** [Help doc](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/visualizations#multi-metric-visualizations)

---

## Analytics filtered by metafields

Filter và group analytics reports theo **custom structured data** (metafields). Nghĩa là nếu merchant có metafield "product_type_custom" hay "supplier", có thể dùng chúng làm dimension trong report.

**Docs:** [Help doc](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/filter-and-edit#metafields)

---

## Metafields in context of workflows

Tạo metafield definitions trực tiếp từ trang customers, orders, collections **mà không cần navigate sang Settings**. Giảm context-switching khi đang làm việc với data.

**Docs:** [Help doc](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/creating-custom-metafield-definitions)

---

## More pinned metafields (50)

Nâng giới hạn pin metafields lên **tối đa 50** trên các section product, customer, order. Metafield được pin sẽ hiển thị ngay trên trang chi tiết, không cần click vào trang riêng.

**Docs:** [Help doc](https://help.shopify.com/en/manual/custom-data/metafields/pinning-metafield-definitions)

---

## Discounts on refund page

Áp dụng discount **trực tiếp trên refund page** trong khi vẫn giữ chính xác sales và tax financials. Trước đây muốn adjust refund amount phải workaround, giờ có luôn option discount.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/refunding-orders#refund-an-entire-order)

---

## Consistent calculations across returns and upsells

Pricing logic trên returns và upsells giờ **dùng cùng logic với checkout**, không còn discrepancies (chênh lệch) giữa giá lúc mua, lúc return, lúc upsell. Đảm bảo tính nhất quán tài chính.

---

## Visibility for app activity

Theo dõi **app đang làm gì** trong store: extensions và functions chạy ở đâu, access data gì. Tăng transparency để merchant kiểm soát third-party apps tốt hơn.

**Docs:** [Help doc](https://help.shopify.com/en/manual/apps/managing-apps)

---

## Staff payments permissions

Phân quyền granular cho staff quản lý **payments, payouts, disputes**. Merchant có thể delegate từng phần payment management cho nhân viên cụ thể mà không cần cho full access.

**Docs:** [Help doc](https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions)

---

## Custom pricing on draft orders

Override giá từng line item và áp dụng **custom discounts trực tiếp** trên draft orders. Hữu ích cho B2B, wholesale, hoặc khi cần báo giá đặc biệt cho khách hàng cụ thể.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders/create-draft#set-custom-line-item-prices)

---

## Filtering and saved views

Giao diện search, filter, và **saved views thống nhất** từ 1 search bar duy nhất across các section trong admin. Merchant tạo bộ lọc phức tạp rồi save lại để dùng lại nhanh.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/searching-filtering-views#enhanced-search-filter)

---

## Category-specific return reasons

Return reasons giờ được **match theo loại sản phẩm** khách mua. Dù return online hay in-store, lý do trả hàng sẽ phù hợp với category sản phẩm, giúp merchant có data chất lượng hơn để phân tích.

**Docs:** [Help doc](https://help.shopify.com/en/manual/fulfillment/managing-orders/returns/creating-returns#create-a-return)

---

## Code editor in Shopify Flow

Editor cho Liquid variables trong Flow được nâng cấp với **syntax highlighting, autocomplete, formatting**. Developer viết code trong Flow nhanh hơn, ít lỗi hơn.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shopify-flow/getting-started/concepts/variables)

---

## Automatic shipping label purchasing

Tạo rules trong Shopify Flow để **tự động mua shipping labels** khi specific triggers xảy ra. Ví dụ: order từ region A tự động mua label carrier X.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shopify-flow/reference/actions/purchase-shipping-label)

---

## Version history (Flow)

Xem **ai đã update workflow** và **khi nào** để track changes trong Shopify Flow. Quan trọng cho team lớn cùng quản lý automations.

**Docs:** [Help doc](https://help.shopify.com/manual/shopify-flow/manage/version-history)

---

## Workflow notes

Thêm **notes/ghi chú** vào bất kỳ workflow nào trong Shopify Flow để collaborators hiểu logic. Inline documentation giúp onboarding team member mới dễ hơn.

**Docs:** [Help doc](https://help.shopify.com/manual/shopify-flow/manage/manage#add-note)

---

## ShopifyQL + Admin API fields in automations

Truy cập **analytics data (ShopifyQL)** và thêm **Admin API fields** trong Shopify Flow automations mà không cần viết code. Mở rộng đáng kể khả năng data-driven automation.

**Docs:** [Help doc](https://help.shopify.com/en/manual/shopify-flow/reference/actions)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin
