# Operations - Analytics

Shopify Editions Spring '26 nâng cấp mạnh analytics với **6 cập nhật**: chart types mới, daily insights tự động, annotations, metric targets, multi-metric visualizations, và filter theo metafields.

---

## New data visualizations

Analytics reporting hỗ trợ thêm các chart types nâng cao ngoài line/bar truyền thống:

| Chart type | Số metrics hỗ trợ | Mô tả |
|---|---|---|
| **Scatter plot** | Đúng 2 metrics | Metric 1 trên trục Y, metric 2 trên trục X. Phát hiện correlations và outliers |
| **Bubble chart** | Đúng 3 metrics | 2 metrics trên trục X/Y, metric thứ 3 quyết định kích thước bubble |
| **Radar chart** | Tối đa 4 metrics | Chart hình tròn, mỗi dimension là 1 trục, mỗi metric vẽ thành 1 polygon |
| **Line chart** | Tối đa 4 metrics | Multi-line truyền thống |
| **Bar + Line** | 2 metrics | 1 metric dạng bar, 1 metric dạng line — so sánh volume vs rate |

Multi-metric visualizations hỗ trợ **12 loại metric value**: counts, money totals, percentages, durations, dimensionless scores. Không hỗ trợ: booleans, distribution arrays, IDs, timestamps.

**Docs:** [Visualizations](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/visualizations#multi-metric-visualizations)

---

## Daily insights

Shopify tự động phân tích data và hiển thị **trend quan trọng** trên analytics overview dashboard. Insights chia 3 categories:

- **Sales**: gross/net sales, orders, AOV, returning customer metrics
- **Sessions**: sessions, visitors, conversion rates, cart additions, checkout progression
- **Fulfillments**: orders fulfilled, shipped, delivery speed

Hai loại pattern được detect:
1. **Trending**: metrics tăng/giảm liên tục qua nhiều tuần, hoặc pacing bất thường so với cùng kỳ năm trước
2. **Top performers**: products, regions, hoặc channels mới đạt top-performer status

**Chi tiết hoạt động:**
- Generate **hàng ngày**, hiển thị trong 24 giờ rồi hết hạn
- Tối đa **5 insights/ngày**
- Click "See why" trên bất kỳ insight nào để xem report chi tiết
- **Yêu cầu**: store phải có trung bình **>=10 orders/tuần** trong 6 tháng gần nhất

**Docs:** [Overview dashboard - Insights](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard/using-the-overview-dashboard#insights)

---

## Annotations in charts

Visual markers trên analytics charts giải thích **tại sao metric thay đổi**. Annotations được tạo tự động, merchant **không thể tạo thủ công**.

**Hai nguồn annotations:**

1. **Shopify-generated** — track tự động:
   - Product status changes (published/unpublished)
   - Online store events (theme published, app installed/uninstalled)
   - Platform changes (metric definition updates, data unavailability)

2. **App-generated** — third-party apps tạo annotations cho:
   - Product launches, discontinuations, bundles, pre-orders
   - Marketing campaigns, influencer collaborations
   - Discount và promotional activities
   - Inventory và fulfillment changes
   - Operational milestones, external events

**Yêu cầu cho Shopify-generated annotations:**
- Trung bình **>=10 orders/tuần** trong ít nhất 12 tuần (không cần liên tục) trong 6 tháng qua
- Ít nhất 1 order trong 2 tuần gần nhất

**Hạn chế:**
- Không khả dụng cho multi-store reports
- Không tương thích với cohort analysis
- Không hiển thị trên charts không có time dimension (tables, donut charts)
- Không thể export annotations
- Yêu cầu freeform data exploration method

**Docs:** [Annotations](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/annotations)

---

## Metric targets

Đặt **target** cho metrics chính và theo dõi tiến độ trực quan.

**Cách tạo target:**
1. Vào Analytics page → chọn metric (Gross sales, Orders, Conversion rate...)
2. Nhập target amount (phải >0)
3. Chọn time period (preset hoặc custom, tối đa 2 năm về quá khứ)
4. Tùy chọn: thêm **1 filter per target** để narrow scope theo dimension

**Hiển thị:**
- **Gauge visualization**: progress %, current value vs target, status, days remaining
- **Cumulative view**: đường solid = actual values, đường dashed = required pace (chỉ hoạt động với summable metrics: Total sales, Orders, Sessions)
- Có thể thêm target card lên dashboard

**Hạn chế:** Targets chỉ hỗ trợ **fixed amounts**. Không hỗ trợ growth rates, ratios, pacing.

**Docs:** [Targets](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/targets)

---

## Analytics filtered by metafields

Filter và group analytics reports theo **custom structured data** (metafields).

**Resources hỗ trợ:** Products, Variants, Customers, Orders, Transfers, Locations

**Metafield types tương thích:**
- **Text**: single line, multi-line
- **Reference**: product references
- **Number**: ID, integer, decimal, rating
- **Link**: URL
- **Date and time**: date, date and time
- **Other**: boolean, color
- **Arrays**: lists of single-line text, multi-line text, integers, decimals

**Setup bắt buộc:** Khi tạo metafield definition, phải bật option **"Use in analytics"** thì metafield mới xuất hiện trong filter/dimension menu của reports.

Ví dụ: tạo metafield "Material" cho products → filter report chỉ hiển thị kết quả "organic cotton".

**Docs:** [Filter and edit - Metafields](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/custom-reports/filter-and-edit#metafields)

---

> **Nguồn:** [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) - Section Operations > Admin
