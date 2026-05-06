> [!quote] 💬
> *"The model executes while the developer ensures scope, clarity, verification, and judgment."*
> — tinh thần chốt từ tweet của Andrej Karpathy (01/2026)

## 🎯 Topic là gì?
Tháng 1/2026, **Andrej Karpathy** (cựu Director of AI tại Tesla, founding member OpenAI) post trên X một loạt note sau vài tuần dùng **Claude Code** để code. Note này tổng hợp **3 failure mode** chính của coding agent + cách shift mindset khi dev cùng AI. Sau đó cộng đồng convert thẳng các quan sát này vào file `CLAUDE.md` để ép agent tuân thủ.
> [!note] 📝 So sánh dễ hiểu
> Giống như thuê một thực tập sinh **siêu nhanh, không biết mệt, nhưng hay tự suy diễn**: bạn không còn ngồi gõ từng dòng nữa, mà chuyển sang vai trò **review + định hướng + chốt success criteria**. Nếu không kiểm soát, nó sẽ tự ý sửa thêm 5 file khác "cho gọn" rồi để bug khắp nơi.

---
## 📊 Sự dịch chuyển workflow của Karpathy
| Thời điểm | Manual + Autocomplete | Agent-driven |
|---|---|---|
| Tháng 11/2025 | 80% | 20% |
| Tháng 1/2026 | 20% (chỉ edit/touchup) | **80%** |

→ Trong **2 tháng**, LLM đi từ "công cụ phụ" thành **trung tâm** của quy trình code.

---
## ⚠️ 3 Failure Mode chính

### 1️⃣ Silent Assumptions — Giả định ngầm
Model tự đoán ý bạn rồi chạy luôn, **không hỏi lại** dù task mơ hồ.
> [!warning] ⚠️ Triệu chứng
> - Không seek clarification khi requirement hai nghĩa
> - Không surface inconsistency
> - Không present trade-offs
> - Không push back khi requirement vô lý

```js
// ❌ Bad: User bảo "thêm cache cho hàm getUser"
// Agent tự chọn Redis, TTL 1h, key pattern `user:{id}` — không hỏi gì
function getUser(id) {
  return redis.get(`user:${id}`) ?? db.users.findById(id);
}

// ✅ Good: Agent hỏi trước
// "Cache trong-memory hay Redis? TTL bao lâu? Invalidate khi nào?"
// → confirm xong mới code
```

### 2️⃣ Over-complication — Làm quá phức tạp
Agent thích **bloat abstraction**, viết 1000 dòng cho việc 100 dòng làm xong.
> [!danger] ⛔ Tuyệt đối tránh
> - Tạo abstraction cho code chỉ dùng 1 lần
> - Generic interface cho use case duy nhất
> - "Speculative flexibility" — design cho tương lai chưa tồn tại
> - Không dọn dead code sau khi sửa

**Heuristic của Karpathy:** *"Would a senior engineer say this is overcomplicated?"* — nếu yes, viết lại.

### 3️⃣ Orthogonal Damage — Sửa lan ra ngoài scope
Agent đôi khi xóa/sửa comment hoặc code nó **không hiểu** hoặc **không thích**, dù task không yêu cầu.
> [!warning] ⚠️ Hay gặp
> - Reformat file mà không ai bảo
> - Xóa comment "có vẻ thừa" (nhưng đang là invariant document)
> - "Cải thiện" hàm bên cạnh task → vỡ test khác

---
## ✅ 4 Nguyên tắc encode vào CLAUDE.md
Cộng đồng (repo `forrestchang/andrej-karpathy-skills`) đã convert quan sát của Karpathy thành 4 rule:

| # | Nguyên tắc | Ý nghĩa |
|---|---|---|
| 1 | **Explicit Assumption Surfacing** | State giả định + hỏi khi mơ hồ, không tự chọn |
| 2 | **Enforced Simplicity** | 200 dòng → 50 dòng. Không abstraction cho code dùng 1 lần |
| 3 | **Surgical Precision on Edits** | Chỉ sửa cái liên quan task. Không reformat, không refactor lén |
| 4 | **Success Criteria Over Procedural Steps** | Cho **goal + verification loop**, đừng cho từng bước |

> [!tip] 💡 Áp dụng nguyên tắc 4
> Thay vì *"viết hàm validate email theo regex X, gọi API Y, return Z"*, hãy nói *"viết hàm `validateEmail(input)` sao cho test cases sau pass: ..."* — agent tự loop tới khi test xanh.

```js
// ❌ Bad: Procedural
"Viết hàm parseDate. Bước 1: split chuỗi theo '/'. Bước 2: parse từng phần. Bước 3: check..."

// ✅ Good: Goal + verification
"Viết hàm parseDate(str) pass các test sau:
 - parseDate('28/04/2026') === new Date(2026, 3, 28)
 - parseDate('invalid') throws InvalidDateError
 - parseDate('') throws InvalidDateError"
```

---
## 🧠 Vai trò engineer thay đổi như nào?

| Trước (manual coding) | Sau (agent-driven) |
|---|---|
| Gõ từng dòng | Mô tả intent bằng English |
| Debug từng bug | Define **success criteria** |
| Sequential, mệt → nghỉ | Agent không mệt, loop nhiều path |
| Refactor thủ công | **Review, steer, verify** |

> [!tip] 💡 Insight quan trọng nhất
> Lợi ích của agent **không chỉ là tốc độ**. Nó làm những task trước đây *thấy ngại làm* trở thành *khả thi* → bạn dám attempt scope lớn hơn.

---
## 🛠️ Áp dụng cho dev Joy Loyalty / Shopify

> [!tip] 💡 Khi code Shopify app + Firebase
> - **Surface assumption:** Trước khi agent thêm 1 mutation GraphQL Shopify, ép nó liệt kê *"giả định: scope `write_products`, API version 2026-04, rate limit 2 req/s"* — nếu sai sẽ bể prod
> - **Surgical edits:** Khi sửa Cloud Function, cấm agent đụng `firestore.rules` hoặc `index.json` "cho gọn" — review riêng
> - **Success criteria:** Cho test integration với Shopify dev store làm verification loop, không mô tả từng bước call API

---
## 📚 Tham khảo
- 🔥 [Tweet gốc — Andrej Karpathy (01/2026)](https://x.com/karpathy/status/2015883857489522876) — note nguyên bản, viral với cộng đồng dev AI
- 🔥 [forrestchang/andrej-karpathy-skills (GitHub)](https://github.com/forrestchang/andrej-karpathy-skills) — repo chuyển observation thành CLAUDE.md, 60k stars
- [Karpathy's CLAUDE.md Skills File: Complete Guide](https://antigravity.codes/blog/karpathy-claude-code-skills-guide) — phân tích chi tiết 4 nguyên tắc + cách dùng
- [Turning Karpathy's LLM Coding Thoughts into Claude.md](https://todatabeyond.substack.com/p/turning-andrej-karpathys-llm-coding) — bài summary có quote nguyên văn các failure mode
- [Karpathy's AI Coding Agent Rant in a CLAUDE.md File](https://www.theunwindai.com/p/karpathy-s-ai-coding-agent-rant-in-a-claude-md-file) — diễn giải 4 behavioral principle

---
## ✅ Checklist áp dụng khi code với Claude
- [ ] Trước khi agent code: bắt nó **list assumption** + ask clarification
- [ ] Sau khi agent code: hỏi *"Senior dev có bảo cái này overcomplicated không?"*
- [ ] Review diff — flag bất kỳ thay đổi nào **ngoài scope** task (reformat, xóa comment, refactor file khác)
- [ ] Định nghĩa **success criteria có thể verify** (test, type check, lint) thay vì step-by-step instruction
- [ ] Add `CLAUDE.md` vào project với 4 rule: surface assumption / simplicity / surgical edit / goal-driven
- [ ] Tự nhắc: vai trò bạn giờ là **review + steer + verify**, không phải gõ phím
