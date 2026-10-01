---
tags: [work-brain, harness, plan]
created: 2026-10-01
status: kế hoạch — chưa xây
---

# Work brain — Tổng quan

**Mục tiêu:** một chỗ gọn, chỉ cho công việc. Mở Claude ở bất kỳ thư mục nào, agent cũng biết anh là ai, đang làm gì, làm việc theo kiểu nào.

**Trạng thái:** đang lên kế hoạch. Chưa tạo `~/work-brain`, chưa sửa/xoá/di chuyển file nào.

## Vì sao làm
1. Vault Obsidian chứa cả note học Java, TOEIC, tiếng Trung, Shopify… Agent đọc vào bị nhiễu.
2. Bộ nhớ agent rải ở 8 thư mục `~/.claude/projects/*/memory`. Mở agent ngoài thư mục `joy` là agent không biết gì.
3. `~/.claude` không có `CLAUDE.md` chung → không có "cửa vào" cho mọi agent.

## Đọc theo thứ tự
1. [[1-Hiện trạng]] — số liệu thật, đã kiểm trên máy ngày 2026-10-01
2. [[2-Cấu trúc đề xuất]] — **cấu trúc thật** của `~/work-brain`: vì sao chia vậy, sửa được 6 vấn đề gì, cái gì đã chứng minh / chưa, cách mở rộng
3. [[3-Cách agent đọc brain]] — `~/.claude/CLAUDE.md` trỏ về brain
4. [[4-Gom và lọc]] — từng file bộ nhớ cũ đi đâu
5. [[5-Giữ brain luôn mới]] — khi nào ghi, ghi ở đâu, ai dọn
6. [[6-Câu hỏi chốt]] — anh cần trả lời trước khi xây
7. [[7-Research và thiết kế lại]] — **đọc cái này trước** (cùng note 4 đã viết lại): research + thiết kế dùng skill có sẵn. Thay phần thiết kế ở note 2, 3, 5
8. [[8-Học liên tục]] — cơ chế để brain tự tốt lên: 3 vòng học + học bù từ phiên cũ
9. [[9-Kết quả học bù]] — 207 lần anh bực agent từ phiên cũ → 20 nhóm lỗi + 10 đề xuất chờ duyệt
10. [[10-Học cách anh quyết định]] — anh chọn khác AI 36% số lần → sổ tiền lệ để auto tự quyết như anh

## Lộ trình (sau khi anh chốt) — theo note 7
1. Tạo `~/work-brain` + `git init`, bật plugin `claude-obsidian` ở đó, chạy `/wiki` dựng khung → kiểm: có `wiki/index.md`, `hot.md`, `log.md`.
2. Viết 3 file `rules/` theo nhóm B, C, D ở [[4-Gom và lọc]] → kiểm: tổng dưới 200 dòng.
3. **Chép** (không di chuyển) 15 file nhóm E vào `.raw/`, chạy `wiki-ingest`, sửa 6 chỗ cũ → kiểm: mỗi file nguồn có trang đích.
4. Tạo `~/.claude/CLAUDE.md` + `~/.claude/rules/` trỏ về brain → kiểm: mở Claude ở `~/`, chạy `/context`, thấy file brain trong mục Memory files; hỏi "anh là ai, đang làm gì" → trả lời đúng.
5. `/doctor prompt-audit` → không còn mâu thuẫn giữa brain và `joy/CLAUDE.md`, `CLAUDE.local.md`.
6. Chạy song song 1 tuần với bộ nhớ cũ → anh duyệt → mới rút file khỏi `joy/memory`.

## Ràng buộc
- Không xoá, không di chuyển file cũ khi anh chưa duyệt. Bước đầu chỉ sao chép.
- Không chứa secret (token, key SA) trong brain. Chỉ ghi **đường dẫn** tới file secret.
- Viết cho agent đọc → tiếng Anh hoặc Việt đều được, nhưng mỗi file ngắn, 1 file 1 chủ đề.
