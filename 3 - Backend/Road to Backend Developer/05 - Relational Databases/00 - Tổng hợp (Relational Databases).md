# 00 — Tổng hợp: Relational Databases

> Phần 5 series [Road to Backend Developer](https://roadmap.sh/backend) — node **Relational Databases** (+ Migrations, N+1 Problem).
>
> **Tài liệu chính thống chọn để follow:** **PostgreSQL Documentation** — <https://www.postgresql.org/docs/current/>
>
> Lý do chọn PostgreSQL: roadmap liệt kê 6 hệ (MySQL, PostgreSQL, MariaDB, SQLite, MS SQL, Oracle) nhưng kiến thức nền — table, constraint, JOIN, index, transaction — là **chuẩn SQL**, học ở đâu cũng dùng được. PostgreSQL có tài liệu chính thức đầy đủ và miễn phí nhất, lại là hệ đứng sau **Cloud SQL for PostgreSQL** trên GCP.
>
> **Cách trình bày:** 📖 trích nguyên văn tiếng Anh → 🇻🇳 dịch → 💡 ví dụ đời sống. Mọi SQL đều copy nguyên văn từ tài liệu, không tự chế.

---

## Mục lục

| # | Bài | Nguồn | Dòng |
|---|---|---|---|
| 01 | [[01 - Relational Database và PostgreSQL là gì]] | PG Tutorial ch1–2 + roadmap.sh | 435 |
| 02 | [[02 - Tables, Data Types và Constraints]] ⭐ | PG Docs ch5 + ch8 | 965 |
| 03 | [[03 - Queries - SELECT, JOIN, Aggregate]] ⭐⭐ | PG Docs ch7 + Tutorial 2.6–2.7 | 1111 |
| 04 | [[04 - Indexes]] ⭐ | PG Docs ch11 + ch14.1 | 671 |
| 05 | [[05 - Transactions, ACID và MVCC]] ⭐⭐ | PG Tutorial 3.4 + ch13 | 623 |
| 06 | [[06 - Database Migrations]] | PG DDL + roadmap.sh + Wikipedia | 577 |
| 07 | [[07 - N+1 Problem]] | roadmap.sh + PlanetScale + PG EXPLAIN | 368 |

**Tổng: 4.750 dòng, 410 khối trích dẫn nguyên văn — tất cả đều có bản dịch.**

---

## Bản đồ khái niệm

```
Relational database = dữ liệu tổ chức thành TABLE (row × column)

Cấu trúc          ┌── data type   (integer, varchar, text, timestamp...)
  CREATE TABLE ───┼── default value
                  └── CONSTRAINT ─┬── CHECK          điều kiện tuỳ ý
                                  ├── NOT NULL
                                  ├── UNIQUE
                                  ├── PRIMARY KEY    định danh duy nhất 1 row
                                  ├── FOREIGN KEY ◄── thứ tạo nên "quan hệ"
                                  └── EXCLUSION          + ON DELETE/UPDATE

Truy vấn   SELECT ── WHERE ── GROUP BY ── HAVING ── ORDER BY ── LIMIT
             └── JOIN ─┬── INNER       chỉ row khớp cả 2 bên
                       ├── LEFT OUTER  giữ hết bên trái
                       ├── RIGHT OUTER giữ hết bên phải
                       ├── FULL OUTER  giữ hết cả hai
                       └── CROSS       tích Descartes

Tốc độ     INDEX ─┬── B-tree (mặc định) / Hash / GiST / SP-GiST / GIN / BRIN
                  ├── multicolumn — thứ tự cột quyết định
                  ├── unique / partial
                  └── ⚠️ cái giá: chậm ghi, tốn dung lượng, phải bảo trì
           EXPLAIN / EXPLAIN ANALYZE ──► Seq Scan hay Index Scan?

An toàn    TRANSACTION  BEGIN ─ (SAVEPOINT) ─ COMMIT / ROLLBACK
             └── MVCC: readers không chặn writers, writers không chặn readers
             └── isolation level ─┬── Read Committed  (mặc định của PostgreSQL)
                                  ├── Repeatable Read
                                  └── Serializable

Vận hành   MIGRATION  ── ALTER TABLE có phiên bản, chạy lặp lại được
Hiệu năng  N+1 PROBLEM ── 1 query danh sách + N query con → gộp bằng JOIN / IN
```

---

## 10 điều cần nhớ

1. **Foreign key là thứ làm nên chữ "relational".** Không có nó thì chỉ là mấy cái bảng rời. ([[02 - Tables, Data Types và Constraints]])
2. **`ON DELETE` phải chọn có chủ đích** — `CASCADE` xoá lan, `RESTRICT` chặn, `SET NULL` để trống. Chọn sai là mất dữ liệu thật.
3. **Aggregate không dùng được trong `WHERE`, phải dùng `HAVING`.** Chỗ sai kinh điển của người mới. ([[03 - Queries - SELECT, JOIN, Aggregate]])
4. **`ON` lọc trước khi join, `WHERE` lọc sau khi join** — với OUTER JOIN thì hai cái cho kết quả khác nhau.
5. **Index không miễn phí**: ghi chậm hơn, tốn dung lượng, phải bảo trì. Tài liệu PostgreSQL nói thẳng điều này. ([[04 - Indexes]])
6. **Multicolumn index phụ thuộc thứ tự cột** — chỉ hiệu quả khi query ràng buộc các cột **bên trái nhất**.
7. **Muốn biết index có được dùng không thì `EXPLAIN`**, đừng đoán. `Seq Scan` = quét toàn bảng.
8. **Transaction là all-or-nothing.** Ví dụ chuyển tiền Alice/Bob trong tài liệu PostgreSQL là minh hoạ hay nhất. ([[05 - Transactions, ACID và MVCC]])
9. **PostgreSQL mặc định ở Read Committed**, không phải Serializable — nên vẫn gặp nonrepeatable read và phantom read.
10. **N+1 là 1 query + N query, không phải query chậm.** Index không cứu được, phải gộp bằng JOIN hoặc `IN`. ([[07 - N+1 Problem]])

---

## Những chỗ nguồn chính thống KHÔNG nói — đã đánh dấu trong bài

Ghi lại để sau này không nhầm là kiến thức có trích dẫn:

- **ACID**: kiểm tra bằng `grep` trên cả 7 trang nguồn của bài 05 — **không trang nào chứa chữ "ACID"**. PostgreSQL Docs mô tả từng thuộc tính bằng ngôn ngữ thường chứ không dùng nhãn này. Bảng 4 chữ A-C-I-D trong [[05 - Transactions, ACID và MVCC]] là tổng hợp của mình, nhưng mỗi dòng đều map tới một câu nguyên văn có thật trong bài.
- **"up / down migration"**: cặp thuật ngữ này không xuất hiện trong roadmap.sh, PostgreSQL Docs, lẫn Wikipedia Schema migration. Mục tương ứng trong [[06 - Database Migrations]] được đánh dấu là giải thích chung.
- **Tên và cú pháp công cụ migration** (Prisma, Knex, Flyway...): cố ý không nêu, vì không fetch được tài liệu chính thức của chúng trong phạm vi lần này.
- **SQL minh hoạ N+1** trong [[07 - N+1 Problem]] là ví dụ tự viết, đã ghi rõ — không gắn nhãn trích dẫn.

---

## Chưa học (nằm ở phần sau của roadmap)

- **Normalization, ACID chuyên sâu, ORM, transaction phân tán** → `11 - Advanced Backend/03 - More about Databases`
- **Database indexes nâng cao, replication, sharding, CAP theorem** → `11 - Advanced Backend/09 - Scaling Databases`
- **NoSQL (Firebase, MongoDB, Redis...)** → `11 - Advanced Backend/10 - NoSQL Databases`
- PostgreSQL vận hành (backup, tuning, replication) → <https://roadmap.sh/postgresql-dba>

## Nguồn tham khảo
- PostgreSQL Documentation: <https://www.postgresql.org/docs/current/>
- PostgreSQL Tutorial (chương 1–3): <https://www.postgresql.org/docs/current/tutorial.html>
- roadmap.sh — Backend: <https://roadmap.sh/backend>
