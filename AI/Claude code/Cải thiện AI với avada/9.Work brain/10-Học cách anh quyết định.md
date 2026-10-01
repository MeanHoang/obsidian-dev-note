---
tags: [work-brain, auto, decisions]
created: 2026-10-01
status: đề xuất — chờ anh duyệt
---

# Học cách anh quyết định, để auto chạy được lâu

Quay về [[0-Tổng quan]] · Liên quan [[8-Học liên tục]], [[9-Kết quả học bù]]

**Câu hỏi của anh:** những lần anh chọn khác đề xuất của AI có gom lại làm tham khảo được không? Mục tiêu là để AI tự quyết trong lúc auto chạy đường dài, anh chỉ kiểm ở cuối.

**Trả lời:** được, và đáng làm, vì **anh chọn khác AI khoảng 1/3 số lần** (số đo ở mục 1). Mỗi lần như vậy cho thấy một chỗ anh nghĩ khác AI. Gom lại thành **"sổ tiền lệ"** (precedent): tình huống nào, AI đề xuất gì, anh chọn gì, vì sao. Khi auto gặp tình huống giống, AI tra sổ và chọn như anh đã chọn, thay vì tự đoán.

---

## 1. Dữ liệu thật (đo 2026-10-01)

Script `overrides.py` quét transcript (chỉ còn tháng 9):

| Nguồn | Số lần | Anh chọn khác AI |
|---|---:|---:|
| Hộp chọn có nhãn "(Recommended)" | 29 | **14** |
| AI viết "Em đề xuất A", anh trả lời bằng chữ cái | 15 | **2** |
| AI đề xuất, anh trả lời bằng câu tự do | 44 | chưa phân loại (cần LLM đọc) |
| `decisions.md` trong 15 task `/ship` cũ (mọi thời gian) | 180 quyết định | phần lớn không ghi "AI đề xuất gì" |

→ Trong 44 lần chọn rõ ràng, **16 lần (36%) anh chọn khác AI**.

Vài ví dụ thật cho thấy anh có "gu" riêng:
| Ngày | Tình huống | AI đề xuất | Anh chọn |
|---|---|---|---|
| 2026-09-09 | Áp design lên page đang published | Lưu nháp trước | Publish luôn |
| 2026-09-28 | Merge master vào đâu | Branch mới ở worktree | Ở repo chính |
| 2026-09-25 | Tên branch cho workspace mới | `bugfix/vip-tier-…` | `improve/vip-tier-…` |
| 2026-09-30 | Deck dùng design system nào | Em tự chọn gọn | Dùng design system của anh |
| 2026-08-26 | Không tải được video | Dựng sẵn, chờ URL | Bỏ video, làm tiếp |

Ghi chú: mỗi ví dụ mới là 1 lần. Chưa đủ để thành luật. Phải gom nhiều lần cùng kiểu mới rút ra được "anh hay chọn thế này".

## 2. Cái đang có, và chỗ còn thiếu
`joy/.claude/workflow/auto-decide.md` (luật tự quyết của `/ship-auto`) đã khá tốt:
- Có thứ tự chọn cố định: GOAL và `decisions.md` → bám mẫu có sẵn → dễ đảo ngược → không đụng shop đang chạy → diff nhỏ.
- Có danh sách **không bao giờ tự quyết**: ghi/xoá data thật, auth, index mới…
- Mỗi quyết định ghi vào `decisions.md`, kèm lệnh `git revert` để đảo ngược.

**Thiếu:**
1. `decisions.md` chỉ dùng **trong 1 task**. Task sau không biết task trước anh đã chọn gì.
2. Không ghi "AI đã đề xuất gì" → không biết lần nào anh chọn khác AI. Mà đó chính là thứ cần học.
3. Thứ tự chọn là luật chung chung do AI viết, **không có tầng "anh từng chọn thế nào"**.

## 3. Đề xuất: sổ tiền lệ trong brain

### Lưu ở đâu, dạng gì
`~/work-brain/wiki/decisions/` — mỗi tiền lệ 1 file, nhóm theo loại tình huống:
```
wiki/decisions/
├── _index.md            # one line per precedent, grouped by kind
├── git-branching.md     # where to merge, branch naming, worktree vs main
├── deploy-publish.md    # draft vs publish, staging vs live test
├── scope-cut.md         # drop a blocked part and continue vs wait
├── ui-taste.md          # design system, visual choices
└── data-source.md       # where to take numbers from, which source wins
```
Mỗi mục trong file:
```markdown
## P-<n>: <rule in one line, e.g. "Blocked asset → drop it and continue, do not wait">
- When: <situation pattern>
- Owner chose: <option>  ·  AI had recommended: <option>
- Why (owner's words): "<quote>"
- Cases: 2026-08-26 (arrae video), 2026-09-… (…)   ← count = confidence
- Auto may apply: yes | report-only | no (parked)
```

### Cách AI dùng khi chạy auto
Thêm 1 bước vào `auto-decide.md` §2, ngay sau bước GOAL:
1. Tìm tiền lệ khớp tình huống trong `wiki/decisions/_index.md`.
2. **Từ 2 lần cùng kiểu trở lên, không có lần nào ngược lại** → AI chọn như anh, ghi `Theo tiền lệ P-n` vào `decisions.md`.
3. **Chỉ 1 lần** → AI vẫn chọn theo, nhưng đánh dấu "cần anh xem" trong báo cáo cuối.
4. **Các lần mâu thuẫn nhau** → PARK, hỏi anh.
5. Tiền lệ **không bao giờ** mở khoá danh sách "không bao giờ tự quyết" (data thật, auth, index…). Muốn mở thì anh phải tự ghi "Auto may apply: yes" cho đúng tiền lệ đó.

### Cách ghi tiền lệ mới (tự động, anh không phải làm gì thêm)
| Lúc nào | Cơ chế | Độ chính xác |
|---|---|---|
| Anh trả lời hộp chọn có "(Recommended)" | Hook `PostToolUse` cho `AskUserQuestion`: so câu trả lời với lựa chọn được đề xuất. Khác nhau → ghi vào `.raw/decisions/` | Cao: so chuỗi, không đoán |
| Anh trả lời "B nhé" sau "Em đề xuất A" | Hook cuối phiên quét transcript (như `overrides.py`) | Cao |
| Anh trả lời bằng câu tự do | Hook cuối phiên ghi lại, LLM phân loại ở `/brain-review` | Trung bình |
| Anh đảo ngược 1 quyết định auto lúc kiểm cuối (`git revert` một commit `[D-auto-n]`) | `/brain-review` đọc `decisions.md` + git log | Cao. **Đây là tín hiệu mạnh nhất** |

Hằng tuần, `/brain-review` gom các lần ghi lại → đề xuất tiền lệ mới, hoặc tăng/giảm độ tin cậy của tiền lệ cũ → anh duyệt.

### Vòng khép kín
1. Auto chạy, quyết theo tiền lệ.
2. Anh kiểm ở cuối. Đồng ý thì tiền lệ được +1 lần.
3. Anh đảo ngược thì tiền lệ bị −1, kèm câu "vì sao" của anh.
4. Lần sau AI quyết đúng hơn.

## 4. Đo xem có tác dụng không
| Chỉ số | Mốc hiện tại | Mục tiêu |
|---|---|---|
| % lần anh chọn khác đề xuất của AI | **36%** (16/44, tháng 9) | Giảm dần: AI đề xuất giống anh hơn |
| % quyết định auto anh đảo ngược lúc kiểm cuối | Chưa đo (`decisions.md` chưa ghi đủ) | Thấp và giảm |
| Số lần auto phải PARK chờ anh | Chưa đo | Giảm. Auto chạy được lâu hơn |

## 5. Dùng kiến thức anh note trong Obsidian làm cơ sở quyết định
Anh nói quyết định của anh thường dựa trên kiến thức đã note (UI/UX, kiến trúc, clean code) trong vault.

**Đo được:** các thư mục liên quan (`2 - Frontend`, `5 - Design System`, `7 - Software Architecture`, `12 - Thinking`, `13 - Product Engineer`, `AI`, `Avada`) có khoảng **450 nghìn chữ**, 239 note.

**Đọc mẫu 2 note:**
- `Simplicity Thinking`: phần lớn là kiến thức phổ thông, AI vốn đã biết.
- `Checklist phân tích Feature` (7 bước WHY → DONE): đây là **quy trình anh chọn dùng**, AI không tự biết.

→ Giá trị của vault không nằm ở kiến thức, mà ở **việc anh chọn tin cái gì**.

**Đề xuất:**
1. **Không** cho agent đọc thẳng vault. 450 nghìn chữ quá lớn, và lẫn kiến thức sách. Đó chính là vấn đề ban đầu khiến phải làm brain.
2. Rút thành 1 trang ngắn `wiki/principles.md`, mỗi nguyên tắc 1 dòng kèm link về note gốc. Ví dụ:
   - "Prefer the simplest solution that is still correct; ask 'what if we drop it?'" → `12 - Thinking/Simplicity Thinking.md`
   - "Before building a feature, run the 7-step check WHY → DONE" → `13 - Product Engineer/02 - Checklist phân tích Feature.md`

   Khi quyết định, AI trích nguyên tắc. Cần chi tiết thì mới mở note gốc.
3. Ghép với sổ tiền lệ:
   - **Tiền lệ** = anh **đã chọn** gì (hành vi thật).
   - **Nguyên tắc** = anh **tin** vào gì (lý do).
   - Hai cái mâu thuẫn → **tiền lệ thắng**, vì việc anh thật sự làm đáng tin hơn điều đã viết. Đồng thời báo anh xem nguyên tắc có cần sửa không.

**Rủi ro, và cách kiểm trước khi làm:**
- Nhiều note trong vault được viết cùng AI (memory vault ghi rõ: note bám sách, AI hỗ trợ giải thích). Nên note có thể là quan điểm của sách hoặc của AI, không hẳn của anh.
- Cách kiểm: lấy 16 lần anh chọn khác AI ở mục 1, xem có bao nhiêu lần nguyên tắc trong vault **giải thích được** lựa chọn của anh. Ví dụ "Bỏ video, làm tiếp" khớp với Simplicity và MVP. "Publish luôn thay vì lưu nháp" thì chưa thấy note nào giải thích.
  - Giải thích được nhiều → làm `principles.md` đáng công.
  - Giải thích được ít → tiền lệ quan trọng hơn, `principles.md` chỉ làm phụ.

## 6. Việc cần làm (chờ anh duyệt)
0. **Kiểm vault trước:** 16 lần anh chọn khác AI có bao nhiêu lần được note trong vault giải thích? Kết quả quyết định có làm `principles.md` không. Khoảng 15 phút, 1 subagent.
1. **Học bù:** chạy LLM trên 44 câu trả lời tự do và 180 quyết định trong `decisions.md` cũ → ra bản đầu của sổ tiền lệ. Khoảng 30 phút, 3–4 subagent.
2. **Brain:** thêm `wiki/decisions/`, hook `PostToolUse(AskUserQuestion)`, mở rộng `session_end.py` và `/brain-review`.
3. **Harness Joy (đụng file của anh nên cần duyệt riêng):**
   - Thêm bước "tra tiền lệ" vào `auto-decide.md` §2.
   - Thêm dòng "AI đã đề xuất: …" vào mẫu ghi quyết định ở §4.
