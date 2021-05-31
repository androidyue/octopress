---
layout: post
title: "Coobox之 LastWinExecutor，后来居上执行器"
date: 2021-05-31 12:07
comments: true
categories: Android Coobox Handler Java Kotlin 
---

在编程的业务场景中，有时候会有这样的情况。有一个文本输入框用来输入检索数据

  * 为了避免过多的网络检索，实现频率控制
  * 当且仅当距离上次输入字符500 毫秒后，才真正执行检索请求

<!--more-->
## 第一步 创建 LastWinExecutor
```java
val lastWinExecutor: LastWinExecutor = LastWinExecutor(500)
```

其中

  * LastWinExecutor 接受一个超时参数，单位为毫秒，例子中为500毫秒


## 第二步 提交请求
```java
lastWinExecutor.submit {
	//需要执行的代码
	...
}
```

其中

  * 每次输入框内容改变都会调用`lastWinExecutor.submit`
  * 但是仅仅当距离上个输入框字符输入超过500 毫秒 才执行相应的代码

## 完整代码
```java
class LastWinExecutorFragment : TestableFragment() {
    val lastWinExecutor: LastWinExecutor = LastWinExecutor(500)

    fun observeTextView(textView: TextView) {
        textView.doAfterTextChanged {
            lastWinExecutor.submit {
                queryResult(it?.toString())
            }
        }
    }
}
```

## 实现原理
```java
/**
 * 任务执行器，在规定的时间内执行提交，最后一个会被执行，之前的会被取消
 */
class LastWinExecutor(private val timeSpanInMills: Long) {
    private val handler = Handler(Looper.getMainLooper())

    /**
     * 提交一个任务，如果在提交后 @param timeSpanInMills 没有新任务, 则执行该任务，否则被取消
     */
    fun submit(task: KRunnable) {
        clearAllTasks()
        handler.postDelayed(task, timeSpanInMills)
    }

    /**
     * 取消所有任务
     */
    fun clearAllTasks() {
        handler.removeCallbacksAndMessages(null)
    }
}
```

实现原理为利用了 Handler postDelay方法实现。

## 如何快速使用
  * LastWinExecutor 已经包含在 CooBox 中，简单几步即可集成。[开始集成](https://github.com/secoo-android/coobox) 欢迎点星星
  * LastWinExecutor 源码 https://github.com/secoo-android/coobox
