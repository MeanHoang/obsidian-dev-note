---
tags:
  - gitlab
  - devops
  - migration
created: 2026-08-17
---

# GitLab self-hosted vs GitLab.com — so sánh & migration

> Bối cảnh: đang dùng `https://gitlab.com/h` (SaaS), cân nhắc dựng server riêng `https://git.h.net` (self-managed). Note này trả lời 3 câu: (1) tự dựng server kiểu gì, (2) 2 domain khác nhau chỗ nào, (3) chuyển source code + MR đang mở sang thế nào.

---

## 0. Ví dụ đời sống trước

- **gitlab.com** = thuê căn hộ chung cư có ban quản lý. Điện nước, thang máy, bảo vệ có người lo. Đổi lại: không được đục tường, không được nuôi chó, và ban quản lý giữ chìa khoá dự phòng.
- **git.h.net (self-managed)** = xây nhà riêng trên đất của mình. Muốn đục tường, xây thêm tầng, lắp két sắt riêng — tuỳ. Đổi lại: máy bơm hỏng lúc 2h sáng là **mình** dậy sửa.

Không có lựa chọn nào "đúng" tuyệt đối — chỉ có việc mình có sẵn người trực máy bơm hay không.

---

## 1. Dựng server riêng (self-managed) như nào

### 1.1 Chọn cách cài

Docs GitLab liệt kê các phương án cài: **"Linux, Helm, Docker, Operator, source, or scripts."** ([Install GitLab](https://docs.gitlab.com/install/))

Thực tế 3 hướng hay dùng:

| Cách | Hợp với | Ghi chú |
|---|---|---|
| Linux package (Omnibus) | 1 VM, team nhỏ–vừa | Dễ nhất, 1 process manager lo hết Postgres/Redis/Sidekiq/Nginx |
| Docker | Muốn đóng gói, dễ move | Vẫn là 1 container "béo", không phải microservice |
| Helm chart / Operator | Đã có Kubernetes | Phức tạp hơn hẳn, chỉ nên chọn nếu team đã sống trên k8s |

### 1.2 Cấu hình tối thiểu

Docs requirements ghi baseline cho single-node:

- **"8 vCPU is the baseline"**
- **"16 GB is the baseline"** RAM
- Storage: ~40 GB cho app, cộng thêm dung lượng repo + database

([Installation requirements](https://docs.gitlab.com/install/requirements/))

> Lưu ý: đây là baseline single-node. Deploy lớn hơn phải theo reference architecture / sizing guide, không tự nhân đôi cho vui.

### 1.3 Những thứ phải tự lo (đừng quên khi tính chi phí)

Đây là phần người ta hay bỏ sót khi so sánh "SaaS $x/user vs self-host free":

- **Domain + TLS**: `git.h.net` cần DNS record + cert (Let's Encrypt auto-renew hoặc cert nội bộ).
- **Backup + restore**: backup không có giá trị cho tới khi mình đã **thử restore** một lần.
- **Upgrade**: GitLab release hàng tháng, có upgrade path bắt buộc (không nhảy cóc nhiều major). Đây là công việc định kỳ, không phải one-off.
- **Runner cho CI/CD**: gitlab.com cho shared runner sẵn; self-host phải tự dựng runner và tự trả tiền máy.
- **Object storage** cho artifacts/LFS/uploads (S3/GCS) nếu không muốn disk phình.
- **SMTP** để gửi mail notify MR.
- **Monitoring + on-call**: ai nhận alert lúc server chết.

---

## 2. So sánh `gitlab.com/h` vs `git.h.net`

### 2.1 Bảng so sánh

| Tiêu chí | `https://gitlab.com/h` (SaaS) | `https://git.h.net` (self-managed) |
|---|---|---|
| Ai vận hành | GitLab lo toàn bộ hạ tầng & maintenance | **"install, administer, and maintain your own GitLab instance"** |
| Quyền admin | Hạn chế — không vào được Admin Area, không impersonate / tạo / xoá user ở cấp instance | Full control: security, privacy, data, planned downtime, performance, latency |
| Version | Luôn chạy bản mới nhất, tự động | Mình chủ động — nhưng cũng là mình chịu trách nhiệm upgrade |
| LDAP / SSO nội bộ | LDAP không có trên SaaS | Có |
| Custom git hooks (server-side) | Không — user SaaS không truy cập filesystem | Có |
| Internal visibility | Không có Internal group/project visibility trên SaaS | Có |
| Downtime | Phụ thuộc status.gitlab.com, mình không làm gì được | Mình kiểm soát lịch bảo trì |
| Data residency | Trên hạ tầng GitLab | Trên hạ tầng / VPC của mình |
| CI runner | Có shared runner sẵn (theo quota gói) | Tự dựng, tự trả tiền compute |
| Giá license | **Giá tier Premium/Ultimate giống nhau ở cả 2 mô hình** | Như trái, nhưng cộng thêm infra + người vận hành |

Nguồn cho các gạch đầu dòng khác biệt SaaS: [ALMtoolbox – Differences of gitlab.com (SaaS) vs GitLab Self-managed](https://www.almtoolbox.com/blog/gitlab-com-vs-managed-managed/) (blog bên thứ ba) và [Choosing a subscription | GitLab Docs](https://docs.gitlab.com/subscriptions/choosing_subscription/) (chính thức, cho phần "ai quản lý gì").

### 2.2 Một cái bẫy về subscription

Docs nói thẳng:

> **"Subscriptions cannot be transferred between GitLab.com and GitLab Self-Managed. If you want to switch to a different GitLab offering, you must purchase and apply a new subscription."**

Tức là nếu đang trả tiền Premium trên gitlab.com, chuyển sang `git.h.net` **không** mang license theo được — phải mua mới. Cần tính vào kế hoạch và thời điểm cutover (đừng migrate ngay đầu chu kỳ vừa gia hạn).

### 2.3 Khi nào nên chọn cái nào

Chọn **self-managed `git.h.net`** khi: có yêu cầu compliance/data residency, cần LDAP hoặc server-side git hooks, cần chạy trong mạng nội bộ, hoặc đã có team platform sẵn.

Ở lại **gitlab.com** khi: team nhỏ, không có ai chuyên trách vận hành, và giá trị lớn nhất đang là "không phải nghĩ đến upgrade".

---

## 3. Migration: chuyển source code + MR

### 3.1 Chọn phương pháp

GitLab có 2 đường chính thức:

1. **Direct transfer** — 2 instance nối trực tiếp với nhau qua HTTPS. Đây là cách **được khuyến nghị**, và theo blog GitLab thì **GA từ GitLab 18.3**. ([Migrating by direct transfer is generally available](https://about.gitlab.com/blog/migrating-by-direct-transfer-is-generally-available/))
2. **File export/import** — export ra file rồi upload lên instance đích. Dùng khi 2 instance không thông mạng được (offline). ([Migrate projects by using file exports](https://docs.gitlab.com/user/project/settings/import_export.html))

> Chú ý ràng buộc version của file export: instance export không được cũ hơn quá **2 minor release** so với instance đích.

Chỉ `git clone --mirror` + `git push --mirror` thôi thì **chỉ chuyển được code + branch + tag**, mất sạch MR/issue/comment. Chỉ dùng khi thật sự không cần metadata.

### 3.2 Prerequisites cho direct transfer

Từ [docs direct transfer migrations](https://docs.gitlab.com/user/group/import/direct_transfer_migrations/):

- **"Upgrade both the source and destination instances to GitLab 16.8 or later."** Source không được cũ hơn destination quá 2 minor version.
- **"The network connection between instances or GitLab.com must support HTTPS"** — và **"Firewalls must not block the connection between the source and destination GitLab instances"**. Nghĩa là `git.h.net` phải gọi ra được gitlab.com.
- **"Both GitLab instances must have group migration by direct transfer enabled in application settings"** — trên self-managed, mặc định **tắt**, admin phải bật.
- Personal access token có scope **`api`** lấy từ instance nguồn.
- Có role **Owner** trên group nguồn, và quyền tạo subgroup ở namespace đích.
- **"Ensure Sidekiq is properly configured"** trên instance đích.
- Đủ chỗ trống trong `/tmp` cho archive.
- **User phải được tạo trước ở instance đích, và public email phải khớp giữa 2 bên** — đây là điều kiện để map lại tác giả của MR/comment. Bỏ qua bước này là toàn bộ MR sẽ về tên importer.

### 3.3 Các bước trên UI

1. Trên `git.h.net`, tạo group (hoặc subgroup) đích.
2. Chọn **Import group**.
3. Nhập base URL của instance nguồn (`https://gitlab.com`).
4. Dán personal access token của instance nguồn.
5. **Connect instance**.
6. Chọn group/project → **Import with projects**.
7. Theo dõi trạng thái realtime trên trang import.

> Trên UI, migrate group là migrate **toàn bộ** project trong group. Muốn chọn lẻ từng project thì **phải dùng API**: [Group and project migration by direct transfer API](https://docs.gitlab.com/api/bulk_imports/) — chỉ định `entities[project_entity]`.

Docs cảnh báo rõ:

> **"After you start a migration, you should not make any changes to imported groups or projects on the source instance because these changes might not be copied to the destination instance."**

→ Phải có **freeze window**: khoá merge trên gitlab.com trong lúc migrate.

### 3.4 MR hiện tại — cái gì đi theo, cái gì mất

Theo [Items migrated when using direct transfer](https://docs.gitlab.com/user/group/import/migrated_items/):

**Có migrate (project level):**
- Merge requests
- Merge request approvers
- Merge request comments
- Merge request resource milestone events
- Merge request resource state events
- Merge request reviewers
- Multiple merge request assignees
- Repositories, branches, issues, labels, milestones
- CI pipelines — "Pipeline and job records, such as status, stage, and timestamps, are migrated"

**KHÔNG migrate (project level) — đây là danh sách cần đọc kỹ:**
- **Merge request approval rules** ← khác với "approvers". Rule (kiểu "cần 2 approval từ team backend") **phải setup lại tay** trên `git.h.net`.
- Merge request dependencies
- Merge requests **không có diff hoặc source information**
- CI/CD variables
- Pipeline schedule variables, Pipeline triggers
- Deploy keys, Deploy tokens, Encrypted tokens
- Job artifacts
- Container registry images
- Webhooks
- Package registry
- Wiki comments

**Group level không migrate:** CI/CD variables, Deploy tokens, Webhooks, Push rules, Custom fields, Iteration cadence settings, Pending member invitations.

Có một bug đáng biết: ở **GitLab 16.9 trở về trước**, do [issue 438422](https://gitlab.com/gitlab-org/gitlab/-/issues/438422), có thể gặp `DiffNote::NoteDiffFileCreationError` — khi đó **diff của comment trên MR bị mất, nhưng comment và MR vẫn import được**. Thêm một lý do để cả 2 instance chạy version mới.

### 3.5 Checklist thực thi

**Trước khi migrate**
- [ ] Dựng `git.h.net`, verify TLS, SMTP gửi mail được
- [ ] Bật direct transfer trong Application settings (cả 2 phía)
- [ ] Tạo trước toàn bộ user ở `git.h.net`, set **public email trùng** với gitlab.com
- [ ] Export/ghi lại toàn bộ **CI/CD variables** (không tự chuyển) — nhớ cả masked/protected flag
- [ ] Ghi lại **MR approval rules**, **push rules**, **protected branch rules**
- [ ] Ghi lại danh sách **webhooks**, **deploy keys/tokens**
- [ ] Chạy thử migrate **1 project nhỏ** trước, so metadata bằng mắt
- [ ] Dựng GitLab Runner cho `git.h.net`

**Cutover**
- [ ] Thông báo freeze; merge hoặc close hết MR có thể merge được
- [ ] Đặt group trên gitlab.com về read-only (hoặc khoá quyền push)
- [ ] Chạy direct transfer
- [ ] Setup lại: CI/CD variables, approval rules, protected branches, webhooks, deploy tokens
- [ ] Verify: số MR mở, số issue, số branch, latest commit SHA của vài repo trọng điểm

**Sau cutover — đổi "nơi lưu source code" ở phía dev**

Mỗi người chạy trong repo local:

```bash
# xem remote hiện tại
git remote -v

# đổi sang instance mới
git remote set-url origin https://git.h.net/h/<project>.git
# hoặc SSH
git remote set-url origin git@git.h.net:h/<project>.git

# verify
git remote -v
git fetch origin
```

Những chỗ khác cũng đang trỏ về gitlab.com, dễ quên:
- SSH key: mỗi dev phải add lại public key vào `git.h.net`
- `.gitmodules` (submodule URL) — sửa file rồi `git submodule sync`
- `.gitlab-ci.yml`: `include:` từ project khác, image từ container registry cũ
- Deploy script / server production đang `git pull` từ gitlab.com
- CI của hệ thống khác đang clone repo này
- Renovate/Dependabot config, IDE saved credentials
- Link trong docs, Slack/Lark bookmark, Jira integration

**Với MR đang mở tại thời điểm cutover** — thứ tự ưu tiên:
1. MR nào **merge được thì merge trước** khi migrate. Rẻ nhất.
2. MR còn lại: direct transfer mang MR + comment + reviewer sang, nhưng **approval rule phải set lại**, nên coi như approval cũ mất hiệu lực → cần re-approve.
3. Dev có branch local chưa push: sau khi `git remote set-url`, `git push -u origin <branch>` lên instance mới rồi mở lại MR nếu cần.

> Nên giữ gitlab.com ở chế độ **read-only, chưa xoá** ít nhất 1–2 tháng làm archive để đối chiếu. Xoá là không lấy lại được.

---

## Nguồn

- [Install GitLab — GitLab Docs](https://docs.gitlab.com/install/)
- [Installation requirements — GitLab Docs](https://docs.gitlab.com/install/requirements/)
- [Choosing a subscription — GitLab Docs](https://docs.gitlab.com/subscriptions/choosing_subscription/)
- [Migrate groups by direct transfer — GitLab Docs](https://docs.gitlab.com/user/group/import/direct_transfer_migrations/)
- [Items migrated when using direct transfer — GitLab Docs](https://docs.gitlab.com/user/group/import/migrated_items/)
- [Group and project migration by direct transfer API — GitLab Docs](https://docs.gitlab.com/api/bulk_imports/)
- [Migrate projects and groups by using file exports — GitLab Docs](https://docs.gitlab.com/user/project/settings/import_export.html)
- [Migrating by direct transfer is generally available — GitLab Blog (2025-07-31)](https://about.gitlab.com/blog/migrating-by-direct-transfer-is-generally-available/)
- [Differences of gitlab.com (SaaS) vs GitLab Self-managed — ALMtoolbox](https://www.almtoolbox.com/blog/gitlab-com-vs-managed-managed/) *(bên thứ ba)*
- [GitLab SaaS vs Self-Hosted vs Managed — VSHN](https://www.gitlab.ch/comparison/) *(bên thứ ba)*
- [Issue 438422 — DiffNote::NoteDiffFileCreationError](https://gitlab.com/gitlab-org/gitlab/-/issues/438422)
