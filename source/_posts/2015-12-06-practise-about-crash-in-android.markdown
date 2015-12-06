---
layout: post
title: "Android处理崩溃的一些实践"
date: 2015-12-06 22:47
comments: true
categories: Android  
---

对于任何程序来说，崩溃都是一件很难避免的事情，当然Android程序也不例外。在Android程序中，引起崩溃的多属于运行时异常或者错误，对于这些异常我们很难做到类似Checked Exception那样显式捕获，因而最终导致了程序崩溃。本文讲介绍一些如何处理崩溃的实践，比如收集崩溃的stacktrace，甚至如何避免出现程序已停止的对话框。
<!--more-->

##如何收集崩溃信息
收集崩溃信息，可以更好的修复问题，增强程序的稳定性。Android中的崩溃收集沿用了Java的收集机制，实现起来比较简单。

###1.实现UncaughtExceptionHandler
我们需要实现UncaughtExceptionHandler接口中的`uncaughtException`方法。该方法体中最常见的操作就是读取崩溃的stacktrace信息，然后上报到服务器数据便于开发者分析。实现代码如下：
```java
public class SimpleUncaughtExceptionHandler implements Thread.UncaughtExceptionHandler {
    private static final String LOGTAG = "SimpleUncaughtExceptionHandler";

    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
    	//读取stacktrace信息
        final Writer result = new StringWriter();
        final PrintWriter printWriter = new PrintWriter(result);
        ex.printStackTrace(printWriter);
        String errorReport = result.toString();
        Log.i(LOGTAG, "uncaughtException errorReport=" + errorReport);
    }
}
```
除此之外，还建议携带以下信息发送到服务器，帮助更快定位和重现问题。

  * 设备唯一ID（基于IMEI或者Android ID等），方便根据用户提供的id，查找崩溃的stacktrace
  * 设备语言与区域 方便重现
  * 应用的版本号 
  * 设备的系统版本
  * 设备类型，如平板，手机，TV等
  * 崩溃发生的时间等

###注册默认的异常处理
注册默认的异常处理就是最后的一步，很简单，通常建议放在Application的onCreate方法中进行。
```java
public class DroidApplication extends Application {
    private static final String LOGTAG = "DroidApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(LOGTAG, "onCreate");
        Thread.setDefaultUncaughtExceptionHandler(new SimpleUncaughtExceptionHandler());
    }
}
```

###验证
当我们刻意触发一个NullPointerException时，过滤日志`adb logcat | grep SimpleUncaughtExceptionHandler`类似如下信息，则说明成功了。
```java
I/SimpleUncaughtExceptionHandler(22469): uncaughtException errorReport=java.lang.NullPointerException
I/SimpleUncaughtExceptionHandler(22469):  at com.droidyue.avoidforceclosedemo.MainActivity.causeNPE(MainActivity.java:22)
I/SimpleUncaughtExceptionHandler(22469):  at com.droidyue.avoidforceclosedemo.MainActivity.onClick(MainActivity.java:29)
I/SimpleUncaughtExceptionHandler(22469):  at android.view.View.performClick(View.java:4470)
I/SimpleUncaughtExceptionHandler(22469):  at android.view.View$PerformClick.run(View.java:18593)
I/SimpleUncaughtExceptionHandler(22469):  at android.os.Handler.handleCallback(Handler.java:733)
I/SimpleUncaughtExceptionHandler(22469):  at android.os.Handler.dispatchMessage(Handler.java:95)
I/SimpleUncaughtExceptionHandler(22469):  at android.os.Looper.loop(Looper.java:157)
I/SimpleUncaughtExceptionHandler(22469):  at android.app.ActivityThread.main(ActivityThread.java:5867)
I/SimpleUncaughtExceptionHandler(22469):  at java.lang.reflect.Method.invokeNative(Native Method)
I/SimpleUncaughtExceptionHandler(22469):  at java.lang.reflect.Method.invoke(Method.java:515)
I/SimpleUncaughtExceptionHandler(22469):  at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:858)
I/SimpleUncaughtExceptionHandler(22469):  at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:674)
I/SimpleUncaughtExceptionHandler(22469):  at dalvik.system.NativeStart.main(Native Method)
```

##不出现应用崩溃对话框
在Android崩溃的时候，我们都会看到类似这样的对话框

![app crash](http://7jpolu.com1.z0.glb.clouddn.com/app_crash.png)

然而，实际上有些情况下是不需要展示这个对话框的，一个常用的例子，我的程序中一个不太重要的推送服务采用了单独的进程，当这个进程崩溃时，实际上是可以允许不让用户感知的。

如果我们采取主进程仍弹出对话框，其他进程不弹出的策略，那么我们的问题，可以总结成如下三个
  
  * 如何判断进程为主进程还是其他进程，或者某个进程
  * 如何在某些进程不弹出应用崩溃对话框
  * 如何在主进程弹出崩溃对话框

既然问题来了，我们就开动挖掘机深挖吧。

###进程判定
进行进程判定也比较容易，首先我们需要获得进程名
```java
public static String getProcessName(Context appContext) {
    String currentProcessName = "";
    int pid = android.os.Process.myPid();
    ActivityManager manager = (ActivityManager) appContext.getSystemService(Context.ACTIVITY_SERVICE);
    for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
        if (processInfo.pid == pid) {
            currentProcessName = processInfo.processName;
            break;
        }
    }
    return currentProcessName;
}
```
判断主进程，则对比进程名是否和报名相同即可
```java
mAppContext.getPackageName().equals(processName)
```
判断为某个进程，在mainifest这样这样声明
```java
<service android:name=".DroidService" android:process=":service"></service>
```
其对应的完整进程名为`com.droidyue.avoidforceclosedemo:service`，我们判断可以使用如下代码
```java
"com.droidyue.avoidforceclosedemo:service".equals(processName);
```

###不弹框的处理
不弹框的需要做的就是不调用Android默认的异常处理，当异常出现时，收集完信息，执行进程kill即可。
```java
android.os.Process.killProcess(android.os.Process.myPid());
```

###主进程保持弹窗的处理
想要保持弹窗也比较容易，就是调用Android默认的异常处理。

首先需要获得Android默认的异常处理，在设置自定的异常处理之前，将Android默认处理保存起来。如下是在自定义异常处理的构造方法中获取Android默认处理
```java
public DroidUncaughtExceptionHandler(Context context) {
    mAppContext = context.getApplicationContext();
    mDefaultExceptionHandler = Thread.getDefaultUncaughtExceptionHandler();
}
```
然后在异常处理方法uncaughtException中调用如下方法
```java
mDefaultExceptionHandler.uncaughtException(thread, ex);
```

注意，如果你的应用崩溃后，不调用Android默认的异常处理，也不进行杀死进程，则进程处于不可交互，即UI点击无响应状态。


##源码
本示例源码，存放在Github，地址为[AvoidForceCloseDemo](https://github.com/androidyue/AvoidForceCloseDemo)













