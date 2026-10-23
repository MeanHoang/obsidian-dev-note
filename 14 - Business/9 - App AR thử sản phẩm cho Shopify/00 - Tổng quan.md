# 00 – Tổng quan: App AR thử sản phẩm cho Shopify

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.
> Ngày nghiên cứu: 2026-10-23. Nguồn ở bảng cuối note.

## Hướng đã chốt (2026-10-23)

**Tự xây trang AR "đặt đồ trong phòng" cho đồ nội thất, có thanh bên để đổi variant ngay trong cảnh (kiểu Amazon "View in Your Room"), rồi thêm đúng variant đang xem vào giỏ. Khách không rời trang sản phẩm, không cài app.**

Vì sao chọn hướng này:
1. 📖 Nút AR có sẵn của Shopify mở AR Quick Look (iOS) / Scene Viewer (Android). Đó là app hệ thống, chỉ hiện 1 file 3D, không chèn giao diện riêng được. Muốn thử variant khác, khách phải thoát ra, chọn lại, mở lại.
2. 📖 "Ảnh → 3D" đã có app làm (AI 3D Model Generator miễn phí, 3Dify $9.99) và Shopify có demo quét 3D. Không đặt cược vào khâu làm file 3D. Xem [[9 - App AR thử sản phẩm cho Shopify/05 - Shopify tự làm AR tới đâu|05]].
3. 💭 Đổi variant trong cảnh + nhiều món cùng lúc là thứ nút AR của Shopify không làm được, và đúng là cái Amazon làm trong app của họ.

4. 📖 Shopify đang đưa việc mua sắm sang AI (UCP, ChatGPT, Gemini, Copilot) — xem [[9 - App AR thử sản phẩm cho Shopify/07 - Shopify và thế giới đang đi về đâu|07]]. → Chốt thêm (2026-10-23): **tài sản lõi là bộ dữ liệu 3D đúng kích thước gắn với variant**, dùng cho AR hôm nay, AI agent và kính sau này. Kế hoạch: [[9 - App AR thử sản phẩm cho Shopify/08 - Kế hoạch phát triển|08]].

Kế hoạch và stack: [[9 - App AR thử sản phẩm cho Shopify/03 - Phương án MVP và đề xuất|03]], [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06]].

> Kết luận cũ (trước khi chốt, giữ để đối chiếu): làm app biến ảnh + số đo thành 3D đúng tỉ lệ, đẩy vào product media gốc. Bỏ vì khâu này đã có app làm và Shopify đang làm quét 3D.

| Note | Nội dung |
|---|---|
| [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan\|00 - Tổng quan]] | Đề bài gốc + kết luận |
| [[9 - App AR thử sản phẩm cho Shopify/01 - Đối thủ và thị trường\|01 - Đối thủ và thị trường]] | App đang có trên Shopify App Store, giá, review |
| [[9 - App AR thử sản phẩm cho Shopify/02 - Kỹ thuật làm được gì hôm nay\|02 - Kỹ thuật làm được gì hôm nay]] | Shopify hỗ trợ sẵn gì, WebAR trên iOS/Android, try-on quần áo |
| [[9 - App AR thử sản phẩm cho Shopify/03 - Phương án MVP và đề xuất\|03 - Phương án MVP và đề xuất]] | Hướng đã chốt, phạm vi MVP, lộ trình |
| [[9 - App AR thử sản phẩm cho Shopify/04 - Rủi ro và kế hoạch kiểm chứng\|04 - Rủi ro và kế hoạch kiểm chứng]] | Lý do có thể thất bại, cách kiểm chứng trong 2 tuần |
| [[9 - App AR thử sản phẩm cho Shopify/05 - Shopify tự làm AR tới đâu\|05 - Shopify tự làm AR tới đâu]] | Shopify làm AR từ 2018 tới giờ, chưa làm gì, app ảnh → 3D mới |
| [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ\|06 - Stack công nghệ]] | Stack đã chọn, lý do, phương án bỏ |
| [[9 - App AR thử sản phẩm cho Shopify/07 - Shopify và thế giới đang đi về đâu\|07 - Shopify và thế giới đang đi về đâu]] | AI mua hộ (UCP), kính thông minh, chuẩn 3D, thư viện đang đi về đâu |
| [[9 - App AR thử sản phẩm cho Shopify/08 - Kế hoạch phát triển\|08 - Kế hoạch phát triển]] | 7 bước, luật dừng, việc anh cần chuẩn bị |

---

## 1. Ý tưởng, nói gọn

- Khách mở trang sản phẩm trên điện thoại → bấm "Thử trong phòng tôi" / "Thử lên người" → camera bật → thấy sản phẩm trong phòng hoặc trên người → quay lại trang, thêm vào giỏ.
- Phủ nhiều loại hàng: nội thất, quần áo, phụ kiện (kính, mũ, trang sức, túi, giày).
- Không bắt khách cài app riêng. Tầm xa: kính AR, thiết bị MR/VR.
- Ràng buộc: 1 dev full-stack JS làm một mình, chi phí thấp lúc kiểm chứng, không tự viết mô hình thị giác máy.

## 2. Bốn điều tìm ra (chi tiết ở các note con)

1. 📖 Shopify **đã có sẵn** 3D + AR: nhận file `GLB`/`USDZ` tới 500 MB, tự đổi qua lại 2 định dạng, tự mở AR Quick Look (iOS) và Scene Viewer (Android). → Làm "viewer" không có giá trị riêng. Xem [[9 - App AR thử sản phẩm cho Shopify/02 - Kỹ thuật làm được gì hôm nay|02 - Kỹ thuật làm được gì hôm nay]].
2. 📖 Thị trường **đông app nhưng ít app có khách thật**: nhiều app ra 2025–2026 với 0 review (RoomRefresh, Viewly). App có review nhiều nhất em tìm được là Camweara (64 review) và GenLook (39 review). Xem [[9 - App AR thử sản phẩm cho Shopify/01 - Đối thủ và thị trường|01 - Đối thủ và thị trường]].
3. 📖 Chi phí làm mô hình 3D qua chuyên gia Shopify từng **từ $100/mẫu**, cần ảnh mọi góc + đo kích thước chi tiết. → Chỗ tắc là file 3D, không phải viewer.
4. ⚠️ Con số "3D/AR tăng chuyển đổi 94%" lan khắp các blog **không tìm được nghiên cứu gốc** của Shopify. Không dùng số này để thuyết phục ai.

## 3. Ba loại trải nghiệm khác nhau hoàn toàn về kỹ thuật

| Loại | Công nghệ cần | Làm hôm nay được không |
|---|---|---|
| Đặt đồ trong phòng (nội thất, decor) | File 3D đúng kích thước + AR Quick Look / Scene Viewer | 📖 Được, Shopify có sẵn. Khó ở file 3D |
| Đeo lên mặt/tay (kính, trang sức, đồng hồ) | Theo dõi khuôn mặt/bàn tay trong trình duyệt | 💭 Được, nhưng mỗi loại một kỹ thuật; đối thủ đã có (Camweara, TouchTry) |
| Mặc quần áo | AI tạo ảnh (khách gửi ảnh → ảnh mặc đồ), không phải AR thời gian thực | 📖 Được dạng ảnh tĩnh (GenLook). 💭 Không cho biết vừa size thật |

💭 Ba loại này chỉ dùng chung được: nút trên trang sản phẩm (theme app extension), dữ liệu sản phẩm/variant, thêm giỏ, thống kê. Phần lõi thì tách hẳn.

---

## Đề bài gốc (anh dán ngày 2026-10-23)

<details>
<summary>Project Research: Universal AR Shopping App for Shopify (bản tiếng Anh nguyên văn)</summary>

### 1. Product Vision
I want to explore building a Shopify app that enables customers to try products in their real environment directly from a merchant's online storefront, using their smartphone camera.

The long-term vision is to make online shopping more immersive and intuitive, with a potential future extension to AR glasses and mixed-reality (MR/VR) devices.

The core principle is: **Help customers see how a product would look, fit, and exist in their real world before buying it.**

This should be a practical e-commerce product that solves current customer and merchant problems, not a speculative VR-only product.

### 2. Target Experiences
- **Furniture and home decor:** Place products in a real room, visualize scale, position, and spatial relationships.
- **Clothing:** Preview garments on a customer's body using virtual try-on technology.
- **Accessories:** Preview glasses, hats, jewelry, bags, shoes, and other wearable products.
- **Other physical products:** Evaluate which additional categories can benefit from camera-based visualization.

Do not assume all categories can share the same technical implementation. Identify which capabilities can be shared and which require category-specific technology.

### 3. Customer Journey
1. A customer opens a product page on a Shopify storefront using a smartphone.
2. The customer taps a button such as "Try in my space" or "Try it on".
3. The browser requests camera access and launches the appropriate AR or virtual try-on experience.
4. The customer previews the product in their real environment or on their body.
5. Where technically supported, the customer can move, rotate, resize, switch variants, or compare multiple products.
6. The customer returns to the product page and adds the selected variant to the Shopify cart.

The experience should remain within the merchant's storefront whenever technically feasible, without requiring customers to install a separate app.

### 4. Research Objectives
Market and competitors (Shopify apps for AR, try-on, WebAR, 3D viewers, room visualization; multi-category vs category-specific; pricing, onboarding, assets, devices, limits; complaints; underserved problem). Technical feasibility (WebAR, 3D formats, image-based reconstruction vs merchant models, body tracking and try-on limits, iOS Safari / Android Chrome, multiple objects per scene, performance, cost, privacy, Shopify data / theme app extensions / cart, browser vs native). Distinguish: feasible today / feasible with limits / future.

### 5. Product Strategy
A. Universal AR platform. B. Shared platform, separate spatial and wearable experiences. C. Focused MVP for one category with reusable architecture. Compare on pain, competition, complexity, cost, onboarding, monetization, defensibility. Find the smallest valuable problem solvable today.

### 6. MVP Constraints
Individual full-stack JS/TS dev experienced with Shopify. Prefer Shopify-native, existing AR/3D services, low-cost infra, narrow measurable MVP, reusable data for future spatial interfaces. Do not assume production-quality 3D or clothing simulation from ordinary photos without extra tech, data and cost.

### 7. Expected Deliverables
Concept summary; competitor table with sources; pain points with evidence; 3–5 MVP opportunities; prioritized recommendation; architecture and stack; merchant data/asset requirements; MVP scope, non-goals, roadmap; complexity and recurring costs; validation plan with success criteria; risks. Separate verified facts, inferences, hypotheses. Do not start coding.

</details>

---

## Nguồn

| # | Nguồn | Dùng ở |
|---|---|---|
| 1 | [Shopify Help – Product media types](https://help.shopify.com/en/manual/products/product-media/product-media-types) | 02 |
| 2 | [Shopify.dev – Support product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media) | 02 |
| 3 | [Camweara Virtual Try On – App Store](https://apps.shopify.com/camweara) | 01 |
| 4 | [GenLook – App Store](https://apps.shopify.com/genlook-virtual-try-on) | 01 |
| 5 | [RoomRefresh AR – App Store](https://apps.shopify.com/room-refresh) | 01 |
| 6 | [Viewly – App Store](https://apps.shopify.com/viewly3d) | 01 |
| 7 | [Slash AR Virtual Try-On – App Store](https://apps.shopify.com/slash-ar-virtual-try-on) | 01 |
| 8 | [AI Virtual Try-On by SIT – App Store](https://apps.shopify.com/ai-virtual-try-on-by-sit) | 01 |
| 9 | [TouchTry Eye Fit – App Store](https://apps.shopify.com/eye-fit) | 01 |
| 10 | [YouCam Virtual Try-On – Perfect Corp](https://www.perfectcorp.com/business/plan/shopify) | 01 |
| 11 | [Try at Home: 3D & AR Viewer – App Store](https://apps.shopify.com/evinde-dene-ar-urun-deneme) | 01 |
| 12 | [Touchtry RoomFit – pickyourapp](https://pickyourapp.com/de/products/touchtryroomfit) | 01 |
| 13 | [LEVAR – AppNavigator](https://appnavigator.io/app/levar-final/) | 01 |
| 14 | [Ottawa Business Journal – Shopify AR](https://obj.ca/with-new-ios-ottawas-shopify-leans-into-augmented-reality-commerce/) | 00, 03 |
| 15 | [Cleverence – Creating 3D models for merchants](https://www.cleverence.com/articles/shopify-us-documentation/creating-3d-models-for-merchants-4827/) | 00, 03 |
| 16 | [Meshy API pricing](https://docs.meshy.ai/en/api/pricing) | 03 |
| 17 | [AR Insider – Data dive (2021)](https://arinsider.co/2021/01/18/data-dive-how-is-ar-boosting-ecommerce/) | 00 (số 94%) |
| 18 | [VR.org – WebXR Interop 2026 (17/06/2026)](https://vr.org/articles/webxr-interop-2026-cross-browser-standard) | 02 |
| 19 | [Heroes of Ecommerce – "total gamechanger"](https://heroesofecommerce.substack.com/p/total-gamechanger) | 04 |
