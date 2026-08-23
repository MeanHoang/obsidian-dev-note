# Shopify Editions Spring '26 — Shopify CLI

> CLI updates lớn: chạy GraphQL/bulk operations trực tiếp, auto-upgrades theo semver, safer deployments cho CI/CD, và automation tokens.

---

## 1. GraphQL and Bulk Operations from the CLI

Chạy **GraphQL query/mutation** và **bulk operations** trực tiếp từ terminal, với auto authentication và built-in status tracking.

### Commands (CLI 3.90.1+)

| Command | Mô tả |
|---------|--------|
| `shopify app execute` | Chạy standard Admin API query/mutation |
| `shopify app bulk execute` | Start bulk query/mutation, hỗ trợ `--watch` để theo dõi synchronous |
| `shopify app bulk status` | Monitor bulk operation đang chạy |
| `shopify app bulk cancel` | Cancel bulk operation |

### Use cases

- Test GraphQL query không cần Postman hay viết script
- Data migration với bulk operations, CLI handle auth + poll status tự động
- Tích hợp với AI agent để quản lý dev store

**Availability:** GA
**Docs:** https://shopify.dev/changelog/use-the-admin-api-and-bulk-operations-in-shopify-cli

---

## 2. Auto-upgrades and Semantic Versioning

CLI tự động upgrade cho **minor và patch release**. Major version yêu cầu opt-in.

### Behavior

| Release type | Hành vi |
|-------------|---------|
| Patch (3.90.x) | Auto upgrade, transparent |
| Minor (3.x.0) | Auto upgrade, transparent |
| Major (4.0.0) | Yêu cầu confirm rõ ràng |

### Auto-upgrade exclusions

- **CI environments**: bỏ qua auto-upgrade
- **Project-local installations**: bỏ qua auto-upgrade
- **Manual disable**: `shopify config autoupgrade off`

### Deprecated flags/commands removed trong CLI 4.0

| Removed | Thay thế |
|---------|----------|
| `--force` flag (`app deploy`, `app release`) | `--allow-updates` + `--allow-deletes` |
| `--shared-secret` (`app webhook trigger`) | (removed) |
| `--type` (`app generate extension`) | (removed) |
| `shopify webhook trigger` | `shopify app webhook trigger` |
| `shopify theme serve` | `shopify theme dev` |
| `shopify app generate schema` | `shopify app function schema` |

**Impact cho CI/CD:** Pipeline luôn có bản CLI mới nhất với bug fix. Breaking change (major) vẫn cần xác nhận — an toàn cho production. CI/CD dùng `--force` cần migrate sang `--allow-updates`.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/shopify-cli-40-semver-auto-updates-removing-deprecated-flags-and-commands

---

## 3. Safer App Deployments

CLI 3.89 thêm **2 flag mới** cho `shopify app deploy` và `shopify app release`:

| Flag | Mô tả |
|------|--------|
| `--allow-updates` | Deploy/update extensions, **không xoá** extension hiện có |
| `--allow-deletes` | Cho phép xoá extensions |
| `--force` | Combines both (behavior cũ) |

### Best practice cho CI/CD

```bash
# Default pipeline — chỉ thêm/sửa, không xoá
shopify app deploy --allow-updates

# Khi cần xoá extension intentionally
shopify app deploy --allow-deletes
```

> **Warning:** Khi extension bị xoá, **related data trên store đã install app cũng bị xoá**. Luôn dùng `--allow-updates` trong default CI/CD workflow.

**Availability:** GA
**Docs:** https://shopify.dev/changelog/more-control-over-app-deploys-in-cicd-pipelines

---

## 4. App Automation Tokens

Tạo **app automation token** trong Dev Dashboard để deploy từ CI/CD mà không dùng personal token.

### Sử dụng trong CI/CD

```bash
export SHOPIFY_APP_AUTOMATION_TOKEN="your-app-automation-token"
shopify app deploy --config production --allow-updates
```

### Đặc điểm

- **App-scoped**: mỗi token gắn với một app duy nhất
- Thay thế Partner Dashboard CLI tokens (legacy tokens vẫn valid đến hết hạn)
- Có thể revoke independently
- Tích hợp GitHub Workflows và CI/CD tools tương tự

**Availability:** GA
**Docs:** https://shopify.dev/changelog/app-deployment-in-cicd-is-now-available-for-all-apps

---

## Nguồn

- https://shopify.dev/changelog/use-the-admin-api-and-bulk-operations-in-shopify-cli
- https://shopify.dev/changelog/shopify-cli-40-semver-auto-updates-removing-deprecated-flags-and-commands
- https://shopify.dev/changelog/more-control-over-app-deploys-in-cicd-pipelines
- https://shopify.dev/changelog/app-deployment-in-cicd-is-now-available-for-all-apps
