# 07 — Control Flow

> Chapter 3, Section 3.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.8. Control Flow

> *"Java, like any programming language, supports both conditional statements and loops to determine control flow. I will start with the conditional statements, then move on to loops, to end with a thorough discussion of the four forms of switch."*

**Dịch:** Java, như mọi ngôn ngữ lập trình, hỗ trợ **cả câu lệnh điều kiện lẫn vòng lặp** để xác định luồng điều khiển. Sách bắt đầu từ câu lệnh điều kiện, rồi tới vòng lặp, và kết thúc bằng phần bàn kỹ về **bốn dạng của `switch`**.

> **C++ Note (sách):** *"The Java control flow constructs are identical to those in C and C++, with a few exceptions. There is no goto, but there is a "labeled" version of break that you can use to break out of a nested loop (where, in C, you perhaps would have used a goto). Finally, there is a variant of the for loop that is similar to the range-based for loop in C++ and the foreach loop in C#."*
>
> **Dịch:** Các cấu trúc điều khiển luồng của Java **giống hệt C và C++**, trừ vài ngoại lệ. **Không có `goto`**, nhưng có **dạng "có nhãn" (labeled) của `break`** dùng để thoát khỏi vòng lặp lồng nhau — chỗ mà trong C có lẽ bạn đã dùng `goto`. Cuối cùng, có một **biến thể của vòng `for`** tương tự vòng `for` range-based trong C++ và vòng `foreach` trong C#.

---

## 3.8.1. Block Scope

> *"Before learning about control structures, you need to know more about blocks."*

> *"A block, or compound statement, consists of a number of Java statements, surrounded by a pair of braces. Blocks define the scope of your variables. A block can be nested inside another block. Here is a block that is nested inside the block of the main method:"*

```java
public static void main(String[] args)
{
    int n;
    . . .
    {
        int k;
        . . .
    } // k is only defined up to here
}
```

**Dịch:** Một **block**, hay **compound statement**, gồm **một số câu lệnh Java bao trong một cặp ngoặc nhọn**. Block **định nghĩa scope của biến**. Một block **lồng được bên trong block khác**.

> *"You may not declare identically named local variables in two nested blocks. For example, the following is an error and will not compile:"*

```java
public static void main(String[] args)
{
    int n;
    . . .
    {
        int k;
        int n; // ERROR--can't redeclare n in inner block
        . . .
    }
}
```

**Dịch:** **Không được khai báo local variable trùng tên trong hai block lồng nhau.** Đoạn code trên là **lỗi và sẽ không compile**.

> **C++ Note (sách):** *"In C++, it is possible to redefine a variable inside a nested block. The inner definition then shadows the outer one. This can be a source of programming errors; hence, Java does not allow it."*
>
> **Dịch:** Trong C++, **định nghĩa lại một biến bên trong block lồng nhau là được**; khi đó định nghĩa bên trong **che khuất (shadow)** định nghĩa bên ngoài. Điều này **có thể là nguồn gây lỗi lập trình**, nên **Java không cho phép**.

---

## 3.8.2. Conditional Statements

> *"The conditional statement in Java has the form"*

```java
if (condition) statement
```

> *"The condition must be surrounded by parentheses."*

**Dịch:** Câu lệnh điều kiện trong Java có dạng trên. **Điều kiện bắt buộc phải nằm trong cặp ngoặc tròn.**

> *"In Java, as in most programming languages, you will often want to execute multiple statements when a single condition is true. In this case, use a block statement that takes the form"*

```java
{
    statement1
    statement2
    . . .
}
```

> *"For example:"*

```java
if (yourSales >= target)
{
    performance = "Satisfactory";
    bonus = 100;
}
```

> *"In this code all the statements surrounded by the braces will be executed when yourSales is greater than or equal to target (see Figure 3.7)."*

**Dịch:** Thường bạn muốn **thực thi nhiều câu lệnh khi một điều kiện đúng** — trường hợp đó dùng **block statement**. Trong đoạn code trên, **mọi câu lệnh nằm trong cặp ngoặc nhọn được thực thi** khi `yourSales` lớn hơn hoặc bằng `target`.

> **Note (sách):** *"A block (sometimes called a compound statement) enables you to have more than one (simple) statement in any Java programming structure that otherwise allows for a single (simple) statement."*
>
> **Dịch:** Một block (đôi khi gọi là compound statement) cho phép bạn **đặt nhiều hơn một câu lệnh đơn** vào bất kỳ cấu trúc lập trình Java nào **vốn chỉ cho phép một câu lệnh đơn**.

> *"The more general conditional in Java looks like this (see Figure 3.8):"*

```java
if (condition) statement1 else statement2
```

> *"For example:"*

```java
if (yourSales >= target)
{
    performance = "Satisfactory";
    bonus = 100 + 0.01 * (yourSales - target);
}
else
{
    performance = "Unsatisfactory";
    bonus = 0;
}
```

> *"The else part is always optional. An else groups with the closest if. Thus, in the statement"*

```java
if (x <= 0) if (x == 0) sign = 0; else sign = -1;
```

> *"the else belongs to the second if. Of course, it is a good idea to use braces to clarify this code:"*

```java
if (x <= 0) { if (x == 0) sign = 0; else sign = -1; }
```

**Dịch:** Phần `else` **luôn là tuỳ chọn**. Một `else` **gắn với `if` gần nhất** — trong câu lệnh trên, `else` thuộc về **`if` thứ hai**. Tất nhiên, **nên dùng ngoặc nhọn** để làm rõ đoạn code này.

> *"Repeated if . . . else if . . . alternatives are common (see Figure 3.9). For example:"*

```java
if (yourSales >= 2 * target)
{
    performance = "Excellent";
    bonus = 1000;
}
else if (yourSales >= 1.5 * target)
{
    performance = "Fine";
    bonus = 500;
}
else if (yourSales >= target)
{
    performance = "Satisfactory";
    bonus = 100;
}
else
{
    System.out.println("You're fired");
}
```

**Dịch:** Các nhánh **`if ... else if ...` lặp lại** là chuyện phổ biến.

---

## 3.8.3. Loops

> *"The while loop executes a statement (which may be a block statement) while a condition is true. The general form is"*

```java
while (condition) statement
```

> *"The while loop will never execute if the condition is false at the outset (see Figure 3.10)."*

**Dịch:** Vòng `while` **thực thi một câu lệnh** (có thể là block statement) **chừng nào điều kiện còn đúng**. Vòng `while` **sẽ không bao giờ chạy** nếu điều kiện **sai ngay từ đầu**.

> *"The program in Listing 3.3 determines how long it will take to save a specific amount of money for your well-earned retirement, assuming you deposit the same amount of money per year and the money earns a specified interest rate."*

> *"In the example, we are incrementing a counter and updating the amount currently accumulated in the body of the loop until the total exceeds the targeted amount."*

```java
while (balance < goal)
{
    balance += payment;
    double interest = balance * interestRate / 100;
    balance += interest;
    years++;
}
System.out.println(years + " years.");
```

> *"(Don't rely on this program to plan for your retirement. It lacks a few niceties such as inflation and your life expectancy.)"*

**Dịch:** Chương trình ở Listing 3.3 xác định **mất bao lâu để tiết kiệm đủ một khoản tiền** cho việc nghỉ hưu, giả định mỗi năm bạn gửi cùng một số tiền và tiền đó sinh lãi theo lãi suất cho trước. Trong ví dụ, ta **tăng một biến đếm** và **cập nhật số tiền đang tích luỹ** trong thân vòng lặp cho tới khi tổng vượt số tiền mục tiêu.

*(Đừng dựa vào chương trình này để lên kế hoạch nghỉ hưu. Nó thiếu vài thứ tinh tế như lạm phát và tuổi thọ dự kiến của bạn.)*

### `do/while`

> *"A while loop tests at the top. Therefore, the code in the block might never be executed. If you want to make sure a block is executed at least once, you need to move the test to the bottom, using the do/while loop. Its syntax looks like this:"*

```java
do statement while (condition);
```

> *"This loop executes the statement (which is typically a block) and only then tests the condition. If it's true, it repeats the statement and retests the condition, and so on. The code in Listing 3.4 computes the new balance in your retirement account and then asks if you are ready to retire:"*

```java
do
{
    balance += payment;
    double interest = balance * interestRate / 100;
    balance += interest;
    years++;
    // print current balance
    . . .
    // ask if ready to retire and get input
    . . .
}
while (input.equals("N"));
```

> *"As long as the user answers "N", the loop is repeated (see Figure 3.11). This program is a good example of a loop that needs to be entered at least once, because the user needs to see the balance before deciding whether it is sufficient for retirement."*

**Dịch:** Vòng `while` **kiểm tra ở đầu**, nên code trong block **có thể không bao giờ được thực thi**. Muốn chắc chắn block **được thực thi ít nhất một lần** thì **chuyển phép kiểm tra xuống cuối**, dùng vòng **`do/while`**.

Vòng này **thực thi câu lệnh trước**, rồi mới **kiểm tra điều kiện**; điều kiện đúng thì lặp lại câu lệnh và kiểm tra lại, cứ thế. Chừng nào người dùng còn trả lời `"N"` thì vòng lặp còn tiếp tục. Đây là **ví dụ tốt về vòng lặp cần được vào ít nhất một lần**, vì người dùng **cần thấy số dư trước** khi quyết định nó đã đủ để nghỉ hưu hay chưa.

### Listing 3.3 — `Retirement/Retirement.java`

```java
import java.util.*;

/**
 * This program demonstrates a <code>while</code> loop.
 * @version 1.20 2004-02-10
 * @author Cay Horstmann
 */
public class Retirement
{
    public static void main(String[] args)
    {
        // read inputs
        Scanner in = new Scanner(System.in);

        System.out.print("How much money do you need to retire? ");
        double goal = in.nextDouble();

        System.out.print("How much money will you contribute every year? ");
        double payment = in.nextDouble();

        System.out.print("Interest rate in %: ");
        double interestRate = in.nextDouble();

        double balance = 0;
        int years = 0;

        // update account balance while goal isn't reached
        while (balance < goal)
        {
            // add this year's payment and interest
            balance += payment;
            double interest = balance * interestRate / 100;
            balance += interest;
            years++;
        }

        System.out.println("You can retire in " + years + " years.");
    }
}
```

### Listing 3.4 — `Retirement2/Retirement2.java`

```java
import java.util.*;

/**
 * This program demonstrates a <code>do/while</code> loop.
 * @version 1.20 2004-02-10
 * @author Cay Horstmann
 */
public class Retirement2
{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        System.out.print("How much money will you contribute every year? ");
        double payment = in.nextDouble();

        System.out.print("Interest rate in %: ");
        double interestRate = in.nextDouble();

        double balance = 0;
        int year = 0;

        String input;

        // update account balance while user isn't ready to retire
        do
        {
            // add this year's payment and interest
            balance += payment;
            double interest = balance * interestRate / 100;
            balance += interest;

            year++;

            // print current balance
            System.out.printf("After year %d, your balance is %,.2f%n", year, balance);

            // ask if ready to retire and get input
            System.out.print("Ready to retire? (Y/N) ");
            input = in.next();
        }
        while (input.equals("N"));
    }
}
```

---

## 3.8.4. Determinate Loops

> *"The for loop is a general construct to support iteration controlled by a counter or similar variable that is updated after every iteration. As Figure 3.12 shows, the following loop prints the numbers from 1 to 10 on the screen:"*

```java
for (int i = 1; i <= 10; i++)
    System.out.println(i);
```

> *"The first slot of the for statement usually holds the counter initialization. The second slot gives the condition that will be tested before each new pass through the loop, and the third slot specifies how to update the counter."*

**Dịch:** Vòng `for` là **cấu trúc tổng quát** hỗ trợ phép lặp **được điều khiển bởi một biến đếm** hoặc biến tương tự, **được cập nhật sau mỗi lần lặp**.

| Ô | Nội dung |
|---|---|
| **ô thứ nhất** | thường chứa phần **khởi tạo biến đếm** |
| **ô thứ hai** | đưa ra **điều kiện được kiểm tra trước mỗi lượt chạy mới** của vòng lặp |
| **ô thứ ba** | chỉ định **cách cập nhật biến đếm** |

> *"Although Java, like C++, allows almost any expression in the various slots of a for loop, it is an unwritten rule of good taste that the three slots should only initialize, test, and update the same counter variable. One can write very obscure loops by disregarding this rule."*

**Dịch:** Dù Java, cũng như C++, cho phép **gần như biểu thức bất kỳ** trong các ô của vòng `for`, có một **luật bất thành văn về thẩm mỹ**: ba ô đó **chỉ nên khởi tạo, kiểm tra và cập nhật cùng một biến đếm**. Bỏ qua luật này thì **viết ra được những vòng lặp cực kỳ tối nghĩa**.

> *"Even within the bounds of good taste, much is possible. For example, you can have loops that count down:"*

```java
for (int i = 10; i > 0; i--)
    System.out.println("Counting down . . . " + i);
System.out.println("Blastoff!");
```

**Dịch:** Ngay cả trong giới hạn thẩm mỹ, vẫn làm được nhiều thứ — ví dụ vòng lặp **đếm ngược**.

> **Caution (sách):** *"Be careful with testing for equality of floating-point numbers in loops. A for loop like this one"*
>
> ```java
> for (double x = 0; x != 10; x += 0.1) . . .
> ```
>
> *"might never end. Because of roundoff errors, the final value might not be reached exactly. In this example, x jumps from 9.99999999999998 to 10.09999999999998 because there is no exact binary representation for 0.1."*
>
> **Dịch:** **Cẩn thận khi kiểm tra bằng nhau với số thực trong vòng lặp.** Vòng `for` như trên **có thể không bao giờ kết thúc**. Vì **lỗi làm tròn**, giá trị cuối **có thể không bao giờ được chạm tới chính xác**. Trong ví dụ này, `x` **nhảy từ `9.99999999999998` sang `10.09999999999998`** vì **không có biểu diễn nhị phân chính xác cho `0.1`**.

### Scope của biến khai báo trong `for`

> *"When you declare a variable in the first slot of the for statement, the scope of that variable extends until the end of the body of the for loop."*

```java
for (int i = 1; i <= 10; i++)
{
    . . .
}
// i no longer defined here
```

> *"In particular, if you define a variable inside a for statement, you cannot use its value outside the loop. Therefore, if you wish to use the final value of a loop counter outside the for loop, be sure to declare it outside the loop header."*

```java
int i;
for (i = 1; i <= 10; i++)
{
    . . .
}
// i is still defined here
```

**Dịch:** Khai báo một biến ở **ô thứ nhất** của câu lệnh `for` thì **scope của biến đó kéo dài tới hết thân vòng lặp**. Cụ thể, định nghĩa biến bên trong câu lệnh `for` thì **không dùng được giá trị của nó bên ngoài vòng lặp**. Vì vậy, muốn dùng **giá trị cuối cùng của biến đếm** ở ngoài vòng `for` thì **nhớ khai báo nó bên ngoài phần đầu vòng lặp**.

> *"On the other hand, you can define variables with the same name in separate for loops:"*

```java
for (int i = 1; i <= 10; i++)
{
    . . .
}
. . .
for (int i = 11; i <= 20; i++) // OK to define another variable named i
{
    . . .
}
```

**Dịch:** Mặt khác, **định nghĩa được các biến trùng tên trong những vòng `for` tách biệt nhau**.

> *"A for loop is merely a convenient shortcut for a while loop. For example,"*

```java
for (i = 10; i > 0; i--)
    System.out.println("Counting down . . . " + i);
```

> *"can be rewritten as follows:"*

```java
i = 10;
while (i > 0)
{
    System.out.println("Counting down . . . " + i);
    i--;
}
```

**Dịch:** Vòng `for` **chỉ đơn thuần là lối viết tắt tiện lợi cho vòng `while`**.

> *"The first slot of a for loop can declare multiple variables, provided they are of the same type. And the third slot can contain multiple comma-separated expressions:"*

```java
for (int i = 1, j = 10; i <= 10; i++, j--) { ... }
```

> *"While technically legal, this stretches the intuitive meaning of the for loop, and you should consider a while loop instead."*

**Dịch:** Ô thứ nhất của vòng `for` **khai báo được nhiều biến**, miễn chúng **cùng kiểu**. Và ô thứ ba **chứa được nhiều biểu thức ngăn cách bởi dấu phẩy**. Tuy **hợp lệ về mặt kỹ thuật**, cách này **kéo giãn ý nghĩa trực giác của vòng `for`**, và bạn **nên cân nhắc dùng vòng `while`** thay thế.

> *"Listing 3.5 shows a typical example of a for loop."*

> *"The program computes the odds of winning a lottery. For example, if you must pick six numbers from the numbers 1 to 50 to win, then there are (50 × 49 × 48 × 47 × 46 × 45)/(1 × 2 × 3 × 4 × 5 × 6) possible outcomes, so your chance is 1 in 15,890,700. Good luck!"*

> *"In general, if you pick k numbers out of n, there are"*

```
n × (n − 1) × (n − 2) × ⋯ × (n − k + 1)
────────────────────────────────────────
        1 × 2 × 3 × 4 × ⋯ × k
```

> *"possible outcomes. The following for loop computes this value:"*

```java
int lotteryOdds = 1;
for (int i = 1; i <= k; i++)
    lotteryOdds = lotteryOdds * (n - i + 1) / i;
```

**Dịch:** Chương trình tính **xác suất trúng số**. Ví dụ, nếu phải chọn sáu số trong các số từ 1 tới 50 để trúng thì có `(50 × 49 × 48 × 47 × 46 × 45)/(1 × 2 × 3 × 4 × 5 × 6)` kết cục khả dĩ, nên cơ hội của bạn là **1 trên 15.890.700**. Nói chung, chọn **k** số trong **n** số thì công thức như trên.

> **Note (sách):** *"Section 3.10.3 describes the "generalized for loop" (also called "for each" loop) that makes it convenient to visit all elements of an array or collection."*
>
> **Dịch:** [[09 - Arrays#3.10.3. The "for each" Loop|Section 3.10.3]] mô tả **"vòng for tổng quát"** (còn gọi là vòng **"for each"**), giúp **duyệt mọi phần tử của một mảng hay collection** một cách tiện lợi.

### Listing 3.5 — `LotteryOdds/LotteryOdds.java`

```java
import java.util.*;

/**
 * This program demonstrates a <code>for</code> loop.
 * @version 1.20 2004-02-10
 * @author Cay Horstmann
 */
public class LotteryOdds
{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        System.out.print("How many numbers do you need to draw? ");
        int k = in.nextInt();

        System.out.print("What is the highest number you can draw? ");
        int n = in.nextInt();

        /*
         * compute binomial coefficient n*(n-1)*(n-2)*...*(n-k+1)/(1*2*3*...*k)
         */

        int lotteryOdds = 1;
        for (int i = 1; i <= k; i++)
            lotteryOdds = lotteryOdds * (n - i + 1) / i;

        System.out.println("Your odds are 1 in " + lotteryOdds + ". Good luck!");
    }
}
```

---

## 3.8.5. Multiple Selections with switch

> *"The if/else construct can be cumbersome when you have to deal with multiple alternatives for the same expression. The switch statement makes this easier, particularly with the form that has been introduced in Java 14. For example, if you set up a menu system with four alternatives like that in Figure 3.13, you could use code that looks like this:"*

```java
Scanner in = new Scanner(System.in);
System.out.print("Select an option (1, 2, 3, 4) ");
int choice = in.nextInt();
switch (choice)
{
    case 1 ->
        . . .
    case 2 ->
        . . .
    case 3 ->
        . . .
    case 4 ->
        . . .
    default ->
        System.out.println("Bad input");
}
```

> *"Note the similarity to the switch expressions that you saw in Section 3.5.9. Unlike a switch expression, a switch statement has no value. Each case carries out an action."*

**Dịch:** Cấu trúc `if/else` **trở nên cồng kềnh** khi phải xử lý **nhiều nhánh cho cùng một biểu thức**. Câu lệnh **`switch`** làm việc này dễ hơn, **đặc biệt với dạng được giới thiệu ở Java 14**.

Chú ý **sự tương đồng với switch expression** đã thấy ở [[04 - Operators#3.5.9 Switch Expressions — `switch` kiểu mới (Java 14+)|Section 3.5.9]]. **Khác với switch expression, switch statement không có giá trị** — mỗi `case` **thực hiện một hành động**.

### Dạng "cổ điển"

> *"The "classic" form of the switch statement, which dates all the way back to the C language, has been supported since Java 1.0. It has the form:"*

```java
int choice = . . .;
switch (choice)
{
    case 1:
        . . .
        break;
    case 2:
        . . .
        break;
    case 3:
        . . .
        break;
    case 4:
        . . .
        break;
    default:
        System.out.println("Bad input");
}
```

> *"Execution starts at the case label that matches the value on which the selection is performed and continues until the next break or the end of the switch. If none of the case labels match, then the default clause is executed, if it is present."*

**Dịch:** Dạng **"cổ điển"** của câu lệnh `switch`, có từ tận **ngôn ngữ C**, được hỗ trợ **từ Java 1.0**. Việc thực thi **bắt đầu tại case label khớp với giá trị đang được chọn** và **tiếp tục cho tới `break` kế tiếp hoặc tới hết `switch`**. Nếu **không case label nào khớp** thì **mệnh đề `default` được thực thi**, nếu nó có mặt.

> **Caution (sách):** *"It is possible for multiple alternatives to be triggered. If you forget to add a break at the end of an alternative, execution falls through to the next alternative! This behavior is plainly dangerous and a common cause for errors."*
>
> *"To detect such problems, compile your code with the -Xlint:fallthrough option, like this:"*
>
> ```
> javac -Xlint:fallthrough Test.java
> ```
>
> *"Then the compiler will issue a warning whenever an alternative does not end with a break statement."*
>
> *"If you actually want to use the fallthrough behavior, tag the surrounding method with the annotation @SuppressWarnings("fallthrough"). Then no warnings will be generated for that method. (An annotation is a mechanism for supplying information to the compiler or a tool that processes Java source or class files. Volume II has an in-depth coverage of annotations.)"*
>
> **Dịch:** **Nhiều nhánh có thể cùng bị kích hoạt.** Quên thêm `break` ở cuối một nhánh thì **việc thực thi rơi xuyên (fall through) sang nhánh kế tiếp!** Hành vi này **rõ ràng nguy hiểm** và là **nguyên nhân gây lỗi phổ biến**.
>
> Để phát hiện, **compile code với option `-Xlint:fallthrough`** — khi đó compiler **phát cảnh báo mỗi khi một nhánh không kết thúc bằng `break`**.
>
> Nếu thật sự **muốn dùng hành vi fallthrough**, hãy **gắn annotation `@SuppressWarnings("fallthrough")`** vào method bao quanh; khi đó **không cảnh báo nào được sinh ra** cho method đó. Annotation là **cơ chế cung cấp thông tin cho compiler** hoặc cho công cụ xử lý file nguồn / file class Java; **Volume II** bàn sâu về annotation.

### Bốn dạng của switch

> *"For symmetry, Java 14 also introduced a switch expression with fallthrough, for a total of four forms of switch. Table 3.8 shows them all."*

**Dịch:** Để **đối xứng**, Java 14 cũng giới thiệu **switch expression có fallthrough**, tổng cộng thành **bốn dạng `switch`**.

**Table 3.8: The four forms of switch**

**① No Fallthrough — Expression**

```java
int numLetters = switch (seasonName)
{
    case "Spring" ->
    {
        System.out.println("spring time!");
        yield 6;
    }
    case "Summer", "Winter" -> 6;
    case "Fall" -> 4;
    default -> -1;
};
```

**② No Fallthrough — Statement**

```java
switch (seasonName)
{
    case "Spring" ->
    {
        System.out.println("spring time!");
        numLetters = 6;
    }
    case "Summer", "Winter" -> numLetters = 6;
    case "Fall" -> numLetters = 4;
    default -> numLetters = -1;
}
```

**③ Fallthrough — Expression**

```java
int numLetters = switch (seasonName)
{
    case "Spring":
        System.out.println("spring time!");
    case "Summer", "Winter":
        yield 6;
    case "Fall":
        yield 4;
    default:
        yield -1;
};
```

**④ Fallthrough — Statement**

```java
switch (seasonName)
{
    case "Spring":
        System.out.println("spring time!");
    case "Summer", "Winter":
        numLetters = 6;
        break;
    case "Fall":
        numLetters = 4;
        break;
    default:
        numLetters = -1;
}
```

> *"In the fallthrough variants, each case ends with a colon. If the cases end with arrows ->, then there is no fallthrough. You can't mix colons and arrows in a single switch statement."*

**Dịch:** Ở các biến thể **fallthrough**, mỗi `case` **kết thúc bằng dấu hai chấm**. Nếu các `case` **kết thúc bằng mũi tên `->`** thì **không có fallthrough**. **Không được trộn lẫn dấu hai chấm với mũi tên** trong cùng một câu lệnh `switch`.

### `yield`

> *"Each branch of a switch expression must yield a value. Most commonly, each value follows an -> arrow:"*

```java
case "Summer", "Winter" -> 6;
```

> *"If that is not possible, use a yield statement. Like break, it terminates execution. Unlike break, it also yields a value—the value of the expression. To use statements in a branch of a switch expression without fallthrough, you must use braces and yield:"*

```java
case "Spring" ->
{
    System.out.println("spring time!");
    yield 6;
}
```

**Dịch:** **Mỗi nhánh của switch expression phải cho ra (yield) một giá trị.** Phổ biến nhất là **mỗi giá trị đứng sau mũi tên `->`**. Nếu không làm được vậy thì dùng **câu lệnh `yield`**: giống `break`, nó **kết thúc việc thực thi**; **khác `break`**, nó còn **cho ra một giá trị** — giá trị của biểu thức. Muốn **dùng nhiều câu lệnh trong một nhánh** của switch expression không fallthrough thì **phải dùng ngoặc nhọn và `yield`**.

> **Note (sách):** *"It is legal to throw an exception in a branch of a switch expression. For example:"*
>
> ```java
> default -> throw new IllegalArgumentException("Not a valid season");
> ```
>
> *"Exceptions are covered in detail in Chapter 7."*
>
> **Dịch:** **Ném một exception trong một nhánh của switch expression là hợp lệ.** Exception được bàn chi tiết ở **Chapter 7**.

> **Caution (sách):** *"The point of a switch expression is to produce a value (or to fail with an exception). You are not allowed to "jump out":"*
>
> ```java
> default -> { return -1; } // ERROR
> ```
>
> *"Specifically, you cannot use return, break, or continue statements in a switch expression. (See Section 3.8.6 for the latter two.)"*
>
> **Dịch:** Điểm cốt lõi của switch expression là **tạo ra một giá trị** (hoặc **thất bại bằng một exception**). Bạn **không được phép "nhảy ra ngoài"**. Cụ thể, **không dùng được câu lệnh `return`, `break` hay `continue`** trong một switch expression.

### Nên chọn dạng nào

> *"With so many variations of switch, which one should you choose?"*
> 1. *"Avoid the fallthrough forms. It is very uncommon to need fallthrough."*
> 2. *"Prefer switch expressions over statements."*

**Dịch:** Với nhiều biến thể `switch` như vậy, nên chọn cái nào?

| # | Lời khuyên |
|---|---|
| 1 | **Tránh các dạng fallthrough** — rất hiếm khi cần fallthrough |
| 2 | **Ưu tiên switch expression hơn switch statement** |

> *"If each branch computes the value for a variable assignment or method call, yield the value with an expression, and then use it. For example,"*

```java
numLetters = switch (seasonName)
    {
        case "Spring", "Summer", "Winter" -> 6
        case "Fall" -> 4
        default -> -1
    };
```

> *(Chép nguyên văn bản in trang 165: sách in **thiếu dấu `;` ở cuối ba nhánh** — code đúng phải là `-> 6;`, `-> 4;`, `-> -1;`.)*

> *"is better than"*

```java
switch (seasonName)
{
    case "Spring", "Summer", "Winter" ->
        numLetters = 6;
    case "Fall" ->
        numLetters = 4;
    default ->
        numLetters = -1;
}
```

**Dịch:** Nếu mỗi nhánh **tính ra giá trị cho một phép gán biến hoặc một lời gọi method**, hãy **cho ra giá trị bằng một expression rồi dùng nó**. Dạng thứ nhất **tốt hơn** dạng thứ hai.

---

## 3.8.6. Statements That Break Control Flow

> *"Although the designers of Java kept goto as a reserved word, they decided not to include it in the language. In general, goto statements are considered poor style. Some programmers feel the anti-goto forces have gone too far (see, for example, the famous article of Donald Knuth called "Structured Programming with goto statements"). They argue that unrestricted use of goto is error-prone but that an occasional jump out of a loop is beneficial. The Java designers agreed and even added a new statement, the labeled break, to support this programming style."*

**Dịch:** Dù người thiết kế Java **giữ `goto` làm reserved word**, họ **quyết định không đưa nó vào ngôn ngữ**. Nói chung, câu lệnh `goto` bị coi là **style tồi**. Một số lập trình viên cho rằng **phe chống `goto` đã đi quá xa** — xem bài viết nổi tiếng của **Donald Knuth**, *"Structured Programming with goto statements"*. Họ lập luận rằng **dùng `goto` không hạn chế thì dễ sinh lỗi**, nhưng **thỉnh thoảng nhảy ra khỏi một vòng lặp lại có ích**. Người thiết kế Java **đồng ý** và thậm chí **thêm một câu lệnh mới là labeled `break`** để hỗ trợ style lập trình này.

### `break` không nhãn

> *"Let us first look at the unlabeled break statement. The same break statement that you use to exit a switch statement can also be used to break out of a loop. For example:"*

```java
while (years <= 100)
{
    balance += payment;
    double interest = balance * interestRate / 100;
    balance += interest;
    if (balance >= goal) break;
    years++;
}
```

> *"Now the loop is exited if either years > 100 occurs at the top of the loop or balance >= goal occurs in the middle of the loop. Of course, you could have computed the same value for years without a break, like this:"*

```java
while (years <= 100 && balance < goal)
{
    balance += payment;
    double interest = balance * interestRate / 100;
    balance += interest;
    if (balance < goal)
        years++;
}
```

> *"But note that the test balance < goal is repeated twice in this version. To avoid this repeated test, some programmers prefer the break statement."*

**Dịch:** Chính câu lệnh `break` dùng để thoát khỏi `switch` cũng **dùng được để thoát khỏi vòng lặp**. Vòng lặp giờ thoát ra **hoặc khi `years > 100` xảy ra ở đầu vòng lặp, hoặc khi `balance >= goal` xảy ra ở giữa vòng lặp**. Tất nhiên **tính được cùng giá trị `years` mà không cần `break`**, nhưng lưu ý rằng ở bản đó **phép kiểm tra `balance < goal` bị lặp lại hai lần**. Để tránh phép kiểm tra lặp này, **một số lập trình viên thích dùng `break`**.

### `break` có nhãn (labeled break)

> *"The labeled break statement lets you break out of multiple nested loops. Occasionally something weird happens inside a deeply nested loop. In that case, you may want to break completely out of all the nested loops. It is inconvenient to program that simply by adding extra conditions to the various loop tests."*

> *"Here's an example that shows the labeled break statement at work. Notice that the label must precede the outermost loop out of which you want to break. It also must be followed by a colon."*

```java
Scanner in = new Scanner(System.in);
int n;
read_data:
while (. . .) // this loop statement is tagged with the label
{
    . . .
    for (. . .) // this inner loop is not labeled
    {
        System.out.print("Enter a number >= 0: ");
        n = in.nextInt();
        if (n < 0) // should never happen—can't go on
            break read_data;
        // break out of read_data loop
        . . .
    }
}
// this statement is executed immediately after the labeled break
if (n < 0) // check for bad situation
{
    // deal with bad situation
}
else
{
    // carry out normal processing
}
```

> *"If there is a bad input, the labeled break moves past the end of the labeled block. As with any use of the break statement, you then need to test whether the loop exited normally or as a result of a break."*

**Dịch:** Câu lệnh **labeled `break`** cho phép **thoát khỏi nhiều vòng lặp lồng nhau**. Thỉnh thoảng có chuyện kỳ quặc xảy ra **bên trong một vòng lặp lồng sâu**; khi đó bạn muốn **thoát hoàn toàn khỏi mọi vòng lặp lồng nhau**. Lập trình việc đó chỉ bằng cách **thêm điều kiện phụ vào các phép kiểm tra của từng vòng lặp là bất tiện**.

Chú ý: **nhãn phải đứng trước vòng lặp ngoài cùng** mà bạn muốn thoát ra, và **phải theo sau bởi dấu hai chấm**. Nếu có input xấu, labeled `break` **nhảy qua khỏi phần cuối của block có nhãn**. Như với mọi lần dùng `break`, sau đó bạn **cần kiểm tra xem vòng lặp thoát ra bình thường hay do `break`**.

> **Note (sách):** *"Curiously, you can apply a label to any statement, even an if statement or a block statement, like this:"*
>
> ```java
> label:
> {
>     . . .
>     if (condition) break label; // exits block
>     . . .
> }
> // jumps here when the break statement executes
> ```
>
> *"Thus, if you are lusting after a goto and you can place a block that ends just before the place to which you want to jump, you can use a break statement! Naturally, I don't recommend this approach. Note, however, that you can only jump out of a block, never into a block."*
>
> **Dịch:** Kỳ lạ thay, **gắn nhãn được vào câu lệnh bất kỳ**, kể cả một câu lệnh `if` hay một block statement. Vậy nên nếu bạn **đang thèm khát một `goto`** và đặt được một block **kết thúc ngay trước chỗ bạn muốn nhảy tới**, thì **dùng được câu lệnh `break`!** Tất nhiên tác giả **không khuyến nghị** cách này. Lưu ý rằng bạn **chỉ nhảy được ra khỏi một block, không bao giờ nhảy vào trong một block**.

### `continue`

> *"Finally, there is a continue statement that, like the break statement, breaks the regular flow of control. The continue statement transfers control to the header of the innermost enclosing loop. Here is an example:"*

```java
Scanner in = new Scanner(System.in);
while (sum < goal)
{
    System.out.print("Enter a number: ");
    n = in.nextInt();
    if (n < 0) continue;
    sum += n; // not executed if n < 0
}
```

> *"If n < 0, then the continue statement jumps immediately to the loop header, skipping the remainder of the current iteration."*

**Dịch:** Cuối cùng là câu lệnh **`continue`**, cũng **phá vỡ luồng điều khiển thông thường** như `break`. Câu lệnh `continue` **chuyển quyền điều khiển tới phần đầu của vòng lặp bao quanh trong cùng nhất**. Nếu `n < 0` thì `continue` **nhảy ngay lập tức tới phần đầu vòng lặp, bỏ qua phần còn lại của lượt lặp hiện tại**.

> *"If the continue statement is used in a for loop, it jumps to the "update" part of the for loop. For example:"*

```java
for (count = 1; count <= 100; count++)
{
    System.out.print("Enter a number, -1 to quit: ");
    n = in.nextInt();
    if (n < 0) continue;
    sum += n; // not executed if n < 0
}
```

> *"If n < 0, then the continue statement jumps to the count++ statement."*

> *"There is also a labeled form of the continue statement that jumps to the header of the loop with the matching label."*

**Dịch:** Dùng `continue` trong vòng `for` thì nó **nhảy tới phần "update"** của vòng `for` — trong ví dụ trên là **nhảy tới câu lệnh `count++`**. Cũng có **dạng có nhãn của `continue`**, nhảy tới **phần đầu của vòng lặp mang nhãn khớp**.

> **Tip (sách):** *"Many programmers find the break and continue statements confusing. These statements are entirely optional—you can always express the same logic without them. None of the programs in this book use break or continue."*
>
> **Dịch:** Nhiều lập trình viên thấy câu lệnh `break` và `continue` **gây rối**. Những câu lệnh này **hoàn toàn là tuỳ chọn** — bạn **luôn diễn đạt được cùng logic mà không cần chúng**. **Không chương trình nào trong sách này dùng `break` hay `continue`.**

---

## Bài kế tiếp

→ [[08 - Big Numbers]] — `BigInteger` và `BigDecimal` khi độ chính xác của kiểu số cơ bản không đủ.
