# 03 — Object Input/Output Streams and Serialization

> Chapter 2, Section 2.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 2.3. Object Input/Output Streams and Serialization

> *"Using a fixed-length record format is a good choice if you need to store data of the same type. However, objects that you create in an object-oriented program are rarely all of the same type. For example, you might have an array called staff that is nominally an array of Employee records but contains objects that are actually instances of a subclass such as Manager."*

**Dịch:** Dùng **định dạng record độ dài cố định** là lựa chọn tốt nếu cần lưu **data cùng kiểu**. Tuy nhiên, object tạo ra trong chương trình hướng đối tượng **hiếm khi cùng một kiểu**. Ví dụ có array `staff` **danh nghĩa là array các record `Employee`** nhưng lại chứa object **thực chất là instance của subclass** như `Manager`.

> *"It is certainly possible to come up with a data format that allows you to store such polymorphic collections—but, fortunately, we don’t have to. The Java language supports a very general mechanism, called object serialization, that makes it possible to write any object to an output stream and read it again later."*

**Dịch:** Hoàn toàn có thể **tự nghĩ ra một định dạng data** để lưu các **collection đa hình (polymorphic)** như vậy — nhưng may thay, **ta không phải làm thế**. Java hỗ trợ một cơ chế **rất tổng quát** gọi là **object serialization**, cho phép **ghi bất kỳ object nào ra output stream và đọc lại sau đó**.

---

## 2.3.1. Saving and Loading Serializable Objects

> *"To save object data, you first need to open an ObjectOutputStream object:"*

```java
var out = new ObjectOutputStream(new FileOutputStream("employee.dat"));
```

> *"Now, to save an object, simply use the writeObject method of the ObjectOutputStream class as in the following fragment:"*

```java
var harry = new Employee("Harry Hacker", 50000, 1989, 10, 1);
var boss = new Manager("Carl Cracker", 80000, 1987, 12, 15);
out.writeObject(harry);
out.writeObject(boss);
```

> *"To read the objects back in, first get an ObjectInputStream object:"*

```java
var in = new ObjectInputStream(new FileInputStream("employee.dat"));
```

> *"Then, retrieve the objects in the same order in which they were written, using the readObject method:"*

```java
var e1 = (Employee) in.readObject();
var e2 = (Employee) in.readObject();
```

**Dịch:** Để lưu data object, trước hết mở một object **`ObjectOutputStream`**, rồi lưu object bằng method **`writeObject`**. Để đọc lại, lấy một object **`ObjectInputStream`**, rồi **lấy các object ra theo đúng thứ tự chúng được ghi**, bằng method **`readObject`**.

### Interface Serializable

> *"There is, however, one change you need to make to any class that you want to save to an output stream and restore from an object input stream. The class must implement the Serializable interface:"*

```java
class Employee implements Serializable { . . . }
```

> *"The Serializable interface has no methods, so you don’t need to change your classes in any way. In this regard, it is similar to the Cloneable interface that we discussed in Volume I, Chapter 6. However, to make a class cloneable, you still had to override the clone method of the Object class. To make a class serializable, you do not need to do anything else."*

**Dịch:** Tuy nhiên có **một thay đổi bắt buộc** với bất kỳ class nào bạn muốn lưu ra output stream và khôi phục từ object input stream: **class phải implement interface `Serializable`**. Interface `Serializable` **không có method nào**, nên **không phải sửa class theo cách nào cả**. Ở điểm này nó giống interface **`Cloneable`** (xem [[01 - Interfaces]]). Nhưng để một class **cloneable** thì vẫn phải **override method `clone`** của class `Object`; còn để class **serializable** thì **không cần làm gì thêm**.

> **Note (sách):** *"You can write and read only objects with the writeObject/readObject methods. For primitive type values, use methods such as writeInt/readInt or writeDouble/readDouble. (The object input/output stream classes implement the DataInput/DataOutput interfaces.)"*
>
> **Dịch:** Hai method `writeObject`/`readObject` **chỉ ghi/đọc được object**. Với giá trị **kiểu primitive**, dùng method như `writeInt`/`readInt` hay `writeDouble`/`readDouble`. (Các class object input/output stream **implement interface `DataInput`/`DataOutput`** — xem [[02 - Reading and Writing Binary Data]].)

### Object dùng chung và serial number

> *"Behind the scenes, an ObjectOutputStream looks at all the fields of the objects and saves their contents. For example, when writing an Employee object, the name, date, and salary fields are written to the output stream."*

> *"However, there is one important situation to consider: What happens when one object is shared by several objects as part of their state?"*

**Dịch:** Bên trong, `ObjectOutputStream` **nhìn vào mọi field của object và lưu nội dung của chúng**. Ví dụ khi ghi một object `Employee`, các field **name, date, salary** được ghi ra output stream. Nhưng có **một tình huống quan trọng cần xét**: chuyện gì xảy ra khi **một object được nhiều object khác dùng chung** như một phần state của chúng?

> *"To illustrate the problem, let us make a slight modification to the Manager class. Let’s assume that each manager has a secretary:"*

```java
class Manager extends Employee
{
    private Employee secretary;
    . . .
}
```

> *"Each Manager object now contains a reference to an Employee object that describes the secretary. Of course, two managers can share the same secretary, as is the case in Figure 2.5 and the following code:"*

```java
var harry = new Employee("Harry Hacker", . . .);
var carl = new Manager("Carl Cracker", . . .);
carl.setSecretary(harry);
var tony = new Manager("Tony Tester", . . .);
tony.setSecretary(harry);
```

**Dịch:** Mỗi object `Manager` giờ chứa một **reference tới object `Employee`** mô tả thư ký. Dĩ nhiên **hai manager có thể dùng chung một thư ký**.

**Figure 2.5: Two managers can share a mutual employee.**

```
                        ┌────────────────────────────────┐
                        │            Employee            │
                 ┌─────▶├────────────────────────────────┤◀──────┐
                 │      │  name = │ "Harry Hacker" │     │       │
                 │      └────────────────────────────────┘       │
                 │                                               │
  ┌───┐   ┌──────┴┐     ┌────────────────────────────────┐       │
  │ ● │──▶│   ●   │     │             Manager            │       │
  └───┘   ├───────┤     ├────────────────────────────────┤       │
staff =   │   ●   │────▶│  name = │ "Carl Cracker" │     │       │
          ├───────┤     │  secretary = │   ●   │─────────┼───────┤
          │   ●   │──┐  └────────────────────────────────┘       │
          └───────┘  │                                           │
                     │  ┌────────────────────────────────┐       │
                     │  │             Manager            │       │
                     │  ├────────────────────────────────┤       │
                     └─▶│  name = │ "Tony Tester" │      │       │
                        │  secretary = │   ●   │─────────┼───────┘
                        └────────────────────────────────┘
```

> *"Saving such a network of objects is a challenge. Of course, we cannot save and restore the memory addresses for the secretary objects. When an object is reloaded, it will likely occupy a completely different memory address than it originally did."*

> *"Instead, each object is saved with the serial number—hence the name object serialization for this mechanism. Here is the algorithm:"*

> 1. *"Associate a serial number with each object reference that you encounter (as shown in Figure 2.6)."*
> 2. *"When encountering an object reference for the first time, save the object data to the output stream."*
> 3. *"If it has been saved previously, just write “same as the previously saved object with serial number x.”"*

**Dịch:** Lưu **một mạng lưới object** như thế là chuyện khó. Dĩ nhiên **không thể lưu rồi khôi phục địa chỉ bộ nhớ** của các object thư ký: khi object được nạp lại, nó **rất có thể chiếm một địa chỉ bộ nhớ hoàn toàn khác**. Thay vào đó, **mỗi object được lưu kèm serial number** — vì thế cơ chế này mang tên **object serialization**. Thuật toán:

| Bước | Nội dung |
|---|---|
| 1 | **Gán một serial number** cho mỗi object reference gặp phải |
| 2 | Gặp một object reference **lần đầu** → **lưu data của object** ra output stream |
| 3 | Nếu **đã lưu trước đó** → chỉ ghi *"giống hệt object đã lưu có serial number x"* |

**Figure 2.6: An example of object serialization**

```
            Memory                                    File
                                                        ⋮
  ┌────────────────────────────┐      ┌──────────────────────────┐
  │          Employee          │      │ serial number = 1        │
  ├────────────────────────────┤      │ type = Employee          │
  │ name = │ "Harry Hacker" │◀─┼──┐   │ name = "Harry Hacker"    │
  └────────────────────────────┘  │   ├──────────────────────────┤
                                  │   │ serial number = 2        │
  ┌────────────────────────────┐  │   │ type = Manager           │
  │          Manager           │  │   │ name = "Carl Cracker"    │
  ├────────────────────────────┤  │   │ secretary = object 1     │
  │ name = │ "Carl Cracker" │   │  │   ├──────────────────────────┤
  │ secretary = │   ●   │───────┼──┤   │ serial number = 3        │
  └────────────────────────────┘  │   │ type = Manager           │
                                  │   │ name = "Tony Tester"     │
  ┌────────────────────────────┐  │   │ secretary = object 1     │
  │          Manager           │  │   └──────────────────────────┘
  ├────────────────────────────┤  │                 ⋮
  │ name = │ "Tony Tester" │    │  │
  │ secretary = │   ●   │───────┼──┘
  └────────────────────────────┘
```

> *"When reading the objects back, the procedure is reversed."*

> 1. *"When an object is specified in an object input stream for the first time, construct it, initialize it with the stream data, and remember the association between the serial number and the object reference."*
> 2. *"When the tag “same as the previously saved object with serial number x” is encountered, retrieve the object reference for the sequence number."*

**Dịch:** Khi đọc object trở lại thì **quy trình ngược lại**:

| Bước | Nội dung |
|---|---|
| 1 | Object xuất hiện **lần đầu** trong object input stream → **dựng nó**, khởi tạo bằng data của stream, và **ghi nhớ mối liên hệ giữa serial number và object reference** |
| 2 | Gặp tag *"giống hệt object đã lưu có serial number x"* → **lấy lại object reference** ứng với số thứ tự đó |

> **Note (sách):** *"In this chapter, we will use serialization to save a collection of objects to a disk file and retrieve it exactly as we stored it. Another very important application is the transmittal of a collection of objects across a network connection to another computer. Just as raw memory addresses are meaningless in a file, they are also meaningless when you communicate with a different processor. By replacing memory addresses with serial numbers, serialization permits the transport of object collections from one machine to another."*
>
> **Dịch:** Chương này dùng serialization để **lưu một collection object vào file trên đĩa và lấy lại đúng như đã lưu**. Một ứng dụng **rất quan trọng khác** là **truyền một collection object qua network connection tới máy tính khác**. Cũng như địa chỉ bộ nhớ thô **vô nghĩa trong một file**, chúng cũng **vô nghĩa khi giao tiếp với một processor khác**. Bằng cách **thay địa chỉ bộ nhớ bằng serial number**, serialization cho phép **vận chuyển collection object từ máy này sang máy khác**.

> *"Listing 2.3 is a program that saves and reloads a network of Employee and Manager objects (some of which share the same employee as a secretary). Note that the secretary object is unique after reloading—when newStaff[1] gets a raise, that is reflected in the secretary fields of the managers."*

**Dịch:** Listing 2.3 lưu và nạp lại một **mạng lưới object `Employee` và `Manager`** (một số dùng chung cùng một employee làm thư ký). Chú ý rằng object thư ký **vẫn là duy nhất sau khi nạp lại** — khi `newStaff[1]` được **tăng lương**, điều đó **phản ánh vào field `secretary` của các manager**.

### Listing 2.3 — `objectStream/ObjectStreamTest.java`

```java
package objectStream;

import java.io.*;

/**
 * @version 1.11 2018-05-01
 * @author Cay Horstmann
 */
class ObjectStreamTest
{
    public static void main(String[] args) throws IOException, ClassNotFoundException
    {
        var harry = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        var carl = new Manager("Carl Cracker", 80000, 1987, 12, 15);
        carl.setSecretary(harry);
        var tony = new Manager("Tony Tester", 40000, 1990, 3, 15);
        tony.setSecretary(harry);

        var staff = new Employee[3];

        staff[0] = carl;
        staff[1] = harry;
        staff[2] = tony;

        // save all employee records to the file employee.dat
        try (var out = new ObjectOutputStream(new FileOutputStream("employee.dat")))
        {
            out.writeObject(staff);
        }

        try (var in = new ObjectInputStream(new FileInputStream("employee.dat")))
        {
            // retrieve all records into a new array

            var newStaff = (Employee[]) in.readObject();

            // raise secretary's salary
            newStaff[1].raiseSalary(10);

            // print the newly read employee records
            for (Employee e : newStaff)
                System.out.println(e);
        }
    }
}
```

## API — `java.io.ObjectOutputStream` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ObjectOutputStream(OutputStream out)` | Tạo `ObjectOutputStream` để **ghi object** vào `OutputStream` chỉ định. |
| `void writeObject(Object obj)` | Ghi object chỉ định vào `ObjectOutputStream`. Method này lưu **class của object**, **signature của class**, và **giá trị của mọi field không `static`, không `transient`** của class đó **và các superclass của nó**. |

## API — `java.io.ObjectInputStream` (Java 1.1)

| Method | Mô tả (dịch) |
|---|---|
| `ObjectInputStream(InputStream in)` | Tạo `ObjectInputStream` để **đọc lại thông tin object** từ `InputStream` chỉ định. |
| `Object readObject()` | Đọc một object từ `ObjectInputStream`. Cụ thể, method này đọc lại **class của object**, **signature của class**, và **giá trị các field không `transient`, không `static`** của class và mọi superclass. Nó **deserialize** sao cho **nhiều object reference có thể được khôi phục**. |

---

## 2.3.2. Understanding the Object Serialization File Format

> *"Object serialization saves object data in a particular file format. Of course, you can use the writeObject/readObject methods without having to know the exact sequence of bytes that represents objects in a file. Nonetheless, we found studying the data format extremely helpful for gaining insight into the object serialization process. As the details are somewhat technical, feel free to skip this section if you are not interested in the implementation."*

**Dịch:** Object serialization lưu data object theo **một định dạng file cụ thể**. Dĩ nhiên bạn dùng được `writeObject`/`readObject` mà **không cần biết chuỗi byte chính xác**. Tuy vậy sách thấy việc **nghiên cứu định dạng data cực kỳ hữu ích** để hiểu sâu quá trình serialization. Vì chi tiết **hơi kỹ thuật**, **cứ bỏ qua mục này** nếu bạn không quan tâm phần implementation.

> *"Every file begins with the two-byte “magic number”"*

```
AC ED
```

> *"followed by the version number of the object serialization format, which is currently"*

```
00 05
```

> *"(We use hexadecimal numbers throughout this section to denote bytes.) Then, it contains a sequence of objects, in the order in which they were saved."*

**Dịch:** Mọi file bắt đầu bằng **"magic number" hai byte `AC ED`**, theo sau là **số phiên bản của định dạng object serialization**, hiện tại là **`00 05`**. (Cả mục này dùng **số hex** để ký hiệu byte.) Rồi file chứa **chuỗi các object, theo thứ tự chúng được lưu**.

> *"String objects are saved as"*

```
74   two-byte length   characters
```

> *"For example, the string “Harry” is saved as"*

```
74 00 05 Harry
```

> *"The Unicode characters of the string are saved in the “modified UTF-8” format."*

**Dịch:** Object `String` được lưu dưới dạng **`74` + độ dài hai byte + các character**. Các Unicode character của string được lưu ở định dạng **"modified UTF-8"**.

### Mô tả class

> *"When an object is saved, the class of that object must be saved as well. The class description contains"*
>
> - *"The name of the class"*
> - *"The serial version unique ID, which is a fingerprint of the data field types and method signatures"*
> - *"A set of flags describing the serialization method"*
> - *"A description of the data fields"*

**Dịch:** Khi một object được lưu, **class của nó cũng phải được lưu**. Phần mô tả class chứa:

| Thành phần | Nội dung |
|---|---|
| Tên class | |
| **serial version unique ID** | một **fingerprint** của **kiểu các data field và signature các method** |
| Tập **flag** | mô tả **phương pháp serialization** |
| Mô tả **các data field** | |

> *"The fingerprint is obtained by ordering the descriptions of the class, superclass, interfaces, field types, and method signatures in a canonical way, and then applying the so-called Secure Hash Algorithm (SHA) to that data."*

**Dịch:** **Fingerprint** có được bằng cách **sắp xếp mô tả của class, superclass, interface, kiểu field và signature method theo một cách chuẩn tắc (canonical)**, rồi áp dụng **Secure Hash Algorithm (SHA)** lên data đó.

> *"SHA is a fast algorithm that gives a “fingerprint” of a larger block of information. This fingerprint is always a 20-byte data packet, regardless of the size of the original data. It is created by a clever sequence of bit operations on the data that makes it essentially 100 percent certain that the fingerprint will change if the information is altered in any way. (For more details on SHA, see, for example, Cryptography and Network Security, Seventh Edition by William Stallings, Prentice Hall, 2016.) However, the serialization mechanism uses only the first eight bytes of the SHA code as a class fingerprint. It is still very likely that the class fingerprint will change if the data fields or methods change."*

**Dịch:** SHA là **thuật toán nhanh** cho ra "fingerprint" của một khối thông tin lớn hơn. Fingerprint này **luôn là gói data 20 byte**, bất kể kích thước data gốc. Nó được tạo bằng **một chuỗi phép toán bit thông minh** khiến việc fingerprint thay đổi khi thông tin bị sửa **gần như chắc chắn 100%**. Tuy vậy, cơ chế serialization **chỉ dùng tám byte đầu của mã SHA** làm class fingerprint. Vẫn **rất có khả năng** class fingerprint sẽ đổi nếu data field hoặc method thay đổi.

> *"When reading an object, its fingerprint is compared against the current fingerprint of the class. If they don’t match, it means the class definition has changed after the object was written, and an exception is generated. Of course, in practice, classes do evolve, and it might be necessary for a program to read in older versions of objects."*

**Dịch:** Khi đọc một object, **fingerprint của nó được so với fingerprint hiện tại của class**. **Không khớp** nghĩa là **định nghĩa class đã thay đổi sau khi object được ghi**, và **một exception được sinh ra**. Dĩ nhiên trên thực tế **class vẫn tiến hoá**, và chương trình có thể **cần đọc các phiên bản object cũ hơn** (xem mục 2.3.5 Versioning bên dưới).

> *"Here is how a class identifier is stored:"*
>
> - `72`
> - *"2-byte length of class name"*
> - *"Class name"*
> - *"8-byte fingerprint"*
> - *"1-byte flag"*
> - *"2-byte count of data field descriptors"*
> - *"Data field descriptors"*
> - `78` *(end marker)*
> - *"Superclass type (70 if none)"*

**Dịch:** Class identifier được lưu theo thứ tự: **`72`** · **độ dài tên class 2 byte** · **tên class** · **fingerprint 8 byte** · **flag 1 byte** · **số lượng data field descriptor 2 byte** · **các data field descriptor** · **`78` (end marker)** · **kiểu superclass (`70` nếu không có)**.

### Flag byte

> *"The flag byte is composed of three bit masks, defined in java.io.ObjectStreamConstants:"*

```java
static final byte SC_WRITE_METHOD = 1;
// class has a writeObject method that writes additional data
static final byte SC_SERIALIZABLE = 2;
// class implements the Serializable interface
static final byte SC_EXTERNALIZABLE = 4;
// class implements the Externalizable interface
```

> *"We discuss the Externalizable interface later in this chapter. Externalizable classes supply custom read and write methods that take over the output of their instance fields. The classes that we write implement the Serializable interface and will have a flag value of 02. The serializable java.util.Date class defines its own readObject/writeObject methods and has a flag of 03."*

**Dịch:** Byte flag gồm **ba bit mask** định nghĩa trong `java.io.ObjectStreamConstants`. Class **`Externalizable`** cung cấp **method read/write tuỳ chỉnh, tự lo phần output các instance field của nó**. Các class sách viết đều implement `Serializable` nên có **flag `02`**. Class `java.util.Date` (serializable) **tự định nghĩa `readObject`/`writeObject`** nên có **flag `03`**.

### Data field descriptor

> *"Each data field descriptor has the format:"*
>
> - *"1-byte type code"*
> - *"2-byte length of field name"*
> - *"Field name"*
> - *"Class name (if the field is an object)"*

> *"The type code is one of the following:"*

| Type code | Kiểu |
|---|---|
| `B` | `byte` |
| `C` | `char` |
| `D` | `double` |
| `F` | `float` |
| `I` | `int` |
| `J` | `long` |
| `L` | object |
| `S` | `short` |
| `Z` | `boolean` |
| `[` | array |

**Dịch:** Mỗi data field descriptor có định dạng: **type code 1 byte** · **độ dài tên field 2 byte** · **tên field** · **tên class (nếu field là một object)**.

> *"When the type code is L, the field name is followed by the field type. Class and field name strings do not start with the string code 74, but field types do. Field types use a slightly different encoding of their names—namely, the format used by native methods."*

**Dịch:** Khi type code là **`L`**, sau tên field là **kiểu của field**. String **tên class và tên field không bắt đầu bằng mã string `74`**, nhưng **kiểu field thì có**. Kiểu field dùng **cách mã hoá tên hơi khác** — chính là **định dạng mà native method dùng**.

> *"For example, the salary field of the Employee class is encoded as"*

```
D 00 06 salary
```

> *"Here is the complete class descriptor of the Employee class:"*

```
72 00 08 Employee
E6 D2 86 7D AE AC 18 1B 02     Fingerprint and flags
00 03                          Number of instance fields
D 00 06 salary                 Instance field type and name
L 00 07 hireDay                Instance field type and name
74 00 10 Ljava/util/Date;      Instance field class name: Date
L 00 04 name                   Instance field type and name
74 00 12 Ljava/lang/String;    Instance field class name: String
78                             End marker
70                             No superclass
```

> *"These descriptors are fairly long. If the same class descriptor is needed again in the file, an abbreviated form is used:"*

```
71   4-byte serial number
```

> *"The serial number refers to the previous explicit class descriptor."*

**Dịch:** Các descriptor này **khá dài**. Nếu **cùng một class descriptor được cần lại** trong file thì dùng **dạng rút gọn**: **`71` + serial number 4 byte**. Serial number trỏ tới **class descriptor tường minh trước đó**.

### Cách lưu object

> *"An object is stored as"*

```
73   class descriptor   object data
```

> *"For example, here is how an Employee object is stored:"*

```
40 E8 6A 00 00 00 00 00          salary field value: double
73                               hireDay field value: new object
71 00 7E 00 08                   Existing class java.util.Date
77 08 00 00 00 91 1B 4E B1 80 78 External storage (details later)
74 00 0C Harry Hacker            name field value: String
```

> *"As you can see, the data file contains enough information to restore the Employee object."*

**Dịch:** Một object được lưu dưới dạng **`73` + class descriptor + data của object**. Như thấy ở trên, **file data chứa đủ thông tin để khôi phục object `Employee`**.

### Cách lưu array

> *"Arrays are saved in the following format:"*

```
75   class descriptor   4-byte number of entries   entries
```

> *"The array class name in the class descriptor is in the same format as that used by native methods (which is slightly different from the format used by class names in other class descriptors). In this format, class names start with an L and end with a semicolon."*

**Dịch:** Array được lưu theo định dạng **`75` + class descriptor + số lượng entry 4 byte + các entry**. **Tên class của array** trong class descriptor dùng **cùng định dạng mà native method dùng** (hơi khác định dạng tên class ở các class descriptor khác). Ở định dạng này, tên class **bắt đầu bằng `L` và kết thúc bằng dấu chấm phẩy**.

> *"For example, an array of three Employee objects starts out like this:"*

```
75                             Array
72 00 0B [LEmployee;           New class, string length, class name Employee[]
FC BF 36 11 C5 91 11 C7 02     Fingerprint and flags
00 00                          Number of instance fields
78                             End marker
70                             No superclass
00 00 00 03                    Number of array entries
```

> *"Note that the fingerprint for an array of Employee objects is different from a fingerprint of the Employee class itself."*

**Dịch:** Lưu ý **fingerprint của một array các object `Employee` khác với fingerprint của chính class `Employee`**.

### Đánh số serial

> *"All objects (including arrays and strings) and all class descriptors are given serial numbers as they are saved in the output file. The numbers start at 00 7E 00 00."*

**Dịch:** **Mọi object (kể cả array và string) và mọi class descriptor đều được cấp serial number** khi được lưu vào file output. Các số **bắt đầu từ `00 7E 00 00`**.

> *"We already saw that a full class descriptor for any given class occurs only once. Subsequent descriptors refer to it. For example, in our previous example, a repeated reference to the Date class was coded as"*

```
71 00 7E 00 08
```

> *"The same mechanism is used for objects. If a reference to a previously saved object is written, it is saved in exactly the same way—that is, 71 followed by the serial number. It is always clear from the context whether a particular serial reference denotes a class descriptor or an object."*

> *"Finally, a null reference is stored as"*

```
70
```

**Dịch:** **Class descriptor đầy đủ của một class chỉ xuất hiện đúng một lần**; các descriptor sau đó **trỏ về nó**. **Cơ chế y hệt được dùng cho object**: reference tới một object đã lưu trước đó được lưu **đúng cùng cách** — tức **`71` theo sau là serial number**. **Ngữ cảnh luôn cho biết rõ** một serial reference chỉ tới class descriptor hay tới một object. Cuối cùng, **reference `null` được lưu là `70`**.

### Output có chú thích đầy đủ

> *"Here is the commented output of the ObjectRefTest program of the preceding section. Run the program, look at a hex dump of its data file employee.dat, and compare it with the commented listing. The important lines toward the end of the output show a reference to a previously saved object."*

**Dịch:** Dưới đây là **output có chú thích** của chương trình `ObjectRefTest` ở mục trước. Chạy chương trình, xem **hex dump** của file data `employee.dat`, và so với bản liệt kê có chú thích. **Những dòng quan trọng ở gần cuối output cho thấy một reference tới object đã lưu trước đó.**

```
AC ED 00 05                    File header
75                             Array staff (serial #1)
72 00 0B [LEmployee;           New class, string length, class name Employee[] (serial #0)
FC BF 36 11 C5 91 11 C7 02     Fingerprint and flags
00 00                          Number of instance fields
78                             End marker
70                             No superclass
00 00 00 03                    Number of array entries
73                             staff[0]— new object (serial #7)
72 00 07 Manager               New class, string length, class name (serial #2)
36 06 AE 13 63 8F 59 B7 02     Fingerprint and flags
00 01                          Number of data fields
L 00 09 secretary              Instance field type and name
74 00 0A LEmployee;            Instance field class name: String (serial #3)
78                             End marker
72 00 08 Employee              Superclass: new class, string length, class name (serial #4)
E6 D2 86 7D AE AC 18 1B 02     Fingerprint and flags
00 03                          Number of instance fields
D 00 06 salary                 Instance field type and name
L 00 07 hireDay                Instance field type and name
74 00 10 Ljava/util/Date;      Instance field class name: String (serial #5)
L 00 04 name                   Instance field type and name
74 00 12 Ljava/lang/String;    Instance field class name: String (serial #6)
78                             End marker
70                             No superclass
40 F3 88 00 00 00 00 00        salary field value: double
73                             hireDay field value: new object (serial #9)
72 00 0E java.util.Date        New class, string length, class name (serial #8)
68 6A 81 01 4B 59 74 19 03     Fingerprint and flags
00 00                          No instance variables
78                             End marker
70                             No superclass
77 08                          External storage, number of bytes
00 00 00 83 E9 39 E0 00        Date
78                             End marker
74 00 0C Carl Cracker          name field value: String (serial #10)
73                             secretary field value: new object (serial #11)
71 00 7E 00 04                 existing class (use serial #4)
40 E8 6A 00 00 00 00 00        salary field value: double
73                             hireDay field value: new object (serial #12)
71 00 7E 00 08                 Existing class (use serial #8)
77 08                          External storage, number of bytes
00 00 00 91 1B 4E B1 80        Date
78                             End marker
74 00 0C Harry Hacker          name field value: String (serial #13)
71 00 7E 00 0B                 staff[1]: existing object (use serial #11)
73                             staff[2]: new object (serial #14)
71 00 7E 00 02                 Existing class (use serial #2)
40 E3 88 00 00 00 00 00        salary field value: double
73                             hireDay field value: new object (serial #15)
71 00 7E 00 08                 Existing class (use serial #8)
77 08                          External storage, number of bytes
00 00 00 94 6D 3E EC 00 00     Date
78                             End marker
74 00 0B Tony Tester           name field value: String (serial #16)
71 00 7E 00 0B                 secretary field value: existing object (use serial #11)
```

> *"Of course, studying these codes can be about as exciting as reading a phone book. It is not important to know the exact file format (unless you are trying to create an evil effect by modifying the data), but it is still instructive to know that the serialized format has a detailed description of all the objects it contains, with sufficient detail to allow reconstruction of both objects and arrays of objects."*

**Dịch:** Dĩ nhiên nghiên cứu đống mã này **hào hứng cỡ đọc danh bạ điện thoại**. **Không quan trọng phải biết chính xác định dạng file** (trừ khi bạn định **giở trò xấu bằng cách sửa data**), nhưng vẫn bổ ích khi biết rằng định dạng serialize **có mô tả chi tiết mọi object nó chứa**, đủ chi tiết để **dựng lại cả object lẫn array các object**.

> *"What you should remember is this:"*
>
> - *"The serialized format contains the types and data fields of all objects."*
> - *"Each object is assigned a serial number."*
> - *"Repeated occurrences of the same object are stored as references to that serial number."*

**Dịch:** Điều **cần nhớ**:

| # | Nội dung |
|---|---|
| 1 | Định dạng serialize chứa **kiểu và data field của mọi object** |
| 2 | **Mỗi object được gán một serial number** |
| 3 | Object **lặp lại** được lưu thành **reference tới serial number đó** |

---

## 2.3.3. Modifying the Default Serialization Mechanism

> *"Certain data fields should never be serialized—for example, integer values that store file handles or handles of windows that are only meaningful to native methods. Such information is guaranteed to be useless when you reload an object at a later time or transport it to a different machine. In fact, improper values for such fields can actually cause native methods to crash. Java has an easy mechanism to prevent such fields from ever being serialized: Mark them with the keyword transient. You also need to tag fields as transient if they belong to nonserializable classes. Transient fields are always skipped when objects are serialized."*

**Dịch:** **Một số data field không bao giờ nên được serialize** — ví dụ giá trị số nguyên lưu **file handle** hay **handle của window** vốn chỉ có nghĩa với **native method**. Thông tin loại này **chắc chắn vô dụng** khi nạp lại object sau này hoặc chuyển sang máy khác. Thực tế, **giá trị sai cho các field như vậy có thể làm native method crash**. Java có cơ chế đơn giản để ngăn: **đánh dấu chúng bằng keyword `transient`**. Cũng phải gắn `transient` cho field **thuộc các class không serializable**. **Field `transient` luôn bị bỏ qua khi object được serialize.**

### readObject / writeObject riêng

> *"The serialization mechanism provides a way for individual classes to add validation or any other desired action to the default read and write behavior. A serializable class can define methods with the signature"*

```java
private void readObject(ObjectInputStream in)
    throws IOException, ClassNotFoundException;
private void writeObject(ObjectOutputStream out)
    throws IOException;
```

> *"Then, the data fields are no longer automatically serialized—these methods are called instead."*

**Dịch:** Cơ chế serialization cho phép **từng class thêm việc kiểm tra hợp lệ (validation) hoặc hành động mong muốn khác** vào hành vi read/write mặc định. Một class serializable **định nghĩa được method với signature trên**. Khi đó **các data field không còn được serialize tự động nữa** — **các method này được gọi thay**.

> *"Here is a typical example. A number of classes in the java.awt.geom package, such as Point2D.Double, are not serializable. Now, suppose you want to serialize a class LabeledPoint that stores a String and a Point2D.Double. First, you need to mark the Point2D.Double field as transient to avoid a NotSerializableException."*

```java
public class LabeledPoint implements Serializable
{
    private String label;
    private transient Point2D.Double point;
    . . .
}
```

**Dịch:** Ví dụ điển hình: một số class trong package `java.awt.geom`, như **`Point2D.Double`**, **không serializable**. Muốn serialize class `LabeledPoint` lưu một `String` và một `Point2D.Double` thì trước hết **đánh dấu field `Point2D.Double` là `transient`** để **tránh `NotSerializableException`**.

> *"In the writeObject method, we first write the object descriptor and the String field, label, by calling the defaultWriteObject method. This is a special method of the ObjectOutputStream class that can only be called from within a writeObject method of a serializable class. Then we write the point coordinates, using the standard DataOutput calls."*

```java
private void writeObject(ObjectOutputStream out)
    throws IOException
{
    out.defaultWriteObject();
    out.writeDouble(point.getX());
    out.writeDouble(point.getY());
}
```

> *"In the readObject method, we reverse the process:"*

```java
private void readObject(ObjectInputStream in)
    throws IOException
{
    in.defaultReadObject();
    double x = in.readDouble();
    double y = in.readDouble();
    point = new Point2D.Double(x, y);
}
```

**Dịch:** Trong `writeObject`, trước hết ghi **object descriptor và field `String` `label`** bằng cách gọi **`defaultWriteObject`** — một **method đặc biệt của `ObjectOutputStream`** chỉ **gọi được từ bên trong method `writeObject` của một class serializable**. Rồi ghi toạ độ điểm bằng **lời gọi `DataOutput` chuẩn**. Trong `readObject` thì **làm ngược lại**.

> *"Another example is the java.util.Date class that supplies its own readObject and writeObject methods. These methods write the date as a number of milliseconds from the epoch (January 1, 1970, midnight UTC). The Date class has a complex internal representation that stores both a Calendar object and a millisecond count to optimize lookups. The state of the Calendar is redundant and does not have to be saved."*

**Dịch:** Ví dụ khác là class **`java.util.Date`** tự cung cấp `readObject`/`writeObject` riêng: ghi ngày dưới dạng **số millisecond tính từ epoch** (**1/1/1970, nửa đêm UTC**). Class `Date` có **biểu diễn nội bộ phức tạp**, lưu **cả một object `Calendar` lẫn một số đếm millisecond** để **tối ưu việc tra cứu**. State của `Calendar` là **thừa** và **không cần lưu**.

> *"The readObject and writeObject methods only need to save and load their data fields. They should not concern themselves with superclass data or any other class information."*

**Dịch:** `readObject` và `writeObject` **chỉ cần lưu và nạp các data field của chính chúng**. Chúng **không phải bận tâm tới data của superclass** hay bất kỳ thông tin class nào khác.

### Interface Externalizable

> *"Instead of letting the serialization mechanism save and restore object data, a class can define its own mechanism. To do this, a class must implement the Externalizable interface. This, in turn, requires it to define two methods:"*

```java
public void readExternal(ObjectInput in)
    throws IOException, ClassNotFoundException;
public void writeExternal(ObjectOutput out)
    throws IOException;
```

> *"Unlike the readObject and writeObject methods that were described in the previous section, these methods are fully responsible for saving and restoring the entire object, including the superclass data. When writing an object, the serialization mechanism merely records the class of the object in the output stream. When reading an externalizable object, the object input stream creates an object with the no-argument constructor and then calls the readExternal method. Here is how you can implement these methods for the Employee class:"*

```java
public void readExternal(ObjectInput s)
    throws IOException
{
    name = s.readUTF();
    salary = s.readDouble();
    hireDay = LocalDate.ofEpochDay(s.readLong());
}

public void writeExternal(ObjectOutput s)
    throws IOException
{
    s.writeUTF(name);
    s.writeDouble(salary);
    s.writeLong(hireDay.toEpochDay());
}
```

**Dịch:** Thay vì để cơ chế serialization lo việc lưu và khôi phục data object, một class **định nghĩa được cơ chế của riêng nó** bằng cách **implement interface `Externalizable`**, kéo theo phải định nghĩa **hai method** trên. Khác với `readObject`/`writeObject` ở mục trước, hai method này **chịu trách nhiệm hoàn toàn** cho việc lưu và khôi phục **toàn bộ object, kể cả data của superclass**. Khi ghi một object, cơ chế serialization **chỉ ghi lại class của object** vào output stream. Khi đọc một object externalizable, object input stream **dựng object bằng constructor không tham số** rồi **gọi `readExternal`**.

> **Caution (sách):** *"Unlike the readObject and writeObject methods, which are private and can only be called by the serialization mechanism, the readExternal and writeExternal methods are public. In particular, readExternal potentially permits modification of the state of an existing object."*
>
> **Dịch:** Khác với `readObject`/`writeObject` vốn **`private`** và **chỉ được cơ chế serialization gọi**, hai method `readExternal`/`writeExternal` là **`public`**. Đặc biệt, **`readExternal` có khả năng cho phép sửa state của một object đang tồn tại**.

---

## 2.3.4. Serializing Singletons and Typesafe Enumerations

> *"You have to pay particular attention to serializing and deserializing objects that are assumed to be unique. This commonly happens when you are implementing singletons and typesafe enumerations."*

> *"If you use the enum construct of the Java language, you need not worry about serialization—it just works. However, suppose you maintain legacy code that contains an enumerated type such as"*

```java
public class Orientation
{
    public static final Orientation HORIZONTAL = new Orientation(1);
    public static final Orientation VERTICAL = new Orientation(2);
    private int value;
    private Orientation(int v) { value = v; }
}
```

**Dịch:** Phải **đặc biệt chú ý** khi serialize và deserialize những object **được coi là duy nhất**. Điều này thường xảy ra khi implement **singleton** và **typesafe enumeration**. Nếu dùng **cấu trúc `enum` của Java thì khỏi lo về serialization — nó chạy đúng**. Nhưng giả sử bạn bảo trì **legacy code** chứa một kiểu liệt kê như trên.

> *"This idiom was common before enumerations were added to the Java language. Note that the constructor is private. Thus, no objects can be created beyond Orientation.HORIZONTAL and Orientation.VERTICAL. In particular, you can use the == operator to test for object equality:"*

```java
if (orientation == Orientation.HORIZONTAL) . . .
```

**Dịch:** Idiom này **phổ biến trước khi enumeration được thêm vào Java**. Chú ý **constructor là `private`**, nên **không object nào được tạo ra ngoài `Orientation.HORIZONTAL` và `Orientation.VERTICAL`**. Nhờ đó **dùng được toán tử `==`** để kiểm tra object có bằng nhau không.

> *"There is an important twist that you need to remember when a typesafe enumeration implements the Serializable interface. The default serialization mechanism is not appropriate. Suppose we write a value of type Orientation and read it in again:"*

```java
Orientation original = Orientation.HORIZONTAL;
ObjectOutputStream out = . . .;
out.write(original);
out.close();
ObjectInputStream in = . . .;
var saved = (Orientation) in.read();
```

> *"Now the test"*

```java
if (saved == Orientation.HORIZONTAL) . . .
```

> *"will fail. In fact, the saved value is a completely new object of the Orientation type that is not equal to any of the predefined constants. Even though the constructor is private, the serialization mechanism can create new objects!"*

**Dịch:** Có một **điểm ngoặt quan trọng** cần nhớ khi typesafe enumeration implement `Serializable`: **cơ chế serialization mặc định không phù hợp**. Phép kiểm tra `saved == Orientation.HORIZONTAL` **sẽ thất bại**. Thực tế, giá trị lưu được là **một object hoàn toàn mới** kiểu `Orientation`, **không bằng bất kỳ hằng định sẵn nào**. **Dù constructor là `private`, cơ chế serialization vẫn tạo được object mới!**

### readResolve

> *"To solve this problem, you need to define another special serialization method, called readResolve. If the readResolve method is defined, it is called after the object is deserialized. It must return an object which then becomes the return value of the readObject method. In our case, the readResolve method will inspect the value field and return the appropriate enumerated constant:"*

```java
protected Object readResolve() throws ObjectStreamException
{
    if (value == 1) return Orientation.HORIZONTAL;
    if (value == 2) return Orientation.VERTICAL;
    throw new ObjectStreamException(); // this shouldn't happen
}
```

> *"Remember to add a readResolve method to all typesafe enumerations in your legacy code and to all classes that follow the singleton design pattern."*

**Dịch:** Để giải quyết, cần định nghĩa **một method serialization đặc biệt nữa: `readResolve`**. Nếu `readResolve` được định nghĩa, nó **được gọi sau khi object đã được deserialize**. Nó **phải trả về một object**, và object đó **trở thành giá trị trả về của `readObject`**. Nhớ **thêm `readResolve` vào mọi typesafe enumeration trong legacy code** và vào **mọi class theo singleton design pattern**.

---

## 2.3.5. Versioning

> *"If you use serialization to save objects, you need to consider what happens when your program evolves. Can version 1.1 read the old files? Can the users who still use 1.0 read the files that the new version is producing? Clearly, it would be desirable if object files could cope with the evolution of classes."*

**Dịch:** Nếu dùng serialization để lưu object, phải tính tới chuyện gì xảy ra **khi chương trình tiến hoá**. **Bản 1.1 có đọc được file cũ không? Người còn dùng 1.0 có đọc được file do bản mới sinh ra không?** Rõ ràng sẽ tốt nếu file object **đối phó được với sự tiến hoá của class**.

> *"At first glance, it seems that this would not be possible. When a class definition changes in any way, its SHA fingerprint also changes, and you know that object input streams will refuse to read in objects with different fingerprints. However, a class can indicate that it is compatible with an earlier version of itself. To do this, you must first obtain the fingerprint of the earlier version of the class. Use the standalone serialver program that is part of the JDK to obtain this number. For example, running"*

```
serialver Employee
```

> *"prints"*

```
Employee: static final long serialVersionUID = -1814239825517340645L;
```

**Dịch:** Thoạt nhìn thì có vẻ **không thể**: định nghĩa class thay đổi kiểu gì thì **SHA fingerprint cũng đổi**, và object input stream **sẽ từ chối đọc object có fingerprint khác**. Tuy nhiên, một class **có thể tuyên bố nó tương thích với phiên bản trước của chính nó**. Muốn vậy, trước hết phải **lấy fingerprint của phiên bản class cũ** bằng chương trình độc lập **`serialver`** đi kèm JDK.

> *"All later versions of the class must define the serialVersionUID constant to the same fingerprint as the original."*

```java
class Employee implements Serializable // version 1.1
{
    . . .
    public static final long serialVersionUID = -1814239825517340645L;
}
```

> *"When a class has a static data member named serialVersionUID, it will not compute the fingerprint manually but will use that value instead."*

> *"Once that static data member has been placed inside a class, the serialization system is now willing to read in different versions of objects of that class."*

**Dịch:** **Mọi phiên bản sau của class phải định nghĩa hằng `serialVersionUID` bằng đúng fingerprint của bản gốc.** Khi một class có **static data member tên `serialVersionUID`**, nó **sẽ không tự tính fingerprint** mà **dùng giá trị đó**. Một khi static data member ấy có mặt trong class, hệ thống serialization **sẵn lòng đọc các phiên bản object khác nhau của class đó**.

### Khi data field thay đổi

> *"If only the methods of the class change, there is no problem with reading the new object data. However, if the data fields change, you may have problems. For example, the old file object may have more or fewer data fields than the one in the program, or the types of the data fields may be different. In that case, the object input stream makes an effort to convert the serialized object to the current version of the class."*

**Dịch:** Nếu **chỉ method của class thay đổi** thì **đọc data object mới không có vấn đề gì**. Nhưng nếu **data field thay đổi** thì **có thể gặp rắc rối** — object trong file cũ có thể có **nhiều hơn hoặc ít hơn data field**, hoặc **kiểu của data field khác đi**. Khi đó object input stream **cố gắng chuyển object đã serialize sang phiên bản hiện tại của class**.

> *"The object input stream compares the data fields of the current version of the class with those of the version in the serialized object. Of course, the object input stream considers only the nontransient and nonstatic data fields. If two fields have matching names but different types, the object input stream makes no effort to convert one type to the other—the objects are incompatible. If the serialized object has data fields that are not present in the current version, the object input stream ignores the additional data. If the current version has data fields that are not present in the serialized object, the added fields are set to their default (null for objects, zero for numbers, and false for boolean values)."*

**Dịch:** Object input stream **so các data field của phiên bản class hiện tại với phiên bản trong object đã serialize**. Dĩ nhiên nó **chỉ xét các data field không `transient` và không `static`**.

| Tình huống | Kết quả |
|---|---|
| Hai field **trùng tên nhưng khác kiểu** | Object input stream **không cố chuyển kiểu** — **hai object không tương thích** |
| Object serialize **có field mà bản hiện tại không có** | Object input stream **bỏ qua data thừa** |
| Bản hiện tại **có field mà object serialize không có** | Field thêm vào được đặt về **mặc định** (`null` cho object, **0** cho number, **`false`** cho `boolean`) |

> *"Here is an example. Suppose we have saved a number of employee records on disk, using the original version (1.0) of the class. Now we change the Employee class to version 2.0 by adding a data field called department. Figure 2.7 shows what happens when a 1.0 object is read into a program that uses 2.0 objects. The department field is set to null. Figure 2.8 shows the opposite scenario: A program using 1.0 objects reads a 2.0 object. The additional department field is ignored."*

**Dịch:** Ví dụ: đã lưu một số record employee lên đĩa bằng **phiên bản gốc (1.0)** của class. Nay đổi class `Employee` sang **phiên bản 2.0** bằng cách **thêm data field `department`**. Khi một object **1.0 được đọc vào chương trình dùng object 2.0** thì **field `department` bị đặt `null`**. Ngược lại, chương trình dùng object 1.0 đọc một object 2.0 thì **field `department` thừa bị bỏ qua**.

**Figure 2.7: Reading an object with fewer data fields**

```
 ┌──────────────┐                                    ┌──────────────┐
 │ serialized   │        File          Memory        │ version 2.0  │
 │ version 1.0  │                                    │              │
 └──────┬───────┘                                    └───────┬──────┘
        ┊                                                    ┊
        ┊              ⋮                                     ┊
        ┊     ┌──────────────────────┐   ┌───────────────────┴──────┐
        ┊     │ serial number = ...  │   │        Employee          │
        └┈┈┈┈▶│ type = Employee      │   ├──────────────────────────┤
              │ name = "Harry Hacker"│   │ name =      │"Harry Hacker"│
              │ salary = 35000.0     │   │ salary =    │ 35000.0     │
              │ hireDay = 1989-01-15 │   │ hireDay =   │ 1989-01-15  │
              └──────────────────────┘   │ department =│    null     │
                     ⋮                   └──────────────────────────┘
```

**Figure 2.8: Reading an object with more data fields**

```
 ┌──────────────┐                                    ┌──────────────┐
 │ serialized   │        File          Memory        │ version 1.0  │
 │ version 2.0  │                                    │              │
 └──────┬───────┘                                    └───────┬──────┘
        ┊                                                    ┊
        ┊              ⋮                                     ┊
        ┊     ┌──────────────────────┐   ┌───────────────────┴──────┐
        ┊     │ serial number = ...  │   │        Employee          │
        └┈┈┈┈▶│ type = Employee      │   ├──────────────────────────┤
              │ name = "Harry Hacker"│   │ name =    │"Harry Hacker"│
              │ salary = 35000.0     │   │ salary =  │ 35000.0      │
              │ hireDay = 1989-01-15 │   │ hireDay = │ 1989-01-15   │
              │ department = "Finance"│  └──────────────────────────┘
              └──────────────────────┘
                     ⋮
```

> *"Is this process safe? It depends. Dropping a data field seems harmless—the recipient still has all the data that it knows how to manipulate. Setting a data field to null might not be so safe. Many classes work hard to initialize all data fields in all constructors to non-null values, so that the methods don’t have to be prepared to handle null data. It is up to the class designer to implement additional code in the readObject method to fix version incompatibilities or to make sure the methods are robust enough to handle null data."*

**Dịch:** **Quá trình này có an toàn không? Còn tuỳ.** **Vứt bỏ một data field** thì có vẻ **vô hại** — bên nhận vẫn có đủ data mà nó biết cách thao tác. **Đặt một data field thành `null` thì có thể không an toàn**: nhiều class **cố công khởi tạo mọi data field trong mọi constructor về giá trị khác `null`** để **method khỏi phải sẵn sàng xử lý data `null`**. **Người thiết kế class phải tự implement thêm code trong `readObject`** để sửa chỗ không tương thích phiên bản, hoặc **đảm bảo method đủ vững để xử lý data `null`**.

> **Tip (sách):** *"Before you add a serialVersionUID field to a class, ask yourself why you made your class serializable. If serialization is used only for short-term persistence, such as distributed method calls in an application server, there is no need to worry about versioning and the serialVersionUID. The same applies if you extend a class that happens to be serializable, but you have no intent to ever persist its instances. If your IDE gives you pesky warnings, change the IDE preferences to turn them off, or add an annotation @SuppressWarnings("serial"). This is safer than adding a serialVersionUID that you may later forget to change."*
>
> **Dịch:** Trước khi thêm field `serialVersionUID` vào một class, hãy **tự hỏi vì sao mình làm class đó serializable**. Nếu serialization **chỉ dùng cho lưu trữ ngắn hạn**, như **lời gọi method phân tán trong application server**, thì **không cần lo về versioning và `serialVersionUID`**. Tương tự nếu bạn extend một class tình cờ serializable nhưng **không có ý định lưu trữ instance của nó**. Nếu IDE **cảnh báo phiền phức**, hãy **đổi preference để tắt đi**, hoặc thêm annotation **`@SuppressWarnings("serial")`**. Cách này **an toàn hơn** việc thêm một `serialVersionUID` mà **sau này có thể quên đổi**.

---

## 2.3.6. Using Serialization for Cloning

> *"There is an amusing use for the serialization mechanism: It gives you an easy way to clone an object, provided the class is serializable. Simply serialize it to an output stream and then read it back in. The result is a new object that is a deep copy of the existing object. You don’t have to write the object to a file—you can use a ByteArrayOutputStream to save the data into a byte array."*

**Dịch:** Có một cách dùng **thú vị** cho cơ chế serialization: nó cho ta **cách dễ dàng để clone một object**, miễn class đó serializable. Chỉ việc **serialize nó ra output stream rồi đọc lại**. Kết quả là **một object mới, là bản copy sâu (deep copy)** của object đang có. **Không phải ghi object ra file** — dùng **`ByteArrayOutputStream`** để lưu data vào **một array byte**.

> *"As Listing 2.4 shows, to get clone for free, simply extend the SerialCloneable class, and you are done."*

> *"You should be aware that this method, although clever, will usually be much slower than a clone method that explicitly constructs a new object and copies or clones the data fields."*

**Dịch:** Như Listing 2.4 cho thấy, để **có `clone` miễn phí**, chỉ cần **extend class `SerialCloneable`** là xong. Nhưng nên biết rằng cách này, **dù thông minh, thường chậm hơn nhiều** so với một method `clone` **tường minh dựng object mới rồi copy hoặc clone từng data field**.

### Listing 2.4 — `serialClone/SerialCloneTest.java`

```java
package serialClone;

/**
 * @version 1.22 2018-05-01
 * @author Cay Horstmann
 */

import java.io.*;
import java.time.*;

public class SerialCloneTest
{
    public static void main(String[] args) throws CloneNotSupportedException
    {
        var harry = new Employee("Harry Hacker", 35000, 1989, 10, 1);
        // clone harry
        var harry2 = (Employee) harry.clone();

        // mutate harry
        harry.raiseSalary(10);

        // now harry and the clone are different
        System.out.println(harry);
        System.out.println(harry2);
    }
}

/**
 * A class whose clone method uses serialization.
 */
class SerialCloneable implements Cloneable, Serializable
{
    public Object clone() throws CloneNotSupportedException
    {
        try {
            // save the object to a byte array
            var bout = new ByteArrayOutputStream();
            try (var out = new ObjectOutputStream(bout))
            {
                out.writeObject(this);
            }

            // read a clone of the object from the byte array
            try (var bin = new ByteArrayInputStream(bout.toByteArray()))
            {
                var in = new ObjectInputStream(bin);
                return in.readObject();
            }
        }
        catch (IOException | ClassNotFoundException e)
        {
            var e2 = new CloneNotSupportedException();
            e2.initCause(e);
            throw e2;
        }
    }
}

/**
 * The familiar Employee class, redefined to extend the
 * SerialCloneable class.
 */
class Employee extends SerialCloneable
{
    private String name;
    private double salary;
    private LocalDate hireDay;

    public Employee(String n, double s, int year, int month, int day)
    {
        name = n;
        salary = s;
        hireDay = LocalDate.of(year, month, day);
    }

    public String getName()
    {
        return name;
    }

    public double getSalary()
    {
        return salary;
    }

    public LocalDate getHireDay()
    {
        return hireDay;
    }

    /**
       Raises the salary of this employee.
       @byPercent the percentage of the raise
    */
    public void raiseSalary(double byPercent)
    {
        double raise = salary * byPercent / 100;
        salary += raise;
    }

    public String toString()
    {
        return getClass().getName()
            + "[name=" + name
            + ",salary=" + salary
            + ",hireDay=" + hireDay
            + "]";
    }
}
```

---

## Bài kế tiếp

→ [[04 - Working with Files]] — interface `Path`, class `Files`, đọc/ghi file, directory, ZIP file system.
