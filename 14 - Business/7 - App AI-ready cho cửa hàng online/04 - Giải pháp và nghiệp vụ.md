# 04 – Giải pháp và nghiệp vụ

Thuộc [[00 - Tổng quan]]. Toàn bộ note là 💭 nhận định AI, dựa trên [[01 - Vấn đề và tệp khách hàng]], [[02 - Thị trường và cách AI đọc dữ liệu]], [[03 - Đối thủ]]. ⚠️ = chi tiết kỹ thuật cần thử trên dev store.

## 1. Định vị

Thị trường đã có ít nhất 15 app "AI-ready", và Shopify tự làm nhiều thứ. Không thể vào bằng "một app AI-ready nữa". Phải chọn đúng chỗ đối thủ yếu: **độ tin cậy**.

| Đối thủ, Shopify làm | App này làm khác |
|---|---|
| AI tự viết, tự điền, đôi khi bịa | **Không bao giờ bịa**: chỉ đề xuất giá trị có nguồn (câu trong mô tả, chữ trên ảnh, file nhà cung cấp), chủ shop xác nhận |
| Không biết câu trả lời lấy từ đâu | **Mọi câu trả lời, mọi giá trị đều hiện nguồn** |
| Đếm lượt AI nhắc, hứa traffic | **Đo "AI trả lời đúng bao nhiêu câu khách hay hỏi"**, chỉ dùng dữ liệu shop |
| Chỉ tiếng Anh | Đa ngôn ngữ từ đầu |
| Gỡ app là mất dữ liệu | **Ghi thẳng vào trường gốc của Shopify**, gỡ app vẫn còn; lưu bản cũ để hoàn tác |

Một câu: **"Để AI nói đúng sự thật về shop của bạn: không bịa, có nguồn, đúng ngôn ngữ."**

---

## 2. Tính năng (xếp theo khoảng trống của thị trường)

| Ưu tiên | Tính năng | Giải quyết | Đối thủ đã có? |
|---|---|---|---|
| **1** | **Thử hỏi theo ngành, chỉ ra trường thiếu** | Không biết AI hiểu sai, thiếu gì; không biết bắt đầu sửa từ đâu | Verity Score, AI Catalog Score làm gần. Chưa ai gắn với câu hỏi riêng từng ngành và nối tới đúng trường cần sửa |
| **2** | **Dữ liệu thật, xác nhận trước khi ghi** | AI bịa thông số; điền hàng nghìn sản phẩm không nổi | Nhiều app điền thuộc tính, nhưng bị chê bịa |
| **3** | **Chính sách đúng sự thật, đa ngôn ngữ** | Knowledge Base của Shopify bịa chính sách, chỉ tiếng Anh; chính sách là bắt buộc ở 3 kênh AI | Gần như trống |
| 4 | Gợi ý Catalog Mapping | Dữ liệu thật nằm trong metafield riêng nhưng Catalog không đọc | Chưa thấy |
| 5 | Dữ liệu cấu trúc bổ sung (đổi trả, giao hàng, GTIN) | Theme mặc định thiếu | **Đã phủ kín** (Webrex miễn phí). Chỉ làm nếu khách cần, hoặc gợi ý dùng app khác |
| Bỏ | llms.txt, agents.md | — | Shopify làm sẵn |
| Bỏ | Đếm AI nhắc shop | — | Không có dữ liệu thật |
| Bỏ | Viết lại mô tả chung chung bằng AI | — | Shopify Magic, Sidekick miễn phí; nhiều app |

### Tính năng 1: Thử hỏi theo ngành

1. Xác định ngành của sản phẩm theo danh mục chuẩn Shopify.
2. Lấy **bộ câu hỏi khách hay hỏi cho ngành đó**. Ví dụ túi da: kích thước bên trong, có vừa laptop không, chất liệu, cách giữ da, đổi trả thế nào.
3. Một AI trả lời từng câu **chỉ được dùng dữ liệu của sản phẩm và shop**, phải trích nguồn (trường nào, câu nào).
4. Câu không trả lời được thì ghi rõ **thiếu trường nào** (ví dụ: thiếu thuộc tính "kích thước", thiếu chính sách "phí trả hàng").
5. Ra điểm: "AI trả lời đúng 31/50 câu". Sửa xong chạy lại: "46/50".

Nguồn câu hỏi:
- Ban đầu: bộ câu hỏi mình soạn cho từng ngành chính (thời trang, nhà cửa, làm đẹp, linh kiện), dựa trên thuộc tính của danh mục chuẩn.
- Sau: câu khách thật hỏi AI trong Knowledge Base của Shopify (⚠️ chưa rõ app có đọc được không), "Search intelligence" của Shopify.

### Tính năng 2: Dữ liệu thật, xác nhận trước khi ghi

1. Quét sản phẩm, so với danh sách thuộc tính của danh mục.
2. Với mỗi thuộc tính thiếu, AI **tìm trong dữ liệu sẵn có**: mô tả, tiêu đề, tag, ảnh (chữ trên nhãn), file CSV nhà cung cấp chủ shop tải lên.
3. Mỗi đề xuất kèm **nguồn**: "Chất liệu = da bò. Nguồn: mô tả, câu 'Làm từ da bò thật 100%'."
4. **Không tìm thấy nguồn thì không đề xuất**, chỉ báo "thiếu, cần chủ shop nhập".
5. Ưu tiên thuộc tính Catalog dùng để lọc (Màu, Size, Giới tính), rồi GTIN, kích thước, chất liệu.
6. Chủ shop duyệt theo lô: xem bảng, chấp nhận, sửa, bỏ.

### Tính năng 3: Chính sách đúng sự thật

1. Đọc văn bản chính sách (đổi trả, giao hàng) và **cài đặt thật** (nước giao hàng, quy tắc đổi trả trong Shopify).
2. Báo chỗ **văn bản nói khác cài đặt**. Ví dụ: văn bản "giao toàn cầu" nhưng cài đặt chỉ bật 2 nước.
3. Đề xuất bản viết lại thành câu ngắn, có số cụ thể ("Đổi trả trong 30 ngày, hoàn tiền trong 5 ngày làm việc").
4. Tạo bản cho từng ngôn ngữ shop bán.
5. Chủ shop duyệt, app ghi vào chính sách (⚠️ cần kiểm tra quyền ghi chính sách qua API).

---

## 3. Luồng sử dụng

| Bước | Chủ shop thấy gì |
|---|---|
| 1. Cài app | Chọn ngôn ngữ, ngành chính |
| 2. Quét lần đầu (chạy nền) | "Đang quét 1.240 sản phẩm…" |
| 3. Báo cáo | Điểm "AI trả lời đúng X/Y câu", top 10 chỗ thiếu ảnh hưởng nhiều sản phẩm nhất, chính sách lệch cài đặt |
| 4. Duyệt đề xuất | Bảng theo lô: giá trị đề xuất, nguồn, nút chấp nhận / sửa / bỏ |
| 5. Áp dụng | Ghi vào Shopify, lưu bản cũ |
| 6. Thử lại | Điểm trước và sau |
| 7. Theo dõi | Sản phẩm mới, sản phẩm sửa → tự quét; báo cáo tuần |
| Hoàn tác | Trả lại giá trị cũ cho một sản phẩm hoặc cả lô |

---

## 4. Quy tắc nghiệp vụ

1. **Không ghi gì vào Shopify khi chưa được duyệt.** Có thể cho "tự áp dụng" sau, chỉ với đề xuất có nguồn rõ và chủ shop bật.
2. **Không có nguồn thì không đề xuất.** Thiếu thì báo thiếu, không đoán.
3. **Không bao giờ sinh GTIN, MPN, chứng nhận, thành phần.** Chỉ nhận từ chủ shop hoặc file nhà cung cấp.
4. **Lưu bản cũ** của mọi trường trước khi ghi; hoàn tác được ít nhất 30 ngày.
5. **Dữ liệu nằm ở trường gốc của Shopify** (category metafield, chính sách), không nằm trong kho riêng của app. Gỡ app vẫn còn.
6. **Không hứa traffic, không hứa xếp hạng.** Chỉ đo độ đầy đủ và độ chính xác của câu trả lời.
7. Đa ngôn ngữ: đề xuất theo từng ngôn ngữ shop bán; không dịch tự động mà không duyệt.

---

## 5a. Kiến trúc nhiều nền tảng

```
 ┌────────────── LÕI (Firebase, GCP, JS) ──────────────┐
 │ Danh sách thuộc tính theo ngành (dựa danh mục chuẩn  │
 │ Shopify, Google, dùng chung cho mọi nền tảng)        │
 │ Bộ câu hỏi theo ngành · AI rút thuộc tính có nguồn   │
 │ Thử hỏi, chấm điểm · Kiểm chính sách · Lưu bản cũ    │
 └───────────────────────▲─────────────────────────────┘
                         │ API chung: đọc sản phẩm, ghi thuộc tính,
                         │ đọc/ghi chính sách, sinh JSON-LD
   ┌────────────┬────────┴────────┬──────────────┐
 WooCommerce    Shopify           Wix          Bản web
 plugin PHP     app (Admin API)   app (REST)   (dán link,
 mỏng + REST                                    tải CSV, feed)
```

| Phần | Việc của lõi | Việc của lớp kết nối |
|---|---|---|
| Đọc sản phẩm | Chuẩn hoá về một dạng chung | Gọi API nền tảng (WooCommerce REST, Shopify GraphQL, Wix Stores) |
| Danh mục, thuộc tính | Bảng thuộc tính theo ngành, dùng danh mục chuẩn Shopify/Google làm gốc | Ánh xạ sang chỗ lưu của nền tảng (WooCommerce: product attributes; Shopify: category metafield) |
| AI rút thuộc tính, thử hỏi | Toàn bộ ở lõi | Không |
| Ghi dữ liệu | Quyết định ghi gì, lưu bản cũ | Gọi API ghi |
| Dữ liệu cấu trúc | Sinh JSON-LD bổ sung (đổi trả, giao hàng, thuộc tính) | WooCommerce: hook vào schema lõi; Shopify: theme app extension |

💭 Lợi thế: danh mục chuẩn của Shopify là mã nguồn mở (GitHub), dùng được làm **bộ thuộc tính chung** cho shop WooCommerce, Wix vốn không có danh mục chuẩn.

### WooCommerce cụ thể

| Việc | Cách làm |
|---|---|
| Plugin | **PHP mỏng**: kết nối, giao diện trong admin WordPress, hook schema. Mọi xử lý nặng chạy ở lõi Firebase |
| Đọc, ghi sản phẩm | WooCommerce REST API (khoá API do plugin tạo) |
| Bổ sung schema | Hook vào dữ liệu cấu trúc của WooCommerce để thêm `shippingDetails`, `hasMerchantReturnPolicy`, thuộc tính (`color`, `size`, `material`, `additionalProperty`). Phải kiểm tra trùng với Yoast, Rank Math |
| Kiểm feed Google | Đọc thuộc tính, so với yêu cầu Google Merchant Center, báo trường thiếu trước khi plugin Google đồng bộ |
| Thu tiền | Plugin miễn phí trên WordPress.org (không được khoá tính năng dùng thử) + tài khoản dịch vụ trả phí; hoặc bán trên WooCommerce.com (nhận 70%) |

## 5. Kỹ thuật và API Shopify

| Việc | Cách làm | Ghi chú |
|---|---|---|
| Đọc danh sách thuộc tính của danh mục | Admin GraphQL `TaxonomyCategory.attributes` | Có tài liệu |
| Đọc sản phẩm số lượng lớn | Bulk operation (`bulkOperationRunQuery`) | Shop nghìn sản phẩm |
| Đặt danh mục | `productSet` / `productUpdate` với `category` | Có tài liệu |
| Ghi category metafield | `metafieldsSet` (tối đa 25 metafield mỗi lần), giá trị là metaobject chuẩn | ⚠️ Đường ghi chính xác (namespace `shopify`, metaobject `shopify--…`) cần thử trên dev store |
| Ghi hàng loạt | `bulkOperationRunMutation` | |
| Đọc, ghi chính sách | ⚠️ Cần kiểm tra mutation và quyền (`read/write_legal_policies`) | |
| Đọc FAQ, câu hỏi của Knowledge Base | ⚠️ Chưa rõ app bên thứ ba có quyền không | Nếu không có thì dùng bộ câu hỏi tự soạn |
| Theo dõi thay đổi | Webhook `products/create`, `products/update` | |
| Dữ liệu cấu trúc (nếu làm) | Theme app extension, app embed | |
| Quyền cần xin | `read_products`, `write_products`, `read_metaobjects`, `write_metaobjects`, `write_metaobject_definitions`, quyền chính sách ⚠️ | Xin ít nhất có thể |

**Hạ tầng (Firebase, GCP):**

| Phần | Dùng |
|---|---|
| Giao diện trong Shopify admin | React + Polaris + App Bridge |
| API, xử lý webhook | Cloud Functions hoặc Cloud Run |
| Hàng đợi quét, gọi AI | Cloud Tasks |
| Lưu kết quả quét, đề xuất, bản cũ | Firestore |
| File nhà cung cấp tải lên | Cloud Storage |
| AI | Mô hình rẻ cho rút thuộc tính; mô hình tốt hơn cho thử hỏi |

**Chi phí AI** (ước thô, chưa kiểm tra bảng giá): rút thuộc tính khoảng vài phần mười cent tới vài cent mỗi sản phẩm. Shop 2.000 sản phẩm quét lần đầu tốn vài USD tới vài chục USD. Đối thủ bán 0,2–1 cent mỗi sản phẩm (CatMap, Datify), nên giá phải tính kỹ.

---

## 6. Bản đầu tiên (MVP)

Chỉ làm **một ngành** để bộ câu hỏi sâu và chính xác. Gợi ý: **nhà cửa** hoặc **thời trang** (nhiều shop, nhiều thuộc tính).

| Có trong bản đầu | Để sau |
|---|---|
| Quét sản phẩm, so thuộc tính danh mục | Nhiều ngành |
| Thử hỏi 20–30 câu cho ngành đã chọn, ra điểm, chỉ trường thiếu | Câu hỏi từ khách thật |
| Đề xuất thuộc tính có nguồn, duyệt theo lô, ghi vào Shopify, hoàn tác | Tự áp dụng |
| Kiểm tra chính sách lệch cài đặt (chỉ báo, chưa ghi) | Viết lại, ghi chính sách đa ngôn ngữ |
| Tiếng Anh | Đa ngôn ngữ |

**Thước đo bản đầu:** 10 shop cài, 3 shop duyệt ít nhất một lô đề xuất, 1 shop trả tiền.

---

## 7. Giá (giả định, cần kiểm chứng)

| Mốc tham khảo | Giá |
|---|---|
| Feed, SEO cho shop nhỏ | 5–40 USD/tháng, gói cao khoảng 99 USD |
| Bổ sung thuộc tính bằng AI | 0,2–1 cent mỗi sản phẩm (CatMap, Datify), 9 USD mỗi 100 (beFound), 1 USD mỗi 25 (Simprosys) |
| Đối thủ "AI-ready" | 0–449 USD (Verity), 49–799 USD (AgentIQ) |

Đề xuất thử:

| Gói | Giá | Gồm |
|---|---|---|
| Miễn phí | 0 | Quét, điểm, xem chỗ thiếu (không áp dụng) |
| Cơ bản | 29 USD/tháng | Tới 1.000 sản phẩm, đề xuất và áp dụng, hoàn tác |
| Tăng trưởng | 79 USD/tháng | Tới 5.000 sản phẩm, chính sách, đa ngôn ngữ |
| Agency | Theo số shop | Nhiều shop, báo cáo cho khách |

---

## 8. Tìm 10 khách đầu tiên

Theo [[14 - How to Get Your First Customers]]:

1. Nhắn trực tiếp chủ shop đã đăng các chủ đề trong [[01 - Vấn đề và tệp khách hàng]]: beckyfmartin (AI nói hết hàng), Kekti (3.000 sản phẩm), CasimirCK (sợ AI ghép sai linh kiện), olgapapodoki (không biết bắt đầu từ đâu).
2. Agency đang dọn danh mục bằng tay cho khách.
3. Trả lời các chủ đề mới về "ChatGPT", "agentic", "category metafields" trên Shopify Community và r/shopify.
4. Shopify App Store: tiêu đề và mô tả nhắm "accurate", "no hallucination", "multi-language", khác với các app "AI visibility".
