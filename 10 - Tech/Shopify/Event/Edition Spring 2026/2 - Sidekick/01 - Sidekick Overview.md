# Sidekick — Shopify Editions Spring 2026

Sidekick là AI assistant tích hợp sâu vào Shopify admin, giúp merchant thao tác nhanh hơn bằng ngôn ngữ tự nhiên. Trong Editions Spring 2026, Shopify mở rộng đáng kể khả năng của Sidekick: từ tích hợp app bên thứ 3, hỗ trợ multi-task chạy nền, tạo customer bằng mô tả, test automation Flow, cho đến mở rộng ra Apple Watch và mọi màn hình trên mobile app.

Theo docs chính thức, Sidekick là "an AI-enabled commerce assistant in your Shopify admin, to get guidance, generate content, build apps, and complete tasks using everyday language."

---

## Core capabilities

- **Task handling:** phân tích data, quản lý orders, edit products
- **Content creation:** blog posts, product descriptions, images
- **Custom app generation:** tạo app từ mô tả bằng ngôn ngữ tự nhiên (yêu cầu Grow plan trở lên)
- **Third-party app integration:** tích hợp app bên thứ 3 thông qua Sidekick app extensions (tối đa 20 apps/user/store)
- **Personalized responses:** nhớ lịch sử hội thoại để trả lời theo context — "remembers information from your conversations"
- **Reusable skills:** save prompts thành shortcuts để dùng lại — "save them as skills and run them again with a shortcut"

## Cách tương tác

| Phương thức | Desktop | Mobile | Apple Watch |
|---|---|---|---|
| Text chat | Có | Có | Không |
| Voice mode | Có | Có | Có (duy nhất) |
| Screen sharing | Có | Có | Không |

Trên desktop, giữ **Shift + click Sidekick icon** để mở fullscreen mode. Hoặc truy cập trực tiếp qua `admin.shopify.com/sidekick`. Trên mobile, tap maximize icon.

## Sidekick Pulse

Sidekick hoạt động theo 2 chế độ:
1. **Direct chat:** merchant hỏi/yêu cầu trực tiếp
2. **Sidekick Pulse:** hiển thị "proactive recommendation cards in your Home feed" gợi ý next-best actions dựa trên store data. Đang rollout dần.

## Background processing & Multi-task

Sidekick hỗ trợ multi-tasking thực sự:

- **Background processing:** "For longer tasks, Sidekick continues working in the background, even if you close the chat or navigate away, and notifies you when it's ready for review."
- **Multiple chats:** chạy nhiều cuộc hội thoại Sidekick cùng lúc
- **Track progress:** merchant có thể "track its progress from Shopify Home" — hiển thị active tasks và status mà không cần mở chat window

## Follow-up questions

"If Sidekick needs more details to complete your request, then it asks a follow-up question." — đưa ra các lựa chọn dạng multiple choice để merchant chọn nhanh thay vì phải gõ câu trả lời dài.

## Sidekick everywhere (Mobile)

Merchant có thể truy cập Sidekick **trên bất kỳ màn hình nào** trong Shopify mobile app. Sidekick hoạt động theo context của màn hình hiện tại.

- Hiển thị trên Orders, Analytics, Products screens
- iOS users có thể thêm Sidekick làm **lock screen widget**
- Hỗ trợ text, voice, và screen sharing

## Sidekick trên Apple Watch

- Mở Shopify app hoặc tap Sidekick complication trên watch face
- Chỉ hỗ trợ **voice mode**
- "After you ask your question, your answer is spoken aloud, and a text summary is displayed on your watch."
- Nếu có nhiều stores, response dựa trên active store (xác nhận từ complication label)
- Data refresh mỗi **15 phút**
- Có thể bật privacy mode qua Settings > Passcode để ẩn data khi locked

**Giới hạn Apple Watch:** "Sidekick on Apple Watch is designed for quick answers. It can't do the following: Navigate to pages in the Shopify admin, Make changes to your store, such as editing products or updating settings, Generate content or apps, Use screen sharing or type messages."

## Actionable guidance (Home cards)

Mỗi lần mở admin, Sidekick đưa ra gợi ý hành động cụ thể trên Home screen:
1. Thu hút khách hàng (attract customers)
2. Cải thiện conversion (improve conversion)
3. Thúc đẩy mua lại (drive repeat sales)

Home cards là "blocks of information that change regularly to adapt to your business," bao gồm:
- Updates về Shopify features mới
- Lời khuyên sử dụng Shopify hiệu quả
- Data-driven insights về store performance
- Guides cho recommended tasks

**Dismiss:** hover + click X trên desktop, hoặc swipe trên mobile (trừ order task cards). Có thể gửi feedback về lý do dismiss.

**Permanent section:** "Discover more of Shopify" ở cuối feed, không dismiss được.

**Insights section:** tạo daily cho stores trung bình 10+ orders/tuần (6 tháng gần nhất), tối đa 3 insights/ngày, hết hạn sau 24 giờ.

3 loại insights:
1. **Trends over time:** so sánh performance với giai đoạn trước
2. **Streaks:** patterns tích cực/tiêu cực liên tục qua nhiều giai đoạn
3. **Top 5 values:** thay đổi giữa các dimensions hoạt động tốt nhất

Insights bao gồm 3 lĩnh vực:
- **Sales:** revenue, orders, product performance theo product/region/channel/vendor
- **Sessions:** visitor changes, cart additions, checkout sessions, conversion rates theo city/country/device type/landing page
- **Fulfillments:** shipping/delivery efficiency theo carrier/channel/shipping location

## Sidekick creates customers & fills forms

Merchant mô tả customer bằng ngôn ngữ tự nhiên, Sidekick tự động điền form. Fields do Sidekick điền sẽ **highlight màu tím** để dễ review — "Fields that Sidekick updates are highlighted in purple so you can review the changes."

Ngoài customer, Sidekick còn điền được:

| Loại | Chi tiết |
|------|---------|
| Customers | Tạo customer mới và thêm thông tin |
| Products | Tạo/edit products, discounts, collections |
| B2B | "Create new companies with available information" |
| Orders | Edit order: thêm product/custom items, điều chỉnh số lượng, quản lý line item discounts, điều chỉnh custom shipping fees, set edit reasons, control customer notifications |
| General forms | Điền field trên bất kỳ trang admin nào, dùng reference images hoặc direct instructions |

"The order updates only after you review the changes and click **Update order**."

Sidekick còn tạo **guided workflows** cho onboarding và custom task lists cho công việc cụ thể — "guides you through each item" khi tạo products.

## Input features

- Attach hoặc upload files từ admin hoặc device
- **Target mode:** click icon target để chọn phần cụ thể cần Sidekick chỉnh sửa — "select specific admin elements"
- **Mention:** @mention products, orders, customers, collections, hoặc apps
- **Reusable skills:** save prompts thành shortcuts để dùng lại
- **Third-party apps:** tương tác với installed apps thông qua Sidekick app extensions

## Response actions

- Click right arrow icon để navigate đến trang được chỉ định
- Click **"Apply"** để áp dụng generated content vào store

## Feedback

Rate responses với thumbs up/down icons. Có thể thêm chi tiết qua **Add comment** dialog.

## Limitations chung

Sidekick **không thể**:
- Xử lý customer support
- Chia sẻ private merchant data
- Edit images trong themes
- Thay đổi bất kỳ gì mà không có merchant approval
- Hoạt động trên tablet devices

---

## Chi tiết

- [[02 - Sidekick App Extensions]] — cách app tích hợp Sidekick (developer perspective), rất quan trọng với Shopify app dev; bao gồm phân tích Smile đã tích hợp, cơ hội cho Joy Loyalty
- [[03 - Sidekick Admin & Mobile]] — everywhere, Apple Watch, multi-task, follow-up questions, guidance, creates customers
- [[04 - Sidekick-generated Apps]] — tạo/edit app bằng Sidekick, plan requirements, limitations, version history
- [[05 - Sidekick với Shopify Flow]] — automation tests với Sidekick

---

## Nguồn

- [Shopify Editions Spring 2026](https://www.shopify.com/editions/spring2026)
- [Sidekick overview - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/index)
- [Sidekick setup & use - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/set-up)
- [Sidekick forms & guidance - Help doc](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick/help-and-guidance)
- [Shopify Home - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-home)
- [Apple Watch - Help doc](https://help.shopify.com/en/manual/shopify-admin/shopify-app/watch-app)
