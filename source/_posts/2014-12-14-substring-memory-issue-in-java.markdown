---
layout: post
title: "Java中的substring会引起内存泄露么？"
date: 2014-12-14 12:02
comments: true
categories: Java 
---
在Java中开发，String是我们开发程序可以说必须要使用的类型，String有一个substring方法用来截取字符串，我们想必也常常使用。但是你知道么，关于Java 6中的substring是否会引起内存泄露，在国外的论坛和社区有着一些讨论，以至于Java官方已经将其标记成bug，并且为此Java 7 还重新进行了实现。读到这里可能你的问题就来了，substring怎么会引起内存泄露呢？那么我们就带着问题，走进小黑屋，看看substring有没有内存泄露，又是怎么导致所谓的内存泄露。

<!--more-->
##基本介绍
substring方法提供两种重载，第一种为只接受开始截取位置一个参数的方法。
```java
public String substring(int beginIndex)
```
比如我们使用上面的方法，`"unhappy".substring(2)` 返回结果 `"happy"`

另一种重载就是接受一个开始截取位置和一个结束截取位置的参数的方法。
```java
public String substring(int beginIndex, int endIndex) 
```
使用这个方法，`"smiles".substring(1, 5)` 返回结果 `"mile"` 

通过这个介绍我们基本了解了substring的作用，这样便于我们理解下面的内容。

##准备工作
因为这个问题出现的情况在Java 6，如果你的Java版本号不是Java 6 需要调整一下。
###终端调整（适用于Mac系统）
查看java版本号
```bash
13:03 $ java -version
java version "1.8.0_25"
Java(TM) SE Runtime Environment (build 1.8.0_25-b17)
Java HotSpot(TM) 64-Bit Server VM (build 25.25-b02, mixed mode)
```
切换到1.6
```java
export JAVA_HOME=$(/usr/libexec/java_home -v 1.6)
```
Ubuntu使用`alternatives --config java`，Fedora上面使用`alternatives --config java`。

如果你使用Eclipse，可以选择工程，右击，选择Properties（属性）-- Java Compiler（Java编译器）进行特殊指定。
##问题重现
这里贴一下java官方bug里用到的重现问题的代码。
```java
public class TestGC {
    private String largeString = new String(new byte[100000]);
    
    String getString() {
        return this.largeString.substring(0,2);
    }
    
    public static void main(String[] args) {
        java.util.ArrayList list = new java.util.ArrayList();
        for (int i = 0; i < 1000000; i++) {
            TestGC gc = new TestGC();
            list.add(gc.getString());
        }
    }
}
```
然而上面的代码，只要使用Java 6 （Java 7和8 都不会抛出异常）运行一下就会报java.lang.OutOfMemoryError: Java heap space的异常，这说明没有足够的堆内存供我们创建对象，JVM选择了抛出异常操作。

于是有人会说，是因为你每个循环中创建了一个TestGC对象，虽然我们加入ArrayList只是两个字符的字符串，但是这个对象中又存储largeString这么大的对象，这样必然会造成OOM的。

然而，其实你说的不对。比如我们看一下这样的代码,我们只修改getString方法。
```java
public class TestGC {
    private String largeString = new String(new byte[100000]);
    
    String getString() {
        //return this.largeString.substring(0,2);
    	return new String("ab"); 
    }
    
    public static void main(String[] args) {
        java.util.ArrayList list = new java.util.ArrayList();
        for (int i = 0; i < 1000000; i++) {
            TestGC gc = new TestGC();
            list.add(gc.getString());
        }
        
    }
}
```
执行上面的方法，**并不会导致OOM异常**，因为我们持有的时1000000个ab字符串对象，而TestGC对象（包括其中的largeString）会在java的垃圾回收中释放掉。所以这里不会存在内存溢出。

那么究竟是什么导致的内存泄露呢？要研究这个问题，我们需要看一下方法的实现，即可。


##深入Java 6实现
在String类中存在这样三个属性

  * value 字符数组，存储字符串实际的内容
  * offset 该字符串在字符数组value中的起始位置
  * count 字符串包含的字符的长度

Java 6中substring的实现
```java
public String substring(int beginIndex, int endIndex) {
	if (beginIndex < 0) {
		throw new StringIndexOutOfBoundsException(beginIndex);
	}
	if (endIndex > count) {
		throw new StringIndexOutOfBoundsException(endIndex);
	}
	if (beginIndex > endIndex) {
		throw new StringIndexOutOfBoundsException(endIndex - beginIndex);
	}
	return ((beginIndex == 0) && (endIndex == count)) ? this :
		new String(offset + beginIndex, endIndex - beginIndex, value);
}
```
上述方法调用的构造方法
```java
//Package private constructor which shares value array for speed.
String(int offset, int count, char value[]) {
	this.value = value;
	this.offset = offset;
	this.count = count;
}
```
当我们读完上述的代码，我们应该会豁然开朗，原来是这个样子啊！

当我们调用字符串a的substring得到字符串b，其实这个操作，无非就是调整了一下b的offset和count，用到的内容还是a之前的value字符数组，并没有重新创建新的专属于b的内容字符数组。

举个和上面重现代码相关的例子，比如我们有一个1G的字符串a，我们使用substring(0,2)得到了一个只有两个字符的字符串b，如果b的生命周期要长于a或者手动设置a为null，当垃圾回收进行后，a被回收掉，b没有回收掉，那么这1G的内存占用依旧存在，因为b持有这1G大小的字符数组的引用。

看到这里，大家应该可以明白上面的代码为什么出现内存溢出了。

###共享内容字符数组
其实substring中生成的字符串与原字符串共享内容数组是一个很棒的设计，这样避免了每次进行substring重新进行字符数组复制。正如其文档说明的,共享内容字符数组为了就是速度。但是对于本例中的问题，共享内容字符数组显得有点蹩脚。

###如何解决
对于之前比较不常见的1G字符串只截取2个字符的情况可以使用下面的代码，这样的话，就不会持有1G字符串的内容数组引用了。
```java
String littleString = new String(largeString.substring(0,2));
```
下面的这个构造方法，在源字符串内容数组长度大于字符串长度时，进行数组复制，新的字符串会创建一个只包含源字符串内容的字符数组。
```java
public String(String original) {
	int size = original.count;
	char[] originalValue = original.value;
	char[] v;
	if (originalValue.length > size) {
		// The array representing the String is bigger than the new
		// String itself.  Perhaps this constructor is being called
		// in order to trim the baggage, so make a copy of the array.
		int off = original.offset;
		v = Arrays.copyOfRange(originalValue, off, off+size);
	} else {
		// The array representing the String is the same
		// size as the String, so no point in making a copy.
		v = originalValue;
	}
	this.offset = 0;
	this.count = size;
	this.value = v;
}
```
##Java 7 实现
在Java 7 中substring的实现抛弃了之前的内容字符数组共享的机制，对于子字符串（自身除外）采用了数组复制实现单个字符串持有自己的应该拥有的内容。
```java
public String substring(int beginIndex, int endIndex) {
    if (beginIndex < 0) {
    	throw new StringIndexOutOfBoundsException(beginIndex);
    }
    if (endIndex > value.length) {
    	throw new StringIndexOutOfBoundsException(endIndex);
    }
    int subLen = endIndex - beginIndex;
    if (subLen < 0) {
    	throw new StringIndexOutOfBoundsException(subLen);
    }
    return ((beginIndex == 0) && (endIndex == value.length)) ? this
                : new String(value, beginIndex, subLen);
}
```
substring方法中调用的构造方法，进行内容字符数组复制。
```java
public String(char value[], int offset, int count) {
    if (offset < 0) {
   		throw new StringIndexOutOfBoundsException(offset);
    }
    if (count < 0) {
    	throw new StringIndexOutOfBoundsException(count);
    }
    // Note: offset or count might be near -1>>>1.
    if (offset > value.length - count) {
    	throw new StringIndexOutOfBoundsException(offset + count);
    }
    this.value = Arrays.copyOfRange(value, offset, offset+count);
}
```

##真的是内存泄露么
我们知道了substring某些情况下可能引起内存问题，但是这个叫做内存泄露么？

其实个人认为这个不应该算为内存泄露，使用substring生成的字符串b固然会持有原有字符串a的内容数组引用，但是当a和b都被回收之后，该字符数组的内容也是可以被垃圾回收掉的。

##哪个版本实现的好
关于Java 7 对substring做的修改，收到了褒贬不一的反馈。

个人更加倾向于Java 6的实现，当进行substring时，使用共享内容字符数组，速度会更快，不用重新申请内存。虽然有可能出现本文中的内存性能问题，但也是有方法可以解决的。

Java 7的实现不需要程序员特殊操作避免了本文中问题，但是进行每次substring的操作性能总会比java 6 的实现要差一些。这种实现显得有点“糟糕”。

##问题的价值
虽然这个问题出现在Java 6并且Java 7中已经修复，但并不代表我们就不需要了解，况且Java 7的重新实现被喷的很厉害。

其实这个问题的价值，还是比较宝贵的，尤其是内容字符数组共享这个优化的实现。希望可以为大家以后的设计实现提供帮助和一些想法。

##受影响的方法
trim和subSequence都存在调用substring的操作。Java 6和Java 7 substring实现的更改也间接影响到了这些方法。

##参考资源
以下三篇文章写得都比较不错，但是都稍微有一些问题，我都已经标明出来，大家阅读时，需要注意。

  * [The substring() Method in JDK 6 and JDK 7](http://www.programcreek.com/2013/09/the-substring-method-in-jdk-6-and-jdk-7/) 本文中解决java6中问题提到的字符串拼接**不推荐**，具体原因可以参考[Java细节：字符串的拼接](http://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)
  * [How SubString method works in Java - Memory Leak Fixed in JDK 1.7](http://javarevisited.blogspot.com/2011/10/how-substring-in-java-works.html) 本文中提到的有一个概念错误，新的字符串不会阻止旧的字符串被回收，而是阻止旧字符串中的内容字符数组。阅读时需要注意。
  * [JDK-4513622 : (str) keeping a substring of a field prevents GC for object](http://bugs.java.com/view_bug.do?bug_id=4513622) 本文中提到的有一个测试，使用非new的形式有一点问题，其忽视了字符串常量池的存在，具体查看下面的注意。


##注意
上面的重现问题的代码中
```java
String getString() {
	//return this.largeString.substring(0,2);
   	return new String("ab"); 
}
```
这里最好不要写成下面这样，因为在JVM中存在字符串常量池，"ab"不会重新创建新字符串，所有的变量都会引用一个对象，而使用new String()则每次重新创建对象。
```java
String getString() {
   	return "ab"; 
}
```
关于字符串常量池，以后的文章会有介绍。

###吐血推荐
如果你对本文这样的内容感兴趣，可以阅读以下Joshua Bloch大神写得书，虽然有点贵，还是英文的。
[Java Puzzlers](http://www.amazon.cn/gp/product/032133678X/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=032133678X&linkCode=as2&tag=droidyue-23)









