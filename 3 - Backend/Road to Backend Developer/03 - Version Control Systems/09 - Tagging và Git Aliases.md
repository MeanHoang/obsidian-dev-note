# 09 — Tagging và Git Aliases

> **Nguồn chính:** Pro Git §2.6 + §2.7
> - <https://git-scm.com/book/en/v2/Git-Basics-Tagging>
> - <https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases>

---

# Phần A — Tagging (§2.6)

📖 **Nguyên văn**
> "Like most VCSs, Git has the ability to tag specific points in a repository’s history as being important.
> Typically, people use this functionality to mark release points (v1.0, v2.0 and so on)."

🇻🇳 **Dịch**
> "Như phần lớn các VCS, Git có khả năng **tag** những điểm cụ thể trong lịch sử repository là quan trọng.
> Thường thì người ta dùng tính năng này để đánh dấu các mốc release (v1.0, v2.0, v.v.)."

## 1. Liệt kê tag

📖 **Nguyên văn**
> "Listing the existing tags in Git is straightforward. Just type `git tag` (with optional `-l` or `--list`) […]
> This command lists the tags in **alphabetical order**; the order in which they are displayed has no real importance."

🇻🇳 **Dịch**
> "Liệt kê các tag hiện có trong Git rất đơn giản. Chỉ cần gõ `git tag` (tuỳ chọn thêm `-l` hoặc `--list`). […]
> Lệnh này liệt kê tag theo **thứ tự bảng chữ cái**; thứ tự hiển thị không mang ý nghĩa thực sự nào."

📖 **Nguyên văn**
> "You can also search for tags that match a particular pattern.
> The Git source repo, for instance, contains more than 500 tags."
> ```
> $ git tag -l "v1.8.5*"
> ```

🇻🇳 **Dịch**
> "Bạn cũng có thể tìm các tag khớp một pattern nhất định. Ví dụ repo mã nguồn Git chứa hơn 500 tag."

> [!note] Bắt buộc có `-l` khi dùng wildcard
> 📖 "If you want just the entire list of tags, running the command `git tag` implicitly assumes you want a listing […] the use of `-l` or `--list` in this case is optional. If, however, you’re supplying a wildcard pattern to match tag names, **the use of `-l` or `--list` is mandatory**."
> 🇻🇳 Liệt kê toàn bộ thì `-l` là tuỳ chọn; nhưng khi dùng pattern wildcard thì `-l` là **bắt buộc**.

## 2. Hai loại tag ⭐

📖 **Nguyên văn**
> "Git supports two types of tags: **lightweight** and **annotated**.
>
> A lightweight tag is very much like a branch that doesn’t change — it’s just a pointer to a specific commit.
>
> Annotated tags, however, are stored as full objects in the Git database.
> They’re checksummed; contain the tagger name, email, and date; have a tagging message; and can be signed and verified with GNU Privacy Guard (GPG).
> **It’s generally recommended that you create annotated tags** so you can have all this information; but if you want a temporary tag or for some reason don’t want to keep the other information, lightweight tags are available too."

🇻🇳 **Dịch**
> "Git hỗ trợ hai loại tag: **lightweight** và **annotated**.
>
> Một **lightweight tag** rất giống một branch không bao giờ di chuyển — nó chỉ là một con trỏ tới một commit cụ thể.
>
> Trong khi đó, **annotated tag** được lưu thành các object đầy đủ trong database của Git.
> Chúng được tính checksum; chứa tên, email và ngày của người tag; có một tagging message; và có thể được ký và xác thực bằng GNU Privacy Guard (GPG).
> **Thường thì nên tạo annotated tag** để có đầy đủ thông tin này; nhưng nếu bạn muốn một tag tạm thời hoặc vì lý do nào đó không cần giữ các thông tin kia, thì lightweight tag cũng có sẵn."

| | Lightweight | Annotated |
|---|---|---|
| Bản chất | Con trỏ tới commit | Object đầy đủ trong Git database |
| Chứa tagger, date, message | Không | Có |
| Ký GPG được | Không | Có |
| Tạo bằng | `git tag v1.4-lw` | `git tag -a v1.4 -m "..."` |
| Dùng khi | Tag tạm, cá nhân | **Release chính thức** |

💡 **Ví dụ đời sống**
- Lightweight = kẹp một mẩu giấy nhớ vào trang sách.
- Annotated = đóng dấu mộc có ghi ai đóng, ngày nào, lý do gì — và dấu đó có thể xác thực được.

## 3. Tạo tag

📖 **Nguyên văn — annotated**
> ```
> $ git tag -a v1.4 -m "my version 1.4"
> ```
> "The `-m` specifies a tagging message, which is stored with the tag.
> If you don’t specify a message for an annotated tag, Git launches your editor so you can type it in."

🇻🇳 **Dịch**
> "`-m` chỉ định tagging message, được lưu kèm tag.
> Nếu bạn không đưa message cho một annotated tag, Git sẽ mở editor để bạn gõ vào."

📖 **Nguyên văn — `git show`**
> "That shows the tagger information, the date the commit was tagged, and the annotation message before showing the commit information."

🇻🇳 **Dịch**
> "Nó hiện thông tin người tag, ngày commit được tag, và annotation message, trước khi hiện thông tin commit."

📖 **Nguyên văn — lightweight**
> "This is basically the commit checksum stored in a file — no other information is kept.
> To create a lightweight tag, don’t supply any of the `-a`, `-s`, or `-m` options, just provide a tag name."

🇻🇳 **Dịch**
> "Về cơ bản nó chỉ là commit checksum lưu trong một file — không giữ thông tin nào khác.
> Để tạo lightweight tag, đừng đưa bất kỳ option `-a`, `-s` hay `-m` nào, chỉ cần cho một tên tag."

## 4. Tag muộn (Tagging Later)

📖 **Nguyên văn**
> "You can also tag commits after you’ve moved past them. […]
> Now, suppose you forgot to tag the project at v1.2, which was at the “Update rakefile” commit.
> You can add it after the fact.
> To tag that commit, you specify the commit checksum (or part of it) at the end of the command:"
> ```
> $ git tag -a v1.2 9fceb02
> ```

🇻🇳 **Dịch**
> "Bạn cũng có thể tag các commit sau khi đã đi qua chúng. […]
> Giả sử bạn quên tag project ở mốc v1.2, vốn nằm ở commit “Update rakefile”. Bạn có thể thêm sau.
> Để tag commit đó, đưa commit checksum (hoặc một phần của nó) vào cuối lệnh."

## 5. Chia sẻ tag ⭐

📖 **Nguyên văn**
> "**By default, the `git push` command doesn’t transfer tags to remote servers.**
> You will have to explicitly push tags to a shared server after you have created them."
> ```
> $ git push origin v1.5
> $ git push origin --tags     # đẩy tất cả tag
> ```

🇻🇳 **Dịch**
> "**Mặc định, lệnh `git push` KHÔNG chuyển tag lên remote server.**
> Bạn phải push tag lên server chung một cách tường minh sau khi tạo chúng."

> [!warning] Lỗi rất hay gặp
> Tag xong `git push` như thường lệ → lên GitHub không thấy tag đâu. Phải `git push origin <tag>` hoặc `--tags`.

📖 **Nguyên văn**
> "`git push <remote> --tags` will push both lightweight and annotated tags.
> There is currently no option to push only lightweight tags, but if you use `git push <remote> --follow-tags` **only annotated tags will be pushed** to the remote."

🇻🇳 **Dịch**
> "`git push <remote> --tags` sẽ push cả lightweight lẫn annotated tag.
> Hiện không có option nào chỉ push lightweight tag, nhưng nếu dùng `git push <remote> --follow-tags` thì **chỉ annotated tag được push** lên remote."

## 6. Xoá tag

📖 **Nguyên văn**
> "To delete a tag on your local repository, you can use `git tag -d <tagname>`. […]
> **Note that this does not remove the tag from any remote servers.**
> There are two common variations for deleting a tag from a remote server."
> ```
> $ git push origin :refs/tags/v1.4-lw      # cách 1
> $ git push origin --delete <tagname>      # cách 2, trực quan hơn
> ```
> "The way to interpret the above is to read it as the null value before the colon is being pushed to the remote tag name, effectively deleting it."

🇻🇳 **Dịch**
> "Để xoá một tag ở local repository, dùng `git tag -d <tagname>`. […]
> **Lưu ý việc này không xoá tag khỏi bất kỳ remote server nào.**
> Có hai biến thể phổ biến để xoá tag khỏi remote server. […]
> Cách hiểu lệnh thứ nhất: giá trị rỗng (null) trước dấu hai chấm đang được push vào tên tag trên remote, qua đó xoá nó."

## 7. Checkout tag & detached HEAD

📖 **Nguyên văn**
> "If you want to view the versions of files a tag is pointing to, you can do a `git checkout` of that tag, although this puts your repository in **“detached HEAD” state**, which has some ill side effects."

🇻🇳 **Dịch**
> "Nếu muốn xem phiên bản file mà một tag đang trỏ tới, bạn có thể `git checkout` tag đó, dù việc này đặt repository vào trạng thái **“detached HEAD”**, vốn có vài tác dụng phụ khó chịu."

📖 **Nguyên văn — hệ quả**
> "In “detached HEAD” state, if you make changes and then create a commit, the tag will stay the same, but **your new commit won’t belong to any branch and will be unreachable, except by the exact commit hash**.
> Thus, if you need to make changes — say you’re fixing a bug on an older version, for instance — you will generally want to create a branch."
> ```
> $ git checkout -b version2 v2.0.0
> ```

🇻🇳 **Dịch**
> "Ở trạng thái “detached HEAD”, nếu bạn sửa rồi tạo commit, tag vẫn giữ nguyên, nhưng **commit mới của bạn sẽ không thuộc branch nào và không thể truy cập được, trừ khi dùng đúng commit hash**.
> Vì vậy, nếu cần sửa đổi — ví dụ bạn đang fix bug cho một phiên bản cũ — thì thường bạn sẽ muốn tạo một branch."

📖 **Nguyên văn — cảnh báo cuối**
> "If you do this and make a commit, your `version2` branch will be slightly different than your `v2.0.0` tag since it will move forward with your new changes, so do be careful."

🇻🇳 **Dịch**
> "Nếu làm vậy rồi commit, branch `version2` sẽ hơi khác tag `v2.0.0` vì nó tiến lên theo các thay đổi mới của bạn — nên hãy cẩn thận."

---

# Phần B — Git Aliases (§2.7)

📖 **Nguyên văn**
> "Git doesn’t automatically infer your command if you type it in partially.
> If you don’t want to type the entire text of each of the Git commands, you can easily set up an alias for each command using `git config`."
> ```
> $ git config --global alias.co checkout
> $ git config --global alias.br branch
> $ git config --global alias.ci commit
> $ git config --global alias.st status
> ```

🇻🇳 **Dịch**
> "Git không tự suy ra lệnh của bạn nếu bạn chỉ gõ một phần.
> Nếu không muốn gõ đầy đủ từng lệnh Git, bạn có thể dễ dàng đặt alias cho mỗi lệnh bằng `git config`."

📖 **Nguyên văn — tạo lệnh "đáng lẽ phải có"**
> "This technique can also be very useful in creating commands that you think **should** exist.
> For example, to correct the usability problem you encountered with unstaging a file, you can add your own `unstage` alias to Git:"
> ```
> $ git config --global alias.unstage 'reset HEAD --'
> ```
> "This makes the following two commands equivalent:
> `git unstage fileA` ≡ `git reset HEAD -- fileA`
> This seems a bit clearer."

🇻🇳 **Dịch**
> "Kỹ thuật này cũng rất hữu ích để tạo ra những lệnh mà bạn nghĩ **đáng lẽ phải** tồn tại.
> Ví dụ, để khắc phục vấn đề khó dùng khi unstage một file (xem [[07 - Undoing Things]]), bạn có thể tự thêm alias `unstage` cho Git. […]
> Cách này trông rõ nghĩa hơn một chút."

📖 **Nguyên văn — `last`**
> ```
> $ git config --global alias.last 'log -1 HEAD'
> ```
> "This way, you can see the last commit easily."

🇻🇳 **Dịch**
> "Nhờ vậy bạn xem commit gần nhất rất dễ."

📖 **Nguyên văn — chạy lệnh ngoài Git**
> "As you can tell, Git simply replaces the new command with whatever you alias it for.
> However, maybe you want to run an external command, rather than a Git subcommand.
> In that case, **you start the command with a `!` character**."
> ```
> $ git config --global alias.visual '!gitk'
> ```

🇻🇳 **Dịch**
> "Như bạn thấy, Git chỉ đơn giản thay lệnh mới bằng thứ bạn đã alias.
> Tuy nhiên, có thể bạn muốn chạy một lệnh bên ngoài chứ không phải một subcommand của Git.
> Trong trường hợp đó, **bắt đầu lệnh bằng ký tự `!`**."

> [!tip] Bộ alias đáng dùng
> ```bash
> git config --global alias.st status
> git config --global alias.co checkout
> git config --global alias.br branch
> git config --global alias.unstage 'reset HEAD --'
> git config --global alias.last 'log -1 HEAD'
> git config --global alias.lg "log --oneline --graph --all --decorate"
> ```
> Alias lưu vào `~/.gitconfig` — xem lại [[03 - Lịch sử, cài đặt và cấu hình Git]].

---

## Liên kết
- Bài trước: [[08 - Working with Remotes]]
- Bài kế: [[10 - Branches in a Nutshell]] — bắt đầu chương 3
- Khái niệm **detached HEAD** sẽ rõ hơn sau khi đọc [[10 - Branches in a Nutshell]]

## Nguồn tham khảo
- Pro Git §2.6: <https://git-scm.com/book/en/v2/Git-Basics-Tagging>
- Pro Git §2.7: <https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases>
