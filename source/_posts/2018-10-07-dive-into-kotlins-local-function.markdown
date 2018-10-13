---
layout: post
title: "探究Kotlin的局部方法"
date: 2018-10-07 19:47
comments: true
categories: Kotlin
---
在Kotlin中，定义方法很有趣，不仅仅因为方法的关键字是fun(function前几个字符)，还是因为你会惊奇的发现，它允许我们在方法中定义方法。如下
```java
fun methodA() {
   fun methodB() {

   }
   methodB() //valid
}

//methodB() invalid
```
<!--more-->

其中

  * methodB定义在methodA的方法体中，即methodB被称为局部方法或局部函数
  * methodB只能在methodA中方法调用
  * methodB在methodA方法外调用，会引起编译错误

既然Kotlin支持了局部方法，相比它应该有什么特殊的用武之地呢

首先它的特点还是像它的名字一样，局部，这就意味着它有着无可比拟的更小范围的限定能力。保证了小范围的可用性，隔绝了潜在的不相关调用的可能。

作为编程中的金科玉律，方法越小越好，相比纵向冗长的代码片段，将其按照职责切分成功能单一的小的局部方法，最后组织起来调用，会让我们的代码显得更加的有条理和清晰。

作为一个程序员，好奇应该是他的特质之一，我们应该会想要研究一下，局部方法的实现原理是什么，至少我们在Java时代从来没有见过这种概念。

其实这件事仔细研究起来，还是有不少细节的。因为这其中局部方法可以捕获外部的变量也可以不捕获外部的变量。

下面就是捕获外部变量的一种情况
```
fun outMethodCapture(args: Array<String>) {
   fun checkArgs() {
       if (args.isEmpty()) {
           println("innerMethod check args")
           Throwable().printStackTrace()
       }
   }
   checkArgs()
}
```
这其中，局部方法checkArgs捕获了outMethodCapture的参数args。

所以，不捕获外部变量的情况也不难理解，如下,即checkArgs处理args都是通过参数传递的。
```
fun outMethodNonCapture(args: Array<String>) {
   fun checkArgs(args: Array<String>) {
       if (args.isEmpty()) {
           println("outMethodNonCapture check args")
           Throwable().printStackTrace()
       }
   }
   checkArgs(args)
}
```

首先我们分析一下捕获变量的局部方法的实现原理
```
public static final void outMethodCapture(@NotNull final String[] args) {
  Intrinsics.checkParameterIsNotNull(args, "args");
  <undefinedtype> checkArgs$ = new Function0() {
     // $FF: synthetic method
     // $FF: bridge method
     public Object invoke() {
        this.invoke();
        return Unit.INSTANCE;
     }

     public final void invoke() {
        Object[] var1 = (Object[])args;
        if(var1.length == 0) {
           String var2 = "innerMethod check args";
           System.out.println(var2);
           (new Throwable()).printStackTrace();
        }

     }
  };
  checkArgs$.invoke();
}
```
如上实现原理，就是局部方法实现其实就是实现了一个匿名内部类的实例，然后再次调用即可。
对于不捕获的局部方法要稍有不同，首先我们反编译得到对应的Java代码
```
public static final void outMethodNonCapture(@NotNull String[] args) {
  Intrinsics.checkParameterIsNotNull(args, "args");
  <undefinedtype> checkArgs$ = null.INSTANCE;
  checkArgs$.invoke(args);
}
```
我们得到的是一个不完整的代码，这时候需要我们前往项目工程，结合一些对应的class文件分析。首先我们找到类似这样的文件`MainKt$outMethodCapture$1.class` (其class文件按照”文件名$方法名$内部类序号”的规则)。

使用javap方法再次反编译分析该文件，注意对于$符号需要简单处理一下。
```
➜  KotlinInnerFunction javap -c "MainKt\$outMethodNonCapture\$1.class"
Compiled from "Main.kt"
final class MainKt$outMethodNonCapture$1 extends kotlin.jvm.internal.Lambda implements kotlin.jvm.functions.Function1<java.lang.String[], kotlin.Unit> {
  public static final MainKt$outMethodNonCapture$1 INSTANCE;

  public java.lang.Object invoke(java.lang.Object);
    Code:
       0: aload_0
       1: aload_1
       2: checkcast     #11                 // class "[Ljava/lang/String;"
       5: invokevirtual #14                 // Method invoke:([Ljava/lang/String;)V
       8: getstatic     #20                 // Field kotlin/Unit.INSTANCE:Lkotlin/Unit;
      11: areturn

  public final void invoke(java.lang.String[]);
    Code:
       0: aload_1
       1: ldc           #23                 // String args
       3: invokestatic  #29                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
       6: aload_1
       7: checkcast     #31                 // class "[Ljava/lang/Object;"
      10: astore_2
      11: aload_2
      12: arraylength
      13: ifne          20
      16: iconst_1
      17: goto          21
      20: iconst_0
      21: ifeq          44
      24: ldc           #33                 // String outMethodNonCapture check args
      26: astore_2
      27: getstatic     #39                 // Field java/lang/System.out:Ljava/io/PrintStream;
      30: aload_2
      31: invokevirtual #45                 // Method java/io/PrintStream.println:(Ljava/lang/Object;)V
      34: new           #47                 // class java/lang/Throwable
      37: dup
      38: invokespecial #51                 // Method java/lang/Throwable."<init>":()V
      41: invokevirtual #54                 // Method java/lang/Throwable.printStackTrace:()V
      44: return

  MainKt$outMethodNonCapture$1();
    Code:
       0: aload_0
       1: iconst_1
       2: invokespecial #61                 // Method kotlin/jvm/internal/Lambda."<init>":(I)V
       5: return

  static {};
    Code:
       0: new           #2                  // class MainKt$outMethodNonCapture$1
       3: dup
       4: invokespecial #80                 // Method "<init>":()V
       7: putstatic     #82                 // Field INSTANCE:LMainKt$outMethodNonCapture$1;
      10: return
}
```
上面的类其实比较简单，更重要的这是一个单例的实现。因为这样相比捕获的情况下，减少了匿名内部类的生成和实例的创建，理论上带来的代价也会更小。

考虑到上面的对比，如果在使用局部方法时，建议使用不捕获外部变量的方式会更加推荐。


### 使用注意
是的，使用局部方法有一个注意事项，也就是一种规则约定，那就是需要先定义才能使用，否则会报错，如下所示
```java
fun outMethodInvalidCase(args: Array<String>) {
   checkArgs()//invalid unresolved reference
   fun checkArgs() {
       if (args.isEmpty()) {
           println("innerMethod check args")
           Throwable().printStackTrace()
       }
   }
   checkArgs()//valid
}
``` 
但是呢，先定义局部方法，再使用还是有一些问题，这种问题主要表现在代码可读性上。

试想一下，如果你进入一个方法，看到的是一连串的局部方法，可能或多或少有点别扭。

但是试想一下，既然有这样的问题，为什么还要被设计成这个样子呢。首先，我们先看个小例子
```java
0fun outMethodInvalidCase(args: Array<String>) {
1   checkArgs(args)
2   var a = 0  //the reason why it's unresolved
3   fun checkArgs(args: Array<String>) {
4       if (args.isEmpty()) {
5           println("outMethodNonCapture check args")
6           Throwable().printStackTrace()
7           a.toString()
8       }
9   }
10}
```
因为局部方法可以capture局部变量，checkArgs捕获了局部变量a，当第一行代码checkArgs调用时，而checkArgs看似定义了，但是第二行却还没有执行到，导致了编译问题。

目前，capture变量和非capture的局部方法使用都是一致的，都需要先定义，再使用。

关于Kotlin中的局部方法，我们可以去尝试来达到限定范围，拆分方法的目的，在使用时，尽量选择非捕获的形式的局部方法。
