---
tags: [ai, ai-coding, architecture, refactor]
source: https://www.youtube.com/watch?v=EWSUvEyFwjc
timestamp: "29:13–35:21"
---

# 05 · Có nên rewrite? Greenfield và "organic architecture"

← [[04 - Local trước, cloud sau - Agent Benny]] · Tiếp → [[06 - Các lớp enforcement - Hard constraint thắng soft rule]]

> [!quote] 💬
> Trước AI slop, chúng ta đã có **human slop**.

---

## 🎯 Phần thứ ba: refactor và rewrite

- "Có nên rewrite app không" là một trong những chủ đề gây tranh cãi nhất ngành.
- Kỹ sư mới vào công ty hay muốn viết lại hết ("ai viết code này vậy?"). Trước thời agent, và có lẽ cả bây giờ, người ta thường can.
- Lauren đưa ra lập luận **vì sao nên cân nhắc**. Câu trả lời: **tuỳ trường hợp**.

---

## 🏢 Brownfield (app đã có) có hạ tầng tốt → agent đã làm tốt

- Nhận xét của Lauren: **vấn đề của big tech giờ thành vấn đề của mọi người**.
- Ở Meta: monorepo khổng lồ, hàng chục nghìn kỹ sư cùng ship. Nhiều kỹ sư giỏi, nhưng chất lượng code **không tốt như người ta tưởng**.
- Hạ tầng big tech (Meta, Google) được thiết kế để phục vụ **kỹ sư kém nhất team**: framework, convention, guardrail, giới hạn quyền truy cập để intern không xoá database production.
- Có sẵn hạ tầng cỡ đó → agent đã làm khá ổn vì **guardrail có sẵn**, agent không phá được nhiều. Thiếu thì thêm guardrail.

---

## 🌱 Greenfield (app mới, vibe code) → rủi ro lớn nhất, cũng là cơ hội lớn nhất

- Ví dụ: **Grockbot** được dựng rất nhanh, vibe code, **không ai đọc code**.
  - Grockbot (theo Lauren): app mới launch hôm qua, cho mình tạo các agent riêng có danh tính riêng và điều phối chúng.
- Vibe code hoàn toàn = **không có guardrail nào**.

> [!danger] ⛔ "Organic architecture"
> Giao task cho agent khi không có guardrail → nó giải bằng **cách tiện nhất**. Lâu dần codebase **xoáy ngoài tầm kiểm soát**: mình không hiểu nó; agent "hiểu" theo kiểu của nó, nhưng thứ nó dựng **tối ưu cho đường tắt**. Rồi app gặp đủ thứ vấn đề.

→ Kết luận của Lauren: **codebase mới nên bắt đầu với ràng buộc rất chặt**.

---

## 🔁 Lauren đã làm gì với Grockbot

- Refactor **toàn bộ Grockbot** sang kiến trúc mới (code name **Dune**): hơn **600 PR** (Lauren tự đếm hôm trước buổi nói).
- Có codebase + guardrail đáng tin → leo tới phần đỉnh đường cong: sáng dậy có ~20 PR agent đã merge.
- Giờ Lauren **gần như không đọc code nữa**. Bà nói không phải để "bán token" mà vì đã tốn rất nhiều công và token để tới được đây.

**Lợi ích lan ra:**
- Mọi người đóng góp vào Grockbot đều hưởng.
- Designer, PM, cả người GTM (go-to-market) cũng thêm được tính năng.
- Lauren không phải mất ngủ lo "ai vừa merge một perf regression".
- CI có hàng tấn ràng buộc. Viết code trong đó **rất phiền**, nhưng **agent gánh hết cái phiền đó**.

---

## 📏 Q&A nhỏ: kích thước PR

- Không biết con số trung bình. Dao động từ ~50 dòng, vài trăm dòng tới ~1.000 dòng tuỳ việc (PR xoá file thì chủ yếu là dòng xoá).
- **Không có giới hạn cứng** về kích thước PR.
- Nhưng Lauren **khuyến khích agent chia nhỏ thành nhiều PR**, vì:
  - Git history là nguồn context rất giàu.
  - Mỗi PR mô tả **trọn vẹn một việc nhỏ** (atomic) → dễ revert, dễ tìm bug ("nó ở đây", không lẫn trong PR 40.000 dòng).

---

## ✅ Checklist
- [ ] App đang có: kiểm hạ tầng guardrail (convention, framework, quyền truy cập) đã đủ cho agent chưa
- [ ] App mới: dựng ràng buộc chặt ngay từ đầu, đừng để agent tự "mọc" kiến trúc
- [ ] Bảo agent chia việc thành nhiều PR nhỏ, mỗi PR một việc
