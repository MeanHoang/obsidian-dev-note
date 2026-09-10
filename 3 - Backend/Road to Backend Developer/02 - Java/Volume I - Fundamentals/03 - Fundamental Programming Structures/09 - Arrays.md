# 09 — Arrays

> Chapter 3, Section 3.10 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 3.10. Arrays

> *"Arrays hold sequences of values of the same type. In the following sections, you will see how to work with arrays in Java."*

**Dịch:** Mảng **chứa các dãy giá trị cùng kiểu**.

---

## 3.10.1. Declaring Arrays

> *"Declare an array variable by specifying the array type—which is the element type followed by []—and the array variable name. For example, here is the declaration of an array a of integers:"*

```java
int[] a;
```

> *"However, this statement only declares the variable a. It does not yet initialize a with an actual array. Use the new operator to create the array."*

```java
int[] a = new int[100]; // or var a = new int[100];
```

> *"This statement declares and initializes an array of 100 integers."*

**Dịch:** Khai báo biến mảng bằng cách nêu **kiểu mảng** — tức **kiểu phần tử theo sau bởi `[]`** — rồi tới **tên biến mảng**. Nhưng câu lệnh `int[] a;` **chỉ khai báo biến `a`**, **chưa khởi tạo `a` bằng một mảng thật**. Dùng **toán tử `new`** để tạo mảng.

> *"The array length need not be a constant: new int[n] creates an array of length n."*

> *"Once you create an array, you cannot change its length (although you can, of course, change an individual array element). If you frequently need to expand the length of arrays while your program is running, you should use array lists, which are covered in Chapter 5."*

> *"The type of an array variable does not include the length. For example, the variable a in the preceding example has type int[] and can be set to an int array of any length."*

**Dịch:** **Độ dài mảng không nhất thiết là hằng số**: `new int[n]` tạo mảng độ dài `n`.

Tạo mảng xong thì **không đổi được độ dài của nó** (tất nhiên vẫn đổi được **từng phần tử**). Nếu thường xuyên cần **mở rộng độ dài mảng lúc chương trình đang chạy** thì nên dùng **array list**, bàn ở **Chapter 5**.

**Kiểu của một biến mảng không bao gồm độ dài.** Biến `a` ở ví dụ trên có kiểu `int[]` và **gán được bằng mảng `int` với độ dài bất kỳ**.

> **Note (sách):** *"You can define an array variable either as"*
>
> ```java
> int[] a;
> ```
>
> *"or as"*
>
> ```java
> int a[];
> ```
>
> *"Most Java programmers prefer the former style because it neatly separates the type int[] (integer array) from the variable name."*
>
> **Dịch:** Định nghĩa biến mảng theo **một trong hai cách** trên. **Đa số lập trình viên Java thích cách thứ nhất** vì nó **tách gọn gàng kiểu `int[]`** (mảng số nguyên) **khỏi tên biến**.

### Cú pháp rút gọn khi có sẵn giá trị

> *"Java has a shortcut for creating an array object and supplying initial values:"*

```java
int[] smallPrimes = { 2, 3, 5, 7, 11, 13 };
```

> *"Notice that you do not use new with this syntax, and you don't specify the length."*

> *"A comma after the last value is allowed, which can be convenient for an array to which you keep adding values over time:"*

```java
String[] authors =
{
    "James Gosling",
    "Bill Joy",
    "Guy Steele",
    // add more names here and put a comma after each name
};
```

**Dịch:** Java có **lối viết tắt** để tạo object mảng và **cấp luôn giá trị ban đầu**. Chú ý: với cú pháp này **không dùng `new`** và **không chỉ định độ dài**. **Dấu phẩy sau giá trị cuối cùng là hợp lệ** — điều này tiện với mảng mà bạn **liên tục thêm giá trị vào theo thời gian**.

### Mảng vô danh (anonymous array)

> *"You can declare an anonymous array:"*

```java
new int[] { 17, 19, 23, 29, 31, 37 }
```

> *"This expression allocates a new array and fills it with the values inside the braces. It counts the number of initial values and sets the array length accordingly. You can use this syntax to reinitialize an array without creating a new variable. For example,"*

```java
smallPrimes = new int[] { 17, 19, 23, 29, 31, 37 };
```

> *"is shorthand for"*

```java
int[] anonymous = { 17, 19, 23, 29, 31, 37 };
smallPrimes = anonymous;
```

**Dịch:** Khai báo được **mảng vô danh**. Biểu thức này **cấp phát một mảng mới** và **điền vào bằng các giá trị trong ngoặc nhọn**; nó **đếm số giá trị ban đầu** và **đặt độ dài mảng cho khớp**. Dùng cú pháp này để **khởi tạo lại một mảng mà không cần tạo biến mới**.

> **Note (sách):** *"It is legal to have arrays of length 0. Such an array can be useful if you write a method that computes an array result and the result happens to be empty. Construct an array of length 0 as"*
>
> ```java
> new elementType[0]
> ```
>
> *"or"*
>
> ```java
> new elementType[] {}
> ```
>
> *"Note that an array of length 0 is not the same as null."*
>
> **Dịch:** **Mảng độ dài 0 là hợp lệ.** Mảng như vậy **hữu ích khi bạn viết một method tính ra kết quả là mảng mà kết quả tình cờ rỗng**. Lưu ý: **mảng độ dài 0 không giống `null`**.

---

## 3.10.2. Accessing Array Elements

> *"You access each individual element of an array through an integer index, using the bracket operator. For example, if a is an array of integers, then a[i] is the element with index i in the array."*

> *"The array elements are numbered starting from 0. The last valid index is one less than the length. In the example below, the index values range from 0 to 99. Once the array is created, you can fill the elements in an array, for example, by using a loop:"*

```java
int[] a = new int[100];
for (int i = 0; i < 100; i++)
    a[i] = i; // fills the array with numbers 0 to 99
```

**Dịch:** Truy cập từng phần tử của mảng **qua một chỉ số nguyên**, dùng **toán tử ngoặc vuông**. Phần tử mảng được **đánh số bắt đầu từ 0**; **chỉ số hợp lệ cuối cùng nhỏ hơn độ dài một đơn vị**.

> *"When you create an array of numbers, all elements are initialized with zero. Arrays of boolean are initialized with false. Arrays of objects are initialized with the special value null, which indicates that they do not (yet) hold any objects. This can be surprising for beginners. For example,"*

```java
String[] names = new String[10];
```

> *"creates an array of ten strings, all of which are null. If you want the array to hold empty strings, you must supply them:"*

```java
for (int i = 0; i < 10; i++) names[i] = "";
```

**Dịch:** Tạo mảng số thì **mọi phần tử được khởi tạo bằng 0**. Mảng `boolean` được khởi tạo bằng **`false`**. Mảng object được khởi tạo bằng **giá trị đặc biệt `null`**, báo rằng chúng **(chưa) chứa object nào**. Điều này **có thể gây bất ngờ cho người mới**: đoạn code trên tạo một mảng **mười string, tất cả đều là `null`**. Muốn mảng chứa **chuỗi rỗng** thì **phải tự cấp chúng vào**.

> **Caution (sách):** *"If you construct an array with 100 elements and then try to access the element a[100] (or any other index outside the range from 0 to 99), an "array index out of bounds" exception will occur."*
>
> **Dịch:** Nếu dựng một mảng 100 phần tử rồi thử truy cập phần tử `a[100]` (hoặc **bất kỳ chỉ số nào ngoài khoảng 0 tới 99**), thì **exception "array index out of bounds" sẽ xảy ra**.

> *"To find the number of elements of an array, use array.length. For example:"*

```java
for (int i = 0; i < a.length; i++)
    System.out.println(a[i]);
```

**Dịch:** Muốn biết **số phần tử của một mảng** thì dùng **`array.length`**.

---

## 3.10.3. The "for each" Loop

> *"Java has a powerful looping construct that allows you to loop through each element in an array (or any other collection of elements) without having to fuss with index values."*

> *"The enhanced for loop"*

```java
for (variable : collection) statement
```

> *"sets the given variable to each element of the collection and then executes the statement (which, of course, may be a block). The collection expression must be an array or an object of a class that implements the Iterable interface, such as ArrayList. Array lists are covered in Chapter 5 and the Iterable interface in Chapter 9."*

**Dịch:** Java có **cấu trúc lặp mạnh mẽ** cho phép **duyệt từng phần tử trong một mảng** (hoặc bất kỳ collection nào khác) **mà không phải loay hoay với giá trị chỉ số**.

**Vòng `for` mở rộng (enhanced `for` loop)** **đặt biến cho trước bằng từng phần tử của collection** rồi **thực thi câu lệnh** (tất nhiên có thể là một block). Biểu thức collection **phải là một mảng, hoặc một object của class implement interface `Iterable`** như `ArrayList`. Array list bàn ở **Chapter 5**, interface `Iterable` ở **Chapter 9**.

> *"For example,"*

```java
for (int element : a)
    System.out.println(element);
```

> *"prints each element of the array a on a separate line."*

> *"You should read this loop as "for each element in a." The designers of the Java language considered using keywords, such as foreach and in. But this loop was a late addition to the Java language, and in the end nobody wanted to break the old code that already contained methods or variables with these names (such as System.in)."*

**Dịch:** Nên **đọc vòng lặp này là "for each element in a"**. Người thiết kế ngôn ngữ Java **đã cân nhắc dùng các keyword như `foreach` và `in`**. Nhưng vòng lặp này là **phần thêm vào muộn** của ngôn ngữ Java, và **rốt cuộc chẳng ai muốn phá vỡ code cũ vốn đã chứa method hay biến mang những tên đó** (như `System.in`).

> *"Of course, you could achieve the same effect with a traditional for loop:"*

```java
for (int i = 0; i < a.length; i++)
    System.out.println(a[i]);
```

> *"However, the "for each" loop is more concise and less error-prone, as you don't have to worry about those pesky start and end index values."*

**Dịch:** Tất nhiên đạt được **cùng hiệu quả bằng vòng `for` truyền thống**. Nhưng vòng **"for each" gọn hơn và ít gây lỗi hơn**, vì **khỏi phải bận tâm mấy giá trị chỉ số đầu cuối phiền phức**.

> **Note (sách):** *"The loop variable of the "for each" loop traverses the elements of the array, not the index values."*
>
> **Dịch:** Biến vòng lặp của vòng "for each" **duyệt các phần tử của mảng, không phải các giá trị chỉ số**.

> *"The "for each" loop is a pleasant improvement over the traditional loop if you need to process all elements in a collection. However, there are still plenty of opportunities to use the traditional for loop. For example, you might not want to traverse the entire collection, or you may need the index value inside the loop."*

**Dịch:** Vòng "for each" là **cải tiến dễ chịu** so với vòng lặp truyền thống **nếu bạn cần xử lý mọi phần tử trong một collection**. Tuy vậy **vẫn còn nhiều dịp để dùng vòng `for` truyền thống**: ví dụ khi bạn **không muốn duyệt toàn bộ collection**, hoặc **cần giá trị chỉ số bên trong vòng lặp**.

> **Tip (sách):** *"There is an even easier way to print all values of an array, using the toString method of the Arrays class. The call Arrays.toString(a) returns a string containing the array elements, enclosed in brackets and separated by commas, such as "[2, 3, 5, 7, 11, 13]". To print the array, simply call"*
>
> ```java
> System.out.println(Arrays.toString(a));
> ```
>
> **Dịch:** Có cách **còn dễ hơn** để in mọi giá trị của một mảng: dùng method **`toString` của class `Arrays`**. Lời gọi `Arrays.toString(a)` trả về **một string chứa các phần tử mảng, bọc trong ngoặc vuông và ngăn cách bởi dấu phẩy**, ví dụ `"[2, 3, 5, 7, 11, 13]"`.

---

## 3.10.4. Array Copying

> *"You can copy one array variable into another, but then both variables refer to the same array:"*

```java
int[] luckyNumbers = smallPrimes;
luckyNumbers[5] = 12; // now smallPrimes[5] is also 12
```

> *"Figure 3.14 shows the result."*

**Dịch:** Copy được **một biến mảng sang biến khác**, nhưng khi đó **cả hai biến trỏ tới cùng một mảng**.

**Figure 3.14: Copying an array variable**

```
   smallPrimes                      heap
  ┌──────────┐            ┌──────────────────────────┐
  │ địa chỉ ─┼───────────►│  [2, 3, 5, 7, 12, 13]    │
  └──────────┘            │                          │
   luckyNumbers           │                          │
  ┌──────────┐            │                          │
  │ địa chỉ ─┼───────────►│                          │
  └──────────┘            └──────────────────────────┘
     hai biến, MỘT mảng
```

> *"If you actually want to copy all values of one array into a new array, use the copyOf method in the Arrays class:"*

```java
int[] copiedLuckyNumbers = Arrays.copyOf(luckyNumbers, luckyNumbers.length);
```

> *"The second argument is the length of the new array. A common use of this method is to increase the length of an array:"*

```java
luckyNumbers = Arrays.copyOf(luckyNumbers, 2 * luckyNumbers.length);
```

> *"The additional elements are filled with 0 if the array contains numbers, false if the array contains boolean values. Conversely, if the length is less than the length of the original array, only the initial values are copied."*

**Dịch:** Nếu thực sự muốn **copy mọi giá trị của một mảng sang một mảng mới** thì dùng method **`copyOf`** trong class `Arrays`. **Argument thứ hai là độ dài của mảng mới.** Một công dụng phổ biến của method này là **tăng độ dài mảng**.

Các **phần tử thêm vào được điền bằng `0`** nếu mảng chứa số, bằng **`false`** nếu mảng chứa giá trị boolean. Ngược lại, nếu **độ dài nhỏ hơn độ dài mảng gốc** thì **chỉ các giá trị đầu được copy**.

> **C++ Note (sách):** *"A Java array is quite different from a C++ array on the stack. It is, however, essentially the same as a pointer to an array allocated on the heap. That is,"*
>
> ```java
> int[] a = new int[100]; // Java
> ```
>
> *"is not the same as"*
>
> ```cpp
> int a[100]; // C++
> ```
>
> *"but rather"*
>
> ```cpp
> int* a = new int[100]; // C++
> ```
>
> *"In Java, the [] operator is predefined to perform bounds checking. Furthermore, there is no pointer arithmetic—you can't increment a to point to the next element in the array."*
>
> **Dịch:** Mảng Java **khác hẳn mảng C++ nằm trên stack**. Nó **về cơ bản giống một pointer trỏ tới mảng được cấp phát trên heap**. Trong Java, **toán tử `[]` được định nghĩa sẵn để thực hiện bounds checking**. Hơn nữa, **không có pointer arithmetic** — bạn **không tăng `a` lên để trỏ tới phần tử kế tiếp trong mảng được**.

---

## 3.10.5. Command-Line Arguments

> *"You have already seen one example of a Java array repeated quite a few times. Every Java program has a main method with a String[] args parameter variable. This parameter indicates that the main method receives an array of strings—namely, the arguments specified on the command line. For example, consider this program:"*

```java
public class Message
{
    public static void main(String[] args)
    {
        if (args.length == 0 || args[0].equals("-h"))
            System.out.print("Hello,");
        else if (args[0].equals("-g"))
            System.out.print("Goodbye,");
        // print the other command-line arguments
        for (int i = 1; i < args.length; i++)
            System.out.print(" " + args[i]);
        System.out.println("!");
    }
}
```

> *"If the program is called as"*

```
java Message -g cruel world
```

> *"then the args array has the following contents:"*

```
args[0]: "-g"
args[1]: "cruel"
args[2]: "world"
```

> *"The program prints the message"*

```
Goodbye, cruel world!
```

**Dịch:** Bạn **đã thấy một ví dụ về mảng Java lặp lại khá nhiều lần**: mọi chương trình Java đều có method `main` với **biến parameter `String[] args`**. Parameter này cho biết method `main` **nhận một mảng string** — chính là **các argument được nêu trên dòng lệnh**.

> **C++ Note (sách):** *"Unlike in C++, the name of the program is not stored in the array of command-line arguments. For example, when you start up a program as"*
>
> ```
> java Message -h world
> ```
>
> *"from the command line, then args[0] will be "-h" and not "Message" or "java"."*
>
> **Dịch:** Khác C++, **tên chương trình không được lưu trong mảng command-line argument**. Khi khởi động chương trình như trên từ dòng lệnh thì `args[0]` sẽ là **`"-h"`**, chứ **không phải `"Message"` hay `"java"`**.

---

## 3.10.6. Array Sorting

> *"To sort an array of numbers, you can use one of the sort methods in the Arrays class:"*

```java
int[] a = new int[10000];
. . .
Arrays.sort(a)
```

> *"This method uses a tuned version of the QuickSort algorithm that is claimed to be very efficient on most data sets. The Arrays class provides several other convenience methods for arrays that are included in the API notes at the end of this section."*

**Dịch:** Muốn **sắp xếp một mảng số** thì dùng một trong các method **`sort`** của class `Arrays`. Method này dùng **một phiên bản đã được tinh chỉnh của thuật toán QuickSort**, được cho là **rất hiệu quả trên hầu hết tập dữ liệu**.

> *"The program in Listing 3.7 puts arrays to work. This program draws a random combination of numbers for a lottery game. For example, if you play a "choose 6 numbers from 49" lottery, the program might print this:"*

```
Bet the following combination. It'll make you rich!
4
7
8
19
30
44
```

> *"To select such a random set of numbers, first fill an array numbers with the values 1, 2, . . ., n:"*

```java
int[] numbers = new int[n];
for (int i = 0; i < numbers.length; i++)
    numbers[i] = i + 1;
```

> *"A second array holds the numbers to be drawn:"*

```java
int[] result = new int[k];
```

> *"Now draw k numbers. The Math.random method returns a random floating-point number that is between 0 (inclusive) and 1 (exclusive). Multiplying the result with n yields a random number between 0 and n – 1."*

```java
int r = (int) (Math.random() * n);
```

> *"Set the ith result to be the number at that index. Initially, that is just r + 1, but as you'll see presently, the contents of the numbers array are changed after each draw."*

```java
result[i] = numbers[r];
```

> *"Now, you must be sure never to draw that number again—all lottery numbers must be distinct. Therefore, overwrite numbers[r] with the last number in the array and reduce n by 1."*

```java
numbers[r] = numbers[n - 1];
n--;
```

> *"The point is that in each draw we pick an index, not the actual value. The index points into an array that contains the values that have not yet been drawn."*

**Dịch:** Method **`Math.random`** trả về **một số thực ngẫu nhiên nằm giữa 0 (bao gồm) và 1 (không bao gồm)**. Nhân kết quả với `n` cho ra **một số ngẫu nhiên giữa 0 và n − 1**.

Đặt **kết quả thứ `i`** là số nằm tại chỉ số đó. Ban đầu đó chỉ là `r + 1`, nhưng như sẽ thấy ngay sau đây, **nội dung của mảng `numbers` thay đổi sau mỗi lần bốc**.

Giờ phải chắc chắn **không bao giờ bốc lại số đó nữa** — **mọi số xổ số phải khác nhau**. Vì vậy, **ghi đè `numbers[r]` bằng số cuối cùng trong mảng và giảm `n` đi 1**.

Điểm mấu chốt là ở **mỗi lần bốc, ta chọn một chỉ số chứ không phải giá trị thật**. Chỉ số đó **trỏ vào một mảng chứa những giá trị chưa được bốc**.

> *"After drawing k lottery numbers, sort the result array for a more pleasing output:"*

```java
Arrays.sort(result);
for (int r : result)
    System.out.println(r);
```

**Dịch:** Sau khi bốc `k` số, **sắp xếp mảng `result`** để **output dễ nhìn hơn**.

### Listing 3.7 — `LotteryDrawing/LotteryDrawing.java`

```java
import java.util.*;

/**
 * This program demonstrates array manipulation.
 * @version 1.20 2004-02-10
 * @author Cay Horstmann
 */
public class LotteryDrawing
{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);

        System.out.print("How many numbers do you need to draw? ");
        int k = in.nextInt();

        System.out.print("What is the highest number you can draw? ");
        int n = in.nextInt();

        // fill an array with numbers 1 2 3 . . . n
        int[] numbers = new int[n];
        for (int i = 0; i < numbers.length; i++)
            numbers[i] = i + 1;

        // draw k numbers and put them into a second array
        int[] result = new int[k];
        for (int i = 0; i < result.length; i++)
        {
            // make a random index between 0 and n - 1
            int r = (int) (Math.random() * n);

            // pick the element at the random location
            result[i] = numbers[r];

            // move the last element into the random location
            numbers[r] = numbers[n - 1];
            n--;
        }

        // print the sorted array
        Arrays.sort(result);
        System.out.println("Bet the following combination. It'll make you rich!");
        for (int r : result)
            System.out.println(r);
    }
}
```

---

## API — `java.util.Arrays` (Java 1.2)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `static String toString(T[] a)` *(Java 5.0)* | trả về một string chứa các phần tử của `a`, **bọc trong ngoặc vuông và ngăn cách bởi dấu phẩy**. Ở method này và các method sau, **kiểu thành phần `T`** của mảng có thể là `int`, `long`, `short`, `char`, `byte`, `boolean`, `float` hoặc `double` |
| `static T[] copyOf(T[] a, int end)` *(Java 6)*<br>`static T[] copyOfRange(T[] a, int start, int end)` *(Java 6)* | trả về **một mảng cùng kiểu với `a`**, độ dài là `end` hoặc `end – start`, được điền bằng các giá trị của `a`. Nếu `end` **lớn hơn `a.length`** thì kết quả được **độn thêm giá trị `0` hoặc `false`** |
| `static void sort(T[] a)` | **sắp xếp mảng**, dùng thuật toán QuickSort đã được tinh chỉnh |
| `static void fill(T[] a, T v)` | **đặt mọi phần tử của mảng thành `v`** |
| `static boolean equals(T[] a, T[] b)` | trả về `true` nếu **hai mảng có cùng độ dài** và **các phần tử ở những chỉ số tương ứng khớp nhau** |

---

## 3.10.7. Multidimensional Arrays

> *"Multidimensional arrays use more than one index to access array elements. They are used for tables and other more complex arrangements. You can safely skip this section until you have a need for this storage mechanism."*

> *"Suppose you want to make a table of numbers that shows how much an investment of $10,000 will grow under different interest rate scenarios in which interest is paid annually and reinvested."*

**Dịch:** Mảng nhiều chiều dùng **nhiều hơn một chỉ số** để truy cập phần tử. Chúng được dùng cho **bảng và các cách sắp xếp phức tạp hơn**. Bạn **cứ yên tâm bỏ qua section này** cho tới khi thật sự cần cơ chế lưu trữ này.

| 5% | 6% | 7% | 8% | 9% | 10% |
|---|---|---|---|---|---|
| 10000.00 | 10000.00 | 10000.00 | 10000.00 | 10000.00 | 10000.00 |
| 10500.00 | 10600.00 | 10700.00 | 10800.00 | 10900.00 | 11000.00 |
| 11025.00 | 11236.00 | 11449.00 | 11664.00 | 11881.00 | 12100.00 |
| 11576.25 | 11910.16 | 12250.43 | 12597.12 | 12950.29 | 13310.00 |
| 12155.06 | 12624.77 | 13107.96 | 13604.89 | 14115.82 | 14641.00 |
| 12762.82 | 13382.26 | 14025.52 | 14693.28 | 15386.24 | 16105.10 |
| 13400.96 | 14185.19 | 15007.30 | 15868.74 | 16771.00 | 17715.61 |
| 14071.00 | 15036.30 | 16057.81 | 17138.24 | 18280.39 | 19487.17 |
| 14774.55 | 15938.48 | 17181.86 | 18509.30 | 19925.63 | 21435.89 |
| 15513.28 | 16894.79 | 18384.59 | 19990.05 | 21718.93 | 23579.48 |

> *"You can store this information in a two-dimensional array named balances. Declaring a two-dimensional array in Java is simple enough. For example:"*

```java
double[][] balances;
```

> *"You cannot use the array until you initialize it. In this case, you can do the initialization as follows:"*

```java
balances = new double[NYEARS][NRATES];
```

> *"In other cases, if you know the array elements, you can use a shorthand notation for initializing a multidimensional array without a call to new. For example:"*

```java
int[][] magicSquare =
{
    {16, 3, 2, 13},
    {5, 10, 11, 8},
    {9, 6, 7, 12},
    {4, 15, 14, 1}
};
```

> *"Once the array is initialized, you can access individual elements by supplying two pairs of brackets—for example, balances[i][j]."*

**Dịch:** Lưu thông tin này trong một **mảng hai chiều** tên `balances`. **Khai báo mảng hai chiều trong Java khá đơn giản**, nhưng **không dùng được mảng cho tới khi khởi tạo nó**. Ở trường hợp khác, nếu **đã biết các phần tử mảng**, dùng được **ký hiệu rút gọn** để khởi tạo mảng nhiều chiều **mà không cần gọi `new`**.

Khởi tạo xong thì truy cập từng phần tử bằng cách **cấp hai cặp ngoặc vuông** — ví dụ `balances[i][j]`.

> *"The example program stores a one-dimensional array interest of interest rates and a two-dimensional array balances of account balances, one for each year and interest rate. Initialize the first row of the array with the initial balance:"*

```java
for (int j = 0; j < balances[0].length; j++)
    balances[0][j] = 10000;
```

> *"Then compute the other rows, as follows:"*

```java
for (int i = 1; i < balances.length; i++)
{
    for (int j = 0; j < balances[i].length; j++)
    {
        double oldBalance = balances[i - 1][j];
        double interest = . . .;
        balances[i][j] = oldBalance + interest;
    }
}
```

**Dịch:** Chương trình ví dụ lưu **một mảng một chiều `interest`** chứa các lãi suất, và **một mảng hai chiều `balances`** chứa số dư tài khoản — **mỗi năm và mỗi lãi suất một ô**. **Khởi tạo hàng đầu tiên** của mảng bằng số dư ban đầu, rồi **tính các hàng còn lại**.

> **Note (sách):** *"A "for each" loop does not automatically loop through all elements in a two-dimensional array. Instead, it loops through the rows, which are themselves one-dimensional arrays. To visit all elements of a two-dimensional array a, nest two loops, like this:"*
>
> ```java
> for (double[] row : a)
>     for (double value : row)
>         do something with value
> ```
>
> **Dịch:** Vòng **"for each" không tự động duyệt mọi phần tử trong một mảng hai chiều**. Thay vào đó nó **duyệt các hàng**, mà bản thân mỗi hàng **là một mảng một chiều**. Muốn thăm mọi phần tử của mảng hai chiều `a` thì **lồng hai vòng lặp**.

> **Tip (sách):** *"To print out a quick-and-dirty list of the elements of a two-dimensional array, call"*
>
> ```java
> System.out.println(Arrays.deepToString(a));
> ```
>
> *"The output is formatted like this:"*
>
> ```
> [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]
> ```
>
> **Dịch:** Muốn in nhanh và thô một danh sách các phần tử của mảng hai chiều thì gọi **`Arrays.deepToString(a)`**.

### Listing 3.8 — `CompoundInterest/CompoundInterest.java`

```java
/**
 * This program shows how to store tabular data in a 2D array.
 * @version 1.41 2023-11-28
 * @author Cay Horstmann
 */
public class CompoundInterest
{
    public static void main(String[] args)
    {
        final double STARTRATE = 5;
        final int NRATES = 6;
        final int NYEARS = 10;

        // set interest rates to 5 . . . 10%
        double[] interestRate = new double[NRATES];
        for (int j = 0; j < interestRate.length; j++)
            interestRate[j] = (STARTRATE + j) / 100.0;

        double[][] balances = new double[NYEARS][NRATES];

        // set initial balances to 10000
        for (int j = 0; j < balances[0].length; j++)
            balances[0][j] = 10000;

        // compute interest for future years
        for (int i = 1; i < balances.length; i++)
        {
            for (int j = 0; j < balances[i].length; j++)
            {
                // get last year's balances from previous row
                double oldBalance = balances[i - 1][j];

                // compute interest
                double interest = oldBalance * interestRate[j];

                // compute this year's balances
                balances[i][j] = oldBalance + interest;
            }
        }

        // print one row of interest rates
        for (int j = 0; j < interestRate.length; j++)
            System.out.printf("%9.0f%%", 100 * interestRate[j]);

        System.out.println();

        // print balance table
        for (double[] row : balances)
        {
            // print table row
            for (double b : row)
                System.out.printf("%10.2f", b);

            System.out.println();
        }
    }
}
```

---

## 3.10.8. Ragged Arrays

> *"So far, what you have seen is not too different from other programming languages. But there is actually something subtle going on behind the scenes that you can sometimes turn to your advantage: Java has no multidimensional arrays at all, only one-dimensional arrays. Multidimensional arrays are faked as "arrays of arrays.""*

> *"For example, the balances array in the preceding example is actually an array that contains ten elements, each of which is an array of six floating-point numbers (Figure 3.15)."*

**Dịch:** Tới giờ, những gì bạn thấy **không khác lắm so với các ngôn ngữ khác**. Nhưng thực ra có **một chuyện tinh vi diễn ra sau hậu trường** mà đôi khi bạn **biến thành lợi thế** được: **Java hoàn toàn không có mảng nhiều chiều, chỉ có mảng một chiều**. Mảng nhiều chiều **được giả lập dưới dạng "mảng của các mảng"**.

Mảng `balances` ở ví dụ trước **thực chất là một mảng chứa mười phần tử**, mà **mỗi phần tử là một mảng sáu số thực**.

**Figure 3.15: A two-dimensional array**

```
   balances
  ┌──────────┐        ┌──────────────────────────────────┐
  │   [0] ───┼───────►│ [10000.00, 10000.00, ... 6 phần tử]
  │   [1] ───┼───────►│ [10500.00, 10600.00, ...]
  │   [2] ───┼───────►│ [11025.00, 11236.00, ...]
  │    ...   │        │              ...
  │   [9] ───┼───────►│ [15513.28, 16894.79, ...]
  └──────────┘        └──────────────────────────────────┘
   mảng 10 phần tử       mỗi phần tử là một mảng double
```

> *"The expression balances[i] refers to the ith subarray—that is, the ith row of the table. It is itself an array, and balances[i][j] refers to the jth element of that array."*

> *"Since rows of arrays are individually accessible, you can actually swap them!"*

```java
double[] temp = balances[i];
balances[i] = balances[i + 1];
balances[i + 1] = temp;
```

**Dịch:** Biểu thức `balances[i]` **trỏ tới subarray thứ `i`** — tức **hàng thứ `i` của bảng**. Bản thân nó **là một mảng**, và `balances[i][j]` **trỏ tới phần tử thứ `j` của mảng đó**.

Vì **các hàng của mảng truy cập được riêng lẻ**, nên bạn **hoán đổi chúng được thật sự!**

> *"Note that the number of rows and columns is not a part of the type of an array variable. The variable balances has type double[][]: an array of double arrays."*

> *"Therefore, you can make "ragged" arrays—that is, arrays in which different rows have different lengths. Here is the standard example. Let us make an array in which the element at row i and column j equals the number of possible outcomes of a "choose j numbers from i numbers" lottery."*

```
1
1  1
1  2  1
1  3  3  1
1  4  6  4  1
1  5 10 10  5  1
1  6 15 20 15  6  1
```

> *"As j can never be larger than i, the matrix is triangular. The ith row has i + 1 elements. (It is OK to choose 0 elements; there is one way to make such a choice.) To build this ragged array, first allocate the array holding the rows:"*

```java
final int NMAX = 10;
int[][] odds = new int[NMAX + 1][];
```

> *"Next, allocate the rows:"*

```java
for (int n = 0; n <= NMAX; n++)
    odds[n] = new int[n + 1];
```

> *"Now that the array is allocated, you can access the elements in the normal way, provided you do not overstep the bounds:"*

```java
for (int n = 0; n < odds.length; n++)
    for (int k = 0; k < odds[n].length; k++)
    {
        // compute lotteryOdds
        . . .
        odds[n][k] = lotteryOdds;
    }
```

**Dịch:** Lưu ý rằng **số hàng và số cột không thuộc kiểu của một biến mảng**. Biến `balances` có kiểu `double[][]`: **một mảng của các mảng `double`**.

Vì vậy tạo được **mảng "răng cưa" (ragged)** — tức **mảng mà các hàng khác nhau có độ dài khác nhau**. Vì `j` **không bao giờ lớn hơn `i`** nên **ma trận có dạng tam giác**; **hàng thứ `i` có `i + 1` phần tử** (chọn 0 phần tử là hợp lệ — có đúng một cách để chọn như vậy).

Để dựng mảng răng cưa này, trước hết **cấp phát mảng chứa các hàng**, rồi **cấp phát từng hàng**. Cấp phát xong thì **truy cập các phần tử theo cách bình thường**, miễn là **không vượt quá giới hạn**.

> **Note (sách):** *"Just as with one-dimensional arrays, it is legal to construct multi-dimensional arrays where a dimension is zero. For example,"*
>
> ```java
> new int[3][0]
> ```
>
> *"has three rows, each of which happen to have length zero. In contrast,"*
>
> ```java
> new int[0][3]
> ```
>
> *"has no rows. The row length is immaterial, since no rows are actually allocated. In other words, new int[0][3], new int[0][4], and new int[0][] are all the same."*
>
> **Dịch:** Cũng như với mảng một chiều, **dựng mảng nhiều chiều có một chiều bằng 0 là hợp lệ**. `new int[3][0]` **có ba hàng, mỗi hàng tình cờ có độ dài bằng 0**. Ngược lại, `new int[0][3]` **không có hàng nào**; **độ dài hàng là vô nghĩa** vì **thực tế chẳng hàng nào được cấp phát**. Nói cách khác, `new int[0][3]`, `new int[0][4]` và `new int[0][]` **đều như nhau**.

> **C++ Note (sách):** *"In C++, the Java declaration"*
>
> ```java
> double[][] balances = new double[10][6]; // Java
> ```
>
> *"is not the same as"*
>
> ```cpp
> double balances[10][6]; // C++
> ```
>
> *"or even"*
>
> ```cpp
> double (*balances)[6] = new double[10][6]; // C++
> ```
>
> *"Instead, an array of ten pointers is allocated:"*
>
> ```cpp
> double** balances = new double*[10]; // C++
> ```
>
> *"Then, each element in the pointer array is filled with an array of six numbers:"*
>
> ```cpp
> for (i = 0; i < 10; i++)
>     balances[i] = new double[6];
> ```
>
> *"Mercifully, this loop is automatic when you ask for a new double[10][6]. When you want ragged arrays, you allocate the row arrays separately."*
>
> **Dịch:** Thay vào đó, **một mảng mười pointer được cấp phát**, rồi **mỗi phần tử trong mảng pointer đó được điền bằng một mảng sáu số**. **May thay, vòng lặp này là tự động** khi bạn yêu cầu `new double[10][6]`. Khi muốn **mảng răng cưa** thì bạn **cấp phát các mảng hàng một cách riêng biệt**.

### Listing 3.9 — `LotteryArray/LotteryArray.java`

```java
/**
 * This program demonstrates a triangular array.
 * @version 1.20 2004-02-10
 * @author Cay Horstmann
 */
public class LotteryArray
{
    public static void main(String[] args)
    {
        final int NMAX = 10;

        // allocate triangular array
        int[][] odds = new int[NMAX + 1][];
        for (int n = 0; n <= NMAX; n++)
            odds[n] = new int[n + 1];

        // fill triangular array
        for (int n = 0; n < odds.length; n++)
            for (int k = 0; k < odds[n].length; k++)
            {
                /*
                 * compute binomial coefficient n*(n-1)*(n-2)*...*(n-k+1)/(1*2*3*...*k)
                 */
                int lotteryOdds = 1;
                for (int i = 1; i <= k; i++)
                    lotteryOdds = lotteryOdds * (n - i + 1) / i;

                odds[n][k] = lotteryOdds;
            }

        // print triangular array
        for (int[] row : odds)
        {
            for (int odd : row)
                System.out.printf("%4d", odd);
            System.out.println();
        }
    }
}
```

---

## Khép lại chương 3

> *"You have now seen the fundamental programming structures of the Java language. The next chapter covers object-oriented programming in Java."*

**Dịch:** Tới đây bạn **đã thấy các cấu trúc lập trình nền tảng của ngôn ngữ Java**. **Chương sau bàn về lập trình hướng đối tượng trong Java.**

---

## Chương kế tiếp

→ Chapter 4: [[01 - Introduction to Object-Oriented Programming|Objects and Classes]] — OOP, class và object, encapsulation, constructor, `static`, method parameter, record, package, JAR file, javadoc, và các lời khuyên thiết kế class.
