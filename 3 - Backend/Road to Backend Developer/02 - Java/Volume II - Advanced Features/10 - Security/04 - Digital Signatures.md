# 04 — Digital Signatures

> Chapter 10, Section 10.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.4. Digital Signatures

> *"As we said earlier, applets were what started the Java craze. In practice, people discovered that although they could write animated applets (like the famous "nervous text"), applets could not do a whole lot of useful stuff in the JDK 1.0 security model. For example, since applets under JDK 1.0 were so closely supervised, they couldn't do much good on a corporate intranet, even though relatively little risk attaches to executing an applet from your company's secure intranet. It quickly became clear to Sun that for applets to become truly useful, users need to be able to assign different levels of security, depending on where the applet originated. If an applet comes from a trusted supplier and has not been tampered with, the user of that applet can decide whether to give the applet more privileges."*

**Dịch:** Applet là thứ khởi đầu cơn sốt Java. Trên thực tế, người ta nhận ra applet **không làm được mấy việc hữu ích trong mô hình bảo mật của JDK 1.0**. Sun sớm thấy rõ rằng để applet thực sự hữu ích, người dùng phải **gán được các mức bảo mật khác nhau tuỳ theo applet có nguồn gốc từ đâu**. Nếu applet đến từ **nhà cung cấp đáng tin cậy** và **chưa bị can thiệp**, người dùng có thể quyết định **cấp thêm đặc quyền cho applet**.

> *"To give more trust to an applet, we need to know two things:"*
>
> *"• Where did the applet come from?"*
> *"• Was the code corrupted in transit?"*

**Dịch:** Để tin tưởng một applet hơn, ta cần biết **hai điều**: **applet đến từ đâu?** và **code có bị hỏng trên đường truyền không?**

> *"In the past 50 years, mathematicians and computer scientists have developed sophisticated algorithms for ensuring the integrity of data and for creating electronic signatures. The java.security package contains implementations of many of these algorithms. Fortunately, you don't need to understand the underlying mathematics to use the algorithms in the java.security package. In the next sections, we'll show you how message digests can detect changes in data files and how digital signatures can prove the identity of the signer."*

**Dịch:** Trong 50 năm qua, các nhà toán học và khoa học máy tính đã phát triển những thuật toán tinh vi để **đảm bảo tính toàn vẹn của dữ liệu** và **tạo chữ ký điện tử**. Package **`java.security`** chứa implementation của nhiều thuật toán đó. May thay, bạn **không cần hiểu toán học nền tảng** để dùng chúng. **Message digest phát hiện thay đổi trong data file**, còn **digital signature chứng minh danh tính người ký**.

---

## 10.4.1. Message Digests

> *"A message digest is a digital fingerprint of a block of data. For example, the so-called SHA-1 (Secure Hash Algorithm #1) condenses any data block, no matter how long, into a sequence of 160 bits (20 bytes). As with real fingerprints, one hopes that no two different messages have the same SHA-1 fingerprint. Of course, that cannot be true—there are only 2^160 SHA-1 fingerprints, so there must be some messages with the same fingerprint. But 2^160 is so large that the probability of a collision is negligible."*

**Dịch:** **Message digest là dấu vân tay số của một khối dữ liệu.** Ví dụ **SHA-1** (Secure Hash Algorithm #1) **cô đặc bất kỳ khối dữ liệu nào, dài bao nhiêu cũng được, thành một dãy 160 bit (20 byte)**. Như vân tay thật, ta hy vọng **không có hai message khác nhau nào có cùng vân tay SHA-1**. Dĩ nhiên điều đó **không thể đúng** — chỉ có **2^160 vân tay SHA-1**, nên **phải có những message trùng vân tay**. Nhưng 2^160 lớn tới mức **xác suất va chạm là không đáng kể**.

> *"How negligible? According to James Walsh in True Odds: How Risks Affect Your Everyday Life (Merritt Publishing, 1996), the chance that you will die from being struck by lightning is about one in 30,000. Now, think of nine other people—for example, your nine least favorite managers or professors. The chance that you and all of them will die from lightning strikes is higher than that of a forged message having the same SHA-1 fingerprint as the original. (Of course, more than ten people, none of whom you are likely to know, will die from lightning strikes. However, we are talking about the far slimmer chance that your particular choice of people will be wiped out.)"*

**Dịch:** Không đáng kể tới mức nào? Theo James Walsh trong *True Odds: How Risks Affect Your Everyday Life* (Merritt Publishing, 1996), **xác suất bạn chết vì sét đánh là khoảng 1 trên 30.000**. Giờ nghĩ tới chín người khác nữa. **Xác suất bạn và tất cả bọn họ đều chết vì sét đánh còn cao hơn xác suất một message giả mạo có cùng vân tay SHA-1 với bản gốc.**

> *"A message digest has two essential properties:"*
>
> *"• If one bit or several bits of the data are changed, the message digest also changes."*
> *"• A forger who is in possession of a given message cannot construct a fake message that has the same message digest as the original."*

**Dịch:** Message digest có **hai tính chất thiết yếu**:

| # | Tính chất |
|---|---|
| 1 | Nếu **một hoặc vài bit dữ liệu thay đổi** thì **message digest cũng thay đổi** |
| 2 | Kẻ giả mạo **đang giữ một message cho trước không dựng được message giả có cùng message digest với bản gốc** |

> *"The second property is, again, a matter of probabilities. Consider the following message by the billionaire father:"*
>
> *""Upon my death, my property shall be divided equally among my children; however, my son George shall receive nothing.""*
>
> *"That message (with a final newline) has an SHA-1 fingerprint of"*

```
12 5F 09 03 E7 31 30 19 2E A6 E7 E4 90 43 84 B4 38 99 8F 67
```

> *"The distrustful father has deposited the message with one attorney and the fingerprint with another. Now, suppose George bribes the lawyer holding the message. He wants to change the message so that Bill gets nothing. Of course, that changes the fingerprint to a completely different bit pattern:"*

```
7D F6 AB 08 EB 40 EC CD AB 74 ED E9 86 F9 ED 99 D1 45 B1 57
```

> *"Can George find some other wording that matches the fingerprint? If he had been the proud owner of a billion computers from the time the Earth was formed, each computing a million messages a second, he would not yet have found a message he could substitute."*

**Dịch:** Tính chất thứ hai lại là **chuyện xác suất**. Người cha đa nghi gửi message cho một luật sư và fingerprint cho một luật sư khác. Giả sử George hối lộ luật sư giữ message và **đổi message để Bill không được gì** — dĩ nhiên việc đó **đổi fingerprint thành một mẫu bit hoàn toàn khác**. George có tìm được cách diễn đạt khác khớp fingerprint không? **Nếu hắn sở hữu một tỷ máy tính từ thuở Trái Đất hình thành, mỗi máy tính một triệu message mỗi giây, thì tới giờ hắn vẫn chưa tìm ra một message để thay thế.**

> *"A number of algorithms have been designed to compute such message digests. Among them are SHA-1, the secure hash algorithm developed by the National Institute of Standards and Technology, and MD5, an algorithm invented by Ronald Rivest of MIT. Both algorithms scramble the bits of a message in ingenious ways. For details about these algorithms, see, for example, Cryptography and Network Security, Seventh Edition, by William Stallings (Prentice Hall, 2017). However, subtle regularities have been discovered in both algorithms, and NIST recommends to switch to stronger alternatives. Java supports the SHA-2 and SHA-3 sets of algorithms."*

**Dịch:** Nhiều thuật toán đã được thiết kế để tính message digest, trong đó có **SHA-1** (do NIST phát triển) và **MD5** (do Ronald Rivest ở MIT phát minh). Cả hai **xáo trộn bit của message theo những cách tài tình**. Tuy nhiên **người ta đã phát hiện những quy luật tinh vi trong cả hai thuật toán**, và **NIST khuyến nghị chuyển sang phương án mạnh hơn**. **Java hỗ trợ các bộ thuật toán SHA-2 và SHA-3.**

### Class `MessageDigest`

> *"The MessageDigest class is a factory for creating objects that encapsulate the fingerprinting algorithms. It has a static method, called getInstance, that returns an object of a class that extends the MessageDigest class. This means the MessageDigest class serves double duty:"*
>
> *"• As a factory class"*
> *"• As the superclass for all message digest algorithms"*

**Dịch:** Class `MessageDigest` là một **factory** tạo object đóng gói các thuật toán vân tay. Nó có static method **`getInstance`** trả về object của một class extend `MessageDigest`. Nghĩa là `MessageDigest` **gánh hai vai**: **factory class** và **superclass cho mọi thuật toán message digest**.

> *"For example, here is how you obtain an object that can compute SHA fingerprints:"*

```java
MessageDigest alg = MessageDigest.getInstance("SHA-1");
```

> *"After you have obtained a MessageDigest object, feed it all the bytes in the message by repeatedly calling the update method. For example, the following code passes all bytes in a file to the alg object just created to do the fingerprinting:"*

```java
InputStream in = . . .;
int ch;
while ((ch = in.read()) != -1)
    alg.update((byte) ch);
```

> *"Alternatively, if you have the bytes in an array, you can update the entire array at once:"*

```java
byte[] bytes = . . .;
alg.update(bytes);
```

> *"When you are done, call the digest method. This method pads the input as required by the fingerprinting algorithm, does the computation, and returns the digest as an array of bytes."*

```java
byte[] hash = alg.digest();
```

**Dịch:** Sau khi có object `MessageDigest`, **nạp cho nó toàn bộ byte của message bằng cách gọi `update` nhiều lần** (xem [[06 - Input and Output]]). Nếu byte nằm sẵn trong mảng thì **update cả mảng một lần**. Xong xuôi thì gọi **`digest`**: method này **đệm (pad) input theo yêu cầu của thuật toán vân tay, thực hiện tính toán, và trả về digest dưới dạng một mảng byte**.

> *"The program in Listing 10.16 computes a message digest. You can specify the file and algorithm on the command line:"*

```
java hash.Digest hash/input.txt SHA-1
```

> *"If you do not supply command-line arguments, you will be prompted for the file and algorithm name."*

**Dịch:** Nếu không cung cấp command-line argument, chương trình **sẽ hỏi tên file và tên thuật toán**.

### Listing 10.16 — `hash/Digest.java`

```java
package hash;

import java.io.*;
import java.nio.file.*;
import java.security.*;
import java.util.*;

/**
 * This program computes the message digest of a file.
 * @version 1.21 2018-04-10
 * @author Cay Horstmann
 */
public class Digest
{
    /**
     * @param args args[0] is the filename, args[1] is optionally the algorithm
     * (SHA-1, SHA-256, or MD5)
     */
    public static void main(String[] args) throws IOException, GeneralSecurityException
    {
        var in = new Scanner(System.in);
        String filename;
        if (args.length >= 1)
            filename = args[0];
        else
        {
            System.out.print("File name: ");
            filename = in.nextLine();
        }
        String algname;
        if (args.length >= 2)
            algname = args[1];
        else
        {
            System.out.println("Select one of the following algorithms: ");
            for (Provider p : Security.getProviders())
                for (Provider.Service s : p.getServices())
                    if (s.getType().equals("MessageDigest"))
                        System.out.println(s.getAlgorithm());
            System.out.print("Algorithm: ");
            algname = in.nextLine();
        }
        MessageDigest alg = MessageDigest.getInstance(algname);
        byte[] input = Files.readAllBytes(Paths.get(filename));
        byte[] hash = alg.digest(input);
        for (int i = 0; i < hash.length; i++)
            System.out.printf("%02X ", hash[i] & 0xFF);
        System.out.println();
    }
}
```

### API — `java.security.MessageDigest` 1.1

| Method | Mô tả |
|---|---|
| `static MessageDigest getInstance(String algorithmName)` | Trả về object `MessageDigest` implement thuật toán chỉ định. **Ném `NoSuchAlgorithmException`** nếu thuật toán không được cung cấp. |
| `void update(byte input)`<br>`void update(byte[] input)`<br>`void update(byte[] input, int offset, int len)` | Cập nhật digest bằng các byte chỉ định. |
| `byte[] digest()` | Hoàn tất việc tính hash, trả về digest đã tính, và **reset object thuật toán**. |
| `void reset()` | Reset digest. |

---

## 10.4.2. Message Signing

> *"In the last section, you saw how to compute a message digest—a fingerprint for the original message. If the message is altered, the fingerprint of the altered message will not match the fingerprint of the original. If the message and its fingerprint are delivered separately, the recipient can check whether the message has been tampered with. However, if both the message and the fingerprint were intercepted, it is an easy matter to modify the message and then recompute the fingerprint. After all, the message digest algorithms are publicly known, and they don't require secret keys. In that case, the recipient of the forged message and the recomputed fingerprint would never know that the message has been altered. Digital signatures solve this problem."*

**Dịch:** Nếu message và fingerprint **được gửi tách rời**, người nhận **kiểm tra được message có bị can thiệp không**. Nhưng nếu **cả message lẫn fingerprint đều bị chặn**, thì **sửa message rồi tính lại fingerprint là chuyện dễ** — vì **thuật toán message digest được công bố công khai và không cần secret key**. Khi đó người nhận **sẽ chẳng bao giờ biết message đã bị sửa**. **Digital signature giải quyết vấn đề này.**

### Public key cryptography

> *"To help you understand how digital signatures work, we'll explain a few concepts from the field called public key cryptography. Public key cryptography is based on the notion of a public key and private key. The idea is that you tell everyone in the world your public key. However, only you hold the private key, and it is important that you safeguard it and don't release it to anyone else. The keys are matched by mathematical relationships, though the exact nature of these relationships is not important to us."*

**Dịch:** **Public key cryptography dựa trên khái niệm public key và private key.** Ý tưởng: bạn **nói cho cả thế giới biết public key của mình**; nhưng **chỉ mình bạn giữ private key**, và **phải bảo vệ nó, không tiết lộ cho ai**. Hai key **khớp với nhau bởi các quan hệ toán học**.

> *"The keys are quite long and complex. For example, here is a matching pair of public and private Digital Signature Algorithm (DSA) keys."*

Public key:

```
p: fca682ce8e12caba26efccf7110e526db078b05edecbcd1eb4a208f3ae1617ae01f35b91a47e6df63413c5e12
ed0899bcd132acd50d99151bdc43ee737592e17
q: 962eddcc369cba8ebb260ee6b6a126d9346e38c5
g: 678471b27a9cf44ee91a49c5147db1a9aaf244f05a434d6486931d2d14271b9e35030b71fd73da179069b32e2
935630e1c2062354d0da20a6c416e50be794ca4
y: c0b6e67b4ac098eb1a32c5f8c4c1f0e7e6fb9d832532e27d0bdab9ca2d2a8123ce5a8018b8161a760480fadd0
40b927281ddb22cb9bc4df596d7de4d1b977d50
```

Private key:

```
p: fca682ce8e12caba26efccf7110e526db078b05edecbcd1eb4a208f3ae1617ae01f35b91a47e6df63413c5e12
ed0899bcd132acd50d99151bdc43ee737592e17
q: 962eddcc369cba8ebb260ee6b6a126d9346e38c5
g: 678471b27a9cf44ee91a49c5147db1a9aaf244f05a434d6486931d2d14271b9e35030b71fd73da179069b32e2
935630e1c2062354d0da20a6c416e50be794ca4
x: 146c09f881656cc6c51f27ea6c3a91b85ed1d70a
```

**Dịch:** Key **khá dài và phức tạp**. Trên là một cặp key **Digital Signature Algorithm (DSA)** khớp nhau.

> *"It is believed to be practically impossible to compute one key from the other. That is, even though everyone knows your public key, they can't, in your lifetime, compute your private key, no matter how many computing resources they have available."*

**Dịch:** Người ta tin rằng **tính key này từ key kia là bất khả thi trên thực tế**. Tức là dù ai cũng biết public key của bạn, họ **không thể tính ra private key của bạn trong đời bạn**, dù có bao nhiêu tài nguyên tính toán.

> *"It may be difficult to believe that the private key can't be computed from the public key—but nobody has found an algorithm to do this for the encryption algorithms in common use today. If the keys are sufficiently long, brute force—simply trying all possible keys—would require more computers than can be built from all the atoms in the solar system, crunching away for thousands of years. Of course it is possible that someone could come up with algorithms for computing keys that are much more clever than brute force. For example, the RSA algorithm (the encryption algorithm invented by Rivest, Shamir, and Adleman) depends on the difficulty of factoring large numbers. For the last 20 years, many of the best mathematicians have tried to come up with good factoring algorithms, but so far with no success. For that reason, most cryptographers believe that keys with a "modulus" of 2,000 bits or more are currently completely safe from any attack. DSA is believed to be similarly secure."*

**Dịch:** Nếu key **đủ dài**, **brute force** — thử mọi key có thể — sẽ cần **nhiều máy tính hơn số dựng được từ toàn bộ nguyên tử trong hệ mặt trời, chạy suốt hàng ngàn năm**. Thuật toán **RSA** (do Rivest, Shamir, Adleman phát minh) **dựa vào độ khó của việc phân tích thừa số các số lớn**. Suốt 20 năm qua nhiều nhà toán học giỏi nhất đã thử tìm thuật toán phân tích thừa số tốt nhưng **chưa thành công**. Vì thế **phần lớn nhà mật mã học tin rằng key có "modulus" từ 2.000 bit trở lên hiện hoàn toàn an toàn trước mọi tấn công**. **DSA được cho là an toàn tương tự.**

### Alice ký, Bob xác minh

> *"Suppose Alice wants to send Bob a message, and Bob wants to know this message came from Alice and not an impostor. Alice writes the message and signs the message digest with her private key. Bob gets a copy of her public key. Bob then applies the public key to verify the signature. If the verification passes, Bob can be assured of two facts:"*
>
> *"• The original message has not been altered."*
> *"• The message was signed by Alice, the holder of the private key that matches the public key that Bob used for verification."*

**Dịch:** Alice viết message và **ký message digest bằng private key của mình**. Bob lấy một bản public key của Alice, rồi **dùng public key để xác minh chữ ký**. Nếu xác minh qua, Bob **chắc chắn hai điều**: (1) **message gốc chưa bị sửa**; (2) **message được ký bởi Alice** — người giữ private key khớp với public key mà Bob dùng để xác minh.

**Figure 10.9: Public key signature exchange with DSA**

```
   ┌─────────────────────────────────────────────────────────────┐
   │  ┌──────────────────┐                                       │
   │  │     Message      │                                       │
   │  │  ──────────────  │ ╲                                     │
   │  │  ──────────────  │  ╲      ┌──────────────────┐          │
   │  │  ──────────────  │   ╲───▶ │       DSA        │          │
   │  └──────────────────┘   ╱     │     signing      │ ─────┐   │
   │  ┌──────────────────┐  ╱      │    algorithm     │      │   │
   │  │    Signature     │ ╱   ┌─▶ └──────────────────┘      │   │
   │  │  ──────────────  │     │                             │   │
   │  └──────────────────┘     │                             │   │
   │            ▲              │                             │   │
   │            │        ⚿ DSA private key                   │   │
   │            │                                            │   │
   │            │        ⚿ Public key                        │   │
   │            │              │                             │   │
   │            │              │    ┌──────────────────┐     │   │
   │            │              └──▶ │       DSA        │     │   │
   │            └──────────────────▶│   verification   │ ──▶ ✓   │
   │                                │    algorithm     │         │
   │                                └──────────────────┘         │
   └─────────────────────────────────────────────────────────────┘
```

*Hình in dùng biểu tượng chìa khoá cho private key và public key; message + signature được đưa vào cả signing algorithm lẫn verification algorithm, kết quả verification là dấu ✓.*

> *"You can see why the security of private keys is so important. If someone steals Alice's private key, or if a government can require her to turn it over, then she is in trouble. The thief or a government agent can now impersonate her by sending messages, such as money transfer instructions, that others will believe came from Alice."*

**Dịch:** Thấy rõ vì sao **an toàn của private key lại quan trọng đến vậy**. Nếu ai đó **trộm private key của Alice**, hoặc chính phủ **buộc cô giao nộp**, thì cô gặp rắc rối: kẻ trộm hoặc nhân viên chính phủ **giả mạo được cô** bằng cách gửi message — chẳng hạn **lệnh chuyển tiền** — mà người khác sẽ tin là của Alice.

---

## 10.4.3. Verifying a Signature

> *"The JDK comes with the keytool program, which is a command-line tool to generate and manage a set of certificates. We expect that ultimately the functionality of this tool will be embedded in other, more user-friendly programs. But right now, we'll use keytool to show how Alice can sign a document and send it to Bob, and how Bob can verify that the document really was signed by Alice and not an impostor."*

**Dịch:** JDK đi kèm chương trình **`keytool`** — công cụ dòng lệnh để **sinh và quản lý một tập certificate**.

> *"The keytool program manages keystores—databases of certificates and private/public key pairs. Each entry in the keystore has an alias. Here is how Alice creates a keystore, alice.certs, and generates a key pair with alias alice:"*

```
keytool -genkeypair -keystore alice.certs -alias alice
```

**Dịch:** `keytool` quản lý **keystore** — **cơ sở dữ liệu của certificate và các cặp private/public key**. **Mỗi entry trong keystore có một alias.**

> *"When creating or opening a keystore, you are prompted for a keystore password. For this example, just use secret. If you were to use the keytool-generated keystore for any serious purpose, you would need to choose a good password and safeguard this file."*

**Dịch:** Khi tạo hoặc mở keystore, bạn **được hỏi keystore password**. Ví dụ dùng `secret`. Nếu dùng keystore cho **mục đích nghiêm túc**, bạn phải **chọn password tốt và bảo vệ file này**.

> *"When generating a key, you are prompted for the following information:"*

```
Enter keystore password: secret
Reenter new password: secret
What is your first and last name?
  [Unknown]: Alice Lee
What is the name of your organizational unit?
  [Unknown]: Engineering
What is the name of your organization?
  [Unknown]: ACME Software
What is the name of your City or Locality?
  [Unknown]: San Francisco
What is the name of your State or Province?
  [Unknown]: CA
What is the two-letter country code for this unit?
  [Unknown]: US
Is <CN=Alice Lee, OU=Engineering, O=ACME Software, L=San Francisco, ST=CA, C=US> correct?
  [no]: yes
```

> *"The keytool uses names in the X.500 format, whose components are Common Name (CN), Organizational Unit (OU), Organization (O), Location (L), State (ST), and Country (C), to identify key owners and certificate issuers."*

**Dịch:** `keytool` dùng **tên theo định dạng X.500** để định danh chủ sở hữu key và bên phát hành certificate:

| Thành phần | Nghĩa |
|---|---|
| `CN` | Common Name |
| `OU` | Organizational Unit |
| `O` | Organization |
| `L` | Location |
| `ST` | State |
| `C` | Country |

> *"Finally, specify a key password, or press Enter to use the keystore password as the key password."*

**Dịch:** Cuối cùng, chỉ định một **key password**, hoặc nhấn Enter để **dùng keystore password làm key password**.

### Export và import certificate

> *"Suppose Alice wants to give her public key to Bob. She needs to export a certificate file:"*

```
keytool -exportcert -keystore alice.certs -alias alice -file alice.cer
```

> *"Now Alice can send the certificate to Bob. When Bob receives the certificate, he can print it:"*

```
keytool -printcert -file alice.cer
```

> *"The printout looks like this:"*

```
Owner: CN=Alice Lee, OU=Engineering, O=ACME Software, L=San Francisco, ST=CA, C=US
Issuer: CN=Alice Lee, OU=Engineering, O=ACME Software, L=San Francisco, ST=CA, C=US
Serial number: 470835ce
Valid from: Sat Oct 06 18:26:38 PDT 2007 until: Fri Jan 04 17:26:38 PST 2008
Certificate fingerprints:
    MD5: BC:18:15:27:85:69:48:B1:5A:C3:0B:1C:C6:11:B7:81
    SHA1: 31:0A:A0:B8:C2:8B:3B:B6:85:7C:EF:C0:57:E5:94:95:61:47:6D:34
Signature algorithm name: SHA1withDSA
Version: 3
```

> *"If Bob wants to check that he got the right certificate, he can call Alice and verify the certificate fingerprint over the phone."*

**Dịch:** Nếu Bob muốn kiểm tra mình nhận đúng certificate, anh ta **gọi điện cho Alice và xác minh certificate fingerprint qua điện thoại**.

> **Note (sách):** *"Some certificate issuers publish certificate fingerprints on their web sites. For example, to check the DigiCert certificate in the keystore jre/lib/security/cacerts directory, use the -list option:"*
>
> ```
> keytool -list -v -keystore jre/lib/security/cacerts
> ```
>
> *"The password for this keystore is changeit. One of the certificates in this keystore is"*
>
> ```
> Owner: CN=DigiCert Assured ID Root G3, OU=www.digicert.com, O=DigiCert Inc, C=US
> Issuer: CN=DigiCert Assured ID Root G3, OU=www.digicert.com, O=DigiCert Inc, C=US
> Serial number: ba15afa1ddfa0b54944afcd24a06cec
> Valid from: Thu Aug 01 14:00:00 CEST 2013 until: Fri Jan 15 13:00:00 CET 2038
> Certificate fingerprints:
>     SHA1: F5:17:A2:4F:9A:48:C6:C9:F8:A2:00:26:9F:DC:0F:48:2C:AB:30:89
>     SHA256: 7E:37:CB:8B:4C:47:09:0C:AB:36:55:1B:A6:F4:5D:B8:40:68:0F:BA:
>             16:6A:95:2D:B1:00:71:7F:43:05:3F:C2
> ```
>
> *"You can check that your certificate is valid by visiting the web site www.digicert.com/digicert-root-certificates.htm."*
>
> **Dịch:** Một số bên phát hành certificate **công bố certificate fingerprint trên website của họ**. Password của keystore `cacerts` là **`changeit`**.

> *"Once Bob trusts the certificate, he can import it into his keystore."*

```
keytool -importcert -keystore bob.certs -alias alice -file alice.cer
```

> **Caution (sách):** *"Never import into a keystore a certificate that you don't fully trust. Once a certificate is added to the keystore, any program that uses the keystore assumes that the certificate can be used to verify signatures."*
>
> **Dịch:** **Đừng bao giờ import vào keystore một certificate mà bạn không hoàn toàn tin tưởng.** Khi certificate đã được thêm vào keystore, **mọi chương trình dùng keystore đó đều mặc định rằng certificate ấy dùng được để xác minh chữ ký**.

### `jarsigner`

> *"Now Alice can start sending signed documents to Bob. The jarsigner tool signs and verifies JAR files. Alice simply adds the document to be signed into a JAR file."*

```
jar cvf document.jar document.txt
```

> *"She then uses the jarsigner tool to add the signature to the file. She needs to specify the keystore, the JAR file, and the alias of the key to use."*

```
jarsigner -keystore alice.certs document.jar alice
```

> *"When Bob receives the file, he uses the -verify option of the jarsigner program."*

```
jarsigner -verify -keystore bob.certs document.jar
```

> *"Bob does not need to specify the key alias. The jarsigner program finds the X.500 name of the key owner in the digital signature and looks for a matching certificate in the keystore."*

> *"If the JAR file is not corrupted and the signature matches, the jarsigner program prints"*

```
jar verified.
```

> *"Otherwise, the program displays an error message."*

**Dịch:** Công cụ **`jarsigner`** ký và xác minh **file JAR** (xem [[09 - JAR Files]]). Bob **không cần chỉ định key alias**: `jarsigner` **tìm tên X.500 của chủ key trong digital signature rồi tìm certificate khớp trong keystore**. Nếu file JAR **không bị hỏng và chữ ký khớp**, chương trình in `jar verified.`

---

## 10.4.4. The Authentication Problem

> *"Suppose you get a message from your friend Alice, signed with her private key, using the method we just showed you. You might already have her public key, or you can easily get it by asking her for a copy or by getting it from her web page. Then, you can verify that the message was in fact authored by Alice and has not been tampered with. Now, suppose you get a message from a stranger who claims to represent a famous software company, urging you to run a program attached to the message. The stranger even sends you a copy of his public key so you can verify that he authored the message. You check that the signature is valid. This proves that the message was signed with the matching private key and has not been corrupted."*

> *"Be careful: You still have no idea who wrote the message. Anyone can generate a pair of public and private keys, sign the message with the private key, and send the signed message and the public key to you. The problem of determining the identity of the sender is called the authentication problem."*

**Dịch:** Giả sử bạn nhận message từ một **người lạ tự nhận đại diện một công ty phần mềm nổi tiếng**, giục bạn chạy chương trình đính kèm. Người lạ còn gửi kèm public key để bạn xác minh. Bạn kiểm tra thấy chữ ký hợp lệ — điều này **chứng minh message được ký bằng private key khớp và chưa bị hỏng**.

**Cẩn thận:** bạn **vẫn không biết ai viết message**. **Ai cũng sinh được một cặp public/private key**, ký message bằng private key, rồi gửi cả message đã ký lẫn public key cho bạn. Vấn đề **xác định danh tính người gửi** gọi là **authentication problem**.

> *"The usual way to solve the authentication problem is simple. Suppose the stranger and you have a common acquaintance you both trust. Suppose the stranger meets your acquaintance in person and hands over a disk with the public key. Your acquaintance later meets you, assures you that he met the stranger and that the stranger indeed works for the famous software company, and then gives you the disk (see Figure 10.10). That way, your acquaintance vouches for the authenticity of the stranger."*

**Dịch:** Cách giải quyết thông thường **rất đơn giản**: giả sử bạn và người lạ **có một người quen chung mà cả hai đều tin**. Người lạ **gặp trực tiếp người quen đó** và trao đĩa chứa public key. Người quen sau đó gặp bạn, **đảm bảo rằng anh ta đã gặp người lạ và người lạ đúng là làm cho công ty phần mềm nổi tiếng kia**, rồi đưa đĩa cho bạn. Như vậy **người quen bảo lãnh cho tính xác thực của người lạ**.

**Figure 10.10: Authentication through a trusted intermediary**

```
                Private key                Public key file
                    ⚿                    ┌──────────────┐
     ☺                        Trusted    │      ⚿       │            ☺
   Stranger        ⚿      ═══ channel ══▶└──────────────┘         Friend
                Public key                       │
                                                 │  Trusted
                                                 │  channel
                                                 ▼
                                         ┌──────────────┐
                              ☺          │      ⚿       │
                             You         └──────────────┘
```

> *"In fact, your acquaintance does not actually need to meet you. Instead, he can use his private key to sign the stranger's public key file (see Figure 10.11). When you get the public key file, you verify the signature of your friend, and because you trust him, you are confident that he did check the stranger's credentials before applying his signature."*

**Dịch:** Thực ra người quen **không cần gặp bạn**: anh ta **dùng private key của mình ký file public key của người lạ**. Khi nhận file public key, bạn **xác minh chữ ký của bạn mình**, và vì tin anh ta nên **yên tâm rằng anh ta đã kiểm tra giấy tờ của người lạ trước khi ký**.

**Figure 10.11: Authentication through a trusted intermediary's signature**

```
              Private key                  Key file          Private key
                  ⚿                    ┌──────────────┐          ⚿
    ☺                       Trusted    │      ⚿       │                    ☺
 Stranger         ⚿     ═══ channel ══▶└──────────────┘          ⚿      Friend
              Public key                       │              Public key
                                               ▼                  ║
                                        ┌──────────────┐          ║
                                        │     Sign     │◀═════════╝
                                        └──────────────┘        Trusted
                                               │                channel
                        Signed key file        ▼                    ║
                                        ┌──────────────┐            ║
                                        │      ⚿       │            ║
                                        ├──────────────┤            ║
                                        │      ⚿       │            ║
                                        └──────────────┘            ║
                                               │                    ║
                                               ▼                    ║
                                        ┌──────────────┐            ║
                                        │    Verify    │◀═══════════╝
                                        └──────────────┘
                                            ☺      │
                                           You     ▼
                                                   ✓
```

> *"However, you might not have a common acquaintance. Some trust models assume that there is always a "chain of trust"—a chain of mutual acquaintances—so that you trust every member of that chain. In practice, of course, that isn't always true. You might trust your friend, Alice, and you know that Alice trusts Bob, but you don't know Bob and aren't sure that you trust him."*

**Dịch:** Nhưng bạn **có thể không có người quen chung**. Một số **mô hình tin cậy** giả định luôn có một **"chain of trust"** — chuỗi người quen lẫn nhau — để bạn tin mọi mắt xích. Thực tế **không phải lúc nào cũng vậy**: bạn tin Alice, biết Alice tin Bob, nhưng **bạn không quen Bob và không chắc mình tin anh ta**.

> *"Other trust models assume that there is a benevolent big brother—a company in which we all trust. Companies with confidence-inspiring names such as DigiCert, GlobalSign, and Entrust provide verification services."*

**Dịch:** Mô hình tin cậy khác giả định có một **"ông anh cả nhân từ"** — một công ty mà tất cả chúng ta đều tin. Các công ty với **cái tên gợi sự tin cậy** như DigiCert, GlobalSign, Entrust cung cấp **dịch vụ xác minh**.

> *"You will often encounter digital signatures signed by one or more entities who will vouch for the authenticity, and you will need to evaluate to what degree you trust the authenticators. You might place a great deal of trust in a particular certificate authority, perhaps because you saw their logo on many web pages or because you heard that they require multiple people with black attaché cases to come together into a secure chamber whenever new master keys are to be minted."*

**Dịch:** Bạn sẽ thường gặp digital signature được **một hoặc nhiều thực thể ký để bảo lãnh tính xác thực**, và bạn **phải tự đánh giá mức độ tin tưởng dành cho những bên xác thực đó**.

> *"However, you should have realistic expectations about what is actually being authenticated. You can get a "class 1" ID simply by filling out a web form and paying a small fee. The key is mailed to the e-mail address included in the certificate. Thus, you can be reasonably assured that the e-mail address is genuine, but the requestor could have filled in any name and organization. There are more stringent classes of IDs. For example, with a "class 3" ID, the certificate authority will require an individual requestor to appear before a notary public, and it will check the financial rating of a corporate requestor. Other authenticators will have different procedures. Thus, when you receive an authenticated message, it is important that you understand what, in fact, is being authenticated."*

**Dịch:** Bạn nên có **kỳ vọng thực tế về thứ đang thực sự được xác thực**. **ID "class 1"** lấy được chỉ bằng cách **điền form web và trả một khoản phí nhỏ**; key được gửi tới địa chỉ e-mail ghi trong certificate. Vậy bạn **khá chắc địa chỉ e-mail là thật**, nhưng **người yêu cầu có thể đã điền tên và tổ chức bất kỳ**. Có những **hạng ID chặt chẽ hơn**: với **ID "class 3"**, certificate authority **yêu cầu cá nhân xin cấp phải ra trình diện trước công chứng viên**, và **kiểm tra xếp hạng tài chính** nếu bên xin cấp là doanh nghiệp. Vậy nên khi nhận một message đã xác thực, **quan trọng là hiểu rõ thứ gì thực sự đang được xác thực**.

---

## 10.4.5. Certificate Signing

> *"In Section 10.4.3, "Verifying a Signature," on p. 589 you saw how Alice used a self-signed certificate to distribute a public key to Bob. However, Bob needed to ensure that the certificate was valid by verifying the fingerprint with Alice."*

**Dịch:** Ở [[#10.4.3. Verifying a Signature]], Alice dùng một **self-signed certificate** để phân phối public key cho Bob. Nhưng Bob **phải đảm bảo certificate hợp lệ bằng cách xác minh fingerprint với Alice**.

> *"Suppose Alice wants to send her colleague Cindy a signed message, but Cindy doesn't want to bother with verifying lots of signature fingerprints. Now suppose there is an entity that Cindy trusts to verify signatures. In this example, Cindy trusts the Information Resources Department at ACME Software."*

> *"That department operates a certificate authority (CA). Everyone at ACME has the CA's public key in their keystore, installed by a system administrator who carefully checked the key fingerprint. The CA signs the keys of ACME employees. When they install each other's keys, the keystore will trust them implicitly because they are signed by a trusted key."*

**Dịch:** Phòng Information Resources ở ACME Software vận hành một **certificate authority (CA)**. **Mọi người ở ACME đều có public key của CA trong keystore**, do system administrator cài đặt sau khi **kiểm tra kỹ key fingerprint**. **CA ký key của nhân viên ACME.** Khi họ cài key của nhau, keystore **tin tưởng ngầm định** vì **các key đó được ký bởi một key đáng tin cậy**.

> *"Here is how you can simulate this process. Create a keystore acmesoft.certs. Generate a key pair and export the public key:"*

```
keytool -genkeypair -keystore acmesoft.certs -alias acmeroot
keytool -exportcert -keystore acmesoft.certs -alias acmeroot -file acmeroot.cer
```

> *"The public key is exported into a "self-signed" certificate. Then, add it to every employee's keystore:"*

```
keytool -importcert -keystore cindy.certs -alias acmeroot -file acmeroot.cer
```

**Dịch:** Public key được export ra một certificate **"self-signed"**. Sau đó **thêm nó vào keystore của mọi nhân viên**.

> *"For Alice to send messages to Cindy and to everyone else at ACME Software, she needs to bring her certificate to the Information Resources Department and have it signed. Unfortunately, this functionality is missing in the keytool program. In the book's companion code, we supply a CertificateSigner class to fill the gap. An authorized staff member at ACME Software would verify Alice's identity and generate a signed certificate as follows:"*

```
java CertificateSigner -keystore acmesoft.certs -alias acmeroot \
    -infile alice.cer -outfile alice_signedby_acmeroot.cer
```

> *"The certificate signer program must have access to the ACME Software keystore, and the staff member must know the keystore password. Clearly, this is a sensitive operation."*

**Dịch:** Để Alice gửi message cho Cindy và mọi người ở ACME, cô **phải mang certificate của mình tới phòng Information Resources để được ký**. Đáng tiếc **`keytool` thiếu chức năng này**, nên sách cung cấp class `CertificateSigner` để lấp chỗ trống. Chương trình ký certificate **phải truy cập được keystore của ACME Software**, và nhân viên **phải biết keystore password** — rõ ràng đây là **thao tác nhạy cảm**.

> *"Alice gives the file alice_signedby_acmeroot.cer to Cindy and to anyone else in ACME Software. Alternatively, ACME Software can simply store the file in a company directory. Remember, this file contains Alice's public key and an assertion by ACME Software that this key really belongs to Alice."*

**Dịch:** File này chứa **public key của Alice** cùng **lời khẳng định của ACME Software rằng key này thực sự thuộc về Alice**.

> *"Now Cindy imports the signed certificate into her keystore:"*

```
keytool -importcert -keystore cindy.certs -alias alice -file alice_signedby_acmeroot.cer
```

> *"The keystore verifies that the key was signed by a trusted root key that is already present in the keystore. Cindy is not asked to verify the certificate fingerprint."*

> *"Once Cindy has added the root certificate and the certificates of the people who regularly send her documents, she never has to worry about the keystore again."*

**Dịch:** Keystore **xác minh rằng key được ký bởi một trusted root key đã có sẵn trong keystore**. **Cindy không bị hỏi xác minh certificate fingerprint.** Sau khi đã thêm root certificate và certificate của những người thường gửi tài liệu cho mình, **Cindy không phải lo về keystore nữa**.

---

## 10.4.6. Certificate Requests

> *"In the preceding section, we simulated a CA with a keystore and the CertificateSigner tool. However, most CAs run more sophisticated software to manage certificates, and they use slightly different formats for certificates. This section shows the added steps required to interact with those software packages."*

**Dịch:** Phần lớn CA **chạy phần mềm tinh vi hơn để quản lý certificate**, và dùng **định dạng certificate hơi khác**.

> *"We will use the OpenSSL software package as an example. The software is preinstalled on many Linux systems and Mac OS X, and a Cygwin port for Windows is also available. You can download the software at www.openssl.org."*

> *"To create a CA, run the CA script. The exact location depends on your operating system. On Ubuntu, run"*

```
/usr/lib/ssl/misc/CA.pl -newca
```

> *"This script creates a subdirectory called demoCA in the current directory. The directory contains a root key pair and storage for certificates and certificate revocation lists."*

**Dịch:** Script này tạo subdirectory **`demoCA`** trong thư mục hiện tại, chứa **một root key pair** và **kho lưu certificate cùng certificate revocation list**.

> *"You will want to import the public key into the Java keystores of all employees, but it is in the Privacy Enhanced Mail (PEM) format, not the DER format that the keystore accepts easily. Copy the file demoCA/cacert.pem to a file acmeroot.pem and open that file in a text editor. Remove everything before the line"*

```
-----BEGIN CERTIFICATE-----
```

> *"and after the line"*

```
-----END CERTIFICATE-----
```

> *"Now you can import acmeroot.pem into each keystore in the usual way:"*

```
keytool -importcert -keystore cindy.certs -alias alice -file acmeroot.pem
```

> *"It seems quite incredible that the keytool cannot carry out this editing operation itself."*

**Dịch:** Public key ở **định dạng Privacy Enhanced Mail (PEM)**, **không phải định dạng DER** mà keystore chấp nhận dễ dàng. Phải **xoá mọi thứ trước dòng `-----BEGIN CERTIFICATE-----` và sau dòng `-----END CERTIFICATE-----`**. Sách nhận xét: **khá khó tin là `keytool` không tự làm nổi thao tác chỉnh sửa này**.

> *"To sign Alice's public key, start by generating a certificate request that contains the certificate in the PEM format:"*

```
keytool -certreq -keystore alice.store -alias alice -file alice.pem
```

> *"To sign the certificate, run"*

```
openssl ca -in alice.pem -out alice_signedby_acmeroot.pem
```

> *"As before, cut out everything outside the BEGIN CERTIFICATE/END CERTIFICATE markers from alice_signedby_acmeroot.pem. Then import it into the keystore:"*

```
keytool -importcert -keystore cindy.certs -alias alice -file alice_signedby_acmeroot.pem
```

> *"You can use the same steps to have a certificate signed with a key that is issued by a certificate authority."*

**Dịch:** Để ký public key của Alice, **bắt đầu bằng việc sinh một certificate request** chứa certificate ở định dạng PEM. **Cùng các bước đó dùng được để có một certificate được ký bằng key do certificate authority phát hành.**

---

## 10.4.7. Code Signing

> *"A common use of authentication technology is signing executable programs. If you download a program, you are naturally concerned about the damage it can do. For example, the program could have been infected by a virus. If you know where the code comes from and that it has not been tampered with since it left its origin, your comfort level will be a lot higher than without this knowledge."*

**Dịch:** Một ứng dụng phổ biến của công nghệ authentication là **ký các chương trình thực thi**. Nếu bạn **biết code đến từ đâu** và **biết nó chưa bị can thiệp kể từ khi rời nguồn gốc**, bạn sẽ **yên tâm hơn nhiều**.

> *"In this section, we'll show you how to sign JAR files, and how you can configure Java to verify the signature. This capability was designed for applets and Java Web Start applications. These are no longer commonly used technologies, but you may still need to support them in legacy products."*

**Dịch:** Khả năng này **được thiết kế cho applet và ứng dụng Java Web Start**. Đây **không còn là công nghệ được dùng phổ biến**, nhưng bạn **có thể vẫn phải hỗ trợ chúng trong sản phẩm legacy**.

> *"When Java was first released, applets ran in the "sandbox," with limited permissions, as soon as they were loaded. If users wanted to use applets that can access the local file system, make network connections, and so on, they had to explicitly agree. To ensure that the applet code was not tampered with in transit, it had to be digitally signed."*

**Dịch:** Khi Java mới ra mắt, applet chạy trong **"sandbox"** với permission hạn chế ngay khi được load. Muốn dùng applet truy cập được local file system, mở network connection v.v., người dùng **phải đồng ý tường minh**. Để đảm bảo code applet **không bị can thiệp trên đường truyền**, nó **phải được ký số**.

> *"Here is a specific example. Suppose that while surfing the Internet, you encounter a web site that offers to run an applet from an unfamiliar vendor, provided you grant it the permission to do so (see Figure 10.12). Such a program is signed with a software developer certificate issued by a certificate authority that the Java runtime trusts. The pop-up dialog box identifies the software developer and the certificate issuer. Now you need to decide whether to authorize the program."*

**Dịch:** Chương trình như vậy được ký bằng **software developer certificate** do một certificate authority mà **Java runtime tin tưởng** phát hành. Hộp thoại pop-up **cho biết nhà phát triển phần mềm và bên phát hành certificate**.

> *"What facts do you have at your disposal that might influence your decision? Here is what you know:"*
>
> *"• Thawte sold a certificate to the software developer."*
> *"• The program really was signed with that certificate, and it hasn't been modified in transit."*
> *"• That certificate really was signed by Thawte—it was verified by the public key in the local cacerts file."*

**Dịch:** Những gì bạn biết:

| # | Sự thật |
|---|---|
| 1 | Thawte **đã bán một certificate** cho nhà phát triển phần mềm |
| 2 | Chương trình **thực sự được ký bằng certificate đó**, và **chưa bị sửa trên đường truyền** |
| 3 | Certificate đó **thực sự được Thawte ký** — được xác minh bằng public key trong file `cacerts` local |

> *"Of course, none of this tells you whether the code is safe to run. Can you trust a vendor if all you know is the vendor's name and the fact that Thawte sold them a software developer certificate? This approach never made much sense."*

**Dịch:** Dĩ nhiên **không điều nào trong số đó cho bạn biết code có an toàn để chạy hay không**. Bạn tin được một nhà cung cấp nếu tất cả những gì bạn biết là **tên của họ** và **việc Thawte đã bán cho họ một software developer certificate**? Sách nhận xét: **cách tiếp cận này chưa bao giờ thực sự hợp lý**.

> *"For intranet deployment, certificates are more plausible. Administrators can install policy files and certificates on local machines so that no user interaction is required for launching trusted code. Whenever the Java plug-in tool loads signed code, it consults the policy file for the permissions and the keystore for signatures."*

**Dịch:** Với **triển khai nội bộ (intranet)**, certificate **hợp lý hơn**: administrator **cài policy file và certificate lên máy local** để **không cần người dùng tương tác** khi khởi chạy trusted code. Mỗi khi Java plug-in load signed code, nó **tra policy file để lấy permission và tra keystore để lấy chữ ký**.

### Ví dụ trong sách: ACME Software

> *"Suppose ACME Software wants its employees to run certain programs that require local file access, and it wants to deploy these programs through a browser as Web Start applications."*

> *"As you saw earlier in this chapter, ACME could identify the programs by their code base. But that means ACME would need to update the policy files each time the programs are moved to a different web server. Instead, ACME decides to sign the JAR files that contain the program code."*

**Dịch:** ACME **có thể định danh chương trình bằng code base** (xem [[02 - Security Managers and Permissions#10.2.3. Security Policy Files]]). Nhưng như thế ACME **phải cập nhật policy file mỗi lần chương trình chuyển sang web server khác**. Thay vào đó, ACME quyết định **ký các file JAR chứa code chương trình**.

> *"First, ACME generates a root certificate:"*

```
keytool -genkeypair -keystore acmesoft.certs -alias acmeroot
```

> *"Of course, the keystore containing the private root key must be kept in a safe place. Therefore, we create a second keystore client.certs for the public certificates and add the public acmeroot certificate into it."*

```
keytool -exportcert -keystore acmesoft.certs -alias acmeroot -file acmeroot.cer
keytool -importcert -keystore client.certs -alias acmeroot -file acmeroot.cer
```

**Dịch:** Keystore chứa **private root key phải được cất ở nơi an toàn**. Vì thế tạo **keystore thứ hai `client.certs`** cho các public certificate.

> *"A trusted person at ACME runs the jarsigner tool to sign any application that they wish to sign, specifying the JAR file and the alias of the private key:"*

```
jarsigner -keystore acmesoft.certs ACMEApp.jar acmeroot
```

> *"The signed Web Start application is now ready to be deployed on a web server."*

### Cấu hình máy client

> *"Next, let us turn to the client machine configuration. A policy file must be distributed to each client machine."*

> *"To reference a keystore, a policy file starts with the line"*

```
keystore "keystoreURL", "keystoreType";
```

> *"The URL can be absolute or relative. Relative URLs are relative to the location of the policy file. The type is JKS if the keystore was generated by keytool. For example,"*

```
keystore "client.certs", "JKS";
```

**Dịch:** **Một policy file phải được phân phối tới từng máy client.** Để tham chiếu một keystore, policy file **bắt đầu bằng dòng `keystore`**. URL **tuyệt đối hoặc tương đối** đều được; URL tương đối tính theo **vị trí của policy file**. **Type là `JKS`** nếu keystore được sinh bởi `keytool`.

> *"Then grant clauses can have suffixes signedBy "alias", such as this one:"*

```
grant signedBy "acmeroot"
{
    . . .
};
```

> *"Any signed code that can be verified with the public key associated with the alias is now granted the permissions inside the grant clause."*

**Dịch:** Mệnh đề `grant` có thể mang **hậu tố `signedBy "alias"`**. **Mọi signed code xác minh được bằng public key gắn với alias đó nay được cấp các permission bên trong mệnh đề `grant`.**

---

## Bài kế tiếp

→ [[05 - Encryption]] — symmetric cipher, key generation, cipher stream, public key cipher.
