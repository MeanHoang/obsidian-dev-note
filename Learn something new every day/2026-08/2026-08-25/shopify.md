# 🛒 Shopify — 2026-08-25

> Tin lớn nhất: Script tags chính thức bị khai tử (ngừng chạy 01/03/2027) — cộng thêm loạt siết chặt App Store requirements về review và tên app, và deprecation delivery profile APIs.

## ⭐ [Script tags bị deprecate, ngừng chạy từ 01/03/2027](https://shopify.dev/changelog/online-store-script-tags-deprecation) — (shopify.dev/changelog, 24/08/2026)
**Đây là gì:** Script tag là cơ chế cũ cho phép app inject file JavaScript vào storefront của merchant qua Admin API (`scriptTagCreate`/`scriptTagUpdate`, resource `ScriptTag` bên REST). Shopify nay khai tử hoàn toàn cơ chế này cho storefront.
**Chi tiết:**
- **01/10/2026**: các operation create và update sẽ fail với user errors. Script tag đã tồn tại vẫn tiếp tục chạy.
- **01/03/2027**: "Shopify will stop injecting script tags into storefronts" — script tag cũ ngừng hoạt động hẳn.
- Ảnh hưởng các app tạo script tag với `display_scope` = `online_store`. Script tag ở order status page có lịch deprecate riêng, sớm hơn.
- Deprecation áp dụng cho **mọi API version, kể cả version cũ** — pin version KHÔNG hoãn được.
- Hai đường thay thế: **app embed blocks** (qua theme app extension, merchant bật trong theme editor) và **web pixels** (cho analytics/conversion tracking, không cần merchant thao tác).
- Operation query và delete vẫn còn để audit/dọn dẹp script tag hiện có.
**Vì sao đáng đọc:** Nếu Joy Loyalty còn dùng script tag để render widget loyalty (launcher, points banner, rewards page) trên storefront thì đây là deadline cứng phải migrate sang theme app extension / app embed block. Mốc 01/10/2026 chỉ còn hơn 1 tháng — sau ngày đó merchant mới cài app sẽ không tạo được script tag nữa, tức là app hỏng với khách mới trước cả khi tới 03/2027.

## [Yêu cầu App Store 1.3: cấm incentivize review](https://shopify.dev/changelog/updated-app-store-requirements-13-always-use-honest-and-transparent-review-practices) — (shopify.dev/changelog, 06/07/2026)
**Đây là gì:** Requirement mới trong App Store Requirements, buộc app phải dùng "review practices" trung thực và minh bạch. Phải dùng Reviews API để thu thập review thật khi có thể, chỉ được xin feedback bằng ngôn ngữ trung lập, cấm mọi hình thức tặng thưởng đổi lấy review (kể cả ngoài app) và cấm thao túng review. Shopify cũng đổi logic đánh giá: chỉ review đạt "trust standards" mới hiển thị công khai, review không đạt bị unpublish (có thể xuất hiện lại nếu đạt chuẩn).
**Vì sao đáng đọc:** Rating trên App Store là kênh acquisition chính của Joy Loyalty; mọi flow in-app kiểu "để lại review nhận thêm credit/mở tính năng" đều phải gỡ ngay — mức phạt liệt kê gồm xoá bớt review, demote/delist app, thậm chí terminate Partner account.

## [Yêu cầu App Store 4.1.2: app phải có tên riêng biệt](https://shopify.dev/changelog/updated-app-store-requirements-4-1-2-use-a-unique-name-for-your-app) — (shopify.dev/changelog, 15/07/2026)
**Đây là gì:** Requirement mới (hiệu lực 15/07/2026) buộc tên app phải phân biệt được, nhằm "reduce merchant confusion over identical and copycat app names". Tên app nên bắt đầu bằng brand identifier riêng của bạn và không được gây nhầm với app/sản phẩm khác. Enforcement triển khai theo từng đợt, dev bị ảnh hưởng sẽ được thông báo và có thời hạn tuân thủ trước khi bị delist.
**Vì sao đáng đọc:** App loyalty là ngách cực đông app trùng tên/trùng keyword ("Loyalty & Rewards", "Points & Referrals"...). Cần rà lại listing name của Joy Loyalty để đảm bảo brand "Joy" đứng trước, tránh rủi ro bị flag trong các đợt enforcement sắp tới.

## [Deprecate merchant-owned delivery profile APIs (market-driven shipping)](https://shopify.dev/changelog/merchant-owned-delivery-profile-apis-are-deprecated-for-market-driven-shipping) — (shopify.dev/changelog, hiệu lực 01/08/2026)
**Đây là gì:** Delivery profile là cấu hình shipping rate của merchant. Shopify chuyển mô hình sang **market-driven shipping** (shipping cấu hình theo từng Market), nên deprecate loạt API GraphQL Admin: `deliveryProfile`, `deliveryProfiles`, `deliveryProfilesCount`, `deliveryProfileLocationGroup(s)`, `deliveryProfileCreate/Update/Remove`. Thay thế bằng Contextual Product Feeds, app-owned delivery profiles, hoặc Markets APIs tuỳ use case.
**Vì sao đáng đọc:** Nếu Joy Loyalty có reward dạng "free shipping" hoặc đọc delivery profile để tính ưu đãi vận chuyển theo tier, các query đó sẽ chết — cần chuyển sang Markets APIs hoặc Shopify Function delivery customization trước khi Shopify tắt hẳn.

## [Shopify Flow: action extension cũ không còn làm workflow chết](https://shopify.dev/changelog/shopify-flow-changes-to-action-extensions-result-in-fewer-breaking-changes) — (shopify.dev/changelog, 08/07/2026)
**Đây là gì:** Shopify Flow là công cụ automation no-code của merchant; app có thể đóng góp "action extension" để merchant gọi trong workflow. Trước đây khi schema config field lệch nhau, workflow validation fail toàn bộ. Nay "workflows that use older versions of an action will continue to execute" và Shopify vẫn gửi request tới endpoint URL đã cấu hình — nghĩa là endpoint của bạn phải tự xử lý payload cũ: field mới thành required nhưng thiếu, field đã bỏ nhưng vẫn còn, v.v. Khuyến nghị: đặt default value, bỏ qua field thừa, hoặc trả error mô tả rõ.
**Vì sao đáng đọc:** Joy Loyalty nếu expose Flow action ("add points", "assign tier") thì trách nhiệm validate schema giờ dồn về phía backend Firebase/Cloud Run của mình — cần thêm defensive parsing cho payload, nếu không merchant sẽ gặp lỗi âm thầm thay vì lỗi validation rõ ràng như trước.

## [Liquid developer preview: tag `{% block %}` và `{% partial %}`](https://shopify.dev/changelog/developer-preview-liquid-block-and-partial-tags) — (shopify.dev/changelog, 21/07/2026)
**Đây là gì:** Hai tag Liquid mới trong developer preview "Liquid July '26". `{% block %}` render trực tiếp một theme block tái sử dụng từ template, có named input và body content (tương tự `{% render %}`). `{% partial %}` định nghĩa một vùng HTML server-rendered có tên, mà JavaScript có thể refresh lại **không cần reload cả trang**. Kèm Theme Check 3.28.0 với rule mới bắt syntax error, file quá lớn, schema lệch. Theme hiện có vẫn chạy bình thường (sections, theme settings, JSON templates).
**Vì sao đáng đọc:** `{% partial %}` mở đường cho widget loyalty (số điểm, tier hiện tại, rewards khả dụng) render server-side rồi refresh cục bộ sau khi user earn/redeem — nhẹ hơn nhiều so với bundle JS hiện tại, và hợp hướng đi khi script tag bị khai tử.

## [Partners phải xác minh danh tính để gửi collaborator request](https://shopify.dev/changelog/identity-verification-for-partners) — (shopify.dev/changelog, 09/07/2026)
**Đây là gì:** Biện pháp bảo mật mới: mọi user trong Partner organization muốn gửi **collaborator request** mới tới store của merchant đều phải xác minh danh tính qua Stripe — nộp ID do chính phủ cấp + selfie/liveness check. Truy cập store đã được merchant cấp quyền từ trước thì không cần. Ra mắt 09/07/2026 dạng tuỳ chọn, sẽ thành bắt buộc "trong vài tuần tới"; sau đó user chưa verify không gửi được collaborator request mới.
**Vì sao đáng đọc:** Team support/dev của Joy Loyalty thường xin collaborator access để debug store merchant — ai chưa verify sẽ bị chặn ngay khi Shopify bật enforcement, làm nghẽn quy trình hỗ trợ khách. Nên verify trước cho toàn bộ account trong org.
