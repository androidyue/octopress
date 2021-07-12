---
layout: post
title: "TransactionTooLargeException 问题分析与解决"
date: 2021-07-12 11:44
comments: true
categories: Android TransactionTooLargeException Exception Error 
---
在处理 App 崩溃时，有一种崩溃问题着实难以解决，甚至是令人挠头。比如像是今天将讨论的`TransactionTooLargeException`。下面就是该异常出现时的 stacktrace 信息。
```java
java.lang.RuntimeException: Adding window failed
at android.view.ViewRootImpl.setView(ViewRootImpl.java:548)
at android.view.WindowManagerImpl.addView(WindowManagerImpl.java:406)
at android.view.WindowManagerImpl.addView(WindowManagerImpl.java:320)
at android.view.WindowManagerImpl$CompatModeWrapper.addView(WindowManagerImpl.java:152)
at android.view.Window$LocalWindowManager.addView(Window.java:557)
at android.app.ActivityThread.handleResumeActivity(ActivityThread.java:2897)
at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2245)
at android.app.ActivityThread.access$600(ActivityThread.java:139)
at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1262)
at android.os.Handler.dispatchMessage(Handler.java:99)
at android.os.Looper.loop(Looper.java:154)
at android.app.ActivityThread.main(ActivityThread.java:4977)
at java.lang.reflect.Method.invokeNative(Native Method)
at java.lang.reflect.Method.invoke(Method.java:511)
at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:784)
at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:551)
at dalvik.system.NativeStart.main(Native Method)
Caused by: android.os.TransactionTooLargeException
at android.os.BinderProxy.transact(Native Method)
at android.view.IWindowSession$Stub$Proxy.add(IWindowSession.java:569)
at android.view.ViewRootImpl.setView(ViewRootImpl.java:538)
... 16 more
android.os.TransactionTooLargeException
at android.os.BinderProxy.transact(Native Method)
at android.view.IWindowSession$Stub$Proxy.add(IWindowSession.java:569)
at android.view.ViewRootImpl.setView(ViewRootImpl.java:538)
at android.view.WindowManagerImpl.addView(WindowManagerImpl.java:406)
at android.view.WindowManagerImpl.addView(WindowManagerImpl.java:320)
at android.view.WindowManagerImpl$CompatModeWrapper.addView(WindowManagerImpl.java:152)
at android.view.Window$LocalWindowManager.addView(Window.java:557)
at android.app.ActivityThread.handleResumeActivity(ActivityThread.java:2897)
at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2245)
at android.app.ActivityThread.access$600(ActivityThread.java:139)
at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1262)
at android.os.Handler.dispatchMessage(Handler.java:99)
at android.os.Looper.loop(Looper.java:154)
at android.app.ActivityThread.main(ActivityThread.java:4977)
at java.lang.reflect.Method.invokeNative(Native Method)
at java.lang.reflect.Method.invoke(Method.java:511)
at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:784)
at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:551)
at dalvik.system.NativeStart.main(Native Method)
```

在上面的 stacktrace 中 我们 没有找到任何应用相关的代码信息，这让解决这类问题变得更加棘手。

<!--more-->
## TransactionTooLargeException 是什么
  * 发生在 远程程序调用（remote procedure call）, 这个过程中，参数和返回值会以 `Parcel`存储 Binder 事务缓冲(transaction buffer)中，当参数和返回值过大，会发生该异常。
  * 目前的限制值是1 MB，超过这个值，就会出现该异常。
  * 避免`TransactionTooLargeException`的关键是确保 binder 事务尽可能的小。降低 Binder 事务的参数和 返回值的 大小。
  * 避免传递巨大的字符串数组和 Bitmap。
  * 举个例子，当实现一个服务时，可以通过限制 调用端频率和控制返回值结果（只返回或者分批次返回必要信息的方式）来进行处理。



## 收集崩溃现场数据，为复现提供依据
上面的 stacktrace 对我们解决问题没法提供帮助信息，想要复现就需要进行额外的现场数据收集。


一些有帮助的现场数据有

  * 崩溃前的轨迹（可能部分 崩溃收集SDK 默认支持）
  * 崩溃前的 最近 Activity 列表
  * 崩溃前的 最近 Fragment 列表
  * 崩溃前的 最近点击的视图id
  * 当前app所在的状态 前台后台
  * 其他等信息。


利用分析上面的信息，我们大概率是可以根据上面的信息复现崩溃场景。  


## 利器 TooLargeTool
  * 它是一个调试 `TransactionTooLargeException` 的工具
  * 它能够打印出关于 Bundle 的大小信息，便于调试发现问题
  * 地址是 [https://github.com/guardian/toolargetool](https://github.com/guardian/toolargetool)

### 集成使用
  * 这个库存放在 `mavenCentral()` 中
  * 在需要的模块下，增加`implementation 'com.gu.android:toolargetool:0.3.0'` 依赖
  * 在应用初始化的时候，比如`Application.onCreate`增加`TooLargeTool.startLogging(this);`
  * 使用`adb logcat -s TooLargeTool` 过滤除调试信息

如下为示例的调试信息
```java
D/TooLargeTool: MainActivity.onSaveInstanceState wrote: Bundle@200090398 contains 1 keys and measures 0.6 KB when serialized as a Parcel
                                                                        * android:viewHierarchyState = 0.6 KB
``` 

### TooLargeTool 原理

  * TooLargeTool 通过注册监听`Activity`和`Fragment` 的一些回调。
  * 利用`Activity`的`onActivitySaveInstanceState`和Fragment 的 `onFragmentSaveInstanceState` 两个方法记录 state 数据
  * 在`Activity`的`onActivityStopped`和`onActivityDestroyed` 进行分析数据并输出调试信息
  * 在 `Fragment` 的 `onFragmentStopped` 和 `onFragmentDestroyed` 进行分析数据并输出调试信息

#### Activity 相关的核心代码([ActivitySavedStateLogger.kt](https://github.com/guardian/toolargetool/blob/main/toolargetool/src/main/java/com/gu/toolargetool/ActivitySavedStateLogger.kt))
```kotlin
override fun onActivityDestroyed(activity: Activity) {
    logAndRemoveSavedState(activity)
}

override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
    if (isLogging) {
        savedStates[activity] = outState
    }
}

override fun onActivityStopped(activity: Activity) {
    logAndRemoveSavedState(activity)
}

private fun logAndRemoveSavedState(activity: Activity) {
    val savedState = savedStates.remove(activity)
    if (savedState != null) {
        try {
            val message = formatter.format(activity, savedState)
            logger.log(message)
        } catch (e: RuntimeException) {
            logger.logException(e)
        }
    }
}
```

#### Fragment 相关的核心代码([FragmentSavedStateLogger.kt](https://github.com/guardian/toolargetool/blob/main/toolargetool/src/main/java/com/gu/toolargetool/FragmentSavedStateLogger.kt))
```kotlin
override fun onFragmentSaveInstanceState(fm: FragmentManager, f: Fragment, outState: Bundle) {
    if (isLogging) {
        savedStates[f] = outState
    }
}

override fun onFragmentStopped(fm: FragmentManager, f: Fragment) {
    logAndRemoveSavedState(f, fm)
}

override fun onFragmentDestroyed(fm: FragmentManager, f: Fragment) {
    logAndRemoveSavedState(f, fm)
}

private fun logAndRemoveSavedState(f: Fragment, fm: FragmentManager) {
    val savedState = savedStates.remove(f)
    if (savedState != null) {
        try {
            val message = formatter.format(fm, f, savedState)
            logger.log(message)
        } catch (e: RuntimeException) {
            logger.logException(e)
        }

    }
}

```

## 锦上添花

  * 上面的TooLargeTool 仅仅实现了对于savedInstance 的处理
  * 对于常见的`startActivtity`没有进行处理，这里需要我们自行实现。

基础的检测 Intent 内容的方法

```kotlin
fun checkBigIntent(intent: Intent?, from: String?) {
    val bundle = intent?.extras ?: return
    debugRun {
        smartLog {
            "checkBigIntent from=$from;bundle=${TooLargeTool.bundleBreakdown(bundle).replace("\n", ";")}"
        }
    }
}
```

针对 基础 Activity 进行 `startActivity**` 进行 Intent 检测

```kotlin
open class DiagnosableActivity : AppCompatActivity() {

    /**
     * 用来对 startActivity/startActivityForResulst 进行 Intent 数据量进行记录
     */
    override fun startActivityForResult(intent: Intent?, requestCode: Int, options: Bundle?) {
        TooLargeToolProxy.checkBigIntent(intent, "Activity.startActivity*****")
        smartLog {
            "startActivityForResult intent=$intent;requestCode=$requestCode;options=$options"
        }
        super.startActivityForResult(intent, requestCode, options)
    }


}
```

针对 基础 Fragment 进行`startActivty`和`startActivityResult` 进行 Intent 检测
```kotlin
open class DiagnosableFragment: Fragment() {
    override fun startActivity(intent: Intent?, options: Bundle?) {
        TooLargeToolProxy.checkBigIntent(intent, "Fragment.startActivity")
        super.startActivity(intent, options)
    }

    override fun startActivityForResult(intent: Intent?, requestCode: Int, options: Bundle?) {
        TooLargeToolProxy.checkBigIntent(intent, "Fragment.startActivityForResult")
        super.startActivityForResult(intent, requestCode, options)
    }
}
```
实验后的日志输出效果如下
```bash
TooLargeToolProxy;checkBigIntent from=Fragment.startActivity;bundle=Bundle220059345 contains 1 keys and measures 1,048.7 KB when serialized as a Parcel;* extra = 1,048.6 KB
TooLargeToolProxy;checkBigIntent from=Activity.startActivity*****;bundle=Bundle63853878 contains 1 keys and measures 1,048.7 KB when serialized as a Parcel;* extra = 1,048.6 KB
```


## 真实案例
  * 我们使用了 `ViewPager2` 实现了一个直播列表，每一个直播占据一个整屏
  * 当我们滑动很多个直播后，应用发生了`TransactionTooLargeException`
  * 后利用`TooLargeTool`分析得到是`ViewPager2`的保存机制导致的。通过设置`ViewPager2`的`android:saveEnabled="false"`解决问题