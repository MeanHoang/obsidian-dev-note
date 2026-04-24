# Claude Code Usage Report — Nơi Mọi Thứ Đi Sai (Friction)

> Nguồn: `~/.claude/usage-data/report.html` — section `#section-friction`
> Ngày snapshot: 2026-04-23

## Tổng quan

Các phiên làm việc nhìn chung có kết quả tốt, nhưng **điểm ma sát tập trung vào 3 chỗ**: Claude nhảy đến kết luận quá sớm, hiểu sai ý định thực sự của bạn, và thỉnh thoảng vượt quá phạm vi khi deploy hoặc refactor.

---

## 1. Kết luận vội vàng khi debug (Premature conclusions during debugging)

**Mô tả:**
Bạn thường xuyên phải chỉnh Claude khi nó bám vào một giả thuyết root cause mà chưa đủ bằng chứng, đặc biệt là các bug phức tạp Shopify / Firestore / remote-ui. Nếu yêu cầu Claude liệt kê các giả thuyết kèm bằng chứng hỗ trợ trước khi hành động, hoặc bắt nó verify bằng log / data trước, sẽ giảm được vòng lặp qua lại.

**Ví dụ:**
- Lỗi POS discount "invalid" — Claude đưa ra kết luận sai nhiều lần (quyền Sales channel, giả định cả hai mã test cùng thuộc một shop) và phiên kết thúc khi investigation vẫn còn dang dở.
- Crash remote-ui trong Shopify extension — qua lại rất dài với nhiều giả thuyết sai, cuối phiên root cause vẫn chưa được xác nhận.

---

## 2. Hiểu sai ý định và phạm vi (Misreading your intent and scope)

**Mô tả:**
Claude hay đi investigate hoặc giải thích khi bạn muốn hành động, hoặc đổi hướng tiếp cận khi bạn muốn một fix cụ thể — dẫn đến **21 action bị bạn reject** và **22 request bị hiểu nhầm**. Bắt đầu prompt bằng một động từ rõ ràng kèm scope (ví dụ: *"chỉ code cái button thôi, bỏ qua việc review logic có sẵn"*) sẽ cắt được các lần bị gián đoạn này.

**Ví dụ:**
- Khi bạn yêu cầu Claude code UI button "Claim now" cho Birthday reward, nó dành cả phiên đi khám phá logic claim hiện có thay vì build button — bạn phải cắt ngang trước khi có gì được giao (not_achieved).
- Với Obsidian ByteByteGo note, Claude bắt đầu viết note mà không fetch URL trước, buộc bạn phải cắt và cung cấp link.

---

## 3. Vượt quá phạm vi khi deploy và quyết định thiết kế (Overstepping on deployments and design decisions)

**Mô tả:**
Claude đôi khi over-engineer vượt spec hoặc thay đổi hạ tầng rủi ro mà không xác nhận, tạo ra việc dọn dẹp. Yêu cầu phải có plan viết sẵn và được approve rõ ràng trước khi chạm vào CI, deploy config, hoặc thiết kế cấu trúc dữ liệu mới — sẽ tránh được những khúc vòng tốn kém này.

**Ví dụ:**
- Với recurring milestone, Claude thiết kế config `cycles[]` kiểu per-slot trong khi spec Notion yêu cầu một shared pool đơn giản hơn — cuối cùng phải viết lại toàn bộ.
- Khi deploy lên staging22, Claude commit thay đổi CI deploy config vào **nhầm branch**, làm hỏng auto-deploy — bạn phải cắt ngang **hai lần** để bắt dừng và revert.

---

## Phân loại Friction (số lần gặp)

| Loại | Số lần |
|---|---|
| Wrong Approach | 39 |
| Misunderstood Request | 22 |
| User Rejected Action | 21 |
| Excessive Changes | 7 |
| Buggy Code | 6 |
| Output Token Limit Exceeded | 2 |

## Mức độ hài lòng (model tự ước lượng)

| Mức | Số phiên |
|---|---|
| Frustrated | 4 |
| Dissatisfied | 36 |
| Likely Satisfied | 143 |
| Satisfied | 21 |
| Happy | 1 |

---

## Bài học rút ra cho workflow sắp tới

1. **Trước khi cho Claude debug bug khó:** bắt nó liệt kê ≥2 giả thuyết kèm evidence (log, file, line) rồi mới hành động.
2. **Đầu mỗi prompt feature:** mở bằng động từ + scope rõ. Vd *"code X, không review logic cũ"*, *"fix CSS Y, không refactor component"*.
3. **Trước khi deploy / đụng CI / thiết kế schema:** bắt Claude viết plan ngắn → approve → mới làm. Không cho chạm config CI nếu chưa xác nhận đúng branch.
4. **Spec doc phải có trong context** khi start feature session (Notion link, doc path) — tránh Claude tự sáng tác design.
