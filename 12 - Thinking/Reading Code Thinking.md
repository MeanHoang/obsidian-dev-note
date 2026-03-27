## 🧠 Reading Code Thinking là gì?

> [!quote] 💬
> *"Code is read far more often than it is written."* — Guido van Rossum
> Dev dành **~70% thời gian đọc code**, chỉ ~30% viết. Nhưng không ai dạy cách đọc.

Reading Code Thinking là tư duy **đọc code có hệ thống** — không phải mở file rồi đọc từ trên xuống dưới, mà là biết **đọc gì, đọc ở đâu, đọc theo thứ tự nào** để hiểu nhanh nhất.

> [!note] 📝 So sánh dễ hiểu
> Đọc code giống như **đến 1 thành phố lạ**.
> Người không có kỹ năng → đi lang thang mọi con đường, mất cả ngày vẫn lạc.
> Người có kỹ năng → mở bản đồ trước, xác định các landmark chính, rồi mới đi vào từng ngõ.

---

## 🚫 Sai lầm phổ biến khi đọc code
- ❌ Mở file đầu tiên thấy → đọc từ dòng 1 đến hết
- ❌ Cố hiểu **mọi dòng** trước khi hiểu bức tranh tổng
- ❌ Đọc không có câu hỏi → đọc xong không nhớ gì
- ❌ Đọc 1 file isolated → không hiểu nó kết nối với phần khác thế nào
- ❌ Đọc code mà không chạy thử → hiểu sai flow

> [!tip] 💡
> **Đọc code mà không có câu hỏi giống như đọc sách mà không biết mình đang tìm gì** — đọc xong quên hết.

---

## 🗺️ Bước 1: Nhìn bản đồ trước — đừng vội đọc chi tiết
Trước khi đọc bất kỳ dòng code nào, hiểu **cấu trúc tổng thể**:
- 📁 **Folder structure** — project tổ chức theo layer (controller/service/repo) hay theo feature (user/, order/, payment/)?
- 📄 **Entry point** — app bắt đầu từ đâu? (`main.ts`, `index.js`, `app.py`...)
- 📦 **Dependencies** — `package.json`, `go.mod`, `requirements.txt` → dùng framework/lib gì?
- 📖 **README / docs** — có hướng dẫn setup, architecture overview không?

> [!note] 📝 So sánh dễ hiểu
> Giống như xem **mục lục sách** trước khi đọc — biết sách nói về gì, có bao nhiêu chương, mình cần đọc chương nào.

```
// Ví dụ: nhìn folder structure là đoán được kiến trúc
src/
├── controllers/    → nhận request
├── services/       → business logic
├── repositories/   → truy cập database
├── models/         → data structure
└── middlewares/    → xử lý trước khi vào controller
```

---

## 🔍 Bước 2: Đọc theo flow, không đọc theo file
Đừng đọc file A xong đọc file B. **Đọc theo 1 flow cụ thể từ đầu đến cuối.**

Ví dụ muốn hiểu flow "user đặt hàng":
```
Request vào → Route → Controller → Service → Repository → Database
                                      ↓
                                  Gọi Payment API
                                      ↓
                                  Trả response
```

Cách làm:
1. 🔎 Tìm route/endpoint: `POST /orders`
2. 👉 Từ route → mở controller xử lý
3. 👉 Từ controller → mở service chứa business logic
4. 👉 Từ service → xem nó gọi gì (repo, external API...)
5. 🎯 Giờ bạn hiểu **toàn bộ flow**, không chỉ 1 file

> [!tip] 💡
> Dùng **"Go to Definition"** (F12 trong VS Code) để nhảy theo flow. Đừng tự tìm file bằng tay.

---

## ❓ Bước 3: Đọc với câu hỏi
Mỗi lần đọc code, mang theo **1 câu hỏi cụ thể**. Câu hỏi khác nhau → đọc khác nhau:

| Mục đích | Câu hỏi khi đọc | Đọc gì |
|---|---|---|
| 🐛 **Fix bug** | "Data sai ở bước nào?" | Trace theo data flow, tìm chỗ data bị biến đổi |
| ✨ **Thêm feature** | "Feature tương tự đã làm thế nào?" | Tìm feature giống, đọc pattern đang dùng |
| 🔄 **Refactor** | "Chỗ nào đang coupled, chỗ nào lặp?" | Đọc các module gọi nhau, tìm dependency |
| 📚 **Học codebase mới** | "Hệ thống này giải quyết bài toán gì?" | Entry point, main flow, domain model |
| 👀 **Review PR** | "Thay đổi này có side effect gì không?" | Đọc diff + code xung quanh diff |

---

## 🔧 Bước 4: Kỹ thuật đọc hiệu quả

### 🔭 Top-down — Từ tổng quan đến chi tiết
Dùng khi **mới vào codebase** hoặc cần hiểu big picture:
1. README → folder structure → entry point
2. Main flow → các module chính
3. Chi tiết từng function khi cần

### 🔬 Bottom-up — Từ chi tiết lên tổng quan
Dùng khi **debug hoặc fix bug** — biết chỗ lỗi, cần hiểu nguyên nhân:
1. Bắt đầu từ dòng lỗi / log error
2. Trace ngược: ai gọi function này? data từ đâu?
3. Tìm root cause

### 🔗 Follow the data — Theo dòng dữ liệu
Dùng khi **data bị sai** và cần tìm chỗ nó bị biến đổi:
1. Data nhập vào từ đâu? (request, database, file...)
2. Đi qua những function nào? Mỗi chỗ biến đổi thế nào?
3. Output cuối cùng ở đâu?

> [!note] 📝 So sánh dễ hiểu
> - **Top-down** = xem bản đồ thành phố → chọn quận → đi vào đường cụ thể
> - **Bottom-up** = đang ở 1 ngõ hẻm → tìm đường ra đường lớn → xác định mình đang ở quận nào
> - **Follow the data** = theo dấu vết 1 chiếc xe từ lúc xuất phát đến đích

---

## 🛠️ Bước 5: Công cụ hỗ trợ đọc code

| Công cụ / Kỹ thuật | Dùng khi |
|---|---|
| 🔍 **Search (Ctrl+Shift+F)** | Tìm keyword, function name, error message |
| 📌 **Go to Definition (F12)** | Nhảy đến nơi function/class được định nghĩa |
| 🔙 **Find All References (Shift+F12)** | Xem ai đang gọi function này |
| 🌳 **Git blame** | Biết ai viết dòng này, commit message giải thích tại sao |
| 📝 **Git log cho file** | Xem file này thay đổi thế nào theo thời gian |
| 🏃 **Debugger + breakpoint** | Chạy code và xem flow thật, không đoán |
| ✏️ **Ghi chú khi đọc** | Vẽ diagram, note lại flow — đọc xong mới nhớ |

> [!quote] 💬
> *"The most effective debugging tool is still careful thought, coupled with judiciously placed print statements."* — Brian Kernighan
> Công cụ debug hiệu quả nhất vẫn là **suy nghĩ cẩn thận** kết hợp với vài dòng print đặt đúng chỗ.

---

## ✅ Checklist khi đọc code
- [ ] Mình đang đọc để trả lời **câu hỏi gì**?
- [ ] Đã nhìn **cấu trúc tổng thể** trước chưa?
- [ ] Đang đọc theo **flow** hay đọc random từng file?
- [ ] Đã **chạy thử** code chưa hay chỉ đọc?
- [ ] Có **ghi chú lại** những gì đã hiểu không?
