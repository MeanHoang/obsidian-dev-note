# 09 — Reflection and Generics

> Chapter 8, Section 8.9 — Core Java Volume I, 13th Edition (Horstmann).
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 8.9. Reflection and Generics

> *"Reflection lets you analyze arbitrary objects at runtime. If the objects are instances of generic classes, you don't get much information about the generic type parameters because they have been erased. In the following sections, you will learn what you can nevertheless find out about generic classes with reflection."*

**Dịch:** **Reflection cho phép bạn phân tích object bất kỳ lúc runtime** — xem [[10 - Reflection]]. Nếu các object đó là **instance của generic class**, bạn **không nhận được nhiều thông tin về generic type parameter, vì chúng đã bị erase**. Các section sau cho biết **dù vậy bạn vẫn tìm ra được điều gì** về generic class bằng reflection.

---

## 8.9.1. The Generic Class `Class`

> *"The Class class has a type parameter. For example, String.class is actually an object (in fact, the sole object) of the class Class\<String>. The type parameter is useful because it allows the methods of Class\<T> to be more specific about their return types. The following methods of Class\<T> take advantage of the type parameter:"*

```java
T cast(Object obj)
T[] getEnumConstants()
Class<? super T> getSuperclass()
Constructor<T> getConstructor(Class<?>... parameterTypes)
Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)
```

**Dịch:** **Class `Class` có một type parameter.** Ví dụ `String.class` thực chất là **một object (thực ra là object duy nhất) của class `Class<String>`**. Type parameter này hữu ích vì nó **cho phép các method của `Class<T>` nói cụ thể hơn về return type của chúng**. Các method trên **tận dụng type parameter đó**.

> *"The getConstructor method returns an instance of Constructor\<T>, so that no cast is required in"*

```java
Class<T> cl = . . .;
T noArgInstance = cl.getConstructor().newInstance();
```

> *"The cast method returns the given object, now declared as type T if its type is indeed a subtype of T. Otherwise, it throws a ClassCastException."*

> *"The getEnumConstants method returns null if this class is not an enum class or an array of the enumeration values which are known to be of type T."*

**Dịch:** Method `getConstructor` **trả về một instance của `Constructor<T>`**, nên **không cần cast** trong đoạn code trên. Method `cast` **trả về chính object đã cho, giờ được khai báo type `T`** nếu type của nó **thực sự là subtype của `T`**; ngược lại nó **ném `ClassCastException`**. Method `getEnumConstants` **trả về `null` nếu class này không phải enum class**, hoặc trả về **một array các giá trị enum vốn được biết là có type `T`**.

## API — `java.lang.Class<T>` (1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `T cast(Object obj)` | Trả về `obj` nếu nó là `null` hoặc **chuyển được sang type `T`**, ngược lại **ném `ClassCastException`**. |
| `T[] getEnumConstants()` *(5.0)* | Trả về **array mọi giá trị nếu `T` là một enumerated type**, ngược lại trả về `null`. |
| `Class<? super T> getSuperclass()` | Trả về **superclass của class này**, hoặc `null` nếu `T` **không phải một class** hoặc là **class `Object`**. |
| `Constructor<T> getConstructor(Class... parameterTypes)` *(1.1)* | Lấy **constructor `public`**, hoặc constructor **có các kiểu parameter đã cho**. |
| `Constructor<T> getDeclaredConstructor(Class... parameterTypes)` *(1.1)* | Lấy **constructor `public`**, hoặc constructor **có các kiểu parameter đã cho**. |

---

## 8.9.2. Using `Class<T>` Parameters for Type Matching

> *"It is sometimes useful to match the type variable of a Class\<T> parameter in a generic method. Here is the canonical example:"*

```java
public static <T> Pair<T> makePair(Class<T> c) throws ReflectiveOperationException
{
    Constructor<T> constr = c.getConstructor();
    return new Pair<>(constr.newInstance(), constr.newInstance());
}
```

> *"If you call"*

```java
makePair(String.class)
```

> *"then String.class is an object of type Class\<String>. The type parameter T of the makePair method matches String, and the compiler can infer that the method returns a Pair\<String>."*

**Dịch:** Đôi khi **khớp type variable của một parameter `Class<T>` trong một generic method** là điều hữu ích. Trên là **ví dụ kinh điển**. Nếu bạn gọi `makePair(String.class)` thì `String.class` là **một object type `Class<String>`**. **Type parameter `T` của method `makePair` khớp với `String`**, và compiler **suy ra được rằng method trả về một `Pair<String>`**. Xem [[03 - Generic Methods]].

---

## 8.9.3. Generic Type Information in the Virtual Machine

> *"One of the notable features of Java generics is the erasure of generic types in the virtual machine. Perhaps surprisingly, the erased classes still retain some faint memory of their generic origin. For example, the raw Pair class knows that it originated from the generic class Pair\<T>, even though an object of type Pair can't tell whether it was constructed as a Pair\<String> or Pair\<Employee>."*

**Dịch:** Một trong những đặc điểm đáng chú ý của generic Java là **việc erase generic type trong virtual machine** — xem [[05 - Generic Code and the Virtual Machine]]. Có lẽ hơi bất ngờ: **các class đã bị erase vẫn giữ lại chút ký ức mờ nhạt về gốc gác generic của mình**. Ví dụ, **raw class `Pair` biết rằng nó bắt nguồn từ generic class `Pair<T>`**, dù một object type `Pair` **không cho biết được nó được dựng ra như `Pair<String>` hay `Pair<Employee>`**.

> *"Similarly, consider a method"*

```java
public static Comparable min(Comparable[] a)
```

> *"that is the erasure of a generic method"*

```java
public static <T extends Comparable<? super T>> T min(T[] a)
```

> *"You can use the reflection API to determine that"*

> *"The generic method has a type parameter called T;"*
> *"The type parameter has a subtype bound that is itself a generic type;"*
> *"The bounding type has a wildcard parameter;"*
> *"The wildcard parameter has a supertype bound; and"*
> *"The generic method has a generic array parameter."*

**Dịch:** Bạn **dùng được reflection API để xác định**:

| # | Xác định được điều gì |
|---|---|
| 1 | Generic method **có một type parameter tên `T`** |
| 2 | Type parameter đó **có một subtype bound mà bản thân bound đó là một generic type** |
| 3 | **Bounding type có một wildcard parameter** |
| 4 | **Wildcard parameter đó có một supertype bound** |
| 5 | Generic method **có một generic array parameter** |

Xem [[04 - Bounds for Type Variables]] và [[07 - Wildcard Types]].

> *"In other words, you can reconstruct everything about generic classes and methods that their implementors declared. However, you won't know how the type parameters were resolved for specific objects or method calls."*

**Dịch:** Nói cách khác, bạn **dựng lại được mọi thứ về generic class và generic method mà người implement đã khai báo**. Tuy nhiên bạn **sẽ không biết type parameter đã được phân giải (resolve) ra sao cho các object hay lời gọi method cụ thể**.

> *"In order to express generic type declarations, use the interface Type in the java.lang.reflect package. The interface has the following subtypes:"*

> *"The Class class, describing concrete types"*
> *"The TypeVariable interface, describing type variables (such as T extends Comparable<? super T>)"*
> *"The WildcardType interface, describing wildcards (such as ? super T)"*
> *"The ParameterizedType interface, describing generic class or interface types (such as Comparable<? super T>)"*
> *"The GenericArrayType interface, describing generic arrays (such as T[])"*

**Dịch:** Để **diễn tả các khai báo generic type**, hãy dùng **interface `Type` trong package `java.lang.reflect`**. Interface này có các subtype sau:

| Subtype | Mô tả (dịch từ sách) |
|---|---|
| `Class` (class) | Mô tả **concrete type** |
| `TypeVariable` (interface) | Mô tả **type variable** (chẳng hạn `T extends Comparable<? super T>`) |
| `WildcardType` (interface) | Mô tả **wildcard** (chẳng hạn `? super T`) |
| `ParameterizedType` (interface) | Mô tả **generic class hoặc interface type** (chẳng hạn `Comparable<? super T>`) |
| `GenericArrayType` (interface) | Mô tả **generic array** (chẳng hạn `T[]`) |

> *"Figure 8.5 shows the inheritance hierarchy. Note that the last four subtypes are interfaces—the virtual machine instantiates suitable classes that implement these interfaces."*

**Dịch:** Lưu ý **bốn subtype cuối là interface** — **virtual machine instantiate các class phù hợp implement những interface này**.

**Figure 8.5: The `Type` interface and its descendants**

**Figure 8.5: The `Type` interface and its descendants**

```
                        «interface»
                            Type
                       △              △
          implements ┈┈┘              │ extends
                     ┊     ┌──────┬───┴──┬──────────────┐
                     ┊     │      │      │              │
                  Class<T> │      │      │              │
                           │      │      │              │
                  «interface»  «interface»  «interface»  «interface»
                  TypeVariable WildcardType Parameterized GenericArray
                                                Type          Type
```

> Bốn subtype cuối là **interface**, riêng `Class<T>` là **class** — nối bằng nét đứt (implements).

> *"Listing 8.4 uses the generic reflection API to print out what it discovers about a given class. If you run it with the Pair class, you get this report:"*

```
class Pair<T> extends java.lang.Object
public T getFirst()
public T getSecond()
public void setFirst(T)
public void setSecond(T)
```

> *"If you run it with ArrayAlg in the PairTest2 directory, the report displays the following method:"*

```
public static <T extends java.lang.Comparable> Pair<T> minmax(T[])
```

**Dịch:** Listing 8.4 **dùng generic reflection API để in ra những gì nó phát hiện được về một class cho trước**. Chạy nó với class `Pair` thì được báo cáo như trên; chạy nó với `ArrayAlg` trong thư mục `PairTest2` thì báo cáo hiển thị method `minmax`.

### Listing 8.4 — `genericReflection/GenericReflectionTest.java`

```java
package genericReflection;

import java.lang.reflect.*;
import java.util.*;

/**
 * @version 1.13 2023-12-20
 * @author Cay Horstmann
 */
public class GenericReflectionTest
{
    public static void main(String[] args)
    {
        // read class name from command line args or user input
        String name;
        if (args.length > 0) name = args[0];
        else
        {
            try (var in = new Scanner(System.in))
            {
                System.out.println("Enter class name (e.g., java.util.Collections): ");
                name = in.next();
            }
        }

        try
        {
            // print generic info for class and public methods
            Class<?> cl = Class.forName(name);
            printClass(cl);
            for (Method m : cl.getDeclaredMethods())
                printMethod(m);
        }
        catch (ClassNotFoundException e)
        {
            e.printStackTrace();
        }
    }

    public static void printClass(Class<?> cl)
    {
        System.out.print(cl);
        printTypes(cl.getTypeParameters(), "<", ", ", ">", true);
        Type sc = cl.getGenericSuperclass();
        if (sc != null)
        {
            System.out.print(" extends ");
            printType(sc, false);
        }
        printTypes(cl.getGenericInterfaces(), " implements ", ", ", "", false);
        System.out.println();
    }

    public static void printMethod(Method m)
    {
        String name = m.getName();
        System.out.print(Modifier.toString(m.getModifiers()));
        System.out.print(" ");
        printTypes(m.getTypeParameters(), "<", ", ", "> ", true);

        printType(m.getGenericReturnType(), false);
        System.out.print(" ");
        System.out.print(name);
        System.out.print("(");
        printTypes(m.getGenericParameterTypes(), "", ", ", "", false);
        System.out.println(")");
    }

    public static void printTypes(Type[] types, String prefix, String separator,
        String suffix, boolean isDefinition)
    {
        if (prefix.equals(" extends ")
                && Arrays.equals(types, new Type[] { Object.class })) return;
        if (types.length > 0) System.out.print(prefix);
        for (int i = 0; i < types.length; i++)
        {
            if (i > 0) System.out.print(separator);
            printType(types[i], isDefinition);
        }
        if (types.length > 0) System.out.print(suffix);
    }

    public static void printType(Type type, boolean isDefinition)
    {
        if (type instanceof Class<?> t)
        {
            System.out.print(t.getName());
        }
        else if (type instanceof TypeVariable<?> t)
        {
            System.out.print(t.getName());
            if (isDefinition)
                printTypes(t.getBounds(), " extends ", " & ", "", false);
        }
        else if (type instanceof WildcardType t)
        {
            System.out.print("?");
            printTypes(t.getUpperBounds(), " extends ", " & ", "", false);
            printTypes(t.getLowerBounds(), " super ", " & ", "", false);
        }
        else if (type instanceof ParameterizedType t)
        {
            Type owner = t.getOwnerType();
            if (owner != null)
            {
                printType(owner, false);
                System.out.print(".");
            }
            printType(t.getRawType(), false);
            printTypes(t.getActualTypeArguments(), "<", ", ", ">", false);
        }
        else if (type instanceof GenericArrayType t)
        {
            System.out.print("");
            printType(t.getGenericComponentType(), isDefinition);
            System.out.print("[]");
        }
    }
}
```

---

## 8.9.4. Type Literals

> *"Sometimes, you want to drive program behavior by the type of a value. For example, in a persistence mechanism, you may want the user to specify a way of saving an object of a particular class. This is typically implemented by associating the Class object with an action."*

> *"However, with generic classes, erasure poses a problem. How can you have different actions for, say, ArrayList\<Integer> and ArrayList\<String> when both erase to the same raw ArrayList type?"*

**Dịch:** Đôi khi bạn muốn **điều khiển hành vi chương trình dựa theo type của một giá trị**. Ví dụ trong một cơ chế lưu trữ (persistence), bạn có thể muốn người dùng **chỉ định cách lưu object của một class cụ thể**. Việc này thường được implement bằng cách **gắn object `Class` với một hành động**. Tuy nhiên **với generic class thì erasure gây ra vấn đề**: làm sao có hành động khác nhau cho, chẳng hạn, `ArrayList<Integer>` và `ArrayList<String>`, khi **cả hai đều erase về cùng một raw type `ArrayList`**?

> *"There is a trick that can offer relief in some situations. You can capture an instance of the Type interface that you encountered in the preceding section. Construct an anonymous subclass like this:"*

```java
var type = new TypeLiteral<ArrayList<Integer>>(){} // note the {}
```

> *"The TypeLiteral constructor captures the generic supertype:"*

```java
class TypeLiteral<T>
{
    public TypeLiteral()
    {
        Type parentType = getClass().getGenericSuperclass();
        if (parentType instanceof ParameterizedType paramType)
            type = paramType.getActualTypeArguments()[0];
        else
            throw new UnsupportedOperationException(
                "Construct as new TypeLiteral<. . .>(){}");
    }
    . . .
}
```

**Dịch:** **Có một mẹo giúp gỡ khó trong một số tình huống.** Bạn **bắt (capture) được một instance của interface `Type`** đã gặp ở section trước, bằng cách **dựng một anonymous subclass** — lưu ý cặp `{}`. Constructor `TypeLiteral` **bắt lấy generic supertype**.

> *"If we have a generic type available at runtime, we can match it against the TypeLiteral. We can't get a generic type from an object—it is erased. But, as you have seen in the preceding section, generic types of fields and method parameters survive in the virtual machine."*

**Dịch:** Nếu ta **có sẵn một generic type lúc runtime**, ta **khớp được nó với `TypeLiteral`**. Ta **không lấy được generic type từ một object** — nó **đã bị erase**. Nhưng như đã thấy ở section trước, **generic type của field và của parameter method thì sống sót trong virtual machine**.

> *"Injection frameworks such as CDI and Guice use type literals to control injection of generic types. The example program in the book's companion code shows a simpler example. Given an object, we enumerate its fields, whose generic types are available, and look up associated formatting actions."*

> *"We format an ArrayList\<Integer> by separating the values with spaces, an ArrayList\<Character> by joining the characters to a string. Any other array lists are formatted by ArrayList.toString."*

**Dịch:** Các injection framework như **CDI và Guice dùng type literal để điều khiển việc inject generic type**. Chương trình ví dụ đi kèm sách cho thấy một ví dụ đơn giản hơn: **cho trước một object, ta liệt kê các field của nó** — vốn có sẵn generic type — **rồi tra ra hành động format tương ứng**. Ta format một `ArrayList<Integer>` bằng cách **ngăn các giá trị bằng khoảng trắng**, format một `ArrayList<Character>` bằng cách **nối các ký tự lại thành một string**. **Mọi array list khác được format bằng `ArrayList.toString`.**

### Listing 8.5 — `genericReflection/TypeLiterals.java`

```java
package genericReflection;

/**
   @version 1.03 2023-12-20
   @author Cay Horstmann
*/

import java.lang.reflect.*;
import java.util.*;
import java.util.function.*;

/**
 * A type literal describes a type that can be generic, such as
 * ArrayList<String>.
 */
class TypeLiteral<T>
{
    private Type type;

    /**
     * This constructor must be invoked from an anonymous subclass
     * as new TypeLiteral<. . .>(){}.
     */
    public TypeLiteral()
    {
        Type parentType = getClass().getGenericSuperclass();
        if (parentType instanceof ParameterizedType paramType)
            type = paramType.getActualTypeArguments()[0];
        else
            throw new UnsupportedOperationException(
                "Construct as new TypeLiteral<. . .>(){}");
    }

    private TypeLiteral(Type type)
    {
        this.type = type;
    }

    /**
     * Yields a type literal that describes the given type.
     */
    public static TypeLiteral<?> of(Type type)
    {
        return new TypeLiteral<>(type);
    }

    public String toString()
    {
        if (type instanceof Class<?> cl) return cl.getName();
        else return type.toString();
    }

    public boolean equals(Object otherObject)
    {
        return otherObject instanceof TypeLiteral<?> otherLiteral
            && type.equals(otherLiteral.type);
    }

    public int hashCode()
    {
        return type.hashCode();
    }
}

/**
 * Formats objects, using rules that associate types with formatting functions.
 */
class Formatter
{
    private Map<TypeLiteral<?>, Function<?, String>> rules = new HashMap<>();

    /**
     * Add a formatting rule to this formatter.
     * @param type the type to which this rule applies
     * @param formatterForType the function that formats objects of this type
     */
    public <T> void forType(TypeLiteral<T> type, Function<T, String> formatterForType)
    {
        rules.put(type, formatterForType);
    }

    /**
     * Formats all fields of an object using the rules of this formatter.
     * @param obj an object
     * @return a string with all field names and formatted values
     */
    public String formatFields(Object obj)
        throws IllegalArgumentException, IllegalAccessException
    {
        var result = new StringBuilder();
        for (Field f : obj.getClass().getDeclaredFields())
        {
            result.append(f.getName());
            result.append("=");
            f.setAccessible(true);
            Function<?, String> formatterForType = rules.get(TypeLiteral.of(f.getGenericType()));
            if (formatterForType != null)
            {
                // formatterForType has parameter type ?. Nothing can be passed to its apply
                // method. Cast makes the parameter type to Object so we can invoke it.
                @SuppressWarnings("unchecked")
                Function<Object, String> objectFormatter
                    = (Function<Object, String>) formatterForType;
                result.append(objectFormatter.apply(f.get(obj)));
            }
            else
                result.append(f.get(obj).toString());
            result.append("\n");
        }
        return result.toString();
    }
}

public class TypeLiterals
{
    public static class Sample
    {
        ArrayList<Integer> nums;
        ArrayList<Character> chars;
        ArrayList<String> strings;

        public Sample()
        {
            nums = new ArrayList<>();
            nums.add(42); nums.add(1729);
            chars = new ArrayList<>();
            chars.add('H'); chars.add('i');
            strings = new ArrayList<>();
            strings.add("Hello"); strings.add("World");
        }
    }

    private static <T> String join(String separator, ArrayList<T> elements)
    {
        var result = new StringBuilder();
        for (T e : elements)
        {
            if (result.length() > 0) result.append(separator);
            result.append(e.toString());
        }
        return result.toString();
    }

    public static void main(String[] args) throws Exception
    {
        var formatter = new Formatter();
        formatter.forType(new TypeLiteral<ArrayList<Integer>>(){},
            lst -> join(" ", lst));
        formatter.forType(new TypeLiteral<ArrayList<Character>>(){},
            lst -> "\"" + join("", lst) + "\"");
        System.out.println(formatter.formatFields(new Sample()));
    }
}
```

---

## API — `java.lang.Class<T>` (1.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `TypeVariable[] getTypeParameters()` *(5.0)* | Lấy các **generic type variable** nếu type này **được khai báo là generic type**, ngược lại trả về **array độ dài 0**. |
| `Type getGenericSuperclass()` *(5.0)* | Lấy **generic type của superclass** đã khai báo cho type này, hoặc `null` nếu type này là `Object` **hoặc không phải class type**. |
| `Type[] getGenericInterfaces()` *(5.0)* | Lấy **generic type của các interface** đã khai báo cho type này, **theo thứ tự khai báo**, hoặc **array độ dài 0** nếu type này **không implement interface nào**. |

## API — `java.lang.reflect.Method` (1.1)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `TypeVariable[] getTypeParameters()` *(5.0)* | Lấy các **generic type variable** nếu method này **được khai báo là generic method**, ngược lại trả về **array độ dài 0**. |
| `Type getGenericReturnType()` *(5.0)* | Lấy **generic return type** mà method này đã được khai báo. |
| `Type[] getGenericParameterTypes()` *(5.0)* | Lấy các **generic parameter type** mà method này đã được khai báo. Nếu method **không có parameter** thì trả về **array độ dài 0**. |

## API — `java.lang.reflect.TypeVariable` (5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `String getName()` | Lấy **tên của type variable** này. |
| `Type[] getBounds()` | Lấy các **subclass bound** của type variable này, hoặc **array độ dài 0** nếu biến **không có bound**. |

## API — `java.lang.reflect.WildcardType` (5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Type[] getUpperBounds()` | Lấy các **subclass bound (`extends`)** của type variable này, hoặc **array độ dài 0** nếu biến **không có subclass bound**. |
| `Type[] getLowerBounds()` | Lấy các **superclass bound (`super`)** của type variable này, hoặc **array độ dài 0** nếu biến **không có superclass bound**. |

## API — `java.lang.reflect.ParameterizedType` (5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Type getRawType()` | Lấy **raw type** của parameterized type này. |
| `Type[] getActualTypeArguments()` | Lấy các **type parameter** mà parameterized type này đã được khai báo. |
| `Type getOwnerType()` | Lấy **type của outer class** nếu đây là một inner type, hoặc `null` nếu đây là **top-level type**. |

## API — `java.lang.reflect.GenericArrayType` (5.0)

| Method | Mô tả (dịch từ sách) |
|---|---|
| `Type getGenericComponentType()` | Lấy **generic component type** mà array type này đã được khai báo. |

---

## Kết chương

> *"You now know how to use generic classes and how to program your own generic classes and methods if the need arises. Just as importantly, you know how to decipher the generic type declarations that you may encounter in the API documentation and in error messages. For an exhaustive discussion of everything there is to know about Java generics, turn to Angelika Langer's excellent list of frequently (and not so frequently) asked questions at http://angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html."*

> *"In the next chapter, you will see how the Java collections framework puts generics to work."*

**Dịch:** Giờ bạn đã biết **cách dùng generic class** và **cách tự lập trình generic class cùng generic method** khi cần. Quan trọng không kém, bạn biết **cách giải mã các khai báo generic type** mà bạn gặp trong tài liệu API và trong thông báo lỗi. Muốn bàn luận **cạn kiệt mọi thứ về generic của Java**, hãy tìm tới **danh sách câu hỏi thường gặp (và không mấy thường gặp) xuất sắc của Angelika Langer** tại `http://angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html`. Ở chương sau, bạn sẽ thấy **Java collections framework vận dụng generic như thế nào**.

---

## Chương kế tiếp

→ [[01 - The Java Collections Framework]] — cấu trúc dữ liệu trong Java API và cách collections framework dùng generic.
