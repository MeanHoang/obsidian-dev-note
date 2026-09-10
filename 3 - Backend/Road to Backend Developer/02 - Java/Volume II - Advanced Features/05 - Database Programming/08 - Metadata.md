# 08 — Metadata

> Chapter 5, Section 5.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 5.8. Metadata

> *"In the preceding sections, you saw how to populate, query, and update database tables. However, JDBC can give you additional information about the structure of a database and its tables. For example, you can get a list of the tables in a particular database or the column names and types of a table. This information is not useful when you are implementing a business application with a predefined database. After all, if you design the tables, you know their structure. Structural information is, however, extremely useful for programmers who write tools that work with any database."*

**Dịch:** Các phần trước đã chỉ cách **nạp, query và cập nhật** table. Nhưng JDBC còn cho bạn **thông tin bổ sung về cấu trúc của database và các table của nó** — ví dụ **danh sách table**, hoặc **tên và kiểu của các column** trong một table. Thông tin này **không hữu ích khi bạn làm ứng dụng nghiệp vụ với database đã định sẵn** — dù sao chính bạn thiết kế table thì bạn biết cấu trúc rồi. Nhưng **thông tin cấu trúc cực kỳ hữu ích cho người viết công cụ làm việc được với BẤT KỲ database nào**.

> *"In SQL, data that describe the database or one of its parts are called metadata (to distinguish them from the actual data stored in the database). You can get three kinds of metadata: about a database, about a result set, and about parameters of prepared statements."*

**Dịch:** Trong SQL, **dữ liệu mô tả database hoặc một phần của nó gọi là metadata** (để phân biệt với **dữ liệu thật** lưu trong database). Bạn lấy được **ba loại metadata**: **về database**, **về result set**, và **về parameter của prepared statement**.

---

## DatabaseMetaData

> *"To find out more about the database, request an object of type DatabaseMetaData from the database connection."*

```java
DatabaseMetaData meta = conn.getMetaData();
```

> *"Now you are ready to get some metadata. For example, the call"*

```java
ResultSet mrs = meta.getTables(null, null, null, new String[] { "TABLE" });
```

> *"returns a result set that contains information about all tables in the database. (See the API note at the end of this section for other parameters to this method.)"*

**Dịch:** Để biết thêm về database, **yêu cầu một object kiểu `DatabaseMetaData` từ database connection**. Lời gọi trên **trả về một result set chứa thông tin về mọi table trong database**.

> *"Each row in the result set contains information about a table in the database. The third column is the name of the table. (Again, see the API note for the other columns.) The following loop gathers all table names:"*

```java
while (mrs.next())
    tableNames.addItem(mrs.getString(3));
```

**Dịch:** **Mỗi row trong result set chứa thông tin về một table** trong database. **Column thứ ba là tên của table.** Vòng lặp trên **gom mọi tên table**.

> *"There is a second important use for database metadata. Databases are complex, and the SQL standard leaves plenty of room for variability. Well over a hundred methods in the DatabaseMetaData interface can inquire about the database, including calls with such exotic names as"*

```java
meta.supportsCatalogsInPrivilegeDefinitions()
```

> *"and"*

```java
meta.nullPlusNonNullIsNull()
```

> *"Clearly, these are geared toward advanced users with special needs—in particular, those who need to write highly portable code that works with multiple databases."*

**Dịch:** Còn một công dụng quan trọng thứ hai của database metadata. **Database rất phức tạp, và chuẩn SQL để lại rất nhiều chỗ cho sự khác biệt.** **Hơn cả trăm method** trong interface `DatabaseMetaData` **hỏi được về database**, kể cả những lời gọi với cái tên kỳ lạ như trên. Rõ ràng chúng nhắm tới **người dùng nâng cao có nhu cầu đặc biệt** — nhất là những ai cần **viết code cực kỳ khả chuyển, chạy được với nhiều database**.

---

## ResultSetMetaData

> *"The DatabaseMetaData interface gives data about the database. A second metadata interface, ResultSetMetaData, reports information about a result set. Whenever you have a result set from a query, you can inquire about the number of columns and each column's name, type, and field width. Here is a typical loop:"*

```java
ResultSet rs = stat.executeQuery("SELECT * FROM " + tableName);
ResultSetMetaData meta = rs.getMetaData();
for (int i = 1; i <= meta.getColumnCount(); i++)
{
    String columnName = meta.getColumnLabel(i);
    int columnWidth = meta.getColumnDisplaySize(i);
    . . .
}
```

**Dịch:** Interface `DatabaseMetaData` cho **dữ liệu về database**. Interface metadata thứ hai — **`ResultSetMetaData`** — **báo cáo thông tin về một result set**. Mỗi khi có result set từ một query, bạn **hỏi được số column, cùng tên, kiểu và độ rộng field của từng column**.

| Interface | Cho biết về |
|---|---|
| `DatabaseMetaData` | **Database** — danh sách table, khả năng hỗ trợ của driver/database |
| `ResultSetMetaData` | **Result set** — số column, tên/kiểu/độ rộng từng column |

---

## Chương trình ViewDB

> *"In this section, we will show you how to write such a simple tool. The program in Listing 5.4 uses metadata to let you browse all tables in a database. The program also illustrates the use of a cached row set."*

**Dịch:** Phần này chỉ cách viết một công cụ đơn giản như vậy. Chương trình Listing 5.4 **dùng metadata để duyệt mọi table trong database**, đồng thời **minh hoạ việc dùng cached row set** (xem [[07 - Row Sets#5.7.2. Cached Row Sets]]).

> *"The combo box on top displays all tables in the database. Select one of them, and the center of the frame is filled with the field names of that table and the values of the first row, as shown in Figure 5.6. Click Next and Previous to scroll through the rows in the table. You can also delete a row and edit the row values. Click the Save button to save the changes to the database."*

**Dịch:** Combo box trên cùng **hiển thị mọi table** trong database. Chọn một cái thì **phần giữa khung được điền tên field của table đó cùng giá trị của row đầu tiên**. Bấm **Next** và **Previous** để cuộn qua các row. Bạn cũng **xoá được row và sửa được giá trị row**. Bấm nút **Save** để **lưu thay đổi vào database**.

> **Note (sách):** *"Many databases come with much more sophisticated tools for viewing and editing tables. If your database doesn't, check out DBeaver (https://dbeaver.io) or SQuirreL (http://squirrel-sql.sourceforge.net). These programs can view the tables in any JDBC database. Our example program is not intended as a replacement for these tools—it just shows you how to implement a tool for working with arbitrary tables."*
>
> **Dịch:** Nhiều database đi kèm **công cụ xem và sửa table tinh vi hơn nhiều**. Nếu database của bạn không có, hãy xem **DBeaver** hoặc **SQuirreL** — chúng xem được table trong bất kỳ database JDBC nào. Chương trình ví dụ của sách **không nhằm thay thế những công cụ đó** — nó **chỉ cho thấy cách implement một công cụ làm việc với table bất kỳ**.

---

### Listing 5.4 — `view/ViewDB.java`

```java
package view;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.nio.file.*;
import java.sql.*;
import java.util.*;

import javax.sql.*;
import javax.sql.rowset.*;
import javax.swing.*;

/**
 * This program uses metadata to display arbitrary tables in a database.
 * @version 1.34 2018-05-01
 * @author Cay Horstmann
 */
public class ViewDB
{
    public static void main(String[] args)
    {
        EventQueue.invokeLater(() ->
        {
            var frame = new ViewDBFrame();
            frame.setTitle("ViewDB");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}

/**
 * The frame that holds the data panel and the navigation buttons.
 */
class ViewDBFrame extends JFrame
{
    private JButton previousButton;
    private JButton nextButton;
    private JButton deleteButton;
    private JButton saveButton;
    private DataPanel dataPanel;
    private Component scrollPane;
    private JComboBox<String> tableNames;
    private Properties props;
    private CachedRowSet crs;
    private Connection conn;

    public ViewDBFrame()
    {
        tableNames = new JComboBox<String>();

        try
        {
            readDatabaseProperties();
            conn = getConnection();
            DatabaseMetaData meta = conn.getMetaData();
            try (ResultSet mrs = meta.getTables(null, null, null, new String[] { "TABLE" }))
            {
                while (mrs.next())
                    tableNames.addItem(mrs.getString(3));
            }
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
        catch (IOException ex)
        {
            ex.printStackTrace();
        }

        tableNames.addActionListener(
            event -> showTable((String) tableNames.getSelectedItem(), conn));
        add(tableNames, BorderLayout.NORTH);
        addWindowListener(new WindowAdapter()
        {
            public void windowClosing(WindowEvent event)
            {
                try
                {
                    if (conn != null) conn.close();
                }
                catch (SQLException ex)
                {
                    for (Throwable t : ex)
                        t.printStackTrace();
                }
            }
        });

        var buttonPanel = new JPanel();
        add(buttonPanel, BorderLayout.SOUTH);

        previousButton = new JButton("Previous");
        previousButton.addActionListener(event -> showPreviousRow());
        buttonPanel.add(previousButton);

        nextButton = new JButton("Next");
        nextButton.addActionListener(event -> showNextRow());
        buttonPanel.add(nextButton);

        deleteButton = new JButton("Delete");
        deleteButton.addActionListener(event -> deleteRow());
        buttonPanel.add(deleteButton);

        saveButton = new JButton("Save");
        saveButton.addActionListener(event -> saveChanges());
        buttonPanel.add(saveButton);
        if (tableNames.getItemCount() > 0)
            showTable(tableNames.getItemAt(0), conn);
    }

    /**
     * Prepares the text fields for showing a new table, and shows the first row.
     * @param tableName the name of the table to display
     * @param conn the database connection
     */
    public void showTable(String tableName, Connection conn)
    {
        try (Statement stat = conn.createStatement();
            ResultSet result = stat.executeQuery("SELECT * FROM " + tableName))
        {
            // get result set

            // copy into cached row set
            RowSetFactory factory = RowSetProvider.newFactory();
            crs = factory.createCachedRowSet();
            crs.setTableName(tableName);
            crs.populate(result);

            if (scrollPane != null) remove(scrollPane);
            dataPanel = new DataPanel(crs);
            scrollPane = new JScrollPane(dataPanel);
            add(scrollPane, BorderLayout.CENTER);
            pack();
            showNextRow();
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
    }

    /**
     * Moves to the previous table row.
     */
    public void showPreviousRow()
    {
        try
        {
            if (crs == null || crs.isFirst()) return;
            crs.previous();
            dataPanel.showRow(crs);
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
    }

    /**
     * Moves to the next table row.
     */
    public void showNextRow()
    {
        try
        {
            if (crs == null || crs.isLast()) return;
            crs.next();
            dataPanel.showRow(crs);
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
    }

    /**
     * Deletes current table row.
     */
    public void deleteRow()
    {
        if (crs == null) return;
        new SwingWorker<Void, Void>()
        {
            public Void doInBackground() throws SQLException
            {
                crs.deleteRow();
                crs.acceptChanges(conn);
                if (crs.isAfterLast())
                    if (!crs.last()) crs = null;
                return null;
            }
            public void done()
            {
                dataPanel.showRow(crs);
            }
        }.execute();
    }

    /**
     * Saves all changes.
     */
    public void saveChanges()
    {
        if (crs == null) return;
        new SwingWorker<Void, Void>()
        {
            public Void doInBackground() throws SQLException
            {
                dataPanel.setRow(crs);
                crs.acceptChanges(conn);
                return null;
            }
        }.execute();
    }

    private void readDatabaseProperties() throws IOException
    {
        props = new Properties();
        try (InputStream in = Files.newInputStream(Paths.get("database.properties")))
        {
            props.load(in);
        }
        String drivers = props.getProperty("jdbc.drivers");
        if (drivers != null) System.setProperty("jdbc.drivers", drivers);
    }

    /**
     * Gets a connection from the properties specified in the file database.properties.
     * @return the database connection
     */
    private Connection getConnection() throws SQLException
    {
        String url = props.getProperty("jdbc.url");
        String username = props.getProperty("jdbc.username");
        String password = props.getProperty("jdbc.password");

        return DriverManager.getConnection(url, username, password);
    }
}

/**
 * This panel displays the contents of a result set.
 */
class DataPanel extends JPanel
{
    private java.util.List<JTextField> fields;

    /**
     * Constructs the data panel.
     * @param rs the result set whose contents this panel displays
     */
    public DataPanel(RowSet rs) throws SQLException
    {
        fields = new ArrayList<>();
        setLayout(new GridBagLayout());
        var gbc = new GridBagConstraints();
        gbc.gridwidth = 1;
        gbc.gridheight = 1;

        ResultSetMetaData rsmd = rs.getMetaData();
        for (int i = 1; i <= rsmd.getColumnCount(); i++)
        {
            gbc.gridy = i - 1;

            String columnName = rsmd.getColumnLabel(i);
            gbc.gridx = 0;
            gbc.anchor = GridBagConstraints.EAST;
            add(new JLabel(columnName), gbc);

            int columnWidth = rsmd.getColumnDisplaySize(i);
            var tb = new JTextField(columnWidth);
            if (!rsmd.getColumnClassName(i).equals("java.lang.String"))
                tb.setEditable(false);

            fields.add(tb);

            gbc.gridx = 1;
            gbc.anchor = GridBagConstraints.WEST;
            add(tb, gbc);
        }
    }

    /**
     * Shows a database row by populating all text fields with the column values.
     */
    public void showRow(ResultSet rs)
    {
        try
        {
            if (rs == null) return;
            for (int i = 1; i <= fields.size(); i++)
            {
                String field = rs == null ? "" : rs.getString(i);
                JTextField tb = fields.get(i - 1);
                tb.setText(field);
            }
        }
        catch (SQLException ex)
        {
            for (Throwable t : ex)
                t.printStackTrace();
        }
    }

    /**
     * Updates changed data into the current row of the row set.
     */
    public void setRow(RowSet rs) throws SQLException
    {
        for (int i = 1; i <= fields.size(); i++)
        {
            String field = rs.getString(i);
            JTextField tb = fields.get(i - 1);
            if (!field.equals(tb.getText()))
                rs.updateString(i, tb.getText());
        }
        rs.updateRow();
    }
}
```

---

## API

### `java.sql.Connection` 1.1

| Method | Mô tả |
|---|---|
| `DatabaseMetaData getMetaData()` | Trả về **metadata của connection** dưới dạng một `DatabaseMetaData` object |

### `java.sql.DatabaseMetaData` 1.1

| Method | Mô tả |
|---|---|
| `ResultSet getTables(String catalog, String schemaPattern, String tableNamePattern, String types[])` | Trả về **mô tả mọi table trong một catalog** khớp với mẫu schema, mẫu tên table và tiêu chí type |
| `int getJDBCMajorVersion()` **1.4**<br>`int getJDBCMinorVersion()` **1.4** | Trả về **số phiên bản major/minor của JDBC** ở driver đã thiết lập connection. Ví dụ driver JDBC 3.0 có major = **3**, minor = **0** |
| `int getMaxConnections()` | Trả về **số connection đồng thời tối đa** được phép tới database này |
| `int getMaxStatements()` | Trả về **số statement mở đồng thời tối đa** cho mỗi connection, hoặc **0** nếu **không giới hạn hoặc không rõ** |

> *"(A schema describes a group of related tables and access permissions. A catalog describes a related group of schemas. These concepts are important for structuring large databases.)"*

**Dịch:** **Schema** mô tả **một nhóm table liên quan cùng các quyền truy cập**. **Catalog** mô tả **một nhóm schema liên quan**. Các khái niệm này **quan trọng để cấu trúc hoá database lớn**.

> *"The catalog and schemaPattern parameters can be "" to retrieve those tables without a catalog or schema, or null to return tables regardless of catalog or schema."*

**Dịch:** Parameter `catalog` và `schemaPattern` **có thể là `""`** để lấy các table **không có catalog hay schema**, hoặc **`null`** để trả về table **bất kể catalog/schema**.

> *"The types array contains the names of the table types to include. Typical types are TABLE, VIEW, SYSTEM TABLE, GLOBAL TEMPORARY, LOCAL TEMPORARY, ALIAS, and SYNONYM. If types is null, tables of all types are returned."*

**Dịch:** Array `types` chứa **tên các table type cần đưa vào**. Các type điển hình: `TABLE`, `VIEW`, `SYSTEM TABLE`, `GLOBAL TEMPORARY`, `LOCAL TEMPORARY`, `ALIAS`, `SYNONYM`. **Nếu `types` là `null` thì trả về table thuộc mọi type.**

> *"The result set has five columns, all of which are of type String."*

**Dịch:** Result set có **năm column, tất cả đều kiểu `String`**.

| Column | Name | Explanation | Dịch |
|---|---|---|---|
| 1 | `TABLE_CAT` | Table catalog (may be null) | Catalog của table (**có thể null**) |
| 2 | `TABLE_SCHEM` | Table schema (may be null) | Schema của table (**có thể null**) |
| 3 | `TABLE_NAME` | Table name | **Tên table** |
| 4 | `TABLE_TYPE` | Table type | Type của table |
| 5 | `REMARKS` | Comment on the table | Comment về table |

### `java.sql.ResultSet` 1.1

| Method | Mô tả |
|---|---|
| `ResultSetMetaData getMetaData()` | Trả về **metadata gắn với các column của `ResultSet` hiện tại** |

### `java.sql.ResultSetMetaData` 1.1

| Method | Mô tả |
|---|---|
| `int getColumnCount()` | Trả về **số column** trong `ResultSet` object hiện tại |
| `int getColumnDisplaySize(int column)` | Trả về **độ rộng tối đa** của column ứng với index đã cho |
| `String getColumnLabel(int column)` | Trả về **tiêu đề gợi ý** cho column |
| `String getColumnName(int column)` | Trả về **tên column** ứng với index đã cho |

---

## Bài kế tiếp

→ [[09 - Transactions]] — commit, rollback, save point, batch update và các kiểu SQL nâng cao.
