# 07 – Shopify và thế giới đang đi về đâu

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Dùng để chọn hướng cho [[9 - App AR thử sản phẩm cho Shopify/06 - Stack công nghệ|06 - Stack công nghệ]]. Bản đầy đủ về Shopify: [[Shopify - Hướng đi và mục tiêu 2026]].

> 📖 = trích nguồn chính thức đã mở. 💭 = nhận định AI. ⚠️ = nguồn phụ / chưa kiểm.
> Ngày nghiên cứu: 2026-10-23.

**Kết luận trước:** 📖 Hướng lớn nhất của Shopify năm 2026 là **"agentic commerce": khách mua qua AI (ChatGPT, Gemini, Copilot) chứ không nhất thiết vào trang sản phẩm.** 📖 Cả 2 thông báo lớn của Shopify **không nhắc gì tới 3D/AR**. Kính thông minh đang lên nhưng phần lớn là kính AI (camera + giọng nói), chưa phải kính đặt đồ 3D. 📖 Chuẩn 3D đang hội tụ về glTF + OpenUSD, thêm Gaussian Splatting (3D chụp từ ảnh thật). 💭 Hệ quả: app không nên chỉ là "nút AR trên trang sản phẩm"; giá trị lâu dài là **bộ dữ liệu 3D đúng cỡ theo chuẩn, gắn với variant, mà AI và kính đều dùng được**.

## 1. Shopify: thương mại qua AI (agentic commerce)

📖 [Shopify News, 2026-01-11](https://www.shopify.com/news/ai-commerce-at-scale):
> "AI is the next great platform shift in commerce."

AI là cú chuyển nền tảng lớn tiếp theo của thương mại.

> "Any surface that can hold a conversation, make a plan, and take actions becomes commerce-capable."

Bất cứ chỗ nào trò chuyện được, lập kế hoạch được, hành động được đều thành chỗ bán hàng.

- Shopify ra **Universal Commerce Protocol (UCP)**, chuẩn mở làm cùng Google, để AI agent mua hàng của merchant. "already endorsed by 20+ retailers and platforms".
- Merchant bán thẳng trong Google AI Mode, Gemini, Microsoft Copilot, ChatGPT.
- **Agentic Storefronts:** "Merchants set up their data once ... that data is surfaced everywhere." (merchant nhập dữ liệu 1 lần, hiện ở mọi nơi).

📖 [Shopify News – Spring '26 Edition (dev), 2026-06-17](https://www.shopify.com/news/spring-26-edition-dev):
- "Catalog API is UCP's discovery layer." Biến sản phẩm thành "structured, queryable data across AI surfaces" (dữ liệu có cấu trúc, AI hỏi được).
- "Richer metadata like size, color, and delivery estimates gives agents more context" (kích thước, màu… giúp AI trình bày sản phẩm đúng hơn).
- "ChatGPT, Copilot, and the Shop App are the most visible surfaces today."
- Có **Sidekick App Extensions**: app hiện dữ liệu và hành động ngay trong hội thoại của merchant với Sidekick.
- 3D, AR, media, không gian (spatial): **không nhắc**. Gần nhất là "Image search returns visually similar products across Catalog".

⚠️ Nguồn phụ: Agentic Storefronts bật mặc định cho merchant Mỹ đủ điều kiện từ 2026-03-24 ([digitalapplied](https://www.digitalapplied.com/blog/shopify-spring-2026-edition-agentic-commerce-ucp-catalog)).

## 2. Kính thông minh và thiết bị XR

⚠️ Toàn nguồn phụ:

| Thiết bị | Có màn hình trong kính | Tình trạng |
|---|---|---|
| Meta (Ray-Ban, Oakley, Ray-Ban Display) | Chỉ Ray-Ban Display ($799) | Meta chiếm 69,2% thị trường quý 1 (IDC, qua [Tom's Guide](https://www.tomsguide.com/computing/vr-ar/best-smart-glasses)) |
| Samsung/Google Android XR | Đợt đầu không màn hình | Ra mắt khoảng 11/2026 |
| XREAL (Android XR) | Có | $1.279 |
| Samsung Galaxy XR (kính đội đầu) | Có | Bán từ 10/2025 |
| Apple glasses | — | Đồn 2027 |

💭 Kính 2026–2027 chủ yếu là **kính AI**: camera nhìn, AI trả lời. Đặt sofa 3D vào phòng bằng kính còn xa. Nhưng kính AI + agent sẽ cần **dữ liệu sản phẩm chuẩn, có kích thước thật** để trả lời "sofa này có vừa góc này không".

## 3. Chuẩn 3D

📖 [Khronos, 2026-02-03](https://www.khronos.org/news/press/gltf-gaussian-splatting-press-release):
- `KHR_gaussian_splatting` thêm Gaussian Splatting (3D dựng từ ảnh/video thật, trông như ảnh chụp) vào glTF 2.0. Bản "release candidate", dự kiến phê chuẩn quý 2/2026. ⚠️ Nguồn phụ nói đã phê chuẩn 2026-09-03.
- Khronos và AOUSD (nhóm chuẩn OpenUSD của Apple, Pixar, NVIDIA…) "actively coordinating" để glTF và OpenUSD khớp nhau.
- Được nêu cho "e-commerce".

💭 Nghĩa là: **glTF/GLB (web, Android, Shopify) + USDZ/OpenUSD (Apple)** là 2 định dạng sẽ còn sống lâu; Shopify đã tự đổi qua lại giữa 2 định dạng này.

## 4. Hệ quả cho ý tưởng (💭 nhận định)

1. **Trang sản phẩm có thể ít người vào hơn.** Nếu khách mua trong ChatGPT/Gemini, nút AR trên trang sản phẩm bị lướt qua. App cần mở được AR **từ 1 đường link** (có sẵn variant), để AI hoặc tin nhắn dẫn thẳng vào.
2. **Dữ liệu là tài sản, giao diện AR là cách dùng hôm nay.** Bộ "GLB đúng mét + số đo variant + map variant" nên nằm trong dữ liệu chuẩn của Shopify (metafield/metaobject, trường kích thước theo danh mục) để Catalog/AI đọc được sau này. ⚠️ Chưa kiểm Catalog có đọc metafield / trường kích thước nào.
3. **Phía merchant chuyển sang hội thoại.** Sidekick App Extensions → merchant có thể nói với Sidekick "tạo 3D cho bộ sofa này". Nên thiết kế backend thành các hành động gọi được, không chỉ màn hình admin.
4. **Giữ ảnh gốc của sản phẩm.** Ảnh merchant chụp để sinh 3D hôm nay, mai dùng sinh Gaussian Splatting chất lượng cao hơn.
5. **3D/AR không phải ưu tiên của Shopify.** Vừa là khoảng trống cho app, vừa là dấu hiệu Shopify chưa thấy nhu cầu lớn.

## 5. Thư viện / framework 3D đang đi về đâu

📖 Số tải tuần qua lấy từ `api.npmjs.org`, phiên bản từ `npm view`, ngày 2026-10-23:

| Thư viện | Phiên bản | Lượt tải / tuần | Hướng đi |
|---|---|---|---|
| three.js | 0.186.1 | 14.115.096 | Mặc định của web 3D. WebGPU + TSL, WebXR, 📖 có sẵn `GaussianSplat.js` + `GLTFGaussianSplatLoaderExtension.js` (đọc splat theo chuẩn glTF mới) |
| React Three Fiber | 9.8.2 | 3.993.061 | three.js viết theo kiểu React; ăn theo WebGPU của three.js |
| `<model-viewer>` (Google) | 4.4.0 | 312.574 | Xem 3D/AR cho thương mại; Shopify dùng |
| Babylon.js | 9.32.0 | 234.083 | Engine đầy đủ (vật lý, editor); ⚠️ v9 mở rộng splat |
| Spark (splat cho three.js) | 2.4.0 | 177.823 | ⚠️ "current leader" cho splat trên web production ([utsubo](https://www.utsubo.com/blog/gaussian-splatting-guide)) |
| PlayCanvas | 2.23.3 | 106.867 | Editor trên cloud, splat có sẵn; ⚠️ SuperSplat 3.0 chỉ chạy WebGPU |
| Needle Engine | 6.0.0-alpha.7 | 3.660 | Ít người dùng, bản 6 còn alpha |

⚠️ Nguồn phụ: các bài so sánh 2026 đều khuyên three.js (thường kèm React Three Fiber) cho sản phẩm tự làm, Babylon.js cho game/mô phỏng, PlayCanvas cho đội cần editor cloud ([utsubo](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison), [cinevva](https://app.cinevva.com/blog/2026-06-09-web-game-engines-2026-comparison)).

**Thiết bị XR:**
- ⚠️ Android XR: Google liệt kê Jetpack XR SDK, Unity, Unreal, Godot, OpenXR, **WebXR** là các đường làm app. Jetpack SceneCore + ARCore for Jetpack XR lên beta (08/2026) ([Android Developers Blog](https://android-developers.googleblog.com/2026/08/jetpack-xr-sdk-core-libraries-beta.html)). → WebXR là đường chung cho web.
- Apple: Quick Look (USDZ) chạy trên iPhone, iPad, Vision Pro (📖 Apple). App native: RealityKit. ⚠️ Chưa tra visionOS 26.

💭 Hướng chung: **WebGPU** thay WebGL, **WebXR** là đường chung cho Android/kính Android XR/Quest, **glTF (+ splat) và OpenUSD** là 2 định dạng, **Gaussian Splatting** là cách hiển thị "như ảnh chụp" kế tiếp.
