# 00 – Hành vi mua qua AI kéo theo gì (bản đồ hệ quả)

> 📖 = nguồn chính thức / tự gọi API. 💭 = nhận định AI. ⚠️ = nguồn phụ / chưa kiểm.
> Ngày làm: 2026-10-23. Cách làm (anh chọn): không đào kho pain point; đi từ **hành vi đổi** → **vấn đề kéo theo** → ai khổ → đã có ai giải → chỗ trống.
> Nền: [[Shopify - Hướng đi và mục tiêu 2026]], [[01 - UCP và Shopify Catalog]].

**Kết luận trước:** 💭 Đa số hệ quả của "mua qua AI" đã có app lớn đứng sẵn (khiếu nại: Chargeflow; mất dữ liệu quảng cáo: app theo dõi phía server; lộ mã giảm giá: KeepCart). Chỗ **ba hành vi cùng dồn vào mà chưa thấy công cụ nào phủ** là: **thương hiệu không kiểm soát được hàng của mình hiện thế nào trong kết quả mua sắm của AI** (ai bán lại, giá bao nhiêu, hàng nhái nằm cạnh). Bước tiếp: đo bằng Global Catalog.

## 1. Hành vi đã đổi (có bằng chứng)

| # | Hành vi | Bằng chứng |
|---|---|---|
| H1 | Khách tìm và so sánh trong chat AI thay vì lướt từng website | 📖 Catalog phục vụ ChatGPT, Copilot, Shop App; ChatGPT là "a discovery-focused referrer platform" |
| H2 | Khách mua ngay trong chat, không vào website | 📖 Copilot, Gemini, Meta: "Shopify-powered direct checkout" (Copilot chỉ khách Mỹ) |
| H3 | Một giỏ chứa hàng của nhiều shop | 📖 Google Universal Cart (2026-10-15, Mỹ): giỏ nhiều shop, thanh toán Google Pay |
| H4 | AI theo dõi giá giúp khách | 📖 Universal Cart: "finding deals and price drops ... alerting you" (2026-05-19) |
| H5 | Khách tìm bằng ảnh | 📖 Catalog: "Image search returns visually similar products" |
| H6 | Merchant làm việc qua hội thoại | 📖 Sidekick, Sidekick App Extensions |

## 2. Vấn đề kéo theo

| Hành vi | Vấn đề kéo theo | Ai khổ | Đã có ai giải | Trạng thái |
|---|---|---|---|---|
| H2 | AI mua sai → khách khiếu nại ngân hàng; shop chịu ("Liability today sits with the merchant" – NMI) | Shop | Chargeflow (432 review), blog "agentic chargebacks" | ❌ Đông |
| H2 | Pixel trình duyệt không chạy khi mua trong chat → quảng cáo mất dữ liệu | Shop chạy ads | WeltPixel, Conversios, app theo dõi phía server | ❌ Đông (⚠️ nguồn phụ) |
| H1, H4 | Mã giảm giá bị lộ / bị AI dùng | Shop | KeepCart (cảnh báo khi mã lên "100+ sites and ChatGPT") | ❌ Đã có; Google không nói AI tự áp mã |
| H2 | Không qua trang cảm ơn → mất bán thêm sau mua (upsell) | Shop | ChatGPT: khách thanh toán trên checkout của shop → 💭 trang cảm ơn vẫn chạy. Copilot/Gemini/Meta: tài liệu không nói extension trang cảm ơn có chạy không (📖 targets 2026-10 không có target nào cho chat). App upsell lớn (upsell.com/ReConvert, AfterSell) đã giữ trang cảm ơn + trang trạng thái đơn | ❌ Yếu: phần bị mất nhỏ (early access, chỉ Mỹ), bên lớn tự thích nghi |
| H1 | AI hiện sai thông tin shop (ảnh Gemini: người bán "BlackTree", giá ₫22.330.210; Catalog: "Lulu and Georgia", $1.698) | Shop, khách | Gần ý "AI-ready" đã dừng 10/10 | ❌ Đông |
| **H1 + H4 + H5** | **Thương hiệu không thấy và không kiểm soát hàng mình trong kết quả AI:** nhiều shop bán lại cùng món, giá lệch, shop lạ, hàng nhái hiện cạnh qua tìm bằng ảnh | **Chủ thương hiệu** | Có công cụ giám sát giá / người bán trái phép (Brand Alignment, MetricsCart, Prodfinity, i2o) nhưng **chưa thấy công cụ nào xác nhận phủ kết quả mua sắm của AI** | ✅ **Còn trống (chưa chắc)** |
| H6 | Màn hình app ít được mở, merchant làm qua Sidekick; Sidekick tự tạo app | App dev | — | 💭 Rủi ro cho mọi app, không phải ý tưởng |

## 3. Bằng chứng cho dòng còn trống

📖 Tự gọi Global Catalog (2026-10-23):
- "Crocs Classic Clog" → 10 dòng; 6 dòng đầu là **6 shop khác nhau** (shopwss, mainlandskate, shop-escape-outdoors, gz4mtv-ds, d3v0n-shoes, dtlrvilla), đa số **$49.99**, `gz4mtv-ds` **$58**.
- "Stanley Quencher H2.0 40 oz" → đa số từ `stanley-pmi` (chính hãng), 1 dòng từ `loveshackfancy`.
- Mỗi dòng chỉ 1 người bán → Catalog không gộp các shop cùng bán 1 món trong kết quả trả về.

⚠️ Nguồn phụ: 42Signals viết về "AI Shopping Agents ... Pricing, Shelf, and MAP Strategy" ([42signals](https://www.42signals.com/blog/agentic-commerce-ai-shopping-agents-brand-strategy/)) → bên giám sát giá đã để ý hướng này. Brand Alignment: AI agent "may route purchases around brand-controlled touchpoints".

## 4. Bước tiếp

1. Đo: ~30 thương hiệu phổ biến trên Global Catalog → mỗi thương hiệu bao nhiêu shop bán lại, giá lệch bao nhiêu, bao nhiêu shop lạ; thử tìm bằng ảnh xem hàng nhái có lên không.
2. Kiểm đối thủ: Brand Alignment, MetricsCart, Prodfinity, 42Signals, Red Points có theo dõi kết quả AI / Shopify Catalog chưa.

## 5. Nếu làm "thương hiệu thấy và kiểm soát hàng mình trong kết quả AI": app làm được gì

| Việc | Cách | Căn cứ |
|---|---|---|
| **Thấy** ai đang bán hàng mình, giá bao nhiêu, shop mới xuất hiện | Quét Global Catalog hằng ngày theo tên / mã sản phẩm của thương hiệu | 📖 Đã gọi được, không cần API key; mỗi kết quả có `seller.domain`, `price`, `url` |
| **Chặn** shop bán hàng giả / dùng trái phép thương hiệu trên Shopify | Gom sẵn hồ sơ báo vi phạm: link **từng trang** sản phẩm, số đăng ký nhãn hiệu, nước, nhóm hàng → thương hiệu bấm gửi form của Shopify | 📖 [Shopify Help – trademark policy](https://help.shopify.com/en/manual/compliance/intellectual-property/trademark-trade-dress-policy): cần link từng trang, "a general shop link will not be accepted"; store bị báo được thông báo trong admin, nội dung có thể bị gỡ |
| **Nhắc** đại lý bán sai giá niêm yết (MAP) | Gửi thư kèm bằng chứng (ảnh chụp + dữ liệu Catalog có ngày giờ) | 💭 Cách các công cụ MAP trên sàn đang làm |
| **Làm mạnh** listing chính hãng | Checklist Catalog mapping (title, description, category từ metafield; combined listings) cho store của chính thương hiệu | 📖 Mapping có trong admin; ⚠️ "doesn't guarantee placement" |
| **Nói với AI** đâu là nơi bán chính hãng | Soạn đoạn "đại lý chính hãng / bảo hành chỉ áp dụng khi mua tại…" cho `agents.md` / `llms.txt` của store (merchant dán vào template) | 📖 File có thật, chỉnh bằng `agents.md.liquid`; ⚠️ chưa biết AI coi trọng file này tới đâu; ⚠️ app có ghi thẳng vào template được không |

**Không làm được:**
- Đổi thứ hạng AI hiển thị (mỗi kênh tự quyết).
- Gỡ shop **không** dùng Shopify (vd thẻ "BlackTree" trên Gemini lấy từ Google Shopping) → phải qua Google / nhà đăng ký tên miền.
- Gỡ đại lý **hợp pháp** bán lại (chỉ nhắc giá, không gỡ được).
- Chỉ thấy phần Shopify Catalog; ChatGPT/Gemini còn lấy hàng từ nguồn khác.
