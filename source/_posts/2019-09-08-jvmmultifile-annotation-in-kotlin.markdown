---
layout: post
title: "JvmMultifile 注解在 Kotlin 中的应用"
date: 2019-09-08 20:43
comments: true
categories: Kotlin Annotation 注解 编译器 原理 Java
---
接触过Kotlin之后，我们会利用其扩展方法特性创建很多便捷的方法来实现更好更快的编码。比如我们对于RxJava进行一些简单的扩展方法实现。

<!--more-->
下面的这段代码实现一个将任意的对象转成Single实例
```kotlin
package com.example.jvmannotationsample

import io.reactivex.Single

//fileName:SingleExt.kt
/**
 * shortcut method to change T instance into Single<T> instance
 */
fun <T: Any> T.toSingle(): Single<T> {
    return Single.just(this)
}
```
接下来的代码，实现将任意类型的List转成Observable实例
```kotlin
package com.example.jvmannotationsample

import io.reactivex.Observable
//fileName:ObservableExt.kt
/**
 * shortcut method to convert List<T> instance to Observable<List<T>> instance
 */
fun <T: Any> List<T>.toObservable(): Observable<List<T>> {
    return Observable.fromArray(this)
}

```
针对上面的代码，我们使用时会是下面的样子
```java
 //the old way
SingleExtKt.toSingle("Kotlin");
ObservableExtKt.toObservable(Arrays.asList("Kotlinc", "Developer", "Friends"));
```

## 能不能将上面两个类合成一个呢
有时候，我们可能处于这样的考虑，比如SingleExt与ObservableExt里面的扩展方法都是和RxJava有关，可不可以同一称为RxUtil呢，这样使用起来也很方面。

答案是，可以的，就是利用@file:JvmName和@file:JvmMultifileClass就可以实现。

实现代码如下
```kotlin
@file:JvmName("RxUtil")
@file:JvmMultifileClass
package com.example.jvmannotationsample

import io.reactivex.Single
//fileName:SingleExt.kt
/**
 * shortcut method to change T instance into Single<T> instance
 */
fun <T: Any> T.toSingle(): Single<T> {
    return Single.just(this)
}
```

```kotlin
@file:JvmName("RxUtil")
@file:JvmMultifileClass
package com.example.jvmannotationsample

import io.reactivex.Observable
//fileName:ObservableExt.kt
/**
 * shortcut method to convert List<T> instance to Observable<List<T>> instance
 */
fun <T: Any> List<T>.toObservable(): Observable<List<T>> {
    return Observable.fromArray(this)
}
```

修改后，就可以在Java中完全使用`RxUtil`调用了。
```kotlin
//a much better way using @file:JvmMultifileClass
RxUtil.toSingle("Kotlin");
RxUtil.toObservable(Arrays.asList("Kotlinc", "Developer", "Friends"));
```
## 内部机制
确实有一些神奇，简简单单的增加几个注解，就能实现。但是这样远远还不够，我们需要了解它是如何工作的。

查找对应的类
```bash
find . -name "*.class"
./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil.class
./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil__ObservableExtKt.class
./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil__SingleExtKt.class
```

使用javap工具拆解分析RxUtil.class文件
```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil.class
public final class com.example.jvmannotationsample.RxUtil {
  public static final <T> io.reactivex.Observable<java.util.List<T>> toObservable(java.util.List<? extends T>);
    Code:
       0: aload_0
       1: invokestatic  #12                 // Method com/example/jvmannotationsample/RxUtil__ObservableExtKt.toObservable:(Ljava/util/List;)Lio/reactivex/Observable;
       4: areturn

  public static final <T> io.reactivex.Single<T> toSingle(T);
    Code:
       0: aload_0
       1: invokestatic  #21                 // Method com/example/jvmannotationsample/RxUtil__SingleExtKt.toSingle:(Ljava/lang/Object;)Lio/reactivex/Single;
       4: areturn
}

```

上面的代码，我们可以看到

  * toObservable方法内部实际上是调用了`RxUtil__ObservableExtKt.toObservable`
  * toSingle 方法内部实际上是调用了`RxUtil__SingleExtKt.toSingle`

下面是对两个具体实现类的分析。

使用javap工具拆解分析RxUtil__ObservableExtKt.class文件

```bash
 javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil__ObservableExtKt.class
Compiled from "ObservableExt.kt"
final class com.example.jvmannotationsample.RxUtil__ObservableExtKt {
  public static final <T> io.reactivex.Observable<java.util.List<T>> toObservable(java.util.List<? extends T>);
    Code:
       0: aload_0
       1: ldc           #10                 // String $this$toObservable
       3: invokestatic  #16                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
       6: iconst_1
       7: anewarray     #18                 // class java/util/List
      10: dup
      11: iconst_0
      12: aload_0
      13: aastore
      14: invokestatic  #24                 // Method io/reactivex/Observable.fromArray:([Ljava/lang/Object;)Lio/reactivex/Observable;
      17: dup
      18: ldc           #26                 // String Observable.fromArray(this)
      20: invokestatic  #29                 // Method kotlin/jvm/internal/Intrinsics.checkExpressionValueIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
      23: areturn
}
```
使用javap工具拆解分析RxUtil__SingleExtKt.class文件

```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil__SingleExtKt
Warning: Binary file ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/RxUtil__SingleExtKt contains com.example.jvmannotationsample.RxUtil__SingleExtKt
Compiled from "SingleExt.kt"
final class com.example.jvmannotationsample.RxUtil__SingleExtKt {
  public static final <T> io.reactivex.Single<T> toSingle(T);
    Code:
       0: aload_0
       1: ldc           #10                 // String $this$toSingle
       3: invokestatic  #16                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
       6: aload_0
       7: invokestatic  #21                 // Method io/reactivex/Single.just:(Ljava/lang/Object;)Lio/reactivex/Single;
      10: dup
      11: ldc           #23                 // String Single.just(this)
      13: invokestatic  #26                 // Method kotlin/jvm/internal/Intrinsics.checkExpressionValueIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
      16: areturn
}
```

### 相关Kotlin内容推荐
  * [如何研究Kotlin](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [JvmName注解](https://droidyue.com/blog/2019/09/01/jvm-name-annotations-kotlin/)
  * [kotlin编译器调校](https://droidyue.com/blog/2019/07/21/configure-kotlin-compiler-options/)
  * [Kotlin更多文章](https://droidyue.com/blog/categories/kotlin/)
