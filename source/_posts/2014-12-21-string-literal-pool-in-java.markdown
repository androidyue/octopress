---
layout: post
title: "Java中的字符串常量池"
date: 2014-12-21 19:09
comments: true
categories: Java JVM
---
Java中字符串对象创建有两种形式，一种为字面量形式，如`String str = "droid";`，另一种就是使用**new**这种标准的构造对象的方法，如`String str = new String("droid");`，这两种方式我们在代码编写时都经常使用，尤其是字面量的方式。然而这两种实现其实存在着一些性能和内存占用的差别。这一切都是源于JVM为了减少字符串对象的重复创建，其维护了一个特殊的内存，这段内存被成为字符串常量池或者字符串字面量池。
<!--more-->
##工作原理
当代码中出现字面量形式创建字符串对象时，JVM首先会对这个字面量进行检查，如果字符串常量池中存在相同内容的字符串对象的引用，则将这个引用返回，否则新的字符串对象被创建，然后将这个引用放入字符串常量池，并返回该引用。

##举例说明
###字面量创建形式
```java
String str1 = "droid";
```
JVM检测这个字面量，这里我们认为没有内容为`droid`的对象存在。JVM通过字符串常量池查找不到内容为`droid`的字符串对象存在，那么会创建这个字符串对象，然后将刚创建的对象的引用放入到字符串常量池中,并且将引用返回给变量str1。

如果接下来有这样一段代码
```java
String str2 = "droid";
```
同样JVM还是要检测这个字面量，JVM通过查找字符串常量池，发现内容为"droid"字符串对象存在，于是将已经存在的字符串对象的引用返回给变量str2。注意这里不会重新创建新的字符串对象。

验证是否为str1和str2是否指向同一对象，我们可以通过这段代码
```java
System.out.println(str1 == str2);
```
结果为`true`。

###使用new创建
```java
String str3 = new String("droid");
```
当我们使用了new来构造字符串对象的时候，不管字符串常量池中有没有相同内容的对象的引用，新的字符串对象都会创建。因此我们使用下面代码测试一下，
```java
String str3 = new String("droid");
System.out.println(str1 == str3);
```
结果如我们所想，为`false`，表明这两个变量指向的为不同的对象。

###intern
对于上面使用new创建的字符串对象，如果想将这个对象的引用加入到字符串常量池，可以使用intern方法。

调用intern后，首先检查字符串常量池中是否有该对象的引用，如果存在，则将这个引用返回给变量，否则将引用加入并返回给变量。
```java
String str4 = str3.intern();
System.out.println(str4 == str1);
```
输出的结果为`true`。


##疑难问题
###前提条件？
字符串常量池实现的前提条件就是Java中String对象是不可变的，这样可以安全保证多个变量共享同一个对象。如果Java中的String对象可变的话，一个引用操作改变了对象的值，那么其他的变量也会受到影响，显然这样是不合理的。

###引用 or 对象
字符串常量池中存放的时引用还是对象，这个问题是最常见的。字符串常量池存放的是对象引用，不是对象。**在Java中，对象都创建在堆内存中**。

更新验证，收到的很多评论也在讨论这个问题，我简单的进行了验证。
验证环境
```
22:18:54-androidyue~/Videos$ cat /etc/os-release
NAME=Fedora
VERSION="17 (Beefy Miracle)"
ID=fedora
VERSION_ID=17
PRETTY_NAME="Fedora 17 (Beefy Miracle)"
ANSI_COLOR="0;34"
CPE_NAME="cpe:/o:fedoraproject:fedora:17"

22:19:04-androidyue~/Videos$ java -version
java version "1.7.0_25"
OpenJDK Runtime Environment (fedora-2.3.12.1.fc17-x86_64)
OpenJDK 64-Bit Server VM (build 23.7-b01, mixed mode)
```
验证思路：以下的Java程序读取一个大小为82M的视频文件，以字符串形式进行intern操作。
```bash
22:01:17-androidyue~/Videos$ ll -lh | grep why_to_learn.mp4 
-rw-rw-r--. 1 androidyue androidyue  82M Oct 20  2013 why_to_learn.mp4
```
验证代码
```java
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


public class TestMain {
	private static String fileContent;
	public static void main(String[] args) {
		fileContent = readFileToString(args[0]);
		if (null != fileContent) {
			fileContent = fileContent.intern();
			System.out.println("Not Null");
		}
	}
	
	
	private static String readFileToString(String file) {
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new FileReader(file));
			StringBuffer buff = new StringBuffer();
			String line;
			while ((line = reader.readLine()) != null) {
				buff.append(line);
			}
			return buff.toString();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (null != reader) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	}
}

```
由于字符串常量池存在于堆内存中的永久代，适用于Java8之前。我们通过设置永久代一个很小的值来进行验证。如果字符串对象存在字符串常量池中，那么必然抛出`java.lang.OutOfMemoryError permgen space`错误。
```bash
java -XX:PermSize=6m TestMain ~/Videos/why_to_learn.mp4
```
运行证明程序没有抛出OOM，其实这个不能很好的证明存储的是对象还是引用。

但是这个至少证明了字符串的实际内容对象char[]不存放在字符串常量池中。既然这样的话，其实字符串常量池存储字符串对象还是字符串对象的引用反而不是那么重要。但个人还是倾向于存储的为引用。

###优缺点
字符串常量池的好处就是减少相同内容字符串的创建，节省内存空间。

如果硬要说弊端的话，就是牺牲了CPU计算时间来换空间。CPU计算时间主要用于在字符串常量池中查找是否有内容相同对象的引用。不过其内部实现为HashTable，所以计算成本较低。

###GC回收？
因为字符串常量池中持有了共享的字符串对象的引用，这就是说是不是会导致这些对象无法回收？

首先问题中共享的对象一般情况下都比较小。据我查证了解，在早期的版本中确实存在这样的问题，但是随着[弱引用](http://droidyue.com/blog/2014/10/12/understanding-weakreference-in-java/)的引入，目前这个问题应该没有了。

关于这个问题，可以具体了解这片文章[interned Strings : Java Glossary](http://mindprod.com/jgloss/interned.html#GC)

###intern使用？
关于使用intern的前提就是你清楚自己确实需要使用。比如，我们这里有一份上百万的记录，其中记录的某个值多次为**美国加利福尼亚州**，我们不想创建上百万条这样的字符串对象，我们可以使用intern只在内存中保留一份即可。关于intern更深入的了解请参考[深入解析String#intern](http://tech.meituan.com/in_depth_understanding_string_intern.html)。

###总有例外？
你知道下面的代码，会创建几个字符串对象，在字符串常量池中保存几个引用么？
```java
String test = "a" + "b" + "c";
```
答案是只创建了一个对象，在常量池中也只保存一个引用。我们使用javap反编译看一下即可得知。
```java
17:02 $ javap -c TestInternedPoolGC
Compiled from "TestInternedPoolGC.java"
public class TestInternedPoolGC extends java.lang.Object{
public TestInternedPoolGC();
  Code:
   0:	aload_0
   1:	invokespecial	#1; //Method java/lang/Object."<init>":()V
   4:	return

public static void main(java.lang.String[])   throws java.lang.Exception;
  Code:
   0:	ldc	#2; //String abc
   2:	astore_1
   3:	return
```
看到了么，实际上在编译期间，已经将这三个字面量合成了一个。这样做实际上是一种优化，避免了创建多余的字符串对象，也没有发生字符串拼接问题。关于字符串拼接，可以查看[Java细节：字符串的拼接](http://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)。

##参考文章
  * [JVMInternals](http://blog.jamesdbloom.com/JVMInternals.html)
  * [Strings, Literally](http://www.javaranch.com/journal/200409/ScjpTipLine-StringsLiterally.html)
  * [STRING LITERAL POOL](http://theopentutorials.com/tutorials/java/strings/string-literal-pool/)
  * [interned Strings : Java Glossary](http://mindprod.com/jgloss/interned.html)








