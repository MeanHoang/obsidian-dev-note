# Glossary — Generic Programming

> Thuật ngữ chương 8: Generic Programming. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## B

**Bound** (bound của type variable)
Ràng buộc đặt lên một type variable, viết `<T extends BoundingType>`, diễn đạt rằng **`T` phải là subtype của bounding type**. **Cả `T` lẫn bounding type đều có thể là class hoặc interface.** Keyword `extends` được chọn vì nó là **xấp xỉ hợp lý hơn** của quan hệ subtype. Xem [[04 - Bounds for Type Variables#8.4. Bounds for Type Variables]].

**Bounding Type**
Type đứng sau `extends` trong một bound. Khi erasure xảy ra, **raw type thay type variable bằng bound đầu tiên**, hoặc bằng `Object` nếu không có bound nào. Vì lý do hiệu năng, nên đặt **tagging interface** (interface không có method) ở **cuối danh sách bound**. Xem [[05 - Generic Code and the Virtual Machine#Raw type khi có bound]].

**Bridge Method**
Method **do compiler sinh ra** để **giữ polymorphism** khi type erasure cản trở nó. Ví dụ `DateInterval` nhận bridge method `public void setSecond(Object second) { setSecond((LocalDate) second); }`. Trong virtual machine, một method được xác định bởi **kiểu parameter VÀ return type**, nên compiler sinh được **hai method chỉ khác nhau ở return type**. Bridge method **không chỉ giới hạn ở generic type** — nó cũng xuất hiện với covariant return type. Xem [[05 - Generic Code and the Virtual Machine#Bridge method]].

## C

**`Class<T>`**
Class `Class` **bản thân nó là generic**: `String.class` là **một instance (thực ra là instance duy nhất) của `Class<String>`**. Type parameter cho phép các method của `Class<T>` **nói cụ thể hơn về return type** (`T cast(Object)`, `Constructor<T> getConstructor(...)`, ...). Xem [[09 - Reflection and Generics#8.9.1. The Generic Class `Class`]].

**Clash after Erasure**
Tình huống bất hợp lệ khi generic type bị erase làm hai method đụng độ nhau. Ví dụ `boolean equals(T)` trong `Pair<T>` erase thành `boolean equals(Object)`, **đụng độ với `Object.equals`**. Bản đặc tả còn cấm **một class hay type variable đồng thời là subtype của hai interface type vốn là hai parameterization khác nhau của cùng một interface** — vì **xung đột với bridge method**. Xem [[08 - Restrictions and Limitations#8.8.11. Beware of Clashes after Erasure]].

**Covariant Return Type**
Quan hệ giữa `Object.clone` và `Employee.clone` khi một method **chỉ định return type hạn chế hơn** lúc override. Class `Employee` khi đó thực ra có **hai method `clone`**, trong đó một là **bridge method được sinh ra**. Xem [[05 - Generic Code and the Virtual Machine#Bridge method còn lạ hơn nữa]].

## D

**Diamond Syntax**
Cú pháp `<>` cho phép **bỏ type parameter trong constructor** khi khai báo biến với type tường minh; type bị bỏ được **suy ra (infer)** từ type của biến. Dùng được cả với **anonymous subclass**. Xem [[01 - Why Generic Programming#8.1.1. The Advantage of Type Parameters]].

## E

**Erasure** → xem **Type Erasure**.

## G

**Generic Class**
**Class có một hoặc nhiều type variable**, ví dụ `Pair<T>`. Type variable đặt trong **cặp ngoặc nhọn `< >` sau tên class**, và được dùng xuyên suốt định nghĩa class để chỉ định **return type của method, type của field và local variable**. Generic class **extend hoặc implement được generic class khác**, không khác gì class thường. Xem [[02 - Defining a Simple Generic Class#8.2. Defining a Simple Generic Class]].

**Generic Method**
Method đơn lẻ **có type parameter**, nhận ra qua **cặp ngoặc nhọn và type variable** đặt **sau các modifier và trước return type**. Định nghĩa được **cả trong class thường lẫn trong generic class**. Xem [[03 - Generic Methods#8.3. Generic Methods]].

**Generic Programming**
**Viết code tái dùng được cho object thuộc nhiều type khác nhau.** Một class `ArrayList` duy nhất gom được object của bất kỳ class nào — đó là một ví dụ của generic programming. Xem [[01 - Why Generic Programming#8.1. Why Generic Programming?]].

**`GenericArrayType`**
Interface trong `java.lang.reflect`, subtype của `Type`, **mô tả generic array** (chẳng hạn `T[]`). Có method `Type getGenericComponentType()`. Xem [[09 - Reflection and Generics#8.9.3. Generic Type Information in the Virtual Machine]].

**Generic Record Pattern**
Record pattern dựng trên một generic record, ví dụ `p instanceof Pair(var a, var b)`. **Type argument được suy ra**, nhưng cũng **chỉ định tường minh được**. Dùng được trong `instanceof` lẫn trong `switch`. Xem [[05 - Generic Code and the Virtual Machine#8.5.5. Generic Record Patterns]] và [[08 - Restrictions and Limitations#8.8.12. Type Inference in Generic Record Patterns is Limited]].

## H

**Heap Pollution**
Nội dung của warning phát ra **tại chỗ khai báo** một method varargs generic. Dập được cả warning này lẫn warning tại chỗ gọi bằng annotation **`@SafeVarargs`**. Xem [[08 - Restrictions and Limitations#8.8.4. Varargs Warnings]].

## I

**Instantiate a Generic Type**
**Thay type vào chỗ type variable**, ví dụ `Pair<String>`. Kết quả coi như **một class thường**. Nói cách khác, **generic class đóng vai trò như một factory sinh ra các class thường**. Xem [[02 - Defining a Simple Generic Class#Instantiate generic type]].

## M

**Multiple Bounds**
Một type variable **có nhiều bound được**, ngăn nhau bằng dấu **`&`** (vì dấu phẩy đã dùng để ngăn các type variable). **Tối đa một trong các bound được là class**, và nếu có thì class đó **phải đứng đầu danh sách bound**. Xem [[04 - Bounds for Type Variables#Multiple bounds]].

## P

**Parameterized Type**
Generic type đã được cấp type argument cụ thể, ví dụ `Pair<Employee>`. **Luôn chuyển được thành raw type** — việc chuyển đổi này **cần thiết để giao tiếp với legacy code**. **Không tạo được array của parameterized type.** Xem [[06 - Inheritance Rules for Generic Types#Chuyển sang raw type]] và [[08 - Restrictions and Limitations#8.8.3. You Cannot Create Arrays of Parameterized Types]].

**`ParameterizedType`**
Interface trong `java.lang.reflect`, subtype của `Type`, **mô tả generic class hoặc interface type** (chẳng hạn `Comparable<? super T>`). Method: `getRawType`, `getActualTypeArguments`, `getOwnerType`. Xem [[09 - Reflection and Generics#8.9.3. Generic Type Information in the Virtual Machine]].

## R

**Raw Type**
Type **tự động được cung cấp** ứng với mỗi generic type: **tên generic type đã bỏ đi type parameter**. Các type variable **bị xoá và thay bằng bounding type** (hoặc `Object` nếu không có bound). Mọi `Pair<String>`, `Pair<LocalDate>`... đều **erase về cùng raw type `Pair`**. **Mọi truy vấn type lúc runtime chỉ cho ra raw type** — `getClass` luôn trả về `Pair.class`. Xem [[05 - Generic Code and the Virtual Machine#8.5.1. Type Erasure]] và [[08 - Restrictions and Limitations#8.8.2. Runtime Type Inquiry Only Works with Raw Types]].

## S

**`@SafeVarargs`**
Annotation đặt lên method varargs generic để **tránh cả warning tại chỗ gọi lẫn warning "possible heap pollution" tại chỗ khai báo**. Dùng nó là **hứa rằng method không ghi vào array parameter và không truyền array đó cho ai khác có thể làm vậy**. **Chỉ dùng được với constructor và method `static`, `final`, hoặc `private`** — method khác có thể bị override làm annotation vô nghĩa. Xem [[08 - Restrictions and Limitations#8.8.4. Varargs Warnings]].

**Subtype Bound** (của wildcard)
Bound dạng `? extends Employee`. Cho phép **ĐỌC từ một generic object**: `getFirst` chạy được, còn `setFirst` **phải bị compiler từ chối với mọi argument trừ `null`**. Xem [[07 - Wildcard Types#8.7.1. The Wildcard Concept]].

**Supertype Bound** (của wildcard)
Bound dạng `? super Manager`, **giới hạn ở mọi supertype của `Manager`**. Cho hành vi **ngược lại** subtype bound: bạn **truyền được argument vào method nhưng không dùng được giá trị trả về** (chỉ gán được vào `Object`). Trực giác: **supertype bound cho GHI, subtype bound cho ĐỌC**. Xem [[07 - Wildcard Types#8.7.2. Supertype Bounds for Wildcards]].

**`@SuppressWarnings("unchecked")`**
Annotation làm warning biến mất, đặt được trên **một local variable** hoặc **cả một method** (khi đó **tắt kiểm tra cho toàn bộ code bên trong method**). Xem [[05 - Generic Code and the Virtual Machine#`@SuppressWarnings`]].

## T

**Tagging Interface**
Interface **không có method**. Nên đặt ở **cuối danh sách bound** vì lý do hiệu năng, để raw type không phải chèn thêm cast. Xem [[05 - Generic Code and the Virtual Machine#Raw type khi có bound]].

**`Type`**
Interface trong package `java.lang.reflect` dùng để **diễn tả các khai báo generic type**. Có các subtype: **`Class`** (concrete type), **`TypeVariable`**, **`WildcardType`**, **`ParameterizedType`**, **`GenericArrayType`**. Bốn cái sau là **interface** — virtual machine instantiate các class phù hợp implement chúng. Xem [[09 - Reflection and Generics#8.9.3. Generic Type Information in the Virtual Machine]].

**Type Erasure**
Quá trình compiler **"xoá" type parameter**: **không có generic trong virtual machine, chỉ có class và method thường**; **mọi type parameter được thay bằng bound của chúng**; **bridge method được sinh ra để giữ polymorphism**; **cast được chèn vào khi cần để giữ type safety**. **Phần lớn các hạn chế của generic Java là hệ quả của type erasure.** Xem [[05 - Generic Code and the Virtual Machine#8.5. Generic Code and the Virtual Machine]] và [[08 - Restrictions and Limitations#8.8. Restrictions and Limitations]].

**Type Inference**
Việc compiler **tự suy ra type argument** cho một lời gọi generic method bằng cách **khớp type của argument với generic type** trong khai báo. **Gần như mọi trường hợp đều chạy trơn tru**; thỉnh thoảng compiler hiểu sai và báo rằng **có hai cách diễn giải đều hợp lệ như nhau**. Trong generic record pattern, **type inference bị hạn chế** — có lúc `default` vẫn cần để `switch` thành exhaustive. Xem [[03 - Generic Methods#Khi type inference sai]] và [[08 - Restrictions and Limitations#8.8.12. Type Inference in Generic Record Patterns is Limited]].

**Type Literal**
Mẹo **bắt (capture) một instance của interface `Type`** bằng cách dựng một **anonymous subclass** — `new TypeLiteral<ArrayList<Integer>>(){}`, lưu ý cặp `{}`. Constructor **bắt lấy generic supertype**. Dùng được vì **generic type của field và của parameter method sống sót trong virtual machine**, dù **không lấy được generic type từ một object**. Các injection framework như **CDI và Guice** dùng type literal. Xem [[09 - Reflection and Generics#8.9.4. Type Literals]].

**Type Parameter**
Cơ chế generic đưa ra thay cho việc dùng `Object`: nó **cho biết element type**, khiến code **dễ đọc hơn** và **an toàn hơn** (không cần cast, compiler chặn việc chèn object sai type). **Không thay được một primitive type vào chỗ type parameter** — có `Pair<Double>` chứ không có `Pair<double>`. Xem [[01 - Why Generic Programming#8.1.1. The Advantage of Type Parameters]] và [[08 - Restrictions and Limitations#8.8.1. Type Parameters Cannot Be Instantiated with Primitive Types]].

**Type Variable**
Biến đại diện cho type, đặt trong cặp ngoặc nhọn sau tên class hoặc trước return type của method. Thông lệ: dùng **chữ in hoa** và **giữ chúng ngắn**. Hạn chế: **không instantiate được** (`new T()` là lỗi), **không dựng được generic array** (`new T[2]` là lỗi), **không tham chiếu được trong static field/method của generic class**, **không dùng được trong mệnh đề `catch`**. Xem [[02 - Defining a Simple Generic Class#8.2. Defining a Simple Generic Class]], [[08 - Restrictions and Limitations#8.8.6. You Cannot Instantiate Type Variables]] và [[08 - Restrictions and Limitations#8.8.8. Type Variables Are Not Valid in Static Contexts of Generic Classes]].

**`TypeVariable`**
Interface trong `java.lang.reflect`, subtype của `Type`, **mô tả type variable** (chẳng hạn `T extends Comparable<? super T>`). Method: `getName`, `getBounds`. Xem [[09 - Reflection and Generics#8.9.3. Generic Type Information in the Virtual Machine]].

## U

**Unbounded Wildcard**
Wildcard **hoàn toàn không có bound**, ví dụ `Pair<?>`. **Rất khác raw type `Pair`**: giá trị trả về của `getFirst` **chỉ gán được vào `Object`**, và `setFirst` **không bao giờ gọi được, kể cả với một `Object`** (nhưng gọi được `setFirst(null)`). Hữu ích cho **các thao tác rất đơn giản** không cần type thật. Xem [[07 - Wildcard Types#8.7.3. Unbounded Wildcards]].

## W

**Wildcard Capture**
Cơ chế trong đó **type parameter của một generic helper method "bắt" wildcard**. Không biết wildcard chỉ type nào, nhưng **nó là một type xác định**, nên định nghĩa của helper hợp lý. **Chỉ hợp lệ trong hoàn cảnh rất hạn chế** — compiler phải bảo đảm được rằng **wildcard đại diện cho một type xác định duy nhất**. Xem [[07 - Wildcard Types#8.7.4. Wildcard Capture]].

**Wildcard Type**
**"Cửa thoát hiểm"** do người thiết kế Java nghĩ ra để hệ generic type bớt cứng nhắc: **type parameter được phép biến thiên**. Ví dụ `Pair<? extends Employee>` chỉ **mọi generic type `Pair` có type parameter là subclass của `Employee`**. **Wildcard không phải type variable**, nên không viết được code dùng `?` như một type. Xem [[07 - Wildcard Types#8.7. Wildcard Types]].

**`WildcardType`**
Interface trong `java.lang.reflect`, subtype của `Type`, **mô tả wildcard** (chẳng hạn `? super T`). Method: `getUpperBounds` (bound `extends`), `getLowerBounds` (bound `super`). Xem [[09 - Reflection and Generics#8.9.3. Generic Type Information in the Virtual Machine]].

---

## Bốn sự thật về cách Java dịch generic

| # | Sự thật cần nhớ |
|---|---|
| 1 | **Không có generic trong virtual machine**, chỉ có class và method thường |
| 2 | **Mọi type parameter được thay bằng bound của chúng** |
| 3 | **Bridge method được sinh ra để giữ polymorphism** |
| 4 | **Cast được chèn vào khi cần để giữ type safety** |

Xem [[05 - Generic Code and the Virtual Machine#Tóm tắt cách Java dịch generic]].
