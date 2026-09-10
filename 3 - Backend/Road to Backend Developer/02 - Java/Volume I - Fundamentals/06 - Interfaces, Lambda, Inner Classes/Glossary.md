# Glossary — Interfaces, Lambda Expressions, and Inner Classes

> Thuật ngữ chương 6: Interfaces, Lambda Expressions, and Inner Classes. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**Anonymous Inner Class**
Local inner class **không có tên**, dùng khi bạn **chỉ muốn tạo đúng một object** của class đó. Cú pháp: `new SuperType(construction arguments) { inner class methods and data }`. `SuperType` là interface thì inner class **implement** interface đó; là class thì inner class **extend** class đó. **Không có constructor** (vì tên constructor phải trùng tên class mà class lại không tên) — construction argument **được đưa cho constructor của superclass**; nhưng **vẫn cung cấp được object initialization block**. Xem [[03 - Inner Classes#6.3.6. Anonymous Inner Classes]].

**Antisymmetry**
Một trong ba quy tắc mà comparator phải thoả: **đảo argument thì dấu của kết quả cũng đảo**. Với `compareTo`, chuẩn ngôn ngữ phát biểu `sgn(x.compareTo(y)) = -sgn(y.compareTo(x))`. Xem [[01 - Interfaces#6.1.8. The Comparator Interface]].

## B

**Binary Compatible**
Tính chất của việc **thêm method vào interface**: class cũ **vẫn load được** dù thiếu method. Nhưng nếu chương trình **gọi method đó** thì xảy ra `AbstractMethodError`. Đối lập: thêm method non-default vào interface **không source-compatible**. Xem [[01 - Interfaces#6.1.5. Default Methods]].

## C

**Callback Pattern**
Pattern trong đó bạn **chỉ định hành động sẽ xảy ra mỗi khi một sự kiện cụ thể diễn ra**. Java theo hướng object-oriented: **truyền vào một object** (chứ không phải tên hàm), rồi bên kia **gọi một method của object đó**. **Truyền object linh hoạt hơn truyền hàm** vì object mang theo được thông tin bổ sung. Xem [[01 - Interfaces#6.1.7. Interfaces and Callbacks]].

**"class wins"**
Luật: khi một class vừa extend superclass vừa implement interface và **thừa hưởng cùng một method từ cả hai**, thì **chỉ method của superclass có ý nghĩa**, default method từ interface **bị bỏ qua**. Luật này **đảm bảo tương thích với các phiên bản Java cũ**. Hệ quả: **không tạo được default method định nghĩa lại method của `Object`** (như `toString`, `equals`). Xem [[01 - Interfaces#6.1.6. Resolving Default Method Conflicts]].

**Cloneable**
Interface báo hiệu class **đã cung cấp một method `clone` an toàn**. Nó **không đặc tả method `clone`** — method đó thừa hưởng từ `Object`; interface chỉ đóng vai trò **một cái tag**. Class muốn clone được phải: **implement `Cloneable`** và **định nghĩa lại `clone` với modifier `public`**. Xem [[01 - Interfaces#6.1.9. Object Cloning]].

**Closure**
Thuật ngữ kỹ thuật cho **một khối code kèm giá trị của các free variable**. Sách khẳng định: **trong Java, lambda expression chính là closure**. Xem [[02 - Lambda Expressions#6.2.7. Variable Scope]].

**Comparable**
Interface với method `int compareTo(T other)`: trả về **số âm** nếu object này nhỏ hơn `other`, **0** nếu bằng, **số dương** trong trường hợp còn lại. Từ Java 5 là **generic type**. Tài liệu khuyến nghị `compareTo` **tương thích với `equals`** (ngoại lệ: `BigDecimal`, `StringBuilder`). Xem [[01 - Interfaces#6.1.1. The Interface Concept]].

**Comparator**
Interface với method `int compare(T first, T second)`, dùng khi muốn **so sánh theo tiêu chí khác với thứ tự tự nhiên** của class (mà class đó có thể **không phải của bạn để sửa**). `compare` **được gọi lên object comparator**, không phải lên chính object cần so sánh. Dù comparator **không có state** vẫn phải **tạo instance** vì `compare` không phải static method. Xem [[01 - Interfaces#6.1.8. The Comparator Interface]] và [[02 - Lambda Expressions#6.2.9. Creating Comparators]].

**Constructor Reference**
Giống method reference nhưng **tên method là `new`**, ví dụ `Person::new`. **Constructor nào thì tuỳ ngữ cảnh.** Có cả dạng cho **array**: `int[]::new` tương đương `n -> new int[n]`, dùng để **vượt qua hạn chế không dựng được array của generic type `T`**. Xem [[02 - Lambda Expressions#6.2.6. Constructor References]].

## D

**Deep Copy**
Bản sao **clone luôn cả các subobject**. Cần khi subobject là **mutable** — như field `hireDay` kiểu `Date`. Xem [[01 - Interfaces#6.1.9. Object Cloning]].

**Default Method**
Method của interface **có implementation mặc định**, gắn modifier **`default`**. Default method **gọi được method khác** của interface. Công dụng quan trọng: **interface evolution**. Xem [[01 - Interfaces#6.1.5. Default Methods]].

**Deferred Execution**
Điểm mấu chốt của việc dùng lambda: **thi hành trì hoãn**. Lý do chạy code sau: chạy trong **thread riêng**, chạy **nhiều lần**, chạy **đúng chỗ trong thuật toán**, chạy **khi có chuyện xảy ra**, hoặc **chỉ chạy khi cần thiết**. Xem [[02 - Lambda Expressions#6.2.8. Processing Lambda Expressions]].

**Double Brace Initialization**
Mẹo tận dụng cú pháp inner class: `new ArrayList<String>() {{ add("Harry"); add("Tony"); }}` — **lớp ngoặc ngoài tạo anonymous subclass**, **lớp trong là object initialization block**. Sách nói **thực tế mẹo này ít khi hữu ích**. Xem [[03 - Inner Classes#6.3.6. Anonymous Inner Classes]].

## E

**Effectively Final**
Biến **không bao giờ được gán giá trị mới sau khi đã khởi tạo**. Mọi biến bị **capture** trong lambda expression (và trong local inner class) **phải là effectively final**. Lý do: **mutate biến trong lambda là không an toàn khi nhiều hành động chạy đồng thời**. Xem [[02 - Lambda Expressions#6.2.7. Variable Scope]] và [[03 - Inner Classes#6.3.5. Accessing Variables from Outer Methods]].

## F

**Free Variable**
Trong lambda expression: biến **không phải parameter** và **không được định nghĩa bên trong khối code**. Giá trị của free variable **bị lambda expression capture (bắt giữ)**. Xem [[02 - Lambda Expressions#6.2.7. Variable Scope]].

**Functional Interface**
Interface có **duy nhất một abstract method**. Bạn **cung cấp được lambda expression ở bất cứ đâu mong đợi object của một functional interface**. **Chuyển đổi sang functional interface là việc DUY NHẤT làm được với lambda expression trong Java** — không gán được lambda cho biến kiểu `Object`. Các interface tổng quát nằm ở package **`java.util.function`**. Xem [[02 - Lambda Expressions#6.2.3. Functional Interfaces]].

**@FunctionalInterface**
Annotation gắn cho interface tự thiết kế có một abstract method. **Hai lợi ích**: compiler **báo lỗi nếu lỡ thêm abstract method thứ hai**, và **javadoc ghi rõ** đây là functional interface. **Không bắt buộc** — theo định nghĩa mọi interface một abstract method đều là functional interface — nhưng **dùng là ý hay**. Xem [[02 - Lambda Expressions#6.2.8. Processing Lambda Expressions]].

## I

**Inner Class**
Class **định nghĩa bên trong class khác** và **không phải static**. Hai lý do dùng: **giấu được khỏi class khác trong cùng package**, và **method của nó truy cập được dữ liệu từ scope bao quanh — kể cả dữ liệu `private`**. Object của inner class **luôn nhận một reference ngầm tới object đã tạo ra nó**. **Chỉ inner class mới được khai `private`.** Từ Java 16 inner class **có được static member**. Xem [[03 - Inner Classes#6.3. Inner Classes]].

**Interface**
**Không phải class** mà là **một tập yêu cầu** cho những class muốn tuân thủ. Mọi method **tự động `public`**; field **luôn `public static final`**; **không bao giờ có instance field**; **không tạo instance bằng `new`** được nhưng **khai báo biến kiểu interface được**. Một class **implement được nhiều interface**, và interface **extend được interface khác**. Xem [[01 - Interfaces#6.1.1. The Interface Concept]] và [[01 - Interfaces#6.1.2. Properties of Interfaces]].

**Interface Evolution**
Công dụng quan trọng của default method: **thêm method mới vào interface có sẵn** mà **không phá vỡ các class đã implement nó**. Xem [[01 - Interfaces#6.1.5. Default Methods]].

**InvocationHandler**
Interface có **một method** `Object invoke(Object proxy, Method method, Object[] args)`. **Mỗi khi một method được gọi lên object proxy, `invoke` của invocation handler được gọi**, kèm object `Method` và các argument của lời gọi gốc; handler **tự quyết định xử lý ra sao**. Từ Java 16 có static method **`invokeDefault`** để **thực sự gọi default method, bỏ qua handler**. Xem [[05 - Proxies#6.5.1. When to Use Proxies]].

## L

**Lambda Expression**
**Một khối code truyền đi được** để **chạy sau này**, một hoặc nhiều lần. Cú pháp: **parameter**, **mũi tên `->`**, và **một biểu thức** (hoặc khối `{}` có `return` tường minh). **Không bao giờ khai kiểu kết quả** — luôn suy ra từ ngữ cảnh. Tên "lambda" đến từ nhà logic học **Alonzo Church** dùng chữ Hy Lạp **λ** để đánh dấu parameter. Xem [[02 - Lambda Expressions#6.2.1. Why Lambdas?]] và [[02 - Lambda Expressions#6.2.2. The Syntax of Lambda Expressions]].

**Local Inner Class**
Class **định nghĩa bên trong một method**. **Không bao giờ khai kèm access specifier**; **scope giới hạn trong block khai báo nó**. Lợi thế lớn: **hoàn toàn ẩn khỏi thế giới bên ngoài** — ngay cả code khác trong outer class cũng không truy cập được. Ngoài field của outer class, nó còn **truy cập được local variable** (phải effectively final). Xem [[03 - Inner Classes#6.3.4. Local Inner Classes]].

## M

**Method Reference**
Biểu thức dạng `System.out::println`, **chỉ thị cho compiler tạo instance của một functional interface** bằng cách override method abstract duy nhất để **gọi method đã cho**. Ba biến thể: `object::instanceMethod`, `Class::instanceMethod`, `Class::staticMethod`. **Không phải object** — chỉ sinh ra object khi gán cho biến kiểu functional interface. Chỉ dùng được **khi thân lambda gọi đúng một method và không làm gì khác**. Xem [[02 - Lambda Expressions#6.2.5. Method References]].

**Multiple Inheritance**
Tính năng cho phép một class có **nhiều superclass** (có ở C++). Nhà thiết kế Java **chọn không hỗ trợ** vì nó khiến ngôn ngữ **hoặc rất phức tạp hoặc kém hiệu quả**. **Interface mang lại phần lớn lợi ích của multiple inheritance** mà tránh được sự phức tạp đó. Xem [[01 - Interfaces#6.1.3. Interfaces and Abstract Classes]].

## N

**Nested Class**
Thuật ngữ của Java Language Specification cho **bất kỳ class nào khai báo bên trong class hoặc interface khác**. Chia thành **static class** (nested và `static`) và **inner class** (nested, không static). Xem [[03 - Inner Classes#6.3.7. Static Classes]].

**Nondenotable Type**
Kiểu **không diễn đạt được bằng cú pháp Java**, ví dụ kiểu của `new Object() { String name = "Bob"; }` là "`Object` có thêm field `name` kiểu `String`". Compiler **vẫn hiểu kiểu đó** và đặt được nó làm kiểu cho biến khai bằng `var`. Xem [[03 - Inner Classes#6.3.6. Anonymous Inner Classes]].

## O

**OuterClass.this**
Cú pháp đúng cho **reference tới object outer class** từ bên trong inner class. Ngược lại, dựng object inner class tường minh bằng **`outerObject.new InnerClass(...)`**. Ngoài scope của outer class, tham chiếu inner class bằng **`OuterClass.InnerClass`**. Xem [[03 - Inner Classes#6.3.2. Special Syntax Rules for Inner Classes]].

## P

**Predicate**
Functional interface `boolean test(T t)` trong `java.util.function`. Method `removeIf` của `ArrayList` nhận `Predicate`, **được thiết kế riêng để truyền lambda expression**. Có các default method **`and`, `or`, `negate`** để kết hợp predicate. Xem [[02 - Lambda Expressions#6.2.4. Function Types]].

**Proxy**
Cơ chế **tạo, ngay lúc runtime, class mới implement một tập interface cho trước**. Chỉ cần khi **lúc compile chưa biết cần implement interface nào**. Class proxy có **mọi method mà các interface đòi hỏi** cộng **mọi method của `Object`**; nhưng **code cho các method đó không định nghĩa được lúc runtime** — phải cung cấp một **invocation handler**. Tạo bằng `Proxy.newProxyInstance(classLoader, interfaces, handler)`. Xem [[05 - Proxies#6.5. Proxies]].

**Proxy Class (tính chất)**
**Extend class `Proxy`**; **chỉ có một instance field** là invocation handler; **override `toString`, `equals`, `hashCode`** của `Object` (các method khác như `clone`, `getClass` thì không); **tên không được quy định** (Oracle sinh tên bắt đầu bằng `$Proxy`); **luôn `public` và `final`**; **chỉ có một class proxy cho mỗi cặp class loader + tập interface có thứ tự**. Xem [[05 - Proxies#6.5.3. Properties of Proxy Classes]].

## S

**Sealed Interface**
Interface có thể là **sealed**: các **subtype trực tiếp** (class hoặc interface) phải **khai báo trong mệnh đề `permits`** hoặc **nằm trong cùng file nguồn**. Xem [[01 - Interfaces#6.1.2. Properties of Interfaces]].

**Service Loader**
Cơ chế đơn giản của JDK để **nạp các service tuân theo một interface chung**, qua class **`ServiceLoader`**. Cách làm: định nghĩa interface service → provider cung cấp class implement (**mỗi class phải có constructor không argument**) → ghi tên class vào file text UTF-8 trong **`META-INF/services`** đặt tên bằng **fully qualified name của interface** → gọi `ServiceLoader.load(...)` **một lần duy nhất** trong chương trình. Duyệt bằng `iterator`, `stream` hoặc `findFirst`. Xem [[04 - Service Loaders#6.4. Service Loaders]].

**Shallow Copy**
Thao tác cloning **mặc định** của `Object.clone`: **copy từng field một** và **không clone những object được tham chiếu bên trong**. An toàn nếu subobject dùng chung là **immutable**. Xem [[01 - Interfaces#6.1.9. Object Cloning]].

**Static Class**
Nested class khai báo **`static`**: **giống hệt inner class** nhưng object của nó **KHÔNG có reference tới object outer class**. Bắt buộc dùng khi instance được dựng **bên trong một static method**. Nguyên tắc: **dùng static class mỗi khi nested class không cần truy cập object của outer class**. **Record, interface và enumeration khai báo bên trong class/interface đều tự động static**; class khai báo trong interface **tự động `static` và `public`**. Xem [[03 - Inner Classes#6.3.7. Static Classes]].

**Supplier**
Functional interface `T get()` — **không có parameter**, **sinh ra giá trị kiểu `T`**. Dùng cho **lazy evaluation**, ví dụ `Objects.requireNonNullElseGet` **chỉ gọi supplier khi giá trị thực sự cần đến**. Xem [[02 - Lambda Expressions#6.2.4. Function Types]].

## T

**Tagging Interface** (marker interface)
Interface **không có method nào**; mục đích duy nhất là **cho phép dùng `instanceof` để hỏi kiểu**. `Cloneable` là một trong số ít tagging interface Java cung cấp. Sách **khuyến nghị KHÔNG dùng tagging interface trong chương trình của bạn**. Xem [[01 - Interfaces#6.1.9. Object Cloning]].

**this$0**
Instance field do compiler sinh ra trong inner class để **giữ reference tới outer class**. **Tên do compiler tổng hợp — không tham chiếu tới nó trong code được.** Từ **Java 18**, field này **chỉ được cấp khi thực sự cần**, bị bỏ nếu không method nào của inner class truy cập outer class. Tương tự, local inner class lưu local variable bị capture vào field dạng **`val$beep`**. Xem [[03 - Inner Classes#6.3.3. Are Inner Classes Useful? Actually Necessary? Secure?]] và [[03 - Inner Classes#6.3.5. Accessing Variables from Outer Methods]].

**Timsort**
Tên thuật toán mà `Arrays.sort` dùng. Nó **không kiểm tra ba quy tắc comparator cho mọi phần tử**, nhưng **đôi khi phát hiện vi phạm với chi phí không đáng kể** rồi ném exception *"Comparison method violates its general contract!"*. Với array 1.000 phần tử và comparator ngẫu nhiên, xác suất xảy ra là **trên 10%**. Xem [[01 - Interfaces#6.1.8. The Comparator Interface]].

---

## Ba biến thể của method reference

| Dạng | Tương đương lambda |
|---|---|
| `object::instanceMethod` | `x -> object.instanceMethod(x)` |
| `Class::instanceMethod` | `(x, y) -> x.instanceMethod(y)` — **parameter đầu thành implicit parameter** |
| `Class::staticMethod` | `(x, y) -> Class.staticMethod(x, y)` |

Xem [[02 - Lambda Expressions#6.2.5. Method References]].

## Hai luật khử xung đột default method

| # | Luật |
|---|---|
| 1 | **Superclass thắng** — concrete method của superclass làm default method trùng tên, trùng kiểu parameter **bị bỏ qua** |
| 2 | **Interface xung đột** — nếu **ít nhất một interface cung cấp implementation**, compiler báo lỗi, lập trình viên **phải override để khử nhập nhằng** (dùng `Person.super.getName()`) |

Xem [[01 - Interfaces#6.1.6. Resolving Default Method Conflicts]].
