Workflows là **quy trình làm việc nhiều bước** được gợi ý trong `CLAUDE.md` của project. Không phải tính năng riêng, mà là cách kết hợp các skills/commands theo thứ tự hợp lý.
### Project Joy có 3 workflows chính:

**1. New Feature (Tạo tính năng mới):**
```
/plan → implement → /test → /review → /impact
```
**2. Bug Fix (Sửa lỗi):**
```
/debug → /fix → /test
```
**3. Before Merge (Trước khi merge MR):**
```
/test → /review → /perf → /impact
```
### Ví dụ thực tế:

Bạn muốn thêm feature mới:

1. `/plan thêm tính năng X` — Claude lên kế hoạch
2. Bạn implement theo plan
3. `/test` — Chạy test kiểm tra
4. `/review` — Code review theo chuẩn Avada
5. `/impact` — Phân tích ảnh hưởng trước khi merge