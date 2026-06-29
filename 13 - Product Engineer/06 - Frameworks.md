# 🧰 Frameworks cần thuộc

> Bộ công cụ tư duy nhỏ gọn. Không cần học thuộc lý thuyết — nhớ *khi nào dùng*.

## JTBD — Jobs To Be Done
**Khi nào:** hiểu *why* của một feature.
> User không mua cái khoan, họ mua *"cái lỗ trên tường"*.

Mẫu câu: *"Khi [tình huống], tôi muốn [động lực], để [kết quả mong muốn]."*
Ví dụ: *"Khi cuối tháng, tôi muốn lấy nhanh số liệu đơn hàng, để chốt sổ kế toán."*

## RICE — Ưu tiên feature
**Khi nào:** quyết định có đáng làm / làm cái nào trước.

```
Score = (Reach × Impact × Confidence) / Effort
```
- **Reach** — số user ảnh hưởng / kỳ
- **Impact** — mức tác động (3=lớn, 2=vừa, 1=nhỏ, 0.5=ít)
- **Confidence** — độ tự tin (100% / 80% / 50%)
- **Effort** — person-month

## MoSCoW — Cắt scope MVP
**Khi nào:** định nghĩa MVP.
- **Must** — không có thì feature vô nghĩa
- **Should** — quan trọng nhưng có thể trễ
- **Could** — nice to have
- **Won't** — rõ ràng KHÔNG làm lần này (ghi ra để khỏi cãi nhau)

## Opportunity Solution Tree — Teresa Torres
**Khi nào:** tránh nhảy thẳng vào solution.
```
Outcome (mục tiêu KD)
 └─ Opportunity (vấn đề/nhu cầu user)
     └─ Solution (nhiều giải pháp khả thi)
         └─ Experiment (cách kiểm chứng)
```
> Luôn có **nhiều** solution cho 1 opportunity → đừng cưới solution đầu tiên.

## Working Backwards (PR/FAQ) — Amazon
**Khi nào:** trước khi build cái gì lớn.
> Viết **press release** + **FAQ** của sản phẩm *như thể đã ra mắt*, trước khi code.
> Nếu không viết nổi cái hấp dẫn → feature chưa đáng làm.

## Definition of Ready / Definition of Done
**Khi nào:** chốt requirement với team.
- **Ready:** có problem rõ, acceptance criteria, scope, biết cách verify
- **Done:** code + test + cover edge case + **outcome đo được**, không chỉ "chạy"

## North Star & metric SaaS cơ bản
**Khi nào:** nói chuyện giá trị bằng số.
- **Activation** — user đạt "aha moment" lần đầu
- **Retention** — quay lại dùng tiếp
- **Churn** — tỷ lệ rời bỏ
- **MRR/ARR** — doanh thu định kỳ
> Mọi feature nên trả lời được: *"đẩy metric nào?"*

Liên quan: [[01 - Mindset]] · [[02 - Checklist phân tích Feature]] · [[05 - Ví dụ thực tế]]
