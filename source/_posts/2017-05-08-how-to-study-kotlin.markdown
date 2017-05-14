---
layout: post
title: "研究学习Kotlin的一些方法"
date: 2017-05-08 22:05
comments: true
categories: Java Kotlin Android
---

Kotlin是一门让人感到很舒服的语言，相比Java来说，它更加简洁，省去了琐琐碎碎的语法工作，同时了提供了类似Lambda,String template,Null Safe Operator等特性。让开发者用起来得心应手。
<!--more-->

普通的Java/Android程序员通常只需要很短的时间就能快速使用Kotlin。综合Kotlin的诸多优点，加上Flipboard美国团队自2015年已引入Kotlin，Flipboard中国团队也已经开始采用Kotlin来作为Android主要开发语言。

虽然Kotlin使用简单快捷，然而由于自己的深入研究的习惯导致每接触到Kotlin的新功能，就马不停蹄的研究它的本质，这里总结一下关于如何研究Kotlin的一些方法来快速研究掌握Kotlin。

## 到底研究什么
比如Kotlin中提供了一种类型叫做Object，使用它我们可以快速实现单例模式的应用。代码特别的简单
```java
object AppSettings {

}
```
那么问题来了，kotlin这个object类型的类是如何实现的呢，Null安全操作符的实现原理，Lambda表达式是基于内部类还是真正的Lambda，这些问题就是我们要研究的对象。

## 怎么研究
  * Kotlin和Java都是运行在JVM上，但是实际上JVM并不认识Java和Kotlin，因为它只和bytecode（即class文件）打交道。
  * 因而通过研究bytecode，我们是可以了解Kotlin的一些深入原理的
  * 由于同一份bytecode反编译成java和kotlin文件是等价的，所以将kotlin编译后的class文件反编译成Java，也是具有参考和研究价值的。

## 实践方法有哪些
  * 利用Kotlin插件  
  * 利用kotlinc,javap等工具

## 一些实践
### Null Safe Operator实现原理
在Java中，我们经常会遇到空指针的问题，Kotlin特意增加了一个空指针安全操作符?。使用起来如下
```java
fun testNullSafeOperator(string: String?) {
    System.out.println(string?.toCharArray()?.getOrNull(10)?.hashCode())
}
```
当我们进行这样的调用时
```java
testNullSafeOperator(null)
testNullSafeOperator("12345678901")
testNullSafeOperator("123")
```
得到的输出结果为
```
null
49
null
```
从结果可见，并没有像Java那样抛出NullPointerException，而是遇到空指针则不继续执行了。

那么Kotlin的这个空指针安全操作符是如何工作的呢，我们可以借助IntelliJ IDE的Kotlin插件来辅助我们研究，步骤如下

1.使用IntelliJ IDE打开一个待研究的Kotlin文件(需确保Kotlin插件已安装)

2.按照下图依次点击至Show Kotlin Bytecode
![Show kotlin bytecode](http://7jpolu.com1.z0.glb.clouddn.com/show_kotlin_bytecode.png)

3.上面的步骤操作后，会得到这样的bytecode
```java
// access flags 0x19
  public final static testNullSafeOperator(Ljava/lang/String;)V
    @Lorg/jetbrains/annotations/Nullable;() // invisible, parameter 0
   L0
    LINENUMBER 11 L0
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    ALOAD 0
    DUP
    IFNULL L1   //对string字符串判空
    INVOKESTATIC kotlin/text/StringsKt.toCharArray (Ljava/lang/String;)[C
    DUP
    IFNULL L1  //对CharArray判空
    BIPUSH 10
    INVOKESTATIC kotlin/collections/ArraysKt.getOrNull ([CI)Ljava/lang/Character;
    DUP
    IFNULL L1  //对Char判空
    INVOKEVIRTUAL java/lang/Object.hashCode ()I
    INVOKESTATIC java/lang/Integer.valueOf (I)Ljava/lang/Integer;
    GOTO L2
   L1
    POP
    ACONST_NULL
   L2
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/Object;)V
   L3
    LINENUMBER 12 L3
    RETURN
   L4
    LOCALVARIABLE string Ljava/lang/String; L0 L4 0
    MAXSTACK = 3
    MAXLOCALS = 1
}
```
由字节码分析可见，其实所谓的**空指针安全操作符其实内部就是以此判空来确保不出现空指针**，如果字节码不好理解，那我们使用上面的Decompile功能，将bytecode转成Java，如图操作
![kotlin bytecode decompile](http://7jpolu.com1.z0.glb.clouddn.com/kotlin_plugin_decompile.png)

反编译后得到的Java代码为
```java
public static final void testNullSafeOperator(@Nullable String string) {
      PrintStream var10000;
      Integer var5;
      label18: {
         var10000 = System.out;
         if(string != null) {
            PrintStream var2 = var10000;
            if(string == null) {
               throw new TypeCastException("null cannot be cast to non-null type java.lang.String");
            }

            char[] var4 = ((String)string).toCharArray();
            Intrinsics.checkExpressionValueIsNotNull(var4, "(this as java.lang.String).toCharArray()");
            char[] var3 = var4;
            var10000 = var2;
            if(var3 != null) {
               Character var10001 = ArraysKt.getOrNull(var3, 10);
               if(var10001 != null) {
                  var5 = Integer.valueOf(var10001.hashCode());
                  break label18;
               }
            }
         }

         var5 = null;
      }

      var10000.println(var5);
   }
```
这样读起来是不是更加容易理解呢。

### Object类型研究
这里我们回到Object类型，还是再举个例子看看如何使用
```java
//这是定义
object AppSettings {
    fun updateConfig() {
        //do some updating work
    }
}
```
关于应用也很简单
```java
//在Kotlin文件中调用
AppSettings.updateConfig()

//在Java文件中调用
AppSettings.INSTANCE.updateConfig();
```

我们先看一下AppSettings的字节码文件
```java
// ================AppSettings.class =================
// class version 50.0 (50)
// access flags 0x31
public final class AppSettings {
  // access flags 0x11
  public final updateConfig()V
   L0
    LINENUMBER 7 L0
    RETURN
   L1
    LOCALVARIABLE this LAppSettings; L0 L1 0
    MAXSTACK = 0
    MAXLOCALS = 1

  // access flags 0x2
  private <init>()V
   L0
    LINENUMBER 4 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    ALOAD 0
    CHECKCAST AppSettings
    PUTSTATIC AppSettings.INSTANCE : LAppSettings;
    RETURN
   L1
    LOCALVARIABLE this LAppSettings; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x19
  public final static LAppSettings; INSTANCE

  // access flags 0x8
  static <clinit>()V
   L0
    LINENUMBER 4 L0
    //静态代码块中实例化，即类加载时便开始实例化
    NEW AppSettings
    INVOKESPECIAL AppSettings.<init> ()V
    RETURN
    MAXSTACK = 1
    MAXLOCALS = 0

  @Lkotlin/Metadata;(mv={1, 1, 5}, bv={1, 0, 1}, k=1, d1={"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\u0008\u0002\n\u0002\u0010\u0002\n\u0000\u0008\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\u0008\u0002\u00a2\u0006\u0002\u0010\u0002J\u0006\u0010\u0003\u001a\u00020\u0004\u00a8\u0006\u0005"}, d2={"LAppSettings;", "", "()V", "updateConfig", "", "production sources for module KotlinObject"})
  // compiled from: AppSettings.kt
}
```
由此可见，Kotlin的object也就是Java的单例模式的实现，在静态代码块初始化实例。如果字节码没有看懂的话，可以尝试反编译成Java代码来详细研究。

### Lambda表达式研究
除此之外，Kotlin也是支持了Lambda表达式的。由于并非所有的JVM版本都支持invokedynamic（Lambda表达式依赖的字节码指令），比如Java 6的JVM，这其中就包含了许多安卓设备。所以我们怀疑Kotlin可能是像Scala那样将lambda表达式转换成了匿名内部类。

一个简单的Lambda表达式例子
```java
class Test {
    fun testObservable() {
        val observable = Observable()
        observable.addObserver { o, arg ->
            System.out.println("$o $arg")
        }
    }
}
```
我们使用插件同样查看bytecode
```java
// ================Test.class =================
// class version 50.0 (50)
// access flags 0x31
public final class Test {


  // access flags 0x11
  public final testObservable()V
   L0
    LINENUMBER 8 L0
    NEW java/util/Observable
    DUP
    INVOKESPECIAL java/util/Observable.<init> ()V
    ASTORE 1
   L1
    LINENUMBER 9 L1
    ALOAD 1
    GETSTATIC Test$testObservable$1.INSTANCE : LTest$testObservable$1;  //这里就是使用了匿名内部类(常常包含$字符)
    CHECKCAST java/util/Observer
    INVOKEVIRTUAL java/util/Observable.addObserver (Ljava/util/Observer;)V
   L2
    LINENUMBER 12 L2
    RETURN
   L3
    LOCALVARIABLE observable Ljava/util/Observable; L1 L3 1
    LOCALVARIABLE this LTest; L0 L3 0
    MAXSTACK = 2
    MAXLOCALS = 2

  // access flags 0x1
  public <init>()V
   L0
    LINENUMBER 6 L0
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
   L1
    LOCALVARIABLE this LTest; L0 L1 0
    MAXSTACK = 1
    MAXLOCALS = 1

  @Lkotlin/Metadata;(mv={1, 1, 5}, bv={1, 0, 1}, k=1, d1={"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\u0008\u0002\n\u0002\u0010\u0002\n\u0000\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0006\u0010\u0003\u001a\u00020\u0004\u00a8\u0006\u0005"}, d2={"LTest;", "", "()V", "testObservable", "", "production sources for module KotlinObject"})
  // access flags 0x18
  final static INNERCLASS Test$testObservable$1 null null
  // compiled from: Space.kt
}


// ================Test$testObservable$1.class =================
// class version 50.0 (50)
// access flags 0x30
//生成的匿名内部类，规则为  当前的类名$当前的方法名$匿名内部类序号
final class Test$testObservable$1 implements java/util/Observer  {


  // access flags 0x11
  public final update(Ljava/util/Observable;Ljava/lang/Object;)V
   L0
    LINENUMBER 10 L0
    GETSTATIC java/lang/System.out : Ljava/io/PrintStream;
    NEW java/lang/StringBuilder
    DUP
    INVOKESPECIAL java/lang/StringBuilder.<init> ()V
    ALOAD 1
    INVOKEVIRTUAL java/lang/StringBuilder.append (Ljava/lang/Object;)Ljava/lang/StringBuilder;
    LDC " "
    INVOKEVIRTUAL java/lang/StringBuilder.append (Ljava/lang/String;)Ljava/lang/StringBuilder;
    ALOAD 2
    INVOKEVIRTUAL java/lang/StringBuilder.append (Ljava/lang/Object;)Ljava/lang/StringBuilder;
    INVOKEVIRTUAL java/lang/StringBuilder.toString ()Ljava/lang/String;
    INVOKEVIRTUAL java/io/PrintStream.println (Ljava/lang/String;)V
   L1
    LINENUMBER 11 L1
    RETURN
   L2
    LOCALVARIABLE this LTest$testObservable$1; L0 L2 0
    LOCALVARIABLE o Ljava/util/Observable; L0 L2 1
    LOCALVARIABLE arg Ljava/lang/Object; L0 L2 2
    MAXSTACK = 3
    MAXLOCALS = 3

  // access flags 0x0
  <init>()V
    ALOAD 0
    INVOKESPECIAL java/lang/Object.<init> ()V
    RETURN
    MAXSTACK = 1
    MAXLOCALS = 1

  // access flags 0x19
  public final static LTest$testObservable$1; INSTANCE

  // access flags 0x8
  static <clinit>()V
    NEW Test$testObservable$1
    DUP
    INVOKESPECIAL Test$testObservable$1.<init> ()V
    PUTSTATIC Test$testObservable$1.INSTANCE : LTest$testObservable$1;
    RETURN
    MAXSTACK = 2
    MAXLOCALS = 0

  @Lkotlin/Metadata;(mv={1, 1, 5}, bv={1, 0, 1}, k=3, d1={"\u0000\u0016\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0008\u0002\n\u0002\u0010\u0000\n\u0000\u0010\u0000\u001a\u00020\u00012\u000e\u0010\u0002\u001a\n \u0004*\u0004\u0018\u00010\u00030\u00032\u000e\u0010\u0005\u001a\n \u0004*\u0004\u0018\u00010\u00060\u0006H\n\u00a2\u0006\u0002\u0008\u0007"}, d2={"<anonymous>", "", "o", "Ljava/util/Observable;", "kotlin.jvm.PlatformType", "arg", "", "update"})
  OUTERCLASS Test testObservable ()V
  // access flags 0x18
  final static INNERCLASS Test$testObservable$1 null null
  // compiled from: Space.kt
}
```
分析字节码可以看到有两个class文件，因此可以推断出Kotlin的Lambda表达式目前是一种基于内部类的语法糖实现。

除此之外，我们还可以使用kotlinc(Kotlin编译器来验证)
```java
kotlinc Test.kt
```
执行完成后，查看生成的class文件
```java
ls | grep ^Test
Test$testObservable$1.class
Test.class
Test.kt
```
当然，我们还可以使用javap同样实现查看bytecode的功能，即`javap -c className`，具体操作可以参考这篇文章[Java细节：字符串的拼接
](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2014%2F08%2F30%2Fjava-details-string-concatenation%2F)


关于Lambda的具体研究，请参考这篇文章[深入探索Java 8 Lambda表达式
](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F11%2F28%2Farticle-java-8-lambdas-a-peek-under-the-hood%2F)


除此之外，我们还可以利用上面的方法研究如下Kotlin的特性

  * lazy初始化
  * when表达式
  * 方法引用
	

关于Kotlin的研究方法目前就是这些，Kotlin很简单，但也要知其所以然，方能游刃有余编码。希望大家可以尝试Kotlin，并玩的开心。


















