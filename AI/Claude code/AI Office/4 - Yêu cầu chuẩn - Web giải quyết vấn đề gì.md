> [!quote] 💬
> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

# 🎯 AI Office — Yêu cầu chuẩn (v2): web này giải quyết vấn đề gì

> [!note] 📝 Đọc note này trước
> Note này **thay cho phần điều phối** ở [[0 - Ý tưởng tổng quan]] và [[1 - Phân tích yêu cầu]].
> Hoạt động của từng công việc (role, gate, auto-run, commit, model) **đã có sẵn trong flow + harness** (my-ship cho code). Web **không làm lại** phần đó.
> v2 (12/10) bổ sung 2 hướng mở rộng: **(1) Phòng thư ký**: một session chung cho việc lặt vặt và việc định kỳ; **(2) nhiều dự án, nhiều loại công việc**, không chỉ Joy và không chỉ code.

---

## 1️⃣ Một câu
**AI Office là một trang local, nhìn vào toàn bộ "công ty AI" của anh: mỗi dự án là một tầng, mỗi việc là một phòng, mỗi role là một nhân viên. Trang gom mọi báo cáo về một tủ hồ sơ, cho anh chat với trưởng nhóm từng phòng và với thư ký chung, và cho anh sửa bộ quy trình (harness) có xem diff.**

---

## 2️⃣ Vấn đề cần giải
| # | Vấn đề | Hậu quả |
|---|---|---|
| V1 | Mỗi việc sinh nhiều file (`progress.md`, `analysis.md`, `decisions.md`, `plan.html`, ảnh, log…) nằm rải rác | Không biết file nào ai viết, để làm gì, đọc lúc nào |
| V2 | `open ...` bật tab, Preview, trình duyệt liên tục | Quá nhiều tab, **lú và stress** |
| V3 | Nhiều việc chạy song song | Phải mở từng terminal mới biết việc đang ở đâu |
| V4 | Việc dừng chờ anh mà anh không thấy | Đứng yên, mất thời gian |
| V5 | Ảnh trước/sau, test fail→pass là file rời | Khó so sánh, khó tin là đã sửa |
| V6 | **Một session "linh tinh"** để hỏi, cập nhật harness, mở workspace, kiểm tra việc này việc kia | Session đó không có chỗ đứng: lẫn với session làm việc, mất ngữ cảnh, việc định kỳ phải nhớ tay |
| V7 | Harness hiện **gắn chặt với Joy và với code** | Muốn đóng gói quy trình cho dự án khác hoặc việc khác (nội dung, support…) thì phải làm lại từ đầu |

---

## 3️⃣ Mô hình: công ty → tầng → phòng → nhân viên
```
🏢 Công ty AI (một web, chạy trên Mac mini)
├── 🛎️ Phòng thư ký (dùng chung mọi tầng)
│     ├── Thư ký: session chung, chat được (hỏi đáp, cập nhật harness, mở việc mới, kiểm tra)
│     └── Lịch trực: việc định kỳ (cron) + kết quả từng lần chạy
├── 🏬 Tầng "Joy" (pack: Coding · harness: my-ship + profile Joy)
│     ├── 🚪 Phòng = 1 việc (1 worktree) → Trưởng nhóm (Parent) + nhân viên theo role
│     └── ...
├── 🏬 Tầng "dev-note" (pack: Content · ví dụ skill news-daily, kich-ban)
│     └── 🚪 Phòng = 1 việc (1 thư mục việc)
└── 🏬 Tầng "Dự án X" (pack: Coding · harness: my-ship + profile X)
```

### 3.1 Harness chia 3 lớp (điểm mấu chốt để mở rộng)
| Lớp | Là gì | Ví dụ | Dùng ở |
|---|---|---|---|
| **Core** | Luật chung mọi công việc | Gate, chờ anh duyệt, grill-me, "có bằng chứng mới nói xong", role `parent` | Mọi tầng |
| **Pack** | Bộ quy trình cho **một loại công việc**: role, bước, mẫu hồ sơ | **Coding** = my-ship (scout, implementer, verifier, reviewer, K0–K7) · **Content** (researcher, writer, editor) · **Support** (triage, debugger) | Tầng chọn pack đó |
| **Profile** | Thông tin riêng **một dự án** | `ship-profile.md` của Joy: branch, surface, Standards riêng | Đúng một tầng |

> [!tip] 💡 Vì sao chia 3 lớp
> - Thêm **dự án mới cùng loại** (một repo code khác): chỉ cần viết **Profile** (14 mục), dùng lại Pack Coding.
> - Thêm **loại công việc mới** (viết nội dung, support): viết một **Pack** mới, dùng lại Core.
> - Sửa một luật chung (VD cách hỏi anh): sửa **Core** một lần, mọi tầng ăn theo.
> - my-ship đang trộn Core và Pack Coding. Cần tách nhẹ, xem **G16**.

### 3.2 Mỗi Pack khai báo cho web 4 thứ
1. **Phòng ở đâu**: VD Coding = `git worktree list` + `.claude/ship/<slug>/`; Content = các thư mục `jobs/<slug>/`.
2. **Các bước**: VD Coding = Gate 1 → Gate 2 → Phase → Review → Ship; Content = Ý tưởng → Nghiên cứu → Viết → Duyệt → Đăng.
3. **Các role**: tên, avatar, model.
4. **Bảng nhãn hồ sơ**: file nào → tên tiếng Việt, "là gì", "đọc khi".

Nhờ vậy web **không cần biết** công việc cụ thể là gì, chỉ đọc khai báo của pack.

---

## 4️⃣ Web làm gì / không làm gì
| ✅ Làm | ❌ Không làm (flow + harness đã lo) |
|---|---|
| Hiện tầng, phòng, nhân viên và trạng thái | Điều phối role, gọi subagent, luật tự động |
| Tủ hồ sơ có nhãn, mở md/html/ảnh/log **ngay trong trang** | Commit, push, deploy |
| Nổi bật việc **chờ anh**, chỉ báo cáo cần đọc | Tự quyết thay anh |
| **Chat với Parent** từng phòng | Chat với từng nhân viên (muốn hỏi ai thì nhắn Parent) |
| **Chat với Thư ký** (phòng thư ký) | |
| **Lịch trực**: xem, bật/tắt việc định kỳ, đọc kết quả | |
| **Sổ tay harness**: xem và sửa Core / Pack / Profile, có diff | |
| Token theo role | Chi phí $, ngân sách |

---

## 5️⃣ Màn hình
### 5.1 🏢 Văn phòng
- Thanh trên có **bộ chọn tầng**: "Toàn công ty" hoặc từng dự án. Chọn "Toàn công ty" thì phòng của mọi tầng hiện chung, mỗi phòng có nhãn tầng.
- Đầu trang là **Phòng thư ký**: avatar thư ký, nút **💬 Chat với Thư ký**, tóm tắt **Lịch trực** (việc sắp chạy, việc vừa chạy, việc lỗi).
- Mỗi phòng là một thẻ: tên việc, tầng, flow, bước hiện tại, dòng NOW, số hồ sơ mới, token. Nhân viên anime có biểu cảm theo trạng thái.
- Phòng chờ anh viền vàng, luôn nằm đầu. Lọc: tất cả / đang làm / chờ anh / xong.

### 5.2 📁 Phòng: tủ hồ sơ + chat Parent
- Thanh bước lấy theo pack của tầng.
- Hộp 🚦 (nếu có): câu hỏi nguyên văn + "📖 Đọc trước khi quyết". Bấm A/B/C chính là nhắn cho Parent.
- Tab **Hồ sơ** (3 cột: phòng ban · danh sách có nhãn · trình xem tại chỗ, nút ⤢ phóng to trong trang).
- Tab **💬 Chat với Parent**: tin xếp hàng khi Parent bận, link mở thẳng hồ sơ.
- Tab **Timeline**, tab **Token theo role**.
- Không bao giờ mở tab mới.

### 5.3 🛎️ Phòng thư ký
**Thư ký** là một session Claude **chung**, không gắn với việc nào. Nó chạy ở một thư mục riêng (VD `~/ai-office/hq`) và đọc được danh sách tầng.

| Anh nhờ thư ký | Thư ký làm |
|---|---|
| "Hôm nay các phòng sao rồi?" | Đọc trạng thái mọi tầng, trả lời kèm link hồ sơ |
| "Thêm Standard này cho verifier" | Soạn thay đổi → hiện **diff trong Sổ tay harness** → anh duyệt |
| "Mở việc mới: sửa popup iOS ở Joy" | Gọi bước mở phòng của tầng Joy (worktree + `/ship-fix`) sau khi anh xác nhận |
| "Kiểm tra CI branch X" / "đọc log lỗi Y" | Kiểm tra, trả lời kèm bằng chứng |
| "Mỗi sáng 8h tóm tắt các phòng" | Tạo việc trong **Lịch trực**, anh duyệt |

**Lịch trực** (việc định kỳ):
- Danh sách job gồm: tên, tầng, lịch chạy (VD `0 8 * * 1-5`), lần chạy gần nhất, kết quả, nút bật/tắt và "Chạy ngay".
- Mỗi lần chạy sinh **một hồ sơ** trong tủ của phòng thư ký (VD "Báo cáo sáng 13/10"), đọc ngay trong trang.
- Ví dụ job: tóm tắt các phòng mỗi sáng · nhắc phòng chờ anh quá 2 giờ · kiểm tra phòng đứng yên quá 1 ngày · dọn worktree đã merge (chỉ đề xuất, anh duyệt).

### 5.4 📒 Sổ tay harness (theo 3 lớp)
- Cây bên trái gồm **Core** · **Pack: Coding / Content / …** · **Profile: Joy / dev-note / …** · Hooks (chỉ xem).
- Mỗi role có đủ 6 mục (Does / Does not / Input / Output / Stop when / Standards), model, bước chạy, và **ảnh hưởng** (tầng/phòng nào đang dùng).
- Nhãn phạm vi cho biết sửa ở đây ảnh hưởng tới đâu: **CORE** (mọi tầng) · **PACK** (các tầng dùng pack đó) · **PROFILE** (một tầng).
- 3 cách sửa, cách nào cũng **xem diff → duyệt**: ✏️ sửa trực tiếp · ＋ thêm role / thêm pack / thêm dự án bằng wizard · 🤖 nhờ Thư ký soạn.
- Có lịch sử thay đổi và bản cũ để hoàn tác.
- **＋ Thêm dự án**: chọn thư mục → chọn pack → web tạo profile theo mẫu của pack (VD 14 mục của my-ship) → tầng mới hiện lên.

### 5.5 🚦 Chờ anh
- Gom việc chờ của **mọi tầng** (cả của thư ký), mỗi dòng: câu hỏi + nút mở hồ sơ.

### 5.6 📊 Báo cáo
- Báo cáo ngày (do thư ký viết qua Lịch trực) · Token theo role (theo tầng, theo phòng) · Chất lượng.

### 5.7 Nhãn hồ sơ (bắt buộc)
Tên tiếng Việt · **Là gì** · **Đọc khi** · ai viết + model · file · trạng thái (Mới / Đã đọc / Fail / Chưa có). Bảng nhãn của pack Coding nằm ở [[3 - Hồ sơ phòng ban]].

---

## 6️⃣ Nguồn dữ liệu (file local, không cần API key)
| Thông tin | Đọc từ |
|---|---|
| Danh sách tầng | `~/ai-office/projects.json`: tên, thư mục, pack |
| Khai báo pack | `packs/<pack>/office.yaml` (phòng ở đâu, bước, role, bảng nhãn) |
| Phòng của tầng Coding | `git worktree list` + `.claude/ship/<slug>/` |
| Trạng thái phòng | Khối state + dòng NOW + "Waiting on user" trong `progress.md` |
| Trạng thái từng nhân viên | `events.jsonl` do hook ghi *(G2)* |
| Chat Parent / Thư ký | Transcript của session (id do hook `ship-state-sync` ghi) |
| Lịch trực | `~/ai-office/schedule.yaml` + kết quả ở `~/ai-office/hq/runs/` |
| Token theo role | Usage trong transcript từng subagent |

Web theo dõi thay đổi file nên tự cập nhật.

---

## 7️⃣ Yêu cầu phi chức năng
- **Chỉ chạy local** trên Mac mini, bind `127.0.0.1`. Ở nhà truy cập qua Tailscale *(G12)*.
- **Chỉ ghi khi anh duyệt**: chat (gửi tin), sửa harness (sau diff), bật/tắt lịch trực, mở việc (sau xác nhận). Không ghi file việc của flow.
- **Không lộ secret**: không đọc `.env`; html chạy trong iframe `sandbox`.
- **Nhẹ**: một lệnh chạy, không cần database.
- Cập nhật < 2 giây sau khi file đổi.
- **Thêm dự án hoặc pack không cần sửa code web**, chỉ thêm khai báo.

---

## 8️⃣ Tiêu chí nghiệm thu
- [ ] Thấy đủ phòng của **mọi tầng** đã đăng ký, đúng bước và NOW
- [ ] Phòng chờ anh nổi bật, câu hỏi đúng nguyên văn
- [ ] Mọi file của phòng có trong tủ hồ sơ, đủ nhãn, mở tại chỗ, **0 tab mới**
- [ ] Chat Parent và chat Thư ký gửi/nhận được, tin xếp hàng khi bận
- [ ] Một job Lịch trực chạy đúng giờ và sinh hồ sơ kết quả
- [ ] Sửa một Standard trên Sổ tay → có diff → duyệt → file đổi đúng
- [ ] Thêm một dự án mới (pack Coding) bằng wizard → tầng mới hiện lên, không sửa code web

---

## 9️⃣ Đánh giá và tối ưu so với bản trước
| Bản trước | v2 | Vì sao |
|---|---|---|
| Chỉ Joy (G8 đề xuất "chỉ Joy cho v1") | **Mô hình nhiều tầng ngay từ đầu**, v1 có thể chỉ đăng ký mỗi Joy | Thêm cấu trúc tầng về sau sẽ phải đập lại dữ liệu và UI. Làm từ đầu thì gần như không tốn thêm |
| Phòng = git worktree | Phòng do **pack khai báo** | Việc nội dung/support không có worktree |
| Role cố định của my-ship | Role theo **pack** | Mỗi loại công việc có đội riêng |
| Không có chỗ cho session linh tinh | **Phòng thư ký + Lịch trực** | Giải V6, có chỗ cho cron |
| Nhân sự & Model là màn riêng | Gộp vào **Sổ tay harness** | Model là một phần của role card, tránh hai chỗ sửa |
| Giao việc là một wizard riêng | **Nhờ Thư ký** (chat) hoặc nút "+ Việc mới" theo tầng | Một chỗ, đỡ trùng chức năng |
| Luật tự động, chi phí $ | **Bỏ** (đã chốt) | Harness lo điều phối; chỉ cần token |

> [!warning] ⚠️ Rủi ro mới cần chặn
> - **Thư ký có quyền rộng** (đụng mọi tầng): mọi thay đổi của thư ký đều phải qua diff hoặc xác nhận, giống anh tự sửa.
> - **Session thư ký sống lâu thì phình ngữ cảnh** *(G15)*.
> - **Job định kỳ cần máy thức**: Mac không được ngủ, và job phải chạy local vì cần đọc file local *(G17)*.
> - **Tách Core khỏi my-ship** dễ làm vỡ Joy đang chạy ổn *(G16)*: tách theo kiểu thêm, không sửa.

---

## 🔟 Grill me — cần anh chốt
**Đã chốt:**
- ✅ **G1** Trả lời 🚦 qua chat với Parent. Không chat với từng nhân viên.
- ✅ Bỏ màn Luật tự động, bỏ chi phí $, chỉ hiện token theo role.
- ✅ Có Sổ tay harness để sửa harness trên web.
- ✅ (v2) Cần Phòng thư ký và hướng nhiều dự án / nhiều loại công việc.

**Còn mở** (mỗi câu đều có đề xuất):

**G2 · Trạng thái từng nhân viên lấy từ đâu?** A) chỉ bước của cả phòng · B) hook nhỏ `SubagentStart/Stop` ghi `events.jsonl`. **Đề xuất B.** Hook chỉ ghi file, không đổi flow.

**G3 · Báo cáo chỉ nằm trong chat (implementer, reviewer, thẻ quyết định)?** A) hook `SubagentStop` lưu thành `reports/<role>-<bước>.md` · B) bỏ qua. **Đề xuất A**, gộp chung hook với G2.

**G4 · Lệnh `open` (bật tab) có thay không?** A) thay bằng thông báo "hồ sơ mới" trên web · B) giữ song song. **Đề xuất A**, vì đó là nguồn gốc V2.

**G7 · Phòng đã xong / merge?** A) chuyển vào "Lưu trữ", vẫn đọc được · B) xoá. **Đề xuất A.**

**G10 · Bỏ màn Nhân sự & Model và màn Giao việc riêng?** A) bỏ (gộp vào Sổ tay harness và Thư ký) · B) giữ. **Đề xuất A.**

**G12 · Truy cập từ nhà?** A) Tailscale · B) deploy public có đăng nhập. **Đề xuất A**, vì web gửi lệnh vào máy công ty. Điều kiện: Mac không ngủ, hỏi IT về Tailscale.

**G13 · Sửa harness theo cách nào?** A) chỉ chat · B) chỉ sửa trên web · C) kết hợp: việc nhỏ sửa trực tiếp, việc lớn nhờ Thư ký soạn, đều xem diff. **Đề xuất C.** Luật "Standards chỉ thêm khi anh đồng ý" vẫn giữ, vì bấm Duyệt chính là đồng ý.

**G14 · Lịch sử harness lưu ở đâu?** (`.claude/` đang bị git bỏ qua) A) web tự lưu `.history/` · B) đưa harness vào repo riêng `dotclaude`. **Đề xuất B**, giải luôn bài toán sync Mac↔Windows.

**G15 · Session thư ký sống thế nào?**
- A) Một session sống mãi, `/compact` khi đầy
- B) **Mỗi ngày một session mới**; cuối ngày tự viết handoff (skill `handoff` có sẵn) để session hôm sau đọc lại
- C) Mỗi chủ đề một session
- **Đề xuất B.** Lý do: không phình ngữ cảnh, vẫn nhớ việc nhờ handoff, lịch sử theo ngày dễ tra.

**G16 · Tách Core khỏi my-ship thế nào?**
- A) Tách hẳn: repo `my-ship` thành `core/` + `packs/coding/`
- B) **Tách nhẹ**: giữ my-ship nguyên như hiện tại (coi là Pack Coding), chỉ rút những luật thật sự chung (grill-me, gate protocol, role parent) ra `core/` khi có pack thứ hai cần dùng
- **Đề xuất B.** Lý do: Joy đang chạy ổn, chưa cần tách khi chưa có pack thứ hai. Tránh làm vỡ thứ đang chạy.

**G17 · Lịch trực chạy bằng gì?**
- A) **launchd/cron trên Mac** gọi `claude -p "<việc>"` trong thư mục của tầng
- B) Claude Code scheduled task trên cloud (`/schedule`)
- **Đề xuất A.** Lý do: job cần đọc file local (worktree, progress.md). Cloud không thấy máy anh.

**G18 · Pack thứ hai làm gì trước?**
- A) **Content** (đã có skill `news-daily`, `kich-ban`, `news-video` trong vault dev-note)
- B) **Support** (Joy có sẵn agent `support-triage`)
- C) Chưa cần, làm xong tầng Joy đã
- **Đề xuất C rồi tới B.** Lý do: Support gần Joy nhất, dùng lại được nhiều role. Content làm sau.

**G19 · Thư ký có được tự mở việc mới không?**
- A) Luôn hỏi anh trước khi mở
- B) Việc XS (`/ship-fix`) được tự mở, việc lớn hỏi
- **Đề xuất A cho v1.**

---

## ✅ Checklist
- [x] v1: G1, bỏ luật tự động, bỏ $, có Sổ tay harness
- [x] v2: thêm Phòng thư ký + Lịch trực, mô hình nhiều tầng + harness 3 lớp
- [ ] Anh trả lời G2–G19
- [ ] Mockup: thêm bộ chọn tầng, Phòng thư ký (chat + lịch trực), Sổ tay theo 3 lớp
- [ ] Chốt xong thì lên plan làm web
