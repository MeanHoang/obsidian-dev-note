# 🛒 Shopify — 2026-09-22

> Tuần này Shopify đẩy 2 thay đổi API version 2026-10 đáng chú ý (metafield `translatable`, mutation gửi email thêm payment method), nới giới hạn private plan trong App Pricing, đổi cách đo session trong Analytics, và mở hộp đen quy trình migrate app mobile bằng LLM.

## ⭐ [New translatable boolean field for Metafield GraphQL Object](https://shopify.dev/changelog/is-translatable-metafield-field) — (shopify.dev/changelog, 21/09/2026)
**Đây là gì:** GraphQL Admin API thêm field `translatable: Boolean!` trên object `Metafield` — cho biết giá trị của metafield đó có thể dịch (đa ngôn ngữ) được hay không. Metafield là cơ chế lưu dữ liệu tùy biến gắn vào resource Shopify (product, customer, order...) mà app như Joy dùng rất nhiều.

**Chi tiết:**
- Có hiệu lực từ API version **2026-10**; app đang ở 2026-07 hoặc cũ hơn không bị ảnh hưởng.
- Trước đây muốn biết metafield nào dịch được, app phải query qua `translatableResources` với enum `TranslatableResourceType.METAFIELD` — enum này **đã bị deprecate**.
- Changelog nói rõ: "Apps need to move away from using the `TranslatableResourceType.METAFIELD` enum on `translatableResources` to fetch translatable metafields."
- Cách mới đơn giản hơn: đọc trực tiếp property `translatable` trên từng metafield object, không cần logic tách riêng.
- Enum cũ vẫn còn để backward compatible, nhưng migration path khi lên 2026-10 là: tìm query dùng enum → thay bằng field `translatable` → test trên dev store.

**Vì sao đáng đọc:** Joy Loyalty lưu gần như toàn bộ dữ liệu điểm/tier/referral hiển thị ra storefront qua metafields, và widget phải hỗ trợ đa ngôn ngữ — nên khi bump lên 2026-10, mọi chỗ đang dò metafield dịch được qua `translatableResources` cần đổi sang đọc `translatable`, nếu không logic translation của widget sẽ vỡ âm thầm.

## ⭐ [Helix: The internal tool powering our Shopify app's native migration](https://shopify.engineering/helix) — (shopify.engineering, 21/09/2026)
**Đây là gì:** Bài engineering blog mô tả Helix — tool nội bộ Shopify dùng LLM để viết lại app mobile từ React Native sang native Swift/Kotlin, kèm hệ thống "quality gate" để giữ chất lượng code do AI sinh ra.

**Chi tiết:**
- Helix chia việc migrate thành các đoạn nhỏ review được gọi là **checkpoint**; checkpoint chạy tự động hoặc có engineer giám sát.
- Bài viết mô tả cách tiếp cận: "It breaks the work down, learns from the engineer as it goes, and automates more of the task with every step it gets right."
- 4 gate tuần tự: **Behavior Gate** (test qua CLI, không cần simulator) → **UI Review Gate** (dùng Gemini đọc screenshot, chỉ ra từng điểm khác biệt kèm severity và vị trí trên màn hình) → **Adversarial Code Review** (2 AI agent độc lập đối chiếu code với chuẩn kiến trúc đã ghi tài liệu) → **Engineer Approval** (người xác nhận, feedback quay lại cải thiện checkpoint sau).
- Quy mô: Shopify App có hơn **300 screen**; migration của Shop app hoàn thành trong **12 tuần**.
- Phân vai model: GPT làm orchestration workflow, Gemini lo phần so sánh UI cần nhận biết không gian và chi tiết thị giác.

**Vì sao đáng đọc:** Mô hình "checkpoint nhỏ + gate tự động + engineer approve" là pattern áp dụng được trực tiếp khi Joy Loyalty refactor lớn (ví dụ migrate admin UI sang Polaris mới, hoặc bump API version hàng loạt endpoint) — thay vì để AI viết một cục rồi review không nổi.

## [Unlimited private plans and target stores in Shopify App Pricing](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing) — (shopify.dev/changelog, 21/09/2026)
**Đây là gì:** Private plan là gói giá tùy biến chỉ mở cho một số merchant cụ thể trong hệ thống Shopify App Pricing. Shopify vừa bỏ giới hạn: trước đây tối đa 15 plan/app và 20 target store/plan, giờ **không giới hạn** cả hai.

**Vì sao đáng đọc:** Joy Loyalty thường phải deal giá riêng cho merchant lớn/enterprise; trần 15 plan là nút cổ chai thật sự. Bỏ trần nghĩa là có thể quản lý custom pricing qua Shopify billing thay vì hack ngoài hệ thống. Plan đang có không cần đổi gì; app còn dùng legacy manual pricing thì CLI migration tool (Early Access) cũng đã hỗ trợ.

## [New paymentInstrumentSendAddEmail mutation](https://shopify.dev/changelog/new-paymentinstrumentsendaddemail-mutation) — (shopify.dev/changelog, 03/09/2026)
**Đây là gì:** Mutation GraphQL Admin API mới cho phép gửi email kèm link để **customer tự thêm payment method** vào subscription, order hoặc draft order — không cần thu tiền trước. API version 2026-10, scope `write_customers`.

**Vì sao đáng đọc:** Mutation cũ `customerPaymentMethodSendUpdateEmail` yêu cầu đã có payment method ID nên không dùng được cho lần đầu. Với Joy Loyalty, đây là đường đi sạch cho các flow cần customer bổ sung thẻ (ví dụ reward dạng subscription, draft order từ redeem) mà không phải tự build trang thu thẻ. Lưu ý: payment method customer thêm bị gắn chặt vào resource đã chỉ định — link của contract này không dùng được cho contract khác; lỗi validate trả về trong `userErrors` chứ không phải top-level errors.

## [Shopify Analytics session measurement improvements](https://changelog.shopify.com/posts/shopify-analytics-session-measurement-improvements) — (changelog.shopify.com, 21/09/2026)
**Đây là gì:** Shopify đổi cách đếm session trong Analytics: mặc định lọc theo filter "Human or bot" để chỉ tính khách thật, và phân loại traffic bot/system nhất quán hơn.

**Vì sao đáng đọc:** Các metric dựa trên session (sessions, conversion rate, add-to-cart rate, checkout metrics, bounce rate, pageviews/session, online store visitors, searches) sẽ **thay đổi số** sau 21/09/2026; orders, sales, customer count thì không đổi. Joy Loyalty có báo cáo revenue/conversion đối chiếu với Shopify Analytics — merchant sẽ thắc mắc vì sao số lệch, nên coi mốc 21/09 là baseline mới khi so sánh dữ liệu lịch sử.

## [Hydrogen developer preview update: September 2, 2026](https://shopify.dev/changelog/hydrogen-developer-preview-update-september-2-2026) — (shopify.dev/changelog, 03/09/2026)
**Đây là gì:** Hydrogen là framework React của Shopify để build storefront headless. Bản developer preview cập nhật 3 điểm: variant link giờ mở đúng variant cụ thể thay vì về product mặc định (khớp cách variant submit lên Google Shopping feed); thêm khả năng **refresh cart** sau khi server sửa cart; và Hydrogen tự tạo HTTPS certificate local nên setup login Customer Account chỉ còn một lệnh hoặc không cần lệnh nào.

**Vì sao đáng đọc:** Phần cart refresh là điểm đáng chú ý với Joy Loyalty — khi backend áp discount/redeem điểm làm thay đổi cart phía server, client cần cơ chế reload cart để hiển thị đúng; trước đây đây là nguồn bug kinh điển trên storefront headless.
