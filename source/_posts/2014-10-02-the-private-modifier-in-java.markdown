---
layout: post
title: '细话Java："失效"的private修饰符'
date: 2014-10-02 17:24
comments: true
categories: Java 细说Java
---
在Java编程中，使用private关键字修饰了某个成员，只有这个成员所在的类和这个类的方法可以使用，其他的类都无法访问到这个private成员。 

上面描述了private修饰符的基本职能，今天来研究一下private功能失效的情况。
<!--more-->
##Java内部类
在Java中相信很多人都用过内部类，Java允许在一个类里面定义另一个类，类里面的类就是内部类，也叫做嵌套类。一个简单的内部类实现可以如下
```java
class OuterClass {
    class InnerClass{
    }
}
```
今天的问题和Java内部类相关，只涉及到部分和本文研究相关的内部类知识，具体关于Java内部类后续的文章会介绍。
##第一次失效?
一个我们在编程中经常用到的场景，就是在一个内部类里面访问外部类的private成员变量或者方法，这是可以的。如下面的代码实现。
```java
public class OuterClass {
	private String language = "en";
	private String region = "US";
	
	
	public class InnerClass {
		public void printOuterClassPrivateFields() {
			String fields = "language=" + language + ";region=" + region;
			System.out.println(fields);
		}
	}
	
	public static void main(String[] args) {
		OuterClass outer = new OuterClass();
		OuterClass.InnerClass inner = outer.new InnerClass();
		inner.printOuterClassPrivateFields();
	}
}
```
这是为什么呢，不是private修饰的成员只能被成员所述的类才能访问么？难道private真的失效了么？
###编译器在捣鬼？
我们使用javap命令查看一下生成的两个class文件

 OuterClass的反编译结果
```java
15:30 $ javap -c  OuterClass
Compiled from "OuterClass.java"
public class OuterClass extends java.lang.Object{
public OuterClass();
  Code:
   0:	aload_0
   1:	invokespecial	#11; //Method java/lang/Object."<init>":()V
   4:	aload_0
   5:	ldc	#13; //String en
   7:	putfield	#15; //Field language:Ljava/lang/String;
   10:	aload_0
   11:	ldc	#17; //String US
   13:	putfield	#19; //Field region:Ljava/lang/String;
   16:	return

public static void main(java.lang.String[]);
  Code:
   0:	new	#1; //class OuterClass
   3:	dup
   4:	invokespecial	#27; //Method "<init>":()V
   7:	astore_1
   8:	new	#28; //class OuterClass$InnerClass
   11:	dup
   12:	aload_1
   13:	dup
   14:	invokevirtual	#30; //Method java/lang/Object.getClass:()Ljava/lang/Class;
   17:	pop
   18:	invokespecial	#34; //Method OuterClass$InnerClass."<init>":(LOuterClass;)V
   21:	astore_2
   22:	aload_2
   23:	invokevirtual	#37; //Method OuterClass$InnerClass.printOuterClassPrivateFields:()V
   26:	return

static java.lang.String access$0(OuterClass);
  Code:
   0:	aload_0
   1:	getfield	#15; //Field language:Ljava/lang/String;
   4:	areturn

static java.lang.String access$1(OuterClass);
  Code:
   0:	aload_0
   1:	getfield	#19; //Field region:Ljava/lang/String;
   4:	areturn

}
```
咦？不对，在OuterClass中我们并没有定义这两个方法
```java
static java.lang.String access$0(OuterClass);
  Code:
   0:	aload_0
   1:	getfield	#15; //Field language:Ljava/lang/String;
   4:	areturn

static java.lang.String access$1(OuterClass);
  Code:
   0:	aload_0
   1:	getfield	#19; //Field region:Ljava/lang/String;
   4:	areturn

}
```
从给出来的注释来看，access$0返回outerClass的language属性；access$1返回outerClass的region属性。并且这两个方法都接受OuterClass的实例作为参数。这两个方法为什么生成呢，有什么作用呢？我们看一下内部类的反编译结果就知道了。

**OuterClass$InnerClass的反编译结果**
```java
15:37 $ javap -c OuterClass\$InnerClass
Compiled from "OuterClass.java"
public class OuterClass$InnerClass extends java.lang.Object{
final OuterClass this$0;

public OuterClass$InnerClass(OuterClass);
  Code:
   0:	aload_0
   1:	aload_1
   2:	putfield	#10; //Field this$0:LOuterClass;
   5:	aload_0
   6:	invokespecial	#12; //Method java/lang/Object."<init>":()V
   9:	return

public void printOuterClassPrivateFields();
  Code:
   0:	new	#20; //class java/lang/StringBuilder
   3:	dup
   4:	ldc	#22; //String language=
   6:	invokespecial	#24; //Method java/lang/StringBuilder."<init>":(Ljava/lang/String;)V
   9:	aload_0
   10:	getfield	#10; //Field this$0:LOuterClass;
   13:	invokestatic	#27; //Method OuterClass.access$0:(LOuterClass;)Ljava/lang/String;
   16:	invokevirtual	#33; //Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
   19:	ldc	#37; //String ;region=
   21:	invokevirtual	#33; //Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
   24:	aload_0
   25:	getfield	#10; //Field this$0:LOuterClass;
   28:	invokestatic	#39; //Method OuterClass.access$1:(LOuterClass;)Ljava/lang/String;
   31:	invokevirtual	#33; //Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
   34:	invokevirtual	#42; //Method java/lang/StringBuilder.toString:()Ljava/lang/String;
   37:	astore_1
   38:	getstatic	#46; //Field java/lang/System.out:Ljava/io/PrintStream;
   41:	aload_1
   42:	invokevirtual	#52; //Method java/io/PrintStream.println:(Ljava/lang/String;)V
   45:	return
}
```
下面代码调用access$0的代码,其目的是得到OuterClass的language 私有属性。
```java
13:	invokestatic	#27; //Method OuterClass.access$0:(LOuterClass;)Ljava/lang/String;
```
下面代码调用了access$1的代码，其目的是得到OutherClass的region 私有属性。
```java
28:	invokestatic	#39; //Method OuterClass.access$1:(LOuterClass;)Ljava/lang/String;
```

**注意：在内部类构造的时候，会将外部类的引用传递进来，并且作为内部类的一个属性，所以内部类会持有一个其外部类的引用。**  
this$0就是内部类持有的外部类引用，通过构造方法传递引用并赋值。
```java
final OuterClass this$0;

public OuterClass$InnerClass(OuterClass);
  Code:
   0:	aload_0
   1:	aload_1
   2:	putfield	#10; //Field this$0:LOuterClass;
   5:	aload_0
   6:	invokespecial	#12; //Method java/lang/Object."<init>":()V
   9:	return
```
###小结
这部分private看上去失效可，实际上并没有失效，因为当内部类调用外部类的私有属性时，其真正的执行是调用了编译器生成的属性的静态方法（即acess$0,access$1等）来获取这些属性值。这一切都是编译器的特殊处理。

##这次也失效？
如果说上面的写法很常用，那么这样的写法是不是很少接触，但是却可以运行。
```java
public class AnotherOuterClass {
	public static void main(String[] args) {
		InnerClass inner = new AnotherOuterClass().new InnerClass();
		System.out.println("InnerClass Filed = " + inner.x);
	}

	class InnerClass {
		private int x = 10;
	}

}
```
和上面一样，使用javap反编译看一下。不过这次我们先看一下InnerClass的结果
```java
16:03 $ javap -c AnotherOuterClass\$InnerClass
Compiled from "AnotherOuterClass.java"
class AnotherOuterClass$InnerClass extends java.lang.Object{
final AnotherOuterClass this$0;

AnotherOuterClass$InnerClass(AnotherOuterClass);
  Code:
   0:	aload_0
   1:	aload_1
   2:	putfield	#12; //Field this$0:LAnotherOuterClass;
   5:	aload_0
   6:	invokespecial	#14; //Method java/lang/Object."<init>":()V
   9:	aload_0
   10:	bipush	10
   12:	putfield	#17; //Field x:I
   15:	return

static int access$0(AnotherOuterClass$InnerClass);
  Code:
   0:	aload_0
   1:	getfield	#17; //Field x:I
   4:	ireturn

}
```
又出现了，编译器又自动生成了一个获取私有属性的后门方法access$0一次来获取x的值。

AnotherOuterClass.class的反编译结果
```java
16:08 $ javap -c AnotherOuterClass
Compiled from "AnotherOuterClass.java"
public class AnotherOuterClass extends java.lang.Object{
public AnotherOuterClass();
  Code:
   0:	aload_0
   1:	invokespecial	#8; //Method java/lang/Object."<init>":()V
   4:	return

public static void main(java.lang.String[]);
  Code:
   0:	new	#16; //class AnotherOuterClass$InnerClass
   3:	dup
   4:	new	#1; //class AnotherOuterClass
   7:	dup
   8:	invokespecial	#18; //Method "<init>":()V
   11:	dup
   12:	invokevirtual	#19; //Method java/lang/Object.getClass:()Ljava/lang/Class;
   15:	pop
   16:	invokespecial	#23; //Method AnotherOuterClass$InnerClass."<init>":(LAnotherOuterClass;)V
   19:	astore_1
   20:	getstatic	#26; //Field java/lang/System.out:Ljava/io/PrintStream;
   23:	new	#32; //class java/lang/StringBuilder
   26:	dup
   27:	ldc	#34; //String InnerClass Filed =
   29:	invokespecial	#36; //Method java/lang/StringBuilder."<init>":(Ljava/lang/String;)V
   32:	aload_1
   33:	invokestatic	#39; //Method AnotherOuterClass$InnerClass.access$0:(LAnotherOuterClass$InnerClass;)I
   36:	invokevirtual	#43; //Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
   39:	invokevirtual	#47; //Method java/lang/StringBuilder.toString:()Ljava/lang/String;
   42:	invokevirtual	#51; //Method java/io/PrintStream.println:(Ljava/lang/String;)V
   45:	return

}
```
其中这句调用就是外部类通过内部类的实例获取私有属性x的操作
```java
33:	invokestatic	#39; //Method AnotherOuterClass$InnerClass.access$0:(LAnotherOuterClass$InnerClass;)I
```
###再来个总结
其中[java官方文档](http://docs.oracle.com/javase/specs/jls/se7/html/jls-6.html#jls-6.6.1) 有这样一句话
>if the member or constructor is declared private, then access is permitted if and only if it occurs within the body of the top level class (§7.6) that encloses the declaration of the member or constructor.

意思是 如果（内部类的）成员和构造方法设定成了私有修饰符，当且仅当其外部类访问时是允许的。


##如何让内部类私有成员不被外部访问
相信看完上面两部分，你会觉得，内部类的私有成员想不被外部类访问都很困难吧，谁让编译器“爱管闲事”呢，其实也是可以做到的。那就是使用匿名内部类。

由于mRunnable对象的类型为Runnable，而不是匿名内部类的类型（我们无法正常拿到），而Runanble中没有x这个属性，所以mRunnable.x是不被允许的。
```java

public class PrivateToOuter {
	Runnable mRunnable = new Runnable(){
		private int x=10;
		@Override
		public void run() {
			System.out.println(x);
		}
	};

	public static void main(String[] args){
		PrivateToOuter p = new PrivateToOuter();
		//System.out.println("anonymous class private filed= "+ p.mRunnable.x); //not allowed
		p.mRunnable.run(); // allowed
	}
}
```


##最后总结
  * 在本文中，private表面上看上去失效了，但实际上是没有的，而是在调用时通过间接的方法来获取私有的属性。
  * Java的内部类构造时持有对外部类的应用，C++不会，这一点和C++不一样。

###深入Java细节的书籍
  * <a href="http://www.amazon.cn/gp/product/B0011F7WU4/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F7WU4&linkCode=as2&tag=droidyue-23">Java编程思想</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011F7WU4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B001PTGR52/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001PTGR52&linkCode=as2&tag=droidyue-23">Sun 公司核心技术丛书:Effective Java中文版</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B001PTGR52" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00D2ID4PK/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D2ID4PK&linkCode=as2&tag=droidyue-23">深入理解Java虚拟机:JVM高级特性与最佳实践</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00D2ID4PK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
