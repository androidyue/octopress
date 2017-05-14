---
layout: post
title: "一个简单实用的Android调试应用技巧"
date: 2017-05-14 20:37
comments: true
categories: Android
---

在应用开发中，我们常常会进行日志打印或者debug调试，以此来分析运行时的一些信息，便于发现bug和问题。Android Studio的Debug功能很好用，但是有时候有些情况下，就显得不是那么快捷和便利。
<!--more-->

比如

  * 我们调试的点在应用一打开的时候，很靠前，例如Application的onCreate方法中，以至于我们不能足够快的设置进程为debug模式
  * 虽然上面的情况可以通过Android Studio的debug运行来解决，但是如果项目很大的话，运行起来也会比较耽误时间

那么怎么解决上面的问题呢，其实只需要执行一行命令即可

```java
adb shell am set-debug-app -w com.example.jishuxiaoheiwu.appdebugsample
```  

其中

  * set-debug-app 用来应用为debug模式
  * -w 意思为wait，在进程启动的时候，等待debugger进行连接
  * `com.example.jishuxiaoheiwu.appdebugsample` 代表想要调试的应用的包名或ApplicationId

执行上面的命令，当我们再次启动目标应用时，会得到这样的画面

![Android Waiting For Debugger Dialog](http://7jpolu.com1.z0.glb.clouddn.com/android_waiting_for_debugger_dialog.png)  

然后，我们就会有足够的时间，来使用Run--> Attach Debugger to Android Process 来绑定进程debug。  绑定后对话框消失，下次启动就是正常的启动（没有上面的对话框了）


那么一次debug不一定能解决问题，多次调试则在所难免，那么每次都要执行这个命令么？

答案是可以，但是有更好的方式。即

```java
adb shell am set-debug-app -w --persistent  com.example.jishuxiaoheiwu.appdebugsample
```

上面的代码和之前有所不同，表现在一个--persistent

  * --persitent意思是持久的，意思是一直设置这个应用为调试模式，即每次开启（进程创建）都会弹出对话框，即使卸载再安装或者更新应用

如果多次debug完成后，解决了问题，想要恢复正常的启动也很简单
```java
 adb shell am clear-debug-app
```

这个调试的方法很简单，但是可能会节省我们很多的宝贵时间。希望可以帮助到各位开发同行。

另外，当你的开发中遇到效率问题时，你需要做出思考，发觉更快捷的工作方式，而不是为了调试Application中onCreate方法中的代码，每次都点击Android Studio的debug按钮。

