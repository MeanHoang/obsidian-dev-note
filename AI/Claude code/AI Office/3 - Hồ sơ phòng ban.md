> [!quote] 💬
> "Clutter and confusion are failures of design, not attributes of information." — Edward Tufte

# 📁 AI Office — Hồ sơ phòng ban (gom mọi báo cáo về một chỗ)

Liên quan: [[0 - Ý tưởng tổng quan]] · [[1 - Phân tích yêu cầu]] · [[2 - Mockup UI]]

---

## 😵 1. Vấn đề
Mỗi task chạy my-ship sinh ra rất nhiều file, nằm rải rác ở nhiều nơi:
- File md: `progress.md`, `analysis.md`, `decisions.md`, `facts.md`, `product.md`
- File html: `plan.html`, `report.html`, `tmp/mockups/index.html`, `tmp/shots/*-compare.html`
- Ảnh: `tmp/shots/*-before.png`, `*-after.png`
- Log: `tmp/logs/*-fail.txt`, `revert-check-*.patch`
- Một số báo cáo **không có file**: báo cáo code của implementer, finding của reviewer, decision card của product. Chúng chỉ nằm trong chat.

Mỗi lần parent chạy `open ...` là bật thêm một tab hoặc cửa sổ (Preview, trình duyệt, editor). Mở nhiều tab là **lú**, không biết file nào ai viết, viết để làm gì, đọc lúc nào.

> [!note] 📝 So sánh dễ hiểu
> Giống công ty mà mỗi nhân viên gửi báo cáo qua một kênh khác nhau: email, Zalo, giấy dán bàn. Sếp phải tự đi gom.
> Cách giải: **mỗi phòng ban có một tủ hồ sơ**. Mọi báo cáo đều có nhãn ghi rõ *ai viết · là gì · đọc khi nào*, và mở ngay tại chỗ.

---

## 💡 2. Giải pháp: Hồ sơ phòng ban
1. **Mỗi phòng (task) = một tủ hồ sơ.** AI Office tự quét `.claude/ship/<slug>/` trong worktree.
2. **Chia theo phòng ban (role).** Bấm vào một nhân viên là thấy mọi báo cáo người đó làm ra.
3. **Mỗi báo cáo có nhãn:** tên tiếng Việt · **Là gì** (1 câu) · **Đọc khi** (gate nào) · người viết + model · giờ cập nhật · trạng thái (mới / đã đọc / fail / chưa có).
4. **Mở ngay trong trang, không bật tab mới.** md render thành văn bản đẹp, html hiện trong khung iframe sandbox, ảnh có thanh kéo so sánh trước/sau, log hiện như terminal.
5. **Hai cách xem:** *Theo phòng ban* (ai làm gì) hoặc *Theo bước* (Gate 1 cần đọc gì, Phase 2 có gì…).
6. **Báo cáo chưa tới lượt vẫn hiện, nhưng mờ đi**, ghi "sẽ có ở Gate 2". Nhờ vậy anh biết trước sẽ có những gì.
7. **Khi phòng có 🚦**, hồ sơ tự mở đúng báo cáo cần đọc để trả lời. Ví dụ duyệt commit thì mở bằng chứng của verifier.

---

## 🗂️ 3. Bản đồ hồ sơ theo phòng ban
| Phòng ban | Báo cáo | File | Là gì | Đọc khi | Hiển thị |
|---|---|---|---|---|---|
| 💡 **Product** | Product brief | `product.md` | Có nên làm không: vấn đề, bằng chứng có nguồn, phương án, v1, rủi ro, verdict | Gate 1 | md |
| | Mockup đề xuất | `tmp/mockups/index.html` | 2–4 màn hình HTML theo giao diện thật | Gate 1 | iframe |
| | Thẻ quyết định | *(chat → cần lưu file)* | Câu hỏi sản phẩm: lựa chọn, đề xuất, "fails if" | Khi có trade-off | thẻ |
| 🔍 **Scout** | Bảng facts | `facts.md` | `claim \| verdict \| file:line`, không có khuyến nghị | Gate 2 (anh ít đọc) | bảng |
| | Bằng chứng K1 + attribution | `progress.md` (legs) + `tmp/logs/` | Setting thật, code, commit nào gây lỗi | Bug: trước khi sửa | md + log |
| 🧭 **Parent** (trưởng nhóm) | Phân tích Gate 1 | `analysis.md` | §1 domain · §2 ai đau · §3 app hiện tại · §4 gap · §5 điểm mở · §6 GOAL | Gate 1 | md |
| | Kế hoạch | `plan.html` | Tổng quan, hiện trạng, trade-off, phase, rủi ro, Review Focus | Gate 2 | iframe |
| | Tiến độ | `progress.md` | Checklist + dòng NOW + đang chờ anh gì | Bất cứ lúc nào | md |
| | Quyết định | `decisions.md` | Quyết định + lý do + phương án bị loại, nợ kỹ thuật, bài học | Trước khi đổi hướng | md |
| | Báo cáo auto | `report.html` | Cần anh quyết · đã build · review · chưa xong · tự kiểm 10 phút | Hết `/ship-auto` | iframe |
| 🧑‍💻 **Implementer** | Báo cáo code phase N | *(chat → cần lưu file)* | File đã sửa, pattern đã copy, eslint, đuôi output test | Mỗi phase | md |
| 🔬 **Verifier** | Tái hiện lỗi | `tmp/shots/*-1-before.png` + `tmp/logs/*-fail.txt` | Ảnh lỗi / test fail trước khi sửa | Trước khi sửa | ảnh + log |
| | Bằng chứng sau sửa | `tmp/shots/*-3-after.png`, `*-compare.html` | Ảnh trước/sau cùng trạng thái, cùng độ rộng | Duyệt commit | kéo so sánh |
| | Test fail → pass + revert check | `tmp/logs/revert-check-*.patch` | Fail khi gỡ fix, pass khi có fix, chạy hồi quy | Duyệt commit | terminal |
| 🧐 **Reviewer** | Báo cáo review | *(chat → cần lưu file)* | Finding `must-fix / optional · file:line · kịch bản · đề xuất` | Sau phase cuối | bảng |
| 📝 **Reporter** | Báo cáo ngày | `office/reports/<date>.md` | Tóm tắt mọi phòng | Sáng mỗi ngày | md |

---

## 🔧 4. Cần thay đổi gì ở my-ship
> [!warning] ⚠️ Ba báo cáo hiện chỉ nằm trong chat
> Báo cáo code của implementer, finding của reviewer và thẻ quyết định của product chưa thành file. Cần một hook `SubagentStop` lưu câu trả lời cuối của subagent thành file:
> `.claude/ship/<slug>/reports/<role>-<step>-<n>.md` (VD: `implementer-phase2.md`, `reviewer-k5.md`).

Các thay đổi nhỏ khác:
1. **Đổi `open` thành thông báo.** Thay vì `open compare.html` (bật tab mới), parent ghi một event `doc.ready`. AI Office hiện chấm "mới" trên báo cáo đó, kèm toast.
2. **Front-matter cho mỗi file** (tuỳ chọn) để gắn nhãn chuẩn:
```yaml
---
office: { role: verifier, title: "Bằng chứng sau sửa — Phase 2", step: phase-2, kind: evidence }
---
```
3. **Không có front-matter** thì AI Office tự đoán nhãn theo tên file, dựa vào bảng ở mục 3.

---

## 🖥️ 5. Thiết kế màn hình Hồ sơ
```
┌ Phòng: Chuẩn hoá store credit ─────────── [🚦 nếu có: hộp câu hỏi + "Mở báo cáo liên quan"] ┐
│ Xem: (● Theo phòng ban) ( Theo bước )                                     NOW: Phase 3 ... │
├──────────────┬──────────────────────────────┬──────────────────────────────────────────────┤
│ 👩 Product 2 │ 💡 Product brief       ✓ đã đọc│  💡 Product brief                 [⤢] [📋]  │
│ 🧑 Scout   1 │ 🖼️ Mockup đề xuất      ● mới   │  Là gì: Có nên làm không...                  │
│ 🧭 Parent  4 │ ...                            │  Đọc khi: Gate 1 · Product · opus · 09:12    │
│ 🧑‍💻 Impl  3 │ ⏳ Báo cáo code Phase 4 (mờ)  │  ─────────────────────────────────────────── │
│ 🔬 Verif  3 │                                │  (nội dung render ngay tại đây)              │
│ 🧐 Review 0 │                                │                                              │
└──────────────┴──────────────────────────────┴──────────────────────────────────────────────┘
```
- Cột trái: phòng ban, kèm avatar, trạng thái, model và số báo cáo.
- Cột giữa: danh sách báo cáo có nhãn. Có chấm "mới" cho báo cáo chưa đọc.
- Cột phải: trình xem. Nút **⤢** phóng to ngay trong trang, không mở tab.

---

## 🎨 6. Góp ý UI: nhân vật
- Bản cũ trông như Minecraft (khối vuông). Đổi sang **nhân vật chibi/anime vẽ bằng SVG**: mắt to có highlight, má hồng, mỗi role một kiểu tóc và phụ kiện riêng.
  - Product: tóc dài, kẹp sao
  - Scout: kính tròn
  - Parent: tai nghe có mic
  - Implementer: headphone
  - Verifier: tóc buộc đuôi ngựa
  - Reviewer: tóc bob, kính đỏ
  - Dispatcher: cà vạt
  - Workspace: mũ bảo hộ
  - Reporter: búi tóc, bút chì
- **Biểu cảm theo trạng thái:**

| Trạng thái | Mặt |
|---|---|
| Đang làm | Mắt mở, tập trung |
| Chờ anh | Miệng chữ "o" + 🚦 |
| Lỗi | Mắt ><, giọt mồ hôi |
| Xong | Mắt cười ^ ^ |
| Rảnh | Mắt lim dim, zZ |

---

## ✅ Checklist
- [x] Liệt kê đủ file my-ship sinh ra theo từng role
- [x] Thiết kế tủ hồ sơ: nhãn, hai cách xem, trình xem tại chỗ
- [x] Mockup: thêm Hồ sơ phòng ban + nhân vật anime → [[2 - Mockup UI]]
- [ ] Viết hook `SubagentStop` lưu báo cáo của implementer, reviewer, product thành file
- [ ] Đổi các lệnh `open` trong K4/P thành event `doc.ready`
- [ ] Chốt có dùng front-matter `office:` hay chỉ đoán theo tên file
