# 00 – App theo dõi giá qua Shopify Catalog

> 📖 = nguồn chính thức / tự gọi API. 💭 = nhận định AI. ⚠️ = nguồn phụ / chưa kiểm.
> **Chốt ngày 2026-10-23 (anh chốt).** Đi ra từ [[11 - Hành vi mua qua AI kéo theo gì/00 - Bản đồ hệ quả|Bản đồ hệ quả]], mục "thương hiệu không thấy hàng mình trong kết quả AI".

> 🔁 **MỞ LẠI (2026-10-23, anh quyết làm tiếp).** Trước đó đã dừng vì: Lý do: điều khoản API của Shopify (bản 2026-10-07) cấm thu thập dữ liệu tự động / dựng chỉ mục sản phẩm từ Catalog nếu không có đồng ý bằng văn bản của Shopify (mục 7). Bỏ Catalog thì app trùng ~10 app cào website đang có. Giữ folder làm tài liệu.

**App là gì:** Theo dõi giá các shop khác đang bán **cùng sản phẩm**, **báo cho merchant**, và **giúp đổi giá ngay** (theo luật merchant đặt).

**Kết luận trước:** 💭 Mảng theo dõi giá + đổi giá trên Shopify **đã đông** (~10 app, Prisync 242 review). Khác biệt duy nhất em thấy có căn cứ: **lấy dữ liệu đối thủ từ Shopify Global Catalog** (dữ liệu có cấu trúc, chính là thứ AI mua sắm nhìn thấy) thay vì cào website. Rủi ro lớn nhất chưa kiểm: **điều khoản Catalog có cho dùng vào việc theo dõi giá không**.

## 1. Merchant thấy gì (theo 1 ví dụ)

Shop `dtlrvilla` bán "Crocs Classic Clog" $50.00:
1. App tìm trong Global Catalog các shop cùng bán món này → 📖 thấy shopwss, mainlandskate, shop-escape-outdoors bán **$49.99**, `gz4mtv-ds` bán **$58**.
2. Báo: "3 shop rẻ hơn bạn $0.01; 1 shop mới xuất hiện hôm nay."
3. Merchant đặt luật: "khớp giá thấp nhất nhưng không dưới giá vốn + 20%".
4. App đổi giá variant qua Admin API, ghi lịch sử, báo lại.

## 2. Dữ liệu: đã kiểm

📖 Tự gọi `https://catalog.shopify.com/api/ucp/mcp`, tool `search_catalog`, không cần API key:
- Mỗi kết quả có `seller.domain`, `price` (`amount` tính bằng cent + `currency`), `availability`, `options`, `url`, `rating`.
- `metadata` có `top_features`, `tech_specs`.
- Mỗi dòng 1 người bán; cùng 1 món của nhiều shop là nhiều dòng riêng.
- Chỉ có shop **đủ điều kiện Catalog** (gói trả phí, có doanh số thật…); store dev không có ([[01 - UCP và Shopify Catalog]] mục 2.4).

## 3. Đối thủ trên App Store

⚠️ Theo trang App Store qua kết quả tìm kiếm 2026-10-23, chưa mở từng trang:

| App | Review | Giá từ |
|---|---|---|
| [Prisync AI](https://apps.shopify.com/prisync-ai-dynamic-pricing) | 4.9 / 242 | $49/tháng |
| [Pricefy](https://apps.shopify.com/pricefy-io) | 4.6 / 72 | miễn phí, $49/tháng |
| [PricePulse](https://apps.shopify.com/pricepulse-competitor-spy) | — | miễn phí, $49 |
| [Price Genie](https://apps.shopify.com/price-genie-ai) | — | miễn phí, $39 |
| [PriceSpidey](https://apps.shopify.com/pricespidey) | 1 | miễn phí, $39 |
| [ShopiSync](https://apps.shopify.com/shopisync) | 0 | $29 |
| [Price Patrol](https://apps.shopify.com/price-patrol) | 0 | $19 |
| [Price Comparison Intelligence](https://apps.shopify.com/ests-compare-price) | — | $5.99 (50 sản phẩm) |
| [PriceRest](https://apps.shopify.com/pricerest) | 0 | $49 |
| [Sampo](https://apps.shopify.com/sampo) | — | $299 |

⚠️ Một review của Pricefy: ghép sản phẩm đối thủ "often inaccurate" → chỗ đau thật của cách cào website.

## 4. Khác biệt (💭, cần kiểm)

| Điểm | Đối thủ (cào website) | App này (Catalog) |
|---|---|---|
| Nguồn giá | Cào từng trang đối thủ, dễ vỡ khi đổi giao diện | Dữ liệu có cấu trúc của Shopify |
| Ghép sản phẩm | Tự đoán, hay sai (review Pricefy) | ⚠️ Catalog có tên, option, metadata; chưa kiểm có mã chung (GTIN/UPID) để ghép chắc |
| Tìm đối thủ | Merchant tự nhập link đối thủ | Tự tìm mọi shop Shopify đang bán cùng món |
| Liên quan AI | Không | Giá app thấy = giá AI mua sắm thấy |
| Đối thủ ngoài Shopify (Amazon, Walmart…) | Có | **Không** |

## 5. Rủi ro

1. ⚠️ **Điều khoản Catalog:** Catalog làm cho AI agent mua hàng thay khách. Dùng để theo dõi giá có được phép không: **chưa đọc điều khoản**. Nếu cấm thì hướng này chết.
2. Chỉ thấy shop Shopify; merchant thường cạnh tranh với cả Amazon.
3. Đông đối thủ, giá rẻ ($5.99–$49).
4. Đổi giá tự động sai → mất tiền thật; phải có giới hạn sàn/trần, duyệt tay, nhật ký.
5. Giới hạn gọi API: Catalog theo "trust tier" của agent; Admin API theo throttle của Shopify; merchant không phải Plus.

## 6. Bước tiếp

1. **Đọc điều khoản dùng Catalog / agent profile** (sống còn).
2. Kiểm Catalog có mã chung (GTIN / UPID) để ghép cùng sản phẩm giữa các shop.
3. Đo: 30 sản phẩm phổ biến → bao nhiêu sản phẩm có ≥ 2 shop bán, giá lệch bao nhiêu.
4. Mở trang App Store của Prisync, Pricefy: đọc review 1–3 sao xem họ đau ở đâu.

## 7. Điều khoản API của Shopify (đọc 2026-10-23)

📖 [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms), "Last updated on: October 7, 2026":

> "not use the Shopify API to conduct any systematic or automated data collection activities (including scraping, data mining, data extraction and data harvesting) or to build any commerce or product index"

Không dùng Shopify API để thu thập dữ liệu có hệ thống, tự động (gồm cào, khai thác, trích xuất dữ liệu) hoặc để dựng chỉ mục sản phẩm.

> "not use any information derived from the Shopify API, Merchant Data, any Merchant Store ... to: ... (ii) reproduce substantial portions of a source’s product pages, catalogs or content feeds beyond limited previews used for product discovery ... except with: (a) Shopify's prior written consent, or (b) solely with respect to Merchant Data or a specific Merchant Store, the relevant Merchant's consent."

Không dùng dữ liệu lấy từ Shopify để tái tạo phần lớn trang sản phẩm / catalog / feed của nguồn khác, ngoài bản xem trước giới hạn để **khám phá sản phẩm**, trừ khi có **đồng ý bằng văn bản của Shopify**, hoặc (chỉ với dữ liệu của 1 shop) đồng ý của chính shop đó.

💭 Theo dõi giá đối thủ hằng ngày qua Catalog = thu thập tự động có hệ thống, không phải "product discovery" cho người mua → nhiều khả năng **vi phạm** nếu không có đồng ý bằng văn bản của Shopify. Đây là đọc hiểu của AI, không phải tư vấn pháp lý.

💭 Hệ quả: khác biệt duy nhất của app (dữ liệu Catalog) bị chặn. Bỏ Catalog thì app thành 1 trong ~10 app cào website.
