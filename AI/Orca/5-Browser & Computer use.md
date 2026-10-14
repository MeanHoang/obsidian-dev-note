---
tags: [orca, electron, browser, cdp, computer-use]
source: https://github.com/stablyai/orca (commit 9db7b8b6b29f, 2026-10-13)
app: /Applications/Orca.app v1.4.224
---

# 5 - Browser & Computer use

> [!quote] 💬
> "Every Orca worktree has its own browser. It's a real Chromium window — address bar, history, devtools — embedded in a pane."
> (`docs/site/content/docs/browser/overview.mdx`)

Note này trả lời 5 câu hỏi:
1. Trình duyệt trong Orca được nhúng vào app bằng cách nào?
2. Agent (Claude Code, Codex…) điều khiển trình duyệt đó ra sao khi gõ `orca click`, `orca screenshot`?
3. Anh "import tài khoản" (cookie) từ Chrome vào Orca thì code làm gì?
4. Design Mode (bấm vào một nút trên trang → agent nhận HTML/CSS/ảnh) chạy thế nào?
5. Computer use (điều khiển app macOS khác) và `Orca Computer Use.app` là gì?

Phần cuối có thêm proxy `*.orca.localhost` cho cổng dev server theo worktree.

Bối cảnh tiến trình chính / renderer xem ở [[1-Kiến trúc tiến trình]]. Lệnh `orca` và RPC xem ở [[6-CLI, RPC & Skills]].

## Nguồn của note này

| Phần | File đã đọc |
|---|---|
| Nhúng browser | `src/renderer/src/components/browser-pane/host-guest/browser-page-webview.ts`, `src/main/window/createMainWindow.ts`, `src/main/window/main-window-webview-security.ts`, `src/shared/constants.ts` |
| Agent lái browser | `src/cli/specs/browser-basic.ts`, `src/cli/handlers/browser-nav.ts`, `src/main/runtime/rpc/methods/browser-core.ts`, `src/main/browser/agent-browser-bridge-*.ts`, `src/main/browser/cdp-ws-proxy.ts`, `src/main/browser/cdp-loopback-request-guard.ts`, `config/electron-builder.config.cjs`, `package.json` |
| Profile + cookie | `src/main/browser/browser-session-registry.ts`, `src/shared/orca-profiles.ts`, `src/main/browser/browser-cookie-import.ts`, `browser-cookie-chromium-import.ts`, `browser-cookie-key.ts`, `browser-cookie-detection-types.ts`, `browser-cookie-import-policy.ts`, `docs/site/content/docs/browser/profiles.mdx` |
| Design Mode | `docs/site/content/docs/browser/design-mode.mdx`, `src/main/browser/browser-manager-grab.ts`, `grab-guest-react-script.ts`, `browser-grab-screenshot.ts`, `src/renderer/src/components/browser-pane/annotate/*` |
| Computer use | `src/cli/specs/computer.ts`, `skills/computer-use/SKILL.md`, `src/main/computer/*.ts`, `native/computer-use-macos/Sources/OrcaComputerUseMacOS/main.swift`, Info.plist của app đã cài |
| Localhost proxy | `src/main/localhost-worktree-label-proxy.ts`, `src/shared/localhost-worktree-labels.ts` |

---

## 1. Trình duyệt nhúng: thẻ `<webview>` của Electron

> [!note] 📝 So sánh dễ hiểu
> Hình dung cửa sổ Orca là một toà nhà văn phòng (renderer). Trình duyệt là một **phòng khách thuê riêng** bên trong: có cửa riêng, chìa khoá riêng, đồ đạc riêng. Khách trong phòng (trang web) không đi được vào hành lang văn phòng (Node.js, IPC của Orca). Bảo vệ ở cửa (tiến trình chính) kiểm tra từng khách trước khi cho vào phòng.

**Cơ chế.** Orca không dùng `WebContentsView` cho tab browser. Nó dùng thẻ `<webview>` của Electron, tạo bằng `document.createElement('webview')` trong renderer 📖. Mỗi `<webview>` là một "khách" (guest) có `webContents` riêng, chạy trong tiến trình Chromium riêng. Thuộc tính `partition` quyết định khách dùng kho cookie/localStorage nào.

Bước 1: cửa sổ chính phải bật `webviewTag` thì renderer mới được tạo thẻ này 📖 (`src/main/window/createMainWindow.ts:133-136`):

```ts
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      webviewTag: true,
```

Bước 2: renderer tạo thẻ, gắn partition 📖 (`src/renderer/src/components/browser-pane/host-guest/browser-page-webview.ts:58-67`):

```ts
  webview = document.createElement('webview') as Electron.WebviewTag
  webview.setAttribute('partition', webviewPartition)
  webview.setAttribute('allowpopups', '')
  // Why: Electron spreads the webpreferences keys verbatim, so the shared
  // camelCase attribute must stay intact for fullscreen containment to work.
  // Keep Chromium's normal page canvas opaque while the host underneath follows Orca's theme.
  webview.setAttribute(
    'webpreferences',
    `${ORCA_BROWSER_GUEST_WEB_PREFERENCES_ATTRIBUTE},transparent=false`
  )
```

Bước 3: tiến trình chính "gác cổng" ở sự kiện `will-attach-webview`. Partition nào không nằm trong danh sách cho phép thì chặn luôn; preload của renderer bị xoá, Node bị tắt, sandbox bị bật lại 📖 (`src/main/window/main-window-webview-security.ts:65-85`, `:89-104`):

```ts
  mainWindow.webContents.on('will-attach-webview', (event, webPreferences, params) => {
    ...
    const isProfilePartition = browserSessionRegistry.isAllowedPartition(partition)
    ...
    // Why: fail closed — deny any src or partition not in the registry allowlist so a renderer bug can't smuggle preload/Node into an unprivileged guest.
    if ( ... ) {
      event.preventDefault()
      return
    }
    delete params.preload
```

Bước 4: ở `did-attach-webview`, main gắn chính sách popup/điều hướng cho khách ngay lúc tạo (`browserManager.attachGuestPolicies(guest)`) 📖 (`main-window-webview-security.ts:112-124`).

💭 Lý do chọn `<webview>`: thẻ này sống trong DOM của React, nên kéo thả, chia pane, ẩn/hiện theo worktree làm bằng CSS được. Cái giá là phải tự canh bảo mật ở `will-attach-webview` (Electron docs khuyên cẩn thận với `<webview>`), và code có rất nhiều comment "Why" về chuyện này.

Partition mặc định là chuỗi cố định 📖 (`src/shared/constants.ts:48`):

```ts
export const ORCA_BROWSER_PARTITION = 'persist:orca-browser'
```

Tiền tố `persist:` nghĩa là Electron lưu cookie xuống đĩa, tắt app mở lại vẫn còn đăng nhập. 💭 Đây là lý do anh đăng nhập Shopify admin một lần trong Orca là các lần sau vẫn vào được.

---

## 2. Agent lái browser: `orca` CLI → RPC → `agent-browser` → CDP proxy → `<webview>`

> [!note] 📝 So sánh dễ hiểu
> Agent giống một người lái xe từ xa. Nó không ngồi trong xe (trang web). Nó gửi lệnh qua bộ đàm (`orca click`). Tổng đài Orca (tiến trình chính) chuyển lệnh cho một tài xế thuê có sẵn tên `agent-browser`. Tài xế này quen lái Chrome thật, nên Orca dựng một **vô lăng giả** (CDP proxy) có hình dạng giống hệt vô lăng Chrome, nhưng thực ra nối vào chiếc xe `<webview>` của Orca.

**Cơ chế.** `agent-browser` là một gói npm (`"agent-browser": "~0.27.0"`, 📖 `package.json:193`) có sẵn binary native theo từng nền tảng. Lúc đóng gói, Orca copy binary ra ngoài `app.asar` 📖 (`config/electron-builder.config.cjs:646-649`):

```js
      {
        from: 'node_modules/agent-browser/bin/agent-browser-darwin-${arch}',
        to: 'agent-browser-darwin-${arch}'
      },
```

Trên máy anh, file này có thật: `/Applications/Orca.app/Contents/Resources/agent-browser-darwin-arm64`, khoảng 10 MB 📖 (đã `ls`).

`agent-browser` bình thường tự mở Chrome và nói chuyện bằng Chrome DevTools Protocol (CDP). Orca không cho nó mở Chrome. Orca gắn debugger của Electron vào `webContents` của tab, rồi mở một server WebSocket trên `127.0.0.1`, cổng ngẫu nhiên, nói đúng giao thức CDP. Sau đó mỗi lần chạy `agent-browser` đều truyền `--cdp <port>` để nó nối vào proxy này.

### Ví dụ: agent mở Joy admin trên dev store, bấm nút, chụp màn hình

Giả sử trong terminal của worktree `bugfix-store-credit`, Claude Code chạy lần lượt:

```bash
orca goto --url https://admin.shopify.com/store/<dev-store>/apps/<joy-app>
orca snapshot
orca click --element @e12
orca screenshot
```

1. **CLI đọc lệnh.** `orca snapshot` được khai báo trong bảng lệnh 📖 (`src/cli/specs/browser-basic.ts:24-29`):

    ```ts
      {
        path: ['snapshot'],
        summary: 'Capture an accessibility snapshot of the active browser tab',
        usage: 'orca snapshot [--worktree <selector>] [--json]',
        allowedFlags: [...GLOBAL_FLAGS, 'worktree']
      },
    ```

2. **CLI gọi RPC sang app Orca đang chạy.** CLI tìm tab đích theo worktree hiện tại (`cwd`), rồi gọi `browser.snapshot` 📖 (`src/cli/handlers/browser-nav.ts:29-32`):

    ```ts
      snapshot: async ({ flags, client, cwd, json }) => {
        const target = await getBrowserCommandTarget(flags, cwd, client)
        const result = await client.call<BrowserSnapshotResult>('browser.snapshot', target)
    ```

    Phía main, method RPC này chỉ chuyển tiếp 📖 (`src/main/runtime/rpc/methods/browser-core.ts:38-43`). Chi tiết cách CLI nói chuyện với app xem [[6-CLI, RPC & Skills]].

3. **Main xếp hàng lệnh theo tab.** `AgentBrowserBridge.snapshot()` đưa lệnh vào hàng đợi của đúng tab, rồi gọi binary với tham số `snapshot` 📖 (`src/main/browser/agent-browser-bridge-core-commands.ts:20-31`):

    ```ts
      async snapshot(worktreeId?: string, browserPageId?: string): Promise<BrowserSnapshotResult> {
        // Why: snapshot creates fresh refs so it must bypass the stale-ref guard
        return this.enqueueTargetedCommand(worktreeId, browserPageId, async (sessionName, target) => {
          const result = (await this.execAgentBrowser(sessionName, [
            'snapshot'
          ])) as BrowserSnapshotResult
    ```

    Mỗi tab có một session riêng tên `orca-tab-<browserPageId>` 📖 (`agent-browser-bridge-lifecycle.ts:41`, `agent-browser-orphan-sweep.ts:4`).

4. **Lần đầu dùng tab: dựng CDP proxy.** 📖 (`src/main/browser/agent-browser-bridge-lifecycle.ts:106-110`):

    ```ts
      // Why: the daemon persists sessions (incl. CDP port) across restarts; close the stale one first or it ignores --cdp and hits the dead port.
      await this.closeStaleAgentBrowserSession(sessionName)

      const proxy = new CdpWsProxy(wc, () => this.browserManager.holdPaintForCapture(webContentsId))
      const cdpEndpoint = await proxy.start()
    ```

    `start()` gắn debugger vào `webContents` của `<webview>`, rồi nghe ở `127.0.0.1` cổng 0 (hệ điều hành tự chọn cổng trống) 📖 (`src/main/browser/cdp-ws-proxy.ts:108-113`):

    ```ts
      this.httpServer.listen(0, '127.0.0.1', () => {
        this.httpServer?.removeListener('error', onListenError)
        const addr = this.httpServer!.address()
        if (typeof addr === 'object' && addr) {
          this.port = addr.port
          resolve(`ws://127.0.0.1:${this.port}`)
    ```

5. **Chạy binary với `--session` và `--cdp`.** 📖 (`src/main/browser/agent-browser-bridge-execution.ts:89-102`):

    ```ts
    const args = ['--session', sessionName]
    ...
    // Why: a restarted named daemon auto-launches Chrome unless every invocation reasserts Orca's CDP owner.
    args.push('--cdp', String(session.proxy.getPort()))
    for (const commandArg of commandArgs) {
      args.push(commandArg)
    }
    args.push('--json')
    ```

    Đường dẫn binary: ưu tiên bản trong `process.resourcesPath`, bản dev thì lấy trong `node_modules/agent-browser/bin` 📖 (`agent-browser-bridge-process.ts:15-25`).

6. **`agent-browser` gửi lệnh CDP, proxy chuyển vào `<webview>`.** Phần lớn lệnh đi thẳng qua `webContents.debugger.sendCommand`. Một số lệnh Electron xử lý không ổn thì proxy tự làm 📖 (`cdp-ws-proxy.ts:187-191`):

    ```ts
    // Why: Page.captureScreenshot via debugger.sendCommand hangs on Electron webview guests.
    if (msg.method === 'Page.captureScreenshot') {
      void this.pageCapture.handleScreenshot(client, clientId, msg.params)
      return
    }
    ```

    Vậy `orca screenshot` cuối cùng đi qua `cdp-screenshot.ts` của Orca, không qua CDP gốc (chi tiết hàm chụp: chưa verify từng dòng).

7. **Kết quả JSON quay về.** `snapshot` trả cây accessibility với các ref kiểu `@e12`; `orca click --element @e12` dùng ref đó (`agent-browser-bridge-core-commands.ts:33-41`). 💭 Đây là lý do agent luôn phải `snapshot` trước khi `click`: ref chỉ sống tới lần snapshot sau (comment "stale-ref guard" ở bước 3).

**Bảo vệ cổng CDP.** Ai chiếm được cổng CDP là đọc được cookie của tab. Proxy chỉ nhận request không có header `Origin` và có `Host` là loopback 📖 (`src/main/browser/cdp-loopback-request-guard.ts:9-15`):

```ts
export function isTrustedCdpLoopbackRequest(req: IncomingMessage, port: number): boolean {
  if (req.headers.origin !== undefined) {
    return false
  }
  const host = req.headers.host?.toLowerCase()
  return host === `127.0.0.1:${port}` || host === `localhost:${port}`
}
```

Comment ở đầu file giải thích: trình duyệt luôn gửi `Origin` khi mở WebSocket, còn client CDP thì không; `Host` không phải loopback nghĩa là bị DNS rebinding 📖.

> [!tip] Danh sách lệnh browser của `orca`
> Cơ bản (📖 `src/cli/specs/browser-basic.ts`): `open-url`, `snapshot`, `screenshot`, `full-screenshot`, `click`, `fill`, `type`, `select`, `scroll`, `goto`, `back`, `reload`, `eval`, `wait`, `hover`, `drag`, `upload`, `pdf`, `tab list/create/switch/close`, `tab profile list/create/use-default/clone`.
> Nâng cao (📖 `src/cli/specs/browser-advanced.ts`): `cookie get/set/delete`, `viewport`, `intercept enable/disable`, `console`, `network`, `storage local/session`, `dialog accept/dismiss`, `find`, `highlight`…

---

## 3. Profile và import cookie (cách anh "mang tài khoản" vào Orca)

> [!note] 📝 So sánh dễ hiểu
> Mỗi profile là một **chùm chìa khoá riêng**. Import cookie giống việc mang chùm chìa khoá từ nhà cũ (Chrome) sang nhà mới (Orca): Orca mở két Keychain của macOS lấy mã giải khoá, sao chép từng chìa, rồi treo vào đúng chùm của profile đích. Riêng chìa Google thì không cho mang, phải làm chìa mới tại chỗ.

### 3.1 Profile = partition

Lưu ý tên dễ nhầm: `src/main/orca-profiles/` là **profile người dùng Orca** (tài khoản cloud, chuyển project giữa profile), không phải profile trình duyệt. Profile trình duyệt nằm ở `src/main/browser/browser-session-registry.ts` 💭 (suy ra từ tên file và nội dung đã đọc).

Mỗi profile trình duyệt có một partition riêng, tạo từ id 📖 (`src/main/browser/browser-session-registry.ts:221-238`):

```ts
  async createProfile(
    scope: BrowserSessionProfileScope,
    label: string
  ): Promise<BrowserSessionProfile | null> {
    ...
    if (scope !== 'isolated' && scope !== 'imported') {
      return null
    }
    const id = randomUUID()
    // Why: deterministic partition-from-id lets main rebuild the allowlist on restart without a separate partition→profile map.
    const partition = getOrcaProfileBrowserSessionPartition(this.activeOrcaProfileId, id)
```

Registry này cũng là danh sách cho phép mà `will-attach-webview` hỏi ở mục 1 (comment ở `browser-session-registry.ts:50`). Profile mặc định của người dùng Orca mặc định dùng `persist:orca-browser`; người dùng Orca khác dùng `persist:orca-profile-<id>-browser-default` 📖 (`src/shared/orca-profiles.ts:331-336`).

Docs ghi: "Agent-driven browser commands inherit the active profile" 📖 (`docs/site/content/docs/browser/profiles.mdx`). Nghĩa là agent bấm trong tab nào thì dùng cookie của profile tab đó.

### 3.2 Import cookie từ Chrome: các bước

Anh bấm nút import trên thanh công cụ browser, chọn Google Chrome:

1. **Tìm trình duyệt đã cài.** Orca biết sẵn Chrome, Edge, Arc, Brave, Comet, Helium (họ Chromium), Firefox và Safari 📖 (`browser-cookie-detection-types.ts:32-79`, `browser-cookie-detection.ts:18-82`).
2. **Rẽ nhánh theo họ trình duyệt** 📖 (`src/main/browser/browser-cookie-import.ts:55-67`): Firefox, Safari có hàm riêng; còn lại đi `importChromiumCookies`.
3. **Lấy khoá giải mã từ Keychain.** Chrome trên macOS mã hoá cookie bằng mật khẩu "Chrome Safe Storage" trong Keychain. Orca gọi lệnh `security` của macOS để lấy, rồi dẫn khoá AES-128 bằng PBKDF2 📖 (`src/main/browser/browser-cookie-key.ts:43-57`):

    ```ts
    export function getMacEncryptionKey(
      keychainService: string,
      keychainAccount: string
    ): EncryptionKeyResult | null {
      try {
        const raw = runKeychainCommand(
          'security',
          ['find-generic-password', '-s', keychainService, '-a', keychainAccount, '-w'],
          30_000
        )
        return {
          mode: 'aes-128-cbc',
          keysByVersion: {
            v10: pbkdf2Sync(raw, PBKDF2_SALT, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, 'sha1')
    ```

    (`PBKDF2_SALT = 'saltysalt'`, 1003 vòng, `:14-16`). 💭 Đây là lúc macOS hiện hộp thoại hỏi "Orca muốn truy cập Chrome Safe Storage".
4. **Đọc SQLite cookie của Chrome, giải mã, ghi vào partition đích** dưới một khoá mutex theo partition 📖 (`browser-cookie-chromium-import.ts:32-54`). Comment giải thích vì sao không dùng `session.cookies.set()`:

    ```ts
      // Why: cookies.set() rejects many valid values (bytes > 0x7F); instead write plaintext to the `value` column, which CookieMonster reads raw when `encrypted_value` is empty and re-encrypts on flush in packaged builds.
    ```

    Nghĩa là Orca ghi thẳng vào file SQLite cookie của Electron, có bước "staging" để gộp vào lần khởi động lạnh sau (`:30-31`).
5. **Bỏ cookie Google.** 📖 (`src/main/browser/browser-cookie-import-policy.ts:115`):

    ```ts
    const NON_TRANSPLANTABLE_DOMAINS = ['google.com'] as const
    ```

    Docs nói rõ: chỉ thay cookie của các domain có trong lần import, domain khác giữ nguyên; Google phải đăng nhập trực tiếp trong Orca 📖 (`profiles.mdx`).

💭 Với Joy: cookie `admin.shopify.com` và `accounts.shopify.com` không bị chặn, nên đăng nhập Shopify từ Chrome mang sang được. Nhưng nếu tài khoản Shopify của anh đăng nhập bằng nút "Continue with Google" thì bước SSO Google sẽ phải làm lại trong Orca (chưa verify thực tế).

---

## 4. Design Mode: bấm vào phần tử → agent nhận ngữ cảnh

> [!note] 📝 So sánh dễ hiểu
> Giống việc anh cầm bút laser chỉ vào một chỗ trên màn hình rồi nói với đồng nghiệp "sửa cái này". Design Mode biến cú chỉ tay đó thành một tờ giấy ghi đủ: thẻ HTML, class, CSS đang áp dụng, tên component React, file nguồn và dòng code, kèm ảnh chụp đúng vùng đó.

Trong code, tính năng này tên là **grab** (lấy) và **annotate** (ghi chú).

**Luồng: anh bật Design Mode trên trang Joy admin đang chạy local, bấm vào nút "Save" bị lệch.**

1. **Bật chế độ.** Main tiêm một script overlay vào trang bằng `executeJavaScript` 📖 (`src/main/browser/browser-manager-grab.ts:75-81`):

    ```ts
        // Why: inject the overlay runtime eagerly on arm so the hover UI appears instantly; re-injection is idempotent/safe.
        try {
          await guest.executeJavaScript(buildGuestOverlayScript('arm'))
          return true
        } catch {
          return false
        }
    ```

    Click được bắt ngay trong trang, vì Electron không báo sự kiện chuột của guest cho main (comment `:87`).
2. **Script trong trang gom dữ liệu phần tử.** Hàm `extractPayload(el)` trả về URL trang, kích thước viewport, `selector`, `cssClasses`, `htmlSnippet`, `accessibility`, `rectViewport`, `computedStyles`, `ancestorPath`… 📖 (`src/main/browser/grab-guest-react-script.ts:96-145`):

    ```js
      function extractPayload(el) {
        var rect = el.getBoundingClientRect();
        var react = getReactMetadata(el);
        return {
          page: {
            sanitizedUrl: sanitizeUrl(window.location.href),
    ```

3. **Tìm file nguồn qua React fiber.** Script đọc thuộc tính ẩn `__reactFiber$…` trên DOM node, đi ngược lên cây fiber để lấy tên component và `_debugSource` 📖 (`grab-guest-react-script.ts:13-14`, `:73-76`):

    ```js
        var source = fiber._debugSource || (fiber._debugOwner && fiber._debugOwner._debugSource);
        if (!sourceFile && source && source.fileName && source.lineNumber) {
          sourceFile = cleanSourcePath(source.fileName) + ':' + source.lineNumber +
            (source.columnNumber !== undefined ? ':' + source.columnNumber : '');
    ```

    💭 `_debugSource` chỉ có ở bản React dev build (do plugin JSX dev gắn vào). Với Joy admin build production trên Shopify, `sourceFile` sẽ là `null`, chỉ còn tên component. Với Joy chạy local (`yarn dev`) thì có thể có (chưa verify với phiên bản React của Joy; React 19 đã bỏ `_debugSource`).
4. **Chụp ảnh đúng vùng.** Main gọi `guest.capturePage()` rồi cắt theo `rect`, có tính `devicePixelRatio` 📖 (`src/main/browser/browser-grab-screenshot.ts:50`, `:59`). Trước khi chụp, overlay của Orca bị ẩn để không lọt vào ảnh (`:4-11`).
5. **Đưa cho agent.** Có hai đường:
    - Chế độ copy: click trái là chép bản text vào clipboard 📖 (`src/renderer/src/components/browser-pane/annotate/use-browser-page-grab-annotations.ts:164-168`). Text bắt đầu bằng `Attached browser context from <url>`, có `Selector:`, `Source:`, `React:` 📖 (`GrabConfirmationSheet.tsx:11-35`). Phím `S` chép ảnh 📖 (`browser-page-grab-action.ts:40-45`).
    - Chế độ annotate: gom nhiều ghi chú thành markdown (`formatBrowserAnnotationsAsMarkdown`) rồi gửi cho agent qua popover chọn agent 📖 (`use-browser-page-annotation-send.ts:59-69`, `:99-113`).

    Docs viết "All of that ships into the active agent terminal as one attachment" 📖 (`design-mode.mdx`). Trong code em đọc được, đường copy là clipboard, còn đường gửi thẳng cho agent là qua annotate. Hàm đẩy text vào PTY cụ thể: chưa verify. Việc gõ vào terminal agent xem [[2-Terminal & PTY]] và [[4-Tích hợp agent]].

---

## 5. Computer use: điều khiển app macOS khác

> [!note] 📝 So sánh dễ hiểu
> Orca muốn bấm nút trong Finder hay Simulator thì cần "giấy phép trợ năng" (Accessibility) và "giấy phép quay màn hình" (Screen Recording) của macOS. Thay vì xin giấy phép cho cả Orca, nó thuê một **người giúp việc nhỏ** có giấy tờ riêng (`Orca Computer Use.app`). Orca nói chuyện với người này qua một hộp thư riêng (Unix socket) có mật khẩu dùng một lần.

**Phạm vi.** Skill `computer-use` ghi rõ dùng cho cửa sổ app thật (Chrome, Safari, app native), **không** dùng cho browser nhúng của Orca 📖 (`skills/computer-use/SKILL.md`, phần `description`). Lệnh: `orca computer list-apps`, `get-app-state`, `click`, `type-text`, `press-key`, `hotkey`, `scroll`, `drag`, `set-value`… 📖 (`src/cli/specs/computer.ts:15-118`).

**Luồng: agent chạy `orca computer get-app-state --app Finder`.**

1. CLI → RPC sang app (như mục 2).
2. Main giữ một tiến trình con Node riêng (sidecar) bằng `fork` 📖 (`src/main/computer/sidecar-client.ts:1`, `:215`). Sidecar nhận message, gọi `currentComputerProvider()` 📖 (`sidecar-entry.ts:2`, `:31-38`). 💭 Tách sidecar để một lệnh trợ năng bị treo không làm đơ tiến trình chính.
3. Trên macOS, provider là `MacOSNativeProviderClient`; trên Windows/Linux là `DesktopScriptProviderClient` 📖 (`computer-provider-lifecycle.ts:30-45`).
4. Tìm helper app 📖 (`src/main/computer/macos-native-provider-paths.ts:9`, `:20-27`):

    ```ts
      const packaged = [join(process.resourcesPath ?? '', 'Orca Computer Use.app')]
      ...
      const executablePath = join(appPath, 'Contents', 'MacOS', 'orca-computer-use-macos')
    ```

    Trên máy anh: `/Applications/Orca.app/Contents/Resources/Orca Computer Use.app/Contents/MacOS/orca-computer-use-macos` có thật 📖. Info.plist có bundle id `com.stablyai.orca.computer-use`, `LSUIElement = 1` (không hiện icon Dock), và hai câu xin quyền `NSAccessibilityUsageDescription`, `NSScreenCaptureUsageDescription` 📖 (`plutil -p`).
5. Spawn helper với socket + token 📖 (`src/main/computer/macos-native-provider-transport.ts:100-108`):

    ```ts
      const socketDirectory = mkdtempSync(join(tmpdir(), 'orca-computer-use-'))
      chmodSync(socketDirectory, 0o700)
      const socketPath = join(socketDirectory, 'provider.sock')
      const socketToken = randomUUID()
      const socketTokenPath = join(socketDirectory, 'provider.token')
      writeFileSync(socketTokenPath, socketToken, { encoding: 'utf8', mode: 0o600 })
      // Why: launching the nested helper via LaunchServices can make TCC evaluate
      // Orca.app as responsible; the signed helper executable owns this grant.
      const provider = spawnProvider(helperExecutablePath, socketPath, socketTokenPath)
    ```

    Tham số thật: `['--agent', socketPath, '--token-file', socketTokenPath]` 📖 (`:150-153`). Kết nối xong thì xoá file token (`:120`).
6. Mỗi request là một dòng JSON kèm token 📖 (`macos-native-provider-client.ts:104-105`):

    ```ts
        const token = this.socketToken
        const line = `${JSON.stringify({ id, method, params, token })}\n`
    ```

7. Helper viết bằng Swift (~4300 dòng `main.swift`). Nó đọc cây giao diện bằng Accessibility API (`AXUIElementCreateApplication`, `AXUIElementPerformAction`, `AXUIElementSetAttributeValue`) và chụp cửa sổ bằng `ScreenCaptureKit` 📖 (`native/computer-use-macos/Sources/OrcaComputerUseMacOS/main.swift:8`, `:612`, `:801`, `:818`). Kiểm tra quyền bằng `AXIsProcessTrusted()` (`:1054`).

💭 Ý tưởng hay: tách quyền hệ thống ra một app con nhỏ, đã ký. macOS (TCC) cấp quyền cho đúng app con đó, Orca chính không cần quyền quay màn hình.

---

## 6. `*.orca.localhost`: phân biệt cổng dev server theo worktree

> [!note] 📝 So sánh dễ hiểu
> Anh có 3 worktree Joy, cả 3 đều chạy dev server ở `localhost:3000`/`3001`/`3002`. Nhìn tab browser thì không biết tab nào của worktree nào. Orca gắn **biển tên** cho từng cổng: `bugfix-store-credit.orca.localhost:<cổng proxy>`, rồi một người gác (proxy) nhìn biển tên để dẫn về đúng cổng thật.

Đây là tuỳ chọn trong Settings: "Localhost Worktree Labels — Open workspace ports as worktree-specific Orca localhost URLs so browser tabs are easier to tell apart." 📖 (`src/renderer/src/components/settings/BrowserLocalhostWorktreeLabelsSetting.tsx:15-22`).

1. Renderer gọi IPC `localhostWorktreeLabels:register` khi mở một cổng của workspace 📖 (`src/main/ipc/localhost-worktree-labels.ts:18-25`).
2. Proxy tạo một HTTP server dùng chung trên `127.0.0.1`, cổng ngẫu nhiên 📖 (`src/main/localhost-worktree-label-proxy.ts:81`).
3. Nhãn lấy từ tên worktree; worktree chính thì thành `<project>-main`; trùng thì thêm `-2`, `-3` 📖 (`src/shared/localhost-worktree-labels.ts:76-85`, proxy `:100-111`).
4. Đổi hostname và port của URL 📖 (`localhost-worktree-label-proxy.ts:113-121`):

    ```ts
      private buildLabeledUrl(label: string, target: URL): string {
        ...
        const url = new URL(target.toString())
        url.hostname = `${label}${ORCA_LOCALHOST_SUFFIX}`
        url.port = String(this.listenPort)
        return url.toString()
      }
    ```

5. Khi có request, proxy đọc `Host`, tìm route, pipe nguyên request/response sang cổng thật; WebSocket (HMR) đi qua `handleUpgrade` 📖 (`:123-165`). Comment ghi rõ chỉ đổi hostname, header như CSP và cookie giữ nguyên.
6. Xoá worktree thì gỡ route 📖 (`src/main/ipc/worktrees/removal/worktree-removal-ownership.ts:96`).

💭 `*.localhost` được Chromium tự trỏ về 127.0.0.1 nên không cần sửa `/etc/hosts`. Với Joy: cookie theo host, nên phiên đăng nhập ở `a.orca.localhost` và `b.orca.localhost` tách nhau, tiện test hai worktree song song (chưa verify với Joy).

---

## Bảng so sánh: 3 cách "điều khiển" trong Orca

| | Browser nhúng (`orca click`) | Design Mode (grab) | Computer use (`orca computer`) |
|---|---|---|---|
| Ai ra lệnh | Agent qua CLI | Người dùng bấm chuột | Agent qua CLI |
| Đối tượng | `<webview>` trong Orca | `<webview>` trong Orca | App macOS khác (Finder, Chrome thật…) |
| Kênh kỹ thuật | `agent-browser` → CDP proxy WebSocket → `webContents.debugger` | `executeJavaScript` tiêm script + `capturePage` | Sidecar Node → Unix socket + token → helper Swift |
| Cách xác định phần tử | Ref `@eN` từ accessibility snapshot | Toạ độ chuột + DOM | Element index từ cây Accessibility |
| Quyền cần | Không cần quyền macOS | Không cần quyền macOS | Accessibility + Screen Recording |
| Cookie | Theo partition của profile | Theo partition của profile | Của app đích |

---

## Bài học cho mình (Joy / Node.js)

1. 💭 **Cổng debug chỉ nghe loopback và kiểm tra `Origin`/`Host`.** Bất kỳ server nội bộ nào anh dựng cho script/tunnel (ví dụ server nhận webhook local, proxy test) nên `listen(0, '127.0.0.1')` và từ chối request có `Origin` lạ. Ba dòng ở `cdp-loopback-request-guard.ts:10-14` dùng lại được gần như nguyên văn.
2. 💭 **Muốn tài khoản test sống lâu thì dùng partition/profile riêng có `persist:`.** Khi viết test Playwright cho Joy admin, dùng `storageState` hoặc thư mục profile riêng cho từng store (ag-mh-shop2, staging) thay vì đăng nhập lại mỗi lần, và tách profile để cookie store này không đè store kia.
3. 💭 **Comment "Why:" trước mỗi chỗ làm khác thường.** Orca ghi lý do ngay cạnh code lạ (vì sao tự chụp màn hình thay vì CDP, vì sao ghi thẳng SQLite). Áp vào Joy: chỗ nào né Shopify throttle, né Firestore limit thì ghi một dòng `// Why:` để người review không "sửa lại cho đúng chuẩn".
4. 💭 **Tách việc cần quyền cao hoặc dễ treo ra tiến trình con.** Orca để Accessibility trong helper riêng và sidecar `fork`. Với Firebase Functions, cùng ý: việc nặng/dễ treo (sync order dài) đưa sang Pub/Sub hoặc Cloud Task riêng, có timeout và dọn dẹp rõ ràng, không chạy chung với request HTTP.

---

## Nguồn

Repo: https://github.com/stablyai/orca, commit `9db7b8b6b29f574f9d10326c4ee89f00290f7042`.

- `docs/site/content/docs/browser/overview.mdx`
- `docs/site/content/docs/browser/profiles.mdx`
- `docs/site/content/docs/browser/design-mode.mdx`
- `package.json` (dòng 193)
- `config/electron-builder.config.cjs` (dòng 640-653)
- `src/shared/constants.ts`
- `src/shared/orca-profiles.ts`
- `src/shared/browser-grab-types.ts`
- `src/shared/localhost-worktree-labels.ts`
- `src/main/window/createMainWindow.ts`
- `src/main/window/main-window-webview-security.ts`
- `src/renderer/src/components/browser-pane/host-guest/browser-page-webview.ts`
- `src/cli/specs/browser-basic.ts`, `src/cli/specs/browser-advanced.ts`, `src/cli/specs/computer.ts`
- `src/cli/handlers/browser-nav.ts`
- `src/main/runtime/rpc/methods/browser-core.ts`
- `src/main/browser/browser-manager.ts`, `agent-browser-bridge.ts`, `agent-browser-bridge-core-commands.ts`, `agent-browser-bridge-execution.ts`, `agent-browser-bridge-lifecycle.ts`, `agent-browser-bridge-process.ts`, `agent-browser-orphan-sweep.ts`
- `src/main/browser/cdp-ws-proxy.ts`, `cdp-loopback-request-guard.ts`, `cdp-debugger-channel.ts`, `cdp-page-capture-commands.ts`
- `src/main/browser/browser-session-registry.ts`
- `src/main/browser/browser-cookie-import.ts`, `browser-cookie-chromium-import.ts`, `browser-cookie-key.ts`, `browser-cookie-detection.ts`, `browser-cookie-detection-types.ts`, `browser-cookie-import-policy.ts`
- `src/main/browser/browser-manager-grab.ts`, `grab-guest-react-script.ts`, `browser-grab-screenshot.ts`
- `src/renderer/src/components/browser-pane/annotate/GrabConfirmationSheet.tsx`, `browser-page-grab-action.ts`, `use-browser-page-grab-annotations.ts`, `use-browser-page-annotation-send.ts`
- `src/main/computer/sidecar-client.ts`, `sidecar-entry.ts`, `computer-provider-lifecycle.ts`, `macos-native-provider-paths.ts`, `macos-native-provider-transport.ts`, `macos-native-provider-client.ts`
- `native/computer-use-macos/Sources/OrcaComputerUseMacOS/main.swift`
- `skills/computer-use/SKILL.md`, `skills/orca-cli/SKILL.md`
- `src/main/localhost-worktree-label-proxy.ts`, `src/main/ipc/localhost-worktree-labels.ts`, `src/main/ipc/worktrees/removal/worktree-removal-ownership.ts`, `src/renderer/src/components/settings/BrowserLocalhostWorktreeLabelsSetting.tsx`
- App đã cài: `/Applications/Orca.app/Contents/Resources/agent-browser-darwin-arm64`, `/Applications/Orca.app/Contents/Resources/Orca Computer Use.app/Contents/Info.plist`
