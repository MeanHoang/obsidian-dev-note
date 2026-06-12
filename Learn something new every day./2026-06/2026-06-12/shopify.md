# 🛒 Shopify — 2026-06-12

> Tin nóng nhất: Shopify ra **AI Toolkit** để auto-migrate checkout/customer account UI extensions sang Polaris web components — kèm deadline cứng **01/10/2026**, app nào còn extension ở API ≤ 2025-07 sẽ bị CLI chặn update.

## ⭐ [Shopify AI Toolkit cho việc upgrade extensions sang Polaris web components](https://shopify.dev/changelog/shopify-ai-toolkit-for-upgrading-extensions-to-polaris-web-components) — (shopify.dev/changelog, 11/06/2026)
**Đây là gì:** Shopify AI Toolkit là bộ tool thiết kế để chạy cùng AI coding agent (Claude Code, Cursor...), tự động hóa việc nâng cấp checkout và customer account UI extensions lên API version mới + Polaris web components — thay vì migrate tay từng component. Polaris web components là thế hệ UI component mới (web components chuẩn, thay cho React components cũ), mặc định từ API 2025-10.
**Chi tiết:**
- **Deadline cứng 01/10/2026:** app nào còn checkout/customer account UI extensions trên API version **2025-07 trở về trước** sẽ **không thể update app** nữa — Shopify CLI sẽ chặn khi deploy.
- API version **2025-10 trở lên** dùng Polaris web components mặc định (kèm đó là kiến trúc Preact + giới hạn bundle, truy cập API qua global `shopify` object thay vì callback param).
- Cách dùng: cài Shopify AI Toolkit rồi chạy migration skill trong AI agent; Shopify cung cấp 2 tài liệu migration riêng — một cho checkout, một cho customer accounts.
- Đi kèm là bộ [migration guide chi tiết hơn 60 trang theo từng component](https://shopify.dev/changelog/polaris-web-components-migration-guides-now-available-for-checkout-and-customer-account-ui-extensions) (Button, Checkbox, TextField, Banner, View...).
- Lợi ích sau migrate: rendering nhanh hơn, bỏ được công migrate thủ công lặp đi lặp lại.
**Vì sao đáng đọc:** Joy Loyalty có checkout/customer account extensions (hiển thị điểm, redeem reward tại checkout) — cần audit ngay extension đang ở API version nào; nếu ≤ 2025-07 thì còn chưa đầy 4 tháng trước khi bị khóa update, và AI Toolkit là đường migrate nhanh nhất.

## [Function run log giờ tự động hiển thị trong Dev Dashboard theo access scopes](https://shopify.dev/changelog/function-run-log-details-are-now-automatically-visible-with-the-right-access-scopes) — (shopify.dev/changelog, đăng 13/05, hiệu lực 29/05/2026)
**Đây là gì:** Trước đây muốn xem function run log trên store của merchant, dev phải nhờ merchant share log thủ công. Giờ log tự động hiện trong Dev Dashboard nếu app có đủ access scopes — scope cần thiết được Shopify suy ra từ các field mà input query của Function đọc.
**Vì sao đáng đọc:** Joy Loyalty dùng Functions cho discount/reward — debug production không cần phiền merchant nữa; nên rà lại scopes app đang request (hoặc dùng optional scopes cho mục đích debug tạm thời) để mở khóa log; mở run bị thiếu quyền thì Dashboard liệt kê luôn scope còn thiếu.

## [Inventory transfer webhooks có thêm origin & destination location ID](https://shopify.dev/changelog/inventory-transfer-webhooks-include-origin-and-destination-location-ids-and-mutation-documentation-clarified) — (shopify.dev/changelog, 05/06/2026)
**Đây là gì:** 6 webhook topic của inventory transfer (`add_items`, `update_item_quantities`, `remove_items`, `ready_to_ship`, `cancel`, `complete`) ở API 2026-07 giờ kèm `origin.id` và `destination.id` (Location GID dạng `gid://shopify/Location/123`) ngay trong payload — biết hàng đi từ đâu đến đâu mà không cần gọi thêm API. Docs của `inventoryTransferSetItems`/`inventoryTransferRemoveItems` cũng được làm rõ + error message mô tả kỹ hơn.
**Vì sao đáng đọc:** Ít chạm trực tiếp loyalty, nhưng là pattern đáng học: Shopify đang làm giàu webhook payload để giảm round-trip API — đỡ tốn rate limit khi xử lý webhook.

## [DotDev 2026 — sự kiện developer chính thức của Shopify tại Toronto, 21–22/07](https://dotdev.shopify.com/) — (dotdev.shopify.com)
**Đây là gì:** Sự kiện 2 ngày chính thức của Shopify dành riêng cho dev và agency build trên Shopify: workshop, product demo, technical session + networking. Vé yêu cầu Shopify partner account (tối đa 6 vé/tổ chức), hiện đã **sold out** nhưng còn waitlist.
**Vì sao đáng đọc:** Đây thường là nơi Shopify hé lộ roadmap dev platform (sát kỳ Editions); chi tiết thú vị: attendee được opt-in một **MCP server** để khám phá session và kết nối với người tham dự qua AI tool như Claude — Shopify đang ăn nằm với MCP cả ở event.
