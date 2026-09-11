# 05 — Printing

> Chapter 11, Section 11.5 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.5. Printing

> *"In the following sections, we will show you how you can easily print a drawing on a single sheet of paper, how you can manage a multipage printout, and how you can save a printout as a PostScript file."*

**Dịch:** Các mục sau trình bày cách **in một bản vẽ lên một tờ giấy**, cách **quản lý bản in nhiều trang**, và cách **lưu bản in thành file PostScript**.

---

## 11.5.1. Graphics Printing

> *"In this section, we will tackle what is probably the most common printing situation: printing a 2D graphic. Of course, the graphic can contain text in various fonts or even consist entirely of text."*

> *"To generate a printout, you have to take care of these two tasks:"*
>
> *"• Supply an object that implements the Printable interface"*
> *"• Start a print job"*

**Dịch:** Để tạo một bản in, bạn phải lo **hai việc**: **cung cấp một object implement interface `Printable`** và **khởi động một print job**.

> *"The Printable interface has a single method:"*

```java
int print(Graphics g, PageFormat format, int page)
```

> *"That method is called whenever the print engine needs to have a page formatted for printing. Your code draws the text and the images to be printed onto the graphics context. The page format tells you the paper size and the print margins. The page number tells you which page to render."*

**Dịch:** Method này được gọi **mỗi khi print engine cần định dạng một trang để in**. Code của bạn **vẽ text và image cần in lên graphics context**. **Page format** cho biết **khổ giấy và lề in**. **Page number** cho biết **cần render trang nào**.

> *"To start a print job, use the PrinterJob class. First, call the static getPrinterJob method to get a print job object. Then set the Printable object that you want to print."*

```java
Printable canvas = . . .;
PrinterJob job = PrinterJob.getPrinterJob();
job.setPrintable(canvas);
```

> **Caution (sách):** *"The class PrintJob handles JDK 1.1-style printing. That class is now obsolete. Do not confuse it with the PrinterJob class."*
>
> **Dịch:** Class **`PrintJob`** xử lý kiểu in của **JDK 1.1**. Class đó nay **đã lỗi thời**. **Đừng nhầm nó với class `PrinterJob`.**

### Print dialog và attribute set

> *"Before starting the print job, you should call the printDialog method to display a print dialog box (see Figure 11.60). That dialog box gives the user a chance to select the printer to be used (in case multiple printers are available), the page range that should be printed, and various printer settings."*

> *"Collect printer settings in an object of a class that implements the PrintRequestAttributeSet interface, such as the HashPrintRequestAttributeSet class."*

```java
var attributes = new HashPrintRequestAttributeSet();
```

> *"Add attribute settings and pass the attributes object to the printDialog method. The printDialog method returns true if the user clicked OK and false if the user canceled the dialog box. If the user accepted, call the print method of the PrinterJob class to start the printing process. The print method might throw a PrinterException. Here is the outline of the printing code:"*

```java
if (job.printDialog(attributes))
{
    try
    {
        job.print(attributes);
    }
    catch (PrinterException exception)
    {
        . . .
    }
}
```

**Dịch:** Hộp thoại in cho người dùng cơ hội **chọn máy in** (nếu có nhiều), **dải trang cần in**, và **các thiết lập máy in**. Gom thiết lập máy in vào một object của class implement interface `PrintRequestAttributeSet`, ví dụ `HashPrintRequestAttributeSet`.

> **Note (sách):** *"Prior to JDK 1.4, the printing system used the native print and page setup dialog boxes of the host platform. To show a native print dialog box, call the printDialog method with no parameters. (There is no way to collect user settings in an attribute set.)"*
>
> **Dịch:** **Trước JDK 1.4**, hệ thống in dùng **hộp thoại in và hộp thoại thiết lập trang gốc (native)** của nền tảng chủ. Muốn hiện hộp thoại in native thì gọi `printDialog` **không có parameter** — khi đó **không có cách nào gom thiết lập của người dùng vào một attribute set**.

### Print engine gọi `print` nhiều lần

> *"During printing, the print method of the PrinterJob class makes repeated calls to the print method of the Printable object associated with the job."*

> *"Since the job does not know how many pages you want to print, it simply keeps calling the print method. As long as the print method returns the value Printable.PAGE_EXISTS, the print job keeps producing pages. When the print method returns Printable.NO_SUCH_PAGE, the print job stops."*

**Dịch:** Vì print job **không biết bạn muốn in bao nhiêu trang**, nó cứ **gọi `print` liên tục**. Chừng nào `print` còn trả về **`Printable.PAGE_EXISTS`**, print job **còn tạo trang**. Khi `print` trả về **`Printable.NO_SUCH_PAGE`**, print job **dừng lại**.

> **Caution (sách):** *"The page numbers that the print job passes to the print method start with page 0."*
>
> **Dịch:** Số trang mà print job truyền vào method `print` **bắt đầu từ trang 0**.

> *"Therefore, the print job doesn't have an accurate page count until after the printout is complete. For that reason, the print dialog box can't display the correct page range—instead, it displays "Pages 1 to 1." You will see in the next section how to avoid this blemish by supplying a Book object to the print job."*

**Dịch:** Vì vậy print job **không có số trang chính xác cho tới khi bản in hoàn tất**. Hệ quả: hộp thoại in **không hiển thị được dải trang đúng** — nó hiển thị **"Pages 1 to 1"**. Mục sau sẽ cho thấy cách **tránh khiếm khuyết này** bằng cách **cung cấp một object `Book`** cho print job.

### Banding

> *"During the printing process, the print job repeatedly calls the print method of the Printable object. The print job is allowed to make multiple calls for the same page. You should therefore not count pages inside the print method but always rely on the page number parameter."*

> *"There is a good reason why the print job might call the print method repeatedly for the same page. Some printers, in particular dot-matrix and inkjet printers, use banding. They print one band at a time, advance the paper, and then print the next band. The print job might use banding even for laser printers that print a full page at a time—it gives the print job a way of managing the size of the spool file."*

**Dịch:** Print job **được phép gọi nhiều lần cho cùng một trang**. Vì vậy bạn **không nên đếm trang bên trong method `print`** mà **luôn dựa vào parameter page number**. Lý do: một số máy in — nhất là **máy in kim và máy in phun** — dùng **banding**: in **từng dải một**, đẩy giấy, rồi in dải kế tiếp. Print job **có thể dùng banding cả với máy in laser** in trọn trang một lượt — nó cho print job một cách để **quản lý kích thước file spool**.

> *"If the print job needs the Printable object to print a band, it sets the clip area of the graphics context to the requested band and calls the print method. Its drawing operations are clipped against the band rectangle, and only those drawing elements that show up in the band are rendered. Your print method need not be aware of that process, with one caveat: It should not interfere with the clip area."*

**Dịch:** Khi cần in một dải, print job **đặt vùng clip của graphics context bằng dải được yêu cầu** rồi gọi `print`. Các thao tác vẽ **bị clip theo hình chữ nhật của dải đó**, và **chỉ những phần tử vẽ hiện ra trong dải mới được render**. Method `print` của bạn **không cần biết tới quá trình đó, chỉ với một lưu ý: nó không được can thiệp vào vùng clip**.

> **Caution (sách):** *"The Graphics object that your print method gets is also clipped against the page margins. If you replace the clip area, you can draw outside the margins. Especially in a printer graphics context, the clipping area must be respected. Call clip, not setClip, to further restrict the clipping area. If you must remove a clip area, make sure to call getClip at the beginning of your print method and restore that clip area."*
>
> **Dịch:** Object `Graphics` mà method `print` nhận được **cũng đã bị clip theo lề trang**. Nếu bạn **thay thế vùng clip**, bạn có thể **vẽ ra ngoài lề**. Đặc biệt trong graphics context của máy in, **vùng clipping phải được tôn trọng**. Gọi **`clip`, không phải `setClip`** để thu hẹp thêm vùng clipping. Nếu buộc phải gỡ một vùng clip, **nhớ gọi `getClip` ở đầu method `print` và khôi phục lại vùng clip đó**. (Xem [[03 - Advanced AWT#11.3.7. Clipping]].)

### PageFormat và đơn vị point

> *"The PageFormat parameter of the print method contains information about the printed page. The methods getWidth and getHeight return the paper size, measured in points. (One point is 1/72 of an inch; an inch equals 25.4 millimeters.) For example, A4 paper is approximately 595 × 842 points, and US Letter paper is 612 × 792 points."*

**Dịch:** `getWidth` và `getHeight` trả về **khổ giấy, đo bằng point**. **Một point = 1/72 inch**; một inch = **25.4 mm**. Giấy **A4 ≈ 595 × 842 point**, giấy **US Letter = 612 × 792 point**.

> *"Points are a common measurement in the printing trade in the United States. Much to the chagrin of the rest of the world, the printing package uses point units. There are two purposes for that: paper sizes and paper margins are measured in points, and points are the default unit for all print graphics contexts. You can verify that in the example program at the end of this section. The program prints two lines of text that are 72 units apart. Run the example program and measure the distance between the baselines; they are exactly 1 inch or 25.4 millimeters apart."*

**Dịch:** Point là đơn vị đo thông dụng trong ngành in ở Mỹ. **Trước sự phiền lòng của phần còn lại của thế giới**, package in dùng đơn vị point. Có **hai mục đích**: khổ giấy và lề giấy được đo bằng point · point là **đơn vị mặc định cho mọi print graphics context**.

> *"The getWidth and getHeight methods of the PageFormat class give you the complete paper size. Not all of the paper area is printable. Users typically select margins, and even if they don't, printers need to somehow grip the sheets of paper on which they print and therefore have a small unprintable area around the edges."*

> *"The methods getImageableWidth and getImageableHeight tell you the dimensions of the area that you can actually fill. However, the margins need not be symmetrical, so you must also know the top left corner of the imageable area (see Figure 11.61), which you obtain by the methods getImageableX and getImageableY."*

**Dịch:** **Không phải toàn bộ diện tích giấy đều in được.** Người dùng thường chọn lề, và **kể cả khi không chọn**, máy in vẫn cần **kẹp giữ tờ giấy** nên có một **vùng nhỏ không in được quanh mép**. `getImageableWidth`/`getImageableHeight` cho biết kích thước **vùng bạn thực sự lấp đầy được**. Nhưng **lề không nhất thiết đối xứng**, nên bạn **cũng phải biết góc trên trái của vùng imageable**, lấy bằng `getImageableX` và `getImageableY`.

> **Tip (sách):** *"The graphics context that you receive in the print method is clipped to exclude the margins, but the origin of the coordinate system is nevertheless the top left corner of the paper. It makes sense to translate the coordinate system to the top left corner of the imageable area. Simply start your print method with"*
>
> ```java
> g.translate(pageFormat.getImageableX(), pageFormat.getImageableY());
> ```
>
> **Dịch:** Graphics context bạn nhận trong `print` **đã bị clip để loại lề ra**, nhưng **gốc toạ độ vẫn là góc trên trái của tờ giấy**. Vì vậy **hợp lý là dời hệ toạ độ về góc trên trái của vùng imageable**.

### Page setup dialog

> *"If you want your users to choose the settings for the page margins or to switch between portrait and landscape orientation without setting other printing attributes, call the pageDialog method of the PrinterJob class:"*

```java
PageFormat format = job.pageDialog(attributes);
```

> **Note (sách):** *"One of the tabs of the print dialog box contains the page setup dialog (see Figure 11.62). You might still want to give users an option to set the page format before printing, especially if your program presents a "what you see is what you get" display of the pages to be printed. The pageDialog method returns a PageFormat object with the user settings."*
>
> **Dịch:** Một trong các tab của hộp thoại in **đã chứa hộp thoại page setup**. Bạn vẫn có thể muốn cho người dùng tuỳ chọn đặt page format trước khi in, **nhất là nếu chương trình của bạn hiển thị các trang sẽ in theo kiểu "what you see is what you get"**.

> **Note (sách):** *"To show a native page setup dialog box, pass a default PageFormat object to the pageDialog method. The method clones that object, modifies it according to the user selections in the dialog box, and returns the cloned object."*
>
> ```java
> PageFormat defaultFormat = printJob.defaultPage();
> PageFormat selectedFormat = printJob.pageDialog(defaultFormat);
> ```
>
> **Dịch:** Muốn hiện hộp thoại page setup **native**, truyền một object `PageFormat` mặc định vào `pageDialog`. Method này **clone object đó**, sửa nó theo lựa chọn của người dùng, rồi **trả về object đã clone**.

### Dùng chung code vẽ giữa màn hình và bản in

> *"The program in Listings 11.23 and 11.24 shows how to render the same set of shapes on the screen and on the printed page. A subclass of JPanel implements the Printable interface. Both the paintComponent and the print methods call the same method to carry out the actual drawing."*

```java
class PrintPanel extends JPanel implements Printable
{
    public void paintComponent(Graphics g)
    {
        super.paintComponent(g);
        var g2 = (Graphics2D) g;
        drawPage(g2);
    }

    public int print(Graphics g, PageFormat pf, int page) throws PrinterException
    {
        if (page >= 1) return Printable.NO_SUCH_PAGE;
        var g2 = (Graphics2D) g;
        g2.translate(pf.getImageableX(), pf.getImageableY());
        drawPage(g2);
        return Printable.PAGE_EXISTS;
    }

    public void drawPage(Graphics2D g2)
    {
        // shared drawing code goes here
        . . .
    }
    . . .
}
```

**Dịch:** Một subclass của `JPanel` implement interface `Printable`. **Cả `paintComponent` lẫn `print` đều gọi cùng một method** để thực hiện việc vẽ thật sự.

> *"This example displays and prints the image shown in Figure 11.50—namely, the outline of the message "Hello, World" used as a clipping area for a pattern of lines."*

**Dịch:** Ví dụ này hiển thị và in **đường viền của dòng chữ "Hello, World" dùng làm vùng clipping cho một hoa văn các đường thẳng**.

### Listing 11.23 — `print/PrintTestFrame.java`

```java
package print;

import java.awt.*;
import java.awt.print.*;

import javax.print.attribute.*;
import javax.swing.*;

/**
 * This frame shows a panel with 2D graphics and buttons to print the graphics and to set up
 * the page format.
 */
public class PrintTestFrame extends JFrame
{
    private PrintComponent canvas;
    private PrintRequestAttributeSet attributes;

    public PrintTestFrame()
    {
        canvas = new PrintComponent();
        add(canvas, BorderLayout.CENTER);

        attributes = new HashPrintRequestAttributeSet();

        var buttonPanel = new JPanel();
        var printButton = new JButton("Print");
        buttonPanel.add(printButton);
        printButton.addActionListener(event ->
        {
            try
            {
                PrinterJob job = PrinterJob.getPrinterJob();
                job.setPrintable(canvas);
                if (job.printDialog(attributes)) job.print(attributes);
            }
            catch (PrinterException ex)
            {
                JOptionPane.showMessageDialog(PrintTestFrame.this, ex);
            }
        });

        var pageSetupButton = new JButton("Page setup");
        buttonPanel.add(pageSetupButton);
        pageSetupButton.addActionListener(event ->
        {
            PrinterJob job = PrinterJob.getPrinterJob();
            job.pageDialog(attributes);
        });

        add(buttonPanel, BorderLayout.NORTH);
        pack();
    }
}
```

*(Về lambda expression trong các action listener, xem [[02 - Lambda Expressions]].)*

### API — `java.awt.print.Printable` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `int print(Graphics g, PageFormat format, int pageNumber)` | render một trang rồi trả về `PAGE_EXISTS`, hoặc trả về `NO_SUCH_PAGE`. `g` = graphics context để render trang lên · `format` = format của trang cần vẽ · `pageNumber` = số của trang được yêu cầu |

### API — `java.awt.print.PrinterJob` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `static PrinterJob getPrinterJob()` | trả về một object printer job |
| `PageFormat defaultPage()` | trả về page format mặc định của máy in này |
| `boolean printDialog(PrintRequestAttributeSet attributes)` · `boolean printDialog()` | mở hộp thoại in để người dùng chọn trang cần in và đổi thiết lập in. Method thứ nhất hiện **hộp thoại đa nền tảng**, method thứ hai hiện **hộp thoại native**. Method thứ nhất **sửa object `attributes`** để phản ánh thiết lập của người dùng. Cả hai trả về `true` nếu người dùng chấp nhận hộp thoại |
| `PageFormat pageDialog(PrintRequestAttributeSet attributes)` · `PageFormat pageDialog(PageFormat defaults)` | hiện hộp thoại page setup. Cái đầu đa nền tảng, cái sau native. Cả hai trả về object `PageFormat` với format người dùng yêu cầu. Method thứ nhất **sửa** object `attributes`; method thứ hai **không sửa** object `defaults` |
| `void setPrintable(Printable p)` · `void setPrintable(Printable p, PageFormat format)` | đặt `Printable` của print job này và một page format tuỳ chọn |
| `void print()` · `void print(PrintRequestAttributeSet attributes)` | in `Printable` hiện tại bằng cách **gọi lặp lại method `print` của nó** và gửi các trang đã render tới máy in, **cho tới khi không còn trang nào** |

### API — `java.awt.print.PageFormat` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `double getWidth()` · `double getHeight()` | trả về chiều rộng và chiều cao của trang |
| `double getImageableWidth()` · `double getImageableHeight()` | trả về chiều rộng và chiều cao của **vùng imageable** của trang |
| `double getImageableX()` · `double getImageableY()` | trả về vị trí **góc trên trái** của vùng imageable |
| `int getOrientation()` | trả về một trong `PORTRAIT`, `LANDSCAPE`, `REVERSE_LANDSCAPE`. **Hướng trang là trong suốt đối với lập trình viên** vì page format và thiết lập graphics context **tự động phản ánh hướng trang** |

---

## 11.5.2. Multiple-Page Printing

> *"In practice, you usually don't pass a raw Printable object to a print job. Instead, you should obtain an object of a class that implements the Pageable interface. The Java platform supplies one such class, called Book. A book is made up of sections, each of which is a Printable object. To make a book, add Printable objects and their page counts."*

```java
var book = new Book();
Printable coverPage = . . .;
Printable bodyPages = . . .;
book.append(coverPage, pageFormat); // append 1 page
book.append(bodyPages, pageFormat, pageCount);
```

> *"Then, use the setPageable method to pass the Book object to the print job."*

```java
printJob.setPageable(book);
```

> *"Now the print job knows exactly how many pages to print, so the print dialog box displays an accurate page range and the user can select the entire range or subranges."*

**Dịch:** Trên thực tế bạn **thường không truyền một object `Printable` thô** cho print job. Thay vào đó, lấy object của một class **implement interface `Pageable`**. Java cung cấp một class như vậy tên **`Book`**. Một book gồm **các section, mỗi section là một object `Printable`**. Khi đó print job **biết chính xác cần in bao nhiêu trang**, nên hộp thoại in **hiển thị dải trang chính xác**.

> **Caution (sách):** *"When the print job calls the print methods of the Printable sections, it passes the current page number of the book, and not of each section, as the current page number. That is a huge pain—each section must know the page counts of the preceding sections to make sense of the page number parameter."*
>
> **Dịch:** Khi print job gọi method `print` của các section `Printable`, nó truyền **số trang hiện tại của cả book, chứ không phải của từng section**. Đó là **một nỗi khổ lớn** — mỗi section **phải biết số trang của các section đứng trước** thì mới hiểu được parameter page number.

> *"From your perspective as a programmer, the biggest challenge of using the Book class is that you must know how many pages each section will have when you print it. Your Printable class needs a layout algorithm that computes the layout of the material on the printed pages. Before printing starts, invoke that algorithm to compute the page breaks and the page count. You can retain the layout information so you have it handy during the printing process."*

> *"You must guard against the possibility that the user has changed the page format. If that happens, you must recompute the layout, even if the information that you want to print has not changed."*

**Dịch:** Thách thức lớn nhất khi dùng class `Book` là bạn **phải biết mỗi section sẽ có bao nhiêu trang** khi in nó. Class `Printable` của bạn cần một **thuật toán layout** tính bố cục của nội dung trên các trang in. **Trước khi bắt đầu in**, chạy thuật toán đó để tính **ngắt trang và số trang**. Bạn cũng phải **đề phòng khả năng người dùng đã đổi page format** — khi đó **phải tính lại layout**, kể cả khi thông tin cần in **không thay đổi**.

### Ví dụ: in banner

> *"Listing 11.26 shows how to produce a multipage printout. This program prints a message in very large characters on a number of pages (see Figure 11.63). You can then trim the margins and tape the pages together to form a banner."*

**Dịch:** Chương trình in một dòng chữ bằng **ký tự rất lớn trên nhiều trang**. Sau đó bạn **cắt lề và dán các trang lại thành một băng rôn**.

> *"The layoutPages method of the Banner class computes the layout. We first lay out the message string in a 72-point font. We then compute the height of the resulting string and compare it with the imageable height of the page. We derive a scale factor from these two measurements. When printing the string, we magnify it by that scale factor."*

**Dịch:** Trước hết **dàn chuỗi thông điệp với font 72 point**, rồi tính **chiều cao của chuỗi thu được** và **so với chiều cao imageable của trang**. Từ hai số đo đó **suy ra một hệ số scale**; khi in chuỗi, ta **phóng to nó theo hệ số scale đó**.

> **Caution (sách):** *"To lay out your information precisely, you usually need access to the printer graphics context. Unfortunately, there is no way to obtain that graphics context before printing actually starts. In our example program, we make do with the screen graphics context and hope that the font metrics of the screen and printer match."*
>
> **Dịch:** Để dàn thông tin **chính xác**, thường bạn cần truy cập **graphics context của máy in**. Đáng tiếc, **không có cách nào lấy được graphics context đó trước khi việc in thực sự bắt đầu**. Trong chương trình ví dụ, sách **tạm dùng graphics context của màn hình và hy vọng font metric của màn hình khớp với máy in**.

> *"The getPageCount method of the Banner class first calls the layout method. Then it scales up the width of the string and divides it by the imageable width of each page. The quotient, rounded up to the next integer, is the page count."*

**Dịch:** `getPageCount` gọi method layout trước, rồi **phóng to chiều rộng của chuỗi và chia cho chiều rộng imageable của mỗi trang**. Thương số, **làm tròn lên số nguyên kế tiếp**, chính là số trang.

> *"It sounds like it might be difficult to print the banner because characters can be broken across multiple pages. However, thanks to the power of the Java 2D API, this turns out not to be a problem at all. When a particular page is requested, we simply use the translate method of the Graphics2D class to shift the top left corner of the string to the left. Then, we set a clip rectangle that equals the current page (see Figure 11.64). Finally, we scale the graphics context with the scale factor that the layout method computed."*

**Dịch:** Nghe thì có vẻ khó vì **ký tự có thể bị cắt ngang qua nhiều trang**. Nhưng nhờ sức mạnh của Java 2D API, **hoá ra hoàn toàn không phải vấn đề**: khi một trang cụ thể được yêu cầu, ta chỉ cần dùng `translate` để **dịch góc trên trái của chuỗi sang trái**, rồi **đặt một hình chữ nhật clip bằng đúng trang hiện tại**, cuối cùng **scale graphics context** với hệ số mà method layout đã tính.

> *"This example shows the power of transformations. The drawing code is kept simple, and the transformation does all the work of placing the drawing in the appropriate place. Finally, the clip cuts away the part of the image that falls outside the page. This program shows another compelling use of transformations—to display a print preview."*

**Dịch:** Ví dụ này cho thấy **sức mạnh của transformation**: code vẽ được giữ **đơn giản**, còn transformation **làm hết việc đặt bản vẽ vào đúng chỗ**. Cuối cùng clip **cắt bỏ phần image rơi ra ngoài trang**. Chương trình còn cho thấy một ứng dụng thuyết phục khác của transformation — **hiển thị print preview**.

### Listing 11.26 — `book/Banner.java`

```java
package book;

import java.awt.*;
import java.awt.font.*;
import java.awt.geom.*;
import java.awt.print.*;

/**
 * A banner that prints a text string on multiple pages.
 */
public class Banner implements Printable
{
    private String message;
    private double scale;

    /**
     * Constructs a banner.
     * @param m the message string
     */
    public Banner(String m)
    {
        message = m;
    }

    /**
     * Gets the page count of this section.
     * @param g2 the graphics context
     * @param pf the page format
     * @return the number of pages needed
     */
    public int getPageCount(Graphics2D g2, PageFormat pf)
    {
        if (message.equals("")) return 0;
        FontRenderContext context = g2.getFontRenderContext();
        var f = new Font("Serif", Font.PLAIN, 72);
        Rectangle2D bounds = f.getStringBounds(message, context);
        scale = pf.getImageableHeight() / bounds.getHeight();
        double width = scale * bounds.getWidth();
        int pages = (int) Math.ceil(width / pf.getImageableWidth());
        return pages;
    }

    public int print(Graphics g, PageFormat pf, int page) throws PrinterException
    {
        var g2 = (Graphics2D) g;
        if (page > getPageCount(g2, pf)) return Printable.NO_SUCH_PAGE;
        g2.translate(pf.getImageableX(), pf.getImageableY());
        drawPage(g2, pf, page);
        return Printable.PAGE_EXISTS;
    }

    public void drawPage(Graphics2D g2, PageFormat pf, int page)
    {
        if (message.equals("")) return;
        page--; // account for cover page

        drawCropMarks(g2, pf);
        g2.clip(new Rectangle2D.Double(0, 0, pf.getImageableWidth(), pf.getImageableHeight()));
        g2.translate(-page * pf.getImageableWidth(), 0);
        g2.scale(scale, scale);
        FontRenderContext context = g2.getFontRenderContext();
        var f = new Font("Serif", Font.PLAIN, 72);
        var layout = new TextLayout(message, f, context);
        AffineTransform transform = AffineTransform.getTranslateInstance(0, layout.getAscent());
        Shape outline = layout.getOutline(transform);
        g2.draw(outline);
    }

    /**
     * Draws 1/2" crop marks in the corners of the page.
     * @param g2 the graphics context
     * @param pf the page format
     */
    public void drawCropMarks(Graphics2D g2, PageFormat pf)
    {
        final double C = 36; // crop mark length = 1/2 inch
        double w = pf.getImageableWidth();
        double h = pf.getImageableHeight();
        g2.draw(new Line2D.Double(0, 0, 0, C));
        g2.draw(new Line2D.Double(0, 0, C, 0));
        g2.draw(new Line2D.Double(w, 0, w, C));
        g2.draw(new Line2D.Double(w, 0, w - C, 0));
        g2.draw(new Line2D.Double(0, h, 0, h - C));
        g2.draw(new Line2D.Double(0, h, C, h));
        g2.draw(new Line2D.Double(w, h, w, h - C));
        g2.draw(new Line2D.Double(w, h, w - C, h));
    }
}

/**
 * This class prints a cover page with a title.
 */
class CoverPage implements Printable
{
    private String title;

    /**
     * Constructs a cover page.
     * @param t the title
     */
    public CoverPage(String t)
    {
        title = t;
    }

    public int print(Graphics g, PageFormat pf, int page) throws PrinterException
    {
        if (page >= 1) return Printable.NO_SUCH_PAGE;
        var g2 = (Graphics2D) g;
        g2.setPaint(Color.black);
        g2.translate(pf.getImageableX(), pf.getImageableY());
        FontRenderContext context = g2.getFontRenderContext();
        Font f = g2.getFont();
        var layout = new TextLayout(title, f, context);
        float ascent = layout.getAscent();
        g2.drawString(title, 0, ascent);
        return Printable.PAGE_EXISTS;
    }
}
```

---

## 11.5.3. Print Services

> *"So far, you have seen how to print 2D graphics. However, the printing API introduced in Java SE 1.4 affords far greater flexibility. The API defines a number of data types and lets you find print services that are able to print them. Among the data types are"*
>
> *"• Images in GIF, JPEG, or PNG format"*
> *"• Documents in text, HTML, PostScript, or PDF format"*
> *"• Raw printer code data"*
> *"• Objects of a class that implements Printable, Pageable, or RenderableImage"*

**Dịch:** Printing API giới thiệu ở **Java SE 1.4** cho **linh hoạt hơn nhiều**: API định nghĩa **một loạt kiểu dữ liệu** và cho bạn **tìm ra print service in được chúng**.

> *"The data themselves can be stored in a source of bytes or characters such as an input stream, a URL, or an array. A document flavor describes the combination of a data source and a data type. The DocFlavor class defines a number of inner classes for the various data sources. Each of the inner classes defines constants to specify the flavors. For example, the constant"*

```java
DocFlavor.INPUT_STREAM.GIF
```

> *"describes a GIF image that is read from an input stream."*

**Dịch:** Bản thân dữ liệu **lưu ở một nguồn byte hoặc ký tự** như input stream, URL, hay một mảng. Một **document flavor** mô tả **tổ hợp của một data source và một data type**. Class `DocFlavor` định nghĩa **một loạt inner class cho các data source khác nhau**; mỗi inner class định nghĩa **hằng số** để chỉ định flavor.

> *"Suppose you want to print a GIF image located in a file. First, find out whether there is a print service that is capable of handling the task. The static lookupPrintServices method of the PrintServiceLookup class returns an array of PrintService objects that can handle the given document flavor."*

```java
DocFlavor flavor = DocFlavor.INPUT_STREAM.GIF;
PrintService[] services = PrintServiceLookup.lookupPrintServices(flavor, null);
```

> *"The second parameter of the lookupPrintServices method is null to indicate that we don't want to constrain the search by specifying printer attributes."*

**Dịch:** Parameter thứ hai là `null` để báo rằng ta **không muốn ràng buộc việc tìm kiếm bằng printer attribute**.

> *"If the lookup yields an array with more than one element, select from the listed print services. You can call the getName method of the PrintService class to get the printer names and let the user choose."*

> *"Next, get a document print job from the service:"*

```java
DocPrintJob job = services[i].createPrintJob();
```

> *"For printing, you need an object that implements the Doc interface. The Java library supplies a class SimpleDoc for that purpose. The SimpleDoc constructor requires the data source object, the document flavor, and an optional attribute set. For example,"*

```java
var in = new FileInputStream(fileName);
var doc = new SimpleDoc(in, flavor, null);
```

> *"Finally, you are ready to print:"*

```java
job.print(doc, null);
```

**Dịch:** Để in, bạn cần một object **implement interface `Doc`**. Thư viện Java cung cấp class **`SimpleDoc`** cho mục đích đó. Constructor của `SimpleDoc` cần **object data source, document flavor, và một attribute set tuỳ chọn**.

**Table 11.4 — Document Flavors for Print Services**

| Data Source | Data Type | MIME Type |
|---|---|---|
| `INPUT_STREAM` | `GIF` | `image/gif` |
| `URL` | `JPEG` | `image/jpeg` |
| `BYTE_ARRAY` | `PNG` | `image/png` |
| | `POSTSCRIPT` | `application/postscript` |
| | `PDF` | `application/pdf` |
| | `TEXT_HML_HOST` | `text/html` (using host encoding) |
| | `TEXT_HTML_US_ASCII` | `text/html; charset=us-ascii` |
| | `TEXT_HTML_UTF_8` | `text/html; charset=utf-8` |
| | `TEXT_HTML_UTF_16` | `text/html; charset=utf-16` |
| | `TEXT_HTML_UTF_16LE` | `text/html; charset=utf-16le` (little-endian) |
| | `TEXT_HTML_UTF_16BE` | `text/html; charset=utf-16be` (big-endian) |
| | `TEXT_PLAIN_HOST` | `text/plain` (using host encoding) |
| | `TEXT_PLAIN_US_ASCII` | `text/plain; charset=us-ascii` |
| | `TEXT_PLAIN_UTF_8` | `text/plain; charset=utf-8` |
| | `TEXT_PLAIN_UTF_16` | `text/plain; charset=utf-16` |
| | `TEXT_PLAIN_UTF_16LE` | `text/plain; charset=utf-16le` (little-endian) |
| | `TEXT_PLAIN_UTF_16BE` | `text/plain; charset=utf-16be` (big-endian) |
| | `PCL` | `application/vnd.hp-PCL` (Hewlett Packard Printer Control Language) |
| | `AUTOSENSE` | `application/octet-stream` (raw printer data) |
| `READER` | `TEXT_HTML` | `text/html; charset=utf-16` |
| `STRING` | `TEXT_PLAIN` | `text/plain; charset=utf-16` |
| `CHAR_ARRAY` | | |
| `SERVICE_FORMATTED` | `PRINTABLE` | N/A |
| | `PAGEABLE` | N/A |
| | `RENDERABLE_IMAGE` | N/A |

*Ghi chú: bảng trên bám đúng cách xếp hàng của bản in (trang 794). Cột "Data Source" trong sách chỉ điền ở một số hàng, các hàng còn lại để trống. Tên `TEXT_HML_HOST` là **typo của bản in** (đúng ra là `TEXT_HTML_HOST`) — giữ nguyên theo sách.*

> *"Note that this printing process is quite different from that of the preceding section. There is no user interaction through print dialog boxes. For example, you can implement a server-side printing mechanism in which users submit print jobs through a web form."*

**Dịch:** Quá trình in này **khá khác** với mục trước: **không có tương tác người dùng qua hộp thoại in**. Ví dụ, bạn có thể implement một **cơ chế in phía server** trong đó người dùng **gửi print job qua một web form**.

### API — `javax.print.PrintServiceLookup` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `PrintService[] lookupPrintServices(DocFlavor flavor, AttributeSet attributes)` | tra các print service xử lý được document flavor và attribute đã cho. `attributes` = các printing attribute bắt buộc, hoặc **`null` nếu không xét attribute** |

### API — `javax.print.PrintService` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `DocPrintJob createPrintJob()` | tạo một print job để in một object của class implement interface `Doc`, ví dụ `SimpleDoc` |

### API — `javax.print.DocPrintJob` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `void print(Doc doc, PrintRequestAttributeSet attributes)` | in document đã cho với các attribute đã cho. `attributes` = các printing attribute bắt buộc, hoặc `null` nếu không cần |

### API — `javax.print.SimpleDoc` 1.4

| Constructor | Công dụng (theo sách) |
|---|---|
| `SimpleDoc(Object data, DocFlavor flavor, DocAttributeSet attributes)` | dựng một object `SimpleDoc` in được bằng một `DocPrintJob`. `data` = object chứa dữ liệu in, ví dụ một input stream hoặc một `Printable` · `flavor` = document flavor của dữ liệu in · `attributes` = document attribute, hoặc `null` nếu không cần |

---

## 11.5.4. Stream Print Services

> *"A print service sends print data to a printer. A stream print service generates the same print data but instead sends them to a stream, perhaps for delayed printing or because the print data format can be interpreted by other programs. In particular, if the print data format is PostScript, it may be useful to save the print data to a file because many programs can process PostScript files."*

**Dịch:** Một **print service** gửi dữ liệu in **tới máy in**. Một **stream print service** sinh ra **cùng dữ liệu in đó** nhưng **gửi vào một stream** — có thể để **in trễ** hoặc vì **định dạng dữ liệu in đọc được bởi chương trình khác**.

> *"The Java platform includes a stream print service that can produce PostScript output from images and 2D graphics. You can use that service on all systems, even if there are no local printers."*

**Dịch:** Nền tảng Java có sẵn một stream print service **sinh output PostScript từ image và đồ hoạ 2D**. Dùng được trên **mọi hệ thống, kể cả khi không có máy in cục bộ nào**.

> *"Enumerating stream print services is a bit more tedious than locating regular print services. You need both the DocFlavor of the object to be printed and the MIME type of the stream output. You then get a StreamPrintServiceFactory array of factories."*

```java
DocFlavor flavor = DocFlavor.SERVICE_FORMATTED.PRINTABLE;
String mimeType = "application/postscript";
StreamPrintServiceFactory[] factories
    = StreamPrintServiceFactory.lookupStreamPrintServiceFactories(flavor, mimeType);
```

> *"The StreamPrintServiceFactory class has no methods that would help us distinguish any one factory from another, so we just take factories[0]. We call the getPrintService method with an output stream parameter to get a StreamPrintService object."*

```java
var out = new FileOutputStream(fileName);
StreamPrintService service = factories[0].getPrintService(out);
```

> *"The StreamPrintService class is a subclass of PrintService. To produce a printout, simply follow the steps of the preceding section."*

**Dịch:** Việc liệt kê stream print service **lích kích hơn** một chút so với tìm print service thường: bạn cần **cả `DocFlavor` của object cần in lẫn MIME type của stream output**. Class `StreamPrintServiceFactory` **không có method nào giúp phân biệt factory này với factory khác**, nên sách **cứ lấy `factories[0]`**. Class `StreamPrintService` là **subclass của `PrintService`**.

> *"The program in Listing 11.29 demonstrates how to use a stream print service to print Java 2D shapes to a PostScript file. You can replace the sample drawing code with code that generates any Java 2D shapes and have the shapes converted to PostScript. Then you can easily convert the result to PDF or EPS, using an external tool. (Unfortunately, Java does not support printing to PDF directly.)"*

**Dịch:** Bạn có thể **chuyển kết quả sang PDF hoặc EPS dễ dàng bằng một công cụ bên ngoài**. (**Đáng tiếc, Java không hỗ trợ in thẳng ra PDF.**)

> **Note (sách):** *"In this example, we call a draw method that draws Java 2D shapes onto a Graphics2D object. If you want to draw the surface of a component (for example, a table or tree), use the following code:"*
>
> ```java
> private static int IMAGE_WIDTH = component.getWidth();
> private static int IMAGE_HEIGHT = component.getHeight();
> public static void draw(Graphics2D g2) { component.paint(g2); }
> ```
>
> **Dịch:** Nếu bạn muốn vẽ **bề mặt của một component** (ví dụ một table hay tree), dùng đoạn code trên.

### API — `javax.print.StreamPrintServiceFactory` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `StreamPrintServiceFactory[] lookupStreamPrintServiceFactories(DocFlavor flavor, String mimeType)` | tra các stream print service factory in được document flavor đã cho và sinh ra output stream với MIME type đã cho |
| `StreamPrintService getPrintService(OutputStream out)` | lấy một print service **gửi output in vào output stream đã cho** |

---

## 11.5.5. Printing Attributes

> *"The print service API contains a complex set of interfaces and classes to specify various kinds of attributes. There are four important groups of attributes. The first two specify requests to the printer."*
>
> *"• Print request attributes request particular features for all doc objects in a print job, such as two-sided printing or the paper size."*
> *"• Doc attributes are request attributes that apply only to a single doc object."*
>
> *"The other two attributes contain information about the printer and job status."*
>
> *"• Print service attributes give information about the print service, such as the printer make and model or whether the printer is currently accepting jobs."*
> *"• Print job attributes give information about the status of a particular print job, such as whether the job is already completed."*

**Dịch:** Có **bốn nhóm attribute quan trọng**. Hai nhóm đầu **chỉ định yêu cầu gửi tới máy in**:

| Nhóm | Ý nghĩa |
|---|---|
| **Print request attributes** | yêu cầu tính năng cụ thể cho **mọi doc object trong một print job**, như in hai mặt hay khổ giấy |
| **Doc attributes** | request attribute **chỉ áp cho một doc object duy nhất** |
| **Print service attributes** | thông tin về **print service**, như hiệu và model máy in, hoặc máy in **có đang nhận job hay không** |
| **Print job attributes** | thông tin về **trạng thái của một print job cụ thể**, như job **đã hoàn tất hay chưa** |

> *"To describe the various attributes, there is an interface Attribute with subinterfaces:"*

```
PrintRequestAttribute   DocAttribute   PrintServiceAttribute
PrintJobAttribute       SupportedValuesAttribute
```

> *"Individual attribute classes implement one or more of these interfaces. For example, objects of the Copies class describe the number of copies of a printout. That class implements both the PrintRequestAttribute and the PrintJobAttribute interfaces. Clearly, a print request can contain a request for multiple copies. Conversely, an attribute of the print job might be how many of these copies were actually printed. That number might be lower, perhaps because of printer limitations or because the printer ran out of paper."*

**Dịch:** Ví dụ, object của class `Copies` mô tả **số bản sao của một bản in**; class đó implement **cả `PrintRequestAttribute` lẫn `PrintJobAttribute`**. Rõ ràng một print request **có thể yêu cầu nhiều bản**; ngược lại, một attribute của print job có thể là **bao nhiêu bản trong số đó thực sự được in ra** — con số này **có thể thấp hơn**, có lẽ vì **giới hạn của máy in** hoặc vì **máy in hết giấy**.

> *"The SupportedValuesAttribute interface indicates that an attribute value does not reflect actual request or status data but rather the capability of a service. For example, the CopiesSupported class implements the SupportedValuesAttribute interface. An object of that class might describe that a printer supports 1 through 99 copies of a printout."*

**Dịch:** Interface `SupportedValuesAttribute` báo rằng giá trị attribute **không phản ánh dữ liệu yêu cầu hay trạng thái thực tế**, mà là **khả năng của một service**.

### Attribute set

> *"In addition to the interfaces and classes for individual attributes, the print service API defines interfaces and classes for attribute sets. A superinterface, AttributeSet, has four subinterfaces:"*

```
PrintRequestAttributeSet   DocAttributeSet
PrintServiceAttributeSet   PrintJobAttributeSet
```

> *"Each of these interfaces has an implementing class, yielding the five classes:"*

```
HashAttributeSet              HashPrintRequestAttributeSet
HashDocAttributeSet           HashPrintServiceAttributeSet
HashPrintJobAttributeSet
```

> *"For example, you can construct a print request attribute set like this:"*

```java
var attributes = new HashPrintRequestAttributeSet();
```

> *"After constructing the set, you are freed from worrying about the Hash prefix."*

**Dịch:** Sau khi dựng set xong, bạn **không phải bận tâm tới tiền tố `Hash`** nữa.

> *"Why have all these interfaces? They make it possible to check for correct attribute usage. For example, a DocAttributeSet accepts only objects that implement the DocAttribute interface. Any attempt to add another attribute results in a runtime error."*

**Dịch:** Vì sao cần nhiều interface đến vậy? Chúng **cho phép kiểm tra việc dùng attribute đúng cách**: ví dụ một `DocAttributeSet` **chỉ nhận object implement interface `DocAttribute`**; **mọi cố gắng thêm attribute khác đều gây lỗi runtime**.

### Category

> *"An attribute set is a specialized kind of map where the keys are of type Class and the values belong to a class that implements the Attribute interface. For example, if you insert an object"*

```java
new Copies(10)
```

> *"into an attribute set, then its key is the Class object Copies.class. That key is called the category of the attribute. The Attribute interface declares a method"*

```java
Class getCategory()
```

> *"that returns the category of an attribute. The Copies class defines the method to return the object Copies.class, but it isn't a requirement that the category be the same as the class of the attribute."*

**Dịch:** Một attribute set là **một dạng map đặc biệt** trong đó **key có kiểu `Class`** và **value thuộc một class implement interface `Attribute`**. Key đó gọi là **category** của attribute. Class `Copies` định nghĩa method trả về object `Copies.class`, nhưng **không bắt buộc category phải trùng với class của attribute**. (Về map, xem [[03 - Concrete Collections]].)

> *"When an attribute is added to an attribute set, the category is extracted automatically. Just add the attribute value:"*

```java
attributes.add(new Copies(10));
```

> *"If you subsequently add another attribute with the same category, it overwrites the first one."*

> *"To retrieve an attribute, you need to use the category as the key, for example:"*

```java
AttributeSet attributes = job.getAttributes();
var copies = (Copies) attribute.get(Copies.class);
```

**Dịch:** Khi thêm attribute vào set, **category được trích ra tự động**. Nếu sau đó bạn **thêm một attribute khác cùng category thì nó ghi đè cái đầu tiên**. Để lấy attribute ra, **dùng category làm key**.

### Cách tổ chức theo giá trị

> *"Finally, attributes are organized by the values they can have. The Copies attribute can have any integer value. The Copies class extends the IntegerSyntax class that takes care of all integer-valued attributes. The getValue method returns the integer value of the attribute, for example:"*

```java
int n = copies.getValue();
```

> *"The classes TextSyntax, DateTimeSyntax, URISyntax encapsulate a string, a date and time value, or a URI."*

**Dịch:** Attribute còn được **tổ chức theo loại giá trị chúng có thể mang**. `Copies` mang **giá trị nguyên bất kỳ** và extend class `IntegerSyntax` — class lo mọi attribute giá trị nguyên. Các class `TextSyntax`, `DateTimeSyntax`, `URISyntax` **gói một string, một giá trị ngày giờ, hoặc một URI**.

> *"Finally, many attributes can take a finite number of values. For example, the PrintQuality attribute has three settings: draft, normal, and high. They are represented by three constants:"*

```java
PrintQuality.DRAFT
PrintQuality.NORMAL
PrintQuality.HIGH
```

> *"Attribute classes with a finite number of values extend the EnumSyntax class, which provides a number of convenience methods to set up these enumerations in a typesafe manner. You need not worry about the mechanism when using such an attribute. Simply add the named values to attribute sets:"*

```java
attributes.add(PrintQuality.HIGH);
```

> *"Here is how you check the value of an attribute:"*

```java
if (attributes.get(PrintQuality.class) == PrintQuality.HIGH)
    . . .
```

**Dịch:** Các class attribute có **số giá trị hữu hạn** extend class **`EnumSyntax`**, cung cấp một loạt convenience method để **dựng các enumeration này một cách an toàn kiểu (typesafe)**. Bạn **không cần bận tâm tới cơ chế** khi dùng attribute như vậy.

### Table 11.5 — Printing Attributes

> *"Table 11.5 lists the printing attributes. The second column lists the superclass of the attribute class (for example, IntegerSyntax for the Copies attribute) or the set of enumeration values for the attributes with a finite set of values. The last four columns indicate whether the attribute class implements the DocAttribute (DA), PrintJobAttribute (PJA), PrintRequestAttribute (PRA), and PrintServiceAttribute (PSA) interfaces."*

**Dịch:** Cột thứ hai liệt kê **superclass của class attribute** (ví dụ `IntegerSyntax` cho attribute `Copies`) hoặc **tập giá trị enumeration** với các attribute có tập giá trị hữu hạn.

*DA = `DocAttribute`, PJA = `PrintJobAttribute`, PRA = `PrintRequestAttribute`, PSA = `PrintServiceAttribute`. Dấu ✔ = class attribute đó implement interface tương ứng (theo bản in trang 803–806).*

| Attribute | Superclass hoặc Enumeration Constants | DA | PJA | PRA | PSA |
|---|---|:-:|:-:|:-:|:-:|
| `Chromaticity` | `MONOCHROME`, `COLOR` | ✔ | ✔ | ✔ | |
| `ColorSupported` | `SUPPORTED`, `NOT_SUPPORTED` | | | | ✔ |
| `Compression` | `COMPRESS`, `DEFLATE`, `GZIP`, `NONE` | ✔ | | | |
| `Copies` | `IntegerSyntax` | | ✔ | ✔ | |
| `DateTimeAtCompleted` | `DateTimeSyntax` | | ✔ | | |
| `DateTimeAtCreation` | `DateTimeSyntax` | | ✔ | | |
| `DateTimeAtProcessing` | `DateTimeSyntax` | | ✔ | | |
| `Destination` | `URISyntax` | | ✔ | ✔ | |
| `DocumentName` | `TextSyntax` | ✔ | | | |
| `Fidelity` | `FIDELITY_TRUE`, `FIDELITY_FALSE` | | ✔ | ✔ | |
| `Finishings` | `NONE`, `STAPLE`, `EDGE_STITCH`, `BIND`, `SADDLE_STITCH`, `COVER`, … | ✔ | ✔ | ✔ | |
| `JobHoldUntil` | `DateTimeSyntax` | | ✔ | ✔ | |
| `JobImpressions` | `IntegerSyntax` | | ✔ | ✔ | |
| `JobImpressionsCompleted` | `IntegerSyntax` | | ✔ | | |
| `JobKOctets` | `IntegerSyntax` | | ✔ | ✔ | |
| `JobKOctetsProcessed` | `IntegerSyntax` | | ✔ | | |
| `JobMediaSheets` | `IntegerSyntax` | | ✔ | ✔ | |
| `JobMediaSheetsCompleted` | `IntegerSyntax` | | ✔ | | |
| `JobMessageFromOperator` | `TextSyntax` | | ✔ | | |
| `JobName` | `TextSyntax` | | ✔ | ✔ | |
| `JobOriginatingUserName` | `TextSyntax` | | ✔ | | |
| `JobPriority` | `IntegerSyntax` | | ✔ | ✔ | |
| `JobSheets` | `STANDARD`, `NONE` | | ✔ | ✔ | |
| `JobState` | `ABORTED`, `CANCELED`, `COMPLETED`, `PENDING`, `PENDING_HELD`, `PROCESSING`, `PROCESSING_STOPPED` | | ✔ | | |
| `JobStateReason` | `ABORTED_BY_SYSTEM`, `DOCUMENT_FORMAT_ERROR`, many others | | | | |
| `JobStateReasons` | `HashSet` | | ✔ | | |
| `MediaName` | `ISO_A4_WHITE`, `ISO_A4_TRANSPARENT`, `NA_LETTER_WHITE`, `NA_LETTER_TRANSPARENT` | ✔ | ✔ | ✔ | |
| `MediaSize` | `ISO.A0`–`ISO.A10`, `ISO.B0`–`ISO.B10`, `ISO.C0`–`ISO.C10`, `NA.LETTER`, `NA.LEGAL`, various other paper and envelope sizes | | | | |
| `MediaSizeName` | `ISO_A0`–`ISO_A10`, `ISO_B0`–`ISO_B10`, `ISO_C0`–`ISO_C10`, `NA_LETTER`, `NA_LEGAL`, various other paper and envelope size names | ✔ | ✔ | ✔ | |
| `MediaTray` | `TOP`, `MIDDLE`, `BOTTOM`, `SIDE`, `ENVELOPE`, `LARGE_CAPACITY`, `MAIN`, `MANUAL` | ✔ | ✔ | ✔ | |
| `MultipleDocumentHandling` | `SINGLE_DOCUMENT`, `SINGLE_DOCUMENT_NEW_SHEET`, `SEPARATE_DOCUMENTS_COLLATED_COPIES`, `SEPARATE_DOCUMENTS_UNCOLLATED_COPIES` | | ✔ | ✔ | |
| `NumberOfDocuments` | `IntegerSyntax` | | ✔ | | |
| `NumberOfInterveningJobs` | `IntegerSyntax` | | ✔ | | |
| `NumberUp` | `IntegerSyntax` | ✔ | ✔ | ✔ | |
| `OrientationRequested` | `PORTRAIT`, `LANDSCAPE`, `REVERSE_PORTRAIT`, `REVERSE_LANDSCAPE` | ✔ | ✔ | ✔ | |
| `OutputDeviceAssigned` | `TextSyntax` | | ✔ | | |
| `PageRanges` | `SetOfInteger` | ✔ | ✔ | ✔ | |
| `PagesPerMinute` | `IntegerSyntax` | | | | ✔ |
| `PagesPerMinuteColor` | `IntegerSyntax` | | | | ✔ |
| `PDLOverrideSupported` | `ATTEMPTED`, `NOT_ATTEMPTED` | | | | ✔ |
| `PresentationDirection` | `TORIGHT_TOBOTTOM`, `TORIGHT_TOTOP`, `TOBOTTOM_TORIGHT`, `TOBOTTOM_TOLEFT`, `TOLEFT_TOBOTTOM`, `TOLEFT_TOTOP`, `TOTOP_TORIGHT`, `TOTOP_TOLEFT` | | ✔ | ✔ | |
| `PrinterInfo` | `TextSyntax` | | | | ✔ |
| `PrinterIsAcceptingJobs` | `ACCEPTING_JOBS`, `NOT_ACCEPTING_JOBS` | | | | ✔ |
| `PrinterLocation` | `TextSyntax` | | | | ✔ |
| `PrinterMakeAndModel` | `TextSyntax` | | | | ✔ |
| `PrinterMessageFromOperator` | `TextSyntax` | | | | ✔ |
| `PrinterMoreInfo` | `URISyntax` | | | | ✔ |
| `PrinterMoreInfoManufacturer` | `URISyntax` | | | | ✔ |
| `PrinterName` | `TextSyntax` | | | | ✔ |
| `PrinterResolution` | `ResolutionSyntax` | ✔ | ✔ | ✔ | |
| `PrinterState` | `PROCESSING`, `IDLE`, `STOPPED`, `UNKNOWN` | | | | ✔ |
| `PrinterStateReason` | `COVER_OPEN`, `FUSER_OVER_TEMP`, `MEDIA_JAM`, and many others | | | | |
| `PrinterStateReasons` | `HashMap` | | | | |
| `PrinterURI` | `URISyntax` | | | | ✔ |
| `PrintQuality` | `DRAFT`, `NORMAL`, `HIGH` | ✔ | ✔ | ✔ | |
| `QueuedJobCount` | `IntegerSyntax` | | | | ✔ |
| `ReferenceUriSchemesSupported` | `FILE`, `FTP`, `GOPHER`, `HTTP`, `HTTPS`, `NEWS`, `NNTP`, `WAIS` | | | | |
| `RequestingUserName` | `TextSyntax` | | | ✔ | |
| `Severity` | `ERROR`, `REPORT`, `WARNING` | | | | |
| `SheetCollate` | `COLLATED`, `UNCOLLATED` | ✔ | ✔ | ✔ | |
| `Sides` | `ONE_SIDED`, `DUPLEX` (= `TWO_SIDED_LONG_EDGE`), `TUMBLE` (= `TWO_SIDED_SHORT_EDGE`) | ✔ | ✔ | ✔ | |

> **Note (sách):** *"As you can see, there are lots of attributes, many of which are quite specialized. The source for most of the attributes is the Internet Printing Protocol 1.1 (RFC 2911)."*
>
> **Dịch:** Có **rất nhiều attribute**, phần lớn **khá chuyên biệt**. Nguồn của hầu hết attribute là **Internet Printing Protocol 1.1 (RFC 2911)**.

> **Note (sách):** *"An earlier version of the printing API introduced the JobAttributes and PageAttributes classes, whose purpose was similar to the printing attributes covered in this section. These classes are now obsolete."*
>
> **Dịch:** Một phiên bản trước của printing API từng giới thiệu class `JobAttributes` và `PageAttributes` với mục đích tương tự. **Các class này nay đã lỗi thời.**

### API — `javax.print.attribute.Attribute` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `Class getCategory()` | lấy **category** của attribute này |
| `String getName()` | lấy tên của attribute này |

### API — `javax.print.attribute.AttributeSet` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `boolean add(Attribute attr)` | thêm một attribute vào set này. Nếu set **đã có attribute khác cùng category** thì attribute đó **bị thay thế**. Trả về `true` nếu set thay đổi do thao tác này |
| `Attribute get(Class category)` | lấy attribute có category key đã cho, hoặc **`null`** nếu không có |
| `boolean remove(Attribute attr)` · `boolean remove(Class category)` | gỡ attribute đã cho, hoặc attribute có category đã cho, khỏi set. Trả về `true` nếu set thay đổi |
| `Attribute[] toArray()` | trả về một mảng chứa mọi attribute trong set này |

### API — `javax.print.PrintService` 1.4 (attributes)

| Method | Công dụng (theo sách) |
|---|---|
| `PrintServiceAttributeSet getAttributes()` | lấy các attribute của print service này |

### API — `javax.print.DocPrintJob` 1.4 (attributes)

| Method | Công dụng (theo sách) |
|---|---|
| `PrintJobAttributeSet getAttributes()` | lấy các attribute của print job này |

---

## Chương kế tiếp

> *"You have now reached the end of this long chapter covering advanced Swing and AWT features. In the final chapter, we will turn to a different aspect of Java programming: interacting, on the same machine, with "native" code in a different programming language."*

**Dịch:** Bạn vừa kết thúc **chương dài** về các tính năng Swing và AWT nâng cao. Ở chương cuối, sách chuyển sang **một khía cạnh khác của lập trình Java**: tương tác, **trên cùng một máy**, với **code "native" viết bằng ngôn ngữ lập trình khác**.

→ [[01 - Calling a C Function from a Java Program]]
