---
layout: post
title: "CooBox 之 早鸟执行器，轻松控制频率处理"
date: 2021-05-24 11:56
comments: true
categories: Coobox Android Java Kotlin 
---

在处理编程场景时，我们有时候需要控制某些频率。比如一个用户疯狂地点击一个按钮，我们想要这样处理。

  * 在5秒之内，只处理第一个点击请求的内容

使用 CooBox 中的 `EarlyBirdExecutor`(早鸟执行器，早起的鸟儿有虫吃。`^_^`) 我们可以很便捷的实现该功能。

<!--more-->

## 第一步，创建对象
```kotlin
private val earlyBirdExecutor = EarlyBirdExecutor(5 * DateUtils.SECOND_IN_MILLIS);
```

其中构造参数，接受一个有效的时间周期，单位为毫秒。

## 第二步，执行递交任务
```kotlin
val executed = earlyBirdExecutor.submit {
    //真正要执行的代码
    ....
}
```

  * 每次用户点击的时候，执行上面的代码调用
  * 当在单位时间周期内，是第一个提交任务，则被执行，`executed` 值为`true`，否则为`false`

## 完整示例源码
```kotlin
object EarlyBirdTest {
    private val earlyBirdExecutor = EarlyBirdExecutor(5 * DateUtils.SECOND_IN_MILLIS);

    fun onUserClick() {
        val currentDate = Date()

        val executed = earlyBirdExecutor.submit {
            smartLogD {
                "onUserClick $currentDate"
            }
        }

        smartLogD {
            "onUserClick executed=$executed;date=$currentDate"
        }
    }
}
```

## 如何快速使用
  * `EarlyBirdExecutor`已经包含在 CooBox 中，简单几步即可集成。[开始集成](https://github.com/secoo-android/coobox)
  * `EarlyBirdExecutor` 源码 https://github.com/secoo-android/coobox/blob/main/library/src/main/java/com/secoo/coobox/library/util/schedule/EarlyBirdExecutor.kt
