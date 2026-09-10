# 09 — Pattern Matching

> Chapter 5, Section 5.9 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.9. Pattern Matching

> *"You have already seen how to use the instanceof operator to check whether an object has a particular type. The most convenient form of instanceof declares a variable of the matching type:"*

```java
Employee e = . . .;
String description;
if (e instanceof Executive exec)
    description = "An executive with a title of " + exec.getTitle();
else if (e instanceof Manager m)
    description = "A manager who deserves a bonus";
else
    description = "A lowly employee with a salary of " + e.getSalary();
```

**Dịch:** Bạn đã thấy cách dùng [[01 - Classes, Superclasses, and Subclasses|toán tử `instanceof`]] để **kiểm tra một object có thuộc một kiểu cụ thể không**. Dạng **tiện nhất** của `instanceof` là **khai báo luôn một biến thuộc kiểu khớp**.

> *"The pattern-matching form of switch simplifies this type analysis:"*

```java
Employee e = . . .;
String description = switch (e)
{
    case Executive exec -> "An executive with a title of " + exec.getTitle();
    case Manager m -> "A manager who deserves a bonus";
    default -> "A lowly employee with a salary of " + e.getSalary();
};
```

> *"Note that, as with instanceof patterns, each case declares a variable of the matched type. You use those variables to access subclass methods (such as getTitle in our example)."*

**Dịch:** Dạng **pattern-matching của [[07 - Control Flow|`switch`]] đơn giản hoá việc phân tích kiểu này**. Lưu ý: cũng như pattern `instanceof`, **mỗi `case` khai báo một biến thuộc kiểu khớp được**. Bạn dùng các biến đó để **truy cập method của subclass**.

> *"Using the expression form of switch is simpler than a chain of if statements. The switch expression yields a value that is assigned to the description variable. In contrast, when using instanceof, each branch of the conditional statements must set the description value separately."*

**Dịch:** Dùng **dạng biểu thức của `switch` đơn giản hơn một chuỗi câu lệnh `if`**: biểu thức `switch` **cho ra một giá trị** được gán cho biến `description`. Ngược lại, khi dùng `instanceof` thì **mỗi nhánh của câu lệnh điều kiện phải set giá trị `description` riêng**.

> *"It is possible to use the statement and fallthrough forms of switch with type patterns. But the expression form without fallthrough is usually the most natural choice."*

**Dịch:** **Dùng được cả dạng câu lệnh và dạng fallthrough của `switch` với type pattern.** Nhưng **dạng biểu thức, không fallthrough, thường là lựa chọn tự nhiên nhất**.

> *"As you have just seen, the basic structure of pattern matching is straightforward. The following subsections go into technical details, some of which are a bit gnarly for compatibility reasons."*

**Dịch:** Cấu trúc cơ bản của pattern matching **khá thẳng thắn**. Các mục sau đi vào **chi tiết kỹ thuật**, một số **hơi gai góc vì lý do tương thích**.

> **Preview Note (sách):** *"Java 21 introduces unnamed variables as a preview feature. If you don't need the variable in a type pattern, use an underscore:"*
>
> ```java
> case Employee _ -> "A lowly employee"
> ```
>
> *"Until this feature becomes generally available, you can use two underscores:"*
>
> ```java
> case Employee __ -> "A lowly employee"
> ```
>
> **Dịch:** **Java 21 giới thiệu unnamed variable** dưới dạng preview feature. Nếu **không cần biến trong một type pattern**, dùng **dấu gạch dưới**. Trước khi tính năng này phổ biến, bạn **dùng hai dấu gạch dưới**.

---

## 5.9.1. Null Handling

> *"The classic switch statement is null-hostile. If the selector expression is null, the switch throws a NullPointerException. You can avoid this by adding a case null:"*

```java
String description = switch (e)
{
    case Executive exec -> "An executive with a title of " + exec.getTitle();
    case Manager m -> "A manager who deserves a bonus";
    case null -> "No employee";
    default -> "A lowly employee with a salary of " + e.getSalary();
};
```

**Dịch:** Câu lệnh `switch` cổ điển **thù địch với `null`**: nếu biểu thức selector là `null` thì `switch` **ném [[03 - Defining Your Own Classes|`NullPointerException`]]**. Bạn **tránh được bằng cách thêm `case null`**.

> *"You can combine case null with default, but not with any other case:"*

```java
case null, default -> "No free parking";
```

**Dịch:** Bạn **kết hợp được `case null` với `default`**, nhưng **không với case nào khác**.

> **Note (sách):** *"You cannot use case _ to express a default case. That was done on purpose, so that you don't have to remember whether such a case covers null or not."*
>
> **Dịch:** **Không dùng được `case _` để diễn đạt một case mặc định.** Điều này **cố tình như vậy**, để bạn **khỏi phải nhớ xem case kiểu đó có bao gồm `null` hay không**.

---

## 5.9.2. Guards

> *"You can add a condition to a pattern called a guard, using the restricted when keyword."*

```java
case Executive exec when exec.getTitle().getLength() >= 20 ->
    "An executive with an impressive title";
```

> *"In the guard expression, you can use the variable that the pattern introduces."*

> *"If the guard expression is not fulfilled, the case is not selected and the next case is tested."*

> *"If an exception occurs in the when clause, the switch throws that exception."*

**Dịch:** Bạn **thêm được một điều kiện vào pattern**, gọi là **guard**, dùng **keyword hạn chế `when`**. Trong biểu thức guard, bạn **dùng được biến mà pattern giới thiệu**. Nếu **biểu thức guard không thoả** thì **case đó không được chọn** và **case tiếp theo được kiểm tra**. Nếu **có exception xảy ra trong mệnh đề `when`** thì **`switch` ném exception đó**.

> *"Guards are particularly useful in record patterns:"*

```java
Point p = . . .;
String description = switch (p)
{
    case Point(var x, var y) when x == 0 && y == 0 -> "origin";
    case Point(var x, var __) when x == 0 -> "on x-axis";
    case Point(var __, var y) when y == 0 -> "on y-axis";
    default -> "not on either axis";
};
```

**Dịch:** Guard **đặc biệt hữu ích trong record pattern**.

> **Caution (sách):** *"A record pattern invokes the component accessors. In the unlikely case that one of them throws an exception, the switch throws a MatchException. This can only happen for custom accessors."*
>
> **Dịch:** Một record pattern **gọi các component accessor**. Trong **trường hợp hiếm** mà một trong số chúng **ném exception**, `switch` **ném `MatchException`**. Điều này **chỉ xảy ra với accessor tự viết**.

---

## 5.9.3. Exhaustiveness

> *"Any switch expression must be exhaustive: there must be a case for each possible selector value. This is an obvious requirement since the expression must always yield a value."*

**Dịch:** Mọi **biểu thức `switch` phải vét cạn (exhaustive)**: **phải có một case cho mỗi giá trị selector khả dĩ**. Đây là **yêu cầu hiển nhiên** vì **biểu thức luôn phải cho ra một giá trị**.

> *"There are several ways for a switch to be exhaustive:"*
> *"Cases for every instance of an enum"*
> *"Unguarded type patterns that cover every subtype of a sealed type"*
> *"An unguarded type pattern of the selector type"*
> *"A default clause"*

**Dịch:** Có **vài cách** để một `switch` là exhaustive:

| Cách |
|---|
| Có case cho **mọi instance của một [[07 - Enumeration Classes\|enum]]** |
| **Type pattern không có guard** phủ **mọi subtype của một [[08 - Sealed Classes\|sealed type]]** |
| Một **type pattern không guard mang chính kiểu của selector** |
| Một **mệnh đề `default`** |

> *"Guarded patterns cannot be used for exhaustiveness checks since the compiler cannot evaluate them. For example,"*

```java
case Executive exec when exec.getTitle().getLength() >= 20 -> . . .
case Executive exec when exec.getTitle().getLength() < 20 -> . . .
```

> *"is not exhaustive. You need to rewrite the second clause as"*

```java
case Executive exec -> . . .
```

> *"or"*

```java
default -> . . .
```

**Dịch:** **Pattern có guard không dùng được cho kiểm tra exhaustiveness** vì **compiler không đánh giá được chúng**. Ví dụ trên **không exhaustive**; bạn phải **viết lại mệnh đề thứ hai**.

> **Note (sách):** *"When a sealed type hierarchy or an enumeration class is modified, then a previously exhaustive switch might become non-exhaustive. If no cases match, the switch throws a MatchException."*
>
> **Dịch:** Khi một **sealed type hierarchy hoặc một enumeration class bị sửa**, một `switch` **trước đó exhaustive có thể trở thành không exhaustive**. Nếu **không case nào khớp**, `switch` **ném `MatchException`**.

> *"A classic switch statement need not be exhaustive. If no cases match, then no action takes place. But for greater clarity, all enhanced switch statements must be exhaustive. A switch statement is enhanced if it has a pattern, case null, or a selector type other than a primitive type, primitive type wrapper, String, or enum."*

**Dịch:** Câu lệnh `switch` **cổ điển không cần exhaustive**: **không case nào khớp thì không có hành động nào xảy ra**. Nhưng **để rõ ràng hơn, mọi câu lệnh `switch` "enhanced" đều phải exhaustive**. Một câu lệnh `switch` là **enhanced** nếu nó có **một pattern**, **`case null`**, hoặc **kiểu selector không phải primitive type, [[04 - Object Wrappers and Autoboxing|wrapper của primitive type]], `String`, hay `enum`**.

> *"If you don't want to do anything when there is no match, add"*

```java
default -> {} // No fallthrough
```

> *"or"*

```java
default: break; // Fallthrough
```

**Dịch:** Nếu **không muốn làm gì khi không có case nào khớp**, hãy thêm một trong hai dạng trên.

> **Caution (sách):** *"Testing whether the selector value is null is not required for exhaustiveness. You can have an exhaustive switch without case null. It throws a NullPointerException when invoked with a null selector."*
>
> **Dịch:** **Kiểm tra selector có `null` hay không không phải là điều kiện cần cho exhaustiveness.** Bạn **có được một `switch` exhaustive mà không có `case null`** — nó **ném `NullPointerException` khi được gọi với selector `null`**.

> **Caution (sách):** *"The absence of null checking for exhaustiveness is problematic for nested records. Consider"*
>
> ```java
> record Box<T>(T contents) { }
> Box<Box<String>> doubleBoxed = ...;
> String unboxed = switch (doubleBoxed) {
>     case Box(Box(String s)) -> s;
> };
> ```
>
> *"If doubleBoxed is null, the switch throws a NullPointerException. Conversely, if doubleBoxed is new Box<>(new Box<>(null)), the result of the expression is null."*
>
> *"However, if doubleBoxed is initialized with new Box<>(null), then a MatchException occurs. There should have been a case such as"*
>
> ```java
> case Box(b) where b == null
> ```
>
> *"but the exhaustiveness checker ignores null."*
>
> **Dịch:** Việc **không kiểm tra `null` khi xét exhaustiveness** gây **rắc rối với record lồng nhau**. Nếu `doubleBoxed` là `null` thì `switch` **ném `NullPointerException`**. Ngược lại, nếu `doubleBoxed` là `new Box<>(new Box<>(null))` thì **kết quả biểu thức là `null`**. Nhưng nếu `doubleBoxed` được khởi tạo bằng `new Box<>(null)` thì **sinh `MatchException`**. Lẽ ra **phải có một case** như trên, **nhưng bộ kiểm tra exhaustiveness bỏ qua `null`**.

---

## 5.9.4. Dominance

> *"In a classic switch with only constant cases, it is illegal to have the same constant in two cases. Therefore, the branches are disjoint and their order does not matter. However, when the cases are patterns, then the order matters. The cases are checked in order, and the first matching case is followed."*

**Dịch:** Trong một `switch` cổ điển **chỉ có case hằng**, **cùng một hằng ở hai case là bất hợp lệ**. Vì thế các nhánh **rời nhau** và **thứ tự không quan trọng**. Nhưng khi **case là pattern** thì **thứ tự có quan trọng**: các case **được kiểm tra theo thứ tự**, và **case khớp đầu tiên được đi theo**.

> *"When the compiler finds that a case can never match because of a preceding one, a compile-time error occurs. Here is an example:"*

```java
Employee e = . . .;
String description = switch (e)
{
    case Employee __ -> "A lowly employee with a salary of " + e.getSalary();
    case Manager m -> "A manager who deserves a bonus"; // ERROR
};
```

> *"Since every Manager is an Employee, the second case will never match. The first case dominates it."*

**Dịch:** Khi compiler thấy **một case không bao giờ khớp được vì có một case đứng trước**, nó **sinh lỗi compile-time**. Vì **mọi `Manager` đều là `Employee`**, case thứ hai **không bao giờ khớp** — **case đầu tiên "thống trị" (dominate) nó**.

> *"This dominance checking is useful for finding programming errors, but it is not perfect. Here are the fine points that you need to worry about:"*

> *"Guarded patterns are not used for dominance checking. There is no way for for the compiler to reason about the guards. For example, the compiler cannot tell that"*
>
> ```java
> case Executive exec when exec.getTitle().getLength() >= 20 -> . . .
> ```
>
> *"dominates"*
>
> ```java
> case Executive exec when exec.getTitle().getLength() >= 30 -> . . .
> ```

> *"default does not dominate constant cases."*

> *"default dominates case null, even though it does not cover it."*

**Dịch:** Kiểm tra dominance **hữu ích để tìm lỗi lập trình**, nhưng **không hoàn hảo**. Các điểm cần lưu ý:

| Điểm cần lưu ý |
|---|
| **Pattern có guard không được dùng cho kiểm tra dominance** — compiler **không có cách nào lập luận về guard** |
| **`default` không dominate các case hằng** |
| **`default` dominate `case null`**, dù nó **không bao phủ `null`** |

> **Tip (sách):** *"While it is possible to place default before constant cases, it is a poor idea. Always put it last."*
>
> **Dịch:** Dù **đặt được `default` trước các case hằng**, đó là **ý tồi**. **Luôn đặt nó cuối cùng.**

---

## 5.9.5. Patterns and Constants

> *"You cannot match against constants inside record patterns. For example,"*

```java
case Point(0, y) // ERROR
```

> *"is wrong. Use a guard:"*

```java
case Point(x, y) when x == 0 // Ok
```

**Dịch:** **Không khớp được với hằng bên trong record pattern.** Hãy **dùng guard**.

> *"Numeric constant patterns are only allowed when the selector type is int, short, char, or byte, or their wrapper types. String constant patterns are only allowed for a selector of type String. For example, the following is not legal:"*

```java
Object obj = . . .;
String description = switch (obj)
{
    case 0 -> "zero"; // ERROR
    case "" -> "empty string"; // ERROR
    case null -> "null";
    default -> obj.toString();
};
```

> *"Since the selector type is Object, the switch cannot have numeric or string constant patterns. The remedy is:"*

```java
case Integer i when i == 0
case String s when s.equals("null")
```

**Dịch:** **Pattern hằng kiểu số chỉ được phép khi kiểu selector là `int`, `short`, `char`, hoặc `byte`, hay wrapper của chúng.** **Pattern hằng kiểu chuỗi chỉ được phép với selector kiểu [[05 - Strings|`String`]].** Vì kiểu selector ở trên là `Object`, `switch` **không có được pattern hằng số hay hằng chuỗi**. **Cách chữa** như trên.

> *"The rules are different for enum constants. The selector type must merely be a supertype of the enumerated type; that is, Object, Enum, or an interface (see Chapter 6):"*

```java
Object obj = . . .;
String description = switch (obj)
{
    case DayOfWeek.FRIDAY -> "TGIF"; // Ok
    . . .
};
```

**Dịch:** **Quy tắc khác đi với hằng enum**: kiểu selector **chỉ cần là một supertype của enumerated type** — tức là `Object`, `Enum`, hoặc một interface (xem chương 6).

---

## 5.9.6. Variable Scope and Fallthrough

> *"This section covers subtle points about variables when execution falls through from one case to the next. If you never use fallthrough, just move on to the next section."*

**Dịch:** Mục này nói về **các điểm tinh tế liên quan tới biến khi luồng thực thi "rơi xuyên" (fall through) từ case này sang case kế tiếp**. Nếu **bạn không bao giờ dùng fallthrough**, cứ **sang mục sau**.

> *"When a type or record pattern introduces a variable, its scope extends to the end of the case, even if execution falls through the next case. For example, consider the variable s in the following code snippet:"*

```java
Object obj = . . .;
switch (obj)
{
    case String s when s.length() == 0:
        System.out.println("empty string"); // Scope ends here
    default:
        System.out.println(obj.toString());
}
```

> *"You can use s in the guard clause and the statements following the :, but not in the next case. This makes sense since execution can start in that case when obj is not a String."*

**Dịch:** Khi một **type pattern hoặc record pattern giới thiệu một biến**, **phạm vi (scope) của nó kéo tới hết case đó**, **ngay cả khi luồng thực thi rơi xuyên sang case kế tiếp**. Bạn dùng được `s` **trong mệnh đề guard và các câu lệnh sau dấu `:`**, **nhưng không dùng được ở case kế tiếp**. Điều này **hợp lý** vì **luồng thực thi có thể bắt đầu ngay ở case đó khi `obj` không phải `String`**.

> *"You cannot fall into a type pattern:"*

```java
switch (obj)
{
    case String s when s.length() > 0:
        System.out.println(s.codePointAt(0)); // Fallthrough
    case Integer n:
        System.out.println(n); // ERROR
    . . .
}
```

> *"If execution fell from the first case to the body of the second case, n could not be bound."*

**Dịch:** **Không rơi xuyên vào một type pattern được.** Nếu luồng thực thi rơi từ case đầu vào thân case thứ hai thì **`n` không thể được bind**.

> **Preview Note (sách):** *"You can fall into a type pattern with an unnamed variable (a preview feature of Java 21):"*
>
> ```java
> switch (obj)
> {
>     case String s when s.length() == 0:
>         System.out.print("empty "); // Fallthrough
>     case String _:
>         System.out.println("string"); break; // Ok
>     . . .
> }
> ```
>
> **Dịch:** Bạn **rơi xuyên vào một type pattern được nếu dùng unnamed variable** (preview feature của Java 21).

> **Caution (sách):** *"Ever since Java 1.0, it has been legal to declare a variable in the body of a case. The scope of that variable extends to the end of the switch. This scope has never been useful since it leads to an error if you access the variable outside the case:"*
>
> ```java
> switch (obj) {
>     case String s:
>         String t = s; // OK
>     default:
>         System.out.println(t); // ERROR—t may not have been initialized
> }
> ```
>
> **Dịch:** **Từ Java 1.0 tới nay**, khai báo một biến **trong thân của một `case` là hợp lệ**. **Phạm vi của biến đó kéo tới hết `switch`**. Phạm vi này **chưa bao giờ hữu ích** vì nó **dẫn tới lỗi nếu bạn truy cập biến ngoài case đó** — *"`t` có thể chưa được khởi tạo"*.

> *"The programs in Listing 5.14 and Listing 5.15 demonstrate pattern matching with type and record patterns."*

### Listing 5.14 — `patternMatching/TypePatternTest.java`

```java
package patternMatching;

public class TypePatternTest
{
    public static void main(String[] args)
    {
        int r = (int)(4 * Math.random());
        Employee e = switch (r)
        {
            case 0 -> new Employee("Harry Hacker", 50000, 1989, 10, 1);
            case 1 -> new Manager("Carl Cracker", 80000, 1987, 12, 15);
            case 2 -> new Executive("Sue Striver",
                "Senior Associate Vice President", 200000, 1995, 1, 20);
            default -> null;
        };
        String description = switch (e)
        {
            case Executive exec when exec.getTitle().length() >= 20 ->
                "An executive with an impressive title";
            case Executive exec ->
                "An executive with a title of " + exec.getTitle();
            case Manager m ->
            {
                m.setBonus(10000);
                yield "A manager who just got a bonus";
            }
            case null -> "No employee";
            default -> "A lowly employee with a salary of " + e.getSalary();
        };
        System.out.println(description);
    }
}
```

### Listing 5.15 — `patternMatching/RecordPatternTest.java`

```java
package patternMatching;

record Point(double x, double y) {}

public class RecordPatternTest
{
    public static void main(String[] args)
    {
        int r = (int)(4 * Math.random());
        Point p = switch (r)
        {
            case 0 -> new Point(0, 0);
            case 1 -> new Point(1, 0);
            case 2 -> new Point(0, 1);
            default -> new Point(1, 1);
        };
        String description = switch (p)
        {
            case Point(var x, var y) when x == 0 && y == 0 -> "origin";
            case Point(var x, var __) when x == 0 -> "on x-axis";
            case Point(var __, var y) when y == 0 -> "on y-axis";
            default -> "not on either axis";
        };
        System.out.printf("%s %s%n", p, description);
    }
}
```

---

## Bài kế tiếp

→ [[10 - Reflection]] — thư viện cho phép chương trình tự khảo sát và thao tác code Java lúc chạy.
