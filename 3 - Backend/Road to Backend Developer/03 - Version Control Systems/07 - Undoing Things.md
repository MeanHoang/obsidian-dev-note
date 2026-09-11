# 07 — Undoing Things

> **Nguồn chính:** Pro Git §2.4 — <https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things>

📖 **Nguyên văn — cảnh báo mở đầu**
> "At any stage, you may want to undo something.
> Here, we’ll review a few basic tools for undoing changes that you’ve made.
> **Be careful, because you can’t always undo some of these undos.**
> This is one of the few areas in Git where you may lose some work if you do it wrong."

🇻🇳 **Dịch**
> "Ở bất kỳ giai đoạn nào, bạn cũng có thể muốn undo một thứ gì đó.
> Ở đây chúng ta điểm qua vài công cụ cơ bản để undo các thay đổi bạn đã làm.
> **Hãy cẩn thận, vì không phải lúc nào cũng undo được chính những cái undo này.**
> Đây là một trong số ít chỗ trong Git mà bạn có thể mất việc nếu làm sai."

---

## 1. `git commit --amend` — sửa commit gần nhất

📖 **Nguyên văn**
> "One of the common undos takes place when you commit too early and possibly forget to add some files, or you mess up your commit message.
> If you want to redo that commit, make the additional changes you forgot, stage them, and commit again using the `--amend` option."
> ```
> $ git commit --amend
> ```
> "This command takes your staging area and uses it for the commit.
> If you’ve made no changes since your last commit […] then your snapshot will look exactly the same, and all you’ll change is your commit message."

🇻🇳 **Dịch**
> "Một trong những kiểu undo phổ biến xảy ra khi bạn commit quá sớm, có thể quên add vài file, hoặc viết hỏng commit message.
> Nếu muốn làm lại commit đó, hãy thực hiện nốt các thay đổi còn thiếu, stage chúng, rồi commit lại với option `--amend`. […]
> Lệnh này lấy staging area của bạn và dùng nó cho commit.
> Nếu bạn chưa thay đổi gì kể từ commit gần nhất […] thì snapshot sẽ y hệt, và thứ duy nhất bạn đổi là commit message."

📖 **Nguyên văn — ví dụ quên file**
> ```
> $ git commit -m 'Initial commit'
> $ git add forgotten_file
> $ git commit --amend
> ```
> "You end up with a single commit — the second commit replaces the results of the first."

🇻🇳 **Dịch**
> "Kết quả là bạn chỉ có **một** commit — commit thứ hai thay thế kết quả của commit thứ nhất."

📖 **Nguyên văn — bản chất**
> "It’s important to understand that when you’re amending your last commit, **you’re not so much fixing it as replacing it entirely with a new, improved commit** that pushes the old commit out of the way and puts the new commit in its place.
> Effectively, it’s as if the previous commit never happened, and it won’t show up in your repository history."

🇻🇳 **Dịch**
> "Cần hiểu rằng khi amend commit gần nhất, **bạn không hẳn là “sửa” nó, mà là thay thế hoàn toàn bằng một commit mới, tốt hơn** — commit cũ bị đẩy sang một bên và commit mới thế chỗ.
> Trên thực tế, giống như commit trước chưa từng tồn tại, và nó sẽ không hiện trong lịch sử repository."

📖 **Nguyên văn — lợi ích**
> "The obvious value to amending commits is to make minor improvements to your last commit, without cluttering your repository history with commit messages of the form, “Oops, forgot to add a file” or “Darn, fixing a typo in last commit”."

🇻🇳 **Dịch**
> "Giá trị rõ ràng của việc amend là cải thiện nhỏ cho commit gần nhất mà không làm rác lịch sử repository bằng những message kiểu “Ối, quên add file” hay “Chết, sửa typo ở commit trước”."

> [!warning] Quy tắc vàng
> 📖 "**Only amend commits that are still local and have not been pushed somewhere.** Amending previously pushed commits and force pushing the branch will cause problems for your collaborators."
> 🇻🇳 "**Chỉ amend những commit còn ở local và chưa push đi đâu.** Amend commit đã push rồi force push branch sẽ gây rắc rối cho đồng nghiệp của bạn."

---

## 2. Unstage — bỏ file khỏi staging area

### Cách cũ: `git reset HEAD <file>`

📖 **Nguyên văn**
> "let’s say you’ve changed two files and want to commit them as two separate changes, but you accidentally type `git add *` and stage them both.
> How can you unstage one of the two?
> The `git status` command reminds you: […] it says use `git reset HEAD <file>…` to unstage."
> ```
> $ git reset HEAD CONTRIBUTING.md
> Unstaged changes after reset:
> M	CONTRIBUTING.md
> ```
> "The command is a bit strange, but it works. The `CONTRIBUTING.md` file is modified but once again unstaged."

🇻🇳 **Dịch**
> "Giả sử bạn sửa hai file và muốn commit chúng thành hai thay đổi riêng biệt, nhưng lỡ gõ `git add *` và stage cả hai.
> Làm sao unstage một trong hai?
> Lệnh `git status` nhắc bạn: […] nó nói hãy dùng `git reset HEAD <file>…` để unstage. […]
> Lệnh hơi kỳ, nhưng nó chạy được. File `CONTRIBUTING.md` vẫn ở trạng thái modified nhưng đã trở lại unstaged."

📖 **Nguyên văn — mức độ nguy hiểm**
> "It’s true that `git reset` **can** be a dangerous command, especially if you provide the `--hard` flag.
> However, in the scenario described above, **the file in your working directory is not touched**, so it’s relatively safe."

🇻🇳 **Dịch**
> "Đúng là `git reset` **có thể** là lệnh nguy hiểm, đặc biệt khi bạn thêm flag `--hard`.
> Tuy nhiên, trong tình huống mô tả ở trên, **file trong working directory không bị đụng tới**, nên tương đối an toàn."

### Cách mới (Git ≥ 2.23): `git restore --staged <file>`

📖 **Nguyên văn**
> "Git version 2.23.0 introduced a new command: `git restore`.
> It’s basically an alternative to `git reset` which we just covered.
> From Git version 2.23.0 onwards, **Git will use `git restore` instead of `git reset` for many undo operations**."
> ```
> $ git restore --staged CONTRIBUTING.md
> ```

🇻🇳 **Dịch**
> "Git phiên bản 2.23.0 giới thiệu một lệnh mới: `git restore`.
> Về cơ bản đây là lựa chọn thay thế cho `git reset` vừa nói ở trên.
> Từ Git 2.23.0 trở đi, **Git sẽ dùng `git restore` thay cho `git reset` trong nhiều thao tác undo**."

> [!note] Vì sao `git status` của bạn gợi ý khác trong sách
> Git mới gợi ý `git restore --staged`, Git cũ gợi ý `git reset HEAD`. Hai lệnh cùng tác dụng. `restore` ra đời vì `reset` và `checkout` ôm quá nhiều việc khác nhau, gây nhầm lẫn.

---

## 3. Vứt bỏ thay đổi trong working directory

### Cách cũ: `git checkout -- <file>` / Cách mới: `git restore <file>`

📖 **Nguyên văn**
> "What if you realize that you don’t want to keep your changes to the `CONTRIBUTING.md` file?
> How can you easily unmodify it — revert it back to what it looked like when you last committed (or initially cloned, or however you got it into your working directory)?
> Luckily, `git status` tells you how to do that, too."
> ```
> $ git checkout -- CONTRIBUTING.md      # cách cũ
> $ git restore CONTRIBUTING.md          # cách mới (Git ≥ 2.23)
> ```

🇻🇳 **Dịch**
> "Nếu bạn nhận ra mình không muốn giữ các thay đổi trên file `CONTRIBUTING.md` thì sao?
> Làm sao “bỏ modified” cho nó một cách dễ dàng — đưa nó về đúng như lúc commit gần nhất (hoặc lúc clone ban đầu, hoặc bằng cách nào nó vào working directory của bạn)?
> May thay, `git status` cũng chỉ luôn cho bạn cách làm."

> [!danger] Lệnh nguy hiểm nhất bài này
> 📖 "It’s important to understand that `git checkout -- <file>` is a **dangerous** command.
> **Any local changes you made to that file are gone** — Git just replaced that file with the last staged or committed version.
> Don’t ever use this command unless you absolutely know that you don’t want those unsaved local changes."
>
> 🇻🇳 "Cần hiểu rằng `git checkout -- <file>` là một lệnh **nguy hiểm**.
> **Mọi thay đổi local bạn đã làm với file đó sẽ biến mất** — Git vừa thay file đó bằng phiên bản staged hoặc committed gần nhất.
> Đừng bao giờ dùng lệnh này trừ khi bạn chắc chắn tuyệt đối rằng mình không cần những thay đổi local chưa lưu đó."
>
> Sách nói y hệt về `git restore <file>`.

📖 **Nguyên văn — lối thoát an toàn hơn**
> "If you would like to keep the changes you’ve made to that file but still need to get it out of the way for now, we’ll go over **stashing and branching** in Git Branching; these are generally better ways to go."

🇻🇳 **Dịch**
> "Nếu bạn muốn giữ các thay đổi đã làm nhưng tạm thời cần dẹp chúng sang một bên, sách sẽ nói về **stashing và branching** ở chương Git Branching; đó thường là cách tốt hơn."

---

## 4. Nguyên tắc an toàn quan trọng nhất ⭐

📖 **Nguyên văn**
> "Remember, **anything that is committed in Git can almost always be recovered**.
> Even commits that were on branches that were deleted or commits that were overwritten with an `--amend` commit can be recovered.
> However, **anything you lose that was never committed is likely never to be seen again**."

🇻🇳 **Dịch**
> "Nhớ rằng **bất cứ thứ gì đã được commit trong Git thì gần như luôn khôi phục được**.
> Kể cả commit nằm trên branch đã bị xoá, hay commit bị ghi đè bởi một commit `--amend`, cũng có thể khôi phục.
> Tuy nhiên, **bất cứ thứ gì bạn làm mất mà chưa từng được commit thì gần như không bao giờ gặp lại**."

💡 **Ví dụ đời sống**
Commit giống như bấm "Lưu" rồi upload lên két sắt. Két sắt có ghi sổ mọi lần gửi, nên kể cả bạn "xoá" thì thủ kho vẫn lần ra được. Nhưng tờ giấy nháp bạn chưa bao giờ bỏ vào két, khi vứt sọt rác là mất thật.

> [!tip] Rút ra quy tắc thực hành
> Trước mọi thao tác "nguy hiểm" (`reset --hard`, `restore`, `checkout --`, rebase): **commit hoặc `git stash` trước**. Một commit rác dễ dọn hơn nhiều so với một buổi chiều mất code.

---

## Bảng tra nhanh

| Muốn làm gì | Lệnh cũ | Lệnh mới (Git ≥ 2.23) | Nguy hiểm? |
|---|---|---|---|
| Sửa message / thêm file vào commit cuối | `git commit --amend` | (giống) | ⚠️ chỉ khi chưa push |
| Bỏ file khỏi staging area | `git reset HEAD <file>` | `git restore --staged <file>` | An toàn |
| Vứt thay đổi trong working dir | `git checkout -- <file>` | `git restore <file>` | 🔴 Mất code vĩnh viễn |

## Liên kết
- Bài trước: [[06 - Viewing the Commit History]]
- Bài kế: [[08 - Working with Remotes]]
- Ba khu vực working tree / staging / Git directory: [[02 - What is Git]]

## Nguồn tham khảo
- Pro Git §2.4: <https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things>
