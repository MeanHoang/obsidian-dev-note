---
tags: [work-brain, structure]
status: giải thích cấu trúc thật — repo commit a379824 (2026-10-01)
updated: 2026-10-01
---

# Cấu trúc brain: vì sao chia như vậy, và nó sửa được gì

Quay về [[0-Tổng quan]] · Repo: `~/work-brain` → https://github.com/MeanHoang/work-brain (private)

## Kết luận trước
1. Cấu trúc này được chọn để sửa **6 vấn đề có thật**. Mỗi vấn đề có số liệu đo trên máy anh ngày 2026-10-01 (mục 2).
2. **Đã làm được ngay**: gom luật về một chỗ, sửa 6 thông tin sai trong memory cũ, che 1 API key bị lộ, có chỗ giữ bằng chứng lỗi không bị xoá theo transcript.
3. **Chưa chứng minh được**: agent có thật sự bớt sai hay không. Brain **chưa được cài** vào `~/.claude`, nên chưa phiên nào dùng nó. Cách đo ở mục 4: so tỉ lệ anh bực với mốc 16–17% của tháng 8–9.
4. **Có cái giá:** một phiên Joy sẽ nạp thêm 92 dòng (595 → 687 dòng, tăng 15%). Chỉ giảm lại khi rút gọn phần trùng trong memory Joy.

---

## 1. Đọc cấu trúc trong 1 phút

Ví von: brain như **một văn phòng**.
- **Nội quy dán ở cửa** = `rules/`. Ai vào cũng đọc, nên phải ngắn.
- **Tủ hồ sơ có mục lục** = `wiki/`. Cần việc gì thì tra mục lục, mở đúng ngăn đó.
- **Kho chứng từ gốc** = `.raw/`. Không ai đọc hằng ngày, nhưng giữ lại để biết luật nào sinh ra từ đâu.
- **Máy móc tự chạy** = `hooks/`, `skills/`, `scripts/`. Ghi nhận lúc anh bực, nhắc dọn hằng tuần.

```
~/work-brain/
├── rules/                  # ALWAYS loaded in every session (72 lines)
│   ├── me.md               # who I am, stack, where things live
│   ├── how-i-work.md       # behavior rules, each with its source
│   └── code-style.md       # JS style for any project
├── wiki/                   # read on demand (346 lines total)
│   ├── hot.md              # what is going on now — ALSO loaded every session (20 lines)
│   ├── index.md            # one line per page; agent picks pages from here
│   ├── log.md              # change log, append only
│   ├── repos.md            # my repos/clones
│   ├── joy/                # one folder per project: architecture, dev-local,
│   │                       #   environments, harness, systems
│   ├── done/               # finished incidents (podevache)
│   └── meta/               # backfill results, friction rate per week
├── .raw/                   # evidence: never auto-loaded, never edited
│   ├── memory/             # copies of 62 old memory files
│   ├── backfill-2026-10-01/  # 860 friction cases + lessons
│   └── friction/           # filled by hooks after install
├── hooks/                  # learning loop: detect → log → ask → remind
├── skills/brain-review/    # weekly review
├── scripts/                # scan-ai-friction.py (metrics)
├── install.sh              # wires the brain into ~/.claude (NOT run yet)
├── CLAUDE.md               # conventions for agents editing this repo
└── README.md
```

---

## 2. Sáu vấn đề, và cấu trúc sửa từng cái thế nào

### Vấn đề 1: Luật đã viết nhưng agent không đọc → `rules/`
**Trước đây:** mỗi thư mục mở Claude có kho memory riêng (8 kho), và Claude chỉ nạp đúng kho của thư mục đang mở.

**Bằng chứng (đợt học bù):**
- Luật đặt tên (`feedback_naming`, tạo 18/03) nằm trong kho của `~/WebstormProjects`. Agent làm Joy chưa bao giờ đọc nó. Kết quả: **16 lần** anh phàn nàn tên biến khó hiểu, ví dụ ngày 05/08: "orderSubTotalValid… sao ko đặt tên… là refund amount".
- Luật không bịa (`feedback_no_hallucination`, 21/04) nằm trong kho của vault Obsidian. Kết quả: khoảng **22 lần** agent bịa field/link khi làm Joy, ví dụ ngày 20/08: "xin doc đi xem có đúng là có field này ko hay bn bịa ấy".

**Cấu trúc sửa thế nào:** `rules/` được nạp qua `~/.claude/CLAUDE.md`. File này Claude Code luôn đọc ở **mọi** thư mục (tài liệu chính thức: "User instructions — all projects"). Cả 2 luật trên nay nằm trong `rules/`.

**Đã kiểm được:** luật đã ở đúng chỗ.
**Chưa kiểm:** sau khi cài, phải mở Claude ở `joy`, chạy `/context` và thấy 4 file brain trong mục Memory files.

### Vấn đề 2: Mở agent ngoài `joy` là agent không biết anh là ai → `rules/me.md` + `wiki/hot.md`
**Trước đây:** `~/.claude/CLAUDE.md` không tồn tại. Kho memory của `joy-handle` phải tự ghi lại "joy-handle là gì", "anh làm Joy"… Mỗi chỗ ghi một ít, trùng nhau (`joy-handle-project.md` có 2 bản ở 2 kho).

**Cấu trúc sửa thế nào:** `me.md` (anh là ai, 14 dòng) và `hot.md` (đang làm gì) được nạp ở mọi nơi. Ghi một lần, dùng mọi chỗ.

### Vấn đề 3: Nạp quá nhiều thì agent làm theo kém → tách "luôn nạp" và "tra khi cần"
**Bằng chứng:** tài liệu Claude Code: "target under 200 lines per CLAUDE.md file. Longer files … reduce adherence". `joy/CLAUDE.md` hiện 427 dòng.

**Cấu trúc sửa thế nào:**
- Chỉ `rules/` (72 dòng) và `hot.md` (20 dòng) được nạp mọi lúc.
- Kiến thức Joy (346 dòng wiki) **không** nạp sẵn. Agent đọc `index.md` (1 dòng/trang) rồi mở đúng trang cần.
- Luật hẹp chỉ đúng cho 1 project thì không được đặt vào `rules/`.

**Nói thẳng:** brain **không làm phiên Joy nhẹ đi**. Nó thêm 92 dòng (595 → 687). Muốn nhẹ hơn thì bước sau phải rút gọn `MEMORY.md` của Joy (73 dòng). Nhiều mục trong đó nay đã nằm trong brain. Việc rút gọn này em chưa làm vì cần anh duyệt.

### Vấn đề 4: Kiến thức cũ sai mà không ai dọn → `wiki/` có ngày kiểm và nguồn
**Bằng chứng:** đọc hết 55 file memory, tìm ra **6 chỗ sai hoặc cũ**. Ví dụ:
- `reference_dev_environment` vẫn bảo chạy `sudo yarn dev`, trong khi `CLAUDE.md` cấm sudo.
- Một file trỏ tới trang Lark không tồn tại.
- Một file còn bảo dùng tracer review, đã bỏ từ 29/09.

Không ai biết các file đó viết lúc nào, đúng tới bao giờ.

**Cấu trúc sửa thế nào:**
- Mỗi trang wiki có `verified:` (ngày gần nhất kiểm với code thật) và `sources:` (sinh ra từ file nào trong `.raw/`).
- Thông tin mới thì **sửa thẳng** trang cũ và ghi vào `log.md`, không để 2 bản song song.
- `/brain-review` hằng tuần thấy trang có ngày kiểm quá cũ thì đem kiểm lại.

**Đã làm được:** 6 chỗ sai đã được sửa trong các trang `wiki/joy/*` (ghi trong `log.md`).

### Vấn đề 5: Ghi luật bằng chữ không chặn được lỗi lặp → `hooks/` + "cái thang 3 bậc"
**Bằng chứng:**
- Luật đặt key dịch đúng chỗ: memory ghi "flagged 6+ times… Same exact miss twice". Ghi chữ không hết lỗi, chỉ khi thành hook `block-translation-append.sh` mới hết.
- Commit khi anh chưa duyệt: luật có từ 05/08. Hook `commit-consent` bị tắt (sửa lần cuối 06/08). Sau đó agent vẫn commit chưa duyệt ngày 11/08 và 17/08.

**Cấu trúc sửa thế nào:** brain có sẵn chỗ cho bậc thang:
1. Anh sửa agent lần đầu → thêm 1 dòng vào `rules/`.
2. Đã có luật mà vẫn sai → `/brain-review` đề xuất **lên bậc**: viết hook hoặc test vào `hooks/`.
3. Luật không còn dùng → xoá.

Mỗi luật ghi nguồn, nên biết được luật nào đang "bị vi phạm lại".

### Vấn đề 6: Bằng chứng lỗi bị xoá dần → `.raw/` + hook cuối phiên
**Bằng chứng:** trên máy chỉ còn 484 phiên, **toàn tháng 9**. Claude Code tự xoá transcript cũ. Phiên tháng 3–8 chỉ còn câu anh gõ, mất hẳn câu agent trả lời. Vì vậy 463/860 trường hợp học bù phân loại kém chắc hơn.

**Cấu trúc sửa thế nào:**
- Hook `friction_prompt.py` ghi lại câu anh bực.
- Hook `session_end.py` chép kèm đoạn agent làm ngay trước câu đó vào `.raw/friction/`. Transcript gốc bị xoá thì bằng chứng vẫn còn, nhỏ và gọn.
- `.raw/` không bao giờ tự nạp nên không tốn context.

**Đã kiểm được:** chạy thử hook trên transcript thật của phiên này. Hook lấy đúng câu em trả lời ngay trước câu "đọc kỹ note lại cho tôi nhé". Bộ phát hiện bắt được **81%** số lần anh bực thật (đo trên 207 trường hợp đã có nhãn), và bắn ở khoảng 14% số câu anh gõ. Vì vậy hook không bắt agent hỏi ngay, mà để agent tự xét có phải đang bị sửa không.

---

## 3. Vì sao không chọn cách khác

| Cách khác | Vì sao không |
|---|---|
| Tiếp tục trỏ agent vào vault Obsidian | Vault lẫn note Java, TOEIC, tiếng Trung. Agent đọc vào bị nhiễu. Đây là lý do ban đầu làm brain |
| Gộp hết vào 1 file `CLAUDE.md` lớn | Vượt 200 dòng thì agent làm theo kém hơn. Dùng `@import` cũng không giảm, vì file import vẫn nạp hết (tài liệu Claude Code) |
| Đổi `autoMemoryDirectory` để mọi project ghi chung 1 kho | 3 rủi ro: hook `memory-consent` hết canh, 23 symlink `roles/lessons` gãy, kéo cả 16 luật viết note học Java vào. Xem [[7-Research và thiết kế lại]] |
| Dùng nguyên khung của plugin `/wiki` | Khung đó làm cho nghiên cứu tài liệu (sources/entities/concepts). Không có chỗ cho luật hành xử. Brain chỉ mượn `hot.md`, `index.md`, `log.md` và frontmatter |
| Plugin tự học `continuous-learning` (tự rút bài học thành skill) | Tự ghi không cần anh duyệt, ngược với hook `memory-consent`. Chính tác giả ghi bản v1 chỉ chạy "~50–80% of the time" |
| Giữ cấu trúc em đề xuất lần đầu (`me/`, `work/`, `knowledge/`, `refs/`, `inbox/`) | Em tự nghĩ, chưa dựa vào cơ chế có sẵn. `inbox/` để agent tự ghi rồi chờ duyệt dễ thành kho rác thứ 9 |

---

## 4. Đã cải thiện được gì: phân rõ "có thật" và "mới là kỳ vọng"

**Có thật, kiểm được ngay trong repo:**

| Việc | Kiểm ở đâu |
|---|---|
| 8 luật trước đây không bao giờ được nạp khi làm Joy nay nằm ở chỗ nạp mọi nơi | `rules/how-i-work.md`, `rules/code-style.md` (cột nguồn ghi "backfill") |
| 6 thông tin sai/cũ trong memory đã sửa | `wiki/log.md`, các trang `wiki/joy/*` |
| 1 Google API key anh từng dán đã được che | `.raw/backfill-2026-10-01/cases.jsonl` |
| Kiến thức Joy rải ở 8 kho, nay ở 1 chỗ có mục lục | `wiki/index.md` |
| Có số mốc để đo | `wiki/meta/friction.md`: tháng 8–9 là 16–17% |

**Mới là kỳ vọng, chưa chứng minh:**

| Kỳ vọng | Đo bằng gì | Khi nào biết |
|---|---|---|
| Agent bớt bịa, bớt đặt tên sai | `/brain-review` đếm lại 2 nhóm này mỗi tuần | 2–4 tuần sau khi cài |
| Tỉ lệ anh bực giảm | `meta/friction.md`, cùng script, cùng bộ từ khoá, so với 16–17% | Mỗi tuần |
| Không còn lỗi "đã có luật mà vẫn sai" | Nhóm "repeated after a rule existed" trong bảng tuần phải về gần 0 | Mỗi tuần |

Nếu sau 4 tuần các số này không giảm thì cấu trúc chưa có tác dụng, và phải xem lại. Không phải cứ làm xong là tính đã cải thiện.

---

## 5. Mở rộng sau này

| Muốn thêm | Làm thế nào | Phải sửa thêm |
|---|---|---|
| Project mới (vd `joy-data-sync`) | Tạo `wiki/<project>/`, mỗi chủ đề 1 file | 1 mục trong `wiki/index.md`, 1 dòng trong `wiki/repos.md` |
| Luật chỉ đúng cho 1 project | **Không** vào `rules/`. Đặt vào `wiki/<project>/` hoặc `CLAUDE.local.md` của repo đó | — |
| Nhóm luật chung mới (vd luật viết test) | `rules/<topic>.md` | Thêm dòng `@` vào `install.sh` rồi chạy lại; tổng `rules/` vẫn < 200 dòng |
| Sự cố đã xử lý | `wiki/done/<project>-<chuyện>.md` | 1 dòng trong `index.md` |
| Nguồn dữ liệu mới (Slack, ticket…) | Bản gốc vào `.raw/<nguồn>-<ngày>/`, rồi viết trang wiki | `sources:` của trang trỏ về đó |
| Hook / skill mới | `hooks/` hoặc `skills/<tên>/` | Khai trong `install.sh`, ghi vào `README.md` |
| Công cụ khác đọc brain (Codex, Cursor) | Markdown thuần nên đọc trực tiếp được | Thêm `AGENTS.md` trỏ tới `rules/` + `wiki/index.md` |

**Khi nào phải chia lại:**
- `rules/` vượt 200 dòng → chuyển luật hẹp sang wiki hoặc skill.
- `index.md` dài khó đọc (LLM Wiki v2: mốc khoảng 200 trang) → mỗi thư mục có `_index.md` riêng.
- `.raw/` phình to → dời đợt cũ sang `.raw/archive/`, không xoá.

## 6. Không đưa vào brain
- Cách trả lời (giọng, format) → đã có output style `plain-vietnamese`.
- Luật kỹ thuật của team Joy (layer, Firestore, webhook) → đã có ở `joy/CLAUDE.md` và skill của repo.
- 23 bài học code Joy → ở lại `joy/.claude/roles/lessons/` (symlink vào memory Joy). Brain chỉ chép 1 dòng nguyên tắc cho bài nào dùng được ngoài Joy.
- Note học (Java, TOEIC, HSK) → ở lại Obsidian.
- Tiến độ từng task → ở lại `.claude/ship/<task>/progress.md`. `hot.md` chỉ ghi tóm tắt.
