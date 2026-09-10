# Glossary — Security

> Thuật ngữ chương 10: Security. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**AES** (Advanced Encryption Standard)
Kẻ kế nhiệm của DES, **phương án tốt hơn nhiều** so với DES. Sách dùng AES cho ví dụ symmetric cipher. Xem [[05 - Encryption#10.5.1. Symmetric Ciphers]].

**AllPermission**
Permission **cho phép mọi thao tác**. System class có `CodeSource` là `null` và permission là một instance của `AllPermission`. **`AllPermission` implies mọi permission khác.** Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]] và [[02 - Security Managers and Permissions#10.2.4. Custom Permissions]].

**Application Class Loader**
Tên gọi khác của **system class loader**. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]].

**Authentication Problem**
Vấn đề **xác định danh tính người gửi**. Chữ ký hợp lệ chỉ chứng minh message được ký bằng private key khớp và chưa bị hỏng — **không cho biết ai viết message**, vì ai cũng sinh được một cặp public/private key. Xem [[04 - Digital Signatures#10.4.4. The Authentication Problem]].

## B

**Bootstrap Class Loader**
Class loader load các platform class trong `java.base`, `java.logging`, `java.xml`… cùng một số module nội bộ JDK. **Không có object `ClassLoader` tương ứng** — `StringBuilder.class.getClassLoader()` trả về `null`. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]].

**Bytecode Verifier**
Bộ phận soi xét bytecode của class mới load trước khi virtual machine chạy, kiểm tra rằng lệnh **không thể thực hiện hành động rõ ràng gây hại**. **Mọi class trừ system class đều được verify.** Không phải thuật toán quyết định theo nghĩa Gödel: **chấp nhận thì chắc chắn an toàn**, nhưng **có thể từ chối lệnh vốn thực sự an toàn**. Tắt bằng `-noverify` / `-Xverify:none`. Xem [[01 - Class Loaders#10.1.5. Bytecode Verification]].

## C

**CA** (Certificate Authority)
Thực thể được tin cậy để **ký key của người khác**. Mọi người trong tổ chức có public key của CA trong keystore; khi cài key của nhau, keystore **tin tưởng ngầm định** vì các key đó được ký bởi trusted key. Xem [[04 - Digital Signatures#10.4.5. Certificate Signing]].

**Caesar Cipher**
Cipher lâu đời sách dùng để mã hoá class file trong ví dụ custom class loader. Key là **một số từ 1 tới 255**; giải mã bằng cách **cộng key vào mỗi byte rồi lấy modulo 256**. Caesar dịch 24 chữ cái của bảng chữ La Mã đi **3 chữ**. Xem [[01 - Class Loaders#10.1.4. Writing Your Own Class Loader]].

**Certificate**
**Sự đảm bảo của một bên nào đó rằng code chưa bị can thiệp.** Cùng với code base, certificate tạo thành **code source**. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]].

**Cipher**
Class `javax.crypto.Cipher` — **superclass của mọi thuật toán mã hoá**. Lấy object bằng `getInstance`, khởi tạo bằng `init(mode, key)` với mode `ENCRYPT_MODE`, `DECRYPT_MODE`, `WRAP_MODE`, `UNWRAP_MODE`. Xem [[05 - Encryption#10.5.1. Symmetric Ciphers]].

**Cipher Stream**
Bộ stream class của JCE (`CipherInputStream`, `CipherOutputStream`) **tự động mã hoá hoặc giải mã dữ liệu stream**, xử lý `update` và `doFinal` **một cách trong suốt**. Xem [[05 - Encryption#10.5.3. Cipher Streams]].

**Class Loader**
Cơ chế load class file vào virtual machine. Mọi chương trình Java có **ít nhất ba class loader**: bootstrap, platform, system. Chúng có **quan hệ parent/child**: mỗi class loader **nhường parent thử load trước**, chỉ tự load nếu parent thất bại. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]] và [[01 - Class Loaders#10.1.2. The Class Loader Hierarchy]].

**Classloader Inversion**
Hiện tượng helper method **không nhìn thấy được class trong plugin JAR** vì class của helper method được load bởi system class loader — cũng chính là class loader mà `Class.forName` dùng. Khắc phục bằng cách nhận class loader làm parameter, hoặc dùng **context class loader**. Xem [[01 - Class Loaders#10.1.2. The Class Loader Hierarchy]].

**Code Base**
Phần của code source **chỉ ra nguồn gốc của code**. Code base của remote applet code là **HTTP URL nơi applet được load về**; của code trong file JAR là **URL của file**. Trong policy file viết là `codeBase "url"`; URL kết thúc bằng `/` là directory, ngược lại là file JAR. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]] và [[02 - Security Managers and Permissions#10.2.3. Security Policy Files]].

**Code Signing**
Việc **ký các chương trình thực thi**. Được thiết kế cho applet và Java Web Start application — **không còn là công nghệ dùng phổ biến**, nhưng có thể vẫn phải hỗ trợ trong sản phẩm legacy. Xem [[04 - Digital Signatures#10.4.7. Code Signing]].

**Code Source**
Được xác định bởi **một code base và một tập certificate**. Security policy **ánh xạ code source sang tập permission**. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]].

**Context Class Loader**
Class loader mà **mỗi thread giữ reference tới**. Của main thread là **system class loader**; thread mới **kế thừa của thread tạo ra nó**. Đặt bằng `Thread.setContextClassLoader`, lấy bằng `getContextClassLoader`. Xem [[01 - Class Loaders#10.1.2. The Class Loader Hierarchy]].

## D

**DES** (Data Encryption Standard)
Block cipher lâu đời với **key dài 56 bit**, **block size tám byte**. Nay **bị coi là lỗi thời vì bẻ được bằng brute force**. Xem [[05 - Encryption#10.5.1. Symmetric Ciphers]].

**Digital Signature**
Cơ chế giải quyết vấn đề message và fingerprint cùng bị chặn rồi sửa. Người ký **ký message digest bằng private key**; người nhận **xác minh bằng public key**. Qua được thì chắc chắn **message gốc chưa bị sửa** và **được ký bởi người giữ private key khớp**. Xem [[04 - Digital Signatures#10.4.2. Message Signing]].

**doAs / doAsPrivileged**
Static method của `Subject` **chạy một `PrivilegedAction` thay mặt subject**, dùng permission của các principal của subject. `doAs` bắt đầu với **access control context hiện tại**; `doAsPrivileged` bắt đầu với **context mới**, nhờ đó **tách được permission của login code khỏi business logic**. Xem [[03 - User Authentication#10.3.1. The JAAS Framework]].

**DSA** (Digital Signature Algorithm)
Thuật toán chữ ký số. Sách in một cặp public/private DSA key làm ví dụ. **Được cho là an toàn tương tự RSA.** Xem [[04 - Digital Signatures#10.4.2. Message Signing]].

## J

**JAAS** (Java Authentication and Authorization Service)
Framework **tích hợp authentication do nền tảng cung cấp với việc quản lý permission**. Là API **"pluggable"**, **cô lập ứng dụng Java khỏi công nghệ authentication cụ thể**: hỗ trợ UNIX login, Windows login, Kerberos, certificate-based authentication. Xem [[03 - User Authentication#10.3.1. The JAAS Framework]].

**jarsigner**
Công cụ **ký và xác minh file JAR**. Người ký chỉ định keystore, file JAR và alias của key; người xác minh dùng `-verify` và **không cần chỉ định alias** vì `jarsigner` tìm tên X.500 trong digital signature rồi tìm certificate khớp. Xem [[04 - Digital Signatures#10.4.3. Verifying a Signature]].

## K

**keystore**
**Cơ sở dữ liệu của certificate và các cặp private/public key**, quản lý bằng `keytool`. **Mỗi entry có một alias.** Trong policy file tham chiếu bằng dòng `keystore "keystoreURL", "keystoreType";` — type là `JKS` nếu sinh bởi `keytool`. Password của keystore `cacerts` là `changeit`. Xem [[04 - Digital Signatures#10.4.3. Verifying a Signature]] và [[04 - Digital Signatures#10.4.7. Code Signing]].

**keytool**
Công cụ dòng lệnh của JDK để **sinh và quản lý một tập certificate**. Dùng **tên theo định dạng X.500** (CN, OU, O, L, ST, C). Xem [[04 - Digital Signatures#10.4.3. Verifying a Signature]].

**KeyGenerator**
Class sinh key cho symmetric cipher: lấy generator cho thuật toán, **khởi tạo với một nguồn ngẫu nhiên**, rồi gọi `generateKey`. Xem [[05 - Encryption#10.5.2. Key Generation]].

**KeyPairGenerator**
Class sinh **cặp public/private key**, dùng cho thuật toán public key như RSA. Xem [[05 - Encryption#10.5.4. Public Key Ciphers]].

## L

**LoginContext**
Class dùng để security manager kiểm tra được câu `grant` theo principal. Tham số chuỗi trong constructor **trỏ tới một entry cùng tên trong JAAS configuration file**. Xem [[03 - User Authentication#10.3.1. The JAAS Framework]].

**Login Module**
Thành phần của login policy, mỗi cái gán nhãn **`required`, `sufficient`, `requisite`, hoặc `optional`**. Nhiệm vụ: **điền vào tập principal của subject đang được authenticate**. JDK cung cấp `UnixLoginModule`, `NTLoginModule`, `Krb5LoginModule`, `JndiLoginModule`, `KeyStoreLoginModule`. **Login module không tự thu thập user name và password** — đó là việc của callback handler. Xem [[03 - User Authentication#10.3.1. The JAAS Framework]] và [[03 - User Authentication#10.3.2. JAAS Login Modules]].

## M

**MD5**
Thuật toán message digest do **Ronald Rivest ở MIT** phát minh. Cùng SHA-1, **người ta đã phát hiện những quy luật tinh vi**, và NIST khuyến nghị chuyển sang phương án mạnh hơn. Xem [[04 - Digital Signatures#10.4.1. Message Digests]].

**Message Digest**
**Dấu vân tay số của một khối dữ liệu.** SHA-1 cô đặc mọi khối dữ liệu thành **160 bit (20 byte)**. Hai tính chất: **đổi vài bit dữ liệu thì digest cũng đổi**; **kẻ giả mạo không dựng được message giả có cùng digest**. Xem [[04 - Digital Signatures#10.4.1. Message Digests]].

## P

**Padding**
Việc đệm block cuối trước khi mã hoá, thực hiện khi gọi `doFinal`. Theo **PKCS #5**, block cuối được đệm bằng **giá trị bằng đúng số byte đệm**; nếu độ dài input chia hết cho block size thì **nối thêm một block đầy** rồi mã hoá. Xem [[05 - Encryption#10.5.1. Symmetric Ciphers]].

**PEM** (Privacy Enhanced Mail)
Định dạng certificate của OpenSSL, **không phải định dạng DER** mà keystore chấp nhận dễ dàng. Phải **xoá mọi thứ ngoài cặp marker `-----BEGIN CERTIFICATE-----` / `-----END CERTIFICATE-----`** trước khi import. Xem [[04 - Digital Signatures#10.4.6. Certificate Requests]].

**Permission**
**Bất kỳ thuộc tính nào được security manager kiểm tra.** Trong policy file có cấu trúc `permission className targetName, actionList;`. Permission **có thứ tự**: **permission tổng quát hơn imply permission cụ thể hơn**. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]] và [[02 - Security Managers and Permissions#10.2.3. Security Policy Files]].

**Platform Class Loader**
Class loader load **mọi class của Java platform mà bootstrap class loader không load**. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]].

**Policy File**
File chứa **chỉ dẫn ánh xạ code source sang permission**, gồm một dãy **grant entry**. Hai vị trí mặc định: `java.policy` trong home directory của Java platform, và `.java.policy` trong home directory của user. Chỉ định riêng bằng `-Djava.security.policy=...`; **dấu `==` khiến chỉ policy file đó được dùng**. Xem [[02 - Security Managers and Permissions#10.2.3. Security Policy Files]].

**Principal**
Object **mô tả một thuộc tính nào đó của subject**, như user name, group ID, hay role. **Principal chi phối permission** qua câu `grant principalClass "principalName"`. Xem [[03 - User Authentication#10.3.1. The JAAS Framework]].

**Protection Domain**
Object **đóng gói cả code source lẫn tập permission của một class**. Khi kiểm tra permission, `SecurityManager` **nhìn class của mọi method trên call stack** rồi hỏi từng protection domain — **mọi domain đồng ý thì mới qua**. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]].

**Public Key Cryptography**
Dựa trên khái niệm **public key và private key**: bạn công bố public key cho cả thế giới, **chỉ mình bạn giữ private key**. Hai key **khớp nhau bởi quan hệ toán học**, và **tính key này từ key kia là bất khả thi trên thực tế**. Xem [[04 - Digital Signatures#10.4.2. Message Signing]] và [[05 - Encryption#10.5.4. Public Key Ciphers]].

## R

**Resolving the Class**
Quá trình **load mọi class mà một class cho trước phụ thuộc vào**. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]].

**Role-Based Authentication**
Cách authentication **thiết yếu khi quản lý số lượng user lớn**: thay vì đưa tên mọi user hợp lệ vào policy file, login module **ánh xạ user sang role** như `"admin"` hay `"HR"`, và **permission dựa trên role**. Xem [[03 - User Authentication#10.3.2. JAAS Login Modules]].

**RSA**
Thuật toán public key **được dùng phổ biến nhất**, do **Rivest, Shamir và Adleman** phát minh. Dựa vào **độ khó của việc phân tích thừa số các số lớn**. Được bảo hộ bằng sáng chế **tới tháng 10 năm 2000**, nay thuộc **public domain**. Xem [[05 - Encryption#10.5.4. Public Key Ciphers]].

## S

**Sandbox**
Mô hình bảo mật của JDK 1.0: **class local có toàn quyền, class remote bị nhốt trong sandbox**, chỉ được vẽ lên màn hình và tương tác với người dùng. Cách tiếp cận **được ăn cả ngã về không**. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]].

**SecureRandom**
Class sinh số ngẫu nhiên **an toàn hơn nhiều so với `Random`**. `Random` seed bằng ngày giờ hiện tại **không đủ ngẫu nhiên** (nhiều nhất 864.000 seed mỗi ngày). Không seed thì `SecureRandom` **tự tính seed 20 byte bằng cách khởi động thread, cho ngủ, đo thời điểm thức dậy** — **thuật toán này chưa được biết là an toàn**. Xem [[05 - Encryption#10.5.2. Key Generation]].

**Security Manager**
**Cơ chế bảo mật thứ hai** của Java platform (sau bytecode verifier), **kiểm soát xem một thao tác cụ thể có được phép hay không**. **Mặc định ứng dụng Java không cài security manager nào.** Cài bằng `System.setSecurityManager(...)` hoặc option `-Djava.security.manager`. Xem [[02 - Security Managers and Permissions#10.2.1. Permission Checking]].

**Security Policy**
Ánh xạ **code source sang tập permission**. Từ Java 1.2 thay cho mô hình all-or-nothing của JDK 1.0/1.1. Xem [[02 - Security Managers and Permissions#10.2.2. Java Platform Security]].

**SHA-1** (Secure Hash Algorithm #1)
Thuật toán message digest do **NIST** phát triển, cô đặc dữ liệu thành **160 bit (20 byte)**. Chỉ có 2^160 vân tay nên **phải có va chạm**, nhưng **xác suất va chạm là không đáng kể**. Java hỗ trợ thêm **SHA-2 và SHA-3**. Xem [[04 - Digital Signatures#10.4.1. Message Digests]].

**Subject**
Cá nhân được một lần login authenticate. **Một subject có thể có nhiều principal.** Xem [[03 - User Authentication#10.3.1. The JAAS Framework]].

**Symmetric Cipher**
Cipher dùng **cùng một key cho cả mã hoá lẫn giải mã**, ví dụ DES và AES. **Gót chân Achilles là việc phân phối key.** Xem [[05 - Encryption#10.5.4. Public Key Ciphers]].

**System Class Loader**
Class loader load **application class từ module path và class path**. Đôi khi gọi là **application class loader**. Từ Java 9 **không còn là instance của `URLClassLoader`**. Xem [[01 - Class Loaders#10.1.1. The Class-Loading Process]].

## U

**URLClassLoader**
Class loader **load class từ các URL đã cho**; URL kết thúc bằng `/` là directory, ngược lại là file JAR. Dùng để load class plugin. Nếu constructor **không chỉ định parent** thì parent là **system class loader**. Xem [[01 - Class Loaders#10.1.2. The Class Loader Hierarchy]].

## W

**Wrap / Unwrap**
Mode của `Cipher` **mã hoá một key bằng một key khác**. Dùng khi kết hợp public key cipher với symmetric cipher: **AES key được wrap bằng RSA public key**, rồi **unwrap bằng RSA private key**. Xem [[05 - Encryption#10.5.1. Symmetric Ciphers]] và [[05 - Encryption#10.5.4. Public Key Ciphers]].

## X

**X.500**
Định dạng tên mà `keytool` dùng để **định danh chủ sở hữu key và bên phát hành certificate**. Thành phần: **CN** (Common Name), **OU** (Organizational Unit), **O** (Organization), **L** (Location), **ST** (State), **C** (Country). Xem [[04 - Digital Signatures#10.4.3. Verifying a Signature]].
