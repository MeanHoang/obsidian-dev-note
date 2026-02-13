Claude Code là tool của Anthropic thiết kế để làm việc trực tiếp trong codebase, nên cách dùng hiệu quả **khác hoàn toàn** so với chat AI thông thường.

Dưới đây là những gợi ý thực tế nhất:
# 1️⃣ Luôn bắt đầu bằng “hiểu hệ thống”
❌ Sai lầm: hỏi sửa bug ngay  
✅ Đúng: bắt Claude phân tích trước
Ex:
```json
Explain the architecture of this project.
Focus on authentication flow.
```
or 
```json
Trace how a request from frontend goes to database.
```
👉 Bạn đang làm nhiều project fullstack, nên việc trace flow từ React → Express → MySQL cực kỳ hợp lý.
# 2️⃣ Khi sửa bug: đưa đủ context
Đừng nói:
```json
Fix this bug.
```
Hãy nói:
```json
Here is the error:
...
Steps to reproduce:
...
What is the root cause?
...
Propose a minimal fix.
```
🔥 Quan trọng: luôn hỏi “root cause” trước khi sửa.  
Nếu không bạn sẽ chỉ patch tạm.
# 3️⃣ Dùng Plan Mode khi thay đổi lớn
Nếu bạn:
- Refactor auth
- Đổi database structure
- Viết lại caching logic
- Thêm JWT flow
Đừng cho nó sửa ngay.
Hãy yêu cầu:
```json
Create a step-by-step refactor plan.
Do not modify code yet.
```
Việc này giống như design trước khi code — cực kỳ quan trọng nếu project lớn (như social network bạn từng muốn làm).

# 4️⃣ Chia nhỏ nhiệm vụ
Claude Code làm tốt khi bạn:
- Chia task lớn thành nhiều bước nhỏ
- Yêu cầu review từng bước
Ví dụ thay vì:
```json
Build a complete user management system.
```
Hãy làm 
```json
Step 1: Design database schema.
Step 2: Create controller layer.
Step 3: Create service layer.
Step 4: Add validation.
Step 5: Write tests.
```
# 5️⃣ Dùng nó như senior reviewer
Cực mạnh khi bạn hỏi:
```json
Review this file.
Focus on performance and edge cases.
```
Or
```json
What are potential race conditions here?
```
Với Redis, cache, JWT — kiểu câu hỏi này sẽ giúp bạn tiến bộ rất nhanh.
# 6️⃣ Khi code phức tạp → yêu cầu sơ đồ logic
Ví dụ bạn từng hỏi về invalidate cache theo event — với mấy hệ thống lộn xộn như vậy, hãy hỏi:
```json
Draw a logical flow of this function.
List possible edge cases.
```
Claude rất giỏi phân tích logic branching.
# 7️⃣ Đừng lạm dụng “generate full project”
Claude Code mạnh ở:
- Phân tích
- Refactor
- Bug fixing
- Code review
Nó yếu hơn ở:
- Sinh project 100% từ 0 rồi bạn copy về
Muốn học thật → hãy để nó giúp bạn tư duy.
Claude Code không phải “viết hộ bạn”  
Nó là:
👉 Trợ lý phân tích  
👉 Reviewer  
👉 Kiến trúc sư phụ
Nếu bạn dùng nó để học cách nghĩ như senior, bạn sẽ lên trình rất nhanh.