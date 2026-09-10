# 08 — Big Numbers

> Chapter 3, Section 3.9 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.9. Big Numbers

> *"If the precision of the basic integer and floating-point types is not sufficient, you can turn to a couple of handy classes in the java.math package: BigInteger and BigDecimal. These are classes for manipulating numbers with an arbitrarily long sequence of digits. The BigInteger class implements arbitrary-precision integer arithmetic, and BigDecimal does the same for floating-point numbers."*

**Dịch:** Nếu **độ chính xác của các kiểu số nguyên và số thực cơ bản không đủ**, bạn có thể dùng tới hai class tiện lợi trong package **`java.math`**: **`BigInteger`** và **`BigDecimal`**. Đây là các class **thao tác với số có dãy chữ số dài tuỳ ý**. Class `BigInteger` implement **phép toán số nguyên với độ chính xác tuỳ ý**, còn `BigDecimal` làm điều tương tự **cho số thực**.

> *"Use the static valueOf method to turn an ordinary number into a big number:"*

```java
BigInteger a = BigInteger.valueOf(100);
```

> *"For longer numbers, use a constructor with a string argument:"*

```java
BigInteger reallyBig
    = new BigInteger("222232244629420445529739893461909967206666939096499764990979600");
```

> *"There are also constants BigInteger.ZERO, BigInteger.ONE, BigInteger.TWO, and BigInteger.TEN."*

**Dịch:** Dùng static method **`valueOf`** để **biến một số thường thành big number**. Với **số dài hơn**, dùng **constructor nhận argument là string**. Cũng có các **hằng số** `BigInteger.ZERO`, `BigInteger.ONE`, `BigInteger.TWO` và `BigInteger.TEN`.

> **Caution (sách):** *"With the BigDecimal class, you should always use the constructor with a string argument. There is a constructor BigDecimal(double) that is inherently prone to roundoff: new BigDecimal(0.1) has digits"*
>
> ```
> 0.1000000000000000055511151231257827021181583404541015625
> ```
>
> **Dịch:** Với class `BigDecimal`, bạn **luôn nên dùng constructor nhận argument là string**. Có một constructor **`BigDecimal(double)`** vốn **bản chất đã dễ bị lỗi làm tròn**: `new BigDecimal(0.1)` mang các chữ số như trên.

### Không dùng được toán tử `+` và `*`

> *"Unfortunately, you cannot use the familiar mathematical operators such as + and * to combine big numbers. Instead, you must use methods such as add and multiply in the big number classes."*

```java
BigInteger c = a.add(b); // c = a + b
BigInteger d = c.multiply(b.add(BigInteger.valueOf(2))); // d = c * (b + 2)
```

**Dịch:** Đáng tiếc là **không dùng được các toán tử toán học quen thuộc như `+` và `*`** để kết hợp big number. Thay vào đó **phải dùng các method như `add` và `multiply`** trong các class big number.

> **C++ Note (sách):** *"Unlike C++, Java has no programmable operator overloading. There was no way for the programmers of the BigInteger class to redefine the + and * operators to give the add and multiply operations of the BigInteger classes. The language designers did overload the + operator to denote concatenation of strings. They chose not to overload other operators, and they did not give Java programmers the opportunity to overload operators in their own classes."*
>
> **Dịch:** Khác C++, Java **không có operator overloading lập trình được**. Người viết class `BigInteger` **không có cách nào định nghĩa lại toán tử `+` và `*`** để chúng cho ra phép `add` và `multiply` của các class `BigInteger`. Người thiết kế ngôn ngữ **có overload toán tử `+`** để biểu thị **phép nối chuỗi**. Họ **chọn không overload các toán tử khác**, và **không cho lập trình viên Java cơ hội overload toán tử trong class của chính họ**.

> **Note (sách):** *"In Java 19, the BigInteger class provides a parallelMultiply method that yields the same result as multiply but can potentially compute the result faster by using multiple processor cores. Use this method if you have to do a lot of multiplications and you know that your application does not need the CPU resources for other computations."*
>
> **Dịch:** Ở **Java 19**, class `BigInteger` cung cấp method **`parallelMultiply`** cho **cùng kết quả với `multiply`** nhưng **có tiềm năng tính nhanh hơn nhờ dùng nhiều nhân CPU**. Dùng method này nếu bạn **phải thực hiện rất nhiều phép nhân** và **biết chắc ứng dụng của mình không cần tài nguyên CPU cho các phép tính khác**.

---

## Chương trình ví dụ — lottery odds với big numbers

> *"Listing 3.6 shows a modification of the lottery odds program of Listing 3.5, updated to work with big numbers. For example, if you are invited to participate in a lottery in which you need to pick 60 numbers out of a possible 490 numbers, you can use this program to tell you your odds of winning. They are 1 in 716395843461995557415116222540092933411717612789263493493351013459481104668848. Good luck!"*

**Dịch:** Listing 3.6 là bản sửa của chương trình **lottery odds** ở [[07 - Control Flow#Listing 3.5 — `LotteryOdds/LotteryOdds.java`|Listing 3.5]], được cập nhật để **làm việc với big number**. Ví dụ, nếu bạn được mời tham gia một cuộc xổ số phải **chọn 60 số trong 490 số**, chương trình này cho biết **xác suất trúng của bạn** — là **1 trên 716395843461995557415116222540092933411717612789263493493351013459481104668848**.

> *"The program in Listing 3.5 computed the statement"*

```java
lotteryOdds = lotteryOdds * (n - i + 1) / i;
```

> *"When big integers are used for lotteryOdds and n, the equivalent statement becomes"*

```java
lotteryOdds = lotteryOdds
    .multiply(n.subtract(BigInteger.valueOf(i - 1)))
    .divide(BigInteger.valueOf(i));
```

**Dịch:** Khi **big integer được dùng cho `lotteryOdds` và `n`**, câu lệnh tương đương trở thành đoạn code trên.

### Listing 3.6 — `BigIntegerTest/BigIntegerTest.java`

```java
import java.math.*;
import java.util.*;

/**
 * This program uses big numbers to compute the odds of winning the grand prize in a lottery.
 * @version 1.21 2021-09-03
 * @author Cay Horstmann
 */
public class BigIntegerTest
{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        System.out.print("How many numbers do you need to draw? ");
        int k = in.nextInt();

        System.out.print("What is the highest number you can draw? ");
        BigInteger n = in.nextBigInteger();

        /*
         * compute binomial coefficient n*(n-1)*(n-2)*...*(n-k+1)/(1*2*3*...*k)
         */

        BigInteger lotteryOdds = BigInteger.ONE;

        for (int i = 1; i <= k; i++)
            lotteryOdds = lotteryOdds
                .multiply(n.subtract(BigInteger.valueOf(i - 1)))
                .divide(BigInteger.valueOf(i));

        System.out.printf("Your odds are 1 in %s. Good luck!%n", lotteryOdds);
    }
}
```

---

## API — `java.math.BigInteger` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `BigInteger add(BigInteger other)`<br>`BigInteger subtract(BigInteger other)`<br>`BigInteger multiply(BigInteger other)`<br>`BigInteger divide(BigInteger other)`<br>`BigInteger mod(BigInteger other)`<br>`BigInteger pow(int exponent)` | trả về **tổng, hiệu, tích, thương, phần dư và luỹ thừa** của big integer này với `other` |
| `BigInteger sqrt()` *(Java 9)* | cho ra **căn bậc hai** của `BigInteger` này |
| `int compareTo(BigInteger other)` | trả về **`0`** nếu big integer này **bằng** `other`, **kết quả âm** nếu big integer này **nhỏ hơn** `other`, và **kết quả dương** trong trường hợp còn lại |
| `static BigInteger valueOf(long x)` | trả về một big integer **có giá trị bằng `x`** |

## API — `java.math.BigDecimal` (Java 1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `BigDecimal(String digits)` | dựng một big decimal với **các chữ số cho trước** |
| `BigDecimal add(BigDecimal other)`<br>`BigDecimal subtract(BigDecimal other)`<br>`BigDecimal multiply(BigDecimal other)`<br>`BigDecimal divide(BigDecimal other)` *(Java 5.0)*<br>`BigDecimal divide(BigDecimal other, RoundingMode mode)` *(Java 5.0)* | trả về **tổng, hiệu, tích hoặc thương** của big decimal này với `other`. Method `divide` thứ nhất **ném exception nếu thương không có khai triển thập phân hữu hạn**. Muốn kết quả đã làm tròn thì dùng method thứ hai. Mode **`RoundingMode.HALF_UP`** là kiểu làm tròn **bạn đã học ở trường**: chữ số **0 tới 4 làm tròn xuống**, chữ số **5 tới 9 làm tròn lên** — phù hợp cho các phép tính thông thường. Xem tài liệu API để biết các rounding mode khác |
| `int compareTo(BigDecimal other)` | trả về **`0`** nếu big decimal này **bằng** `other`, **kết quả âm** nếu **nhỏ hơn** `other`, và **kết quả dương** trong trường hợp còn lại |

---

## Bài kế tiếp

→ [[09 - Arrays]] — khai báo mảng, truy cập phần tử, vòng "for each", sao chép mảng, command-line argument, sắp xếp, mảng nhiều chiều và mảng răng cưa.
