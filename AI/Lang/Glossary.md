# 📖 Glossary — Định nghĩa & thuật ngữ

> Gặp khái niệm nào khó hiểu thì note vào đây. Mỗi lần quay lại đọc là nhớ thêm 1 chút.

---

## A

## B

## C
**Chain-of-Thought (CoT)** — Kỹ thuật bắt LLM suy nghĩ từng bước trước khi đưa ra câu trả lời cuối cùng. Giúp tăng độ chính xác cho task phức tạp.

**Context Window** — Giới hạn số token mà LLM có thể "nhìn thấy" trong 1 lần (bao gồm cả prompt + output). Ví dụ: GPT-4 = 128K tokens, Claude = 200K tokens.

## D

## E
**Embedding** — Chuyển text thành vector số (mảng số). Các text có nghĩa giống nhau sẽ có vector gần nhau. Dùng trong RAG để tìm tài liệu liên quan.

## F
**Few-shot** — Kỹ thuật prompt cho vài ví dụ mẫu để LLM hiểu pattern mình muốn.

**Function Calling** — Khả năng LLM chọn và gọi tool/function bên ngoài. LLM không chạy code trực tiếp — nó trả về "tôi muốn gọi hàm X với params Y", app của mình thực thi rồi trả kết quả lại.

## G

## H
**Hallucination** — LLM tự bịa thông tin nghe rất thuyết phục nhưng hoàn toàn sai. Ví dụ: trích dẫn paper không tồn tại, đưa ra API không có thật.

## I

## J

## K

## L
**LLM (Large Language Model)** — Mô hình ngôn ngữ lớn, được train trên lượng text khổng lồ. Ví dụ: GPT-4, Claude, Gemini, Llama.

## M

## N

## O

## P
**Prompt** — Câu lệnh/input bạn đưa cho LLM. Bao gồm system prompt + user prompt.

## Q

## R
**RAG (Retrieval Augmented Generation)** — Kỹ thuật cho LLM truy cập data bên ngoài (database, documents...) trước khi trả lời. Giúp giảm hallucination và trả lời đúng với data của mình.

## S
**System Prompt** — Prompt đặt ở đầu conversation để set behavior xuyên suốt. User không thấy nhưng ảnh hưởng mọi câu trả lời.

## T
**Temperature** — Tham số kiểm soát mức độ sáng tạo/ngẫu nhiên của output. 0 = deterministic, 1 = sáng tạo.

**Token** — Đơn vị nhỏ nhất mà LLM xử lý. Không phải 1 từ = 1 token. Tiếng Anh: ~1 token = 0.75 từ. Tiếng Việt: tốn nhiều token hơn do encoding.

**Top-p** — Tham số giới hạn LLM chỉ chọn từ các token có tổng xác suất ≤ p. top_p nhỏ = output an toàn, top_p lớn = output đa dạng.

## U

## V
**Vector Store** — Database lưu trữ embedding vectors và hỗ trợ tìm kiếm theo "độ giống nhau" (similarity search). Ví dụ: Pinecone, Chroma, pgvector.

## W

## X

## Y

## Z
**Zero-shot** — Kỹ thuật prompt hỏi thẳng không cho ví dụ. LLM tự suy luận từ kiến thức có sẵn.
