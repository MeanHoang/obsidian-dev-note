# 05 — Encryption

> Chapter 10, Section 10.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 10.5. Encryption

> *"So far, we have discussed one important cryptographic technique implemented in the Java security API—namely, authentication through digital signatures. A second important aspect of security is encryption. Even when authenticated, the information itself is plainly visible. The digital signature merely verifies that the information has not been changed. In contrast, when information is encrypted, it is not visible. It can only be decrypted with a matching key."*

**Dịch:** Tới đây ta đã bàn một kỹ thuật mật mã quan trọng trong Java security API: **authentication qua digital signature** (xem [[04 - Digital Signatures]]). Khía cạnh quan trọng thứ hai của bảo mật là **encryption**. Ngay cả khi đã được authenticate, **bản thân thông tin vẫn hiện rõ**; digital signature **chỉ xác minh rằng thông tin chưa bị thay đổi**. Ngược lại, khi thông tin **được mã hoá thì nó không nhìn thấy được**, và **chỉ giải mã được bằng một key khớp**.

> *"Authentication is sufficient for code signing—there is no need to hide the code. However, encryption is necessary when applets or applications transfer confidential information, such as credit card numbers and other personal data."*

**Dịch:** **Authentication là đủ cho code signing** — không cần giấu code. Nhưng **encryption là cần thiết khi applet hoặc application truyền thông tin bí mật**, chẳng hạn **số thẻ tín dụng và dữ liệu cá nhân khác**.

> *"In the past, patents and export controls prevented many companies from offering strong encryption. Fortunately, export controls are now much less stringent, and the patents for important algorithms have expired. Nowadays, Java provides excellent encryption support as a part of the standard library."*

**Dịch:** Trước đây **bằng sáng chế và kiểm soát xuất khẩu** ngăn nhiều công ty cung cấp mã hoá mạnh. May thay, **kiểm soát xuất khẩu nay đã bớt ngặt nghèo**, và **bằng sáng chế của các thuật toán quan trọng đã hết hạn**. Ngày nay Java **hỗ trợ encryption rất tốt ngay trong standard library**.

---

## 10.5.1. Symmetric Ciphers

> *"The Java cryptographic extensions contain a class Cipher that is the superclass of all encryption algorithms. To get a cipher object, call the getInstance method:"*

```java
Cipher cipher = Cipher.getInstance(algorithmName);
```

> *"or"*

```java
Cipher cipher = Cipher.getInstance(algorithmName, providerName);
```

**Dịch:** Java cryptographic extensions chứa class **`Cipher`** — **superclass của mọi thuật toán mã hoá**. Để lấy một cipher object, gọi method **`getInstance`**.

> *"The JDK comes with ciphers by the provider named "SunJCE". It is the default provider used if you don't specify another provider name. You might want another provider if you need specialized algorithms that Oracle does not support."*

**Dịch:** JDK đi kèm các cipher của provider tên **`"SunJCE"`** — **provider mặc định** nếu bạn không chỉ định tên provider khác. Bạn có thể cần provider khác nếu **cần thuật toán chuyên biệt mà Oracle không hỗ trợ**.

> *"The algorithm name is a string such as "AES" or "DES/CBC/PKCS5Padding". The Data Encryption Standard (DES) is a venerable block cipher with a key length of 56 bits. Nowadays, the DES algorithm is considered obsolete because it can be cracked with brute force. A far better alternative is its successor, the Advanced Encryption Standard (AES). See https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf for a detailed description of the AES algorithm. We use AES for our example."*

**Dịch:** Tên thuật toán là một chuỗi như `"AES"` hoặc `"DES/CBC/PKCS5Padding"`. **Data Encryption Standard (DES)** là một **block cipher lâu đời với key dài 56 bit**. Ngày nay **DES bị coi là lỗi thời vì bẻ được bằng brute force**. Phương án **tốt hơn nhiều là kẻ kế nhiệm của nó — Advanced Encryption Standard (AES)**.

### Khởi tạo cipher

> *"Once you have a cipher object, initialize it by setting the mode and the key:"*

```java
int mode = . . .;
Key key = . . .;
cipher.init(mode, key);
```

> *"The mode is one of"*

```
Cipher.ENCRYPT_MODE
Cipher.DECRYPT_MODE
Cipher.WRAP_MODE
Cipher.UNWRAP_MODE
```

> *"The wrap and unwrap modes encrypt one key with another—see the next section for an example."*

**Dịch:** Sau khi có cipher object, **khởi tạo nó bằng cách đặt mode và key**. Mode **`WRAP`** và **`UNWRAP`** **mã hoá một key bằng một key khác**.

| Mode | Ý nghĩa |
|---|---|
| `Cipher.ENCRYPT_MODE` | Mã hoá |
| `Cipher.DECRYPT_MODE` | Giải mã |
| `Cipher.WRAP_MODE` | Mã hoá một key bằng key khác |
| `Cipher.UNWRAP_MODE` | Giải mã một key đã wrap |

> *"Now you can repeatedly call the update method to encrypt blocks of data:"*

```java
int blockSize = cipher.getBlockSize();
var inBytes = new byte[blockSize];
. . . // read inBytes
int outputSize= cipher.getOutputSize(blockSize);
var outBytes = new byte[outputSize];
int outLength = cipher.update(inBytes, 0, outputSize, outBytes);
. . . // write outBytes
```

> *"When you are done, you must call the doFinal method once. If a final block of input data is available (with fewer than blockSize bytes), call"*

```java
outBytes = cipher.doFinal(inBytes, 0, inLength);
```

> *"If all input data have been encrypted, instead call"*

```java
outBytes = cipher.doFinal();
```

**Dịch:** Gọi **`update` lặp lại để mã hoá từng block dữ liệu**. Xong xuôi, **bắt buộc gọi `doFinal` đúng một lần**: nếu còn một block input cuối (**ít hơn `blockSize` byte**) thì gọi bản có tham số; nếu **toàn bộ input đã được mã hoá** thì gọi bản không tham số.

### Padding

> *"The call to doFinal is necessary to carry out padding of the final block. Consider the DES cipher. It has a block size of eight bytes. Suppose the last block of the input data has fewer than eight bytes. Of course, we can fill the remaining bytes with 0, to obtain one final block of eight bytes, and encrypt it. But when the blocks are decrypted, the result will have several trailing 0 bytes appended to it, and therefore will be slightly different from the original input file. To avoid this problem, we need a padding scheme. A commonly used padding scheme is the one described in the Public Key Cryptography Standard (PKCS) #5 by RSA Security, Inc. (https://tools.ietf.org/html/rfc2898)."*

**Dịch:** Lời gọi `doFinal` **cần thiết để thực hiện padding cho block cuối**. Xét cipher DES với **block size tám byte**. Nếu block cuối của input **ít hơn tám byte**, ta có thể **điền các byte còn lại bằng 0** rồi mã hoá. Nhưng khi giải mã, kết quả sẽ **có thêm mấy byte 0 ở đuôi**, nên **khác đôi chút so với file input gốc**. Để tránh, ta cần một **padding scheme** — thông dụng là scheme mô tả trong **Public Key Cryptography Standard (PKCS) #5** của RSA Security, Inc.

> *"In this scheme, the last block is not padded with a pad value of zero, but with a pad value that equals the number of pad bytes. In other words, if L is the last (incomplete) block, it is padded as follows:"*

| Padding | Điều kiện |
|---|---|
| `L 01` | if length(L) = 7 |
| `L 02 02` | if length(L) = 6 |
| `L 03 03 03` | if length(L) = 5 |
| `. . .` | |
| `L 07 07 07 07 07 07 07` | if length(L) = 1 |

> *"Finally, if the length of the input is actually divisible by 8, then one block"*

```
08 08 08 08 08 08 08 08
```

> *"is appended to the input and encrypted. After decryption, the very last byte of the plaintext is a count of the padding characters to discard."*

**Dịch:** Trong scheme này, block cuối **không được đệm bằng giá trị 0**, mà **bằng giá trị bằng đúng số byte đệm**. Nếu **độ dài input chia hết cho 8** thì **một block đầy `08` được nối thêm vào input rồi mã hoá**. Sau khi giải mã, **byte cuối cùng của plaintext chính là số ký tự padding cần bỏ đi**.

---

## 10.5.2. Key Generation

> *"To encrypt, you need to generate a key. Each cipher has a different format for keys, and you need to make sure that the key generation is random. Follow these steps:"*
>
> *"1. Get a KeyGenerator for your algorithm."*
> *"2. Initialize the generator with a source for randomness. If the block length of the cipher is variable, also specify the desired block length."*
> *"3. Call the generateKey method."*

**Dịch:** Để mã hoá, bạn **phải sinh một key**. Mỗi cipher có **định dạng key khác nhau**, và bạn **phải đảm bảo việc sinh key là ngẫu nhiên**:

| Bước | Nội dung |
|---|---|
| 1 | Lấy một **`KeyGenerator`** cho thuật toán của bạn |
| 2 | **Khởi tạo generator với một nguồn ngẫu nhiên**. Nếu **block length của cipher thay đổi được** thì chỉ định luôn block length mong muốn |
| 3 | Gọi method **`generateKey`** |

> *"For example, here is how you generate an AES key:"*

```java
KeyGenerator keygen = KeyGenerator.getInstance("AES");
var random = new SecureRandom(); // see below
keygen.init(random);
Key key = keygen.generateKey();
```

> *"Alternatively, you can produce a key from a fixed set of raw data (perhaps derived from a password or the timing of keystrokes). Construct a SecretKeySpec (which implements the SecretKey interface) like this:"*

```java
byte[] keyData = . . .; // 16 bytes for AES
var key = new SecretKeySpec(keyData, "AES");
```

**Dịch:** Hoặc bạn **tạo key từ một tập dữ liệu thô cố định** (có thể suy ra từ password hoặc từ nhịp gõ phím) bằng cách dựng một **`SecretKeySpec`** — class này **implement interface `SecretKey`**.

### `SecureRandom`

> *"When generating keys, make sure you use truly random numbers. For example, the regular random number generator in the Random class, seeded by the current date and time, is not random enough. Suppose the computer clock is accurate to 1/10 of a second. Then there are at most 864,000 seeds per day. If an attacker knows the day a key was issued (which can often be deduced from a message date or certificate expiration date), it is an easy matter to generate all possible seeds for that day."*

**Dịch:** Khi sinh key, **phải dùng số thực sự ngẫu nhiên**. Random number generator thường của class `Random`, **seed bằng ngày giờ hiện tại, là không đủ ngẫu nhiên**: nếu đồng hồ máy tính chính xác tới **1/10 giây** thì mỗi ngày **nhiều nhất chỉ có 864.000 seed**. Nếu kẻ tấn công **biết ngày key được phát hành** (thường suy ra được từ ngày của message hoặc ngày hết hạn certificate) thì **sinh hết mọi seed có thể của ngày đó là chuyện dễ**.

> *"The SecureRandom class generates random numbers that are far more secure than those produced by the Random class. You still need to provide a seed to start the number sequence at a random spot. The best method for doing this is to obtain random input from a hardware device such as a white-noise generator. Another reasonable source for random input is to ask the user to type away aimlessly on the keyboard, with each keystroke contributing only one or two bits to the random seed. Once you gather such random bits in an array of bytes, pass it to the setSeed method:"*

```java
var secrand = new SecureRandom();
var b = new byte[20];
// fill with truly random bits
secrand.setSeed(b);
```

**Dịch:** Class **`SecureRandom`** sinh số ngẫu nhiên **an toàn hơn nhiều** so với `Random`. Bạn **vẫn cần cung cấp seed** để bắt đầu dãy số ở một vị trí ngẫu nhiên. **Cách tốt nhất là lấy input ngẫu nhiên từ thiết bị phần cứng** như bộ sinh nhiễu trắng. Một nguồn hợp lý khác là **nhờ người dùng gõ lung tung trên bàn phím**, mỗi lần gõ **chỉ đóng góp một hai bit** vào random seed.

> *"If you don't seed the random number generator, it will compute its own 20-byte seed by launching threads, putting them to sleep, and measuring the exact time when they are awakened."*

**Dịch:** Nếu bạn **không seed** random number generator, nó **tự tính seed 20 byte của mình** bằng cách **khởi động các thread, cho chúng ngủ, rồi đo thời điểm chính xác chúng thức dậy** (xem [[01 - Running Threads|chương 10 Volume I]]).

> **Note (sách):** *"This algorithm is not known to be safe. In the past, algorithms that relied on the timing of some components of the computer, such as hard disk access time, were shown not to be completely random."*
>
> **Dịch:** **Thuật toán này chưa được biết là an toàn.** Trong quá khứ, những thuật toán **dựa vào nhịp thời gian của vài thành phần máy tính** — như thời gian truy cập ổ cứng — **đã bị chứng minh là không hoàn toàn ngẫu nhiên**.

### Chạy chương trình ví dụ

> *"The sample program at the end of this section puts the AES cipher to work (see Listing 10.17). The crypt utility method in Listing 10.18 will be reused in other examples. To use the program, you first need to generate a secret key. Run"*

```
java aes.AESTest -genkey secret.key
```

> *"The secret key is saved in the file secret.key."*

> *"Now you can encrypt with the command"*

```
java aes.AESTest -encrypt plaintextFile encryptedFile secret.key
```

> *"Decrypt with the command"*

```
java aes.AESTest -decrypt encryptedFile decryptedFile secret.key
```

> *"The program is straightforward. The -genkey option produces a new secret key and serializes it in the given file. That operation takes a long time because the initialization of the secure random generator is time-consuming. The -encrypt and -decrypt options both call into the same crypt method that calls the update and doFinal methods of the cipher. Note how the update method is called so long as the input blocks have the full length, and the doFinal method is either called with a partial input block (which is then padded) or with no additional data (to generate one pad block)."*

**Dịch:** Option `-genkey` **sinh một secret key mới và serialize nó vào file**. Thao tác này **mất khá lâu vì việc khởi tạo secure random generator tốn thời gian**. Cả `-encrypt` lẫn `-decrypt` **đều gọi vào cùng method `crypt`**, method này gọi `update` và `doFinal` của cipher. Chú ý **`update` được gọi chừng nào các input block còn đủ độ dài**, còn **`doFinal` được gọi hoặc với một input block lẻ** (rồi được đệm) **hoặc không có dữ liệu bổ sung** (để sinh một block đệm).

### Listing 10.17 — `aes/AESTest.java`

```java
package aes;

import java.io.*;
import java.security.*;
import javax.crypto.*;

/**
 * This program tests the AES cipher. Usage:<br>
 * java aes.AESTest -genkey keyfile<br>
 * java aes.AESTest -encrypt plaintext encrypted keyfile<br>
 * java aes.AESTest -decrypt encrypted decrypted keyfile<br>
 * @author Cay Horstmann
 * @version 1.02 2018-05-01
 */
public class AESTest
{
    public static void main(String[] args)
        throws IOException, GeneralSecurityException, ClassNotFoundException
    {
        if (args[0].equals("-genkey"))
        {
            KeyGenerator keygen = KeyGenerator.getInstance("AES");
            var random = new SecureRandom();
            keygen.init(random);
            SecretKey key = keygen.generateKey();
            try (var out = new ObjectOutputStream(new FileOutputStream(args[1])))
            {
                out.writeObject(key);
            }
        }
        else
        {
            int mode;
            if (args[0].equals("-encrypt")) mode = Cipher.ENCRYPT_MODE;
            else mode = Cipher.DECRYPT_MODE;

            try (var keyIn = new ObjectInputStream(new FileInputStream(args[3]));
                var in = new FileInputStream(args[1]);
                var out = new FileOutputStream(args[2]))
            {
                var key = (Key) keyIn.readObject();
                Cipher cipher = Cipher.getInstance("AES");
                cipher.init(mode, key);
                Util.crypt(in, out, cipher);
            }
        }
    }
}
```

### Listing 10.18 — `aes/Util.java`

```java
package aes;

import java.io.*;
import java.security.*;
import javax.crypto.*;

public class Util
{
    /**
     * Uses a cipher to transform the bytes in an input stream and sends the transformed bytes
     * to an output stream.
     * @param in the input stream
     * @param out the output stream
     * @param cipher the cipher that transforms the bytes
     */
    public static void crypt(InputStream in, OutputStream out, Cipher cipher)
        throws IOException, GeneralSecurityException
    {
        int blockSize = cipher.getBlockSize();
        int outputSize = cipher.getOutputSize(blockSize);
        var inBytes = new byte[blockSize];
        var outBytes = new byte[outputSize];

        int inLength = 0;
        var done = false;
        while (!done)
        {
            inLength = in.read(inBytes);
            if (inLength == blockSize)
            {
                int outLength = cipher.update(inBytes, 0, blockSize, outBytes);
                out.write(outBytes, 0, outLength);
            }
            else done = true;
        }
        if (inLength > 0) outBytes = cipher.doFinal(inBytes, 0, inLength);
        else outBytes = cipher.doFinal();
        out.write(outBytes);
    }
}
```

### API — `javax.crypto.Cipher` 1.4

| Method | Mô tả |
|---|---|
| `static Cipher getInstance(String algorithmName)`<br>`static Cipher getInstance(String algorithmName, String providerName)` | Trả về object `Cipher` implement thuật toán chỉ định. **Ném `NoSuchAlgorithmException`** nếu thuật toán không được cung cấp. |
| `int getBlockSize()` | Trả về kích thước (byte) của một cipher block, hoặc **`0` nếu cipher không phải block cipher**. |
| `int getOutputSize(int inputLength)` | Trả về kích thước output buffer cần thiết nếu input kế tiếp có số byte đã cho. Method này **tính cả các byte đang được buffer trong cipher object**. |
| `void init(int mode, Key key)` | Khởi tạo object thuật toán cipher. Mode là một trong `ENCRYPT_MODE`, `DECRYPT_MODE`, `WRAP_MODE`, `UNWRAP_MODE`. |
| `byte[] update(byte[] in)`<br>`byte[] update(byte[] in, int offset, int length)`<br>`int update(byte[] in, int offset, int length, byte[] out)` | Biến đổi **một block dữ liệu input**. Hai method đầu **trả về output**; method thứ ba **trả về số byte đã đặt vào `out`**. |
| `byte[] doFinal()`<br>`byte[] doFinal(byte[] in)`<br>`byte[] doFinal(byte[] in, int offset, int length)`<br>`int doFinal(byte[] in, int offset, int length, byte[] out)` | Biến đổi **block dữ liệu input cuối cùng** và **flush buffer** của object thuật toán này. Ba method đầu **trả về output**; method thứ tư **trả về số byte đã đặt vào `out`**. |

### API — `javax.crypto.KeyGenerator` 1.4

| Method | Mô tả |
|---|---|
| `static KeyGenerator getInstance(String algorithmName)` | Trả về object `KeyGenerator` implement thuật toán chỉ định. **Ném `NoSuchAlgorithmException`** nếu thuật toán không được cung cấp. |
| `void init(SecureRandom random)`<br>`void init(int keySize, SecureRandom random)` | Khởi tạo key generator. |
| `SecretKey generateKey()` | Sinh một key mới. |

### API — `javax.crypto.spec.SecretKeySpec` 1.4

| Method | Mô tả |
|---|---|
| `SecretKeySpec(byte[] key, String algorithmName)` | Dựng một key specification. |

---

## 10.5.3. Cipher Streams

> *"The JCE library provides a convenient set of stream classes that automatically encrypt or decrypt stream data. For example, here is how you can encrypt data to a file:"*

```java
Cipher cipher = . . .;
cipher.init(Cipher.ENCRYPT_MODE, key);
var out = new CipherOutputStream(new FileOutputStream(outputFileName), cipher);
var bytes = new byte[BLOCKSIZE];
int inLength = getData(bytes); // get data from data source
while (inLength != -1)
{
    out.write(bytes, 0, inLength);
    inLength = getData(bytes); // get more data from data source
}
out.flush();
```

**Dịch:** Thư viện JCE cung cấp **một bộ stream class tiện lợi tự động mã hoá hoặc giải mã dữ liệu stream** (xem [[06 - Input and Output]]).

> *"Similarly, you can use a CipherInputStream to read and decrypt data from a file:"*

```java
Cipher cipher = . . .;
cipher.init(Cipher.DECRYPT_MODE, key);
var in = new CipherInputStream(new FileInputStream(inputFileName), cipher);
var bytes = new byte[BLOCKSIZE];
int inLength = in.read(bytes);
while (inLength != -1)
{
    putData(bytes, inLength); // put data to destination
    inLength = in.read(bytes);
}
```

> *"The cipher stream classes transparently handle the calls to update and doFinal, which is clearly a convenience."*

**Dịch:** Các cipher stream class **xử lý lời gọi `update` và `doFinal` một cách trong suốt** — rõ ràng là **rất tiện**.

### API — `javax.crypto.CipherInputStream` 1.4

| Method | Mô tả |
|---|---|
| `CipherInputStream(InputStream in, Cipher cipher)` | Dựng một input stream đọc dữ liệu từ `in` và **giải mã hoặc mã hoá** chúng bằng cipher đã cho. |
| `int read()`<br>`int read(byte[] b, int off, int len)` | Đọc dữ liệu từ input stream — dữ liệu **được tự động giải mã hoặc mã hoá**. |

### API — `javax.crypto.CipherOutputStream` 1.4

| Method | Mô tả |
|---|---|
| `CipherOutputStream(OutputStream out, Cipher cipher)` | Dựng một output stream ghi dữ liệu ra `out` và **mã hoá hoặc giải mã** chúng bằng cipher đã cho. |
| `void write(int ch)`<br>`void write(byte[] b, int off, int len)` | Ghi dữ liệu ra output stream — dữ liệu **được tự động mã hoá hoặc giải mã**. |
| `void flush()` | Flush cipher buffer và **thực hiện padding nếu cần**. |

---

## 10.5.4. Public Key Ciphers

> *"The AES cipher that you have seen in the preceding section is a symmetric cipher. The same key is used for both encryption and decryption. The Achilles heel of symmetric ciphers is key distribution. If Alice sends Bob an encrypted method, Bob needs the same key that Alice used. If Alice changes the key, she needs to send Bob both the message and, through a secure channel, the new key. But perhaps she has no secure channel to Bob—which is why she encrypts her messages to him in the first place."*

**Dịch:** Cipher AES ở section trước là **symmetric cipher**: **cùng một key dùng cho cả mã hoá lẫn giải mã**. **Gót chân Achilles của symmetric cipher là việc phân phối key.** Nếu Alice đổi key, cô phải gửi cho Bob **cả message lẫn key mới qua một kênh an toàn**. Nhưng **có lẽ cô không có kênh an toàn nào tới Bob** — chính vì thế cô mới phải mã hoá message ngay từ đầu.

> *"Public key cryptography solves that problem. In a public key cipher, Bob has a key pair consisting of a public key and a matching private key. Bob can publish the public key anywhere, but he must closely guard the private key. Alice simply uses the public key to encrypt her messages to Bob."*

**Dịch:** **Public key cryptography giải quyết vấn đề đó.** Trong public key cipher, Bob có **một key pair gồm public key và private key khớp nhau**. Bob **công bố public key ở đâu cũng được**, nhưng **phải canh giữ chặt private key**. Alice **chỉ việc dùng public key để mã hoá message gửi Bob**.

> *"Actually, it's not quite that simple. All known public key algorithms are much slower than symmetric key algorithms such as DES or AES. It would not be practical to use a public key algorithm to encrypt large amounts of information. However, that problem can easily be overcome by combining a public key cipher with a fast symmetric cipher, like this:"*
>
> *"1. Alice generates a random symmetric encryption key. She uses it to encrypt her plaintext."*
> *"2. Alice encrypts the symmetric key with Bob's public key."*
> *"3. Alice sends Bob both the encrypted symmetric key and the encrypted plaintext."*
> *"4. Bob uses his private key to decrypt the symmetric key."*
> *"5. Bob uses the decrypted symmetric key to decrypt the message."*

**Dịch:** Thực ra **không đơn giản như vậy**: **mọi thuật toán public key đã biết đều chậm hơn nhiều so với thuật toán symmetric key** như DES hay AES, nên **dùng public key để mã hoá lượng thông tin lớn là bất khả thi**. Nhưng vấn đề đó **dễ khắc phục bằng cách kết hợp public key cipher với một symmetric cipher nhanh**:

| Bước | Nội dung |
|---|---|
| 1 | Alice **sinh một symmetric encryption key ngẫu nhiên** và dùng nó **mã hoá plaintext** của mình |
| 2 | Alice **mã hoá symmetric key bằng public key của Bob** |
| 3 | Alice **gửi cho Bob cả symmetric key đã mã hoá lẫn plaintext đã mã hoá** |
| 4 | Bob **dùng private key của mình để giải mã symmetric key** |
| 5 | Bob **dùng symmetric key đã giải mã để giải mã message** |

> *"Nobody but Bob can decrypt the symmetric key because only Bob has the private key for decryption. Thus, the expensive public key encryption is only applied to a small amount of key data."*

**Dịch:** **Không ai ngoài Bob giải mã được symmetric key** vì **chỉ Bob có private key để giải mã**. Nhờ vậy, **phép mã hoá public key đắt đỏ chỉ áp dụng lên một lượng nhỏ dữ liệu key**.

> *"The most commonly used public key algorithm is the RSA algorithm invented by Rivest, Shamir, and Adleman. Until October 2000, the algorithm was protected by a patent assigned to RSA Security, Inc. Licenses were not cheap—typically a 3% royalty, with a minimum payment of $50,000 per year. Now the algorithm is in the public domain."*

**Dịch:** Thuật toán public key **được dùng phổ biến nhất là RSA**, do Rivest, Shamir và Adleman phát minh. **Tới tháng 10 năm 2000**, thuật toán còn được bảo hộ bởi **bằng sáng chế thuộc RSA Security, Inc.** Giấy phép **không rẻ** — thường **3% tiền bản quyền, tối thiểu 50.000 USD mỗi năm**. **Nay thuật toán thuộc public domain.**

> *"To use the RSA algorithm, you need a public/private key pair. Use a KeyPairGenerator like this:"*

```java
KeyPairGenerator pairgen = KeyPairGenerator.getInstance("RSA");
var random = new SecureRandom();
pairgen.initialize(KEYSIZE, random);
KeyPair keyPair = pairgen.generateKeyPair();
Key publicKey = keyPair.getPublic();
Key privateKey = keyPair.getPrivate();
```

**Dịch:** Để dùng thuật toán RSA, bạn cần **một cặp public/private key**. Dùng **`KeyPairGenerator`**.

### Wrap key

> *"The program in Listing 10.19 has three options. The -genkey option produces a key pair. The -encrypt option generates an AES key and wraps it with the public key."*

```java
Key key = . . .; // an AES key
Key publicKey = . . .; // a public RSA key
Cipher cipher = Cipher.getInstance("RSA");
cipher.init(Cipher.WRAP_MODE, publicKey);
byte[] wrappedKey = cipher.wrap(key);
```

> *"It then produces a file that contains"*
>
> *"• The length of the wrapped key"*
> *"• The wrapped key bytes"*
> *"• The plaintext encrypted with the AES key"*

**Dịch:** Option `-genkey` **sinh một key pair**. Option `-encrypt` **sinh một AES key và wrap nó bằng public key**, rồi tạo ra một file chứa: **độ dài của wrapped key**, **các byte của wrapped key**, và **plaintext đã mã hoá bằng AES key**.

> *"The -decrypt option decrypts such a file. To try the program, first generate the RSA keys:"*

```
java rsa.RSATest -genkey public.key private.key
```

> *"Then encrypt a file:"*

```
java rsa.RSATest -encrypt plaintextFile encryptedFile public.key
```

> *"Finally, decrypt it and verify that the decrypted file matches the plaintext:"*

```
java rsa.RSATest -decrypt encryptedFile decryptedFile private.key
```

### Listing 10.19 — `rsa/RSATest.java`

```java
package rsa;

import java.io.*;
import java.security.*;
import javax.crypto.*;

/**
 * This program tests the RSA cipher. Usage:<br>
 * java rsa.RSATest -genkey public private<br>
 * java rsa.RSATest -encrypt plaintext encrypted public<br>
 * java rsa.RSATest -decrypt encrypted decrypted private<br>
 * @author Cay Horstmann
 * @version 1.02 2018-05-01
 */
public class RSATest
{
    private static final int KEYSIZE = 512;

    public static void main(String[] args)
        throws IOException, GeneralSecurityException, ClassNotFoundException
    {
        if (args[0].equals("-genkey"))
        {
            KeyPairGenerator pairgen = KeyPairGenerator.getInstance("RSA");
            var random = new SecureRandom();
            pairgen.initialize(KEYSIZE, random);
            KeyPair keyPair = pairgen.generateKeyPair();
            try (var out = new ObjectOutputStream(new FileOutputStream(args[1])))
            {
                out.writeObject(keyPair.getPublic());
            }
            try (var out = new ObjectOutputStream(new FileOutputStream(args[2])))
            {
                out.writeObject(keyPair.getPrivate());
            }
        }
        else if (args[0].equals("-encrypt"))
        {
            KeyGenerator keygen = KeyGenerator.getInstance("AES");
            var random = new SecureRandom();
            keygen.init(random);
            SecretKey key = keygen.generateKey();

            // wrap with RSA public key
            try (var keyIn = new ObjectInputStream(new FileInputStream(args[3]));
                var out = new DataOutputStream(new FileOutputStream(args[2]));
                var in = new FileInputStream(args[1]) )
            {
                var publicKey = (Key) keyIn.readObject();
                Cipher cipher = Cipher.getInstance("RSA");
                cipher.init(Cipher.WRAP_MODE, publicKey);
                byte[] wrappedKey = cipher.wrap(key);
                out.writeInt(wrappedKey.length);
                out.write(wrappedKey);

                cipher = Cipher.getInstance("AES");
                cipher.init(Cipher.ENCRYPT_MODE, key);
                Util.crypt(in, out, cipher);
            }
        }
        else
        {
            try (var in = new DataInputStream(new FileInputStream(args[1]));
                var keyIn = new ObjectInputStream(new FileInputStream(args[3]));
                var out = new FileOutputStream(args[2]))
            {
                int length = in.readInt();
                var wrappedKey = new byte[length];
                in.read(wrappedKey, 0, length);

                // unwrap with RSA private key
                var privateKey = (Key) keyIn.readObject();

                Cipher cipher = Cipher.getInstance("RSA");
                cipher.init(Cipher.UNWRAP_MODE, privateKey);
                Key key = cipher.unwrap(wrappedKey, "AES", Cipher.SECRET_KEY);

                cipher = Cipher.getInstance("AES");
                cipher.init(Cipher.DECRYPT_MODE, key);

                Util.crypt(in, out, cipher);
            }
        }
    }
}
```

---

## Kết chương

> *"You have now seen how the Java security model allows controlled execution of code, which is a unique and increasingly important aspect of the Java platform. You have also seen the services for authentication and encryption that the Java library provides."*

> *"In the next chapter, we will delve into advanced Swing and graphics programming."*

**Dịch:** Bạn đã thấy **mô hình bảo mật của Java cho phép thực thi code có kiểm soát** ra sao — một khía cạnh **độc đáo và ngày càng quan trọng** của Java platform. Bạn cũng đã thấy **các dịch vụ authentication và encryption mà Java library cung cấp**.

---

## Chương kế tiếp

→ [[01 - Tables]] — Chapter 11: Advanced Swing and Graphics.
