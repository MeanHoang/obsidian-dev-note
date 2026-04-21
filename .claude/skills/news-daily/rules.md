# Rules

## 🚨 Anti-hallucination (ƯU TIÊN SỐ 1)

- **Mỗi item BẮT BUỘC có 1 URL cụ thể lấy nguyên văn từ WebSearch.** Không sửa, không rút gọn, không đoán slug.
- **Cấm bịa/đoán URL.** Không viết URL kiểu `example.com/blog/something` dù đoán rất hợp lý.
- **Cấm tái sử dụng 1 URL chung** (vd `shopify.dev/changelog`) cho nhiều item khác nhau. Mỗi fact cần URL riêng tới bài viết gốc. Nếu không có URL riêng → gộp thành 1 entry tham chiếu URL tổng.
- **Claim không có URL rõ → bỏ claim đó**, không cố điền. Ít item thật > nhiều item sai.
- **Ngày/số/phiên bản** (vd "15/04", "v2026-04", "+500%") — chỉ ghi nếu snippet search nêu rõ. Không chắc → bỏ số, nói định tính.
- **Nghi ngờ item quan trọng** → WebFetch verify URL + content trước khi đưa vào.
- **Self-check trước khi ghi file:** quét lại mỗi URL, phải copy-paste từ 1 WebSearch result cụ thể. Không qua kiểm tra → không ghi.

## Nội dung

- **Skip section rỗng** — không viết "không tìm thấy tin" cho từng topic. (Trừ section Tài chính VN luôn có.)
- Mỗi topic tối đa **3-5 item**, ưu tiên chất lượng.
- Shopify + Loyalty: có thể **5-7 item** nếu ưu tiên cao.
- Web Dev + System Design: **3-5 mỗi section**, ưu tiên bài có concept/pattern rõ, không listicle.
- **Bắt buộc giải thích "đây là gì"** cho mỗi item: định nghĩa thuật ngữ/framework/công ty nếu user có thể chưa biết. Không viết "Hydrogen 2026.4.0 ra" mà không nói Hydrogen là gì.
- Tóm tắt đủ để user quyết định click, không copy nguyên đoạn.

## Filter dedupe

- So khớp tiêu đề/chủ đề tin với list file đã note trong 7 ngày qua (bước 1).
- Trùng → **bỏ hẳn khỏi digest**, không ghi chú.
- Cùng chủ đề nhưng cũ >7 ngày → có thể giữ nếu có góc nhìn mới, ghi chú "(đã note tuần trước)".

## Context Joy Loyalty

- Khi tóm tắt tin Shopify/Firebase/GCP/web dev → luôn thêm 1 câu "impact với Joy Loyalty / code daily".
- Không bias TypeScript — user dùng JavaScript thuần. Code example default JS, không mặc định TS.

## Ngày

- Lấy từ `currentDate` trong system context. Không đoán.
