---
layout: post
title: "这可能是最好的 Android/Kotlin日志输出方法"
date: 2019-11-24 18:40
comments: true
categories: Kotlin Android Lambda inline 日志 Debug 调试 字符串 Java 
---


在编程调试和定位问题的时候，日志是一个最常用的工具。比如输出一些信息，确定执行轨迹。今天我们这里简单聊一聊打印日志的一些分析。

通常，我们进行日志输出的时候都会限定在debug包下执行，对于非debug包，我们就不输出日志。那么如果是非debug，不同的日志输出方式可能存在一定的性能问题，本文将通过几个版本来对比着方面的差异。

<!--more-->


## 原始版

这可能是最原始的版本打印日志了，判断是否是debug，然后决定是否输出日志

```kotlin
fun debugLog(message: String?) {
    if (BuildConfig.DEBUG) {
        Log.d("debugLog", message)
    }
}

private fun testDebugLog() {
    debugLog("getProperties " + getProperties()?.joinToString())
}
```

上面的问题

  * `testDebugLog` 需要执行`getProperties()`，这一步的性能不可预知
  * `testDebugLog` 内部存在字符串拼接
  * 如果拼接内容复杂，比如一个庞大的Object，会造成一定的开销
  * 综上所述，该实现如果在`非Debug条件下`存在一定的运行时开销

## 不拼接的版本

既然拼接会导致一些问题，那么下面的版本采用(调用处)不拼接的形式

```kotlin
fun debugMessage(vararg args: Any?) {
    if (BuildConfig.DEBUG) {
        Log.d("debugMessage", args.joinToString())
    }
}

private fun testDebugMessage() {
    debugMessage("getProperties", getProperties())
}
```

  * **仍然需要执行 `getProperties()`，这一步的性能不可预知**
  * 上面的代码使用了可变参数的形式处理message信息
  * 而可变参数内部实际采用了数组的形式，也就是上面的代码会在运行时生成一个数组，一个元素是`getProperties`,另一个元素是`getProperties()`的内容
  * 这个版本相对第一个版本要好一些（以极端情况看），但是`在非Debug条件下`仍然存在一定的运行时开销，不完美。

## 相对最完美的版本

这个版本是相对最好的实现，规避了非Debug环境下的字符串拼接和具体求值的操作

```kotlin
inline fun smartMessage(lazyMessage: () -> Any?) {
    if (BuildConfig.DEBUG) {
        Log.d("smartMessage", lazyMessage().toString())
    }
}

private fun testSmartMessage() {
    smartMessage {
        "getProperties " + getProperties()
    }
}
```

  * 上面使用了Lambda表达式来生成message信息


### 如何巧妙地规避不必要的开销
当我们反编译Kotlin 代码 到 Java代码时，一切就清晰了。

```java
private final void testSmartMessage() {
      int $i$f$smartMessage = false;
      if (BuildConfig.DEBUG) {
         String var3 = "smartMessage";
         int var2 = false;
         String var4 = "getProperties " + this.getProperties();
         Log.d(var3, String.valueOf(var4));
      }

}
```

  * 之前的Lambda 由于采用了 inline 处理 会把`smartMessage` 提取到调用处`testSmartMessage`
  * 上面的信息，都是确保了在`BuildConfig.DEBUG`成立时才执行，否则不执行
  * 上面的做法，利用了Kotlin的特性，就运行时可能存在的开销一下就移除了。


## 注意
  * smartMessage 建议只在 Kotlin 中调用，否则会生成实例，因为无法inline处理
 
## 相关阅读
  * [字符串拼接](https://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)
  * [Kotlin 中的 Lambda 与 Inline](https://droidyue.com/blog/2019/04/27/lambda-inline-noinline-crossinline/)
  * [关于Android Log的一些思考](https://droidyue.com/blog/2015/11/01/thinking-about-android-log/)
  * [如何反编译 Kotlin 代码](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [更多Kotlin文章](https://droidyue.com/blog/categories/kotlin/)



