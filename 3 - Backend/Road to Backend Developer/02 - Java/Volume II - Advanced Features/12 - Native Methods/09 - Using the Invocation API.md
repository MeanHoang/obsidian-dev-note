# 09 — Using the Invocation API

> Chapter 12, Section 12.9 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 12.9 Using the Invocation API

> *"Up to now, we have considered programs in the Java programming language that made a few C calls, presumably because C was faster or allowed access to functionality inaccessible from the Java platform. Suppose you are in the opposite situation. You have a C or C++ program and would like to make calls to Java code. The invocation API enables you to embed the Java virtual machine into a C or C++ program. Here is the minimal code that you need to initialize a virtual machine:"*

**Dịch:** Đến giờ ta xét các chương trình Java thực hiện vài lời gọi C, hẳn là vì C **nhanh hơn** hoặc **cho truy cập chức năng mà Java platform không với tới được**. Giả sử bạn ở **tình huống ngược lại**: bạn có một chương trình C hoặc C++ và muốn **gọi vào code Java**. **Invocation API cho phép bạn nhúng Java virtual machine vào một chương trình C hoặc C++.**

```c
JavaVMOption options[1];
JavaVMInitArgs vm_args;
JavaVM *jvm;
JNIEnv *env;
options[0].optionString = "-Djava.class.path=.";

memset(&vm_args, 0, sizeof(vm_args));
vm_args.version = JNI_VERSION_1_2;
vm_args.nOptions = 1;
vm_args.options = options;
JNI_CreateJavaVM(&jvm, (void**) &env, &vm_args);
```

> *"The call to JNI_CreateJavaVM creates the virtual machine and fills in a pointer jvm to the virtual machine and a pointer env to the execution environment."*

**Dịch:** Lời gọi **`JNI_CreateJavaVM`** tạo ra virtual machine và điền vào **con trỏ `jvm` trỏ tới virtual machine** và **con trỏ `env` trỏ tới execution environment**.

> *"You can supply any number of options to the virtual machine. Simply increase the size of the options array and the value of vm_args.nOptions. For example,"*

```c
options[i].optionString = "-Djava.compiler=NONE";
```

> *"deactivates the just-in-time compiler."*

**Dịch:** Bạn cấp **bao nhiêu option cho VM cũng được** — chỉ cần tăng kích thước mảng `options` và giá trị `vm_args.nOptions`. Ví dụ dòng trên **tắt just-in-time compiler**.

> **Tip (sách):** *"When you run into trouble and your program crashes, refuses to initialize the JVM, or can't load your classes, turn on the JNI debugging mode. Set an option to"*
>
> ```c
> options[i].optionString = "-verbose:jni";
> ```
>
> *"You will see a flurry of messages that indicate the progress in initializing the JVM. If you don't see your classes loaded, check both your path and class path settings."*
>
> **Dịch:** Khi gặp trục trặc — chương trình crash, không chịu khởi tạo JVM, hoặc không load được class — hãy **bật chế độ JNI debugging**. Bạn sẽ thấy **một loạt message** cho biết tiến trình khởi tạo JVM. Nếu không thấy class của mình được load, **kiểm tra cả path lẫn class path**.

> *"Once you have set up the virtual machine, you can call Java methods as described in the preceding sections. Simply use the env pointer in the usual way. You'll need the jvm pointer only to call other functions in the invocation API. Currently, there are only four such functions. The most important one is the function to terminate the virtual machine:"*

```c
(*jvm)->DestroyJavaVM(jvm);
```

**Dịch:** Khi đã dựng xong virtual machine, bạn gọi Java method như mô tả ở các mục trước — cứ **dùng con trỏ `env` như thường lệ** (xem [[06 - Calling Java Methods]]). Bạn **chỉ cần con trỏ `jvm` để gọi các function khác trong invocation API**. Hiện tại **chỉ có bốn function như vậy**. Quan trọng nhất là function **kết thúc virtual machine**.

> *"Unfortunately, under Windows, it has become difficult to dynamically link to the JNI_CreateJavaVM function in the jre/bin/client/jvm.dll library, due to the changed linking rules in Vista and Oracle's reliance on an older C runtime library. Our sample program overcomes this problem by loading the library manually. This is the same approach used by the java program—see the file launcher/java_md.c in the src.jar file that is a part of the JDK."*

**Dịch:** Đáng tiếc là trên Windows, việc **link động tới function `JNI_CreateJavaVM`** trong library `jre/bin/client/jvm.dll` đã trở nên khó khăn, do **quy tắc linking thay đổi ở Vista** và việc Oracle **dựa vào một C runtime library cũ hơn**. Chương trình mẫu khắc phục bằng cách **load library thủ công** — chính là cách mà chương trình `java` dùng.

> *"The C program in Listing 12.20 sets up a virtual machine and calls the main method of the Welcome class, which was discussed in Volume I, Chapter 2. (Make sure to compile the Welcome.java file before starting the invocation test program.)"*

**Dịch:** Chương trình C dựng một virtual machine và **gọi method `main` của class `Welcome`** (bàn ở Volume I, Chapter 2). **Nhớ compile file `Welcome.java` trước khi chạy chương trình test.**

### Listing 12.20 — `invocation/InvocationTest.c`

```c
/**
   @version 1.20 2007-10-26
   @author Cay Horstmann
*/

#include <jni.h>
#include <stdlib.h>

#ifdef _WINDOWS

#include <windows.h>
static HINSTANCE loadJVMLibrary(void);
typedef jint (JNICALL *CreateJavaVM_t)(JavaVM **, void **, JavaVMInitArgs *);

#endif

int main()
{
   JavaVMOption options[2];
   JavaVMInitArgs vm_args;
   JavaVM *jvm;
   JNIEnv *env;
   long status;

   jclass class_Welcome;
   jclass class_String;
   jobjectArray args;
   jmethodID id_main;

#ifdef _WINDOWS
   HINSTANCE hjvmlib;
   CreateJavaVM_t createJavaVM;
#endif

   options[0].optionString = "-Djava.class.path=.";

   memset(&vm_args, 0, sizeof(vm_args));
   vm_args.version = JNI_VERSION_1_2;
   vm_args.nOptions = 1;
   vm_args.options = options;

#ifdef _WINDOWS
   hjvmlib = loadJVMLibrary();
   createJavaVM = (CreateJavaVM_t) GetProcAddress(hjvmlib, "JNI_CreateJavaVM");
   status = (*createJavaVM)(&jvm, (void **) &env, &vm_args);
#else
   status = JNI_CreateJavaVM(&jvm, (void **) &env, &vm_args);
#endif

   if (status == JNI_ERR)
   {
      fprintf(stderr, "Error creating VM\n");
      return 1;
   }

   class_Welcome = (*env)->FindClass(env, "Welcome");
   id_main = (*env)->GetStaticMethodID(env, class_Welcome, "main", "([Ljava/lang/String;)V");

   class_String = (*env)->FindClass(env, "java/lang/String");
   args = (*env)->NewObjectArray(env, 0, class_String, NULL);
   (*env)->CallStaticVoidMethod(env, class_Welcome, id_main, args);

   (*jvm)->DestroyJavaVM(jvm);

   return 0;
}

#ifdef _WINDOWS

static int GetStringFromRegistry(HKEY key, const char *name, char *buf, jint bufsize)
{
   DWORD type, size;

   return RegQueryValueEx(key, name, 0, &type, 0, &size) == 0
      && type == REG_SZ
      && size < (unsigned int) bufsize
      && RegQueryValueEx(key, name, 0, 0, buf, &size) == 0;
}

static void GetPublicJREHome(char *buf, jint bufsize)
{
   HKEY key, subkey;
   char version[MAX_PATH];

   /* Find the current version of the JRE */
   char *JRE_KEY = "Software\\JavaSoft\\Java Runtime Environment";
   if (RegOpenKeyEx(HKEY_LOCAL_MACHINE, JRE_KEY, 0, KEY_READ, &key) != 0)
   {
      fprintf(stderr, "Error opening registry key '%s'\n", JRE_KEY);
      exit(1);
   }

   if (!GetStringFromRegistry(key, "CurrentVersion", version, sizeof(version)))
   {
      fprintf(stderr, "Failed reading value of registry key:\n\t%s\\CurrentVersion\n",
         JRE_KEY);
      RegCloseKey(key);
      exit(1);
   }

   /* Find directory where the current version is installed. */
   if (RegOpenKeyEx(key, version, 0, KEY_READ, &subkey) != 0)
   {
      fprintf(stderr, "Error opening registry key '%s\\%s'\n", JRE_KEY, version);
      RegCloseKey(key);
      exit(1);
   }

   if (!GetStringFromRegistry(subkey, "JavaHome", buf, bufsize))
   {
      fprintf(stderr, "Failed reading value of registry key:\n\t%s\\%s\\JavaHome\n",
         JRE_KEY, version);
      RegCloseKey(key);
      RegCloseKey(subkey);
      exit(1);
   }

   RegCloseKey(key);
   RegCloseKey(subkey);
}

static HINSTANCE loadJVMLibrary(void)
{
   HINSTANCE h1, h2;
   char msvcdll[MAX_PATH];
   char javadll[MAX_PATH];
   GetPublicJREHome(msvcdll, MAX_PATH);
   strcpy(javadll, msvcdll);
   strncat(msvcdll, "\\bin\\msvcr71.dll", MAX_PATH - strlen(msvcdll));
   msvcdll[MAX_PATH - 1] = '\0';
   strncat(javadll, "\\bin\\client\\jvm.dll", MAX_PATH - strlen(javadll));
   javadll[MAX_PATH - 1] = '\0';

   h1 = LoadLibrary(msvcdll);
   if (h1 == NULL)
   {
      fprintf(stderr, "Can't load library msvcr71.dll\n");
      exit(1);
   }

   h2 = LoadLibrary(javadll);
   if (h2 == NULL)
   {
      fprintf(stderr, "Can't load library jvm.dll\n");
      exit(1);
   }
   return h2;
}

#endif
```

---

## Compile chương trình

> *"To compile this program under Linux, use"*

```
gcc -I jdk/include -I jdk/include/linux -o InvocationTest \
  -L jdk/jre/lib/i386/client -ljvm InvocationTest.c
```

> *"When compiling in Windows with the Microsoft compiler, use the command line"*

```
cl -D_WINDOWS -I jdk\include -I jdk\include\win32 InvocationTest.c \
  jdk\lib\jvm.lib advapi32.lib
```

> *"You will need to make sure that the INCLUDE and LIB environment variables include the paths to the Windows API header and library files."*

**Dịch:** Bạn cần đảm bảo biến môi trường **`INCLUDE` và `LIB`** có chứa đường dẫn tới header file và library file của Windows API.

> *"Using Cygwin, compile with"*

```
gcc -D_WINDOWS -mno-cygwin -I jdk\include -I jdk\include\win32 -D__int64="long long" \
  -I c:\cygwin\usr\include\w32api -o InvocationTest
```

> *"Before you run the program under Linux/UNIX, make sure that the LD_LIBRARY_PATH contains the directories for the shared libraries. For example, if you use the bash shell on Linux, issue the following command:"*

```
export LD_LIBRARY_PATH=jdk/jre/lib/i386/client:$LD_LIBRARY_PATH
```

**Dịch:** Trước khi chạy chương trình trên Linux/UNIX, đảm bảo **`LD_LIBRARY_PATH` chứa các thư mục của shared library**.

---

## API — Invocation API Functions

| API | Mô tả |
|---|---|
| `jint JNI_CreateJavaVM(JavaVM** p_jvm, void** p_env, JavaVMInitArgs* vm_args)` | *"initializes the Java virtual machine. The function returns 0 if successful, JNI_ERR on failure."* — Khởi tạo Java virtual machine. Trả về `0` nếu thành công, **`JNI_ERR`** nếu thất bại. |
| `jint DestroyJavaVM(JavaVM* jvm)` | *"destroys the virtual machine. Returns 0 on success, a negative number on failure. This function must be called through a virtual machine pointer, that is, (*jvm)->DestroyJavaVM(jvm)."* — Huỷ virtual machine. Trả về `0` nếu thành công, số âm nếu thất bại. **Phải gọi thông qua con trỏ virtual machine.** |

---

## Bài kế tiếp

→ [[10 - A Complete Example - Accessing the Windows Registry]] — ví dụ hoàn chỉnh gói registry của Windows vào một Java class.
