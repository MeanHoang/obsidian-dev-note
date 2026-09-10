# 00 — Lộ trình học Java

> Phần 2 series [Road to Backend Developer](https://roadmap.sh/backend) — chọn **Java** làm ngôn ngữ backend.
>
> **Nguồn chính:** sách **"Core Java" — Cay S. Horstmann** (Volume I: 13th Ed, Java 21 | Volume II: 11th Ed, Java 11).
>
> Mục tiêu: **hiểu bản chất Java** (JVM, memory model, concurrency, WORA) + **tư duy OOP bài bản** + chuẩn bị phỏng vấn — không phải stack công việc hằng ngày (JS/Node).

---

## 📖 Volume I — Fundamentals (13th Edition)

> Cuốn chính — cover từ nền tảng đến concurrency.

### [[02 - Java/Volume I - Fundamentals/01 - An Introduction to Java/00 - Mục lục|Chapter 1: An Introduction to Java]]
- 1.1 Java as a Programming Platform
- 1.2 The Java "White Paper" Buzzwords
- 1.3 Java Applets and the Internet
- 1.4 A Short History of Java
- 1.5 Common Misconceptions about Java

### [[02 - Java/Volume I - Fundamentals/02 - The Java Programming Environment/00 - Mục lục|Chapter 2: The Java Programming Environment]]
- 2.1 Installing the Java Development Kit
- 2.2 Using the Command-Line Tools
- 2.3 Using an Integrated Development Environment
- 2.4 JShell

### [[02 - Java/Volume I - Fundamentals/03 - Fundamental Programming Structures/00 - Mục lục|Chapter 3: Fundamental Programming Structures in Java]]
- 3.1 A Simple Java Program
- 3.2 Comments
- 3.3 Data Types
- 3.4 Variables and Constants
- 3.5 Operators
- 3.6 Strings
- 3.7 Input and Output
- 3.8 Control Flow
- 3.9 Big Numbers
- 3.10 Arrays

### [[02 - Java/Volume I - Fundamentals/04 - Objects and Classes/00 - Mục lục|Chapter 4: Objects and Classes]] ⭐
- 4.1 Introduction to Object-Oriented Programming
- 4.2 Using Predefined Classes
- 4.3 Defining Your Own Classes
- 4.4 Static Fields and Methods
- 4.5 Method Parameters
- 4.6 Object Construction
- 4.7 Records
- 4.8 Packages
- 4.9 JAR Files
- 4.10 Documentation Comments
- 4.11 Class Design Hints

### [[02 - Java/Volume I - Fundamentals/05 - Inheritance/00 - Mục lục|Chapter 5: Inheritance]] ⭐
- 5.1 Classes, Superclasses, and Subclasses
- 5.2 Object: The Cosmic Superclass
- 5.3 Generic Array Lists
- 5.4 Object Wrappers and Autoboxing
- 5.5 Methods with a Variable Number of Arguments
- 5.6 Abstract Classes
- 5.7 Enumeration Classes
- 5.8 Sealed Classes
- 5.9 Pattern Matching
- 5.10 Reflection
- 5.11 Design Hints for Inheritance

### [[02 - Java/Volume I - Fundamentals/06 - Interfaces, Lambda, Inner Classes/00 - Mục lục|Chapter 6: Interfaces, Lambda Expressions, and Inner Classes]]
- 6.1 Interfaces
- 6.2 Lambda Expressions
- 6.3 Inner Classes
- 6.4 Service Loaders
- 6.5 Proxies

### [[02 - Java/Volume I - Fundamentals/07 - Exceptions, Assertions, Logging/00 - Mục lục|Chapter 7: Exceptions, Assertions, and Logging]]
- 7.1 Dealing with Errors
- 7.2 Catching Exceptions
- 7.3 Tips for Using Exceptions
- 7.4 Using Assertions
- 7.5 Logging
- 7.6 Debugging Tips

### [[02 - Java/Volume I - Fundamentals/08 - Generic Programming/00 - Mục lục|Chapter 8: Generic Programming]]
- 8.1 Why Generic Programming?
- 8.2 Defining a Simple Generic Class
- 8.3 Generic Methods
- 8.4 Bounds for Type Variables
- 8.5 Generic Code and the Virtual Machine
- 8.6 Inheritance Rules for Generic Types
- 8.7 Wildcard Types
- 8.8 Restrictions and Limitations
- 8.9 Reflection and Generics

### [[02 - Java/Volume I - Fundamentals/09 - Collections/00 - Mục lục|Chapter 9: Collections]] ⭐
- 9.1 The Java Collections Framework
- 9.2 Interfaces in the Collections Framework
- 9.3 Concrete Collections
- 9.4 Maps
- 9.5 Copies and Views
- 9.6 Algorithms
- 9.7 Legacy Collections

### [[02 - Java/Volume I - Fundamentals/10 - Concurrency/00 - Mục lục|Chapter 10: Concurrency]] ⭐⭐
- 10.1 Running Threads
- 10.2 Thread States
- 10.3 Thread Properties
- 10.4 Coordinating Tasks
- 10.5 Synchronization
- 10.6 Thread-Safe Collections
- 10.7 Asynchronous Computations
- 10.8 Processes

### [[02 - Java/Volume I - Fundamentals/11 - Annotations/00 - Mục lục|Chapter 11: Annotations]]
- 11.1 Using Annotations
- 11.2 Defining Annotations
- 11.3 Annotations in the Java API
- 11.4 Processing Annotations at Runtime
- 11.5 Source-Level Annotation Processing
- 11.6 Bytecode Engineering

### [[02 - Java/Volume I - Fundamentals/12 - The Java Platform Module System/00 - Mục lục|Chapter 12: The Java Platform Module System]]
- 12.1 The Module Concept
- 12.2 Naming Modules
- 12.3 The Modular "Hello, World!" Program
- 12.4 Requiring Modules
- 12.5 Exporting Packages
- 12.6 Modular JARs
- 12.7 Modules and Reflective Access
- 12.8 Automatic Modules
- 12.9 The Unnamed Module
- 12.10 Command-Line Flags for Migration
- 12.11 Transitive and Static Requirements
- 12.12 Qualified Exporting and Opening
- 12.13 Service Loading
- 12.14 Tools for Working with Modules

---

## 📖 Volume II — Advanced Features (11th Edition)

> Đọc sau khi xong Volume I — chủ yếu khi cần Streams, Database, Networking.

### [[02 - Java/Volume II - Advanced Features/01 - Streams/00 - Mục lục|Chapter 1: Streams]]
- 1.1 From Iterating to Stream Operations
- 1.2 Stream Creation
- 1.3 The filter, map, and flatMap Methods
- 1.4 Extracting Substreams and Combining Streams
- 1.5 Other Stream Transformations
- 1.6 Simple Reductions
- 1.7 The Optional Type
- 1.8 Collecting Results
- 1.9 Collecting into Maps
- 1.10 Grouping and Partitioning
- 1.11 Downstream Collectors
- 1.12 Reduction Operations
- 1.13 Primitive Type Streams
- 1.14 Parallel Streams

### [[02 - Java/Volume II - Advanced Features/02 - Input and Output/00 - Mục lục|Chapter 2: Input and Output]]
- 2.1 Input/Output Streams
- 2.2 Reading and Writing Binary Data
- 2.3 Object Input/Output Streams and Serialization
- 2.4 Working with Files
- 2.5 Memory-Mapped Files
- 2.6 File Locking
- 2.7 Regular Expressions

### [[02 - Java/Volume II - Advanced Features/03 - XML/00 - Mục lục|Chapter 3: XML]]
- 3.1 Introducing XML
- 3.2 The Structure of an XML Document
- 3.3 Parsing an XML Document
- 3.4 Validating XML Documents
- 3.5 Locating Information with XPath
- 3.6 Using Namespaces
- 3.7 Streaming Parsers
- 3.8 Generating XML Documents
- 3.9 XSL Transformations

### [[02 - Java/Volume II - Advanced Features/04 - Networking/00 - Mục lục|Chapter 4: Networking]]
- 4.1 Connecting to a Server
- 4.2 Implementing Servers
- 4.3 Getting Web Data
- 4.4 The HTTP Client
- 4.5 Sending E-Mail

### [[02 - Java/Volume II - Advanced Features/05 - Database Programming/00 - Mục lục|Chapter 5: Database Programming]] ⭐
- 5.1 The Design of JDBC
- 5.2 The Structured Query Language
- 5.3 JDBC Configuration
- 5.4 Working with JDBC Statements
- 5.5 Query Execution
- 5.6 Scrollable and Updatable Result Sets
- 5.7 Row Sets
- 5.8 Metadata
- 5.9 Transactions
- 5.10 Connection Management in Web and Enterprise Applications

### [[02 - Java/Volume II - Advanced Features/06 - The Date and Time API/00 - Mục lục|Chapter 6: The Date and Time API]]
- 6.1 The Time Line
- 6.2 Local Dates
- 6.3 Date Adjusters
- 6.4 Local Time
- 6.5 Zoned Time
- 6.6 Formatting and Parsing
- 6.7 Interoperating with Legacy Code

### [[02 - Java/Volume II - Advanced Features/07 - Internationalization/00 - Mục lục|Chapter 7: Internationalization]]
- 7.1 Locales
- 7.2 Number Formats
- 7.3 Date and Time
- 7.4 Collation and Normalization
- 7.5 Message Formatting
- 7.6 Text Input and Output
- 7.7 Resource Bundles
- 7.8 A Complete Example

### [[02 - Java/Volume II - Advanced Features/08 - Scripting, Compiling, Annotation Processing/00 - Mục lục|Chapter 8: Scripting, Compiling, and Annotation Processing]]
- 8.1 Scripting for the Java Platform
- 8.2 The Compiler API
- 8.3 Using Annotations
- 8.4 Annotation Syntax
- 8.5 Standard Annotations
- 8.6 Source-Level Annotation Processing
- 8.7 Bytecode Engineering

### [[02 - Java/Volume II - Advanced Features/09 - The Java Platform Module System/00 - Mục lục|Chapter 9: The Java Platform Module System]]
- 9.1 The Module Concept
- 9.2 Naming Modules
- 9.3 The Modular "Hello, World!" Program
- 9.4 Requiring Modules
- 9.5 Exporting Packages
- 9.6 Modular JARs
- 9.7 Modules and Reflective Access
- 9.8 Automatic Modules
- 9.9 The Unnamed Module
- 9.10 Command-Line Flags for Migration
- 9.11 Transitive and Static Requirements
- 9.12 Qualified Exporting and Opening
- 9.13 Service Loading
- 9.14 Tools for Working with Modules

### [[02 - Java/Volume II - Advanced Features/10 - Security/00 - Mục lục|Chapter 10: Security]]
- 10.1 Class Loaders
- 10.2 User Authentication
- 10.3 Digital Signatures
- 10.4 Encryption

### [[02 - Java/Volume II - Advanced Features/11 - Advanced Swing and Graphics/00 - Mục lục|Chapter 11: Advanced Swing and Graphics]]
- 11.1 Tables
- 11.2 Trees
- 11.3 Advanced AWT
- 11.4 Raster Images
- 11.5 Printing

### [[02 - Java/Volume II - Advanced Features/12 - Native Methods/00 - Mục lục|Chapter 12: Native Methods]]
- 12.1 Calling a C Function from a Java Program
- 12.2 Numeric Parameters and Return Values
- 12.3 String Parameters
- 12.4 Accessing Fields
- 12.5 Encoding Signatures
- 12.6 Calling Java Methods
- 12.7 Accessing Array Elements
- 12.8 Handling Errors
- 12.9 Using the Invocation API
- 12.10 A Complete Example: Accessing the Windows Registry
- 12.11 Foreign Functions: A Glimpse into the Future

---

## Nguồn tham khảo
- **Core Java, Volume I — Fundamentals, 13th Edition** — Cay S. Horstmann (Java 21)
- **Core Java, Volume II — Advanced Features, 11th Edition** — Cay S. Horstmann (Java 11)
- [roadmap.sh — Java](https://roadmap.sh/java)
