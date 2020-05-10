---
layout: post
title: "用好 require,check,assert,写好 Kotlin 代码"
date: 2020-05-10 21:09
comments: true
categories: Kotlin require check assert 断言 Java 编码 
---

在编码的时候，我们需要做很多的检测判断，比如某个变量是否为`null`，某个成员属性是否为`true`，执行某个操作结果是否成功。比如像下面的这段代码
```kotlin
var isDiskMounted = true

fun createNewFile(file: File?): Boolean {
    return if (isDiskMounted) {
        if (file != null) {
            file.createNewFile()
            if (file.exists()) {
                true
            } else {
                println("Create file($file) failed")
                false
            }
        } else {
            println("File($file) is null")
            false
        }
    } else {
        println("Disk is not mounted")
        false
    }
}
```

<!--more-->

上面的代码实现了

  * 检测磁盘是否挂载
  * 检测file参数是否为null
  * 检测执行操作结果是否成功（file.exists()）


但是上面的代码也有一些问题

  * 太多的if else 检测，层级产生，不够平
  * 多个方法出口
  * 更不容易发现异常和错误（有点类似fail safe模式）


## 使用今天的知识点改造
```kotlin
fun createNewFileV2(file: File?): Boolean {
    check(isDiskMounted) {
        "Disk is not mounted"
    }

    requireNotNull(file) {
        "file is null"
    }

    file.createNewFile()

    assert(file.exists()) {
        "createNewFileV2 file($file) does not exist"
    }
    return true
}
```

  * 方法体没有多余层级，比较平
  * 单个方法出口
  * 更快更早发现问题（有点类似fail fast）
  * `file.createNewFile()`执行时可以不需要再使用`file?.createNewFile()` 这一点是因为使用了[Contract](https://droidyue.com/blog/2019/08/25/kotlin-contract-between-developers-and-the-compiler/)。


## require
  * `require(boolean)` 用来检测方法的参数，当参数boolean为false时，抛出`IllegalArgumentException`

### 示例代码
```kotlin
fun readFileContent(file: File?): String {
    //判断file不能为null
    requireNotNull(file)

    //判断文件必须可读，并提供错误的信息
    require(file.canRead()) {
        "readFileContent file($file) is not readable"
    }

    //read file content
    return "Your file content"
}
```

### 变种方法
  * `fun require(value: Boolean)`
  * `fun require(value: Boolean, lazyMessage: () -> Any)`
  * `fun <T : Any> requireNotNull(value: T?)`
  * `fun <T : Any> requireNotNull(value: T?, lazyMessage: () -> Any)`

## check
  * `check(boolean)`用来检测对象的状态（属性），如果boolean为false，抛出异常`IllegalStateException`

### 示例代码
```kotlin
class Engine {
    var isStarted = false

    fun speedUp() {
        check(isStarted) {
            "Engine is not started, cannot be speed up now"
        }

        //speed up the engine
    }


}
```

### 变种方法
  * `fun check(value: Boolean, lazyMessage: () -> Any)`
  * `fun <T : Any> checkNotNull(value: T?)`
  * `fun <T : Any> checkNotNull(value: T?, lazyMessage: () -> Any)`

## assert
  * `assert(boolean)` 用来检测执行结果，当boolean为false时，抛出`AssertionError`。但是需要在开启对应的JVM选项时才生效。

### 示例代码
```kotlin
fun makeFile(path: String) {
    val file = File(path)
    file.createNewFile()

    assert(file.exists()) {
        "make File($file) failed"
    }
}
```

## 使用顺序

  * 先使用`check`检测对象的状态
  * 再使用`require`检测方法的参数合法性
  * 执行操作后，使用`assert`校验结果


## 关于lazyMessage
  * lazyMessage 可以允许我们提供更详细的错误辅助信息
  * lazyMessage的类型是`()-> Any`,结合inline操作，可以实现惰性求值
  * 具体可以参考 [这可能是最好的 Android/Kotlin日志输出方法](https://droidyue.com/blog/2019/11/24/smart-log-in-android-slash-kotlin/)

## 崩溃更多了，怎么办
  * 是的，上面无论是`require`,`check`,`assert`都会在发现错误的时候抛出异常
  * 这是为了让问题更早发现，这就是它们的哲学
  * 如果想要考虑稳定的话，可以在业务侧 debug下崩溃，非debug下捕获吞掉异常

```kotlin
fun main() {
    createNewFile(null)
    safeRun {
        createNewFileV2(null)
    }
}

private val isDebug = true

fun safeRun(block: () -> Unit) {
    try {
        block()
    } catch (t: Throwable) {
        t.printStackTrace()
        if (isDebug) {
            throw  t
        }
    }
}
```

## 更多文章
  * [编写地道的 Kotlin 代码](https://droidyue.com/blog/2019/05/19/do-and-dont-in-kotlin/)
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [KotlinTips: getValueSafely 安全取值](https://droidyue.com/blog/2020/03/22/kotlin-tips-get-value-safely/)
