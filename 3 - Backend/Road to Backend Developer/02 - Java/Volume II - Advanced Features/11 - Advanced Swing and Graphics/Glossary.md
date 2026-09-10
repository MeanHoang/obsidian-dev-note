# Glossary — Advanced Swing and Graphics

> Thuật ngữ chương 11: Advanced Swing and Graphics. Định nghĩa lấy từ Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.

## A

**Affine Transformation**
Phép biến đổi biểu diễn được bằng ma trận dạng `[a c e / b d f / 0 0 1]`. Mọi rotation, translation, scaling, shear và tổ hợp của chúng đều là affine transformation. Class `AffineTransform` mô tả nó. Xem [[03 - Advanced AWT#11.3.6. Coordinate Transformations]].

**Alpha Channel**
Cách Java 2D API mô tả transparency: ngoài ba thành phần màu red/green/blue, mỗi pixel còn có **giá trị alpha giữa 0 (trong suốt hoàn toàn) và 1 (đục hoàn toàn)**. Xem [[03 - Advanced AWT#11.3.8. Transparency and Composition]].

**Area**
Class implement interface `Shape`, dựng shape phức tạp bằng **bốn phép constructive area geometry**: `add`, `subtract`, `intersect`, `exclusiveOr`. Xem [[03 - Advanced AWT#11.3.3. Areas]].

## B

**Banding**
Cách in trong đó máy in **in từng dải một**, đẩy giấy, rồi in dải kế tiếp — thường gặp ở máy in kim và máy in phun. Print job có thể dùng banding cả với máy in laser để **quản lý kích thước file spool**. Vì banding, print job **được phép gọi `print` nhiều lần cho cùng một trang** — nên **không được đếm trang trong method `print`**. Xem [[05 - Printing#11.5.1. Graphics Printing]].

**Book**
Class Java implement interface `Pageable`. Một book gồm **các section, mỗi section là một `Printable`**. Dùng book thì print job **biết chính xác số trang**, nên hộp thoại in hiển thị dải trang đúng. Cạm bẫy: print job truyền **số trang của cả book, không phải của từng section**. Xem [[05 - Printing#11.5.2. Multiple-Page Printing]].

**Bounding Rectangle**
Hình chữ nhật bao quanh một shape. `Rectangle2D`, `RoundRectangle2D`, `Ellipse2D`, `Arc2D` đều kế thừa superclass chung `RectangularShape` — ellipse và arc không phải hình chữ nhật nhưng **có bounding rectangle**. Xem [[03 - Advanced AWT#11.3.2.1. The Shape Class Hierarchy]].

## C

**Category** (của attribute)
Key kiểu `Class` của một attribute trong attribute set. Ví dụ thêm `new Copies(10)` vào set thì key là `Copies.class`. `Attribute` khai báo `Class getCategory()`. **Không bắt buộc category trùng với class của attribute.** Thêm attribute cùng category thì **ghi đè cái cũ**. Xem [[05 - Printing#11.5.5. Printing Attributes]].

**Cell Editor** (table)
Object cho phép sửa nội dung một cell. `DefaultCellEditor` dựng được bằng `JTextField`, `JCheckBox`, hoặc `JComboBox`. Custom editor: extend `AbstractCellEditor` + implement `TableCellEditor`, định nghĩa `getTableCellEditorComponent`, `shouldSelectCell`, `stopCellEditing`, `cancelCellEditing`, `getCellEditorValue`. Xem [[01 - Tables#11.1.4.4. Custom Editors]].

**Cell Renderer** (table)
Object implement `TableCellRenderer` — interface **một method** `getTableCellRendererComponent`, trả về một component mà `paint` của nó **lấp đầy vùng cell**. Gắn với một kiểu bằng `setDefaultRenderer(Class, renderer)`. Xem [[01 - Tables#11.1.4.1. Rendering Cells]].

**Clipping**
Đặt một clipping shape trong graphics context để **ràng buộc mọi thao tác vẽ vào phần trong shape đó**. Dùng `clip` (lấy giao với vùng clip hiện có), **không dùng `setClip`** vì nó thay thế vùng clip sẵn có — graphics context để in đã kèm clip rectangle ngăn vẽ lên lề. Xem [[03 - Advanced AWT#11.3.7. Clipping]].

**Color Model**
Thành phần của mọi image type, **dịch qua lại giữa mảng sample value và mô hình màu RGB chuẩn**. Lấy bằng `image.getColorModel()`. Xem [[04 - Raster Images#11.4.2.1. Constructing Raster Images]].

**Composition Rule**
Quy tắc mô tả cách **kết hợp pixel của shape mới với pixel đã có**. Java 2D API implement **12 quy tắc Porter–Duff**; mặc định là `SRC_OVER`. Đặt bằng `setComposite` với một `AlphaComposite`. Xem [[03 - Advanced AWT#11.3.8. Transparency and Composition]].

**Convolution**
Phép biến đổi image mạnh nhất (`ConvolveOp`). **Kernel** là ma trận cho biết **trọng số áp lên các giá trị láng giềng**. Kernel toàn `1/9` cho ảnh mờ; kernel `[0 −1 0 / −1 4 −1 / 0 −1 0]` thực hiện **edge detection**. Xem [[04 - Raster Images#11.4.2.2. Filtering Images]].

## D

**Dash Pattern**
Mảng `float[]` chứa **độ dài các khoảng "on" và "off"** của một stroke nét đứt. **Dash phase** cho biết mỗi đường bắt đầu ở đâu trong pattern (thường là 0). **End cap style áp cho đầu mút của từng nét gạch.** Xem [[03 - Advanced AWT#11.3.4. Strokes]].

**Device Coordinates**
Toạ độ tính bằng **pixel**. Coordinate transformation đổi user coordinate thành device coordinate. Xem [[03 - Advanced AWT#11.3.6. Coordinate Transformations]].

**Document Flavor**
Mô tả **tổ hợp của một data source và một data type** cho print service, ví dụ `DocFlavor.INPUT_STREAM.GIF`. Class `DocFlavor` định nghĩa inner class cho từng data source. Xem [[05 - Printing#11.5.3. Print Services]].

## E

**End Cap Style**
Kiểu đầu mút của một stroke dày hơn 1 pixel: **butt cap** (kết thúc ngay tại điểm cuối) · **round cap** (thêm nửa hình tròn) · **square cap** (thêm nửa hình vuông). Xem [[03 - Advanced AWT#11.3.4. Strokes]].

## F

**Filtering** (rows)
Việc `TableRowSorter` **giấu dòng có chọn lọc**. Bật bằng `setRowFilter`. Có sẵn `numberFilter`, `dateFilter`, `regexFilter`, và các phép kết hợp `andFilter`/`orFilter`/`notFilter`. Cơ chế này **không được thiết kế cho filter có tiêu chí thay đổi theo thời gian**. Xem [[01 - Tables#11.1.3.7. Filtering Rows]].

**Folder Icon**
Cách sách gọi chung **opened nonleaf icon** và **closed nonleaf icon** của một tree node. Loại icon thứ ba là **leaf icon**. Xem [[02 - Trees#11.2.1. Simple Trees]].

**Font Render Context**
Object cần thiết để dựng `TextLayout`, lấy bằng `g2.getFontRenderContext()`. Bố cục **phụ thuộc font render context** — **cùng ký tự sẽ trông khác trên màn hình và trên máy in**. Xem [[03 - Advanced AWT#11.3.7. Clipping]].

**Forest**
Một tập hợp nhiều cây, **mỗi cây có root node riêng**. Trong `JTree`, hiển thị forest bằng cách nối mọi cây vào một root chung rồi `setRootVisible(false)`. Xem [[02 - Trees#11.2. Trees]].

## G

**GeneralPath**
Class mô tả path tạo từ **đường thẳng, quadratic curve, cubic curve**. **Không có class `Polygon2D`** — dùng `GeneralPath` để mô tả đa giác. Xây bằng `moveTo`, `lineTo`, `quadTo`, `curveTo`, `closePath`, `append`. **Path không nhất thiết liền mạch.** Xem [[03 - Advanced AWT#11.3.2.2. Using the Shape Classes]].

**GradientPaint**
Class `Paint` **biến thiên màu bằng nội suy giữa hai giá trị màu**. Màu không đổi dọc các đường vuông góc với đường nối hai điểm. Với `cyclic = true` thì màu **lặp vòng vô hạn theo cả hai hướng**. Xem [[03 - Advanced AWT#11.3.5. Paint]].

## I

**Imageable Area**
Vùng của tờ giấy **thực sự in được**. `getImageableWidth`/`getImageableHeight` cho kích thước; **lề không nhất thiết đối xứng** nên còn cần `getImageableX`/`getImageableY` cho góc trên trái. Xem [[05 - Printing#11.5.1. Graphics Printing]].

**Interpolation**
Cần thiết trong `AffineTransformOp` để xác định pixel đích khi **pixel nguồn bị biến đổi rơi vào khoảng giữa các pixel đích**. Ba chiến lược: `TYPE_BICUBIC`, `TYPE_BILINEAR`, `TYPE_NEAREST_NEIGHBOR` — **bicubic chậm hơn một chút nhưng đẹp hơn**. Xem [[04 - Raster Images#11.4.2.2. Filtering Images]].

## J

**Join Style**
Kiểu nối khi hai stroke dày gặp nhau: **bevel join** (nối bằng đường vuông góc với phân giác) · **round join** (kéo dài mỗi stroke thành round cap) · **miter join** (kéo dài cả hai bằng một "gai"). Xem [[03 - Advanced AWT#11.3.4. Strokes]].

## K

**Kernel**
Ma trận trong một convolution **cho biết trọng số nào áp lên các giá trị láng giềng**. Dựng bằng `new Kernel(width, height, elements)`. Xem [[04 - Raster Images#11.4.2.2. Filtering Images]].

## L

**Leaf**
Node không có child node. `JTree` **không tự biết node nào là leaf — nó hỏi tree model**. Mặc định `isLeaf` của `DefaultMutableTreeNode` trả `true` khi node không có child; đổi tiêu chí bằng property **"allows children"** + `setAsksAllowsChildren(true)`. Xem [[02 - Trees#11.2.1. Simple Trees]].

**LookupOp**
Filter image cho phép chỉ định **ánh xạ tuỳ ý của sample value** qua một `LookupTable` (`ByteLookupTable` hoặc `ShortLookupTable`). Áp **riêng cho từng thành phần màu, không áp cho alpha**. **Không dùng được với indexed color model.** Xem [[04 - Raster Images#11.4.2.2. Filtering Images]].

## M

**Miter Limit**
**Tỉ số giữa khoảng cách của góc trong và góc ngoài của "gai" chia cho độ dày stroke.** Dưới ngưỡng đó, miter join **được render thành bevel join** để tránh gai dài quá mức. Mặc định **10**, ứng với góc khoảng **11 độ**. Xem [[03 - Advanced AWT#11.3.4. Strokes]].

## N

**Node**
Thành phần cấu tạo nên cây. Mỗi node hoặc là leaf hoặc có child node; mọi node **trừ root** có **đúng một** parent. Xem [[02 - Trees#11.2. Trees]].

**Node Enumeration**
Các convenience method của `DefaultMutableTreeNode` để lặp qua node: `breadthFirstEnumeration` (duyệt **theo từng lớp**) · `depthFirstEnumeration` = `postOrderEnumeration` (**ghé thăm child trước parent**) · `preOrderEnumeration` (**parent trước child**) · `pathFromAncestorEnumeration`. Xem [[02 - Trees#11.2.2. Node Enumeration]].

## P

**Page Format**
Object `PageFormat` chứa thông tin về trang in: khổ giấy (`getWidth`/`getHeight`, **đo bằng point**), vùng imageable, và orientation. Xem [[05 - Printing#11.5.1. Graphics Printing]].

**Point** (đơn vị in)
**1/72 inch** (1 inch = 25.4 mm). Đơn vị mặc định của **mọi print graphics context**; khổ giấy và lề cũng đo bằng point. A4 ≈ 595 × 842 point, US Letter = 612 × 792 point. Xem [[05 - Printing#11.5.1. Graphics Printing]].

**Porter–Duff Rules**
**12 quy tắc composition** do Porter và Duff xây dựng, coi alpha là **xác suất màu của pixel nên được dùng**. Java 2D API implement toàn bộ, nhưng sách nói **chỉ hai quy tắc có ý nghĩa thực tiễn**; nếu thấy rối thì **cứ dùng `SRC_OVER`** — mặc định của `Graphics2D` và cho kết quả trực quan nhất. Xem [[03 - Advanced AWT#11.3.8. Transparency and Composition]].

**Print Job Attributes** · **Print Request Attributes** · **Doc Attributes** · **Print Service Attributes**
Bốn nhóm attribute của print service API: request attribute cho **mọi doc trong một print job** · request attribute chỉ cho **một doc** · thông tin về **print service** · thông tin về **trạng thái một print job**. Xem [[05 - Printing#11.5.5. Printing Attributes]].

**Printable**
Interface **một method** `int print(Graphics g, PageFormat format, int page)`, được print engine gọi mỗi khi cần định dạng một trang. Trả `PAGE_EXISTS` thì print job **tiếp tục tạo trang**; trả `NO_SUCH_PAGE` thì **dừng**. **Số trang bắt đầu từ 0.** Xem [[05 - Printing#11.5.1. Graphics Printing]].

## R

**Raster**
"Lưới" dữ liệu màu của một image tạo từ pixel — đối lập với API "vector" của Java 2D. `WritableRaster` (lấy bằng `image.getRaster()`) dùng để **truy cập và sửa pixel**. Xem [[04 - Raster Images#11.4. Raster Images]].

**Rendering Pipeline**
Chuỗi bước tính toán shape khi gọi `draw`/`fill`: **stroke path → transform → clip (không giao thì dừng) → fill → compose với pixel đã có**. Các method `set...` **chỉ đặt state, không vẽ gì**. Xem [[03 - Advanced AWT#11.3.1. The Rendering Pipeline]].

**RescaleOp**
Filter image thực hiện `xnew = a · x + b` trên **từng thành phần màu** (**alpha không bị ảnh hưởng**). `a > 1` **làm sáng image lên**. Xem [[04 - Raster Images#11.4.2.2. Filtering Images]].

**Row Position**
Số thứ tự dòng (từ 0) của một node trong phần hiển thị cây — **cách thứ hai** `JTree` mô tả node. **Chỉ node đang hiển thị mới có row number**, và nó **thay đổi khi node trước đó được mở/thu gọn/sửa**. Sách khuyên **nên tránh dùng**; mọi method dùng row position đều có method tương đương dùng tree path. Xem [[02 - Trees#11.2.1.1. Editing Trees and Tree Paths]].

## S

**Sample Values**
Tên gọi trong Java 2D API cho **các giá trị mô tả một pixel** (ví dụ 4 giá trị red/green/blue/alpha với `TYPE_INT_ARGB`). **Luôn nằm giữa 0 và 255, bất kể kiểu mảng là `int[]`, `float[]` hay `double[]`.** Xem [[04 - Raster Images#11.4.2.1. Constructing Raster Images]].

**Shape**
Interface mà mọi class hình học của Java 2D implement: `Line2D`, `Rectangle2D`, `RoundRectangle2D`, `Ellipse2D`, `Arc2D`, `QuadCurve2D`, `CubicCurve2D`, `GeneralPath`, `Area`. Mỗi class tên kết thúc "2D" có **hai subclass `.Float` và `.Double`** — chúng cũng là **inner class**, chỉ là tiện lợi cú pháp để **tránh lạm phát tên outer class**. Xem [[03 - Advanced AWT#11.3.2. Shapes]].

**Shear**
Một trong bốn phép biến đổi cơ bản: **giữ nguyên một đường** và **"trượt" các đường song song với nó** một lượng **tỉ lệ với khoảng cách tới đường cố định**. Xem [[03 - Advanced AWT#11.3.6. Coordinate Transformations]].

**sRGB**
Chuẩn đề xuất đơn giản hơn ICC profile, chỉ định **ánh xạ chính xác giữa giá trị RGB và giá trị CIE XYZ 1931**, thiết kế để hoạt động tốt với màn hình màu thông thường. **Java 2D API dùng ánh xạ này** khi chuyển đổi giữa RGB và các không gian màu khác. Xem [[04 - Raster Images#11.4.2.1. Constructing Raster Images]].

**Stream Print Service**
Print service sinh ra dữ liệu in **gửi vào một stream** thay vì tới máy in — dùng để in trễ hoặc vì định dạng đọc được bởi chương trình khác. Java có sẵn stream print service sinh **output PostScript**, dùng được **kể cả khi không có máy in cục bộ**. Xem [[05 - Printing#11.5.4. Stream Print Services]].

**Stroke**
"Cây bút" vạch đường biên của shape. Mặc định là **đường liền rộng 1 pixel**. Java 2D API **chỉ định nghĩa một class implement `Stroke`**, là `BasicStroke`. Xem [[03 - Advanced AWT#11.3.4. Strokes]].

## T

**Table Model**
Nguồn data của `JTable` — **`JTable` không tự lưu data của nó**. Implement bằng cách extend `AbstractTableModel` và chỉ cung cấp **ba method**: `getRowCount`, `getColumnCount`, `getValueAt`. Xem [[01 - Tables#11.1.2. Table Models]].

**TexturePaint**
Class `Paint` **tô một area bằng các bản lặp lại của một image**. Anchor rectangle **mở rộng vô hạn theo x và y để lát kín mặt phẳng toạ độ**; image được **co giãn cho vừa anchor** rồi nhân bản vào từng ô. Xem [[03 - Advanced AWT#11.3.5. Paint]].

**Thumbnail**
**Phiên bản nhỏ hơn của một image** dùng để xem trước, chứa trong một số file image. Lấy bằng `getNumThumbnails` và `readThumbnail`. Xem [[04 - Raster Images#11.4.1.2. Reading and Writing Files with Multiple Images]].

**Tree Model**
Nguồn data của `JTree`. `DefaultTreeModel` do Swing cung cấp có **lợi thế lớn là tự động thông báo** cho view khi model đổi; tree model tự viết thì **phải tự implement việc thông báo**. Interface `TreeModel` chỉ cần ba method mô tả cấu trúc (`getRoot`, `getChildCount`, `getChild`) nếu **không hỗ trợ sửa**. Xem [[02 - Trees#11.2.5. Custom Tree Models]].

**Tree Path**
Cách `JTree` định danh node: **một dãy reference kiểu `Object`** (không phải `TreeNode`) bắt đầu từ root. `JTree` **không biết gì về interface `TreeNode`** — việc nối node là nhiệm vụ của tree model — nên nó **luôn phải làm việc với đường đi đầy đủ**. Lấy node cuối bằng `getLastPathComponent`. Xem [[02 - Trees#11.2.1.1. Editing Trees and Tree Paths]].

## U

**User Coordinates**
Toạ độ theo **đơn vị do người dùng chỉ định**. Coordinate transformation đổi chúng thành device coordinate (pixel), để bạn **làm việc với giá trị toạ độ thuận tiện** còn graphics context **lo phần việc bẩn thỉu**. Xem [[03 - Advanced AWT#11.3.6. Coordinate Transformations]].

**User Object**
Object mà một `DefaultMutableTreeNode` **giữ bên trong**. Cây **render user object** cho mọi node; không chỉ định renderer thì hiển thị chuỗi do `toString` trả về. **Cạm bẫy:** parameter `value` của `getTreeCellRendererComponent` là **object node, không phải user object**. Xem [[02 - Trees#11.2.1. Simple Trees]].
