---
layout: post
title: "详解JVM如何处理异常"
date: 2018-10-21 20:14
comments: true
categories: 
---
无论你是使用何种编程语言，在日常的开发过程中，都会不可避免的要处理异常。今天本文将尝试讲解一些JVM如何处理异常问题，希望能够讲清楚这个内部的机制，如果对大家有所启发和帮助，则甚好。

## 当异常不仅仅是异常
我们在标题中提到了异常，然而这里指的异常并不是单纯的Exception，而是更为宽泛的Throwable。只是我们工作中习以为常的将它们（错误地）这样称谓。

关于Exception和Throwable的关系简单描述一下

  * Exception属于Throwable的子类，Throwable的另一个重要的子类是Error
  * throw可以抛出的都是Throwable和其子类，catch可捕获的也是Throwable和其子类。

<!--more-->
除此之外，但是Exception也有一些需要我们再次强调的

  * Exception分为两种类型，一种为Checked Exception，另一种为unchecked Exception
  * Checked Exception，比如最常见的IOException，这种异常需要调用处显式处理，要么使用try catch捕获，要么再次抛出去。
  * Unchecked Exception指的是所有继承自Error（包含自身）或者是RuntimeException（包含自身）的类。这些异常不强制在调用处进行处理。但是也可以try catch处理。

注：本文暂不做Checked Exception设计的好坏的分析。

## Exception Table 异常表
提到JVM处理异常的机制，就需要提及Exception Table，以下称为异常表。我们暂且不急于介绍异常表，先看一个简单的Java处理异常的小例子。
```java
public static void simpleTryCatch() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   }
}
```
上面的代码是一个很简单的例子，用来捕获处理一个潜在的空指针异常。

当然如果只是看简简单单的代码，我们很难看出什么高深之处，更没有了今天文章要谈论的内容。

所以这里我们需要借助一把神兵利器，它就是javap,一个用来拆解class文件的工具，和javac一样由JDK提供。

然后我们使用javap来分析这段代码（需要先使用javac编译）
```java
//javap -c Main
 public static void simpleTryCatch();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: goto          11
       6: astore_0
       7: aload_0
       8: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      11: return
    Exception table:
       from    to  target type
           0     3     6   Class java/lang/Exception
```
看到上面的代码，应该会有会心一笑，因为终于看到了Exception table，也就是我们要研究的异常表。

异常表中包含了一个或多个异常处理者(Exception Handler)的信息，这些信息包含如下

  * from 可能发生异常的起始点
  * to 可能发生异常的结束点
  * target 上述from和to之前发生异常后的异常处理者的位置
  * type 异常处理者处理的异常的类信息

## 那么异常表用在什么时候呢

答案是异常发生的时候，当一个异常发生时

1.JVM会在当前出现异常的方法中，查找异常表，是否有合适的处理者来处理

2.如果当前方法异常表不为空，并且异常符合处理者的from和to节点，并且type也匹配，则JVM调用位于target的调用者来处理。

3.如果上一条未找到合理的处理者，则继续查找异常表中的剩余条目

4.如果当前方法的异常表无法处理，则向上查找（弹栈处理）刚刚调用该方法的调用处，并重复上面的操作。

5.如果所有的栈帧被弹出，仍然没有处理，则抛给当前的Thread，Thread则会终止。

6.如果当前Thread为最后一个非守护线程，且未处理异常，则会导致JVM终止运行。

以上就是JVM处理异常的一些机制。

## try catch -finally
除了简单的try-catch外，我们还常常和finally做结合使用。比如这样的代码
```java
public static void simpleTryCatchFinally() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   } finally {
       System.out.println("Finally");
   }
}
```
同样我们使用javap分析一下代码

```java
public static void simpleTryCatchFinally();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
       6: ldc           #7                  // String Finally
       8: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: goto          41
      14: astore_0
      15: aload_0
      16: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      19: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      22: ldc           #7                  // String Finally
      24: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: goto          41
      30: astore_1
      31: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #7                  // String Finally
      36: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_1
      40: athrow
      41: return
    Exception table:
       from    to  target type
           0     3    14   Class java/lang/Exception
           0     3    30   any
          14    19    30   any
```
和之前有所不同，这次

  * 异常表中，有三条数据，而我们仅仅捕获了一个Exception
  * 异常表的后两个item的type为any

上面的三条异常表item的意思为

  * 如果0到3之间，发生了Exception类型的异常，调用14位置的异常处理者。
  * 如果0到3之间，无论发生什么异常，都调用30位置的处理者
  * 如果14到19之间（即catch部分），不论发生什么异常，都调用30位置的处理者。

再次分析上面的Java代码，finally里面的部分已经被提取到了try部分和catch部分。我们再次调一下代码来看一下

```java
public static void simpleTryCatchFinally();
    Code:
      //try 部分提取finally代码，如果没有异常发生，则执行输出finally操作，直至goto到41位置，执行返回操作。  

       0: invokestatic  #3                  // Method testNPE:()V
       3: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
       6: ldc           #7                  // String Finally
       8: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: goto          41

      //catch部分提取finally代码，如果没有异常发生，则执行输出finally操作，直至执行got到41位置，执行返回操作。
      14: astore_0
      15: aload_0
      16: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      19: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      22: ldc           #7                  // String Finally
      24: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: goto          41
      //finally部分的代码如果被调用，有可能是try部分，也有可能是catch部分发生异常。
      30: astore_1
      31: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #7                  // String Finally
      36: invokevirtual #8                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_1
      40: athrow     //如果异常没有被catch捕获，而是到了这里，执行完finally的语句后，仍然要把这个异常抛出去，传递给调用处。
      41: return
```

## Catch先后顺序的问题

我们在代码中的catch的顺序决定了异常处理者在异常表的位置，所以，越是具体的异常要先处理，否则就会出现下面的问题
```java
private static void misuseCatchException() {
   try {
       testNPE();
   } catch (Throwable t) {
       t.printStackTrace();
   } catch (Exception e) { //error occurs during compilings with tips Exception Java.lang.Exception has already benn caught.
       e.printStackTrace();
   }
}
```
这段代码会导致编译失败，因为先捕获Throwable后捕获Exception，会导致后面的catch永远无法被执行。

## Return 和finally的问题
这算是我们扩展的一个相对比较极端的问题，就是类似这样的代码，既有return，又有finally，那么finally导致会不会执行
```java
public static String tryCatchReturn() {
   try {
       testNPE();
       return  "OK";
   } catch (Exception e) {
       return "ERROR";
   } finally {
       System.out.println("tryCatchReturn");
   }
}
```
答案是finally会执行，那么还是使用上面的方法，我们来看一下为什么finally会执行。

```java
public static java.lang.String tryCatchReturn();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: ldc           #6                  // String OK
       5: astore_0
       6: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
       9: ldc           #8                  // String tryCatchReturn
      11: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      14: aload_0
      15: areturn       返回OK字符串，areturn意思为return a reference from a method
      16: astore_0
      17: ldc           #10                 // String ERROR
      19: astore_1
      20: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      23: ldc           #8                  // String tryCatchReturn
      25: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      28: aload_1
      29: areturn  //返回ERROR字符串
      30: astore_2
      31: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      34: ldc           #8                  // String tryCatchReturn
      36: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      39: aload_2
      40: athrow  如果catch有未处理的异常，抛出去。
```
行文仓促，加之本人水平有限，有错误的地方，请指出。

参考文章：

  * [http://blog.jamesdbloom.com/JVMInternals.html#exception_table](http://blog.jamesdbloom.com/JVMInternals.html#exception_table)
  * [https://blog.takipi.com/the-surprising-truth-of-java-exceptions-what-is-really-going-on-under-the-hood/](https://blog.takipi.com/the-surprising-truth-of-java-exceptions-what-is-really-going-on-under-the-hood/)
  * [https://en.wikipedia.org/wiki/Java_bytecode_instruction_listings](https://en.wikipedia.org/wiki/Java_bytecode_instruction_listings)
  * [https://dzone.com/articles/the-truth-of-java-exceptions-whats-really-going-on](https://dzone.com/articles/the-truth-of-java-exceptions-whats-really-going-on)
