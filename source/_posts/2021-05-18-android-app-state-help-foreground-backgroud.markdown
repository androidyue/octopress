---
layout: post
title: Coobox 之 App 前后台状态变化通知
date: 2021-05-18 12:12
comments: true
categories: Android Kotlin Java Coobox App State Foreround Background 前台 后台 
---

前言：Coobox 是我们团队开源的 Android 开发工具库，https://github.com/secoo-android/coobox 欢迎大家 Star 和 Fork，以及集成使用。


在 Android 应用日常开发中，我们有时候需要判断应用处于前台还是后台，来进行一些状态更新或者资源处理等操作。而 Android 并未直接提供对应的检测方法，需要我们来实现。而实用的 CooBox 就集成了这一方面的工具代码。

<!--more-->

## 如何定义前后台

  * 这里的前后台不是 Linux 进程的前后台(Foreground, Backgroud)
  * App 前台状态指的是 当用户可以肉眼可见 App 的界面(Activity)，否则为 App 后台状态


## 如何实现
  * 定义一个当前进程的 Activity数量变量，如`activityCount`, Int类型
  * 当进程中的 Activity 执行到 `onStart` 方法，执行`activityCount++`
  * 当进程中的 Activity 执行到 `onStop` 方法，执行`activityCount--`
  * 当`activityCount` 为 `0`, 则表示 App 在后台状态，否则为前台状态

## 实现代码
```kotlin
package com.secoo.coobox.library.lifecycle

import android.app.Activity


object AppStateHelper {
    private var activityCount = 0
    private val listeners = mutableListOf<OnAppStateChangedListener>()

    /**
     * 判断 App 当前是否为前台可见状态
     */
    val isForeground: Boolean
        get() = activityCount != 0

    /**
     * 判断 App 当前是否为后台不可见状态
     */
    val isBackground: Boolean
        get() = activityCount == 0


    enum class Message {
        BACKGROUNDED, FOREGROUNDED
    }

    /**
     * 返回当前的App状态
     * @return
     */
    val state: Message
        get() = if (isForeground) {
            Message.FOREGROUNDED
        } else {
            Message.BACKGROUNDED
        }

    /**
     * Activity 执行到 onStart 时调用，需主动调用
     */
    fun activityStarting(activity: Activity): Boolean {
        var ret = false
        if (activityCount == 0) {
            onForeground(activity)
            ret = true
        }
        activityCount++
        return ret
    }

    /**
     * Activity 执行到 onStop 时调用，需主动调用
     * */
    @Synchronized
    fun activityStopping(activity: Activity): Boolean {
        activityCount--
        if (activityCount == 0) {
            onBackground(activity)
            return true
        }
        return false
    }

    fun addListener(listener: OnAppStateChangedListener) {
        listeners.add(listener)
    }

    fun removeListener(listener: OnAppStateChangedListener) {
        listeners.remove(listener)
    }

    private fun onBackground(activity: Activity) {
        listeners.forEach {
            it.onAppStateChanged(Message.BACKGROUNDED, activity)
        }
    }

    private fun onForeground(activity: Activity) {
        listeners.forEach {
            it.onAppStateChanged(Message.FOREGROUNDED, activity)
        }
    }

}
```

## 手动触发调用
```kotlin
class AppStateTestFragment : TestableFragment(), OnAppStateChangedListener {
    override fun addTestItems() {
    }

    fun setupAppStateHelper(application: Application) {
        application.registerActivityLifecycleCallbacks(object: ActivityLifecycleCallbacksImpl() {
            override fun onActivityStarted(activity: Activity) {
                super.onActivityStarted(activity)
                AppStateHelper.activityStarting(activity)
            }

            override fun onActivityStopped(activity: Activity) {
                super.onActivityStopped(activity)
                AppStateHelper.activityStopping(activity)
            }
        })
    }
}
```

## 使用简介
### 监听 前后台 状态变化
```kotlin
AppStateHelper.addListener(object: OnAppStateChangedListener {
    override fun onAppStateChanged(state: AppStateHelper.Message, activity: Activity) {
    	Log.i("AppStateHelper", "onAppStateChanged message=$state;activity=$activity")
    }
})
```
### 查询前后台状态
```kotlin
// App是否为前台状态
val isForeground = AppStateHelper.isForeground

// App 是否为后台状态
val isBackground = AppStateHelper.isBackground

// App 的状态
val appState = AppStateHelper.state
```

## 如何引入
  * `AppStateHelper`已经包含进入 CooBox, 快速集成 Coobox https://github.com/secoo-android/coobox


