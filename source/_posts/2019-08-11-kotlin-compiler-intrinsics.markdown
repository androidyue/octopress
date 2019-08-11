---
layout: post
title: "Kotlin编译与Intrinsics检查"
date: 2019-08-11 20:31
comments: true
categories: Kotlin Kotlinc Intrinsics 
---
在很早的时候，小黑屋就介绍过如何研究Kotlin，其中涉及到了查看字节码和反编译成Java代码的方式，相信很多人研究过的人，都会或多或少遇到过`Intrinsics.checkParameterIsNotNull`这样或者类似的代码。

<!--more-->

首先，我们先看一下这段简单的方法
```kotlin
fun dumpStringMessage(message: String) {
    println("dumpStringMessage=$message")
}
```
按照我们之前的方法，反编译成Java代码就是这样的
```java
public static final void dumpStringMessage(@NotNull String message) {
      Intrinsics.checkParameterIsNotNull(message, "message");
      String var1 = "dumpStringMessage=" + message;
      boolean var2 = false;
      System.out.println(var1);
}
```
反编译后，我们可以看到代码中有这样的一行代码`Intrinsics.checkParameterIsNotNull(message, "message");`

## Intrinsics 是什么

  * Intrinsics是Kotlin内部的一个类
  * 包含了检查参数是否为null的`checkParameterIsNotNull`
  * 包含了表达式结果是否为null的`checkExpressionValueIsNotNull`
  * 包含了检测lateinit是否初始化的`throwUninitializedPropertyAccessException`
  * 包含了开发者强制非空!!出现空指针时抛出`throwNpe`的方法
  * 判断对象相等的方法`areEqual`
  * 其他的一些处理数据异常的方法和辅助方法

所以上面代码中的`Intrinsics.checkParameterIsNotNull(message, "message");`是为了检测参数message是否为null进行的判断。

## 为什么会有Intrinsics等判断代码呢

不是说 Kotlin 是空指针安全，有可空(Any?)和不可空(Any)的类型么，我上面的代码声明的是`message: String`又不是`message: String?`,为什么还要多此一举呢？

是的，你的这句话基本上没有毛病，但是有一个前提，那就是空指针和两种类型的特性，目前只在纯kotlin中生效，一旦涉及到和Java交互时，就不灵了。

比如我们在Java代码中这样调用，不会产生任何编译的问题。
```java
public class JavaTest {
    public void test() {
        StringExtKt.dumpStringMessage(null);
    }
}
```
但是当我们运行时，就会报出这样的错误
```bash
Exception in thread "main" java.lang.IllegalArgumentException: Parameter specified as non-null is null: method StringExtKt.dumpStringMessage, parameter message
  at StringExtKt.dumpStringMessage(StringExt.kt)
  at JavaTest.test(JavaTest.java:5)
  at MainKt.main(Main.kt:3)
  at MainKt.main(Main.kt)

Process finished with exit code 1
```

所以考虑到方法被Java调用的情况，Kotlin会默认的增加`checkParameterIsNotNull`校验。

## Intrinsics.checkParameterIsNotNull 一直都有么？
不过好在Kotlin编译器还是足够聪明的，对于不能被Java直接调用的方法，就不会增加相关处理。

比如标记为private的方法，通常情况下，不会被java调用。
```kotlin
private fun innerDumpStringMessage(message: String) {
    println("innerDumpStringMessage=$message")
}
```
反编译成的如下代码，就没有`Intrinsics.checkParameterIsNotNull`
```java
private static final void innerDumpStringMessage(String message) {
      String var1 = "innerDumpStringMessage=" + message;
      boolean var2 = false;
      System.out.println(var1);
   }
```


## Intrinsics.checkParameterIsNotNull 的好处
### 定位排查问题快捷
上面代码的好处之一就是对于代码混淆之后，可以相对更加方便的定位问题。

比如这段代码，经过混淆之后，运行
```java
public class JavaMethod {
    public void callKotlin() {
        KotlinCodeKt.dumpMessage(null);
    }
}
```

得到如下的崩溃日志
```java
 E AndroidRuntime: java.lang.RuntimeException: Unable to start activity ComponentInfo{com.droidyue.intrinsicsmattersandroidsample/com.droidyue.intrinsicsmattersandroidsample.MainActivity}: java.lang.IllegalArgumentException: Parameter specified as non-null is null: method a.a.a.a.a, parameter message
 E AndroidRuntime: 	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2927)
 E AndroidRuntime: 	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2988)
 E AndroidRuntime: 	at android.app.ActivityThread.-wrap14(ActivityThread.java)
 E AndroidRuntime: 	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1631)
 E AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:102)
 E AndroidRuntime: 	at android.os.Looper.loop(Looper.java:154)
 E AndroidRuntime: 	at android.app.ActivityThread.main(ActivityThread.java:6682)
 E AndroidRuntime: 	at java.lang.reflect.Method.invoke(Native Method)
 E AndroidRuntime: 	at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1520)
 E AndroidRuntime: 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1410)
 E AndroidRuntime: Caused by: java.lang.IllegalArgumentException: Parameter specified as non-null is null: method a.a.a.a.a, parameter message
 E AndroidRuntime: 	at com.droidyue.intrinsicsmattersandroidsample.b.a(Unknown Source)
 E AndroidRuntime: 	at com.droidyue.intrinsicsmattersandroidsample.a.a(Unknown Source)
 E AndroidRuntime: 	at com.droidyue.intrinsicsmattersandroidsample.MainActivity.onCreate(Unknown Source)
 E AndroidRuntime: 	at android.app.Activity.performCreate(Activity.java:6942)
 E AndroidRuntime: 	at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1126)
 E AndroidRuntime: 	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2880)
 E AndroidRuntime: 	... 9 more
```
这里我们可以清晰的看到出问题的参数名称，定位出问题的位置。


## 其他好处
  * 对于先决条件（参数和状态）提前判断可以避免很多不必要的资源消耗。
  * 避免不必要的状态产生

## Intrinsics的问题
刚才我们提到了Intrinsics可以辅助混淆情况下定位排查问题，但是同时也带来了一个问题，那就是


  * 为混淆之后逆向工程提供了更多的帮助。

除此之外，还有人担心Intrinsics是不是存在这样的问题

  * Intrinsics调用和返回带来进栈出栈操作，而Intrinsics为java实现，无法在编译时inline，会不会有性能问题


对于性能的担忧可以说是有些过于杞人忧天了，不过还在好在Kotlin提供了方法来消除这种不必要的过虑。当然也能解决逆向混淆的问题。

## 编译时去除Intrinsics检查
```java
-Xno-param-assertions      Don't generate not-null assertions on parameters of methods accessible from Java
-Xno-receiver-assertions   Don't generate not-null assertion for extension receiver arguments of platform types
```
具体的实施方法，可以参考另一篇文章[为 Kotlin 项目设置编译选项](https://droidyue.com/blog/2019/07/21/configure-kotlin-compiler-options/)

## 其他Intrinsics出现的场景
### checkExpressionValueIsNotNull

当Kotlin 调用 Java 获取表达式结果后需要进行操作时，会增加`Intrinsics.checkExpressionValueIsNotNull`校验

```kotlin
//Intrinsics.checkExpressionValueIsNotNull(var10000, "JavaUtil.getBook()");
fun test1() {
    val book: Book = JavaUtil.getBook()
    book.name
}
```

### Intrinsics.throwNpe
当使用`!!`非空断言时，会有校验非空断言结果的检查，如果有问题，则抛出NPE.
```kotlin
/**
 * if (message == null) {
       Intrinsics.throwNpe();
   }
 */
fun test2(message: String?) {
   message!!.toInt()
}
```

### throwUninitializedPropertyAccessException
当尝试访问一个lateinit的属性时，会增加是否初始化的判断，如果有问题，会抛出异常。
```kotlin
class Movie {
    lateinit var name: String
    //Intrinsics.throwUninitializedPropertyAccessException("name");
    fun dump() {
        println(name)
    }
}
```

以上就是关于Kotlin编译与 Intrinsics 检查的内容。Enjoy.

## 相关文章推荐阅读
  * [为 Kotlin 项目设置编译选项](https://droidyue.com/blog/2019/07/21/configure-kotlin-compiler-options/)
  * [一个查找字节码更好研究Kotlin的脚本](https://droidyue.com/blog/2019/07/14/search-bytecode-script-to-study-kotlin-better/)
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [其他Kotlin优质文章](https://droidyue.com/blog/categories/kotlin/)
