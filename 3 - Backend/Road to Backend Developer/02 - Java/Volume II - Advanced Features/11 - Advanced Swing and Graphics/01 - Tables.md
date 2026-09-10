# 01 — Tables

> Chapter 11, Section 11.1 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.1. Tables

> *"The JTable component displays a two-dimensional grid of objects. Tables are common in user interfaces, and the Swing team has put a lot of effort into the table control. Tables are inherently complex, but—perhaps more successfully than other Swing classes—the JTable component hides much of that complexity. You can produce fully functional tables with rich behavior by writing a few lines of code. You can also write more code and customize the display and behavior for your specific applications."*

**Dịch:** Component `JTable` hiển thị một **lưới object hai chiều**. Table rất phổ biến trong user interface, và nhóm Swing đã bỏ nhiều công sức vào control này. Table **vốn dĩ phức tạp**, nhưng — có lẽ thành công hơn các class Swing khác — component `JTable` **giấu đi phần lớn sự phức tạp đó**. Bạn tạo được table đầy đủ chức năng với hành vi phong phú chỉ bằng **vài dòng code**. Bạn cũng viết được nhiều code hơn để **tuỳ biến** cách hiển thị và hành vi cho ứng dụng cụ thể của mình.

> *"In the following sections, we will explain how to make simple tables, how the user interacts with them, and how to make some of the most common adjustments. As with the other complex Swing controls, it is impossible to cover all aspects in complete detail. For more information, look in Graphic Java™, Third Edition, by David M. Geary (Prentice Hall, 1999), or Core Swing by Kim Topley (Prentice Hall, 1999)."*

**Dịch:** Các mục sau sẽ giải thích cách tạo table đơn giản, cách người dùng tương tác với chúng, và cách thực hiện vài điều chỉnh thông dụng nhất. Cũng như các Swing control phức tạp khác, **không thể trình bày hết mọi khía cạnh**. Muốn biết thêm, xem *Graphic Java™, Third Edition* (David M. Geary, Prentice Hall, 1999) hoặc *Core Swing* (Kim Topley, Prentice Hall, 1999).

---

## 11.1.1. A Simple Table

> *"A JTable does not store its own data but obtains them from a table model. The JTable class has a constructor that wraps a two-dimensional array of objects into a default model. That is the strategy that we use in our first example; later in this chapter, we will turn to table models."*

**Dịch:** `JTable` **không tự lưu data của nó** mà lấy data từ một **table model**. Class `JTable` có một constructor **bọc một mảng object hai chiều** vào một model mặc định. Đó là chiến lược dùng trong ví dụ đầu tiên; phần sau của chương sẽ nói về table model.

> *"As you can see from the code in Listing 11.1, the data of the table is stored as a two-dimensional array of Object values:"*

```java
Object[][] cells =
{
    { "Mercury", 2440.0, 0, false, Color.YELLOW },
    { "Venus", 6052.0, 0, false, Color.YELLOW },
    . . .
}
```

**Dịch:** Data của table được lưu dưới dạng **mảng hai chiều các giá trị `Object`**.

> **Note (sách):** *"Here, we take advantage of autoboxing. The entries in the second, third, and fourth columns are automatically converted into objects of type Double, Integer, and Boolean."*
>
> **Dịch:** Ở đây ta tận dụng **autoboxing**. Các entry ở cột thứ hai, ba, tư **tự động được chuyển** thành object kiểu `Double`, `Integer`, `Boolean`.

> *"The table simply invokes the toString method on each object to display it. That's why the colors show up as java.awt.Color[r=. . .,g=. . .,b=. . .]."*

**Dịch:** Table **chỉ gọi method `toString`** lên từng object để hiển thị. Vì thế màu hiện ra dưới dạng `java.awt.Color[r=...,g=...,b=...]`.

> *"Supply the column names in a separate array of strings:"*

```java
String[] columnNames = { "Planet", "Radius", "Moons", "Gaseous", "Color" };
```

> *"Then, construct a table from the cell and column name arrays:"*

```java
var table = new JTable(cells, columnNames);
```

> *"You can add scroll bars in the usual way—by wrapping the table in a JScrollPane:"*

```java
var pane = new JScrollPane(table);
```

> *"When you scroll the table, the table header doesn't scroll out of view."*

**Dịch:** Tên cột đưa vào trong **một mảng string riêng**, rồi dựng table từ mảng cell và mảng tên cột. Thêm scroll bar theo cách thông thường — **bọc table vào một `JScrollPane`**. Khi cuộn table, **table header không bị cuộn khuất đi**.

### Kéo cột, đổi kích thước cột, chọn dòng, sửa cell

> *"Next, click on one of the column headers and drag it to the left or right. See how the entire column becomes detached (see Figure 11.2). You can drop it in a different location. This rearranges the columns in the view only. The data model is not affected."*

**Dịch:** Bấm vào một column header rồi kéo sang trái hoặc phải: **cả cột tách rời ra**, thả được ở vị trí khác. Việc này **chỉ sắp xếp lại cột ở phần view**. **Data model không bị ảnh hưởng.**

> *"To resize columns, simply place the cursor between two columns until the cursor shape changes to an arrow. Then, drag the column boundary to the desired place (see Figure 11.3)."*

**Dịch:** Đổi kích thước cột: đặt con trỏ **giữa hai cột** cho tới khi hình con trỏ đổi thành mũi tên, rồi kéo đường ranh giới cột tới chỗ mong muốn.

> *"Users can select rows by clicking anywhere in a row. The selected rows are highlighted; you will see later how to get selection events. Users can also edit the table entries by clicking on a cell and typing into it. However, in this code example, the edits do not change the underlying data. In your programs, you should either make cells uneditable or handle cell editing events and update your model. We will discuss those topics later in this section."*

**Dịch:** Người dùng chọn dòng bằng cách bấm **bất kỳ đâu trong dòng**. Dòng được chọn sẽ được tô sáng. Người dùng cũng **sửa được entry** của table bằng cách bấm vào một cell và gõ. Tuy nhiên, trong ví dụ này **các sửa đổi không làm thay đổi data nền**. Trong chương trình của bạn, hoặc **làm cho cell không sửa được**, hoặc **xử lý event sửa cell và cập nhật model**.

### Sắp xếp và in

> *"Finally, click on a column header. The rows are automatically sorted. Click again, and the sort order is reversed. This behavior is activated by the call"*

```java
table.setAutoCreateRowSorter(true);
```

> *"You can print a table with the call"*

```java
table.print();
```

**Dịch:** Bấm vào một column header thì **các dòng tự động được sắp xếp**; bấm lần nữa thì **đảo thứ tự**. Hành vi này được bật bằng `setAutoCreateRowSorter(true)`. In table bằng `table.print()`.

> **Caution (sách):** *"If you don't wrap a table into a scroll pane, you need to explicitly add the header:"*
>
> ```java
> add(table.getTableHeader(), BorderLayout.NORTH);
> ```
>
> **Dịch:** Nếu **không** bọc table vào scroll pane thì bạn phải **thêm header một cách tường minh**.

### Listing 11.1 — `table/TableTest.java`

```java
package table;

import java.awt.*;
import java.awt.print.*;

import javax.swing.*;

/**
 * This program demonstrates how to show a simple table.
 * @version 1.14 2018-05-01
 * @author Cay Horstmann
 */
public class TableTest
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new PlanetTableFrame();
            frame.setTitle("TableTest");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * This frame contains a table of planet data.
 */
class PlanetTableFrame extends JFrame
{
    private String[] columnNames = { "Planet", "Radius", "Moons", "Gaseous", "Color" };
    private Object[][] cells =
    {
        { "Mercury", 2440.0, 0, false, Color.YELLOW },
        { "Venus", 6052.0, 0, false, Color.YELLOW },
        { "Earth", 6378.0, 1, false, Color.BLUE },
        { "Mars", 3397.0, 2, false, Color.RED },
        { "Jupiter", 71492.0, 16, true, Color.ORANGE },
        { "Saturn", 60268.0, 18, true, Color.ORANGE },
        { "Uranus", 25559.0, 17, true, Color.BLUE },
        { "Neptune", 24766.0, 8, true, Color.BLUE },
        { "Pluto", 1137.0, 1, false, Color.BLACK }
    };

    public PlanetTableFrame()
    {
        var table = new JTable(cells, columnNames);
        table.setAutoCreateRowSorter(true);
        add(new JScrollPane(table), BorderLayout.CENTER);
        var printButton = new JButton("Print");
        printButton.addActionListener(event ->
        {
            try { table.print(); }
            catch (SecurityException | PrinterException ex) { ex.printStackTrace(); }
        });
        var buttonPanel = new JPanel();
        buttonPanel.add(printButton);
        add(buttonPanel, BorderLayout.SOUTH);
        pack();
    }
}
```

### API — `javax.swing.JTable` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `JTable(Object[][] entries, Object[] columnNames)` | dựng table với một table model mặc định |
| `void print()` *(5.0)* | hiện hộp thoại in và in table |
| `boolean getAutoCreateRowSorter()` / `void setAutoCreateRowSorter(boolean newValue)` *(6)* | lấy/đặt property `autoCreateRowSorter`. Mặc định `false`. Khi bật, một row sorter mặc định tự được đặt mỗi khi model thay đổi |
| `boolean getFillsViewportHeight()` / `void setFillsViewportHeight(boolean newValue)` *(6)* | lấy/đặt property `fillsViewportHeight`. Mặc định `false`. Khi bật, table **luôn lấp đầy viewport bao quanh** |

---

## 11.1.2. Table Models

> *"In the preceding example, the table data were stored in a two-dimensional array. However, you should generally not use that strategy in your own code. Instead of dumping data into an array to display it as a table, consider implementing your own table model."*

**Dịch:** Ở ví dụ trước, data của table được lưu trong mảng hai chiều. Tuy nhiên **nói chung bạn không nên dùng chiến lược đó** trong code của mình. Thay vì đổ data vào một mảng để hiển thị thành table, hãy cân nhắc **tự implement table model của mình**.

> *"Table models are particularly simple to implement because you can take advantage of the AbstractTableModel class that implements most of the required methods. You only need to supply three methods:"*

```java
public int getRowCount();
public int getColumnCount();
public Object getValueAt(int row, int column);
```

**Dịch:** Table model **đặc biệt dễ implement** vì bạn tận dụng được class `AbstractTableModel` — nó đã implement gần hết các method cần thiết. Bạn **chỉ cần cung cấp ba method** trên.

> *"There are many ways of implementing the getValueAt method. For example, if you want to display the contents of a RowSet that contains the result of a database query, simply provide this method:"*

```java
public Object getValueAt(int r, int c)
{
    try
    {
        rowSet.absolute(r + 1);
        return rowSet.getObject(c + 1);
    }
    catch (SQLException e)
    {
        e.printStackTrace();
        return null;
    }
}
```

**Dịch:** Có **nhiều cách** implement `getValueAt`. Ví dụ, muốn hiển thị nội dung một `RowSet` chứa kết quả một truy vấn database thì chỉ cần cung cấp method như trên.

> *"Our sample program is even simpler. We construct a table that shows some computed values—namely, the growth of an investment under different interest rate scenarios (see Figure 11.4). The getValueAt method computes the appropriate value and formats it:"*

```java
public Object getValueAt(int r, int c)
{
    double rate = (c + minRate) / 100.0;
    int nperiods = r;
    double futureBalance = INITIAL_BALANCE * Math.pow(1 + rate, nperiods);
    return String.format("%.2f", futureBalance);
}
```

**Dịch:** Chương trình ví dụ còn đơn giản hơn: dựng một table hiển thị **các giá trị tính toán** — cụ thể là mức tăng trưởng của một khoản đầu tư theo các kịch bản lãi suất khác nhau. Method `getValueAt` **tính giá trị tương ứng rồi format nó**.

> *"The getRowCount and getColumnCount methods simply return the number of rows and columns:"*

```java
public int getRowCount() { return years; }
public int getColumnCount() { return maxRate - minRate + 1; }
```

> *"If you don't supply column names, the getColumnName method of the AbstractTableModel names the columns A, B, C, and so on. To change the default column names, override the getColumnName method. In this example, we simply label each column with the interest rate."*

```java
public String getColumnName(int c) { return (c + minRate) + "%"; }
```

**Dịch:** Nếu **không cung cấp tên cột**, method `getColumnName` của `AbstractTableModel` sẽ đặt tên cột là **A, B, C, …**. Muốn đổi tên cột mặc định thì **override `getColumnName`**.

### Listing 11.2 — `tableModel/InvestmentTable.java`

```java
package tableModel;

import java.awt.*;

import javax.swing.*;
import javax.swing.table.*;

/**
 * This program shows how to build a table from a table model.
 * @version 1.04 2018-05-01
 * @author Cay Horstmann
 */
public class InvestmentTable
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new InvestmentTableFrame();
            frame.setTitle("InvestmentTable");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * This frame contains the investment table.
 */
class InvestmentTableFrame extends JFrame
{
    public InvestmentTableFrame()
    {
        var model = new InvestmentTableModel(30, 5, 10);
        var table = new JTable(model);
        add(new JScrollPane(table));
        pack();
    }
}

/**
 * This table model computes the cell entries each time they are requested. The table contents
 * shows the growth of an investment for a number of years under different interest rates.
 */
class InvestmentTableModel extends AbstractTableModel
{
    private static double INITIAL_BALANCE = 100000.0;

    private int years;
    private int minRate;
    private int maxRate;

    /**
     * Constructs an investment table model.
     * @param y the number of years
     * @param r1 the lowest interest rate to tabulate
     * @param r2 the highest interest rate to tabulate
     */
    public InvestmentTableModel(int y, int r1, int r2)
    {
        years = y;
        minRate = r1;
        maxRate = r2;
    }

    public int getRowCount()
    {
        return years;
    }

    public int getColumnCount()
    {
        return maxRate - minRate + 1;
    }

    public Object getValueAt(int r, int c)
    {
        double rate = (c + minRate) / 100.0;
        int nperiods = r;
        double futureBalance = INITIAL_BALANCE * Math.pow(1 + rate, nperiods);
        return String.format("%.2f", futureBalance);
    }

    public String getColumnName(int c)
    {
        return (c + minRate) + "%";
    }
}
```

### API — `javax.swing.table.TableModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `int getRowCount()` / `int getColumnCount()` | lấy số dòng và số cột trong table model |
| `Object getValueAt(int row, int column)` | lấy giá trị tại dòng và cột đã cho |
| `void setValueAt(Object newValue, int row, int column)` | đặt giá trị mới tại dòng và cột đã cho |
| `boolean isCellEditable(int row, int column)` | trả về `true` nếu cell tại dòng/cột đó **sửa được** |
| `String getColumnName(int column)` | lấy tiêu đề cột |

---

## 11.1.3. Working with Rows and Columns

> *"In this subsection, you will see how to manipulate the rows and columns in a table. As you read through this material, keep in mind that a Swing table is quite asymmetric—the operations that you can carry out on rows and columns are different. The table component was optimized to display rows of information with the same structure, such as the result of a database query, not an arbitrary two-dimensional grid of objects. You will see this asymmetry throughout this subsection."*

**Dịch:** Hãy ghi nhớ rằng table trong Swing **khá bất đối xứng** — các thao tác làm được trên dòng và trên cột là **khác nhau**. Component table được tối ưu để hiển thị **các dòng thông tin có cùng cấu trúc**, ví dụ kết quả một truy vấn database, **chứ không phải một lưới object hai chiều tuỳ ý**. Sự bất đối xứng này xuất hiện xuyên suốt mục này.

### 11.1.3.1. Column Classes

> *"In the next example, we again display our planet data, but this time we want to give the table more information about the column types. This is achieved by defining the method"*

```java
Class<?> getColumnClass(int columnIndex)
```

> *"of the table model to return the class that describes the column type. The JTable class uses this information to pick an appropriate renderer for the class. Table 11.1 shows the default rendering actions."*

**Dịch:** Lần này ta muốn **cho table biết thêm về kiểu của các cột**. Làm được bằng cách định nghĩa method `getColumnClass` của table model để nó **trả về class mô tả kiểu của cột**. Class `JTable` dùng thông tin này để **chọn renderer phù hợp** cho class đó.

**Table 11.1 — Default Rendering Actions**

| Type | Rendered As |
|---|---|
| `Boolean` | Checkbox |
| `Icon` | Image |
| `Object` | String |

> *"To render other types, you can install a custom renderer—see Section 11.1.4, "Cell Rendering and Editing.""*

**Dịch:** Muốn render các kiểu khác thì **cài một custom renderer** — xem mục 11.1.4.

### 11.1.3.2. Accessing Table Columns

> *"The JTable class stores information about table columns in objects of type TableColumn. A TableColumnModel object manages the columns. (Figure 11.6 shows the relationships among the most important table classes.) If you don't want to insert or remove columns dynamically, you won't use the column model much. The most common use for the column model is simply to get a TableColumn object:"*

```java
int columnIndex = . . .;
TableColumn column = table.getColumnModel().getColumn(columnIndex);
```

**Dịch:** Class `JTable` lưu thông tin về các cột trong object kiểu `TableColumn`. Một object `TableColumnModel` **quản lý các cột**. Nếu bạn không cần chèn hay gỡ cột một cách động thì **ít dùng tới column model**. Công dụng phổ biến nhất của column model đơn giản là **lấy ra một object `TableColumn`**.

### 11.1.3.3. Resizing Columns

> *"The TableColumn class gives you control over the resizing behavior of columns. You can set the preferred, minimum, and maximum width with the methods"*

```java
void setPreferredWidth(int width)
void setMinWidth(int width)
void setMaxWidth(int width)
```

> *"This information is used by the table component to lay out the columns. Use the method"*

```java
void setResizable(boolean resizable)
```

> *"to control whether the user is allowed to resize the column. You can programmatically resize a column with the method"*

```java
void setWidth(int width)
```

**Dịch:** Class `TableColumn` cho bạn **kiểm soát hành vi resize** của cột: đặt được **preferred / minimum / maximum width**. Thông tin này được component table dùng để **bố trí các cột**. `setResizable` kiểm soát việc người dùng **có được phép resize cột hay không**. `setWidth` resize cột **bằng chương trình**.

> *"When a column is resized, the default is to leave the total size of the table unchanged. Of course, the width increase or decrease of the resized column must then be distributed over other columns. The default behavior is to change the size of all columns to the right of the resized column. That's a good default because it allows a user to adjust all columns to a desired width, moving from left to right."*

**Dịch:** Khi một cột được resize, mặc định là **giữ nguyên tổng kích thước của table**. Phần tăng/giảm chiều rộng của cột đó phải được **phân bổ sang các cột khác**. Hành vi mặc định là **đổi kích thước mọi cột nằm bên phải** cột vừa resize. Đó là mặc định tốt vì cho phép người dùng chỉnh mọi cột về chiều rộng mong muốn, **đi từ trái sang phải**.

> *"You can set another behavior from Table 11.2 by using the method"*

```java
void setAutoResizeMode(int mode)
```

**Table 11.2 — Resize Modes**

| Mode | Behavior |
|---|---|
| `AUTO_RESIZE_OFF` | Không resize cột khác; đổi chiều rộng của table |
| `AUTO_RESIZE_NEXT_COLUMN` | Chỉ resize cột kế tiếp |
| `AUTO_RESIZE_SUBSEQUENT_COLUMNS` | Resize đều mọi cột phía sau; **đây là hành vi mặc định** |
| `AUTO_RESIZE_LAST_COLUMN` | Chỉ resize cột cuối |
| `AUTO_RESIZE_ALL_COLUMNS` | Resize mọi cột trong table; **không phải lựa chọn tốt** vì nó ngăn người dùng chỉnh nhiều cột về kích thước mong muốn |

### 11.1.3.4. Resizing Rows

> *"Row heights are managed directly by the JTable class. If your cells are taller than the default, you may want to set the row height:"*

```java
table.setRowHeight(height);
```

> *"By default, all rows of the table have the same height. You can set the heights of individual rows with the call"*

```java
table.setRowHeight(row, height);
```

> *"The actual row height equals the row height set with these methods, reduced by the row margin. The default row margin is 1 pixel, but you can change it with the call"*

```java
table.setRowMargin(margin);
```

**Dịch:** Chiều cao dòng được **class `JTable` quản lý trực tiếp**. Mặc định mọi dòng có **cùng chiều cao**; đặt được chiều cao cho **từng dòng riêng lẻ**. Chiều cao dòng thực tế bằng chiều cao đặt bởi các method đó **trừ đi row margin**. Row margin mặc định là **1 pixel**.

### 11.1.3.5. Selecting Rows, Columns, and Cells

> *"Depending on the selection mode, the user can select rows, columns, or individual cells in the table. By default, row selection is enabled. Clicking inside a cell selects the entire row (see Figure 11.5). Call"*

```java
table.setRowSelectionAllowed(false);
```

> *"to disable row selection."*

**Dịch:** Tuỳ **selection mode**, người dùng chọn được dòng, cột hoặc từng cell riêng lẻ. **Mặc định là bật chọn dòng**: bấm vào trong một cell sẽ chọn cả dòng.

> *"When row selection is enabled, you can control whether the user is allowed to select a single row, a contiguous set of rows, or any set of rows. You need to retrieve the selection model and use its setSelectionMode method:"*

```java
table.getSelectionModel().setSelectionMode(mode);
```

> *"Here, mode is one of the three values:"*

```java
ListSelectionModel.SINGLE_SELECTION
ListSelectionModel.SINGLE_INTERVAL_SELECTION
ListSelectionModel.MULTIPLE_INTERVAL_SELECTION
```

**Dịch:** Khi bật chọn dòng, bạn kiểm soát được người dùng chọn **một dòng**, **một dải dòng liền nhau**, hay **tập dòng bất kỳ**, bằng cách lấy selection model rồi gọi `setSelectionMode`.

> *"Column selection is disabled by default. You can turn it on with the call"*

```java
table.setColumnSelectionAllowed(true);
```

> *"Enabling both row and column selection is equivalent to enabling cell selection. The user then selects ranges of cells (see Figure 11.7). You can also enable that setting with the call"*

```java
table.setCellSelectionEnabled(true);
```

**Dịch:** **Chọn cột mặc định bị tắt**. Bật **cả chọn dòng lẫn chọn cột** thì tương đương với **bật chọn cell**; khi đó người dùng chọn được **các vùng cell**.

> *"You can find out which rows and columns are selected by calling the getSelectedRows and getSelectedColumns methods. Both return an int[] array of the indexes of the selected items. Note that the index values are those of the table view, not the underlying table model."*

**Dịch:** Biết được dòng/cột nào đang được chọn bằng `getSelectedRows` và `getSelectedColumns`. Cả hai trả về mảng `int[]` các index. Lưu ý: các index đó là **index của table view, không phải của table model nền**.

> *"If you need to translate the table index values to table model index values, use the JTable methods convertRowIndexToModel and convertColumnIndexToModel."*

**Dịch:** Cần đổi index của table sang index của table model thì dùng `convertRowIndexToModel` và `convertColumnIndexToModel`.

### 11.1.3.6. Sorting Rows

> *"As you have seen in our first table example, it is easy to add row sorting to a JTable simply by calling the setAutoCreateRowSorter method. However, to have finer-grained control over the sorting behavior, install a TableRowSorter<M> object into a JTable and customize it. The type parameter M denotes the table model; it needs to be a subtype of the TableModel interface."*

```java
var sorter = new TableRowSorter<TableModel>(model);
table.setRowSorter(sorter);
```

**Dịch:** Thêm sắp xếp dòng rất dễ, chỉ cần gọi `setAutoCreateRowSorter`. Nhưng muốn **kiểm soát mịn hơn** thì cài một object `TableRowSorter<M>` vào `JTable` rồi tuỳ biến nó. Type parameter `M` chỉ table model, **phải là subtype của interface `TableModel`**.

> *"Some columns should not be sortable, such as the image column in our planet data. Turn sorting off by calling"*

```java
sorter.setSortable(IMAGE_COLUMN, false);
```

**Dịch:** Một số cột **không nên cho sắp xếp**, ví dụ cột ảnh trong data hành tinh. Tắt sắp xếp bằng `setSortable(..., false)`.

> *"You can install a custom comparator for each column. In our example, we will sort the colors in the Color column by preferring blue and green over red. When you click on the Color column, you will see that the blue planets go to the bottom of the table. This is achieved with the following call:"*

```java
sorter.setComparator(COLOR_COLUMN, new Comparator<Color>()
{
    public int compare(Color c1, Color c2)
    {
        int d = c1.getBlue() - c2.getBlue();
        if (d != 0) return d;
        d = c1.getGreen() - c2.getGreen();
        if (d != 0) return d;
        return c1.getRed() - c2.getRed();
    }
});
```

**Dịch:** Cài được **custom comparator cho từng cột**. (Về `Comparator`, xem [[03 - Concrete Collections]]; cú pháp anonymous class xem [[03 - Inner Classes]].)

> *"If you do not specify a comparator for a column, the sort order is determined as follows:"*

> *"1. If the column class is String, use the default collator returned by Collator.getInstance(). It sorts strings in a way that is appropriate for the current locale. (See Chapter 7 for more information about locales and collators.)"*
>
> *"2. If the column class implements Comparable, use its compareTo method."*
>
> *"3. If a TableStringConverter has been set for the sorter, sort the strings returned by the converter's toString method with the default collator. If you want to use this approach, define a converter as follows:"*

```java
sorter.setStringConverter(new TableStringConverter()
{
    public String toString(TableModel model, int row, int column)
    {
        Object value = model.getValueAt(row, column);
        // convert value to a string and return it
    }
});
```

> *"4. Otherwise, call the toString method on the cell values and sort them with the default collator."*

**Dịch:** Nếu **không chỉ định comparator** cho một cột, thứ tự sắp xếp được xác định như sau:

| # | Quy tắc |
|---|---|
| 1 | Nếu class của cột là `String` → dùng **collator mặc định** `Collator.getInstance()`, sắp xếp string theo **locale hiện tại** |
| 2 | Nếu class của cột implement `Comparable` → dùng method `compareTo` của nó |
| 3 | Nếu một `TableStringConverter` đã được đặt cho sorter → sắp xếp các string do method `toString` của converter trả về, bằng collator mặc định |
| 4 | Ngược lại → gọi `toString` lên giá trị cell rồi sắp xếp bằng collator mặc định |

### 11.1.3.7. Filtering Rows

> *"In addition to sorting rows, the TableRowSorter can also selectively hide rows—a process called filtering. To activate filtering, set a RowFilter. For example, to include all rows that contain at least one moon, call"*

```java
sorter.setRowFilter(RowFilter.numberFilter(ComparisonType.NOT_EQUAL, 0, MOONS_COLUMN));
```

**Dịch:** Ngoài sắp xếp dòng, `TableRowSorter` còn **giấu dòng có chọn lọc** — gọi là **filtering**. Bật filtering bằng cách đặt một `RowFilter`.

> *"Here, we use a predefined number filter. To construct a number filter, supply"*
>
> *"• The comparison type (one of EQUAL, NOT_EQUAL, AFTER, or BEFORE)."*
> *"• An object of a subclass of Number (such as an Integer or Double). Only objects that have the same class as the given Number object are considered."*
> *"• Zero or more column index values. If no index values are supplied, all columns are searched."*

**Dịch:** Để dựng một **number filter**, cần cung cấp: **comparison type** (một trong `EQUAL`, `NOT_EQUAL`, `AFTER`, `BEFORE`) · một object thuộc subclass của `Number` (**chỉ những object cùng class với object `Number` đã cho mới được xét**) · **không hoặc nhiều** giá trị index cột (nếu không đưa index nào thì **mọi cột đều được tìm**).

> *"The static RowFilter.dateFilter method constructs a date filter in the same way; you need to supply a Date object instead of the Number object."*

**Dịch:** Static method `RowFilter.dateFilter` dựng **date filter** theo cách tương tự, chỉ thay object `Number` bằng object `Date`.

> *"Finally, the static RowFilter.regexFilter method constructs a filter that looks for strings matching a regular expression. For example,"*

```java
sorter.setRowFilter(RowFilter.regexFilter(".*[^s]$", PLANET_COLUMN));
```

> *"only displays those planets whose name doesn't end with an "s". (See Chapter 2 for more information on regular expressions.)"*

**Dịch:** `RowFilter.regexFilter` dựng filter tìm string **khớp một regular expression**. Ví dụ trên chỉ hiển thị các hành tinh **có tên không kết thúc bằng "s"**.

> *"You can also combine filters with the andFilter, orFilter, and notFilter methods. To filter for planets not ending in an "s" with at least one moon, you can use this filter combination:"*

```java
sorter.setRowFilter(RowFilter.andFilter(List.of(
    RowFilter.regexFilter(".*[^s]$", PLANET_COLUMN),
    RowFilter.numberFilter(ComparisonType.NOT_EQUAL, 0, MOONS_COLUMN))));
```

**Dịch:** Kết hợp được nhiều filter bằng `andFilter`, `orFilter`, `notFilter`.

> *"To implement your own filter, provide a subclass of RowFilter and implement an include method to indicate which rows should be displayed. This is easy to do, but the glorious generality of the RowFilter class makes it a bit scary."*

**Dịch:** Muốn tự implement filter thì tạo **subclass của `RowFilter`** và implement method `include` để chỉ ra dòng nào được hiển thị. Việc này dễ, nhưng **tính tổng quát "huy hoàng" của class `RowFilter` khiến nó trông hơi đáng sợ**.

> *"The RowFilter<M, I> class has two type parameters—the types for the model and for the row identifier. When dealing with tables, the model is always a subtype of TableModel and the identifier type is Integer. (At some point in the future, other components might also support row filtering. For example, to filter rows in a JTree, one might use a RowFilter<TreeModel, TreePath>.)"*

**Dịch:** Class `RowFilter<M, I>` có **hai type parameter** — kiểu của **model** và kiểu của **row identifier**. Với table thì model **luôn là subtype của `TableModel`** và kiểu identifier là **`Integer`**. (Xem [[08 - Generic Programming]] về type parameter — sách nói tương lai các component khác cũng có thể hỗ trợ row filtering, ví dụ lọc dòng trong `JTree` có thể dùng `RowFilter<TreeModel, TreePath>`.)

> *"A row filter must implement the method"*

```java
public boolean include(RowFilter.Entry<? extends M, ? extends I> entry)
```

> *"The RowFilter.Entry class supplies methods to obtain the model, the row identifier, and the value at a given index. Therefore, you can filter both by row identifier and by the contents of the row."*

**Dịch:** Class `RowFilter.Entry` cung cấp method để lấy **model**, **row identifier**, và **giá trị tại một index**. Nhờ đó bạn lọc được **cả theo row identifier lẫn theo nội dung của dòng**.

> *"For example, this filter displays every other row:"*

```java
var filter = new RowFilter<TableModel, Integer>()
{
    public boolean include(Entry<? extends TableModel, ? extends Integer> entry)
    {
        return entry.getIdentifier() % 2 == 0;
    }
};
```

> *"If you wanted to include only those planets with an even number of moons, you would instead test for"*

```java
((Integer) entry.getValue(MOONS_COLUMN)) % 2 == 0
```

**Dịch:** Filter trên hiển thị **cách một dòng lại lấy một dòng**. Muốn chỉ lấy các hành tinh có **số mặt trăng chẵn** thì kiểm tra biểu thức thứ hai.

> *"In our sample program, we allow the user to hide arbitrary rows. We store the hidden row indexes in a set. The row filter shows all rows whose indexes are not in that set."*

**Dịch:** Trong chương trình ví dụ, ta cho người dùng **giấu dòng tuỳ ý**. Index của các dòng bị giấu được lưu trong một **set**. Row filter hiển thị **mọi dòng có index không nằm trong set đó**.

> *"The filtering mechanism wasn't designed for filters with criteria changing over time. In our sample program, we keep calling"*

```java
sorter.setRowFilter(filter);
```

> *"whenever the set of hidden rows changes. Setting a filter causes it to be applied immediately."*

**Dịch:** Cơ chế filtering **không được thiết kế cho filter có tiêu chí thay đổi theo thời gian**. Trong ví dụ, ta **gọi lại `setRowFilter`** mỗi khi tập dòng bị giấu thay đổi. Đặt filter khiến nó **được áp dụng ngay lập tức**.

### 11.1.3.8. Hiding and Displaying Columns

> *"As you saw in the preceding section, you can filter table rows by either their contents or their row identifier. Hiding table columns uses a completely different mechanism."*

**Dịch:** Giấu cột dùng **cơ chế hoàn toàn khác** với lọc dòng.

> *"The removeColumn method of the JTable class removes a column from the table view. The column data are not actually removed from the model—they are just hidden from view. The removeColumn method takes a TableColumn argument. If you have the column number (for example, from a call to getSelectedColumns), you need to ask the table model for the actual table column object:"*

```java
TableColumnModel columnModel = table.getColumnModel();
TableColumn column = columnModel.getColumn(i);
table.removeColumn(column);
```

**Dịch:** Method `removeColumn` của `JTable` **gỡ một cột khỏi table view**. Data của cột **không thực sự bị gỡ khỏi model** — chúng chỉ **bị giấu khỏi view**. `removeColumn` nhận argument kiểu `TableColumn`.

> *"If you remember the column, you can later add it back in:"*

```java
table.addColumn(column);
```

> *"This method adds the column to the end. If you want it to appear elsewhere, call the moveColumn method."*

**Dịch:** Nếu bạn **nhớ giữ lại cột đó**, sau này thêm lại được. Method này thêm cột **vào cuối**; muốn nó xuất hiện ở chỗ khác thì gọi `moveColumn`.

> *"You can also add a new column that corresponds to a column index in the table model, by adding a new TableColumn object:"*

```java
table.addColumn(new TableColumn(modelColumnIndex));
```

> *"You can have multiple table columns that view the same column of the model."*

**Dịch:** Bạn có thể có **nhiều table column cùng xem một cột của model**.

### API — `javax.swing.table.TableModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Class getColumnClass(int columnIndex)` | lấy class cho các giá trị trong cột này. Thông tin này dùng cho **sắp xếp và rendering** |

### API — `javax.swing.JTable` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TableColumnModel getColumnModel()` | lấy column model mô tả cách sắp xếp các cột của table |
| `void setAutoResizeMode(int mode)` | đặt mode tự động resize cột (`AUTO_RESIZE_OFF`, `AUTO_RESIZE_NEXT_COLUMN`, `AUTO_RESIZE_SUBSEQUENT_COLUMNS`, `AUTO_RESIZE_LAST_COLUMN`, `AUTO_RESIZE_ALL_COLUMNS`) |
| `int getRowMargin()` / `void setRowMargin(int margin)` | lấy/đặt khoảng trống giữa các cell ở hai dòng kề nhau |
| `int getRowHeight()` / `void setRowHeight(int height)` | lấy/đặt chiều cao mặc định của mọi dòng |
| `int getRowHeight(int row)` / `void setRowHeight(int row, int height)` | lấy/đặt chiều cao của một dòng cho trước |
| `ListSelectionModel getSelectionModel()` | trả về list selection model. Cần model này để chọn giữa chọn dòng, chọn cột và chọn cell |
| `boolean getRowSelectionAllowed()` / `void setRowSelectionAllowed(boolean b)` | lấy/đặt property `rowSelectionAllowed`. Nếu `true`, dòng được chọn khi người dùng bấm vào cell |
| `boolean getColumnSelectionAllowed()` / `void setColumnSelectionAllowed(boolean b)` | lấy/đặt property `columnSelectionAllowed` |
| `boolean getCellSelectionEnabled()` | trả về `true` nếu **cả** `rowSelectionAllowed` **và** `columnSelectionAllowed` đều `true` |
| `void setCellSelectionEnabled(boolean b)` | đặt cả hai property trên bằng `b` |
| `void addColumn(TableColumn column)` | thêm một cột làm **cột cuối** của table view |
| `void moveColumn(int from, int to)` | chuyển cột có index `from` thành index `to`. **Chỉ view bị ảnh hưởng** |
| `void removeColumn(TableColumn column)` | gỡ cột đã cho khỏi view |
| `int convertRowIndexToModel(int index)` *(6)* / `int convertColumnIndexToModel(int index)` | trả về index trong model của dòng/cột có index đã cho. Giá trị này **khác `index`** khi dòng được sắp xếp hoặc lọc, hoặc khi cột bị di chuyển/gỡ bỏ |
| `void setRowSorter(RowSorter<? extends TableModel> sorter)` | đặt row sorter |

### API — `javax.swing.table.TableColumnModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TableColumn getColumn(int index)` | lấy object table column mô tả cột có view index đã cho |

### API — `javax.swing.table.TableColumn` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TableColumn(int modelColumnIndex)` | dựng một table column để xem cột của model có index đã cho |
| `void setPreferredWidth(int width)` · `void setMinWidth(int width)` · `void setMaxWidth(int width)` | đặt chiều rộng ưa thích / nhỏ nhất / lớn nhất của table column này |
| `void setWidth(int width)` | đặt chiều rộng thực tế của cột này |
| `void setResizable(boolean b)` | nếu `b` là `true`, cột này resize được |

### API — `javax.swing.ListSelectionModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void setSelectionMode(int mode)` | `mode` là một trong `SINGLE_SELECTION`, `SINGLE_INTERVAL_SELECTION`, `MULTIPLE_INTERVAL_SELECTION` |

### API — `javax.swing.DefaultRowSorter<M, I>` 6

| Method | Công dụng (theo sách) |
|---|---|
| `void setComparator(int column, Comparator<?> comparator)` | đặt comparator dùng cho cột đã cho |
| `void setSortable(int column, boolean enabled)` | bật/tắt sắp xếp cho cột đã cho |
| `void setRowFilter(RowFilter<? super M,? super I> filter)` | đặt row filter |

### API — `javax.swing.table.TableRowSorter<M extends TableModel>` 6

| Method | Công dụng (theo sách) |
|---|---|
| `void setStringConverter(TableStringConverter stringConverter)` | đặt string converter dùng cho sắp xếp và lọc |

### API — `javax.swing.table.TableStringConverter` 6

| Method | Công dụng (theo sách) |
|---|---|
| `abstract String toString(TableModel model, int row, int column)` | chuyển giá trị của model tại vị trí đã cho thành string; bạn override được method này |

### API — `javax.swing.RowFilter<M, I>` 6

| Method | Công dụng (theo sách) |
|---|---|
| `boolean include(RowFilter.Entry<? extends M,? extends I> entry)` | quy định các dòng được giữ lại; bạn override được method này |
| `static <M,I> RowFilter<M,I> numberFilter(RowFilter.ComparisonType type, Number number, int... indices)` · `dateFilter(RowFilter.ComparisonType type, Date date, int... indices)` | trả về filter giữ các dòng chứa giá trị khớp phép so sánh đã cho với number/date đã cho. Comparison type là một trong `EQUAL`, `NOT_EQUAL`, `AFTER`, `BEFORE`. Nếu có đưa index cột thì chỉ tìm trong các cột đó; nếu không thì tìm mọi cột. Với number filter, **class của giá trị cell phải khớp class của `number`** |
| `static <M,I> RowFilter<M,I> regexFilter(String regex, int... indices)` | trả về filter giữ các dòng có giá trị string khớp regular expression đã cho. Lưu ý string được đem so khớp là string do method `getStringValue` của `RowFilter.Entry` trả về |
| `static <M,I> RowFilter<M,I> andFilter(...)` · `orFilter(...)` | trả về filter giữ các entry được **mọi** filter giữ, hoặc được **ít nhất một** filter giữ |
| `static <M,I> RowFilter<M,I> notFilter(RowFilter<M,I> filter)` | trả về filter giữ các entry **không** được filter đã cho giữ |

### API — `javax.swing.RowFilter.Entry<M, I>` 6

| Method | Công dụng (theo sách) |
|---|---|
| `I getIdentifier()` | trả về identifier của row entry này |
| `M getModel()` | trả về model của row entry này |
| `Object getValue(int index)` | trả về giá trị lưu tại index đã cho của dòng này |
| `int getValueCount()` | trả về số giá trị lưu trong dòng này |
| `String getStringValue()` | trả về giá trị lưu tại index đã cho của dòng này, **đã chuyển thành string**. `TableRowSorter` sinh ra các entry mà `getStringValue` của chúng gọi string converter của sorter |

---

## 11.1.4. Cell Rendering and Editing

> *"As you saw in Section 11.1.3.2, "Accessing Table Columns," the column type determines how the cells are rendered. There are default renderers for the types Boolean and Icon that render a checkbox or icon. For all other types, you need to install a custom renderer."*

**Dịch:** **Kiểu của cột quyết định cách các cell được render.** Có **renderer mặc định** cho kiểu `Boolean` và `Icon` (render ra checkbox hoặc icon). Với **mọi kiểu khác**, bạn phải **cài một custom renderer**.

### 11.1.4.1. Rendering Cells

> *"Table cell renderers are similar to the list cell renderers that you saw earlier. They implement the TableCellRenderer interface that has a single method:"*

```java
Component getTableCellRendererComponent(JTable table, Object value,
    boolean isSelected, boolean hasFocus, int row, int column)
```

> *"That method is called when the table needs to draw a cell. You return a component whose paint method is then invoked to fill the cell area."*

**Dịch:** Table **cell renderer** implement interface `TableCellRenderer` — interface này **chỉ có một method**. Method đó được gọi khi table cần vẽ một cell. Bạn **trả về một component**, rồi method `paint` của component đó được gọi để **lấp đầy vùng cell**. (Về interface, xem [[01 - Interfaces]].)

> *"The table in Figure 11.8 contains cells of type Color. The renderer simply returns a panel with a background color that is the color object stored in the cell. The color is passed as the value parameter."*

```java
class ColorTableCellRenderer extends JPanel implements TableCellRenderer
{
    public Component getTableCellRendererComponent(JTable table, Object value,
        boolean isSelected, boolean hasFocus, int row, int column)
    {
        setBackground((Color) value);
        if (hasFocus)
            setBorder(UIManager.getBorder("Table.focusCellHighlightBorder"));
        else
            setBorder(null);
        return this;
    }
}
```

**Dịch:** Renderer chỉ đơn giản **trả về một panel** có background color chính là object color lưu trong cell. Màu được truyền vào qua parameter `value`.

> *"As you can see, the renderer draws a border when the cell has focus. (We ask the UIManager for the correct border. To find the lookup key, we peeked into the source code of the DefaultTableCellRenderer class.)"*

**Dịch:** Renderer **vẽ border khi cell có focus**. Ta hỏi `UIManager` để lấy border đúng; để tìm ra lookup key, tác giả đã **ngó vào source code của class `DefaultTableCellRenderer`**.

> **Tip (sách):** *"If your renderer simply draws a text string or an icon, you can extend the DefaultTableCellRenderer class. It takes care of rendering the focus and selection status for you."*
>
> **Dịch:** Nếu renderer của bạn chỉ vẽ một chuỗi text hoặc một icon thì **extend class `DefaultTableCellRenderer`** — nó **lo giúp bạn việc render trạng thái focus và selection**.

> *"You need to tell the table to use this renderer with all objects of type Color. The setDefaultRenderer method of the JTable class lets you establish this association. Supply a Class object and the renderer:"*

```java
table.setDefaultRenderer(Color.class, new ColorTableCellRenderer());
```

> *"That renderer is now used for all objects of the given type in this table. If you want to select a renderer based on some other criterion, you need to subclass the JTable class and override the getCellRenderer method."*

**Dịch:** Method `setDefaultRenderer` của `JTable` **thiết lập liên kết** giữa một `Class` object và renderer. Renderer đó **được dùng cho mọi object thuộc kiểu đã cho** trong table này. Muốn chọn renderer theo tiêu chí khác thì **tạo subclass của `JTable` và override method `getCellRenderer`**.

### 11.1.4.2. Rendering the Header

> *"To display an icon in the header, set the header value:"*

```java
moonColumn.setHeaderValue(new ImageIcon("Moons.gif"));
```

> *"However, the table header isn't smart enough to choose an appropriate renderer for the header value. You have to install the renderer manually. For example, to show an image icon in a column header, call"*

```java
moonColumn.setHeaderRenderer(table.getDefaultRenderer(ImageIcon.class));
```

**Dịch:** Table header **không đủ "thông minh" để tự chọn renderer phù hợp** cho giá trị header. Bạn **phải cài renderer thủ công**.

### 11.1.4.3. Editing Cells

> *"To enable cell editing, the table model must indicate which cells are editable by defining the isCellEditable method. Most commonly, you will want to make certain columns editable. In the example program, we allow editing in four columns."*

```java
public boolean isCellEditable(int r, int c)
{
    return c == PLANET_COLUMN || c == MOONS_COLUMN || c == GASEOUS_COLUMN
        || c == COLOR_COLUMN;
}
```

**Dịch:** Muốn bật sửa cell thì **table model phải chỉ ra cell nào sửa được** bằng cách định nghĩa method `isCellEditable`. Thông thường bạn muốn **cho sửa một số cột nhất định**.

> **Note (sách):** *"The AbstractTableModel defines the isCellEditable method to always return false. The DefaultTableModel overrides the method to always return true."*
>
> **Dịch:** `AbstractTableModel` định nghĩa `isCellEditable` **luôn trả về `false`**. `DefaultTableModel` override method này để **luôn trả về `true`**.

> *"If you run the program (Listings 11.4 to 11.7), note that you can click the checkboxes in the Gaseous column and turn the check marks on and off. If you click a cell in the Moons column, a combo box appears (see Figure 11.9). You will shortly see how to install such a combo box as a cell editor. Finally, click a cell in the first column. The cell gains focus. You can start typing, and the cell contents change."*

**Dịch:** Bấm checkbox ở cột Gaseous để bật/tắt dấu tích. Bấm vào cell ở cột Moons thì **một combo box xuất hiện**. Bấm cell ở cột đầu tiên thì **cell nhận focus**, gõ phím là nội dung cell thay đổi.

> *"What you just saw in action are the three variations of the DefaultCellEditor class. A DefaultCellEditor can be constructed with a JTextField, a JCheckBox, or a JComboBox. The JTable class automatically installs a checkbox editor for Boolean cells and a text field editor for all editable cells that don't supply their own renderer. The text fields let the user edit the strings that result from applying toString to the return value of the getValueAt method of the table model."*

**Dịch:** Đó chính là **ba biến thể của class `DefaultCellEditor`** — dựng được bằng một `JTextField`, một `JCheckBox`, hoặc một `JComboBox`. Class `JTable` **tự động cài** checkbox editor cho cell `Boolean` và text field editor cho **mọi cell sửa được mà không tự cung cấp renderer riêng**. Text field cho phép người dùng sửa chuỗi thu được khi áp `toString` lên giá trị trả về của `getValueAt`.

> *"When the edit is complete, the edited value is retrieved by calling the getCellEditorValue method of your editor. That method should return a value of the correct type (that is, the type returned by the getColumnType method of the model)."*

**Dịch:** Khi sửa xong, giá trị đã sửa được lấy về bằng cách gọi `getCellEditorValue` của editor. Method đó **phải trả về giá trị đúng kiểu** (kiểu do method `getColumnType` của model trả về).

> *"To get a combo box editor, set a cell editor manually—the JTable component has no idea what values might be appropriate for a particular type. For the Moons column, we wanted to enable the user to pick any value between 0 and 20. Here is the code for initializing the combo box:"*

```java
var moonCombo = new JComboBox();
for (int i = 0; i <= 20; i++)
    moonCombo.addItem(i);
```

> *"To construct a DefaultCellEditor, supply the combo box in the constructor:"*

```java
var moonEditor = new DefaultCellEditor(moonCombo);
```

> *"Next, we need to install the editor. Unlike the color cell renderer, this editor does not depend on the object type—we don't necessarily want to use it for all objects of type Integer. Instead, we need to install it into a particular column:"*

```java
moonColumn.setCellEditor(moonEditor);
```

**Dịch:** Muốn có combo box editor thì **cài cell editor thủ công** — component `JTable` **không hề biết** giá trị nào là phù hợp cho một kiểu cụ thể. Khác với color cell renderer, editor này **không phụ thuộc kiểu object** — ta không nhất thiết muốn dùng nó cho mọi object kiểu `Integer`. Vì vậy **cài nó vào một cột cụ thể**.

### 11.1.4.4. Custom Editors

> *"Run the example program again and click a color. A color chooser pops up and lets you pick a new color for the planet. Select a color and click OK. The cell color is updated (see Figure 11.10)."*

**Dịch:** Bấm vào một màu thì **một color chooser bật lên** cho bạn chọn màu mới cho hành tinh. Chọn màu và bấm OK thì màu của cell được cập nhật.

> *"The color cell editor is not a standard table cell editor but a custom implementation. To create a custom cell editor, implement the TableCellEditor interface. That interface is a bit tedious, and as of Java SE 1.3, an AbstractCellEditor class is provided to take care of the event handling details."*

**Dịch:** Color cell editor **không phải table cell editor chuẩn** mà là một implementation tự viết. Muốn tạo custom cell editor thì implement interface `TableCellEditor`. Interface đó **hơi lích kích**, và **từ Java SE 1.3** đã có class `AbstractCellEditor` **lo giúp các chi tiết xử lý event**.

> *"The getTableCellEditorComponent method of the TableCellEditor interface requests a component to render the cell. It is exactly the same as the getTableCellRendererComponent method of the TableCellRenderer interface, except that there is no focus parameter. When the cell is being edited, it is presumed to have focus. The editor component temporarily replaces the renderer when the editing is in progress. In our example, we return a blank panel that is not colored. This is an indication to the user that the cell is currently being edited."*

**Dịch:** Method `getTableCellEditorComponent` **giống hệt** `getTableCellRendererComponent`, chỉ **không có parameter focus** — khi cell đang được sửa thì **mặc nhiên coi là nó có focus**. Editor component **tạm thời thay thế renderer** trong lúc đang sửa. Trong ví dụ, ta trả về **một panel trắng không tô màu**, để **báo hiệu cho người dùng biết cell đang được sửa**.

> *"Next, you want to have your editor pop up when the user clicks on the cell. The JTable class calls your editor with an event (such as a mouse click) to find out if that event is acceptable to initiate the editing process. The AbstractCellEditor class defines the method to accept all events."*

```java
public boolean isCellEditable(EventObject anEvent)
{
    return true;
}
```

> *"However, if you override this method to return false, the table would not go through the trouble of inserting the editor component."*

**Dịch:** Class `JTable` gọi editor của bạn kèm một **event** (ví dụ một cú click chuột) để xem event đó **có chấp nhận được để bắt đầu quá trình sửa hay không**. Class `AbstractCellEditor` định nghĩa method này **chấp nhận mọi event**. Nếu bạn override để trả về `false` thì table **sẽ không mất công chèn editor component**.

> *"Once the editor component is installed, the shouldSelectCell method is called, presumably with the same event. You should initiate editing in this method—for example, by popping up an external edit dialog box."*

```java
public boolean shouldSelectCell(EventObject anEvent)
{
    colorDialog.setVisible(true);
    return true;
}
```

**Dịch:** Sau khi editor component được cài, method `shouldSelectCell` được gọi (có lẽ với cùng event đó). Bạn nên **khởi động việc sửa trong method này** — ví dụ bật một hộp thoại sửa bên ngoài.

> *"If the user cancels the edit, the table calls the cancelCellEditing method. If the user has clicked on another table cell, the table calls the stopCellEditing method. In both cases, you should hide the dialog box. When your stopCellEditing method is called, the table would like to use the partially edited value. You should return true if the current value is valid. In the color chooser, any value is valid. But if you edit other data, you can ensure that only valid data are retrieved from the editor."*

**Dịch:** Người dùng **huỷ** việc sửa thì table gọi `cancelCellEditing`. Người dùng **bấm sang cell khác** thì table gọi `stopCellEditing`. **Cả hai trường hợp bạn nên ẩn hộp thoại đi.** Khi `stopCellEditing` được gọi, table muốn dùng giá trị đang sửa dở — bạn nên **trả về `true` nếu giá trị hiện tại hợp lệ**. Với color chooser thì **mọi giá trị đều hợp lệ**; nhưng với data khác, bạn đảm bảo được **chỉ data hợp lệ mới được lấy ra từ editor**.

> *"Also, you should call the superclass methods that take care of event firing—otherwise, the editing won't be properly canceled."*

```java
public void cancelCellEditing()
{
    colorDialog.setVisible(false);
    super.cancelCellEditing();
}
```

**Dịch:** Bạn cũng **phải gọi method của superclass** — nơi lo việc bắn event — nếu không thì **việc sửa sẽ không được huỷ đúng cách**.

> *"Finally, you need a method that yields the value that the user supplied in the editing process:"*

```java
public Object getCellEditorValue()
{
    return colorChooser.getColor();
}
```

### Bốn bước viết custom editor

> *"To summarize, your custom editor should do the following:"*
>
> *"1. Extend the AbstractCellEditor class and implement the TableCellEditor interface."*
> *"2. Define the getTableCellEditorComponent method to supply a component. This can either be a dummy component (if you pop up a dialog box) or a component for in-place editing such as a combo box or text field."*
> *"3. Define the shouldSelectCell, stopCellEditing, and cancelCellEditing methods to handle the start, completion, and cancellation of the editing process. The stopCellEditing and cancelCellEditing methods should call the superclass methods to ensure that listeners are notified."*
> *"4. Define the getCellEditorValue method to return the value that is the result of the editing process."*

**Dịch:**

| # | Việc phải làm |
|---|---|
| 1 | **Extend class `AbstractCellEditor`** và **implement interface `TableCellEditor`** |
| 2 | Định nghĩa `getTableCellEditorComponent` để cung cấp một component — có thể là **component giả** (nếu bạn bật hộp thoại) hoặc component **sửa tại chỗ** như combo box hay text field |
| 3 | Định nghĩa `shouldSelectCell`, `stopCellEditing`, `cancelCellEditing` để xử lý **bắt đầu / hoàn tất / huỷ** quá trình sửa. `stopCellEditing` và `cancelCellEditing` **phải gọi method của superclass** để đảm bảo listener được thông báo |
| 4 | Định nghĩa `getCellEditorValue` để **trả về giá trị là kết quả của quá trình sửa** |

> *"Finally, indicate when the user is finished editing by calling the stopCellEditing and cancelCellEditing methods. When constructing the color dialog box, we install the accept and cancel callbacks that fire these events."*

```java
colorDialog = JColorChooser.createDialog(null, "Planet Color", false, colorChooser,
    EventHandler.create(ActionListener.class, this, "stopCellEditing"),
    EventHandler.create(ActionListener.class, this, "cancelCellEditing"));
```

**Dịch:** Cuối cùng, **báo hiệu khi người dùng sửa xong** bằng cách gọi `stopCellEditing` và `cancelCellEditing`. Khi dựng hộp thoại màu, ta cài **callback accept và cancel** để bắn các event này.

### Cập nhật model sau khi sửa

> *"You now know how to make a cell editable and how to install an editor. There is one remaining issue—how to update the model with the value that the user edited. When editing is complete, the JTable class calls the following method of the table model:"*

```java
void setValueAt(Object value, int r, int c)
```

> *"You need to override the method to store the new value. The value parameter is the object that was returned by the cell editor. If you implemented the cell editor, you know the type of the object you return from the getCellEditorValue method. In the case of the DefaultCellEditor, there are three possibilities for that value. It is a Boolean if the cell editor is a checkbox, a string if it is a text field, and, if the value comes from a combo box, it is the object that the user selected."*

**Dịch:** Còn một vấn đề: **cập nhật model với giá trị người dùng vừa sửa**. Khi sửa xong, `JTable` gọi `setValueAt` của table model — bạn phải **override method này để lưu giá trị mới**. Parameter `value` là object do cell editor trả về. Với `DefaultCellEditor` có **ba khả năng**: là `Boolean` nếu cell editor là checkbox · là một string nếu là text field · là **object người dùng đã chọn** nếu giá trị đến từ combo box.

> *"If the value object does not have the appropriate type, you need to convert it. That happens most commonly when a number is edited in a text field. In our example, we populated the combo box with Integer objects so that no conversion is necessary."*

**Dịch:** Nếu object `value` **không đúng kiểu** thì bạn phải **chuyển đổi nó**. Chuyện này thường xảy ra nhất khi **một số được sửa trong text field**. Trong ví dụ, ta đã đổ **object `Integer`** vào combo box nên **không cần chuyển đổi**.

### Listing 11.6 — `tableCellRender/ColorTableCellRenderer.java`

```java
package tableCellRender;

import java.awt.*;
import javax.swing.*;
import javax.swing.table.*;

/**
 * This renderer renders a color value as a panel with the given color.
 */
public class ColorTableCellRenderer extends JPanel implements TableCellRenderer
{
    public Component getTableCellRendererComponent(JTable table, Object value,
        boolean isSelected, boolean hasFocus, int row, int column)
    {
        setBackground((Color) value);
        if (hasFocus) setBorder(UIManager.getBorder("Table.focusCellHighlightBorder"));
        else setBorder(null);
        return this;
    }
}
```

### Listing 11.7 — `tableCellRender/ColorTableCellEditor.java`

```java
package tableCellRender;

import java.awt.*;
import java.awt.event.*;
import java.beans.*;
import java.util.*;
import javax.swing.*;
import javax.swing.table.*;

/**
 * This editor pops up a color dialog to edit a cell value.
 */
public class ColorTableCellEditor extends AbstractCellEditor implements TableCellEditor
{
    private JColorChooser colorChooser;
    private JDialog colorDialog;
    private JPanel panel;

    public ColorTableCellEditor()
    {
        panel = new JPanel();
        // prepare color dialog
        colorChooser = new JColorChooser();
        colorDialog = JColorChooser.createDialog(null, "Planet Color", false, colorChooser,
            EventHandler.create(ActionListener.class, this, "stopCellEditing"),
            EventHandler.create(ActionListener.class, this, "cancelCellEditing"));
    }

    public Component getTableCellEditorComponent(JTable table, Object value,
        boolean isSelected, int row, int column)
    {
        // this is where we get the current Color value. We store it in the dialog in case the
        // user starts editing
        colorChooser.setColor((Color) value);
        return panel;
    }

    public boolean shouldSelectCell(EventObject anEvent)
    {
        // start editing
        colorDialog.setVisible(true);

        // tell caller it is ok to select this cell
        return true;
    }

    public void cancelCellEditing()
    {
        // editing is canceled--hide dialog
        colorDialog.setVisible(false);
        super.cancelCellEditing();
    }

    public boolean stopCellEditing()
    {
        // editing is complete--hide dialog
        colorDialog.setVisible(false);
        super.stopCellEditing();

        // tell caller is is ok to use color value
        return true;
    }

    public Object getCellEditorValue()
    {
        return colorChooser.getColor();
    }
}
```

### API — `javax.swing.JTable` 1.2 (renderer/editor)

| Method | Công dụng (theo sách) |
|---|---|
| `TableCellRenderer getDefaultRenderer(Class<?> type)` | lấy renderer mặc định cho kiểu đã cho |
| `TableCellEditor getDefaultEditor(Class<?> type)` | lấy editor mặc định cho kiểu đã cho |

### API — `javax.swing.table.TableCellRenderer` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Component getTableCellRendererComponent(JTable table, Object value, boolean selected, boolean hasFocus, int row, int column)` | trả về một component mà method `paint` của nó được gọi để render một table cell. `table` = table chứa cell cần render · `value` = cell cần render · `selected` = `true` nếu cell đang được chọn · `hasFocus` = `true` nếu cell đang có focus · `row, column` = dòng và cột của cell |

### API — `javax.swing.table.TableColumn` 1.2 (renderer/editor)

| Method | Công dụng (theo sách) |
|---|---|
| `void setCellEditor(TableCellEditor editor)` / `void setCellRenderer(TableCellRenderer renderer)` | đặt cell editor hoặc renderer cho **mọi cell trong cột này** |
| `void setHeaderRenderer(TableCellRenderer renderer)` | đặt cell renderer cho **cell header** của cột này |
| `void setHeaderValue(Object value)` | đặt giá trị được hiển thị cho header của cột này |

### API — `javax.swing.DefaultCellEditor` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `DefaultCellEditor(JComboBox comboBox)` | dựng một cell editor trình bày combo box để chọn giá trị cell |

### API — `javax.swing.table.TableCellEditor` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Component getTableCellEditorComponent(JTable table, Object value, boolean selected, int row, int column)` | trả về một component mà method `paint` của nó render một table cell |

### API — `javax.swing.CellEditor` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `boolean isCellEditable(EventObject event)` | trả về `true` nếu event phù hợp để **khởi động** quá trình sửa cho cell này |
| `boolean shouldSelectCell(EventObject anEvent)` | bắt đầu quá trình sửa. Trả về `true` nếu cell đang sửa **nên được chọn**. Thường bạn muốn trả về `true`, nhưng trả `false` được nếu **không muốn quá trình sửa làm đổi selection** |
| `void cancelCellEditing()` | **huỷ** quá trình sửa. Bạn bỏ đi phần sửa dở |
| `boolean stopCellEditing()` | **dừng** quá trình sửa với ý định dùng kết quả. Trả về `true` nếu giá trị đã sửa **ở trạng thái đúng để lấy ra** |
| `Object getCellEditorValue()` | trả về kết quả đã sửa |
| `void addCellEditorListener(CellEditorListener l)` / `void removeCellEditorListener(CellEditorListener l)` | thêm hoặc gỡ cell editor listener **bắt buộc** |

---

## Bài kế tiếp

→ [[02 - Trees]] — `JTree`, tree model, tree path, node enumeration, rendering node, tree event, và custom tree model.
