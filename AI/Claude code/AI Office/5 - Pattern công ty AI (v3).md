> [!quote] 💬
> "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations." — Melvin Conway

# 🏢 AI Office v3 — Pattern "Công ty AI"

> [!note] 📝 Trạng thái: **ý tưởng**, phần thực thi làm ở chỗ khác
> Bản này **thay cho cách chia** ở [[4 - Yêu cầu chuẩn - Web giải quyết vấn đề gì]] (bỏ tầng / pack / core / profile khỏi UI) và **bỏ giao diện dạng card** của mockup 2D.
> Những gì vẫn giữ từ note 4: tủ hồ sơ, chat với Parent, token theo role, sửa harness có diff, không có luật tự động, không có chi phí $.

---

## 🎯 1. Mục tiêu
**Quản lý agent bằng hình ảnh một công ty**: agent là nhân viên, dự án là phòng ban, mỗi việc là một **nhóm** có trưởng nhóm (Parent) riêng. Ở Joy, **mỗi workspace (bug check hoặc feature) là một nhóm**. Mình là giám đốc: giao việc, duyệt, đọc báo cáo. Thư ký lo việc lặt vặt và việc dựng thêm phòng ban.

> [!note] 📝 So sánh dễ hiểu
> Giống mở một công ty thật: lúc đầu chỉ có **phòng Joy**. Muốn làm thêm mảng mới thì bảo thư ký "mở thêm phòng Nội dung". Thư ký tuyển người, soạn quy trình cho phòng đó, rồi phòng mới xuất hiện trong văn phòng.

---

## 🧱 2. Cấu trúc tổ chức
```
🏢 Công ty AI
├── 🛎️ Thư ký ............ có mặt ở mọi nơi (nút nổi + quầy lễ tân)
├── 🧠 Bộ não công ty ..... second brain: luật chung + bộ não từng phòng ban
├── 🛍️ Phòng ban Joy ...... dự án Joy · workflow = my-ship (như hiện tại)
│     ├── 👥 Nhóm "bugfix/tier-benefits-click" (1 workspace = 1 bug) → Parent riêng + Scout, Implementer, Verifier, Reviewer
│     ├── 👥 Nhóm "feature/store-credit-display" (1 workspace = 1 feature) → Parent riêng + Product, Scout, Implementer, Verifier, Reviewer
│     └── ... mỗi bug / feature mới = mở thêm 1 nhóm
├── 📝 Phòng ban Nội dung . (mở sau, qua Thư ký) · workflow riêng: Nghiên cứu → Viết → Duyệt → Đăng
└── ＋ Lô trống ........... "Mở phòng ban mới" → chuyển sang chat Thư ký
```

| Khái niệm công ty | Thực tế bên dưới |
|---|---|
| **Phòng ban** | Một dự án (repo, vault, thư mục) |
| **Workflow của phòng ban** | Harness riêng của dự án: role, các bước, mẫu hồ sơ. Joy dùng my-ship, dự án khác **tự xây workflow riêng**, không bắt buộc giống ship |
| **Nhóm** | Một đơn vị việc. Ở **Joy: 1 workspace (worktree) = 1 bug check hoặc 1 feature = 1 nhóm**. Ở phòng ban khác do workflow của phòng đó quy định (VD 1 thư mục job) |
| **Trưởng nhóm (Parent)** | **Mỗi nhóm có một Parent riêng**, chính là session chính của workspace đó. Mình chỉ chat với Parent, không chat với từng nhân viên |
| **Nhân viên** | Agent theo role của workflow phòng ban đó |
| **Thư ký** | Một session chung của cả công ty |
| **Bộ não công ty** | Harness + kiến thức, quản lý như second brain |

> [!tip] 💡 Nguyên tắc mở rộng
> - **Web không biết workflow cụ thể.** Mỗi phòng ban chỉ khai báo một "hợp đồng" nhỏ (mục 4), web đọc hợp đồng đó để vẽ.
> - **Setup phòng ban mới đi qua Thư ký**, không làm wizard phức tạp trên UI. Mình nói bằng lời, Thư ký dựng, mình duyệt diff.
> - Phòng ban nào tổ chức thế nào là việc của phòng ban đó: số role, tên bước, mẫu hồ sơ đều khác nhau được.

---

## 🛎️ 3. Thư ký
- **Ở đâu:** nút nổi góc phải dưới, có ở mọi màn hình; đồng thời ngồi ở **quầy lễ tân** trong văn phòng 3D.
- **Là gì:** một session Claude chung, không gắn với việc nào, đọc được mọi phòng ban.
- **Việc của thư ký:**

| Mình nói | Thư ký làm |
|---|---|
| "Hôm nay các phòng sao rồi?" | Tóm tắt mọi phòng ban, kèm link hồ sơ |
| "Mở phòng ban mới: Nội dung" | Dựng workflow (role, bước, mẫu hồ sơ) + thông tin dự án vào Bộ não → mình duyệt diff → phòng ban hiện lên |
| "Mở việc mới ở Joy: …" | Mở nhóm mới trong phòng Joy (worktree + `/ship…`) sau khi mình xác nhận |
| "Thêm luật này cho verifier" | Soạn diff vào Bộ não → mình duyệt |
| "Mỗi sáng 8h báo cáo cho anh" | Tạo job trong **Lịch trực** → mình bật |
| Câu hỏi lung tung, kiểm tra CI, đọc log | Trả lời kèm bằng chứng |

- **Lịch trực:** danh sách job định kỳ (bật/tắt, chạy ngay). Mỗi lần chạy sinh một hồ sơ, đọc ngay trong web.

---

## 🧩 4. "Hợp đồng" tối thiểu của một phòng ban
Để web hiển thị được một phòng ban bất kỳ, phòng ban đó chỉ cần khai báo:

| # | Khai báo | Joy (my-ship) | Nội dung (ví dụ) |
|---|---|---|---|
| 1 | **Nhóm nằm ở đâu** | Mỗi worktree (bug/feature) có `.claude/ship/<slug>/` = 1 nhóm | `jobs/<slug>/` |
| 2 | **Trạng thái một việc** | khối state + dòng NOW trong `progress.md` | `status.md` |
| 3 | **Các bước** | Gate 1 → Gate 2 → Phase → Review → Ship | Ý tưởng → Nghiên cứu → Viết → Duyệt → Đăng |
| 4 | **Nhân viên (role)** | product, scout, parent, implementer, verifier, reviewer | researcher, parent, writer, editor |
| 5 | **Bảng nhãn hồ sơ** | `progress.md` → "Tiến độ"… ([[3 - Hồ sơ phòng ban]]) | `draft.md` → "Bản nháp"… |
| 6 | **Cách nói chuyện với trưởng nhóm** | session id do hook `ship-state-sync` ghi | tương tự, mỗi workflow tự ghi |

Một file khai báo cho mỗi phòng ban, ví dụ `office.yaml` trong bộ não của phòng đó. Thư ký viết file này khi dựng phòng ban mới.

---

## 🧠 5. Bộ não công ty (second brain)
- **Luật chung của công ty:** cách hỏi giám đốc (grill-me), chờ ở gate, "có bằng chứng mới nói xong", luật của Thư ký, Lịch trực.
- **Bộ não từng phòng ban:** workflow (role card, các bước, Standards) + thông tin dự án (profile).
- **Sửa:** việc nhỏ thì sửa trực tiếp trên web; việc lớn thì nhờ Thư ký soạn. Cả hai đều **xem diff → duyệt**, có lịch sử thay đổi.
- Lưu ở đâu: xem câu **Q1**.

---

## 🎮 6. Hướng UI 3D
### 6.1 Bố cục
```
┌ Thanh trên: [Công ty AI] [🏢 Văn phòng | 🚦 Chờ duyệt | 📊 Báo cáo | 🧠 Bộ não]  [🏢 Toàn công ty][🛍️ Joy][＋ Phòng ban mới]  [☀️/🌙] [＋ Việc mới] ┐
│ HUD nhỏ góc trái: việc đang mở · nhân viên đang làm · chờ duyệt · token hôm nay                                         │
│                                                                                                                        │
│            🏢 VĂN PHÒNG 3D ISOMETRIC (toàn màn hình, góc nhìn chéo như ảnh ClawExperts)                                 │
│     [🛎️ quầy lễ tân + Thư ký]   [🛍️ PHÒNG JOY: các nhóm bàn có vách kính]   [＋ lô trống: phòng ban mới]               │
│                                                                                                                        │
│ Chú thích màu trạng thái (góc trái dưới)                                                    [🧑 Thư ký 💬] nút nổi     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
       Bấm nhóm / nhân viên → NGĂN TRƯỢT từ phải: tủ hồ sơ · chat Parent · timeline · token (văn phòng vẫn ở phía sau)
```

### 6.2 Trong văn phòng 3D
- **Phòng ban** là một khu sàn có biển tên lớn: "🛍️ PHÒNG JOY · 6 việc · 2 chờ anh".
- **Mỗi nhóm** (ở Joy = một workspace bug/feature) là một **cụm bàn có vách kính**, Parent ngồi ở bàn đầu. Biển tên nhỏ ghi tên nhóm (branch), bug hay feature, trạng thái và số hồ sơ mới. Nhóm chờ duyệt có **vòng sáng vàng nhấp nháy** dưới sàn.
- **Nhân viên** là nhân vật anime (giữ bộ SVG đã vẽ) ngồi sau bàn. Màn hình máy tính **sáng khi đang làm**. Bong bóng trên đầu hiện "…" (đang làm), 🚦 (chờ), ⚠️ (lỗi).
- **Bấm nhóm bàn** → ngăn trượt mở hồ sơ của việc. **Bấm nhân viên** → mở thẳng hồ sơ của role đó. Hover → tooltip (đang làm gì, model, token).
- **Chip phòng ban** trên thanh trên → camera bay tới phòng ban đó.
- **Lô trống "＋ Phòng ban mới"** (viền nét đứt) → mở chat Thư ký với câu soạn sẵn.
- **Ngày/Đêm:** đổi ánh sáng; ban đêm màn hình phát sáng rõ hơn.
- Kéo để xoay, cuộn để zoom, giới hạn góc để không lật ngược.

### 6.3 Thanh nav mới (so với bản cũ)
| Cũ | Mới |
|---|---|
| Sidebar trái 6 mục | Thanh trên gọn: 4 mục + chip phòng ban |
| Văn phòng là danh sách card | Văn phòng là cảnh 3D toàn màn hình |
| Phòng thư ký là một mục nav | Thư ký là **nút nổi ở mọi nơi** + quầy lễ tân trong 3D |
| Sổ tay harness + Nhân sự & Model | Gộp thành **🧠 Bộ não công ty** |
| Các màn thay nhau chiếm cả trang | **Ngăn trượt** đè lên 3D, đóng lại là về văn phòng |

### 6.4 Công nghệ 3D — đánh giá
| Cách | Ưu | Nhược | Hợp khi |
|---|---|---|---|
| **three.js** (WebGL) + OrbitControls + CSS2D label | 3D thật, xoay/zoom mượt, label là DOM nên bấm dễ, nhân vật SVG dùng làm sprite | Tự viết bố cục, cần tối ưu khi nhiều phòng | **Đề xuất** cho bản thật |
| CSS isometric (transform `rotateX/rotateZ`) | Không cần thư viện, nhẹ, click DOM tự nhiên | Không xoay tự do, khó làm ánh sáng | Bản nhẹ / mobile |
| React Three Fiber (three.js theo kiểu React) | Hợp nếu web viết bằng React, quản lý state gọn | Thêm build step | Khi web chính dùng React |
| Game engine nhẹ (PlayCanvas, Babylon.js) | Có sẵn editor, hiệu ứng đẹp | Nặng, học thêm | Muốn "game hoá" nhiều |

> [!warning] ⚠️ Cẩn thận
> - 3D là để **dễ nhìn**, không thay được tủ hồ sơ. Mọi thông tin quan trọng vẫn đọc trong ngăn trượt 2D.
> - Điện thoại nên có **chế độ 2D đơn giản** (danh sách phòng ban → việc).
> - Nhiều phòng ban thì phải gom hoặc ẩn chi tiết khi zoom xa (level of detail).

---

## 🔁 7. Khác gì so với v2
| v2 | v3 |
|---|---|
| Tầng + Core / Pack / Profile lộ ra UI | Chỉ còn **Phòng ban**. Workflow là chuyện bên trong mỗi phòng ban |
| Wizard "Thêm dự án", "Thêm pack" | **Bảo Thư ký**, duyệt diff |
| Phòng thư ký là một khu card | Thư ký **ở mọi nơi** |
| Card, lưới | **3D isometric** + ngăn trượt |
| Sổ tay harness | **Bộ não công ty** (second brain) |

---

## ❓ 8. Câu hỏi còn mở
- **Q1 · Bộ não công ty lưu ở đâu?**
  - A) Trong `.claude/` của từng dự án như hiện tại
  - B) **Một vault Obsidian riêng làm second brain** (có plugin `claude-obsidian`), từng dự án link sang
  - C) Repo `dotclaude` (đã tính cho việc sync Mac↔Windows)
  - **Đề xuất C + đọc được từ Obsidian:** git giữ lịch sử và sync, Obsidian để đọc và tra cứu.
- **Q2 · Tech 3D?** Đề xuất **three.js** (hoặc React Three Fiber nếu web dùng React), kèm chế độ 2D cho điện thoại.
- **Q3 · Phòng ban mới cần tối thiểu gì?** Đề xuất đúng 6 khai báo ở mục 4; Thư ký sinh từ mẫu.
- **Q4 · Session Thư ký:** mỗi ngày một session + handoff (như G15 ở note 4)?
- **Q5 · Lịch trực:** chạy launchd trên Mac (như G17)?
- Các câu cũ G2, G3, G4, G7, G12, G14 ở note 4 vẫn còn hiệu lực.

---

## ✅ Checklist
- [x] Chốt pattern: công ty → phòng ban (dự án) → việc → nhân viên; Thư ký ở mọi nơi; Bộ não công ty
- [x] Phác hướng UI 3D + thanh nav mới
- [ ] Trả lời Q1–Q5
- [x] Mockup theo pattern (sơ đồ mặt bằng, không 3D), xem ghi chú bên dưới
- [ ] Thực thi ở chỗ khác

> [!tip] 💡 Mockup chốt dùng (12/10): **dạng card**, `mockup/ai-office-mockup.html`
> Bản online: https://claude.ai/artifact/VP25oJznubwJ8EQqM1n9Wd
> - **Sidebar**: nhóm *Công ty* có 🛎️ Phòng thư ký (chat + lịch trực + hồ sơ trực); nhóm *Phòng ban*: 🏢 Toàn công ty · 🛍️ Phòng Joy · (phòng mới) · ＋ Phòng ban mới, cùng 🚦 Chờ duyệt. Vào thẳng Phòng Joy. Mỗi card là **một nhóm** (workspace bug/feature) có Parent riêng.
> - Thư ký là nút nổi ở mọi màn; khối Thư ký trên văn phòng chỉ hiện ở "Toàn công ty".
> - Đã bỏ: Báo cáo, token, Sổ tay harness, Nhân sự & Model, Activity, Việc mới, dropdown chọn tầng.
>
> Bản sơ đồ mặt bằng dưới đây **không dùng nữa** (link online đã xoá):
>
> ~~Mockup sơ đồ mặt bằng: `mockup/ai-office-company.html`~~
> - **Sơ đồ mặt bằng văn phòng**, không dùng card: sảnh Thư ký (quầy lễ tân + bảng tin chờ duyệt + bảng lịch trực) → **Phòng Joy** có tường bao và biển tên → mỗi **nhóm** là một **bàn họp**: Parent 👑 ngồi đầu bàn, nhân viên ngồi quanh, viền màu theo trạng thái, nhãn BUG/FEATURE → **lô trống "＋ Phòng ban mới"**.
> - **Thanh nav = các phòng ban**: 🏢 Toàn công ty · 🛍️ Phòng Joy · (phòng ban mới khi Thư ký mở) · ＋ Phòng ban mới. Bên phải chỉ có 🚦 Chờ duyệt (tính mọi phòng ban). **Nút Thư ký nổi ở mọi màn**. Mở web là vào thẳng Phòng Joy.
> - **Đã bỏ (12/10, chưa cần):** Báo cáo, mọi số token, ô số liệu góc trên, nút Activity, nút "Việc mới" (mở nhóm mới thì nhờ Thư ký), **màn Sổ tay harness / Bộ não** (sửa harness thì nhắn Thư ký; mục 5 bên trên chỉ còn là khái niệm, không có màn riêng).
> - Bấm bàn → ngăn trượt hồ sơ nhóm (tủ hồ sơ, chat Parent, timeline, token). Bấm người → hồ sơ của role đó.
> - Thử: bấm lô trống → chat Thư ký → "Mở phòng ban mới: Nội dung" → **phòng Nội dung xuất hiện** với workflow riêng (Researcher, Writer, Editor).
> - Kéo để di chuyển, Ctrl+cuộn hoặc nút ＋/－ để zoom.
>
> Bản 2D dạng card cũ vẫn ở `mockup/ai-office-mockup.html` để đối chiếu.
