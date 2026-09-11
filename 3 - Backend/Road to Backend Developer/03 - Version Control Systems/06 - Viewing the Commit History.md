# 06 — Viewing the Commit History

> **Nguồn chính:** Pro Git §2.3 — <https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History>

📖 **Nguyên văn**
> "After you have created several commits, or if you have cloned a repository with an existing commit history, you’ll probably want to look back to see what has happened.
> The most basic and powerful tool to do this is the `git log` command."

🇻🇳 **Dịch**
> "Sau khi tạo vài commit, hoặc khi bạn clone một repository đã có sẵn lịch sử commit, có lẽ bạn sẽ muốn nhìn lại xem đã có chuyện gì xảy ra.
> Công cụ cơ bản nhất và mạnh nhất để làm việc đó là lệnh `git log`."

---

## 1. `git log` mặc định

📖 **Nguyên văn**
> ```
> $ git log
> commit ca82a6dff817ec66f44342007202690a93763949
> Author: Scott Chacon <schacon@gee-mail.com>
> Date:   Mon Mar 17 21:52:11 2008 -0700
>
>     Change version number
> ```
> "By default, with no arguments, `git log` lists the commits made in that repository in **reverse chronological order**; that is, the most recent commits show up first.
> As you can see, this command lists each commit with its SHA-1 checksum, the author’s name and email, the date written, and the commit message."

🇻🇳 **Dịch**
> "Mặc định, khi không có tham số, `git log` liệt kê các commit trong repository theo **thứ tự thời gian ngược**; tức là commit mới nhất hiện lên đầu.
> Như bạn thấy, lệnh này liệt kê từng commit kèm SHA-1 checksum, tên và email của author, ngày viết, và commit message."

---

## 2. Các option định dạng output

### `-p` / `--patch`

📖 **Nguyên văn**
> "One of the more helpful options is `-p` or `--patch`, which shows the difference (the patch output) introduced in each commit.
> You can also limit the number of log entries displayed, such as using `-2` to show only the last two entries. […]
> This is very helpful for code review or to quickly browse what happened during a series of commits that a collaborator has added."

🇻🇳 **Dịch**
> "Một trong những option hữu ích nhất là `-p` hoặc `--patch`, hiển thị phần khác biệt (output dạng patch) mà mỗi commit đưa vào.
> Bạn cũng có thể giới hạn số mục log hiển thị, ví dụ `-2` để chỉ xem hai mục gần nhất. […]
> Cách này rất hữu ích cho code review, hoặc để lướt nhanh xem đã có gì xảy ra trong một loạt commit mà đồng nghiệp vừa thêm vào."

### `--stat`

📖 **Nguyên văn**
> "the `--stat` option prints below each commit entry a list of modified files, how many files were changed, and how many lines in those files were added and removed.
> It also puts a summary of the information at the end."

🇻🇳 **Dịch**
> "Option `--stat` in bên dưới mỗi commit một danh sách các file bị sửa, bao nhiêu file bị thay đổi, và bao nhiêu dòng trong các file đó được thêm/xoá.
> Nó cũng đặt phần tóm tắt thông tin ở cuối."

### `--pretty`

📖 **Nguyên văn**
> "Another really useful option is `--pretty`. This option changes the log output to formats other than the default. […]
> The `oneline` value for this option prints each commit on a single line, which is useful if you’re looking at a lot of commits."
> ```
> $ git log --pretty=oneline
> ca82a6dff817ec66f44342007202690a93763949 Change version number
> ```

🇻🇳 **Dịch**
> "Một option rất hữu ích khác là `--pretty`. Nó đổi output của log sang định dạng khác mặc định. […]
> Giá trị `oneline` in mỗi commit trên một dòng, hữu ích khi bạn xem nhiều commit."

📖 **Nguyên văn — `format`**
> "The most interesting option value is `format`, which allows you to specify your own log output format.
> This is especially useful when you’re generating output for machine parsing — because you specify the format explicitly, you know it won’t change with updates to Git."
> ```
> $ git log --pretty=format:"%h - %an, %ar : %s"
> ca82a6d - Scott Chacon, 6 years ago : Change version number
> ```

🇻🇳 **Dịch**
> "Giá trị thú vị nhất là `format`, cho phép bạn tự định nghĩa format output của log.
> Nó đặc biệt hữu ích khi bạn sinh output cho máy đọc — vì bạn chỉ định format tường minh, nên biết chắc nó sẽ không đổi khi Git cập nhật."

📖 **Table 1. Useful specifiers for `git log --pretty=format`** *(trích nguyên bảng của sách)*

| Specifier | Description of Output | 🇻🇳 |
|---|---|---|
| `%H` | Commit hash | Hash đầy đủ của commit |
| `%h` | Abbreviated commit hash | Hash rút gọn |
| `%T` | Tree hash | Hash của tree |
| `%t` | Abbreviated tree hash | Hash tree rút gọn |
| `%P` | Parent hashes | Hash của các parent |
| `%p` | Abbreviated parent hashes | Hash parent rút gọn |
| `%an` | Author name | Tên author |
| `%ae` | Author email | Email author |
| `%ad` | Author date (format respects the `--date=` option) | Ngày của author |
| `%ar` | Author date, relative | Ngày author, dạng tương đối |
| `%cn` | Committer name | Tên committer |
| `%ce` | Committer email | Email committer |
| `%cd` | Committer date | Ngày committer |
| `%cr` | Committer date, relative | Ngày committer, tương đối |
| `%s` | Subject | Dòng tiêu đề commit message |

### Author vs Committer ⭐

📖 **Nguyên văn**
> "You may be wondering what the difference is between author and committer.
> **The author is the person who originally wrote the work, whereas the committer is the person who last applied the work.**
> So, if you send in a patch to a project and one of the core members applies the patch, both of you get credit — you as the author, and the core member as the committer."

🇻🇳 **Dịch**
> "Có thể bạn thắc mắc author và committer khác nhau chỗ nào.
> **Author là người viết ra phần việc đó ban đầu, còn committer là người áp dụng phần việc đó lần cuối.**
> Nên nếu bạn gửi một patch tới project và một core member áp patch đó vào, cả hai đều được ghi công — bạn là author, core member là committer."

💡 **Ví dụ đời sống**
Author = tác giả bài báo. Committer = biên tập viên bấm nút xuất bản. Bài vẫn ghi tên tác giả, nhưng dấu vết "ai đưa lên trang" là của biên tập viên. (Chính vì thế `git rebase` hay `cherry-pick` đổi committer date nhưng giữ nguyên author.)

### `--graph`

📖 **Nguyên văn**
> "The `oneline` and `format` option values are particularly useful with another log option called `--graph`.
> This option adds a nice little ASCII graph showing your branch and merge history."
> ```
> $ git log --pretty=format:"%h %s" --graph
> * 2d3acf9 Ignore errors from SIGCHLD on trap
> *  5e3ee11 Merge branch 'master' of https://github.com/dustin/grit.git
> |\
> | * 420eac9 Add method for getting the current branch
> * | 30e367c Timeout code and tests
> ```

🇻🇳 **Dịch**
> "Các giá trị `oneline` và `format` đặc biệt hữu ích khi đi kèm một option khác của log là `--graph`.
> Option này thêm một đồ thị ASCII nhỏ gọn thể hiện lịch sử branch và merge của bạn."

---

## 3. Table 2 — Common options to `git log`

📖 *(trích nguyên bảng của sách, kèm dịch)*

| Option | Description | 🇻🇳 |
|---|---|---|
| `-p` | Show the patch introduced with each commit. | Hiện patch của từng commit |
| `--stat` | Show statistics for files modified in each commit. | Thống kê file bị sửa |
| `--shortstat` | Display only the changed/insertions/deletions line from the `--stat` command. | Chỉ dòng tổng kết của `--stat` |
| `--name-only` | Show the list of files modified after the commit information. | Chỉ liệt kê tên file |
| `--name-status` | Show the list of files affected with added/modified/deleted information as well. | Tên file + trạng thái A/M/D |
| `--abbrev-commit` | Show only the first few characters of the SHA-1 checksum instead of all 40. | Hash rút gọn |
| `--relative-date` | Display the date in a relative format (for example, "2 weeks ago"). | Ngày dạng tương đối |
| `--graph` | Display an ASCII graph of the branch and merge history beside the log output. | Đồ thị ASCII branch/merge |
| `--pretty` | Show commits in an alternate format. Option values include `oneline`, `short`, `full`, `fuller`, and `format`. | Đổi định dạng |
| `--oneline` | Shorthand for `--pretty=oneline --abbrev-commit` used together. | Viết tắt của hai option trên |

---

## 4. Limiting Log Output

📖 **Nguyên văn**
> "In addition to output-formatting options, `git log` takes a number of useful **limiting** options; that is, options that let you show only a subset of commits."

🇻🇳 **Dịch**
> "Ngoài các option định dạng output, `git log` còn nhận nhiều option **giới hạn** hữu ích; tức là các option chỉ cho hiện một tập con các commit."

📖 **Nguyên văn — pickaxe `-S`**
> "Another really helpful filter is the `-S` option (colloquially referred to as Git’s “pickaxe” option), which takes a string and shows only those commits that changed the number of occurrences of that string.
> For instance, if you wanted to find the last commit that added or removed a reference to a specific function, you could call:"
> ```
> $ git log -S function_name
> ```

🇻🇳 **Dịch**
> "Một bộ lọc rất hữu ích khác là option `-S` (dân gian gọi là option **“pickaxe”** — cái cuốc chim của Git). Nó nhận một chuỗi và chỉ hiện những commit làm **thay đổi số lần xuất hiện** của chuỗi đó.
> Ví dụ, nếu bạn muốn tìm commit gần nhất đã thêm hoặc xoá một tham chiếu tới một hàm cụ thể, bạn có thể gọi lệnh trên."

> [!tip] `-S` cực mạnh khi debug
> Câu hỏi "cái hàm này biến mất từ commit nào?" — `git log -S tenHam` trả lời trong một lệnh.

📖 **Nguyên văn — lọc theo path**
> "The last really useful option to pass to `git log` as a filter is a path.
> If you specify a directory or file name, you can limit the log output to commits that introduced a change to those files.
> This is always the last option and is generally preceded by double dashes (`--`) to separate the paths from the options."
> ```
> $ git log -- path/to/file
> ```

🇻🇳 **Dịch**
> "Option lọc thực sự hữu ích cuối cùng cho `git log` là một **path**.
> Nếu bạn chỉ định tên thư mục hay tên file, bạn giới hạn output log về những commit có thay đổi các file đó.
> Nó luôn là option cuối cùng và thường được đặt sau hai dấu gạch ngang (`--`) để tách path khỏi các option."

### Table 3 — Options to limit the output of `git log`

📖 *(trích nguyên bảng của sách, kèm dịch)*

| Option | Description | 🇻🇳 |
|---|---|---|
| `-<n>` | Show only the last n commits. | Chỉ n commit gần nhất |
| `--since`, `--after` | Limit the commits to those made after the specified date. | Sau mốc thời gian |
| `--until`, `--before` | Limit the commits to those made before the specified date. | Trước mốc thời gian |
| `--author` | Only show commits in which the author entry matches the specified string. | Lọc theo author |
| `--committer` | Only show commits in which the committer entry matches the specified string. | Lọc theo committer |
| `--grep` | Only show commits with a commit message containing the string. | Lọc theo commit message |
| `-S` | Only show commits adding or removing code matching the string. | Lọc theo code thêm/xoá |

📖 **Nguyên văn — ví dụ tổng hợp của sách**
> ```
> $ git log --pretty="%h - %s" --author='Junio C Hamano' --since="2008-10-01" \
>    --before="2008-11-01" --no-merges -- t/
> ```
> "Of the nearly 40,000 commits in the Git source code history, this command shows the 6 that match those criteria."

🇻🇳 **Dịch**
> "Trong gần 40.000 commit của lịch sử mã nguồn Git, lệnh này chỉ hiện ra 6 commit khớp các tiêu chí đó."

📖 **Nguyên văn — mẹo cuối**
> "Depending on the workflow used in your repository, it’s possible that a sizable percentage of the commits in your log history are just merge commits, which typically aren’t very informative.
> To prevent the display of merge commits cluttering up your log history, simply add the log option `--no-merges`."

🇻🇳 **Dịch**
> "Tuỳ workflow của repository, có thể một tỷ lệ đáng kể commit trong lịch sử chỉ là merge commit — thường không mấy thông tin.
> Để merge commit không làm rối lịch sử log, chỉ cần thêm option `--no-merges`."

---

## Combo hay dùng

```bash
git log --oneline --graph --all --decorate   # bản đồ toàn repo
git log -p -2                                 # xem diff 2 commit gần nhất
git log --since=2.weeks --author="Hoang"      # tôi đã làm gì 2 tuần qua
git log -S "handleCheckout"                   # hàm này sinh/mất ở commit nào
git log --oneline -- src/api/                 # lịch sử riêng của 1 thư mục
```

## Liên kết
- Bài trước: [[05 - Recording Changes to the Repository]]
- Bài kế: [[07 - Undoing Things]]

## Nguồn tham khảo
- Pro Git §2.3: <https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History>
