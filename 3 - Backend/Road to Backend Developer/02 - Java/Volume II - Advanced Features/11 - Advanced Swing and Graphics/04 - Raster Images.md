# 04 — Raster Images

> Chapter 11, Section 11.4 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 11.4. Raster Images

> *"The Java2D API lets you create drawings that are made up of lines, curves, and areas. It is a "vector" API because you specify the mathematical properties of the shapes. However, for processing images that are made up of pixels, you want to work with a "raster" of color data. The following sections show you how to process raster images in Java."*

**Dịch:** Java 2D API cho bạn tạo bản vẽ gồm đường thẳng, curve và area. Đó là một API **"vector"** vì bạn chỉ định **các tính chất toán học của shape**. Nhưng để xử lý image **được tạo từ pixel**, bạn muốn làm việc với một **"raster" của dữ liệu màu**.

---

## 11.4.1. Readers and Writers for Images

> *"The javax.imageio package contains out-of-the-box support for reading and writing several common file formats, as well as a framework that enables third parties to add readers and writers for other formats. The GIF, JPEG, PNG, BMP (Windows bitmap), and WBMP (wireless bitmap) file formats are supported."*

**Dịch:** Package `javax.imageio` hỗ trợ **sẵn dùng** việc đọc/ghi vài định dạng file phổ biến, đồng thời là **framework cho bên thứ ba** thêm reader và writer cho các định dạng khác. Các định dạng được hỗ trợ: **GIF, JPEG, PNG, BMP** (Windows bitmap), **WBMP** (wireless bitmap).

> *"The basics of the library are extremely straightforward. To load an image, use the static read method of the ImageIO class:"*

```java
File f = . . .;
BufferedImage image = ImageIO.read(f);
```

> *"The ImageIO class picks an appropriate reader, based on the file type. It may consult the file extension and the "magic number" at the beginning of the file for that purpose. If no suitable reader can be found or the reader can't decode the file contents, the read method returns null."*

**Dịch:** Class `ImageIO` **tự chọn reader phù hợp** dựa trên kiểu file. Nó có thể xem **phần mở rộng của file** và **"magic number" ở đầu file**. Nếu **không tìm được reader phù hợp** hoặc reader **không giải mã được nội dung file**, method `read` trả về **`null`**.

> *"Writing an image to a file is just as simple:"*

```java
File f = . . .;
String format = . . .;
ImageIO.write(image, format, f);
```

> *"Here the format string is a string identifying the image format, such as "JPEG" or "PNG". The ImageIO class picks an appropriate writer and saves the file."*

**Dịch:** Chuỗi `format` định danh định dạng image, ví dụ `"JPEG"` hay `"PNG"`. (Về file và stream, xem [[06 - Input and Output]].)

### 11.4.1.1. Obtaining Readers and Writers for Image File Types

> *"For more advanced image reading and writing operations that go beyond the static read and write methods of the ImageIO class, you first need to get the appropriate ImageReader and ImageWriter objects. The ImageIO class enumerates readers and writers that match one of the following:"*
>
> *"• An image format (such as "JPEG")"*
> *"• A file suffix (such as "jpg")"*
> *"• A MIME type (such as "image/jpeg")"*

**Dịch:** Với các thao tác **nâng cao hơn** hai static method `read`/`write`, trước tiên bạn phải lấy được object **`ImageReader`** và **`ImageWriter`** phù hợp. Class `ImageIO` liệt kê reader và writer khớp với: **image format** · **file suffix** · **MIME type**.

> **Note (sách):** *"MIME is the Multipurpose Internet Mail Extensions standard. The MIME standard defines common data formats such as image/jpeg and application/pdf."*
>
> **Dịch:** **MIME** là chuẩn *Multipurpose Internet Mail Extensions*, định nghĩa các định dạng dữ liệu phổ biến như `image/jpeg` và `application/pdf`.

> *"For example, you can obtain a reader that reads JPEG files as follows:"*

```java
ImageReader reader = null;
Iterator<ImageReader> iter = ImageIO.getImageReadersByFormatName("JPEG");
if (iter.hasNext()) reader = iter.next();
```

> *"The getImageReadersBySuffix and getImageReadersByMIMEType methods enumerate readers that match a file extension or MIME type."*

> *"It is possible that the ImageIO class can locate multiple readers that can all read a particular image type. In that case, you have to pick one of them, but it isn't clear how you can decide which one is the best. To find out more information about a reader, obtain its service provider interface:"*

```java
ImageReaderSpi spi = reader.getOriginatingProvider();
```

> *"Then you can get the vendor name and version number:"*

```java
String vendor = spi.getVendor();
String version = spi.getVersion();
```

> *"Perhaps that information can help you decide among the choices—or you might just present a list of readers to your program users and let them choose. For now, we assume that the first enumerated reader is adequate."*

**Dịch:** Có thể `ImageIO` tìm được **nhiều reader** cùng đọc được một kiểu image. Khi đó bạn phải chọn một, nhưng **không rõ làm sao quyết định cái nào tốt nhất**. Để biết thêm về một reader, lấy **service provider interface** của nó, rồi lấy **tên nhà cung cấp và số phiên bản**. Có lẽ thông tin đó giúp bạn quyết định — hoặc **cứ trình bày danh sách reader cho người dùng chương trình tự chọn**. Tạm thời sách giả định **reader đầu tiên được liệt kê là đủ dùng**.

> *"In the sample program in Listing 11.20, we want to find all file suffixes of all available readers so that we can use them in a file filter. Use the static ImageIO.getReaderFileSuffixes method for this purpose:"*

```java
String[] extensions = ImageIO.getWriterFileSuffixes();
chooser.setFileFilter(new FileNameExtensionFilter("Image files", extensions));
```

> *"For saving files, we have to work harder. We'd like to present the user with a menu of all supported image types. Unfortunately, the getWriterFormatNames of the ImageIO class returns a rather curious list with redundant names, such as"*

```
jpg, BMP, bmp, JPG, jpeg, wbmp, png, JPEG, PNG, WBMP, GIF, gif
```

> *"That's not something one would want to present in a menu. What is needed is a list of "preferred" format names. We supply a helper method getWriterFormats for this purpose (see Listing 11.20). We look up the first writer associated with each format name. Then we ask it what its format names are, in the hope that it will list the most popular one first. Indeed, for the JPEG writer, this works fine—it lists "JPEG" before the other options. (The PNG writer, on the other hand, lists "png" in lower case before "PNG". We hope this behavior will be addressed at some point in the future. For now, we force all-lowercase names to upper case.) Once we pick a preferred name, we remove all alternate names from the original set. We keep going until all format names are handled."*

**Dịch:** Việc **lưu file** thì phải làm nhiều hơn. Đáng tiếc, `getWriterFormatNames` trả về **một danh sách khá kỳ quặc với các tên trùng lặp**. Cái ta cần là danh sách **tên định dạng "được ưu tiên"**. Cách làm: **tra writer đầu tiên gắn với mỗi format name**, rồi hỏi nó xem format name của nó là gì, **hy vọng nó liệt kê cái phổ biến nhất trước**. Với writer JPEG thì đúng vậy — nó liệt kê `"JPEG"` trước. Ngược lại, writer PNG liệt kê `"png"` chữ thường trước `"PNG"`; sách **hy vọng hành vi này sẽ được xử lý trong tương lai**, còn hiện tại thì **ép mọi tên viết thường thành viết hoa**. Sau khi chọn được một tên ưu tiên, **gỡ mọi tên thay thế khỏi tập ban đầu**, cứ thế cho tới khi xử lý hết.

### 11.4.1.2. Reading and Writing Files with Multiple Images

> *"Some files—in particular, animated GIF files—contain multiple images. The read method of the ImageIO class reads a single image. To read multiple images, turn the input source (for example, an input stream or file) into an ImageInputStream."*

```java
InputStream in = . . .;
ImageInputStream imageIn = ImageIO.createImageInputStream(in);
```

> *"Then, attach the image input stream to the reader:"*

```java
reader.setInput(imageIn, true);
```

**Dịch:** Một số file — đặc biệt là **file GIF động** — chứa **nhiều image**. Method `read` của `ImageIO` **chỉ đọc một image**. Muốn đọc nhiều, biến nguồn input thành một **`ImageInputStream`** rồi gắn nó vào reader.

> *"The second parameter indicates that the input is in "seek forward only" mode. Otherwise, random access is used, either by buffering stream input as it is read or by using random file access. Random access is required for certain operations. For example, to find out the number of images in a GIF file, you need to read the entire file. If you then want to fetch an image, the input must be read again."*

**Dịch:** Parameter thứ hai cho biết input ở chế độ **"seek forward only"**. Ngược lại thì dùng **truy cập ngẫu nhiên**, hoặc bằng cách đệm stream input khi đọc, hoặc bằng truy cập file ngẫu nhiên. **Truy cập ngẫu nhiên là bắt buộc với một số thao tác**: ví dụ, để biết số image trong một file GIF, bạn phải **đọc cả file**; nếu sau đó muốn lấy một image thì **phải đọc lại input**.

> *"This consideration is only important if you read from a stream, if the input contains multiple images, and if the image format doesn't have the information that you request (such as the image count) in the header. If you read from a file, simply use"*

```java
File f = . . .;
ImageInputStream imageIn = ImageIO.createImageInputStream(f);
reader.setInput(imageIn);
```

**Dịch:** Cân nhắc này **chỉ quan trọng khi** bạn đọc từ stream, input chứa nhiều image, và định dạng image **không có thông tin bạn cần (như số lượng image) trong header**.

> *"Once you have a reader, you can read the images in the input by calling"*

```java
BufferedImage image = reader.read(index);
```

> *"where index is the image index, starting with 0."*

> *"If the input is in the "seek forward only" mode, you keep reading images until the read method throws an IndexOutOfBoundsException. Otherwise, you can call the getNumImages method:"*

```java
int n = reader.getNumImages(true);
```

> *"Here, the parameter indicates that you allow a search of the input to determine the number of images. That method throws an IllegalStateException if the input is in the "seek forward only" mode. Alternatively, you can set the "allow search" parameter to false. Then the getNumImages method returns -1 if it can't determine the number of images without a search. In that case, you'll have to switch to Plan B and keep reading images until you get an IndexOutOfBoundsException."*

**Dịch:** Ở chế độ **"seek forward only"**, bạn **cứ đọc image cho tới khi `read` ném `IndexOutOfBoundsException`**. Ngược lại, gọi `getNumImages`: parameter cho biết bạn **cho phép tìm kiếm trong input** để xác định số image. Method đó **ném `IllegalStateException`** nếu input ở chế độ "seek forward only". Nếu đặt parameter là `false` thì `getNumImages` trả về **`-1`** khi nó không xác định được số image mà không cần tìm kiếm — khi đó bạn phải **chuyển sang phương án B**: đọc image cho tới khi gặp `IndexOutOfBoundsException`.

> *"Some files contain thumbnails—smaller versions of an image for preview purposes. You can get the number of thumbnails of an image with the call"*

```java
int count = reader.getNumThumbnails(index);
```

> *"Then you get a particular index as"*

```java
BufferedImage thumbnail = reader.getThumbnail(index, thumbnailIndex);
```

**Dịch:** Một số file chứa **thumbnail** — **phiên bản nhỏ hơn của một image** dùng để xem trước.

> *"Sometimes you may want to get the image size before actually getting the image—in particular, if the image is huge or comes from a slow network connection. Use the calls"*

```java
int width = reader.getWidth(index);
int height = reader.getHeight(index);
```

**Dịch:** Đôi khi bạn muốn **biết kích thước image trước khi thực sự lấy image** — đặc biệt nếu image rất lớn hoặc đến từ **kết nối mạng chậm**.

### Ghi file nhiều image

> *"To write a file with multiple images, you first need an ImageWriter. The ImageIO class can enumerate the writers capable of writing a particular image format:"*

```java
String format = . . .;
ImageWriter writer = null;
Iterator<ImageWriter> iter = ImageIO.getImageWritersByFormatName(format);
if (iter.hasNext()) writer = iter.next();
```

> *"Next, turn an output stream or file into an ImageOutputStream and attach it to the writer. For example,"*

```java
File f = . . .;
ImageOutputStream imageOut = ImageIO.createImageOutputStream(f);
writer.setOutput(imageOut);
```

> *"You must wrap each image into an IIOImage object. You can optionally supply a list of thumbnails and image metadata (such as compression algorithms and color information). In this example, we just use null for both."*

```java
var iioImage = new IIOImage(images[i], null, null);
```

**Dịch:** Bạn **phải bọc từng image vào một object `IIOImage`**. Tuỳ chọn cung cấp thêm **danh sách thumbnail** và **metadata của image** (như thuật toán nén và thông tin màu).

> *"To write out the first image, use the write method:"*

```java
writer.write(new IIOImage(images[0], null, null));
```

> *"For subsequent images, use"*

```java
if (writer.canInsertImage(i))
    writer.writeInsert(i, iioImage, null);
```

> *"The third parameter can contain an ImageWriteParam object to set image writing details such as tiling and compression; use null for default values."*

> *"Not all file formats can handle multiple images. In that case, the canInsertImage method returns false for i > 0, and only a single image is saved."*

**Dịch:** Parameter thứ ba có thể chứa object `ImageWriteParam` để đặt chi tiết ghi image như **tiling và nén**; dùng `null` cho giá trị mặc định. **Không phải định dạng file nào cũng xử lý được nhiều image** — khi đó `canInsertImage` trả về `false` với `i > 0`, và **chỉ một image được lưu**.

### API — `javax.imageio.ImageIO` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `static BufferedImage read(File input)` · `read(InputStream input)` · `read(URL input)` | đọc một image từ `input` |
| `static boolean write(RenderedImage image, String formatName, File output)` · `(..., OutputStream output)` | ghi một image ở định dạng đã cho ra `output`. Trả về **`false` nếu không tìm được writer phù hợp** |
| `static Iterator<ImageReader> getImageReadersByFormatName / BySuffix / ByMIMEType` · `getImageWritersByFormatName / BySuffix / ByMIMEType` | lấy mọi reader và writer xử lý được format (vd `"JPEG"`), file suffix (vd `"jpg"`), hoặc MIME type (vd `"image/jpeg"`) đã cho |
| `static String[] getReaderFormatNames()` · `getReaderMIMETypes()` · `getWriterFormatNames()` · `getWriterMIMETypes()` · `getReaderFileSuffixes()` *(6)* · `getWriterFileSuffixes()` *(6)* | lấy mọi format name, MIME type, và file suffix mà reader và writer hỗ trợ |
| `ImageInputStream createImageInputStream(Object input)` · `ImageOutputStream createImageOutputStream(Object output)` | tạo image input/output stream từ object đã cho. Object có thể là một file, một stream, một `RandomAccessFile`, hoặc object khác có service provider. Trả về **`null` nếu không service provider đã đăng ký nào xử lý được** object |

### API — `javax.imageio.ImageReader` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `void setInput(Object input)` · `void setInput(Object input, boolean seekForwardOnly)` | đặt nguồn input của reader. `input` = object `ImageInputStream` hoặc object khác reader này chấp nhận · `seekForwardOnly` = `true` nếu reader **chỉ nên đọc tiến**. Mặc định reader dùng **truy cập ngẫu nhiên** và **đệm dữ liệu image nếu cần** |
| `BufferedImage read(int index)` | đọc image ở image index đã cho (bắt đầu từ 0). **Ném `IndexOutOfBoundsException`** nếu không có image đó |
| `int getNumImages(boolean allowSearch)` | lấy số image trong reader này. Nếu `allowSearch` là `false` và không xác định được số image mà không đọc tiến thì trả về **`-1`**. Nếu `allowSearch` là `true` và reader ở chế độ "seek forward only" thì **ném `IllegalStateException`** |
| `int getNumThumbnails(int index)` | lấy số thumbnail của image ở index đã cho |
| `BufferedImage readThumbnail(int index, int thumbnailIndex)` | lấy thumbnail có index `thumbnailIndex` của image ở index đã cho |
| `int getWidth(int index)` · `int getHeight(int index)` | lấy chiều rộng và chiều cao của image. Ném `IndexOutOfBoundsException` nếu không có image đó |
| `ImageReaderSpi getOriginatingProvider()` | lấy service provider đã dựng ra reader này |

### API — `javax.imageio.spi.IIOServiceProvider` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `String getVendorName()` · `String getVersion()` | lấy tên nhà cung cấp và phiên bản của service provider này |

### API — `javax.imageio.spi.ImageReaderWriterSpi` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `String[] getFormatNames()` · `String[] getFileSuffixes()` · `String[] getMIMETypes()` | lấy format name, file suffix, MIME type mà reader/writer do service provider này tạo ra hỗ trợ |

### API — `javax.imageio.ImageWriter` 1.4

| Method | Công dụng (theo sách) |
|---|---|
| `void setOutput(Object output)` | đặt đích output của writer này (object `ImageOutputStream` hoặc object khác writer chấp nhận) |
| `void write(IIOImage image)` · `void write(RenderedImage image)` | ghi **một** image ra output |
| `void writeInsert(int index, IIOImage image, ImageWriteParam param)` | ghi một image vào **file nhiều image** |
| `boolean canInsertImage(int index)` | trả về `true` nếu **có thể chèn một image tại index đã cho** |
| `ImageWriterSpi getOriginatingProvider()` | lấy service provider đã dựng ra writer này |

### API — `javax.imageio.IIOImage` 1.4

| Constructor | Công dụng (theo sách) |
|---|---|
| `IIOImage(RenderedImage image, List thumbnails, IIOMetadata metadata)` | dựng một `IIOImage` từ một image, các thumbnail tuỳ chọn, và metadata tuỳ chọn |

---

## 11.4.2. Image Manipulation

> *"Suppose you have an image and you would like to improve its appearance. You then need to access the individual pixels of the image and replace them with other pixels. Or perhaps you want to compute the pixels of an image from scratch—for example, to show the result of physical measurements or a mathematical computation. The BufferedImage class gives you control over the pixels in an image, and the classes that implement the BufferedImageOp interface let you transform images."*

**Dịch:** Class `BufferedImage` cho bạn **kiểm soát các pixel trong một image**, còn các class implement interface `BufferedImageOp` cho bạn **biến đổi image**.

> **Note (sách):** *"JDK 1.0 had a completely different, and far more complex, imaging framework that was optimized for incremental rendering of images downloaded from the Web, a scan line at a time. However, it was difficult to manipulate those images. We do not discuss that framework in this book."*
>
> **Dịch:** JDK 1.0 có một imaging framework **hoàn toàn khác và phức tạp hơn nhiều**, được tối ưu cho việc **render tăng dần** các image tải từ Web, **từng dòng quét một**. Nhưng **thao tác lên những image đó rất khó**, và sách **không bàn tới framework đó**.

### 11.4.2.1. Constructing Raster Images

> *"Most of the images that you manipulate are simply read in from an image file—they were either produced by a device such as a digital camera or scanner, or constructed by a drawing program. In this section, we'll show you a different technique for constructing an image—namely, building it up a pixel at a time."*

**Dịch:** Mục này trình bày một kỹ thuật khác để dựng image — **xây nó lên từng pixel một**.

> *"To create an image, construct a BufferedImage object in the usual way."*

```java
image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
```

> *"Now, call the getRaster method to obtain an object of type WritableRaster. You will use this object to access and modify the pixels of the image."*

```java
WritableRaster raster = image.getRaster();
```

> *"The setPixel method lets you set an individual pixel. The complexity here is that you can't simply set the pixel to a Color value. You must know how the buffered image specifies color values. That depends on the type of the image. If your image has a type of TYPE_INT_ARGB, then each pixel is described by four values—red, green, blue, and alpha, each between 0 and 255. You have to supply them in an array of four integers:"*

```java
int[] black = { 0, 0, 0, 255 };
raster.setPixel(i, j, black);
```

> *"In the lingo of the Java 2D API, these values are called the sample values of the pixel."*

**Dịch:** Chỗ rắc rối là bạn **không thể đơn giản đặt pixel bằng một giá trị `Color`**. Bạn **phải biết buffered image chỉ định giá trị màu như thế nào**, và điều đó **phụ thuộc kiểu của image**. Với kiểu `TYPE_INT_ARGB`, mỗi pixel được mô tả bằng **bốn giá trị** — red, green, blue, alpha, **mỗi giá trị giữa 0 và 255**. Trong thuật ngữ của Java 2D API, các giá trị đó gọi là **sample value** của pixel.

> **Caution (sách):** *"There are also setPixel methods that take array parameters of types float[] and double[]. However, the values that you need to place into these arrays are not normalized color values between 0.0 and 1.0."*
>
> ```java
> float[] red = { 1.0F, 0.0F, 0.0F, 1.0F };
> raster.setPixel(i, j, red); // ERROR
> ```
>
> *"You need to supply values between 0 and 255, no matter what the type of the array is."*
>
> **Dịch:** Cũng có method `setPixel` nhận parameter mảng kiểu `float[]` và `double[]`. Nhưng các giá trị bạn đặt vào các mảng đó **KHÔNG phải giá trị màu chuẩn hoá giữa 0.0 và 1.0**. Bạn **phải cung cấp giá trị giữa 0 và 255, bất kể kiểu của mảng là gì**.

> *"You can supply a batch of pixels with the setPixels method. Specify the starting pixel position and the width and height of the rectangle that you want to set. Then, supply an array that contains the sample values for all pixels."*

```java
var pixels = new int[4 * width * height];
pixels[0] = . . .; // red value for first pixel
pixels[1] = . . .; // green value for first pixel
pixels[2] = . . .; // blue value for first pixel
pixels[3] = . . .; // alpha value for first pixel
. . .
raster.setPixels(x, y, width, height, pixels);
```

> *"Conversely, to read a pixel, use the getPixel method. Supply an array of four integers to hold the sample values."*

```java
var sample = new int[4];
raster.getPixel(x, y, sample);
var color = new Color(sample[0], sample[1], sample[2], sample[3]);
```

> *"You can read multiple pixels with the getPixels method."*

```java
raster.getPixels(x, y, width, height, samples);
```

**Dịch:** Đặt **một lô pixel** bằng `setPixels`: chỉ định vị trí pixel bắt đầu, chiều rộng và chiều cao của hình chữ nhật cần đặt, rồi cung cấp mảng chứa **sample value cho mọi pixel**.

### Color model

> *"If you use an image type other than TYPE_INT_ARGB and you know how that type represents pixel values, you can still use the getPixel/setPixel methods. However, you have to know the encoding of the sample values in the particular image type."*

> *"If you need to manipulate an image with an arbitrary, unknown image type, then you have to work a bit harder. Every image type has a color model that can translate between sample value arrays and the standard RGB color model."*

**Dịch:** Nếu phải thao tác lên image có **kiểu tuỳ ý, chưa biết** thì bạn phải **làm nhiều hơn một chút**: **mọi image type đều có một color model** có thể **dịch qua lại giữa mảng sample value và mô hình màu RGB chuẩn**.

> **Note (sách):** *"The RGB color model isn't as standard as you might think. The exact look of a color value depends on the characteristics of the imaging device. Digital cameras, scanners, monitors, and LCD displays all have their own idiosyncrasies. As a result, the same RGB value can look quite different on different devices. The International Color Consortium (www.color.org) recommends that all color data be accompanied by an ICC profile that specifies how the colors map to a standard form such as the 1931 CIE XYZ color specification. That specification was designed by the Commission Internationale de l'Eclairage, or CIE (www.cie.co.at), the international organization in charge of providing technical guidance in all matters of illumination and color. The specification is a standard method for representing any color that the human eye can perceive as a triplet of coordinates called X, Y, Z."*
>
> *"ICC profiles are complex, however. A simpler proposed standard, called sRGB (www.w3.org/Images/Color/sRGB.html), specifies an exact mapping between RGB values and the 1931 CIE XYZ values that was designed to work well with typical color monitors. The Java 2D API uses that mapping when converting between RGB and other color spaces."*
>
> **Dịch:** Mô hình màu RGB **không "chuẩn" như bạn tưởng**. Diện mạo chính xác của một giá trị màu **phụ thuộc đặc tính của thiết bị ảnh**: máy ảnh số, máy quét, màn hình, màn hình LCD **đều có nét riêng của chúng**. Hệ quả: **cùng một giá trị RGB có thể trông khá khác nhau trên các thiết bị khác nhau**. **International Color Consortium** khuyến nghị mọi dữ liệu màu nên **kèm theo một ICC profile** chỉ rõ cách màu ánh xạ sang một dạng chuẩn như **đặc tả màu CIE XYZ 1931**. Đặc tả đó do **Commission Internationale de l'Eclairage (CIE)** thiết kế — tổ chức quốc tế phụ trách hướng dẫn kỹ thuật về mọi vấn đề chiếu sáng và màu sắc — là **phương pháp chuẩn để biểu diễn mọi màu mắt người cảm nhận được** dưới dạng **bộ ba toạ độ X, Y, Z**. Tuy nhiên **ICC profile phức tạp**; một chuẩn đề xuất đơn giản hơn là **sRGB**, chỉ định **ánh xạ chính xác giữa giá trị RGB và giá trị CIE XYZ 1931**, được thiết kế để **hoạt động tốt với màn hình màu thông thường**. **Java 2D API dùng ánh xạ đó** khi chuyển đổi giữa RGB và các không gian màu khác.

> *"The getColorModel method returns the color model:"*

```java
ColorModel model = image.getColorModel();
```

> *"To find the color value of a pixel, call the getDataElements method of the Raster class. That call returns an Object that contains a color-model-specific description of the color value."*

```java
Object data = raster.getDataElements(x, y, null);
```

> **Note (sách):** *"The object that is returned by the getDataElements method is actually an array of sample values. You don't need to know this to process the object, but it explains why the method is called getDataElements."*
>
> **Dịch:** Object mà `getDataElements` trả về **thực chất là một mảng sample value**. Bạn **không cần biết điều này** để xử lý object, nhưng nó **giải thích vì sao method có tên là `getDataElements`**.

> *"The color model can translate the object to standard ARGB values. The getRGB method returns an int value that has the alpha, red, green, and blue values packed in four blocks of eight bits each. You can construct a Color value out of that integer with the Color(int argb, boolean hasAlpha) constructor:"*

```java
int argb = model.getRGB(data);
var color = new Color(argb, true);
```

**Dịch:** Method `getRGB` trả về một giá trị `int` **đóng gói giá trị alpha, red, green, blue thành bốn khối tám bit**.

> *"To set a pixel to a particular color, reverse these steps. The getRGB method of the Color class yields an int value with the alpha, red, green, and blue values. Supply that value to the getDataElements method of the ColorModel class. The return value is an Object that contains the color-model-specific description of the color value. Pass the object to the setDataElements method of the WritableRaster class."*

```java
int argb = color.getRGB();
Object data = model.getDataElements(argb, null);
raster.setDataElements(x, y, data);
```

**Dịch:** Muốn đặt một pixel về màu cụ thể thì **làm ngược lại các bước trên**.

### Tập Mandelbrot

> *"To illustrate how to use these methods to build an image from individual pixels, we bow to tradition and draw a Mandelbrot set, as shown in Figure 11.56."*

> *"The idea of the Mandelbrot set is that each point of the plane is associated with a sequence of numbers. If that sequence stays bounded, you color the point. If it "escapes to infinity," you leave it transparent."*

> *"Here is how you can construct the simplest Mandelbrot set. For each point (a, b), look at sequences that start with (x, y) = (0, 0) and iterate:"*

```
xnew = x² – y² + a
ynew = 2 · x · y + b
```

> *"It turns out that if x or y ever gets larger than 2, then the sequence escapes to infinity. Only the pixels that correspond to points (a, b) leading to a bounded sequence are colored. (The formulas for the number sequences come ultimately from the mathematics of complex numbers; we'll just take them for granted.)"*

**Dịch:** Ý tưởng của **tập Mandelbrot**: mỗi điểm của mặt phẳng gắn với **một dãy số**. Nếu dãy đó **bị chặn** thì tô màu điểm; nếu nó **"thoát ra vô cực"** thì để trong suốt. Hoá ra **nếu `x` hay `y` từng lớn hơn 2 thì dãy thoát ra vô cực**. Chỉ những pixel ứng với điểm `(a, b)` dẫn tới **dãy bị chặn** mới được tô màu. (Các công thức đến từ **toán học số phức**; sách **chấp nhận chúng như đã cho**.)

> *"In this program, we demonstrate how to use the ColorModel class for translating Color values into pixel data. That process is independent of the image type. Just for fun, change the color type of the buffered image to TYPE_BYTE_GRAY. You don't need to change any other code—the color model of the image automatically takes care of the conversion from colors to sample values."*

**Dịch:** Quá trình dịch giá trị `Color` thành pixel data **độc lập với kiểu image**. **Cho vui**, hãy đổi color type của buffered image thành `TYPE_BYTE_GRAY` — **không cần đổi dòng code nào khác**, vì **color model của image tự động lo việc chuyển đổi** từ màu sang sample value.

### Listing 11.21 — `rasterImage/RasterImageFrame.java`

```java
package rasterImage;

import java.awt.*;
import java.awt.image.*;
import javax.swing.*;

/**
 * This frame shows an image with a Mandelbrot set.
 */
public class RasterImageFrame extends JFrame
{
    private static final double XMIN = -2;
    private static final double XMAX = 2;
    private static final double YMIN = -2;
    private static final double YMAX = 2;
    private static final int MAX_ITERATIONS = 16;
    private static final int IMAGE_WIDTH = 400;
    private static final int IMAGE_HEIGHT = 400;

    public RasterImageFrame()
    {
        BufferedImage image = makeMandelbrot(IMAGE_WIDTH, IMAGE_HEIGHT);
        add(new JLabel(new ImageIcon(image)));
        pack();
    }

    /**
     * Makes the Mandelbrot image.
     * @param width the width
     * @parah height the height
     * @return the image
     */
    public BufferedImage makeMandelbrot(int width, int height)
    {
        var image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        WritableRaster raster = image.getRaster();
        ColorModel model = image.getColorModel();

        Color fractalColor = Color.RED;
        int argb = fractalColor.getRGB();
        Object colorData = model.getDataElements(argb, null);

        for (int i = 0; i < width; i++)
            for (int j = 0; j < height; j++)
            {
                double a = XMIN + i * (XMAX - XMIN) / width;
                double b = YMIN + j * (YMAX - YMIN) / height;
                if (!escapesToInfinity(a, b)) raster.setDataElements(i, j, colorData);
            }
        return image;
    }

    private boolean escapesToInfinity(double a, double b)
    {
        double x = 0.0;
        double y = 0.0;
        int iterations = 0;
        while (x <= 2 && y <= 2 && iterations < MAX_ITERATIONS)
        {
            double xnew = x * x - y * y + a;
            double ynew = 2 * x * y + b;
            x = xnew;
            y = ynew;
            iterations++;
        }
        return x > 2 || y > 2;
    }
}
```

### API — `java.awt.image.BufferedImage` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `BufferedImage(int width, int height, int imageType)` | dựng một object buffered image. `imageType` — các kiểu phổ biến nhất là `TYPE_INT_RGB`, `TYPE_INT_ARGB`, `TYPE_BYTE_GRAY`, `TYPE_BYTE_INDEXED` |
| `ColorModel getColorModel()` | trả về color model của buffered image này |
| `WritableRaster getRaster()` | lấy raster để **truy cập và sửa đổi pixel** của buffered image này |

### API — `java.awt.image.Raster` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `Object getDataElements(int x, int y, Object data)` | trả về sample data của một điểm raster, trong một mảng có **kiểu phần tử và độ dài phụ thuộc color model**. Nếu `data` khác `null`, nó được coi là mảng phù hợp để chứa sample data và **được lấp đầy**; nếu `data` là `null` thì **một mảng mới được cấp phát** |
| `int[]/float[]/double[] getPixel(int x, int y, ...)` · `getPixels(int x, int y, int width, int height, ...)` | trả về sample value của một điểm raster hoặc một hình chữ nhật các điểm raster, trong mảng có độ dài phụ thuộc color model. Các method này **chỉ hữu ích nếu bạn biết ý nghĩa của sample value đối với một color model** |

### API — `java.awt.image.WritableRaster` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `void setDataElements(int x, int y, Object data)` | đặt sample data cho một điểm raster. `data` là mảng đã được lấp đầy sample data cho một pixel |
| `void setPixel(...)` · `void setPixels(...)` (các dạng `int[]`, `float[]`, `double[]`) | đặt sample value cho một điểm raster hoặc một hình chữ nhật các điểm raster. **Chỉ hữu ích nếu bạn biết cách mã hoá sample value của color model** |

### API — `java.awt.image.ColorModel` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `int getRGB(Object data)` | trả về **giá trị ARGB** ứng với sample data truyền vào trong mảng `data` |
| `Object getDataElements(int argb, Object data)` | trả về sample data cho một giá trị màu. Nếu `data` khác `null`, nó được coi là mảng phù hợp và được lấp đầy; nếu `null` thì cấp phát mảng mới |

### API — `java.awt.Color` 1.0

| Method | Công dụng (theo sách) |
|---|---|
| `Color(int argb, boolean hasAlpha)` *(1.2)* | tạo một màu với giá trị ARGB gộp đã cho nếu `hasAlpha` là `true`, hoặc giá trị RGB nếu `hasAlpha` là `false` |
| `int getRGB()` | trả về giá trị màu ARGB ứng với màu này |

---

## 11.4.2.2. Filtering Images

> *"In the preceding section, you saw how to build up an image from scratch. However, often you want to access image data for a different reason: You already have an image and you want to improve it in some way."*

> *"Of course, you can use the getPixel/getDataElements methods that you saw in the preceding section to read the image data, manipulate them, and write them back. Fortunately, the Java 2D API already supplies a number of filters that carry out common image processing operations for you."*

**Dịch:** Java 2D API **đã cung cấp sẵn một loạt filter** thực hiện giúp bạn **các thao tác xử lý image thông dụng**.

> *"The image manipulations all implement the BufferedImageOp interface. After you construct the operation, simply call the filter method to transform an image into another."*

```java
BufferedImageOp op = . . .;
BufferedImage filteredImage
    = new BufferedImage(image.getWidth(), image.getHeight(), image.getType());
op.filter(image, filteredImage);
```

> *"Some operations can transform an image in place (op.filter(image, image)), but most can't."*

**Dịch:** Một số thao tác **biến đổi tại chỗ** được (`op.filter(image, image)`), nhưng **phần lớn thì không**.

> *"Five classes implement the BufferedImageOp interface:"*

```
AffineTransformOp   RescaleOp   LookupOp   ColorConvertOp   ConvolveOp
```

### AffineTransformOp

> *"The AffineTransformOp carries out an affine transformation on the pixels. For example, here is how you can rotate an image about its center:"*

```java
AffineTransform transform = AffineTransform.getRotateInstance(Math.toRadians(angle),
    image.getWidth() / 2, image.getHeight() / 2);
var op = new AffineTransformOp(transform, interpolation);
op.filter(image, filteredImage);
```

> *"The AffineTransformOp constructor requires an affine transform and an interpolation strategy. Interpolation is necessary to determine the target image pixels if the source pixels are transformed somewhere between target pixels. For example, if you rotate source pixels, they will generally not fall exactly onto target pixels. There are three interpolation strategies: AffineTransformOp.TYPE_BICUBIC, AffineTransformOp.TYPE_BILINEAR, and AffineTransformOp.TYPE_NEAREST_NEIGHBOR. Bicubic interpolation takes a bit longer but looks better than the other two."*

**Dịch:** Constructor `AffineTransformOp` cần **một affine transform và một chiến lược nội suy**. **Nội suy là cần thiết** để xác định pixel của image đích khi pixel nguồn bị biến đổi **rơi vào khoảng giữa các pixel đích**. Ví dụ, khi bạn xoay pixel nguồn, **nói chung chúng sẽ không rơi đúng vào pixel đích**. Có **ba chiến lược nội suy**; **bicubic mất thời gian hơn một chút nhưng trông đẹp hơn hai cái kia**.

### RescaleOp

> *"The RescaleOp carries out a rescaling operation"*

```
xnew = a · x + b
```

> *"for each of the color components in the image. (Alpha components are not affected.) The effect of rescaling with a > 1 is to brighten the image. Construct the RescaleOp by specifying the scaling parameters and optional rendering hints."*

```java
float a = 1.1f;
float b = 20.0f;
var op = new RescaleOp(a, b, null);
```

> *"You can also supply separate scaling values for each color component."*

**Dịch:** `RescaleOp` thực hiện phép **rescale** trên **từng thành phần màu** của image (**thành phần alpha không bị ảnh hưởng**). Rescale với **`a > 1` làm sáng image lên**. Cũng cung cấp được **giá trị scale riêng cho từng thành phần màu**.

### LookupOp

> *"The LookupOp operation lets you specify an arbitrary mapping of sample values. Supply a table that specifies how each value should be mapped. In the example program, we compute the negative of all colors, changing the color c to 255 – c."*

> *"The LookupOp constructor requires an object of type LookupTable and a map of optional hints. The LookupTable class is abstract, with two concrete subclasses: ByteLookupTable and ShortLookupTable. Since RGB color values are bytes, a ByteLookupTable should suffice. However, because of the bug described in http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6183251, we will use a ShortLookupTable instead. Here is how we construct the LookupOp for the example program:"*

```java
var negative = new short[256];
for (int i = 0; i < 256; i++) negative[i] = (short) (255 - i);
var table = new ShortLookupTable(0, negative);
var op = new LookupOp(table, null);
```

> *"The lookup is applied to each color component separately, but not to the alpha component. You can also supply different lookup tables for each color component."*

**Dịch:** `LookupOp` cho bạn chỉ định **ánh xạ tuỳ ý của sample value**: cung cấp một **bảng** quy định mỗi giá trị được ánh xạ thế nào. Ví dụ trong sách tính **âm bản** của mọi màu, đổi màu `c` thành `255 – c`. Class `LookupTable` là **abstract**, có **hai subclass cụ thể**: `ByteLookupTable` và `ShortLookupTable`. Vì giá trị màu RGB là byte nên `ByteLookupTable` **lẽ ra là đủ**; nhưng vì **một bug** nên sách dùng `ShortLookupTable` thay thế. Lookup được áp dụng **riêng cho từng thành phần màu, nhưng không áp cho thành phần alpha**.

> **Note (sách):** *"You cannot apply a LookupOp to an image with an indexed color model. (In those images, each sample value is an offset into a color palette.)"*
>
> **Dịch:** **Không áp dụng được `LookupOp`** cho image có **indexed color model** — ở những image đó, **mỗi sample value là một offset vào một bảng màu (color palette)**.

> *"The ColorConvertOp is useful for color space conversions. We do not discuss it here."*

**Dịch:** `ColorConvertOp` hữu ích cho **chuyển đổi không gian màu**; sách **không bàn tới nó ở đây**.

### ConvolveOp

> *"The most powerful of the transformations is the ConvolveOp, which carries out a mathematical convolution. We won't get too deeply into the mathematical details, but the basic idea is simple. Consider, for example, the blur filter (see Figure 11.58)."*

> *"The blurring is achieved by replacing each pixel with the average value from the pixel and its eight neighbors. Intuitively, it makes sense why this operation would blur out the picture. Mathematically, the averaging can be expressed as a convolution operation with the following kernel:"*

```
1/9  1/9  1/9
1/9  1/9  1/9
1/9  1/9  1/9
```

> *"The kernel of a convolution is a matrix that tells what weights should be applied to the neighboring values. The kernel above produces a blurred image. A different kernel carries out edge detection, locating the areas of color changes:"*

```
 0   -1    0
-1    4   -1
 0   -1    0
```

> *"Edge detection is an important technique for analyzing photographic images (see Figure 11.59)."*

**Dịch:** Phép biến đổi **mạnh nhất** là `ConvolveOp`, thực hiện một **tích chập (convolution) toán học**. Làm mờ đạt được bằng cách **thay mỗi pixel bằng giá trị trung bình của chính nó và tám pixel láng giềng**. **Kernel** của một convolution là **một ma trận cho biết trọng số nào nên áp lên các giá trị láng giềng**. Kernel thứ nhất tạo ảnh mờ; kernel thứ hai thực hiện **edge detection** — **định vị các vùng có biến đổi màu**. Edge detection là **kỹ thuật quan trọng để phân tích ảnh chụp**.

> *"To construct a convolution operation, first set up an array of the values for the kernel and construct a Kernel object. Then, construct a ConvolveOp object from the kernel and use it for filtering."*

```java
float[] elements =
{
    0.0f, -1.0f, 0.0f,
    -1.0f, 4.f, -1.0f,
    0.0f, -1.0f, 0.0f
};
var kernel = new Kernel(3, 3, elements);
var op = new ConvolveOp(kernel);
op.filter(image, filteredImage);
```

> *"The program in Listing 11.22 allows a user to load in a GIF or JPEG image and carry out the image manipulations that we discussed. Thanks to the power of the operations provided by Java 2D API, the program is very simple."*

**Dịch:** Nhờ **sức mạnh của các thao tác mà Java 2D API cung cấp**, chương trình ví dụ **rất đơn giản**.

### API — `java.awt.image.BufferedImageOp` 1.2

| Method | Công dụng (theo sách) |
|---|---|
| `BufferedImage filter(BufferedImage source, BufferedImage dest)` | áp thao tác image lên image nguồn và lưu kết quả vào image đích. **Nếu `dest` là `null` thì một image đích mới được tạo.** Image đích được trả về |

### API — `java.awt.image.AffineTransformOp` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `AffineTransformOp(AffineTransform t, int interpolationType)` | dựng một affine transform operator. `interpolationType` là một trong `TYPE_BILINEAR`, `TYPE_BICUBIC`, `TYPE_NEAREST_NEIGHBOR` |

### API — `java.awt.image.RescaleOp` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `RescaleOp(float a, float b, RenderingHints hints)` · `RescaleOp(float[] as, float[] bs, RenderingHints hints)` | dựng một rescale operator thực hiện phép `xnew = a · x + b`. Với constructor thứ nhất, **mọi thành phần màu (nhưng không phải thành phần alpha) được scale bằng cùng hệ số**. Với constructor thứ hai, bạn cung cấp **hoặc giá trị cho từng thành phần màu** (khi đó alpha không bị ảnh hưởng), **hoặc giá trị cho cả alpha lẫn các thành phần màu** |

### API — `java.awt.image.LookupOp` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `LookupOp(LookupTable table, RenderingHints hints)` | dựng một lookup operator cho lookup table đã cho |

### API — `java.awt.image.ByteLookupTable` / `ShortLookupTable` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `ByteLookupTable(int offset, byte[] data)` · `ByteLookupTable(int offset, byte[][] data)` | dựng lookup table để chuyển đổi giá trị `byte`. **`offset` được trừ khỏi input trước khi tra bảng.** Giá trị ở constructor thứ nhất áp cho mọi thành phần màu nhưng **không áp cho alpha**; ở constructor thứ hai, cung cấp giá trị cho từng thành phần màu (alpha không bị ảnh hưởng) hoặc cho cả alpha lẫn màu |
| `ShortLookupTable(int offset, short[] data)` · `ShortLookupTable(int offset, short[][] data)` | như trên, nhưng chuyển đổi giá trị `short` |

### API — `java.awt.image.ConvolveOp` / `Kernel` 1.2

| Constructor | Công dụng (theo sách) |
|---|---|
| `ConvolveOp(Kernel kernel)` · `ConvolveOp(Kernel kernel, int edgeCondition, RenderingHints hints)` | dựng một convolution operator. `edgeCondition` là một trong `EDGE_NO_OP` và `EDGE_ZERO_FILL`. **Giá trị ở rìa cần được xử lý đặc biệt** vì chúng **không có đủ giá trị láng giềng để tính convolution**. Mặc định là **`EDGE_ZERO_FILL`** |
| `Kernel(int width, int height, float[] matrixElements)` | dựng một kernel cho ma trận đã cho |

---

## Bài kế tiếp

→ [[05 - Printing]] — in đồ hoạ, in nhiều trang, print service, stream print service, và printing attribute.
