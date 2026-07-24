# 01 — Installing the Java Development Kit

> Chapter 2, Section 2.1 — Core Java Volume I, 13th Edition (Horstmann).
> Chuyển từ lý thuyết sang **thực hành**: cài JDK lên máy. Với dân JS: bước này = cài Node.js của thế giới Java.

---

## Chọn JDK nào? — Không còn "1 Java của Sun/Oracle" nữa

> *"In days past, the most complete and up-to-date version of the Java Development Kit (JDK) was available from Oracle. Nowadays many different companies and organizations, including Amazon, Azul, Microsoft, and Red Hat, provide up-to-date OpenJDK builds. Each vendor has different licensing conditions and support offerings. The Eclipse Foundation provides free JDK builds for Linux, Mac OS, and Windows, which work well for learning Java."*

**Dịch:** Xưa muốn JDK là tải từ Oracle. Nay **nhiều công ty** cung cấp bản build **OpenJDK** cập nhật: Amazon, Azul, Microsoft, Red Hat... — khác nhau về license + hỗ trợ. Bản của **Eclipse Foundation** miễn phí, hợp để học.

> *"Depending on the provider, the Java Development Kit may have a brand name, such as Temurin (Eclipse Foundation), Corretto (Amazon), or Zulu (Azul). The brand name is of no importance to Java programmers."*

**Dịch:** Tuỳ nhà cung cấp mà JDK mang tên thương hiệu: **Temurin** (Eclipse), **Corretto** (Amazon), **Zulu** (Azul). Tên thương hiệu **không quan trọng** với người lập trình — ruột đều là OpenJDK.

**Vì sao lắm vendor thế?** Nối bài 05 (#6): Java **open source (GPL) từ 2007** → source OpenJDK ai cũng build được → mỗi hãng tự đóng gói + cam kết hỗ trợ riêng. Giống Linux có Ubuntu/Debian/RedHat — cùng kernel, khác nhà phân phối.

> 💡 **Map sang JS:** như Node.js chính chủ vs các bản đóng gói qua nvm/Volta/Homebrew — engine như nhau, khác kênh phân phối. Khác biệt duy nhất đáng chú ý bên Java: **license Oracle JDK** từng có giai đoạn thu phí production → doanh nghiệp đổ sang Temurin/Corretto cho lành.

> *"You should use the Java SE 21 (LTS) JDK."*

**Chốt của sách:** dùng **Java SE 21 (LTS)** — đúng bài LTS đã học (bài 04): production/học hành bám LTS.

Tải tại: [adoptium.net](https://adoptium.net) (Temurin — khuyên dùng) hoặc [oracle.com/java/technologies/downloads](https://www.oracle.com/java/technologies/downloads).

---

## Bảng giải mã jargon (Table 2.1) — đọc trang download không hoa mắt

Trang download Java đầy chữ viết tắt — sách cho bảng "phiên dịch", kèm lời khuyên thẳng thừng:

| Tên | Là gì | Lời khuyên của sách |
|---|---|---|
| **JDK** (Java Development Kit) | Bộ đồ nghề cho người **viết** Java | ✅ Cái bạn cần |
| **JRE** (Java Runtime Environment) | Chỉ để **chạy**, không có tool dev — **chỉ hỗ trợ đến Java 8** | ❌ *"You do not want that"* |
| **SE** (Standard Edition) | Java cho desktop + server thường | ✅ *"You want that"* |
| **ME** (Micro Edition) | Java cho thiết bị nhỏ | Không dùng |
| **OpenJDK** | Bản hiện thực Java SE **miễn phí, open source** | Nền của mọi vendor |
| **Hotspot** | JIT compiler do Oracle phát triển | ✅ *"If asked, choose this one"* |
| **OpenJ9** | JIT compiler khác, của IBM | Không cần |
| **GraalVM** | Compiler **"ahead-of-time"** — chạy nhanh khởi động nhưng thiếu feature | ❌ *"You don't want it for this book"* |
| **LTS** | Bản hỗ trợ nhiều năm | ✅ Chọn LTS mới nhất (21) |
| **Eclipse / Adoptium / Temurin** | Foundation / dự án / tên thương hiệu của bản OpenJDK họ phát | ✅ Nguồn tải khuyên dùng |

Chú ý 2 dòng nối kiến thức cũ:
- **JRE "chết" sau Java 8** — bài 01 từng học JRE như 1 tầng riêng; từ Java 9+ không còn phát hành JRE rời nữa (ai cũng tải JDK, hoặc tự đóng runtime gọn bằng module — Chapter 12)
- **Hotspot** — giờ bạn biết tên thật của cái JIT đã học kỹ (bài 1.2.9): nó tên là **HotSpot** vì đúng nghĩa săn "hot spots" trong code
- **GraalVM** — chính là cái tôi nhắc khi bạn hỏi deploy: AOT compile cho serverless, nhưng sách không dùng

---

## Cài đặt (2.1.2)

> *"If you run Windows or have a Mac, simply launch the setup program and choose the default options."*

**Mac/Windows:** chạy installer, chọn mặc định — xong. (Mac của bạn còn nhanh hơn: `brew install temurin@21`.)

**Linux:** giải nén `.tar.gz` rồi thêm vào PATH:

```bash
export PATH=/opt/jdk-21.0.4/bin:$PATH   # thêm vào ~/.bashrc
```

### Hướng dẫn chi tiết — macOS

**Cách 1 — Homebrew (khuyên dùng, nhanh nhất):**

```bash
brew install temurin@21

# Kiểm tra
javac --version    # → javac 21.x.x
java --version
```

**Cách 2 — Installer thủ công:**

1. Vào [adoptium.net](https://adoptium.net) → chọn **Temurin 21 (LTS)** → macOS → đúng chip: **aarch64** (Apple Silicon M1/M2/M3) hoặc **x64** (Intel)
2. Tải file `.pkg` → mở → Next Next mặc định đến hết
3. Mở Terminal mới → `javac --version` kiểm tra

**Tiện ích riêng của Mac** — lệnh `java_home` liệt kê mọi JDK đã cài (Mac cho phép nhiều version sống chung):

```bash
/usr/libexec/java_home -V          # liệt kê tất cả JDK
/usr/libexec/java_home -v 21       # in đường dẫn JDK 21
```

Nếu cài nhiều version, muốn chọn version mặc định — thêm vào `~/.zshrc`:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

> 💡 `JAVA_HOME` = biến môi trường trỏ tới thư mục JDK — Maven/Gradle và nhiều tool sẽ đọc biến này (như một số tool JS đọc `NODE_PATH`). Nhiều version sống chung = giống `nvm use 18` / `nvm use 20` bên Node.

**Cách 3 — quản lý nhiều version kiểu nvm:** dùng **SDKMAN** ([sdkman.io](https://sdkman.io)):

```bash
curl -s "https://get.sdkman.io" | bash
sdk install java 21-tem            # Temurin 21
sdk list java                      # xem mọi bản có thể cài
sdk use java 21-tem                # đổi version trong shell hiện tại
```

### Hướng dẫn chi tiết — Windows

**Cách 1 — winget (Windows 10/11, nhanh nhất):**

```powershell
winget install EclipseAdoptium.Temurin.21.JDK

# Mở terminal MỚI rồi kiểm tra
javac --version
```

**Cách 2 — Installer thủ công:**

1. Vào [adoptium.net](https://adoptium.net) → **Temurin 21 (LTS)** → Windows x64 → tải file `.msi`
2. Chạy `.msi` → ở màn hình tuỳ chọn, **để nguyên 2 mục được bật sẵn**:
   - ✅ *Add to PATH* — để gõ `javac` ở mọi nơi
   - ✅ *Set JAVA_HOME variable* — cho Maven/Gradle sau này
3. Mở **Command Prompt/PowerShell mới** → `javac --version`

**Nếu lỡ cài mà thiếu PATH** (gõ javac báo "not recognized"):

```powershell
setx PATH "%PATH%;C:\Program Files\Eclipse Adoptium\jdk-21.0.4.11-hotspot\bin"
# rồi MỞ TERMINAL MỚI cho biến có hiệu lực
```

(Đây chính là lệnh `setx` trong Note của sách — bản Adoptium installer thì tự lo hết, *"does not have this issue"*.)

**Lưu ý chung cả 2 nền tảng:**
- Sau khi cài/đổi PATH phải **mở terminal mới** — terminal cũ không thấy biến mới
- Chọn đúng **Temurin 21 LTS**, đừng lấy bản non-LTS mới nhất (22, 23...)

### Kiểm tra cài thành công

> *"Here is how you test whether you did it right. Start a terminal window. Type the line `javac --version`"*

```bash
javac --version
# → javac 21.0.4        ✅ ngon
# → command not found   ❌ xem lại PATH
```

(Giống hệt nghi thức `node --version` sau khi cài Node.)

### JDK nằm ở đâu (Table 2.2)

| Platform | Thư mục |
|---|---|
| **Mac** | `/Library/Java/JavaVirtualMachines/jdk-21.0.4_11.jdk/Contents/Home` |
| Windows (Adoptium) | `C:\Program Files\Eclipse Adoptium\jdk-21.0.4.11-hotspot` |
| Linux | Nơi bạn giải nén, vd `/opt/jdk-21.0.4` |

Sách quy ước từ đây: viết **`jdk/`** nghĩa là thư mục cài đặt đó (vd `jdk/bin` = `.../Contents/Home/bin`).

---

## Cài source + docs + code ví dụ (2.1.3) — tuỳ chọn nhưng đáng làm

3 thứ nên có khi học:

**1. Source code của thư viện chuẩn** — nằm sẵn trong JDK tại `jdk/lib/src.zip`:

```bash
mkdir javasrc && cd javasrc
jar xvf <đường-dẫn-jdk>/lib/src.zip     # jar xvf = giải nén (như unzip)
```

→ Đọc được **ruột** của `String`, `ArrayList`... — sau này IDE cho phép Cmd+Click nhảy thẳng vào source, cực hữu ích để hiểu bản chất (đúng mục tiêu của bạn).

**2. Documentation** — đọc online [docs.oracle.com/en/java/javase/21/docs](https://docs.oracle.com/en/java/javase/21/docs/) hoặc tải bản offline về bookmark. (= MDN của thế giới Java.)

**3. Code ví dụ của sách** — tải từ [horstmann.com/corejava](https://horstmann.com/corejava) — toàn bộ chương trình mẫu trong sách, giải nén ra thư mục `corejava/`.

---

## Tóm tắt section 2.1

> Java giờ **nhiều vendor cùng phát OpenJDK** (Temurin, Corretto, Zulu...) — tên hiệu không quan trọng. Chọn: **JDK** (không phải JRE), **SE**, **LTS 21**, nguồn **adoptium.net**. Cài xong test bằng `javac --version`. Nên giải nén thêm `src.zip` + tải docs + code ví dụ của sách.

---

## Bài kế tiếp

→ [[02 - Using the Command-Line Tools]] — viết, compile (`javac`) và chạy (`java`) chương trình đầu tiên **bằng tay trong terminal** — hiểu IDE làm gì sau lưng mình.
