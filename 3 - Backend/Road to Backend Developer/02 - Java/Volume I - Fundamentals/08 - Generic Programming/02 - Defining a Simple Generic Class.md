# 02 — Defining a Simple Generic Class

> Chapter 8, Section 8.2 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.2. Defining a Simple Generic Class

> *"A generic class is a class with one or more type variables. In this chapter, a simple Pair class is used as an example. This class allows us to focus on generics without being distracted by data storage details. Here is the code for the generic Pair class:"*

```java
public class Pair<T>
{
    private T first;
    private T second;

    public Pair() { first = null; second = null; }
    public Pair(T first, T second) { this.first = first; this.second = second; }

    public T getFirst() { return first; }
    public T getSecond() { return second; }

    public void setFirst(T newValue) { first = newValue; }
    public void setSecond(T newValue) { second = newValue; }
}
```

**Dịch:** **Generic class là một class có một hoặc nhiều type variable.** Trong chương này, class `Pair` đơn giản được dùng làm ví dụ. Class này giúp ta tập trung vào generic mà **không bị chi tiết lưu trữ data làm phân tâm**.

Xem [[03 - Defining Your Own Classes]] và [[06 - Object Construction]].

> *"The Pair class introduces a type variable T, enclosed in angle brackets < >, after the class name. A generic class can have more than one type variable. For example, we could have defined the Pair class with separate types for the first and second field:"*

```java
public class Pair<T, U> { . . . }
```

**Dịch:** Class `Pair` giới thiệu một **type variable `T`**, đặt trong **cặp ngoặc nhọn `< >`**, **sau tên class**. Một generic class **có nhiều hơn một type variable được**. Ví dụ, ta có thể định nghĩa `Pair` với type riêng cho field `first` và field `second`.

> *"The type variables are used throughout the class definition to specify method return types and the types of fields and local variables. For example:"*

```java
private T first; // uses the type variable
```

**Dịch:** Type variable được dùng **xuyên suốt định nghĩa class** để chỉ định **return type của method**, cũng như **type của field và local variable**.

> **Note (sách):** *"It is common practice to use uppercase letters for type variables, and to keep them short. The Java library uses the variable E for the element type of a collection, K and V for key and value types of a table, and T (and the neighboring letters U and S, if necessary) for "any type at all.""*
>
> **Dịch:** Thông lệ phổ biến là dùng **chữ in hoa** cho type variable và **giữ chúng ngắn**.

| Type variable | Ý nghĩa trong thư viện Java |
|---|---|
| `E` | element type của một collection |
| `K`, `V` | key type và value type của một table |
| `T` (và các chữ lân cận `U`, `S` nếu cần) | "any type at all" — type bất kỳ |

### Instantiate generic type

> *"You instantiate the generic type by substituting types for the type variables, such as"*

```java
Pair<String>
```

> *"You can think of the result as an ordinary class with constructors"*

```java
Pair<String>()
Pair<String>(String, String)
```

> *"and methods"*

```java
String getFirst()
String getSecond()
void setFirst(String)
void setSecond(String)
```

> *"In other words, the generic class acts as a factory for ordinary classes."*

**Dịch:** Bạn **instantiate generic type** bằng cách **thay type vào chỗ type variable**, ví dụ `Pair<String>`. Có thể coi kết quả là **một class thường** với các constructor và method như trên. Nói cách khác, **generic class đóng vai trò như một factory sinh ra các class thường**.

```
        Pair<T>              ← generic class (factory)
           │
   ┌───────┼────────────┐
   ▼       ▼            ▼
Pair<String>  Pair<LocalDate>  Pair<Employee>   ← class thường
```

> *"The program in Listing 8.1 puts the Pair class to work. The static minmax method traverses an array and simultaneously computes the minimum and maximum values. It uses a Pair object to return both results. Recall that the compareTo method compares two strings, returning 0 if the strings are identical, a negative integer if the first string comes before the second in dictionary order, and a positive integer otherwise."*

**Dịch:** Chương trình ở Listing 8.1 cho `Pair` vào việc. **Static method** `minmax` duyệt một array và **tính đồng thời giá trị nhỏ nhất và lớn nhất**. Nó dùng một object `Pair` để **trả về cả hai kết quả**. Nhắc lại: method `compareTo` so sánh hai string, trả về **`0`** nếu hai string giống hệt nhau, **số nguyên âm** nếu string thứ nhất đứng trước string thứ hai theo thứ tự từ điển, và **số nguyên dương** trong trường hợp còn lại.

Xem [[04 - Static Fields and Methods]].

> **C++ Note (sách):** *"Superficially, generic classes in Java are similar to template classes in C++. The only obvious difference is that Java has no special template keyword. However, as you will see throughout this chapter, there are substantial differences between these two mechanisms."*
>
> **Dịch:** Nhìn bề ngoài, generic class trong Java **giống template class của C++**. Khác biệt rõ ràng duy nhất là Java **không có keyword `template` riêng**. Tuy nhiên, như sẽ thấy suốt chương này, **hai cơ chế khác nhau đáng kể**.

---

### Listing 8.1 — `pair1/PairTest1.java`

```java
package pair1;

/**
 * @version 1.01 2012-01-26
 * @author Cay Horstmann
 */
public class PairTest1
{
    public static void main(String[] args)
    {
        String[] words = { "Mary", "had", "a", "little", "lamb" };
        Pair<String> mm = ArrayAlg.minmax(words);
        System.out.println("min = " + mm.getFirst());
        System.out.println("max = " + mm.getSecond());
    }
}

class ArrayAlg
{
    /**
     * Gets the minimum and maximum of an array of strings.
     * @param a an array of strings
     * @return a pair with the min and max values, or null if a is null or empty
     */
    public static Pair<String> minmax(String[] a)
    {
        if (a == null || a.length == 0) return null;
        String min = a[0];
        String max = a[0];
        for (int i = 1; i < a.length; i++)
        {
            if (min.compareTo(a[i]) > 0) min = a[i];
            if (max.compareTo(a[i]) < 0) max = a[i];
        }
        return new Pair<>(min, max);
    }
}
```

---

## Bài kế tiếp

→ [[03 - Generic Methods]] — định nghĩa một method đơn lẻ có type parameter, và cơ chế type inference khi gọi.
