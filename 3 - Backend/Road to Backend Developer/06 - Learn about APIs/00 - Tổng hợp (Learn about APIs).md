# 00 — Tổng hợp: Learn about APIs

> Phần 6 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Learn about APIs** (API styles + Authentication).
>
> **Nguyên tắc chọn nguồn của phần này:** roadmap.sh gợi ý gần như toàn blog (AWS, Red Hat, Guru99, restapitutorial). Mình **không dùng** chúng làm nguồn chính — API là lĩnh vực có **tiêu chuẩn viết sẵn**, nên bám thẳng spec gốc: luận án Fielding, RFC của IETF, spec của W3C, GraphQL Foundation, OpenAPI Initiative.

---

## Cấu trúc

```
06 - Learn about APIs/
├── 00 - Tổng hợp (file này)
├── A - API Styles/        ✅ 9 bài, 7.311 dòng
└── B - Authentication/    ⏳ chưa làm
```

## A — API Styles ✅

| # | Bài | Nguồn gốc | Dòng |
|---|---|---|---|
| 01 | [[01 - API là gì và nền tảng HTTP]] | RFC 9110, 9111, 9112, 5789 | 566 |
| 02 | [[02 - REST]] ⭐⭐ | **Luận án Roy Fielding 2000, ch5–6** | 651 |
| 03 | [[03 - JSON và JSON-API]] | RFC 8259 + json.org + jsonapi.org | 948 |
| 04 | [[04 - HTTP Status Code và thiết kế lỗi]] | RFC 9110 + **RFC 9457** + RFC 6585 | 746 |
| 05 | [[05 - SOAP]] | W3C SOAP 1.2 Part 0/1 + WSDL 2.0 | 558 |
| 06 | [[06 - gRPC và Protocol Buffers]] ⭐ | grpc.io + protobuf.dev | 559 |
| 07 | [[07 - GraphQL]] ⭐ | **spec.graphql.org** + OWASP | 1242 |
| 08 | [[08 - OpenAPI Specification]] | **spec.openapis.org v3.2.0** | 990 |
| 09 | [[09 - So sánh API Styles và REST Security]] ⭐ | tổng hợp + OWASP | 1051 |

**468 khối trích dẫn nguyên văn, tất cả đều có bản dịch.**

## B — Authentication ⏳

Dự kiến 8 bài: Authentication vs Authorization · Basic Auth (RFC 7617) · Cookie & Session (RFC 6265 + OWASP) · Token & Bearer (RFC 6750) · JWT (RFC 7519 + 7515) · OAuth 2.0 (RFC 6749 + PKCE 7636 + **RFC 9700**) · OpenID Connect · SAML.

---

## Bản đồ khái niệm

```
NỀN TẢNG      HTTP ─┬── method: GET HEAD POST PUT DELETE PATCH ...        (01)
                    ├── safe / idempotent / cacheable  ◄── quyết định thiết kế
                    ├── resource ─► representation ─► content negotiation
                    └── status code 1xx–5xx · RFC 9457 Problem Details    (04)

4 API STYLE   REST      style kiến trúc, 6 ràng buộc, resource-oriented   (02)
              SOAP      protocol, XML Envelope/Header/Body/Fault           (05)
              gRPC      RPC, Protocol Buffers nhị phân, 4 kiểu streaming   (06)
              GraphQL   query language + runtime, client chọn field        (07)

ĐỊNH DẠNG     JSON (RFC 8259) ─► JSON:API spec: data/included/errors       (03)

CONTRACT      WSDL cho SOAP  ◄──tương đương──►  OpenAPI cho REST          (05, 08)

AN TOÀN       OWASP REST Cheat Sheet + API Security Top 10                 (09)
              └── authentication → đợt B
```

---

## 10 điều cần nhớ

1. **Safe và idempotent quyết định thiết kế API đúng hay sai.** `GET` không được đổi trạng thái; `PUT`/`DELETE` gọi lại nhiều lần phải cho cùng kết quả. ([[01 - API là gì và nền tảng HTTP]])
2. **REST là architectural style, không phải protocol.** Fielding định nghĩa nó bằng 6 ràng buộc, không phải bằng "URL đẹp + JSON". ([[02 - REST]])
3. **HATEOAS là ràng buộc bắt buộc trong REST** — và gần như không API thương mại nào làm. Biết khoảng cách này để không tranh cãi vô ích.
4. **401 ≠ 403.** 401 = chưa xác thực (phải kèm `WWW-Authenticate`), 403 = đã biết bạn là ai nhưng không cho. ([[04 - HTTP Status Code và thiết kế lỗi]])
5. **422 tên chuẩn hiện nay là "Unprocessable Content"**, có trong RFC 9110 §15.5.21 — không còn là code mượn từ WebDAV.
6. **Đừng tự chế định dạng lỗi.** RFC 9457 (`application/problem+json`) đã chuẩn hoá sẵn: `type`, `title`, `status`, `detail`, `instance`.
7. **gRPC xoay quanh procedure, REST xoay quanh resource** — hai mô hình tư duy khác hẳn, không phải "cái nào hiện đại hơn". ([[06 - gRPC và Protocol Buffers]])
8. **GraphQL vừa chữa vừa gây N+1**: dập N+1 phía client, nhưng mỗi field resolver có thể đẻ ra một query ở phía server. ([[07 - GraphQL]], [[07 - N+1 Problem]])
9. **OpenAPI là WSDL của thế giới REST** — một file contract máy đọc được, sinh ra tài liệu, client SDK, server stub, test. ([[08 - OpenAPI Specification]])
10. **Validation không thay thế parameterized query.** Hai lớp phòng vệ khác nhau. ([[09 - So sánh API Styles và REST Security]], [[13 - SQL Injection và Parameterized Query]])

---

## Những chỗ nguồn gốc KHÔNG nói — đã đánh dấu trong bài

- **Fielding không hề phàn nàn về việc REST bị hiểu sai** trong luận án. Tìm không thấy, và đã ghi rõ là không thấy — luận án viết năm 2000, làn sóng "REST API" nổ ra sau đó. Bù lại có 5 đoạn chương 6 nói về vi phạm ràng buộc trong thực tế, trong đó **"HTTP is not a Transport Protocol"** (§6.5.3).
- **grpc.io intro và core-concepts không nhắc HTTP/2** — chỉ FAQ có. Phần giải thích "vì sao HTTP/2 cho phép streaming" được đánh dấu là nhận định.
- **Spec OpenAPI v3.2.0 không kể lịch sử đổi tên Swagger → OpenAPI**, không có khái niệm "mock server", không có cặp "design-first / code-first". Cả ba đều ghi rõ là quy ước/nhận định.
- **"JSON không có comment / trailing comma"** được suy ra từ **ABNF grammar của RFC 8259**, không liệt kê theo trí nhớ — đã ghi rõ là suy luận từ grammar.
- **W3C chỉ nhắc đích danh WS-Addressing** trong ba nguồn đã đọc; bài SOAP không liệt kê WS-* nào khác.
- **URL `owasp.org/API-Security/` đã chết (404)** — bài 09 dùng `owasp.org/www-project-api-security/` và ghi chú lại.
- **Trang JSON:API không có ví dụ JSON hoàn chỉnh cho `errors`** — bài 03 chỉ trích cấu trúc member, không tự chế ví dụ.
- Ví dụ endpoint tự viết (bài 02) và code minh hoạ đều gắn nhãn rõ, không dùng nhãn trích dẫn.

## Nguồn tham khảo
- Roy T. Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (2000): <https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- RFC 9110 HTTP Semantics: <https://www.rfc-editor.org/rfc/rfc9110.txt>
- RFC 9457 Problem Details for HTTP APIs: <https://www.rfc-editor.org/rfc/rfc9457.txt>
- W3C SOAP 1.2: <https://www.w3.org/TR/soap12-part1/>
- gRPC: <https://grpc.io/docs/> · Protocol Buffers: <https://protobuf.dev/overview/>
- GraphQL Specification: <https://spec.graphql.org/October2021/>
- OpenAPI Specification: <https://spec.openapis.org/oas/latest.html>
- OWASP Cheat Sheet Series: <https://cheatsheetseries.owasp.org/>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
