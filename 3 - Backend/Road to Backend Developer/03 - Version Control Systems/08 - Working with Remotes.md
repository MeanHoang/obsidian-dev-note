# 08 — Working with Remotes

> **Nguồn chính:** Pro Git §2.5 — <https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes>

📖 **Nguyên văn**
> "To be able to collaborate on any Git project, you need to know how to manage your remote repositories.
> **Remote repositories are versions of your project that are hosted on the Internet or network somewhere.**
> You can have several of them, each of which generally is either read-only or read/write for you."

🇻🇳 **Dịch**
> "Để cộng tác được trên bất kỳ project Git nào, bạn cần biết cách quản lý các remote repository.
> **Remote repository là các phiên bản project của bạn được host trên Internet hoặc trên mạng ở đâu đó.**
> Bạn có thể có nhiều remote, mỗi cái thường ở chế độ chỉ đọc hoặc đọc/ghi đối với bạn."

📖 **Nguyên văn — lưu ý về chữ "remote"**
> "It is entirely possible that you can be working with a “remote” repository that is, in fact, on the same host you are.
> **The word “remote” does not necessarily imply that the repository is somewhere else on the network or Internet, only that it is elsewhere.**"

🇻🇳 **Dịch**
> "Hoàn toàn có thể bạn đang làm việc với một repository “remote” mà thực ra nằm ngay trên chính máy bạn.
> **Chữ “remote” không nhất thiết ám chỉ repository nằm ở đâu đó trên mạng hay Internet, mà chỉ có nghĩa là nó ở chỗ khác.**"

---

## 1. Xem remote — `git remote`

📖 **Nguyên văn**
> "To see which remote servers you have configured, you can run the `git remote` command.
> It lists the shortnames of each remote handle you’ve specified.
> If you’ve cloned your repository, you should at least see `origin` — **that is the default name Git gives to the server you cloned from**."

🇻🇳 **Dịch**
> "Để xem bạn đã cấu hình những remote server nào, chạy lệnh `git remote`.
> Nó liệt kê shortname của từng remote handle bạn đã khai báo.
> Nếu bạn clone repository, ít nhất bạn sẽ thấy `origin` — **đó là tên mặc định Git đặt cho server bạn đã clone từ đó**."

> [!note] `origin` không phải từ khoá đặc biệt
> Nó chỉ là một cái tên mặc định. Đổi tên được, xoá được.

📖 **Nguyên văn — `-v`**
> "You can also specify `-v`, which shows you the URLs that Git has stored for the shortname to be used when reading and writing to that remote."
> ```
> $ git remote -v
> origin	https://github.com/schacon/ticgit (fetch)
> origin	https://github.com/schacon/ticgit (push)
> ```

🇻🇳 **Dịch**
> "Bạn cũng có thể thêm `-v`, nó hiện các URL Git đã lưu cho shortname đó, dùng khi đọc và ghi với remote ấy."

🇻🇳 Chú ý mỗi remote có **hai** dòng: URL cho `fetch` và URL cho `push` — chúng có thể khác nhau.

---

## 2. Thêm remote — `git remote add`

📖 **Nguyên văn**
> "To add a new remote Git repository as a shortname you can reference easily, run `git remote add <shortname> <url>`."
> ```
> $ git remote add pb https://github.com/paulboone/ticgit
> ```
> "Now you can use the string `pb` on the command line instead of the whole URL."

🇻🇳 **Dịch**
> "Để thêm một Git repository remote mới dưới dạng shortname dễ tham chiếu, chạy `git remote add <shortname> <url>`. […]
> Giờ bạn có thể dùng chuỗi `pb` trên dòng lệnh thay cho cả URL dài."

📖 **Nguyên văn**
> ```
> $ git fetch pb
> From https://github.com/paulboone/ticgit
>  * [new branch]      master     -> pb/master
>  * [new branch]      ticgit     -> pb/ticgit
> ```
> "Paul’s `master` branch is now accessible locally as `pb/master` — you can merge it into one of your branches, or you can check out a local branch at that point if you want to inspect it."

🇻🇳 **Dịch**
> "Branch `master` của Paul giờ truy cập được ở local dưới tên `pb/master` — bạn có thể merge nó vào một branch của mình, hoặc check out một branch local tại điểm đó nếu muốn xem xét."

---

## 3. `git fetch` vs `git pull` ⭐

📖 **Nguyên văn — fetch**
> "The command goes out to that remote project and pulls down all the data from that remote project that you don’t have yet.
> After you do this, you should have references to all the branches from that remote, which you can merge in or inspect at any time. […]
> **It’s important to note that the `git fetch` command only downloads the data to your local repository — it doesn’t automatically merge it with any of your work or modify what you’re currently working on.**
> You have to merge it manually into your work when you’re ready."

🇻🇳 **Dịch**
> "Lệnh này đi tới project remote đó và kéo về toàn bộ dữ liệu bạn chưa có.
> Sau khi làm vậy, bạn sẽ có tham chiếu tới mọi branch của remote đó, có thể merge vào hoặc xem xét bất cứ lúc nào. […]
> **Quan trọng: lệnh `git fetch` chỉ tải dữ liệu về local repository — nó KHÔNG tự động merge với công việc của bạn hay thay đổi thứ bạn đang làm.**
> Bạn phải tự merge vào khi thấy sẵn sàng."

📖 **Nguyên văn — pull**
> "If your current branch is set up to track a remote branch […], you can use the `git pull` command to **automatically fetch and then merge** that remote branch into your current branch. […]
> by default, the `git clone` command automatically sets up your local `master` branch to track the remote `master` branch (or whatever the default branch is called) on the server you cloned from."

🇻🇳 **Dịch**
> "Nếu branch hiện tại của bạn được thiết lập để track một remote branch […], bạn có thể dùng lệnh `git pull` để **tự động fetch rồi merge** remote branch đó vào branch hiện tại. […]
> Mặc định, lệnh `git clone` tự động thiết lập branch `master` local của bạn track branch `master` remote (hoặc bất cứ tên nào là branch mặc định) trên server bạn clone từ đó."

🇻🇳 **Công thức nhớ:** `git pull` = `git fetch` + `git merge`

💡 **Ví dụ đời sống**
- `fetch` = ra bưu điện lấy thư về nhà, để trên bàn, chưa mở.
- `pull` = lấy thư về **và** dán luôn nội dung vào sổ tay đang viết dở. Nhanh, nhưng có khi nội dung đá nhau (conflict) ngay giữa trang đang viết.

> [!tip] Thói quen an toàn
> Với repo có nhiều người, `git fetch` rồi `git log origin/main` xem trước, sau đó mới merge. Đỡ bị conflict giữa lúc đang dở việc.

📖 **Nguyên văn — cảnh báo từ Git 2.27**
> "From Git version 2.27 onward, `git pull` will give a warning if the `pull.rebase` variable is not set.
> Git will keep warning you until you set the variable.
>
> If you want the default behavior of Git (fast-forward if possible, else create a merge commit):
> `git config --global pull.rebase "false"`
>
> If you want to rebase when pulling:
> `git config --global pull.rebase "true"`"

🇻🇳 **Dịch**
> "Từ Git phiên bản 2.27 trở đi, `git pull` sẽ cảnh báo nếu biến `pull.rebase` chưa được đặt. Git sẽ cảnh báo mãi tới khi bạn đặt biến đó.
> - Muốn hành vi mặc định của Git (fast-forward nếu được, không thì tạo merge commit): đặt `false`.
> - Muốn rebase khi pull: đặt `true`."

(Khái niệm **fast-forward** và **rebase** xem [[11 - Basic Branching and Merging]] và [[14 - Rebasing]].)

---

## 4. `git push`

📖 **Nguyên văn**
> "When you have your project at a point that you want to share, you have to push it upstream.
> The command for this is simple: `git push <remote> <branch>`."
> ```
> $ git push origin master
> ```

🇻🇳 **Dịch**
> "Khi project của bạn đã tới điểm muốn chia sẻ, bạn phải push nó lên upstream.
> Lệnh rất đơn giản: `git push <remote> <branch>`."

📖 **Nguyên văn — khi nào push bị từ chối**
> "This command works only if you cloned from a server to which you have write access and if nobody has pushed in the meantime.
> If you and someone else clone at the same time and they push upstream and then you push upstream, **your push will rightly be rejected**.
> You’ll have to fetch their work first and incorporate it into yours before you’ll be allowed to push."

🇻🇳 **Dịch**
> "Lệnh này chỉ hoạt động nếu bạn clone từ một server mà bạn có quyền ghi, và nếu trong lúc đó không ai push lên.
> Nếu bạn và người khác cùng clone một lúc, họ push lên trước rồi bạn push, **push của bạn sẽ bị từ chối — và đúng là phải như vậy**.
> Bạn phải fetch công việc của họ về, tích hợp vào của mình, rồi mới được phép push."

> [!warning] Đừng phản xạ `--force`
> Push bị từ chối là Git đang bảo vệ công việc của người khác. Xử lý đúng là `pull`/`fetch` + merge rồi push lại.

---

## 5. `git remote show` — soi kỹ một remote

📖 **Nguyên văn**
> ```
> $ git remote show origin
> * remote origin
>   Fetch URL: https://github.com/schacon/ticgit
>   Push  URL: https://github.com/schacon/ticgit
>   HEAD branch: master
>   Remote branches:
>     master                               tracked
>     dev-branch                           tracked
>   Local branch configured for 'git pull':
>     master merges with remote master
>   Local ref configured for 'git push':
>     master pushes to master (up to date)
> ```
> "It lists the URL for the remote repository as well as the tracking branch information.
> The command helpfully tells you that if you’re on the `master` branch and you run `git pull`, it will automatically merge the remote’s `master` branch into the local one after it has been fetched."

🇻🇳 **Dịch**
> "Nó liệt kê URL của remote repository cùng thông tin tracking branch.
> Lệnh này tiện ở chỗ nói cho bạn biết: nếu bạn đang ở branch `master` và chạy `git pull`, nó sẽ tự động merge branch `master` của remote vào branch local sau khi fetch."

📖 **Nguyên văn — ở repo lớn**
> "This command shows which branch is automatically pushed to when you run `git push` while on certain branches.
> It also shows you which remote branches on the server you don’t yet have, which remote branches you have that have been removed from the server, and multiple local branches that are able to merge automatically with their remote-tracking branch when you run `git pull`."

🇻🇳 **Dịch**
> "Lệnh này cho thấy khi bạn chạy `git push` ở từng branch thì nó tự push tới branch nào.
> Nó cũng cho bạn biết những remote branch trên server mà bạn chưa có, những remote branch bạn đang có nhưng đã bị xoá trên server (`stale`), và các branch local có thể tự merge với remote-tracking branch của chúng khi bạn `git pull`."

🇻🇳 Trong ví dụ của sách có dòng:
```
refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
```
→ branch đã bị xoá trên server, dọn bằng `git remote prune origin`.

---

## 6. Đổi tên và xoá remote

📖 **Nguyên văn**
> "You can run `git remote rename` to change a remote’s shortname. […]
> It’s worth mentioning that **this changes all your remote-tracking branch names, too**.
> What used to be referenced at `pb/master` is now at `paul/master`."

🇻🇳 **Dịch**
> "Dùng `git remote rename` để đổi shortname của một remote. […]
> Đáng nói là **việc này cũng đổi tên toàn bộ remote-tracking branch**.
> Thứ trước đây tham chiếu là `pb/master` giờ thành `paul/master`."

📖 **Nguyên văn**
> "If you want to remove a remote for some reason […] you can either use `git remote remove` or `git remote rm`. […]
> Once you delete the reference to a remote this way, **all remote-tracking branches and configuration settings associated with that remote are also deleted**."

🇻🇳 **Dịch**
> "Nếu vì lý do nào đó bạn muốn xoá một remote […] dùng `git remote remove` hoặc `git remote rm`. […]
> Khi bạn xoá tham chiếu tới một remote theo cách này, **mọi remote-tracking branch và mọi cấu hình liên quan tới remote đó cũng bị xoá theo**."

---

## Tóm tắt lệnh

```bash
git remote -v                          # liệt kê remote + URL
git remote add <tên> <url>             # thêm remote
git fetch <remote>                     # tải về, KHÔNG merge
git pull                               # = fetch + merge
git push <remote> <branch>             # đẩy lên
git remote show <remote>               # soi chi tiết
git remote rename <cũ> <mới>
git remote remove <tên>
git remote prune origin                # dọn branch stale
```

## Liên kết
- Bài trước: [[07 - Undoing Things]]
- Bài kế: [[09 - Tagging và Git Aliases]]
- Phần tiếp theo của roadmap — `04 - Repo Hosting Services` (GitHub, GitLab) — chính là các remote này ở dạng dịch vụ.

## Nguồn tham khảo
- Pro Git §2.5: <https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes>
