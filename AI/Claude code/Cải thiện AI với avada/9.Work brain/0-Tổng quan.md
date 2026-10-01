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
2. [[2-Cấu trúc đề xuất]] — brain gồm những folder nào, mỗi folder chứa gì
3. [[3-Cách agent đọc brain]] — `~/.claude/CLAUDE.md` trỏ về brain
4. [[4-Gom và lọc]] — từng file bộ nhớ cũ đi đâu
5. [[5-Giữ brain luôn mới]] — khi nào ghi, ghi ở đâu, ai dọn
6. [[6-Câu hỏi chốt]] — anh cần trả lời trước khi xây

## Lộ trình (sau khi anh chốt)
1. Tạo `~/work-brain` + `git init` → kiểm: `git status` sạch.
2. **Sao chép** (không di chuyển) file từ các nguồn theo [[4-Gom và lọc]] → kiểm: mỗi file nguồn có dòng đích trong bảng.
3. Viết `~/.claude/CLAUDE.md` ngắn → kiểm: mở Claude ở `~/` hỏi "anh là ai, đang làm gì" → trả lời đúng.
4. Chạy thử 1 tuần song song với bộ nhớ cũ.
5. Anh duyệt → mới dọn bộ nhớ cũ (xoá/rút gọn index trỏ về brain).

## Ràng buộc
- Không xoá, không di chuyển file cũ khi anh chưa duyệt. Bước đầu chỉ sao chép.
- Không chứa secret (token, key SA) trong brain. Chỉ ghi **đường dẫn** tới file secret.
- Viết cho agent đọc → tiếng Anh hoặc Việt đều được, nhưng mỗi file ngắn, 1 file 1 chủ đề.
