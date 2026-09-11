# 04 — Getting a Git Repository

> **Nguồn chính:** Pro Git §2.1 — <https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository>

📖 **Nguyên văn — lời mở chương 2**
> "If you can read only one chapter to get going with Git, this is it.
> This chapter covers every basic command you need to do the vast majority of the things you’ll eventually spend your time doing with Git."

🇻🇳 **Dịch**
> "Nếu chỉ được đọc đúng một chương để bắt đầu với Git, thì là chương này.
> Chương này bao quát mọi lệnh cơ bản bạn cần cho phần lớn những việc rốt cuộc bạn sẽ làm với Git."

---

## Hai cách có một repository

📖 **Nguyên văn**
> "You typically obtain a Git repository in one of two ways:
> - You can take a local directory that is currently not under version control, and turn it into a Git repository, or
> - You can clone an existing Git repository from elsewhere.
>
> In either case, you end up with a Git repository on your local machine, ready for work."

🇻🇳 **Dịch**
> "Thông thường bạn có được một Git repository theo một trong hai cách:
> - Lấy một thư mục local hiện chưa được quản lý phiên bản và biến nó thành một Git repository, hoặc
> - **Clone** một Git repository đã có sẵn từ nơi khác.
>
> Trong cả hai trường hợp, bạn đều có một Git repository trên máy local, sẵn sàng làm việc."

---

## 1. `git init` — khởi tạo trong thư mục có sẵn

📖 **Nguyên văn**
> ```
> $ git init
> ```
> "This creates a new subdirectory named `.git` that contains all of your necessary repository files — a Git repository skeleton.
> **At this point, nothing in your project is tracked yet.**"

🇻🇳 **Dịch**
> "Lệnh này tạo một thư mục con mới tên `.git` chứa toàn bộ file repository cần thiết — bộ khung của một Git repository.
> **Tại thời điểm này, chưa có gì trong project của bạn được track cả.**"

📖 **Nguyên văn**
> "If you want to start version-controlling existing files (as opposed to an empty directory), you should probably begin tracking those files and do an initial commit."
> ```
> $ git add *.c
> $ git add LICENSE
> $ git commit -m 'Initial project version'
> ```

🇻🇳 **Dịch**
> "Nếu muốn bắt đầu quản lý phiên bản cho các file đã có (chứ không phải một thư mục rỗng), bạn nên bắt đầu track các file đó rồi tạo một commit đầu tiên."

> [!warning] `git init` ≠ đã lưu code
> `git init` chỉ dựng cái khung `.git`. Chưa `add` + `commit` thì Git chưa giữ gì của bạn cả.

---

## 2. `git clone` — sao chép repository có sẵn

📖 **Nguyên văn**
> "If you’re familiar with other VCSs such as Subversion, you’ll notice that the command is "clone" and not "checkout".
> This is an important distinction — instead of getting just a working copy, **Git receives a full copy of nearly all data that the server has**.
> Every version of every file for the history of the project is pulled down by default when you run `git clone`."

🇻🇳 **Dịch**
> "Nếu bạn quen các VCS khác như Subversion, hãy để ý lệnh ở đây là **“clone”** chứ không phải **“checkout”**.
> Đây là khác biệt quan trọng — thay vì chỉ lấy về một bản working copy, **Git nhận về bản sao đầy đủ gần như toàn bộ dữ liệu mà server có**.
> Mọi phiên bản của mọi file trong lịch sử project đều được kéo về theo mặc định khi bạn chạy `git clone`."

📖 **Nguyên văn**
> "In fact, if your server disk gets corrupted, you can often use nearly any of the clones on any client to set the server back to the state it was in when it was cloned."

🇻🇳 **Dịch**
> "Thực tế, nếu ổ đĩa server hỏng, bạn thường có thể dùng gần như bất kỳ bản clone nào trên bất kỳ client nào để đưa server về đúng trạng thái lúc nó được clone."

🇻🇳 Đây chính là đặc tính **distributed** đã nói ở [[01 - About Version Control]].

### Cú pháp

```bash
git clone https://github.com/libgit2/libgit2
```

📖 **Nguyên văn**
> "That creates a directory named `libgit2`, initializes a `.git` directory inside it, pulls down all the data for that repository, and checks out a working copy of the latest version."

🇻🇳 **Dịch**
> "Lệnh đó tạo một thư mục tên `libgit2`, khởi tạo một thư mục `.git` bên trong, kéo toàn bộ dữ liệu của repository về, rồi check out một working copy của phiên bản mới nhất."

Đổi tên thư mục đích:
```bash
git clone https://github.com/libgit2/libgit2 mylibgit
```

### Transfer protocols

📖 **Nguyên văn**
> "Git has a number of different transfer protocols you can use.
> The previous example uses the `https://` protocol, but you may also see `git://` or `user@server:path/to/repo.git`, which uses the SSH transfer protocol."

🇻🇳 **Dịch**
> "Git có nhiều transfer protocol khác nhau để bạn dùng.
> Ví dụ trên dùng protocol `https://`, nhưng bạn cũng có thể gặp `git://` hoặc `user@server:path/to/repo.git` — dạng này dùng transfer protocol **SSH**."

💡 **Ví dụ đời sống**
`git clone` không phải "mượn sách về đọc" mà là "photo nguyên cuốn sách kèm toàn bộ bản nháp các lần chỉnh sửa từ trước tới nay". Vì vậy repo lâu đời clone rất nặng, dù thư mục làm việc nhìn thì nhỏ.

## Liên kết
- Bài trước: [[03 - Lịch sử, cài đặt và cấu hình Git]]
- Bài kế: [[05 - Recording Changes to the Repository]]

## Nguồn tham khảo
- Pro Git §2.1: <https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository>
