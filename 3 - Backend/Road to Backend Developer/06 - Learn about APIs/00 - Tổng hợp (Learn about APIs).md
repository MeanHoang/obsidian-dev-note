# 00 — Tổng hợp: Learn about APIs

> Phần 6 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Learn about APIs** (API styles + Authentication).
>
> **Nguyên tắc chọn nguồn:** roadmap.sh gợi ý gần như toàn blog. Mình **không dùng** chúng làm nguồn chính — API là lĩnh vực có **tiêu chuẩn viết sẵn**, nên bám thẳng spec gốc: luận án Fielding, RFC của IETF, spec W3C, OASIS, GraphQL Foundation, OpenAPI Initiative, OpenID Foundation.
>
> **Cách trình bày:** 📖 trích nguyên văn → 🇻🇳 dịch → 💡 ví dụ đời sống. Thuật ngữ giữ nguyên tiếng Anh.

---

## Cấu trúc — 18 note, 13.700 dòng, 909 khối trích dẫn

```
06 - Learn about APIs/
├── 00 - Tổng hợp (file này)
├── A - API Styles/       9 bài · 7.425 dòng · 468 khối
└── B - Authentication/   8 bài · 6.273 dòng · 441 khối
```

## A — API Styles

| # | Bài | Nguồn gốc | Dòng |
|---|---|---|---|
| 01 | [[01 - API là gì và nền tảng HTTP]] | RFC 9110/9111/9112/5789 | 566 |
| 02 | [[02 - REST]] ⭐⭐ | **Luận án Roy Fielding 2000** | 651 |
| 03 | [[03 - JSON và JSON-API]] | RFC 8259 + jsonapi.org | 948 |
| 04 | [[04 - HTTP Status Code và thiết kế lỗi]] | RFC 9110 + **9457** + 6585 | 746 |
| 05 | [[05 - SOAP]] | W3C SOAP 1.2 + WSDL 2.0 | 558 |
| 06 | [[06 - gRPC và Protocol Buffers]] ⭐ | grpc.io + protobuf.dev | 559 |
| 07 | [[07 - GraphQL]] ⭐ | spec.graphql.org + OWASP | 1242 |
| 08 | [[08 - OpenAPI Specification]] | spec.openapis.org v3.2.0 | 990 |
| 09 | [[09 - So sánh API Styles và REST Security]] ⭐ | tổng hợp + OWASP | 1051 |

## B — Authentication

| # | Bài | Nguồn gốc | Dòng |
|---|---|---|---|
| 10 | [[10 - Authentication vs Authorization]] ⭐ | OWASP + RFC 9110 §11 | 777 |
| 11 | [[11 - Basic Authentication]] | RFC 7617 + 7616 | 496 |
| 12 | [[12 - Cookie và Session based Authentication]] ⭐ | RFC 6265 + OWASP + Fielding | 712 |
| 13 | [[13 - Token Authentication và Bearer Token]] | RFC 6750 + 7009 + 9449 | 652 |
| 14 | [[14 - JWT]] ⭐⭐ | RFC 7519 + 7515 + **8725** | 801 |
| 15 | [[15 - OAuth 2.0]] ⭐⭐ | **RFC 9700** + 6749 + 7636 | 1038 |
| 16 | [[16 - OpenID Connect]] ⭐ | OpenID Connect Core 1.0 | 876 |
| 17 | [[17 - SAML]] | OASIS SAML 2.0 + OWASP | 921 |

---

## Bản đồ khái niệm

```
NỀN TẢNG   HTTP ─┬── method · safe / idempotent / cacheable            (01)
                 ├── resource ─► representation ─► content negotiation
                 └── status code · RFC 9457 Problem Details            (04)

4 STYLE    REST      style kiến trúc, 6 ràng buộc, resource-oriented    (02)
           SOAP      protocol, XML Envelope/Header/Body/Fault           (05)
           gRPC      RPC, Protobuf nhị phân, 4 kiểu streaming           (06)
           GraphQL   query language + runtime, client chọn field        (07)

CONTRACT   WSDL cho SOAP  ◄──tương đương──►  OpenAPI cho REST      (05, 08)

═══════════════════ AI LÀ BẠN / BẠN ĐƯỢC LÀM GÌ ═══════════════════

AUTHN      Basic          user:password base64, gửi kèm MỌI request     (11)
           Session+Cookie server giữ trạng thái, cookie mang session ID (12)
           Token/Bearer   server không giữ trạng thái, ai cầm cũng dùng (13)
           JWT            ĐỊNH DẠNG token tự chứa, có chữ ký            (14)

AUTHZ      OAuth 2.0      uỷ quyền cho app thứ ba — KHÔNG phải authn    (15)
                          └── Authorization Code + PKCE ✅
                              implicit ❌ SHOULD NOT · password ❌ MUST NOT

FEDERATION OpenID Connect lớp identity TRÊN OAuth 2.0, ID Token là JWT  (16)
           SAML           XML, SSO doanh nghiệp, IdP ↔ SP               (17)
```

---

## 15 điều cần nhớ

**API styles**
1. **Safe và idempotent quyết định thiết kế API đúng hay sai.** ([[01 - API là gì và nền tảng HTTP]])
2. **REST là architectural style, không phải protocol** — Fielding định nghĩa bằng 6 ràng buộc, không phải "URL đẹp + JSON". ([[02 - REST]])
3. **HATEOAS là ràng buộc bắt buộc** — và gần như không API thương mại nào làm.
4. **401 ≠ 403.** 401 = chưa xác thực (phải kèm `WWW-Authenticate`); 403 = biết bạn là ai nhưng không cho. ([[04 - HTTP Status Code và thiết kế lỗi]])
5. **422 tên chuẩn hiện nay là "Unprocessable Content"**, nằm trong RFC 9110 §15.5.21.
6. **Đừng tự chế định dạng lỗi** — RFC 9457 đã chuẩn hoá sẵn.
7. **gRPC xoay quanh procedure, REST xoay quanh resource** — hai mô hình tư duy khác hẳn. ([[06 - gRPC và Protocol Buffers]])
8. **GraphQL vừa chữa vừa gây N+1.** ([[07 - GraphQL]], [[07 - N+1 Problem]])

**Authentication**
9. **OAuth 2.0 là framework AUTHORIZATION, không phải authentication.** Cần authentication thì dùng OpenID Connect. OWASP nói thẳng: *"Use OIDC for authentication/SSO; use OAuth for authorization to APIs."* ([[10 - Authentication vs Authorization]])
10. **JWT chỉ là ĐỊNH DẠNG token**, không phải giao thức đăng nhập. Nó trả lời "token trông thế nào", không trả lời "làm sao đăng nhập". ([[14 - JWT]])
11. **base64/base64url là encoding, KHÔNG phải mã hoá** — đúng cho cả Basic auth lẫn payload JWT. Ai chặn được là đọc được. ([[11 - Basic Authentication]], [[14 - JWT]])
12. **"Bearer" nghĩa là ai cầm cũng dùng được** — không cần chứng minh gì thêm. Mất token = mất quyền. ([[13 - Token Authentication và Bearer Token]])
13. **JWT không thu hồi được** trước khi hết hạn. Muốn thu hồi thì phải giữ denylist — mà làm vậy là mất tính stateless, tức mất lý do dùng JWT.
14. 🔴 **Implicit grant và password grant đã bị loại bỏ.** RFC 9700 (2025): implicit = **SHOULD NOT**, password = **MUST NOT**. Dùng **Authorization Code + PKCE**. ([[15 - OAuth 2.0]])
15. **Session có trạng thái ⇒ mâu thuẫn với ràng buộc stateless của REST.** Fielding nói thẳng về cookie ở §6.3.4.2. ([[12 - Cookie và Session based Authentication]], [[02 - REST]])

---

## Những chỗ nguồn gốc KHÔNG nói — đã đánh dấu trong bài

Ghi lại để sau này không nhầm là kiến thức có trích dẫn:

- **Fielding không phàn nàn về việc REST bị hiểu sai** trong luận án — tìm không thấy, đã ghi rõ là không thấy. Bù lại có §6.5.3 **"HTTP is not a Transport Protocol"**.
- **grpc.io intro/core-concepts không nhắc HTTP/2**, chỉ FAQ có.
- **Spec OpenAPI v3.2.0 không kể lịch sử đổi tên Swagger**, không có "mock server", không có design-first/code-first.
- **"JSON không có comment/trailing comma"** được suy ra từ **ABNF grammar RFC 8259**, đã ghi rõ là suy luận.
- **W3C chỉ nhắc đích danh WS-Addressing**; bài SOAP không liệt kê WS-* nào khác.
- **`SameSite` KHÔNG nằm trong RFC 6265.** Nó ở draft `rfc6265bis` rev 22 (01/12/2025) — đã được duyệt nhưng **chưa được cấp số RFC**, đang ở hàng đợi RFC Editor.
- **OAuth 2.1 vẫn là Internet-Draft** (rev 16), chưa phải RFC. Draft tự ghi: *"It is inappropriate to use Internet-Drafts as reference material."*
- **Spec OIDC Core (errata set 2, 12/2023) không có ghi chú deprecation cho implicit flow** — khuyến cáo trong bài là đối chiếu chéo với RFC 9700 §2.1.2.
- **OWASP SAML Cheat Sheet không đề cập XXE** — bài 17 không đưa khuyến nghị về XXE thay vì tự chế.
- **SAML Core §5.4.1 (2005) khuyến nghị `#rsa-sha1`**, OWASP hiện hành yêu cầu từ chối SHA-1 → bài trích cả hai và theo cái mới.
- **`<AuthzDecisionStatement>` đã bị đóng băng** từ SAML V2.0 — spec tự ghi, đã trích.
- **URL `owasp.org/API-Security/` đã chết (404)** — bài 09 dùng URL còn sống.
- Ví dụ endpoint, SQL, code JS minh hoạ đều gắn nhãn "tự viết", không dùng nhãn trích dẫn.

---

## Chưa học (nằm ở phần sau của roadmap)

- **Web Security** (HTTPS, CORS, CSP, OWASP Risks, server security) → `09 - Web Security`
- **Caching** (Redis, CDN, HTTP caching chuyên sâu) → `07 - Caching`
- **Rate limiting / throttling** → `11 - Advanced Backend/11 - Building For Scale`
- **WebSockets, Server-Sent Events, long polling** → `11 - Advanced Backend/08 - Real-Time Data`
- **API Gateway, service mesh** → `11 - Advanced Backend/06 - Architectural Patterns`

## Nguồn tham khảo
- Roy T. Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (2000): <https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- RFC 9110 HTTP Semantics · RFC 9457 Problem Details · RFC 6265 Cookies · RFC 7617 Basic · RFC 6750 Bearer · RFC 7519 JWT · RFC 8725 JWT BCP · RFC 6749 OAuth 2.0 · RFC 7636 PKCE · **RFC 9700 OAuth Security BCP**: <https://www.rfc-editor.org/>
- W3C SOAP 1.2: <https://www.w3.org/TR/soap12-part1/>
- GraphQL Specification: <https://spec.graphql.org/October2021/>
- OpenAPI Specification: <https://spec.openapis.org/oas/latest.html>
- OpenID Connect Core 1.0: <https://openid.net/specs/openid-connect-core-1_0.html>
- OASIS SAML 2.0: <https://docs.oasis-open.org/security/saml/v2.0/>
- OWASP Cheat Sheet Series: <https://cheatsheetseries.owasp.org/>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
