# 03 — Lịch sử, cài đặt và cấu hình Git

> **Nguồn chính:** Pro Git, 2nd Edition — Scott Chacon & Ben Straub.
> Bài này gộp **§1.2 A Short History of Git**, **§1.4 The Command Line**, **§1.5 Installing Git**, **§1.6 First-Time Git Setup**, **§1.7 Getting Help**.
> - <https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git>
> - <https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup>
> - <https://git-scm.com/book/en/v2/Getting-Started-Getting-Help>

---

## 1. A Short History of Git (§1.2)

📖 **Nguyên văn**
> "The Linux kernel is an open source software project of fairly large scope.
> During the early years of the Linux kernel maintenance (1991–2002), changes to the software were passed around as patches and archived files.
> In 2002, the Linux kernel project began using a proprietary DVCS called BitKeeper."

🇻🇳 **Dịch**
> "Linux kernel là một dự án phần mềm mã nguồn mở có quy mô khá lớn.
> Trong những năm đầu bảo trì Linux kernel (1991–2002), các thay đổi được truyền tay nhau dưới dạng patch và file nén.
> Năm 2002, dự án Linux kernel bắt đầu dùng một DVCS thương mại tên là BitKeeper."

📖 **Nguyên văn**
> "In 2005, the relationship between the community that developed the Linux kernel and the commercial company that developed BitKeeper broke down, and the tool’s free-of-charge status was revoked.
> This prompted the Linux development community (and in particular Linus Torvalds, the creator of Linux) to develop their own tool based on some of the lessons they learned while using BitKeeper."

🇻🇳 **Dịch**
> "Năm 2005, quan hệ giữa cộng đồng phát triển Linux kernel và công ty thương mại làm ra BitKeeper đổ vỡ, và quyền dùng miễn phí công cụ này bị thu hồi.
> Việc đó thúc đẩy cộng đồng Linux (đặc biệt là Linus Torvalds, cha đẻ của Linux) tự phát triển công cụ riêng, dựa trên những bài học rút ra khi dùng BitKeeper."

📖 **Nguyên văn — 5 mục tiêu thiết kế**
> "Some of the goals of the new system were as follows:
> - Speed
> - Simple design
> - Strong support for non-linear development (thousands of parallel branches)
> - Fully distributed
> - Able to handle large projects like the Linux kernel efficiently (speed and data size)"

🇻🇳 **Dịch**
> "Một số mục tiêu của hệ thống mới như sau:
> - **Tốc độ**
> - **Thiết kế đơn giản**
> - **Hỗ trợ mạnh cho phát triển phi tuyến** (hàng nghìn branch song song)
> - **Phân tán hoàn toàn**
> - **Xử lý hiệu quả các project lớn** như Linux kernel (cả về tốc độ lẫn dung lượng dữ liệu)"

> [!tip] Vì sao nên nhớ 5 mục tiêu này
> Mọi thiết kế "kỳ quặc" của Git sau này (staging area, snapshot, SHA-1, branch siêu nhẹ) đều là hệ quả của 5 mục tiêu trên. Xem lại [[02 - What is Git]].

---

## 2. The Command Line (§1.4)

🇻🇳 Pro Git chọn dạy Git qua **command line**, vì chỉ command line mới chạy được *toàn bộ* lệnh Git — các GUI client chỉ implement một phần. Nắm CLI thì dùng GUI nào cũng được; ngược lại thì không.

---

## 3. Installing Git (§1.5)

Cách cài chính thống theo từng OS — xem trang: <https://git-scm.com/downloads>

```bash
# macOS — qua Homebrew
brew install git

# Debian / Ubuntu
sudo apt install git-all

# Kiểm tra
git --version
```

---

## 4. First-Time Git Setup (§1.6) ⭐

### 4.1. Ba cấp config

📖 **Nguyên văn**
> "Git comes with a tool called `git config` that lets you get and set configuration variables that control all aspects of how Git looks and operates.
> These variables can be stored in three different places:
> - `[path]/etc/gitconfig` file: Contains values applied to every user on the system and all their repositories. If you pass the option `--system` to `git config`, it reads and writes from this file specifically.
> - `~/.gitconfig` or `~/.config/git/config` file: Values specific personally to you, the user. You can make Git read and write to this file specifically by passing the `--global` option, and this affects all of the repositories you work with on your system.
> - `config` file in the Git directory (that is, `.git/config`) of whatever repository you’re currently using: Specific to that single repository. You can force Git to read from and write to this file with the `--local` option, but that is in fact the default."

🇻🇳 **Dịch**
> "Git đi kèm một công cụ tên `git config`, cho phép bạn đọc và đặt các biến cấu hình điều khiển mọi khía cạnh về cách Git hiển thị và vận hành.
> Các biến này có thể được lưu ở ba nơi khác nhau:
> - File `[path]/etc/gitconfig`: chứa giá trị áp dụng cho **mọi user** trên hệ thống và mọi repository của họ. Truyền option `--system` cho `git config` thì nó đọc/ghi đúng file này.
> - File `~/.gitconfig` hoặc `~/.config/git/config`: giá trị riêng cho **cá nhân bạn**. Truyền option `--global` để Git đọc/ghi đúng file này, và nó ảnh hưởng tới mọi repository bạn làm việc trên hệ thống.
> - File `config` trong Git directory (tức `.git/config`) của repository bạn đang dùng: riêng cho **đúng repository đó**. Ép Git đọc/ghi file này bằng option `--local`, nhưng thực tế đây đã là mặc định."

📖 **Nguyên văn**
> "Each level overrides values in the previous level, so values in `.git/config` trump those in `[path]/etc/gitconfig`."

🇻🇳 **Dịch**
> "Mỗi cấp ghi đè giá trị của cấp trước, nên giá trị trong `.git/config` thắng giá trị trong `[path]/etc/gitconfig`."

🇻🇳 **Thứ tự ưu tiên:** `--local` > `--global` > `--system`

💡 **Ví dụ đời sống**
Giống nội quy: nội quy quốc gia (`--system`) → nội quy công ty bạn (`--global`) → nội quy riêng của phòng bạn ngồi (`--local`). Phòng cấm ăn uống thì bạn theo phòng, dù công ty cho phép.

> [!tip] Áp dụng thực tế
> Dùng email công ty ở repo công ty, email cá nhân ở repo cá nhân:
> ```bash
> git config --global user.email "canhan@gmail.com"     # mặc định
> cd ~/work/joy-loyalty
> git config user.email "ten@congty.com"                 # chỉ repo này
> ```

### 4.2. Your Identity

📖 **Nguyên văn**
> "The first thing you should do when you install Git is to set your user name and email address.
> This is important because every Git commit uses this information, and it’s immutably baked into the commits you start creating:"
> ```
> $ git config --global user.name "John Doe"
> $ git config --global user.email johndoe@example.com
> ```

🇻🇳 **Dịch**
> "Việc đầu tiên bạn nên làm khi cài Git là đặt user name và email.
> Điều này quan trọng vì **mọi commit của Git đều dùng thông tin này, và nó được nung cứng (immutably baked) vào các commit bạn tạo ra**."

### 4.3. Your Editor

📖 **Nguyên văn**
> "Now that your identity is set up, you can configure the default text editor that will be used when Git needs you to type in a message.
> If not configured, Git uses your system’s default editor."
> ```
> $ git config --global core.editor emacs
> ```

🇻🇳 **Dịch**
> "Giờ danh tính đã xong, bạn có thể cấu hình text editor mặc định sẽ được dùng khi Git cần bạn gõ một message.
> Nếu không cấu hình, Git dùng editor mặc định của hệ thống."

### 4.4. Your default branch name

📖 **Nguyên văn**
> "By default Git will create a branch called `master` when you create a new repository with `git init`.
> From Git version 2.28 onwards, you can set a different name for the initial branch.
> To set `main` as the default branch name do:"
> ```
> $ git config --global init.defaultBranch main
> ```

🇻🇳 **Dịch**
> "Mặc định Git tạo một branch tên `master` khi bạn tạo repository mới bằng `git init`.
> Từ Git phiên bản 2.28 trở đi, bạn có thể đặt tên khác cho branch khởi tạo.
> Để đặt `main` làm tên branch mặc định:"

### 4.5. Checking Your Settings

📖 **Nguyên văn**
> "If you want to check your configuration settings, you can use the `git config --list` command to list all the settings Git can find at that point […]
> You may see keys more than once, because Git reads the same key from different files (`[path]/etc/gitconfig` and `~/.gitconfig`, for example).
> In this case, **Git uses the last value for each unique key it sees**."

🇻🇳 **Dịch**
> "Nếu muốn kiểm tra cấu hình, dùng lệnh `git config --list` để liệt kê mọi setting Git tìm thấy tại thời điểm đó. […]
> Bạn có thể thấy một key xuất hiện nhiều lần, vì Git đọc cùng key đó từ nhiều file khác nhau (ví dụ `[path]/etc/gitconfig` và `~/.gitconfig`).
> Trong trường hợp đó, **Git dùng giá trị cuối cùng nó thấy cho mỗi key**."

📖 **Nguyên văn**
> "Since Git might read the same configuration variable value from more than one file, it’s possible that you have an unexpected value for one of these values and you don’t know why.
> In cases like that, you can query Git as to the origin for that value:"
> ```
> $ git config --show-origin rerere.autoUpdate
> file:/home/johndoe/.gitconfig	false
> ```

🇻🇳 **Dịch**
> "Vì Git có thể đọc cùng một biến cấu hình từ nhiều file, có khả năng bạn gặp một giá trị bất ngờ mà không hiểu vì sao.
> Những lúc như vậy, hỏi Git xem giá trị đó đến từ đâu — nó sẽ cho biết file cấu hình nào là tiếng nói quyết định."

Xem tất cả kèm nguồn gốc:
```bash
git config --list --show-origin
```

---

## 5. Getting Help (§1.7)

📖 **Nguyên văn**
> "If you ever need help while using Git, there are three equivalent ways to get the comprehensive manual page (manpage) help for any of the Git commands:"
> ```
> $ git help <verb>
> $ git <verb> --help
> $ man git-<verb>
> ```
> "These commands are nice because you can access them anywhere, even offline."

🇻🇳 **Dịch**
> "Nếu cần trợ giúp khi dùng Git, có ba cách tương đương để lấy trang manual (manpage) đầy đủ cho bất kỳ lệnh Git nào. […]
> Các lệnh này hay ở chỗ bạn truy cập được ở bất cứ đâu, kể cả **offline**."

📖 **Nguyên văn**
> "In addition, if you don’t need the full-blown manpage help, but just need a quick refresher on the available options for a Git command, you can ask for the more concise “help” output with the `-h` option, as in:"
> ```
> $ git add -h
> ```

🇻🇳 **Dịch**
> "Ngoài ra, nếu không cần trang manpage đầy đủ mà chỉ cần nhắc nhanh các option khả dụng của một lệnh Git, hãy dùng output “help” ngắn gọn hơn với option `-h`."

---

## Checklist máy mới

```bash
git config --global user.name  "Tên của bạn"
git config --global user.email "email@cua.ban"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # nếu dùng VS Code
git config --list --show-origin                  # kiểm tra lại
```

## Liên kết
- Bài trước: [[02 - What is Git]]
- Bài kế: [[04 - Getting a Git Repository]]

## Nguồn tham khảo
- Pro Git §1.2: <https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git>
- Pro Git §1.6: <https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup>
- Pro Git §1.7: <https://git-scm.com/book/en/v2/Getting-Started-Getting-Help>
- Trang tải Git: <https://git-scm.com/downloads>
