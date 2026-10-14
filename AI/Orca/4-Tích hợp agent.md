---
tags: [orca, ai-agent, electron, hooks, acp]
source: https://github.com/stablyai/orca (commit 9db7b8b6, 2026-10-13)
---

# 4 - Tích hợp agent

> [!quote] 💬
> "Fan one prompt across five agents, each in its own isolated git worktree — compare the results and merge the winner."
> (`README.md:51`)

Note này trả lời 1 câu hỏi: Orca chạy được hàng chục CLI agent khác nhau (Claude Code, Codex, Cursor, Gemini, OpenCode, Pi, Copilot...) mà vẫn biết agent nào **đang làm**, agent nào **đang chờ anh trả lời**, agent nào **xong rồi**. Làm sao?

Ngắn gọn: Orca **không đoán** trạng thái từ chữ trên màn hình. Nó cài "hook" vào config của từng agent, hook bắn 1 HTTP request về server nhỏ trong Orca mỗi khi có sự kiện. Xem bức tranh tổng ở [[0-Tổng quan]], tiến trình chính / renderer ở [[1-Kiến trúc tiến trình]].

## Nguồn của note này

| Phần | File đã đọc |
|---|---|
| Danh sách agent, cấu hình từng agent | `src/shared/tui-agent.ts`, `src/shared/tui-agent-config.ts` |
| Khởi chạy agent | `src/main/agent-launch/agent-launch-executor.ts`, `agent-launch-mode.ts`, `agent-launch-prompt-delivery.ts` |
| Hook + server trạng thái | `src/main/claude/claude-managed-hook-events.ts`, `src/main/claude/hook-script.ts`, `src/main/claude/hook-settings.ts`, `src/main/agent-hooks/hook-post-command.ts`, `src/main/agent-hooks/server/server-lifecycle.ts`, `server-runtime-env.ts`, `src/shared/agent-status-types.ts`, `src/shared/agent-hook-listener.ts`, `src/shared/agent-hook-listener/providers/claude-events.ts`, `codex-events.ts`, `native/windows-agent-hook/src/main.rs`, `src/main/agent-state-file-reader.ts` |
| Spinner trên tiêu đề tab | `src/shared/synthetic-agent-title.ts`, `src/main/synthetic-title-spinner.ts`, `src/main/startup/synthetic-title-runtime.ts`, `src/main/synthetic-title-visibility.ts` |
| Thông báo | `src/renderer/src/hooks/agent-hook-completion-notifications.ts`, `src/shared/notification-settings-types.ts` |
| Workspace trust | `src/main/agent-workspace-trust.ts`, `src/main/agent-trust-presets.ts` |
| Native chat, SDK, ACP | `src/main/runtime/structured-agent-runtime-registrations.ts`, `src/main/claude/claude-stream-json-connection.ts`, `claude-agent-sdk-process-spawn.ts`, `src/main/acp/acp-launch-specs.ts`, `acp-session-runtime.ts`, `config/scripts/acp/generate-protocol.mjs`, https://agentclientprotocol.com/overview/introduction |
| Tài khoản, rate limit | `src/main/claude-accounts/claude-account-folder.ts`, `claude-command-process.ts`, `src/main/rate-limits/claude-oauth-usage-request.ts`, `codex-rpc-rate-limit-probe.ts`, `src/main/claude-usage/transcript-file-discovery.ts` |

## Ví dụ xuyên suốt

Anh mở repo `joy`, gõ 1 prompt "thêm field `refundAmount` vào log đổi điểm", rồi fan ra 2 worktree: worktree A chạy Claude Code, worktree B chạy Codex (worktree xem [[3-Worktree & Git]]). 5 phút sau, Codex hỏi xin quyền chạy `npm test`. Tab B chuyển sang màu vàng "Codex - action required", máy Mac hiện thông báo. Claude ở tab A vẫn quay spinner. Phần dưới đi theo đúng chuỗi này.

## 1. Mỗi agent là 1 dòng cấu hình

> [!note] 📝 So sánh dễ hiểu
> Như sổ danh bạ thợ sửa nhà: mỗi thợ có 1 dòng ghi "gọi số nào, nói tiếng gì, có cần xin phép chủ nhà trước không". Người quản lý không cần biết từng thợ làm việc thế nào, chỉ tra sổ.

**Cơ chế.** 📖 `src/shared/tui-agent.ts:4-40` khai báo kiểu `TuiAgent` với hơn 35 agent: `claude`, `codex`, `opencode`, `pi`, `gemini`, `cursor`, `copilot`, `grok`, `amp`, `kiro`... Mỗi agent có 1 dòng trong `TUI_AGENT_CONFIG_SOURCE` (`src/shared/tui-agent-config.ts:27`) nói:
- `detectCmd`: tên lệnh để chạy và nhận diện tiến trình.
- `promptInjectionMode`: prompt đi vào agent bằng cách nào (`argv` = gắn vào dòng lệnh, `stdin-after-start` = gõ vào sau khi agent mở xong).
- `preflightTrust`: trước khi chạy có cần ghi sẵn "tin thư mục này" không (mục 6).

```ts
// src/shared/tui-agent-config.ts:28-35
  claude: {
    detectCmd: 'claude',
    promptInjectionMode: 'argv',
    pasteNeedsTypedRequest: true,
    // Why: `claude --prefill <text>` seeds the input without submitting, avoiding the paste-after-ready race (PR https://github.com/stablyai/orca/pull/926).
    draftPromptFlag: '--prefill',
    preflightTrust: 'claude'
  },
```

```ts
// src/shared/tui-agent-config.ts:64-72
  codex: {
    detectCmd: 'codex',
    promptInjectionMode: 'argv',
    windowsInputRecordPasteNewline: 'alt-enter',
    preflightTrust: 'codex',
    draftPasteReadySignal: 'codex-composer-prompt',
    draftPasteReadyTimeoutMs: 20_000,
    submitRetryDelayMs: 1200
  },
```

**Điểm chung của các thư mục adapter.** 📖 Mỗi agent có 1 thư mục riêng trong `src/main/` (`claude/`, `codex/`, `cursor/`, `copilot/`, `gemini/`, `amp/`, `droid/`...). Thư mục nào cũng có `hook-service.ts` (đã `ls` từng thư mục). 💭 Đây là phần "bắt buộc" của 1 adapter: biết cách ghi hook vào file config riêng của agent đó. Phần còn lại khác nhau rất nhiều: `codex/` có hơn 30 file chỉ riêng cho hook và trust, vì Codex lưu config bằng TOML và có cơ chế duyệt hook riêng.

## 2. Khởi chạy agent: chọn "terminal" hay "native chat"

> [!note] 📝 So sánh dễ hiểu
> Anh gọi đồ ăn. Quán có 2 cách: ăn tại chỗ (agent chạy trong terminal, anh thấy giao diện TUI gốc) hoặc đóng hộp mang về (Orca nói chuyện với agent qua giao thức, tự vẽ giao diện chat). Anh đặt mặc định "mang về", nhưng món nào không đóng hộp được thì quán tự cho ăn tại chỗ, không từ chối đơn.

**Cơ chế.** 📖 `src/main/agent-launch/agent-launch-mode.ts:1-11` ghi rõ: cài đặt mặc định của người dùng chỉ là "ưu tiên", launch nào không áp dụng được thì rơi về terminal PTY, và biên nhận (receipt) ghi lý do. `executeAgentLaunch` (`agent-launch-executor.ts:78`) là chỗ duy nhất sắp thứ tự các bước:

1. Gọi `decideAgentLaunchMode` để quyết định structured hay terminal (`agent-launch-executor.ts:85-101`).
2. Nếu cần tạo worktree mới: tạo worktree trước, **không** kèm agent, rồi mới hỏi host có chạy được native chat ở worktree đó không (comment `agent-launch-executor.ts:15-22`).
3. Tạo surface (terminal hoặc chat session).
4. Đưa prompt vào: `settleLaunchPromptDisposal` (`agent-launch-prompt-delivery.ts:52-64`).

Prompt đi vào theo 1 trong 4 đường, theo comment đầu file `agent-launch-prompt-delivery.ts:7-11`:

```ts
 *   structured session   ->  committed to the transcript, named by a message id  ->  journaled
 *   terminal, line fits  ->  folded into the command that execs the agent        ->  handed-to-terminal
 *   terminal, otherwise  ->  bracketed paste into the live PTY once it is ready  ->  handed-to-terminal
 *   anything unproven    ->                                                      ->  not-delivered
```

Trong ví dụ: prompt ngắn, Claude và Codex đều `argv`, nên Orca gõ vào shell của mỗi worktree 1 dòng kiểu `claude "thêm field..."` (💭 dạng lệnh cụ thể chưa verify, chỉ biết prompt "folded into the command"). Terminal và PTY xem [[2-Terminal & PTY]].

💭 Bài học thiết kế: kết quả "đã giao prompt chưa" có 4 giá trị, không phải true/false. Đặc biệt `unconfirmed`: nếu host chết giữa chừng thì không dám nói "chưa giao", vì người gọi sẽ gửi lại và agent nhận 2 lần (comment `agent-launch-prompt-delivery.ts:36-40`).

## 3. Hook: cách Orca biết agent đang làm / đang chờ / xong

Đây là cơ chế quan trọng nhất của note.

> [!note] 📝 So sánh dễ hiểu
> Anh thuê 10 thợ làm 10 phòng. Thay vì đi ngó từng phòng (đọc màn hình terminal), anh phát cho mỗi thợ 1 cái bộ đàm. Mỗi lần bắt đầu việc, cần hỏi chủ nhà, hay làm xong, thợ bấm bộ đàm báo 1 câu. Bộ đàm có mã riêng để hàng xóm không phát bậy vào kênh.

### 3.1 Bốn trạng thái

📖 `src/shared/agent-status-types.ts:1-3, 51`:

```ts
// ─── Explicit agent status (reported via native agent hooks → IPC) ──────────
// Why: status comes from hooks (Claude, Codex, etc.) — never inferred from terminal titles;
// a narrow interrupt fallback synthesizes a final `done` when an agent misses its cancellation hook.
...
export const AGENT_STATUS_STATES = ['working', 'blocked', 'waiting', 'done'] as const
```

### 3.2 Orca cài hook vào config của agent

📖 Với Claude, Orca ghi vào `settings.json` trong thư mục config (`~/.claude/settings.json` hoặc `CLAUDE_CONFIG_DIR`), xem `src/main/claude/hook-settings.ts:51`. Các sự kiện được đăng ký nằm ở `src/main/claude/claude-managed-hook-events.ts:9-71`: `SessionStart`, `UserPromptSubmit`, `Stop`, `StopFailure`, `SubagentStart/Stop`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `PostCompact`...

Chi tiết đáng chú ý 📖 `claude-managed-hook-events.ts:64-67`: Orca **cố ý không** đăng ký `PreCompact`, vì 1 lần compact bị huỷ chỉ bắn `PreCompact` mà không có sự kiện kết thúc, tab sẽ quay spinner mãi.

Ngoài ra Orca chọn sự kiện theo version Claude đang cài (`getClaudeManagedHookPlan`, dòng 96-115). Version không đọc được thì không gỡ gì cả: "an unresolved version (e.g. a probe timeout) is no evidence of an old Claude".

### 3.3 Hook làm gì khi chạy: `curl` về localhost

📖 Script hook (macOS/Linux) do `buildPosixAgentHookPostCommand` sinh ra, bản fallback:

```sh
# src/main/agent-hooks/hook-post-command.ts:24-30 (chuỗi trong mảng, đã bỏ dấu nháy)
printf '%s' "$payload" | curl -sS -X POST "http://127.0.0.1:${ORCA_AGENT_HOOK_PORT}/hook/${source}" \
  --connect-timeout "${connect_timeout:-0.5}" --max-time "${max_time:-1.5}" \
  --noproxy "127.0.0.1" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-Orca-Agent-Hook-Token: ${ORCA_AGENT_HOOK_TOKEN}" \
  --data-urlencode "paneKey=${ORCA_PANE_KEY}" \
  --data-urlencode "tabId=${ORCA_TAB_ID}" \
```

Vậy hook biết port, token, pane ở đâu? 📖 Orca nhét chúng vào biến môi trường của mỗi terminal khi mở PTY:

```ts
// src/main/agent-hooks/server/server-runtime-env.ts:13-24
  buildPtyEnv(): Record<string, string> {
    if (!this.statusHooksEnabled || this.port <= 0 || !this.token) {
      return {}
    }
    const env: Record<string, string> = {
      ORCA_AGENT_HOOK_PORT: String(this.port),
      ORCA_AGENT_HOOK_TOKEN: this.token,
      ORCA_AGENT_HOOK_ENV: this.env,
      ORCA_AGENT_HOOK_VERSION: ORCA_HOOK_PROTOCOL_VERSION,
      ORCA_AGENT_HOOK_OPENCODE_TUI: '1',
      ORCA_AGENT_HOOK_TRANSPORT: ORCA_HOOK_RAW_JSON_TRANSPORT
    }
```

💭 Đây là mẹo hay: **1 file hook dùng chung cho mọi tab**. Hook không biết mình thuộc tab nào, nó chỉ đọc `ORCA_PANE_KEY` từ env. Mỗi terminal có env khác nhau nên cùng 1 lệnh hook báo về đúng tab. Claude chạy ngoài Orca (terminal thường) thì không có `ORCA_AGENT_HOOK_PORT`, hook gửi đi đâu cũng thất bại trong 0.5 giây và không ảnh hưởng gì.

📖 Trên Windows, mỗi sự kiện mà phải mở `cmd.exe` rồi `curl.exe` thì chậm, nên Orca viết riêng 1 file exe bằng Rust (`native/windows-agent-hook/src/main.rs:1-8`): "answers `{}`, then posts the hook payload to Orca's loopback listener and waits for the reply, so status events arrive in the order the agent emitted them". Timeout giữ giống bản curl: 500ms / 1500ms (dòng 16-18).

### 3.4 Server trong Orca nhận hook

📖 `src/main/agent-hooks/server/server-lifecycle.ts`: 1 server `node:http` lắng nghe trên `127.0.0.1`, port 0 (hệ điều hành tự chọn port trống, dòng 198). Kiểm tra token trước khi đọc body:

```ts
// src/main/agent-hooks/server/server-lifecycle.ts:48-58
    const handleRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (req.method !== 'POST') {
        res.writeHead(404)
        res.end()
        return
      }
      // Why: authenticate before spending work reading an untrusted body.
      if (req.headers['x-orca-agent-hook-token'] !== this.token) {
        res.writeHead(403)
        res.end()
        return
      }
```

Comment ở dòng ~170: "fail open — return success on malformed payloads so a broken hook never blocks the agent". 💭 Tức là hook hỏng thì Orca mất thông tin trạng thái, nhưng agent của anh vẫn chạy tiếp.

Port là ngẫu nhiên, vậy terminal sống sót qua lần restart Orca thì sao? 📖 Orca ghi thêm 1 "endpoint file" (port + token) và đặt `ORCA_AGENT_HOOK_ENDPOINT` trỏ tới nó (`server-runtime-env.ts:25-28, 41-55`). Hook Windows đọc lại file này mỗi lần chạy: "refresh endpoint coordinates for PTYs surviving an Orca restart" (`src/main/claude/hook-script.ts`, trong `getManagedScript`). 💭 Bản POSIX chắc cũng làm vậy, chưa verify dòng cụ thể.

### 3.5 Dịch tên sự kiện thành trạng thái

Mỗi agent đặt tên sự kiện khác nhau, nên có 1 file "từ điển" cho mỗi agent trong `src/shared/agent-hook-listener/providers/` (claude, codex, cursor, gemini, copilot, pi-family, opencode-family...). Điểm vào chung là `normalizeHookPayload` trong `src/shared/agent-hook-listener.ts`.

Claude:

```ts
// src/shared/agent-hook-listener/providers/claude-events.ts:125-135
  const reportedStateName =
    eventName === 'UserPromptSubmit' ||
    eventName === 'PostToolUse' ||
    eventName === 'PostToolUseFailure' ||
    (eventName === 'PreToolUse' && !isAskUserQuestion)
      ? 'working'
      : eventName === 'PermissionRequest' || isAskUserQuestion
        ? 'waiting'
        : isTurnBoundary || isManualCompactCompletion
          ? 'done'
          : null
```

Codex gần như y hệt, thêm `Interrupt` là `done` và `request_user_input` là `waiting` (`codex-events.ts:171-181`). 📖 Lý do có `isAskUserQuestion` (dòng 112-113): khi Claude hỏi lại người dùng, nó bắn `PreToolUse` chứ không phải `PermissionRequest`, nếu không xử lý riêng thì tab hiện spinner thay vì màu vàng "cần anh trả lời".

### 3.6 Chạy lại ví dụ

Codex ở worktree B muốn chạy `npm test`:

1. Codex bắn sự kiện `PermissionRequest`, chạy lệnh hook Orca đã cài.
2. Hook `curl` POST về `http://127.0.0.1:<port>/hook/codex` kèm `ORCA_PANE_KEY` của tab B (`hook-post-command.ts`).
3. Server kiểm token, đọc body (`server-lifecycle.ts:55`).
4. `codex-events.ts:177` dịch `PermissionRequest` thành `'waiting'`.
5. Trạng thái đi qua IPC sang renderer. Sidebar tab B chuyển vàng (💭 phần vẽ màu chưa mở file renderer).
6. Renderer gọi `observeAgentHookCompletionForNotification` → coordinator gọi `dispatchAttention` → gửi thông báo nguồn `'agent-task-complete'`, kèm snapshot trạng thái để banner ghi "needs input" (mục 5).

Trong lúc đó Claude ở tab A liên tục bắn `PreToolUse` / `PostToolUse` → `'working'` → spinner quay tiếp.

### 3.7 `agent-state-file-reader.ts` làm gì

📖 File này chỉ 19 dòng. Nó đọc 1 file JSON trạng thái từ đĩa nhưng có giới hạn: tối đa 4 MB, tối đa 1 triệu token cấu trúc, lồng tối đa 128 cấp (`src/main/agent-state-file-reader.ts:4-6`), kiểm tra **trước** khi `JSON.parse`.

```ts
// src/main/agent-state-file-reader.ts:12-19
export function readAgentStateJsonFileSync(filePath: string): unknown {
  const content = readAgentStateFileSync(filePath)
  assertJsonTextStructureWithinLimits(content, {
    structuralTokens: MAX_AGENT_STATE_JSON_STRUCTURAL_TOKENS,
    nestingDepth: MAX_AGENT_STATE_JSON_NESTING_DEPTH
  })
  return JSON.parse(content) as unknown
}
```

💭 File state do agent bên ngoài ghi, có thể hỏng hoặc rất lớn. Đọc nguyên rồi parse sẽ làm treo main process. Ai gọi hàm này thì chưa verify.

## 4. Spinner trên tiêu đề tab (synthetic title)

> [!note] 📝 So sánh dễ hiểu
> Có thợ tự treo biển "đang làm" trước cửa phòng, có thợ thì không. Với thợ không treo biển, quản lý tự treo giúp dựa vào bộ đàm: nghe "bắt đầu" thì treo biển quay quay, nghe "cần chủ nhà" thì đổi biển vàng.

**Cơ chế.** Terminal có chuẩn OSC 0 (`\x1b]0;tiêu đề\x07`) để đổi tiêu đề cửa sổ. Claude Code tự đổi tiêu đề kèm spinner, nhưng nhiều agent khác thì không, hoặc làm không ổn định. 📖 `src/shared/synthetic-agent-title.ts:13-23` liệt kê các agent Orca tự "giả" tiêu đề: `codex, cursor, opencode, pi, omp, droid, hermes, devin, zcode`. Mỗi agent có 3 nhãn: `workingLabel`, `permissionLabel` ("Codex - action required"), `idleLabel` ("Codex ready").

Khi hook báo trạng thái mới, `driveSyntheticTitleFromHook` (`src/main/startup/synthetic-title-runtime.ts:117`) ghi chuỗi OSC thẳng vào luồng dữ liệu PTY:

```ts
// src/main/startup/synthetic-title-runtime.ts:140-145
  // Why: stop the spinner first so the next tick can't race the state back to "working", then inject the terminal frame.
  // Permission frames add a trailing BEL to light up user-input states; done frames omit it (completion notifications own that attention).
  stopSyntheticTitleSpinner(paneKey)
  const needsUserInput = agentState === 'blocked' || agentState === 'waiting'
  const label = needsUserInput ? profile.permissionLabel : profile.idleLabel
  sendSyntheticTitle(ptyId, `\x1b]0;${label}\x07${needsUserInput ? '\x07' : ''}`, { force: true })
```

📖 Khi `working`, Orca quay 10 ký tự braille `⠋⠙⠹...` mỗi 80ms (dòng 16-17). Vòng lặp tăng frame nằm ở `src/main/synthetic-title-spinner.ts:26-46`; pane nào mất PTY thì tự bị xoá khỏi map. 📖 Frame trang trí chỉ gửi khi cửa sổ đang hiển thị, frame cuối (xong / cần input) thì luôn gửi (`synthetic-title-visibility.ts:1-6`).

📖 Codex có cờ `synthesizeWorkingTitle: false` (`synthetic-agent-title.ts:26-33`): Codex tự có spinner, chỉ hay quên frame cuối, nên Orca chỉ giả frame "ready" / "action required".

💭 Lưu ý: tiêu đề **không** là nguồn trạng thái chính (mục 3.1 đã nói "never inferred from terminal titles"). Chiều ở đây là hook → tiêu đề. Có 1 bộ phân loại tiêu đề trong `src/shared/agent-title-status.ts` (310 dòng, có regex `BRAILLE_SPINNER_RE`, `CLAUDE_IDLE`...), em chưa đọc kỹ nó dùng làm gì.

## 5. Thông báo khi agent cần anh

📖 Loại thông báo chỉ có 3 nguồn: `'agent-task-complete' | 'terminal-bell' | 'test'` (`src/shared/notification-settings-types.ts:29`). "Agent cần input" dùng chung kênh với "agent xong":

```ts
// src/renderer/src/hooks/agent-hook-completion-notifications.ts:255-266
    dispatchAttention: (title, meta) => {
      if (!isAgentTaskCompleteTrackingEnabled() || paneKeysRequiringFreshWorking.has(paneKey)) {
        return
      }
      // Why: native notification settings still label this channel as "agent
      // task complete"; the snapshot state makes the banner read "needs input".
      dispatchTerminalNotification(worktreeId, {
        source: 'agent-task-complete',
        terminalTitle: title,
        paneKey,
        agentStatusSnapshot: meta.agentStatus
      })
    },
```

`paneKey` đi kèm để bấm vào thông báo thì nhảy đúng tab B (`notification-settings-types.ts:43-44`). Cài đặt có `suppressWhenFocused` (dòng 10). Thông báo lên điện thoại xem [[8-Mobile & Cloud relay]].

## 6. Workspace trust: tránh menu "Do you trust this folder?"

> [!note] 📝 So sánh dễ hiểu
> Thợ mới đến nhà lạ, đứng ở cổng hỏi "tôi vào được không?". Nếu lúc đó anh đang đọc số điện thoại cho thợ qua cửa sổ, thì câu trả lời bị hiểu lộn thành "có / không". Orca dán sẵn tờ giấy "được vào" lên cổng trước khi thợ tới.

📖 Lý do ghi ở `src/main/agent-trust-presets.ts:10-28`: Orca dán prompt vào agent bằng bracketed paste khi TUI mở xong. Nếu lúc đó menu trust đang hiện, mỗi ký tự dán vào thành 1 lựa chọn menu, có thể chọn bậy hoặc thoát session. Cách duy nhất có tài liệu là ghi sẵn đúng file mà agent tự ghi sau khi người dùng bấm đồng ý. Cờ `--dangerously-bypass-approvals-and-sandbox` của Codex thì không dùng vì nó đổi cả chính sách sandbox.

Ví dụ Cursor: file `~/.cursor/projects/<slug>/.workspace-trusted` (`agent-trust-presets.ts:30-37`). Codex: dòng trust trong `config.toml` (`markCodexProjectTrusted`, dòng 168).

```ts
// src/main/agent-workspace-trust.ts:48-64
/**
 * Pre-trusts `workspacePath` for the agent Orca is about to start, on the host that runs
 * it. Never throws and never waits past the preset's deadline: a miss means the agent asks.
 */
export async function applyAgentWorkspaceTrust(
  preset: AgentTrustPreset,
  workspacePath: string,
  context: AgentTrustLaunchContext
): Promise<AgentTrustSpawnFields> {
  if (context.connectionId) {
    // Why: the SSH host's relay writes on its own disk, under its own homes and the agent's final env.
    return { agentWorkspaceTrust: { workspacePath } }
  }
  // Why: the other writers target this host's home, which a WSL guest agent never reads.
  if (preset !== 'claude' && isWslLaunch(workspacePath, context)) {
    return {}
  }
```

💭 Với ví dụ: worktree A và B là thư mục mới tinh, nếu không có bước này thì cả Claude và Codex đều hỏi trust ngay lần đầu. SSH/WSL xem [[7-Remote - SSH, WSL, VM]].

## 7. Native chat: Claude Agent SDK, Codex app-server, ACP

> [!note] 📝 So sánh dễ hiểu
> Terminal giống xem thợ làm qua camera: thấy hết nhưng chỉ là hình ảnh. Native chat giống nói chuyện với thợ qua bộ đàm có quy ước: mỗi câu là 1 gói tin có nhãn ("tôi đang gọi tool X", "xin quyền Y"), Orca tự vẽ giao diện từ các gói đó.

📖 Danh sách agent chạy được dạng chat nằm ở `STRUCTURED_AGENT_RUNTIME_REGISTRATIONS` (`src/main/runtime/structured-agent-runtime-registrations.ts:278-310`). Mỗi agent dùng 1 giao thức khác nhau:

| Agent | Giao thức | File |
|---|---|---|
| Claude | `@anthropic-ai/claude-agent-sdk` | `src/main/claude/claude-stream-json-connection.ts` |
| Codex | `codex app-server`, JSON-RPC qua stdio | `src/main/codex/codex-app-server-client.ts:118` |
| Pi | Pi RPC riêng | `PI_RPC_RUNTIME_REGISTRATION` (chưa mở file) |
| Grok, OpenCode, OMP | ACP | `src/main/acp/acp-launch-specs.ts:209-213` |

### 7.1 Claude Agent SDK

📖 `package.json:185` ghim `"@anthropic-ai/claude-agent-sdk": "0.3.284"`. Grep cho thấy 14 file trong `src/main/claude/` nhắc tới gói này, gần như tất cả là `import type` (chỉ lấy kiểu TypeScript như `PermissionResult`, `SDKUserMessage`, `CanUseTool`). Chỉ có 1 chỗ load code thật, và load lười:

```ts
// src/main/claude/claude-stream-json-connection.ts:31-44
 * The SDK is loaded at the structured-Claude boundary rather than by this module's
 * import. The ordinary runtime's class graph statically reaches this file, and the
 * SDK sets `process.env.NoDefaultCurrentDirectoryInExePath` at import time — a
 * Windows executable-search change that a user who never leaves the terminal/TUI
 * path never opted into, and a missing SDK would fail runtime startup. Memoized,
 * so a session pays the import once per process rather than once per connection.
 */

let claudeAgentSdk: Promise<typeof ClaudeAgentSdk> | null = null

function loadClaudeAgentSdk(): Promise<typeof ClaudeAgentSdk> {
  claudeAgentSdk ??= import('@anthropic-ai/claude-agent-sdk')
  return claudeAgentSdk
}
```

📖 Orca không để SDK tự spawn tiến trình `claude`, mà truyền `spawnClaudeCodeProcess` của mình vào (`claude-stream-json-connection.ts:161`). Lý do (`claude-agent-sdk-process-spawn.ts:35-44`): SDK không trả pid, và spawner của Orca là đường duy nhất mã hoá tham số `.cmd` an toàn trên Windows. Trên macOS/Linux, `claude` chạy dưới 1 tiến trình giám sát, nên Orca chết thì `claude` cũng dừng, không tự sửa file khi không ai nhìn. Cũng 📖 `pathToClaudeCodeExecutable` trỏ vào CLI `claude` anh đã cài, không dùng bản đóng gói sẵn của SDK (dòng 51-52).

### 7.2 ACP (Agent Client Protocol)

📖 Định nghĩa từ trang chính thức https://agentclientprotocol.com/overview/introduction: "The Agent Client Protocol (ACP) standardizes communication between code editors/IDEs and coding agents" và "Local agents run as sub-processes of the code editor, communicating via JSON-RPC over stdio."

💭 Nói dễ hiểu: ACP với coding agent giống LSP với ngôn ngữ lập trình. Editor nào nói ACP thì dùng được mọi agent nói ACP, không phải viết adapter riêng.

📖 Orca không viết tay kiểu dữ liệu ACP mà sinh từ schema chính thức: `config/scripts/acp/generate-protocol.mjs:6-8` ghim bản `schema-v1.21.0` từ repo `agentclientprotocol/agent-client-protocol`, kiểm sha256 đầu vào, và lệnh `verify:acp-protocol` chạy trong `lint`.

Thêm 1 agent ACP = thêm 1 dòng dữ liệu (comment `acp-launch-specs.ts:1-2`). Ví dụ OpenCode:

```ts
// src/main/acp/acp-launch-specs.ts:149-156
const OPENCODE_LAUNCH_SPEC: AcpLaunchSpec = {
  agent: 'opencode',
  command: 'opencode',
  // OpenCode has no bypass flag: full access answers each permission request yes.
  args: () => ['acp'],
  // Applied last: the client name ACP sessions report, and no question tool, which ACP cannot
  // answer (it would wait forever).
  env: { OPENCODE_CLIENT: 'acp', OPENCODE_ENABLE_QUESTION_TOOL: 'false' },
```

Luồng 1 phiên ACP trong `src/main/acp/acp-session-runtime.ts`: gửi `initialize` kèm `protocolVersion` và báo client **không** cho agent đọc/ghi file hay mở terminal qua Orca (`clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false }`, dòng 102-108). Sai version thì báo lỗi `-32602`. Gửi prompt bằng `session/prompt` (dòng 171), nhận tiến độ qua notification `session/update` (dòng 301). Chỉ 1 prompt chạy cùng lúc: `'ACP prompt already in progress'` (dòng 168).

📖 Trạng thái của native chat thì không cần hook curl: có file `src/shared/structured-agent-session-agent-status.ts` chuyển sự kiện session thành trạng thái (💭 chưa đọc nội dung).

## 8. Nhiều tài khoản và theo dõi rate limit

> [!note] 📝 So sánh dễ hiểu
> Anh có 2 thẻ thành viên phòng gym. Mỗi thẻ là 1 tủ đồ riêng. Muốn đổi thẻ chỉ cần mở tủ khác, không phải đăng ký lại. Bảng điện tử ở cửa cho biết thẻ nào còn bao nhiêu buổi tuần này.

**Đổi tài khoản.** 📖 Mỗi tài khoản Claude là 1 thư mục config riêng, Orca chỉ đổi biến `CLAUDE_CONFIG_DIR`. Comment `src/main/claude-accounts/claude-command-process.ts:195`: "account terminals set just CLAUDE_CONFIG_DIR, so Claude keys the login the same way". Email tài khoản đọc từ file state trong thư mục đó (`claude-account-folder.ts:36-44`). Codex làm tương tự với `CODEX_HOME` (`src/main/codex-accounts/codex-login-session.ts:308`).

**Rate limit.** Mỗi agent 1 cách lấy:
- 📖 Claude: gọi `https://api.anthropic.com/api/oauth/usage` bằng OAuth token của tài khoản (`src/main/rate-limits/claude-oauth-usage-request.ts:18, 82-88`), đọc `five_hour` thành cửa sổ "session" 300 phút và `seven_day` thành "weekly" 10080 phút (dòng 106-107).
- 📖 Codex: mở 1 phiên `codex app-server` ngắn, gửi `initialize` rồi `account/rateLimits/read` qua JSON-RPC (`codex-rpc-rate-limit-probe.ts:223, 279`).
- 📖 Thư mục `rate-limits/` còn có fetcher cho cursor, gemini, grok, kimi, antigravity, zcode, opencode-go.

```ts
// src/main/rate-limits/claude-oauth-usage-request.ts:82-88
    const response = await getMainHttpClient().fetch(OAUTH_USAGE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'anthropic-beta': 'oauth-2025-04-20',
        'User-Agent': 'claude-code/2.1.0'
      },
      signal: requestSignal
    })
```

💭 Endpoint này không có trong tài liệu công khai của Anthropic mà em biết, Orca đang giả `User-Agent` của Claude Code. Có thể đổi bất cứ lúc nào.

**Usage (token, chi phí).** 📖 `src/main/claude-usage/` không gọi API mà quét file transcript `.jsonl` trong `~/.claude/projects` (`transcript-file-discovery.ts:7, 25`), rồi tính tiền theo bảng giá model (`claude-model-pricing.ts`) và gán theo worktree (`worktree-attribution.ts`). 💭 Nên anh xem được "worktree A tốn bao nhiêu" ngay cả khi không dùng native chat.

## Bài học cho mình (Joy / Node.js)

1. 💭 **Báo trạng thái bằng sự kiện, đừng đoán từ output.** Orca không parse màn hình mà bắt agent tự báo qua hook. Với Joy, các job dài như sync order hay relaunch past orders nên ghi trạng thái rõ (`working / waiting / done / failed`) vào Firestore ở từng bước, thay vì suy ra từ log hay đếm document.
2. 💭 **Kết quả có giá trị "không chắc".** `unconfirmed` trong prompt delivery tránh gửi 2 lần. Bài học trực tiếp cho vụ Pub/Sub redelivery tạo duplicate `log_place_order`: khi crash giữa chừng, đừng ghi "chưa xử lý" rồi chạy lại mù, mà ghi "chưa chắc" và kiểm idempotency trước khi làm lại.
3. 💭 **Fail open cho phần phụ, có giới hạn cho phần đọc dữ liệu ngoài.** Hook lỗi thì trả 204 để agent chạy tiếp, curl có `--max-time 1.5`. File JSON ngoài thì kiểm kích thước và độ sâu trước `JSON.parse`. Webhook handler của Joy (Shopify gửi tới) nên làm giống: kiểm HMAC trước khi đọc body nặng, giới hạn thời gian, lỗi phần phụ (analytics, BigQuery mirror) không làm hỏng luồng chính.
4. 💭 **Load lười thư viện nặng.** Claude Agent SDK chỉ `import()` khi thật sự cần. Trong Firebase Functions, `require` thư viện nặng (BigQuery client, PDF) bên trong handler cần nó giúp giảm cold start cho các function khác cùng codebase.

## Chưa verify

- Phần renderer vẽ màu sidebar khi `waiting` (chỉ đọc tới chỗ gửi thông báo).
- Ai gọi `readAgentStateJsonFileSync`, và `agent-title-status.ts` dùng phân loại tiêu đề vào việc gì.
- Bản hook POSIX có đọc lại `ORCA_AGENT_HOOK_ENDPOINT` hay không (mới thấy trong bản Windows).
- Nội dung `PI_RPC_RUNTIME_REGISTRATION` và `structured-agent-session-agent-status.ts`.

## Nguồn

- `README.md:51`
- `src/shared/tui-agent.ts`, `src/shared/tui-agent-config.ts`
- `src/main/agent-launch/agent-launch-executor.ts`, `agent-launch-mode.ts`, `agent-launch-prompt-delivery.ts`
- `src/shared/agent-status-types.ts`
- `src/main/claude/claude-managed-hook-events.ts`, `hook-settings.ts`, `hook-script.ts`
- `src/main/agent-hooks/hook-post-command.ts`, `src/main/agent-hooks/server/server-lifecycle.ts`, `server-runtime-env.ts`
- `native/windows-agent-hook/src/main.rs`
- `src/shared/agent-hook-listener.ts`, `src/shared/agent-hook-listener/providers/claude-events.ts`, `codex-events.ts`
- `src/main/agent-state-file-reader.ts`
- `src/shared/synthetic-agent-title.ts`, `src/main/synthetic-title-spinner.ts`, `src/main/synthetic-title-visibility.ts`, `src/main/startup/synthetic-title-runtime.ts`, `src/shared/agent-title-status.ts`
- `src/renderer/src/hooks/agent-hook-completion-notifications.ts`, `src/shared/notification-settings-types.ts`
- `src/main/agent-workspace-trust.ts`, `src/main/agent-trust-presets.ts`
- `src/main/runtime/structured-agent-runtime-registrations.ts`
- `src/main/claude/claude-stream-json-connection.ts`, `claude-agent-sdk-process-spawn.ts`, `package.json:185`
- `src/main/codex/codex-app-server-client.ts`
- `src/main/acp/acp-launch-specs.ts`, `acp-session-runtime.ts`, `config/scripts/acp/generate-protocol.mjs`
- `src/main/claude-accounts/claude-account-folder.ts`, `claude-command-process.ts`, `src/main/codex-accounts/codex-login-session.ts`
- `src/main/rate-limits/claude-oauth-usage-request.ts`, `codex-rpc-rate-limit-probe.ts`
- `src/main/claude-usage/transcript-file-discovery.ts`
- https://agentclientprotocol.com/overview/introduction
