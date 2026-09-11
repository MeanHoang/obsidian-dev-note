# 05 — GitHub Flow

> **Nguồn chính:** GitHub Docs — *GitHub flow* — https://docs.github.com/en/get-started/using-github/github-flow
> Bài này bám trọn 3 mục của trang: **Introduction**, **Prerequisites**, **Following GitHub flow** (6 bước: Create a branch → Make changes → Create a pull request → Address review comments → Merge your pull request → Delete your branch), bổ sung khái niệm pull request và branch từ 2 trang reference chính thống của GitHub.

---

## Introduction — GitHub flow là gì

📖 **Nguyên văn**
> "GitHub flow is a lightweight, branch-based workflow. The GitHub flow is useful for everyone, not just developers. For example, here at GitHub, we use GitHub flow for our site policy, documentation, and roadmap."

🇻🇳 **Dịch**
> "GitHub flow là một workflow nhẹ, dựa trên branch. GitHub flow hữu ích cho tất cả mọi người, không chỉ riêng developer. Ví dụ, ngay tại GitHub, chúng tôi dùng GitHub flow cho site policy, documentation và roadmap của mình."

💡 **Ví dụ đời sống**
Hãy hình dung một toà soạn báo. Bản báo đang lên khuôn (default branch) là thứ độc giả sẽ đọc — không ai được viết nguệch ngoạc trực tiếp lên đó. Muốn thêm một bài mới, phóng viên lấy một tờ giấy nháp riêng (branch), viết xong thì đưa cho biên tập (pull request), biên tập đọc và ghi chú bên lề (review comments), sửa xong mới cho phép ghép vào bản lên khuôn (merge), rồi vứt tờ nháp đi (delete branch). Đó chính xác là GitHub flow.

> [!note]
> "lightweight" và "branch-based" là hai từ khoá. Nhẹ vì chỉ có **một branch chính** (default branch, thường tên `main`) cộng với các branch ngắn hạn; không có `develop`, `release`, `hotfix` như các workflow nặng hơn.

---

## Prerequisites

📖 **Nguyên văn**
> "To follow GitHub flow, you will need a GitHub account and a repository. For information on how to create an account, see Creating an account on GitHub. For information on how to create a repository, see Quickstart for repositories. For information on how to find an existing repository to contribute to, see Finding ways to contribute to open source on GitHub."

🇻🇳 **Dịch**
> "Để theo GitHub flow, bạn sẽ cần một GitHub account và một repository. Để biết cách tạo account, xem *Creating an account on GitHub*. Để biết cách tạo repository, xem *Quickstart for repositories*. Để biết cách tìm một repository có sẵn mà bạn muốn đóng góp, xem *Finding ways to contribute to open source on GitHub*."

---

## Following GitHub flow

📖 **Nguyên văn (Tip mở đầu)**
> "You can complete all steps of GitHub flow through the GitHub web interface, command line and GitHub CLI, or GitHub Desktop. For more information about the tools you can use to connect to GitHub, see Connecting to GitHub."

🇻🇳 **Dịch**
> "Bạn có thể hoàn tất tất cả các bước của GitHub flow thông qua giao diện web GitHub, command line và GitHub CLI, hoặc GitHub Desktop. Để biết thêm về các công cụ dùng để kết nối tới GitHub, xem *Connecting to GitHub*."

> [!tip]
> Toàn bộ quy trình không bắt buộc phải làm trên web. Các lệnh Git đã học ở [[08 - Working with Remotes]] và [[10 - Branches in a Nutshell]] là đủ cho phần "Create a branch" và "Make changes"; chỉ phần pull request mới cần giao diện GitHub hoặc `gh` CLI.

---

### Bước 1 — Create a branch

📖 **Nguyên văn**
> "Create a branch in your repository. A short, descriptive branch name enables your collaborators to see ongoing work at a glance. For example, `increase-test-timeout` or `add-code-of-conduct`. For more information, see Managing branches within your repository."
>
> "By creating a branch, you create a space to work without affecting the default branch. Additionally, you give collaborators a chance to review your work."

🇻🇳 **Dịch**
> "Tạo một branch trong repository của bạn. Một tên branch ngắn, mang tính mô tả giúp các collaborator nhìn một cái là thấy công việc đang diễn ra. Ví dụ, `increase-test-timeout` hoặc `add-code-of-conduct`."
>
> "Bằng cách tạo branch, bạn tạo ra một không gian để làm việc mà không ảnh hưởng tới default branch. Thêm nữa, bạn cho collaborator cơ hội review công việc của mình."

📖 **Nguyên văn — định nghĩa branch (trang *Branches*)**
> "Branches let you develop features, fix bugs, or safely experiment with new ideas in a contained area of your repository."
>
> "You always create a branch from an existing branch. Typically, you might create a new branch from the default branch of your repository. You can then work on this new branch in isolation from changes that other people are making to the repository."
>
> "A branch you create to build a feature is commonly called a feature branch or topic branch."

🇻🇳 **Dịch**
> "Branch cho phép bạn phát triển feature, sửa bug, hoặc thử nghiệm ý tưởng mới một cách an toàn trong một khu vực tách biệt của repository."
>
> "Bạn luôn tạo branch từ một branch đã có. Thông thường, bạn sẽ tạo branch mới từ default branch của repository. Sau đó bạn làm việc trên branch mới này, cách ly khỏi những thay đổi mà người khác đang làm trên repository."
>
> "Branch bạn tạo để xây dựng một feature thường được gọi là feature branch hoặc topic branch."

> [!note]
> Khái niệm **topic branch** này đã được giải thích chi tiết trong [[12 - Branch Management và Branching Workflows]]. GitHub chỉ đang gọi tên lại đúng khái niệm đó.

📖 **Nguyên văn — default branch (trang *Branches*)**
> "When you create a repository with content on GitHub, GitHub creates the repository with a single branch. This first branch in the repository is the default branch. The default branch is the branch that GitHub displays when anyone visits your repository. The default branch is also the initial branch that Git checks out locally when someone clones the repository. Unless you specify a different branch, the default branch in a repository is the base branch for new pull requests and code commits."
>
> "By default, GitHub names the default branch `main` in any new repository."

🇻🇳 **Dịch**
> "Khi bạn tạo một repository có nội dung trên GitHub, GitHub tạo repository với một branch duy nhất. Branch đầu tiên này chính là default branch. Default branch là branch mà GitHub hiển thị khi có ai đó vào xem repository của bạn. Default branch cũng là branch đầu tiên mà Git checkout ở local khi ai đó clone repository. Trừ khi bạn chỉ định branch khác, default branch trong một repository là base branch cho các pull request và commit mới."
>
> "Mặc định, GitHub đặt tên default branch là `main` trong mọi repository mới."

---

### Bước 2 — Make changes

📖 **Nguyên văn**
> "On your branch, make any desired changes to the repository."
>
> "Your branch is a safe place to make changes. If you make a mistake, you can revert your changes or push additional changes to fix the mistake. Your changes will not end up on the default branch until you merge your branch."
>
> "Commit and push your changes to your branch. Give each commit a descriptive message to help you and future contributors understand what changes the commit contains. For example, `fix typo` or `increase rate limit`."
>
> "Ideally, each commit contains an isolated, complete change. This makes it easy to revert your changes if you decide to take a different approach. For example, if you want to rename a variable and add some tests, put the variable rename in one commit and the tests in another commit. Later, if you want to keep the tests but revert the variable rename, you can revert the specific commit that contained the variable rename. If you put the variable rename and tests in the same commit or spread the variable rename across multiple commits, you would spend more effort reverting your changes."
>
> "By committing and pushing your changes, you back up your work to remote storage. This means that you can access your work from any device. It also means that your collaborators can see your work, answer questions, and make suggestions or contributions."
>
> "Continue to make, commit, and push changes to your branch until you are ready to ask for feedback."

🇻🇳 **Dịch**
> "Trên branch của bạn, thực hiện bất kỳ thay đổi nào bạn muốn với repository."
>
> "Branch của bạn là nơi an toàn để thay đổi. Nếu bạn làm sai, bạn có thể revert các thay đổi hoặc push thêm thay đổi để sửa lỗi. Các thay đổi của bạn sẽ không lọt lên default branch cho tới khi bạn merge branch."
>
> "Commit và push các thay đổi lên branch của bạn. Hãy cho mỗi commit một message mang tính mô tả để giúp bạn và các contributor sau này hiểu commit đó chứa thay đổi gì. Ví dụ, `fix typo` hoặc `increase rate limit`."
>
> "Lý tưởng nhất là mỗi commit chứa một thay đổi độc lập, hoàn chỉnh. Điều này giúp việc revert trở nên dễ dàng nếu bạn quyết định đi theo hướng khác. Ví dụ, nếu bạn muốn đổi tên một biến và thêm vài test, hãy đặt phần đổi tên biến vào một commit và phần test vào một commit khác. Sau này, nếu bạn muốn giữ test nhưng revert phần đổi tên biến, bạn có thể revert đúng commit chứa phần đổi tên biến. Nếu bạn nhét cả đổi tên biến lẫn test vào cùng một commit, hoặc rải phần đổi tên biến ra nhiều commit, bạn sẽ tốn công hơn nhiều khi revert."
>
> "Bằng cách commit và push, bạn sao lưu công việc của mình lên remote storage. Nghĩa là bạn truy cập được công việc của mình từ bất kỳ thiết bị nào. Nó cũng có nghĩa là các collaborator có thể thấy công việc của bạn, trả lời câu hỏi, và đưa ra gợi ý hoặc đóng góp."
>
> "Tiếp tục thay đổi, commit và push lên branch cho tới khi bạn sẵn sàng xin feedback."

💡 **Ví dụ đời sống**
Nguyên tắc "mỗi commit là một thay đổi độc lập, hoàn chỉnh" giống như đóng gói đồ khi chuyển nhà: mỗi thùng một loại đồ và có dán nhãn. Nếu bạn nhét nồi niêu, sách vở và quần áo chung một thùng không nhãn, lúc muốn trả lại riêng mấy quyển sách bạn phải bới tung cả thùng. Commit gộp bừa bãi cũng vậy — muốn revert một phần, bạn phải gỡ tay từng dòng.

📖 **Nguyên văn (Tip)**
> "Make a separate branch for each set of unrelated changes. This makes it easier for reviewers to give feedback. It also makes it easier for you and future collaborators to understand the changes and to revert or build on them. Additionally, if there is a delay in one set of changes, your other changes aren't also delayed."

🇻🇳 **Dịch**
> "Hãy tạo branch riêng cho mỗi nhóm thay đổi không liên quan tới nhau. Việc này giúp reviewer dễ đưa feedback hơn. Nó cũng giúp bạn và các collaborator sau này dễ hiểu thay đổi, dễ revert hoặc dễ xây tiếp trên đó. Ngoài ra, nếu một nhóm thay đổi bị trì hoãn thì các thay đổi khác của bạn không bị trì hoãn theo."

---

### Bước 3 — Create a pull request

📖 **Nguyên văn**
> "Create a pull request to ask collaborators for feedback on your changes. Pull request review is so valuable that some repositories require an approving review before pull requests can be merged. If you want early feedback or advice before you complete your changes, you can mark your pull request as a draft."
>
> "When you create a pull request, include a summary of the changes and what problem they solve. You can include images, links, and tables to help convey this information. If your pull request addresses an issue, link the issue so that issue stakeholders are aware of the pull request and vice versa. If you link with a keyword, the issue will close automatically when the pull request merges."
>
> "In addition to filling out the body of the pull request, you can add comments to specific lines of the pull request to explicitly point something out to the reviewers."
>
> "Your repository may be configured to automatically request a review from specific teams or users when a pull request is created. You can also manually @mention or request a review from specific people or teams."
>
> "If your repository has checks configured to run on pull requests, you will see any checks that failed on your pull request. This helps you catch errors before merging your branch."

🇻🇳 **Dịch**
> "Tạo một pull request để xin feedback từ các collaborator về thay đổi của bạn. Pull request review có giá trị tới mức một số repository bắt buộc phải có một approving review trước khi pull request được merge. Nếu bạn muốn feedback hoặc lời khuyên sớm, trước khi hoàn thành thay đổi, bạn có thể đánh dấu pull request là draft."
>
> "Khi tạo pull request, hãy kèm một bản tóm tắt các thay đổi và vấn đề mà chúng giải quyết. Bạn có thể chèn hình ảnh, link và bảng để truyền đạt thông tin này. Nếu pull request của bạn xử lý một issue, hãy link issue đó lại để những người quan tâm issue biết về pull request và ngược lại. Nếu bạn link bằng keyword, issue sẽ tự động đóng khi pull request được merge."
>
> "Ngoài việc điền phần body của pull request, bạn có thể thêm comment vào các dòng cụ thể trong pull request để chỉ rõ điều gì đó cho reviewer."
>
> "Repository của bạn có thể được cấu hình để tự động request review từ team hoặc user cụ thể khi pull request được tạo. Bạn cũng có thể @mention thủ công hoặc request review từ những người hoặc team cụ thể."
>
> "Nếu repository của bạn có checks được cấu hình chạy trên pull request, bạn sẽ thấy các check nào bị fail trên pull request của mình. Điều này giúp bạn bắt lỗi trước khi merge branch."

📖 **Nguyên văn — định nghĩa pull request (trang *Pull requests*)**
> "Pull requests are proposals to merge code changes into a project. A pull request is GitHub's key collaboration feature, letting you discuss and review changes before merging them. This helps teams work together, catch issues early, and maintain code quality."

🇻🇳 **Dịch**
> "Pull request là những đề xuất merge thay đổi code vào một project. Pull request là tính năng cộng tác cốt lõi của GitHub, cho phép bạn thảo luận và review thay đổi trước khi merge. Điều này giúp các team làm việc cùng nhau, phát hiện vấn đề sớm, và duy trì chất lượng code."

📖 **Nguyên văn — các tab của một pull request (trang *Pull requests*)**
> "A pull request brings together the context reviewers need to understand a change. This context is organized into tabs:
> The Conversation tab shows the description, timeline, comments, and reviews.
> The Commits tab shows how the pull request branch changed over time.
> The Checks tab shows automated tests, builds, and other validations.
> The Files changed tab shows the diff that reviewers use to understand the proposed changes.
> The Findings tab shows automated code review results, such as code scanning alerts, for the proposed changes."

🇻🇳 **Dịch**
> "Pull request gom lại toàn bộ bối cảnh mà reviewer cần để hiểu một thay đổi. Bối cảnh này được tổ chức thành các tab:
> Tab **Conversation** hiển thị phần mô tả, timeline, comment và review.
> Tab **Commits** hiển thị branch của pull request đã thay đổi thế nào theo thời gian.
> Tab **Checks** hiển thị các test tự động, build và những bước kiểm tra khác.
> Tab **Files changed** hiển thị diff mà reviewer dùng để hiểu các thay đổi được đề xuất.
> Tab **Findings** hiển thị kết quả code review tự động, ví dụ code scanning alert, cho các thay đổi được đề xuất."

📖 **Nguyên văn — draft pull request (trang *Pull requests*)**
> "When you create a pull request, you can choose to make it a draft pull request. Draft pull requests cannot be merged, and code owners are not automatically requested to review them. Drafts are useful when you want to share work-in-progress without formally requesting reviews."

🇻🇳 **Dịch**
> "Khi tạo pull request, bạn có thể chọn biến nó thành draft pull request. Draft pull request không thể merge, và code owner không bị tự động request review. Draft hữu ích khi bạn muốn chia sẻ công việc đang dang dở mà chưa chính thức xin review."

💡 **Ví dụ đời sống cho pull request / code review**
Pull request giống hệt việc nộp luận văn cho hội đồng. Bạn không tự mang bài lên thư viện đóng dấu; bạn nộp bản thảo (pull request) kèm một trang tóm tắt "đề tài này giải quyết vấn đề gì" (phần body). Hội đồng đọc, gạch chân từng đoạn và ghi chú bên lề (comment trên từng dòng code), có người yêu cầu sửa, có người ký duyệt (approving review). Có cả những kiểm tra máy móc trước khi ra hội đồng — đúng chính tả, đúng format, đủ trang (đó là **checks** / CI tự động). Chỉ khi đủ chữ ký duyệt, bài mới được nhập kho thư viện (merge vào default branch). Còn draft pull request là bản thảo bạn đưa thầy hướng dẫn xem trước cho ý kiến, chưa nộp hội đồng.

---

### Bước 4 — Address review comments

📖 **Nguyên văn**
> "Reviewers should leave questions, comments, and suggestions. Reviewers can comment on the whole pull request or add comments to specific lines or files. You and reviewers can insert images or code suggestions to clarify comments."
>
> "You can continue to commit and push changes in response to the reviews. Your pull request will update automatically."

🇻🇳 **Dịch**
> "Reviewer nên để lại câu hỏi, comment và gợi ý. Reviewer có thể comment cho cả pull request hoặc thêm comment vào những dòng hoặc file cụ thể. Bạn và reviewer có thể chèn hình ảnh hoặc code suggestion để làm rõ comment."
>
> "Bạn có thể tiếp tục commit và push thay đổi để đáp lại các review. Pull request của bạn sẽ tự động cập nhật."

> [!tip]
> Điểm mấu chốt: **không cần đóng pull request rồi mở cái mới**. Cứ push tiếp lên cùng branch, pull request tự cập nhật — vì pull request trỏ tới branch, không phải tới một tập commit cố định.

---

### Bước 5 — Merge your pull request

📖 **Nguyên văn**
> "Once your pull request is approved, merge your pull request. This will automatically merge your branch so that your changes appear on the default branch. GitHub retains the history of comments and commits in the pull request to help future contributors understand your changes."
>
> "GitHub will tell you if your pull request has conflicts that must be resolved before merging."
>
> "Branch protection settings may block merging if your pull request does not meet certain requirements. For example, you need a certain number of approving reviews or an approving review from a specific team."

🇻🇳 **Dịch**
> "Một khi pull request của bạn được approve, hãy merge pull request. Việc này sẽ tự động merge branch của bạn để các thay đổi xuất hiện trên default branch. GitHub giữ lại lịch sử comment và commit trong pull request để giúp các contributor sau này hiểu được thay đổi của bạn."
>
> "GitHub sẽ báo cho bạn biết nếu pull request có conflict cần được giải quyết trước khi merge."
>
> "Các thiết lập branch protection có thể chặn việc merge nếu pull request không đáp ứng một số yêu cầu nhất định. Ví dụ, bạn cần một số lượng approving review nhất định, hoặc một approving review từ một team cụ thể."

> [!note]
> Cơ chế merge và conflict ở đây chính là merge của Git đã học ở [[11 - Basic Branching and Merging]]. GitHub chỉ bọc thêm giao diện và các điều kiện chặn (branch protection) lên trên.

📖 **Nguyên văn — protected branch (trang *Branches*)**
> "Protected branches help maintainers enforce rules on important branches. A protected branch can block force pushes or deletion, require status checks, require reviews, require code owner approval, or require signed commits before changes can merge."

🇻🇳 **Dịch**
> "Protected branch giúp maintainer áp đặt luật lên các branch quan trọng. Một protected branch có thể chặn force push hoặc chặn xoá, bắt buộc status check, bắt buộc review, bắt buộc code owner approval, hoặc bắt buộc signed commit trước khi thay đổi được merge."

> [!warning]
> Nguyên văn phần *Note* trên trang *Branches*: "If you're a repository administrator, you can merge pull requests on branches with branch protections enabled even if the pull request does not meet the requirements, unless branch protections have been set to 'Include administrators.'"
> — Nghĩa là admin repository vẫn merge được dù pull request chưa đủ điều kiện, trừ khi branch protection được bật tuỳ chọn "Include administrators".

---

### Bước 6 — Delete your branch

📖 **Nguyên văn**
> "After you merge your pull request, delete your branch. This indicates that the work on the branch is complete and prevents you or others from accidentally using old branches."
>
> "Don't worry about losing information. Your pull request and commit history will not be deleted. You can always restore your deleted branch or revert your pull request if needed."

🇻🇳 **Dịch**
> "Sau khi merge pull request, hãy xoá branch. Việc này cho thấy công việc trên branch đã hoàn tất và ngăn bạn hoặc người khác vô tình dùng lại branch cũ."
>
> "Đừng lo mất thông tin. Pull request và lịch sử commit của bạn sẽ không bị xoá. Bạn luôn có thể khôi phục branch đã xoá hoặc revert pull request nếu cần."

> [!tip]
> Đây đúng là lời khuyên "sau khi merge thì xoá topic branch" đã gặp ở [[12 - Branch Management và Branching Workflows]] — branch trong Git chỉ là một con trỏ, xoá con trỏ không xoá commit.

---

## So sánh với long-running branch workflow

Ở [[12 - Branch Management và Branching Workflows]] ta đã học mô hình **long-running branch**: nhiều branch tồn tại lâu dài, mỗi branch đại diện cho một mức độ ổn định khác nhau (ví dụ `master` chỉ chứa code đã release, `develop` chứa code đang ổn định dần, `topic` là các nhánh ngắn hạn), code "leo" dần từ nhánh kém ổn định lên nhánh ổn định hơn.

GitHub flow cắt phẳng mô hình đó:

| | Long-running branch workflow | GitHub flow |
|---|---|---|
| Số branch tồn tại lâu dài | Nhiều (`master`, `develop`, `next`, `proposed`...) | **Đúng một** — default branch (`main`) |
| Branch ngắn hạn | topic branch | topic branch (GitHub gọi là feature branch / topic branch) |
| Đường đi của code | topic → develop → master (leo nhiều tầng) | topic → **thẳng vào** default branch |
| Cổng kiểm soát chất lượng | merge thủ công qua từng tầng ổn định | **pull request review** + checks + branch protection |
| Tài liệu mô tả | Pro Git ch. 3.4 | GitHub Docs — *GitHub flow*, tự mô tả là "lightweight" |

Điểm chung: cả hai đều xây trên đúng một nền tảng Git là topic branch. Điểm khác cốt lõi là GitHub flow **thay các tầng branch ổn định bằng cơ chế review + automated checks**. Thay vì để code "ngồi chờ" ở `develop` cho chín, GitHub flow đòi code phải đủ chín *trước khi* merge, và dùng pull request để kiểm chứng điều đó.

> [!note]
> Trang *Branches* của GitHub có lời khuyên rất hợp với tinh thần này: "We recommend merging a pull request as soon as possible. This encourages contributors to make pull requests smaller, which we recommend in general." — Merge sớm để pull request nhỏ lại, thay vì để một nhánh sống lâu rồi phình to.

---

## Hai mô hình cộng tác (collaborative development models)

📖 **Nguyên văn (trang *Pull requests*)**
> "The way you use pull requests depends on the type of development model you use in your project. You can use the fork and pull model or the shared repository model."
>
> "In the fork and pull model, anyone can fork an existing ("upstream") repository if they have read access and the owner of the upstream repository allows it. Be aware that a fork and its upstream share the same Git data. This means that all content uploaded to a fork is accessible from the upstream and all other forks of that upstream."
>
> "In the shared repository model, collaborators have push access to a single shared repository and create topic branches when they need to make changes. Pull requests are useful in this model because they start code review and general discussion about a set of changes before the changes are merged into the main development branch. This model is more common with small teams and organizations collaborating on private projects."

🇻🇳 **Dịch**
> "Cách bạn dùng pull request phụ thuộc vào loại development model bạn dùng trong project. Bạn có thể dùng fork and pull model hoặc shared repository model."
>
> "Trong fork and pull model, bất kỳ ai cũng có thể fork một repository có sẵn ("upstream") nếu họ có quyền read và chủ của upstream repository cho phép. Lưu ý rằng một fork và upstream của nó chia sẻ cùng dữ liệu Git. Nghĩa là mọi nội dung được upload lên một fork đều truy cập được từ upstream và từ tất cả các fork khác của upstream đó."
>
> "Trong shared repository model, các collaborator có quyền push vào một repository dùng chung duy nhất và tạo topic branch khi cần thay đổi. Pull request hữu ích trong model này vì chúng khởi động code review và thảo luận chung về một nhóm thay đổi trước khi các thay đổi được merge vào main development branch. Model này phổ biến hơn với các team nhỏ và tổ chức cộng tác trên project riêng tư."

> [!warning]
> Câu "a fork and its upstream share the same Git data... all content uploaded to a fork is accessible from the upstream and all other forks" rất dễ bị bỏ qua. Nó có nghĩa là **đừng bao giờ push secret/credential lên một fork của repo public** và nghĩ rằng nó riêng tư.

💡 **Ví dụ đời sống**
*Shared repository model* giống một nhóm nhân viên cùng công ty cùng sửa một bộ hồ sơ chung: ai cũng có chìa khoá tủ hồ sơ, nhưng trước khi ghim tờ giấy mới vào hồ sơ chính thì phải qua trưởng phòng duyệt. *Fork and pull model* giống người ngoài công ty muốn góp ý: họ không có chìa khoá, nên họ photo toàn bộ hồ sơ về nhà (fork), sửa trên bản photo, rồi gửi bản đề xuất kèm thư "đề nghị áp dụng thay đổi này" (pull request) cho công ty xem xét.

---

## Liên kết

- Bài trước: [[04 - GitHub - Maintaining a Project]]
- Bài kế: [[06 - GitLab - Merge Requests]]
- Cross-link phần 03:
  - [[10 - Branches in a Nutshell]] — branch là con trỏ tới commit, HEAD
  - [[11 - Basic Branching and Merging]] — merge, fast-forward, conflict
  - [[12 - Branch Management và Branching Workflows]] — topic branch, long-running branch (đối chiếu ở mục so sánh)
  - [[08 - Working with Remotes]] — push/pull, remote, upstream
  - [[13 - Remote Branches]] — remote-tracking branch, upstream branch

## Nguồn tham khảo

- GitHub Docs — *GitHub flow* : https://docs.github.com/en/get-started/using-github/github-flow
- GitHub Docs — *Pull requests* (About pull requests) : https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests
- GitHub Docs — *Branches* (About branches) : https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches
- Bản markdown gốc của nguồn chính : https://raw.githubusercontent.com/github/docs/main/content/get-started/using-github/github-flow.md
- Trang *GitHub flow* không có hình minh hoạ → không có ảnh nào được lưu trong `assets/` cho bài này.
