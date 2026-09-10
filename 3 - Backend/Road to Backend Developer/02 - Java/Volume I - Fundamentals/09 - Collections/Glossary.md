# Glossary — Collections

> Thuật ngữ chương 9: Collections. Định nghĩa lấy từ Core Java Volume I, 13th Edition (Horstmann).

## A

**AbstractCollection**
Class mà framework cung cấp để **nhẹ việc cho người implement**: để `size` và `iterator` ở dạng **abstract**, còn **implement các method thủ tục dựa trên hai method đó**. Concrete collection class chỉ cần **extend** nó và tự cung cấp `iterator` và `size` (collection mutable cần thêm `add`). Sách nói cách tiếp cận này **hơi lỗi thời** — sẽ đẹp hơn nếu chúng là default method của interface `Collection`, nhưng **default method chưa tồn tại** khi framework được thiết kế. Xem [[01 - The Java Collections Framework#AbstractCollection]].

**Access Order**
Chế độ của `LinkedHashMap` dùng **thứ tự truy cập** thay vì thứ tự chèn để duyệt entry: **mỗi lần gọi `get` hoặc `put`, entry bị tác động được gỡ khỏi vị trí hiện tại và đặt vào cuối linked list các entry**. Chỉ vị trí trong linked list bị ảnh hưởng, **không phải bucket**. Hữu ích để implement chiến lược **"least recently used"** cho cache. Xem [[04 - Maps#9.4.5. Linked Hash Sets and Maps]].

**ArrayDeque**
Một **double-ended queue** được implement bằng **circular array**. Nhìn chung **nhanh hơn `LinkedList`** vì **ít gây áp lực lên garbage collector hơn**. Xuất hiện ở **Java 6**. Xem [[03 - Concrete Collections#9.3.5. Queues and Deques]].

**ArrayList**
Một **dãy có index**, **lớn lên và co lại động**; **đóng gói một array object được cấp phát lại một cách động**. Implement interface `List`. Method của nó **không `synchronized`** (khác `Vector`). Xem [[03 - Concrete Collections#9.3.2. Array Lists]] và [[03 - Generic Array Lists]].

## B

**Binary Search**
Algorithm tìm kiếm trên **collection ĐÃ được sắp xếp**: nhìn element ở giữa, so với target, rồi **tìm tiếp ở nửa đầu hoặc nửa sau** — cắt đôi bài toán mỗi bước. Với 1024 element chỉ mất **10 bước**. Giá trị trả về **không âm là index khớp**; **âm thì `-i - 1` là vị trí nên chèn** để giữ list sắp xếp. **Cần random access mới đáng dùng** — với list không implement `RandomAccess` thì nó **quay về hiệu quả ngang linear search**. Xem [[06 - Algorithms#9.6.3. Binary Search]].

**BitSet**
Class **lưu một dãy bit**, đóng gói vào các **"word" tuỳ implementation** (hiện là giá trị `long`) — **hiệu quả hơn nhiều so với array `boolean`**. Cho interface tiện lợi `get`/`set`/`clear` từng bit, **tránh masking và vọc bit**. Dùng được để biểu diễn **set các số nguyên không âm có cận trên**. Xem [[07 - Legacy Collections#9.7.6. Bit Sets]].

**Bucket**
Trong Java, hash table được implement thành **array các linked list**; **mỗi list là một bucket**. Vị trí của một object là **hash code lấy modulo tổng số bucket**. Trong `HashMap`, một bucket **biến từ linked list thành balanced binary tree** khi vượt một ngưỡng. Framework dùng **số bucket là luỹ thừa của 2, mặc định 16**. Xem [[03 - Concrete Collections#Bucket và hash collision]].

**Bulk Operation**
Thao tác **chép hoặc xoá element "hàng loạt"**: `removeAll` xoá khỏi collection mọi element có trong collection kia; `retainAll` xoá mọi element **không** có trong collection kia (dùng để **tạo giao của hai set mà không cần vòng lặp**). **Áp dụng được lên view** (ví dụ `staffMap.keySet().removeAll(...)`) và lên **subrange**. Xem [[06 - Algorithms#9.6.5. Bulk Operations]].

## C

**Checked View**
View được thiết kế làm **công cụ hỗ trợ debug** cho việc **element sai kiểu bị tuồn vào generic collection**. Method `add` của view **kiểm tra object được chèn có thuộc class cho trước không** và **ném ngay `ClassCastException` nếu không** — lợi ích là **lỗi được báo đúng chỗ**. **Bị giới hạn bởi những phép kiểm tra runtime mà virtual machine thực hiện được**. Xem [[05 - Copies and Views#9.5.6. Checked Views]].

**Collection**
Interface **nền tảng** cho các collection class trong framework, có **hai method cốt lõi**: `add` (trả về `true` nếu collection thực sự thay đổi) và `iterator`. **Extends `Iterable`**, nên dùng được vòng "for each" với mọi collection. Đừng nhầm với class **`Collections`**. Xem [[01 - The Java Collections Framework#9.1.2. The Collection Interface]].

**Collections (class)**
Class chứa **nhiều utility method** có parameter hoặc giá trị trả về là collection: `sort`, `shuffle`, `binarySearch`, `min`/`max`, `nCopies`, `unmodifiableXxx`, `synchronizedXxx`, `checkedXxx`, `newSetFromMap`… **Đừng nhầm nó với interface `Collection`**. Xem [[05 - Copies and Views#9.5.1. Small Collections]] và [[06 - Algorithms]].

**ConcurrentModificationException**
Exception mà iterator ném ra khi **phát hiện collection của nó bị sửa bởi iterator khác hoặc bởi chính method của collection**. Cơ chế phát hiện: **collection đếm số thao tác làm thay đổi nó**, **mỗi iterator giữ bộ đếm riêng**, và **đầu mỗi method iterator so hai bộ đếm**. Quy tắc tránh: **gắn bao nhiêu iterator cũng được miễn tất cả chỉ đọc**, hoặc **đúng một iterator vừa đọc vừa ghi**. Với linked list, **`set` không tính là thay đổi cấu trúc**. Xem [[03 - Concrete Collections#ConcurrentModificationException]].

## D

**Deque** (double-ended queue)
Queue cho phép **thêm hoặc xoá element ở CẢ HAI đầu** một cách hiệu quả. **Thêm element ở giữa không được hỗ trợ.** Interface `Deque` được implement bởi **`ArrayDeque` và `LinkedList`**. Ở **Java 21**, các method `getFirst`/`getLast`/`addFirst`/`addLast`/`removeFirst`/`removeLast` **được chuyển từ `Deque` sang `SequencedCollection`**. Xem [[03 - Concrete Collections#9.3.5. Queues and Deques]].

**Doubly Linked**
Trong framework, **mọi linked list thực chất là doubly linked**: mỗi link **lưu thêm reference tới link đứng trước**, chứ không chỉ link kế tiếp. Xem [[03 - Concrete Collections#9.3.1. Linked Lists]].

## E

**EnumMap**
Map có **key thuộc kiểu enumerated**, implement **đơn giản và hiệu quả dưới dạng một array các value**. **Phải chỉ định kiểu key trong constructor.** Xem [[04 - Maps#9.4.6. Enumeration Sets and Maps]].

**EnumSet**
Implementation set **hiệu quả** cho element thuộc kiểu enumerated. Vì kiểu enumerated có **số instance hữu hạn**, nó được implement bên trong là **một dãy bit** — **bit bật nếu giá trị tương ứng có trong set**. **Không có constructor public**, dùng **static factory method** (`allOf`, `noneOf`, `range`, `of`, `copyOf`). Xem [[04 - Maps#9.4.6. Enumeration Sets and Maps]].

**Enumeration**
Interface legacy để **duyệt dãy element**, có **hai method `hasMoreElements` và `nextElement`** — **hoàn toàn tương tự `hasNext` và `next`** của `Iterator`. Người thiết kế framework **không ưa cái tên method dài dòng** nên giới thiệu interface mới. Chuyển đổi bằng `Collections.list`, `Collections.enumeration`, hoặc `asIterator()`. Xem [[07 - Legacy Collections#9.7.2. Enumerations]].

## H

**HashMap**
Data structure lưu **liên kết key/value**, **hash các key**. Một trong hai implementation đa dụng của `Map`. **Hashing thường nhanh hơn một chút** và là lựa chọn ưu tiên **nếu không cần duyệt key theo thứ tự đã sắp xếp**. **Hash function chỉ áp lên key** — value **không bị hash cũng không bị so sánh**. Xem [[04 - Maps#9.4.1. Basic Map Operations]].

**Hash Code**
Số nguyên mà hash table **tính ra cho mỗi object**, **suy ra từ instance field**, tốt nhất là sao cho **object có dữ liệu khác nhau cho code khác nhau**. **Tính được nhanh** và **chỉ phụ thuộc state của object cần hash**. Phải **tương thích với `equals`**: nếu `a.equals(b)` thì **cùng hash code**. Xem [[03 - Concrete Collections#9.3.3. Hash Sets]] và [[02 - Object The Cosmic Superclass]].

**Hash Collision**
Tình huống **trúng một bucket không rỗng** khi chèn. Khi đó **so object mới với mọi object trong bucket** xem đã có chưa. Nếu hash code **phân bố ngẫu nhiên tương đối tốt** và **số bucket đủ lớn** thì **chỉ cần vài phép so sánh**. Xem [[03 - Concrete Collections#Bucket và hash collision]].

**Hash Table**
Data structure nổi tiếng để **tìm object nhanh**. Trong Java được implement thành **array các linked list (bucket)**. Xem [[03 - Concrete Collections#9.3.3. Hash Sets]].

**Hashtable (class)**
Class legacy **phục vụ cùng mục đích với `HashMap`** và có **về cơ bản là cùng interface**. **Method của nó được `synchronized`.** Nếu không cần tương thích legacy code thì **nên dùng `HashMap`**; cần truy cập concurrent thì dùng **`ConcurrentHashMap`**. Xem [[07 - Legacy Collections#9.7.1. The Hashtable Class]].

**HashSet**
Collection **không có thứ tự**, **từ chối phần tử trùng**, implement set **dựa trên hash table**. Method **`contains` được định nghĩa lại để tra cứu nhanh** — chỉ kiểm tra element **trong một bucket**. Iterator duyệt lần lượt mọi bucket nên element hiện ra theo **thứ tự trông có vẻ ngẫu nhiên**. Chỉ dùng khi **không quan tâm thứ tự**. Xem [[03 - Concrete Collections#`HashSet`]].

**Heap**
Data structure **thanh lịch và hiệu quả** mà priority queue dùng: một **binary tree tự tổ chức**, trong đó `add` và `remove` **khiến element nhỏ nhất trôi dần lên root**, **mà không mất thời gian sắp xếp mọi element**. Xem [[03 - Concrete Collections#9.3.6. Priority Queues]].

## I

**IdentityHashMap**
Map có **key được so sánh bằng `==` chứ không phải `equals`**, và **hash tính bằng `System.identityHashCode`** (từ **địa chỉ memory của object**). **Object key khác nhau được coi là phân biệt kể cả khi nội dung bằng nhau.** Hữu ích cho **thuật toán duyệt object** như object serialization. **Java 20 đã sửa một bug tinh vi** xuất hiện từ Java 8. Xem [[04 - Maps#9.4.7. Identity Hash Maps]].

**Iterable**
Interface có **một abstract method `iterator`**, thứ mà **vòng "for each" dùng ở hậu trường**. **`Collection` extends `Iterable`.** Khi viết method nhận collection, **nhận `Iterable` còn tổng quát hơn nhận `Collection`**. Xem [[01 - The Java Collections Framework#9.1.3. Iterators]] và [[06 - Algorithms#9.6.7. Writing Your Own Algorithms]].

**Iterator**
Interface có **bốn method**: `hasNext`, `next`, `remove`, `forEachRemaining`. Iterator của Java **nằm GIỮA các element**: gọi `next` thì nó **nhảy qua element kế tiếp và trả về reference tới chính element vừa nhảy qua** — **tra cứu và đổi vị trí gắn chặt với nhau** (khác STL của C++). `remove` **xoá element được trả về bởi lời gọi `next` gần nhất**, và **gọi `remove` mà trước đó không gọi `next` là bất hợp lệ** (`IllegalStateException`). Xem [[01 - The Java Collections Framework#9.1.3. Iterators]].

## L

**LinkedHashMap** / **LinkedHashSet**
Class **nhớ thứ tự các item được chèn vào**, nhờ đó **tránh được thứ tự trông có vẻ ngẫu nhiên** của hash table. Khi entry được chèn, chúng **được nối lại thành một doubly linked list**. `LinkedHashMap` còn dùng được **access order** và override được **`removeEldestEntry`** để tự động **xoá entry già nhất**. Xem [[04 - Maps#9.4.5. Linked Hash Sets and Maps]].

**LinkedList**
Dãy **có thứ tự** cho phép **chèn và xoá hiệu quả ở bất kỳ vị trí nào**. **Không hỗ trợ random access nhanh** — muốn xem element thứ n phải **bắt đầu từ đầu và nhảy qua n – 1 element**. Sách khuyên **tránh xa mọi method dùng integer index** trên linked list; cần random access thì **dùng array hoặc `ArrayList`**. **Lý do duy nhất dùng linked list là giảm chi phí chèn/xoá ở giữa list.** Xem [[03 - Concrete Collections#9.3.1. Linked Lists]].

**ListIterator**
Subinterface của `Iterator` có method **`add`** (thêm element **trước vị trí iterator**, **không trả về `boolean`**), **`set`** (thay element gần nhất được `next`/`previous` trả về), và hai method **duyệt ngược `hasPrevious`/`previous`**, cùng **`nextIndex`/`previousIndex`**. Method `add` phụ thuộc vị trí là **trách nhiệm của iterator vì iterator mô tả vị trí trong collection** — chỉ có nghĩa với **collection có thứ tự tự nhiên**. Xem [[03 - Concrete Collections#`ListIterator` — iterator biết thêm element]].

**Load Factor**
Con số **quyết định khi nào hash table được rehash**. Ví dụ load factor **0.75** (mặc định) và table **đầy hơn 75%** thì nó **tự động rehash với số bucket gấp đôi**. Với hầu hết ứng dụng, **để ở 0.75 là hợp lý**. Xem [[03 - Concrete Collections#Load factor và rehash]].

## M

**Map**
Data structure **lưu các cặp key/value**; **tìm được value nếu cung cấp key**. **Key phải là duy nhất** — gọi `put` hai lần cùng key thì **value thứ hai thay thế value thứ nhất** (và `put` **trả về value trước đó**). Framework **không coi bản thân map là một collection**. Xem [[04 - Maps#9.4. Maps]] và [[02 - Interfaces in the Collections Framework#Hai interface nền tảng: `Collection` và `Map`]].

**Map.Entry**
Interface mà các element của **entry set** implement. Instance `Map.Entry` **được nối với map** — dùng nó **cập nhật được value trong map nền** bằng `setValue`, và ngược lại. Muốn **truyền entry sang method khác** thì **tách khỏi map** bằng `Map.Entry.copyOf(entry)`; tạo entry độc lập bằng `Map.entry(key, value)`. Java **không có class `Pair`**, một số lập trình viên **dùng `Map.Entry` như "pair nhà nghèo"**. Xem [[04 - Maps#9.4.3. Map Views]].

**Modifiable / Resizable**
Hai thuật ngữ mà tài liệu dùng để mô tả **khi nào truyền một collection vào algorithm là an toàn**:
- List là **modifiable** nếu **hỗ trợ method `set`**.
- List là **resizable** nếu **hỗ trợ thao tác `add` và `remove`**.
`Collections.sort` cần list **modifiable nhưng không cần resizable**. Xem [[06 - Algorithms#9.6.2. Sorting and Shuffling]].

## N

**NavigableSet** / **NavigableMap**
Interface **bổ sung method tiện lợi để định vị các element lân cận**: `higher`, `lower`, `ceiling`, `floor`, `pollFirst`, `pollLast`. `TreeSet` implement `NavigableSet`. Với subrange, `NavigableSet` cho **kiểm soát nhiều hơn** — **chỉ định được biên có được bao gồm hay không**. Xem [[02 - Interfaces in the Collections Framework#`SortedSet`, `SortedMap`, `NavigableSet`, `NavigableMap`]] và [[05 - Copies and Views#9.5.3. Subranges]].

## O

**Optional Operation**
Cách tài liệu API mô tả nhiều method của collection và iterator interface. Vì view **thường có ràng buộc** (chỉ đọc, không đổi được kích thước, hoặc xoá được nhưng không chèn được), method không phù hợp sẽ **ném `UnsupportedOperationException`**. Sắp xếp này **không thoả đáng về mặt lý thuyết**; giải pháp tốt hơn là **interface riêng cho view chỉ đọc**, nhưng điều đó **làm số interface tăng gấp ba**. Sách khuyên **đừng mang kỹ thuật này vào thiết kế của mình**. Xem [[05 - Copies and Views#9.5.8. A Note on Optional Operations]].

## P

**PriorityQueue**
Collection **lấy element ra theo thứ tự đã sắp xếp** dù chúng được **chèn vào theo thứ tự tuỳ ý** — mỗi lần `remove` cho ra **element nhỏ nhất hiện có**. **Không sắp xếp toàn bộ element**: duyệt thì chúng **không nhất thiết đã sắp xếp**. Dùng data structure **heap**. Ứng dụng điển hình: **job scheduling** (vì **priority 1 theo truyền thống là "cao nhất"** nên `remove` cho ra element nhỏ nhất). Xem [[03 - Concrete Collections#9.3.6. Priority Queues]].

**Properties** (property map)
Map kiểu đặc biệt với **ba đặc điểm**: **key và value đều là string** · **lưu ra file và nạp lại rất dễ** · có **bảng phụ chứa giá trị mặc định**. Hữu ích để **chỉ định option cấu hình**. Vì lý do lịch sử nó implement `Map<Object, Object>`, nhưng **tốt nhất là bám vào `getProperty` và `setProperty`**. **Không có cấu trúc phân cấp** — cấu hình phức tạp thì **dùng class `Preferences`**. Xem [[07 - Legacy Collections#9.7.3. Property Maps]].

## Q

**Queue**
Interface quy định rằng bạn **thêm element ở đuôi**, **xoá ở đầu**, và **biết được queue có bao nhiêu element**. Dùng khi cần lấy lại object theo kiểu **"first in, first out"**. Hai implementation phổ biến dùng **circular array** và **linked list** — trong Java API là **`ArrayDeque`** và **`LinkedList`**. Cặp method `add`/`offer`, `remove`/`poll`, `element`/`peek` khác nhau ở chỗ **ném exception hay trả về `false`/`null`**. Xem [[01 - The Java Collections Framework#9.1.1. Separating Collection Interfaces and Implementation]] và [[03 - Concrete Collections#9.3.5. Queues and Deques]].

## R

**RandomAccess**
Interface mà một số list implement để báo rằng chúng **hỗ trợ random access hiệu quả**. `Collections.shuffle` **chép element ra array nếu list không implement nó**; `binarySearch` **quay về hiệu quả ngang linear search** trong trường hợp đó. Xem [[06 - Algorithms#9.6.2. Sorting and Shuffling]] và [[06 - Algorithms#9.6.3. Binary Search]].

**Rehash**
Việc **tạo một table có nhiều bucket hơn**, **chèn hết element vào table mới**, rồi **bỏ table cũ** — xảy ra khi hash table **quá đầy** so với **load factor**. Xem [[03 - Concrete Collections#Load factor và rehash]].

**Reversed View**
View do method **`reversed`** của `SequencedCollection`, `SequencedSet` và `SequencedMap` tạo ra, **nhìn các element (hoặc key) theo thứ tự ngược**. Xem [[05 - Copies and Views#9.5.5. Reversed Views]].

## S

**SequencedCollection** (Java 21)
Interface mà **`List` và `Set` cũng extend**, cung cấp **bộ method thống nhất để truy cập element đầu và cuối** của một collection: `getFirst`, `getLast`, `addFirst`, `addLast`, `removeFirst`, `removeLast` — **được chuyển từ `Deque` sang** ở Java 21. Xem [[02 - Interfaces in the Collections Framework#`SequencedCollection` (Java 21)]] và [[03 - Concrete Collections#9.3.5. Queues and Deques]].

**Set**
Collection các element **không trùng lặp**. Method `add` của set **trước hết tìm object cần thêm, và chỉ thêm nếu nó chưa có** — nên `add` **trả về `false`** khi object đã có sẵn. Set **không áp đặt thứ tự nào** lên element, vì thế **`Iterator` không có method `add`**. Xem [[02 - Interfaces in the Collections Framework#`Set`]] và [[03 - Concrete Collections#`HashSet`]].

**Shuffle**
Algorithm làm **điều ngược với sắp xếp**: **hoán vị ngẫu nhiên thứ tự các element trong một list**. Nếu list **không implement `RandomAccess`**, nó **chép element vào array, xáo trộn, rồi chép trở lại**. Xem [[06 - Algorithms#Shuffle]].

**Stable Sort**
Đặc tính của algorithm sắp xếp mà framework dùng: nó **không hoán đổi các element bằng nhau**. Nhờ vậy, sắp danh sách nhân viên **theo tên rồi theo lương** cho kết quả là danh sách **sắp theo lương trước, rồi theo tên**. Algorithm này **chậm hơn QuickSort một chút** nhưng **đổi lại tính ổn định**. Xem [[06 - Algorithms#9.6.2. Sorting and Shuffling]].

**Stack**
Class legacy có từ **bản 1.0** với method **`push`** và **`pop`**. Nó **extends `Vector`**, điều **không thoả đáng về mặt lý thuyết**: bạn áp dụng được cả những thao tác **chẳng-giống-stack** như `insert` và `remove` **ở bất kỳ đâu**, không riêng đỉnh stack. Xem [[07 - Legacy Collections#9.7.5. Stacks]].

**Subrange**
View vào **một khoảng của collection**: `subList(from, to)` cho list (**index đầu bao gồm, index sau loại trừ**), `subSet`/`headSet`/`tailSet` cho sorted set, `subMap`/`headMap`/`tailMap` cho sorted map. Với sorted set/map, **thứ tự sắp xếp chứ không phải vị trí element** xác định subrange. **Thao tác lên subrange tự động phản ánh lên toàn bộ collection.** Xem [[05 - Copies and Views#9.5.3. Subranges]].

**Synchronized View**
View do `Collections.synchronizedXxx` tạo ra để **làm collection thường trở nên thread-safe**. Các method của view **được `synchronized`** — **mỗi lời gọi method phải kết thúc hoàn toàn trước khi thread khác gọi được method khác**. Xem [[05 - Copies and Views#9.5.7. Synchronized Views]].

**System Property**
Property mô tả **thông tin hệ thống**, lấy bằng `System.getProperties` / `System.getProperty`. Ví dụ `"user.home"` là home directory, `"java.version"` là phiên bản Java (đổi định dạng ở **Java 9**, làm hỏng kha khá công cụ). Đặt bằng option `-D`; in hết bằng `java -XshowSettings:properties`. Xem [[07 - Legacy Collections#9.7.4. System Properties]].

## T

**toArray**
Method lấy array từ collection. `toArray()` trả về **array các `Object`** và **không cast được** sang array kiểu cụ thể. Thay vào đó **truyền một array constructor expression** như `staff.toArray(String[]::new)`. **Trước JDK 11** thì **truyền vào một array đúng kiểu** (`new String[0]`), và **nếu array đã đủ dài thì nó được tái sử dụng**. Xem [[06 - Algorithms#9.6.6. Converting between Collections and Arrays]].

**TreeMap**
Map trong đó **key được sắp xếp**; dùng **một thứ tự trên key** để tổ chức chúng trong một **search tree**. Xem [[04 - Maps#9.4.1. Basic Map Operations]].

**TreeSet**
Một **set đã sắp xếp**: bạn **chèn element theo thứ tự bất kỳ** nhưng khi duyệt thì **giá trị tự động hiện ra theo thứ tự đã sắp xếp**. Implementation hiện tại dùng **red-black tree**. Thêm element cần **trung bình log₂ n phép so sánh**. Element **phải implement `Comparable`** hoặc **phải cung cấp `Comparator`**. Trong test của sách, `TreeSet` **chậm gần 4 lần** so với `HashSet`. **Comparator phải tương thích với `equals`** — không thì **phép so bằng của set cho kết quả mâu thuẫn**. Xem [[03 - Concrete Collections#9.3.4. Tree Sets]].

## U

**Unmodifiable Copy**
Bản sao **không sửa được** tạo bằng `Set.copyOf` / `List.copyOf` / `Map.copyOf`. **Nếu collection gốc bị sửa, bản sao không bị ảnh hưởng.** Nếu collection gốc **vốn đã unmodifiable và đúng kiểu**, `copyOf` **trả về luôn chính nó**. Xem [[05 - Copies and Views#9.5.2. Unmodifiable Copies and Views]].

**Unmodifiable View**
View **thêm một phép kiểm tra lúc runtime** vào collection sẵn có; **mutator method ném `UnsupportedOperationException`**. Khác bản sao ở chỗ **nếu collection gốc thay đổi thì view phản ánh những thay đổi đó**. Nó **không làm bản thân collection trở nên immutable** — vẫn sửa được qua reference gốc. View **wrap interface chứ không phải object collection thật**, nên **chỉ truy cập được method định nghĩa trong interface**. Nên **ưu tiên `unmodifiableSet`/`unmodifiableList`** vì `equals` và `hashCode` của chúng **phù hợp với set và list**. Xem [[05 - Copies and Views#Unmodifiable view]].

## V

**Vector**
Collection dựa trên array có từ **Java 1.0**. **Mọi method của nó đều `synchronized`** — an toàn khi truy cập từ hai thread, nhưng **lãng phí nếu chỉ dùng một thread**. **Không có lý do gì để dùng `Vector` ngày nay** trừ khi phải làm việc với **một API cổ lỗ**. Xem [[03 - Concrete Collections#9.3.2. Array Lists]].

**View**
Object implement `Collection` hoặc `Map` mà **các method của nó thao tác lên collection/map gốc** — chứ **không tạo ra một collection mới**. Ví dụ đầu tiên là **`keySet`** của các map class. Ba view của map: **key set**, **collection các value** (không phải set), **entry set**. Từ key set và entry set thì **xoá được nhưng không thêm được element** (`UnsupportedOperationException`). Xem [[05 - Copies and Views#9.5. Copies and Views]] và [[04 - Maps#9.4.3. Map Views]].

## W

**WeakHashMap**
Map có **value có thể bị garbage collector thu hồi** nếu key **không còn được dùng ở đâu khác**. Nó **hợp tác với garbage collector** để xoá cặp key/value **khi reference duy nhất tới key là reference từ chính entry của hash table**. Cơ chế: nó **dùng weak reference để giữ key**; object **chỉ tới được qua một `WeakReference`** vẫn bị thu hồi, nhưng **weak reference dẫn tới nó bị đặt vào một queue** mà `WeakHashMap` **định kỳ kiểm tra**. Xem [[04 - Maps#9.4.4. Weak Hash Maps]].

---

## Ba nhóm method cập nhật map entry

> Vấn đề gốc: `counts.put(word, counts.get(word) + 1)` **hỏng ở lần đầu gặp key** — `get` trả về `null` và **xảy ra `NullPointerException`**.

| Cách | Method | Ghi chú |
|---|---|---|
| Mặc định khi tra | `getOrDefault(word, 0)` | coi **`null` là value hợp lệ** |
| Đặt trước nếu vắng | `putIfAbsent(word, 0)` | coi **`null` như key vắng mặt** |
| Kết hợp value | `merge(word, 1, Integer::sum)` | gắn `word` với `1` nếu chưa có, không thì **kết hợp value cũ với `1`** |
| Dựng value lười | `computeIfAbsent(term, k -> new TreeSet<>())` | **trả về value mới nên nối chuỗi được `.add(...)`** |

Xem [[04 - Maps#9.4.2. Updating Map Entries]].
