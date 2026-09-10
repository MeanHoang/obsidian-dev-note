# 02 — Trees

> Chapter 11, Section 11.2 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.2. Trees

> *"Every computer user who has worked with a hierarchical file system has seen tree displays. Of course, directories and files are only one of the many examples of tree-like organizations. Many tree structures arise in everyday life, such as the hierarchy of countries, states, and cities shown in Figure 11.11."*

**Dịch:** Ai từng làm việc với hệ thống file phân cấp đều đã thấy cách hiển thị dạng cây. Thư mục và file chỉ là **một trong nhiều ví dụ** về tổ chức dạng cây; ví dụ khác là **phân cấp quốc gia – bang – thành phố**.

> *"As programmers, we often need to display tree structures. Fortunately, the Swing library has a JTree class for this purpose. The JTree class (together with its helper classes) takes care of laying out the tree and processing user requests for expanding and collapsing nodes."*

**Dịch:** Thư viện Swing có class `JTree` cho mục đích này. Class `JTree` (cùng các helper class của nó) **lo việc bố trí cây và xử lý yêu cầu mở rộng / thu gọn node của người dùng**.

### Thuật ngữ

> *"Before going any further, let's settle on some terminology (see Figure 11.12). A tree is composed of nodes. Every node is either a leaf or it has child nodes. Every node, with the exception of the root node, has exactly one parent. A tree has exactly one root node. Sometimes you have a collection of trees, each with its own root node. Such a collection is called a forest."*

**Dịch:**

| Thuật ngữ | Định nghĩa (theo sách) |
|---|---|
| **node** | thành phần cấu tạo nên cây |
| **leaf** | node không có child node |
| **parent** | mọi node, **trừ root node**, có **đúng một** parent |
| **root node** | một cây có **đúng một** root node |
| **forest** | một tập hợp nhiều cây, **mỗi cây có root node riêng** |

---

## 11.2.1. Simple Trees

> *"In our first example program, we will simply display a tree with a few nodes (see Figure 11.14). As with many other Swing components, you need to provide a model of the data, and the component displays it for you. To construct a JTree, supply the tree model in the constructor:"*

```java
TreeModel model = . . .;
var tree = new JTree(model);
```

**Dịch:** Cũng như nhiều Swing component khác, bạn **cung cấp một model của data**, còn component **hiển thị nó giúp bạn**. Dựng `JTree` bằng cách đưa **tree model** vào constructor.

> **Note (sách):** *"There are also constructors that construct trees out of a collection of elements:"*
>
> ```java
> JTree(Object[] nodes)
> JTree(Vector<?> nodes)
> JTree(Hashtable<?, ?> nodes) // the values become the nodes
> ```
>
> *"These constructors are not very useful. They merely build a forest of trees, each with a single node. The third constructor seems particularly useless because the nodes appear in the seemingly random order determined by the hash codes of the keys."*
>
> **Dịch:** Cũng có constructor dựng cây từ một collection phần tử. Các constructor này **không hữu ích lắm** — chúng chỉ tạo ra một **forest gồm các cây một node**. Constructor thứ ba **đặc biệt vô dụng** vì các node xuất hiện theo thứ tự **có vẻ ngẫu nhiên**, do hash code của key quyết định.

> *"How do you obtain a tree model? You can construct your own model by creating a class that implements the TreeModel interface. You will see later in this chapter how to do that. For now, we will stick with the DefaultTreeModel that the Swing library supplies. To construct a default tree model, you must supply a root node."*

```java
TreeNode root = . . .;
var model = new DefaultTreeModel(root);
```

**Dịch:** Bạn tự dựng model được bằng cách tạo một class **implement interface `TreeModel`**. Tạm thời dùng `DefaultTreeModel` mà thư viện Swing cung cấp. Để dựng default tree model, **phải cung cấp một root node**.

> *"TreeNode is another interface. Populate the default tree model with objects of any class that implements the interface. For now, we will use the concrete node class that Swing supplies—namely, DefaultMutableTreeNode. This class implements the MutableTreeNode interface, a subinterface of TreeNode (see Figure 11.13)."*

**Dịch:** `TreeNode` cũng là một interface. Đổ vào default tree model **object của bất kỳ class nào implement interface đó**. Tạm thời ta dùng class node cụ thể mà Swing cung cấp — **`DefaultMutableTreeNode`**. Class này implement interface `MutableTreeNode`, là **subinterface của `TreeNode`**. (Xem [[01 - Interfaces]].)

### User object

> *"A default mutable tree node holds an object—the user object. The tree renders the user objects for all nodes. Unless you specify a renderer, the tree displays the string that is the result of the toString method."*

**Dịch:** Một default mutable tree node **giữ một object — gọi là user object**. Cây **render user object** cho mọi node. Nếu không chỉ định renderer, cây hiển thị **chuỗi do method `toString` trả về**.

> *"In our first example, we use strings as user objects. In practice, you would usually populate a tree with more expressive user objects. For example, when displaying a directory tree, it makes sense to use File objects for the nodes. You can specify the user object in the constructor, or you can set it later with the setUserObject method."*

```java
var node = new DefaultMutableTreeNode("Texas");
. . .
node.setUserObject("California");
```

**Dịch:** Trên thực tế bạn thường đổ vào cây các user object **giàu ý nghĩa hơn**. Ví dụ khi hiển thị cây thư mục, dùng **object `File`** cho các node là hợp lý. Chỉ định user object trong constructor, hoặc đặt sau bằng `setUserObject`.

### Nối parent/child

> *"Next, you need to establish the parent/child relationships between the nodes. Start with the root node and use the add method to add the children:"*

```java
var root = new DefaultMutableTreeNode("World");
var country = new DefaultMutableTreeNode("USA");
root.add(country);
var state = new DefaultMutableTreeNode("California");
country.add(state);
```

> *"Link up all nodes in this fashion. Then, construct a DefaultTreeModel with the root node. Finally, construct a JTree with the tree model."*

```java
var treeModel = new DefaultTreeModel(root);
var tree = new JTree(treeModel);
```

> *"Or, as a shortcut, you can simply pass the root node to the JTree constructor. Then the tree automatically constructs a default tree model:"*

```java
var tree = new JTree(root);
```

**Dịch:** Thiết lập quan hệ **parent/child** giữa các node: bắt đầu từ root node, dùng method `add` để thêm child. Nối hết mọi node theo cách đó, rồi dựng `DefaultTreeModel` với root node, cuối cùng dựng `JTree` với tree model. **Đường tắt:** truyền thẳng root node vào constructor của `JTree` — cây **tự động dựng một default tree model**.

### Listing 11.8 — `tree/SimpleTreeFrame.java`

```java
package tree;

import javax.swing.*;
import javax.swing.tree.*;

/**
 * This frame contains a simple tree that displays a manually constructed tree model.
 */
public class SimpleTreeFrame extends JFrame
{
    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 200;

    public SimpleTreeFrame()
    {
        setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        // set up tree model data

        var root = new DefaultMutableTreeNode("World");
        var country = new DefaultMutableTreeNode("USA");
        root.add(country);
        var state = new DefaultMutableTreeNode("California");
        country.add(state);
        var city = new DefaultMutableTreeNode("San Jose");
        state.add(city);
        city = new DefaultMutableTreeNode("Cupertino");
        state.add(city);
        state = new DefaultMutableTreeNode("Michigan");
        country.add(state);
        city = new DefaultMutableTreeNode("Ann Arbor");
        state.add(city);
        country = new DefaultMutableTreeNode("Germany");
        root.add(country);
        state = new DefaultMutableTreeNode("Schleswig-Holstein");
        country.add(state);
        city = new DefaultMutableTreeNode("Kiel");
        state.add(city);

        // construct tree and put it in a scroll pane

        var tree = new JTree(root);
        add(new JScrollPane(tree));
    }
}
```

### Handle, line style, root

> *"When you run the program, the tree first looks as in Figure 11.15. Only the root node and its children are visible. Click on the circle icons (the handles) to open up the subtrees. The line sticking out from the handle icon points to the right when the subtree is collapsed and down when the subtree is expanded (see Figure 11.16). We don't know what the designers of the Metal look-and-feel had in mind, but we think of the icon as a door handle. You push down on the handle to open the subtree."*

**Dịch:** Ban đầu **chỉ root node và các child của nó hiện ra**. Bấm vào các icon hình tròn (**handle**) để mở subtree. Đường kẻ thò ra từ icon handle **chỉ sang phải khi subtree đang thu gọn** và **chỉ xuống khi subtree đang mở**. Tác giả ví icon này như **tay nắm cửa**: ấn tay nắm xuống để mở subtree.

> **Note (sách):** *"Of course, the display of the tree depends on the selected look-and-feel. We just described the Metal look-and-feel. In the Windows look-and-feel, the handles have the more familiar look—a "–" or "+" in a box (see Figure 11.17)."*
>
> **Dịch:** Cách hiển thị cây **phụ thuộc look-and-feel** đang chọn. Mô tả trên là look-and-feel **Metal**. Trong look-and-feel **Windows**, handle có hình quen thuộc hơn — dấu **"–" hoặc "+" trong một ô vuông**.

> *"You can use the following magic incantation to turn off the lines joining parents and children (see Figure 11.18):"*

```java
tree.putClientProperty("JTree.lineStyle", "None");
```

> *"Conversely, to make sure that the lines are shown, use"*

```java
tree.putClientProperty("JTree.lineStyle", "Angled");
```

> *"Another line style, "Horizontal", is shown in Figure 11.19. The tree is displayed with horizontal lines separating only the children of the root. We aren't quite sure what it is good for."*

**Dịch:** Dùng "câu thần chú" trên để **tắt các đường nối parent với child**; ngược lại, dùng `"Angled"` để chắc chắn đường nối được hiển thị. Còn một line style nữa là **`"Horizontal"`**: cây hiển thị với các đường ngang **chỉ ngăn cách các child của root**. Sách nói **không rõ nó dùng để làm gì**.

> *"By default, there is no handle for collapsing the root of the tree. If you like, you can add one with the call"*

```java
tree.setShowsRootHandles(true);
```

> *"Now you can collapse the entire tree into the root node."*

**Dịch:** Mặc định **root của cây không có handle để thu gọn**. Bạn thêm được bằng `setShowsRootHandles(true)`. Khi đó **thu gọn được cả cây vào root node**.

> *"Conversely, you can hide the root altogether. You will thus display a forest—a set of trees, each with its own root. You still must join all trees in the forest to a common root; then, hide the root with the instruction"*

```java
tree.setRootVisible(false);
```

> *"Look at Figure 11.21. There appear to be two roots, labeled "USA" and "Germany." The actual root that joins the two is made invisible."*

**Dịch:** Ngược lại, **giấu hẳn root** được. Khi đó bạn hiển thị một **forest**. Bạn **vẫn phải nối mọi cây trong forest vào một root chung**, rồi giấu root đó đi. Nhìn thì như có **hai root** ("USA" và "Germany"); root thật nối hai cây **đã được làm cho vô hình**.

### Icon leaf và icon folder

> *"When the tree is displayed, each node is drawn with an icon. There are actually three kinds of icons: a leaf icon, an opened nonleaf icon, and a closed nonleaf icon. For simplicity, we refer to the last two as folder icons."*

**Dịch:** Mỗi node được vẽ kèm một icon. Thực ra có **ba loại icon**: **leaf icon**, **opened nonleaf icon**, và **closed nonleaf icon**. Cho gọn, sách gọi hai loại sau là **folder icon**.

> *"The node renderer needs to know which icon to use for each node. By default, the decision process works like this: If the isLeaf method of a node returns true, then the leaf icon is used; otherwise, a folder icon is used."*

> *"The isLeaf method of the DefaultMutableTreeNode class returns true if the node has no children. Thus, nodes with children get folder icons, and nodes without children get leaf icons."*

**Dịch:** Mặc định: nếu method `isLeaf` của một node trả về `true` thì dùng **leaf icon**, ngược lại dùng **folder icon**. `isLeaf` của `DefaultMutableTreeNode` trả về `true` nếu node **không có child** — nên node có child được folder icon, node không child được leaf icon.

> *"Sometimes, that behavior is not appropriate. Suppose we added a node "Montana" to our sample tree, but we're at a loss as to what cities to add. We would not want the state node to get a leaf icon because, conceptually, only the cities are leaves."*

**Dịch:** Đôi khi hành vi đó **không phù hợp**. Giả sử ta thêm node "Montana" nhưng chưa biết thêm thành phố nào. Ta **không muốn node bang nhận leaf icon**, vì **về mặt khái niệm chỉ thành phố mới là leaf**.

> *"The JTree class has no idea which nodes should be leaves. It asks the tree model. If a childless node isn't automatically a conceptual leaf, you can ask the tree model to use a different criterion for leafiness—namely, to query the "allows children" node property. For those nodes that should not have children, call"*

```java
node.setAllowsChildren(false);
```

> *"Then, tell the tree model to ask the value of the "allows children" property to determine whether a node should be displayed with a leaf icon. Use the setAsksAllowsChildren method of the DefaultTreeModel class to set this behavior:"*

```java
model.setAsksAllowsChildren(true);
```

> *"With this decision criterion, nodes that allow children get folder icons, and nodes that don't allow children get leaf icons."*

> *"Alternatively, if you construct the tree from the root node, supply the setting for the "asks allows children" property in the constructor."*

```java
var tree = new JTree(root, true); // nodes that don't allow children get leaf icons
```

**Dịch:** Class `JTree` **không hề biết** node nào nên là leaf — nó **hỏi tree model**. Nếu một node không có child mà **không tự nhiên là leaf về mặt khái niệm**, bạn bảo tree model dùng tiêu chí khác: **truy vấn property "allows children"** của node. Với tiêu chí này, node **cho phép có child** nhận folder icon, node **không cho phép có child** nhận leaf icon.

### API — `javax.swing.JTree` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `JTree(TreeModel model)` | dựng một cây từ một tree model |
| `JTree(TreeNode root)` · `JTree(TreeNode root, boolean asksAllowChildren)` | dựng cây với một default tree model hiển thị root và các child của nó. `asksAllowsChildren` = `true` để dùng property "allows children" của node nhằm quyết định node có phải leaf hay không |
| `void setShowsRootHandles(boolean b)` | nếu `b` là `true`, root node có handle để thu gọn/mở rộng các child |
| `void setRootVisible(boolean b)` | nếu `b` là `true` thì root node được hiển thị; ngược lại nó bị giấu |

### API — `javax.swing.tree.TreeNode` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `boolean isLeaf()` | trả về `true` nếu node này **về mặt khái niệm** là một leaf |
| `boolean getAllowsChildren()` | trả về `true` nếu node này **có thể có** child node |

### API — `javax.swing.tree.MutableTreeNode` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void setUserObject(Object userObject)` | đặt "user object" mà tree node dùng để rendering |

### API — `javax.swing.tree.TreeModel` 1.2 (leaf)

| Method | Công dụng (theo sách) |
|---|---|
| `boolean isLeaf(Object node)` | trả về `true` nếu `node` nên được hiển thị như một leaf node |

### API — `javax.swing.tree.DefaultTreeModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void setAsksAllowsChildren(boolean b)` | nếu `b` là `true`, node hiển thị dạng leaf khi `getAllowsChildren` của nó trả về `false`; ngược lại chúng hiển thị dạng leaf khi `isLeaf` trả về `true` |

### API — `javax.swing.tree.DefaultMutableTreeNode` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `DefaultMutableTreeNode(Object userObject)` | dựng một mutable tree node với user object đã cho |
| `void add(MutableTreeNode child)` | thêm một node làm **child cuối cùng** của node này |
| `void setAllowsChildren(boolean b)` | nếu `b` là `true`, thêm được child vào node này |

### API — `javax.swing.JComponent` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void putClientProperty(Object key, Object value)` | thêm một cặp key/value vào một bảng nhỏ mà mỗi component tự quản lý. Đây là cơ chế **"cửa thoát hiểm"** mà một số Swing component dùng để lưu property đặc thù cho một look-and-feel |

---

## 11.2.1.1. Editing Trees and Tree Paths

> *"In the next example program, you will see how to edit a tree. Figure 11.23 shows the user interface. If you click the Add Sibling or Add Child button, the program adds a new node (with title New) to the tree. If you click the Delete button, the program deletes the currently selected node."*

**Dịch:** Bấm nút **Add Sibling** hoặc **Add Child** thì chương trình thêm một node mới (tiêu đề *New*) vào cây. Bấm nút **Delete** thì xoá node đang được chọn.

> *"To implement this behavior, you need to find out which tree node is currently selected. The JTree class has a surprising way of identifying nodes in a tree. It does not deal with tree nodes but with paths of objects, called tree paths. A tree path starts at the root and consists of a sequence of child nodes (see Figure 11.24)."*

**Dịch:** Class `JTree` có một cách **rất bất ngờ** để định danh node trong cây: **nó không làm việc với tree node mà với các đường đi (path) của object, gọi là tree path**. Một **tree path bắt đầu từ root** và gồm **một dãy các child node**.

> *"You might wonder why the JTree class needs the whole path. Couldn't it just get a TreeNode and keep calling the getParent method? In fact, the JTree class knows nothing about the TreeNode interface. That interface is never used by the TreeModel interface; it is only used by the DefaultTreeModel implementation. You can have other tree models in which the nodes do not implement the TreeNode interface at all. If you use a tree model that manages other types of objects, those objects might not have getParent and getChild methods. They would of course need to have some other connection to each other. It is the job of the tree model to link nodes together. The JTree class itself has no clue about the nature of their linkage. For that reason, the JTree class always needs to work with complete paths."*

**Dịch:** Vì sao `JTree` cần **cả đường đi**? Thực ra `JTree` **chẳng biết gì về interface `TreeNode`**. Interface đó **không bao giờ được interface `TreeModel` dùng tới**; nó chỉ được implementation `DefaultTreeModel` dùng. Bạn có thể có tree model khác mà **node hoàn toàn không implement `TreeNode`** — những object đó có thể **không có method `getParent` và `getChild`**. Việc **nối các node lại với nhau là nhiệm vụ của tree model**; bản thân `JTree` **không biết gì về bản chất mối liên kết đó**. Vì vậy `JTree` **luôn phải làm việc với đường đi đầy đủ**.

> *"The TreePath class manages a sequence of Object (not TreeNode!) references. A number of JTree methods return TreePath objects. When you have a tree path, you usually just need to know the terminal node, which you can get with the getLastPathComponent method. For example, to find out the currently selected node in a tree, use the getSelectionPath method of the JTree class. You will get a TreePath object back, from which you can retrieve the actual node."*

```java
TreePath selectionPath = tree.getSelectionPath();
var selectedNode = (DefaultMutableTreeNode) selectionPath.getLastPathComponent();
```

**Dịch:** Class `TreePath` quản lý **một dãy reference kiểu `Object`** (**không phải `TreeNode`!**). Khi có một tree path, thường bạn chỉ cần biết **node cuối cùng**, lấy bằng `getLastPathComponent`.

> *"Actually, since this particular query is so common, there is a convenience method that gives the selected node immediately:"*

```java
var selectedNode = (DefaultMutableTreeNode) tree.getLastSelectedPathComponent();
```

> *"This method is not called getSelectedNode because the tree does not know that it contains nodes—its tree model deals only with paths of objects."*

**Dịch:** Method này **không tên là `getSelectedNode`** vì cây **không biết rằng nó chứa node** — tree model của nó chỉ làm việc với **các đường đi của object**.

> **Note (sách):** *"Tree paths are one of the two ways in which the JTree class describes nodes. Quite a few JTree methods take or return an integer index—the row position. A row position is simply the row number (starting with 0) of the node in the tree display. Only visible nodes have row numbers, and the row number of a node changes if other nodes before it are expanded, collapsed, or modified. For that reason, you should avoid row positions. All JTree methods that use row positions have equivalents that use tree paths instead."*
>
> **Dịch:** Tree path là **một trong hai cách** `JTree` mô tả node. Khá nhiều method của `JTree` nhận hoặc trả về một index kiểu `int` — **row position**, tức số thứ tự dòng (bắt đầu từ 0) của node trong phần hiển thị cây. **Chỉ node đang hiển thị mới có row number**, và row number của một node **thay đổi khi các node trước nó được mở, thu gọn hoặc sửa đổi**. Vì vậy **nên tránh dùng row position**. Mọi method của `JTree` dùng row position đều **có method tương đương dùng tree path**.

### Sửa cây phải qua model

> *"Once you have the selected node, you can edit it. However, do not simply add children to a tree node:"*

```java
selectedNode.add(newNode); // No!
```

> *"If you change the structure of the nodes, you change the model but the associated view is not notified. You could send out a notification yourself, but if you use the insertNodeInto method of the DefaultTreeModel class, the model class takes care of that. For example, the following call appends a new node as the last child of the selected node and notifies the tree view:"*

```java
model.insertNodeInto(newNode, selectedNode, selectedNode.getChildCount());
```

> *"The analogous call removeNodeFromParent removes a node and notifies the view:"*

```java
model.removeNodeFromParent(selectedNode);
```

> *"If you keep the node structure in place but change the user object, you should call the following method:"*

```java
model.nodeChanged(changedNode);
```

**Dịch:** **Đừng chỉ đơn giản `add` child vào tree node.** Nếu bạn đổi cấu trúc node, bạn **đổi model nhưng view liên đới không được thông báo**. Bạn tự gửi thông báo được, nhưng nếu dùng `insertNodeInto` của `DefaultTreeModel` thì **class model lo giúp việc đó**. Tương tự có `removeNodeFromParent`. Nếu **giữ nguyên cấu trúc node nhưng đổi user object** thì gọi `nodeChanged`.

> *"The automatic notification is a major advantage of using the DefaultTreeModel. If you supply your own tree model, you have to implement automatic notification by hand."*

**Dịch:** **Thông báo tự động là lợi thế lớn** của việc dùng `DefaultTreeModel`. Nếu tự cung cấp tree model thì bạn **phải tự implement việc thông báo tự động**.

> **Caution (sách):** *"The DefaultTreeModel class has a reload method that reloads the entire model. However, don't call reload simply to update the tree after making a few changes. When the tree is regenerated, all nodes beyond the root's children are collapsed again. It will be quite disconcerting to your users if they have to keep expanding the tree after every change."*
>
> **Dịch:** Class `DefaultTreeModel` có method `reload` nạp lại **toàn bộ model**. Nhưng **đừng gọi `reload` chỉ để cập nhật cây** sau vài thay đổi. Khi cây được sinh lại, **mọi node bên dưới các child của root đều bị thu gọn lại**. Người dùng sẽ **rất bối rối** nếu cứ phải mở rộng lại cây sau mỗi thay đổi.

### Làm node mới hiện ra

> *"When the view is notified of a change in the node structure, it updates the display but does not automatically expand a node to show newly added children. In particular, if a user in our sample program adds a new child node to a node for which children are currently collapsed, the new node is silently added to the collapsed subtree. This gives the user no feedback that the command was actually carried out. In such a case, you should make a special effort to expand all parent nodes so that the newly added node becomes visible. Use the makeVisible method of the JTree class for this purpose. The makeVisible method expects a tree path leading to the node that should become visible."*

**Dịch:** Khi view được báo có thay đổi cấu trúc node, nó cập nhật hiển thị nhưng **không tự động mở rộng node để lộ các child mới thêm**. Node mới bị **thêm âm thầm vào subtree đang thu gọn**, khiến người dùng **không nhận được phản hồi** rằng lệnh đã được thực hiện. Khi đó bạn nên **cố mở rộng mọi parent node** để node mới hiện ra, bằng method `makeVisible` của `JTree` — nó **cần một tree path dẫn tới node** cần hiện ra.

> *"Thus, you need to construct a tree path from the root to the newly inserted node. To get a tree path, first call the getPathToRoot method of the DefaultTreeModel class. It returns a TreeNode[] array of all nodes from a node to the root node. Pass that array to a TreePath constructor. For example, here is how you make the new node visible:"*

```java
TreeNode[] nodes = model.getPathToRoot(newNode);
var path = new TreePath(nodes);
tree.makeVisible(path);
```

**Dịch:** Gọi `getPathToRoot` của `DefaultTreeModel` — nó trả về **mảng `TreeNode[]`** gồm mọi node từ một node tới root node. Truyền mảng đó vào constructor của `TreePath`.

> **Note (sách):** *"It is curious that the DefaultTreeModel class feigns almost complete ignorance of the TreePath class, even though its job is to communicate with a JTree. The JTree class uses tree paths a lot, and it never uses arrays of node objects."*
>
> **Dịch:** Kỳ lạ là class `DefaultTreeModel` **giả vờ gần như không biết gì về class `TreePath`**, dù nhiệm vụ của nó là **giao tiếp với một `JTree`**. Class `JTree` dùng tree path rất nhiều và **không bao giờ dùng mảng object node**.

> *"Now, suppose your tree is contained inside a scroll pane. After the tree node expansion, the new node might still not be visible because it falls outside the viewport. To overcome that problem, call"*

```java
tree.scrollPathToVisible(path);
```

> *"instead of calling makeVisible. This call expands all nodes along the path and tells the ambient scroll pane to scroll the node at the end of the path into view (see Figure 11.25)."*

**Dịch:** Nếu cây nằm trong một scroll pane, sau khi mở rộng node, node mới **vẫn có thể không nhìn thấy** vì nó **nằm ngoài viewport**. Khắc phục bằng cách gọi `scrollPathToVisible` thay cho `makeVisible`: nó **mở rộng mọi node dọc theo path** và bảo scroll pane bao quanh **cuộn node cuối path vào tầm nhìn**.

### Cho phép sửa node

> *"By default, tree nodes cannot be edited. However, if you call"*

```java
tree.setEditable(true);
```

> *"the user can edit a node simply by double-clicking, editing the string, and pressing the Enter key. Double-clicking invokes the default cell editor, which is implemented by the DefaultCellEditor class (see Figure 11.26). It is possible to install other cell editors, using the same process that you have seen in our discussion of table cell editors."*

**Dịch:** Mặc định **tree node không sửa được**. Sau khi gọi `setEditable(true)`, người dùng sửa node bằng cách **bấm đúp, sửa chuỗi, rồi nhấn Enter**. Bấm đúp gọi tới **default cell editor**, được implement bởi class `DefaultCellEditor`. Cài được cell editor khác, theo **đúng quy trình đã thấy ở phần table cell editor** ([[01 - Tables#11.1.4.4. Custom Editors]]).

### API — `javax.swing.JTree` 1.2 (selection và path)

| Method | Công dụng (theo sách) |
|---|---|
| `TreePath getSelectionPath()` | lấy path tới node đang được chọn, hoặc path tới node được chọn đầu tiên nếu chọn nhiều node. Trả về `null` nếu không node nào được chọn |
| `Object getLastSelectedPathComponent()` | lấy object node đại diện node đang được chọn, hoặc node đầu tiên nếu chọn nhiều. Trả về `null` nếu không có |
| `void makeVisible(TreePath path)` | mở rộng mọi node dọc theo path |
| `void scrollPathToVisible(TreePath path)` | mở rộng mọi node dọc theo path và, nếu cây nằm trong scroll pane, cuộn để đảm bảo **node cuối path nhìn thấy được** |

### API — `javax.swing.tree.TreePath` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Object getLastPathComponent()` | lấy object cuối cùng trên path này — tức object node mà path đại diện |

### API — `javax.swing.tree.TreeNode` 1.2 (duyệt)

| Method | Công dụng (theo sách) |
|---|---|
| `TreeNode getParent()` | trả về parent node của node này |
| `TreeNode getChildAt(int index)` | tra child node ở index đã cho. Index phải nằm giữa `0` và `getChildCount() - 1` |
| `int getChildCount()` | trả về số child của node này |
| `Enumeration children()` | trả về một object enumeration lặp qua mọi child của node này |

### API — `javax.swing.tree.DefaultTreeModel` 1.2 (sửa đổi)

| Method | Công dụng (theo sách) |
|---|---|
| `void insertNodeInto(MutableTreeNode newChild, MutableTreeNode parent, int index)` | chèn `newChild` làm child mới của `parent` tại index đã cho **và thông báo cho tree model listener** |
| `void removeNodeFromParent(MutableTreeNode node)` | gỡ `node` khỏi model này và thông báo cho tree model listener |
| `void nodeChanged(TreeNode node)` | báo cho tree model listener rằng `node` đã thay đổi |
| `void nodesChanged(TreeNode parent, int[] changedChildIndexes)` | báo cho listener rằng mọi child node của `parent` ở các index đã cho đã thay đổi |
| `void reload()` | nạp lại mọi node vào model. Đây là thao tác **quyết liệt**, chỉ nên dùng khi node đã thay đổi hoàn toàn do một tác động bên ngoài |

---

## 11.2.2. Node Enumeration

> *"Sometimes you need to find a node in a tree by starting at the root and visiting all children until you have found a match. The DefaultMutableTreeNode class has several convenience methods for iterating through nodes."*

**Dịch:** Đôi khi bạn cần tìm một node trong cây bằng cách **xuất phát từ root và ghé thăm mọi child** cho tới khi tìm thấy. Class `DefaultMutableTreeNode` có **vài convenience method** để lặp qua các node.

> *"The breadthFirstEnumeration and depthFirstEnumeration methods return enumeration objects whose nextElement method visits all children of the current node, using either a breadth-first or depth-first traversal. Figure 11.27 shows the traversals for a sample tree—the node labels indicate the order in which the nodes are traversed."*

**Dịch:** `breadthFirstEnumeration` và `depthFirstEnumeration` trả về object enumeration mà method `nextElement` của chúng ghé thăm mọi child của node hiện tại, theo **duyệt bề rộng** hoặc **duyệt bề sâu**.

> *"Breadth-first enumeration is the easiest to visualize. The tree is traversed in layers. The root is visited first, followed by all of its children, then the grandchildren, and so on."*

**Dịch:** **Breadth-first** dễ hình dung nhất: cây được duyệt **theo từng lớp** — root trước, rồi tới mọi child của nó, rồi tới các cháu, v.v.

> *"To visualize depth-first enumeration, imagine a rat trapped in a tree-shaped maze. It rushes along the first path until it comes to a leaf. Then, it backtracks and turns around to the next path, and so on."*

**Dịch:** Để hình dung **depth-first**, hãy tưởng tượng một **con chuột bị nhốt trong mê cung hình cây**: nó lao theo lối đi đầu tiên cho tới khi gặp một leaf, rồi **quay lui** và rẽ sang lối kế tiếp, cứ thế.

> *"Computer scientists also call this postorder traversal because the search process visits the children before visiting the parents. The postOrderEnumeration method is a synonym for depthFirstEnumeration. For completeness, there is also a preOrderEnumeration, a depth-first search that enumerates parents before the children."*

**Dịch:** Giới khoa học máy tính cũng gọi đây là **postorder traversal** vì quá trình tìm kiếm **ghé thăm child trước parent**. Method `postOrderEnumeration` là **từ đồng nghĩa** của `depthFirstEnumeration`. Cho đầy đủ, còn có `preOrderEnumeration` — tìm kiếm theo chiều sâu nhưng **liệt kê parent trước child**.

> *"Here is the typical usage pattern:"*

```java
Enumeration breadthFirst = node.breadthFirstEnumeration();
while (breadthFirst.hasMoreElements())
    // do something with breadthFirst.nextElement();
```

> *"Finally, a related method, pathFromAncestorEnumeration, finds a path from an ancestor to a given node and enumerates the nodes along that path. That's no big deal—it just keeps calling getParent until the ancestor is found and then presents the path in reverse order."*

**Dịch:** Method liên quan `pathFromAncestorEnumeration` tìm đường đi **từ một tổ tiên tới một node đã cho** và liệt kê các node dọc đường. Chẳng có gì ghê gớm — nó chỉ **liên tục gọi `getParent`** cho tới khi tìm thấy tổ tiên rồi **trình bày đường đi theo thứ tự ngược lại**.

> *"In our next example program, we put node enumeration to work. The program displays inheritance trees of classes. Type the name of a class into the text field on the bottom of the frame. The class and all of its superclasses are added to the tree (see Figure 11.28)."*

> *"In this example, we take advantage of the fact that the user objects of the tree nodes can be objects of any type. Since our nodes describe classes, we store Class objects in the nodes."*

**Dịch:** Chương trình ví dụ hiển thị **cây kế thừa của các class**. Ta tận dụng việc user object của tree node **có thể là object kiểu bất kỳ** — vì node mô tả class nên ta **lưu object `Class` trong node**.

> *"We don't want to add the same class object twice, so we need to check whether a class already exists in the tree. The following method finds the node with a given user object if it exists in the tree:"*

```java
public DefaultMutableTreeNode findUserObject(Object obj)
{
    Enumeration e = root.breadthFirstEnumeration();
    while (e.hasMoreElements())
    {
        DefaultMutableTreeNode node = (DefaultMutableTreeNode) e.nextElement();
        if (node.getUserObject().equals(obj))
            return node;
    }
    return null;
}
```

**Dịch:** Ta **không muốn thêm cùng một class object hai lần**, nên phải kiểm tra xem class đã có trong cây chưa. Method trên tìm node có user object đã cho, nếu nó tồn tại trong cây.

### API — `javax.swing.tree.DefaultMutableTreeNode` 1.2 (enumeration)

| Method | Công dụng (theo sách) |
|---|---|
| `Enumeration breadthFirstEnumeration()` · `Enumeration depthFirstEnumeration()` · `Enumeration preOrderEnumeration()` · `Enumeration postOrderEnumeration()` | trả về object enumeration để ghé thăm mọi node của tree model theo một thứ tự nhất định. Trong **breadth-first**, child gần root hơn được thăm trước. Trong **depth-first**, mọi child của một node được liệt kê hết trước khi thăm các anh em của nó. `postOrderEnumeration` là **từ đồng nghĩa** của `depthFirstEnumeration`. Duyệt **preorder** giống postorder, chỉ khác là **parent được liệt kê trước child** |

---

## 11.2.3. Rendering Nodes

> *"In your applications, you will often need to change the way a tree component draws the nodes. The most common change is, of course, to choose different icons for nodes and leaves. Other changes might involve changing the font of the node labels or drawing images at the nodes. All these changes are possible by installing a new tree cell renderer into the tree. By default, the JTree class uses DefaultTreeCellRenderer objects to draw each node. The DefaultTreeCellRenderer class extends the JLabel class. The label contains the node icon and the node label."*

**Dịch:** Mọi thay đổi cách vẽ node đều làm được bằng cách **cài một tree cell renderer mới** vào cây. Mặc định `JTree` dùng object `DefaultTreeCellRenderer` để vẽ từng node. Class `DefaultTreeCellRenderer` **extend class `JLabel`**; label chứa **icon của node và nhãn của node**.

> **Note (sách):** *"The cell renderer does not draw the "handles" for expanding and collapsing subtrees. The handles are part of the look-and-feel, and it is recommended that you do not change them."*
>
> **Dịch:** Cell renderer **không vẽ các "handle"** dùng để mở rộng / thu gọn subtree. Handle là **một phần của look-and-feel**, và sách **khuyên không nên đổi chúng**.

> *"You can customize the display in three ways."*
>
> *"• You can change the icons, font, and background color used by a DefaultTreeCellRenderer. These settings are used for all nodes in the tree."*
> *"• You can install a renderer that extends the DefaultTreeCellRenderer class and vary the icons, fonts, and background color for each node."*
> *"• You can install a renderer that implements the TreeCellRenderer interface to draw a custom image for each node."*

**Dịch:** Ba cách tuỳ biến hiển thị:

| # | Cách |
|---|---|
| 1 | Đổi icon, font, background color mà một `DefaultTreeCellRenderer` dùng. Các thiết lập này **áp dụng cho mọi node trong cây** |
| 2 | Cài một renderer **extend class `DefaultTreeCellRenderer`** và **thay đổi icon, font, background color cho từng node** |
| 3 | Cài một renderer **implement interface `TreeCellRenderer`** để vẽ **hình ảnh tuỳ ý cho từng node** |

> *"Let us look at these possibilities one by one. The easiest customization is to construct a DefaultTreeCellRenderer object, change the icons, and install it into the tree:"*

```java
var renderer = new DefaultTreeCellRenderer();
renderer.setLeafIcon(new ImageIcon("blue-ball.gif")); // used for leaf nodes
renderer.setClosedIcon(new ImageIcon("red-ball.gif")); // used for collapsed nodes
renderer.setOpenIcon(new ImageIcon("yellow-ball.gif")); // used for expanded nodes
tree.setCellRenderer(renderer);
```

**Dịch:** Cách tuỳ biến **dễ nhất**: dựng một object `DefaultTreeCellRenderer`, đổi icon, rồi cài vào cây.

> *"We don't recommend that you change the font or background color for an entire tree—that is really the job of the look-and-feel. However, it can be useful to change the font of some nodes in a tree to highlight them. If you look carefully at Figure 11.28, you will notice that the abstract classes are set in italics."*

**Dịch:** Sách **không khuyến nghị đổi font hay background color cho cả cây** — đó thực sự là **việc của look-and-feel**. Nhưng **đổi font của một số node để làm nổi bật** thì hữu ích. Trong ví dụ, các **abstract class được in nghiêng**.

> *"To change the appearance of individual nodes, install a tree cell renderer. Tree cell renderers are very similar to the list cell renderers we discussed earlier in this chapter. The TreeCellRenderer interface has a single method:"*

```java
Component getTreeCellRendererComponent(JTree tree, Object value, boolean selected,
    boolean expanded, boolean leaf, int row, boolean hasFocus)
```

> *"The getTreeCellRendererComponent method of the DefaultTreeCellRenderer class returns this—in other words, a label. (The DefaultTreeCellRenderer class extends the JLabel class.) To customize the component, extend the DefaultTreeCellRenderer class. Override the getTreeCellRendererComponent method as follows: Call the superclass method so it can prepare the label data, customize the label properties, and finally return this."*

```java
class MyTreeCellRenderer extends DefaultTreeCellRenderer
{
    public Component getTreeCellRendererComponent(JTree tree, Object value, boolean selected,
        boolean expanded, boolean leaf, int row, boolean hasFocus)
    {
        Component comp = super.getTreeCellRendererComponent(tree, value, selected,
            expanded, leaf, row, hasFocus);
        DefaultMutableTreeNode node = (DefaultMutableTreeNode) value;
        // look at node.getUserObject();
        // Font font = appropriate font;
        comp.setFont(font);
        return comp;
    }
};
```

**Dịch:** Quy trình override: **gọi method của superclass** để nó chuẩn bị data cho label, **tuỳ biến các property của label**, cuối cùng **`return this`**.

> **Caution (sách):** *"The value parameter of the getTreeCellRendererComponent method is the node object, not the user object! Recall that the user object is a feature of the DefaultMutableTreeNode, and that a JTree can contain nodes of an arbitrary type. If your tree uses DefaultMutableTreeNode nodes, you must retrieve the user object in a second step, as we did in the preceding code sample."*
>
> **Dịch:** Parameter `value` của `getTreeCellRendererComponent` là **object node, KHÔNG phải user object!** Nhớ rằng user object là **đặc tính của `DefaultMutableTreeNode`**, và một `JTree` **chứa được node kiểu tuỳ ý**. Nếu cây của bạn dùng node `DefaultMutableTreeNode` thì phải **lấy user object ở một bước thứ hai**.

> **Caution (sách):** *"The DefaultTreeCellRenderer uses the same label object for all nodes, only changing the label text for each node. If you change the font for a particular node, you must set it back to its default value when the method is called again. Otherwise, all subsequent nodes will be drawn in the changed font! Look at the code in Listing 11.10 to see how to restore the font to the default."*
>
> **Dịch:** `DefaultTreeCellRenderer` **dùng chung một object label cho mọi node**, chỉ đổi text của label cho từng node. Nếu bạn đổi font cho một node cụ thể thì **phải đặt lại về giá trị mặc định** khi method được gọi lần sau. Nếu không, **mọi node phía sau sẽ bị vẽ bằng font đã đổi!**

> *"The ClassNameTreeCellRenderer in Listing 11.10 sets the class name in either the normal or italic font, depending on the ABSTRACT modifier of the Class object. We don't want to set a particular font because we don't want to change whatever font the look-and-feel normally uses for labels. For that reason, we use the font from the label and derive an italic font from it. Recall that only a single shared JLabel object is returned by all calls. We need to hang on to the original font and restore it in the next call to the getTreeCellRendererComponent method."*

**Dịch:** Ta **không muốn đặt một font cụ thể** vì không muốn thay đổi font mà look-and-feel vẫn dùng cho label. Vì vậy ta **lấy font từ chính label** và **dẫn xuất ra một font in nghiêng** từ nó. Nhớ rằng **mọi lời gọi đều trả về cùng một object `JLabel` dùng chung**, nên ta phải **giữ lại font gốc và khôi phục nó** ở lần gọi sau.

### Listing 11.11 — `treeRender/ClassNameTreeCellRenderer.java`

```java
package treeRender;

import java.awt.*;
import java.lang.reflect.*;
import javax.swing.*;
import javax.swing.tree.*;

/**
 * This class renders a class name either in plain or italic. Abstract classes are italic.
 */
public class ClassNameTreeCellRenderer extends DefaultTreeCellRenderer
{
    private Font plainFont = null;
    private Font italicFont = null;

    public Component getTreeCellRendererComponent(JTree tree, Object value, boolean selected,
        boolean expanded, boolean leaf, int row, boolean hasFocus)
    {
        super.getTreeCellRendererComponent(tree, value, selected, expanded, leaf,
            row, hasFocus);
        // get the user object
        var node = (DefaultMutableTreeNode) value;
        Class<?> c = (Class<?>) node.getUserObject();

        // the first time, derive italic font from plain font
        if (plainFont == null)
        {
            plainFont = getFont();
            // the tree cell renderer is sometimes called with a label that has a null font
            if (plainFont != null) italicFont = plainFont.deriveFont(Font.ITALIC);
        }

        // set font to italic if the class is abstract, plain otherwise
        if ((c.getModifiers() & Modifier.ABSTRACT) == 0) setFont(plainFont);
        else setFont(italicFont);
        return this;
    }
}
```

### API — `javax.swing.tree.TreeCellRenderer` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Component getTreeCellRendererComponent(JTree tree, Object value, boolean selected, boolean expanded, boolean leaf, int row, boolean hasFocus)` | trả về một component mà method `paint` của nó được gọi để render một tree cell. `tree` = cây chứa node cần render · `value` = **node** cần render · `selected` = `true` nếu node đang được chọn · `expanded` = `true` nếu các child của node đang hiển thị · `leaf` = `true` nếu node cần hiển thị dạng leaf · `row` = dòng hiển thị chứa node · `hasFocus` = `true` nếu node đang có input focus |

### API — `javax.swing.tree.DefaultTreeCellRenderer` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void setLeafIcon(Icon icon)` · `void setOpenIcon(Icon icon)` · `void setClosedIcon(Icon icon)` | đặt icon hiển thị cho **leaf node**, **node đang mở**, và **node đang thu gọn** |

---

## 11.2.4. Listening to Tree Events

> *"Most commonly, a tree component is paired with some other component. When the user selects tree nodes, some information shows up in another window. See Figure 11.29 for an example. When the user selects a class, the instance and static variables of that class are displayed in the text area to the right."*

**Dịch:** Thông thường nhất, component cây được **ghép với một component khác**: khi người dùng chọn node, **thông tin nào đó hiện ra ở cửa sổ khác**.

> *"To obtain this behavior, you need to install a tree selection listener. The listener must implement the TreeSelectionListener interface—an interface with a single method:"*

```java
void valueChanged(TreeSelectionEvent event)
```

> *"That method is called whenever the user selects or deselects tree nodes. Add the listener to the tree in the normal way:"*

```java
tree.addTreeSelectionListener(listener);
```

**Dịch:** Cài một **tree selection listener** implement interface `TreeSelectionListener` — interface **chỉ có một method**, được gọi mỗi khi người dùng **chọn hoặc bỏ chọn** tree node.

> *"You can specify whether the user is allowed to select a single node, a contiguous range of nodes, or an arbitrary, potentially discontiguous, set of nodes. The JTree class uses a TreeSelectionModel to manage node selection. You need to retrieve the model to set the selection state to one of SINGLE_TREE_SELECTION, CONTIGUOUS_TREE_SELECTION, or DISCONTIGUOUS_TREE_SELECTION. (Discontiguous selection mode is the default.) For example, in our class browser, we want to allow selection of only a single class:"*

```java
int mode = TreeSelectionModel.SINGLE_TREE_SELECTION;
tree.getSelectionModel().setSelectionMode(mode);
```

> *"Apart from setting the selection mode, you need not worry about the tree selection model."*

**Dịch:** Class `JTree` dùng một `TreeSelectionModel` để quản lý việc chọn node. Ba mode: `SINGLE_TREE_SELECTION`, `CONTIGUOUS_TREE_SELECTION`, `DISCONTIGUOUS_TREE_SELECTION` (**mode discontiguous là mặc định**). Ngoài việc đặt selection mode, bạn **không cần bận tâm** tới tree selection model.

> **Note (sách):** *"How the user selects multiple items depends on the look-and-feel. In the Metal look-and-feel, hold down the Ctrl key while clicking an item to add it to the selection, or to remove it if it is currently selected. Hold down the Shift key while clicking an item to select a range of items, extending from the previously selected item to the new item."*
>
> **Dịch:** Cách người dùng chọn nhiều mục **phụ thuộc look-and-feel**. Với Metal: giữ **Ctrl** khi bấm để **thêm** mục vào selection (hoặc **bỏ** nếu nó đang được chọn); giữ **Shift** khi bấm để **chọn cả dải** mục, kéo dài từ mục được chọn trước đó tới mục mới.

> *"To find out the current selection, query the tree with the getSelectionPaths method:"*

```java
TreePath[] selectedPaths = tree.getSelectionPaths();
```

> *"If you restricted the user to single-item selection, you can use the convenience method getSelectionPath which returns the first selected path or null if no path was selected."*

**Dịch:** Muốn biết selection hiện tại thì truy vấn cây bằng `getSelectionPaths`. Nếu hạn chế người dùng chỉ chọn một mục thì dùng convenience method `getSelectionPath`.

> **Caution (sách):** *"The TreeSelectionEvent class has a getPaths method that returns an array of TreePath objects, but that array describes selection changes, not the current selection."*
>
> **Dịch:** Class `TreeSelectionEvent` có method `getPaths` trả về mảng object `TreePath`, nhưng mảng đó mô tả **các thay đổi của selection**, **không phải selection hiện tại**.

> *"This program is a bit tricky because it uses reflection to construct the class tree. This work is done inside the addClass method. (The details are not that important. We use the class tree in this example because inheritance yields a nice supply of trees without laborious coding. When you display trees in your applications, you will have your own source of hierarchical data.) The method uses the breadth-first search algorithm to find whether the current class is already in the tree by calling the findUserObject method that we implemented in the preceding section. If the class is not already in the tree, we add the superclasses to the tree, then make the new class node a child and make that node visible."*

**Dịch:** Chương trình dùng **reflection** để dựng cây class, trong method `addClass`. Sách dùng cây class vì **kế thừa cho sẵn một nguồn cây phong phú mà không phải viết code cực nhọc**. Method dùng thuật toán tìm kiếm **breadth-first** (qua `findUserObject`) để xem class hiện tại đã có trong cây chưa; nếu chưa thì **thêm các superclass vào cây**, rồi biến node class mới thành child và **làm cho node đó hiện ra**.

> *"When you select a tree node, the text area to the right is filled with the fields of the selected class. In the frame constructor, we restrict the user to single-item selection and add a tree selection listener. When the valueChanged method is called, we ignore its event parameter and simply ask the tree for the current selection path. As always, we need to get the last node of the path and look up its user object. We then call the getFieldDescription method which uses reflection to assemble a string with all fields of the selected class."*

**Dịch:** Khi `valueChanged` được gọi, ta **bỏ qua parameter event** và **hỏi thẳng cây về selection path hiện tại**. Như mọi khi, phải lấy **node cuối của path** rồi tra **user object** của nó.

### API — `javax.swing.JTree` 1.2 (selection paths)

| Method | Công dụng (theo sách) |
|---|---|
| `TreePath getSelectionPath()` · `TreePath[] getSelectionPaths()` | trả về path được chọn đầu tiên, hoặc mảng path tới mọi node được chọn. Nếu không path nào được chọn, **cả hai method đều trả về `null`** |

### API — `javax.swing.event.TreeSelectionListener` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void valueChanged(TreeSelectionEvent event)` | được gọi mỗi khi node được chọn hoặc bỏ chọn |

### API — `javax.swing.event.TreeSelectionEvent` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TreePath getPath()` · `TreePath[] getPaths()` | lấy path đầu tiên hoặc mọi path **đã thay đổi** trong selection event này. Muốn biết **selection hiện tại**, hãy gọi `JTree.getSelectionPaths` |

---

## 11.2.5. Custom Tree Models

> *"In the final example, we implement a program that inspects the contents of an object, just like a debugger does (see Figure 11.30). Each node corresponds to an instance field. If the field is an object, expand it to see its instance fields. The program inspects the contents of the frame window. If you poke around a few of the instance fields, you should be able to find some familiar classes. You'll also gain some respect for how complex the Swing user interface components are under the hood."*

**Dịch:** Ví dụ cuối là chương trình **soi nội dung của một object**, giống như debugger. Mỗi node ứng với **một instance field**; nếu field là một object thì mở rộng nó để xem các instance field của nó. Bạn cũng sẽ **thấy nể độ phức tạp của các Swing UI component bên dưới lớp vỏ**.

> *"What's remarkable about the program is that the tree does not use the DefaultTreeModel. If you already have data that are hierarchically organized, you might not want to build a duplicate tree and worry about keeping both trees synchronized. That is the situation in our case—the inspected objects are already linked to each other through the object references, so there is no need to replicate the linking structure."*

**Dịch:** Điểm đáng chú ý là cây này **không dùng `DefaultTreeModel`**. Nếu bạn **đã có sẵn data tổ chức phân cấp**, có lẽ bạn **không muốn dựng thêm một cây trùng lặp** rồi phải lo **đồng bộ hai cây**. Ở đây, các object được soi **đã liên kết với nhau qua object reference**, nên **không cần sao chép lại cấu trúc liên kết**.

> *"The TreeModel interface has only a handful of methods. The first group of methods enables the JTree to find the tree nodes by first getting the root, then the children. The JTree class calls these methods only when the user actually expands a node."*

```java
Object getRoot()
int getChildCount(Object parent)
Object getChild(Object parent, int index)
```

**Dịch:** Interface `TreeModel` **chỉ có vài method**. Nhóm đầu tiên giúp `JTree` **tìm ra các tree node**: trước hết lấy root, rồi lấy các child. `JTree` **chỉ gọi các method này khi người dùng thực sự mở rộng một node**.

> *"This example shows why the TreeModel interface, like the JTree class itself, does not need an explicit notion of nodes. The root and its children can be any objects. The TreeModel is responsible for telling the JTree how they are connected."*

**Dịch:** Ví dụ này cho thấy vì sao interface `TreeModel`, cũng như chính class `JTree`, **không cần một khái niệm node tường minh**. Root và các child **có thể là object bất kỳ**. `TreeModel` **chịu trách nhiệm cho `JTree` biết chúng nối với nhau thế nào**.

> *"The next method of the TreeModel interface is the reverse of getChild:"*

```java
int getIndexOfChild(Object parent, Object child)
```

> *"Actually, this method can be implemented in terms of the first three."*

**Dịch:** Method này là **nghịch đảo của `getChild`**, và thực ra **implement được dựa trên ba method đầu**.

> *"The tree model tells the JTree which nodes should be displayed as leaves:"*

```java
boolean isLeaf(Object node)
```

> *"If your code changes the tree model, the tree needs to be notified so it can redraw itself. The tree adds itself as a TreeModelListener to the model. Thus, the model must support the usual listener management methods:"*

```java
void addTreeModelListener(TreeModelListener l)
void removeTreeModelListener(TreeModelListener l)
```

**Dịch:** Nếu code của bạn **thay đổi tree model** thì cây **cần được thông báo** để tự vẽ lại. **Cây tự thêm chính nó làm `TreeModelListener` vào model**, nên model phải hỗ trợ các method quản lý listener thông thường.

> *"When the model modifies the tree contents, it calls one of the four methods of the TreeModelListener interface:"*

```java
void treeNodesChanged(TreeModelEvent e)
void treeNodesInserted(TreeModelEvent e)
void treeNodesRemoved(TreeModelEvent e)
void treeStructureChanged(TreeModelEvent e)
```

> *"The TreeModelEvent object describes the location of the change. The details of assembling a tree model event that describes an insertion or removal event are quite technical. You only need to worry about firing these events if your tree can actually have nodes added and removed. In Listing 11.12, we show how to fire one event by replacing the root with a new object."*

**Dịch:** Object `TreeModelEvent` **mô tả vị trí của thay đổi**. Chi tiết việc lắp một tree model event mô tả sự kiện chèn/gỡ **khá nặng kỹ thuật**. Bạn **chỉ cần bận tâm tới việc bắn các event này nếu cây của bạn thực sự có thể thêm và gỡ node**.

> **Tip (sách):** *"To simplify the code for event firing, use the javax.swing.EventListenerList convenience class that collects listeners."*
>
> **Dịch:** Để đơn giản hoá code bắn event, dùng convenience class **`javax.swing.EventListenerList`** — nó **gom các listener lại**.

> *"Finally, if the user edits a tree node, your model is called with the change:"*

```java
void valueForPathChanged(TreePath path, Object newValue)
```

> *"If you don't allow editing, this method is never called."*

**Dịch:** Nếu người dùng sửa một tree node, model của bạn được gọi kèm thay đổi đó. **Nếu không cho phép sửa thì method này không bao giờ được gọi.**

> *"If you don't need to support editing, constructing a tree model is easily done. Implement the three methods:"*

```java
Object getRoot()
int getChildCount(Object parent)
Object getChild(Object parent, int index)
```

> *"These methods describe the structure of the tree. Supply routine implementations of the other five methods, as in Listing 11.12. You are then ready to display your tree."*

**Dịch:** Nếu **không cần hỗ trợ sửa**, dựng một tree model **rất dễ**: implement **ba method** mô tả cấu trúc cây, còn **năm method kia thì implement kiểu thủ tục thường lệ**.

### Class `Variable`

> *"Now let's turn to the implementation of the example program. Our tree will contain objects of type Variable."*

> **Note (sách):** *"Had we used the DefaultTreeModel, our nodes would have been objects of type DefaultMutableTreeNode with user objects of type Variable."*
>
> **Dịch:** Nếu ta đã dùng `DefaultTreeModel` thì node sẽ là object kiểu `DefaultMutableTreeNode` với **user object kiểu `Variable`**.

> *"For example, suppose you inspect the variable"*

```java
Employee joe;
```

> *"That variable has a type Employee.class, a name "joe", and a value—the value of the object reference joe. In Listing 11.14, we define a class Variable that describes a variable in a program:"*

```java
var v = new Variable(Employee.class, "joe", joe);
```

> *"If the type of the variable is a primitive type, you must use an object wrapper for the value."*

```java
new Variable(double.class, "salary", new Double(salary));
```

**Dịch:** Biến đó có **type** là `Employee.class`, **name** là `"joe"`, và **value** là giá trị của object reference `joe`. Nếu type của biến là **primitive type** thì **phải dùng object wrapper** cho value.

> *"If the type of the variable is a class, the variable has fields. Using reflection, we enumerate all fields and collect them in an ArrayList. Since the getFields method of the Class class does not return the fields of the superclass, we need to call getFields on all superclasses as well. You can find the code in the Variable constructor. The getFields method of our Variable class returns the array of fields."*

**Dịch:** Vì method `getFields` của class `Class` **không trả về field của superclass**, ta phải **gọi `getFields` trên mọi superclass** nữa.

> *"Finally, the toString method of the Variable class formats the node label. The label always contains the variable type and name. If the variable is not a class, the label also contains the value."*

**Dịch:** Method `toString` của class `Variable` **định dạng nhãn của node**: nhãn **luôn chứa type và name** của biến; nếu biến **không phải một class** thì nhãn **chứa cả value**.

> **Note (sách):** *"If the type is an array, we do not display the elements of the array. This would not be difficult to do; we leave it as the proverbial "exercise for the reader.""*
>
> **Dịch:** Nếu type là **mảng**, ta **không hiển thị các phần tử của mảng**. Việc này không khó; sách để lại như **"bài tập cho bạn đọc"** kinh điển.

### Ba method chính của model

> *"Let's move on to the tree model. The first two methods are simple."*

```java
public Object getRoot()
{
    return root;
}
public int getChildCount(Object parent)
{
    return ((Variable) parent).getFields().size();
}
```

> *"The getChild method returns a new Variable object that describes the field with the given index. The getType and getName methods of the Field class yield the field type and name. By using reflection, you can read the field value as f.get(parentValue). That method can throw an IllegalAccessException. However, we made all fields accessible in the Variable constructor, so this won't happen in practice."*

```java
public Object getChild(Object parent, int index)
{
    ArrayList fields = ((Variable) parent).getFields();
    var f = (Field) fields.get(index);
    Object parentValue = ((Variable) parent).getValue();
    try
    {
        return new Variable(f.getType(), f.getName(), f.get(parentValue));
    }
    catch (IllegalAccessException e)
    {
        return null;
    }
}
```

**Dịch:** Method `getChild` trả về **một object `Variable` mới** mô tả field ở index đã cho. `getType` và `getName` của class `Field` cho ra type và name của field. Nhờ reflection, đọc giá trị field bằng `f.get(parentValue)` — method đó **ném được `IllegalAccessException`**, nhưng ta đã **làm mọi field accessible trong constructor của `Variable`** nên thực tế điều đó không xảy ra. (Về exception, xem [[07 - Exceptions, Assertions, Logging]].)

> *"These three methods reveal the structure of the object tree to the JTree component. The remaining methods are routine."*

**Dịch:** **Ba method này để lộ cấu trúc của cây object cho component `JTree`.** Các method còn lại là thường lệ.

### Cây vô hạn

> *"There is one remarkable fact about this tree model: It actually describes an infinite tree. You can verify this by following one of the WeakReference objects. Click on the variable named referent. It leads you right back to the original object. You get an identical subtree, and you can open its WeakReference object again, ad infinitum. Of course, you cannot store an infinite set of nodes; the tree model simply generates the nodes on demand as the user expands the parents."*

**Dịch:** Một điều đáng chú ý: tree model này **thực sự mô tả một cây vô hạn**. Kiểm chứng bằng cách đi theo một trong các object `WeakReference` — bấm vào biến tên `referent`, nó **dẫn thẳng về object ban đầu**, cho ra một subtree y hệt, và bạn lại mở được object `WeakReference` của nó, **vô hạn**. Dĩ nhiên **không thể lưu một tập vô hạn node**; tree model chỉ **sinh node theo yêu cầu** khi người dùng mở rộng các parent.

### API — `javax.swing.tree.TreeModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Object getRoot()` | trả về root node |
| `int getChildCount(Object parent)` | lấy số child của node `parent` |
| `Object getChild(Object parent, int index)` | lấy child node của `parent` tại index đã cho |
| `int getIndexOfChild(Object parent, Object child)` | lấy index của `child` trong `parent`, hoặc **`-1`** nếu `child` không phải child của `parent` trong tree model này |
| `boolean isLeaf(Object node)` | trả về `true` nếu `node` **về mặt khái niệm** là leaf của cây |
| `void addTreeModelListener(TreeModelListener l)` · `void removeTreeModelListener(TreeModelListener l)` | thêm hoặc gỡ listener được thông báo khi thông tin trong tree model thay đổi |
| `void valueForPathChanged(TreePath path, Object newValue)` | được gọi khi một cell editor đã sửa đổi giá trị của một node. `path` = path tới node đã bị sửa · `newValue` = giá trị thay thế do editor trả về |

### API — `javax.swing.event.TreeModelListener` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void treeNodesChanged(TreeModelEvent e)` · `void treeNodesInserted(TreeModelEvent e)` · `void treeNodesRemoved(TreeModelEvent e)` · `void treeStructureChanged(TreeModelEvent e)` | được tree model gọi khi cây đã bị sửa đổi |

### API — `javax.swing.event.TreeModelEvent` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `TreeModelEvent(Object eventSource, TreePath node)` | dựng một tree model event. `eventSource` = tree model sinh ra event này · `node` = path tới node đang bị thay đổi |

---

## Bài kế tiếp

→ [[03 - Advanced AWT]] — rendering pipeline, shape, area, stroke, paint, coordinate transformation, clipping, transparency và composition của Java 2D API.
