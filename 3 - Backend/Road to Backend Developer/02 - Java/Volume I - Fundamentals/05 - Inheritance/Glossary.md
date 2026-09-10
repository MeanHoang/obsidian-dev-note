# Glossary — Inheritance

> Thuật ngữ chương 5: Inheritance. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**Abstract Class**
Class **không instantiate được** — khai báo `abstract` thì **không tạo được object của class đó**. Vẫn **có được field và concrete method**. Một class **có một hay nhiều abstract method thì bản thân nó phải khai báo `abstract`**; ngược lại, một class **vẫn khai báo `abstract` được dù không có abstract method nào**. Vẫn tạo được **object variable** của abstract class, nhưng biến đó **phải trỏ tới object của một subclass không abstract**. Xem [[06 - Abstract Classes#5.6. Abstract Classes]].

**Abstract Method**
Method khai báo bằng keyword `abstract`, **không cần cài đặt gì cả**. Đóng vai trò **placeholder cho method được cài ở subclass**. Extend một abstract class thì có hai lựa chọn: **để một phần/toàn bộ abstract method chưa định nghĩa** (subclass cũng phải là `abstract`), hoặc **định nghĩa hết** (subclass hết abstract). Gặp thường xuyên nhất **bên trong interface**. Xem [[06 - Abstract Classes#5.6. Abstract Classes]].

**AccessibleObject**
Superclass chung của `Field`, `Method`, `Constructor`. Chứa method **`setAccessible`** để **ghi đè access control của Java**. Tính năng này dành cho **debugger, lưu trữ bền vững và các cơ chế tương tự**. Xem [[10 - Reflection#5.10.5. Using Reflection to Analyze Objects at Runtime]].

**ArrayList**
Class **tương tự mảng nhưng tự động điều chỉnh capacity** khi thêm/bớt phần tử, **không cần code thêm**. Là **generic class có type parameter**: `ArrayList<Employee>`. Truy cập phần tử bằng **`get`/`set`** thay cho cú pháp `[]`. Đếm phần tử bằng **`size()`** thay cho `length`. Xem [[03 - Generic Array Lists#5.3. Generic Array Lists]].

**ArrayStoreException**
Exception sinh ra khi **cố lưu một reference không tương thích vào một mảng**. Mọi mảng **nhớ kiểu phần tử lúc được tạo** và **giám sát để chỉ reference tương thích mới lưu vào được**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.5. Polymorphism]].

**Autoboxing**
Phép chuyển đổi **tự động từ primitive type sang wrapper object**: `list.add(3)` được dịch thành `list.add(Integer.valueOf(3))`. Chiều ngược lại là **unboxing**. Boxing/unboxing là **"phép lịch sự" của compiler, không phải của virtual machine**. Sách ghi chú: **"autowrapping" thì nhất quán hơn, nhưng ẩn dụ "boxing" mượn từ C#**. Xem [[04 - Object Wrappers and Autoboxing#5.4. Object Wrappers and Autoboxing]].

## C

**Casting**
Việc **ép chuyển từ kiểu này sang kiểu khác**. Với object reference: **bọc tên class đích trong ngoặc đơn** rồi đặt trước reference. **Chỉ có một lý do để cast**: dùng object **với toàn bộ khả năng của nó sau khi actual type tạm thời bị quên đi**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.8. Casting]].

**Checked Exception**
Loại exception mà **compiler kiểm tra rằng lập trình viên biết về nó và sẵn sàng xử lý hậu quả**. Method chứa câu lệnh có thể ném checked exception **phải thêm mệnh đề `throws`**; **mọi method gọi nó cũng cần khai báo `throws`**, kể cả `main`. Ví dụ: `Class.forName`. Xem [[10 - Reflection#5.10.2. A Primer on Declaring Exceptions]].

**Class (class `java.lang.Class`)**
Class giữ **runtime type identification**. Tên gọi **hơi dễ nhầm**. Lấy bằng `obj.getClass()`, `Class.forName(name)`, hoặc lối viết tắt **`T.class`**. Object `Class` **thực chất mô tả một kiểu**, có thể không phải class (`int.class` vẫn là object kiểu `Class`). Virtual machine **quản lý một object `Class` duy nhất cho mỗi kiểu**, nên **so sánh bằng `==` được**. Xem [[10 - Reflection#5.10.1. The Class Class]].

**Covariant Return Types**
Khi override, subclass **được phép đổi kiểu trả về thành subtype của kiểu gốc** — ví dụ `Employee getBuddy()` ở superclass và `Manager getBuddy()` ở subclass. **Kiểu trả về không thuộc signature.** Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

## D

**Diamond Syntax**
Cú pháp bỏ type argument ở vế phải: `ArrayList<Employee> staff = new ArrayList<>();`. Gọi là "diamond" vì cặp `<>` **trông giống viên kim cương**. Compiler **suy ra kiểu từ biến/parameter/method** nhận giá trị mới. **Không dùng cùng `var`** — `var elements = new ArrayList<>();` cho ra `ArrayList<Object>`. Xem [[03 - Generic Array Lists#5.3.1. Declaring Array Lists]].

**Dominance**
Khi các case của `switch` là pattern thì **thứ tự có quan trọng**: case được kiểm tra theo thứ tự, **case khớp đầu tiên được đi theo**. Nếu một case **không bao giờ khớp được vì có case đứng trước** thì đó là **lỗi compile-time** — case trước **"dominate" nó**. **Pattern có guard không dùng cho kiểm tra dominance**; **`default` không dominate case hằng** nhưng **dominate `case null`**. Xem [[09 - Pattern Matching#5.9.4. Dominance]].

**Dynamic Binding**
Việc **tự động chọn method phù hợp lúc runtime**, dựa trên **actual type của implicit argument**. Là **hành vi mặc định trong Java** (C++ cần khai báo `virtual`). Tính chất quan trọng: làm chương trình **mở rộng được mà không cần sửa code có sẵn**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

## E

**equals**
Method của `Object` **kiểm tra một object có được coi là bằng object khác không**. Bản cài trong `Object` xác định **hai reference có đồng nhất không**. Java Language Specification yêu cầu `equals` **reflexive, symmetric, transitive, consistent**, và **`x.equals(null)` phải là `false`**. Nếu subclass có quan niệm riêng về sự bằng nhau → **dùng `getClass`**; nếu quan niệm cố định ở superclass → **dùng `instanceof`**. Xem [[02 - Object The Cosmic Superclass#5.2.2. The equals Method]] và [[02 - Object The Cosmic Superclass#5.2.3. Equality Testing and Inheritance]].

**Enum (Enumeration Class)**
Kiểu do khai báo `enum` định nghĩa **thực chất là một class** với **số instance cố định** — **không dựng được object mới**, nên **so sánh bằng `==`, không cần `equals`**. Mọi enumerated type là **subclass của abstract class `Enum`**. Constructor **luôn `private`**. **Không tạo được subclass của một enumeration** (trừ khi override method ở từng instance). Enum **luôn `final`**. Xem [[07 - Enumeration Classes#5.7. Enumeration Classes]].

**Exhaustiveness**
Mọi **biểu thức `switch` phải vét cạn**: phải có case cho **mỗi giá trị selector khả dĩ**. Đạt được bằng: **case cho mọi instance của enum**, **type pattern không guard phủ mọi subtype của sealed type**, **type pattern không guard mang kiểu của selector**, hoặc **mệnh đề `default`**. **Pattern có guard không dùng được** cho kiểm tra này. Nếu không case nào khớp → **`MatchException`**. Xem [[09 - Pattern Matching#5.9.3. Exhaustiveness]].

**extends**
Keyword báo rằng bạn đang **tạo class mới dẫn xuất từ class có sẵn**. **Mọi inheritance trong Java đều là public inheritance.** Xem [[01 - Classes, Superclasses, and Subclasses#5.1.1. Defining Subclasses]].

## F

**final Class / final Method**
Class **không extend được** gọi là **final class**; method `final` thì **không subclass nào override được**. **Mọi method trong final class đều tự động `final`** (field thì không). **Chỉ có một lý do chính đáng** để dùng: **đảm bảo ngữ nghĩa không bị đổi ở subclass**. `String`, enum và record **luôn `final`**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.7. Preventing Inheritance: Final Classes and Methods]].

## G

**getClass**
Method của `Object` trả về **một class object chứa thông tin về object**. Trong `equals`, dùng `getClass` để đảm bảo **hai object chỉ bằng nhau khi thuộc cùng một class**. Xem [[02 - Object The Cosmic Superclass#5.2.2. The equals Method]] và [[10 - Reflection#5.10.1. The Class Class]].

**Guard**
Điều kiện thêm vào một pattern, dùng **keyword hạn chế `when`**. Trong biểu thức guard **dùng được biến mà pattern giới thiệu**. Guard **không thoả** thì case **không được chọn** và **case kế tiếp được kiểm tra**. Exception trong `when` thì **`switch` ném exception đó**. Xem [[09 - Pattern Matching#5.9.2. Guards]].

## H

**hashCode**
Method của `Object` trả về **một số nguyên (có thể âm) dẫn xuất từ một object**. Hash code nên **được xáo trộn**. Bản mặc định trong `Object` dẫn xuất từ **địa chỉ bộ nhớ**; với `String` thì dẫn xuất **từ nội dung**, theo thuật toán **"nhân 31 rồi cộng"**. Định nghĩa `equals` và `hashCode` **phải tương thích**: `x.equals(y)` là `true` thì `x.hashCode()` phải bằng `y.hashCode()`. Xem [[02 - Object The Cosmic Superclass#5.2.4. The hashCode Method]].

## I

**Inheritance Chain**
**Đường đi từ một class cụ thể lên các tổ tiên của nó** trong inheritance hierarchy. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.4. Inheritance Hierarchies]].

**Inheritance Hierarchy**
Tập hợp **mọi class extend chung một superclass**. Inheritance **không dừng ở một tầng**, và thường có **nhiều nhánh hậu duệ** từ một class tổ tiên xa. **Java không hỗ trợ multiple inheritance.** Xem [[01 - Classes, Superclasses, and Subclasses#5.1.4. Inheritance Hierarchies]].

**Inlining**
Tối ưu hoá **bỏ hẳn lời gọi method**, ví dụ thay `e.getName()` bằng truy cập field `e.name`. Đáng giá vì **CPU ghét branching**. Compiler **không inline được method có thể bị override**, nhưng **just-in-time compiler làm tốt hơn**: nó **biết chính xác class nào extend class nào** và **huỷ inline được** khi có subclass override method đã inline. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.7. Preventing Inheritance: Final Classes and Methods]].

**"is–a" Rule**
**Mọi object của subclass đều là một object của superclass.** Dấu hiệu đặc trưng của inheritance. Cách phát biểu khác: **substitution principle**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.5. Polymorphism]].

## M

**MatchException**
Exception sinh ra khi **không case nào của một `switch` khớp** (do sealed hierarchy hoặc enum bị sửa sau khi biên dịch), hoặc khi **một component accessor tự viết trong record pattern ném exception**. Xem [[09 - Pattern Matching#5.9.3. Exhaustiveness]].

**Method Table**
Bảng **virtual machine tính trước cho mỗi class**, **liệt kê mọi method signature và method thực sự sẽ được gọi**. Dựng sau khi load class, bằng cách **kết hợp method trong file class với method table của superclass**. Lời gọi `super.f(param)` thì VM **tra method table của superclass**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

**Modifier (class `java.lang.reflect.Modifier`)**
Class chứa **static method phân tích số nguyên do `getModifiers` trả về**: `isPublic`, `isPrivate`, `isFinal`, `isStatic`... cùng `toString` để in các modifier. Xem [[10 - Reflection#5.10.4. Using Reflection to Analyze the Capabilities of Classes]].

## N

**non-sealed**
Keyword khai báo một subclass của sealed class là **mở cho việc tạo subclass**. Là **keyword Java đầu tiên có dấu gạch nối**. Khác `sealed` (keyword **theo ngữ cảnh**, vẫn dùng làm identifier được), keyword có gạch nối **không gây rủi ro phá vỡ code cũ**; mập mờ duy nhất là **với phép trừ**. Xem [[08 - Sealed Classes#5.8. Sealed Classes]].

## O

**Object**
**Tổ tiên tối thượng** — **mọi class trong Java đều extend `Object`**, và bạn **không bao giờ phải viết `extends Object`**. Trong Java **chỉ giá trị của primitive type là không phải object**; **mọi kiểu mảng đều là class type extend `Object`**. Xem [[02 - Object The Cosmic Superclass#5.2. Object: The Cosmic Superclass]].

**Overloading Resolution**
Quá trình compiler **xác định kiểu các argument** rồi **chọn method khớp tốt nhất** trong số các method cùng tên. **Phức tạp lên vì các phép chuyển kiểu**; **không tìm được method nào khớp hoặc nhiều method cùng khớp** thì compiler **báo lỗi**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

**@Override**
Annotation gắn cho method **định override method của superclass**. Nếu bạn **lỡ định nghĩa một method mới** (ví dụ `equals(Employee other)` thay vì `equals(Object other)`) thì **compiler báo lỗi**. Xem [[02 - Object The Cosmic Superclass#5.2.3. Equality Testing and Inheritance]].

**Overriding**
Cung cấp ở subclass một method **cùng signature** với method của superclass, để thay method của superclass. Method của subclass **phải có mức hiển thị ít nhất bằng** method superclass. Subclass **thêm được field/method và override được method**, nhưng inheritance **không bao giờ lấy đi field hay method nào**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.2. Overriding Methods]].

## P

**Polymorphism**
Việc một **object variable trỏ được tới nhiều actual type khác nhau**. Trong Java, **object variable là polymorphic**: biến kiểu `Employee` trỏ được tới object `Employee` hoặc **bất kỳ subclass nào** của nó. **Không gán được superclass reference cho subclass variable.** Xem [[01 - Classes, Superclasses, and Subclasses#5.1.5. Polymorphism]].

**protected**
Modifier **giới hạn một method chỉ cho subclass**, hoặc cho method subclass truy cập một field của superclass. Trong Java, protected field **truy cập được bởi mọi class trong cùng package**. **Dùng protected field một cách thận trọng** — đi ngược tinh thần OOP; **protected method thì hợp lý hơn**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.10. Protected Access]] và [[11 - Design Hints for Inheritance#2. Don't use protected fields.]].

## R

**Raw Type**
Dạng `ArrayList` **không có hậu tố `<...>`**, với **type parameter bị xoá đi**. Tồn tại vì **trước Java 5 không có generic class**. **Hơi nguy hiểm**: `add`/`set` **nhận object thuộc bất kỳ kiểu nào**, lỗi chỉ lộ khi lấy ra và cast. Compiler dịch **mọi typed array list thành object `ArrayList` raw**; **trong virtual machine không có type parameter nào**. Xem [[03 - Generic Array Lists#5.3.1. Declaring Array Lists]] và [[03 - Generic Array Lists#5.3.3. Compatibility between Typed and Raw Array Lists]].

**Record Pattern**
Từ **Java 21**: khi kiểu khớp là một record, **khai báo được các biến bind vào các component** — `if (p instanceof Point(var a, var b))`. **Lồng nhau được**, và **ghi kiểu tường minh được**. **Không khớp được với hằng bên trong record pattern** — phải dùng guard. Record pattern **gọi các component accessor**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.9. Pattern Matching for instanceof]] và [[09 - Pattern Matching#5.9.5. Patterns and Constants]].

**Reflection**
Khả năng **tìm hiểu thêm về class và property của chúng trong một chương trình đang chạy**, và **thao tác code Java một cách động**. Một chương trình phân tích được khả năng của class gọi là **reflective**. **Mạnh nhưng phức tạp**, chủ yếu hấp dẫn **người làm tool** chứ không phải người viết ứng dụng. **Mong manh** — compiler không giúp tìm lỗi được, lỗi chỉ lộ lúc runtime. Xem [[10 - Reflection#5.10. Reflection]] và [[11 - Design Hints for Inheritance#7. Don't overuse reflection.]].

**Resource**
File dữ liệu **đi kèm một class** — ảnh, âm thanh, file text chứa thông báo và nhãn nút. Định vị bằng **`getResource`** (trả `URL`) hoặc **`getResourceAsStream`**. Mấu chốt: **VM biết cách định vị một class**, nên **tìm được resource ở cùng vị trí**. **Tự động hoá việc nạp file là tất cả những gì tính năng này làm** — **không có method chuẩn nào diễn giải nội dung**. Xem [[10 - Reflection#5.10.3. Resources]].

**Runtime Type Identification**
Thông tin mà hệ thống runtime Java **luôn duy trì trên mọi object**, **theo dõi class mà mỗi object thuộc về**. VM dùng nó để **chọn đúng method cần thực thi**. Xem [[10 - Reflection#5.10.1. The Class Class]].

## S

**sealed**
Modifier khiến một class **kiểm soát được class nào được phép kế thừa từ nó**, qua mệnh đề **`permits`**. Thêm dưới dạng **preview ở Java 15**, **chính thức ở Java 17**. Subclass được cho phép **phải truy cập được**; nếu là `public` thì **phải cùng package** (hoặc **cùng module** nếu dùng module). Động lực quan trọng: **kiểm tra exhaustiveness lúc compile-time**. **Sealed interface hoạt động y hệt.** Xem [[08 - Sealed Classes#5.8. Sealed Classes]].

**Signature**
**Tên method + danh sách kiểu parameter.** **Kiểu trả về không thuộc signature.** Định nghĩa ở subclass một method **cùng signature** với method superclass thì bạn **override** method đó. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

**Static Binding**
Trường hợp compiler **biết chính xác method nào được gọi**: method là **`private`, `static`, `final`, hoặc constructor**. Ngược lại thì phải dùng **dynamic binding lúc runtime**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.6. Understanding Method Calls]].

**Subclass** (derived class, child class)
Class mới **dẫn xuất từ class có sẵn** bằng `extends`. **Subclass có nhiều chức năng hơn superclass** — encapsulate nhiều data hơn. Khi định nghĩa subclass, bạn **chỉ cần chỉ ra phần khác biệt**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.1. Defining Subclasses]].

**super**
Keyword có **hai nghĩa**: (1) **gọi method của superclass** — `super.getSalary()`; (2) **gọi constructor của superclass** — `super(name, salary, ...)`, và lời gọi này **phải là câu lệnh đầu tiên** trong constructor của subclass. **`super` không phải reference tới một object** — không gán được cho object variable. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.2. Overriding Methods]] và [[01 - Classes, Superclasses, and Subclasses#5.1.3. Subclass Constructors]].

**Superclass** (base class, parent class)
Class có sẵn được extend. **Không phải vì nó "trên cơ" subclass** — tiền tố `super`/`sub` đến từ **ngôn ngữ tập hợp**: tập mọi employee là **superset** của tập mọi manager. Khi thiết kế, đặt **method tổng quát nhất ở superclass**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.1. Defining Subclasses]].

**Substitution Principle**
Bạn **dùng được object của subclass ở bất cứ đâu chương trình mong đợi một object của superclass**. Áp dụng **không chỉ cho cú pháp mà còn cho hành vi**: **đừng đổi hành vi được kỳ vọng khi override**. Xem [[01 - Classes, Superclasses, and Subclasses#5.1.5. Polymorphism]] và [[11 - Design Hints for Inheritance#5. Don't change the expected behavior when you override a method.]].

## T

**toString**
Method của `Object` trả về **một string biểu diễn giá trị của object**. Định dạng phổ biến: **tên class rồi các giá trị field trong ngoặc vuông**. Nên gọi **`getClass().getName()`** thay vì gắn cứng tên class, để **subclass dùng lại được qua `super.toString()`**. **Tự động được gọi** khi object được nối với string bằng `+`. Sách **rất khuyến nghị thêm `toString` vào mọi class bạn viết**. Xem [[02 - Object The Cosmic Superclass#5.2.5. The toString Method]].

**Type Pattern**
Dạng pattern trong `instanceof` và `switch`: **nếu kiểu khớp thì object được bind vào một biến của kiểu đó**. Phạm vi của biến **kéo tới hết case**, kể cả khi rơi xuyên; **không rơi xuyên vào một type pattern được** (trừ khi dùng unnamed variable). Xem [[09 - Pattern Matching#5.9. Pattern Matching]] và [[09 - Pattern Matching#5.9.6. Variable Scope and Fallthrough]].

## U

**Unchecked Exception**
Loại exception mà **compiler không kỳ vọng bạn cung cấp handler** — ví dụ **lỗi vượt biên** hay **truy cập null reference**. Lý do: bạn **nên dồn năng lượng vào việc tránh các lỗi đó hơn là viết handler cho chúng**. Xem [[10 - Reflection#5.10.2. A Primer on Declaring Exceptions]].

**Unnamed Variable**
Preview feature của **Java 21 (JEP 443)**: nếu **không cần một biến** trong type pattern hoặc record pattern, **ký hiệu nó bằng dấu gạch dưới**. Trước khi tính năng này có sẵn, dùng **hai dấu gạch dưới** (`__`), vì **một dấu gạch dưới đơn đã là keyword từ Java 9**. Xem [[09 - Pattern Matching#5.9. Pattern Matching]].

## V

**Varargs**
Method **gọi được với số lượng argument thay đổi**, khai báo bằng **dấu ba chấm `...`** — ví dụ `printf(String fmt, Object... args)`. Với người cài đặt, **`Object...` hoàn toàn giống `Object[]`**; compiler **gói các argument thành mảng và autoboxing khi cần**. **Truyền một mảng thay cho các variable argument là hợp lệ.** Xem [[05 - Methods with a Variable Number of Arguments#5.5. Methods with a Variable Number of Arguments]].

## W

**Wrapper Class**
Class đối ứng của primitive type: `Integer`, `Long`, `Float`, `Double`, `Short`, `Byte`, `Character`, `Boolean` (**sáu cái đầu kế thừa superclass chung `Number`**). Wrapper class là **immutable** và **`final`**. **Đừng dựa vào identity của wrapper object** — **đừng so sánh bằng `==`**, đừng dùng làm lock. **Đừng dùng constructor của wrapper** (deprecated) — dùng `Integer.valueOf(...)` hoặc autoboxing. Xem [[04 - Object Wrappers and Autoboxing#5.4. Object Wrappers and Autoboxing]].
