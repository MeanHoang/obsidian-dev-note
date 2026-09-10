# 03 — Advanced AWT

> Chapter 11, Section 11.3 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.3. Advanced AWT

> *"You can use the methods of the Graphics class to create simple drawings. Those methods are sufficient for simple applications, but they fall short when you need to create complex shapes or require complete control over the appearance of the graphics. The Java 2D API is a more sophisticated class library that you can use to produce high-quality drawings. In the following sections, we will give you an overview of that API."*

**Dịch:** Các method của class `Graphics` đủ cho ứng dụng đơn giản, nhưng **không đủ** khi bạn cần tạo shape phức tạp hoặc muốn **kiểm soát hoàn toàn** diện mạo đồ hoạ. **Java 2D API** là thư viện class tinh vi hơn, dùng để tạo bản vẽ chất lượng cao.

---

## 11.3.1. The Rendering Pipeline

> *"The original JDK 1.0 had a very simple mechanism for drawing shapes. You selected color and paint mode, and called methods of the Graphics class such as drawRect or fillOval. The Java 2D API supports many more options."*
>
> *"• You can easily produce a wide variety of shapes."*
> *"• You have control over the stroke—the pen that traces shape boundaries."*
> *"• You can fill shapes with solid colors, varying hues, and repeating patterns."*
> *"• You can use transformations to move, scale, rotate, or stretch shapes."*
> *"• You can clip shapes to restrict them to arbitrary areas."*
> *"• You can select composition rules to describe how to combine the pixels of a new shape with existing pixels."*

**Dịch:** JDK 1.0 nguyên bản có cơ chế vẽ shape rất đơn giản: chọn màu và paint mode, rồi gọi method của class `Graphics` như `drawRect` hay `fillOval`. Java 2D API hỗ trợ **nhiều lựa chọn hơn hẳn**:

| Khả năng |
|---|
| Tạo được **đủ loại shape** một cách dễ dàng |
| Kiểm soát được **stroke** — cây bút vạch ra đường biên của shape |
| Tô shape bằng **màu đặc, sắc độ biến thiên, và hoa văn lặp lại** |
| Dùng **transformation** để di chuyển, co giãn, xoay, kéo giãn shape |
| **Clip** shape để giới hạn chúng trong các vùng tuỳ ý |
| Chọn **composition rule** mô tả cách kết hợp pixel của shape mới với pixel đã có |

### Chín bước để vẽ một shape

> *"To draw a shape, go through the following steps:"*

> *"1. Obtain an object of the Graphics2D class. This class is a subclass of the Graphics class. Ever since Java SE 1.2, methods such as paint and paintComponent automatically receive an object of the Graphics2D class. Simply use a cast, as follows:"*

```java
public void paintComponent(Graphics g)
{
    var g2 = (Graphics2D) g;
    . . .
}
```

**Dịch:** **Bước 1** — Lấy một object của class `Graphics2D` (subclass của `Graphics`). Từ Java SE 1.2, các method như `paint` và `paintComponent` **tự động nhận** một object `Graphics2D`; chỉ cần **cast**.

> *"2. Use the setRenderingHints method to set rendering hints—trade-offs between speed and drawing quality."*

```java
RenderingHints hints = . . .;
g2.setRenderingHints(hints);
```

**Dịch:** **Bước 2** — Đặt **rendering hint**: các đánh đổi giữa **tốc độ và chất lượng vẽ**.

> *"3. Use the setStroke method to set the stroke. The stroke draws the outline of the shape. You can select the thickness and choose among solid and dotted lines."*

```java
Stroke stroke = . . .;
g2.setStroke(stroke);
```

**Dịch:** **Bước 3** — Đặt **stroke**. Stroke **vẽ đường viền của shape**; chọn được độ dày và chọn giữa nét liền / nét chấm.

> *"4. Use the setPaint method to set the paint. The paint fills areas such as the stroke or the interior of a shape. You can create solid color paint, paint with changing hues, or tiled fill patterns."*

```java
Paint paint = . . .;
g2.setPaint(paint);
```

**Dịch:** **Bước 4** — Đặt **paint**. Paint **tô các vùng** như bản thân stroke hoặc phần trong của shape.

> *"5. Use the clip method to set the clipping region."*

```java
Shape clip = . . .;
g2.clip(clip);
```

**Dịch:** **Bước 5** — Đặt **vùng clipping**.

> *"6. Use the transform method to set a transformation from user space to device space. Use transformations if it is easier for you to define your shapes in a custom coordinate system than by using pixel coordinates."*

```java
AffineTransform transform = . . .;
g2.transform(transform);
```

**Dịch:** **Bước 6** — Đặt một **transform** từ **user space sang device space**. Dùng transform nếu định nghĩa shape trong **hệ toạ độ riêng** dễ hơn dùng toạ độ pixel.

> *"7. Use the setComposite method to set a composition rule that describes how to combine the new pixels with the existing pixels."*

```java
Composite composite = . . .;
g2.setComposite(composite);
```

**Dịch:** **Bước 7** — Đặt một **composition rule** mô tả cách kết hợp pixel mới với pixel đã có.

> *"8. Create a shape. The Java 2D API supplies many shape objects and methods to combine shapes."*

```java
Shape shape = . . .;
```

> *"9. Draw or fill the shape. If you draw the shape, its outline is stroked. If you fill the shape, the interior is painted."*

```java
g2.draw(shape);
g2.fill(shape);
```

**Dịch:** **Bước 8** — Tạo một shape. **Bước 9** — **`draw`** thì đường viền của nó được stroke; **`fill`** thì phần trong được tô.

> *"Of course, in many practical circumstances, you don't need all these steps. There are reasonable defaults for the settings of the 2D graphics context; change the settings only if you want to deviate from the defaults."*

**Dịch:** Trong nhiều tình huống thực tế bạn **không cần đủ mọi bước**. 2D graphics context đã có **mặc định hợp lý**; chỉ đổi khi muốn khác mặc định.

### Rendering pipeline

> *"The various set methods simply set the state of the 2D graphics context. They don't cause any drawing. Similarly, when you construct Shape objects, no drawing takes place. A shape is only rendered when you call draw or fill. At that time, the new shape is computed in a rendering pipeline (see Figure 11.31)."*

**Dịch:** Các method `set...` **chỉ đặt state** của 2D graphics context, **không gây ra việc vẽ nào**. Tương tự, dựng object `Shape` cũng **không vẽ gì**. Shape **chỉ được render khi bạn gọi `draw` hoặc `fill`**. Khi đó, shape mới được tính toán trong một **rendering pipeline**.

> *"In the rendering pipeline, the following steps take place to render a shape:"*
>
> *"1. The path of the shape is stroked."*
> *"2. The shape is transformed."*
> *"3. The shape is clipped. If there is no intersection between the shape and the clipping area, the process stops."*
> *"4. The remainder of the shape after clipping is filled."*
> *"5. The pixels of the filled shape are composed with the existing pixels."*

**Dịch:**

```
        shape
          │
   1. STROKE      ← path của shape được stroke
          │
   2. TRANSFORM   ← shape được biến đổi
          │
   3. CLIP        ← nếu shape KHÔNG giao với vùng clip → dừng hẳn
          │
   4. FILL        ← phần shape còn lại sau clip được tô
          │
   5. COMPOSE     ← pixel của shape đã tô được ghép với pixel đã có
          │
      màn hình
```

### API — `java.awt.Graphics2D` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void draw(Shape s)` | vẽ **đường viền** của shape đã cho bằng paint hiện tại |
| `void fill(Shape s)` | tô **phần trong** của shape đã cho bằng paint hiện tại |

---

## 11.3.2. Shapes

> *"Here are some of the methods in the Graphics class to draw shapes:"*

```
drawLine      drawRectangle   drawRoundRect   draw3DRect
drawPolygon   drawPolyline    drawOval        drawArc
```

> *"There are also corresponding fill methods. These methods have been in the Graphics class ever since JDK 1.0. The Java 2D API uses a completely different, object-oriented approach. Instead of methods, there are classes:"*

```
Line2D        Rectangle2D    RoundRectangle2D   Ellipse2D
Arc2D         QuadCurve2D    CubicCurve2D       GeneralPath
```

> *"These classes all implement the Shape interface, which we will examine in the following sections."*

**Dịch:** Các method trên đã có trong class `Graphics` từ **JDK 1.0**. Java 2D API dùng cách tiếp cận **hoàn toàn khác, hướng object**: thay vì method thì có **class**. Các class này **đều implement interface `Shape`**.

### 11.3.2.1. The Shape Class Hierarchy

> *"The Line2D, Rectangle2D, RoundRectangle2D, Ellipse2D, and Arc2D classes correspond to the drawLine, drawRectangle, drawRoundRect, drawOval, and drawArc methods. (The concept of a "3D rectangle" has died the death it so richly deserved—there is no analog to the draw3DRect method.) The Java 2D API supplies two additional classes, quadratic and cubic curves, that we will discuss in this section. There is no Polygon2D class; instead, the GeneralPath class describes paths made up from lines, quadratic and cubic curves. You can use a GeneralPath to describe a polygon."*

**Dịch:** Các class trên tương ứng với các method cũ. (Khái niệm "3D rectangle" đã **chết cái chết mà nó rất xứng đáng** — **không có** class tương ứng với `draw3DRect`.) Java 2D API bổ sung hai class nữa: **quadratic curve và cubic curve**. **Không có class `Polygon2D`**; thay vào đó class `GeneralPath` mô tả các path tạo từ đường thẳng, quadratic curve và cubic curve — dùng `GeneralPath` để mô tả một đa giác.

> *"To draw a shape, first create an object of a class that implements the Shape interface and then call the draw method of the Graphics2D class."*

> *"The classes Rectangle2D, RoundRectangle2D, Ellipse2D, Arc2D all inherit from a common superclass RectangularShape. Admittedly, ellipses and arcs are not rectangular, but they have a bounding rectangle (see Figure 11.32)."*

**Dịch:** `Rectangle2D`, `RoundRectangle2D`, `Ellipse2D`, `Arc2D` **đều kế thừa từ một superclass chung là `RectangularShape`**. Đúng là ellipse và arc không phải hình chữ nhật, nhưng chúng **có một bounding rectangle**.

> *"Each of the classes with a name ending in "2D" has two subclasses for specifying coordinates as float or double quantities. In Volume I, you already encountered Rectangle2D.Float and Rectangle2D.Double. The same scheme is used for the other classes, such as Arc2D.Float and Arc2D.Double."*

**Dịch:** Mỗi class có tên kết thúc bằng **"2D"** đều có **hai subclass** để chỉ định toạ độ dạng `float` hoặc `double`.

> *"Internally, all graphics classes use float coordinates because float numbers use less storage space but have sufficient precision for geometric computations. However, the Java programming language makes it a bit more tedious to manipulate float numbers. For that reason, most methods of the graphics classes use double parameters and return values. Only when constructing a 2D object you need to choose between the constructors with float and double coordinates."*

```java
var floatRect = new Rectangle2D.Float(5F, 10F, 7.5F, 15F);
var doubleRect = new Rectangle2D.Double(5, 10, 7.5, 15);
```

**Dịch:** Bên trong, mọi graphics class **dùng toạ độ `float`** vì số `float` **tốn ít bộ nhớ hơn** nhưng **đủ độ chính xác** cho tính toán hình học. Tuy nhiên ngôn ngữ Java khiến việc thao tác số `float` **hơi lích kích**, nên **hầu hết method của graphics class dùng parameter và giá trị trả về kiểu `double`**. **Chỉ khi dựng một object 2D** bạn mới phải chọn giữa constructor toạ độ `float` và `double`.

> *"The Xxx2D.Float and Xxx2D.Double classes are subclasses of the Xxx2D classes. After object construction, essentially no benefit accrues from remembering the subclass, and you can just store the constructed object in a superclass variable as in the code example above."*

> *"As you can see from the curious names, the Xxx2D.Float and Xxx2D.Double classes are also inner classes of the Xxx2D classes. That is just a minor syntactical convenience to avoid inflation of outer class names."*

**Dịch:** Sau khi dựng object, **hầu như không lợi gì từ việc nhớ subclass** — cứ lưu object vừa dựng vào **biến kiểu superclass**. Như thấy qua cái tên kỳ lạ, `Xxx2D.Float` và `Xxx2D.Double` **cũng là inner class** của các class `Xxx2D`. Đó chỉ là **tiện lợi cú pháp nho nhỏ** để tránh **lạm phát tên outer class**. (Về inner class, xem [[03 - Inner Classes]].)

> *"Finally, the Point2D class describes a point with an x and a y coordinate. Points are used to define shapes, but they aren't themselves shapes."*

**Dịch:** Class `Point2D` mô tả một điểm với toạ độ x và y. Điểm **được dùng để định nghĩa shape, nhưng bản thân chúng không phải shape**.

### 11.3.2.2. Using the Shape Classes

> *"For the RoundRectangle2D shape, specify the top left corner, width, height, and the x and y dimensions of the corner area that should be rounded (see Figure 11.34). For example, the call"*

```java
var r = new RoundRectangle2D.Double(150, 200, 100, 50, 20, 20);
```

> *"produces a rounded rectangle with circles of radius 20 at each of the corners."*

**Dịch:** Với `RoundRectangle2D`, chỉ định **góc trên trái, width, height, và kích thước x/y của vùng góc cần bo tròn**.

> *"To construct an arc, specify the bounding box, the start angle, the angle swept out by the arc (see Figure 11.35), and the closure type—one of Arc2D.OPEN, Arc2D.PIE, or Arc2D.CHORD."*

```java
var a = new Arc2D(x, y, width, height, startAngle, arcAngle, closureType);
```

**Dịch:** Dựng arc: chỉ định **bounding box**, **start angle**, **góc mà arc quét qua**, và **closure type** — một trong `Arc2D.OPEN`, `Arc2D.PIE`, `Arc2D.CHORD`.

> **Caution (sách):** *"If the arc is elliptical, the computation of the arc angles is not at all straightforward. The API documentation states: "The angles are specified relative to the nonsquare framing rectangle such that 45 degrees always falls on the line from the center of the ellipse to the upper right corner of the framing rectangle. As a result, if the framing rectangle is noticeably longer along one axis than the other, the angles to the start and end of the arc segment will be skewed farther along the longer axis of the frame." Unfortunately, the documentation is silent on how to compute this "skew." Here are the details:"*
>
> *"Suppose the center of the arc is the origin and the point (x, y) lies on the arc. You can get a skewed angle with the following formula:"*
>
> ```java
> skewedAngle = Math.toDegrees(Math.atan2(-y * height, x * width));
> ```
>
> *"The result is a value between -180 and 180. Compute the skewed start and end angles in this way. Then, compute the difference between the two skewed angles. If the start angle or the difference is negative, add 360 to the start angle. Then, supply the start angle and the difference to the arc constructor."*
>
> **Dịch:** Nếu arc là **elip**, việc tính góc arc **hoàn toàn không đơn giản**. Tài liệu API nói: góc được chỉ định **tương đối với framing rectangle không vuông**, sao cho **45 độ luôn rơi vào đường nối tâm elip với góc trên phải của framing rectangle**. Hệ quả: nếu framing rectangle **dài hơn hẳn theo một trục**, góc tới điểm đầu và cuối của đoạn arc **bị lệch xa hơn về phía trục dài**. Đáng tiếc, tài liệu **không nói cách tính độ "lệch" này**. Cách tính: giả sử tâm arc là gốc toạ độ và điểm (x, y) nằm trên arc, dùng công thức trên; kết quả nằm giữa **-180 và 180**. Tính góc lệch cho **cả điểm đầu và điểm cuối**, rồi tính **hiệu hai góc lệch**. Nếu **start angle hoặc hiệu là số âm** thì **cộng 360 vào start angle**. Sau đó đưa start angle và hiệu vào constructor của arc.

### Quadratic và cubic curve

> *"The Java 2D API supports quadratic and cubic curves. In this chapter, we do not get into the mathematics of these curves. We suggest you get a feel for how the curves look by running the program in Listing 11.15. As you can see in Figures 11.37 and 11.38, quadratic and cubic curves are specified by two end points and one or two control points. Moving the control points changes the shape of the curves."*

**Dịch:** Sách **không đi vào toán học** của các curve này. Quadratic và cubic curve được chỉ định bởi **hai điểm đầu cuối** và **một hoặc hai control point**. **Di chuyển control point làm đổi hình dạng curve.**

> *"To construct quadratic and cubic curves, give the coordinates of the end points and the control points."*

```java
var q = new QuadCurve2D.Double(startX, startY, controlX, controlY, endX, endY);
var c = new CubicCurve2D.Double(startX, startY, control1X, control1Y,
    control2X, control2Y, endX, endY);
```

> *"Quadratic curves are not very flexible, and they are not commonly used in practice. Cubic curves (such as the Bézier curves drawn by the CubicCurve2D class) are, however, very common. By combining many cubic curves so that the slopes at the connection points match, you can create complex, smooth-looking curved shapes."*

**Dịch:** **Quadratic curve không linh hoạt lắm** và **ít dùng trong thực tế**. Ngược lại, **cubic curve** (như đường Bézier mà class `CubicCurve2D` vẽ) **rất phổ biến**. Bằng cách ghép nhiều cubic curve sao cho **độ dốc tại điểm nối khớp nhau**, bạn tạo được các shape cong phức tạp, **trông mượt mà**.

### GeneralPath

> *"You can build arbitrary sequences of line segments, quadratic curves, and cubic curves, and store them in a GeneralPath object. Specify the first coordinate of the path with the moveTo method, for example:"*

```java
var path = new GeneralPath();
path.moveTo(10, 20);
```

> *"You can then extend the path by calling one of the methods lineTo, quadTo, or curveTo. These methods extend the path by a line, a quadratic curve, or a cubic curve. To call lineTo, supply the end point. For the two curve methods, supply the control points, then the end point."*

```java
path.lineTo(20, 30);
path.curveTo(control1X, control1Y, control2X, control2Y, endX, endY);
```

> *"Close the path by calling the closePath method. It draws a straight line back to the starting point of the path."*

**Dịch:** Đóng path bằng `closePath` — nó **vẽ một đường thẳng quay về điểm bắt đầu** của path.

> *"To make a polygon, simply call moveTo to go to the first corner point, followed by repeated calls to lineTo to visit the other corner points. Finally, call closePath to close the polygon."*

> *"A general path does not have to be connected. You can call moveTo at any time to start a new path segment."*

**Dịch:** Làm đa giác: `moveTo` tới điểm góc đầu tiên, rồi **gọi `lineTo` lặp lại** để đi qua các điểm góc khác, cuối cùng `closePath`. Một general path **không nhất thiết phải liền mạch** — gọi `moveTo` **bất kỳ lúc nào** để bắt đầu một segment path mới.

> *"Finally, you can use the append method to add arbitrary Shape objects to a general path. The outline of the shape is added to the end to the path. The second parameter of the append method is true if the new shape should be connected to the last point on the path, false otherwise."*

```java
Rectangle2D r = . . .;
path.append(r, false);
```

> *"appends the outline of a rectangle to the path without connecting it to the existing path. But"*

```java
path.append(r, true);
```

> *"adds a straight line from the end point of the path to the starting point of the rectangle, and then adds the rectangle outline to the path."*

**Dịch:** `append` thêm **object `Shape` bất kỳ** vào general path; **đường viền của shape được thêm vào cuối path**. Parameter thứ hai là `true` nếu shape mới **cần nối** với điểm cuối của path.

### Chương trình `ShapeTest` (Listing 11.15)

> *"The program in Listing 11.15 lets you create sample paths. You can pick a shape maker from the combo box. The program contains shape makers for"*
>
> *"• Straight lines"*
> *"• Rectangles, rounded rectangles, and ellipses"*
> *"• Arcs (showing lines for the bounding rectangle and the start and end angles, in addition to the arc itself)"*
> *"• Polygons (using a GeneralPath)"*
> *"• Quadratic and cubic curves"*
>
> *"Use the mouse to adjust the control points. As you move them, the shape continuously repaints itself."*

**Dịch:** Chương trình cho phép chọn một **shape maker** từ combo box, gồm: đường thẳng · hình chữ nhật, hình chữ nhật bo góc, ellipse · arc (vẽ kèm đường của bounding rectangle và các góc đầu/cuối) · đa giác (dùng `GeneralPath`) · quadratic và cubic curve. Dùng chuột để chỉnh control point; shape **liên tục tự vẽ lại**.

> *"An abstract superclass ShapeMaker encapsulates the commonality of the shape maker classes. Each shape has a fixed number of control points that the user can move around. The getPointCount method returns that value. The abstract method"*

```java
Shape makeShape(Point2D[] points)
```

> *"computes the actual shape, given the current positions of the control points. The toString method returns the class name so that the ShapeMaker objects can simply be dumped into a JComboBox."*

**Dịch:** Một abstract superclass `ShapeMaker` **gói phần chung** của các class shape maker. Mỗi shape có **số control point cố định** mà người dùng di chuyển được; `getPointCount` trả về giá trị đó. Abstract method `makeShape` **tính ra shape thật** từ vị trí hiện tại của các control point. `toString` trả về **tên class** để object `ShapeMaker` **đổ thẳng được vào một `JComboBox`**.

> *"To enable dragging of the control points, the ShapePanel class handles both mouse and mouse motion events. If the mouse is pressed on top of a rectangle, subsequent mouse drags move the rectangle."*

> *"The majority of the shape maker classes are simple—their makeShape methods just construct and return the requested shapes. However, the ArcMaker class needs to compute the distorted start and end angles. Furthermore, to demonstrate that the computation is indeed correct, the returned shape is a GeneralPath containing the arc itself, the bounding rectangle, and the lines from the center of the arc to the angle control points."*

**Dịch:** Phần lớn class shape maker **đơn giản** — `makeShape` chỉ dựng và trả về shape được yêu cầu. Riêng class `ArcMaker` phải **tính các góc đầu/cuối bị bóp méo**. Hơn nữa, để chứng minh tính toán đó đúng, shape trả về là một **`GeneralPath`** chứa **bản thân arc, bounding rectangle, và các đường từ tâm arc tới các control point góc**.

### API — các class shape

| Constructor / Method | Công dụng (theo sách) |
|---|---|
| `RoundRectangle2D.Double(double x, double y, double width, double height, double arcWidth, double arcHeight)` *(1.2)* | dựng hình chữ nhật bo góc với bounding rectangle và kích thước cung đã cho |
| `Arc2D.Double(double x, double y, double w, double h, double startAngle, double arcAngle, int type)` *(1.2)* | dựng một arc với bounding rectangle, start angle và arc angle, cùng arc type đã cho. `type` là một trong `Arc2D.OPEN`, `Arc2D.PIE`, `Arc2D.CHORD` |
| `QuadCurve2D.Double(double x1, double y1, double ctrlx, double ctrly, double x2, double y2)` *(1.2)* | dựng một quadratic curve từ **điểm đầu, một control point, điểm cuối** |
| `CubicCurve2D.Double(double x1, double y1, double ctrlx1, double ctrly1, double ctrlx2, double ctrly2, double x2, double y2)` *(1.2)* | dựng một cubic curve từ **điểm đầu, hai control point, điểm cuối** |
| `GeneralPath()` *(1.2)* | dựng một general path rỗng |

### API — `java.awt.geom.Path2D.Float` 6

| Method | Công dụng (theo sách) |
|---|---|
| `void moveTo(float x, float y)` | biến `(x, y)` thành **điểm hiện tại** — tức điểm bắt đầu của segment kế tiếp |
| `void lineTo(float x, float y)` · `void quadTo(float ctrlx, float ctrly, float x, float y)` · `void curveTo(float ctrl1x, float ctrl1y, float ctrl2x, float ctrl2y, float x, float y)` | vẽ một đường thẳng, quadratic curve, hoặc cubic curve **từ điểm hiện tại tới điểm cuối `(x, y)`**, và **biến điểm cuối đó thành điểm hiện tại** |

### API — `java.awt.geom.Path2D` 6

| Method | Công dụng (theo sách) |
|---|---|
| `void append(Shape s, boolean connect)` | thêm đường viền của shape đã cho vào general path. Nếu `connect` là `true`, điểm hiện tại của general path được **nối với điểm bắt đầu của shape mới thêm bằng một đường thẳng** |
| `void closePath()` | đóng path bằng cách vẽ một đường thẳng từ điểm hiện tại tới điểm đầu tiên trong path |

---

## 11.3.3. Areas

> *"In the preceding section, you saw how you can specify complex shapes by constructing general paths composed of lines and curves. By using a sufficient number of lines and curves, you can draw essentially any shape. For example, the shapes of characters in the fonts that you see on the screen and on your printouts are made up of lines and quadratic or cubic curves."*

**Dịch:** Dùng **đủ nhiều** đường thẳng và curve thì vẽ được **về cơ bản là mọi shape**. Ví dụ, hình dạng của các ký tự trong font bạn thấy trên màn hình và trên bản in **đều được tạo từ đường thẳng và quadratic/cubic curve**.

> *"Occasionally, it is easier to describe a shape by composing it from areas, such as rectangles, polygons, or ellipses. The Java 2D API supports four constructive area geometry operations that combine two areas into a new area."*
>
> *"• add: The combined area contains all points that are in the first or the second area."*
> *"• subtract: The combined area contains all points that are in the first but not the second area."*
> *"• intersect: The combined area contains all points that are in the first and the second area."*
> *"• exclusiveOr: The combined area contains all points that are in either the first or the second area, but not in both."*

**Dịch:** Đôi khi **dễ hơn** khi mô tả shape bằng cách **ghép nó từ các area** như hình chữ nhật, đa giác, ellipse. Java 2D API hỗ trợ **bốn phép constructive area geometry**:

| Phép | Area kết quả chứa mọi điểm… |
|---|---|
| `add` | ở trong area **thứ nhất HOẶC** area thứ hai |
| `subtract` | ở trong area thứ nhất **NHƯNG KHÔNG** ở trong area thứ hai |
| `intersect` | ở trong area **thứ nhất VÀ** area thứ hai |
| `exclusiveOr` | ở trong **một trong hai** area, **nhưng không ở trong cả hai** |

> *"To construct a complex area, start with a default area object."*

```java
var a = new Area();
```

> *"Then, combine the area with any shape."*

```java
a.add(new Rectangle2D.Double(. . .));
a.subtract(path);
. . .
```

> *"The Area class implements the Shape interface. You can stroke the boundary of the area with the draw method or paint the interior with the fill method of the Graphics2D class."*

**Dịch:** Class `Area` **implement interface `Shape`**, nên **stroke được đường biên** bằng `draw` hoặc **tô phần trong** bằng `fill` của class `Graphics2D`.

### API — `java.awt.geom.Area`

| Method | Công dụng (theo sách) |
|---|---|
| `void add(Area other)` · `void subtract(Area other)` · `void intersect(Area other)` · `void exclusiveOr(Area other)` | thực hiện phép constructive area geometry giữa area này và area kia, **rồi đặt area này bằng kết quả** |

---

## 11.3.4. Strokes

> *"The draw operation of the Graphics2D class draws the boundary of a shape by using the currently selected stroke. By default, the stroke is a solid line that is 1 pixel wide. You can select a different stroke by calling the setStroke method and supplying an object of a class that implements the Stroke interface. The Java 2D API defines only one such class, called BasicStroke."*

**Dịch:** Mặc định stroke là **đường liền, rộng 1 pixel**. Chọn stroke khác bằng `setStroke` với một object của class implement interface `Stroke`. Java 2D API **chỉ định nghĩa một class như vậy**, tên là **`BasicStroke`**.

> *"You can construct strokes of arbitrary thickness. For example, here is how to draw lines that are 10 pixels wide:"*

```java
g2.setStroke(new BasicStroke(10.0F));
g2.draw(new Line2D.Double(. . .));
```

### End cap style

> *"When a stroke is more than a pixel thick, the end of the stroke can have different styles. Figure 11.41 shows these so-called end cap styles. You have three choices:"*
>
> *"• A butt cap simply ends the stroke at its end point."*
> *"• A round cap adds a half-circle to the end of the stroke."*
> *"• A square cap adds a half-square to the end of the stroke."*

**Dịch:** Khi stroke **dày hơn một pixel**, đầu mút của stroke có nhiều kiểu — gọi là **end cap style**:

| Style | Ý nghĩa |
|---|---|
| **butt cap** | **kết thúc stroke ngay tại điểm cuối** |
| **round cap** | thêm một **nửa hình tròn** vào đầu mút stroke |
| **square cap** | thêm một **nửa hình vuông** vào đầu mút stroke |

### Join style

> *"When two thick strokes meet, there are three choices for the join style (see Figure 11.42)."*
>
> *"• A bevel join joins the strokes with a straight line that is perpendicular to the bisector of the angle between the two strokes."*
> *"• A round join extends each stroke to have a round cap."*
> *"• A miter join extends both strokes by adding a "spike.""*

**Dịch:** Khi hai stroke dày gặp nhau, có ba kiểu **join style**:

| Style | Ý nghĩa |
|---|---|
| **bevel join** | nối hai stroke bằng một **đường thẳng vuông góc với đường phân giác** của góc giữa hai stroke |
| **round join** | kéo dài mỗi stroke để có một **round cap** |
| **miter join** | kéo dài **cả hai stroke** bằng cách thêm một **"cái gai" (spike)** |

> *"If two lines come together in a miter join at a very small angle, a bevel join is used instead, preventing extremely long spikes. The miter limit controls this transition. Technically, this is the ratio of the distance of the inner and outer corners of the spike divided by the stroke width. The default miter limit of 10 corresponds to an angle of about 11 degrees."*

**Dịch:** Nếu hai đường gặp nhau ở **miter join với góc rất nhỏ** thì **bevel join được dùng thay thế**, ngăn các gai dài quá mức. **Miter limit** kiểm soát ngưỡng chuyển đổi này. Về mặt kỹ thuật, đó là **tỉ số giữa khoảng cách của góc trong và góc ngoài của gai chia cho độ dày stroke**. Miter limit mặc định là **10**, ứng với góc **khoảng 11 độ**.

> *"You can specify these choices in the BasicStroke constructor, for example:"*

```java
g2.setStroke(new BasicStroke(10.0F, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
g2.setStroke(new BasicStroke(10.0F, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER,
    15.0F /* miter limit */));
```

### Dash pattern

> *"Finally, you can create dashed lines by setting a dash pattern. In the program in Listing 11.16, you can select a dash pattern that spells out SOS in Morse code. The dash pattern is a float[] array that contains the lengths of the "on" and "off" intervals (see Figure 11.43)."*

> *"You can specify the dash pattern and a dash phase when constructing the BasicStroke. The dash phase indicates where in the dash pattern each line should start. Normally, you set this value to 0."*

```java
float[] dashPattern = { 10, 10, 10, 10, 10, 10, 30, 10, 30, . . . };
g2.setStroke(new BasicStroke(10.0F, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER,
    10.0F /* miter limit */, dashPattern, 0 /* dash phase */));
```

**Dịch:** Tạo đường nét đứt bằng cách đặt **dash pattern**. Chương trình ví dụ có dash pattern **đánh vần chữ SOS theo mã Morse**. Dash pattern là một **mảng `float[]`** chứa **độ dài các khoảng "on" và "off"**. **Dash phase** cho biết **mỗi đường nên bắt đầu ở đâu trong dash pattern**; thường đặt giá trị này là **0**.

> **Note (sách):** *"End cap styles are applied to the ends of each dash in a dash pattern."*
>
> **Dịch:** End cap style được áp dụng cho **đầu mút của TỪNG nét gạch** trong một dash pattern.

> *"The program in Listing 11.16 lets you specify end cap styles, join styles, and dashed lines (see Figure 11.44). You can move the ends of the line segments to test the miter limit: Select the miter join, then move the line segment to form a very acute angle. You will see the miter join turn into a bevel join."*

**Dịch:** Bạn di chuyển được đầu mút các đoạn thẳng để **thử miter limit**: chọn miter join, rồi kéo đoạn thẳng tạo **góc rất nhọn** — sẽ thấy **miter join biến thành bevel join**.

> *"The mouse listener remembers your click on the end point of a line segment, and the mouse motion listener monitors the dragging of the end point. A set of radio buttons signal the user choices for the end cap style, join style, and solid or dashed line. The paintComponent method of the StrokePanel class constructs a GeneralPath consisting of the two line segments that join the three points which the user can move with the mouse. It then constructs a BasicStroke, according to the selections the user made, and finally draws the path."*

**Dịch:** Method `paintComponent` của class `StrokePanel` dựng một `GeneralPath` gồm **hai đoạn thẳng nối ba điểm** mà người dùng di chuyển được bằng chuột, rồi dựng một `BasicStroke` theo lựa chọn của người dùng, và cuối cùng vẽ path.

### API — `java.awt.Graphics2D` 1.2 (stroke)

| Method | Công dụng (theo sách) |
|---|---|
| `void setStroke(Stroke s)` | đặt stroke của graphics context này bằng object đã cho (object đó implement interface `Stroke`) |

### API — `java.awt.BasicStroke` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `BasicStroke(float width)` · `BasicStroke(float width, int cap, int join)` · `BasicStroke(float width, int cap, int join, float miterlimit)` · `BasicStroke(float width, int cap, int join, float miterlimit, float[] dash, float dashPhase)` | dựng một object stroke với các thuộc tính đã cho |

| Parameter | Ý nghĩa (theo sách) |
|---|---|
| `width` | **độ rộng của cây bút** |
| `cap` | end cap style — một trong `CAP_BUTT`, `CAP_ROUND`, `CAP_SQUARE` |
| `join` | join style — một trong `JOIN_BEVEL`, `JOIN_MITER`, `JOIN_ROUND` |
| `miterlimit` | tỉ số giữa góc ngoài và góc trong của join với độ dày stroke, **dưới ngưỡng đó miter join được render thành bevel join** |
| `dash` | mảng độ dài của các phần **được tô và để trống xen kẽ** của một stroke nét đứt |
| `dashPhase` | **"phase"** của dash pattern; một đoạn dài bằng giá trị này, **đứng trước điểm bắt đầu của stroke**, được coi là **đã áp dụng dash pattern rồi** |

---

## 11.3.5. Paint

> *"When you fill a shape, its inside is covered with paint. Use the setPaint method to set the paint style to an object whose class implements the Paint interface. The Java 2D API provides three such classes:"*
>
> *"• The Color class implements the Paint interface. To fill shapes with a solid color, simply call setPaint with a Color object, such as"*

```java
g2.setPaint(Color.red);
```

> *"• The GradientPaint class varies colors by interpolating between two given color values (see Figure 11.45)."*
> *"• The TexturePaint class fills an area with repetitions of an image (see Figure 11.46)."*

**Dịch:** Khi bạn **fill** một shape, phần trong của nó **được phủ paint**. Java 2D API cung cấp **ba class** implement interface `Paint`:

| Class | Tác dụng |
|---|---|
| `Color` | tô shape bằng **màu đặc** |
| `GradientPaint` | biến thiên màu bằng cách **nội suy giữa hai giá trị màu** đã cho |
| `TexturePaint` | tô một area bằng **các bản lặp lại của một image** |

> *"You can construct a GradientPaint object by specifying two points and the colors that you want at these two points."*

```java
g2.setPaint(new GradientPaint(p1, Color.RED, p2, Color.YELLOW));
```

> *"Colors are interpolated along the line joining the two points. Colors are constant along lines perpendicular to that joining line. Points beyond an end point of the line are given the color at the end point."*

**Dịch:** Màu được **nội suy dọc theo đường nối hai điểm**. Màu **không đổi dọc theo các đường vuông góc** với đường nối đó. Các điểm **nằm ngoài một đầu mút** thì lấy **màu tại đầu mút đó**.

> *"Alternatively, if you call the GradientPaint constructor with true for the cyclic parameter:"*

```java
g2.setPaint(new GradientPaint(p1, Color.RED, p2, Color.YELLOW, true));
```

> *"Then, the color variation cycles and keeps varying beyond the end points."*

**Dịch:** Nếu truyền `true` cho parameter `cyclic` thì **biến thiên màu lặp vòng** và **tiếp tục biến thiên ra ngoài các đầu mút**.

> *"To construct a TexturePaint object, specify a BufferedImage and an anchor rectangle."*

```java
g2.setPaint(new TexturePaint(bufferedImage, anchorRectangle));
```

> *"The simplest way of obtaining a buffered image is to read an image file:"*

```java
bufferedImage = ImageIO.read(new File("blue-ball.gif"));
```

> *"The anchor rectangle is extended indefinitely in x and y directions to tile the entire coordinate plane. The image is scaled to fit into the anchor and then replicated into each tile."*

**Dịch:** **Anchor rectangle được mở rộng vô hạn** theo hướng x và y để **lát kín cả mặt phẳng toạ độ**. Image được **co giãn cho vừa anchor** rồi **nhân bản vào từng ô lát**.

### API — `java.awt.Graphics2D` 1.2 (paint)

| Method | Công dụng (theo sách) |
|---|---|
| `void setPaint(Paint s)` | đặt paint của graphics context này bằng object đã cho (implement interface `Paint`) |

### API — `java.awt.GradientPaint` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `GradientPaint(float x1, float y1, Color color1, float x2, float y2, Color color2)` · `(..., boolean cyclic)` · `GradientPaint(Point2D p1, Color color1, Point2D p2, Color color2)` · `(..., boolean cyclic)` | dựng object gradient paint tô shape sao cho **điểm đầu mang `color1`, điểm cuối mang `color2`**, các màu ở giữa được **nội suy tuyến tính**. Màu không đổi dọc theo các đường vuông góc với đường nối điểm đầu và điểm cuối. Mặc định gradient paint **không cyclic** — điểm ngoài hai đầu mút mang cùng màu với đầu mút. Nếu **cyclic**, màu tiếp tục được nội suy, trước hết quay lại màu điểm đầu rồi **lặp vô hạn theo cả hai hướng** |

### API — `java.awt.TexturePaint` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `TexturePaint(BufferedImage texture, Rectangle2D anchor)` | tạo object texture paint. Anchor rectangle **định nghĩa cách lát không gian cần tô**; nó **lặp vô hạn** theo hướng x và y, và **image texture được co giãn để lấp đầy từng ô lát** |

---

## 11.3.6. Coordinate Transformations

> *"Suppose you need to draw an object, such as an automobile. You know, from the manufacturer's specifications, the height, wheelbase, and total length. You could, of course, figure out all pixel positions, assuming some number of pixels per meter. However, there is an easier way: You can ask the graphics context to carry out the conversion for you."*

```java
g2.scale(pixelsPerMeter, pixelsPerMeter);
g2.draw(new Line2D.Double(/* coordinates in meters */)); // converts to pixels and
                                                        // draws scaled line
```

**Dịch:** Bạn **có thể tự tính hết vị trí pixel**, giả sử biết số pixel trên mỗi mét. Nhưng có cách dễ hơn: **nhờ graphics context làm việc chuyển đổi giúp bạn**.

> *"The scale method of the Graphics2D class sets the coordinate transformation of the graphics context to a scaling transformation. That transformation changes user coordinates (user-specified units) to device coordinates (pixels)."*

**Dịch:** Method `scale` đặt coordinate transformation của graphics context thành một **scaling transformation**, đổi **user coordinate** (đơn vị do người dùng chỉ định) thành **device coordinate** (pixel).

> *"Coordinate transformations are very useful in practice. They allow you to work with convenient coordinate values. The graphics context takes care of the dirty work of transforming them to pixels."*

**Dịch:** Coordinate transformation **rất hữu ích trong thực tế**: chúng cho bạn làm việc với **giá trị toạ độ thuận tiện**, còn graphics context **lo phần việc bẩn thỉu** là biến chúng thành pixel.

### Bốn phép biến đổi cơ bản

> *"There are four fundamental transformations."*
>
> *"• Scaling: blowing up, or shrinking, all distances from a fixed point"*
> *"• Rotation: rotating all points around a fixed center"*
> *"• Translation: moving all points by a fixed amount"*
> *"• Shear: leaving one line fixed and "sliding" the lines parallel to it by an amount that is proportional to the distance from the fixed line"*

**Dịch:**

| Phép | Ý nghĩa (theo sách) |
|---|---|
| **Scaling** | **phóng to hoặc thu nhỏ** mọi khoảng cách tính từ một điểm cố định |
| **Rotation** | **xoay** mọi điểm quanh một tâm cố định |
| **Translation** | **dời** mọi điểm đi một lượng cố định |
| **Shear** | **giữ nguyên một đường**, và **"trượt" các đường song song với nó** một lượng **tỉ lệ với khoảng cách tới đường cố định đó** |

> *"The scale, rotate, translate, and shear methods of the Graphics2D class set the coordinate transformation of the graphics context to one of these fundamental transformations."*

### Ghép các transformation

> *"You can compose the transformations. For example, you might want to rotate shapes and double their size; supply both a rotation and a scaling transformation:"*

```java
g2.rotate(angle);
g2.scale(2, 2);
g2.draw(. . .);
```

> *"In this case, it does not matter in which order you supply the transformations. However, with most transformations, order does matter. For example, if you want to rotate and shear, then it makes a difference which of the transformations you supply first. You need to figure out what your intention is. The graphics context will apply the transformations in the order opposite to that in which you supplied them—that is, the last transformation you supply is applied first."*

**Dịch:** Ở ví dụ trên **thứ tự không quan trọng**. Nhưng với **hầu hết transformation, thứ tự CÓ quan trọng**. Graphics context **áp dụng transformation theo thứ tự NGƯỢC với thứ tự bạn đưa vào** — tức **transformation cuối cùng bạn đưa vào lại được áp dụng đầu tiên**.

> *"You can supply as many transformations as you like. For example, consider the following sequence of transformations:"*

```java
g2.translate(x, y);
g2.rotate(a);
g2.translate(-x, -y);
```

> *"The last transformation (which is applied first) moves the point (x, y) to the origin. The second transformation rotates with an angle a around the origin. The final transformation moves the origin back to (x, y). The overall effect is a rotation with center point (x, y)—see Figure 11.49. Since rotating about a point other than the origin is such a common operation, there is a shortcut:"*

```java
g2.rotate(a, x, y);
```

**Dịch:** Transformation **cuối cùng (được áp dụng đầu tiên)** dời điểm `(x, y)` về **gốc toạ độ**. Transformation thứ hai **xoay góc `a` quanh gốc**. Transformation cuối cùng trong danh sách **dời gốc trở lại `(x, y)`**. Hiệu ứng tổng thể là **một phép xoay với tâm `(x, y)`**. Vì xoay quanh một điểm khác gốc là thao tác rất phổ biến nên có **đường tắt** `rotate(a, x, y)`.

### Affine transform

> *"If you know some matrix theory, you are probably aware that all rotations, translations, scalings, shears, and their compositions can be expressed by transformation matrices of the form:"*

```
| xnew |   | a  c  e |   | x |
| ynew | = | b  d  f | · | y |
|  1   |   | 0  0  1 |   | 1 |
```

> *"Such a transformation is called an affine transformation. In the Java 2D API, the AffineTransform class describes such a transformation. If you know the components of a particular transformation matrix, you can construct it directly as"*

```java
var t = new AffineTransform(a, b, c, d, e, f);
```

**Dịch:** Mọi phép rotation, translation, scaling, shear và các tổ hợp của chúng đều **biểu diễn được bằng ma trận biến đổi** dạng trên. Phép biến đổi như vậy gọi là **affine transformation**; class `AffineTransform` mô tả nó.

> *"Additionally, the factory methods getRotateInstance, getScaleInstance, getTranslateInstance, and getShearInstance construct the matrices that represent these transformation types. For example, the call"*

```java
t = AffineTransform.getScaleInstance(2.0F, 0.5F);
```

> *"returns a transformation that corresponds to the matrix"*

```
| 2   0    0 |
| 0   0.5  0 |
| 0   0    1 |
```

> *"Finally, the instance methods setToRotation, setToScale, setToTranslation, and setToShear set a transformation object to a new type. Here is an example:"*

```java
t.setToRotation(angle); // sets t to a rotation
```

**Dịch:** Các **factory method** `getRotateInstance`, `getScaleInstance`, `getTranslateInstance`, `getShearInstance` dựng ra ma trận đại diện cho các kiểu transformation này. Các **instance method** `setToXxx` **đặt một object transformation về một kiểu mới**.

### `setTransform` và `transform`

> *"You can set the coordinate transformation of the graphics context to an AffineTransform object."*

```java
g2.setTransform(t); // replaces current transformation
```

> *"However, in practice, you shouldn't call the setTransform operation, as it replaces any existing transformation that the graphics context may have. For example, a graphics context for printing in landscape mode already contains a 90-degree rotation transformation. If you call setTransform, you obliterate that rotation. Instead, call the transform method."*

```java
g2.transform(t); // composes current transformation with t
```

> *"It composes the existing transformation with the new AffineTransform object."*

**Dịch:** Trên thực tế **bạn KHÔNG nên gọi `setTransform`** vì nó **thay thế mọi transformation sẵn có** của graphics context. Ví dụ, graphics context để **in ở chế độ landscape đã chứa sẵn một transformation xoay 90 độ** — gọi `setTransform` sẽ **xoá sổ phép xoay đó**. Thay vào đó **gọi `transform`**, nó **ghép** transformation hiện có với object `AffineTransform` mới.

> *"If you just want to apply a transformation temporarily, first get the old transformation, compose it with your new transformation, and finally restore the old transformation when you are done."*

```java
AffineTransform oldTransform = g2.getTransform(); // save old transform
g2.transform(t); // apply temporary transform
// draw on g2
g2.setTransform(oldTransform); // restore old transform
```

**Dịch:** Muốn áp dụng transformation **tạm thời** thì **lưu transform cũ lại**, ghép transform mới vào, và **khôi phục transform cũ khi xong**.

### API — `java.awt.geom.AffineTransform` 1.2

| Constructor / Method | Công dụng (theo sách) |
|---|---|
| `AffineTransform(double a, double b, double c, double d, double e, double f)` · dạng `float` | dựng affine transform với ma trận `[a c e / b d f / 0 0 1]` |
| `AffineTransform(double[] m)` · `AffineTransform(float[] m)` | dựng affine transform với ma trận `[m[0] m[2] m[4] / m[1] m[3] m[5] / 0 0 1]` |
| `static AffineTransform getRotateInstance(double a)` | tạo phép xoay quanh gốc toạ độ một góc `a` (**radian**). Ma trận: `[cos(a) −sin(a) 0 / sin(a) cos(a) 0 / 0 0 1]`. Nếu `a` nằm giữa `0` và `π/2`, phép xoay **đưa trục x dương về phía trục y dương** |
| `static AffineTransform getRotateInstance(double a, double x, double y)` | tạo phép xoay quanh điểm `(x, y)` một góc `a` (radian) |
| `static AffineTransform getScaleInstance(double sx, double sy)` | tạo phép scaling co giãn trục x theo `sx` và trục y theo `sy`. Ma trận: `[sx 0 0 / 0 sy 0 / 0 0 1]` |
| `static AffineTransform getShearInstance(double shx, double shy)` | tạo phép shear làm trượt trục x theo `shx` và trục y theo `shy`. Ma trận: `[1 shx 0 / shy 1 0 / 0 0 1]` |
| `static AffineTransform getTranslateInstance(double tx, double ty)` | tạo phép translation dời trục x đi `tx` và trục y đi `ty`. Ma trận: `[1 0 tx / 0 1 ty / 0 0 1]` |
| `void setToRotation(double a)` · `void setToRotation(double a, double x, double y)` · `void setToScale(double sx, double sy)` · `void setToShear(double sx, double sy)` · `void setToTranslation(double tx, double ty)` | đặt affine transformation này thành một phép biến đổi cơ bản với các parameter đã cho |

### API — `java.awt.Graphics2D` 1.2 (transform)

| Method | Công dụng (theo sách) |
|---|---|
| `void setTransform(AffineTransform t)` | **thay thế** coordinate transformation hiện có của graphics context này bằng `t` |
| `void transform(AffineTransform t)` | **ghép** coordinate transformation hiện có của graphics context này với `t` |
| `void rotate(double a)` · `void rotate(double a, double x, double y)` · `void scale(double sx, double sy)` · `void shear(double sx, double sy)` · `void translate(double tx, double ty)` | **ghép** coordinate transformation hiện có với một phép biến đổi cơ bản có các parameter đã cho |

---

## 11.3.7. Clipping

> *"By setting a clipping shape in the graphics context, you constrain all drawing operations to the interior of that clipping shape."*

```java
g2.setClip(clipShape); // but see below
g2.draw(shape); // draws only the part that falls inside the clipping shape
```

**Dịch:** Đặt một **clipping shape** trong graphics context sẽ **ràng buộc mọi thao tác vẽ vào phần trong của clipping shape đó**.

> *"However, in practice, you don't want to call the setClip operation because it replaces any existing clipping shape that the graphics context might have. For example, as you will see later in this chapter, a graphics context for printing comes with a clip rectangle that ensures that you don't draw on the margins. Instead, call the clip method."*

```java
g2.clip(clipShape); // better
```

> *"The clip method intersects the existing clipping shape with the new one that you supply."*

**Dịch:** Trên thực tế **không nên gọi `setClip`** vì nó **thay thế mọi clipping shape sẵn có**. Ví dụ, graphics context để **in** đã kèm sẵn một **clip rectangle đảm bảo bạn không vẽ lên lề**. Thay vào đó gọi `clip` — nó **lấy giao** giữa clipping shape hiện có và cái mới bạn đưa vào.

> *"If you just want to apply a clipping area temporarily, you should first get the old clip, add your new clip, and finally restore the old clip when you are done:"*

```java
Shape oldClip = g2.getClip(); // save old clip
g2.clip(clipShape); // apply temporary clip
// draw on g2
g2.setClip(oldClip); // restore old clip
```

### Clip bằng hình chữ cái

> *"In Figure 11.50, we show off the clipping capability with a rather dramatic drawing of a line pattern clipped by a complex shape—namely, the outline of a set of letters."*

> *"To obtain the character outlines, you need a font render context. Use the getFontRenderContext method of the Graphics2D class."*

```java
FontRenderContext context = g2.getFontRenderContext();
```

> *"Next, using a string, a font, and the font render context, create a TextLayout object:"*

```java
var layout = new TextLayout("Hello", font, context);
```

> *"This text layout object describes the layout of a sequence of characters, as rendered by a particular font render context. The layout depends on the font render context—the same characters will look different on a screen and on a printer."*

**Dịch:** Object text layout mô tả **cách bố trí một dãy ký tự**, khi được render bởi một font render context cụ thể. Bố trí **phụ thuộc font render context** — **cùng những ký tự đó sẽ trông khác nhau trên màn hình và trên máy in**.

> *"More important for our application, the getOutline method returns a Shape object that describes the shape of the outline of the characters in the text layout. The outline shape starts at the origin (0, 0), which might not be what you want. In that case, supply an affine transform to the getOutline operation to specify where you would like the outline to appear."*

```java
AffineTransform transform = AffineTransform.getTranslateInstance(0, 100);
Shape outline = layout.getOutline(transform);
```

> *"Then, append the outline to the clipping shape."*

```java
var clipShape = new GeneralPath();
clipShape.append(outline, false);
```

> *"Finally, set the clipping shape and draw a set of lines. The lines appear only inside the character boundaries."*

```java
g2.setClip(clipShape);
var p = new Point2D.Double(0, 0);
for (int i = 0; i < NLINES; i++)
{
    double x = . . .;
    double y = . . .;
    var q = new Point2D.Double(x, y);
    g2.draw(new Line2D.Double(p, q)); // lines are clipped
}
```

**Dịch:** Method `getOutline` trả về một object `Shape` mô tả **đường viền của các ký tự** trong text layout. Outline shape **bắt đầu ở gốc `(0, 0)`**, có thể không phải chỗ bạn muốn — khi đó đưa một **affine transform** vào `getOutline` để chỉ định vị trí xuất hiện. Cuối cùng đặt clipping shape và vẽ một loạt đường thẳng: **các đường chỉ hiện ra bên trong biên của ký tự**.

### API — `java.awt.Graphics` 1.0 (clip)

| Method | Công dụng (theo sách) |
|---|---|
| `void setClip(Shape s)` *(1.2)* | đặt clipping shape hiện tại thành shape `s` |
| `Shape getClip()` *(1.2)* | trả về clipping shape hiện tại |

### API — `java.awt.Graphics2D` 1.2 (clip)

| Method | Công dụng (theo sách) |
|---|---|
| `void clip(Shape s)` | **lấy giao** clipping shape hiện tại với shape `s` |
| `FontRenderContext getFontRenderContext()` | trả về một font render context, **cần thiết để dựng object `TextLayout`** |

### API — `java.awt.font.TextLayout` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TextLayout(String s, Font f, FontRenderContext context)` | dựng object text layout từ string và font đã cho, dùng font render context để **lấy các property của font cho một thiết bị cụ thể** |
| `float getAdvance()` | trả về **chiều rộng** của text layout này |
| `float getAscent()` · `float getDescent()` | trả về **chiều cao** của text layout này **phía trên và phía dưới baseline** |
| `float getLeading()` | trả về **khoảng cách giữa các dòng liên tiếp** trong font mà text layout này dùng |

---

## 11.3.8. Transparency and Composition

> *"In the standard RGB color model, every color is described by its red, green, and blue components. However, it is also convenient to describe areas of an image that are transparent or partially transparent. When you superimpose an image onto an existing drawing, the transparent pixels do not obscure the pixels under them at all, whereas partially transparent pixels are mixed with the pixels under them. Figure 11.51 shows the effect of overlaying a partially transparent rectangle on an image. You can still see the details of the image shine through from under the rectangle."*

**Dịch:** Trong mô hình màu **RGB chuẩn**, mọi màu được mô tả bằng thành phần **đỏ, lục, lam**. Nhưng cũng tiện khi mô tả những vùng của image **trong suốt hoặc trong suốt một phần**. Pixel **trong suốt hoàn toàn không che pixel bên dưới**, còn pixel **trong suốt một phần thì trộn với pixel bên dưới**.

> *"In the Java 2D API, transparency is described by an alpha channel. Each pixel has, in addition to its red, green, and blue color components, an alpha value between 0 (fully transparent) and 1 (fully opaque). For example, the rectangle in Figure 11.51 was filled with a pale yellow color with 50% transparency:"*

```java
new Color(0.7F, 0.7F, 0.0F, 0.5F);
```

**Dịch:** Trong Java 2D API, **transparency được mô tả bằng alpha channel**. Ngoài ba thành phần màu, mỗi pixel còn có **giá trị alpha giữa 0 (trong suốt hoàn toàn) và 1 (đục hoàn toàn)**.

### Quy tắc Porter–Duff

> *"Now let us look at what happens if you superimpose two shapes. You need to blend or compose the colors and alpha values of the source and destination pixels. Porter and Duff, two researchers in the field of computer graphics, have formulated 12 possible composition rules for this blending process. The Java 2D API implements all of these rules. Before going any further, we'd like to point out that only two of these rules have practical significance. If you find the rules arcane or confusing, just use the SRC_OVER rule. It is the default rule for a Graphics2D object, and it gives the most intuitive results."*

**Dịch:** Porter và Duff, hai nhà nghiên cứu trong ngành đồ hoạ máy tính, đã đưa ra **12 composition rule** cho quá trình trộn này; Java 2D API **implement toàn bộ**. Sách lưu ý ngay: **chỉ hai trong số các rule đó có ý nghĩa thực tiễn**. Nếu thấy các rule khó hiểu hay rối rắm thì **cứ dùng rule `SRC_OVER`** — đây là **rule mặc định** của một object `Graphics2D` và cho **kết quả trực quan nhất**.

> *"Here is the theory behind the rules. Suppose you have a source pixel with alpha value aS. In the image, there is already a destination pixel with alpha value aD. You want to compose the two."*

> *"Porter and Duff consider the alpha value as the probability that the pixel color should be used. From the perspective of the source, there is a probability aS that it wants to use the source color and a probability of 1 – aS that it doesn't care. The same holds for the destination. When composing the colors, let us assume that the probabilities are independent. Then there are four cases, as shown in Figure 11.52. If the source wants to use the source color and the destination doesn't care, then it seems reasonable to let the source have its way. That's why the upper right corner of the diagram is labeled "S". The probability for that event is aS · (1 – aD). Similarly, the lower left corner is labeled "D"."*

**Dịch:** Porter và Duff coi **giá trị alpha là xác suất màu của pixel nên được dùng**. Từ góc nhìn của **source**: có xác suất `aS` nó **muốn dùng màu source** và xác suất `1 – aS` nó **không quan tâm**. Với **destination** cũng vậy. Giả sử các xác suất **độc lập**, có **bốn trường hợp**. Nếu source muốn dùng màu source còn destination không quan tâm thì **hợp lý là để source thắng** — nên góc trên phải của sơ đồ được gán nhãn **"S"**, với xác suất `aS · (1 – aD)`. Tương tự, góc dưới trái được gán nhãn **"D"**.

> *"What should one do if both destination and source would like to select their color? That's where the Porter–Duff rules come in. If we decide that the source is more important, we label the lower right corner with an "S" as well. That rule is called SRC_OVER. In that rule, you combine the source colors with a weight of aS and the destination colors with a weight of (1 – aS) · aD."*

**Dịch:** Vậy khi **cả destination lẫn source đều muốn chọn màu của mình** thì sao? Đó chính là chỗ các **rule Porter–Duff** vào cuộc. Nếu ta quyết định **source quan trọng hơn** thì gán nhãn **"S"** cho cả góc dưới phải — rule đó gọi là **`SRC_OVER`**. Ở rule này, màu source được kết hợp với **trọng số `aS`**, màu destination với **trọng số `(1 – aS) · aD`**.

> *"The visual effect is a blending of the source and destination, with preference given to the source. In particular, if aS is 1, then the destination color is not taken into account at all. If aS is 0, then the source pixel is completely transparent and the destination color is unchanged."*

**Dịch:** Hiệu ứng thị giác là **trộn source với destination, ưu tiên source**. Cụ thể: `aS = 1` thì **màu destination hoàn toàn không được tính tới**; `aS = 0` thì **pixel source trong suốt hoàn toàn** và **màu destination không đổi**.

**Table 11.3 — The Porter–Duff Composition Rules**

| Rule | Explanation | Dịch |
|---|---|---|
| `CLEAR` | Source clears destination. | Source **xoá** destination |
| `SRC` | Source overwrites destination and empty pixels. | Source **ghi đè** destination và các pixel trống |
| `DST` | Source does not affect destination. | Source **không ảnh hưởng** destination |
| `SRC_OVER` | Source blends with destination and overwrites empty pixels. | Source **trộn** với destination và ghi đè pixel trống |
| `DST_OVER` | Source does not affect destination and overwrites empty pixels. | Source không ảnh hưởng destination và ghi đè pixel trống |
| `SRC_IN` | Source overwrites destination. | Source ghi đè destination |
| `SRC_OUT` | Source clears destination and overwrites empty pixels. | Source xoá destination và ghi đè pixel trống |
| `DST_IN` | Source alpha modifies destination. | **Alpha của source** sửa đổi destination |
| `DST_OUT` | Source alpha complement modifies destination. | **Phần bù alpha của source** sửa đổi destination |
| `SRC_ATOP` | Source blends with destination. | Source trộn với destination |
| `DST_ATOP` | Source alpha modifies destination. Source overwrites empty pixels. | Alpha của source sửa đổi destination. Source ghi đè pixel trống |
| `XOR` | Source alpha complement modifies destination. Source overwrites empty pixels. | Phần bù alpha của source sửa đổi destination. Source ghi đè pixel trống |

> *"The images in the figure show the results of the rules when a rectangular source region with an alpha of 0.75 is combined with an elliptical destination region with an alpha of 1.0."*

> *"As you can see, most of the rules aren't very useful. Consider, as an extreme case, the DST_IN rule. It doesn't take the source color into account at all, but uses the alpha of the source to affect the destination. The SRC rule is potentially useful—it forces the source color to be used, turning off blending with the destination."*

**Dịch:** Như thấy được, **phần lớn các rule không hữu ích lắm**. Ví dụ cực đoan là rule **`DST_IN`**: nó **hoàn toàn không tính tới màu source**, mà **dùng alpha của source để tác động lên destination**. Rule **`SRC`** thì **có thể hữu ích** — nó **buộc dùng màu source**, tắt việc trộn với destination.

### `AlphaComposite`

> *"Use the setComposite method of the Graphics2D class to install an object of a class that implements the Composite interface. The Java 2D API supplies one such class, AlphaComposite, that implements all the Porter–Duff rules in Figure 11.53."*

> *"The factory method getInstance of the AlphaComposite class yields an AlphaComposite object. You supply the rule and the alpha value to be used for source pixels. For example, consider the following code:"*

```java
int rule = AlphaComposite.SRC_OVER;
float alpha = 0.5f;
g2.setComposite(AlphaComposite.getInstance(rule, alpha));
g2.setPaint(Color.blue);
g2.fill(rectangle);
```

> *"The rectangle is then painted with blue color and an alpha value of 0.5. Since the composition rule is SRC_OVER, it is transparently overlaid on the existing image."*

**Dịch:** Java 2D API cung cấp **một class** implement interface `Composite`, là **`AlphaComposite`**, implement **toàn bộ các rule Porter–Duff**. Factory method `getInstance` cho ra một object `AlphaComposite`: bạn đưa vào **rule** và **giá trị alpha dùng cho pixel source**.

### Vì sao ví dụ phải dùng buffered image

> *"The program has one important twist. There is no guarantee that the graphics context that corresponds to the screen has an alpha channel. (In fact, it generally does not.) When pixels are deposited to a destination without an alpha channel, the pixel colors are multiplied with the alpha value and the alpha value is discarded. Now, several of the Porter–Duff rules use the alpha values of the destination, which means a destination alpha channel is important. For that reason, we use a buffered image with the ARGB color model to compose the shapes. After the images have been composed, we draw the resulting image to the screen."*

```java
var image = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_INT_ARGB);
Graphics2D gImage = image.createGraphics();
// now draw to gImage
g2.drawImage(image, null, 0, 0);
```

**Dịch:** Chương trình có **một điểm quan trọng cần lưu ý**: **không có gì bảo đảm** graphics context ứng với màn hình **có alpha channel** (thực tế là **thường không có**). Khi pixel được đưa vào một destination **không có alpha channel**, **màu pixel được nhân với giá trị alpha rồi giá trị alpha bị vứt bỏ**. Nhưng **vài rule Porter–Duff lại dùng giá trị alpha của destination**, nghĩa là **alpha channel của destination rất quan trọng**. Vì vậy ta dùng một **buffered image với color model ARGB** để compose các shape, rồi **vẽ image kết quả ra màn hình**.

> *"Furthermore, the program displays a verbal description of each rule. Note that the descriptions are computed from the composition rule diagrams. For example, a "DS" in the second row stands for "blends with destination.""*

> *"As you run the program, move the alpha slider from left to right to see the effect on the composed shapes. In particular, note that the only difference between the DST_IN and DST_OUT rules is how the destination (!) color changes when you change the source alpha."*

**Dịch:** Các mô tả bằng lời **được tính ra từ sơ đồ composition rule**. Khi chạy chương trình, kéo thanh trượt alpha từ trái sang phải để thấy tác động. Đặc biệt lưu ý: **khác biệt duy nhất giữa rule `DST_IN` và `DST_OUT`** là **màu của destination (!) thay đổi thế nào khi bạn đổi alpha của source**.

### API — `java.awt.Graphics2D` 1.2 (composite)

| Method | Công dụng (theo sách) |
|---|---|
| `void setComposite(Composite s)` | đặt composite của graphics context này bằng object đã cho (implement interface `Composite`) |

### API — `java.awt.AlphaComposite` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `static AlphaComposite getInstance(int rule)` · `static AlphaComposite getInstance(int rule, float sourceAlpha)` | dựng một object alpha composite. `rule` là một trong `CLEAR`, `SRC`, `SRC_OVER`, `DST_OVER`, `SRC_IN`, `SRC_OUT`, `DST_IN`, `DST_OUT`, `DST`, `DST_ATOP`, `SRC_ATOP`, `XOR` |

---

## Bài kế tiếp

→ [[04 - Raster Images]] — reader/writer cho image, dựng raster image, và lọc image.
