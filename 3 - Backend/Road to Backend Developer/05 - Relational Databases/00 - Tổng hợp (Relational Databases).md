# 00 — Tổng hợp: Relational Databases

> Phần 5 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Relational Databases** (+ Migrations, N+1 Problem).
>
> **Tài liệu chính thống:** **PostgreSQL Documentation** — <https://www.postgresql.org/docs/current/>
>
> Lý do chọn PostgreSQL: roadmap liệt kê 6 hệ, nhưng kiến thức nền — table, constraint, JOIN, index, transaction — là **chuẩn SQL**, học ở đâu cũng dùng được. PostgreSQL có tài liệu chính thức đầy đủ và miễn phí nhất, lại là hệ đứng sau **Cloud SQL for PostgreSQL** trên GCP. Bài 15 phủ 5 hệ còn lại theo chiều rộng.
>
> **Cách trình bày:** 📖 trích nguyên văn tiếng Anh → 🇻🇳 dịch → 💡 ví dụ đời sống. Mọi SQL copy nguyên văn từ tài liệu, không tự chế.

---

## Mục lục

### Nền tảng
| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 01 | [[01 - Relational Database và PostgreSQL là gì]] | PG Tutorial ch1–2 | 435 |
| 02 | [[02 - Tables, Data Types và Constraints]] ⭐ | PG ch5 + ch8 | 965 |
| 03 | [[03 - Queries - SELECT, JOIN, Aggregate]] ⭐⭐ | PG ch7 + Tutorial 2.6 | 1111 |
| 08 | [[08 - INSERT, UPDATE, DELETE]] ⭐ | PG ch6 | 867 |

### Truy vấn nâng cao
| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 09 | [[09 - Subquery, CTE và Set Operations]] ⭐ | PG ch7.8–7.9 | 681 |
| 10 | [[10 - Views và Schemas]] | PG Tutorial 3.2 + ch5.9 | 660 |
| 11 | [[11 - NULL, Hàm String, Date và JSON]] ⭐ | PG ch8–9 | 944 |
| 12 | [[12 - Window Functions]] | PG Tutorial 3.5 + ch4.2.8 | 565 |

### Hiệu năng & an toàn
| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 04 | [[04 - Indexes]] ⭐ | PG ch11 + ch14.1 | 671 |
| 05 | [[05 - Transactions, ACID và MVCC]] ⭐⭐ | PG Tutorial 3.4 + ch13 | 623 |
| 07 | [[07 - N+1 Problem]] | roadmap.sh + PlanetScale + PG | 368 |
| 13 | [[13 - SQL Injection và Parameterized Query]] ⭐⭐ | OWASP + PG `PREPARE` | 636 |

### Vận hành & bề rộng
| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 06 | [[06 - Database Migrations]] | PG DDL + Wikipedia | 577 |
| 14 | [[14 - Roles, Backup, VACUUM và Performance]] | PG ch22, 25, 14 | 823 |
| 15 | [[15 - So sánh MySQL, MariaDB, SQLite, MS SQL, Oracle]] | docs chính thức từng hệ | 734 |

**Tổng: 15 bài, ~10.700 dòng, 874 khối trích dẫn nguyên văn — tất cả đều có bản dịch.**

> [!tip] Thứ tự đọc
> Số bài = thứ tự điều hướng (01 → 15, mỗi bài có "Bài trước / Bài kế"). Nhưng nếu học lần đầu, đọc theo nhóm ở trên hợp lý hơn: **Nền tảng → Truy vấn nâng cao → Hiệu năng & an toàn → Vận hành**.
>
> Bài 08 (INSERT/UPDATE/DELETE) đánh số muộn vì được bổ sung sau, nhưng về nội dung nó thuộc nhóm nền tảng — nên đọc ngay sau bài 03.

---

## Bản đồ khái niệm

```
ĐỌC            SELECT ─ WHERE ─ GROUP BY ─ HAVING ─ ORDER BY ─ LIMIT        (03)
                 ├── JOIN: INNER / LEFT / RIGHT / FULL / CROSS              (03)
                 ├── Subquery · CTE (WITH) · RECURSIVE · UNION/INTERSECT    (09)
                 └── Window function: OVER (PARTITION BY ... ORDER BY ...)  (12)
                     └── khác GROUP BY: KHÔNG gộp row lại

GHI            INSERT · UPDATE · DELETE · RETURNING · ON CONFLICT (upsert)  (08)

CẤU TRÚC       CREATE TABLE ─┬── data type (số, chuỗi, ngày, json/jsonb)    (02, 11)
                             ├── DEFAULT
                             └── CONSTRAINT: CHECK / NOT NULL / UNIQUE /    (02)
                                 PRIMARY KEY / FOREIGN KEY / EXCLUSION
               VIEW · MATERIALIZED VIEW · SCHEMA · PARTITION                (10)
               ALTER TABLE có phiên bản = MIGRATION                         (06)

TỐC ĐỘ         INDEX: B-tree / Hash / GiST / SP-GiST / GIN / BRIN           (04)
                 ⚠️ cái giá: chậm ghi, tốn dung lượng, phải bảo trì
               EXPLAIN / EXPLAIN ANALYZE → Seq Scan hay Index Scan?         (04)
               N+1: 1 query + N query → gộp bằng JOIN hoặc IN               (07)

AN TOÀN        TRANSACTION: BEGIN ─ SAVEPOINT ─ COMMIT / ROLLBACK           (05)
                 └── MVCC: reader không chặn writer, writer không chặn reader
                 └── isolation: Read Committed (mặc định) / Repeatable Read / Serializable
               SQL INJECTION → prepared statement, KHÔNG nối chuỗi          (13)
               Least privilege: app không dùng superuser                    (13, 14)

VẬN HÀNH       ROLE · GRANT/REVOKE · pg_dump · VACUUM · ANALYZE             (14)
                 └── VACUUM cần vì MVCC để lại dead tuple ◄── hệ quả của (05)
```

---

## 12 điều cần nhớ

1. **Foreign key là thứ làm nên chữ "relational".** Không có nó thì chỉ là mấy cái bảng rời. ([[02 - Tables, Data Types và Constraints]])
2. **`ON DELETE` phải chọn có chủ đích** — `CASCADE` xoá lan, `RESTRICT` chặn, `SET NULL` để trống.
3. **Aggregate không dùng được trong `WHERE`, phải dùng `HAVING`.** ([[03 - Queries - SELECT, JOIN, Aggregate]])
4. **`ON` lọc trước khi join, `WHERE` lọc sau khi join** — với OUTER JOIN cho kết quả khác nhau.
5. **`DELETE`/`UPDATE` không có `WHERE` là quét sạch bảng.** Tài liệu PostgreSQL viết nguyên văn: *"Caveat programmer."* ([[08 - INSERT, UPDATE, DELETE]])
6. **`RETURNING` lấy lại row vừa ghi trong đúng một lệnh** — khỏi phải SELECT lại, tránh race condition.
7. **`= NULL` luôn sai, phải dùng `IS NULL`.** NULL nghĩa là "không biết", không phải 0. ([[11 - NULL, Hàm String, Date và JSON]])
8. **`timestamp` vs `timestamptz`**: dùng nhầm là nguồn bug timezone kinh điển. ([[11 - NULL, Hàm String, Date và JSON]])
9. **Index không miễn phí**: ghi chậm hơn, tốn dung lượng, phải bảo trì. Muốn biết có được dùng không thì `EXPLAIN`, đừng đoán. ([[04 - Indexes]])
10. **PostgreSQL mặc định ở Read Committed**, không phải Serializable. ([[05 - Transactions, ACID và MVCC]])
11. **Không bao giờ nối chuỗi dữ liệu người dùng vào SQL.** Prepared statement là lớp phòng vệ số 1 của OWASP. ([[13 - SQL Injection và Parameterized Query]])
12. **VACUUM là hệ quả trực tiếp của MVCC** — bản cũ của row không tự biến mất. ([[14 - Roles, Backup, VACUUM và Performance]])

---

## Những chỗ nguồn chính thống KHÔNG nói — đã đánh dấu trong bài

Ghi lại để sau này không nhầm là kiến thức có trích dẫn:

- **ACID**: `grep` cả 7 trang nguồn của bài 05 → **không trang nào chứa chữ "ACID"**. PostgreSQL Docs mô tả từng thuộc tính bằng ngôn ngữ thường. Bảng 4 chữ là tổng hợp, nhưng mỗi dòng map tới một câu nguyên văn có thật.
- **"up / down migration"**: không có trong roadmap.sh, PostgreSQL Docs, lẫn Wikipedia. Đánh dấu là giải thích chung. ([[06 - Database Migrations]])
- **"Tham số không bao giờ được diễn giải thành SQL"**: OWASP không có câu đúng chữ đó. Bài 13 ghép hai câu có thật thay vì bịa một câu mới.
- **"Backup chưa test restore thì chưa phải backup"**: PostgreSQL §25.1 không hề nói câu này — bài 14 ghi rõ là ghi chú cá nhân.
- **Bảng so sánh 6 hệ RDBMS** ở bài 15 có nhiều ô để trống kèm lý do, vì không hệ nào tự phát biểu điều đó trong tài liệu chính thức của mình.
- **SQL minh hoạ N+1** và **đoạn JavaScript nối chuỗi** ở bài 13 là ví dụ tự viết, đã gắn nhãn rõ.

---

## Chưa học (nằm ở phần sau của roadmap)

- **Normalization, ORM, transaction phân tán** → `11 - Advanced Backend/03 - More about Databases`
- **Replication, sharding, CAP theorem, partitioning chuyên sâu** → `11 - Advanced Backend/09 - Scaling Databases`
- **NoSQL (Firebase, MongoDB, Redis...)** → `11 - Advanced Backend/10 - NoSQL Databases`
- **Connection pooling** → liên quan node Caching và Web Servers
- PostgreSQL vận hành chuyên sâu → <https://roadmap.sh/postgresql-dba>

## Nguồn tham khảo
- PostgreSQL Documentation: <https://www.postgresql.org/docs/current/>
- OWASP SQL Injection Prevention Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
- MySQL / MariaDB / SQLite / MS SQL / Oracle: xem mục Nguồn tham khảo trong [[15 - So sánh MySQL, MariaDB, SQLite, MS SQL, Oracle]]
- roadmap.sh — Backend: <https://roadmap.sh/backend>
