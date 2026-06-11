# Domain-Driven Refactoring — Intro & Reading Guide

> **Chủ đề:** Migrate từ layered architecture (monolith) sang DDD **từng bước**, không đập đi xây lại.
> **Tác giả:** Alessandro Colla & Alberto Acerbis · Packt, 2025
> **Link:** [O'Reilly](https://www.oreilly.com/library/view/domain-driven-refactoring/9781835889107/) · [Amazon](https://www.amazon.com/Domain-Driven-Refactoring-hands-transforming-microservices/dp/1835889107)
> **Trạng thái:** 📥 Chưa đọc — note này là guide trước khi đọc.

## Vì sao mình quan tâm cuốn này

- Đúng vấn đề đang gặp: codebase đang theo layer (controllers / services / repositories), muốn chuyển sang tổ chức theo domain mà không làm gãy hệ thống đang chạy.
- Phần khó nhất của migration không phải là structure đích, mà là **chiến lược chuyển dần** — và đó là trọng tâm cuốn sách (refactor theo từng thay đổi nhỏ quản lý được, không all-at-once).
- Áp dụng cho Joy Loyalty: khoanh vùng core domain (points, rewards, tiers?) để refactor trước, phần còn lại để sau.

## Cấu trúc sách (3 phần, 12 chương) — note tóm tắt từng chương

> ⚠️ Các note chương dưới đây là **tóm tắt khái niệm** theo mục lục chính thức + kiến thức DDD chuẩn, không phải bản dịch nguyên văn. Sách gốc có case study ERP xưởng bia (craft brewery) xuyên suốt — đọc sách để lấy phần hands-on đó.

**Phần 1 — Vì sao dùng DDD để xử lý complexity (theory):**
1. [[1 - Evolution of Domain-Driven Design]]
2. [[2 - Understanding Complexity - Problem and Solution Space]] — Cynefin, EventStorming, cognitive biases
3. [[3 - Strategic Patterns]] — bounded context, context mapping, subdomain
4. [[4 - Tactical Patterns]] — entity, value object, aggregate, domain event

**Phần 2 — Refactor hệ thống legacy (hands-on, phần quan trọng nhất):**
5. [[5 - Introducing Refactoring Principles]] — hiểu trước khi sửa, testing pyramid, SOLID
6. [[6 - Transitioning from Chaos]] — ⭐ chương trọng tâm: tìm core domain, map codebase hiện tại, build modular monolith
7. [[7 - Integrating Events with CQRS]]
8. [[8 - Refactoring the Database]]
9. [[9 - DDD Patterns for CI and Continuous Refactoring]]

**Phần 3 — Từ monolith sang microservices (đọc tham khảo, chưa cần áp ngay):**
10. [[10 - When and Why Transition to Microservices]]
11. [[11 - Dealing with Events and Their Evolution]] — event versioning, upcasting
12. [[12 - Orchestrating Complexity - Business Processes]] — saga, process manager, compensating transaction

## ⚠️ Lưu ý khi đọc

- Code ví dụ là **C# / .NET 8** — mình dùng JS thuần + Firebase. Đọc lấy **tư duy và pattern** (cách khoanh core domain, thứ tự refactor, event-driven để decouple), không copy code.
- Note chương đã có sẵn dạng tóm tắt khái niệm (ví dụ đã chuyển sang context Joy Loyalty + JS). Khi đọc sách gốc chương nào → bổ sung insight thật của sách vào note chương đó.

## 📄 Bài đọc trước (15 phút, đọc trước khi vào sách)

**[Project Structures: Domain-Driven vs. Layered Architecture](https://hector-reyesaleman.medium.com/project-structures-domain-driven-vs-layered-architecture-db8b713c99ef)** (Medium — Hector Reyes Aleman)

So sánh trực diện 2 cách tổ chức code, để thấy "đích đến" trông như thế nào:

- **Layered (theo technical layer):** group code theo loại trách nhiệm kỹ thuật (controllers/, services/, repositories/). Nhanh lúc khởi đầu, chậm dần khi complexity tăng — một thay đổi business phải đụng nhiều folder.
- **Domain-driven (theo business capability):** group theo domain (vd points/, rewards/, members/) — mỗi folder chứa đủ layer của riêng nó.
- Bài có ví dụ folder structure cụ thể cho cả 2, phân tích dependency flow và import boundary ảnh hưởng maintainability.
- Kết luận: domain-driven structure là "đúng hướng cho modular monolith và tách microservice sau này" — khớp với lộ trình phần 3 của cuốn sách.

## Thứ tự đọc đề xuất

1. Bài Medium ở trên → hình dung structure đích.
2. Sách phần 1 (theory) → nắm strategic DDD (bounded context, core domain).
3. Sách phần 2 (hands-on) → vừa đọc vừa map sang module tương ứng của Joy.
4. Phần 3 (microservices) → đọc tham khảo, chưa cần áp ngay.

## Liên kết

- [[7 - Software Architecture/02 - Design Principles/DDD|DDD notes]] — folder DDD trong Design Principles.
- Liên quan: [[Refactoring (Martin Fowler)]] — refactoring mechanics ở mức code, cuốn này là refactoring ở mức architecture.
