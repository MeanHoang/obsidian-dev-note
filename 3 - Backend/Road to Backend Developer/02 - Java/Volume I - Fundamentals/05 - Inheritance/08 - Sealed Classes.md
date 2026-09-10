# 08 — Sealed Classes

> Chapter 5, Section 5.8 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.8. Sealed Classes

> *"Unless a class is declared final, anyone can form a subclass of it. What if you want to have more control? For example, suppose you need to write your own JSON library because none of the existing ones does exactly what you need."*

**Dịch:** Trừ khi một class được khai báo [[01 - Classes, Superclasses, and Subclasses|`final`]], **ai cũng tạo được subclass của nó**. Nếu bạn muốn **kiểm soát nhiều hơn** thì sao? Ví dụ giả sử bạn cần viết **library JSON riêng** vì **không library có sẵn nào làm đúng điều bạn cần**.

> *"The JSON standard says that a JSON value is an array, number, string, Boolean value, object, or null. An obvious approach is to model this with classes JSONArray, JSONNumber, and so on that extend an abstract class JSONValue:"*

```java
public abstract class JSONValue
{
    // Methods that apply to all JSON values
}

public final class JSONArray extends JSONValue
{
    . . .
}

public final class JSONNumber extends JSONValue
{
    . . .
}
```

**Dịch:** Chuẩn JSON nói rằng một **giá trị JSON là array, number, string, giá trị Boolean, object, hoặc null**. Cách tiếp cận hiển nhiên là **mô hình hoá bằng các class `JSONArray`, `JSONNumber`, ...** extend một [[06 - Abstract Classes|abstract class]] `JSONValue`.

> *"By declaring the classes JSONArray, JSONNumber, and so on as final, we can ensure that nobody forms a subclass. But we cannot stop anyone from forming another subclass of JSONValue."*

**Dịch:** Bằng cách khai báo `JSONArray`, `JSONNumber`... là `final`, ta **đảm bảo không ai tạo subclass của chúng**. Nhưng ta **không ngăn được ai đó tạo thêm một subclass khác của `JSONValue`**.

> *"Why might we want that control? Consider this code:"*

```java
JSONValue v = . . .;
if (v instanceof JSONArray a) . . .
else if (v instanceof JSONNumber n) . . .
else if (v instanceof JSONString s) . . .
else if (v instanceof JSOBoolean b) . . .
else if (v instanceof JSONObject o) . . .
else . . . // Must be JSONNull
```

> *"Here, the control flow implies that we know all direct subclasses of JSONValue. This is not an open-ended hierarchy. The JSON standard won't change; if it does, we as the library implementors will add a seventh subclass. We don't want anyone else out there mess with the class hierarchy."*

**Dịch:** Vì sao ta muốn quyền kiểm soát đó? Ở đoạn code trên, **luồng điều khiển ngầm định rằng ta biết mọi direct subclass của `JSONValue`**. Đây **không phải một hierarchy mở**. Chuẩn JSON **sẽ không đổi**; nếu có đổi thì **chính ta — người viết library — sẽ thêm subclass thứ bảy**. Ta **không muốn bất kỳ ai khác nghịch vào class hierarchy này**.

> *"In Java, a sealed class controls which classes may inherit from it. Sealed classes were added as a preview feature in Java 15 and finalized in Java 17."*

**Dịch:** Trong Java, một **sealed class kiểm soát class nào được phép kế thừa từ nó**. Sealed class được thêm dưới dạng **preview feature ở Java 15** và **chính thức ở Java 17**.

> *"Here is how to declare the JSONValue class as sealed:"*

```java
public abstract sealed class JSONValue
    permits JSONArray, JSONNumber, JSONString, JSONBoolean, JSONObject, JSONNull
{
    . . .
}
```

> *"It is an error to define a nonpermitted subclass:"*

```java
public class JSONComment extends JSONValue { . . . } // Error
```

> *"That's just as well, since JSON doesn't allow for comments. Sealed classes thus allow for accurate modeling of domain constraints."*

**Dịch:** Trên là cách khai báo `JSONValue` là **sealed**. **Định nghĩa một subclass không được cho phép là lỗi.** Cũng hợp lý thôi, vì **JSON không cho phép comment**. Sealed class do đó cho phép **mô hình hoá chính xác các ràng buộc của domain**.

> *"The permitted subclasses of a sealed class must be accessible. They cannot be private classes that are nested in another class, or package-visible classes from another package."*

**Dịch:** Các **subclass được cho phép** của một sealed class **phải truy cập được**. Chúng **không được là private class lồng trong class khác**, cũng **không được là class package-visible ở [[08 - Packages|package]] khác**.

> *"For permitted subclasses that are public, the rules are more stringent. They must be in the same package as the sealed class. However, if you use modules (see Chapter 12), then they must only be in the same module."*

**Dịch:** Với subclass được cho phép mà là `public`, **quy tắc chặt hơn**: chúng **phải nằm cùng package với sealed class**. Nhưng nếu bạn **dùng module** (xem chương 12) thì chúng **chỉ cần nằm cùng module**.

> **Note (sách):** *"A sealed class can be declared without a permits clause. Then all of its direct subclasses must be declared in the same file. Programmers without access to that file cannot form subclasses."*
>
> *"A file can have at most one public class, so this arrangement appears to be only useful if the subclasses are not for use by the public. However, as you will see in the next chapter, you can use inner classes as public subclasses."*
>
> **Dịch:** Một sealed class **khai báo được mà không cần mệnh đề `permits`**. Khi đó **mọi direct subclass của nó phải được khai báo trong cùng một file**. Lập trình viên **không truy cập được file đó thì không tạo subclass được**. Một file **có nhiều nhất một public class**, nên sắp đặt này **có vẻ chỉ hữu ích khi các subclass không dành cho công chúng dùng**. Nhưng như chương sau sẽ thấy, bạn **dùng được inner class làm public subclass**.

> *"An important motivation for sealed classes is compile-time checking. Consider this method of the JSONValue class, which uses a switch expression with pattern matching (see Section 5.9):"*

```java
public String type()
{
    return switch (this)
    {
        case JSONArray __ -> "array";
        case JSONNumber __ -> "number";
        case JSONString __ -> "string";
        case JSONBoolean __ -> "boolean";
        case JSONObject __ -> "object";
        case JSONNull __ -> "null";
        // No default needed here
    };
}
```

> *"The compiler can check that no default clause is needed since all direct subclasses of JSONValue occur as cases."*

**Dịch:** **Một động lực quan trọng** cho sealed class là **kiểm tra lúc compile-time**. Method trên dùng **`switch` expression với [[09 - Pattern Matching|pattern matching]]**. Compiler **kiểm tra được rằng không cần mệnh đề `default`**, vì **mọi direct subclass của `JSONValue` đều xuất hiện dưới dạng case**.

> **Note (sách):** *"The preceding type method doesn't look very object-oriented. It would be in the spirit of OOP to have each of the six classes provide its own type method, relying on polymorphism instead of a switch. For an open-ended hierarchy, that is a good approach. But when there is a fixed set of classes, it is often more convenient to have all alternatives in one method."*
>
> **Dịch:** Method `type` ở trên **trông không "hướng đối tượng" cho lắm**. Đúng tinh thần OOP thì **mỗi trong sáu class tự cung cấp method `type` của mình**, dựa vào [[01 - Classes, Superclasses, and Subclasses|polymorphism]] thay vì một `switch`. Với **hierarchy mở** thì đó là cách tốt. Nhưng khi có **một tập class cố định**, việc **gom mọi lựa chọn vào một method thường tiện hơn**.

> *"At first glance, it appears as if a subclass of a sealed class must be final. But for exhaustiveness testing, we only need to know all direct subclasses. It is not a problem if those classes have further subclasses. For example, we can reorganize our JSON hierarchy as shown in Figure 5.3."*

**Dịch:** Thoạt nhìn có vẻ **subclass của một sealed class phải là `final`**. Nhưng để **kiểm tra tính vét cạn (exhaustiveness)**, ta **chỉ cần biết mọi direct subclass**. **Không sao cả nếu các class đó lại có subclass của riêng chúng.**

**Figure 5.3: The complete hierarchy of classes for representing JSON values**

```
                              ┌─────────────┐
                              │  JSONValue  │
                              └──────△──────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
 ┌──────┴───────┐            ┌───────┴──────┐            ┌────────┴───────┐
 │  JSONObject  │            │  JSONArray   │            │ JSONPrimitive  │
 └──────────────┘            └──────────────┘            └───────△────────┘
                                                                 │
              ┌────────────────┬───────────────┬─────────────────┤
              │                │               │                 │
      ┌───────┴──────┐ ┌───────┴──────┐ ┌──────┴───────┐ ┌───────┴──────┐
      │  JSONString  │ │ JSONNumber   │ │ JSONBoolean  │ │  JSONNull    │
      └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

> *"In this hierarchy, JSONValue permits three subclasses:"*

```java
public abstract sealed class JSONValue permits JSONObject, JSONArray, JSONPrimitive
{
    . . .
}
```

> *"The JSONPrimitive class is sealed as well:"*

```java
public abstract sealed class JSONPrimitive extends JSONValue
    permits JSONString, JSONNumber, JSONBoolean, JSONNull
{
    . . .
}
```

**Dịch:** Trong hierarchy này, `JSONValue` **cho phép ba subclass**, và class `JSONPrimitive` **cũng là sealed**.

> *"A subclass of a sealed class must specify whether it is sealed, final, or open for subclassing. In the latter case, it must be declared as non-sealed."*

**Dịch:** Một subclass của sealed class **phải chỉ rõ nó là `sealed`, `final`, hay mở cho việc tạo subclass**. Trường hợp cuối thì **phải khai báo là `non-sealed`**.

> **Note (sách):** *"The non-sealed keyword is the first Java keyword with a hyphen. This may well be a future trend. Adding keywords to the language always comes with a risk. Existing code may no longer compile. For that reason, sealed is a "contextual" keyword. You can still declare variables or methods named sealed:"*
>
> ```java
> int sealed = 1; // OK to use contextual keyword as identifier
> ```
>
> *"With a hyphenated keyword, one doesn't have to worry about this. The only ambiguity is with subtraction:"*
>
> ```java
> int non = 0;
> non = non-sealed; // Subtraction, not keyword
> ```
>
> **Dịch:** `non-sealed` là **keyword Java đầu tiên có dấu gạch nối**. Đây **rất có thể là xu hướng tương lai**. **Thêm keyword vào ngôn ngữ luôn kèm rủi ro**: code hiện có **có thể không biên dịch được nữa**. Vì lý do đó, **`sealed` là một keyword "theo ngữ cảnh" (contextual)** — bạn **vẫn khai báo được biến hay method tên `sealed`**. Với **keyword có gạch nối** thì **không phải lo chuyện này**; **mập mờ duy nhất là với phép trừ**.

> *"Why would you ever want a non-sealed subclass? Consider an XML node class with six direct subclasses:"*

```java
public abstract sealed class Node permits Element, Text, Comment,
    CDATASection, EntityReference, ProcessingInstruction
{
    . . .
}
```

> *"We allow arbitrary subclasses of Element:"*

```java
public non-sealed class Element extends Node
{
    . . .
}

public class HTMLDivElement extends Element
{
    . . .
}
```

**Dịch:** Vì sao lại muốn một **non-sealed subclass**? Xét class node XML với **sáu direct subclass**. Ta **cho phép subclass tuỳ ý của `Element`**.

> *"In this section, you learned about sealed classes. In the next chapter, you will learn about interfaces, a generalization of abstract classes. Java interfaces can also have subtypes. Sealed interfaces work exactly the same as sealed classes, controlling the direct subtypes."*

**Dịch:** Chương sau bạn sẽ học về **interface — dạng tổng quát hoá của abstract class**. Interface Java **cũng có subtype được**. **Sealed interface hoạt động y hệt sealed class**, kiểm soát **các direct subtype**.

> *"The following sample program fleshes out the JSON hierarchy. The implementation of JSONObject uses a HashMap, which will be covered in Chapter 9. In the example, we use interfaces instead of abstract classes so that JSONNumber and JSONString can be records and the JSONBoolean and JSONNull classes can be enumerations. Records and enumerations can implement interfaces, but they cannot extend classes."*

**Dịch:** Chương trình mẫu dưới đây **hoàn thiện hierarchy JSON**. Bản cài `JSONObject` dùng **`HashMap`** (bàn ở chương 9). Trong ví dụ, ta **dùng interface thay cho abstract class** để `JSONNumber` và `JSONString` **có thể là [[07 - Records|record]]**, còn `JSONBoolean` và `JSONNull` **có thể là [[07 - Enumeration Classes|enumeration]]**. **Record và enumeration implement được interface, nhưng không extend được class.**

### Listing 5.13 — `sealed/SealedTest.java`

```java
package sealed;

import java.util.*;

sealed interface JSONValue permits JSONArray, JSONObject, JSONPrimitive
{
    public default String type()
    {
        if (this instanceof JSONArray) return "array";
        else if (this instanceof JSONObject) return "object";
        else if (this instanceof JSONNumber) return "number";
        else if (this instanceof JSONString) return "string";
        else if (this instanceof JSONBoolean) return "boolean";
        else return "null";
    }
}

final class JSONArray extends ArrayList<JSONValue> implements JSONValue {}

final class JSONObject extends HashMap<String, JSONValue> implements JSONValue
{
    public String toString()
    {
        StringBuilder result = new StringBuilder();
        result.append("{");
        for (Map.Entry<String, JSONValue> entry : entrySet())
        {
            if (result.length() > 1) result.append(",");
            result.append(" \"");
            result.append(entry.getKey());
            result.append("\": ");
            result.append(entry.getValue());
        }
        result.append(" }");
        return result.toString();
    }
}

sealed interface JSONPrimitive extends JSONValue
    permits JSONNumber, JSONString, JSONBoolean, JSONNull
{
}

final record JSONNumber(double value) implements JSONPrimitive
{
    public String toString() { return "" + value; }
}

final record JSONString(String value) implements JSONPrimitive
{
    public String toString() { return "\"" + value.translateEscapes() + "\""; }
}

enum JSONBoolean implements JSONPrimitive
{
    FALSE, TRUE;
    public String toString() { return super.toString().toLowerCase(); }
}

enum JSONNull implements JSONPrimitive
{
    INSTANCE;
    public String toString() { return "null"; }
}

public class SealedTest
{
    public static void main(String[] args)
    {
        JSONObject obj = new JSONObject();
        obj.put("name", new JSONString("Harry"));
        obj.put("salary", new JSONNumber(90000));
        obj.put("married", JSONBoolean.FALSE);
        JSONArray arr = new JSONArray();
        arr.add(new JSONNumber(13));
        arr.add(JSONNull.INSTANCE);
        obj.put("luckyNumbers", arr);
        System.out.println(obj);
        System.out.println(obj.type());
    }
}
```

---

## Bài kế tiếp

→ [[09 - Pattern Matching]] — dạng `switch` với type pattern và record pattern, guard, exhaustiveness và dominance.
