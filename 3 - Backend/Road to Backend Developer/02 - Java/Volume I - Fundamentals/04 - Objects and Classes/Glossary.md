# Glossary — Objects and Classes

> Thuật ngữ chương 4: Objects and Classes. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**Accessor Method**
Method chỉ **đọc** object mà không sửa gì. Ví dụ `LocalDate.getYear`, `GregorianCalendar.get`. Loại accessor chỉ trả về giá trị của instance field còn gọi là **field accessor**. Java không có cú pháp riêng phân biệt accessor với mutator (C++ dùng hậu tố `const`). Xem [[02 - Using Predefined Classes#4.2.3. Mutator and Accessor Methods]].

**Aggregation ("has–a")**
Quan hệ **chứa** giữa hai class: object của class A chứa object của class B. Ví dụ `Order` chứa các `Item`. Ký hiệu UML: nét liền, đầu hình thoi rỗng. Một số nhà phương pháp luận thích dùng quan hệ "association" tổng quát hơn. Xem [[01 - Introduction to Object-Oriented Programming#4.1.4. Relationships between Classes]].

## C

**Canonical Constructor**
Constructor được **định nghĩa tự động** trong một `record`, đặt giá trị cho **mọi instance field**. Xem [[07 - Records#4.7.2. Constructors: Canonical, Compact, and Custom]].

**Class**
Bản quy định cách object được tạo ra. Sách ví class là **khuôn cắt bánh**, object là **cái bánh**. Dựng object từ class = tạo ra một **instance** của class đó. Xem [[01 - Introduction to Object-Oriented Programming#4.1.1. Classes]].

**Class Path**
Tập hợp **mọi vị trí có thể chứa file class**. Ngăn cách bằng `:` trên UNIX, `;` trên Windows; dấu `.` chỉ thư mục hiện tại. Set bằng option `-classpath` / `-cp` / `--class-path` (khuyến nghị) hoặc biến môi trường `CLASSPATH`. Java API luôn được tìm tới, **đừng đưa vào class path**. `javac` luôn tìm trong thư mục hiện tại, còn `java` **chỉ tìm nếu `.` có trong class path**. Xem [[08 - Packages#4.8.6. The Class Path]].

**Compact Constructor**
Dạng constructor của `record` **không ghi danh sách parameter**, dùng để **validate hoặc normalize** parameter. Thân của nó là **"prelude"** cho canonical constructor: chỉ sửa **biến parameter** trước khi chúng được gán vào instance field. **Không đọc cũng không sửa được instance field** trong thân compact constructor. Xem [[07 - Records#4.7.2. Constructors: Canonical, Compact, and Custom]].

**Component**
Tên gọi trong Java language specification cho **instance field của một record**. Xem [[07 - Records#4.7.1. The Record Concept]].

**Constructor**
Method đặc biệt có nhiệm vụ **dựng và khởi tạo object**. 5 quy tắc: trùng tên class · một class có nhiều constructor được · có 0/1/nhiều parameter · **không có giá trị trả về** · **luôn được gọi bằng `new`**. Không gọi được constructor lên object đã tồn tại để reset field. Xem [[03 - Defining Your Own Classes#4.3.4. First Steps with Constructors]].

**Coupling**
Thuật ngữ software engineering chỉ mức độ phụ thuộc giữa các class. Nên **giảm tối đa**: nếu class A không biết class B tồn tại thì thay đổi ở B không sinh bug trong A. Xem [[01 - Introduction to Object-Oriented Programming#4.1.4. Relationships between Classes]].

## D

**Dependence ("uses–a")**
Quan hệ tổng quát nhất: một class **phụ thuộc** class khác nếu method của nó **dùng hoặc thao tác lên object** của class kia. Ví dụ `Order` dùng `Account` để kiểm tra credit status. Ký hiệu UML: nét đứt, đầu mũi tên hở. Xem [[01 - Introduction to Object-Oriented Programming#4.1.4. Relationships between Classes]].

**Deprecated**
Trạng thái của một method khi người thiết kế library nhận ra **lẽ ra không nên đưa method đó vào ngay từ đầu**. Vẫn dùng được nhưng có compiler warning, và **có thể bị gỡ** ở phiên bản sau. JDK có công cụ `jdeprscan` để quét. Xem [[02 - Using Predefined Classes#4.2.2. The LocalDate Class of the Java Library]].

## E

**Encapsulation** (information hiding)
Gộp **data** và **behavior** vào chung một gói, rồi **giấu chi tiết implementation** khỏi người dùng object. Chìa khoá để nó hoạt động: **method không bao giờ truy cập trực tiếp instance field của class khác**. Cho object hành vi **"black box"** — class đổi hoàn toàn cách lưu data mà object khác chả biết, miễn giữ nguyên bộ method. Xem [[01 - Introduction to Object-Oriented Programming#4.1.1. Classes]] và [[03 - Defining Your Own Classes#4.3.8. Benefits of Encapsulation]].

**Entry Point**
Class được chỉ định làm điểm khởi động chương trình trong file JAR, khai báo bằng option `e` của lệnh `jar` hoặc dòng `Main-Class:` trong manifest. **Không thêm đuôi `.class`** vào tên. Xem [[09 - JAR Files#4.9.3. Executable JAR Files]].

**Epoch**
Mốc thời gian cố định mà class `Date` đếm millisecond từ đó: **`00:00:00 UTC, 1/1/1970`**. Xem [[02 - Using Predefined Classes#4.2.2. The LocalDate Class of the Java Library]].

**Explicit Argument**
Argument nằm **trong ngoặc sau tên method**. Đối lập với implicit argument. Xem [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters]].

## F

**Factory Method** (static factory method)
Static method dựng object thay cho constructor. Ví dụ `LocalDate.now()`, `LocalDate.of()`, `NumberFormat.getCurrencyInstance()`, `Integer.valueOf()`. Ba lý do ưu tiên hơn constructor: **đặt tên được** · **thay đổi được kiểu object trả về** (trả về class con chuyên biệt hơn) · **chia sẻ instance được** thay vì luôn tạo mới. Xem [[04 - Static Fields and Methods#4.4.4. Factory Methods]].

**Final Instance Field**
Instance field khai báo `final`, **phải được khởi tạo khi object được dựng** và **không sửa lại được**. Hữu ích nhất với kiểu primitive hoặc class immutable. Với class mutable thì `final` **chỉ có nghĩa là reference không trỏ sang object khác**, còn **nội dung object vẫn mutate được**. Field `final` **có thể là null**. Xem [[03 - Defining Your Own Classes#4.3.11. Final Instance Fields]].

**Fully Qualified Name**
Tên đầy đủ của một class gồm tên package rồi tới tên class, ví dụ `com.horstmann.corejava.Employee`. Bytecode trong file class **luôn dùng full package name**. Xem [[08 - Packages#4.8.1. Package Names]].

## I

**Immutable**
Một class là immutable nếu **không method nào của nó mutate object của nó**. Ví dụ `String`, `LocalDate`, các class trong `java.time`. Ưu điểm: **an toàn chia sẻ giữa nhiều thread**. Xem [[11 - Class Design Hints#7. Prefer immutable classes]] và [[03 - Defining Your Own Classes#4.3.11. Final Instance Fields]].

**Implicit Argument**
Object đứng **trước tên method** trong lời gọi. Còn gọi là **target** hoặc **receiver** của lời gọi method. Không có biến parameter nào được khai báo cho nó — thay vào đó mọi method có một **implicit parameter tên `this`**. Xem [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters]].

**Inheritance ("is–a")**
Quan hệ giữa class **chuyên biệt hơn** và class **tổng quát hơn**. Class D `extends` class C thì D thừa hưởng method của C và **có nhiều khả năng hơn**. Java có **"cosmic superclass"** là `Object`, mọi class khác đều extend nó. Ký hiệu UML: nét liền, đầu tam giác rỗng. Chi tiết Chapter 5. Xem [[01 - Introduction to Object-Oriented Programming#4.1.4. Relationships between Classes]].

**Initialization Block**
Block code trong khai báo class, **chạy mỗi khi một object được dựng**, trước thân constructor. Cơ chế thứ ba để khởi tạo instance field (sau constructor và gán tại khai báo). Sách nói cơ chế này **chưa bao giờ là bắt buộc và không phổ biến**. Luôn đặt **sau phần định nghĩa field**. Xem [[06 - Object Construction#4.6.7. Initialization Blocks]].

**Instance**
Một object cụ thể được tạo ra từ một class. Xem [[01 - Introduction to Object-Oriented Programming#4.1.1. Classes]].

**Instance Field**
Các mẩu data bên trong một object. Nên **luôn để `private`**. Khác local variable ở chỗ **được tự động khởi tạo** về giá trị mặc định (`0` / `false` / `null`) nếu không set tường minh. Xem [[03 - Defining Your Own Classes#4.3.3. Dissecting the Employee Class]].

## J

**JAR** (Java Archive)
File chứa nhiều file class và thư mục con ở **định dạng ZIP nén**. Tạo bằng công cụ `jar` với option kiểu `tar` (`c`, `f`, `v`, `x`, `t`, `u`, `m`, `M`, `e`, `i`, `C`, `0`). Xem [[09 - JAR Files]].

**javadoc**
Công cụ của JDK sinh **tài liệu HTML từ file nguồn**. Trích thông tin cho: module, package, class/interface `public`, field `public`/`protected`, constructor và method `public`/`protected`. Comment bắt đầu bằng `/**`. Xem [[10 - Documentation Comments]].

## M

**Manifest**
File `MANIFEST.MF` trong thư mục con `META-INF` của file JAR, mô tả nội dung và nguồn gốc archive. Manifest hợp lệ tối thiểu chỉ có `Manifest-Version: 1.0`. Chia thành các **section** ngăn nhau bằng dòng trống; section đầu là **main section**, các section sau bắt đầu bằng entry `Name`. **Dòng cuối phải kết thúc bằng ký tự xuống dòng.** Xem [[09 - JAR Files#4.9.2. The Manifest]].

**Multi-Release JAR**
File JAR chứa class riêng cho từng phiên bản Java trong thư mục `META-INF/versions`, kèm dòng `Multi-Release: true` trong manifest. Mục đích **duy nhất**: giúp **một** phiên bản chương trình/thư viện chạy được với **nhiều release JDK**. Public API của mọi class **phải giống nhau ở mọi release**. Xem [[09 - JAR Files#4.9.4. Multi-Release JAR Files]].

**Mutator Method**
Method **sửa state** của object mà nó được gọi lên. Ví dụ `GregorianCalendar.add`. Lợi ích so với để field public: **thực hiện được error checking**. Xem [[02 - Using Predefined Classes#4.2.3. Mutator and Accessor Methods]].

## N

**Native Method**
Method **không implement bằng Java**. Native method **vượt qua được cơ chế kiểm soát truy cập của Java** — ví dụ `System.setOut` đổi được giá trị của biến `final` `System.out`. Sách nói đây là cách lách **rất bất thường**, đừng bắt chước. Xem [[04 - Static Fields and Methods#4.4.2. Static Constants]].

**NullPointerException**
Exception sinh ra khi **gọi method lên giá trị `null`**. Lỗi nghiêm trọng, tương tự "index out of bounds"; không catch thì chương trình bị kết thúc. **Từ Java 14**, thông báo lỗi kèm **tên biến hoặc method** mang giá trị null. Xem [[03 - Defining Your Own Classes#4.3.6. Working with null References]].

## O

**Object**
Ba đặc điểm cốt lõi: **behavior** (làm được gì) · **state** (phản ứng ra sao) · **identity** (phân biệt với object khác bằng gì). Object cùng class **luôn khác nhau về identity**, và **thường** khác nhau về state. State **không tự dưng đổi** — mọi thay đổi phải là hệ quả của một lời gọi method. Xem [[01 - Introduction to Object-Oriented Programming#4.1.2. Objects]].

**Object Variable**
Biến **trỏ tới** object, **không chứa** object. Giá trị của nó là một **reference** tới object nằm ở chỗ khác. Gán `null` để báo hiện không trỏ tới object nào. Khai báo xong mà chưa khởi tạo thì **chưa gọi được method nào** lên nó. Xem [[02 - Using Predefined Classes#4.2.1. Objects and Object Variables]].

**OOP** (Object-Oriented Programming)
Paradigm thống trị hiện nay, thay thế lập trình structured/procedural từ thập niên 1970. Đảo ngược thứ tự so với procedural: **đặt data trước, thuật toán sau**. Xem [[01 - Introduction to Object-Oriented Programming#4.1. Introduction to Object-Oriented Programming]].

**Overloading**
Nhiều method **cùng tên nhưng khác parameter**. Compiler chọn method đúng bằng cách khớp kiểu parameter với kiểu argument — quá trình này gọi là **overloading resolution**. Java cho phép overload **mọi method**, không riêng constructor. Xem [[06 - Object Construction#4.6.1. Overloading]].

## P

**Package**
Tập hợp gom các class lại, để **đảm bảo tên class là duy nhất**. Dùng **tên miền Internet viết ngược** để chắc chắn tên package duy nhất. Từ góc nhìn compiler, **không có quan hệ nào giữa các package lồng nhau**. Xem [[08 - Packages#4.8.1. Package Names]].

**Package Access**
Mức truy cập **mặc định** khi không ghi `public` cũng không ghi `private`: mọi method **trong cùng package** đều truy cập được. Hợp lý cho class, nhưng là **lựa chọn đáng tiếc cho biến** vì rất dễ quên gõ `private` — ví dụ `warningString` trong `java.awt.Window` sau hơn 20 năm vẫn không phải `private`. Package **không phải thực thể đóng**: ai cũng thêm class vào được. Nay nên dùng **module** để encapsulate package. Xem [[08 - Packages#4.8.5. Package Access]].

**private**
Keyword đảm bảo **chỉ method của chính class đó** truy cập được instance field. Lưu ý: `private` riêng tư ở **mức class chứ không phải mức object** — method của class `Employee` truy cập được private field của **bất kỳ object `Employee`** nào. Xem [[03 - Defining Your Own Classes#4.3.9. Class-Based Access Privileges]].

**Private Method**
Method để `private`, thường là **helper method** tách ra từ code tính toán. Lợi ích: **không có nghĩa vụ giữ nó** khi đổi implementation — cứ việc xoá bỏ, vì chắc chắn không ai dùng ở đâu khác. Xem [[03 - Defining Your Own Classes#4.3.10. Private Methods]].

**public**
Keyword nghĩa là **method ở bất kỳ class nào cũng gọi được**. Để instance field là public là **ý rất tệ** vì phá sạch encapsulation. Nhưng **public constant** (field `final`) thì ổn. Một file nguồn chỉ được có **một class public**, và **tên file phải khớp tên class public đó**. Xem [[03 - Defining Your Own Classes#4.3.3. Dissecting the Employee Class]].

## R

**Record**
Dạng đặc biệt của class, state **immutable** và **đọc được công khai**. Compiler tự sinh: instance field `final`, canonical constructor, accessor method (tên là `x()` chứ **không phải `getX()`**), cùng ba method `toString`, `equals`, `hashCode`. **Không thêm được instance field.** Field tự động `final` nhưng **có thể trỏ tới object mutable** — khi đó instance của record thành mutable. Giới thiệu preview ở **JDK 14**, chính thức ở **JDK 16**. Xem [[07 - Records]].

**Reference**
Giá trị mà object variable nắm giữ, trỏ tới object nằm ở chỗ khác. Toán tử `new` trả về một reference. Object reference được **truyền theo giá trị** (passed by value), không phải call by reference. Xem [[02 - Using Predefined Classes#4.2.1. Objects and Object Variables]] và [[05 - Method Parameters]].

## S

**Signature**
**Tên method + danh sách kiểu parameter.** **Kiểu trả về KHÔNG thuộc signature** — không thể có hai method cùng tên, cùng kiểu parameter mà khác kiểu trả về. Xem [[06 - Object Construction#4.6.1. Overloading]].

**Shadow**
Hiện tượng local variable hoặc parameter **che khuất instance field cùng tên**. Là bẫy khi lỡ khai báo `String name = n;` trong constructor (instance field không được set), nhưng cũng là **mẹo hữu ích** khi cố ý đặt parameter trùng tên field rồi dùng `this.name = name;`. Xem [[03 - Defining Your Own Classes#4.3.4. First Steps with Constructors]] và [[06 - Object Construction#4.6.5. Parameter Names]].

**State**
Tập hợp **giá trị cụ thể** của các instance field tại một thời điểm. Xem [[01 - Introduction to Object-Oriented Programming#4.1.1. Classes]].

**static**
Modifier báo rằng field/method **thuộc về class, không thuộc object riêng lẻ**. Static field **chỉ có một bản duy nhất**, tồn tại **kể cả khi chưa có object nào**. Ở một số ngôn ngữ OOP khác gọi là **class field**; từ "static" là **di sản vô nghĩa từ C++** (nghĩa thứ ba trong lịch sử của keyword này). Xem [[04 - Static Fields and Methods#4.4.1. Static Fields]].

**Static Import**
Dạng `import` cho phép import **static method và field**, không chỉ class. Ví dụ `import static java.lang.System.*;` rồi dùng `out.println(...)`. Import được cả hằng số enum. Xem [[08 - Packages#4.8.3. Static Imports]].

**Static Initialization Block**
Block gắn keyword `static`, chạy **khi class được load lần đầu tiên**, dùng khi static field cần code khởi tạo phức tạp. Tới tận Java 6 còn viết được "Hello, World" **không cần method `main`** nhờ cơ chế này; **từ Java 7** thì `java` kiểm tra sự tồn tại của `main` trước. Xem [[06 - Object Construction#4.6.7. Initialization Blocks]].

**Static Method**
Method **không thao tác lên object**, tức **không có implicit parameter `this`**. Truy cập được static field nhưng **không truy cập được instance field**. Dùng khi: method không cần state của object (`Math.pow`), hoặc chỉ cần static field (`Employee.advanceId`). Nên gọi bằng **tên class**, không phải bằng object. Xem [[04 - Static Fields and Methods#4.4.3. Static Methods]].

## T

**this**
Keyword mang **hai nghĩa**: (1) **implicit parameter** của method, trỏ tới object mà method được gọi lên; (2) khi đứng ở **câu lệnh đầu tiên** của constructor dưới dạng `this(...)` thì nó **gọi một constructor khác của cùng class**. Xem [[03 - Defining Your Own Classes#4.3.7. Implicit and Explicit Parameters]] và [[06 - Object Construction#4.6.6. Calling Another Constructor]].

## U

**UML** (Unified Modeling Language)
Ký hiệu để vẽ **class diagram** mô tả quan hệ giữa các class. Class vẽ thành hình chữ nhật, quan hệ vẽ thành mũi tên với các kiểu đầu mũi khác nhau (inheritance, interface implementation, dependency, aggregation). Xem [[01 - Introduction to Object-Oriented Programming#4.1.4. Relationships between Classes]].

**Unnamed Package**
Package **không có tên**, chứa các class trong file nguồn **không có câu lệnh `package`**. Xem [[08 - Packages#4.8.4. Addition of a Class into a Package]].

## V

**var**
Keyword khai báo local variable **không ghi kiểu**, miễn kiểu suy ra được từ giá trị khởi tạo. **Chỉ dùng được cho local variable trong method** — parameter và field **luôn phải khai báo kiểu**. Xem [[03 - Defining Your Own Classes#4.3.5. Declaring Local Variables with var]].

---

## Ba luật về method parameter

> Java **luôn dùng call by value** — method nhận bản copy của mọi argument.

| # | Điều luật |
|---|---|
| 1 | Method **KHÔNG sửa được** parameter kiểu primitive |
| 2 | Method **CÓ THỂ đổi state** của object parameter |
| 3 | Method **KHÔNG làm được** object parameter trỏ sang object mới |

Xem [[05 - Method Parameters]].
