---
layout: post
title: "Gson NoClassDefFoundError 问题解决"
date: 2021-09-06 10:26
comments: true
categories: Gson Gradle Android 
---
最近升级了`gson`到 2.8.6(2.8.7)，结果发生了崩溃

```java
E AndroidRuntime: FATAL EXCEPTION: PushConnectivityManager
E AndroidRuntime: Process: io.rong.push, PID: 11278
E AndroidRuntime: java.lang.NoClassDefFoundError: Failed resolution of: Lcom/google/gson/Gson;
E AndroidRuntime: 	at io.rong.push.rongpush.RongPushCacheHelper.cacheRongPushIPs(RongPushCacheHelper.java:44)
E AndroidRuntime: 	at io.rong.push.core.PushNaviClient.connect(PushNaviClient.java:152)
E AndroidRuntime: 	at io.rong.push.core.PushNaviClient.connectToNavi(PushNaviClient.java:93)
E AndroidRuntime: 	at io.rong.push.core.PushNaviClient.getPushServerIPs(PushNaviClient.java:85)
E AndroidRuntime: 	at io.rong.push.rongpush.PushConnectivityManager.connectToNavi(PushConnectivityManager.java:398)
E AndroidRuntime: 	at io.rong.push.rongpush.PushConnectivityManager.access$200(PushConnectivityManager.java:34)
E AndroidRuntime: 	at io.rong.push.rongpush.PushConnectivityManager$DisconnectedState.processMessage(PushConnectivityManager.java:234)
E AndroidRuntime: 	at io.rong.push.common.stateMachine.StateMachine$SmHandler.processMsg(StateMachine.java:966)
E AndroidRuntime: 	at io.rong.push.common.stateMachine.StateMachine$SmHandler.handleMessage(StateMachine.java:789)
E AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:110)
E AndroidRuntime: 	at android.os.Looper.loop(Looper.java:219)
E AndroidRuntime: 	at android.os.HandlerThread.run(HandlerThread.java:67)
E AndroidRuntime: Caused by: java.lang.ClassNotFoundException: Didn't find class "com.google.gson.Gson" on path: DexPathList[[zip file "/data/app/com.xxxxx-GXNVWX-EHV4m1HU42XJIgw==/base.apk"],nativeLibraryDirectories=[/data/app/com.xxxxx-GXNVWX-EHV4m1HU42XJIgw==/lib/arm, /data/app/com.xxxxx-GXNVWX-EHV4m1HU42XJIgw==/base.apk!/lib/armeabi-v7a, /system/lib, /hw_product/lib]]
E AndroidRuntime: 	at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:209)
E AndroidRuntime: 	at java.lang.ClassLoader.loadClass(ClassLoader.java:379)
E AndroidRuntime: 	at java.lang.ClassLoader.loadClass(ClassLoader.java:312)
E AndroidRuntime: 	... 12 more
```

<!--more-->

## 解决方案

  * 升级到gradle 插件 到最新的版本即可。