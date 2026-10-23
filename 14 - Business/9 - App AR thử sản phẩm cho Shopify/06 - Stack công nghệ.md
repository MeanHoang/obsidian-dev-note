# 06 – Stack công nghệ (bản mới nhất, 2026-10-23)

Thuộc [[9 - App AR thử sản phẩm cho Shopify/00 - Tổng quan|00 - Tổng quan]]. Phục vụ hướng ở [[9 - App AR thử sản phẩm cho Shopify/03 - Phương án MVP và đề xuất|03]].

> 📖 = trích nguồn / đã kiểm. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.
> Anh yêu cầu: stack mới nhất, tiên tiến nhất, vì đây là app cho tương lai (kính AR, MR).
> Phiên bản npm em tra bằng `npm view` ngày 2026-10-23. Hướng đi của Shopify và thế giới: [[9 - App AR thử sản phẩm cho Shopify/07 - Shopify và thế giới đang đi về đâu|07]]. Bản cũ của note này ở scratchpad phiên làm việc.

**Kết luận trước:** Render bằng **three.js WebGPU** (tự lùi về WebGL 2 khi máy không có). AR bằng **WebXR** cho Android, kính Android XR và Quest; iPhone tạm **AR Quick Look**, sau đó **App Clip RealityKit**. Dữ liệu 3D theo chuẩn **glTF 2.0 + `KHR_materials_variants`** (1 file chứa nhiều màu/chất liệu). Admin theo template chính thức mới nhất của Shopify: **React Router + Polaris web components** (Polaris React đã bị bỏ). Sinh 3D qua **1 lớp chuyển đổi nhà cung cấp** (Meshy / Tripo / Rodin / TRELLIS.2 tự host), chọn bằng bài thử 10 món nội thất.

## 1. Bảng stack

| Lớp | Chọn | Phiên bản / trạng thái | Vì sao là "tương lai" |
|---|---|---|---|
| Render 3D | three.js `WebGPURenderer` + TSL (ngôn ngữ shader mới) | 📖 `three@0.186.1` | WebGPU là API đồ hoạ web thế hệ mới; tự lùi về WebGL 2 |
| AR trên web | WebXR (`immersive-ar`, `hit-test`, `dom-overlay`) qua XRManager của three.js | 📖 XRManager có `XRGPUBinding` (WebXR chạy trực tiếp trên WebGPU khi trình duyệt có) | Cùng 1 code chạy trên điện thoại Android, kính Android XR, Quest |
| AR iPhone (giai đoạn 1) | AR Quick Look, file USDZ Shopify tự tạo | 📖 iOS 12+, cả Vision Pro | Không phải viết thêm |
| AR iPhone (giai đoạn 2) | App Clip + RealityKit + SwiftUI | ⚠️ chưa kiểm App Clip cho ca này | Thanh variant trong cảnh trên iPhone; dùng lại được cho visionOS |
| Xem 3D không AR | `<model-viewer>` | 📖 `@google/model-viewer@4.4.0` | Có sẵn `variant-name` đọc `KHR_materials_variants` |
| Giao diện thanh variant | Preact + Signals | 📖 `preact@11.0.1`, `@preact/signals@2.11.3` | Nhẹ, đè lên cảnh AR qua `dom-overlay` |
| Dữ liệu 3D | glTF 2.0 (GLB) + `KHR_materials_variants`, nén Meshopt/KTX2 | 💭 | Chuẩn mở Khronos, Shopify, Apple, Google, Android XR đều đọc GLB/USDZ |
| Xử lý GLB (scale theo số đo, nén, gắn variant) | `@gltf-transform` | 📖 `@gltf-transform/core@4.5.1` | Xử lý file theo chuẩn, chạy trong server |
| Sinh 3D từ ảnh | Lớp `ModelGenerator` đổi được nhà cung cấp: Meshy 7.1 / Tripo / Rodin (API) → sau tự host TRELLIS.2 (MIT) | ⚠️ so sánh từ blog; chưa thử | Model mới ra liên tục, không khoá vào 1 hãng |
| Admin app | Template `shopify-app-template-react-router` + Polaris web components + App Bridge | 📖 `@shopify/shopify-app-react-router@4.0.0` (2026-10-21), `@shopify/polaris-types@2.0.0` | 📖 npm: "Polaris React is deprecated and no longer maintained" |
| Storefront | Theme app extension (app block + tải lười) | 💭 | Không sửa theme merchant |
| Dữ liệu variant ↔ 3D | Metafield của variant (namespace app) | ⚠️ chưa kiểm kiểu metafield cho file GLB | Nằm trong Shopify, sau này Storefront API / app khác đọc được |
| Thêm giỏ | `POST /cart/add.js` | 💭 | — |
| Backend | Firebase Functions 2nd gen + Firestore; job sinh 3D chạy nền | 📖 `firebase-functions@7.4.0` | Stack anh quen |
| Tự host model AI (giai đoạn sau) | Cloud Run có GPU chạy TRELLIS.2 | ⚠️ chưa kiểm giá GPU Cloud Run | Không trả phí theo lượt cho hãng ngoài |
| Đo hiệu quả | Sự kiện → Firestore → BigQuery | 💭 | Số "thêm giỏ từ AR" là thứ merchant chưa có |
| 3D "như ảnh chụp" (giai đoạn sau) | Gaussian Splatting theo chuẩn glTF `KHR_gaussian_splatting`, render bằng `GaussianSplat` của three.js (hoặc Spark 2.4.0) | 📖 three 0.186.1 có `GLTFGaussianSplatLoaderExtension.js`; 📖 Khronos RC 2026-02 | Chuẩn mở, Khronos nêu cho e-commerce. Giữ ảnh gốc của merchant để sinh sau |
| Mở AR từ AI / tin nhắn | Link AR riêng có sẵn variant (vd `.../ar?variant=123`) | 💭 ⚠️ chưa kiểm ChatGPT/Gemini mở link có cho camera không | 📖 Shopify đang đưa việc mua sắm sang ChatGPT, Gemini, Copilot (UCP) |
| Dữ liệu cho AI agent | Số đo thật để ở trường kích thước chuẩn của Shopify, 3D ở product media | ⚠️ chưa kiểm Catalog API đọc trường nào | 📖 Catalog: "Richer metadata like size, color ... gives agents more context" |
| Merchant thao tác qua hội thoại | Sidekick App Extension: "tạo 3D cho sản phẩm X", "xem lượt thêm giỏ từ AR" | 📖 có trong Spring '26 Edition | Shopify đưa admin sang hội thoại với Sidekick |

## 2. Một file 3D, chạy trên mọi thiết bị

💭 Lõi "cho tương lai" nằm ở **dữ liệu**, không phải ở thư viện. Mỗi sản phẩm lưu 1 bộ:
- 1 file GLB đúng mét, có `KHR_materials_variants` cho màu/chất liệu.
- Số đo thật từng variant.
- Map variant Shopify → (file GLB, tên material variant, số đo).

Bộ này dùng được cho:

| Thiết bị | Cách mở | Trạng thái |
|---|---|---|
| Điện thoại Android | WebXR trong Chrome, thanh variant trong cảnh | 📖 `dom-overlay` có trong `model-viewer`; 💭 three.js tương tự |
| iPhone / iPad | Quick Look (giai đoạn 1), App Clip (giai đoạn 2) | 📖 / ⚠️ |
| Kính Android XR (Galaxy XR, XREAL Aura) | WebXR trong Chrome | ⚠️ blog nói Chrome trên Galaxy XR có WebXR; chưa có tài liệu chính thức |
| Meta Quest | WebXR trong trình duyệt Quest | ⚠️ chưa kiểm |
| Apple Vision Pro | Quick Look (USDZ) | 📖 Apple: Quick Look chạy trên "iPhone, iPad, and Apple Vision Pro" |

## 3. Bằng chứng đã kiểm

- **three.js WebGPU + WebXR:** 📖 file `src/renderers/common/XRManager.js` của `three@0.186.1` có `this._supportsWebGPUBinding = typeof globalThis.XRGPUBinding !== 'undefined'` → khi trình duyệt có WebXR-WebGPU binding thì dùng, không có thì lùi. ⚠️ Blog nói WebGPU đạt "Baseline" (mọi trình duyệt lớn) tháng 1/2026, gồm Safari 26 iOS ([vr.org](https://vr.org/articles/webgpu-baseline-2026-three-js-webxr-default)); chưa kiểm trang WebKit.
- **`model-viewer` 4.4.0:** 📖 `docs.json` có `variant-name` ("Selects a model variant by name") và `availableVariants`. WebXR xin `dom-overlay` (đọc từ mã 4.0.0).
- **Polaris React:** 📖 `npm view @shopify/polaris deprecated` → "Polaris React is deprecated and no longer maintained. For building Shopify admin experiences, use Polaris web components".
- **Template Shopify:** 📖 [shopify-app-template-react-router](https://github.com/Shopify/shopify-app-template-react-router); PR 2026-10-21 nâng lên `shopify-app-react-router` v4 + `polaris-types` v2.
- **Sinh 3D:** ⚠️ blog so sánh (thường của chính các hãng): TRELLIS.2 mã nguồn mở MIT, Hunyuan3D hình khối sạch, Rodin chi tiết bề mặt cao nhất nhưng đắt nhất, Meshy/Tripo hợp làm game ([3daistudio](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026), [arcframe](https://arcframe.ai/blog/best-image-to-3d-ai-models-compared)). Phải tự thử với đồ nội thất.
- **Safari iOS và WebXR AR:** ⚠️ phần lớn nguồn 2026 nói chưa có. visionOS Safari có WebXR cho VR, module AR chưa bật (blog).

## 4. Đã cân nhắc và bỏ

| Phương án | Bỏ vì |
|---|---|
| 8th Wall binary cho iPhone | 📖 LICENSE cấm dùng cho sản phẩm thu phí (mục 6) |
| Zappar (WebAR trả phí) | ⚠️ ~$315/tháng, 12.000 lượt/năm, tự host chỉ gói Enterprise; khoá vào 1 hãng |
| Polaris React | 📖 Đã bị bỏ, không bảo trì |
| Babylon.js / PlayCanvas | 💭 Tốt, nhưng three.js có WebGPU + XR + hệ sinh thái lớn nhất, và `model-viewer` cũng dựa trên three.js |
| Gaussian Splatting (ảnh 3D dạng "đám mây hạt") | 💭 Đẹp nhưng chưa đo kích thước chính xác được, Quick Look/Shopify chưa đọc; ⚠️ theo dõi chuẩn glTF cho splat |
| Chỉ dùng 1 hãng sinh 3D | 💭 Model mới ra mỗi vài tháng; lớp chuyển đổi để đổi hãng không sửa app |

## 5. Việc phải kiểm ở giai đoạn 0 (1–2 ngày)

1. three.js `WebGPURenderer` + WebXR `immersive-ar` trên 1 máy Android thật: đặt bàn lên sàn, thanh variant `dom-overlay` bấm được.
2. Đổi `KHR_materials_variants` (màu) và đổi file GLB (hình dạng) khi đang trong cảnh: có giật/mất vị trí không.
3. Dung lượng tải trước khi AR chạy (three.js + Preact + GLB đã nén Meshopt/KTX2) trên 4G.
4. Kiểu metafield nào giữ được tham chiếu tới file GLB / media Model3d của variant.
5. Bài thử sinh 3D: 10 món nội thất thật × 4 nhà cung cấp, chấm hình khối + texture + đúng cỡ.

## 6. LICENSE 8th Wall binary: chặn app thu phí (đọc ngày 2026-10-23)

📖 Nguồn: [github.com/8thwall/engine/blob/main/LICENSE](https://github.com/8thwall/engine/blob/main/LICENSE) (XR Engine License Agreement, © 2026 Niantic Spatial).

> "Licensee may not utilize the Software ... in connection with any product or service: (1) which is offered for a fee or other consideration, and (2) whose value derives, entirely or substantially, from the functionality of the Software."

Không được dùng phần mềm cho sản phẩm vừa (1) thu phí, vừa (2) có giá trị chủ yếu đến từ tính năng của phần mềm. → App AR thu phí merchant rơi đúng cả 2 điều.

> "use the Software or any documentation to create, improve (directly or indirectly) or offer a substantially similar product or service, or build a competitive product."

Cấm dùng để làm sản phẩm tương tự hoặc cạnh tranh.

> "Either party may terminate this Agreement at any time, with or without cause, upon five (5) days' written notice"

Niantic có thể chấm dứt giấy phép bất cứ lúc nào, báo trước 5 ngày.

## 7. Thay thế cho iPhone

| Phương án | iPhone có thanh variant trong cảnh | Chi phí | Trạng thái |
|---|---|---|---|
| A. Android: WebXR (`model-viewer`/three.js + `dom-overlay`). iPhone: rơi về Quick Look, mỗi variant 1 nút mở riêng | Không (iPhone vẫn thoát ra) | $0 | 📖 `dom-overlay` đã kiểm trong mã `model-viewer` 4.0.0 |
| B. Như A, sau đó làm App Clip / app iOS bằng ARKit cho iPhone | Có (sau) | Thời gian viết Swift | ⚠️ App Clip chưa kiểm |
| C. Zappar Universal AR (WebAR có world tracking) | ⚠️ Có, nếu chạy trên Safari iOS (chưa có nguồn xác nhận) | ⚠️ Pro ~$315/tháng, 12.000 lượt xem/năm, $30/1.000 lượt thêm; tự host chỉ gói Enterprise | ⚠️ Số từ blog đối thủ [Banuba](https://www.banuba.com/blog/web-ar-sdk-pricing), chưa mở trang giá Zappar |

💭 Em đề xuất **B**: ra Android trước bằng WebXR (miễn phí, đã kiểm được phần thanh variant), iPhone tạm dùng Quick Look. Nếu số liệu Android cho thấy khách đổi variant trong cảnh nhiều thì mới đầu tư iOS native. C bị loại vì phí theo lượt xem đè lên mọi merchant, và không tự host được trên tên miền shop nếu không mua Enterprise.

## 8. Thêm: ảnh → 3D trong app (anh chốt 2026-10-23)

| Bước | Công cụ | Trạng thái |
|---|---|---|
| Merchant chọn 2–4 ảnh SP + nhập dài × rộng × cao | Admin Polaris | 💭 |
| Gọi API sinh 3D có texture | Meshy API, Multi-Image to 3D (30 credit/lần) | 📖 giá credit; ⚠️ chưa thử chất lượng đồ nội thất |
| Scale GLB đúng số đo, nén | `@gltf-transform` trong Firebase Function | 💭 ⚠️ chưa kiểm |
| Merchant xem trước, duyệt / sinh lại | `<model-viewer>` trong admin | 💭 |
| Đẩy vào product media | GraphQL Admin API (staged upload + tạo media) | ⚠️ chưa kiểm tên mutation |

💭 Rủi ro chất lượng: chân bàn mảnh, kính, kim loại bóng, vải nhiều nếp dễ sinh sai. Cần thử 10 sản phẩm nội thất thật trước khi hứa với merchant.
💭 Không phải lợi thế riêng: AI 3D Model Generator (miễn phí), 3Dify ($9.99) đã làm bước này. Giá trị là gộp: sinh 3D đúng cỡ + map variant + AR đổi variant + số liệu thêm giỏ trong 1 app.
