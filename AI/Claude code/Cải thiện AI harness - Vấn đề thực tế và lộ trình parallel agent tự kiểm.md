---
title: "Cải thiện AI harness: vấn đề thực tế và lộ trình parallel agent tự kiểm"
created: 2026-08-04
tags:
  - ai/agent
  - ai/claude-code
  - workflow
  - avada/joy
type: note
domain: meta
status: draft
---

# Cải thiện AI harness — từ vấn đề thực tế đến parallel agent tự kiểm

> Ghi chú này **dựa trên dữ liệu thật**, không phải suy đoán: quét **toàn bộ** lịch sử
> Claude Code — 312 session transcript (9 project) **+** `~/.claude/history.jsonl` —
> trích **3.738 message** do tôi gõ (03/2026 → 08/2026), lọc ra **605 message (16%)**
> có tín hiệu không hài lòng, rồi đối chiếu ngày phàn nàn với ngày file memory tương ứng.
>
> Script quét: [[scan-ai-friction.py]] (cùng thư mục, chạy 2 giây).
>
> Mục tiêu: **sửa dứt điểm những gì đang sai trước**, rồi mới tiến lên kiến trúc
> multi-agent tự kiểm — chứ không nhảy thẳng lên parallel agent khi nền còn thủng.

> [!warning] Lần quét đầu (04/08) đã bỏ sót 35% dữ liệu
> Bản đầu chỉ quét 293 file trong thư mục project `joy` → **2.438 message**. Sót:
> - **`~/.claude/history.jsonl`** — kho prompt toàn cục, giữ được **03→05/2026** trong khi
>   transcript đã bị purge, chỉ còn từ 06/2026. → sót **772 prompt của tháng 3, 4, 5**.
> - **15 session ở vault dev-note** + các project `joy-2`, `joy-handle`, `joy-pm`.
> - **44 lần bấm ESC ngắt ngang** — bị chính bộ lọc loại bỏ vì coi là nhiễu hệ thống,
>   trong khi đây là tín hiệu bực **mạnh nhất** (bực tới mức không đợi AI nói hết).
>
> Bài học cho chính quy trình rà: **đừng lọc bỏ cái mình cho là nhiễu trước khi nhìn nó.**

---

## Phần 1 — Chẩn đoán: cái gì đang thực sự sai

### 1.1. Phát hiện cốt lõi: **memory không phải là hàng rào**

Đây là bằng chứng đắt nhất trong toàn bộ đợt rà soát:

| | |
|---|---|
| Rule | Translation key phải đặt theo alphabet cạnh key anh em, KHÔNG append cuối file |
| Memory được tạo | `feedback_translation_key_placement.md` — **13/07/2026** |
| AI vi phạm lại | **17/07/2026** — 4 ngày sau |
| Nguyên văn | *"ê memory tôi nói đừng đặt cuối file rồi mà ???"* |

Cùng ngày 13/07, rule ESLint cũng bị nhắc lại ngay khi vừa ghi memory:
*"check xem có vài diff bị sửa do eslint bạn chạy đấy — cái này tôi note memory rồi mà nhỉ"*.

**Kết luận rút ra:** memory là *ngữ cảnh tham khảo* được nhồi vào prompt, không phải
*cơ chế cưỡng chế*. Model có thể đọc nó rồi vẫn làm sai, đặc biệt khi context dài và
memory nằm ở đầu cuộc hội thoại. Muốn chắc chắn thì phải đẩy rule xuống tầng
**deterministic** (hook) — cái mà model không "quên" được.

Đây chính là nguyên lý cần khắc vào harness:

```
Rule càng quan trọng → càng phải đẩy xuống tầng thấp
┌─────────────────────────────────────────────┐
│ Tầng 3: MEMORY      — gợi ý, model có thể bỏ qua   │  ← đang lạm dụng tầng này
│ Tầng 2: SKILL/CMD   — quy trình, model phải đi qua │
│ Tầng 1: HOOK        — chặn cứng, model không cãi   │  ← đang dùng quá ít
└─────────────────────────────────────────────┘
```

Hiện Joy có 7 hook (`auto-lint`, `block-dangerous-bash`, `block-tunnel-url`,
`recursion-guard`, `require-docs`, `require-translate`, `slack-stop-check`) nhưng có
**~50 memory**. Tỉ lệ này lệch — rất nhiều rule đáng lẽ phải là hook thì lại nằm ở memory.

### 1.2. Xu hướng: **đang xấu đi, không phải tốt lên**

Đây là phát hiện mà lần quét đầu không thấy được vì thiếu dữ liệu tháng 3–5:

| Tháng | Có tín hiệu / Tổng | Tỉ lệ | |
|---|---|---|---|
| 2026-03 | 27 / 321 | **8%** | ▓▓▓▓ |
| 2026-04 | 28 / 272 | **10%** | ▓▓▓▓▓ |
| 2026-05 | 9 / 146 | **6%** | ▓▓▓ |
| 2026-06 | 63 / 479 | **13%** | ▓▓▓▓▓▓▓ |
| 2026-07 | 434 / 2311 | **18%** | ▓▓▓▓▓▓▓▓▓ |
| 2026-08 | 44 / 209 | **21%** | ▓▓▓▓▓▓▓▓▓▓▓ |

Tỉ lệ ma sát **tăng gấp ~2,6 lần** từ tháng 3 đến tháng 8, dù trong khoảng đó tôi
đã thêm ~50 memory, 7 hook và hàng chục skill/agent.

*Cần trung thực về nhiễu:* một phần mức tăng có thể do (a) tháng 7 khối lượng gấp 5 lần,
task khó hơn nhiều; (b) bộ luật dò được tôi viết dựa trên từ vựng tháng 7 nên khớp tháng 7
tốt hơn tháng 3. Nhưng ngay cả khi trừ hết nhiễu, **không có dấu hiệu nào cho thấy tỉ lệ
đang giảm** — trong khi đáng lẽ càng nhiều memory thì càng phải giảm. Đó mới là điều đáng lo:
**việc thêm memory không kéo được đường cong xuống.**

### 1.3. Bảng vấn đề đầy đủ, xếp theo tần suất thật

| # | Rule | Số lần | Có memory? | Còn tái phạm? |
|---|---|---|---|---|
| 1 | **VERIFY** — bịa/đoán mò, phải bắt "check kỹ, dẫn chứng đâu" | 127 | ⚠️ một phần | ✅ **còn** |
| 2 | **AUTO** — tự ý hành động khi chưa được bảo | 56 | ✅ 1 phần | ✅ còn |
| 3 | **I18N** — translation key, bản dịch | 41 | ✅ 13/07 | ✅ **tái phạm 17/07** |
| 4 | **SCOPE** — sửa khi chỉ được bảo "check" | 40 | ❌ | ✅ **còn** |
| 5 | **MISREAD** — hiểu sai câu hỏi *(mới)* | 36 | ❌ | ✅ còn |
| 6 | **CODE** — thừa / wrapper / khó đọc | 35 | ⚠️ | ✅ còn |
| 7 | **NAMING** — đặt tên khó hiểu *(mới)* | 32¹ | ❌ | ✅ còn |
| 8 | **PATTERN** — không bê mẫu, tự viết lại | 31 | ❌ | ✅ còn |
| 9 | **UI** — xấu, không nhất quán | 16 | ⚠️ | ✅ còn |
| 10 | **INCOMPLETE** — trả lời thiếu *(mới)* | 14 | ❌ | ✅ **còn** |
| 11 | **MEMORY** — vi phạm rule đã ghi memory | 12 | — | ✅ còn |
| 12 | **GIT** — branch/commit/stash | 10 | ✅ ×3 | ❌ hết sau 29/07 |
| 13 | **LINT** — eslint cả file | 3 | ✅ 13/07 | ⚠️ |
| 14 | **AUTOCOMMIT** — tự commit *(mới)* | 2 | ✅ 15/05 | ❌ hết |
| — | **ESC ngắt ngang** (tín hiệu cấu trúc) | **44** | — | ✅ còn |

¹ NAMING và DOC-INSTEAD-OF-WORK có false positive (câu hỏi kiến thức thuần như
"Blink WebKit gọi là gì", hay "xin link MR nhé" là yêu cầu bình thường). Số thật thấp hơn.

### 1.4. Bốn nhóm vấn đề MỚI mà lần quét đầu không thấy

**a) MISREAD — AI trả lời lệch câu hỏi (36 lần).** Dấu hiệu: câu của tôi mở đầu bằng
"không..." rồi nói lại ý:
> *"**không** đang cau là nhấn google.com rồi nhấn enter cơ mà"*
> *"**không** khách đâu xài 2 app loyalty 1 lúc lạy bố, các app không phải loyalty đi"*
> *"**ko** bn hiểu sai rồi, tôi đang đặt vấn đề nếu bn là người dùng ấy"*

**b) INCOMPLETE — trả lời thiếu (14 lần).** Đây là nhóm **tự nó chứng minh chính nó**:
chính lần rà đầu tiên của tôi cũng bị bắt lỗi này.
> *"**bạn phải nói đủ cả 7 cái chứ nhỉ ??? sao có 2 cái thôi**, đầy đủ chi tiết đúng thứ tự nhé"*
> *"tôi thấy **chưa đủ chi tiết chưa đủ core** ấy"*
> *"check kể cả session cũ hơn được không, **tôi thấy hơi thiếu đấy**"* ← chính là lần này

**c) NAMING — đặt tên không giải thích được.**
> *"**tại sao lại đặt tên file là `reviewSection`** nhỉ nghe chả hiểu liên quan gì á"*
> *"**sao lại gọi là bootstrap** nhỉ, main function ở đây là đâu"*

**d) ESC ngắt ngang — 44 lần.** Không có chữ nào, nhưng là tín hiệu thật nhất: bực tới
mức cắt ngang. Phân bố dày ở tháng 7. Và ca đắt nhất bắt được nhờ tín hiệu này:
> **29/06: *"VKL COMMIT LUÔN RỒI À"*** — AI tự commit khi chưa được phép.
> Memory `feedback_git_workflow` đã có từ **15/05**, tức là vi phạm sau đó 6 tuần.
> (Sau 29/06 không còn tái phạm.)

### 1.5. Đào sâu SCOPE — "check" bị hiểu thành "sửa"

Đây là thứ **lặp nhiều nhất**, và triệu chứng đáng lo nhất không phải là con số 54,
mà là **tôi phải rào trước trong prompt**:

> *"ê **check thôi đừng sửa vội** néh tôi đang merge master á"*
> *"**đừng sửa vội** verify rồi lên plan chứ, đọc lại joy-ship đi"*
> *"tạm thời phân tích, **đừng đổi branch hay gì cả** nhé, working đang bận plan khác"*
> *"**read only thôi đừng update sửa hay can thiệp gì** nhé"*
> *"check diff nhé **đừng sửa thứ không liên quan**"*

Một người phải viết câu phòng thủ trong mọi prompt = harness đang có **default sai**.
Default của agent phải là *đọc → báo cáo → dừng*, và chỉ chuyển sang ghi khi có
tín hiệu rõ ràng. Hiện tại default đang là *đọc → tự sửa luôn*.

Memory `feedback_question_vs_action` chỉ cover trường hợp **hỏi** ("là gì", "chỉ hỏi thôi"),
chưa cover trường hợp **ra lệnh khảo sát** ("check", "phân tích", "review", "đọc", "xem").

### 1.6. Đào sâu CODE/PATTERN — code thừa, viết lại từ đầu thay vì bê pattern

> *"này **wrapper thì giữ làm gì** nhỉ thay đi nhé"* (component chỉ pass-through prop)
> *"nhìn code nó **lộn xộn**, update rải rác kiểu gì cũng bị thừa, đọc code cũng khó hiểu"*
> *"đoạn code này **hỗn loạn quá**, lẽ ra nên viết case vào `prepareDiscountProgramText` chứ"*
> *"sao lại có **2 hàm dùng 2 nơi chả liên quan logic gì** đến với nhau như này"*
> *"`program` có sẵn luôn, **sao lại cần đọc lại trên `window.AVADA_JOY`**??"*
> *"sửa hãy **tìm 1 hàm để tham khảo và bê về** nhé, **đừng cố phân tích viết lại từ đầu**"*

Câu cuối là một rule cực kỳ cụ thể và **chưa có trong memory**. Nó khác với "reuse
before create" (đang có) ở chỗ: reuse nói về *tái dùng code*, còn cái này nói về
*tái dùng hình dạng code* — copy cấu trúc của một hàm anh em thay vì tự thiết kế.

### 1.7. Đào sâu UI — chất lượng thẩm mỹ

> *"**thiết kế lại được không, làm thành 1 bộ khung đi** chứ này xấu vkl"* + *"mục lục ghim bên trái cố định"*
> *"sửa UI chỗ more action ở customer chứ **như này xấu quá**"*
> *"**màu đen đi trắng trông tệ vậy**, với thứ tự nên để send trước hay sau cái copy form"*
> *"button ấy đang **ưu tiên accent hơn là button fill** nhỉ ???"*
> *"page cứ **bị load lại sau khi nhấn đổi**, gây khó chịu"*

Nhóm này chia làm 2 loại rất khác nhau:
- **UI sản phẩm** (admin Polaris, widget) — đã có memory badge/toggle, cần mở rộng.
- **UI của chính deliverable AI tạo ra** (trang HTML trade-off doc của `/joy-ship`) —
  mỗi lần một kiểu vì không có template chuẩn. Đây là lỗi harness, không phải lỗi sản phẩm.

---

## Phần 2 — Giải pháp cho những gì đang sai (làm TRƯỚC)

Nguyên tắc: **mỗi vấn đề được gán vào đúng tầng**, không nhét tất cả vào memory.

### 2.1. Tầng HOOK — chặn cứng (ưu tiên cao nhất)

#### H1. `block-translation-append.sh` — PreToolUse(Edit|Write)
Vấn đề #5. Chặn khi diff thêm key vào **cuối** `storage/translations/*.json` hoặc
`locale/input/*.json` thay vì chèn theo alphabet.

Logic: nếu file target khớp pattern translation VÀ vị trí dòng thêm nằm trong ~5 dòng
cuối file VÀ key mới không nằm đúng thứ tự alphabet so với key trước/sau → `deny`
kèm message chỉ đúng vị trí phải chèn.

#### H2. `readonly-intent-guard.sh` — PreToolUse(Edit|Write|Bash)
Vấn đề #1 — cái quan trọng nhất. Nếu prompt gần nhất của user chứa tín hiệu read-only
(`check thôi`, `đừng sửa`, `phân tích thôi`, `read only`, `đọc thôi`, `xem thôi`,
`chưa sửa vội`, `verify`) mà **không** có tín hiệu cho phép ghi (`sửa`, `fix`, `làm đi`,
`commit`, `apply`) → chặn Edit/Write và trả về message:
*"Prompt hiện tại là read-only. Báo cáo phát hiện rồi dừng; xin xác nhận trước khi sửa."*

Đây là hook giá trị nhất trong danh sách — nó biến rule bị vi phạm nhiều nhất thành
bất khả vi phạm.

#### H3. Mở rộng `auto-lint.sh` → chỉ lint dòng đã đổi
Vấn đề #6. Hiện `auto-lint.sh` chạy `eslint --fix` **cả file** → reformat dòng cũ →
đúng cái tôi đã phàn nàn. Sửa thành: chỉ áp lên range dòng nằm trong diff so với HEAD
(dùng `git diff -U0` lấy hunk range, hoặc chạy `eslint --fix` rồi
`git checkout -p` revert hunk format-only).

#### H4. `branch-guard.sh` — PreToolUse(Bash matching `git commit|git push`)
Vấn đề #4 đã hết tái phạm nhờ memory, nhưng hậu quả quá đắt (mất file untracked,
push nhầm MR) nên vẫn nên hạ xuống tầng hook: in `git branch --show-current` +
so với branch đã khai trong `.claude/ship/<task>/progress.md`, lệch thì chặn.
Đồng thời chặn thẳng `git stash --include-untracked` / `-u`.

### 2.2. Tầng SKILL — quy trình bắt buộc đi qua

#### S1. `joy-ship` bổ sung gate "PATTERN REFERENCE"
Vấn đề #7. Trước khi implement bất kỳ hàm/component nào, subagent **phải** nêu:
> "Tôi bê pattern từ `<file:line>` — hàm `<tên>`. Điểm khác biệt: ..."

Không nêu được file tham chiếu = không được viết code mới. Ép agent tìm anh em
trước khi sáng tác.

#### S2. Template chuẩn cho HTML deliverable
Vấn đề #3 (phần AI tự tạo). Một file khung duy nhất trong
`.claude/skills/joy-ship/templates/plan-doc.html`: mục lục ghim trái cố định,
bảng trade-off, dark/light, typography thống nhất. Mọi trang trade-off/plan render
từ khung này, không tự chế mỗi lần một kiểu.

### 2.3. Tầng MEMORY — chỉ giữ cái không thể tự động hoá

3 memory nên thêm (những cái còn lại nên chuyển thành hook/skill):

1. **"Check nghĩa là CHỈ check"** — backup cho H2, phòng khi hook chưa bắt được biến thể ngôn ngữ.
2. **"Copy pattern có sẵn, đừng viết lại từ đầu"** — backup cho S1; kèm ví dụ wrapper pass-through bị bác.
3. **"Không tạo component wrapper chỉ để đổi tên prop"** — case `LoyaltyImageField` bọc `TemplateUploadCardV2`.

Và một việc dọn dẹp: **rà lại ~50 memory hiện có**, cái nào có thể thành hook thì
chuyển, cái nào trùng nhau thì gộp. Memory càng nhiều thì mỗi cái càng loãng trong context.

### 2.4. Giải pháp cho 4 nhóm mới (bổ sung sau lần quét đầy đủ)

Ba nhóm dưới đây **không chặn được bằng hook** — chúng là lỗi *nội dung câu trả lời*,
không phải lỗi *thao tác file*. Phải xử ở tầng output-contract, tức là bắt AI **tự khai
độ phủ trước khi trả lời**.

#### V1. VERIFY (127 lần — nhóm lớn nhất) → bắt buộc trích dẫn nguồn
Mọi khẳng định về hành vi code phải kèm `file:line`, hoặc phải nói thẳng
*"chưa verify, đây là giả định"*. Không có đường giữa. Đây đã là kỳ vọng ngầm của tôi
nhưng chưa được viết thành rule cứng ở đâu cả — 127 lần tôi phải hỏi "dẫn chứng đâu"
là bằng chứng.

#### V2. INCOMPLETE (14 lần) → khai báo độ phủ ở đầu câu trả lời
Trước khi trả lời câu hỏi khảo sát, AI phải in một dòng:
> *Đã quét: X/Y nguồn — [liệt kê]. Chưa quét: [liệt kê]. Lý do bỏ qua: ...*

Chính lần rà đầu tiên đã bỏ sót 35% dữ liệu mà **không hề nói là có thể còn nguồn khác**.
Nếu có dòng khai báo này ngay từ đầu, tôi đã phát hiện thiếu ngay lập tức thay vì phải
tự nghi ngờ rồi bắt quét lại. Đây là rule rẻ nhất mà giá trị cao nhất trong cả note này.

#### V3. MISREAD (36 lần) → nhại lại yêu cầu trước khi làm việc lớn
Với task > 1 bước: nhắc lại yêu cầu bằng 1 câu *của mình* rồi mới bắt đầu.
Sai chỗ nào tôi chặn ngay ở câu đầu, thay vì để nó chạy 10 phút rồi mới biết lệch.

#### V4. NAMING → tên phải tự giải thích được
Đặt tên xong phải trả lời được: *"đọc tên này mà không đọc code thì hiểu nó làm gì chưa?"*
Nếu tên là thuật ngữ vay mượn (`bootstrap`, `adapter`, `island`) thì phải giải thích
nghĩa **trong ngữ cảnh Joy**, không dùng chữ nghe kêu.

> **Điểm chung của cả 4:** đây là **output contract** — hợp đồng về hình dạng câu trả lời.
> Hook chặn được *hành động*, nhưng chỉ có contract mới ràng buộc được *nội dung*.
> Và contract chỉ có hiệu lực nếu nó nằm trong `CLAUDE.md` (mọi session đều đọc),
> không phải trong memory (dễ loãng).

---

## Phần 3 — Lộ trình: parallel agent tự kiểm

Đây là hướng tôi muốn đi. Nhưng phải hiểu rõ **nó giải quyết được gì và không giải quyết được gì**.

### 3.1. Multi-agent KHÔNG tự sửa được các vấn đề ở Phần 1

Điểm mù cần nhớ: nếu 5 agent chạy song song mà **cùng chia sẻ một memory và một
system prompt**, chúng sẽ **cùng mắc chung một lỗi**. Agent reviewer cũng đọc đúng
memory "đừng đặt key cuối file" mà agent implementer đã đọc — và cùng bỏ qua như nhau.

> **Multi-agent khuếch đại thông lượng, không tự khuếch đại tính đúng đắn.**
> Muốn nó tăng tính đúng đắn thì các agent phải **khác nhau về góc nhìn** và
> phải có **trọng tài deterministic** (hook/script/test) làm chốt cuối.

Vì vậy thứ tự đúng là: **Phần 2 trước → Phần 3 sau**. Hook là thứ mọi agent đều
không thể lách, kể cả agent chạy song song.

### 3.2. Kiến trúc đề xuất: 3 vòng, verify bất đối xứng

```
        ┌──────────────── VÒNG 1: SCOUT (song song, read-only) ────────────────┐
        │  scout-code      → luồng code hiện tại, file/hàm liên quan            │
        │  scout-pattern   → tìm hàm anh em để BÊ PATTERN (feed vào gate S1)    │
        │  scout-surface   → joy-surfaces: surface nào bị ảnh hưởng             │
        │  scout-data      → schema/Firestore/BigQuery đụng tới                 │
        └───────────────────────────┬──────────────────────────────────────────┘
                                    ↓  (barrier — cần gộp để ra plan)
        ┌──────────────── VÒNG 2: IMPLEMENT (tuần tự, 1 agent/phase) ──────────┐
        │  implementer chuyên môn (backend / admin-fe / widget / theme)         │
        │  ⛔ bị chặn bởi HOOK H1–H4 — không lách được                          │
        └───────────────────────────┬──────────────────────────────────────────┘
                                    ↓  (pipeline — verify ngay khi phase xong)
        ┌──────────────── VÒNG 3: VERIFY (song song, GÓC NHÌN KHÁC NHAU) ──────┐
        │  verify-diff-scope  → có đụng file ngoài task không? eslint noise?    │
        │  verify-pattern     → có bê đúng pattern đã khai ở vòng 1 không?      │
        │  verify-surface     → có sót surface nào không (joy-surfaces walk)?   │
        │  verify-adversarial → CỐ GẮNG BÁC BỎ: "fix này sai ở đâu?"           │
        │  verify-render      → screenshot thật nhiều width (CSS/layout)        │
        └───────────────────────────┬──────────────────────────────────────────┘
                                    ↓
                    Gộp → chỉ báo cáo finding có ≥2 agent đồng thuận
                                    ↓
                          ⛔ GATE NGƯỜI: tôi duyệt → mới commit
```

Ba nguyên tắc thiết kế:

**a) Verify phải bất đối xứng.** Không dùng 5 bản sao của cùng một reviewer. Mỗi
verifier có *một lăng kính riêng* và bị cấm nhìn cái khác. `verify-adversarial`
được prompt ngược: mặc định coi là SAI, phải tìm cách bác bỏ; chỉ khi không bác được
mới cho qua.

**b) Trọng tài cuối phải là máy, không phải model.** Kết luận "đã đúng" chỉ được
chấp nhận khi có bằng chứng deterministic: test pass, screenshot, log thật, `git diff`
sạch. Không chấp nhận "agent nói ổn rồi".

**c) Gate người không bao giờ bị bỏ.** Parallel agent để tôi **đỡ phải đọc 20 file**,
không phải để tôi **khỏi phải quyết định**. Commit/push vẫn cần tôi gật.

### 3.3. Ánh xạ sang tài nguyên đã có

May mắn là Joy đã có sẵn gần hết nguyên liệu, chỉ thiếu phần điều phối:

| Vai trò trong sơ đồ | Đã có gì | Thiếu gì |
|---|---|---|
| scout-code | `Explore`, `feature-dev:code-explorer` | — |
| scout-pattern | ❌ | **cần tạo** — quan trọng nhất, chống vấn đề #7 |
| scout-surface | skill `joy-surfaces` | agent bọc nó |
| implementer ×6 | ✅ đủ 6 agent chuyên môn | — |
| verify-diff-scope | ❌ | **cần tạo** — chống vấn đề #1, #6 |
| verify-adversarial | một phần trong `code-reviewer` | tách riêng, prompt ngược |
| verify-render | `ui-ux-reviewer` + Claude in Chrome | — |
| Điều phối song song | `Workflow` tool | script workflow riêng cho Joy |

→ Việc cần làm thực chất là: **2 agent mới** (`scout-pattern`, `verify-diff-scope`)
+ **1 workflow script** nối chúng lại + **4 hook** ở Phần 2.

### 3.4. Lộ trình 3 giai đoạn

**Giai đoạn 1 — Bịt lỗ (1–2 buổi).** Làm H2 (`readonly-intent-guard`) và H3
(auto-lint theo dòng) trước, vì đây là 2 vấn đề tần suất cao nhất. Sau đó H1, H4.
*Tiêu chí xong:* thử prompt "check thôi đừng sửa" → agent bị chặn khi định Edit.

**Giai đoạn 2 — Chuẩn hoá (1 buổi).** Gate PATTERN REFERENCE vào `joy-ship`,
template HTML chuẩn, dọn memory trùng.
*Tiêu chí xong:* một task chạy `joy-ship` mà không có câu "sao lại viết lại từ đầu".

**Giai đoạn 3 — Song song hoá.** Viết workflow script 3 vòng, tạo 2 agent mới,
chạy thử trên **một task nhỏ đã biết đáp án** để đo: nó có bắt được lỗi mà quy trình
cũ đã bỏ sót không?
*Tiêu chí xong:* chạy lại một bug cũ (ví dụ ca `detectLocale` đọc nhầm từ
`window.AVADA_JOY`) → vòng verify phải bắt được mà không cần tôi gợi ý.

---

## Phần 4 — Cách đo là có tiến bộ thật

Không đo bằng cảm giác. Sau khi làm Phần 2, quét lại transcript đúng cách đã làm
ở đầu note này và so:

| Chỉ số | Baseline (08/2026) | Mục tiêu |
|---|---|---|
| % message có tín hiệu bực | 11% (272/2438) | < 5% |
| Số lần phải viết "đừng sửa vội / check thôi" | ~54 | 0 (hook lo) |
| Số lần phải nhắc "memory tôi ghi rồi mà" | 3 | 0 |
| Số rule ở tầng hook / tầng memory | 7 / ~50 | 15 / ~30 |

### Thuật toán rà — [[scan-ai-friction.py]]

Chạy `python3 scan-ai-friction.py` — **2 giây cho toàn bộ 3.738 message**. Bốn cải tiến
so với cách grep keyword ban đầu:

**1. Quét cả 2 nguồn, bù chỗ trống cho nhau**

| Nguồn | Phủ thời gian | Đầy đủ? |
|---|---|---|
| `~/.claude/projects/*/**.jsonl` | 06→08/2026 (cũ hơn đã purge) | ✅ đầy đủ mọi lượt |
| `~/.claude/history.jsonl` | **03→08/2026** | ⚠️ chỉ prompt gõ tay |

→ Hợp 2 nguồn rồi khử trùng lặp theo `(ngày, 120 ký tự đầu đã chuẩn hoá)`.

**2. Chuẩn hoá tiếng Việt trước khi khớp.** Bỏ dấu bằng `unicodedata` NFD + lọc `Mn`,
`đ→d`. Nhờ vậy một pattern `khong sua voi` bắt được mọi biến thể tôi hay gõ:
"không sửa vội", "khoong sua voi", "ko sửa vội". Grep có dấu bỏ sót phần lớn.

**3. Tín hiệu CẤU TRÚC, không chỉ từ khoá** — đây là phần tìm ra 4 nhóm vấn đề mới:

| Tín hiệu | Cách lấy | Giá trị |
|---|---|---|
| `INTERRUPT` | text chứa `Request interrupted by user` | **mạnh nhất** — bực tới mức cắt ngang |
| `AFTER_EDIT` | đếm lượt kể từ assistant dùng Edit/Write; ≤3 lượt | ngữ cảnh "sửa lưng" |
| `SHORT_NEG` | câu <80 ký tự mở đầu bằng không/sai/revert/dừng | bác bỏ dứt khoát |

> ⚠️ Bẫy đã mắc: bản đầu tính `AFTER_EDIT` là hit độc lập → nhảy vọt lên 26% toàn nhiễu.
> Tín hiệu ngữ cảnh chỉ nên **cộng điểm**, không tự nó thành kết luận.

**4. Chấm điểm + gom nhóm theo rule** thay vì in thô, xuất `hits.jsonl` sắp theo điểm
bực giảm dần → đọc 30 dòng đầu là nắm được vấn đề nặng nhất.

**Cách chạy lại kỳ sau:**
```bash
python3 ~/Documents/Obsidian\ Vault/dev-note/scan-ai-friction.py
# so 3 số với baseline: % tổng, đường cong theo tháng, top rule
```

*Giới hạn cần biết:* bộ luật là regex thủ công → có false positive (NAMING bắt cả câu
hỏi kiến thức thuần). Dùng để **xếp hạng vấn đề**, không dùng làm con số tuyệt đối.

---

## Phần 5 — Workflow của tôi (agent PHẢI đọc phần này trước khi làm)

Phần trên nói AI sai ở đâu. Phần này nói **tôi làm việc như thế nào** — vì phần lớn lỗi
ở Phần 1 thực chất là agent không hiểu tôi đang đứng ở bước nào trong quy trình, nên
nhảy cóc.

### 5.1. Luồng DEVELOPMENT — `/joy-ship` (nguồn: `.claude/skills/joy-ship/SKILL.md`)

Nguyên tắc xương sống: **tôi chỉ xuất hiện ở các GATE, còn lại agent tự chạy.**
Gate nào cũng vậy — báo cáo xong thì **dừng và đợi**, không tự đi tiếp.

```
Step 0  Orient — chọn MODE: SHIP (mới) / CONTINUE (đã có branch+progress.md) / STABILIZE
   │    CONTINUE thì KHÔNG lập plan mới từ đầu — đối chiếu plan cũ với cái đã commit
   ↓
Step 1  Intake ──────────────────────────────── 🚦 GATE 1 (lặp tới khi tôi nói "move")
   │    /analyze-task <notion-url>: verify từng claim của spec bằng code,
   │    lấy số liệu thật, gộp TẤT CẢ câu hỏi thành MỘT lượt hỏi
   ↓
Step 2  Plan ────────────────────────────────── 🚦 GATE 2 (lặp tới khi tôi nói "move")
   │    ⚠️ ĐÂY là nơi giải quyết HẾT verification + HẾT câu hỏi mở
   │    a. Flow-check multi-agent TRƯỚC khi viết plan — reader song song trên từng
   │       surface + 1 agent đối kháng săn coupling ẩn (field-trigger loop,
   │       pickFields whitelist, surface-is-live, backwards compat, Firestore index)
   │    b. Chia phase NHỎ theo flow/surface (không phải 1 diff khổng lồ)
   │       Feature thì giữ thứ tự B1 admin → B2 backend → B3 storefront
   │    c. Sinh plan.html (lang=vi, toc, 6 section: tổng quát / hiện trạng /
   │       trade-off / plan theo phase / risks / điểm cần chốt)
   ↓
Step 3  Implement (mỗi phase) ────────────────── 🚦 GATE 3 (lặp cho TỪNG phase)
   │    Plan đã grounded rồi → bước này CHỈ THỰC THI, chạy nhanh
   │    KHÔNG chạy lại flow-check, KHÔNG dừng hỏi trừ khi gặp vấn đề THẬT SỰ MỚI
   │    Code → /code-review trên diff → tự fix cái rõ ràng →
   │    báo cáo KÈM kết quả review → kết thúc đúng câu "OK = em sẽ commit phase này."
   ↓
Step 4  Test & commit phase — test CÓ THỂ BỎ QUA nếu tôi đã tự test
   ↓
Step 5  Finalize (local)
   ↓
Step 6  Ship-out ────────────────────────────── 🚦 GATE (HỎI — không bao giờ tự động)
   ↓
Step 7  Deploy + review đa agent cuối vòng
        4 agent song song: security-auditor + performance-reviewer +
        shopify-app-tester + code-reviewer trên `git diff origin/master...HEAD`
        ⚠️ Mọi finding CRITICAL phải tự đọc code verify lại trước khi báo —
           agent hay nói quá và mâu thuẫn nhau
```

**Ba điều bất di bất dịch trong luồng này:**
1. **Gate = dừng.** Báo cáo xong thì kết thúc lượt, đợi tôi. Không tự "tiếp".
2. **Hỏi dồn một lượt ở Gate 1/2**, không hỏi lắt nhắt giữa lúc code.
3. **Commit chỉ sau khi tôi gõ OK** — từng phase một.

### 5.2. Luồng SUPPORT — khác hẳn, ngắn hơn nhiều

Khi là ticket/khiếu nại của merchant thì **không chạy joy-ship**. Chỉ 2 bước:

```
Bước 1  Check setting store PROD của khách → xem lỗi đến từ đâu
        ⚠️ Đối chiếu ĐỐI XỨNG: setting thật trên store  ⟷  vùng code liên quan
           (setting nói A mà code đọc B → chính là chỗ hỏng)
   ↓
Bước 2  AI xác định lỗi + báo lại + GỢI Ý phương án xử lý
        → dừng ở đề xuất. Quyết định là của tôi.
```

Điểm khác cốt lõi so với luồng dev:

| | Development | Support |
|---|---|---|
| Điểm xuất phát | Notion spec | Store prod của khách |
| Bước đầu tiên | verify spec bằng code | **đọc setting store thật trước** |
| Chiều đối chiếu | code ⟷ spec | **setting prod ⟷ code** |
| Đầu ra | code đã commit | **chẩn đoán + đề xuất** |
| Được sửa code không? | có, sau gate | **không, trừ khi tôi bảo** |

⚠️ Trên store prod: **chỉ đọc, không ghi**. Mọi thao tác ghi phải hỏi trước.

### 5.3. Tối ưu tốc độ — chỗ nào đang mất thời gian

Đối chiếu quy trình trên với 605 tín hiệu ma sát, thời gian mất chủ yếu ở 4 chỗ:

| Chỗ mất time | Triệu chứng trong data | Cách tăng speed |
|---|---|---|
| **Hỏi lắt nhắt giữa Step 3** | 56 lần AUTO + nhiều lần bounce về Gate 2 | Ép Gate 2 hỏi cho hết — đúng như skill đã ghi, nhưng thực tế vẫn rò |
| **Verify lại từ đầu ở mỗi phase** | Step 3 chạy lại flow-check dù plan đã grounded | Cache kết quả flow-check vào `progress.md`, phase sau đọc lại |
| **Tôi phải rào "đừng sửa vội"** | 40 lần SCOPE | Hook `readonly-intent-guard` (H2) — bỏ hẳn được vòng đôi co này |
| **Trả lời thiếu → phải bắt làm lại** | 14 lần INCOMPLETE | Dòng khai báo độ phủ (V2) — phát hiện thiếu ngay câu đầu thay vì sau 10 phút |

**Ba đòn tăng speed đáng làm nhất, theo thứ tự lãi/công:**

1. **Song song hoá Step 1 + Step 2a.** Hiện `/analyze-task` (Gate 1) chạy xong mới tới
   flow-check (Gate 2). Nhưng flow-check chỉ cần *tên surface*, không cần tôi duyệt xong
   Gate 1. → Bắn scout đọc code **ngay khi đọc Notion**, tới Gate 1 là đã có sẵn bằng chứng.
   Tiết kiệm nguyên một vòng chờ.
2. **Gộp Gate 3 theo cụm phase nhỏ.** Phase 1 dòng lẻ mà cũng đợi tôi OK thì phí.
   Cho phép gộp 2–3 phase cùng surface vào một lượt duyệt, miễn là báo cáo tách rõ từng phase.
3. **Bỏ hẳn Step 4 khi tôi đã tự test** — skill đã cho phép "skippable" nhưng phải
   **hỏi ngay ở Gate 3** ("anh tự test hay em chạy?") chứ đừng mặc định chạy rồi mới hỏi.

> Điều KHÔNG được đánh đổi lấy tốc độ: **gate consent trước khi commit** và
> **verify lại finding CRITICAL bằng code**. Hai cái này chậm nhưng là chỗ duy nhất
> chặn được lỗi đắt tiền.

---

## Ghi chú kết

Điều đáng suy nghĩ nhất từ đợt rà soát này: **các rule được sửa dứt điểm đều là
những rule gây hậu quả đau ngay** (mất file untracked, push nhầm branch) — não người
lẫn hệ thống đều học nhanh từ đau. Còn các rule "chỉ hơi khó chịu" (key đặt cuối file,
eslint reformat, code thừa) thì tái phạm mãi vì không có cơ chế nào làm nó *đau*.

Hook chính là cách tạo ra cái đau đó một cách rẻ tiền và tức thì: sai là bị chặn ngay,
không đợi tới lúc review mới phát hiện.

**Liên quan:** [[Ngụy biện LLM - Gán sai nguồn trong các quy trình nhận thức có hỗ trợ AI]]
— cùng chủ đề ranh giới đóng góp người/máy; note này là mặt kỹ thuật của cùng vấn đề đó.
