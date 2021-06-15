---
layout: post
title: "ClassNotFoundException 崩溃分析与解决"
date: 2021-06-15 11:33
comments: true
categories: Android ClassNotFoundException Java Kotlin 
---

最近有一次添加工具库，在`build.gradle` 中增加了依赖引用

```java
implementation('com.gu.android:toolargetool:0.3.0')
```

<!--more-->
当执编译并执行，应用崩溃了，尝试使用`adb logcat | grep AndroidRuntime` 得到如下的日志

```java
E AndroidRuntime: FATAL EXCEPTION: main
E AndroidRuntime: Process: com.xxxxx, PID: 20279
E AndroidRuntime: java.lang.RuntimeException: Unable to get provider androidx.lifecycle.ProcessLifecycleOwnerInitializer: java.lang.ClassNotFoundException: androidx.lifecycle.ProcessLifecycleOwnerInitializer
E AndroidRuntime: 	at android.app.ActivityThread.installProvider(ActivityThread.java:7945)
E AndroidRuntime: 	at android.app.ActivityThread.installContentProviders(ActivityThread.java:7481)
E AndroidRuntime: 	at android.app.ActivityThread.handleBindApplication(ActivityThread.java:7372)
E AndroidRuntime: 	at android.app.ActivityThread.access$2400(ActivityThread.java:251)
E AndroidRuntime: 	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2280)
E AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:110)
E AndroidRuntime: 	at android.os.Looper.loop(Looper.java:219)
E AndroidRuntime: 	at android.app.ActivityThread.main(ActivityThread.java:8387)
E AndroidRuntime: 	at java.lang.reflect.Method.invoke(Native Method)
E AndroidRuntime: 	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:513)
E AndroidRuntime: 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1055)
E AndroidRuntime: Caused by: java.lang.ClassNotFoundException: androidx.lifecycle.ProcessLifecycleOwnerInitializer
E AndroidRuntime: 	at java.lang.Class.classForName(Native Method)
E AndroidRuntime: 	at java.lang.Class.forName(Class.java:454)
E AndroidRuntime: 	at androidx.core.app.AppComponentFactory.instantiateProviderCompat(AppComponentFactory.java:204)
E AndroidRuntime: 	at androidx.core.app.AppComponentFactory.instantiateProvider(AppComponentFactory.java:83)
E AndroidRuntime: 	at android.app.ActivityThread.installProvider(ActivityThread.java:7929)
E AndroidRuntime: 	... 10 more
E AndroidRuntime: Caused by: java.lang.ClassNotFoundException: Didn't find class "androidx.lifecycle.ProcessLifecycleOwnerInitializer" on path: DexPathList[[zip file "/data/app/com.xxxxx-NSxAfmNEHDVlvqzppm3ddw==/base.apk"],nativeLibraryDirectories=[/data/app/com.xxxxx-NSxAfmNEHDVlvqzppm3ddw==/lib/arm, /data/app/com.xxxxx-NSxAfmNEHDVlvqzppm3ddw==/base.apk!/lib/armeabi-v7a, /system/lib, /hw_product/lib]]
E AndroidRuntime: 	at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:209)
E AndroidRuntime: 	at java.lang.ClassLoader.loadClass(ClassLoader.java:379)
E AndroidRuntime: 	at java.lang.ClassLoader.loadClass(ClassLoader.java:312)
E AndroidRuntime: 	... 15 more
```

网上的处理办法大概是

  * 清理缓存，重新编译  
  * 支持MultiDex 处理

然而，经过一顿猛如虎的操作，并没有解决问题。


## 分析与解决问题

为什么单独加一个`com.gu.android:toolargetool:0.3.0`就引起问题了呢，想要分析出原因，就要看看`toolargetool`包含了什么。

使用 gradlew 依赖查询导出依赖关系
```java
./gradlew app:dep > /tmp/app_dep.txt
```

查看生成的`app_dep.txt`文件，如下问部分内容
```java
 \--- com.gu.android:toolargetool:0.3.0
|              +--- androidx.appcompat:appcompat:1.2.0 (*)
|              \--- org.jetbrains.kotlin:kotlin-stdlib:1.4.20 (*)
```

我们可以发现`com.gu.android:toolargetool` 包含了这两个依赖

  * androidx.appcompat:appcompat
  * org.jetbrains.kotlin:kotlin-stdlib


### 初次排除依赖，失败
 我们先尝试排除`androidx.appcompat:appcompat`

```java
implementation('com.gu.android:toolargetool:0.3.0') {
        exclude module: "appcompat"
}
```

再次编译，运行，依然失败。


### 再接再厉，成功了
我们试一试排除`kotlin-stdlib`

```java
implementation('com.gu.android:toolargetool:0.3.0') {
	exclude module: "kotlin-stdlib"
}
```

编译通过，运行成功。

## 原因分析

  * `com.gu.android:toolargetool:0.3.0` 引入了 `org.jetbrains.kotlin:kotlin-stdlib:1.4.20`
  * 而`org.jetbrains.kotlin:kotlin-stdlib:1.4.20` 需要 Gradle 6.0及以上。
  * 而项目当前的 gradle 版本为 5.4.1





## 其他辅助内容

### 查看当前 gradle 的方法
```java
./gradlew --version

------------------------------------------------------------
Gradle 5.4.1
------------------------------------------------------------

Build time:   2019-04-26 08:14:42 UTC
Revision:     261d17164xxxxxxxx98a4c19d

Kotlin:       1.3.21
Groovy:       2.5.4
Ant:          Apache Ant(TM) version 1.9.13 compiled on July 10 2018
JVM:          1.8.0_281 (Oracle Corporation 25.281-b09)
OS:           Mac OS X 10.16 x86_64

```
