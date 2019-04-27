---
layout: post
title: "Kotlin 中的 Lambda 与 inline"
date: 2019-04-27 19:26
comments: true
categories: Kotlin Lambda inline noinline crossinline
---


在Kotlin中，有很多很酷很实用的特性，比如Lambda和高阶函数，利用这些特性，我们可以更加快速的实现开发，提升效率。

比如我们实现一个捕获Throwable，安全执行部分代码的高阶函数

```java
fun safeRun(runnable: () -> Unit) {
    try {
        runnable()
    } catch (t: Throwable) {
        t.printStackTrace()
    }
}

fun testNormalSafeRun() {
    safeRun {
        System.out.println("testNormalSafeRun")
    }
}
```

<!--more-->
由于Kotlin默认是面向JDK 6，而Java 8 才引入Lambda表达式支持，Kotlin实际上是将Lambda翻译成了匿名内部类的实现形式。所以当我们反编译上面的代码，得到的如下的代码

Lambda被翻译成的class文件
```java
static final class InlineSampleKt.testNormalSafeRun.1
extends Lambda
implements Function0<Unit> {
    public static final InlineSampleKt.testNormalSafeRun.1 INSTANCE = new /* invalid duplicate definition of identical inner class */;

    public final void invoke() {
        System.out.println("testNormalSafeRun");
    }

    InlineSampleKt.testNormalSafeRun.1() {
    }
}
```
Lambda表达式被调用处的代码
```java
public final class InlineSampleKt {
    public static final void safeRun(@NotNull Function0<Unit> runnable) {
        Intrinsics.checkParameterIsNotNull(runnable, (String)"runnable");
        try {
            runnable.invoke();
        }
        catch (Throwable t) {
            t.printStackTrace();
        }
    }

    public static final void testNormalSafeRun() {
        InlineSampleKt.safeRun(testNormalSafeRun.1.INSTANCE);
    }
}
```
上面的 Lambda 表达式 比较简单，那是因为

  * Lambda 表达式仅仅使用了一次
  * Lambda 表达式未捕获外部的变量

为了更深入的研究，我们尝试一下更加复杂的情况

  * Lambda 表达式会多次调用
  * Lambda 表达式捕获外部的变量

这里我们使用下面的代码，实现一个多次调用捕获外部变量的 Lambda 表达式的调用。
```java
fun toManyLambdaCalls() {
    for (i in 0..100) {
        safeRun {
            System.out.println("toManyLambdaCalls currentCount=$i")
        }
    }
}
```
上面的Lambda 表达式 捕获了外部的变量`i`，同时执行了很多次。

我们反编译上述的代码，得到的类似的Java实现代码如下
```java
public static final void toManyLambdaCalls() {
        int n = 0;
        int n2 = 100;
        while (n <= n2) {
            void i;
            InlineSampleKt.safeRun((Function0<Unit>)((Function0)new Function0<Unit>((int)i){
                final /* synthetic */ int $i;

                public final void invoke() {
                    System.out.println("toManyLambdaCalls currentCount=" + this.$i);
                }
                {
                    this.$i = n;
                    super(0);
                }
            }));
            ++i;
        }
    }
```

在上面的代码中

  * Lambda 表达式 翻译成的Function0 的实例被创建了近101多次，生成101个Fuction0 实例
  * 由于Lambda 表达式捕获了外部的变量，生成的Fuction0类 接受变量作为参数

上述代码存在的性能问题

  * Function0 实例创建过多，而这些实例大多数会很快被回收，造成短时间内GC压力增大
  * 次数过多的方法调用(Function0构造方法和invoke方法)，造成一定的耗时

显然，这种实现，我们不能接受的。

## inline
好在Kotlin提供了，处理上面问题的方法，这就是所谓的inline 关键字。如下，

  * 我们使用inline修饰`safeRunInlined`方法
  * `testInlinedSafeRun` 中调用 `safeRunInlined` 方法

```java
inline fun safeRunInlined(runnable: () -> Unit) {
    try {
        runnable()
    } catch (t: Throwable) {
        t.printStackTrace()
    }
}


fun testInlinedSafeRun() {
    safeRunInlined {
        System.out.println("testInlinedSafeRun")
    }
}
```
再次我们反编译上面的Kotlin代码，得到对应的Java 代码。

```java
public static final void safeRunInlined(@NotNull Function0 runnable) {
      int $i$f$safeRunInlined = 0;
      Intrinsics.checkParameterIsNotNull(runnable, "runnable");

      try {
         runnable.invoke();
      } catch (Throwable var3) {
         var3.printStackTrace();
      }

   }

   public static final void testInlinedSafeRun() {
      boolean var0 = false;

      try {
         int var1 = false;
         System.out.println("testInlinedSafeRun");
      } catch (Throwable var2) {
         var2.printStackTrace();
      }

   }
```
我们分析上述代码发现，testInlinedSafeRun 的方法体包含了

  * safeRunInlined 的方法体
  * Lambda 表达式的内容

是的，inline 的作用就是把上面两项的内容，提取到调用处 testInlinedSafeRun 中。通过这种形式，避免了最一开始的类实例生成的问题了。


### When Lambada meets return
自从了解了 Lambda 可以被inline后，我们貌似可以自由自在地使用它。然而事实或许不是这样，比如我们看一下这段代码。

```java
inline fun higherOrderFunctionFirst(runnable: () -> Unit) {
    System.out.println("higherOrderFunction.before")
    runnable()
    System.out.println("higherOrderFunction.after")
}



fun testLambdaReturn() {
    higherOrderFunctionFirst {
        System.out.println("testLambdaReturn")
        return
    }

}
```
上面的代码我们执行预期的输出应该是这样
```java
higherOrderFunction.before
testLambdaReturn
higherOrderFunction.after
```
然后实际的执行结果却有点事与愿违
```java
higherOrderFunction.before
testLambdaReturn
```

原因还是发生了inline，higherOrderFunctionFirst的执行因为`runnable`中的return，造成了该方法的返回。

解决方法也比较简单，就是不直接使用return，而是使用指定label的return方式
```java
fun testLambdaReturn() {
    higherOrderFunctionFirst {
        System.out.println("testLambdaReturn")
        return@higherOrderFunctionFirst //valid
    }

}
```
解决了上面的问题，我们还需要带出一个技术概念，就是控制流。

## control flow 控制流

维基百科中的英文定义
> In computer science, control flow (or flow of control) is the order in which individual statements, instructions or function calls of an imperative program are executed or evaluated.

对应的中文意思是 在计算机科学中，控制流是单个语句（指令，或命令式编程中函数调用）的执行顺序。

## local control flow 本地控制流
本地控制流和上面的功能描述一致，只是限定了范围为方法内部。比如下面的代码
```java
fun testControlFlow() {
    functionA()
    functionB()
    functionC()
    //..... other code
}
```

如果上面的方法遵循本地控制流，则`functionA`,`functionB`和`functionC`依次执行，但是存在违背本地控制流的情况，即非本地控制流(Non local control flow)，常见的有

  * inline 的 Lambda 表达式含有return
  * 上述的`functionA`，`functionB`或`functionC`发生[未捕获异常](https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/)
  * 协程也会导致 Non local control flow出现


对于Lambda中的return，除了上述的解决方法，还有下面两种解决方法

## noinline
  * noinline 用来限定 lambda表达式 
  * noinline 强制lambda表达式 不进行inline处理，对应的方式就是翻译成内部类实现。
  * noinline 需要配合inline使用

使用示例如下
```java
inline fun bigHigherOrderFunction(firstRunnable: () -> Unit, noinline secondRunnable: () -> Unit, thirdRunnable: () -> Unit) {
    firstRunnable()
    secondRunnable()
    thirdRunnable()
}

fun testNoInline() {
    bigHigherOrderFunction({
        System.out.println("firstRunnable")
    }, {
        System.out.println("secondRunnable")
        //return //not allowed if the lambda is noinlined
    }, {
        System.out.println("thirdRunnable")
    })
}
```
反编译验证一下。
```java
public final class NoinlineSampleKt {
   public static final void bigHigherOrderFunction(@NotNull Function0 firstRunnable, @NotNull Function0 secondRunnable, @NotNull Function0 thirdRunnable) {
      int $i$f$bigHigherOrderFunction = 0;
      Intrinsics.checkParameterIsNotNull(firstRunnable, "firstRunnable");
      Intrinsics.checkParameterIsNotNull(secondRunnable, "secondRunnable");
      Intrinsics.checkParameterIsNotNull(thirdRunnable, "thirdRunnable");
      firstRunnable.invoke();
      secondRunnable.invoke();
      thirdRunnable.invoke();
   }

   public static final void testNoInline() {
      Function0 secondRunnable$iv = (Function0)null.INSTANCE;
      int $i$f$bigHigherOrderFunction = false;
      int var2 = false;
      System.out.println("firstRunnable");
      secondRunnable$iv.invoke();
      var2 = false;
      System.out.println("thirdRunnable");
   }
```
注意，对于不进行inline处理的 lambda 表达式中 不允许使用return。

## crossinline

但是我们使用了上面的noinline，可能还是担心一些性能问题，好在这里，还有一个叫做crossinline的东西。

  * crossinline 需要配合inline一起起作用
  * crossinline 限定的 lambda 不允许使用return，避免了non local control flow问题

使用示例
```java
//crossinline必须和inline结合使用
inline fun higherOrderFunctionCrossline(crossinline runnable: () -> Unit) {
    runnable()
}

fun testCrossline() {
    higherOrderFunctionCrossline {
        System.out.println("testCrossline")
//        return  not allowed here
    }
}
```
再次反编译验证代码
```java
public static final void higherOrderFunctionCrossline(@NotNull Function0 runnable) {
      int $i$f$higherOrderFunctionCrossline = 0;
      Intrinsics.checkParameterIsNotNull(runnable, "runnable");
      runnable.invoke();
   }

   public static final void testCrossline() {
      int $i$f$higherOrderFunctionCrossline = false;
      int var1 = false;
      System.out.println("testCrossline");
}   
```

## Kotlin inline与 JIT inline的区别
提到inline，听说过的朋友可能第一个想到的是 JIT 的 inline。JIT inline 是JVM虚拟机提供的运行时的一种优化方式。

来一段代码举例来说

```java
public int add(int x, int y) {
  return x + y;
}

public void testAdd() {
	//some code here
	int result = add(a, b);
} 
```

当JVM的JIT编译决定将add方法执行inline操作后，testAdd的方法实现会变成类似这样
```java
public void testAdd() {
	int result = a + b;
}
```

即 将add的方法体实现提取到调用处(testAdd方法中)。inline带来的好处也不言而喻，那就是减少了方法调用产生的进栈和出栈操作，提升运行时的效率。


Kotlin的inline作用和JIT inline大体差不多，稍有一些不同

  * Kotlin的inline发生在编译时，而不是运行时
  * Kotlin的inline可以明确指定，而jit inline则无法指定发生。

## inline 带来的其他问题 can not access private variable
```java
private val aPrivateValue = "A Private Value"

internal val internalValue = "Internal Value"

@PublishedApi
internal  val taskId = "1"

val publicValue = ""

var publicVariable = ""

inline fun beToInlinedMethod(runnable: () -> Unit) {
    //aPrivateValue //Public-API inline function cannot access non-public-API
    // 'private val aPrivateValue: String' defined in root package in file InlineAccessPrivateMember.kt

//  internalValue  同样也报错上面的错误

    taskId

    publicValue

    publicVariable
}
```

上面的beToInlinedMethod 无法访问声明在同一文件中的`aPrivateValue`和`internalValue`，因为
  
  * `beToInlinedMethod`的方法体很有可能被提取到别的模块的方法中
  * 而private 只能在定义的文件中访问
  * internal 只能限定在同一模块访问

解决访问有很多
  
  * 使用上面的public，默认的访问限定符就是public
  * 也可以使用更加推荐的，internal 加上 @PublishedApi 注解的方式。


注：反编译代码受工具影响，可能有些微问题，但不影响总体理解。

## 涉及与延展内容
  * [终端反编译字节码利器 CFR](https://droidyue.com/blog/2019/02/24/decompile-class-file-command-line/)
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [深入探索Java 8 Lambda表达式](https://droidyue.com/blog/2015/11/28/article-java-8-lambdas-a-peek-under-the-hood/)
  * [你的Java代码对JIT编译友好么？](https://droidyue.com/blog/2015/09/12/is-your-java-code-jit-friendly/)
  * [JVM 如何处理未捕获异常](https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/)
   
## References
  * https://android.jlelse.eu/inline-noinline-crossinline-what-do-they-mean-b13f48e113c2
  * https://stackoverflow.com/questions/38827186/what-is-the-difference-between-crossinline-and-noinline-in-kotlin    