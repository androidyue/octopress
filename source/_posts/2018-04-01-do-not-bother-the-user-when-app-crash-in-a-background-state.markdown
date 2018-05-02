---
layout: post
title: "Android中实现用户无感知处理后台崩溃"
date: 2018-04-01 22:29
comments: true
categories: Android 崩溃
---

正所谓，要想没有bug，就一行代码也不写。App到了用户的手里，肯定是崩溃越少越好。Android中的崩溃处理和iOS不太一样，iOS崩溃通常是闪退，而安卓会出现如下的蹩脚的对话框

![https://asset.droidyue.com/image/app_crash_v1.png](https://asset.droidyue.com/image/app_crash_v1.png)

当你的用户看到类似这样的崩溃对话框时，心中得到“这届程序员不行啊”的感慨也不足为奇。
<!--more-->

在安卓中，我们应用会有所谓的前台和后台的概念，在本文这里这样定义，当前应用有Activity展示（即用户明显感知在当前应用），约定为前台，否则为后台。

如果在前台时，发生崩溃用户是明显能感知的，但倘若发生在后台，我们可以做一些简单的小操作，让用户感知不到崩溃的发生（即不弹出崩溃的对话框）。

原理其实蛮简单的。

  * 检测是否为后台
  * 如果是后台则杀掉该进程，否则执行默认的崩溃处理

检测是否为后台，这里我们以进程中Activity的数量作为判断标准

  * 当activity onStart时activityCount自增
  * 当Activity onStop时activityCount自减
  * 当activityCount为0，我们则认为应用处于后台状态

具体实现如下
```java
object ActivityLifecycleCallbackImp: Application.ActivityLifecycleCallbacks {
   var activityCount: Int = 0
   override fun onActivityPaused(activity: Activity?) {
   }

   override fun onActivityResumed(activity: Activity?) {
   }

   override fun onActivityStarted(activity: Activity?) {
       activityCount ++
   }

   override fun onActivityDestroyed(activity: Activity?) {
   }

   override fun onActivitySaveInstanceState(activity: Activity?, outState: Bundle?) {
   }

   override fun onActivityStopped(activity: Activity?) {
       activityCount--
   }

   override fun onActivityCreated(activity: Activity?, savedInstanceState: Bundle?) {
   }
}

```

在Application中进行注册
```java
class MyApplication : Application() {
   override fun onCreate() {
       super.onCreate()
       registerActivityLifecycleCallbacks(ActivityLifecycleCallbackImp)
   }
}

```


剩下的就是设置一个自定义的未捕获异常处理处理器
```java
val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
Thread.setDefaultUncaughtExceptionHandler { thread, exception ->
   exception.printStackTrace()
   val isBackground = ActivityLifecycleCallbackImp.activityCount == 0
   if (isBackground) {
       Log.d("MyApplication", "isBackground just kill the process without annoying users")
       android.os.Process.killProcess(android.os.Process.myPid())
   } else {
       defaultHandler.uncaughtException(thread, exception)
   }
}
```

至此功能就基本实现了，相对之前硬邦邦的对话框，后台无干扰用户的默默杀掉进程要友好很多了。

关于崩溃的文章，我还有一篇相关的，请移步这里[Android处理崩溃的一些实践](https://droidyue.com/blog/2015/12/06/practise-about-crash-in-android/)查看。



