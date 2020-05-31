---
layout: post
title: "巧用Kotlin反射实现按值取名，调试做到多快好省"
date: 2020-05-31 20:55
comments: true
categories: Kotlin Reflection 反射 Java Object 
---

## 痛点
我们经常会定义一些常量，比如

```java
public interface ItemType {
    public static final int TYPE_TEXT = 0;
    public static final int TYPE_IMG = 1;
    public static final int TYPE_VIDEO = 2;
    public static final int TYPE_AUDIO = 3;
    public static final int TYPE_LINK = 4;
}

```
<!--more-->

当我们打印查看是哪种类型的时候，如果单纯是打印int值，并不能足够解释业务信息，所以，为了更好的输出信息，我们通常会这样做
```java
private fun inspectItemTypeUgly(itemType: Int) {
    val type = when(itemType) {
        ItemType.TYPE_TEXT -> "text"
        ItemType.TYPE_AUDIO -> "audio"
        ItemType.TYPE_IMG -> "image"
        ItemType.TYPE_LINK -> "link"
        ItemType.TYPE_VIDEO -> "video"
        else -> null
    }
    println("inspect item type =${inspectItemTypeUgly(itemType)};originalValue=$itemType")
}
```

然后这样调用
```java
val itemType = getRandomItemType()
print(inspectItemTypeUgly(itemType))
```

这样做能打印出更加有意义的信息，但是需要编写额外的将int转换成String的方法，可谓是费时费力。


## 有没有好办法

方法是有的。

比如我们定义`public static final int TYPE_TEXT = 0;`的时候，我们定义了常量名和常量值。那么

  * 我们可以利用变量值查找对应的变量名
  * 借助 Kotlin便捷的特性和反射库，我们可以更好更轻松实现。


## 秀代码

### 针对 Java 类（接口）和普通的 Kotlin类
```kotlin
fun <T> getConstantNameByValueFromNormalClass(kClass: KClass<*>, value: T): String? {
    value ?: return null
    return kClass.staticProperties.filter {
        it.isFinal
    }.firstOrNull() {
        it.getter.call() == value
    }?.name
}
```

#### 调用示例
```kotlin
println("itemType=${ItemType::class.getConstantNameByValueFromNormalClass(itemType)}")
```

### 针对 Kotlin object
```kotlin
fun <T> getConstantNameByValueForObject(kClass: KClass<*>, value: T): String? {
    value ?: return null
    return kClass.memberProperties.filter {
        it.isFinal
    }.firstOrNull {
        it.getter.call() == value
    }?.name
}
```

#### 调用示例
```kotlin
//定义常量在Object对象中
object ErrorCodes {
    const val ERROR_OK = 0
    const val ERROR_INVALID_PARAM = 1
}

//调用处
println("errorCode=" + ErrorCodes::class.getConstantNameByValueForObject(0))

```

###  针对 Kotlin Top Level 变量的问题

  * 对于 Kotlin变量定义，我们推荐是定义在top level层级。
  * 但是 Kotlin无法直接访问到 top level 层级的类
  * 我们需要借助一些变量来辅助获取 top level 层级的类
  * 但是 Kotlin的反射无法top level类，所以我们必须使用java class

#### 借助一个变量或者顶层类
```kotlin
const val SOURCE_REMOTE = 0
const val SOURCE_LOCAL = 1

val myConstantTopClass = object : Any() {}.javaClass.enclosingClass

```

#### 借助 Java class来获取常量（用KClass会抛出不支持异常）
```kotlin
fun <T> Class<*>.getConstantNameByValues(value: T): String? {
    value ?: return null
    return declaredFields.mapNotNull {
        it.kotlinProperty
    }.filter {
        it.isFinal
    }.firstOrNull {
        it.getter.call() == value
    }?.name
}
```

#### 调用处
```kotlin
println("sourceType=" + myConstantTopClass.getConstantNameByValues(0))

```

## 总代码
```kotlin
import kotlin.reflect.KClass
import kotlin.reflect.full.memberProperties
import kotlin.reflect.full.staticProperties
import kotlin.reflect.jvm.kotlinProperty

fun <T> KClass<*>.findConstantNameByValue(value: T): String? {
    return if (this.isKotlinObject()) {
        getConstantNameByValueForObject(this, value)
    } else {
        getConstantNameByValueFromNormalClass(this, value)
    }
}

fun <T> getConstantNameByValueFromNormalClass(kClass: KClass<*>, value: T): String? {
    value ?: return null
    return kClass.staticProperties.filter {
        it.isFinal
    }.firstOrNull() {
        it.getter.call() == value
    }?.name
}

fun <T> getConstantNameByValueForObject(kClass: KClass<*>, value: T): String? {
    value ?: return null
    return kClass.memberProperties.filter {
        it.isFinal
    }.firstOrNull {
        it.getter.call() == value
    }?.name
}

fun <T> Class<*>.getConstantNameByValues(value: T): String? {
    value ?: return null
    return declaredFields.mapNotNull {
        it.kotlinProperty
    }.filter {
        it.isFinal
    }.firstOrNull {
        it.getter.call() == value
    }?.name
}

fun KClass<*>.isKotlinObject(): Boolean {
    return this.objectInstance != null
}
```

## Android 工程增加依赖(Kotlin 反射库)
```java
implementation "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
```
## 性能问题
  * 都说，反射的话性能比较差，是的，但是也不是那么的差。
  * 如果担心性能，可以限定在非release版本下执行

## 注意事项
  * 这种方法不适合于代码混淆后进行处理
  * 定义变量的地方，保持业务单一，不要出现多个变量名对应一个变量值的问题

## 完整代码
  * https://github.com/androidyue/KotlinReflectionSample

## Kotlin其他内容推荐
  * [编写地道的 Kotlin 代码](https://droidyue.com/blog/2019/05/19/do-and-dont-in-kotlin/)
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [更多Kotlin系列文章](https://droidyue.com/blog/categories/kotlin/)

