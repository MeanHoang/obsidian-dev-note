# 10 – Đào sâu và gợi ý app

Đi ra từ [[09 - Phân tích theo flow]]. Làm ngày 2026-10-11.

> 📖 = trích nguồn. 💭 = nhận định AI. ⚠️ = chưa kiểm chứng.

## Cách làm

Chọn 6 điểm mạnh nhất trong note 09. Tiêu chí:
- ma sát giữa hai bên;
- người trả tiền có tiền;
- không nặng pháp lý.

Mỗi điểm được đào sâu thành một file với cùng khung:
1. Vấn đề.
2. Hành trình chi tiết.
3. Quy mô.
4. Đã ai làm chưa.
5. Gợi ý app.
6. Rủi ro.
7. Cách kiểm chứng 2 tuần.
8. Đánh giá thẳng.

## Kết quả

| File | Vấn đề | Gợi ý app (tên tạm) | Đã ai làm | 💭 Đánh giá |
|---|---|---|---|---|
| [[10.1 - Sổ lãi lỗ nguồn khách cho thợ]] | Thợ trả Angi, Thumbtack, Google tiền mua khách nhưng không biết sàn nào lãi, không nhớ khách nào đã được hoàn tiền | LeadLedger: sổ ghi chung nhiều sàn, nhắc hạn xin hoàn tiền, 29 USD/tháng | **Trống một phần, đang hẹp dần.** Tack Tools Pro (149 USD) đã lo hoàn tiền Thumbtack; Google, Thumbtack đã tự hoàn một phần. Phần Angi vẫn làm tay | **Đáng thử 2 tuần**, chưa viết code |
| [[10.2 - Thu chứng từ có kiểm tra]] | Khách nộp chứng từ sai, thiếu cho kế toán, người làm thuế | MissingBox: khách cứ gửi email, app kiểm và soạn thư "còn thiếu" | **Đã có.** Financial Cents, Karbon, Canopy, ShareFile, Suralink đã có AI kiểm lúc nộp; ít nhất 8 công cụ nhỏ năm 2026 | Không nên làm |
| [[10.3 - Học bổng địa phương]] | Học sinh điền lại cho từng học bổng; tổ chức thiếu người nộp | LocalOne: một đơn chung cho mỗi trường cấp 3, 199–399 USD/năm | **Gần như đã có.** AppCentri bán đúng việc này cho trường; AwardSpring có gói 99 USD cho tổ chức nhỏ; Cirkled In miễn phí | Không nên làm chính; trường quen miễn phí, mua chậm, chỉ dùng 4 tháng/năm |
| [[10.4 - Lịch trình cưới chung giữa các bên]] | Mỗi bên cung cấp một lịch trình, cặp đôi chuyển PDF qua lại | SyncDay: các bên xác nhận phần của mình, cảnh báo vượt giờ hợp đồng | **Đã có.** Ít nhất 8 sản phẩm; Timeline Genius bán 29 USD cho cặp đôi tự lo | Không nên làm; các app hiện có rất ít người dùng |
| [[10.5 - Hồ sơ tình trạng nhà cho người thuê]] | Người thuê mất tiền cọc vì không có biên bản lúc nhận nhà | MoveInProof: 9 USD một lần | **Đã có.** Hơn 10 app phía người thuê, hầu hết 0–1 đánh giá; luật California từ 2026 bắt chủ nhà tự chụp | Không nên làm |
| [[10.6 - Hẹn sửa chữa ba bên cho chủ nhà nhỏ]] | Khớp lịch chủ nhà – người thuê – thợ | ChốtGiờThợ: link SMS chọn giờ | **Gần như kín.** FixQueue (19 USD/10 căn), PropTend miễn phí; Latchel vẫn phục vụ chủ nhỏ qua RentRedi | Không nên làm; chủ 5 căn chỉ sửa khoảng 1 lần/tháng |

## 💭 Điều rút ra

1. **Đào sâu thì 5/6 điểm hoá ra đã có người làm.** Lý do: ở tầng note 09 chỉ kiểm nhanh đối thủ. Khi kiểm kỹ (App Store, Product Hunt, forum, trang giá) thì thấy hết.
2. **Nhiều sản phẩm đã có nhưng rất ít người dùng** (lịch cưới, hồ sơ người thuê). Nghĩa là nỗi đau có thật nhưng **người ta không trả tiền cho công cụ**. Họ chọn cách khác: thuê người, tự xoay xở, hoặc bỏ luôn.
3. **Gốc nhiều vấn đề là hành vi con người** (khách không trả lời, không ai chịu trách nhiệm), không phải thiếu phần mềm.
4. **Cách lấy ý tưởng từ diễn đàn công khai đã chạm giới hạn.** Ở mọi nhóm đều thấy người sáng lập khác đang khảo sát cùng chủ đề (r/Bookkeeping có 6 người chào app trong một bài; BiggerPockets có ít nhất 4). Điều này lặp lại bài học của note 08.

## 💭 Hai lối đi tiếp (anh tự chọn)

| Lối | Làm gì | Vì sao |
|---|---|---|
| **A. Thử 10.1 trong 2 tuần, không viết code** | Tự kiểm tra tay sổ khách của 5 thợ dùng Angi, Thumbtack; xin trả trước; dừng nếu dưới 3 người trả hoặc tiền đòi được dưới 5% chi tiêu | Điểm duy nhất còn trống một phần; người dùng đang mất tiền thật; làm kỹ thuật dễ (Thumbtack có webhook) |
| **B. Đổi nguồn ý tưởng** | Đi từ việc anh thấy tận mắt ở công việc, hoặc nói chuyện trực tiếp với người dùng trước rồi mới nghĩ ra app | Tín hiệu riêng (chỉ anh thấy) thì ít người khác thấy; diễn đàn công khai đã quá nhiều người cùng đọc |
