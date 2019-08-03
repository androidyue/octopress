---
layout: post
title: "Kotlin编译调校之WarningsAsErrors"
date: 2019-08-03 14:21
comments: true
categories: Kotlin Kotlinc compiler 编译器 编译时 运行时 错误 警告 Warnigns Errors
---
这之前的文章中，我们介绍过如果通过Kotlin编译器参数实现将所有的warnings按照errors对待，主要的实现方法是这样

```bash
//Code to be added
kotlinOptions {
    allWarningsAsErrors = true
}
```
<!--more-->

那么问题可能就会被提出来，开启这一选项有什么好处呢，毕竟我需要修改很多文件。

通常情况下，开启后的作用，我们可以归纳为如下

  * 发现更多的潜在问题和崩溃
  * 减少不必要的代码（变量，参数）
  * 发现不好的编码实践
  * 发现更多的API弃用问题
  * 最终增加代码的健壮性和优雅程度

如下，我们会通过一些实践来说明一些问题

## Nothing to Inline（作用不大的内联）
```kotlin
@Suppress("NOTHING_TO_INLINE")
inline fun String?.isNotNullNorEmpty(): Boolean {
    //Expected performance impact of inlining 
    // 'public inline fun String?.isNotNullNorEmpty(): Boolean 
    // defined in com.example.warningsaserrorscases in file NothingToInlineWarnings.kt'
    // is insignificant. 
    // Inlining works best for functions with parameters of functional types
    return this != null && this.isNotEmpty()
}
```

  * Kotlin的inline关键字会将对应的方法内联到调用者的方法体，减少进栈出栈操作
  * inline最好的场景是处理函数类型参数，比如lambda
  * 刻意的inline可能导致方法体膨胀，增大class文件大小。
  * 处理这种警告，建议是去除inline关键字
  * 如果执意inline时，使用`@Suppress("NOTHING_TO_INLINE")`压制编译器警告

## INACCESSIBLE_TYPE(不可访问的类型)
```java
public class RequestManager {
    public static RequestManager sInstance = new RequestManager();

    private static class TimelineRequest {
        public String from;
    }

    public TimelineRequest getTimelineRequest() {
        return new TimelineRequest();
    }
}
```

```kotlin
fun testInaccessibleType() {
    //Type RequestManager.TimelineRequest! is inaccessible in this context
    // due to: private open class TimelineRequest defined
    // in com.example.warningsaserrorscases.RequestManager
    @Suppress("INACCESSIBLE_TYPE")
    RequestManager.sInstance.timelineRequest
}
```

  * 上述的`testInaccessibleType`无法访问`TimelineRequest`的属性和方法
  * 具体的解决办法，可以是设置`TimelineRequest`为public，而非private
  * 必要时可以使用`@Suppress("INACCESSIBLE_TYPE")`压制警告

## UNCHECKED_CAST(未检查的类型转换)
```kotlin
fun <T> Any.toType(): T? {
    //Unchecked cast: Any to T
    @Suppress("UNCHECKED_CAST")
    return this as? T
}
```
  
  * 上面`this as? T`属于未检查的类型转换，可能在运行时抛出转换异常
  * 不推荐使用`@Suppress("UNCHECKED_CAST")`压制警告
  * 推荐使用reified方式处理

```kotlin
//a better way
inline fun <reified T> Any.toType(): T? {
    return if (this is T) {
        this
    } else {
        null
    }
}
```

## WHEN_ENUM_CAN_BE_NULL_IN_JAVA(Enum 可能为null)
```kotlin
fun testEnum1() {
    //Enum argument can be null in Java, but exhaustive when contains no null branch
    when(SeasonUtil.getCurrentSeason()) {
        Season.SPRING -> println("Spring")
        Season.SUMMER -> println("Summer")
        Season.FALL -> println("Fall")
        Season.WINTER -> println("Winter")
        //else -> println("unknown")
    }
}

fun testEnum2() {
    //Enum argument can be null in Java, but exhaustive when contains no null branch
    @Suppress("WHEN_ENUM_CAN_BE_NULL_IN_JAVA")
    when(SeasonUtil.getCurrentSeason()) {
        Season.SPRING -> println("Spring")
        Season.SUMMER -> println("Summer")
        Season.FALL -> println("Fall")
        Season.WINTER -> println("Winter")
    }
}
```
  * 上述的`SeasonUtil.getCurrentSeason()`可能为null
  * 建议增加`else -> println("unknown")`处理when的缺省情况
  * 不建议使用`@Suppress("WHEN_ENUM_CAN_BE_NULL_IN_JAVA")`压制警告

## PARAMETER_NAME_CHANGED_ON_OVERRIDE(方法重写修改参数名)
```kotlin
interface OnViewClickedListener {
    fun onViewClicked(viewId: Int)
}

fun testParameterNameChangedOnOverride() {
    // The corresponding parameter in the supertype 'OnViewClickedListener'
    // is named 'viewId'.
    // This may cause problems when calling this function with named arguments.
    object : OnViewClickedListener {
        override fun onViewClicked(@Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE") id: Int) {
            println("onViewClicked id=$id")
        }
    }
}
```

  * 出问题的情况是当我们使用具名变量指定参数值时，可能出问题。
  * 建议方法参数与源方法保持一致。
  * 不建议压制警告

## Name shadowing（命名遮挡）
```kotlin
fun testNameShadowing(message: String) {
    run {
        //Name shadowed: message
        @Suppress("NAME_SHADOWING") val message = "Hello World"
        println(message)
    }
}
```

  * 当run方法后面的lambda中的message与`testNameShadowing`的message命名一致时，就发生了所谓的Name shadowing（命名遮挡）
  * Name shadowing很容易导致问题，且排查起来不易察觉。
  * 建议主动通过命名差异来解决这个问题
  * 不建议压制警告


## Uncessary cases (不必要的编码场景)
### UNNECESSARY_SAFE_CALL(不必要的安全调用)
```kotlin
fun testUnnecessarySafeCall(message: String) {
    @Suppress("UNNECESSARY_SAFE_CALL")
    println(message?.toIntOrNull())
}
```

  * 上述的安全调用其实是显得多余，因为Kotlin内部会有`Intrinsics`做参数非空的与判断
  * 另外安全调用会增加if条件检查
  * 建议主动移不必要的安全调用
  * 不建议压制警告

### SENSELESS_COMPARISON(无意义的比较)
```kotlin
fun testSenselessComparison(message: String) {
    //Condition 'message != null' is always 'true'
    @Suppress("SENSELESS_COMPARISON")
    if (message != null) {

    }
}
```

  * 和前面的例子一样，这种检查是多余的，因为Kotlin内部会有`Intrinsics`做参数非空的与判断
  * 建议主动移除无意义的比较
  * 不建议压制警告

### UNNECESSARY_NOT_NULL_ASSERTION（不需要的非空断言）
```kotlin
fun testUncessaryNotNullAssertion(message: String) {
    //Unnecessary non-null assertion (!!) on a non-null receiver
    // of type String
    @Suppress("UNNECESSARY_NOT_NULL_ASSERTION")
    println(message!!.toIntOrNull())
}
```

  * 这种断言是多余的，因为Kotlin内部会有`Intrinsics`做参数非空的与判断
  * 建议主动移除不需要的非空断言
  * 不建议压制警告

### USELESS_IS_CHECK(没有用的实例类型检查)
```kotlin
fun testUselessIsCheck(message: String) {
    //Check for instance is always 'true'
    @Suppress("USELESS_IS_CHECK")
    if (message is String) {

    }
}
```

  * 没有意义的类型检查，因为Kotlin内部会有`Intrinsics`做参数非空的与判断
  * 建议主动移除不必要的检查
  * 不建议压制警告

### VARIABLE_WITH_REDUNDANT_INITIALIZER(变量初始化多余)
```kotlin
fun testVariableWithRedundantInitializer() {
    //Variable 'message' initializer is redundant
    @Suppress("VARIABLE_WITH_REDUNDANT_INITIALIZER") var message: String? = null;
    message = System.currentTimeMillis().toString()
    println(message)
}
```

  * 建议手动移除多余的初始化
  * 不建议压制警告

## Deprecation (方法弃用)
```kotlin
fun testGetDrawable(context: Context) {
    @Suppress("DEPRECATION")
    context.resources.getDrawable(R.mipmap.ic_launcher)
}
```

建议的方法是寻找替代弃用方法的其他方法，以getDrawable为例，我们可以使用

  * `ContextCompat.getDrawable(getActivity(), R.drawable.name);`
  * `ResourcesCompat.getDrawable(getResources(), R.drawable.name, null);`
  * `ResourcesCompat.getDrawable(getResources(), R.drawable.name, anotherTheme);`
  * 必要时可以选择压制警告


## unsued cases(开发者编码没有用到的情况)
### Parameter 'extra' is never used(参数没有使用)
```kotlin
fun showMessage(message: String, extra: String?) {
    println(message)
}
```

解决方法

  * 移除extra参数
  * 方法中使用extra参数
  * 使用`@Suppress("UNUSED_PARAMETER")`压制警告


### Parameter 'index' is never used, could be renamed to _（匿名参数没有使用，可以使用占位符）
```kotlin
fun forEachList() {
    listOf<String>("Hello", "World").forEachIndexed { index, s ->
        println(s)
    }
}
```

   
  * 将`index`改成占位符`_`
  * 使用`@Suppress("UNUSED_ANONYMOUS_PARAMETER")`压制警告

## Variable 'currentTimeStamp' is never used(变量未使用)
```kotlin
fun unusedVariable() {
    @Suppress("UNUSED_VARIABLE") val currentTimeStamp = System.currentTimeMillis()
    println("unusedVariable")
}
```

  * 移除变量
  * 使用@Suppress压制警告

## The expression is unused(表达式未使用)
```kotlin
fun test(status: Int) {
    when(status) {
        1 -> "First"
        2 -> "Second"
        else -> "Else"
    }
}
```
  
  * 移除不用的表达式
  * 使用`Suppress`压制警告

## UNUSED_VALUE && ASSIGNED_BUT_NEVER_ACCESSED_VARIABLE (未使用的值，赋值后未使用的变量)
```kotlin
fun testUnusedValue() {
    // The value '"Hello"' assigned to 'var message: String?
    // defined in com.example.warningsaserrorscases.test' is never used
    @Suppress("ASSIGNED_BUT_NEVER_ACCESSED_VARIABLE") var message: String? = null
    @Suppress("UNUSED_VALUE")
    message = "Hello"
}
```

  * 移除不用变量
  * 使用`Suppress`压制警告

## 关于@Suppress
  * 不建议滥用，因优先考虑其他的更好的解决问题的方式
  * 及时使用一定要限定最小作用范围，通常的选择范围尽量限制在变量(variable)，参数(parameter)或者语句(statement)上。
  * 上面代码中出现了很多`@Suppress`主要目的是显示警告的名称，而不是提倡大家使用压制的方式处理警告。

以上。

## 相关文章
  * [为 Kotlin 项目设置编译选项](https://droidyue.com/blog/2019/07/21/configure-kotlin-compiler-options/)
  * [使用Kotlin Reified 让泛型更简单安全](https://droidyue.com/blog/2019/07/28/kotlin-reified-generics/)
  * [更多Kotlin优质内容](https://droidyue.com/blog/categories/kotlin/)